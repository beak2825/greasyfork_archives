// ==UserScript==
// @name             Neopets: Disable image dragging
// @namespace        kmtxcxjx
// @version          1.0.0
// @description      Disabled clicking and dragging images on Neopets
// @match            *://*.neopets.com/*
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/554962/Neopets%3A%20Disable%20image%20dragging.user.js
// @updateURL https://update.greasyfork.org/scripts/554962/Neopets%3A%20Disable%20image%20dragging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disables image dragging
    // This happens (accidentally) annoyingly often for me on neopets
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    }, true);
})();