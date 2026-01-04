// ==UserScript==
// @name         WME Quick HN Importer AT (Reloaded)
// @description  Schneller Hausnummern-Import für AT: Mit R drücken und Klick die nächste Hausnummer übernehmen. Zeigt (optional) Hilfskreise, nutzt Tile-Cache + FIFO-Queue.
// @version      2025.12.23.1
// @author       Ari (Reloaded) -- Based on: Gerhard (modified for AT and providing API); Tom 'Glodenox' Puttemans (Original concept for BE)
// @namespace    http://www.kbox.at/
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
// @connect      wms.kbox.at
// @run-at       document-idle
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/551280/WME%20Quick%20HN%20Importer%20AT%20%28Reloaded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551280/WME%20Quick%20HN%20Importer%20AT%20%28Reloaded%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    // --- Config/keys ---
    const TAG = 'AT QHN:';
    const SCRIPT_ID = 'at-qhn';
    const KEYS = {
      ENABLE: 'ATQHN_ENABLED',
      CIRCLES: 'ATQHN_CIRCLES',
      SNAP_PX: 'ATQHN_SNAP_PX',
      DEV: 'ATQHN_DEV'
    };
    const DEFAULTS = {
      ENABLE: true,
      CIRCLES: true,
      SNAP_PX: 120,
      DEV: false
    };
  
    // Tile cache configuration
    const TILE = {
      SIZE_M: 750,
      TTL_DAYS: 7,
      MAX: 300,
      NS: 'ATQHN_TILE_',
      META: 'ATQHN_META'
    };
  
    // --- Logging ---
    const LOG = (...a) => console.log(`%c${TAG}`, 'color:#d97e00;font-weight:bold;', ...a);
    const WARN = (...a) => console.warn(TAG, ...a);
    const ERR = (...a) => console.error(`%c${TAG}`, 'color:#ff0033;font-weight:bold;', ...a);
  
    // Persisted storage helpers (TMs/GM)
    const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
    const GM_Get = (k, d) => { try { return GM_getValue(k, d); } catch { return d; } };
    const GM_Set = (k, v) => { try { GM_setValue(k, v); } catch {} };
  
    // WME handles
    let WME = null;
    let OL = null;
    let wmeSDK = null;
  
    // UI/state
    let hintsLayer = null;
    let loadingBanner = null;
    let editButtonsRoot = null;
    let tabLabelEl = null;
  
    let isEnabled = hasGM ? GM_Get(KEYS.ENABLE, DEFAULTS.ENABLE) !== false : DEFAULTS.ENABLE;
    let circlesEnabled = hasGM ? GM_Get(KEYS.CIRCLES, DEFAULTS.CIRCLES) !== false : DEFAULTS.CIRCLES;
    let SNAP_PX = Number(GM_Get(KEYS.SNAP_PX, DEFAULTS.SNAP_PX)) || DEFAULTS.SNAP_PX;
    let devMode = hasGM ? !!GM_Get(KEYS.DEV, DEFAULTS.DEV) : DEFAULTS.DEV;
  
    // Debug logger (active only in Dev mode)
    const DBG = (...a) => { if (devMode) console.debug('%cAT QHN:[dev]', 'color:#7a7a7a;font-weight:bold;', ...a); };

    // Two-tap flow state
    let armedForNext = false;
    let pendingRefPx = null;
    let pendingCommit = null;
  
    // Fetch throttling timestamp
    let suppressFetchUntil = 0;
  
    // Serialized fill queue
    let isFilling = false;
    const fillQueue = [];
  
    // Address points + street matching
    let atPoints = []; // { lon, lat, number, streetId, processed }
    let currentStreetId = null;
    let streetNames = {};
    let streetsByName = {};
  
    // Selection tracking fallback
    let selPollTimer = null;
    let lastSelKey = '';
  
    // In-memory tile cache mirror
    const memTiles = new Map();
  
    // --- Styles ---
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(`
        .at-qhn-hints, .at-qhn-hints * { pointer-events: none !important; }
        .atqhn-pane { padding: 12px; font-size: 13px; line-height: 1.4; }
        .atqhn-row { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; }
        .atqhn-row code { user-select: text; }
        .atqhn-status { font-weight: 600; }
        .atqhn-btn { border: 1px solid #ccc; border-radius: 6px; padding: 6px 10px; cursor: pointer; background: #f5f5f5; }
        .atqhn-btn:hover { filter: brightness(0.98); }
        .atqhn-toggle { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
        .atqhn-muted { opacity: .7; }
        .atqhn-snap { display:flex; align-items:center; gap:8px; }
        .atqhn-snap input[type="number"] { width: 90px; padding:4px 6px; }
        .atqhn-hint { font-size: 12px; color: #666; }
      `);
    }
  
    // --- Bootstrap WME and start once available ---
    (async function waitForWME() {
      LOG('Bootstrapping…');
      const ok = await poll(
        () => unsafeWindow?.W && unsafeWindow?.OpenLayers && unsafeWindow?.W?.map && unsafeWindow?.W?.model,
        900,
        150
      );
      if (!ok) return ERR('WME not ready, aborting');
  
      WME = unsafeWindow.W;
      OL = unsafeWindow.OpenLayers;
  
      try {
        if (unsafeWindow.SDK_INITIALIZED) {
          await unsafeWindow.SDK_INITIALIZED;
          wmeSDK = unsafeWindow.getWmeSdk && unsafeWindow.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: 'AT Quick HN' });
        }
      } catch {}
  
      init();
    })();
  
    // --- Main init: layers, events, UI wiring ---
    function init() {
      LOG(`Init (SNAP_PX=${SNAP_PX}, circles default ${DEFAULTS.CIRCLES ? 'AN' : 'AUS'})`);
  
      const search = document.getElementById('search-autocomplete');
      editButtonsRoot = (search && search.parentNode) || document.body;
  
      // Vector hints layer: green = same street (normalized), grey = other street
      hintsLayer = new OL.Layer.Vector('Quick HN Importer (AT)', {
        uniqueName: 'quick-hn-importer-at',
        className: 'at-qhn-hints',
        styleMap: new OL.StyleMap({
          default: new OL.Style(
            {
              fillColor: '${fillColor}',
              fillOpacity: '${opacity}',
              fontColor: '#111',
              fontWeight: 'bold',
              strokeColor: '#fff',
              strokeOpacity: '${opacity}',
              strokeWidth: 2,
              pointRadius: '${radius}',
              label: '${number}',
              title: '${title}'
            },
            {
              context: {
                fillColor: f => (f.attributes?.street === currentStreetId ? '#99ee99' : '#cccccc'),
                radius:   f => Math.max(String(f.attributes?.number || '').length * 6, 10),
                opacity:  f => (f.attributes?.street === currentStreetId && f.attributes?.processed ? 0.3 : 1),
                title:    f => (f.attributes?.number && f.attributes?.street)
                               ? `${streetNames[f.attributes.street] || ''} ${f.attributes.number}` : ''
              }
            }
          )
        })
      });
      try { WME.map.addLayer(hintsLayer); } catch (e) { return ERR('Failed to add layer', e); }
      liftHints();
  
      // Bottom loading banner while fetching address points
      loadingBanner = document.createElement('div');
      loadingBanner.style.cssText = 'position:absolute;bottom:35px;width:100%;pointer-events:none;display:none;';
      loadingBanner.innerHTML =
        '<div style="margin:0 auto;max-width:360px;text-align:center;background:rgba(0,0,0,.5);color:#fff;border-radius:5px;padding:6px 14px"><i class="fa fa-pulse fa-spinner"></i> Lade AT-Adresspunkte</div>';
      (document.getElementById('map') || document.body).appendChild(loadingBanner);
  
      // Subscribe to selection/house-number events (SDK if available, else fallback poller)
      if (wmeSDK) {
        wmeSDK.Events.on({ eventName: 'wme-selection-changed', eventHandler: onSelectionChanged });
        wmeSDK.Events.on({ eventName: 'wme-house-number-added', eventHandler: refreshProcessedFromModel });
        wmeSDK.Events.on({ eventName: 'wme-house-number-moved', eventHandler: refreshProcessedFromModel });
        LOG('SDK events wired');
      } else {
        selPollTimer = setInterval(() => {
          if (!isEnabled) return;
          if (Date.now() < suppressFetchUntil) return;
          const segs = safeSegs();
          const key = segs ? segs.map(s => s.attributes.id).join(',') : '';
          if (key !== lastSelKey) { lastSelKey = key; onSelectionChanged(); }
        }, 800);
        LOG('Fallback selection poller active');
      }
  
      // Capture "R" in capture phase to avoid default reverse-direction action
      const keyHandler = (e) => {
        if (!isEnabled || !e?.key) return;
        if (e.key.toLowerCase() === 'r' && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
          const segs = safeSegs();
          if (segs?.length && !isTyping(e)) {
            e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault();
            onPressR();
          }
        }
      };
      document.addEventListener('keydown', keyHandler, true);
      window.addEventListener('keydown', keyHandler, true);
  
      onSelectionChanged();
  
      WME.map?.events?.register('moveend', this, liftHints);
      WME.map?.events?.register('zoomend', this, liftHints);
      WME.map?.events?.register('changelayer', this, liftHints);
  
      setupSidebarTab();
      applyEnabledStateToUi();
    }
  
    // --- Sidebar UI ---
    async function setupSidebarTab() {
      try {
        if (!WME?.userscripts?.registerSidebarTab) throw new Error('Sidebar API not available');
        const { tabLabel, tabPane } = WME.userscripts.registerSidebarTab(SCRIPT_ID);
  
        tabLabelEl = tabLabel;
        updateTabLabel();
        tabLabel.title = 'AT Quick HN Importer';
  
        tabPane.innerHTML = `
        <div class="atqhn-pane">
  
          <div class="atqhn-row">
            <label class="atqhn-toggle">
              <input type="checkbox" id="atqhn-enabled">
              <span>Skript aktivieren (dr&uuml;cke <code>R</code> zum Ausf&uuml;llen)</span>
            </label>
          </div>
  
          <div class="atqhn-row">
            <label class="atqhn-toggle">
              <input type="checkbox" id="atqhn-circles">
              <span>Kreise anzeigen</span>
            </label>
          </div>
  
          <div class="atqhn-row atqhn-snap">
            <label for="atqhn-snap">SNAP-Abstand (px):</label>
            <input type="number" id="atqhn-snap" min="40" max="400" step="10" placeholder="120">
          </div>
  
          <div class="atqhn-row atqhn-hint">
            Ab einer Gr&ouml;sse &uuml;ber 120 px steigt das Risiko, dass zur falschen Nummer gesnappt wird. Bitte im eigenen Gebiet testen.
          </div>
  
          <div class="atqhn-row atqhn-muted">
            Status: <span id="atqhn-status" class="atqhn-status"></span>
          </div>
  
          <div class="atqhn-row">
            <button type="button" id="atqhn-clear" class="atqhn-btn">HN-Cache leeren</button>
            <button type="button" id="atqhn-reload" class="atqhn-btn">HN aktualisieren</button>
          </div>
  
          <div class="atqhn-row atqhn-muted">
            Ablauf: R+Klick f&uuml;llt HN und deaktiviert die Eingabe.
          </div>
  
          <div class="atqhn-row atqhn-muted">
            Dieses Tool ermittelt die n&auml;chstgelegene Hausnummer, pr&uuml;ft aber nicht die Strassenzuordnung.<br />
            Gr&uuml;ner Kreis = Nummer auf der gew&auml;hlten Strasse<br />
            Grauer Kreis = Nummer auf einer anderen Strasse oder Name weicht ab (z. B. „Sankt“ statt „St.“). Bitte mit Bedacht anwenden.
          </div>

            <div class="row muted">
              Info: Nur &Ouml;sterreich. <b>Nicht</b> mit anderen QHN Skripte zusammen nutzen.
            </div>
  
          <div class="atqhn-row atqhn-muted" style="font-size:11px;">
            <label class="atqhn-toggle">
              <input type="checkbox" id="atqhn-dev">
              <span>Dev-Modus (zus&auml;tzliche Logs)</span>
            </label>
          </div>
  
        </div>`;
  
        await WME.userscripts.waitForElementConnected(tabPane);
  
        const cbEnabled = tabPane.querySelector('#atqhn-enabled');
        const cbCircles = tabPane.querySelector('#atqhn-circles');
        const cbDev = tabPane.querySelector('#atqhn-dev');
        const snapInput = tabPane.querySelector('#atqhn-snap');
        const st = tabPane.querySelector('#atqhn-status');
        const clr = tabPane.querySelector('#atqhn-clear');
        const rld = tabPane.querySelector('#atqhn-reload');
  
        cbEnabled.checked = !!isEnabled;
        cbCircles.checked = !!circlesEnabled;
        cbDev.checked = !!devMode;
        snapInput.value = String(SNAP_PX);
        st.textContent = isEnabled ? 'AN' : 'AUS';
  
        cbEnabled.addEventListener('change', () => setEnabled(cbEnabled.checked));
        cbCircles.addEventListener('change', () => setCirclesEnabled(cbCircles.checked));
        cbDev.addEventListener('change', () => setDevMode(cbDev.checked));
        snapInput.addEventListener('change', () => {
          const v = Number(snapInput.value);
          setSnapPx(v);
          snapInput.value = String(SNAP_PX);
        });
        clr.addEventListener('click', () => { clearCache(); });
        rld.addEventListener('click', () => { if (isEnabled) onSelectionChanged(); });
  
        tabPane.addEventListener('element-disconnected', () => {});
      } catch (e) {
        WARN('Sidebar setup unavailable:', e?.message || e);
      }
    }
  
    // Update the tab label (shows ON/OFF and DEV tag)
    function updateTabLabel() {
      if (!tabLabelEl) return;
      const onOff = isEnabled ? '• AN 🟢' : '';
      const devTag = devMode ? ' • DEV 🛠' : '';
      tabLabelEl.textContent = `AT-QHN ${onOff}${devTag}`;
    }
  
    // --- State setters (toggle handlers) ---
    function setDevMode(v) {
      devMode = !!v;
      GM_Set(KEYS.DEV, devMode);
      updateTabLabel();
      LOG('Dev mode', devMode ? 'AN' : 'AUS');
    }
  
    function setSnapPx(v) {
      let nv = Math.round(Number(v));
      if (!Number.isFinite(nv)) nv = DEFAULTS.SNAP_PX;
      nv = Math.max(40, Math.min(400, nv));
      SNAP_PX = nv;
      GM_Set(KEYS.SNAP_PX, SNAP_PX);
      LOG('SNAP_PX =', SNAP_PX, '(>120 can mis-snap; test locally)');
    }
  
    function setEnabled(v) {
      isEnabled = !!v;
      GM_Set(KEYS.ENABLE, isEnabled);
      applyEnabledStateToUi();
      if (isEnabled) {
        onSelectionChanged();
        LOG('Script ON');
      } else {
        // Reset ephemeral state when disabling
        armedForNext = false;
        pendingRefPx = null;
        pendingCommit = null;
        fillQueue.length = 0;
        atPoints = [];
        currentStreetId = null;
        streetNames = {};
        streetsByName = {};
        hintsLayer?.removeAllFeatures();
        hintsLayer?.setVisibility(false);
        showLoading(false);
        LOG('Script OFF');
      }
    }
  
    function setCirclesEnabled(v) {
      circlesEnabled = !!v;
      GM_Set(KEYS.CIRCLES, circlesEnabled);
      try {
        if (!circlesEnabled) {
          hintsLayer?.removeAllFeatures();
          hintsLayer?.setVisibility(false);
        } else {
          if (isEnabled && atPoints?.length) onSelectionChanged();
          hintsLayer?.setVisibility(isEnabled && circlesEnabled);
          liftHints();
        }
      } catch {}
      applyEnabledStateToUi();
      LOG(`Circles ${circlesEnabled ? 'ON' : 'OFF'}`);
    }
  
    // Apply current state to UI controls and layer visibility
    function applyEnabledStateToUi() {
      try {
        const cbE = document.querySelector('#atqhn-enabled');
        const cbC = document.querySelector('#atqhn-circles');
        const cbD = document.querySelector('#atqhn-dev');
        const st = document.querySelector('#atqhn-status');
        const snapInput = document.querySelector('#atqhn-snap');
        if (cbE) cbE.checked = !!isEnabled;
        if (cbC) cbC.checked = !!circlesEnabled;
        if (cbD) cbD.checked = !!devMode;
        if (st) st.textContent = isEnabled ? 'AN' : 'AUS';
        if (snapInput) snapInput.value = String(SNAP_PX);
        updateTabLabel();
      } catch {}
      try {
        if (!isEnabled) {
          hintsLayer?.setVisibility(false);
          showLoading(false);
        } else {
          hintsLayer?.setVisibility(!!circlesEnabled);
          if (circlesEnabled) liftHints();
        }
      } catch {}
    }
  
    // Bring hint layer above WME overlays and keep it non-interactive
    function liftHints() {
      try {
        if (!isEnabled || !circlesEnabled) return;
        hintsLayer?.setVisibility(true);
        hintsLayer?.setOpacity(1);
        hintsLayer?.setZIndex?.(9000000);
        if (hintsLayer?.div) hintsLayer.div.style.pointerEvents = 'none';
      } catch {}
    }
  
    // --- Selection helpers ---
    function safeSegs() {
      try {
        const sel = WME.selectionManager.getSegmentSelection();
        return sel && sel.segments && sel.segments.length ? sel.segments : null;
      } catch { return null; }
    }
  
    function onSelectionChanged() {
      pendingCommit = null;
      if (!isEnabled) {
        hintsLayer?.removeAllFeatures();
        atPoints = [];
        currentStreetId = null;
        streetNames = {};
        streetsByName = {};
        return;
      }
      if (Date.now() < suppressFetchUntil) return;
      const segs = safeSegs();
      if (segs?.length) { DBG('onSelectionChanged: segs=%d', segs.length); fetchATForSelection(); }
      else {
        hintsLayer?.removeAllFeatures();
        atPoints = [];
        currentStreetId = null;
        streetNames = {};
        streetsByName = {};
      }
    }
  
    // --- R-key flow: arm, capture click, fill input ---
    async function onPressR() {
      if (!isEnabled) return;
  
      // If a previous number is ready to commit, try to commit it first
      if (pendingCommit && !getSelectionHNs().includes(String(pendingCommit.number))) {
        await commitPending();
      }
  
      LOG('R pressed - waiting for next click');
      armedForNext = true;
      pendingRefPx = null;
  
      if (!hintsLayer.features.length) fetchATForSelection();
      if (circlesEnabled) { hintsLayer.setVisibility(true); liftHints(); }
  
      // Open HN tool if possible
      const btn = findHNButton();
      if (btn) btn.click();
  
      // Capture the next click within the map viewport
      let cancelTimer = null;
      const cleanup = () => {
        clearTimeout(cancelTimer);
        document.removeEventListener('mousedown', cap, true);
        document.removeEventListener('click', cap, true);
      };
  
      const cap = (ev) => {
        try {
          if (!isEnabled) { cleanup(); return; }
          if (ev && ev.isTrusted === false) return; // ignore synthetic
          const vp = WME.map.viewPortDiv || document.querySelector('.olMapViewport');
          if (!vp) return;
          const rect = vp.getBoundingClientRect();
          const inside = ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom;
          if (!inside) return;
          const px = new OL.Pixel(ev.clientX - rect.left, ev.clientY - rect.top);
          pendingRefPx = px;
          LOG('Captured click pixel', { x: px.x, y: px.y });
          enqueueFillJob(px);
          cleanup();
        } catch { cleanup(); }
      };
  
      document.addEventListener('mousedown', cap, true);
      document.addEventListener('click', cap, true);
  
      // Safety timeout to disarm
      cancelTimer = setTimeout(() => {
        cleanup();
        if (armedForNext) { armedForNext = false; LOG('Timeout - no click captured'); }
      }, 4000);
    }
  
    // Try to find the "add house number" button heuristically
    function findHNButton() {
      const sels = ['[data-testid="add-house-number"]', '.add-house-number', 'wz-button:has(.w-icon-home)'];
      for (const s of sels) { const el = document.querySelector(s) || editButtonsRoot.querySelector?.(s); if (el) return el; }
      return null;
    }
  
    // Avoid intercepting R when typing in inputs
    function isTyping(e) {
      const path = typeof e?.composedPath === 'function' ? e.composedPath() : [];
      const candidates = [
        e?.target,
        document.activeElement,
        ...path
      ].filter(Boolean);

      for (const el of candidates) {
        if (!el || !el.tagName) continue;

        const tag = el.tagName.toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;

        if (el.isContentEditable) return true;

        const role = (el.getAttribute?.('role') || '').toLowerCase();
        if (role === 'textbox' || role === 'searchbox' || role === 'combobox') return true;

        if (el.closest?.('[contenteditable="true"], [role="textbox"], input, textarea')) return true;
      }

      return false;
    }

  
    // External trigger (kept for completeness)
    async function pollForHNInputAndFill() {
      if (!isEnabled || !armedForNext || !pendingRefPx) return;
      enqueueFillJob(pendingRefPx);
    }
  
    // --- Queue + fill execution ---
    function enqueueFillJob(px) {
      if (!isEnabled) return;
      const snapshot = atPoints.slice(); // take a snapshot to avoid race with async updates
      DBG('enqueueFillJob px=%o queueLen(before)=%d', px, fillQueue.length);
      fillQueue.push({ px, atSnapshot: snapshot });
      armedForNext = false;
      if (!isFilling) drainFillQueue();
    }
  
    async function drainFillQueue() {
      if (isFilling) return;
      isFilling = true;
      try {
        while (fillQueue.length) {
          const job = fillQueue.shift();
          if (!isEnabled) break;
          await runOneFillJob(job);
          await sleep(120);
        }
      } finally { isFilling = false; }
    }
  
    async function runOneFillJob(job) {
      if (!isEnabled) return;
      const deadline = Date.now() + 3000;
      let inputEl = null;
      while (Date.now() < deadline) {
        inputEl = findHNInputInTree(document);
        if (inputEl) break;
        await sleep(60);
      }
      if (!inputEl) { WARN('HN input not found (selectors may have changed)'); return; }
      DBG('runOneFillJob: input found');
      await tryFillFromAT(inputEl, job.px, job.atSnapshot);
    }
  
    // Locate the HN input robustly (set of fallbacks)
    function findHNInputInTree(root) {
      const sels = [
        'div.house-number.is-active input.number:not(.number-preview)',
        'div.house-number.is-active input[type="text"]:not(.number-preview)',
        '[data-testid="house-number-input"] input',
        'input[name="number"]',
        'input[aria-label="House number"]',
        'input[placeholder="House number"]',
        'input.number',
        'input[type="text"]'
      ];
      for (const s of sels) {
        const el = root.querySelector(s);
        if (el && el.tagName === 'INPUT' && !el.disabled) return el;
      }
      return null;
    }
  
    // --- Tile helpers ---
    const tileKeyForXY = (x, y) => `${Math.floor(x / TILE.SIZE_M)}_${Math.floor(y / TILE.SIZE_M)}`;
    function tilesForBounds(b) {
      const x1 = Math.floor(b.left / TILE.SIZE_M);
      const y1 = Math.floor(b.bottom / TILE.SIZE_M);
      const x2 = Math.floor(b.right / TILE.SIZE_M);
      const y2 = Math.floor(b.top / TILE.SIZE_M);
      const keys = [];
      for (let ty = y1; ty <= y2; ty += 1) for (let tx = x1; tx <= x2; tx += 1) keys.push(`${tx}_${ty}`);
      return keys;
    }
    function bboxFromTiles(keys) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const k of keys) {
        const [txS, tyS] = k.split('_'); const tx = +txS; const ty = +tyS;
        const left = tx * TILE.SIZE_M, bottom = ty * TILE.SIZE_M;
        const right = left + TILE.SIZE_M, top = bottom + TILE.SIZE_M;
        minX = Math.min(minX, left); minY = Math.min(minY, bottom);
        maxX = Math.max(maxX, right); maxY = Math.max(maxY, top);
      }
      return { x1: Math.floor(minX), y1: Math.floor(minY), x2: Math.ceil(maxX), y2: Math.ceil(maxY) };
    }
    const nowDays = () => Math.floor(Date.now() / 86400000);
  
    function getTileFromStore(key) {
      const m = memTiles.get(key); if (m) return m;
      if (!hasGM) return null;
      try {
        const raw = GM_getValue(TILE.NS + key, null); if (!raw) return null;
        const obj = JSON.parse(raw); memTiles.set(key, obj); return obj;
      } catch { return null; }
    }
    function putTileToStore(key, obj) {
      memTiles.set(key, obj);
      if (!hasGM) return;
      try {
        GM_Set(TILE.NS + key, JSON.stringify(obj)); // via wrapper
        const meta = loadMeta(); touchLRU(meta, key); enforceLRU(meta); saveMeta(meta);
      } catch {}
    }
    function loadMeta() {
      if (!hasGM) return { order: [] };
      try {
        const m = GM_getValue(TILE.META, null);
        return m ? JSON.parse(m) : { order: [] };
      } catch { return { order: [] }; }
    }
    function saveMeta(meta) { if (!hasGM) return; try { GM_setValue(TILE.META, JSON.stringify(meta)); } catch {} }
    function touchLRU(meta, key) { meta.order = (meta.order || []).filter(k => k !== key); meta.order.push(key); }
    function enforceLRU(meta) {
      while ((meta.order || []).length > TILE.MAX) {
        const victim = meta.order.shift();
        try { GM_deleteValue(TILE.NS + victim); } catch {}
        memTiles.delete(victim);
      }
    }
    function clearCache() {
      try {
        if (hasGM) {
          GM_listValues().forEach(k => { if (String(k).startsWith(TILE.NS) || k === TILE.META) GM_deleteValue(k); });
        }
        memTiles.clear();
        LOG('Cache cleared');
      } catch (e) { ERR('clearCache error', e); }
    }
    const isFresh = (tileObj) => !!(tileObj && typeof tileObj.ts === 'number' && nowDays() - tileObj.ts <= TILE.TTL_DAYS);
  
    // --- Fetch + draw (with cache) ---
    function fetchATForSelection() {
      if (!isEnabled) return;
      const segs = safeSegs(); if (!segs?.length) return;
  
      // Build padded bbox around selection (projected meters)
      let bounds = null;
      for (const seg of segs) { const b = seg.attributes.geometry.getBounds(); bounds = bounds ? (bounds.extend(b), bounds) : b; }
      const padded = {
        left: Math.floor(bounds.left - 200),
        right: Math.floor(bounds.right + 200),
        top: Math.floor(bounds.top + 200),
        bottom: Math.floor(bounds.bottom - 200)
      };
  
      const neededKeys = tilesForBounds(padded);
  
      // Try cache first
      let allFresh = true; let assembled = [];
      for (const key of neededKeys) {
        const tile = getTileFromStore(key);
        if (!isFresh(tile)) { allFresh = false; break; }
        if (tile?.items?.length) assembled = assembled.concat(tile.items);
      }
  
      if (allFresh) {
        LOG(`Cache hit (${neededKeys.length} tile(s)) - skipping network`);
        processATResultArray(assembled, segs);
        return;
      }
  
      // Network fetch
      showLoading(true);
      const body = bboxFromTiles(neededKeys);
      DBG('POST /adr body', body);
  
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://wms.kbox.at/adr',
        data: JSON.stringify(body),
        responseType: 'json',
        headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        onload: (resp) => {
          let result = resp.response;
          if (!result) {
            try { result = JSON.parse(resp.responseText || '[]'); }
            catch (e) { ERR('AT JSON parse fail', e, resp.responseText); showLoading(false); return; }
          }
          const buckets = new Map();
          for (const r of result) {
            const x = r.lon, y = r.lat, key = tileKeyForXY(x, y);
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push({
              lon: x, lat: y,
              number: String(r.hausnummerzahl1),
              streetId: String(r.strassennr),
              streetName: r.strassenname
            });
          }
          const today = nowDays();
          for (const k of neededKeys) { const items = buckets.get(k) || []; putTileToStore(k, { ts: today, items }); }
          let assembledAfter = [];
          for (const k of neededKeys) { const tile = getTileFromStore(k); if (tile?.items?.length) assembledAfter = assembledAfter.concat(tile.items); }
          processATResultArray(assembledAfter, segs);
          showLoading(false);
        },
        onerror: (e) => { ERR('AT request error', e); showLoading(false); }
      });
    }
  
    // Build features, color by street match, and draw circles
    function processATResultArray(items, segs) {
      const existing = getSelectionHNs();
      atPoints = []; const features = [];
      streetNames = {}; streetsByName = {};
  
      for (const r of items) {
        const { lon: x, lat: y, number, streetId, streetName } = r;
        atPoints.push({ lon: x, lat: y, number, streetId, processed: existing.includes(number) });
        if (circlesEnabled) {
          features.push(new OL.Feature.Vector(new OL.Geometry.Point(x, y), { number, street: streetId, processed: existing.includes(number) }));
        }
        if (streetName) streetsByName[streetName] = streetId;
        if (streetId) streetNames[streetId] = streetName || streetNames[streetId] || '';
      }
  
      // Determine currentStreetId from selected segment's streets
      const seg0 = segs[0];
      const segStIds = (seg0?.attributes?.streetIDs || []).slice();
      if (seg0?.attributes?.primaryStreetID != null) segStIds.push(seg0.attributes.primaryStreetID);
      const selectedStreetNames = WME.model.streets.getByIds(segStIds).map(s => s?.attributes?.name).filter(Boolean);
      const matchingName = selectedStreetNames.find(nm => streetsByName[nm] != null);
      currentStreetId = streetsByName[matchingName];
  
      hintsLayer.removeAllFeatures();
      if (circlesEnabled && features.length) hintsLayer.addFeatures(features);
      hintsLayer.setVisibility(!!(isEnabled && circlesEnabled));
      if (circlesEnabled) liftHints();
  
      LOG(`Loaded circles: ${features.length} (items: ${items.length}); street match: ${matchingName || '(none)'}; cache(mem)=${memTiles.size}`);
    }
  
    // React-safe input setter (ensures React picks up value changes)
    function setReactInputValue(input, value) {
      const win = input.ownerDocument.defaultView || window;
      const desc = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value');
      const nativeSetter = desc && desc.set;
      if (!nativeSetter) { input.value = value; return; }
      nativeSetter.call(input, value);
      input.dispatchEvent(new win.Event('input', { bubbles: true }));
      input.dispatchEvent(new win.Event('change', { bubbles: true }));
    }
  
    // --- Commit helpers ---
    function isVisible(el) {
      if (!el || !el.getBoundingClientRect) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    }
    function clickLikeHuman(el) {
      try {
        const w = el.ownerDocument.defaultView || window;
        const r = el.getBoundingClientRect();
        const cx = r.left + Math.min(Math.max(4, r.width/2), r.width-4);
        const cy = r.top + Math.min(Math.max(4, r.height/2), r.height-4);
        const opts = { bubbles:true, cancelable:true, clientX:cx, clientY:cy };
        el.focus?.(); el.dispatchEvent(new w.MouseEvent('mousedown', opts));
        el.dispatchEvent(new w.MouseEvent('mouseup', opts));
        el.dispatchEvent(new w.MouseEvent('click', opts));
      } catch {}
    }
  
    function findHouseNumberPanelRoot() {
      return document.querySelector('div.house-number.is-active') ||
             document.querySelector('#edit-panel') ||
             document.querySelector('[data-testid="edit-panel"]');
    }
  
    // Heuristics to find the "commit/apply" button in the HN panel
    function collectCommitButtonsStrict() {
      const root = findHouseNumberPanelRoot(); if (!root) return [];
      const btns = Array.from(root.querySelectorAll('button,[role="button"],wz-button,wz-icon-button')).filter(isVisible);
      return btns.filter((el) => {
        const cls = (el.className || '').toString().toLowerCase();
        if (cls.includes('edit-restrictions')) return false;
        const txt = (el.textContent || '').toLowerCase();
        const title = (el.getAttribute?.('title') || '').toLowerCase();
        const aria = (el.getAttribute?.('aria-label') || '').toLowerCase();
        const hay = `${txt} ${title} ${aria}`;
        if (/beschr(a|ä)nkung|restriction/.test(hay)) return false;
        const hasCheckIcon = !!(el.querySelector?.('.w-icon-check,.fa-check'));
        const isActionWord = /\b(save|apply|commit|confirm|ok|add|speichern|bestätigen|hinzufügen)\b/.test(hay);
        return hasCheckIcon || isActionWord;
      });
    }
  
    async function commitPending(){
      if (!pendingCommit) return false;
      const ok = await commitHouseNumberViaUI(String(pendingCommit.number));
      if (ok) { pendingCommit = null; refreshProcessedFromModel(); return true; }
      return false;
    }
  
    function getSelectionHNs() {
      const segs = safeSegs(); if (!segs) return [];
      const ids = segs.map(s=>s.attributes.id);
      return WME.model.segmentHouseNumbers.getObjectArray()
               .filter(h => ids.includes(h.attributes.segID))
               .map(h => String(h.attributes.number));
    }
  
    async function commitHouseNumberViaUI(numberStr) {
      // Allow UI to render the button
      await sleep(400);
      const before = getSelectionHNs();
      const buttons = collectCommitButtonsStrict();
      if (!buttons.length) { LOG('commit: no HN commit buttons found'); return false; }
      const preferred = buttons.filter(b => {
        const hay = `${b.textContent || ''} ${b.getAttribute?.('title') || ''} ${b.getAttribute?.('aria-label') || ''}`.toLowerCase();
        return /✓|✔|save|apply|commit|confirm|ok|speichern|bestätigen/.test(hay) || b.querySelector?.('.w-icon-check,.fa-check');
      });
      const candidates = preferred.length ? preferred : buttons;
  
      LOG(`commit: trying button(s) (preferred=${preferred.length}, total=${buttons.length})`);
      for (let i=0;i<candidates.length;i+=1){
        const b = candidates[i];
        clickLikeHuman(b);
        await sleep(250);
        const after = getSelectionHNs();
        if (after.length > before.length || after.includes(String(numberStr))) {
          LOG(`commit: success (index ${i}, ${preferred.length ? 'preferred' : 'fallback'})`);
          return true;
        }
      }
      WARN('commit: no change detected after clicks');
      return false;
    }
  
    // --- Fill flow: choose nearest dot and write it into the input ---
    async function tryFillFromAT(inputEl, refPx, atSnapshotOpt) {
      try {
        if (!isEnabled) return;
        const snap = Array.isArray(atSnapshotOpt) && atSnapshotOpt.length ? atSnapshotOpt : atPoints;
        DBG('tryFillFromAT refPx=%o snapshotLen=%d', refPx, Array.isArray(atSnapshotOpt) ? atSnapshotOpt.length : atPoints.length);
        if (!refPx) return;
        const found = nearestATByPixel(refPx, snap);
        if (!found) { WARN('fill: no candidate'); return; }
        const { point, distPx } = found;
        LOG('fill: candidate', { number: point.number, distPx: Math.round(distPx), SNAP_PX });
  
        if (distPx > SNAP_PX) { WARN(`fill: skipped - nearest dot too far (SNAP_PX=${SNAP_PX})`); return; }
  
        inputEl.focus();
        setReactInputValue(inputEl, '');
        setReactInputValue(inputEl, String(point.number));
        try { inputEl.blur(); } catch {}
        pendingCommit = { number: String(point.number) };
        LOG('fill: entered', point.number, '- press R to commit');
      } catch (e) { ERR('fill: exception', e?.message || e, e?.stack || ''); }
    }
  
    // --- Pixel-nearest helper and projection conversion ---
    function nearestATByPixel(clickPx, pointsList = atPoints) {
      if (!pointsList.length) return null;
      let best = null, bestD = Infinity;
      for (const p of pointsList) {
        const geo = toGeoLonLatFromProjected(p.lon, p.lat);
        const pDot = WME.map.getPixelFromLonLat(geo);
        if (!pDot) continue;
        const d = Math.hypot(clickPx.x - pDot.x, clickPx.y - pDot.y);
        if (d < bestD) { bestD = d; best = p; }
      }
      return best ? { point: best, distPx: bestD } : null;
    }
  
    let _epsg4326 = null;
    function toGeoLonLatFromProjected(x, y) {
      try {
        _epsg4326 = _epsg4326 || new OL.Projection('EPSG:4326');
        const proj = WME.map.getProjectionObject?.() || WME.map.projection || new OL.Projection('EPSG:900913');
        const ll = new OL.LonLat(x, y);
        return ll.transform(proj, _epsg4326);
      } catch {
        // Spherical mercator fallback
        const R = 6378137;
        const lon = (x / R) * (180 / Math.PI);
        const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
        return new OL.LonLat(lon, lat);
      }
    }
  
    // --- Sync processed state back into features after model changes ---
    function refreshProcessedFromModel() {
      const current = getSelectionHNs();
      for (const p of atPoints) p.processed = current.includes(p.number);
      if (circlesEnabled && hintsLayer?.features?.length) {
        for (const f of hintsLayer.features) if (f?.attributes) f.attributes.processed = current.includes(f.attributes.number);
        hintsLayer.redraw();
      }
    }
  
    // --- Misc helpers ---
    function showLoading(show) {
      if (!loadingBanner) return;
      if (!isEnabled) { loadingBanner.style.display = 'none'; return; }
      loadingBanner.style.display = show ? '' : 'none';
    }
  
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    function poll(test, maxTries = 300, delay = 100) {
      return new Promise(res => {
        let i = 0;
        const t = setInterval(() => {
          try {
            if (test()) { clearInterval(t); res(true); }
            else if ((i += 1) >= maxTries) { clearInterval(t); res(false); }
          } catch {}
        }, delay);
      });
    }
  })();  