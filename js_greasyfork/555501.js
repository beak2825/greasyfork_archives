// ==UserScript==
// @name         publink-ai-beautify
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description ai 样式美化
// @author       huangbc
// @license      MIT
// @include      *://*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555501/publink-ai-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/555501/publink-ai-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('openai-beautify')
     // 使用 GM_addStyle 添加样式
    GM_addStyle(`
        .gds-label-m-alt,
        #titleAdContainer,
        #thread-bottom-container .text-token-text-secondary .pointer-events-auto,
        .cmp-vip-state-icon.cmp-common-state-icon,
        .wj-entrance-btn,
        [aria-label="Trending"],
        a[href="/affiliate-program"],
        #crisp-chatbox-button,
        .upgradeButton,
        .slick-list,
        .vip-btn.rh-button,
        .pc-header .ant-carousel.carousel-wrap,
        .incentive-wrap,
        .wx-qr-code-wrap-wrap,
        .temp-gallery-list {
           display: none !important;
        }
        /* 添加更多自定义样式 */
    `);
    
    // 监听 DOM 变化，确保样式应用到动态加载的元素
    const observer = new MutationObserver(function() {
        // 可以在这里重新应用样式或处理动态元素
    });
    
    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });

function remove() {
 const wechatLinks = document.querySelector('.wechat-toc-footer-links');
 if (wechatLinks) {
    wechatLinks.style.display = "none";
 }
}

// 从 0 秒开始，每隔 100ms 执行一次 remove 函数
let times = [0]

for (let i = 0; i < 1000; i++) {
  times.push(i * 100);
}

times.forEach((time) => {
  setTimeout(remove, time);
})

setInterval(remove, 2000);

remove();


    // Your code here...
})();