// ==UserScript==
// @name         WorldGuessr helper (100% exact position, auto mark after 48 downloads)
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  Locates WorldGuessr street view
// @author       M4cr0s
// @match        *://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560461/WorldGuessr%20helper%20%28100%25%20exact%20position%2C%20auto%20mark%20after%2048%20downloads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560461/WorldGuessr%20helper%20%28100%25%20exact%20position%2C%20auto%20mark%20after%2048%20downloads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastLat = null, lastLng = null, isFetching = false;

    GM_addStyle(`
        #wg-helper-ui {
            position: fixed; top: 15px; left: 15px;
            background: rgba(10, 10, 10, 0.98); color: #00ffcc; padding: 15px;
            border: 2px solid #ff0055; z-index: 999999; font-family: 'Segoe UI', Tahoma, sans-serif;
            border-radius: 10px; box-shadow: 0 0 20px rgba(255, 0, 85, 0.7);
            width: 310px; display: none; pointer-events: auto;
        }
        .info-row { margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #222; }
        .label-tag { color: #ff0055; font-weight: bold; font-size: 10px; text-transform: uppercase; display: block; }
        .value-text { color: #fff; font-size: 13px; font-weight: 500; }
        .coords-box { background: #1a1a1a; padding: 6px; border-radius: 4px; margin: 10px 0; border: 1px solid #333; text-align: center; }
        #map-canvas {
            width: 100%; height: 260px; border-radius: 6px;
            border: 1px solid #444; margin-top: 10px;
            background: #000; overflow: hidden;
        }
        #map-canvas iframe { width: 100%; height: 100%; border: none; }
    `);

    async function fetchLocation(lat, lon) {
        if (isFetching) return; isFetching = true;
        try {
            const api = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
            const res = await fetch(api);
            const obj = await res.json();
            const ad = obj.address || {};
            
            document.getElementById('txt-p').textContent = ad.country || "---";
            document.getElementById('txt-e').textContent = ad.state || ad.region || "---";
            document.getElementById('txt-m').textContent = ad.county || ad.municipality || "---";
            document.getElementById('txt-l').textContent = ad.city || ad.town || ad.village || ad.suburb || "---";
        } catch (e) { } finally { isFetching = false; }
    }

    const initUI = () => {
        if (document.getElementById('wg-helper-ui')) return;
        const ui = document.createElement('div');
        ui.id = 'wg-helper-ui';
        ui.innerHTML = `
            <div style="text-align:center; margin-bottom:10px;"><b style="color:#00ffcc; letter-spacing:1px;">WG SNIPER ELITE</b></div>
            <div class="info-row"><span class="label-tag">País:</span><span id="txt-p" class="value-text">...</span></div>
            <div class="info-row"><span class="label-tag">Estado:</span><span id="txt-e" class="value-text">...</span></div>
            <div class="info-row"><span class="label-tag">Municipio:</span><span id="txt-m" class="value-text">...</span></div>
            <div class="info-row"><span class="label-tag">Localidad:</span><span id="txt-l" class="value-text">...</span></div>
            <div class="coords-box">
                <span id="v-coords" style="color:#ffd700; font-family:monospace; font-size:12px;">0.00, 0.00</span>
            </div>
            <div id="map-canvas"></div>
            <div style="font-size:9px; color:#555; text-align:center; margin-top:8px;">Scroll en mapa para ZOOM • SHIFT+R Reset</div>
        `;
        document.body.appendChild(ui);
        
        const canvas = document.getElementById('map-canvas');
        canvas.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    };

    const updateAll = (lat, lng) => {
        if (lastLat === lat && lastLng === lng) return;
        lastLat = lat; lastLng = lng;
        initUI();
        
        document.getElementById('wg-helper-ui').style.display = 'block';
        document.getElementById('v-coords').textContent = `${lat}, ${lng}`;
        
        const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=15&t=k&output=embed`;
        document.getElementById('map-canvas').innerHTML = `<iframe src="${mapUrl}"></iframe>`;
        
        fetchLocation(lat, lng);
        navigator.clipboard.writeText(`${lat}, ${lng}`).catch(()=>{});

        try {
            const viewport = document.querySelector('.ol-viewport');
            if (viewport) {
                const fiberKey = Object.keys(viewport).find(k => k.startsWith('__reactFiber'));
                if (fiberKey) {
                    let node = viewport[fiberKey].return;
                    while (node) {
                        if (node.memoizedProps?.setGuess) {
                            node.memoizedProps.setGuess({ lat: parseFloat(lat), lng: parseFloat(lng) });
                            break;
                        }
                        node = node.return;
                    }
                }
            }
        } catch (e) {}
    };

    const originalParse = JSON.parse;
    JSON.parse = function(str) {
        const data = originalParse(str);
        if (data && (data.lat || data.latitude)) {
            const lat = data.lat || data.latitude, lng = data.long || data.lng;
            if (lat !== 0) setTimeout(() => updateAll(lat, lng), 100);
        }
        return data;
    };

    setInterval(() => {
        const sv = document.getElementById('streetview');
        if (sv?.src) {
            const match = sv.src.match(/([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
            if (match) updateAll(match[1], match[2]);
        }
    }, 2000);

    window.addEventListener('keydown', (e) => { 
        if (e.shiftKey && e.code === 'KeyR') location.reload(); 
    });

})();