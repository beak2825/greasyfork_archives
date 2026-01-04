// ==UserScript==
// @name         Mac-style Overlay Cursor (Black Fill, White Border)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Overlay a Mac-style cursor (black fill, white border) that follows the real cursor and hides the system cursor. Works on iPadOS Safari (Userscripts) and desktop.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559469/Mac-style%20Overlay%20Cursor%20%28Black%20Fill%2C%20White%20Border%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559469/Mac-style%20Overlay%20Cursor%20%28Black%20Fill%2C%20White%20Border%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CURSOR_SIZE = 24;

    if (window.__macCursorOverlayActive) return;
    window.__macCursorOverlayActive = true;

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
            transform: translate(-2px, -1px);
        }

        .mac-cursor-shape {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE}px 0 0 ${CURSOR_SIZE}px;
            border-color: transparent transparent transparent black;
            filter:
                drop-shadow(1px 0 white)
                drop-shadow(0 1px white)
                drop-shadow(-1px 0 white)
                drop-shadow(0 -1px white)
                drop-shadow(2px 2px rgba(0,0,0,0.3));
        }
    `;
    document.documentElement.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'mac-cursor-overlay';

    const arrow = document.createElement('div');
    arrow.className = 'mac-cursor-shape';

    cursor.appendChild(arrow);
    document.documentElement.appendChild(cursor);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = null;

    function update() {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        raf = null;
    }

    function move(e) {
        if (e.pointerType === 'touch') return;
        x = e.clientX;
        y = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });
})();
