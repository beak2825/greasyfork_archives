// ==UserScript==
// @name         LLM Chat Collapser
// @name:zh-CN   LLM 聊天内容折叠器
// @namespace    https://github.com/miniyu157/llm-chat-collapser
// @version      25.9.29-1
// @description  Makes code blocks on Gemini/ChatGPT and long user messages on ChatGPT collapsible for a cleaner interface.
// @description:zh-CN 使 Gemini 和 ChatGPT 上的代码块，以及 ChatGPT 上的长文本用户消息可折叠，以提供更整洁的界面。
// @author       miniyu157
// @license      MIT
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @run-at       document-end
// @homepageURL  https://github.com/miniyu157/llm-chat-collapser
// @supportURL   https://github.com/miniyu157/llm-chat-collapser/issues
// @downloadURL https://update.greasyfork.org/scripts/551014/LLM%20Chat%20Collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/551014/LLM%20Chat%20Collapser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .ucc-collapsible-header {
        cursor: pointer;
        position: relative;
        user-select: none;
    }
    .ucc-arrow-indicator::before {
        content: '▶';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        color: var(--mat-sys-color-on-surface-variant, #888);
        transition: transform 0.2s ease-in-out;
    }
    .ucc-header-expanded::before {
        transform: translateY(-50%) rotate(90deg);
    }
    .gemini-header-padding {
        padding-left: 32px !important;
    }
    .gemini-arrow-pos::before {
        left: 12px;
    }
    .chatgpt-header-padding {
        padding-left: 24px !important;
    }
    .chatgpt-arrow-pos::before {
        left: 8px;
    }
    .ucc-user-text-clamp {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    `);

    const processAttribute = 'data-ucc-processed';

    function applyDisplayCollapse(header, content) {
        header.classList.add('ucc-collapsible-header', 'ucc-arrow-indicator');
        content.style.display = 'none';

        header.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            header.classList.toggle('ucc-header-expanded');
            content.style.display = content.style.display === 'none' ? '' : 'none';
        });
    }

    function applyLineClampCollapse(header, content) {
        header.classList.add('ucc-collapsible-header', 'ucc-arrow-indicator');
        content.classList.add('ucc-user-text-clamp');

        header.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            header.classList.toggle('ucc-header-expanded');
            content.classList.toggle('ucc-user-text-clamp');
        });
    }

    function processGeminiCodeBlock(element) {
        if (element.hasAttribute(processAttribute)) return;
        element.setAttribute(processAttribute, 'true');
        const header = element.querySelector('.code-block-decoration');
        const content = element.querySelector('.formatted-code-block-internal-container');
        if (header && content) {
            header.classList.add('gemini-header-padding', 'gemini-arrow-pos');
            applyDisplayCollapse(header, content);
        }
    }

    function processChatGPTCodeBlock(element) {
        if (element.hasAttribute(processAttribute)) return;
        element.setAttribute(processAttribute, 'true');
        const header = element.querySelector('.rounded-t-2xl');
        const content = element.querySelector('.p-4');
        if (header && content && !header.closest('.result-streaming')) {
            header.classList.add('chatgpt-header-padding', 'chatgpt-arrow-pos');
            applyDisplayCollapse(header, content);
        }
    }

    function processChatGPTUserMessage(element) {
        if (element.hasAttribute(processAttribute)) return;
        element.setAttribute(processAttribute, 'true');
        const textContainer = element.querySelector('.whitespace-pre-wrap');
        if (!textContainer) return;

        const lineCount = textContainer.textContent.split('\n').length;
        const isLong = lineCount > 3 || (lineCount === 1 && textContainer.textContent.length > 200);

        if (isLong) {
            const bubble = element.querySelector('.user-message-bubble-color');
            if (bubble) {
                bubble.classList.add('chatgpt-header-padding', 'chatgpt-arrow-pos');
                applyLineClampCollapse(bubble, textContainer);
            }
        }
    }

    function scanAndProcess(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        const host = window.location.hostname;
        const selectorMap = {
            'gemini.google.com': {
                [`code-block:not([${processAttribute}])`]: processGeminiCodeBlock,
            },
 'chatgpt.com': {
     [`pre:not([${processAttribute}])`]: processChatGPTCodeBlock,
 [`div[data-message-author-role="user"]:not([${processAttribute}])`]: processChatGPTUserMessage,
 }
        };

        for (const hostKey in selectorMap) {
            if (host.includes(hostKey)) {
                for (const selector in selectorMap[hostKey]) {
                    const elements = node.matches(selector) ? [node] : node.querySelectorAll(selector);
                    elements.forEach(selectorMap[hostKey][selector]);
                }
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => scanAndProcess(node));
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    scanAndProcess(document.body);

})();
