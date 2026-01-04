// ==UserScript==
// @name         包子漫画/TW Manga 弹窗广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽 #baoziAdPopup 及其相关的弹窗广告
// @author       pixel
// @match        *://www.twmanga.com/*
// @match        *://www.baozimh.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557174/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BBTW%20Manga%20%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557174/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BBTW%20Manga%20%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 策略一：CSS 层面直接隐藏 (最为快速，防止闪烁)
    // 针对 ID 和 Class 进行隐藏，且提高优先级
    const css = `
        #baoziAdPopup,
        .baozi-ad,
        .baozi-ad-overlay {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            z-index: -9999 !important;
        }
    `;
    GM_addStyle(css);

    // 2. 策略二：DOM 层面物理移除 (防止后台脚本继续运行或占用内存)
    function removeAdNode() {
        const adNode = document.getElementById('baoziAdPopup');
        if (adNode) {
            adNode.remove();
            console.log('[AdBlock] 已移除广告节点: #baoziAdPopup');
        }

        // 移除可能存在的遮罩层（如果有的话，通常广告会有配套的 overlay）
        const overlays = document.querySelectorAll('.baozi-ad-overlay');
        overlays.forEach(el => el.remove());
    }

    // 页面加载时尝试移除
    removeAdNode();

    // 3. 策略三：监听 DOM 变化 (应对异步加载/SPA切换)
    const observer = new MutationObserver((mutations) => {
        // 简单粗暴的检测，避免遍历 mutations 带来的性能损耗，直接尝试获取 ID
        removeAdNode();
    });

    // 开始监听 body 的子节点变化
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        // 如果脚本运行过早，body 还没生成，则等待 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            removeAdNode();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

})();