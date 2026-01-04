// ==UserScript==
// @name         Zendesk Taller Macro Menu
// @namespace    Lonnng menu.
// @version      1.4
// @description  Makes the Zendesk macro menu 75% of window height with working scroll and navigation. (Excludes bulk edit)
// @author       Charles Magnuson
// @match        https://*.zendesk.com/agent/*
// @grant        GM_addStyle
// @license      MIT
// @icon         N/A
// @homepage     https://github.com/CharlesMagnuson/Zendesk-taller-macro-menu/
// @downloadURL https://update.greasyfork.org/scripts/558297/Zendesk%20Taller%20Macro%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/558297/Zendesk%20Taller%20Macro%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for the macro menu - excluding bulk edit contexts
    GM_addStyle(`
        /* Main macro dropdown - exclude bulk edit modal contexts */
        .macro-suggestions:not([data-bulk-edit] .macro-suggestions):not(.modal .macro-suggestions),
        .macros_dropdown:not([data-bulk-edit] .macros_dropdown):not(.modal .macros_dropdown),
        [data-test-id="macro-suggestions"]:not([data-bulk-edit] [data-test-id="macro-suggestions"]):not(.modal [data-test-id="macro-suggestions"]),
        [data-garden-id="dropdowns.menu"]:not([data-bulk-edit] [data-garden-id="dropdowns.menu"]):not(.modal [data-garden-id="dropdowns.menu"]),
        [aria-label*="macro" i]:not([data-bulk-edit] [aria-label*="macro" i]):not(.modal [aria-label*="macro" i]) {
            max-height: 75vh !important;
            height: auto !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        /* Exclude bulk edit modal by checking for specific parent classes */
        body:not(.bulk-editing) .macro-suggestions,
        body:not(.bulk-editing) .macros_dropdown,
        body:not(.bulk-editing) [data-test-id="macro-suggestions"],
        :not([role="dialog"]) > :not(.bulk-actions) .macro-suggestions,
        :not([role="dialog"]) > :not(.bulk-actions) [data-test-id="macro-suggestions"] {
            max-height: 75vh !important;
        }

        /* Inner scrollable container - exclude bulk edit */
        :not([role="dialog"]) .macro-list:not(.bulk-edit-macro-list),
        :not([role="dialog"]) .macros-list:not(.bulk-edit-macros-list),
        :not([role="dialog"]) [data-test-id="macro-list"],
        :not([role="dialog"]) [data-garden-id="dropdowns.menu"] > ul,
        :not([role="dialog"]) .macros_dropdown > ul,
        :not([role="dialog"]) .macro-suggestions > ul {
            max-height: calc(75vh - 40px) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        /* Keep navigation header visible - exclude bulk edit */
        :not([role="dialog"]) .macro-suggestions-header,
        :not([role="dialog"]) .macros_dropdown-header,
        :not([role="dialog"]) .macro-navigation,
        :not([role="dialog"]) .macro-folder-navigation,
        :not([role="dialog"]) [data-test-id="macro-suggestions"] > div:first-child:has(button),
        :not([role="dialog"]) [data-garden-id="dropdowns.menu"] > header {
            position: sticky !important;
            top: 0 !important;
            z-index: 100 !important;
            background: white !important;
            border-bottom: 1px solid #e9ebed !important;
        }

        /* Back button and breadcrumbs - exclude bulk edit */
        :not([role="dialog"]) [aria-label="Back"],
        :not([role="dialog"]) [data-test-id="back-button"],
        :not([role="dialog"]) button[aria-label*="folder"],
        :not([role="dialog"]) .macro-folder-back {
            display: flex !important;
            visibility: visible !important;
        }

        /* Search box if present - exclude bulk edit */
        :not([role="dialog"]) .macro-search,
        :not([role="dialog"]) input[placeholder*="Search macros"],
        :not([role="dialog"]) input[placeholder*="Filter macros"] {
            position: sticky !important;
            top: 0 !important;
            z-index: 99 !important;
            background: white !important;
        }

        /* Ensure proper scrollbar styling - exclude bulk edit */
        :not([role="dialog"]) .macro-suggestions::-webkit-scrollbar,
        :not([role="dialog"]) .macro-list::-webkit-scrollbar,
        :not([role="dialog"]) [data-garden-id="dropdowns.menu"]::-webkit-scrollbar {
            width: 8px !important;
        }

        :not([role="dialog"]) .macro-suggestions::-webkit-scrollbar-track,
        :not([role="dialog"]) .macro-list::-webkit-scrollbar-track,
        :not([role="dialog"]) [data-garden-id="dropdowns.menu"]::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
        }

        :not([role="dialog"]) .macro-suggestions::-webkit-scrollbar-thumb,
        :not([role="dialog"]) .macro-list::-webkit-scrollbar-thumb,
        :not([role="dialog"]) [data-garden-id="dropdowns.menu"]::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 4px !important;
        }

        /* Individual macro items - exclude bulk edit */
        :not([role="dialog"]) .macro-item,
        :not([role="dialog"]) .macro-suggestion-item {
            padding: 8px 12px !important;
        }
    `);

    // Enhanced JavaScript to check context before applying changes
    function expandMacroMenu() {
        const windowHeight = window.innerHeight;
        const menuHeight = Math.floor(windowHeight * 0.75);

        // Target all possible macro menu containers
        const selectors = [
            '.macro-suggestions',
            '.macros_dropdown',
            '[data-test-id="macro-suggestions"]',
            '[data-garden-id="dropdowns.menu"]',
            '[aria-label*="macro" i]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Check if this element is within a bulk edit context
                const isInModal = element.closest('[role="dialog"]') !== null;
                const isInBulkEdit = element.closest('.bulk-actions') !== null || 
                                   element.closest('[data-bulk-edit]') !== null ||
                                   element.closest('.modal') !== null ||
                                   element.closest('[aria-label*="bulk" i]') !== null;

                // Only apply changes if NOT in bulk edit context
                if (element && element.textContent.includes('macro') && !isInModal && !isInBulkEdit) {
                    // Set max height and ensure scrolling works
                    element.style.maxHeight = `${menuHeight}px`;
                    element.style.overflowY = 'auto';
                    element.style.overflowX = 'hidden';

                    // Find any inner list containers and ensure they can scroll too
                    const innerLists = element.querySelectorAll('ul, .macro-list, .macros-list');
                    innerLists.forEach(list => {
                        list.style.maxHeight = `${menuHeight - 40}px`;
                        list.style.overflowY = 'auto';
                        list.style.overflowX = 'hidden';
                    });
                }
            });
        });
    }

    // Run after a short delay to ensure DOM is ready
    setTimeout(expandMacroMenu, 500);

    // Re-run on window resize
    window.addEventListener('resize', expandMacroMenu);

    // Enhanced observer that checks for bulk edit context
    const observer = new MutationObserver((mutations) => {
        // Check if any of the mutations are within a bulk edit context
        let shouldRun = true;
        
        for (const mutation of mutations) {
            if (mutation.target.closest('[role="dialog"]') || 
                mutation.target.closest('.bulk-actions') ||
                mutation.target.closest('[data-bulk-edit]')) {
                shouldRun = false;
                break;
            }
        }
        
        if (shouldRun) {
            expandMacroMenu();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
