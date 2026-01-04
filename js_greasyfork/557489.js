// ==UserScript==
// @name         Tampermonkey AI Script Maker Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects users to the TamperAI Script Maker when they search "tampermonkey ai script maker" on Google.
// @license      MIT
// @match        *://www.google.com/*
// @match        *://google.com/*
// @match        *://www.google.*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557489/Tampermonkey%20AI%20Script%20Maker%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/557489/Tampermonkey%20AI%20Script%20Maker%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSite = "https://tamperai-pjy4kuxm.manus.space/";

    function checkQuery() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        if (!q) return;

        if (q.toLowerCase().includes("tampermonkey ai script maker")) {
            window.location.href = targetSite;
        }
    }

    checkQuery();

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            checkQuery();
        }
    }).observe(document, { subtree: true, childList: true });
})();