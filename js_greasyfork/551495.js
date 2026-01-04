// ==UserScript==
// @name         WME Quick HN Importer CH
// @description  Quick housnumber importer CH: fetches address points per tile via GeoAdmin Identify, colors green when street names match; Do NOT use together with other QHN scripts.
// @version      2025.10.03.12
// @author       Ari (Reloaded); Gerhard; Based on Tom 'Glodenox' Puttemans original concept for BE
// @namespace    ch-qhn/wme
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      api3.geo.admin.ch
// @run-at       document-idle
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/551495/WME%20Quick%20HN%20Importer%20CH.user.js
// @updateURL https://update.greasyfork.org/scripts/551495/WME%20Quick%20HN%20Importer%20CH.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    // --------------------------
    // Config (readable constants)
    // --------------------------
    const TAG = 'CH QHN:';
    const SCRIPT_ID = 'ch-qhn';
  
    const KEYS = {
      ENABLE : 'CHQHN_ENABLED',
      CIRCLES: 'CHQHN_CIRCLES',
      SNAP_PX: 'CHQHN_SNAP',
      DEV    : 'CHQHN_DEV'
    };
  
    const DEFAULTS = {
      ENABLE : true,
      CIRCLES: true,
      SNAP_PX: 120,
      DEV    : false
    };
  
    // Small tiles avoid Identify's per-request cap; per-tile cache with simple LRU
    const TILE = {
      SIZE_M : 500,
      TTL_DAYS: 7,
      MAX    : 500,
      NS     : 'CHQHN_TILE_',
      META   : 'CHQHN_META',
      SCHEMA : 1
    };
  
    // Modest concurrency to be nice to the API
    const REQ = {
      CONC : 5,
      RETRY: 1
    };
  
    // --------------------------
    // Logging (dev-friendly)
    // --------------------------
    /* eslint-disable no-console */
    const LOG =( ...a)=>console.log(`%c${TAG}`,'color:#0a7e00;font-weight:bold;',...a);
    const WARN=( ...a)=>console.warn(TAG,...a);
    const ERR =( ...a)=>console.error(`%c${TAG}`,'color:#ff0033;font-weight:bold;',...a);
    /* eslint-enable no-console */
  
    // --------------------------
    // Storage helpers
    // --------------------------
    const hasGM = typeof GM_getValue==='function' && typeof GM_setValue==='function';
    const GM_Get=(k,d)=>{ try{ return GM_getValue(k,d); } catch { return d; } };
    const GM_Set=(k,v)=>{ try{ GM_setValue(k,v); } catch {} };
  
    // --------------------------
    // WME handles & UI state
    // --------------------------
    let WME=null, OL=null, wmeSDK=null;
  
    let hintsLayer=null;
    let loadingBanner=null;
    let editButtonsRoot=null;
    let tabLabelEl=null;
  
    let isEnabled       = hasGM ? GM_Get(KEYS.ENABLE , DEFAULTS.ENABLE ) !== false : DEFAULTS.ENABLE;
    let circlesEnabled  = hasGM ? GM_Get(KEYS.CIRCLES, DEFAULTS.CIRCLES) !== false : DEFAULTS.CIRCLES;
    let SNAP_PX         = Number(GM_Get(KEYS.SNAP_PX, DEFAULTS.SNAP_PX)) || DEFAULTS.SNAP_PX;
    let devMode         = hasGM ? !!GM_Get(KEYS.DEV, DEFAULTS.DEV) : DEFAULTS.DEV;
    const DBG=(...a)=>{ if (devMode) console.debug('%cCH QHN:[dev]','color:#7a7a7a;font-weight:bold;',...a); };
  
    // Data used for filling/painting
    let chPoints=[]; // {lon,lat,number,streetName,processed,sameStreet}
    let selectedStreetNames=[];
    let selectedNormSet=new Set();
    let lastRenderedItems=[];
  
    // R-key flow
    let armedForNext=false, pendingRefPx=null, pendingCommit=null, isFilling=false;
    const fillQueue=[];
  
    // Debounced selection
    let selDebounceTimer=null;
  
    // In-memory tile mirror
    const memTiles=new Map();
  
    // Projections
    let _epsg4326=null, _mapProj=null, _epsg4326_back=null;
  
    // --- Styles ---
    GM_addStyle?.(`
      .ch-qhn-hints, .ch-qhn-hints * { pointer-events:none !important; }
      .pane { padding:12px; font-size:13px; line-height:1.4; }
      .row { display:flex; align-items:center; gap:8px; margin:0 0 10px; }
      .row.muted { display: block; } 
      .status { font-weight:600; }
      .btn { border:1px solid #ccc; border-radius:6px; padding:6px 10px; cursor:pointer; background:#f5f5f5; }
      .btn:hover { filter:brightness(0.98); }
      .toggle { display:inline-flex; align-items:center; gap:8px; cursor:pointer; }
      .muted { opacity:.7; }
      .snap input[type="number"] { width:90px; padding:4px 6px; }
    `);
  
    // --- Bootstrap WME and start once available ---
    (async function boot(){
      LOG('Bootstrapping…');
      const ok=await poll(()=>unsafeWindow?.W && unsafeWindow?.OpenLayers && unsafeWindow?.W?.map && unsafeWindow?.W?.model, 900, 150);
      if (!ok) return ERR('WME not ready, aborting');
      WME=unsafeWindow.W; OL=unsafeWindow.OpenLayers;
      try{
        if (unsafeWindow.SDK_INITIALIZED){
          await unsafeWindow.SDK_INITIALIZED;
          wmeSDK=unsafeWindow.getWmeSdk && unsafeWindow.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: 'CH Quick HN' });
        }
      }catch{}
      init();
    })();
  
    // --- Main init: layers, events, UI wiring ---
    function init(){
      LOG(`Init (SNAP_PX=${SNAP_PX}, Circles=${circlesEnabled?'ON':'OFF'})`);
      const search=document.getElementById('search-autocomplete');
      editButtonsRoot=(search && search.parentNode) || document.body;
  
      // Vector hints layer: green = same street (normalized), grey = other street
      hintsLayer=new OL.Layer.Vector('Quick HN Importer (CH)',{
        uniqueName:'quick-hn-importer-ch-tiled',
        className:'ch-qhn-hints',
        styleMap:new OL.StyleMap({
          'default':new OL.Style(
            {
              fillColor   :'${fillColor}',
              fillOpacity :'${opacity}',
              fontColor   :'#111',
              fontWeight  :'bold',
              strokeColor :'#fff',
              strokeOpacity:'${opacity}',
              strokeWidth :2,
              pointRadius :'${radius}',
              label       :'${number}',
              title       :'${title}'
            },
            {
              context:{
                fillColor: f => (f.attributes?.__sameStreet ? '#99ee99' : '#cccccc'),
                radius  : f => Math.max(String(f.attributes?.number||'').length*6, 10),
                opacity : f => (f.attributes?.__sameStreet && f.attributes?.processed ? 0.3 : 1),
                title   : f => (f.attributes?.streetName && f.attributes?.number)
                               ? `${f.attributes.streetName} ${f.attributes.number}` : ''
              }
            }
          )
        })
      });
      try{ WME.map.addLayer(hintsLayer); }catch(e){ return ERR('Failed to add layer',e); }
      liftHints();
  
      // Bottom loading banner while fetching address points
      loadingBanner=document.createElement('div');
      loadingBanner.style.cssText='position:absolute;bottom:35px;width:100%;pointer-events:none;display:none;';
      loadingBanner.innerHTML='<div style="margin:0 auto;max-width:360px;text-align:center;background:rgba(0,0,0,.5);color:#fff;border-radius:5px;padding:6px 14px"><i class="fa fa-pulse fa-spinner"></i> Loading address points…</div>';
      (document.getElementById('map')||document.body).appendChild(loadingBanner);
  
      // WME events
      if (wmeSDK){
        wmeSDK.Events.on({ eventName:'wme-selection-changed', eventHandler: ()=>{
          if (selDebounceTimer) clearTimeout(selDebounceTimer);
          selDebounceTimer=setTimeout(onSelectionChanged, 200);
        }});
        wmeSDK.Events.on({ eventName:'wme-house-number-added', eventHandler: refreshProcessedFromModel });
        wmeSDK.Events.on({ eventName:'wme-house-number-moved', eventHandler: refreshProcessedFromModel });
        LOG('SDK events wired');
      } else {
        setInterval(onSelectionChanged, 1200);
        LOG('Fallback selection poller active');
      }
  
      // Capture "R" in capture phase to avoid default reverse-direction action
      const keyHandler=(e)=>{
        if (!isEnabled || !e?.key) return;
        if (e.key.toLowerCase()==='r' && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey){
          const segs=safeSegs();
          if (segs?.length && !isTyping()){ e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault(); onPressR(); }
        }
      };
      document.addEventListener('keydown', keyHandler, true);
      window.addEventListener('keydown', keyHandler, true);
  
      setupSidebar();
      applyEnabledStateToUi();
      onSelectionChanged();
    }
  
    // --- Sidebar UI ---
    async function setupSidebar(){
      try{
        if (!WME?.userscripts?.registerSidebarTab) throw new Error('Sidebar API not available');
        const { tabLabel, tabPane } = WME.userscripts.registerSidebarTab(SCRIPT_ID);
        tabLabelEl=tabLabel; updateTabLabel(); tabLabel.title='CH Quick HN Importer';
  
        tabPane.innerHTML = `
          <div class="pane">
            <div class="row">
              <label class="toggle">
                <input type="checkbox" id="enabled">
                <span>Enable script (press <code>R</code> to fill)</span>
              </label>
            </div>
  
            <div class="row">
              <label class="toggle">
                <input type="checkbox" id="circles">
                <span>Show circles</span>
              </label>
            </div>
  
            <div class="row snap">
              <label for="snap">SNAP distance (px):</label>
              <input type="number" id="snap" min="40" max="400" step="10" placeholder="120">
            </div>
  
            <div class="row muted">
              Above ~120 px the risk of snapping to the wrong number increases. Please test in your area.
            </div>
  
            <div class="row muted">
              Status: <span id="status" class="status"></span>
            </div>
  
            <div class="row">
              <button type="button" id="clear" class="btn">Clear HN cache</button>
              <button type="button" id="reload" class="btn">Reload HN</button>
            </div>
  
            <div class="row muted">
              Flow: R + click fills the HN and disables the entry.
            </div>
  
            <div class="row muted">
              The tool picks the nearest house number; it does not validate street assignment.<br/>
              Green circle = number on the selected street<br/>
              Grey circle = number on another street or name mismatch (e.g., “Saint” vs “St.”). Use carefully.
            </div>
  
            <div class="row muted"><p style="margin:0">
            Note: Switzerland only. Do <strong>not</strong> run together with other QHN scripts.
            </p></div>
  
            <div class="row muted" style="font-size:11px;">
              <label class="toggle">
                <input type="checkbox" id="dev">
                <span>Dev mode (extra logs)</span>
              </label>
            </div>
          </div>`;
  
        await WME.userscripts.waitForElementConnected(tabPane);
  
        tabPane.querySelector('#enabled').checked = !!isEnabled;
        tabPane.querySelector('#circles').checked = !!circlesEnabled;
        tabPane.querySelector('#dev').checked     = !!devMode;
        tabPane.querySelector('#snap').value      = String(SNAP_PX);
        tabPane.querySelector('#status').textContent = isEnabled ? 'ON' : 'OFF';
  
        tabPane.querySelector('#enabled').addEventListener('change',e=>setEnabled(e.target.checked));
        tabPane.querySelector('#circles').addEventListener('change',e=>setCirclesEnabled(e.target.checked));
        tabPane.querySelector('#dev').addEventListener('change',e=>setDevMode(e.target.checked));
        tabPane.querySelector('#snap').addEventListener('change',e=>{ setSnapPx(Number(e.target.value)); e.target.value=String(SNAP_PX); });
        tabPane.querySelector('#clear').addEventListener('click',clearCache);
        tabPane.querySelector('#reload').addEventListener('click',()=>{ if (isEnabled) onSelectionChanged(true); });
      }catch(e){ WARN('Sidebar setup unavailable:', e?.message||e); }
    }
    // Update the tab label (shows ON/OFF and DEV tag)
    function updateTabLabel() {
        if (!tabLabelEl) return;
        const onOff = isEnabled ? '• ON 🟢' : '';
        const devTag = devMode ? ' • DEV 🛠' : '';
        tabLabelEl.textContent = `CH-QHN ${onOff}${devTag}`;
      }
    // --- Toggles ---
    function setDevMode(v){ devMode=!!v; GM_Set(KEYS.DEV, devMode); updateTabLabel(); }
    function setSnapPx(v){ let nv=Math.round(Number(v)); if (!Number.isFinite(nv)) nv=DEFAULTS.SNAP_PX; nv=Math.max(40,Math.min(400,nv)); SNAP_PX=nv; GM_Set(KEYS.SNAP_PX,SNAP_PX); }
    function setEnabled(v){
      isEnabled=!!v; GM_Set(KEYS.ENABLE,isEnabled); applyEnabledStateToUi();
      if (isEnabled){ onSelectionChanged(); }
      else{
        armedForNext=false; pendingRefPx=null; pendingCommit=null; fillQueue.length=0;
        chPoints=[]; selectedStreetNames=[]; selectedNormSet=new Set(); lastRenderedItems=[];
        hintsLayer?.removeAllFeatures(); hintsLayer?.setVisibility(false); showLoading(false);
      }
    }
    function setCirclesEnabled(v){
      circlesEnabled=!!v; GM_Set(KEYS.CIRCLES,circlesEnabled);
      try{
        if (!circlesEnabled){ hintsLayer?.removeAllFeatures(); hintsLayer?.setVisibility(false); }
        else { hintsLayer?.setVisibility(isEnabled && circlesEnabled); liftHints(); if (lastRenderedItems.length) redrawFromItems(lastRenderedItems); }
      }catch{}
      applyEnabledStateToUi();
    }
    function applyEnabledStateToUi(){
      try{
        const st=document.querySelector('#status'); if (st) st.textContent=isEnabled?'ON':'OFF';
        const cbE=document.querySelector('#enabled'); if (cbE) cbE.checked=!!isEnabled;
        const cbC=document.querySelector('#circles'); if (cbC) cbC.checked=!!circlesEnabled;
        const cbD=document.querySelector('#dev'); if (cbD) cbD.checked=!!devMode;
        const snap=document.querySelector('#snap'); if (snap) snap.value=String(SNAP_PX);
        updateTabLabel();
      }catch{}
      try{ if (!isEnabled){ hintsLayer?.setVisibility(false); showLoading(false); } else { hintsLayer?.setVisibility(!!circlesEnabled); if (circlesEnabled) liftHints(); } }catch{}
    }
  
    // --- Selection → Fetch (tiled) ---
    function onSelectionChanged(forceNetwork=false){
      if (!isEnabled) return;
  
      const segs = safeSegs();
      const hadSel = !!(selectedStreetNames && selectedStreetNames.length);
  
      selectedStreetNames=[]; selectedNormSet=new Set();
      if (segs?.length){
        try{
          const ids=new Set();
          for (const s of segs){
            (s?.attributes?.streetIDs||[]).forEach(id=>ids.add(id));
            if (s?.attributes?.primaryStreetID!=null) ids.add(s.attributes.primaryStreetID);
          }
          selectedStreetNames=WME.model.streets.getByIds(Array.from(ids)).map(s=>s?.attributes?.name).filter(Boolean);
          selectedNormSet=new Set(selectedStreetNames.map(normStreet));
        }catch{}
      }
  
      // Sticky: when selection is temporarily cleared (opening HN panel), don't wipe circles immediately
      if (!segs?.length && hadSel) return;
  
      const vp = getViewportBoundsOrNull();
      const base = vp || (segs && segs.length ? selectionBounds(segs) : null);
      if (!base) return;
  
      // Fetch visible tiles (+1 ring)
      const bbox = expandBounds(base, TILE.SIZE_M);
      const keys = tilesForBounds(bbox);
      if (!keys.length) return;
  
      fetchTiles(keys, forceNetwork).then(()=>{
        const items = collectItemsFromKeys(keys);
        if (items.length){ processCHResultArray(items); lastRenderedItems = items.slice(); }
      });
    }
  
    function fetchTiles(keys, forceNetwork=false){
      return new Promise((resolve)=>{
        const stale=[];
        for (const k of keys){
          const t=getTileFromStore(k);
          if (forceNetwork || !isFresh(t)) stale.push(k);
        }
        if (!stale.length){ LOG(`CH cache hit (${keys.length} tile(s))`); resolve(); return; }
  
        LOG(`Fetching ${stale.length}/${keys.length} tile(s)…`);
        showLoading(true);
  
        let inFlight=0, i=0, done=0;
        const next=()=>{
          while (inFlight<REQ.CONC && i<stale.length){
            const key=stale[i++]; inFlight++;
            fetchOneTile(key, REQ.RETRY).then(()=>{ inFlight--; done++; if (done===stale.length){ showLoading(false); resolve(); } else next(); });
          }
          if (!inFlight && i>=stale.length){ showLoading(false); resolve(); }
        };
        next();
      });
    }
  
    function fetchOneTile(key, retriesLeft){
      return new Promise((resolve)=>{
        const b   = tileBoundsFromKey(key);
        const env = `${b.left},${b.bottom},${b.right},${b.top}`;
        const url = 'https://api3.geo.admin.ch/rest/services/api/MapServer/identify?' + new URLSearchParams({
          geometryType   : 'esriGeometryEnvelope',
          geometry       : env,
          imageDisplay   : '256,256,96',
          mapExtent      : env,
          tolerance      : '0',
          layers         : 'all:ch.bfs.gebaeude_wohnungs_register',
          geometryFormat : 'geojson',
          sr             : '3857',
          lang           : 'en',
          returnGeometry : 'true'
        }).toString();
  
        GM_xmlhttpRequest({
          method:'GET', url, responseType:'json',
          headers:{ Accept:'application/json, text/plain, */*' },
          onload:(resp)=>{
            try{
              let result=resp.response || JSON.parse(resp.responseText||'{}');
              const arr=Array.isArray(result?.results)?result.results:(Array.isArray(result?.features)?result.features:[]);
              const out=[];
              for (const it of arr){
                const feat=it.feature||it, geom=feat.geometry||{};
                if (!geom || geom.type!=='Point' || !Array.isArray(geom.coordinates)) continue;
                const [cx,cy]=geom.coordinates; if (!Number.isFinite(cx) || !Number.isFinite(cy)) continue;
                const a=feat.attributes||feat.properties||{};
                const sn=extractStreetAndNumber(a); if (!sn) continue;
                const { street, number } = sn;
                const m=toMapXY(cx,cy);
                out.push({ lon:m.x, lat:m.y, number, streetName:street });
              }
              putTileToStore(key, { ts:nowDays(), items:out });
              DBG(`tile ${key} -> ${out.length} item(s)`);
              resolve();
            }catch(e){
              if (retriesLeft>0){ DBG(`tile ${key} parse error; retry…`); fetchOneTile(key, retriesLeft-1).then(resolve); }
              else { WARN('tile error (giving up)', key, e?.message||e); resolve(); }
            }
          },
          onerror:()=>{ if (retriesLeft>0){ DBG(`tile ${key} network error; retry…`); fetchOneTile(key, retriesLeft-1).then(resolve); } else { WARN('tile network error (giving up)', key); resolve(); } }
        });
      });
    }
  
    // --- Rendering ---
    function processCHResultArray(items){
      redrawFromItems(items);
      LOG(`Loaded circles: ${hintsLayer?.features?.length||0} (raw: ${items.length}) • selected street(s): ${selectedStreetNames.join(' | ')||'(none)'}`);
    }
  
    function redrawFromItems(items){
      const existing = getSelectionHNs();
      const features=[]; chPoints=[];
      for (const r of items){
        const sameStreet = selectedNormSet.has(normStreet(r.streetName));
        const processed  = existing.includes(r.number);
        chPoints.push({ ...r, processed, sameStreet });
        features.push(new OL.Feature.Vector(
          new OL.Geometry.Point(r.lon, r.lat),
          { number:r.number, streetName:r.streetName, processed, __sameStreet: !!sameStreet }
        ));
      }
      hintsLayer.removeAllFeatures();
      if (circlesEnabled && features.length) hintsLayer.addFeatures(features);
      hintsLayer.setVisibility(!!(isEnabled && circlesEnabled));
      if (circlesEnabled){ liftHints(); hintsLayer.redraw(true); }
    }
  
    // --- R-key flow: arm, capture click, fill input ---
    async function onPressR(){
      if (!isEnabled) return;

      // If a previous number is ready to commit, try to commit it first
      if (pendingCommit && !getSelectionHNs().includes(String(pendingCommit.number))) {
        await commitPending();
      }
  
      LOG('R pressed - waiting for next click');
      armedForNext=true; pendingRefPx=null;
      if (!hintsLayer.features.length) onSelectionChanged();
      if (circlesEnabled){ hintsLayer.setVisibility(true); liftHints(); }
      const btn=findHNButton(); if (btn) btn.click();
  
      let cancelTimer=null;
      const cleanup=()=>{ clearTimeout(cancelTimer); document.removeEventListener('mousedown',cap,true); document.removeEventListener('click',cap,true); };
      const cap=(ev)=>{
        try{
          if (!isEnabled){ cleanup(); return; }
          if (ev && ev.isTrusted===false) return;
          const vp=WME.map.viewPortDiv || document.querySelector('.olMapViewport'); if (!vp) return;
          const rect=vp.getBoundingClientRect();
          const inside=ev.clientX>=rect.left && ev.clientX<=rect.right && ev.clientY>=rect.top && ev.clientY<=rect.bottom;
          if (!inside) return;
          const px=new OL.Pixel(ev.clientX-rect.left, ev.clientY-rect.top);
          pendingRefPx=px; LOG('Captured click pixel',{x:px.x,y:px.y});
          enqueueFillJob(px); cleanup();
        }catch{ cleanup(); }
      };
      document.addEventListener('mousedown',cap,true);
      document.addEventListener('click',cap,true);
      cancelTimer=setTimeout(()=>{ cleanup(); if (armedForNext){ armedForNext=false; LOG('Timeout - no click captured'); } },4000);
    }
  
    function enqueueFillJob(px){ if (!isEnabled) return; const snapshot=chPoints.slice(); fillQueue.push({ px, chSnapshot:snapshot }); armedForNext=false; if (!isFilling) drainFillQueue(); }
    async function drainFillQueue(){ if (isFilling) return; isFilling=true; try{ while (fillQueue.length){ const job=fillQueue.shift(); if (!isEnabled) break; await runOneFillJob(job); await sleep(120); } } finally{ isFilling=false; } }
    async function runOneFillJob(job){
      const deadline=Date.now()+3000; let inputEl=null;
      while (Date.now()<deadline){ inputEl=findHNInputInTree(document); if (inputEl) break; await sleep(60); }
      if (!inputEl){ WARN('HN input not found'); return; }
      await tryFillFromCH(inputEl, job.px, job.chSnapshot);
    }
    function findHNInputInTree(root){
      const sels=[
        'div.house-number.is-active input.number:not(.number-preview)',
        'div.house-number.is-active input[type="text"]:not(.number-preview)',
        '[data-testid="house-number-input"] input','input[name="number"]',
        'input[aria-label="House number"]','input[placeholder="House number"]',
        'input.number','input[type="text"]'
      ];
      for (const s of sels){ const el=root.querySelector(s); if (el && el.tagName==='INPUT' && !el.disabled) return el; }
      return null;
    }
    async function tryFillFromCH(inputEl, refPx, chSnapshotOpt){
      try{
        const snap=Array.isArray(chSnapshotOpt)&&chSnapshotOpt.length?chSnapshotOpt:chPoints;
        if (!refPx || !snap.length) return;
        const found=nearestCHByPixel(refPx, snap); if (!found) return;
        const { point, distPx }=found;
        if (distPx>SNAP_PX) return;
        inputEl.focus(); setReactInputValue(inputEl,''); setReactInputValue(inputEl,String(point.number)); try{ inputEl.blur(); }catch{}
        pendingCommit={ number:String(point.number) };
      }catch(e){ ERR('fill error', e?.message||e); }
    }
    function nearestCHByPixel(clickPx, pointsList=chPoints){
      if (!pointsList.length) return null;
      let best=null,bestD=Infinity;
      for (const p of pointsList){
        const geo=toGeoLonLatFromProjected(p.lon,p.lat);
        const pd=WME.map.getPixelFromLonLat(geo); if (!pd) continue;
        const d=Math.hypot(clickPx.x-pd.x, clickPx.y-pd.y);
        if (d<bestD){ bestD=d; best=p; }
      }
      return best?{ point:best, distPx:bestD }:null;
    }
  
    // --- Commit & model sync ---
    async function commitPending(){ if (!pendingCommit) return false; const ok=await commitHouseNumberViaUI(String(pendingCommit.number)); if (ok){ pendingCommit=null; refreshProcessedFromModel(); return true; } return false; }
    function getSelectionHNs(){
      const segs=safeSegs(); if (!segs) return [];
      const ids=segs.map(s=>s.attributes.id);
      return WME.model.segmentHouseNumbers.getObjectArray().filter(h=>ids.includes(h.attributes.segID)).map(h=>String(h.attributes.number));
    }
    async function commitHouseNumberViaUI(numberStr){
      await sleep(400);
      const before=getSelectionHNs();
      const buttons=collectCommitButtonsStrict();
      if (!buttons.length) return false;
      const preferred=buttons.filter(b=>{
        const hay=`${b.textContent||''} ${b.getAttribute?.('title')||''} ${b.getAttribute?.('aria-label')||''}`.toLowerCase();
        return /✓|✔|save|apply|commit|confirm|ok|add/.test(hay) || b.querySelector?.('.w-icon-check,.fa-check');
      });
      const candidates=preferred.length?preferred:buttons;
      for (let i=0;i<candidates.length;i+=1){
        const b=candidates[i]; clickLikeHuman(b); await sleep(250);
        const after=getSelectionHNs();
        if (after.length>before.length || after.includes(String(numberStr))) return true;
      }
      return false;
    }
    function collectCommitButtonsStrict(){
      const root=findHouseNumberPanelRoot(); if (!root) return [];
      const btns=Array.from(root.querySelectorAll('button,[role="button"],wz-button,wz-icon-button')).filter(isVisible);
      return btns.filter((el)=>{
        const hay=`${(el.textContent||'')} ${(el.getAttribute?.('title')||'')} ${(el.getAttribute?.('aria-label')||'')}`.toLowerCase();
        const hasCheckIcon=!!(el.querySelector?.('.w-icon-check,.fa-check'));
        const isAction=/\b(save|apply|commit|confirm|ok|add)\b/.test(hay);
        return hasCheckIcon || isAction;
      });
    }
    function findHouseNumberPanelRoot(){ return document.querySelector('div.house-number.is-active')||document.querySelector('#edit-panel')||document.querySelector('[data-testid="edit-panel"]'); }
    function refreshProcessedFromModel(){
      const current=getSelectionHNs();
      for (const p of chPoints) p.processed=current.includes(p.number);
      if (circlesEnabled && hintsLayer?.features?.length){
        for (const f of hintsLayer.features) if (f?.attributes) f.attributes.processed=current.includes(f.attributes.number);
        hintsLayer.redraw(true);
      }
    }
  
    // --- Utilities ---
    function liftHints(){ try{ if (!isEnabled || !circlesEnabled) return; hintsLayer?.setVisibility(true); hintsLayer?.setOpacity(1); hintsLayer?.setZIndex?.(9e6); if (hintsLayer?.div) hintsLayer.div.style.pointerEvents='none'; }catch{} }
    function isTyping(){ const el=document.activeElement; return !!(el && (el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.isContentEditable)); }
    function safeSegs(){ try{ const sel=WME.selectionManager.getSegmentSelection(); return sel && sel.segments && sel.segments.length ? sel.segments : null; }catch{ return null; } }
    function findHNButton(){ const sels=['[data-testid="add-house-number"]','.add-house-number','wz-button:has(.w-icon-home)']; for (const s of sels){ const el=document.querySelector(s)||editButtonsRoot.querySelector?.(s); if (el) return el; } return null; }
    function isVisible(el){ if (!el || !el.getBoundingClientRect) return false; const r=el.getBoundingClientRect(); return r.width>0 && r.height>0 && getComputedStyle(el).visibility!=='hidden'; }
    function clickLikeHuman(el){
      try{
        const w=el.ownerDocument.defaultView||window, r=el.getBoundingClientRect();
        const cx=r.left+Math.min(Math.max(4,r.width/2), r.width-4);
        const cy=r.top +Math.min(Math.max(4,r.height/2), r.height-4);
        const opts={bubbles:true,cancelable:true,clientX:cx,clientY:cy};
        el.focus?.(); el.dispatchEvent(new w.MouseEvent('mousedown',opts)); el.dispatchEvent(new w.MouseEvent('mouseup',opts)); el.dispatchEvent(new w.MouseEvent('click',opts));
      }catch{}
    }
  
    // Bounds/tiling
    function getViewportBoundsOrNull(){
      try{
        const ext=WME.map.getExtent(); if (!ext) return null;
        const L=ext.left, R=ext.right, T=ext.top, B=ext.bottom;
        if (![L,R,T,B].every(Number.isFinite)) return null;
        if (R<=L || T<=B) return null;
        return { left:L, right:R, top:T, bottom:B };
      }catch{ return null; }
    }
    function selectionBounds(segs){
      let bounds=null;
      for (const seg of (segs||[])){ const b=seg.attributes.geometry.getBounds(); bounds = bounds ? (bounds.extend(b), bounds) : b; }
      if (!bounds) return null;
      return { left:Math.floor(bounds.left), right:Math.ceil(bounds.right), top:Math.ceil(bounds.top), bottom:Math.floor(bounds.bottom) };
    }
    function expandBounds(b,px){ return { left:Math.floor(b.left-px), right:Math.ceil(b.right+px), top:Math.ceil(b.top+px), bottom:Math.floor(b.bottom-px) }; }
    const tileKeyForXY=(x,y)=>`${Math.floor(x/TILE.SIZE_M)}_${Math.floor(y/TILE.SIZE_M)}`;
    function tileBoundsFromKey(key){ const [txS,tyS]=key.split('_'); const tx=+txS, ty=+tyS; const left=tx*TILE.SIZE_M, bottom=ty*TILE.SIZE_M; return { left, bottom, right:left+TILE.SIZE_M, top:bottom+TILE.SIZE_M }; }
    function tilesForBounds(b){ const x1=Math.floor(b.left/TILE.SIZE_M), y1=Math.floor(b.bottom/TILE.SIZE_M); const x2=Math.floor(b.right/TILE.SIZE_M), y2=Math.floor(b.top/TILE.SIZE_M); if (![x1,y1,x2,y2].every(Number.isFinite)) return []; if (x2<x1||y2<y1) return []; const keys=[]; for (let ty=y1; ty<=y2; ty+=1) for (let tx=x1; tx<=x2; tx+=1) keys.push(`${tx}_${ty}`); return keys; }
  
    // Cache
    const nowDays=()=>Math.floor(Date.now()/86400000);
    function getTileFromStore(key){
      const m=memTiles.get(key); if (m) return m;
      if (!hasGM) return null;
      try{
        const raw=GM_getValue(TILE.NS+key,null); if (!raw) return null;
        const obj=JSON.parse(raw);
        if (!obj || obj.v!==TILE.SCHEMA){ try{ GM_deleteValue(TILE.NS+key); }catch{} return null; }
        memTiles.set(key,obj); return obj;
      }catch{ return null; }
    }
    function putTileToStore(key,obj){
      const withSchema={ ...obj, v:TILE.SCHEMA };
      memTiles.set(key,withSchema);
      if (!hasGM) return;
      try{
        GM_Set(TILE.NS+key, JSON.stringify(withSchema));
        const meta=loadMeta(); touchLRU(meta,key); enforceLRU(meta); saveMeta(meta);
      }catch{}
    }
    function loadMeta(){ if (!hasGM) return {order:[]}; try{ const m=GM_Get(TILE.META,null); return m?JSON.parse(m):{order:[]}; }catch{ return {order:[]}; } }
    function saveMeta(meta){ if (!hasGM) return; try{ GM_Set(TILE.META, JSON.stringify(meta)); }catch{} }
    function touchLRU(meta,key){ meta.order=(meta.order||[]).filter(k=>k!==key); meta.order.push(key); }
    function enforceLRU(meta){ while ((meta.order||[]).length>TILE.MAX){ const victim=meta.order.shift(); try{ GM_deleteValue(TILE.NS+victim); }catch{} memTiles.delete(victim); } }
    function clearCache(){ try{ if (hasGM){ GM_listValues().forEach(k=>{ if (String(k).startsWith(TILE.NS) || k===TILE.META) GM_deleteValue(k); }); } memTiles.clear(); LOG('Cache cleared'); }catch(e){ ERR('clearCache error', e); } }
    function collectItemsFromKeys(keys){ let arr=[]; for (const k of keys){ const t=getTileFromStore(k); if (t?.items) arr=arr.concat(t.items); } return arr; }
    const isFresh=(t)=>!!(t && t.v===TILE.SCHEMA && typeof t.ts==='number' && nowDays()-t.ts<=TILE.TTL_DAYS);
  
    // Projection helpers
    function toMapXY(likeX,likeY){
      try{
        _epsg4326=_epsg4326||new OL.Projection('EPSG:4326');
        _mapProj=_mapProj||(WME.map.getProjectionObject?.()||WME.map.projection||new OL.Projection('EPSG:900913'));
        const looks4326=Math.abs(likeX)<=180 && Math.abs(likeY)<=90;
        if (!looks4326) return { x:likeX, y:likeY, crs:'3857' };
        const p=new OL.Geometry.Point(likeX,likeY); p.transform(_epsg4326,_mapProj);
        return { x:p.x, y:p.y, crs:'4326→map' };
      }catch{ return { x:likeX, y:likeY, crs:'unknown' }; }
    }
    function toGeoLonLatFromProjected(x,y){
      try{
        _epsg4326_back=_epsg4326_back||new OL.Projection('EPSG:4326');
        const proj=WME.map.getProjectionObject?.()||WME.map.projection||new OL.Projection('EPSG:900913');
        const ll=new OL.LonLat(x,y); return ll.transform(proj,_epsg4326_back);
      }catch{
        const R=6378137; const lon=(x/R)*(180/Math.PI); const lat=(2*Math.atan(Math.exp(y/R))-Math.PI/2)*(180/Math.PI);
        return new OL.LonLat(lon,lat);
      }
    }
  
    // Parsing / normalization (CH-friendly; unify “Saint/Sankt/San/St.” → “saint”)
    function firstStr(x){
      if (Array.isArray(x) && x.length) return String(x[0]||'').trim();
      if (typeof x==='string') return x.trim();
      return '';
    }
  
    // Filter out Swiss-style decimal house numbers (including letter+decimal like 15a.1)
    function isSwissDecimalLike(numStr){
      const s=String(numStr||'').trim();
      if (!s.includes('.')) return false;
      const stripped=s.replace(/[A-Za-z]/g,''); // "15a.1" -> "15.1"
      return /^\d+\.\d+$/.test(stripped);
    }
  
    function extractStreetAndNumber(props){
      let street=firstStr(props.strname)||'';
      let number=String(props.deinr ?? '').trim();
  
      // Fallback from combined field, if available
      if ((!street || !number) && props.strname_deinr){
        const s=String(props.strname_deinr);
        const m=s.match(/^(.*?)[\s,]+(\d+[A-Za-z]?(?:[-/]\d+[A-Za-z]?)?)\s*$/);
        if (m){ if (!street) street=m[1].trim(); if (!number) number=m[2].trim(); }
        else if (!street){ street=s.trim(); }
      }
  
      if (!street || !number) return null;
      if (isSwissDecimalLike(number)) return null;
      return { street, number };
    }
  
    function normStreet(s){
      // remove diacritics, lowercase, normalize punctuation & whitespace,
      // and unify saint-like tokens across languages
      const base = String(s||'')
        .normalize('NFD').replace(/\p{Diacritic}/gu,'')
        .toLowerCase()
        .replace(/\./g,' ')
        .replace(/\b(st|st\.|sankt|saint|sainte|san|santo|santa)\b/g, 'saint')
        .replace(/\s+/g,' ')
        .trim();
      return base;
    }
  
    // --- DOM helpers ---
    function setReactInputValue(input,value){
      const win=input.ownerDocument.defaultView||window;
      const desc=Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype,'value');
      const nativeSetter=desc && desc.set;
      if (!nativeSetter){ input.value=value; return; }
      nativeSetter.call(input,value);
      input.dispatchEvent(new win.Event('input',{bubbles:true}));
      input.dispatchEvent(new win.Event('change',{bubbles:true}));
    }
    function showLoading(show){ if (!loadingBanner) return; if (!isEnabled){ loadingBanner.style.display='none'; return; } loadingBanner.style.display=show?'':'none'; }
  
    // --- Small helpers ---
    const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
    function poll(test,max=300,delay=100){ return new Promise(res=>{ let i=0; const t=setInterval(()=>{ try{ if (test()){ clearInterval(t); res(true); } else if ((i+=1)>=max){ clearInterval(t); res(false); } }catch{} }, delay); }); }
  
  })();
  