// ==UserScript==
// @name         X 媒体下载器 (X Media Downloader)
// @namespace    
// @version      1.2.0
// @description  在 X (Twitter) 帖子底部添加下载按钮，一键下载所有图片（原图）和视频（最高画质）。
// @description:en One-click download of all images (original quality) and videos (highest quality) from X (Twitter) tweets.
// @author       User & Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_download
// @grant        GM_addStyle
// @connect      twitter.com
// @connect      x.com
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @author       VoidMuser
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556548/X%20%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28X%20Media%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556548/X%20%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28X%20Media%20Downloader%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ X 媒体下载器已加载 ');

    // ==========================================
    // 1. 核心数据存储
    // ==========================================
    const mediaMap = new Map();

    // ==========================================
    // 2. 图标与样式定义 (SVG)
    // ==========================================

    // 下载图标 (箭头)
    const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" class="xmd-icon-main"><path d="M12 15.586l-4.293-4.293-1.414 1.414L12 18.414l5.707-5.707-1.414-1.414z"></path><path d="M11 2h2v14h-2z"></path><path d="M5 20h14v2H5z"></path></svg>`;

    // 加载中圆环 (用于动画)
    // r=10, circle length approx 63. This ring sits on top.
    const ICON_LOADING_RING = `
        <svg viewBox="0 0 24 24" class="xmd-ring-svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#00ba7c" stroke-width="2.5" stroke-linecap="round"></circle>
        </svg>
    `;

    // 成功图标 (钩)
    const ICON_SUCCESS = `<svg viewBox="0 0 24 24" class="xmd-icon-result"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>`;

    // 失败图标 (叉)
    const ICON_ERROR = `<svg viewBox="0 0 24 24" class="xmd-icon-result"><path d="M13.414 12l4.293-4.293-1.414-1.414L12 10.586 7.707 6.293 6.293 7.707 10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12z"></path></svg>`;

    GM_addStyle(`
        /* 按钮容器 */
        .xmd-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%; /* 圆形 */
            cursor: pointer;
            transition: all 0.2s ease;
            color: rgb(113, 118, 123); /* 默认灰色 */
            margin-left: 2px;
            overflow: hidden; /* 确保背景色填满圆形 */
        }
        
        /* 悬停效果 */
        .xmd-btn:hover:not(.xmd-loading):not(.xmd-success):not(.xmd-error) {
            background-color: rgba(29, 155, 240, 0.1);
            color: rgb(29, 155, 240);
        }

        /* 图标通用样式 */
        .xmd-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: opacity 0.2s;
        }

        /* --- 状态：加载中 --- */
        .xmd-btn.xmd-loading {
            pointer-events: none;
        }
        
        /* 加载时：原图标变淡变灰 */
        .xmd-btn.xmd-loading .xmd-icon-main {
            opacity: 0.3;
            color: rgb(180, 180, 180);
        }

        /* 加载环的位置 */
        .xmd-ring-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important; /* 撑满容器 */
            height: 100% !important;
            transform: rotate(-90deg); /* 从12点方向开始 */
            opacity: 0;
            pointer-events: none;
        }

        /* 加载环动画显示 */
        .xmd-btn.xmd-loading .xmd-ring-svg {
            opacity: 1;
        }

        /* 圆环的描边动画：stroke-dasharray 控制虚线长短 */
        .xmd-btn.xmd-loading circle {
            stroke-dasharray: 63; /* 圆周长 2*PI*10 ≈ 63 */
            stroke-dashoffset: 63; /* 初始完全隐藏 */
            animation: xmd-fill-circle 1.5s ease-in-out infinite;
        }

        @keyframes xmd-fill-circle {
            0% { stroke-dashoffset: 63; }
            100% { stroke-dashoffset: 0; }
        }

        /* --- 状态：成功 (满屏绿底白钩) --- */
        .xmd-btn.xmd-success {
            background-color: rgb(0, 186, 124) !important; /* 绿色背景 */
            color: white !important;
            transform: scale(1.1); /* 轻微放大 */
        }

        /* --- 状态：失败 (满屏红底白叉) --- */
        .xmd-btn.xmd-error {
            background-color: rgb(249, 24, 128) !important; /* 红色背景 */
            color: white !important;
            transform: scale(1.1);
        }

        /* 结果图标动画 (弹出效果) */
        .xmd-icon-result {
            animation: xmd-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes xmd-pop {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    `);

    // ==========================================
    // 3. 工具函数
    // ==========================================
    
    // ... (保持原有的 ID 提取、文件名处理、下载封装等函数不变，此处省略以节省篇幅，完全复用之前的逻辑) ...
    function extractStatusId(url) {
        if (!url) return null;
        const m = url.match(/\/status\/(\d+)/);
        return m ? m[1] : null;
    }

    function unique(arr) { return [...new Set(arr)]; }

    function getFileExtFromUrl(url, fallback = 'jpg') {
        try {
            const u = new URL(url);
            const parts = u.pathname.split('.');
            if (parts.length > 1) {
                return parts.pop().replace(/[^a-zA-Z0-9]/g, '') || fallback;
            }
        } catch (e) {}
        return fallback;
    }

    function toOriginalImageUrl(url) {
        if (!url) return url;
        try {
            const u = new URL(url);
            u.searchParams.set('name', 'orig');
            return u.toString();
        } catch (e) { return url; }
    }

    function sanitizeFilename(name) {
        let safeName = (name || 'media').replace(/[\/\\\?\%\*\:\|"<>\r\n]/g, '_').trim();
        if (safeName.length > 80) safeName = safeName.substring(0, 80);
        return safeName || 'media';
    }

    function buildFilenameBase(mediaInfo, tweetId) {
        const text = mediaInfo.text || '';
        const cleanText = text.replace(/https:\/\/t\.co\/\w+/g, '').trim();
        if (cleanText) return `${sanitizeFilename(cleanText)}_${tweetId}`;
        return `tweet_${tweetId}`;
    }

    function gmDownload(url, filename) {
        return new Promise((resolve, reject) => {
            GM_download({
                url,
                name: filename,
                saveAs: true,
                onload: resolve,
                onerror: reject
            });
        });
    }

    // ==========================================
    // 4. API 数据解析 
    // ==========================================

    function processResponseBody(text) {
        try {
            const data = JSON.parse(text);
            traverseForMedia(data);
        } catch (e) {}
    }

    function traverseForMedia(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (obj.extended_entities?.media) {
            collectMediaFromNode(obj, obj.extended_entities.media);
        } else if (obj.legacy?.extended_entities?.media) {
            collectMediaFromNode(obj.legacy, obj.legacy.extended_entities.media);
        }
        for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') traverseForMedia(obj[key]);
        }
    }

    function collectMediaFromNode(node, mediaArray) {
        if (!mediaArray || !mediaArray.length) return;
        const idCandidates = [node.id_str, node.rest_id, node.conversation_id_str, node.legacy?.id_str].filter(Boolean);
        if (!idCandidates.length) return;

        const fullText = node.full_text || node.legacy?.full_text || node.text || '';

        idCandidates.forEach(tweetId => {
            if (!mediaMap.has(tweetId)) {
                mediaMap.set(tweetId, { id: tweetId, text: fullText, photos: [], videos: [] });
            }
            const existing = mediaMap.get(tweetId);
            mediaArray.forEach(m => {
                if (m.type === 'photo') {
                    const url = toOriginalImageUrl(m.media_url_https || m.media_url);
                    if (!existing.photos.includes(url)) existing.photos.push(url);
                } else if (m.type === 'video' || m.type === 'animated_gif') {
                    const variants = m.video_info?.variants || [];
                    const best = variants.filter(v => v.content_type === 'video/mp4').sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
                    if (best && !existing.videos.some(v => v.url === best.url)) existing.videos.push({ url: best.url, bitrate: best.bitrate });
                }
            });
        });
    }

    // ==========================================
    // 5. 网络请求拦截
    // ==========================================
    const API_REGEX = /(api\.)?(twitter|x)\.com\/(i\/api\/)?(2|media|graphql|1\.1)\//i;

    function hookFetch() {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);
            const url = args[0] instanceof Request ? args[0].url : args[0];
            if (API_REGEX.test(url) && response.ok) {
                 const clone = response.clone();
                 clone.text().then(processResponseBody).catch(()=>{});
            }
            return response;
        };
    }

    function hookXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
                if (API_REGEX.test(this._url) && this.responseText) processResponseBody(this.responseText);
            });
            return originalSend.apply(this, arguments);
        };
    }

    // ==========================================
    // 6. UI 注入与交互
    // ==========================================

    function observeArticles() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    document.querySelectorAll('article:not([data-xmd-init])').forEach(initArticle);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initArticle(article) {
        article.setAttribute('data-xmd-init', 'true');
        const hasMedia = article.querySelector('[data-testid="videoPlayer"], [data-testid="tweetPhoto"]');
        if (!hasMedia) return;
        const group = article.querySelector('div[role="group"]');
        if (!group) return;

        const btn = document.createElement('div');
        btn.className = 'xmd-btn';
        btn.title = "下载媒体";
        
        // 初始 HTML：图标 + 隐藏的加载环
        btn.innerHTML = ICON_DOWNLOAD + ICON_LOADING_RING;

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownload(article, btn);
        };

        group.appendChild(btn);
    }

    async function handleDownload(article, btn) {
        if (btn.classList.contains('xmd-loading')) return;

        // 1. 获取 ID
        const links = Array.from(article.querySelectorAll('a[href*="/status/"]'));
        const tweetIds = unique(links.map(a => extractStatusId(a.href)).filter(Boolean));
        if (tweetIds.length === 0) return;

        // 2. 切换到【加载中】状态
        // (CSS 会自动淡化 ICON_DOWNLOAD，并显示 ICON_LOADING_RING 开始动画)
        btn.classList.add('xmd-loading');

        const tasks = [];
        const seenUrls = new Set();

        tweetIds.forEach(id => {
            const data = mediaMap.get(id);
            if (!data) return;
            const baseName = buildFilenameBase(data, id);
            let index = 0;
            const allMedia = [
                ...data.photos.map(url => ({ type: 'img', url })),
                ...data.videos.map(v => ({ type: 'vid', url: v.url }))
            ];
            allMedia.forEach(m => {
                if (seenUrls.has(m.url)) return;
                seenUrls.add(m.url);
                index++;
                const ext = m.type === 'img' ? getFileExtFromUrl(m.url) : 'mp4';
                const filename = allMedia.length > 1 ? `${baseName}_${index}.${ext}` : `${baseName}.${ext}`;
                tasks.push(() => gmDownload(m.url, filename));
            });
        });

        // 延迟函数（用于展示成功/失败状态）
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        // 最小加载时间 (让用户看清动画，防止闪烁)
        const minLoadTime = wait(600);

        try {
            if (tasks.length === 0) {
                throw new Error("No media found");
            }
            
            // 执行下载并等待最小时间
            await Promise.all([Promise.all(tasks.map(t => t())), minLoadTime]);
            
            // 3. 切换到【成功】状态
            // 移除加载类，添加成功类
            btn.classList.remove('xmd-loading');
            btn.classList.add('xmd-success');
            // 替换内容为钩
            btn.innerHTML = ICON_SUCCESS;

        } catch (err) {
            // 3. 切换到【失败】状态
            await minLoadTime; // 确保至少转了一会儿
            btn.classList.remove('xmd-loading');
            btn.classList.add('xmd-error');
            // 替换内容为叉
            btn.innerHTML = ICON_ERROR;
        }

        // 4. 【恢复】状态
        // 停留 1.5 秒后恢复初始样貌
        await wait(1500);
        
        // 移除所有状态类
        btn.classList.remove('xmd-success', 'xmd-error');
        // 恢复初始 HTML (箭头 + 隐藏环)
        btn.innerHTML = ICON_DOWNLOAD + ICON_LOADING_RING;
    }

    // ==========================================
    // 7. 启动
    // ==========================================
    hookFetch();
    hookXHR();
    setTimeout(observeArticles, 1000);

})();