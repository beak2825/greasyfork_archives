// ==UserScript==
// @name         Linkedin games warp
// @namespace    https://github.com/piotr-ginal
// @version      1.0.0
// @description  Stop time when solving the daily linkedin puzzles
// @author       Piotr Ginał <https://github.com/piotr-ginal>
// @homepageURL  https://github.com/piotr-ginal/linkedin-games-warp
// @supportURL   https://github.com/piotr-ginal/linkedin-games-warp/issues
// @match        https://www.linkedin.com/games/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563230/Linkedin%20games%20warp.user.js
// @updateURL https://update.greasyfork.org/scripts/563230/Linkedin%20games%20warp.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const ROUTES = [
    {
      match: 'voyagerIdentityDashGames',
      transformPayload(payload, context) {
        console.info('[TM rewrite] transformPayload start:', context?.url);

        if (!payload || typeof payload !== 'object') {
          console.info('[TM rewrite] payload is not an object; skipping');
          return payload;
        }

        const record = payload?.variables?.entity?.entity?.gameStoredRecord;
        if (!record || typeof record !== 'object') {
          console.info('[TM rewrite] gameStoredRecord not found; skipping');
          return payload;
        }

        console.info('[TM rewrite] timeElapsed before:', record.timeElapsed);
        record.timeElapsed = 2;
        console.info('[TM rewrite] timeElapsed after:', record.timeElapsed);

        return payload;
      },
    },
    {
      match: 'updateGameState',
      transformPayload(payload, context) {
        console.info('[TM rewrite] transformPayload:', context?.url);

        if (!payload || typeof payload !== 'object') {
          console.info('[TM rewrite] payload not an object; skipping');
          return payload;
        }

        const TARGET_KEY = 'gameBoardTimeElapsed';
        const NEW_VALUE_OBJ = { type: 'bigint', value: '2000' };

        const update = (arr, label) => {
          if (!Array.isArray(arr)) {
            console.info(`[TM rewrite] ${label}: not an array; skipping`);
            return 0;
          }

          let hits = 0;
          for (const item of arr) {
            if (item && typeof item === 'object' && item.key === TARGET_KEY) {
              console.info(`[TM rewrite] ${label}: match found; overwriting value`, {
                before: item.value,
                after: NEW_VALUE_OBJ,
              });

              item.value = { ...NEW_VALUE_OBJ };
              hits++;
            }
          }

          console.info(`[TM rewrite] ${label}: updated ${hits} item(s)`);
          return hits;
        };

        const hits1 = update(payload.states, 'payload.states');
        const hits2 = update(payload?.requestedArguments?.states, 'payload.requestedArguments.states');

        console.info('[TM rewrite] done:', { updated: hits1 + hits2 });
        return payload;
      },
    },
  ];

  function findRoute(url) {
    if (typeof url !== 'string') return null;
    return ROUTES.find(r => url.includes(r.match)) || null;
  }

  function tryParseJson(text) {
    if (typeof text !== 'string') return null;
    const t = text.trim();
    if (!t || (t[0] !== '{' && t[0] !== '[')) return null;

    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }

  const originalFetch = window.fetch;

  window.fetch = async function patchedFetch(input, init) {
    const req = new Request(input, init);
    const url = req.url;
    const method = (req.method || 'GET').toUpperCase();

    const route = findRoute(url);
    if (!route || method === 'GET' || method === 'HEAD') {
      return originalFetch(input, init);
    }

    console.info('[TM rewrite] captured matching fetch:', { url, method, match: route.match });

    const bodyText = await req.clone().text();
    const json = tryParseJson(bodyText);

    if (json === null) {
      console.info('[TM rewrite] fetch body not JSON; skipping rewrite');
      return originalFetch(input, init);
    }

    const rewritten = route.transformPayload(json, { url, transport: 'fetch', method });
    const newBodyText = JSON.stringify(rewritten);

    const newHeaders = new Headers(req.headers);
    newHeaders.set('content-type', 'application/json;charset=UTF-8');

    return originalFetch(new Request(req, { headers: newHeaders, body: newBodyText }));
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function patchedOpen(method, url, async, user, password) {
    this.__tm = {
      method: String(method || 'GET').toUpperCase(),
      url: String(url || ''),
    };
    return originalOpen.call(this, method, url, async, user, password);
  };

  XMLHttpRequest.prototype.send = function patchedSend(body) {
    const meta = this.__tm;
    const url = meta?.url || '';
    const method = meta?.method || 'GET';

    const route = findRoute(url);
    if (!route || method === 'GET' || method === 'HEAD') {
      return originalSend.call(this, body);
    }

    console.info('[TM rewrite] captured matching XHR:', { url, method, match: route.match });

    if (typeof body !== 'string') {
      console.info('[TM rewrite] XHR body is not a string; skipping rewrite');
      return originalSend.call(this, body);
    }

    const json = tryParseJson(body);
    if (json === null) {
      console.info('[TM rewrite] XHR body not JSON; skipping rewrite');
      return originalSend.call(this, body);
    }

    const rewritten = route.transformPayload(json, { url, transport: 'xhr', method });
    const newBodyText = JSON.stringify(rewritten);

    return originalSend.call(this, newBodyText);
  };
})();
