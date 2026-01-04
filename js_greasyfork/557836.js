// ==UserScript==
// @name         智能视频进度条
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动为页面视频添加红色进度条
// @author       Optimized by Qwen
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557836/%E6%99%BA%E8%83%BD%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/557836/%E6%99%BA%E8%83%BD%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        MAX_RETRY_COUNT: 7,
        RETRY_BASE_DELAY: 100,
        AHEAD_MS: 50, // 提前50ms
        PROGRESS_HEIGHT: '3px',
        PROGRESS_COLOR: 'linear-gradient(90deg, #ff0000, #ff3333)',
        Z_INDEX: 2147483647
    };

    // 全局状态
    const state = {
        isInitialized: false,
        currentVideo: null,
        progressBar: null,
        progressInner: null,
        videoObserver: null,
        urlObserver: null,
        retryCount: 0,
        rafId: 0,
        lastUrl: location.href
    };

    console.log('[Optimized Video Progress Bar] 启动');

    // 初始化入口
    function init() {
        if (state.isInitialized) return;
        
        createProgressBar();
        setupVideoDetection();
        setupUrlObserver();
        setupPageVisibilityListener();
        
        // 立即检测视频
        detectVideo();
    }

    // 创建进度条DOM元素
    function createProgressBar() {
        if (document.querySelector('#optimized-video-progress')) return;
        
        const progressBar = document.createElement('div');
        progressBar.id = 'optimized-video-progress';
        progressBar.innerHTML = '<div id="optimized-progress-inner"></div>';
        
        // 设置样式
        Object.assign(progressBar.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: CONFIG.PROGRESS_HEIGHT,
            background: 'transparent',
            zIndex: CONFIG.Z_INDEX,
            pointerEvents: 'none',
            transition: 'height 0.2s',
            willChange: 'transform'
        });
        
        const progressInner = progressBar.querySelector('#optimized-progress-inner');
        Object.assign(progressInner.style, {
            height: '100%',
            width: '0%',
            background: CONFIG.PROGRESS_COLOR,
            willChange: 'width'
        });
        
        document.body.appendChild(progressBar);
        
        state.progressBar = progressBar;
        state.progressInner = progressInner;
    }

    // 设置视频检测机制
    function setupVideoDetection() {
        // 监听DOM变化
        state.videoObserver = new MutationObserver((mutations) => {
            let shouldDetect = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'VIDEO' || node.querySelector?.('video')) {
                            shouldDetect = true;
                        }
                    }
                });
            });
            
            if (shouldDetect && !state.isInitialized) {
                setTimeout(detectVideo, 100);
            }
        });
        
        state.videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 监听Shadow DOM
        hijackShadowDOM();
    }

    // 劫持Shadow DOM以检测其中的视频元素
    function hijackShadowDOM() {
        const originalAttachShadow = Element.prototype.attachShadow;
        if (originalAttachShadow) {
            Element.prototype.attachShadow = function(options) {
                const shadowRoot = originalAttachShadow.call(this, options);
                const shadowObserver = new MutationObserver(() => {
                    if (!state.isInitialized) {
                        setTimeout(detectVideo, 100);
                    }
                });
                shadowObserver.observe(shadowRoot, {
                    childList: true,
                    subtree: true
                });
                return shadowRoot;
            };
        }
    }

    // 检测页面中的视频元素
    function detectVideo() {
        if (state.isInitialized) return;
        
        state.retryCount++;
        const videos = findVideos();
        
        if (videos.length > 0) {
            const bestVideo = selectBestVideo(videos);
            if (bestVideo && initVideoHandler(bestVideo)) {
                return;
            }
        }
        
        // 如果没有找到视频，设置重试机制
        if (state.retryCount < CONFIG.MAX_RETRY_COUNT) {
            const delay = CONFIG.RETRY_BASE_DELAY * Math.pow(2, state.retryCount - 1);
            setTimeout(detectVideo, delay);
        }
    }

    // 查找所有视频元素（包括Shadow DOM中的）
    function findVideos() {
        let videos = Array.from(document.querySelectorAll('video'));
        
        // 查找Shadow DOM中的视频
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.shadowRoot) {
                videos = videos.concat(Array.from(element.shadowRoot.querySelectorAll('video')));
            }
        });
        
        // 过滤出可见的视频
        return videos.filter(video => {
            try {
                const rect = video.getBoundingClientRect();
                const style = getComputedStyle(video);
                
                return rect.width > 10 && 
                       rect.height > 10 && 
                       style.visibility !== 'hidden' &&
                       style.display !== 'none' &&
                       style.opacity !== '0' &&
                       video.src || video.children.length > 0;
            } catch (e) {
                return false;
            }
        });
    }

    // 选择最佳视频（基于播放状态、尺寸、就绪状态等）
    function selectBestVideo(videos) {
        return videos.reduce((best, video) => {
            const rect = video.getBoundingClientRect();
            const area = rect.width * rect.height;
            
            // 计算分数：播放状态、就绪状态、持续时间、尺寸
            let score = area;
            if (!video.paused) score += 100000;  // 正在播放的视频优先
            if (video.readyState >= 3) score += 50000;  // 就绪状态好的优先
            if (video.duration > 0) score += 30000;  // 有持续时间的优先
            
            if (!best || score > best.score) {
                return { video, score };
            }
            return best;
        }, null)?.video;
    }

    // 初始化视频处理
    function initVideoHandler(video) {
        if (state.isInitialized || !video) return false;
        
        try {
            const container = findBestContainer(video);
            if (!container) return false;
            
            setupContainer(container);
            if (state.progressBar.parentElement !== container) {
                container.appendChild(state.progressBar);
            }
            
            state.currentVideo = video;
            bindVideoEvents();
            startRAFLoop();
            
            state.isInitialized = true;
            state.retryCount = 0;
            
            console.log('[Optimized Video Progress Bar] 进度条已绑定到视频');
            return true;
        } catch (error) {
            console.error('[Optimized Video Progress Bar] 初始化失败:', error);
            return false;
        }
    }

    // 查找最佳容器
    function findBestContainer(video) {
        if (!video) return null;
        
        let container = video.parentElement;
        let bestContainer = container;
        
        // 向上查找4层，寻找与视频尺寸相近的容器
        for (let i = 0; i < 4 && container && container !== document.body; i++) {
            try {
                const videoRect = video.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                const widthDiff = Math.abs(containerRect.width - videoRect.width);
                const heightDiff = Math.abs(containerRect.height - videoRect.height);
                
                if (widthDiff < 150 && heightDiff < 150) {
                    bestContainer = container;
                    break;
                }
                
                container = container.parentElement;
            } catch (e) {
                break;
            }
        }
        
        return bestContainer;
    }

    // 设置容器样式
    function setupContainer(container) {
        try {
            if (getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }
        } catch (e) {
            console.warn('[Optimized Video Progress Bar] 设置容器样式失败:', e);
        }
    }

    // 绑定视频事件
    function bindVideoEvents() {
        if (!state.currentVideo) return;
        
        const video = state.currentVideo;
        
        // 播放事件
        video.addEventListener('play', startRAFLoop, { passive: true });
        video.addEventListener('pause', stopRAFLoop, { passive: true });
        video.addEventListener('ended', stopRAFLoop, { passive: true });
        
        // 视频源变化事件
        video.addEventListener('loadstart', handleVideoChange, { once: true });
        video.addEventListener('emptied', handleVideoChange, { once: true });
        
        // 时间更新事件（作为RAF的补充）
        video.addEventListener('timeupdate', updateProgressBar, { passive: true });
    }

    // 处理视频变化（如重新加载）
    function handleVideoChange() {
        stopRAFLoop();
        setTimeout(() => {
            state.isInitialized = false;
            state.currentVideo = null;
            state.retryCount = 0;
            detectVideo();
        }, 100);
    }

    // RAF循环更新进度条
    function startRAFLoop() {
        stopRAFLoop(); // 先停止之前的循环
        
        const update = () => {
            if (!state.currentVideo) return;
            
            updateProgressBar();
            state.rafId = requestAnimationFrame(update);
        };
        
        state.rafId = requestAnimationFrame(update);
    }

    // 停止RAF循环
    function stopRAFLoop() {
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = 0;
        }
    }

    // 更新进度条显示
    function updateProgressBar() {
        if (!state.currentVideo || !state.progressInner) return;
        
        const { duration, currentTime } = state.currentVideo;
        
        if (duration > 0) {
            // 计算提前时间后的进度
            const aheadTime = currentTime + (CONFIG.AHEAD_MS / 1000);
            const progress = Math.min(1, Math.max(0, aheadTime / duration));
            const percentage = progress * 100;
            
            state.progressInner.style.width = `${percentage}%`;
        }
    }

    // 设置URL变化监听
    function setupUrlObserver() {
        // 监听URL变化
        const urlObserver = new MutationObserver(() => {
            if (location.href !== state.lastUrl) {
                state.lastUrl = location.href;
                resetState();
                setTimeout(detectVideo, 500);
            }
        });
        
        urlObserver.observe(document, { subtree: true, childList: true });
        state.urlObserver = urlObserver;
    }

    // 设置页面可见性监听
    function setupPageVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !state.isInitialized) {
                setTimeout(detectVideo, 300);
            }
        });
    }

    // 重置状态
    function resetState() {
        stopRAFLoop();
        state.isInitialized = false;
        state.currentVideo = null;
        state.retryCount = 0;
    }

    // 根据页面加载状态初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        setTimeout(init, 100);
    } else {
        init();
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        stopRAFLoop();
        if (state.videoObserver) {
            state.videoObserver.disconnect();
        }
        if (state.urlObserver) {
            state.urlObserver.disconnect();
        }
    });
})();