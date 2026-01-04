// ==UserScript==
// @name         Mastodon → Elk.zone redirect
// @namespace    https://elk.zone/
// @version      1.0
// @description  Redirect Mastodon links to elk.zone
// @match        https://*/@*
// @match        https://*/users/*
// @exclude      https://elk.zone/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561154/Mastodon%20%E2%86%92%20Elkzone%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/561154/Mastodon%20%E2%86%92%20Elkzone%20redirect.meta.js
// ==/UserScript==

(function () {
  const host = window.location.host;

  // Skip elk.zone itself
  if (host === "elk.zone") return;

  const path = window.location.pathname;
  const newUrl = `https://elk.zone/${host}${path}${window.location.search}${window.location.hash}`;

  window.location.replace(newUrl);
})();
