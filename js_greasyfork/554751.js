// ==UserScript==
// @name         雨课堂防暂停
// @name:en      YuKeTang Anti-Pause
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防止雨课堂视频切屏暂停，提升学习体验
// @description:en  Prevent YuKeTang video from pausing when switching tabs
// @author       YourName
// @license      MIT
// @match        https://*.yuketang.cn/*
// @match        https://*.xuetangx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/你的用户名/雨课堂防暂停
// @supportURL   https://github.com/你的用户名/雨课堂防暂停/issues
// @downloadURL https://update.greasyfork.org/scripts/554751/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/554751/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[雨课堂防暂停] 插件已加载');

    // ==================== 全局状态管理 ====================
    const state = {
        userPausedManually: false,  // 用户是否主动暂停
        lastUserActionTime: 0        // 最后一次用户操作时间
    };

    // 配置参数
    const config = {
        userActionTimeout: 300      // 用户操作有效期(毫秒)
    };

    // ==================== 工具函数 ====================

    /**
     * 查找视频元素
     */
    function findVideoElement() {
        return document.querySelector('video');
    }

    /**
     * 等待视频元素加载
     */
    function waitForVideo(callback, maxAttempts = 50) {
        let attempts = 0;
        const checkVideo = setInterval(() => {
            const video = findVideoElement();
            if (video) {
                clearInterval(checkVideo);
                callback(video);
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkVideo);
                console.log('[雨课堂防暂停] 未找到视频元素');
            }
        }, 200);
    }

    /**
     * 记录用户操作时间
     */
    function recordUserAction() {
        state.lastUserActionTime = Date.now();
    }

    /**
     * 判断是否在用户操作有效期内
     */
    function isWithinUserActionTimeout() {
        return (Date.now() - state.lastUserActionTime) < config.userActionTimeout;
    }

    /**
     * 安全地调用函数
     */
    function safeCall(fn, ...args) {
        try {
            return fn(...args);
        } catch (e) {
            console.error('[雨课堂防暂停] 错误:', e);
            return null;
        }
    }

    // ==================== 防止视频切屏暂停 ====================

    /**
     * 欺骗页面可见性API
     */
    function spoofVisibilityAPI() {
        // 拦截 document.hidden
        Object.defineProperty(document, 'hidden', {
            get: function() { return false; },
            configurable: true
        });

        // 拦截 document.visibilityState
        Object.defineProperty(document, 'visibilityState', {
            get: function() { return 'visible'; },
            configurable: true
        });

        // 拦截 document.hasFocus
        document.hasFocus = function() { return true; };

        console.log('[雨课堂防暂停] 页面可见性API已被欺骗');
    }

    /**
     * 拦截visibilitychange事件
     */
    function interceptVisibilityChange() {
        document.addEventListener('visibilitychange', function(e) {
            e.stopImmediatePropagation();
        }, true);

        window.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
        }, true);

        window.addEventListener('focus', function(e) {
            e.stopImmediatePropagation();
        }, true);

        console.log('[雨课堂防暂停] 可见性事件已拦截');
    }

    /**
     * 监听用户主动暂停操作
     */
    function monitorUserPauseActions(video) {
        // 监听空格键
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                recordUserAction();
                state.userPausedManually = !video.paused;
                console.log('[雨课堂防暂停] 用户按空格键，暂停状态:', state.userPausedManually);
            }
        }, true);

        // 监听播放/暂停按钮点击
        document.addEventListener('click', function(e) {
            const target = e.target;
            // 检查是否点击了播放控制相关的元素
            if (target.closest('.xt_video_player_common_btn') ||
                target.closest('.vjs-play-control') ||
                target.closest('[class*="play"]') ||
                target.closest('[class*="pause"]')) {
                recordUserAction();
                state.userPausedManually = !video.paused;
                console.log('[雨课堂防暂停] 用户点击播放按钮，暂停状态:', state.userPausedManually);
            }
        }, true);

        console.log('[雨课堂防暂停] 用户操作监听已启动');
    }

    /**
     * 自动恢复播放
     */
    function autoResumePlayback(video) {
        // 监听pause事件
        video.addEventListener('pause', function() {
            // 如果在用户操作有效期内，认为是用户主动暂停
            if (isWithinUserActionTimeout()) {
                console.log('[雨课堂防暂停] 检测到用户主动暂停');
                return;
            }

            // 如果用户之前标记了主动暂停，不恢复播放
            if (state.userPausedManually) {
                console.log('[雨课堂防暂停] 用户已主动暂停，不自动播放');
                return;
            }

            // 否则认为是系统自动暂停，尝试恢复播放
            console.log('[雨课堂防暂停] 检测到系统自动暂停，尝试恢复播放');
            setTimeout(() => {
                if (video.paused && !state.userPausedManually) {
                    safeCall(() => video.play());
                }
            }, 100);
        }, true);

        // 监听play事件，清除手动暂停标记
        video.addEventListener('play', function() {
            state.userPausedManually = false;
            console.log('[雨课堂防暂停] 视频开始播放，清除暂停标记');
        }, true);

        console.log('[雨课堂防暂停] 自动恢复播放功能已启动');
    }

    /**
     * 初始化防切屏暂停功能
     */
    function initAntiPauseFeature() {
        spoofVisibilityAPI();
        interceptVisibilityChange();

        waitForVideo((video) => {
            monitorUserPauseActions(video);
            autoResumePlayback(video);
            console.log('[雨课堂防暂停] 防切屏暂停功能已启用');
        });
    }

    // ==================== 主初始化 ====================

    function init() {
        console.log('[雨课堂防暂停] 开始初始化...');

        // 等待页面基本加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initAntiPauseFeature();
            });
        } else {
            initAntiPauseFeature();
        }

        console.log('[雨课堂防暂停] 初始化完成！');
    }

    // 启动插件
    init();

})();
