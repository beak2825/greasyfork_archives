// ==UserScript==
// @name         R4G3RUNN3R's Recruitment Agency
// @namespace    r4g3runn3r.recruitment.agency
// @version      1.7.2
// @description  Full-forum Recruitment Miner. Dec 1st Cutoff, Throttled, Stats-Detection & "Found" logic.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564028/R4G3RUNN3R%27s%20Recruitment%20Agency.user.js
// @updateURL https://update.greasyfork.org/scripts/564028/R4G3RUNN3R%27s%20Recruitment%20Agency.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ============================================================
      GLOBAL CONFIG & UI STATE (RESTORED FROM v1.6.1)
  ============================================================ */
  const RA_VERSION = "1.7.2";
  const THREAD_ID = 15907925; // Original Megathread
  const FORUM_F = 46;
  const PAGE_SIZE = 20;
  const DB_NAME = "tornWorkerDB";
  const REQUIRED_DB_VERSION = 4;
  const BOOTSTRAP_DELAY_MS = 1250; 
  const FIXED_CUTOFF_TS = new Date(2025, 11, 1, 0, 0, 0).getTime();

  let raUIState = "closed";
  let db = null;
  let dbReady = false;
  let scanRunning = false;
  let currentSearchPage = 1;
  let filteredResultsCache = [];

  window.raDockEnabled = true;

  function isPDA() {
    try {
      if (typeof unsafeWindow !== "undefined" && unsafeWindow && unsafeWindow.PDA !== undefined) {
        return !!unsafeWindow.PDA;
      }
    } catch (_) {}
    return /PDA|Mobile|Android|iPhone/i.test(navigator.userAgent);
  }

  /* ============================================================
      THROTTLED FETCH ENGINE (Gated for 100/min Limit)
  ============================================================ */
  let lastRequestTs = 0;
  async function throttledFetch(url) {
    const now = Date.now();
    const wait = Math.max(0, BOOTSTRAP_DELAY_MS - (now - lastRequestTs));
    if (wait) await new Promise(r => setTimeout(r, wait));
    lastRequestTs = Date.now();
    try {
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    } catch (e) {
        console.error("[RA] Fetch Failed:", e);
        return null;
    }
  }

  /* ============================================================
      CORE UI STATE ENGINE & HELPERS (ORIGINAL 1.6.1)
  ============================================================ */
  function applyUIState() {
    const panel = document.getElementById("ra-panel");
    const floatWrap = document.getElementById("ra-float-wrap");
    if (!panel) return;
    if (raUIState === "open") {
      panel.style.display = "block";
      requestAnimationFrame(() => panel.classList.add("ra-visible"));
      if (floatWrap) floatWrap.style.display = "none";
    }
    if (raUIState === "minimized") {
      panel.classList.remove("ra-visible");
      panel.style.display = "none";
      if (floatWrap) floatWrap.style.display = "block";
    }
    if (raUIState === "closed") {
      panel.classList.remove("ra-visible");
      panel.style.display = "none";
      if (floatWrap) floatWrap.style.display = "none";
    }
  }

  function centerPanel() {
    const p = document.getElementById("ra-panel");
    if (!p) return;
    p.style.transform = "";
    const rect = p.getBoundingClientRect();
    const x = Math.max(20, (window.innerWidth - rect.width) / 2);
    const y = Math.max(20, (window.innerHeight - rect.height) / 2);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
  }

  function forceExpanded() {
    const p = document.getElementById("ra-panel");
    if (!p) return;
    p.classList.add("ra-expanded");
  }

  function openPanel() {
    raUIState = "open";
    centerPanel();
    if (isPDA()) forceExpanded();
    applyUIState();
  }

  function minimizePanel() { raUIState = "minimized"; applyUIState(); }
  function closePanel() { raUIState = "closed"; applyUIState(); }

  /* ============================================================
      CORE PARSER & DATE UTILITIES
  ============================================================ */
  function parseTornDate(dateStr) {
    const now = new Date();
    if (dateStr.includes("Today")) {
        const time = dateStr.match(/(\d{2}):(\d{2}):(\d{2})/);
        return time ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), time[1], time[2], time[3]).getTime() : now.getTime();
    }
    if (dateStr.includes("Yesterday")) {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const time = dateStr.match(/(\d{2}):(\d{2}):(\d{2})/);
        return time ? new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), time[1], time[2], time[3]).getTime() : yesterday.getTime();
    }
    const m = dateStr.match(/(\d{2}):(\d{2}):(\d{2})\s*-\s*(\d{2})\/(\d{2})\/(\d{2})/);
    if (m) {
        return new Date(2000 + +m[6], +m[5] - 1, +m[4], +m[1], +m[2], +m[3]).getTime();
    }
    return null;
  }

  function parseUser(post, sourceThreadId) {
    const link = post.querySelector('a[href*="profiles.php"][href*="XID="]');
    if (!link) return null;
    const uid = Number((link.href.match(/XID=(\d+)/) || [])[1]);
    if (!uid) return null;
    const txt = post.textContent.replace(/\u00A0/g, " ").trim();
    const lowTxt = txt.toLowerCase();

    if (sourceThreadId === THREAD_ID) {
      if (/\b(found|filled|hired|no longer looking|thx|thanks)\b/i.test(lowTxt)) {
        return { userId: uid, status: "inactive" };
      }
    }

    const grab = re => {
        const m = txt.match(re);
        return m ? Number(m[1].replace(/,/g, "")) : null;
    };
    const man = grab(/manual(?:\s+labou?r)?[:\s]\s*([\d,]+)/i);
    const int = grab(/intelligence[:\s]\s*([\d,]+)/i);
    const end = grab(/endurance[:\s]\s*([\d,]+)/i);
    const hasStats = (man !== null || int !== null || end !== null);
    const lfWork = /\b(looking for work|lf work|lf job|need a company|hire me|stats)\b/i.test(lowTxt);

    if (!hasStats && !lfWork) return null;

    return {
      userId: uid,
      name: link.textContent.trim().split('[')[0].trim(),
      stats: { man: man || 0, int: int || 0, end: end || 0, total: (man||0)+(int||0)+(end||0) },
      statsKnown: hasStats,
      lastSeenPost: parseTornDate(txt) || Date.now(),
      status: "active"
    };
  }

  /* ============================================================
      MINER ENGINE (USER INITIATED)
  ============================================================ */
  async function runFullForumMiner() {
    if (!dbReady || scanRunning) return;
    scanRunning = true;
    try {
      const prog = document.getElementById("ra-progress");
      const fill = document.getElementById("ra-fill");
      const line = document.getElementById("ra-progline");
      if (prog) prog.style.display = "block";

      if (line) line.textContent = "Discovering threads...";
      let threadsToScan = [];
      let startOffset = 0;
      
      while (startOffset < 1500) { 
        const resp = await throttledFetch(`https://www.torn.com/forums.php?a=0&f=${FORUM_F}&v=0&start=${startOffset}`);
        if (!resp) break;
        const doc = new DOMParser().parseFromString(await resp.text(), "text/html");
        const rows = Array.from(doc.querySelectorAll('li.thread'));
        if (!rows.length) break;

        let foundRecent = false;
        for (const row of rows) {
          const lastPost = row.querySelector('.last-post')?.textContent || "";
          const tId = Number(row.querySelector('a.thread-title')?.href.match(/t=(\d+)/)?.[1]);
          if (tId && (lastPost.includes("Today") || lastPost.includes("Yesterday") || lastPost.includes("/25") || lastPost.includes("/26"))) {
             threadsToScan.push(tId);
             foundRecent = true;
          }
        }
        if (!foundRecent) break;
        startOffset += 30;
      }

      const unique = [...new Set(threadsToScan)];
      for (let i = 0; i < unique.length; i++) {
        if (line) line.textContent = `Mining: ${i+1}/${unique.length}`;
        if (fill) fill.style.width = `${((i/unique.length)*100)}%`;
        await scanThread(unique[i]);
      }

      const meta = await idb.get("meta", "global");
      meta.bootstrapComplete = true;
      await idb.put("meta", meta);
      location.reload(); 
    } catch (e) { console.error("[RA] Fatal Scan Error:", e); } finally {
      scanRunning = false;
      if (document.getElementById("ra-progress")) document.getElementById("ra-progress").style.display = "none";
    }
  }

  async function scanThread(tId) {
    const first = await throttledFetch(`https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${tId}`);
    if (!first) return;
    const lastPage = detectLP(new DOMParser().parseFromString(await first.text(), "text/html"));
    for (let p = lastPage; p >= 1; p--) {
      const resp = await throttledFetch(`https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${tId}&start=${(p-1)*20}`);
      if (!resp) continue;
      const doc = new DOMParser().parseFromString(await resp.text(), "text/html");
      const posts = Array.from(doc.querySelectorAll('.post-container, .post')); 
      let pageHadRecent = false;
      for (const pEl of posts) {
        const user = parseUser(pEl, tId);
        if (!user) continue;
        if (user.lastSeenPost && user.lastSeenPost < FIXED_CUTOFF_TS) continue;
        pageHadRecent = true;
        const existing = await idb.get("users", user.userId);
        if (user.status === "inactive") {
           if (existing) { existing.status = "inactive"; await idb.put("users", existing); }
        } else {
           await idb.put("users", existing ? { ...existing, ...user, lastSeenPost: Math.max(existing.lastSeenPost||0, user.lastSeenPost) } : user);
        }
      }
      if (!pageHadRecent && p < lastPage) break;
    }
  }

  /* ============================================================
      STYLES, THEMES, DENSITY (RESTORED v1.6.1)
  ============================================================ */
  function injectStyles() {
    if (document.getElementById("ra-styles")) return;
    const s = document.createElement("style");
    s.id = "ra-styles";
    s.textContent = `
:root { --ra-bg-main: rgba(14,16,20,0.96); --ra-bg-soft: rgba(18,20,26,0.98); --ra-border: rgba(255,255,255,0.14); --ra-text-main: #f3f4f6; --ra-text-muted: #9ca3af; --ra-accent: #22c55e; }
:root[data-ra-theme="light"] { --ra-bg-main: #f9fafb; --ra-bg-soft: #ffffff; --ra-border: #d1d5db; --ra-text-main: #111827; --ra-text-muted: #6b7280; --ra-accent: #16a34a; }
#ra-panel { position: fixed; z-index: 2147483646; background: var(--ra-bg-main); color: var(--ra-text-main); border: 1px solid var(--ra-border); border-radius: 14px; width: 440px; box-shadow: 0 14px 40px rgba(0,0,0,0.45); resize: both !important; overflow: hidden !important; display: none; font-family: sans-serif; font-size: 12px; transition: opacity 120ms ease, transform 120ms ease; transform: scale(0.98); opacity: 0; }
#ra-panel.ra-visible { transform: scale(1); opacity: 1; }
.ra-header { background: var(--ra-bg-soft); padding: 10px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
.ra-inner { padding: 14px; height: calc(100% - 52px); overflow-y: auto; }
.ra-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.ra-card { border: 1px solid var(--ra-border); padding: 10px; border-radius: 12px; margin-bottom: 10px; background: rgba(0,0,0,0.18); transition: transform 100ms ease, box-shadow 100ms ease; }
.ra-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.ra-k { font-size: 10px; font-weight: 700; color: var(--ra-text-muted); text-transform: uppercase; }
.ra-v { font-size: 12px; font-weight: 700; color: var(--ra-text-main); }
.ra-btn { padding: 8px 10px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff; cursor: pointer; font-weight: 700; font-size: 12px; transition: transform 80ms ease, box-shadow 80ms ease; }
.ra-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.25); }
.ra-primary { border-color: var(--ra-accent); color: var(--ra-accent); }
#ra-premium-icon { width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fbbf24, #b45309); display: inline-block; box-shadow: 0 0 10px rgba(251,191,36,0.35); vertical-align: middle; margin-right: 5px; }
.ra-tag { float: right; font-size: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid; }
.ra-tag-green { color: #4ade80; border-color: #4ade80; }
.ra-tag-amber { color: #fbbf24; border-color: #fbbf24; }
#ra-progress { display: none; margin-bottom: 15px; }
#ra-fill-bg { background: #222; height: 6px; border-radius: 3px; overflow: hidden; }
#ra-fill { background: var(--ra-accent); height: 100%; width: 0%; transition: width 0.3s; }
#ra-float-wrap { position: fixed; right: 18px; bottom: 22px; z-index: 2147483647; display: none; transition: transform 120ms ease; }
#ra-float-wrap:hover { transform: scale(1.06); }
.ra-minimized-btn { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--ra-border); background: var(--ra-bg-soft); box-shadow: 0 10px 30px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ra-minimized-icon { width: 22px; height: 22px; background: url(/images/v2/editor/emoticons.svg) no-repeat -74px -42px; opacity: 0.95; }
.ra-dock-icon { width: 22px; height: 22px; cursor: pointer; background: url(/images/v2/editor/emoticons.svg) no-repeat -74px -42px; opacity: 0.85; }
`;
    document.head.appendChild(s);
  }

  /* ============================================================
      PANEL HTML & LOGIC (RESTORED v1.6.1)
  ============================================================ */
  function injectPanel(isPremium) {
    if (document.getElementById("ra-panel")) return;
    const p = document.createElement("div");
    p.id = "ra-panel";
    const titleText = isPremium ? "Recruitment Agency Pro" : "Recruitment Agency";
    const iconDisplay = isPremium ? "inline-block" : "none";

    p.innerHTML = `
      <div class="ra-header" id="ra-drag">
        <div style="font-size:14px; font-weight:800; display:flex; align-items:center;">
          <span id="ra-premium-icon" style="display:${iconDisplay};"></span> ${titleText}
        </div>
        <div><button class="ra-btn" id="ra-min-p">▁</button> <button class="ra-btn" id="ra-close-p">✕</button></div>
      </div>
      <div class="ra-inner">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div id="ra-status">Loading DB...</div><button id="ra-gear" class="ra-btn">⚙</button>
        </div>
        <div id="ra-settings" style="display:none; padding:10px; border:1px solid var(--ra-border); border-radius:10px; margin-bottom:10px;">
          <label><input type="checkbox" id="ra-set-inactive"> Include inactive</label><br>
          <label><input type="checkbox" id="ra-theme-toggle"> Light theme</label><br>
          <button class="ra-btn" id="ra-nuke-btn" style="width:100%; margin-top:10px; border-color:#7f1d1d; color:#fecaca;">☢ Hard Reset (NUKE)</button>
        </div>
        <div id="ra-progress"><div id="ra-fill-bg"><div id="ra-fill"></div></div><div id="ra-progline" style="font-size:10px; text-align:center; margin-top:4px;"></div></div>
        <button class="ra-btn ra-primary" style="width:100%; margin-bottom:15px;" id="ra-do-scan">Full Forum Miner (Since Dec 1st)</button>
        <div class="ra-grid">
          <div style="grid-column:span 2;"><label class="ra-k">NAME / ID</label><input type="text" id="ra-find" style="width:100%; padding:8px; background:#000; border:1px solid #333; color:#fff; border-radius:6px; box-sizing:border-box;"></div>
          <div><label class="ra-k">💪 MAN≥</label><input type="number" id="ra-man" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:5px;"></div>
          <div><label class="ra-k">🧠 INT≥</label><input type="number" id="ra-int" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:5px;"></div>
          <div><label class="ra-k">🔋 END≥</label><input type="number" id="ra-end" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:5px;"></div>
          <div><label class="ra-k">📈 TOTAL≥</label><input type="number" id="ra-total" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:5px;"></div>
        </div>
        <button class="ra-btn ra-primary" style="width:100%;" id="ra-do-search">🔍 Search</button>
        <div id="ra-results" style="margin-top:15px;"></div>
      </div>
    `;
    document.body.appendChild(p);

    p.querySelector("#ra-min-p").onclick = minimizePanel;
    p.querySelector("#ra-close-p").onclick = closePanel;
    p.querySelector("#ra-do-scan").onclick = runFullForumMiner;
    p.querySelector("#ra-do-search").onclick = () => runSearch(true);
    p.querySelector("#ra-gear").onclick = () => {
      const box = p.querySelector("#ra-settings");
      box.style.display = (box.style.display === "none") ? "block" : "none";
    };
    makeDraggable(p, p.querySelector("#ra-drag"));
  }

  /* ============================================================
      DATABASE & LOGIC WRAPPERS
  ============================================================ */
  const idb = {
    get: (s, k) => new Promise(r => {
      const tx = db.transaction(s).objectStore(s);
      const req = tx.get(k);
      req.onsuccess = () => r(req.result);
    }),
    put: (s, v) => new Promise(r => {
      const tx = db.transaction(s, "readwrite").objectStore(s);
      const req = tx.put(v);
      req.onsuccess = () => r(true);
    }),
    getAll: (s) => new Promise(r => {
      const tx = db.transaction(s).objectStore(s);
      const req = tx.getAll();
      req.onsuccess = () => r(req.result || []);
    })
  };

  async function openDB() {
    return new Promise(resolve => {
      const req = indexedDB.open(DB_NAME, REQUIRED_DB_VERSION);
      req.onupgradeneeded = e => {
        const _db = e.target.result;
        if (!_db.objectStoreNames.contains("users")) _db.createObjectStore("users", { keyPath: "userId" });
        if (!_db.objectStoreNames.contains("meta")) _db.createObjectStore("meta", { keyPath: "key" });
      };
      req.onsuccess = () => resolve(req.result);
    });
  }

  async function runSearch(reset = true) {
    if (!dbReady) return;
    const q = document.getElementById("ra-find").value.toLowerCase();
    const m = Number(document.getElementById("ra-man").value);
    const i = Number(document.getElementById("ra-int").value);
    const e = Number(document.getElementById("ra-end").value);
    const t = Number(document.getElementById("ra-total").value);
    const includeInactive = document.getElementById("ra-set-inactive").checked;

    let users = await idb.getAll("users");
    users = users.filter(u => {
      if (!includeInactive && u.status === "inactive") return false;
      if (q && !u.name.toLowerCase().includes(q) && !String(u.userId).includes(q)) return false;
      if (m && u.stats.man < m) return false;
      if (i && u.stats.int < i) return false;
      if (e && u.stats.end < e) return false;
      if (t && u.stats.total < t) return false;
      return true;
    }).sort((a,b) => b.lastSeenPost - a.lastSeenPost);

    document.getElementById("ra-results").innerHTML = users.slice(0, 50).map(u => `
      <div class="ra-card">
        <span class="ra-tag ${u.statsKnown ? 'ra-tag-green':'ra-tag-amber'}">${u.statsKnown ? 'STATS':'LF WORK'}</span>
        <a href="/profiles.php?XID=${u.userId}" target="_blank" style="color:#fff; font-weight:bold; text-decoration:none;">${u.name} [${u.userId}]</a>
        <div class="ra-card-grid">
          <div><div class="ra-k">MAN</div><b class="ra-v">${u.statsKnown ? u.stats.man.toLocaleString() : '??'}</b></div>
          <div><div class="ra-k">INT</div><b class="ra-v">${u.statsKnown ? u.stats.int.toLocaleString() : '??'}</b></div>
          <div><div class="ra-k">END</div><b class="ra-v">${u.statsKnown ? u.stats.end.toLocaleString() : '??'}</b></div>
        </div>
      </div>
    `).join("");
  }

  /* ============================================================
      FINAL HELPERS & INIT
  ============================================================ */
  function detectLP(doc) {
    const nums = Array.from(doc.querySelectorAll("a")).map(a => a.textContent.trim()).filter(t => /^\d+$/.test(t)).map(Number);
    return nums.length ? Math.max(...nums) : 1;
  }

  function makeDraggable(el, handle) {
    let px = 0, py = 0;
    handle.onmousedown = (e) => {
        px = e.clientX; py = e.clientY;
        document.onmousemove = (e) => {
            el.style.top = (el.offsetTop - (py - e.clientY)) + "px";
            el.style.left = (el.offsetLeft - (px - e.clientX)) + "px";
            px = e.clientX; py = e.clientY;
        };
        document.onmouseup = () => { document.onmousemove = null; };
    };
  }

  (async function init() {
    db = await openDB();
    dbReady = true;
    let meta = await idb.get("meta", "global");
    if (!meta) { meta = { key: "global", bootstrapComplete: false, premium: false }; await idb.put("meta", meta); }
    
    injectStyles();
    injectPanel(meta.premium === true);

    setInterval(() => {
        const bar = document.querySelector('ul[class*="status-icons"]');
        if (bar && !bar.querySelector(".ra-dock-icon")) {
            const li = document.createElement("li");
            li.className = "ra-dock-icon";
            li.title = "Recruitment Miner";
            li.onclick = openPanel;
            bar.prepend(li);
        }
    }, 2000);

    document.getElementById("ra-status").textContent = meta.bootstrapComplete ? "Ready." : "Scan Needed.";
    render();
    console.log("[RA] Miner v1.7.2 Finalized.");
  })();

})();