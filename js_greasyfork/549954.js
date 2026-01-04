// ==UserScript==
// @name         translate seyini engelleme seyi
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  gogole'da bi siteye girince otomatik cevirme seyini engelliyo
// @author       dursunator
// @match        *://*.translate.goog/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549954/translate%20seyini%20engelleme%20seyi.user.js
// @updateURL https://update.greasyfork.org/scripts/549954/translate%20seyini%20engelleme%20seyi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    if (location.hostname.includes("translate.goog")) {
        const url = new URL(currentUrl);
        const originalHost = url.hostname
            .replace(".translate.goog", "")
            .replace(/-/g, ".");
        const protocol = "https:";
        const originalPath = url.pathname;
        const originalSearch = url.search;
        const originalUrl = `${protocol}//${originalHost}${originalPath}`;
        window.location.replace(originalUrl);
    }
})();
