// ==UserScript==
// @name         小红书首页去信息流
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  屏蔽小红书首页的信息流推荐内容，保持干净浏览体验
// @author       You
// @match        https://www.xiaohongshu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550359/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550359/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加 CSS 样式来隐藏信息流
    GM_addStyle(`
        /* 隐藏首页推荐流容器 */
        [id="exploreFeeds"] {
            display: none !important;
        }

    `);

    console.log('【小红书去信息流】脚本已注入，信息流已屏蔽');

})();