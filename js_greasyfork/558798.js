// ==UserScript==
// @name         YouTube 倍速增强 + 新标签页打开
// @namespace    Tampermonkey Scripts
// @match        *://www.youtube.com/*
// @grant        none
// @version      1.6.5
// @author       LQ He
// @description  长按快捷键快速倍速播放（Z/Ctrl 2倍速，右方向键 3倍速）。视频控制栏添加倍速切换按钮，支持自定义倍速设置。YouTube 链接强制新标签页打开。
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558798/YouTube%20%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA%20%2B%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/558798/YouTube%20%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA%20%2B%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置常量 ====================
    const CONFIG = {
        // 倍速相关配置
        PRESET_SPEEDS: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4],
        SPEED_KEY_Z: 2.0,
        SPEED_KEY_CTRL: 2.0,
        SPEED_KEY_RIGHT: 3.0,
        LONG_PRESS_DELAY: 200,
        SEEK_SECONDS: 5,

        // 新标签页相关配置
        YOUTUBE_LINK_PATTERNS: ['/watch', '/channel', '/user', '/@', '/playlist', '/shorts'],
        ENABLE_NEW_TAB_LINKS: true,
        ENABLE_AUTO_PAUSE_VIDEO: true,

        // 性能优化配置
        CTRL_CHECK_INTERVAL: 100,
        CTRL_TIMEOUT_LIMIT: 50,
        STORAGE_KEY: 'yt-custom-speed-options'
    };

    // ==================== 样式常量 ====================
    const STYLES = {
        OVERLAY: `
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
            padding: 12px 28px;
            border-radius: 30px;
            font-size: 20px;
            font-weight: 600;
            z-index: 9999;
            pointer-events: none;
            font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif;
            backdrop-filter: blur(4px);
        `,
        BUTTON_BASE: `
            cursor: pointer !important;
            margin: 0 !important;
            padding: 0 6px !important;
            height: 100% !important;
            width: auto !important;
            min-width: 32px !important;
            border: none !important;
            background: transparent !important;
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 13px !important;
            font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif !important;
            font-weight: 400 !important;
            transition: opacity 0.1s ease-in-out !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            outline: none !important;
            opacity: 0.9 !important;
            box-sizing: border-box !important;
        `
    };

    // ==================== DOM缓存管理器 ====================
    const DOMCache = {
        video: null,
        player: null,
        speedControl: null,

        getVideo() {
            if (!this.video || !document.contains(this.video)) {
                this.video = document.querySelector('video');
            }
            return this.video;
        },

        getPlayer() {
            if (!this.player || !document.contains(this.player)) {
                this.player = document.querySelector('#movie_player');
            }
            return this.player;
        },

        clear() {
            this.video = null;
            this.player = null;
            this.speedControl = null;
        }
    };

    // ==================== 状态管理器 ====================
    const StateManager = {
        isPressing: false,
        originalSpeed: 1.0,
        currentKey: null,
        longPressTimer: null,
        isLongPress: false,
        keyDownTime: 0,
        overlayDiv: null,

        ctrlKeyState: {
            isDown: false,
            originalSpeed: 1.0,
            checkInterval: null
        },

        speedOptions: [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3],
        customSpeeds: [],

        reset() {
            this.isPressing = false;
            this.isLongPress = false;
            this.currentKey = null;
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        },

        resetCtrlState() {
            this.ctrlKeyState.isDown = false;
            if (this.ctrlKeyState.checkInterval) {
                clearInterval(this.ctrlKeyState.checkInterval);
                this.ctrlKeyState.checkInterval = null;
            }
        }
    };

    // ==================== 新标签页功能模块 ====================
    const NewTabModule = {
        isYouTubeLink(url) {
            return url.includes('youtube.com') || url.startsWith('/') || url.startsWith('https://youtu.be/');
        },

        shouldOpenInNewTab(url) {
            return CONFIG.YOUTUBE_LINK_PATTERNS.some(pattern => url.includes(pattern));
        },

        // 检查当前是否在视频播放页面
        isWatchPage() {
            return window.location.pathname === '/watch';
        },

        // 检查当前是否在首页
        isHomePage() {
            return window.location.pathname === '/' || window.location.pathname === '';
        },

        // 检查是否是左侧菜单栏链接
        isSidebarLink(anchor) {
            // 通过 DOM 结构匹配（最可靠的方式）
            const isInGuide = anchor.closest('ytd-guide-renderer') ||       // 展开的侧边栏
                anchor.closest('ytd-mini-guide-renderer') ||                 // 迷你侧边栏
                anchor.closest('tp-yt-app-drawer') ||                        // 移动端侧边栏
                anchor.closest('#guide');                                    // 侧边栏容器

            const isSidebarElement = anchor.closest('ytd-guide-section-renderer') ||  // 侧边栏分区
                anchor.closest('ytd-guide-entry-renderer') ||                          // 侧边栏条目
                anchor.closest('tp-yt-paper-item');                                    // 侧边栏链接项

            return isInGuide || isSidebarElement;
        },

        // 检查是否是需要强制新标签页打开的链接（无视当前页面）
        isForceNewTabLink(href) {
            const forceNewTabPatterns = [
                'studio.youtube.com',                    // YouTube Studio
                '/account',                              // 账号设置
                '/premium'                               // YouTube Premium
            ];
            return forceNewTabPatterns.some(pattern => href.includes(pattern));
        },

        // 检查是否是 Shorts 入口链接
        isShortsEntryLink(anchor) {
            // 方式1：通过 title 属性识别
            const title = anchor.getAttribute('title') || '';
            if (title.toLowerCase() === 'shorts') {
                return true;
            }
            // 方式2：通过内部文本识别（yt-formatted-string 包含 "Shorts"）
            const formattedString = anchor.querySelector('yt-formatted-string.title');
            if (formattedString && formattedString.textContent.trim().toLowerCase() === 'shorts') {
                return true;
            }
            // 方式3：检查是否在 Shorts 相关的 guide-entry 中
            const guideEntry = anchor.closest('ytd-guide-entry-renderer');
            if (guideEntry) {
                const titleElement = guideEntry.querySelector('yt-formatted-string.title');
                if (titleElement && titleElement.textContent.trim().toLowerCase() === 'shorts') {
                    return true;
                }
            }
            return false;
        },

        // 检查是否是 YouTube Logo（首页链接）
        isYouTubeLogoLink(anchor) {
            return anchor.id === 'logo' ||
                anchor.closest('ytd-topbar-logo-renderer') !== null;
        },

        getVideoIdFromUrl(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                return urlObj.searchParams.get('v');
            } catch (e) {
                return null;
            }
        },

        isChapterLink(href) {
            const currentVideoId = this.getVideoIdFromUrl(window.location.href);
            const targetVideoId = this.getVideoIdFromUrl(href);
            return currentVideoId && targetVideoId && currentVideoId === targetVideoId;
        },

        isPlaylistPanelVideoClick(anchor) {
            return anchor.closest('ytd-playlist-panel-video-renderer') ||
                anchor.closest('ytd-playlist-video-renderer');
        },

        isThumbnailHoverAction(element) {
            return element.closest('#hover-overlays') ||
                element.closest('#mouseover-overlay') ||
                element.closest('ytd-thumbnail-overlay-toggle-button-renderer');
        },

        isActionButton(element) {
            // 检查是否是功能按钮或按钮容器
            return element.closest('button') ||
                element.closest('ytd-menu-renderer') ||
                element.closest('ytd-button-renderer') ||
                element.closest('yt-icon-button') ||
                element.closest('[role="button"]') ||
                element.closest('ytd-thumbnail-overlay-toggle-button-renderer') ||
                element.closest('ytd-thumbnail-overlay-time-status-renderer') ||
                element.closest('#button') ||
                element.closest('.ytd-menu-renderer');
        },

        isThumbnailLink(anchor) {
            // 检查是否是视频封面链接
            return anchor.id === 'thumbnail' ||
                anchor.classList.contains('yt-simple-endpoint') ||
                anchor.closest('ytd-thumbnail');
        },

        // 检查是否在稍后观看界面
        isWatchLaterPage() {
            const url = window.location.href;
            return url.includes('list=WL') || url.includes('watch_later');
        },

        // 检查是否是博主名称链接
        isChannelLink(href) {
            return href.includes('/channel') || href.includes('/user') || href.includes('/@');
        },

        handleLinkClick(event) {
            if (!CONFIG.ENABLE_NEW_TAB_LINKS || event.ctrlKey || event.metaKey) return;

            const anchor = event.target.closest('a');
            if (!anchor) return;

            // 优先检查是否点击了功能按钮,如果是则不拦截
            if (NewTabModule.isActionButton(event.target)) {
                return;
            }

            // 特殊处理：播放页点击 Shorts 入口链接（可能没有 href 或 href="/"）
            if (NewTabModule.isWatchPage() && NewTabModule.isShortsEntryLink(anchor)) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                window.open('https://www.youtube.com/shorts', '_blank');
                return;
            }

            // 特殊处理：播放页点击 YouTube Logo（首页链接）
            if (NewTabModule.isWatchPage() && NewTabModule.isYouTubeLogoLink(anchor)) {
                event.preventDefault();
                event.stopPropagation();
                window.open('https://www.youtube.com/', '_blank');
                return;
            }

            // 如果没有 href，后续逻辑不处理
            if (!anchor.href) return;

            // 检查是否是需要强制新标签页打开的链接（account、premium、studio等）
            // 无视当前页面是首页还是播放页
            if (NewTabModule.isForceNewTabLink(anchor.href)) {
                event.preventDefault();
                event.stopPropagation();
                window.open(anchor.href, '_blank');
                return;
            }

            // 检查是否是左侧菜单栏链接
            const isSidebar = NewTabModule.isSidebarLink(anchor);

            // 如果是左侧菜单栏链接，根据当前页面决定行为
            if (isSidebar) {
                // 在首页时，强制不拦截，使用默认行为（当前页面打开）
                if (NewTabModule.isHomePage()) {
                    return;  // 直接返回，不执行后续任何拦截逻辑
                }
                // 在播放页面时，强制新标签页打开
                if (NewTabModule.isWatchPage()) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(anchor.href, '_blank');
                    return;
                }
                // 其他页面（非首页、非播放页），左侧菜单栏也不拦截
                return;
            }

            // 以下是非左侧菜单栏链接的处理逻辑

            // 检查是否是封面链接,如果是则允许新标签打开
            const isThumbnail = NewTabModule.isThumbnailLink(anchor);

            if (NewTabModule.isChapterLink(anchor.href) ||
                NewTabModule.isPlaylistPanelVideoClick(anchor)) {
                return;
            }

            // 如果不是封面链接,检查是否是悬停覆盖层操作
            if (!isThumbnail && NewTabModule.isThumbnailHoverAction(event.target)) {
                return;
            }

            if (NewTabModule.isYouTubeLink(anchor.href) &&
                NewTabModule.shouldOpenInNewTab(anchor.href)) {
                event.preventDefault();
                event.stopPropagation();
                window.open(anchor.href, '_blank');
            }
        },

        pauseVideoOnLoad() {
            if (!CONFIG.ENABLE_AUTO_PAUSE_VIDEO) return;

            const video = DOMCache.getVideo();
            if (video) {
                video.pause();
            } else {
                setTimeout(() => NewTabModule.pauseVideoOnLoad(), 100);
            }
        }
    };

    // ==================== 倍速提示覆盖层模块 ====================
    const OverlayModule = {
        show(speed) {
            const player = DOMCache.getPlayer();
            if (!player) return;

            if (!StateManager.overlayDiv) {
                StateManager.overlayDiv = document.createElement('div');
                StateManager.overlayDiv.id = 'yt-speed-overlay';
                StateManager.overlayDiv.style.cssText = STYLES.OVERLAY;
                player.appendChild(StateManager.overlayDiv);
            }
            StateManager.overlayDiv.textContent = `${speed}x ▶▶`;
            StateManager.overlayDiv.style.display = 'block';
        },

        hide() {
            if (StateManager.overlayDiv) {
                StateManager.overlayDiv.style.display = 'none';
            }
        }
    };

    // ==================== 键盘事件处理模块 ====================
    const KeyboardModule = {
        // 检查是否应该忽略键盘事件
        shouldIgnoreEvent(e) {
            const tag = e.target.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
        },

        // 检查是否是有效的快捷键
        isValidKey(code) {
            return code === 'KeyZ' || code === 'ControlLeft' || code === 'ControlRight' || code === 'ArrowRight';
        },

        // 恢复视频速度
        restoreSpeed(video, speed) {
            if (video) {
                video.playbackRate = speed;
                console.log('[YouTube倍速] 恢复速度到:', speed);
            }
            StateManager.reset();
            StateManager.resetCtrlState();
            OverlayModule.hide();
            SpeedControlModule.updateHighlight();
        },

        // 检查Ctrl键状态一致性
        checkCtrlKeyConsistency(e) {
            if (StateManager.ctrlKeyState.isDown && !e.ctrlKey &&
                e.code !== 'ControlLeft' && e.code !== 'ControlRight') {
                console.log('[YouTube倍速] 检测到Ctrl键状态不一致，强制恢复');
                const video = DOMCache.getVideo();
                if (video && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    this.restoreSpeed(video, StateManager.ctrlKeyState.originalSpeed);
                }
            }
        },

        handleKeyDown(e) {
            // 检查Ctrl键状态一致性
            KeyboardModule.checkCtrlKeyConsistency(e);

            if (!KeyboardModule.isValidKey(e.code) || KeyboardModule.shouldIgnoreEvent(e)) return;

            const video = DOMCache.getVideo();
            if (!video) return;

            // Z键处理：立即触发倍速
            if (e.code === 'KeyZ') {
                e.preventDefault();
                e.stopPropagation();

                if (StateManager.isPressing) return;

                StateManager.isPressing = true;
                StateManager.isLongPress = true;
                StateManager.currentKey = e.code;
                StateManager.originalSpeed = video.playbackRate;
                console.log('[YouTube倍速] Z键按下，记录原始速度:', StateManager.originalSpeed);

                video.playbackRate = CONFIG.SPEED_KEY_Z;
                OverlayModule.show(CONFIG.SPEED_KEY_Z);
                SpeedControlModule.updateHighlight();
                return;
            }

            // Ctrl键处理：立即触发倍速 + 轮询检查
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                e.preventDefault();
                e.stopPropagation();

                if (StateManager.isPressing) return;

                StateManager.isPressing = true;
                StateManager.isLongPress = true;
                StateManager.currentKey = e.code;
                StateManager.originalSpeed = video.playbackRate;
                StateManager.ctrlKeyState.isDown = true;
                StateManager.ctrlKeyState.originalSpeed = video.playbackRate;

                console.log('[YouTube倍速] Ctrl键按下，记录原始速度:', StateManager.originalSpeed);

                video.playbackRate = CONFIG.SPEED_KEY_CTRL;
                OverlayModule.show(CONFIG.SPEED_KEY_CTRL);
                SpeedControlModule.updateHighlight();

                // 启动Ctrl键状态检查
                KeyboardModule.startCtrlKeyCheck();
                return;
            }

            // 右方向键处理：长按判定
            if (e.code === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if ((StateManager.isPressing && StateManager.isLongPress) || StateManager.longPressTimer) {
                    return;
                }

                StateManager.currentKey = e.code;
                StateManager.originalSpeed = video.playbackRate;
                StateManager.keyDownTime = Date.now();

                StateManager.longPressTimer = setTimeout(() => {
                    StateManager.isPressing = true;
                    StateManager.isLongPress = true;
                    StateManager.longPressTimer = null;
                    console.log('[YouTube倍速] 右方向键长按触发，记录的原始速度:', StateManager.originalSpeed);

                    video.playbackRate = CONFIG.SPEED_KEY_RIGHT;
                    OverlayModule.show(CONFIG.SPEED_KEY_RIGHT);
                    SpeedControlModule.updateHighlight();
                }, CONFIG.LONG_PRESS_DELAY);
            }
        },

        // Ctrl键状态检查（兜底机制）
        startCtrlKeyCheck() {
            if (StateManager.ctrlKeyState.checkInterval) {
                clearInterval(StateManager.ctrlKeyState.checkInterval);
            }

            let checkCount = 0;
            StateManager.ctrlKeyState.checkInterval = setInterval(() => {
                const video = DOMCache.getVideo();
                if (!video) return;

                checkCount++;

                if (StateManager.ctrlKeyState.isDown && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    if (checkCount % 10 === 0) {
                        console.log('[YouTube倍速] Ctrl键轮询检查中...', checkCount / 10, '秒');
                    }

                    if (checkCount > CONFIG.CTRL_TIMEOUT_LIMIT) {
                        console.log('[YouTube倍速] Ctrl键超时，强制恢复速度');
                        KeyboardModule.restoreSpeed(video, StateManager.ctrlKeyState.originalSpeed);
                    }
                } else if (!StateManager.ctrlKeyState.isDown) {
                    clearInterval(StateManager.ctrlKeyState.checkInterval);
                    StateManager.ctrlKeyState.checkInterval = null;
                }
            }, CONFIG.CTRL_CHECK_INTERVAL);
        },

        handleKeyUp(e) {
            // 检查Ctrl键是否通过其他按键松开事件检测到
            if (StateManager.ctrlKeyState.isDown && !e.ctrlKey) {
                console.log('[YouTube倍速] 通过keyup事件检测到Ctrl键已松开');
                const video = DOMCache.getVideo();
                if (video && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    KeyboardModule.restoreSpeed(video, StateManager.ctrlKeyState.originalSpeed);
                }
                return;
            }

            if (!KeyboardModule.isValidKey(e.code) || KeyboardModule.shouldIgnoreEvent(e)) return;

            const video = DOMCache.getVideo();
            if (!video) {
                console.log('[YouTube倍速] 警告：找不到video元素');
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Z键松开处理
            if (e.code === 'KeyZ') {
                console.log('[YouTube倍速] Z键松开');
                if (video.playbackRate === CONFIG.SPEED_KEY_Z) {
                    KeyboardModule.restoreSpeed(video, StateManager.originalSpeed);
                }
                return;
            }

            // Ctrl键松开处理
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                console.log('[YouTube倍速] Ctrl键松开');
                const speedToRestore = StateManager.ctrlKeyState.originalSpeed || StateManager.originalSpeed;
                if (video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    KeyboardModule.restoreSpeed(video, speedToRestore);
                }
                return;
            }

            // 右方向键松开处理
            if (e.code === 'ArrowRight') {
                e.stopImmediatePropagation();
                console.log('[YouTube倍速] 右方向键松开');

                // 短按处理：执行快进
                if (StateManager.longPressTimer) {
                    clearTimeout(StateManager.longPressTimer);
                    StateManager.longPressTimer = null;
                    StateManager.currentKey = null;
                    console.log('[YouTube倍速] 短按右方向键，执行快进');
                    video.currentTime = Math.min(video.currentTime + CONFIG.SEEK_SECONDS, video.duration);
                    return;
                }

                // 长按处理：恢复速度
                if (video.playbackRate === CONFIG.SPEED_KEY_RIGHT) {
                    KeyboardModule.restoreSpeed(video, StateManager.originalSpeed);
                }
            }
        }
    };

    // ==================== 倍速控件UI模块 ====================
    const SpeedControlModule = {
        // 创建单个倍速按钮
        createSpeedButton(speed) {
            const option = document.createElement('button');
            option.classList.add('yt-speed-option');
            option.innerText = speed + 'x';
            option.dataset.speed = speed;
            option.title = speed + '倍速';
            option.style.cssText = STYLES.BUTTON_BASE;

            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const video = DOMCache.getVideo();
                if (video) {
                    video.playbackRate = speed;
                    StateManager.originalSpeed = speed;
                    SpeedControlModule.highlightOption(option);
                }
            });

            option.addEventListener('mouseenter', () => {
                option.style.opacity = '1';
            });

            option.addEventListener('mouseleave', () => {
                const video = DOMCache.getVideo();
                const currentSpeed = video ? video.playbackRate : 1;
                if (parseFloat(option.dataset.speed) !== currentSpeed) {
                    option.style.opacity = '0.9';
                }
            });

            return option;
        },

        // 创建倍速控件
        createSpeedControl() {
            try {
                const container = document.createElement('div');
                container.classList.add('yt-speed-control');
                container.style.cssText = `
                    display: inline-flex !important;
                    align-items: center !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 4px 0 0 !important;
                    color: #fff !important;
                    font-size: 13px !important;
                    font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif !important;
                    vertical-align: top !important;
                    flex-shrink: 0 !important;
                    position: relative !important;
                    width: auto !important;
                `;

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('yt-speed-buttons');
                buttonsContainer.style.cssText = `
                    display: inline-flex !important;
                    align-items: center !important;
                    height: 100% !important;
                `;

                StateManager.speedOptions.forEach(speed => {
                    buttonsContainer.appendChild(SpeedControlModule.createSpeedButton(speed));
                });

                const customButton = CustomSpeedModule.createCustomSpeedButton();
                container.appendChild(buttonsContainer);
                container.appendChild(customButton);

                return container;
            } catch (error) {
                console.error('创建倍速控件失败:', error);
                return document.createElement('div');
            }
        },

        // 高亮选中的倍速按钮
        highlightOption(selectedOption) {
            const options = document.querySelectorAll('.yt-speed-option');
            options.forEach(option => {
                option.style.color = 'rgba(255, 255, 255, 0.9)';
                option.style.fontWeight = '400';
                option.style.opacity = '0.9';
            });
            if (selectedOption) {
                selectedOption.style.color = '#fff';
                selectedOption.style.fontWeight = '600';
                selectedOption.style.opacity = '1';
            }
        },

        // 更新倍速高亮
        updateHighlight() {
            const video = DOMCache.getVideo();
            if (!video) return;

            const currentSpeed = video.playbackRate;
            const options = document.querySelectorAll('.yt-speed-option');
            options.forEach(option => {
                if (parseFloat(option.dataset.speed) === currentSpeed) {
                    SpeedControlModule.highlightOption(option);
                }
            });
        },

        // 刷新倍速控件
        refresh() {
            const buttonsContainer = document.querySelector('.yt-speed-buttons');
            if (!buttonsContainer) {
                const oldControl = document.querySelector('.yt-speed-control');
                if (oldControl) oldControl.remove();
                SpeedControlModule.insert();
                return;
            }

            while (buttonsContainer.firstChild) {
                buttonsContainer.removeChild(buttonsContainer.firstChild);
            }

            StateManager.speedOptions.forEach(speed => {
                buttonsContainer.appendChild(SpeedControlModule.createSpeedButton(speed));
            });

            SpeedControlModule.updateHighlight();
        },

        // 插入倍速控件到页面
        insert() {
            try {
                StyleModule.inject();

                const rightControlsLeft = document.querySelector('.ytp-right-controls-left');
                if (!rightControlsLeft || document.querySelector('.yt-speed-control')) return;

                const speedControl = SpeedControlModule.createSpeedControl();
                rightControlsLeft.insertBefore(speedControl, rightControlsLeft.firstChild);

                SpeedControlModule.updateHighlight();

                const video = DOMCache.getVideo();
                if (video) {
                    video.addEventListener('ratechange', () => {
                        if (!StateManager.isPressing) {
                            SpeedControlModule.updateHighlight();
                        }
                    });
                }
            } catch (error) {
                console.error('插入倍速控件失败:', error);
            }
        }
    };

    // ==================== 自定义倍速设置模块 ====================
    const CustomSpeedModule = {
        // 创建自定义倍速设置按钮
        createCustomSpeedButton() {
            try {
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('yt-speed-custom-container');
                buttonContainer.style.cssText = `
                    display: inline-flex !important;
                    align-items: center !important;
                    height: 100% !important;
                    position: relative !important;
                `;

                const customBtn = document.createElement('button');
                customBtn.classList.add('yt-speed-custom-btn');
                customBtn.textContent = '⚙';
                customBtn.title = '自定义倍速';
                customBtn.style.cssText = `
                    cursor: pointer !important;
                    margin: 0 !important;
                    padding: 0 6px !important;
                    height: 100% !important;
                    width: auto !important;
                    min-width: 28px !important;
                    border: none !important;
                    background: transparent !important;
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-size: 16px !important;
                    font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif !important;
                    transition: all 0.2s ease-in-out !important;
                    white-space: nowrap !important;
                    flex-shrink: 0 !important;
                    outline: none !important;
                    box-sizing: border-box !important;
                `;

                const editPanel = CustomSpeedModule.createEditPanel();
                buttonContainer.appendChild(customBtn);
                buttonContainer.appendChild(editPanel);

                let isPanelVisible = false;

                const togglePanel = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    isPanelVisible = !isPanelVisible;
                    customBtn.style.color = isPanelVisible ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
                    editPanel.style.display = isPanelVisible ? 'block' : 'none';
                };

                customBtn.addEventListener('click', togglePanel, true);

                document.addEventListener('click', (e) => {
                    if (isPanelVisible && !buttonContainer.contains(e.target)) {
                        isPanelVisible = false;
                        customBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                        editPanel.style.display = 'none';
                    }
                });

                editPanel.addEventListener('click', (e) => e.stopPropagation());

                return buttonContainer;
            } catch (error) {
                console.error('创建自定义按钮失败:', error);
                return document.createElement('div');
            }
        },

        // 创建编辑面板
        createEditPanel() {
            try {
                const panel = document.createElement('div');
                panel.classList.add('yt-speed-edit-panel');
                panel.style.cssText = `
                display: none !important;
                position: absolute !important;
                bottom: 100% !important;
                right: 0 !important;
                margin-bottom: 8px !important;
                background: rgba(0, 0, 0, 0.6) !important;
                border-radius: 12px !important;
                padding: 8px 0 !important;
                width: 251px !important;
                max-height: 414px !important;
                overflow-y: auto !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
                z-index: 10000 !important;
                // color: #fff !important;
                color: rgba(255, 255, 255, 0.9) !important;
                font-family: Roboto, Arial, sans-serif !important;
            `;

                // 添加新倍速区域 - 滑块样式(放在顶部)
                const addSection = document.createElement('div');
                addSection.style.cssText = `
                padding: 12px 16px 10px 16px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            `;

                // 标题和当前值
                const sliderHeader = document.createElement('div');
                sliderHeader.style.cssText = `
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 10px !important;
            `;

                const sliderTitle = document.createElement('div');
                sliderTitle.textContent = '自定义 (0.5)';
                sliderTitle.style.cssText = `
                color: #fff !important;
                font-size: 14px !important;
                font-weight: 400 !important;
            `;

                const sliderValue = document.createElement('div');
                sliderValue.textContent = '0.50x';
                sliderValue.style.cssText = `
                color: #fff !important;
                font-size: 16px !important;
                font-weight: 500 !important;
            `;

                sliderHeader.appendChild(sliderTitle);
                sliderHeader.appendChild(sliderValue);

                // 滑块容器
                const sliderContainer = document.createElement('div');
                sliderContainer.style.cssText = `
                position: relative !important;
                width: 100% !important;
                height: 4px !important;
                background: rgba(255, 255, 255, 0.3) !important;
                border-radius: 2px !important;
                margin-bottom: 10px !important;
            `;

                // 滑块
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '0.25';
                slider.max = '4';
                slider.step = '0.05';
                slider.value = '0.5';
                slider.style.cssText = `
                position: absolute !important;
                width: 100% !important;
                height: 20px !important;
                top: -8px !important;
                left: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                background: transparent !important;
                outline: none !important;
                cursor: pointer !important;
            `;

                // 滑块样式
                const sliderStyleId = 'yt-speed-slider-style';
                if (!document.getElementById(sliderStyleId)) {
                    const sliderStyle = document.createElement('style');
                    sliderStyle.id = sliderStyleId;
                    sliderStyle.textContent = `
                    .yt-speed-slider::-webkit-slider-thumb {
                        -webkit-appearance: none !important;
                        appearance: none !important;
                        width: 16px !important;
                        height: 16px !important;
                        border-radius: 50% !important;
                        background: #fff !important;
                        cursor: pointer !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
                    }
                    .yt-speed-slider::-moz-range-thumb {
                        width: 16px !important;
                        height: 16px !important;
                        border-radius: 50% !important;
                        background: #fff !important;
                        cursor: pointer !important;
                        border: none !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
                    }
                `;
                    document.head.appendChild(sliderStyle);
                }
                slider.classList.add('yt-speed-slider');

                // 更新显示值
                slider.addEventListener('input', (e) => {
                    e.stopPropagation();
                    const value = parseFloat(e.target.value);
                    sliderValue.textContent = value.toFixed(2) + 'x';
                    sliderTitle.textContent = `自定义 (${value.toFixed(2)})`;
                });

                // 阻止键盘事件冒泡
                slider.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                });

                slider.addEventListener('keyup', (e) => {
                    e.stopPropagation();
                });

                // 添加确认按钮
                const addButton = document.createElement('button');
                addButton.textContent = '添加';
                addButton.style.cssText = `
                width: 100% !important;
                padding: 6px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                border: none !important;
                border-radius: 4px !important;
                color: #fff !important;
                font-size: 13px !important;
                cursor: pointer !important;
                transition: background 0.2s !important;
            `;

                addButton.addEventListener('mouseenter', () => {
                    addButton.style.background = 'rgba(255, 255, 255, 0.15) !important';
                });

                addButton.addEventListener('mouseleave', () => {
                    addButton.style.background = 'rgba(255, 255, 255, 0.1) !important';
                });

                // 消息提示
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                font-size: 11px !important;
                margin-top: 6px !important;
                padding: 4px !important;
                border-radius: 3px !important;
                display: none !important;
                text-align: center !important;
            `;

                const showMessage = (text, isSuccess) => {
                    messageDiv.textContent = text;
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = isSuccess ? 'rgba(48, 209, 88, 0.2) !important' : 'rgba(255, 69, 58, 0.2) !important';
                    messageDiv.style.color = isSuccess ? '#4cd964 !important' : '#ff453a !important';

                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 2000);
                };

                sliderContainer.appendChild(slider);
                addSection.appendChild(sliderHeader);
                addSection.appendChild(sliderContainer);
                addSection.appendChild(addButton);
                addSection.appendChild(messageDiv);
                panel.appendChild(addSection);

                // 倍速列表容器
                const listContainer = document.createElement('div');
                listContainer.classList.add('yt-speed-list');
                listContainer.style.cssText = `
                padding: 4px 0 !important;
            `;
                panel.appendChild(listContainer);

                // 渲染倍速列表
                CustomSpeedModule.renderSpeedList(listContainer);

                // 点击添加按钮添加倍速
                addButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = parseFloat(slider.value);
                    const allSpeeds = [...CONFIG.PRESET_SPEEDS, ...StateManager.customSpeeds];

                    if (allSpeeds.includes(value)) {
                        showMessage('该倍速已存在', false);
                        return;
                    }

                    StateManager.customSpeeds.push(value);
                    StateManager.customSpeeds.sort((a, b) => a - b);
                    StateManager.speedOptions.push(value);
                    StateManager.speedOptions.sort((a, b) => a - b);
                    StorageModule.save();
                    SpeedControlModule.refresh();
                    CustomSpeedModule.renderSpeedList(listContainer);
                    showMessage('添加成功', true);
                });

                return panel;
            } catch (error) {
                console.error('创建编辑面板失败:', error);
                return document.createElement('div');
            }
        },

        // 渲染倍速列表
        renderSpeedList(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            const allSpeeds = [...new Set([...CONFIG.PRESET_SPEEDS, ...StateManager.customSpeeds])].sort((a, b) => a - b);

            allSpeeds.forEach(speed => {
                const isPreset = CONFIG.PRESET_SPEEDS.includes(speed);
                const isVisible = StateManager.speedOptions.includes(speed);

                const item = document.createElement('div');
                item.style.cssText = `
                display: flex !important;
                align-items: center !important;
                padding: 8px 16px !important;
                cursor: pointer !important;
                transition: background 0.1s !important;
                background: transparent !important;
            `;

                item.addEventListener('mouseenter', () => {
                    item.style.background = 'rgba(255, 255, 255, 0.1) !important';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent !important';
                });

                // 勾选框
                const checkbox = document.createElement('div');
                checkbox.style.cssText = `
                width: 18px !important;
                height: 18px !important;
                margin-right: 16px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                flex-shrink: 0 !important;
            `;

                if (isVisible) {
                    const checkmark = document.createElement('div');
                    checkmark.textContent = '✓';
                    checkmark.style.cssText = `
                    color: #fff !important;
                    font-size: 18px !important;
                    font-weight: 500 !important;
                    line-height: 1 !important;
                `;
                    checkbox.appendChild(checkmark);
                }

                // 倍速文本
                const speedText = document.createElement('span');
                if (speed === 1) {
                    speedText.textContent = '正常';
                } else {
                    speedText.textContent = speed.toString();
                }
                speedText.style.cssText = `
                color: #fff !important;
                font-size: 14px !important;
                flex: 1 !important;
                font-weight: 400 !important;
            `;

                // 删除按钮(仅自定义倍速)
                if (!isPreset) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '×';
                    deleteBtn.style.cssText = `
                    background: transparent !important;
                    border: none !important;
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-size: 20px !important;
                    cursor: pointer !important;
                    padding: 0 !important;
                    width: 24px !important;
                    height: 24px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 50% !important;
                    transition: all 0.2s !important;
                `;

                    deleteBtn.addEventListener('mouseenter', () => {
                        deleteBtn.style.background = 'rgba(255, 255, 255, 0.1) !important';
                        deleteBtn.style.color = '#fff !important';
                    });

                    deleteBtn.addEventListener('mouseleave', () => {
                        deleteBtn.style.background = 'transparent !important';
                        deleteBtn.style.color = 'rgba(255, 255, 255, 0.7) !important';
                    });

                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        StateManager.customSpeeds = StateManager.customSpeeds.filter(s => s !== speed);
                        StateManager.speedOptions = StateManager.speedOptions.filter(s => s !== speed);
                        StorageModule.save();
                        SpeedControlModule.refresh();
                        CustomSpeedModule.renderSpeedList(container);
                    });

                    item.appendChild(speedText);
                    item.appendChild(deleteBtn);
                } else {
                    item.appendChild(speedText);
                }

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isVisible) {
                        StateManager.speedOptions = StateManager.speedOptions.filter(s => s !== speed);
                    } else {
                        StateManager.speedOptions.push(speed);
                        StateManager.speedOptions.sort((a, b) => a - b);
                    }
                    StorageModule.save();
                    SpeedControlModule.refresh();
                    CustomSpeedModule.renderSpeedList(container);
                });

                item.insertBefore(checkbox, item.firstChild);
                container.appendChild(item);
            });
        }
    };

    // ==================== 存储模块 ====================
    const StorageModule = {
        save() {
            try {
                const data = {
                    visible: StateManager.speedOptions,
                    custom: StateManager.customSpeeds
                };
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('保存倍速选项失败:', e);
            }
        },

        load() {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.visible) {
                        StateManager.speedOptions = data.visible;
                    }
                    if (data.custom) {
                        StateManager.customSpeeds = data.custom;
                    }
                }
            } catch (e) {
                console.error('加载倍速选项失败:', e);
            }
        }
    };

    // ==================== 样式模块 ====================
    const StyleModule = {
        inject() {
            if (document.getElementById('yt-speed-styles')) return;

            const style = document.createElement('style');
            style.id = 'yt-speed-styles';
            style.textContent = `
            .ytp-right-controls-left {
                overflow: visible !important;
                flex-shrink: 0 !important;
            }
            .ytp-right-controls {
                overflow: visible !important;
            }
            .ytp-chrome-controls .ytp-right-controls {
                flex-wrap: nowrap !important;
            }
            .yt-speed-control {
                display: inline-flex !important;
                visibility: visible !important;
                align-items: center !important;
                flex-shrink: 0 !important;
                width: auto !important;
                min-width: fit-content !important;
            }
            .yt-speed-option {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                visibility: visible !important;
                flex-shrink: 0 !important;
            }
            .yt-speed-option:hover {
                opacity: 1 !important;
            }
            .yt-speed-edit-panel::-webkit-scrollbar {
                width: 6px !important;
            }
            .yt-speed-edit-panel::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 3px !important;
            }
            .yt-speed-edit-panel::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3) !important;
                border-radius: 3px !important;
            }
            .yt-speed-edit-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5) !important;
            }
            .yt-speed-list::-webkit-scrollbar {
                width: 8px !important;
            }
            .yt-speed-list::-webkit-scrollbar-track {
                background: transparent !important;
                margin: 4px 0 !important;
            }
            .yt-speed-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.25) !important;
                border-radius: 4px !important;
                border: 2px solid transparent !important;
                background-clip: padding-box !important;
            }
            .yt-speed-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4) !important;
                background-clip: padding-box !important;
            }
            `;
            document.head.appendChild(style);
        }
    };

    // ==================== 初始化模块 ====================
    const InitModule = {
        // 窗口失焦处理
        handleWindowBlur() {
            if (StateManager.ctrlKeyState.isDown) {
                console.log('[YouTube倍速] 窗口失焦，强制恢复Ctrl键状态');
                const video = DOMCache.getVideo();
                if (video && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    KeyboardModule.restoreSpeed(video, StateManager.ctrlKeyState.originalSpeed);
                }
            }
        },

        // 鼠标点击处理（检测Ctrl键卡住）
        handleMouseDown() {
            if (StateManager.ctrlKeyState.isDown) {
                const video = DOMCache.getVideo();
                if (video && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                    console.log('[YouTube倍速] 检测到鼠标点击，检查Ctrl键状态');
                    setTimeout(() => {
                        if (StateManager.ctrlKeyState.isDown && video.playbackRate === CONFIG.SPEED_KEY_CTRL) {
                            console.log('[YouTube倍速] Ctrl键可能卡住，尝试恢复');
                            KeyboardModule.restoreSpeed(video, StateManager.ctrlKeyState.originalSpeed);
                        }
                    }, 100);
                }
            }
        },

        // 设置MutationObserver（优化：使用节流）
        setupObserver() {
            let observerTimeout = null;
            const observer = new MutationObserver(() => {
                if (observerTimeout) return;

                observerTimeout = setTimeout(() => {
                    SpeedControlModule.insert();
                    observerTimeout = null;
                }, 100);
            });

            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }
        },

        // 初始化所有功能
        init() {
            try {
                // 加载配置
                StorageModule.load();

                // 注册键盘事件
                document.addEventListener('keydown', KeyboardModule.handleKeyDown, true);
                document.addEventListener('keyup', KeyboardModule.handleKeyUp, true);

                // 注册全局监听器（Ctrl键兜底机制）
                window.addEventListener('blur', InitModule.handleWindowBlur, true);
                document.addEventListener('mousedown', InitModule.handleMouseDown, true);

                // 注册链接点击事件
                document.addEventListener('click', NewTabModule.handleLinkClick, true);

                // 页面加载时暂停视频
                document.addEventListener('DOMContentLoaded', NewTabModule.pauseVideoOnLoad);

                // 设置DOM监听器
                InitModule.setupObserver();

                // 页面加载完成后插入控件
                window.addEventListener('load', SpeedControlModule.insert);

                // 立即尝试插入
                if (document.readyState !== 'loading') {
                    SpeedControlModule.insert();
                }
            } catch (error) {
                console.error('[YouTube倍速控件] 初始化失败:', error);
            }
        }
    };

    // 启动脚本
    InitModule.init();
})();

