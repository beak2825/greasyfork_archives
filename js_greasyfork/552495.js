// ==UserScript==
// @name         Shea
// @namespace    https://example.com/
// @version      1.1
// @description  (Shea) Geoguessr rastgele başladığında başlangıç koordinatlarını küçük bir panelde gösterir (lat,lng). Birkaç farklı yolla sayfadan koordinatı yakalamaya çalışır.
// @author       XX
// @match        *://*.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552495/Shea.user.js
// @updateURL https://update.greasyfork.org/scripts/552495/Shea.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_TAG = '[Shea]';

  // --- Stil (basit) ---
  GM_addStyle(`
    #shea-start-coord-panel {
      position: fixed;
      right: 12px;
      top: 12px;
      z-index: 2147483647;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 8px 10px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
    }
    #shea-start-coord-panel button {
      margin-left: 6px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    #shea-start-coord-panel .label { opacity: 0.9; font-weight: 600; margin-right:6px; }
  `);

  // --- Panel oluştur ---
  function createPanel() {
    if (document.getElementById('shea-start-coord-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'shea-start-coord-panel';
    panel.innerHTML = `
      <span class="label">Shea Başlangıç:</span>
      <span id="shea-coords">Bulunamadı</span>
      <div style="margin-top:6px; text-align:right;">
        <button id="shea-copy-btn">Kopyala</button>
        <button id="shea-hide-btn">Gizle</button>
      </div>
    `;
    document.documentElement.appendChild(panel);

    document.getElementById('shea-copy-btn').addEventListener('click', () => {
      const t = document.getElementById('shea-coords').textContent;
      if (t && t !== 'Bulunamadı') navigator.clipboard?.writeText(t);
    });
    document.getElementById('shea-hide-btn').addEventListener('click', () => {
      panel.style.display = 'none';
    });
  }

  // --- Koordinat gösterme helper ---
  function showCoords(lat, lng, source) {
    createPanel();
    const coordsEl = document.getElementById('shea-coords');
    const latFixed = (typeof lat === 'number') ? lat.toFixed(6) : lat;
    const lngFixed = (typeof lng === 'number') ? lng.toFixed(6) : lng;
    coordsEl.textContent = `${latFixed}, ${lngFixed}  (${source})`;
    console.info(`${LOG_TAG} Start coords:`, lat, lng, 'source=', source);
  }

  // --- Basit JSON içinden lat/lng alıcı ---
  function tryFindLatLngIn(obj) {
    try {
      if (!obj || typeof obj !== 'object') return null;
      const keys = Object.keys(obj);
      for (const k of keys) {
        const v = obj[k];
        if (isLatLngPair(obj)) {
          return { lat: obj.lat || obj.latitude, lng: obj.lng || obj.lng || obj.longitude || obj.long };
        }
        if (typeof v === 'object' && v !== null) {
          const res = tryFindLatLngIn(v);
          if (res) return res;
        }
      }
      const flat = JSON.stringify(obj);
      const latMatch = flat.match(/"lat"\s*:\s*([-+]?\d+\.\d+)/i) || flat.match(/"latitude"\s*:\s*([-+]?\d+\.\d+)/i);
      const lngMatch = flat.match(/"lng"\s*:\s*([-+]?\d+\.\d+)/i) || flat.match(/"longitude"\s*:\s*([-+]?\d+\.\d+)/i);
      if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
    } catch (e) { /* ignore */ }
    return null;
  }

  function isLatLngPair(o) {
    if (!o || typeof o !== 'object') return false;
    const hasLat = ('lat' in o) || ('latitude' in o);
    const hasLng = ('lng' in o) || ('longitude' in o) || ('long' in o);
    return hasLat && hasLng;
  }

  // --- 1) Sayfa üzerinde bazı bilinen global state değişkenlerini dene (document load sonrası) ---
  function probeGlobals() {
    const candidates = [
      window.__INITIAL_STATE__,
      window.__PRELOADED_STATE__,
      window.game,
      window.ggstate,
      window.appState,
      window.__NUXT__
    ];
    for (const c of candidates) {
      const found = tryFindLatLngIn(c);
      if (found) {
        showCoords(found.lat, found.lng, 'globalState');
        return true;
      }
    }
    const scripts = document.querySelectorAll('script');
    for (const s of scripts) {
      try {
        const text = s.textContent;
        if (!text || text.length > 200000) continue;
        const jsonLike = /{[^<>]*"lat"[^<>]*}/.exec(text);
        if (jsonLike) {
          const res = tryFindLatLngIn(JSON.parse(jsonLike[0]));
          if (res) { showCoords(res.lat, res.lng, 'inlineScript'); return true; }
        }
      } catch (e) { /* ignore parse errors */ }
    }
    return false;
  }

  // --- 2) fetch/XHR hook: gelen JSON yanıtlarında lat/lng arar ---
  function hookNetwork() {
    const origFetch = window.fetch;
    window.fetch = function () {
      return origFetch.apply(this, arguments).then(async res => {
        try {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const clone = res.clone();
            const json = await clone.json().catch(()=>null);
            if (json) {
              const found = tryFindLatLngIn(json);
              if (found) showCoords(found.lat, found.lng, 'fetch');
            }
          } else {
            const clone2 = res.clone();
            const txt = await clone2.text().catch(()=>null);
            if (txt && txt.length < 200000 && /"lat"|"latitude"/i.test(txt)) {
              const jmatch = txt.match(/\{[\s\S]*"lat"[\s\S]*?\}/);
              if (jmatch) {
                try {
                  const j = JSON.parse(jmatch[0]);
                  const f = tryFindLatLngIn(j);
                  if (f) showCoords(f.lat, f.lng, 'fetch-text');
                } catch (e) { }
              }
            }
          }
        } catch (e) { /* ignore */ }
        return res;
      });
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
      this._url_for_hook = arguments[1];
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('load', function () {
        try {
          const ct = this.getResponseHeader && this.getResponseHeader('content-type') || '';
          let txt = null;
          if (typeof this.response === 'string') txt = this.response;
          else if (this.responseType === '' || this.responseType === 'text') txt = this.responseText;
          if (txt && /"lat"|"latitude"/i.test(txt)) {
            const jmatch = txt.match(/\{[\s\S]*"lat"[\s\S]*?\}/);
            if (jmatch) {
              try {
                const j = JSON.parse(jmatch[0]);
                const f = tryFindLatLngIn(j);
                if (f) showCoords(f.lat, f.lng, 'xhr');
              } catch (e) {}
            }
          }
        } catch (e) { /* ignore */ }
      });
      return origSend.apply(this, arguments);
    };
  }

  // --- 3) WebSocket hook (deneme) ---
  function hookWebSocket() {
    try {
      const OrigWS = window.WebSocket;
      function WrappedWS(url, protocols) {
        const ws = protocols ? new OrigWS(url, protocols) : new OrigWS(url);
        const origOnMessage = ws.onmessage;
        ws.addEventListener('message', function (ev) {
          try {
            const data = ev.data;
            if (typeof data === 'string' && /"lat"|"latitude"/i.test(data)) {
              const mm = data.match(/\{[\s\S]*"lat"[\s\S]*?\}/);
              if (mm) {
                try {
                  const j = JSON.parse(mm[0]);
                  const f = tryFindLatLngIn(j);
                  if (f) showCoords(f.lat, f.lng, 'websocket');
                } catch (e) {}
              }
            }
          } catch (e) {}
          if (origOnMessage) origOnMessage.call(ws, ev);
        });
        return ws;
      }
      WrappedWS.prototype = OrigWS.prototype;
      window.WebSocket = WrappedWS;
    } catch (e) {
      console.warn(`${LOG_TAG} WebSocket hook failed`, e);
    }
  }

  // --- 4) Sayfa yüklendikten sonra probeler ---
  function afterLoadProbes() {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (probeGlobals()) { clearInterval(iv); return; }
      if (tries > 20) clearInterval(iv);
    }, 500);
  }

  // Başlat
  try {
    hookNetwork();
    hookWebSocket();

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      afterLoadProbes();
    } else {
      window.addEventListener('DOMContentLoaded', afterLoadProbes, { once: true });
      window.addEventListener('load', afterLoadProbes, { once: true });
    }

    window.__shea_probe_now = function() {
      probeGlobals();
      console.info(`${LOG_TAG} manual probe triggered`);
    };

  } catch (e) {
    console.error(`${LOG_TAG} init error`, e);
  }

})();
