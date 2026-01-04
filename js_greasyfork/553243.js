// ==UserScript==
// @name         Patreon Exact Post Date
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds the exact time of post publication after aproximate time on post page
// @author       MWPSBCID
// @match        https://www.patreon.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553243/Patreon%20Exact%20Post%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/553243/Patreon%20Exact%20Post%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var data = 0;

    const ldJsonScript = document.querySelector('script[type="application/ld+json"]');
    if (ldJsonScript) {
        try {
            data = JSON.parse(ldJsonScript.textContent);
            console.log(data);
        } catch (e) {
            console.error('Invalid JSON-LD:', e);
        }
    }

    var postDate = new Date(data.datePublished);

    const innerSpan = document.querySelector('#track-click p span');

    if (innerSpan) {
        const newSpan = document.createElement('span');
        newSpan.textContent = ", " + postDate.toLocaleString('de-DE');

        innerSpan.insertAdjacentElement('afterend', newSpan);
    }

    // Your code here...
})();