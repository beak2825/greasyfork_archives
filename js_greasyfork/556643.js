// ==UserScript==
// @name         Chessiro Game Review
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects the Game Review button to Chessiro and changes its text.
// @author       upsetdog
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556643/Chessiro%20Game%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/556643/Chessiro%20Game%20Review.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = '.game-over-review-button-game-over-review-button';

    const observer = new MutationObserver(() => {
        const btn = document.querySelector(selector);
        if (!btn || !btn.href) return;

        try {
            const url = new URL(btn.href);
            url.host = 'chessiro.com';
            btn.href = url.toString();
        } catch (e) {
            console.error('Chessiro script: invalid URL', e);
        }

        btn.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;line-height:1;">
                <span style="font-size:16px;font-weight:600;">Game Review</span>
                <span style="font-size:11px;opacity:0.8;margin-top:2px;">with chessiro</span>
            </div>
        `;

        observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
