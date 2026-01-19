// ==UserScript==
// @name         Minimalist Crimes
// @namespace    Scythe.Torn
// @version      1.0
// @description  Hides crime outcome text and reward containers
// @author       Scythe [2045424]
// @match        *.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563260/Minimalist%20Crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/563260/Minimalist%20Crimes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS = `
        [class*="outcomeWrapper___"],
        [class*="outcomeReward___"] {
            display: none !important;
        }
    `;

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = CSS;
        (document.head || document.documentElement).appendChild(style);
    };

    injectStyles();
})();