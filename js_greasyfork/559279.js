// ==UserScript==
// @name         TikTok mod
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fix centering, add 2x
// @author       you
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559279/TikTok%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/559279/TikTok%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject custom CSS to hide elements + fix centering
    GM_addStyle(`
        /* Hide feed navigation arrows (both known variants) */
        div.css-6fqno5-5e6d46e3--DivFeedNavigationContainer.e87f1nv0,
        div.css-xozjmp-7937d88b--DivFeedNavigationContainer.e87f1nv0 {
            display: none !important;
        }

        /* Remove reserved space for feed nav buttons */
        #column-list-container {
            --feed-nav-button-width: 0px !important;
        }
    `);

    const SPEED = 2.0;   // fast-forward speed
    const NORMAL = 1.0;  // normal speed
    const EDGE_SIZE = 100; // px from screen edge that counts as "holding"

    function setSpeed(rate) {
        document.querySelectorAll("video").forEach(v => {
            v.playbackRate = rate;
        });
    }

    let holding = false;

    function checkEdge(e) {
        const x = e.clientX;
        return x < EDGE_SIZE || x > window.innerWidth - EDGE_SIZE;
    }

    document.addEventListener("mousedown", (e) => {
        if (checkEdge(e)) {
            holding = true;
            setSpeed(SPEED);
        }
    });

    document.addEventListener("mouseup", () => {
        if (holding) {
            holding = false;
            setSpeed(NORMAL);
        }
    });

    // Touch support (trackpads / touchscreen)
    document.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        if (checkEdge(touch)) {
            holding = true;
            setSpeed(SPEED);
        }
    });

    document.addEventListener("touchend", () => {
        if (holding) {
            holding = false;
            setSpeed(NORMAL);
        }
    });

    // Keyboard shortcut: T = toggle comments
document.addEventListener("keydown", (e) => {
    // Ignore typing / editable contexts
    if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
    ) return;

    if (e.key.toLowerCase() === "t") {
        const commentBtn = document.querySelector(
            'button[aria-label*="Read or add comments" i]'
        );

        if (commentBtn) {
            commentBtn.click();
        }
    }
});


})();
