// ==UserScript==
// @name        FB 新版面
// @namespace   https://greasyfork.org/zh-TW/scripts/553388
// @version     0.9
// @description 隱藏右側欄/限時動態，並將動態牆寬度擴展到左側欄右邊的可用空間。
// @author      czh
// @match       https://www.facebook.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553388/FB%20%E6%96%B0%E7%89%88%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/553388/FB%20%E6%96%B0%E7%89%88%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------------------------------------------------------
    // 核心 CSS 樣式
    // ------------------------------------------------------------------
    let cssRules = `
        /* 1. 隱藏不必要的元素 (右側欄和限時動態) */
        .x1daaz14.x1t2pt76, /* 隱藏右側欄位 */
        footer, /* 隱藏 footer 廣告 */
        div[aria-label="前一張卡片"],/* 隱藏短片的上下按鈕 */
        div[aria-label="下一張卡片"],
        div[aria-label="限時動態"],/* 隱藏限時動態 (Stories) */
        .xwib8y2.x1y1aw1k.xwya9rg, /* 隱藏限動 */
        .xq1tmr.xvue9z>.x1yztbdb /* "你在想什麼?" 貼文區上方的多餘區塊 */
        {
            display: none !important;
        }

        /* 2. 佈局擴展 - 讓動態牆填滿寬度 */
        :is(body, html) > div,/* 針對頂級容器：移除可能限制整體寬度的 max-width */
        div[role="main"] > div, /* main 的直接父層容器 */
        .x193iq5w.xvue9z.x17zi3g0.x1ceravr.x1v0nzow, /* 動態、首頁中央容器 */
        div[role="feed"], /* 針對中央內容區塊 (動態牆 feed 的父容器) 進行擴展 */
        .x1mfogq2
        {
            width: 100% !important; /* 讓這個容器充分佔據寬度 */
            max-width: none !important;
            padding: 0 !important;
            flex-grow: 1 !important;
        }

        /* 3. 保留左側導覽欄並 (確保其功能正常，不被 width: 100% 影響) */
        div[role="navigation"] {
            position: sticky !important; /* 確保保持原有的粘性位置 */
            flex-shrink: 0 !important; /* 防止它被壓縮 */
        }
        div[aria-label="捷徑"]/* 修改寬度爲60px */
        {
       max-width: 60px;
       min-width: 60px;
       position: absolute;
       z-index: 1;
       }
    `;

    // ------------------------------------------------------------------
    // 注入 CSS
    // ------------------------------------------------------------------

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(cssRules);
    } else {
        const styleNode = document.createElement("style");
        styleNode.type = 'text/css';
        styleNode.id = 'fb-single-column-with-sidebar';
        styleNode.appendChild(document.createTextNode(cssRules));
        (document.head || document.documentElement).appendChild(styleNode);
    }

})();