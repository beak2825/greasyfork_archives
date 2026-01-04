// ==UserScript==
// @name         网页限制解除🔓
// @namespace    
// @version      2025.9.27
// @description  解除网页文本选择、复制限制
// @author       Script Author
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550843/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%F0%9F%94%93.user.js
// @updateURL https://update.greasyfork.org/scripts/550843/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%F0%9F%94%93.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';
    
    // 性能优化：使用轻量级DOM就绪检测
    const initScript = () => {
        // 仅执行一次的核心初始化
        if (!window.__selectionUnlocked) {
            injectCSS();
            setupEventListeners();
            window.__selectionUnlocked = true;
        }
    };
    
    // 优化CSS注入 - 仅执行一次
    const injectCSS = () => {
        const styleId = 'selection-unlock-style';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            body, body * {
                -webkit-user-select: auto !important;
                user-select: auto !important;
                -webkit-touch-callout: default !important;
            }
            
            /* 针对常见禁止选择类名 */
            .no-select, .noselect, .disabled-select {
                -webkit-user-select: auto !important;
                user-select: auto !important;
            }
            
            /* 移动端优化选择样式 */
            ::selection {
                background: rgba(0, 120, 255, 0.2) !important;
            }
        `;
        
        document.head.appendChild(style);
    };
    
    // 优化事件处理 - 使用事件委托
    const setupEventListeners = () => {
        // 使用被动事件监听器提高滚动性能
        const options = { passive: true, capture: true };
        
        // 解除事件限制
        const blockEvents = (e) => {
            if (e.type === 'selectstart' || e.type === 'contextmenu') {
                e.stopPropagation();
            }
        };
        
        // 使用单个捕获阶段监听器处理多个事件
        document.addEventListener('selectstart', blockEvents, options);
        document.addEventListener('contextmenu', blockEvents, options);
        
        // 移动端触摸选择优化
        setupTouchSelection();
    };
    
    // 优化触摸选择逻辑
    const setupTouchSelection = () => {
        let touchTimer = null;
        
        // 轻量级触摸处理
        document.addEventListener('touchstart', (e) => {
            if (touchTimer) clearTimeout(touchTimer);
            touchTimer = setTimeout(() => {
                ensureTextSelection();
            }, 500); // 500ms长按触发选择
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (touchTimer) clearTimeout(touchTimer);
        }, { passive: true });
        
        document.addEventListener('touchmove', () => {
            if (touchTimer) clearTimeout(touchTimer);
        }, { passive: true });
    };
    
    const ensureTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length === 0) {
            selection.removeAllRanges();
        }
    };
    
    // 优化DOM变化检测 - 精简MutationObserver
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 仅当有新元素添加时重新应用样式
                injectCSS();
                break;
            }
        }
    });
    
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    
    // 开始观察文档变化（精简配置）
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
