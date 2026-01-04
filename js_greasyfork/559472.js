// ==UserScript==
// @name         Mac-style Overlay Cursor (PNG, 32x32)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Overlay a Mac-style cursor (black arrow with white outline) using PNG. Hides system cursor. Works on iPadOS Safari and desktop.
// @author       NotNightmare
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559472/Mac-style%20Overlay%20Cursor%20%28PNG%2C%2032x32%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559472/Mac-style%20Overlay%20Cursor%20%28PNG%2C%2032x32%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CURSOR_SIZE = 32;

    if (window.__macCursorOverlayActive) return;
    window.__macCursorOverlayActive = true;

    const base64Cursor = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA...'; // ← your actual base64 PNG goes here

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
            transform: translate(-4px, -4px);
        }

        .mac-cursor-image {
            width: 100%;
            height: 100%;
            background-image: url("${base64Cursor}");
            background-size: contain;
            background-repeat: no-repeat;
        }
    `;
    document.documentElement.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'mac-cursor-overlay';

    const image = document.createElement('div');
    image.className = 'mac-cursor-image';

    cursor.appendChild(image);
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
