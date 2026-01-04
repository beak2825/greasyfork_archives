// ==UserScript==
// @name         Number ChatGPT Prompts
// @namespace    Number ChatGPT User Prompts 
// @version      1.0
// @description  Numbers user prompts in ChatGPT chats sequentially.
// @author       christee257
// @match        https://chatgpt.com/c/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzYuNjA0IDIzLjA0M3EtLjkzNS0uNTEyLTIuODA1LS41MTJoLTYuNjkzdjcuNzk1aDYuNTI1cTEuOTQzLjAwMSAyLjkxNi0uNDczIDEuNzItLjgyNSAxLjcyMS0zLjI2OCAwLTIuNjM3LTEuNjY0LTMuNTQyIiBmaWxsPSIjMDM5YmU1Ii8+PHBhdGggZD0iTTMyLjAwMiAyQzE1LjQzNCAyIDIgMTUuNDMyIDIgMzJzMTMuNDM0IDMwIDMwLjAwMiAzMFM2MiA0OC41NjggNjIgMzIgNDguNTcgMiAzMi4wMDIgMm0xMi44MiA0Mi41MDhoLTYuNjkzYTIxIDIxIDAgMCAxLS4zOTMtMS41NTUgMTQgMTQgMCAwIDEtLjI1Ni0yLjVsLS4wNDEtMi42OTdxLS4wMzUtMi43NzUtLjk1OS0zLjcwMS0uOTIxLS45MjMtMy40NTMtLjkyNGgtNS45MjJ2MTEuMzc3SDIxLjE4VjE3LjQ5MmgxMy44NzlxMi45NzYuMDU5IDQuNTc4Ljc0OGMxLjYwMi42ODkgMS45NzUgMS4xMzUgMi43MTcgMi4wMjdhOSA5IDAgMCAxIDEuNDU5IDIuNDQxcS41MzYgMS4zMzguNTM3IDMuMDUxIDAgMi4wNjctMS4wNDMgNC4wNjRjLTEuMDQzIDEuOTk3LTEuODQ0IDIuMjczLTMuNDQ1IDIuODI2cTIuMDA4LjgwNyAyLjg0NCAyLjI5M3EuODM4IDEuNDg2LjgzOCA0LjUzN3YxLjk0OXEwIDEuOTg3LjE2IDIuNjk3LjI0IDEuMTIyIDEuMTE5IDEuNjUyeiIgZmlsbD0iIzAzOWJlNSIvPjwvc3ZnPg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560188/Number%20ChatGPT%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/560188/Number%20ChatGPT%20Prompts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addPromptNumbers() {
        const userMessages = document.querySelectorAll('[data-message-author-role="user"]');
        userMessages.forEach((msg, index) => {
            // Skip if already numbered
            if (msg.querySelector('.prompt-number')) return;

            // Find the content element (handles variations in ChatGPT's DOM)
            const contentElem = msg.querySelector('[data-message-content], .whitespace-pre-wrap, .markdown, .prose, .text-message-content') || msg;

            const numberSpan = document.createElement('span');
            numberSpan.className = 'prompt-number';
            numberSpan.textContent = `${index + 1}. `;
            numberSpan.style.fontWeight = 'bold';
            numberSpan.style.marginRight = '0.5em';
            numberSpan.style.color = '#333'; // Adjust color for visibility if needed

            // Insert before the first child of the content
            if (contentElem.firstChild) {
                contentElem.insertBefore(numberSpan, contentElem.firstChild);
            } else {
                contentElem.appendChild(numberSpan);
            }
        });
    }

    // Run initially after DOM is ready
    window.addEventListener('load', addPromptNumbers);

    // Observe for DOM changes (e.g., new messages or lazy loading)
    const observer = new MutationObserver(addPromptNumbers);
    observer.observe(document.body, { childList: true, subtree: true });
})();