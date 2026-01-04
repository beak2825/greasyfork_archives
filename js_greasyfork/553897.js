// ==UserScript==
// @name         Waze Checker Export
// @version      0.1.3
// @description  Export data from Waze Checker to TSV format.
// @author       FalconTech
// @match        https://checker.waze.uz/checker/errorlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labtool.pl
// @namespace    https://greasyfork.org/users/205544
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      checker.waze.uz
// @connect      waze.com
// @connect      www.waze.com
// @connect      beta.waze.com
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/553897/Waze%20Checker%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/553897/Waze%20Checker%20Export.meta.js
// ==/UserScript==

/* Changelog:
 *  0.1.3 - SelectAllButton
 *  0.1.1 - Beta testing
 */

(function() {
  'use strict';

  const TEXTAREA_ID = 'waze-export-textarea';
  const TOOLBAR_ID = 'waze-export-toolbar';

  let ROADTYPE_IDX = null;
  let LOCK_IDX = null;
  const STORAGE_DATA_KEY = 'waze-export-data';


  function waitFor(selector, root = document, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const el = root.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = root.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
      obs.observe(root === document ? document.documentElement : root, { childList: true, subtree: true });
      if (timeoutMs) setTimeout(() => { obs.disconnect(); reject(new Error('Timeout waiting for ' + selector)); }, timeoutMs);
    });
  }

  function ensureToolbar(container) {
    if (document.getElementById(TOOLBAR_ID)) return document.getElementById(TOOLBAR_ID);
    const wrap = document.createElement('div');
    wrap.id = TOOLBAR_ID;
    wrap.style.margin = '12px 12px 6px';

    const baseButtonStyle = {
      border: '2px dotted var(--bs-border-color)',
      borderRadius: '8px',
      padding: '4px 30px',
      marginRight: '8px',
      cursor: 'pointer',
      background: 'transparent'
    };

    const applyButtonStyle = (btn) => {
      Object.assign(btn.style, baseButtonStyle);
    };

    const btnCopy = document.createElement('button');
    btnCopy.type = 'button';
    btnCopy.textContent = 'Copy TSV';
    applyButtonStyle(btnCopy);
    btnCopy.addEventListener('click', async () => {
      const ta = document.getElementById(TEXTAREA_ID);
      if (!ta) return;
      try {
        await navigator.clipboard.writeText(ta.value);
        btnCopy.textContent = 'Copied!';
        setTimeout(() => (btnCopy.textContent = 'Copy TSV'), 1200);
      } catch (e) {
        ta.focus();
        ta.select();
        alert(' zaznaczono tekst – skopiuj ręcznie (Ctrl/Cmd+C) ');
      }
    });

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.textContent = 'Clear';
    applyButtonStyle(btnClear);
    btnClear.addEventListener('click', () => {
      const ta = document.getElementById(TEXTAREA_ID);
      if (ta) ta.value = '';
      try { localStorage.removeItem(STORAGE_DATA_KEY); } catch(_) {}
      // Uncheck all checkboxes without triggering exports
      document.querySelectorAll('input[type="checkbox"][data-gid]').forEach(cb => { cb.checked = false; });
    });

    wrap.appendChild(btnCopy);
    wrap.appendChild(btnClear);
    container.parentNode.insertBefore(wrap, container.nextSibling);
    return wrap;
  }

  function ensureTextarea(container) {
    let ta = document.getElementById(TEXTAREA_ID);
    if (ta) return ta;
    ensureToolbar(container);
    ta = document.createElement('textarea');
    ta.id = TEXTAREA_ID;
    ta.rows = 10;
    ta.wrap = 'off';
    ta.spellcheck = false;
    ta.style.width = '100%';
    ta.style.fontFamily = 'ui-monospace, Menlo, Consolas, monospace';
    ta.style.margin = '6px 0 14px 0';
    ta.style.whiteSpace = 'nowrap';
    container.parentNode.insertBefore(ta, document.getElementById(TOOLBAR_ID).nextSibling);
    const data = loadData();
    ta.value = getCombinedText(data);
    return ta;
  }

  function normalizeText(node) {
    return node.innerText.replace(/\s+/g, ' ').trim();
  }

  function absoluteUrl(href) {
    try {
      return new URL(href, location.origin).toString();
    } catch (e) {
      return href;
    }
  }

  function getCol3AsTabs(cell) {
    const nobrs = Array.from(cell.querySelectorAll('nobr'));
    let parts = nobrs.map(n => (n.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!parts.length) {
      parts = cell.innerHTML
        .split(/<br\s*\/?\s*>/i)
        .map(s => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    }
    // Limit to 3 if too many, or pad with empty strings if too few
    if (parts.length < 3) {
      while (parts.length < 3) parts.push('');
    } else if (parts.length > 3) {
      parts = parts.slice(0, 3);
    }
    return parts.join('\t');
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_DATA_KEY);
      if (!raw) return { entries: [], version: 1 };
      const obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.entries)) return { entries: [], version: 1 };
      return { entries: obj.entries.map(e => ({ gid: String(e.gid), line: String(e.line) })), version: 1 };
    } catch (_) { return { entries: [], version: 1 }; }
  }

  function saveData(data) {
    try { localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ entries: data.entries, version: 1, ts: Date.now() })); } catch (_) {}
  }

  function dataHasGid(data, gid) {
    gid = String(gid);
    return data.entries.some(e => e.gid === gid);
  }

  function upsertEntry(gid, line) {
    const data = loadData();
    const g = String(gid);
    const idx = data.entries.findIndex(e => e.gid === g);
    if (idx >= 0) {
      data.entries[idx].line = line;
    } else {
      data.entries.push({ gid: g, line });
    }
    saveData(data);
    return data;
  }

  function removeEntry(gid) {
    const data = loadData();
    const g = String(gid);
    const next = { entries: data.entries.filter(e => e.gid !== g), version: 1 };
    saveData(next);
    return next;
  }

  function getCombinedText(data) {
    return data.entries.length ? data.entries.map(e => e.line).join('\n') + '\n' : '';
  }

  function renderTextareaFromStorage(container) {
    const ta = ensureTextarea(container);
    ta.value = getCombinedText(loadData());
  }

  function computeHeaderIndices(tableEl) {
    const ths = Array.from(tableEl.querySelectorAll('thead th'));
    ROADTYPE_IDX = null;
    LOCK_IDX = null;
    ths.forEach((th, i) => {
      const label = (th.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (label.includes('roadtype')) ROADTYPE_IDX = i;
      if (label === 'lock' || label.includes(' lock')) LOCK_IDX = i;
    });
  }

  function extractGlobalIdFromHref(href) {
    // Expected /checker/go_waze/180/3/1057228237/0/
    const m = href.match(/\/go_waze\/\d+\/\d+\/(\d+)\//);
    if (m) return m[1];
    // Fallback: last long number in the path
    const m2 = href.match(/(\d{7,})/);
    return m2 ? m2[1] : null;
  }

  function getCellByHeaderIndex(tds, fallbackIndex, headerIndex) {
    if (Number.isInteger(headerIndex) && headerIndex >= 0 && headerIndex < tds.length) {
      return tds[headerIndex];
    }
    return tds[fallbackIndex];
  }

  function resolveEditorUrlGM(url) {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          timeout: 15000,
          onload: function(res) {
            const final = res.finalUrl || url;
            let loc = '';
            if (res.responseHeaders) {
              const m = res.responseHeaders.match(/\nlocation:\s*(.+)\s*/i);
              if (m && m[1]) loc = m[1].trim();
            }
            const chosen = loc ? absoluteUrl(loc) : final;
            resolve(chosen);
          },
          onerror: function(err) {
            console.error('Waze Export GM request error', err);
            resolve(url);
          },
          ontimeout: function() {
            console.warn('Waze Export GM request timeout');
            resolve(url);
          }
        });
      } catch (e) {
        console.error('Waze Export GM request exception', e);
        resolve(url);
      }
    });
  }

  function getSectionTitle(tableEl) {
    // Find nearest card header title text
    const card = tableEl.closest('.card') || document.querySelector('.card');
    if (!card) return '';
    const h5 = card.querySelector('.card-header h5');
    if (!h5) return '';
    // Normalize text and remove prefix before ':'
    let txt = (h5.textContent || '').replace(/\s+/g, ' ').trim();
    const i = txt.indexOf(':');
    if (i >= 0) txt = txt.slice(i + 1);
    return txt.trim();
  }

  function formatTodayYYYYMMDD() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  async function buildTsvLineForRow(tr, tableEl, gid) {
    const tds = tr.querySelectorAll('td');
    const col2 = tds[1];
    const col3 = tds[2];
    const col6 = getCellByHeaderIndex(tds, 5, ROADTYPE_IDX);
    const col7 = getCellByHeaderIndex(tds, 6, LOCK_IDX);
    const firstLink = col2.querySelector('a[href]');
    const href = absoluteUrl((firstLink.getAttribute('href') || '').trim());
    const resolved = await resolveEditorUrlGM(href);

    // Section/title
    const section = getSectionTitle(tableEl);
    // Global ID: use provided gid or extract from href
    const globalId = gid || extractGlobalIdFromHref(href) || '';
    // Core columns
    const cityStreetTabs = getCol3AsTabs(col3);
    const roadtype = normalizeText(col6);
    const lockVal = normalizeText(col7);
    // Date
    const today = formatTodayYYYYMMDD();

    // Final TSV line: [section]\t[globalId]\t[col3-tabs]\t[roadtype]\t[lock]\t[final-url]\t[date]
    return `${section}\t${globalId}\t${cityStreetTabs}\t${roadtype}\t${lockVal}\t${resolved}\t${today}`;
  }

  function addCheckboxToRow(tr, tableEl) {
    if (!tr || tr.dataset.wazeExportProcessed === '1') return;
    tr.dataset.wazeExportProcessed = '1';
    const firstTd = tr.querySelector('td');
    if (!firstTd) return;

    // Determine row's global ID from column 2 link
    const col2 = tr.querySelectorAll('td')[1];
    let gid = null;
    if (col2) {
      const a = col2.querySelector('a[href]');
      if (a) gid = extractGlobalIdFromHref(a.getAttribute('href') || '');
    }

    const wrapper = document.createElement('label');
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '4px';
    wrapper.style.marginLeft = '6px';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.title = 'Dodaj do eksportu (TSV)';
    if (gid) cb.dataset.gid = gid;

    cb.addEventListener('change', async () => {
      const g = cb.dataset.gid;
      if (!g) return;
      const tableContainer = tableEl.closest('.table-responsive') || tableEl;
      if (cb.checked) {
        // Build the TSV line for this row and upsert
        const line = await buildTsvLineForRow(tr, tableEl, g);
        upsertEntry(g, line);
      } else {
        removeEntry(g);
      }
      renderTextareaFromStorage(tableContainer);
    });

    const txt = document.createElement('span');
    txt.textContent = '';

    wrapper.appendChild(cb);
    wrapper.appendChild(txt);

    // Insert after the number inside the first cell
    firstTd.appendChild(wrapper);

    if (cb.dataset.gid && dataHasGid(loadData(), cb.dataset.gid)) {
      cb.checked = true;
    }
  }

  function processExistingRows(tableEl) {
    const rows = tableEl.querySelectorAll('tbody > tr');
    rows.forEach((tr) => addCheckboxToRow(tr, tableEl));
  }

  function observeTable(tableEl) {
    const tbody = tableEl.querySelector('tbody');
    if (!tbody) return;
    const obs = new MutationObserver(() => {
      computeHeaderIndices(tableEl);
      const rows = tableEl.querySelectorAll('tbody > tr');
      rows.forEach((tr) => addCheckboxToRow(tr, tableEl));
    });
    obs.observe(tbody, { childList: true, subtree: true });
  }

  function getLockValueFromRow(tr) {
    try {
      const tds = tr.querySelectorAll('td');
      const cell = getCellByHeaderIndex(tds, 6, LOCK_IDX);
      const txt = normalizeText(cell);
      const m = txt.match(/\d+/);
      return m ? parseInt(m[0], 10) : 0; // treat missing as 0 (allowed)
    } catch (_) { return 0; }
  }

  function addSelectAllButton(tableEl) {
    const firstTh = tableEl.querySelector('thead th');
    if (!firstTh || firstTh.querySelector('.waze-select-all')) return;

    const btn = document.createElement('button');
    btn.textContent = 'All';
    btn.className = 'waze-select-all';
    btn.style.marginLeft = '6px';
    btn.style.fontSize = '0.8em';
    btn.style.padding = '1px 6px';
    btn.style.border = '1px solid var(--bs-border-color)';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.title = 'Zaznacz wszystkie i wyeksportuj';

    btn.addEventListener('click', async () => {
      const checkboxes = Array.from(tableEl.querySelectorAll('input[type="checkbox"][data-gid]'));
      const unchecked = checkboxes.filter(cb => !cb.checked);

      // Filter out rows where Lock > 3
      const allowed = unchecked.filter(cb => {
        const tr = cb.closest('tr');
        const lockVal = getLockValueFromRow(tr);
        return !(lockVal > 3);
      });

      const skipped = unchecked.length - allowed.length;
      console.log(`Selecting ${allowed.length} unchecked rows (skipped ${skipped} with Lock > 3)...`);

      for (let i = 0; i < allowed.length; i++) {
        const cb = allowed[i];
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        const delay = 300 + Math.random() * 400; // random 300–700ms
        await new Promise(r => setTimeout(r, delay));
      }

      btn.textContent = '✅';
      setTimeout(() => (btn.textContent = 'All'), 5500);
    });

    firstTh.appendChild(btn);
  }

  async function init() {
    try {
      const table = await waitFor('div.table-responsive table.table-hover');
      computeHeaderIndices(table);
      // If there are saved entries, render textarea immediately
      if (loadData().entries.length) {
        const tableContainer = table.closest('.table-responsive') || table;
        ensureTextarea(tableContainer);
      }
      processExistingRows(table);
      addSelectAllButton(table);
      observeTable(table);
    } catch (e) {
      // Table not found within timeout – silently ignore
      console.warn('Waze Export: table not found');
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
