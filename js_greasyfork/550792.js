// ==UserScript==
// @name         Torn - Backdrop Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides the backdrop on Torn by applying display:none via CSS
// @author       Neptune
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550792/Torn%20-%20Backdrop%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/550792/Torn%20-%20Backdrop%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .backdrops-container {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();