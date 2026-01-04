// ==UserScript==
// @name         Screen Inversion Overlay (Symbol Toggle + Per-Site Memory)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Toggleable fullscreen inversion overlay using symbols (🌓 / 🌑) with per-site state memory
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/558445/Screen%20Inversion%20Overlay%20%28Symbol%20Toggle%20%2B%20Per-Site%20Memory%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558445/Screen%20Inversion%20Overlay%20%28Symbol%20Toggle%20%2B%20Per-Site%20Memory%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_PREFIX = 'gmInvertCoverState:';
    const storageKey = STORAGE_KEY_PREFIX + location.hostname;

    function loadState() {
        try {
            const v = localStorage.getItem(storageKey);
            if (v === 'on') return true;
            if (v === 'off') return false;
        } catch (e) {
            // ignore storage errors, default to off
        }
        return false; // default OFF
    }

    function saveState(enabled) {
        try {
            localStorage.setItem(storageKey, enabled ? 'on' : 'off');
        } catch (e) {
            // ignore storage errors
        }
    }

    // --- Create the overlay ---
    const cover = document.createElement('div');
    cover.id = 'gm-invert-cover';
    cover.style.cssText = `
        position: fixed;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: white;
        mix-blend-mode: difference;
        z-index: 2147483646;
        display: none;
    `;

    // --- Create symbol toggle button ---
    const btn = document.createElement('button');
    btn.id = 'gm-invert-toggle';
    btn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 2147483647;
        padding: 4px 10px;
        font-size: 14px;
        font-family: sans-serif;
        border-radius: 5px;
        border: 1px solid #ccc;
        background: rgba(0, 0, 0, 0.65);
        color: #fff;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s ease, background 0.2s ease;
    `;

    btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
        btn.style.background = 'rgba(0,0,0,0.8)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.6';
        btn.style.background = 'rgba(0,0,0,0.65)';
    });

    let enabled = loadState(); // load per-site state

    function updateState() {
        cover.style.display = enabled ? 'block' : 'none';
        btn.textContent = enabled ? '🌓 ON' : '🌑 OFF';
    }

    btn.addEventListener('click', () => {
        enabled = !enabled;
        saveState(enabled);
        updateState();
    });

    // Keyboard shortcut: Alt + I to toggle
    window.addEventListener('keydown', (e) => {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.isContentEditable) return;

        if (e.altKey && (e.key === 'i' || e.key === 'I')) {
            enabled = !enabled;
            saveState(enabled);
            updateState();
        }
    });

    // Inject into page
    document.body.appendChild(cover);
    document.body.appendChild(btn);
    updateState();
})();
