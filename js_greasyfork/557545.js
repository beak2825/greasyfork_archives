// ==UserScript==
// @name         Google Meet Reaction Hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Hotkeys 1-9 for Google Meet reactions with hover hints
// @author       You
// @match        https://meet.google.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557545/Google%20Meet%20Reaction%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/557545/Google%20Meet%20Reaction%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTOR = '[role="toolbar"] button[data-emoji]';
    let buttons = [];

    // Inject CSS for hover overlay
    const style = document.createElement('style');
    style.textContent = `
        .rhk-btn { position: relative; }
        .rhk-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(60, 64, 67, 1);
            color: #fff;
            font: 600 20px 'Google Sans', Roboto, sans-serif;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.15s;
            pointer-events: none;
        }
        .rhk-btn:hover .rhk-overlay { opacity: 1; }
    `;
    document.head.appendChild(style);

    // Find reaction buttons and add overlays
    function update() {
        buttons = [...document.querySelectorAll(SELECTOR)].slice(0, 9);
        buttons.forEach((btn, i) => {
            if (btn.dataset.rhk) return;
            btn.dataset.rhk = '1';
            btn.classList.add('rhk-btn');
            const overlay = document.createElement('div');
            overlay.className = 'rhk-overlay';
            overlay.textContent = i + 1;
            btn.appendChild(overlay);
        });
    }

    // Handle hotkeys
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            e.stopPropagation();
            buttons[+e.key - 1]?.click();
        }
    }, true);

    // Poll for buttons
    setInterval(update, 1000);
    setTimeout(update, 500);
})();