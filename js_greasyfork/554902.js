// ==UserScript==
// @name         Userscript Builder Helper - Smart Recorder v0.5
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Intelligent page recorder: filtered XHR/fetch capture, dedupe, token extraction, compact click->network mapping. Full / API-Focus modes.
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554902/Userscript%20Builder%20Helper%20-%20Smart%20Recorder%20v05.user.js
// @updateURL https://update.greasyfork.org/scripts/554902/Userscript%20Builder%20Helper%20-%20Smart%20Recorder%20v05.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // prevent double injection
  if (window.__usbuilder_v05_installed) return;
  window.__usbuilder_v05_installed = true;

  /**********************
   * Styles + UI
   **********************/
  GM_addStyle(`
    #usbuilderV5 { position: fixed; right: 12px; bottom: 12px; z-index:21474836470;
      background:#0f1724;color:#e6eef8;padding:10px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;max-width:420px;box-shadow:0 6px 18px rgba(2,6,23,0.6) }
    #usbuilderV5 h4{margin:0 0 8px 0;font-size:14px}
    #usbuilderV5 label{display:block;font-size:12px;color:#bfd7ff;margin-top:6px}
    #usbuilderV5 input[type="text"], #usbuilderV5 select {width:100%;box-sizing:border-box;padding:6px;border-radius:4px;border:1px solid #233445;background:#071225;color:#e6eef8}
    #usbuilderV5 .us-row{margin-top:8px;display:flex;gap:6px;align-items:center}
    #usbuilderV5 button{padding:6px 8px;border-radius:6px;border:0;background:#2563eb;color:#fff;cursor:pointer}
    #usbuilderV5 .us-mini{font-size:12px;color:#93b0d9}
    #usbuilderV5 .us-log{font-family:monospace;font-size:12px;color:#dbeafe;margin-top:8px;max-height:140px;overflow:auto;background:#071025;padding:6px;border-radius:6px}
    #usbuilderV5 .us-toggle {cursor:pointer;padding:6px 8px;border-radius:6px;background:#0b1220;border:1px solid #2b5580;color:#cfe6ff}
    #usbuilderV5 .pill {padding:4px 8px;border-radius:999px;background:#08203a;color:#bfe0ff;font-size:11px}
  `);

  const container = document.createElement('div');
  container.id = 'usbuilderV5';
  container.innerHTML = `
    <h4>US Builder Helper v0.5 <span class="pill">Smart Recorder</span></h4>
    <div class="us-row">
      <label style="flex:1">Mode</label>
      <select id="us-mode" title="Full capture keeps everything. API-Focus keeps same-origin XHR/fetch and tokens.">
        <option value="api">API-Focus (filtered)</option>
        <option value="full">Full Capture</option>
      </select>
    </div>
    <div class="us-row">
      <label style="flex:1">Recording</label>
      <button id="us-record" class="us-toggle">Start</button>
      <button id="us-inspect">Inspector</button>
    </div>
    <div class="us-row">
      <button id="us-export">Export (filtered JSON)</button>
      <button id="us-export-full">Export (full JSON)</button>
      <button id="us-clear">Clear</button>
    </div>
    <div class="us-row">
      <label class="us-mini">Network kept: same-origin XHR/fetch, non-static (when API-Focus). Full capture includes all network types.</label>
    </div>
    <div class="us-log" id="us-log"></div>
  `;
  document.body.appendChild(container);

  const logEl = document.getElementById('us-log');
  function log(msg, ...rest) {
    const line = `[${new Date().toLocaleTimeString()}] ${msg} ${rest.map(r=>typeof r==='object'?JSON.stringify(r):String(r)).join(' ')}`;
    const d = document.createElement('div');
    d.textContent = line;
    logEl.appendChild(d);
    logEl.scrollTop = logEl.scrollHeight;
    console.debug('USB', msg, ...rest);
  }

  /**********************
   * Internal store
   **********************/
  const store = {
    selectors: [], // {sel, outer, notes, firstSeen}
    network: [], // raw network records
    clickMap: [], // {selector, times:[], requests:[{type,url,method,status,sample}]}
    initial: {}  // tokens, meta, sampleScripts
  };

  // persistent recording state
  const LS_KEY = 'usbuilder_v05_recording';
  let recording = localStorage.getItem(LS_KEY) === '1';
  document.getElementById('us-record').textContent = recording ? 'Stop' : 'Start';

  /**********************
   * Mode & helpers
   **********************/
  function getMode() {
    return document.getElementById('us-mode').value; // 'api' or 'full'
  }
  function setRecording(val) {
    recording = !!val;
    localStorage.setItem(LS_KEY, recording ? '1' : '0');
    document.getElementById('us-record').textContent = recording ? 'Stop' : 'Start';
  }

  // CSS.escape fallback
  if (!CSS.escape) {
    CSS.escape = function (s) {
      return String(s).replace(/([^\w-])/g, '\\$1');
    };
  }

  /**********************
   * Selector generator
   **********************/
  function uniqueSelector(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.id) return `#${CSS.escape(el.id)}`;
    // prefer data-* attribute with value
    for (const a of el.attributes) {
      if (/^data-/.test(a.name) && a.value) return `${el.tagName.toLowerCase()}[${a.name}="${a.value.replace(/"/g,'\\"')}"]`;
    }
    let path = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 7) {
      let part = node.tagName.toLowerCase();
      if (node.className && typeof node.className === 'string') {
        const cls = node.className.split(/\s+/).filter(Boolean)[0];
        if (cls) part += `.${CSS.escape(cls)}`;
      }
      const parent = node.parentNode;
      if (parent && parent.children) {
        const sameTag = Array.from(parent.children).filter(n => n.tagName === node.tagName);
        if (sameTag.length > 1) {
          const idx = 1 + sameTag.indexOf(node);
          part += `:nth-of-type(${idx})`;
        }
      }
      path.unshift(part);
      node = node.parentNode;
      depth++;
    }
    return path.join(' > ');
  }

  /**********************
   * Initial page data capture (tokens, meta, scripts)
   **********************/
  function captureInitialData() {
    const tokens = {};
    // meta and hidden inputs
    document.querySelectorAll('meta, input[type="hidden"]').forEach(n => {
      try {
        const name = n.name || n.getAttribute && n.getAttribute('name') || '';
        const content = n.content || n.value || (n.getAttribute && n.getAttribute('content')) || '';
        if (name && /token|csrf|nonce|auth|sid|session/i.test(name)) tokens[name] = content || '';
      } catch (e) {}
    });
    // some pages put tokens into global vars or inline JSON; capture first few inline scripts
    const scripts = Array.from(document.scripts).map(s => s.textContent ? s.textContent.slice(0,2000) : '').filter(Boolean).slice(0,3);
    // also capture document.title and url
    return { url: location.href, title: document.title, tokens, sampleScripts: scripts };
  }
  store.initial = captureInitialData();

  /**********************
   * Network instrumentation (fetch, XHR, WebSocket light)
   **********************/
  // Guards to avoid double-hooking
  if (!window.__usbuilder_v05_hooks) window.__usbuilder_v05_hooks = {};

  // capture summary-safe body text
  function extractResponseSample(contentType, text) {
    if (!text) return '';
    const max = 1200;
    if (/application\/json/.test(contentType || '')) {
      // try to parse JSON safely and keep top-level keys/sample
      try {
        const v = JSON.parse(text);
        // if object/array, stringify truncated
        const s = JSON.stringify(v, (k, val) => {
          if (typeof val === 'string' && val.length > 300) return val.slice(0, 300) + '...';
          return val;
        });
        return s.length > max ? s.slice(0, max) + '... [truncated]' : s;
      } catch (e) {
        return text.slice(0, max) + (text.length > max ? '... [truncated]' : '');
      }
    } else {
      // text or html: keep small prefix only
      return text.slice(0, max) + (text.length > max ? '... [truncated]' : '');
    }
  }

  // heuristic: static assets to ignore
  const staticExtRE = /\.(png|jpe?g|gif|svg|ico|css|woff2?|ttf|eot|mp4|webm|mp3|ogg)(?:[\?#]|$)/i;

  function shouldKeepNetwork(rec, mode) {
    // rec: {type,url,method,status,response,headers}
    if (!rec || !rec.url) return false;
    // non-http origin (data:, blob:) -> ignore
    if (!/^https?:\/\//i.test(rec.url) && !rec.url.startsWith(location.origin)) return false;
    // mode 'api' restricts to same-origin and non-static
    const sameOrigin = rec.url.startsWith(location.origin) || rec.url.startsWith(window.location.protocol + '//' + window.location.host);
    if (mode === 'api' && !sameOrigin) return false;
    if (staticExtRE.test(rec.url)) return false;
    // keep XHR/fetch primarily; keep websocket messages only in full mode
    if (rec.type === 'xhr' || rec.type === 'fetch') return true;
    if (mode === 'full') {
      // allow ws, img load, css etc in full mode
      return true;
    }
    return false;
  }

  // add network record safely (obeying recording flag and mode)
  function safeAddNetwork(rec) {
    try {
      if (!recording) return;
      const mode = getMode();
      if (!shouldKeepNetwork(rec, mode)) return;
      store.network.push(rec);
    } catch (e) {}
  }

  // Hook fetch
  if (!window.__usbuilder_v05_hooks.fetch) {
    window.__usbuilder_v05_hooks.fetch = true;
    const origFetch = window.fetch.bind(window);
    window.fetch = async function (...args) {
      const start = Date.now();
      let url = args[0];
      let options = args[1] || {};
      try {
        const res = await origFetch.apply(this, args);
        // read content-type when possible
        let ct = '';
        try { ct = res.headers && (res.headers.get('content-type') || ''); } catch(e){}
        // attempt to clone and read text safely (may throw for binary)
        let sample = '';
        try {
          const c = res.clone();
          sample = await c.text().catch(()=>'<binary>');
          sample = extractResponseSample(ct, sample);
        } catch (e) { sample = '<no-body>'; }
        safeAddNetwork({
          type: 'fetch',
          url: String(url),
          options: options,
          method: options && options.method ? options.method : 'GET',
          status: res.status,
          time: Date.now() - start,
          response: sample,
          contentType: ct
        });
        return res;
      } catch (err) {
        safeAddNetwork({ type: 'fetch', url: String(url), options, error: String(err) });
        throw err;
      }
    };
  }

  // Hook XHR
  if (!window.__usbuilder_v05_hooks.xhr) {
    window.__usbuilder_v05_hooks.xhr = true;
    const origXHROpen = XMLHttpRequest.prototype.open;
    const origXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      try {
        this._us_meta = this._us_meta || {};
        this._us_meta.method = method;
        this._us_meta.url = url;
      } catch (e) {}
      return origXHROpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      try {
        const xhr = this;
        xhr._us_meta = xhr._us_meta || {};
        xhr._us_meta.start = Date.now();
        const onloadend = function () {
          try {
            const url = String(xhr._us_meta.url || '');
            const method = xhr._us_meta.method || 'GET';
            const status = xhr.status;
            let resp = '';
            try { resp = xhr.responseText; } catch (e){ resp = '<binary/unknown>'; }
            resp = typeof resp === 'string' ? extractResponseSample(xhr.getResponseHeader && xhr.getResponseHeader('content-type') || '', resp) : String(resp);
            safeAddNetwork({
              type: 'xhr',
              url, method, status,
              time: Date.now() - xhr._us_meta.start,
              response: resp,
              contentType: xhr.getResponseHeader && xhr.getResponseHeader('content-type')
            });
          } catch (e) {}
        };
        xhr.addEventListener('loadend', onloadend);
      } catch (e) {}
      return origXHRSend.apply(this, arguments);
    };
  }

  // Basic WebSocket light logging (only in full mode)
  if (!window.__usbuilder_v05_hooks.ws) {
    window.__usbuilder_v05_hooks.ws = true;
    const origWS = window.WebSocket;
    function WrappedWS(url, protocols) {
      const ws = protocols ? new origWS(url, protocols) : new origWS(url);
      const origSend = ws.send;
      ws.send = function (data) {
        try {
          safeAddNetwork({ type: 'ws-send', url, data: String(data).slice(0,500) });
        } catch (e) {}
        return origSend.apply(this, arguments);
      };
      ws.addEventListener('message', (m) => {
        try { safeAddNetwork({ type: 'ws-msg', url, data: String(m.data).slice(0,500) }); } catch(e){}
      });
      return ws;
    }
    WrappedWS.prototype = origWS.prototype;
    if (origWS.CONNECTING) {
      try { WrappedWS.CONNECTING = origWS.CONNECTING; WrappedWS.OPEN = origWS.OPEN; WrappedWS.CLOSING = origWS.CLOSING; WrappedWS.CLOSED = origWS.CLOSED; } catch(e){}
    }
    window.WebSocket = WrappedWS;
  }

  /**********************
   * Click -> network mapping (coalesced)
   **********************/
  let lastNetIndex = 0;
  function recordClickMapping(ev) {
    try {
      if (!recording) return;
      const sel = uniqueSelector(ev.target) || ev.target.tagName;
      // gather network since last index
      setTimeout(() => {
        const newNet = store.network.slice(lastNetIndex);
        lastNetIndex = store.network.length;
        // find or create entry
        let entry = store.clickMap.find(c => c.selector === sel);
        if (!entry) {
          entry = { selector: sel, firstSeen: Date.now(), times: [], requests: [] };
          store.clickMap.push(entry);
        }
        entry.times.push(Date.now());
        // append a compact sample of new requests (only unique by url+method)
        for (const r of newNet) {
          const key = `${r.type}|${r.method||''}|${r.url}`;
          if (!entry.requests.find(x => x.key === key)) {
            entry.requests.push({
              key,
              type: r.type, url: r.url, method: r.method || r.options && r.options.method || 'GET',
              status: r.status || null,
              sample: r.response ? (typeof r.response === 'string' ? r.response.slice(0,500) : String(r.response)) : ''
            });
          }
        }
      }, 200);
    } catch (e) {}
  }
  document.addEventListener('click', recordClickMapping, true);

  /**********************
   * Selector dedupe helper
   **********************/
  function addSelector(sel, outer, notes) {
    if (!sel) return;
    const exist = store.selectors.find(s => s.sel === sel);
    if (exist) {
      exist.lastSeen = Date.now();
      if (notes) exist.notes = exist.notes || notes;
      return;
    }
    store.selectors.push({ sel, outer: outer ? (outer.slice(0,400) + (outer.length>400?'...':'') ) : '', notes: notes || '', firstSeen: Date.now(), lastSeen: Date.now() });
  }

  // small inspector overlay
  let inspectorActive = false;
  const inspectorInfo = document.createElement('div');
  inspectorInfo.style.position = 'fixed';
  inspectorInfo.style.pointerEvents = 'none';
  inspectorInfo.style.zIndex = '21474836471';
  inspectorInfo.style.background = 'rgba(2,6,23,0.9)';
  inspectorInfo.style.color = '#dbeafe';
  inspectorInfo.style.padding = '6px';
  inspectorInfo.style.borderRadius = '6px';
  inspectorInfo.style.fontSize = '12px';
  inspectorInfo.style.display = 'none';
  document.body.appendChild(inspectorInfo);

  function onMouseMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const sel = uniqueSelector(el);
    inspectorInfo.style.left = (e.clientX + 12) + 'px';
    inspectorInfo.style.top = (e.clientY + 12) + 'px';
    inspectorInfo.textContent = `${el.tagName.toLowerCase()} — ${sel || ''}`;
  }
  function enableInspector() {
    inspectorActive = true;
    inspectorInfo.style.display = 'block';
    document.addEventListener('mousemove', onMouseMove, {passive:true});
    log('Inspector enabled');
  }
  function disableInspector() {
    inspectorActive = false;
    inspectorInfo.style.display = 'none';
    document.removeEventListener('mousemove', onMouseMove);
    log('Inspector disabled');
  }

  /**********************
   * Export & dedupe logic
   **********************/
  function dedupeNetwork(arr) {
    const seen = new Set();
    const out = [];
    for (const r of arr) {
      try {
        const key = `${r.type}|${r.method||''}|${r.url}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(r);
      } catch (e) {}
    }
    return out;
  }

  function compactClickMap(clickMap) {
    // reduce each entry to one sample request per unique key
    return clickMap.map(c => ({
      selector: c.selector,
      firstSeen: c.firstSeen,
      lastSeen: c.times && c.times.length ? c.times[c.times.length-1] : c.firstSeen,
      sampleRequests: (c.requests || []).slice(0,8).map(r => ({ type: r.type, url: r.url, method: r.method, status: r.status, sample: r.sample }))
    }));
  }

  function buildExport(mode) {
    // mode: 'api' or 'full' (for export choose what to include)
    const effectiveMode = mode || getMode();
    // choose network subset
    const net = dedupeNetwork(store.network.filter(r => shouldKeepNetwork(r, effectiveMode)));
    const compact = {
      meta: { createdAt: new Date().toISOString(), page: location.href, title: document.title, recorderVersion: '0.5' },
      mode: effectiveMode,
      initial: store.initial,
      selectors: store.selectors,
      network: net,
      clickMap: compactClickMap(store.clickMap)
    };
    return compact;
  }

  function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'usbuilder-capture.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**********************
   * Buttons wiring
   **********************/
  document.getElementById('us-record').addEventListener('click', () => {
    setRecording(!recording);
    log('Recording', recording ? 'started' : 'stopped', 'mode=', getMode());
  });

  document.getElementById('us-inspect').addEventListener('click', () => {
    inspectorActive ? disableInspector() : enableInspector();
  });

  document.getElementById('us-export').addEventListener('click', () => {
    const out = buildExport('api');
    downloadJSON(out, 'usbuilder-capture-api.json');
    log('Exported API-Focus JSON —', out.network.length, 'network entries,', out.clickMap.length, 'click mappings.');
  });

  document.getElementById('us-export-full').addEventListener('click', () => {
    const out = buildExport('full');
    downloadJSON(out, 'usbuilder-capture-full.json');
    log('Exported Full JSON —', out.network.length, 'network entries,', out.clickMap.length, 'click mappings.');
  });

  document.getElementById('us-clear').addEventListener('click', () => {
    store.network = []; store.clickMap = []; store.selectors = []; store.initial = captureInitialData();
    lastNetIndex = 0;
    log('Cleared recorded data.');
  });

  /**********************
   * Automatic shallow token refresh (update initial tokens occasionally)
   **********************/
  // Re-capture page tokens when visibility becomes visible (some sites set tokens later)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      store.initial = Object.assign({}, store.initial, captureInitialData());
      log('Initial page data refreshed (tokens/scripts).');
    }
  });

  /**********************
   * Populate selectors when inspector clicked
   **********************/
  // when user clicks while inspector active, capture selector
  document.addEventListener('click', function (ev) {
    if (!inspectorActive) return;
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const sel = uniqueSelector(ev.target);
      addSelector(sel, ev.target.outerHTML && ev.target.outerHTML.slice(0,800), 'inspector-capture');
      log('Inspector captured selector:', sel);
      disableInspector();
    } catch (e) {}
  }, true);

  /**********************
   * Final initialisation
   **********************/
  // restore recording state if previously enabled
  if (recording) log('Auto-starting recorder (persisted state). Mode:', getMode());
  // start small heartbeat log
  setInterval(() => {
    // summary every 10s while recording
    if (recording) {
      log(`Recording — selectors:${store.selectors.length} network:${store.network.length} clickMap:${store.clickMap.length}`);
    }
  }, 10000);

  // helpful quick note
  log('US Builder Helper v0.5 loaded. Use "API-Focus" mode for compact captures suitable for building automations.');

})();