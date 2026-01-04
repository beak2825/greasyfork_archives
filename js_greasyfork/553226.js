// ==UserScript==
// @name         No hackerrank run button
// @namespace    http://tampermonkey.net/
// @version      20251020.06
// @description  Remove the run-code button from hackerrank
// @author       You
// @match        https://www.hackerrank.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackerrank.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553226/No%20hackerrank%20run%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/553226/No%20hackerrank%20run%20button.meta.js
// ==/UserScript==



// ==UserScript==
// @name         No hackerrank run button
// @namespace    http://tampermonkey.net/
// @version      20251020.02
// @description  Remove the run-code button from hackerrank
// @author       You
// @match        https://www.hackerrank.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackerrank.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // Use unsafeWindow for Chrome compatibility
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    
    // Clean up existing observer if any
    if (targetWindow.hrkobserver) {
        targetWindow.hrkobserver.disconnect();
    }
    
    targetWindow.hrkobserver = new MutationObserver(() => {
        const runButtons = document.querySelectorAll('button[data-testid="run-code"]');
        runButtons.forEach(btn => {
            if (btn.style.display !== 'none') {
                btn.style.display = 'none';
            }
        });
    });
    
    targetWindow.hrkobserver.observe(document.body, { childList: true, subtree: true });
    
    // Initial run to catch any buttons already present
    const initialButtons = document.querySelectorAll('button[data-testid="run-code"]');
    initialButtons.forEach(btn => {
        btn.style.display = 'none';
    });
})();