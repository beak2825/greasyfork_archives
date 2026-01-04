// ==UserScript==
// @name         tijd.be → archive.ph
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically open tijd.be articles in archive.ph
// @match        https://www.tijd.be/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553001/tijdbe%20%E2%86%92%20archiveph.user.js
// @updateURL https://update.greasyfork.org/scripts/553001/tijdbe%20%E2%86%92%20archiveph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    // Safety: Don't run on archive.ph or iframes
    if (window.top !== window.self || url.includes('archive.ph')) return;

    // Skip homepage or broad sections (no article slug)
    // Tijd article URLs usually end in a numeric ID like ".../10631573.html"
    const articlePattern = /\/\d+\.html$/;

    if (articlePattern.test(url)) {
        const archiveURL = 'https://archive.ph/submit/?url=' + encodeURIComponent(url);
        window.location.replace(archiveURL);
    }
})();
