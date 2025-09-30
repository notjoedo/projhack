// ===== CONFIG =====
const API_BASE = window.location.origin;
const CENTER = { longitude: -80.4139, latitude: 37.2296, zoom: 12 };
const INITIAL_QUERY = "quiet, pet friendly, close to campus gym";

// ===== STATE =====
let deckgl;
let lastPayload = null;
let top3Visible = true;

// ===== HELPERS =====
const $ = (id) => document.getElementById(id);
const fmtMoney = (n) => `$${Number(n).toLocaleString()}/mo`;

function norm(v, min, max) { const s=Math.max(1e-9,max-min); return Math.min(1, Math.max(0,(v-min)/s)); }
function colorRamp01(t){
  const c=[[59,130,246],[16,185,129],[245,158,11],[239,68,68]];
  const n=c.length-1, x=Math.max(0,Math.min(n,t*n)), i=Math.floor(x), f=x-i;
  const a=c[i], b=c[Math.min(n,i+1)];
  return [Math.round(a[0]+(b[0]-a[0])*f),Math.round(a[1]+(b[1]-a[1])*f),Math.round(a[2]+(b[2]-a[2])*f),200];
}
function metricInfo(topic){ switch((topic||"").toLowerCase()){case"price":return{key:"price_avg",label:"price_avg"};case"safety":return{key:"safety_avg",label:"safety_avg"};case"compat":return{key:"compat_max",label:"compat_max"};case"count":return{key:"count",label:"count"};default:return{key:"price_avg",label:"price_avg"}}}

// ===== MAP LAYERS =====
function toOSMTileLayer(){
  const {TileLayer, BitmapLayer}=deck; const sub=["a","b","c"];
  return new TileLayer({
    data:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    minZoom:0,maxZoom:19,tileSize:256,
    getTileData:({x,y,z})=>Promise.resolve(`https://${sub[(x+y+z)%3]}.tile.openstreetmap.org/${z}/${x}/${y}.png`),
    renderSubLayers: p => {
      const {bbox:{west,south,east,north}, data:url}=p; if(!url) return null;
      return new BitmapLayer(p,{image:url,bounds:[west,south,east,north]});
    }
  });
}
function h3Layer(hexes, topic){
  const {H3HexagonLayer}=deck; const {key,label}=metricInfo(topic); $("#metricName").textContent=label;
  let min=Infinity,max=-Infinity; for(const h of hexes){ const v=Number(h[key]); if(isFinite(v)){ if(v<min)min=v; if(v>max)max=v; } }
  if(!isFinite(min)||!isFinite(max)||min===max){min=0;max=1;}
  return new H3HexagonLayer({
    id:'h3-heat', data:hexes, pickable:true, filled:true, extruded:false, coverage:1,
    getHexagon:d=>d.h3,
    getFillColor:d=>colorRamp01(norm(Number(d[key]??0),min,max)),
    opacity:.85,
    onHover:i=>{ if(i.object){ deckgl.setProps({getTooltip:()=>({text:`${label}: ${i.object[key]}
price_avg: ${i.object.price_avg}
safety_avg: ${i.object.safety_avg}
compat_max: ${i.object.compat_max}
count: ${i.object.count}`})}); } }
  });
}
function top3Layer(results, show=true){
  const {ScatterplotLayer, TextLayer}=deck; if(!show || !results?.length) return [];
  const top3 = results.slice(0,3).map((r,i)=>{ const s=String(r.listing_id); let h=2166136261; for(let j=0;j<s.length;j++){h^=s.charCodeAt(j); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);} const lat=37.2296+(((h%121)-60)/1000); const lng=-80.4139+((((h>>>5)%121)-60)/1000); return {...r,lat,lng,rank:i+1}; });
  const scatter=new ScatterplotLayer({id:'top3',data:top3,pickable:true,getPosition:d=>[d.lng,d.lat],getRadius:80,radiusMinPixels:8,
    getFillColor:d=>{const p=Number(d.compatibility||0); if(p>=85)return[16,185,129,220]; if(p>=70)return[132,204,22,220]; if(p>=60)return[245,158,11,220]; return[239,68,68,220];},
    getLineColor:[255,255,255,230], lineWidthMinPixels:2});
  const labels=new TextLayer({id:'top3-labels',data:top3,getPosition:d=>[d.lng,d.lat],getText:d=>`${d.compatibility}%`,getSize:14,getColor:[255,255,255,255],getTextAnchor:'middle',getAlignmentBaseline:'center',background:true,getBackgroundColor:[17,24,39,220],backgroundPadding:[4,6]});
  return [scatter,labels];
}
function renderMap(hexes=[], results=[], topic=''){ deckgl.setProps({ layers:[toOSMTileLayer(), h3Layer(hexes,topic), ...top3Layer(results, top3Visible)]}); }

