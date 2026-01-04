// ==UserScript==
// @name         移除 YouTube Premium 彈跳視窗與遮罩
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動移除 YouTube Premium 推銷彈窗與背景遮罩
// @match        *://*.youtube.com/*
// @author       issac
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551489/%E7%A7%BB%E9%99%A4%20YouTube%20Premium%20%E5%BD%88%E8%B7%B3%E8%A6%96%E7%AA%97%E8%88%87%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/551489/%E7%A7%BB%E9%99%A4%20YouTube%20Premium%20%E5%BD%88%E8%B7%B3%E8%A6%96%E7%AA%97%E8%88%87%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePopupsAndBackdrop() {
        // 移除 Premium 彈窗
        document.querySelectorAll('.yt-spec-dialog-layout__dialog-layout-container').forEach(popup => {
            popup.remove();
            console.log('✅ 已移除 Premium 彈窗');
        });

        // 移除背景遮罩
        document.querySelectorAll('tp-yt-iron-overlay-backdrop.opened').forEach(backdrop => {
            backdrop.remove();
            console.log('✅ 已移除背景遮罩');
        });
    }

    // 頁面初始移除一次
    removePopupsAndBackdrop();

    // 監聽 DOM 變化，持續移除
    const observer = new MutationObserver(removePopupsAndBackdrop);
    observer.observe(document.body, { childList: true, subtree: true });
})();
