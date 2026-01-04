// ==UserScript==
// @name         AI Markdown Bold Formatter
// @namespace    https://blog.valley.town/@zeronox
// @version      0.3
// @description  **…**를 복잡한 DOM(중첩 span, code 포함)에서도 <strong>으로 안전하게 변환
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @downloadURL https://update.greasyfork.org/scripts/551110/AI%20Markdown%20Bold%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/551110/AI%20Markdown%20Bold%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertBoldMarkers(element) {
        const markdownContainer = element.querySelector('.markdown');
        if (!markdownContainer) return;

        const textElements = markdownContainer.querySelectorAll('[data-start][data-end]');

        textElements.forEach(el => {
            const html = el.innerHTML;
            if (!html.includes('**')) return;
            const parts = html.split('**');
            if (parts.length > 1 && parts.length % 2 === 1) {
                const converted = parts.map((part, index) => {
                    if (index % 2 === 1) {
                        return `<strong>${part}</strong>`;
                    }
                    return part;
                }).join('');

                el.innerHTML = converted;
            }
        });
    }

    function processAllMessages() {
        const messageContainers = document.querySelectorAll('[data-message-author-role="assistant"]');
        messageContainers.forEach(container => {
            convertBoldMarkers(container);
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'childList') {
                for (const node of m.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if ((node.matches && node.matches('[data-testid="stop-button"]')) ||
                            node.id === 'composer-submit-button') {
                            setTimeout(processAllMessages, 300);
                            return;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(processAllMessages, 700);
})();
