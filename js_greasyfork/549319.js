// ==UserScript==
// @name         Pull request commit progress counter
// @namespace    http://stderr.nl
// @version      2025-09-12
// @description  When viewing a commit in a PR, show the number of commits and the position of the current commit in that list to make review progress more visible.
// @author       Matthijs Kooijman <matthijs@stdin.nl>
// @license      CC0-1.0-Universal, https://creativecommons.org/publicdomain/zero/1.0/
// @homepage     https://codeberg.org/matthijs/greasemonkey-pr-commit-progress
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549319/Pull%20request%20commit%20progress%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/549319/Pull%20request%20commit%20progress%20counter.meta.js
// ==/UserScript==

// This script has no URL filter above, since github dynamically loads pages, so we also dynamically match the current URL
const URL_MATCH = /https:\/\/github.com\/[^\/]*\/[^\/]*\/pull\/[^\/]*\/commits\/.*/;

(function() {
    'use strict';

    function find_commit_info(root) {
        const commits = root.querySelectorAll('.diffbar-range-menu .select-menu-item');
        for (const [i, c] of commits.entries()) {
            if (c.classList.contains('in-range')) {
                // This assumes there is only one commit visible, if multiple then
                // this just returns the first commit in the range.
                return [i + 1, commits.length];
            }
        }
        return [0, commits.length];
    }


    function process(root) {
        if (!root.querySelectorAll) {
            return;
        }
        const [current, count] = find_commit_info(root);
        if (!current) {
            return;
        }
        const summary = root.querySelector('.diffbar-range-menu summary');

        summary.append(` (${current} / ${count}) `);
    }

    // To support Github's dynamic nature, run once on load and then look for
    // relevant elements in everything dynamically added to the DOM.
    if (document.location.toString().match(URL_MATCH)) {
        process(document);
    }

    new MutationObserver(function(mutationsList, observer) {
       if (!document.location.toString().match(URL_MATCH)) {
            return;
        }

        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(process);
            }
        }
    }).observe(document.body, {childList: true, subtree: true});
})();
