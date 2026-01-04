// ==UserScript==
// @name         Bilibili 首页屏蔽“X万点赞”视频卡片（可能留白）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 bilibili.com 删除含有“万点赞”的视频卡片
// @author       UserT
// @match        https://www.bilibili.com/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/557175/Bilibili%20%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E2%80%9CX%E4%B8%87%E7%82%B9%E8%B5%9E%E2%80%9D%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%EF%BC%88%E5%8F%AF%E8%83%BD%E7%95%99%E7%99%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557175/Bilibili%20%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E2%80%9CX%E4%B8%87%E7%82%B9%E8%B5%9E%E2%80%9D%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%EF%BC%88%E5%8F%AF%E8%83%BD%E7%95%99%E7%99%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除逻辑函数
    function removeCards() {
        document.querySelectorAll('.bili-video-card__wrap').forEach(card => {
            const infoText = card.querySelector('.bili-video-card__info--icon-text');
            if (infoText && infoText.textContent.includes('万点赞')) {
                card.remove(); 
            }
        });
    }

    // 初始执行一次
    removeCards();

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
        removeCards();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
