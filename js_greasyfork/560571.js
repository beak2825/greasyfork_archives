// ==UserScript==
// @name         Leetcode Difficulty Hide
// @author       happydave1
// @grant        none
// @match        https://leetcode.com/problems/*
// @description  hide the difficulty on a leetcode problem
// @version      1.0
// @license     MIT
// @namespace https://greasyfork.org/users/1553610
// @downloadURL https://update.greasyfork.org/scripts/560571/Leetcode%20Difficulty%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/560571/Leetcode%20Difficulty%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideDifficulty = () => {
        const difficulty = document.querySelector('[class*="text-difficulty"]');
        if (difficulty) {
            difficulty.style.display = 'none';
        }
    }

    const mutationObserver = new MutationObserver(hideDifficulty);
    mutationObserver.observe(document.body, { subtree: true, childList: true });
})();