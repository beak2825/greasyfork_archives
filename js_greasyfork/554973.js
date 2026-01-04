// ==UserScript==
// @name         Reddit Auto-Collapse Left Navigation Bar On Load
// @author       Deaquay
// @namespace    https://gist.github.com/Deaquay/
// @version      4.2
// @description  Automatically collapses Reddit's left sidebar on page load (unless hovered)
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554973/Reddit%20Auto-Collapse%20Left%20Navigation%20Bar%20On%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/554973/Reddit%20Auto-Collapse%20Left%20Navigation%20Bar%20On%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const collapseSidebar = () => {
        // Find the sidebar container
        const sidebar = document.getElementById('left-sidebar-container');

        if (!sidebar) {
            return false;
        }

        // Check if it's expanded (expanded="1" means open)
        const isExpanded = sidebar.getAttribute('expanded') === '1';

        if (isExpanded) {
            // Find and click the collapse button
            const collapseBtn = document.getElementById('flex-nav-collapse-button');

            if (collapseBtn) {
                collapseBtn.click();
                console.log('Reddit sidebar collapsed via button click');
                return true;
            }
        }

        return false;
    };

    // Try immediately on page load
    setTimeout(collapseSidebar, 100);
    setTimeout(collapseSidebar, 500);
    setTimeout(collapseSidebar, 1000);

    // Watch for navigation changes (Reddit is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(collapseSidebar, 300);
            setTimeout(collapseSidebar, 800);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Reddit auto-collapse script loaded');
})();
