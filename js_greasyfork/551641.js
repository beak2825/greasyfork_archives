// ==UserScript==
// @name         Torn Poker - Button Protection & Reorder
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Prevents accidental sit-out, reorders buttons, and enhances bet panel
// @author       You
// @match        https://www.torn.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551641/Torn%20Poker%20-%20Button%20Protection%20%20Reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/551641/Torn%20Poker%20-%20Button%20Protection%20%20Reorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ⚙️ CONFIGURATION
    const FOLD_PROTECTION_DELAY_MS = 2000; // Delay after folding
    const ENABLE_BUTTON_REORDER = true;    // Set to false to disable reordering
    const BUTTON_WIDTH_MULTIPLIER = 1.3;   // Multiplier for bet button width (try 1.3 to 2.0)
    const BUTTON_HEIGHT_MULTIPLIER = 1.2;  // Multiplier for bet button height (try 1.2 to 1.8)

    let isBlocking = false;
    let betPanelModsEnabled = true; // Toggle for bet panel modifications
    let lastHighlightedBetButton = null; // Track which bet button is highlighted
    let lastButtonCount = 0; // Track button count changes to detect turn ending

    // Function to find button by text content
    function findButtonByText(textToFind) {
        const buttons = document.querySelectorAll('button.btn___UWGZz');
        for (let button of buttons) {
            if (button.textContent.trim().includes(textToFind)) {
                return button;
            }
        }
        return null;
    }

    // Function to find all current buttons
    function getAllButtons() {
        return Array.from(document.querySelectorAll('button.btn___UWGZz'));
    }

    // Block ALL button clicks for the protection period
    function blockAllClicks(e) {
        if (isBlocking) {
            const button = e.target.closest('button');
            if (button) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('[Torn Poker] 🛡️ BLOCKED click on:', button.textContent.trim());
                return false;
            }
        }
    }

    // Reorder buttons to standard poker layout: Fold, Call, Raise
    function reorderButtons() {
        if (!ENABLE_BUTTON_REORDER) return;

        const buttons = getAllButtons();
        const currentButtonCount = buttons.length;

        // Detect turn ending - only reset if we TRANSITION from 3 buttons to fewer
        // This means we went from having action buttons to not having them
        if (lastButtonCount === 3 && currentButtonCount <= 2) {
            resetBetButtonHighlights();
        }

        // Update the count for next time
        lastButtonCount = currentButtonCount;

        // Handle 2-button state (All-in or Fold when facing all-in bet)
        if (buttons.length === 2) {
            let foldButton = null;
            let actionButton = null;

            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                if (text.includes('Fold')) {
                    foldButton = btn;
                } else {
                    actionButton = btn; // All-in, Leave, Sit Out, etc.
                }
            });

            if (foldButton && actionButton) {
                const container = buttons[0].parentElement;
                if (container && container.style.display !== 'flex') {
                    container.style.display = 'flex';
                }

                // Only reorder if it's an action button (not Leave/Sit Out)
                const actionText = actionButton.textContent.trim();
                if (actionText.includes('All-in')) {
                    console.log('[Torn Poker] 🔄 Reordering buttons: [Fold] [' + actionText + ']');
                    foldButton.style.order = '1';
                    actionButton.style.order = '2';
                    return;
                }
            }

            // Reset ordering for non-action 2-button states
            buttons.forEach(btn => {
                btn.style.order = '';
            });
            return;
        }

        // Only reorder if we have exactly 3 buttons
        if (buttons.length !== 3) {
            // Reset any previous ordering
            buttons.forEach(btn => {
                btn.style.order = '';
            });
            return;
        }

        // Find each button by text
        let aggressiveButton = null;  // Raise/Bet/All-in OR Call Any
        let middleButton = null;       // Call/Check (not Call Any)
        let foldButton = null;

        buttons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('Fold')) {
                foldButton = btn;
            } else if (text.includes('Call Any')) {
                // Call Any is the aggressive action in waiting states
                aggressiveButton = btn;
            } else if (text.includes('Raise') || text.includes('Bet') || text.includes('All-in')) {
                // Active turn aggressive actions
                aggressiveButton = btn;
            } else if (text.includes('Call') || text.includes('Check')) {
                // Middle button (Call $X or Check)
                middleButton = btn;
            }
        });

        // If we found all 3 buttons, reorder them
        if (aggressiveButton && middleButton && foldButton) {
            const container = buttons[0].parentElement;

            // Make sure parent is flex container
            if (container && container.style.display !== 'flex') {
                container.style.display = 'flex';
            }

            // Log the reorder action
            const aggressiveText = aggressiveButton.textContent.trim();
            const middleText = middleButton.textContent.trim();
            console.log('[Torn Poker] 🔄 Reordering buttons: [Fold] [' + middleText + '] [' + aggressiveText + ']');

            // Set order: Fold=1, Middle=2, Aggressive=3
            foldButton.style.order = '1';
            middleButton.style.order = '2';
            aggressiveButton.style.order = '3';
        }
    }

    // Function to protect the fold button
    function protectFoldButton() {
        const foldButton = findButtonByText('Fold');

        if (!foldButton) return;

        // Check if we've already added protection
        if (foldButton.dataset.tornProtected) return;

        // Mark as protected
        foldButton.dataset.tornProtected = 'true';

        // Add click interceptor
        foldButton.addEventListener('click', function(e) {
            console.log('[Torn Poker] 🃏 Fold clicked - BLOCKING all clicks for ' + FOLD_PROTECTION_DELAY_MS + 'ms');

            // Activate blocking
            isBlocking = true;

            // Release after delay
            setTimeout(() => {
                isBlocking = false;
                console.log('[Torn Poker] ✅ Click blocking released');
            }, FOLD_PROTECTION_DELAY_MS);

        }, false);
    }

    // Modify the bet panel for easier betting
    function modifyBetPanel() {
        const betPanel = document.querySelector('.betPanel___KTyRY');
        if (!betPanel) return;

        // Check if already modified
        if (betPanel.dataset.tornModified) {
            // Just update the enabled/disabled state
            applyBetPanelState(betPanel);
            return;
        }

        // Mark as modified
        betPanel.dataset.tornModified = 'true';

        // Create and add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '⚙️';
        toggleBtn.title = 'Toggle bet panel modifications';
        toggleBtn.style.cssText = `
            margin-right: 10px;
            padding: 5px 10px;
            cursor: pointer;
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #555;
            border-radius: 3px;
            font-size: 14px;
        `;

        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            betPanelModsEnabled = !betPanelModsEnabled;
            toggleBtn.textContent = betPanelModsEnabled ? '⚙️' : '⚙️✕';
            applyBetPanelState(betPanel);
            console.log('[Torn Poker] Bet panel mods:', betPanelModsEnabled ? 'ENABLED' : 'DISABLED');
        });

        // Insert toggle button at the beginning
        betPanel.insertBefore(toggleBtn, betPanel.firstChild);

        // Add click listeners to bet buttons for highlighting
        addBetButtonHighlighting(betPanel);

        // Apply initial state
        applyBetPanelState(betPanel);

        console.log('[Torn Poker] 💰 Bet panel modified - Width: ' + BUTTON_WIDTH_MULTIPLIER + 'x, Height: ' + BUTTON_HEIGHT_MULTIPLIER + 'x');
    }

    // Add click highlighting to bet buttons
    function addBetButtonHighlighting(betPanel) {
        const betOptions = betPanel.querySelector('.betOptions___AB6Y8');
        if (!betOptions) return;

        const buttons = betOptions.querySelectorAll('li');
        buttons.forEach(btn => {
            // Skip if already has listener
            if (btn.dataset.highlightListener) return;
            btn.dataset.highlightListener = 'true';

            // Store the normal color from computed styles
            const normalStyle = window.getComputedStyle(btn);
            const normalColor = normalStyle.color;
            btn.dataset.normalColor = normalColor;

            // We'll use a darker/brighter version or capture on hover
            let hoverColor = null;

            // Try to detect hover color
            const hoverHandler = function() {
                const hoverStyle = window.getComputedStyle(btn);
                hoverColor = hoverStyle.color;
                btn.dataset.hoverColor = hoverColor;
            };
            btn.addEventListener('mouseenter', hoverHandler);

            // Handle click to highlight
            btn.addEventListener('click', function(e) {
                console.log('[Torn Poker] 🎯 Bet button clicked:', btn.textContent.trim());

                // Clear previous highlight
                if (lastHighlightedBetButton && lastHighlightedBetButton !== btn) {
                    const prevNormalColor = lastHighlightedBetButton.dataset.normalColor;
                    lastHighlightedBetButton.style.color = prevNormalColor;
                    lastHighlightedBetButton.dataset.highlighted = 'false';
                }

                // Apply highlight color (use hover color if available, otherwise force a visible color)
                const targetColor = btn.dataset.hoverColor || '#ffffff'; // white fallback
                btn.style.setProperty('color', targetColor, 'important');
                btn.dataset.highlighted = 'true';
                lastHighlightedBetButton = btn;

                console.log('[Torn Poker] Applied color:', targetColor);
            });
        });
    }

    // Reset bet button highlights (called when turn ends)
    function resetBetButtonHighlights() {
        if (lastHighlightedBetButton) {
            lastHighlightedBetButton.style.color = lastHighlightedBetButton.dataset.normalColor || '';
            lastHighlightedBetButton.dataset.highlighted = 'false';
            lastHighlightedBetButton = null;
            console.log('[Torn Poker] 🔄 Bet button highlights reset');
        }
    }

    // Apply or remove bet panel modifications based on toggle state
    function applyBetPanelState(betPanel) {
        const betOptions = betPanel.querySelector('.betOptions___AB6Y8');
        const betInputWrap = betPanel.querySelector('.betInputWrap___m3LI9');
        const toggleBtn = betPanel.querySelector('button[title="Toggle bet panel modifications"]');

        if (!betOptions || !betInputWrap) return;

        if (betPanelModsEnabled) {
            // Set up flex container
            betPanel.style.display = 'flex';
            betPanel.style.alignItems = 'center';

            // Keep toggle button on the left always
            if (toggleBtn) {
                toggleBtn.style.order = '0';
            }

            // Hide the money input completely
            betInputWrap.style.display = 'none';
            betInputWrap.style.order = '999'; // Push it to the end (hidden anyway)

            // Set order for bet options container
            betOptions.style.order = '1';

            // Reorder the individual bet buttons: Max, Min, 3BB, 1/2, Pot
            const buttons = betOptions.querySelectorAll('li');
            buttons.forEach(btn => {
                const text = btn.textContent.trim();

                // Store original styles if not already stored
                if (!btn.dataset.originalPadding) {
                    const computed = window.getComputedStyle(btn);
                    btn.dataset.originalPadding = computed.padding;
                    btn.dataset.originalFontSize = computed.fontSize;
                    btn.dataset.originalMinWidth = computed.minWidth;
                    btn.dataset.originalMinHeight = computed.minHeight;
                    btn.dataset.originalOrder = computed.order;
                }

                // Set order based on button text
                if (text.includes('Max')) {
                    btn.style.order = '1';
                } else if (text.includes('Min')) {
                    btn.style.order = '2';
                } else if (text.includes('3BB') || text === '3BB') {
                    btn.style.order = '3';
                } else if (text.includes('1/2') || text === '1/2') {
                    btn.style.order = '4';
                } else if (text.includes('Pot')) {
                    btn.style.order = '5';
                }

                // Calculate new sizes
                const basePaddingH = 15; // Base horizontal padding
                const basePaddingV = 8;  // Base vertical padding
                const baseFontSize = 14;

                btn.style.paddingLeft = (basePaddingH * BUTTON_WIDTH_MULTIPLIER) + 'px';
                btn.style.paddingRight = (basePaddingH * BUTTON_WIDTH_MULTIPLIER) + 'px';
                btn.style.paddingTop = (basePaddingV * BUTTON_HEIGHT_MULTIPLIER) + 'px';
                btn.style.paddingBottom = (basePaddingV * BUTTON_HEIGHT_MULTIPLIER) + 'px';
                btn.style.fontSize = (baseFontSize * Math.min(BUTTON_WIDTH_MULTIPLIER, BUTTON_HEIGHT_MULTIPLIER)) + 'px';
                btn.style.cursor = 'pointer';
            });

            // Make sure bet options is a flex container for ordering
            betOptions.style.display = 'flex';

        } else {
            // Restore original styles
            betPanel.style.display = '';
            betPanel.style.alignItems = '';
            betInputWrap.style.display = '';
            betInputWrap.style.order = '';
            betOptions.style.order = '';
            betOptions.style.display = '';

            if (toggleBtn) {
                toggleBtn.style.order = '';
            }

            const buttons = betOptions.querySelectorAll('li');
            buttons.forEach(btn => {
                btn.style.padding = btn.dataset.originalPadding || '';
                btn.style.fontSize = btn.dataset.originalFontSize || '';
                btn.style.minWidth = btn.dataset.originalMinWidth || '';
                btn.style.minHeight = btn.dataset.originalMinHeight || '';
                btn.style.order = btn.dataset.originalOrder || '';
            });
        }
    }

    // Watch for button changes
    const observer = new MutationObserver(function(mutations) {
        protectFoldButton();
        reorderButtons();
        modifyBetPanel();

        // Re-add bet button highlighting if bet panel exists
        const betPanel = document.querySelector('.betPanel___KTyRY');
        if (betPanel && betPanel.dataset.tornModified) {
            addBetButtonHighlighting(betPanel);
        }
    });

    // Start observing when page loads
    function init() {
        // Look for the poker button container
        const pokerButtons = document.querySelector('.btn___UWGZz');

        if (pokerButtons && pokerButtons.closest('div')) {
            const container = pokerButtons.closest('div').parentElement;

            // Watch for new buttons
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });

            // Add global click blocker to catch EVERYTHING
            document.addEventListener('click', blockAllClicks, true);

            // Initial setup
            protectFoldButton();
            reorderButtons();
            modifyBetPanel();

            console.log('[Torn Poker] ✅ Protection Active - Delay:', FOLD_PROTECTION_DELAY_MS + 'ms');
            console.log('[Torn Poker] ✅ Button Reorder:', ENABLE_BUTTON_REORDER ? 'ENABLED' : 'DISABLED');
        } else {
            // Retry if poker table not loaded yet
            setTimeout(init, 1000);
        }
    }

    // Start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();