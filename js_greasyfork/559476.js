// ==UserScript==
// @name         Windows 7 Style Overlay Cursor (iPad + Desktop)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Windows 7-style cursor overlay that follows your finger/mouse exactly. Works on iPadOS Safari + desktop browsers.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559476/Windows%207%20Style%20Overlay%20Cursor%20%28iPad%20%2B%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559476/Windows%207%20Style%20Overlay%20Cursor%20%28iPad%20%2B%20Desktop%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CURSOR_SIZE = 28; // Windows 7 arrow size

    if (window.__win7CursorOverlayActive) return;
    window.__win7CursorOverlayActive = true;

    const style = document.createElement('style');
    style.textContent = `
        html, body {
            cursor: none !important;
        }

        .win7-cursor-overlay {
            position: fixed;
            width: ${CURSOR_SIZE}px;
            height: ${CURSOR_SIZE}px;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-2px, -2px); /* aligns tip with real pointer */
            filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.45));
        }

        /* White fill arrow */
        .win7-cursor-fill {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE}px 0 0 ${CURSOR_SIZE}px;
            border-color: transparent transparent transparent white;
        }

        /* Black outline behind it */
        .win7-cursor-outline {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${CURSOR_SIZE + 2}px 0 0 ${CURSOR_SIZE + 2}px;
            border-color: transparent transparent transparent black;
            left: -1px;
            top: -1px;
        }
    `;
    document.documentElement.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'win7-cursor-overlay';

    const outline = document.createElement('div');
    outline.className = 'win7-cursor-outline';

    const fill = document.createElement('div');
    fill.className = 'win7-cursor-fill';

    cursor.appendChild(outline);
    cursor.appendChild(fill);
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
        if (e.pointerType === 'touch') return; // ignore touch taps
        x = e.clientX;
        y = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });
})();
