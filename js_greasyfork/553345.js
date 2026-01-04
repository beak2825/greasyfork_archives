// ==UserScript==
// @name         Ocultar Submenu Interno Reproductor Youtube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Oculta permanentemente el menu interno del reproductor de youtube 22_10_2025.
// @author       Tolimes
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553345/Ocultar%20Submenu%20Interno%20Reproductor%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/553345/Ocultar%20Submenu%20Interno%20Reproductor%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCSS = `
        /* Regla */
.ytPlayerQuickActionButtonsHostDisableBackdropFilter:not(:empty) {
    display: none;
}
    `;

    // Inyectar el CSS
    GM_addStyle(customCSS);
})();