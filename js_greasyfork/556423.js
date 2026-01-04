// ==UserScript==
// @name         Arras Auto Respawn (Presses Enter on strokeText)
// @namespace    autorespawnEnterStroke
// @description  chatgpt script
// @version      1.0
// @match        *://arras.io/*
// @match        *://arras.glitch.me/*
// @match        *://*arras*/*
// @grant        none
// @license      dont steal
// @downloadURL https://update.greasyfork.org/scripts/556423/Arras%20Auto%20Respawn%20%28Presses%20Enter%20on%20strokeText%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556423/Arras%20Auto%20Respawn%20%28Presses%20Enter%20on%20strokeText%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;

    // Function to simulate the Enter key
    function pressEnter() {
        const ev1 = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        const ev2 = new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
        });

        document.dispatchEvent(ev1);
        document.dispatchEvent(ev2);

        console.log("[AutoRespawn] Simulated ENTER key press.");
    }

    // Patch strokeText
    CanvasRenderingContext2D.prototype.strokeText = function(text, ...rest) {

        if (typeof text === "string") {
            const lower = text.trim().toLowerCase();

            // Detect the Respawn button text being drawn
            if (lower === "respawn") {
                console.log("[AutoRespawn] Respawn text detected — pressing Enter.");

                // Press Enter immediately and again shortly after
                pressEnter();
                setTimeout(pressEnter, 50);
                setTimeout(pressEnter, 150);
            }
        }

        return origStrokeText.call(this, text, ...rest);
    };

})();
