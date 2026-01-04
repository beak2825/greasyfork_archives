// ==UserScript==
// @name 抖音视频下载助手 (V9.5 严格 ID 去重与 URL 合并)
// @namespace http://tampermonkey.net/
// @version 9.5
// @description 核心升级：修复了相同视频ID重复出现在列表的问题。现在以视频ID为唯一键，优先保留API捕获的高质量下载链接。
// @author Gemini, thehappymouse@gmail.com
// @match https://www.douyin.com/*
// @grant GM_download
// @grant GM_setClipboard
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556370/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28V95%20%E4%B8%A5%E6%A0%BC%20ID%20%E5%8E%BB%E9%87%8D%E4%B8%8E%20URL%20%E5%90%88%E5%B9%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556370/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28V95%20%E4%B8%A5%E6%A0%BC%20ID%20%E5%8E%BB%E9%87%8D%E4%B8%8E%20URL%20%E5%90%88%E5%B9%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 真正的视频 CDN 关键词
    const CDN_KEYWORDS = ['video/tos/cn', 'douyinvod.com', 'mime_type=video_mp4'];

    // 全局状态管理
    const state = {
        urls: new Set(),
        items: [],
        currentPlayingId: null,
        isPanelVisible: true,
        isPanelCollapsed: false
    };

    // --- 工具函数：URL 清理与去重核心 ---
    function cleanAndNormalizeUrl(url) {
        if (url.startsWith('blob:')) return null;
        try {
            const urlObj = new URL(url);
            urlObj.search = '';
            let cleanUrl = urlObj.toString();
            if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);
            return decodeURIComponent(cleanUrl);
        } catch(e) {
            return url;
        }
    }

    // --- 1. 核心引擎 A/B: API & 网络流嗅探 (保持不变) ---

    function scanObjectForVideo(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { obj.forEach(item => scanObjectForVideo(item)); return; }

        const aweme_detail = obj.aweme_detail || obj;

        if (aweme_detail.aweme_id && aweme_detail.video && aweme_detail.video.play_addr && aweme_detail.video.play_addr.url_list) {
            addVideoToUI({
                url: aweme_detail.video.play_addr.url_list[0],
                title: aweme_detail.desc || "未命名视频",
                id: aweme_detail.aweme_id,
                cover: (aweme_detail.video.cover && aweme_detail.video.cover.url_list) ? aweme_detail.video.cover.url_list[0] : null,
                source: 'API'
            });
            return;
        }

        if (obj.data) scanObjectForVideo(obj.data);
        if (obj.aweme_list) scanObjectForVideo(obj.aweme_list);
    }

    // 绝对优先 Hook JSON.parse
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        let result;
        try {
            result = originalParse(text, reviver);
        } catch (e) {
            return originalParse(text, reviver);
        }
        try { scanObjectForVideo(result); } catch (e) {}
        return result;
    };

    // 绝对优先 Hook XMLHttpRequest.open
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (CDN_KEYWORDS.some(k => url.includes(k))) {
            if (url.startsWith('//')) url = 'https:' + url;
            addVideoToUI({ url: url, title: `网络流_${Date.now().toString().slice(-4)}`, source: 'NET' });
        }
        return originalOpen.apply(this, arguments);
    };


    // --- 样式 (V9.5 沿用 V9.4 的紫色主题和性能优化相关样式) ---
    const css = `
        #dy-sniffer-panel {
            position: fixed; right: 20px; top: 80px; width: 340px; max-height: 85vh;
            transform: translate(0, 0); will-change: transform;
            background: rgba(74, 48, 89, 0.95);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px; z-index: 2147483647; color: #fff; display: flex; flex-direction: column;
            font-family: sans-serif; box-shadow: 0 8px 20px rgba(0,0,0,0.6); backdrop-filter: blur(10px);
            cursor: grab; transition: all 0.3s ease-in-out;
        }
        #dy-sniffer-panel.dragging { cursor: grabbing; }
        #dy-sniffer-header {
            padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); font-weight: bold;
            display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.08);
            cursor: move;
        }
        .dy-clear-btn { font-size:12px; color:#ddd; cursor:pointer; text-decoration:underline; margin-right:10px;}
        .dy-close-btn { cursor:pointer; font-size:18px; line-height: 1; user-select: none; margin-left: 5px; }
        #dy-sniffer-content { overflow-y: auto; flex: 1; padding: 10px; scroll-behavior: smooth; cursor: default;}

        #dy-restore-btn {
            position: fixed; right: 20px; top: 80px; width: 80px; height: 35px;
            background: #9b59b6; color: white; border: none; border-radius: 5px;
            z-index: 2147483647; cursor: pointer; font-size: 14px; font-weight: bold;
            display: none; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: all 0.3s ease-in-out;
        }
        #dy-restore-btn:hover { background: #8e44ad; }

        .dy-item {
            background: rgba(255,255,255,0.15); margin-bottom: 10px; padding: 10px;
            border-radius: 8px; display: flex; gap: 10px; transition: all 0.3s; border: 2px solid transparent;
            cursor: default;
        }
        .dy-item.playing {
            background: rgba(37, 192, 170, 0.25); border-color: #25c0aa; order: -1;
        }
        .dy-cover-img { width: 60px; height: 80px; object-fit: cover; border-radius: 4px; background: #000; flex-shrink: 0; }
        .dy-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
        .dy-item-title {
            font-size: 12px; line-height: 1.4; max-height: 2.8em; overflow: hidden;
            text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            color: #fff; margin-bottom: 3px;
        }
        .dy-item-id {
            font-size: 10px; color: #ccc; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .dy-btn-group { display: flex; gap: 5px; }
        .dy-action-btn {
            flex: 1; padding: 5px 0; border: none; border-radius: 4px; cursor: pointer;
            color: white; font-size: 11px; transition: opacity 0.2s;
        }
        .dy-btn-jump { background: #3a3f50; }
        .dy-btn-down { background: #fe2c55; }
        .dy-action-btn:hover { opacity: 0.8; }
        .dy-btn-disabled { opacity: 0.5; cursor: not-allowed; background: #555; }
        .dy-tag { font-size: 9px; padding: 2px 4px; border-radius: 3px; background: #333; color: #aaa; width: fit-content; margin-right: 5px; }
        .dy-tag.tag-dom { background: #e68e20; color: #fff; }
        .dy-tag.tag-playing { background: #25c0aa; color: #fff; display: none; }
        .dy-item.playing .dy-tag.tag-playing { display: inline-block; }
    `;

    // --- 2. 核心引擎 C: ID 匹配、高亮、滚动 (保持不变) ---
    // ... (代码保持 V9.4 逻辑不变) ...
    function startDOMVideoURLSniffer() {
        setInterval(() => {
            const currentId = extractCurrentVideoId();
            const currentTitle = extractCurrentVideoTitle();

            document.querySelectorAll('video').forEach(videoEl => {
                const url = videoEl.src;
                if (!url) return;
                const cleanUrl = cleanAndNormalizeUrl(url);
                if (!cleanUrl) return;

                if (CDN_KEYWORDS.some(k => url.includes(k))) {
                    // V9.5: 不再检查 state.urls.has(cleanUrl)，让 addVideoToUI() 决定是否合并
                    addVideoToUI({
                        url: url, title: currentTitle,
                        id: currentId, cover: null, source: 'DOM'
                    });
                }
            });
        }, 500);
    }

    function startTitleAndIDExtractor() {
        // ... (保持 V9.4 逻辑不变) ...
        setInterval(() => {
            const currentId = extractCurrentVideoId();
            let matchedElement = null;

            if (currentId) {
                state.items.forEach(item => {
                    const isPlaying = (item.id === currentId);

                    if (isPlaying) {
                        matchedElement = item.el;
                        if (!item.el.classList.contains('playing')) {
                            document.querySelectorAll('.dy-item.playing').forEach(el => el.classList.remove('playing'));
                            item.el.classList.add('playing');
                        }
                        item.el.querySelector('.dy-item-id').innerText = `ID: ${currentId}`;
                    } else {
                        item.el.classList.remove('playing');
                    }
                });

                if (matchedElement && state.currentPlayingId !== currentId) {
                    matchedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    state.currentPlayingId = currentId;
                } else if (currentId && state.currentPlayingId !== currentId) {
                    document.querySelectorAll('.dy-item.playing').forEach(el => el.classList.remove('playing'));
                    state.currentPlayingId = currentId;
                }

            } else {
                document.querySelectorAll('.dy-item.playing').forEach(el => el.classList.remove('playing'));
                state.currentPlayingId = null;
            }
        }, 300);
    }

    function extractCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        const modalId = urlParams.get('modal_id');
        if (modalId) return modalId;

        const pathMatch = window.location.pathname.match(/\/video\/(\d+)/);
        if (pathMatch) return pathMatch[1];

        return null;
    }

    function extractCurrentVideoTitle() {
        const titleEl = document.querySelector('[data-e2e="feed-video-desc"]') ||
                             document.querySelector('[data-e2e="video-desc"]') ||
                             document.querySelector('h1') ||
                             document.querySelector('div[class*="desc"]');

        if (titleEl && titleEl.innerText) {
            return titleEl.innerText.substring(0, 60).replace(/\s+/g, ' ').trim();
        }

        const id = extractCurrentVideoId();
        return id ? `视频 #${id}` : '未命名视频';
    }


    // --- 3. UI, 下载与初始化 ---

    // V9.4 makeDraggable (rAF 优化) 保持不变
    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;
        let rAFId = null;

        function getTransformValues() {
            const style = window.getComputedStyle(element);
            const matrix = style.transform;
            if (matrix === 'none') return { x: 0, y: 0 };
            const match = matrix.match(/matrix.*\((.+)\)/);
            if (match) {
                const values = match[1].split(', ').map(v => parseFloat(v));
                if (values.length === 6) return { x: values[4], y: values[5] };
            }
            return { x: 0, y: 0 };
        }

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.classList.add('dragging');
            const currentTransform = getTransformValues();
            translateX = currentTransform.x;
            translateY = currentTransform.y;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        });

        const updatePosition = () => {
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            rAFId = null;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            translateX += deltaX;
            translateY += deltaY;
            startX = e.clientX;
            startY = e.clientY;
            if (rAFId === null) {
                rAFId = requestAnimationFrame(updatePosition);
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
                if (rAFId !== null) {
                    cancelAnimationFrame(rAFId);
                    rAFId = null;
                }
            }
        });
    }

    // V9.2: 折叠/还原 逻辑
    function toggleCollapse() {
        const panel = document.getElementById('dy-sniffer-panel');
        const restoreBtn = document.getElementById('dy-restore-btn');
        state.isPanelCollapsed = !state.isPanelCollapsed;

        if (state.isPanelCollapsed) {
            panel.style.display = 'none';
            restoreBtn.style.display = 'flex';
        } else {
            panel.style.display = 'flex';
            restoreBtn.style.display = 'none';
        }
    }

    function createUI() {
        // ... (保持 V9.4 逻辑不变) ...
        GM_addStyle(css);

        const panel = document.createElement('div');
        panel.id = 'dy-sniffer-panel';
        panel.innerHTML = `
            <div id="dy-sniffer-header">
                <span>🔍 视频捕获 (<span id="dy-count">0</span>)</span>
                <div>
                    <span class="dy-clear-btn" id="dy-clear">清空</span>
                    <span class="dy-close-btn" id="dy-toggle-collapse">×</span>
                </div>
            </div>
            <div id="dy-sniffer-content"><div style="text-align:center;color:#888;padding:20px;font-size:12px;">正在监听外部视频流...</div></div>
        `;
        document.body.appendChild(panel);

        const restoreBtn = document.createElement('button');
        restoreBtn.id = 'dy-restore-btn';
        restoreBtn.innerHTML = '&#8644; 还原';
        document.body.appendChild(restoreBtn);

        document.getElementById('dy-clear').onclick = () => {
            document.getElementById('dy-sniffer-content').innerHTML = '';
            state.items = []; state.urls.clear(); document.getElementById('dy-count').innerText = '0';
        };
        document.getElementById('dy-toggle-collapse').onclick = toggleCollapse;
        restoreBtn.onclick = toggleCollapse;

        makeDraggable(panel, document.getElementById('dy-sniffer-header'));
    }

    // V9.5 核心去重和合并逻辑
    function addVideoToUI(meta) {
        const cleanUrl = cleanAndNormalizeUrl(meta.url);
        if (!cleanUrl) return;

        const videoId = meta.id || extractCurrentVideoId();
        const idDisplay = videoId ? `ID: ${videoId}` : 'ID: 未捕获';

        // 1. 尝试通过 ID 查找现有项 (V9.5 优先查找 ID)
        let existingItem = videoId ? state.items.find(item => item.id === videoId) : null;

        // 2. 如果通过 ID 找到了，则尝试更新/替换 URL
        if (existingItem) {
            let shouldUpdateUrl = false;

            // 策略：API 链接总是优先于其他链接
            if (meta.source === 'API' && existingItem.source !== 'API') {
                 shouldUpdateUrl = true;
            }
            // 策略：如果都是 DOM/NET 来源，使用第一个捕获到的链接（以 cleanUrl 为准）
            else if (existingItem.cleanUrl === cleanUrl) {
                // 如果是相同的 cleanUrl，仅更新非URL信息 (标题/封面)
            } else {
                // 如果 ID 相同但 cleanUrl 不同，并且新来源不是 API 且老来源是 API，则忽略新链接
                if (existingItem.source === 'API' && meta.source !== 'API') {
                    return;
                }
                // 如果 ID 相同但 cleanUrl 不同，且新来源更优（API），则替换
                if (meta.source === 'API') {
                    shouldUpdateUrl = true;
                }
            }

            // --- 执行更新 ---
            let isUpdated = false;

            if (shouldUpdateUrl) {
                // 替换 URL
                existingItem.url = meta.url;
                existingItem.cleanUrl = cleanUrl;
                existingItem.source = meta.source;
                console.log(`[抖音助手] ID ${videoId} URL 已替换为 ${meta.source} 高质量链接。`);
                isUpdated = true;
            }

            // 更新标题/封面
            if (meta.title && meta.title.length > existingItem.el.dataset.title.length) {
                existingItem.el.dataset.title = meta.title;
                isUpdated = true;
            }
            if (meta.cover && existingItem.cover === null) {
                existingItem.cover = meta.cover;
                existingItem.el.querySelector('.dy-cover-img').src = meta.cover;
                isUpdated = true;
            }

            if (isUpdated || shouldUpdateUrl) {
                // 刷新 UI 标记和信息
                const sourceColor = existingItem.source === 'API' ? '#587edb' : (existingItem.source === 'DOM' ? '#e68e20' : '#333');
                existingItem.el.querySelector('.tag-api').innerText = existingItem.source;
                existingItem.el.querySelector('.tag-api').style.background = sourceColor;
                existingItem.el.querySelector('.dy-item-title').innerHTML =
                    `<span class="dy-tag tag-playing">播放中</span><span class="dy-tag tag-api" style="background:${sourceColor};">${existingItem.source}</span> ${existingItem.el.dataset.title}`;
            }

            // ID 匹配的视频已处理，直接返回
            return;
        }

        // 3. 如果 ID 缺失，则使用 URL 查找（回退到 V9.4 逻辑）
        existingItem = state.items.find(item => item.cleanUrl === cleanUrl);
        if (existingItem) {
            // 确保没有 ID 的项目，如果新数据有 ID，则更新 ID 并走 2 的流程
            if (videoId && existingItem.id === null) {
                existingItem.id = videoId;
                existingItem.el.querySelector('.dy-item-id').innerText = idDisplay;
                // 找到 ID 后，理论上 shouldUpdateUrl 也会被触发，但为了简化，这里不再深度检查，仅更新 ID 即可。
            }
            return;
        }


        // 4. 创建新列表项

        const container = document.getElementById('dy-sniffer-content');
        if (container && container.innerText.includes("正在监听")) container.innerHTML = '';
        if (!container) return;

        document.getElementById('dy-count').innerText = parseInt(document.getElementById('dy-count').innerText) + 1;

        const itemEl = document.createElement('div');
        itemEl.className = 'dy-item';
        itemEl.dataset.title = meta.title;

        const safeTitle = meta.title.replace(/[\\/:*?"<>|]/g, '_').trim() || `douyin_${Date.now()}`;

        const sourceColor = meta.source === 'API' ? '#587edb' : (meta.source === 'DOM' ? '#e68e20' : '#333');
        let coverHtml = meta.cover ? `<img src="${meta.cover}" class="dy-cover-img">` : `<div class="dy-cover-img" style="display:flex;align-items:center;justify-content:center;color:#666;border:1px solid #444;">${meta.source}</div>`;

        itemEl.innerHTML = `
            ${coverHtml}
            <div class="dy-info">
                <div class="dy-item-title" title="${meta.title}">
                    <span class="dy-tag tag-playing">播放中</span>
                    <span class="dy-tag tag-api" style="background:${sourceColor};">${meta.source}</span>
                    ${meta.title}
                </div>
                <div class="dy-item-id">${idDisplay}</div>
                <div class="dy-btn-group">
                    <button class="dy-action-btn dy-btn-jump ${videoId ? '' : 'dy-btn-disabled'}">${videoId ? '跳转' : 'ID缺失'}</button>
                    <button class="dy-action-btn dy-btn-down">下载</button>
                </div>
            </div>
        `;

        const jumpBtn = itemEl.querySelector('.dy-btn-jump');
        if (videoId) {
            jumpBtn.onclick = () => { window.open(`https://www.douyin.com/video/${videoId}`, '_blank'); };
        }

        const downBtn = itemEl.querySelector('.dy-btn-down');
        // V9.5 确保下载按钮使用当前 meta.url
        downBtn.onclick = () => forceDownload(meta.url, safeTitle + '.mp4', downBtn);

        container.appendChild(itemEl);

        state.urls.add(cleanUrl);
        state.items.push({
            id: videoId || null,
            el: itemEl,
            url: meta.url,
            cleanUrl: cleanUrl,
            source: meta.source,
            cover: meta.cover || null
        });
    }

    // 统一的核心服务启动函数
    function startCoreServices() {
        createUI();
        startTitleAndIDExtractor();
        startDOMVideoURLSniffer();
    }

    // 真正的初始化函数
    function init() {
        if (document.body) {
            startCoreServices();
        } else {
            const observer = new MutationObserver((mutationsList, observer) => {
                if (document.body) {
                    observer.disconnect();
                    startCoreServices();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }

    // 下载逻辑 (保持 V9.4 不变)
    function forceDownload(url, filename, btn) {
        if (btn.classList.contains('dy-btn-disabled')) return;
        btn.innerText = "0%"; btn.classList.add('dy-btn-disabled');
        GM_xmlhttpRequest({
            method: "GET", url: url, responseType: "blob",
            headers: { "Referer": "https://www.douyin.com/", "User-Agent": navigator.userAgent },
            onprogress: (p) => { if(p.total>0) btn.innerText = Math.round((p.loaded/p.total)*100) + "%"; },
            onload: (r) => {
                if (r.status === 200) {
                    const u = window.URL.createObjectURL(r.response);
                    const a = document.createElement('a'); a.href = u; a.download = filename;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    window.URL.revokeObjectURL(u);
                    btn.innerText = "完成";
                    setTimeout(() => { btn.innerText = "下载"; btn.classList.remove('dy-btn-disabled'); }, 2000);
                } else { handleError(btn); }
            },
            onerror: () => handleError(btn)
        });
    }

    function handleError(btn) {
        btn.innerText = "失败"; btn.style.background = "#555";
        alert("下载失败！请复制链接到浏览器新窗口打开，或尝试刷新页面。");
        setTimeout(() => { btn.innerText = "下载"; btn.classList.remove('dy-btn-disabled'); btn.style.background = "#fe2c55"; }, 3000);
    }

    init();
})();