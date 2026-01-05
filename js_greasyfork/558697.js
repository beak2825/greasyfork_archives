// ==UserScript==
// @name         艾薇社区破解VIP视频免费看（手动触发版）
// @namespace    aiwei_vip_video_free_see
// @version      3.0
// @description  点击破解按钮后才弹出播放器~
// @author       123
// @match        https://bav53.cc/*
// @match        https://avjb.com/*
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/558697/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%EF%BC%88%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558697/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%EF%BC%88%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let player = null;
    let video = null;
    let downloadBtn = null;
    let showTipsEl = null;
    let reloadBtn = null;
    let copyBtn = null;
    let hls = null;
    let currentUrl = '';
    let isMinimized = false;

    // 🎨 样式设置
    GM_addStyle(`
        /* 触发按钮样式 */
        #crackTriggerBtn {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 2147483646;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #crackTriggerBtn:hover {
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        #crackTriggerBtn:active {
            transform: scale(0.95);
        }
        
        #crackTriggerBtn.loading {
            animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* 播放器样式 */
        #hlsPlayer {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 600px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 2147483647;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
        }
        
        #hlsPlayer.show {
            display: block;
            animation: slideIn 0.4s ease-out;
        }
        
        #hlsPlayer.minimized {
            width: 300px;
            height: auto;
        }
        
        #hlsPlayer.minimized #videoElement,
        #hlsPlayer.minimized .action-bar {
            display: none;
        }
        
        .player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            cursor: move;
            user-select: none;
        }
        
        .player-title {
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .player-controls {
            display: flex;
            gap: 8px;
        }
        
        .player-controls button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: #fff;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .player-controls button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        #closeBtn:hover {
            background: #ff4444;
        }
        
        #videoElement {
            width: 100%;
            max-height: 400px;
            background: #000;
            display: block;
        }
        
        .player-footer {
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.3);
        }
        
        .status-bar {
            margin-bottom: 12px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            text-align: center;
        }
        
        #showTips {
            color: #fff;
            font-size: 13px;
            font-weight: 500;
        }
        
        .action-bar {
            display: flex;
            gap: 8px;
        }
        
        .btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 10px 8px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 8px;
            color: #fff;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 12px;
        }
        
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn-icon {
            font-size: 18px;
        }
        
        .btn-text {
            font-size: 11px;
            font-weight: 500;
        }
        
        #hlsPlayer.dragging {
            opacity: 0.8;
            cursor: move;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            #hlsPlayer {
                width: calc(100vw - 40px);
                top: 10px;
                right: 20px;
            }
            
            #videoElement {
                max-height: 300px;
            }
        }
    `);

    // 🎬 创建播放器
    function createPlayer() {
        player = document.createElement('div');
        player.id = 'hlsPlayer';
        player.innerHTML = `
            <div class="player-header">
                <span class="player-title">🎬 艾薇破解播放器</span>
                <div class="player-controls">
                    <button id="minimizeBtn" title="最小化">_</button>
                    <button id="closeBtn" title="关闭">✖</button>
                </div>
            </div>
            <video id="videoElement" controls></video>
            <div class="player-footer">
                <div class="status-bar">
                    <span id="showTips">⌛️ 破解中...</span>
                </div>
                <div class="action-bar">
                    <a id="downloadBtn" href="" target="_blank" class="btn btn-download">
                        <span class="btn-icon">⏬</span>
                        <span class="btn-text">下载</span>
                    </a>
                    <button id="reloadBtn" class="btn btn-reload">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">重载</span>
                    </button>
                    <button id="copyBtn" class="btn btn-copy">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">复制</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(player);
        
        // 获取元素引用
        video = player.querySelector('#videoElement');
        downloadBtn = player.querySelector('#downloadBtn');
        showTipsEl = player.querySelector('#showTips');
        reloadBtn = player.querySelector('#reloadBtn');
        copyBtn = player.querySelector('#copyBtn');
        
        const minimizeBtn = player.querySelector('#minimizeBtn');
        const closeBtn = player.querySelector('#closeBtn');
        
        // 绑定事件
        bindPlayerEvents(minimizeBtn, closeBtn);
        
        // 显示播放器
        player.classList.add('show');
    }

    // 🎬 加载HLS视频
    function loadHlsStream(url) {
        console.log('[破解器] 🎯 加载视频:', url);
        currentUrl = url;
        
        downloadBtn.href = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${encodeURIComponent(url)}&referer=${encodeURIComponent(window.location.href)}&filename=${encodeURIComponent(document.title)}`;
        
        if (Hls.isSupported()) {
            if(hls) hls.destroy();
            hls = new Hls({
                debug: false,
                enableWorker: true,
                xhrSetup: (xhr) => {
                    xhr.withCredentials = false;
                }
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                showTipsEl.innerText = `✅ 破解成功`;
                video.play().catch(err => {
                    console.warn('[破解器] 自动播放被阻止:', err);
                    showTipsEl.innerText = `✅ 破解成功（点击播放）`;
                });
            });
            
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('[破解器] HLS Error:', data);
                if (data.fatal) {
                    showTipsEl.innerText = `❌ 加载失败，线路可能已变更`;
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                showTipsEl.innerText = `✅ 破解成功`;
                video.play().catch(() => {
                    showTipsEl.innerText = `✅ 破解成功（点击播放）`;
                });
            });
        } else {
            showTipsEl.innerText = `❌ 浏览器不支持HLS播放`;
        }
    }

    // 🔍 获取视频地址（破解逻辑）
    function crackVideo() {
        console.log('[破解器] 🔓 开始破解...');
        
        // 如果播放器不存在，创建它
        if (!player) {
            createPlayer();
        } else {
            player.style.display = 'block';
            player.classList.add('show');
        }
        
        showTipsEl.innerText = '⌛️ 正在破解...';

        // 尝试多种选择器
        const imgSelectors = [
            '.player-holder img',
            '.video-player img',
            '.player-container img',
            'img[src*="screenshot"]',
            'img[src*="videos"]'
        ];

        let prefix = null;
        for (let selector of imgSelectors) {
            const img = document.querySelector(selector);
            if (img && img.src) {
                prefix = img.src;
                console.log(`[破解器] ✅ 找到封面图 (${selector}):`, prefix);
                break;
            }
        }

        if (!prefix) {
            console.log("[破解器] ⏳ 未找到封面图");
            showTipsEl.innerText = '❌ 未找到视频元素，请刷新页面后重试';
            return;
        }

        // 解析封面图URL
        const tmp = prefix.split('/');
        let folderId, videoId;
        
        if (prefix.includes('videos_screenshots')) {
            const idx = tmp.indexOf('videos_screenshots');
            if (idx !== -1 && tmp.length > idx + 2) {
                folderId = tmp[idx + 1];
                videoId = tmp[idx + 2];
            }
        } else if (prefix.includes('/videos/')) {
            const idx = tmp.indexOf('videos');
            if (idx !== -1 && tmp.length > idx + 2) {
                folderId = tmp[idx + 1];
                videoId = tmp[idx + 2];
            }
        }

        if (!folderId || !videoId) {
            console.log("[破解器] ❌ 无法解析封面图URL:", prefix);
            showTipsEl.innerText = '❌ 无法识别视频ID';
            return;
        }

        console.log(`[破解器] 📊 解析结果: folderId=${folderId}, videoId=${videoId}`);

        // 根据videoID选择线路
        let baseURL;
        const videoIdNum = parseInt(videoId);
        
        if (videoIdNum > 18400 && videoIdNum < 92803) {
            baseURL = 'https://99newline.jb-aiwei.cc';
        } else if (videoIdNum >= 92803) {
            baseURL = 'https://88newline.jb-aiwei.cc';
        } else {
            baseURL = 'https://99newline.jb-aiwei.cc';
        }

        const url = `${baseURL}/videos/${folderId}/${videoId}/index.m3u8`;
        console.log(`[破解器] 🚀 使用线路: ${baseURL}`);
        
        loadHlsStream(url);
    }

    // 📌 绑定播放器事件
    function bindPlayerEvents(minimizeBtn, closeBtn) {
        // 重载按钮
        reloadBtn.addEventListener('click', () => {
            if (currentUrl) {
                showTipsEl.innerText = '🔄 重新加载中...';
                loadHlsStream(currentUrl);
            }
        });

        // 复制按钮
        copyBtn.addEventListener('click', () => {
            if (!currentUrl) return;
            navigator.clipboard.writeText(currentUrl).then(() => {
                const originalText = copyBtn.querySelector('.btn-text').innerText;
                copyBtn.querySelector('.btn-text').innerText = '已复制';
                copyBtn.querySelector('.btn-icon').innerText = '✅';
                setTimeout(() => {
                    copyBtn.querySelector('.btn-text').innerText = originalText;
                    copyBtn.querySelector('.btn-icon').innerText = '📋';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        // 最小化
        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                player.classList.add('minimized');
                minimizeBtn.innerText = '□';
            } else {
                player.classList.remove('minimized');
                minimizeBtn.innerText = '_';
            }
        });

        // 关闭
        closeBtn.addEventListener('click', () => {
            player.style.display = 'none';
            if (hls) hls.destroy();
        });

        // 拖拽功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        const playerHeader = player.querySelector('.player-header');

        playerHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.player-controls')) return;
            isDragging = true;
            player.classList.add('dragging');
            
            initialX = e.clientX - player.offsetLeft;
            initialY = e.clientY - player.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            player.style.left = currentX + 'px';
            player.style.top = currentY + 'px';
            player.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                player.classList.remove('dragging');
            }
        });
    }

    // 🔘 创建触发按钮
    function createTriggerButton() {
        const triggerBtn = document.createElement('button');
        triggerBtn.id = 'crackTriggerBtn';
        triggerBtn.innerHTML = '🔓';
        triggerBtn.title = '点击破解VIP视频';
        
        triggerBtn.addEventListener('click', () => {
            triggerBtn.classList.add('loading');
            triggerBtn.innerHTML = '⏳';
            
            setTimeout(() => {
                crackVideo();
                triggerBtn.classList.remove('loading');
                triggerBtn.innerHTML = '🔓';
            }, 300);
        });
        
        document.body.appendChild(triggerBtn);
    }

    // 🚀 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createTriggerButton);
        } else {
            createTriggerButton();
        }
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (hls) hls.destroy();
    });

    // 启动脚本
    init();

})();