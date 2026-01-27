// ==UserScript==
// @name         e621 播放器优化
// @namespace    Lecrp.com
// @version      1.13
// @description  隐藏原生控件，添加视频窗口外的控件，添加全局生效快捷键，支持移动设备
// @author       jcjyids
// @match        https://e621.net/posts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558723/e621%20%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558723/e621%20%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // 可配置变量区域
    // ================================

    // 控件容器样式设置
    const CONTROL_STYLES = {
        marginTop: '3px', // 控件与视频（顶部）的间隙
        marginBottom: '.5rem', // 控件底部的间隙
        cssVariable: '--color-section-lighten-5', // 背景色，优先使用此CSS变量（设为null禁用此功能）
        bgColor: 'rgba(31, 60, 103, 1)', // 回退背景颜色
        borderRadius: '3px' // 圆角半径，设为0禁用圆角
    };

    // 快捷键设置
    const KEY_BINDINGS = {
        playPause: 'Space', //空格暂停/播放
        seekForward: 'ArrowRight', //右方向键快进
        seekBackward: 'ArrowLeft', //左方向键快退
        volumeUp: 'ArrowUp', //上方向键提高音量
        volumeDown: 'ArrowDown', //下方向键降低音量
        fullscreen: 'Digit2' //"2"全屏
    };

    // 时间设置
    const SEEK_TIME = 5; // 快进/快退秒数
    const LONG_PRESS_SPEED = 5; // 长按加速的倍速
    const KEY_LONG_PRESS_THRESHOLD = 300; // 长按识别阈值（毫秒）

    // 音量设置
    const VOLUME_STEP = 0.05; // 音量调整步长（5%）

    // 点击反馈设置（覆盖视频的播放/暂停图标）
    const FEEDBACK_SETTINGS = {
        totalDuration: 300, // 总显示时间（毫秒）
        fadeStart: 0.5, // 渐隐开始时间占比（50%）
        iconSize: 64 // 图标大小
    };

    // 手势识别设置
    const GESTURE_SETTINGS = {
        clickTimeout: 300, // 单击识别超时（毫秒）
        longPressDelay: 500 // 长按识别延迟（毫秒）
    };

    // 视频检测设置
    const DETECTION_SETTINGS = {
        maxWaitTime: 5000, // 最大等待时间（毫秒）
        checkInterval: 300, // 检测间隔（毫秒）
        maxAttempts: 20 // 最大检测次数
    };

    // 进度条设置
    const PROGRESS_SEGMENTS = 50000; // 固定分段

    // 速度选项配置
    const SPEED_OPTIONS = [
        { value: 0.25, label: '0.25x' },
        { value: 0.5, label: '0.5x' },
        { value: 0.75, label: '0.75x' },
        { value: 1, label: '1x' },
        { value: 1.25, label: '1.25x' },
        { value: 1.5, label: '1.5x' },
        { value: 2, label: '2x' },
        { value: 3, label: '3x' }
    ];

    // 播放进度 00:00.0（分:秒.十分之一秒）
    function formatTimeCurrent(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const tenth = Math.floor((seconds * 10) % 10); // 十分之一秒
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenth}`;
    }

    // 总时长 00:00（分:秒）
    function formatTimeDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    // ================================
    // 核心功能实现
    // ================================

    let videoElement = null;
    let customControls = null;
    let isFullscreen = false;
    let detectionTimer = null;
    let detectionStartTime = null;
    let isInitialized = false;
    let detectionAttempts = 0;
    let globalShortcutsBound = false;
    let timeUpdateRAFId = null;
    let timeUpdateActive = false;
    let documentTouchEndHandler = null;
    let lastRoundedTime = -1;

    // 存储事件处理函数引用，便于移除
    let videoClickHandler = null;
    let videoDoubleClickHandler = null;
    let globalKeydownHandler = null;
    let globalKeyupHandler = null;
    let videoContextMenuHandler = null;
    let videoTouchStartHandler = null;
    let videoTouchEndHandler = null;
    let videoTouchMoveHandler = null;

    // 手势识别状态
    let tapState = {
        tapCount: 0,
        lastTapTime: 0,
        tapTimer: null,
        longPressTimer: null,
        originalPlaybackRate: 1,
        isScrolling: false,
        touchStartX: 0,
        touchStartY: 0,
        longPressTriggered: false
    };

    // 键盘状态跟踪
    const keyState = {
        right: { pressed: false, startTime: 0, originalRate: 1, longPressTimer: null },
        left: { pressed: false, startTime: 0, originalRate: 1, longPressTimer: null }
    };

    // 设备能力检测
    function getDeviceCapabilities() {
        return {
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isMobile: window.innerWidth < 768,
            hasKeyboard: !('ontouchstart' in window) || window.innerWidth > 1024
        };
    }

    // 获取CSS变量值的函数
    function getCSSVariable(variableName) {
        if (!variableName) return null;

        try {
            // 首先尝试从根元素获取
            const rootValue = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
            if (rootValue) return rootValue;

            // 如果根元素没有，尝试从body获取
            const bodyValue = getComputedStyle(document.body).getPropertyValue(variableName).trim();
            if (bodyValue) return bodyValue;

            // 尝试其他常见的选择器
            const selectors = ['.post-section', 'main', '#page', '.content'];
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const value = getComputedStyle(element).getPropertyValue(variableName).trim();
                    if (value) return value;
                }
            }
        } catch (error) {
            console.warn(`获取CSS变量 ${variableName} 时出错:`, error);
        }

        return null;
    }

    // 获取背景颜色（优先级：CSS变量 > 指定颜色）
    function getBackgroundColor() {
        // 如果配置了CSS变量且不为null，优先尝试获取
        if (CONTROL_STYLES.cssVariable) {
            const cssColor = getCSSVariable(CONTROL_STYLES.cssVariable);
            if (cssColor) {
                return cssColor;
            } else {
                console.warn(`未找到CSS变量 ${CONTROL_STYLES.cssVariable}，使用回退颜色`);
            }
        }

        // 回退到指定的背景颜色
        return CONTROL_STYLES.bgColor;
    }

    // 获取颜色值（CSS变量优先，有回退值）
    function getColorWithFallback(variableName, defaultValue) {
        const value = getCSSVariable(variableName);
        return value || defaultValue;
    }

    // 初始化函数
    function init() {
        if (isInitialized) return;

        detectionStartTime = Date.now();
        detectionAttempts = 0;
        startVideoDetection();

        // 仅电脑端设置全局快捷键
        const deviceCapabilities = getDeviceCapabilities();
        if (deviceCapabilities.hasKeyboard) {
            setupGlobalShortcuts();
        }
    }

    // 开始视频检测
    function startVideoDetection() {
        // 先立即尝试查找一次
        if (tryFindVideo()) {
            return;
        }

        // 设置定时检测
        detectionTimer = setInterval(() => {
            detectionAttempts++;

            if (tryFindVideo()) {
                // 找到视频，停止检测
                stopDetection();
                return;
            }

            // 检查停止条件：超时或超过最大尝试次数
            const isTimeout = Date.now() - detectionStartTime > DETECTION_SETTINGS.maxWaitTime;
            const maxAttemptsReached = detectionAttempts >= DETECTION_SETTINGS.maxAttempts;

            if (isTimeout || maxAttemptsReached) {
                stopDetection();
            }
        }, DETECTION_SETTINGS.checkInterval);
    }

    // 停止视频检测
    function stopDetection() {
        if (detectionTimer) {
            clearInterval(detectionTimer);
            detectionTimer = null;
        }
    }

    // 尝试查找视频元素
    function tryFindVideo() {
        if (videoElement && videoElement.parentNode) {
            return true; // 视频已存在且有效
        }

        const newVideo = findVideoElement();
        if (newVideo) {
            videoElement = newVideo;
            setupVideoPlayer();
            return true;
        }

        return false;
    }

    // 查找视频元素
    function findVideoElement() {
        const videos = document.querySelectorAll('video');
        return videos.length > 0 ? videos[0] : null;
    }

    // 设置视频播放器
    function setupVideoPlayer() {
        if (!videoElement) return;

        // 增强的重复初始化检查
        if (isInitialized) {
            return;
        }

        // 检查是否已经设置过自定义控件
        if (videoElement.parentNode.querySelector('.custom-video-controls')) {
            isInitialized = true;
            return;
        }

        setupVideoElement();
        createCustomControls();
        setupFullscreenListener();
        isInitialized = true;
    }

    // 设置视频事件监听
    function setupVideoEvents() {
        // 先移除可能存在的监听器
        removeVideoEvents();

        const deviceCapabilities = getDeviceCapabilities();

        // 阻止默认的蓝色覆盖层和浏览器菜单
        setupVideoPreventions();

        if (deviceCapabilities.isMobile) {
            // 移动端：使用触摸事件处理手势
            setupMobileTouchEvents();
        } else {
            // 电脑端：保持原有逻辑
            setupDesktopEvents();
        }
    }

    // 设置视频防护措施
    function setupVideoPreventions() {
        // 移除默认焦点样式和选择
        Object.assign(videoElement.style, {
            outline: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
        });

        // 阻止上下文菜单（长按菜单）
        videoContextMenuHandler = function(event) {
            event.preventDefault();
            return false;
        };
        videoElement.addEventListener('contextmenu', videoContextMenuHandler);
    }

    // 设置移动端触摸事件
    function setupMobileTouchEvents() {
        videoTouchStartHandler = function(event) {
            // 记录触摸开始位置
            tapState.touchStartX = event.touches[0].clientX;
            tapState.touchStartY = event.touches[0].clientY;
            tapState.isScrolling = false;

            // 设置长按定时器
            tapState.longPressTimer = setTimeout(() => {
                handleLongPress();
            }, GESTURE_SETTINGS.longPressDelay);
        };

        videoTouchMoveHandler = function(event) {
            // 如果触发长按，则阻止默认行为以避免触发浏览器下拉刷新
            if (tapState.longPressTriggered) {
                event.preventDefault();
                return;
            }

            if (!tapState.isScrolling) {
                const touchX = event.touches[0].clientX;
                const touchY = event.touches[0].clientY;
                const deltaX = Math.abs(touchX - tapState.touchStartX);
                const deltaY = Math.abs(touchY - tapState.touchStartY);

                // 如果移动距离超过10px，认为是滚动
                if (deltaX > 10 || deltaY > 10) {
                    tapState.isScrolling = true;
                    // 清除长按定时器
                    if (tapState.longPressTimer) {
                        clearTimeout(tapState.longPressTimer);
                        tapState.longPressTimer = null;
                    }
                }
            }
        };

        videoTouchEndHandler = function(event) {
            // 清除长按定时器
            if (tapState.longPressTimer) {
                clearTimeout(tapState.longPressTimer);
                tapState.longPressTimer = null;
            }

            // 如果是划动，不处理点击
            if (tapState.isScrolling) {
                resetTapState();
                return;
            }

            // 如果长按已经触发，则恢复速度，并重置标志
            if (tapState.longPressTriggered) {
                videoElement.playbackRate = tapState.originalPlaybackRate;
                tapState.longPressTriggered = false;
                return;
            }

            // 处理点击手势（单击/双击）
            handleMobileTap(event);
        };

        videoElement.addEventListener('touchstart', videoTouchStartHandler);
        videoElement.addEventListener('touchmove', videoTouchMoveHandler);
        videoElement.addEventListener('touchend', videoTouchEndHandler);
    }

    // 处理移动端点击手势
    function handleMobileTap(event) {
        // 如果已经触发了长按，则跳过点击处理
        if (tapState.longPressTriggered) {
            tapState.longPressTriggered = false; // 重置状态
            return;
        }

        const currentTime = Date.now();
        const rect = videoElement.getBoundingClientRect();
        const tapX = event.changedTouches[0].clientX - rect.left;
        const videoWidth = rect.width;

        tapState.tapCount++;

        if (tapState.tapCount === 1) {
            // 第一次点击，启动单击定时器
            tapState.lastTapTime = currentTime;
            tapState.tapTimer = setTimeout(() => {
                // 定时器触发，说明是单击
                handleSingleTap();
                resetTapState();
            }, GESTURE_SETTINGS.clickTimeout);
        } else if (tapState.tapCount === 2) {
            // 第二次点击，检查时间间隔
            const timeDiff = currentTime - tapState.lastTapTime;
            if (timeDiff < GESTURE_SETTINGS.clickTimeout) {
                // 是双击，取消单击定时器
                clearTimeout(tapState.tapTimer);
                handleDoubleTap(tapX, videoWidth);
            }
            resetTapState();
        }
    }

    // 重置点击状态
    function resetTapState() {
        tapState.tapCount = 0;
        tapState.tapTimer = null;
        tapState.lastTapTime = 0;
        tapState.isScrolling = false;
        tapState.longPressTriggered = false;
    }

    // 处理单击
    function handleSingleTap() {
        // 显示点击反馈
        showClickFeedback();

        // 切换播放状态
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }

    // 处理双击
    function handleDoubleTap(tapX, videoWidth) {
        // 判断点击位置（左半区或右半区）
        if (tapX < videoWidth / 2) {
            // 左半区：快退
            seekVideo(-SEEK_TIME);
        } else {
            // 右半区：快进
            seekVideo(SEEK_TIME);
        }
    }

    // 处理长按
    function handleLongPress() {
        // 标记长按已触发
        tapState.longPressTriggered = true;

        // 保存原始播放速度
        tapState.originalPlaybackRate = videoElement.playbackRate;

        // 设置倍速
        videoElement.playbackRate = LONG_PRESS_SPEED;
    }

    // 设置电脑端事件
    function setupDesktopEvents() {
        // 点击视频切换播放/暂停
        videoClickHandler = function(event) {
            event.stopPropagation();

            // 显示点击反馈
            showClickFeedback();

            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        };

        // 双击视频切换全屏
        videoDoubleClickHandler = function(event) {
            event.stopPropagation();
            toggleFullscreen();
        };

        // 添加事件监听
        videoElement.addEventListener('click', videoClickHandler);
        videoElement.addEventListener('dblclick', videoDoubleClickHandler);
        videoElement.style.cursor = 'pointer';
    }

    // 显示点击反馈
    function showClickFeedback() {
        const feedbackContainer = videoElement.parentNode.querySelector('.video-feedback');
        if (!feedbackContainer) return;

        // 设置反馈图标：显示即将切换到的状态
        const iconSvg = videoElement.paused ?
              // 当前暂停，点击后将播放，所以显示播放图标
              `<svg xmlns="http://www.w3.org/2000/svg" width="${FEEDBACK_SETTINGS.iconSize}" height="${FEEDBACK_SETTINGS.iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>` :
        // 当前播放，点击后将暂停，所以显示暂停图标
        `<svg xmlns="http://www.w3.org/2000/svg" width="${FEEDBACK_SETTINGS.iconSize}" height="${FEEDBACK_SETTINGS.iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>`;

        feedbackContainer.innerHTML = iconSvg;

        // 计算渐隐时间
        const fadeStartTime = FEEDBACK_SETTINGS.totalDuration * FEEDBACK_SETTINGS.fadeStart;
        const fadeDuration = FEEDBACK_SETTINGS.totalDuration - fadeStartTime;

        // 立即显示
        feedbackContainer.style.opacity = '0.8';
        feedbackContainer.style.transition = 'none';

        // 强制重绘
        feedbackContainer.offsetHeight;

        // 设置渐隐
        feedbackContainer.style.transition = `opacity ${fadeDuration}ms linear`;

        // 开始渐隐
        setTimeout(() => {
            feedbackContainer.style.opacity = '0';
        }, fadeStartTime);
    }

    // 移除视频事件监听
    function removeVideoEvents() {
        if (videoElement) {
            if (videoClickHandler) {
                videoElement.removeEventListener('click', videoClickHandler);
            }
            if (videoDoubleClickHandler) {
                videoElement.removeEventListener('dblclick', videoDoubleClickHandler);
            }
            if (videoContextMenuHandler) {
                videoElement.removeEventListener('contextmenu', videoContextMenuHandler);
            }
            if (videoTouchStartHandler) {
                videoElement.removeEventListener('touchstart', videoTouchStartHandler);
            }
            if (videoTouchMoveHandler) {
                videoElement.removeEventListener('touchmove', videoTouchMoveHandler);
            }
            if (videoTouchEndHandler) {
                videoElement.removeEventListener('touchend', videoTouchEndHandler);
            }
            videoElement.style.cursor = '';
        }

        // 清除所有定时器
        if (tapState.tapTimer) {
            clearTimeout(tapState.tapTimer);
        }
        if (tapState.longPressTimer) {
            clearTimeout(tapState.longPressTimer);
        }
        resetTapState();
    }

    // 设置视频元素
    function setupVideoElement() {
        // 初始隐藏原生控件
        videoElement.controls = false;

        const wrapper = videoElement.parentNode;

        // 创建视频专用容器
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        videoContainer.style.position = 'relative';

        // 调整父容器布局
        const parentEl = document.querySelector('#image-container');
        if (parentEl) {
            parentEl.style.flexDirection = 'column';
        }

        // 插入新结构
        wrapper.appendChild(videoContainer);

        // 移动视频到新容器
        videoContainer.appendChild(videoElement);

        // 创建点击反馈容器
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'video-feedback';
        videoContainer.appendChild(feedbackContainer);

        // 设置反馈容器样式 - 只覆盖视频区域
        Object.assign(feedbackContainer.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10',
            opacity: '0',
            pointerEvents: 'none',
            transition: `opacity ${FEEDBACK_SETTINGS.totalDuration * (1 - FEEDBACK_SETTINGS.fadeStart)}ms linear`
        });

        // 设置视频事件监听
        setupVideoEvents();
    }

    // 创建自定义速度选择器
    function createCustomSpeedSelect() {
        // 添加全局样式
        if (!document.getElementById('custom-speed-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-speed-styles';
            style.textContent = `
                .custom-speed-select .speed-dropdown::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
                .custom-speed-select .speed-dropdown {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .speed-option::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 5px;
                    background: #0088ff;
                    display: var(--selected-indicator, none);
                }
            `;
            document.head.appendChild(style);
        }

        const speedContainer = document.createElement('div');
        speedContainer.className = 'custom-speed-select';
        speedContainer.style.position = 'relative';
        speedContainer.style.display = 'inline-block';
        speedContainer.setAttribute('translate', 'no');

        // 获取颜色变量
        const separatorColor = getColorWithFallback('--color-tag-general', 'rgba(255, 255, 255, 0.15)');
        const hoverBgColor = getColorWithFallback('--color-section-lighten-5', 'rgba(255, 255, 255, 0.1)');

        // 当前速度显示按钮
        const speedButton = document.createElement('button');
        speedButton.className = 'speed-button';
        speedButton.textContent = '1x';

        // 应用样式
        Object.assign(speedButton.style, {
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '13px',
            fontFamily: 'Monaco,Verdana',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease',
            minWidth: '80px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '4px'
        });

        // 添加下拉箭头
        const arrowSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;
        speedButton.innerHTML = `1x ${arrowSvg}`;

        // 速度选项下拉菜单
        const speedDropdown = document.createElement('div');
        speedDropdown.className = 'speed-dropdown';

        Object.assign(speedDropdown.style, {
            position: 'absolute',
            top: 'calc(100% + 5px)',
            bottom: 'auto',
            left: '0',
            background: '#222222',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            opacity: '0',
            visibility: 'hidden',
            transform: 'translateY(10px)',
            transition: 'all 0.2s ease',
            zIndex: '1000',
            overflowY: 'auto'
        });

        // 创建速度选项
        SPEED_OPTIONS.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'speed-option';
            optionElement.dataset.value = option.value;
            optionElement.textContent = option.label;

            Object.assign(optionElement.style, {
                padding: '8px 0',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                fontFamily: 'Monaco,Verdana',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                background: 'transparent',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box'
            });

            // 鼠标悬停效果
            optionElement.addEventListener('mouseenter', () => {
                optionElement.style.background = hoverBgColor;
                optionElement.style.borderRight = `5px solid ${separatorColor}`;
                optionElement.style.color = 'white';
            });

            optionElement.addEventListener('mouseleave', () => {
                optionElement.style.background = 'transparent';
                optionElement.style.borderRight = 'none';
                optionElement.style.color = 'rgba(255, 255, 255, 0.9)';
            });

            // 点击选择速度
            optionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = parseFloat(optionElement.dataset.value);
                videoElement.playbackRate = value;
                speedButton.innerHTML = `${option.label} ${arrowSvg}`;

                // 更新激活状态
                speedDropdown.querySelectorAll('.speed-option').forEach(opt => {
                    opt.style.background = 'transparent';
                    opt.style.color = 'rgba(255, 255, 255, 0.9)';
                    opt.style.setProperty('--selected-indicator', 'none');
                });

                // 为选中项添加左侧指示器
                optionElement.style.setProperty('--selected-indicator', 'block');

                // 关闭下拉菜单
                hideSpeedDropdown();
            });

            speedDropdown.appendChild(optionElement);

            // 添加分隔线（除了最后一个选项）
            if (index < SPEED_OPTIONS.length - 1) {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 2px;
                    background: ${separatorColor};
                    margin: 0 12px;
                `;
                speedDropdown.appendChild(separator);
            }
        });

        // 设置默认选中项（1x）
        const defaultOption = speedDropdown.querySelector('.speed-option[data-value="1"]');
        if (defaultOption) {
            defaultOption.style.setProperty('--selected-indicator', 'block');
        }

        // 按钮交互效果
        speedButton.addEventListener('mouseenter', () => {
            speedButton.style.background = 'rgba(255, 255, 255, 0.15)';
            speedButton.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });

        speedButton.addEventListener('mouseleave', () => {
            if (speedDropdown.style.visibility !== 'visible') {
                speedButton.style.background = 'rgba(255, 255, 255, 0.1)';
                speedButton.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });

        // 点击按钮切换下拉菜单
        speedButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (speedDropdown.style.visibility === 'visible') {
                hideSpeedDropdown();
            } else {
                showSpeedDropdown();
            }
        });

        // 显示下拉菜单
        function showSpeedDropdown() {
            const buttonRect = speedButton.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - buttonRect.bottom;
            const MIN_SPACE_BELOW = 250; // 指定的最小空间阈值（像素）

            // 重置下拉菜单位置
            Object.assign(speedDropdown.style, {
                top: '',
                bottom: '',
                left: '0',
                width: speedButton.offsetWidth + 'px'
            });

            // 使用阈值判断方向
            if (spaceBelow < MIN_SPACE_BELOW) {
                // 空间小于阈值，向上展开
                speedDropdown.style.bottom = 'calc(100% + 5px)';
                speedDropdown.style.top = 'auto';
            } else {
                // 空间足够，向下展开
                speedDropdown.style.top = 'calc(100% + 5px)';
                speedDropdown.style.bottom = 'auto';
            }

            // 显示下拉菜单（保持原有动画）
            Object.assign(speedDropdown.style, {
                opacity: '1',
                visibility: 'visible',
                transform: 'translateY(0)'
            });
            speedButton.style.background = 'rgba(255, 255, 255, 0.15)';
            speedButton.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        }

        // 隐藏下拉菜单
        function hideSpeedDropdown() {
            Object.assign(speedDropdown.style, {
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(10px)'
            });
            speedButton.style.background = 'rgba(255, 255, 255, 0.1)';
            speedButton.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }

        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!speedContainer.contains(e.target)) {
                hideSpeedDropdown();
            }
        });

        // 移动端触摸
        let MtouchStartX, MtouchStartY;

        speedButton.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            MtouchStartX = e.touches[0].clientX;
            MtouchStartY = e.touches[0].clientY;
        });

        speedButton.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const distance = Math.sqrt(
                Math.pow(touchEndX - MtouchStartX, 2) +
                Math.pow(touchEndY - MtouchStartY, 2)
            );

            if (distance <= 20) {
                if (speedDropdown.style.visibility === 'visible') {
                    hideSpeedDropdown();
                } else {
                    showSpeedDropdown();
                }
            }
        });

        // 添加到容器
        speedContainer.appendChild(speedButton);
        speedContainer.appendChild(speedDropdown);

        return speedContainer;
    }

    // 创建自定义控件
    function createCustomControls() {
        // 创建控件容器
        customControls = document.createElement('div');
        customControls.className = 'custom-video-controls';

        // 获取背景颜色
        const backgroundColor = getBackgroundColor();

        // 应用样式
        Object.assign(customControls.style, {
            width: '100%',
            background: backgroundColor,
            borderRadius: CONTROL_STYLES.borderRadius,
            marginTop: CONTROL_STYLES.marginTop,
            marginBottom: CONTROL_STYLES.marginBottom,
            display: 'flex',
            flexDirection: 'column',
            padding: '5px 10px',
            boxSizing: 'border-box',
            gap: '5px',
        });

        // 创建第一行：进度条
        const progressRow = createProgressRow();
        customControls.appendChild(progressRow);

        // 创建第二行：其他控件
        const controlsRow = createControlsRow();
        customControls.appendChild(controlsRow);

        // 添加到视频包装器（在视频容器之后）
        const wrapper = document.querySelector('#image-container');
        if (wrapper) {
            wrapper.appendChild(customControls);
        } else {
            videoElement.parentNode.appendChild(customControls);
        }

        // 绑定事件
        bindControlEvents();
    }

    // 创建进度条行（修正版：完美支持垂直滚动 + 水平防误触）
    function createProgressRow() {
        const row = document.createElement('div');
        // 设为 relative 以便放置覆盖层
        row.style.cssText = 'display: flex; align-items: center; height: 24px; position: relative;';

        // 1. 原生进度条 (用于显示和PC端操作)
        const progressBar = document.createElement('input');
        progressBar.type = 'range';
        progressBar.className = 'video-progress';
        progressBar.value = '0';
        progressBar.min = '0';
        progressBar.max = PROGRESS_SEGMENTS - 1;
        progressBar.step = '1';
        progressBar.style.cssText = 'flex: 1; height: 6px; padding: 0px; display: block;';

        row.appendChild(progressBar);

        // 获取设备能力
        const deviceCapabilities = getDeviceCapabilities();

        // ==========================================
        // 移动端专属逻辑：添加透明手势遮罩层
        // ==========================================
        if (deviceCapabilities.isTouch) {
            // 创建遮罩层覆盖在进度条上
            const touchMask = document.createElement('div');
            Object.assign(touchMask.style, {
                position: 'absolute',
                inset: '0px 0px',
                left: '0',
                right: '0',
                zIndex: '10', // 确保在 input 之上
                cursor: 'pointer',
                touchAction: 'pan-y',
                webkitUserSelect: 'none' // 防止长按选中文字
            });

            // 变量记录触摸状态
            let startX = 0;
            let startY = 0;
            let initialVideoTime = 0;
            let isDragging = false; // 状态：正在拖拽进度
            let isScrolling = false; // 状态：正在滚动页面
            let rect = null;

            // 触摸开始
            touchMask.addEventListener('touchstart', (e) => {
                // 记录初始数据
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                initialVideoTime = videoElement.currentTime;
                rect = progressBar.getBoundingClientRect();

                // 重置状态
                isDragging = false;
                isScrolling = false;

            }, { passive: false });

            // 触摸移动
            touchMask.addEventListener('touchmove', (e) => {
                // 1. 如果已经判定为滚动页面，直接退出，让浏览器处理滚动
                if (isScrolling) {
                    return;
                }

                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                // 2. 如果状态尚未确定（即手指刚开始移动），进行方向判断
                if (!isDragging) {
                    // 如果垂直移动距离 > 水平移动距离，或者垂直移动绝对值超过了阈值
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        isScrolling = true;
                        return; // 放行，浏览器会接管后续滚动
                    }

                    // 如果水平移动超过 10px (防抖阈值)，且水平 > 垂直 -> 判定为调整进度
                    if (Math.abs(deltaX) > 10) {
                        isDragging = true;
                        // 锁定方向，后续逻辑会执行 preventDefault
                    }
                }

                // 3. 只有当确认为拖拽进度时，才拦截事件
                if (isDragging) {
                    // 阻止默认行为（阻止浏览器翻页或滚动）
                    if (e.cancelable) {
                        e.preventDefault();
                    }

                    if (videoElement.duration) {
                        // 相对滑动逻辑 / 远程控制
                        const sensitivity = 1.0; // 灵敏度 1:1
                        const timeDelta = (deltaX / rect.width) * videoElement.duration * sensitivity;

                        let newTime = initialVideoTime + timeDelta;
                        newTime = Math.max(0, Math.min(newTime, videoElement.duration));

                        videoElement.currentTime = newTime;

                        // 更新UI
                        lastRoundedTime = -1;
                        checkAndUpdateTime();
                    }
                }
            }, { passive: false });

            // 触摸结束
            touchMask.addEventListener('touchend', (e) => {
                // 如果既不是滚动，也没触发拖拽，说明是一次纯粹的“点击”
                if (!isDragging && !isScrolling) {
                    // 阻止默认点击，手动计算跳转位置
                    if (e.cancelable) e.preventDefault();

                    const touch = e.changedTouches[0];
                    const clickPositionRatio = (touch.clientX - rect.left) / rect.width;

                    if (videoElement.duration) {
                        // 边界保护
                        let ratio = Math.max(0, Math.min(1, clickPositionRatio));
                        videoElement.currentTime = ratio * videoElement.duration;
                        lastRoundedTime = -1;
                        checkAndUpdateTime();
                    }
                }

                // 重置状态
                isDragging = false;
                isScrolling = false;
            });

            row.appendChild(touchMask);
        }

        return row;
    }

    // 创建控件行
    function createControlsRow() {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; height: 30px;';

        // 左侧：播放按钮 + 时间显示
        const leftSection = document.createElement('div');
        leftSection.style.cssText = 'display: flex; align-items: center;';

        // 播放按钮 - 使用图标
        const playButton = document.createElement('button');
        playButton.className = 'play-pause-btn';
        playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        playButton.style.cssText = 'margin-right: 10px; padding: 4px; background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;';

        // 时间显示
        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'time-display';
        timeDisplay.textContent = '00:00.0 / ??';
        timeDisplay.style.cssText = 'color: white; font-size: 15px; margin-right: 10px; display: flex; align-items: center; height: 100%; user-select: none; font-family: Monaco,Verdana;';

        leftSection.appendChild(playButton);
        leftSection.appendChild(timeDisplay);

        // 右侧：音量 + 全屏 + 速度
        const rightSection = document.createElement('div');
        rightSection.style.cssText = 'display: flex; align-items: center; gap: 10px;';

        const deviceCapabilities = getDeviceCapabilities();

        // 仅在非移动设备显示音量控制
        if (!deviceCapabilities.isMobile) {
            // 音量控件
            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = 'display: flex; align-items: center;';

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.className = 'volume-slider';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.05';
            volumeSlider.value = videoElement.volume;
            volumeSlider.style.cssText = 'max-width: 150px; height: 6px; padding: 0px;';

            volumeContainer.appendChild(volumeSlider);
            rightSection.appendChild(volumeContainer);
        }

        // 全屏按钮 - 使用图标
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" name="fullscreen"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect width="10" height="8" x="7" y="8" rx="1"></rect></svg>`;
        fullscreenBtn.style.cssText = 'padding: 4px; background: transparent; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;';

        // 使用自定义速度选择器
        const speedSelect = createCustomSpeedSelect();

        rightSection.appendChild(fullscreenBtn);
        rightSection.appendChild(speedSelect);

        row.appendChild(leftSection);
        row.appendChild(rightSection);

        return row;
    }

    // 绑定控件事件
    function bindControlEvents() {
        const playBtn = customControls.querySelector('.play-pause-btn');
        const progressBar = customControls.querySelector('.video-progress');
        const volumeSlider = customControls.querySelector('.volume-slider');
        const fullscreenBtn = customControls.querySelector('.fullscreen-btn');
        const timeDisplay = customControls.querySelector('.time-display');

        // 播放/暂停
        playBtn.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        });

        // 进度条
        progressBar.addEventListener('input', () => {
            if (videoElement.duration) {
                videoElement.currentTime = (progressBar.value / PROGRESS_SEGMENTS) * videoElement.duration;
                lastRoundedTime = -1;
                checkAndUpdateTime();
            }
        });

        // 音量（仅在电脑端）
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                videoElement.volume = volumeSlider.value;
            });
        }

        // 全屏
        fullscreenBtn.addEventListener('click', toggleFullscreen);

        // 视频事件监听
        // ================================

        // 初始显示时间
        videoElement.addEventListener('volumechange', updateVolume);
        updateTimeDisplay();

        // 播放时：启动精确时间更新并更新按钮图标
        videoElement.addEventListener('play', () => {
            // 更新按钮图标为暂停
            if (playBtn) {
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            }
            // 启动RAF精确时间更新
            startPreciseTimeUpdate();
        });

        // 暂停时：停止精确时间更新并更新按钮图标
        videoElement.addEventListener('pause', () => {
            // 更新按钮图标为播放
            if (playBtn) {
                playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            }
            // 停止RAF精确时间更新，但显示当前精确时间
            stopPreciseTimeUpdate();
            updateTimeDisplay();
        });

        // 移除原有的timeupdate事件监听（不再需要）
        // 原代码如果有这一行，需要删除或注释掉：
        // videoElement.addEventListener('timeupdate', updateTimeDisplay);

        // 跳转完成时：更新显示
        videoElement.addEventListener('seeked', () => {
            lastRoundedTime = -1;
            checkAndUpdateTime();
        });

        // 视频元数据加载完成时：更新显示
        videoElement.addEventListener('loadedmetadata', () => {
            lastRoundedTime = -1;
            checkAndUpdateTime();
        });

        // ================================
        // 视频事件监听

        // 监听触摸结束事件，恢复原始播放速度
        documentTouchEndHandler = function() {
            if (videoElement && tapState.longPressTriggered) {
                videoElement.playbackRate = tapState.originalPlaybackRate;
                tapState.longPressTriggered = false;
            }
        };
        document.addEventListener('touchend', documentTouchEndHandler);
    }

    // 更新进度条
    function updateProgress(progressBar) {
        if (!customControls) return;

        if (progressBar && videoElement.duration) {
            progressBar.value = (videoElement.currentTime / videoElement.duration) * PROGRESS_SEGMENTS;
        }
    }

    // 更新音量显示
    function updateVolume() {
        if (!customControls) return;

        const volumeSlider = customControls.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = videoElement.volume;
        }
    }

    // 统一的更新检查函数
    function checkAndUpdateTime() {
        if (!videoElement || !customControls) return;

        // 计算当前时间（精确到0.1秒）
        const currentRoundedTime = Math.floor(videoElement.currentTime * 10);
        const progressBar = customControls.querySelector('.video-progress');

        // 如果时间变化了0.1秒或以上
        if (currentRoundedTime !== lastRoundedTime) {
            // 更新时间显示
            updateTimeDisplay();

            // 更新进度条
            updateProgress(progressBar);

            // 更新缓存
            lastRoundedTime = currentRoundedTime;
        }
    }

    // RAF 精确时间更新系统
    function startPreciseTimeUpdate() {
        if (timeUpdateActive) return;

        timeUpdateActive = true;

        const updateLoop = () => {
            // 只有视频在播放时才继续循环
            if (videoElement && !videoElement.paused) {
                // 检查并更新时间（每0.1秒变化时更新）
                checkAndUpdateTime();
                timeUpdateRAFId = requestAnimationFrame(updateLoop);
            } else {
                timeUpdateActive = false;
                timeUpdateRAFId = null;
            }
        };

        timeUpdateRAFId = requestAnimationFrame(updateLoop);
    }

    function stopPreciseTimeUpdate() {
        timeUpdateActive = false;
        if (timeUpdateRAFId) {
            cancelAnimationFrame(timeUpdateRAFId);
            timeUpdateRAFId = null;
        }
    }

    // 更新时间显示
    function updateTimeDisplay() {
        if (!customControls) return;

        const timeDisplay = customControls.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = `${formatTimeCurrent(videoElement.currentTime)} / ${formatTimeDuration(videoElement.duration)}`;
        }
    }

    // 设置全局快捷键
    function setupGlobalShortcuts() {
        if (globalShortcutsBound) {
            return; // 避免重复绑定
        }

        globalKeydownHandler = function(event) {
            handleGlobalKeydown(event);
        };

        globalKeyupHandler = function(event) {
            handleGlobalKeyup(event);
        };

        document.addEventListener('keydown', globalKeydownHandler);
        document.addEventListener('keyup', globalKeyupHandler);
        globalShortcutsBound = true;
    }

    // 移除全局快捷键
    function removeGlobalShortcuts() {
        if (globalKeydownHandler) {
            document.removeEventListener('keydown', globalKeydownHandler);
            globalKeydownHandler = null;
        }
        if (globalKeyupHandler) {
            document.removeEventListener('keyup', globalKeyupHandler);
            globalKeyupHandler = null;
        }
        globalShortcutsBound = false;
    }

    // 全局按键按下处理
    function handleGlobalKeydown(event) {
        // 仅在textarea中输入文字时禁用全局快捷键
        if (event.target.tagName === 'TEXTAREA') {
            return;
        }

        // 无视频时静默返回
        if (!videoElement) return;

        switch (event.code) {
            case KEY_BINDINGS.playPause:
                event.preventDefault();
                togglePlayPause();
                break;

            case KEY_BINDINGS.seekForward:
                event.preventDefault();
                handleSeekKeyDown('right');
                break;

            case KEY_BINDINGS.seekBackward:
                event.preventDefault();
                handleSeekKeyDown('left');
                break;

            case KEY_BINDINGS.volumeUp:
                event.preventDefault();
                adjustVolume(VOLUME_STEP);
                break;

            case KEY_BINDINGS.volumeDown:
                event.preventDefault();
                adjustVolume(-VOLUME_STEP);
                break;

            case KEY_BINDINGS.fullscreen:
                event.preventDefault();
                toggleFullscreen();
                break;
        }
    }

    // 处理快进/快退按键按下
    function handleSeekKeyDown(direction) {
        const key = direction === 'right' ? 'right' : 'left';

        // 如果已经按下，避免重复处理
        if (keyState[key].pressed) return;

        // 记录按下状态
        keyState[key].pressed = true;
        keyState[key].startTime = Date.now();
        keyState[key].originalRate = videoElement.playbackRate;

        // 设置长按检测定时器
        keyState[key].longPressTimer = setTimeout(() => {
            // 长按触发：切换倍速
            videoElement.playbackRate = LONG_PRESS_SPEED;
        }, KEY_LONG_PRESS_THRESHOLD);
    }

    // 调整音量
    function adjustVolume(step) {
        if (!videoElement) return;

        // 计算新音量，限制在0-1范围内
        let newVolume = videoElement.volume + step;
        newVolume = Math.max(0, Math.min(1, newVolume));

        // 设置音量
        videoElement.volume = newVolume;

        // 手动触发 volumechange 事件以确保同步更新音量条
        // 注意：直接设置 volume 属性会触发 volumechange 事件，但为确保可靠性，这里显式调用
        if (customControls) {
            const volumeSlider = customControls.querySelector('.volume-slider');
            if (volumeSlider) {
                volumeSlider.value = newVolume;
            }
        }
    }

    // 全局按键抬起处理
    function handleGlobalKeyup(event) {
        // 无视频时静默返回
        if (!videoElement) return;

        switch (event.code) {
            case KEY_BINDINGS.seekForward:
                event.preventDefault();
                handleSeekKeyUp('right');
                break;

            case KEY_BINDINGS.seekBackward:
                event.preventDefault();
                handleSeekKeyUp('left');
                break;
        }
    }

    // 处理快进/快退按键抬起
    function handleSeekKeyUp(direction) {
        const key = direction === 'right' ? 'right' : 'left';

        // 如果未按下，忽略
        if (!keyState[key].pressed) return;

        // 清除长按定时器
        if (keyState[key].longPressTimer) {
            clearTimeout(keyState[key].longPressTimer);
            keyState[key].longPressTimer = null;
        }

        // 计算按键持续时间
        const pressDuration = Date.now() - keyState[key].startTime;

        if (pressDuration < KEY_LONG_PRESS_THRESHOLD) {
            // 短按：执行快进/快退
            seekVideo(direction === 'right' ? SEEK_TIME : -SEEK_TIME);
        } else {
            // 长按：恢复原始速度
            videoElement.playbackRate = keyState[key].originalRate;
        }

        // 重置按键状态
        keyState[key].pressed = false;
    }

    // 播放/暂停切换
    function togglePlayPause() {
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }

    // 快进/快退
    function seekVideo(seconds) {
        videoElement.currentTime += seconds;
    }

    // 全屏切换
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // 进入全屏前显示原生控件，并移除自定义事件
            videoElement.controls = true;
            removeVideoEvents();

            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            }
            isFullscreen = true;
        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // 设置全屏监听
    function setupFullscreenListener() {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                // 退出全屏
                isFullscreen = false;
                // 隐藏原生控件，重新添加自定义事件
                videoElement.controls = false;
                setupVideoEvents();
            }
        });
    }

    // 清理函数
    function cleanup() {
        stopDetection();
        removeVideoEvents();
        removeGlobalShortcuts();
        stopPreciseTimeUpdate();
        resetTapState();

        // 重置状态
        isInitialized = false;
        videoElement = null;
        customControls = null;
        globalShortcutsBound = false;
        detectionAttempts = 0;
        lastRoundedTime = -1;

        // 重置键盘状态
        ['right', 'left'].forEach(key => {
            if (keyState[key].longPressTimer) {
                clearTimeout(keyState[key].longPressTimer);
            }
            keyState[key].pressed = false;
        });

        //全局监听器（对于长按后的抬起位置不在视频区域）
        if (documentTouchEndHandler) {
            document.removeEventListener('touchend', documentTouchEndHandler);
            documentTouchEndHandler = null;
        }
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();