// ==UserScript==
// @name         Custom Black/White Cursor (Finger Tracking)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Pixel-perfect black arrow with white outline. Tracks finger/mouse exactly on iPadOS Safari + desktop browsers.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559477/Custom%20BlackWhite%20Cursor%20%28Finger%20Tracking%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559477/Custom%20BlackWhite%20Cursor%20%28Finger%20Tracking%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SIZE = 32; // matches your uploaded cursor proportions

    if (window.__customCursorActive) return;
    window.__customCursorActive = true;

    const style = document.createElement('style');
    style.textContent = `
        html, body {
            cursor: none !important;
        }

        .nn-cursor {
            position: fixed;
            width: ${SIZE}px;
            height: ${SIZE}px;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-2px, -2px); /* aligns tip with real pointer */
        }

        /* White outline (slightly larger arrow behind) */
        .nn-outline {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${SIZE + 3}px 0 0 ${SIZE + 3}px;
            border-color: transparent transparent transparent white;
            left: -2px;
            top: -2px;
        }

        /* Black fill arrow (main shape) */
        .nn-fill {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: ${SIZE}px 0 0 ${SIZE}px;
            border-color: transparent transparent transparent black;
        }

        /* Soft drop shadow like your image */
        .nn-cursor {
            filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.45));
        }
    `;
    document.documentElement.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'nn-cursor';

    const outline = document.createElement('div');
    outline.className = 'nn-outline';

    const fill = document.createElement('div');
    fill.className = 'nn-fill';

    cursor.appendChild(outline);
    cursor.appendChild(fill);
    document.documentElement.appendChild(cursor);

    let x = 0;
    let y = 0;
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
