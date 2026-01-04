// ==UserScript==
// @name         AO3 Dialogue Highlighter
// @version      2026-01-01
// @description  friendly dialogue highlighter for dyslexia
// @match        https://archiveofourown.org/works/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1370010
// @downloadURL https://update.greasyfork.org/scripts/555398/AO3%20Dialogue%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/555398/AO3%20Dialogue%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightDialogue() {
        const paragraphs = Array.from(document.querySelectorAll('div.userstuff p:not([data-dialogue-processed])'));
        const batchSize = 20;

        // This Regex matches TWO things:
        // Group 1: HTML tags (<...>) -> We will IGNORE these.
        // Group 2: Dialogue ("...")  -> We will HIGHLIGHT these.
        // It handles nested tags inside dialogue (like <em>) correctly by consuming them as chunks.
        const tokenRegex = /((?:<[^>]+>)+)|(["“](?:<[^>]+>|[^"”<>])+["”])/g;

        function processBatch() {
            for (let i = 0; i < batchSize && paragraphs.length > 0; i++) {
                const p = paragraphs.shift();
                p.dataset.dialogueProcessed = 'true';

                p.innerHTML = p.innerHTML.replace(tokenRegex, (match, tagGroup, dialogueGroup) => {
                    // Case 1: It's an HTML tag (like <span style="...">). Return it unchanged.
                    if (tagGroup) {
                        return tagGroup;
                    }
                    // Case 2: It's dialogue. Wrap it in the highlighter span.
                    if (dialogueGroup) {
                        return `<span style="color:pink;background:rgba(255,182,193,0.03);font-weight:500">${dialogueGroup}</span>`;
                    }
                    // Fallback (should not happen given regex)
                    return match;
                });
            }
            if (paragraphs.length > 0) {
                requestAnimationFrame(processBatch);
            }
        }

        processBatch();
    }

    highlightDialogue();
})();