// ==UserScript==
// @name         浙大校历页自动点开最新校历
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动点击浙大校历页面 https://bksy.zju.edu.cn/28435/list.htm 上的最新校历，并在当前页面打开
// @author       You
// @match        https://bksy.zju.edu.cn/28435/list.htm?utm_source=
// @match        https://bksy.zju.edu.cn/*/*/*/page.htm
// @icon         https://www.zju.edu.cn/_upload/tpl/0b/bf/3007/template3007/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552990/%E6%B5%99%E5%A4%A7%E6%A0%A1%E5%8E%86%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%82%B9%E5%BC%80%E6%9C%80%E6%96%B0%E6%A0%A1%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/552990/%E6%B5%99%E5%A4%A7%E6%A0%A1%E5%8E%86%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%82%B9%E5%BC%80%E6%9C%80%E6%96%B0%E6%A0%A1%E5%8E%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
    const link = document.querySelector('.right-list .right-list-item a');

    if (link && link.href) {
        //console.log('找到目标链接:', link.href);
        // 在当前页面打开链接
        window.location.href = link.href;
    } else {
        console.warn('未找到目标链接');
    }
    });

    // 滚动到 class="article-title" 元素的顶部
    window.addEventListener('load', () => {
        const targetElement = document.querySelector('.article-title');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
            console.log('已滚动到 .article-title 元素顶部');
        } else {
            console.warn('未找到 .article-title 元素');
        }
    });

    history.pushState(null, null, location.href);
    window.addEventListener('popstate', (event) => {
        console.log('用户点击了返回键');
        // 跳转到指定页面
        window.location.href = 'https://bksy.zju.edu.cn/28435/list.htm';
    });
})();