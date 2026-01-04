// ==UserScript==
// @name         Mac-style Overlay Cursor (Black Fill, White Border)
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Overlay a Mac-style cursor (black fill, white border) that follows the real cursor and hides the system cursor. Works on iPadOS Safari (Userscripts) and desktop.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559468/Mac-style%20Overlay%20Cursor%20%28Black%20Fill%2C%20White%20Border%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559468/Mac-style%20Overlay%20Cursor%20%28Black%20Fill%2C%20White%20Border%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIG ---
    const CURSOR_SIZE = 24; // Base size in px (approx. 24x24 like macOS)
    const CURSOR_SCALE = 1; // Scale factor (1 = 24px, 1.25 = 30px, etc.)

    let cursorEnabled = true;

    // Ensure we only initialize once
    if (window.__macOverlayCursorInitialized) return;
    window.__macOverlayCursorInitialized = true;

    function createStyles() {
        const style = document.createElement('style');
        style.id = 'mac-overlay-cursor-style';
        style.textContent = `
            html, body {
                cursor: none !important;
            }

            .mac-overlay-cursor-wrapper {
                position: fixed;
                left: 0;
                top: 0;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 2147483647; /* max-ish */
            }

            .mac-overlay-cursor {
                position: absolute;
                transform-origin: 0 0;
                transform: translate(-2px, -1px) scale(${CURSOR_SCALE});
            }

            /* Cursor body (arrow) */
            .mac-overlay-cursor-main {
                position: relative;
                width: ${CURSOR_SIZE}px;
                height: ${CURSOR_SIZE}px;
            }

            /* Arrow shape using borders: a black triangle with white border */
            .mac-overlay-cursor-arrow {
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: ${CURSOR_SIZE}px 0 0 ${CURSOR_SIZE}px;
                border-color: transparent transparent transparent black; /* black fill */
                /* White border fake using multiple shadows */
                filter: drop-shadow(1px 0 white)
                        drop-shadow(0 1px white)
                        drop-shadow(-1px 0 white)
                        drop-shadow(0 -1px white);
            }

            /* Small tail "cut" to make it look closer to macOS shape */
            .mac-overlay-cursor-cut {
                position: absolute;
                left: 4px;
                top: 10px;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 6px 0 0 6px;
                border-color: transparent transparent transparent white;
            }

            /* Optional small "stem" like macOS (subtle effect) */
            .mac-overlay-cursor-stem {
                position: absolute;
                left: 10px;
                top: 14px;
                width: 3px;
                height: 7px;
                background: black;
                box-shadow:
                    -1px 0 0 0 white,
                    1px 0 0 0 white,
                    0 -1px 0 0 white,
                    0 1px 0 0 white;
            }
        `;
        document.documentElement.appendChild(style);
    }

    function createCursor() {
        const wrapper = document.createElement('div');
        wrapper.className = 'mac-overlay-cursor-wrapper';

        const cursor = document.createElement('div');
        cursor.className = 'mac-overlay-cursor';

        const main = document.createElement('div');
        main.className = 'mac-overlay-cursor-main';

        const arrow = document.createElement('div');
        arrow.className = 'mac-overlay-cursor-arrow';

        const cut = document.createElement('div');
        cut.className = 'mac-overlay-cursor-cut';

        const stem = document.createElement('div');
        stem.className = 'mac-overlay-cursor-stem';

        main.appendChild(arrow);
        main.appendChild(cut);
        main.appendChild(stem);
        cursor.appendChild(main);
        wrapper.appendChild(cursor);
        document.documentElement.appendChild(wrapper);

        return { wrapper, cursor };
    }

    function init() {
        createStyles();
        const { wrapper, cursor } = createCursor();

        let lastX = window.innerWidth / 2;
        let lastY = window.innerHeight / 2;
        let rafId = null;

        function updatePosition() {
            cursor.style.left = `${lastX}px`;
            cursor.style.top = `${lastY}px`;
            rafId = null;
        }

        function onPointerMove(e) {
            if (!cursorEnabled) return;
            // Ignore touches; only follow mouse / stylus that has a clientX/Y
            if (e.pointerType && e.pointerType === 'touch') return;
            if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;

            lastX = e.clientX;
            lastY = e.clientY;
            if (rafId === null) {
                rafId = requestAnimationFrame(updatePosition);
            }
        }

        function onMouseMove(e) {
            // Fallback for environments that don’t emit pointer events
            if (!cursorEnabled) return;
            if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;

            lastX = e.clientX;
            lastY = e.clientY;
            if (rafId === null) {
                rafId = requestAnimationFrame(updatePosition);
            }
        }

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Keep cursor visible on resize/scroll
        window.addEventListener('scroll', () => {
            if (!cursorEnabled) return;
            if (rafId === null) {
                rafId = requestAnimationFrame(updatePosition);
            }
        }, { passive: true });

        // Simple API to toggle if you ever want it:
        window.__macOverlayCursorToggle = function (enabled) {
            cursorEnabled = enabled;
            wrapper.style.display = enabled ? 'block' : 'none';
            const style = document.getElementById('mac-overlay-cursor-style');
            if (style) {
                style.textContent = style.textContent.replace(
                    /html, body \{\s*cursor: none !important;\s*\}/,
                    enabled
                        ? 'html, body { cursor: none !important; }'
                        : 'html, body { cursor: auto !important; }'
                );
            }
        };
    }

    // Run as early as possible but after DOM is ready enough to append
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
