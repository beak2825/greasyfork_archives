// ==UserScript==
// @name         Atlassian Confluence Floating ToC
// @namespace    https://gist.github.com/four43/31c68a090142032968c8a2f9a58862c3
// @version      1.0.3
// @description  Adds a floating, hierarchical table of contents to Confluence pages.
// @author       Seth Miller<seth@four43.com>
// @license      MIT
// @match        https://*.atlassian.net/wiki/spaces/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554770/Atlassian%20Confluence%20Floating%20ToC.user.js
// @updateURL https://update.greasyfork.org/scripts/554770/Atlassian%20Confluence%20Floating%20ToC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOC_PANEL_ID = 'gemini-floating-toc-panel';
    const TOC_BUTTON_ID = 'gemini-floating-toc-button';
    const TOC_LINKS_CONTAINER_ID = 'gemini-toc-links-container';
    const STORAGE_KEY = 'gemini-toc-visible';
    const WIDTH_STORAGE_KEY = 'gemini-toc-width';
    const DEFAULT_WIDTH = 280;
    const MIN_WIDTH = 200;
    const MAX_WIDTH = 600;

    // --- Global variables to hold our created elements and observer ---
    // We create these once and re-attach them if they get removed.
    let tocPanel = null;
    let tocButton = null;
    let contentObserver = null;
    let lastObserverTarget = null;
    let isScrollListenerAttached = false;
    let lastUrl = location.href;
    let ensureInterval = null;

    // --- 1. Add All CSS Styles ---
    // (This only needs to run once at the start)
    GM_addStyle(`
        /* 1. Make the main layout a flex container */
        #layout-main-wrapper {
            display: flex;
            flex-direction: row;
            position: relative;
        }

        /* 2. Style the ToC Panel */
        #${TOC_PANEL_ID} {
            width: 280px;
            flex-shrink: 0;
            height: calc(100vh - 100px);
            position: sticky;
            top: 55px; /* Match header height */
            overflow-y: auto;
            padding: 20px 15px;
            margin-left: 24px;
            background: var(--ds-surface-overlay, #FFFFFF);
            border-radius: 0px;
            border: 1px solid var(--ds-border, #0B120E24);
            transition: all 0.1s ease-in-out;
            font-size: 13px;
            box-sizing: border-box;
            opacity: 1;
        }

        /* Resize handle */
        #${TOC_PANEL_ID}::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            cursor: ew-resize;
            background: transparent;
            transition: background-color 0.2s ease;
        }

        #${TOC_PANEL_ID}:hover::after {
            /* background: var(--ds-border, rgba(11, 18, 14, 0.14)); */
        }

        #${TOC_PANEL_ID}.resizing {
            transition: none;
            user-select: none;
        }

        #${TOC_PANEL_ID}.resizing::after {
            background: var(--ds-border-selected, #2e2e2eff);
        }

        /* 3. Hidden State for ToC */
        #${TOC_PANEL_ID}.hidden {
            width: 0;
            padding: 0;
            margin: 0;
            border: none;
            overflow: hidden;
            opacity: 0;
        }

        /* 4. ToC Header */
        #${TOC_PANEL_ID} h4 {
            margin-top: 0;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--ds-border, #0B120E24);
            color: var(--ds-text, #292A2E);
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
        }

        /* 5. ToC Links */
        #${TOC_LINKS_CONTAINER_ID} a {
            display: block;
            padding: 5px 8px;
            text-decoration: none !important;
            color: var(--ds-link, #1868DB) !important;
            border-radius: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: background-color 0.2s ease;
        }

        #${TOC_LINKS_CONTAINER_ID} a:hover {
            background-color: var(--ds-background-neutral-hovered, #F0F1F2);
            color: var(--ds-link-pressed, #1558BC) !important;
        }

        /* 6. Active Link Highlighting */
        #${TOC_LINKS_CONTAINER_ID} a.active {
            background-color: var(--ds-background-selected, #E9F2FE);
            color: var(--ds-link-pressed, #1558BC) !important;
            font-weight: 600;
        }

        /* 7. Hierarchy Padding */
        #${TOC_LINKS_CONTAINER_ID} .toc-h1 { padding-left: 8px; font-weight: 600; }
        #${TOC_LINKS_CONTAINER_ID} .toc-h2 { padding-left: 16px; }
        #${TOC_LINKS_CONTAINER_ID} .toc-h3 { padding-left: 24px; font-size: 12px; }
        #${TOC_LINKS_CONTAINER_ID} .toc-h4 { padding-left: 32px; font-size: 12px; color: var(--ds-text-subtle, #505258); }

        /* 8. Toggle Button */
        #${TOC_BUTTON_ID} {
            background: transparent;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            height: 32px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            /* Match the fill color of other icons */
            color: var(--ds-text-subtle, #FFF);
        }

        #${TOC_BUTTON_ID} svg path {
             /* Use 'currentColor' to inherit the white from the button's color style */
            fill: currentColor !important;
        }

        #${TOC_BUTTON_ID}:hover {
            background-color: var(--ds-top-bar-button-background-hovered, rgba(255, 255, 255, 0.1));
        }

        #${TOC_BUTTON_ID}.active {
            background-color: var(--ds-top-bar-button-selected-background, rgba(255, 255, 255, 0.15));
        }

        /* 9. Responsive: Hide on smaller screens */
        @media (max-width: 1024px) {
            #${TOC_PANEL_ID}, #${TOC_BUTTON_ID} {
                display: none;
            }
        }
    `);

    // --- 2. Create/Get Panel Element ---
    // Creates the panel in memory once, so we can re-attach it later.
    function getTocPanel() {
        if (!tocPanel) {
            console.log('Floating ToC: Creating panel element in memory.');
            tocPanel = document.createElement('div');
            tocPanel.id = TOC_PANEL_ID;
            tocPanel.innerHTML = `<h4>Table of Contents</h4><div id="${TOC_LINKS_CONTAINER_ID}"></div>`;

            // Apply saved width
            const savedWidth = GM_getValue(WIDTH_STORAGE_KEY, DEFAULT_WIDTH);
            tocPanel.style.width = `${savedWidth}px`;

            // Add resize functionality
            setupResize(tocPanel);
        }
        return tocPanel;
    }

    // --- Helper function to setup resize functionality ---
    function setupResize(panel) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        const onMouseDown = (e) => {
            const rect = panel.getBoundingClientRect();
            const handleArea = 8; // Match the ::after width

            // Check if click is in the resize handle area (left side)
            if (e.clientX >= rect.left && e.clientX <= rect.left + handleArea) {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startWidth = panel.offsetWidth;
                panel.classList.add('resizing');

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        };

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const delta = startX - e.clientX; // Reversed: moving left increases width
            const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
            panel.style.width = `${newWidth}px`;
        };

        const onMouseUp = () => {
            if (!isResizing) return;

            isResizing = false;
            panel.classList.remove('resizing');

            // Save the new width
            const currentWidth = panel.offsetWidth;
            GM_setValue(WIDTH_STORAGE_KEY, currentWidth);
            console.log('Floating ToC: Saved width:', currentWidth);

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        panel.addEventListener('mousedown', onMouseDown);
    }

    // --- 3. Create/Get Button Element ---
    // Creates the button in memory once, so we can re-attach it later.
    function getTocButton() {
        if (!tocButton) {
            console.log('Floating ToC: Creating button element in memory.');
            tocButton = document.createElement('button');
            tocButton.id = TOC_BUTTON_ID;
            tocButton.title = 'Toggle Table of Contents';
            // Start with closed state icon
            tocButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="#fdfdfd" d="M11.5 16V8l-4 4zm4.5 3h3V5h-3zM5 19h9V5H5zm11 0h3zM3 21V3h18v18z"/></svg>
            `;

            // Add click listener ONCE
            tocButton.addEventListener('click', () => {
                const panel = getTocPanel(); // Get the panel
                const isCurrentlyVisible = !panel.classList.contains('hidden');
                toggleTOC(panel, tocButton, !isCurrentlyVisible);
            });
        }
        return tocButton;
    }

    // --- 4. Populate the ToC Panel ---
    function populateTOC() {
        const panel = getTocPanel();
        const linksContainer = panel.querySelector(`#${TOC_LINKS_CONTAINER_ID}`);
        if (!linksContainer) return;

        linksContainer.innerHTML = '';
        const headings = document.querySelectorAll('#main-content.wiki-content h1, #main-content.wiki-content h2, #main-content.wiki-content h3, #main-content.wiki-content h4');

        if (headings.length === 0) {
            linksContainer.innerHTML = 'No headings found on this page.';
            return;
        }

        headings.forEach(heading => {
            if (!heading.id) {
                return; // Skip headings without IDs
            }

            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;
            const level = heading.tagName.toLowerCase();
            link.className = 'toc-' + level;

            // Smooth scroll
            link.onclick = (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (history.pushState) {
                    history.pushState(null, null, '#' + heading.id);
                } else {
                    location.hash = '#' + heading.id;
                }
            };

            linksContainer.appendChild(link);
        });
    }

    // --- 5. Toggle Visibility ---
    function toggleTOC(panel, button, isVisible) {
        if (panel) {
            panel.classList.toggle('hidden', !isVisible);
        }
        if (button) {
            button.classList.toggle('active', isVisible);
            // Update button icon based on state
            updateButtonIcon(button, isVisible);
        }
        GM_setValue(STORAGE_KEY, isVisible);
    }

    // --- Helper function to update button icon ---
    function updateButtonIcon(button, isOpen) {
        if (!button) return;

        if (isOpen) {
            // Open state icon
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="#fdfdfd" d="M11.5 16V8l-4 4zM5 19h9V5H5zm-2 2V3h18v18z"/></svg>
            `;
        } else {
            // Closed state icon
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="#fdfdfd" d="M11.5 16V8l-4 4zm4.5 3h3V5h-3zM5 19h9V5H5zm11 0h3zM3 21V3h18v18z"/></svg>
            `;
        }
    }

    // --- 6. Highlight Active Link on Scroll ---
    let scrollTimeout;
    function onScroll() {
        console.debug('Floating ToC (Scroll): onScroll triggered');

        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = requestAnimationFrame(() => {
            const headings = document.querySelectorAll('#main-content.wiki-content h1[id], #main-content.wiki-content h2[id], #main-content.wiki-content h3[id], #main-content.wiki-content h4[id]');
            const tocLinks = document.querySelectorAll(`#${TOC_LINKS_CONTAINER_ID} a`);

            console.debug('Floating ToC (Scroll): Found', headings.length, 'headings and', tocLinks.length, 'links');

            const scrollOffset = 70; // 60px header height + 10px buffer
            let activeHeadingId = null;

            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const rect = heading.getBoundingClientRect();

                console.debug(`Floating ToC (Scroll): Heading "${heading.textContent.substring(0, 20)}..." - top: ${rect.top}, scrollOffset: ${scrollOffset}`);

                if (rect.top <= scrollOffset) {
                    activeHeadingId = heading.id;
                    console.debug('Floating ToC (Scroll): Active heading ID:', activeHeadingId);
                    break;
                }
            }

            tocLinks.forEach(link => {
                const wasActive = link.classList.contains('active');
                const shouldBeActive = link.getAttribute('href') === '#' + activeHeadingId;
                link.classList.toggle('active', shouldBeActive);

                if (shouldBeActive && !wasActive) {
                    console.debug('Floating ToC (Scroll): Activated link:', link.textContent);
                }
            });
        });
    }

    // --- Helper function to find the actual scrollable container ---
    function findScrollContainer() {
        // Try common Confluence scroll containers
        const candidates = [
            document.querySelector('#AkMainContent'), // Primary scroll container in Confluence
            document.querySelector('#ak-main-content'),
            document.querySelector('[data-test-id="content-body"]'),
            document.querySelector('.wiki-page-content'),
            document.documentElement,
            document.body
        ];

        for (const element of candidates) {
            if (element && element.scrollHeight > element.clientHeight) {
                console.log('Floating ToC (Init): Found scroll container:', element.id || element.className || element.tagName);
                return element;
            }
        }

        console.log('Floating ToC (Init): Using window as scroll container');
        return window;
    }

    // --- 7. Check if on Edit Page ---
    function isEditPage() {
        return location.href.includes('/pages/edit-v2/');
    }

    // --- 8. Remove All Elements ---
    function removeElements() {
        console.log('Floating ToC: Removing elements (edit page detected)');

        // Remove panel
        const panel = document.getElementById(TOC_PANEL_ID);
        if (panel) {
            panel.remove();
        }

        // Remove button
        const button = document.getElementById(TOC_BUTTON_ID);
        if (button) {
            button.remove();
        }

        // Disconnect observer
        if (contentObserver) {
            contentObserver.disconnect();
            contentObserver = null;
            lastObserverTarget = null;
        }

        // Remove scroll listener
        if (isScrollListenerAttached) {
            const scrollContainer = findScrollContainer();
            scrollContainer.removeEventListener('scroll', onScroll);
            isScrollListenerAttached = false;
        }
    }

    // --- 9. Main "Ensurer" Loop ---
    // This runs periodically to make sure our elements haven't been wiped out by SPA re-renders
    function ensureElements() {
        const mainWrapper = document.querySelector('#layout-main-wrapper');
        const shareRestrictButton = document.querySelector('div[data-vc="share-restrict-and-copy-button"]');
        const contentContainer = document.querySelector('#main-content.wiki-content');

        // Wait for all key elements to be on the page
        if (!mainWrapper || !shareRestrictButton || !contentContainer) {
            console.log('Floating ToC (Ensurer): Waiting for core layout elements...');
            return;
        }

        // Get saved state early so we can use it for both new and existing elements
        const savedState = GM_getValue(STORAGE_KEY, true);

        // --- Ensure Panel ---
        let panel = document.getElementById(TOC_PANEL_ID);
        if (!panel) {
            console.log('Floating ToC (Ensurer): Panel not found. Injecting...');
            panel = getTocPanel(); // Get or create
            mainWrapper.appendChild(panel);
            toggleTOC(panel, null, savedState);
        } else {
            // Panel exists, ensure it matches saved state
            const isCurrentlyVisible = !panel.classList.contains('hidden');
            if (isCurrentlyVisible !== savedState) {
                console.log('Floating ToC (Ensurer): Syncing panel state to saved state:', savedState);
                toggleTOC(panel, null, savedState);
            }
            // Ensure width is applied (in case panel was recreated by Confluence)
            const savedWidth = GM_getValue(WIDTH_STORAGE_KEY, DEFAULT_WIDTH);
            if (panel.style.width !== `${savedWidth}px`) {
                panel.style.width = `${savedWidth}px`;
            }
        }

        // --- Ensure Button ---
        let button = document.getElementById(TOC_BUTTON_ID);
        if (!button) {
            console.log('Floating ToC (Ensurer): Button not found. Injecting...');
            const shareButtonContainer = shareRestrictButton.closest('div[data-testid="share-action-container-without-separator"]');
            if (shareButtonContainer && shareButtonContainer.parentElement) {
                const buttonContainer = shareButtonContainer.parentElement;
                button = getTocButton(); // Get or create
                buttonContainer.insertBefore(button, shareButtonContainer);
                toggleTOC(null, button, savedState);
            } else {
                 console.log('Floating ToC (Ensurer): Could not find share button parent.');
            }
        } else {
            // Button exists, ensure it matches saved state
            const isCurrentlyActive = button.classList.contains('active');
            if (isCurrentlyActive !== savedState) {
                console.log('Floating ToC (Ensurer): Syncing button state to saved state:', savedState);
                toggleTOC(null, button, savedState);
            }
        }

        // --- Ensure Observer & Content ---
        // Only attach observer if it's not attached or if the content element has changed
        if (!contentObserver || lastObserverTarget !== contentContainer) {
            console.log('Floating ToC (Ensurer): Attaching observer and populating ToC.');

            // Disconnect old one if it exists
            if (contentObserver) {
                contentObserver.disconnect();
            }

            populateTOC();

            let populateDebounce;
            contentObserver = new MutationObserver(() => {
                console.log('Floating ToC (Observer): Content change detected, repopulating.');
                clearTimeout(populateDebounce);
                populateDebounce = setTimeout(populateTOC, 300);
            });
            contentObserver.observe(contentContainer, { childList: true, subtree: true });
            lastObserverTarget = contentContainer;

            // Add scroll listener (only needs to be done once)
            if (!isScrollListenerAttached) {
                console.log('Floating ToC (Ensurer): Attaching scroll listener.');
                const scrollContainer = findScrollContainer();
                scrollContainer.addEventListener('scroll', onScroll, { passive: true });
                isScrollListenerAttached = true;

                // Trigger once to set initial state
                onScroll();
            }
        }
    }

    // --- 10. Monitor URL Changes ---
    function checkUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log('Floating ToC: URL changed from', lastUrl, 'to', currentUrl);
            lastUrl = currentUrl;

            if (isEditPage()) {
                // Stop the ensurer and remove elements
                if (ensureInterval) {
                    clearInterval(ensureInterval);
                    ensureInterval = null;
                }
                removeElements();
            } else {
                // Start the ensurer if not already running
                if (!ensureInterval) {
                    console.log('Floating ToC: Starting ensurer (view page detected)');
                    ensureInterval = setInterval(ensureElements, 1000);
                }
            }
        }
    }

    // --- 11. Start Everything ---
    console.log('Floating ToC: Starting script...');

    // Check URL changes frequently
    setInterval(checkUrlChange, 500);

    // Only start ensurer if not on edit page
    if (!isEditPage()) {
        console.log('Floating ToC: Initial load - starting ensurer');
        ensureInterval = setInterval(ensureElements, 1000);
    } else {
        console.log('Floating ToC: Initial load - edit page detected, not starting');
    }

})();
