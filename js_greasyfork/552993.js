// ==UserScript==
// @name         Glitchey: Attack new window
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open attack links in new window on faction war page
// @author       Glitchey
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552993/Glitchey%3A%20Attack%20new%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/552993/Glitchey%3A%20Attack%20new%20window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify attack links
    function modifyAttackLinks() {
        const attackLinks = document.querySelectorAll('a[href*="loader2.php?sid=getInAttack"]');
        
        attackLinks.forEach(link => {
            // Check if we haven't already modified this link
            if (!link.dataset.modified) {
                // Add click event listener
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.open(link.href, '_blank');
                });
                
                // Mark as modified to avoid duplicate listeners
                link.dataset.modified = 'true';
            }
        });
    }

    // Run initially
    modifyAttackLinks();

    // Watch for DOM changes (for dynamically loaded content)
    const observer = new MutationObserver(function(mutations) {
        modifyAttackLinks();
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();