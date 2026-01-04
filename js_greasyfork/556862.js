// ==UserScript==
// @name         GeoGuessr Indonesia Kabupaten Map Overlay (Google Maps 2025+)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Press B to toggle Indonesian kabupaten borders on the GeoGuessr guess map (hover names, click-through, settings UI)
// @author       You
// @match        https://www.geoguessr.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556862/GeoGuessr%20Indonesia%20Kabupaten%20Map%20Overlay%20%28Google%20Maps%202025%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556862/GeoGuessr%20Indonesia%20Kabupaten%20Map%20Overlay%20%28Google%20Maps%202025%2B%29.meta.js
// ==/UserScript==

// Data sources:
// - "IndonesiaGeoJSON" by TheMaggieSimpson (MIT License)
//   https://github.com/TheMaggieSimpson/IndonesiaGeoJSON
// - "indonesia-geojson-simplified" by azunzios (derived from the above)
//   https://github.com/azunzios/indonesia-geojson

(function () {
    'use strict';

    // Disable in multiplayer modes
    if (location.pathname.startsWith('/multiplayer')) {
        console.warn('[KabupatenOverlay] Disabled on multiplayer mode.');
        return;
    }

    const uw = unsafeWindow; // real page window

    // ==============================
    // VISUAL SETTINGS
    // ==============================

    // OVERLAY_COLOR controls the border color of kabupaten polygons.
    // Examples:
    //   const OVERLAY_COLOR = '#ff0000';              // red
    //   const OVERLAY_COLOR = '#00ffff';              // cyan
    //   const OVERLAY_COLOR = 'rgba(255,255,0,1.0)';  // yellow
    const OVERLAY_COLOR = '#00aa00';

    const BORDER_STYLE = {
        strokeColor: OVERLAY_COLOR,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillOpacity: 0
    };

    // ==============================
    // DATA SOURCES (2 levels)
    // ==============================

    const SIMPLE_URL =
        'https://raw.githubusercontent.com/azunzios/indonesia-geojson/main/indonesia_kabkota_simple.geojson';

    const HIGH_URL =
        'https://raw.githubusercontent.com/TheMaggieSimpson/IndonesiaGeoJSON/main/kota-kabupaten.json';

    function getDataUrl() {
        return currentConfig.detailLevel === 'high' ? HIGH_URL : SIMPLE_URL;
    }

    // ==============================
    // REGION GROUPS (checkboxes)
    // ==============================

    const REGION_GROUPS = [
        { key: 'sumatra', label: 'Sumatra' },
        { key: 'java', label: 'Java (incl. Jakarta/Banten)' },
        { key: 'kalimantan', label: 'Kalimantan' },
        { key: 'sulawesi', label: 'Sulawesi' },
        { key: 'baliNusa', label: 'Bali & Nusa Tenggara' },
        { key: 'maluku', label: 'Maluku' },
        { key: 'papua', label: 'Papua' }
    ];

    const REGION_TOKENS = {
        sumatra: [
            'ACEH',
            'SUMATERA',
            'RIAU',
            'KEPULAUAN RIAU',
            'JAMBI',
            'SUMATERA BARAT',
            'SUMATERA UTARA',
            'SUMATERA SELATAN',
            'BENGKULU',
            'LAMPUNG',
            'BANGKA',
            'BELITUNG'
        ],
        java: [
            'JAVA',
            'JAWA',
            'WEST JAVA',
            'EAST JAVA',
            'CENTRAL JAVA',
            'JAWA BARAT',
            'JAWA TIMUR',
            'JAWA TENGAH',
            'BANTEN',
            'JAKARTA',
            'DKI JAKARTA',
            'DI YOGYAKARTA',
            'YOGYAKARTA'
        ],
        kalimantan: [
            'KALIMANTAN',
            'BORNEO',
            'KALIMANTAN BARAT',
            'KALIMANTAN TENGAH',
            'KALIMANTAN SELATAN',
            'KALIMANTAN TIMUR',
            'KALIMANTAN UTARA'
        ],
        sulawesi: [
            'SULAWESI',
            'SULAWESI UTARA',
            'SULAWESI TENGAH',
            'SULAWESI SELATAN',
            'SULAWESI TENGGARA',
            'SULAWESI BARAT',
            'GORONTALO'
        ],
        baliNusa: [
            'BALI',
            'NUSA TENGGARA',
            'NUSA TENGGARA BARAT',
            'NUSA TENGGARA TIMUR'
        ],
        maluku: [
            'MALUKU',
            'MALUKU UTARA'
        ],
        papua: [
            'PAPUA',
            'IRIAN JAYA'
        ]
    };

    // ==============================
    // PERSISTENT CONFIG
    // ==============================

    const DEFAULT_DETAIL_LEVEL = 'simple';      // 'simple' | 'high'
    const DEFAULT_SELECTED_REGIONS = '';        // empty = all Indonesia

    function normalizeDetailLevel(val) {
        if (val === 'simple' || val === 'high') return val;
        // Map older multi-level values if present
        if (val === 'lowest' || val === 'low' || val === 'medium') return 'simple';
        if (val === 'veryHigh') return 'high';
        return DEFAULT_DETAIL_LEVEL;
    }

    let currentConfig = {
        detailLevel: normalizeDetailLevel(GM_getValue('detailLevel', DEFAULT_DETAIL_LEVEL)),
        selectedRegions: (GM_getValue('selectedRegions', DEFAULT_SELECTED_REGIONS) || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
    };

    function saveConfig() {
        GM_setValue('detailLevel', currentConfig.detailLevel);
        GM_setValue('selectedRegions', currentConfig.selectedRegions.join(','));
    }

    // ==============================
    // SETTINGS PANEL
    // ==============================

    function registerMenuCommands() {
        try {
            GM_registerMenuCommand(
                'Kabupaten overlay: settings…',
                openSettingsPanel
            );
        } catch (e) {
            console.warn('[KabupatenOverlay] Menu registration failed:', e);
        }
    }

    function openSettingsPanel() {
        ensureMouseTracker();

        function createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'kab-settings-overlay';
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0,0,0,0.55)';
            overlay.style.zIndex = '200000';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';

            const box = document.createElement('div');
            box.id = 'kab-settings-box';
            box.style.background = '#1e1e1e';
            box.style.color = '#fff';
            box.style.padding = '20px 24px';
            box.style.borderRadius = '10px';
            box.style.minWidth = '320px';
            box.style.maxWidth = '460px';
            box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
            box.style.fontFamily = 'Arial, sans-serif';
            box.style.fontSize = '13px';

            const title = document.createElement('h2');
            title.textContent = 'Kabupaten overlay settings';
            title.style.marginTop = '0';
            title.style.fontSize = '18px';
            title.style.marginBottom = '10px';
            box.appendChild(title);

            // Detail level
            const fsDetail = document.createElement('fieldset');
            fsDetail.style.border = '1px solid #444';
            fsDetail.style.borderRadius = '6px';
            fsDetail.style.padding = '8px 10px';
            fsDetail.style.marginBottom = '12px';

            const legendDetail = document.createElement('legend');
            legendDetail.textContent = 'Border detail level (data size)';
            legendDetail.style.padding = '0 4px';
            legendDetail.style.fontSize = '13px';
            fsDetail.appendChild(legendDetail);

            const detailContainer = document.createElement('div');
            detailContainer.style.display = 'flex';
            detailContainer.style.flexDirection = 'column';
            detailContainer.style.gap = '4px';

            const optSimple = document.createElement('label');
            optSimple.innerHTML = '<input type="radio" name="kab-detail" value="simple"> Simple (~2 MB, fastest)';

            const optHigh = document.createElement('label');
            optHigh.innerHTML = '<input type="radio" name="kab-detail" value="high"> High (~90+ MB, very detailed)';

            detailContainer.appendChild(optSimple);
            detailContainer.appendChild(optHigh);
            fsDetail.appendChild(detailContainer);

            const noteDetail = document.createElement('div');
            noteDetail.textContent = 'High detail is noticeably slower to download and render.';
            noteDetail.style.marginTop = '6px';
            noteDetail.style.fontSize = '11px';
            noteDetail.style.color = '#bbb';
            fsDetail.appendChild(noteDetail);

            box.appendChild(fsDetail);

            // Region filter
            const fsRegion = document.createElement('fieldset');
            fsRegion.style.border = '1px solid #444';
            fsRegion.style.borderRadius = '6px';
            fsRegion.style.padding = '8px 10px';
            fsRegion.style.marginBottom = '14px';

            const legendRegion = document.createElement('legend');
            legendRegion.textContent = 'Regions to show';
            legendRegion.style.padding = '0 4px';
            legendRegion.style.fontSize = '13px';
            fsRegion.appendChild(legendRegion);

            const regionHelp = document.createElement('div');
            regionHelp.textContent = 'Tick one or more major regions. Leave all unchecked for whole Indonesia.';
            regionHelp.style.fontSize = '11px';
            regionHelp.style.color = '#bbb';
            regionHelp.style.marginBottom = '6px';
            fsRegion.appendChild(regionHelp);

            const regionsContainer = document.createElement('div');
            regionsContainer.style.display = 'grid';
            regionsContainer.style.gridTemplateColumns = '1fr 1fr';
            regionsContainer.style.gap = '4px 10px';

            REGION_GROUPS.forEach(group => {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '4px';
                label.style.fontSize = '13px';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.setAttribute('data-kab-region', group.key);
                label.appendChild(cb);

                const span = document.createElement('span');
                span.textContent = group.label;
                label.appendChild(span);

                regionsContainer.appendChild(label);
            });

            fsRegion.appendChild(regionsContainer);
            box.appendChild(fsRegion);

            // Buttons
            const btnRow = document.createElement('div');
            btnRow.style.display = 'flex';
            btnRow.style.justifyContent = 'flex-end';
            btnRow.style.gap = '8px';
            btnRow.style.marginTop = '4px';

            const btnCancel = document.createElement('button');
            btnCancel.type = 'button';
            btnCancel.textContent = 'Cancel';
            btnCancel.style.padding = '6px 12px';
            btnCancel.style.borderRadius = '4px';
            btnCancel.style.border = '1px solid #666';
            btnCancel.style.background = '#333';
            btnCancel.style.color = '#fff';
            btnCancel.style.cursor = 'pointer';

            const btnSave = document.createElement('button');
            btnSave.type = 'button';
            btnSave.textContent = 'Save';
            btnSave.style.padding = '6px 12px';
            btnSave.style.borderRadius = '4px';
            btnSave.style.border = '1px solid #1a8f3a';
            btnSave.style.background = '#21a147';
            btnSave.style.color = '#fff';
            btnSave.style.cursor = 'pointer';

            btnRow.appendChild(btnCancel);
            btnRow.appendChild(btnSave);
            box.appendChild(btnRow);

            overlay.appendChild(box);
            return { overlay, box, btnSave, btnCancel };
        }

        function attachOverlay() {
            if (document.getElementById('kab-settings-overlay')) return;

            const { overlay, box, btnSave, btnCancel } = createOverlay();
            document.body.appendChild(overlay);

            // Init detail radios
            const radios = box.querySelectorAll('input[name="kab-detail"]');
            radios.forEach(r => {
                if (r.value === currentConfig.detailLevel) r.checked = true;
            });
            if (![...radios].some(r => r.checked)) {
                const def = box.querySelector('input[name="kab-detail"][value="simple"]');
                if (def) def.checked = true;
            }

            // Init region checkboxes
            const selectedSet = new Set(currentConfig.selectedRegions || []);
            box.querySelectorAll('input[data-kab-region]').forEach(cb => {
                const key = cb.getAttribute('data-kab-region');
                cb.checked = selectedSet.has(key);
            });

            function close() {
                overlay.remove();
            }

            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) close();
            });

            btnCancel.addEventListener('click', close);

            btnSave.addEventListener('click', function () {
                const selectedRadio = box.querySelector('input[name="kab-detail"]:checked');
                const level = selectedRadio ? selectedRadio.value : 'simple';

                const selectedRegions = [];
                box.querySelectorAll('input[data-kab-region]').forEach(cb => {
                    if (cb.checked) selectedRegions.push(cb.getAttribute('data-kab-region'));
                });

                currentConfig.detailLevel = level;
                currentConfig.selectedRegions = selectedRegions;
                saveConfig();

                // Clear cached data
                geoJsonPromise = null;
                maps.forEach(m => {
                    const s = mapState.get(m);
                    if (s && s.layer) {
                        s.layer.forEach(function (feat) {
                            s.layer.remove(feat);
                        });
                        s.hasData = false;
                    }
                });

                showMessage('Kabupaten settings saved. Toggle B off/on to reload borders.');
                close();
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachOverlay, { once: true });
        } else if (document.body) {
            attachOverlay();
        }
    }

    registerMenuCommands();

    // ==============================
    // INTERNAL STATE
    // ==============================

    const maps = [];
    const mapState = new WeakMap(); // map -> { map, layer, hasData, requestedVisible, handlersAttached }

    let geoJsonPromise = null;
    let keyListenerInstalled = false;
    let mapsPatched = false;

    let kabupatenNameDiv = null;
    let lastPointerPage = null;
    let mouseTrackerInstalled = false;

    // ==============================
    // DATA LOADING + REGION FILTER
    // ==============================

    function loadKabupatenGeoJson() {
        if (!geoJsonPromise) {
            const url = getDataUrl();
            geoJsonPromise = fetch(url)
                .then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(data => filterGeoJsonByRegion(data))
                .catch(err => {
                    console.error('[KabupatenOverlay] Failed to load GeoJSON', err);
                    showMessage('Kabupaten borders: failed to download');
                    throw err;
                });
        }
        return geoJsonPromise;
    }

    function activeRegionTokensUpper() {
        if (!currentConfig.selectedRegions || currentConfig.selectedRegions.length === 0) {
            return null; // no filter
        }
        const tokens = [];
        currentConfig.selectedRegions.forEach(key => {
            const arr = REGION_TOKENS[key];
            if (Array.isArray(arr)) {
                arr.forEach(t => tokens.push(String(t).toUpperCase()));
            }
        });
        return tokens.length ? tokens : null;
    }

    function filterGeoJsonByRegion(data) {
        const inc = activeRegionTokensUpper();
        if (!inc || !Array.isArray(data.features)) return data;

        const filtered = data.features.filter(feat => {
            const props = feat && feat.properties;
            if (!props) return false;

            const provName = getProvinceNameFromProps(props);
            if (!provName) return false;

            const up = String(provName).toUpperCase();
            for (let i = 0; i < inc.length; i++) {
                if (up.indexOf(inc[i]) !== -1) return true;
            }
            return false;
        });

        return Object.assign({}, data, { features: filtered });
    }

    function getProvinceNameFromProps(props) {
        if (!props) return null;
        if (props.NAME_1) return props.NAME_1;
        const candidates = [
            'provinsi', 'Provinsi', 'PROVINSI',
            'province', 'Province',
            'WADMPR'
        ];
        for (let i = 0; i < candidates.length; i++) {
            const key = candidates[i];
            if (props[key]) return props[key];
        }
        return null;
    }

    // ==============================
    // MOUSE TRACKER
    // ==============================

    function ensureMouseTracker() {
        if (mouseTrackerInstalled) return;
        mouseTrackerInstalled = true;

        document.addEventListener('mousemove', function (e) {
            lastPointerPage = { x: e.clientX, y: e.clientY };
            if (kabupatenNameDiv && kabupatenNameDiv.style.display !== 'none') {
                positionKabupatenName(lastPointerPage.x, lastPointerPage.y);
            }
        });
    }

    // ==============================
    // MAP REGISTRATION + TOGGLING
    // ==============================

    function registerMap(map) {
        maps.push(map);
        mapState.set(map, {
            map,
            layer: null,
            hasData: false,
            requestedVisible: false,
            handlersAttached: false
        });
        ensureKeyListener();
        ensureMouseTracker();
    }

    function ensureKeyListener() {
        if (keyListenerInstalled) return;
        keyListenerInstalled = true;

        document.addEventListener('keydown', function (e) {
            if (!e.key || e.key.toLowerCase() !== 'b') return;

            const target = e.target;
            const tag = (target && target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || (target && target.isContentEditable)) return;

            const map = maps[maps.length - 1];
            if (!map) {
                showMessage('Kabupaten borders: no map detected yet');
                return;
            }

            toggleKabupaten(map);
        });
    }

    function toggleKabupaten(map) {
        const state = mapState.get(map);
        if (!state) return;

        state.requestedVisible = !state.requestedVisible;

        if (!state.layer && uw.google && uw.google.maps && uw.google.maps.Data) {
            state.layer = new uw.google.maps.Data({ map: null });
            state.layer.setStyle({
                strokeColor: BORDER_STYLE.strokeColor,
                strokeOpacity: BORDER_STYLE.strokeOpacity,
                strokeWeight: BORDER_STYLE.strokeWeight,
                fillOpacity: BORDER_STYLE.fillOpacity,
                clickable: true,          // we handle click and forward it
                cursor: 'crosshair'       // keeps a guessing-style pointer
            });
        }

        if (!state.layer) {
            showMessage('Kabupaten borders: Google Maps not ready');
            return;
        }

        attachOverlayHandlers(state);

        if (!geoJsonPromise) {
            showMessage(
                currentConfig.detailLevel === 'high'
                    ? 'Loading kabupaten borders (high detail)…'
                    : 'Loading kabupaten borders (simple)…'
            );
        }

        loadKabupatenGeoJson()
            .then(data => {
                if (!state.hasData) {
                    state.layer.addGeoJson(data);
                    state.hasData = true;
                }

                if (state.requestedVisible) {
                    state.layer.setMap(map);
                    showMessage('Kabupaten borders: ON');
                } else {
                    state.layer.setMap(null);
                    hideKabupatenName();
                    showMessage('Kabupaten borders: OFF');
                }
            })
            .catch(() => {
                // already handled in loader
            });
    }

    // Attach hover + click-forward handlers once per map
    function attachOverlayHandlers(state) {
        if (!state.layer || state.handlersAttached) return;
        state.handlersAttached = true;

        const layer = state.layer;
        const map = state.map;

        // Hover name
        layer.addListener('mouseover', function (e) {
            const feature = e.feature;
            const name = getKabupatenName(feature);
            showKabupatenName(name);
        });

        layer.addListener('mouseout', function () {
            hideKabupatenName();
        });

        // Click passthrough: forward clicks to the underlying map
        layer.addListener('click', function (e) {
            if (!map || !uw.google || !uw.google.maps || !uw.google.maps.event) return;
            try {
                uw.google.maps.event.trigger(map, 'click', {
                    latLng: e.latLng,
                    pixel: e.pixel,
                    domEvent: e.domEvent
                });
            } catch (err) {
                console.warn('[KabupatenOverlay] Failed to forward click to map', err);
            }
        });
    }

    function getKabupatenName(feature) {
        if (!feature || typeof feature.getProperty !== 'function') {
            return 'Kabupaten tidak diketahui';
        }

        const keys = [
            'NAMOBJ', 'WADMKC', 'WADMKK',
            'kab_kota', 'kabupaten', 'Kabupaten',
            'KABUPATEN', 'KAB_KOTA',
            'name', 'NAME_2'
        ];

        for (let i = 0; i < keys.length; i++) {
            const v = feature.getProperty(keys[i]);
            if (v != null && v !== '') return String(v);
        }

        let fallback = null;
        feature.forEachProperty(function (value) {
            if (!fallback && typeof value === 'string' && value.trim().length > 0) {
                fallback = value;
            }
        });

        return fallback || 'Kabupaten tidak diketahui';
    }

    // ==============================
    // UI: TOAST + HOVER LABEL
    // ==============================

    function showMessage(text) {
        let div = document.getElementById('kabupaten-overlay-msg');

        if (!div) {
            div = document.createElement('div');
            div.id = 'kabupaten-overlay-msg';
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.right = '20px';
            div.style.background = 'rgba(0,150,0,0.95)';
            div.style.color = '#fff';
            div.style.padding = '12px 20px';
            div.style.borderRadius = '8px';
            div.style.font = 'bold 16px Arial, sans-serif';
            div.style.zIndex = '100000';
            div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

            function attach() {
                if (!div.isConnected && document.body) {
                    document.body.appendChild(div);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', attach, { once: true });
            } else {
                attach();
            }
        }

        div.textContent = text;

        clearTimeout(div._hideTimer);
        div._hideTimer = setTimeout(function () {
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }, 4000);
    }

    function ensureKabupatenNameDiv() {
        if (kabupatenNameDiv) return kabupatenNameDiv;

        kabupatenNameDiv = document.createElement('div');
        kabupatenNameDiv.id = 'kabupaten-overlay-name';
        kabupatenNameDiv.style.position = 'fixed';
        kabupatenNameDiv.style.left = '0px';
        kabupatenNameDiv.style.top = '0px';
        kabupatenNameDiv.style.background = 'rgba(0,0,0,0.75)';
        kabupatenNameDiv.style.color = '#fff';
        kabupatenNameDiv.style.padding = '8px 14px';
        kabupatenNameDiv.style.borderRadius = '6px';
        kabupatenNameDiv.style.font = 'bold 18px Arial, sans-serif';
        kabupatenNameDiv.style.zIndex = '100000';
        kabupatenNameDiv.style.pointerEvents = 'none';
        kabupatenNameDiv.style.display = 'none';

        function attach() {
            if (!kabupatenNameDiv.isConnected && document.body) {
                document.body.appendChild(kabupatenNameDiv);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attach, { once: true });
        } else {
            attach();
        }

        return kabupatenNameDiv;
    }

    function positionKabupatenName(pageX, pageY) {
        const div = ensureKabupatenNameDiv();
        const offset = 18;

        let left = pageX + offset;
        let top = pageY + offset;

        const maxLeft = window.innerWidth - 250;
        const maxTop = window.innerHeight - 80;

        if (left > maxLeft) left = maxLeft;
        if (top > maxTop) top = maxTop;

        div.style.left = left + 'px';
        div.style.top = top + 'px';
    }

    function showKabupatenName(name) {
        const div = ensureKabupatenNameDiv();
        div.textContent = 'Kabupaten: ' + name;
        div.style.display = 'block';

        const p = lastPointerPage || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        positionKabupatenName(p.x, p.y);
    }

    function hideKabupatenName() {
        if (kabupatenNameDiv) {
            kabupatenNameDiv.style.display = 'none';
        }
    }

    // ==============================
    // GOOGLE MAPS PATCHING
    // ==============================

    function patchGoogleMaps(g) {
        if (mapsPatched) return;
        if (!g || !g.maps || !g.maps.Map) return;

        const OriginalMap = g.maps.Map;

        g.maps.Map = class extends OriginalMap {
            constructor(...args) {
                super(...args);
                registerMap(this);
            }
        };

        mapsPatched = true;
    }

    function overrideOnLoad(googleScript, observer, overrider) {
        const oldOnload = googleScript.onload;
        googleScript.onload = function (event) {
            try {
                overrider();
            } catch (err) {
                console.error('[KabupatenOverlay] Failed to patch Google Maps on load', err);
            }
            if (typeof oldOnload === 'function') {
                oldOnload.call(this, event);
            }
            observer.disconnect();
        };
    }

    function grabGoogleScript(mutations) {
        for (let i = 0; i < mutations.length; i++) {
            const added = mutations[i].addedNodes;
            for (let j = 0; j < added.length; j++) {
                const node = added[j];
                if (
                    node &&
                    node.tagName === 'SCRIPT' &&
                    typeof node.src === 'string' &&
                    node.src.indexOf('https://maps.googleapis.com/') === 0
                ) {
                    return node;
                }
            }
        }
        return null;
    }

    function injecter(overrider) {
        const observer = new MutationObserver(function (mutations) {
            const googleScript = grabGoogleScript(mutations);
            if (googleScript) {
                overrideOnLoad(googleScript, observer, overrider);
            }
        });

        observer.observe(document.documentElement || document, {
            childList: true,
            subtree: true
        });
    }

    injecter(function () {
        patchGoogleMaps(uw.google);
    });

    if (uw.google && uw.google.maps && uw.google.maps.Map) {
        patchGoogleMaps(uw.google);
    }
})();
