// ==UserScript==
// @license MIT
// @name         视频网站空格键防翻页（B站+YouTube通用增强版）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  彻底屏蔽空格键翻页，精准控制B站和YouTube视频播放/暂停，修复输入框冲突。
// @author       ApriesL
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563382/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E7%A9%BA%E6%A0%BC%E9%94%AE%E9%98%B2%E7%BF%BB%E9%A1%B5%EF%BC%88B%E7%AB%99%2BYouTube%E9%80%9A%E7%94%A8%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563382/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E7%A9%BA%E6%A0%BC%E9%94%AE%E9%98%B2%E7%BF%BB%E9%A1%B5%EF%BC%88B%E7%AB%99%2BYouTube%E9%80%9A%E7%94%A8%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(e) {
        // 1. 判定空格键
        if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {

            const target = e.target;
            const tagName = target.tagName.toUpperCase();

            // 2. 输入框豁免检测 (避免文本框输入空格被屏蔽)
            if (tagName === 'INPUT' ||
                tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                return;
            }

            // 3. 核心拦截
            e.preventDefault();
            e.stopPropagation();

            // 4. 精确寻找视频元素 (Priority Search)
            // priority1：B站主播放器内的视频
            // priority2：YouTube主播放器内的视频
            // priority3：B站特殊加密视频标签 (bwp-video)
            // priority4：页面里任何可见的视频 (兜底方案)

            let video =
                document.querySelector('.bpx-player-video-wrap video') || // B站新版主播放器
                document.querySelector('.html5-main-video') ||            // YouTube主播放器
                document.querySelector('bwp-video') ||                    // B站旧版/特殊播放器
                document.querySelector('video');                          // 最后的通用尝试

            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    }, { capture: true });
})();