// Backend base: from index.html (same-origin)
const API_BASE = (window.API_BASE?.trim?.() || "").length
  ? window.API_BASE
  : window.location.origin;

const $ = (id) => document.getElementById(id);
const fmtMoney = (n) => `$${Number(n).toLocaleString()}/mo`;

// Random coords (no real lat/lng yet)
function randomCoord() {
  const lat = (Math.random() * 120) - 60;   // -60..60
  const lng = (Math.random() * 360) - 180;  // -180..180
  return { lat, lng };
}

// Call backend
async function fetchMatches(body) {
  const res = await fetch(`${API_BASE}/api/match`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} — ${txt}`);
  }
  return res.json();
}

// Build one card
function card(item, onMap) {
  const c = document.createElement("article");
  c.className = "card";

  const left = document.createElement("div");
  left.className = "card-left";
  left.innerHTML = `<div class="img-skel"></div>`;

  const right = document.createElement("div");
  right.className = "card-right";

  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = item.title || "This listing";

  const compat = document.createElement("div");
  compat.className = "compat-badge";
  compat.textContent = `${item.compatibility}%`;

  header.appendChild(title);
  header.appendChild(compat);

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `
    <div class="price">${fmtMoney(item.price)}</div>
    <div class="bullets">
      <span class="bullet">Pet Friendly</span>
      <span class="bullet">Quiet Area</span>
      <span class="bullet">Direct Owner</span>
    </div>
  `;

  const reason = document.createElement("p");
  reason.className = "reason";
  reason.textContent = item.rationale;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const contact = document.createElement("button");
  contact.className = "btn secondary";
  contact.type = "button";
  contact.textContent = "Contact";

  const viewMap = document.createElement("button");
  viewMap.className = "btn primary";
  viewMap.type = "button";
  viewMap.textContent = "View on Map";
  viewMap.addEventListener("click", () => onMap(item));

  actions.appendChild(contact);
  actions.appendChild(viewMap);

  right.appendChild(header);
  right.appendChild(meta);
  right.appendChild(reason);
  right.appendChild(actions);

  c.appendChild(left);
  c.appendChild(right);
  return c;
}

// Map modal
let map, marker;
function openMap(item) {
  if (typeof L === "undefined") {
    alert("Map library failed to load. Check your internet connection and reload.");
    return;
  }

  $("modal").classList.remove("hidden");
  $("modalTitle").textContent = item.title || "This listing";
  $("compat").textContent = `Compatibility: ${item.compatibility}%`;

  // Ensure Leaflet initializes after modal is visible
  setTimeout(() => {
    if (!map) {
      map = L.map("map");
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
    }
    const { lat, lng } = randomCoord();
    map.setView([lat, lng], 3);
    if (marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`${item.title || "This listing"}<br/>${item.compatibility}% match`)
      .openPopup();
  }, 0);
}
function closeMap() { $("modal").classList.add("hidden"); }
$("closeModal").addEventListener("click", closeMap);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMap(); });
window.addEventListener("click", (e) => { if (e.target.id === "modal") closeMap(); });

// Search workflow
$("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = $("query").value.trim();
  const budgetMin = $("budgetMin").value ? Number($("budgetMin").value) : null;
  const budgetMax = $("budgetMax").value ? Number($("budgetMax").value) : null;

  if (!query) {
    $("status").textContent = "Please enter a prompt.";
    return;
  }

  $("status").textContent = "Finding your best matches…";
  $("results").innerHTML = "";

  try {
    const resp = await fetchMatches({
      query,
      prefs: { budget_min: budgetMin, budget_max: budgetMax, amenities: [] },
      topn: 12,
      use_vectors: true
    });

    if (!resp.results?.length) {
      $("status").textContent = "No options reached the compatibility threshold.";
      return;
    }

    $("status").textContent = `Showing ${resp.results.length} matches (≥ threshold).`;

    const frag = document.createDocumentFragment();
    resp.results.forEach(item => frag.appendChild(card(item, openMap)));
    $("results").appendChild(frag);
  } catch (err) {
    console.error(err);
    $("status").textContent = `Request failed: ${err.message}`;
  }
});

// Convenience default
$("query").value = "quiet, pet friendly, close to campus gym";
console.log("API_BASE =", API_BASE);