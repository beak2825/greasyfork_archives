// ==UserScript==
// @name         阻擋 ps4id.cloud 點擊下載時強制廣告彈出並隱藏假下載按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻擋點擊 Download 時的廣告彈出，只開正常連結；隱藏廣告假按鈕
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://ps4id.cloud/*
// @match        https://link.ps4id.cloud/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550899/%E9%98%BB%E6%93%8B%20ps4idcloud%20%E9%BB%9E%E6%93%8A%E4%B8%8B%E8%BC%89%E6%99%82%E5%BC%B7%E5%88%B6%E5%BB%A3%E5%91%8A%E5%BD%88%E5%87%BA%E4%B8%A6%E9%9A%B1%E8%97%8F%E5%81%87%E4%B8%8B%E8%BC%89%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550899/%E9%98%BB%E6%93%8B%20ps4idcloud%20%E9%BB%9E%E6%93%8A%E4%B8%8B%E8%BC%89%E6%99%82%E5%BC%B7%E5%88%B6%E5%BB%A3%E5%91%8A%E5%BD%88%E5%87%BA%E4%B8%A6%E9%9A%B1%E8%97%8F%E5%81%87%E4%B8%8B%E8%BC%89%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 攔截 poplink 點擊，防止廣告彈出
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('poplink')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            window.open(e.target.href, '_blank');
        }
    }, true);

    // 隱藏 uploadquick.link 按鈕（使用 MutationObserver 監聽動態變化）
    const hideUploadQuick = () => {
        document.querySelectorAll('a[href*="uploadquick.link"]').forEach(el => {
            el.style.display = 'none';
        });
    };
    hideUploadQuick();  // 立即隱藏
    const observer = new MutationObserver(hideUploadQuick);
    observer.observe(document.body, { childList: true, subtree: true });  // 監聽 body 變化
})();