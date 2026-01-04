// ==UserScript==
// @name         YouTube Clean Links
// @namespace    
// @version      1.0
// @description  YouTubeの動画リンクから不要なパラメータを除去する
// @author       Smo920
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560264/YouTube%20Clean%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/560264/YouTube%20Clean%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cleanLink = (url) => {
        try {
            const u = new URL(url);
            if (u.hostname !== 'www.youtube.com') return url;
            if (u.pathname !== '/watch') return url;

            // vだけ残して他のクエリは消す
            const videoId = u.searchParams.get('v');
            return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
        } catch (e) {
            return url;
        }
    };

    const processLinks = () => {
        const links = document.querySelectorAll('a[href*="/watch"]');
        for (const link of links) {
            const clean = cleanLink(link.href);
            if (link.href !== clean) {
                link.href = clean;
            }
        }
    };

    // 初回実行
    processLinks();

    // 動的に追加されたリンクにも対応（YouTubeはSPAなので）
    const observer = new MutationObserver(() => {
        processLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
