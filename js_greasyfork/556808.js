// ==UserScript==
// @name         Claude Auto Expand Sidebar
// @namespace    https://github.com/neura-neura/userscripts
// @version      2025.11.24
// @description  Automatically expand Claude's sidebar when the page loads
// @author       neura-neura
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556808/Claude%20Auto%20Expand%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/556808/Claude%20Auto%20Expand%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to locate and click the sidebar button
    function expandSidebar() {
        // Look for the button by its data-testid attribute
        const sidebarToggleButton = document.querySelector('[data-testid="pin-sidebar-toggle"]');

        // If the button is found and the sidebar is closed (width: 3.05rem)
        if (sidebarToggleButton) {
            const sidebar = document.querySelector('.fixed.z-sidebar');
            if (sidebar && sidebar.style.width === '3.05rem') {
                // Simulate a click on the button
                sidebarToggleButton.click();
                console.log('Sidebar expanded automatically');
            }
        } else {
            // If the button is not found, try again after a short delay
            setTimeout(expandSidebar, 1000);
        }
    }

    // Wait until the page fully loads and run with a small delay
    window.addEventListener('load', function() {
        // Small delay to ensure all elements are loaded
        setTimeout(expandSidebar, 1000);
    });

    // As a fallback, also try after the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(expandSidebar, 1000);
        });
    } else {
        setTimeout(expandSidebar, 1000);
    }
})();
