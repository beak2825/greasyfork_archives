// ==UserScript==
// @name         自动开启哔哩哔哩字幕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动开启哔哩哔哩视频的中文字幕
// @author       Brian/小叶lr
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/552981/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/552981/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义常量选择器
    const SELECTORS = {
        VIDEO_WRAP: '.bpx-player-video-wrap',
        VIDEO: 'video',
        // 字幕按钮样式
        SUBTITLE_BUTTON: '.bpx-player-ctrl-subtitle-result',
        SUBTITLE_TOGGLE: '.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle',
        // 中文字幕未开启样式
        CHINESE_LANGUAGE_OPTION: '.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]',
        // 中文字幕已开启样式
        ACTIVE_CHINESE_LANGUAGE: 'bpx-player-ctrl-subtitle-language-item.bpx-state-active[data-lan="ai-zh"]',
        MAX_RETRIES: 5,
    }

    // 定义常量时间间隔
    const TIMING = {
        // 视频加载完后 两秒才开始操作
        INITIAL_SUBTITLE_DELAY: 2000,
        // 重试间隔
        SUBTITLE_CHECK_INTERVAL: 500,
        // 延迟点击字幕时间
        LANGUAGE_CLICK_DELAY: 100,
    }

    /**
     * 主入口函数
     */
    function initSubtitleAutoOpen() {
        console.log('自动字幕插件已开启-' + getCurrentTime())

        // 初始检查视频元素
        checkAndInitVideoListener();
        
        // 监听页面变化，处理视频切换场景
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                checkAndInitVideoListener();
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 检查并初始化视频监听器
     */
    function checkAndInitVideoListener() {
        const videoWrapElement = document.querySelector(SELECTORS.VIDEO_WRAP);
        if (!videoWrapElement) return;

        const videoElement = videoWrapElement.querySelector(SELECTORS.VIDEO);
        if (!videoElement) return;

        console.log('找到了视频元素');
        
        // 移除已存在的事件监听，避免重复绑定
        videoElement.removeEventListener('loadeddata', onVideoLoaded);
        videoElement.addEventListener('loadeddata', onVideoLoaded);
    }

    /**
     * 视频加载完成处理函数
     */
    function onVideoLoaded() {
        setTimeout(openZm, TIMING.INITIAL_SUBTITLE_DELAY);
    }

    /**
     * 尝试开启字幕
     */
    function openZm() {
        let retryCount = 0;

        const intervalId = setInterval(() => {
            // 检查重试次数是否超过限制
            if (retryCount >= SELECTORS.MAX_RETRIES) {
                console.log('已达到最大重试次数，停止尝试');
                clearInterval(intervalId);
                return;
            }
            retryCount++;

            const subtitleBtn = getSubtitleButton();
            if (!subtitleBtn) {
                console.log('未找到字幕按钮');
                return;
            }

            const subtitleToggle = document.querySelector(SELECTORS.SUBTITLE_TOGGLE);
            if (!subtitleToggle) return;

            console.log('已找到字幕按钮');
            clearInterval(intervalId);

            setTimeout(clickChineseLanguageOption, TIMING.LANGUAGE_CLICK_DELAY);
        }, TIMING.SUBTITLE_CHECK_INTERVAL);
    }

    /**
     * 获取字幕按钮元素
     */
    function getSubtitleButton() {
        return document.querySelector(SELECTORS.SUBTITLE_BUTTON);
    }

    /**
     * 检查字幕是否已经打开
     */
    function isSubtitleOn() {
        const subtitleBtn = getSubtitleButton();
        if (!subtitleBtn) {
            console.log('字幕按钮元素 not found.');
            return false;
        }

        // 检查是否有激活的中文字幕选项
        const activeLanguageItem = document.querySelector(SELECTORS.ACTIVE_CHINESE_LANGUAGE);
        if (activeLanguageItem) {
            console.log('检测到字幕已打开');
            return true;
        }

        const chineseOption = document.querySelector(SELECTORS.CHINESE_LANGUAGE_OPTION);
        if (chineseOption) {
            console.log('字幕未打开');
            return false;
        }

        return false;
    }

    /**
     * 点击中文字幕选项
     */
    function clickChineseLanguageOption() {
        if (!isSubtitleOn()) {
            const chineseOption = document.querySelector(SELECTORS.CHINESE_LANGUAGE_OPTION);
            if (chineseOption) {
                chineseOption.click();
                console.log('已开启字幕');
            }
        }
    }

    /**
     * 获取当前时间戳和格式化时间
     */
    function getCurrentTime() {
        const stamp = new Date().getTime() + 8 * 60 * 60 * 1000;
        const beijingTime = new Date(stamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 19);

        return beijingTime + '_' + stamp;
    }

    // 初始化插件
    initSubtitleAutoOpen();
})();