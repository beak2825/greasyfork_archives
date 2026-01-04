// ==UserScript==
// @name         WhatsApp Red Check - Priority Enforcer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces --WDS-content-read to red across all elements
// @author       Gemini (cosote)
// @match        https://web.whatsapp.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560683/WhatsApp%20Red%20Check%20-%20Priority%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/560683/WhatsApp%20Red%20Check%20-%20Priority%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function injects a style sheet that is "more specific" than WhatsApp's
    if (document.getElementById('tm-force-red')) return;

    const style = document.createElement('style');
    style.id = 'tm-force-red';
    style.innerHTML = `
            /* Universal override for the variable */
            * {
                --WDS-content-read: #FF0000 !important;
            }
        `;
    document.head.appendChild(style);
})();