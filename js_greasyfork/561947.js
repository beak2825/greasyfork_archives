// ==UserScript==
// @name         屏蔽阿里云文档选中弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽阿里云文档、入门教程、开发者社区等页面的选中文字弹窗及AI助手按钮
// @author       GeBron
// @match        *://*.aliyun.com/*
// @match        *://*.alibabacloud.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561947/%E5%B1%8F%E8%94%BD%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E6%A1%A3%E9%80%89%E4%B8%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/561947/%E5%B1%8F%E8%94%BD%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E6%A1%A3%E9%80%89%E4%B8%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 暴力 CSS 隐藏 (针对所有已知容器和潜在类名)
    const css = `
        /* 通用选择器：屏蔽所有包含 selection-ops 或 feedback 的浮层 */
        [id*="selection-ops"], 
        [class*="selection-ops"],
        [class*="feedback-wrapper"],
        [class*="cluedin-"],
        .aliyun-docs-feedback-wrapper,
        .next-overlay-wrapper,
        .selection-popup-container,
        #cluedin-feedback-container {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            left: -9999px !important; /* 强制移出屏幕 */
        }
    `;
    
    // 注入样式
    const injectCSS = () => {
        if (document.head) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        } else {
            setTimeout(injectCSS, 10);
        }
    };
    injectCSS();

    // 2. 核心拦截：切断事件流
    // 阿里云的弹窗通常监听 mouseup 或 selectionchange
    const silenceEvent = (e) => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
            // 当有文字选中时，停止事件冒泡，防止阿里云的脚本接收到信号
            e.stopPropagation();
        }
    };

    // 在捕获阶段拦截（true），抢在阿里云脚本之前处理
    window.addEventListener('mouseup', silenceEvent, true);
    window.addEventListener('selectionchange', (e) => {
        // 部分页面使用 selectionchange 触发，我们通过清理 DOM 来应对
        clearPopups();
    }, true);

    // 3. 动态清理逻辑
    function clearPopups() {
        // 针对那些已经生成的顽固元素直接移除
        const selectors = [
            '[id*="selection-ops"]',
            '[class*="selection-ops"]',
            '.aliyun-docs-feedback-wrapper'
        ];
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => {
                if (el && el.parentNode) el.remove();
            });
        });
    }

    // 4. 定时轮询（处理异步加载最保险的方法）
    setInterval(clearPopups, 500);

})();