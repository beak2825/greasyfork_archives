// ==UserScript==
// @name         DX_视频区滚轮调音
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  在视频区域使用滚轮调节音量。支持：YouTube、B站、Steam、Twitch。Steam页面支持多视频独立控制
// @match        *://www.youtube.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.twitch.tv/*
// @match        *://store.steampowered.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552455/DX_%E8%A7%86%E9%A2%91%E5%8C%BA%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/552455/DX_%E8%A7%86%E9%A2%91%E5%8C%BA%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        stepVolume: GM_getValue('VideoWheelConfig_stepVolume', 10)
    };

    const PLATFORM = (() => {
        const host = location.hostname;
        if (/youtube\.com|youtu\.be/.test(host)) return "YOUTUBE";
        if (/bilibili\.com/.test(host)) return "BILIBILI";
        if (/twitch\.tv/.test(host)) return "TWITCH";
        if (/store\.steampowered\.com/.test(host)) return "STEAM";
        return "GENERIC";
    })();

    // 工具函数
    const utils = {
        isInteractiveElement(element) {
            return /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(element.tagName) || element.isContentEditable;
        },

        isElementVisible(element) {
            return element && document.contains(element) && element.offsetWidth > 50 && element.offsetHeight > 50;
        },

        clampVolume(vol) {
            return Math.max(0, Math.min(100, Math.round(vol)));
        },

        isMouseInVideoArea(x, y, video) {
            const rect = video.getBoundingClientRect();
            // 严格在视频区域内，不留边距
            return x >= rect.left && x <= rect.right && 
                   y >= rect.top && y <= rect.bottom;
        }
    };

    // 视频检测器
    const videoDetector = {
        cachedVideos: new Map(),
        videoIdCounter: 0,
        
        getVideoElement(x, y) {
            // Steam平台特殊处理 - 多视频支持
            if (PLATFORM === 'STEAM') {
                return this.findVideoAtPosition(x, y);
            }
            
            // 其他平台使用原有逻辑
            let video = this.getCachedVideo();
            if (video && utils.isElementVisible(video)) {
                return video;
            }
            
            const selectors = {
                'YOUTUBE': ['video', 'ytd-player video'],
                'BILIBILI': ['.bpx-player-video-wrap video', '.bilibili-player video'],
                'TWITCH': ['.video-ref video', '.twitch-video video'],
                'GENERIC': ['video.player', 'video']
            }[PLATFORM] || ['video'];
            
            for (const selector of selectors) {
                video = document.querySelector(selector);
                if (video && utils.isElementVisible(video)) {
                    this.cacheVideo(video);
                    return video;
                }
            }
            
            return null;
        },
        
        // Steam专用：根据坐标查找视频
        findVideoAtPosition(x, y) {
            const videos = Array.from(document.querySelectorAll('video')).filter(v => utils.isElementVisible(v));
            
            for (const video of videos) {
                // Steam平台也使用严格的视频区域检测
                if (utils.isMouseInVideoArea(x, y, video)) {
                    return video;
                }
            }
            
            return null;
        },
        
        getCachedVideo() {
            // 清理过期的缓存
            this.cleanupCache();
            
            // 返回第一个有效的缓存视频（非Steam平台）
            for (const [id, data] of this.cachedVideos) {
                if (utils.isElementVisible(data.video)) {
                    return data.video;
                }
            }
            return null;
        },
        
        cacheVideo(video) {
            // 为视频生成唯一ID，基于计数器
            if (!video.__videoWheelId) {
                video.__videoWheelId = `video_${++this.videoIdCounter}`;
            }
            const id = video.__videoWheelId;
            this.cachedVideos.set(id, {
                video: video,
                timestamp: Date.now()
            });
        },
        
        cleanupCache() {
            const now = Date.now();
            const maxAge = 30000; // 30秒
            
            for (const [id, data] of this.cachedVideos) {
                if (now - data.timestamp > maxAge || !document.contains(data.video)) {
                    this.cachedVideos.delete(id);
                }
            }
        }
    };

    // 音量显示
    const volumeDisplay = {
        element: null,
        timeoutId: null,
        scrollHandler: null,
        currentVideo: null,
        
        show(volume, video) {
            if (!this.element) this.create();
            
            this.currentVideo = video;
            this.updatePosition();
            this.element.textContent = `${Math.round(volume)}%`;
            this.element.style.opacity = '1';
            
            // 添加滚动监听
            this.addScrollListener();
            this.scheduleHide();
        },
        
        create() {
            this.element = document.createElement('div');
            this.element.id = 'video-wheel-volume-display';
            Object.assign(this.element.style, {
                position: 'fixed', zIndex: 2147483647, minWidth: '90px', height: '50px',
                lineHeight: '50px', textAlign: 'center', borderRadius: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#fff', fontSize: '24px',
                fontFamily: 'Arial, sans-serif', opacity: '0', transition: 'opacity 0.3s',
                pointerEvents: 'none'
            });
            document.body.appendChild(this.element);
        },
        
        updatePosition() {
            if (!this.currentVideo || !utils.isElementVisible(this.currentVideo)) {
                this.hide();
                return;
            }
            
            const rect = this.currentVideo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            this.element.style.left = centerX + 'px';
            this.element.style.top = centerY + 'px';
            this.element.style.transform = 'translate(-50%, -50%)';
        },
        
        addScrollListener() {
            this.removeScrollListener();
            
            this.scrollHandler = () => {
                this.updatePosition();
            };
            
            // 使用 capture 和 passive 提高性能
            window.addEventListener('scroll', this.scrollHandler, { 
                capture: true, 
                passive: true 
            });
        },
        
        removeScrollListener() {
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler, { 
                    capture: true 
                });
                this.scrollHandler = null;
            }
        },
        
        scheduleHide() {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.hide();
            }, 1000);
        },
        
        hide() {
            this.removeScrollListener();
            this.currentVideo = null;
            if (this.element) {
                this.element.style.opacity = '0';
            }
        }
    };

    // 音量控制
    const volumeControl = {
        adjustVolume(video, delta) {
            if (!video) return;
            
            let newVolume;
            if (PLATFORM === 'YOUTUBE') {
                // YouTube特殊处理
                try {
                    const ytPlayer = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
                    if (ytPlayer?.getVolume && ytPlayer?.setVolume) {
                        const currentVol = ytPlayer.getVolume();
                        newVolume = utils.clampVolume(currentVol + delta);
                        ytPlayer.setVolume(newVolume);
                    } else {
                        throw new Error('YouTube API not available');
                    }
                } catch {
                    newVolume = utils.clampVolume((video.volume * 100) + delta);
                    video.volume = newVolume / 100;
                }
            } else if (PLATFORM === 'STEAM') {
                // Steam平台特殊处理
                const currentVolume = video.volume * 100;
                
                if (delta > 0) {
                    // 向上滚动 - 如果当前是静音状态则取消静音
                    if (video.muted) {
                        video.muted = false;
                        // 设置一个默认音量，比如步进值
                        newVolume = CONFIG.stepVolume;
                    } else {
                        newVolume = utils.clampVolume(currentVolume + delta);
                    }
                } else {
                    // 向下滚动 - 减少音量但不进入静音
                    newVolume = utils.clampVolume(currentVolume + delta);
                    if (newVolume === 0) {
                        // 音量归0但不静音
                        video.muted = false;
                    }
                }
                
                video.volume = newVolume / 100;
            } else {
                // 通用处理
                newVolume = utils.clampVolume((video.volume * 100) + delta);
                video.volume = newVolume / 100;
            }
            
            volumeDisplay.show(newVolume, video);
            return newVolume;
        }
    };

    // 事件处理
    const eventHandler = {
        isProcessing: false,
        
        handleWheelEvent(e) {
            if (this.isProcessing || utils.isInteractiveElement(e.target)) return;
            
            const video = videoDetector.getVideoElement(e.clientX, e.clientY);
            if (!video) return;
            
            // 严格检查鼠标是否在视频区域内
            if (!utils.isMouseInVideoArea(e.clientX, e.clientY, video)) {
                return;
            }
            
            this.isProcessing = true;
            
            try {
                e.preventDefault();
                e.stopPropagation();
                
                const delta = -Math.sign(e.deltaY) * CONFIG.stepVolume;
                volumeControl.adjustVolume(video, delta);
            } finally {
                this.isProcessing = false;
            }
        }
    };

    // 初始化
    let isInitialized = false;

    const init = () => {
        if (isInitialized) return;
        isInitialized = true;
        
        // 菜单命令
        GM_registerMenuCommand('🔊 设置音量步进', () => {
            const newVal = prompt('设置音量步进 (1-100)', CONFIG.stepVolume);
            if (newVal !== null) {
                const num = parseFloat(newVal);
                if (!isNaN(num) && num >= 1 && num <= 100) {
                    CONFIG.stepVolume = num;
                    GM_setValue('VideoWheelConfig_stepVolume', num);
                    alert('设置已保存');
                } else {
                    alert('请输入1-100之间的数字');
                }
            }
        });
        
        // 事件绑定
        const eventOptions = { capture: true, passive: false };
        const handler = eventHandler.handleWheelEvent.bind(eventHandler);
        document.addEventListener('wheel', handler, eventOptions);
        
        if (PLATFORM === 'STEAM') {
            window.addEventListener('wheel', handler, eventOptions);
        }
        
        // 定期清理视频缓存
        setInterval(() => {
            videoDetector.cleanupCache();
        }, 15000);
    };

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();