// ==UserScript==
// @name Empresia.es Position Extractor Improved
// @namespace https://empresia.es/
// @version 5
// @description Extracts company positions from empresia.es
// @author GPT-5, enhanced by Claude and Grok
// @match *://*.empresia.es/persona/*
// @icon https://www.empresia.es/favicon.ico
// @run-at document-end
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/555588/Empresiaes%20Position%20Extractor%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/555588/Empresiaes%20Position%20Extractor%20Improved.meta.js
// ==/UserScript==
(function () {
  'use strict';
  /*********** Utility Functions ***********/
  function removeAccents(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ñÑ]/g, (m) => (m === 'ñ' ? 'n' : 'N'));
  }
  function normalizeName(name) {
    name = removeAccents(name).replace(/\s+/g, ' ').trim();
    name = name
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\b(Sl|Slu|Sa|Scp|Sca)\b/gi, (m) => m.toUpperCase());
    return name;
  }

  // Helper function to check if a position should be excluded
  function isLiquidadorPosition(position) {
    const normalized = position.toLowerCase().trim();
    return normalized === 'liquidador' ||
           normalized.includes('liq.') ||
           normalized.startsWith('liq ');
  }

  const translate = {
    'Consej. Del. Solid.': 'Joint Managing Director',
    'Consej. Del. Mancom.': 'Joint Managing Director',
    'Consej. Del.': 'CEO',
    'Socio Unico': 'owner',
    'Socio Único': 'owner',
    'Consej.': 'Board Member',
    'Presid.': 'Chairman',
    'Presid. Ejecutivo': 'Executive Chairman',
    'Vicepres.': 'Vice Chairman',
    'Represent.143 RRM': 'Representative',
    'Represent.': 'Representative',
    'Adm. Unico': 'Sole Administrator',
    'Adm. Solid.': 'Director',
    'Adm. Mancom.': 'Manager',
    'Apod. Solid.': 'Manager',
    'Apod. Mancom.': 'Manager',
    'Apod. Mancom./Solid.': 'Manager',
    'Secr. No Consej.': 'Non-Director Secretary',
    'Vicesecr. No Consej.': 'Non-Director Vice Secretary',
    'Vicesecr.': 'Vice Secretary',
    'Apod.': 'Authorised Signatory',
    'Miem. Com. Ejec.': 'Member of the Executive Committee',
    'Presid. Com. Ejec.': 'Chairman of the Executive Committee',
    'Secr.': 'Secretary',
    'Administrador Mancomunado': 'Manager',
    'Administrador Unico': 'Sole Administrator',
    'Administrador Solidario': 'Director',
    'Presidente': 'Chairman',
    'Vicepresidente': 'Vice Chairman',
    'Consejero': 'Board Member',
    'Apoderado': 'Authorised Signatory',
    'Director General': 'CEO',
    'Director Ejecutivo': 'CEO',
    'Director Financiero': 'CFO',
    'Director de Finanzas': 'CFO',
    'Director de Operaciones': 'COO',
    'Consejero independiente': 'Non-Executive Director',
    'Representante': 'Representative',
    'Patronato': 'Trustee',
    'Apoderado Mancomunado': 'Manager',
    'Miembro del consejo de administracion': 'Board Member'
  };
  const positionPriority = {
    'CEO': 1,
    'Executive Chairman': 2,
    'Chairman': 3,
    'Vice Chairman': 4,
    'owner': 5,
    'Sole Administrator': 6,
    'CFO': 7,
    'COO': 8,
    'Secretary': 9,
    'Board Member': 10,
    'Non-Executive Director': 11,
    'Director': 12,
    'Manager': 13,
    'Joint Managing Director': 14,
    'Representative': 15,
    'Authorised Signatory': 16,
    'Trustee': 17,
    'Member of the Executive Committee': 18,
    'Chairman of the Executive Committee': 19
  };
  /*********** Extraction ***********/
  function extractTable() {
    const rows = document.querySelectorAll('table tr');
    const data = [];
    rows.forEach((row, i) => {
      if (i === 0) return;
      const cells = row.querySelectorAll('td');
      if (cells.length < 4) return;
      const entidad = cells[0]?.textContent?.trim() || '';
      const relacion = cells[1]?.textContent?.trim() || '';
      const desde = row.querySelector('td.td-relent-desde')?.textContent?.trim() || '';
      const hasta = row.querySelector('td.td-relent-hasta')?.textContent?.trim() || '';
      if (/EXTINGUIDA/i.test(entidad)) return;

      // Skip if the original position is Liquidador or contains liq.
      if (isLiquidadorPosition(relacion)) return;

      let position = relacion;

      // Sort keys by length (longest first) to match most specific patterns first
      const sortedKeys = Object.keys(translate).sort((a, b) => b.length - a.length);

      for (const key of sortedKeys) {
        if (position.includes(key)) {
          position = position.replace(key, translate[key]);
          break; // Stop after first match to avoid double replacements
        }
      }

      position = removeAccents(position);

      // Double-check after translation - skip if still contains liq.
      if (isLiquidadorPosition(position)) return;

      const name = normalizeName(entidad);
      const hasDesde = desde && /\d/.test(desde);
      const hasHasta = hasta && /\d/.test(hasta);
      let category;
      if (hasDesde && hasHasta) {
        category = 'previous';
      } else if (hasDesde && !hasHasta) {
        category = 'current';
      } else if (!hasDesde && hasHasta) {
        category = 'previous';
      } else {
        category = 'current';
      }
      data.push({ name, position, category });
    });
    return data;
  }
  /*********** Group with multiple-date handling ***********/
  function groupByCompany(data) {
    const grouped = {
      current: {},
      previous: {}
    };
    data.forEach(({ name, position, category }) => {
      if (!grouped[category][name]) {
        grouped[category][name] = [];
      }
      grouped[category][name].push(position);
    });
    ['current', 'previous'].forEach(cat => {
      Object.keys(grouped[cat]).forEach((name) => {
        let positions = grouped[cat][name];

        // Filter out any Liquidador positions that might have slipped through
        positions = positions.filter((p) => !isLiquidadorPosition(p));

        // Remove Director if Joint Managing Director exists
        if (positions.includes('Joint Managing Director') && positions.includes('Director')) {
          positions = positions.filter((p) => p !== 'Director');
        }

        // Remove Board Member if Vice Chairman exists
        if (positions.includes('Vice Chairman') && positions.includes('Board Member')) {
          positions = positions.filter((p) => p !== 'Board Member');
        }

        if (positions.includes('Chairman') && positions.includes('Board Member')) {
          positions = positions.filter((p) => p !== 'Board Member');
        }

        // Remove duplicates (e.g., multiple "Manager" from different Spanish terms)
        positions = [...new Set(positions)];

        positions = positions.sort(
          (a, b) => (positionPriority[a] || 999) - (positionPriority[b] || 999)
        );
        grouped[cat][name] = positions;
      });

      // Remove companies with no positions left after filtering
      Object.keys(grouped[cat]).forEach((name) => {
        if (grouped[cat][name].length === 0) {
          delete grouped[cat][name];
        }
      });
    });
    return grouped;
  }
  /*********** Format Output ***********/
  function formatResults(grouped) {
    const current = [];
    const previous = [];
    Object.entries(grouped.current).forEach(([name, positions]) => {
      const posStr = positions.join(', ');
      current.push(`- ${name}, ${posStr}`);
    });
    Object.entries(grouped.previous).forEach(([name, positions]) => {
      const posStr = positions.join(', ');
      previous.push(`- ${name}, ${posStr}`);
    });
    return `Other positions:\n${current.join('\n')}\n\nPrevious positions:\n${previous.join('\n')}`;
  }
  /*********** Popup Display ***********/
  function showPopup(text) {
    const popup = document.createElement('div');
    popup.innerHTML = `
      <div id="empresiaPopup" style="position:fixed;top:80px;right:20px;width:450px;background:#fff;border:2px solid #444;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:15px;font-family:sans-serif;z-index:9999;transition:width 0.3s ease,right 0.3s ease;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <b style="font-size:16px;">Empresia.es Extractor</b>
          <button id="closeBtn" style="background:#d32f2f;color:white;border:none;border-radius:4px;padding:5px 10px;cursor:pointer;font-weight:bold;">✕</button>
        </div>
        <textarea id="resultText" style="width:100%;height:60vh;resize:vertical;white-space:pre-wrap;font-size:13px;background:#f5f5f5;padding:10px;border-radius:4px;border:1px solid #ccc;">${text}</textarea>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="copyBtn" style="flex:1;background:#1976d2;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Copy to Clipboard</button>
          <button id="editBtn" style="flex:1;background:#ff9800;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Edit</button>
        </div>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="stretchBtn" style="flex:1;background:#4caf50;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">↔ Stretch</button>
          <button id="zoomInBtn" style="background:#9c27b0;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">🔍+</button>
          <button id="zoomOutBtn" style="background:#9c27b0;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">🔍-</button>
        </div>
      </div>`;
    document.body.appendChild(popup);
    const popupDiv = popup.querySelector('#empresiaPopup');
    const textarea = popup.querySelector('#resultText');
    textarea.readOnly = true;
    let isStretched = false;
    let currentZoom = 13;
    popup.querySelector('#closeBtn').addEventListener('click', () => popup.remove());
    popup.querySelector('#copyBtn').addEventListener('click', () => {
      GM_setClipboard(textarea.value);
      const btn = popup.querySelector('#copyBtn');
      btn.textContent = '✓ Copied!';
      setTimeout(() => (btn.textContent = 'Copy to Clipboard'), 2000);
    });
    popup.querySelector('#editBtn').addEventListener('click', (e) => {
      const editable = !textarea.readOnly;
      textarea.readOnly = editable;
      textarea.style.background = editable ? '#f5f5f5' : '#fff8e1';
      e.target.textContent = editable ? 'Edit' : 'Lock';
    });
    popup.querySelector('#stretchBtn').addEventListener('click', (e) => {
      isStretched = !isStretched;
      if (isStretched) {
        popupDiv.style.width = '800px';
        popupDiv.style.right = '20px';
        e.target.textContent = '↔ Shrink';
      } else {
        popupDiv.style.width = '450px';
        popupDiv.style.right = '20px';
        e.target.textContent = '↔ Stretch';
      }
    });
    popup.querySelector('#zoomInBtn').addEventListener('click', () => {
      currentZoom = Math.min(currentZoom + 2, 24);
      textarea.style.fontSize = currentZoom + 'px';
    });
    popup.querySelector('#zoomOutBtn').addEventListener('click', () => {
      currentZoom = Math.max(currentZoom - 2, 8);
      textarea.style.fontSize = currentZoom + 'px';
    });
  }
  /*********** Click "Ver más" button until all loaded ***********/
  async function clickVerMasButton() {
    let clicked = false;
    let attemptCount = 0;
    const maxAttempts = 10;
    while (attemptCount < maxAttempts) {
      const verMasLink = document.querySelector('a.btn.btn-success.EventosFooter');
      if (!verMasLink || verMasLink.style.display === 'none' || !verMasLink.offsetParent) {
        break;
      }
      try {
        const initialRowCount = document.querySelectorAll('table tr').length;
        verMasLink.click();
        clicked = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newRowCount = document.querySelectorAll('table tr').length;
        if (newRowCount <= initialRowCount) {
          break;
        }
      } catch (e) {
        console.error('Error clicking Ver más:', e);
        break;
      }
      attemptCount++;
    }
    return clicked;
  }
  /*********** Init ***********/
  async function init() {
    await new Promise((r) => setTimeout(r, 1500));
    const hasVerMas = await clickVerMasButton();
    if (hasVerMas) {
      await new Promise((r) => setTimeout(r, 1000));
    }
    const data = extractTable();
    const grouped = groupByCompany(data);
    const formatted = formatResults(grouped);
    showPopup(formatted);
    console.log(formatted);
  }
  window.addEventListener('load', () => setTimeout(init, 2000));
})();