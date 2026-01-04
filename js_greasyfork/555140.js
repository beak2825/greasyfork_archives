// ==UserScript==
// @name         MCSR Ranked Match History VOD Synchronizer
// @namespace    https://greasyfork.org/
// @version      1.5
// @description  Adds a button to match history pages to sync and watch VODs from both players.
// @author       Gemmy
// @match        *://*.mcsrranked.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555140/MCSR%20Ranked%20Match%20History%20VOD%20Synchronizer.user.js
// @updateURL https://update.greasyfork.org/scripts/555140/MCSR%20Ranked%20Match%20History%20VOD%20Synchronizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // 1. SELECTOR FOR THE VOD LINK
    // This targets the specific Tailwind classes and ensures it's a Twitch VOD link.
    const VOD_LINK_SELECTOR = 'a.inline-flex.items-center.gap-0\\.5.rounded-full.bg-white\\/10.px-1\\.5.text-\\[0\\.6875rem\\].font-semibold.leading-\\[0\\.875rem\\].text-zinc-400[href*="twitch.tv/videos/"]';

    // 2. SELECTOR FOR WHERE TO INSERT THE NEW BUTTON
    // **ACTION REQUIRED:** Inspect the page to find where you want the 'Sync VODs' button to appear.
    const INSERT_CONTAINER_SELECTOR = '.flex.min-w-max.gap-6';

    // 3. SYNCHRONIZATION BASE URL
    const SYNC_URL_BASE = 'https://twitchvodsync.up.railway.app/#/';

    // --- HELPER FUNCTIONS ---

    /**
     * Removes the existing sync button from the DOM if it exists.
     */
    function removeExistingButton() {
        const existingButton = document.querySelector('.gemini-sync-vod-button');
        if (existingButton) {
            existingButton.remove();
        }
    }

    /**
     * Extracts the VOD ID (123456789) and timestamp (t=Xs) from the link's href.
     * @param {HTMLElement} linkElement - The <a> element containing the VOD URL.
     * @returns {string|null} The VOD ID combined with the timestamp (e.g., '2606880091?t=2141s') or null.
     */
    function extractVodData(linkElement) {
        if (!linkElement || !linkElement.href) return null;

        try {
            const url = new URL(linkElement.href);
            const pathMatch = url.pathname.match(/\/videos\/(\d+)/); // Extracts digits (VOD ID)
            const timeParam = url.searchParams.get('t'); // Extracts time parameter (e.g., '2141s')

            if (pathMatch) {
                const vodId = pathMatch[1]; // Get the raw VOD ID
                
                // If a time parameter exists, append it using the '?t=' query format.
                const timeQuery = timeParam ? `?t=${timeParam}` : ''; 

                // The returned format is now ID?t=TIME (e.g., 2606880091?t=2141s)
                return `${vodId}${timeQuery}`;
            }
        } catch (e) {
            console.error('Match History VOD Sync: Failed to parse VOD URL:', e);
        }

        return null;
    }

    /**
     * Creates and injects the 'Sync VODs' button into the page.
     * @param {string} vodData1 - VOD ID and time for Player 1 (e.g., 123?t=100s).
     * @param {string} vodData2 - VOD ID and time for Player 2 (e.g., 456?t=200s).
     */
    function createSyncButton(vodData1, vodData2) {
        const container = document.querySelector(INSERT_CONTAINER_SELECTOR);

        if (!container) {
            // Do not log error here, as the container might not exist yet during initial load stages
            return;
        }

        // The synchronization link joins the two VOD data strings as path segments
        const syncLink = SYNC_URL_BASE + vodData1 + '/' + vodData2;

        const button = document.createElement('a');
        button.href = syncLink;
        button.target = '_blank'; // Open in a new tab
        button.textContent = '🎬 Watch Synced VODs';
        button.className = 'gemini-sync-vod-button';
        button.title = 'Watch both players\' VODs simultaneously and synced.';

        // Create a style block for the button (only once)
        if (!document.querySelector('#gemini-sync-style')) {
            const style = document.createElement('style');
            style.id = 'gemini-sync-style';
            style.textContent = `
                .gemini-sync-vod-button {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 15px;
                    margin: 5px 10px;
                    background-color: #9146FF; /* Twitch purple */
                    color: white !important; /* Use !important to override site styles */
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.2s, transform 0.1s;
                    min-width: 180px;
                    justify-content: center;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                .gemini-sync-vod-button:hover {
                    background-color: #772be8;
                    transform: translateY(-1px);
                }
            `;
            document.head.appendChild(style);
        }


        // Add the button to the container
        container.appendChild(button);
        console.log('Match History VOD Sync: Sync button created and injected.');
    }


    /**
     * Core logic to find VOD links and create the sync button.
     * Uses a short delay to wait for dynamic content to load.
     */
    function checkAndInjectButton() {
        // Prevent duplicate button creation, check should happen AFTER delay
        if (document.querySelector('.gemini-sync-vod-button')) {
            return;
        }

        // Use a short delay as the content is loaded dynamically (SPA behavior)
        setTimeout(() => {
            // Re-check for duplicates after the timeout
            if (document.querySelector('.gemini-sync-vod-button')) {
                return;
            }

            // Find all elements matching the highly specific VOD link selector
            const allVodElements = document.querySelectorAll(VOD_LINK_SELECTOR);

            // Check if we found at least two VOD links
            if (allVodElements.length < 2) {
                // We're expecting 2 links. If we find fewer, the page might still be loading.
                return; 
            }

            // Assume the first one is Player 1 and the second is Player 2
            const vodElement1 = allVodElements[0];
            const vodElement2 = allVodElements[1];

            // 3. Extract VOD ID and Time
            const vodData1 = extractVodData(vodElement1);
            const vodData2 = extractVodData(vodElement2);

            if (vodData1 && vodData2) {
                // Log and create button
                console.log(`Match History VOD Sync: Found VOD Data: P1=${vodData1}, P2=${vodData2}`);
                createSyncButton(vodData1, vodData2);
            } else {
                console.log('Match History VOD Sync: Could not extract complete VOD data from elements. Exiting.');
            }
        }, 500); // 500ms delay to wait for dynamic content loading
    }


    /**
     * Sets up the URL change observer using polling.
     */
    function initializeUrlObserver() {
        console.log('Match History VOD Sync: Script initializing URL Observer...');
        let lastUrl = window.location.href;

        // Run once on initial page load
        checkAndInjectButton(); 

        // Start polling the URL every 200ms
        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                console.log(`Match History VOD Sync: URL change detected.`);
                lastUrl = currentUrl;
                
                // 1. Clean up old button
                removeExistingButton();
                
                // 2. Inject new button for the new page
                checkAndInjectButton();
            }
        }, 200);
    }

    // Start the script
    initializeUrlObserver();

})();