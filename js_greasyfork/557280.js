// ==UserScript==
// @name         F1TV Subtitle Lowercase
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  cast subtitle to lowercase
// @author       Vick
// @match        *://f1tv.formula1.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557280/F1TV%20Subtitle%20Lowercase.user.js
// @updateURL https://update.greasyfork.org/scripts/557280/F1TV%20Subtitle%20Lowercase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectCSS() {
        const style = document.createElement('style');

        style.textContent = `
            .bmpui-container-wrapper * {
                text-transform: lowercase !important;
            }
        `;
        document.head.appendChild(style);
    }

    injectCSS();
})();