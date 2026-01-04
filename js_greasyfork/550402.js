// ==UserScript==
// @name         Hide Instagram Reels
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Κρύβει τα Reels από το Instagram feed και το μενού.
// @author       Kat
// @match        https://www.instagram.com/*
// @grant        none
// ==UserScript==
// @name         Hide Instagram Reels
// @namespace    http://tampermonkey.net/
// @description  Κρύβει τα Reels από το Instagram feed και το μενού.
// @author       Kat
// @license      MIT
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550402/Hide%20Instagram%20Reels.user.js
// @updateURL https://update.greasyfork.org/scripts/550402/Hide%20Instagram%20Reels.meta.js
// ==/UserScript==

// ==/UserScript==

(function() {
    'use strict';

    function hideReels() {
        // Κρύβει το κουμπί "Reels" από το sidebar
        document.querySelectorAll('a[href="/reels/"]').forEach(el => el.style.display = 'none');
        
        // Κρύβει Reels που εμφανίζονται στο feed
        document.querySelectorAll('a[href^="/reel/"]').forEach(el => {
            let parent = el.closest('article') || el.closest('div');
            if (parent) parent.style.display = 'none';
        });
    }

    hideReels();
    const observer = new MutationObserver(hideReels);
    observer.observe(document.body, { childList: true, subtree: true });
})();
