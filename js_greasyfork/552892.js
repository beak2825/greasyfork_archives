// ==UserScript==
// @name         Gemini 标签页标题增强
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  动态、稳健地检测Gemini当前对话标题，并将其设置为浏览器标签页标题。
// @author       [PhareX](https://github.com/PhareX)
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552892/Gemini%20%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552892/Gemini%20%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    // 修改这里的选择器以适应未来Gemini页面的更新
    //
    // 1. 对话列表的容器元素的选择器。脚本将等待此元素加载完成，并只监听此区域的变化。(通常是包裹整个左侧对话历史的那个<div>))
    const CHAT_CONTAINER_SELECTOR = '.overflow-container';
    //
    // 2. 当前被选中的对话标题元素的选择器。
    const ACTIVE_TITLE_SELECTOR = '.conversation.selected .conversation-title';
    // --- 配置结束 ---


    /**
     * 等待指定选择器的元素出现在DOM中，然后执行回调函数
     * @param {string} selector - CSS选择器
     * @param {function(Element)} callback - 元素出现后要执行的回调函数，会传入找到的元素
     */
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500); // 每500毫秒检查一次
    }

    /**
     * 初始化标题监视逻辑
     * @param {Element} targetNode - 需要被监视的DOM节点 (即对话列表容器)
     */
    function initializeTitleMonitor(targetNode) {
        const originalTitle = document.title;

        // 核心函数：查找当前对话标题并更新浏览器标签页标题
        function updateTabTitle() {
            const activeTitleElement = document.querySelector(ACTIVE_TITLE_SELECTOR);

            if (activeTitleElement) {
                const chatTitle = activeTitleElement.textContent.trim();
                // 只有当新标题与当前标签页标题不同时才更新
                if (chatTitle && document.title !== chatTitle) {
                    document.title = chatTitle;
                    //console.log(`[Gemini标签页标题增强] 标签页标题已更新为: ${chatTitle}`);
                }
            //} else {
            //    // 如果没有找到激活的对话，则恢复原始标题
            //    if (document.title !== originalTitle) {
            //        document.title = originalTitle;
            //        //console.log(`[Gemini标签页标题增强] 恢复原始标题: ${originalTitle}`);
            //    }
            }
        }

        // 创建一个监视DOM变化的观察者
        const observer = new MutationObserver(updateTabTitle);

        // 配置观察者：监视子元素列表变化和class属性变化
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        };

        // 启动观察者，开始监视指定的`targetNode`
        observer.observe(targetNode, config);
        //console.log(`[Gemini标签页标题增强] 已开始监视节点:`, targetNode);

        // 脚本启动后，立即执行一次，确保初始标题正确
        updateTabTitle();
    }

    // --- 脚本主入口 ---
    //console.log("[Gemini标签页标题增强] 脚本已加载，正在等待对话列表容器出现...");
    waitForElement(CHAT_CONTAINER_SELECTOR, (containerElement) => {
        //console.log("[Gemini标签页标题增强] 对话列表容器已找到，启动标题监视器。");
        initializeTitleMonitor(containerElement);
    });

})();