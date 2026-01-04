// ==UserScript==
// @name         Google AI Studio | 清空聊天记录
// @namespace    https://greasyfork.org/
// @description  清空Google AI Studio聊天记录
// @version      1.1
// @author       Henry
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553540/Google%20AI%20Studio%20%7C%20%E6%B8%85%E7%A9%BA%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553540/Google%20AI%20Studio%20%7C%20%E6%B8%85%E7%A9%BA%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Gemini Chat Cleaner] Script loaded and starting...');
    console.log('[Gemini Chat Cleaner] Current URL:', window.location.href);

    //================================================================================
    // CONFIGURATION
    //================================================================================
    const CHAT_TURN_OPTIONS_SELECTOR = 'ms-chat-turn-options span[class="material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted"]';
    const DELETE_BUTTON_MENU_SELECTOR = 'div.mat-mdc-menu-content > button:first-of-type';
    const DELETE_BUTTON_TEXT = "delete Delete";

    // --- 新增: 用于SPA导航检测 ---
    const BUTTON_ID = 'gemini-cleaner-button';
    const TOOLBAR_SELECTOR = 'ms-toolbar .toolbar-right'; 
    const TARGET_URL_PATH = '/prompts/'; 

    //================================================================================
    // STYLES
    //================================================================================
    GM_addStyle(`
        #${BUTTON_ID} {
            margin: 0 4px;
        }
    `);

    //================================================================================
    // HELPER FUNCTIONS (与原版相同)
    //================================================================================
    /**
     * Clicks all elements matching a given CSS selector.
     */
    function clickAllElements(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[Gemini Chat Cleaner] No elements found for selector: ${selector}`);
                return;
            }
            elements.forEach(element => {
                element.click();
            });
            console.log(`[Gemini Chat Cleaner] Clicked ${elements.length} elements for selector: ${selector}`);
        } catch (error) {
            console.error(`[Gemini Chat Cleaner] Error clicking elements for selector ${selector}:`, error);
        }
    }

    /**
     * Clicks delete buttons within a menu content, identified by text.
     */
    function clickDeleteButtonsInMenu(selector, text) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[Gemini Chat Cleaner] No menu elements found for selector: ${selector}`);
                return;
            }
            let clickedCount = 0;
            elements.forEach(element => {
                if (element.textContent.trim() === text) {
                    element.click();
                    clickedCount++;
                }
            });
            if (clickedCount > 0) {
                 console.log(`[Gemini Chat Cleaner] Clicked ${clickedCount} delete button(s) with text: "${text}"`);
            }
        } catch (error) {
            console.error(`[Gemini Chat Cleaner] Error clicking delete buttons in menu for selector ${selector}:`, error);
        }
    }

    //================================================================================
    // MAIN EXECUTION (与原版相同)
    //================================================================================
    function main() {
        console.log('[Gemini Chat Cleaner] Main function triggered');
        // 点击所有聊天回合的 "选项" 图标
        clickAllElements(CHAT_TURN_OPTIONS_SELECTOR);

        // **重要**: 
        // 因为点击 "选项" 会在 <body> 下创建多个分离的菜单
        // 所以下一步的 `querySelectorAll` 可以找到所有菜单并点击。
        // 为确保菜单有时间渲染，加一个小延迟。
        setTimeout(() => {
            clickDeleteButtonsInMenu(DELETE_BUTTON_MENU_SELECTOR, DELETE_BUTTON_TEXT);
        }, 100); // 延迟100毫秒
    }

    //================================================================================
    // REFACTORED: Button Injection and SPA Handling
    //================================================================================

    /**
     * 实际创建和注入按钮的函数
     * @param {Element} toolbarRight - 已经找到的工具栏元素
     */
    function injectButton(toolbarRight) {
        console.log('[Gemini Chat Cleaner] Injecting button...');

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.title = 'Clear Chat Turns';
        button.setAttribute('ms-button', '');
        button.setAttribute('variant', 'icon-borderless');
        button.setAttribute('mattooltip', 'Clear Chat Turns');
        button.setAttribute('mattooltipposition', 'below');
        button.setAttribute('iconname', 'refresh');
        button.className = 'mat-mdc-tooltip-trigger ng-tns-c2648639672-5 ms-button-borderless ms-button-icon ng-star-inserted';
        button.setAttribute('aria-label', 'Clear Chat Turns');
        button.setAttribute('aria-disabled', 'false');
        button.addEventListener('click', main);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = 'refresh';

        button.appendChild(iconSpan);

        // 插入到 "more_vert" 按钮之前
        const moreButton = toolbarRight.querySelector('button[iconname="more_vert"]');
        if (moreButton) {
            toolbarRight.insertBefore(button, moreButton);
            console.log('[Gemini Chat Cleaner] Button inserted before more_vert button');
        } else {
            toolbarRight.appendChild(button);
            console.log('[Gemini Chat Cleaner] Button appended to toolbar');
        }
    }

    /**
     * 检查是否需要注入按钮的核心函数
     * (这是 MutationObserver 的回调)
     */
    function checkAndInjectButton() {
        // 1. 检查URL是否匹配
        if (!window.location.href.includes(TARGET_URL_PATH)) {
            // 不在聊天页面，什么也不做
            return;
        }

        // 2. 检查工具栏是否存在
        const toolbarRight = document.querySelector(TOOLBAR_SELECTOR);

        if (toolbarRight) {
            // 3. 工具栏存在，检查按钮是否 *不* 存在
            if (!document.getElementById(BUTTON_ID)) {
                // 工具栏存在，但按钮不存在 -> 注入
                console.log('[Gemini Chat Cleaner] Chat page and toolbar found. Button missing. Injecting...');
                injectButton(toolbarRight);
            }
            // (如果工具栏和按钮都存在，什么也不做)
        }
        // (如果工具栏不存在，什么也不做，等待下一次DOM变化)
    }

    /**
     * 启动 MutationObserver 来监视DOM变化
     */
    function startObserver() {
        console.log('[Gemini Chat Cleaner] Starting MutationObserver...');

        const observer = new MutationObserver((mutationsList, obs) => {
            // 每当DOM变化时，重新运行检查
            // 可以添加 "debounce" 来防止过于频繁的检查，但现在保持简单
            checkAndInjectButton();
        });

        // 配置观察者:
        // childList: true - 监视子元素的添加或删除
        // subtree: true   - 监视所有后代节点
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * 脚本初始化入口
     */
    function init() {
        console.log('[Gemini Chat Cleaner] Initializing...');
        // 1. 立即检查一次，应对 "F5 刷新"
        //    为确保 F5 刷新时 DOM 完全准备好，稍微延迟一下
        setTimeout(checkAndInjectButton, 500);

        // 2. 启动观察者，应对 "SPA 导航"
        startObserver();
    }

    //================================================================================
    // SCRIPT ENTRY POINT
    //================================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM 已经加载完成
        init();
    }

})();