// ==UserScript==
// @name         Gemini UI Hider + 100% Width (V8.4 - Dbl Click)
// @namespace    http://instagram.com/WaterDustLab
// @version      8.4
// @description  Hides UI on Double Right-Click, 100% width for ALL content, AND moves "go to end" button.
// @author       insta/@WaterDustLab
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556043/Gemini%20UI%20Hider%20%2B%20100%25%20Width%20%28V84%20-%20Dbl%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556043/Gemini%20UI%20Hider%20%2B%20100%25%20Width%20%28V84%20-%20Dbl%20Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. PERMANENT WIDEN/MOVE CSS (Sledgehammer) ---
    const widenCSS = `
        /* This makes the main PARENT container(s) 100% wide */
        .conversation-container,
        .chat-container,
        .conversation {
            max-width: 100% !important;
        }

        /* This makes the prompt box's PARENT 100% wide to match */
        .input-area-container,
        .input-area {
             max-width: 100% !important;
        }

        /* This forces BOTH bubble types to be 100% wide */
        .user-query-bubble-with-background,
        .response-content {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* Moves the "Scroll to Bottom" button to the far right */
        [aria-label="Scroll to bottom"] {
            left: auto !important;
            right: 1.5rem !important;
            transform: none !important;
            end: 1.5rem !important; /* Overrides centering */
        }
    `;
    GM_addStyle(widenCSS);

    // --- 2. TOGGLED UI HIDING ---

    // --- Selectors (Gemini Only) ---
    const geminiInputSelector = '.input-area-container';
    const geminiGradientSelector = '.input-gradient';
    const geminiDisclaimer = '.halluccihation-disclaimer';
    const geminiGoogleBar = '.boqOnegoogleliteOgbOneGoogleBar';
    const geminiTopBarActions = '.top-bar-actions';
    const geminiOgbBuffer = '.desktop-ogb-buffer';
    const geminiModelSwitcher = '.model-selector-button';
    const geminiLogo = '.bard-logo-container'; // Hides the top-left logo

    // --- State ---
    let isHidden = true;
    let lastRightClickTime = 0; // For double-click detection

    // --- Main Function ---
    function applyHidingState() {
        const allSelectors = [
            geminiInputSelector,
            geminiGradientSelector,
            geminiDisclaimer,
            geminiGoogleBar,
            geminiTopBarActions,
            geminiOgbBuffer,
            geminiModelSwitcher,
            geminiLogo
        ].join(', ');

        const elementsToHide = document.querySelectorAll(allSelectors);
        
        elementsToHide.forEach(el => {
            el.style.display = isHidden ? 'none' : '';
        });
    }

    // --- Toggle Listener (NEW: Double Right-Click) ---
    document.addEventListener('contextmenu', function(e) {
        
        const now = new Date().getTime();
        
        if ((now - lastRightClickTime) < 300) { // 300ms threshold for double-click
            // This is a double-click
            e.preventDefault();   // Stop the menu
            isHidden = !isHidden; // Flip the state
            applyHidingState();   // Re-apply the state
            lastRightClickTime = 0; // Reset timer
        } else {
            // This is the first right-click, so just record the time
            // We do NOT call e.preventDefault() here, so the normal menu will appear
            lastRightClickTime = now;
        }
    });

    // Reset timer on left-click so it doesn't interfere
    document.addEventListener('click', function() {
        lastRightClickTime = 0;
    });

    // --- Mutation Observer ---
    const observer = new MutationObserver(function(mutations) {
        applyHidingState();
    });

    // --- Start ---
    applyHidingState(); // Apply the hiding state on load
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();