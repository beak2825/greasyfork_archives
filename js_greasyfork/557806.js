// ==UserScript==
 // @name         B站16倍速播放器（吸附悬浮版）
 // @namespace    http://tampermonkey.net/
 // @version      0.0.1
 // @description  1-16倍速调节，四角吸附+悬浮显示，自动记忆倍速与位置，适配B站全视频场景
 // @author       YTY11
 // @match        *://bilibili.com/video/*
 // @match        *://www.bilibili.com/video/*
 // @match        *://m.bilibili.com/video/*
 // @match        *://bilibili.com/bangumi/play/*
 // @match        *://www.bilibili.com/bangumi/play/*
 // @match        *://m.bilibili.com/bangumi/play/*
 // @match        *://bilibili.com/watchlater/*
 // @match        *://www.bilibili.com/watchlater/*
 // @match        *://m.bilibili.com/watchlater/*
 // @match        *://bilibili.com/cheese/play/*
 // @match        *://www.bilibili.com/cheese/play/*
 // @match        *://m.bilibili.com/cheese/play/*
 // @match        *://bilibili.com/v/*
 // @match        *://www.bilibili.com/v/*
 // @match        *://m.bilibili.com/v/*
 // @include      *://*.bilibili.com/*video*
 // @include      *://*.bilibili.com/*play*
 // @grant        none
 // @run-at       document-end
 // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557806/B%E7%AB%9916%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E5%90%B8%E9%99%84%E6%82%AC%E6%B5%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557806/B%E7%AB%9916%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E5%90%B8%E9%99%84%E6%82%AC%E6%B5%AE%E7%89%88%EF%BC%89.meta.js
 // ==/UserScript==

