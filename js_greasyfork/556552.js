// ==UserScript==
// @name         lookmovie2.to — Premium overlay - show CLOSE & BACK
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Shows CLOSE and BACK buttons in "Premium overlay"
// @license MIT
// @match        https://www.lookmovie2.to/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556552/lookmovie2to%20%E2%80%94%20Premium%20overlay%20-%20show%20CLOSE%20%20BACK.user.js
// @updateURL https://update.greasyfork.org/scripts/556552/lookmovie2to%20%E2%80%94%20Premium%20overlay%20-%20show%20CLOSE%20%20BACK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_CLASSES = [
        "pre-init-ads--close",
        "pre-init-ads--back-button"
    ];

    function unhideAll() {
        for (const cls of TARGET_CLASSES) {
            const el = document.querySelector("." + cls);
            if (el && el.classList.contains("tw-hidden")) {
                el.classList.remove("tw-hidden");
            }
        }
    }

    const obs = new MutationObserver(() => unhideAll());
    obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true });

    const interval = setInterval(unhideAll, 150);

    setTimeout(() => clearInterval(interval), 10000);

    document.addEventListener("DOMContentLoaded", unhideAll);
})();
