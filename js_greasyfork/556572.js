// ==UserScript==
// @name         通用夜间模式切换器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在任何网页上切换夜间模式，使用filter方案，不破坏原有样式
// @author       Llldmiao
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556572/%E9%80%9A%E7%94%A8%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556572/%E9%80%9A%E7%94%A8%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '1.0.1';

    // 配置项
    const CONFIG = {
        storageKey: 'darkModeEnabled',
        positionKey: 'darkModeButtonPosition',
        attributeName: 'data-dark-mode',
        filterValue: 'brightness(0.5)', // 降低亮度实现夜间模式
        transitionDuration: '0.3s',
        buttonSize: '48px',
        defaultPosition: { bottom: 20, right: 20 },
        buttonZIndex: 99999,
        dragThreshold: 5 // 拖动阈值（像素）
    };

    // 全局状态管理
    let stylesInjected = false;
    let eventListeners = {
        mousemove: null,
        mouseup: null,
        touchmove: null,
        touchend: null
    };
    let mutationObserver = null;

    // 添加样式（防止重复注入）
    function addStyles() {
        if (stylesInjected) return;
        stylesInjected = true;

        const css = `
            /* 基础夜间模式样式 - 直接在html上应用brightness降低亮度 */
            html[${CONFIG.attributeName}="true"] {
                filter: ${CONFIG.filterValue} !important;
                transition: filter ${CONFIG.transitionDuration} ease !important;
            }

            /* 滚动条样式优化 - WebKit内核浏览器 (Chrome, Safari, Edge) */
            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar {
                width: 12px !important;
                height: 12px !important;
            }

            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar-track,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar-track {
                background: #1a1a1a !important;
            }

            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar-thumb,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar-thumb {
                background: #4a4a4a !important;
                border-radius: 6px !important;
                border: 2px solid #1a1a1a !important;
            }

            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar-thumb:hover,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar-thumb:hover {
                background: #5a5a5a !important;
            }

            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar-thumb:active,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar-thumb:active {
                background: #6a6a6a !important;
            }

            html[${CONFIG.attributeName}="true"]::-webkit-scrollbar-corner,
            html[${CONFIG.attributeName}="true"] body::-webkit-scrollbar-corner {
                background: #1a1a1a !important;
            }

            /* 滚动条样式优化 - Firefox */
            html[${CONFIG.attributeName}="true"],
            html[${CONFIG.attributeName}="true"] body {
                scrollbar-width: thin !important;
                scrollbar-color: #4a4a4a #1a1a1a !important;
            }

            /* 切换按钮样式 */
            .dark-mode-toggle-btn {
                position: fixed !important;
                width: ${CONFIG.buttonSize} !important;
                height: ${CONFIG.buttonSize} !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95)) !important;
                backdrop-filter: blur(10px) !important;
                border: 2px solid rgba(255, 255, 255, 0.3) !important;
                cursor: move !important;
                z-index: ${CONFIG.buttonZIndex} !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 24px !important;
                color: #fff !important;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4), 0 0 0 0 rgba(102, 126, 234, 0.4) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                touch-action: none !important;
            }

            .dark-mode-toggle-btn:hover {
                background: linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1)) !important;
                transform: scale(1.1) !important;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6), 0 0 0 8px rgba(102, 126, 234, 0.1) !important;
            }

            .dark-mode-toggle-btn:active {
                transform: scale(0.95) !important;
                cursor: grabbing !important;
            }

            .dark-mode-toggle-btn.dragging {
                transition: none !important;
                cursor: grabbing !important;
                opacity: 0.9 !important;
            }

            /* 夜间模式拖动时保持更高亮度 */
            html[${CONFIG.attributeName}="true"] .dark-mode-toggle-btn.dragging {
                opacity: 1 !important;
            }

            /* 夜间模式下的按钮样式 - 按钮图标需要保持正常亮度，背景色和日间模式一样 */
            html[${CONFIG.attributeName}="true"] .dark-mode-toggle-btn {
                background: linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1)) !important;
                border-color: rgba(255, 255, 255, 0.6) !important;
                box-shadow: 0 6px 30px rgba(102, 126, 234, 0.8), 0 0 0 0 rgba(102, 126, 234, 0.5) !important;
            }

            html[${CONFIG.attributeName}="true"] .dark-mode-toggle-btn:hover {
                background: linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1)) !important;
                box-shadow: 0 10px 40px rgba(102, 126, 234, 1), 0 0 0 12px rgba(102, 126, 234, 0.2) !important;
                transform: scale(1.15) !important;
            }
        `;

        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // 获取存储的状态
    function getStoredState() {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue(CONFIG.storageKey, false);
        }
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            return stored === 'true';
        } catch (e) {
            return false;
        }
    }

    // 保存状态
    function saveState(enabled) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(CONFIG.storageKey, enabled);
        } else {
            try {
                localStorage.setItem(CONFIG.storageKey, enabled.toString());
            } catch (e) {
                console.warn('无法保存夜间模式状态:', e);
            }
        }
    }

    // 获取按钮位置
    function getButtonPosition() {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue(CONFIG.positionKey, CONFIG.defaultPosition);
        }
        try {
            const stored = localStorage.getItem(CONFIG.positionKey);
            return stored ? JSON.parse(stored) : CONFIG.defaultPosition;
        } catch (e) {
            return CONFIG.defaultPosition;
        }
    }

    // 保存按钮位置
    function saveButtonPosition(position) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(CONFIG.positionKey, position);
        } else {
            try {
                localStorage.setItem(CONFIG.positionKey, JSON.stringify(position));
            } catch (e) {
                console.warn('无法保存按钮位置:', e);
            }
        }
    }

    // 切换夜间模式
    function toggleDarkMode() {
        const html = document.documentElement;
        const currentState = html.getAttribute(CONFIG.attributeName) === 'true';
        const newState = !currentState;

        html.setAttribute(CONFIG.attributeName, newState.toString());
        saveState(newState);

        // 更新按钮图标
        updateButtonIcon(newState);

        return newState;
    }

    // 应用夜间模式状态
    function applyDarkModeState(enabled) {
        const html = document.documentElement;
        html.setAttribute(CONFIG.attributeName, enabled.toString());
        updateButtonIcon(enabled);
    }

    // 移除事件监听器
    function removeEventListeners() {
        if (eventListeners.mousemove) {
            document.removeEventListener('mousemove', eventListeners.mousemove);
            eventListeners.mousemove = null;
        }
        if (eventListeners.mouseup) {
            document.removeEventListener('mouseup', eventListeners.mouseup);
            eventListeners.mouseup = null;
        }
        if (eventListeners.touchmove) {
            document.removeEventListener('touchmove', eventListeners.touchmove);
            eventListeners.touchmove = null;
        }
        if (eventListeners.touchend) {
            document.removeEventListener('touchend', eventListeners.touchend);
            eventListeners.touchend = null;
        }
    }

    // 创建切换按钮
    function createToggleButton() {
        // 先移除旧的事件监听器，防止泄漏
        removeEventListeners();

        const button = document.createElement('div');
        button.className = 'dark-mode-toggle-btn';
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', '切换夜间模式');
        button.setAttribute('title', '点击切换，拖动调整位置');
        
        // 初始图标
        const isDarkMode = getStoredState();
        button.textContent = isDarkMode ? '☀️' : '🌙';
        
        // 设置初始位置
        const position = getButtonPosition();
        applyButtonPosition(button, position);
        
        // 拖动相关变量
        let isDragging = false;
        let startX, startY;
        let startLeft, startTop;
        let hasMoved = false;

        // 通用拖动处理函数
        function handleDragMove(clientX, clientY) {
            if (!isDragging) return;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            // 判断是否真的在拖动（移动超过阈值）
            if (Math.abs(deltaX) > CONFIG.dragThreshold || Math.abs(deltaY) > CONFIG.dragThreshold) {
                hasMoved = true;
            }
            
            // 计算新位置
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // 边界检测
            const buttonSize = parseInt(CONFIG.buttonSize);
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - buttonSize));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - buttonSize));
            
            button.style.left = newLeft + 'px';
            button.style.top = newTop + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        }

        // 通用拖动结束处理函数
        function handleDragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            button.classList.remove('dragging');
            
            // 如果移动了，保存位置；否则触发点击
            if (hasMoved) {
                const rect = button.getBoundingClientRect();
                const newPosition = {
                    left: rect.left,
                    top: rect.top,
                    right: window.innerWidth - rect.right,
                    bottom: window.innerHeight - rect.bottom
                };
                saveButtonPosition(newPosition);
            } else {
                // 没有拖动，触发点击切换
                toggleDarkMode();
            }
        }
        
        // 鼠标按下
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            hasMoved = false;
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = button.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            button.classList.add('dragging');
        });
        
        // 鼠标移动（保存引用）
        eventListeners.mousemove = (e) => handleDragMove(e.clientX, e.clientY);
        document.addEventListener('mousemove', eventListeners.mousemove);
        
        // 鼠标释放（保存引用）
        eventListeners.mouseup = handleDragEnd;
        document.addEventListener('mouseup', eventListeners.mouseup);
        
        // 触摸开始
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            hasMoved = false;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = button.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            button.classList.add('dragging');
        });
        
        // 触摸移动（保存引用）
        eventListeners.touchmove = (e) => {
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
        };
        document.addEventListener('touchmove', eventListeners.touchmove, { passive: false });
        
        // 触摸结束（保存引用）
        eventListeners.touchend = handleDragEnd;
        document.addEventListener('touchend', eventListeners.touchend);

        // 添加到页面（使用 fallback）
        const container = document.body || document.documentElement;
        container.appendChild(button);
        return button;
    }
    
    // 应用按钮位置
    function applyButtonPosition(button, position) {
        // 优先使用 bottom/right，如果没有则使用 top/left
        if (position.bottom !== undefined && position.right !== undefined) {
            button.style.bottom = position.bottom + 'px';
            button.style.right = position.right + 'px';
            button.style.top = 'auto';
            button.style.left = 'auto';
        } else if (position.top !== undefined && position.left !== undefined) {
            button.style.top = position.top + 'px';
            button.style.left = position.left + 'px';
            button.style.bottom = 'auto';
            button.style.right = 'auto';
        } else {
            button.style.bottom = CONFIG.defaultPosition.bottom + 'px';
            button.style.right = CONFIG.defaultPosition.right + 'px';
        }
    }

    // 更新按钮图标
    function updateButtonIcon(isDarkMode) {
        const button = document.querySelector('.dark-mode-toggle-btn');
        if (button) {
            button.textContent = isDarkMode ? '☀️' : '🌙';
        }
    }

    // 快捷键支持
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D 或 Cmd+Shift+D (Mac)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                e.stopPropagation();
                toggleDarkMode();
            }
        }, true);
    }

    // 节流函数
    function throttle(func, delay) {
        let timer = null;
        return function(...args) {
            if (timer) return;
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay);
        };
    }

    // 清理资源
    function destroy() {
        try {
            // 移除按钮
            const button = document.querySelector('.dark-mode-toggle-btn');
            if (button) {
                button.remove();
            }
            
            // 移除事件监听器
            removeEventListeners();
            
            // 停止 MutationObserver
            if (mutationObserver) {
                mutationObserver.disconnect();
                mutationObserver = null;
            }
            
            console.log(`[夜间模式] v${VERSION} 已卸载`);
        } catch (error) {
            console.error('[夜间模式] 卸载失败:', error);
        }
    }

    // 立即添加样式（在页面渲染前）
    addStyles();

    // 立即应用夜间模式状态（在页面渲染前）
    // 这样可以避免从亮色闪到暗色的问题
    (function applyDarkModeImmediately() {
        const isDarkMode = getStoredState();
        if (isDarkMode) {
            // 立即在 documentElement 上设置属性
            if (document.documentElement) {
                document.documentElement.setAttribute(CONFIG.attributeName, 'true');
            }
        }
    })();

    // 初始化
    function init() {
        try {
            console.log(`[夜间模式] v${VERSION} 初始化中...`);

            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    // 确保状态正确应用
                    applyDarkModeState(getStoredState());
                    createToggleButton();
                    setupKeyboardShortcut();
                    setupSPAListener();
                    console.log(`[夜间模式] v${VERSION} 已加载`);
                });
            } else {
                // 确保状态正确应用
                applyDarkModeState(getStoredState());
                createToggleButton();
                setupKeyboardShortcut();
                setupSPAListener();
                console.log(`[夜间模式] v${VERSION} 已加载`);
            }
        } catch (error) {
            console.error('[夜间模式] 初始化失败:', error);
        }
    }

    // 设置 SPA 路由监听（优化性能）
    function setupSPAListener() {
        let lastUrl = location.href;
        
        // 使用节流的 URL 检查函数
        const checkUrlChange = throttle(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // 确保按钮存在
                if (!document.querySelector('.dark-mode-toggle-btn')) {
                    createToggleButton();
                }
                // 重新应用状态
                applyDarkModeState(getStoredState());
            }
        }, 1000);

        // 监听 popstate 和 pushstate 事件（更高效的 SPA 检测）
        window.addEventListener('popstate', checkUrlChange);
        
        // 拦截 pushState 和 replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            checkUrlChange();
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            checkUrlChange();
        };
        
        // 作为后备方案，使用节流的 MutationObserver
        mutationObserver = new MutationObserver(checkUrlChange);
        mutationObserver.observe(document.body || document.documentElement, {
            childList: true,
            subtree: false // 只监听直接子元素，减少性能开销
        });
    }

    // 立即执行初始化
    init();

    // 暴露清理方法到全局（可选，便于调试）
    if (typeof window !== 'undefined') {
        window.darkModeDestroy = destroy;
    }

})();