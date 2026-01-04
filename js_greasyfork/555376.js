// ==UserScript==
// @name         Websim Project Pinner (Mobile Final)
// @namespace    http://websim.com/
// @version      1.8
// @description  Allows users to pin favorite projects to the top of the websim.com homepage list.
// @author       Gemini
// @match        *://websim.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555376/Websim%20Project%20Pinner%20%28Mobile%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555376/Websim%20Project%20Pinner%20%28Mobile%20Final%29.meta.js
// ==/UserScript==

/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Gemini
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'WEBSIM_PINNED_PROJECTS';

    // 1. The selector for the main list container (where all cards live)
    // Using a broad attribute selector to find the grid/flex container holding project cards.
    const PROJECT_CONTAINER_SELECTOR = 'div[class*="grid gap"], div[class*="flex flex-wrap"]';

    // 2. The selector for a single project list item/card. (Confirmed by user HTML analysis)
    const PROJECT_CARD_SELECTOR = '.relative.group';

    // 3. The selector within the project card that holds the project name/title. (CONFIRMED by user)
    const PROJECT_NAME_SELECTOR = '.text-lg.font-bold';


    // --- Storage Functions ---
    function getPinnedProjects() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            console.error('[WEBSIM-PINNER] Error reading pinned projects from localStorage:', e);
            return [];
        }
    }

    function setPinnedProjects(projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    function togglePin(projectName, isPinning) {
        let pinned = getPinnedProjects();
        if (isPinning) {
            if (!pinned.includes(projectName)) {
                // Add to the front of the array to maintain order priority
                pinned.unshift(projectName);
            }
        } else {
            pinned = pinned.filter(name => name !== projectName);
        }
        setPinnedProjects(pinned);
        reorderProjects();
    }

    // --- UI/DOM Functions ---

    function reorderProjects() {
        const pinnedNames = getPinnedProjects();
        const container = document.querySelector(PROJECT_CONTAINER_SELECTOR);
        if (!container) {
            console.warn(`[WEBSIM-PINNER] Container not found. Check selector: ${PROJECT_CONTAINER_SELECTOR}`);
            return;
        }

        const projectCards = Array.from(container.querySelectorAll(PROJECT_CARD_SELECTOR));

        // Reset order for all cards and remove pin class
        projectCards.forEach(card => {
             card.classList.remove('websim-is-pinned');
             // Set order to default (0) for all unpinned cards
             card.style.order = 0;
        });

        // Apply order property to pinned cards in reverse stored order (to make the most recently pinned appear first)
        for (let i = pinnedNames.length - 1; i >= 0; i--) {
            const name = pinnedNames[i];
            const pinnedCard = projectCards.find(card => {
                const titleEl = card.querySelector(PROJECT_NAME_SELECTOR);
                return titleEl && titleEl.textContent.trim() === name;
            });

            if (pinnedCard) {
                pinnedCard.classList.add('websim-is-pinned');
                // Use a negative order to force it to the top of the grid/flex layout
                pinnedCard.style.order = -1;
            } else {
                 // Clean up storage if the project is no longer on the page (e.g., deleted)
                 togglePin(name, false);
            }
        }
    }

    /**
     * Injects the pin button into the project title element itself to guarantee visibility.
     */
    function injectPinButtons() {
        const pinnedNames = getPinnedProjects();
        // Find all title elements, as they are the safest target
        const titleElements = document.querySelectorAll(PROJECT_NAME_SELECTOR);

        if (titleElements.length === 0) {
             console.log(`[WEBSIM-PINNER] Found 0 project titles. Check selector: ${PROJECT_NAME_SELECTOR}`);
             return;
        }

        titleElements.forEach((titleEl) => {
            const projectName = titleEl.textContent.trim();
            // Check if button already exists in the same parent (to prevent duplicates)
            const wrapper = titleEl.parentElement;
            if (wrapper.querySelector('.websim-pin-button')) {
                return;
            }

            const isPinned = pinnedNames.includes(projectName);

            const pinButton = document.createElement('button');
            pinButton.classList.add('websim-pin-button');
            pinButton.innerHTML = createSvgIcon(isPinned);
            pinButton.title = isPinned ? 'Unpin Project' : 'Pin Project';
            
            // Get the main project card (which is the great-grandparent of the title)
            let card = titleEl.closest(PROJECT_CARD_SELECTOR);
            if(card && isPinned) {
                card.classList.add('websim-is-pinned');
            }

            // Click Handler
            pinButton.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const currentlyPinned = pinButton.getAttribute('data-pinned') === 'true';

                togglePin(projectName, !currentlyPinned);
                
                // Update button state visually
                pinButton.setAttribute('data-pinned', !currentlyPinned);
                pinButton.title = !currentlyPinned ? 'Unpin Project' : 'Pin Project';
                pinButton.innerHTML = createSvgIcon(!currentlyPinned);

                if (card) {
                    card.classList.toggle('websim-is-pinned', !currentlyPinned);
                }
            });

            pinButton.setAttribute('data-pinned', isPinned);

            // Inject the button directly next to the title text inside its parent div
            // Create a small wrapper to hold the title and the button side-by-side
            const titleWrapper = document.createElement('div');
            titleWrapper.style.display = 'flex';
            titleWrapper.style.alignItems = 'center';
            titleWrapper.style.justifyContent = 'space-between';
            titleWrapper.style.width = '100%';
            
            // Move the original title element into the wrapper
            titleEl.parentNode.insertBefore(titleWrapper, titleEl);
            titleWrapper.appendChild(titleEl);
            
            // Add the button next to the title
            titleWrapper.appendChild(pinButton);

            console.log(`[WEBSIM-PINNER] Successfully injected pin button next to title: ${projectName}`);
        });
    }

    /**
     * Generates a simple, scalable SVG icon for the pin state.
     */
    function createSvgIcon(filled) {
        // Use a simple star icon
        const color = filled ? '#FFC107' : '#9CA3AF'; // Amber for pinned, gray for unpinned
        const stroke = filled ? 'none' : color;
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="websim-pin-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `;
    }

    // --- Styling Injection (Mobile-friendly CSS) ---

    GM_addStyle(`
        .websim-pin-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px; /* Reduced padding for snug fit next to title */
            transition: transform 0.2s;
            touch-action: manipulation;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0; /* Prevents button from being squeezed */
            z-index: 10; /* Ensures it's above other text elements */
        }

        .websim-pin-button:active {
            transform: scale(0.9);
        }

        .websim-pin-icon {
            width: 20px; /* Smaller size to fit next to title */
            height: 20px;
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
        }
        
        /* Ensure the title itself can occupy all remaining space but doesn't wrap */
        .websim-pin-button + .text-lg.font-bold {
            margin-right: 8px; /* Space between title and button */
            flex-grow: 1;
        }

        /* Visual distinction for pinned projects */
        .websim-is-pinned {
            border: 2px solid #3B82F6 !important; 
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.35);
            transition: all 0.3s ease-in-out;
        }
    `);

    // --- Main Execution ---

    function init() {
        const observer = new MutationObserver((mutations, obs) => {
            // Wait until a title is found, which indicates the list is rendered
            if (document.querySelector(PROJECT_NAME_SELECTOR)) {
                // Disconnect this observer once the content is present
                obs.disconnect(); 
                
                console.log("[WEBSIM-PINNER] Content found. Injecting buttons.");
                injectPinButtons();
                reorderProjects();
                
                // Set up a new observer to handle dynamic loading (like infinite scroll)
                setupDynamicObserver();
            }
        });

        // Observe the entire body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupDynamicObserver() {
        const container = document.querySelector(PROJECT_CONTAINER_SELECTOR);
        if (container) {
            const listObserver = new MutationObserver(() => {
                // When new nodes are added (e.g., scrolling triggers more projects)
                injectPinButtons();
                reorderProjects();
            });
            // Observe only direct children of the main container
            listObserver.observe(container, { childList: true });
        }
    }

    // Initialize the script
    init();
})();