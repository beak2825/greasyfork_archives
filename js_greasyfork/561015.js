// ==UserScript==
// @name         B站视频倍速器
// @namespace    https://github.com/codertesla/bilibili-video-speed-controller-userscript
// @version      1.1.0
// @description  自由设定 Bilibili 视频的默认播放速度。支持记住设置、自动应用、手动倍速检测。
// @author       codertesla
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/*
// @match        *://*.bilibili.com/cheese/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://github.com/codertesla/bilibili-video-speed-controller-userscript
// @homepageURL  https://github.com/codertesla/bilibili-video-speed-controller-userscript
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561015/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561015/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 常量配置 ====================
    const SPEED_SETTINGS = {
        MIN: 0.1,
        MAX: 3.0,
        DEFAULT: 1.0,
        DEFAULT_ENABLED: true,
        PLATFORM_DEFAULTS: {
            bilibili: 1.5
        },
        PRESETS: [1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0]
    };

    const MIN_SPEED = SPEED_SETTINGS.MIN;
    const MAX_SPEED = SPEED_SETTINGS.MAX;

    // ==================== 存储工具（油猴版） ====================
    const Storage = {
        get(key, defaultValue) {
            return GM_getValue(key, defaultValue);
        },
        set(key, value) {
            GM_setValue(key, value);
        }
    };

    // ==================== 错误处理工具 ====================
    class ErrorHandler {
        static log(level, message, error = null) {
            const prefix = '[Video Speed Controller]';
            const logMessage = `${prefix} ${message}`;

            const logWithOptionalError = (logger) => {
                if (error !== null && error !== undefined) {
                    logger(logMessage, error);
                } else {
                    logger(logMessage);
                }
            };

            switch (level) {
                case 'error':
                    logWithOptionalError(console.error);
                    break;
                case 'warn':
                    logWithOptionalError(console.warn);
                    break;
                case 'info':
                default:
                    console.log(logMessage);
                    break;
            }
        }
    }

    // ==================== DOM操作工具 ====================
    class DOMUtils {
        static findVideoElements() {
            return Array.from(document.querySelectorAll('video')).filter(video => {
                return !video.classList.contains('speed-controller-ignored');
            });
        }

        static getVideoContainer(video) {
            let container = video.parentElement;
            while (container && container.tagName !== 'BODY') {
                if (container.offsetWidth > video.offsetWidth ||
                    container.offsetHeight > video.offsetHeight) {
                    return container;
                }
                container = container.parentElement;
            }
            return video.parentElement || document.body;
        }

        static isValidSpeed(speed) {
            return typeof speed === 'number' && !isNaN(speed) &&
                   speed >= MIN_SPEED && speed <= MAX_SPEED;
        }

        static findOptimalObserverTarget(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element;
                }
            }
            return document.body;
        }

        static isVideoContainer(element) {
            if (!element) return false;
            const hasVideo = element.querySelector('video') !== null;
            const hasVideoClasses = /\b(player|video|media)\b/i.test(element.className);
            const hasVideoId = /\b(player|video)\b/i.test(element.id);
            return hasVideo || hasVideoClasses || hasVideoId;
        }

        static getElementDepth(element) {
            let depth = 0;
            let current = element;
            while (current && current !== document.body) {
                depth++;
                current = current.parentElement;
            }
            return depth;
        }

        static clampObserverTargetDepth(element, maxDepth) {
            if (!element) {
                return { node: null, depth: 0 };
            }
            if (typeof maxDepth !== 'number' || maxDepth < 0) {
                return { node: element, depth: DOMUtils.getElementDepth(element) };
            }
            let current = element;
            let depth = DOMUtils.getElementDepth(current);
            while (current && current !== document.body && depth > maxDepth) {
                const parent = current.parentElement;
                if (!parent) break;
                current = parent;
                depth = DOMUtils.getElementDepth(current);
            }
            return { node: current || element, depth };
        }

        static describeElement(element) {
            if (!element) return 'unknown';
            const parts = [];
            if (element.tagName) parts.push(element.tagName.toLowerCase());
            if (element.id) parts.push(`#${element.id}`);
            if (element.classList && element.classList.length) {
                parts.push(`.${Array.from(element.classList).join('.')}`);
            }
            return parts.join('') || 'unnamed-element';
        }
    }

    // ==================== 视频速度控制器核心类 ====================
    class VideoSpeedController {
        constructor(platform, config = {}) {
            this.platform = platform;
            this.currentSpeed = config.defaultSpeed || 1.0;
            this.enabled = config.defaultEnabled !== false;
            this.observer = null;
            this.isInitialized = false;
            this.hasLoggedDeepTargetWarning = false;
            this.storageKeys = {
                speed: `${platform}Speed`,
                enabled: 'enabled'
            };

            this.manualOverrides = new Map();
            this.observedVideos = new Set();
            this.videoSources = new Map();
            this.boundHandleRateChange = this.handleRateChange.bind(this);
            this.boundHandleLoadedMetadata = this.handleLoadedMetadata.bind(this);
            this.boundRecordInteraction = this.recordInteraction.bind(this);
            this.interactionEvents = ['pointerdown', 'mousedown', 'keydown', 'wheel', 'touchstart'];
            this.interactionTrackingInitialized = false;
            this.lastUserInteraction = 0;

            this.config = {
                targetSelector: config.targetSelector || 'body',
                observeOptions: config.observeOptions || {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['src', 'class']
                },
                debounceDelay: config.debounceDelay || 300,
                maxObserverDepth: typeof config.maxObserverDepth === 'number' ? config.maxObserverDepth : 6,
                deepTargetWarningThreshold: typeof config.deepTargetWarningThreshold === 'number'
                    ? config.deepTargetWarningThreshold : 7,
                manualOverrideInteractionWindow: typeof config.manualOverrideInteractionWindow === 'number'
                    ? config.manualOverrideInteractionWindow : 1200,
                ...config
            };

            this.debounceTimer = null;
        }

        async initialize() {
            if (this.isInitialized) return;

            try {
                this.loadSettings();
                this.setupUserInteractionTracking();

                if (this.enabled) {
                    this.applyVideoSpeed();
                    this.setupObserver();
                }

                this.isInitialized = true;
                ErrorHandler.log('info', `${this.platform} 视频速度控制器初始化完成`);
            } catch (error) {
                ErrorHandler.log('error', `${this.platform} 控制器初始化失败`, error);
            }
        }

        loadSettings() {
            const savedSpeed = Storage.get(this.storageKeys.speed, this.currentSpeed);
            const savedEnabled = Storage.get(this.storageKeys.enabled, this.enabled);

            this.currentSpeed = parseFloat(savedSpeed);
            this.enabled = savedEnabled;

            if (!DOMUtils.isValidSpeed(this.currentSpeed)) {
                this.currentSpeed = this.config.defaultSpeed || 1.0;
                ErrorHandler.log('warn', `无效的速度值，已重置为 ${this.currentSpeed}x`);
            }
        }

        saveSettings() {
            Storage.set(this.storageKeys.speed, this.currentSpeed);
            Storage.set(this.storageKeys.enabled, this.enabled);
        }

        setSpeed(newSpeed) {
            if (DOMUtils.isValidSpeed(newSpeed)) {
                this.currentSpeed = newSpeed;
                this.saveSettings();
                this.clearManualOverrides();
                if (this.enabled) {
                    this.applyVideoSpeed();
                }
                ErrorHandler.log('info', `${this.platform} 速度已设置为 ${newSpeed}x`);
            }
        }

        setEnabled(newEnabled) {
            this.enabled = newEnabled;
            this.saveSettings();
            if (this.enabled) {
                this.clearManualOverrides();
                this.applyVideoSpeed();
                this.setupObserver();
            } else {
                this.resetVideoSpeed();
                this.disconnectObserver();
            }
            ErrorHandler.log('info', `${this.platform} 倍速功能 ${this.enabled ? '已启用' : '已禁用'}`);
        }

        debounceUpdate() {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.applyVideoSpeed();
            }, this.config.debounceDelay);
        }

        applyVideoSpeed() {
            try {
                const videos = DOMUtils.findVideoElements();
                let appliedCount = 0;

                videos.forEach(video => {
                    this.attachVideoListeners(video);

                    if (this.manualOverrides.has(video)) {
                        return;
                    }

                    if (this.setVideoPlaybackRate(video, this.currentSpeed)) {
                        appliedCount++;
                    }
                });

                if (appliedCount > 0) {
                    ErrorHandler.log('info',
                        `${this.platform} 已将 ${appliedCount} 个视频速度设置为 ${this.currentSpeed}x`);
                }
            } catch (error) {
                ErrorHandler.log('error', `${this.platform} 应用视频速度失败`, error);
            }
        }

        resetVideoSpeed() {
            try {
                const videos = DOMUtils.findVideoElements();
                let resetCount = 0;

                videos.forEach(video => {
                    this.attachVideoListeners(video);
                    if (this.setVideoPlaybackRate(video, 1.0)) {
                        resetCount++;
                    }
                });

                if (resetCount > 0) {
                    ErrorHandler.log('info', `${this.platform} 已重置 ${resetCount} 个视频速度为 1.0x`);
                }
            } catch (error) {
                ErrorHandler.log('error', `${this.platform} 重置视频速度失败`, error);
            }
        }

        setupObserver() {
            this.disconnectObserver();

            try {
                let targetNode;
                let observerOptions = { ...this.config.observeOptions };

                if (Array.isArray(this.config.targetSelector)) {
                    targetNode = DOMUtils.findOptimalObserverTarget(this.config.targetSelector);
                } else {
                    targetNode = document.querySelector(this.config.targetSelector) || document.body;
                }

                let { node: adjustedTarget, depth: targetDepth } = DOMUtils.clampObserverTargetDepth(
                    targetNode,
                    this.config.maxObserverDepth
                );

                if (adjustedTarget && adjustedTarget !== targetNode) {
                    targetNode = adjustedTarget;
                    ErrorHandler.log('info', `${this.platform} 调整观察目标为 ${DOMUtils.describeElement(targetNode)} 以降低观察深度`);
                }

                observerOptions = { ...observerOptions };
                const warningThreshold = this.config.deepTargetWarningThreshold;
                if (typeof warningThreshold === 'number' && targetDepth > warningThreshold && !this.hasLoggedDeepTargetWarning) {
                    ErrorHandler.log('info',
                        `${this.platform} 观察目标深度较大(${targetDepth})，请确认 targetSelector 是否最佳`);
                    this.hasLoggedDeepTargetWarning = true;
                }

                this.observer = new MutationObserver((mutations) => {
                    this.handleMutations(mutations);
                });

                this.observer.observe(targetNode, observerOptions);

                this.observerInfo = {
                    target: DOMUtils.describeElement(targetNode),
                    depth: targetDepth,
                    options: observerOptions
                };

                ErrorHandler.log('info', `${this.platform} MutationObserver 已设置，目标: ${this.observerInfo.target}`);
            } catch (error) {
                ErrorHandler.log('error', `${this.platform} 设置观察器失败`, error);
            }
        }

        handleMutations(mutations) {
            let hasVideoChanges = false;
            let changeCount = 0;
            const maxChangesToProcess = 50;

            for (const mutation of mutations) {
                if (changeCount >= maxChangesToProcess) {
                    ErrorHandler.log('warn', `${this.platform} 变更数量过多，跳过部分处理`);
                    break;
                }

                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (this.isVideoRelatedElement(node)) {
                                hasVideoChanges = true;
                                changeCount++;
                                break;
                            }
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.nodeName === 'VIDEO') {
                        if (this.config.observeOptions.attributeFilter) {
                            if (this.config.observeOptions.attributeFilter.includes(mutation.attributeName)) {
                                hasVideoChanges = true;
                                changeCount++;
                            }
                        } else {
                            hasVideoChanges = true;
                            changeCount++;
                        }
                    }
                }

                if (hasVideoChanges) break;
            }

            if (hasVideoChanges && this.enabled) {
                ErrorHandler.log('info', `${this.platform} 检测到视频元素变化，重新应用速度 (${changeCount}个变更)`);
                this.debounceUpdate();
            }
        }

        isVideoRelatedElement(element) {
            if (element.nodeName === 'VIDEO') {
                return true;
            }
            if (element.querySelector && DOMUtils.getElementDepth(element) < 3) {
                const video = element.querySelector('video');
                if (video) {
                    return true;
                }
            }
            return DOMUtils.isVideoContainer(element);
        }

        disconnectObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                ErrorHandler.log('info', `${this.platform} MutationObserver 已断开`);
            }
        }

        destroy() {
            this.disconnectObserver();
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.observedVideos.forEach(video => {
                video.removeEventListener('ratechange', this.boundHandleRateChange, true);
                video.removeEventListener('loadedmetadata', this.boundHandleLoadedMetadata, true);
                delete video.__speedControllerApplying;
            });
            this.observedVideos.clear();
            this.manualOverrides.clear();
            this.videoSources.clear();
            this.teardownUserInteractionTracking();
            this.isInitialized = false;
            ErrorHandler.log('info', `${this.platform} 控制器已销毁`);
        }

        getStatus() {
            return {
                platform: this.platform,
                enabled: this.enabled,
                currentSpeed: this.currentSpeed,
                isInitialized: this.isInitialized,
                videoCount: DOMUtils.findVideoElements().length
            };
        }

        attachVideoListeners(video) {
            if (!video || this.observedVideos.has(video)) {
                return;
            }
            video.addEventListener('ratechange', this.boundHandleRateChange, true);
            video.addEventListener('loadedmetadata', this.boundHandleLoadedMetadata, true);
            this.observedVideos.add(video);
            this.videoSources.set(video, video.currentSrc || video.src || '');
        }

        clearManualOverrides() {
            this.manualOverrides.clear();
        }

        setVideoPlaybackRate(video, speed) {
            if (!video || !DOMUtils.isValidSpeed(speed)) {
                return false;
            }
            if (typeof video.playbackRate !== 'number') {
                return false;
            }
            if (Math.abs(video.playbackRate - speed) < 0.001) {
                this.manualOverrides.delete(video);
                return false;
            }
            try {
                video.__speedControllerApplying = true;
                video.playbackRate = speed;
                this.manualOverrides.delete(video);
                this.videoSources.set(video, video.currentSrc || video.src || '');
                return true;
            } catch (error) {
                ErrorHandler.log('warn', `${this.platform} 设置视频速度失败，速率=${speed}`, error);
                return false;
            } finally {
                video.__speedControllerApplying = false;
            }
        }

        handleRateChange(event) {
            const video = event.target;
            if (!video || video.__speedControllerApplying) {
                return;
            }
            const newRate = video.playbackRate;
            if (!DOMUtils.isValidSpeed(newRate)) {
                return;
            }
            const now = Date.now();
            const interactionWindow = Math.max(0, this.config.manualOverrideInteractionWindow || 0);
            const hadRecentInteraction = now - this.lastUserInteraction <= interactionWindow;

            if (!hadRecentInteraction) {
                this.manualOverrides.delete(video);
                if (this.enabled) {
                    this.debounceUpdate();
                }
                return;
            }

            if (Math.abs(newRate - this.currentSpeed) < 0.001) {
                this.manualOverrides.delete(video);
                return;
            }

            this.manualOverrides.set(video, {
                speed: newRate,
                timestamp: Date.now()
            });

            ErrorHandler.log('info', `${this.platform} 检测到手动倍速 ${newRate}x，暂停自动应用`);
        }

        handleLoadedMetadata(event) {
            const video = event.target;
            if (!video) {
                return;
            }
            const newSrc = video.currentSrc || video.src || '';
            const previousSrc = this.videoSources.get(video) || '';

            if (newSrc && newSrc !== previousSrc) {
                this.manualOverrides.delete(video);
                this.videoSources.set(video, newSrc);
                ErrorHandler.log('info', `${this.platform} 检测到新媒体源，恢复自动倍速`);
            }

            if (this.enabled && !this.manualOverrides.has(video)) {
                this.debounceUpdate();
            }
        }

        recordInteraction() {
            this.lastUserInteraction = Date.now();
        }

        setupUserInteractionTracking() {
            if (this.interactionTrackingInitialized) {
                return;
            }
            this.interactionEvents.forEach(eventName => {
                document.addEventListener(eventName, this.boundRecordInteraction, true);
            });
            this.interactionTrackingInitialized = true;
        }

        teardownUserInteractionTracking() {
            if (!this.interactionTrackingInitialized) {
                return;
            }
            this.interactionEvents.forEach(eventName => {
                document.removeEventListener(eventName, this.boundRecordInteraction, true);
            });
            this.interactionTrackingInitialized = false;
        }

        prepareForNavigation() {
            this.clearManualOverrides();
            this.videoSources.clear();
            this.lastUserInteraction = 0;
        }
    }

    // ==================== 平台检测与配置 ====================
    function detectPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('bilibili.com')) {
            return 'bilibili';
        }
        return null;
    }

    // B站配置
    const bilibiliConfig = {
        targetSelector: [
            '.bpx-player-video-area',
            '.player-container',
            '#player_module',
            '.video-container',
            '#bilibili-player'
        ],
        observeOptions: {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'style', 'data-loaded']
        },
        maxObserverDepth: 6,
        deepTargetWarningThreshold: 9,
        debounceDelay: 500,
        defaultSpeed: SPEED_SETTINGS.PLATFORM_DEFAULTS.bilibili,
        defaultEnabled: true
    };


    // ==================== 油猴菜单命令 ====================
    function registerMenuCommands(controller) {
        const platformName = 'B站';


        // 显示当前状态
        GM_registerMenuCommand(`📊 当前状态: ${controller.enabled ? controller.currentSpeed + 'x' : '已禁用'}`, () => {
            const status = controller.getStatus();
            alert(`${platformName} 视频倍速控制器\n\n` +
                  `状态: ${status.enabled ? '启用' : '禁用'}\n` +
                  `当前速度: ${status.currentSpeed}x\n` +
                  `检测到视频: ${status.videoCount} 个`);
        });

        // 启用/禁用
        GM_registerMenuCommand(`⚡ ${controller.enabled ? '禁用' : '启用'}倍速功能`, () => {
            controller.setEnabled(!controller.enabled);
        });

        // 常用速度选项
        SPEED_SETTINGS.PRESETS.forEach(speed => {
            const mark = speed === controller.currentSpeed ? '✓ ' : '  ';
            GM_registerMenuCommand(`${mark}设置为 ${speed}x`, () => {
                controller.setSpeed(speed);
                controller.setEnabled(true);
            });
        });

        // 自定义速度
        GM_registerMenuCommand('🎚️ 自定义速度...', () => {
            const input = prompt(`请输入播放速度 (${MIN_SPEED} - ${MAX_SPEED}):`, controller.currentSpeed.toString());
            if (input !== null) {
                const speed = parseFloat(input);
                if (DOMUtils.isValidSpeed(speed)) {
                    controller.setSpeed(speed);
                    controller.setEnabled(true);
                } else {
                    alert(`无效的速度值！请输入 ${MIN_SPEED} 到 ${MAX_SPEED} 之间的数字。`);
                }
            }
        });
    }

    // ==================== 主初始化 ====================
    function main() {
        const platform = detectPlatform();
        if (!platform) {
            ErrorHandler.log('warn', '无法识别当前平台');
            return;
        }

        const config = bilibiliConfig;
        const controller = new VideoSpeedController(platform, config);

        // 初始化控制器
        controller.initialize().then(() => {
            // 注册油猴菜单
            registerMenuCommands(controller);
        }).catch(error => {
            ErrorHandler.log('error', `${platform} 控制器初始化失败`, error);
        });

        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            if (controller) {
                controller.destroy();
            }
        });

        ErrorHandler.log('info', `${platform} 油猴脚本启动完成`);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
