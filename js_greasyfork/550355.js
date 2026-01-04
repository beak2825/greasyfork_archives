// ==UserScript==
// @name         知乎首页去信息流
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  隐藏知乎首页的信息流内容
// @author       CoCoThink
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/hot
// @match        https://www.zhihu.com/follow
// @match        https://www.zhihu.com/column-square
// @match        https://www.zhihu.com/ring-feeds
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550355/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550355/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加 CSS 样式，隐藏信息流
    GM_addStyle(`
        /* 隐藏推荐信息流 */
        #root div[class^="List"] {
            display: none !important;
        }

        #root div[class="Topstory-content"] {
            display: none !important;
        }
    `);

    console.log('【知乎去信息流】脚本已执行，信息流已被隐藏');
})();