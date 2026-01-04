// ==UserScript==
// @name         网页全宽适配
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  宽屏下强制拉伸常见div容器
// @author       monsm
// @match        *://*.doubao.com/*
// @match        *://*.grok.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561122/%E7%BD%91%E9%A1%B5%E5%85%A8%E5%AE%BD%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/561122/%E7%BD%91%E9%A1%B5%E5%85%A8%E5%AE%BD%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        @media screen and (min-width: 1440px) {
            html, body {
                width: 100% !important;
                min-width: 0 !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            div.container, div.container-fluid,
            div.wrapper, div.content, div#content,
            div.main, div.article, div.main-content,
            div.page-content, div.post-content,
            div[class*="container"], div[class*="wrapper"],
            div[class*="content"], div[class*="main"],
            div.row {
                max-width: none !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding-left: 1% !important;
                padding-right: 1% !important;
                box-sizing: border-box !important;
            }

            div.row {
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
        }
    `);
})();