// ==UserScript==
// @name         Bandcamp Name Your Price Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds and highlights "Name Your Price" (NYP) albums on Bandcamp discover pages..
// @author       f0
// @match        https://bandcamp.com/discover
// @match        https://bandcamp.com/discover/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      bandcamp.com
// @connect      *.bandcamp.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/551004/Bandcamp%20Name%20Your%20Price%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/551004/Bandcamp%20Name%20Your%20Price%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Constants and State ---
    const ALBUM_SELECTOR = 'li.results-grid-item:not([data-nyp-checked])';
    const state = {
        isRunning: false,
        nypFound: 0,
    };

    // --- 2. UI Setup ---
    function setupUI() {
        GM_addStyle(`
            #nyp-finder-container {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                background-color: #1a1a1a; color: #fff; padding: 15px;
                border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                font-family: sans-serif; min-width: 240px;
                display: flex; flex-direction: column; gap: 10px;
            }
            .nyp-finder-button {
                background-color: #629aa9; color: white; border: none;
                padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;
            }
            .nyp-finder-button:hover:not(:disabled) { filter: brightness(1.1); }
            .nyp-finder-button:disabled { background-color: #555; cursor: not-allowed; }
            #nyp-fetch-all-button { background-color: #4CAF50; }
            #nyp-fetch-limited-button { background-color: #f0ad4e; }
            #nyp-finder-status { font-size: 12px; color: #ccc; min-height: 1.2em; text-align: center; }
            .nyp-album-highlight { border: 3px solid #ff69b4 !important; box-shadow: 0 0 10px #ff69b4; border-radius: 4px; }
            .nyp-album-label {
                position: absolute; top: 5px; left: 5px; z-index: 10;
                background-color: #ff69b4; color: white; padding: 2px 5px;
                font-size: 12px; font-weight: bold; border-radius: 3px;
            }
            .nyp-controls-row { display: flex; gap: 8px; align-items: center; }
            #nyp-fetch-count-input {
                width: 60px; background: #333; border: 1px solid #555;
                color: white; border-radius: 4px; padding: 8px; text-align: center;
            }
            .nyp-filter-container { display: flex; align-items: center; justify-content: flex-end; font-size: 13px; gap: 6px; cursor: pointer; color: #eee; }
        `);

        const container = document.createElement('div');
        container.id = 'nyp-finder-container';
        container.innerHTML = `
            <div class="nyp-controls-row">
                <button id="nyp-fetch-limited-button" class="nyp-finder-button" style="flex-grow: 1;">Fetch X Albums</button>
                <input type="number" id="nyp-fetch-count-input" placeholder="200" min="1">
            </div>
            <button id="nyp-fetch-all-button" class="nyp-finder-button">Fetch All Albums</button>
            <button id="nyp-finder-button" class="nyp-finder-button">Find "Name Your Price"</button>
            <div id="nyp-finder-status">Ready to search.</div>
            <label class="nyp-filter-container">
                <input type="checkbox" id="nyp-filter-checkbox"> Show NYP Only
            </label>
        `;
        document.body.appendChild(container);

        return {
            findButton: container.querySelector('#nyp-finder-button'),
            fetchAllButton: container.querySelector('#nyp-fetch-all-button'),
            fetchLimitedButton: container.querySelector('#nyp-fetch-limited-button'),
            fetchCountInput: container.querySelector('#nyp-fetch-count-input'),
            statusDiv: container.querySelector('#nyp-finder-status'),
            filterCheckbox: container.querySelector('#nyp-filter-checkbox'),
            buttons: container.querySelectorAll('.nyp-finder-button'),
        };
    }

    // --- 3. Core Logic ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function setUiState(loading, message) {
        state.isRunning = loading;
        ui.buttons.forEach(btn => btn.disabled = loading);
        ui.statusDiv.textContent = message;
    }

    /**
     *  FIXED: This function now properly parses the HTML to accurately find NYP albums.
     */
    function isNameYourPrice(albumElement) {
        return new Promise((resolve) => {
            const link = albumElement.querySelector('a[href*=".bandcamp.com/album/"]');
            if (!link) return resolve(false);

            GM_xmlhttpRequest({
                method: "GET",
                url: link.href,
                onload: (response) => {
                    try {
                        const doc = document.createElement('html');
                        doc.innerHTML = response.responseText;

                        // 1. Find the specific "Buy Digital Album" section
                        const digitalBuyItem = doc.querySelector('.buyItem.digital');
                        if (!digitalBuyItem) return resolve(false);

                        // 2. Look for the "Name Your Price" indicator *within* that section
                        const nypSpan = digitalBuyItem.querySelector('.buyItemExtra.buyItemNyp');
                        const isNyp = nypSpan && nypSpan.textContent.trim().toLowerCase().includes('name your price');
                        resolve(!!isNyp);
                    } catch (e) {
                        console.error(`Error parsing ${link.href}:`, e);
                        resolve(false);
                    }
                },
                onerror: (error) => {
                    console.error(`Error fetching ${link.href}:`, error);
                    resolve(false);
                }
            });
        });
    }

    function highlightAlbum(albumElement) {
        albumElement.classList.add('nyp-album-highlight');
        const imageContainer = albumElement.querySelector('section.image-carousel, .art');
        if (imageContainer) {
            imageContainer.style.position = 'relative';
            const label = document.createElement('div');
            label.className = 'nyp-album-label';
            label.textContent = 'NYP';
            imageContainer.appendChild(label);
        }
    }

    async function fetchAlbums(limit = Infinity) {
        if (state.isRunning) return;
        setUiState(true, 'Fetching albums...');

        try {
            const albumsPerPage = 48;
            let clicksNeeded = Infinity;

            if (limit !== Infinity) {
                const currentCount = document.querySelectorAll('li.results-grid-item').length;
                const albumsToLoad = limit - currentCount;
                if (albumsToLoad <= 0) {
                    setUiState(false, `Already have ${currentCount} albums.`);
                    return;
                }
                clicksNeeded = Math.ceil(albumsToLoad / albumsPerPage);
            }

            for (let i = 0; i < clicksNeeded; i++) {
                const viewMoreButton = document.getElementById('view-more');
                if (!viewMoreButton || viewMoreButton.offsetParent === null) break;

                const totalAlbums = document.querySelectorAll('li.results-grid-item').length;
                setUiState(true, `Loading... (${totalAlbums} loaded)`);
                viewMoreButton.click();
                await sleep(1500);
            }
        } finally {
            const finalCount = document.querySelectorAll('li.results-grid-item').length;
            setUiState(false, `Loaded ${finalCount} albums. Ready to find NYP.`);
        }
    }

    async function processAlbums() {
        if (state.isRunning) return;

        const albumElements = document.querySelectorAll(ALBUM_SELECTOR);
        if (albumElements.length === 0) {
            setUiState(false, `All albums checked. Total found: ${state.nypFound}`);
            return;
        }

        setUiState(true, 'Starting scan...');
        const showNypOnly = ui.filterCheckbox.checked;

        try {
            let newFound = 0;
            for (const [index, el] of albumElements.entries()) {
                setUiState(true, `Checking ${index + 1}/${albumElements.length}... (Found: ${state.nypFound})`);
                el.dataset.nypChecked = 'true';

                if (await isNameYourPrice(el)) {
                    state.nypFound++;
                    newFound++;
                    highlightAlbum(el);
                } else if (showNypOnly) {
                    el.style.display = 'none';
                }
                await sleep(100);
            }
            setUiState(false, `Scan complete. Found ${newFound} more. Total: ${state.nypFound}.`);
        } catch (error) {
            console.error("An error occurred during album processing:", error);
            setUiState(false, "An error occurred. Check console.");
        }
    }

    function initObserver() {
        const targetNode = document.querySelector('.results-grid ul.items');
        if (!targetNode) return setTimeout(initObserver, 500);

        const observer = new MutationObserver((mutationsList) => {
            if (state.isRunning) return;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setUiState(false, 'New albums loaded. Click "Find" to check them.');
                    break;
                }
            }
        });
        observer.observe(targetNode, { childList: true });
    }

    // --- 4. Initialization ---
    const ui = setupUI();

    ui.findButton.addEventListener('click', processAlbums);
    ui.fetchAllButton.addEventListener('click', () => fetchAlbums(Infinity));
    ui.fetchLimitedButton.addEventListener('click', () => {
        const count = parseInt(ui.fetchCountInput.value, 10);
        if (isNaN(count) || count <= 0) {
            setUiState(false, 'Please enter a valid number.');
            return;
        }
        fetchAlbums(count);
    });
    initObserver();
})();