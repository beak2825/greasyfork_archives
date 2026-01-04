// ==UserScript==
// @name         哔哩哔哩自动开启AI字幕
// @description  自动检测并开启页面中的AI字幕（中文），支持切换合集视频时重新触发检测
// @author       魅影Mazo
// @match        *://*/*
// @grant        none
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @version 0.0.1.20251101114210
// @namespace https://greasyfork.org/users/1532921
// @downloadURL https://update.greasyfork.org/scripts/554408/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AFAI%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/554408/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AFAI%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 开启字幕的核心函数
    function turnOnSubtitle() {
        const subtitleButton = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
        if (subtitleButton) {
            subtitleButton.click();
            return true;
        }
        return false;
    }

    // 初始检查并开启字幕
    let checkInterval = setInterval(() => {
        if (turnOnSubtitle()) {
            clearInterval(checkInterval);
        }
    }, 500);

    // 监听URL变化（处理单页应用路由切换）
    let lastUrl = location.href;
    const urlChangeHandler = () => {
        // URL发生变化时重新开始检查字幕按钮
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            // 清除之前的定时器，重新开始检查
            clearInterval(checkInterval);
            checkInterval = setInterval(() => {
                if (turnOnSubtitle()) {
                    clearInterval(checkInterval);
                }
            }, 500);
        }
    };

    // 监听历史记录变化
    window.addEventListener('popstate', urlChangeHandler);

    // 监听document变化以捕获pushState/replaceState导致的URL变化
    const observer = new MutationObserver(urlChangeHandler);
    observer.observe(document, {
        subtree: true,
        childList: true
    });

})();