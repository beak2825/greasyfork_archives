// ==UserScript==
// @name         Google AI Studio Title Synchronizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  把 AI Studio 对话的内部标题自动同步到网页标签页标题上
// @author       candy
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556776/Google%20AI%20Studio%20Title%20Synchronizer.user.js
// @updateURL https://update.greasyfork.org/scripts/556776/Google%20AI%20Studio%20Title%20Synchronizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TITLE_SELECTOR = 'h1.actions';
    let debounceTimer = null;

    // 核心逻辑
    function syncTitle() {
        const titleElement = document.querySelector(TITLE_SELECTOR);
        if (titleElement) {
            // 尝试获取 input 里的值(如果是编辑模式) 或者 普通文本
            // 这里做了一个兼容，优先取 input value，其次取 innerText
            const inputElement = titleElement.querySelector('input');
            let newTitle = inputElement ? inputElement.value : titleElement.innerText;

            newTitle = newTitle ? newTitle.trim() : '';

            if (newTitle && newTitle !== document.title) {
                document.title = newTitle;
            }
        }
    }

    // 创建观察器
    const observer = new MutationObserver((mutations) => {
        // 如果之前有定好的任务，先取消，因为页面又变了
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // 重新设定计时器，500毫秒后如果没有新变化，再执行
        debounceTimer = setTimeout(() => {
            syncTitle();
        }, 500);
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 首次运行
    setTimeout(syncTitle, 1000); // 稍微延迟一下等待页面加载

})();