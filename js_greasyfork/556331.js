// ==UserScript==
// @name         推特/Twitter/x.com 愛心/按讚和轉推按鈕更大顆
// @namespace    https://twitter.com/
// @version      1.3
// @description  Enlarge the Like button on Twitter/X
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556331/%E6%8E%A8%E7%89%B9Twitterxcom%20%E6%84%9B%E5%BF%83%E6%8C%89%E8%AE%9A%E5%92%8C%E8%BD%89%E6%8E%A8%E6%8C%89%E9%88%95%E6%9B%B4%E5%A4%A7%E9%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/556331/%E6%8E%A8%E7%89%B9Twitterxcom%20%E6%84%9B%E5%BF%83%E6%8C%89%E8%AE%9A%E5%92%8C%E8%BD%89%E6%8E%A8%E6%8C%89%E9%88%95%E6%9B%B4%E5%A4%A7%E9%A1%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyle() {
        // 防止重複注入
        if (document.getElementById('bigger-buttons-style')) return;

        const style = document.createElement("style");
        style.id = 'bigger-buttons-style';
        style.textContent = `
            /* 放大按鈕設定
               包含：愛心 (Like/Unlike) 與 轉發 (Retweet/Unretweet)
            */
            [data-testid="like"],
            [data-testid="unlike"],
            [data-testid="retweet"],
            [data-testid="unretweet"],
            [aria-label="Like"],
            [aria-label="Unlike"],
            [aria-label="Retweet"],
            [aria-label="Repost"] {
                transform: scale(1.6) !important; /* 想要更大可以改這個數字 */
                transform-origin: center center !important;
                transition: transform 0.2s ease; /* 加一點動畫讓它更順滑 */
            }

            /* 滑鼠懸停時可以再稍微大一點 (選用) */
            [data-testid="like"]:hover,
            [data-testid="retweet"]:hover {
                transform: scale(1.7) !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[UserScript] Bigger Like & Retweet buttons style injected.');
    }

    addStyle();

    // 監控 DOM 變化，確保切換頁面時樣式仍然有效
    const observer = new MutationObserver(() => {
        addStyle();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();