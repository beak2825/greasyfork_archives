// ==UserScript==
// @name         無限動漫翻頁助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  为 onemoreplace.tw 及其漫画阅读器增加方向键支持：→下一集/下一页，←上一集/上一页
// @author       pixel
// @match        https://articles.onemoreplace.tw/*
// @match        https://onemoreplace.tw/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557041/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%E7%BF%BB%E9%A0%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557041/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%E7%BF%BB%E9%A0%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项：定义触发按键
    const CONFIG = {
        nextKey: 'ArrowRight', // 右箭头
        prevKey: 'ArrowLeft',  // 左箭头
    };

    /**
     * 查找下一页/下一集按钮
     * 策略：
     * 1. 优先查找阅读器模式的 ID (#nextvol2)
     * 2. 其次查找 WordPress 列表页的类名 (.next.page-numbers)
     */
    function findNextButton() {
        // 匹配片段代码中的 <a id="nextvol2">
        let btn = document.querySelector('#nextvol2');

        // 如果没找到，尝试匹配完整代码中的 WordPress 翻页 <a class="next page-numbers">
        if (!btn) {
            btn = document.querySelector('.next.page-numbers');
        }
        return btn;
    }

    /**
     * 查找上一页/上一集按钮
     * 策略：
     * 1. 优先查找阅读器模式的 ID (#prevvol2)
     * 2. 其次查找 WordPress 列表页的类名 (.prev.page-numbers)
     */
    function findPrevButton() {
        // 匹配片段代码中的 <a id="prevvol2">
        let btn = document.querySelector('#prevvol2');

        // 如果没找到，尝试匹配 WordPress 翻页
        if (!btn) {
            btn = document.querySelector('.prev.page-numbers');
        }
        return btn;
    }

    // 主事件监听器
    document.addEventListener('keydown', function(e) {
        // 1. 防抖/过滤：如果用户正在输入框中打字，不要触发
        const activeTag = document.activeElement.tagName.toUpperCase();
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
            return;
        }

        let targetBtn = null;
        let actionName = "";

        // 2. 按键匹配
        if (e.key === CONFIG.nextKey) {
            targetBtn = findNextButton();
            actionName = "下一集/下一页";
        } else if (e.key === CONFIG.prevKey) {
            targetBtn = findPrevButton();
            actionName = "上一集/上一页";
        }

        // 3. 执行点击
        if (targetBtn) {
            // 阻止默认行为（防止页面横向滚动）
            e.preventDefault();
            e.stopPropagation();

            // 模拟点击
            targetBtn.click();

            // 如果是href链接跳转，click()可能不够，显式跳转（针对纯链接的情况）
            // 这里的 onclick="nv()" 会被 click() 触发，所以通常不需要 window.location

            console.log(`[翻页助手] 已触发: ${actionName}`, targetBtn);
        }
    });

    console.log('[翻页助手] 键盘监听已加载 (适配模式: ID优先 + WP兼容)');
})();