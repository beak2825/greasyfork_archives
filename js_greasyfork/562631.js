// ==UserScript==
// @name         Twitter排行榜：TikTok版
// @namespace    loadingi.local
// @version      2.1
// @description  视频模态框播放器 - 支持TikTok风格上下滑动切换,无需跳转页面
// @author       Chris_C
// @match        https://twitter-ero-video-ranking.com/*
// @match        https://x-ero-anime.com/*
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap');

        :root {
            --primary-red: #FE2C55;
            --primary-cyan: #25F4EE;
            --glass-bg: rgba(20, 20, 20, 0.3);
            --glass-bg-hover: rgba(40, 40, 40, 0.5);
            --glass-border: rgba(255, 255, 255, 0.08);
            --glass-blur: blur(20px);
            --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
            --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
            --ease-smooth: cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        body.tiktok-modal-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
            overscroll-behavior: none !important;
            touch-action: none !important;
        }

        .tiktok-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            background: #000;
            z-index: 2147483647;
            display: none;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
            opacity: 0;
            transition: opacity 0.3s var(--ease-smooth);
        }

        .tiktok-modal-overlay.active {
            display: flex;
            opacity: 1;
            animation: modalIn 0.4s var(--ease-smooth) forwards;
        }

        @keyframes modalIn {
            from { transform: scale(0.98); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes tiktokFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 视频切换动画 */
        @keyframes slideOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes slideInDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .tiktok-video-player.slide-out-up { animation: slideOutUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-up { animation: slideInUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-out-down { animation: slideOutDown 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-down { animation: slideInDown 0.3s ease-out forwards; }

        /* --- 视频容器与遮罩 --- */
        .tiktok-video-container {
            flex: 1;
            position: relative;
            width: 100%;
            height: 100%;
            background: #000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            /* 缩略图背景 */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .tiktok-video-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: inherit;
            filter: blur(20px) brightness(0.4);
            transform: scale(1.1);
            z-index: 0;
        }

        /* 顶部遮罩 - 柔和的线性渐变 */
        .tiktok-video-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%);
            pointer-events: none;
            z-index: 2;
        }

        /* 底部遮罩 - 仅覆盖控件区域 */
        .tiktok-progress-container::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: -10px;  /* 抵消父元素 padding */
            right: -10px; /* 抵消父元素 padding */
            height: 120px;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
            z-index: -1;
            pointer-events: none;
        }

        .tiktok-video-player {
            width: 100%;
            height: 100%;
            object-fit: contain;
            cursor: pointer;
            z-index: 1;
            background: transparent;
        }
        
        /* 隐藏原生控件 */
        .tiktok-video-player::-webkit-media-controls { display: none !important; }
        .tiktok-video-player::-webkit-media-controls-enclosure { display: none !important; }

        /* --- 控件通用样式：磨砂玻璃 --- */
        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-sm);
            color: rgba(255, 255, 255, 0.95);
        }

        /* 关闭按钮 */
        .tiktok-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2147483648;
            transition: all 0.3s var(--ease-smooth);
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border: none; /* Reset */
        }

        .tiktok-close-btn:hover {
            background: var(--glass-bg-hover);
            transform: rotate(90deg) scale(1.1);
        }
        
        .tiktok-close-btn svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        /* 未读开关 */
        .tiktok-unread-toggle {
            position: absolute;
            top: 20px;
            right: 80px;
            height: 44px;
            padding: 0 16px;
            border-radius: 22px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            z-index: 2147483648;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: all 0.3s var(--ease-smooth);
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            color: white;
        }

        .tiktok-unread-toggle:hover {
            background: var(--glass-bg-hover);
        }

        .toggle-switch {
            width: 36px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            position: relative;
            transition: background 0.3s var(--ease-smooth);
        }

        .toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.3s var(--ease-elastic);
        }

        .tiktok-unread-toggle.active .toggle-switch {
            background: var(--primary-red);
            box-shadow: 0 0 10px rgba(254, 44, 85, 0.4);
        }

        .tiktok-unread-toggle.active .toggle-switch::after {
            transform: translateX(16px);
        }

        /* 视频计数器 */
        .tiktok-video-count {
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 1px;
            z-index: 2147483648;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            color: white;
        }

        /* --- 交互动效区域 --- */
        .tiktok-actions {
            position: absolute;
            right: 16px;
            bottom: 140px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            z-index: 2147483648;
        }

        .tiktok-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        .tiktok-action-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s var(--ease-elastic);
            /* Glassmorphism for icons */
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
        }

        .tiktok-action-item:hover .tiktok-action-icon {
            transform: scale(1.15);
            background: var(--glass-bg-hover);
            border-color: rgba(255,255,255,0.3);
        }

        .tiktok-action-icon svg {
            width: 26px;
            height: 26px;
            fill: #fff;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            transition: all 0.3s ease;
        }

        /* 点赞动画 */
        .tiktok-action-icon.liked {
            border-color: rgba(254, 44, 85, 0.5);
            background: rgba(254, 44, 85, 0.15);
        }

        .tiktok-action-icon.liked svg {
            fill: var(--primary-red);
            filter: drop-shadow(0 0 8px rgba(254, 44, 85, 0.6));
            animation: heartBeat 0.4s var(--ease-elastic);
        }

        @keyframes heartBeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }

        .tiktok-action-text {
            font-size: 0.75rem;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            opacity: 0.9;
        }

        /* --- 视频信息区 --- */
        .tiktok-video-info {
            position: absolute;
            bottom: 60px;
            left: 16px;
            right: 80px;
            z-index: 2147483647;
            perspective: 1000px;
        }

        .tiktok-video-info h3 {
            font-size: 1.1rem;
            font-weight: 700;
            line-height: 1.4;
            margin: 0;
            color: #fff;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
            transform-origin: left bottom;
            animation: slideUpFade 0.5s var(--ease-smooth);
        }

        @keyframes slideUpFade {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        /* --- 极致进度条 --- */
        /* --- 极致进度条 (触屏优化版) --- */
        .tiktok-progress-container {
            position: absolute;
            bottom: 20px; /* 抬高20px，避开iOS底部Home条 */
            left: 10px;
            right: 10px;
            height: 48px; /* 增加热区高度 */
            display: flex;
            align-items: center; /* 垂直居中对齐，更易点击 */
            padding: 0 10px;
            z-index: 2147483648;
            cursor: pointer;
            /* 增加触摸接触面积但视觉上不影响 */
            touch-action: none; /* 防止拖动时触发浏览器手势 */
        }
        
        /* 交互扩展热区 - 触屏与鼠标优化 */
        .tiktok-progress-container:active .tiktok-progress-bar,
        .tiktok-progress-container:hover .tiktok-progress-bar,
        .tiktok-progress-container.dragging .tiktok-progress-bar {
            height: 8px; /* 加粗 */
            background: rgba(255, 255, 255, 0.5);
            border-radius: 4px;
        }
        
        .tiktok-progress-container:active .tiktok-progress-filled::after,
        .tiktok-progress-container:hover .tiktok-progress-filled::after,
        .tiktok-progress-container.dragging .tiktok-progress-filled::after {
            transform: translateY(-50%) scale(1); /* 显示拖动点 */
        }
        
        /* 拖拽时增强效果 */
        .tiktok-progress-container.dragging .tiktok-progress-filled::after {
            transform: translateY(-50%) scale(1.3); /* 拖动时放大 */
            box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(254, 44, 85, 0.5);
        }
        
        .tiktok-progress-container.dragging .tiktok-progress-filled {
            box-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(254, 44, 85, 0.4);
        }

        .tiktok-progress-bar {
            flex: 1;
            height: 4px; /* 默认加粗一点点，手机上看不清2px */
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            position: relative;
            transition: all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .tiktok-progress-filled {
            height: 100%;
            background: #fff;
            border-radius: 2px;
            width: 0%;
            position: relative;
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
            transition: box-shadow 0.15s ease;
        }

        .tiktok-progress-filled::after {
            content: '';
            position: absolute;
            right: -10px; /* 稍微向右偏移，对准手指 */
            top: 50%;
            width: 20px; /* 加大拖动点，触摸更友好 */
            height: 20px;
            background: #fff;
            border-radius: 50%;
            transform: translateY(-50%) scale(0); /* 默认隐藏 */
            transition: transform 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6), box-shadow 0.2s ease;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
            pointer-events: none; /* 穿透点击，由container接管 */
        }

        .tiktok-time-display {
            margin-left: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            font-variant-numeric: tabular-nums;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            opacity: 0.8;
        }

        /* --- 加载与错误 --- */
        .tiktok-loading, .tiktok-error {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483648;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            text-align: center;
        }
        
        .tiktok-error { display: none; padding: 20px; max-width: 80%; }

        .tiktok-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--primary-red);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .tiktok-loading-text { margin-top: 15px; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        
        .tiktok-error svg { width: 64px; height: 64px; fill: var(--primary-red); margin-bottom: 20px; }
        .tiktok-error h3 { font-size: 1.2rem; margin-bottom: 10px; }
        .tiktok-error p { color: rgba(255,255,255,0.7); margin-bottom: 20px; }
        
        .tiktok-error-btn {
            background: var(--primary-red);
            color: white; border: none;
            padding: 12px 24px; border-radius: 24px;
            font-size: 1rem; cursor: pointer;
            transition: background 0.3s;
        }
        .tiktok-error-btn:hover { background: #e8254d; }
        
        /* 链接按钮 */
        .tiktok-original-link {
            position: absolute; bottom: 30px; right: 20px; z-index: 2147483648;
        }
        .tiktok-original-link a {
            display: flex; align-items: center; gap: 6px;
            color: rgba(255, 255, 255, 0.8); text-decoration: none;
            font-size: 0.8rem; padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px; transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        .tiktok-original-link a:hover {
            background: rgba(255, 255, 255, 0.2); color: white;
        }

        /* --- 移动端适配 (Refined) --- */
        @media (max-width: 768px) {
            .tiktok-close-btn { top: 12px; right: 12px; width: 36px; height: 36px; }
            .tiktok-unread-toggle { top: 12px; right: 56px; height: 36px; padding: 0 12px; }
            .tiktok-video-count { top: 14px; left: 14px; padding: 6px 12px; font-size: 0.75rem; }
            .tiktok-actions { bottom: 110px; right: 10px; gap: 20px; }
            .tiktok-video-info { bottom: 65px; left: 14px; right: 80px; }
            .tiktok-video-info h3 { font-size: 0.95rem; }
            .tiktok-action-icon { width: 44px; height: 44px; }
            .tiktok-action-icon svg { width: 24px; height: 24px; }
            .tiktok-original-link { bottom: 20px; right: 15px; }
        }
    `;


    // ========================================
    // 主要功能类 - TikTokModalPlayer
    // ========================================
    class TikTokModalPlayer {
        constructor() {
            this.currentVideoIndex = 0;
            this.videoList = [];
            this.filteredVideoList = []; // 过滤后的视频列表
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
            this.lastPreloadedIndex = -1; // 防止重复预加载

            // 动画状态
            this.isTransitioning = false;

            // 进度条拖拽状态
            this.isProgressDragging = false;

            // 已观看视频记录 (localStorage)
            this.WATCHED_STORAGE_KEY = 'tiktok_modal_watched_videos';
            this.watchedVideos = this.loadWatchedVideos();

            // 只看未读模式
            this.unreadOnlyMode = false;

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

            // 创建模态框DOM (立即可用)
            this.createModalDOM();

            // 绑定事件
            this.bindEvents();

            // 异步收集视频列表 - 不阻塞模态框初始化
            this.scheduleVideoCollection();

            console.log('🎬 TikTok Modal Player 初始化完成 - 模态框已就绪');
        }

        // 使用空闲时间收集视频，不阻塞其他操作
        scheduleVideoCollection() {
            const collect = () => {
                this.collectVideoLinks();
                console.log('📹 视频采集完成 - 找到', this.videoList.length, '个视频');
            };

            // 优先使用 requestIdleCallback，否则使用 setTimeout
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(collect, { timeout: 2000 });
            } else {
                setTimeout(collect, 0);
            }
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

                <div class="tiktok-unread-toggle" id="tiktok-unread-toggle" title="只看未读">
                    <span>未读</span>
                    <div class="toggle-switch"></div>
                </div>

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
                        <h3 id="tiktok-title">视频标题</h3>
                    </div>

                    <div class="tiktok-actions" id="tiktok-actions">
                        <div class="tiktok-action-item" data-action="like" title="点赞">
                            <div class="tiktok-action-icon" id="tiktok-like-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">喜欢</span>
                        </div>

                        <div class="tiktok-action-item" data-action="download" title="下载">
                            <div class="tiktok-action-icon" id="tiktok-download-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">下载</span>
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

            // 只看未读切换按钮
            const unreadToggle = document.getElementById('tiktok-unread-toggle');
            unreadToggle.addEventListener('click', () => this.toggleUnreadMode());
            unreadToggle.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.toggleUnreadMode();
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

            container.addEventListener('mouseup', () => resetMouseState());
            container.addEventListener('mouseleave', () => resetMouseState());

            function resetMouseState() {
                isMouseDown = false;
                container.style.cursor = 'pointer';
            }

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

            // 视频可以播放时触发预加载 - 确保当前视频优先
            this.videoElement.addEventListener('canplay', () => {
                // 使用 requestIdleCallback 异步预加载相邻视频
                this.schedulePreload(this.currentVideoIndex);
            }, { once: false });

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
                // 只有非拖拽状态才更新进度条，避免拖拽时抖动
                if (!this.isProgressDragging) {
                    this.updateProgressBar();
                }
            });

            // 进度条交互
            this.setupProgressBarInteraction();
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

        // 更新进度条位置（用于拖拽预览，不改变视频时间）
        updateProgressPreview(clientX) {
            const bar = document.getElementById('tiktok-progress-bar');
            const rect = bar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

            // 更新进度条视觉位置
            document.getElementById('tiktok-progress-filled').style.width = (percent * 100) + '%';

            // 更新时间显示预览
            if (this.videoElement && this.videoElement.duration) {
                const previewTime = percent * this.videoElement.duration;
                const current = this.formatTime(previewTime);
                const total = this.formatTime(this.videoElement.duration);
                document.getElementById('tiktok-time-display').textContent = `${current} / ${total}`;
            }

            return percent;
        }

        // 设置进度条交互（鼠标和触摸）
        setupProgressBarInteraction() {
            const container = document.getElementById('tiktok-progress-container');
            const progressBar = document.getElementById('tiktok-progress-bar');

            // 初始化拖拽状态
            this.isProgressDragging = false;
            let lastPercent = 0;

            // ==================== 鼠标交互 ====================

            // 鼠标点击/拖拽开始
            container.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.isProgressDragging = true;
                container.classList.add('dragging');
                lastPercent = this.updateProgressPreview(e.clientX);
            });

            // 鼠标移动（全局监听以支持拖出进度条范围）
            document.addEventListener('mousemove', (e) => {
                if (!this.isProgressDragging) return;
                e.preventDefault();
                lastPercent = this.updateProgressPreview(e.clientX);
            });

            // 鼠标释放（全局监听）
            document.addEventListener('mouseup', (e) => {
                if (!this.isProgressDragging) return;

                this.isProgressDragging = false;
                container.classList.remove('dragging');

                // 应用最终位置
                if (this.videoElement && this.videoElement.duration) {
                    this.videoElement.currentTime = lastPercent * this.videoElement.duration;
                }
            });

            // ==================== 触摸交互 ====================

            // 触摸开始
            container.addEventListener('touchstart', (e) => {
                // 阻止事件冒泡，防止触发视频切换
                e.stopPropagation();

                const touch = e.touches[0];
                this.isProgressDragging = true;
                container.classList.add('dragging');
                lastPercent = this.updateProgressPreview(touch.clientX);
            }, { passive: true });

            // 触摸移动
            container.addEventListener('touchmove', (e) => {
                if (!this.isProgressDragging) return;

                // 阻止默认行为，防止页面滚动
                e.preventDefault();
                e.stopPropagation();

                const touch = e.touches[0];
                lastPercent = this.updateProgressPreview(touch.clientX);
            }, { passive: false });

            // 触摸结束
            container.addEventListener('touchend', (e) => {
                if (!this.isProgressDragging) return;

                e.stopPropagation();

                this.isProgressDragging = false;
                container.classList.remove('dragging');

                // 应用最终位置
                if (this.videoElement && this.videoElement.duration) {
                    this.videoElement.currentTime = lastPercent * this.videoElement.duration;
                }
            }, { passive: true });

            // 触摸取消（例如来电打断）
            container.addEventListener('touchcancel', () => {
                if (!this.isProgressDragging) return;

                this.isProgressDragging = false;
                container.classList.remove('dragging');

                // 恢复到当前实际播放位置
                this.updateProgressBar();
            }, { passive: true });

            // ==================== 点击跳转（非拖拽的快速点击） ====================

            // 使用 click 事件作为后备（如果只是单击而非拖拽）
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                // 如果正在拖拽，不处理 click
                if (this.isProgressDragging) return;
                this.seekToPosition(e);
            });
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

                        // 提取缩略图
                        const thumbnailImg = link.querySelector('img[src]') ||
                            (parent ? parent.querySelector('img[src]') : null);
                        const thumbnail = thumbnailImg?.src || '';

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
                            thumbnail: thumbnail,
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
                    // 触摸追踪变量
                    let touchStartX = 0;
                    let touchStartY = 0;
                    let isTouchMoved = false;

                    // 记录触摸开始位置
                    video.element.addEventListener('touchstart', (e) => {
                        touchStartX = e.touches[0].clientX;
                        touchStartY = e.touches[0].clientY;
                        isTouchMoved = false;
                    }, { passive: true });

                    // 检测是否移动了（滚动）
                    video.element.addEventListener('touchmove', (e) => {
                        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
                        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                        // 如果移动超过10px，认为是滚动而非点击
                        if (deltaX > 10 || deltaY > 10) {
                            isTouchMoved = true;
                        }
                    }, { passive: true });

                    // 只有在没有滚动的情况下才触发模态框
                    video.element.addEventListener('touchend', (e) => {
                        if (!isTouchMoved) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.currentVideoIndex = this.getActualVideoIndex(index);
                            this.openModal();
                        }
                    });

                    // 添加点击事件拦截 (PC端)
                    video.element.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.currentVideoIndex = this.getActualVideoIndex(index);
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

        // 获取实际视频索引（考虑过滤模式）
        getActualVideoIndex(originalIndex) {
            if (!this.unreadOnlyMode) {
                return originalIndex;
            }
            // 在过滤模式下，找到对应的过滤列表索引
            const video = this.videoList[originalIndex];
            return this.filteredVideoList.findIndex(v => v.url === video.url);
        }

        // 获取当前使用的视频列表
        getActiveVideoList() {
            return this.unreadOnlyMode ? this.filteredVideoList : this.videoList;
        }

        // 获取当前播放的视频
        getCurrentVideo() {
            const list = this.getActiveVideoList();
            return list[this.currentVideoIndex];
        }

        // 更新过滤后的视频列表
        updateFilteredList() {
            this.filteredVideoList = this.videoList.filter(v => !this.isVideoWatched(v.url));
        }

        isModalOpen() {
            return document.getElementById('tiktok-modal').classList.contains('active');
        }

        openModal() {
            const modal = document.getElementById('tiktok-modal');
            modal.classList.add('active');

            // iOS Safari: 禁用橡皮筋效果和滚动
            document.body.classList.add('tiktok-modal-open');
            document.body.style.overflow = 'hidden';

            // iOS Safari: 设置状态栏颜色
            this.setThemeColor('#000000');

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

            // iOS Safari: 恢复滚动
            document.body.classList.remove('tiktok-modal-open');
            document.body.style.overflow = '';

            // iOS Safari: 恢复状态栏颜色
            this.restoreThemeColor();

            // 停止视频播放
            if (this.videoElement) {
                this.videoElement.pause();
                this.videoElement.src = '';
            }
        }

        // iOS Safari 状态栏颜色管理
        setThemeColor(color) {
            let themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (!themeColorMeta) {
                themeColorMeta = document.createElement('meta');
                themeColorMeta.name = 'theme-color';
                document.head.appendChild(themeColorMeta);
            }
            this._originalThemeColor = themeColorMeta.content;
            themeColorMeta.content = color;
        }

        restoreThemeColor() {
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta && this._originalThemeColor !== undefined) {
                themeColorMeta.content = this._originalThemeColor;
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
            const list = this.getActiveVideoList();

            if (index < 0 || index >= list.length) {
                console.log('视频索引无效');
                return;
            }

            this.showLoading();
            const video = list[index];

            // 设置缩略图背景
            const container = document.getElementById('tiktok-container');
            if (video.thumbnail) {
                container.style.backgroundImage = `url(${video.thumbnail})`;
            } else {
                container.style.backgroundImage = 'none';
            }

            // 更新视频信息
            this.updateVideoInfo(video);

            // 更新计数
            document.getElementById('tiktok-count').textContent =
                `${index + 1} / ${list.length}`;

            // 标记为已观看
            this.markVideoAsWatched(video.url);

            // 尝试加载视频 (预加载将在 canplay 事件后异步触发)
            this.loadVideoSource(video.url);
        }

        // 调度预加载 - 使用空闲时间，不阻塞当前视频
        schedulePreload(currentIndex) {
            // 防止重复预加载同一个索引
            if (this.lastPreloadedIndex === currentIndex) {
                return;
            }
            this.lastPreloadedIndex = currentIndex;

            const doPreload = () => {
                this.preloadAdjacentVideos(currentIndex);
            };

            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(doPreload, { timeout: 3000 });
            } else {
                setTimeout(doPreload, 100);
            }
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
            // 更新标题
            const titleEl = document.getElementById('tiktok-title');
            if (titleEl) {
                titleEl.textContent = video.title || '未知视频';
            }
        }

        formatNumber(num) {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        }

        nextVideo() {
            if (this.isTransitioning) return;
            const list = this.getActiveVideoList();
            const nextIndex = this.currentVideoIndex < list.length - 1
                ? this.currentVideoIndex + 1
                : 0;
            this.transitionToVideo(nextIndex, 'up');
        }

        previousVideo() {
            if (this.isTransitioning) return;
            const list = this.getActiveVideoList();
            const prevIndex = this.currentVideoIndex > 0
                ? this.currentVideoIndex - 1
                : list.length - 1;
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
                case 'download':
                    this.downloadVideo();
                    break;
                case 'share':
                    this.shareVideo();
                    break;
            }
        }

        async toggleLike() {
            const video = this.getCurrentVideo();
            if (!video?.movieId) {
                console.log('无法获取视频ID');
                return;
            }

            const likeIcon = document.getElementById('tiktok-like-icon');
            const newLikedState = !this.isLiked;

            // 先更新UI
            this.isLiked = newLikedState;
            likeIcon.classList.toggle('liked', newLikedState);

            // 调用API
            try {
                const response = await fetch(`https://twitter-ero-video-ranking.com/api/media/${video.movieId}/favorite`, {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'content-type': 'application/json',
                        'cache-control': 'no-cache'
                    },
                    body: JSON.stringify({ favorite: newLikedState ? 1 : 0 }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('API请求失败');
                }

                console.log(`${newLikedState ? '❤️ 已收藏' : '💔 已取消收藏'}: ${video.movieId}`);
            } catch (error) {
                console.error('收藏请求失败:', error);
                // 回滚UI状态
                this.isLiked = !newLikedState;
                likeIcon.classList.toggle('liked', !newLikedState);
            }
        }

        downloadVideo() {
            const video = this.getCurrentVideo();
            const videoSrc = this.videoElement?.src;

            // 优先使用已加载的视频URL，否则使用原始链接
            const downloadUrl = (videoSrc && videoSrc.startsWith('http')) ? videoSrc : video?.url;

            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                alert('无法获取视频下载链接');
            }
        }

        shareVideo() {
            const video = this.getCurrentVideo();
            if (!video?.url) return;

            if (navigator.share) {
                navigator.share({
                    title: video.title,
                    url: video.url
                }).catch(console.error);
            } else {
                this.copyToClipboard(video.url);
            }
        }

        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert('链接已复制到剪贴板!'))
                .catch(() => {
                    // 降级方案
                    const input = document.createElement('input');
                    input.value = text;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    alert('链接已复制!');
                });
        }

        // ========================================
        // 已观看视频记录系统
        // ========================================
        loadWatchedVideos() {
            try {
                const stored = localStorage.getItem(this.WATCHED_STORAGE_KEY);
                return stored ? new Set(JSON.parse(stored)) : new Set();
            } catch (e) {
                console.error('加载观看记录失败:', e);
                return new Set();
            }
        }

        saveWatchedVideos() {
            try {
                const arr = Array.from(this.watchedVideos);
                // 只保留最近1000条记录
                const trimmed = arr.slice(-1000);
                localStorage.setItem(this.WATCHED_STORAGE_KEY, JSON.stringify(trimmed));
            } catch (e) {
                console.error('保存观看记录失败:', e);
            }
        }

        markVideoAsWatched(videoUrl) {
            if (!videoUrl) return;
            // 使用 movieId 或 URL 作为标识
            const id = this.extractVideoId(videoUrl);
            if (!this.watchedVideos.has(id)) {
                this.watchedVideos.add(id);
                this.saveWatchedVideos();
            }
        }

        isVideoWatched(videoUrl) {
            const id = this.extractVideoId(videoUrl);
            return this.watchedVideos.has(id);
        }

        extractVideoId(url) {
            // 尝试提取 movieId
            const match = url.match(/\/movie\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : url;
        }

        // ========================================
        // 只看未读模式
        // ========================================
        toggleUnreadMode() {
            this.unreadOnlyMode = !this.unreadOnlyMode;
            const toggle = document.getElementById('tiktok-unread-toggle');
            toggle.classList.toggle('active', this.unreadOnlyMode);

            if (this.unreadOnlyMode) {
                // 更新过滤列表
                this.updateFilteredList();

                if (this.filteredVideoList.length === 0) {
                    alert('没有未读视频了！');
                    this.unreadOnlyMode = false;
                    toggle.classList.remove('active');
                    return;
                }

                // 重置到第一个未读视频
                this.currentVideoIndex = 0;
                this.loadVideo(0);
            } else {
                // 恢复到原始列表
                this.updateVideoCount();
            }
        }

        updateVideoCount() {
            const list = this.getActiveVideoList();
            document.getElementById('tiktok-count').textContent =
                `${this.currentVideoIndex + 1} / ${list.length}`;
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
