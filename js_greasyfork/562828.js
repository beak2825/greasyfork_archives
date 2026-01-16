// ==UserScript==
// @name         测试
// @version      0.0.1
// @description  统计bilibili合集总时长与观看百分比
// @author       stone
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace    347386437@qq.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562828/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/562828/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    setTimeout(function () {
        // 检测页面类型（普通视频/分P视频/合集）
        function detectPageType() {
            // 检测合集页面特征[7](@ref)
            const seasonElements = document.querySelectorAll('[class*="season"], [class*="series"]');
            const archiveSections = document.querySelectorAll('.video-section-list, .series-list');
            
            if (seasonElements.length > 0 || archiveSections.length > 0) {
                return 'season'; // 合集页面
            }
            
            // 检测分P视频[2](@ref)
            const multiPage = document.querySelector('#multi_page, .multi-page');
            if (multiPage) {
                return 'multi'; // 分P视频
            }
            
            return 'single'; // 单视频
        }

        // 获取合集视频列表（修复后的方法）
        function getSeasonVideoList() {
            const videoItems = [];
            
            // 方法1: 尝试获取合集结构的视频项[7](@ref)
            const seasonItems = document.querySelectorAll('.video-section-list .video-episode-card, .series-list li, [class*="season-item"]');
            if (seasonItems.length > 0) {
                seasonItems.forEach((item, index) => {
                    const durationEl = item.querySelector('.duration, .video-duration, .stat-item.duration');
                    if (durationEl) {
                        videoItems.push({
                            element: item,
                            duration: durationEl.textContent.trim(),
                            index: index
                        });
                    }
                });
            }
            
            // 方法2: 备用选择器[9](@ref)
            if (videoItems.length === 0) {
                const listItems = document.querySelectorAll('.list-box li, .video-pod__item, .ep-list li');
                listItems.forEach((item, index) => {
                    const durationEl = item.querySelector('.duration, .video-duration, .stat-item.duration');
                    if (durationEl) {
                        videoItems.push({
                            element: item,
                            duration: durationEl.textContent.trim(),
                            index: index
                        });
                    }
                });
            }
            
            return videoItems;
        }

        // 解析时间字符串为秒数[2](@ref)
        function parseTimeToSeconds(timeStr) {
            if (!timeStr) return 0;
            
            const parts = timeStr.split(':').map(Number);
            if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                return parts[0] * 60 + parts[1];
            }
            return 0;
        }

        // 格式化秒数为时间字符串
        function formatSeconds(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            
            if (h > 0) {
                return `${h}h ${m}m ${s}s`;
            } else if (m > 0) {
                return `${m}m ${s}s`;
            } else {
                return `${s}s`;
            }
        }

        // 获取当前播放的视频索引[1](@ref)
        function getCurrentVideoIndex(videoItems) {
            for (let i = 0; i < videoItems.length; i++) {
                const item = videoItems[i].element;
                if (item.classList.contains('active') || item.classList.contains('on') || 
                    item.querySelector('.active, .on')) {
                    return i;
                }
            }
            
            // 备用方法：通过URL参数检测[3](@ref)
            const urlParams = new URLSearchParams(window.location.search);
            const pParam = urlParams.get('p');
            if (pParam) {
                return parseInt(pParam) - 1;
            }
            
            return 0;
        }

        // 计算总时长和观看进度（修复版）
        function calculateProgress() {
            const pageType = detectPageType();
            let videoItems = [];
            
            if (pageType === 'season') {
                videoItems = getSeasonVideoList();
            } else {
                // 原有逻辑处理分P视频
                const items = document.querySelectorAll('.video-pod__list .video-pod__item');
                items.forEach((item, index) => {
                    const durationEl = item.querySelector('.stat-item.duration');
                    if (durationEl) {
                        videoItems.push({
                            element: item,
                            duration: durationEl.textContent.trim(),
                            index: index
                        });
                    }
                });
            }
            
            if (videoItems.length === 0) {
                console.log('未检测到视频列表');
                return;
            }
            
            // 计算总时长
            let totalSeconds = 0;
            videoItems.forEach(item => {
                totalSeconds += parseTimeToSeconds(item.duration);
            });
            
            // 获取当前视频索引和观看进度
            const currentIndex = getCurrentVideoIndex(videoItems);
            let watchedSeconds = 0;
            
            // 累加已观看视频的时长
            for (let i = 0; i < currentIndex; i++) {
                watchedSeconds += parseTimeToSeconds(videoItems[i].duration);
            }
            
            // 获取当前视频的播放进度[1](@ref)
            const video = document.querySelector('video');
            if (video && currentIndex < videoItems.length) {
                const currentVideoProgress = video.currentTime;
                watchedSeconds += currentVideoProgress;
            } else if (currentIndex < videoItems.length) {
                // 如果没有video元素，假设当前视频已完整观看
                watchedSeconds += parseTimeToSeconds(videoItems[currentIndex].duration);
            }
            
            // 获取倍速设置
            const speedInput = document.getElementById('speed-input');
            const speed = speedInput ? parseFloat(speedInput.value) : 1.0;
            
            // 计算实际时长（考虑倍速）
            const actualTotalSeconds = totalSeconds;
            const actualWatchedSeconds = watchedSeconds;
            const adjustedTotalSeconds = totalSeconds / speed;
            const adjustedWatchedSeconds = watchedSeconds / speed;
            
            const progressPercentage = totalSeconds > 0 ? (watchedSeconds / totalSeconds * 100) : 0;
            
            // 更新显示
            updateDisplay(currentIndex + 1, videoItems.length, adjustedWatchedSeconds, adjustedTotalSeconds, progressPercentage);
        }

        // 更新界面显示
        function updateDisplay(current, total, watchedSeconds, totalSeconds, percentage) {
            const watchedHours = (watchedSeconds / 3600).toFixed(1);
            const totalHours = (totalSeconds / 3600).toFixed(1);
            const rate = percentage.toFixed(2);
            
            // 隐藏原有的集数显示
            const amtElement = document.querySelector(".video-pod__header .amt");
            if (amtElement) {
                amtElement.style.display = "none";
            }
            
            // 更新标题显示
            const title = document.querySelector(".video-pod .header-top .title");
            if (title) {
                title.style.cssText = `
                    font-size: 13px;
                    color: #18191c;
                    display: inline-block;
                    margin-right: 10px;
                `;
                title.innerHTML = `(${current}/${total}) ${watchedHours}/${totalHours}h (${rate}%)`;
                
                // 更新进度条
                updateProgressBar(percentage);
            }
        }

        // 保留您原有的进度条和倍速输入框函数
        function addSpeedInput() {
            // 您原有的addSpeedInput函数代码
        }

        function updateProgressBar(rate) {
            // 您原有的updateProgressBar函数代码
        }

        // 初始化
        function init() {
            const pageType = detectPageType();
            console.log('检测到页面类型:', pageType);
            
            if (pageType === 'season' || pageType === 'multi') {
                addSpeedInput();
                calculateProgress();
                
                // 监听页面变化
                const observer = new MutationObserver(function() {
                    debounce(calculateProgress, 500)();
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                
                // 定期更新（每5秒）
                setInterval(calculateProgress, 5000);
            }
        }

        // 初始化执行
        init();

    }, 2500);
})();

// 保留您原有的防抖函数
function debounce(fn, delay = 500) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(null, args);
            timer = null;
        }, delay);
    };
}