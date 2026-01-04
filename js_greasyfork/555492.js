// ==UserScript==
// @name         Rotten Tomatoes - Hide Critic Reviews on rottentomatoes.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all critic-related elements using slot attributes
// @author       Clifford Terry
// @match        https://www.rottentomatoes.com/*
// @grant        none
// @license      MIT
// @copyright    2025 YourName
// @downloadURL https://update.greasyfork.org/scripts/555492/Rotten%20Tomatoes%20-%20Hide%20Critic%20Reviews%20on%20rottentomatoescom.user.js
// @updateURL https://update.greasyfork.org/scripts/555492/Rotten%20Tomatoes%20-%20Hide%20Critic%20Reviews%20on%20rottentomatoescom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideCriticElements() {
        document.querySelectorAll('[slot^="critics"]').forEach(el => {
            el.style.display = 'none';
        });

        const consensus = document.querySelector('[data-qa="critics-consensus"]');
        if (consensus) consensus.style.display = 'none';
    }

    hideCriticElements();
    new MutationObserver(hideCriticElements).observe(document.body, { childList: true, subtree: true });
})();   