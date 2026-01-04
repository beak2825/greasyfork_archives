// ==UserScript==
// @name         teaserfast
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  (2)
// @author       KukuModZ
// @match        https://teaserfast.ru/check-captcha*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554552/teaserfast.user.js
// @updateURL https://update.greasyfork.org/scripts/554552/teaserfast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOLDOWN_MS = 10000; // 10 seconds cooldown
    const WAIT_MS = 7000;      // 7 seconds wait before clicking
    const STORAGE_KEY = 'lastConfirmActionTime';

    // Check if we're in cooldown (persists across refreshes)
    function isInCooldown() {
        const lastTime = GM_getValue(STORAGE_KEY, 0);
        return Date.now() - lastTime < COOLDOWN_MS;
    }

    // Set cooldown timestamp
    function setCooldown() {
        GM_getValue(STORAGE_KEY, Date.now());
    }

    // Skip entire script if in cooldown to "stop all actions"
    if (isInCooldown()) {
        console.log('In cooldown period (10s from last confirm). Skipping all actions.');
        return; // Exit early, no detection or automation
    }

    // Function to find the target div (matches text and approximate style)
    function findTargetDiv() {
        const divs = document.querySelectorAll('div[style*="font-size: 20px"][style*="color: #1abc9c"]');
        for (let div of divs) {
            if (div.textContent.trim() === '🎯 TARGET FOUND! ✅') {
                return div;
            }
        }
        return null;
    }

    // Function to find and click the confirm button once
    function clickConfirm() {
        const confirmLink = document.querySelector('a.add_button_link.bl_green[style*="width:200px"][onclick*="submit_form"]');
        if (confirmLink && confirmLink.textContent.trim() === 'Подтвердить') {
            confirmLink.click();
            console.log('Confirm button clicked!');
            setCooldown(); // Start cooldown after click (preserves across refreshes)
            return true;
        } else {
            console.log('Confirm button not found or mismatched.');
            return false;
        }
    }

    // Main detection function
    function checkForTarget() {
        const targetDiv = findTargetDiv();
        if (targetDiv) {
            console.log('Target found!');
            // Wait 7 seconds, then click (one-time action)
            setTimeout(() => {
                clickConfirm();
            }, WAIT_MS);
            // Optional: Hide or remove the div to prevent re-detection (uncomment if needed)
            // targetDiv.style.display = 'none';
            return true;
        }
        return false;
    }

    // Initial check on page load
    checkForTarget();

    // Use MutationObserver to watch for dynamic DOM changes (e.g., if div appears later)
    const observer = new MutationObserver((mutations) => {
        // Only check if not in cooldown (though cooldown is set after click, this prevents spam)
        if (!isInCooldown()) {
            checkForTarget();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup observer if page unloads (optional, for performance)
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

})();
