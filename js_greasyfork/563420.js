// ==UserScript==
// @name         AI Context Index
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  AI聊天目录，快速回溯，精准定位。支持ChatGPT、claude、grok、豆包、KIMI、千问、Gemini
// @author       Yekyos
// @license      MIT
// @match        *://*.doubao.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://*.kimi.com/*
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://tongyi.aliyun.com/*
// @match        https://*.qianwen.com/*
// @match        https://qianwen.aliyun.com/*
// @match        https://grok.com/*
// @match        https://x.com/*
// @match        https://chat.deepseek.com/*
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563420/AI%20Context%20Index.user.js
// @updateURL https://update.greasyfork.org/scripts/563420/AI%20Context%20Index.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper: CSS Injection with Fallback
    function addStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // CSS Definitions (from src/styles.css)
    const styles = `
    /* 侧边栏容器 - 默认收起状态 */
    #doubao-sidebar-container {
      --ds-bg-color: rgba(255, 255, 255, 0.98);
      --ds-border-color: #eee;
      --ds-shadow-color: rgba(0, 0, 0, 0.12);
      --ds-text-color: #666;
      --ds-text-hover-color: #002124;
      --ds-item-hover-bg: rgba(0, 0, 0, 0.02);
      --ds-indicator-color: #ddd;
      --ds-indicator-hover-color: #002124;
      --ds-active-color: #006cff;
      --ds-scrollbar-thumb: #e0e0e0;
      --ds-scrollbar-thumb-hover: #ccc;

      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      width: 320px;
      max-height: 500px;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 20px;
      filter: drop-shadow(0 0 0 transparent);
      clip-path: inset(0 0 0 280px round 20px);
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      transition: background-color 0.3s ease, border-color 0.3s ease, filter 0.3s ease, clip-path 0s linear 0.3s;
      overflow: hidden;
      padding: 12px 0;
      box-sizing: border-box;
    }

    html.dark #doubao-sidebar-container,
    body.dark #doubao-sidebar-container,
    [data-theme="dark"] #doubao-sidebar-container,
    [data-color-mode="dark"] #doubao-sidebar-container,
    #doubao-sidebar-container.ds-dark {
      --ds-bg-color: rgba(32, 33, 35, 0.98);
      --ds-border-color: #444;
      --ds-shadow-color: rgba(0, 0, 0, 0.5);
      --ds-text-color: #aaa;
      --ds-text-hover-color: #e0e0e0;
      --ds-item-hover-bg: rgba(255, 255, 255, 0.05);
      --ds-indicator-color: #555;
      --ds-indicator-hover-color: #ccc;
      --ds-active-color: #66b2ff;
      --ds-scrollbar-thumb: #555;
      --ds-scrollbar-thumb-hover: #777;
    }

    #doubao-sidebar-container:hover {
      background-color: var(--ds-bg-color);
      border-color: var(--ds-border-color);
      filter: drop-shadow(0 8px 24px var(--ds-shadow-color));
      padding: 12px 0;
      clip-path: inset(-50px -50px -50px -50px round 20px);
      transition: background-color 0.3s ease, border-color 0.3s ease, filter 0.3s ease, clip-path 0s linear 0s;
    }

    #doubao-sidebar-container * {
      box-sizing: border-box;
    }

    .ds-list {
      flex: 1;
      overflow-y: hidden;
      padding: 0;
      margin: 0;
      list-style: none;
      padding-right: 0;
    }

    #doubao-sidebar-container:hover .ds-list {
      overflow-y: overlay;
      overscroll-behavior: contain;
    }

    .ds-item {
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.2s;
      position: relative;
      min-height: 24px;
    }

    .ds-item:hover {
      background-color: var(--ds-item-hover-bg);
    }

    .ds-text {
      font-size: 13px;
      color: var(--ds-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.3s ease;
      flex: 1;
      text-align: left;
      padding-left: 8px;
      margin-right: 12px;
    }

    #doubao-sidebar-container:hover .ds-text {
      opacity: 1;
    }

    .ds-indicator-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      margin-left: auto;
    }

    .ds-indicator {
      display: block;
      width: 8px;
      height: 2px;
      background-color: var(--ds-indicator-color);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .ds-item.active .ds-indicator {
      background-color: var(--ds-active-color);
      width: 14px;
      height: 3px;
    }

    .ds-item.active .ds-text {
      color: var(--ds-active-color);
      font-weight: 500;
    }

    .ds-item:not(.active):hover .ds-text {
      color: var(--ds-text-hover-color);
    }

    .ds-item:not(.active):hover .ds-indicator {
      background-color: var(--ds-indicator-hover-color);
    }

    .ds-item.active:hover .ds-indicator {
      background-color: var(--ds-active-color);
    }

    /* Scrollbar */
    .ds-list::-webkit-scrollbar {
      width: 4px;
    }
    .ds-list::-webkit-scrollbar-track {
      background: transparent;
    }
    .ds-list::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 2px;
    }
    #doubao-sidebar-container:hover .ds-list::-webkit-scrollbar-thumb {
      background: var(--ds-scrollbar-thumb);
    }
    #doubao-sidebar-container:hover .ds-list::-webkit-scrollbar-thumb:hover {
      background: var(--ds-scrollbar-thumb-hover);
    }
    `;

    addStyle(styles);

    // Platform Configuration
    const PLATFORMS = {
        DOUBAO: 'doubao',
        KIMI: 'kimi',
        GEMINI: 'gemini',
        CHATGPT: 'chatgpt',
        QWEN: 'qwen',
        GROK: 'grok',
        CLAUDE: 'claude',
        DEEPSEEK: 'deepseek'
    };

    let currentPlatform = null;

    const CONFIG = {
        [PLATFORMS.DOUBAO]: {
            userMessageParent: 'div[data-testid="send_message"]',
            getText: (el) => el.innerText.trim()
        },
        [PLATFORMS.KIMI]: {
            containerSelector: '.chat-content-item.chat-content-item-user',
            textSelector: '.user-content',
            getText: (el) => {
                const textEl = el.querySelector('.user-content');
                return textEl ? textEl.innerText.trim() : '';
            }
        },
        [PLATFORMS.DEEPSEEK]: {
            containerSelector: 'div[data-testid="ds-message"]',
            getText: (el) => el.innerText.trim()
        },
        [PLATFORMS.GEMINI]: {
            containerSelector: 'user-query-content, .user-query-content, .user-query-container',
            textSelector: '.query-text-line',
            getText: (el) => {
                const textEl = el.querySelector('.query-text') || el.querySelector('.query-text-line') || el.querySelector('p');
                return textEl ? textEl.innerText.trim() : (el.innerText ? el.innerText.trim() : '');
            }
        },
        [PLATFORMS.CHATGPT]: {
            containerSelector: '[data-message-author-role="user"]',
            textSelector: '.whitespace-pre-wrap',
            getText: (el) => {
                const textEl = el.querySelector('.whitespace-pre-wrap');
                return textEl ? textEl.innerText.trim() : el.innerText.trim();
            }
        },
        [PLATFORMS.QWEN]: {
            containerSelector: 'div[class*="questionItem-"][data-msgid]',
            textSelector: 'div[class*="bubble-"]',
            getText: (el) => {
                const textEl = el.querySelector('div[class*="bubble-"]');
                return textEl ? textEl.innerText.trim() : el.innerText.trim();
            }
        },
        [PLATFORMS.GROK]: {
            containerSelector: '.r-1sw30gj',
            getText: (el) => el.innerText.trim()
        },
        [PLATFORMS.CLAUDE]: {
            containerSelector: 'div[data-testid="user-message"]',
            getText: (el) => el.innerText.trim()
        }
    };

    // State
    let debounceTimer = null;
    let observer = null;
    let sidebarList = null;

    // --- Core Functions ---

    function detectPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('doubao.com')) {
            currentPlatform = PLATFORMS.DOUBAO;
        } else if (hostname.includes('kimi.moonshot.cn') || hostname.includes('kimi.com')) {
            currentPlatform = PLATFORMS.KIMI;
        } else if (hostname.includes('gemini.google.com')) {
            currentPlatform = PLATFORMS.GEMINI;
        } else if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) {
            currentPlatform = PLATFORMS.CHATGPT;
        } else if (hostname.includes('tongyi.aliyun.com') || hostname.includes('qianwen.com')) {
            currentPlatform = PLATFORMS.QWEN;
        } else if (hostname.includes('grok.com') || (hostname.includes('x.com') && location.pathname.includes('grok'))) {
            currentPlatform = PLATFORMS.GROK;
        } else if (hostname.includes('claude.ai')) {
            currentPlatform = PLATFORMS.CLAUDE;
        }
        else if (hostname.includes('chat.deepseek.com')) {
        currentPlatform = PLATFORMS.DEEPSEEK;
        }

    if (currentPlatform) {
        console.log('[AIChatIndex] Platform detected:', currentPlatform);
        init();
    } else {
        console.log('[AIChatIndex] No supported platform detected.');
    }
}

    function createSidebar() {
    // Create container
    const container = document.createElement('div');
    container.id = 'doubao-sidebar-container';

    // Create list
    const list = document.createElement('ul');
    list.className = 'ds-list';
    container.appendChild(list);
    sidebarList = list;

    // Append to body
    document.body.appendChild(container);
}

