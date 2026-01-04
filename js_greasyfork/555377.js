// ==UserScript==
// @name         Shopee Reviews+PDP Interceptor (GUI + Push, LIVE)
// @namespace    https://markg.dev/userscripts/shopee-reviews-pdp
// @version      6.3.0
// @description  LIVE capture of PDP desc, PDP main video, PDP images, and up to 12 UNIQUE review videos. Auto-paginates get_ratings via virtual requests (offset=0,6,12,...) until enough videos. Push to GAS to download & log. CLEAR & LISTEN (no reload).
// @author       You
// @match        https://shopee.ph/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      shopee.ph
// @downloadURL https://update.greasyfork.org/scripts/555377/Shopee%20Reviews%2BPDP%20Interceptor%20%28GUI%20%2B%20Push%2C%20LIVE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555377/Shopee%20Reviews%2BPDP%20Interceptor%20%28GUI%20%2B%20Push%2C%20LIVE%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ================= CONFIG ================= */
  const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxK06D-oVUmz6n35bApz1gsTWFNA1qsc281k7HrW3Klmlsq0Aqvlmu8RZHeUO0_wBN34Q/exec';
  const TARGET_VIDEO_COUNT = 12;
  const VIRT_LIMIT = 6;
  const VIRT_DELAY_MS = 600;
  const VIRT_MAX_EMPTY = 2;

  /** =============== STORAGE KEYS =============== */
  const LS_KEYS = {
    RAW_BUF: 'shp_raw_buf_v2',
    SNAP: 'shp_current_snap_v2',
    LAST_RATINGS_URL: 'shp_last_ratings_url_v1',
    LAST_PDP_IDS: 'shp_last_pdp_ids_v1', // {itemid, shopid}
  };

  /** =============== SESSION KEYS (panel memory only) =============== */
  const SESSION_KEYS = {
    PANEL_OPEN: 'mg_panel_open_v1',
  };

  /** =============== tiny storage helpers =============== */
  const readJSON = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : (f ?? null);} catch{ return f ?? null; } };
  const writeJSON = (k, o) => { try { localStorage.setItem(k, JSON.stringify(o)); } catch{} };

  /** ================== INTERCEPT (fetch + XHR) ================== */
