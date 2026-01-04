// ==UserScript==
// @name         JAV-Forum FAB Menu (Bottom Right)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a floating action button (FAB) at the bottom right to access the account menu and notifications without scrolling back to the top.
// @author       Gemini 3 Pro
// @match        https://jav-forum.com/*
// @match        https://www.jav-forum.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558170/JAV-Forum%20FAB%20Menu%20%28Bottom%20Right%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558170/JAV-Forum%20FAB%20Menu%20%28Bottom%20Right%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION =================
    const ORIGINAL_TRIGGER_SELECTOR = '.p-navgroup-link--user';
    const FADE_DELAY = 2000; // 2 seconds delay before fading out
    const FADED_OPACITY = '0.3'; // Opacity when idle (0.0 to 1.0)
    // =================================================

    let fabButton = null;
    let originalTrigger = null;
    let fadeTimer = null; // Timer variable

    // 1. Inject CSS Styles
    const css = `
        /* FAB Container Styles */
        #jf-fab-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9990;
            cursor: pointer;
            /* Transition for smooth fading and clicking */
            transition: transform 0.2s, opacity 0.5s ease-in-out;
            -webkit-tap-highlight-color: transparent;
            opacity: 1; /* Default full visibility */
        }

        /* The class for semi-transparent state */
        #jf-fab-container.jf-fab-faded {
            opacity: ${FADED_OPACITY};
        }

        /* Always restore opacity on Hover or Click */
        #jf-fab-container:hover,
        #jf-fab-container:active {
            opacity: 1 !important;
        }

        #jf-fab-container:active {
            transform: scale(0.95);
        }

        /* Avatar Circle Styles */
        .jf-fab-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid #fff;
            background-color: #eee;
        }
        .jf-fab-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Red Notification Badge */
        .jf-fab-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #E53935;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: bold;
            border: 2px solid #fff;
            min-width: 18px;
            text-align: center;
            display: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .jf-fab-badge.has-unread {
            display: block;
        }

        /* Force Menu Position */
        body.fab-mode .menu--structural {
            position: fixed !important;
            top: auto !important;
            bottom: 90px !important;
            right: 20px !important;
            left: auto !important;
            transform: none !important;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999 !important;
            transform-origin: bottom right !important;
            animation: fabMenuFadeIn 0.2s ease-out;
        }

        @keyframes fabMenuFadeIn {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    GM_addStyle(css);

    // 2. Initialize
    function init() {
        originalTrigger = document.querySelector(ORIGINAL_TRIGGER_SELECTOR);

        if (!originalTrigger) {
            console.log("JAV-Forum FAB: Not logged in.");
            return;
        }

        createFab();
        syncData();
        setupObservers();
        
        // Start the initial countdown to fade out
        scheduleFade();
    }

    // Helper: Function to start the fade-out timer
    function scheduleFade() {
        // Clear any existing timer first
        if (fadeTimer) clearTimeout(fadeTimer);
        
        // Set a new timer
        fadeTimer = setTimeout(() => {
            if (fabButton && !document.body.classList.contains('fab-mode')) {
                fabButton.classList.add('jf-fab-faded');
            }
        }, FADE_DELAY);
    }

    // Helper: Function to wake up the button (make it 100% visible)
    function wakeUp() {
        if (fadeTimer) clearTimeout(fadeTimer);
        if (fabButton) fabButton.classList.remove('jf-fab-faded');
    }

    // 3. Create FAB
    function createFab() {
        const container = document.createElement('div');
        container.id = 'jf-fab-container';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'jf-fab-avatar';

        const img = document.createElement('img');
        const originalImg = originalTrigger.querySelector('img');
        if (originalImg) img.src = originalImg.src;
        avatarDiv.appendChild(img);

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'jf-fab-badge';
        badgeSpan.innerText = '0';

        container.appendChild(avatarDiv);
        container.appendChild(badgeSpan);
        document.body.appendChild(container);

        fabButton = container;
        fabButton.addEventListener('click', handleFabClick);
        
        // Optional: Reset timer if mouse moves over it (prevents fading while trying to click)
        fabButton.addEventListener('mouseenter', wakeUp);
        fabButton.addEventListener('mouseleave', scheduleFade);
    }

    // 4. Handle FAB Click
    function handleFabClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // 1. Always wake up on click
        wakeUp();

        const isXenForoMenuOpen = originalTrigger.classList.contains('is-menuOpen');

        if (isXenForoMenuOpen) {
            // == CLOSE LOGIC ==
            document.body.classList.remove('fab-mode');
            document.body.click(); 
            // Restart the fade timer because we just closed it
            scheduleFade(); 

        } else {
            // == OPEN LOGIC ==
            document.body.classList.add('fab-mode');
            originalTrigger.click();

            // While menu is open, we do NOT want it to fade. 
            // So we don't call scheduleFade() here.

            setTimeout(() => {
                const closer = () => {
                    document.body.classList.remove('fab-mode');
                    // When clicking outside to close, restart the fade timer
                    scheduleFade();
                };
                document.addEventListener('click', closer, { once: true });
            }, 50);
        }
    }

    // 5. Sync Data
    function syncData() {
        if (!fabButton || !originalTrigger) return;

        const count = originalTrigger.getAttribute('data-badge');
        const badgeEl = fabButton.querySelector('.jf-fab-badge');

        if (count && parseInt(count) > 0) {
            badgeEl.innerText = count;
            badgeEl.classList.add('has-unread');
            // Optional: If a new notification arrives, wake up the button to alert the user
            wakeUp();
            scheduleFade();
        } else {
            badgeEl.classList.remove('has-unread');
        }

        const originalImg = originalTrigger.querySelector('img');
        const fabImg = fabButton.querySelector('img');
        if (originalImg && fabImg && fabImg.src !== originalImg.src) {
            fabImg.src = originalImg.src;
        }
    }

    // 6. Setup Observers
    function setupObservers() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    syncData();
                }
            });
        });

        observer.observe(originalTrigger, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['data-badge', 'src', 'class']
        });
    }

    init();

})();