function updateSidebar(messages) {
    if (!sidebarList) return;

    // Optimization: Check if content changed significantly
    // For now, simpler to rebuild to ensure click handlers are fresh
    sidebarList.innerHTML = '';

    messages.forEach((msg, index) => {
        const li = document.createElement('li');
        li.className = 'ds-item';

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'ds-text';
        textSpan.textContent = msg.text;
        textSpan.title = msg.text; // Tooltip for full text
        li.appendChild(textSpan);

        // Indicator Wrapper
        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.className = 'ds-indicator-wrapper';

        // Indicator
        const indicator = document.createElement('span');
        indicator.className = 'ds-indicator';
        indicatorWrapper.appendChild(indicator);
        li.appendChild(indicatorWrapper);

        // Click Event
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            msg.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight active
            const allItems = sidebarList.querySelectorAll('.ds-item');
            allItems.forEach(item => item.classList.remove('active'));
            li.classList.add('active');
        });

        sidebarList.appendChild(li);
    });

    // Toggle visibility based on content
    const container = document.getElementById('doubao-sidebar-container');
    if (container) {
        container.style.display = messages.length > 0 ? 'flex' : 'none';
    }
}

function getMessages() {
    const config = CONFIG[currentPlatform];
    if (!config) return [];

    let elements = [];
    try {
        if (currentPlatform === PLATFORMS.DOUBAO) {
            if (config.userMessageParent) {
                elements = Array.from(document.querySelectorAll(config.userMessageParent));
            }
        } else if (config.containerSelector) {
            elements = Array.from(document.querySelectorAll(config.containerSelector));
        }
    } catch (e) {
        console.error('[AIChatIndex] Error querying elements:', e);
        return [];
    }

    const messages = elements.map(el => {
        try {
            const text = config.getText(el);
            return { element: el, text: text };
        } catch (e) {
            return null;
        }
    }).filter(item => item && item.text && item.text.length > 0);

    return messages;
}

function startObserving() {
    // Initial load
    const messages = getMessages();
    updateSidebar(messages);

    // Observer
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const msgs = getMessages();
            updateSidebar(msgs);
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function init() {
    // Remove existing if any (for hot-reload dev)
    const existing = document.getElementById('doubao-sidebar-container');
    if (existing) existing.remove();

    createSidebar();
    startObserving();

    // SPA URL Change Detection
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                const msgs = getMessages();
                updateSidebar(msgs);
            }, 1000); // Wait for page load
        }
    }).observe(document, { subtree: true, childList: true });
}

// Start
detectPlatform();

}) ();
