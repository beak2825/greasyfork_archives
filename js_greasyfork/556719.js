// ==UserScript==
// @name         Duolingo Debug Menu
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/da14ffb8a3d5d7529416127e5761244f.svg
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Enable Duolingo Debug Menu and get Ambassador Preview Features
// @author       apersongithub
// @match       *://*.duolingo.com/*
// @match       *://*.duolingo.cn/*
// @grant        none
// @run-at       document-start
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/556719/Duolingo%20Debug%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/556719/Duolingo%20Debug%20Menu.meta.js
// ==/UserScript==

// WORKS AS OF 2025-11-22

/*
 * Below this is the actual fetch interception and modification logic for Duolingo Max
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TARGET_URL_REGEX = /https?:\/\/(?:[a-zA-Z0-9-]+\.)?duolingo\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?\/\d{4}-\d{2}-\d{2}\/users\/.+/;

  function shouldIntercept(url, method = 'GET') {
    // FILTER 1: Do not intercept POST/PUT/DELETE. Only GET requests load profile data.
    if (method.toUpperCase() !== 'GET') return false;

    const isMatch = TARGET_URL_REGEX.test(url);
    // FILTER 2: Explicitly exclude the shop-items endpoint to prevent the 400 error loop
    if (url.includes('/shop-items')) return false;

    if (isMatch) { try { console.log(`[API Intercept DEBUG] MATCH FOUND for URL: ${url}`); } catch { } }
    return isMatch;
  }

  function modifyJson(jsonText) {
    try {
      const data = JSON.parse(jsonText);

      // --- MODIFICATIONS ---
      // ONLY modifying roles, removed hasPlus/shopItems/trackingProperties
      data.roles = ["admin"];
      // ---------------------

      return JSON.stringify(data);
    } catch (e) {
      return jsonText;
    }
  }

  // fetch Override
  const originalFetch = window.fetch;
  window.fetch = function (resource, options) {
    const url = resource instanceof Request ? resource.url : resource;
    // Detect method to ensure we only intercept GET
    const method = (resource instanceof Request) ? resource.method : (options?.method || 'GET');

    if (shouldIntercept(url, method)) {
      return originalFetch.apply(this, arguments).then(async (response) => {
        const cloned = response.clone();
        const jsonText = await cloned.text();
        const modified = modifyJson(jsonText);
        let hdrs = response.headers;
        try { const obj = {}; response.headers.forEach((v, k) => obj[k] = v); hdrs = obj; } catch { }
        return new Response(modified, { status: response.status, statusText: response.statusText, headers: hdrs });
      }).catch(err => { throw err; });
    }
    return originalFetch.apply(this, arguments);
  };

  // XHR Override
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._method = method; // Store method for the check in .send()
    this._url = url;
    originalXhrOpen.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function () {
    // Check method here as well
    if (shouldIntercept(this._url, this._method)) {
      const originalOnReadyStateChange = this.onreadystatechange;
      const xhr = this;
      this.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
          try {
            const modifiedText = modifyJson(xhr.responseText);
            Object.defineProperty(xhr, 'responseText', { writable: true, value: modifiedText });
            Object.defineProperty(xhr, 'response', { writable: true, value: modifiedText });
          } catch (e) { }
        }
        if (originalOnReadyStateChange) originalOnReadyStateChange.apply(this, arguments);
      };
    }
    originalXhrSend.apply(this, arguments);
  };
})();