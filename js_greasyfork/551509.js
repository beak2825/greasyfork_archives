// ==UserScript==
// @name         哔哩哔哩自动打开中文字幕
// @version      2025-10-04
// @description  bilibili b站 哔哩哔哩 播放视频时自动打开中文字幕
// @author       B友
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/users/1522053
// @downloadURL https://update.greasyfork.org/scripts/551509/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551509/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 只打开一次。用户可以手动关闭字幕。
    var tryTurnOnSubtitle = setInterval(() => {
        const subtitleButton = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
        if (subtitleButton) {
            subtitleButton.click();
            clearInterval(tryTurnOnSubtitle);
        }
    }, 500);

})();
