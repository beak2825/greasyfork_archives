// ==UserScript==
// @name         API Hunter — network & script endpoint detector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept XHR/fetch/WebSocket + scan resources & inline scripts for API endpoints, show list + export copy UI.
// @author       LM
// @match        *://*/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557921/API%20Hunter%20%E2%80%94%20network%20%20script%20endpoint%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/557921/API%20Hunter%20%E2%80%94%20network%20%20script%20endpoint%20detector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- config ---------- */
  const MAX_SAVED = 1000; // maximum endpoints to keep
  const UI_ID = 'api-hunter-panel-v1';
  const IGNORED_EXT = /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico|css|map)(\?.*)?$/i;

  /* ---------- storage helpers ---------- */
  function saveList(list) { try { GM_setValue('api_hunter_list', JSON.stringify(list.slice(0, MAX_SAVED))); } catch(e){} }
  function loadList() { try { return JSON.parse(GM_getValue('api_hunter_list','[]')) || []; } catch(e){ return []; } }

  /* ---------- dedupe / normalize ---------- */
  function normalizeEntry(e) {
    return {
      timestamp: e.timestamp || Date.now(),
      url: (e.url||'').toString(),
      method: e.method || 'GET',
      type: e.type || 'unknown',
      payloadSnippet: e.payloadSnippet || null,
      responseSnippet: e.responseSnippet || null,
      info: e.info || ''
    };
  }
  function keyOf(e) { return `${e.method} ${e.url}`; }

  /* ---------- central store ---------- */
  const store = {
    map: new Map(),
    load() {
      const arr = loadList();
      arr.forEach(a => this.map.set(keyOf(a), a));
    },
    add(raw) {
      const e = normalizeEntry(raw);
      const k = keyOf(e);
      if (!this.map.has(k)) {
        this.map.set(k, e);
        this.sync();
        updateUI();
      } else {
        // update timestamp/responseSnippet if newer
        const cur = this.map.get(k);
        if ((e.timestamp||0) > (cur.timestamp||0)) {
          this.map.set(k, Object.assign({}, cur, e));
          this.sync();
          updateUI();
        }
      }
    },
    list() { return Array.from(this.map.values()).sort((a,b)=>b.timestamp-a.timestamp); },
    clear() { this.map.clear(); saveList([]); updateUI(); },
    sync() { saveList(this.list()); }
  };
  store.load();

  /* ---------- UI ---------- */
  GM_addStyle(`
    #${UI_ID} { position: fixed; right: 10px; top: 10px; width: 420px; max-height: 65vh; overflow:auto; z-index:2147483647;
                 font-family: Arial, Helvetica, sans-serif; font-size:12px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.25);
                 background: rgba(255,255,255,0.96); border:1px solid rgba(0,0,0,0.08); padding:8px; }
    #${UI_ID} h4 { margin:0 0 6px 0; font-size:13px; }
    #${UI_ID} .row { display:flex; gap:6px; align-items:center; margin:6px 0; padding:6px; border-radius:6px; background: rgba(0,0,0,0.02); }
    #${UI_ID} .u-url { flex:1; word-break:break-all; font-size:11px; color:#111; }
    #${UI_ID} button { font-size:11px; padding:4px 6px; border-radius:6px; }
    #${UI_ID} .controls { display:flex; gap:6px; margin-bottom:6px; }
    #${UI_ID} .small { padding:3px 6px; font-size:11px; }
    #${UI_ID} .meta { font-size:10px; color:#444; }
    #${UI_ID} .badge { font-size:10px; padding:2px 6px; border-radius:999px; background:#f0f0f0; }
  `);

  function createUI() {
    if (document.getElementById(UI_ID)) return;
    const panel = document.createElement('div');
    panel.id = UI_ID;

    panel.innerHTML = `
      <h4>API Hunter</h4>
      <div class="controls">
        <button id="ah-refresh" class="small">Refresh</button>
        <button id="ah-export" class="small">Export JSON</button>
        <button id="ah-copy" class="small">Copy URLs</button>
        <button id="ah-clear" class="small">Clear</button>
      </div>
      <div id="ah-list"></div>
      <div style="margin-top:6px"><small class="meta">Detected: <span id="ah-count">0</span></small></div>
    `;
    document.documentElement.appendChild(panel);

    document.getElementById('ah-refresh').onclick = updateUI;
    document.getElementById('ah-export').onclick = () => {
      const data = store.list();
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'api-hunter.json'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 5000);
    };
    document.getElementById('ah-copy').onclick = () => {
      const text = store.list().map(x=>`${x.method} ${x.url}`).join('\n');
      navigator.clipboard?.writeText(text).then(()=>alert('URLs copied to clipboard'), ()=>alert('Copy failed'));
    };
    document.getElementById('ah-clear').onclick = () => { if(confirm('Clear stored endpoints?')) store.clear(); };
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function updateUI() {
    createUI();
    const listDiv = document.getElementById('ah-list');
    if(!listDiv) return;
    listDiv.innerHTML = '';
    const items = store.list();
    document.getElementById('ah-count').innerText = items.length;
    items.slice(0, 200).forEach(e=>{
      const r = document.createElement('div');
      r.className = 'row';
      const left = document.createElement('div');
      left.className = 'u-url';
      left.innerHTML = `<div style="font-size:12px"><strong class="badge">${e.method}</strong> ${escapeHtml(e.url)}</div>
                        <div class="meta">${e.type} • ${formatTime(e.timestamp)} ${e.info? ' • '+escapeHtml(e.info):''}</div>`;
      const btnCopy = document.createElement('button');
      btnCopy.className = 'small';
      btnCopy.innerText = 'Copy';
      btnCopy.onclick = ()=> navigator.clipboard?.writeText(e.url);
      const btnOpen = document.createElement('button');
      btnOpen.className = 'small';
      btnOpen.innerText = 'Open';
      btnOpen.onclick = ()=> window.open(e.url, '_blank');
      r.appendChild(left);
      const box = document.createElement('div');
      box.style.display = 'flex';
      box.style.flexDirection = 'column';
      box.style.gap = '6px';
      box.appendChild(btnCopy);
      box.appendChild(btnOpen);
      r.appendChild(box);
      listDiv.appendChild(r);
    });
  }

  function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------- instrumentation ---------- */

  // intercept XMLHttpRequest
  (function patchXHR() {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function(method, url) {
      try { this.__ah_method = method ? method.toUpperCase() : 'GET'; this.__ah_url = url; } catch(e){}
      return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function(body) {
      try {
        const url = this.__ah_url || '(unknown)';
        const method = this.__ah_method || 'GET';
        // hook readystatechange to capture response
        this.addEventListener('readystatechange', () => {
          try {
            if (this.readyState === 4) {
              const type = 'XMLHttpRequest';
              let respSnippet = null;
              try { if (this.responseType === '' || this.responseType === 'text') respSnippet = String(this.response).slice(0,500); } catch(e){}
              store.add({url, method, type, payloadSnippet: (body && String(body).slice(0,200))||null, responseSnippet: respSnippet, info: `status ${this.status}`});
            }
          } catch(e){}
        });
        // also quick add attempt (request started)
        store.add({url, method, type: 'XMLHttpRequest (start)', payloadSnippet: (body && String(body).slice(0,200))||null});
      } catch(e){}
      return origSend.apply(this, arguments);
    };
  })();

  // intercept fetch
  (function patchFetch() {
    if (!window.fetch) return;
    const origFetch = window.fetch;
    window.fetch = async function(input, init) {
      try {
        let url = input;
        let method = (init && init.method) || 'GET';
        if (typeof input === 'object' && input.url) { url = input.url; method = input.method || method; }
        store.add({url, method, type: 'fetch (start)', payloadSnippet: (init && init.body && String(init.body).slice(0,200))||null});
        const resp = await origFetch.apply(this, arguments);
        // clone to read body safely
        try {
          const clone = resp.clone();
          let text = null;
          const ct = clone.headers.get && clone.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            text = await clone.text();
          } else if (ct.includes('text') || ct.includes('application')) {
            text = await clone.text().catch(()=>null);
          }
          store.add({url, method, type: 'fetch', responseSnippet: text ? text.slice(0,500) : null, info: `status ${resp.status}`});
        } catch(e){}
        return resp;
      } catch(err) {
        // if fetch fails, still call original to propagate error
        return origFetch.apply(this, arguments);
      }
    };
  })();

  // intercept WebSocket
  (function patchWS() {
    try {
      const OriginalWS = window.WebSocket;
      if (!OriginalWS) return;
      const NewWS = function(url, protocols) {
        const ws = protocols ? new OriginalWS(url, protocols) : new OriginalWS(url);
        try {
          store.add({url, method:'WS', type:'WebSocket (open)'});
          const origSend = ws.send;
          ws.send = function(data) {
            try { store.add({url, method:'WS', type:'WebSocket (send)', payloadSnippet: (typeof data==='string'?data:String(data)).slice(0,200)}); } catch(e){}
            return origSend.apply(this, arguments);
          };
          ws.addEventListener('message', (ev) => {
            try { let d = ev.data; store.add({url, method:'WS', type:'WebSocket (message)', payloadSnippet: (typeof d==='string'?d:String(d)).slice(0,200)}); } catch(e){}
          });
        } catch(e){}
        return ws;
      };
      NewWS.prototype = OriginalWS.prototype;
      NewWS.CLOSING = OriginalWS.CLOSING;
      NewWS.CLOSED = OriginalWS.CLOSED;
      NewWS.CONNECTING = OriginalWS.CONNECTING;
      NewWS.OPEN = OriginalWS.OPEN;
      window.WebSocket = NewWS;
    } catch(e){}
  })();

  // observe new resource loads via PerformanceObserver (resource)
  (function observeResources() {
    try {
      if ('PerformanceObserver' in window) {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const name = entry.name || '';
            if (IGNORED_EXT.test(name)) continue;
            store.add({url: name, method: 'GET', type: 'resource', info: entry.initiatorType || ''});
          }
        });
        obs.observe({type: 'resource', buffered: true});
      } else {
        // fallback: scan window.performance.getEntries periodically
        setInterval(()=> {
          try {
            const entries = performance.getEntriesByType('resource') || [];
            entries.forEach(e=> {
              if (IGNORED_EXT.test(e.name)) return;
              store.add({url: e.name, method: 'GET', type: 'resource', info: e.initiatorType || ''});
            });
          } catch(e){}
        }, 5000);
      }
    } catch(e){}
  })();

  // scan existing <script> tags and inline scripts for strings that look like endpoints
  (function scanScripts() {
    const urlRegex = /https?:\/\/[^\s'"]{6,400}/g;
    function scanNode(node) {
      try {
        if (!node) return;
        if (node.tagName === 'SCRIPT') {
          if (node.src) {
            if (!IGNORED_EXT.test(node.src)) store.add({url: node.src, method:'GET', type:'script-src'});
          } else if (node.textContent) {
            const txt = node.textContent;
            let m;
            while ((m = urlRegex.exec(txt)) !== null) {
              const u = m[0];
              if (!IGNORED_EXT.test(u)) store.add({url:u, method:'GET', type:'inline-script'});
            }
          }
        } else {
          // check attributes like data-* or href
          if (node.attributes) {
            for (const attr of Array.from(node.attributes)) {
              if (attr.value && typeof attr.value === 'string') {
                let m;
                while ((m = urlRegex.exec(attr.value)) !== null) {
                  const u = m[0];
                  if (!IGNORED_EXT.test(u)) store.add({url:u, type:'attr-string'});
                }
              }
            }
          }
        }
      } catch(e){}
    }
    // initial
    Array.from(document.getElementsByTagName('script')).forEach(scanNode);
    // observe future scripts
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        m.addedNodes && m.addedNodes.forEach(n => scanNode(n));
      }
    });
    try { mo.observe(document.documentElement || document, { childList: true, subtree: true }); } catch(e){}
  })();

  // scan ajax-loaded JSON embedded in page (e.g., <script id="__DATA__">) and search for URLs
  (function scanDataContainers() {
    setTimeout(()=> {
      const urlRegex = /https?:\/\/[^\s'"]{6,400}/g;
      Array.from(document.querySelectorAll('script, [data-props], [data-state]')).forEach(el=>{
        try {
          const t = el.textContent || el.getAttribute('data-props') || el.getAttribute('data-state');
          if (!t) return;
          let m;
          while ((m = urlRegex.exec(t)) !== null) {
            const u = m[0];
            if (!IGNORED_EXT.test(u)) store.add({url:u, type:'embedded-data'});
          }
        } catch(e){}
      });
    }, 1200);
  })();

  // attempt to list registered service worker scripts (can't intercept SW fetches, but can show their scripts)
  (function listServiceWorkers() {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then(regs=>{
          regs.forEach(r=>{
            try {
              if (r.active && r.active.scriptURL) store.add({url: r.active.scriptURL, method:'GET', type:'service-worker'});
              if (r.installing && r.installing.scriptURL) store.add({url: r.installing.scriptURL, method:'GET', type:'service-worker'});
            } catch(e){}
          });
        }).catch(()=>{});
      }
    } catch(e){}
  })();

  // periodic scan of window.__NEXT_DATA__ / window.__INITIAL_STATE__ etc, common for SPA frameworks
  (function scanGlobals() {
    const checks = ['__NEXT_DATA__','__PRELOADED_STATE__','__INITIAL_STATE__','__APOLLO_STATE__','__webpack_require__'];
    setInterval(()=> {
      try {
        checks.forEach(k => {
          const v = window[k];
          if (v && typeof v === 'object') {
            const s = JSON.stringify(v);
            const urlRegex = /https?:\/\/[^\s'"]{6,400}/g;
            let m; while ((m = urlRegex.exec(s)) !== null) {
              const u = m[0];
              if (!IGNORED_EXT.test(u)) store.add({url:u, type:'global-data', info: k});
            }
          }
        });
      } catch(e){}
    }, 4000);
  })();

  /* ---------- quick scan of existing network via performance.getEntries (start) ---------- */
  (function initialPerfScan() {
    try {
      const entries = performance.getEntriesByType ? performance.getEntriesByType('resource') : [];
      entries.forEach(e=>{
        if (e && e.name && !IGNORED_EXT.test(e.name)) store.add({url: e.name, method:'GET', type: e.initiatorType || 'resource'});
      });
    } catch(e){}
  })();

  /* ---------- start UI ---------- */
  try { createUI(); updateUI(); } catch(e){}

  /* ---------- expose minimal debug handle on window for manual use ---------- */
  window.__apiHunter = {
    list: ()=>store.list(),
    add: (o)=>store.add(o),
    clear: ()=>store.clear(),
    uiRefresh: ()=>updateUI()
  };

  // final note on load
  console.info('API Hunter loaded — endpoints will be detected for XHR/fetch/WS/resources/scripts. Use panel in top-right.');
})();