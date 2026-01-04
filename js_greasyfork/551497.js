// ==UserScript==
// @name        WME Hectometering
// @author      DeKoerier
// @namespace   https://greasyfork.org/users/1499279
// @description Hectometerpaaltjes in WME
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     1.0.5
// @grant       GM_xmlhttpRequest
// @connect     matrixnl.nl
// @connect     *.matrixnl.nl
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551497/WME%20Hectometering.user.js
// @updateURL https://update.greasyfork.org/scripts/551497/WME%20Hectometering.meta.js
// ==/UserScript==

/* global W, $, OpenLayers, I18n */

(function () {
  /** ---------- ROBUUSTE BOOTSTRAP ---------- */
  function log(...a){ try{ console.log('[WME Hecto]', ...a); }catch{} }

  function startWhenReady() {
    try {
      if (!window.W) {
        log('W niet aanwezig → luister op wme-initialized');
        document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
        return;
      }
      onWmeInitialized();
    } catch (e) { log('bootstrap error', e); }
  }

  function onWmeInitialized() {
    try {
      if (W?.userscripts?.state?.isReady) {
        log('W.userscripts isReady → init overlay');
        initOverlay();
      } else {
        log('W.userscripts nog niet ready → luister op wme-ready');
        document.addEventListener('wme-ready', initOverlay, { once: true });
      }
    } catch (e) { log('onWmeInitialized error', e); }
  }

  /** ---------- HOOFDLOGICA ---------- */
  function initOverlay() {
    try {
      if (!W || !W.map || !W.userscripts?.registerSidebarTab) {
        log('Essentiële WME objecten ontbreken; abort.');
        return;
      }
      log('Init overlay start');

      // --- CONFIG ---
      const HMP_ENDPOINT      = 'https://matrixnl.nl/api/hectometering.php';
      const HECTOIMG_ENDPOINT = 'https://matrixnl.nl/api/hectoimg.php';
      const MIN_ZOOM = 15;
      const STRINGS = {
        tab_title: 'Hectometering',
        toggle_hecto: 'Toon hectometerpunten',
        zoom_in: 'Zoom verder in om deze data te bekijken.',
        loading: 'laden…',
        load_error: 'Kon bordje niet laden.',
        gps: 'GPS',
        open_in_maps: 'Open in Maps',
        copy: 'Kopieer',
        copied: 'Gekopieerd!'
      };

      let showHecto = false;
      let hectoCount = 0;
      let lastReqId = 0;
      let loading = false;

      const P_MAP = W.map.getProjectionObject();
      const P_WGS = new OpenLayers.Projection('EPSG:4326');

      // Sidebar tab registreren
      const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('hecto-overlay');
      tabLabel.innerHTML = '<span class="fa fa-road" aria-hidden="true"></span><span style="margin-left:6px">HM</span>';
      tabLabel.title = STRINGS.tab_title;
      tabPane.id = 'sidepanel-hecto';

      const readyP = (W.userscripts.waitForElementConnected
        ? W.userscripts.waitForElementConnected(tabPane)
        : Promise.resolve());

      readyP.then(buildUI).catch(()=> buildUI());

      // Laag direct toevoegen (onzichtbaar), zodat SelectFeature kan binden
      const hectoLayer = new OpenLayers.Layer.Vector('Hectometering', {
        renderers: OpenLayers.Layer.Vector.prototype.renderers,
        visibility: false,
        styleMap: new OpenLayers.StyleMap(new OpenLayers.Style({
          externalGraphic: '${svg}',
          graphicWidth: '${w}',
          graphicHeight: '${h}',
          graphicXOffset: '${xOff}',
          graphicYOffset: '${yOff}'
        }))
      });
      if (W.map.getLayerIndex(hectoLayer) === -1) {
        W.map.addLayer(hectoLayer);
      }

      // Zorg dat de laag net boven “roads” komt wanneer we ‘m tonen
      function placeLayer() {
        const roads = W.map.getLayerByUniqueName('roads');
        if (roads) {
          const idx = W.map.getLayerIndex(roads);
          if (idx >= 0) {
            W.map.getOLMap().setLayerIndex(hectoLayer, idx + 1);
          }
        }
      }

      // SelectFeature (na toevoegen laag)
      const selectCtrl = new OpenLayers.Control.SelectFeature(hectoLayer, {
        onSelect: onFeatureSelect,
        onUnselect: onFeatureUnselect,
        hover: false
      });
      W.map.addControl(selectCtrl);
      selectCtrl.activate();

      // Debounce helper
      function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

      /** ---------- UI: checkbox + hint ---------- */
      function buildUI(){
        log('buildUI → tabPane connected:', !!tabPane.isConnected);
        tabPane.style.padding = '8px';

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '6px';
        row.style.fontSize = '14px';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'hectoToggle';
        cb.addEventListener('change', (e)=>{
          showHecto = e.target.checked;
          toggleLayer();
        });

        const label = document.createElement('label');
        label.htmlFor = cb.id;
        label.id = 'hectoLabel';
        label.textContent = STRINGS.toggle_hecto;

        row.appendChild(cb);
        row.appendChild(label);

        const hint = document.createElement('div');
        hint.id = 'hectoHint';
        hint.style.cssText = 'margin-top:6px;padding:6px 8px;border:1px solid #ddd;border-radius:8px;background:#fff;display:none;';
        hint.textContent = STRINGS.zoom_in;

        tabPane.appendChild(row);
        tabPane.appendChild(hint);

        // Events voor zoom/move
        W.map.events.register('zoomend', null, onViewChanged);
        W.map.events.register('moveend', null, debouncedLoad);

        onViewChanged(); // init
      }

      function updateLabel(){
        const label = document.getElementById('hectoLabel');
        if (!label) return;
        const zoomTooLow = W.map.getZoom() < MIN_ZOOM;
        label.textContent = zoomTooLow
          ? STRINGS.zoom_in
          : `${STRINGS.toggle_hecto} (${hectoCount})`;
        const cb = document.getElementById('hectoToggle');
        if (cb) {
          cb.disabled = zoomTooLow;
          cb.checked = showHecto && !zoomTooLow;
        }
      }

      function onViewChanged(){
        const hint = document.getElementById('hectoHint');
        const tooLow = W.map.getZoom() < MIN_ZOOM;
        if (hint) hint.style.display = tooLow ? 'block' : 'none';
        updateLabel();
        if (showHecto && !tooLow) debouncedLoad();
        if (tooLow) clearLayer();
      }

      function toggleLayer(){
        const tooLow = W.map.getZoom() < MIN_ZOOM;
        if (showHecto && !tooLow) {
          placeLayer();
          hectoLayer.setVisibility(true);
          debouncedLoad();
        } else {
          hectoLayer.setVisibility(false);
        }
        updateLabel();
      }

      const debouncedLoad = debounce(loadHecto, 250);

      /** ---------- Geo helpers ---------- */
      function getBboxWgs84(){
        const b = W.map.getExtent().clone().transform(P_MAP, P_WGS);
        return [b.left, b.bottom, b.right, b.top].map(n=>+n.toFixed(6)).join(',');
      }

      function formatHecto(val){
        if (val===null || val===undefined) return '';
        const s = String(val);
        if (/^\d+$/.test(s) && s.length>1) return s.slice(0,-1)+'.'+s.slice(-1);
        return s;
      }
      function formatRoadLabel(p){
        let raw = p.WVK_WEGNR_HMP || p.WVK_WEGNUMMER || '';
        const wegb = (p.WVK_WEGBEHSRT || '').toUpperCase();
        if (/^[Aa]\d+$/.test(raw)) return { label: raw.toUpperCase(), cls:'a' };
        if (/^[Nn]\d+$/.test(raw)) return { label: raw.toUpperCase(), cls:'n' };
        if (/^\d+$/.test(raw)) {
          const num = raw.replace(/^0+/, '') || '0';
          return { label: (wegb==='R' ? 'A' : 'N') + num, cls: wegb==='R' ? 'a' : 'n' };
        }
        const up = String(raw).toUpperCase();
        return { label: up, cls: up.startsWith('A') ? 'a':'n' };
      }
      function hasLetter(s){ return typeof s==='string' && /[A-Za-z]/.test(s); }

      function buildBadgeSVG(props={}){
        const Wd = 40, Hd = 25;
        const panelW = 34, panelH = 22;
        const roadW = 16, roadH = 9;

        const { label, cls } = formatRoadLabel(props);
        const hm = formatHecto(props.hectomtrng);
        const side = props.WVK_RPE_CODE || '';
        const suffix = props.WVK_HECTO_LTTR || '';

        const roadFill = (cls==='a') ? '#A00005' : '#FDAF2B';
        const roadText = (cls==='a') ? '#FFF'    : '#000';
        const suffixShow = hasLetter(suffix);

        return `
<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${Hd}">
  <defs><style>.rg{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Noto Sans',sans-serif;}</style></defs>
  <rect x="0" y="0" width="${Wd}" height="${Hd}" rx="3" fill="#10756E"/>
  <rect x="${(Wd-panelW)/2}" y="${(Hd-panelH)/2}" width="${panelW}" height="${panelH}" rx="3" fill="none" stroke="#FFF" stroke-width="1"/>
  <rect x="${(Wd-panelW)/2+1}" y="${(Hd-panelH)/2+1}" width="${roadW}" height="${roadH}" rx="2" fill="${roadFill}" stroke="${cls==='a'?'#FFF':'none'}" stroke-width="${cls==='a'?1:0}"/>
  <text x="${(Wd-panelW)/2+1+roadW/2}" y="${(Hd-panelH)/2+1+roadH/2+2}" text-anchor="middle" font-size="7" fill="${roadText}" class="rg">${label || ''}</text>
  ${side ? `<text x="${(Wd+panelW)/2-3}" y="${(Hd-panelH)/2+7}" text-anchor="end" font-size="7" fill="#FFF" class="rg">${side}</text>` : ''}
  ${hm ? `<text x="${(Wd-panelW)/2+2}" y="${(Hd+panelH)/2-3}" font-size="9" fill="#FFF" class="rg">${hm}</text>` : ''}
  ${suffixShow ? `
    <rect x="${(Wd+panelW)/2-1-6}" y="${(Hd+panelH)/2-1-8}" width="6" height="8" rx="2" fill="#FDAF2B"/>
    <text x="${(Wd+panelW)/2-1-3}" y="${(Hd+panelH)/2-1-2}" text-anchor="middle" font-size="7" fill="#000" class="rg">${suffix}</text>
  ` : ''}
</svg>`.trim();
      }

      /** ---------- GM helpers (CSP-proof) ---------- */
      function gmFetch(url, { method = 'GET', headers = {}, responseType = 'text' } = {}) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method, url, headers, responseType,
            onload: (res) => {
              const ok = res.status >= 200 && res.status < 300;
              if (!ok) return reject(new Error(`HTTP ${res.status}: ${String(res.response).slice(0,180)}`));
              resolve(res.response);
            },
            onerror: () => reject(new Error('GM_xmlhttpRequest error')),
            ontimeout: () => reject(new Error('GM_xmlhttpRequest timeout')),
          });
        });
      }
      function gmFetchBinary(url, { method = 'GET', headers = {} } = {}) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method, url, headers, responseType: 'arraybuffer',
            onload: (res) => {
              const ok = res.status >= 200 && res.status < 300;
              if (!ok) return reject(new Error(`HTTP ${res.status}`));
              try {
                const contentType = res.responseHeaders
                  ?.split(/\r?\n/).find(h => /^content-type:/i.test(h))
                  ?.split(':')[1]?.trim() || 'application/octet-stream';
                const blob = new Blob([res.response], { type: contentType });
                resolve(blob);
              } catch (e) { reject(e); }
            },
            onerror: () => reject(new Error('GM_xmlhttpRequest binary error')),
            ontimeout: () => reject(new Error('GM_xmlhttpRequest timeout')),
          });
        });
      }
      async function inlineExternalImages(html, baseHref = location.origin) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const imgs = Array.from(wrapper.querySelectorAll('img[src]'));
        for (const img of imgs) {
          const src = img.getAttribute('src') || '';
          if (/^(data:|blob:)/i.test(src)) continue;
          const abs = new URL(src, baseHref).href;
          try {
            const blob = await gmFetchBinary(abs);
            const url = URL.createObjectURL(blob);
            img.setAttribute('src', url);
          } catch (e) {
            log('IMG inline fail:', abs, e);
          }
        }
        return wrapper.innerHTML;
      }

      /** ---------- Data laden ---------- */
      async function loadHecto(){
        if (loading) return;
        if (!showHecto || W.map.getZoom() < MIN_ZOOM) return;
        loading = true;
        const reqId = ++lastReqId;

        try {
          const bbox = getBboxWgs84();
          const url = `${HMP_ENDPOINT}?bbox=${encodeURIComponent(bbox)}`;
          const txt = await gmFetch(url);
          let fc; try { fc = JSON.parse(txt); }
          catch(e){ log('hectometering JSON parse error. snippet:', txt.slice(0,180)); throw e; }

          if (reqId !== lastReqId) return;

          clearLayer();

          if (!fc || fc.type!=='FeatureCollection' || !Array.isArray(fc.features)) {
            hectoCount = 0; updateLabel(); return;
          }

          hectoCount = fc.features.length;
          updateLabel();

          const reader = new OpenLayers.Format.GeoJSON({
            ignoreExtraDims: true,
            internalProjection: P_MAP,
            externalProjection: P_WGS
          });

          const feats = [];
          for (const f of fc.features) {
            if (!f || !f.geometry) continue;
            const props = f.properties || {};
            const svg = buildBadgeSVG(props);
            const svgUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

            const olFeats = reader.read(f);
            const arr = Array.isArray(olFeats) ? olFeats : [olFeats];
            for (const ofeat of arr) {
              const w=40, h=25;
              ofeat.attributes = Object.assign({}, props, { svg: svgUri, w, h, xOff: -w/2, yOff: -h/2 });
              feats.push(ofeat);
            }
          }

          if (feats.length) {
            hectoLayer.addFeatures(feats);
            placeLayer();
            hectoLayer.setVisibility(true);
          }
        } catch (e) {
          log('Hectometering BBOX load error:', e);
        } finally {
          if (reqId === lastReqId) loading = false;
        }
      }

      function clearLayer(){
        if (hectoLayer && hectoLayer.features?.length) hectoLayer.removeAllFeatures();
      }

      /** ---------- Popup (zonder FramedCloud) ---------- */
      let activePopup = null;
      function onFeatureSelect(f){
        const lonlat = f.geometry.getBounds().getCenterLonLat().clone().transform(P_MAP, P_WGS);
        const lat = lonlat.lat.toFixed(6);
        const lon = lonlat.lon.toFixed(6);

        const p = f.attributes || {};
        const params = {
          wegnummer: p.WVK_WEGNR_HMP || p.WVK_WEGNUMMER || '',
          wegbhsrt:  p.WVK_WEGBEHSRT || '',
          wegdeel:   p.WVK_RPE_CODE || '',
          suffix:    p.WVK_HECTO_LTTR || '',
          h:         p.hectomtrng,
          lat, lon
        };
        const qs = Object.entries(params)
          .filter(([,v]) => v !== undefined && v !== null)
          .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
        const popupUrl = `${HECTOIMG_ENDPOINT}?${qs}`;

        // Gebruik basis OpenLayers.Popup (FramedCloud ontbreekt in jouw WME build)
        const lonlatMapProj = f.geometry.getBounds().getCenterLonLat(); // in map projectie
        const html = `<div id="hectoContent" style="padding:4px 6px;">${STRINGS.loading}</div>`;

        activePopup = new OpenLayers.Popup(
          'hectoPopup',
          lonlatMapProj,
          null,                 // auto size
          html,
          null,                 // no anchor
          true,                 // close box
          function(){ selectCtrl.unselect(f); }
        );
        W.map.addPopup(activePopup);

        gmFetch(popupUrl).then(async (remoteHtml) => {
          const inlined = await inlineExternalImages(remoteHtml, popupUrl);

          const ua = navigator.userAgent.toLowerCase();
          let mapsHref;
          if (/iphone|ipad|ipod/.test(ua)) mapsHref = `http://maps.apple.com/?ll=${lat},${lon}`;
          else if (/android/.test(ua))     mapsHref = `geo:${lat},${lon}?q=${lat},${lon}`;
          else                             mapsHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

          const extra = `
            <hr style="margin:6px 0;border:0;border-top:1px solid #eee;">
            <div style="font:12px/1.3 system-ui,sans-serif;">
              <b>${STRINGS.gps}</b>: ${lat}, ${lon}
              <div style="margin-top:4px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <a href="${mapsHref}" target="_blank" rel="noopener noreferrer">${STRINGS.open_in_maps}</a>
                <button type="button" id="copy-coords"
                  style="padding:2px 6px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">
                  ${STRINGS.copy}
                </button>
              </div>
            </div>
          `;

          // Update popup-inhoud
          if (activePopup && activePopup.contentDiv) {
            activePopup.contentDiv.innerHTML = (inlined || '—') + extra;

            // eventlistener voor kopieerknop
            setTimeout(() => {
              const btn = activePopup.contentDiv.querySelector('#copy-coords');
              if (btn) {
                btn.addEventListener('click', () => {
                  navigator.clipboard.writeText(`${lat}, ${lon}`).then(()=>{
                    btn.textContent = STRINGS.copied;
                    setTimeout(()=>btn.textContent = STRINGS.copy, 1200);
                  }).catch(()=> alert('Kopiëren mislukt'));
                });
              }
            }, 0);

            activePopup.updateSize();
          }
        }).catch(()=>{
          if (activePopup && activePopup.contentDiv) {
            activePopup.contentDiv.textContent = STRINGS.load_error;
            activePopup.updateSize();
          }
        });
      }
      function onFeatureUnselect(_f){
        if (activePopup) {
          W.map.removePopup(activePopup);
          activePopup.destroy();
          activePopup = null;
        }
      }

      // Stylesheet (tab UI)
      (function injectStyles(){
        const css = `
#sidepanel-hecto label{cursor:pointer}
#sidepanel-hecto input[disabled]+label{cursor:not-allowed;opacity:.6}
`;
        const el = document.createElement('style');
        el.textContent = css;
        document.head.appendChild(el);
      })();

      log('Init overlay klaar');
    } catch (e) {
      log('initOverlay error', e);
    }
  }

  // Start!
  startWhenReady();
})();
