// ==UserScript==
// @name         Mac-style Overlay Cursor (CSS Arrow, Finger-Aligned)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.1
// @description  Overlay a Mac-style cursor (black fill, white border) that follows your finger/mouse exactly. Works on iPadOS Safari and desktop.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559475/Mac-style%20Overlay%20Cursor%20%28CSS%20Arrow%2C%20Finger-Aligned%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559475/Mac-style%20Overlay%20Cursor%20%28CSS%20Arrow%2C%20Finger-Aligned%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CURSOR_SIZE = 28;

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
            transform: translate(-1px, -1px); /* ← tip of arrow matches pointer */
        }

        .mac-cursor-shape {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE}px 0 0 ${CURSOR_SIZE}px;
            border-color: transparent transparent transparent black;
        }

        .mac-cursor-outline {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE + 2}px 0 0 ${CURSOR_SIZE + 2}px;
            border-color: transparent transparent transparent white;
            left: -1px;
            top: -1px;
        }

        .mac-cursor-overlay {
            filter: drop-shadow(2px 2px 1px rgba(0,0,0,0.45));
        }
    `;
    document.documentElement.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'mac-cursor-overlay';

    const outline = document.createElement('div');
    outline.className = 'mac-cursor-outline';

    const arrow = document.createElement('div');
    arrow.className = 'mac-cursor-shape';

    cursor.appendChild(outline);
    cursor.appendChild(arrow);
    document.documentElement.appendChild(cursor);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = null;

    function update() {
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
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
