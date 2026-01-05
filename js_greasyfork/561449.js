// ==UserScript==
// @name         Torn - Sidebar Button Highlighter
// @namespace    http://torn.com/
// @version      1.2
// @description  Highlight specific sidebar menu buttons with custom colors
// @author       srsbsns
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561449/Torn%20-%20Sidebar%20Button%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/561449/Torn%20-%20Sidebar%20Button%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION - Edit the colors here!
    // ========================================

    const buttonStyles = {
        // Format: 'Button Text': 'background-color'
        "Big Al's Gun Shop": '#1E3F6E',
        "Bits 'n' Bobs": '#1E3F6E',
        "TC Clothing": '#1E3F6E',
        "Cyber Force": '#1E3F6E',
        "Docks": '#1E3F6E',
        "Super Store": '#1E3F6E',
        "Pharmacy": '#1E3F6E',
        "Home": '#0D4F13',
        "Print Store": '#1E3F6E',
        "Post Office": '#1E3F6E',
        "Item Market": '#0D4D4F',
        "Bazaar": '#0D4D4F',
        "Stock Market": '#7A0202',
        "Forums": '#71731E',
        "Calendar": '#1865B8',
        "Job": '#194461',
        "Crimes": '#244513',
        "Gym": '#244513',
        "My Faction": '#3D1757',

        // Add more buttons here in the same format:
        // "Button Name": '#hexcolor',
    };

    // ========================================
    // Script Logic (don't need to edit below)
    // ========================================

    let highlightedCount = 0; // Track how many buttons we've highlighted

    function highlightButtons() {
        // Find all sidebar links
        const links = document.querySelectorAll('a.desktopLink___SG2RU');

        links.forEach(link => {
            // Get the link text
            const linkName = link.querySelector('.linkName___FoKha');
            if (!linkName) return;

            const text = linkName.textContent.trim();

            // Check if this button should be highlighted
            if (buttonStyles[text]) {
                const color = buttonStyles[text];

                // Apply the highlight
                link.style.backgroundColor = color;
                link.style.borderLeft = `4px solid ${color}`;
                link.style.paddingLeft = '8px';
                link.style.filter = 'brightness(0.9)';
                link.style.transition = 'all 0.2s ease';

                // Hover effect
                link.addEventListener('mouseenter', () => {
                    link.style.filter = 'brightness(1.1)';
                });

                link.addEventListener('mouseleave', () => {
                    link.style.filter = 'brightness(0.9)';
                });

                highlightedCount++;

                // REMOVED: console.log(`✅ Highlighted: ${text} with color ${color}`);
            }
        });
    }

    // Run when page loads
    highlightButtons();

    // Re-run when DOM changes (for SPA navigation)
    const observer = new MutationObserver(() => {
        highlightButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Single summary log instead of spam
    console.log(`🎨 Sidebar Button Highlighter loaded - ${Object.keys(buttonStyles).length} buttons configured`);
})();