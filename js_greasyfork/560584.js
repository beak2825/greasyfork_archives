// ==UserScript==
// @name         解除知乎复制限制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解除知乎复制限制.
// @author       User
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560584/%E8%A7%A3%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/560584/%E8%A7%A3%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义样式：白底、黑字、小字体、阴影
    const css = `
        .zhihu-copy-notice {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            /* 白底 */
            background-color: #ffffff;
            /* 黑字 (深灰以减少刺眼) */
            color: #333333;
            /* 小字体 */
            font-size: 12px;
            padding: 16px 30px;
            border-radius: 20px;
            /* 添加边框和阴影，防止在白色页面背景上看不清 */
            border: 1px solid #ebebeb;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 999999;
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
            animation: fadeInOut 2.5s ease-in-out forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; top: 10px; }
            10% { opacity: 1; top: 24px; }
            80% { opacity: 1; top: 24px; }
            100% { opacity: 0; top: 10px; }
        }

        /* 强制允许选中文字 */
        * {
            -webkit-user-select: text !important;
            user-select: text !important;
        }
    `;

    // 注入 CSS
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const styleNode = document.createElement("style");
        styleNode.innerText = css;
        document.head.appendChild(styleNode);
    }

    // 2. 显示提示框函数
    function showToast() {
        // 如果已存在旧的提示，先移除，防止堆叠
        const oldToast = document.querySelector('.zhihu-copy-notice');
        if (oldToast) oldToast.remove();

        const div = document.createElement('div');
        div.className = 'zhihu-copy-notice';
        // 指定的提示文字
        div.innerText = '已复制内容，若有禁止转载提示可无视';
        document.body.appendChild(div);

        // 动画结束后移除
        setTimeout(() => {
            if (div && div.parentElement) {
                div.remove();
            }
        }, 2500);
    }

    // 3. 核心逻辑：拦截并重写复制行为
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        // 阻止知乎原有的复制事件（阻止添加版权尾巴或禁止复制弹窗）
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        // 获取选中内容
        const range = selection.getRangeAt(0);
        const container = document.createElement('div');
        container.appendChild(range.cloneContents());

        const htmlText = container.innerHTML;
        const plainText = selection.toString();

        if (e.clipboardData) {
            // 写入剪贴板
            e.clipboardData.setData('text/html', htmlText);
            e.clipboardData.setData('text/plain', plainText);

            // 显示提示
            showToast();
        }
    }, true); // 使用捕获模式(true)以确保在知乎脚本之前执行

})();