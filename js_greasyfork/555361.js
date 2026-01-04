// ==UserScript==
// @name        Show DNS Settings (TIM H388X)
// @namespace   https://github.com/lewiwiii
// @match       http://192.168.1.1/*
// @version     1.0
// @author      wiwi
// @grant       none
// @license     MIT
// @description 11/10/2025, 12:00:00 AM
// @downloadURL https://update.greasyfork.org/scripts/555361/Show%20DNS%20Settings%20%28TIM%20H388X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555361/Show%20DNS%20Settings%20%28TIM%20H388X%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const TARGET_IDS = ['div_DNSServer1', 'div_DNSServer2'];
    function ensureVisibility() {
        for (const id of TARGET_IDS) {
            const element = document.getElementById(id);
            if (element && element.style.display === 'none') {
                element.style.display = '';
            }
        }
        const dnsServer1 = document.getElementById(TARGET_IDS[0]);
        if (dnsServer1) {
            const parentContainer = dnsServer1.parentElement;
            if (parentContainer && parentContainer.children.length > 0) {
                const anonymousDiv = parentContainer.children[0];
                if (anonymousDiv.classList.contains('row') && anonymousDiv.style.display === 'none') {
                    anonymousDiv.style.display = '';
                }
            }
        }
    }
    const visibilityChecker = setInterval(ensureVisibility, 20);
    setTimeout(() => {
        clearInterval(visibilityChecker);
    }, 300000);
})();