// ==UserScript==
// @name        WebDoc - förbättra e-recept
// @namespace   http://tampermonkey.net/
// @version     3.4
// @description Markerar gamla ordinationer, sammanfattar förskrivningsdatum, flyttar ikonkolumn, stylar knappar, flyttar ikoner, gör checkbox-kolumnen smal m.m. + markerar restnoterade läkemedel via global window.RESTNOTERINGAR.
// @author      AI
// @match       https://webdoc.atlan.se/*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/549210/WebDoc%20-%20f%C3%B6rb%C3%A4ttra%20e-recept.user.js
// @updateURL https://update.greasyfork.org/scripts/549210/WebDoc%20-%20f%C3%B6rb%C3%A4ttra%20e-recept.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const LOGTAG = '[OldRx]';
  const DEBUG = false; // 🔁 Ändra till 'true' för att aktivera debug-loggar
  function dlog(...a) { if (DEBUG) console.log(LOGTAG, ...a); }

  // ---------- Stil ----------
  function addStyles() {
    const styleId = 'old-prescription-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Rödfärga gamla ordinationer */
      tr.old-prescription td, tr.old-prescription td * {
        color: red !important;
        font-weight: 700 !important;
      }
      tr.old-prescription td {
        background-color: #fff1f1 !important;
      }

      /* Fallback styling för stjärncontainer */
      .oldrx-stars {
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
      }

      /* Gör första kolumnen (checkbox) supersmal */
      #DrugPrescriptionTable th:first-child,
      #DrugPrescriptionTable td:first-child {
        width: 32px !important;
        max-width: 32px !important;
        text-align: center;
        padding-left: 0;
        padding-right: 0;
      }
      #DrugPrescriptionTable td:first-child input[type="checkbox"] {
        margin: 0 auto;
        display: block;
      }

      /* Stil för restnoteringsvarning */
      .restnotering-varning {
        color: #555 !important;
        font-size: 0.85em !important;
        padding-top: 4px !important;
        font-weight: bold !important;
        background-color: #fff9e6 !important;
      }

      /* Stil för genomstruken text på hela raden */
      .restnoterad td,
      .restnoterad th {
        text-decoration: line-through !important;
        color: #888 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- Hjälpare ----------
  function parseDate(dateText) {
    const m = (dateText || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function isOlderThanOneYear(date) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return date < cutoff;
  }
  function getHeaderCells(table) {
    const headerRow = table.querySelector('thead tr');
    return headerRow ? Array.from(headerRow.children) : [];
  }
  function getHeaderIndexByText(table, label) {
    const headers = getHeaderCells(table);
    const wanted = label.toLowerCase();
    for (let i = 0; i < headers.length; i++) {
      const txt = headers[i].textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      if (txt === wanted) return i;
    }
    return -1;
  }

  // ---------- Kolumnflytt ----------
  function moveColumn(table, fromIdx, toIdx, moveHeader=true) {
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    if (moveHeader) {
      const theadRow = table.querySelector('thead tr');
      const ths = Array.from(theadRow.children);
      if (ths[fromIdx]) {
        theadRow.insertBefore(ths[fromIdx], ths[toIdx] || null);
      }
    }
    table.querySelectorAll('tbody tr').forEach(row => {
      const tds = Array.from(row.children);
      if (tds[fromIdx]) {
        row.insertBefore(tds[fromIdx], tds[toIdx] || null);
      }
    });
  }

  function ensureIconColumnAtFarLeft(table) {
    let fromIdx = Number.isInteger(+table.dataset.oldrxIconFromIdx) ? +table.dataset.oldrxIconFromIdx : null;
    if (fromIdx == null) {
      const kommentarIdx = getHeaderIndexByText(table, 'Kommentar');
      if (kommentarIdx === -1) return;
      const iconIdx = kommentarIdx + 1;
      const headerCount = getHeaderCells(table).length;
      if (iconIdx >= headerCount) return;
      moveColumn(table, iconIdx, 0, true);
      table.dataset.oldrxIconFromIdx = String(iconIdx);
      // dlog('Flyttade ikonkolumnen till vänster.');
    } else {
      moveColumn(table, fromIdx, 0, false);
    }
    cleanupAndMoveIcons(table);
  }

  // ---------- Ikonflytt & städning ----------
  function cleanupAndMoveIcons(table) {
    const medIdx = getHeaderIndexByText(table, 'Läkemedel');
    if (medIdx === -1) return;

    table.querySelectorAll('tbody tr').forEach(row => {
      const firstCell = row.children[0];
      const medCell = row.children[medIdx];
      if (!firstCell || !medCell) return;

      // Hitta <a>-taggen som innehåller FASS-ikonen
      const fassLink = firstCell.querySelector('a[href="#"][onclick*="FassInformation"]');
      const checkbox = firstCell.querySelector('input[type="checkbox"]');

      if (fassLink) {
        // ✅ Förhindra att klick bubblar upp till raden
        const originalOnClick = fassLink.onclick;
        fassLink.onclick = function(e) {
          if (e) e.stopPropagation();
          if (originalOnClick) return originalOnClick.apply(this, arguments);
        };

        // Flytta hela länken till början av läkemedelscellen
        medCell.insertBefore(fassLink, medCell.firstChild);
      }

      // Behåll bara checkboxen i första cellen
      Array.from(firstCell.childNodes).forEach(node => {
        if (node !== checkbox) node.remove();
      });
    });
  }

  // ---------- Sammanfattning ----------
  function findInfoElement() {
    return document.getElementById('DrugPrescriptionTable_info')
        || document.getElementById('OldRx_summary_info')
        || document.querySelector('#DrugPrescriptionTable_wrapper .dataTables_info')
        || document.querySelector('.dataTables_info');
  }
  function updatePrescriptionSummary(table) {
    const infoElement = findInfoElement();
    if (!infoElement) return;

    const dateIdx = getHeaderIndexByText(table, 'Datum');
    if (dateIdx === -1) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const totalPrescriptions = rows.length;

    const uniqueDates = new Set();
    for (const row of rows) {
      const cell = row.children[dateIdx];
      if (!cell) continue;
      let val = (cell.textContent || '').trim();
      // Extra säkerhet: ignorera tomma eller ogiltiga datum
      if (!val || val.length !== 10 || !val.match(/^\d{4}-\d{2}-\d{2}$/)) continue;
      uniqueDates.add(val);
    }
    const uniqueDateCount = uniqueDates.size;

    if (totalPrescriptions === 0) {
      infoElement.textContent = "Inga ordinationer hittades.";
      return;
    }

    // if (DEBUG) console.log(LOGTAG, "Unika datum:", [...uniqueDates]);

    let stars;
    if (uniqueDateCount === 1) stars = 5;
    else stars = Math.max(0, 5 - (uniqueDateCount - 1));
    const gold = '★'.repeat(stars);
    const grey = '☆'.repeat(5 - stars);

    infoElement.innerHTML = `
      <span style="font-weight: bold; margin-right: 10px;">
        Dessa ${totalPrescriptions} recept har ${uniqueDateCount} olika förskrivningsdatum
      </span>
      <span class="oldrx-stars" style="font-size: 2.2em; font-family: monospace; vertical-align: middle; margin-left: .4rem;">
        <span style="color: #FFD700; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${gold}</span><span style="color: #888888;">${grey}</span>
      </span>
    `;
  }
  function markOldPrescriptions(table) {
    const dateIdx = getHeaderIndexByText(table, 'Datum');
    if (dateIdx === -1) return;
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const dateCell = row.children[dateIdx];
      const dt = dateCell ? parseDate(dateCell.textContent) : null;
      if (dt && isOlderThanOneYear(dt)) row.classList.add('old-prescription');
    });
    updatePrescriptionSummary(table);
  }

  // ---------- Knappar ----------
  function moveButtons() {
    const ordinationBtn = document.getElementById('ToolTables_DrugPrescriptionTable_0');
    if (!ordinationBtn) return;
    const topTable = document.querySelector('#DrugTableForm > table');
    if (!topTable) return;

    const buttons = topTable.querySelectorAll('input[type="button"][value="Sätt ut"], input[type="button"][value="Förnya"]');
    buttons.forEach(btn => {
      ordinationBtn.parentNode.appendChild(btn);
      btn.style.marginLeft = '10px';
      btn.className = ordinationBtn.className; // ge samma stil som Ordination
    });
    // dlog('Flyttade & stylade knapparna.');
  }

  // ---------- RESTNOTERINGAR (LÄSER GLOBAL window.RESTNOTERINGAR) ----------
  async function markRestnoteradeIListan(table) {
    // Vänta max 8 sekunder på att window.RESTNOTERINGAR ska finnas
    const timeout = 8000;
    const start = Date.now();
    let attempts = 0;

    while (!(window.RESTNOTERINGAR && Array.isArray(window.RESTNOTERINGAR) && window.RESTNOTERINGAR.length > 0)) {
        attempts++;
        if (Date.now() - start > timeout) {
            // console.warn(LOGTAG, "Timeout: window.RESTNOTERINGAR hittades inte efter 8 sekunder.");
            return;
        }
        await new Promise(r => setTimeout(r, 200));
    }

    const medIdx = getHeaderIndexByText(table, 'Läkemedel');
    if (medIdx === -1) return;

    table.querySelectorAll('tbody tr').forEach(row => {
        if (row.dataset.restnoteradProcessed) return;

        const medCell = row.children[medIdx];
        if (!medCell) return;

        const fassLink = medCell?.querySelector('a[href="#"][onclick*="FassInformation"]');
        let nplId = null;

        if (fassLink && fassLink.getAttribute('onclick')) {
            const onclick = fassLink.getAttribute('onclick');
            const match = onclick.match(/[?&]nplId=(\d+)/);
            if (match) {
                nplId = match[1];
                // dlog(`✅ Hittade nplId: ${nplId} i läkemedelskolumnen`);
            } else {
                // dlog("❌ Hittade ingen nplId i onclick:", onclick);
            }
        } else {
            // dlog("❌ Hittade ingen FASS-länk i läkemedelskolumnen", medCell);
        }

        const match = window.RESTNOTERINGAR.find(entry => entry.npl_packid === nplId);

        if (match) {
            row.classList.add('restnoterad');

            const newRow = document.createElement('tr');
            newRow.style.display = 'table-row';
            newRow.style.backgroundColor = '#fff9e6';
            newRow.style.fontSize = '1em';
            newRow.style.fontWeight = 'bold';
            newRow.style.color = '#555';
            newRow.style.padding = '4px 0';

            const newCell = document.createElement('td');
            newCell.colSpan = 100;
            newCell.className = 'restnotering-varning';
            newCell.textContent = genereraVarningstext(match.startdatum, match.slutdatum);

            newRow.appendChild(newCell);
            row.parentNode.insertBefore(newRow, row.nextSibling); // ✅ Endast EN gång!

            row.dataset.restnoteradProcessed = 'true';
        }
    });
  }

  function genereraVarningstext(startdatum, slutdatum) {
      if (!startdatum) return "Restnoterat (datum saknas)";
      if (slutdatum && slutdatum.trim() !== "") {
          return `Restnoterat under perioden ${startdatum} - ${slutdatum}`;
      } else {
          return `Restnoterat fr. o. m. ${startdatum} tillsvidare.`;
      }
  }

  // ---------- Init ----------
  async function initForCurrentTable(table) {
    if (table.dataset.oldrxInit === '1') return;
    table.dataset.oldrxInit = '1';

    ensureIconColumnAtFarLeft(table);
    markOldPrescriptions(table);
    moveButtons();
    await markRestnoteradeIListan(table);

    try {
      const $ = window.jQuery || window.$;
      if ($ && $.fn?.dataTable) {
        $(table).off('draw.dt.oldrx').on('draw.dt.oldrx', async () => {
          ensureIconColumnAtFarLeft(table);
          markOldPrescriptions(table);
          moveButtons();
          await markRestnoteradeIListan(table);
        });
      }
    } catch (e) {
      // dlog("Fel vid koppling av DataTables-event:", e);
    }
  }

  function observeBody() {
    const obs = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const table = node.id === 'DrugPrescriptionTable' ? node : node.querySelector?.('#DrugPrescriptionTable');
              if (table && table.nodeName === 'TABLE') initForCurrentTable(table);
            }
          });
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ---------- Start ----------
  addStyles();

  const initialTable = document.getElementById('DrugPrescriptionTable');
  if (initialTable) initForCurrentTable(initialTable);
  observeBody();
})();