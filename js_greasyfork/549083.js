// ==UserScript==
// @name         Roblox Name Reverter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically revert name changes on Roblox's website.
// @match        https://*.roblox.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549083/Roblox%20Name%20Reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/549083/Roblox%20Name%20Reverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = {
        "connections": "Friends",
        "connection": "Friend",
        "connected": "Friended",
        "connect": "Friends",
        "communities": "Groups",
        "community": "Group",
        "create": "Develop",
        "charts": "Discover",
        "experiences": "Games",
        "experience": "Game",
        "premium": "Builder's Club",
        "marketplace": "Catalog",
        "creations": "Games"
    };

    const whitelistIDs = ["user-account", "friend-tile-button"];
    const whitelistClasses = ["container-header", "nav-menu-title", "navbar-list-option-suffix", "nav-tabs", "rbx-left-col", "groups-list-heading", "groups-list-buttons-bottom", "groups-list-search-input", "input-field", "avatar-card-label", "premium-landing-page", "games-list-header", "catalog-header", "robux-page", "profile-platform-container"];
    const ignoreTags = ["SCRIPT", "STYLE", "NOSCRIPT"];

    function replaceTextInElement(element) {
        if (!element || ignoreTags.includes(element.tagName)) return;

        // Handle input fields and textareas
        if ((element.tagName === 'INPUT' && element.type === 'text') || element.tagName === 'TEXTAREA') {
            // Skip actively focused inputs
            if (!element.matches(':focus') && element.value) {
                let text = element.value;
                for (let original in replacements) {
                    text = text.replace(new RegExp(`(?<![a-zA-Z])${original}(?![a-zA-Z])`, 'gi'), replacements[original]);
                }
                element.value = text;
            }

            // Replace placeholder text
            if (element.placeholder) {
                let text = element.placeholder;
                for (let original in replacements) {
                    text = text.replace(new RegExp(`(?<![a-zA-Z])${original}(?![a-zA-Z])`, 'gi'), replacements[original]);
                }
                element.placeholder = text;
            }

            return;
        }

        // Replace text nodes
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                let text = child.nodeValue;
                for (let original in replacements) {
                    text = text.replace(new RegExp(`(?<![a-zA-Z])${original}(?![a-zA-Z])`, 'gi'), replacements[original]);
                }
                child.nodeValue = text;
            } else {
                replaceTextInElement(child);
            }
        });
    }

    function replaceAllText() {
        // Find all root whitelisted elements
        const rootElements = [];

        whitelistIDs.forEach(id => {
            const el = document.getElementById(id);
            if (el) rootElements.push(el);
        });

        whitelistClasses.forEach(cls => {
            document.querySelectorAll(`.${cls}`).forEach(el => rootElements.push(el));
        });

        rootElements.forEach(el => replaceTextInElement(el));
    }

    // Initial replacement
    replaceAllText();

    // Observe future changes
    const observer = new MutationObserver(() => replaceAllText());
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic replacement for late-loading elements
    setInterval(replaceAllText, 500);

})();