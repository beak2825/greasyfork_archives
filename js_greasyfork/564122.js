// ==UserScript==
// @name         GeoGuessr Profile Viewer
// @description  You can see whatever you want
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       yuri - @2yuri
// @icon         https://www.geoguessr.com/favicon.ico
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564122/GeoGuessr%20Profile%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/564122/GeoGuessr%20Profile%20Viewer.meta.js
// ==/UserScript==

(function () {
  const WIDGETS = [3, 6, 4, 1, 5, 8, 12, 11, 13, 14];

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const res = await originalFetch.apply(this, args);

    try {
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url;

      const isUserJson =
        url &&
        url.includes("/_next/data/") &&
        /\/user\/[^/]+\.json(\?|$)/.test(url);

      if (!isUserJson) return res;

      const cloned = res.clone();
      const data = await cloned.json();

      data.pageProps ??= {};
      data.pageProps.userProfile ??= {};
      data.pageProps.userProfile.config ??= {};

      data.pageProps.userProfile.config.widgets = WIDGETS.slice();

      return new Response(JSON.stringify(data), {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    } catch (err) {
      return res;
    }

    return res;
  };
})();

