// ==UserScript==
// @name         视频音量默认50%
// @name:zh-CN   视频音量默认50%
// @name:en      Video Volume Default 50%
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动将所有视频音量设置为50%，不影响用户调节，每次打开视频都重置为50%
// @description:zh-CN 自动将所有视频音量设置为50%，不影响用户调节，每次打开视频都重置为50%
// @description:en Automatically set all video volume to 50%, doesn't affect user adjustments, resets to 50% on each video open
// @match        *://www.youtube.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.twitch.tv/*
// @match        *://store.steampowered.com/*
// @match        *://vimeo.com/*
// @match        *://www.dailymotion.com/*
// @match        *://player.vimeo.com/*
// @match        *://www.netflix.com/*
// @match        *://www.hulu.com/*
// @match        *://www.amazon.com/*
// @match        *://www.hbo.com/*
// @match        *://www.disney.com/*
// @match        *://www.crunchyroll.com/*
// @match        *://www.funimation.com/*
// @match        *://www.anime-planet.com/*
// @match        *://www.animefreak.tv/*
// @match        *://www.animeultima.tv/*
// @match        *://www.animekisa.tv/*
// @match        *://www.animeflix.io/*
// @match        *://www.animepahe.com/*
// @match        *://www.animeheaven.ru/*
// @match        *://www.animeout.xyz/*
// @match        *://www.animekisa.tv/*
// @match        *://www.animeultima.tv/*
// @match        *://www.animefreak.tv/*
// @match        *://www.anime-planet.com/*
// @match        *://www.crunchyroll.com/*
// @match        *://www.funimation.com/*
// @match        *://www.disney.com/*
// @match        *://www.hbo.com/*
// @match        *://www.amazon.com/*
// @match        *://www.hulu.com/*
// @match        *://www.netflix.com/*
// @match        *://player.vimeo.com/*
// @match        *://www.dailymotion.com/*
// @match        *://vimeo.com/*
// @match        *://store.steampowered.com/*
// @match        *://www.twitch.tv/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://www.youtube.com/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552476/%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E9%BB%98%E8%AE%A450%25.user.js
// @updateURL https://update.greasyfork.org/scripts/552476/%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E9%BB%98%E8%AE%A450%25.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 防止重复初始化
    if (window.__VIDEO_VOLUME_DEFAULT_INITIALIZED__) return;
    window.__VIDEO_VOLUME_DEFAULT_INITIALIZED__ = true;
    
    const TARGET_VOLUME = 0.5; // 50% 音量
    const processedVideos = new WeakSet(); // 记录已处理的视频
    
    // 设置视频音量的函数
    function setVideoVolume(video) {
        if (!video || processedVideos.has(video)) return;
        
        try {
            // 设置音量为50%
            video.volume = TARGET_VOLUME;
            
            // 标记为已处理
            processedVideos.add(video);
            
            console.log('视频音量已设置为50%');
        } catch (error) {
            console.warn('设置视频音量失败:', error);
        }
    }
    
    // 监听视频元素变化
    function observeVideoChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新添加的节点
                        if (node.tagName === 'VIDEO') {
                            setVideoVolume(node);
                        }
                        
                        // 检查新添加节点内的视频元素
                        const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                        videos.forEach(video => setVideoVolume(video));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 处理现有视频
    function processExistingVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => setVideoVolume(video));
    }
    
    // 监听视频加载事件
    function addVideoEventListeners() {
        document.addEventListener('load', (e) => {
            if (e.target.tagName === 'VIDEO') {
                setVideoVolume(e.target);
            }
        }, true);
        
        document.addEventListener('canplay', (e) => {
            if (e.target.tagName === 'VIDEO') {
                setVideoVolume(e.target);
            }
        }, true);
    }
    
    // 初始化
    function init() {
        // 处理现有视频
        processExistingVideos();
        
        // 监听视频变化
        observeVideoChanges();
        
        // 添加事件监听器
        addVideoEventListeners();
        
        // 定期检查新视频（备用方案）
        setInterval(() => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (!processedVideos.has(video)) {
                    setVideoVolume(video);
                }
            });
        }, 1000);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
