// ==UserScript==
// @name         Fonbet Redirector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přesměruje Fonbet URL na API unblocker
// @author       JV
// @license      MIT
// @match        https://fonbet.com.cy/live/*
// @match        https://fonbet.com.cy/sports/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550758/Fonbet%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/550758/Fonbet%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rozdělit URL cestu podle "/"
    const parts = window.location.pathname.split("/");

    // Najít poslední číselnou část (ID)
    const lastNumericPart = parts.reverse().find(part => /^\d+$/.test(part));

    if (lastNumericPart) {
        const targetUrl = `https://fonbet-api-unblocker.kubecrawling1-tt2.pub.lskube.eu/${lastNumericPart}`;
        window.location.href = targetUrl;
    }
})();
