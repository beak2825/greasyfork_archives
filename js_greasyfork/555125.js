// ==UserScript==
// @name         VNDB跳转Hitomi查看CG
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在VNDB游戏页面标题后添加Hitomi搜索链接（标题末尾）
// @author       You
// @match        https://vndb.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555125/VNDB%E8%B7%B3%E8%BD%ACHitomi%E6%9F%A5%E7%9C%8BCG.user.js
// @updateURL https://update.greasyfork.org/scripts/555125/VNDB%E8%B7%B3%E8%BD%ACHitomi%E6%9F%A5%E7%9C%8BCG.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addHitomiLink() {
        // 1. 优先 ja 标题
        let target = document.querySelector('h2.alttitle[lang="ja"]');

        // 2. 没有 ja 标题就 fallback 到 h1[lang="ja-Latn"]
        if (!target) {
            target = document.querySelector('h1[lang="ja-Latn"]');
        }

        if (!target) return;          // 两个都没有就退出

        const title = target.textContent.trim();
        if (!title) return;           // 标题为空也退出

        const searchUrl = 'https://hitomi.la/search.html?' + encodeURIComponent(title);

        const link = document.createElement('a');
        link.href = searchUrl;
        link.textContent = ' [Hitomi]';
        link.target = '_blank';
        link.style.color = '#0066cc';
        link.style.textDecoration = 'none';

        target.appendChild(link);     // 直接挂在标题末尾
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addHitomiLink);
    } else {
        addHitomiLink();
    }
})();