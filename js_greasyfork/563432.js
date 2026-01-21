// ==UserScript==
// @license MIT
// @name         hubber larper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  no limit to the larp
// @author       You
// @match        *://hubber.cc/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563432/hubber%20larper.user.js
// @updateURL https://update.greasyfork.org/scripts/563432/hubber%20larper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OLD_NAME = "00";
    const NEW_NAME = "0";
    const STAT_1 = "0";
    const STAT_2 = "0";

    function applyOverrides() {
        const usernames = document.querySelectorAll('span.font-medium.hover\\:underline.cursor-pointer');
        usernames.forEach(user => {
            if (user.innerText.trim() === OLD_NAME) {
                user.innerText = NEW_NAME;
            }
        });

        const stat1 = document.querySelector('div.text-sm.font-medium.text-white.truncate');
        if (stat1 && (stat1.innerText === OLD_NAME || stat1.innerText === "00")) {
            stat1.innerText = STAT_1;
        }

        const stat2 = document.querySelector('span.text-sm.text-white.flex-1.truncate.font-medium');
        if (stat2 && (stat2.innerText === OLD_NAME || stat2.innerText === "00")) {
            stat2.innerText = STAT_2;
        }
    }

    const observer = new MutationObserver(() => {
        applyOverrides();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        applyOverrides();
    }
})();