// ==UserScript==
// @name         B站主页清爽插件 (只留搜索)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽B站主页所有推荐内容，只保留导航栏和搜索框
// @author       Gemini
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559705/B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%88%BD%E6%8F%92%E4%BB%B6%20%28%E5%8F%AA%E7%95%99%E6%90%9C%E7%B4%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559705/B%E7%AB%99%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%88%BD%E6%8F%92%E4%BB%B6%20%28%E5%8F%AA%E7%95%99%E6%90%9C%E7%B4%A2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 CSS 直接隐藏主页内容，防止页面闪烁
    const style = document.createElement('style');
    style.innerHTML = `
        /* 隐藏主要的推荐容器 */
        .bili-layout,
        .i_debug,
        .feed-card,
        .recommended-container_floor-aside,
        #i_ce_notification,
        .bili-grid {
            display: none !important;
        }

        /* 确保背景保持简洁 */
        body {
            background-color: #f1f2f3 !important;
        }

        /* 如果你希望完全空白，只留顶栏，可以取消下面这行的注释 */
        /* main.bili-layout { visibility: hidden !important; } */
    `;
    document.head.appendChild(style);

    // 循环检查并移除可能动态加载的元素
    const timer = setInterval(() => {
        const mainContent = document.querySelector('.bili-layout');
        if (mainContent) {
            mainContent.innerHTML = ""; // 清空主页内容
            // 如果你连底部的页脚也不想要，可以解开下面这行
            // document.querySelector('.international-footer')?.remove();
        }
    }, 100);

    // 5秒后停止检查以节省性能
    setTimeout(() => clearInterval(timer), 5000);
})();