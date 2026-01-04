// ==UserScript==
// @name         Torn Item Circulation → Google Sheet (daily UTC)
// @namespace    torn-circulation-sheet
// @author       SuperGogu[3580072]
// @version      1.1.1
// @description  Fetch Torn items circulation (tradeable only) once per UTC day and push to Google Sheet via a GAS WebApp. Floating, hideable settings panel. Batching + retry.
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549990/Torn%20Item%20Circulation%20%E2%86%92%20Google%20Sheet%20%28daily%20UTC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549990/Torn%20Item%20Circulation%20%E2%86%92%20Google%20Sheet%20%28daily%20UTC%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Storage helpers ----------
  const LS = {
    get k() { return GM_getValue('torn_api_key', ''); },
    set k(v) { GM_setValue('torn_api_key', String(v || '').trim()); },

    get gas() { return GM_getValue('gas_url', ''); },
    set gas(v) { GM_setValue('gas_url', String(v || '').trim()); },

    get sid() { return GM_getValue('sheet_id', ''); },
    set sid(v) { GM_setValue('sheet_id', String(v || '').trim()); },

    get tab() { return GM_getValue('sheet_tab', 'Items'); },
    set tab(v) { GM_setValue('sheet_tab', String(v || 'Items').trim()); },

    get lastUTC() { return GM_getValue('last_fetch_date_utc', ''); },
    set lastUTC(v) { GM_setValue('last_fetch_date_utc', v); },

    get panelHidden() { return GM_getValue('panel_hidden', false); },
    set panelHidden(v) { GM_setValue('panel_hidden', !!v); },

    get pos() { return GM_getValue('panel_pos', { x: 20, y: 80 }); },
    set pos(v) { GM_setValue('panel_pos', v); },

    get opacity() { return GM_getValue('panel_opacity', 0.9); },
    set opacity(v) { GM_setValue('panel_opacity', Math.min(1, Math.max(0.2, Number(v) || 0.9))); },
  };

  // ---------- Utils ----------
  const todayUTC = () => new Date().toISOString().slice(0,10); // "YYYY-MM-DD"
  const statusToday = () => (LS.lastUTC === todayUTC() ? 'Today data retrieved' : "Today data hasn't been retrieved");

  function isValidGasUrl(u){
    try{
      const url = new URL(u);
      return url.protocol === 'https:' &&
             url.hostname === 'script.google.com' &&
             /\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
    }catch(_){ return false; }
  }

  function xhr(opts) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: opts.method || 'GET',
        url: opts.url,
        headers: opts.headers || {},
        data: opts.data || null,
        timeout: opts.timeout || 60000,
        onload: (res) => {
          console.log("[XHR onload]", res.status, res.statusText, (res.responseText || '').slice(0,200));
          if (res.status >= 200 && res.status < 300) resolve(res);
          else reject(new Error(`HTTP ${res.status}: ${(res.responseText || '').slice(0,300)}`));
        },
        onerror: (e) => {
          console.error("[XHR onerror]", e);
          reject(new Error('Network error (see console for details)'));
        },
        ontimeout: () => {
          console.error("[XHR timeout]");
          reject(new Error('Request timeout'));
        }
      });
    });
  }

  // ---------- UI ----------
// ===== UI (resizable + opacity + TM menu) =====
// ===== UI (resizable + opacity + TM menu) =====
GM_addStyle(`
  #tornCirPanel {
    position: fixed; z-index: 999999; top: ${LS.pos.y}px; left: ${LS.pos.x}px;
    width: 420px; min-width: 300px; min-height: 140px;
    background: #141414; /* fără alpha aici; controlăm cu element.opacity */
    color: #eee; border: 1px solid #444; border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0,0,0,.35);
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    resize: both; overflow: auto;  /* ← resizable */
    backdrop-filter: blur(4px);
  }
  #tornCirPanel .hdr {
    cursor: move; padding: 10px 12px;
    display:flex; align-items:center; justify-content:space-between;
    font-weight:600; background: rgba(255,255,255,.05); border-bottom:1px solid #444;
    border-top-left-radius:12px; border-top-right-radius:12px;
    user-select: none;
  }
  #tornCirPanel .body { padding: 10px 12px; }
  #tornCirPanel input[type=text], #tornCirPanel input[type=url] {
    width: 100%; padding: 6px 8px; border: 1px solid #555; border-radius: 8px;
    background: rgba(255,255,255,.07); color:#eee; outline:none;
  }
  #tornCirPanel .row { margin-bottom: 8px; }
  #tornCirPanel .btn {
    padding: 8px 10px; border-radius: 8px; border: 1px solid #666;
    background: rgba(255,255,255,.08); color:#eee; cursor:pointer;
  }
  #tornCirPanel .btn:hover { background: rgba(255,255,255,.14); }
  #tornCirPanel .muted { color: #bbb; font-size: 12px; }
  #tornCirPanel .grid { display:grid; grid-template-columns: 1fr 1fr; gap:8px; }
  #tornCirPanel .fine { font-size: 12px; opacity: .9; }
  #tornCirPanel .success { color: #8bc34a; }
  #tornCirPanel .error { color: #ef5350; }
`);