(function() {
    'use strict';

    // 核心配置
    const MIN_SPEED = 1;
    const MAX_SPEED = 16;
    const STEP = 0.1;
    const STORAGE_KEY = 'bilibili_custom_playback_rate';
    const DEFAULT_CORNER = 'bottom-right'; // 默认吸附角落：top-left/top-right/bottom-left/bottom-right

    // 1. 创建样式（核心：隐藏+悬浮显示+四角吸附）
    function createStyles() {
        if (document.getElementById('custom-speed-style')) return;
        const style = document.createElement('style');
        style.id = 'custom-speed-style';
        style.textContent = `
            /* 主容器：默认隐藏，悬浮显示 */
            .custom-speed-container {
                position: fixed;
                z-index: 999999 !important;
                transition: all 0.3s ease;
                overflow: hidden;
                width: 30px; /* 默认只显示小图标宽度 */
                height: 30px;
                border-radius: 8px;
            }
            /* 四角吸附定位 */
            .custom-speed-container.top-left {
                top: 10px;
                left: 10px;
            }
            .custom-speed-container.top-right {
                top: 10px;
                right: 10px;
            }
            .custom-speed-container.bottom-left {
                bottom: 10px;
                left: 10px;
            }
            .custom-speed-container.bottom-right {
                bottom: 10px;
                right: 10px;
            }
            /* 悬浮时展开 */
            .custom-speed-container:hover {
                width: auto; /* 展开宽度 */
                height: auto;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff7a9c;
                box-shadow: 0 0 15px rgba(255,122,156,0.5);
            }
            /* 小图标（默认显示） */
            .speed-icon {
                position: absolute;
                top: 0;
                left: 0;
                width: 30px;
                height: 30px;
                background: #ff7a9c;
                color: white;
                font-size: 16px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                cursor: pointer;
            }
            /* 控制面板（默认隐藏，悬浮显示） */
            .custom-speed-control {
                display: none;
                padding: 12px 18px;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 16px;
            }
            /* 悬浮时显示控制面板 */
            .custom-speed-container:hover .custom-speed-control {
                display: flex;
            }
            /* 按钮样式 */
            .speed-btn {
                width: 38px;
                height: 38px;
                border: none;
                border-radius: 6px;
                background: #ff7a9c;
                color: white;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            .speed-btn:hover {
                background: #ff5277;
                transform: scale(1.1);
            }
            .speed-display {
                min-width: 50px;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                color: #ffd700;
            }
            .speed-reset {
                background: #ff4444;
            }
            .speed-reset:hover {
                background: #ff0000;
            }
            /* 切换角落按钮（隐藏在右侧，悬浮显示） */
            .switch-corner-btn {
                position: absolute;
                top: 50%;
                right: -35px;
                transform: translateY(-50%);
                width: 30px;
                height: 30px;
                border: none;
                border-radius: 6px;
                background: rgba(0,0,0,0.7);
                color: white;
                font-size: 14px;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
            }
            .custom-speed-container:hover .switch-corner-btn {
                display: flex;
            }
            .switch-corner-btn:hover {
                background: rgba(0,0,0,0.9);
            }
            /* 适配移动端 */
            @media (max-width: 768px) {
                .custom-speed-control {
                    padding: 8px 12px;
                    gap: 8px;
                }
                .speed-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                }
                .speed-display {
                    min-width: 40px;
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. 增强视频查找
    function getVideoElement() {
        const selectors = [
            'video',
            '.bpx-player-video-wrap video',
            '.player-video video',
            '.video-player video',
            '.bilibili-player video',
            '#bilibili-player video',
            '.cheese-player video',
            '[class*="video-container"] video',
            '[class*="player-container"] video'
        ];
        for (const selector of selectors) {
            const video = document.querySelector(selector);
            if (video) return video;
        }
        return null;
    }

    // 3. 存储/读取倍速和吸附位置
    function saveSpeed(speed) {
        try { localStorage.setItem(STORAGE_KEY, speed); } catch (e) {}
    }
    function getSavedSpeed() {
        try { return parseFloat(localStorage.getItem(STORAGE_KEY)) || 1.0; } catch (e) { return 1.0; }
    }
    function saveCorner(corner) {
        try { localStorage.setItem('bilibili_speed_corner', corner); } catch (e) {}
    }
    function getSavedCorner() {
        try { return localStorage.getItem('bilibili_speed_corner') || DEFAULT_CORNER; } catch (e) { return DEFAULT_CORNER; }
    }

    // 4. 设置倍速
    function setVideoSpeed(speed) {
        speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
        speed = parseFloat(speed.toFixed(1));
        const video = getVideoElement();
        if (video) {
            video.playbackRate = speed;
            saveSpeed(speed);
            updateSpeedDisplay(speed);
        }
        return speed;
    }

    // 5. 更新倍速显示
    function updateSpeedDisplay(speed) {
        const display = document.querySelector('.speed-display');
        if (display) display.textContent = `${speed}x`;
    }

    // 6. 切换吸附角落
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    function switchCorner(container) {
        const currentCorner = getSavedCorner();
        const currentIndex = corners.indexOf(currentCorner);
        const nextIndex = (currentIndex + 1) % corners.length;
        const nextCorner = corners[nextIndex];
        
        // 移除当前角落类，添加新角落类
        corners.forEach(corner => container.classList.remove(corner));
        container.classList.add(nextCorner);
        saveCorner(nextCorner);
    }

    // 7. 创建吸附式控制面板
    function createControlPanel() {
        if (document.querySelector('.custom-speed-container')) return;
        
        const container = document.createElement('div');
        container.className = `custom-speed-container ${getSavedCorner()}`;
        container.setAttribute('title', '鼠标悬浮展开倍速控制器 | 点击切换角落');

        // 小图标（默认显示）
        const speedIcon = document.createElement('div');
        speedIcon.className = 'speed-icon';
        speedIcon.textContent = 'x';
        speedIcon.title = '鼠标悬浮展开倍速控制器';

        // 切换角落按钮
        const switchBtn = document.createElement('button');
        switchBtn.className = 'switch-corner-btn';
        switchBtn.textContent = '⟳';
        switchBtn.title = '切换吸附角落';
        switchBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            switchCorner(container);
        });

        // 倍速控制面板（悬浮显示）
        const controlPanel = document.createElement('div');
        controlPanel.className = 'custom-speed-control';

        // 减速按钮
        const minusBtn = document.createElement('button');
        minusBtn.className = 'speed-btn';
        minusBtn.textContent = '-';
        minusBtn.title = '降低倍速（步长0.1）';
        minusBtn.addEventListener('click', () => {
            setVideoSpeed((getVideoElement()?.playbackRate || getSavedSpeed()) - STEP);
        });

        // 倍速显示
        const speedDisplay = document.createElement('div');
        speedDisplay.className = 'speed-display';
        speedDisplay.textContent = `${getSavedSpeed()}x`;

        // 加速按钮
        const plusBtn = document.createElement('button');
        plusBtn.className = 'speed-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '提高倍速（步长0.1）';
        plusBtn.addEventListener('click', () => {
            setVideoSpeed((getVideoElement()?.playbackRate || getSavedSpeed()) + STEP);
        });

        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.className = 'speed-btn speed-reset';
        resetBtn.textContent = '重置';
        resetBtn.title = '恢复1倍速';
        resetBtn.addEventListener('click', () => {
            setVideoSpeed(1.0);
        });

        // 组装结构
        controlPanel.append(minusBtn, speedDisplay, plusBtn, resetBtn);
        container.append(speedIcon, controlPanel, switchBtn);
        document.body.appendChild(container);

        // 点击小图标也能切换角落（备用方式）
        speedIcon.addEventListener('click', () => {
            switchCorner(container);
        });
    }

    // 8. 监听视频加载
    function watchVideo() {
        let video = getVideoElement();
        if (video) {
            setVideoSpeed(getSavedSpeed());
            return;
        }
        // 持续查找视频（15秒超时）
        let timer = setInterval(() => {
            video = getVideoElement();
            if (video) {
                setVideoSpeed(getSavedSpeed());
                clearInterval(timer);
            }
        }, 300);
        setTimeout(() => clearInterval(timer), 15000);
    }

    // 9. 初始化
    function init() {
        createStyles();
        createControlPanel();
        watchVideo();

        // 路由变化重新初始化
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(init, 500);
            }
        }, 300);
    }

    // 强制执行初始化（多重保险）
    init();
    window.addEventListener('load', init);
    document.addEventListener('DOMContentLoaded', init);
    setTimeout(init, 500);
})();