// ==UserScript==
// @name         Bilibili 自动网页全屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  打开视频页面后自动进入网页全屏模式，避免手动点击按钮。
// @author       j.garrick@live.com
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548053/Bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/548053/Bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 进入网页全屏的函数
    function enterWebFullScreen() {
        // 网页全屏按钮
        const btn = document.querySelector('.bpx-player-ctrl-web');
        if (btn && !btn.classList.contains('bpx-state-entered')) {
            btn.click();
            console.log('✅ 已自动进入网页全屏');
            return true;
        }
        return false;
    }

    // 先尝试一次
    if (!enterWebFullScreen()) {
        // 如果没找到，监听 DOM 变化
        const observer = new MutationObserver(() => {
            if (enterWebFullScreen()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
