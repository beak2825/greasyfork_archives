// ==UserScript==
// @name         Torn Attack Babysitter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Spam spacebar to attack when available or refresh when not
// @author       You
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/profiles.php?XID=*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562885/Torn%20Attack%20Babysitter.user.js
// @updateURL https://update.greasyfork.org/scripts/562885/Torn%20Attack%20Babysitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pageReady = false;

    // Wait for the attack page to fully render
    function waitForPageReady() {
        // Look for the player models area which indicates React has rendered
        const playersArea = document.querySelector('[class*="playersModelWrap"], [class*="players___"]');
        if (playersArea) {
            pageReady = true;
            console.log('[Babysitter] Page ready');
            return;
        }

        // Keep checking until ready
        setTimeout(waitForPageReady, 100);
    }

    // Start checking for page ready
    waitForPageReady();

    function findAttackButton() {
        // Try specific selector first (button inside dialog)
        const dialogButton = document.querySelector('[class*="dialogButtons"] button.torn-btn');
        if (dialogButton && dialogButton.textContent.trim().toLowerCase() === 'start fight') {
            return dialogButton;
        }

        // Fallback: search all buttons
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.trim().toLowerCase() === 'start fight') {
                return btn;
            }
        }

        return null;
    }

    document.addEventListener('keydown', function(event) {
        // Only trigger on spacebar
        if (event.code !== 'Space') {
            return;
        }

        // Don't trigger if user is typing in an input field
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' ||
                              activeElement.tagName === 'TEXTAREA' ||
                              activeElement.isContentEditable)) {
            return;
        }

        // Prevent default spacebar behavior (scrolling)
        event.preventDefault();

        // Wait for page to be ready
        if (!pageReady) {
            console.log('[Babysitter] Page not ready yet, waiting...');
            return;
        }

        const attackButton = findAttackButton();
        console.log('[Babysitter] Attack button found:', !!attackButton);

        if (attackButton) {
            // Button found - click it
            attackButton.click();
            console.log('[Babysitter] Clicked attack button');
        } else {
            // Button not found - refresh the page
            console.log('[Babysitter] Attack button not found, refreshing...');
            location.reload();
        }
    });

    console.log('[Babysitter] Torn Attack Babysitter loaded - Press SPACE to attack or refresh');

    // ========================================
    // PROFILE PAGE - Override attack button
    // ========================================

    if (window.location.pathname === '/profiles.php') {
        function overrideAttackButton() {
            const attackBtn = document.querySelector('.profile-button-attack');
            if (!attackBtn) {
                // Button not loaded yet, retry
                setTimeout(overrideAttackButton, 100);
                return;
            }

            // Check if we already modified it
            if (attackBtn.dataset.babysitterModified) {
                return;
            }

            // Make it open in a new tab
            attackBtn.target = '_blank';

            // Remove disabled class and styling so it's always clickable
            attackBtn.classList.remove('disabled');
            const icon = attackBtn.querySelector('svg');
            if (icon) {
                icon.classList.remove('disabled___xBFso');
            }

            // Get the attack URL from the href
            const attackUrl = attackBtn.href;

            // Add click handler that forces navigation
            attackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open(attackUrl, '_blank');
            }, true);

            // Mark as modified
            attackBtn.dataset.babysitterModified = 'true';
            console.log('[Babysitter] Attack button modified to open in new tab:', attackUrl);
        }

        overrideAttackButton();
    }
})();
