// ==UserScript==
// @name         YOTI bypass & unblur thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.74
// @description  Have fun! YOTI bypass & unblur thumbnails
// @author       buddhagreasy
// @match        https://*.chaturbate.com/*
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558037/YOTI%20bypass%20%20unblur%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/558037/YOTI%20bypass%20%20unblur%20thumbnails.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(".overlay { display : none !important; }");

    setInterval(() => {

        document.querySelectorAll('[src]').forEach(el => {
            if (el.src.includes('/ribw/')) {
                el.src = el.src.replace('/ribw/', '/riw/');
            }
        });

    }, 2000);}

)();