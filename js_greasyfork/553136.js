// ==UserScript==
// @name         Neopets — Tubular Kiko Racing Fix
// @namespace    neopets.com
// @version      1.0.0
// @author       SirStroman
// @license      MIT
// @description  Fix CORS loading errors for Kiko Lake Racing map tiles by intercepting fetch() and refetching via GM_xmlhttpRequest with credentials
// @match        https://www.neopets.com/games/game.phtml?game_id=606*
// @match        https://www.neopets.com/games/play_flash.phtml?va=&game_id=606*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      swf.neopets.com
// @downloadURL https://update.greasyfork.org/scripts/553136/Neopets%20%E2%80%94%20Tubular%20Kiko%20Racing%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/553136/Neopets%20%E2%80%94%20Tubular%20Kiko%20Racing%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const MAP_RE = /^https:\/\/swf\.neopets\.com\/games\/kikolakeracing\/map0(0_0[0-4]|1_0[0-8]|2_(?:0[0-9]|1[0-5]))\.jpg$/i;
  const BRIDGE_TAG = 'KIKO_BRIDGE_v150';

  const script = document.createElement('script');
  script.textContent = `(() => {
    const TAG = ${JSON.stringify(BRIDGE_TAG)};
    const ORIGIN = ${JSON.stringify(location.origin)};
    const MAP_RE = ${MAP_RE};
    const nativeFetch = window.fetch.bind(window);
    let seq = 0;
    const pending = new Map();
    function nextId(){ return TAG + ':' + (++seq) + ':' + Math.random().toString(36).slice(2); }
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.__kiko !== TAG || d.dir !== 'resp') return;
      const entry = pending.get(d.id);
      if (!entry) return;
      if (d.ok) {
        const headers = new Headers(d.headers || {});
        if (!headers.has('Content-Type')) headers.set('Content-Type','image/jpeg');
        const body = d.buffer ? new Uint8Array(d.buffer) : undefined;
        entry.resolve(new Response(body ? new Blob([body], { type: headers.get('Content-Type') }) : null, {
          status: d.status || 200,
          statusText: d.statusText || '',
          headers
        }));
      } else {
        entry.reject(new TypeError(d.error || 'GM bridge error'));
      }
      pending.delete(d.id);
    });
    function hookedFetch(input, init) {
      try {
        const req = input instanceof Request ? input : new Request(String(input), init);
        const url = req.url;
        if (!MAP_RE.test(url)) return nativeFetch(input, init);
        const id = nextId();
        return new Promise((resolve, reject) => {
          pending.set(id, { resolve, reject });
          const hdrObj = {};
          try { req.headers.forEach((v,k)=>{ hdrObj[k] = v; }); } catch(e){}
          window.postMessage({
            __kiko: TAG,
            dir: 'req',
            id,
            url,
            method: req.method || 'GET',
            headers: hdrObj
          }, ORIGIN);
        });
      } catch (e) {
        return nativeFetch(input, init);
      }
    }
    Object.defineProperty(window, 'fetch', { configurable:true, writable:true, value: hookedFetch });
  })();`;
  document.documentElement.prepend(script);

  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || d.__kiko !== BRIDGE_TAG || d.dir !== 'req') return;
    if (ev.origin !== location.origin) return;
    const { id, url, method, headers } = d;
    const respond = (payload) => {
      window.postMessage({ __kiko: BRIDGE_TAG, dir: 'resp', id, ...payload }, location.origin);
    };
    if (!MAP_RE.test(url)) {
      respond({ ok: false, error: 'URL not allowed' });
      return;
    }
    GM_xmlhttpRequest({
      url,
      method: (method || 'GET').toUpperCase(),
      anonymous: false,
      responseType: 'arraybuffer',
      headers,
      onload: (res) => {
        try {
          const hdrs = {};
          (res.responseHeaders || '').split(/\r?\n/).forEach(line => {
            const i = line.indexOf(':');
            if (i > 0) {
              const k = line.slice(0, i).trim();
              const v = line.slice(i + 1).trim();
              if (k) hdrs[k] = hdrs[k] ? (hdrs[k] + ', ' + v) : v;
            }
          });
          if (!hdrs['Content-Type']) hdrs['Content-Type'] = 'image/jpeg';
          respond({
            ok: true,
            status: res.status || 200,
            statusText: res.statusText || '',
            headers: hdrs,
            buffer: res.response
          });
        } catch (e) {
          respond({ ok: false, error: String(e) });
        }
      },
      onerror: () => respond({ ok: false, error: 'network error' }),
      ontimeout: () => respond({ ok: false, error: 'timeout' })
    });
  }, true);
})();