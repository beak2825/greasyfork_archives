// ==UserScript==
// @name         Bilibili 已看视频高亮/隐藏
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  已访问过的视频隐藏或变色（首页 + 搜索结果）
// @author       Jifu
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://space.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         https://images.megabit.co.nz/images/uploads/2025-09-02_052220_913.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548049/Bilibili%20%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E9%AB%98%E4%BA%AE%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/548049/Bilibili%20%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E9%AB%98%E4%BA%AE%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'bili_visited_videos';
    let visited = GM_getValue(STORAGE_KEY, []);

    GM_addStyle(`
        .visited-video {
            color: black !important;
            opacity: 0.1 !important;
        }
    `);

    function getVideoId(url) {
        const bvMatch = url.match(/\/video\/(BV\w+)/);
        if (bvMatch) return bvMatch[1];
        const avMatch = url.match(/\/video\/av(\d+)/);
        if (avMatch) return 'av' + avMatch[1];
        return null;
    }

    function markVideos() {
        document.querySelectorAll('a[href*="/video/"]').forEach(a => {
            const vid = getVideoId(a.href);
            if (!vid) return;

            // 点击时记录
            if (!a.dataset.listened) {
                a.addEventListener('click', () => {
                    if (!visited.includes(vid)) {
                        visited.push(vid);
                        GM_setValue(STORAGE_KEY, visited);
                    }
                });
                a.dataset.listened = "1";
            }

            // 如果已访问则加样式
            if (visited.includes(vid)) {
                a.classList.add('visited-video');
            }
        });
    }

    const observer = new MutationObserver(markVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    markVideos();
})();
