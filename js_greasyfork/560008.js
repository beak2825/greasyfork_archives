// ==UserScript==
// @name         GitHub Comment ID
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.4
// @description  Displays and allows copying of the comment ID on GitHub issue and pull request pages.
// @author       Aiuanyu
// @match        https://github.com/*/*/issues/*
// @match        https://github.com/*/*/pull/*
// @grant        none
// @license      MIT
// @history      0.4 Apply minor fixes from code review.
// @history      0.3 Fix UI overlap by injecting into a different element and using flexbox.
// @history      0.2 Add error handling for clipboard and adjust CSS
// @history      0.1 Initial release
// @downloadURL https://update.greasyfork.org/scripts/560008/GitHub%20Comment%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/560008/GitHub%20Comment%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyles() {
        const css = `
            .gh-comment-id-container {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: var(--color-fg-muted);
                background-color: var(--color-canvas-subtle);
                border: 1px solid var(--color-border-default);
                border-radius: 6px;
                padding: 2px 6px;
                line-height: 1;
                margin-right: 8px; /* Space between ID and kebab menu */
            }
            .gh-comment-id-copy-button {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: 5px;
                padding: 0;
                display: inline-flex;
                align-items: center;
                color: var(--color-fg-muted);
            }
            .gh-comment-id-copy-button:hover {
                color: var(--color-accent-fg);
            }
            .gh-comment-id-copy-button svg {
                fill: currentColor;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    function processComment(comment) {
        if (!comment.id || comment.querySelector('.gh-comment-id-container')) {
            return; // Skip if no ID or already processed
        }

        // GitHub comment IDs follow a format like "issuecomment-123456789"
        const commentId = comment.id.split('-').pop();
        if (!/^\d+$/.test(commentId)) {
            // Check if the commentId is purely numeric
            return;
        }

        const actionsContainer = comment.querySelector('.timeline-comment-actions');
        if (!actionsContainer) {
            return; // No actions container found
        }

        // Create the container
        const container = document.createElement('div');
        container.className = 'gh-comment-id-container';

        // Create the ID text span
        const idSpan = document.createElement('span');
        idSpan.textContent = commentId;
        container.appendChild(idSpan);

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'gh-comment-id-copy-button';
        copyButton.title = 'Copy Comment ID';
        copyButton.innerHTML = `<svg aria-hidden="true" height="12" viewBox="0 0 16 16" version="1.1" width="12" data-view-component="true" class="octicon octicon-copy"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`;

        if (!navigator.clipboard) {
            copyButton.title = 'Clipboard API not available';
            copyButton.disabled = true;
        } else {
            copyButton.onclick = (e) => {
                e.stopPropagation(); // prevent triggering other click events
                navigator.clipboard.writeText(commentId).then(() => {
                    copyButton.title = 'Copied!';
                    setTimeout(() => { copyButton.title = 'Copy Comment ID'; }, 2000);
                }).catch(err => {
                    console.error('Failed to copy comment ID:', err);
                    copyButton.title = 'Copy failed';
                    setTimeout(() => { copyButton.title = 'Copy Comment ID'; }, 2000);
                });
            };
        }
        container.appendChild(copyButton);

        // Inject the UI
        actionsContainer.prepend(container);
    }

    function processAllComments() {
        document.querySelectorAll('.timeline-comment-group').forEach(processComment);
    }

    function init() {
        addStyles();
        processAllComments();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('.timeline-comment-group')) {
                                processComment(node);
                            } else {
                                node.querySelectorAll('.timeline-comment-group').forEach(processComment);
                            }
                        }
                    });
                }
            }
        });

        const discussionContainer = document.querySelector('#discussion_bucket');
        if (discussionContainer) {
            observer.observe(discussionContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
