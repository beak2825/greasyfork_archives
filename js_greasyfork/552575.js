// ==UserScript==
// @name         Claude版 asobi ticket姓名修改器
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  在 asobiticket2.asobistore.jp 域名下将所有 .companion-name 元素的文本替换为自己想要替换的名字，需要在代码配置中修改配置。
// @author       You
// @match        https://asobiticket2.asobistore.jp/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552575/Claude%E7%89%88%20asobi%20ticket%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552575/Claude%E7%89%88%20asobi%20ticket%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 执行替换的函数
    function replaceText() {
        const elements = document.querySelectorAll('.companion-name');
        elements.forEach(el => {
            if (el.textContent.trim() !== 'ZHOU QIAOFEI') {
                el.textContent = 'ZHOU QIAOFEI';
                console.log('[脚本] 已替换元素文本为 ZHOU QIAOFEI');
            }
        });
    }

    // 创建 MutationObserver 持续监控 DOM 变化
    const observer = new MutationObserver(() => {
        replaceText();
    });

    // 等待 DOM 加载完成后启动监控
    function init() {
        // 立即执行一次替换
        replaceText();

        // 开始监控整个文档的变化
        observer.observe(document.body || document.documentElement, {
            childList: true,      // 监控子节点的增删
            subtree: true,        // 监控所有后代节点
            characterData: true   // 监控文本内容变化
        });

        console.log('[脚本] 已启动监控,将自动替换所有 .companion-name 文本');
    }

    // 根据文档加载状态决定启动时机
    if (document.body) {
        init();
    } else {
        // 如果 body 还未加载,等待 DOMContentLoaded 事件
        document.addEventListener('DOMContentLoaded', init);
    }
})();
