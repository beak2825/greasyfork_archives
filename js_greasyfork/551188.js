// ==UserScript==
// @name         (v2) YouTube History - Patient & Reliable Remove
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Adds a single 'X' to remove history items. Reliably removes only one item per click and does NOT hide the video row instantly.
// @author       Your Name Here
// @match        https://www.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @license      BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/551188/%28v2%29%20YouTube%20History%20-%20Patient%20%20Reliable%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/551188/%28v2%29%20YouTube%20History%20-%20Patient%20%20Reliable%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A "lock" to ensure only one removal operation can run at a time. This prevents race conditions.
    let isRemovalInProgress = false;

    const removeIconSvg = `
        <svg xmlns="http://www.w.org/2000/svg" height="24" viewBox="0 0 24" width="24" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>
    `;

    /**
     * Failsafe: Finds and removes any visible menu popups from the DOM.
     */
    function cleanupOldMenus() {
        document.querySelectorAll('ytd-menu-popup-renderer').forEach(menu => menu.remove());
    }

    /**
     * Processes each video on the page to replace its menu.
     */
    function processVideos() {
        const menuContainers = document.querySelectorAll('.yt-lockup-metadata-view-model__menu-button:not(.direct-remove-processed)');

        menuContainers.forEach(menuContainer => {
            menuContainer.classList.add('direct-remove-processed');
            const originalButton = menuContainer.querySelector('button[aria-label="More actions"]');
            if (!originalButton) return;

            const removeButton = document.createElement('button');
            removeButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button';
            removeButton.setAttribute('aria-label', 'Remove from watch history');
            removeButton.title = 'Remove from watch history';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'yt-spec-button-shape-next__icon';
            iconContainer.setAttribute('aria-hidden', 'true');
            iconContainer.innerHTML = removeIconSvg;
            removeButton.appendChild(iconContainer);

            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 1. Check the lock. If an operation is already running, ignore this click.
                if (isRemovalInProgress) {
                    return;
                }

                // 2. Set the lock.
                isRemovalInProgress = true;

                // 3. Clean up any leftover menus from a previous, failed state.
                cleanupOldMenus();

                // NOTE: The code to instantly hide the video row has been REMOVED as requested.

                // 4. Start the background removal process.
                originalButton.click();

                // 5. Wait for the correct menu item to appear.
                let attempts = 0;
                const maxAttempts = 50; // Try for 1 second
                const interval = setInterval(() => {
                    attempts++;
                    const elements = document.querySelectorAll('yt-list-item-view-model');
                    let foundElement = null;

                    for (const el of elements) {
                        if (el.textContent && el.textContent.trim().toLowerCase() === 'remove from watch history') {
                            foundElement = el;
                            break;
                        }
                    }

                    if (foundElement) {
                        clearInterval(interval);
                        foundElement.click();
                        // 6a. SUCCESS: Release the lock for the next click.
                        isRemovalInProgress = false;
                    } else if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // 6b. FAILURE: Release the lock anyway to prevent getting stuck.
                        isRemovalInProgress = false;
                    }
                }, 20);

            }, true);

            menuContainer.innerHTML = '';
            menuContainer.appendChild(removeButton);
        });
    }

    // Standard observer to handle videos loaded by scrolling.
    const observer = new MutationObserver(() => {
        processVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processVideos();
})();