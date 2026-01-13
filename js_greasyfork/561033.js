// ==UserScript==
// @name         Alpertron ECM - Disable Auto-Scroll to Results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents automatic scrolling to the results area on Alpertron's ECM factorization page.
// @author       M-K-Al
// @match        www.alpertron.com.ar
// @include      .*alpertron.*/*
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561033/Alpertron%20ECM%20-%20Disable%20Auto-Scroll%20to%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/561033/Alpertron%20ECM%20-%20Disable%20Auto-Scroll%20to%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.scrollIntoView = function() {
            // Do nothing to prevent automatic scrolling
            return;
        };
    }
})();