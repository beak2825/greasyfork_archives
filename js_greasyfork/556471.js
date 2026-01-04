// ==UserScript==
// @name         (missav专用)阻止视频播放器在切换标签页时暂停
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  阻止网站使用多种方法检测页面可见性并暂停视频播放
// @author       You
// @match        *://missav.ws/*
// @match        *://*.missav.ws/*
// @match        *://missav.ai/*
// @match        *://*.missav.ai/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556471/%28missav%E4%B8%93%E7%94%A8%29%E9%98%BB%E6%AD%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%9C%A8%E5%88%87%E6%8D%A2%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%97%B6%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/556471/%28missav%E4%B8%93%E7%94%A8%29%E9%98%BB%E6%AD%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%9C%A8%E5%88%87%E6%8D%A2%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%97%B6%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[阻止暂停脚本] 开始初始化...');

    // ========== 1. Page Visibility API 拦截 ==========
    Object.defineProperty(Document.prototype, 'hidden', {
        get: function() {
            return false;
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(Document.prototype, 'visibilityState', {
        get: function() {
            return 'visible';
        },
        configurable: true,
        enumerable: true
    });

    // ========== 2. document.hasFocus() 拦截 ==========
    const originalHasFocus = Document.prototype.hasFocus;
    Document.prototype.hasFocus = function() {
        console.log('[阻止暂停脚本] document.hasFocus() 被调用，返回 true');
        return true;
    };

    // ========== 3. window.blur/focus 事件拦截 ==========
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // 阻止 visibilitychange、blur、focus 事件监听
        if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
            // 只拦截 window 和 document 上的这些事件
            if (this === window || this === document || this instanceof Window || this instanceof Document) {
                console.log('[阻止暂停脚本] 已阻止', type, '事件监听器');
                return;
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
            if (this === window || this === document || this instanceof Window || this instanceof Document) {
                console.log('[阻止暂停脚本] 已阻止移除', type, '事件监听器');
                return;
            }
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    // ========== 4. 阻止触发 visibilitychange 事件 ==========
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function(event) {
        if (event && (event.type === 'visibilitychange' || event.type === 'blur')) {
            if (this === window || this === document || this instanceof Window || this instanceof Document) {
                console.log('[阻止暂停脚本] 已阻止触发', event.type, '事件');
                return false;
            }
        }
        return originalDispatchEvent.call(this, event);
    };

    // ========== 5. 监听视频暂停事件并自动恢复 ==========
    let userPausedVideos = new WeakSet(); // 记录用户手动暂停的视频
    let lastUserClickTime = 0;
    let lastPauseTime = 0;

    // 监听用户点击，用于区分用户操作和自动暂停
    document.addEventListener('click', function(e) {
        lastUserClickTime = Date.now();
        const target = e.target;
        // 检查是否点击了暂停/播放相关的控件
        if (target.classList && (
            target.classList.contains('plyr__control') ||
            target.closest('.plyr__control') ||
            target.closest('[data-plyr]') ||
            target.tagName === 'VIDEO' ||
            target.tagName === 'BUTTON'
        )) {
            // 延迟检查，看视频是否真的被暂停了
            setTimeout(() => {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    if (video.paused) {
                        userPausedVideos.add(video);
                        console.log('[阻止暂停脚本] 检测到用户手动暂停');
                    } else {
                        // 如果开始播放，清除暂停标记
                        userPausedVideos.delete(video);
                    }
                });
            }, 300);
        }
    }, true);

    // 监听视频暂停事件，如果不是用户暂停的，就自动恢复
    function setupVideoAutoResume(video) {
        if (video._autoResumeSetup) return;
        video._autoResumeSetup = true;

        video.addEventListener('pause', function(e) {
            lastPauseTime = Date.now();
            const timeSinceClick = Date.now() - lastUserClickTime;
            // 如果距离用户点击时间很短（< 800ms），可能是用户手动暂停
            const isUserPause = timeSinceClick < 800 || userPausedVideos.has(video);

            if (!isUserPause) {
                console.log('[阻止暂停脚本] 检测到自动暂停，正在恢复播放... (距离用户操作:', timeSinceClick, 'ms)');
                // 延迟一点再恢复，避免与播放器库冲突
                setTimeout(() => {
                    if (video.paused && !video.ended && video.readyState >= 2) {
                        video.play().catch(err => {
                            console.log('[阻止暂停脚本] 恢复播放失败:', err);
                        });
                    }
                }, 150);
            }
        }, true);

        // 监听播放事件，清除用户暂停标记
        video.addEventListener('play', function() {
            userPausedVideos.delete(video);
        }, true);
    }

    // 拦截 pause() 方法
    const originalPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function() {
        const timeSinceClick = Date.now() - lastUserClickTime;
        const isUserPause = timeSinceClick < 500;

        // 如果不是用户操作，检查调用栈
        if (!isUserPause) {
            try {
                const stack = new Error().stack || '';
                const isAutoPause = stack.includes('visibilitychange') ||
                                  stack.includes('blur') ||
                                  stack.includes('hasFocus') ||
                                  stack.includes('hidden') ||
                                  stack.includes('Plyr') && stack.includes('pause');

                if (isAutoPause) {
                    console.log('[阻止暂停脚本] 拦截了 pause() 调用');
                    return Promise.resolve();
                }
            } catch(e) {
                // 忽略错误
            }
        }

        return originalPause.apply(this, arguments);
    };

    // 在页面加载后设置所有视频元素
    function interceptVideoElements() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            setupVideoAutoResume(video);

            // 如果视频已经被暂停，检查是否需要恢复
            if (video.paused && video.readyState >= 2 && !video.ended) {
                const timeSinceClick = Date.now() - lastUserClickTime;
                if (timeSinceClick > 1000 && !userPausedVideos.has(video)) {
                    setTimeout(() => {
                        if (video.paused && !video.ended) {
                            video.play().catch(() => {});
                        }
                    }, 200);
                }
            }
        });
    }

    // 定期检查视频状态并恢复
    setInterval(function() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            setupVideoAutoResume(video);

            // 如果视频被暂停但不是用户暂停的，尝试恢复
            if (video.paused && !video.ended && video.readyState >= 2) {
                const timeSinceClick = Date.now() - lastUserClickTime;
                if (timeSinceClick > 2000 && !userPausedVideos.has(video)) {
                    video.play().catch(() => {});
                }
            }
        });
    }, 500);

    // ========== 6. 在 document 对象上直接设置 ==========
    function setupDocumentProperties() {
        try {
            Object.defineProperty(document, 'hidden', {
                get: function() { return false; },
                configurable: true
            });
            Object.defineProperty(document, 'visibilityState', {
                get: function() { return 'visible'; },
                configurable: true
            });
        } catch(e) {
            console.log('[阻止暂停脚本] document 对象设置失败:', e);
        }
    }

    // ========== 7. 监听用户手动暂停/播放（已在第5部分处理） ==========
    function setupUserInteractionTracking() {
        // 这个功能已经在 interceptVideoElements 中实现了
    }

    // ========== 8. 初始化 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[阻止暂停脚本] DOMContentLoaded - 开始设置');
            setupDocumentProperties();
            interceptVideoElements();
            setupUserInteractionTracking();

            // 使用 MutationObserver 监听新添加的视频元素
            const observer = new MutationObserver(function(mutations) {
                interceptVideoElements();
            });
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    } else {
        setupDocumentProperties();
        interceptVideoElements();
        setupUserInteractionTracking();
    }

    // ========== 9. 定期检查和重新设置 ==========
    setInterval(function() {
        try {
            // 重新设置 document 属性
            setupDocumentProperties();

            // 重新拦截视频元素
            interceptVideoElements();

            // 确保 hasFocus 始终返回 true
            if (Document.prototype.hasFocus !== originalHasFocus) {
                Document.prototype.hasFocus = function() { return true; };
            }
        } catch(e) {
            // 忽略错误
        }
    }, 500);

    console.log('[阻止暂停脚本] 初始化完成 - 视频将不会在切换标签页时暂停');

})();

