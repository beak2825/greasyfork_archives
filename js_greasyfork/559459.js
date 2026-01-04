// ==UserScript==
// @name         Gemini 對話框拖曳改變寬度 V2.8 (1px Line & Custom Tooltip)
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  側邊欄寬度鎖定 (160px-360px)，綠線改為 1px 極細版，並更新中文提示文字。
// @author       Gemini User
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559459/Gemini%20%E5%B0%8D%E8%A9%B1%E6%A1%86%E6%8B%96%E6%9B%B3%E6%94%B9%E8%AE%8A%E5%AF%AC%E5%BA%A6%20V28%20%281px%20Line%20%20Custom%20Tooltip%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559459/Gemini%20%E5%B0%8D%E8%A9%B1%E6%A1%86%E6%8B%96%E6%9B%B3%E6%94%B9%E8%AE%8A%E5%AF%AC%E5%BA%A6%20V28%20%281px%20Line%20%20Custom%20Tooltip%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 設定區 ===
    const MIN_WIDTH = 160; // 最小寬度
    const MAX_WIDTH = 360; // 最大寬度 (鎖定在紅框位置)

    // === 1. CSS 設定 ===
    const css = `
        /* --- 拖曳手把 (1px 極細綠線) --- */
        #gemini-resize-handle {
            width: 8px; /* 感應區維持寬度，方便滑鼠抓取 */
            height: 100vh;
            position: fixed;
            top: 0;
            z-index: 9999999;
            cursor: col-resize;
            background: transparent;
            transition: background 0.2s;
        }

        /* 視覺上的綠線 (偽元素) */
        #gemini-resize-handle::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px; /* 設定為 1px */
            background: #90EE90; /* 淡綠色 */
            transform: translateX(-50%);
            box-shadow: 0 0 2px rgba(0,0,0,0.2); /* 微微陰影 */
        }

        /* 滑鼠移上去時稍微變明顯一點點 (2px) 讓使用者知道選中了，若希望嚴格 1px 可自行改為 1px */
        #gemini-resize-handle:hover::after,
        #gemini-resize-handle.active::after {
            background: #32CD32; /* 深綠色 */
            width: 2px;
        }

        /* --- 全螢幕隱形防護罩 --- */
        #gemini-drag-curtain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999998;
            cursor: col-resize;
            display: none;
        }
        body.resizing #gemini-drag-curtain {
            display: block;
        }
        body.resizing iframe {
            pointer-events: none !important;
        }

        /* --- 排版修正 --- */
        mat-sidenav-content, .main-content, main {
            flex: 1 1 auto !important;
            width: auto !important;
            min-width: 0 !important;
            margin-left: 0 !important;
        }

        /* 側邊欄優化 */
        mat-sidenav, div[class*="sidebar"] {
            overflow-x: hidden !important;
            white-space: nowrap !important;
        }

        /* 內容滿版 */
        .model-response-container,
        .user-query-container,
        div[class*="conversation-container"],
        div[class*="message-content"] {
            max-width: 98% !important;
            width: 98% !important;
            margin: 0 auto !important;
        }
        div[class*="input-area"], div[class*="bottom-bar"] {
            max-width: 98% !important;
            margin: 0 auto !important;
        }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // === 2. 智慧搜尋邏輯 ===
    function findSidebar() {
        let sidebar = document.querySelector('mat-sidenav');
        if (!sidebar) {
            const keywords = ["新的對話", "New chat", "Start chat", "Chat"];
            const spans = document.querySelectorAll('span');
            for (let span of spans) {
                if (keywords.includes(span.innerText.trim())) {
                    let parent = span.parentElement;
                    let count = 0;
                    while (parent && count < 10) {
                        if (parent.tagName === 'MAT-SIDENAV' || parent.classList.contains('gmat-sidenav')) {
                            sidebar = parent;
                            break;
                        }
                        const w = parent.offsetWidth;
                        if (w > 150 && w < 400 && parent.offsetHeight > 500) {
                             sidebar = parent;
                        }
                        parent = parent.parentElement;
                        count++;
                    }
                }
                if (sidebar) break;
            }
        }
        if (!sidebar) {
            sidebar = document.querySelector('div[class*="sidebar"]') || document.querySelector('nav');
        }
        return sidebar;
    }

    // === 3. 核心邏輯 ===
    function init() {
        if (document.getElementById('gemini-resize-handle')) return;

        const handle = document.createElement('div');
        handle.id = 'gemini-resize-handle';

        // === 更新提示文字 ===
        handle.title = "拖曳移動寬度，雙擊預設寬度";

        document.body.appendChild(handle);

        const curtain = document.createElement('div');
        curtain.id = 'gemini-drag-curtain';
        document.body.appendChild(curtain);

        let savedWidth = GM_getValue('gemini_sidebar_width', 280);
        if (savedWidth > MAX_WIDTH) savedWidth = MAX_WIDTH;

        updateLayout(savedWidth, handle);

        let isResizing = false;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            handle.classList.add('active');
            document.body.classList.add('resizing');
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            let newX = e.clientX;

            // 鎖定範圍
            if (newX < MIN_WIDTH) newX = MIN_WIDTH;
            if (newX > MAX_WIDTH) newX = MAX_WIDTH;

            updateLayout(newX, handle);
        });

        window.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove('active');
                document.body.classList.remove('resizing');
                GM_setValue('gemini_sidebar_width', parseInt(handle.style.left));
            }
        });

        handle.addEventListener('dblclick', () => {
            updateLayout(280, handle);
            GM_setValue('gemini_sidebar_width', 280);
        });

        const observer = new MutationObserver(() => {
            if (!isResizing) {
                const targetWidth = GM_getValue('gemini_sidebar_width', 280);
                const sidebar = findSidebar();

                if (sidebar) {
                    const currentW = sidebar.getBoundingClientRect().width;
                    if (Math.abs(currentW - targetWidth) > 5) {
                        updateLayout(targetWidth, handle);
                    }
                }
                if (Math.abs(parseInt(handle.style.left || 0) - targetWidth) > 2) {
                    handle.style.left = targetWidth + 'px';
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    function updateLayout(width, handle) {
        if (width > MAX_WIDTH) width = MAX_WIDTH;

        handle.style.left = width + 'px';
        const sidebar = findSidebar();

        if (sidebar) {
            const wStr = width + 'px';
            sidebar.style.width = wStr;
            sidebar.style.minWidth = wStr;
            sidebar.style.maxWidth = wStr;
            sidebar.style.flexBasis = wStr;
            sidebar.style.flexShrink = '0';

            const parent = sidebar.parentElement;
            if (parent) {
                const style = window.getComputedStyle(parent);
                if (style.display === 'grid') {
                    parent.style.gridTemplateColumns = `${wStr} 1fr`;
                }
            }
        }
    }

    setInterval(init, 500);

})();