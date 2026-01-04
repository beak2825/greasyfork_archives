// ==UserScript==
// @name         bili刷新增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截刷新操作，改为点击“刷新内容”按钮
// @match        https://www.bilibili.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549155/bili%E5%88%B7%E6%96%B0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/549155/bili%E5%88%B7%E6%96%B0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义刷新按钮的选择器（你可以根据实际页面调整）
    const refreshSelector = 'button:contains("换一换"), button:contains("刷新内容")';

    // 拦截 F5 按键
    window.addEventListener('keydown', function(e) {
        if (e.key === 'F5') {
            e.preventDefault();
            triggerRefresh();
        }
    });

    // 拦截 location.reload()
    const originalReload = window.location.reload;
    window.location.reload = function() {
        triggerRefresh();
    };

    // 模拟点击刷新按钮
    function triggerRefresh() {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.innerText.includes('换一换') || btn.innerText.includes('刷新内容')) {
                btn.click();
                console.log('已触发局部刷新');
                return;
            }
        }
        console.warn('未找到刷新按钮');
    }
})();
