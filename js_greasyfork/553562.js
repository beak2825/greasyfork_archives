// ==UserScript==
// @name         YouTube Fix Bottom Right Fullscreen Button after redesign 2025
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a fullscreen button fixed to the bottom-right corner of the YouTube video player so you can exit a fullscreen mode without looking for a button.
// @author       Eloren1
// @match        *://www.youtube.com/watch?v=*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553562/YouTube%20Fix%20Bottom%20Right%20Fullscreen%20Button%20after%20redesign%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/553562/YouTube%20Fix%20Bottom%20Right%20Fullscreen%20Button%20after%20redesign%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_SIZE_PX = 50; // Width and height in pixels
    const INITIAL_OPACITY = 0.0; // Transparency when idle
    const HOVER_OPACITY = 0.0; // Transparency when hovering

    GM_addStyle(`
        #custom-fullscreen-btn {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: ${BUTTON_SIZE_PX}px;
            height: ${BUTTON_SIZE_PX}px;
            z-index: 9999;
            background-color: #ff0000;
            border: none;
            cursor: pointer;
            opacity: ${INITIAL_OPACITY};
            transition: opacity 0.2s, background-color 0.2s;
        }

        #custom-fullscreen-btn:hover {
            opacity: ${HOVER_OPACITY};
        }

        .html5-video-player {
            position: relative;
        }
    `);

    function toggleFullscreen() {
        const fullscreenButton = document.querySelector('.ytp-fullscreen-button');

        if (fullscreenButton) {
            fullscreenButton.click();
        } else {
            console.error("Fullscreen button not found.");
        }
    }

    function createButton() {
        const player = document.getElementById('movie_player');

        if (player && !document.getElementById('custom-fullscreen-btn')) {
            const newButton = document.createElement('button');
            newButton.id = 'custom-fullscreen-btn';
            newButton.textContent = '';
            newButton.setAttribute('title', 'Toggle Fullscreen');

            newButton.addEventListener('click', toggleFullscreen);

            player.appendChild(newButton);
        }
    }

    const observerTarget = document.getElementById('page-manager');
    if (observerTarget) {
        const observer = new MutationObserver((mutationsList, observer) => {
            if (document.getElementById('movie_player')) {
                createButton();
            }
        });

        observer.observe(observerTarget, { childList: true, subtree: true });
    }

    function waitForPlayer(callback) {
        const player = document.getElementById('movie_player');
        if (player) {
            callback();
        } else {
            setTimeout(() => waitForPlayer(callback), 100);
        }
    }

    waitForPlayer(createButton);
})();