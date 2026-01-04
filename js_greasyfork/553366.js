// ==UserScript==
// @name         Destiny.gg Orange Greentext
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change greentext color from green to orange on destiny.gg
// @author       You
// @match        https://www.destiny.gg/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/553366/Destinygg%20Orange%20Greentext.user.js
// @updateURL https://update.greasyfork.org/scripts/553366/Destinygg%20Orange%20Greentext.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Apply the orange color to any greentext elements found.
     * @param {HTMLElement|Document} root - Root element to search within.
     */
    function recolorGreentext(root = document) {
        const greenTexts = root.querySelectorAll('.greentext');
        for (const elem of greenTexts) {
            elem.style.color = 'orange';
        }
    }

    // MutationObserver callback — handles new messages added to chat
    const chatObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    recolorGreentext(node);
                }
            }
        }
    });

    /**
     * Wait until the chat container exists, then start observing it.
     */
    function initObserver() {
        const chat = document.querySelector('#chat-lines, .chat-lines, .chat-container');
        if (!chat) {
            // Chat not yet loaded; retry in 1s
            setTimeout(initObserver, 1000);
            return;
        }

        // Apply to already existing messages
        recolorGreentext(chat);

        // Observe new messages efficiently
        chatObserver.observe(chat, { childList: true, subtree: true });

        console.log('[OrangeGreentext] Active and observing chat.');
    }

    initObserver();
})();
