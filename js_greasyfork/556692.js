// ==UserScript==
// @name         HakushinScreenShotReady
// @icon         https://hakush.in/favicon.ico
// @namespace    https://github.com/lucisurbe/js
// @version      8
// @description  Remove all unnecessary elements for poster screenshots in Hakush.in.
// @author       LucisUrbe
// @grant        GM_addStyle
// @run-at       document-idle
// @match        *://*.hakush.in/character/*
// @match        *://*.hakush.in/char/*
// @match        *://*.hakush.in/weapon/*
// @match        *://*.hakush.in/lightcone/*
// @match        *://*.hakush.in/bangboo/*
// @match        *://*.hakush.in/diff*
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/556692/HakushinScreenShotReady.user.js
// @updateURL https://update.greasyfork.org/scripts/556692/HakushinScreenShotReady.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        GM_addStyle(`
            html {
                background-color: #111111 !important;
            }
            .bg-hakushin-900 {
                background: #111111 !important;
            }
        `);
        const realContent = document.querySelector('div.max-w-5xl > div');
        realContent.id = 'realContent';
        const realFooter = document.querySelector('footer');
        realFooter.id = 'realFooter';
        const body = document.querySelector('body');
        body.insertBefore(realFooter, body.firstElementChild);
        body.insertBefore(realContent, body.firstElementChild);
        body.childNodes.forEach((e) => {
            if (e.id != 'realContent' && e.id != 'realFooter') e.remove();
        });
    }, 5500);
})();
