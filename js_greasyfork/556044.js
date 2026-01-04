// ==UserScript==
// @name         ChatGPT UI Hider + 100% Width (V9.4 - Dbl Click)
// @namespace    http://instagram.com/WaterDustLab
// @version      9.4
// @description  Hides UI on Double Right-Click, 100% width, AND moves "go to end" button.
// @author       insta/@WaterDustLab
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556044/ChatGPT%20UI%20Hider%20%2B%20100%25%20Width%20%28V94%20-%20Dbl%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556044/ChatGPT%20UI%20Hider%20%2B%20100%25%20Width%20%28V94%20-%20Dbl%20Click%29.meta.js
// ==/UserScript==

(function() {
    'usestrict';
    
    console.log("ChatGPT UI Hider (V9.4) is RUNNING.");

    // --- 1. PERMANENT WIDEN/MOVE CSS ---
    const widenCSS = `
        /* This widens the main container for chat bubbles */
        [class*="max-w-(--thread-content-max-width)"] {
            max-width: 100% !important;
        }

        /* This widens the <form> that contains the prompt box to match */
        form:has(textarea#prompt-textarea) {
            max-width: 100% !important;
        }

        /* This overrides the 70% limit on YOUR chat bubbles */
        [class*="max-w-[var(--user-chat-width"] {
            max-width: 100% !important;
        }

        /* Moves the "Scroll to Bottom" button to the far right */
        [class*="end-1/2"][class*="translate-x-1/2"][class*="cursor-pointer"] {
            end: 1rem !important; /* 'end-4' equivalent */
            right: 1rem !important; /* Fallback for 'end' */
            left: auto !important; /* Remove any 'left' positioning */
            transform: none !important; /* Remove the 'translate-x(50%)' */
        }
    `;
    GM_addStyle(widenCSS);
    console.log("ChatGPT UI Hider (V9.4): 100% Widening + Button Move CSS injected.");

    // --- 2. TOGGLED UI HIDING ---

    // --- Selectors ---
    const gptPromptSelector = 'div#thread-bottom'; // Hides the whole bottom bar
    const gptDisclaimerSelector = 'div[class*="text-token-text-secondary"][class*="text-center"]'; // The disclaimer
    const gptSidebarSelector = 'div[role="navigation"]'; // The left sidebar
    const gptHeaderSelector = '#page-header'; // Hides the top "ChatGPT" bar

    // --- State ---
    let isHidden = true;
    let lastRightClickTime = 0; // For double-click detection

    // --- Main Function ---
    function applyHidingState() {
        const allSelectors = [
            gptPromptSelector,
            gptDisclaimerSelector,
            gptSidebarSelector,
            gptHeaderSelector
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
        childList: true,  // Watch for nodes being added or removed
        subtree: true     // Watch all descendants
    });

})();