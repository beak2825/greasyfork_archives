// ==UserScript==
// @name        bilibili t键网页全屏
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/4/2025, 11:37:44 PM
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/551831/bilibili%20t%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/551831/bilibili%20t%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘按键
    document.addEventListener('keydown', function(e) {
        // 判断按下的是 "T" 键（不区分大小写）
        if (e.key.toLowerCase() === 't') {
            let webFullBtn = document.querySelector('.bpx-player-ctrl-web');
            if (webFullBtn) {
                webFullBtn.click();
            }
        }
    });
})();