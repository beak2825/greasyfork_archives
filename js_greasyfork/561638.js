// ==UserScript==
// @name         B站自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  智能自动点赞：支持开关控制、动态点赞时机、防止重复点赞
// @author       ycl
// @match        https://www.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561638/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/561638/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置 ==========
    const CONFIG = {
        checkInterval: 1000,
        initDelay: 2000,
        shortVideoThreshold: 60,
        shortVideoProgress: 2/3,
        longVideoTime: 60,
    };

    // ========== 状态管理 ==========
    let state = {
        enabled: true,
        currentVideoId: null,
        hasLiked: false,
        manuallyUnliked: false,
        likeChecked: false,
        checkTimer: null,
    };

    // ========== 工具函数 ==========

    // 获取当前视频ID（从URL或页面元素）
    function getVideoId() {
        const match = window.location.pathname.match(/\/video\/(BV[\w]+|av\d+)/);
        return match ? match[1] : null;
    }

    // 获取点赞按钮
    function getLikeButton() {
        return document.querySelector('#arc_toolbar_report .video-like') ||
            document.querySelector('.video-toolbar-left .video-like');
    }

    // 获取视频元素
    function getVideoElement() {
        return document.querySelector('#bilibili-player video') ||
            document.querySelector('.bpx-player-video-wrap video');
    }

    // 检查是否已点赞
    function isLiked() {
        const likeBtn = getLikeButton();
        return likeBtn && likeBtn.classList.contains('on');
    }

    // 获取视频总时长
    function getVideoDuration() {
        const video = getVideoElement();
        return video ? video.duration : 0;
    }

    // 获取当前播放时间
    function getCurrentTime() {
        const video = getVideoElement();
        return video ? video.currentTime : 0;
    }

    // ========== 核心逻辑 ==========

    // 检查是否应该点赞
    function shouldLike() {
        if (!state.enabled) return false;
        if (!state.likeChecked) return false; // 必须先完成初始状态检查
        if (state.hasLiked) return false;
        if (state.manuallyUnliked) return false;
        if (isLiked()) return false;

        const duration = getVideoDuration();
        const currentTime = getCurrentTime();

        if (duration <= 0 || currentTime <= 0) return false;

        // 短视频（小于1分钟）：播放进度达到2/3
        if (duration < CONFIG.shortVideoThreshold) {
            return currentTime >= duration * CONFIG.shortVideoProgress;
        }

        // 长视频（大于等于1分钟）：播放超过1分钟
        return currentTime >= CONFIG.longVideoTime;
    }

    // 执行点赞
    function doLike() {
        const likeBtn = getLikeButton();
        if (likeBtn && !isLiked()) {
            likeBtn.click();
            state.hasLiked = true;
            console.log('[B站自动点赞] 已自动点赞');
            updateUI();
        }
    }

    // 定时检查
    function checkAndLike() {
        if (shouldLike()) {
            doLike();
        }
    }

    // 重置视频状态
    function resetVideoState() {
        const newVideoId = getVideoId();

        if (newVideoId !== state.currentVideoId) {
            console.log('[B站自动点赞] 检测到视频切换:', newVideoId);
            state.currentVideoId = newVideoId;
            state.hasLiked = false;
            state.manuallyUnliked = false;
            state.likeChecked = false;
            updateUI();
        }

        // 等待视频数据加载完成后再检查点赞状态
        // 条件：视频已开始播放（currentTime > 0）说明数据已加载
        if (!state.likeChecked) {
            const video = getVideoElement();
            const likeBtn = getLikeButton();
            if (video && video.currentTime > 0 && likeBtn) {
                state.likeChecked = true;
                if (isLiked()) {
                    state.hasLiked = true;
                    console.log('[B站自动点赞] 检测到页面已点赞');
                }
            }
        }
    }

    // ========== 点赞状态监听 ==========

    // 监听点赞按钮变化（检测用户手动取消点赞）
    function setupLikeObserver() {
        const likeBtn = getLikeButton();
        if (!likeBtn) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const wasLiked = state.hasLiked;
                    const nowLiked = isLiked();

                    // 如果之前自动点赞过，现在取消了，标记为手动取消
                    if (wasLiked && !nowLiked) {
                        state.manuallyUnliked = true;
                        console.log('[B站自动点赞] 检测到手动取消点赞，不再自动点赞此视频');
                        updateUI();
                    }
                }
            }
        });

        observer.observe(likeBtn, { attributes: true });
        return observer;
    }

    // ========== UI控制面板 ==========

    let panelState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    };

    function createControlPanel() {
        // 检查是否已存在
        if (document.getElementById('auto-like-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'auto-like-panel';
        panel.innerHTML = `
            <style>
                #auto-like-panel {
                    position: fixed;
                    top: 200px;
                    z-index: 2147483647;
                    background: #00a1d6;
                    border-radius: 20px;
                    width: 40px;
                    height: 40px;
                    box-shadow: 0 2px 8px rgba(0, 161, 214, 0.4);
                    cursor: grab;
                    user-select: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease, box-shadow 0.3s ease, left 0.3s ease;
                }
                #auto-like-panel:hover {
                    box-shadow: 0 4px 12px rgba(0, 161, 214, 0.5);
                }
                #auto-like-panel.dragging {
                    cursor: grabbing;
                    box-shadow: 0 6px 16px rgba(0, 161, 214, 0.6);
                    transition: none;
                }
                #auto-like-panel.disabled {
                    background: #61666d;
                    box-shadow: 0 2px 8px rgba(97, 102, 109, 0.3);
                }
                #auto-like-panel.disabled:hover {
                    box-shadow: 0 4px 12px rgba(97, 102, 109, 0.4);
                }
                #auto-like-panel .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                }
                #auto-like-panel .close-btn {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 18px;
                    height: 18px;
                    background: rgba(0,0,0,0.6);
                    border-radius: 50%;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 12px;
                    color: #fff;
                    line-height: 1;
                }
                #auto-like-panel:hover .close-btn {
                    display: flex;
                }
                #auto-like-panel .close-btn:hover {
                    background: rgba(0,0,0,0.8);
                }
            </style>
            <span class="icon"><svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z" fill="currentColor"></path></svg></span>
            <span class="close-btn">✕</span>
        `;

        // 读取保存的位置
        loadPanelPosition(panel);

        // 设置事件监听
        setupDragEvents(panel);

        // 关闭按钮点击事件
        const closeBtn = panel.querySelector('.close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡，避免触发拖动
            panel.style.display = 'none';
            console.log('[B站自动点赞] 已隐藏，刷新页面后重新显示');
        });

        document.body.appendChild(panel);
        updateUI();
    }

    function loadPanelPosition(panel) {
        if (typeof GM_getValue === 'function') {
            panelState.currentX = GM_getValue('panelX', window.innerWidth - 60);
            panelState.currentY = GM_getValue('panelY', 200);
        } else {
            panelState.currentX = window.innerWidth - 60;
            panelState.currentY = 200;
        }

        panel.style.left = panelState.currentX + 'px';
        panel.style.top = panelState.currentY + 'px';
    }

    function savePanelPosition() {
        if (typeof GM_setValue === 'function') {
            GM_setValue('panelX', panelState.currentX);
            GM_setValue('panelY', panelState.currentY);
        }
    }

    function setupDragEvents(panel) {
        let hasMoved = false;
        let startTime = 0;

        panel.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            panelState.isDragging = true;
            hasMoved = false;
            startTime = Date.now();

            const rect = panel.getBoundingClientRect();
            panelState.startX = e.clientX;
            panelState.startY = e.clientY;
            panelState.currentX = rect.left;
            panelState.currentY = rect.top;

            panel.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!panelState.isDragging) return;

            const deltaX = e.clientX - panelState.startX;
            const deltaY = e.clientY - panelState.startY;

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                hasMoved = true;
            }

            let newX = panelState.currentX + deltaX;
            let newY = panelState.currentY + deltaY;

            // 限制范围（避开滚动条）
            const maxX = document.documentElement.clientWidth - panel.offsetWidth;
            const maxY = document.documentElement.clientHeight - panel.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', (e) => {
            if (!panelState.isDragging) return;

            panelState.isDragging = false;
            panel.classList.remove('dragging');

            const rect = panel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const screenCenter = window.innerWidth / 2;

            // 自动贴边（右侧留出滚动条位置）
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (centerX < screenCenter) {
                panelState.currentX = 0;
            } else {
                panelState.currentX = document.documentElement.clientWidth - panel.offsetWidth;
            }
            panelState.currentY = rect.top;

            panel.style.left = panelState.currentX + 'px';
            savePanelPosition();

            // 如果没有移动且点击时间短，视为点击切换开关
            const clickDuration = Date.now() - startTime;
            if (!hasMoved && clickDuration < 200) {
                toggleEnabled();
            }
        });

        panel.addEventListener('selectstart', (e) => e.preventDefault());
    }

    function updateUI() {
        const panel = document.getElementById('auto-like-panel');
        if (!panel) return;

        if (!state.enabled) {
            panel.classList.add('disabled');
        } else {
            panel.classList.remove('disabled');
        }
    }

    function toggleEnabled() {
        state.enabled = !state.enabled;

        // 保存状态
        if (typeof GM_setValue === 'function') {
            GM_setValue('autoLikeEnabled', state.enabled);
        }

        console.log('[B站自动点赞]', state.enabled ? '已开启' : '已关闭');
        updateUI();
    }

    // ========== URL变化监听（SPA路由） ==========

    function setupUrlObserver() {
        let lastUrl = location.href;

        // 使用 MutationObserver 监听 URL 变化
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                resetVideoState();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 监听 popstate 事件（浏览器前进/后退）
        window.addEventListener('popstate', resetVideoState);

        // 监听 pushState 和 replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            resetVideoState();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            resetVideoState();
        };
    }

    // ========== 初始化 ==========

    function init() {
        console.log('[B站自动点赞] 初始化...');

        // 读取保存的开关状态
        if (typeof GM_getValue === 'function') {
            state.enabled = GM_getValue('autoLikeEnabled', true);
        }

        // 设置当前视频ID
        state.currentVideoId = getVideoId();

        // 创建控制面板
        createControlPanel();

        // 设置点赞状态监听
        setupLikeObserver();

        setupUrlObserver();
        state.checkTimer = setInterval(() => {
            resetVideoState();
            checkAndLike();
        }, CONFIG.checkInterval);

        console.log('[B站自动点赞] 初始化完成，当前状态:', state.enabled ? '开启' : '关闭');
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, CONFIG.initDelay);
        });
    } else {
        setTimeout(init, CONFIG.initDelay);
    }
})();
