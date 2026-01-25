// ==UserScript==
// @name         Gemini 标签页标题优化
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  将 Google Gemini 网页标题替换为当前聊天的标题
// @author       You
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564001/Gemini%20%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/564001/Gemini%20%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debounceTimer = null;

    // 核心函数：尝试获取聊天标题并修改页面标题
    function updatePageTitle() {
        try {
            const currentPath = window.location.pathname;
            let chatTitle = null;

            // 方法 1: 侧边栏查找 (增加 decodeURIComponent 防止 URL 编码导致的匹配失败)
            // 很多时候 URL 里的路径可能是编码过的，安全起见解码一下
            const activeSidebarLink = document.querySelector(`a[href$="${decodeURIComponent(currentPath)}"]`) ||
                                      document.querySelector(`a[href$="${currentPath}"]`);

            if (activeSidebarLink) {
                const titleElement = activeSidebarLink.querySelector('.conversation-title, .conversation-title-text'); // 增加选择器容错
                if (titleElement) {
                    chatTitle = titleElement.textContent.trim();
                }
            }

            // 方法 2: 顶部菜单查找
            if (!chatTitle) {
                // 尝试匹配顶部标题容器
                const headerTitleElement = document.querySelector('h1.conversation-title, .conversation-actions-menu-button .conversation-title');
                if (headerTitleElement) {
                    chatTitle = headerTitleElement.textContent.trim();
                }
            }

            // 执行替换：只有当标题确实不同时才操作 DOM，减少开销
            const defaultTitle = "Google Gemini";
            if (chatTitle && document.title !== chatTitle) {
                document.title = chatTitle;
            } else if (!chatTitle && document.title !== defaultTitle && !document.title.includes(currentPath)) {
                 // 可选：如果没找到标题，且当前不是默认标题，也不做激进的重置，防止覆盖系统原意
            }

        } catch (e) {
            // 保持静默，避免控制台刷屏
        }
    }

    // --- 性能优化核心 ---
    // 创建一个防抖动执行器
    function debouncedUpdate() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        // 设置 500ms 延迟。这意味着即使 DOM 一秒变动 100 次，
        // 我们也只会在变动停止或间隙时检查一次标题。
        debounceTimer = setTimeout(() => {
            updatePageTitle();
            debounceTimer = null;
        }, 500);
    }

    // 1. 使用 MutationObserver 监听 DOM 变化，但通过防抖函数调用
    const observer = new MutationObserver((mutations) => {
        // 不再直接调用 updatePageTitle
        debouncedUpdate();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 2. 路由变化监听 (History API) - 即使这里触发，也会被防抖合并
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        debouncedUpdate(); // 立即触发一次（也会被防抖处理）
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        debouncedUpdate();
    };

    window.addEventListener('popstate', debouncedUpdate);

    // 3. 初始执行
    setTimeout(updatePageTitle, 1000);

})();