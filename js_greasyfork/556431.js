// ==UserScript==
// @name         UX fix for Google Gemini - Buttons to Links
// @namespace    https://gemini.google.com/
// @version      1.0.0
// @description  Replace Google Gemini's non-standard button behavior with proper <a> links. Allows native browser operations like opening chats in new tabs (Ctrl+Click / Middle Mouse), copying link addresses, and standard right-click menus on chat history, Gems, and new chat buttons.
// @author       Mykyta Shcherbyna
// @license      MIT
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @grant        none
// @run-at       document-idle
// @supportURL   https://github.com/mshcherbyna99/
// @downloadURL https://update.greasyfork.org/scripts/556431/UX%20fix%20for%20Google%20Gemini%20-%20Buttons%20to%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/556431/UX%20fix%20for%20Google%20Gemini%20-%20Buttons%20to%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS_HOVER_CLASS = 'gemini-linkifier-hover-state';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .${CSS_HOVER_CLASS} {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-radius: 100px;
            transition: background-color 0.1s ease;
        }
        @media (prefers-color-scheme: light) {
            .${CSS_HOVER_CLASS} {
                background-color: rgba(0, 0, 0, 0.08) !important;
            }
        }
        div.conversation.${CSS_HOVER_CLASS} { border-radius: 16px; }
        side-nav-entry-button.${CSS_HOVER_CLASS} { border-radius: 100px; }
        div.library-item-card.${CSS_HOVER_CLASS} { border-radius: 12px; }
    `;
    document.head.appendChild(styleSheet);

    function liftElement(el) {
        if (!el) return;
        const style = window.getComputedStyle(el);
        if (style.position === 'static') el.style.position = 'relative';
        el.style.zIndex = '10';
    }

    function createGhostLink(href, visualTarget) {
        const link = document.createElement('a');
        link.href = href;
        Object.assign(link.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            zIndex: '5', textDecoration: 'none', cursor: 'pointer', outline: 'none'
        });

        link.addEventListener('click', (e) => {
            if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                link.style.display = 'none';
                const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                if (elemBelow) elemBelow.click();
                link.style.display = 'block';
            }
        });

        if (visualTarget) {
            link.addEventListener('mouseenter', () => visualTarget.classList.add(CSS_HOVER_CLASS));
            link.addEventListener('mouseleave', () => visualTarget.classList.remove(CSS_HOVER_CLASS));
        }
        return link;
    }

    function processConversations() {
        document.querySelectorAll('div.conversation:not([data-linkified="true"])').forEach(node => {
            const jslog = node.getAttribute('jslog');
            if (!jslog) return;
            const match = jslog.match(/"(?:c_)?([a-f0-9]+)"/);
            if (!match) return;

            node.style.position = 'relative';
            const link = createGhostLink(`/app/${match[1]}`, node);
            liftElement(node.querySelector('.conversation-actions-container'));
            node.appendChild(link);
            node.dataset.linkified = 'true';
        });
    }

    function processGemsList() {
        document.querySelectorAll('div.bot-item:not([data-linkified="true"])').forEach(node => {
            const jslog = node.getAttribute('jslog');
            if (!jslog) return;
            const match = jslog.match(/"([^"]+)",(?:null|\d)/);
            if (!match) return;

            node.style.position = 'relative';
            const visual = node.querySelector('button.bot-new-conversation-button') || node;
            const link = createGhostLink(`/gem/${match[1]}`, visual);
            liftElement(node.querySelector('bot-actions-menu'));
            node.appendChild(link);
            node.dataset.linkified = 'true';
        });
    }

    function processStandardNav(selector, url) {
        const container = document.querySelector(selector);
        if (!container || container.dataset.linkified === 'true') return;
        const visual = container.querySelector('.side-nav-entry-button') || container;
        container.style.position = 'relative';
        container.appendChild(createGhostLink(url, visual));
        container.dataset.linkified = 'true';
    }

    function processNewChat() {
        const container = document.querySelector('side-nav-action-button[data-test-id="new-chat-button"]');
        if (!container || container.dataset.linkified === 'true') return;
        const btn = container.querySelector('button[data-test-id="expanded-button"]');
        if (!btn) return;
        container.style.position = 'relative';
        container.appendChild(createGhostLink('/app', btn));
        liftElement(container.querySelector('button[data-test-id="temp-chat-button"]'));
        container.dataset.linkified = 'true';
    }

    function scanAll() {
        processConversations();
        processNewChat();
        processGemsList();
        processStandardNav('side-nav-entry-button[data-test-id="bot-list-side-nav-entry-button"]', '/gems/view');
        processStandardNav('side-nav-entry-button[data-test-id="my-stuff-side-nav-entry-button"]', '/mystuff');
    }

    let timeout;
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            clearTimeout(timeout);
            timeout = setTimeout(scanAll, 300);
        }
    });

    scanAll();
    observer.observe(document.body, { childList: true, subtree: true });

})();