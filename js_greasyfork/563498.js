// ==UserScript==
// @name         Gemini 目录插件 (v2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  生成高效的Gemini对话目录索引窗口。
// @author       ArcherEmiya
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563498/Gemini%20%E7%9B%AE%E5%BD%95%E6%8F%92%E4%BB%B6%20%28v20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Gemini Plugin v2.0: 启动...");

    const CONFIG = {
        selector: '.query-text-line',
        displayCount: 8
    };

    // --- 0. 图标数据 ---
    const ICON_DEFS = {
        search: { viewBox: "0 0 24 24", content: [{ tag: 'circle', attrs: { cx: '11', cy: '11', r: '7', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' } }, { tag: 'line', attrs: { x1: '16', y1: '16', x2: '21', y2: '21', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' } }] },
        top: { viewBox: "0 0 24 24", content: [{ tag: 'path', attrs: { d: 'M12 19V5M5 12l7-7 7 7', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' } }] },
        bottom: { viewBox: "0 0 24 24", content: [{ tag: 'path', attrs: { d: 'M12 5v14M5 12l7 7 7-7', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' } }] },
        spin: { viewBox: "0 0 24 24", content: [{ tag: 'path', attrs: { d: 'M21 12a9 9 0 1 1-6.219-8.56', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', fill: 'none' } }] },
        bullet: { viewBox: "0 0 24 24", content: [{ tag: 'circle', attrs: { cx: '12', cy: '12', r: '4', fill: 'currentColor' } }] }
    };

    function createSvgIcon(name, className = '') {
        const def = ICON_DEFS[name]; if (!def) return null;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "20"); svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", def.viewBox); svg.setAttribute("fill", "none");
        if (className) svg.setAttribute("class", className);
        def.content.forEach(el => {
            const node = document.createElementNS("http://www.w3.org/2000/svg", el.tag);
            for (const [key, value] of Object.entries(el.attrs)) node.setAttribute(key, value);
            svg.appendChild(node);
        });
        return svg;
    }

    // --- 1. 样式 (CSS) ---
    const STYLE_ID = 'gemini-toc-style';
    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const listMaxHeight = CONFIG.displayCount * 36;
        const styles = `
            #gemini-toc {
                position: fixed; top: 80px; right: 24px; width: 280px;
                background: #1e1f20; color: #e3e3e3; border-radius: 24px;
                z-index: 2147483647; overflow: hidden;
                box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
                font-family: 'Google Sans', Roboto, sans-serif;
                display: flex; flex-direction: column; height: auto; max-height: 85vh;
                border: 1px solid #444746; transition: opacity 0.3s;
            }
            .toc-header { padding: 16px 16px 8px 16px; background: #1e1f20; flex-shrink: 0; cursor: move; }
            .toc-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .toc-title { font-weight: 500; font-size: 14px; color: #e3e3e3; pointer-events: none; padding-left: 4px; }
            .toc-btn-group { display: flex; gap: 4px; }
            .toc-btn {
                background: transparent; border: none; color: #c4c7c5; cursor: pointer; padding: 0;
                width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                transition: background-color 0.2s, color 0.2s;
            }
            .toc-btn:hover { background-color: rgba(255, 255, 255, 0.08); color: #e3e3e3; }
            .toc-btn:disabled { cursor: wait; opacity: 0.7; color: #8ab4f8; }
            .toc-btn svg { display: block; width: 20px; height: 20px; }
            .toc-spin-svg { animation: spin 1s linear infinite; transform-origin: center; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            .toc-search-wrapper { position: relative; margin-bottom: 4px; }
            #toc-search-input {
                width: 100%; background: #2b2c2e; border: 1px solid transparent; color: #e3e3e3;
                padding: 10px 16px 10px 40px; border-radius: 24px; box-sizing: border-box; outline: none;
                font-size: 13px; font-family: 'Google Sans', sans-serif; transition: background 0.2s, border-color 0.2s;
            }
            #toc-search-input:focus { background: #1e1f20; border-color: #a8c7fa; }
            .toc-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #c4c7c5; pointer-events: none; display: flex; }
            .toc-search-icon svg { width: 20px; height: 20px; }

            #toc-list {
                list-style: none; padding: 0; margin: 0; flex-grow: 1;
                overflow-y: auto; cursor: default; max-height: ${listMaxHeight}px; padding-bottom: 8px;
            }
            #toc-list::-webkit-scrollbar { width: 8px; }
            #toc-list::-webkit-scrollbar-track { background: transparent; }
            #toc-list::-webkit-scrollbar-thumb { background-color: #444746; border-radius: 4px; border: 2px solid #1e1f20; }
            #toc-list::-webkit-scrollbar-thumb:hover { background-color: #5e5e5e; }

            .toc-item {
                padding: 8px 16px; margin: 0 4px; border-radius: 16px; cursor: pointer;
                font-size: 13px; color: #c4c7c5; line-height: 20px; display: flex; align-items: center;
                transition: background-color 0.1s; overflow: hidden;
            }
            .toc-item:hover { background-color: rgba(232, 234, 237, 0.08); color: #e3e3e3; }
            .toc-bullet { margin-right: 12px; color: #a8c7fa; flex-shrink: 0; display: flex; align-items: center; height: 20px; }
            .toc-bullet svg { width: 8px; height: 8px; }
            .toc-text { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .toc-item-hidden { display: none !important; }
            .toc-status { padding: 20px; text-align: center; color: #8e918f; font-size: 12px; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.id = STYLE_ID;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // --- 2. 交互逻辑 (拖拽 & 滚动) ---
    function makeDraggable(el) {
        const header = el.querySelector('.toc-header');
        let isDragging = false, startX, startY, initialLeft, initialTop;
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('input')) return;
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = el.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return; e.preventDefault();
            el.style.left = `${initialLeft + (e.clientX - startX)}px`;
            el.style.top = `${initialTop + (e.clientY - startY)}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    function getScrollContainer() {
        const anchor = document.querySelector(CONFIG.selector);
        if (!anchor) return document.documentElement;
        let el = anchor.parentElement;
        while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && (el.scrollHeight > el.clientHeight)) return el;
            el = el.parentElement;
        }
        return document.documentElement;
    }

    function handleTurboTop() {
        const btn = document.getElementById('toc-btn-top');
        if (btn) { btn.textContent = ''; btn.appendChild(createSvgIcon('spin', 'toc-spin-svg')); btn.disabled = true; }
        const container = getScrollContainer();
        let stableCount = 0, lastHeight = container.scrollHeight;
        const timer = setInterval(() => {
            window.scrollTo(0, 0); document.body.scrollTo(0, 0); document.documentElement.scrollTo(0, 0);
            if (container && container !== document.documentElement) container.scrollTop = 0;
            const currentHeight = container.scrollHeight;
            if (currentHeight > lastHeight) { lastHeight = currentHeight; stableCount = 0; } else { stableCount++; }
            if (stableCount > 10) {
                clearInterval(timer);
                if (btn) { btn.textContent = ''; btn.appendChild(createSvgIcon('top')); btn.disabled = false; }
                if (container && container !== document.documentElement) container.scrollTop = 0;
                scanContent(true);
            }
        }, 100);
    }

    function handleScrollBottom() {
        const container = getScrollContainer();
        const targetEl = container === document.documentElement ? window : container;
        const targetTop = container === document.documentElement ? document.body.scrollHeight : container.scrollHeight;
        targetEl.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    // --- 3. UI 创建 ---
    function createUI() {
        if (document.getElementById('gemini-toc')) return;
        if (!document.body) return;
        injectStyles();

        const panel = document.createElement('div'); panel.id = 'gemini-toc';
        const header = document.createElement('div'); header.className = 'toc-header';

        const topRow = document.createElement('div'); topRow.className = 'toc-top-row';
        const title = document.createElement('span'); title.className = 'toc-title'; title.textContent = '对话索引';
        const btnGroup = document.createElement('div'); btnGroup.className = 'toc-btn-group';

        const topBtn = document.createElement('button'); topBtn.id = 'toc-btn-top'; topBtn.className = 'toc-btn';
        topBtn.appendChild(createSvgIcon('top')); topBtn.onclick = handleTurboTop; topBtn.title = "回溯顶部";

        const botBtn = document.createElement('button'); botBtn.className = 'toc-btn';
        botBtn.appendChild(createSvgIcon('bottom')); botBtn.onclick = handleScrollBottom; botBtn.title = "直达底部";

        btnGroup.appendChild(topBtn); btnGroup.appendChild(botBtn);
        topRow.appendChild(title); topRow.appendChild(btnGroup);

        const searchWrapper = document.createElement('div'); searchWrapper.className = 'toc-search-wrapper';
        const searchIcon = document.createElement('span'); searchIcon.className = 'toc-search-icon';
        searchIcon.appendChild(createSvgIcon('search'));
        const searchInput = document.createElement('input'); searchInput.id = 'toc-search-input'; searchInput.type = 'text'; searchInput.placeholder = '搜索...';
        searchInput.addEventListener('input', (e) => filterList(e.target.value));
        searchWrapper.appendChild(searchIcon); searchWrapper.appendChild(searchInput);

        header.appendChild(topRow); header.appendChild(searchWrapper);
        const ul = document.createElement('ul'); ul.id = 'toc-list';
        panel.appendChild(header); panel.appendChild(ul);
        document.body.appendChild(panel);

        makeDraggable(panel);
        scanContent(true);
    }

    function filterList(keyword) {
        const list = document.getElementById('toc-list');
        if (!list) return;
        const lowerKeyword = keyword.toLowerCase();
        list.querySelectorAll('.toc-item').forEach(item => {
            const text = item.getAttribute('data-fulltext') || '';
            item.classList.toggle('toc-item-hidden', !text.includes(lowerKeyword));
        });
    }

    // --- 4. 扫描逻辑 (★增量更新算法★) ---
    function scanContent(forceUpdate = false) {
        const list = document.getElementById('toc-list');
        if (!list) return;
        const allItems = document.querySelectorAll(CONFIG.selector);
        const totalCount = allItems.length;

        // 获取当前搜索词
        const currentKeyword = document.getElementById('toc-search-input')?.value || '';

        // 如果没有内容，显示空状态
        if (totalCount === 0) {
            list.innerHTML = ''; // 这里可以暴力清空，因为是空状态
            const emptyItem = document.createElement('li'); emptyItem.className = 'toc-status'; emptyItem.textContent = 'waiting...';
            list.appendChild(emptyItem);
            return;
        } else {
            // 如果之前是 emptyItem，先清空
            if (list.firstChild && list.firstChild.classList.contains('toc-status')) {
                list.innerHTML = '';
            }
        }

        // --- 核心 Diff 逻辑 ---
        // 遍历 DOM 中的所有消息条目
        for (let i = 0; i < totalCount; i++) {
            const el = allItems[i];
            const text = el.innerText.trim();
            if (!text) continue;

            // 检查当前索引对应的目录项是否存在
            let li = list.children[i];

            // 1. 如果该位置没有目录项 (说明有新消息)，则创建
            if (!li) {
                li = document.createElement('li');
                li.className = 'toc-item';

                const bulletSpan = document.createElement('span');
                bulletSpan.className = 'toc-bullet';
                bulletSpan.appendChild(createSvgIcon('bullet'));

                const textSpan = document.createElement('span');
                textSpan.className = 'toc-text';

                li.appendChild(bulletSpan);
                li.appendChild(textSpan);
                list.appendChild(li); // 追加到末尾
            }

            // 2. 更新内容 (仅在内容变化时操作 DOM，避免重排)
            // 使用 data 属性存储旧文本进行对比
            const oldText = li.getAttribute('data-fulltext');
            const newTextLower = text.toLowerCase();

            if (oldText !== newTextLower) {
                li.setAttribute('data-fulltext', newTextLower);
                li.title = text;
                // 更新文字内容
                const textSpan = li.querySelector('.toc-text');
                if (textSpan) textSpan.textContent = text;

                // 重新绑定点击事件 (因为 el 引用可能变了)
                li.onclick = () => {
                    if (el && el.isConnected) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    else handleScrollBottom();

                    const originalBg = el.style.backgroundColor;
                    el.style.backgroundColor = '#444a50';
                    setTimeout(() => { el.style.backgroundColor = originalBg || ''; }, 500);
                };
            }
        }

        // 3. 删除多余的目录项 (如果切换到了一个更短的对话)
        while (list.children.length > totalCount) {
            list.removeChild(list.lastChild);
        }

        // 4. 重新应用搜索过滤 (因为可能新增了条目)
        if (currentKeyword) {
            filterList(currentKeyword);
        }

        // 5. 自动沉底逻辑
        const wasAtBottom = (list.scrollHeight - list.scrollTop) <= (list.clientHeight + 50);
        const isTurboRunning = document.getElementById('toc-btn-top')?.disabled;
        // 如果不在回溯顶部，且之前在底部(或初次加载)，则保持沉底
        if (!isTurboRunning && wasAtBottom) {
             // 使用 requestAnimationFrame 确保在渲染后执行
             requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
        }
    }

    // 心跳
    setInterval(() => {
        const panel = document.getElementById('gemini-toc');
        if (!panel) createUI(); else scanContent(false);
    }, 1000);
})();