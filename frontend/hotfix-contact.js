// hotfix-contact.js
(function () {
  const API_BASE = location.origin;
  const $ = (id) => document.getElementById(id);

  // 1) Prove JS is loaded
  console.log("[hotfix] loaded @", new Date().toISOString());

  // 2) Ensure runQuery exists; if not, create a minimal fetch to render something
  if (typeof window.runQuery !== "function") {
    console.warn("[hotfix] window.runQuery missing; installing minimal runner");
    window.runQuery = async function () {
      const body = {
        query: ($("#query")?.value || "quiet, pet friendly, close to campus gym"),
        prefs: {},
        topn: 12,
        use_vectors: true,
        h3_res: 8
      };
      try {
        const res = await fetch(`${API_BASE}/api/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log("[hotfix] match results:", data.results?.length || 0);

        // if your app.js has renderResults / renderMap, call them:
        if (typeof window.renderResults === "function") {
          window.renderResults(data.results || []);
        }
        if (typeof window.renderMap === "function") {
          window.renderMap(data.hexes || [], data.results || [], $("#topic")?.value || "");
        }
        const status = $("#status");
        if (status) status.textContent = `Showing ${data.results?.length || 0} matches (≥ threshold).`;
      } catch (e) {
        console.error("[hotfix] runQuery failed", e);
        const status = $("#status");
        if (status) status.textContent = "Request failed. Check the API server.";
      }
    };
  }

  // 3) Auto-run once (guarantee a search happens)
  try {
    setTimeout(() => { window.runQuery?.(); }, 250);
  } catch (e) {
    console.error("[hotfix] auto runQuery error", e);
  }

  // 4) Ensure a contact modal exists
  if (!$('#contactModal')) {
    const div = document.createElement('div');
    div.id = 'contactModal';
    div.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.4);display:none;align-items:center;justify-content:center;z-index:99999;padding:16px;';
    div.innerHTML = `
      <div style="background:#fff;max-width:640px;width:100%;border-radius:12px;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,.25)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <h3 style="margin:0;font:600 16px system-ui">Message to the owner</h3>
          <button id="closeContact" style="border:none;background:#eee;border-radius:6px;padding:4px 8px">×</button>
        </div>
        <div id="contactStatus" style="color:#6b7280;margin-bottom:8px">Generating…</div>
        <textarea id="contactText" rows="8" style="width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:8px;padding:8px" placeholder="Your message will appear here…"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="btnCasual">Make it casual</button>
          <button id="btnShorter">Make it shorter</button>
          <button id="btnCopy">Copy</button>
        </div>
      </div>`;
    document.body.appendChild(div);

    $('#closeContact').onclick=()=>div.style.display='none';
    $('#btnCopy').onclick=async()=>{await navigator.clipboard.writeText($('#contactText').value); $('#contactStatus').textContent='Copied!'; setTimeout(()=>$('#contactStatus').textContent='Ready',900);};
    $('#btnCasual').onclick=async()=>{ $('#contactStatus').textContent='Rewriting…'; const r=await fetch(`${API_BASE}/api/contact/rewrite`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:$('#contactText').value,mode:'casual'})}); const j=await r.json(); $('#contactText').value=j.message||$('#contactText').value; $('#contactStatus').textContent='Ready'; };
    $('#btnShorter').onclick=async()=>{ $('#contactStatus').textContent='Rewriting…'; const r=await fetch(`${API_BASE}/api/contact/rewrite`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:$('#contactText').value,mode:'shorter'})}); const j=await r.json(); $('#contactText').value=j.message||$('#contactText').value; $('#contactStatus').textContent='Ready'; };
  }

  // 5) Delegated click handler (works even for dynamically created cards)
  async function composeFrom(card){
    const title = card.querySelector('.card-title')?.textContent || 'This listing';
    const price = Number(card.dataset?.price ?? 0) || null;
    const compat = Number(card.dataset?.compat ?? 0) || 0;
    const rationale = card.querySelector('.reason')?.textContent || '';
    const userPrompt = document.getElementById('query')?.value || '';

    const modal = document.getElementById('contactModal');
    modal.style.display='flex';
    document.getElementById('contactStatus').textContent='Generating…';
    document.getElementById('contactText').value='';

    try{
      const r = await fetch(`${API_BASE}/api/contact/compose`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({user_prompt:userPrompt,title,price,compatibility:compat,rationale})
      });
      const j = await r.json();
      document.getElementById('contactText').value = j.message || '(empty)';
      document.getElementById('contactStatus').textContent='Ready';
    }catch(e){
      console.error("[hotfix] compose error", e);
      document.getElementById('contactText').value = `Hi — I’m interested in ${title}${price?` around $${price}/mo`:''}. Is it available? Thanks!`;
      document.getElementById('contactStatus').textContent='Ready (fallback)';
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.contact-btn') ||
                (e.target.closest('button') && /contact/i.test(e.target.closest('button').textContent||''));
    if (!btn) return;
    const card = btn.closest('.card');
    if (card) composeFrom(card);
  });

  // 6) Debug helpers in Console (optional)
  window.__hotfix = {
    buttons: () => document.querySelectorAll('.contact-btn').length,
    modal: () => !!document.getElementById('contactModal'),
    clickFirst: () => { const b = document.querySelector('.contact-btn'); if (b) b.click(); else console.warn("no contact button found"); },
  };

  console.log("[hotfix] contact wiring ready ✅");
})();