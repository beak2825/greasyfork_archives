// ==UserScript==
// @name         Coomer 防社死 + 佬友播放器 + 纯净版
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  B站式防社死遮罩（包括图片、新版Video.js视频、头像）。支持一键纯黑/复位快捷键 (Ctrl+B)。内置 Video.js 增强播放器（快进/倍速/音量热键）。屏蔽顶部菜单和烦人的横幅。
// @author       BennieQin & Gemini
// @license      MIT
// @match        https://coomer.st/*
// @match        https://coomer.su/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     videojs_css https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video-js.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560531/Coomer%20%E9%98%B2%E7%A4%BE%E6%AD%BB%20%2B%20%E4%BD%AC%E5%8F%8B%E6%92%AD%E6%94%BE%E5%99%A8%20%2B%20%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560531/Coomer%20%E9%98%B2%E7%A4%BE%E6%AD%BB%20%2B%20%E4%BD%AC%E5%8F%8B%E6%92%AD%E6%94%BE%E5%99%A8%20%2B%20%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // Part 1: 防社死核心配置
    // ==========================================
    const STORAGE_KEY = 'coomer_panic_mode_cfg_v7';
    const PANEL_WIDTH = 140;

    // 获取当前视口宽度的安全函数
    function getSafeWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1024;
    }

    const defaultConfig = {
        opacity: 80,
        left: getSafeWidth() - PANEL_WIDTH - 20, // 初始依靠计算
        top: 20,
        minimized: false
    };

    let config;
    try {
        config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultConfig;
    } catch(e) { config = defaultConfig; }

    // 边界检查：确保面板不会跑出屏幕
    function enforceBoundaries() {
        const width = getSafeWidth();
        const height = window.innerHeight || document.documentElement.clientHeight || 768;

        const maxLeft = width - PANEL_WIDTH;
        const maxTop = height - 40;

        // 如果配置的位置超出当前屏幕，强制拉回
        if (config.left > maxLeft) config.left = maxLeft - 10;
        if (config.left < 0) config.left = 10;
        if (config.top > maxTop) config.top = maxTop - 10;
        if (config.top < 0) config.top = 10;

        // 特殊情况：如果是默认配置（第一次加载），确保它真的在右边
        if (config === defaultConfig && config.left < width / 2) {
             config.left = width - PANEL_WIDTH - 20;
        }
    }

    // 初始检查
    enforceBoundaries();

    // ==========================================
    // Part 2: CSS 样式
    // ==========================================

    // 2.1 注入 Video.js 基础样式
    try {
        const videojsCss = GM_getResourceText('videojs_css');
        if (videojsCss) GM_addStyle(videojsCss);
    } catch (e) {
        console.warn('Video.js CSS loading failed:', e);
    }

    // 2.2 核心样式定义
    const css = `
        :root {
            --dark-opacity: ${config.opacity};
            --img-brightness: calc(1 - (var(--dark-opacity) / 100));
            --coomer-primary: #E0AA3E;
        }

        /* === 新增：屏蔽顶部菜单和公告横幅 (来自 TAhhhc) === */
        .header-link,
        #announcement-banner {
            display: none !important;
        }

        /* === 遮挡规则 (核心) === */
        /* 图片、原生视频、头像、缩略图、Video.js播放器 */
        .post-card__image-container img,
        .post-card__image-container video,
        .post__attachment img,
        .post__attachment video,
        .fileThumb img,
        .post-content img,
        .user-header__avatar,
        .user-header__image,
        .card-list__image,
        .fancy-image__image,
        .coomer-video-container,
        .video-js
        {
            filter: brightness(var(--img-brightness)) !important;
            transition: filter 0.25s ease !important;
            background-color: #000 !important;
            opacity: 1 !important;
        }

        /* === 交互规则：悬停恢复 === */
        .post-card__image-container img:hover,
        .post-card__image-container video:hover,
        .post__attachment img:hover,
        .post__attachment video:hover,
        .fileThumb img:hover,
        .post-content img:hover,
        .user-header__avatar:hover,
        .user-header__image:hover,
        .card-list__image:hover,
        .fancy-image__image:hover,
        .coomer-video-container:hover,
        .video-js:hover
        {
            filter: brightness(100%) !important;
        }

        /* === UI 面板样式 === */
        #coomer-safe-panel {
            position: fixed;
            width: ${PANEL_WIDTH}px;
            /* 这里的 left/top 仅作为 CSS 默认值，JS 会强制覆盖 */
            left: ${config.left}px;
            top: ${config.top}px;
            background: rgba(30, 30, 30, 0.95);
            color: #ccc;
            border-radius: 16px;
            z-index: 9999999;
            font-family: sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            border: 1px solid #555;
            user-select: none;
            overflow: hidden;
            font-size: 12px;
            transition: left 0.2s, top 0.2s;
        }
        #cmp-header {
            padding: 5px 10px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #222;
            border-bottom: 1px solid #444;
        }
        .safe-indicator {
            width: 8px;
            height: 8px;
            background: #ff4444;
            border-radius: 50%;
            margin-right: 6px;
        }
        #cmp-body { padding: 8px 10px; }
        input[type=range] {
            width: 100%; height: 4px; background: #555;
            border-radius: 2px; outline: none; accent-color: #ff4444; cursor: pointer;
        }
        #coomer-safe-panel.minimized #cmp-body { display: none; }
        #coomer-safe-panel.minimized { width: auto; min-width: 80px; }
        #coomer-safe-panel.minimized #cmp-header { border-bottom: none; background: transparent; }

        /* === Video.js 播放器美化 === */
        .coomer-video-container {
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            margin: 10px 0;
        }
        .coomer-video-container .video-js {
            width: 100%;
            border-radius: 8px;
        }

        /* 播放按钮完美居中修正 */
        .coomer-video-container .vjs-big-play-button {
            background: rgba(18, 18, 18, 0.8);
            border: 2px solid var(--coomer-primary, #E0AA3E);
            border-radius: 50%;
            /* 强制绝对居中 */
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            /* 清除默认边距干扰 */
            margin-top: 0 !important;
            margin-left: 0 !important;
            width: 2em;
            height: 2em;
            line-height: 2em;
        }
        .coomer-video-container .vjs-big-play-button:hover {
            background: var(--coomer-primary, #E0AA3E);
        }

        /* 控件栏 */
        .coomer-video-container .vjs-control-bar {
            background: rgba(18, 18, 18, 0.9);
        }
        .coomer-video-container .vjs-play-progress,
        .coomer-video-container .vjs-volume-level {
            background: var(--coomer-primary, #E0AA3E);
        }

        @media (max-width: 767px) {
            .coomer-video-container .vjs-control-bar { font-size: 12px; }
            .coomer-video-container .vjs-time-control { padding: 0 4px; min-width: auto; }
        }
    `;
    GM_addStyle(css);

    // ==========================================
    // Part 3: UI 逻辑
    // ==========================================
    function createUI() {
        if (document.getElementById('coomer-safe-panel')) return;

        // 创建前再次确认坐标，确保不跑偏
        enforceBoundaries();

        const panel = document.createElement('div');
        panel.id = 'coomer-safe-panel';
        if (config.minimized) panel.classList.add('minimized');

        // 【关键修复】创建 DOM 时强制写入 inline style，确保坐标生效
        panel.style.left = config.left + 'px';
        panel.style.top = config.top + 'px';

        panel.innerHTML = `
            <div id="cmp-header" title="双击折叠 / 拖动 / Ctrl+B 紧急复位">
                <div style="display:flex;align-items:center;">
                    <span class="safe-indicator"></span>
                    <span id="cmp-val-display" style="font-weight:bold; color:#fff;">${config.opacity}%</span>
                </div>
                <span style="font-size:10px; opacity:0.5;">▼</span>
            </div>
            <div id="cmp-body">
                <input type="range" id="cmp-slider" min="0" max="100" value="${config.opacity}">
            </div>
        `;
        document.body.appendChild(panel);

        const header = document.getElementById('cmp-header');
        const slider = document.getElementById('cmp-slider');
        const display = document.getElementById('cmp-val-display');

        slider.addEventListener('input', (e) => {
            updateOpacity(e.target.value);
        });

        header.addEventListener('dblclick', () => {
            panel.classList.toggle('minimized');
            config.minimized = panel.classList.contains('minimized');
            saveConfig();
        });

        // 拖动逻辑
        let isDragging = false, startX, startY, initLeft, initTop;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initLeft = panel.offsetLeft; initTop = panel.offsetTop;
            header.style.cursor = 'grabbing';
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            let newLeft = initLeft + (e.clientX - startX);
            let newTop = initTop + (e.clientY - startY);

            // 实时拖动也需要边界限制
            const maxLeft = (window.innerWidth || document.documentElement.clientWidth) - panel.offsetWidth;
            const maxTop = (window.innerHeight || document.documentElement.clientHeight) - panel.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                panel.style.transition = 'left 0.2s, top 0.2s';
                config.left = parseInt(panel.style.left);
                config.top = parseInt(panel.style.top);
                saveConfig();
            }
        });

        // 窗口大小改变时，自动吸附回屏幕内
        window.addEventListener('resize', () => {
             enforceBoundaries();
             panel.style.left = config.left + 'px';
             panel.style.top = config.top + 'px';
        });
    }

    function updateOpacity(val) {
        document.documentElement.style.setProperty('--dark-opacity', val);
        const display = document.getElementById('cmp-val-display');
        const slider = document.getElementById('cmp-slider');
        if(display) display.innerText = val + '%';
        if(slider) slider.value = val;
        config.opacity = val;
        saveConfig();
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    // 快捷键监听 (Ctrl+B)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            // 重置到右上角
            const safeW = getSafeWidth();
            config.opacity = 100;
            config.left = safeW - PANEL_WIDTH - 20;
            config.top = 20;
            config.minimized = false;

            updateOpacity(100);

            const panel = document.getElementById('coomer-safe-panel');
            if(panel) {
                panel.classList.remove('minimized');
                panel.style.left = config.left + 'px';
                panel.style.top = config.top + 'px';
            }
            saveConfig();
        }
    });

    GM_registerMenuCommand("⚡ 找回控制面板", () => {
        config = defaultConfig;
        // 强制重置坐标
        config.left = getSafeWidth() - PANEL_WIDTH - 20;
        config.top = 20;
        saveConfig();
        location.reload();
    });

    // ==========================================
    // Part 4: Video.js 播放器增强
    // ==========================================

    const AdBlockerLite = {
        init() {
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    const originalDefineProperty = Object.defineProperty;
                    Object.defineProperty = function(obj, prop, descriptor) {
                        if (prop === 'fluidPlayer' && obj === window) {
                            const originalGetter = descriptor.get;
                            const originalValue = descriptor.value;
                            const wrapper = function(...args) {
                                if (args[1]) {
                                    if(args[1].vastOptions) delete args[1].vastOptions;
                                    if(args[1].adList) args[1].adList = [];
                                }
                                const fn = originalGetter ? originalGetter() : originalValue;
                                return fn.apply(this, args);
                            };
                            if (originalGetter) descriptor.get = () => wrapper;
                            else descriptor.value = wrapper;
                        }
                        return originalDefineProperty.call(this, obj, prop, descriptor);
                    };
                })();
            `;
            document.documentElement.appendChild(script);
            script.remove();
        }
    };

    const VideoPlayerEnhancer = {
        playerCounter: 0,
        observer: null,

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        },

        setup() {
            this.replaceExistingPlayers();
            this.observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('fluid_video_wrapper')) {
                                this.replacePlayer(node);
                            } else if (node.querySelector) {
                                const fluidWrappers = node.querySelectorAll('.fluid_video_wrapper');
                                fluidWrappers.forEach((wrapper) => this.replacePlayer(wrapper));
                            }
                        }
                    }
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        },

        replaceExistingPlayers() {
            const fluidWrappers = document.querySelectorAll('.fluid_video_wrapper');
            fluidWrappers.forEach((wrapper) => this.replacePlayer(wrapper));
        },

        replacePlayer(fluidWrapper) {
            if (fluidWrapper._coomerReplaced) return;
            fluidWrapper._coomerReplaced = true;

            const originalVideo = fluidWrapper.querySelector('video');
            if (!originalVideo) return;

            const source = originalVideo.querySelector('source');
            const videoSrc = source?.src || originalVideo.src;
            if (!videoSrc) return;

            const computedStyle = window.getComputedStyle(fluidWrapper);
            const originalWidth = fluidWrapper.offsetWidth || computedStyle.width;

            const playerId = `coomer-player-${this.playerCounter++}`;
            const container = document.createElement('div');
            container.className = 'coomer-video-container';
            container.style.cssText = `
                width: ${typeof originalWidth === 'number' ? originalWidth + 'px' : originalWidth};
                max-width: 100%;
                margin: 0 auto;
            `;

            const videoElement = document.createElement('video');
            videoElement.id = playerId;
            videoElement.className = 'video-js vjs-big-play-centered';
            videoElement.setAttribute('controls', '');
            videoElement.setAttribute('preload', 'metadata');
            videoElement.setAttribute('playsinline', '');

            const sourceElement = document.createElement('source');
            sourceElement.src = videoSrc;
            sourceElement.type = 'video/mp4';
            videoElement.appendChild(sourceElement);

            container.appendChild(videoElement);
            fluidWrapper.parentNode.replaceChild(container, fluidWrapper);

            this.initVideoJs(playerId);
        },

        initVideoJs(playerId) {
            if (typeof videojs === 'undefined') {
                setTimeout(() => this.initVideoJs(playerId), 500);
                return;
            }

            const player = videojs(playerId, {
                fluid: true,
                responsive: true,
                controls: true,
                preload: 'metadata',
                playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
                userActions: { doubleClick: true, hotkeys: true },
                controlBar: {
                    children: [
                        'playToggle', 'skipBackward', 'skipForward',
                        'currentTimeDisplay', 'timeDivider', 'durationDisplay',
                        'progressControl', 'playbackRateMenuButton',
                        'volumePanel', 'pictureInPictureToggle', 'fullscreenToggle',
                    ],
                    skipButtons: { forward: 10, backward: 10 },
                },
            });

            player.ready(() => {
                const videoEl = player.el();
                videoEl.addEventListener('click', () => videoEl.focus());
                videoEl.addEventListener('keydown', (e) => {
                    switch (e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            player.currentTime(Math.max(0, player.currentTime() - 10));
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            player.volume(Math.min(1, player.volume() + 0.1));
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            player.volume(Math.max(0, player.volume() - 0.1));
                            break;
                    }
                });
            });
        }
    };

    // ==========================================
    // Part 5: 启动
    // ==========================================
    AdBlockerLite.init();
    if (document.body) createUI();
    else window.addEventListener('DOMContentLoaded', createUI);
    VideoPlayerEnhancer.init();

})();