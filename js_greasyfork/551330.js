// ==UserScript==
// @name         GitHub. Commits Filter. ( hide RenovateBot commits)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  hides commits that has fix(deps): , chore(deps): , RenovateBot. ...  Also has a button to show/hide those commits. also hides empty date Headers.
// @author       You
// @match        https://github.com/*/*/commits/*
// @match        https://github.com/*/*/compare/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551330/GitHub%20Commits%20Filter%20%28%20hide%20RenovateBot%20commits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551330/GitHub%20Commits%20Filter%20%28%20hide%20RenovateBot%20commits%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFilterActive = true;
    let debounceTimer;

    function applyFilter() {
        console.log("github - apply filter STARTED..");

        const commitItems = document.querySelectorAll('li.js-commits-list-item');
        const toggleButton = document.getElementById('toggle-deps-filter-btn');

        // Update the button's appearance
        if (toggleButton) {
            toggleButton.textContent = `Toggle Deps Filter: ${isFilterActive ? 'ON' : 'OFF'}`;
            isFilterActive ? toggleButton.classList.add('Button--primary') : toggleButton.classList.remove('Button--primary');
        }

        // Step 1: Hide or show individual commit items based on the filter state
        commitItems.forEach(item => {
            const commitLink = item.querySelector('p.mb-1 a.markdown-title');
            if (commitLink && commitLink.textContent.toLowerCase().includes('(deps)')) {
                if (isFilterActive) {
                    item.style.setProperty('display', 'none', 'important');
                } else {
                    item.style.removeProperty('display');
                }
            }
        });

        // Step 2: NEW - Update the visibility of the group headers
        updateGroupHeadersVisibility();
    }

    // This is the new function that handles the group headers
    function updateGroupHeadersVisibility() {
        // Find all the date group headers
        const groupHeaders = document.querySelectorAll('div.TimelineItem--condensed');

        groupHeaders.forEach(header => {
            const commitsInGroup = header.querySelectorAll('li.js-commits-list-item');

                    // console.log('commits in group:', commitsInGroup);

            // If there are no commits in this group for some reason, do nothing.
            if (commitsInGroup.length === 0) {
                return;
            }

            const allCommitsInGroupAreHidden = Array.from(commitsInGroup)
                 .every(commit => {
                     //console.log('Checking commit display style:', commit.style.display);

                     // Now, you MUST explicitly return the result of the check
                     return commit.style.display === 'none';
                 });

            // Now, hide or show the header based on the result
            if (allCommitsInGroupAreHidden) {
                header.style.setProperty('display', 'none', 'important');
            } else {
                header.style.removeProperty('display');
            }
        });
    }

    function createToggleButton() {
        if (document.getElementById('toggle-deps-filter-btn')) return;
        const targetContainer = document.getElementById('commits_bucket');
        if (targetContainer) {
            const button = document.createElement('button');
            button.id = 'toggle-deps-filter-btn';
            button.classList.add('Button', 'Button--secondary', 'Button--small', 'mb-3');
            button.addEventListener('click', () => {
                isFilterActive = !isFilterActive;
                applyFilter();
            });
            targetContainer.prepend(button);
        }
    }

    // The debounced MutationObserver remains unchanged. It's crucial for performance.
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            createToggleButton();
            applyFilter();
        }, 330);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    setTimeout(() => {
        createToggleButton();
        applyFilter();
    }, 500);

})();