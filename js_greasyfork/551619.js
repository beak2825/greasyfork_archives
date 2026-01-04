// ==UserScript==
// @name         YouTube Anti-AFK
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Click Continue Watching
// @author       Bacon But Pro
// @match        https://www.youtube.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551619/YouTube%20Anti-AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/551619/YouTube%20Anti-AFK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        let btn1 = document.querySelector("button.ytp-autonav-endscreen-cancel-button");
        let btn2 = document.querySelector("ytd-button-renderer#confirm-button button");

        if (btn1) {
            console.log("Anti-AFK: auto click continue button (style 1)");
            btn1.click();
        }
        if (btn2) {
            console.log("Anti-AFK: auto click continue button (style 2)");
            btn2.click();
        }

        let dialog = document.querySelector("yt-confirm-dialog-renderer");
        if (dialog) {
            console.log("Anti-AFK: remove confirm dialog");
            dialog.remove();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("YouTube Anti-AFK loaded!");
})();