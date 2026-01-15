// ==UserScript==
// @name         Bato image fix
// @namespace    http://tampermonkey.net/
// @version      2026-01-05
// @description  Fix images not loading on Bato
// @author       steelokupo
// @match        https://bato.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bato.si
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562660/Bato%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562660/Bato%20image%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('//k') && img.src.includes('.mb')) {
                img.referrerPolicy = "no-referrer";
                img.src = img.src.replace('//k', '//n');
            }
        });
    }, 2000);
})();