// ==UserScript==
// @name Drawaria Online Bounce Animator
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Embeds a draggable Drawaria Online Bounce Animator inside an iframe.
// @author YouTubeDrawaria
// @match https://drawaria.online/*
// @match https://*.drawaria.online/*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/550509/Drawaria%20Online%20Bounce%20Animator.user.js
// @updateURL https://update.greasyfork.org/scripts/550509/Drawaria%20Online%20Bounce%20Animator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PAGE_URL = 'https://drawaria-online-bounce-animator.netlify.app/';

    // Function to create and show the interface with the iframe
    function createInterface() {
        // Prevent creating multiple interfaces
        if (document.getElementById('animator-iframe-container')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'animator-iframe-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            z-index: 9999;
            width: 1000px;
            height: 900px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            resize: both; /* Allows user to resize the container */
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            cursor: grab;
            padding: 8px 12px;
            background-color: #f0f0f0;
            border-bottom: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: sans-serif;
            font-weight: bold;
        `;
        header.innerHTML = `<span>Drawaria Bounce Animator</span>`;

        const closeButton = document.createElement('span');
        closeButton.style.cssText = `
            cursor: pointer;
            font-size: 1.2em;
            color: #555;
            line-height: 1;
        `;
        closeButton.textContent = '×';
        closeButton.onclick = closeInterface;

        header.appendChild(closeButton);

        const iframe = document.createElement('iframe');
        iframe.src = PAGE_URL;
        iframe.style.cssText = `
            border: none;
            flex-grow: 1;
            width: 100%;
            height: 100%;
        `;

        container.appendChild(header);
        container.appendChild(iframe);
        document.body.appendChild(container);

        // Make the interface draggable
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - container.offsetLeft;
            offset.y = e.clientY - container.offsetTop;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offset.x}px`;
                container.style.top = `${e.clientY - offset.y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }

    // Function to close the interface
    function closeInterface() {
        const container = document.getElementById('animator-iframe-container');
        if (container) {
            container.remove();
        }
    }

    // Register user menu commands
    GM_registerMenuCommand("📂Open Bounce Animator", createInterface);
    GM_registerMenuCommand("❌Close Bounce Animator", closeInterface);

})();