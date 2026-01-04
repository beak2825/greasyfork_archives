// ==UserScript==
// @name         Websim Project Pinner (Mobile Final)
// @namespace    http://websim.com/
// @version      1.6
// @description  Allows users to pin favorite projects to the top of the websim.com homepage list.
// @author       Gemini
// @match        *://websim.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555372/Websim%20Project%20Pinner%20%28Mobile%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555372/Websim%20Project%20Pinner%20%28Mobile%20Final%29.meta.js
// ==/UserScript==

/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Gemini
 * ... [License text omitted for brevity] ...
 */

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY = 'WEBSIM_PINNED_PROJECTS';

    // ==============================================================================
    // !!! CONFIRMED SELECTORS !!!
    // The script relies entirely on these two working selectors now.
    // ==============================================================================

    // 1. The selector for a single project list item/card. (Confirmed by user HTML)
    const PROJECT_CARD_SELECTOR = '.relative.group';

    // 2. The selector within the project card that holds the project name/title. (CONFIRMED by user)
    const PROJECT_NAME_SELECTOR = '.text-lg.font-bold';

    // 3. The main grid container. We use an attribute selector to handle dynamic class names.
    const PROJECT_CONTAINER_SELECTOR = 'div[class*="grid gap"]';


    // --- Storage Functions (omitted for brevity, content unchanged) ---
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
        projectCards.forEach(card => {
             card.classList.remove('websim-is-pinned');
             card.style.order = 0; // Reset order for unpinned
        });

        // Reorder, prioritizing pinned projects using CSS order property
        for (let i = pinnedNames.length - 1; i >= 0; i--) {
            const name = pinnedNames[i];
            const pinnedCard = projectCards.find(card => {
                const titleEl = card.querySelector(PROJECT_NAME_SELECTOR);
                return titleEl && titleEl.textContent.trim() === name;
            });

            if (pinnedCard) {
                pinnedCard.classList.add('websim-is-pinned');
                pinnedCard.style.order = -1; // Force to the top of the flex/grid
            } else {
                 // Remove missing project from storage
                 togglePin(name, false);
            }
        }
    }

    /**
     * Injects the pin button into each project card.
     */
    function injectPinButtons() {
        const pinnedNames = getPinnedProjects();
        const projectCards = document.querySelectorAll(PROJECT_CARD_SELECTOR);

        if (projectCards.length === 0) {
             console.log(`[WEBSIM-PINNER] Found 0 project cards. Check selector: ${PROJECT_CARD_SELECTOR}`);
             return;
        }

        projectCards.forEach((card, index) => {
            const titleEl = card.querySelector(PROJECT_NAME_SELECTOR);

            if (!titleEl) {
                console.warn(`[WEBSIM-PINNER] Card ${index + 1}: Skipping, cannot find project title. Check selector: ${PROJECT_NAME_SELECTOR}`);
                return;
            }

            const projectName = titleEl.textContent.trim();
            // Check if button already exists
            if (card.querySelector('.websim-pin-button')) {
                return;
            }

            const isPinned = pinnedNames.includes(projectName);

            const pinButton = document.createElement('button');
            pinButton.classList.add('websim-pin-button');
            pinButton.innerHTML = createSvgIcon(isPinned);
            pinButton.title = isPinned ? 'Unpin Project' : 'Pin Project';

            if (isPinned) {
                card.classList.add('websim-is-pinned');
            }

            // Click Handler
            pinButton.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const currentlyPinned = pinButton.getAttribute('data-pinned') === 'true';

                togglePin(projectName, !currentlyPinned);
                pinButton.setAttribute('data-pinned', !currentlyPinned);
                pinButton.title = !currentlyPinned ? 'Unpin Project' : 'Pin Project';
                pinButton.innerHTML = createSvgIcon(!currentlyPinned);
            });

            pinButton.setAttribute('data-pinned', isPinned);
            
            // Ensure the card is relative for the button's absolute positioning to work
            if (window.getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }
            // Inject into the card, relying on high Z-index to ensure visibility
            card.appendChild(pinButton);
            console.log(`[WEBSIM-PINNER] Successfully injected pin button into card: ${projectName}`);
        });
    }

    /**
     * Generates a simple, scalable SVG icon for the pin state.
     */
    function createSvgIcon(filled) {
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
            padding: 8px; 
            transition: transform 0.2s;
            touch-action: manipulation;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            /* Position relative to the main card */
            position: absolute; 
            top: 5px;
            right: 5px;
            z-index: 100; /* CRITICAL: Force button over all other elements */
        }

        .websim-pin-button:active {
            transform: scale(0.9);
        }

        .websim-pin-icon {
            width: 28px; 
            height: 28px;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4)); /* Stronger shadow for visibility */
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
            // Check if both the card and the container are present
            if (document.querySelector(PROJECT_CARD_SELECTOR) && document.querySelector(PROJECT_CONTAINER_SELECTOR)) {
                obs.disconnect();
                console.log("[WEBSIM-PINNER] Elements found. Injecting buttons.");
                injectPinButtons();
                reorderProjects();
                setupDynamicObserver();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupDynamicObserver() {
        const container = document.querySelector(PROJECT_CONTAINER_SELECTOR);
        if (container) {
            const listObserver = new MutationObserver(() => {
                injectPinButtons();
                reorderProjects();
            });
            listObserver.observe(container, { childList: true, subtree: true });
        }
    }

    init();
})();