// ==UserScript==
// @name         Elim Chat Name Changer
// @namespace    elim-name-checker-idiot
// @version      1.8.3
// @description  Highlights leadership names in chat
// @author       Rick-Grimes
// @match        www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558455/Elim%20Chat%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/558455/Elim%20Chat%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const highlightGroups = [
        {
            // Group 1: Captains (Red)
            color: '#FF3300',
            names: ["Cartel", "CharmRiver", "Vulwin"]
        },
        {
            // Group 2: Pushers (Blue)
            color: '#4169e1',
            names: ["Komir", "Legaci", "yoyoYossarian","Inferno","Kristopian","Lore","ugh","Clwee"]
        },
        {
            // Group 3: Co-Captains(Green)
            color: '#57B500',
            names: ["Exploded", "Famine","Jorgy411","LwG94","Sir_Steven","Reilly","D1pl0753","Rick-Grimes"]
        },
        // Add more names/groups as needed.
    ];

    // --- SCRIPT LOGIC (Do not edit below this line) ---

    const HIGHLIGHTED_CLASS = 'torn-user-highlighted-custom';
    const FONT_WEIGHT_BOLD_STYLE = 'font-weight: bold !important;';

    highlightGroups.forEach((group, index) => {
        const className = `torn-highlight-group-${index + 1}`;
        GM_addStyle(`
            a.${className} {
                color: ${group.color} !important;
                ${FONT_WEIGHT_BOLD_STYLE}
            }
        `);
    });


    function processSenderName(senderLink) {
        if (!senderLink || !senderLink.classList.contains('sender___Ziikt') || senderLink.classList.contains(HIGHLIGHTED_CLASS)) {
            return;
        }

        const senderNameWithColon = senderLink.textContent;
        const senderName = senderNameWithColon.endsWith(':') ? senderNameWithColon.slice(0, -1) : senderNameWithColon;

        for (let i = 0; i < highlightGroups.length; i++) {
            if (highlightGroups[i].names.includes(senderName)) {
                senderLink.classList.add(`torn-highlight-group-${i + 1}`, HIGHLIGHTED_CLASS);
                break;
            }
        }
    }


    function scanAndHighlightInElement(element) {
        const senderLinks = element.querySelectorAll('a[class^="sender___"]');
        senderLinks.forEach(processSenderName);
    }


    function observeChatArea() {
        const chatRoot = document.getElementById('chatRoot');

        if (!chatRoot) {
            setTimeout(observeChatArea, 500);
            return;
        }

        console.log("Torn Name Highlighter: Main chat area found. Observing for new messages.");

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scanAndHighlightInElement(node);
                        }
                    }
                }
            }
        });

        observer.observe(chatRoot, {
            childList: true,
            subtree: true
        });

        scanAndHighlightInElement(chatRoot);
    }

    observeChatArea();
})();