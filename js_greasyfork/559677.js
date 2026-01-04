// ==UserScript==
// @name         JanitorAI Character Page Avatar Extractor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license MIT
// @description  Adds a source link ONLY on character profile pages. Handles SPA navigation.
// @author       kawau-tui
// @match        *://janitorai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559677/JanitorAI%20Character%20Page%20Avatar%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/559677/JanitorAI%20Character%20Page%20Avatar%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMAGE_SELECTOR = 'img.avatar-image';
    const BUTTON_ID = 'extract-avatar-link-fixed';
    const NOTIFICATION_ID = 'avatar-copy-notification';

    function showNotification(message) {
        let notification = document.getElementById(NOTIFICATION_ID);
        if (notification) notification.remove();

        notification = document.createElement('div');
        notification.id = NOTIFICATION_ID;
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Extracted Filename:</div>
            <textarea
                style="width: 100%; height: 25px; resize: none; border: 1px solid #AE99FF; background-color: #313338; color: white; padding: 5px; font-size: 0.8rem; cursor: text;"
                onclick="this.select()"
                readonly
            >${message}</textarea>
        `;

        notification.style.cssText = `
            position: fixed; bottom: 65px; right: 20px; z-index: 2147483647;
            padding: 10px 15px; width: 300px; background-color: #2D3748;
            color: white; font-family: sans-serif; font-size: 0.9rem;
            border-radius: 4px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
            opacity: 0; transition: opacity 0.5s ease-in-out;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '1';
            const textarea = notification.querySelector('textarea');
            if (textarea) { textarea.select(); textarea.focus(); }
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function extractSourceAndNotify() {
        const avatarImage = document.querySelector(IMAGE_SELECTOR);
        if (avatarImage) {
            const fullSource = avatarImage.getAttribute('src');
            if (fullSource) {
                const baseUrl = fullSource.split('?')[0];
                const filename = baseUrl.match(/[^/]*$/)?.[0];
                if (filename) {
                    showNotification(filename);
                } else {
                    showNotification("Extraction failed: Filename not found.");
                }
            }
        }
    }

    function manageButtonVisibility() {
        // Updated check: Only true if URL contains '/characters/'
        const isCharacterPage = window.location.href.includes('/characters/');
        const existingButton = document.getElementById(BUTTON_ID);

        // Remove button if we leave a character page
        if (!isCharacterPage) {
            if (existingButton) existingButton.remove();
            return;
        }

        // Add button if we are on a character page and it's missing
        if (isCharacterPage && !existingButton) {
            const link = document.createElement('span');
            link.textContent = '[Avatar Source]';
            link.id = BUTTON_ID;
            link.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
                padding: 5px 10px; background-color: rgba(30, 30, 30, 0.9);
                border: 1px solid #AE99FF; border-radius: 4px; font-size: 0.8rem;
                color: #AE99FF; cursor: pointer; opacity: 0.8; white-space: nowrap;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); transition: 0.2s;
            `;
            link.addEventListener('mouseover', () => { link.style.opacity = '1'; link.style.backgroundColor = '#1A1A1A'; });
            link.addEventListener('mouseout', () => { link.style.opacity = '0.8'; link.style.backgroundColor = 'rgba(30, 30, 30, 0.9)'; });
            link.addEventListener('click', extractSourceAndNotify);
            document.body.appendChild(link);
        }
    }

    // --- Background Listeners ---
    
    // Listen for browser navigation (back/forward)
    window.addEventListener('popstate', manageButtonVisibility);

    // Watch for internal page swaps (SPA navigation)
    const observer = new MutationObserver(() => {
        manageButtonVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Run once on load
    manageButtonVisibility();

})();