// ==UserScript==
// @name         移除微博顶栏视频按钮
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  隐藏网页微博顶栏视频按钮
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552922/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E9%A1%B6%E6%A0%8F%E8%A7%86%E9%A2%91%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/552922/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E9%A1%B6%E6%A0%8F%E8%A7%86%E9%A2%91%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        a[href="/tv"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function hideHotLinks() {
        document.querySelectorAll('a[href="/tv"]').forEach(link => {
            link.style.display = 'none';
            link.style.visibility = 'hidden';
        });
    }

    // 立即执行 + 监听DOM变化
    const observer = new MutationObserver(hideHotLinks);
    observer.observe(document, { childList: true, subtree: true });
    
    setInterval(hideHotLinks, 1000);
    hideHotLinks();

    console.log('[Tampermonkey] 移除微博顶栏视频按钮 已加载');
})();