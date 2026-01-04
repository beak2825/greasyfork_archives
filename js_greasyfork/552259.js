// ==UserScript==
// @name         Instagram Embed Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  強制載入 Instagram 嵌入區塊 (embed)
// @match        https://nishispo.nishinippon.co.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552259/Instagram%20Embed%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/552259/Instagram%20Embed%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 動態插入 Instagram embed.js
    function loadInstagramEmbed() {
        if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
            let s = document.createElement('script');
            s.src = "https://www.instagram.com/embed.js";
            s.async = true;
            document.body.appendChild(s);
        } else {
            if (window.instgrm && window.instgrm.Embeds) {
                window.instgrm.Embeds.process();
            }
        }
    }

    // 頁面載入後執行
    window.addEventListener('load', () => {
        loadInstagramEmbed();

        // 監聽 DOM 變化，確保動態載入的區塊也能渲染
        const observer = new MutationObserver(() => {
            if (window.instgrm && window.instgrm.Embeds) {
                window.instgrm.Embeds.process();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
