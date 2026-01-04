// ==UserScript==
// @name         Anti-Block: Free Selection & DevTools
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Undo right-click, copy/paste, DevTools blocks, remove overlay blockers, enable full text selection.
// @author       KukuModz
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554167/Anti-Block%3A%20Free%20Selection%20%20DevTools.user.js
// @updateURL https://update.greasyfork.org/scripts/554167/Anti-Block%3A%20Free%20Selection%20%20DevTools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1) CSS override to allow selection & pointer events ---
    const style = document.createElement('style');
    style.textContent = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        }
        input, textarea, [contenteditable] {
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    // --- 2) Block site attempts to intercept events ---
    const BLOCKED_EVENTS = ['contextmenu', 'copy', 'cut', 'paste', 'keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'selectstart'];

    function stopBlockers(e) {
        e.stopImmediatePropagation();
    }

    // Install capture-phase listeners immediately
    for (const ev of BLOCKED_EVENTS) {
        document.addEventListener(ev, stopBlockers, { capture: true, passive: false });
        window.addEventListener(ev, stopBlockers, { capture: true, passive: false });
    }

    // Nullify inline JS handlers
    document.oncontextmenu = null;
    window.oncontextmenu = null;
    document.oncopy = null;
    window.oncopy = null;
    document.oncut = null;
    window.oncut = null;

    // --- 3) Monkey-patch addEventListener to ignore future blockers ---
    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        try {
            const t = (typeof type === 'string') ? type.toLowerCase() : type;
            if (BLOCKED_EVENTS.includes(t)) return; // ignore attempts to add blocked listeners
        } catch(e) {}
        return origAdd.call(this, type, listener, options);
    };

    // --- 4) Remove overlay divs that block clicks/selections ---
    function removeOverlays() {
        const w = window.innerWidth, h = window.innerHeight;
        const minArea = 0.6 * w * h;
        document.querySelectorAll('div, span, section').forEach(el => {
            try {
                const rect = el.getBoundingClientRect();
                if (rect.width * rect.height < minArea) return;
                const style = getComputedStyle(el);
                if (parseInt(style.zIndex) < 2) return;
                if ((style.pointerEvents !== 'none' && (el.textContent || '').trim().length < 20 && el.querySelectorAll('img,svg').length === 0)) {
                    el.remove();
                }
            } catch(e){}
        });
    }

    setInterval(removeOverlays, 300);

    // --- 5) Reinforce protections periodically ---
    setInterval(() => {
        for (const ev of BLOCKED_EVENTS) {
            document.addEventListener(ev, stopBlockers, { capture: true, passive: false });
            window.addEventListener(ev, stopBlockers, { capture: true, passive: false });
        }
        removeOverlays();
    }, 1000);

})();
