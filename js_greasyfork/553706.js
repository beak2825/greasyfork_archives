// ==UserScript==
// @name         F95 Utility buttons
// @namespace    http://tampermonkey.net/
// @description  Added a search button for Compressed, Update only, Walkthrough ....
// @version      1.0
// @author       TxHx
// @match        https://f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/553706/F95%20Utility%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/553706/F95%20Utility%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const BUTTONS = [
    { label: 'Update', position: '43%', searchSuffix: ' Update Only' },
    { label: 'New+Compressed', position: '50%', searchSuffix: ' Compressed' },
    { label: 'Compressed', position: '57%', searchTerm: 'Compressed' },
    { label: 'Walkthrough', position: '64%', searchSuffix: ' Walkthrough' },
    { label: 'Mod', position: '71%', searchTerm: 'Mod' },
    { label: 'Cheats', position: '78%', searchSuffix: ' Cheats' }
];

    const SELECTORS = {
        title: 'div.p-title h1.p-title-value',
        searchInput: '.uix_searchInput',
        searchButton: 'button.button--primary.button--icon--search'
    };

    const BUTTON_STYLES = {
        position: 'fixed',
        right: '0px',
        zIndex: '9999',
        lineHeight: '30px',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '5px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px 0 0 4px'
    };

    // Extract game title from page
    function getGameTitle() {
        const titleElement = document.querySelector(SELECTORS.title);
        if (!titleElement) {
            console.warn('[F95 Script] Title element not found');
            return null;
        }

        const match = titleElement.textContent.match(/\[(.*?)\]/);
        return match ? match[1] : null;
    }

    // Perform search with given term
    function performSearch(searchTerm) {
        const searchInput = document.querySelector(SELECTORS.searchInput);
        const searchButton = document.querySelector(SELECTORS.searchButton);

        if (!searchInput || !searchButton) {
            console.error('[F95 Script] Search elements not found');
            return;
        }

        searchInput.value = searchTerm;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchButton.click();
    }

    // Create button element
    function createButton(config, gameTitle) {
        const button = document.createElement('input');
        button.type = 'button';
        button.value = config.label;
        button.className = 'f95-quick-search-btn';

        // Apply styles
        Object.assign(button.style, BUTTON_STYLES, { top: config.position });

        // Add click handler
        button.addEventListener('click', () => {
            let searchTerm;

            if (config.searchTerm) {
                // Direct search term (e.g., "Compressed")
                searchTerm = config.searchTerm;
            } else if (config.searchSuffix && gameTitle) {
                // Game title + suffix (e.g., "[Game] Update Only")
                searchTerm = gameTitle + config.searchSuffix;
            } else {
                console.warn('[F95 Script] Cannot determine search term');
                return;
            }

            performSearch(searchTerm);
        });

        return button;
    }

    // Initialize script
    function init() {
        const gameTitle = getGameTitle();

        // Create and append all buttons
        BUTTONS.forEach(config => {
            const button = createButton(config, gameTitle);
            document.body.appendChild(button);
        });

        console.info('[F95 Script] Quick search buttons initialized');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
