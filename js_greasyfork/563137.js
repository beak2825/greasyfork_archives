// ==UserScript==
// @name         W2G Playlist Toggle
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a little text button to the bottom of the left sidebar, allowing you to collapse the playlist for a larger video window.
// @author       ClarkyAU
// @match        https://*.w2g.tv/*
// @grant        none
// @license MIT
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/563137/W2G%20Playlist%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/563137/W2G%20Playlist%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    // Configuration
    const SELECTORS = {
        sidebar: '.relative.flex.flex-col.items-center.justify-between.h-full',
        playlist: '.w2g-content-right.w2g-bind-layout',
        iconGroup: 'div, nav'
    };

    const styles = `
        #w2g-custom-toggle {
            cursor: pointer;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
            padding: 0 8px;
            border-radius: 6px;
            transition: all 0.2s;
            white-space: nowrap;
            color: #aaa;
            font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        #w2g-custom-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
    `;

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    const handleToggle = (e) => {
        const playlist = document.querySelector(SELECTORS.playlist);
        if (!playlist) return;

        const isHidden = playlist.style.display === 'none';
        playlist.style.display = isHidden ? 'flex' : 'none';
        e.target.innerText = isHidden ? 'Hide Playlist' : 'Show Playlist';

        // Let the player adjust to the new width
        window.dispatchEvent(new Event('resize'));
    };

    const init = () => {
        if (document.getElementById('w2g-custom-toggle')) return;

        const sidebar = document.querySelector(SELECTORS.sidebar);
        const targetGroup = sidebar?.querySelector(SELECTORS.iconGroup);

        if (targetGroup) {
            const btn = document.createElement('div');
            btn.id = 'w2g-custom-toggle';
            btn.innerText = 'Hide Playlist';
            btn.onclick = handleToggle;
            targetGroup.appendChild(btn);
            observer.disconnect();
        }
    };

    // Execution
    injectStyles();
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();
})();