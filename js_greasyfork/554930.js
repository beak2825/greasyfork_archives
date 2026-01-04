// ==UserScript==
// @name         Remove "Give Admin" - WPlace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the "Give Admin" button from the users list
// @author       Nagol12344
// @license      MIT
// @match        *://wplace.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554930/Remove%20%22Give%20Admin%22%20-%20WPlace.user.js
// @updateURL https://update.greasyfork.org/scripts/554930/Remove%20%22Give%20Admin%22%20-%20WPlace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeGiveAdminButton() {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.trim().toLowerCase() === 'give admin') {
                btn.remove();
            }
        }
    }

    removeGiveAdminButton();

    const observer = new MutationObserver(() => {
        removeGiveAdminButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();