// ==UserScript==
// @name         GitLab Collapse All Comments
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Add collapse/expand buttons for individual GitLab MR comments with native styling (dark mode support)
// @match        https://gitlab.com/*/merge_requests/*
// @match        https://your-gitlab-instance.com/*/merge_requests/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554082/GitLab%20Collapse%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/554082/GitLab%20Collapse%20All%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for collapse button matching GitLab's style with dark mode support
    const style = document.createElement('style');
    style.textContent = `
        .collapse-comment-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 2rem;
            height: 2rem;
            padding: 0.5rem;
            margin-right: 0.5rem;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1;
            color: #303030;
            background-color: #fff;
            border: 1px solid #bfbfbf;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: background-color 0.1s linear, border-color 0.1s linear;
            vertical-align: middle;
        }
        .collapse-comment-btn:hover {
            background-color: #f0f0f0;
            border-color: #999;
            color: #303030;
        }
        .collapse-comment-btn:active {
            background-color: #e0e0e0;
        }

        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .collapse-comment-btn {
                color: #fafafa;
                background-color: #333;
                border-color: #555;
            }
            .collapse-comment-btn:hover {
                background-color: #404040;
                border-color: #666;
                color: #fafafa;
            }
            .collapse-comment-btn:active {
                background-color: #4a4a4a;
            }
        }

        .gl-dark .collapse-comment-btn,
        [data-theme="dark"] .collapse-comment-btn {
            color: #fafafa;
            background-color: #333;
            border-color: #555;
        }
        .gl-dark .collapse-comment-btn:hover,
        [data-theme="dark"] .collapse-comment-btn:hover {
            background-color: #404040;
            border-color: #666;
            color: #fafafa;
        }
        .gl-dark .collapse-comment-btn:active,
        [data-theme="dark"] .collapse-comment-btn:active {
            background-color: #4a4a4a;
        }

        .timeline-discussion-body.collapsed {
            display: none !important;
        }

        #collapse-all-comments-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.25rem;
            color: #303030;
            background-color: #fff;
            border: 1px solid #bfbfbf;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: background-color 0.1s linear, border-color 0.1s linear;
            white-space: nowrap;
        }
        #collapse-all-comments-btn:hover {
            background-color: #f0f0f0;
            border-color: #999;
        }
        #collapse-all-comments-btn:active {
            background-color: #e0e0e0;
        }

        @media (prefers-color-scheme: dark) {
            #collapse-all-comments-btn {
                color: #fafafa;
                background-color: #333;
                border-color: #555;
            }
            #collapse-all-comments-btn:hover {
                background-color: #404040;
                border-color: #666;
            }
            #collapse-all-comments-btn:active {
                background-color: #4a4a4a;
            }
        }
        .gl-dark #collapse-all-comments-btn,
        [data-theme="dark"] #collapse-all-comments-btn {
            color: #fafafa;
            background-color: #333;
            border-color: #555;
        }
        .gl-dark #collapse-all-comments-btn:hover,
        [data-theme="dark"] #collapse-all-comments-btn:hover {
            background-color: #404040;
            border-color: #666;
        }
        .gl-dark #collapse-all-comments-btn:active,
        [data-theme="dark"] #collapse-all-comments-btn:active {
            background-color: #4a4a4a;
        }
    `;
    document.head.appendChild(style);

    function addCollapseButtons() {
        const notes = document.querySelectorAll('.note-wrapper:not(.has-collapse-btn)');

        notes.forEach(note => {
            note.classList.add('has-collapse-btn');

            const noteActions = note.querySelector('.note-actions');
            if (!noteActions) return;

            const discussionBody = note.querySelector('.timeline-discussion-body');
            if (!discussionBody) return;

            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'collapse-comment-btn';
            collapseBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            `;
            collapseBtn.title = 'Collapse comment';
            collapseBtn.type = 'button';
            collapseBtn.setAttribute('aria-label', 'Collapse comment');

            collapseBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (discussionBody.classList.contains('collapsed')) {
                    discussionBody.classList.remove('collapsed');
                    collapseBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    `;
                    collapseBtn.title = 'Collapse comment';
                    collapseBtn.setAttribute('aria-label', 'Collapse comment');
                } else {
                    discussionBody.classList.add('collapsed');
                    collapseBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    `;
                    collapseBtn.title = 'Expand comment';
                    collapseBtn.setAttribute('aria-label', 'Expand comment');
                }
            };

            noteActions.insertBefore(collapseBtn, noteActions.firstChild);
        });
    }

    function addCollapseAllButton() {
        if (document.getElementById('collapse-all-comments-btn')) return;

        // Target the merge-request-tabs-actions container
        const tabsActions = document.querySelector('.merge-request-tabs-actions');
        if (!tabsActions) {
            console.log('Could not find .merge-request-tabs-actions');
            return;
        }

        // Find the discussionCounter to insert before it
        const discussionCounter = document.getElementById('discussionCounter');
        if (!discussionCounter) {
            console.log('Could not find #discussionCounter');
            return;
        }

        const collapseAllBtn = document.createElement('button');
        collapseAllBtn.id = 'collapse-all-comments-btn';
        collapseAllBtn.textContent = 'Collapse All Comments';
        collapseAllBtn.type = 'button';

        let allCollapsed = false;

        collapseAllBtn.onclick = function() {
            const allBodies = document.querySelectorAll('.timeline-discussion-body');
            const allButtons = document.querySelectorAll('.collapse-comment-btn');

            allBodies.forEach(body => {
                if (allCollapsed) {
                    body.classList.remove('collapsed');
                } else {
                    body.classList.add('collapsed');
                }
            });

            allButtons.forEach(btn => {
                if (allCollapsed) {
                    btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    `;
                    btn.title = 'Collapse comment';
                    btn.setAttribute('aria-label', 'Collapse comment');
                } else {
                    btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    `;
                    btn.title = 'Expand comment';
                    btn.setAttribute('aria-label', 'Expand comment');
                }
            });

            allCollapsed = !allCollapsed;
            collapseAllBtn.textContent = allCollapsed ? 'Expand All Comments' : 'Collapse All Comments';
        };

        // Insert before the discussionCounter
        tabsActions.insertBefore(collapseAllBtn, discussionCounter);
        console.log('Collapse all button inserted successfully');
    }

    function init() {
        addCollapseButtons();
        setTimeout(addCollapseAllButton, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const observer = new MutationObserver(() => {
        addCollapseButtons();
        addCollapseAllButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
