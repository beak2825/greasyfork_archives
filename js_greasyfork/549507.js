// ==UserScript==
// @name         禁止手机端单击视频暂停
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  阻止单击视频画面触发暂停/播放，避免误触，保留控制栏按钮功能
// @author       你
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549507/%E7%A6%81%E6%AD%A2%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%8D%95%E5%87%BB%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/549507/%E7%A6%81%E6%AD%A2%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%8D%95%E5%87%BB%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disableClickPause(video) {
        // 阻止点击触发 play/pause
        video.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, true);
    }

    function init() {
        document.querySelectorAll('video').forEach(v => {
            disableClickPause(v);
        });
    }

    // 页面初次加载
    init();

    // 监听页面动态加载的视频
    const observer = new MutationObserver(() => {
        init();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();