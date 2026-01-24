// ==UserScript==
// @name         Torn War Helper: FF Targets + Hosp Timer (v2.4.0)
// @namespace    torn-war-ff-helper
// @version      2.4.0
// @description  FF target list w/ synced hosp timers, sortable headers, attack+remove buttons, draggable panel, adjustable refresh, diagnostics, profile "Add to War List" button.
// @match        https://torn.com/profiles.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://torn.com/factions.php*
// @match        https://www.torn.com/factions.php*
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/563811/Torn%20War%20Helper%3A%20FF%20Targets%20%2B%20Hosp%20Timer%20%28v240%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563811/Torn%20War%20Helper%3A%20FF%20Targets%20%2B%20Hosp%20Timer%20%28v240%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /**********************
   * Storage / Defaults
   **********************/
  const STORAGE = {
    apiKey: "twh_api_key",
    targets: "twh_targets_id_ff", // lines: id,ff
    optLow: "twh_opt_low",
    optHigh: "twh_opt_high",
    evenFF: "twh_even_ff",
    evenTol: "twh_even_tol",
    refreshSeconds: "twh_refresh_seconds",
    panelPos: "twh_panel_pos",
    minimized: "twh_minimized",
    showOnlyGood: "twh_show_only_good",
    quick1: "twh_quick_med_1",
    quick2: "twh_quick_med_2",
    quick3: "twh_quick_med_3",
    quickPick: "twh_quick_med_pick",

  };

  const DEFAULTS = {
    optLow: 2.50,
    optHigh: 3.00,
    evenFF: 3.67,
    evenTol: 0.05,
    refreshSeconds: 5,
    minimized: false,
    showOnlyGood: false,
  };

  const MIN_REFRESH_SECONDS = 5;
  const MAX_REFRESH_SECONDS = 180;

  let sortState = { key: "bandTier", dir: 1 }; // default: best first
  let backoffSeconds = 0;
  let backoffUntilMs = 0;
  let lastGlobalApiError = null;

  const cache = new Map(); // id -> {name,state,until,apiTimestamp,fetchedAtLocal,lastOkMs,lastErr}

  let panel = null;
  let tickHandle = null;
  let refreshHandle = null;

  const $ = (sel, root = document) => root.querySelector(sel);

  function nowSec() { return Math.floor(Date.now() / 1000); }
  function nowMs() { return Date.now(); }

  function safeJson(txt) { try { return JSON.parse(txt); } catch { return null; } }
  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `
      position: fixed; right: 16px; bottom: 92px; z-index: 9999999;
      background: rgba(0,0,0,0.86); color: #fff;
      padding: 10px 12px; border-radius: 12px;
      font: 14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function digitsOnly(v) {
    const d = String(v ?? "").match(/\d+/g);
    return d ? d.join("") : "";
  }

  function getNum(key, fallback) {
    const n = Number(GM_getValue(key, ""));
    return Number.isFinite(n) ? n : fallback;
  }
  function getBool(key, fallback) {
    const v = GM_getValue(key, "");
    if (v === "" || v == null) return fallback;
    return String(v) === "true";
  }

  function getApiKey() { return (GM_getValue(STORAGE.apiKey, "") || "").trim(); }
  function setApiKey(v) { GM_setValue(STORAGE.apiKey, (v || "").trim()); }

  function getOptLow() { return getNum(STORAGE.optLow, DEFAULTS.optLow); }
  function getOptHigh() { return getNum(STORAGE.optHigh, DEFAULTS.optHigh); }
  function getEvenFF() { return getNum(STORAGE.evenFF, DEFAULTS.evenFF); }
  function getEvenTol() { return getNum(STORAGE.evenTol, DEFAULTS.evenTol); }

  function setThresholds(low, high, even, tol) {
    GM_setValue(STORAGE.optLow, String(low));
    GM_setValue(STORAGE.optHigh, String(high));
    GM_setValue(STORAGE.evenFF, String(even));
    GM_setValue(STORAGE.evenTol, String(tol));
  }

  function getRefreshSaved() { return getNum(STORAGE.refreshSeconds, DEFAULTS.refreshSeconds); }
  function setRefreshSaved(v) { GM_setValue(STORAGE.refreshSeconds, String(v)); }

  function getMinimized() { return getBool(STORAGE.minimized, DEFAULTS.minimized); }
  function setMinimized(v) { GM_setValue(STORAGE.minimized, String(!!v)); }

  function getShowOnlyGood() { return getBool(STORAGE.showOnlyGood, DEFAULTS.showOnlyGood); }
  function setShowOnlyGood(v) { GM_setValue(STORAGE.showOnlyGood, String(!!v)); }

  function loadTargetsMap() {
    const raw = (GM_getValue(STORAGE.targets, "") || "").trim();
    const map = new Map();
    if (!raw) return map;

    raw.split(/\r?\n/).forEach(line => {
      const parts = line.split(",").map(x => x.trim());
      if (parts.length < 2) return;
      const id = digitsOnly(parts[0]);
      const ff = Number(parts[1]);
      if (!id || !Number.isFinite(ff)) return;
      map.set(id, ff);
    });

    return map;
  }

  function saveTargetsMap(map) {
    const raw = [...map.entries()].map(([id, ff]) => `${digitsOnly(id)},${ff}`).join("\n");
    GM_setValue(STORAGE.targets, raw);
  }

  // Safe refresh enforcement based on targets (API 100 req/min => 0.6s per request)
  function effectiveRefreshSeconds(targetCount) {
    const desired = Math.floor(getRefreshSaved());
    const safeMin = Math.ceil(0.6 * Math.max(1, targetCount));
    let eff = Math.min(MAX_REFRESH_SECONDS, Math.max(MIN_REFRESH_SECONDS, safeMin, desired));
    if (backoffUntilMs > nowMs()) eff += backoffSeconds;
    return eff;
  }

  /**********************
   * FF classify / colors
   **********************/
  function classifyFF(ff) {
    const low = getOptLow();
    const high = getOptHigh();
    const even = getEvenFF();
    const tol = getEvenTol();

    if (!Number.isFinite(ff)) return { label: "?", tier: 9 };
    if (Math.abs(ff - even) <= tol) return { label: "Even", tier: 3 };
    if (ff < low) return { label: "Farm", tier: 1 };
    if (ff <= high) return { label: "Optimal", tier: 0 };
    if (ff < even) return { label: "Close", tier: 2 };
    return { label: "Risky", tier: 5 };
  }

  function bandRowBg(label) {
    if (label === "Optimal") return "background: rgba(60,200,120,0.18);";
    if (label === "Close") return "background: rgba(90,150,255,0.14);";
    if (label === "Even") return "background: rgba(255,200,90,0.14);";
    if (label === "Risky") return "background: rgba(255,90,90,0.16);";
    return "background: rgba(255,255,255,0.03);";
  }

  function statusColor(status) {
    const s = String(status || "").toLowerCase();
    if (s === "hospital") return "#ffe08a";
    if (s === "traveling") return "#9ad0ff";
    if (s === "online") return "#a6f3b8";
    if (s === "jail") return "#ffb6ff";
    if (s === "error") return "#ff9b9b";
    return "#f5f5f5";
  }

  function formatDuration(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  /**********************
   * API (synced timers)
   **********************/
  function apiUserUrl(id, key) {
    return `https://api.torn.com/user/${encodeURIComponent(id)}?selections=profile&key=${encodeURIComponent(key)}`;
  }

  function apiGetUser(id, key) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: apiUserUrl(id, key),
        onload: (resp) => {
          const data = safeJson(resp.responseText);
          if (!data) return reject({ code: -1, error: "Bad JSON" });
          if (data.error) return reject(data.error);
          resolve(data);
        },
        onerror: () => reject({ code: -2, error: "Network error" })
      });
    });
  }

  function normalizeUser(data) {
    return {
      name: data.name || `#${data.player_id || ""}`,
      state: data.status?.state || "Unknown",
      until: Number(data.status?.until || 0),
      apiTimestamp: Number(data.timestamp || nowSec()),
      fetchedAtLocal: nowSec(),
      lastOkMs: nowMs(),
      lastErr: null
    };
  }

  function remainingHospSeconds(entry) {
    if (!entry?.until) return 0;
    const localNow = nowSec();
    const serverNow = entry.apiTimestamp + (localNow - entry.fetchedAtLocal);
    return Math.max(0, entry.until - serverNow);
  }

  /**********************
   * Profile page button
   **********************/
  function getProfileIdFromUrl() {
    const m = location.search.match(/XID=(\d+)/i);
    return m ? m[1] : null;
  }

  function findFairFightOnPage() {
    const txt = document.body.innerText || "";
    const m = txt.match(/FairFight\s*:\s*([0-9]+(?:\.[0-9]+)?)/i);
    return m ? Number(m[1]) : null;
  }

  function addProfileButton() {
    const id = getProfileIdFromUrl();
    if (!id || $("#twh_add_btn")) return;

    const btn = document.createElement("button");
    btn.id = "twh_add_btn";
    btn.textContent = "Add to War List (FF)";
    btn.style.cssText = `
      position: fixed; right: 16px; top: 120px; z-index: 9999999;
      padding: 10px 12px; border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.25);
      background: rgba(255,255,255,0.96); color: #111;
      font: 14px/1.35 system-ui; font-weight: 800;
      box-shadow: 0 10px 30px rgba(0,0,0,0.20);
      cursor: pointer;
    `;

    btn.onclick = () => {
      const ff = findFairFightOnPage();
      if (!Number.isFinite(ff)) return toast("Couldn’t find FairFight value on this page.");
      const map = loadTargetsMap();
      map.set(digitsOnly(id), ff);
      saveTargetsMap(map);
      toast(`Saved ${id} (FF ${ff.toFixed(2)}).`);
    };

    document.body.appendChild(btn);
  }

  /**********************
   * Draggable panel
   **********************/
  function makeDraggable(el, handle) {
    const saved = GM_getValue(STORAGE.panelPos, "");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (Number.isFinite(p.left)) el.style.left = `${p.left}px`;
        if (Number.isFinite(p.top)) el.style.top = `${p.top}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";
      } catch {}
    }

    let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;

    handle.style.cursor = "move";
    handle.addEventListener("mousedown", (e) => {
      const tag = (e.target?.tagName || "").toUpperCase();
      if (tag === "BUTTON" || tag === "INPUT" || tag === "A" || tag === "LABEL") return;

      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = el.getBoundingClientRect();
      sl = r.left; st = r.top;

      el.style.left = `${sl}px`;
      el.style.top = `${st}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";

      const move = (ev) => {
        if (!dragging) return;
        const nl = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, sl + (ev.clientX - sx)));
        const nt = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, st + (ev.clientY - sy)));
        el.style.left = `${nl}px`;
        el.style.top = `${nt}px`;
      };

      const up = () => {
        dragging = false;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        const rr = el.getBoundingClientRect();
        GM_setValue(STORAGE.panelPos, JSON.stringify({ left: rr.left, top: rr.top }));
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    });
  }

  function snapPanel(corner) {
    panel.style.left = "auto"; panel.style.top = "auto";
    panel.style.right = "auto"; panel.style.bottom = "auto";

    const pad = 16;
    const bottomPad = 92;

    if (corner === "TL") { panel.style.left = `${pad}px`; panel.style.top = `${pad}px`; }
    if (corner === "TR") { panel.style.right = `${pad}px`; panel.style.top = `${pad}px`; }
    if (corner === "BL") { panel.style.left = `${pad}px`; panel.style.bottom = `${bottomPad}px`; }
    if (corner === "BR") { panel.style.right = `${pad}px`; panel.style.bottom = `${bottomPad}px`; }

    const rr = panel.getBoundingClientRect();
    GM_setValue(STORAGE.panelPos, JSON.stringify({ left: rr.left, top: rr.top }));
  }

   /**********************
   * Build panel UI
   **********************/
  function buildPanel() {
    if (panel) return;

    panel = document.createElement("div");
    panel.id = "twh_panel";
    panel.style.cssText = `
      position: fixed; right: 16px; bottom: 92px;
      width: 720px; max-height: 72vh; overflow: auto;
      background: rgba(10,10,12,0.96);
      color: #f5f5f5;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 16px;
      padding: 12px;
      z-index: 9999999;
      font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      box-shadow: 0 14px 40px rgba(0,0,0,0.45);
    `;

    panel.innerHTML = `
      <div id="twh_header" style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="font-weight:900;font-size:15px;">War Targets (FF Optimal + Hosp)</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
          <button id="twh_tl">TL</button>
          <button id="twh_tr">TR</button>
          <button id="twh_bl">BL</button>
          <button id="twh_br">BR</button>
          <button id="twh_reset">Reset</button>
        </div>
      </div>

      <div id="twh_error" style="display:none;margin-top:10px;padding:10px;border-radius:12px;
           border:1px solid rgba(255,90,90,0.30);background:rgba(255,80,80,0.12);color:#ffd0d0;"></div>

      <div style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <label style="display:flex;gap:8px;align-items:center;">
          <span>API key</span>
          <input id="twh_key" type="password" style="width:260px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
        </label>
        <button id="twh_save_key">Save</button>
        <button id="twh_test_key">Test Key</button>
        <button id="twh_refresh">Refresh</button>

        <label style="display:flex;gap:8px;align-items:center;">
          <span>Refresh (sec)</span>
          <input id="twh_refresh_sec" type="number" min="1" step="1" style="width:90px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
        </label>
        <button id="twh_set_refresh">Set</button>

        <label style="display:flex;gap:8px;align-items:center;">
          <input id="twh_only_good" type="checkbox">
          <span>Only Optimal + Close</span>
        </label>
      </div>

      <div style="margin-top:10px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.14);">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
          <label><div style="opacity:0.9;">Optimal low</div>
            <input id="twh_low" type="number" step="0.01" style="width:110px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
          </label>
          <label><div style="opacity:0.9;">Optimal high</div>
            <input id="twh_high" type="number" step="0.01" style="width:110px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
          </label>
          <label><div style="opacity:0.9;">Even FF</div>
            <input id="twh_even" type="number" step="0.01" style="width:110px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
          </label>
          <label><div style="opacity:0.9;">Even tol</div>
            <input id="twh_tol" type="number" step="0.01" style="width:110px;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.20);background:rgba(255,255,255,0.08);color:white;">
          </label>
          <button id="twh_save_thresh">Save</button>
        </div>
        <div style="margin-top:8px;opacity:0.88;">Timers synced using API server time • Recommended Even tol = 0.05</div>
      </div>

      <div id="twh_meta" style="margin-top:10px;opacity:0.95;"></div>

      <div style="margin-top:10px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.18);text-align:left;">
              <th style="padding:10px 8px;">Player</th>
              <th class="twh_sort" data-key="ff" style="padding:10px 8px;cursor:pointer;">FF <span id="twh_sort_ff">▲▼</span></th>
              <th class="twh_sort" data-key="bandTier" style="padding:10px 8px;cursor:pointer;">Band <span id="twh_sort_band">▲▼</span></th>
              <th class="twh_sort" data-key="status" style="padding:10px 8px;cursor:pointer;">Status <span id="twh_sort_status">▲▼</span></th>
              <th class="twh_sort" data-key="hospSeconds" style="padding:10px 8px;cursor:pointer;">Hosp <span id="twh_sort_hosp">▲▼</span></th>
              <th style="padding:10px 8px;">Actions</th>
            </tr>
          </thead>
          <tbody id="twh_rows"></tbody>
        </table>
      </div>
    `;

    document.body.appendChild(panel);

    // init values
    $("#twh_key", panel).value = getApiKey();
    $("#twh_refresh_sec", panel).value = String(getRefreshSaved());
    $("#twh_only_good", panel).checked = getShowOnlyGood();

    $("#twh_low", panel).value = String(getOptLow());
    $("#twh_high", panel).value = String(getOptHigh());
    $("#twh_even", panel).value = String(getEvenFF());
    $("#twh_tol", panel).value = String(getEvenTol());
    // ---------- Quick Meds ----------
    const quickWrap = document.createElement("div");
    quickWrap.style.cssText = `
      margin-top:10px;padding:10px;border-radius:12px;
      border:1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.03);
    `;

    const common = [
      "Xanax",
      "Small First Aid Kit",
      "First Aid Kit",
      "Blood Bag : O+",
      "Blood Bag : A+",
      "Blood Bag : B+",
      "Blood Bag : AB+",
      "Morphine",
      "Neumune Tablet",
      "Ipecac Syrup",
      "Vicodin",
      "Epinephrine"
    ];

    const makeSlot = (label, storeKey) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px;";

      const title = document.createElement("div");
      title.textContent = label;
      title.style.cssText = "width:70px;font-weight:900;opacity:0.95;";

      const inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Type or pick…";
      inp.value = (GM_getValue(storeKey, "") || "").trim();
      inp.style.cssText = `
        width:260px;padding:6px 8px;border-radius:10px;
        border:1px solid rgba(255,255,255,0.20);
        background:rgba(255,255,255,0.08);color:white;
      `;

      // datalist for quick picking
      const dlId = `twh_med_datalist_${storeKey}`;
      const dl = document.createElement("datalist");
      dl.id = dlId;
      common.forEach(n => {
        const opt = document.createElement("option");
        opt.value = n;
        dl.appendChild(opt);
      });
      inp.setAttribute("list", dlId);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.style.cssText = `
        padding:6px 10px;border-radius:10px;
        border:1px solid rgba(255,255,255,0.22);
        background:rgba(255,255,255,0.10);color:white;font-weight:900;
        cursor:pointer;
      `;
      saveBtn.onclick = () => {
        GM_setValue(storeKey, (inp.value || "").trim());
        toast(`${label} saved.`);
      };

      const goBtn = document.createElement("button");
      goBtn.textContent = "Go";
      goBtn.style.cssText = `
        padding:6px 10px;border-radius:10px;
        border:1px solid rgba(255,255,255,0.22);
        background:rgba(60,200,120,0.18);color:white;font-weight:900;
        cursor:pointer;
      `;
      goBtn.onclick = () => {
        const pick = (inp.value || "").trim();
        if (!pick) return toast("Pick an item name first.");
        GM_setValue(STORAGE.quickPick, pick);
        // Open Items → Medical (new tab)
        window.open("https://www.torn.com/item.php#medical", "_blank", "noopener");
      };

      row.appendChild(title);
      row.appendChild(inp);
      row.appendChild(dl);
      row.appendChild(saveBtn);
      row.appendChild(goBtn);
      return row;
    };

    const header = document.createElement("div");
    header.textContent = "Quick Meds (opens Medical + highlights item)";
    header.style.cssText = "font-weight:900;opacity:0.95;";

    quickWrap.appendChild(header);
    quickWrap.appendChild(makeSlot("Slot 1", STORAGE.quick1));
    quickWrap.appendChild(makeSlot("Slot 2", STORAGE.quick2));
    quickWrap.appendChild(makeSlot("Slot 3", STORAGE.quick3));

    // Insert it above the table
    $("#twh_meta", panel).parentNode.insertBefore(quickWrap, $("#twh_meta", panel));

    // buttons
    $("#twh_save_key", panel).onclick = () => { setApiKey($("#twh_key", panel).value); toast("Saved API key."); };

    $("#twh_test_key", panel).onclick = async () => {
      const key = ($("#twh_key", panel).value || "").trim();
      if (!key) return toast("Paste API key first.");
      try {
        const data = await apiGetUser("me", key);
        toast(`API OK: ${data.name || "me"}`);
        lastGlobalApiError = null;
        renderError();
      } catch (e) {
        lastGlobalApiError = e;
        renderError();
        toast(`API error ${e.code}: ${e.error}`);
      }
    };

    $("#twh_refresh", panel).onclick = () => refreshOnce(true);

    $("#twh_set_refresh", panel).onclick = () => {
      const v = Math.floor(Number($("#twh_refresh_sec", panel).value));
      if (!Number.isFinite(v) || v < 1) return toast("Refresh seconds must be >= 1.");
      setRefreshSaved(v);
      toast("Refresh saved.");
      startAutoRefresh();
      renderMeta();
    };

    $("#twh_only_good", panel).onchange = () => {
      setShowOnlyGood($("#twh_only_good", panel).checked);
      renderRows();
      renderMeta();
    };

    $("#twh_save_thresh", panel).onclick = () => {
      const low = Number($("#twh_low", panel).value);
      const high = Number($("#twh_high", panel).value);
      const even = Number($("#twh_even", panel).value);
      const tol = Number($("#twh_tol", panel).value);
      if (!Number.isFinite(low) || !Number.isFinite(high) || low > high) return toast("Invalid optimal range.");
      if (!Number.isFinite(even) || !Number.isFinite(tol) || tol < 0) return toast("Invalid even settings.");
      setThresholds(low, high, even, tol);
      toast("Saved FF thresholds.");
      renderRows();
    };

    $("#twh_tl", panel).onclick = () => snapPanel("TL");
    $("#twh_tr", panel).onclick = () => snapPanel("TR");
    $("#twh_bl", panel).onclick = () => snapPanel("BL");
    $("#twh_br", panel).onclick = () => snapPanel("BR");
    $("#twh_reset", panel).onclick = () => {
      GM_setValue(STORAGE.panelPos, "");
      panel.style.left = "auto"; panel.style.top = "auto";
      panel.style.right = "16px"; panel.style.bottom = "92px";
      toast("Panel reset.");
    };

    // sorting
    panel.querySelectorAll(".twh_sort").forEach(th => {
      th.onclick = () => {
        const key = th.getAttribute("data-key");
        if (sortState.key === key) sortState.dir *= -1;
        else { sortState.key = key; sortState.dir = 1; }
        renderRows();
      };
    });

    // draggable
    makeDraggable(panel, $("#twh_header", panel));

    renderMeta();
    renderRows();
    renderError();
  }

  function renderError() {
    const box = $("#twh_error", panel);
    if (!box) return;
    if (!lastGlobalApiError) {
      box.style.display = "none";
      box.textContent = "";
      return;
    }
    box.style.display = "block";
    box.textContent = `Last API error: ${lastGlobalApiError.code} — ${lastGlobalApiError.error}`;
  }

  function renderMeta() {
    const map = loadTargetsMap();
    const eff = effectiveRefreshSeconds(map.size || 1);
    const desired = Math.floor(getRefreshSaved());
    const safeMin = Math.ceil(0.6 * Math.max(1, map.size));
    const backoffMsg = (backoffUntilMs > nowMs()) ? ` • backoff +${backoffSeconds}s` : "";
    $("#twh_meta", panel).textContent =
      (desired < safeMin)
        ? `${map.size} targets • refresh enforced to ~${eff}s (you set ${desired}s; min ${safeMin}s).${backoffMsg}`
        : `${map.size} targets • refresh ~${eff}s.${backoffMsg}`;
  }

  function renderRows() {
    const tbody = $("#twh_rows", panel);
    const map = loadTargetsMap();
    const onlyGood = getShowOnlyGood();

    let items = [...map.entries()].map(([id, ff]) => {
      id = digitsOnly(id);
      const band = classifyFF(ff);
      const entry = cache.get(id);

      const name = entry?.name || `#${id}`;
      const status = entry?.state || "…";

      const hospSec = (String(status).toLowerCase() === "hospital")
        ? remainingHospSeconds(entry)
        : 0;

      const hospTxt = hospSec > 0 ? formatDuration(hospSec) : "";

      return {
        id,
        ff,
        bandLabel: band.label,
        bandTier: band.tier,
        status,
        hospSeconds: hospSec,
        hospTxt,
        name
      };
    });

    if (onlyGood) {
      items = items.filter(x => x.bandLabel === "Optimal" || x.bandLabel === "Close");
    }

    // sort
    if (sortState?.key) {
      items.sort((a, b) => {
        let va = a[sortState.key];
        let vb = b[sortState.key];

        if (typeof va === "string") {
          va = va.toLowerCase();
          vb = vb.toLowerCase();
        }
        if (va < vb) return -1 * sortState.dir;
        if (va > vb) return 1 * sortState.dir;
        return 0;
      });
    }

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="padding:12px;opacity:0.9;">No targets saved yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(x => {
      const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${encodeURIComponent(digitsOnly(x.id))}`;

      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.10); ${bandRowBg(x.bandLabel)}">
          <td style="padding:10px 8px;">
            <a href="https://www.torn.com/profiles.php?XID=${encodeURIComponent(x.id)}" target="_blank"
               style="color:white;text-decoration:none;font-weight:900;">
              ${escapeHtml(x.name)}
            </a>
            <div style="opacity:0.75;font-size:12px;color:white;">${escapeHtml(x.id)}</div>
          </td>

          <td style="padding:10px 8px;color:white;font-weight:800;">${Number(x.ff).toFixed(2)}</td>

          <td style="padding:10px 8px;color:white;font-weight:800;">${escapeHtml(x.bandLabel)}</td>

          <td style="padding:10px 8px;font-weight:900;color:${statusColor(x.status)};">
            ${escapeHtml(x.status)}
          </td>

          <td style="padding:10px 8px;color:white;font-weight:800; font-variant-numeric: tabular-nums;">
            ${escapeHtml(x.hospTxt)}
          </td>

          <td style="padding:10px 8px; white-space:nowrap;">
            <a href="${attackUrl}" target="_blank"
               style="display:inline-block;margin-right:8px;padding:6px 10px;border-radius:10px;
                      border:1px solid rgba(255,255,255,0.22);background:rgba(255,255,255,0.10);
                      color:white;font-weight:900;text-decoration:none;">
              Attack
            </a>
            <button data-del="${escapeHtml(x.id)}"
              style="padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.22);
                     background:rgba(255,255,255,0.08);color:white;font-weight:900;cursor:pointer;">
              Remove
            </button>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll("button[data-del]").forEach(btn => {
      btn.onclick = () => {
        const id = digitsOnly(btn.getAttribute("data-del"));
        const m = loadTargetsMap();
        m.delete(id);
        saveTargetsMap(m);
        cache.delete(id);
        toast(`Removed ${id}.`);
        renderMeta();
        renderRows();
        startAutoRefresh();
      };
    });
  }

  async function refreshOnce(showToast=false) {
    const apiKey = getApiKey();
    if (!apiKey) { if (showToast) toast("Paste your API key first."); return; }

    const map = loadTargetsMap();
    const ids = [...map.keys()].map(digitsOnly).filter(Boolean);
    if (!ids.length) return;

    let hadRateLimit = false;
    let hadAnyError = false;

    for (const id of ids) {
      try {
        const data = await apiGetUser(id, apiKey);
        const entry = normalizeUser(data);
        cache.set(id, entry);
      } catch (e) {
        hadAnyError = true;
        lastGlobalApiError = e;

        // keep old cache, don't overwrite with generic Error
        const prev = cache.get(id) || { name: `#${id}`, state: "Unknown" };
        prev.lastErr = e;
        cache.set(id, prev);

        if (Number(e?.code) === 5) hadRateLimit = true; // API rate limit
      }
    }

    // backoff logic if rate-limited
    if (hadRateLimit) {
      backoffSeconds = Math.min(60, Math.max(10, backoffSeconds ? backoffSeconds * 2 : 10));
      backoffUntilMs = nowMs() + 60_000;
    } else if (!hadAnyError) {
      backoffSeconds = 0;
      backoffUntilMs = 0;
      lastGlobalApiError = null;
    }

    renderError();
    renderMeta();
    renderRows();

    if (showToast) toast("Updated.");
  }

  function startTick() {
    clearInterval(tickHandle);
    tickHandle = setInterval(() => {
      if (panel) renderRows(); // updates hosp countdown every second
    }, 1000);
  }

  function startAutoRefresh() {
    clearInterval(refreshHandle);
    const map = loadTargetsMap();
    const eff = effectiveRefreshSeconds(map.size || 1);

    refreshHandle = setInterval(() => {
      refreshOnce(false);
    }, eff * 1000);
  }

  /**********************
   * INIT
   **********************/
  function initProfiles() {
    addProfileButton();
    setTimeout(addProfileButton, 1200);
    setTimeout(addProfileButton, 2500);
  }

  function initFactions() {
    buildPanel();
    renderRows();
    startTick();
    refreshOnce(false);
    startAutoRefresh();
  }

  if (location.pathname.includes("profiles.php")) initProfiles();
  if (location.pathname.includes("factions.php")) initFactions();
  function initItemsHighlighter() {
    // Only run on items page
    if (!location.pathname.includes("item.php")) return;

    const pick = (GM_getValue(STORAGE.quickPick, "") || "").trim();
    if (!pick) return;

    const tryHighlight = () => {
      // Torn is dynamic; look for a row containing the text
      const all = Array.from(document.querySelectorAll("body *"))
        .filter(el => el && el.children.length === 0 && el.textContent && el.textContent.trim().length);

      const target = all.find(el => el.textContent.trim().toLowerCase() === pick.toLowerCase())
        || all.find(el => el.textContent.trim().toLowerCase().includes(pick.toLowerCase()));

      if (!target) return false;

      const row = target.closest("li, tr, .row, .item, .items, div") || target;
      row.scrollNotice = row.scrollNotice || 0;

      row.scrollIntoView({ behavior: "smooth", block: "center" });

      // highlight
      row.style.outline = "3px solid rgba(60,200,120,0.85)";
      row.style.borderRadius = "10px";
      row.style.boxShadow = "0 0 0 6px rgba(60,200,120,0.18)";

      // clear pick after successful highlight
      GM_setValue(STORAGE.quickPick, "");
      toast(`Highlighted: ${pick}`);
      return true;
    };

    // Try multiple times as the DOM loads
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (tryHighlight() || attempts >= 20) clearInterval(timer);
    }, 500);
  }

})();

