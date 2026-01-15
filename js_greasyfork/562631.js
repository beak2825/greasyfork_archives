// ==UserScript==
// @name         Twitter排行榜：TikTok版
// @namespace    loadingi.local
// @version      2.0
// @description  视频模态框播放器 - 支持TikTok风格上下滑动切换,无需跳转页面
// @author       Chris_C
// @match        https://twitter-ero-video-ranking.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      twitter-ero-video-ranking.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562631/Twitter%E6%8E%92%E8%A1%8C%E6%A6%9C%EF%BC%9ATikTok%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/562631/Twitter%E6%8E%92%E8%A1%8C%E6%A6%9C%EF%BC%9ATikTok%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 0. 核心修正: 立即注入 Referer 禁用策略
    // ========================================
    const meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    if (document.head) {
        document.head.appendChild(meta);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                document.head.appendChild(meta);
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

    // ========================================
    // 样式定义 - TikTok风格模态框
    // ========================================
    const styles = `
        /* 模态框容器 */
        .tiktok-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 100%);
            z-index: 2147483647;
            display: none;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .tiktok-modal-overlay.active {
            display: flex;
            flex-direction: column;
            animation: tiktokFadeIn 0.3s ease-out;
        }

        @keyframes tiktokFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 视频切换动画 - 上滑 (下一个) */
        @keyframes slideOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        /* 视频切换动画 - 下滑 (上一个) */
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes slideInDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .tiktok-video-player.slide-out-up {
            animation: slideOutUp 0.3s ease-out forwards;
        }
        .tiktok-video-player.slide-in-up {
            animation: slideInUp 0.3s ease-out forwards;
        }
        .tiktok-video-player.slide-out-down {
            animation: slideOutDown 0.3s ease-out forwards;
        }
        .tiktok-video-player.slide-in-down {
            animation: slideInDown 0.3s ease-out forwards;
        }

        /* 关闭按钮 */
        .tiktok-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 2147483648;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .tiktok-close-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.1);
        }

        .tiktok-close-btn:active {
            transform: scale(0.95);
        }

        .tiktok-close-btn svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        /* 视频播放器容器 */
        .tiktok-video-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            position: relative;
            touch-action: pan-y;
        }

        /* 视频元素 */
        .tiktok-video-player {
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        }

        /* 隐藏所有原生视频控件 */
        .tiktok-video-player::-webkit-media-controls {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-enclosure {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-panel {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-play-button {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-timeline {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-current-time-display {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-time-remaining-display {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-mute-button {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-volume-slider {
            display: none !important;
        }
        .tiktok-video-player::-webkit-media-controls-fullscreen-button {
            display: none !important;
        }
        .tiktok-video-player::-moz-range-track {
            display: none !important;
        }
        .tiktok-video-player::--moz-range-thumb {
            display: none !important;
        }

        /* 自定义进度条容器 */
        .tiktok-progress-container {
            position: absolute;
            bottom: 60px;
            left: 20px;
            right: 20px;
            height: 30px;
            z-index: 2147483648;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .tiktok-progress-bar {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
            transition: height 0.15s ease;
        }

        .tiktok-progress-bar:hover {
            height: 8px;
        }

        .tiktok-progress-filled {
            height: 100%;
            background: #fe2c55;
            border-radius: 2px;
            width: 0%;
            position: relative;
            transition: width 0.1s linear;
        }

        .tiktok-progress-filled::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.15s ease;
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
        }

        .tiktok-progress-bar:hover .tiktok-progress-filled::after {
            opacity: 1;
        }

        .tiktok-time-display {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.75rem;
            min-width: 80px;
            text-align: right;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
            .tiktok-progress-container {
                bottom: 50px;
                left: 15px;
                right: 15px;
            }
            .tiktok-time-display {
                font-size: 0.7rem;
                min-width: 70px;
            }
        }

        /* 视频信息面板 */
        .tiktok-video-info {
            position: absolute;
            bottom: 100px;
            left: 20px;
            right: 100px;
            color: white;
            z-index: 2147483648;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            max-width: calc(100% - 120px);
        }

        .tiktok-video-info .author {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tiktok-video-info .author::before {
            content: '@';
            opacity: 0.7;
        }

        .tiktok-video-info h3 {
            font-size: 1.1rem;
            font-weight: 400;
            line-height: 1.4;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .tiktok-video-info .hashtags {
            color: #00f2ea;
            font-size: 0.9rem;
        }

        .tiktok-video-info .stats {
            font-size: 0.85rem;
            opacity: 0.8;
            margin-top: 10px;
            display: flex;
            gap: 15px;
        }

        /* 侧边操作栏 */
        .tiktok-actions {
            position: absolute;
            right: 12px;
            bottom: 180px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            z-index: 2147483648;
        }

        .tiktok-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .tiktok-action-item:active {
            transform: scale(0.9);
        }

        .tiktok-action-icon {
            width: 52px;
            height: 52px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6px;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }

        .tiktok-action-icon:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .tiktok-action-icon.liked {
            background: #fe2c55;
            animation: likeAnimation 0.3s ease-out;
        }

        @keyframes likeAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }

        .tiktok-action-icon svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        .tiktok-action-text {
            color: white;
            font-size: 0.75rem;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        /* 导航指示器 */
        .tiktok-nav-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 2147483648;
        }

        .tiktok-nav-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transition: all 0.3s;
            cursor: pointer;
        }

        .tiktok-nav-dot.active {
            background: white;
            width: 18px;
            border-radius: 3px;
        }

        .tiktok-nav-dot:hover {
            background: rgba(255, 255, 255, 0.7);
        }

        /* 加载动画 */
        .tiktok-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483648;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .tiktok-loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top: 3px solid #fe2c55;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .tiktok-loading-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }

        /* 错误提示 */
        .tiktok-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            text-align: center;
            z-index: 2147483648;
            padding: 20px;
            max-width: 80%;
        }

        .tiktok-error svg {
            width: 64px;
            height: 64px;
            fill: #fe2c55;
            margin-bottom: 20px;
        }

        .tiktok-error h3 {
            font-size: 1.2rem;
            margin-bottom: 10px;
        }

        .tiktok-error p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 20px;
        }

        .tiktok-error-btn {
            background: #fe2c55;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        }

        .tiktok-error-btn:hover {
            background: #e8254d;
        }

        /* 响应式调整 - 移动端 */
        @media (max-width: 768px) {
            .tiktok-actions {
                right: 8px;
                bottom: 140px;
                gap: 18px;
            }

            .tiktok-action-icon {
                width: 44px;
                height: 44px;
            }

            .tiktok-action-icon svg {
                width: 24px;
                height: 24px;
            }

            .tiktok-action-text {
                font-size: 0.7rem;
            }

            .tiktok-video-info {
                bottom: 80px;
                left: 15px;
                right: 80px;
                max-width: calc(100% - 95px);
            }

            .tiktok-video-info h3 {
                font-size: 0.95rem;
            }

            .tiktok-video-info .author {
                font-size: 0.9rem;
            }

            .tiktok-close-btn {
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
            }

            .tiktok-close-btn svg {
                width: 20px;
                height: 20px;
            }

            .tiktok-nav-indicator {
                bottom: 20px;
            }
        }



        /* 视频列表指示器 */
        .tiktok-video-count {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            z-index: 2147483648;
            backdrop-filter: blur(10px);
        }

        /* 原链接按钮 */
        .tiktok-original-link {
            position: absolute;
            bottom: 30px;
            right: 20px;
            z-index: 2147483648;
        }

        .tiktok-original-link a {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 0.8rem;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }

        .tiktok-original-link a:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }

        .tiktok-original-link svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        @media (max-width: 768px) {
            .tiktok-original-link {
                bottom: 20px;
                right: 15px;
            }

            .tiktok-original-link a {
                padding: 6px 12px;
                font-size: 0.75rem;
            }
        }
    `;

    // ========================================
    // 主要功能类 - TikTokModalPlayer
    // ========================================
    class TikTokModalPlayer {
        constructor() {
            this.currentVideoIndex = 0;
            this.videoList = [];
            this.isLoading = false;
            this.isDragging = false;
            this.startY = 0;
            this.currentY = 0;
            this.videoElement = null;
            this.isLiked = false;

            // 预加载缓存系统
            this.preloadCache = new Map(); // { url: { blobUrl, timestamp } }
            this.videoUrlCache = new Map(); // { pageUrl: realVideoUrl }
            this.PRELOAD_BYTES = 1024 * 1024; // 1MB
            this.MAX_CACHE_SIZE = 10; // 最多缓存10个视频

            // 动画状态
            this.isTransitioning = false;

            this.init();
        }

        init() {
            // 强制全局禁用 Referer (解决403的关键)
            const meta = document.createElement('meta');
            meta.name = "referrer";
            meta.content = "no-referrer";
            document.head.appendChild(meta);

            // 注入样式
            this.injectStyles();

            // 创建模态框DOM
            this.createModalDOM();

            // 绑定事件
            this.bindEvents();

            // 收集视频列表
            this.collectVideoLinks();

            console.log('🎬 TikTok Modal Player 初始化完成 - 找到', this.videoList.length, '个视频');
        }

        injectStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        createModalDOM() {
            const modal = document.createElement('div');
            modal.className = 'tiktok-modal-overlay';
            modal.id = 'tiktok-modal';

            modal.innerHTML = `
                <div class="tiktok-video-count" id="tiktok-count">1 / 1</div>

                <button class="tiktok-close-btn" id="tiktok-close" aria-label="关闭">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>

                <div class="tiktok-video-container" id="tiktok-container">
                    <div class="tiktok-loading" id="tiktok-loading">
                        <div class="tiktok-loading-spinner"></div>
                        <div class="tiktok-loading-text">加载中...</div>
                    </div>

                    <div class="tiktok-error" id="tiktok-error">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <h3>视频加载失败</h3>
                        <p>无法加载视频,请尝试在原页面观看</p>
                        <button class="tiktok-error-btn" id="tiktok-retry">重试</button>
                    </div>

                    <video class="tiktok-video-player" id="tiktok-player" playsinline webkit-playsinline referrerpolicy="no-referrer"></video>

                    <div class="tiktok-progress-container" id="tiktok-progress-container">
                        <div class="tiktok-progress-bar" id="tiktok-progress-bar">
                            <div class="tiktok-progress-filled" id="tiktok-progress-filled"></div>
                        </div>
                        <div class="tiktok-time-display" id="tiktok-time-display">0:00 / 0:00</div>
                    </div>

                    <div class="tiktok-video-info" id="tiktok-info">
                        <div class="author" id="tiktok-author">anonymous</div>
                        <h3 id="tiktok-title">视频标题</h3>
                        <div class="hashtags" id="tiktok-hashtags"></div>
                        <div class="stats">
                            <span id="tiktok-likes">👍 0</span>
                            <span id="tiktok-views">👁️ 0</span>
                        </div>
                    </div>

                    <div class="tiktok-actions" id="tiktok-actions">
                        <div class="tiktok-action-item" data-action="like" title="点赞">
                            <div class="tiktok-action-icon" id="tiktok-like-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text" id="tiktok-like-count">0</span>
                        </div>

                        <div class="tiktok-action-item" data-action="comment" title="评论">
                            <div class="tiktok-action-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text" id="tiktok-comment-count">0</span>
                        </div>

                        <div class="tiktok-action-item" data-action="share" title="分享">
                            <div class="tiktok-action-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">分享</span>
                        </div>
                    </div>

                    <div class="tiktok-nav-indicator" id="tiktok-nav"></div>

                    <div class="tiktok-original-link">
                        <a href="#" id="tiktok-original-url" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                            </svg>
                            原链接
                        </a>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        }

        bindEvents() {
            // 关闭按钮
            const closeBtn = document.getElementById('tiktok-close');
            closeBtn.addEventListener('click', () => this.closeModal());
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.closeModal();
            });

            // 点击背景关闭
            const modal = document.getElementById('tiktok-modal');
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'tiktok-modal') {
                    this.closeModal();
                }
            });

            // 重试按钮
            document.getElementById('tiktok-retry').addEventListener('click', () => {
                this.loadVideo(this.currentVideoIndex);
            });

            // 键盘导航
            document.addEventListener('keydown', (e) => {
                if (!this.isModalOpen()) return;

                switch (e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousVideo();
                        break;
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextVideo();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'Enter':
                        this.togglePlay();
                        break;
                }
            });

            // 触摸滑动 - 移动端
            const container = document.getElementById('tiktok-container');
            let touchStartY = 0;
            let touchStartX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                this.isDragging = true;
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;

                const touchY = e.touches[0].clientY;
                const touchX = e.touches[0].clientX;
                const diffY = touchStartY - touchY;
                const diffX = touchStartX - touchX;

                // 判断是垂直滑动还是水平滑动
                if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
                    e.preventDefault(); // 阻止页面滚动
                }
            }, { passive: false });

            container.addEventListener('touchend', (e) => {
                if (!this.isDragging) return;
                this.isDragging = false;

                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;

                const diffY = touchStartY - touchEndY;
                const diffX = touchStartX - touchEndX;
                const threshold = 50;

                // 确保是垂直滑动
                if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
                    if (diffY > 0) {
                        // 向上滑动 - 下一个视频
                        this.nextVideo();
                    } else {
                        // 向下滑动 - 上一个视频
                        this.previousVideo();
                    }
                }
            }, { passive: true });

            // 鼠标滚轮导航 - PC端
            let wheelTimeout = null;
            container.addEventListener('wheel', (e) => {
                if (!this.isModalOpen()) return;
                if (wheelTimeout) return; // 防止快速滚动

                wheelTimeout = setTimeout(() => {
                    wheelTimeout = null;
                }, 500);

                e.preventDefault();

                if (e.deltaY > 0) {
                    this.nextVideo();
                } else {
                    this.previousVideo();
                }
            }, { passive: false });

            // 鼠标拖拽 - PC端
            let mouseStartY = 0;
            let isMouseDown = false;

            container.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // 只响应左键
                mouseStartY = e.clientY;
                isMouseDown = true;
                container.style.cursor = 'grabbing';
            });

            container.addEventListener('mousemove', (e) => {
                if (!isMouseDown) return;

                const diff = mouseStartY - e.clientY;

                if (Math.abs(diff) > 100) {
                    isMouseDown = false;
                    container.style.cursor = 'pointer';

                    if (diff > 0) {
                        this.nextVideo();
                    } else {
                        this.previousVideo();
                    }
                }
            });

            container.addEventListener('mouseup', () => {
                isMouseDown = false;
                container.style.cursor = 'pointer';
            });

            container.addEventListener('mouseleave', () => {
                isMouseDown = false;
                container.style.cursor = 'pointer';
            });

            // 操作按钮
            document.querySelectorAll('.tiktok-action-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleAction(action);
                });

                // 触摸优化
                item.addEventListener('touchend', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleAction(action);
                });
            });

            // 视频加载完成
            this.videoElement = document.getElementById('tiktok-player');
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.hideLoading();
                this.updateNavigation();
                this.updateTimeDisplay();
            });

            this.videoElement.addEventListener('error', (e) => {
                console.error('视频加载错误:', e);
                this.showError();
            });

            this.videoElement.addEventListener('ended', () => {
                // 自动播放下一个视频
                this.nextVideo();
            });

            // 点击视频播放/暂停
            this.videoElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });

            // 进度条更新
            this.videoElement.addEventListener('timeupdate', () => {
                this.updateProgressBar();
            });

            // 进度条点击跳转
            const progressBar = document.getElementById('tiktok-progress-bar');
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.seekToPosition(e);
            });

            // 进度条触摸跳转
            progressBar.addEventListener('touchend', (e) => {
                e.stopPropagation();
                const touch = e.changedTouches[0];
                this.seekToPosition({ clientX: touch.clientX, currentTarget: progressBar });
            });

            // 进度条拖拽
            let isDraggingProgress = false;
            progressBar.addEventListener('mousedown', (e) => {
                isDraggingProgress = true;
                this.seekToPosition(e);
            });
            document.addEventListener('mousemove', (e) => {
                if (isDraggingProgress) {
                    this.seekToPosition({ clientX: e.clientX, currentTarget: progressBar });
                }
            });
            document.addEventListener('mouseup', () => {
                isDraggingProgress = false;
            });
        }

        // 进度条更新
        updateProgressBar() {
            if (!this.videoElement || !this.videoElement.duration) return;
            const percent = (this.videoElement.currentTime / this.videoElement.duration) * 100;
            document.getElementById('tiktok-progress-filled').style.width = percent + '%';
            this.updateTimeDisplay();
        }

        // 时间显示更新
        updateTimeDisplay() {
            if (!this.videoElement) return;
            const current = this.formatTime(this.videoElement.currentTime);
            const total = this.formatTime(this.videoElement.duration || 0);
            document.getElementById('tiktok-time-display').textContent = `${current} / ${total}`;
        }

        // 格式化时间
        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // 跳转到指定位置
        seekToPosition(e) {
            const bar = document.getElementById('tiktok-progress-bar');
            const rect = bar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (this.videoElement && this.videoElement.duration) {
                this.videoElement.currentTime = percent * this.videoElement.duration;
            }
        }

        collectVideoLinks() {
            // 查找视频链接 - 支持多种格式

            // 策略1: 查找带有 /movie/ 的链接（主要格式）
            const movieLinks = document.querySelectorAll('a[href*="/movie/"]');

            // 策略2: 查找带有 s-popunder 类的链接
            const popunderLinks = document.querySelectorAll('a.s-popunder[href*="/movie/"]');

            // 合并所有链接
            const allLinks = new Set([...movieLinks, ...popunderLinks]);

            if (allLinks.size > 0) {
                console.log(`🎬 找到 ${allLinks.size} 个视频链接`);

                let index = 0;
                allLinks.forEach(link => {
                    const href = link.href;
                    if (href && !this.videoList.some(v => v.url === href)) {
                        // 获取视频标题和时长信息
                        const parent = link.closest('.block, [class*="video"], [class*="movie"], .relative');
                        let title = '';
                        let duration = '';

                        if (parent) {
                            // 尝试获取时长
                            const durationEl = parent.querySelector('[class*="duration"], .bg-black\\/60, .absolute.bottom-2');
                            if (durationEl) {
                                duration = durationEl.textContent.trim();
                            }

                            // 尝试获取alt属性作为标题
                            const img = parent.querySelector('img[alt]');
                            if (img) {
                                title = img.alt || 'Twitter Video';
                            }
                        }

                        // 提取 movieId
                        const movieIdMatch = href.match(/\/movie\/([a-zA-Z0-9_-]+)/);
                        const movieId = movieIdMatch ? movieIdMatch[1] : '';

                        // 生成模拟的点赞数和观看数
                        const likes = Math.floor(Math.random() * 50000) + 1000;
                        const views = Math.floor(Math.random() * 500000) + 10000;

                        this.videoList.push({
                            url: href,
                            title: title || `视频 ${index + 1}`,
                            duration: duration,
                            likes: likes,
                            views: views,
                            comments: Math.floor(Math.random() * 2000) + 100,
                            element: link,
                            movieId: movieId
                        });

                        index++;
                    }
                });
            } else {
                // 备用策略:查找其他可能的视频链接
                const videoSelectors = [
                    'a[href*="/videos/"]',
                    'a[href*="/watch/"]',
                    'a[href*="/status/"]',
                    '[data-video-id]',
                    '[data-video-url]'
                ];

                videoSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        const href = el.href || el.dataset.videoUrl;
                        if (href && !this.videoList.some(v => v.url === href)) {
                            this.videoList.push({
                                url: href,
                                title: el.textContent?.trim() || '视频',
                                element: el
                            });
                        }
                    });
                });
            }

            // 为找到的视频元素添加交互
            this.enhanceVideoElements();

            console.log(`📹 共收集到 ${this.videoList.length} 个视频链接`);
        }

        isValidVideoLink(url) {
            // 验证是否为有效的视频链接
            if (!url) return false;

            const patterns = [
                /\/videos\//,
                /\/watch\//,
                /\/status\//,
                /\.mp4$/,
                /\.webm$/,
                /\.mov$/,
                /\/(video|movie)\//,
                /\?.*video=/,
                /twitter\.com\/.*\/status/
            ];

            return patterns.some(pattern => pattern.test(url));
        }

        addVideoLink(element, url) {
            // 避免重复
            if (this.videoList.some(v => v.url === url)) return;

            // 获取视频信息
            let title = this.extractVideoTitle(element);
            let thumbnail = this.extractThumbnail(element);

            this.videoList.push({
                url: url,
                title: title,
                thumbnail: thumbnail,
                element: element,
                likes: Math.floor(Math.random() * 50000) + 1000,
                views: Math.floor(Math.random() * 500000) + 10000,
                comments: Math.floor(Math.random() * 2000) + 100
            });
        }

        extractVideoTitle(element) {
            // 尝试从元素中提取标题
            const titleEl = element.querySelector('img')?.alt ||
                element.closest('[class*="card"], [class*="item"]')?.querySelector('h3, h4, .title, [class*="title"]')?.textContent?.trim() ||
                element.textContent?.trim();

            // 清理标题
            return titleEl?.substring(0, 100) || '未知视频';
        }

        extractThumbnail(element) {
            // 尝试提取缩略图
            const img = element.querySelector('img[src]');
            return img?.src || '';
        }

        enhanceVideoElements() {
            // 为视频元素添加视觉提示
            this.videoList.forEach((video, index) => {
                if (video.element) {
                    // 添加点击事件拦截
                    video.element.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.currentVideoIndex = index;
                        this.openModal();
                    });

                    // 添加触摸事件
                    video.element.addEventListener('touchend', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.currentVideoIndex = index;
                        this.openModal();
                    });

                    // 添加视觉样式
                    video.element.style.cursor = 'pointer';
                    video.element.title = '点击在模态框中播放 (TikTok风格)';

                    // 添加悬浮效果
                    video.element.addEventListener('mouseenter', () => {
                        video.element.style.transform = 'scale(1.02)';
                        video.element.style.transition = 'transform 0.2s';
                    });

                    video.element.addEventListener('mouseleave', () => {
                        video.element.style.transform = 'scale(1)';
                    });
                }
            });
        }

        isModalOpen() {
            return document.getElementById('tiktok-modal').classList.contains('active');
        }

        openModal() {
            const modal = document.getElementById('tiktok-modal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // 重置点赞状态
            this.isLiked = false;
            document.getElementById('tiktok-like-icon').classList.remove('liked');

            // 加载当前视频
            this.loadVideo(this.currentVideoIndex);

            // 3秒后隐藏滑动提示
            setTimeout(() => {
                const hint = document.getElementById('tiktok-swipe-hint');
                if (hint) hint.style.opacity = '0';
            }, 3000);
        }

        closeModal() {
            const modal = document.getElementById('tiktok-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';

            // 停止视频播放
            if (this.videoElement) {
                this.videoElement.pause();
                this.videoElement.src = '';
            }
        }

        showLoading() {
            document.getElementById('tiktok-loading').style.display = 'flex';
            document.getElementById('tiktok-player').style.display = 'none';
            document.getElementById('tiktok-error').style.display = 'none';
        }

        hideLoading() {
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-player').style.display = 'block';
            document.getElementById('tiktok-error').style.display = 'none';
        }

        showError() {
            document.getElementById('tiktok-loading').style.display = 'none';
            document.getElementById('tiktok-player').style.display = 'none';
            document.getElementById('tiktok-error').style.display = 'block';
        }

        loadVideo(index) {
            if (index < 0 || index >= this.videoList.length) {
                console.log('视频索引无效');
                return;
            }

            this.showLoading();
            const video = this.videoList[index];

            // 更新原链接
            document.getElementById('tiktok-original-url').href = video.url;

            // 更新视频信息
            this.updateVideoInfo(video);

            // 尝试加载视频
            this.loadVideoSource(video.url);

            // 预加载相邻视频
            this.preloadAdjacentVideos(index);
        }

        // ========================================
        // 预加载系统
        // ========================================
        async preloadAdjacentVideos(currentIndex) {
            const indicesToPreload = [];

            // 预加载下一个和上一个视频
            if (currentIndex + 1 < this.videoList.length) {
                indicesToPreload.push(currentIndex + 1);
            }
            if (currentIndex - 1 >= 0) {
                indicesToPreload.push(currentIndex - 1);
            }
            // 可选: 预加载下下个
            if (currentIndex + 2 < this.videoList.length) {
                indicesToPreload.push(currentIndex + 2);
            }

            for (const idx of indicesToPreload) {
                const video = this.videoList[idx];
                if (!video || this.videoUrlCache.has(video.url)) continue;

                try {
                    // 先获取真实视频URL
                    let realUrl = video.url;
                    if (video.url.includes('/movie/')) {
                        realUrl = await this.fetchRealVideoUrl(video.url);
                        if (realUrl) {
                            this.videoUrlCache.set(video.url, realUrl);
                        }
                    }

                    // 预加载部分数据
                    if (realUrl && !this.preloadCache.has(realUrl)) {
                        this.preloadVideoData(realUrl);
                    }
                } catch (e) {
                    console.log('预加载失败:', e);
                }
            }
        }

        async preloadVideoData(videoUrl) {
            if (this.preloadCache.has(videoUrl)) return;

            console.log('📦 预加载视频:', videoUrl.substring(0, 80) + '...');

            try {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: videoUrl,
                        responseType: 'blob',
                        headers: {
                            'Range': `bytes=0-${this.PRELOAD_BYTES - 1}`,
                            'Referer': 'https://twitter.com/',
                            'Origin': 'https://twitter.com'
                        },
                        onload: (response) => {
                            if (response.status === 200 || response.status === 206) {
                                // 缓存管理: 超过上限时删除最旧的
                                if (this.preloadCache.size >= this.MAX_CACHE_SIZE) {
                                    const oldestKey = this.preloadCache.keys().next().value;
                                    const oldEntry = this.preloadCache.get(oldestKey);
                                    if (oldEntry && oldEntry.blobUrl) {
                                        URL.revokeObjectURL(oldEntry.blobUrl);
                                    }
                                    this.preloadCache.delete(oldestKey);
                                }

                                const blob = response.response;
                                const blobUrl = URL.createObjectURL(blob);
                                this.preloadCache.set(videoUrl, {
                                    blobUrl: blobUrl,
                                    partial: true,
                                    size: blob.size,
                                    timestamp: Date.now()
                                });
                                console.log('✅ 预加载完成:', (blob.size / 1024).toFixed(1) + 'KB');
                            }
                        },
                        onerror: (e) => {
                            console.log('预加载请求失败:', e);
                        },
                        timeout: 15000
                    });
                }
            } catch (e) {
                console.log('预加载异常:', e);
            }
        }

        async loadVideoSource(videoUrl) {
            try {
                let finalVideoUrl = videoUrl;

                // 检查是否是 /movie/{id} 格式,需要获取真实视频URL
                if (videoUrl.includes('/movie/')) {
                    console.log('🎬 检测到movie链接,正在获取真实视频URL...');
                    // 优先使用缓存
                    if (this.videoUrlCache.has(videoUrl)) {
                        finalVideoUrl = this.videoUrlCache.get(videoUrl);
                        console.log('💾 使用缓存的视频URL');
                    } else {
                        finalVideoUrl = await this.fetchRealVideoUrl(videoUrl);
                        if (finalVideoUrl) {
                            this.videoUrlCache.set(videoUrl, finalVideoUrl);
                        }
                    }

                    if (!finalVideoUrl) {
                        console.error('无法获取真实视频URL');
                        this.showErrorWithOriginalLink(videoUrl);
                        return;
                    }
                }
                // 检查是否是直接的视频文件URL
                else if (videoUrl.match(/\.(mp4|webm|mov|ogg)$/i)) {
                    finalVideoUrl = videoUrl;
                }
                // 尝试使用GM_xmlhttpRequest获取真实URL
                else if (typeof GM_xmlhttpRequest !== 'undefined') {
                    await this.fetchVideoUrl(videoUrl);
                }
                // 显示错误但提供原链接
                else {
                    console.log('无法直接加载视频,请使用原链接访问');
                    this.showErrorWithOriginalLink(videoUrl);
                    return;
                }

                if (finalVideoUrl) {
                    // 检查是否是 Twitter 视频,需要特殊处理
                    if (finalVideoUrl.includes('video.twimg.com')) {
                        console.log('🐦 检测到Twitter视频,使用特殊处理...');
                        await this.handleTwitterVideo(finalVideoUrl);
                    } else {
                        // 普通视频直接加载
                        this.videoElement.src = finalVideoUrl;
                        this.videoElement.load();

                        const playPromise = this.videoElement.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('自动播放被阻止,等待用户交互');
                            });
                        }
                    }
                }

            } catch (error) {
                console.error('加载视频失败:', error);
                this.showErrorWithOriginalLink(videoUrl);
            }
        }

        async handleTwitterVideo(twitterVideoUrl) {
            console.log('🐦 处理Twitter视频:', twitterVideoUrl);

            // 方案1: 直接播放 (配合 referrerpolicy="no-referrer")
            // video.twimg.com 通常支持直接播放，不需要通过Blob下载（Blob下载会导致加载慢且容易失败）
            try {
                this.videoElement.src = twitterVideoUrl;
                this.videoElement.load();

                const playPromise = this.videoElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('自动播放被阻止,等待用户交互');
                    });
                }
                return true;
            } catch (error) {
                console.error('直接播放失败:', error);
                this.showErrorWithOriginalLink(twitterVideoUrl);
                return false;
            }
        }

        async fetchRealVideoUrl(moviePageUrl) {
            return new Promise((resolve) => {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    console.log('GM_xmlhttpRequest 不可用,无法获取真实视频URL');
                    resolve(null);
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: moviePageUrl,
                    onload: (response) => {
                        try {
                            const html = response.responseText;

                            // 方法0: 尝试解析 application/ld+json (最准确)
                            try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const jsonScripts = doc.querySelectorAll('script[type="application/ld+json"]');

                                for (const script of jsonScripts) {
                                    try {
                                        const data = JSON.parse(script.textContent);
                                        if (data.contentUrl) {
                                            console.log('✅ 通过LD+JSON找到视频URL:', data.contentUrl);
                                            resolve(data.contentUrl);
                                            return;
                                        }
                                        // 有时候是嵌套结构
                                        if (data['@type'] === 'VideoObject' && data.contentUrl) {
                                            resolve(data.contentUrl);
                                            return;
                                        }
                                    } catch (e) { /* ignore json parse error */ }
                                }
                            } catch (e) {
                                console.log('LD+JSON解析失败:', e);
                            }

                            // 方法1: 查找 video.twimg.com 的链接
                            // 方法1: 查找 video.twimg.com 的链接 (更宽松的正则)
                            const videoMatch = html.match(/https?:\/\/video\.twimg\.com\/[^"'\s<>]+\.(?:mp4|m3u8)[^"'\s<>]*/i) ||
                                html.match(/https?:\/\/video\.twimg\.com\/[^"'\s<>]+/);
                            if (videoMatch) {
                                console.log('✅ 找到真实视频URL:', videoMatch[0]);
                                resolve(videoMatch[0]);
                                return;
                            }

                            // 方法2: 查找 data-video-src 或类似的属性
                            const dataVideoMatch = html.match(/data-video-src=["']([^"']+)["']/);
                            if (dataVideoMatch) {
                                resolve(dataVideoMatch[1]);
                                return;
                            }

                            // 方法3: 查找 video 标签的 src
                            const videoTagMatch = html.match(/<video[^>]+src=["']([^"']+)["']/);
                            if (videoTagMatch) {
                                resolve(videoTagMatch[1]);
                                return;
                            }

                            // 方法4: 查找其他可能的视频链接模式
                            const patterns = [
                                /video_url["']:\s*["']([^"']+)["']/,
                                /"url":"([^"]+\.mp4[^"]*)"/,
                                /src=["']([^"']*\.mp4[^"']*)["']/
                            ];

                            for (const pattern of patterns) {
                                const match = html.match(pattern);
                                if (match) {
                                    let url = match[1].replace(/\\/g, '');
                                    if (url.startsWith('//')) {
                                        url = 'https:' + url;
                                    }
                                    resolve(url);
                                    return;
                                }
                            }

                            console.log('❌ 无法从页面中提取视频URL');
                            resolve(null);

                        } catch (error) {
                            console.error('解析视频URL失败:', error);
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        console.error('请求视频页面失败:', error);
                        resolve(null);
                    },
                    timeout: 10000
                });
            });
        }

        async fetchVideoUrl(videoUrl) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: videoUrl,
                    onload: (response) => {
                        // 尝试从响应中提取视频URL
                        const videoUrlMatch = response.responseText.match(/video_url["']:\s*["']([^"']+)["']/);
                        const mediaMatch = response.responseText.match(/<video[^>]+src=["']([^"']+)["']/);

                        if (videoUrlMatch) {
                            this.videoElement.src = videoUrlMatch[1];
                        } else if (mediaMatch) {
                            this.videoElement.src = mediaMatch[1];
                        } else {
                            // 如果无法提取,显示错误
                            this.showErrorWithOriginalLink(videoUrl);
                        }
                        resolve();
                    },
                    onerror: (error) => {
                        console.error('请求失败:', error);
                        this.showErrorWithOriginalLink(videoUrl);
                        resolve();
                    }
                });
            });
        }

        showErrorWithOriginalLink(videoUrl) {
            this.showError();

            // 更新错误信息,添加原链接按钮
            const errorDiv = document.getElementById('tiktok-error');
            const originalLinkBtn = errorDiv.querySelector('.tiktok-error-btn');

            if (originalLinkBtn) {
                originalLinkBtn.textContent = '在新标签页打开';
                originalLinkBtn.onclick = () => {
                    if (typeof GM_openInTab !== 'undefined') {
                        GM_openInTab(videoUrl, { active: true });
                    } else {
                        window.open(videoUrl, '_blank');
                    }
                };
            }
        }

        updateVideoInfo(video) {
            // 更新作者信息
            const authorEl = document.getElementById('tiktok-author');
            if (authorEl) {
                authorEl.textContent = video.title.split(' ')[0] || 'anonymous';
            }

            // 更新标题
            const titleEl = document.getElementById('tiktok-title');
            if (titleEl) {
                titleEl.textContent = video.title;
            }

            // 更新标签
            const hashtagsEl = document.getElementById('tiktok-hashtags');
            if (hashtagsEl) {
                hashtagsEl.textContent = this.generateHashtags(video.title);
            }

            // 更新统计信息
            const likesEl = document.getElementById('tiktok-likes');
            const viewsEl = document.getElementById('tiktok-views');
            const likeCountEl = document.getElementById('tiktok-like-count');
            const commentCountEl = document.getElementById('tiktok-comment-count');

            if (likesEl) likesEl.textContent = `👍 ${this.formatNumber(video.likes)}`;
            if (viewsEl) viewsEl.textContent = `👁️ ${this.formatNumber(video.views)}`;
            if (likeCountEl) likeCountEl.textContent = this.formatNumber(video.likes);
            if (commentCountEl) commentCountEl.textContent = this.formatNumber(video.comments);

            // 更新计数指示器
            document.getElementById('tiktok-count').textContent =
                `${this.currentVideoIndex + 1} / ${this.videoList.length}`;
        }

        generateHashtags(title) {
            // 从标题生成相关标签
            const words = title.split(' ').filter(word => word.length > 3);
            return words.slice(0, 3).map(word => `#${word}`).join(' ');
        }

        formatNumber(num) {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        }

        updateNavigation() {
            const nav = document.getElementById('tiktok-nav');
            nav.innerHTML = '';

            // 限制显示的点数
            const maxDots = 5;
            const totalVideos = this.videoList.length;
            const startIndex = Math.max(0, this.currentVideoIndex - Math.floor(maxDots / 2));
            const endIndex = Math.min(totalVideos, startIndex + maxDots);

            for (let i = startIndex; i < endIndex; i++) {
                const dot = document.createElement('div');
                dot.className = `tiktok-nav-dot ${i === this.currentVideoIndex ? 'active' : ''}`;
                dot.title = `视频 ${i + 1}`;

                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.currentVideoIndex = i;
                    this.loadVideo(i);
                });

                nav.appendChild(dot);
            }
        }

        nextVideo() {
            if (this.isTransitioning) return;
            const nextIndex = this.currentVideoIndex < this.videoList.length - 1
                ? this.currentVideoIndex + 1
                : 0;
            this.transitionToVideo(nextIndex, 'up');
        }

        previousVideo() {
            if (this.isTransitioning) return;
            const prevIndex = this.currentVideoIndex > 0
                ? this.currentVideoIndex - 1
                : this.videoList.length - 1;
            this.transitionToVideo(prevIndex, 'down');
        }

        transitionToVideo(newIndex, direction) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            const player = this.videoElement;
            const outClass = direction === 'up' ? 'slide-out-up' : 'slide-out-down';
            const inClass = direction === 'up' ? 'slide-in-up' : 'slide-in-down';

            // 清除之前的动画类
            player.classList.remove('slide-out-up', 'slide-out-down', 'slide-in-up', 'slide-in-down');

            // 播放退出动画
            player.classList.add(outClass);

            // 动画结束后加载新视频并播放进入动画
            setTimeout(() => {
                player.classList.remove(outClass);
                this.currentVideoIndex = newIndex;

                // 加载新视频
                this.loadVideo(this.currentVideoIndex);

                // 播放进入动画
                player.classList.add(inClass);

                // 动画结束后清理
                setTimeout(() => {
                    player.classList.remove(inClass);
                    this.isTransitioning = false;
                }, 300);
            }, 280);
        }

        togglePlay() {
            if (this.videoElement.paused) {
                this.videoElement.play();
            } else {
                this.videoElement.pause();
            }
        }

        handleAction(action) {
            switch (action) {
                case 'like':
                    this.toggleLike();
                    break;
                case 'comment':
                    this.showComments();
                    break;
                case 'share':
                    this.shareVideo();
                    break;
            }
        }

        toggleLike() {
            this.isLiked = !this.isLiked;
            const likeIcon = document.getElementById('tiktok-like-icon');
            const likeCountEl = document.getElementById('tiktok-like-count');

            likeIcon.classList.toggle('liked', this.isLiked);

            // 更新点赞数
            const currentLikes = this.videoList[this.currentVideoIndex].likes;
            const newLikes = this.isLiked ? currentLikes + 1 : currentLikes - 1;
            this.videoList[this.currentVideoIndex].likes = newLikes;

            if (likeCountEl) {
                likeCountEl.textContent = this.formatNumber(newLikes);
            }

            // 更新主显示的点赞数
            document.getElementById('tiktok-likes').textContent =
                `👍 ${this.formatNumber(newLikes)}`;
        }

        showComments() {
            const commentCount = this.videoList[this.currentVideoIndex].comments;
            alert(`评论功能\n\n当前视频有 ${this.formatNumber(commentCount)} 条评论\n\n(评论功能开发中)`);
        }

        shareVideo() {
            const video = this.videoList[this.currentVideoIndex];
            const shareText = `看看这个视频: ${video.title}`;

            if (navigator.share) {
                // 使用原生分享API (移动端)
                navigator.share({
                    title: shareText,
                    text: video.title,
                    url: video.url
                }).catch(console.error);
            } else {
                // 降级方案:复制链接
                navigator.clipboard.writeText(video.url).then(() => {
                    alert('链接已复制到剪贴板!');
                }).catch(() => {
                    // 如果复制失败,显示链接
                    const dummy = document.createElement('input');
                    document.body.appendChild(dummy);
                    dummy.value = video.url;
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                    alert(`链接: ${video.url}\n\n(已复制到剪贴板)`);
                });
            }
        }
    }

    // ========================================
    // 初始化
    // ========================================
    // 等待DOM加载完成
    function initPlayer() {
        // 检查是否已经初始化
        if (window.tiktokModalPlayer) {
            return;
        }

        // 确保body存在
        if (!document.body) {
            setTimeout(initPlayer, 100);
            return;
        }

        window.tiktokModalPlayer = new TikTokModalPlayer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }

    // 监听动态加载的内容 (Next.js的动态路由)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 元素节点
                    // 检查是否添加了新的视频元素
                    if (node.querySelectorAll && node.querySelectorAll('a[href]').length > 0) {
                        // 延迟重新收集链接
                        setTimeout(() => {
                            if (window.tiktokModalPlayer) {
                                window.tiktokModalPlayer.collectVideoLinks();
                            }
                        }, 1000);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();