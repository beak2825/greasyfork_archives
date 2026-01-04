// ==UserScript==
// @name         网页媒体提取和批量下载工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  适用于大多数网站的视频和音频提取和批量下载工具，轻松抓取网页中的媒体资源
// @author       shenfangda
// @match        *://*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/549898/%E7%BD%91%E9%A1%B5%E5%AA%92%E4%BD%93%E6%8F%90%E5%8F%96%E5%92%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549898/%E7%BD%91%E9%A1%B5%E5%AA%92%E4%BD%93%E6%8F%90%E5%8F%96%E5%92%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        // 默认设置
        defaultSettings: {
            minWidth: 200,
            minHeight: 150,
            maxSize: 500, // MB
            formatFilter: ['mp4', 'webm', 'ogg', 'mp3', 'wav', 'm4a'],
            qualityThreshold: 0.5,
            customRules: []
        },
        // 特殊网站规则
        siteRules: {
            'youtube.com': {
                selector: 'video',
                exclude: []
            },
            'bilibili.com': {
                selector: 'video',
                exclude: []
            },
            'vimeo.com': {
                selector: 'video',
                exclude: []
            }
        }
    };

    // 主要功能类
    class MediaExtractor {
        constructor() {
            this.media = [];
            this.settings = {...config.defaultSettings};
            this.init();
        }

        init() {
            console.log('媒体提取工具已启动');
            this.createUI();
            this.bindEvents();
        }

        // 创建用户界面
        createUI() {
            GM_addStyle(`
                #media-extractor-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 350px;
                    max-height: 80vh;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    overflow: hidden;
                    display: none;
                }
                
                #media-extractor-panel-header {
                    background: #e74c3c;
                    color: white;
                    padding: 10px 15px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #media-extractor-panel-title {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                #media-extractor-panel-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                #media-extractor-panel-content {
                    padding: 15px;
                    overflow-y: auto;
                    max-height: calc(80vh - 50px);
                }
                
                .media-extractor-section {
                    margin-bottom: 15px;
                }
                
                .media-extractor-section-title {
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 4px;
                }
                
                #media-extractor-media-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .media-extractor-media-item {
                    position: relative;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                }
                
                .media-extractor-media-item video,
                .media-extractor-media-item audio {
                    width: 100%;
                    height: 80px;
                    display: block;
                }
                
                .media-extractor-media-item img {
                    width: 100%;
                    height: 80px;
                    object-fit: cover;
                    display: block;
                }
                
                .media-extractor-media-item.selected {
                    border-color: #e74c3c;
                    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
                }
                
                .media-extractor-media-info {
                    padding: 5px;
                    font-size: 12px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
                
                .media-extractor-controls {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }
                
                .media-extractor-btn {
                    padding: 8px 12px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    flex: 1;
                    min-width: 100px;
                }
                
                .media-extractor-btn:hover {
                    background: #c0392b;
                }
                
                .media-extractor-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .media-extractor-btn.secondary {
                    background: #f0f0f0;
                    color: #333;
                }
                
                .media-extractor-btn.secondary:hover {
                    background: #e0e0e0;
                }
                
                .media-extractor-progress {
                    height: 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    margin: 10px 0;
                    overflow: hidden;
                    display: none;
                }
                
                .media-extractor-progress-bar {
                    height: 100%;
                    background: #e74c3c;
                    width: 0%;
                    transition: width 0.3s;
                }
                
                .media-extractor-stats {
                    font-size: 13px;
                    color: #666;
                    margin: 10px 0;
                }
                
                .media-extractor-settings {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 10px;
                }
                
                .media-extractor-setting-item {
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }
                
                .media-extractor-setting-item label {
                    flex: 1;
                    font-size: 13px;
                }
                
                .media-extractor-setting-item input {
                    width: 60px;
                }
                
                #media-extractor-toggle-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 9999;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #media-extractor-notification {
                    position: fixed;
                    top: 20px;
                    right: 70px;
                    background: #e74c3c;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 10001;
                    display: none;
                }
                
                .media-extractor-type-icon {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 10px;
                }
            `);

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'media-extractor-panel';
            
            panel.innerHTML = `
                <div id="media-extractor-panel-header">
                    <div id="media-extractor-panel-title">媒体提取工具</div>
                    <button id="media-extractor-panel-close">×</button>
                </div>
                <div id="media-extractor-panel-content">
                    <div class="media-extractor-section">
                        <div class="media-extractor-section-title">操作</div>
                        <div class="media-extractor-controls">
                            <button id="media-extractor-scan-btn" class="media-extractor-btn">扫描媒体</button>
                            <button id="media-extractor-select-all-btn" class="media-extractor-btn secondary">全选</button>
                            <button id="media-extractor-deselect-all-btn" class="media-extractor-btn secondary">取消</button>
                        </div>
                    </div>
                    
                    <div class="media-extractor-section">
                        <div class="media-extractor-section-title">统计信息</div>
                        <div id="media-extractor-stats" class="media-extractor-stats">
                            未扫描媒体资源
                        </div>
                    </div>
                    
                    <div class="media-extractor-section">
                        <div class="media-extractor-section-title">媒体预览</div>
                        <div id="media-extractor-media-container">
                            <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #999;">
                                点击"扫描媒体"开始查找页面中的视频和音频
                            </div>
                        </div>
                    </div>
                    
                    <div class="media-extractor-section">
                        <div class="media-extractor-section-title">下载选项</div>
                        <div class="media-extractor-controls">
                            <button id="media-extractor-download-selected-btn" class="media-extractor-btn" disabled>下载选中</button>
                            <button id="media-extractor-download-zip-btn" class="media-extractor-btn" disabled>打包下载</button>
                        </div>
                    </div>
                    
                    <div class="media-extractor-progress">
                        <div class="media-extractor-progress-bar"></div>
                    </div>
                    
                    <div class="media-extractor-section">
                        <div class="media-extractor-section-title">设置</div>
                        <div class="media-extractor-settings">
                            <div class="media-extractor-setting-item">
                                <label>最小宽度:</label>
                                <input type="number" id="setting-min-width" value="${this.settings.minWidth}" min="50">
                            </div>
                            <div class="media-extractor-setting-item">
                                <label>最小高度:</label>
                                <input type="number" id="setting-min-height" value="${this.settings.minHeight}" min="50">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'media-extractor-toggle-btn';
            toggleBtn.innerHTML = '🎵';
            document.body.appendChild(toggleBtn);
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.id = 'media-extractor-notification';
            document.body.appendChild(notification);
        }

        // 绑定事件
        bindEvents() {
            // 切换面板显示
            document.getElementById('media-extractor-toggle-btn').addEventListener('click', () => {
                const panel = document.getElementById('media-extractor-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });
            
            // 关闭面板
            document.getElementById('media-extractor-panel-close').addEventListener('click', () => {
                document.getElementById('media-extractor-panel').style.display = 'none';
            });
            
            // 拖拽面板
            this.makeDraggable(document.getElementById('media-extractor-panel-header'), document.getElementById('media-extractor-panel'));
            
            // 扫描媒体
            document.getElementById('media-extractor-scan-btn').addEventListener('click', () => {
                this.scanMedia();
            });
            
            // 全选
            document.getElementById('media-extractor-select-all-btn').addEventListener('click', () => {
                this.selectAllMedia();
            });
            
            // 取消全选
            document.getElementById('media-extractor-deselect-all-btn').addEventListener('click', () => {
                this.deselectAllMedia();
            });
            
            // 下载选中
            document.getElementById('media-extractor-download-selected-btn').addEventListener('click', () => {
                this.downloadSelectedMedia();
            });
            
            // 打包下载
            document.getElementById('media-extractor-download-zip-btn').addEventListener('click', () => {
                this.downloadAsZip();
            });
            
            // 设置变更
            document.getElementById('setting-min-width').addEventListener('change', (e) => {
                this.settings.minWidth = parseInt(e.target.value) || 200;
            });
            
            document.getElementById('setting-min-height').addEventListener('change', (e) => {
                this.settings.minHeight = parseInt(e.target.value) || 150;
            });
        }

        // 使面板可拖拽
        makeDraggable(header, panel) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            header.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // 获取鼠标位置
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // 计算新位置
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // 设置元素新位置
                panel.style.top = (panel.offsetTop - pos2) + "px";
                panel.style.left = (panel.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                // 停止移动
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // 扫描页面中的媒体
        scanMedia() {
            this.showNotification('正在扫描媒体资源...');
            this.media = [];
            
            // 获取当前网站规则
            const hostname = window.location.hostname;
            let rule = null;
            for (const site in config.siteRules) {
                if (hostname.includes(site)) {
                    rule = config.siteRules[site];
                    break;
                }
            }
            
            // 查找所有视频元素
            const videoElements = document.querySelectorAll('video');
            const audioElements = document.querySelectorAll('audio');
            
            // 处理视频元素
            videoElements.forEach((video, index) => {
                try {
                    // 获取视频源
                    let src = '';
                    if (video.src) {
                        src = video.src;
                    } else if (video.querySelector('source')) {
                        src = video.querySelector('source').src;
                    }
                    
                    // 获取视频尺寸
                    const width = video.videoWidth || video.width || 0;
                    const height = video.videoHeight || video.height || 0;
                    
                    // 过滤条件
                    if (!src || src.startsWith('data:')) return;
                    if (width < this.settings.minWidth || height < this.settings.minHeight) return;
                    
                    this.media.push({
                        id: 'video_' + index,
                        src: src,
                        width: width,
                        height: height,
                        duration: video.duration || 0,
                        type: 'video',
                        element: video,
                        selected: false
                    });
                } catch (e) {
                    console.warn('处理视频时出错:', e);
                }
            });
            
            // 处理音频元素
            audioElements.forEach((audio, index) => {
                try {
                    // 获取音频源
                    let src = '';
                    if (audio.src) {
                        src = audio.src;
                    } else if (audio.querySelector('source')) {
                        src = audio.querySelector('source').src;
                    }
                    
                    // 过滤条件
                    if (!src || src.startsWith('data:')) return;
                    
                    this.media.push({
                        id: 'audio_' + index,
                        src: src,
                        width: 0,
                        height: 0,
                        duration: audio.duration || 0,
                        type: 'audio',
                        element: audio,
                        selected: false
                    });
                } catch (e) {
                    console.warn('处理音频时出错:', e);
                }
            });
            
            // 查找媒体链接
            this.findMediaLinks();
            
            // 去重
            const uniqueMedia = [];
            const seenUrls = new Set();
            
            this.media.forEach(media => {
                if (!seenUrls.has(media.src)) {
                    seenUrls.add(media.src);
                    uniqueMedia.push(media);
                }
            });
            
            this.media = uniqueMedia;
            
            // 更新UI
            this.updateMediaList();
            this.updateStats();
            this.showNotification(`找到 ${this.media.length} 个媒体资源`);
        }

        // 查找页面中的媒体链接
        findMediaLinks() {
            const links = document.querySelectorAll('a[href]');
            
            links.forEach((link, index) => {
                const href = link.href;
                if (!href) return;
                
                // 检查链接是否指向媒体文件
                const isMediaLink = this.isMediaUrl(href);
                if (isMediaLink) {
                    // 检查是否已存在
                    const exists = this.media.some(m => m.src === href);
                    if (!exists) {
                        this.media.push({
                            id: 'link_' + index,
                            src: href,
                            width: 0,
                            height: 0,
                            duration: 0,
                            type: this.getMediaType(href),
                            element: link,
                            selected: false
                        });
                    }
                }
            });
        }

        // 判断URL是否为媒体文件
        isMediaUrl(url) {
            const mediaExtensions = [
                'mp4', 'webm', 'ogg', 'mp3', 'wav', 'm4a', 'flv', 'avi', 'mov', 'wmv', 'mkv', 'aac', 'flac'
            ];
            
            try {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname.toLowerCase();
                
                return mediaExtensions.some(ext => pathname.endsWith('.' + ext));
            } catch (e) {
                return false;
            }
        }

        // 根据URL获取媒体类型
        getMediaType(url) {
            const videoExtensions = ['mp4', 'webm', 'ogg', 'flv', 'avi', 'mov', 'wmv', 'mkv'];
            const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'flac'];
            
            try {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname.toLowerCase();
                const ext = pathname.split('.').pop();
                
                if (videoExtensions.includes(ext)) {
                    return 'video';
                } else if (audioExtensions.includes(ext)) {
                    return 'audio';
                }
                
                return 'unknown';
            } catch (e) {
                return 'unknown';
            }
        }

        // 更新媒体列表
        updateMediaList() {
            const container = document.getElementById('media-extractor-media-container');
            container.innerHTML = '';
            
            if (this.media.length === 0) {
                container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #999;">未找到符合条件的媒体资源</div>';
                return;
            }
            
            this.media.forEach(media => {
                const item = document.createElement('div');
                item.className = 'media-extractor-media-item';
                item.dataset.id = media.id;
                
                // 根据类型创建不同的预览
                if (media.type === 'video') {
                    item.innerHTML = `
                        <div style="position: relative; width: 100%; height: 80px; background: #333; display: flex; align-items: center; justify-content: center;">
                            <div style="color: white; font-size: 24px;">▶</div>
                            <div class="media-extractor-type-icon">视频</div>
                        </div>
                        <div class="media-extractor-media-info">${media.width}×${media.height}</div>
                    `;
                } else if (media.type === 'audio') {
                    item.innerHTML = `
                        <div style="position: relative; width: 100%; height: 80px; background: #3498db; display: flex; align-items: center; justify-content: center;">
                            <div style="color: white; font-size: 24px;">♪</div>
                            <div class="media-extractor-type-icon">音频</div>
                        </div>
                        <div class="media-extractor-media-info">${this.formatDuration(media.duration)}</div>
                    `;
                } else {
                    item.innerHTML = `
                        <div style="position: relative; width: 100%; height: 80px; background: #95a5a6; display: flex; align-items: center; justify-content: center;">
                            <div style="color: white; font-size: 24px;">?</div>
                            <div class="media-extractor-type-icon">未知</div>
                        </div>
                    `;
                }
                
                if (media.selected) {
                    item.classList.add('selected');
                }
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMediaSelection(media.id);
                });
                
                container.appendChild(item);
            });
            
            // 更新按钮状态
            document.getElementById('media-extractor-download-selected-btn').disabled = this.media.filter(m => m.selected).length === 0;
            document.getElementById('media-extractor-download-zip-btn').disabled = this.media.length === 0;
        }

        // 格式化时长
        formatDuration(seconds) {
            if (!seconds || isNaN(seconds)) return '未知时长';
            
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // 切换媒体选择状态
        toggleMediaSelection(id) {
            const media = this.media.find(m => m.id === id);
            if (media) {
                media.selected = !media.selected;
                const item = document.querySelector(`.media-extractor-media-item[data-id="${id}"]`);
                if (item) {
                    if (media.selected) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                }
                
                // 更新按钮状态
                document.getElementById('media-extractor-download-selected-btn').disabled = this.media.filter(m => m.selected).length === 0;
            }
        }

        // 全选媒体
        selectAllMedia() {
            this.media.forEach(media => {
                media.selected = true;
            });
            this.updateMediaList();
        }

        // 取消全选媒体
        deselectAllMedia() {
            this.media.forEach(media => {
                media.selected = false;
            });
            this.updateMediaList();
        }

        // 更新统计信息
        updateStats() {
            const selectedCount = this.media.filter(m => m.selected).length;
            const stats = document.getElementById('media-extractor-stats');
            stats.textContent = `共找到 ${this.media.length} 个媒体资源，已选择 ${selectedCount} 个`;
        }

        // 下载选中媒体
        async downloadSelectedMedia() {
            const selectedMedia = this.media.filter(m => m.selected);
            if (selectedMedia.length === 0) {
                this.showNotification('请先选择要下载的媒体资源');
                return;
            }
            
            this.showProgress(0);
            
            for (let i = 0; i < selectedMedia.length; i++) {
                const media = selectedMedia[i];
                try {
                    const filename = this.getFileName(media.src, media.type);
                    await this.downloadMedia(media.src, filename);
                    this.showProgress(((i + 1) / selectedMedia.length) * 100);
                } catch (e) {
                    console.error('下载媒体失败:', e);
                }
            }
            
            this.hideProgress();
            this.showNotification(`下载完成，共下载 ${selectedMedia.length} 个媒体资源`);
        }

        // 打包下载为ZIP
        async downloadAsZip() {
            if (this.media.length === 0) {
                this.showNotification('没有媒体资源可以下载');
                return;
            }
            
            this.showProgress(0);
            
            try {
                const zip = new JSZip();
                const videoFolder = zip.folder("videos");
                const audioFolder = zip.folder("audios");
                const selectedMedia = this.media.filter(m => m.selected).length > 0 ? 
                                      this.media.filter(m => m.selected) : this.media;
                
                for (let i = 0; i < selectedMedia.length; i++) {
                    const media = selectedMedia[i];
                    try {
                        const blob = await this.fetchMediaAsBlob(media.src);
                        const filename = this.getFileName(media.src, media.type);
                        
                        if (media.type === 'video') {
                            videoFolder.file(filename, blob);
                        } else if (media.type === 'audio') {
                            audioFolder.file(filename, blob);
                        } else {
                            zip.file(filename, blob);
                        }
                        
                        this.showProgress(((i + 1) / selectedMedia.length) * 100);
                    } catch (e) {
                        console.error('添加媒体到ZIP失败:', e);
                    }
                }
                
                const content = await zip.generateAsync({type: "blob"});
                saveAs(content, `media_${new Date().getTime()}.zip`);
                
                this.hideProgress();
                this.showNotification(`ZIP打包完成，共包含 ${selectedMedia.length} 个媒体资源`);
            } catch (e) {
                this.hideProgress();
                this.showNotification('打包下载失败: ' + e.message);
                console.error('ZIP打包失败:', e);
            }
        }

        // 下载单个媒体
        downloadMedia(url, filename) {
            return new Promise((resolve, reject) => {
                GM_download({
                    url: url,
                    name: filename,
                    onload: () => resolve(),
                    onerror: (error) => reject(error)
                });
            });
        }

        // 获取媒体Blob
        fetchMediaAsBlob(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function(response) {
                        resolve(response.response);
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 获取文件名
        getFileName(url, type) {
            try {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                const filename = pathname.split('/').pop();
                
                if (filename) {
                    return filename;
                }
            } catch (e) {
                // URL解析失败
            }
            
            // 生成默认文件名
            const timestamp = new Date().getTime();
            const ext = type === 'video' ? 'mp4' : 'mp3';
            return `media_${timestamp}.${ext}`;
        }

        // 显示进度条
        showProgress(percent) {
            const progress = document.querySelector('.media-extractor-progress');
            const bar = document.querySelector('.media-extractor-progress-bar');
            progress.style.display = 'block';
            bar.style.width = percent + '%';
        }

        // 隐藏进度条
        hideProgress() {
            const progress = document.querySelector('.media-extractor-progress');
            progress.style.display = 'none';
        }

        // 显示通知
        showNotification(message) {
            const notification = document.getElementById('media-extractor-notification');
            notification.textContent = message;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // 初始化插件
    new MediaExtractor();
})();