function inject(){
  const code = `
    (function(){
      const WATCH = [
        '/api/v4/pdp/get_pc',
        '/api/v4/pdp/get',
        '/api/v4/item/get',
        '/api/v2/item/get_ratings',
        '/api/v4/item/get_ratings'
      ];

      function isHit(u){
        try { return WATCH.some(k => String(u).includes(k)); } catch { return false; }
      }
      function post(kind, payload){
        try { window.postMessage({__markg:true, kind, payload}, '*'); } catch(_){}
      }

      // --- fetch hook
      const _fetch = window.fetch;
      window.fetch = function(...args){
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url);
        const watch = isHit(url);
        return _fetch.apply(this, args).then(res=>{
          if (!watch) return res;
          try { res.clone().json().then(j => post('pdp_or_ratings', {url, data:j})); } catch(_){}
          return res;
        });
      };

      // --- XHR hook
      const _open = XMLHttpRequest.prototype.open;
      const _send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(m,u,...r){
        this.__watch = isHit(u);
        this.__url = u;
        return _open.call(this,m,u,...r);
      };
      XMLHttpRequest.prototype.send = function(...args){
        if(this.__watch){
          this.addEventListener('load',()=>{
            try{
              const t = this.responseText;
              if(!t) return;
              post('pdp_or_ratings', {url:this.__url, data:JSON.parse(t)});
            }catch(_){}
          });
        }
        return _send.apply(this,args);
      };

      // === Bridge for virtual fetches (AUTO 12) ===
      // Listens for { __mgVirtFetch:true, url, reqId } from the userscript
      // Performs fetch in page context and posts back { __mgVirtResp:true, reqId, ok, data }
      window.addEventListener('message', async (e) => {
        const m = e && e.data;
        if (!m || !m.__mgVirtFetch || !m.url || !m.reqId) return;
        try {
          const r = await fetch(m.url, { credentials: 'include' });
          let data = null, ok = r.ok;
          try { data = await r.json(); } catch (_){}
          window.postMessage({ __mgVirtResp: true, reqId: m.reqId, ok, data }, '*');
        } catch (_){
          window.postMessage({ __mgVirtResp: true, reqId: m.reqId, ok:false, data:null }, '*');
        }
      });

    })();
  `;
  const s=document.createElement('script');
  s.textContent=code;
  (document.head||document.documentElement).appendChild(s);
  s.remove();
}


  inject();

  /** =============== pending resolvers for virtual fetches =============== */
  const __virtWaiters = new Map();

  /** =============== SPA NAV HOOKS (Shopee is SPA) =============== */
  (function hookHistory(){
    const _ps = history.pushState;
    const _rs = history.replaceState;
    function fireNav(){ window.dispatchEvent(new Event('mg:navigate')); }
    history.pushState = function(a,b,u){ const r = _ps.apply(this, arguments); fireNav(); return r; };
    history.replaceState = function(a,b,u){ const r = _rs.apply(this, arguments); fireNav(); return r; };
    window.addEventListener('popstate', fireNav);
  })();

  /** =============== PDP helpers (video + images) =============== */
  function ensureVideoURL(path){
    if(!path) return '';
    if(/^https?:\/\//i.test(path)) return path;
    const p = path.startsWith('/') ? path : ('/'+path);
    return 'https://down-bs-sg.vod.susercontent.com' + p;
  }
  function ensureImageURL(imageId){
    const id = String(imageId||'').trim();
    if(!id) return '';
    if(/^https?:\/\//i.test(id)) return id;
    return 'https://down-ph.img.susercontent.com/file/' + id;
  }
  function _isMp4(u){ return /\.mp4(\?|#|$)/i.test(String(u||'')); }
  function _deepFindFirstMp4(obj){
    try{
      const st=[obj];
      while(st.length){
        const v=st.pop();
        if (typeof v === 'string' && _isMp4(v)) return v;
        if (v && typeof v === 'object'){
          if (Array.isArray(v)){
            for(let i=v.length-1;i>=0;i--) st.push(v[i]);
          }else{
            for(const k in v) st.push(v[k]);
          }
        }
      }
    }catch(_){}
    return '';
  }
  function _normalizeMp4(urlOrPath){
    const s = String(urlOrPath||'').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    if (/^\/?mms\/.+\.mp4/i.test(s)){
      const p = s.startsWith('/') ? s : '/'+s;
      return 'https://mms.vod.susercontent.com' + p;
    }
    return s;
  }

  /** =============== LIVE BUFFER + DISPATCH =============== */
  function pushRaw(msg){
    const buf = readJSON(LS_KEYS.RAW_BUF, []);
    buf.push(msg);
    if(buf.length > 1000) buf.splice(0, buf.length - 1000);
    writeJSON(LS_KEYS.RAW_BUF, buf);
    render();
    updateCounts();
  }

// Listen to page messages (normalize to 'pdp' or 'ratings')
window.addEventListener('message', ev => {
  const d = ev && ev.data;
  if (!d) return;

  // virtual fetch responses (for AUTO 12)
  if (d.__mgVirtResp && d.reqId) {
    const waiter = __virtWaiters && __virtWaiters.get(d.reqId);
    if (waiter) {
      __virtWaiters.delete(d.reqId);
      waiter({ ok: !!d.ok, data: d.data || null });
    }
    return;
  }

  if (!d.__markg || d.kind !== 'pdp_or_ratings') return;

  const url  = d.payload?.url  || '';
  const data = d.payload?.data || null;
  if (!url || !data) return;

  let kind = 'other';
  if (/\/item\/get_ratings\b/.test(url)) {
    kind = 'ratings';
    try { localStorage.setItem(LS_KEYS.LAST_RATINGS_URL, url); } catch {}
  } else if (/\/pdp\/get_pc\b|\/pdp\/get\b|\/item\/get\b/.test(url)) {
    kind = 'pdp';
  }

  // store ids as soon as we see a PDP payload (helps AUTO without reloading)
  if (kind === 'pdp') {
    try {
      const ids = {
        itemid: data?.data?.item?.itemid,
        shopid: data?.data?.item?.shopid
      };
      if (ids.itemid && ids.shopid) writeJSON(LS_KEYS.LAST_PDP_IDS, ids);
    } catch {}
  }

  pushRaw({ kind, url, data, ts: Date.now() });

  // light debounce without throwing if the name doesn't exist
  if (typeof window.__mgDebounceRender === 'function') {
    window.__mgDebounceRender();
  } else {
    // tiny, safe debounce
    let t = window.__mgRenderTick || null;
    if (t) clearTimeout(t);
    window.__mgRenderTick = setTimeout(() => { try { render(); updateCounts(); } catch {} }, 120);
  }
});



  /** =============== RATINGS PARSERS =============== */
  function normalizeText(s){
    return String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  }
  function reviewKey(r, videoURL){
    const id = r?.rating_id || r?.cmtid || r?.cmtid_str || r?.orderid || r?.order_id;
    if (id) return 'id:'+String(id);
    return 'tx:'+normalizeText(r?.comment||'')+'|u:'+String(videoURL||'');
  }
  function parseRatingsBlock(json){
    const arr = json?.data?.ratings;
    if(!Array.isArray(arr)) return [];
    const out = [];
    for(const r of arr){
      let videoURL = '';
      let duration = 0;
      if(Array.isArray(r?.medias) && r.medias.length){
        const v = r.medias.find(m => m?.video?.url);
        if(v && v.video && v.video.url){
          videoURL = ensureVideoURL(v.video.url);
          duration = Number(v.video.duration || 0);
        }
      }
      const comment = (r?.comment || '').trim();
      const productName = (r?.original_item_info?.name || '').trim();
      const key = reviewKey(r, videoURL);
      out.push({ key, comment, productName, videoURL, duration });
    }
    return out;
  }

  /** =============== PDP PARSER (video + images) =============== */
  function parsePDP(json){
    const data = json?.data;
    if(!data) return null;

    const item = data?.item || {};
    const title = (item?.title || '').trim();
    const rawDesc = (item?.description || '').trim();

    // PDP main video
    let pdpVideoURL = '';
    const maybe = data?.product_images?.video?.default_format?.url;
    if (maybe) pdpVideoURL = ensureVideoURL(maybe);
    if (!pdpVideoURL) {
      const anyMp4 = _deepFindFirstMp4(data);
      if (anyMp4) {
        const norm = _normalizeMp4(anyMp4);
        pdpVideoURL = ensureVideoURL(norm);
      }
    }

    // PDP images
    let pdpImages = [];
    const arr = data?.product_images?.images;
    if (Array.isArray(arr) && arr.length) {
      const uniq = new Set();
      for (const id of arr) {
        const u = ensureImageURL(id);
        if (u && !uniq.has(u)) uniq.add(u);
      }
      pdpImages = Array.from(uniq);
    }

    const ids = { itemid: item?.itemid, shopid: item?.shopid };
    writeJSON(LS_KEYS.LAST_PDP_IDS, ids);

    return { title, description: rawDesc, pdpVideoURL, pdpImages, ids };
  }

  /** =============== SNAPSHOT BUILDER =============== */
  function buildSnapshot(){
    const raw = readJSON(LS_KEYS.RAW_BUF, []);
    if(!raw || !raw.length) return null;

    // last PDP
    let title = '', description = '', pdpVideoURL = '', pdpImages = [];
    for(let i=raw.length-1;i>=0;i--){
      if(raw[i].kind==='pdp'){
        const p = parsePDP(raw[i].data);
        if(p){ title = p.title; description = p.description; pdpVideoURL = p.pdpVideoURL || ''; pdpImages = p.pdpImages || []; break; }
      }
    }
    if(!title) return null;

    const comments = [];
    const videos = [];
    const seenReview = new Set();

    for(const item of raw){
      if(item.kind!=='ratings') continue;
      const rows = parseRatingsBlock(item.data);
      for(const r of rows){
        if(r.comment) comments.push(r.comment);
        if(r.videoURL){
          const key = r.key || (r.comment + '|' + r.videoURL);
          if(!seenReview.has(key)){
            seenReview.add(key);
            videos.push({ url:r.videoURL, videoURL:r.videoURL, secs: Math.round(Number(r.duration||0)) });
            if(videos.length >= TARGET_VIDEO_COUNT) break;
          }
        }
      }
      if(videos.length >= TARGET_VIDEO_COUNT) break;
    }

    return {
      title,
      description,
      pdpVideoURL,
      pdpImages,
      comments,
      videos,
      ts: new Date().toISOString()
    };
  }
  /** =============== VIRTUAL CRAWLER (auto paginate ratings) =============== */
  let _virtStop = false;
  let _virtBusy = false;

  function urlWithOffset(baseUrl, offset){
    try{
      const u = new URL(baseUrl);
      u.searchParams.set('offset', String(offset));
      u.searchParams.set('limit', String(VIRT_LIMIT));
      return u.toString();
    }catch(_){ return ''; }
  }

  function buildBaseRatingsURL(){
    const last = localStorage.getItem(LS_KEYS.LAST_RATINGS_URL);
    if (last) {
      try {
        const u = new URL(last);
        u.searchParams.set('limit', String(VIRT_LIMIT));
        u.searchParams.set('offset', '0');
        return u.toString();
      } catch(_) {}
    }
    const ids = readJSON(LS_KEYS.LAST_PDP_IDS, {});
    if (ids?.itemid && ids?.shopid){
      const u = new URL('https://shopee.ph/api/v2/item/get_ratings');
      u.searchParams.set('filter', '0');
      u.searchParams.set('flag', '1');
      u.searchParams.set('type', '0');
      u.searchParams.set('exclude_filter', '1');
      u.searchParams.set('filter_size', '0');
      u.searchParams.set('fold_filter', '0');
      u.searchParams.set('relevant_reviews', 'false');
      u.searchParams.set('request_source', '2');
      u.searchParams.set('limit', String(VIRT_LIMIT));
      u.searchParams.set('offset', '0');
      u.searchParams.set('shopid', String(ids.shopid));
      u.searchParams.set('itemid', String(ids.itemid));
      return u.toString();
    }
    return '';
  }

  async function virtFetch(url){
    return await new Promise((resolve)=>{
      const reqId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      __virtWaiters.set(reqId, (resp)=>{
        if (resp && resp.ok && resp.data) return resolve(resp.data);
        resolve(null);
      });
      window.postMessage({ __mgVirtFetch: true, url, reqId }, '*');
      setTimeout(()=>{
        if (__virtWaiters.has(reqId)) {
          __virtWaiters.delete(reqId);
          resolve(null);
        }
      }, 10000);
    });
  }

  async function startAuto(){
    if(_virtBusy) return;
    _virtStop = false;
    _virtBusy = true;
    if (BTN_AUTO) { BTN_AUTO.textContent = 'AUTO 12…'; BTN_AUTO.disabled = true; }

    let base = buildBaseRatingsURL();
    if(!base){
      alert('No PDP/ratings context yet. Open the PDP first so I can learn itemid/shopid.');
      _virtBusy = false;
      if (BTN_AUTO) { BTN_AUTO.textContent = 'AUTO 12'; BTN_AUTO.disabled = false; }
      return;
    }

    let offset = 0;
    let emptyStreak = 0;

    while(!_virtStop){
      const url = urlWithOffset(base, offset);
      if(!url) break;

      const json = await virtFetch(url);
      if(json){
        pushRaw({ kind:'ratings', url, data: json, ts: Date.now() });

        const snapNow = buildSnapshot();
        writeJSON(LS_KEYS.SNAP, snapNow);

        const have = snapNow?.videos?.length || 0;
        const rows = json?.data?.ratings || [];
        const addedSomething = Array.isArray(rows) && rows.some(r => Array.isArray(r?.medias) && r.medias.some(m=>m?.video?.url));
        if (!addedSomething) emptyStreak++; else emptyStreak = 0;

        if (have >= TARGET_VIDEO_COUNT) break;
        if (emptyStreak >= VIRT_MAX_EMPTY) break;
      }else{
        emptyStreak++;
        if (emptyStreak >= VIRT_MAX_EMPTY) break;
      }

      offset += VIRT_LIMIT;
      await new Promise(r=>setTimeout(r, VIRT_DELAY_MS));
    }

    _virtBusy = false;
    _virtStop = false;
    if (BTN_AUTO) { BTN_AUTO.textContent = 'AUTO 12'; BTN_AUTO.disabled = false; }
    render();
  }

  function stopAuto(){ _virtStop = true; }

  /** =============== GUI =============== */
  let PANEL, BADGE, BTN_PARSE, BTN_PUSH, BTN_AUTO, BTN_STOP;
  let __renderTicker = null;

  GM_addStyle(`
    .mg-toggle{position:fixed;left:16px;bottom:16px;z-index:999999;background:#111;color:#fff;border:1px solid #333;border-radius:999px;padding:10px 14px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35)}
    .mg-panel{position:fixed;left:16px;bottom:64px;width:520px;max-width:95vw;max-height:72vh;z-index:999999;background:#0f0f0f;color:#eee;border:1px solid #333;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.4);display:none;overflow:hidden;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
    .mg-panel.open{display:block}
    .mg-head{display:flex;align-items:center;justify-content:space-between;background:#171717;padding:8px 10px}
    .mg-title{font-weight:800}
    .mg-badge{background:#444;padding:2px 8px;border-radius:999px;font-size:12px}
    .mg-body{padding:10px}
    .mg-desc{white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .mg-row{margin:8px 0 0 0;font-size:13px}
    .mg-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .mg-btn{background:#2f2f2f;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700}
    .mg-btn[disabled]{opacity:.6;cursor:default}
    .mg-ok{background:#2f6bcb}
    .mg-cap{background:#2f7a53}
    .mg-clear{background:#b63939}
    .mg-auto{background:#6b5b2f}
    .mg-stop{background:#8a2be2}
    .mg-small{font-size:12px;color:#aaa;margin-top:6px}
  `);

  function twoLine(s){
    if(!s) return '';
    const lines = String(s).split(/\r?\n/).filter(Boolean);
    const flat = lines.join(' ').replace(/\s+/g,' ').trim();
    return flat.length > 180 ? flat.slice(0, 180)+'…' : flat;
  }

  function hardClearUI() {
    try {
      if (BADGE) BADGE.textContent = '0';
      const pd = document.getElementById('mg-pd');
      const vd = document.getElementById('mg-vd');
      const cm = document.getElementById('mg-cm');
      const mv = document.getElementById('mg-mv');
      const ds = document.getElementById('mg-desc');
      const im = document.getElementById('mg-img');
      if (pd) pd.innerHTML = '<b>Item:</b> —';
      if (mv) mv.textContent = 'Main PDP video: —';
      if (im) im.textContent = 'PDP images: 0';
      if (vd) vd.textContent = `Review videos: 0/${TARGET_VIDEO_COUNT}`;
      if (cm) cm.textContent = 'Comments: 0';
      if (ds) ds.textContent = '—';
      if (BTN_PUSH) BTN_PUSH.disabled = true;
    } catch(_) {}
  }

  function hardClear() {
    try { _virtStop = true; } catch(_) {}
    try { _virtBusy = false; } catch(_) {}
    localStorage.removeItem(LS_KEYS.RAW_BUF);
    localStorage.removeItem(LS_KEYS.SNAP);
    localStorage.removeItem(LS_KEYS.LAST_RATINGS_URL);
    localStorage.removeItem(LS_KEYS.LAST_PDP_IDS);
    hardClearUI();
  }

  function rememberPanelOpen() {
    try {
      const open = PANEL && PANEL.classList.contains('open') ? '1' : '0';
      sessionStorage.setItem(SESSION_KEYS.PANEL_OPEN, open);
    } catch(_){}
  }

  function render(){
    const snap = buildSnapshot();
    writeJSON(LS_KEYS.SNAP, snap);

    const pd = document.getElementById('mg-pd');
    const vd = document.getElementById('mg-vd');
    const cm = document.getElementById('mg-cm');
    const mv = document.getElementById('mg-mv');
    const im = document.getElementById('mg-img');
    if(!pd || !vd || !cm || !mv || !im) return;

    if(!snap){
      pd.innerHTML = '<b>Item:</b> —';
      mv.textContent = 'Main PDP video: —';
      im.textContent = 'PDP images: 0';
      vd.textContent = `Review videos: 0/${TARGET_VIDEO_COUNT}`;
      cm.textContent = `Comments: 0`;
      document.getElementById('mg-desc').textContent = '—';
      if (BTN_PUSH) BTN_PUSH.disabled = true;
      return;
    }

    pd.innerHTML = `<b>Item:</b> ${snap.title || '—'}`;
    mv.textContent = `Main PDP video: ${snap.pdpVideoURL ? 'YES' : '—'}`;
    im.textContent = `PDP images: ${Array.isArray(snap.pdpImages) ? snap.pdpImages.length : 0}`;
    vd.textContent = `Review videos: ${snap.videos.length}/${TARGET_VIDEO_COUNT}`;
    cm.textContent = `Comments: ${snap.comments.length}`;
    document.getElementById('mg-desc').textContent = twoLine(snap.description || '');

    const hasAnyAsset = (snap.videos && snap.videos.length) || snap.pdpVideoURL || (snap.pdpImages && snap.pdpImages.length);
    BTN_PUSH.disabled = (!snap.title || !hasAnyAsset);
  }

  function updateCounts(){
    if(!BADGE) return;
    const raw = readJSON(LS_KEYS.RAW_BUF, []);
    const snap = readJSON(LS_KEYS.SNAP, null);
    const vids = (snap?.videos?.length||0);
    const imgs = (snap?.pdpImages?.length||0);
    BADGE.textContent = `${vids}v ${imgs}i | ${raw.length} raw`;
  }

  function makeGUI(){
    const t = document.createElement('button');
    t.className = 'mg-toggle';
    t.textContent = 'REV+PDP';
    t.title = 'Toggle Shopee Reviews+PDP Panel (Shift+R)';
    t.addEventListener('click', ()=>{
      PANEL.classList.toggle('open');
      rememberPanelOpen();
    });
    document.documentElement.appendChild(t);

    PANEL = document.createElement('div');
    PANEL.className = 'mg-panel';
    PANEL.innerHTML = `
      <div class="mg-head">
        <div class="mg-title">Shopee Reviews + PDP <span style="font-weight:700;opacity:.8">· LIVE</span></div>
        <div class="mg-badge" id="mg-badge">0</div>
      </div>
      <div class="mg-body">
        <div class="mg-row" id="mg-pd"><b>Item:</b> —</div>
        <div class="mg-row mg-desc" id="mg-desc">—</div>
        <div class="mg-row" id="mg-mv">Main PDP video: —</div>
        <div class="mg-row" id="mg-img">PDP images: 0</div>
        <div class="mg-row" id="mg-vd">Review videos: 0/${TARGET_VIDEO_COUNT}</div>
        <div class="mg-row" id="mg-cm">Comments: 0</div>
        <div class="mg-btns">
          <button class="mg-btn mg-cap"  id="mg-parse">CLEAR & LISTEN</button>
          <button class="mg-btn mg-auto" id="mg-auto">AUTO 12</button>
          <button class="mg-btn mg-stop" id="mg-stop">STOP</button>
          <button class="mg-btn mg-ok"   id="mg-push" disabled>PUSH</button>
          <button class="mg-btn mg-clear" id="mg-clear">CLEAR</button>
        </div>
        <div class="mg-small">Live mode: intercepts PDP/Ratings network calls in real time (fetch + XHR), no reload needed. AUTO 12 does virtual paging.</div>
      </div>
    `;
    document.documentElement.appendChild(PANEL);

    BADGE    = document.getElementById('mg-badge');
    BTN_PARSE= document.getElementById('mg-parse');
    BTN_PUSH = document.getElementById('mg-push');
    BTN_AUTO = document.getElementById('mg-auto');
    BTN_STOP = document.getElementById('mg-stop');

    // CLEAR & LISTEN — wipe buffers, keep sniffing
    BTN_PARSE.addEventListener('click', ()=>{
      hardClear();
      if (__renderTicker) clearInterval(__renderTicker);
      __renderTicker = setInterval(()=>{ render(); updateCounts(); }, 400);
      setTimeout(()=>{ if (__renderTicker) { clearInterval(__renderTicker); __renderTicker=null; } }, 15000);
    });

    BTN_AUTO.addEventListener('click', startAuto);
    BTN_STOP.addEventListener('click', stopAuto);
    BTN_PUSH.addEventListener('click', onPush);

    document.getElementById('mg-clear').addEventListener('click', hardClear);

    window.addEventListener('keydown', (e)=>{
      if(e.shiftKey && (e.key==='r' || e.key==='R')){
        e.preventDefault();
        PANEL.classList.toggle('open');
        rememberPanelOpen();
      }
    });

    // initial render
    render(); updateCounts();
  }

  // Build GUI and start live-ish feedback on load
  makeGUI();
  (function bootLiveCapture(){
    try {
      const wasOpen = sessionStorage.getItem(SESSION_KEYS.PANEL_OPEN) === '1';
      if (wasOpen && PANEL) PANEL.classList.add('open');
    } catch(_){}
    if (__renderTicker) clearInterval(__renderTicker);
    __renderTicker = setInterval(()=>{ render(); updateCounts(); }, 400);
    setTimeout(()=>{ if (__renderTicker) { clearInterval(__renderTicker); __renderTicker=null; } }, 20000);
  })();

  // When SPA route changes, clear buffers but keep listening
  window.addEventListener('mg:navigate', ()=>{
    rememberPanelOpen();
    hardClear();
    if (__renderTicker) clearInterval(__renderTicker);
    __renderTicker = setInterval(()=>{ render(); updateCounts(); }, 400);
    setTimeout(()=>{ if (__renderTicker) { clearInterval(__renderTicker); __renderTicker=null; } }, 15000);
  });

  /** =============== PUSH (to GAS) =============== */
  let pushing = false;

  function postJSON(url, obj){
    return new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:'POST',
        url,
        headers:{ 'Content-Type':'application/json' },
        data: JSON.stringify(obj),
        onload: (res)=>{
          let json = null;
          try{ json = JSON.parse(res.responseText); }catch(_){}
          resolve({ ok: res.status>=200 && res.status<300, status:res.status, json, text:res.responseText });
        },
        onerror: (e)=>resolve({ ok:false, status:0, json:null, text:String(e) }),
        ontimeout: ()=>resolve({ ok:false, status:0, json:null, text:'timeout' })
      });
    });
  }

  async function onPush(){
    if(pushing) return;
    const snap = readJSON(LS_KEYS.SNAP, null);
    if(!snap || !snap.title){
      alert('No snapshot yet. Browse a PDP or click AUTO 12 first.');
      return;
    }

    const vids = (snap.videos || []).slice(0, TARGET_VIDEO_COUNT)
      .map(v => v.url || v.videoURL)
      .filter(Boolean);

    const imgs = Array.isArray(snap.pdpImages) ? snap.pdpImages.filter(Boolean) : [];

    if (vids.length === 0 && !snap.pdpVideoURL && imgs.length === 0){
      alert('No assets found (no PDP video, no review videos, no PDP images).');
      return;
    }

    pushing = true;
    BTN_PUSH.textContent = 'PUSHING…';
    BTN_PUSH.disabled = true;

    const payload = {
      action: 'PUSH_SHOPEE_REVIEWS',
      item_name: snap.title,
      description: snap.description || '',
      reviews: snap.comments || [],
      video_urls: vids,
      pdp_video_url: snap.pdpVideoURL || '',
      image_urls: imgs
    };

    const r = await postJSON(GAS_WEBAPP_URL, payload);

    pushing = false;
    BTN_PUSH.textContent = 'PUSH';
    BTN_PUSH.disabled = false;

    if(!r.ok){
      alert('GAS error:\n' + (r.text || 'unknown'));
      return;
    }
    if(!r.json || !r.json.ok){
      alert('Unexpected response:\n' + (r.text || JSON.stringify(r.json)));
      return;
    }

    alert('Saved:\nJSON: '+r.json.jsonLink+'\nFOLDER: '+r.json.videosLink);
  }

})();
