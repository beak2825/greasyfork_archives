// ==UserScript==
// @name         PenguinMod Roboto Font
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply the Roboto font to PenguinMod websites
// @match        https://penguinmod.com/*
// @match        https://www.penguinmod.com/*
// @match        https://studio.penguinmod.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558281/PenguinMod%20Roboto%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/558281/PenguinMod%20Roboto%20Font.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addRobotoFont() {
        if (document.getElementById('tm-roboto-font')) return;

        const link = document.createElement('link');
        link.id = 'tm-roboto-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
        document.head.appendChild(link);
    }

    function applyRobotoStyle() {
        GM_addStyle(`
            :root, body, body *:not(i):not([class*="icon"]):not([class*="fa-"]) {
                font-family: 'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            }
        `);
    }

    function init() {
        addRobotoFont();
        applyRobotoStyle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
