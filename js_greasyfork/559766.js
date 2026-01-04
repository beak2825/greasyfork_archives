// ==UserScript==
// @name         Plex 侧边栏宽度调整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将 Plex 网页版侧边栏 min-width 改为 140px
// @author       Gemini
// @match        *://*/web/*
// @match        *://*:32400/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559766/Plex%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/559766/Plex%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 CSS 注入，通过通配符匹配那些包含特定前缀的类名
    const css = `
        /* 调整最外层侧边栏容器宽度 */
        div[class*="SourceSidebar-sidebar"] {
            min-width: 140px !important;
            width: 140px !important;
        }

        /* 调整内部窗格宽度 */
        div[class*="SourceSidebar-pane"] {
            width: 140px !important;
        }

        /* 确保文字不会撑开容器，并自动显示省略号 */
        div[class*="SourceSidebarLink-title"] {
            max-width: 70px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        /* 隐藏库操作的三个点按钮，防止重叠（可选，如果觉得太挤可以保留） */
        /*
        span[class*="SourceSidebarItem-actionContainer"] {
            display: none !important;
        }
        */
    `;

    GM_addStyle(css);
})();