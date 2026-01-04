// ==UserScript==
// @name         GitHub Actions Auto Expand All Jobs
// @namespace    https://github.com/
// @version      1.0
// @description  Automatically expand all job groups ("Show all jobs") in GitHub Actions run pages
// @author       chaoscreater
// @match        https://github.com/blahsssss*/*/actions/runs/*
// @match        https://github.*.co.nz/*/*/actions/runs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555565/GitHub%20Actions%20Auto%20Expand%20All%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/555565/GitHub%20Actions%20Auto%20Expand%20All%20Jobs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Observe for dynamically loaded workflow graphs
    const observer = new MutationObserver(() => expandAll());

    function isValidUrl() {
        const url = window.location.href;
        // Match the same patterns as @match directives
        return /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\//.test(url) ||
               /^https:\/\/github[^/]*\.co\.nz\/[^/]+\/[^/]+\/actions\/runs\//.test(url);
    }

    function expandAll() {
        // Only run if we're on a valid URL
        if (!isValidUrl()) {
            return;
        }

        // Select all collapsed workflow job buttons
        const buttons = document.querySelectorAll('button[data-action*="expandMatrix"]');
        let count = 0;

        buttons.forEach(btn => {
            const text = btn.textContent.trim();
            // Only click those that have "Show all jobs" visible
            if (text.includes("Show all jobs")) {
                btn.click();
                count++;
            }
        });

        if (count > 0) console.log(`[GitHub Actions Auto Expand] Expanded ${count} job group(s).`);
    }

    function init() {
        expandAll();
        const container = document.querySelector('div.js-graph-matrix')?.closest('div[role="main"]') || document.body;
        observer.observe(container, { childList: true, subtree: true });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    }
})();