const panel = document.createElement('div');
panel.id = 'tornCirPanel';
panel.style.display = LS.panelHidden ? 'none' : 'block';
panel.style.opacity = LS.opacity;               // ← controlăm opacitatea aici
panel.innerHTML = `
  <div class="hdr">
    <div>TORN • Item Circulation</div>
    <div class="grid" style="grid-template-columns:auto auto auto; gap:6px; align-items:center;">
      <label class="fine">Opacity</label>
      <input type="text" id="tcOpacity" value="${LS.opacity}" style="width:56px;padding:4px 6px;">
      <button id="tcHide" class="btn" title="Hide panel">Hide</button>
    </div>
  </div>
  <div class="body">
    <div class="row muted" id="tcStatus">${statusToday()}</div>
    <div class="row grid">
      <button class="btn" id="tcFetch">Fetch</button>
      <button class="btn" id="tcSave">Save settings</button>
    </div>
    <div class="row">
      <label class="fine">Torn API Key</label>
      <input type="text" id="tcApiKey" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value="${LS.k}">
    </div>
    <div class="row">
      <label class="fine">GAS WebApp URL (…/exec)</label>
      <input type="url" id="tcGasUrl" placeholder="https://script.google.com/macros/s/AKfycb.../exec" value="${LS.gas}">
    </div>
    <div class="row">
      <label class="fine">Google Sheet ID</label>
      <input type="text" id="tcSheetId" placeholder="1AbCDeFGh... (din URL-ul foii)" value="${LS.sid}">
    </div>
    <div class="row">
      <label class="fine">Tab (foaia)</label>
      <input type="text" id="tcSheetTab" placeholder="Items" value="${LS.tab}">
    </div>
    <div class="row fine muted">Status push: <span id="tcPushMsg">–</span></div>
  </div>
`;
document.body.appendChild(panel);

// ✅ adaugă comanda în meniul Tampermonkey (iconița TM → click pe script)
if (typeof GM_registerMenuCommand === 'function') {
  GM_registerMenuCommand('Show Torn Panel', () => {
    panel.style.display = 'block';
    LS.panelHidden = false;
  });
}

// helper select
const el = (sel)=>panel.querySelector(sel);

// Hide → doar ascunde; reapari din meniul TM
el('#tcHide').onclick = ()=> { panel.style.display='none'; LS.panelHidden=true; };

// Save settings
el('#tcSave').onclick = ()=>{
  const gasUrl = el('#tcGasUrl').value.trim();
  if (!isValidGasUrl(gasUrl)) {
    el('#tcPushMsg').className = 'error';
    el('#tcPushMsg').textContent = 'GAS URL invalid. Trebuie https://script.google.com/.../exec';
    return;
  }
  LS.k   = el('#tcApiKey').value;
  LS.gas = gasUrl;
  LS.sid = el('#tcSheetId').value;
  LS.tab = el('#tcSheetTab').value;

  // opacity operat pe element, nu pe background
  const newOpacity = Number(el('#tcOpacity').value);
  if (!isNaN(newOpacity)) {
    LS.opacity = newOpacity;
    panel.style.opacity = LS.opacity;
  }

  el('#tcPushMsg').textContent = 'Settings saved';
  el('#tcPushMsg').className = '';
};

// Fetch
el('#tcFetch').onclick = runFetch;

