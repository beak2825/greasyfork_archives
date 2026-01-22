// ==UserScript==
// @name         Gemini 目录插件 (v1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除冗余的刷新按钮，全自动检测更新，界面更清爽
// @author       Gemini Assistant
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        userMessageSelector: '.query-text-line',
    };

    // --- 1. 样式 (CSS) ---
    const STYLE_ID = 'gemini-toc-style-v6';
    if (!document.getElementById(STYLE_ID)) {
        const styles = `
            #gemini-toc-v6 {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 280px;
                background: #1e1f20;
                color: #e3e3e3;
                border: 1px solid #444;
                border-radius: 12px;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                font-family: 'Google Sans', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                font-size: 14px;
                user-select: none;
                height: auto;
            }
            .toc-header {
                padding: 12px 16px;
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
            .toc-title { font-weight: bold; font-size: 14px; pointer-events: none; }

            .toc-btn-group { display: flex; gap: 4px; }
            .toc-btn {
                background: #3c4043;
                border: 1px solid #555;
                color: #e3e3e3;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                min-width: 30px;
            }
            .toc-btn:hover { background: #8ab4f8; color: #000; }

            #toc-search-input {
                width: 100%;
                background: #131314;
                border: 1px solid #555;
                color: #fff;
                padding: 6px 10px;
                border-radius: 16px;
                box-sizing: border-box;
                outline: none;
                font-size: 13px;
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
                max-height: 200px;
                scroll-behavior: smooth;
            }

            #toc-list::-webkit-scrollbar { width: 6px; }
            #toc-list::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }

            .toc-item {
                padding: 10px 16px;
                border-bottom: 1px solid #2d2e30;
                cursor: pointer;
                font-size: 13px;
                color: #c4c7c5;
                line-height: 1.4;
                display: flex;
                align-items: flex-start;
            }
            .toc-item:last-child { border-bottom: none; }
            .toc-item:hover { background-color: #333537; color: #fff; }
            .toc-item-hidden { display: none !important; }

            .toc-bullet {
                margin-right: 8px;
                color: #8ab4f8;
                font-weight: bold;
                flex-shrink: 0;
            }

            .toc-status { padding: 10px; text-align: center; color: #888; font-size: 12px; }
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
            if (isDragging) {
                isDragging = false;
                el.style.opacity = '1';
            }
        });
    }

    // --- 3. 滚动逻辑 ---
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
    function handleScrollTop() {
        const container = getScrollContainer();
        const options = { top: 0, behavior: 'smooth' };
        container === document.documentElement ? window.scrollTo(options) : container.scrollTo(options);
    }
    function handleScrollBottom() {
        const container = getScrollContainer();
        const options = { top: container.scrollHeight, behavior: 'smooth' };
        container === document.documentElement ? window.scrollTo(options) : container.scrollTo(options);
    }

    // --- 4. UI 逻辑 (移除刷新按钮) ---
    function createUI() {
        if (document.getElementById('gemini-toc-v6')) return;
        if (!document.body) return;

        const panel = document.createElement('div');
        panel.id = 'gemini-toc-v6';

        const header = document.createElement('div');
        header.className = 'toc-header';

        const topRow = document.createElement('div');
        topRow.className = 'toc-top-row';

        const title = document.createElement('span');
        title.className = 'toc-title';
        title.textContent = `对话目录`;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'toc-btn-group';

        // ▼▼▼ 已移除刷新按钮，只保留 Top 和 Bot ▼▼▼

        const topBtn = document.createElement('button');
        topBtn.className = 'toc-btn';
        topBtn.textContent = '⬆';
        topBtn.onclick = handleScrollTop;

        const botBtn = document.createElement('button');
        botBtn.className = 'toc-btn';
        botBtn.textContent = '⬇';
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

        if (!forceUpdate && totalCount > 0) {
            const currentTocItems = list.querySelectorAll('.toc-item');
            if (currentTocItems.length === totalCount) {
                const lastDomText = allItems[totalCount - 1].innerText.trim();
                const lastTocText = currentTocItems[totalCount - 1].title;
                if (lastDomText === lastTocText) return;
            }
        }

        const searchInput = document.getElementById('toc-search-input');
        const currentKeyword = searchInput ? searchInput.value : '';
        const wasAtBottom = (list.scrollHeight - list.scrollTop) <= (list.clientHeight + 30);
        const isFirstLoad = list.children.length === 0;

        list.textContent = '';

        if (totalCount === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'toc-status';
            emptyItem.textContent = '...';
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

            const shortText = text.length > 22 ? text.substring(0, 22) + '...' : text;

            const bulletSpan = document.createElement('span');
            bulletSpan.className = 'toc-bullet';
            bulletSpan.textContent = '•';

            const textNode = document.createTextNode(' ' + shortText);

            li.appendChild(bulletSpan);
            li.appendChild(textNode);

            li.title = text;

            li.onclick = () => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.transition = 'background 0.3s';
                el.style.backgroundColor = '#444746';
                setTimeout(() => { el.style.backgroundColor = ''; }, 1000);
            };
            list.appendChild(li);
        }

        if (currentKeyword) {
            filterList(currentKeyword);
        }

        if (wasAtBottom || isFirstLoad) {
            setTimeout(() => {
                list.scrollTop = list.scrollHeight;
            }, 0);
        }
    }

    // --- 6. 心跳监测 ---
    setInterval(() => {
        const panel = document.getElementById('gemini-toc-v6');
        if (!panel) {
            createUI();
        } else {
            scanContent(false);
        }
    }, 1000);

    console.log("Gemini 插件 v6.3 (Clean UI) Loaded");

})();