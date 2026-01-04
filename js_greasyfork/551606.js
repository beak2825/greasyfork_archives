// ==UserScript==
// @name         你藏起的媽被我發現了
// @namespace    https://18comic.vip/
// @version      1.1
// @description  自動點擊「我還是想看」以顯示所有評論內容。
// @match        *://18comic.vip/*
// @match        *://18comic.org/*
// @match        *://18comic.cc/*
// @match        *://18comic1.one/*
// @match        *://18comic2.one/*
// @icon         https://18comic.vip/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551606/%E4%BD%A0%E8%97%8F%E8%B5%B7%E7%9A%84%E5%AA%BD%E8%A2%AB%E6%88%91%E7%99%BC%E7%8F%BE%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/551606/%E4%BD%A0%E8%97%8F%E8%B5%B7%E7%9A%84%E5%AA%BD%E8%A2%AB%E6%88%91%E7%99%BC%E7%8F%BE%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 展开“我還是想看”按钮的评论 */
    function clickAllSpoilerButtons() {
        const buttons = document.querySelectorAll('.disclose a');
        let count = 0;

        buttons.forEach(btn => {
            const timelineContent = btn.parentElement.nextElementSibling;
            if (timelineContent && timelineContent.style.display === 'none') {
                btn.click();
                count++;
            }
        });

        if (count > 0) {
            console.log(`[18comic腳本] 已自動展開 ${count} 條評論`);
        }
    }

    /** 点击“查看更多”按钮加载更多评论 */
    function clickLoadMore() {
        // 匹配所有“查看更多”按钮
        const loadMoreBtns = document.querySelectorAll('a.btn.btn-primary.navbar-btn');

        loadMoreBtns.forEach(btn => {
            if (btn.innerText.includes('查看更多') && btn.offsetParent !== null) {
                btn.click();
                console.log('[18comic腳本] 自動點擊：查看更多評論');
            }
        });
    }

    /** 监听页面滚动到底部 */
    function setupAutoScrollLoader() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // 当滚动接近底部 200px 时触发
            if (scrollTop + windowHeight >= docHeight - 200) {
                clickLoadMore();
            }
        });
    }

    // 页面初次载入后执行
    clickAllSpoilerButtons();
    setupAutoScrollLoader();

    // 监听 DOM 动态变化（新评论加载时）
    const observer = new MutationObserver(() => {
        clickAllSpoilerButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();