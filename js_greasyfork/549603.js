// ==UserScript==
// @name         Qidian Force Translate (Permanent)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix translation on all Qidian subdomains automatically
// @match        *://*.qidian.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549603/Qidian%20Force%20Translate%20%28Permanent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549603/Qidian%20Force%20Translate%20%28Permanent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixHtml() {
        let html = document.querySelector("html");
        if (html) {
            html.setAttribute("translate", "yes");
            html.removeAttribute("class"); // removes 'notranslate'
            console.log('Qidian translate fix applied.');
        }
    }

    // Delay 3 seconds to let page fully load
    setTimeout(fixHtml, 3000);

    // Watch for dynamic rewrites
    setTimeout(() => {
        new MutationObserver(fixHtml).observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }, 3000);
})();
