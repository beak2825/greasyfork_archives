// ==UserScript==
// @name         Facebook - 從蜥蜴人老媽墳墓找回所有留言
// @name:en      Facebook - Auto-Switch to All Comments
// @name:ja      Facebook - すべてのコメントに自動切り替え
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  支援多種臉書貼文格式，優先切換至「所有留言」，若無則選「最新」
// @description:en  Automatically changes Facebook comment sorting from "Most Relevant" to "All Comments"
// @description:ja  Facebook 全てのコメントに自動切り替え - 「最も関連性の高い」を回避
// @author       Gemini
// @match        https://www.facebook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560373/Facebook%20-%20%E5%BE%9E%E8%9C%A5%E8%9C%B4%E4%BA%BA%E8%80%81%E5%AA%BD%E5%A2%B3%E5%A2%93%E6%89%BE%E5%9B%9E%E6%89%80%E6%9C%89%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/560373/Facebook%20-%20%E5%BE%9E%E8%9C%A5%E8%9C%B4%E4%BA%BA%E8%80%81%E5%AA%BD%E5%A2%B3%E5%A2%93%E6%89%BE%E5%9B%9E%E6%89%80%E6%9C%89%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 排除已經處理過的按鈕，避免重複觸發
    const PROCESSED_TAG = 'data-auto-sorted';

    function triggerSort() {
        // 1. 尋找排序按鈕
        // 臉書的按鈕可能包含「最相關」、「排序依據」、「最新」、「由新到舊」等字樣
        const sortButtons = Array.from(document.querySelectorAll('div[role="button"]')).filter(btn => {
            const text = btn.innerText;
            return (text.includes("最相關") || text.includes("排序依據") || text.includes("Most relevant")) &&
                   !btn.hasAttribute(PROCESSED_TAG);
        });

        sortButtons.forEach(btn => {
            btn.setAttribute(PROCESSED_TAG, 'true'); // 標記已處理
            btn.click();

            // 2. 尋找選單選項 (設定優先級)
            let found = false;
            let attempts = 0;

            const checkMenu = setInterval(() => {
                const items = Array.from(document.querySelectorAll('div[role="menuitem"], div[role="listitem"], span'));

                // 優先級 1: 所有留言 (All Comments)
                const allComments = items.find(i => i.innerText === "所有留言" || i.innerText === "All comments");
                // 優先級 2: 最新 / 由新到舊 (Newest)
                const newest = items.find(i => i.innerText.includes("最新") || i.innerText.includes("由新到舊") || i.innerText.includes("Newest"));

                if (allComments) {
                    allComments.click();
                    console.log("腳本：已切換為 [所有留言]");
                    found = true;
                } else if (newest) {
                    newest.click();
                    console.log("腳本：找不到所有留言，已切換為 [最新]");
                    found = true;
                }

                attempts++;
                if (found || attempts > 15) {
                    clearInterval(checkMenu);
                    // 如果點開了但沒找到目標，按一下 Esc 或點擊其他地方關閉選單 (選配)
                    if (!found) {
                         console.log("腳本：未發現可切換選項");
                         document.body.click();
                    }
                }
            }, 100);
        });
    }

    // 使用 MutationObserver 監控動態載入的貼文
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                triggerSort();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始執行一次
    triggerSort();
})();