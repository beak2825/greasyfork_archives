// ==UserScript==
// @name         GeoPixels - Ghost Palette Color Search
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Search and filter ghost palette colors by hex code
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geopixels.net
// @downloadURL https://update.greasyfork.org/scripts/555426/GeoPixels%20-%20Ghost%20Palette%20Color%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555426/GeoPixels%20-%20Ghost%20Palette%20Color%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the ghostColorPalette to exist
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // Add CSS for the glow effect
    const style = document.createElement('style');
    style.textContent = `
        .color-search-glow {
            box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.8) !important;
            animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.8) !important;
            }
            50% {
                box-shadow: 0 0 12px 3px rgba(255, 215, 0, 1) !important;
            }
        }

        .color-search-container {
            margin-bottom: 12px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .color-search-input {
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .color-search-input:focus {
            outline: none;
            border-color: #3b82f6;
        }

        .color-search-input::placeholder {
            color: #9ca3af;
        }

        .hide-unmatched-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            font-size: 14px;
            color: #374151;
        }

        .hide-unmatched-checkbox input {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .hide-unmatched-checkbox label {
            cursor: pointer;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    // Main functionality
    waitForElement('#ghostColorPalette', (paletteDiv) => {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'color-search-container';

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'color-search-input';
        searchInput.placeholder = 'Search color(s) (comma separated)';

        // Create checkbox container
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'hide-unmatched-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hideUnmatchedColors';

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'hideUnmatchedColors';
        checkboxLabel.textContent = 'Hide unmatched colors';

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);

        // Assemble search container
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(checkboxContainer);

        // Insert before the palette
        paletteDiv.parentNode.insertBefore(searchContainer, paletteDiv);

        // Search and highlight function
        function performSearch() {
            const searchValue = searchInput.value.trim();
            const hideUnmatched = checkbox.checked;

            // Get all color buttons in the palette
            const colorButtons = paletteDiv.querySelectorAll('[title^="#"]');

            // Clear all previous glows and hidden states
            colorButtons.forEach(btn => {
                btn.classList.remove('color-search-glow');
                btn.classList.remove('hidden');
            });

            // If search is empty, exit early
            if (!searchValue) {
                return;
            }

            // Parse search terms (comma separated)
            const searchTerms = searchValue
                .split(',')
                .map(term => term.trim().toUpperCase())
                .filter(term => term.length > 0);

            if (searchTerms.length === 0) {
                return;
            }

            // Find matching buttons
            const matchingButtons = [];

            colorButtons.forEach(btn => {
                const colorTitle = btn.getAttribute('title');
                if (!colorTitle) return;

                const colorHex = colorTitle.toUpperCase();

                // Check if any search term is a substring of this color
                const isMatch = searchTerms.some(term => colorHex.includes(term));

                if (isMatch) {
                    btn.classList.add('color-search-glow');
                    matchingButtons.push(btn);
                }
            });

            // Hide unmatched if checkbox is selected
            if (hideUnmatched && searchTerms.length > 0) {
                colorButtons.forEach(btn => {
                    if (!matchingButtons.includes(btn)) {
                        btn.classList.add('hidden');
                    }
                });
            }
        }

        // Add event listeners
        searchInput.addEventListener('input', performSearch);
        checkbox.addEventListener('change', performSearch);

        // Track the number of color buttons to detect palette resets
        let previousButtonCount = 0;

        // Also watch for dynamically added buttons
        const observer = new MutationObserver(() => {
            const currentButtonCount = paletteDiv.querySelectorAll('[title^="#"]').length;

            // If the button count changed significantly, it's likely a new image
            // Clear the search field to reset the UI
            if (previousButtonCount > 0 && Math.abs(currentButtonCount - previousButtonCount) > 5) {
                searchInput.value = '';
                checkbox.checked = false;
            }

            previousButtonCount = currentButtonCount;
            performSearch();
        });

        observer.observe(paletteDiv, {
            childList: true,
            subtree: true
        });

        // Initialize the button count
        previousButtonCount = paletteDiv.querySelectorAll('[title^="#"]').length;
    });
})();