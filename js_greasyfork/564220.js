// ==UserScript==
// @name         Automatic space between Chinese and English
// @namespace    Like https://github.com/vinta/pangu.js
// @version      1.0.0
// @description  Inject CSS before the DOM is loaded to force the setting of text-autospace: normal.
// @author       pin
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564220/Automatic%20space%20between%20Chinese%20and%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/564220/Automatic%20space%20between%20Chinese%20and%20English.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            text-autospace: normal !important;
        }
    `;

    const root = document.documentElement || document.head;
    if (root) {
        root.appendChild(style);
    } else {
        const observer = new MutationObserver(() => {
            if (document.documentElement) {
                document.documentElement.appendChild(style);
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }
})();