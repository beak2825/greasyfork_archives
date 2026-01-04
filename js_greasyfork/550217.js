// ==UserScript==
// @name         Instagram视频进度条Reels 1.0.3
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  此脚本用于为 Instagram 网页版添加视频进度条和全局音量控制功能，提升用户的视频观看体验。建议在Reels频道使用。
// @author       Greasy Fork：蛋定的文弱书生
// @match        *://*.instagram.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550217/Instagram%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1Reels%20103.user.js
// @updateURL https://update.greasyfork.org/scripts/550217/Instagram%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1Reels%20103.meta.js
// ==/UserScript==

// 用户设置
var userSettings = {
    defaultMuted: false, // 默认不静音为 false，默认静音为 true
    defaultSeekTime: 3, // 默认快进/回退时间为 3 秒
    defaultPlaybackRate: 2, // 默认加速的播放速度为 2.0
    defaultVolume: 1.0, // 默认音量（0.0 到 1.0）
    progressBarColor: '#ff4757' // 进度条和音量条统一颜色
}

// 全局管理器
class VideoProgressManager {
    constructor(userSettings) {
        this.videoControllers = new Map();
        this.currentPlayingVideo = null;
        this.userSettings = userSettings;
        // 初始化音量，从本地存储读取或使用默认值
        this.currentVolume = localStorage.getItem('instagramVideoVolume') ? parseFloat(localStorage.getItem('instagramVideoVolume')) : userSettings.defaultVolume;
        this.volumeSlider = null; // 全局音量滑块
        this.init();
    }

    init() {
        this.setupMutationObserver();
        this.setupIntersectionObserver();
        this.handleExistingVideos();
        this.setupKeyboardControl();
        this.createGlobalVolumeSlider(); // 创建全局音量滑块
    }

