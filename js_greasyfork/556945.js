// ==UserScript==
// @name         微博聊天-隐藏左上角用户名
// @namespace    http://tampermonkey.net/
// @version      2
// @description  隐藏微博聊天界面左上角的用户名和头像
// @author       tu
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556945/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E9%9A%90%E8%97%8F%E5%B7%A6%E4%B8%8A%E8%A7%92%E7%94%A8%E6%88%B7%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/556945/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E9%9A%90%E8%97%8F%E5%B7%A6%E4%B8%8A%E8%A7%92%E7%94%A8%E6%88%B7%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        div[data-v-15bac53e][data-v-3388b674] {
            display: none !important;
        }
        div[data-v-454daed8][data-v-3388b674] {
            position: relative;
            top: 0px!important
        }
    `;
    document.head.appendChild(style);
})();