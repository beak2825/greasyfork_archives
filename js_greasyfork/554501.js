// ==UserScript==
// @name         ChatGPT Mail 去广告优化
// @namespace    https://mail.chatgpt.org.uk/
// @version      1.0.0
// @description  隐藏 mail.chatgpt.org.uk 上的广告区域（header、google-auto-placed、grippy-host、aswift_3_host、aswift_4_host）
// @author       h7ml<h7ml@qq.com>
// @match        https://mail.chatgpt.org.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554501/ChatGPT%20Mail%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554501/ChatGPT%20Mail%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 所有需要隐藏的元素选择器
    const selectors = [
        'div.header',
        'div.google-auto-placed',
        'div.grippy-host',
        '#aswift_3_host',
        '#aswift_4_host'
    ];

    // 隐藏函数
    function hideAds() {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.margin = '0';
                el.style.padding = '0';
            });
        });
    }

    // 初次执行
    hideAds();

    // 监听页面变化（广告异步加载时也能屏蔽）
    const observer = new MutationObserver(() => hideAds());
    observer.observe(document.body, { childList: true, subtree: true });
})();