    // 创建全局音量滑块
    createGlobalVolumeSlider() {
        // 创建音量滑块容器
        this.volumeContainer = document.createElement('div');
        this.volumeContainer.className = 'global-volume-container';
        this.volumeContainer.style.cssText = `
            position: fixed;
            bottom: 50px; /* 调整为距离底部 50px */
            right: 10px; /* 调整为距离右侧 10px */
            width: 120px;
            height: 30px;
            background: rgba(0,0,0,0.7);
            border-radius: 15px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;

        // 创建音量条轨道
        this.volumeTrack = document.createElement('div');
        this.volumeTrack.className = 'volume-track';
        this.volumeTrack.style.cssText = `
            flex: 1;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        `;

        // 创建音量条填充
        this.volumeFill = document.createElement('div');
        this.volumeFill.className = 'volume-fill';
        this.volumeFill.style.cssText = `
            height: 100%;
            background: ${this.userSettings.progressBarColor};
            border-radius: 3px;
            width: ${this.currentVolume * 100}%;
            transition: width 0.1s ease;
        `;

        // 组装音量滑块
        this.volumeTrack.appendChild(this.volumeFill);
        this.volumeContainer.appendChild(this.volumeTrack);
        document.body.appendChild(this.volumeContainer);

        // 设置音量滑块事件
        this.setupVolumeSliderEvents();

        // 监听窗口缩放
        window.addEventListener('resize', () => this.adjustVolumeSliderPosition());
        // 初始化音量滑块位置
        this.adjustVolumeSliderPosition();
    }

    // 调整音量滑块位置
    adjustVolumeSliderPosition() {
        if (this.volumeContainer) {
            this.volumeContainer.style.right = '100px'; /* 保持距离右侧 10px */
            this.volumeContainer.style.bottom = '120px'; /* 保持距离底部 50px */
        }
    }

    // 设置音量滑块事件
    setupVolumeSliderEvents() {
        this.isVolumeDragging = false;

        // 点击设置音量
        this.volumeTrack.addEventListener('click', (e) => {
            if (this.isVolumeDragging) return;
            this.setVolume(e);
        });

        // 开始拖动
        this.volumeTrack.addEventListener('mousedown', (e) => {
            if (this.isVolumeDragging) return;
            this.startVolumeDrag(e);
        });

        // 悬停显示音量预览
        this.volumeTrack.addEventListener('mousemove', (e) => {
            this.showVolumePreview(e);
        });

        // 鼠标离开隐藏预览
        this.volumeTrack.addEventListener('mouseleave', () => {
            this.volumeTrack.title = '';
        });
    }

    // 设置音量
    setVolume(e) {
        const rect = this.volumeTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
        this.currentVolume = newVolume;
        this.updateAllVideosVolume(newVolume);
        localStorage.setItem('instagramVideoVolume', newVolume);
        this.updateVolumeSlider(newVolume);
    }

    // 开始拖动音量条
    startVolumeDrag(e) {
        this.isVolumeDragging = true;
        e.preventDefault();

        let lastUpdate = 0;
        const throttleDelay = 16;
        const rect = this.volumeTrack.getBoundingClientRect();

        const handleVolumeDrag = (e) => {
            const now = Date.now();
            if (now - lastUpdate < throttleDelay) {
                return;
            }
            lastUpdate = now;

            requestAnimationFrame(() => {
                if (!this.isVolumeDragging) return;
                const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const newVolume = Math.max(0, Math.min(1, dragX / rect.width));
                this.currentVolume = newVolume;
                this.updateAllVideosVolume(newVolume);
                localStorage.setItem('instagramVideoVolume', newVolume);
                this.updateVolumeSlider(newVolume);
            });
        };

        const stopVolumeDrag = () => {
            this.isVolumeDragging = false;
            document.removeEventListener('mousemove', handleVolumeDrag);
            document.removeEventListener('mouseup', stopVolumeDrag);
        };

        document.addEventListener('mousemove', handleVolumeDrag);
        document.addEventListener('mouseup', stopVolumeDrag);
    }

    // 更新音量滑块显示
    updateVolumeSlider(volume) {
        if (this.volumeFill) {
            this.volumeFill.style.width = `${volume * 100}%`;
        }
    }

    // 显示音量预览
    showVolumePreview(e) {
        const rect = this.volumeTrack.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const hoverVolume = Math.max(0, Math.min(1, hoverX / rect.width));
        this.volumeTrack.title = `音量: ${(hoverVolume * 100).toFixed(0)}%`;
    }

    // 更新所有视频的音量
    updateAllVideosVolume(volume) {
        this.videoControllers.forEach(controller => {
            controller.video.volume = volume;
        });
    }

    // 设置键盘控制
    setupKeyboardControl() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            )) {
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    this.seekVideo(-this.userSettings.defaultSeekTime); // 回退
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleRightArrowDown();
                    break;
                case ' ':
                case 'Space':
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.togglePlayPause(); // 空格键暂停/播放
                    break;
                case 'ArrowUp': // 音量增加
                    e.preventDefault();
                    e.stopPropagation();
                    this.adjustVolume(0.1);
                    break;
                case 'ArrowDown': // 音量减少
                    e.preventDefault();
                    e.stopPropagation();
                    this.adjustVolume(-0.1);
                    break;
            }
        }, {
            passive: false,
            capture: true
        });

        document.addEventListener('keyup', (e) => {
            if (!this.currentPlayingVideo) return;

            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            )) {
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleRightArrowUp();
                    break;
                case ' ':
                case 'Space':
                    if (this.currentPlayingVideo) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                    break;
            }
        }, {
            passive: false,
            capture: true
        });
    }

    // 调整音量
    adjustVolume(delta) {
        const newVolume = Math.max(0, Math.min(1, this.currentVolume + delta));
        this.currentVolume = newVolume;
        this.updateAllVideosVolume(newVolume);
        localStorage.setItem('instagramVideoVolume', newVolume);
        this.updateVolumeSlider(newVolume);
    }

    // 处理右键按下
    handleRightArrowDown() {
        if (!this.currentPlayingVideo) return;

        if (this.keyPressTimer) {
            clearTimeout(this.keyPressTimer);
        }

        if(this.isLongPress === undefined) this.isLongPress = false;

        this.keyPressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.startSpeedUp();
        }, 200);
    }

    // 处理右键释放
    handleRightArrowUp() {
        if (!this.currentPlayingVideo) return;

        if (this.keyPressTimer) {
            clearTimeout(this.keyPressTimer);
            this.keyPressTimer = null;
        }

        if (this.isLongPress) {
            this.stopSpeedUp();
        } else {
            this.seekVideo(this.userSettings.defaultSeekTime);
        }

        this.isLongPress = false;
    }

    // 开始倍速播放
    startSpeedUp() {
        if (this.currentPlayingVideo) {
            this.currentPlayingVideo.playbackRate = this.userSettings.defaultPlaybackRate;
        }
    }

    // 停止倍速播放
    stopSpeedUp() {
        if (this.currentPlayingVideo) {
            this.currentPlayingVideo.playbackRate = 1.0;
        }
    }

    // 快进/回退视频
    seekVideo(seconds) {
        if (this.currentPlayingVideo) {
            const newTime = Math.max(0, Math.min(
                this.currentPlayingVideo.currentTime + seconds,
                this.currentPlayingVideo.duration
            ));
            this.currentPlayingVideo.currentTime = newTime;
        }
    }

    // 切换播放/暂停
    togglePlayPause() {
        if (this.currentPlayingVideo) {
            if (this.currentPlayingVideo.paused) {
                this.currentPlayingVideo.play();
            } else {
                this.currentPlayingVideo.pause();
            }
        }
    }

    // 监听DOM变化，处理新加载的视频
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                        videos.forEach(video => this.addVideoController(video));

                        if (node.tagName === 'VIDEO') {
                            this.addVideoController(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监听视频是否在视口中
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    this.handleVideoInView(video);
                } else {
                    this.handleVideoOutOfView(video);
                }
            });
        }, {
            threshold: 0.5
        });
    }

    // 处理现有视频
    handleExistingVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => this.addVideoController(video));
    }

    // 为视频添加控制器
    addVideoController(video) {
        if (this.videoControllers.has(video)) return;

        const controller = new VideoController(video, this);
        this.videoControllers.set(video, controller);

        video.addEventListener('play', () => {
            this.setCurrentPlayingVideo(video);
        });

        this.intersectionObserver.observe(video);
    }

    // 设置当前播放的视频
    setCurrentPlayingVideo(video) {
        if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
            this.currentPlayingVideo.pause();
        }
        this.currentPlayingVideo = video;
        setTimeout(() => {
            this.currentPlayingVideo.muted = this.userSettings.defaultMuted;
            this.currentPlayingVideo.volume = this.currentVolume; // 应用保存的音量
        }, 500);
    }

    // 视频进入视口
    handleVideoInView(video) {
        const controller = this.videoControllers.get(video);
        if (controller) {
            controller.setVisible(true);
        }
    }

    // 视频离开视口
    handleVideoOutOfView(video) {
        const controller = this.videoControllers.get(video);
        if (controller) {
            controller.setVisible(false);
            video.pause();
        }
    }
}

// 单个视频控制器
class VideoController {
    constructor(video, manager) {
        this.video = video;
        this.manager = manager;
        this.vElement = video.parentElement;
        this.isVisible = false;
        this.isDragging = false;
        this.progressContainer = null;
        this.init();
    }

    init() {
        if (this.vElement.querySelector('.progress-container')) {
            return;
        }

        this.createProgressBar();
        this.setupEventListeners();
    }

    // 创建进度条
    createProgressBar() {
        // 创建进度条容器
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'progress-container';
        this.progressContainer.style.cssText = `
            position: absolute;
            bottom: 0.5%;
            left: 35px;
            right: 35px;
            height: 20px;
            background: rgba(0,0,0,0.7);
            border-radius: 15px;
            display: none;
            align-items: center;
            padding: 0 15px;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;

        // 创建时间显示
        this.timeDisplay = document.createElement('span');
        this.timeDisplay.className = 'time-display';
        this.timeDisplay.style.cssText = `
            color: white;
            font-size: 12px;
            margin-right: 10px;
            min-width: 80px;
            font-family: auto;
        `;

        // 创建进度条轨道
        this.progressTrack = document.createElement('div');
        this.progressTrack.className = 'progress-track';
        this.progressTrack.style.cssText = `
            flex: 1;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        `;

        // 创建进度条填充
        this.progressFill = document.createElement('div');
        this.progressFill.className = 'progress-fill';
        this.progressFill.style.cssText = `
            height: 100%;
            background: ${this.manager.userSettings.progressBarColor};
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s ease;
        `;

        // 组装进度条
        this.progressTrack.appendChild(this.progressFill);
        this.progressContainer.appendChild(this.timeDisplay);
        this.progressContainer.appendChild(this.progressTrack);

        // 确保父元素有相对定位
        this.vElement.style.position = 'relative';
        this.vElement.appendChild(this.progressContainer);

        // 监听窗口缩放以调整位置
        window.addEventListener('resize', () => this.adjustProgressBarPosition());
    }

