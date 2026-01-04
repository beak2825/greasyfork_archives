// ==UserScript==
// @name         Anti Youtube auto Dub
// @version      2.0
// @license      MIT License
// @author       leli8093
// @description  Get rid of pesky youtube AI dubbing 
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1534909
// @downloadURL https://update.greasyfork.org/scripts/555043/Anti%20Youtube%20auto%20Dub.user.js
// @updateURL https://update.greasyfork.org/scripts/555043/Anti%20Youtube%20auto%20Dub.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Helper: remove audioTrack.isAutoDubbed from any object/array
  function stripIsAutoDubbed(obj) {
    if (!obj || typeof obj !== 'object') return;
    try {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) stripIsAutoDubbed(obj[i]);
        return;
      }
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        // Match path items used by uBlock rule: adaptiveFormats.*[?.audioTrack.isAutoDubbed]
        if (k === 'adaptiveFormats' && Array.isArray(v)) {
          for (const af of v) {
            if (af && af.audioTrack && 'isAutoDubbed' in af.audioTrack) {
              delete af.audioTrack.isAutoDubbed;
            }
          }
        }
        // Recurse
        if (typeof v === 'object') stripIsAutoDubbed(v);
      }
    } catch (e) {
      // fail silently
    }
  }

  // 1) Intercept window.ytInitialPlayerResponse as early as possible.
  // Define a property on window that proxies access and strips flag when set.
  try {
    let initialValue;
    Object.defineProperty(window, 'ytInitialPlayerResponse', {
      configurable: true,
      enumerable: true,
      get() { return initialValue; },
      set(val) {
        try {
          // clone to avoid mutating external references unexpectedly
          const cloned = JSON.parse(JSON.stringify(val));
          stripIsAutoDubbed(cloned);
          initialValue = cloned;
        } catch (e) {
          initialValue = val;
        }
      }
    });
  } catch (e) {
    // fallback: set after load if defineProperty fails
    window.addEventListener('DOMContentLoaded', () => {
      try {
        if (window.ytInitialPlayerResponse) {
          const copy = JSON.parse(JSON.stringify(window.ytInitialPlayerResponse));
          stripIsAutoDubbed(copy);
          window.ytInitialPlayerResponse = copy;
        }
      } catch (e) {}
    }, { once: true });
  }

  // 2) Wrap JSON.parse to scrub inline JSON strings before parse (best-effort).
  // Only touch callers that pass strings containing "adaptiveFormats" to avoid breaking others.
  (function () {
    const origParse = JSON.parse;
    JSON.parse = function (text, reviver) {
      try {
        if (typeof text === 'string' && text.indexOf('adaptiveFormats') !== -1) {
          // Attempt to find and remove "isAutoDubbed":... occurrences before parsing.
          // This is a text-level removal to catch inline JSON prior to parse.
          // Be conservative: only remove the specific key name with boolean/null/number/string.
          text = text.replace(/"isAutoDubbed"\s*:\s*(true|false|null|\d+|"[^"]*")\s*,?/g, '');
          // Also clean up potential leftover trailing commas in objects/arrays.
          text = text.replace(/,\s*([}\]])/g, '$1');
        }
      } catch (e) {}
      return origParse.call(JSON, text, reviver);
    };
  })();

  // 3) Intercept XHR responses: wrap XHR.prototype.open/send and process responseText when ready.
  (function () {
    const XHR = XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (...args) {
      this.__url_for_u_block = args[1] || '';
      return origOpen.apply(this, args);
    };

    XHR.prototype.send = function (...args) {
      // Only attach handler for likely YouTube player endpoints (youtubei, player, get_video_info, etc.)
      const url = this.__url_for_u_block || '';
      const shouldHook = /youtubei|player|get_video_info/i.test(url) || /\/youtubei\//i.test(url);

      if (shouldHook) {
        this.addEventListener('readystatechange', function () {
          try {
            if (this.readyState === 4 && this.responseType === '' /* default: responseText available */) {
              let txt = this.responseText;
              if (typeof txt === 'string' && txt.indexOf('adaptiveFormats') !== -1) {
                // Remove isAutoDubbed occurrences in the JSON text
                txt = txt.replace(/"isAutoDubbed"\s*:\s*(true|false|null|\d+|"[^"]*")\s*,?/g, '');
                txt = txt.replace(/,\s*([}\]])/g, '$1');
                // Try to redefine responseText via getter (non-standard): not possible on native XHR,
                // but we can try to set response via overriding property on this instance.
                try {
                  Object.defineProperty(this, 'responseText', { value: txt, configurable: true });
                } catch (e) {
                  // If not allowed, try to set response / responseURL etc. otherwise leave as-is.
                }
                // Also try to update JSON-parsed piece if page stored it on assignment hooks
                try {
                  const parsed = JSON.parse(txt);
                  stripIsAutoDubbed(parsed);
                } catch (e) {}
              }
            }
          } catch (e) {}
        }, false);
      }

      return origSend.apply(this, args);
    };
  })();

  // 4) Intercept fetch responses
  (function () {
    const origFetch = window.fetch;
    window.fetch = function (input, init) {
      // Call original fetch and then examine response bodies for JSON containing adaptiveFormats
      return origFetch.call(this, input, init).then(async (response) => {
        try {
          const contentType = response.headers.get && response.headers.get('content-type') || '';
          const url = (typeof input === 'string') ? input : (input && input.url) || '';
          const shouldHook = /youtubei|player|get_video_info/i.test(url) || contentType.indexOf('application/json') !== -1;

          if (!shouldHook) return response;

          // Clone response so we can read body without consuming original stream
          const clone = response.clone();
          const text = await clone.text().catch(() => null);
          if (typeof text === 'string' && text.indexOf('adaptiveFormats') !== -1) {
            let newText = text.replace(/"isAutoDubbed"\s*:\s*(true|false|null|\d+|"[^"]*")\s*,?/g, '');
            newText = newText.replace(/,\s*([}\]])/g, '$1');

            // Try to create a new Response with same headers/status
            const newBody = newText;
            const headers = new Headers(response.headers);
            // ensure correct content-length isn't required
            const newResponse = new Response(newBody, {
              status: response.status,
              statusText: response.statusText,
              headers: headers
            });
            return newResponse;
          }
        } catch (e) {
          // ignore and return original
        }
        return response;
      });
    };
  })();

  // 5) Defensive: if any global playerResponse-like objects are created later, scrub them.
  // Known keys: ytInitialPlayerResponse, ytcfg player, etc. This periodically scans common globals.
  (function periodicScrub() {
    const keys = ['ytInitialPlayerResponse', 'ytplayer', 'ytcfg'];
    setInterval(() => {
      try {
        for (const k of keys) {
          const v = window[k];
          if (v) {
            try {
              const copy = JSON.parse(JSON.stringify(v));
              stripIsAutoDubbed(copy);
              window[k] = copy;
            } catch (e) {}
          }
        }
      } catch (e) {}
    }, 1500);
  })();

})();
