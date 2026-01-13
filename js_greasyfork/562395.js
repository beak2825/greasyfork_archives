// ==UserScript==
// @name         Bilibili 净化搜索框占位符
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  保留搜索功能，但隐藏搜索框内烦人的动态推荐文字
// @author       咖啡
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562395/Bilibili%20%E5%87%80%E5%8C%96%E6%90%9C%E7%B4%A2%E6%A1%86%E5%8D%A0%E4%BD%8D%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/562395/Bilibili%20%E5%87%80%E5%8C%96%E6%90%9C%E7%B4%A2%E6%A1%86%E5%8D%A0%E4%BD%8D%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 策略：通过 CSS 将 placeholder (占位符) 的颜色设为透明
    // 这样无论 B站 后台怎么修改文字，你也看不见，眼不见心不烦
    const css = `
        input.nav-search-input::placeholder {
            color: transparent !important;
            opacity: 0 !important;
        }
        /* 兼容部分浏览器的私有前缀 */
        input.nav-search-input::-webkit-input-placeholder {
            color: transparent !important;
            opacity: 0 !important;
        }
        input.nav-search-input::-moz-placeholder {
            color: transparent !important;
            opacity: 0 !important;
        }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 双重保险：尝试用 JS 清空 title 和 placeholder 属性
    window.addEventListener('load', function() {
        const input = document.querySelector('.nav-search-input');
        if (input) {
            input.setAttribute('placeholder', '');
            input.setAttribute('title', '');

            // 监听变化，防止 B站 动态改回去
            const observer = new MutationObserver(() => {
                if (input.getAttribute('placeholder') !== '') {
                    input.setAttribute('placeholder', '');
                    input.setAttribute('title', '');
                }
            });
            observer.observe(input, { attributes: true, attributeFilter: ['placeholder', 'title'] });
        }
    });
})();