// ==UserScript==
// @name         YouTube Clean Feed & Sidebar (No Distraction)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  主页屏蔽#contents，播放页屏蔽推荐列表，互不干扰
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562600/YouTube%20Clean%20Feed%20%20Sidebar%20%28No%20Distraction%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562600/YouTube%20Clean%20Feed%20%20Sidebar%20%28No%20Distraction%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
      原理说明：
      1. YouTube 主页 (Home) 的父级标签是 ytd-browse[page-subtype="home"]
      2. YouTube 播放页 (Watch) 的父级标签是 ytd-watch-flexy
      通过 CSS 父级选择器限制范围，可以完美避免误伤。
    */

    const css = `
        /* ==================================================
           1. 针对视频播放页 (Watch Page)
           屏蔽右侧/下方的推荐列表 (#items > ytd-item-section-renderer)
           ================================================== */
        ytd-watch-flexy #secondary #items {
            display: none !important;
        }

        /* 如果你希望把整个侧边栏区域都隐藏（包括上面的广告位等），可以用下面这句代替上面那句： */
        /* ytd-watch-flexy #secondary { display: none !important; } */


        /* ==================================================
           2. 针对主页 (Home Page)
           屏蔽主页的视频流 (#contents)，但保留左侧导航栏
           ================================================== */
        ytd-browse[page-subtype="home"] #primary {
            display: none !important;
        }

        /* 补充：为了防止某些情况下 #contents 直接暴露在 browse 下，
           双重保险屏蔽 home 页下的特定 contents，
           这不会影响 Watch 页面的 contents，因为 Watch 页面没有 ytd-browse 标签 */
        ytd-browse[page-subtype="home"] #contents {
            display: none !important;
        }
    `;

    // 注入 CSS
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

})();