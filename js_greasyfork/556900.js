// ==UserScript==
// @name         百度首页宽屏展示 + 删除AI元素 + 固定搜索框
// @namespace    http://tampermonkey.net/
// @match        https://www.baidu.com/
// @grant        none
// @version      1.0
// @license      MIT
// @description  瞎写的
// @downloadURL https://update.greasyfork.org/scripts/556900/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA%20%2B%20%E5%88%A0%E9%99%A4AI%E5%85%83%E7%B4%A0%20%2B%20%E5%9B%BA%E5%AE%9A%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/556900/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA%20%2B%20%E5%88%A0%E9%99%A4AI%E5%85%83%E7%B4%A0%20%2B%20%E5%9B%BA%E5%AE%9A%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {

    // 等待节点出现
    function waitFor(selector, callback) {
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            }
        }, 50);
    }

    // 1️⃣ 删除百度 LOGO
    waitFor('#lg', el => el.remove());

    // 2️⃣ 删除 “我的AI应用”
    waitFor('.ai_app_wrapper_1ZRN3', el => el.remove());

    // 3️⃣ 删除底部“引导气泡”
    waitFor('.panel-list_8jHmm', el => el.remove());

    // 4️⃣ 删除右侧自动 AI 工具
    const removeRightBtn = () => {
        document.querySelectorAll('.chat-input-tool').forEach(e => e.remove());
    };
    setInterval(removeRightBtn, 300);

    // 9️⃣ 删除聊天输入框主容器 chat-input-main
    setInterval(() => {
        const el = document.getElementById('chat-input-main');
        if (el) el.remove();
    }, 300);

    (function() {
        'use strict';

        const style = document.createElement('style');
        style.innerHTML = `
            /* 百度首页主容器宽屏 */
            #wrapper,
            #s_main,
            .s-main-container,
            .s-p-top,
            .s-center-box,
            .content,
            .main,
            .s-drag-site {
                max-width: 1320px !important;
                width: 1320px !important;
                margin: 0 auto !important;
            }
        `;
        document.head.appendChild(style);

    })();

    // 5️⃣ 固定搜索框
    waitFor('#form', form => {
        form.style.position = 'absolute';
        form.style.top = '150px';
        form.style.left = '50%';
        form.style.transform = 'translateX(-50%)';
        form.style.width = '780px';
        form.style.zIndex = 9999;
    });

    // 6️⃣ “百度一下”按钮修复
    waitFor('#su, .s_btn', btn => {
        btn.style.position = 'relative';      // 改为相对布局
        btn.style.right = '0';                // 取消负偏移
        btn.style.top = '0';
        btn.style.height = '40px';
        btn.style.zIndex = 99999;

        // 保证按钮在搜索框右侧
        const form = document.querySelector('#form');
        if (form) {
            form.style.display = 'flex';
            form.style.alignItems = 'center';
            form.style.justifyContent = 'center';
            form.style.gap = '10px'; // 搜索框和按钮间距
        }
    });

})();
