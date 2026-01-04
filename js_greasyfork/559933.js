// ==UserScript==
// @name         Missav字幕助手
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  为特定的视频网站添加外部字幕支持
// @author       FunkJ
// @license      MIT
// @match        *://missav.ws/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      javzimu.com
// @connect      xunlei.com
// @connect      subtitlecat.com
// @connect      geilijiasu.com
// @connect      v.geilijiasu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559933/Missav%E5%AD%97%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559933/Missav%E5%AD%97%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 只在顶层窗口运行，不在 iframe 中运行（避免广告 iframe 创建多个面板）
    if (window.self !== window.top) {
        console.log('字幕加载器：当前在 iframe 中，跳过执行');
        return;
    }

    // 添加样式
    GM_addStyle(`
        #subtitle-loader-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            padding: 15px;
            border-radius: 10px;
            z-index: 99999;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            min-width: 280px;
            max-width: 320px;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        #subtitle-loader-panel h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #subtitle-loader-panel input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #555;
            border-radius: 5px;
            background: #222;
            color: white;
            box-sizing: border-box;
        }

        #subtitle-loader-panel button {
            padding: 8px 15px;
            margin-right: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        #subtitle-load-btn {
            background: #4CAF50;
            color: white;
        }

        #subtitle-load-btn:hover {
            background: #45a049;
        }

        #subtitle-clear-btn {
            background: #f44336;
            color: white;
        }

        #subtitle-clear-btn:hover {
            background: #da190b;
        }

        #subtitle-toggle-btn {
            background: #2196F3;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
        }

        #subtitle-toggle-btn:hover {
            background: #0b7dda;
        }

        #subtitle-minimize-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
        }

        #subtitle-loader-panel.minimized {
            min-width: auto;
        }

        #subtitle-loader-panel.minimized .panel-content {
            display: none;
        }

        .subtitle-overlay {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            max-width: 80%;
            line-height: 1.4;
            z-index: 9999;
            pointer-events: none;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        #subtitle-status {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
        }

        #subtitle-settings {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #555;
        }

        #subtitle-settings label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
        }

        #subtitle-settings input[type="number"],
        #subtitle-settings input[type="range"] {
            width: 100%;
            margin-bottom: 5px;
        }
    `);

    let subtitles = [];
    let currentSubtitle = null;
    let videoElement = null;
    let subtitleElement = null;
    let subtitlesEnabled = true;
    let subtitleOffset = 0; // 字幕时间偏移（秒）

    // 字幕样式配置（从 localStorage 加载）
    const defaultSubtitleStyle = {
        size: 20,
        position: 60,
        color: '#ffffff',
        bgColor: '#000000',
        bgOpacity: 70,
        encoding: 'auto', // 默认自动检测
        minimized: false // Panel minimized state
    };
    let subtitleStyle = { ...defaultSubtitleStyle };

    // 搜索结果缓存 { keyword, source, results }
    let searchCache = { keyword: '', source: '', results: [] };

    // 常量配置
    // 常量配置
    // 支持标准格式 (MIAA-123) 及 FC2 格式 (FC2-PPV-123456)
    const MOVIE_ID_PATTERN = /[a-z0-9]+-[a-z0-9]+(-[a-z0-9]+)?/i;
    const MOVIE_PAGE_PATTERN = /^[a-z0-9]+-\d+(-[a-z0-9]+)*$/i; // 用于 URL 匹配，可能带后缀

    // ============================================
    // 辅助函数
    // ============================================

    // hex 颜色转 rgba
    function hexToRgba(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 封装 GM_xmlhttpRequest 为 Promise
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                responseType: options.responseType || 'text',
                onload: resolve,
                onerror: reject
            });
        });
    }

    // 智能获取文本（自动处理 GBK/UTF-8）
    // 智能获取文本（支持手动指定 encoding）
    async function gmFetchText(url, encoding = 'auto') {
        const response = await gmFetch(url, { responseType: 'arraybuffer' });
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}`);
        }

        const buffer = response.response;
        let text = '';
        const decoderOpts = { fatal: false }; // 允许容错

        if (encoding !== 'auto') {
            try {
                // 尝试用指定编码解码
                text = new TextDecoder(encoding, decoderOpts).decode(buffer);
                return text;
            } catch (e) {
                console.warn(`指定编码 ${encoding} 解码失败，回退到自动检测:`, e);
            }
        }

        // 自动检测逻辑
        const utf8Decoder = new TextDecoder('utf-8', decoderOpts);
        text = utf8Decoder.decode(buffer);

        // 如果包含大量替换字符，尝试 GBK
        // 阈值设为 0，只要有 REPLACEMENT CHARACTER 就怀疑是 GBK (GBK 解码为 UTF-8 通常必出 )
        if (text.includes('')) {
            console.log('检测到 UTF-8 解码异常，尝试 GBK...');
            try {
                const gbkDecoder = new TextDecoder('gbk', decoderOpts);
                const gbkText = gbkDecoder.decode(buffer);
                // 如果 GBK 解码后没有替换字符，或者比 UTF-8 少，就认为是 GBK
                // 这里简单粗暴：只要 UTF-8 挂了就试 GBK，一般够用
                text = gbkText;
            } catch (e) {
                console.error('GBK 解码也失败了:', e);
            }
        }
        return text;
    }

    // 状态信息颜色配置
    const statusColors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3',
        loading: '#FFC107'
    };

    // 更新状态信息 (通用)
    function showStatus(elementId, message, type = 'info') {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.style.color = statusColors[type] || '#aaa';
    }

    // 绑定输入框/滑块事件
    function bindInput(id, styleKey, extraAction = null) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', (e) => {
            let val = e.target.value;
            if (el.type === 'range' || el.type === 'number') {
                val = parseFloat(val);
                const displayEl = document.getElementById(id.replace('subtitle-', '') + '-value') ||
                    document.getElementById(id.split('-').pop() + '-value');
                if (displayEl) displayEl.textContent = val.toFixed(id === 'subtitle-offset' ? 1 : 0);
            }
            subtitleStyle[styleKey] = val;
            if (extraAction) extraAction(val);
            if (subtitleElement && styleKey !== 'minimized') {
                applySubtitleStyleToElement();
            }
        });
    }

    // 应用样式到视频中的字幕元素
    function applySubtitleStyleToElement() {
        if (!subtitleElement) return;
        subtitleElement.style.fontSize = subtitleStyle.size + 'px';
        subtitleElement.style.bottom = subtitleStyle.position + 'px';
        subtitleElement.style.color = subtitleStyle.color;
        subtitleElement.style.background = hexToRgba(subtitleStyle.bgColor, subtitleStyle.bgOpacity / 100);
    }

    // 保存搜索缓存到 sessionStorage
    function saveSearchCache() {
        sessionStorage.setItem('subtitleSearchCache', JSON.stringify(searchCache));
    }

    // 从 sessionStorage 加载搜索缓存
    function loadSearchCache() {
        try {
            const saved = sessionStorage.getItem('subtitleSearchCache');
            if (saved) {
                searchCache = JSON.parse(saved);
            }
        } catch (e) {
            console.error('加载搜索缓存失败:', e);
        }
    }

    // ============================================
    // 字幕加载和显示功能
    // ============================================
    // 创建控制面板
    function createControlPanel() {
        // 检查是否已存在面板（防止重复创建）
        if (document.getElementById('subtitle-loader-panel')) {
            console.log('字幕加载器面板已存在，跳过创建');
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'subtitle-loader-panel';
        panel.innerHTML = `
            <h3>
                🎬 字幕
                <button id="subtitle-minimize-btn" title="最小化">−</button>
            </h3>
            <div class="panel-content">
                <div style="display: flex; gap: 5px; margin-bottom: 8px; align-items: stretch;">
                    <select id="subtitle-source" style="padding: 0 8px; background: #333; color: #aaa; border: none; border-radius: 4px; font-size: 11px; height: 32px; -webkit-appearance: none; appearance: none;">
                        <option value="javzimu">javzimu</option>
                        <option value="xunlei">迅雷</option>
                        <option value="subtitlecat">subtitlecat</option>
                    </select>
                    <input type="text" id="auto-search-keyword" placeholder="番号 (如 MIAA-723)" style="flex: 1; padding: 0 10px; background: #333; color: white; border: none; border-radius: 4px; height: 32px; box-sizing: border-box;" />
                    <button id="auto-search-btn" style="padding: 0 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; height: 32px;">搜索</button>
                </div>
                <div id="search-status" style="font-size: 11px; color: #888; margin-bottom: 8px;">自动识别中...</div>
                <div id="search-results" style="display: none; max-height: 150px; overflow-y: auto; overflow-x: hidden; margin-bottom: 8px; background: #222; border-radius: 4px; padding: 4px; max-width: 100%; box-sizing: border-box;"></div>

                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <button id="subtitle-toggle-btn" style="flex: 1; padding: 6px; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer;">👁 显示/隐藏</button>
                    <button id="subtitle-clear-btn" style="flex: 1; padding: 6px; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑 清除</button>
                </div>

                <details style="margin-bottom: 8px;">
                    <summary style="cursor: pointer; font-size: 12px; color: #aaa;">⚙️ 字幕设置</summary>
                    <div style="margin-top: 8px; padding: 8px; background: #222; border-radius: 4px;">
                        <label style="display: block; font-size: 11px; margin-bottom: 8px;">
                            时间偏移: <span id="offset-value">0</span>s
                            <input type="range" id="subtitle-offset" min="-300" max="60" step="1" value="0" style="width: 100%;" />
                        </label>
                        <label style="display: block; font-size: 11px; margin-bottom: 8px;">
                            字幕大小: <span id="size-value">20</span>px
                            <input type="range" id="subtitle-size" min="12" max="40" step="1" value="20" style="width: 100%;" />
                        </label>
                        <label style="display: block; font-size: 11px; margin-bottom: 8px;">
                            字幕位置: <span id="position-value">60</span>px
                            <input type="range" id="subtitle-position" min="20" max="200" step="5" value="60" style="width: 100%;" />
                        </label>
                        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                            <label style="font-size: 11px; flex: 1;">
                                文字颜色
                                <input type="color" id="subtitle-color" value="#ffffff" style="width: 100%; height: 24px; border: none; border-radius: 3px; cursor: pointer;" />
                            </label>
                            <label style="font-size: 11px; flex: 1;">
                                背景颜色
                                <input type="color" id="subtitle-bg-color" value="#000000" style="width: 100%; height: 24px; border: none; border-radius: 3px; cursor: pointer;" />
                            </label>
                        </div>
                        <label style="display: block; font-size: 11px; margin-bottom: 8px;">
                            背景透明度: <span id="bg-opacity-value">70</span>%
                            <input type="range" id="subtitle-bg-opacity" min="0" max="100" step="5" value="70" style="width: 100%;" />
                        </label>
                        <button id="save-subtitle-style" style="width: 100%; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">💾 保存设置</button>
                    </div>
                </details>

                <details>
                    <summary style="cursor: pointer; font-size: 12px; color: #aaa;">📎 手动加载</summary>
                    <div style="margin-top: 8px; padding: 8px; background: #222; border-radius: 4px;">
                        <input type="text" id="subtitle-url-input" placeholder="字幕 URL (.srt/.vtt)" style="width: 100%; padding: 6px; background: #333; color: white; border: none; border-radius: 4px; margin-bottom: 5px; box-sizing: border-box;" />
                        <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                            <select id="subtitle-encoding" style="flex: 1; padding: 6px; background: #333; color: white; border: none; border-radius: 4px;">
                                <option value="auto">自动编码</option>
                                <option value="utf-8">UTF-8</option>
                                <option value="gbk">GBK/GB18030</option>
                                <option value="big5">Big5</option>
                                <option value="utf-16">UTF-16</option>
                            </select>
                            <button id="subtitle-load-btn" style="flex: 1; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">加载</button>
                        </div>
                    </div>
                </details>

                <div id="subtitle-status" style="font-size: 11px; color: #4CAF50; margin-top: 10px; text-align: center;"></div>
            </div>
        `;
        document.body.appendChild(panel);
        console.log('字幕加载器面板已创建');

        // 加载并应用保存的字幕样式
        loadSubtitleStyle();
        applySubtitleStyle();

        // 加载搜索缓存
        loadSearchCache();
        if (searchCache.results && searchCache.results.length > 0) {
            displaySearchResults(searchCache.results);
            showStatus('search-status', `加载缓存结果 (${searchCache.results.length} 条)`, 'info');
        }


        // 自动识别番号并填入
        const detectedID = getMovieID();
        if (detectedID) {
            document.getElementById('auto-search-keyword').value = detectedID;
            showStatus('search-status', `已自动识别番号: ${detectedID}`, 'info');
        }

        // 绑定事件
        document.getElementById('subtitle-load-btn').addEventListener('click', loadSubtitle);
        document.getElementById('subtitle-clear-btn').addEventListener('click', clearSubtitle);
        document.getElementById('subtitle-toggle-btn').addEventListener('click', toggleSubtitle);
        document.getElementById('subtitle-minimize-btn').addEventListener('click', toggleMinimize);
        // 绑定输入控制
        bindInput('subtitle-offset', 'offset', (val) => subtitleOffset = val);
        bindInput('subtitle-size', 'size');
        bindInput('subtitle-position', 'position');
        bindInput('subtitle-color', 'color');
        bindInput('subtitle-bg-color', 'bgColor');
        bindInput('subtitle-bg-color', 'bgColor');
        bindInput('subtitle-bg-opacity', 'bgOpacity');

        // 绑定编码选择
        document.getElementById('subtitle-encoding').addEventListener('change', (e) => {
            subtitleStyle.encoding = e.target.value;
            saveSubtitleStyle();
            // 如果当前有 URL，可能想立即重载？暂时不自动重载，避免意外
            // 但如果用户选了新的编码，手动点加载是符合预期的
        });

        document.getElementById('save-subtitle-style').addEventListener('click', () => {
            saveSubtitleStyle();
            showStatus('subtitle-status', '字幕设置已保存', 'success');
        });


        // 自动搜索相关事件
        document.getElementById('auto-search-btn').addEventListener('click', performAutoSearch);
        document.getElementById('auto-search-keyword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performAutoSearch();
            }
        });

        // 支持回车键加载
        document.getElementById('subtitle-url-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadSubtitle();
            }
        });

        // --- 拖拽功能实现 ---
        const header = panel.querySelector('h3');
        header.style.cursor = 'move';
        header.style.userSelect = 'none';

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            // 排除最小化按钮的点击
            if (e.target.id === 'subtitle-minimize-btn') return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // 移除 right 定位，改为 left/top 定位以支持拖拽
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.left = initialLeft + 'px';
            panel.style.top = initialTop + 'px';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = (initialLeft + dx) + 'px';
            panel.style.top = (initialTop + dy) + 'px';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 最小化/恢复面板
    function toggleMinimize() {
        const panel = document.getElementById('subtitle-loader-panel');
        const btn = document.getElementById('subtitle-minimize-btn');
        const isMinimized = panel.classList.toggle('minimized');
        btn.textContent = isMinimized ? '+' : '−';

        subtitleStyle.minimized = isMinimized;
        saveSubtitleStyle();
    }

    // 加载字幕
    async function loadSubtitle() {
        const url = document.getElementById('subtitle-url-input').value.trim();
        if (!url) {
            showStatus('subtitle-status', '请输入字幕 URL', 'error');
            return;
        }

        showStatus('subtitle-status', '正在加载字幕...', 'loading');

        try {
            const encoding = subtitleStyle.encoding || 'auto';
            console.log('加载字幕，使用编码:', encoding);
            const text = await gmFetchText(url, encoding);

            let parsedSubs = [];

            if (url.endsWith('.srt')) {
                parsedSubs = parseSRT(text);
            } else if (url.endsWith('.vtt')) {
                parsedSubs = parseVTT(text);
            } else {
                // 尝试自动检测格式
                if (text.includes('WEBVTT')) {
                    parsedSubs = parseVTT(text);
                } else {
                    parsedSubs = parseSRT(text);
                }
            }

            showStatus('subtitle-status', `字幕加载成功！共 ${parsedSubs.length} 条字幕`, 'success');
            subtitles = parsedSubs;
            // 重置搜索索引
            activeSubtitleIndex = -1;
            attachToVideo();
        } catch (error) {
            console.error('加载字幕出错:', error);
            showStatus('subtitle-status', '加载失败: ' + error.message, 'error');
        }
    }

    // 解析 SRT 格式字幕
    function parseSRT(text) {
        const lines = text.trim().split('\n');
        const subs = [];
        let i = 0;

        console.log('开始解析 SRT 字幕，总行数:', lines.length);

        while (i < lines.length) {
            // 跳过空行
            while (i < lines.length && !lines[i].trim()) i++;
            if (i >= lines.length) break;

            // 序号
            i++;

            // 时间轴
            if (i >= lines.length) break;
            const timeLine = lines[i];
            // 支持多种时间戳格式: HH:MM:SS,MS 或 HH:MM:SS.MS，以及 --> 或 -->
            const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*--+>\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
            if (!timeMatch) {
                i++;
                continue;
            }

            const startTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
            const endTime = parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);
            i++;

            // 字幕文本
            let text = '';
            while (i < lines.length && lines[i].trim() && !/^\d+$/.test(lines[i].trim())) {
                text += lines[i] + '\n';
                i++;
            }

            subs.push({ start: startTime, end: endTime, text: text.trim() });
        }

        console.log('SRT 解析完成，共', subs.length, '条字幕');
        return subs;
    }

    // 解析 VTT 格式字幕
    function parseVTT(text) {
        const lines = text.trim().split('\n');
        const subs = [];
        let i = 0;

        // 跳过 WEBVTT 头
        while (i < lines.length && !lines[i].includes('-->')) i++;

        while (i < lines.length) {
            // 跳过空行
            while (i < lines.length && !lines[i].trim()) i++;
            if (i >= lines.length) break;

            // 时间轴
            const timeLine = lines[i];
            const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
            if (!timeMatch) {
                i++;
                continue;
            }

            const startTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
            const endTime = parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);
            i++;

            // 字幕文本
            let text = '';
            while (i < lines.length && lines[i].trim() && !lines[i].includes('-->')) {
                text += lines[i] + '\n';
                i++;
            }

            subs.push({ start: startTime, end: endTime, text: text.trim() });
        }

        return subs;
    }

    // 解析时间为秒
    function parseTime(h, m, s, ms) {
        return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
    }

    // 查找视频元素（支持 iframe）
    function findVideoElement() {
        // 辅助函数：检查是否是预览视频
        function isPreviewVideo(video) {
            if (!video) return false;
            const className = video.className || '';
            const id = video.id || '';
            // 忽略包含 preview 的视频（通常是缩略图预览）
            return className.includes('preview') || id.includes('preview');
        }

        // 先在主文档中查找非预览视频
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            if (!isPreviewVideo(video)) {
                console.log('在主文档中找到主视频:', video);
                return video;
            }
        }

        // 在所有 iframe 中查找
        const iframes = document.querySelectorAll('iframe');
        console.log('检查 iframe 数量:', iframes.length);
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    const iframeVideos = iframeDoc.querySelectorAll('video');
                    for (const video of iframeVideos) {
                        if (!isPreviewVideo(video)) {
                            console.log('在 iframe 中找到主视频:', video);
                            return video;
                        }
                    }
                }
            } catch (e) {
                // 跨域 iframe 会抛出异常，忽略
                console.log('无法访问 iframe (可能是跨域):', iframe.src || iframe);
            }
        }

        // 如果没找到非预览视频，降级使用第一个视频
        console.warn('未找到主视频，使用第一个视频元素');
        return videos[0] || null;
    }

    // 附加到视频元素
    function attachToVideo() {
        videoElement = findVideoElement();
        if (!videoElement) {
            showStatus('subtitle-status', '未找到视频元素，等待视频加载...', 'warning');
            // 等待视频元素出现
            const observer = new MutationObserver(() => {
                videoElement = findVideoElement();
                if (videoElement) {
                    observer.disconnect();
                    attachToVideo();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        // 创建字幕显示元素
        if (!subtitleElement) {
            let videoContainer = videoElement.parentElement;

            // 查找更合适的容器（通常是播放器容器）
            let container = videoContainer;
            while (container && container !== document.body) {
                const style = window.getComputedStyle(container);
                if (style.position === 'relative' || style.position === 'absolute') {
                    videoContainer = container;
                    break;
                }
                container = container.parentElement;
            }

            subtitleElement = document.createElement('div');
            subtitleElement.className = 'subtitle-overlay';

            // 应用配置样式
            applySubtitleStyleToElement();

            // 确保容器有定位
            if (window.getComputedStyle(videoContainer).position === 'static') {
                videoContainer.style.position = 'relative';
            }

            videoContainer.appendChild(subtitleElement);
            console.log('字幕元素已添加到:', videoContainer);
        }

        // 监听视频时间更新
        videoElement.addEventListener('timeupdate', updateSubtitle);

        // 监听全屏变化，防止字幕被遮挡
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari/Old Chrome

        showStatus('subtitle-status', `字幕已附加到视频（共 ${subtitles.length} 条）`, 'success');
    }

    // 处理全屏变化
    function handleFullscreenChange() {
        if (!subtitleElement) return;

        const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
        if (fsElement) {
            // 进入全屏：将字幕挂载到全屏元素下
            fsElement.appendChild(subtitleElement);
            subtitleElement.style.zIndex = '2147483647';
        } else {
            // 退出全屏：尝试挂载回视频容器
            // 注意：这里简单挂载回 videoElement.parentElement 可能不够准确
            // 但 attachToVideo 中的逻辑会在下次需要时重新寻找最佳容器
            if (videoElement && videoElement.parentElement) {
                videoElement.parentElement.appendChild(subtitleElement);
            }
        }
    }

    // 更新字幕显示
    // 更新字幕显示 (优化版)
    let activeSubtitleIndex = -1;

    function updateSubtitle() {
        if (!videoElement || !subtitlesEnabled || subtitles.length === 0) {
            if (subtitleElement && subtitleElement.style.display !== 'none') {
                subtitleElement.textContent = '';
                subtitleElement.style.display = 'none';
            }
            return;
        }

        const currentTime = videoElement.currentTime + subtitleOffset;

        // 1. 检查当前缓存的字幕是否仍然有效
        if (activeSubtitleIndex !== -1 && activeSubtitleIndex < subtitles.length) {
            const current = subtitles[activeSubtitleIndex];
            if (currentTime >= current.start && currentTime <= current.end) {
                return; // 没有任何变化，直接返回
            }
        }

        // 2. 只有当前时间超出了缓存范围，才重新查找
        let foundIndex = -1;

        // 线性查找优化：如果时间是向后走，尝试从 activeSubtitleIndex 往后找
        if (activeSubtitleIndex !== -1 && activeSubtitleIndex < subtitles.length) {
            // 情况 A. 正常播放，时间向后
            if (currentTime > subtitles[activeSubtitleIndex].end) {
                for (let i = activeSubtitleIndex + 1; i < subtitles.length; i++) {
                    if (currentTime >= subtitles[i].start && currentTime <= subtitles[i].end) {
                        foundIndex = i;
                        break;
                    }
                    if (subtitles[i].start > currentTime) break;
                }
            }
            // 情况 B. 快退 (currentTime < start)
            else if (currentTime < subtitles[activeSubtitleIndex].start) {
                for (let i = activeSubtitleIndex - 1; i >= 0; i--) {
                    if (currentTime >= subtitles[i].start && currentTime <= subtitles[i].end) {
                        foundIndex = i;
                        break;
                    }
                    if (subtitles[i].end < currentTime) break; // 已经回退过头了
                }
            }
        }

        // 如果上面没找到（可能是倒退、跳转、或者刚开始），则全量查找
        if (foundIndex === -1) {
            foundIndex = subtitles.findIndex(sub => currentTime >= sub.start && currentTime <= sub.end);
        }

        activeSubtitleIndex = foundIndex;

        if (foundIndex !== -1) {
            const sub = subtitles[foundIndex];
            if (subtitleElement.textContent !== sub.text) { // 防止重复赋值
                subtitleElement.textContent = sub.text;
                subtitleElement.style.display = 'block';
            }
        } else {
            if (subtitleElement.textContent !== '') {
                subtitleElement.textContent = '';
                subtitleElement.style.display = 'none';
            }
        }
    }

    // 保存字幕样式到 localStorage
    function saveSubtitleStyle() {
        localStorage.setItem('subtitleStyle', JSON.stringify(subtitleStyle));
    }

    // 加载字幕样式
    function loadSubtitleStyle() {
        try {
            const saved = localStorage.getItem('subtitleStyle');
            if (saved) {
                subtitleStyle = { ...defaultSubtitleStyle, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('加载字幕样式失败:', e);
        }
    }

    // 应用字幕样式到 UI 控件
    function applySubtitleStyle() {
        // 自动同步所有已定义 ID 的控件值
        const controls = {
            'subtitle-size': 'size',
            'subtitle-position': 'position',
            'subtitle-color': 'color',
            'subtitle-bg-color': 'bgColor',
            'subtitle-bg-opacity': 'bgOpacity',
            'subtitle-bg-color': 'bgColor',
            'subtitle-bg-opacity': 'bgOpacity',
            'subtitle-offset': 'offset',
            'subtitle-encoding': 'encoding' // 绑定编码选择器
        };

        for (const [id, key] of Object.entries(controls)) {
            const el = document.getElementById(id);
            if (!el) continue;

            const val = subtitleStyle[key] ?? (key === 'offset' ? 0 : '');
            el.value = val;

            // 更新对应显示的文字标签
            const displayEl = document.getElementById(id.replace('subtitle-', '') + '-value') ||
                document.getElementById(id.split('-').pop() + '-value');
            if (displayEl) displayEl.textContent = typeof val === 'number' ? val.toFixed(key === 'offset' ? 1 : 0) : val;
        }

        // 应用最小化状态
        const panel = document.getElementById('subtitle-loader-panel');
        const minBtn = document.getElementById('subtitle-minimize-btn');
        if (subtitleStyle.minimized) {
            panel.classList.add('minimized');
            minBtn.textContent = '+';
        } else {
            panel.classList.remove('minimized');
            minBtn.textContent = '−';
        }

        // 应用到元素
        applySubtitleStyleToElement();
    }



    // 清除字幕
    function clearSubtitle() {
        subtitles = [];
        currentSubtitle = null;
        if (subtitleElement) {
            subtitleElement.textContent = '';
        }
        document.getElementById('subtitle-url-input').value = '';
        showStatus('subtitle-status', '字幕已清除', 'info');
    }

    // 切换字幕显示
    function toggleSubtitle() {
        subtitlesEnabled = !subtitlesEnabled;
        const btn = document.getElementById('subtitle-toggle-btn');
        btn.textContent = subtitlesEnabled ? '隐藏字幕' : '显示字幕';
        if (!subtitlesEnabled && subtitleElement) {
            subtitleElement.style.display = 'none';
        }
    }




    // ============================================
    // 自动搜索相关函数
    // ============================================

    // 自动提取番号 (Movie ID)
    function getMovieID() {
        try {
            // 优先从 H1 提取
            const h1 = document.querySelector('h1')?.textContent || '';
            const h1Match = h1.match(MOVIE_ID_PATTERN);
            if (h1Match) return h1Match[0].toUpperCase();

            // 备选：从 URL 提取
            const urlMatch = window.location.href.match(MOVIE_ID_PATTERN);
            if (urlMatch) return urlMatch[0].toUpperCase();
        } catch (e) {
            console.error('提取番号失败:', e);
        }
        return '';
    }



    // 自动搜索调度（支持多源和结果列表）
    async function performAutoSearch() {
        const keyword = document.getElementById('auto-search-keyword').value.trim();
        const source = document.getElementById('subtitle-source').value;
        const resultsContainer = document.getElementById('search-results');

        if (!keyword) {
            showStatus('search-status', '请输入关键词', 'error');
            return;
        }

        // 检查缓存
        if (searchCache.keyword === keyword && searchCache.source === source && searchCache.results.length > 0) {
            showStatus('search-status', `显示缓存结果 (${searchCache.results.length} 条)`, 'info');
            displaySearchResults(searchCache.results);
            return;
        }

        showStatus('search-status', `正在从 ${source} 搜索...`, 'info');
        resultsContainer.style.display = 'none';
        console.log(`[${source}] 搜索关键词:`, keyword);

        try {
            const searchMap = {
                'javzimu': searchJavZimuList,
                'xunlei': searchXunleiList,
                'subtitlecat': searchSubtitleCatList
            };

            const searchFn = searchMap[source];
            if (!searchFn) throw new Error(`不受支持的搜索源: ${source}`);

            const results = await searchFn(keyword);

            // 更新并保存缓存
            searchCache = { keyword, source, results };
            saveSearchCache();

            if (results.length === 0) {
                showStatus('search-status', '未找到相关字幕', 'warning');
                return;
            }

            showStatus('search-status', `找到 ${results.length} 个字幕`, 'success');
            displaySearchResults(results);
        } catch (error) {
            console.error('自动搜索出错:', error);
            showStatus('search-status', `执行出错: ${error.message}`, 'error');
        }
    }

    // 显示搜索结果列表
    function displaySearchResults(results) {
        const container = document.getElementById('search-results');
        container.innerHTML = '';
        container.style.display = 'block';

        results.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 6px 8px; cursor: pointer; border-radius: 3px; margin-bottom: 2px; font-size: 11px; color: #ddd; background: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
            div.textContent = item.name;
            div.title = item.name;
            div.addEventListener('mouseenter', () => div.style.background = '#444');
            div.addEventListener('mouseleave', () => div.style.background = '#333');
            div.addEventListener('click', () => loadSubtitleFromResult(item));
            container.appendChild(div);
        });
    }

    // 从搜索结果加载字幕
    async function loadSubtitleFromResult(item) {
        showStatus('search-status', `正在加载: ${item.name}`, 'info');

        let finalUrl = item.url;

        // SubtitleCat 需要从详情页提取真实下载链接
        if (item.needsExtract) {
            try {
                const landingResponse = await gmFetch(item.url);

                if (landingResponse.status !== 200) {
                    throw new Error(`访问详情页失败: ${landingResponse.status}`);
                }

                const parser = new DOMParser();
                const landingDoc = parser.parseFromString(landingResponse.responseText, 'text/html');

                const langPriorities = ['download_zh-CN', 'download_zh-TW', 'download_zh', 'download_en'];
                let downloadHref = '';

                for (const langId of langPriorities) {
                    const dlLink = landingDoc.getElementById(langId) || landingDoc.querySelector(`a.green-link[id*="${langId}"]`);
                    if (dlLink && dlLink.getAttribute('href')) {
                        downloadHref = dlLink.getAttribute('href');
                        break;
                    }
                }

                if (!downloadHref) {
                    const anyGreenLink = landingDoc.querySelector('a.green-link');
                    if (anyGreenLink) {
                        downloadHref = anyGreenLink.getAttribute('href');
                    }
                }

                if (!downloadHref) {
                    showStatus('search-status', '未找到下载链接', 'warning');
                    return;
                }

                finalUrl = new URL(downloadHref, 'https://www.subtitlecat.com').href;
            } catch (e) {
                showStatus('search-status', `提取下载链接失败: ${e.message}`, 'error');
                return;
            }
        }

        document.getElementById('subtitle-url-input').value = finalUrl;
        loadSubtitle();
    }

    // javzimu.com 搜索 - 返回结果列表
    async function searchJavZimuList(keyword) {
        const searchUrl = `https://javzimu.com/api/search?name=${encodeURIComponent(keyword)}`;
        const searchResponse = await gmFetch(searchUrl);

        if (searchResponse.status !== 200) {
            throw new Error(`javzimu 搜索失败: ${searchResponse.status}`);
        }

        let data;
        try {
            data = JSON.parse(searchResponse.responseText);
        } catch (e) {
            throw new Error('javzimu 响应解析失败');
        }

        if (!data.data || data.data.length === 0) {
            return [];
        }

        // 返回结果列表
        return data.data.map(item => ({
            name: item.name + (item.extra_name || ''),
            url: `https://javzimu.com/api/download?cid=${item.cid}&ext=${item.ext}&name=${encodeURIComponent(item.name)}`
        }));
    }

    // 迅雷字幕源搜索 - 返回结果列表
    async function searchXunleiList(keyword) {
        const searchUrl = `https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(keyword)}`;
        const searchResponse = await gmFetch(searchUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': navigator.userAgent
            }
        });

        if (searchResponse.status !== 200) {
            throw new Error(`迅雷搜索失败: ${searchResponse.status}`);
        }

        let data;
        try {
            data = JSON.parse(searchResponse.responseText);
        } catch (e) {
            throw new Error('迅雷响应解析失败');
        }

        if (data.code !== 0 || !data.data || data.data.length === 0) {
            return [];
        }

        // 过滤只要 .srt 文件且名称匹配
        const filtered = data.data.filter(item =>
            item.url && item.url.includes('.srt') &&
            item.name && item.name.toUpperCase().includes(keyword.toUpperCase())
        );

        return filtered.map(item => ({
            name: `${item.name}${item.extra_name ? ' (' + item.extra_name + ')' : ''}`,
            url: item.url
        }));
    }

    // subtitlecat.com 搜索 - 返回结果列表
    async function searchSubtitleCatList(keyword) {
        const searchUrl = `https://www.subtitlecat.com/index.php?search=${encodeURIComponent(keyword)}`;
        const searchResponse = await gmFetch(searchUrl);

        if (searchResponse.status !== 200) {
            throw new Error(`SubtitleCat 搜索失败: ${searchResponse.status}`);
        }

        const parser = new DOMParser();
        const searchDoc = parser.parseFromString(searchResponse.responseText, 'text/html');
        const resultLinks = searchDoc.querySelectorAll('table.table tbody tr td a');

        if (resultLinks.length === 0) {
            return [];
        }

        // 过滤结果：名称必须包含搜索关键词（不区分大小写）
        const keywordLower = keyword.toLowerCase();
        const results = [];
        const seen = new Set();
        for (const link of resultLinks) {
            const href = link.getAttribute('href');
            const name = link.textContent.trim();

            // 过滤：名称必须包含关键词
            if (!name.toLowerCase().includes(keywordLower)) {
                continue;
            }

            if (href && !seen.has(href)) {
                seen.add(href);
                results.push({
                    name: name || `字幕 ${results.length + 1}`,
                    url: new URL(href, 'https://www.subtitlecat.com').href,
                    needsExtract: true // 标记需要二次提取
                });
                if (results.length >= 10) break;
            }
        }

        return results;
    }



    // 初始化标记
    let pendingInit = null;

    // 检测是否是视频详情页（通过 URL 判断）
    function isVideoPage() {
        const path = window.location.pathname;

        // 排除 search 页面
        if (path.includes('/search/')) {
            return false;
        }

        // 获取 URL 最后一段
        const segments = path.split('/').filter(s => s.length > 0);
        if (segments.length === 0) {
            return false;
        }
        const lastSegment = segments[segments.length - 1];

        // 番号格式: 字母数字-数字，可能带后缀如 -uncensored-leak
        // 例如: miaa-723, SSIS-001, miaa-723-uncensored-leak
        return MOVIE_PAGE_PATTERN.test(lastSegment);
    }

    // 清理字幕状态
    function cleanup() {
        subtitles = [];
        currentSubtitle = null;
        if (subtitleElement) {
            subtitleElement.remove();
            subtitleElement = null;
        }
        const panel = document.getElementById('subtitle-loader-panel');
        if (panel) {
            panel.remove();
        }
    }

    // 初始化函数
    function init() {
        // 不是视频页，清理并跳过
        if (!isVideoPage()) {
            cleanup();
            return;
        }

        // 面板已存在，跳过
        if (document.getElementById('subtitle-loader-panel')) {
            return;
        }

        createControlPanel();
    }

    // 防抖初始化
    function debounceInit() {
        if (pendingInit) {
            clearTimeout(pendingInit);
        }
        pendingInit = setTimeout(() => {
            pendingInit = null;
            cleanup();  // 页面切换时先清理
            init();
        }, 500);
    }

    // 监听 SPA 导航
    function setupNavigationListener() {
        window.addEventListener('popstate', debounceInit);

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            debounceInit();
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            debounceInit();
        };
    }

    // 初始化
    setTimeout(() => {
        init();
        setupNavigationListener();
    }, 1000);

})();