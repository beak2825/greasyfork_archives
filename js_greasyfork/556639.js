// ==UserScript==
// @name         GGPT 勋章网格修复 (极简版)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  强制将GGPT勋章区域改为Grid布局，不包含复杂逻辑，防止报错
// @author       Fixed
// @match        https://www.gamegamept.com/userdetails.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556639/GGPT%20%E5%8B%8B%E7%AB%A0%E7%BD%91%E6%A0%BC%E4%BF%AE%E5%A4%8D%20%28%E6%9E%81%E7%AE%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556639/GGPT%20%E5%8B%8B%E7%AB%A0%E7%BD%91%E6%A0%BC%E4%BF%AE%E5%A4%8D%20%28%E6%9E%81%E7%AE%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 直接通过CSS强制修改布局，这是最不容易出错的方法
    // 使用 GM_addStyle 可以确保样式优先级最高，且不用手动操作 DOM 插入 style 标签
    const css = `
        /* 定位 #outer 下面的 form 下面的第一个 div (根据源码结构) */
        #outer > form > div {
            display: grid !important;
            /* 自动填充，每列最小88px，最大自适应 */
            grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)) !important;
            gap: 10px !important;
            justify-items: center !important;
            align-items: center !important;
            width: 100% !important;
            
            /* 覆盖原本的 Flex 属性 */
            flex-wrap: wrap !important;
            justify-content: unset !important;
        }

        /* 修正每一个勋章格子的样式 */
        #outer > form > div > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 5px !important;
            box-sizing: border-box !important;
        }

        /* 修正图片大小，防止撑开 */
        #outer > form > div > div img {
            max-width: 80px !important;
            max-height: 80px !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            transition: transform 0.2s;
        }

        /* 鼠标悬停放大效果 */
        #outer > form > div > div:hover img {
            transform: scale(1.1);
        }
    `;

    GM_addStyle(css);
    console.log("GGPT 极简版样式已注入");

})();