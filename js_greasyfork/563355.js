// ==UserScript==
// @name         Torn CorpInfo Employee Auto-Harvester (Option 1)
// @namespace    grimsnecrosis.corpinfo.employee.harvester
// @version      1.0.1
// @description  Auto-saves employee lists from joblist corpinfo pages (safe, UI-based). Includes export + cooldown. (No MutationObserver freeze)
// @author       Grimsnecrosis
// @match        https://www.torn.com/joblist.php*
// @run-at       document-start
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/563355/Torn%20CorpInfo%20Employee%20Auto-Harvester%20%28Option%201%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563355/Torn%20CorpInfo%20Employee%20Auto-Harvester%20%28Option%201%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // -------------------- SETTINGS --------------------
  const STORE_KEY = "grims_corpinfo_employees_v1";
  const UI_POS_KEY = "grims_corpinfo_employees_panel_pos_v1";

  // Don’t re-harvest the same company more often than this (minutes)
  const COOLDOWN_MINUTES = 30;

  // Light polling after hash change to wait for Torn content to render (attempts, interval ms)
  const RENDER_RETRIES = 12;      // 12 * 400ms = ~4.8s
  const RENDER_INTERVAL_MS = 400;

  // If true, will also save a flat set of all employee IDs seen
  const ALSO_SAVE_GLOBAL_EMPLOYEE_SET = true;
  const GLOBAL_EMPLOYEE_SET_KEY = "grims_employee_ids_seen_v1";

  // -------------------- UTIL --------------------
  const isoNow = () => new Date().toISOString();
  const nowMs = () => Date.now();

  function toast(msg) {
    let el = document.getElementById("grimEmpToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "grimEmpToast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (el.style.display = "none"), 2200);
  }

  function safeJsonParse(s, fallback) {
    try {
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  }

  function loadStore() {
    const raw = localStorage.getItem(STORE_KEY);
    const obj = safeJsonParse(raw || "", null);
    if (!obj || typeof obj !== "object") return { companies: {} };
    if (!obj.companies || typeof obj.companies !== "object") obj.companies = {};
    return obj;
  }

  function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store, null, 2));
  }

  function upsertCompany(companyId, payload) {
    const store = loadStore();
    const key = String(companyId);
    if (!store.companies[key]) {
      store.companies[key] = {
        companyId,
        firstSeen: isoNow(),
        lastSeen: isoNow(),
        lastHarvestedAt: null,
        employees: [],
        meta: {},
      };
    }
    const rec = store.companies[key];
    rec.lastSeen = isoNow();

    if (payload) {
      rec.lastHarvestedAt = isoNow();
      rec.employees = payload.employees || rec.employees || [];
      rec.meta = payload.meta || rec.meta || {};
    }

    saveStore(store);
    return rec;
  }

  function minutesSinceIso(iso) {
    if (!iso) return Infinity;
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return Infinity;
    return Math.floor((nowMs() - t) / 60000);
  }

  // -------------------- HASH PARSING (corpinfo) --------------------
  function parseHashParams() {
    const h = (location.hash || "").replace(/^#\!?\/?/, "");
    const sp = new URLSearchParams(h.replace(/\?/g, "&"));
    const p = sp.get("p") || sp.get("P");
    const id = sp.get("ID") || sp.get("id");
    return { p, id: id && /^\d+$/.test(id) ? Number(id) : null };
  }

  function isCorpInfoPage() {
    const { p, id } = parseHashParams();
    return String(p || "").toLowerCase() === "corpinfo" && Number.isFinite(id) && id > 0;
  }

  // -------------------- DOM SCRAPE --------------------
  function xidFromHref(href) {
    try {
      const u = new URL(href, location.origin);
      const xid = u.searchParams.get("XID");
      if (xid && /^\d+$/.test(xid)) return Number(xid);
    } catch {}
    return null;
  }

  function normalizeText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function scrapeEmployeesFromCorpInfo() {
    const links = Array.from(document.querySelectorAll("a[href*='profiles.php'][href*='XID=']"));
    if (!links.length) return { employees: [], meta: { reason: "no profile links found yet" } };

    const seen = new Set();
    const employees = [];

    for (const a of links) {
      const xid = xidFromHref(a.getAttribute("href") || a.href || "");
      if (!xid || seen.has(xid)) continue;

      const row = a.closest("tr") || a.closest("li") || a.closest("div") || null;
      const name = normalizeText(a.textContent) || `User ${xid}`;

      let position = "";
      let level = null;

      if (row && row.tagName === "TR") {
        const tds = Array.from(row.querySelectorAll("td"));
        if (tds[1]) position = normalizeText(tds[1].textContent);
        if (tds[2]) {
          const lv = Number(normalizeText(tds[2].textContent).replace(/[^\d]/g, ""));
          level = Number.isFinite(lv) ? lv : null;
        }
      }

      employees.push({ userId: xid, name, level, position });
      seen.add(xid);
    }

    const cleaned = employees.filter(e => e.userId && e.userId > 0);

    return {
      employees: cleaned,
      meta: {
        scrapedAt: isoNow(),
        linkCount: links.length,
        employeeCount: cleaned.length,
      },
    };
  }

  // -------------------- GLOBAL EMPLOYEE SET --------------------
  function loadGlobalSet() {
    const raw = localStorage.getItem(GLOBAL_EMPLOYEE_SET_KEY);
    const obj = safeJsonParse(raw || "", null);
    if (!obj || typeof obj !== "object") return { ids: {}, lastUpdated: null };
    if (!obj.ids || typeof obj.ids !== "object") obj.ids = {};
    return obj;
  }

  function saveGlobalSet(gs) {
    localStorage.setItem(GLOBAL_EMPLOYEE_SET_KEY, JSON.stringify(gs, null, 2));
  }

  function addToGlobalSet(employeeList) {
    if (!ALSO_SAVE_GLOBAL_EMPLOYEE_SET) return;
    const gs = loadGlobalSet();
    for (const e of employeeList) {
      if (!e?.userId) continue;
      gs.ids[String(e.userId)] = gs.ids[String(e.userId)] || { firstSeen: isoNow(), lastSeen: isoNow() };
      gs.ids[String(e.userId)].lastSeen = isoNow();
    }
    gs.lastUpdated = isoNow();
    saveGlobalSet(gs);
  }

  // -------------------- UI PANEL --------------------
  GM_addStyle(`
    #grimEmpToast{
      position:fixed;bottom:20px;left:20px;z-index:999999;
      background:rgba(0,0,0,.85);color:#fff;padding:10px 12px;border-radius:10px;
      border:1px solid rgba(255,255,255,.15);
      font-family:Arial,sans-serif;font-size:13px;display:none;max-width:70vw;
    }
    #grimEmpPanel{
      position:fixed;left:8px;top:140px;width:360px;z-index:999999;
      background:rgba(10,10,10,.92);
      border:1px solid rgba(255,255,255,.15);
      border-radius:10px;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
      color:#eaeaea;font-family:Arial,sans-serif;overflow:hidden;
    }
    #grimEmpPanel header{
      padding:10px 12px;display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid rgba(255,255,255,.1);
      cursor:move;user-select:none;gap:8px;
    }
    #grimEmpPanel header .title{font-weight:800;font-size:13px;}
    #grimEmpPanel header .sub{font-size:11px;opacity:.75;margin-top:2px;}
    #grimEmpPanel .body{padding:10px 12px;font-size:12px;line-height:1.35;}
    #grimEmpPanel .btnRow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}
    #grimEmpPanel button{
      background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.12);
      color:#eaeaea;padding:7px 8px;border-radius:8px;cursor:pointer;font-size:12px;outline:none;
    }
    #grimEmpPanel button:hover{background:rgba(255,255,255,.12);}
    #grimEmpPanel .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;}
    #grimEmpPanel .pill{
      display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;
      border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.08);
      margin-left:8px;
    }
    #grimEmpPanel .good{background:rgba(80,255,140,.12);border-color:rgba(80,255,140,.22);}
    #grimEmpPanel .warn{background:rgba(241,196,15,.12);border-color:rgba(241,196,15,.22);}
  `);

  function loadPanelPos(panel) {
    try {
      const raw = localStorage.getItem(UI_POS_KEY);
      if (!raw) return;
      const pos = safeJsonParse(raw, null);
      if (pos && typeof pos === "object") {
        if (typeof pos.left === "number") panel.style.left = `${Math.max(0, pos.left)}px`;
        if (typeof pos.top === "number") panel.style.top = `${Math.max(0, pos.top)}px`;
      }
    } catch {}
  }

  function savePanelPos(panel) {
    const r = panel.getBoundingClientRect();
    localStorage.setItem(UI_POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast("Copied to clipboard"),
        () => toast("Clipboard blocked — use Export")
      );
    } else {
      toast("No clipboard API — use Export");
    }
  }

  function ensurePanel() {
    if (document.getElementById("grimEmpPanel")) return;

    const panel = document.createElement("div");
    panel.id = "grimEmpPanel";
    panel.innerHTML = `
      <header>
        <div>
          <div class="title">👥 CorpInfo Employee Auto-Harvester</div>
          <div class="sub">Auto-saves when you open corpinfo pages</div>
        </div>
        <div class="pill" id="grimEmpStatus">idle</div>
      </header>
      <div class="body">
        <div>Page: <span class="mono" id="grimEmpPage">n/a</span></div>
        <div>Company ID: <span class="mono" id="grimEmpCompany">n/a</span></div>
        <div>Employees saved: <span class="mono" id="grimEmpCount">0</span></div>
        <div>Last harvest: <span class="mono" id="grimEmpLast">n/a</span></div>

        <div class="btnRow">
          <button id="grimEmpExportJson">Export JSON</button>
          <button id="grimEmpExportCsv">Export CSV</button>
          <button id="grimEmpCopyIds">Copy employee IDs</button>
          <button id="grimEmpClear">Clear store</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    loadPanelPos(panel);

    // drag
    const header = panel.querySelector("header");
    let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;

    header.addEventListener("mousedown", (e) => {
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = panel.getBoundingClientRect();
      sl = r.left; st = r.top;
      e.preventDefault();
    }, true);

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      panel.style.left = `${Math.max(0, sl + (e.clientX - sx))}px`;
      panel.style.top = `${Math.max(0, st + (e.clientY - sy))}px`;
    }, true);

    window.addEventListener("mouseup", () => {
      if (dragging) savePanelPos(panel);
      dragging = false;
    }, true);

    // buttons
    panel.querySelector("#grimEmpExportJson").addEventListener("click", () => {
      const store = loadStore();
      downloadText(`corpinfo_employees_${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(store, null, 2));
      toast("Exported JSON");
    });

    panel.querySelector("#grimEmpExportCsv").addEventListener("click", () => {
      const store = loadStore();
      const rows = [];
      rows.push(["companyId","userId","name","level","position","lastHarvestedAt"].join(","));

      for (const [cid, rec] of Object.entries(store.companies || {})) {
        const last = rec.lastHarvestedAt || "";
        for (const e of (rec.employees || [])) {
          const line = [
            cid,
            e.userId || "",
            `"${String(e.name || "").replace(/"/g, '""')}"`,
            e.level ?? "",
            `"${String(e.position || "").replace(/"/g, '""')}"`,
            `"${last}"`
          ].join(",");
          rows.push(line);
        }
      }

      downloadText(`corpinfo_employees_${new Date().toISOString().slice(0,10)}.csv`, rows.join("\n"));
      toast("Exported CSV");
    });

    panel.querySelector("#grimEmpCopyIds").addEventListener("click", () => {
      const store = loadStore();
      const set = new Set();
      for (const rec of Object.values(store.companies || {})) {
        for (const e of (rec.employees || [])) {
          if (e?.userId) set.add(String(e.userId));
        }
      }
      copyToClipboard(Array.from(set).sort((a,b)=>Number(a)-Number(b)).join(","));
    });

    panel.querySelector("#grimEmpClear").addEventListener("click", () => {
      if (!confirm("Clear ALL corpinfo employee data?")) return;
      localStorage.removeItem(STORE_KEY);
      toast("Cleared store");
      updatePanel();
    });
  }

  function setPanelStatus(text, kind) {
    const el = document.getElementById("grimEmpStatus");
    if (!el) return;
    el.textContent = text;
    el.className = "pill " + (kind === "good" ? "good" : kind === "warn" ? "warn" : "");
  }

  function updatePanel(companyId) {
    ensurePanel();
    const store = loadStore();

    const pageEl = document.getElementById("grimEmpPage");
    const cEl = document.getElementById("grimEmpCompany");
    const countEl = document.getElementById("grimEmpCount");
    const lastEl = document.getElementById("grimEmpLast");

    const { p, id } = parseHashParams();
    pageEl.textContent = location.hash ? location.hash : "(no hash)";

    const cid = companyId || id || null;
    cEl.textContent = cid ? String(cid) : "n/a";

    if (cid && store.companies[String(cid)]) {
      const rec = store.companies[String(cid)];
      countEl.textContent = String((rec.employees || []).length);
      lastEl.textContent = rec.lastHarvestedAt ? rec.lastHarvestedAt.replace("T"," ").slice(0,19) : "n/a";
    } else {
      countEl.textContent = "0";
      lastEl.textContent = "n/a";
    }
  }

  // -------------------- AUTO HARVEST FLOW --------------------
  let busy = false;
  let scheduled = null;

  function scheduleHarvest(reason) {
    // Debounce: hash changes can fire multiple times in Torn SPA
    if (scheduled) clearTimeout(scheduled);
    scheduled = setTimeout(() => attemptHarvest(reason), 250);
  }

  async function attemptHarvest(reason) {
    scheduled = null;

    ensurePanel();

    if (!isCorpInfoPage()) {
      updatePanel(null);
      setPanelStatus("idle", "");
      return;
    }

    const { id: companyId } = parseHashParams();
    if (!companyId) return;

    updatePanel(companyId);

    const rec = upsertCompany(companyId, null);
    const mins = minutesSinceIso(rec.lastHarvestedAt);

    if (mins < COOLDOWN_MINUTES) {
      setPanelStatus(`cooldown (${mins}m)`, "warn");
      return;
    }

    if (busy) return;
    busy = true;
    setPanelStatus("waiting render…", "warn");

    try {
      // Try multiple times to allow Torn to render the employee table
      let best = { employees: [], meta: {} };

      for (let i = 0; i < RENDER_RETRIES; i++) {
        const r = scrapeEmployeesFromCorpInfo();
        if (r.employees.length > best.employees.length) best = r;

        if (best.employees.length) {
          // If we got something, give it one extra beat for late rows
          await new Promise(res => setTimeout(res, 250));
          const r2 = scrapeEmployeesFromCorpInfo();
          if (r2.employees.length > best.employees.length) best = r2;
          break;
        }

        await new Promise(res => setTimeout(res, RENDER_INTERVAL_MS));
      }

      if (!best.employees.length) {
        setPanelStatus("no employees found", "warn");
        return;
      }

      upsertCompany(companyId, { employees: best.employees, meta: best.meta });
      addToGlobalSet(best.employees);

      updatePanel(companyId);
      setPanelStatus(`saved (${best.employees.length})`, "good");
      toast(`Auto-saved ${best.employees.length} employees for company ${companyId}`);
    } catch (e) {
      setPanelStatus("error", "warn");
      toast(`Harvest error: ${e.message || e}`);
    } finally {
      busy = false;
    }
  }

  // -------------------- BOOT --------------------
  function whenBody(cb) {
    if (document.body) return cb();
    const t = setInterval(() => {
      if (document.body) {
        clearInterval(t);
        cb();
      }
    }, 50);
  }

  function boot() {
    ensurePanel();
    scheduleHarvest("boot");

    window.addEventListener("hashchange", () => scheduleHarvest("hashchange"));

    // Also schedule a “late” attempt after initial SPA boot
    setTimeout(() => scheduleHarvest("late"), 1200);
  }

  whenBody(boot);
})();
