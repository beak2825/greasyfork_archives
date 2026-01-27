// ==UserScript==
// @name         R4G3RUNN3R's Faction Recruit Scanner
// @namespace    r4g3runn3r.recruit.scanner
// @version      0.8.0
// @description  Scan Advanced Search results and assist faction recruitment
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564180/R4G3RUNN3R%27s%20Faction%20Recruit%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/564180/R4G3RUNN3R%27s%20Faction%20Recruit%20Scanner.meta.js
// ==/UserScript==

(() => {
  "use strict";
  if (!location.href.includes("search")) return;

  /* =========================
     STORAGE
  ========================= */

  const KEY_USERS = "ra_users_v1";
  const KEY_UI = "ra_ui_v1";

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || ""); }
    catch { return fallback; }
  }
  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // users keyed by userId
  const users = new Map(Object.entries(loadJSON(KEY_USERS, {}))); // userId -> {userId, username, level, activity, contacted, opened}
  let uiState = loadJSON(KEY_UI, {
    panel: { left: null, top: null, width: 480, height: 420 },
    mode: "open", // open | minimized | closed
    magnifier: { left: 30, top: 300 },
  });

  function persistUsers() {
    saveJSON(KEY_USERS, Object.fromEntries(users));
  }
  function persistUI() {
    saveJSON(KEY_UI, uiState);
  }

  /* =========================
     STYLE (pretty + readable)
  ========================= */

  const style = document.createElement("style");
  style.textContent = `
    #ra-panel {
      position: fixed;
      background: #0f172a;
      color: #e5e7eb;
      border: 1px solid #334155;
      border-radius: 12px;
      z-index: 999999;
      font-family: system-ui, sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,.7);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      resize: both;
      min-width: 360px;
      min-height: 240px;
    }
    #ra-header {
      cursor: move;
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding: 8px 10px;
      background: #020617;
      border-bottom: 1px solid #334155;
      font-weight: 900;
      font-size: 13px;
      user-select: none;
    }
    #ra-controls button {
      margin-left: 6px;
      background: #111827;
      color: #e5e7eb;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 2px 8px;
      cursor: pointer;
      font-weight: 900;
    }
    #ra-controls button:hover { background:#1f2937; }

    #ra-toolbar {
      display:flex;
      gap: 6px;
      padding: 8px 10px;
      border-bottom: 1px solid #1e293b;
      align-items: center;
      font-size: 12px;
    }
    #ra-toolbar input, #ra-toolbar select {
      background:#020617;
      color:#e5e7eb;
      border:1px solid #334155;
      border-radius:8px;
      padding: 4px 6px;
      height: 28px;
    }
    #ra-scan, #ra-export, #ra-clear {
      height: 28px;
      border-radius: 8px;
      border: 1px solid #22c55e;
      background: #22c55e;
      color: #022c22;
      font-weight: 900;
      cursor: pointer;
      padding: 0 10px;
    }
    #ra-export {
      border-color:#38bdf8;
      background:#38bdf8;
      color:#03202b;
    }
    #ra-clear {
      border-color:#ef4444;
      background:#ef4444;
      color:#2b0707;
    }

    #ra-summary {
      padding: 0 10px 8px 10px;
      font-size: 12px;
      color: #cbd5f5;
    }

    #ra-tablewrap {
      flex:1;
      overflow:auto;
      padding: 0 8px 8px 8px;
    }
    #ra-table {
      width:100%;
      border-collapse:collapse;
      font-size:12px;
    }
    #ra-table thead th {
      text-align:left;
      color:#93c5fd;
      border-bottom:1px solid #334155;
      padding: 6px 6px;
      position: sticky;
      top: 0;
      background: #0b1224;
      z-index: 2;
    }
    #ra-table tbody td {
      border-bottom:1px solid #1e293b;
      padding: 6px 6px;
      vertical-align: middle;
    }
    #ra-table tbody tr:nth-child(odd) { background:#020617; }
    #ra-table tbody tr:nth-child(even){ background:#02081f; }
    #ra-table tbody tr:hover { background:#1e293b; }

    .ra-userline { color:#93c5fd; font-weight: 700; }
    .ra-meta { color:#cbd5f5; }
    .ra-activity { text-transform: capitalize; }
    .ra-activity.online { color:#22c55e; }
    .ra-activity.idle { color:#fbbf24; }
    .ra-activity.offline { color:#94a3b8; }

    .ra-action {
      display:flex;
      justify-content:flex-end;
      align-items:center;
      gap: 10px;
      white-space: nowrap;
    }

    .ra-msg {
      text-decoration:none;
      font-size: 14px;
      color:#38bdf8;
      cursor:pointer;
    }
    .ra-msg:hover { filter: brightness(1.2); }

    .ra-check {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
    }
    .ra-check.on { color:#22c55e; }
    .ra-check.off { color:#475569; }

    /* Dock icon (top right) */
    #ra-dock {
      position: fixed;
      top: 110px;
      right: 16px;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #111827;
      border: 1px solid #334155;
      color: #e5e7eb;
      z-index: 999999;
      display: none;
      align-items:center;
      justify-content:center;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,.6);
      user-select: none;
    }
    #ra-dock:hover { background:#1f2937; }

    /* Floating magnifier (movable) */
    #ra-mag {
      position: fixed;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #22c55e;
      border: 1px solid #16a34a;
      color: #022c22;
      z-index: 999999;
      display: none;
      align-items:center;
      justify-content:center;
      cursor: move;
      box-shadow: 0 10px 30px rgba(0,0,0,.6);
      user-select: none;
      font-size: 18px;
      font-weight: 900;
    }
  `;
  document.head.appendChild(style);

  /* =========================
     UI NODES
  ========================= */

  const panel = document.createElement("div");
  panel.id = "ra-panel";

  panel.innerHTML = `
    <div id="ra-header">
      <div>Advanced Search – Recruiter View</div>
      <div id="ra-controls">
        <button id="ra-min" title="Minimize">_</button>
        <button id="ra-close" title="Close">X</button>
      </div>
    </div>

    <div id="ra-toolbar">
      <input id="ra-minlvl" type="number" placeholder="Min lvl" style="width:80px">
      <input id="ra-maxlvl" type="number" placeholder="Max lvl" style="width:80px">
      <select id="ra-activity">
        <option value="any">Any activity</option>
        <option value="online">Online</option>
        <option value="idle">Idle</option>
        <option value="offline">Offline</option>
      </select>
      <button id="ra-scan">Scan page</button>
      <button id="ra-export">CSV</button>
      <button id="ra-clear" title="Clear collected list">Clear</button>
    </div>

    <div id="ra-summary">0 users collected.</div>

    <div id="ra-tablewrap">
      <table id="ra-table">
        <thead>
          <tr>
            <th style="width:70%;">User</th>
            <th style="width:30%; text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody id="ra-body"></tbody>
      </table>
    </div>
  `;

  const dock = document.createElement("div");
  dock.id = "ra-dock";
  dock.title = "Open Recruiter View";
  dock.textContent = "🔎";

  const mag = document.createElement("div");
  mag.id = "ra-mag";
  mag.title = "Restore Recruiter View";
  mag.textContent = "🔍";

  document.body.appendChild(panel);
  document.body.appendChild(dock);
  document.body.appendChild(mag);

  const body = panel.querySelector("#ra-body");
  const summary = panel.querySelector("#ra-summary");

  /* =========================
     POSITION / SIZE RESTORE
  ========================= */

  function applyPanelRect() {
    const r = uiState.panel || {};
    panel.style.width = `${r.width || 480}px`;
    panel.style.height = `${r.height || 420}px`;

    // If left/top never saved, use right/bottom defaults
    if (typeof r.left === "number" && typeof r.top === "number") {
      panel.style.left = `${r.left}px`;
      panel.style.top = `${r.top}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    } else {
      panel.style.right = "20px";
      panel.style.bottom = "120px";
      panel.style.left = "auto";
      panel.style.top = "auto";
    }
  }

  function savePanelRect() {
    const rect = panel.getBoundingClientRect();
    uiState.panel = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
    persistUI();
  }

  function applyMagPos() {
    mag.style.left = `${uiState.magnifier.left}px`;
    mag.style.top = `${uiState.magnifier.top}px`;
  }

  applyPanelRect();
  applyMagPos();

  /* =========================
     WINDOW MODES
  ========================= */

  function setMode(mode) {
    uiState.mode = mode;
    persistUI();

    if (mode === "open") {
      panel.style.display = "flex";
      dock.style.display = "none";
      mag.style.display = "none";
    } else if (mode === "minimized") {
      panel.style.display = "none";
      dock.style.display = "none";
      mag.style.display = "flex";
    } else if (mode === "closed") {
      panel.style.display = "none";
      mag.style.display = "none";
      dock.style.display = "flex";
    }
  }

  setMode(uiState.mode || "open");

  panel.querySelector("#ra-min").addEventListener("click", () => {
    savePanelRect();
    setMode("minimized");
  });

  panel.querySelector("#ra-close").addEventListener("click", () => {
    savePanelRect();
    setMode("closed");
  });

  dock.addEventListener("click", () => {
    setMode("open");
  });

  mag.addEventListener("click", () => {
    setMode("open");
  });

  /* =========================
     DRAG PANEL (header)
  ========================= */

  let dragging = false, dragOffX = 0, dragOffY = 0;

  panel.querySelector("#ra-header").addEventListener("mousedown", (e) => {
    // Ignore clicks on buttons
    const t = e.target;
    if (t && t.tagName === "BUTTON") return;

    dragging = true;
    const rect = panel.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;

    // Ensure we're using left/top positioning
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - dragOffX}px`;
    panel.style.top = `${e.clientY - dragOffY}px`;
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    savePanelRect();
  });

  /* =========================
     DRAG MAGNIFIER
  ========================= */

  let magDragging = false, magOffX = 0, magOffY = 0;

  mag.addEventListener("mousedown", (e) => {
    magDragging = true;
    const rect = mag.getBoundingClientRect();
    magOffX = e.clientX - rect.left;
    magOffY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!magDragging) return;
    uiState.magnifier.left = e.clientX - magOffX;
    uiState.magnifier.top = e.clientY - magOffY;
    applyMagPos();
  });

  document.addEventListener("mouseup", () => {
    if (!magDragging) return;
    magDragging = false;
    persistUI();
  });

  /* =========================
     RESIZE PERSIST (best-effort)
  ========================= */

  // Save size after mouseup anywhere (covers resize handles)
  document.addEventListener("mouseup", () => {
    if (panel.style.display === "none") return;
    savePanelRect();
  });

  /* =========================
     SCAN + FILTER
  ========================= */

  function cleanTitle(s) {
    return (s || "").replace(/<[^>]+>/g, "").trim().toLowerCase();
  }

  function readFilters() {
    const minLvl = parseInt(panel.querySelector("#ra-minlvl").value || "0", 10);
    const maxLvl = parseInt(panel.querySelector("#ra-maxlvl").value || "999", 10);
    const act = panel.querySelector("#ra-activity").value;
    return { minLvl, maxLvl, act };
  }

  function scanPage() {
    const { minLvl, maxLvl, act } = readFilters();

    document.querySelectorAll('li[class^="user"]').forEach(li => {
      const m = li.className.match(/\buser(\d+)\b/);
      if (!m) return;
      const userId = m[1];

      // Already collected? Skip (retains across pages)
      if (users.has(userId)) return;

      const nameA = li.querySelector('a.user.name');
      const username = nameA ? nameA.textContent.trim() : "Unknown";

      const levelEl = li.querySelector(".level .value");
      const level = levelEl ? parseInt(levelEl.textContent, 10) : 0;
      if (level < minLvl || level > maxLvl) return;

      const titles = [...li.querySelectorAll("[title]")].map(el => cleanTitle(el.title));

      // Skip fed jail/deletion
      if (titles.some(t => t.includes("federal jail") || t.includes("marked for deletion"))) return;

      // Activity (best possible from search DOM)
      let activity = "offline";
      if (titles.some(t => t.includes("online"))) activity = "online";
      else if (titles.some(t => t.includes("idle"))) activity = "idle";

      if (act !== "any" && activity !== act) return;

      users.set(userId, {
        userId,
        username,
        level,
        activity,
        contacted: false,
        opened: false,
      });
    });

    persistUsers();
    render();
  }

  /* =========================
     RENDER (beautiful list)
  ========================= */

  function render() {
    body.innerHTML = "";

    const arr = [...users.values()]
      .sort((a, b) => b.level - a.level); // sort by level desc (feels recruiter-y)

    for (const u of arr) {
      const tr = document.createElement("tr");

      const tdUser = document.createElement("td");
      tdUser.innerHTML = `
        <div class="ra-userline">${escapeHTML(u.username)} [${u.userId}]</div>
        <div class="ra-meta">
          ${u.level} = <span class="ra-activity ${u.activity}">${u.activity}</span>
        </div>
      `;

      const tdAct = document.createElement("td");
      tdAct.style.textAlign = "right";

      const actWrap = document.createElement("div");
      actWrap.className = "ra-action";

      // 📩: open profile (reliable). Mark "opened" automatically (NOT "sent").
      const msg = document.createElement("a");
      msg.className = "ra-msg";
      msg.href = `/profiles.php?XID=${u.userId}`;
      msg.target = "_blank";
      msg.title = "Open profile (message from there)";
      msg.textContent = "📩";
      msg.addEventListener("click", () => {
        u.opened = true;
        persistUsers();
        render();
      });

      // ☑ contacted toggle (reliable, user-controlled)
      const chk = document.createElement("span");
      chk.className = `ra-check ${u.contacted ? "on" : "off"}`;
      chk.title = u.contacted ? "Contacted (click to unmark)" : "Not contacted (click to mark)";
      chk.textContent = "☑";
      chk.addEventListener("click", () => {
        u.contacted = !u.contacted;
        persistUsers();
        render();
      });

      // optional small dot to indicate message opened
      const opened = document.createElement("span");
      opened.style.fontSize = "12px";
      opened.style.color = u.opened ? "#38bdf8" : "#475569";
      opened.title = u.opened ? "Profile opened from tool" : "Not opened yet";
      opened.textContent = "●";

      actWrap.appendChild(msg);
      actWrap.appendChild(opened);
      actWrap.appendChild(chk);
      tdAct.appendChild(actWrap);

      tr.appendChild(tdUser);
      tr.appendChild(tdAct);
      body.appendChild(tr);
    }

    summary.textContent = `${users.size} users collected across scanned pages.`;
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* =========================
     EXPORT CSV
  ========================= */

  function exportCSV() {
    const header = ["UserID", "Username", "Level", "Activity", "OpenedFromTool", "Contacted"];
    const lines = [header.join(",")];

    for (const u of users.values()) {
      const row = [
        u.userId,
        csvSafe(u.username),
        u.level,
        u.activity,
        u.opened ? "true" : "false",
        u.contacted ? "true" : "false",
      ];
      lines.push(row.join(","));
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "torn-recruits.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function csvSafe(v) {
    const s = String(v ?? "");
    if (/[,"\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  }

  /* =========================
     CLEAR
  ========================= */

  function clearAll() {
    users.clear();
    persistUsers();
    render();
  }

  /* =========================
     WIRE BUTTONS
  ========================= */

  panel.querySelector("#ra-scan").addEventListener("click", scanPage);
  panel.querySelector("#ra-export").addEventListener("click", exportCSV);
  panel.querySelector("#ra-clear").addEventListener("click", clearAll);

  /* =========================
     INIT RENDER
  ========================= */

  render();
})();
