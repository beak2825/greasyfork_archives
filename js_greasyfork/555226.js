// ==UserScript==
// @name         Reddit Auto Expand Replies v2
// @namespace    reddit.auto.expand
// @version      2
// @description  Auto-clicks "show replies" buttons on Reddit, including dynamically loaded content.
// @match        *://reddit.com/*
// @match        *://www.reddit.com/*
// @match        *://old.reddit.com/*
// @grant        none
// @run-at       document-idle
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/555226/Reddit%20Auto%20Expand%20Replies%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/555226/Reddit%20Auto%20Expand%20Replies%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Click all show replies buttons
    const expand = () => document.querySelectorAll('.showreplies').forEach(btn => btn.click());

    // Initial expansion
    expand();

    // Watch for dynamically loaded content (infinite scroll, lazy loading)
    new MutationObserver(expand).observe(document.body, { childList: true, subtree: true });
})();