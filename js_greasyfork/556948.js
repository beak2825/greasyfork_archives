// ==UserScript==
// @name         微博聊天-消息气泡尺寸优化
// @namespace    http://tampermonkey.net/
// @version      1
// @description  ①消息气泡增宽 ②微博消息卡片增宽+支持换行
// @author       tu
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556948/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E5%B0%BA%E5%AF%B8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/556948/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E5%B0%BA%E5%AF%B8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* ① bubble_cont 最大宽度 650px */
        .cardcontain .bubble_cont[data-v-223122de] {
            max-width: 650px !important;
        }

        /* ② card2 最大宽度 650px */
        .card2[data-v-4692b658] {
            max-width: 650px !important;
        }

        /* ③ card2 内容宽度 540px */
        .card2 .content[data-v-4692b658] {
            width: 540px !important;
        }

        /* ④ 允许 card2 内的描述文字换行（去掉nowrap效果） */
        .card2[data-v-4692b658] .one-line.nowrap.font12.W_txt3 {
            white-space: normal !important;
        }

        /*（可选）去掉 text-overflow: ellipsis 防止被截断 */
        .card2[data-v-4692b658] .one-line.nowrap.font12.W_txt3 {
            overflow: visible !important;
            text-overflow: unset !important;
        }
    `;
    document.head.appendChild(style);
})();
