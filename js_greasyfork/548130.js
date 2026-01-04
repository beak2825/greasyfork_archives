// ==UserScript==
// @name         Auto Redirect to Google Translate (Any → English)
// @namespace    https://example.com/
// @version      1.0
// @description  Automatically view all websites via Google Translate (auto → en)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548130/Auto%20Redirect%20to%20Google%20Translate%20%28Any%20%E2%86%92%20English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548130/Auto%20Redirect%20to%20Google%20Translate%20%28Any%20%E2%86%92%20English%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Do not re-translate if already inside Google Translate frame
  if (window.location.hostname.includes("translate.google.")) return;

  // You could add a whitelist if you don’t want *every* site translated.
  // Example: skip English-only domains like .gov, .edu, etc.

  const url = encodeURIComponent(window.location.href);
  const newUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${url}`;

  // Replace current page
  window.location.replace(newUrl);
})();