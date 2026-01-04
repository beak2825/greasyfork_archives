// ==UserScript==
// @name         Coolbet → API Urls
// @namespace    local.coolbet
// @version      1.6
// @author       JV
// @license      MIT
// @description  API Urls tlačítko + tabulka
// @match        https://www.coolbet.com/en/sports/tennis/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550667/Coolbet%20%E2%86%92%20API%20Urls.user.js
// @updateURL https://update.greasyfork.org/scripts/550667/Coolbet%20%E2%86%92%20API%20Urls.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // GM_addStyle shim
  if (typeof window.GM_addStyle !== 'function') {
    window.GM_addStyle = function(css) {
      const s = document.createElement('style');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      return s;
    };
  }

  GM_addStyle(`
    .cb-api-btn{
      all: unset; display:inline-block; margin-left:.5rem; padding:4px 8px;
      border:1px solid #00e6a8; border-radius:4px; background:transparent; color:#00e6a8 !important;
      font:700 12px/1 system-ui,Segoe UI,Roboto,sans-serif; cursor:pointer; vertical-align:middle; white-space:nowrap;
    }
    .cb-api-btn:hover{ background:rgba(0,230,168,.12); }

    .cb-api-panel{
      margin:6px 0 10px; background:#0f1220; color:#eaf1ff;
      border:1px solid #223155; border-radius:8px; display:none;
      width:max-content; max-width:100%; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,.25);
      font:12px/1.35 system-ui,Segoe UI,Roboto,sans-serif;
    }
    .cb-api-panel.open{ display:inline-block; }
    .cb-api-panel header{
      padding:6px 8px; background:#121936; color:#cfe0ff; font:600 11px/1 system-ui;
      display:flex; gap:6px; align-items:center; justify-content:space-between;
    }
    .cb-api-panel header .url{ color:#8aa0c7; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:60ch; }
    .cb-api-panel header .actions{ display:flex; gap:6px }
    .cb-api-panel header button{
      all:unset; background:#223155; color:#cfe0ff; padding:4px 8px; border-radius:4px; cursor:pointer; font:700 11px/1 system-ui;
    }

    .cb-api-panel table{ border-collapse:collapse; table-layout:auto; white-space:nowrap; width:auto; max-width:100%; }
    .cb-api-panel th,.cb-api-panel td{ border-top:1px solid #223155; padding:3px 6px; vertical-align:middle; text-align:left; }
    .cb-api-panel th{ background:#121936; color:#8aa0c7; text-transform:uppercase; font-size:10px; }

    /* Link bez href (čisté otevírání), ale vypadá jako odkaz */
    .cb-live-link{
      color:#00e6a8; cursor:pointer; text-decoration:none; font-weight:700;
      padding:2px 6px; border:1px solid #00e6a8; border-radius:4px; display:inline-block;
    }
    .cb-live-link:hover{ background:rgba(0,230,168,.12); }

    .cb-muted{ color:#8aa0c7; padding:8px; }
  `);

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
  const parseJsonSafe = txt => { const t=(txt||'').trim().replace(/^\)\]\}',?\s*/,''); try{ return JSON.parse(t);}catch{ return null; } };

  // fetch v page-kontextu
  function fetchTextInPage(url){
    return new Promise((resolve,reject)=>{
      const code = `
        (async function(){
          try{
            const r = await fetch(${JSON.stringify(url)}, { credentials:'include' });
            const t = await r.text();
            window.postMessage({type:'CB_FETCH', ok:true, text:t}, '*');
          }catch(e){
            window.postMessage({type:'CB_FETCH', ok:false, err:(e&&e.message)||String(e)}, '*');
          }
        })();`;
      const s = document.createElement('script'); s.textContent = code;
      (document.head||document.documentElement).appendChild(s); s.remove();
      const onMsg = (ev)=>{
        if(!ev?.data || ev.data.type!=='CB_FETCH') return;
        window.removeEventListener('message', onMsg);
        if(!ev.data.ok) reject(new Error(ev.data.err || 'fetch failed'));
        else resolve(ev.data.text);
      };
      window.addEventListener('message', onMsg);
    });
  }

  // čistá live URL – jen povolené parametry
  function buildLiveUrl(fixtureId, country) {
    const u = new URL('https://coolbet.betstream.betgenius.com/widget-data/multisportgametracker');
    u.searchParams.set('productName','coolbet');
    u.searchParams.set('region','');
    u.searchParams.set('country', country || 'CZ');
    u.searchParams.set('fixtureId', String(fixtureId || ''));
    u.searchParams.set('activeContent','teamStats');
    return u.toString();
  }

  // vytáhneme zápasy
  function extractRows(obj){
    const rows = [];
    (function walk(v){
      if (Array.isArray(v)) return v.forEach(walk);
      if (!v || typeof v!=='object') return;
      if ('betgenius_id' in v && v.betgenius_id && v.home_team_name && v.away_team_name){
        rows.push({ id:String(v.betgenius_id), home:String(v.home_team_name), away:String(v.away_team_name) });
      }
      for (const vv of Object.values(v)) walk(vv);
    })(obj);
    const seen = new Set();
    return rows.filter(r => !seen.has(r.id) && seen.add(r.id));
  }

  function renderTable(panelEl, rows, country, apiUrl){
    panelEl.innerHTML = `
      <header>
        <div class="url" title="${esc(apiUrl)}">${esc(apiUrl)}</div>
        <div class="actions">
          <button type="button" class="cb-refresh">Refresh</button>
          <button type="button" class="cb-close">Close</button>
        </div>
      </header>
      ${rows.length ? `
        <table>
          <thead><tr><th>#</th><th>Home</th><th>Away</th><th>ID</th><th>Live</th></tr></thead>
          <tbody>
            ${rows.map((r,i)=> {
              const live = buildLiveUrl(r.id, country);
              return `
                <tr>
                  <td>${i+1}</td>
                  <td>${esc(r.home)}</td>
                  <td>${esc(r.away)}</td>
                  <td>${esc(r.id)}</td>
                  <td><span class="cb-live-link" role="link" tabindex="0" data-url="${esc(live)}">API</span></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      ` : `<div class="cb-muted">Žádné zápasy s betgenius_id.</div>`}
    `;

    // Delegované otvírání: left click, middle click, Ctrl/Meta click, Enter/Space
    const openClean = (url) => { if (url) window.open(url, '_blank', 'noopener,noreferrer'); };

    panelEl.addEventListener('click', (e)=>{
      const el = e.target.closest('.cb-live-link');
      if (!el) return;
      const url = el.getAttribute('data-url');
      // Ctrl/Meta klik → nová karta
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); e.stopPropagation(); openClean(url); return; }
      // normální levý klik
      e.preventDefault(); e.stopPropagation(); openClean(url);
    }, { capture:true });

    panelEl.addEventListener('auxclick', (e)=>{
      // middle click
      const el = e.target.closest('.cb-live-link');
      if (!el) return;
      if (e.button === 1) {
        e.preventDefault(); e.stopPropagation();
        openClean(el.getAttribute('data-url'));
      }
    }, { capture:true });

    panelEl.addEventListener('keydown', (e)=>{
      const el = e.target.closest('.cb-live-link');
      if (!el) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openClean(el.getAttribute('data-url'));
      }
    }, { capture:true });

    // ovládání panelu
    const closeBtn = panelEl.querySelector('.cb-close');
    const refreshBtn = panelEl.querySelector('.cb-refresh');
    if (closeBtn) closeBtn.onclick = ()=> panelEl.classList.remove('open');
    if (refreshBtn) refreshBtn.onclick = async ()=>{
      panelEl.innerHTML = `<div class="cb-muted">Načítám…</div>`;
      try{
        const apiUrl = panelEl.dataset.apiUrl;
        const txt2 = await fetchTextInPage(apiUrl);
        const j2 = parseJsonSafe(txt2);
        const rows2 = j2 ? extractRows(j2) : [];
        const ctry = (()=>{ try{ return new URL(apiUrl, location.origin).searchParams.get('country') || 'CZ'; } catch { return 'CZ'; } })();
        renderTable(panelEl, rows2, ctry, apiUrl);
        panelEl.dataset.loaded = '1';
      }catch(err){
        panelEl.innerHTML = `<div class="cb-muted">Chyba: ${esc(err.message||String(err))}</div>`;
      }
    };
  }

  function attachButtonAndPanel(titleEl, apiUrl){
    if(!titleEl) return;
    if(!titleEl.querySelector(':scope > .cb-api-btn')){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cb-api-btn';
      btn.textContent = 'API Urls';
      titleEl.appendChild(btn);

      const container = titleEl.closest('.category-container') || titleEl.parentElement;
      let panelEl = container.nextElementSibling && container.nextElementSibling.classList?.contains('cb-api-panel')
        ? container.nextElementSibling : null;

      if(!panelEl){
        panelEl = document.createElement('div');
        panelEl.className = 'cb-api-panel';
        panelEl.dataset.loaded = '0';
        panelEl.dataset.apiUrl = apiUrl;
        container.insertAdjacentElement('afterend', panelEl);
      }

      const openOrLoad = async ()=>{
        if(panelEl.classList.contains('open')) { panelEl.classList.remove('open'); return; }
        panelEl.classList.add('open');
        if(panelEl.dataset.loaded!=='1' || panelEl.dataset.apiUrl!==apiUrl){
          panelEl.innerHTML = `<div class="cb-muted">Načítám…</div>`;
          try{
            const txt = await fetchTextInPage(apiUrl);
            const json = parseJsonSafe(txt);
            const rows = json ? extractRows(json) : [];
            const country = (()=>{ try{ return new URL(apiUrl, location.origin).searchParams.get('country') || 'CZ'; } catch { return 'CZ'; } })();
            renderTable(panelEl, rows, country, apiUrl);
            panelEl.dataset.loaded = '1'; panelEl.dataset.apiUrl = apiUrl;
          }catch(err){
            panelEl.innerHTML = `<div class="cb-muted">Chyba: ${esc(err.message||String(err))}</div>`;
          }
        }
      };
      btn.addEventListener('click', (e)=>{ e.preventDefault(); openOrLoad(); });
    }
  }

  function collectCategoryNames(json){
    const out = new Set();
    (function walk(v){
      if (Array.isArray(v)) return v.forEach(walk);
      if (v && typeof v === 'object'){
        if (v.category_name) out.add(String(v.category_name));
        for (const vv of Object.values(v)) walk(vv);
      }
    })(json);
    return [...out];
  }

  const seenReq = new Set();
  function handleFoCategory(url){
    if (seenReq.has(url)) return; seenReq.add(url);
    fetchTextInPage(url).then(txt=>{
      const j = parseJsonSafe(txt); if(!j) return;
      const names = collectCategoryNames(j);
      const titles = [...document.querySelectorAll('.category-name')];
      for (const name of names){
        const n = name.trim().toLowerCase();
        for (const el of titles){
          const t = (el.textContent||'').trim().toLowerCase();
          if (t && (t.includes(n) || n.includes(t))) attachButtonAndPanel(el, url);
        }
      }
    }).catch(()=>{});
  }

  function startPO(){
    try{
      for (const e of performance.getEntriesByType('resource')){
        if ((e.initiatorType==='fetch' || e.initiatorType==='xmlhttprequest') && /\/s\/sbgate\/sports\/fo-category\/\?/.test(e.name)) {
          handleFoCategory(e.name);
        }
      }
    }catch{}
    try{
      const po = new PerformanceObserver((list)=>{
        for (const e of list.getEntries()){
          if ((e.initiatorType==='fetch' || e.initiatorType==='xmlhttprequest') && /\/s\/sbgate\/sports\/fo-category\/\?/.test(e.name)){
            handleFoCategory(e.name);
          }
        }
      });
      po.observe({ type:'resource', buffered:true });
    }catch{}
  }

  startPO();
})();
