// ==UserScript==
// @name         哔哩哔哩自动打开中文字幕
// @version      2025-10-08
// @description  bilibili b站视频播放时自动打开中文字幕，即使自动播放下一个视频也能生效。
// @author       momo
// @license MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico

// @namespace https://greasyfork.org/users/1480782
// @downloadURL https://update.greasyfork.org/scripts/551912/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551912/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function turnOnSubtitle() {
        const interval = setInterval(() => {
            const subtitleButton = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
            if (subtitleButton) {
                subtitleButton.click();
                console.log('[字幕助手] 已自动打开中文字幕');
                clearInterval(interval);
            }
        }, 500);
        // 5 秒后放弃
        setTimeout(() => clearInterval(interval), 5000);
    }

    // 初次运行
    turnOnSubtitle();

    // 检测页面 URL 变化（用于自动播放下一个视频）
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[字幕助手] 检测到视频切换，重新尝试打开字幕');
            turnOnSubtitle();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
