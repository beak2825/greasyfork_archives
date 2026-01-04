// ==UserScript==
// @name         Edge 超级拖拽（松开触发+后台打开）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅在松开鼠标后触发，新标签页在后台打开。完全模拟原版逻辑。
// @author       You
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558239/Edge%20%E8%B6%85%E7%BA%A7%E6%8B%96%E6%8B%BD%EF%BC%88%E6%9D%BE%E5%BC%80%E8%A7%A6%E5%8F%91%2B%E5%90%8E%E5%8F%B0%E6%89%93%E5%BC%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558239/Edge%20%E8%B6%85%E7%BA%A7%E6%8B%96%E6%8B%BD%EF%BC%88%E6%9D%BE%E5%BC%80%E8%A7%A6%E5%8F%91%2B%E5%90%8E%E5%8F%B0%E6%89%93%E5%BC%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============== 配置区域 ===============
    const SEARCH_ENGINE = 'https://www.bing.com/search?q={query}';
    const DRAG_THRESHOLD = 20; // 有效拖拽的物理阈值
    const FEEDBACK_THRESHOLD = 5; // 视觉反馈阈值
    // =============== 配置结束 ===============

    let state = {
        startX: 0,
        startY: 0,
        hasExceededThreshold: false, // 【新增】核心标志：是否已构成有效拖拽
        isFeedbackVisible: false,
        draggedContent: null, // 'link', 'text', or null
        draggedUrl: '',
        draggedText: ''
    };

    // --- 视觉反馈图标（保持简约风格）---
    const dragFeedback = document.createElement('div');
    dragFeedback.id = 'super-drag-feedback';
    GM_addStyle(`
        #super-drag-feedback {
            position: fixed !important;
            z-index: 999999 !important;
            pointer-events: none !important;
            opacity: 0;
            transition: opacity 0.1s ease;
            font-family: 'Segoe UI', 'Segoe MDL2 Assets', system-ui, sans-serif !important;
            font-size: 17px !important;
            color: rgba(0, 90, 158, 0.85) !important;
            transform: translate(8px, 8px) !important;
            background: none !important;
        }
        #super-drag-feedback.show {
            opacity: 0.85 !important;
        }
        #super-drag-feedback.link::before {
            content: '\\E167' !important; /* 链接图标 */
        }
        #super-drag-feedback.text::before {
            content: '\\E721' !important; /* 搜索图标 */
        }
    `);
    document.body.appendChild(dragFeedback);

    // --- 清理函数 ---
    function cleanup() {
        if (state.isFeedbackVisible) {
            dragFeedback.classList.remove('show');
            state.isFeedbackVisible = false;
        }
        state.startX = 0;
        state.startY = 0;
        state.hasExceededThreshold = false;
        state.draggedContent = null;
        state.draggedUrl = '';
        state.draggedText = '';
    }

    // --- 函数：执行最终拖拽动作 ---
    function performDragAction() {
        // 确保有内容且已构成有效拖拽
        if (!state.hasExceededThreshold || !state.draggedContent) return;

        if (state.draggedContent === 'link' && state.draggedUrl) {
            // 【关键】active: false 表示在后台打开
            GM_openInTab(state.draggedUrl, { active: false, insert: true });
        } else if (state.draggedContent === 'text' && state.draggedText) {
            let searchUrl = SEARCH_ENGINE.replace('{query}', encodeURIComponent(state.draggedText));
            GM_openInTab(searchUrl, { active: false, insert: true });
        }
        // 注意：此处不调用 cleanup，由 mouseup 事件统一清理
    }

    // --- 事件监听：按下 ---
    document.addEventListener('mousedown', function(event) {
        if (event.button !== 0) return;
        cleanup(); // 开始新的拖拽周期，先清理旧状态

        state.startX = event.clientX;
        state.startY = event.clientY;

        let linkElement = event.target.closest('a');
        if (linkElement && linkElement.href) {
            state.draggedContent = 'link';
            state.draggedUrl = linkElement.href;
            event.preventDefault();
        } else {
            let selection = window.getSelection();
            let selectedText = selection.toString().trim();
            if (selectedText.length > 0) {
                state.draggedContent = 'text';
                state.draggedText = selectedText;
            }
        }
    }, true);

    // --- 事件监听：移动 ---
    document.addEventListener('mousemove', function(event) {
        if (!state.draggedContent) return;

        let deltaX = event.clientX - state.startX;
        let deltaY = event.clientY - state.startY;
        let dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // 1. 管理视觉反馈
        if (!state.isFeedbackVisible && dragDistance > FEEDBACK_THRESHOLD) {
            dragFeedback.className = state.draggedContent;
            dragFeedback.style.left = event.clientX + 'px';
            dragFeedback.style.top = event.clientY + 'px';
            dragFeedback.classList.add('show');
            state.isFeedbackVisible = true;
        }
        // 2. 更新图标位置
        if (state.isFeedbackVisible) {
            dragFeedback.style.left = event.clientX + 'px';
            dragFeedback.style.top = event.clientY + 'px';
        }
        // 3. 【关键】仅标记状态，不执行动作
        if (dragDistance > DRAG_THRESHOLD) {
            state.hasExceededThreshold = true;
        }
    });

    // --- 事件监听：松开 ---
    document.addEventListener('mouseup', function(event) {
        // 【核心逻辑】松开时判断并执行
        if (state.hasExceededThreshold && state.draggedContent) {
            performDragAction();
        }
        // 无论是否执行了动作，都清理状态
        cleanup();
    });

    // --- 安全兜底 ---
    document.addEventListener('mouseleave', cleanup);
})();