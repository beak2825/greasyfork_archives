// ==UserScript==
// @name         Gemini 目录插件 (v1.1)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修复最新条目定位问题，以及Top按钮无法一键返回对话开始位置。
// @author       ArcherEmiya
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v11%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v11%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        userMessageSelector: '.query-text-line',
        displayCount: 5
    };

    // --- 1. 样式 (CSS) ---
    const STYLE_ID = 'gemini-toc-style-v14';
    if (!document.getElementById(STYLE_ID)) {
        const styles = `
            #gemini-toc-v14 {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 260px;
                background: #1e1f20;
                color: #e3e3e3;
                border: 1px solid #444;
                border-radius: 12px;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                font-family: 'Google Sans', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                font-size: 13px;
                user-select: none;
                height: auto;
            }
            .toc-header {
                padding: 10px 14px;
                border-bottom: 1px solid #444;
                background: #2b2c2e;
                border-radius: 12px 12px 0 0;
                flex-shrink: 0;
                cursor: move;
            }
            .toc-top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .toc-title { font-weight: bold; font-size: 13px; pointer-events: none; color: #ccc;}

            .toc-btn-group { display: flex; gap: 8px; }
            .toc-btn {
                background: transparent;
                border: 1px solid #555;
                color: #aaa;
                cursor: pointer;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 14px;
                transition: all 0.2s;
                line-height: 1;
                min-width: 24px;
                text-align: center;
            }
            .toc-btn:hover { background: #8ab4f8; color: #1f1f1f; border-color: #8ab4f8; }
            .toc-btn:disabled { cursor: wait; color: #8ab4f8; border-color: #8ab4f8; }

            #toc-search-input {
                width: 100%;
                background: #131314;
                border: 1px solid #555;
                color: #fff;
                padding: 5px 8px;
                border-radius: 6px;
                box-sizing: border-box;
                outline: none;
                font-size: 12px;
                cursor: text;
            }
            #toc-search-input:focus { border-color: #8ab4f8; }

            #toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
                flex-grow: 1;
                cursor: default;
                overflow-y: auto;
                max-height: 175px;
                scroll-behavior: auto;
            }
            #toc-list::-webkit-scrollbar { width: 4px; }
            #toc-list::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }

            .toc-item {
                padding: 8px 14px;
                border-bottom: 1px solid #2d2e30;
                cursor: pointer;
                font-size: 12px;
                color: #c4c7c5;
                line-height: 1.4;
                display: flex;
                align-items: flex-start;
            }
            .toc-item:last-child { border-bottom: none; border-radius: 0 0 12px 12px; }
            .toc-item:hover { background-color: #333537; color: #fff; }
            .toc-item-hidden { display: none !important; }

            .toc-bullet {
                margin-right: 8px;
                color: #8ab4f8;
                font-weight: bold;
                flex-shrink: 0;
            }

            .toc-status { padding: 10px; text-align: center; color: #666; font-size: 12px; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.id = STYLE_ID;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // --- 2. 拖拽逻辑 ---
    function makeDraggable(el) {
        const header = el.querySelector('.toc-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            el.style.right = 'auto';
            el.style.left = `${initialLeft}px`;
            el.style.top = `${initialTop}px`;
            el.style.opacity = '0.9';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) { isDragging = false; el.style.opacity = '1'; }
        });
    }

    // --- 3. 强力滚动逻辑 ---
    function getScrollContainer() {
        const anchor = document.querySelector(CONFIG.userMessageSelector);
        if (!anchor) return document.documentElement;
        let currentElement = anchor.parentElement;
        while (currentElement && currentElement !== document.body) {
            const style = window.getComputedStyle(currentElement);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                                 (currentElement.scrollHeight > currentElement.clientHeight);
            if (isScrollable) return currentElement;
            currentElement = currentElement.parentElement;
        }
        return document.documentElement;
    }

    // 涡轮回溯置顶
    function handleTurboTop() {
        const btn = document.getElementById('toc-btn-top');
        if (btn) {
            btn.textContent = '⏳';
            btn.disabled = true;
        }

        const container = getScrollContainer();
        let stableCount = 0;
        let lastHeight = container.scrollHeight;

        const timer = setInterval(() => {
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            if (container && container !== document.documentElement) {
                container.scrollTop = 0;
            }

            const currentHeight = container.scrollHeight;
            if (currentHeight > lastHeight) {
                lastHeight = currentHeight;
                stableCount = 0;
            } else {
                stableCount++;
            }

            if (stableCount > 10) {
                clearInterval(timer);
                if (btn) {
                    btn.textContent = '⬆';
                    btn.disabled = false;
                }
                if (container && container !== document.documentElement) container.scrollTop = 0;
                scanContent(true);
            }
        }, 100);
    }

    function handleScrollBottom() {
        const container = getScrollContainer();
        let targetTop = 0;
        let targetEl = container;
        if (container === document.documentElement) {
             targetTop = document.body.scrollHeight;
             targetEl = window;
        } else {
             targetTop = container.scrollHeight;
        }
        targetEl.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    // --- 4. UI 逻辑 ---
    function createUI() {
        if (document.getElementById('gemini-toc-v14')) return;
        if (!document.body) return;

        const panel = document.createElement('div');
        panel.id = 'gemini-toc-v14';

        const header = document.createElement('div');
        header.className = 'toc-header';

        const topRow = document.createElement('div');
        topRow.className = 'toc-top-row';

        const title = document.createElement('span');
        title.className = 'toc-title';
        title.textContent = `对话索引`;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'toc-btn-group';

        const topBtn = document.createElement('button');
        topBtn.id = 'toc-btn-top';
        topBtn.className = 'toc-btn';
        topBtn.textContent = '⬆';
        topBtn.title = "强制回溯至对话起点";
        topBtn.onclick = handleTurboTop;

        const botBtn = document.createElement('button');
        botBtn.className = 'toc-btn';
        botBtn.textContent = '⬇';
        botBtn.title = "滚到底部";
        botBtn.onclick = handleScrollBottom;

        btnGroup.appendChild(topBtn);
        btnGroup.appendChild(botBtn);
        topRow.appendChild(title);
        topRow.appendChild(btnGroup);

        const searchInput = document.createElement('input');
        searchInput.id = 'toc-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = '搜索...';
        searchInput.addEventListener('input', (e) => filterList(e.target.value));

        header.appendChild(topRow);
        header.appendChild(searchInput);

        const ul = document.createElement('ul');
        ul.id = 'toc-list';

        panel.appendChild(header);
        panel.appendChild(ul);
        document.body.appendChild(panel);

        makeDraggable(panel);
        scanContent(true);
    }

    function filterList(keyword) {
        const list = document.getElementById('toc-list');
        if (!list) return;
        const items = list.querySelectorAll('.toc-item');
        const lowerKeyword = keyword.toLowerCase();
        items.forEach(item => {
            const fullText = item.getAttribute('data-fulltext') || '';
            if (fullText.includes(lowerKeyword)) {
                item.classList.remove('toc-item-hidden');
            } else {
                item.classList.add('toc-item-hidden');
            }
        });
    }

    // --- 5. 扫描逻辑 ---
    function scanContent(forceUpdate = false) {
        const list = document.getElementById('toc-list');
        if (!list) return;

        const allItems = document.querySelectorAll(CONFIG.userMessageSelector);
        const totalCount = allItems.length;
        const currentTocItems = list.querySelectorAll('.toc-item');

        if (!forceUpdate && currentTocItems.length === totalCount && totalCount > 0) {
            const lastDomText = allItems[totalCount - 1].innerText.trim();
            const lastTocText = currentTocItems[totalCount - 1].title;
            if (lastDomText === lastTocText) return;
        }

        const searchInput = document.getElementById('toc-search-input');
        const currentKeyword = searchInput ? searchInput.value : '';
        const wasAtBottom = (list.scrollHeight - list.scrollTop) <= (list.clientHeight + 5);
        const isFirstLoad = list.children.length === 0;
        const previousScrollTop = list.scrollTop;

        list.textContent = '';

        if (totalCount === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'toc-status';
            emptyItem.textContent = 'waiting...';
            list.appendChild(emptyItem);
            return;
        }

        for (let i = 0; i < totalCount; i++) {
            const el = allItems[i];
            const text = el.innerText.trim();
            if (!text) continue;

            const li = document.createElement('li');
            li.className = 'toc-item';
            li.setAttribute('data-fulltext', text.toLowerCase());

            const shortText = text.length > 20 ? text.substring(0, 20) + '...' : text;

            const bulletSpan = document.createElement('span');
            bulletSpan.className = 'toc-bullet';
            bulletSpan.textContent = '•';

            const textNode = document.createTextNode(' ' + shortText);

            li.appendChild(bulletSpan);
            li.appendChild(textNode);
            li.title = text;

            // ▼▼▼ 核心修正点 ▼▼▼
            // 不再判断 if (i === totalCount - 1)
            // 所有条目统一使用 scrollIntoView，且 block: 'center' 确保居中
            li.onclick = () => {
                if (el && el.isConnected) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // 只有在元素真的找不到时，才回到底部
                    handleScrollBottom();
                }

                el.style.transition = 'background 0.3s';
                const originalBg = el.style.backgroundColor;
                el.style.backgroundColor = '#3c4043';
                setTimeout(() => { el.style.backgroundColor = originalBg || ''; }, 800);
            };
            list.appendChild(li);
        }

        if (currentKeyword) {
            filterList(currentKeyword);
        }

        if (wasAtBottom || isFirstLoad) {
             list.scrollTop = list.scrollHeight;
        } else {
             list.scrollTop = previousScrollTop;
        }
    }

    // --- 6. 永动心跳 ---
    setInterval(() => {
        const panel = document.getElementById('gemini-toc-v14');
        if (!panel) {
            createUI();
        } else {
            scanContent(false);
        }
    }, 1000);

    console.log("Gemini 插件 v14.0 (Accurate Positioning) Loaded");

})();