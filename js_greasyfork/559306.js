// ==UserScript==
// @name         Coursera Web Fullscreen
// @name:zh-CN   Coursera 网页全屏
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Adds custom styled tooltips (white bg, black text), 'G' shortcut, and fixes layout.
// @description:zh-CN 新增白底黑字的高级悬浮提示框，支持 G 键全屏，修复按钮布局与防抖性能。
// @author       Gemini 3 Pro
// @match        https://www.coursera.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559306/Coursera%20Web%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/559306/Coursera%20Web%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = '[CWS v5.3]';
    console.log(`${SCRIPT_PREFIX} Loaded.`);

    // --- 1. 样式修正 (CSS) ---
    GM_addStyle(`
        /* 网页全屏容器 */
        [data-testid="playerContainer"].web-fullscreen-mode {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            z-index: 99999 !important; background-color: #000 !important;
        }

        /* 隐藏干扰元素 */
        body.coursera-web-fullscreen-active { overflow: hidden !important; }
        body.coursera-web-fullscreen-active header,
        body.coursera-web-fullscreen-active [data-testid="page-header-wrapper"],
        body.coursera-web-fullscreen-active [data-testid="tabs-root"],
        body.coursera-web-fullscreen-active .rc-VideoItemScreen > div:not([data-testid="playerContainer"]) {
            display: none !important;
        }

        /* 按钮通用样式 */
        .web-fullscreen-btn {
            position: relative; /* 关键：为 Tooltip 定位做参照 */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 32px;
            width: auto;
            min-width: 32px;
            padding: 0 8px;
            cursor: pointer;
            flex-shrink: 0;
            background: transparent; border: none;
            color: #FFFFFF !important;
            transition: background-color 0.2s ease;
            box-sizing: border-box;
        }

        /* 图标尺寸 */
        .web-fullscreen-btn svg {
            width: 24px !important;
            height: 24px !important;
            fill: #FFFFFF !important;
            stroke: none !important;
        }

        .web-fullscreen-btn:hover {
            background-color: rgba(255, 255, 255, 0.2) !important;
        }

        /* --- 自定义 Tooltip 样式 (白底黑字) --- */

        /* 1. 气泡本体 */
        .web-fullscreen-btn:hover::after {
            content: attr(data-tooltip); /* 从属性读取文字 */
            position: absolute;
            bottom: 100%; /* 在按钮上方 */
            left: 50%;
            transform: translateX(-50%) translateY(-12px); /* 居中并向上偏移 */

            background-color: #FFFFFF; /* 白底 */
            color: #1F1F1F; /* 黑字 (深灰更柔和) */
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 柔和阴影 */
            z-index: 100000;
            pointer-events: none; /* 防止遮挡点击 */
            opacity: 0;
            animation: fadeIn 0.2s forwards;
        }

        /* 2. 底部小三角 */
        .web-fullscreen-btn:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-6px);

            border-width: 6px;
            border-style: solid;
            border-color: #FFFFFF transparent transparent transparent; /* 白色三角朝下 */
            z-index: 100000;
            opacity: 0;
            animation: fadeIn 0.2s forwards;
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        /* 修复控制栏布局 */
        .cws-controls-fix {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            gap: 0px !important;
        }

        /* 移除聚焦框 */
        [data-testid="video-control-bar"] button:focus,
        [data-testid="video-control-bar"] *:focus-visible {
            outline: none !important;
            box-shadow: none !important;
        }
    `);

    // --- 2. 图标资源 ---
    const Icons = {
        enter: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M716.5 853.4H316.1c-77.6 0-140.7-63.1-140.7-140.7V312.3c0-77.6 63.1-140.7 140.7-140.7h400.4c77.6 0 140.7 63.1 140.7 140.7v400.4c0.1 77.6-63.1 140.7-140.7 140.7zM316.1 267.7c-24.6 0-44.6 20-44.6 44.6v400.4c0 24.6 20 44.6 44.6 44.6h400.4c24.6 0 44.6-20 44.6-44.6V312.3c0-24.6-20-44.6-44.6-44.6H316.1z" fill="currentColor"></path><path d="M192.1 895.3h232.1c32.5 0 58.8-26.3 58.8-58.8 0-32.4-26.3-58.8-58.8-58.8H334L463.7 648c22.9-22.9 22.9-60.2 0-83.1-22.9-22.9-60.2-22.9-83.1 0L250.9 694.7v-90.2c0-16.2-6.6-30.9-17.2-41.5-10.6-10.6-25.3-17.2-41.5-17.2-32.5 0-58.8 26.3-58.8 58.8v232.1c-0.1 32.3 26.3 58.6 58.7 58.6zM835.9 131.1H603.8c-32.5 0-58.8 26.3-58.8 58.8 0 32.4 26.3 58.8 58.8 58.8H694L564.3 378.3c-22.9 22.9-22.9 60.2 0 83.1 22.9 22.9 60.2 22.9 83.1 0l129.7-129.7v90.2c0 16.2 6.6 30.9 17.2 41.5 10.6 10.6 25.3 17.2 41.5 17.2 32.5 0 58.8-26.3 58.8-58.8V189.9c0.1-32.5-26.3-58.8-58.7-58.8z" fill="currentColor"></path></svg>`,
        exit: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M716.5 853.4H316.1c-77.6 0-140.7-63.1-140.7-140.7V312.3c0-77.6 63.1-140.7 140.7-140.7h400.4c77.6 0 140.7 63.1 140.7 140.7v400.4c0.1 77.6-63.1 140.7-140.7 140.7zM316.1 267.7c-24.6 0-44.6 20-44.6 44.6v400.4c0 24.6 20 44.6 44.6 44.6h400.4c24.6 0 44.6-20 44.6-44.6V312.3c0-24.6-20-44.6-44.6-44.6H316.1z" fill="currentColor"></path><path d="M422.1 547.7h-232c-32.5 0-58.8 26.3-58.8 58.8 0 32.4 26.3 58.8 58.8 58.8h90.2L150.6 795c-22.9 22.9-22.9 60.2 0 83.1 22.9 22.9 60.2 22.9 83.1 0l129.7-129.7v90.2c0 16.2 6.6 30.9 17.2 41.5s25.3 17.2 41.5 17.2c32.5 0 58.8-26.3 58.8-58.8v-232c0-32.5-26.3-58.8-58.8-58.8zM605.9 478.7H838c32.5 0 58.8-26.3 58.8-58.8 0-32.4-26.3-58.8-58.8-58.8h-90.2l129.7-129.7c22.9-22.9 22.9-60.2 0-83.1-22.9-22.9-60.2-22.9-83.1 0L664.6 278v-90.2c0-16.2-6.6-30.9-17.2-41.5-10.6-10.6-25.3-17.2-41.5-17.2-32.5 0-58.8 26.3-58.8 58.8V420c0 32.4 26.3 58.7 58.8 58.7z" fill="currentColor"></path></svg>`
    };

    // --- 3. 逻辑控制 ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const DOM = {
        getPlayer: () => document.querySelector('[data-testid="playerContainer"]'),
        getControlBar: () => document.querySelector('[data-testid="video-control-bar"]'),
        getNativeFullscreenBtn: () => document.querySelector('[data-testid="fullscreenToggle"]'),
        getMyBtn: () => document.getElementById('cws-web-fullscreen-btn')
    };

    function toggleWebFullscreen() {
        const player = DOM.getPlayer();
        const btn = DOM.getMyBtn();
        if (!player || !btn) return;

        const isFullscreen = player.classList.contains('web-fullscreen-mode');

        if (isFullscreen) {
            player.classList.remove('web-fullscreen-mode');
            document.body.classList.remove('coursera-web-fullscreen-active');
            btn.innerHTML = Icons.enter;
            // 更新 CSS Tooltip (使用 data-tooltip 属性)
            btn.setAttribute('data-tooltip', "网页全屏 (快捷键: g)");
        } else {
            if (document.fullscreenElement) document.exitFullscreen();
            player.classList.add('web-fullscreen-mode');
            document.body.classList.add('coursera-web-fullscreen-active');
            btn.innerHTML = Icons.exit;
            // 更新 CSS Tooltip
            btn.setAttribute('data-tooltip', "退出网页全屏 (快捷键: g)");
        }
        btn.blur();
    }

    function injectButton() {
        if (DOM.getMyBtn()) return;

        const controlBar = DOM.getControlBar();
        const nativeBtn = DOM.getNativeFullscreenBtn();

        if (controlBar && nativeBtn) {
            let insertionTarget = nativeBtn;
            let container = nativeBtn.parentElement;

            while (container && container !== controlBar && container.children.length < 2) {
                insertionTarget = container;
                container = container.parentElement;
            }

            if (container) {
                container.classList.add('cws-controls-fix');

                const btn = document.createElement('button');
                btn.id = 'cws-web-fullscreen-btn';
                btn.className = 'web-fullscreen-btn';
                btn.type = 'button';
                // 移除原生 title，改用自定义属性 data-tooltip 防止冲突
                btn.setAttribute('data-tooltip', '网页全屏 (快捷键: g)');
                btn.innerHTML = Icons.enter;
                btn.onclick = (e) => { e.stopPropagation(); toggleWebFullscreen(); };

                container.insertBefore(btn, insertionTarget);
            }
        }
    }

    const observer = new MutationObserver(debounce(() => {
        if (!DOM.getMyBtn()) injectButton();
    }, 300));

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

        if (e.key === 'Escape') {
            const player = DOM.getPlayer();
            if (player && player.classList.contains('web-fullscreen-mode')) toggleWebFullscreen();
        }

        if (e.key.toLowerCase() === 'p') {
            const playBtn = document.querySelector('[data-testid="playToggle"]');
            if (playBtn) { e.preventDefault(); e.stopPropagation(); playBtn.click(); }
        }

        if (e.key.toLowerCase() === 'g') {
             e.preventDefault();
             e.stopPropagation();
             toggleWebFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            const player = DOM.getPlayer();
            if (player && player.classList.contains('web-fullscreen-mode')) toggleWebFullscreen();
        }
    });

})();