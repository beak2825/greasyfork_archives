// ==UserScript==
// @name         全能下载工具 - Universal Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  突破网站限制，下载所有类型的媒体资源（视频、音频、图片、文档等），支持质量选择和自定义保存路径
// @author       WeiRuan
// @match        *://*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-end
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/561474/%E5%85%A8%E8%83%BD%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%20-%20Universal%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561474/%E5%85%A8%E8%83%BD%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%20-%20Universal%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    const CONFIG = {
        savePath: GM_getValue('savePath', ''),
        autoDetect: GM_getValue('autoDetect', true),
        showNotification: GM_getValue('showNotification', true),
        defaultQuality: GM_getValue('defaultQuality', 'high')
    };

    // ==================== 资源检测器 ====================
    class ResourceDetector {
        constructor() {
            this.detectedResources = new Map();
            this.observers = [];
            this.init();
        }

        init() {
            this.detectExistingResources();
            this.interceptNetworkRequests();
            this.observeDOMChanges();
            this.interceptMediaElements();
            this.initSiteSpecificHandlers();
        }

        // 初始化网站特定处理
        initSiteSpecificHandlers() {
            const handlers = new SiteHandlers();
            handlers.init(this);
        }

        // 检测现有资源
        detectExistingResources() {
            // 检测视频元素
            document.querySelectorAll('video').forEach(video => {
                this.addResource({
                    type: 'video',
                    url: video.src || video.currentSrc,
                    element: video,
                    qualities: this.extractVideoQualities(video)
                });
            });

            // 检测音频元素
            document.querySelectorAll('audio').forEach(audio => {
                this.addResource({
                    type: 'audio',
                    url: audio.src || audio.currentSrc,
                    element: audio
                });
            });

            // 检测图片
            document.querySelectorAll('img').forEach(img => {
                if (img.src && !img.src.startsWith('data:')) {
                    this.addResource({
                        type: 'image',
                        url: img.src,
                        element: img
                    });
                }
            });

            // 检测链接资源
            document.querySelectorAll('a[href]').forEach(link => {
                const href = link.href;
                const ext = this.getFileExtension(href);
                if (this.isDownloadableFile(ext)) {
                    this.addResource({
                        type: this.getFileType(ext),
                        url: href,
                        element: link,
                        filename: link.download || this.getFilenameFromUrl(href)
                    });
                }
            });
        }

        // 拦截网络请求
        interceptNetworkRequests() {
            const originalFetch = window.fetch;
            const originalXHR = window.XMLHttpRequest.prototype.open;
            const self = this;

            // 拦截 Fetch
            window.fetch = function(...args) {
                const url = args[0];
                if (typeof url === 'string') {
                    self.analyzeUrl(url);
                }
                return originalFetch.apply(this, args);
            };

            // 拦截 XHR
            window.XMLHttpRequest.prototype.open = function(method, url) {
                self.analyzeUrl(url);
                return originalXHR.apply(this, arguments);
            };
        }

        // 监听DOM变化
        observeDOMChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                                this.handleMediaElement(node);
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('video, audio, img').forEach(el => {
                                    this.handleMediaElement(el);
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.observers.push(observer);
        }

        // 拦截媒体元素
        interceptMediaElements() {
            const self = this;

            // 劫持 video 和 audio 的 src 设置
            ['HTMLVideoElement', 'HTMLAudioElement'].forEach(elementType => {
                if (window[elementType]) {
                    const originalSetSrc = Object.getOwnPropertyDescriptor(window[elementType].prototype, 'src').set;
                    Object.defineProperty(window[elementType].prototype, 'src', {
                        set: function(value) {
                            self.addResource({
                                type: elementType === 'HTMLVideoElement' ? 'video' : 'audio',
                                url: value,
                                element: this
                            });
                            return originalSetSrc.call(this, value);
                        },
                        get: function() {
                            return Object.getOwnPropertyDescriptor(window[elementType].prototype, 'src').get.call(this);
                        }
                    });
                }
            });
        }

        // 处理媒体元素
        handleMediaElement(element) {
            const type = element.tagName.toLowerCase();
            const url = element.src || element.currentSrc;

            if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
                this.addResource({
                    type: type,
                    url: url,
                    element: element,
                    qualities: type === 'video' ? this.extractVideoQualities(element) : null
                });
            }

            // 检查 source 子元素
            element.querySelectorAll('source').forEach(source => {
                if (source.src) {
                    this.addResource({
                        type: type,
                        url: source.src,
                        element: element,
                        quality: source.dataset.quality || source.label
                    });
                }
            });
        }

        // 分析 URL
        analyzeUrl(url) {
            if (!url || url.startsWith('data:')) return;

            const ext = this.getFileExtension(url);
            const type = this.getFileType(ext);

            if (type) {
                this.addResource({
                    type: type,
                    url: url,
                    filename: this.getFilenameFromUrl(url)
                });
            }

            // 检测常见视频平台的 m3u8 和 mpd
            if (url.includes('.m3u8') || url.includes('.mpd')) {
                this.addResource({
                    type: 'video',
                    url: url,
                    format: url.includes('.m3u8') ? 'HLS' : 'DASH'
                });
            }
        }

        // 提取视频质量选项
        extractVideoQualities(video) {
            const qualities = [];

            // 检查 source 元素
            video.querySelectorAll('source').forEach(source => {
                qualities.push({
                    url: source.src,
                    quality: source.dataset.quality || source.label || 'unknown',
                    type: source.type
                });
            });

            // 检查视频本身
            if (video.src) {
                qualities.push({
                    url: video.src,
                    quality: 'default',
                    type: video.type
                });
            }

            return qualities.length > 0 ? qualities : null;
        }

        // 添加资源
        addResource(resource) {
            if (!resource.url || resource.url.startsWith('data:')) return;

            const key = resource.url;
            if (!this.detectedResources.has(key)) {
                this.detectedResources.set(key, {
                    ...resource,
                    detectedAt: Date.now()
                });

                if (CONFIG.showNotification) {
                    console.log('检测到资源:', resource);
                }
            }
        }

        // 获取文件扩展名
        getFileExtension(url) {
            try {
                const urlObj = new URL(url, window.location.href);
                const pathname = urlObj.pathname;
                const match = pathname.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
                return match ? match[1].toLowerCase() : '';
            } catch (e) {
                return '';
            }
        }

        // 判断是否为可下载文件
        isDownloadableFile(ext) {
            const downloadableExts = [
                // 视频
                'mp4', 'webm', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'm4v',
                // 音频
                'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma',
                // 图片
                'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
                // 文档
                'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
                // 压缩文件
                'zip', 'rar', '7z', 'tar', 'gz',
                // 其他
                'exe', 'dmg', 'apk', 'iso'
            ];
            return downloadableExts.includes(ext);
        }

        // 获取文件类型
        getFileType(ext) {
            const typeMap = {
                video: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'm4v'],
                audio: ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'],
                image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
                document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
                archive: ['zip', 'rar', '7z', 'tar', 'gz'],
                other: ['exe', 'dmg', 'apk', 'iso']
            };

            for (const [type, exts] of Object.entries(typeMap)) {
                if (exts.includes(ext)) {
                    return type;
                }
            }
            return null;
        }

        // 从 URL 获取文件名
        getFilenameFromUrl(url) {
            try {
                const urlObj = new URL(url, window.location.href);
                const pathname = urlObj.pathname;
                return pathname.split('/').pop() || 'download';
            } catch (e) {
                return 'download';
            }
        }

        // 获取所有检测到的资源
        getAllResources() {
            return Array.from(this.detectedResources.values());
        }

        // 清理
        destroy() {
            this.observers.forEach(observer => observer.disconnect());
            this.detectedResources.clear();
        }
    }

    // ==================== 下载管理器 ====================
    class DownloadManager {
        constructor() {
            this.downloads = [];
        }

        // 下载资源
        async download(resource, options = {}) {
            const {
                quality = CONFIG.defaultQuality,
                filename = resource.filename || this.generateFilename(resource),
                onProgress = null,
                onComplete = null,
                onError = null
            } = options;

            try {
                // 选择质量
                let downloadUrl = resource.url;
                if (resource.qualities && resource.qualities.length > 0) {
                    downloadUrl = this.selectQuality(resource.qualities, quality);
                }

                // 处理特殊格式
                if (resource.format === 'HLS' || resource.format === 'DASH') {
                    this.notify('提示', 'HLS/DASH 格式需要特殊处理，将尝试下载');
                }

                // 使用 GM_xmlhttpRequest 下载
                await this.downloadWithGM(downloadUrl, filename, {
                    onProgress,
                    onComplete,
                    onError
                });

            } catch (error) {
                console.error('下载失败:', error);
                if (onError) onError(error);
                this.notify('下载失败', error.message);
            }
        }

        // 使用 GM_xmlhttpRequest 下载
        downloadWithGM(url, filename, callbacks = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onprogress: (progress) => {
                        if (callbacks.onProgress && progress.lengthComputable) {
                            const percent = (progress.loaded / progress.total) * 100;
                            callbacks.onProgress(percent);
                        }
                    },
                    onload: (response) => {
                        try {
                            const blob = response.response;
                            const downloadUrl = URL.createObjectURL(blob);

                            // 创建下载链接
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            // 清理
                            setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

                            this.notify('下载完成', filename);
                            if (callbacks.onComplete) callbacks.onComplete();
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        if (callbacks.onError) callbacks.onError(error);
                        reject(error);
                    }
                });
            });
        }

        // 选择质量
        selectQuality(qualities, preferredQuality) {
            if (qualities.length === 1) {
                return qualities[0].url;
            }

            // 质量优先级
            const qualityMap = {
                'high': ['1080p', '1080', '720p', '720', '480p', '480', '360p', '360'],
                'medium': ['720p', '720', '480p', '480', '360p', '360', '1080p', '1080'],
                'low': ['360p', '360', '480p', '480', '720p', '720']
            };

            const priorities = qualityMap[preferredQuality] || qualityMap['high'];

            for (const priority of priorities) {
                const found = qualities.find(q =>
                    q.quality && q.quality.toLowerCase().includes(priority)
                );
                if (found) return found.url;
            }

            return qualities[0].url;
        }

        // 生成文件名
        generateFilename(resource) {
            const timestamp = new Date().getTime();
            const ext = this.getExtFromUrl(resource.url) || this.getExtFromType(resource.type);
            const title = document.title.slice(0, 50).replace(/[\/\\:*?"<>|]/g, '-');
            return `${title}_${timestamp}.${ext}`;
        }

        // 从 URL 获取扩展名
        getExtFromUrl(url) {
            try {
                const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
                return match ? match[1] : null;
            } catch (e) {
                return null;
            }
        }

        // 从类型获取扩展名
        getExtFromType(type) {
            const extMap = {
                video: 'mp4',
                audio: 'mp3',
                image: 'jpg',
                document: 'pdf',
                archive: 'zip',
                other: 'bin'
            };
            return extMap[type] || 'bin';
        }

        // 通知
        notify(title, message) {
            if (CONFIG.showNotification && typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: title,
                    text: message,
                    timeout: 3000
                });
            }
        }
    }

    // ==================== 用户界面 ====================
    class DownloaderUI {
        constructor(detector, downloader) {
            this.detector = detector;
            this.downloader = downloader;
            this.panel = null;
            this.init();
        }

        init() {
            this.createStyles();
            this.createPanel();
            this.createFloatingButton();
            this.registerMenuCommands();
        }

        // 创建样式
        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .ud-floating-btn {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    cursor: pointer;
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .ud-floating-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                }
                .ud-panel {
                    position: fixed;
                    right: -400px;
                    top: 0;
                    width: 400px;
                    height: 100%;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.3);
                    z-index: 1000000;
                    transition: right 0.3s;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .ud-panel.show {
                    right: 0;
                }
                .ud-panel-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    font-size: 18px;
                    font-weight: bold;
                }
                .ud-panel-close {
                    float: right;
                    cursor: pointer;
                    font-size: 24px;
                }
                .ud-panel-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                }
                .ud-resource-item {
                    background: #f5f5f5;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 10px;
                    transition: background 0.2s;
                }
                .ud-resource-item:hover {
                    background: #e8e8e8;
                }
                .ud-resource-type {
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin-bottom: 8px;
                }
                .ud-resource-url {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                    word-break: break-all;
                    max-height: 40px;
                    overflow: hidden;
                }
                .ud-resource-actions {
                    display: flex;
                    gap: 8px;
                }
                .ud-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: opacity 0.2s;
                }
                .ud-btn:hover {
                    opacity: 0.8;
                }
                .ud-btn-primary {
                    background: #667eea;
                    color: white;
                }
                .ud-btn-secondary {
                    background: #ddd;
                    color: #333;
                }
                .ud-quality-selector {
                    margin-top: 8px;
                }
                .ud-quality-selector select {
                    width: 100%;
                    padding: 6px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .ud-settings {
                    padding: 15px;
                    border-top: 1px solid #ddd;
                }
                .ud-setting-item {
                    margin-bottom: 12px;
                }
                .ud-setting-label {
                    font-size: 13px;
                    color: #333;
                    margin-bottom: 6px;
                }
                .ud-setting-input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .ud-empty {
                    text-align: center;
                    color: #999;
                    padding: 40px 20px;
                }
            `;
            document.head.appendChild(style);
        }

        // 创建浮动按钮
        createFloatingButton() {
            const btn = document.createElement('div');
            btn.className = 'ud-floating-btn';
            btn.innerHTML = '⬇';
            btn.title = '全能下载工具';
            btn.onclick = () => this.togglePanel();
            document.body.appendChild(btn);
        }

        // 创建面板
        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'ud-panel';
            panel.innerHTML = `
                <div class="ud-panel-header">
                    <span class="ud-panel-close">×</span>
                    全能下载工具
                </div>
                <div class="ud-panel-body">
                    <div class="ud-resources-list"></div>
                </div>
                <div class="ud-settings">
                    <div class="ud-setting-item">
                        <div class="ud-setting-label">默认质量:</div>
                        <select class="ud-setting-input" id="ud-default-quality">
                            <option value="high">高质量</option>
                            <option value="medium">中等质量</option>
                            <option value="low">低质量</option>
                        </select>
                    </div>
                    <button class="ud-btn ud-btn-primary" style="width: 100%;" id="ud-refresh">
                        刷新资源列表
                    </button>
                </div>
            `;

            document.body.appendChild(panel);
            this.panel = panel;

            // 绑定事件
            panel.querySelector('.ud-panel-close').onclick = () => this.hidePanel();
            panel.querySelector('#ud-refresh').onclick = () => this.refreshResources();

            const qualitySelect = panel.querySelector('#ud-default-quality');
            qualitySelect.value = CONFIG.defaultQuality;
            qualitySelect.onchange = (e) => {
                CONFIG.defaultQuality = e.target.value;
                GM_setValue('defaultQuality', e.target.value);
            };
        }

        // 切换面板
        togglePanel() {
            if (this.panel.classList.contains('show')) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        }

        // 显示面板
        showPanel() {
            this.panel.classList.add('show');
            this.refreshResources();
        }

        // 隐藏面板
        hidePanel() {
            this.panel.classList.remove('show');
        }

        // 刷新资源列表
        refreshResources() {
            const resources = this.detector.getAllResources();
            const container = this.panel.querySelector('.ud-resources-list');

            if (resources.length === 0) {
                container.innerHTML = '<div class="ud-empty">暂无检测到可下载资源<br>浏览页面以自动检测</div>';
                return;
            }

            // 按类型分组
            const grouped = {};
            resources.forEach(resource => {
                if (!grouped[resource.type]) {
                    grouped[resource.type] = [];
                }
                grouped[resource.type].push(resource);
            });

            // 渲染
            let html = '';
            for (const [type, items] of Object.entries(grouped)) {
                html += `<h4 style="margin: 15px 0 10px 0; color: #333;">${this.getTypeLabel(type)} (${items.length})</h4>`;
                items.forEach((resource, index) => {
                    html += this.renderResourceItem(resource, index);
                });
            }

            container.innerHTML = html;

            // 绑定下载按钮
            container.querySelectorAll('.ud-download-btn').forEach(btn => {
                btn.onclick = () => {
                    const index = parseInt(btn.dataset.index);
                    const resource = resources[index];
                    const qualitySelect = btn.parentElement.parentElement.querySelector('.ud-quality-select');
                    const quality = qualitySelect ? qualitySelect.value : CONFIG.defaultQuality;
                    this.handleDownload(resource, quality);
                };
            });
        }

        // 渲染资源项
        renderResourceItem(resource, index) {
            const qualities = resource.qualities || [];
            const hasQualities = qualities.length > 1;

            return `
                <div class="ud-resource-item">
                    <span class="ud-resource-type">${this.getTypeLabel(resource.type)}</span>
                    ${resource.format ? `<span class="ud-resource-type" style="background: #f39c12;">${resource.format}</span>` : ''}
                    <div class="ud-resource-url">${resource.url}</div>
                    ${hasQualities ? `
                        <div class="ud-quality-selector">
                            <select class="ud-quality-select">
                                ${qualities.map(q => `<option value="${q.quality}">${q.quality}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    <div class="ud-resource-actions">
                        <button class="ud-btn ud-btn-primary ud-download-btn" data-index="${index}">
                            下载
                        </button>
                        <button class="ud-btn ud-btn-secondary" onclick="window.open('${resource.url}')">
                            新标签打开
                        </button>
                    </div>
                </div>
            `;
        }

        // 获取类型标签
        getTypeLabel(type) {
            const labels = {
                video: '视频',
                audio: '音频',
                image: '图片',
                document: '文档',
                archive: '压缩包',
                other: '其他'
            };
            return labels[type] || type;
        }

        // 处理下载
        async handleDownload(resource, quality) {
            const btn = event.target;
            const originalText = btn.textContent;

            btn.textContent = '下载中...';
            btn.disabled = true;

            try {
                await this.downloader.download(resource, {
                    quality: quality,
                    onProgress: (percent) => {
                        btn.textContent = `${percent.toFixed(0)}%`;
                    },
                    onComplete: () => {
                        btn.textContent = '完成!';
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                        }, 2000);
                    },
                    onError: (error) => {
                        btn.textContent = '失败';
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                        }, 2000);
                    }
                });
            } catch (error) {
                btn.textContent = '失败';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            }
        }

        // 注册菜单命令
        registerMenuCommands() {
            GM_registerMenuCommand('打开下载面板', () => this.showPanel());
            GM_registerMenuCommand('刷新资源检测', () => {
                this.detector.detectExistingResources();
                this.refreshResources();
            });
        }
    }

    // ==================== 网站特定处理 ====================
    class SiteHandlers {
        constructor() {
            this.handlers = {
                'youtube.com': this.handleYouTube,
                'youtu.be': this.handleYouTube,
                'bilibili.com': this.handleBilibili,
                'douyin.com': this.handleDouyin,
                'v.qq.com': this.handleTencent,
                'youku.com': this.handleYouku,
                'iqiyi.com': this.handleIqiyi,
                'twitter.com': this.handleTwitter,
                'x.com': this.handleTwitter,
                'instagram.com': this.handleInstagram,
                'tiktok.com': this.handleTikTok
            };
        }

        getHandler(url) {
            try {
                const hostname = new URL(url).hostname.replace('www.', '');
                for (const [domain, handler] of Object.entries(this.handlers)) {
                    if (hostname.includes(domain)) {
                        return handler.bind(this);
                    }
                }
            } catch (e) {
                console.error('URL解析失败:', e);
            }
            return null;
        }

        handleYouTube(detector) {
            console.log('YouTube 处理器已激活');
            try {
                const scripts = document.querySelectorAll('script');
                scripts.forEach(script => {
                    const content = script.textContent;
                    if (content.includes('ytInitialPlayerResponse')) {
                        const match = content.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
                        if (match) {
                            const data = JSON.parse(match[1]);
                            const streamingData = data.streamingData;
                            if (streamingData) {
                                const formats = [
                                    ...(streamingData.formats || []),
                                    ...(streamingData.adaptiveFormats || [])
                                ];
                                formats.forEach(format => {
                                    if (format.url) {
                                        detector.addResource({
                                            type: format.mimeType?.includes('video') ? 'video' : 'audio',
                                            url: format.url,
                                            quality: format.qualityLabel || format.quality,
                                            site: 'YouTube'
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('YouTube处理失败:', e);
            }
        }

        handleBilibili(detector) {
            console.log('Bilibili 处理器已激活');
            try {
                if (window.__playinfo__) {
                    const playinfo = window.__playinfo__;
                    const data = playinfo.data || playinfo;
                    if (data.dash) {
                        (data.dash.video || []).forEach(video => {
                            detector.addResource({
                                type: 'video',
                                url: video.baseUrl || video.base_url,
                                quality: `${video.height}p`,
                                site: 'Bilibili',
                                format: 'DASH'
                            });
                        });
                        (data.dash.audio || []).forEach(audio => {
                            detector.addResource({
                                type: 'audio',
                                url: audio.baseUrl || audio.base_url,
                                site: 'Bilibili'
                            });
                        });
                    } else if (data.durl) {
                        data.durl.forEach(item => {
                            detector.addResource({
                                type: 'video',
                                url: item.url,
                                site: 'Bilibili'
                            });
                        });
                    }
                }
            } catch (e) {
                console.error('Bilibili处理失败:', e);
            }
        }

        handleDouyin(detector) {
            console.log('抖音处理器已激活');
        }

        handleTencent(detector) {
            console.log('腾讯视频处理器已激活');
        }

        handleYouku(detector) {
            console.log('优酷处理器已激活');
        }

        handleIqiyi(detector) {
            console.log('爱奇艺处理器已激活');
        }

        handleTwitter(detector) {
            console.log('Twitter 处理器已激活');
            document.querySelectorAll('img[src*="pbs.twimg.com"]').forEach(img => {
                let url = img.src.split('?')[0].replace(/&name=\w+/, '&name=orig');
                detector.addResource({
                    type: 'image',
                    url: url,
                    element: img,
                    site: 'Twitter'
                });
            });
        }

        handleInstagram(detector) {
            console.log('Instagram 处理器已激活');
            document.querySelectorAll('img[srcset]').forEach(img => {
                if (img.srcset) {
                    const srcset = img.srcset.split(',');
                    const highRes = srcset[srcset.length - 1].trim().split(' ')[0];
                    detector.addResource({
                        type: 'image',
                        url: highRes,
                        site: 'Instagram'
                    });
                }
            });
        }

        handleTikTok(detector) {
            console.log('TikTok 处理器已激活');
        }

        init(detector) {
            const currentUrl = window.location.href;
            const handler = this.getHandler(currentUrl);
            if (handler) {
                try {
                    handler(detector);
                } catch (e) {
                    console.error('网站特定处理失败:', e);
                }
            }
        }
    }

    // ==================== 初始化 ====================
    function init() {
        console.log('全能下载工具已加载');

        const detector = new ResourceDetector();
        const downloader = new DownloadManager();
        const ui = new DownloaderUI(detector, downloader);

        // 暴露到全局（调试用）
        window.UniversalDownloader = {
            detector,
            downloader,
            ui
        };
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-01-05
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/zh-CN/scripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();