// ==UserScript==
// @name               ChatAI对话导航 - 侧边栏（适配ChatGPT、Gemini、DeepSeek）
// @version            2.0
// @license            MIT
// @author             Cosmo
// @description        为 ChatGPT、DeepSeek 和 Gemini 网页版添加侧边栏导航，支持点击跳转、平滑滚动、自动高亮当前问题、自定义宽度。
// @namespace          npm/chatai-directory
// @match              https://chatgpt.com/*
// @match              https://chat.openai.com/*
// @match              https://chat.deepseek.com/*
// @match              https://gemini.google.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/557723/ChatAI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%88%E9%80%82%E9%85%8DChatGPT%E3%80%81Gemini%E3%80%81DeepSeek%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557723/ChatAI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%88%E9%80%82%E9%85%8DChatGPT%E3%80%81Gemini%E3%80%81DeepSeek%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBOUNCE_DELAY = 600;
    const DOM_MARK = 'data-chatai-directory';
    const DEFAULT_WIDTH = 200;
    const MIN_WIDTH = 150;
    const MAX_WIDTH = 400;
    const RESIZE_STEP = 20;

    let lastQuestionCount = 0;
    let observerTimeout = null;
    let currentConversationId = null;

    // Cache/State
    let cachedQuestions = [];
    let cachedSidebarItems = [];
    let isScrolling = false;
    let currentStrategy = null;
    let currentWidth = DEFAULT_WIDTH;

    /**
     * Safe DOM Creator
     */
    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    }

    /**
     * Strategy Definitions
     */
    const STRATEGIES = {
        CHATGPT: {
            name: 'ChatGPT',
            match: () => location.hostname.includes('chatgpt.com') || location.hostname.includes('openai.com'),
            extractQuestions: () => {
                const turns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
                const pairs = [];
                turns.forEach(turn => {
                    const userMsg = turn.querySelector('[data-message-author-role="user"]');
                    if (userMsg) {
                        pairs.push({
                            dom: turn,
                            text: userMsg.innerText.trim()
                        });
                    }
                });
                return pairs;
            },
            checkConversationChange: () => {
                const match = location.pathname.match(/\/c\/([a-z0-9-]+)/);
                return match ? match[1] : null;
            },
            themeColor: '#10a37f', // ChatGPT Green
            bgColor: '#f0fdf4'
        },
        DEEPSEEK: {
            name: 'DeepSeek',
            match: () => location.hostname.includes('deepseek.com'),
            extractQuestions: () => {
                const markdownMessages = document.querySelectorAll('.ds-message:has(> .ds-markdown)');
                const pairs = [];
                markdownMessages.forEach(answerMsg => {
                    const parentDiv = answerMsg.parentElement;
                    const prevSibling = parentDiv ? parentDiv.previousElementSibling : null;
                    if (prevSibling) {
                        const questionMsg = prevSibling.querySelector('.ds-message');
                        if (questionMsg) {
                            pairs.push({
                                dom: questionMsg,
                                text: questionMsg.textContent.trim()
                            });
                        }
                    }
                });
                return pairs;
            },
            checkConversationChange: () => location.pathname,
            themeColor: '#4d8aff', // DeepSeek Blue
            bgColor: '#eef4ff'
        },
        GEMINI: {
            name: 'Gemini',
            match: () => location.hostname.includes('gemini.google.com'),
            extractQuestions: () => {
                const turns = document.querySelectorAll('user-query, .user-query');
                const pairs = [];
                turns.forEach(turn => {
                    const userMsg = turn.querySelector('.query-text, .query-content, div[class*="query-content"]');
                    if (userMsg) {
                        pairs.push({
                            dom: turn,
                            text: userMsg.innerText.trim()
                        });
                    }
                });
                return pairs;
            },
            checkConversationChange: () => location.href,
            themeColor: '#1a73e8', // Google Blue
            bgColor: '#e8f0fe',
            getScroller: () => {
                return document.querySelector('infinite-scroller') ||
                    document.querySelector('.chat-history-scroll-container') ||
                    document.querySelector('main') ||
                    document.body;
            }
        }
    };

    /**
     * Initialize Strategy
     */
    function initStrategy() {
        if (STRATEGIES.CHATGPT.match()) currentStrategy = STRATEGIES.CHATGPT;
        else if (STRATEGIES.DEEPSEEK.match()) currentStrategy = STRATEGIES.DEEPSEEK;
        else if (STRATEGIES.GEMINI.match()) currentStrategy = STRATEGIES.GEMINI;

        console.log(`ChatAI Directory: Active Strategy - ${currentStrategy ? currentStrategy.name : 'None'}`);
    }

    /**
     * Create Sidebar UI
     */
    function createSidebar() {
        if (document.getElementById('chatai-sidebar')) return;
        if (!currentStrategy) return;

        const sidebar = createEl('div');
        sidebar.id = 'chatai-sidebar';
        sidebar.setAttribute(DOM_MARK, '');
        sidebar.style.width = `${currentWidth}px`;

        // Header
        const header = createEl('div', 'gh-header');
        header.id = 'gh-header';

        const headerLeft = createEl('div', 'gh-header-left');
        const title = createEl('span', 'gh-title', '导航');
        headerLeft.appendChild(title);

        const controls = createEl('div', 'gh-controls');
        const topBtn = createEl('span', 'gh-nav-btn', '⬆');
        topBtn.id = 'gh-msg-top';
        topBtn.title = '跳转到第一条';

        const bottomBtn = createEl('span', 'gh-nav-btn', '⬇');
        bottomBtn.id = 'gh-msg-bottom';
        bottomBtn.title = '跳转到最后一条';

        const toggleBtn = createEl('span', 'gh-toggle', '−');
        toggleBtn.title = '折叠/展开';

        controls.appendChild(topBtn);
        controls.appendChild(bottomBtn);
        controls.appendChild(toggleBtn);

        header.appendChild(headerLeft);
        header.appendChild(controls);

        // Content
        const content = createEl('div', 'gh-content');
        content.id = 'gh-content';
        content.appendChild(createEl('div', 'gh-empty', '正在扫描对话...'));

        // Footer (Resize Controls)
        const footer = createEl('div', 'gh-footer');

        const widenBtn = createEl('span', 'gh-resize-btn', '+');
        widenBtn.title = '变宽';

        const narrowBtn = createEl('span', 'gh-resize-btn', '-');
        narrowBtn.title = '变窄';

        const resetBtn = createEl('span', 'gh-resize-btn', '↺');
        resetBtn.title = '重置宽度';

        footer.appendChild(narrowBtn);
        footer.appendChild(resetBtn);
        footer.appendChild(widenBtn);

        sidebar.appendChild(header);
        sidebar.appendChild(content);
        sidebar.appendChild(footer);

        // Styles
        const themeColor = currentStrategy.themeColor;
        const bgColor = currentStrategy.bgColor;

        const style = document.createElement('style');
        style.textContent = `
            #chatai-sidebar {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #ffffff;
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                max-height: 70vh;
                transition: height 0.3s, opacity 0.3s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* NO Width transition to avoid lag */
                overflow: hidden;
            }

            #chatai-sidebar.gh-collapsed {
                width: 48px !important;
                height: 48px;
                border-radius: 24px;
                opacity: 0.9;
            }

            #chatai-sidebar.gh-collapsed .gh-content,
            #chatai-sidebar.gh-collapsed .gh-title,
            #chatai-sidebar.gh-collapsed .gh-nav-btn,
            #chatai-sidebar.gh-collapsed .gh-footer {
                display: none !important;
            }

            #chatai-sidebar.gh-collapsed .gh-header {
                padding: 0;
                justify-content: center;
                height: 100%;
                border-bottom: none;
            }

            #chatai-sidebar.gh-collapsed .gh-controls {
                justify-content: center;
                width: 100%;
            }

            .gh-header {
                background: #f9fafb;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
                user-select: none;
                flex-shrink: 0;
            }
            .gh-header:hover { background: #f3f4f6; }

            .gh-header-left { display: flex; align-items: center; }
            .gh-title { font-weight: 600; font-size: 14px; color: #111827; }

            .gh-controls { display: flex; align-items: center; gap: 8px; }

            .gh-nav-btn {
                font-size: 14px;
                color: #6b7280;
                padding: 2px 6px;
                border-radius: 4px;
                transition: all 0.2s;
                display: flex;
            }
            .gh-nav-btn:hover { background: #e5e7eb; color: #111827; }

            .gh-toggle {
                font-size: 18px;
                color: #6b7280;
                transition: transform 0.3s;
                padding: 0 4px;
            }

            .gh-content {
                overflow-y: auto;
                padding: 8px 0;
                flex-grow: 1;
                scrollbar-width: thin;
                scrollbar-color: #e5e7eb transparent;
            }
            .gh-content::-webkit-scrollbar { width: 4px; }
            .gh-content::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }

            .gh-item {
                padding: 10px 16px;
                font-size: 13px;
                color: #4b5563;
                cursor: pointer;
                border-left: 3px solid transparent;
                transition: all 0.2s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.4;
            }
            .gh-item:hover { background: #f9fafb; color: ${themeColor}; }
            .gh-item.gh-active {
                background: ${bgColor};
                color: ${themeColor};
                border-left-color: ${themeColor};
                font-weight: 500;
            }

            .gh-footer {
                padding: 8px 16px;
                border-top: 1px solid #f3f4f6;
                background: #f9fafb;
                display: flex;
                justify-content: flex-end; /* Align right to keep buttons stable */
                gap: 16px;
                user-select: none;
            }

            .gh-resize-btn {
                font-size: 14px;
                color: #9ca3af;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
                font-weight: bold;
            }
            .gh-resize-btn:hover {
                background: #e5e7eb;
                color: #4b5563;
            }

            .gh-empty {
                padding: 24px 16px;
                text-align: center;
                color: #9ca3af;
                font-size: 12px;
            }

            .gh-highlight { animation: gh-fade 2s ease; }
            @keyframes gh-fade {
                0% { background-color: rgba(16, 163, 127, 0.1); }
                100% { background-color: transparent; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(sidebar);

        // Events
        header.addEventListener('click', (e) => {
            if (e.target.closest('.gh-nav-btn')) return;
            sidebar.classList.toggle('gh-collapsed');
            toggleBtn.textContent = sidebar.classList.contains('gh-collapsed') ? '+' : '−';
        });

        topBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (cachedQuestions.length > 0) {
                cachedQuestions[0].dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        bottomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (cachedQuestions.length > 0) {
                cachedQuestions[cachedQuestions.length - 1].dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Resize Logic
        const updateWidth = (w) => {
            currentWidth = Math.min(Math.max(w, MIN_WIDTH), MAX_WIDTH);
            sidebar.style.width = `${currentWidth}px`;
        }

        widenBtn.addEventListener('click', () => updateWidth(currentWidth + RESIZE_STEP));
        narrowBtn.addEventListener('click', () => updateWidth(currentWidth - RESIZE_STEP));
        resetBtn.addEventListener('click', () => updateWidth(DEFAULT_WIDTH));

        initDraggable(sidebar, header);
    }

    function initDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.closest('.gh-controls')) return;
            if (el.classList.contains('gh-collapsed')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            el.style.right = 'auto'; // Break any conflicting position
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function updateTOC() {
        if (!currentStrategy) return;

        const questions = currentStrategy.extractQuestions();
        cachedQuestions = questions;

        if (questions.length === lastQuestionCount && questions.length > 0) return;

        const content = document.getElementById('gh-content');
        if (!content) return;

        lastQuestionCount = questions.length;

        // Safe Clear
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        if (questions.length === 0) {
            content.appendChild(createEl('div', 'gh-empty', '未发现用户问题'));
            cachedSidebarItems = [];
            return;
        }

        // Safe Build
        cachedSidebarItems = [];
        questions.forEach((q, idx) => {
            const item = createEl('div', 'gh-item', q.text);
            item.dataset.index = idx;
            item.title = q.text;

            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const target = cachedQuestions[idx].dom;
                if (target) {
                    cachedSidebarItems.forEach(i => i.classList.remove('gh-active'));
                    this.classList.add('gh-active');
                    target.classList.add('gh-highlight');
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => target.classList.remove('gh-highlight'), 2000);
                }
            });

            content.appendChild(item);
            cachedSidebarItems.push(item);
        });

        requestAnimationFrame(syncHighlight);
    }

    function checkConversationChange() {
        if (!currentStrategy) return;
        const newId = currentStrategy.checkConversationChange();
        if (newId !== currentConversationId) {
            currentConversationId = newId;
            lastQuestionCount = 0;
            updateTOC();
        }
    }

    function syncHighlight() {
        if (!cachedQuestions.length || !cachedSidebarItems.length) return;

        let activeIdx = -1;
        const threshold = 160;
        const viewportHeight = window.innerHeight;

        for (let i = 0; i < cachedQuestions.length; i++) {
            const dom = cachedQuestions[i].dom;
            if (!dom.isConnected) continue;

            const rect = dom.getBoundingClientRect();
            if (rect.top >= -threshold && rect.top <= viewportHeight / 2) {
                activeIdx = i;
                break;
            }
        }

        if (activeIdx === -1) {
            for (let i = cachedQuestions.length - 1; i >= 0; i--) {
                const dom = cachedQuestions[i].dom;
                if (!dom.isConnected) continue;
                const rect = dom.getBoundingClientRect();
                if (rect.top < threshold) {
                    activeIdx = i;
                    break;
                }
            }
        }

        cachedSidebarItems.forEach((item, idx) => {
            if (idx === activeIdx) item.classList.add('gh-active');
            else item.classList.remove('gh-active');
        });

        isScrolling = false;
    }

    function onScroll() {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(syncHighlight);
        }
    }

    function setupApp() {
        initStrategy();
        if (!currentStrategy) return;

        createSidebar();

        const observer = new MutationObserver((mutations) => {
            if (observerTimeout) clearTimeout(observerTimeout);

            let shouldUpdate = false;
            for (const m of mutations) {
                if (m.type === 'childList') {
                    if (m.addedNodes.length > 0) {
                        shouldUpdate = true;
                        break;
                    }
                    if (m.target && m.target.className && typeof m.target.className === 'string' &&
                        (m.target.className.includes('message') || m.target.className.includes('markdown') || m.target.className.includes('query'))) {
                        shouldUpdate = true;
                        break;
                    }
                }
            }

            if (shouldUpdate) {
                observerTimeout = setTimeout(() => {
                    updateTOC();
                    checkConversationChange();
                }, DEBOUNCE_DELAY);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Scroll Binding
        let scroller = window;
        if (currentStrategy.getScroller) {
            scroller = currentStrategy.getScroller();
            if (scroller) scroller.addEventListener('scroll', onScroll, { passive: true });
        }
        window.addEventListener('scroll', onScroll, { passive: true }); // Fallback

        // Periodic Check
        setInterval(() => {
            checkConversationChange();
            if (!document.getElementById('chatai-sidebar')) {
                createSidebar();
                updateTOC();
            }
            if (currentStrategy.getScroller) {
                const newScroller = currentStrategy.getScroller();
                if (newScroller && newScroller !== scroller) {
                    scroller = newScroller;
                    scroller.addEventListener('scroll', onScroll, { passive: true });
                }
            }
        }, 2000);

        setTimeout(() => {
            updateTOC();
            checkConversationChange();
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupApp);
    } else {
        setupApp();
    }

})();