// ===== RESULTS LIST & CONTACT =====
async function composeContactFromCard(card){
  const title = card.querySelector('.card-title')?.textContent || 'This listing';
  const price = (card.dataset && card.dataset.price!=null) ? Number(card.dataset.price) : null;
  const compat = (card.dataset && card.dataset.compat!=null) ? Number(card.dataset.compat) : 0;
  const rationale = card.querySelector('.reason')?.textContent || '';
  const userPrompt = $('#query')?.value || '';

  const modal = $('#contactModal'); modal.style.display='flex';
  $('#contactStatus').textContent = 'Generating…'; $('#contactText').value='';

  try{
    const r = await fetch(`${API_BASE}/api/contact/compose`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ user_prompt:userPrompt, title, price, compatibility:compat, rationale })
    });
    const j = await r.json();
    $('#contactText').value = j.message || '(empty)';
    $('#contactStatus').textContent = 'Ready';
  }catch(err){
    console.error('compose error', err);
    $('#contactText').value = `Hi — I’m interested in ${title}${price?` around $${price}/mo`:''}. Is it available? Thanks!`;
    $('#contactStatus').textContent = 'Ready (fallback)';
  }
}
function wireContactModal(){
  $('#closeContact').onclick=()=>($('#contactModal').style.display='none');
  $('#btnCopy').onclick=async()=>{ await navigator.clipboard.writeText($('#contactText').value); $('#contactStatus').textContent='Copied!'; setTimeout(()=>$('#contactStatus').textContent='Ready',900); };
  $('#btnCasual').onclick=async()=>{ $('#contactStatus').textContent='Rewriting…'; const r=await fetch(`${API_BASE}/api/contact/rewrite`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:$('#contactText').value,mode:'casual'})}); const j=await r.json(); $('#contactText').value=j.message||$('#contactText').value; $('#contactStatus').textContent='Ready'; };
  $('#btnShorter').onclick=async()=>{ $('#contactStatus').textContent='Rewriting…'; const r=await fetch(`${API_BASE}/api/contact/rewrite`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:$('#contactText').value,mode:'shorter'})}); const j=await r.json(); $('#contactText').value=j.message||$('#contactText').value; $('#contactStatus').textContent='Ready'; };
}
function tag(text){ const el=document.createElement("span"); el.className="bullet"; el.textContent=text; return el; }

function card(item){
  const c=document.createElement("article"); c.className="card"; c.dataset.price=item.price??''; c.dataset.compat=item.compatibility??0;

  const left=document.createElement("div"); left.className="img-skel";
  const right=document.createElement("div"); right.className="card-right";

  const header=document.createElement("div"); header.className="card-header";
  const title=document.createElement("h3"); title.className="card-title"; title.textContent=item.title||"This listing";
  const compat=document.createElement("div"); compat.className="compat-badge"; compat.textContent=`${item.compatibility || Math.round((item.score||0)*100)}%`;
  header.appendChild(title); header.appendChild(compat);

  const meta=document.createElement("div"); meta.className="card-meta";
  meta.innerHTML=`<div class="price">${fmtMoney(item.price||0)}</div>`;
  const bullets=document.createElement("div"); bullets.className="bullets";
  bullets.appendChild(tag("Pet Friendly")); bullets.appendChild(tag("Quiet Area")); bullets.appendChild(tag("Direct Owner"));
  meta.appendChild(bullets);

  const reason=document.createElement("p"); reason.className="reason"; reason.textContent=item.rationale||"Good overall fit.";

  const actions=document.createElement("div"); actions.className="card-actions";

  const contact=document.createElement("button");
  contact.className="btn"; // no reliance on class selector for click
  contact.type="button"; contact.textContent="Contact";
  // DIRECT click handler (bypasses any delegated listener issues)
  contact.addEventListener("click", () => composeContactFromCard(c));

  const view=document.createElement("button");
  view.className="btn primary"; view.type="button"; view.textContent="View on Map";
  view.addEventListener("click", () => {
    const s=String(item.listing_id); let h=2166136261; for(let j=0;j<s.length;j++){h^=s.charCodeAt(j); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    const lat=37.2296+(((h%121)-60)/1000); const lng=-80.4139+((((h>>>5)%121)-60)/1000);
    deckgl.setProps({ initialViewState:{ longitude:lng, latitude:lat, zoom:14, transitionDuration:600 } });
  });

  actions.appendChild(contact); actions.appendChild(view);

  right.appendChild(header); right.appendChild(meta); right.appendChild(reason); right.appendChild(actions);
  c.appendChild(left); c.appendChild(right);
  return c;
}
function renderResults(list){ const cont=$("#results"); cont.innerHTML=""; const frag=document.createDocumentFragment(); (list||[]).forEach(i=>frag.appendChild(card(i))); cont.appendChild(frag); }

// ===== QUERY =====
async function runQuery(){
  const topic=$("#topic").value; $("#status").textContent="Finding your best matches…";
  const body={ query: $("#query").value.trim() || INITIAL_QUERY, prefs:{}, topn:12, use_vectors:true, h3_res:8 };
  if (topic) body.heatmap = topic;

  const res = await fetch(`${API_BASE}/api/match`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  if (!res.ok) { $("#status").textContent=`Request failed (${res.status}).`; return; }
  const data = await res.json(); lastPayload=data;
  $("#status").textContent=`Showing ${data.results?.length || 0} matches (≥ threshold).`;
  renderResults(data.results || []); renderMap(data.hexes || [], data.results || [], topic);
}

// ===== INIT =====
$("#query").value = INITIAL_QUERY;
deckgl = new deck.DeckGL({ container:"app", initialViewState:CENTER, controller:true });
$("#run").addEventListener("click", runQuery);
$("#toggleTop3").addEventListener("click", () => { top3Visible=!top3Visible; const topic=$("#topic").value; if(lastPayload) renderMap(lastPayload.hexes||[], lastPayload.results||[], topic); });
wireContactModal();
runQuery();

console.log("app.js ready @", new Date().toISOString());