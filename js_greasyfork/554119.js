// ==UserScript==
// @name         Gemini宽屏 (动态适配版)
// @name:zh-CN   Gemini宽屏 (动态适配版)
// @namespace    https://greasyfork.org/zh-CN/users/lcx04
// @version      2.1
// @description  Dynamically adapts for the 'ChatGPT Conversation Timeline' plugin. Widens input-container and input-area-container. Clears disclaimer text.
// @description:zh-CN 动态适配ChatGPT Conversation Timeline插件，并同时加宽input-container及其内部区域。清空底部免责声明文字（保留边距）。
// @author       lcx04
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554119/Gemini%E5%AE%BD%E5%B1%8F%20%28%E5%8A%A8%E6%80%81%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554119/Gemini%E5%AE%BD%E5%B1%8F%20%28%E5%8A%A8%E6%80%81%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------------------------------------------------
    // 检测目标： "chatgpt-timeline-bar"
    const OTHER_SCRIPT_CLASS = 'chatgpt-timeline-bar';
    // ----------------------------------------------------------------------

    let styleElement = null; // 用来保存我们注入的 <style> 标签的引用

    /**
     * 【更新】清理底部的免责声明区域
     * 使用 querySelectorAll 确保选中所有实例，并移除子节点
     */
    function clearDisclaimerContent() {
        // --- 1. 处理原本的文字免责声明 ---
        const disclaimers = document.querySelectorAll('[data-test-id="disclaimer"]');
        disclaimers.forEach(disclaimer => {
            if (disclaimer.textContent !== '') {
                disclaimer.textContent = ''; // 清空文字
            }
        });

        // --- 2. 处理中间那个带 <br> 的空声明 ---
        // 获取所有匹配的元素 (以防页面结构中有多个或隐藏的)
        const emptyDisclaimers = document.querySelectorAll('[data-test-id="empty-disclaimer"]');

        emptyDisclaimers.forEach(emptyDisclaimer => {
            // 只要它有子节点 (比如 <br>)，就清空
            if (emptyDisclaimer.firstChild) {
                // 使用 replaceChildren() 是一种非常高效且彻底的清空方式
                // 它会移除 <br>，但保留 <p> 标签本身及其 margin
                emptyDisclaimer.replaceChildren();
                // console.log('Wider Gemini: <br> removed.');
            }
        });
    }

    /**
     * 检查目标元素是否存在，并应用或更新正确的 CSS
     */
    function applyDynamicStyles() {
        // 检查 'chatgpt-timeline-bar' 元素是否存在
        const timelineExists = document.querySelector('.' + OTHER_SCRIPT_CLASS);

        let customCSS = '';

        if (timelineExists) {
            // 找到了，应用固定的 24px 边距
            console.log('Wider Gemini: "chatgpt-timeline-bar" detected. Applying fixed 24px margin.');
            customCSS = `
                /* --- 聊天记录容器 --- */
                .conversation-container {
                    width: calc(100% - 24px) !important;
                    max-width: 2000px !important;
                    margin-right: 24px !important;
                }
                user-query {
                    max-width: 2000px !important;
                }

                /* --- 输入框容器 (标签选择器) --- */
                input-container {
                    width: calc(100% - 24px) !important;
                    max-width: 2000px !important;
                    margin-right: 24px !important;
                    padding-left: 28px !important;
                    padding-right: 28px !important;
                }

                /* --- 【更新】输入框内部区域 --- */
                .input-area-container,
                .overlay-container {
                    max-width: 2000px !important; /* 保持最大宽度一致 */
                }
            `;
        } else {
            // 没找到，应用 0 边距的全宽样式
            console.log('Wider Gemini: "chatgpt-timeline-bar" NOT detected. Applying 0 margin.');
            customCSS = `
                /* --- 聊天记录容器 --- */
                .conversation-container {
                    width: 100% !important;
                    max-width: 2000px !important;
                    margin-right: 0 !important;
                }
                user-query {
                    max-width: 2000px !important;
                }

                /* --- 输入框容器 (标签选择器) --- */
                input-container {
                    width: 100% !important;
                    max-width: 2000px !important;
                    margin-right: 0 !important;
                    padding-left: 28px !important;
                    padding-right: 28px !important;
                }

                /* --- 【更新】输入框内部区域 --- */
                .input-area-container,
                .overlay-container {
                    max-width: 2000px !important; /* 保持最大宽度一致 */
                }
            `;
        }

        // 注入或更新样式
        if (styleElement) {
            // 如果 <style> 标签已存在，只更新其内容
            styleElement.textContent = customCSS;
        } else {
            // 如果是第一次运行，则创建 <style> 标签
            styleElement = GM_addStyle(customCSS);
        }
    }

    /**
     * 检查 DOM 变动
     * 【修改】: 同时检查 timeline 插件 和 免责声明
     */
    const observerCallback = (mutationsList, observer) => {
        let targetNodeChanged = false; // 标记 timeline 插件是否变化
        let generalDomChange = false;  // 标记是否发生了 DOM 变化（用于检查免责声明）

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                generalDomChange = true; // 只要有子节点变动，就标记

                // --- 原有逻辑: 检查 timeline 插件 ---
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.classList.contains(OTHER_SCRIPT_CLASS) || node.querySelector('.' + OTHER_SCRIPT_CLASS))) {
                        targetNodeChanged = true;
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.classList.contains(OTHER_SCRIPT_CLASS) || node.querySelector('.' + OTHER_SCRIPT_CLASS))) {
                        targetNodeChanged = true;
                    }
                });
                // --- 结束 ---
            }
        }

        // 如果 timeline 插件发生了变化，才更新 CSS
        if (targetNodeChanged) {
            applyDynamicStyles();
        }

        // 只要 DOM 发生了变动，就（重新）检查并清空免责声明的文字
        // 因为 Gemini 是 SPA，这个元素可能在切换页面或生成回答时被重新渲染
        if (generalDomChange) {
            clearDisclaimerContent();
        }
    };

    // --- 脚本执行 ---

    // 1. 创建并启动 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver(observerCallback);

    // 确保 <body> 存在后再开始监听
    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });

            // 立即运行一次检查（样式）
            applyDynamicStyles();
            // 立即运行一次检查（清空文字）
            clearDisclaimerContent();
        } else {
            // 如果 body 还没加载，稍后再试
            setTimeout(startObserver, 100);
        }
    };

    startObserver();

    console.log('Wider Gemini (Dynamic Adapter) script v2.0 loaded.');
})();