// ==UserScript==
// @name         Neopets Wheel of Celebration Prize Tracker
// @namespace    Amanda Bynes@clraik and ChadGPT ai robot helper friend
// @version      1.8.0
// @description  Track daily Wheel of Celebration prizes per account using NST/PST, JSON/CSV, smart paste, copy row, collapsible UI, search filter, highlight new entries.
// @match        https://www.neopets.com/np26birthday/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556030/Neopets%20Wheel%20of%20Celebration%20Prize%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/556030/Neopets%20Wheel%20of%20Celebration%20Prize%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'np_woc_tracker_master_v1';

  let trackerData = {};
  let lastLoggedSignature = null;

  // For editing rows
  let editOriginalUser = null;
  let editOriginalDate = null;

  let searchInput = null;   // <-- makes searchInput safe for renderTable()
  let latestEditedKey = null;


  // For highlighting newly added rows
  let lastAddedKey = null;

  function parseJSONSafe(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return null;
  }

  function saveGM(data) {
    try { GM_setValue(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) {}
  }

  function migrateIfNeeded() {
    let raw = GM_getValue(STORAGE_KEY, null);
    let parsed = parseJSONSafe(raw);
    if (parsed) return parsed;
    return {};
  }

  trackerData = migrateIfNeeded();

  function getUsername() {
    const el =
      document.querySelector('.nav-profile-dropdown-text a[href*="userlookup.phtml"]') ||
      document.querySelector('.nav-profile-dropdown-text a');
    return el ? el.textContent.trim() : 'Unknown';
  }

  function getPSTDateFromLocal(localDate) {
    const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
    const pst = new Date(utc - 8 * 3600000);
    return pst;
  }

  function getNeoDateString() {
    const nstSpan = document.querySelector('#nst');
    const nowLocal = new Date();

    if (nstSpan) {
      const txt = nstSpan.textContent.trim();
      const m = txt.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)/i);

      if (m) {
        let [_, hStr, mStr, sStr, mer] = m;
        let h = parseInt(hStr, 10);
        const mins = parseInt(mStr, 10);
        const secs = parseInt(sStr, 10);
        mer = mer.toLowerCase();

        if (mer === 'pm' && h !== 12) h += 12;
        if (mer === 'am' && h === 12) h = 0;

        const nstSeconds = h * 3600 + mins * 60 + secs;
        const localSeconds =
          nowLocal.getHours() * 3600 +
          nowLocal.getMinutes() * 60 +
          nowLocal.getSeconds();

        const delta = nstSeconds - localSeconds;
        const nstDateObj = new Date(nowLocal.getTime() + delta * 1000);

        const yyyy = nstDateObj.getFullYear();
        const mm = String(nstDateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(nstDateObj.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }

    const pst = getPSTDateFromLocal(nowLocal);
    const yyyy = pst.getFullYear();
    const mm = String(pst.getMonth() + 1).padStart(2, '0');
    const dd = String(pst.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function convertToMMDDYYYY(isoStr) {
    const [y, m, d] = isoStr.split('-');
    return `${m}/${d}/${y}`;
  }

  function ensureEntry(username, date) {
    if (!trackerData[username]) trackerData[username] = {};
    if (!trackerData[username][date]) {
      trackerData[username][date] = {
        username,
        date,
        spin1Prize: '',
        spin2Prize: ''
      };
    }
    return trackerData[username][date];
  }

  function getAllEntriesArray() {
    const arr = [];
    for (const u in trackerData) {
      for (const d in trackerData[u]) {
        arr.push(trackerData[u][d]);
      }
    }

    arr.sort((a, b) => {
      if (a.date !== b.date) return a.date > b.date ? -1 : 1;
      return a.username.localeCompare(b.username);
    });

    return arr;
  }

  function isVisible(el) {
    return !!(el && el.offsetParent !== null);
  }

  // PANEL vars
  let panelContentContainer = null;
  let headerToolsRow = null;
  let isCollapsed = false;

  function createPanel() {
    if (document.getElementById('wocTrackerPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'wocTrackerPanel';
    panel.style = `
      position:fixed;
      top:70px;
      left:0;
      max-width:40vw;
      max-height:50vh;
      background:rgba(255,255,255,0.96);
      border:1px solid #999;
      box-shadow:2px 2px 5px rgba(0,0,0,0.3);
      font-family:Verdana,sans-serif;
      font-size:8px;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      z-index:9999;
    `;

    // HEADER
    const header = document.createElement('div');
    header.style = `
      padding:2px 4px;
      background:#f5f5f5;
      border-bottom:1px solid #ccc;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:4px;
    `;

    const leftSide = document.createElement('div');
    leftSide.style = `display:flex; align-items:center; gap:6px;`;

    const title = document.createElement('div');
    title.textContent = 'Wheel of Celebration — Daily Prize Tracker';
    title.style.fontWeight = 'bold';
    title.style.cursor = 'pointer';
    title.style.textDecoration = 'underline';
    title.style.color = '#000';

    title.addEventListener('mouseover', () => { title.style.color = '#2fcad4'; });
    title.addEventListener('mouseout', () => { title.style.color = '#000'; });
    title.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      headerToolsRow.style.display = isCollapsed ? 'none' : 'flex';
      panelContentContainer.style.display = isCollapsed ? 'none' : 'flex';
    });

    // ===== SEARCH BAR (80px, compact) =====
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search…';
    searchInput.style = `
      width:125px;
      font-size:8px;
      padding:1px 2px;
      border:1px solid #bbb;
      border-radius:2px;
    `;
    searchInput.addEventListener('input', renderTable);

    leftSide.append(title, searchInput);

    // TOOLS
    headerToolsRow = document.createElement('div');
    headerToolsRow.style = 'display:flex; gap:4px;';

    const btnSaveNow = document.createElement('button');
    btnSaveNow.textContent = 'Save in Browser';
    btnSaveNow.style = 'font-size:8px;padding:1px 3px;';
    btnSaveNow.addEventListener('click', () => {
      saveGM(trackerData);
      alert('Tracker data saved.');
    });

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json,.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    fileInput.addEventListener('change', handleImportJSONFile);

    const btnImportJSON = document.createElement('button');
    btnImportJSON.textContent = 'Import JSON';
    btnImportJSON.style = 'font-size:8px;padding:1px 3px;';
    btnImportJSON.addEventListener('click', () => {
      fileInput.value = '';
      fileInput.click();
    });

    const btnExportJSON = document.createElement('button');
    btnExportJSON.textContent = 'Export JSON';
    btnExportJSON.style = 'font-size:8px;padding:1px 3px;';
    btnExportJSON.addEventListener('click', exportJSON);

    const btnExportCSV = document.createElement('button');
    btnExportCSV.textContent = 'Export CSV';
    btnExportCSV.style = 'font-size:8px;padding:1px 3px;';
    btnExportCSV.addEventListener('click', exportCSV);

    const btnClear = document.createElement('button');
    btnClear.textContent = 'Clear All';
    btnClear.style = 'font-size:8px;padding:1px 3px;';
    btnClear.addEventListener('click', () => {
      if (!confirm('Delete ALL Wheel Tracker data?')) return;
      trackerData = {};
      saveGM(trackerData);
      renderTable();
    });

    headerToolsRow.append(btnSaveNow, btnImportJSON, btnExportJSON, btnExportCSV, btnClear);

    header.append(leftSide, headerToolsRow);
    panel.appendChild(header);

    // CONTENT
    panelContentContainer = document.createElement('div');
    panelContentContainer.style = `
      display:flex;
      flex-direction:column;
      overflow:hidden;
      flex:1;
    `;

    const wrap = document.createElement('div');
    wrap.style = `flex:1; overflow:auto; padding:2px;`;

    const table = document.createElement('table');
    table.id = 'wocTrackerTable';
    table.style = `width:100%; border-collapse:collapse; font-family:Verdana,sans-serif; font-size:8px;`;

    wrap.appendChild(table);
    panelContentContainer.appendChild(wrap);
    /* ---------------- Manual Add/Edit Section ---------------- */
    const manual = document.createElement('div');
    manual.style = `
      padding:2px;
      background:#fafafa;
      border-top:1px solid #ccc;
      font-size:8px;
    `;

    manual.innerHTML = `
      <div style="margin-bottom:2px;">Manual Entry — Add New/Edit/Overwrite Existing Row</div>
      <div id="manualContainer"
           style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;
                  justify-content:flex-start;width:100%;padding:1px;">
        <label>User:<input id="wocManualUser"  type="text" style="font-size:8px;"></label>
        <label>Date:<input id="wocManualDate"  type="text" placeholder="MM/DD/YYYY" style="font-size:8px;"></label>
        <label>Spin 1:<input id="wocManualSpin1" type="text" style="font-size:8px;"></label>
        <label>Spin 2:<input id="wocManualSpin2" type="text" style="font-size:8px;"></label>
        <button id="wocManualCopy" style="font-size:8px;padding:1px 4px;">Copy Row</button>
        <button id="wocManualSave" style="font-size:8px;padding:1px 4px;">Save</button>
      </div>
    `;
    panelContentContainer.appendChild(manual);

    panel.appendChild(panelContentContainer);
    document.body.appendChild(panel);

    /* Collapsible panel */
    title.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      headerToolsRow.style.display = isCollapsed ? 'none' : 'flex';
      searchInput.style.display     = isCollapsed ? 'none' : 'inline-block';
      panelContentContainer.style.display = isCollapsed ? 'none' : 'flex';
    });

    /* Manual listeners */
    document.getElementById('wocManualSave').addEventListener('click', handleManualSave);
    document.getElementById('wocManualCopy').addEventListener('click', copyManualRow);

    /* Smart Paste */
    document.getElementById('manualContainer').addEventListener('paste', (event) => {
      const txt = (event.clipboardData || window.clipboardData).getData('text');
      if (txt.includes("User:") && txt.includes("Date:")) {
        event.preventDefault();
        parsePastedBlock(txt);
      }
    });

    renderTable();
  }

  /* ---------------- Smart Paste Parser ---------------- */
  function parsePastedBlock(text) {
    const user  = text.match(/User:\s*(.+)/)?.[1] || "";
    const date  = text.match(/Date:\s*(.+)/)?.[1] || "";
    const spin1 = text.match(/Spin 1:\s*(.*)/)?.[1] || "";
    const spin2 = text.match(/Spin 2:\s*(.*)/)?.[1] || "";

    document.getElementById('wocManualUser').value  = user.trim();
    document.getElementById('wocManualDate').value  = date.trim();
    document.getElementById('wocManualSpin1').value = spin1.trim();
    document.getElementById('wocManualSpin2').value = spin2.trim();

    editOriginalUser = null;
    editOriginalDate = null;
  }

  /* ---------------- Table Renderer (with highlight & filter) ---------------- */
  function renderTable() {
    const table = document.getElementById('wocTrackerTable');
    if (!table) return;

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

    table.innerHTML = "";

    /* Header */
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');

    const headers = [
      { label: 'Username',    width: '90px' },
      { label: 'Date (NST)',  width: '70px' },
      { label: 'Spin 1 Prize', width: 'auto' },
      { label: 'Spin 2 Prize', width: 'auto' }
    ];

    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h.label;
      th.style = `
        font-family:Verdana,sans-serif;
        font-size:8px;
        font-weight:bold;
        padding:2px 4px;
        text-align:left;
        border-bottom:1px solid #999;
        width:${h.width};
        white-space:nowrap;
      `;
      trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const entries = getAllEntriesArray();

    entries.forEach(e => {
      const rowKey = `${e.username}|${e.date}`;

      /* FILTER: hide non-matching rows */
      const rowText = `${e.username} ${e.date} ${e.spin1Prize} ${e.spin2Prize}`.toLowerCase();
      if (searchTerm && !rowText.includes(searchTerm)) return;

      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';

      /* NEW — Highlight latest added row */
      if (latestEditedKey && rowKey === latestEditedKey) {
        tr.style.background = '#fff7d1'; /* pale gold highlight */
      }

      tr.addEventListener('click', () => populateManualForm(e));

      [e.username, e.date, e.spin1Prize || '', e.spin2Prize || ''].forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        td.style = `
          font-family:Verdana,sans-serif;
          font-size:8px;
          padding:2px 4px;
          border-bottom:1px solid #eee;
          word-break:break-word;
          text-align:left;
        `;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  /* ---------------- Edit Form Populate ---------------- */
  function populateManualForm(e) {
    editOriginalUser = e.username;
    editOriginalDate = e.date;

    document.getElementById('wocManualUser').value  = e.username;
    document.getElementById('wocManualDate').value  = convertToMMDDYYYY(e.date);
    document.getElementById('wocManualSpin1').value = e.spin1Prize || '';
    document.getElementById('wocManualSpin2').value = e.spin2Prize || '';
  }

  /* ---------------- Manual Save Handler ---------------- */
  function handleManualSave() {
    const newUser = document.getElementById('wocManualUser').value.trim();
    const dateIn  = document.getElementById('wocManualDate').value.trim();
    const s1      = document.getElementById('wocManualSpin1').value.trim();
    const s2      = document.getElementById('wocManualSpin2').value.trim();

    if (!newUser || !dateIn) {
      alert('Username and Date are required.');
      return;
    }

    const parts = dateIn.split('/');
    if (parts.length !== 3) {
      alert('Date must be MM/DD/YYYY');
      return;
    }

    const mm = parts[0].padStart(2, '0');
    const dd = parts[1].padStart(2, '0');
    const yy = parts[2];
    const newDate = `${yy}-${mm}-${dd}`;

    /* If editing, remove the old row when needed */
    if (editOriginalUser && editOriginalDate) {
      const sameRow = newUser === editOriginalUser && newDate === editOriginalDate;
      if (!sameRow) {
        if (trackerData[editOriginalUser]) {
          delete trackerData[editOriginalUser][editOriginalDate];
          if (Object.keys(trackerData[editOriginalUser]).length === 0) {
            delete trackerData[editOriginalUser];
          }
        }
      }
    }

    const entry = ensureEntry(newUser, newDate);
    entry.spin1Prize = s1;
    entry.spin2Prize = s2;

    saveGM(trackerData);

    /* NEW — highlight this */
    latestEditedKey = `${newUser}|${newDate}`;

    renderTable();

    /* clear form */
    document.getElementById('wocManualUser').value  = '';
    document.getElementById('wocManualDate').value  = '';
    document.getElementById('wocManualSpin1').value = '';
    document.getElementById('wocManualSpin2').value = '';

    editOriginalUser = null;
    editOriginalDate = null;
  }

  /* ---------------- Copy Row ---------------- */
  function copyManualRow() {
    const u  = document.getElementById('wocManualUser').value.trim();
    const d  = document.getElementById('wocManualDate').value.trim();
    const s1 = document.getElementById('wocManualSpin1').value.trim();
    const s2 = document.getElementById('wocManualSpin2').value.trim();

    if (!u || !d) {
      alert('Nothing to copy — fill User and Date first.');
      return;
    }

    const text =
`User: ${u}
Date: ${d}
Spin 1: ${s1}
Spin 2: ${s2}`;

    navigator.clipboard.writeText(text).then(() =>
      alert('Copied!')
    );
  }

  /* ---------------- CSV Export ---------------- */
  function exportCSV() {
    const entries = getAllEntriesArray();
    if (!entries.length) return alert('No data to export.');

    const rows = [
      ['Username', 'Neo Date (NST)', 'Spin 1 Prize', 'Spin 2 Prize'].join(',')
    ];

    entries.forEach(e => {
      const row = [
        e.username,
        e.date,
        (e.spin1Prize || '').replace(/"/g, '""'),
        (e.spin2Prize || '').replace(/"/g, '""')
      ].map(v => `"${v}"`);
      rows.push(row.join(','));
    });

    const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'wheel_of_celebration_tracker.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------------- JSON Export ---------------- */
  function exportJSON() {
    const str = JSON.stringify(trackerData, null, 2);
    const blob = new Blob([str], { type: 'application/json;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'wheel_of_celebration_tracker.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------------- JSON Import + Merge ---------------- */
  function mergeImportedData(current, imported) {
  const result = JSON.parse(JSON.stringify(current));

  for (const user in imported) {
    if (!user) continue;

    if (!result[user]) result[user] = {};
    const userBlock = imported[user];

    for (const date in userBlock) {
      if (!date) continue;
      const imp = userBlock[date];
      if (!imp) continue;

      // normalize date (accept MM/DD/YYYY OR YYYY-MM-DD)
      let isoDate = date;
      if (date.includes("/")) {
        const [m, d, y] = date.split("/");
        isoDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }

      if (!result[user][isoDate]) {
        result[user][isoDate] = {
          username: imp.username || user,
          date: isoDate,
          spin1Prize: imp.spin1Prize || "",
          spin2Prize: imp.spin2Prize || ""
        };
      } else {
        // merge missing fields gracefully
        const existing = result[user][isoDate];
        existing.username   = existing.username   || imp.username || user;
        existing.date       = existing.date       || isoDate;
        existing.spin1Prize = existing.spin1Prize || imp.spin1Prize || "";
        existing.spin2Prize = existing.spin2Prize || imp.spin2Prize || "";
      }
    }
  }

  return result;
}

  function handleImportJSONFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        let imported;

        if (Array.isArray(parsed)) {
          imported = {};
          parsed.forEach(entry => {
            const u = (entry.username || '').trim() || 'Unknown';
            const d = (entry.date || '').trim();
            if (!d) return;
            if (!imported[u]) imported[u] = {};
            imported[u][d] = {
              username: u,
              date: d,
              spin1Prize: entry.spin1Prize || '',
              spin2Prize: entry.spin2Prize || ''
            };
          });
        } else {
          imported = parsed;
        }

        trackerData = mergeImportedData(trackerData, imported);
        saveGM(trackerData);
        renderTable();
        alert('JSON imported & merged.');
      } catch {
        alert('Invalid JSON.');
      }
    };

    reader.readAsText(file);
  }

  /* ---------------- Prize Popup Logic (Fixed Duplicate Issue) ---------------- */
  function handlePrizePopup() {
    const popup = document.getElementById('wheelPrizePopup');
    if (!popup || !isVisible(popup)) return;

    const itemEl = popup.querySelector('#itemName');
    let item = itemEl ? itemEl.textContent.trim() : "";

    if (item.includes('.')) {
      item = item.split('.')[0].trim() + '.';
    }

    let codes = [];
    const discountBox = popup.querySelector('.wheelDiscountCode');
    if (discountBox && isVisible(discountBox)) {
      discountBox.querySelectorAll('input').forEach(inp => {
        const v = (inp.value || '').trim();
        if (v && v.length >= 5) codes.push(v);
      });
    }

    const username = getUsername();
    const date = getNeoDateString();
    const entry = ensureEntry(username, date);

    let slot = "";
    if (!entry.spin1Prize) slot = "spin1";
    else if (!entry.spin2Prize) slot = "spin2";
    else return;

    let prizeText = "";

    if (codes.length > 0) {
      prizeText = "Discount Codes: " + codes.join(", ");

      // **Corrected**: do NOT append item on spin2
      if (slot === "spin1" && item) {
        prizeText += " | " + item;
      }
    } else {
      prizeText = item || "(Unknown prize)";
    }

    const sig = `${username}|${date}|${slot}|${prizeText}`;
    if (sig === lastLoggedSignature) return;
    lastLoggedSignature = sig;

    if (slot === "spin1") entry.spin1Prize = prizeText;
    else entry.spin2Prize = prizeText;

    latestEditedKey = `${username}|${date}`;
    saveGM(trackerData);
    renderTable();
  }

  function setupObserver() {
    const popup = document.getElementById('wheelPrizePopup');
    if (!popup) return setTimeout(setupObserver, 1000);

    handlePrizePopup();
    new MutationObserver(handlePrizePopup).observe(popup, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  function init() {
    createPanel();
    setupObserver();
  }

  if (document.readyState !== 'loading') {
    setTimeout(init, 600);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 600));
  }

})();
