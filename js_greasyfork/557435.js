// ==UserScript==
// @name         e621 视频大播放按钮
// @namespace    Lecrp.com
// @version      2.0
// @description  针对手机视频靠上，在下半屏添加播放按钮
// @author       jcjyids
// @match        https://e621.net/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557435/e621%20%E8%A7%86%E9%A2%91%E5%A4%A7%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/557435/e621%20%E8%A7%86%E9%A2%91%E5%A4%A7%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 可配置参数 =====
    const CONFIG = {
        // 按钮样式配置
        button: {
            borderRadius: '50px',      // 按钮圆角大小
            height: '40vh',            // 按钮高度
            width: '40vw',             // 按钮宽度
            translateY: '45vh',        // 垂直偏移量
            opacity: '0.6',            // 按钮透明度
            borderWidth: '3px',        // 边框宽度
            borderColor: 'rgba(255, 255, 255, 0.6)', // 边框颜色
            backgroundColor: 'rgba(0, 0, 0, 0.6)',   // 按钮背景颜色
            iconColor: 'rgba(255, 255, 255, 0.6)'    // 图标颜色
        },

        // 播放状态监控配置
        playbackMonitor: {
            interval: 200,             // 检测间隔时间(毫秒)
            totalDuration: 3000        // 总监控时长(毫秒)
        },

        // 触摸交互配置
        touchConfig: {
            maxDistance: 20,           // 最大点击移动距离(像素)
            maxDuration: 500,          // 最大点击时长(毫秒)
            longPressDelay: 500        // 长按延迟时间(毫秒)
        },

        // 超时配置
        timeouts: {
            domObservation: 3000,      // DOM观察超时(毫秒)
            videoLoad: 5000            // 视频加载超时(毫秒)
        },

        // SVG图标
        iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"/>
            <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" 
                    stroke-miterlimit="10" stroke-width="16"/>
            <polygon points="172 128 108 88 108 168 172 128" fill="currentColor" 
                    stroke="currentColor" stroke-linecap="round" 
                    stroke-linejoin="round" stroke-width="16"/>
        </svg>`
    };

    // ===== 全局状态变量 =====
    let state = {
        // 脚本状态
        isActive: true,
        isCleaning: false,

        // 按钮与容器状态
        buttonContainer: null,
        button: null,
        containerRect: null,
        buttonRect: null,
        overlayCreated: false,

        // 视频状态
        video: null,

        // 触摸状态
        touch: {
            startX: 0,
            startY: 0,
            startTime: 0,
            maxDistance: 0,
            isOnButton: false,
            isOnContainer: false, // 新增：是否在容器内
            hasMoved: false,
            isScrolling: false,
            touchCount: 0,
            longPressTimer: null,
            shouldPreventDefault: false
        },

        // 定时器和监听器
        timers: {
            playbackMonitor: null,
            videoLoadTimeout: null,
            domObservationTimeout: null
        },
        observers: {
            mutationObserver: null
        },
        eventListeners: []
    };

    // ===== 工具函数 =====

    /**
     * 添加事件监听器并记录到状态中，便于统一清理
     */
    function addEventListener(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        state.eventListeners.push({ element, event, handler });
        return handler;
    }

    /**
     * 清理所有定时器
     */
    function clearAllTimers() {
        Object.values(state.timers).forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        state.timers = {};
    }

    /**
     * 移除所有事件监听器
     */
    function removeAllEventListeners() {
        state.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        state.eventListeners = [];
    }

    /**
     * 判断点是否在矩形内
     */
    function isPointInRect(x, y, rect) {
        return rect && 
            x >= rect.left && 
            x <= rect.right && 
            y >= rect.top && 
            y <= rect.bottom;
    }

    /**
     * 计算两点之间的距离
     */
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // ===== 清理函数 =====

    /**
     * 清理所有资源，结束脚本
     */
    function cleanup() {
        if (state.isCleaning || !state.isActive) return;
        state.isCleaning = true;

        // 移除整个按钮容器（包含按钮）
        if (state.buttonContainer && state.buttonContainer.parentNode) {
            state.buttonContainer.parentNode.removeChild(state.buttonContainer);
        }

        // 清除所有定时器
        clearAllTimers();

        // 移除所有事件监听器
        removeAllEventListeners();

        // 停止MutationObserver
        if (state.observers.mutationObserver) {
            state.observers.mutationObserver.disconnect();
        }

        // 重置状态
        state.isActive = false;
        state.isCleaning = false;
    }

    // ===== 触摸事件系统 =====

    /**
     * 全局触摸开始事件处理
     */
    function handleGlobalTouchStart(event) {
        if (!state.isActive || state.touch.touchCount > 0) return;

        const touch = event.touches[0];
        state.touch.startX = touch.clientX;
        state.touch.startY = touch.clientY;
        state.touch.startTime = Date.now();
        state.touch.maxDistance = 0;
        state.touch.hasMoved = false;
        state.touch.isScrolling = false;
        state.touch.touchCount = event.touches.length;
        state.touch.shouldPreventDefault = false;

        // 多指触摸直接标记为滑动
        if (state.touch.touchCount > 1) {
            state.touch.isScrolling = true;
            if (state.touch.longPressTimer) {
                clearTimeout(state.touch.longPressTimer);
                state.touch.longPressTimer = null;
            }
            return;
        }

        // 检查是否在容器和按钮上
        if (state.buttonContainer) {
            state.containerRect = state.buttonContainer.getBoundingClientRect();
            state.touch.isOnContainer = isPointInRect(
                touch.clientX, 
                touch.clientY, 
                state.containerRect
            );

            // 在容器内，进一步检查是否在按钮上
            if (state.touch.isOnContainer && state.button) {
                state.buttonRect = state.button.getBoundingClientRect();
                state.touch.isOnButton = isPointInRect(
                    touch.clientX, 
                    touch.clientY, 
                    state.buttonRect
                );

                // 在按钮上且单指，设置长按定时器
                if (state.touch.isOnButton) {
                    state.touch.longPressTimer = setTimeout(() => {
                        state.touch.shouldPreventDefault = true;
                    }, CONFIG.touchConfig.longPressDelay);
                }
            } else {
                state.touch.isOnButton = false;
            }
        }
    }

    /**
     * 全局触摸移动事件处理
     */
    function handleGlobalTouchMove(event) {
        if (!state.isActive || state.touch.touchCount === 0 || state.touch.isScrolling) {
            return;
        }

        // 执行延迟的preventDefault（防止长按菜单）
        if (state.touch.shouldPreventDefault) {
            event.preventDefault();
            state.touch.shouldPreventDefault = false;
        }

        const touch = event.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        // 计算移动距离
        const distance = calculateDistance(
            state.touch.startX, 
            state.touch.startY, 
            currentX, 
            currentY
        );

        state.touch.maxDistance = Math.max(state.touch.maxDistance, distance);
        state.touch.hasMoved = true;

        // 超过阈值，标记为滑动
        if (distance > CONFIG.touchConfig.maxDistance) {
            state.touch.isScrolling = true;
            // 清除长按定时器
            if (state.touch.longPressTimer) {
                clearTimeout(state.touch.longPressTimer);
                state.touch.longPressTimer = null;
            }
        }
    }

    /**
     * 全局触摸结束事件处理
     */
    function handleGlobalTouchEnd(event) {
        if (!state.isActive) return;

        // 清除长按定时器
        if (state.touch.longPressTimer) {
            clearTimeout(state.touch.longPressTimer);
            state.touch.longPressTimer = null;
        }

        const touch = event.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const duration = Date.now() - state.touch.startTime;

        // 滑动：不移除按钮
        if (state.touch.isScrolling || state.touch.maxDistance > CONFIG.touchConfig.maxDistance) {
            resetTouchState();
            return;
        }

        // 1. 点击在按钮上（有效点击）：触发播放，阻止穿透
        if (state.touch.isOnButton) {
            const endedOnButton = isPointInRect(endX, endY, state.buttonRect);
            const distanceOk = state.touch.maxDistance <= CONFIG.touchConfig.maxDistance;
            const timeOk = duration <= CONFIG.touchConfig.maxDuration;

            if (endedOnButton && distanceOk && timeOk) {
                event.preventDefault();
                event.stopPropagation();
                triggerPlayback();
            } else {
                // 无效点击（如移动很小但超时）：重置状态，不触发任何操作
                resetTouchState();
            }
            return;
        }

        // 2. 点击在容器内（按钮外）：移除控件，阻止穿透
        if (state.touch.isOnContainer) {
            event.preventDefault();
            event.stopPropagation();
            cleanup();
            return;
        }

        // 3. 点击在容器外：移除控件，但不阻止穿透
        cleanup();
    }

    /**
     * 重置触摸状态
     */
    function resetTouchState() {
        state.touch = {
            startX: 0,
            startY: 0,
            startTime: 0,
            maxDistance: 0,
            isOnButton: false,
            isOnContainer: false,
            hasMoved: false,
            isScrolling: false,
            touchCount: 0,
            longPressTimer: null,
            shouldPreventDefault: false
        };
    }

    // ===== 视频播放处理 =====

    /**
     * 触发视频播放流程
     */
    function triggerPlayback() {
        if (!state.isActive || !state.video) return;

        // 立即移除按钮
        if (state.buttonContainer && state.buttonContainer.parentNode) {
            state.buttonContainer.parentNode.removeChild(state.buttonContainer);
            state.buttonContainer = null;
            state.button = null;
        }

        // 清除播放状态监控
        if (state.timers.playbackMonitor) {
            clearInterval(state.timers.playbackMonitor);
            state.timers.playbackMonitor = null;
        }

        // 尝试播放视频
        playVideoWithFallback();
    }

    /**
     * 播放视频，处理加载未完成的情况
     */
    function playVideoWithFallback() {
        if (!state.video) {
            cleanup();
            return;
        }

        // 尝试立即播放
        state.video.play()
            .then(() => {
            // 播放成功，清理
            setTimeout(cleanup, 100);
        })
            .catch(error => {
            // 播放失败，可能视频未加载完成
            if (state.video.readyState < 2) { // HAVE_CURRENT_DATA
                waitForVideoLoad();
            } else {
                // 其他错误，静默清理
                cleanup();
            }
        });
    }

    /**
     * 等待视频加载完成
     */
    function waitForVideoLoad() {
        if (!state.video) {
            cleanup();
            return;
        }

        const onCanPlay = () => {
            // 移除超时定时器
            if (state.timers.videoLoadTimeout) {
                clearTimeout(state.timers.videoLoadTimeout);
                state.timers.videoLoadTimeout = null;
            }

            // 尝试播放
            state.video.play()
                .then(() => cleanup())
                .catch(() => cleanup()); // 静默失败
        };

        // 添加加载完成监听
        addEventListener(state.video, 'canplay', onCanPlay, { once: true });

        // 设置加载超时
        state.timers.videoLoadTimeout = setTimeout(() => {
            // 超时后清理
            cleanup();
        }, CONFIG.timeouts.videoLoad);
    }

    // ===== 播放状态监控 =====

    /**
     * 启动播放状态监控
     */
    function startPlaybackMonitor(video) {
        if (!state.isActive) return;

        const startTime = Date.now();

        state.timers.playbackMonitor = setInterval(() => {
            if (!state.isActive || !video) {
                clearInterval(state.timers.playbackMonitor);
                return;
            }

            // 检查视频是否开始播放
            if (!video.paused && video.currentTime > 0) {
                clearInterval(state.timers.playbackMonitor);
                cleanup();
                return;
            }

            // 检查是否超时
            if (Date.now() - startTime >= CONFIG.playbackMonitor.totalDuration) {
                clearInterval(state.timers.playbackMonitor);
                // 超时后继续保留按钮，等待用户交互
            }
        }, CONFIG.playbackMonitor.interval);
    }

    // ===== 视频检测逻辑 =====

    /**
     * 检测视频元素
     */
    function detectVideoElement() {
        if (!state.isActive) return;

        // 方法1：检测#image元素
        let video = document.querySelector('#image');
        if (video && video.tagName === 'VIDEO') {
            initButton(video);
            return true;
        }

        // 方法2：监听DOM变化
        startDomObservation();
        return false;
    }

    /**
     * 启动DOM变化观察
     */
    function startDomObservation() {
        if (!state.isActive) return;

        const container = document.querySelector('#image-and-nav');
        if (!container) {
            // 容器不存在，设置超时后结束
            state.timers.domObservationTimeout = setTimeout(() => {
                cleanup();
            }, CONFIG.timeouts.domObservation);
            return;
        }

        // 创建MutationObserver
        const observer = new MutationObserver((mutations) => {
            if (!state.isActive) return;

            const video = document.querySelector('#image');
            if (video && video.tagName === 'VIDEO') {
                // 找到视频，停止观察并初始化按钮
                observer.disconnect();
                if (state.timers.domObservationTimeout) {
                    clearTimeout(state.timers.domObservationTimeout);
                }
                initButton(video);
            }
        });

        // 开始观察
        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        state.observers.mutationObserver = observer;

        // 设置观察超时
        state.timers.domObservationTimeout = setTimeout(() => {
            if (state.isActive && state.observers.mutationObserver) {
                state.observers.mutationObserver.disconnect();
                cleanup();
            }
        }, CONFIG.timeouts.domObservation);
    }

    // ===== 按钮创建 =====

    /**
     * 初始化按钮
     */
    function initButton(video) {
        if (!state.isActive || state.overlayCreated) return;

        state.video = video;
        state.overlayCreated = true;

        // 如果视频已经在播放，直接退出
        if (!video.paused && video.currentTime > 0) {
            cleanup();
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            position: 'fixed',
            top: '0', // 固定于视口顶部
            left: '0',
            width: '100vw',
            height: CONFIG.button.height,
            background: 'transparent',
            zIndex: '2147483647',
            display: 'flex',
            justifyContent: 'center',
            transform: `translate(0, ${CONFIG.button.translateY})`, // 仅此一处偏移
        });

        // 创建播放按钮
        const button = document.createElement('div');
        button.innerHTML = CONFIG.iconSVG;
        Object.assign(button.style, {
            width: CONFIG.button.width,
            height: CONFIG.button.height,
            background: CONFIG.button.backgroundColor,
            color: CONFIG.button.iconColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: CONFIG.button.borderRadius,
            cursor: 'pointer',
            boxShadow: `inset 0 0 0 ${CONFIG.button.borderWidth} ${CONFIG.button.borderColor}`,
            opacity: CONFIG.button.opacity,
            pointerEvents: 'auto', // 按钮本身可点击
            touchAction: 'manipulation', // 优化触摸交互
            userSelect: 'none', // 防止文本选择
            WebkitTouchCallout: 'none', // 禁止长按菜单
            WebkitTapHighlightColor: 'transparent' // 设置触摸高亮颜色为透明
        });

        buttonContainer.appendChild(button);
        document.body.appendChild(buttonContainer);

        // 保存引用
        state.buttonContainer = buttonContainer;
        state.button = button;
        state.containerRect = buttonContainer.getBoundingClientRect();
        state.buttonRect = button.getBoundingClientRect();

        // 初始化触摸事件系统
        initTouchEvents();

        // 启动播放状态监控
        startPlaybackMonitor(video);
    }

    /**
     * 初始化触摸事件系统
     */
    function initTouchEvents() {
        if (!state.isActive) return;

        // 添加全局触摸事件监听器
        const options = { passive: true };
        const optionsEnd = { passive: false }; // touchend需要阻止默认行为

        addEventListener(document, 'touchstart', handleGlobalTouchStart, options);
        addEventListener(document, 'touchmove', handleGlobalTouchMove, options);
        addEventListener(document, 'touchend', handleGlobalTouchEnd, optionsEnd);

        // 添加触摸取消事件
        addEventListener(document, 'touchcancel', () => {
            resetTouchState();
        }, options);
    }

    // ===== 初始化入口 =====

    /**
     * 初始化脚本
     */
    function initialize() {
        if (!state.isActive) return;

        // 如果DOM已经加载完成，立即启动
        if (document.readyState === 'loading') {
            addEventListener(document, 'DOMContentLoaded', () => {
                detectVideoElement();
            }, { once: true });
        } else {
            detectVideoElement();
        }
    }

    // ===== 启动脚本 =====
    initialize();
})();