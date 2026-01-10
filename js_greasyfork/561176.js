// ==UserScript==
// @name         JQLM Client Checker (UploadGig + Fikper)
// @license      MIT
// @namespace    jqlm
// @version      0.2.0
// @description  Client-side link checks for JQ Link Manager (Flarum)
// @match        http://flarum-test.test/*
// @match        https://flarum-test.test/*
// @match        http://flarum-local.test/*
// @match        https://flarum-local.test/*
// @match        https://junque.org/*
// @match        http://junque.org/*
// @grant        GM_xmlhttpRequest
// @connect      uploadgig.com
// @connect      sapi.fikper.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561176/JQLM%20Client%20Checker%20%28UploadGig%20%2B%20Fikper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561176/JQLM%20Client%20Checker%20%28UploadGig%20%2B%20Fikper%29.meta.js
// ==/UserScript==

(function () {
  const ORIGIN = location.origin;

  const PING = 'JQLM_PING';
  const PONG = 'JQLM_PONG';
  const REQ  = 'JQLM_CHECK_REQUEST';
  const RES  = 'JQLM_CHECK_RESPONSE';

  // Toggle if you want console logs
  const DEBUG = false;
  const log = (...a) => DEBUG && console.log('[JQLM]', ...a);

  window.addEventListener('message', function onMsg(ev) {
    if (ev.origin !== ORIGIN || !ev.data || typeof ev.data !== 'object') return;

    // 1) Handshake
    if (ev.data.type === PING) {
      window.postMessage({ type: PONG }, ORIGIN);
      return;
    }

    // 2) Check request
    if (ev.data.type === REQ) {
      const {
        requestId,
        urls,
        host,
        patterns,
        batchSize = 4,
        batchDelayMs = 6000,
      } = ev.data || {};

      if (!requestId || !Array.isArray(urls) || !urls.length) return;

      const allowedHost = String(host || '').toLowerCase().replace(/^www\./, '');
      if (!allowedHost) return;

      // Only allow the declared host (protect against abuse)
      const list = urls.filter((u) => hostOf(u) === allowedHost);

      // Compile regexes from forum-provided patterns (UploadGig path uses these)
      const rx = {
        alive:       safeReg(patterns?.alive),
        dead:        safeReg(patterns?.dead),
        premium:     safeReg(patterns?.premium),
        unavailable: safeReg(patterns?.unavailable),
      };

      log('REQ', { requestId, allowedHost, total: urls.length, filtered: list.length });

      runBatches(list, batchSize, batchDelayMs, rx, allowedHost)
        .then((results) => {
          log('RES send', { requestId, count: results.length });
          window.postMessage({ type: RES, requestId, results }, ORIGIN);
        })
        .catch((e) => {
          log('RES error', e);
          window.postMessage({ type: RES, requestId, results: [] }, ORIGIN);
        });
    }
  });

  function hostOf(u) {
    try {
      return new URL(u).host.replace(/^www\./i, '').toLowerCase();
    } catch {
      return '';
    }
  }

  function safeReg(source) {
    try {
      return source ? new RegExp(source, 'i') : null;
    } catch {
      return null;
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runBatches(urls, batchSize, batchDelayMs, rx, host) {
    const out = [];

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map((u) => checkOne(u, rx, host))
      );

      for (const r of results) {
        out.push({
          url: r.url,
          host,
          alive: r.key === 'alive',
          dead: r.key === 'dead',
          premium: r.key === 'premium',
          status: r.status || 0,
          source: 'client',
        });
      }

      if (i + batchSize < urls.length) await sleep(batchDelayMs);
    }

    return out;
  }

  // ---------- UploadGig / default: GET + regex ----------
  function gmFetch(url, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      let done = false;

      const t = setTimeout(() => {
        if (!done) {
          done = true;
          reject(new Error('timeout'));
        }
      }, timeoutMs);

      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
          if (done) return;
          done = true;
          clearTimeout(t);
          resolve(res);
        },
        onerror: (err) => {
          if (done) return;
          done = true;
          clearTimeout(t);
          reject(err);
        },
        ontimeout: () => {
          if (done) return;
          done = true;
          clearTimeout(t);
          reject(new Error('timeout'));
        },
      });
    });
  }

  // ---------- Fikper: POST JSON API ----------
  function gmFetchJson(endpoint, jsonObj, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      let done = false;

      const t = setTimeout(() => {
        if (!done) {
          done = true;
          reject(new Error('timeout'));
        }
      }, timeoutMs);

      GM_xmlhttpRequest({
        method: 'POST',
        url: endpoint,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(jsonObj || {}),
        onload: (res) => {
          if (done) return;
          done = true;
          clearTimeout(t);

          try {
            resolve(JSON.parse(res.responseText || '{}'));
          } catch (e) {
            reject(e);
          }
        },
        onerror: (err) => {
          if (done) return;
          done = true;
          clearTimeout(t);
          reject(err);
        },
        ontimeout: () => {
          if (done) return;
          done = true;
          clearTimeout(t);
          reject(new Error('timeout'));
        },
      });
    });
  }

  function extractFikperId(u) {
    try {
      const url = new URL(u);
      const h = url.host.replace(/^www\./i, '').toLowerCase();
      if (h !== 'fikper.com') return '';

      // /<ID>/something.html
      const m = url.pathname.match(/^\/([A-Za-z0-9]+)(?:\/|$)/);
      return m ? m[1] : '';
    } catch {
      return '';
    }
  }

  // ---------- Main single-check ----------
  async function checkOne(url, rx, host) {
    // --- FIKPER (JSON API) ---
    if (host === 'fikper.com') {
      const id = extractFikperId(url);
      if (!id) return { url, key: 'unknown', status: 0 };

      try {
        const res = await gmFetchJson(
          'https://sapi.fikper.com/',
          { fileHashName: id },
          30000
        );

        // Expected:
        // - alive => object has "name"
        // - dead  => { message: "Not Found" }
        if (res && typeof res === 'object') {
          if (Object.prototype.hasOwnProperty.call(res, 'name')) {
            return { url, key: 'alive', status: 200 };
          }
          if (String(res.message || '') === 'Not Found') {
            return { url, key: 'dead', status: 404 };
          }
        }

        return { url, key: 'unknown', status: 0 };
      } catch {
        return { url, key: 'unavailable', status: 0 };
      }
    }

    // --- DEFAULT (UploadGig etc. GET + regex) ---
    let status = 0;
    let text = '';

    try {
      const res = await gmFetch(url, 30000);
      status = res.status || 0;
      text = String(res.responseText || '');
    } catch {
      return { url, key: 'unavailable', status: 0 };
    }

    const body = text || '';

    // Priority: dead -> unavailable -> premium -> alive
    if (rx.dead && rx.dead.test(body)) return { url, key: 'dead', status };
    if (rx.unavailable && rx.unavailable.test(body)) return { url, key: 'unavailable', status };
    if (rx.premium && rx.premium.test(body)) return { url, key: 'premium', status };
    if (rx.alive && rx.alive.test(body)) return { url, key: 'alive', status };

    // fallback heuristics
    if (/404\s*(?:file)?\s*not\s*found/i.test(body)) return { url, key: 'dead', status };

    return { url, key: 'unknown', status };
  }
})();
