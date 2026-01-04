// ==UserScript==
// @name         Elim Chat Name Changer (Torn + tornPDA)
// @namespace    elim-name-checker-idiot
// @version      1.8
// @description  Highlights specified player names in chat on Torn + tornPDA
// @author       Rick-Grimes
// @match        https://www.torn.com/*
// @match        https://www.tornpda.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558538/Elim%20Chat%20Name%20Changer%20%28Torn%20%2B%20tornPDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558538/Elim%20Chat%20Name%20Changer%20%28Torn%20%2B%20tornPDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const highlightGroups = [
        {
            color: '#FF3300',
            names: ["Cartel", "CharmRiver", "Vulwin"]
        },
        {
            color: '#4169e1',
            names: ["Komir", "Legaci", "yoyoYossarian","Inferno","Kristopian","Lore"]
        },
        {
            color: '#57B500',
            names: ["Clwee", "Exploded", "Famine","Jorgy411","LwG94","Sir_Steven","ugh","Reilly","D1pl0753"]
        }
    ];

    const HIGHLIGHTED_CLASS = 'torn-user-highlighted-custom';

    // ---- Replace GM_addStyle with manual injection ----
    function addStyle(css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    highlightGroups.forEach((group, index) => {
        const className = `torn-highlight-group-${index + 1}`;
        addStyle(`
            a.${className} {
                color: ${group.color} !important;
                font-weight: bold !important;
            }
        `);
    });

    function processSenderName(senderLink) {
        if (!senderLink || !senderLink.textContent) return;
        if (senderLink.classList.contains(HIGHLIGHTED_CLASS)) return;

        const raw = senderLink.textContent.trim();
        const name = raw.endsWith(':') ? raw.slice(0, -1) : raw;

        for (let i = 0; i < highlightGroups.length; i++) {
            if (highlightGroups[i].names.includes(name)) {
                senderLink.classList.add(`torn-highlight-group-${i + 1}`, HIGHLIGHTED_CLASS);
                break;
            }
        }
    }

    function scanAndHighlightInElement(element) {
        if (!element) return;
        const links = element.querySelectorAll('a.sender___Ziikt');
        links.forEach(processSenderName);
    }

    // ---- Find Torn or PDA chat root ----
    function findChatRoot() {
        return (
            document.getElementById('chatRoot') ||       // Torn
            document.getElementById('pdaChatRoot') ||    // tornPDA (older)
            document.querySelector('[id*="chat"]')       // fallback (PDA updates)
        );
    }

    function observeChat() {
        const root = findChatRoot();
        if (!root) {
            setTimeout(observeChat, 400);
            return;
        }

        console.log("Elim Name Changer: Chat root detected:", root);

        const observer = new MutationObserver(muts => {
            for (const m of muts) {
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1) {
                        scanAndHighlightInElement(n);
                    }
                }
            }
        });

        observer.observe(root, { childList: true, subtree: true });
        scanAndHighlightInElement(root);
    }

    observeChat();
})();
