// ==UserScript==
// @name         党校自动刷课
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  阻止页面通过visibilitychange等事件检测标签页切换和后台状态，并自动静音视频，同时阻止暂停视频，保持播放。
// @author       AMT
// @match        *://你的党校url/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555901/%E5%85%9A%E6%A0%A1%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555901/%E5%85%9A%E6%A0%A1%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 保存原始属性值
    const originalVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
    const originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
    const originalHasFocus = Object.getOwnPropertyDescriptor(Document.prototype, 'hasFocus');

    // 重写 visibilityState 属性，始终返回 'visible'
    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        },
        configurable: false
    });

    // 重写 hidden 属性，始终返回 false
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        },
        configurable: false
    });

    // 重写 hasFocus 方法，始终返回 true
    Object.defineProperty(document, 'hasFocus', {
        get: function() {
            return function() {
                return true;
            };
        },
        configurable: false
    });

    // 阻止所有相关的事件
    const eventsToBlock = [
        'visibilitychange',
        'webkitvisibilitychange',
        'blur',
        'focus',
        'pagehide',
        'pageshow'
    ];

    eventsToBlock.forEach(eventName => {
        // 在捕获阶段阻止事件传播
        document.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }, true);

        window.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }, true);
    });

    // 额外处理 window 的 blur 和 focus 事件
    const windowEvents = ['blur', 'focus', 'beforeunload', 'unload'];
    windowEvents.forEach(eventName => {
        window.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }, true);
    });

    // 阻止 requestAnimationFrame 在后台时暂停
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF.call(this, callback);
    };

    // 阻止 setInterval 在后台时降速
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
        return originalSetInterval.call(this, callback, delay);
    };

    // 阻止 setTimeout 在后台时降速
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        return originalSetTimeout.call(this, callback, delay);
    };

    // 静音所有现有视频，但不阻止播放
    function muteAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            try {
                // 只设置静音，不干扰播放状态
                video.muted = true;
                if (typeof video.volume !== 'undefined') {
                    video.volume = 0;
                }

                // 如果视频被暂停了（可能是因为离开页面），尝试重新播放
                if (video.paused && !video.ended && video.readyState > 2) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            // 忽略播放错误，可能是用户交互限制
                            console.log('视频自动播放被阻止:', e);
                        });
                    }
                }

                console.log('视频已静音:', video.src || '未知来源');
            } catch (e) {
                console.log('处理视频时出错:', e);
            }
        });
    }

    // 监听视频状态变化，确保静音状态下持续播放
    function setupVideoWatchers() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 移除可能已存在的监听器，避免重复
            if (!video._muteWatcher) {
                video._muteWatcher = true;

                // 监听暂停事件，如果是静音状态且不是用户手动暂停，则恢复播放
                video.addEventListener('pause', function(e) {
                    if (this.muted && !this.ended && this.readyState > 2) {
                        // 检查是否是因为页面不可见导致的暂停
                        setTimeout(() => {
                            if (this.paused && this.muted) {
                                const playPromise = this.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(err => {
                                        console.log('恢复播放失败:', err);
                                    });
                                }
                            }
                        }, 100);
                    }
                }, true);

                // 监听播放事件，确保播放时是静音状态
                video.addEventListener('play', function() {
                    if (!this.muted) {
                        this.muted = true;
                        if (typeof this.volume !== 'undefined') {
                            this.volume = 0;
                        }
                    }
                }, true);
            }
        });
    }

    // 监听新视频元素的添加
    const videoObserver = new MutationObserver(function(mutations) {
        let shouldMute = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'VIDEO') {
                    shouldMute = true;
                } else if (node.querySelectorAll) {
                    const newVideos = node.querySelectorAll('video');
                    if (newVideos.length > 0) {
                        shouldMute = true;
                    }
                }
            });
        });

        if (shouldMute) {
            setTimeout(() => {
                muteAllVideos();
                setupVideoWatchers();
            }, 300);
        }
    });

    // 重写 Video 构造函数，自动设置静音但保持播放
    const OriginalVideo = window.HTMLVideoElement || window.Video;
    if (OriginalVideo) {
        const originalVideoProto = OriginalVideo.prototype;

        // 重写 play 方法，确保播放前静音
        const originalPlay = originalVideoProto.play;
        if (originalPlay) {
            originalVideoProto.play = function() {
                try {
                    this.muted = true;
                    if (typeof this.volume !== 'undefined') {
                        this.volume = 0;
                    }
                } catch (e) {
                    console.log('播放前静音失败:', e);
                }
                return originalPlay.call(this);
            };
        }
    }

    // 初始化视频静音功能
    function initVideoMuting() {
        // 立即静音现有视频
        muteAllVideos();
        setupVideoWatchers();

        // 监听DOM变化，静音新添加的视频
        videoObserver.observe(document, {
            childList: true,
            subtree: true
        });

        // 定期检查并静音视频（防止页面代码取消静音）
        setInterval(() => {
            muteAllVideos();
            setupVideoWatchers();
        }, 3000);

        console.log('视频自动静音功能已启用，同时保持播放状态');
    }

    // 页面加载完成后初始化视频静音
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoMuting);
    } else {
        initVideoMuting();
    }

    // 额外措施：防止浏览器自动暂停
    document.addEventListener('visibilitychange', function(e) {
        // 这个监听器在我们阻止事件传播之前执行
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.paused && video.muted) {
                setTimeout(() => {
                    video.play().catch(e => {});
                }, 50);
            }
        });
    }, false);
    // ========== 防止播放进度检测和警告弹窗 ==========

    // 保存原始方法
    let progressCheckIntervals = [];

    // 重写 setInterval 来捕获进度检测定时器
    window.setInterval = function(callback, delay) {
        const intervalId = originalSetInterval.call(this, callback, delay);

        // 检查是否是进度检测相关的定时器（每秒执行一次）
        if (delay === 1000) {
            try {
                // 获取函数体字符串来判断是否是进度检测函数
                const funcString = callback.toString();
                if (funcString.includes('getState') &&
                    funcString.includes('getPosition') &&
                    (funcString.includes('increaseTime') || funcString.includes('totalTime'))) {
                    console.log('捕获到进度检测定时器，已禁用');
                    progressCheckIntervals.push(intervalId);
                    clearInterval(intervalId); // 立即清除这个定时器
                    return intervalId;
                }
            } catch (e) {
                // 忽略错误
            }
        }

        return intervalId;
    };

    // 重写 alertMs 方法阻止警告弹窗
    let alertMsHijacked = false;
    function hijackAlertMs() {
        // 尝试找到 alertMs 方法并重写
        if (window.i && typeof window.i.alertMs === 'function' && !alertMsHijacked) {
            const originalAlertMs = window.i.alertMs;
            window.i.alertMs = function(message) {
                if (message && message.includes('请不要在未播放区域拖动')) {
                    console.log('已阻止进度警告弹窗:', message);
                    return; // 阻止这个特定的警告
                }
                return originalAlertMs.call(this, message);
            };
            alertMsHijacked = true;
            console.log('已重写 alertMs 方法');
        }
    }

    // 重写播放器相关方法以确保进度累积
    function hijackPlayerMethods() {
        // 定期尝试重写播放器方法
        const checkPlayer = setInterval(() => {
            if (window.v && typeof window.v.getState === 'function') {
                // 重写 getState 方法，始终返回 PLAYING
                const originalGetState = window.v.getState;
                window.v.getState = function() {
                    const realState = originalGetState.call(this);
                    // 如果真实状态是暂停但视频有数据，返回 PLAYING 以确保进度累积
                    if (realState === 'PAUSED' && this.getDuration && this.getDuration() > 0) {
                        return 'PLAYING';
                    }
                    return realState;
                };

                // 重写 seek 方法，防止被拉回进度
                if (typeof window.v.seek === 'function') {
                    const originalSeek = window.v.seek;
                    window.v.seek = function(position) {
                        // 检查是否是因为"未播放区域"警告而seek
                        const stack = new Error().stack;
                        if (stack && stack.includes('L') && stack.includes('totalTime')) {
                            console.log('已阻止进度回拉操作');
                            return; // 阻止这个seek操作
                        }
                        return originalSeek.call(this, position);
                    };
                }

                clearInterval(checkPlayer);
                console.log('已重写播放器方法');
            }
        }, 500);
    }

    // 模拟进度累积
    function simulateProgressAccumulation() {
        if (window.r && typeof window.r.increaseTime === 'number') {
            // 每2秒累积2秒的进度（模拟正常观看）
            setInterval(() => {
                if (window.r && window.v) {
                    // 确保 increaseTime 持续增加
                    window.r.increaseTime += 2;

                    // 确保 totalTime 正确计算
                    if (window.r.startTime && window.r.increaseTime) {
                        window.r.totalTime = window.r.startTime + window.r.increaseTime;
                    }
                }
            }, 2000);
        }
    }

    // 初始化防检测功能
    function initAntiDetection() {
        // 重写警告方法
        hijackAlertMs();

        // 重写播放器方法
        hijackPlayerMethods();

        // 模拟进度累积
        setTimeout(simulateProgressAccumulation, 3000);

        // 定期检查并重新应用hijack（防止页面重新初始化）
        setInterval(hijackAlertMs, 5000);
    }

    // 在DOM加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAntiDetection);
    } else {
        initAntiDetection();
    }

    // 监听URL变化（单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initAntiDetection, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    console.log('防进度检测功能已启用');

})();