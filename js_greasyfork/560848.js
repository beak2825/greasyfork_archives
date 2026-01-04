// ==UserScript==
// @name         tapdRenewCloser
// @namespace    http://tampermonkey.net/
// @version      2025-12-31
// @description  自动关闭 TAPD 弹框提醒
// @author       You
// @match        https://www.tapd.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560848/tapdRenewCloser.user.js
// @updateURL https://update.greasyfork.org/scripts/560848/tapdRenewCloser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 安全获取DOM元素（支持单个通用选择器，兼容原有逻辑）
     * @param {string} selector - 通用CSS选择器
     * @returns {Element|null} 找到的元素或null
     */
    function safeGetElement(selector) {
        try {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`未找到匹配通用选择器的元素：${selector}`);
                return null;
            }
            console.log(`成功通过通用选择器获取元素：${selector}`);
            return element;
        } catch (error) {
            console.error(`获取元素失败：${error.message}`, error);
            return null;
        }
    }

    // 单个通用选择器（替代原来的4个选择器，可匹配所有同类元素）
    const targetSelector = "div.el-dialog__wrapper.company-renew-dialog div.el-dialog__header > button";

    // 1. 直接尝试获取元素（适用于元素随页面同步加载的场景）
    let targetElement = safeGetElement(targetSelector);

    // 2. 若直接获取失败，使用MutationObserver监听DOM变化（解决动态加载问题）
    if (!targetElement) {
        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: false
        };

        const observer = new MutationObserver((mutations, obs) => {
            targetElement = safeGetElement(targetSelector);
            if (targetElement) {
                console.log("通过DOM监听成功获取目标元素：", targetElement);
                // 此处添加你对元素的操作（示例：点击按钮）
                targetElement.click();

                // 获取元素后停止监听，节省性能
                obs.disconnect();
            }
        });

        // 监听全局DOM变化
        observer.observe(document.body, observerConfig);

        // 10秒超时机制，避免永久监听
        setTimeout(() => {
            if (!targetElement) {
                observer.disconnect();
                console.error("超时未获取目标元素，已停止DOM监听");
            }
        }, 10000);
    } else {
        console.log("直接获取目标元素成功：", targetElement);
        // 此处添加你对元素的操作
        targetElement.click();
    }

})();