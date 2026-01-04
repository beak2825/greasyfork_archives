// ==UserScript==
// @name         标注页面问题和答案左右排放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制把 anchor-1 放到 anchor-0 的右边显示
// @match        *://qlabel.tencent.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550627/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E9%97%AE%E9%A2%98%E5%92%8C%E7%AD%94%E6%A1%88%E5%B7%A6%E5%8F%B3%E6%8E%92%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/550627/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E9%97%AE%E9%A2%98%E5%92%8C%E7%AD%94%E6%A1%88%E5%B7%A6%E5%8F%B3%E6%8E%92%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function tryMove() {
        const anchor0 = document.getElementById('anchor-0');
        const anchor1 = document.getElementById('anchor-1');

        if (!anchor0 || !anchor1) return false;

        const container = anchor0.parentElement;

        // 强制修改父容器样式
        Object.assign(container.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '16px', // 两个块之间的间距
        });

        // 防止 div 过长自动换行
        Object.assign(anchor0.style, {
            flex: '0 0 auto',
            maxWidth: '48%',
        });

        Object.assign(anchor1.style, {
            flex: '0 0 auto',
            maxWidth: '48%',
        });

        return true;
    }

    tryMove();
    // 页面变动自动更新隐藏状态
    const observer = new MutationObserver(() => {
        tryMove();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
