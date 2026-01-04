// ==UserScript==
// @name         江苏省高校教师岗前培训-自动播放
// @namespace    http://your-namespace-here.com/
// @version      0.2
// @description  自动播放、5倍速、播完自动切换下一个视频
// @author       cdf5 (modified by Gemini)
// @match        http://jsgs.study.gspxonline.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553428/%E6%B1%9F%E8%8B%8F%E7%9C%81%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/553428/%E6%B1%9F%E8%8B%8F%E7%9C%81%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var videoList = []; // 用来保存课程视频列表项

    // 初始化获取所有未完成的课程项
    // [BugFix 1] 修改了类名选择器，根据 txt 文件，未完成的 class 为 'round' 。保留 'half' 以防万一。
    const initializeVideoList = function() {
        videoList = Array.from(document.querySelectorAll('li .learn-status'))
                         .filter(item => item.classList.contains('round') || item.classList.contains('half')) // 只选择未完成(round)或者学习中(half)的课程
                         .map(item => item.closest('li')); // 获取课程列表项

        console.log('未完成课程列表:', videoList.length, '项未完成课程');
    };

    // 播放当前课程视频
    const playVideo = function() {
        // 查找当前视频元素
        const video = document.querySelector('video');
        if (!video) {
            console.log('未找到视频元素，2秒后重试...');
            setTimeout(playVideo, 2000); // 重试
            return;
        }

        // 设置倍速播放
        // 确保视频元数据已加载，可以设置播放速率
        const setPlayback = () => {
            if (video.readyState >= 1) {
                video.playbackRate = 5;
                video.play();
                console.log('视频已开始播放，设置为5倍速');
            } else {
                video.addEventListener('loadedmetadata', setPlayback); // 等待元数据加载
            }
        };
        
        setPlayback();
        video.play(); // 尝试立即播放

        // [BugFix 2] 改进切换逻辑
        video.addEventListener('ended', () => {
            console.log('当前视频播放完毕，准备切换到下一个视频');
            
            // 重新获取最新的课程列表
            initializeVideoList();
            
            // 查找当前激活的课程 li 元素 (根据 txt 文件 )
            const activeLi = document.querySelector('li.active');
            if (!activeLi) {
                console.log('未找到当前激活的课程，停止播放。');
                return;
            }

            // 在未完成列表中找到当前课程的索引
            const currentIndex = videoList.findIndex(li => li.id === activeLi.id);

            if (currentIndex === -1) {
                console.log('当前课程不在未完成列表中，可能已完成或列表已更新。');
                // 尝试点击列表中的第一个未完成项
                if (videoList.length > 0) {
                    videoList[0].click();
                    setTimeout(playVideo, 3000);
                }
                return;
            }
            
            const nextVideoIndex = currentIndex + 1;

            // 检查是否还有未播放的下一个视频
            if (nextVideoIndex < videoList.length) {
                const nextVideo = videoList[nextVideoIndex];
                if (nextVideo) {
                    console.log('切换到下一个视频：', nextVideo.title);
                    nextVideo.click(); // 模拟点击下一个课程

                    // 给页面一些时间加载下一个视频
                    setTimeout(playVideo, 3000); // 3秒后播放新视频
                }
            } else {
                console.log('所有视频播放完毕');
            }
        });
    };

    // 初始化课程列表并开始播放
    setTimeout(() => {
        initializeVideoList(); // 首次加载列表
        playVideo(); // 开始播放当前页面的视频
    }, 3000); // 页面加载后3秒开始播放

})();