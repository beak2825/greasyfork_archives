// ==UserScript==
// @name         Steam 好友评测修复
// @namespace    https://steamcommunity.com/
// @version      1.1
// @description  自动修复 Steam 商店页面的好友评测 createdbyfriends 页的隐藏内容，并强制显示所有好友评测卡片。
// @match        https://store.steampowered.com/app/*/?*createdbyfriends*
// @match        https://steamcommunity.com/app/*/reviews*
// @match        https://steamcommunity.com/app/*/reviews/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556489/Steam%20%E5%A5%BD%E5%8F%8B%E8%AF%84%E6%B5%8B%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/556489/Steam%20%E5%A5%BD%E5%8F%8B%E8%AF%84%E6%B5%8B%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fixAndDisplayFriendsReviews() {
        const currentUrl = window.location.href;

        if (!currentUrl.includes('createdbyfriends')) {
            console.log('[FriendsReviewFix] 不是好友评测页面');
            return;
        }

        console.log('[FriendsReviewFix] 正在修复好友评测显示...');

        // 1. 强制显示主容器
        try {
            const init = document.querySelector('#apphub_InitialContent');
            if (init) init.style.display = 'block';
        } catch(e){}

        const existingCards = document.querySelectorAll('.apphub_Card');

        if (existingCards.length > 0) {
            console.log(`[FriendsReviewFix] 找到 ${existingCards.length} 篇好友评测`);

            // 强制显示卡片
            existingCards.forEach(card => {
                card.style.display = 'block';
            });

            // 修复容器结构
            const container = document.querySelector('.apphub_Cards');
            if (!container) {
                const newContainer = document.createElement('div');
                newContainer.className = 'apphub_Cards';
                const content = document.querySelector('#apphub_InitialContent');

                if (content) {
                    const page1 = content.querySelector('#page1');
                    if (page1) {
                        newContainer.innerHTML = page1.innerHTML;
                        const host = document.querySelector('.responsive_page_template_content');
                        if (host) host.appendChild(newContainer);
                    }
                }
            }


            console.log('[FriendsReviewFix] ✅ 好友评测修复完成！');
            return true;
        }

        console.log('[FriendsReviewFix] 未找到评测内容，尝试重新加载...');
        return false;
    }

    // 自动执行
    fixAndDisplayFriendsReviews();
})();
