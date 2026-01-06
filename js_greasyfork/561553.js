// ==UserScript==
// @name         Hypersynergism Loader
// @namespace    https://github.com/Ferlieloi
// @version      1.0
// @description  Loads Hypersynergism mod automatically credits: ahvonenj (github) and Ferlieloi (github)
// @match        https://synergism.cc/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/561553/Hypersynergism%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if ('hypersynergism' in window) {
        alert('Hypersynergism is already loaded on the page, please refresh if you want to reload the mod');
        return;
    }

    const scriptSrc =
        `https://cdn.jsdelivr.net/gh/Ferlieloi/synergism-hypersynergy@latest/release/mod/hypersynergism_release.js?r=${Math.floor(Math.random() * 1000000)}`;

    const script = document.createElement('script');
    script.src = scriptSrc;

    script.onload = function () {
        console.log('[HSMain] Script loaded successfully!');
        window.hypersynergism.init();
    };

    script.onerror = function () {
        console.error('[HSMain] Failed to load the mod!');
    };

    document.head.appendChild(script);
})();