// ==UserScript==
// @name         网站标题获取器
// @license      apache-2.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  获取当前网站标题并一键复制，Material You风格，流畅拖动
// @author       wanxiaoT
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562209/%E7%BD%91%E7%AB%99%E6%A0%87%E9%A2%98%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562209/%E7%BD%91%E7%AB%99%E6%A0%87%E9%A2%98%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Material You 动态色彩系统
    const myColors = {
        // Primary
        primary: '#65558F',
        onPrimary: '#FFFFFF',
        primaryContainer: '#E9DDFF',
        onPrimaryContainer: '#201047',

        // Secondary
        secondary: '#625B71',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#E8DEF8',
        onSecondaryContainer: '#1E192B',

        // Tertiary (Changed to be more neutral/light)
        tertiary: '#49454E',
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#ECE6EE',
        onTertiaryContainer: '#1D1B20',

        // Surface
        surface: '#FEF7FF',
        surfaceDim: '#DED8E0',
        surfaceBright: '#FEF7FF',
        surfaceContainerLowest: '#FFFFFF',
        surfaceContainerLow: '#F8F1FA',
        surfaceContainer: '#F2ECF4',
        surfaceContainerHigh: '#ECE6EE',
        surfaceContainerHighest: '#E6E0E9',

        // Others
        onSurface: '#1D1B20',
        onSurfaceVariant: '#49454E',
        outline: '#7A757F',
        outlineVariant: '#CBC4CF',

        // States
        success: '#386A20',
        successContainer: '#C6F0A9'
    };

    // 添加样式
    GM_addStyle(`
        #title-grabber-container {
            position: fixed;
            z-index: 999999;
            font-family: 'Google Sans', 'Roboto', system-ui, -apple-system, sans-serif;
            will-change: transform;
        }

        #title-grabber-btn {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: ${myColors.primaryContainer};
            border: none;
            cursor: grab;
            user-select: none;
            touch-action: none;
            box-shadow: 
                0 1px 2px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.08),
                0 4px 12px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 
                box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1),
                border-radius 0.2s cubic-bezier(0.2, 0, 0, 1),
                background 0.15s ease;
            will-change: transform, box-shadow;
        }

        #title-grabber-btn:hover {
            box-shadow: 
                0 2px 4px rgba(0,0,0,0.12),
                0 4px 8px rgba(0,0,0,0.1),
                0 8px 16px rgba(0,0,0,0.08);
            background: ${myColors.secondaryContainer};
        }

        #title-grabber-btn:active:not(.dragging) {
            transform: scale(0.96);
        }

        #title-grabber-btn.dragging {
            cursor: grabbing;
            border-radius: 20px;
            box-shadow: 
                0 4px 8px rgba(0,0,0,0.15),
                0 8px 16px rgba(0,0,0,0.12),
                0 16px 32px rgba(0,0,0,0.1);
            background: ${myColors.tertiaryContainer};
            transition: none;
        }

        #title-grabber-btn svg {
            width: 24px;
            height: 24px;
            fill: ${myColors.onPrimaryContainer};
            transition: fill 0.15s ease;
        }

        #title-grabber-btn:hover svg {
            fill: ${myColors.onSecondaryContainer};
        }

        #title-grabber-btn.dragging svg {
            fill: ${myColors.onTertiaryContainer};
        }

        #title-grabber-panel {
            position: absolute;
            width: 360px;
            background: ${myColors.surfaceContainerLow};
            border-radius: 28px;
            box-shadow: 
                0 2px 6px rgba(0,0,0,0.08),
                0 8px 24px rgba(0,0,0,0.12),
                0 16px 32px rgba(0,0,0,0.08);
            padding: 24px;
            display: none;
            opacity: 0;
            transform: scale(0.92) translateY(-8px);
            transform-origin: top right;
        }

        #title-grabber-panel.show {
            display: block;
            animation: panelIn 0.25s cubic-bezier(0, 0, 0, 1) forwards;
        }

        #title-grabber-panel.panel-left {
            right: auto;
            left: 0;
            transform-origin: top left;
        }

        #title-grabber-panel.panel-right {
            right: 0;
            left: auto;
            transform-origin: top right;
        }

        #title-grabber-panel.panel-top {
            top: auto;
            bottom: 68px;
            transform-origin: bottom right;
        }

        #title-grabber-panel.panel-top.panel-left {
            transform-origin: bottom left;
        }

        #title-grabber-panel.panel-bottom {
            top: 68px;
            bottom: auto;
        }

        @keyframes panelIn {
            0% {
                opacity: 0;
                transform: scale(0.92) translateY(-8px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .tg-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }

        .tg-header-icon {
            width: 48px;
            height: 48px;
            background: ${myColors.primaryContainer};
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .tg-header-icon svg {
            width: 24px;
            height: 24px;
            fill: ${myColors.onPrimaryContainer};
        }

        .tg-header-text {
            font-size: 22px;
            font-weight: 500;
            color: ${myColors.onSurface};
            letter-spacing: -0.2px;
        }

        .tg-section {
            margin-bottom: 16px;
        }

        .tg-label {
            font-size: 14px;
            font-weight: 500;
            color: ${myColors.onSurfaceVariant};
            margin-bottom: 12px;
            padding-left: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tg-label svg {
            width: 18px;
            height: 18px;
            opacity: 0.7;
        }

        .tg-content-box {
            background: ${myColors.surfaceContainerHighest};
            border-radius: 20px;
            padding: 16px 20px;
            border: none;
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-touch-callout: text !important;
            touch-action: auto !important;
            cursor: text;
        }

        .tg-content-box * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-touch-callout: text !important;
        }

        .tg-title-text {
            font-size: 14px;
            font-weight: 400;
            color: ${myColors.onSurfaceVariant};
            line-height: 1.5;
            word-break: break-word;
            max-height: 72px;
            overflow-y: auto;
        }

        .tg-url-text {
            font-size: 13px;
            color: ${myColors.onSurfaceVariant};
            line-height: 1.4;
            word-break: break-all;
            max-height: 48px;
            overflow-y: auto;
            opacity: 0.8;
        }

        .tg-md-preview {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 12px;
            color: ${myColors.onSurfaceVariant};
            word-break: break-all;
            max-height: 64px;
            overflow-y: auto;
            opacity: 0.7;
        }

        .tg-btn-row {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .tg-btn {
            flex: 1;
            height: 48px;
            border: none;
            border-radius: 100px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.1px;
            transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
        }

        .tg-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: currentColor;
            opacity: 0;
            transition: opacity 0.15s ease;
        }

        .tg-btn:hover::before {
            opacity: 0.08;
        }

        .tg-btn:active::before {
            opacity: 0.12;
        }

        .tg-btn:active {
            transform: scale(0.98);
        }

        .tg-btn-primary {
            background: ${myColors.primaryContainer};
            color: ${myColors.onPrimaryContainer};
        }

        .tg-btn-secondary {
            background: ${myColors.secondaryContainer};
            color: ${myColors.onSecondaryContainer};
        }

        .tg-btn-tertiary {
            background: ${myColors.tertiaryContainer};
            color: ${myColors.onTertiaryContainer};
            margin-top: 12px;
            width: 100%;
        }

        .tg-btn.copied {
            background: ${myColors.successContainer} !important;
            color: ${myColors.success} !important;
        }

        .tg-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            flex-shrink: 0;
        }

        .tg-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
            border: none;
            background: ${myColors.surfaceContainerHigh};
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
        }

        .tg-close-btn:hover {
            background: ${myColors.surfaceContainerHighest};
        }

        .tg-close-btn:active {
            transform: scale(0.92);
        }

        .tg-close-btn svg {
            width: 18px;
            height: 18px;
            fill: ${myColors.onSurfaceVariant};
        }



        /* 滚动条 */
        .tg-title-text::-webkit-scrollbar,
        .tg-url-text::-webkit-scrollbar,
        .tg-md-preview::-webkit-scrollbar {
            width: 4px;
        }

        .tg-title-text::-webkit-scrollbar-track,
        .tg-url-text::-webkit-scrollbar-track,
        .tg-md-preview::-webkit-scrollbar-track {
            background: transparent;
        }

        .tg-title-text::-webkit-scrollbar-thumb,
        .tg-url-text::-webkit-scrollbar-thumb,
        .tg-md-preview::-webkit-scrollbar-thumb {
            background: ${myColors.outlineVariant};
            border-radius: 2px;
        }

        /* 拖动时全局样式 */
        body.tg-dragging {
            cursor: grabbing !important;
        }

        body.tg-dragging * {
            cursor: grabbing !important;
            user-select: none !important;
        }
    `);

    // 获取保存的位置
    const defaultPos = { x: window.innerWidth - 80, y: 20 };
    let savedPosition = GM_getValue('tg_position_v3', defaultPos);

    // 验证位置有效性
    if (savedPosition.x > window.innerWidth - 56) savedPosition.x = window.innerWidth - 80;
    if (savedPosition.y > window.innerHeight - 56) savedPosition.y = window.innerHeight - 80;
    if (savedPosition.x < 0) savedPosition.x = 20;
    if (savedPosition.y < 0) savedPosition.y = 20;

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'title-grabber-container';
    container.style.transform = `translate3d(${savedPosition.x}px, ${savedPosition.y}px, 0)`;
    container.style.left = '0';
    container.style.top = '0';

    container.innerHTML = `
        <button id="title-grabber-btn" title="获取网站标题 (可拖动)">
            <svg viewBox="0 0 24 24">
                <path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
            </svg>
        </button>
        <div id="title-grabber-panel">
            <button class="tg-close-btn" id="tg-close">
                <svg viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
            <div class="tg-header">
                <div class="tg-header-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M5 4v3h5.5v12h3V7H19V4H5z"/>
                    </svg>
                </div>
                <span class="tg-header-text">标题获取器</span>
            </div>
            
            <div class="tg-section">
                <div class="tg-label">
                    <svg viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                    </svg>
                    页面标题
                </div>
                <div class="tg-content-box">
                    <div class="tg-title-text" id="tg-title"></div>
                </div>
            </div>
            
            <div class="tg-section">
                <div class="tg-label">
                    <svg viewBox="0 0 24 24">
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                    </svg>
                    页面地址
                </div>
                <div class="tg-content-box">
                    <div class="tg-url-text" id="tg-url"></div>
                </div>
            </div>
            
            <div class="tg-section">
                <div class="tg-label">
                    <svg viewBox="0 0 24 24">
                        <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41zM6.81 15.19v-3.66l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.88v6.38h1.93zm10.3 0l2.89-3.2h-1.93v-3.18h-1.92v3.18h-1.93l2.89 3.2z"/>
                    </svg>
                    Markdown 预览
                </div>
                <div class="tg-content-box tg-md-preview" id="tg-md"></div>
            </div>
            
            <div class="tg-btn-row">
                <button class="tg-btn tg-btn-primary" id="tg-copy-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    标题
                </button>
                <button class="tg-btn tg-btn-secondary" id="tg-copy-url">
                    <svg viewBox="0 0 24 24">
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                    </svg>
                    链接
                </button>
            </div>
            <button class="tg-btn tg-btn-tertiary" id="tg-copy-md">
                <svg viewBox="0 0 24 24">
                    <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41zM6.81 15.19v-3.66l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.88v6.38h1.93zm10.3 0l2.89-3.2h-1.93v-3.18h-1.92v3.18h-1.93l2.89 3.2z"/>
                </svg>
                复制 Markdown 链接
            </button>
        </div>
    `;

    document.body.appendChild(container);

    // 元素引用
    const mainBtn = document.getElementById('title-grabber-btn');
    const panel = document.getElementById('title-grabber-panel');
    const closeBtn = document.getElementById('tg-close');
    const titleEl = document.getElementById('tg-title');
    const urlEl = document.getElementById('tg-url');
    const mdEl = document.getElementById('tg-md');
    const copyTitleBtn = document.getElementById('tg-copy-title');
    const copyUrlBtn = document.getElementById('tg-copy-url');
    const copyMdBtn = document.getElementById('tg-copy-md');

    // 拖动状态
    let isDragging = false;
    let hasMoved = false;
    let currentX = savedPosition.x;
    let currentY = savedPosition.y;
    let startX, startY, initialX, initialY;
    let rafId = null;

    // 拖动开始
    function onDragStart(e) {
        if (e.button !== 0) return; // 只响应左键

        isDragging = true;
        hasMoved = false;

        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;

        startX = clientX;
        startY = clientY;
        initialX = currentX;
        initialY = currentY;

        mainBtn.classList.add('dragging');
        document.body.classList.add('tg-dragging');

        e.preventDefault();
    }

    // 拖动中 - 使用 RAF 优化
    function onDragMove(e) {
        if (!isDragging) return;

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // 检测是否真的移动了
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            hasMoved = true;
            panel.classList.remove('show');
        }

        // 计算新位置
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;

        // 边界限制
        const maxX = window.innerWidth - 56;
        const maxY = window.innerHeight - 56;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        currentX = newX;
        currentY = newY;

        // 使用 RAF 更新位置
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
    }

    // 拖动结束
    function onDragEnd() {
        if (!isDragging) return;

        isDragging = false;
        mainBtn.classList.remove('dragging');
        document.body.classList.remove('tg-dragging');

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        // 保存位置
        if (hasMoved) {
            GM_setValue('tg_position_v3', { x: currentX, y: currentY });
        }
    }

    // 绑定拖动事件
    mainBtn.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove, { passive: true });
    document.addEventListener('mouseup', onDragEnd);

    // 触摸支持
    mainBtn.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: true });
    document.addEventListener('touchend', onDragEnd);

    // 更新面板位置
    function updatePanelPosition() {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;

        panel.classList.remove('panel-left', 'panel-right', 'panel-top', 'panel-bottom');
        panel.classList.add(currentX > halfW ? 'panel-right' : 'panel-left');
        panel.classList.add(currentY > halfH ? 'panel-top' : 'panel-bottom');
    }

    // 复制并显示按钮反馈
    function copyWithFeedback(btn, text, originalContent) {
        GM_setClipboard(text);
        btn.classList.add('copied');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalContent;
        }, 2000);
    }

    // Markdown 格式
    function getMd() {
        const title = (document.title || '无标题').replace(/[\[\]]/g, '\\$&');
        return `[${title}](${location.href})`;
    }

    // 更新内容
    function updateContent() {
        titleEl.textContent = document.title || '(无标题)';
        urlEl.textContent = location.href;
        mdEl.textContent = getMd();
    }

    // 点击按钮
    mainBtn.addEventListener('click', () => {
        if (hasMoved) {
            hasMoved = false;
            return;
        }
        updateContent();
        updatePanelPosition();
        panel.classList.toggle('show');
    });

    // 关闭
    closeBtn.addEventListener('click', () => panel.classList.remove('show'));
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) panel.classList.remove('show');
    });

    // 复制按钮 - 保存原始内容
    const titleBtnContent = copyTitleBtn.innerHTML;
    const urlBtnContent = copyUrlBtn.innerHTML;
    const mdBtnContent = copyMdBtn.innerHTML;

    copyTitleBtn.addEventListener('click', () => copyWithFeedback(copyTitleBtn, document.title, titleBtnContent));
    copyUrlBtn.addEventListener('click', () => copyWithFeedback(copyUrlBtn, location.href, urlBtnContent));
    copyMdBtn.addEventListener('click', () => copyWithFeedback(copyMdBtn, getMd(), mdBtnContent));

    // 监听标题变化
    const titleTag = document.querySelector('title');
    if (titleTag) {
        new MutationObserver(() => {
            if (panel.classList.contains('show')) updateContent();
        }).observe(titleTag, { subtree: true, characterData: true, childList: true });
    }

    // 窗口大小变化
    window.addEventListener('resize', () => {
        const maxX = window.innerWidth - 56;
        const maxY = window.innerHeight - 56;
        if (currentX > maxX) currentX = maxX;
        if (currentY > maxY) currentY = maxY;
        container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    });

})();
