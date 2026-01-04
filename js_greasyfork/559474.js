// ==UserScript==
// @name         Mac-style Overlay Cursor (CSS Arrow, iPad/Desktop)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Overlay a Mac-style cursor (black fill, white border) that follows the real cursor and hides the system cursor. Works on iPadOS Safari (Userscripts) and desktop browsers.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559474/Mac-style%20Overlay%20Cursor%20%28CSS%20Arrow%2C%20iPadDesktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559474/Mac-style%20Overlay%20Cursor%20%28CSS%20Arrow%2C%20iPadDesktop%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Approx size of the arrow in your image
    const CURSOR_SIZE = 28; // tweak if you want it a bit bigger/smaller

    // Prevent double-injection
    if (window.__macCursorOverlayActive) return;
    window.__macCursorOverlayActive = true;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            cursor: none !important;
        }

        .mac-cursor-overlay {
            position: fixed;
            width: ${CURSOR_SIZE}px;
            height: ${CURSOR_SIZE}px;
            pointer-events: none;
            z-index: 999999;
            /* Adjust so the tip of the arrow sits on the real pointer */
            transform: translate(-3px, -2px);
        }

        /* Base arrow shape: black fill using CSS borders */
        .mac-cursor-shape {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE}px 0 0 ${CURSOR_SIZE}px;
            border-color: transparent transparent transparent black;
        }

        /* White outline using a slightly bigger arrow behind (like a border) */
        .mac-cursor-outline {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE + 2}px 0 0 ${CURSOR_SIZE + 2}px;
            border-color: transparent transparent transparent white;
            /* Put it behind the black arrow */
            left: -1px;
            top: -1px;
        }

        /* Soft drop shadow under the whole cursor */
        .mac-cursor-overlay {
            filter:
                drop-shadow(2px 2px 1px rgba(0,0,0,0.45));
        }
    `;
    document.documentElement.appendChild(style);

    // Build cursor DOM
    const cursor = document.createElement('div');
    cursor.className = 'mac-cursor-overlay';

    const outline = document.createElement('div');
    outline.className = 'mac-cursor-outline';

    const arrow = document.createElement('div');
    arrow.className = 'mac-cursor-shape';

    cursor.appendChild(outline);
    cursor.appendChild(arrow);
    document.documentElement.appendChild(cursor);

    // Position logic
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = null;

    function update() {
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        raf = null;
    }

    function move(e) {
        // Ignore pure touch gestures; we only want mouse/pencil/trackpad style pointers
        if (e.pointerType === 'touch') return;
        x = e.clientX;
        y = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });
})();