    // 调整进度条位置
    adjustProgressBarPosition() {
        if (this.progressContainer) {
            const parentRect = this.vElement.getBoundingClientRect();
            this.progressContainer.style.left = '30px';
            this.progressContainer.style.right = '30px';
            this.progressContainer.style.bottom = '0.5%';
            this.progressContainer.style.height = '20px';
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 鼠标进入显示进度条
        this.vElement.addEventListener("mouseenter", () => {
            if (this.isVisible) {
                this.showProgressBar();
            }
        });

        // 鼠标离开隐藏进度条
        this.vElement.addEventListener("mouseleave", () => {
            if (!this.isDragging) {
                this.hideProgressBar();
            }
        });

        // 点击进度条跳转
        this.progressTrack.addEventListener('click', (e) => {
            if (this.isDragging) return;
            this.seekToPosition(e);
        });

        // 开始拖动进度条
        this.progressTrack.addEventListener('mousedown', (e) => {
            if (this.isDragging) return;
            this.startDrag(e);
        });

        // 悬停显示预览时间
        this.progressTrack.addEventListener('mousemove', (e) => {
            this.showPreviewTime(e);
        });

        // 监听视频时间更新
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // 监听视频元数据加载完成
        this.video.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        // 移除播放时自动显示进度条的逻辑
        // this.video.addEventListener('play', () => {
        //     this.showProgressBar();
        // });

        // 暂停时不自动隐藏进度条（依赖鼠标事件）
        this.video.addEventListener('pause', () => {
            // 保持现有状态，由鼠标事件控制
        });
    }

    // 显示进度条
    showProgressBar() {
        if (this.progressContainer) {
            this.progressContainer.style.display = 'flex';
        }
    }

    // 隐藏进度条
    hideProgressBar() {
        if (this.progressContainer && !this.isDragging) {
            this.progressContainer.style.display = 'none';
        }
    }

    // 更新进度条
    updateProgress() {
        if (this.video.duration && this.progressFill && this.timeDisplay) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = progress + '%';

            const currentTime = this.formatTime(this.video.currentTime);
            const duration = this.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${currentTime} / ${duration}`;
        }
    }

    // 跳转到指定位置
    seekToPosition(e) {
        const rect = this.progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * this.video.duration;
        this.video.currentTime = newTime;
    }

    // 开始拖动进度条
    startDrag(e) {
        this.isDragging = true;
        e.preventDefault();

        if (this.originMutedState === undefined) {
            this.originMutedState = this.video.muted;
        }
        this.video.muted = true;

        if (this.originPlayedState === undefined) {
            this.originPlayedState = this.video.paused;
        }
        this.video.pause();

        let lastUpdate = 0;
        const throttleDelay = 16;

        const rect = this.progressTrack.getBoundingClientRect();

        const handleDrag = (e) => {
            const now = Date.now();
            if (now - lastUpdate < throttleDelay) {
                return;
            }
            lastUpdate = now;

            requestAnimationFrame(() => {
                if (!this.isDragging) return;
                const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const newTime = (dragX / rect.width) * this.video.duration;

                if (Math.abs(this.video.currentTime - newTime) > 0.1) {
                    this.video.currentTime = newTime;
                }

                const progress = (newTime / this.video.duration) * 100;
                this.progressFill.style.width = progress + '%';

                const currentTime = this.formatTime(newTime);
                const duration = this.formatTime(this.video.duration);
                this.timeDisplay.textContent = `${currentTime} / ${duration}`;
            });
        };

        const stopDrag = () => {
            this.isDragging = false;

            setTimeout(() => {
                if (this.originMutedState !== undefined) {
                    this.video.muted = this.originMutedState;
                    this.originMutedState = undefined;
                }
                if (this.originPlayedState !== undefined) {
                    if (!this.originPlayedState) {
                        this.video.play();
                    } else {
                        this.video.pause();
                    }
                    this.originPlayedState = undefined;
                }
            }, 100);

            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);

            this.updateProgress();
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    // 显示进度预览时间
    showPreviewTime(e) {
        const rect = this.progressTrack.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const hoverTime = (hoverX / rect.width) * this.video.duration;
        this.progressTrack.title = this.formatTime(hoverTime);
    }

    // 格式化时间
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 设置可见性
    setVisible(visible) {
        this.isVisible = visible;
        if (!visible) {
            this.hideProgressBar();
        }
    }

    // 销毁控制器
    destroy() {
        if (this.progressContainer) {
            this.progressContainer.remove();
        }
    }
}

// 初始化管理器
let videoManager;

function initializeVideoManager() {
    if (!videoManager) {
        videoManager = new VideoProgressManager(userSettings);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVideoManager);
} else {
    initializeVideoManager();
}