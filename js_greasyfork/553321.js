// ==UserScript==
// @name         CB Room Token Badge
// @namespace    aravvn.tools
// @version      2.1.3
// @description  Import Chaturbate token stats, aggregate total tokens per user, and display it inside the balance area. Local only, no uploads.
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://*.chaturbate.com/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/553321/CB%20Room%20Token%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/553321/CB%20Room%20Token%20Badge.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const REFRESH_MS = 5 * 60 * 1000; // 5 minutes
  const KV_TOTALS = 'cb_room_totals';
  const KV_META   = 'cb_room_totals_meta';

  const store = {
    get: (k, d=null) => { try { return GM_getValue(k, d); } catch { return d; } },
    set: (k, v)      => { try { GM_setValue(k, v); } catch {} },
  };

  const getTotals = () => store.get(KV_TOTALS, {}) || {};
  const setTotals = (obj, rows=0) => {
    store.set(KV_TOTALS, obj || {});
    store.set(KV_META, { updatedAt: Date.now(), rows });
  };
  const clearTotals = () => setTotals({}, 0);

  function parseCSV(text, delimiter = ',') {
    const rows = [];
    let i = 0, f = '', row = [], inQ = false;
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    while (i < text.length) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i+1] === '"') { f += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        f += ch; i++; continue;
      } else {
        if (ch === '"') { inQ = true; i++; continue; }
        if (ch === delimiter) { row.push(f); f=''; i++; continue; }
        if (ch === '\n') { row.push(f); f=''; rows.push(row); row=[]; i++; continue; }
        f += ch; i++;
      }
    }
    row.push(f); rows.push(row);
    return rows;
  }

  function parseTokenChange(str) {
    if (str == null) return NaN;
    let s = String(str).trim();
    s = s.replace(/[^\d.,+-]/g, '');
    if (/,\d{1,2}$/.test(s) && !/\.\d{1,2}$/.test(s))
      s = s.replace(/\./g, '').replace(',', '.');
    else {
      const parts = s.split('.');
      if (parts.length > 2) s = s.replace(/\./g, '');
      const partsC = s.split(',');
      if (partsC.length > 2) s = s.replace(/,/g, '');
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function getRoomFromURL() {
    try {
      const parts = location.pathname.split('/').filter(Boolean);
      if (!parts.length) return null;
      if (parts[0] === 'b') return parts[1]?.toLowerCase() || null;
      const cand = parts[0].toLowerCase();
      const ignore = new Set(['accounts','about','terms','privacy','blog','api','support','tags','token','apps']);
      return ignore.has(cand) ? null : cand;
    } catch { return null; }
  }

  function updateBalanceDisplay(amount) {
    const balance = document.querySelector('.currentBalance');
    if (!balance) return false;
    let el = balance.querySelector('.cb-room-total');
    if (!el) {
      el = document.createElement('span');
      el.className = 'cb-room-total';
      el.style.marginLeft = '10px';
      el.style.fontSize = '13px';
      el.style.color = '#0f0';
      el.style.opacity = '0.85';
      balance.appendChild(el);
    }
    el.textContent = `(room total: ${(Number(amount)||0).toLocaleString()})`;
    return true;
  }

  function refresh() {
    const room = getRoomFromURL();
    if (!room) return;
    const totals = getTotals();
    const val = totals[room] ?? 0;
    updateBalanceDisplay(val);
  }

  function hookNavigation() {
    const onChange = () => setTimeout(refresh, 300);
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function(){ const r=_push.apply(this,arguments); onChange(); return r; };
    history.replaceState = function(){ const r=_replace.apply(this,arguments); onChange(); return r; };
    window.addEventListener('popstate', onChange);
  }

  function openImportDialog() {
    const html = `
      <div style="position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
        <div style="background:#111;color:#eee;min-width:min(90vw,680px);max-width:90vw;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.5);">
          <div style="padding:18px 18px 8px;border-bottom:1px solid #333;display:flex;gap:10px;align-items:center;">
            <div style="font-weight:700;font-size:16px;">Import CB CSV</div>
            <div style="margin-left:auto;opacity:.7;font-size:12px;">local only – no upload</div>
            <button id="cb-modal-close" style="margin-left:12px;background:#222;border:1px solid #444;color:#ccc;padding:6px 10px;border-radius:8px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:18px;display:flex;flex-direction:column;gap:12px;">
            <input id="cb-csv-file" type="file" accept=".csv,text/csv" style="background:#0b0b0b;border:1px solid #333;color:#ddd;padding:10px;border-radius:10px;">
            <div style="font-size:12px;color:#aaa;line-height:1.4;">
              Expected header: <code>Timestamp, Token change, Token balance, Transaction type, User, Note</code>
            </div>
            <div id="cb-csv-preview" style="font-size:12px;color:#bbb;"></div>
          </div>
          <div style="padding:14px 18px 18px;display:flex;gap:10px;border-top:1px solid #222;">
            <button id="cb-import-run" disabled
              style="background:#21a366;border:0;color:#fff;padding:10px 14px;border-radius:10px;cursor:not-allowed;">Import & Aggregate</button>
            <button id="cb-import-cancel"
              style="background:#222;border:1px solid #444;color:#ccc;padding:10px 14px;border-radius:10px;cursor:pointer;">Cancel</button>
          </div>
        </div>
      </div>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap);

    const $ = (sel) => wrap.querySelector(sel);
    $('#cb-modal-close').onclick = () => wrap.remove();
    $('#cb-import-cancel').onclick = () => wrap.remove();

    const fileInput = $('#cb-csv-file');
    const preview   = $('#cb-csv-preview');
    const btnRun    = $('#cb-import-run');

    let headers = null;
    let rows = null;

    fileInput.onchange = () => {
      const file = fileInput.files && fileInput.files[0];
      btnRun.disabled = true; btnRun.style.cursor = 'not-allowed';
      preview.textContent = '';
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = parseCSV(String(reader.result || ''));
          if (!data.length) { preview.innerHTML = `<span style="color:#f88">Empty file</span>`; return; }
          headers = data[0].map((h) => String(h || '').trim());
          rows = data.slice(1).filter(r => r.length === headers.length);

          preview.innerHTML = `
            <div><b>Rows:</b> ${rows.length.toLocaleString()}</div>
            <div style="margin-top:4px;"><b>Header:</b> ${headers.map(h => `<code style="background:#1a1a1a;padding:2px 6px;border-radius:6px;border:1px solid #333;margin-right:6px;">${escapeHTML(h)}</code>`).join('')}</div>
          `;

          const hasUser = headers.includes('User');
          const hasTok  = headers.includes('Token change');
          if (!hasUser || !hasTok) {
            preview.innerHTML += `<div style="color:#f88;margin-top:6px;">Error: CSV must include “User” and “Token change” columns.</div>`;
            return;
          }

          btnRun.disabled = false; btnRun.style.cursor = 'pointer';
        } catch (e) {
          preview.innerHTML = `<span style="color:#f88">Error reading file: ${escapeHTML(e.message)}</span>`;
        }
      };
      reader.readAsText(file);
    };

    btnRun.onclick = () => {
      const idxUser = headers.indexOf('User');
      const idxTok  = headers.indexOf('Token change');

      const totals = Object.create(null);
      let processed = 0;

      for (const r of rows) {
        const userRaw = (r[idxUser] ?? '').toString().trim();
        if (!userRaw) continue;
        const user = userRaw.toLowerCase();

        const tokRaw = (r[idxTok] ?? '').toString().trim();
        if (!tokRaw) continue;

        const val = parseTokenChange(tokRaw);
        if (!Number.isFinite(val)) continue;

        totals[user] = (totals[user] || 0) + val;
        processed++;
      }

      setTotals(totals, processed);
      setTimeout(() => { wrap.remove(); setTimeout(refresh, 150); }, 150);
    };
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  GM_registerMenuCommand('Import CB CSV', openImportDialog);
  GM_registerMenuCommand('Export Totals (JSON)', () => {
    const blob = new Blob([JSON.stringify(getTotals(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cb_user_totals.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
  GM_registerMenuCommand('Clear Totals', () => {
    if (confirm('Clear all locally stored totals?')) {
      clearTotals();
      refresh();
    }
  });

  (function init() {
    hookNavigation();
    refresh();
    setInterval(refresh, REFRESH_MS);
  })();
})();