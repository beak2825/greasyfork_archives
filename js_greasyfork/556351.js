// ==UserScript==
// @name         Chess.com Atomic – Hide Captured Pieces Boxes
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes captured pieces boxes on chess.com atomic variants
// @match        https://www.chess.com/variants/atomic/game*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/556351/Chesscom%20Atomic%20%E2%80%93%20Hide%20Captured%20Pieces%20Boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/556351/Chesscom%20Atomic%20%E2%80%93%20Hide%20Captured%20Pieces%20Boxes.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const removeTargets = () => {
        // Remove all captured piece components (top & bottom)
        document.querySelectorAll(".captured-pieces-component.playerbox-captured-pieces")
            .forEach(el => el.remove());

        // Remove the inner first child if it exists
        document.querySelectorAll(".captured-pieces-component.playerbox-captured-pieces > div:first-child")
            .forEach(el => el.remove());
    };

    // Initial removal
    removeTargets();

    // Keep removing as page updates
    const obs = new MutationObserver(() => removeTargets());
    obs.observe(document.documentElement, { childList: true, subtree: true });
})();
