// ==UserScript==
// @name               MissAV 下载工具
// @namespace          http://tampermonkey.net/
// @version            3.0
// @description        嗅探视频真实地址，支持下拉选择不同分辨率，带有进度条和现代化UI
// @author             noname
// @match              *://missav.ws/*
// @match              *://missav.live/*
// @match              *://missav.ai/*
// @match              *://missav123.com/*
// @icon               https://missav.ai/favicon.ico
// @grant              GM_addStyle
// @run-at             document-idle
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/561635/MissAV%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561635/MissAV%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. 样式定义 (CSS) ---
    const css = `
        .mav-container {
            background-color: #1f2937; /* Gray-800 */
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            color: #f3f4f6;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            border: 1px solid #374151;
            max-width: 100%;
        }
        .mav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .mav-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #d1d5db;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .mav-title span { color: #10b981; }

        /* Control Area */
        .mav-controls {
            display: flex;
            flex-direction: column;
            gap: 12px;
            background-color: #111827;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #374151;
        }

        /* Select Dropdown Styling */
        .mav-select-wrapper {
            position: relative;
        }
        .mav-select {
            width: 100%;
            background-color: #374151;
            color: white;
            border: 1px solid #4b5563;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.95rem;
            outline: none;
            cursor: pointer;
            appearance: none; /* Remove default arrow */
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
        }
        .mav-select:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 1px #10b981;
        }
        .mav-select:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Progress Bar */
        .mav-progress-container {
            width: 100%;
        }
        .mav-progress-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #9ca3af;
            margin-bottom: 4px;
        }
        .mav-progress-track {
            height: 10px;
            background-color: #374151;
            border-radius: 5px;
            overflow: hidden;
        }
        .mav-progress-fill {
            height: 100%;
            background-color: #10b981;
            width: 0%;
            transition: width 0.3s ease;
            background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
            background-size: 1rem 1rem;
        }

        /* Buttons */
        .mav-actions {
            display: flex;
            gap: 10px;
            margin-top: 5px;
        }
        .mav-btn {
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
            flex: 1;
        }
        .mav-btn-copy {
            background-color: #4b5563;
            color: white;
            flex: 0 0 30%;
        }
        .mav-btn-copy:hover { background-color: #6b7280; }
        
        .mav-btn-download {
            background-color: #10b981;
            color: white;
            flex: 1;
        }
        .mav-btn-download:hover { background-color: #059669; }
        .mav-btn-download:disabled {
            background-color: #374151;
            color: #9ca3af;
            cursor: not-allowed;
        }

        @media (max-width: 600px) {
            .mav-actions { flex-direction: column; }
            .mav-btn { width: 100%; }
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- 2. 核心逻辑工具 ---

    async function fetchText(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            return await response.text();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function fetchVideoPart(url, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Status ' + response.status);
                return await response.blob();
            } catch (err) {
                if (i === retries - 1) throw err;
            }
        }
    }

    async function downloadAndMerge(mediaUrls, onProgress) {
        const blobs = [];
        const total = mediaUrls.length;
        const batchSize = 20;

        for (let i = 0; i < total; i += batchSize) {
            const chunk = mediaUrls.slice(i, i + batchSize);
            const chunkBlobs = await Promise.all(chunk.map(item => fetchVideoPart(item.url)));
            blobs.push(...chunkBlobs);
            
            const current = Math.min(i + batchSize, total);
            const percent = ((current / total) * 100).toFixed(1);
            if (onProgress) onProgress(percent, current, total);
        }
        return new Blob(blobs, { type: 'video/mp4' });
    }

    function getSafeFileName(quality) {
        const titleEl = document.querySelector('h1.text-base, h1');
        let title = titleEl ? titleEl.textContent.trim() : 'MissAV_Video';
        title = title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 80);
        return `${title}_${quality}.mp4`;
    }

    // --- 3. UI 构建逻辑 (Dropdown 版本) ---

    function createUI(container, videoData) {
        container.innerHTML = '';

        // 主容器
        const panel = document.createElement('div');
        panel.className = 'mav-container';

        // 标题栏
        const header = document.createElement('div');
        header.className = 'mav-header';
        header.innerHTML = `<div class="mav-title"><span>⬇</span> 下载助手</div>`;
        panel.appendChild(header);

        // 控制区
        const controls = document.createElement('div');
        controls.className = 'mav-controls';

        // 1. 下拉选择框
        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'mav-select-wrapper';
        
        const select = document.createElement('select');
        select.className = 'mav-select';
        
        videoData.forEach((data, index) => {
            const option = document.createElement('option');
            option.value = index; // 存储索引
            option.text = `分辨率: ${data.display}`;
            select.appendChild(option);
        });
        selectWrapper.appendChild(select);
        controls.appendChild(selectWrapper);

        // 2. 进度条区域
        const progressContainer = document.createElement('div');
        progressContainer.className = 'mav-progress-container';
        progressContainer.innerHTML = `
            <div class="mav-progress-info">
                <span class="status-text">准备就绪 / Ready</span>
                <span class="percent-text">0%</span>
            </div>
            <div class="mav-progress-track">
                <div class="mav-progress-fill"></div>
            </div>
        `;
        controls.appendChild(progressContainer);

        // 3. 按钮区域
        const actions = document.createElement('div');
        actions.className = 'mav-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'mav-btn mav-btn-copy';
        copyBtn.textContent = '复制链接';
        
        const dlBtn = document.createElement('button');
        dlBtn.className = 'mav-btn mav-btn-download';
        dlBtn.textContent = '开始下载';
        
        actions.appendChild(copyBtn);
        actions.appendChild(dlBtn);
        controls.appendChild(actions);

        panel.appendChild(controls);
        container.appendChild(panel);

        // --- 事件绑定 ---
        const statusText = progressContainer.querySelector('.status-text');
        const percentText = progressContainer.querySelector('.percent-text');
        const progressFill = progressContainer.querySelector('.mav-progress-fill');

        // 复制按钮
        copyBtn.addEventListener('click', () => {
            const selectedIndex = select.value;
            const url = videoData[selectedIndex].url;
            navigator.clipboard.writeText(url).then(() => {
                const oldText = copyBtn.textContent;
                copyBtn.textContent = '已复制';
                setTimeout(() => copyBtn.textContent = oldText, 1500);
            });
        });

        // 下载按钮
        dlBtn.addEventListener('click', async () => {
            const selectedIndex = select.value;
            const data = videoData[selectedIndex];
            
            // UI 状态锁定
            dlBtn.disabled = true;
            select.disabled = true; // 下载时禁止切换
            dlBtn.textContent = '解析列表...';
            statusText.textContent = `正在解析 ${data.display}...`;
            progressFill.style.width = '0%';

            try {
                // 1. 获取 m3u8 内容
                const m3u8Text = await fetchText(data.url);
                if (!m3u8Text) throw new Error('无法获取播放列表');

                // 2. 提取分片链接
                const lines = m3u8Text.split('\n');
                const segments = [];
                const urlPrefix = data.url.substring(0, data.url.lastIndexOf('/') + 1);

                lines.forEach(line => {
                    line = line.trim();
                    if (line && !line.startsWith('#')) {
                        segments.push({ url: urlPrefix + line });
                    }
                });

                if (segments.length === 0) throw new Error('未找到视频分片');

                // 3. 开始下载
                dlBtn.textContent = '下载中...';
                statusText.textContent = '正在下载视频分片...';
                
                const finalBlob = await downloadAndMerge(segments, (percent, current, total) => {
                    progressFill.style.width = `${percent}%`;
                    percentText.textContent = `${percent}%`;
                    statusText.textContent = `下载分片 (${current}/${total})`;
                });

                // 4. 合并与保存
                statusText.textContent = '正在合并文件...';
                dlBtn.textContent = '处理中...';
                
                const blobUrl = URL.createObjectURL(finalBlob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = getSafeFileName(data.display);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);

                // 5. 完成
                statusText.textContent = '下载完成 Saved!';
                dlBtn.textContent = '下载完成';
                setTimeout(() => {
                    dlBtn.disabled = false;
                    select.disabled = false;
                    dlBtn.textContent = '开始下载';
                    statusText.textContent = '准备就绪 / Ready';
                    progressFill.style.width = '0%';
                }, 3000);

            } catch (err) {
                console.error(err);
                alert(`错误: ${err.message}`);
                dlBtn.disabled = false;
                select.disabled = false;
                dlBtn.textContent = '重试下载';
                statusText.textContent = '发生错误';
            }
        });
    }

    // --- 4. 初始化 ---
    async function init() {
        const target = document.querySelector('.order-first .mt-4') || document.querySelector('.w-full.mb-4');
        if (!target) {
            setTimeout(init, 1000);
            return;
        }
        if (document.querySelector('.mav-container')) return;

        let masterUrl = '';
        const scripts = document.querySelectorAll('script');
        
        // 嗅探逻辑
        for (let script of scripts) {
            if (script.textContent.includes("playlist.m3u8")) {
                const match = script.textContent.match(/https:\\\/\\\/.*?\/playlist\.m3u8/);
                if(match) {
                    masterUrl = match[0].replace(/\\/g, '');
                    break;
                }
            }
            const index = script.textContent.indexOf('seek');
            if (index !== -1 && index > 40) {
                const uuid = script.textContent.substring(index - 38, index - 2);
                if (/^[0-9a-f-]{36}$/.test(uuid)) {
                    masterUrl = `https://surrit.com/${uuid}/playlist.m3u8`;
                    break;
                }
            }
        }
        
        if(!masterUrl && window.hlsUrl) masterUrl = window.hlsUrl;

        if (masterUrl) {
            const text = await fetchText(masterUrl);
            if (!text) return;

            const lines = text.split('\n');
            const videoData = [];
            const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf('/') + 1);

            lines.forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    // 修正显示名称逻辑
                    let displayName = line.split('/')[0]; 
                    if(displayName.includes('.m3u8')) displayName = 'Original Source';
                    
                    videoData.push({
                        display: displayName,
                        url: baseUrl + line
                    });
                }
            });

            // 如果 masterUrl 本身就是单文件索引
            if (videoData.length === 0 && lines.length > 0) {
                videoData.push({ display: 'Source', url: masterUrl });
            }

            // 反转数组，通常高清在最后，我们希望高清在列表前面
            videoData.reverse(); 

            const div = document.createElement('div');
            target.appendChild(div);
            createUI(div, videoData);
        }
    }

    window.addEventListener('load', init);
})();