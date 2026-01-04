// ==UserScript==
// @name         Disable History Manipulation
// @namespace    RGlzYWJsZSBIaXN0b3J5IE1hbmlwdWxhdGlvbg
// @version      1.0
// @description  Disable history.pushState() and history.replaceState() on all sites
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/dhm10.png
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558941/Disable%20History%20Manipulation.user.js
// @updateURL https://update.greasyfork.org/scripts/558941/Disable%20History%20Manipulation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override pushState
    history.pushState = function() {
        console.warn("Blocked history.pushState");
    };

    // Override replaceState
    history.replaceState = function() {
        console.warn("Blocked history.replaceState");
    };
})();
