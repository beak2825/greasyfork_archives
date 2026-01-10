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

    // NEW: Category tab styles
    const categoryTabStyles = {
        // Format: 'Tab Text': 'background-color'
        "Tools": '#ba6b1c', "Primary": '#ba6b1c', "Secondary": '#ba6b1c',
        "Melee": '#ba6b1c', "Clothing": '#ba6b1c', "Miscellaneous": '#ba6b1c',
        "Cars": '#ba6b1c', "Armor": '#ba6b1c',
        // Add more category tabs here:
        // "Other": '#hexcolor',
    };

    // ========================================
    // Script Logic (don't need to edit below)
    // ========================================
    let highlightedCount = 0;

    function highlightButtons() {
        // Find all sidebar links
        const links = document.querySelectorAll('a.desktopLink___SG2RU');
        links.forEach(link => {
            const linkName = link.querySelector('.linkName___FoKha');
            if (!linkName) return;
            const text = linkName.textContent.trim();

            if (buttonStyles[text]) {
                const color = buttonStyles[text];
                link.style.backgroundColor = color;
                link.style.borderLeft = `4px solid ${color}`;
                link.style.paddingLeft = '8px';
                link.style.filter = 'brightness(0.9)';
                link.style.transition = 'all 0.2s ease';

                link.addEventListener('mouseenter', () => {
                    link.style.filter = 'brightness(1.1)';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.filter = 'brightness(0.9)';
                });

                highlightedCount++;
            }
        });
    }

    // NEW: Function to highlight category tabs
    function highlightCategoryTabs() {
        // Find all category tab buttons
        const tabs = document.querySelectorAll('button.categoryTab___ZPXgK');
        tabs.forEach(tab => {
            const titleElement = tab.querySelector('.title___tvSd2');
            if (!titleElement) return;
            const text = titleElement.textContent.trim();

            if (categoryTabStyles[text]) {
                const color = categoryTabStyles[text];
                tab.style.backgroundColor = color;
                tab.style.borderLeft = `4px solid ${color}`;
                tab.style.filter = 'brightness(0.9)';
                tab.style.transition = 'all 0.2s ease';

                tab.addEventListener('mouseenter', () => {
                    tab.style.filter = 'brightness(1.1)';
                });
                tab.addEventListener('mouseleave', () => {
                    tab.style.filter = 'brightness(0.9)';
                });

                highlightedCount++;
            }
        });
    }

    // Run when page loads
    highlightButtons();
    highlightCategoryTabs(); // NEW: Also highlight category tabs

    // Re-run when DOM changes (for SPA navigation)
    const observer = new MutationObserver(() => {
        highlightButtons();
        highlightCategoryTabs(); // NEW: Also highlight category tabs
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log(`🎨 Sidebar Button Highlighter loaded - ${Object.keys(buttonStyles).length} sidebar buttons + ${Object.keys(categoryTabStyles).length} category tabs configured`);
})();