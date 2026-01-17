// ==UserScript==
// @name         YouTubeからYouTubeショートの部分を非表示にするやつ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一覧から非表示にする。直打ちなら見れる
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562883/YouTube%E3%81%8B%E3%82%89YouTube%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%81%AE%E9%83%A8%E5%88%86%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/562883/YouTube%E3%81%8B%E3%82%89YouTube%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%81%AE%E9%83%A8%E5%88%86%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selectors = [
        "#contents > ytd-reel-shelf-renderer",
        "#dismissible",
        "#items > ytd-reel-shelf-renderer"
    ];

    function removeTargets() {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    }

    removeTargets();

    const observer = new MutationObserver(() => {
        removeTargets();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();