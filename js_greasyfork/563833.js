// ==UserScript==
// @name         R4G3RUNN3R's Recruitment Agency
// @namespace    r4g3runn3r.recruitment.agency
// @version      1.5.9
// @description  Recruitment Agency for Torn. Fully restored Bible logic with guaranteed UI stability.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563833/R4G3RUNN3R%27s%20Recruitment%20Agency.user.js
// @updateURL https://update.greasyfork.org/scripts/563833/R4G3RUNN3R%27s%20Recruitment%20Agency.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* -----------------------------
     CONFIG & STATE
  ----------------------------- */
  const THREAD_ID = 15907925;
  const FORUM_F = 46;
  const PAGE_SIZE = 20;
  const DB_NAME = "tornWorkerDB";
  const REQUIRED_DB_VERSION = 4;
  const BOOTSTRAP_DELAY_MS = 1100;
  const ACTIVITY_THRESHOLD_MS = 20 * 60 * 1000;

  const COMPANY_OPTIONS = [
    { value: "", label: "Any" }, { value: "adult_novelties", label: "Adult Novelties" }, { value: "amusement_park", label: "Amusement Park" },
    { value: "candle_shop", label: "Candle Shop" }, { value: "car_dealership", label: "Car Dealership" },
    { value: "clothing_store", label: "Clothing Store" }, { value: "cruise_line", label: "Cruise Line" },
    { value: "cyber_cafe", label: "Cyber Cafe" }, { value: "detective_agency", label: "Detective Agency" },
    { value: "farm", label: "Farm" }, { value: "firework_stand", label: "Firework Stand" },
    { value: "fitness_center", label: "Fitness Center" }, { value: "flower_shop", label: "Flower Shop" },
    { value: "furniture_store", label: "Furniture Store" }, { value: "game_shop", label: "Game Shop" },
    { value: "gas_station", label: "Gas Station" }, { value: "gents_strip_club", label: "Gentleman's Club" },
    { value: "grocery_store", label: "Grocery Store" }, { value: "gun_shop", label: "Gun Shop" },
    { value: "hair_salon", label: "Hair Salon" }, { value: "ladies_strip_club", label: "Ladies Strip Club" },
    { value: "law_firm", label: "Law Firm" }, { value: "lingerie_store", label: "Lingerie Store" },
    { value: "logistics_management", label: "Logistics Management" }, { value: "meat_warehouse", label: "Meat Warehouse" },
    { value: "mechanic_shop", label: "Mechanic Shop" }, { value: "mining_corporation", label: "Mining Corporation" },
    { value: "music_store", label: "Music Store" }, { value: "nightclub", label: "Nightclub" },
    { value: "oil_rig", label: "Oil Rig" }, { value: "private_security_firm", label: "Private Security Firm (PSF)" },
    { value: "property_broker", label: "Property Broker" }, { value: "pub", label: "Pub" },
    { value: "restaurant", label: "Restaurant" }, { value: "software_corporation", label: "Software Corporation" },
    { value: "sweet_shop", label: "Sweet Shop" }, { value: "television_network", label: "Television Network" },
    { value: "theater", label: "Theater" }, { value: "toy_shop", label: "Toy Shop" },
    { value: "travel_agency", label: "Travel Agency" }, { value: "wedding_chapel", label: "Wedding Chapel" },
    { value: "zoo", label: "Zoo" }
  ];

  let db = null;
  let dbReady = false;
  let scanRunning = false;
  let currentSearchPage = 1;
  let filteredResultsCache = [];

  /* -----------------------------
     DOM SENTINEL & UI
  ----------------------------- */
  function ensureUI() {
    if (!document.getElementById("ra-panel")) injectPanel();
    if (!document.getElementById("ra-float-wrap")) ensureFloatingButton();
  }

  const observer = new MutationObserver(() => ensureUI());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  function togglePanel() {
    const p = document.getElementById("ra-panel");
    if (p) p.style.display = (p.style.display === "none") ? "block" : "none";
  }

  function injectStyles() {
    if (document.getElementById("ra-styles")) return;
    const s = document.createElement("style"); s.id = "ra-styles";
    s.textContent = `
      #ra-float-wrap{ position:fixed; right:14px; top:50%; transform:translateY(-50%); z-index:2147483647; width:140px; }
      #ra-float-btn{ background:rgba(34,197,94,0.95); color:#fff; border:2px solid rgba(255,255,255,0.4); padding:10px 14px; border-radius:12px; cursor:pointer; font-weight:900; box-shadow:0 8px 32px rgba(34,197,94,0.4); animation: ra-pulse 2s infinite; width:100%; margin-bottom:8px; }
      #ra-nuke-btn{ width:100%; background:linear-gradient(to bottom, #7f1d1d, #b91c1c); color:#fff; border:1px solid #444; border-radius:8px; padding:5px; font-size:10px; cursor:pointer; font-weight:900; text-align:center; }
      @keyframes ra-pulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(34,197,94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94, 0); } }
      #ra-panel{ position:fixed; z-index:2147483646; background:rgba(14,16,20,0.96); border:1px solid rgba(255,255,255,0.14); border-radius:14px; width:440px; color:#f3f4f6; font-family: sans-serif; box-shadow:0 14px 40px rgba(0,0,0,0.45); resize: both !important; overflow: hidden !important; min-width:360px; min-height:260px; display:none; top: 100px; left: 100px; }
      .ra-header{ background:rgba(18,20,26,0.98); padding:10px 12px; cursor:move; display:flex; justify-content:space-between; }
      .ra-inner{ padding:12px; height: calc(100% - 52px); overflow-y:auto; }
      .ra-card{ border:1px solid rgba(255,255,255,0.12); padding:10px; border-radius:12px; margin-bottom:8px; background:rgba(0,0,0,0.18); }
      .ra-card-grid{ display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
      .ra-k{ font-size:10px; color:#9ca3af; font-weight:900; }
      .ra-v{ font-size:11px; font-weight:900; }
      .ra-tag{ font-size:10px; padding:3px 8px; border-radius:999px; }
      .ra-tag-green{ background:rgba(34,197,94,0.2); color:#4ade80; }
      .ra-tag-amber{ background:rgba(245,158,11,0.2); color:#fbbf24; }
      .ra-btn{ padding:8px 10px; border-radius:8px; border:1px solid #444; background:#222; color:#fff; cursor:pointer; font-weight:800; }
      .ra-primary{ border-color: #22c55e; }
      .ra-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
      .ra-field label{ display:block; font-size:11px; font-weight:900; margin-bottom:4px; }
      .ra-field input, .ra-field select{ width:100%; padding:6px; background:#000; color:#fff; border:1px solid #444; border-radius:6px; }
      .ra-fill{ height:100%; background:#22c55e; width:0%; transition: width 0.3s; }
      .ra-hr{ border:0; border-top:1px solid #333; margin:15px 0; }
    `;
    document.head.appendChild(s);
  }

  function injectPanel() {
    if (document.getElementById("ra-panel")) return;
    const p = document.createElement("div"); p.id = "ra-panel";
    p.innerHTML = `
      <div class="ra-header" id="ra-drag">
        <div class="ra-title">Recruitment Agency v1.5.9</div>
        <div class="ra-headbtns"><button class="ra-btn" style="padding:2px 8px;" id="ra-min-p">▁</button><button class="ra-btn" style="padding:2px 8px;" id="ra-close-p">✕</button></div>
      </div>
      <div class="ra-inner">
        <div class="ra-toprow" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><div id="ra-status">Loading DB...</div><button id="ra-gear" style="background:none; border:none; color:#fff; cursor:pointer;">⚙</button></div>
        <div id="ra-settings" style="display:none; padding:10px; background:rgba(0,0,0,0.2); border-radius:10px; margin-bottom:10px; border:1px solid #444;">
            <label><input type="checkbox" id="ra-set-inactive"> Include inactive</label>
            <button class="ra-btn" id="ra-settings-close">Close</button>
        </div>
        <div id="ra-progress" style="display:none; margin-bottom:10px;"><div style="height:8px; background:#333; border-radius:4px; overflow:hidden;"><div id="ra-fill" class="ra-fill"></div></div><div id="ra-progline" style="font-size:10px; text-align:center; color:#9ca3af; margin-top:4px;">0%</div></div>
        <div class="ra-actions"><button class="ra-btn ra-primary" id="ra-do-scan">First Scan</button><button class="ra-btn ra-primary" id="ra-do-update" style="display:none;">Update DB</button></div>
        <hr class="ra-hr">
        <div class="ra-grid">
          <div class="ra-field" style="grid-column: span 2;"><label class="ra-k">👤 NAME / ID</label><input type="text" id="ra-name-search"></div>
          <div class="ra-field"><label class="ra-k">💪 MAN≥</label><input type="number" id="ra-man"></div>
          <div class="ra-field"><label class="ra-k">🧠 INT≥</label><input type="number" id="ra-int"></div>
          <div class="ra-field"><label class="ra-k">🔋 END≥</label><input type="number" id="ra-end"></div>
          <div class="ra-field"><label class="ra-k">📈 TOTAL≥</label><input type="number" id="ra-total-min"></div>
          <div class="ra-field" style="grid-column: span 2;"><label class="ra-k">🏢 COMPANY</label><select id="ra-company"></select></div>
        </div>
        <div class="ra-actions"><button class="ra-btn ra-primary" id="ra-do-search" style="width:100%;">🔍 Search</button></div>
        <div id="ra-results" style="margin-top:15px;"></div>
      </div>`;
    document.body.appendChild(p);
    const sel = p.querySelector("#ra-company");
    COMPANY_OPTIONS.forEach(opt => { const o = document.createElement("option"); o.value = opt.value; o.textContent = opt.label; sel.appendChild(o); });
    
    p.querySelector("#ra-close-p").onclick = togglePanel;
    p.querySelector("#ra-min-p").onclick = () => p.classList.toggle("ra-minimized");
    p.querySelector("#ra-gear").onclick = () => { const s = p.querySelector("#ra-settings"); s.style.display = s.style.display === "none" ? "block" : "none"; };
    p.querySelector("#ra-settings-close").onclick = () => { p.querySelector("#ra-settings").style.display = "none"; };
    p.querySelector("#ra-do-scan").onclick = () => runScan(true);
    p.querySelector("#ra-do-update").onclick = () => runScan(false);
    p.querySelector("#ra-do-search").onclick = () => runSearch(true);

    makeDraggable(p, p.querySelector("#ra-drag"));
  }

  function ensureFloatingButton() {
    if (document.getElementById("ra-float-wrap")) return;
    const w = document.createElement("div"); w.id = "ra-float-wrap";
    w.innerHTML = `<button id="ra-float-btn">🔍 Worker Search</button><button id="ra-nuke-btn">☢ HARD PURGE</button>`;
    w.querySelector("#ra-float-btn").addEventListener("click", togglePanel);
    w.querySelector("#ra-nuke-btn").addEventListener("click", async () => {
      if (confirm("☢ HARD PURGE?\nThis deletes all data and resets the script.") && prompt("Type 'NUKE IT':") === "NUKE IT") {
        if (db) db.close(); await indexedDB.deleteDatabase(DB_NAME); location.reload();
      }
    });
    document.body.appendChild(w);
  }

  /* -----------------------------
     DB & LOGIC
  ----------------------------- */
  async function openDBSmart() {
    return new Promise((res) => {
      const req = indexedDB.open(DB_NAME, REQUIRED_DB_VERSION);
      req.onupgradeneeded = (e) => {
        const _db = e.target.result;
        if (!_db.objectStoreNames.contains("users")) _db.createObjectStore("users", { keyPath: "userId" });
        if (!_db.objectStoreNames.contains("meta")) _db.createObjectStore("meta", { keyPath: "key" });
      };
      req.onsuccess = () => res(req.result);
    });
  }

  const idb = {
    get: (s, k) => new Promise(r => { const tx = db.transaction(s).objectStore(s); const req = tx.get(k); req.onsuccess = () => r(req.result); }),
    put: (s, v) => new Promise(r => { const tx = db.transaction(s, "readwrite").objectStore(s); const req = tx.put(v); req.onsuccess = () => r(true); }),
    getAll: (s) => new Promise(r => { const tx = db.transaction(s).objectStore(s); const req = tx.getAll(); req.onsuccess = () => r(req.result || []); })
  };

  async function runScan(full = true) {
    if (!dbReady || scanRunning) return;
    scanRunning = true;
    try {
      document.getElementById("ra-progress").style.display = "block";
      const startHtml = await (await fetch(`https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${THREAD_ID}`, {credentials:"include"})).text();
      const lp = detectLP(new DOMParser().parseFromString(startHtml, "text/html"));
      let startP = full ? 1 : Math.max(1, lp - 9);
      for (let p = startP; p <= lp; p++) {
        const h = await (await fetch(`https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${THREAD_ID}&start=${(p-1)*20}`, {credentials:"include"})).text();
        const doc = new DOMParser().parseFromString(h, "text/html");
        const posts = Array.from(doc.querySelectorAll('a[href*="profiles.php"][href*="XID="]')).map(l => {
          let c = l; for (let i=0; i<24 && c; i++) { if (c && /Posted on/i.test(c.textContent)) return c; c = c.parentElement; } return null;
        }).filter(p => p);
        for (const post of posts) {
          const up = parseUser(post);
          if (up) {
            const ex = await idb.get("users", up.userId);
            await idb.put("users", ex ? { ...ex, ...up, lastSeenPost: Math.max(ex.lastSeenPost||0, up.lastSeenPost) } : up);
          }
        }
        document.getElementById("ra-fill").style.width = ((p / lp) * 100) + "%";
        document.getElementById("ra-progline").textContent = `${((p / lp) * 100).toFixed(1)}% (${p}/${lp})`;
        await new Promise(r => setTimeout(r, BOOTSTRAP_DELAY_MS));
      }
      const m = await idb.get("meta", "global"); m.bootstrapComplete = true; await idb.put("meta", m); syncUI(m);
    } finally { scanRunning = false; document.getElementById("ra-progress").style.display = "none"; }
  }

  async function runSearch(reset = true) {
    if (!dbReady) return;
    if (reset) currentSearchPage = 1;
    const p = document.getElementById("ra-panel");
    const includeInactive = p.querySelector("#ra-set-inactive").checked;
    if (reset) {
      const users = await idb.getAll("users");
      const nameQ = p.querySelector("#ra-name-search").value.toLowerCase();
      filteredResultsCache = users.filter(u => {
        if (!includeInactive && u.status === "inactive") return false;
        if (nameQ && !u.name.toLowerCase().includes(nameQ) && !String(u.userId).includes(nameQ)) return false;
        if (p.querySelector("#ra-man").value && (u.stats.man || 0) < Number(p.querySelector("#ra-man").value)) return false;
        if (p.querySelector("#ra-total-min").value && (u.stats.total || 0) < Number(p.querySelector("#ra-total-min").value)) return false;
        return true;
      }).sort((a, b) => (b.lastSeenPost || 0) - (a.lastSeenPost || 0));
    }
    const list = filteredResultsCache.slice((currentSearchPage - 1) * 20, currentSearchPage * 20);
    const getValColor = (v) => v >= 1000000 ? '#fbbf24' : (v >= 100000 ? '#4ade80' : '#f3f4f6');
    document.getElementById("ra-results").innerHTML = list.map(u => `
      <div class="ra-card">
        <div class="ra-card-top" style="display:flex; justify-content:space-between;"><a href="https://www.torn.com/profiles.php?XID=${u.userId}" target="_blank" style="color:#f3f4f6;font-weight:900;text-decoration:none;">${u.name} [${u.userId}]</a><span class="ra-tag ${u.status==='active'?'ra-tag-green':'ra-tag-amber'}">${u.status}</span></div>
        <div class="ra-card-grid">
          <div><span class="ra-k">💪 MAN</span> <br><span class="ra-v" style="color:${getValColor(u.stats.man)}">${(u.stats.man||0).toLocaleString()}</span></div>
          <div><span class="ra-k">🧠 INT</span> <br><span class="ra-v" style="color:${getValColor(u.stats.int)}">${(u.stats.int||0).toLocaleString()}</span></div>
          <div><span class="ra-k">🔋 END</span> <br><span class="ra-v" style="color:${getValColor(u.stats.end)}">${(u.stats.end||0).toLocaleString()}</span></div>
          <div><span class="ra-k">📈 TOTAL</span> <br><span class="ra-v">${(u.stats.total||0).toLocaleString()}</span></div>
          <div><span class="ra-k">🎖️ EE</span> <br><span class="ra-v">${(u.ee && u.ee.value !== null) ? u.ee.value+'/10' : '—'}</span></div>
          <div style="font-size:9px; color:#aaa; grid-column: span 3; border-top:1px solid #333; margin-top:5px; padding-top:2px;">Last LFW: ${new Date(u.lastSeenPost).toLocaleString()}</div>
        </div>
      </div>`).join("");
  }

  /* -----------------------------
     HELPERS
  ----------------------------- */
  function parseUser(post) {
    const link = post.querySelector('a[href*="profiles.php"][href*="XID="]'); if (!link) return null;
    const uid = Number((link.getAttribute("href").match(/XID=(\d+)/i) || [])[1]);
    const txt = post.textContent.trim().replace(/\u00A0/g, " ");
    const mEE = txt.match(/\b(\d{1,2})\s*(?:\/\s*10\s*)?(?:ee\b|effectiveness)\b/i);
    const g = (re) => { const m = txt.match(re); return m ? Number(m[1].replace(/,/g, "")) : 0; };
    const man = g(/(?:manual\s+labou?r|manual)[:\s]\s*([0-9,]+)/i);
    const end = g(/(?:endurance)[:\s]\s*([0-9,]+)/i);
    const int = g(/(?:intelligence)[:\s]\s*([0-9,]+)/i);
    const mDate = txt.match(/Posted on\s+(\d{2}:\d{2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{2})/i);
    const lastSeen = mDate ? new Date(2000 + parseInt(mDate[2].split('/')[2]), mDate[2].split('/')[1]-1, mDate[2].split('/')[0], ...mDate[1].split(':')).getTime() : Date.now();
    return { userId: uid, name: link.textContent.trim(), stats: { man, int, end, total: man+int+end }, ee: { value: mEE ? parseInt(mEE[1]) : null }, lastSeenPost: lastSeen, status: /closed|found|filled/i.test(txt) ? "inactive" : "active", preference: { tags: [] } };
  }
  function detectLP(d) { const n = Array.from(d.querySelectorAll("a")).map(a => (a.textContent || "").trim()).filter(t => /^\d+$/.test(t)).map(Number); return n.length ? Math.max(...n) : 1; }
  function makeDraggable(p, h) {
    let d=false, x, y, sl, st; h.onmousedown = (e) => { d=true; x=e.clientX; y=e.clientY; const r=p.getBoundingClientRect(); sl=r.left; st=r.top; e.preventDefault(); };
    window.onmousemove = (e) => { if(!d) return; p.style.left=(sl+(e.clientX-x))+"px"; p.style.top=(st+(e.clientY-y))+"px"; };
    window.onmouseup = () => { d=false; persistPanelRect(); };
  }
  async function persistPanelRect() {
    const p = document.getElementById("ra-panel"); if (!p || !dbReady) return;
    const r = p.getBoundingClientRect(); const m = await idb.get("meta", "global");
    if(m) { m.ui = { left: r.left, top: r.top, width: r.width, height: r.height }; await idb.put("meta", m); }
  }
  function syncUI(m) {
    document.getElementById("ra-do-scan").style.display = m.bootstrapComplete ? "none" : "inline-block";
    document.getElementById("ra-do-update").style.display = m.bootstrapComplete ? "inline-block" : "none";
    document.getElementById("ra-status").textContent = m.bootstrapComplete ? "Ready." : "Database empty.";
  }

  /* -----------------------------
     INIT
  ----------------------------- */
  injectStyles(); injectPanel(); ensureFloatingButton();
  (async () => {
    try {
      db = await openDBSmart(); dbReady = true;
      let m = await idb.get("meta", "global");
      if (!m) { m = { key: "global", bootstrapComplete: false, ui: {}, settings: { includeInactive: false } }; await idb.put("meta", m); }
      if (m.ui && m.ui.left) { const p = document.getElementById("ra-panel"); p.style.left = m.ui.left + "px"; p.style.top = m.ui.top + "px"; }
      syncUI(m);
    } catch (e) { console.error(e); }
  })();
})();