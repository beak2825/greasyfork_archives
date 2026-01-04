// ==UserScript==
// @name         MAM Named Searches
// @namespace    yyyzzz999
// @author       yyyzzz999
// @version      1.4
// @description  Tracks and saves search URLs with custom names. Replaces the H4 "Search" heading with the current name and adds a list button to manage saved searches in a popup.
// @license      MIT
// @match        https://www.myanonamouse.net/tor/browse.php*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/GlassMouse.jpg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553422/MAM%20Named%20Searches.user.js
// @updateURL https://update.greasyfork.org/scripts/553422/MAM%20Named%20Searches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'savedSearchUrls';
    const TARGET_H4_TEXT = 'Search';
    const PAGINATION_PARAM = 'tor[startNumber]';
    var DEBUG =0; // Debugging mode on (1) or off (0)
    if (DEBUG > 0) console.log('Starting MAM Named Searches');

    // Theme Configuration
    const MAIN_ELEMENT_ID = 'mainElement'; // ID of the container element to check background color
    const THEME_MODE = 'auto'; // Options: 'light', 'dark', or 'auto'

    // Global references
    let searches = {};
    let currentThemeColors = {}; // Holds the active color scheme

    // --- Color Schemas ---
    const COLOR_SCHEMES = {
        light: {
            // Buttons
            nameBg: '#e6ffe6', nameText: '#107c10', nameBorder: '#107c10',
            listBg: '#e6e6ff', listText: '#10107c', listBorder: '#10107c',
            // Modal
            modalBg: 'white', modalText: '#333', modalShadow: 'rgba(0, 0, 0, 0.25)',
            overlayBg: 'rgba(0, 0, 0, 0.5)',
            // Modal Items
            navBg: '#d1e7dd', navText: '#0f5132', navBorder: '#0f5132',
            delBg: '#f8d7da', delText: '#842029', delBorder: '#842029',
            hoverBg1: '#ccffcc', hoverBg2: '#ccccff'
        },
        dark: {
            // Buttons
            nameBg: '#1c3e1c', nameText: '#b3ffb3', nameBorder: '#3cb371',
            listBg: '#1c1c3e', listText: '#b3b3ff', listBorder: '#4169e1',
            // Modal
            modalBg: '#2d2d2d', modalText: 'white', modalShadow: 'rgba(255, 255, 255, 0.1)',
            overlayBg: 'rgba(0, 0, 0, 0.75)',
            // Modal Items
            navBg: '#1f362f', navText: '#b3ffb3', navBorder: '#60c08b',
            delBg: '#4a1f22', delText: '#ffb3b3', delBorder: '#ff5c6a',
            hoverBg1: '#2e5a2e', hoverBg2: '#2e2e5a'
        }
    };

    // --- Utility Functions for Theming ---

    /**
     * Converts a hex color string to an RGB array [r, g, b].
     */
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    /**
     * Converts an RGB color string (e.g., "rgb(r, g, b)") to an RGB array.
     */
    function rgbToRgb(rgb) {
        const match = rgb.match(/\d+/g);
        return match ? match.map(Number) : [0, 0, 0];
    }

    /**
     * Calculates the relative luminance of an RGB color using the WCAG formula.
     */
    function getRelativeLuminance(rgb) {
        const R = rgb[0] / 255;
        const G = rgb[1] / 255;
        const B = rgb[2] / 255;

        const components = [R, G, B].map(v => {
            return (v <= 0.03928) ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * components[0] + 0.7152 * components[1] + 0.0722 * components[2];
    }

    /**
     * Determines and sets the theme colors based on config and background luminance.
     */
    function setDynamicTheme() {
        if (THEME_MODE === 'light') {
            currentThemeColors = COLOR_SCHEMES.light;
            return;
        }
        if (THEME_MODE === 'dark') {
            currentThemeColors = COLOR_SCHEMES.dark;
            return;
        }

        // --- Auto Mode ---
        const mainElement = document.getElementById(MAIN_ELEMENT_ID);
        if (!mainElement) {
            GM_log(`Element with ID "${MAIN_ELEMENT_ID}" not found. Defaulting to 'light' theme.`);
            currentThemeColors = COLOR_SCHEMES.light;
            return;
        }
        if (DEBUG > 0) console.log('Detecting background color');
        const style = window.getComputedStyle(mainElement);
        let bgColor = style.backgroundColor;

        let rgb;
        if (bgColor.startsWith('#')) {
            rgb = hexToRgb(bgColor);
        } else if (bgColor.startsWith('rgb')) {
            rgb = rgbToRgb(bgColor);
        } else {
            GM_log('Could not parse background color. Defaulting to light theme.');
            rgb = [255, 255, 255];
        }

        const luminance = getRelativeLuminance(rgb);
        if (DEBUG > 0) console.log('luminance: ', luminance);
        // Threshold: 0.179 for common WCAG contrast recommendations
        const isDarkBackground = luminance < 0.179;

        currentThemeColors = isDarkBackground ? COLOR_SCHEMES.dark : COLOR_SCHEMES.light;
        GM_log(`Background Luminance: ${luminance.toFixed(3)}. Using ${isDarkBackground ? 'dark' : 'light'} theme.`);
    }

    // --- Core Script Functions ---

    /**
     * Retrieves the current base search URL by removing the pagination parameter.
     */
    function getCurrentBaseUrl() {
        try {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            if (params.has(PAGINATION_PARAM)) {
                params.delete(PAGINATION_PARAM);
            }

            let baseUrl = url.origin + url.pathname;
            const queryString = params.toString();

            if (queryString) {
                baseUrl += '?' + queryString;
            }
            if (baseUrl.endsWith('?')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            return baseUrl;
        } catch (e) {
            GM_log('Error processing URL:', e);
            return window.location.href;
        }
    }

    /**
     * Loads the saved searches map from Tampermonkey storage.
     */
    function loadSavedSearches() {
        const savedData = GM_getValue(STORAGE_KEY, '{}');
        try {
            return JSON.parse(savedData);
        } catch (e) {
            GM_log('Error parsing saved search data:', e);
            GM_setValue(STORAGE_KEY, '{}');
            return {};
        }
    }

    /**
     * Finds the custom name associated with the current base URL, if any.
     */
    function findCurrentSearchName(currentUrl, searchMap) {
        for (const name in searchMap) {
            if (searchMap[name] === currentUrl) {
                return name;
            }
        }
        return null;
    }

    /**
     * Saves the current URL with a custom name to storage.
     */
    function nameCurrentSearch() {
        const currentUrl = getCurrentBaseUrl();
        const customName = prompt('Enter a custom name for this search:');

        if (customName) {
            if (searches[customName]) {
                if (!confirm(`A search named "${customName}" already exists. Do you want to overwrite it?`)) {
                    return;
                }
            }

            searches[customName] = currentUrl;
            GM_setValue(STORAGE_KEY, JSON.stringify(searches));
            window.location.reload();
        }
    }

    /**
     * Deletes a search entry by name and reloads the modal content.
     */
    function deleteSearch(name) {
        if (confirm(`Are you sure you want to delete the search named "${name}"?`)) {
            delete searches[name];
            GM_setValue(STORAGE_KEY, JSON.stringify(searches));

            showModal();
            // Reload if the deleted search was the current one
            if (findCurrentSearchName(getCurrentBaseUrl(), searches) === name) {
                 window.location.reload();
            }
        }
    }

    /**
     * Closes the modal dialog.
     */
    function closeModal() {
        const modalOverlay = document.getElementById('gm-search-modal-overlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    }

    /**
     * Creates and displays the modal dialog with the list of saved searches.
     * The search name is now a native anchor tag (<a>) for full link functionality.
     */
    function showModal() {
        searches = loadSavedSearches();
        let modalOverlay = document.getElementById('gm-search-modal-overlay');

        if (!modalOverlay) {
            // Inject dynamic styles
            const style = document.createElement('style');
            style.textContent = `
                .gm-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: ${currentThemeColors.overlayBg};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 99999;
                }
                .gm-modal-content {
                    background: ${currentThemeColors.modalBg};
                    color: ${currentThemeColors.modalText};
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px ${currentThemeColors.modalShadow};
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .gm-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .gm-modal-header h4 {
                    margin: 0;
                    color: ${currentThemeColors.modalText};
                }
                .gm-close-button {
                    background: none;
                    border: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    color: ${currentThemeColors.modalText};
                }
                .gm-search-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid ${currentThemeColors.modalText}20;
                }
                .gm-search-list-item:last-child {
                    border-bottom: none;
                }
                /* NEW: Styling for the clickable anchor tag (<a>) */
                .gm-search-name-link {
                    color: ${currentThemeColors.modalText}; /* Inherit theme text color */
                    font-weight: 500;
                    cursor: pointer;
                    flex-grow: 1;
                    padding-right: 15px;
                    text-decoration: none; /* Remove default underline */
                }
                .gm-search-name-link:hover {
                    text-decoration: underline; /* Add underline on hover for visual feedback */
                    opacity: 0.9;
                }

                .gm-search-list-item button {
                    padding: 2px 6px;
                    margin-left: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                }
                /* Removing gm-list-navigate styling as the Go button is removed */
                .gm-list-delete {
                    background-color: ${currentThemeColors.delBg};
                    color: ${currentThemeColors.delText};
                    border: 1px solid ${currentThemeColors.delBorder};
                }
                .gm-search-list-item button:hover {
                    opacity: 0.85;
                }
            `;
            document.head.appendChild(style);

            // Create the overlay and content structure
            modalOverlay = document.createElement('div');
            modalOverlay.id = 'gm-search-modal-overlay';
            modalOverlay.className = 'gm-modal-overlay';
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            };

            const modalContent = document.createElement('div');
            modalContent.className = 'gm-modal-content';

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
        }

        const modalContent = modalOverlay.querySelector('.gm-modal-content');
        modalContent.innerHTML = ''; // Clear existing content

        // --- Build Header ---
        const header = document.createElement('div');
        header.className = 'gm-modal-header';
        header.innerHTML = '<h4>Saved Searches</h4>';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'gm-close-button';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = closeModal;

        header.appendChild(closeBtn);
        modalContent.appendChild(header);

        // --- Build List ---
        const listDiv = document.createElement('div');

        const searchNames = Object.keys(searches).sort();

        if (searchNames.length === 0) {
            listDiv.innerHTML = `<p style="color: ${currentThemeColors.modalText};">No saved searches yet. Click "Name this" to save the current search.</p>`;
        } else {
            searchNames.forEach(name => {
                const item = document.createElement('div');
                item.className = 'gm-search-list-item';

                // **CHANGE: Use <a> element instead of <span>**
                const nameLink = document.createElement('a');
                nameLink.textContent = name;
                nameLink.className = 'gm-search-name-link';
                nameLink.href = searches[name]; // Set the URL for native link behavior
                nameLink.onclick = closeModal; // Close modal on link click (optional, but good UX)

                item.appendChild(nameLink);

                const buttonGroup = document.createElement('div');

                // Delete Button (only button in the group now)
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'gm-list-delete';
                deleteBtn.onclick = () => deleteSearch(name);
                buttonGroup.appendChild(deleteBtn);

                item.appendChild(buttonGroup);
                listDiv.appendChild(item);
            });
        }
        modalContent.appendChild(listDiv);

        modalOverlay.style.display = 'flex';
    }


    /**
     * Main function to initialize the UI modifications.
     */
    function init() {
        setDynamicTheme();

        const currentUrl = getCurrentBaseUrl();
        searches = loadSavedSearches();
        const currentName = findCurrentSearchName(currentUrl, searches);

        const h4Elements = Array.from(document.querySelectorAll('h4'));
        const targetH4 = h4Elements.find(h4 => h4.textContent.trim() === TARGET_H4_TEXT);

        if (!targetH4) {
            GM_log(`Could not find an <h4> element with content "${TARGET_H4_TEXT}". Script halted.`);
            return;
        }

        const parent = targetH4.parentNode;
        if (!parent) return;

        // 4. Create the "Name this" button (Themed)
        const nameButton = document.createElement('button');
        nameButton.textContent = 'Name this';
        nameButton.style.cssText = `
            margin-right: 10px;
            padding: 2px 8px;
            height: fit-content;
            border: 1px solid ${currentThemeColors.nameBorder};
            background-color: ${currentThemeColors.nameBg};
            color: ${currentThemeColors.nameText};
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9em;
            transition: background-color 0.2s;
        `;
        nameButton.onmouseover = () => nameButton.style.backgroundColor = currentThemeColors.hoverBg1;
        nameButton.onmouseout = () => nameButton.style.backgroundColor = currentThemeColors.nameBg;
        nameButton.onclick = nameCurrentSearch;

        // 5. Create the "Saved List" button (Themed)
        const savedListButton = document.createElement('button');
        savedListButton.textContent = 'Saved List';
        savedListButton.style.cssText = `
            margin-left: 10px;
            padding: 2px 8px;
            height: fit-content;
            border: 1px solid ${currentThemeColors.listBorder};
            background-color: ${currentThemeColors.listBg};
            color: ${currentThemeColors.listText};
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9em;
            transition: background-color 0.2s;
        `;
        savedListButton.onmouseover = () => savedListButton.style.backgroundColor = currentThemeColors.hoverBg2;
        savedListButton.onmouseout = () => savedListButton.style.backgroundColor = currentThemeColors.listBg;
        savedListButton.onclick = showModal;

        // 6. Create a container for the new elements
        const uiContainer = document.createElement('span');
        uiContainer.style.display = 'flex';
        uiContainer.style.alignItems = 'center';

        // 7. Set the dynamic H4 text content
        const searchNameText = document.createElement('span');
        searchNameText.textContent = currentName || TARGET_H4_TEXT;
        searchNameText.style.fontWeight = 'bold';
        searchNameText.style.fontSize = '1.2em';
        searchNameText.style.color = currentThemeColors.modalText;

        // 8. Inject all elements into the container
        uiContainer.appendChild(nameButton);
        uiContainer.appendChild(searchNameText);

        if (Object.keys(searches).length > 0) {
            uiContainer.appendChild(savedListButton);
        }

        // 9. Replace the original H4 element
        targetH4.replaceWith(uiContainer);
    }

    // Run the initialization logic
    init();
     if (DEBUG > 0) console.log('MAM Named Searches is running');
})();