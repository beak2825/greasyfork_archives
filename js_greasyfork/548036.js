// ==UserScript==
// @name         Songsterr Video Toggle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Floating video toggle button that hides when using synth
// @license MIT
// @match        https://www.songsterr.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548036/Songsterr%20Video%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/548036/Songsterr%20Video%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #video-toggle-btn {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(80, 80, 80, 0.8);
            color: white;
            font-size: 20px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: background 0.2s;
        }
        #video-toggle-btn:hover {
            background-color: rgba(100, 100, 100, 0.9);
        }
    `);

    let minimized = false;

    function addButton() {
        if (document.querySelector('#video-toggle-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'video-toggle-btn';
        btn.innerHTML = '⬆';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            const container = document.querySelector('#youtube-container');
            if (!container) return;

            minimized = !minimized;
            container.style.display = minimized ? 'none' : 'block';
            btn.innerHTML = minimized ? '⬇' : '⬆';
        });
    }

    function updateButtonVisibility() {
        const btn = document.querySelector('#video-toggle-btn');
        const sourceRadio = document.querySelector('#control-source input[value="original"]');
        if (!btn || !sourceRadio) return;

        btn.style.display = sourceRadio.checked ? 'flex' : 'none';
    }

    // Initial button
    addButton();
    updateButtonVisibility();

    // Observe changes to button & radio inputs
    const observer = new MutationObserver(() => {
        addButton();
        updateButtonVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also watch for clicks on the radio buttons
    document.addEventListener('change', e => {
        if (e.target.matches('#control-source input')) {
            updateButtonVisibility();
        }
    });
})();
