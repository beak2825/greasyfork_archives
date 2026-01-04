// ==UserScript==
// @name         Steam++ DX_喇叭按钮滚轮调音 [仅Watt Toolkit(Steam++) 特用]
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  在Steam客户端中喇叭/音量按钮上使用滚轮调节音量。集成唯一ID管理，优化多视频检测，支持Steam多视频独立控制
// @match        *://store.steampowered.com/*
// @match        *://steamcommunity.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/554109/Steam%2B%2B%20DX_%E5%96%87%E5%8F%AD%E6%8C%89%E9%92%AE%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3%20%5B%E4%BB%85Watt%20Toolkit%28Steam%2B%2B%29%20%E7%89%B9%E7%94%A8%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/554109/Steam%2B%2B%20DX_%E5%96%87%E5%8F%AD%E6%8C%89%E9%92%AE%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3%20%5B%E4%BB%85Watt%20Toolkit%28Steam%2B%2B%29%20%E7%89%B9%E7%94%A8%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查是否在Steam客户端中运行
    const isSteamClient = () => {
        return navigator.userAgent.includes('Valve Steam') || 
               navigator.userAgent.includes('Steam') ||
               typeof SteamClient !== 'undefined';
    };
    
    // 如果不是Steam客户端，直接退出
    if (!isSteamClient()) {
        console.log('DX_喇叭按钮滚轮调音: 仅在Steam客户端中运行');
        return;
    }
    
    // 常量定义
    const DISPLAY_TIMEOUT = 1000;
    const INIT_DELAY = 1000;
    const RETRY_DELAY = 500;
    
    const CONFIG = {
        stepVolume: GM_getValue('SpeakerWheelStepVolume', 5)
    };
    
    // Steam平台选择器配置
    const steamSelectors = [
        'svg._1CpOAgPPD7f_fGI4HaYX6C', 
        'svg.SVGIcon_Volume', 
        'svg.SVGIcon_Button.SVGIcon_Volume',
        '[class*="volume" i] svg',
        'button:has(svg.SVGIcon_Volume)',
        'button:has(svg[class*="Volume" i])'
    ];
    
    // 轻量级唯一ID管理器
    const SimpleIdManager = {
        buttonVideoMap: new WeakMap(),
        videoIdCounter: 0,
        
        // 绑定按钮到视频
        bindButtonToVideo(button, video) {
            this.buttonVideoMap.set(button, video);
            
            if (!video.dataset.speakerVideoId) {
                this.videoIdCounter++;
                video.dataset.speakerVideoId = `speaker_video_${this.videoIdCounter}`;
            }
            
            button.dataset.boundVideoId = video.dataset.speakerVideoId;
        },
        
        // 获取绑定的视频
        getVideoByButton(button) {
            // 优先从WeakMap获取
            const cachedVideo = this.buttonVideoMap.get(button);
            if (cachedVideo && document.contains(cachedVideo)) {
                return cachedVideo;
            }
            
            // 备用：通过ID查找
            const videoId = button.dataset.boundVideoId;
            if (videoId) {
                const foundVideo = document.querySelector(`video[data-speaker-video-id="${videoId}"]`);
                if (foundVideo) {
                    this.buttonVideoMap.set(button, foundVideo);
                    return foundVideo;
                }
            }
            
            return null;
        }
    };
    
    // 工具函数集合
    const utils = {
        clampVolume: vol => Math.round(Math.max(0, Math.min(100, vol)) * 100) / 100,
        
        // 根据坐标查找视频（备用方案）
        findVideoAtPosition: (x, y) => {
            const videos = Array.from(document.querySelectorAll('video')).filter(v => 
                v.offsetParent !== null && v.offsetWidth > 100 && v.offsetHeight > 50
            );
            
            if (videos.length === 0) return null;
            if (videos.length === 1) return videos[0];
            
            // 多视频时查找最近的
            let closestVideo = null;
            let minDistance = Infinity;
            
            for (const video of videos) {
                const rect = video.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVideo = video;
                }
            }
            
            return closestVideo;
        },
        
        // 计算元素中心坐标
        getElementCenter: (element) => {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
    };
    
    let volumeDisplay = null;
    let steamInitialized = false;
    
    // Steam按钮专用视频查找
    const findVideoForSteamButton = (button) => {
        // 优先使用唯一ID绑定
        const boundVideo = SimpleIdManager.getVideoByButton(button);
        if (boundVideo) {
            return boundVideo;
        }
        
        // 备用：坐标匹配
        const center = utils.getElementCenter(button);
        const coordVideo = utils.findVideoAtPosition(center.x, center.y);
        
        if (coordVideo && button) {
            SimpleIdManager.bindButtonToVideo(button, coordVideo);
        }
        
        return coordVideo;
    };
    
    // 查找激活的视频
    const findActiveVideo = () => {
        const allVideos = Array.from(document.querySelectorAll('video'));
        if (allVideos.length === 0) return null;
        
        // 1. 优先查找正在播放的视频
        const playingVideo = allVideos.find(v => v.offsetParent !== null && !v.paused && v.readyState > 0);
        if (playingVideo) return playingVideo;
        
        // 2. 查找可见的视频
        const visibleVideo = allVideos.find(v => v.offsetParent !== null && v.offsetWidth > 100 && v.offsetHeight > 50);
        if (visibleVideo) return visibleVideo;
        
        // 3. 返回第一个有效视频
        return allVideos.find(v => v.offsetParent !== null) || allVideos[0];
    };
    
    // 音量显示功能
    const showVolume = (vol, targetVideo = null) => {
        if (!volumeDisplay) {
            volumeDisplay = document.createElement('div');
            volumeDisplay.id = 'speaker-wheel-volume-display';
            
            Object.assign(volumeDisplay.style, {
                position: 'fixed',
                zIndex: 2147483647,
                minWidth: '90px',
                height: '50px',
                lineHeight: '50px',
                textAlign: 'center',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                opacity: '0',
                transition: 'opacity 0.3s',
                pointerEvents: 'none'
            });
            
            document.body.appendChild(volumeDisplay);
        }
        
        // 更新位置函数
        const updatePosition = () => {
            const video = targetVideo || findActiveVideo();
            if (video && volumeDisplay) {
                const rect = video.getBoundingClientRect();
                volumeDisplay.style.top = (rect.top + rect.height / 2) + 'px';
                volumeDisplay.style.left = (rect.left + rect.width / 2) + 'px';
                volumeDisplay.style.transform = 'translate(-50%, -50%)';
            }
        };
        
        updatePosition();
        
        // 只在弹窗显示时监听滚动
        if (!volumeDisplay._scrollHandler) {
            volumeDisplay._scrollHandler = () => {
                if (volumeDisplay.style.opacity === '1') {
                    updatePosition();
                }
            };
            window.addEventListener('scroll', volumeDisplay._scrollHandler, { passive: true });
        }
        
        volumeDisplay.textContent = `${Math.round(vol)}%`;
        volumeDisplay.style.opacity = '1';
        
        if (volumeDisplay._timeout) clearTimeout(volumeDisplay._timeout);
        volumeDisplay._timeout = setTimeout(() => {
            volumeDisplay.style.opacity = '0';
        }, DISPLAY_TIMEOUT);
    };
    
    // 音量调整功能
    const adjustVolume = (video, delta) => {
        if (!video) return;
        
        const newVolume = utils.clampVolume((video.volume * 100) + delta);
        video.volume = newVolume / 100;
        video.muted = false;
        showVolume(newVolume, video);
    };
    
    // Steam平台音量图标查找
    const findVolumeIcon = (element) => {
        let currentElement = element;
        
        while (currentElement && currentElement !== document.body) {
            if (currentElement.tagName === 'svg' || currentElement.tagName === 'BUTTON') {
                // 选择器匹配
                for (const selector of steamSelectors) {
                    if (currentElement.matches?.(selector)) {
                        return currentElement;
                    }
                }
                
                // 类名匹配（作为备选）
                const className = currentElement.className || '';
                if (typeof className === 'string' && (
                    className.includes('Volume') || 
                    className.includes('volume')
                )) {
                    return currentElement;
                }
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    };
    
    // Steam平台处理
    const initSteamVolume = () => {
        if (steamInitialized) return;
        
        let currentTarget = null;
        
        const mouseEnterHandler = (e) => {
            const volumeIcon = findVolumeIcon(e.target);
            if (volumeIcon) {
                currentTarget = volumeIcon;
            }
        };
        
        const mouseLeaveHandler = (e) => {
            currentTarget = null;
        };
        
        const wheelHandler = (e) => {
            if (!currentTarget) return;
            
            const volumeIcon = findVolumeIcon(e.target);
            if (volumeIcon === currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetVideo = findVideoForSteamButton(volumeIcon);
                if (!targetVideo) return;
                
                const delta = -Math.sign(e.deltaY) * CONFIG.stepVolume;
                adjustVolume(targetVideo, delta);
            }
        };
        
        // 为所有音量相关元素添加鼠标事件
        document.addEventListener('mouseover', mouseEnterHandler, { capture: true });
        document.addEventListener('mouseout', mouseLeaveHandler, { capture: true });
        document.addEventListener('wheel', wheelHandler, { 
            capture: true, 
            passive: false 
        });
        
        steamInitialized = true;
    };
    
    // Steam初始化逻辑
    const initSteamPlatform = () => {
        if (document.querySelectorAll('video').length > 0) {
            initSteamVolume();
        } else {
            setTimeout(initSteamPlatform, RETRY_DELAY);
        }
    };
    
    // 初始化函数
    const registerMenuCommands = () => {
        GM_registerMenuCommand('🔊 设置音量步进', () => {
            const newVal = prompt('设置音量步进 (%)', CONFIG.stepVolume);
            if (newVal && !isNaN(newVal)) {
                CONFIG.stepVolume = parseFloat(newVal);
                GM_setValue('SpeakerWheelStepVolume', CONFIG.stepVolume);
                alert('设置已保存');
            }
        });
    };
    
    const init = () => {
        registerMenuCommands();
        initSteamPlatform();
    };
    
    // 清理函数
    const cleanup = () => {
        if (volumeDisplay) {
            if (volumeDisplay._timeout) {
                clearTimeout(volumeDisplay._timeout);
            }
            if (volumeDisplay._scrollHandler) {
                window.removeEventListener('scroll', volumeDisplay._scrollHandler);
            }
        }
    };
    
    // 启动初始化
    window.addEventListener('beforeunload', cleanup);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, INIT_DELAY);
    }
})();