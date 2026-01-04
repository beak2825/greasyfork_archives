// ==UserScript==
// @name         AI 导航栏(Gemini & ChatGPT & DeepSeek)
// @name:en      AI Chat Sidebar (Gemini & ChatGPT & DeepSeek)
// @namespace    https://github.com/kuilei98/ai-conversation-sidebar
// @version      2.0.0.1213
// @uuid         7a3b9c1d-8e4f-4a5b-9c6d-1e2f3a4b5c6d
// @description  🚀 三合一 AI 侧边导航栏。支持 Gemini、ChatGPT、DeepSeek。提供长对话索引、极速跳转与本地收藏功能。
// @description:en 🚀 AI Sidebar for Gemini, ChatGPT, and DeepSeek. Features: conversation navigation, jump to message, and bookmarking.
// @author       kuilei98
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @supportURL   https://github.com/kuilei98/ai-conversation-sidebar/issues
// @homepageURL  https://github.com/kuilei98/ai-conversation-sidebar
// @grant        none
// @license      MIT
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/557927/AI%20%E5%AF%BC%E8%88%AA%E6%A0%8F%28Gemini%20%20ChatGPT%20%20DeepSeek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557927/AI%20%E5%AF%BC%E8%88%AA%E6%A0%8F%28Gemini%20%20ChatGPT%20%20DeepSeek%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 全局配置与样式 ---
    const NAV_CONTAINER_ID = 'ai-nav-container-universal';
    const NAV_CONTENT_ID = 'ai-nav-content-list';
    const CONTROL_TEXT = '按住拖动 | 单击折叠';
    
    // CSS变量解耦，适配深色模式
    const STATIC_CSS = `
        :root {
            --ai-accent: #0b57d0;
            --ai-highlight: rgba(11, 87, 208, 0.15);
            --ai-top-offset: 100px;
            --ai-bg: #ffffff;
            --ai-border: rgba(0,0,0,0.08);
            --ai-shadow: 0 2px 6px rgba(0,0,0,0.08);
            --ai-shadow-hover: 0 8px 20px rgba(0,0,0,0.12);
            --ai-text-primary: #1f1f1f;
            --ai-text-secondary: #444746;
            --ai-star-inactive: #c4c7c5;
            --ai-star-active: #fbbc04;
            --ai-star-bg: #fff8e1;
            --ai-star-text: #b06000;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --ai-bg: #1e1f20;
                --ai-border: rgba(255,255,255,0.1);
                --ai-shadow: 0 2px 6px rgba(0,0,0,0.4);
                --ai-shadow-hover: 0 8px 24px rgba(0,0,0,0.6);
                --ai-text-primary: #e3e3e3;
                --ai-text-secondary: #c4c7c5;
                --ai-star-inactive: #8e918f;
                --ai-star-bg: #3f3a2c;
                --ai-star-text: #fdd663;
            }
        }

        #${NAV_CONTAINER_ID} {
            position: fixed; top: var(--ai-top-offset); right: 15px; width: auto; max-height: 98vh;
            display: flex; flex-direction: column; gap: 4px; align-items: flex-end; z-index: 2147483647; padding-bottom: 20px;
        }
        #${NAV_CONTAINER_ID}.ai-left-side { align-items: flex-start; }
        #${NAV_CONTENT_ID} { display: flex; flex-direction: column; gap: 4px; align-items: inherit; width: 100%; overflow: visible; }
        #${NAV_CONTENT_ID}.hidden { display: none; }

        .nav-capsule {
            pointer-events: auto; background-color: var(--ai-bg); border: 1px solid var(--ai-border); color: var(--ai-text-primary);
            width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center;
            box-shadow: var(--ai-shadow); cursor: pointer; transition: width 0.25s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s, box-shadow 0.2s, border-radius 0.2s;
            overflow: hidden; white-space: nowrap; position: relative; flex-shrink: 0; box-sizing: border-box;
            border-radius: 5px 0 0 5px; flex-direction: row;
        }
        #${NAV_CONTAINER_ID}.ai-left-side .nav-capsule { border-radius: 0 5px 5px 0; flex-direction: row-reverse; }

        .nav-capsule:hover, .nav-capsule.is-dragging { 
            width: 280px; padding: 0 12px; justify-content: space-between; 
            background-color: var(--ai-bg); box-shadow: var(--ai-shadow-hover); 
            z-index: 10000; border-color: transparent; border-radius: 5px 0 0 5px; 
        }
        #${NAV_CONTAINER_ID}.ai-left-side .nav-capsule:hover, 
        #${NAV_CONTAINER_ID}.ai-left-side .nav-capsule.is-dragging { border-radius: 0 5px 5px 0; }

        .nav-capsule.control-capsule {
            cursor: grab; border-left: 3px solid var(--ai-accent); z-index: 10001; touch-action: none; user-select: none;
        }
        #${NAV_CONTAINER_ID}.ai-left-side .nav-capsule.control-capsule { border-left: 1px solid var(--ai-border); border-right: 3px solid var(--ai-accent); }
        .nav-capsule.control-capsule:active { cursor: grabbing; }
        .nav-capsule.control-capsule .capsule-index { font-size: 18px; transform: translateY(-1px); }

        .capsule-index { font-weight: 700; font-size: 13px; color: var(--ai-accent); text-align: center; min-width: auto; flex-shrink: 0; transition: transform 0.2s; }
        .capsule-text { display: none; font-size: 13px; color: var(--ai-text-secondary); flex: 1; margin: 0 12px; overflow: hidden; text-overflow: ellipsis; text-align: left; }
        #${NAV_CONTAINER_ID}.ai-left-side .capsule-text { text-align: right; }
        .nav-capsule:hover .capsule-text, .nav-capsule.is-dragging .capsule-text { display: block; animation: fadeIn 0.2s forwards; }

        .capsule-star { display: none; font-size: 16px; color: var(--ai-star-inactive); width: 18px; text-align: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
        .nav-capsule:hover .capsule-star, .nav-capsule.is-dragging .capsule-star { display: block; }
        .capsule-star.unlocked { opacity: 1 !important; color: var(--ai-text-primary); transform: scale(1.1); }
        .capsule-star.denied { animation: shake 0.3s ease; }
        
        .nav-capsule.starred { background-color: var(--ai-star-bg); border-color: transparent; }
        .nav-capsule.starred .capsule-index { color: var(--ai-star-text); }
        .nav-capsule.starred .capsule-star { display: block !important; opacity: 1 !important; color: var(--ai-star-active) !important; transform: scale(1.1); }

        .nav-capsule.active {
            background-color: var(--ai-highlight);
            border-left: 3px solid var(--ai-accent);
            border-right: 1px solid var(--ai-border); border-top: 1px solid var(--ai-border); border-bottom: 1px solid var(--ai-border);
        }
        #${NAV_CONTAINER_ID}.ai-left-side .nav-capsule.active {
            border-left: 1px solid var(--ai-border); border-right: 3px solid var(--ai-accent); 
        }
        .nav-capsule.active .capsule-index { transform: scale(1.1); }

        .ai-active-message {
            background-color: var(--ai-highlight) !important;
            box-shadow: -4px 0 0 var(--ai-accent); transition: background-color 0.3s ease; border-radius: 4px; 
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        [data-ai-index]::before { content: attr(data-ai-index); display: inline-block; font-family: Consolas, monospace; font-weight: bold; color: var(--ai-accent); margin-right: 10px; font-size: 1.1em; opacity: 1; user-select: none; vertical-align: middle; }
    `;

    // --- 2. 平台适配策略 ---
    const PLATFORMS = {
        'gemini': {
            color: '#0b57d0', highlight: 'rgba(11, 87, 208, 0.15)', top: '140px',
            selectors: ['user-query', '.user-query', '[data-test-id="user-query"]', 'div.user-query-container']
        },
        'chatgpt': {
            color: '#10a37f', highlight: 'rgba(16, 163, 127, 0.15)', top: '140px', darkModeBg: '#212121',
            selectors: ['[data-message-author-role="user"]', '.group\\/conversation-turn:has([data-message-author-role="user"])']
        },
        'deepseek': {
            color: '#4d8aff', highlight: 'rgba(77, 138, 255, 0.15)', top: '100px',
            customQueryList: () => {
                const questions = [];
                document.querySelectorAll('.ds-message:has(> .ds-markdown)').forEach(answerMsg => {
                    const prevSibling = answerMsg.parentElement?.previousElementSibling;
                    const questionMsg = prevSibling?.querySelector('.ds-message');
                    if (questionMsg) questions.push(questionMsg);
                });
                return questions;
            }
        }
    };

    // --- 3. 环境检测与初始化 ---
    const host = window.location.hostname;
    let currentPlatform, siteKey;
    if (host.includes('gemini.google')) { currentPlatform = PLATFORMS.gemini; siteKey = 'gemini'; }
    else if (host.includes('chatgpt') || host.includes('openai')) { currentPlatform = PLATFORMS.chatgpt; siteKey = 'chatgpt'; }
    else if (host.includes('deepseek')) { currentPlatform = PLATFORMS.deepseek; siteKey = 'deepseek'; }
    else return;

    const styleEl = document.createElement('style');
    styleEl.textContent = STATIC_CSS;
    document.head.appendChild(styleEl);

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--ai-accent', currentPlatform.color);
    rootStyle.setProperty('--ai-highlight', currentPlatform.highlight);
    rootStyle.setProperty('--ai-top-offset', currentPlatform.top);
    if (currentPlatform.darkModeBg) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) rootStyle.setProperty('--ai-bg', currentPlatform.darkModeBg);
    }

    let currentChatId = '';
    let cachedStars = {};
    let isCollapsed = false;
    let cachedSelector = null;
    let windowStartIndex = 0;
    let activeGlobalIndex = -1;
    let maxVisible = 10;
    let dragOffsetX = 0, dragOffsetY = 0, rafId = null;

    // --- 4. 常用工具函数 ---
    const getClientXY = (e) => (e.touches && e.touches.length > 0) ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    const defaultGetText = (el) => el.textContent || el.innerText || '';
    
    function throttle(func, wait) {
        let timeout = null;
        return function(...args) {
            if (!timeout) {
                timeout = setTimeout(() => { func.apply(this, args); timeout = null; }, wait);
            }
        };
    }

    // --- 5. 核心逻辑：自适应扫描与布局 ---
    function getBestQueryList() {
        if (currentPlatform.customQueryList) return currentPlatform.customQueryList();
        if (cachedSelector) {
            const res = document.querySelectorAll(cachedSelector);
            if (res.length > 0) return res;
            cachedSelector = null;
        }
        let bestQueries = [];
        for (let s of currentPlatform.selectors) {
            const res = document.querySelectorAll(s);
            if (res.length > bestQueries.length) { bestQueries = res; cachedSelector = s; }
        }
        return bestQueries;
    }

    const fitToScreenAndScan = (force = false) => {
        const container = document.getElementById(NAV_CONTAINER_ID);
        if (!container) return;
        
        const totalItems = getBestQueryList().length;
        if (totalItems === 0) return;

        const rect = container.getBoundingClientRect();
        const containerTop = rect.top > 0 ? rect.top : (parseInt(currentPlatform.top) || 100);
        const availableHeight = window.innerHeight - containerTop - 40;
        const listAvailableHeight = availableHeight - 38; 
        
        let calculatedCapacity = Math.floor(listAvailableHeight / 38);
        if (calculatedCapacity < 1) calculatedCapacity = 1;
        
        maxVisible = Math.min(totalItems, calculatedCapacity);
        scanMessages(force);
    };

    const throttledScan = throttle(() => fitToScreenAndScan(), 1000);
    const throttledResize = throttle(() => fitToScreenAndScan(true), 200);

    // --- 6. 观察者 DOM 监听 ---
    const initObserver = () => {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (let m of mutations) {
                let node = m.target;
                let isInsideNav = false;
                while(node && node !== document) {
                    if (node.id === NAV_CONTAINER_ID) { isInsideNav = true; break; }
                    node = node.parentElement;
                }
                if (!isInsideNav) { shouldUpdate = true; break; }
            }
            if (shouldUpdate) throttledScan();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener('resize', throttledResize);
    setInterval(() => { try { updateChatId(); ensureContainer(); } catch (e) { console.error("AI Nav Error:", e); } }, 1000);
    initObserver();

    function updateChatId() {
        const newPath = window.location.pathname;
        if (newPath !== currentChatId) {
            currentChatId = newPath;
            const storageKey = `${siteKey}_stars_${currentChatId}`;
            cachedStars = JSON.parse(localStorage.getItem(storageKey) || '{}');
            cachedSelector = null;
            windowStartIndex = 0;
            activeGlobalIndex = -1;
            document.querySelectorAll('.ai-active-message').forEach(el => el.classList.remove('ai-active-message'));
            const contentList = document.getElementById(NAV_CONTENT_ID);
            if(contentList) fitToScreenAndScan(true);
        }
    }

    // --- 7. 渲染胶囊与交互反馈 ---
    function createOrUpdateCapsule(capsule, data) {
        const { rawText, shortText, indexLabel, isStarred, uniqueKey, globalIndex } = data;
        
        // 使用标准 DOM API 防止 Trusted Types 错误
        if (!capsule) {
            capsule = document.createElement('div');
            capsule.className = 'nav-capsule';
            
            const indexSpan = document.createElement('span'); indexSpan.className = 'capsule-index';
            const textSpan = document.createElement('span'); textSpan.className = 'capsule-text';
            const starSpan = document.createElement('span'); starSpan.className = 'capsule-star';
            
            starSpan.textContent = '☆';
            starSpan.title = '点击两次以收藏';
            
            capsule.append(indexSpan, textSpan, starSpan);
        }

        if (capsule.title !== rawText) {
            capsule.title = rawText;
            capsule.querySelector('.capsule-text').textContent = shortText;
        }

        capsule.dataset.key = uniqueKey;
        capsule.dataset.index = globalIndex;
        capsule.querySelector('.capsule-index').textContent = indexLabel;

        if (globalIndex === activeGlobalIndex) capsule.classList.add('active');
        else capsule.classList.remove('active');

        const starIcon = capsule.querySelector('.capsule-star');
        if (isStarred) {
             capsule.classList.add('starred');
             starIcon.textContent = '★';
             starIcon.title = '取消收藏';
        } else {
             capsule.classList.remove('starred');
             starIcon.textContent = '☆';
             starIcon.title = '点击两次以收藏';
        }
        return capsule;
    }

    function scanMessages(force = false) {
        const contentList = document.getElementById(NAV_CONTENT_ID);
        if (!contentList) return;

        const queries = getBestQueryList();
        const totalLen = queries.length;

        if (totalLen > maxVisible) {
            if (windowStartIndex + maxVisible > totalLen) {
                windowStartIndex = totalLen - maxVisible;
                force = true;
            }
        } else {
            windowStartIndex = 0;
        }

        const visibleQueries = Array.from(queries).slice(windowStartIndex, windowStartIndex + maxVisible);
        if (force) contentList.replaceChildren();
        while (contentList.children.length > visibleQueries.length) contentList.lastElementChild.remove();

        const getText = currentPlatform.getText || defaultGetText;

        visibleQueries.forEach((el, relativeIndex) => {
            const globalIndex = windowStartIndex + relativeIndex;
            const indexLabel = `Q${globalIndex + 1}`;
            if (el.getAttribute('data-ai-index') !== indexLabel) el.setAttribute('data-ai-index', indexLabel);

            let rawText = getText(el) || `Question ${globalIndex + 1}`;
            rawText = rawText.replace(/\s+/g, ' ').trim();
            const uniqueKey = rawText ? (rawText.substring(0, 50) + "_uid_" + globalIndex) : "empty_node";

            const data = {
                rawText,
                shortText: rawText.length > 25 ? rawText.substring(0, 25) + '...' : rawText,
                indexLabel,
                isStarred: !!cachedStars[uniqueKey],
                uniqueKey,
                globalIndex
            };

            const existingCapsule = contentList.children[relativeIndex];
            const resultCapsule = createOrUpdateCapsule(existingCapsule, data);
            if (!existingCapsule) contentList.appendChild(resultCapsule);
        });
    }

    function handleJump(index) {
        const bestQueries = getBestQueryList();
        const target = bestQueries[index];
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'center' });
            document.querySelectorAll('.ai-active-message').forEach(el => el.classList.remove('ai-active-message'));
            target.classList.add('ai-active-message');
            activeGlobalIndex = index;
            scanMessages(); 
        }
    }

    // --- 8. 事件委托（点击、滚动、触摸） ---
    function setupDelegation(listContainer) {
        listContainer.addEventListener('click', (e) => {
            const capsule = e.target.closest('.nav-capsule');
            if (!capsule) return;
            const index = parseInt(capsule.dataset.index, 10);
            const totalItems = getBestQueryList().length;

            const checkAndTriggerPageFlip = () => {
                const isFirstChild = (capsule === listContainer.firstElementChild);
                const isLastChild = (capsule === listContainer.lastElementChild);
                
                if (isFirstChild && windowStartIndex > 0) {
                    windowStartIndex = Math.max(0, windowStartIndex - (maxVisible - 1));
                    scanMessages(true);
                } 
                else if (isLastChild && index < totalItems - 1) {
                    windowStartIndex = index;
                    scanMessages(true);
                }
            };

            // 收藏功能
            if (e.target.classList.contains('capsule-star')) {
                const key = capsule.dataset.key;
                const starEl = e.target;
                const isStarred = !!cachedStars[key];
                if (!isStarred && !starEl.classList.contains('unlocked')) {
                    starEl.classList.add('unlocked'); starEl.classList.remove('denied');
                    void starEl.offsetWidth; starEl.classList.add('denied');
                    if (!isNaN(index)) {
                        handleJump(index);
                        checkAndTriggerPageFlip();
                    }
                    return;
                }
                if (cachedStars[key]) delete cachedStars[key];
                else cachedStars[key] = true;
                localStorage.setItem(`${siteKey}_stars_${currentChatId}`, JSON.stringify(cachedStars));
                scanMessages();
                checkAndTriggerPageFlip();
                return;
            }
            
            // 跳转功能
            if (!isNaN(index)) {
                handleJump(index);
                checkAndTriggerPageFlip();
            }
        });

        // 鼠标移出重置星星锁
        listContainer.addEventListener('mouseout', (e) => {
            const capsule = e.target.closest('.nav-capsule');
            if (capsule && !capsule.contains(e.relatedTarget)) {
                capsule.querySelector('.capsule-star')?.classList.remove('unlocked');
            }
        });

        // 鼠标滚轮翻页
        listContainer.addEventListener('wheel', (e) => {
            const totalItems = getBestQueryList().length;
            if (totalItems <= maxVisible) return;
            e.preventDefault();
            if (listContainer._isScrolling) return;
            listContainer._isScrolling = true;
            setTimeout(() => listContainer._isScrolling = false, 50);
            
            if (e.deltaY > 0) { if (windowStartIndex + maxVisible < totalItems) { windowStartIndex++; scanMessages(true); } } 
            else { if (windowStartIndex > 0) { windowStartIndex--; scanMessages(true); } }
        }, { passive: false });

        // 触摸滑动翻页
        let touchStartY = 0;
        listContainer.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
        listContainer.addEventListener('touchmove', (e) => { if (getBestQueryList().length > maxVisible && e.cancelable) e.preventDefault(); }, { passive: false });
        listContainer.addEventListener('touchend', (e) => {
            const totalItems = getBestQueryList().length;
            if (totalItems <= maxVisible) return;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaY) > 30) {
                const steps = Math.ceil(Math.abs(deltaY) / 38);
                if (deltaY < 0) { if (windowStartIndex + maxVisible < totalItems) windowStartIndex = Math.min(windowStartIndex + steps, totalItems - maxVisible); }
                else { if (windowStartIndex > 0) windowStartIndex = Math.max(0, windowStartIndex - steps); }
                scanMessages(true);
            }
        });
    }

    // --- 9. 拖拽与折叠控制 ---
    function setupDragAndFold(controlEl) {
        const container = document.getElementById(NAV_CONTAINER_ID);
        let hasMoved = false, isDragging = false;

        const onStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            isDragging = true; hasMoved = false;
            controlEl.classList.add('is-dragging');
            const { x, y } = getClientXY(e);
            controlEl._startX = x; controlEl._startY = y;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const { x, y } = getClientXY(e);
            const dx = x - controlEl._startX, dy = y - controlEl._startY;
            if (!hasMoved && (dx * dx + dy * dy) > 16) hasMoved = true;

            if (hasMoved) {
                if(e.cancelable) e.preventDefault();
                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        const rect = container.getBoundingClientRect();
                        if (dragOffsetX === 0 && dragOffsetY === 0 && controlEl._startX) { 
                             const cur = container.getBoundingClientRect();
                             dragOffsetX = controlEl._startX - cur.left; dragOffsetY = controlEl._startY - cur.top;
                        }
                        let newLeft = x - dragOffsetX, newTop = y - dragOffsetY;
                        const winW = window.innerWidth, winH = window.innerHeight;

                        if (newLeft < 0) newLeft = 0; if (newLeft + rect.width > winW) newLeft = winW - rect.width;
                        if (newTop < 0) newTop = 0; if (newTop + rect.height > winH) newTop = winH - rect.height;

                        container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                        container.style.right = 'auto'; container.style.bottom = 'auto';
                        
                        if (newLeft + (rect.width / 2) < winW / 2) container.classList.add('ai-left-side');
                        else container.classList.remove('ai-left-side');
                        rafId = null;
                    });
                }
            }
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false; controlEl.classList.remove('is-dragging');
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            if (hasMoved) {
                const rect = container.getBoundingClientRect();
                if (rect.left + (rect.width / 2) < window.innerWidth / 2) {
                    container.classList.add('ai-left-side'); container.style.left = rect.left + 'px'; container.style.right = 'auto';
                } else {
                    container.classList.remove('ai-left-side'); container.style.right = (window.innerWidth - rect.right) + 'px'; container.style.left = 'auto';
                }
                const preventClick = (ce) => { ce.preventDefault(); ce.stopPropagation(); controlEl.removeEventListener('click', preventClick, true); };
                controlEl.addEventListener('click', preventClick, true);
                fitToScreenAndScan(true);
            }
            delete controlEl._startX; delete controlEl._startY;
        };

        controlEl.addEventListener('mousedown', onStart);
        controlEl.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
        controlEl.addEventListener('click', (e) => { if(!hasMoved) toggleCollapse(); });
    }

    function toggleCollapse() {
        const contentList = document.getElementById(NAV_CONTENT_ID);
        const iconSpan = document.querySelector('.control-capsule .capsule-index');
        if (!contentList) return;
        isCollapsed = !isCollapsed;
        if (isCollapsed) { contentList.classList.add('hidden'); if(iconSpan) iconSpan.textContent = '+'; } 
        else { contentList.classList.remove('hidden'); if(iconSpan) iconSpan.textContent = '≡'; setTimeout(() => fitToScreenAndScan(true), 50); }
    }

    // --- 10. 启动入口 ---
    function ensureContainer() {
        let container = document.getElementById(NAV_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div'); container.id = NAV_CONTAINER_ID; document.documentElement.appendChild(container);
            const controlCapsule = document.createElement('div'); controlCapsule.className = 'nav-capsule control-capsule';
            
            const iconSpan = document.createElement('span'); iconSpan.className = 'capsule-index'; iconSpan.textContent = '≡';
            const textSpan = document.createElement('span'); textSpan.className = 'capsule-text'; textSpan.textContent = CONTROL_TEXT;
            
            controlCapsule.append(iconSpan, textSpan);
            
            setupDragAndFold(controlCapsule); container.appendChild(controlCapsule);
            const listContainer = document.createElement('div'); listContainer.id = NAV_CONTENT_ID; container.appendChild(listContainer);
            setupDelegation(listContainer);
        }
    }
})();