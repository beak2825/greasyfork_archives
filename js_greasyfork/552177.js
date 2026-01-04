// ==UserScript==
// @name         哔哩哔哩单曲循环增强版
// @namespace    https://bilibili.com/
// @version      1.5
// @description  给B站视频添加单曲循环功能（带开关、记忆设置）
// @author       corallibra
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552177/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552177/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行，等待视频加载完成
    function waitForVideo() {
        const video = document.querySelector('video');
        if (!video) {
            setTimeout(waitForVideo, 1000);
            return;
        }
        initLoopFeature(video);
    }

    function initLoopFeature(video) {
        // 读取保存的状态
        let loopEnabled = GM_getValue('bilibili_loop_enabled', false);
        video.loop = loopEnabled;

        // 创建按钮
        const btn = document.createElement('div');
        btn.innerText = loopEnabled ? '🔁 单曲循环开' : '🔁 单曲循环关';
        btn.style.position = 'absolute';
        btn.style.bottom = '90px';
        btn.style.right = '20px';
        btn.style.background = 'rgba(0, 0, 0, 0.5)';
        btn.style.color = '#fff';
        btn.style.padding = '6px 12px';
        btn.style.borderRadius = '8px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '9999';
        btn.style.userSelect = 'none';
        btn.style.transition = '0.2s';

        // 悬停样式
        btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,0,0,0.7)');
        btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,0,0,0.5)');

        // 切换功能
        btn.addEventListener('click', () => {
            loopEnabled = !loopEnabled;
            video.loop = loopEnabled;
            GM_setValue('bilibili_loop_enabled', loopEnabled);
            btn.innerText = loopEnabled ? '🔁 单曲循环开' : '🔁 单曲循环关';
        });

        // 插入按钮到播放器容器
        const container = document.querySelector('.bpx-player-container') || document.body;
        container.appendChild(btn);

        // 当播放结束时，如果未使用 video.loop 属性，也可手动重播
        video.addEventListener('ended', () => {
            if (loopEnabled && !video.loop) {
                video.currentTime = 0;
                video.play();
            }
        });
    }

    waitForVideo();
})();
