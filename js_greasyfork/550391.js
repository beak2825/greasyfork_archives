// ==UserScript==
// @name         Shopee → Aff → FB Album/Reels (One-Click Panel)
// @namespace    https://markg.dev/userscripts/shopee-aff-fb
// @version      2025.10.15.2
// @description  Shopee PDP intercept → images+video → Shopee shortlink (SUBID) → caption → post ALBUM or REELS to selected FB Page via GAS. Mobile-safe capture + manual fallback. Per-photo captions (checkbox). Clean success logs.
// @author       You
// @match        https://shopee.ph/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      shopee.ph
// @connect      affiliate.shopee.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/550391/Shopee%20%E2%86%92%20Aff%20%E2%86%92%20FB%20AlbumReels%20%28One-Click%20Panel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550391/Shopee%20%E2%86%92%20Aff%20%E2%86%92%20FB%20AlbumReels%20%28One-Click%20Panel%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /** ===== CONFIG ===== */
  const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzEs7om9gYLzEZQ3xUh3Z-v8r3n7vCYtjqFqcUPsmxcMF7X_xG9n6DyPPPgH86n3E9i/exec';
  const SHOPEE_API     = 'https://affiliate.shopee.ph/api/v3/gql?q=batchCustomLink';
  const MAX_IMAGES     = 8;

  // NEW: canonical VOD host requested
  const VOD_HOST = 'https://down-ws-sg.vod.susercontent.com';

  const LS = {
    SUBID:       'saf_subid_v1',
    PAGES:       'saf_pages_cache_v1',
    UI:          'saf_ui_visible_v1',
    PER_T:       'saf_perphoto_tmpl_v1',
    LAST_TITLE:  'saf_last_title_v1',
    LAST_IMGS:   'saf_last_imgs_v1',
    LAST_VID:    'saf_last_vid_v1'
  };

  /** ===== mini utils ===== */
  let elLogs = { innerHTML: '' }; // stub until UI builds
  const looksHex32 = s => /^[0-9a-f]{32}$/i.test(String(s||''));
  const stripQuery = s => String(s||'').split('?')[0].replace(/^file\//,'');
  const escapeHtml = (s)=> String(s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const toReadable = (v)=>{ if(v==null) return String(v); if(typeof v==='string') return v; try{ return JSON.stringify(v,null,2);}catch{ return String(v);} };
  function log(m){
    const ts = new Date().toLocaleString();
    const s  = (typeof m === 'string') ? m : toReadable(m);
    const msg = s.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" class="saf-link">$1</a>');
    try { elLogs.innerHTML = `[${ts}] ${msg}<br>` + elLogs.innerHTML; elLogs.scrollTop = 0; } catch {}
  }
  // plain (no timestamp) logger for clean success lines
  function logPlain(m){
    const s  = (typeof m === 'string') ? m : toReadable(m);
    const msg = s.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" class="saf-link">$1</a>');
    try { elLogs.innerHTML = `${msg}<br>` + elLogs.innerHTML; elLogs.scrollTop = 0; } catch {}
  }

    function fbAbs(u){
  if(!u) return '';
  if(/^https?:\/\//i.test(u)) return u;
  if(u.startsWith('/')) return 'https://www.facebook.com' + u;
  return 'https://www.facebook.com/' + u;
}


   // --- MP4 detector helpers (same logic as the simple script) ---
const isMp4 = (url) => /\.mp4(\?|#|$)/i.test(String(url || ''));

function findAnyMp4(obj){
  try{
    const stack=[obj];
    while(stack.length){
      const v=stack.pop();
      if (typeof v === 'string' && isMp4(v)) return v;   // first .mp4 wins
      if (v && typeof v === 'object'){
        if (Array.isArray(v)) for (let i=v.length-1;i>=0;i--) stack.push(v[i]);
        else for (const k in v) stack.push(v[k]);
      }
    }
  }catch(_){}
  return '';
}


  /** ===== PDP intercept (mobile safe) ===== */
  const TARGETS = ['/api/v4/pdp/get_pc','/api/v4/pdp/get','/api/v4/item/get'];
  let buffered = [];
  function inject(){
    const code = `
      (function(){
        const TARGETS=${JSON.stringify(TARGETS)};
        function isWatch(u){ try{ return TARGETS.some(t=>String(u).indexOf(t)!==-1);}catch(_){return false;} }
        function post(json){ try{ window.postMessage({__saf:true,kind:'pdp',payload:json},'*'); }catch(_){ } }

        const _f=window.fetch;
        window.fetch=function(...a){
          try{
            const url=(typeof a[0]==='string')?a[0]:(a[0]&&a[0].url)||'';
            const watch=typeof url==='string' && isWatch(url);
            return _f.apply(this,a).then(resp=>{
              if(!watch) return resp;
              try{ const c=resp.clone(); c.json().then(j=>post(j)).catch(()=>{});}catch(_){}
              return resp;
            });
          }catch(_){return _f.apply(this,a);}
        };

        const XO=XMLHttpRequest.prototype.open, XS=XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open=function(m,u,...r){
          try{ this.__watch=(typeof u==='string'&&isWatch(u)); }catch(_){ this.__watch=false; }
          return XO.call(this,m,u,...r);
        };
        XMLHttpRequest.prototype.send=function(...a){
          if(this.__watch){
            this.addEventListener('load',()=>{
              try{
                if(this.responseType && this.responseType!=='' && this.responseType!=='text') return;
                const t=this.responseText; if(!t) return;
                post(JSON.parse(t));
              }catch(_){}
            });
          }
          return XS.apply(this,a);
        };
      })();
    `;
    const s=document.createElement('script'); s.textContent=code;
    (document.head||document.documentElement).appendChild(s); s.remove();
  }
  inject();
  window.addEventListener('message', ev => {
    const d = ev && ev.data; if(!d || !d.__saf || d.kind!=='pdp') return;
    if(d.payload) buffered.push(d.payload);
    updateCounts();
    log('PDP intercepted.');
  });

// Only return a *real* MP4 URL; otherwise return ''.
function ensureVideoUrl(input){
  const s = String(input || '').trim();
  // Full mp4 URL? accept as-is
  if (/^https?:\/\/.+\.mp4(\?|#|$)/i.test(s)) return s;

  // Shopee path that ALREADY contains /mms/...mp4 (rare but possible)
  if (/^\/?api\/v\d\/.+\/mms\/.+\.mp4/i.test(s)) {
    const path = s.startsWith('/') ? s : '/' + s;
    // Prefer the mms host (works on mobile), not down-*-sg
    return 'https://mms.vod.susercontent.com' + path;
  }
  // Everything else (hashes like /api/v4/8488..., HLS, etc.) is invalid for Reels
  return '';
}


  function ensureImageUrl(id){
    if(!id) return '';
    let x=stripQuery(id);
    if(/^https?:\/\//i.test(x)) return x;
    const base='https://down-ph.img.susercontent.com/file/';
    if(looksHex32(x)) return 'https://images.weserv.nl/?output=jpg&url='+encodeURIComponent(base+x);
    return base+x+'.jpg';
  }

  // Robust extractor: prefers data.product_images.video.video_id per request
function parseFromJson(json){
  try{
    // Some responses nest under data.data, some under data, some at top
    const lvl1 = json?.data?.data || json?.data || json;
    if (!lvl1) return null;

    // Title sources
    const title = (lvl1?.item?.title || lvl1?.name || lvl1?.title || '').trim();

    // === VIDEO (strict .mp4): deep scan for *any* .mp4 and use it as-is ===
    let video_url = findAnyMp4(lvl1);
    video_url = ensureVideoUrl(video_url);   // guard: '' if it wasn't truly an mp4

    // === IMAGES (unchanged) ===
    const imageIds =
      (Array.isArray(lvl1?.product_images?.images) && lvl1.product_images.images) ||
      (Array.isArray(lvl1?.images) && lvl1.images) ||
      (Array.isArray(lvl1?.item?.images) && lvl1.item.images) ||
      [];
    const image_urls = imageIds.slice(0,MAX_IMAGES).map(ensureImageUrl).filter(Boolean);

    if (!title && !video_url && !image_urls.length) return null;
    return { title, video_url, image_urls };
  }catch{
    return null;
  }
}


  function parseLatest(){
    if(!buffered.length) return null;
    for(let i=buffered.length-1;i>=0;i--){ const r=parseFromJson(buffered[i]); if(r) return r; }
    return null;
  }

  function extractIdsFromUrl(u){
    try{ const m=String(u||location.href).match(/\/i\.(\d+)\.(\d+)/); if(m) return {shopid:m[1],itemid:m[2]}; }catch(_){}
    return null;
  }

  function manualFetchPDP(){
    return new Promise((resolve)=>{
      const ids=extractIdsFromUrl(location.href); if(!ids) return resolve(null);
      const tryUrls=[
        `https://shopee.ph/api/v4/pdp/get_pc?shopid=${ids.shopid}&itemid=${ids.itemid}`,
        `https://shopee.ph/api/v4/item/get?shopid=${ids.shopid}&itemid=${ids.itemid}`
      ];
      const tryNext=(i)=>{
        if(i>=tryUrls.length) return resolve(null);
        GM_xmlhttpRequest({
          method:'GET', url:tryUrls[i], headers:{'Accept':'application/json'},
          onload:(res)=>{
            try{
              if(res.status>=200 && res.status<300 && res.responseText){
                const j=JSON.parse(res.responseText);
                buffered.push(j); updateCounts(); log('Manual PDP fetch ok.'); return resolve(j);
              }
            }catch(_){}
            tryNext(i+1);
          }, onerror:()=>tryNext(i+1)
        });
      }; tryNext(0);
    });
  }

  /** ===== SPA watcher ===== */
  let lastPath=location.pathname;
  setInterval(()=>{ if(location.pathname!==lastPath){ lastPath=location.pathname; buffered=[]; updateCounts(); log('Detected navigation — reset PDP buffer.'); } }, 800);

  /** ===== Affiliate (Shopee) ===== */
  function shopeeShort(originalLink, subId1){
    const payload={
      operationName:'batchGetCustomLink',
      query:`query batchGetCustomLink($linkParams: [CustomLinkParam!], $sourceCaller: SourceCaller){
        batchCustomLink(linkParams: $linkParams, sourceCaller: $sourceCaller){ shortLink longLink failCode }
      }`,
      variables:{ linkParams:[{ originalLink, advancedLinkParams: subId1 ? { subId1 } : {} }], sourceCaller:'CUSTOM_LINK_CALLER' }
    };
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'POST', url:SHOPEE_API, data:JSON.stringify(payload),
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        onload:(res)=>{
          try{
            const body=res.responseText||'';
            if(res.status!==200) return reject(new Error('Shopee HTTP '+res.status+': '+body.slice(0,200)));
            const j=JSON.parse(body); const it=(j?.data?.batchCustomLink||[])[0];
            if(!it) return reject(new Error('Empty batchCustomLink'));
            if(it.failCode&&it.failCode!==0) return reject(new Error('failCode='+it.failCode));
            if(!it.shortLink) return reject(new Error('No shortLink'));
            resolve(it.shortLink);
          }catch(e){ reject(e); }
        }, onerror:(e)=>reject(e)
      });
    });
  }

  /** ===== GAS POST (tolerant) ===== */
  function gasPost(action,data){
    const url=(GAS_WEBAPP_URL||'').trim(); if(!url) throw new Error('GAS Web App URL missing in script');
    const body=Object.assign({ action }, data||{});
    return new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:'POST', url, data:JSON.stringify(body),
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        onload:(res)=>{ let json=null; const text=res.responseText||''; try{ json=JSON.parse(text);}catch(_){ } resolve({status:res.status,json,text,url}); },
        onerror:(e)=>resolve({status:0,json:null,text:toReadable(e),url})
      });
    });
  }
  function looksOk(res){
    if (!res) return false;
    if (res.json && res.json.ok) return true;
    if (!res.json && typeof res.text==='string' && /"ok"\s*:\s*true/.test(res.text)) return true;
    return false;
  }
  function pickField(res, key){
    if (res?.json && res.json[key]) return res.json[key];
    if (res?.text) {
      const m = res.text.match(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`));
      return m ? m[1] : '';
    }
    return '';
  }

  /** ===== UI ===== */
  GM_addStyle(`
    .saf-toggle{position:fixed;right:14px;bottom:14px;z-index:2147483646;padding:12px 14px;border:1px solid #cfcfcf;border-radius:999px;background:#fff;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.18);font:15px system-ui;touch-action:manipulation}
    .saf-panel{position:fixed;right:14px;bottom:66px;width:480px;max-height:86vh;display:flex;flex-direction:column;background:#fff;border:1px solid #ddd;border-radius:16px;box-shadow:0 10px 26px rgba(0,0,0,.24);z-index:2147483647;overflow:hidden}
    .saf-hide{display:none!important}
    .saf-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#f6f6f8;border-bottom:1px solid #eee;font-weight:700}
    .saf-close{border:none;background:transparent;font-size:18px;cursor:pointer;line-height:1;padding:4px 6px}
    .saf-body{padding:12px;display:flex;flex-direction:column;gap:10px;overflow:auto}
    .saf-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .saf-row-1{display:grid;grid-template-columns:1fr auto auto;gap:8px}
    .saf-row-2{display:grid;grid-template-columns:1fr 1fr auto;gap:8px}
    .saf-input,.saf-text,.saf-select{width:100%;border:1px solid #d0d0d0;border-radius:12px;padding:10px 12px;font:15px system-ui}
    .saf-text{height:72px;min-height:60px;resize:vertical}
    .saf-btn{padding:10px 12px;border:1px solid #d0d0d0;border-radius:12px;background:#fff;cursor:pointer;font:15px system-ui}
    .saf-btn:hover{background:#f3f3f3}
    .saf-btn.tiny{padding:6px 8px;font-size:12px}
    .saf-btn:disabled{opacity:.6;cursor:not-allowed}
    .saf-small{font-size:12px;opacity:.75}
    .saf-badge{font-size:12px;background:#eee;border-radius:999px;padding:3px 8px}
    .saf-link{color:#0969da;text-decoration:underline}
    .saf-tmpl-wrap{border:1px dashed #ddd;border-radius:12px;padding:8px}
    .saf-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;opacity:.9}
    .saf-check input{width:16px;height:16px}
    .saf-logbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .saf-logs{width:100%;height:160px;border:1px solid #d0d0d0;border-radius:12px;padding:10px 12px;font:12px ui-monospace,monospace;background:#fafafa;overflow:auto;white-space:pre-wrap;word-break:break-word;flex:0 0 auto}
    .saf-logs.expanded{height:48vh}
    @media(max-width:768px){
      .saf-panel{left:8px;right:8px;width:auto;bottom:76px;max-height:92vh}
      .saf-toggle{right:10px;bottom:12px;padding:14px 16px;font-size:16px}
      .saf-row-1,.saf-row-2{grid-template-columns:1fr;gap:8px}
      .saf-row{grid-template-columns:1fr;gap:8px}
      .saf-text{min-height:72px}
      .saf-btn{width:100%}
      .saf-logs{height:32vh}
      .saf-logs.expanded{height:58vh}
    }
  `);

  let elPanel, elToggle, elPages, elSubId, elCaption, elPerTmpl, elAffLink, elCounts, elPostBtn, elCapAffBtn, elRefreshBtn, elLogExpandBtn, elPostType;
  let lastTitle='', lastImgs=[], lastVideo='';
  let postTicker=null, isPosting=false, logsExpanded=false;

  function buildUI(){
    elToggle=document.createElement('button');
    elToggle.className='saf-toggle';
    elToggle.textContent='AFF+FB';
    elToggle.onclick=()=>toggle();
    document.documentElement.appendChild(elToggle);

    elPanel=document.createElement('div');
    elPanel.className='saf-panel saf-hide';
    elPanel.innerHTML=`
      <div class="saf-hd">
        <div style="display:flex;align-items:center;gap:8px">
          <div>Aff Link + FB Album/Reels</div>
          <span id="saf-counts" class="saf-badge">0 imgs • 0 buf • vid: —</span>
        </div>
        <button id="saf-close" class="saf-close" title="Close">✕</button>
      </div>
      <div class="saf-body">
        <div class="saf-row-2">
          <select id="saf-pages" class="saf-select" title="Facebook Page"></select>
          <select id="saf-posttype" class="saf-select" title="Post Type">
            <option value="ALBUM">Album (images)</option>
            <option value="REEL">Reels (video)</option>
          </select>
          <button id="saf-refresh" class="saf-btn">Refresh Pages</button>
        </div>

        <div class="saf-row-1">
          <button id="saf-capaff" class="saf-btn">CAPTURE + AFF LINK</button>
          <input id="saf-subid" class="saf-input" placeholder="SUBID (Shopee subId1)" />
          <button id="saf-append" class="saf-btn">PUSH LOG</button>
        </div>

        <div class="saf-small">Affiliate Link</div>
        <input id="saf-afflink" class="saf-input" placeholder="generated link will appear here" />

        <div class="saf-small">Caption</div>
        <textarea id="saf-caption" class="saf-text" placeholder="Dito Mabibili👉 {link}\n{Product Name}"></textarea>

        <div class="saf-tmpl-wrap">
          <label class="saf-check">
            <input type="checkbox" id="saf-pertmpl-check"/>
            <span>Per-photo template (Album only)</span>
          </label>
          <div id="saf-tmpl-area" class="saf-hide" style="margin-top:6px">
            <div class="saf-small" style="margin-bottom:4px">Tokens: {link} {name} {idx} {n} {page}</div>
            <textarea id="saf-pertmpl" class="saf-text" placeholder="Dito Mabibili👉 {link}\n{name} (Photo {idx}/{n})"></textarea>
          </div>
        </div>

        <div class="saf-row">
          <button id="saf-post" class="saf-btn">POST</button>
          <button id="saf-log-expand" class="saf-btn">Expand Logs</button>
        </div>

        <div class="saf-logbar">
          <div class="saf-small">Logs</div>
        </div>
        <div id="saf-logs" class="saf-logs"></div>
      </div>
    `;
    document.documentElement.appendChild(elPanel);

    // refs
    elPages=elPanel.querySelector('#saf-pages');
    elPostType=elPanel.querySelector('#saf-posttype');
    elSubId=elPanel.querySelector('#saf-subid');
    elCaption=elPanel.querySelector('#saf-caption');
    elPerTmpl=elPanel.querySelector('#saf-pertmpl');
    const elPerCheck=elPanel.querySelector('#saf-pertmpl-check');
    const elTmplArea=elPanel.querySelector('#saf-tmpl-area');
    elLogs=elPanel.querySelector('#saf-logs');
    elAffLink=elPanel.querySelector('#saf-afflink');
    elCounts=elPanel.querySelector('#saf-counts');
    elPostBtn=elPanel.querySelector('#saf-post');
    elCapAffBtn=elPanel.querySelector('#saf-capaff');
    elRefreshBtn=elPanel.querySelector('#saf-refresh');
    elLogExpandBtn=elPanel.querySelector('#saf-log-expand');
    elPanel.querySelector('#saf-close').onclick=()=>toggle(false);

    // saved values
    elSubId.value=localStorage.getItem(LS.SUBID)||'';
    elPerTmpl.value=localStorage.getItem(LS.PER_T)||'Dito Mabibili👉 {link}\n{name} (Photo {idx}/{n})';
    try{ lastTitle=localStorage.getItem(LS.LAST_TITLE)||''; }catch{}
    try{ lastImgs=JSON.parse(localStorage.getItem(LS.LAST_IMGS)||'[]'); }catch{ lastImgs=[]; }
    try{ lastVideo=localStorage.getItem(LS.LAST_VID)||''; }catch{}

    // per-photo hidden until checked
    elPerCheck.checked = false;
    elTmplArea.classList.add('saf-hide');
    elPerCheck.onchange=()=>{ elTmplArea.classList.toggle('saf-hide', !elPerCheck.checked); };

    // binds
    elRefreshBtn.onclick=refreshPages;
    elCapAffBtn.onclick=onCapAff;
    elPostBtn.onclick=onPost;
    elPanel.querySelector('#saf-append').onclick=onAppend;
    elSubId.onchange=()=>localStorage.setItem(LS.SUBID, elSubId.value.trim());
    elPerTmpl.onchange=()=>localStorage.setItem(LS.PER_T, elPerTmpl.value);
    elLogExpandBtn.onclick=()=>{ logsExpanded=!logsExpanded; elLogs.classList.toggle('expanded',logsExpanded); elLogExpandBtn.textContent=logsExpanded?'Collapse Logs':'Expand Logs'; };
    elPostType.onchange = enforcePostTypeConstraints;

    // initial
    refreshPages();
    updateCounts();
    window.addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='s'){ e.preventDefault(); toggle(); } }, {passive:false});
    enforcePostTypeConstraints();
  }

  function toggle(forceShow){
    const isHidden = elPanel.classList.contains('saf-hide');
    const shouldShow = (typeof forceShow==='boolean') ? forceShow : isHidden;
    elPanel.classList.toggle('saf-hide', !shouldShow);
    localStorage.setItem(LS.UI, JSON.stringify(shouldShow));
  }

  function updateCounts(){
    try{
      const imgs=(lastImgs||[]).length;
      const vid = lastVideo ? '✓' : '—';
      if(elCounts) elCounts.textContent = `${imgs} imgs • ${buffered.length} buf • vid: ${vid}`;
      // also re-check if reels is allowed
      enforcePostTypeConstraints();
    }catch(_){}
  }

  function enforcePostTypeConstraints(){
    const mode = elPostType?.value || 'ALBUM';
    if(mode === 'REEL'){
      // Need a video URL
      if(!(lastVideo && isMp4(lastVideo))){
  elPostBtn.disabled = true;
  log('⚠️ Reels disabled: no usable .mp4 detected yet.');
} else {
  elPostBtn.disabled = false;
}

    }else{
      // Album mode needs images
      if(!lastImgs || !lastImgs.length){
        elPostBtn.disabled = true;
      }else{
        elPostBtn.disabled = false;
      }
    }
  }

  /** ===== GAS pages ===== */
  async function refreshPages(){
    try{
      const res=await gasPost('pages',{});
      if(res.status!==200) throw new Error(`HTTP ${res.status}`);
      if(!looksOk(res)){
        const cache=localStorage.getItem(LS.PAGES);
        log(`❌ Pages error: ${res.text ? res.text.slice(0,200) : 'no-json'}`);
        if(cache){
          const pages=JSON.parse(cache);
          elPages.innerHTML=pages.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${p.id}</option>`).join('');
          log(`Using cached pages (${pages.length}).`);
        }
        return;
      }
      const pages = res.json ? (res.json.pages||[]) : [];
      elPages.innerHTML=pages.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${p.id}</option>`).join('');
      localStorage.setItem(LS.PAGES, JSON.stringify(pages));
      log(`Loaded ${pages.length} pages.`);
    }catch(e){
      const cache=localStorage.getItem(LS.PAGES);
      if(cache){
        const pages=JSON.parse(cache);
        elPages.innerHTML=pages.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${p.id}</option>`).join('');
        log(`Using cached pages (${pages.length}).`);
      }else{
        log(`❌ Pages request failed: ${e.message||e}.`);
      }
    }
  }

  /** ===== CAPTURE + AFF ===== */
  async function onCapAff(){
    try{
      if(!buffered.length){ log('No PDP in buffer — trying manual PDP fetch…'); await manualFetchPDP(); }
      const r=parseLatest();
      if(!r){ alert('No PDP buffered yet. Try scrolling the gallery or tap CAPTURE again.'); return; }

      lastTitle=r.title||'';
      lastImgs=(r.image_urls||[]).slice(0,MAX_IMAGES);
      lastVideo=r.video_url||'';
        if (lastVideo) log('🎬 MP4 captured: ' + lastVideo);


      localStorage.setItem(LS.LAST_TITLE,lastTitle);
      localStorage.setItem(LS.LAST_IMGS,JSON.stringify(lastImgs));
      localStorage.setItem(LS.LAST_VID,lastVideo);

      updateCounts();
      log(`Captured PDP: ${lastTitle || '(no title)'} | images=${lastImgs.length} | video=${lastVideo ? 'yes' : 'no'}`);

      const cleanUrl=location.href.split('#')[0].split('?')[0];
      const sub=(document.getElementById('saf-subid').value||'').trim();
      log(`Generating Shopee shortlink (subId1=${sub||'-'})...`);
      const short=await shopeeShort(cleanUrl, sub || undefined);
      document.getElementById('saf-afflink').value=short;

      const elCap = document.getElementById('saf-caption');
      if(!elCap.value.trim()){ elCap.value = `Dito Mabibili👉 ${short}\n${lastTitle}`; }
      log('Shortlink ready. Caption updated.');
      enforcePostTypeConstraints();
    }catch(e){ log('❌ CAPTURE/AFF error: ' + (e.message || e)); }
  }

  /** ===== POST ===== */
  function setBusy(b){ [elPostBtn, elCapAffBtn, elRefreshBtn].forEach(x=>x && (x.disabled=!!b)); }

  async function onPost(){
    try{
      if (isPosting) { log('ℹ️ A post is already in progress…'); return; }
      isPosting = true;

      const sel=elPages.options[elPages.selectedIndex];
      const pageId=sel ? sel.value : ''; const pageName=sel ? sel.textContent.split(' — ')[0] : '';
      if(!pageId){ alert('Choose a Facebook Page'); isPosting=false; return; }

      const mode = elPostType.value || 'ALBUM';

      const affLink=document.getElementById('saf-afflink').value.trim();
      let caption=document.getElementById('saf-caption').value.trim();
      const perEnabled = !!document.getElementById('saf-pertmpl-check').checked;
      const perTmpl = perEnabled ? (document.getElementById('saf-pertmpl')?.value || '') : '';
      if(!caption){ caption = `Dito Mabibili👉 ${affLink || location.href.split('#')[0].split('?')[0]}\n${lastTitle}`; }

      setBusy(true);
      let tickerStart = Date.now();
      const tick = ()=>{ const s=Math.round((Date.now()-tickerStart)/1000); try{ elCounts.textContent = `Posting ${mode}… ${s}s`; }catch(_){} };
      const tmr = setInterval(tick, 500);

      let res;
      if(mode === 'REEL'){
        if(!lastVideo){ clearInterval(tmr); setBusy(false); isPosting=false; alert('No video captured. Switch to ALBUM or capture again.'); return; }
        log(`⏳ Posting REEL to "${pageName}"… uploading video via GAS`);
        res = await gasPost('postReel', { pageId, caption, videoUrl:lastVideo, meta:{ productTitle:lastTitle, affShopee:affLink, pageName } });
      }else{
        if(!lastImgs.length){ clearInterval(tmr); setBusy(false); isPosting=false; alert('No images captured. Click CAPTURE + AFF LINK first.'); return; }
        log(`⏳ Posting ALBUM to "${pageName}"… uploading photos via GAS`);
        res = await gasPost('postAlbum', { pageId, caption, imageUrls:lastImgs, perPhotoTemplate: perTmpl, meta:{ productTitle:lastTitle, affShopee:affLink, pageName } });
      }

      clearInterval(tmr); setBusy(false); updateCounts(); isPosting=false;

      if (looksOk(res)) {
  const permalink = pickField(res, 'permalink');
  const fullLink = permalink
    ? permalink.startsWith('http')
      ? permalink
      : 'https://www.facebook.com' + (permalink.startsWith('/') ? permalink : '/' + permalink)
    : '';

  const uploaded =
    pickField(res, mode === 'REEL' ? 'uploadedVideo' : 'uploaded') ||
    (mode === 'REEL' ? 1 : lastImgs.length);

  const linkLine = fullLink
    ? `\nLink: ${fullLink}`
    : `\nLink: (unavailable)`;

  logPlain(
    `Posted ${mode === 'REEL' ? '1 video (Reel)' : `${uploaded} images (Album)`} to "${pageName}"${linkLine}`
  );
  return;
}

      const brief = (res.text||'').slice(0,300).replace(/\s+/g,' ');
      log(`❌ Post failed — status=${res.status} body~300="${brief}"`);
      alert('Post failed. See logs.');
    }catch(e){
      setBusy(false); updateCounts(); isPosting=false;
      log('❌ Post error: ' + toReadable(e));
    }
  }

  /** ===== PUSH LOG ===== */
  async function onAppend(){
    try{
      const sel=elPages.options[elPages.selectedIndex];
      const pageName=sel ? sel.textContent.split(' — ')[0] : '';
      const row=[ new Date().toISOString(), pageName, (lastTitle||''), (document.getElementById('saf-afflink').value||''), (lastImgs.length||0), (lastVideo?lastVideo:'') ];
      const res=await gasPost('append',{ sheet:'ALBUM_POST_LOG', row });
      if(looksOk(res)){ log(`Logged to sheet.`); } else { log(`❌ Log append failed — status=${res.status} body~200="${(res.text||'').slice(0,200)}"`); }
    }catch(e){ log('❌ Log append error: ' + toReadable(e)); }
  }

  /** ===== boot ===== */
  function buildAndWire(){
    buildUI();
    if (JSON.parse(localStorage.getItem(LS.UI)||'false')) toggle(true);
  }
  buildAndWire();
})();
