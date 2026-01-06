// ==UserScript==
// @name         91nt.com 广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽91nt.com网站的广告、弹窗、遮罩和干扰元素，提升浏览体验。
// @author       YourName
// @match        *://*.91nt.com/*
// @match        *://91nt.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561589/91ntcom%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561589/91ntcom%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常见广告选择器（根据站点常见类名和结构）
    const adSelectors = [
        '.ad', '[class*="ad"]', '[id*="ad"]',
        '.advert', '[class*="advert"]',
        '.popup', '.pop-up', '.overlay',
        'iframe[src*="ads"]', 'iframe[src*="advert"]',
        '.mask', '.modal', '.close-btn', // 遮罩和关闭按钮相关
        '[class*="banner"]', '[id*="banner"]',
        '.promotion', '.sponsor'
    ];

    // 隐藏广告函数
    function hideAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                el.remove();
            });
        });
    }

    // 使用 MutationObserver 动态监控页面变化（广告常延迟加载）
    const observer = new MutationObserver(() => {
        hideAds();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后初始执行
    window.addEventListener('load', hideAds);

    // 初始立即执行（document-start）
    hideAds();
})();