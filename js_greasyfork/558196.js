// ==UserScript==
// @name         DGG Condense Repeats
// @description  Condenses messages that are the same pattern repeated, but only if the pattern is > 1 word.
// @version      1.1.4
// @match        https://www.destiny.gg/*
// @grant        none
// @namespace    jojo259
// @downloadURL https://update.greasyfork.org/scripts/558196/DGG%20Condense%20Repeats.user.js
// @updateURL https://update.greasyfork.org/scripts/558196/DGG%20Condense%20Repeats.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Storage for user message history 🗄️
    // Format: { "username": Set("message1", "message2") }
    const userHistory = {};

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                // 1. Identify valid chat messages 🕵️‍♂️
                if (!node.matches('.msg-chat')) return;

                const msgTextNode = node.querySelector('.text');
                const usernameNode = node.querySelector('.user-name') || node.getAttribute('data-username'); // Handle different DGG layouts

                // We need both text and a user to function
                if (msgTextNode && usernameNode) {
                    let finalHtml = msgTextNode.innerHTML.trim();
                    const username = typeof usernameNode === 'string' ? usernameNode : usernameNode.textContent.trim();

                    // --- STEP 1: CONDENSE REPEATS (Existing Logic) ---

                    const match = finalHtml.match(/^((?:&gt;|>) ?)?(.+?)(?:\s*(?:\1)?\2)+$/);
                    let wordCount = 0;

                    // Helper to count words in HTML string 📝
                    const getWordCount = (str) => {
                        const plainText = str.replace(/<[^>]*>/g, '').trim();
                        return plainText.length > 0 ? plainText.split(/\s+/).length : 0;
                    };

                    if (match) {
                        const prefix = match[1] || '';
                        const patternHtml = match[2];
                        wordCount = getWordCount(patternHtml);

                        if (wordCount > 1) {
                            // Update the HTML to the condensed version
                            finalHtml = prefix + patternHtml;
                            msgTextNode.innerHTML = finalHtml;
                        }
                    } else {
                        // If no condense happened, count words of the full message
                        wordCount = getWordCount(finalHtml);
                    }

                    // --- STEP 2: BLOCK DUPLICATE HISTORY (New Logic) ---

                    // Initialize user history if new
                    if (!userHistory[username]) {
                        userHistory[username] = new Set();
                    }

                    // Only block if it is > 1 word AND exists in history 🛑
                    if (wordCount > 1 && userHistory[username].has(finalHtml)) {
                        node.remove(); // 🧨 Remove the message entirely
                        return;
                    }

                    // Otherwise, save it to history 💾
                    // We only save > 1 word messages to save memory, as we don't block 1 word messages anyway
                    if (wordCount > 1) {
                        userHistory[username].add(finalHtml);
                    }
                }
            });
        });
    });

    observer.observe(document.querySelector('#chat-lines') || document.body, {
        childList: true,
        subtree: true
    });
})();