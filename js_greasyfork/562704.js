// ==UserScript==
// @name         抖音视频下载器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  抖音视频下载工具，支持视频流捕获和一键下载
// @author       hys
// @match        *://www.douyin.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/562704/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562704/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 嗅探器 (含智能去重逻辑) ===
    function injectSniffer() {
        // 用于防止短时间内完全重复的请求
        const recentUrls = new Set();
        
        console.log('%c智能嗅探器启动...', 'color: #00ff00; font-weight: bold;');

        function isVideoUrl(url) {
            if (!url) return false;
            if (url.startsWith('blob:')) return false;
            if (url.includes('.m3u8')) return false;

            // 如果URL包含media-前缀，只保留media-video-hvc1（过滤音频流）
            if (url.includes('media-')) {
                return url.includes('media-video-hvc1');
            }

            // 其他情况使用原来的检测逻辑
            return url.includes('mime_type=video_mp4') ||
                   (url.includes('.douyinvod.com') && url.includes('video'));
        }

        function notifyNewVideo(url) {
            // 第一层：完全字符串匹配去重 (针对完全一样的重复请求)
            if (recentUrls.has(url)) return;
            recentUrls.add(url);
            if (recentUrls.size > 50) recentUrls.clear();

            // 发送给油猴层进行第二层逻辑处理
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
    }

    const script = document.createElement('script');
    script.textContent = `(${injectSniffer.toString()})();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();


    // === 2. 队列管理 (核心去重升级) ===
    const videoQueue = [];
    let currentIndex = -1;
    const seenFids = new Set(); // 存储已见过的视频ID

    // 辅助：获取不带参数的基础 URL
    // 例如: https://a.com/v.mp4?range=100 -> https://a.com/v.mp4
    function getBaseUrl(fullUrl) {
        try {
            const urlObj = new URL(fullUrl);
            return urlObj.origin + urlObj.pathname;
        } catch (e) {
            return fullUrl.split('?')[0];
        }
    }

    // 辅助：从URL中提取fid参数
    function getFid(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('fid');
        } catch (e) {
            return null;
        }
    }

    window.addEventListener('dy_video_captured', function(e) {
        const newUrl = e.detail;

        // === 基于 fid 的去重 ===
        const fid = getFid(newUrl);
        if (fid && seenFids.has(fid)) {
            return; // 已存在相同视频，忽略
        }
        if (fid) seenFids.add(fid);
        // ==================

        // === 核心修复逻辑 ===
        // 获取新链接的基础路径
        const newBase = getBaseUrl(newUrl);

        // 获取队列中最后一个视频的基础路径
        let lastBase = "";
        if (videoQueue.length > 0) {
            lastBase = getBaseUrl(videoQueue[videoQueue.length - 1]);
        }

        // 如果基础路径相同，说明是同一个视频的后续分片（缓冲流），直接忽略！
        if (newBase === lastBase) {
            // console.log("忽略重复分片流:", newUrl);
            return;
        }
        // ==================

        videoQueue.push(newUrl);
        
        // 自动初始化
        if (currentIndex === -1) {
            currentIndex = 0;
            renderVideo(0);
        } else {
            // 仅更新计数，不干扰当前预览
            updateCounter();
            updateButtons();
            
            // 只有当真的是新视频时才提示
            showToast(`已捕获新视频 (总数: ${videoQueue.length})`);
        }
    });

    function renderVideo(index) {
        if (index < 0 || index >= videoQueue.length) return;
        const url = videoQueue[index];
        
        const videoEl = document.getElementById('dy-preview');
        videoEl.src = url;
        videoEl.volume = 0.5;
        videoEl.autoplay = false; 

        const urlBox = document.getElementById('dy-url-box');
        urlBox.innerText = `[${index + 1}] ` + url.substring(0, 35) + "...";
        urlBox.style.color = "#4caf50";
        
        updateCounter();
        updateButtons();
    }


    // === 3. 下载逻辑 (强制下载方案) ===
    async function startSystemDownload(url) {
        const btn = document.getElementById('dy-down-btn');
        btn.innerText = "⏳ 下载中...";
        btn.disabled = true;
        btn.style.background = "#555";

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

            btn.innerText = "✅ 下载成功";
            setTimeout(() => resetBtn(), 2000);
        } catch (err) {
            btn.innerText = "❌ 下载失败";
            alert(`下载失败: ${err.message}\n请使用下方复制链接功能。`);
            setTimeout(() => resetBtn(), 3000);
        }
    }

    function resetBtn() {
        const btn = document.getElementById('dy-down-btn');
        if(btn) {
            btn.innerText = "⬇️ 调用浏览器下载";
            btn.style.background = "#fe2c55";
            btn.disabled = false;
        }
    }


    // === 4. UI 界面 ===
    GM_addStyle(`
        #dy-panel {
            position: fixed; top: 70px; left: 20px; width: 300px;
            background: #161823; color: #fff; padding: 15px;
            border-radius: 8px; z-index: 999999; border: 1px solid #333;
            font-family: sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        }
        #dy-header { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px; cursor: move; user-select: none;}
        #dy-title { color: #fe2c55; font-weight: bold; }
        #dy-count { font-size: 12px; background: #333; padding: 2px 6px; border-radius: 4px; color: #ccc;}
        #dy-preview { width: 100%; height: 160px; background: #000; margin-bottom: 10px; border-radius: 4px;}
        
        .dy-nav-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .dy-nav-btn { flex: 1; background: #252525; color: #fff; border: 1px solid #444; padding: 6px 0; cursor: pointer; border-radius: 4px; }
        .dy-nav-btn:hover { background: #333; }
        .dy-nav-btn:disabled { opacity: 0.5; cursor: default; }

        #dy-down-btn { 
            width: 100%; background: #fe2c55; color: white; border: none; 
            padding: 10px 0; cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 13px;
            margin-bottom: 8px;
        }
        #dy-down-btn:hover { background: #e02548; }

        #dy-copy { 
            width: 100%; background: transparent; border: 1px dashed #555; color: #888; 
            padding: 6px; cursor: pointer; font-size: 12px; border-radius: 4px;
        }
        #dy-copy:hover { border-color: #aaa; color: #fff; }

        #dy-url-box { font-size: 10px; color: #555; text-align: center; margin-top: 5px; height: 18px; overflow: hidden;}
    `);

    function createUI() {
        if(document.getElementById('dy-panel')) return;
        const div = document.createElement('div');
        div.id = 'dy-panel';
        div.innerHTML = `
            <div id="dy-header">
                <span id="dy-title">抖音下载</span>
                <span id="dy-count">0 / 0</span>
            </div>
            <video id="dy-preview" controls playsinline></video>
            
            <div class="dy-nav-row">
                <button id="dy-prev" class="dy-nav-btn" disabled>⏮</button>
                <button id="dy-next" class="dy-nav-btn" disabled>⏭</button>
            </div>

            <button id="dy-down-btn">⬇️ 调用浏览器下载</button>
            <button id="dy-copy">📄 复制直链 (备用)</button>

            <div id="dy-url-box">等待视频...</div>
        `;
        document.body.appendChild(div);

        // 按钮事件
        document.getElementById('dy-prev').onclick = () => { if (currentIndex > 0) renderVideo(--currentIndex); };
        document.getElementById('dy-next').onclick = () => { if (currentIndex < videoQueue.length - 1) renderVideo(++currentIndex); };
        
        document.getElementById('dy-down-btn').onclick = () => {
            const url = videoQueue[currentIndex];
            if (url) startSystemDownload(url);
            else showToast("请先播放视频");
        };

        document.getElementById('dy-copy').onclick = () => {
            if (videoQueue[currentIndex]) {
                GM_setClipboard(videoQueue[currentIndex]);
                showToast("已复制");
            }
        };

        // 拖拽功能
        const panel = div;
        const header = document.getElementById('dy-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            panel.style.transition = 'none'; // 拖拽时禁用过渡动画
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            panel.style.left = (startLeft + deltaX) + 'px';
            panel.style.top = (startTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.transition = ''; // 恢复过渡动画
            }
        });
    }

    function updateCounter() {
        const c = document.getElementById('dy-count');
        if(c) c.innerText = `${currentIndex === -1 ? 0 : currentIndex + 1} / ${videoQueue.length}`;
    }

    function updateButtons() {
        document.getElementById('dy-prev').disabled = (currentIndex <= 0);
        const next = document.getElementById('dy-next');
        next.disabled = (currentIndex >= videoQueue.length - 1);
        next.innerText = (currentIndex < videoQueue.length - 1) ? "⏭ (新)" : "⏭";
        if(currentIndex < videoQueue.length - 1) next.style.borderColor = "#00ff00";
        else next.style.borderColor = "#444";
    }

    function showToast(msg) {
        const t = document.getElementById('dy-title');
        const old = t.innerText;
        t.innerText = msg;
        setTimeout(() => t.innerText = old, 2000);
    }

    window.addEventListener('load', createUI);

})();