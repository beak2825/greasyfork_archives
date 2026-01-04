// ==UserScript==
// @name         返修的时候自动跳过已经质检的题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检查标注按钮是否被禁用，如果是则弹出提示
// @author       You
// @match        https://qlabel.tencent.com/workbench/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550625/%E8%BF%94%E4%BF%AE%E7%9A%84%E6%97%B6%E5%80%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E7%BB%8F%E8%B4%A8%E6%A3%80%E7%9A%84%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/550625/%E8%BF%94%E4%BF%AE%E7%9A%84%E6%97%B6%E5%80%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E7%BB%8F%E8%B4%A8%E6%A3%80%E7%9A%84%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;
    let checkTimeout = null;
    let debounceTimer = null;
    const DEBOUNCE_DELAY = 400; // 防抖延迟300ms
    const ALERT_COOLDOWN = 1000; // alert冷却时间1秒
    let lastAlertTime = 0;

    // 防抖函数
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    // 检查按钮状态
    function checkButton() {
        if (!location.href.includes('scenes=label_again')) return;

        const button = document.querySelector('.z-footer.z-level .z-level__right button.ivu-btn.ivu-btn-primary.ivu-btn-large.ivu-btn-ghost');
        if (button && (button.hasAttribute('disabled') || button.disabled)) {
            const now = Date.now();
            if (now - lastAlertTime > ALERT_COOLDOWN) {
                lastAlertTime = now;
                console.log('按钮有 disabled 属性');
                // 先找到顶级 z-header z-level 元素
                const headerElement = document.querySelector('div.z-header.z-level[style*="padding: 0px"][style*="font-size: 10px"]');
                // 然后在该元素下查找下一页按钮
                const nextPageButton = headerElement?.querySelector('li.ivu-page-next a');
                // 点击下一页按钮（如果需要）
                nextPageButton?.click();
            }
        }
    }

    // 防抖版本的检查函数
    const debouncedCheckButton = debounce(checkButton, DEBOUNCE_DELAY);

    // 增强的检查函数
    function enhancedCheck() {
        // 清除之前的定时器
        if (checkTimeout) {
            clearTimeout(checkTimeout);
            checkTimeout = null;
        }

        // 使用防抖版本的检查
        debouncedCheckButton();

        // 设置防抖的重试机制
        checkTimeout = setTimeout(() => {
            debouncedCheckButton();
        }, 300);
    }

    // 监听URL变化
    const observeUrlChange = () => {
        let oldHref = location.href;
        const observer = new MutationObserver(mutations => {
            if (oldHref !== location.href) {
                oldHref = location.href;
                if (location.href.includes('scenes=label_again')) {
                    enhancedCheck();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    };

    // 覆盖 history API
    const wrapHistoryMethod = (method) => {
        const original = history[method];
        history[method] = function() {
            const result = original.apply(this, arguments);
            if (location.href.includes('scenes=label_again')) {
                enhancedCheck();
            }
            return result;
        };
    };

    ['pushState', 'replaceState'].forEach(wrapHistoryMethod);

    // 初始检查
    if (location.href.includes('scenes=label_again')) {
        enhancedCheck();
    }

    const observer = observeUrlChange();

    // 清理函数
    window.addEventListener('unload', () => {
        observer.disconnect();
        if (checkTimeout) {
            clearTimeout(checkTimeout);
        }
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        ['pushState', 'replaceState'].forEach(method => {
            history[method] = history[method].original;
        });
    });
})();