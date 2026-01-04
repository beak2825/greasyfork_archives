// ==UserScript==
// @name         Torn – Last Rehab & Last Swiss (PublicView CSV • row under header)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Shows Last Swiss / Last rehab from a PublicView CSV on the Employees page.
// @match        https://www.torn.com/companies.php*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550850/Torn%20%E2%80%93%20Last%20Rehab%20%20Last%20Swiss%20%28PublicView%20CSV%20%E2%80%A2%20row%20under%20header%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550850/Torn%20%E2%80%93%20Last%20Rehab%20%20Last%20Swiss%20%28PublicView%20CSV%20%E2%80%A2%20row%20under%20header%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS_URL   = 'tm_torn_public_csv_url_v1';
  const LS_CACHE = 'tm_torn_public_cache_v1';
  const CACHE_TTL_MS = 30 * 60 * 1000;

  let cache = loadCache();
  let fetchInFlight = null;

  const EMP_LIST_SEL = '#employees form .employee-list-wrap ul.employee-list.t-blue-cont.h';
  const isEmployeesRoute = () =>
    location.pathname === '/companies.php' &&
    /(^|#|&|\?)option=employees\b/i.test(location.href);

  mountCsvAndRefreshButtons();
  startOnce();

  window.addEventListener('load', () => {
    if (isEmployeesRoute()) renderAllEmployees(true);
  });

  window.addEventListener('hashchange', () => {
    if (isEmployeesRoute()) startOnce();
  });

  async function startOnce() {
    if (!isEmployeesRoute()) return;
    await waitFor(() => document.querySelector(EMP_LIST_SEL), 10000, 250);
    renderAllEmployees(true).catch(() => {});
  }

  async function renderAllEmployees(force = false) {
    const url = getCsvUrl();
    if (!url) return;
    await ensureData(url, force);

    document
      .querySelectorAll(`${EMP_LIST_SEL} > li[data-user]`)
      .forEach(injectLeftMeta);
  }

  function injectLeftMeta(liEl) {
    const leftCell = liEl.querySelector(':scope > .acc-header .employee');
    if (!leftCell) return;

    leftCell.style.overflow  = 'visible';
    leftCell.style.height    = 'auto';
    leftCell.style.maxHeight = 'none';
    leftCell.style.minHeight = '40px';

    const header = liEl.querySelector(':scope > .acc-header');
    if (header) { header.style.height = 'auto'; header.style.minHeight = '40px'; }

    const id   = liEl.getAttribute('data-user');
    const name = leftCell.querySelector('.honor-text')?.textContent?.trim() || '';
    const rec  = lookup(id ? { id } : { id: null, name });

    let meta = leftCell.querySelector(':scope > .tm-left-meta');
    if (!meta) {
      meta = document.createElement('div');
      meta.className = 'tm-left-meta';
      const anchor = leftCell.querySelector('a.user.name') || leftCell.lastElementChild;
      anchor?.insertAdjacentElement('afterend', meta);
      Object.assign(meta.style, {
        marginTop: '3px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '400',
        lineHeight: '16px',
        color: 'rgb(221, 221, 221)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        pointerEvents: 'none',
      });
    }

    const isUnknown = v => !v || /unknown/i.test(v);
    const swissTxt = (rec && !isUnknown(rec.last_swiss)) ? tornRelative(rec.last_swiss) : 'Unknown';
    const rehabTxt = (rec && !isUnknown(rec.last_rehab)) ? tornRelative(rec.last_rehab) : 'Unknown';

    meta.innerHTML = `Swiss: ${swissTxt}<br>Rehab: ${rehabTxt}`;
  }

  async function ensureData(url, force = false) {
    const now = Date.now();
    if (!force && (now - cache.lastFetch < CACHE_TTL_MS)) return;
    if (fetchInFlight) return fetchInFlight;

    fetchInFlight = (async () => {
      let reqUrl = url;
      if (force) {
        try { const u = new URL(url); u.searchParams.set('tmcb', String(Date.now())); reqUrl = u.toString(); }
        catch { reqUrl = url + (url.includes('?') ? '&' : '?') + 'tmcb=' + Date.now(); }
      }

      const res = await fetch(reqUrl, { method: 'GET', cache: 'no-store', credentials: 'omit', redirect: 'follow' });
      if (!res.ok) throw new Error('CSV fetch failed ' + res.status);

      const csv = await res.text();
      const rows = parseCsv(csv);
      if (!rows.length) return;

      const header = rows.shift().map(s => (s || '').trim().toLowerCase());
      const ci = { id: header.indexOf('id'), name: header.indexOf('name'), swiss: header.indexOf('last_swiss'), rehab: header.indexOf('last_rehab') };
      ['id','name','swiss','rehab'].forEach(k => { if (ci[k] < 0) throw new Error('Missing column: ' + k); });

      const byId = Object.create(null), byName = Object.create(null), byNameNorm = Object.create(null);
      for (const r of rows) {
        const id = ((r[ci.id] ?? '') + '').trim();
        const name = ((r[ci.name] ?? '') + '').trim();
        const last_swiss = ((r[ci.swiss] ?? '') + '').trim();
        const last_rehab = ((r[ci.rehab] ?? '') + '').trim();
        const obj = { id, name, last_swiss, last_rehab };
        if (id) byId[id] = obj;
        if (name) { byName[name.toLowerCase()] = obj; byNameNorm[normalizeName(name)] = obj; }
      }

      cache = { byId, byName, byNameNorm, lastFetch: now };
      saveCache();
    })().finally(() => { fetchInFlight = null; });

    return fetchInFlight;
  }

  function lookup(ref) {
    if (ref.id && cache.byId?.[ref.id]) return cache.byId[ref.id];
    if (ref.name) {
      const n = ref.name.toLowerCase();
      if (cache.byName?.[n]) return cache.byName[n];
      const nn = normalizeName(ref.name);
      if (cache.byNameNorm?.[nn]) return cache.byNameNorm[nn];
    }
    return null;
  }

  function mountCsvAndRefreshButtons() {
    const attach = () => {
      const heading = document.querySelector('.title-black.top-round.m-top10[role="heading"][aria-level="5"]');
      if (!heading) return;

      let chip = heading.querySelector('.tm-csv-chip');
      if (!chip) {
        chip = document.createElement('button');
        chip.className = 'tm-csv-chip';
        chip.title = 'Paste your PublicView → CSV link';
        Object.assign(chip.style, {
          marginLeft: '8px', padding: '2px 8px', font: '12px/1 system-ui, Arial, sans-serif',
          border: '0', borderRadius: '999px', cursor: 'pointer', verticalAlign: 'middle', color: '#fff',
        });
        heading.appendChild(chip);
        chip.addEventListener('click', async () => {
          await promptForUrl();
          const ok = !!getCsvUrl();
          chip.textContent = ok ? 'CSV: Set' : 'CSV: Missing';
          chip.style.background = ok ? '#2e7d32' : '#c62828';
          if (isEmployeesRoute()) renderAllEmployees(true);
          document.dispatchEvent(new CustomEvent('tm:csv-updated'));
        });
      }
      const ok = !!getCsvUrl();
      chip.textContent = ok ? 'CSV: Set' : 'CSV: Missing';
      chip.style.background = ok ? '#2e7d32' : '#c62828';

      let refresh = heading.querySelector('.tm-csv-refresh');
      if (!refresh) {
        refresh = document.createElement('button');
        refresh.className = 'tm-csv-refresh';
        refresh.textContent = '↻ Refresh';
        Object.assign(refresh.style, {
          marginLeft: '6px', padding: '2px 8px', font: '12px/1 system-ui, Arial, sans-serif',
          border: '0', borderRadius: '999px', cursor: 'pointer', verticalAlign: 'middle',
          background: '#424a57', color: '#fff',
        });
        refresh.addEventListener('click', async () => {
          const old = refresh.textContent; refresh.textContent = 'Refreshing…'; refresh.disabled = true;
          try { await renderAllEmployees(true); } finally { refresh.textContent = old; refresh.disabled = false; }
        });
        heading.appendChild(refresh);
      }
    };

    attach();
    waitFor(() => document.querySelector('.title-black.top-round.m-top10[role="heading"][aria-level="5"]'), 8000, 250)
      .then(attach).catch(() => {});
  }

  async function promptForUrl() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;';
    wrap.innerHTML = `
      <div style="background:#fff;border-radius:10px;max-width:520px;width:100%;padding:14px;font:14px/1.4 system-ui, Arial">
        <div style="font-weight:700;margin-bottom:8px">Paste your <i>PublicView → CSV</i> link</div>
        <div style="color:#555;margin-bottom:8px">From your sheet: <b>File → Share → Publish to web → Sheet: PublicView → Format: CSV</b></div>
        <input id="tm_csv_inp" placeholder="https://docs.google.com/.../pub?gid=...&single=true&output=csv" inputmode="url"
               style="width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:8px;font:14px/1.4 system-ui, Arial;" />
        <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end">
          <button id="tm_csv_cancel" style="padding:8px 10px;border:0;border-radius:8px;background:#eee;cursor:pointer">Cancel</button>
          <button id="tm_csv_save"   style="padding:8px 12px;border:0;border-radius:8px;background:#1976d2;color:#fff;cursor:pointer">Save</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const inp = wrap.querySelector('#tm_csv_inp');
    inp.value = getCsvUrl() || '';
    const close = () => wrap.remove();

    wrap.querySelector('#tm_csv_cancel').addEventListener('click', close);
    wrap.querySelector('#tm_csv_save').addEventListener('click', async () => {
      const raw = (inp.value || '').trim();
      if (!raw) return;
      const url = canonCsvUrl(raw);
      if (!url) return;
      try { const head = await fetch(url, { method:'GET', cache:'no-store', credentials:'omit' }); if (!head.ok) throw 0; }
      catch { return; }
      localStorage.setItem(LS_URL, url);
      close();
    });

    setTimeout(() => inp.focus(), 50);
  }

  // Helpers
  function waitFor(pred, timeoutMs=5000, intervalMs=200){
    return new Promise((resolve, reject)=>{
      const t0 = Date.now();
      (function tick(){
        try { const v = pred(); if (v) return resolve(v); } catch {}
        if (Date.now() - t0 >= timeoutMs) return reject(new Error('timeout'));
        setTimeout(tick, intervalMs);
      })();
    });
  }
  function getCsvUrl(){ return localStorage.getItem(LS_URL) || ''; }
  function canonCsvUrl(u){
    try{
      const url = new URL(u);
      if (/docs\.google\.com\/spreadsheets\/d\/.+\/pub/.test(url.href) && url.searchParams.get('output')==='csv') return url.href;
      if (/docs\.google\.com\/spreadsheets\/d\/.+\/gviz\/tq/.test(url.href)) { const tqx = url.searchParams.get('tqx') || ''; if (/out:csv/i.test(tqx)) return url.href; }
      if (url.protocol==='https:' && /csv\b/i.test(url.search)) return url.href;
      return '';
    } catch { return ''; }
  }
  function loadCache(){ try{ return JSON.parse(localStorage.getItem(LS_CACHE)) || {byId:{},byName:{},byNameNorm:{},lastFetch:0}; } catch { return {byId:{},byName:{},byNameNorm:{},lastFetch:0}; } }
  function saveCache(){ try{ localStorage.setItem(LS_CACHE, JSON.stringify(cache)); } catch {} }
  function normalizeName(s){ if(!s)return''; let t=s.normalize('NFKC'); t=t.replace(/[\u{1F3FB}-\u{1F3FF}]/gu,''); t=t.replace(/\[[^\]]*\]|\([^\)]*\)/g,''); t=t.replace(/\s+/g,' ').trim(); return t.toLowerCase(); }
  function parseCsv(text){ const rows=[]; let row=[],cur='',inQ=false; for(let i=0;i<text.length;i++){ const c=text[i]; if(inQ){ if(c==='"'){ if(text[i+1]==='"'){cur+='"'; i++;} else inQ=false; } else cur+=c; } else { if(c==='"') inQ=true; else if(c===','){ row.push(cur); cur=''; } else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=''; } else if(c!=='\r') cur+=c; } } if(cur.length||row.length){ row.push(cur); rows.push(row); } return rows; }

  // Torn date helpers
  function parseTornDate(str){
    const m = String(str).match(/(\d{2}):(\d{2}):(\d{2})\s*-\s*(\d{2})\/(\d{2})\/(\d{2})/);
    if (!m) return null;
    const [, hh, mm, ss, dd, MM, yy] = m;
    const year  = 2000 + (+yy);
    return new Date(year, (+MM)-1, (+dd), (+hh), (+mm), (+ss));
  }
  function tornRelative(str){
    const d = parseTornDate(str);
    if (!d) return String(str);
    const diff = Date.now() - d.getTime();
    if (diff < 0) return String(str);
    const mins = Math.floor(diff/60000);
    if (mins < 60) return `${str} (${mins}m ago)`;
    const hours = Math.floor(mins/60);
    if (hours < 48) return `${str} (${hours}h ago)`;
    const days = Math.floor(hours/24);
    return `${str} (${days}d ago)`;
  }
})();
