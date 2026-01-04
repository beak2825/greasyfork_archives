// ==UserScript==
// @name         TVKampen Sans Betting
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Removes links and icons for betting sites from TVKampen.com.
// @author       AnBasement
// @match        https://www.tvkampen.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553608/TVKampen%20Sans%20Betting.user.js
// @updateURL https://update.greasyfork.org/scripts/553608/TVKampen%20Sans%20Betting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Instantly hide betting elements with CSS
    const style = document.createElement('style');
    style.textContent = `
        div.icons-channels-rt-lilibet,
        div.icons-channels-rt-LiliBet,
        div.icons-channels-rt-N1Bet,
        div.icons-channels-rt-n1bet,
        div.icons-channels-rt-Robocat,
        div.icons-channels-rt-Rabona,
        div.icons-channels-rt-Puntit,
        div.icons-channels-rt-Miki,
        div.match-details-rt__bookmaker-wrapper {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Removes icons for betting sites
    function removeBettingIcons(root = document) {
        root.querySelectorAll('div.icons-channels-rt-lilibet').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-LiliBet').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-N1Bet').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-n1bet').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-Robocat').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-Rabona').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-Puntit').forEach(el => el.remove());
        root.querySelectorAll('div.icons-channels-rt-Miki').forEach(el => el.remove());
    }

    // Removes bookmaker wrappers with betting lines
    function removeBookmakerWrapper(root = document) {
        root.querySelectorAll('div.match-details-rt__bookmaker-wrapper').forEach(el => el.remove());
    }

    // Main function to remove all betting-related elements
    function removeAllBettingElements(root = document) {
        removeBettingIcons(root);
        removeBookmakerWrapper(root);
    }

    // Run the functions after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => removeAllBettingElements());
    } else {
        removeAllBettingElements();
    }

    // Observe DOM changes and only process added nodes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    removeAllBettingElements(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();