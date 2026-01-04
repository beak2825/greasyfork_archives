// ==UserScript==
// @name         Torn Faction Armory - Hide Give Option
// @namespace    http://tornexpress.co.za/
// @version      1.2
// @description  Hides all 'Give' links and divs in the faction armory (armor and weapons tabs) to prevent accidental item giveaways
// @author       SAShapeShifter
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556850/Torn%20Faction%20Armory%20-%20Hide%20Give%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/556850/Torn%20Faction%20Armory%20-%20Hide%20Give%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide all 'Give' elements (links and divs)
    function hideGiveElements() {
        const giveElements = document.querySelectorAll('.give');
        giveElements.forEach(element => {
            if (element.style.display !== 'none') {
                element.style.display = 'none';
                console.log('[Torn Armory Script] Hid Give element:', element.outerHTML);
            }
        });
    }

    // Check if we're on the armory tab (armor or weapons)
    function isArmoryPage() {
        return window.location.hash.includes('tab=armoury') &&
               (window.location.hash.includes('sub=armour') || window.location.hash.includes('sub=weapons'));
    }

    // Run the hide function if on the correct page
    function checkAndHide() {
        if (isArmoryPage()) {
            hideGiveElements();
        }
    }

    // Initial check after a short delay to ensure page content is loaded
    setTimeout(checkAndHide, 1000);

    // Set up a MutationObserver to watch for dynamically added content
    const observer = new MutationObserver((mutations) => {
        if (isArmoryPage()) {
            hideGiveElements();
        }
    });

    // Observe changes to the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Clean up observer when the page unloads
    window.addEventListener('unload', () => {
        observer.disconnect();
    });

    console.log('[Torn Armory Script] Script loaded and running');
})();