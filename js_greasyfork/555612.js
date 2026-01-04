// ==UserScript==
// @name         Redirect Imgur to Rimgo (via Farside)
// @description  Redirect all Imgur pages and direct media to farside.link/rimgo, preserving path/query/hash.
// @version      1.0.1
// @namespace    https://greasyfork.org/users/944996
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @match        *://imgur.com/*
// @match        *://m.imgur.com/*
// @match        *://i.imgur.com/*
// @exclude      *://api.imgur.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/555612/Redirect%20Imgur%20to%20Rimgo%20%28via%20Farside%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555612/Redirect%20Imgur%20to%20Rimgo%20%28via%20Farside%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Avoid loops if someone navigates directly to farside.link/rimgo
  if (location.hostname === 'farside.link' && location.pathname.startsWith('/rimgo')) return;

  // Make sure we're on an Imgur domain
  if (!/(\.|^)imgur\.com$/i.test(location.hostname)) return;

  const destBase = 'https://farside.link/rimgo';
  const path = location.pathname + location.search + location.hash;
  const target = destBase + path;

  if (location.href !== target) {
    // Use replace so the original Imgur URL doesn't remain in history
    location.replace(target);
  }
})();
