// ==UserScript==
// @name         Page Fullscreen Toggle
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a floating fullscreen toggle button with corner placement and remembers fullscreen state per site.
// @author       Word
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552850/Page%20Fullscreen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/552850/Page%20Fullscreen%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- CONFIG ---------- */
    const BUTTON_TEXT = '⤢';
    const BUTTON_TITLE = 'Toggle Fullscreen';
    const BUTTON_SIZE = 44;          // px (height/width)
    const FONT_SIZE = 20;            // px
    const BUTTON_CORNER = 'bottom-right'; // options: top-left, top-right, bottom-left, bottom-right
    /* ----------------------------- */

    const DOMAIN = location.hostname;
    const KEY = `fullscreen_${DOMAIN}`;
    const savedFullscreen = GM_getValue(KEY, false);

    const isFullscreen = () =>
        document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement || document.msFullscreenElement;

    const requestFullscreen = el =>
        (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen)?.call(el);

    const exitFullscreen = () =>
        (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen)?.call(document);

    const toggleFullscreen = () => {
        if (isFullscreen()) {
            exitFullscreen();
            GM_setValue(KEY, false);
        } else {
            requestFullscreen(document.documentElement || document.body);
            GM_setValue(KEY, true);
        }
    };

    // Add menu command (optional)
    try { GM_registerMenuCommand('Toggle Fullscreen', toggleFullscreen); } catch {}

    // Create button
    const btn = document.createElement('div');
    btn.textContent = BUTTON_TEXT;
    btn.title = BUTTON_TITLE;
    btn.style.cssText = `
        position: fixed;
        ${BUTTON_CORNER.includes('bottom') ? 'bottom' : 'top'}: 20px;
        ${BUTTON_CORNER.includes('right') ? 'right' : 'left'}: 20px;
        width: ${BUTTON_SIZE}px;
        height: ${BUTTON_SIZE}px;
        line-height: ${BUTTON_SIZE}px;
        font-size: ${FONT_SIZE}px;
        text-align: center;
        color: white;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        cursor: pointer;
        z-index: 2147483647;
        user-select: none;
        transition: all 0.15s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,0,0,0.8)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,0,0,0.6)');
    btn.addEventListener('click', toggleFullscreen);
    document.body.appendChild(btn);

    // Keep button state synced
    const updateButton = () => btn.style.opacity = isFullscreen() ? '0.6' : '1';
    document.addEventListener('fullscreenchange', updateButton);
    updateButton();

    // Auto re-enter fullscreen if saved
    if (savedFullscreen && !isFullscreen()) {
        requestFullscreen(document.documentElement || document.body);
    }
})();
