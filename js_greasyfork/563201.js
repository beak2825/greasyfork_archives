// ==UserScript==
// @name         Grok Modal Toggle Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a toggle button to hide/unhide the Grok Auto-Retry control panel
// @author       You
// @license      MIT
// @match        https://grok.com/*
// @match        https://*.grok.com/*
// @match        https://grok.x.ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563201/Grok%20Modal%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563201/Grok%20Modal%20Toggle%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Grok Modal Toggle: Script loaded');

    // CSS for the toggle button
    GM_addStyle(`
        #grokModalToggleBtn {
            position: fixed;
            bottom: 20px;
            right: 140px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            user-select: none;
        }

        #grokModalToggleBtn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        #grokModalToggleBtn:active {
            transform: scale(0.95);
        }

        #grokModalToggleBtn.hidden-state {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        #grokModalToggleBtn.hidden-state:hover {
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
        }

        /* Tooltip */
        #grokModalToggleBtn::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 60px;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        #grokModalToggleBtn:hover::before {
            opacity: 1;
        }

        /* Animation for icon change */
        #grokModalToggleBtn span {
            transition: transform 0.3s ease;
        }

        #grokModalToggleBtn.hidden-state span {
            transform: rotate(180deg);
        }

        /* Class to hide panels */
        .grok-panel-hidden {
            display: none !important;
        }
    `);

    let cachedPanels = [];

    // Find all related panels with multiple detection methods
    function findAllPanels(includeHidden = false) {
        const panels = [];

        // Method 1: Look for fixed position elements with specific content
        const allElements = document.querySelectorAll('*');

        for (let elem of allElements) {
            // Skip if already found or if it's our toggle button
            if (panels.includes(elem) || elem.id === 'grokModalToggleBtn') continue;

            const style = window.getComputedStyle(elem);
            const text = elem.textContent || '';

            // Check if it has our hidden class (for finding hidden panels)
            const hasHiddenClass = elem.classList.contains('grok-panel-hidden');

            // Check if it's fixed position and contains Grok-related keywords
            if (style.position === 'fixed' &&
                (text.includes('Max Limit') ||
                 text.includes('Retry') ||
                 text.includes('Library') ||
                 text.includes('Favorites') ||
                 text.includes('History') ||
                 text.includes('Snippets') ||
                 text.includes('Auto-Retry'))) {

                // Include hidden panels if requested
                if (includeHidden || !hasHiddenClass) {
                    const rect = elem.getBoundingClientRect();
                    if (rect.width > 50 || hasHiddenClass) {
                        panels.push(elem);
                        console.log('Found panel:', elem, 'Hidden:', hasHiddenClass);
                    }
                }
            }
        }

        // Method 2: Check for panels with our hidden class
        if (includeHidden) {
            const hiddenPanels = document.querySelectorAll('.grok-panel-hidden');
            hiddenPanels.forEach(elem => {
                if (!panels.includes(elem) && elem.id !== 'grokModalToggleBtn') {
                    panels.push(elem);
                    console.log('Found hidden panel:', elem);
                }
            });
        }

        return panels;
    }

    // Store panel references
    function cachePanel() {
        const panels = findAllPanels(true); // Include hidden panels
        if (panels.length > 0) {
            cachedPanels = panels;
            console.log('Cached panels:', cachedPanels.length);
            return panels;
        }
        return [];
    }

    // Get cached or find panels
    function getPanels() {
        // First try to use cached panels
        if (cachedPanels.length > 0) {
            // Verify they still exist in DOM
            const stillValid = cachedPanels.filter(p => document.body.contains(p));
            if (stillValid.length > 0) {
                console.log('Using cached panels:', stillValid.length);
                return stillValid;
            }
        }

        // If cache is invalid, search again (including hidden)
        console.log('Cache invalid, searching for panels...');
        const panels = findAllPanels(true);
        if (panels.length > 0) {
            cachedPanels = panels;
        }
        return panels;
    }

    // Toggle panel visibility
    function togglePanel() {
        console.log('Toggle clicked!');
        const panels = getPanels();

        console.log('Found panels:', panels.length);

        if (panels.length === 0) {
            console.log('No panels found, scanning again...');
            const newPanels = cachePanel();
            if (newPanels.length === 0) {
                alert('Grok panels not found. Make sure the Grok Auto-Retry script is loaded first.');
                return;
            }
            togglePanel(); // Try again
            return;
        }

        const isCurrentlyHidden = panels[0].classList.contains('grok-panel-hidden');

        console.log('Currently hidden:', isCurrentlyHidden);

        if (isCurrentlyHidden) {
            showPanel(panels);
        } else {
            hidePanel(panels);
        }
    }

    // Hide the panel
    function hidePanel(panels) {
        panels.forEach(panel => {
            panel.classList.add('grok-panel-hidden');
        });
        GM_setValue('grokPanelHidden', true);
        updateButtonState(true);
        console.log('Panels hidden');
    }

    // Show the panel
    function showPanel(panels) {
        panels.forEach(panel => {
            panel.classList.remove('grok-panel-hidden');
        });
        GM_setValue('grokPanelHidden', false);
        updateButtonState(false);
        console.log('Panels shown');
    }

    // Update button appearance
    function updateButtonState(isHidden) {
        const btn = document.getElementById('grokModalToggleBtn');
        if (!btn) return;

        if (isHidden) {
            btn.classList.add('hidden-state');
            btn.innerHTML = '<span>👁️‍🗨️</span>';
            btn.setAttribute('data-tooltip', 'Show Grok Panel');
        } else {
            btn.classList.remove('hidden-state');
            btn.innerHTML = '<span>👁️</span>';
            btn.setAttribute('data-tooltip', 'Hide Grok Panel');
        }
    }

    // Create the toggle button
    function createToggleButton() {
        const btn = document.createElement('div');
        btn.id = 'grokModalToggleBtn';
        btn.innerHTML = '<span>👁️</span>';
        btn.setAttribute('data-tooltip', 'Hide Grok Panel');
        document.body.appendChild(btn);

        console.log('Toggle button created');

        // Add click event
        btn.addEventListener('click', (e) => {
            console.log('Button clicked');
            e.preventDefault();
            e.stopPropagation();
            togglePanel();
        });

        return btn;
    }

    // Keyboard shortcut (Ctrl+Shift+G)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'G') {
            e.preventDefault();
            console.log('Keyboard shortcut triggered');
            togglePanel();
        }
    });

    // Initialize
    function init() {
        console.log('Initializing Grok Modal Toggle');

        // Create toggle button immediately
        createToggleButton();

        // Try to find panels initially
        setTimeout(() => {
            const panels = cachePanel();
            console.log('Initial panel scan found:', panels.length, 'panels');

            // Apply saved state
            const isHidden = GM_getValue('grokPanelHidden', false);
            if (isHidden && panels.length > 0) {
                hidePanel(panels);
            }
        }, 2000);

        // Periodic check for panels
        setInterval(() => {
            if (panelSelectors.length === 0) {
                cachePanel();
            }
        }, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();