// Drag support (funcționează și cu resize)
(function makeDraggable(elm, handleSel='.hdr'){
  const handle = elm.querySelector(handleSel);
  let sx=0, sy=0, ox=0, oy=0, dragging=false;
  handle.addEventListener('mousedown', e=>{
    // nu iniția drag când userul apasă pe inputul de opacity sau pe buton
    const t = e.target;
    if (t.tagName === 'INPUT' || t.classList.contains('btn')) return;
    dragging=true; sx=e.clientX; sy=e.clientY;
    const r = elm.getBoundingClientRect(); ox=r.left; oy=r.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e=>{
    if(!dragging) return;
    const nx = ox + (e.clientX - sx);
    const ny = oy + (e.clientY - sy);
    elm.style.left = `${nx}px`;
    elm.style.top  = `${ny}px`;
  });
  document.addEventListener('mouseup', ()=>{
    if(dragging){
      LS.pos = { x: parseInt(elm.style.left,10)||20, y: parseInt(elm.style.top,10)||80 };
      dragging=false;
    }
  });
})(panel);

// schimbare live de opacity
el('#tcOpacity').addEventListener('change', ()=>{
  const v = Number(el('#tcOpacity').value);
  if (!isNaN(v)) {
    LS.opacity = Math.min(1, Math.max(0.2, v));
    panel.style.opacity = LS.opacity;
  }
});



  // ---------- Core ----------
    async function runFetch() {
        // UI helper
        const msg = (t, cls) => {
            const m = el('#tcPushMsg');
            m.textContent = t;
            m.className = cls || '';
        };

        // Validări
        el('#tcStatus').textContent = statusToday();
        if (!LS.k)  { msg('Setează Torn API key', 'error'); return; }
        if (!LS.gas){ msg('Setează GAS WebApp URL (/exec)', 'error'); return; }
        if (!LS.sid){ msg('Setează Google Sheet ID', 'error'); return; }

        // Date: azi pentru status (fetch), ieri pentru eticheta din sheet (effective)
        const fetchDateUTC = () => new Date().toISOString().slice(0,10);  // azi
        const effectiveDateUTC = () => {                                   // ieri
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - 1);
            return d.toISOString().slice(0,10);
        };

        try {
            // 1) Fetch din Torn
            msg('Fetching from Torn…');
            const url = `https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(LS.k)}&comment=TORNItemCirculation`;
            const res = await xhr({ url, timeout: 120000 });
            if (res.status !== 200) throw new Error(`HTTP ${res.status}: ${(res.responseText||'').slice(0,200)}`);
            const json = JSON.parse(res.responseText || '{}');
            if (!json.items) throw new Error('Unexpected API response (no items)');

            // 2) Transformă în obiecte (cum așteaptă GAS)
            const items = [];
            for (const [id, obj] of Object.entries(json.items)) {
                if (obj && obj.tradeable === true) {
                    items.push({
                        id: Number(id),
                        name: String(obj.name),
                        circulation: Number(obj.circulation)
                    });
                }
            }
            items.sort((a,b)=>a.id - b.id);
            if (!items.length) { msg('Nu sunt iteme tradeable.', 'error'); return; }

            // 3) POST către GAS (toate odată)
            const payload = {
                sheetId: LS.sid,
                tabName: LS.tab || 'Items',
                dateUTC: effectiveDateUTC(),  // ieri -> corect pentru datele Torn
                items: items                  // obiecte, nu liste!
            };
            console.log('[TM] sending payload:', JSON.stringify(payload).slice(0,400));

            const push = await xhr({
                method: 'POST',
                url: LS.gas,                         // .../exec
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(payload),
                timeout: 120000
            });

            const resp = JSON.parse(push.responseText || '{}');
            if (resp && resp.ok === false) throw new Error(resp.error || 'GAS error');

            // 4) Status „azi s-a făcut fetch”
            LS.lastUTC = fetchDateUTC();           // azi -> corect pentru panou
            el('#tcStatus').textContent = statusToday();
            msg(`Saved ${items.length} rows for ${payload.dateUTC}.`, 'success');

        } catch (e) {
            console.error(e);
            el('#tcPushMsg').className = 'error';
            el('#tcPushMsg').textContent = e.message || 'Network error';
        }
    }




  // Auto-run o dată pe zi (UTC)
  (async function autoDaily() {
    if (LS.lastUTC !== todayUTC()) {
      setTimeout(runFetch, 2500);
    }
  })();

})();
