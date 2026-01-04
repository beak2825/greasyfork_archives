// ==UserScript==
// @name         DeepSeek 滚动区域去内边距
// @namespace    http://tampermonkey.net/
// @version      2025-10-29
// @description  优化 DeepSeek 聊天界面显示效果，移除对话区域的内边距，让内容占满整个可视区域。自动检测页面变化并实时应用样式，提供更好的阅读体验。支持调试模式，兼容页面动态更新。
// @author       You
// @match        https://chat.deepseek.com/a/chat/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553259/DeepSeek%20%E6%BB%9A%E5%8A%A8%E5%8C%BA%E5%9F%9F%E5%8E%BB%E5%86%85%E8%BE%B9%E8%B7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/553259/DeepSeek%20%E6%BB%9A%E5%8A%A8%E5%8C%BA%E5%9F%9F%E5%8E%BB%E5%86%85%E8%BE%B9%E8%B7%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /**
     * 应用无内边距样式到对话区域的滚动容器
     * 使用精确的CSS选择器直接定位目标元素
     * 
     * 原始选择器: #root div div div div div div div div.ds-scroll-area
     * 分析: 使用具体的DOM层级结构来精确定位对话区域
     */
    function applyNoPadding() {
        // 使用精确的CSS选择器直接定位对话区域
        const targetElement = document.querySelector('#root div div div div div div div div.ds-scroll-area');
        
        if (targetElement) {
            targetElement.style.padding = '0';
            // 使用带前缀的日志，便于识别和过滤
            // console.log('%c[DeepSeek脚本] ✅ 已应用无内边距样式到对话区域', 'color: #4CAF50; font-weight: bold;');
            // console.log('%c[DeepSeek脚本] 📏 元素尺寸:', 'color: #2196F3;', targetElement.offsetWidth + 'x' + targetElement.offsetHeight);
        } else {
            // 调试模式：只在需要时输出详细信息
            if (window.deepseekDebugMode) {
                // console.group('%c[DeepSeek脚本] 🔍 调试信息', 'color: #FF9800; font-weight: bold;');
                // console.log('未找到指定的对话区域元素');
                
                // 备用方案：如果精确选择器失败，尝试查找所有ds-scroll-area元素进行调试
                const allScrollAreas = document.querySelectorAll('[class*="ds-scroll-area"]');
                // console.log('页面上找到的所有ds-scroll-area元素数量:', allScrollAreas.length);
                
                // 输出每个元素的路径信息，帮助调试
                allScrollAreas.forEach((element, index) => {
                    // console.log(`元素 ${index + 1}:`, element);
                });
                // console.groupEnd();
            } else {
                // 简洁模式：只输出关键信息
                // console.log('%c[DeepSeek脚本] ⚠️ 未找到目标元素', 'color: #FF5722;');
                // console.log('%c[DeepSeek脚本] 💡 提示: 在控制台输入 window.deepseekDebugMode = true 开启调试模式', 'color: #9E9E9E; font-style: italic;');
            }
        }
    }

    // 初次执行
    applyNoPadding();
    
    // 脚本加载完成提示
    console.log('%c[DeepSeek脚本] 🚀 脚本已加载完成', 'color: #4CAF50; font-weight: bold;');

    // 监听 DOM 变化，动态处理新增元素
    // 使用防抖机制避免频繁执行
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        // 清除之前的定时器
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        
        // 设置新的定时器，延迟执行
        debounceTimer = setTimeout(() => {
            applyNoPadding();
        }, 100); // 100ms防抖延迟
    });
    
    // 监听路由变化（适用于 Vue/React 等 SPA）
    let currentUrl = window.location.href;
    const checkUrlChange = () => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            // URL 变化时延迟执行，等待页面渲染完成
            setTimeout(() => {
                applyNoPadding();
            }, 200);
        }
    };
    
    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener('popstate', () => {
        setTimeout(() => {
            applyNoPadding();
        }, 200);
    });
    
    // 监听 pushState 和 replaceState（程序化路由跳转）
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(() => {
            applyNoPadding();
        }, 200);
    };
    
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(() => {
            applyNoPadding();
        }, 200);
    };
    
    // 定期检查 URL 变化（兜底方案）
    setInterval(checkUrlChange, 1000);
    
    // 开始观察DOM变化
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true, // 也监听属性变化，以防class动态改变
        attributeFilter: ['class'] // 只监听class属性的变化
    });
})();