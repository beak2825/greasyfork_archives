// ==UserScript==
// @name         抖音统一助手（视频下载 + 点赞助手）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  抖音视频下载和点赞助手的统一脚本，支持Tab切换、可拖拽面板、天蓝色渐变主题
// @author       hys
// @match        *://live.douyin.com/*
// @match        *://www.douyin.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562704/%E6%8A%96%E9%9F%B3%E7%BB%9F%E4%B8%80%E5%8A%A9%E6%89%8B%EF%BC%88%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%20%2B%20%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562704/%E6%8A%96%E9%9F%B3%E7%BB%9F%E4%B8%80%E5%8A%A9%E6%89%8B%EF%BC%88%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%20%2B%20%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 1. 配置管理 ==========
    const STORAGE_KEYS = {
        // UI状态
        'dy_unified_panel_collapsed': '面板折叠状态',
        'dy_unified_panel_position': '面板位置（JSON: {left, top}）',
        'dy_unified_active_tab': '当前激活Tab（download/like）',

        // 下载模块
        'dy_download_sniffer_enabled': '嗅探器启用状态',

        // 点赞模块
        'dy_like_max_count': '最大点赞数'
    };

    const ConfigManager = {
        get(key, defaultValue) {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : defaultValue;
        },

        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    // ========== 2. 工具函数 ==========
    function showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'dy-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function getBaseUrl(fullUrl) {
        try {
            const urlObj = new URL(fullUrl);
            return urlObj.origin + urlObj.pathname;
        } catch (e) {
            return fullUrl.split('?')[0];
        }
    }

    function extractVideoId(url) {
        try {
            const u = new URL(url);
            const pathParts = u.pathname.split('/').filter(Boolean);

            // 找到 tos-cn-ve-15c000-ce 后面的那一段
            const index = pathParts.findIndex(p => p.startsWith('tos-cn'));
            if (index !== -1 && pathParts[index + 1]) {
                return pathParts[index + 1];
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    function getVid(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('__vid');
        } catch (e) {
            return null;
        }
    }

    // ========== 3. 嗅探器模块 ==========
    const SnifferModule = {
        isInjected: false,

        inject() {
            if (this.isInjected) return;

            const injectSniffer = function() {
                const recentUrls = new Set();
                console.log('%c智能嗅探器启动...', 'color: #00ff00; font-weight: bold;');

                function isVideoUrl(url) {
                    if (!url) return false;
                    if (url.startsWith('blob:')) return false;
                    if (url.includes('.m3u8')) return false;

                    if (url.includes('media-')) {
                        return url.includes('media-video-hvc1');
                    }

                    return url.includes('mime_type=video_mp4') ||
                           (url.includes('.douyinvod.com') && url.includes('video'));
                }

                function notifyNewVideo(url) {
                    if (recentUrls.has(url)) return;
                    recentUrls.add(url);
                    if (recentUrls.size > 50) recentUrls.clear();

                    window.dispatchEvent(new CustomEvent('dy_video_captured', { detail: url }));
                }

                // 拦截 XHR
                const originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    xhr.open = function(method, url) {
                        if (isVideoUrl(url)) notifyNewVideo(url);
                        return originalOpen.apply(this, arguments);
                    };
                    return xhr;
                };

                // 拦截 Fetch
                const originalFetch = window.fetch;
                window.fetch = async function(...args) {
                    const [resource] = args;
                    let url = typeof resource === 'string' ? resource : resource.url;
                    if (isVideoUrl(url)) notifyNewVideo(url);
                    return originalFetch.apply(this, args);
                };
            };

            const script = document.createElement('script');
            script.textContent = `(${injectSniffer.toString()})();`;
            (document.head || document.documentElement).appendChild(script);
            script.remove();

            this.isInjected = true;
            console.log('嗅探器已注入');
        },

        remove() {
            if (!this.isInjected) return;
            // 由于无法直接移除注入的脚本，我们通过禁用事件监听来实现
            this.isInjected = false;
            console.log('嗅探器已禁用');
        }
    };

    // ========== 4. 下载模块 ==========
    const DownloadModule = {
        videoQueue: [],
        currentIndex: -1,
        seenVids: new Set(),
        snifferEnabled: true,

        render() {
            // 恢复嗅探器状态（默认启用监听）
            // 如果没有保存的配置，默认为 true（开启）
            this.snifferEnabled = ConfigManager.get('dy_download_sniffer_enabled', true);

            // 根据状态设置初始UI
            const toggleBtnHTML = this.snifferEnabled
                ? '<span class="icon">⏹</span><span class="text">停止监听</span>'
                : '<span class="icon">▶</span><span class="text">开始监听</span>';
            const toggleBtnClass = this.snifferEnabled
                ? 'dy-button dy-button-primary active'
                : 'dy-button dy-button-primary';
            const statusText = this.snifferEnabled ? '状态：监听中...' : '状态：未监听';
            const statusColor = this.snifferEnabled ? '#4caf50' : '#fff';

            const container = document.createElement('div');
            container.className = 'download-tab-content';
            container.innerHTML = `
                <div class="download-controls">
                    <button id="dy-sniffer-toggle" class="${toggleBtnClass}">
                        ${toggleBtnHTML}
                    </button>
                    <div class="sniffer-status" style="color: ${statusColor};">${statusText}</div>
                </div>

                <div class="video-preview-section">
                    <video id="dy-preview" controls playsinline></video>
                    <div class="dy-nav-row">
                        <button id="dy-prev" class="dy-button dy-button-secondary" disabled>⏮ 上一个</button>
                        <span id="dy-counter" class="dy-counter">0 / 0</span>
                        <button id="dy-next" class="dy-button dy-button-secondary" disabled>下一个 ⏭</button>
                    </div>
                </div>

                <div class="action-buttons">
                    <button id="dy-download-btn" class="dy-button dy-button-primary">
                        <span class="icon">⬇️</span>
                        <span class="text">浏览器下载</span>
                    </button>
                    <button id="dy-copy-btn" class="dy-button dy-button-secondary">
                        <span class="icon">📄</span>
                        <span class="text">复制链接</span>
                    </button>
                </div>

                <div id="dy-url-display" class="url-display">等待视频...</div>
            `;

            // 绑定事件
            container.querySelector('#dy-sniffer-toggle').addEventListener('click', () => this.toggleSniffer());
            container.querySelector('#dy-prev').addEventListener('click', () => this.prevVideo());
            container.querySelector('#dy-next').addEventListener('click', () => this.nextVideo());
            container.querySelector('#dy-download-btn').addEventListener('click', () => this.downloadVideo());
            container.querySelector('#dy-copy-btn').addEventListener('click', () => this.copyUrl());

            // 监听视频捕获事件
            window.addEventListener('dy_video_captured', (e) => this.handleVideoCaptured(e));

            // 如果启用了嗅探器，则注入
            if (this.snifferEnabled) {
                SnifferModule.inject();
            }

            return container;
        },

        toggleSniffer() {
            this.snifferEnabled = !this.snifferEnabled;
            ConfigManager.set('dy_download_sniffer_enabled', this.snifferEnabled);

            if (this.snifferEnabled) {
                SnifferModule.inject();
                showToast('视频监听已启用');
            } else {
                SnifferModule.remove();
                showToast('视频监听已关闭');
            }

            this.updateSnifferUI();
        },

        updateSnifferUI() {
            const toggleBtn = document.querySelector('#dy-sniffer-toggle');
            const statusEl = document.querySelector('.sniffer-status');

            if (toggleBtn && statusEl) {
                if (this.snifferEnabled) {
                    toggleBtn.innerHTML = '<span class="icon">⏹</span><span class="text">停止监听</span>';
                    toggleBtn.classList.add('active');
                    statusEl.textContent = '状态：监听中...';
                    statusEl.style.color = '#4caf50';
                } else {
                    toggleBtn.innerHTML = '<span class="icon">▶</span><span class="text">开始监听</span>';
                    toggleBtn.classList.remove('active');
                    statusEl.textContent = '状态：未监听';
                    statusEl.style.color = '#fff';
                }
            }
        },

        handleVideoCaptured(e) {
            const newUrl = e.detail;

            // 获取两种唯一标识
            const videoId = extractVideoId(newUrl);
            const vid = getVid(newUrl);

            // 双重去重校验：只要 __vid 相同 或 extractVideoId 相同，就认为是同一个视频
            let isDuplicate = false;

            // 检查 __vid 去重
            if (vid && this.seenVids.has(vid)) {
                isDuplicate = true;
            }

            // 检查 extractVideoId 去重（如果 __vid 未匹配）
            if (!isDuplicate && videoId && this.seenVids.has(videoId)) {
                isDuplicate = true;
            }

            // 如果是重复视频，直接返回
            if (isDuplicate) {
                return;
            }

            // 添加到去重集合
            if (vid) this.seenVids.add(vid);
            if (videoId) this.seenVids.add(videoId);

            // 基础URL去重
            const newBase = getBaseUrl(newUrl);
            let lastBase = "";
            if (this.videoQueue.length > 0) {
                lastBase = getBaseUrl(this.videoQueue[this.videoQueue.length - 1]);
            }

            if (newBase === lastBase) {
                return;
            }

            this.videoQueue.push(newUrl);

            // 自动初始化
            if (this.currentIndex === -1) {
                this.currentIndex = 0;
                this.renderVideo(0);
            } else {
                this.updateCounter();
                this.updateButtons();
                showToast(`已捕获新视频 (总数: ${this.videoQueue.length})`);
            }

            // 视频队列超过100个时自动清理前50个
            if (this.videoQueue.length > 100) {
                this.videoQueue.splice(0, 50);
                this.currentIndex -= 50;
                if (this.currentIndex < 0) this.currentIndex = 0;
                showToast('视频队列已清理');
            }
        },

        renderVideo(index) {
            if (index < 0 || index >= this.videoQueue.length) return;
            const url = this.videoQueue[index];

            const videoEl = document.querySelector('#dy-preview');
            if (videoEl) {
                videoEl.src = url;
                videoEl.volume = 0.5;
                videoEl.autoplay = false;
            }

            const urlDisplay = document.querySelector('#dy-url-display');
            if (urlDisplay) {
                urlDisplay.textContent = `[${index + 1}] ` + url.substring(0, 40) + "...";
                urlDisplay.style.color = "#4caf50";
            }

            this.updateCounter();
            this.updateButtons();
        },

        prevVideo() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.renderVideo(this.currentIndex);
            }
        },

        nextVideo() {
            if (this.currentIndex < this.videoQueue.length - 1) {
                this.currentIndex++;
                this.renderVideo(this.currentIndex);
            }
        },

        updateCounter() {
            const counter = document.querySelector('#dy-counter');
            if (counter) {
                counter.textContent = `${this.currentIndex === -1 ? 0 : this.currentIndex + 1} / ${this.videoQueue.length}`;
            }
        },

        updateButtons() {
            const prevBtn = document.querySelector('#dy-prev');
            const nextBtn = document.querySelector('#dy-next');

            if (prevBtn) {
                prevBtn.disabled = this.currentIndex <= 0;
            }

            if (nextBtn) {
                nextBtn.disabled = this.currentIndex >= this.videoQueue.length - 1;
            }
        },

        async downloadVideo() {
            const url = this.videoQueue[this.currentIndex];
            if (!url) {
                showToast('请先选择视频');
                return;
            }

            const btn = document.querySelector('#dy-download-btn');
            if (btn) {
                btn.innerHTML = '<span class="icon">⏳</span><span class="text">下载中...</span>';
                btn.disabled = true;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('网络请求失败');

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `douyin_${Date.now()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);

                showToast('下载成功');
            } catch (err) {
                showToast(`下载失败: ${err.message}`);
            } finally {
                if (btn) {
                    btn.innerHTML = '<span class="icon">⬇️</span><span class="text">浏览器下载</span>';
                    btn.disabled = false;
                }
            }
        },

        copyUrl() {
            const url = this.videoQueue[this.currentIndex];
            if (!url) {
                showToast('请先选择视频');
                return;
            }

            GM_setClipboard(url);
            showToast('已复制链接');
        }
    };

    // ========== 5. 点赞模块 ==========
    const LikeModule = {
        isLiking: false,
        totalNum: 0,
        maxLikes: 0,
        timeBox: null,

        render() {
            const container = document.createElement('div');
            container.className = 'like-tab-content';
            container.innerHTML = `
                <div class="like-stats">
                    <div class="stats-label">已点赞</div>
                    <div class="stats-number">0</div>
                </div>

                <button id="dy-like-toggle" class="dy-button dy-button-primary">开始点赞</button>

                <div class="like-settings">
                    <div class="setting-item">
                        <label class="setting-label">最大点赞数（0=无限制）</label>
                        <input type="number" id="dy-max-likes" class="setting-input" value="0" min="0" placeholder="输入最大点赞数">
                    </div>
                </div>

                <div class="like-info">点赞间隔：100-300ms 随机</div>
            `;

            // 绑定事件
            container.querySelector('#dy-like-toggle').addEventListener('click', () => this.toggleLike());
            container.querySelector('#dy-max-likes').addEventListener('change', (e) => this.setMaxLikes(e.target.value));

            // 恢复设置
            this.restoreSettings();

            return container;
        },

        toggleLike() {
            if (!this.isLiking) {
                this.startLiking();
            } else {
                this.stopLiking();
            }
        },

        startLiking() {
            const target = document.getElementsByClassName('PPcGIai7');
            if (!target || target.length === 0) {
                showToast('未找到点赞按钮，请进入直播间');
                return;
            }

            this.isLiking = true;
            this.totalNum = 0;
            this.updateStats();

            const btn = document.querySelector('#dy-like-toggle');
            if (btn) {
                btn.textContent = '停止点赞';
                btn.classList.add('active');
            }

            this.performLike();
        },

        stopLiking() {
            this.isLiking = false;
            if (this.timeBox) {
                clearTimeout(this.timeBox);
                this.timeBox = null;
            }

            const btn = document.querySelector('#dy-like-toggle');
            if (btn) {
                btn.textContent = '开始点赞';
                btn.classList.remove('active');
            }
        },

        performLike() {
            if (!this.isLiking) return;

            // 检查是否达到最大点赞数
            if (this.maxLikes > 0 && this.totalNum >= this.maxLikes) {
                this.stopLiking();
                showToast('已达到最大点赞数：' + this.maxLikes);
                return;
            }

            const target = document.getElementsByClassName('PPcGIai7');
            if (target && target.length > 0) {
                this.totalNum++;
                this.updateStats();
                target[0].click();

                // 使用随机延迟继续下一次点赞
                const delay = Math.floor(Math.random() * 200) + 100;
                this.timeBox = setTimeout(() => this.performLike(), delay);
            } else {
                showToast('点赞按钮不可用');
                this.stopLiking();
            }
        },

        updateStats() {
            const statsNumber = document.querySelector('.stats-number');
            if (statsNumber) {
                statsNumber.textContent = this.totalNum;
            }
        },

        setMaxLikes(value) {
            this.maxLikes = parseInt(value, 10) || 0;
            ConfigManager.set('dy_like_max_count', this.maxLikes);
        },

        restoreSettings() {
            // 恢复最大点赞数
            const savedMaxLikes = ConfigManager.get('dy_like_max_count', 0);
            this.maxLikes = savedMaxLikes;
            const maxLikesInput = document.querySelector('#dy-max-likes');
            if (maxLikesInput) {
                maxLikesInput.value = savedMaxLikes;
            }
        }
    };

    // ========== 6. Tab管理器 ==========
    const TabManager = {
        activeTab: 'download',

        switchTo(tabId) {
            this.activeTab = tabId;
            ConfigManager.set('dy_unified_active_tab', tabId);
            this.renderContent();
            this.updateTabUI();
        },

        renderContent() {
            const contentArea = document.querySelector('#dy-tab-content');
            if (!contentArea) return;

            // 清空内容
            contentArea.innerHTML = '';

            // 渲染对应Tab的内容
            let content;
            if (this.activeTab === 'download') {
                content = DownloadModule.render();
            } else {
                content = LikeModule.render();
            }

            contentArea.appendChild(content);
        },

        updateTabUI() {
            const tabItems = document.querySelectorAll('.tab-item');
            tabItems.forEach(item => {
                if (item.dataset.tab === this.activeTab) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    };

    // ========== 7. 拖拽管理器 ==========
    const DragManager = {
        init(panel, handle) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                panel.style.transition = 'none';
                panel.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                // 边界限制
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxX));
                newTop = Math.max(0, Math.min(newTop, maxY));

                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    panel.style.transition = '';
                    panel.style.cursor = 'move';

                    // 保存位置
                    const rect = panel.getBoundingClientRect();
                    ConfigManager.set('dy_unified_panel_position', {
                        left: rect.left,
                        top: rect.top
                    });
                }
            });
        }
    };

    // ========== 8. UI框架 ==========
    const UIFramework = {
        addStyles() {
            GM_addStyle(`
                /* 主容器 */
                .dy-unified-panel {
                    position: fixed;
                    z-index: 999999;
                    background: linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%);
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(30, 144, 255, 0.3);
                    min-width: 320px;
                    max-width: 360px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    overflow: hidden;
                }

                /* 标题栏 */
                .dy-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.15);
                    cursor: move;
                    user-select: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }

                .dy-title {
                    color: #fff;
                    font-size: 16px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .dy-title::before {
                    content: '🎵';
                    font-size: 18px;
                }

                .dy-collapse-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 12px;
                }

                .dy-collapse-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                /* Tab切换栏 */
                .dy-tab-bar {
                    display: flex;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 4px;
                    gap: 4px;
                }

                .tab-item {
                    flex: 1;
                    padding: 8px 12px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .tab-item:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                }

                .tab-item.active {
                    background: #fff;
                    color: #1E90FF;
                    font-weight: bold;
                }

                /* 内容区域 */
                .dy-tab-content {
                    padding: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                    background: rgba(255, 255, 255, 0.05);
                }

                .dy-tab-content::-webkit-scrollbar {
                    width: 6px;
                }

                .dy-tab-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                .dy-tab-content::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }

                /* 按钮样式 */
                .dy-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    width: 100%;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 8px;
                }

                .dy-button-primary {
                    background: rgba(255, 255, 255, 0.95);
                    color: #1E90FF;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .dy-button-primary:hover {
                    background: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .dy-button-primary.active {
                    background: #FF6B6B;
                    color: #fff;
                }

                .dy-button-primary.active:hover {
                    background: #FF5252;
                }

                .dy-button-secondary {
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .dy-button-secondary:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .dy-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .dy-button .icon {
                    font-size: 16px;
                }

                /* 下载模块特定样式 */
                .download-tab-content {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .download-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .sniffer-status {
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    padding: 4px 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                }

                .video-preview-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                #dy-preview {
                    width: 100%;
                    height: 180px;
                    background: #000;
                    border-radius: 8px;
                    object-fit: contain;
                }

                .dy-nav-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .dy-nav-row .dy-button-secondary {
                    flex: 1;
                    margin-bottom: 0;
                }

                .dy-counter {
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: bold;
                    min-width: 60px;
                    text-align: center;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-buttons .dy-button {
                    flex: 1;
                    margin-bottom: 0;
                }

                .url-display {
                    text-align: center;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    word-break: break-all;
                    max-height: 40px;
                    overflow: hidden;
                }

                /* 点赞模块特定样式 */
                .like-tab-content {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .like-stats {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                }

                .stats-label {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                    margin-bottom: 4px;
                }

                .stats-number {
                    color: #fff;
                    font-size: 28px;
                    font-weight: bold;
                }

                .like-settings {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .setting-label {
                    color: #fff;
                    font-size: 13px;
                    font-weight: 500;
                }

                .setting-input {
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 14px;
                    color: #333;
                    outline: none;
                }

                .setting-input:focus {
                    background: #fff;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
                }

                .setting-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .setting-checkbox:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .setting-checkbox input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }

                .setting-checkbox label {
                    color: #fff;
                    font-size: 13px;
                    cursor: pointer;
                    user-select: none;
                }

                .like-info {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 12px;
                    text-align: center;
                }

                /* 折叠状态 */
                .dy-unified-panel.collapsed .dy-tab-content {
                    display: none;
                }

                .dy-unified-panel.collapsed .dy-tab-bar {
                    display: none;
                }

                /* Toast提示 */
                .dy-toast {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-100px);
                    background: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1000000;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }

                .dy-toast.show {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }

                /* 响应式调整 */
                @media (max-width: 480px) {
                    .dy-unified-panel {
                        min-width: 280px;
                        max-width: 90vw;
                    }

                    .dy-tab-content {
                        max-height: 400px;
                    }

                    #dy-preview {
                        height: 150px;
                    }
                }
            `);
        },

        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'dy-unified-panel';
            panel.id = 'dy-unified-panel';

            // 恢复位置
            const savedPosition = ConfigManager.get('dy_unified_panel_position', null);
            if (savedPosition) {
                panel.style.left = savedPosition.left + 'px';
                panel.style.top = savedPosition.top + 'px';
            } else {
                panel.style.left = '20px';
                panel.style.top = '80px';
            }

            // 恢复折叠状态
            const isCollapsed = ConfigManager.get('dy_unified_panel_collapsed', false);
            if (isCollapsed) {
                panel.classList.add('collapsed');
            }

            panel.innerHTML = `
                <div class="dy-header">
                    <div class="dy-title">抖音统一助手</div>
                    <button class="dy-collapse-btn" id="dy-collapse-btn">${isCollapsed ? '▲' : '▼'}</button>
                </div>
                <div class="dy-tab-bar">
                    <button class="tab-item" data-tab="download">视频下载</button>
                    <button class="tab-item" data-tab="like">点赞助手</button>
                </div>
                <div class="dy-tab-content" id="dy-tab-content"></div>
            `;

            // 绑定折叠按钮事件
            const collapseBtn = panel.querySelector('#dy-collapse-btn');
            collapseBtn.addEventListener('click', () => {
                panel.classList.toggle('collapsed');
                const isCollapsedNow = panel.classList.contains('collapsed');
                collapseBtn.textContent = isCollapsedNow ? '▲' : '▼';
                ConfigManager.set('dy_unified_panel_collapsed', isCollapsedNow);
            });

            // 绑定Tab切换事件
            const tabItems = panel.querySelectorAll('.tab-item');
            tabItems.forEach(item => {
                item.addEventListener('click', () => {
                    TabManager.switchTo(item.dataset.tab);
                });
            });

            return panel;
        },

        bindEvents(panel) {
            // 拖拽功能
            const header = panel.querySelector('.dy-header');
            DragManager.init(panel, header);
        }
    };

    // ========== 9. 主应用初始化 ==========
    const App = {
        init() {
            // 添加样式
            UIFramework.addStyles();

            // 创建面板
            const panel = UIFramework.createPanel();
            document.body.appendChild(panel);

            // 绑定事件
            UIFramework.bindEvents(panel);

            // 恢复激活的Tab
            const activeTab = ConfigManager.get('dy_unified_active_tab', 'download');
            TabManager.switchTo(activeTab);

            console.log('抖音统一助手已初始化');
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();
