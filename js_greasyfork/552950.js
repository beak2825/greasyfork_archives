// ==UserScript==
// @name         糖心视频播放器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  UI/性能优化：可拖拽面板、SVG图标、API缓存；修复DPlayer兼容问题、优化播放失败提示；支持多站点、SPA 路由、倍速播放、复制链接、去广告。
// @match        *://txh057.com/*
// @match        *://*.txh066.com/*
// @match        *://*.567t0.com/*
// @match        *://*.air09.com/*
// @match        *://*.4w4v3.com/*
// @match        *://*.7soxb.com/*
// @match        *://*.qbhlx.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://fastly.jsdelivr.net/npm/hls.js@1.5.8
// @require      https://fastly.jsdelivr.net/npm/dplayer@1.27.1/dist/DPlayer.min.js
// @icon        https://txh066.com/favicon.ico
// @license GNU LGPLv3
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552950/%E7%B3%96%E5%BF%83%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552950/%E7%B3%96%E5%BF%83%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @description 集中化配置，方便统一管理和修改
     */
    const CONFIG = {
        SCRIPT_NAME: '[视频播放助手]',
        SCRIPT_VERSION: '3.9.5',
        API_ENDPOINT: 'http://110.41.171.207:8000/get-video-info', // 建议服务器支持并切换到 HTTPS
        API_KEY: '8d5a2907df0a41938372f758',
        AD_SELECTORS: [
            '.van-dialog', '.ad-apps', '.android-ad',
            '.my-swipe', '.drag-area', '.new', '.control'
        ].join(','),
        MOVIE_PATHS: ['/movie', '/play/video'],
    };

    /**
     * @description SVG 图标，用于替换 Emoji，保证跨平台显示一致且更专业
     */
    const ICONS = {
        play: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M8 5v14l11-7z"></path></svg>`,
        pause: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`,
        copy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`,
        loading: `<div class="loading-spinner"></div>`,
        success: `✅`
    };

    console.log(`${CONFIG.SCRIPT_NAME} 脚本已加载并运行 (v${CONFIG.SCRIPT_VERSION})。`);

    // ---------- [性能优化] 移除 MutationObserver ----------
    // 完全依赖下面的 CSS 规则进行广告拦截，效率更高，资源占用更少。

    // ---------- 工具 ----------
    const U = {
        isMoviePath() {
            try {
                const path = unsafeWindow.location.pathname;
                return CONFIG.MOVIE_PATHS.some(p => path.startsWith(p));
            } catch (e) {
                const path = location.pathname;
                return CONFIG.MOVIE_PATHS.some(p => path.startsWith(p));
            }
        },
        getSource() {
            const hostname = location.hostname;
            if (hostname.includes('txh066.com')) return 'tx';
            if (hostname.includes('567t0.com') || hostname.includes('qbhlx.com') || hostname.includes('7soxb.com')) return 'hx';
            return 'unknown';
        },
        onReady(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn, { once: true });
            } else {
                fn();
            }
        },
        debounce(fn, wait = 100) {
            let t;
            return function () {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, arguments), wait);
            };
        }
    };

    // ---------- [UI优化] 样式 ----------
    GM_addStyle(`
        /* [UI] 面板使用 left/top 定位，以支持自由拖拽 */
        #video-helper {
            position: fixed;
            top: 20%;
            left: calc(100% - 300px); /* 初始位置模拟 right:0 */
            z-index: 9999;
            background: #fff;
            padding: 15px;
            width: 280px;
            border-radius: 8px; /* 四角圆角更美观 */
            border: 1px solid #e1e4e8;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); /* 阴影更柔和 */
            font-family: system-ui, sans-serif;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateX(320px); /* 初始状态隐藏在屏幕右侧外 */
            opacity: 0;
            pointer-events: none; /* 隐藏时不允许交互 */
        }
        /* [UI] active 状态控制显示，transform 动画性能更好 */
        #video-helper.active {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
        }
        /* [UI] 拖拽手柄样式，提示用户此区域可拖动 */
        .helper-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
            cursor: move;
        }
        .helper-title { font-size: 16px; font-weight: 600; color: #2c3e50; margin: 0; }
        .toggle-btn {
            position: fixed; top: 20%; right: 0; width: 30px; height: 60px;
            background: linear-gradient(to right, #4CAF50, #2E7D32); color: #fff;
            border: none; border-radius: 8px 0 0 8px; cursor: pointer; z-index: 10000;
            display: flex; align-items: center; justify-content: center; font-weight: 700;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.1);
        }
        .toggle-btn:hover { background: linear-gradient(to right, #2E7D32, #1B5E20); }
        .video-btn {
            display: flex; align-items: center; justify-content: center; width: 100%;
            padding: 10px; margin-bottom: 8px; border: none; border-radius: 6px;
            cursor: pointer; font-weight: 500; background: linear-gradient(to right, #4CAF50, #2E7D32);
            color: #fff; box-shadow: 0 2px 5px rgba(76,175,80,0.3); transition: all 0.2s;
        }
        .video-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(76,175,80,0.4); }
        .video-btn:disabled { cursor: not-allowed; filter: grayscale(50%); }
        /* [UI] flex 布局让 SVG 图标垂直居中 */
        .video-btn .btn-icon { margin-right: 8px; display: inline-flex; align-items: center; }
        #video-container { width: 100%; margin-top: 10px; }
        #dplayer-container { width: 100%; border-radius: 4px; }
        .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .copy-link-btn { background: linear-gradient(to right, #6c757d, #5a6268); }
        .copy-link-btn:hover { background: linear-gradient(to right, #5a6268, #495057); }

        /* [性能] 以下 CSS 规则已足够强大，无需 MutationObserver */
        ${CONFIG.AD_SELECTORS} {
            position: absolute !important; top: -9999px !important; left: -9999px !important;
            pointer-events: none !important; opacity: 0 !important; z-index: -99999 !important;
        }
        html .van-overflow-hidden, body { overflow: auto !important; }
        .bg-page .main.blur { filter: blur(0px) !important; }
    `);

    // ---------- App ----------
    const App = {
        mounted: false,
        hls: null,
        dplayer: null,
        apiCache: new Map(), // [新增] 用于缓存 API 请求结果，提升重复访问速度

        mount() {
            if (this.mounted) return;
            if (!U.isMoviePath()) return;

            const ensure = () => {
                this.unmount();
                console.log(`${CONFIG.SCRIPT_NAME} 正在挂载组件于:`, location.pathname);
                let currentM3u8Url = null;

                const panel = document.createElement('div');
                panel.id = 'video-helper';
                const source = U.getSource();

                panel.innerHTML = `
                    <div class="helper-header"><h3 class="helper-title">视频播放助手</h3></div>
                    <button class="video-btn"><span class="btn-icon">${ICONS.play}</span>播放视频</button>
                    <button class="video-btn copy-link-btn" style="display: none;"><span class="btn-icon">${ICONS.copy}</span>复制链接</button>
                    <div id="video-container" style="display: none;">
                        <div id="dplayer-container"></div>
                    </div>`;
                document.body.appendChild(panel);

                const playBtn = panel.querySelector('.video-btn');
                const copyBtn = panel.querySelector('.copy-link-btn');
                const videoContainer = panel.querySelector('#video-container');
                const dplayerContainer = panel.querySelector('#dplayer-container');

                // ---------- [新增] 面板拖拽逻辑 ----------
                const header = panel.querySelector('.helper-header');
                let isDragging = false, startX, startY, startLeft, startTop;

                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    const rect = panel.getBoundingClientRect();
                    startLeft = rect.left;
                    startTop = rect.top;
                    panel.style.transition = 'none'; // 拖拽时禁用过渡动画，防止卡顿
                    document.body.style.userSelect = 'none'; // 拖拽时禁止选择页面文本
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    panel.style.left = `${startLeft + dx}px`;
                    panel.style.top = `${startTop + dy}px`;
                });

                document.addEventListener('mouseup', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; // 恢复动画
                    document.body.style.userSelect = ''; // 恢复文本选择
                });
                // ---------------------------------------------

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'toggle-btn';
                toggleBtn.textContent = '▶';
                toggleBtn.title = '打开视频面板';
                document.body.appendChild(toggleBtn);

                toggleBtn.addEventListener('click', () => {
                    panel.classList.toggle('active');
                    const isActive = panel.classList.contains('active');
                    toggleBtn.textContent = isActive ? '◀' : '▶';
                    toggleBtn.title = isActive ? '关闭视频面板' : '打开视频面板';
                    if (!isActive && App.dplayer) {
                        try {
                            App.dplayer.pause();
                        } catch (e) {
                            console.warn(`${CONFIG.SCRIPT_NAME} 暂停视频失败`, e);
                        }
                    }
                });

                function getVideoId() {
                    const match = location.pathname.match(/\/movie\/detail\/(\d+)/) || location.pathname.match(/\/video\/(\d+)/);
                    return match ? match[1] : null;
                }

                /**
                 * @description [优化] 增加缓存逻辑的 API 请求函数
                 */
                function fetchPlayLink(videoId, callback) {
                    // 1. 优先从缓存中读取
                    if (App.apiCache.has(videoId)) {
                        console.log(`${CONFIG.SCRIPT_NAME} 从缓存命中 m3u8 链接。`);
                        setTimeout(() => callback(null, App.apiCache.get(videoId)), 100); // 模拟异步
                        return;
                    }

                    // 2. 缓存未命中，发起网络请求
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: CONFIG.API_ENDPOINT,
                        timeout: 10000,
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({ source: source, video_id: videoId, api_key: CONFIG.API_KEY }),
                        onload: function (res) {
                            // [优化] 使用 try-catch 包裹 JSON 解析，增强健壮性
                            try {
                                const outerJson = JSON.parse(res.responseText);
                                const responseData = JSON.parse(outerJson.data);

                                if (responseData.success && responseData.playLink) {
                                    // 3. 请求成功，将结果存入缓存
                                    console.log(`${CONFIG.SCRIPT_NAME} 获取 m3u8 链接成功并已缓存。`);
                                    App.apiCache.set(videoId, responseData.playLink);
                                    callback(null, responseData.playLink);
                                } else {
                                    callback(new Error(responseData.error || "获取视频失败"));
                                }
                            } catch (e) {
                                console.error(`${CONFIG.SCRIPT_NAME} 解析服务器响应失败`, e, res.responseText);
                                callback(new Error("解析服务器响应失败，请检查控制台。"));
                            }
                        },
                        onerror: callback,
                        ontimeout: () => callback(new Error("请求超时")),
                    });
                }

                copyBtn.addEventListener('click', () => {
                    if (!currentM3u8Url) return;
                    navigator.clipboard.writeText(currentM3u8Url).then(() => {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = `<span class="btn-icon">${ICONS.success}</span>复制成功!`;
                        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
                    }).catch(err => {
                        alert('复制失败！请手动复制控制台链接。');
                    });
                });

                playBtn.addEventListener('click', () => {
                    if (videoContainer.style.display === 'none') {
                        if (currentM3u8Url) {
                            videoContainer.style.display = 'block';
                            App.dplayer.play();
                            playBtn.innerHTML = `<span class="btn-icon">${ICONS.pause}</span>隐藏视频`;
                        } else {
                            const videoId = getVideoId();
                            if (!videoId) return alert("未找到视频ID");

                            playBtn.innerHTML = `<span class="btn-icon">${ICONS.loading}</span>加载中...`;
                            playBtn.disabled = true;

                            fetchPlayLink(videoId, (err, m3u8Url) => {
                                playBtn.disabled = false;
                                if (err) {
                                    alert("视频加载失败: " + err.message);
                                    playBtn.innerHTML = `<span class="btn-icon">${ICONS.play}</span>播放视频`;
                                    currentM3u8Url = null;
                                    copyBtn.style.display = 'none';
                                    return;
                                }
                                videoContainer.style.display = 'block';
                                currentM3u8Url = m3u8Url;
                                playBtn.innerHTML = `<span class="btn-icon">${ICONS.pause}</span>隐藏视频`;
                                copyBtn.style.display = 'flex';

                                if (App.dplayer) App.dplayer.destroy();
                                const dplayerOptions = {
                                    container: dplayerContainer,
                                    autoplay: true,
                                    video: { url: m3u8Url, type: 'hls' },
                                    playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
                                    danmaku: false,
                                    hotkey: true,
                                    volume: 0.7
                                };

                                if (Hls.isSupported()) {
                                    App.dplayer = new DPlayer(dplayerOptions);
                                } else if (document.createElement('video').canPlayType('application/vnd.apple.mpegurl')) {
                                    App.dplayer = new DPlayer(dplayerOptions); // Safari 原生支持
                                } else {
                                    alert('您的浏览器不支持播放此视频格式');
                                }
                            });
                        }
                    } else {
                        videoContainer.style.display = 'none';
                        playBtn.innerHTML = `<span class="btn-icon">${ICONS.play}</span>播放视频`;
                        try { App.dplayer.pause(); } catch (e) { }
                    }
                });
                this.mounted = true;
            };
            if (!document.body) U.onReady(ensure);
            else ensure();
        },

        unmount() {
            if (!this.mounted) return;
            if (this.dplayer) { try { this.dplayer.destroy(); } catch (e) { } this.dplayer = null; }
            if (this.hls) { try { this.hls.destroy(); } catch (e) { } this.hls = null; }
            const panel = document.getElementById('video-helper');
            if (panel) panel.remove();
            const toggle = document.querySelector('.toggle-btn');
            if (toggle) toggle.remove();
            this.mounted = false;
        },

        update() {
            if (U.isMoviePath()) this.mount();
            else this.unmount();
        }
    };

    // ---------- SPA 路由监听 ----------
    (function routeWatcher() {
        let lastHref;
        const getHref = () => { try { return unsafeWindow.location.href; } catch (e) { return location.href; } };
        const check = U.debounce(() => {
            const href = getHref();
            if (href !== lastHref) {
                lastHref = href;
                App.update();
            }
        }, 50);
        lastHref = getHref();
        App.update();

        const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        ['pushState', 'replaceState'].forEach((m) => {
            const raw = w.history[m];
            if (typeof raw === 'function') {
                w.history[m] = function () {
                    const ret = raw.apply(this, arguments);
                    setTimeout(check, 0);
                    return ret;
                };
            }
        });
        w.addEventListener('popstate', check, true);
        w.addEventListener('hashchange', check, true);
        setInterval(check, 1500); // 保留轮询作为兜底方案
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest && e.target.closest('a[href]')) {
                setTimeout(check, 0);
            }
        }, true);
    })();
})();