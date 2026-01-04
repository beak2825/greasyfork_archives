// ==UserScript==
// @name         JQLM Client Checker
// @namespace    jqlm
// @version      0.1.0
// @license      MIT-Please do not modify yourself, contact thesilwar with any problems on junque.org
// @description  Client-side link checks for JQ Link Manager (Flarum)
// @match        http://flarum-test.test/*
// @match        https://flarum-test.test/*
// @match        http://flarum-local.test/*
// @match        https://flarum-local.test//*
// @match        https://junque.org/*
// @match        http://junque.org/*
// @grant        GM_xmlhttpRequest
// @connect      uploadgig.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561176/JQLM%20Client%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/561176/JQLM%20Client%20Checker.meta.js
// ==/UserScript==

(function () {
  const ORIGIN = location.origin;
  const PING = 'JQLM_PING';
  const PONG = 'JQLM_PONG';
  const REQ  = 'JQLM_CHECK_REQUEST';
  const RES  = 'JQLM_CHECK_RESPONSE';

  // Reply to PING so the forum knows we're installed
  window.addEventListener('message', function onMsg(ev) {
    if (ev.origin !== ORIGIN || !ev.data || typeof ev.data !== 'object') return;

    // 1) Handshake
    if (ev.data.type === PING) {
      window.postMessage({ type: PONG }, ORIGIN);
      return;
    }

    // 2) Check request
    if (ev.data.type === REQ) {
      const { requestId, urls, host, patterns, batchSize = 4, batchDelayMs = 6000 } = ev.data || {};
      if (!requestId || !Array.isArray(urls) || !urls.length) return;

      // Only allow the declared host (protect against abuse)
      function hostOf(u) { try { return new URL(u).host.replace(/^www\./i, '').toLowerCase(); } catch { return ''; } }
      const allowedHost = String(host || '').toLowerCase();
      const list = urls.filter(u => hostOf(u) === allowedHost);

      // Compile regexes from forum-provided patterns
      const rx = {
        alive:        safeReg(patterns?.alive),
        dead:         safeReg(patterns?.dead),
        premium:      safeReg(patterns?.premium),
        unavailable:  safeReg(patterns?.unavailable),
      };

      runBatches(list, batchSize, batchDelayMs, rx, allowedHost)
        .then((results) => {
          window.postMessage({ type: RES, requestId, results }, ORIGIN);
        })
        .catch(() => {
          window.postMessage({ type: RES, requestId, results: [] }, ORIGIN);
        });
    }
  });

  function safeReg(source) {
    try { return source ? new RegExp(source, 'i') : null; } catch { return null; }
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runBatches(urls, batchSize, batchDelayMs, rx, host) {
    const out = [];
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(u => checkOne(u, rx)));
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

  function gmFetch(url, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      let done = false;
      const t = setTimeout(() => {
        if (!done) { done = true; reject(new Error('timeout')); }
      }, timeoutMs);

      GM_xmlhttpRequest({
        method: 'GET',
        url,
        // send credentials (cookies) if needed; UploadGig often needs them for rate limiting/captchas
        // set to true to include cookies; leave false if you want strictly anonymous
        // NOTE: some engines ignore this flag. Adjust per needs.
        // anonymous: false,
        onload: (res) => { if (done) return; done = true; clearTimeout(t); resolve(res); },
        onerror: (err) => { if (done) return; done = true; clearTimeout(t); reject(err); },
        ontimeout: () => { if (done) return; done = true; clearTimeout(t); reject(new Error('timeout')); },
      });
    });
  }

  async function checkOne(url, rx) {
    let status = 0, text = '';
    try {
      const res = await gmFetch(url, 30000);
      status = res.status || 0;
      text = String(res.responseText || '');
    } catch (e) {
      return { url, key: 'unavailable', status: 0 };
    }

    const body = text || '';
    // Priority: explicit errors first, then premium, then alive
    if (rx.dead && rx.dead.test(body))          return { url, key: 'dead', status };
    if (rx.unavailable && rx.unavailable.test(body)) return { url, key: 'unavailable', status };
    if (rx.premium && rx.premium.test(body))    return { url, key: 'premium', status };
    if (rx.alive && rx.alive.test(body))        return { url, key: 'alive', status };

    // Heuristics: basic 404 or “file not found” in title can be treated as dead
    if (/404\s*(?:file)?\s*not\s*found/i.test(body)) return { url, key: 'dead', status };

    return { url, key: 'unknown', status };
  }
})();
