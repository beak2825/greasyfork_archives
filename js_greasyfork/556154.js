// ==UserScript==
// @name         H5视频调速器 iOS毛玻璃美化版
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  针对手机浏览器的H5视频调速器，iOS毛玻璃风格，记忆播放速度
// @author       Mr.NullNull & 优化
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556154/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8%20iOS%E6%AF%9B%E7%8E%BB%E7%92%83%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556154/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8%20iOS%E6%AF%9B%E7%8E%BB%E7%92%83%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const CONFIG = {
        DEFAULT_SPEED: 1.0,
        MAX_SPEED: 16.0,
        MIN_SPEED: 0.1,
        STORAGE_KEY: 'videoPlaybackRate',
        POSITION: {
            bottom: '120px',
            right: '20px'
        },
        ANIMATION: {
            duration: '0.3s',
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        },
        COLORS: {
            glass: 'rgba(255, 255, 255, 0.25)',
            glassBorder: 'rgba(255, 255, 255, 0.3)',
            glassShadow: 'rgba(0, 0, 0, 0.1)',
            text: '#ffffff',
            active: 'rgba(255, 255, 255, 0.4)'
        },
        SIZES: {
            fontSize: '16px',
            buttonHeight: '44px',
            borderRadius: '6px', // 改为6px圆角
            buttonWidth: '80px',
            panelWidth: '90px',
            margin: '8px'
        },
        BLUR: {
            backdrop: 'blur(20px) saturate(180%)',
            webkitBackdrop: 'blur(20px) saturate(180%)'
        }
    };

    // 速度选项配置
    const SPEED_OPTIONS = [
        { value: 10, label: 'x10.00' },
        { value: 6, label: 'x6.00' },
        { value: 3, label: 'x3.00' },
        { value: 2, label: 'x2.00' },
        { value: 1.5, label: 'x1.50' },
        { value: 1.25, label: 'x1.25' },
        { value: 1, label: 'x1.00' }
    ];

    // 状态管理
    let currentSpeed = parseFloat(localStorage.getItem(CONFIG.STORAGE_KEY)) || CONFIG.DEFAULT_SPEED;
    let isPlaying = false;
    let isSpeedPanelVisible = false;

    // 主函数
    function initializeVideoController() {
        if (document.querySelector("#myPbrMain")) return;

        createStyles();
        createControllerHTML();
        setupEventListeners();
        initializeVideoSync();
    }

    // 创建 iOS 毛玻璃样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pbr-container {
                padding: 0;
                margin: 0;
                position: fixed;
                bottom: ${CONFIG.POSITION.bottom};
                right: ${CONFIG.POSITION.right};
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                pointer-events: none;
            }

            .pbr-container * {
                pointer-events: auto;
            }

            .pbr-speed-panel {
                display: none;
                margin-bottom: ${CONFIG.SIZES.margin};
                opacity: 0;
                transform: translateY(10px) scale(0.95);
                transition: all ${CONFIG.ANIMATION.duration} ${CONFIG.ANIMATION.easing};
            }

            .pbr-speed-panel.show {
                display: block;
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .pbr-speed-panel.hidden {
                display: none;
                opacity: 0;
                transform: translateY(10px) scale(0.95);
            }

            .pbr-btn {
                font-size: ${CONFIG.SIZES.fontSize};
                font-weight: 500;
                line-height: ${CONFIG.SIZES.buttonHeight};
                height: ${CONFIG.SIZES.buttonHeight};
                padding: 0 20px;
                margin-bottom: ${CONFIG.SIZES.margin};
                border-radius: ${CONFIG.SIZES.borderRadius};
                color: ${CONFIG.COLORS.text};
                cursor: pointer;
                white-space: nowrap;
                text-align: center;
                min-width: ${CONFIG.SIZES.buttonWidth};
                border: 1px solid ${CONFIG.COLORS.glassBorder};
                outline: none;
                user-select: none;
                backdrop-filter: ${CONFIG.BLUR.backdrop};
                -webkit-backdrop-filter: ${CONFIG.BLUR.webkitBackdrop};
                transition: all 0.2s ease;
                box-shadow: 
                    0 4px 24px ${CONFIG.COLORS.glassShadow},
                    0 2px 8px rgba(0, 0, 0, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                background: ${CONFIG.COLORS.glass};
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pbr-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 100%);
                border-radius: ${CONFIG.SIZES.borderRadius};
            }

            .pbr-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 
                    0 6px 28px ${CONFIG.COLORS.glassShadow},
                    0 3px 12px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            .pbr-btn:active {
                transform: translateY(0);
                background: ${CONFIG.COLORS.active};
            }

            .pbr-main-btn {
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .pbr-play-btn {
                font-weight: 600;
            }

            .pbr-speed-option {
                width: ${CONFIG.SIZES.panelWidth};
                text-align: center;
                font-weight: 500;
            }

            .pbr-speed-option.active {
                background: rgba(255, 255, 255, 0.35);
                border-color: rgba(255, 255, 255, 0.5);
            }

            /* 文字居中优化 */
            .pbr-btn span {
                display: block;
                width: 100%;
                text-align: center;
                line-height: inherit;
            }

            /* 移动端优化 */
            @media (max-width: 768px) {
                .pbr-container {
                    bottom: 100px;
                    right: 16px;
                }
                
                .pbr-btn {
                    font-size: 15px;
                    height: 42px;
                    line-height: 42px;
                    min-width: 76px;
                    border-radius: 6px;
                }

                .pbr-speed-option {
                    width: 86px;
                }
            }

            /* 小屏幕手机 */
            @media (max-width: 375px) {
                .pbr-container {
                    bottom: 90px;
                    right: 12px;
                }
                
                .pbr-btn {
                    font-size: 14px;
                    height: 40px;
                    line-height: 40px;
                    min-width: 72px;
                    padding: 0 16px;
                    border-radius: 6px;
                }

                .pbr-speed-option {
                    width: 82px;
                }
            }

            /* 防止与页面其他元素冲突 */
            .pbr-container * {
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建控制器HTML
    function createControllerHTML() {
        const container = document.createElement('div');
        container.id = 'myPbrMain';
        container.className = 'pbr-container';

        // 速度选项面板
        const speedPanel = document.createElement('div');
        speedPanel.className = 'pbr-speed-panel hidden';
        speedPanel.id = 'pbrSpeedPanel';

        SPEED_OPTIONS.forEach(option => {
            const btn = document.createElement('button');
            btn.className = `pbr-btn pbr-speed-option ${option.value === currentSpeed ? 'active' : ''}`;
            const span = document.createElement('span');
            span.textContent = option.label;
            btn.appendChild(span);
            btn.dataset.speed = option.value;
            speedPanel.appendChild(btn);
        });

        // 主控制按钮
        const mainBtn = document.createElement('button');
        mainBtn.className = 'pbr-btn pbr-main-btn';
        mainBtn.id = 'pbrMainBtn';
        const mainSpan = document.createElement('span');
        mainSpan.textContent = `x${currentSpeed.toFixed(2)}`;
        mainBtn.appendChild(mainSpan);

        // 播放/暂停按钮
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'pbr-btn pbr-play-btn';
        playPauseBtn.id = 'pbrPlayPauseBtn';
        const playSpan = document.createElement('span');
        playSpan.textContent = '播放';
        playPauseBtn.appendChild(playSpan);

        container.appendChild(speedPanel);
        container.appendChild(mainBtn);
        container.appendChild(playPauseBtn);
        document.body.appendChild(container);
    }

    // 设置事件监听
    function setupEventListeners() {
        const mainBtn = document.getElementById('pbrMainBtn');
        const speedPanel = document.getElementById('pbrSpeedPanel');
        const playPauseBtn = document.getElementById('pbrPlayPauseBtn');

        // 主按钮点击 - 切换速度面板
        mainBtn.addEventListener('click', toggleSpeedPanel);

        // 播放/暂停按钮点击
        playPauseBtn.addEventListener('click', handlePlayPause);

        // 速度选项点击
        speedPanel.addEventListener('click', (e) => {
            if (e.target.classList.contains('pbr-speed-option') || e.target.parentElement.classList.contains('pbr-speed-option')) {
                const btn = e.target.classList.contains('pbr-speed-option') ? e.target : e.target.parentElement;
                const speed = parseFloat(btn.dataset.speed);
                setVideoSpeed(speed);
            }
        });

        // 视频事件监听
        document.addEventListener('play', handleVideoPlay, true);
        document.addEventListener('pause', handleVideoPause, true);
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('scroll', updatePlayState);
    }

    // 切换速度面板
    function toggleSpeedPanel() {
        const speedPanel = document.getElementById('pbrSpeedPanel');
        isSpeedPanelVisible = !isSpeedPanelVisible;

        if (isSpeedPanelVisible) {
            speedPanel.classList.remove('hidden');
            speedPanel.classList.add('show');
        } else {
            speedPanel.classList.remove('show');
            speedPanel.classList.add('hidden');
        }
    }

    // 隐藏速度面板
    function hideSpeedPanel() {
        const speedPanel = document.getElementById('pbrSpeedPanel');
        speedPanel.classList.remove('show');
        speedPanel.classList.add('hidden');
        isSpeedPanelVisible = false;
    }

    // 处理播放/暂停
    function handlePlayPause() {
        const targetVideo = getTargetVideo();
        if (targetVideo) {
            setTimeout(() => {
                scrollToVideoCenter(targetVideo);
                togglePlayPause(targetVideo);
            }, 50);
        }
    }

    // 处理视频播放事件
    function handleVideoPlay(e) {
        if (e.target.tagName === 'VIDEO') {
            e.target.playbackRate = currentSpeed;
            if (e.target === getTargetVideo()) {
                isPlaying = true;
                updatePlayPauseButton();
            }
        }
    }

    // 处理视频暂停事件
    function handleVideoPause(e) {
        if (e.target.tagName === 'VIDEO' && e.target === getTargetVideo()) {
            isPlaying = false;
            updatePlayPauseButton();
        }
    }

    // 处理文档点击（点击外部隐藏面板）
    function handleDocumentClick(e) {
        const container = document.getElementById('myPbrMain');
        if (!container.contains(e.target)) {
            hideSpeedPanel();
        }
    }

    // 获取目标视频
    function getTargetVideo() {
        const videos = Array.from(document.querySelectorAll('video'));
        if (videos.length === 0) return null;
        if (videos.length === 1) return videos[0];

        // 找到最靠近视口中心的视频
        const viewportCenterY = window.scrollY + window.innerHeight / 2;
        return videos.reduce((closest, video) => {
            const rect = video.getBoundingClientRect();
            const videoCenterY = window.scrollY + rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenterY - videoCenterY);
            
            return distance < closest.distance ? 
                { video, distance } : closest;
        }, { video: null, distance: Infinity }).video;
    }

    // 滚动到视频中心
    function scrollToVideoCenter(video) {
        const rect = video.getBoundingClientRect();
        const targetTop = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);
        
        window.scrollTo({
            top: targetTop,
            left: 0,
            behavior: 'smooth'
        });
    }

    // 切换播放/暂停
    function togglePlayPause(video) {
        if (video.paused) {
            video.play().catch(console.error);
        } else {
            video.pause();
        }
        updatePlayState();
    }

    // 设置视频速度
    function setVideoSpeed(speed) {
        currentSpeed = Math.max(CONFIG.MIN_SPEED, Math.min(speed, CONFIG.MAX_SPEED));
        localStorage.setItem(CONFIG.STORAGE_KEY, currentSpeed.toString());
        
        syncAllVideosSpeed();
        updateMainButton();
        updateSpeedOptions();
        hideSpeedPanel();
    }

    // 同步所有视频速度
    function syncAllVideosSpeed() {
        document.querySelectorAll('video').forEach(video => {
            video.playbackRate = currentSpeed;
        });
    }

    // 更新播放状态
    function updatePlayState() {
        const targetVideo = getTargetVideo();
        if (targetVideo) {
            isPlaying = !targetVideo.paused;
            updatePlayPauseButton();
        }
    }

    // 更新播放/暂停按钮
    function updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('pbrPlayPauseBtn');
        if (playPauseBtn) {
            const span = playPauseBtn.querySelector('span');
            if (span) {
                span.textContent = isPlaying ? '暂停' : '播放';
            }
        }
    }

    // 更新主按钮
    function updateMainButton() {
        const mainBtn = document.getElementById('pbrMainBtn');
        if (mainBtn) {
            const span = mainBtn.querySelector('span');
            if (span) {
                span.textContent = `x${currentSpeed.toFixed(2)}`;
            }
        }
    }

    // 更新速度选项激活状态
    function updateSpeedOptions() {
        const options = document.querySelectorAll('.pbr-speed-option');
        options.forEach(option => {
            const speed = parseFloat(option.dataset.speed);
            if (Math.abs(speed - currentSpeed) < 0.01) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // 初始化视频同步
    function initializeVideoSync() {
        // 初始同步速度
        setTimeout(() => syncAllVideosSpeed(), 500);

        // 定期同步按钮状态
        const syncInterval = setInterval(() => {
            updatePlayState();
            if (getTargetVideo()) {
                clearInterval(syncInterval);
            }
        }, 500);

        // 10秒后清除同步定时器
        setTimeout(() => clearInterval(syncInterval), 10000);
    }

    // 初始化脚本
    const initInterval = setInterval(() => {
        if (document.querySelector('video')) {
            initializeVideoController();
            clearInterval(initInterval);
        }
    }, 1000);

    // 10秒后清除初始化定时器
    setTimeout(() => clearInterval(initInterval), 10000);
})();