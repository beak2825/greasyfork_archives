// ==UserScript==
// @name         YouTube 移除會員專屬與會員優先影片
// @version      4.1
// @description  自動在 /videos 頁面移除 YouTube 頻道中的會員專屬或會員優先（搶先看）影片，支援YouTube SPA架構（不需手動重整）。包含空白格、空content或Members only / Early access徽章影片。
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @namespace https://github.com/yourname
// @downloadURL https://update.greasyfork.org/scripts/551956/YouTube%20%E7%A7%BB%E9%99%A4%E6%9C%83%E5%93%A1%E5%B0%88%E5%B1%AC%E8%88%87%E6%9C%83%E5%93%A1%E5%84%AA%E5%85%88%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/551956/YouTube%20%E7%A7%BB%E9%99%A4%E6%9C%83%E5%93%A1%E5%B0%88%E5%B1%AC%E8%88%87%E6%9C%83%E5%93%A1%E5%84%AA%E5%85%88%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------- 移除會員影片主功能 -----------
    function removeMemberOnly() {
        const items = document.querySelectorAll('ytd-rich-item-renderer');
        if (!items.length) return;

        items.forEach(item => {
            const content = item.querySelector('#content');
            const hasMedia = item.querySelector('ytd-rich-grid-media');
            const isEmpty = !hasMedia || (content && content.children.length === 0);

            // 找出徽章與文字
            const hasBadge = item.querySelector('#badge-style-type-members-only, #badge-style-type-premium, yt-badge-shape');
            const text = item.innerText;

            // 🔍 加強版關鍵字比對
            const isMemberVideo = /會員專屬|Members only|會員限定|Members exclusive/i.test(text);
            const isEarlyAccess = /會員優先|搶先看|Early access|Members early access|Premier for members/i.test(text);

            if (isEmpty || hasBadge || isMemberVideo || isEarlyAccess) {
                console.log('🧹 移除會員影片：', item.querySelector('#video-title')?.innerText || '(空內容)');
                item.remove();
            }
        });
    }

    // ----------- 啟動監聽器 -----------
    function startObserver() {
        if (window._yt_member_removal_active) return;
        window._yt_member_removal_active = true;

        const observer = new MutationObserver(() => {
            if (location.pathname.endsWith('/videos')) {
                removeMemberOnly();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        console.log('👀 會員影片清理監聽已啟動');
    }

    // ----------- 檢測頁面變化（支援 YouTube SPA） -----------
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (location.pathname.endsWith('/videos')) {
                console.log('📺 偵測到進入 /videos 頁面，開始清理會員影片');
                removeMemberOnly();
                startObserver();
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    // ----------- 初次執行（若直接進入 /videos 頁） -----------
    if (location.pathname.endsWith('/videos')) {
        console.log('📺 初次載入 /videos 頁面，執行清理');
        removeMemberOnly();
        startObserver();
    }
})();
