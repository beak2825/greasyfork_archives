// ==UserScript==
// @name         Xiaozhan TPO Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the element with the class 'model_mask' on top.zhan.com.
// @author       NF
// @match        *://top.zhan.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554087/Xiaozhan%20TPO%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/554087/Xiaozhan%20TPO%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .model_mask {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();