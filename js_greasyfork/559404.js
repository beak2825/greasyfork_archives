// ==UserScript==
// @name         mobile cursor overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds a visible cursor on mobile/ipad that moves + clicks
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559404/mobile%20cursor%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/559404/mobile%20cursor%20overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create cursor element
    const cursor = document.createElement("div");
    cursor.id = "mobileCursor";
    document.body.appendChild(cursor);

    // Cursor style
    const style = document.createElement("style");
    style.textContent = `
        #mobileCursor {
            position: fixed;
            width: 22px;
            height: 22px;
            border: 2px solid white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999999999;
            transform: translate(-50%, -50%);
            transition: transform 0.05s linear;
        }

        #mobileCursor.click {
            transform: translate(-50%, -50%) scale(1.25);
            border-color: yellow;
        }
    `;
    document.head.appendChild(style);

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // Move cursor with touch
    function moveCursor(x, y) {
        lastX = x;
        lastY = y;
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
    }

    // Touch move
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            moveCursor(t.clientX, t.clientY);
        }
    }, { passive: true });

    // Touch start (click animation)
    window.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            moveCursor(t.clientX, t.clientY);
        }

        cursor.classList.add("click");
        setTimeout(() => cursor.classList.remove("click"), 80);
    }, { passive: true });

})();
