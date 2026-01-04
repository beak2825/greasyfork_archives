// ==UserScript==
// @name         草榴Manager
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  草榴搜索/板块悬停放大封面、标题预览图、品质徽章与 qBittorrent 一键发送和下载按钮。
// @author       truclocphung1713
// @match        https://t66y.com/search.php*
// @match        https://t66y.com/thread0806.php*
// @match        https://t66y.com/htm_data/*
// @match        http://t66y.com/search.php*
// @match        http://t66y.com/thread0806.php*
// @match        http://t66y.com/htm_data/*
// @icon         none
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      www.rmdown.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/556977/%E8%8D%89%E6%A6%B4Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/556977/%E8%8D%89%E6%A6%B4Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const downloadResolveCache = new Map();
    const DOWNLOAD_RECORDS_KEY = '草榴ManagerDownloadedThreads';
    let downloadRecordsCache = null;
    const downloadStatusListeners = new Map();

    /**
     * 向页面注入 CSS
     */
    function injectStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function fetchCrossOriginText(url) {
        if (!url) {
            return Promise.reject(new Error('無效的請求地址'));
        }
        if (typeof GM_xmlhttpRequest === 'function') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers: {
                        'Referer': 'https://www.rmdown.com/'
                    },
                    onload: (resp) => {
                        if (resp.status >= 200 && resp.status < 400) {
                            resolve(resp.responseText);
                        } else {
                            reject(new Error('HTTP ' + resp.status));
                        }
                    },
                    onerror: () => reject(new Error('網絡錯誤')),
                    ontimeout: () => reject(new Error('請求超時'))
                });
            });
        }
        return fetch(url, { credentials: 'include' }).then(resp => {
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            return resp.text();
        });
    }

    function fetchCrossOriginBinary(url, options = {}) {
        if (!url) {
            return Promise.reject(new Error('無效的請求地址'));
        }
        const headers = {
            'Referer': options.referer || 'https://www.rmdown.com/',
            ...(options.headers || {})
        };
        const method = options.method || 'GET';
        if (typeof GM_xmlhttpRequest === 'function') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url,
                    headers,
                    responseType: 'arraybuffer',
                    onload: (resp) => {
                        if (resp.status >= 200 && resp.status < 400) {
                            resolve({
                                buffer: resp.response,
                                headers: resp.responseHeaders || ''
                            });
                        } else {
                            reject(new Error('HTTP ' + resp.status));
                        }
                    },
                    onerror: () => reject(new Error('網絡錯誤')),
                    ontimeout: () => reject(new Error('請求超時'))
                });
            });
        }
        return fetch(url, {
            method,
            headers,
            credentials: 'include'
        }).then(async (resp) => {
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            const buffer = await resp.arrayBuffer();
            return {
                buffer,
                headers: resp.headers
            };
        });
    }

    function extractFilenameFromContentDisposition(headerValue) {
        if (!headerValue) return '';
        let matched = headerValue.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
        if (matched && matched[1]) {
            try {
                return decodeURIComponent(matched[1].trim().replace(/["']/g, ''));
            } catch (err) {
                return matched[1].trim().replace(/["']/g, '');
            }
        }
        matched = headerValue.match(/filename="([^"]+)"/i);
        if (matched && matched[1]) {
            return matched[1].trim();
        }
        matched = headerValue.match(/filename=([^;]+)/i);
        if (matched && matched[1]) {
            return matched[1].trim().replace(/["']/g, '');
        }
        return '';
    }

    function extractFilenameFromHeaders(headers) {
        if (!headers) return '';
        if (typeof headers === 'string') {
            const lines = headers.split(/\r?\n/);
            for (const line of lines) {
                if (!line) continue;
                if (line.toLowerCase().startsWith('content-disposition')) {
                    const value = line.split(':').slice(1).join(':').trim();
                    return extractFilenameFromContentDisposition(value);
                }
            }
            return '';
        }
        if (typeof headers.get === 'function') {
            const value = headers.get('content-disposition');
            return extractFilenameFromContentDisposition(value || '');
        }
        return '';
    }

    function ensureArrayBuffer(data) {
        if (!data) return null;
        if (data instanceof ArrayBuffer) {
            return data;
        }
        if (ArrayBuffer.isView(data)) {
            return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        }
        return null;
    }

    function gmCompatibleFetch(url, options = {}) {
        const method = options.method || 'GET';
        const headers = options.headers ? { ...options.headers } : {};
        let body = options.body;
        if (body instanceof URLSearchParams) {
            if (!headers['Content-Type'] && !headers['content-type']) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
            body = body.toString();
        }
        if (typeof GM_xmlhttpRequest !== 'function') {
            return fetch(url, {
                ...options,
                method,
                headers,
                body
            });
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data: body,
                timeout: options.timeout || 20000,
                anonymous: options.credentials === 'omit',
                responseType: options.responseType || 'text',
                onload: (resp) => {
                    const responseText = resp.responseText ?? '';
                    resolve({
                        ok: resp.status >= 200 && resp.status < 300,
                        status: resp.status,
                        statusText: resp.statusText || '',
                        headers: resp.responseHeaders || '',
                        text: () => Promise.resolve(responseText),
                        json: () => Promise.resolve(responseText ? JSON.parse(responseText) : null)
                    });
                },
                onerror: (resp) => {
                    reject(new Error(resp?.statusText || '網絡錯誤'));
                },
                ontimeout: () => reject(new Error('請求超時'))
            });
        });
    }

    const href = location.href;

    const threadDataCache = new Map();
    let currentListHoverCtx = null;
    let gallerySourceHighlight = null;

    function setCurrentListHover(ctx) {
        currentListHoverCtx = ctx;
    }

    function clearGallerySourceHighlight() {
        if (gallerySourceHighlight?.element && gallerySourceHighlight.className) {
            try {
                gallerySourceHighlight.element.classList.remove(gallerySourceHighlight.className);
            } catch (err) {
                // 元素可能已被移除，忽略錯誤
            }
        }
        gallerySourceHighlight = null;
    }

    function applyGallerySourceHighlight(ctx) {
        if (!ctx || !ctx.threadUrl) {
            clearGallerySourceHighlight();
            return;
        }
        let target = null;
        let className = '';
        if (ctx.source === 'board' && ctx.cover instanceof HTMLElement) {
            target = ctx.cover;
            className = 'clm-gallery-focus-cover';
        } else if (ctx.source === 'search' && ctx.titleEl instanceof HTMLElement) {
            target = ctx.titleEl;
            className = 'clm-gallery-focus-title';
        }
        if (!target || !className) {
            clearGallerySourceHighlight();
            return;
        }
        clearGallerySourceHighlight();
        target.classList.add(className);
        gallerySourceHighlight = { element: target, className, threadUrl: ctx.threadUrl };
    }

    function focusGallerySource(threadUrl, ctxOverride = null) {
        if (!threadUrl) {
            clearGallerySourceHighlight();
            return;
        }
        const normalizedTarget = normalizeThreadKey(threadUrl);
        if (!normalizedTarget) {
            clearGallerySourceHighlight();
            return;
        }
        let candidate = ctxOverride;
        if (!candidate || normalizeThreadKey(candidate.threadUrl) !== normalizedTarget) {
            if (currentListHoverCtx && normalizeThreadKey(currentListHoverCtx.threadUrl) === normalizedTarget) {
                candidate = currentListHoverCtx;
            }
        }
        if (candidate) {
            applyGallerySourceHighlight(candidate);
        } else {
            clearGallerySourceHighlight();
        }
    }

    function getAbsoluteUrl(url, base = location.href) {
        if (!url) return null;
        try {
            return new URL(url, base).href;
        } catch (e) {
            console.warn('clm 無法解析 URL', url, e);
            return null;
        }
    }

    function normalizeThreadKey(threadUrl) {
        const abs = getAbsoluteUrl(threadUrl);
        if (!abs) return null;
        try {
            const u = new URL(abs);
            u.hash = '';
            return u.href;
        } catch (e) {
            return abs;
        }
    }

    const GALLERY_VISITED_STORAGE_KEY = '草榴ManagerGalleryVisited';
    const MAX_GALLERY_VISITED_ENTRIES = 400;
    let galleryVisitedCache = null;

    function loadGalleryVisitedRecords() {
        try {
            const raw = localStorage.getItem(GALLERY_VISITED_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    return parsed;
                }
            }
        } catch (err) {
            console.warn('草榴Manager: 無法讀取畫廊歷史記錄', err);
        }
        return {};
    }

    function getGalleryVisitedRecords() {
        if (!galleryVisitedCache) {
            galleryVisitedCache = loadGalleryVisitedRecords();
        }
        return galleryVisitedCache;
    }

    function persistGalleryVisitedRecords() {
        if (!galleryVisitedCache) {
            galleryVisitedCache = {};
        }
        try {
            localStorage.setItem(GALLERY_VISITED_STORAGE_KEY, JSON.stringify(galleryVisitedCache));
        } catch (err) {
            console.warn('草榴Manager: 無法保存畫廊歷史記錄', err);
        }
    }

    function pruneGalleryVisitedRecords(records) {
        const keys = Object.keys(records);
        if (keys.length <= MAX_GALLERY_VISITED_ENTRIES) {
            return [];
        }
        const sorted = keys.sort((a, b) => (records[b] || 0) - (records[a] || 0));
        const removed = [];
        for (let i = MAX_GALLERY_VISITED_ENTRIES; i < sorted.length; i++) {
            const key = sorted[i];
            removed.push(key);
            delete records[key];
        }
        return removed;
    }

    function resolveThreadKey(keyOrUrl) {
        if (!keyOrUrl) return null;
        if (
            keyOrUrl.startsWith('http://') ||
            keyOrUrl.startsWith('https://') ||
            keyOrUrl.startsWith('//') ||
            keyOrUrl.startsWith('/')
        ) {
            return normalizeThreadKey(keyOrUrl);
        }
        return keyOrUrl;
    }

    function hasGalleryVisitedThread(keyOrUrl) {
        const threadKey = resolveThreadKey(keyOrUrl);
        if (!threadKey) return false;
        const records = getGalleryVisitedRecords();
        return !!records[threadKey];
    }

    function applyVisitedStateToElement(el, visited) {
        if (!el || !el.dataset) return;
        const variant = el.dataset.clmGalleryVisitedVariant;
        if (!variant) return;
        if (variant === 'cover') {
            el.classList.toggle('clm-gallery-visited-cover', !!visited);
        } else if (variant === 'title') {
            el.classList.toggle('clm-gallery-visited-title', !!visited);
        }
    }

    function refreshGalleryVisitedStateForKey(threadKey) {
        if (!threadKey) return;
        const visited = hasGalleryVisitedThread(threadKey);
        document.querySelectorAll('[data-clm-gallery-visited-variant]').forEach((el) => {
            if (el.dataset.clmThreadKey === threadKey) {
                applyVisitedStateToElement(el, visited);
            }
        });
    }

    function bindGalleryVisitedIndicator(element, threadUrl, variant) {
        if (!element || !threadUrl) return null;
        const threadKey = normalizeThreadKey(threadUrl);
        if (!threadKey) return null;
        element.dataset.clmThreadKey = threadKey;
        if (variant) {
            element.dataset.clmGalleryVisitedVariant = variant;
        }
        applyVisitedStateToElement(element, hasGalleryVisitedThread(threadKey));
        return threadKey;
    }

    function markThreadGalleryVisited(threadUrl) {
        const threadKey = normalizeThreadKey(threadUrl);
        if (!threadKey) return;
        const records = getGalleryVisitedRecords();
        records[threadKey] = Date.now();
        const removedKeys = pruneGalleryVisitedRecords(records);
        persistGalleryVisitedRecords();
        refreshGalleryVisitedStateForKey(threadKey);
        removedKeys.forEach((key) => refreshGalleryVisitedStateForKey(key));
    }

    function getDownloadRecords() {
        if (!downloadRecordsCache) {
            downloadRecordsCache = loadDownloadRecordsFromStorage();
        }
        return downloadRecordsCache;
    }

    function loadDownloadRecordsFromStorage() {
        try {
            const raw = localStorage.getItem(DOWNLOAD_RECORDS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    return parsed;
                }
            }
        } catch (err) {
            console.warn('草榴Manager: 無法讀取下載記錄', err);
        }
        return {};
    }

    function persistDownloadRecords() {
        if (!downloadRecordsCache) {
            downloadRecordsCache = {};
        }
        try {
            localStorage.setItem(DOWNLOAD_RECORDS_KEY, JSON.stringify(downloadRecordsCache));
        } catch (err) {
            console.warn('草榴Manager: 無法保存下載記錄', err);
        }
    }

    function hasDownloadedThread(threadUrl) {
        const key = normalizeThreadKey(threadUrl);
        if (!key) return false;
        const records = getDownloadRecords();
        return !!records[key];
    }

    function markThreadDownloaded(threadUrl) {
        const key = normalizeThreadKey(threadUrl);
        if (!key) return;
        const records = getDownloadRecords();
        records[key] = Date.now();
        persistDownloadRecords();
        notifyDownloadStatusChange(key);
    }

    function subscribeDownloadStatus(threadUrl, handler) {
        const key = normalizeThreadKey(threadUrl);
        if (!key || typeof handler !== 'function') {
            return () => {};
        }
        if (!downloadStatusListeners.has(key)) {
            downloadStatusListeners.set(key, new Set());
        }
        const listeners = downloadStatusListeners.get(key);
        listeners.add(handler);
        return () => {
            listeners.delete(handler);
            if (!listeners.size) {
                downloadStatusListeners.delete(key);
            }
        };
    }

    function notifyDownloadStatusChange(threadKey) {
        const listeners = downloadStatusListeners.get(threadKey);
        if (!listeners) return;
        listeners.forEach((fn) => {
            try {
                fn(true);
            } catch (err) {
                console.warn('草榴Manager: 下載狀態回調失敗', err);
            }
        });
    }

    const QB_LOG_STORAGE_KEY = '草榴ManagerQbLogs';
    const MAX_QB_LOG_ENTRIES = 80;
    let qbLogCache = null;
    const qbLogSubscribers = new Set();

    function loadQbLogsFromStorage() {
        try {
            const raw = localStorage.getItem(QB_LOG_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (err) {
            console.warn('草榴Manager: 無法讀取日志', err);
        }
        return [];
    }

    function getQbLogs() {
        if (!qbLogCache) {
            qbLogCache = loadQbLogsFromStorage();
        }
        return qbLogCache;
    }

    function persistQbLogs() {
        if (!qbLogCache) return;
        try {
            localStorage.setItem(QB_LOG_STORAGE_KEY, JSON.stringify(qbLogCache));
        } catch (err) {
            console.warn('草榴Manager: 無法保存日志', err);
        }
    }

    function appendQbLog(message, level = 'info') {
        const logs = getQbLogs();
        logs.push({
            id: Date.now() + '_' + Math.random().toString(16).slice(2),
            time: Date.now(),
            level,
            message
        });
        while (logs.length > MAX_QB_LOG_ENTRIES) {
            logs.shift();
        }
        persistQbLogs();
        qbLogSubscribers.forEach((fn) => {
            try {
                fn(logs.slice());
            } catch (err) {
                console.warn('草榴Manager: 日志訂閱回調失敗', err);
            }
        });
    }

    function clearQbLogs() {
        qbLogCache = [];
        persistQbLogs();
        qbLogSubscribers.forEach((fn) => {
            try {
                fn([]);
            } catch (err) {
                console.warn('草榴Manager: 日志訂閱回調失敗', err);
            }
        });
    }

    function subscribeQbLogs(handler) {
        if (typeof handler !== 'function') {
            return () => {};
        }
        qbLogSubscribers.add(handler);
        return () => {
            qbLogSubscribers.delete(handler);
        };
    }

    function formatLogTime(ts) {
        const date = new Date(ts);
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    let toastContainer = null;
    let toastStyleInjected = false;

    function ensureToastContainer() {
        if (toastContainer) return toastContainer;
        toastContainer = document.createElement('div');
        toastContainer.className = 'clm-toast-container';
        document.body.appendChild(toastContainer);
        if (!toastStyleInjected) {
            toastStyleInjected = true;
            injectStyle(`
                .clm-toast-container {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    z-index: 999999 !important;
                    pointer-events: none;
                }
                .clm-toast {
                    min-width: 220px;
                    max-width: 320px;
                    background: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    padding: 10px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
                    transform: translateY(20px);
                    opacity: 0;
                    transition: opacity 0.25s ease, transform 0.25s ease;
                }
                .clm-toast.clm-show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .clm-toast.clm-success {
                    background: rgba(22, 163, 74, 0.95);
                }
                .clm-toast.clm-error {
                    background: rgba(220, 38, 38, 0.95);
                }
                .clm-toast.clm-warning {
                    background: rgba(234, 179, 8, 0.95);
                    color: #1f2937;
                }
            `);
        }
        return toastContainer;
    }

    function showToast(message, type = 'info', duration = 4000) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `clm-toast clm-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('clm-show');
        });
        setTimeout(() => {
            toast.classList.remove('clm-show');
            setTimeout(() => {
                toast.remove();
            }, 250);
        }, duration);
    }

    function summarizeResource(value, maxLength = 80) {
        if (!value) return '未知資源';
        const str = String(value).trim();
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength - 3) + '...';
    }

    function collectGalleryImages(threadContent, baseHref = location.href) {
        if (!threadContent) return [];
        const seen = new Set();
        const gallery = [];

        function pushItem(rawUrl, label) {
            if (!rawUrl) return;
            // 排除广告占位符和无效URL
            if (rawUrl.includes('adblo_ck.jpg') || rawUrl.includes('http://a.d/')) return;
            const abs = getAbsoluteUrl(rawUrl, baseHref);
            if (!abs || seen.has(abs)) return;
            seen.add(abs);
            gallery.push({
                url: abs,
                label: label || ''
            });
        }

        // 收集所有带有真实图片数据的img标签
        // 优先查找在.tpc_content中的图片，排除广告区域
        const contentArea = threadContent.querySelector('.tpc_content') || threadContent;
        const allImages = contentArea.querySelectorAll('img[ess-data], img[iyl-data], img[data-src]');
        
        allImages.forEach(img => {
            // 优先使用ess-data，然后是data-src，最后是iyl-data
            const imgUrl = img.getAttribute('ess-data') ||
                img.getAttribute('data-src') ||
                img.getAttribute('iyl-data');
            
            if (imgUrl && !imgUrl.includes('adblo_ck.jpg') && !imgUrl.includes('http://a.d/')) {
                const label = img.getAttribute('title') || 
                    img.getAttribute('alt') || 
                    (gallery.length === 0 ? '封面' : `圖片 ${gallery.length + 1}`);
                pushItem(imgUrl, label);
            }
        });

        // 如果没有找到任何图片，尝试查找封面图片（兼容旧逻辑）
        if (gallery.length === 0) {
            const coverImg = threadContent.querySelector('img[ess-data], img[iyl-data], img[data-src], img[src*="pb_"], img[src*="cover"]');
            if (coverImg) {
                const coverUrl = coverImg.getAttribute('ess-data') ||
                    coverImg.getAttribute('data-src') ||
                    coverImg.getAttribute('iyl-data') ||
                    coverImg.src;
                if (coverUrl) {
                    pushItem(coverUrl, coverImg.getAttribute('title') || '封面');
                }
            }
        }

        // 收集.cl-gallery中的链接（兼容旧逻辑）
        const galleryAnchors = threadContent.querySelectorAll('.cl-gallery a[href]');
        galleryAnchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (!href) return;
            const label = anchor.querySelector('img')?.getAttribute('title') || anchor.textContent.trim() || '預覽';
            pushItem(href, label);
        });

        return gallery;
    }

    function extractCleanText(node) {
        if (!node) return '';
        const clone = node.cloneNode(true);
        const removable = clone.querySelectorAll('script, style, iframe, video, audio');
        removable.forEach(el => el.remove());
        
        // 将 <br> 和 <br/> 标签转换为换行符
        const brElements = clone.querySelectorAll('br');
        brElements.forEach(br => {
            const textNode = document.createTextNode('\n');
            br.parentNode.replaceChild(textNode, br);
        });
        
        const text = clone.textContent
            .replace(/\u00A0/g, ' ')
            .replace(/\s+\n/g, '\n')
            .replace(/\n{2,}/g, '\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
        return text;
    }

    function extractPostUser(contentEl) {
        if (!contentEl) return '';
        
        // 方法1：向上查找包含 tpc_content 的最外层 th（评论内容所在的 th）
        // 然后找到这个 th 所在行的第一个 th（用户名所在的 th）
        let current = contentEl;
        let outerTh = null;
        
        // 向上查找，找到包含 tpc_content 的最外层 th
        // 这个 th 应该包含一个 table 元素，并且这个 table 应该包含当前的 contentEl
        while (current && current !== document.body) {
            if (current.tagName === 'TH') {
                const table = current.querySelector('table');
                if (table && table.contains(contentEl)) {
                    outerTh = current;
                    break;
                }
            }
            current = current.parentElement;
        }
        
        if (outerTh) {
            // 找到这个 th 所在的 tr
            const row = outerTh.closest('tr');
            if (row) {
                // 查找同一行的第一个 th（包含用户名）
                const firstTh = row.querySelector('th:first-child');
                if (firstTh && firstTh !== outerTh) {
                    // 在第一个 th 中查找 b 标签（用户名）
                    const bTag = firstTh.querySelector('b');
                    if (bTag) {
                        const text = bTag.textContent.trim();
                        if (text) {
                            return text;
                        }
                    }
                }
            }
        }
        
        // 方法2：直接查找包含 tpc_content 的 div.t.t2 或 .t2，然后找第一行的第一个 th
        const tDiv = contentEl.closest('.t.t2, .t2');
        if (tDiv) {
            // 查找 tDiv 内的第一个 table（最外层的 table）
            const table = tDiv.querySelector('> table, table');
            if (table) {
                // 查找 table 的第一行（tbody 内的第一行，或者直接的第一行）
                const firstRow = table.querySelector('tbody > tr.tr1, tbody > tr:first-child, tr.tr1, tr:first-child');
                if (firstRow) {
                    // 查找第一行的第一个 th（包含用户名）
                    const firstTh = firstRow.querySelector('th:first-child');
                    if (firstTh) {
                        // 在第一个 th 中查找 b 标签（用户名）
                        const bTag = firstTh.querySelector('b');
                        if (bTag) {
                            const text = bTag.textContent.trim();
                            if (text) {
                                return text;
                            }
                        }
                    }
                }
            }
        }
        
        // 方法3：查找包含 tpc_content 的表格，向上找到包含它的最外层 table
        // 然后查找这个 table 的第一行第一个 th
        let table = contentEl.closest('table');
        if (table) {
            // 继续向上查找，找到最外层的 table（包含评论的 table）
            while (table && table.parentElement) {
                const parentTable = table.parentElement.closest('table');
                if (parentTable) {
                    table = parentTable;
                } else {
                    break;
                }
            }
            
            // 查找这个 table 的第一行第一个 th
            const firstRow = table.querySelector('tbody > tr:first-child, tr:first-child');
            if (firstRow) {
                const firstTh = firstRow.querySelector('th:first-child');
                if (firstTh) {
                    const bTag = firstTh.querySelector('b');
                    if (bTag) {
                        const text = bTag.textContent.trim();
                        if (text) {
                            return text;
                        }
                    }
                }
            }
        }
        
        // 最后备用方案：查找其他可能的位置
        const td = contentEl.closest('td');
        const row = td?.parentElement;
        const candidateContainers = new Set();

        if (row) {
            const firstCell = row.querySelector('td:first-child, th:first-child');
            if (firstCell && firstCell !== td) {
                candidateContainers.add(firstCell);
            }
            if (row.previousElementSibling) {
                candidateContainers.add(row.previousElementSibling);
            }
            candidateContainers.add(row);
        }

        candidateContainers.add(td?.previousElementSibling || null);
        candidateContainers.add(contentEl.closest('.tpc'));
        candidateContainers.add(contentEl.closest('table'));

        const selectors = [
            '.readName a',
            '.readName',
            '.tpc_info a',
            '.tpc_info',
            '.tipad a',
            '.tipad b',
            '.tal a',
            '.tal b',
            '.authi a',
            '.authi',
            'b'
        ];

        for (const container of candidateContainers) {
            if (!container) continue;
            for (const sel of selectors) {
                const target = container.querySelector(sel);
                if (target) {
                    const text = target.textContent.trim();
                    if (text) {
                        return text;
                    }
                }
            }
            if (container.dataset?.author) {
                const author = container.dataset.author.trim();
                if (author) return author;
            }
        }
        return '';
    }

    function parseTitleTags(titleText) {
        if (!titleText) return { quality: null, size: null, code: null, title: '' };
        
        // 移除 HTML 标签和多余空格
        const cleanTitle = titleText.replace(/<[^>]+>/g, '').trim();
        
        // 匹配格式：允许前面有前缀，如 "新作 [HD/5.75G] BOKD-305 标题文本"
        // 使用非贪婪匹配，确保能匹配到第一个 [ ] 对
        const match = cleanTitle.match(/\[([^\]]+)\]\s*(.+)$/);
        if (!match) {
            // 如果没有匹配到 [ ] 格式，尝试直接匹配番号格式
            // 例如：BOKD-303 标题文本
            const codeMatch = cleanTitle.match(/^([A-Z0-9]+[-_][0-9]+)\s+(.+)$/i);
            if (codeMatch) {
                return {
                    quality: null,
                    size: null,
                    code: codeMatch[1].toUpperCase(),
                    title: codeMatch[2].trim()
                };
            }
            return { quality: null, size: null, code: null, title: cleanTitle };
        }
        
        const bracketContent = match[1]; // HD/5.75G
        const titlePart = match[2]; // BOKD-305 AVデビュー ボクこう見えてオチンチンついてます。 神戸まこ。
        
        let quality = null;
        let size = null;
        let code = null;
        let title = '';
        
        // 解析括号内的内容：HD/5.75G
        const bracketParts = bracketContent.split('/');
        if (bracketParts.length >= 2) {
            // 第一个部分：清晰度 (SD/HD/4K/VR)
            const qualityPart = bracketParts[0].trim().toUpperCase();
            if (['SD', 'HD', '4K', 'VR'].includes(qualityPart)) {
                quality = qualityPart;
            }
            
            // 第二个部分：文件大小 (如 5.75G, 6.23G)
            const sizePart = bracketParts[1].trim();
            if (sizePart.match(/^[\d.]+[GMK]?B?$/i)) {
                size = sizePart.toUpperCase();
            }
        } else if (bracketContent.trim()) {
            // 如果只有一个部分，尝试判断是清晰度还是大小
            const singlePart = bracketContent.trim().toUpperCase();
            if (['SD', 'HD', '4K', 'VR'].includes(singlePart)) {
                quality = singlePart;
            } else if (singlePart.match(/^[\d.]+[GMK]?B?$/i)) {
                size = singlePart;
            }
        }
        
        // 解析标题部分：提取番号和片名
        // 匹配番号格式：BOKD-305 或类似格式 (字母数字-数字，支持多种分隔符)
        const codeMatch = titlePart.match(/^([A-Z0-9]+[-_][0-9]+)\s+(.+)$/i);
        if (codeMatch) {
            code = codeMatch[1].toUpperCase(); // BOKD-305
            title = codeMatch[2].trim(); // AVデビュー ボクこう見えてオチンチンついてます。 神戸まこ。
        } else {
            // 如果没有番号，整个作为标题
            title = titlePart.trim();
        }
        
        return { quality, size, code, title };
    }

    function collectThreadContext(doc) {
        const contentBlocks = Array.from(doc.querySelectorAll('.tpc_content'));
        if (!contentBlocks.length) {
            return {
                topic: null,
                comments: [],
                ads: []
            };
        }

        // 收集所有 ftad-ct 元素
        const allFtadElements = Array.from(doc.querySelectorAll('.ftad-ct'));
        const ads = allFtadElements.map(el => el.outerHTML);
        
        // 调试：输出收集到的广告数量
        if (ads.length > 0) {
            console.log('clm 收集到广告数量:', ads.length, ads);
        }

        // 获取标题（从 <td class="h"> 中获取）
        let titleInfo = null;
        let rawTitleText = null;
        // 查找 <td class="h"> 元素
        const hTd = doc.querySelector('td.h');
        if (hTd) {
            // 查找 <b>本頁主題:</b> 或 <b>本页主题:</b>
            const themeLabel = hTd.querySelector('b');
            if (themeLabel && (themeLabel.textContent.includes('本頁主題') || themeLabel.textContent.includes('本页主题'))) {
                // 获取 <b> 标签后面的所有内容
                let titleText = '';
                // 方法1：尝试从整个 td 的 innerHTML 中提取（保留格式信息）
                const fullHtml = hTd.innerHTML || '';
                const htmlMatch = fullHtml.match(/本[頁页]主題[：:]\s*<\/b>\s*(.+)/);
                if (htmlMatch) {
                    // 提取 HTML 内容，然后转换为文本（保留格式如 [HD/5.87G]）
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlMatch[1];
                    titleText = tempDiv.textContent || tempDiv.innerText || '';
                }
                // 方法2：如果方法1没获取到，从 <b> 标签的 nextSibling 开始，收集所有后续节点的文本
                if (!titleText.trim()) {
                    let node = themeLabel.nextSibling;
                    while (node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            titleText += node.textContent;
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            titleText += node.textContent;
                        }
                        node = node.nextSibling;
                    }
                }
                // 方法3：如果方法2没获取到，尝试从整个 td 中提取（使用正则）
                if (!titleText.trim()) {
                    const fullText = hTd.textContent || hTd.innerText || '';
                    const match = fullText.match(/本[頁页]主題[：:]\s*(.+)/);
                    if (match) {
                        titleText = match[1].trim();
                    }
                }
                // 方法4：如果还是没获取到，尝试获取整个 td 的文本，然后移除"本頁主題:"部分
                if (!titleText.trim()) {
                    const fullText = hTd.textContent || hTd.innerText || '';
                    titleText = fullText.replace(/.*?本[頁页]主題[：:]\s*/, '').trim();
                }
                if (titleText.trim()) {
                    rawTitleText = titleText.trim();
                    titleInfo = parseTitleTags(titleText);
                    // 如果解析后没有标题，使用原始标题
                    if (titleInfo && !titleInfo.title) {
                        titleInfo.title = rawTitleText;
                    }
                }
            }
        }
        // 如果从 td.h 没获取到，尝试从 f16 获取（作为后备方案）
        if (!titleInfo && !rawTitleText) {
            const firstContentBlock = contentBlocks[0];
            if (firstContentBlock) {
                // 尝试多种方式查找 f16 元素
                let f16Element = null;
                const postContainer = firstContentBlock.closest('.t.t2, .t2, .t');
                if (postContainer) {
                    f16Element = postContainer.querySelector('h4.f16, .f16, h4[class*="f16"]');
                }
                // 如果没找到，尝试在整个文档中查找（作为后备方案）
                if (!f16Element) {
                    f16Element = doc.querySelector('h4.f16, .f16, h4[class*="f16"]');
                }
                if (f16Element) {
                    const titleText = f16Element.textContent || f16Element.innerText || '';
                    if (titleText.trim()) {
                        rawTitleText = titleText.trim();
                        titleInfo = parseTitleTags(titleText);
                        // 如果解析后没有标题，使用原始标题
                        if (titleInfo && !titleInfo.title) {
                            titleInfo.title = rawTitleText;
                        }
                    }
                }
            }
        }

        const posts = contentBlocks.map((el, idx) => {
            const user = extractPostUser(el) || (idx === 0 ? '樓主' : `回覆 ${idx}`);
            const content = extractCleanText(el);
            
            // 查找该帖子相关的 ftad-ct 元素（在同一个 .t.t2 容器内或附近）
            const postContainer = el.closest('.t.t2, .t2, .t');
            let postAds = [];
            if (postContainer) {
                // 查找同一容器内的 ftad-ct 元素
                const containerFtads = postContainer.querySelectorAll('.ftad-ct');
                postAds = Array.from(containerFtads).map(ftad => ftad.outerHTML);
            }
            
            // 查找该帖子对应的 tr.tr1.do_not_catch 中的 tips 元素
            let postTips = [];
            if (postContainer) {
                // 方法1：查找同一容器内的 tr.tr1.do_not_catch 元素
                let tr1DoNotCatch = postContainer.querySelector('tr.tr1.do_not_catch');
                
                // 方法2：如果没找到，尝试查找包含当前 contentEl 的 table，然后找其 tr.tr1.do_not_catch
                if (!tr1DoNotCatch) {
                    const contentTable = el.closest('table');
                    if (contentTable) {
                        // 向上查找最外层的 table（包含整个帖子的 table）
                        let outerTable = contentTable;
                        while (outerTable && outerTable.parentElement) {
                            const parentTable = outerTable.parentElement.closest('table');
                            if (parentTable) {
                                outerTable = parentTable;
                            } else {
                                break;
                            }
                        }
                        if (outerTable) {
                            tr1DoNotCatch = outerTable.querySelector('tr.tr1.do_not_catch');
                        }
                    }
                }
                
                if (tr1DoNotCatch) {
                    // 只查找 .tips 元素，排除 .tiptop 等其他包含 tip 的元素
                    const tipsElements = tr1DoNotCatch.querySelectorAll('.tips');
                    postTips = Array.from(tipsElements).map(tip => tip.outerHTML);
                }
            }
            
            return {
                user,
                content: content.length > 600 ? `${content.slice(0, 600)}…` : content,
                ads: postAds,
                tips: postTips,
                titleInfo: idx === 0 ? titleInfo : null,
                rawTitle: idx === 0 ? rawTitleText : null
            };
        });

        const [topic, ...rest] = posts;
        const comments = rest.slice(0, 30);

        return {
            topic,
            comments,
            ads
        };
    }

    function collectThreadAdBlocks(doc) {
        if (!doc) return [];
        // 收集所有 ftad-ct 元素
        const ftadElements = Array.from(doc.querySelectorAll('.ftad-ct'));
        return ftadElements.map(el => el.outerHTML);
    }

    const adScriptCache = new Map();

    function decodeJsStringLiteral(input) {
        if (!input) return '';
        let output = '';
        for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            if (ch !== '\\') {
                output += ch;
                continue;
            }
            i += 1;
            if (i >= input.length) {
                break;
            }
            const next = input[i];
            switch (next) {
                case 'n':
                    output += '\n';
                    break;
                case 'r':
                    output += '\r';
                    break;
                case 't':
                    output += '\t';
                    break;
                case 'b':
                    output += '\b';
                    break;
                case 'f':
                    output += '\f';
                    break;
                case 'v':
                    output += '\v';
                    break;
                case '0':
                    output += '\0';
                    break;
                case '\\':
                    output += '\\';
                    break;
                case '"':
                case '\'':
                case '`':
                    output += next;
                    break;
                case 'x': {
                    const hex = input.slice(i + 1, i + 3);
                    if (/^[0-9a-fA-F]{2}$/.test(hex)) {
                        output += String.fromCharCode(parseInt(hex, 16));
                        i += 2;
                    } else {
                        output += next;
                    }
                    break;
                }
                case 'u': {
                    if (input[i + 1] === '{') {
                        const endBrace = input.indexOf('}', i + 2);
                        if (endBrace !== -1) {
                            const codePointHex = input.slice(i + 2, endBrace);
                            if (/^[0-9a-fA-F]+$/.test(codePointHex)) {
                                output += String.fromCodePoint(parseInt(codePointHex, 16));
                                i = endBrace;
                                break;
                            }
                        }
                    }
                    const hex = input.slice(i + 1, i + 5);
                    if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                        output += String.fromCharCode(parseInt(hex, 16));
                        i += 4;
                    } else {
                        output += next;
                    }
                    break;
                }
                default:
                    output += next;
                    break;
            }
        }
        return output;
    }

    function extractSpjsonPayload(scriptText) {
        if (!scriptText) return '';
        const assignMatch = scriptText.match(/(?:var|let|const)?\s*(?:window\.)?\s*spJson\s*=\s*([\s\S]+?);/i);
        if (!assignMatch || !assignMatch[1]) {
            return '';
        }

        function resolveExpression(expr) {
            const trimmed = expr.trim();
            if (!trimmed) {
                return '';
            }
            const literalMatch = trimmed.match(/^(['"`])([\s\S]*)\1$/);
            if (literalMatch) {
                return decodeJsStringLiteral(literalMatch[2]);
            }
            const decodeMatch = trimmed.match(/^decodeURIComponent\s*\(([\s\S]+)\)$/i);
            if (decodeMatch) {
                const inner = resolveExpression(decodeMatch[1]);
                try {
                    return decodeURIComponent(inner);
                } catch (err) {
                    return inner;
                }
            }
            const jsonParseMatch = trimmed.match(/^JSON\.parse\s*\(([\s\S]+)\)$/i);
            if (jsonParseMatch) {
                const inner = resolveExpression(jsonParseMatch[1]);
                try {
                    const parsed = JSON.parse(inner);
                    if (typeof parsed === 'string') {
                        return parsed;
                    }
                    return JSON.stringify(parsed);
                } catch (err) {
                    return inner;
                }
            }
            return '';
        }

        return resolveExpression(assignMatch[1]);
    }

    async function fetchAdScriptSource(scriptUrl) {
        if (!scriptUrl) return '';
        if (adScriptCache.has(scriptUrl)) {
            return adScriptCache.get(scriptUrl);
        }
        const requester = (async () => {
            // 直接使用 GM_xmlhttpRequest 避免 CORS 问题
            if (typeof GM_xmlhttpRequest === 'function') {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: scriptUrl,
                        headers: {
                            'Referer': location.origin
                        },
                        onload: (resp) => {
                            if (resp.status >= 200 && resp.status < 400) {
                                resolve(resp.responseText);
                            } else {
                                reject(new Error('HTTP ' + resp.status));
                            }
                        },
                        onerror: () => reject(new Error('網絡錯誤')),
                        ontimeout: () => reject(new Error('請求超時'))
                    });
                });
            }
            // 如果没有 GM_xmlhttpRequest，尝试使用 fetch（可能会遇到 CORS 问题）
            try {
                const resp = await fetch(scriptUrl, { credentials: 'include' });
                if (!resp.ok) {
                    throw new Error('HTTP ' + resp.status);
                }
                return await resp.text();
            } catch (err) {
                throw err;
            }
        })();
        requester.catch(() => adScriptCache.delete(scriptUrl));
        adScriptCache.set(scriptUrl, requester);
        return requester;
    }

    function createFtadGridElement(doc, adEntries) {
        if (!doc || !adEntries || !adEntries.length) return null;
        const container = doc.createElement('div');
        container.className = 'ftad-ct';
        const columns = adEntries.length > 10 ? Math.ceil(adEntries.length / 2) : 'auto-fit';
        container.style.gridTemplateColumns = `repeat(${columns}, minmax(100px, 1fr))`;
        const info = doc.createElement('div');
        info.className = 'sptable_info';
        info.setAttribute('onclick', "event.stopPropagation();window.open('/faq.php?faqjob=ads')");
        info.textContent = ' AD';
        container.appendChild(info);
        adEntries.forEach((entry) => {
            if (!entry || !entry.u) return;
            const item = doc.createElement('div');
            item.className = 'ftad-item';
            const link = doc.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('title', entry.c || '');
            link.setAttribute('href', entry.u);
            const title = entry.t ? entry.t.split('|')[1] || entry.t : '';
            link.textContent = title;
            item.appendChild(link);
            container.appendChild(item);
        });
        return container;
    }

    function createSpinitTableElement(doc, leftEntry, rightEntry, startIndex = 0) {
        if (!doc || !leftEntry) return null;
        const table = doc.createElement('table');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');
        table.setAttribute('width', '100%');
        table.className = 'sptable_do_not_remove';
        const tbody = doc.createElement('tbody');
        const tr = doc.createElement('tr');

        const makeCell = (entry, linkIndex, appendInfo = false) => {
            if (!entry) return null;
            const td = doc.createElement('td');
            td.setAttribute('width', '50%');
            td.setAttribute('valign', 'top');
            td.setAttribute('onclick', `clurl('${entry.u}', ${linkIndex})`);
            const titleWrapper = doc.createElement('div');
            titleWrapper.id = 'ti';
            const titleLink = doc.createElement('a');
            const title = entry.t ? entry.t.split('|')[0] || entry.t : '';
            titleLink.textContent = title;
            titleWrapper.appendChild(titleLink);
            td.appendChild(titleWrapper);
            if (entry.c) {
                td.appendChild(doc.createTextNode(entry.c));
            }
            td.appendChild(doc.createElement('br'));
            const anchor = doc.createElement('a');
            anchor.id = `srcf${linkIndex}`;
            anchor.setAttribute('href', entry.u);
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('onclick', 'event.stopPropagation();');
            anchor.textContent = entry.l || entry.u;
            td.appendChild(anchor);
            if (appendInfo) {
                const info = doc.createElement('div');
                info.className = 'sptable_info';
                info.setAttribute('onclick', "event.stopPropagation();window.open('/faq.php?faqjob=ads')");
                info.textContent = ' AD';
                td.appendChild(info);
            }
            return td;
        };

        const leftCell = makeCell(leftEntry, startIndex, false);
        const rightCell = rightEntry ? makeCell(rightEntry, startIndex + 1, true) : null;
        if (leftCell) {
            tr.appendChild(leftCell);
        }
        if (rightCell) {
            tr.appendChild(rightCell);
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        return table;
    }

    function hydrateThreadAdsFromData(doc, adEntries) {
        if (!doc || !adEntries || !adEntries.length) return false;
        let mutated = false;
        const inlineScripts = Array.from(doc.querySelectorAll('script')).filter((script) => {
            return !script.src && /spinit2?\s*\(\s*\)/.test(script.textContent || '');
        });
        if (!inlineScripts.length) {
            return false;
        }
        const ftadScripts = inlineScripts.filter((script) => /\bspinit2\s*\(/.test(script.textContent || ''));
        ftadScripts.forEach((script) => {
            const grid = createFtadGridElement(doc, adEntries);
            if (grid) {
                script.insertAdjacentElement('afterend', grid);
                mutated = true;
            }
        });

        const pairQueue = adEntries.slice();
        let linkIndex = 0;
        inlineScripts.filter((script) => /\bspinit\s*\(/.test(script.textContent || '') && !/\bspinit2\s*\(/.test(script.textContent || '')).forEach((script) => {
            const left = pairQueue.shift();
            if (!left) {
                return;
            }
            const right = pairQueue.shift() || null;
            const table = createSpinitTableElement(doc, left, right, linkIndex);
            if (table) {
                script.insertAdjacentElement('afterend', table);
                linkIndex += right ? 2 : 1;
                mutated = true;
            }
        });
        return mutated;
    }

    async function collectThreadAdsWithScriptFallback(doc, baseHref, rawHtml = '') {
        const direct = collectThreadAdBlocks(doc);
        // 检查是否已经找到了 ftad-ct
        const hasFtadCt = direct.some(html => /\bftad-ct\b/i.test(html));
        
        // 如果已经找到了 ftad-ct，直接返回
        if (hasFtadCt || !doc) {
            return direct;
        }

        const hydrateWithPayload = (payload) => {
            if (!payload) {
                return false;
            }
            try {
                const adEntries = JSON.parse(payload);
                if (!Array.isArray(adEntries) || !adEntries.length) {
                    return false;
                }
                return hydrateThreadAdsFromData(doc, adEntries);
            } catch (err) {
                console.warn('clm 解析 spJson 失敗', err);
                return false;
            }
        };

        const inlinePayload = rawHtml ? extractSpjsonPayload(rawHtml) : '';
        if (inlinePayload && hydrateWithPayload(inlinePayload)) {
            const afterHydrate = collectThreadAdBlocks(doc);
            // 合并直接找到的广告和恢复的广告，去重
            const combined = [...direct];
            afterHydrate.forEach(html => {
                if (!combined.some(existing => existing === html)) {
                    combined.push(html);
                }
            });
            return combined;
        }

        const scriptNode = doc.querySelector('script[src*="post.js"]');
        if (!scriptNode) {
            return direct;
        }
        const scriptUrl = getAbsoluteUrl(scriptNode.getAttribute('src'), baseHref);
        if (!scriptUrl) {
            return direct;
        }
        try {
            const scriptText = await fetchAdScriptSource(scriptUrl);
            const payload = extractSpjsonPayload(scriptText);
            if (!payload) {
                return direct;
            }
            if (!hydrateWithPayload(payload)) {
                return direct;
            }
            const afterHydrate = collectThreadAdBlocks(doc);
            // 合并直接找到的广告和恢复的广告，去重
            const combined = [...direct];
            afterHydrate.forEach(html => {
                if (!combined.some(existing => existing === html)) {
                    combined.push(html);
                }
            });
            return combined;
        } catch (err) {
            console.warn('clm 無法恢復社區贊助內容', err);
            return direct;
        }
    }

    function extractThreadDownloadInfo(doc, baseHref = location.href) {
        if (!doc) return null;
        const candidate = doc.querySelector('#rmlink[href], a[href*="rmdown.com/link.php"]');
        if (!candidate) return null;
        const raw = candidate.getAttribute('href') || candidate.href;
        const pageUrl = getAbsoluteUrl(raw, baseHref);
        if (!pageUrl) return null;
        return {
            type: 'rmdown',
            pageUrl
        };
    }

    async function resolveThreadDownloadTarget(downloadInfo) {
        if (!downloadInfo) {
            throw new Error('沒有可用的下載資訊');
        }
        if (downloadInfo.type !== 'rmdown') {
            throw new Error('未知的下載來源');
        }
        const cacheKey = downloadInfo.pageUrl;
        if (downloadResolveCache.has(cacheKey)) {
            return downloadResolveCache.get(cacheKey);
        }
        const resolver = (async () => {
            const html = await fetchCrossOriginText(downloadInfo.pageUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const form = doc.querySelector('form#dl');
            if (!form) {
                throw new Error('無法在下載頁中找到目標表單');
            }
            const params = [];
            Array.from(form.elements || []).forEach((el) => {
                if (!el || !el.name) return;
                const value = el.value || '';
                if (!value) return;
                params.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(value));
            });
            if (!params.length) {
                throw new Error('下載表單缺少必需參數');
            }
            const base = new URL('download.php', downloadInfo.pageUrl);
            const separator = base.search ? '&' : '?';
            const downloadUrl = base.origin + base.pathname + separator + params.join('&');
            const { buffer, headers } = await fetchCrossOriginBinary(downloadUrl);
            const torrentBinary = ensureArrayBuffer(buffer);
            if (!torrentBinary || !torrentBinary.byteLength) {
                throw new Error('無法獲取種子文件內容');
            }
            const filename = extractFilenameFromHeaders(headers) || ('rmdown_' + Date.now() + '.torrent');
            return {
                url: downloadUrl,
                filename,
                torrentBinary
            };
        })();
        resolver.catch(() => {
            downloadResolveCache.delete(cacheKey);
        });
        downloadResolveCache.set(cacheKey, resolver);
        return resolver;
    }

    function createGalleryOverlay() {
        injectStyle(`
            .clm-gallery-overlay {
                position: fixed;
                inset: 0;
                background: rgba(10, 10, 20, 0.82);
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 12px;
                z-index: 100000;
                padding: 32px clamp(16px, 4vw, 48px);
            }
            .clm-gallery-overlay.clm-active {
                display: flex;
            }
            .clm-gallery-layout {
                display: grid;
                grid-template-columns: minmax(350px, 30vw) 1fr minmax(350px, 30vw);
                gap: 20px;
                width: min(98vw, 2400px);
                height: calc(100vh - 160px);
                max-height: calc(100vh - 160px);
                align-items: stretch;
            }
            .clm-gallery-viewer-column {
                display: flex;
                flex-direction: column;
                gap: 18px;
                height: 100%;
                min-height: 0;
            }
            .clm-gallery-panel {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                color: #fff;
                backdrop-filter: blur(4px);
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 100%;
            }
            .clm-gallery-panel-topic {
                max-width: 100%;
            }
            .clm-gallery-panel-comments {
                max-width: 100%;
            }
            .clm-gallery-panel-header {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.05em;
            }
            .clm-gallery-panel-body {
                flex: 1;
                overflow: auto;
                font-size: 13px;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.92);
            }
            .clm-gallery-panel-body::-webkit-scrollbar {
                width: 6px;
            }
            .clm-gallery-panel-body::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.25);
                border-radius: 3px;
            }
            .clm-panel-entry {
                padding: 8px 10px;
                background: rgba(0, 0, 0, 0.25);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-bottom: 10px;
                min-width: 0;
            }
            .clm-panel-entry-user {
                font-size: 12px;
                letter-spacing: 0.04em;
                color: rgba(255, 255, 255, 0.75);
            }
            .clm-panel-entry-content {
                font-size: 13px;
                color: #fff;
                white-space: pre-line;
                word-wrap: break-word;
                overflow-wrap: break-word;
                word-break: break-word;
                min-width: 0;
            }
            .clm-panel-entry-content .clm-type-tag {
                display: inline-block;
                padding: 2px 8px;
                margin: 2px 4px 2px 0;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.4;
            }
            /* 类型标签使用不同颜色 - 基于类名，至少10种颜色循环使用 */
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-1 {
                background: rgba(59, 130, 246, 0.2) !important;
                border: 1px solid rgba(59, 130, 246, 0.4) !important;
                color: rgba(147, 197, 253, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-2 {
                background: rgba(34, 197, 94, 0.2) !important;
                border: 1px solid rgba(34, 197, 94, 0.4) !important;
                color: rgba(134, 239, 172, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-3 {
                background: rgba(249, 115, 22, 0.2) !important;
                border: 1px solid rgba(249, 115, 22, 0.4) !important;
                color: rgba(254, 215, 170, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-4 {
                background: rgba(168, 85, 247, 0.2) !important;
                border: 1px solid rgba(168, 85, 247, 0.4) !important;
                color: rgba(221, 214, 254, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-5 {
                background: rgba(236, 72, 153, 0.2) !important;
                border: 1px solid rgba(236, 72, 153, 0.4) !important;
                color: rgba(251, 207, 232, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-6 {
                background: rgba(6, 182, 212, 0.2) !important;
                border: 1px solid rgba(6, 182, 212, 0.4) !important;
                color: rgba(165, 243, 252, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-7 {
                background: rgba(234, 179, 8, 0.2) !important;
                border: 1px solid rgba(234, 179, 8, 0.4) !important;
                color: rgba(253, 224, 71, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-8 {
                background: rgba(239, 68, 68, 0.2) !important;
                border: 1px solid rgba(239, 68, 68, 0.4) !important;
                color: rgba(254, 202, 202, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-9 {
                background: rgba(99, 102, 241, 0.2) !important;
                border: 1px solid rgba(99, 102, 241, 0.4) !important;
                color: rgba(196, 181, 253, 0.95) !important;
            }
            .clm-panel-entry-content .clm-type-tag.clm-type-tag-color-10 {
                background: rgba(20, 184, 166, 0.2) !important;
                border: 1px solid rgba(20, 184, 166, 0.4) !important;
                color: rgba(153, 246, 228, 0.95) !important;
            }
            /* 出演者标签样式 - 复用类型标签的颜色方案 */
            .clm-panel-entry-content .clm-performer-tag {
                display: inline-block;
                padding: 2px 8px;
                margin: 2px 4px 2px 0;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.4;
                cursor: pointer;
                user-select: none;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-1 {
                background: rgba(59, 130, 246, 0.2) !important;
                border: 1px solid rgba(59, 130, 246, 0.4) !important;
                color: rgba(147, 197, 253, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-2 {
                background: rgba(34, 197, 94, 0.2) !important;
                border: 1px solid rgba(34, 197, 94, 0.4) !important;
                color: rgba(134, 239, 172, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-3 {
                background: rgba(249, 115, 22, 0.2) !important;
                border: 1px solid rgba(249, 115, 22, 0.4) !important;
                color: rgba(254, 215, 170, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-4 {
                background: rgba(168, 85, 247, 0.2) !important;
                border: 1px solid rgba(168, 85, 247, 0.4) !important;
                color: rgba(221, 214, 254, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-5 {
                background: rgba(236, 72, 153, 0.2) !important;
                border: 1px solid rgba(236, 72, 153, 0.4) !important;
                color: rgba(251, 207, 232, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-6 {
                background: rgba(6, 182, 212, 0.2) !important;
                border: 1px solid rgba(6, 182, 212, 0.4) !important;
                color: rgba(165, 243, 252, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-7 {
                background: rgba(234, 179, 8, 0.2) !important;
                border: 1px solid rgba(234, 179, 8, 0.4) !important;
                color: rgba(253, 224, 71, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-8 {
                background: rgba(239, 68, 68, 0.2) !important;
                border: 1px solid rgba(239, 68, 68, 0.4) !important;
                color: rgba(254, 202, 202, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-9 {
                background: rgba(99, 102, 241, 0.2) !important;
                border: 1px solid rgba(99, 102, 241, 0.4) !important;
                color: rgba(196, 181, 253, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag.clm-performer-tag-color-10 {
                background: rgba(20, 184, 166, 0.2) !important;
                border: 1px solid rgba(20, 184, 166, 0.4) !important;
                color: rgba(153, 246, 228, 0.95) !important;
            }
            .clm-panel-entry-content .clm-performer-tag:hover {
                opacity: 0.8;
            }
            .clm-panel-entry-title {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 12px;
                line-height: 1.5;
            }
            .clm-panel-entry-title-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 8px;
            }
            .clm-panel-entry-title-tag {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.4;
            }
            /* 清晰度标签 - 绿色 */
            .clm-title-tag-quality {
                background: rgba(34, 197, 94, 0.25);
                border: 1px solid rgba(34, 197, 94, 0.5);
                color: rgba(134, 239, 172, 1);
            }
            /* 文件大小标签 - 橙色 */
            .clm-title-tag-size {
                background: rgba(249, 115, 22, 0.25);
                border: 1px solid rgba(249, 115, 22, 0.5);
                color: rgba(254, 215, 170, 1);
            }
            /* 番号标签 - 紫色，嵌套结构 */
            .clm-title-tag-code {
                background: rgba(168, 85, 247, 0.25);
                border: 1px solid rgba(168, 85, 247, 0.5);
                color: rgba(221, 214, 254, 1);
            }
            /* 番号标签前缀部分 - 更深的紫色背景 */
            .clm-title-tag-code-prefix {
                display: inline-block;
                background: rgba(168, 85, 247, 0.5);
                padding: 4px 6px;
                margin: -4px 4px -4px -10px;
                border-radius: 6px 0 0 6px;
                font-weight: 600;
                cursor: pointer;
            }
            .clm-title-tag-code-prefix:hover {
                background: rgba(168, 85, 247, 0.7);
            }
            /* 番号标签后缀部分 - 可点击，搜索完整番号 */
            .clm-title-tag-code-suffix {
                display: inline-block;
                padding: 4px 6px;
                margin: -4px -10px -4px 4px;
                border-radius: 0 6px 6px 0;
                transition: background 0.2s ease;
            }
            .clm-title-tag-code-suffix:hover {
                background: rgba(168, 85, 247, 0.4);
            }
            /* 搜索弹窗样式 */
            .clm-search-dialog-mask {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 100003;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .clm-search-dialog {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                width: min(600px, 90vw);
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .clm-search-dialog-header {
                padding: 14px 18px;
                border-bottom: 1px solid #e5e7eb;
                background: #f9fafb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .clm-search-dialog-title {
                font-weight: 600;
                font-size: 15px;
                color: #111827;
            }
            .clm-search-dialog-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            .clm-search-dialog-close:hover {
                background: #e5e7eb;
                color: #111827;
            }
            .clm-search-dialog-body {
                padding: 18px;
                overflow-y: auto;
                flex: 1;
            }
            .clm-search-form-row {
                margin-bottom: 16px;
            }
            .clm-search-form-row:last-child {
                margin-bottom: 0;
            }
            .clm-search-form-label {
                display: block;
                font-weight: 600;
                font-size: 13px;
                color: #374151;
                margin-bottom: 6px;
            }
            .clm-search-form-label.required::after {
                content: ' *';
                color: #dc2626;
            }
            .clm-search-form-select,
            .clm-search-form-input {
                width: 100%;
                padding: 6px 10px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 13px;
                box-sizing: border-box;
            }
            .clm-search-form-select:focus,
            .clm-search-form-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .clm-search-form-radio-group {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }
            .clm-search-form-radio {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .clm-search-form-radio input[type="radio"] {
                margin: 0;
            }
            .clm-search-form-checkbox {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .clm-search-form-checkbox input[type="checkbox"] {
                margin: 0;
            }
            .clm-search-dialog-footer {
                padding: 12px 18px;
                border-top: 1px solid #e5e7eb;
                background: #f9fafb;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .clm-search-btn {
                padding: 8px 20px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: background 0.2s;
            }
            .clm-search-btn-primary {
                background: #3b82f6;
                color: #fff;
            }
            .clm-search-btn-primary:hover {
                background: #2563eb;
            }
            .clm-search-btn-secondary {
                background: #e5e7eb;
                color: #374151;
            }
            .clm-search-btn-secondary:hover {
                background: #d1d5db;
            }
            .clm-type-tag {
                cursor: pointer;
            }
            .clm-type-tag:hover {
                opacity: 0.8;
            }
            .clm-panel-entry-title-text {
                font-size: 16px;
                color: #fff;
                line-height: 1.5;
            }
            .clm-panel-entry-tips {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: #333;
                max-width: 100%;
                overflow: hidden;
                position: relative;
            }
            .clm-panel-entry-tips > div {
                color: #333;
                max-width: 100%;
                overflow: hidden;
            }
            .clm-panel-entry-tips-scale-wrapper {
                width: 100%;
                overflow: hidden;
                transform-origin: top left;
            }
            .clm-panel-entry-tips table {
                width: 100%;
                max-width: 100%;
                color: #333;
                background: #fff;
                table-layout: auto;
                word-break: break-word;
            }
            .clm-panel-entry-tips table td,
            .clm-panel-entry-tips table th {
                color: #333;
                word-break: break-word;
                overflow-wrap: break-word;
            }
            .clm-panel-entry-tips a {
                color: #0b5ed7;
                word-break: break-all;
            }
            .clm-panel-empty {
                padding: 12px;
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                font-size: 13px;
            }
            .clm-gallery-viewer {
                position: relative;
                max-width: 100%;
                width: 100%;
                flex: 1;
                min-height: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.35);
                overflow: hidden;
            }
            .clm-gallery-viewer img {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                background: #000;
                transition: opacity 0.2s ease;
                transform-origin: center center;
                cursor: zoom-in;
            }
            .clm-gallery-viewer img.clm-zoomed {
                cursor: move;
            }
            .clm-gallery-ads-slot {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .clm-gallery-ads-slot-viewer-top,
            .clm-gallery-ads-slot-viewer-bottom {
                width: 100%;
            }
            .clm-gallery-ads-title {
                font-size: 12px;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.68);
                margin-bottom: 4px;
            }
            .clm-gallery-ads {
                background: rgba(255, 255, 255, 0.96);
                color: #111;
                border-radius: 10px;
                padding: 12px;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 16px 32px rgba(0, 0, 0, 0.35);
                overflow: hidden;
            }
            .clm-gallery-ads .ftad-ct {
                display: grid !important;
                gap: 8px;
                width: 100%;
                margin: 0;
                padding: 0;
            }
            .clm-gallery-ads .ftad-item {
                padding: 8px;
                background: rgba(0, 0, 0, 0.03);
                border-radius: 6px;
                transition: background 0.2s ease;
            }
            .clm-gallery-ads .ftad-item:hover {
                background: rgba(0, 0, 0, 0.08);
            }
            .clm-gallery-ads .ftad-item a {
                color: #0b5ed7;
                text-decoration: none;
                word-break: break-all;
                font-size: 13px;
            }
            .clm-gallery-ads .ftad-item a:hover {
                text-decoration: underline;
            }
            .clm-gallery-ads .sptable_info {
                display: none;
            }
            .clm-viewer-loading img {
                opacity: 0;
            }
            .clm-gallery-loading-indicator {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                letter-spacing: 0.08em;
                background: linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15));
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            .clm-viewer-loading .clm-gallery-loading-indicator {
                opacity: 1;
                visibility: visible;
            }
            .clm-gallery-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.55);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                width: 44px;
                height: 44px;
                font-size: 22px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }
            .clm-gallery-arrow:hover {
                background: rgba(0, 0, 0, 0.85);
            }
            .clm-gallery-arrow-left {
                left: -22px;
            }
            .clm-gallery-arrow-right {
                right: -22px;
            }
            .clm-gallery-close {
                position: absolute;
                top: 16px;
                right: 24px;
                background: rgba(0, 0, 0, 0.55);
                color: #fff;
                border: none;
                font-size: 26px;
                cursor: pointer;
                padding: 4px 10px;
                border-radius: 6px;
            }
            .clm-gallery-meta {
                color: #f5f5f5;
                font-size: 14px;
                text-align: center;
            }
            .clm-gallery-hint {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.65);
            }
            .clm-gallery-actions {
                width: min(98vw, 1600px);
                display: flex;
                justify-content: center;
                gap: 12px;
                position: relative;
                z-index: 100010;
            }
            .clm-gallery-download-preview {
                position: fixed;
                inset: clamp(24px, 6vw, 64px);
                background: #fff;
                border-radius: 14px;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
                display: none;
                flex-direction: column;
                z-index: 100010;
                pointer-events: auto;
                overflow: hidden;
            }
            .clm-gallery-download-preview.clm-active {
                display: flex;
            }
            .clm-gallery-download-preview-subtitle {
                font-size: 12px;
                color: #6b7280;
                margin-top: 2px;
            }
            .clm-gallery-download-preview-subtitle:empty {
                display: none;
            }
            .clm-gallery-download-preview-header {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 18px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                background: linear-gradient(90deg, #f7f8fb, #ffffff);
            }
            .clm-gallery-download-preview-title {
                font-weight: 600;
                font-size: 14px;
                color: #0e0f1a;
            }
            .clm-gallery-download-preview-link {
                margin-left: auto;
                font-size: 12px;
                color: #0b5ed7;
                text-decoration: none;
            }
            .clm-gallery-download-preview-close {
                border: none;
                background: #0d1117;
                color: #fff;
                font-size: 12px;
                border-radius: 20px;
                padding: 6px 14px;
                cursor: pointer;
            }
            .clm-gallery-download-preview-close:hover {
                background: #272c34;
            }
            .clm-gallery-download-preview-frame {
                flex: 1;
                border: none;
                width: 100%;
                min-height: 60vh;
                background: #fff;
            }
            .clm-gallery-download-preview-footer {
                padding: 10px 18px;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                border-top: 1px solid rgba(0, 0, 0, 0.05);
                background: #fafafa;
            }
            .clm-download-window-mask {
                position: fixed;
                inset: 0;
                background: rgba(8, 8, 12, 0.65);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 100120;
                padding: clamp(16px, 4vw, 48px);
                transition: opacity 0.2s ease, visibility 0.2s ease;
            }
            .clm-download-window-mask.clm-active {
                display: flex;
            }
            .clm-download-window-status {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.65);
                line-height: 1.5;
            }
            .clm-download-window-status[data-variant="success"] {
                color: #059669;
            }
            .clm-download-window-status[data-variant="error"] {
                color: #b91c1c;
            }
            .clm-gallery-download-btn {
                padding: 10px 20px;
                border-radius: 999px;
                border: 1px solid rgba(255, 255, 255, 0.35);
                background: rgba(0, 0, 0, 0.45);
                color: #fff;
                font-size: 13px;
                letter-spacing: 0.08em;
                cursor: pointer;
                transition: background 0.2s ease, opacity 0.2s ease;
                min-width: 220px;
            }
            .clm-gallery-download-btn:hover:not(:disabled) {
                background: rgba(0, 0, 0, 0.75);
            }
            .clm-gallery-download-btn.clm-downloaded {
                border-color: rgba(16, 185, 129, 0.7);
                background: rgba(16, 185, 129, 0.22);
                color: #d1fae5;
            }
            .clm-gallery-download-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .clm-preset-picker-mask {
                position: fixed;
                inset: 0;
                background: transparent;
                z-index: 100120;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
            }
            .clm-preset-picker {
                width: min(360px, 90vw);
                max-height: 80vh;
                background: #fff;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
                overflow: hidden;
                margin: 20px;
            }
            .clm-preset-picker-title {
                padding: 14px 18px;
                font-weight: 600;
                border-bottom: 1px solid #eee;
            }
            .clm-preset-picker-list {
                padding: 12px 18px;
                overflow: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .clm-preset-picker-option {
                border: 1px solid #d0d0d0;
                border-radius: 8px;
                padding: 10px 12px;
                text-align: left;
                background: #fdfdfd;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                gap: 4px;
                transition: border-color 0.2s ease, background 0.2s ease;
            }
            .clm-preset-picker-option:hover {
                background: #f3f6ff;
                border-color: #8da9ff;
            }
            .clm-preset-picker-option strong {
                font-size: 13px;
            }
            .clm-preset-picker-option span {
                font-size: 12px;
                color: #555;
                word-break: break-all;
            }
            .clm-preset-picker-cancel {
                border: none;
                border-top: 1px solid #eee;
                background: #fafafa;
                padding: 10px 0;
                cursor: pointer;
                font-size: 13px;
            }
            .clm-preset-picker-cancel:hover {
                background: #f0f0f0;
            }
            @media (max-width: 1800px) {
                .clm-gallery-overlay {
                    transform: scale(0.9);
                    transform-origin: center center;
                }
            }
            @media (max-width: 1600px) {
                .clm-gallery-overlay {
                    transform: scale(0.85);
                    transform-origin: center center;
                }
                .clm-gallery-layout {
                    grid-template-columns: minmax(320px, 16.67vw) 1fr minmax(320px, 16.67vw);
                    width: min(98vw, 2200px);
                }
            }
            @media (max-width: 1400px) {
                .clm-gallery-overlay {
                    transform: scale(0.8);
                    transform-origin: center center;
                }
                .clm-gallery-layout {
                    grid-template-columns: minmax(300px, 16.67vw) 1fr minmax(300px, 16.67vw);
                    width: min(98vw, 2000px);
                }
            }
            @media (max-width: 1200px) {
                .clm-gallery-overlay {
                    transform: scale(0.75);
                    transform-origin: center center;
                }
                .clm-gallery-layout {
                    grid-template-columns: minmax(280px, 16.67vw) 1fr minmax(280px, 16.67vw);
                    width: min(98vw, 1800px);
                }
            }
            @media (max-width: 1024px) {
                .clm-gallery-overlay {
                    transform: scale(0.7);
                    transform-origin: center center;
                }
                .clm-gallery-layout {
                    grid-template-columns: 1fr;
                }
                .clm-gallery-download-preview {
                    inset: clamp(14px, 4vw, 32px);
                }
            }
        `);

        const overlay = document.createElement('div');
        overlay.className = 'clm-gallery-overlay';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'clm-gallery-close';
        closeBtn.textContent = '✕';

        const layout = document.createElement('div');
        layout.className = 'clm-gallery-layout';

        const topicPanel = document.createElement('section');
        topicPanel.className = 'clm-gallery-panel clm-gallery-panel-topic';
        const topicHeader = document.createElement('div');
        topicHeader.className = 'clm-gallery-panel-header';
        topicHeader.textContent = '主題內容';
        const topicBody = document.createElement('div');
        topicBody.className = 'clm-gallery-panel-body';
        topicPanel.appendChild(topicHeader);
        topicPanel.appendChild(topicBody);

        const viewer = document.createElement('div');
        viewer.className = 'clm-gallery-viewer';
        const viewerColumn = document.createElement('div');
        viewerColumn.className = 'clm-gallery-viewer-column';

        // 创建viewer上方的广告显示区域
        const viewerAdsTop = document.createElement('div');
        viewerAdsTop.className = 'clm-gallery-ads-slot clm-gallery-ads-slot-viewer-top';
        viewerAdsTop.style.display = 'none';
        const viewerAdsTopTitle = document.createElement('div');
        viewerAdsTopTitle.className = 'clm-gallery-ads-title';
        viewerAdsTopTitle.textContent = '帖子內 AD';
        const viewerAdsTopContainer = document.createElement('div');
        viewerAdsTopContainer.className = 'clm-gallery-ads';
        viewerAdsTop.appendChild(viewerAdsTopTitle);
        viewerAdsTop.appendChild(viewerAdsTopContainer);

        const leftBtn = document.createElement('button');
        leftBtn.type = 'button';
        leftBtn.className = 'clm-gallery-arrow clm-gallery-arrow-left';
        leftBtn.textContent = '‹';

        const rightBtn = document.createElement('button');
        rightBtn.type = 'button';
        rightBtn.className = 'clm-gallery-arrow clm-gallery-arrow-right';
        rightBtn.textContent = '›';

        const viewerImg = document.createElement('img');
        viewerImg.alt = '';
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'clm-gallery-loading-indicator';
        loadingIndicator.textContent = '正在載入…';
        const galleryQualityBadge = document.createElement('div');
        galleryQualityBadge.className = 'clm-quality-badge clm-gallery-quality';
        galleryQualityBadge.style.display = 'none';

        viewer.appendChild(leftBtn);
        viewer.appendChild(viewerImg);
        viewer.appendChild(rightBtn);
        viewer.appendChild(loadingIndicator);
        viewer.appendChild(galleryQualityBadge);

        // 创建viewer下方的广告显示区域
        const viewerAdsBottom = document.createElement('div');
        viewerAdsBottom.className = 'clm-gallery-ads-slot clm-gallery-ads-slot-viewer-bottom';
        viewerAdsBottom.style.display = 'none';
        const viewerAdsBottomTitle = document.createElement('div');
        viewerAdsBottomTitle.className = 'clm-gallery-ads-title';
        viewerAdsBottomTitle.textContent = '帖子內 AD';
        const viewerAdsBottomContainer = document.createElement('div');
        viewerAdsBottomContainer.className = 'clm-gallery-ads';
        viewerAdsBottom.appendChild(viewerAdsBottomTitle);
        viewerAdsBottom.appendChild(viewerAdsBottomContainer);

        viewerColumn.appendChild(viewerAdsTop);
        viewerColumn.appendChild(viewer);
        viewerColumn.appendChild(viewerAdsBottom);

        const commentsPanel = document.createElement('section');
        commentsPanel.className = 'clm-gallery-panel clm-gallery-panel-comments';
        const commentsHeader = document.createElement('div');
        commentsHeader.className = 'clm-gallery-panel-header';
        commentsHeader.textContent = '評論內容';
        const commentsBody = document.createElement('div');
        commentsBody.className = 'clm-gallery-panel-body';
        commentsPanel.appendChild(commentsHeader);
        commentsPanel.appendChild(commentsBody);

        layout.appendChild(topicPanel);
        layout.appendChild(viewerColumn);
        layout.appendChild(commentsPanel);

        const meta = document.createElement('div');
        meta.className = 'clm-gallery-meta';

        const actions = document.createElement('div');
        actions.className = 'clm-gallery-actions';
        const downloadBtn = document.createElement('button');
        downloadBtn.type = 'button';
        downloadBtn.className = 'clm-gallery-download-btn';
        downloadBtn.textContent = '打開下載頁面';
        downloadBtn.disabled = true;
        actions.appendChild(downloadBtn);

        const hint = document.createElement('div');
        hint.className = 'clm-gallery-hint';
        hint.textContent = '← → 切換 · Esc 關閉';

        overlay.appendChild(closeBtn);
        overlay.appendChild(layout);
        overlay.appendChild(meta);
        overlay.appendChild(actions);
        overlay.appendChild(hint);

        document.body.appendChild(overlay);

        let items = [];
        let currentIndex = 0;
        let currentImageToken = 0;
        let errorIndicatorTimer = null;
        let currentDownloadInfo = null;
        let currentThreadKey = null;
        let currentQualityTag = null;
        let galleryDownloadUnsubscribe = null;
        let imageScale = 1;
        let imageTranslateX = 0;
        let imageTranslateY = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragStartTranslateX = 0;
        let dragStartTranslateY = 0;

        function formatContentWithTags(text) {
            if (!text) return '';
            
            // 转义HTML特殊字符
            const escapeHtml = (str) => {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            };
            
            // 按行分割处理
            const lines = text.split('\n');
            const processedLines = lines.map(line => {
                // 检查是否包含类型相关字段（支持多种格式）
                // 匹配：类型、ジャンル（日文"类型"）
                const typeMatch = line.match(/^(.*?(?:类型|ジャンル)[：:])(.+)$/);
                if (typeMatch) {
                    const prefix = typeMatch[1]; // "类型："之前的内容
                    const typeContent = typeMatch[2]; // "类型："之后的内容
                    
                    // 按"｜"或空格分隔类型（优先使用"｜"，如果没有则用空格）
                    let types = [];
                    if (typeContent.includes('｜')) {
                        types = typeContent.split('｜').map(t => t.trim()).filter(t => t);
                    } else {
                        // 按空格分隔，但保留多个连续空格的情况
                        types = typeContent.split(/\s+/).map(t => t.trim()).filter(t => t);
                    }
                    if (types.length > 0) {
                        // 将每个类型转换为标签，根据索引使用不同的颜色类
                        const tags = types.map((type, index) => {
                            // 根据索引选择颜色类（循环使用10种颜色）
                            const colorClass = `clm-type-tag-color-${(index % 10) + 1}`;
                            return `<span class="clm-type-tag ${colorClass}">${escapeHtml(type)}</span>`;
                        }).join('');
                        return escapeHtml(prefix) + tags;
                    }
                }
                // 检查是否包含出演者相关字段（支持多种格式）
                // 匹配：出演者、出演、【出演女優】（日文格式）
                const performerMatch = line.match(/^(.*?(?:出演者|出演|【出演女優】)[：:])(.+)$/);
                if (performerMatch) {
                    const prefix = performerMatch[1]; // "出演者："之前的内容
                    const performerContent = performerMatch[2]; // "出演者："之后的内容
                    
                    // 按"｜"或空格分隔出演者（优先使用"｜"，如果没有则用空格）
                    let performers = [];
                    if (performerContent.includes('｜')) {
                        performers = performerContent.split('｜').map(p => p.trim()).filter(p => p);
                    } else {
                        // 按空格分隔，但保留多个连续空格的情况
                        performers = performerContent.split(/\s+/).map(p => p.trim()).filter(p => p);
                    }
                    if (performers.length > 0) {
                        // 将每个出演者转换为标签，使用独立的类名 clm-performer-tag
                        const tags = performers.map((performer, index) => {
                            // 根据索引选择颜色类（循环使用10种颜色）
                            const colorClass = `clm-performer-tag-color-${(index % 10) + 1}`;
                            return `<span class="clm-performer-tag ${colorClass}">${escapeHtml(performer)}</span>`;
                        }).join('');
                        return escapeHtml(prefix) + tags;
                    }
                }
                // 普通行直接转义
                return escapeHtml(line);
            });
            
            // 用<br>连接所有行
            return processedLines.join('<br>');
        }

        function renderPanelEntries(container, entries, emptyText) {
            container.innerHTML = '';
            if (!entries || !entries.length) {
                const empty = document.createElement('div');
                empty.className = 'clm-panel-empty';
                empty.textContent = emptyText;
                container.appendChild(empty);
                return;
            }
            entries.forEach(entry => {
                const item = document.createElement('div');
                item.className = 'clm-panel-entry';
                const user = document.createElement('div');
                user.className = 'clm-panel-entry-user';
                user.textContent = entry.user || '匿名';
                const content = document.createElement('div');
                content.className = 'clm-panel-entry-content';
                // 使用 innerHTML 来支持标签和换行
                content.innerHTML = formatContentWithTags(entry.content || '（無內容）');
                
                // 为出演者标签添加点击事件（只绑定到出演者标签，不包括类型标签）
                // 等待DOM更新后直接为每个出演者标签绑定事件
                setTimeout(() => {
                    content.querySelectorAll('.clm-performer-tag').forEach(tag => {
                        // 设置样式，确保可以点击
                        tag.style.pointerEvents = 'auto';
                        tag.style.cursor = 'pointer';
                        tag.style.position = 'relative';
                        tag.style.zIndex = '10';
                        
                        // 添加点击事件（使用捕获阶段确保事件被处理）
                        const clickHandler = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation(); // 阻止其他事件监听器
                            const keyword = tag.textContent.trim();
                            console.log('草榴Manager: 点击出演者标签:', keyword);
                            if (keyword) {
                                // 通过全局变量访问searchDialog
                                const dialog = window.clmSearchDialog;
                                console.log('草榴Manager: searchDialog:', dialog);
                                if (dialog && typeof dialog.open === 'function') {
                                    console.log('草榴Manager: 调用 dialog.open:', keyword);
                                    dialog.open(keyword);
                                } else {
                                    console.warn('草榴Manager: searchDialog 未初始化或 open 方法不存在', dialog);
                                }
                            }
                        };
                        tag.addEventListener('click', clickHandler, true); // 使用捕获阶段确保事件被处理
                        tag.addEventListener('mousedown', (e) => {
                            e.stopPropagation();
                        }, true);
                    });
                }, 0);
                
                // 如果有 tips 元素，添加到内容中
                if (entry.tips && entry.tips.length > 0) {
                    const tipsContainer = document.createElement('div');
                    tipsContainer.className = 'clm-panel-entry-tips';
                    const scaleWrapper = document.createElement('div');
                    scaleWrapper.className = 'clm-panel-entry-tips-scale-wrapper';
                    entry.tips.forEach(tipHtml => {
                        const tipDiv = document.createElement('div');
                        tipDiv.innerHTML = tipHtml;
                        scaleWrapper.appendChild(tipDiv);
                    });
                    tipsContainer.appendChild(scaleWrapper);
                    content.appendChild(tipsContainer);
                    
                    // 等比例缩放tips以适应容器宽度
                    setTimeout(() => {
                        const containerWidth = tipsContainer.offsetWidth;
                        const contentWidth = scaleWrapper.scrollWidth;
                        if (contentWidth > containerWidth && containerWidth > 0) {
                            const scale = containerWidth / contentWidth;
                            scaleWrapper.style.transform = `scale(${scale})`;
                            scaleWrapper.style.width = `${100 / scale}%`;
                            // 调整容器高度以适应缩放后的内容
                            const scaledHeight = scaleWrapper.scrollHeight * scale;
                            tipsContainer.style.height = `${scaledHeight}px`;
                        }
                    }, 50);
                }
                
                item.appendChild(user);
                item.appendChild(content);
                container.appendChild(item);
            });
        }


        function renderTopicPanel(topic) {
            topicBody.innerHTML = '';
            if (!topic) {
                const empty = document.createElement('div');
                empty.className = 'clm-panel-empty';
                empty.textContent = '暫無主題內容';
                topicBody.appendChild(empty);
                return;
            }
            
            const item = document.createElement('div');
            item.className = 'clm-panel-entry';
            
            // 显示标题和标签
            const titleContainer = document.createElement('div');
            titleContainer.className = 'clm-panel-entry-title';
            
            if (topic.titleInfo && (topic.titleInfo.quality || topic.titleInfo.size || topic.titleInfo.code || topic.titleInfo.title)) {
                // 显示标签（清晰度、文件大小、番号）
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'clm-panel-entry-title-tags';
                let hasTags = false;
                
                // 清晰度标签
                if (topic.titleInfo.quality) {
                    const qualityTag = document.createElement('span');
                    qualityTag.className = 'clm-panel-entry-title-tag clm-title-tag-quality';
                    qualityTag.textContent = topic.titleInfo.quality;
                    tagsContainer.appendChild(qualityTag);
                    hasTags = true;
                }
                
                // 文件大小标签
                if (topic.titleInfo.size) {
                    const sizeTag = document.createElement('span');
                    sizeTag.className = 'clm-panel-entry-title-tag clm-title-tag-size';
                    sizeTag.textContent = topic.titleInfo.size;
                    tagsContainer.appendChild(sizeTag);
                    hasTags = true;
                }
                
                // 番号标签 - 嵌套结构：外层包裹完整番号，内层包裹前缀
                if (topic.titleInfo.code) {
                    const codeTag = document.createElement('span');
                    codeTag.className = 'clm-panel-entry-title-tag clm-title-tag-code';
                    
                    // 解析番号，分离前缀和后缀（如 UMSO-618 -> UMSO 和 -618）
                    const code = topic.titleInfo.code;
                    const separatorMatch = code.match(/^([A-Z0-9]+)([-_])([0-9]+)$/i);
                    
                    if (separatorMatch) {
                        // 有分隔符的情况：创建嵌套结构
                        const prefix = separatorMatch[1]; // UMSO
                        const separator = separatorMatch[2]; // -
                        const suffix = separatorMatch[3]; // 618
                        
                        const prefixTag = document.createElement('span');
                        prefixTag.className = 'clm-title-tag-code-prefix';
                        prefixTag.textContent = prefix;
                        prefixTag.style.cursor = 'pointer';
                        prefixTag.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 通过全局变量访问searchDialog
                            const dialog = window.clmSearchDialog;
                            if (dialog) {
                                dialog.open(prefix);
                            }
                        });
                        
                        // 创建后缀标签（可点击，搜索完整番号）
                        const suffixTag = document.createElement('span');
                        suffixTag.className = 'clm-title-tag-code-suffix';
                        suffixTag.textContent = separator + suffix;
                        suffixTag.style.cursor = 'pointer';
                        suffixTag.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 通过全局变量访问searchDialog
                            const dialog = window.clmSearchDialog;
                            if (dialog && typeof dialog.open === 'function') {
                                dialog.open(code); // 搜索完整番号
                            }
                        });
                        
                        codeTag.appendChild(prefixTag);
                        codeTag.appendChild(suffixTag);
                    } else {
                        // 没有分隔符的情况：直接显示完整番号
                        codeTag.textContent = code;
                    }
                    
                    tagsContainer.appendChild(codeTag);
                    hasTags = true;
                }
                
                if (hasTags) {
                    titleContainer.appendChild(tagsContainer);
                }
                
                // 显示标题文本（片名）
                if (topic.titleInfo.title) {
                    const titleText = document.createElement('div');
                    titleText.className = 'clm-panel-entry-title-text';
                    titleText.textContent = topic.titleInfo.title;
                    titleContainer.appendChild(titleText);
                }
            } else if (topic.rawTitle) {
                // 如果没有 titleInfo，显示原始标题
                const titleText = document.createElement('div');
                titleText.className = 'clm-panel-entry-title-text';
                titleText.textContent = topic.rawTitle;
                titleContainer.appendChild(titleText);
            }
            
            // 只有当有标题内容时才添加到 item
            if (titleContainer.children.length > 0) {
                item.appendChild(titleContainer);
            }
            
            // 显示用户
            const user = document.createElement('div');
            user.className = 'clm-panel-entry-user';
            user.textContent = topic.user || '匿名';
            item.appendChild(user);
            
            // 显示内容
            const content = document.createElement('div');
            content.className = 'clm-panel-entry-content';
            content.innerHTML = formatContentWithTags(topic.content || '（無內容）');
            
            // 为出演者标签添加点击事件（只绑定到出演者标签，不包括类型标签）
            // 等待DOM更新后直接为每个出演者标签绑定事件
            setTimeout(() => {
                content.querySelectorAll('.clm-performer-tag').forEach(tag => {
                    // 设置样式，确保可以点击
                    tag.style.pointerEvents = 'auto';
                    tag.style.cursor = 'pointer';
                    tag.style.position = 'relative';
                    tag.style.zIndex = '10';
                    
                    // 添加点击事件（使用捕获阶段确保事件被处理）
                    const clickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation(); // 阻止其他事件监听器
                        const keyword = tag.textContent.trim();
                        console.log('草榴Manager: 点击出演者标签:', keyword);
                        if (keyword) {
                            // 通过全局变量访问searchDialog
                            const dialog = window.clmSearchDialog;
                            console.log('草榴Manager: searchDialog:', dialog);
                            if (dialog && typeof dialog.open === 'function') {
                                console.log('草榴Manager: 调用 dialog.open:', keyword);
                                dialog.open(keyword);
                            } else {
                                console.warn('草榴Manager: searchDialog 未初始化或 open 方法不存在', dialog);
                            }
                        }
                    };
                    tag.addEventListener('click', clickHandler, true); // 使用捕获阶段确保事件被处理
                    tag.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    }, true);
                });
            }, 0);
            
            // 如果有 tips 元素，添加到内容中
            if (topic.tips && topic.tips.length > 0) {
                const tipsContainer = document.createElement('div');
                tipsContainer.className = 'clm-panel-entry-tips';
                const scaleWrapper = document.createElement('div');
                scaleWrapper.className = 'clm-panel-entry-tips-scale-wrapper';
                topic.tips.forEach(tipHtml => {
                    const tipDiv = document.createElement('div');
                    tipDiv.innerHTML = tipHtml;
                    scaleWrapper.appendChild(tipDiv);
                });
                tipsContainer.appendChild(scaleWrapper);
                content.appendChild(tipsContainer);
                
                // 等比例缩放tips以适应容器宽度
                setTimeout(() => {
                    const containerWidth = tipsContainer.offsetWidth;
                    const contentWidth = scaleWrapper.scrollWidth;
                    if (contentWidth > containerWidth && containerWidth > 0) {
                        const scale = containerWidth / contentWidth;
                        scaleWrapper.style.transform = `scale(${scale})`;
                        scaleWrapper.style.width = `${100 / scale}%`;
                        // 调整容器高度以适应缩放后的内容
                        const scaledHeight = scaleWrapper.scrollHeight * scale;
                        tipsContainer.style.height = `${scaledHeight}px`;
                    }
                }, 50);
            }
            
            item.appendChild(content);
            topicBody.appendChild(item);
        }

        function renderCommentsPanel(comments) {
            renderPanelEntries(commentsBody, comments || [], '暫無評論內容');
        }

        function renderViewerAds(ads) {
            if (!ads || !ads.length) {
                viewerAdsTop.style.display = 'none';
                viewerAdsBottom.style.display = 'none';
                return;
            }

            // 调试：输出要渲染的广告
            console.log('clm 渲染广告:', ads.length, ads);

            // 如果有两个或更多广告，第一个显示在上方，第二个显示在下方
            // 如果只有一个广告，显示在上方
            if (ads.length >= 2) {
                viewerAdsTopContainer.innerHTML = ads[0];
                viewerAdsTop.style.display = 'flex';
                viewerAdsBottomContainer.innerHTML = ads[1];
                viewerAdsBottom.style.display = 'flex';
            } else if (ads.length === 1) {
                viewerAdsTopContainer.innerHTML = ads[0];
                viewerAdsTop.style.display = 'flex';
                viewerAdsBottom.style.display = 'none';
            } else {
                viewerAdsTop.style.display = 'none';
                viewerAdsBottom.style.display = 'none';
            }
            
            // 调试：检查渲染后的元素
            setTimeout(() => {
                const topFtad = viewerAdsTopContainer.querySelector('.ftad-ct');
                const bottomFtad = viewerAdsBottomContainer.querySelector('.ftad-ct');
                console.log('clm 渲染后检查:', {
                    topVisible: viewerAdsTop.style.display,
                    topHasFtad: !!topFtad,
                    bottomVisible: viewerAdsBottom.style.display,
                    bottomHasFtad: !!bottomFtad
                });
            }, 100);
        }

        function updateGalleryQuality(tag) {
            currentQualityTag = tag || null;
            updateQualityBadgeElement(galleryQualityBadge, currentQualityTag);
        }

        function beginImageLoad(message) {
            if (errorIndicatorTimer) {
                clearTimeout(errorIndicatorTimer);
                errorIndicatorTimer = null;
            }
            loadingIndicator.textContent = message || '正在載入…';
            viewer.classList.add('clm-viewer-loading');
            updateGalleryQuality(currentQualityTag);
        }

        function finishImageLoad() {
            if (errorIndicatorTimer) {
                clearTimeout(errorIndicatorTimer);
                errorIndicatorTimer = null;
            }
            viewer.classList.remove('clm-viewer-loading');
            loadingIndicator.textContent = '正在載入…';
        }

        function handleImageError() {
            if (errorIndicatorTimer) {
                clearTimeout(errorIndicatorTimer);
            }
            loadingIndicator.textContent = '載入失敗，請稍後重試';
            viewer.classList.add('clm-viewer-loading');
            errorIndicatorTimer = setTimeout(() => {
                viewer.classList.remove('clm-viewer-loading');
                loadingIndicator.textContent = '正在載入…';
                errorIndicatorTimer = null;
            }, 1600);
        }

        function updateMeta() {
            if (!items.length) {
                meta.textContent = '';
                return;
            }
            meta.textContent = `${currentIndex + 1} / ${items.length}　${items[currentIndex]?.label || ''}`;
        }

        function cleanupGalleryDownloadWatcher() {
            if (galleryDownloadUnsubscribe) {
                galleryDownloadUnsubscribe();
                galleryDownloadUnsubscribe = null;
            }
        }

        function refreshOverlayDownloadButton() {
            const hasDownload = currentThreadKey && currentDownloadInfo && currentDownloadInfo.pageUrl;
            if (!hasDownload) {
                downloadBtn.classList.remove('clm-downloaded');
                downloadBtn.disabled = true;
                downloadBtn.textContent = '暫無可下載資源';
                delete downloadBtn.dataset.clmThreadKey;
                downloadBtn.__clmRefreshDownloadState = null;
                return;
            }
            downloadBtn.dataset.clmThreadKey = currentThreadKey;
            downloadBtn.__clmRefreshDownloadState = refreshOverlayDownloadButton;
            const downloaded = hasDownloadedThread(currentThreadKey);
            downloadBtn.classList.toggle('clm-downloaded', downloaded);
            downloadBtn.disabled = false;
            downloadBtn.textContent = downloaded ? '已下載' : '打開下載頁面';
        }

        function updateDownloadAction(downloadInfo) {
            currentDownloadInfo = downloadInfo || null;
            cleanupGalleryDownloadWatcher();
            if (currentThreadKey && currentDownloadInfo && currentDownloadInfo.pageUrl) {
                galleryDownloadUnsubscribe = subscribeDownloadStatus(currentThreadKey, () => refreshOverlayDownloadButton());
            }
            refreshOverlayDownloadButton();
        }

        function handleDownloadClick() {
            if (!downloadBtn.dataset.clmThreadKey) return;
            handleThreadDownloadButtonClick(downloadBtn);
        }

        function resetImageTransform() {
            imageScale = 1;
            imageTranslateX = 0;
            imageTranslateY = 0;
            applyImageTransform();
        }

        function applyImageTransform() {
            viewerImg.style.transform = `translate(${imageTranslateX}px, ${imageTranslateY}px) scale(${imageScale})`;
            viewerImg.classList.toggle('clm-zoomed', imageScale > 1);
        }

        function zoomImage(delta, clientX, clientY) {
            const rect = viewerImg.getBoundingClientRect();
            const imgCenterX = rect.left + rect.width / 2;
            const imgCenterY = rect.top + rect.height / 2;
            
            // 计算鼠标相对于图片中心的位置
            const mouseX = clientX - imgCenterX;
            const mouseY = clientY - imgCenterY;
            
            // 缩放因子：向下滚动（delta > 0）缩小，向上滚动（delta < 0）放大
            const zoomFactor = delta > 0 ? 0.9 : 1.1;
            const newScale = Math.max(1, Math.min(5, imageScale * zoomFactor));
            
            if (newScale === imageScale) return;
            
            // 计算缩放后的偏移，使鼠标位置保持相对不变
            const scaleChange = newScale / imageScale;
            imageTranslateX = mouseX - (mouseX - imageTranslateX) * scaleChange;
            imageTranslateY = mouseY - (mouseY - imageTranslateY) * scaleChange;
            imageScale = newScale;
            
            applyImageTransform();
        }

        function showImage(index) {
            const item = items[index];
            if (!item) return;
            const token = ++currentImageToken;
            resetImageTransform();
            beginImageLoad();
            const targetSrc = item.url;
            viewerImg.onload = () => {
                if (token !== currentImageToken) return;
                finishImageLoad();
                resetImageTransform();
            };
            viewerImg.onerror = () => {
                if (token !== currentImageToken) return;
                handleImageError();
            };
            viewerImg.removeAttribute('src');
            requestAnimationFrame(() => {
                if (token !== currentImageToken) return;
                viewerImg.src = targetSrc;
                viewerImg.alt = item.label || '';
            });
            currentIndex = index;
            updateMeta();
        }

        function showNext() {
            if (items.length <= 1) return;
            const nextIndex = (currentIndex + 1) % items.length;
            showImage(nextIndex);
        }

        function showPrev() {
            if (items.length <= 1) return;
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            showImage(prevIndex);
        }

        function closeOverlay() {
            overlay.classList.remove('clm-active');
            viewerImg.removeAttribute('src');
            currentImageToken += 1;
            finishImageLoad();
            resetImageTransform();
            currentThreadKey = null;
            updateDownloadAction(null);
            updateGalleryQuality(null);
            clearGallerySourceHighlight();
            closeInlineDownloadWindowIfOpen();
        }

        function openLoadingState(message = '正在載入畫廊…') {
            overlay.classList.add('clm-active');
            items = [];
            currentIndex = 0;
            currentImageToken += 1;
            viewerImg.removeAttribute('src');
            viewerImg.alt = '';
            renderTopicPanel(null);
            renderCommentsPanel([]);
            renderViewerAds([]);
            meta.textContent = '';
            updateGalleryQuality(null);
            currentThreadKey = null;
            updateDownloadAction(null);
            beginImageLoad(message);
            closeInlineDownloadWindowIfOpen();
        }

        function openOverlay(newItems, options = {}) {
            if (!newItems || !newItems.length) return;
            const {
                startIndex = 0,
                topic = null,
                comments = [],
                download = null,
                threadUrl = null,
                qualityTag = null,
                ads = []
            } = options;
            items = newItems;
            currentIndex = Math.min(Math.max(startIndex, 0), items.length - 1);
            overlay.classList.add('clm-active');
            renderTopicPanel(topic);
            renderCommentsPanel(comments);
            renderViewerAds(ads);
            currentThreadKey = threadUrl ? normalizeThreadKey(threadUrl) : null;
            updateGalleryQuality(qualityTag);
            updateDownloadAction(download);
            showImage(currentIndex);
        }

        // 滚轮放大功能 - 绑定到viewer和图片上
        const handleWheel = (ev) => {
            if (!overlay.classList.contains('clm-active')) return;
            if (!viewerImg.src) return;
            
            ev.preventDefault();
            ev.stopPropagation();
            const delta = ev.deltaY;
            zoomImage(delta, ev.clientX, ev.clientY);
        };
        
        viewer.addEventListener('wheel', handleWheel, { passive: false });
        viewerImg.addEventListener('wheel', handleWheel, { passive: false });

        // 拖拽功能（当图片放大时）
        viewerImg.addEventListener('mousedown', (ev) => {
            if (imageScale <= 1) return;
            isDragging = true;
            dragStartX = ev.clientX;
            dragStartY = ev.clientY;
            dragStartTranslateX = imageTranslateX;
            dragStartTranslateY = imageTranslateY;
            viewerImg.style.cursor = 'grabbing';
            ev.preventDefault();
        });

        document.addEventListener('mousemove', (ev) => {
            if (!isDragging || imageScale <= 1) return;
            const deltaX = ev.clientX - dragStartX;
            const deltaY = ev.clientY - dragStartY;
            imageTranslateX = dragStartTranslateX + deltaX;
            imageTranslateY = dragStartTranslateY + deltaY;
            applyImageTransform();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (imageScale > 1) {
                    viewerImg.style.cursor = 'move';
                } else {
                    viewerImg.style.cursor = 'zoom-in';
                }
            }
        });

        // 双击重置缩放
        viewerImg.addEventListener('dblclick', () => {
            resetImageTransform();
        });

        closeBtn.addEventListener('click', () => closeOverlay());
        overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) {
                closeOverlay();
            }
        });
        leftBtn.addEventListener('click', () => showPrev());
        rightBtn.addEventListener('click', () => showNext());
        downloadBtn.addEventListener('click', () => handleDownloadClick());
        document.addEventListener('keydown', (ev) => {
            if (!overlay.classList.contains('clm-active')) return;
            if (ev.key === 'ArrowRight') {
                ev.preventDefault();
                showNext();
            } else if (ev.key === 'ArrowLeft') {
                ev.preventDefault();
                showPrev();
            } else if (ev.key === 'Escape') {
                ev.preventDefault();
                if (!closeInlineDownloadWindowIfOpen()) {
                    closeOverlay();
                }
            }
        });

        return {
            open: openOverlay,
            close: closeOverlay,
            isOpen: () => overlay.classList.contains('clm-active'),
            showNext,
            showPrev,
            showLoading: openLoadingState
        };
    }

    /**
     * -------------------------------
     *   搜索功能：点击标签进行搜索
     * -------------------------------
     */

    const SEARCH_SETTINGS_KEY = '草榴ManagerSearchSettings';

    const DEFAULT_SEARCH_SETTINGS = {
        f_fid: '', // 社区分类（必选）
        sch_area: '0', // 搜索帖子范围：0=主题标题, 1=主题标题与主题内容, 2=回复标题与回复内容
        sch_time: 'all', // 发表主题时间
        method: 'AND', // 关键词匹配方式：AND=完全匹配, OR=部分匹配
        orderway: 'postdate', // 结果排序：postdate=发布时间, lastpost=最后回复时间, replies=回复, hits=赞
        asc: 'DESC', // 升序/降序：ASC=升序, DESC=降序
        sch_author: '', // 限定用戶（用戶名）
        digest: false // 精华帖标志
    };

    function loadSearchSettings() {
        try {
            const raw = localStorage.getItem(SEARCH_SETTINGS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_SEARCH_SETTINGS, ...parsed };
            }
        } catch (e) {
            console.error('草榴Manager: 搜索设置读取失败，使用默认值', e);
        }
        return { ...DEFAULT_SEARCH_SETTINGS };
    }

    function saveSearchSettings(settings) {
        try {
            localStorage.setItem(SEARCH_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('草榴Manager: 搜索设置保存失败', e);
        }
    }

    function createSearchDialog() {
        const mask = document.createElement('div');
        mask.className = 'clm-search-dialog-mask';
        mask.style.display = 'none';

        const dialog = document.createElement('div');
        dialog.className = 'clm-search-dialog';

        const header = document.createElement('div');
        header.className = 'clm-search-dialog-header';
        const title = document.createElement('div');
        title.className = 'clm-search-dialog-title';
        title.textContent = '搜索选项';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'clm-search-dialog-close';
        closeBtn.textContent = '×';
        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.className = 'clm-search-dialog-body';

        // 关键词（必选）
        const keywordRow = document.createElement('div');
        keywordRow.className = 'clm-search-form-row';
        const keywordLabel = document.createElement('label');
        keywordLabel.className = 'clm-search-form-label required';
        keywordLabel.textContent = '关键词';
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.className = 'clm-search-form-input';
        keywordInput.name = 'keyword';
        keywordInput.id = 'sch_keyword';
        keywordInput.placeholder = '請輸入搜索關鍵詞';
        keywordRow.appendChild(keywordLabel);
        keywordRow.appendChild(keywordInput);
        body.appendChild(keywordRow);

        // 社区分类（必选）
        const fidRow = document.createElement('div');
        fidRow.className = 'clm-search-form-row';
        const fidLabel = document.createElement('label');
        fidLabel.className = 'clm-search-form-label required';
        fidLabel.textContent = '社区分类';
        const fidSelect = document.createElement('select');
        fidSelect.className = 'clm-search-form-select';
        fidSelect.name = 'f_fid';
        fidSelect.innerHTML = `
            <option value="">請選擇板塊</option>
            <option value="1">&gt;&gt; BT電影下載</option>
            <option value="2"> &nbsp;|- 亞洲無碼原創區</option>
            <option value="15"> &nbsp;|- 亞洲有碼原創區</option>
            <option value="4"> &nbsp;|- 歐美原創區</option>
            <option value="5"> &nbsp;|- 動漫原創區</option>
            <option value="25"> &nbsp;|- 國產原創區</option>
            <option value="26"> &nbsp;|- 中字原創區</option>
            <option value="28"> &nbsp;|- AI破解原創區</option>
            <option value="27"> &nbsp;|- 綜合分享區</option>
            <option value="21"> &nbsp;|- HTTP下載區</option>
            <option value="22"> &nbsp;|- 在綫成人影院</option>
            <option value="10"> &nbsp;|- 草榴影視庫</option>
            <option value="11"> &nbsp; &nbsp;|-  亞洲區</option>
            <option value="12"> &nbsp; &nbsp;|-  歐美區</option>
            <option value="13"> &nbsp; &nbsp;|-  動漫區</option>
            <option value="14"> &nbsp; &nbsp;|-  圖片區</option>
            <option value="23"> &nbsp; &nbsp;|-  博彩區</option>
            <option value="6">&gt;&gt; 草榴休閑區</option>
            <option value="7"> &nbsp;|- 技術討論區</option>
            <option value="8"> &nbsp;|- 新時代的我們</option>
            <option value="16"> &nbsp;|- 達蓋爾的旗幟</option>
            <option value="20"> &nbsp;|- 成人文學交流區</option>
            <option value="9"> &nbsp;|- 草榴資訊</option>
        `;
        fidRow.appendChild(fidLabel);
        fidRow.appendChild(fidSelect);
        body.appendChild(fidRow);

        // 搜索帖子范围
        const areaRow = document.createElement('div');
        areaRow.className = 'clm-search-form-row';
        const areaLabel = document.createElement('label');
        areaLabel.className = 'clm-search-form-label';
        areaLabel.textContent = '搜索帖子范围';
        const areaGroup = document.createElement('div');
        areaGroup.className = 'clm-search-form-radio-group';
        const area0 = document.createElement('div');
        area0.className = 'clm-search-form-radio';
        area0.innerHTML = '<input type="radio" name="sch_area" value="0" id="sch_area_0" checked><label for="sch_area_0">主题标题</label>';
        areaGroup.appendChild(area0);
        areaRow.appendChild(areaLabel);
        areaRow.appendChild(areaGroup);
        body.appendChild(areaRow);

        // 发表主题时间
        const timeRow = document.createElement('div');
        timeRow.className = 'clm-search-form-row';
        const timeLabel = document.createElement('label');
        timeLabel.className = 'clm-search-form-label';
        timeLabel.textContent = '发表主题时间';
        const timeSelect = document.createElement('select');
        timeSelect.className = 'clm-search-form-select';
        timeSelect.name = 'sch_time';
        timeSelect.innerHTML = `
            <option value="all">所有主题</option>
            <option value="86400">1天内的主题</option>
            <option value="172800">2天内的主题</option>
            <option value="604800">1星期内的主题</option>
            <option value="2592000">1个月内的主题</option>
            <option value="5184000">2个月内的主题</option>
            <option value="7776000">3个月内的主题</option>
            <option value="15552000">6个月内的主题</option>
            <option value="31536000">1年内的主题</option>
        `;
        timeRow.appendChild(timeLabel);
        timeRow.appendChild(timeSelect);
        body.appendChild(timeRow);

        // 关键词匹配方式
        const methodRow = document.createElement('div');
        methodRow.className = 'clm-search-form-row';
        const methodLabel = document.createElement('label');
        methodLabel.className = 'clm-search-form-label';
        methodLabel.textContent = '关键词匹配方式';
        const methodGroup = document.createElement('div');
        methodGroup.className = 'clm-search-form-radio-group';
        const methodAnd = document.createElement('div');
        methodAnd.className = 'clm-search-form-radio';
        methodAnd.innerHTML = '<input type="radio" name="method" value="AND" id="method_and" checked><label for="method_and">完全匹配</label>';
        const methodOr = document.createElement('div');
        methodOr.className = 'clm-search-form-radio';
        methodOr.innerHTML = '<input type="radio" name="method" value="OR" id="method_or"><label for="method_or">部分匹配</label>';
        methodGroup.appendChild(methodAnd);
        methodGroup.appendChild(methodOr);
        methodRow.appendChild(methodLabel);
        methodRow.appendChild(methodGroup);
        body.appendChild(methodRow);

        // 结果排序
        const orderRow = document.createElement('div');
        orderRow.className = 'clm-search-form-row';
        const orderLabel = document.createElement('label');
        orderLabel.className = 'clm-search-form-label';
        orderLabel.textContent = '结果排序';
        const orderSelect = document.createElement('select');
        orderSelect.className = 'clm-search-form-select';
        orderSelect.name = 'orderway';
        orderSelect.style.marginBottom = '8px';
        orderSelect.innerHTML = `
            <option value="postdate">发布时间</option>
            <option value="lastpost">最后回复时间</option>
            <option value="replies">回复</option>
            <option value="hits">赞</option>
        `;
        const ascGroup = document.createElement('div');
        ascGroup.className = 'clm-search-form-radio-group';
        const ascAsc = document.createElement('div');
        ascAsc.className = 'clm-search-form-radio';
        ascAsc.innerHTML = '<input type="radio" name="asc" value="ASC" id="asc_asc"><label for="asc_asc">升序</label>';
        const ascDesc = document.createElement('div');
        ascDesc.className = 'clm-search-form-radio';
        ascDesc.innerHTML = '<input type="radio" name="asc" value="DESC" id="asc_desc" checked><label for="asc_desc">降序</label>';
        ascGroup.appendChild(ascAsc);
        ascGroup.appendChild(ascDesc);
        orderRow.appendChild(orderLabel);
        orderRow.appendChild(orderSelect);
        orderRow.appendChild(ascGroup);
        body.appendChild(orderRow);

        // 限定用戶
        const authorRow = document.createElement('div');
        authorRow.className = 'clm-search-form-row';
        const authorLabel = document.createElement('label');
        authorLabel.className = 'clm-search-form-label';
        authorLabel.textContent = '限定用戶(請輸入用戶名或留空)';
        const authorInput = document.createElement('input');
        authorInput.type = 'text';
        authorInput.className = 'clm-search-form-input';
        authorInput.name = 'pwuser';
        authorInput.id = 'sch_author';
        authorInput.placeholder = '請輸入用戶名或留空';
        authorRow.appendChild(authorLabel);
        authorRow.appendChild(authorInput);
        body.appendChild(authorRow);

        // 精华帖标志
        const digestRow = document.createElement('div');
        digestRow.className = 'clm-search-form-row';
        const digestCheckbox = document.createElement('div');
        digestCheckbox.className = 'clm-search-form-checkbox';
        digestCheckbox.innerHTML = '<input type="checkbox" name="digest" value="1" id="digest_check"><label for="digest_check">精华帖标志</label>';
        digestRow.appendChild(digestCheckbox);
        body.appendChild(digestRow);

        const footer = document.createElement('div');
        footer.className = 'clm-search-dialog-footer';
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'clm-search-btn clm-search-btn-primary';
        searchBtn.textContent = '搜索';
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'clm-search-btn clm-search-btn-secondary';
        cancelBtn.textContent = '取消';
        footer.appendChild(searchBtn);
        footer.appendChild(cancelBtn);

        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        mask.appendChild(dialog);
        document.body.appendChild(mask);

        let currentKeyword = '';
        let currentSearchCallback = null;

        function open(keyword, callback) {
            currentKeyword = keyword;
            currentSearchCallback = callback;
            const settings = loadSearchSettings();
            
            // 设置关键词输入框
            const keywordInput = document.getElementById('sch_keyword');
            if (keywordInput) {
                keywordInput.value = keyword || '';
            }
            
            // 加载保存的设置
            fidSelect.value = settings.f_fid || '';
            
            // 清除所有单选按钮的选中状态
            document.querySelectorAll('input[name="sch_area"]').forEach(radio => {
                radio.checked = false;
            });
            document.querySelectorAll('input[name="method"]').forEach(radio => {
                radio.checked = false;
            });
            document.querySelectorAll('input[name="asc"]').forEach(radio => {
                radio.checked = false;
            });
            
            // 设置选中的单选按钮
            const schAreaRadio = document.querySelector('input[name="sch_area"][value="' + (settings.sch_area || '0') + '"]');
            if (schAreaRadio) schAreaRadio.checked = true;
            
            timeSelect.value = settings.sch_time || 'all';
            
            const methodRadio = document.querySelector('input[name="method"][value="' + (settings.method || 'AND') + '"]');
            if (methodRadio) methodRadio.checked = true;
            
            orderSelect.value = settings.orderway || 'postdate';
            
            const ascRadio = document.querySelector('input[name="asc"][value="' + (settings.asc || 'DESC') + '"]');
            if (ascRadio) ascRadio.checked = true;
            
            const digestCheck = document.getElementById('digest_check');
            if (digestCheck) {
                digestCheck.checked = settings.digest || false;
            }
            
            const authorInput = document.getElementById('sch_author');
            if (authorInput) {
                authorInput.value = settings.sch_author || '';
            }
            
            mask.style.display = 'flex';
        }

        function close() {
            mask.style.display = 'none';
            currentKeyword = '';
            currentSearchCallback = null;
        }

        function performSearch() {
            // 验证必选项
            const keywordInput = document.getElementById('sch_keyword');
            const keyword = keywordInput?.value.trim() || '';
            if (!keyword) {
                alert('请输入关键词（必选项）');
                if (keywordInput) keywordInput.focus();
                return;
            }
            if (!fidSelect.value) {
                alert('请选择社区分类（必选项）');
                fidSelect.focus();
                return;
            }

            // 收集表单数据
            const authorInput = document.getElementById('sch_author');
            const authorValue = authorInput?.value.trim() || '';
            const formData = {
                step: '2',
                s_type: 'forum',
                keyword: keyword,
                f_fid: fidSelect.value,
                sch_area: document.querySelector('input[name="sch_area"]:checked')?.value || '0',
                sch_time: timeSelect.value,
                method: document.querySelector('input[name="method"]:checked')?.value || 'AND',
                orderway: orderSelect.value,
                asc: document.querySelector('input[name="asc"]:checked')?.value || 'DESC',
                pwuser: authorValue,
                digest: document.getElementById('digest_check')?.checked ? '1' : ''
            };

            // 保存设置
            const settings = {
                f_fid: formData.f_fid,
                sch_area: formData.sch_area,
                sch_time: formData.sch_time,
                method: formData.method,
                orderway: formData.orderway,
                asc: formData.asc,
                sch_author: authorValue,
                digest: document.getElementById('digest_check')?.checked || false
            };
            saveSearchSettings(settings);

            // 构建搜索URL
            const params = new URLSearchParams();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    params.append(key, formData[key]);
                }
            });
            const searchUrl = 'https://t66y.com/search.php?' + params.toString();

            // 打开新标签页
            window.open(searchUrl, '_blank');

            // 执行回调
            if (currentSearchCallback) {
                currentSearchCallback();
            }

            close();
        }

        closeBtn.addEventListener('click', close);
        cancelBtn.addEventListener('click', close);
        searchBtn.addEventListener('click', performSearch);
        mask.addEventListener('click', (e) => {
            if (e.target === mask) {
                close();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mask.style.display === 'flex') {
                close();
            }
        });

        return {
            open,
            close
        };
    }

    function createInlineDownloadWindow() {
        const mask = document.createElement('div');
        mask.className = 'clm-download-window-mask';
        const preview = document.createElement('div');
        preview.className = 'clm-gallery-download-preview';

        const header = document.createElement('div');
        header.className = 'clm-gallery-download-preview-header';
        const headerMeta = document.createElement('div');
        headerMeta.style.display = 'flex';
        headerMeta.style.flexDirection = 'column';
        headerMeta.style.gap = '2px';
        const title = document.createElement('div');
        title.className = 'clm-gallery-download-preview-title';
        title.textContent = '下載窗口 · RMDOWN';
        const subtitle = document.createElement('div');
        subtitle.className = 'clm-gallery-download-preview-subtitle';
        headerMeta.appendChild(title);
        headerMeta.appendChild(subtitle);

        const link = document.createElement('a');
        link.className = 'clm-gallery-download-preview-link';
        link.textContent = '新窗口開啟';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        // 点击新窗口开启时，关闭下载窗口（避免遮挡）
        link.addEventListener('click', () => {
            close();
        });

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'clm-gallery-download-preview-close';
        closeBtn.textContent = '關閉';

        header.appendChild(headerMeta);
        header.appendChild(link);
        header.appendChild(closeBtn);

        const frame = document.createElement('iframe');
        frame.className = 'clm-gallery-download-preview-frame';
        frame.title = 'RMDOWN 下載內容';
        // 确保 iframe 允许导航，不设置 sandbox 属性以允许所有导航

        const footer = document.createElement('div');
        footer.className = 'clm-gallery-download-preview-footer';
        const status = document.createElement('div');
        status.className = 'clm-download-window-status';
        status.textContent = '準備載入下載頁面…';
        const fallbackHint = document.createElement('div');
        fallbackHint.style.marginTop = '6px';
        fallbackHint.style.fontSize = '11px';
        fallbackHint.style.color = 'rgba(0, 0, 0, 0.45)';
        fallbackHint.textContent = '若頁面無法顯示，請使用新窗口開啟連結。';
        footer.appendChild(status);
        footer.appendChild(fallbackHint);

        preview.appendChild(header);
        preview.appendChild(frame);
        preview.appendChild(footer);

        mask.appendChild(preview);
        document.body.appendChild(mask);

        const state = {
            open: false,
            currentUrl: '',
            loadPromise: null,
            loadResolve: null
        };

        function setTitle(text) {
            title.textContent = text || '下載窗口 · RMDOWN';
        }

        function setSubtitle(text) {
            subtitle.textContent = text || '';
        }

        function setLink(url) {
            if (url) {
                link.href = url;
                link.style.pointerEvents = '';
                link.style.opacity = '';
            } else {
                link.removeAttribute('href');
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.45';
            }
        }

        function setPageUrl(url) {
            state.currentUrl = url || '';
            // 重置加载 Promise
            if (state.loadResolve) {
                state.loadResolve = null;
            }
            state.loadPromise = null;
            
            if (url) {
                // 创建新的 Promise 用于等待加载完成
                state.loadPromise = new Promise((resolve) => {
                    state.loadResolve = resolve;
                });
                
                frame.src = url;
                // 记录初始 URL，用于检测页面跳转
                let initialUrl = url;
                let hasNavigated = false;
                
                // 监听 iframe 加载完成，尝试检测下载链接
                frame.onload = function() {
                    // 检查 iframe 是否发生了跳转（比如跳转到广告页面）
                    // 这是正常行为，当用户点击 DOWNLOAD 后，页面会跳转到广告页面
                    try {
                        const currentUrl = frame.contentWindow.location.href;
                        if (currentUrl !== initialUrl && !currentUrl.includes('rmdown.com')) {
                            // iframe 已跳转到其他页面（可能是广告页面），这是正常行为
                            // 保持窗口打开，让用户看到跳转后的页面
                            hasNavigated = true;
                            setStatus('頁面已跳轉到廣告頁面（正常行為）', 'info');
                            // 通知加载完成
                            if (state.loadResolve) {
                                state.loadResolve();
                                state.loadResolve = null;
                            }
                            return;
                        }
                        // 如果还在 rmdown.com 域名下，检查是否有 poData，以便后续跳转
                        if (currentUrl.includes('rmdown.com')) {
                            try {
                                const iframeWindow = frame.contentWindow;
                                if (typeof iframeWindow.poData !== 'undefined' && Array.isArray(iframeWindow.poData) && iframeWindow.poData.length > 0) {
                                    // poData 存在，跳转应该会在 downloadFile 完成后自动执行
                                    console.log('草榴Manager: 检测到 poData，等待自动跳转');
                                }
                            } catch (e) {
                                // 无法访问 iframe 的 window 对象
                            }
                        }
                    } catch (e) {
                        // 跨域限制，无法访问 location
                        // 这是正常的，当页面跳转到其他域名时会出现跨域限制
                        // 我们假设跳转已经发生，这是正常行为
                        if (!hasNavigated) {
                            // 可能是第一次加载后的跳转，更新状态
                            setStatus('頁面可能已跳轉（跨域限制無法檢測）', 'info');
                        }
                    }
                    
                    // 等待一小段时间，确保页面完全渲染
                    setTimeout(() => {
                        try {
                            // 尝试访问 iframe 内容（可能因跨域限制而失败）
                            const iframeDoc = frame.contentDocument || frame.contentWindow.document;
                            if (iframeDoc) {
                                // 查找所有可能的下载链接
                                const downloadLinks = iframeDoc.querySelectorAll('a[href*="download"], a[href*=".torrent"], button[onclick*="download"], button[onclick*="Download"], form[action*="download"], a[href*=".zip"], a[href*=".rar"], a[href*=".7z"]');
                                downloadLinks.forEach(link => {
                                    // 使用捕获阶段，确保在事件传播前就隐藏窗口
                                    link.addEventListener('click', function(e) {
                                        // 立即隐藏下载窗口，但允许跳转继续
                                        hideForDownload();
                                    }, true); // 使用捕获阶段
                                });
                                
                                // 也监听表单提交（可能用于下载）
                                const forms = iframeDoc.querySelectorAll('form');
                                forms.forEach(form => {
                                    form.addEventListener('submit', function() {
                                        // 立即隐藏下载窗口，但允许提交继续
                                        hideForDownload();
                                    }, true); // 使用捕获阶段
                                });
                                
                                // 监听所有链接点击（更广泛的捕获）
                                iframeDoc.addEventListener('click', function(e) {
                                    const target = e.target;
                                    // 检查是否是下载相关的链接
                                    if (target.tagName === 'A' || target.closest('a')) {
                                        const href = target.href || (target.closest('a')?.href);
                                        if (href && (href.includes('download') || href.includes('.torrent') || href.includes('.zip') || href.includes('.rar') || href.includes('.7z'))) {
                                            // 延迟一点，确保链接能正常触发
                                            setTimeout(() => {
                                                hideForDownload();
                                            }, 100);
                                        }
                                    }
                                }, true);
                                
                                // 监听 DOWNLOAD 按钮点击，确保允许页面跳转
                                // 查找所有按钮，然后筛选出包含 "DOWNLOAD" 文本的按钮
                                const allButtons = iframeDoc.querySelectorAll('button');
                                allButtons.forEach(btn => {
                                    const btnText = btn.textContent || btn.innerText || '';
                                    const btnOnclick = btn.getAttribute('onclick') || '';
                                    const btnTitle = btn.getAttribute('title') || '';
                                    // 检查是否是 DOWNLOAD 按钮
                                    if (btnOnclick.includes('downloadFile') || 
                                        btnTitle.toLowerCase().includes('download') ||
                                        btnText.toUpperCase().includes('DOWNLOAD')) {
                                        btn.addEventListener('click', function(e) {
                                            // 允许点击事件正常传播，不阻止默认行为
                                            // 这样 downloadFile() 函数可以正常执行，包括跳转到广告页面
                                            hideForDownload();
                                        }, false); // 不使用捕获阶段，让事件正常传播
                                    }
                                });
                            }
                        } catch (e) {
                            // 跨域限制，无法访问 iframe 内容
                            // 使用备用方案：监听 iframe 的 beforeunload 事件
                            try {
                                frame.contentWindow.addEventListener('beforeunload', function() {
                                    // 当 iframe 即将卸载时（可能是下载触发或页面跳转），暂时隐藏下载窗口
                                    hideForDownload();
                                });
                            } catch (e2) {
                                // 如果还是失败，忽略
                            }
                        }
                        
                        // 通知加载完成
                        if (state.loadResolve) {
                            state.loadResolve();
                            state.loadResolve = null;
                        }
                    }, 500); // 等待 500ms 确保页面完全加载
                };
            } else {
                frame.removeAttribute('src');
                frame.onload = null;
                // 如果没有 URL，立即 resolve
                if (state.loadResolve) {
                    state.loadResolve();
                    state.loadResolve = null;
                }
            }
        }
        
        function waitForLoad() {
            return state.loadPromise || Promise.resolve();
        }
        
        // 模拟点击 DOWNLOAD 按钮
        function simulateDownloadClick() {
            try {
                const iframeDoc = frame.contentDocument || frame.contentWindow?.document;
                if (!iframeDoc) {
                    console.warn('草榴Manager: 无法访问 iframe 内容，可能因跨域限制');
                    return false;
                }
                
                // 查找所有按钮，然后筛选出包含 "DOWNLOAD" 文本的按钮
                const allButtons = iframeDoc.querySelectorAll('button');
                for (const btn of allButtons) {
                    const btnText = btn.textContent || btn.innerText || '';
                    const btnOnclick = btn.getAttribute('onclick') || '';
                    const btnTitle = btn.getAttribute('title') || '';
                    // 检查是否是 DOWNLOAD 按钮
                    if (btnOnclick.includes('downloadFile') || 
                        btnTitle.toLowerCase().includes('download') ||
                        btnText.toUpperCase().includes('DOWNLOAD')) {
                        console.log('草榴Manager: 找到 DOWNLOAD 按钮，正在模拟点击...');
                        // 创建并触发点击事件
                        const clickEvent = new MouseEvent('click', {
                            view: frame.contentWindow,
                            bubbles: true,
                            cancelable: true
                        });
                        btn.dispatchEvent(clickEvent);
                        // 如果按钮有 onclick 属性，也直接调用
                        if (btnOnclick.includes('downloadFile')) {
                            try {
                                // 尝试在 iframe 的 window 上下文中执行 onclick
                                const iframeWindow = frame.contentWindow;
                                if (iframeWindow && typeof iframeWindow.downloadFile === 'function') {
                                    iframeWindow.downloadFile(btn);
                                } else if (btn.onclick) {
                                    btn.onclick();
                                }
                            } catch (e) {
                                console.warn('草榴Manager: 执行 onclick 失败', e);
                            }
                        }
                        hideForDownload();
                        return true;
                    }
                }
                console.warn('草榴Manager: 未找到 DOWNLOAD 按钮');
                return false;
            } catch (e) {
                console.error('草榴Manager: 模拟点击 DOWNLOAD 按钮失败', e);
                return false;
            }
        }
        
        // 暂时隐藏下载窗口，以便浏览器的文件保存对话框显示在最上层
        function hideForDownload() {
            // 使用 display: none 而不是 visibility，确保完全隐藏
            mask.style.display = 'none';
            mask.style.zIndex = '1'; // 降低 z-index
            // 10秒后恢复显示（给文件保存对话框足够的时间）
            setTimeout(() => {
                if (state.open) {
                    mask.style.display = '';
                    mask.style.zIndex = ''; // 恢复 z-index
                }
            }, 10000);
        }

        function setStatus(text, variant = 'info') {
            status.textContent = text || '準備中…';
            if (variant === 'success' || variant === 'error') {
                status.dataset.variant = variant;
            } else {
                delete status.dataset.variant;
            }
        }

        function open(options = {}) {
            if (!state.open) {
                state.open = true;
                mask.classList.add('clm-active');
            }
            preview.classList.add('clm-active');
            setTitle(options.title || null);
            setSubtitle(options.subtitle || '');
            if (options.pageUrl) {
                setPageUrl(options.pageUrl);
                setLink(options.pageUrl);
            } else if (state.currentUrl) {
                setLink(state.currentUrl);
            } else if (options.link) {
                setLink(options.link);
            } else {
                setLink('');
                setPageUrl('');
            }
            setStatus(options.status || '正在初始化下載窗口…');
        }

        function close() {
            if (!state.open) return;
            state.open = false;
            mask.classList.remove('clm-active');
            preview.classList.remove('clm-active');
            state.currentUrl = '';
            setLink('');
            setStatus('準備載入下載頁面…');
            frame.removeAttribute('src');
            // 重置加载 Promise
            if (state.loadResolve) {
                state.loadResolve = null;
            }
            state.loadPromise = null;
            
            // 重置所有处于忙碌状态的下载按钮
            const busyButtons = document.querySelectorAll('[data-clm-busy="1"]');
            for (const btn of busyButtons) {
                btn.dataset.clmBusy = '0';
                if (typeof btn.__clmRefreshDownloadState === 'function') {
                    btn.__clmRefreshDownloadState();
                } else {
                    btn.disabled = false;
                }
            }
        }

        closeBtn.addEventListener('click', () => close());
        mask.addEventListener('click', (ev) => {
            if (ev.target === mask) {
                close();
            }
        });
        preview.addEventListener('click', (ev) => ev.stopPropagation());
        
        // ESC 键关闭下载窗口
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape' && state.open) {
                ev.preventDefault();
                ev.stopPropagation();
                close();
            }
        });

        return {
            open,
            close,
            setTitle,
            setSubtitle,
            setLink,
            setPageUrl,
            setStatus,
            waitForLoad,
            simulateDownloadClick,
            isOpen: () => state.open,
            getFrame: () => frame
        };
    }

    const searchDialog = createSearchDialog();
    // 将searchDialog存储到全局变量，以便在闭包中访问
    window.clmSearchDialog = searchDialog;
    const galleryOverlay = createGalleryOverlay();
    const inlineDownloadWindow = createInlineDownloadWindow();
    // 将 inlineDownloadWindow 存储到全局变量，以便在闭包中访问
    window.clmInlineDownloadWindow = inlineDownloadWindow;

    function closeInlineDownloadWindowIfOpen() {
        if (inlineDownloadWindow.isOpen()) {
            inlineDownloadWindow.close();
            return true;
        }
        return false;
    }
    let galleryLoadToken = 0;

    async function fetchThreadData(threadUrl) {
        if (!threadUrl) return null;
        const normalized = getAbsoluteUrl(threadUrl);
        if (!normalized) return null;
        if (threadDataCache.has(normalized)) {
            return threadDataCache.get(normalized);
        }
        const fetchPromise = (async () => {
            try {
                const resp = await fetch(normalized, { credentials: 'include' });
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}`);
                }
                const html = await resp.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const threadContent = doc.querySelector('.tpc_content');
                const gallery = collectGalleryImages(threadContent, normalized);
                // 先恢复广告（执行 spinit），这样 tips 中的表格会被生成
                const adsWithFallback = await collectThreadAdsWithScriptFallback(doc, normalized, html);
                // 然后再提取 tips（此时 tips 已经包含完整的表格内容）
                const { topic, comments, ads: contextAds } = collectThreadContext(doc);
                const ads = adsWithFallback.length > 0 ? adsWithFallback : contextAds;
                const download = extractThreadDownloadInfo(doc, normalized);
                const qualityTag = resolveQualityTagFromDocument(doc);
                return { gallery, topic, comments, download, qualityTag, ads };
            } catch (err) {
                console.error('clm 論壇畫廊載入失敗', normalized, err);
                return { gallery: [], topic: null, comments: [], ads: [] };
            }
        })();
        threadDataCache.set(normalized, fetchPromise);
        return fetchPromise;
    }

    async function openGalleryForThread(threadUrl, options = {}) {
        if (!threadUrl) return null;
        const { instant = false, qualityTag: requestedQualityTag = null } = options;
        focusGallerySource(threadUrl, currentListHoverCtx);
        const loadToken = ++galleryLoadToken;
        if (instant) {
            galleryOverlay.showLoading();
        }
        const data = await fetchThreadData(threadUrl);
        if (loadToken !== galleryLoadToken) {
            return null;
        }
        if (!data || !data.gallery.length) {
            clearGallerySourceHighlight();
            if (instant && galleryOverlay.isOpen()) {
                galleryOverlay.close();
            }
            alert('未找到該帖子的畫廊內容');
            return null;
        }
        const hoverQualityTag = requestedQualityTag ?? currentListHoverCtx?.qualityTag ?? null;
        galleryOverlay.open(data.gallery, {
            startIndex: 0,
            topic: data.topic || null,
            comments: data.comments || [],
            download: data.download || null,
            threadUrl,
            qualityTag: data.qualityTag || hoverQualityTag || null,
            ads: data.ads || []
        });
        markThreadGalleryVisited(threadUrl);
        return data;
    }

    function setupThreadDownloadButton(btn, options = {}) {
        const defaultLabel = options.label || '下載';
        const downloadedLabel = options.downloadedLabel || '已下載';
        btn.textContent = defaultLabel;
        const threadKey = normalizeThreadKey(options.threadUrl);
        if (!threadKey) {
            btn.disabled = true;
            btn.title = '無法解析帖子地址';
            return;
        }
        const container = options.container || null;
        const containerClass = options.containerClass || '';
        const defaultTitle = '下載到 qBittorrent';
        const downloadedTitle = '已下載，可再次發送到 qBittorrent';
        if (options.threadTitle) {
            btn.dataset.clmThreadTitle = options.threadTitle;
        } else {
            delete btn.dataset.clmThreadTitle;
        }

        const updateState = () => {
            const downloaded = hasDownloadedThread(threadKey);
            btn.classList.toggle('clm-downloaded', downloaded);
            btn.textContent = downloaded ? downloadedLabel : defaultLabel;
            btn.title = downloaded ? downloadedTitle : defaultTitle;
            if (container && containerClass) {
                container.classList.toggle(containerClass, downloaded);
            }
            if (btn.dataset.clmBusy !== '1') {
                btn.disabled = false;
            }
        };

        btn.dataset.clmThreadKey = threadKey;
        btn.__clmRefreshDownloadState = updateState;
        updateState();
        subscribeDownloadStatus(threadKey, () => updateState());

        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (btn.dataset.clmBusy === '1') return;
            handleThreadDownloadButtonClick(btn);
        });
    }

    async function handleThreadDownloadButtonClick(btn) {
        const threadKey = btn.dataset.clmThreadKey;
        if (!threadKey) return;
        btn.dataset.clmBusy = '1';
        btn.disabled = true;
        inlineDownloadWindow.open({
            subtitle: btn.dataset.clmThreadTitle || '',
            status: '正在載入帖子內容…'
        });
        const restore = () => {
            btn.dataset.clmBusy = '0';
            if (typeof btn.__clmRefreshDownloadState === 'function') {
                btn.__clmRefreshDownloadState();
            } else {
                btn.disabled = false;
            }
        };
        try {
            btn.textContent = '載入帖子…';
            inlineDownloadWindow.setStatus('正在解析帖子與下載資訊…');
            const threadData = await fetchThreadData(threadKey);
            if (!threadData || !threadData.download || !threadData.download.pageUrl) {
                inlineDownloadWindow.setStatus('該帖子沒有可解析的下載連結。', 'error');
                alert('該帖子沒有可解析的下載連結。');
                return;
            }
            inlineDownloadWindow.setPageUrl(threadData.download.pageUrl);
            inlineDownloadWindow.setLink(threadData.download.pageUrl);
            inlineDownloadWindow.setStatus('正在載入下載頁面，請稍候…');
            btn.textContent = '載入中…';
            
            // 等待下载窗口完全加载
            try {
                await inlineDownloadWindow.waitForLoad();
                // 检查下载窗口是否仍然打开
                if (!inlineDownloadWindow.isOpen()) {
                    return;
                }
                inlineDownloadWindow.setStatus('下載頁面已載入，準備模擬點擊 DOWNLOAD…');
                // 等待一小段时间确保页面完全渲染
                await new Promise(resolve => setTimeout(resolve, 500));
                // 检查下载窗口是否仍然打开
                if (!inlineDownloadWindow.isOpen()) {
                    return;
                }
                // 模拟点击 DOWNLOAD 按钮
                const clicked = inlineDownloadWindow.simulateDownloadClick();
                if (clicked) {
                    inlineDownloadWindow.setStatus('已模擬點擊 DOWNLOAD，等待頁面跳轉…');
                    // 等待页面跳转（通常跳转到广告页面）
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // 检查下载窗口是否仍然打开
                    if (!inlineDownloadWindow.isOpen()) {
                        return;
                    }
                } else {
                    inlineDownloadWindow.setStatus('未找到 DOWNLOAD 按鈕，嘗試直接解析下載連結…');
                }
            } catch (err) {
                console.error('草榴Manager: 等待下載頁面載入失敗', err);
                // 即使失败也继续，给用户一个超时保护
            }
            
            // 检查下载窗口是否仍然打开
            if (!inlineDownloadWindow.isOpen()) {
                return;
            }
            
            btn.textContent = '選擇儲存位置…';
            let settings;
            try {
                settings = loadSettings();
            } catch (err) {
                console.error('草榴Manager: 設置讀取失敗', err);
                inlineDownloadWindow.setStatus('無法讀取設置，請稍後再試。', 'error');
                alert('無法讀取設置，請稍後再試。');
                return;
            }
            if (!settings.qb.enabled) {
                inlineDownloadWindow.setStatus('請先在設置中啟用 qBittorrent 集成。', 'error');
                alert('請先在草榴Manager 設置中啟用 qBittorrent 集成。');
                return;
            }
            inlineDownloadWindow.setStatus('請選擇 qBittorrent 儲存預設…');
            const preset = await openPresetPickerDialog(settings);
            if (!preset) {
                inlineDownloadWindow.setStatus('已取消發送至 qBittorrent。');
                return;
            }
            // 检查下载窗口是否仍然打开
            if (!inlineDownloadWindow.isOpen()) {
                return;
            }
            btn.textContent = '解析下載連結…';
            inlineDownloadWindow.setStatus('正在獲取種子…');
            const resolved = await resolveThreadDownloadTarget(threadData.download);
            inlineDownloadWindow.setStatus('正在發送到 qBittorrent…');
            const ok = await sendToQbittorrent(resolved, preset.id);
            if (ok) {
                inlineDownloadWindow.setStatus('已自動點擊 DOWNLOAD 並發送至 qBittorrent。', 'success');
                markThreadDownloaded(threadKey);
            } else {
                inlineDownloadWindow.setStatus('發送到 qBittorrent 失敗。', 'error');
            }
        } catch (err) {
            console.error('草榴Manager: 列表下載按鈕執行失敗', err);
            inlineDownloadWindow.setStatus('下載流程失敗：' + (err?.message || err), 'error');
            alert('下載發送失敗：' + (err?.message || err));
        } finally {
            restore();
        }
    }

    document.addEventListener('keydown', (ev) => {
        if (galleryOverlay.isOpen()) return;
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        if (!currentListHoverCtx || !currentListHoverCtx.threadUrl) return;
        ev.preventDefault();
        openGalleryForThread(currentListHoverCtx.threadUrl, {
            instant: true,
            qualityTag: currentListHoverCtx.qualityTag || null
        });
    });

    injectStyle(`
        .clm-quality-badge {
            position: absolute;
            left: 12px;
            bottom: 12px;
            padding: 4px 12px 5px;
            font-size: 13px;
            line-height: 1;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            background: rgba(12, 12, 20, 0.82);
            color: #fff;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            pointer-events: none;
            display: none;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
            align-items: center;
            justify-content: center;
            min-width: 64px;
        }
        .clm-quality-badge:empty {
            display: none !important;
        }
        #tail .clm-tail-quality {
            left: 12px;
            bottom: 12px;
            top: auto;
            right: auto;
            transform-origin: bottom left;
            transform: translate(
                calc(var(--clm-tail-extra-x, 0px) * -1),
                var(--clm-tail-extra-y, 0px)
            ) scale(var(--clm-tail-scale, 1));
            font-size: 13px;
            padding: 4px 12px 5px;
            min-width: 64px;
        }
        .clm-gallery-quality {
            left: 24px;
            bottom: 24px;
            font-size: 14px;
            padding: 5px 16px 6px;
        }
        .wf_item .image-big.clm-gallery-focus-cover,
        .wf_item .image-big.clm-gallery-focus-cover:hover,
        .wf_item .image-big.clm-gallery-visited-cover,
        .wf_item .image-big.clm-gallery-visited-cover:hover {
            box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.85), 0 0 18px rgba(251, 146, 60, 0.45);
            border-radius: 8px;
        }
        .wf_item .image-big.clm-gallery-focus-cover img,
        .wf_item .image-big.clm-gallery-visited-cover img {
            outline: 3px solid rgba(249, 115, 22, 0.85);
            outline-offset: 2px;
        }
        .clm-gallery-focus-title,
        .clm-gallery-visited-title {
            color: #f97316 !important;
            text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
            font-weight: 700 !important;
        }
    `);

    const QUALITY_TAG_PATTERNS = [
        { tag: '2160P', regex: /\b(2160p|4k|uhd)\b/i },
        { tag: '1440P', regex: /\b(1440p|2k)\b/i },
        { tag: '1080P', regex: /\b1080p\b/i },
        { tag: '720P', regex: /\b720p\b/i },
        { tag: 'BluRay', regex: /\b(bluray|blu-ray|bd)\b/i },
        { tag: 'HDR', regex: /\bHDR\b/i },
        { tag: 'VR', regex: /\bVR\b/i },
        { tag: 'HD', regex: /\bHD\b/i },
        { tag: 'SD', regex: /\bSD\b/i }
    ];

    function detectQualityTagFromTitle(titleText) {
        if (!titleText) return null;
        for (const { tag, regex } of QUALITY_TAG_PATTERNS) {
            if (regex.test(titleText)) {
                return tag;
            }
        }
        return null;
    }

    function resolveQualityTagFromDocument(doc) {
        if (!doc) return null;
        const pieces = [];
        const selectors = [
            '.tpc_title h1',
            '.tpc_title .h',
            '.t table .tr1 h4',
            '.t table .tr2 h4',
            '.t table .tr3 h4',
            '.t table .tr4 h4',
            '.t table .tr5 h4',
            '.tpc_content h1',
            '.tpc_content .tpc_title',
            '.tpc_content strong',
            '.tpc_content b'
        ];
        selectors.forEach((sel) => {
            const el = doc.querySelector(sel);
            if (el?.textContent) {
                pieces.push(el.textContent);
            }
        });
        const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content');
        if (keywords) {
            pieces.push(keywords);
        }
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
        if (description) {
            pieces.push(description);
        }
        if (doc.title) {
            pieces.push(doc.title);
        } else {
            const titleEl = doc.querySelector('title');
            if (titleEl?.textContent) {
                pieces.push(titleEl.textContent);
            }
        }
        return detectQualityTagFromTitle(pieces.join(' '));
    }

    function resolveQualityTagFromListItem(wfItem, threadAnchor = null) {
        if (!wfItem) return null;
        const selectors = [
            '.title a',
            '.title',
            '.subject a',
            '.subject',
            '.t_subject',
            '.tsubject',
            '.wf_text tl',
            '.wf_text .tl',
            '.wf_text a',
            '.wf_text'
        ];
        const pieces = [];
        selectors.forEach((sel) => {
            const el = wfItem.querySelector(sel);
            if (!el) return;
            if (el.textContent) {
                pieces.push(el.textContent);
            }
            if (el.getAttribute) {
                const attrTitle = el.getAttribute('title');
                if (attrTitle) {
                    pieces.push(attrTitle);
                }
            }
        });
        if (threadAnchor) {
            if (threadAnchor.textContent) {
                pieces.push(threadAnchor.textContent);
            }
            const anchorTitle = threadAnchor.getAttribute('title');
            if (anchorTitle) {
                pieces.push(anchorTitle);
            }
        }
        const combined = pieces.join(' ').trim();
        return detectQualityTagFromTitle(combined);
    }

    function updateQualityBadgeElement(badgeEl, tag) {
        if (!badgeEl) return;
        if (tag) {
            badgeEl.textContent = tag.toUpperCase();
            badgeEl.style.display = 'inline-flex';
        } else {
            badgeEl.textContent = '';
            badgeEl.style.display = 'none';
        }
    }

    // 搜索页面（search.php）
    if (href.indexOf('search.php') !== -1) {
        // 搜索页已有預覽框 #tail，本腳本只對其中的封面圖做放大效果
        // 當鼠標移到預覽圖片區域上時，放大約 2 倍（約 100% 放大）
        injectStyle(`
            #tail {
                /* 保持原站腳本行為，不改位置邏輯，只增加放大效果所需樣式 */
                overflow: visible !important;
                z-index: 9999 !important;
                position: absolute !important;
                --clm-tail-scale: 1;
                --clm-tail-extra-x: 0px;
                --clm-tail-extra-y: 0px;
            }
            #tail img {
                transition: transform 0.2s ease-in-out;
                transform-origin: center center;
                border-radius: 4px;
            }
            #tail img:hover,
            #tail.clm-tail-force-zoom img {
                transform: scale(2);
                position: relative;
                z-index: 10000;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
                border: 2px solid #ffffff;
            }
            .clm-title-download {
                margin-left: 8px;
                padding: 2px 6px;
                font-size: 11px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                background: rgba(0, 0, 0, 0.65);
                color: #fff;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .clm-title-download.clm-downloaded {
                background: rgba(16, 185, 129, 0.85);
                border-color: rgba(255, 255, 255, 0.6);
                color: #fff;
            }
            tr.tr3.t_one.clm-thread-downloaded {
                background: rgba(34, 197, 94, 0.12);
            }
            .clm-title-download::before {
                content: '⬇';
                font-size: 11px;
            }
            .clm-title-download:hover {
                background: rgba(0, 0, 0, 0.85);
            }
            #tail .clm-tail-quality {
                z-index: 10002;
            }
        `);

        function updateTailQualityFollow() {
            const tail = document.getElementById('tail');
            if (!tail) return;
            const img = tail.querySelector('img');
            if (!img) {
                tail.style.removeProperty('--clm-tail-extra-x');
                tail.style.removeProperty('--clm-tail-extra-y');
                tail.style.removeProperty('--clm-tail-scale');
                return;
            }
            const baseWidth = img.clientWidth || img.naturalWidth;
            const baseHeight = img.clientHeight || img.naturalHeight;
            if (!baseWidth || !baseHeight) return;
            const scaleActive = tail.classList.contains('clm-tail-force-zoom') || tail.matches(':hover');
            const scale = scaleActive ? 2 : 1;
            if (scale <= 1) {
                tail.style.removeProperty('--clm-tail-extra-x');
                tail.style.removeProperty('--clm-tail-extra-y');
                tail.style.removeProperty('--clm-tail-scale');
                return;
            }
            const extraX = (baseWidth * (scale - 1)) / 2;
            const extraY = (baseHeight * (scale - 1)) / 2;
            tail.style.setProperty('--clm-tail-extra-x', `${extraX}px`);
            tail.style.setProperty('--clm-tail-extra-y', `${extraY}px`);
            tail.style.setProperty('--clm-tail-scale', `${scale}`);
        }

        function setTailZoomState(force) {
            const tailEl = document.getElementById('tail');
            if (!tailEl) return null;
            tailEl.classList.toggle('clm-tail-force-zoom', !!force);
            requestAnimationFrame(() => updateTailQualityFollow());
            return tailEl;
        }

        function getTailControls() {
            const tail = document.getElementById('tail');
            if (!tail) return null;

            if (tail.__clmControls) {
                return tail.__clmControls;
            }

            let tailHideTimer = null;

            function cancelHide() {
                if (tailHideTimer) {
                    clearTimeout(tailHideTimer);
                    tailHideTimer = null;
                }
            }

            function scheduleHide() {
                cancelHide();
                tailHideTimer = setTimeout(() => {
                    tail.style.display = 'none';
                    tail.classList.remove('clm-tail-force-zoom');
                    if (currentTailHoverCtx && currentListHoverCtx === currentTailHoverCtx) {
                        setCurrentListHover(null);
                    }
                    currentTailHoverCtx = null;
                    currentTailAnchorEl = null;
                    setTailQualityLabel(null);
                }, 200);
            }

            tail.addEventListener('mouseenter', cancelHide);
            tail.addEventListener('mouseleave', scheduleHide);
            tail.addEventListener('mouseenter', () => {
                if (currentTailHoverCtx) {
                    setCurrentListHover(currentTailHoverCtx);
                    setTailQualityLabel(currentTailHoverCtx.qualityTag || null);
                }
                updateTailQualityFollow();
            });
            tail.addEventListener('mouseleave', () => {
                if (currentTailHoverCtx && currentListHoverCtx === currentTailHoverCtx) {
                    setCurrentListHover(null);
                }
                updateTailQualityFollow();
            });
            tail.addEventListener('load', (ev) => {
                if (ev.target && ev.target.tagName === 'IMG') {
                    updateTailQualityFollow();
                }
            }, true);

            tail.__clmControls = { scheduleHide, cancelHide };
            return tail.__clmControls;
        }

        let currentTailAnchorEl = null;
        let currentTailHoverCtx = null;
        function ensureTailQualityElement() {
            const tail = document.getElementById('tail');
            if (!tail) return null;
            let badge = tail.querySelector('.clm-tail-quality');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'clm-quality-badge clm-tail-quality';
                badge.style.display = 'none';
                tail.appendChild(badge);
            }
            return badge;
        }

        function setTailQualityLabel(tag) {
            const badge = ensureTailQualityElement();
            if (!badge) return;
            updateQualityBadgeElement(badge, tag);
        }

        function adjustTailPositionForElement(anchorEl) {
            const tail = document.getElementById('tail');
            if (!tail || !anchorEl) return;
            const style = window.getComputedStyle(tail);
            if (style.display === 'none') {
                return;
            }
            const anchorRect = anchorEl.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 0;
            const viewportHeight = document.documentElement.clientHeight || window.innerHeight || 0;
            const tailRect = tail.getBoundingClientRect();
            let tailWidth = tailRect.width || tail.offsetWidth || 360;
            let tailHeight = tailRect.height || tail.offsetHeight || 240;
            if (!tailWidth) {
                tailWidth = 360;
            }
            if (!tailHeight) {
                tailHeight = 240;
            }
            const viewportLeft = scrollX + 12;
            const viewportRight = scrollX + Math.max(0, viewportWidth) - 12;
            let left = anchorRect.right + scrollX + 12;
            if (left + tailWidth > viewportRight) {
                left = anchorRect.left + scrollX - tailWidth - 12;
            }
            if (left < viewportLeft) {
                left = Math.max(viewportLeft, viewportRight - tailWidth);
            }
            let top = anchorRect.top + scrollY;
            const minTop = scrollY + 12;
            const maxTop = scrollY + Math.max(0, viewportHeight) - tailHeight - 12;
            if (top < minTop) {
                top = minTop;
            }
            if (top > maxTop) {
                top = maxTop;
            }
            tail.style.position = 'absolute';
            tail.style.left = `${Math.round(left)}px`;
            tail.style.top = `${Math.round(top)}px`;
        }

        function scheduleTailPositionUpdate(anchorEl) {
            if (!anchorEl) return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => adjustTailPositionForElement(anchorEl));
            });
        }

        function refreshTailPositionIfNeeded() {
            if (!currentTailAnchorEl) return;
            adjustTailPositionForElement(currentTailAnchorEl);
            updateTailQualityFollow();
        }

        window.addEventListener('scroll', refreshTailPositionIfNeeded, { passive: true });
        window.addEventListener('resize', refreshTailPositionIfNeeded);

        // 預先嘗試初始化（若 tail 尚未生成，後續 getTailControls 會再處理）
        getTailControls();

        // 讓「標題文字」懸停時也能觸發預覽圖片
        try {
            const rows = document.querySelectorAll('tr.tr3.t_one');
            rows.forEach(row => {
                const th = row.querySelector('th');
                if (!th) return;

                const titleLink = th.querySelector('a[target="_blank"]');
                const preSpan = th.querySelector('span.sgreen.pre');
                if (!titleLink || !preSpan) return;
                const threadUrl = getAbsoluteUrl(titleLink.getAttribute('href') || titleLink.href);
                const titleQualityTag = detectQualityTagFromTitle(
                    (titleLink.textContent || '') + ' ' + (titleLink.title || '')
                );

                if (threadUrl) {
                    bindGalleryVisitedIndicator(titleLink, threadUrl, 'title');
                }

                if (!th.querySelector('.clm-title-download')) {
                    const titleBtn = document.createElement('button');
                    titleBtn.type = 'button';
                    titleBtn.className = 'clm-title-download';
                    titleLink.insertAdjacentElement('afterend', titleBtn);
                    setupThreadDownloadButton(titleBtn, {
                        threadUrl,
                        container: row,
                        containerClass: 'clm-thread-downloaded',
                        label: '下載',
                        downloadedLabel: '已下載',
                        threadTitle: (titleLink.textContent || '').trim()
                    });
                }

                // 懸停標題時，調用站內的 preImg，並模擬一次 mousemove，讓預覽框立刻顯示
                let positionUpdateRaf = null;
                const updatePositionLoop = () => {
                    if (currentTailAnchorEl === titleLink) {
                        adjustTailPositionForElement(titleLink);
                        positionUpdateRaf = requestAnimationFrame(updatePositionLoop);
                    } else {
                        positionUpdateRaf = null;
                    }
                };
                
                titleLink.addEventListener('mouseenter', () => {
                    if (typeof pageWindow.preImg === 'function') {
                        pageWindow.preImg(preSpan);
                        const tailControls = getTailControls();
                        tailControls && tailControls.cancelHide && tailControls.cancelHide();

                        const rect = titleLink.getBoundingClientRect();
                        const scrollX = pageWindow.scrollX || window.scrollX;
                        const scrollY = pageWindow.scrollY || window.scrollY;
                        const centerX = rect.left + rect.width / 2 + scrollX;
                        const centerY = rect.top + rect.height / 2 + scrollY;

                        const moveEvent = new MouseEvent('mousemove', {
                            bubbles: true,
                            cancelable: true,
                            clientX: centerX - scrollX,
                            clientY: centerY - scrollY
                        });
                        preSpan.dispatchEvent(moveEvent);
                        setTailZoomState(true);
                        setTailQualityLabel(titleQualityTag);
                        currentTailAnchorEl = titleLink;
                        scheduleTailPositionUpdate(titleLink);
                        
                        // 持續更新 tail 位置，防止站內腳本根據鼠標位置更新導致閃爍
                        if (!positionUpdateRaf) {
                            positionUpdateRaf = requestAnimationFrame(updatePositionLoop);
                        }
                    }
                    if (threadUrl) {
                        const tailCover = document.getElementById('tail') || null;
                        const tailHoverCtx = {
                            source: 'search',
                            threadUrl,
                            cover: tailCover,
                            qualityTag: titleQualityTag,
                            titleEl: titleLink
                        };
                        currentTailHoverCtx = tailHoverCtx;
                        setCurrentListHover(tailHoverCtx);
                    }
                });

                // 鼠標離開標題時隱藏預覽框
                titleLink.addEventListener('mouseleave', () => {
                    // 停止位置更新循環
                    if (positionUpdateRaf) {
                        cancelAnimationFrame(positionUpdateRaf);
                        positionUpdateRaf = null;
                    }
                    
                    const tail = document.getElementById('tail');
                    if (tail) {
                        const tailControls = getTailControls();
                        if (tailControls && tailControls.scheduleHide) {
                            tailControls.scheduleHide();
                        } else {
                            tail.style.display = 'none';
                        }
                    }
                    currentTailAnchorEl = null;
                    if (currentListHoverCtx?.threadUrl === threadUrl) {
                        setCurrentListHover(null);
                    }
                });
            });
        } catch (e) {
            // 安全兜底，避免因站內腳本變動導致報錯
            console.error('草榴Manager(search.php) 綁定標題預覽時出錯: ', e);
        }
    }

    // 板塊圖文模式頁面（thread0806.php 圖文模式）
    if (href.indexOf('thread0806.php') !== -1) {
        // 圖文模式封面在 .wf_item .image-big img 中
        // 鼠標懸停封面圖時，放大約 2 倍（約 100% 放大），並保證不被父元素裁切
        injectStyle(`
            .wf_item .image-big {
                overflow: visible !important;
                position: relative;
                --clm-cover-scale: 1;
                --clm-cover-extra-x: 0px;
                --clm-cover-extra-y: 0px;
            }
            .wf_item .image-big img {
                transition: transform 0.2s ease-in-out;
                transform-origin: center center;
                border-radius: 4px;
            }
            .wf_item .image-big:hover img {
                transform: scale(2);
                position: relative;
                z-index: 9999;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
                border: 2px solid #ffffff;
            }
            .wf_item .clm-cover-download {
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 8px;
                font-size: 11px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                z-index: 1;
                transform-origin: top right;
                transform: translate(
                    var(--clm-cover-extra-x, 0px),
                    calc(var(--clm-cover-extra-y, 0px) * -1)
                ) scale(var(--clm-cover-scale, 1));
                transition: background 0.15s ease-in-out, transform 0.2s ease-in-out;
            }
            .wf_item .clm-cover-download.clm-downloaded {
                background: rgba(16, 185, 129, 0.9);
                border-color: rgba(255, 255, 255, 0.55);
            }
            .wf_item .clm-cover-download::before {
                content: '⬇';
                font-size: 11px;
            }
            .wf_item .image-big:hover .clm-cover-download {
                z-index: 10001;
            }
            .wf_item .clm-cover-download:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            .wf_item .clm-cover-quality {
                z-index: 1;
                transform-origin: bottom left;
                transform: translate(
                    calc(var(--clm-cover-extra-x, 0px) * -1),
                    var(--clm-cover-extra-y, 0px)
                ) scale(var(--clm-cover-scale, 1));
            }
            .wf_item .image-big:hover .clm-cover-quality {
                z-index: 10002;
            }
            .wf_item .clm-text-quality {
                position: relative;
                left: auto;
                bottom: auto;
                display: inline-flex;
                margin-top: 6px;
                transform: none;
            }
            .wf_item.clm-thread-downloaded {
                position: relative;
                box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
                border-radius: 6px;
            }
            .wf_item.clm-thread-downloaded::after {
                content: '已下載';
                position: absolute;
                top: 8px;
                left: 8px;
                background: rgba(34, 197, 94, 0.85);
                color: #fff;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 999px;
                letter-spacing: 0.08em;
                z-index: 2;
            }
        `);

        const COVER_SCALE = 2;

        function attachCoverDownloadButtons() {
            const covers = document.querySelectorAll('.wf_item .image-big');
            covers.forEach(cover => {
                if (cover.dataset.clmCoverBtnAttached === '1') return;
                cover.dataset.clmCoverBtnAttached = '1';
                const wfItem = cover.closest('.wf_item');

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'clm-cover-download';
                const qualityBadge = document.createElement('div');
                qualityBadge.className = 'clm-quality-badge clm-cover-quality';
                qualityBadge.style.display = 'none';
                cover.appendChild(qualityBadge);

                const img = cover.querySelector('img');
                const applyCoverButtonFollow = () => {
                    if (!img || !cover.matches(':hover')) return;
                    const baseWidth = img.clientWidth || img.naturalWidth;
                    const baseHeight = img.clientHeight || img.naturalHeight;
                    if (!baseWidth || !baseHeight) return;
                    const extraX = (baseWidth * (COVER_SCALE - 1)) / 2;
                    const extraY = (baseHeight * (COVER_SCALE - 1)) / 2;
                    cover.style.setProperty('--clm-cover-extra-x', `${extraX}px`);
                    cover.style.setProperty('--clm-cover-extra-y', `${extraY}px`);
                    cover.style.setProperty('--clm-cover-scale', `${COVER_SCALE}`);
                };
                const resetCoverButtonFollow = () => {
                    cover.style.removeProperty('--clm-cover-extra-x');
                    cover.style.removeProperty('--clm-cover-extra-y');
                    cover.style.removeProperty('--clm-cover-scale');
                };

                cover.addEventListener('mouseenter', applyCoverButtonFollow);
                cover.addEventListener('mousemove', applyCoverButtonFollow);
                cover.addEventListener('mouseleave', resetCoverButtonFollow);
                if (img) {
                    img.addEventListener('load', () => {
                        if (cover.matches(':hover')) {
                            applyCoverButtonFollow();
                        }
                    });
                }

                cover.appendChild(btn);

                let threadUrl = null;
                const threadAnchor = cover.querySelector('a[href]') ||
                    wfItem?.querySelector('a[href]');
                if (threadAnchor) {
                    const rawHref = threadAnchor.getAttribute('href') || threadAnchor.href;
                    threadUrl = getAbsoluteUrl(rawHref);
                    if (threadUrl) {
                        bindGalleryVisitedIndicator(cover, threadUrl, 'cover');
                    }
                    if (threadUrl) {
                        cover.addEventListener('mouseenter', () => {
                            const hoverQuality = ensureCoverQuality();
                            setCurrentListHover({
                                source: 'board',
                                threadUrl,
                                cover,
                                qualityTag: hoverQuality
                            });
                        });
                        cover.addEventListener('mouseleave', () => {
                            if (currentListHoverCtx?.cover === cover) {
                                setCurrentListHover(null);
                            }
                        });
                    }
                }

                const resolveCoverQuality = () => {
                    return resolveQualityTagFromListItem(wfItem, threadAnchor);
                };
                let cachedCoverQuality = null;
                const ensureCoverQuality = () => {
                    cachedCoverQuality = resolveCoverQuality();
                    updateQualityBadgeElement(qualityBadge, cachedCoverQuality);
                    return cachedCoverQuality;
                };
                ensureCoverQuality();

                setupThreadDownloadButton(btn, {
                    threadUrl,
                    container: wfItem,
                    containerClass: 'clm-thread-downloaded',
                    label: '下載',
                    downloadedLabel: '已下載',
                    threadTitle: (threadAnchor?.textContent || '').trim()
                });
            });
        }

        function attachTextOnlyQualityBadges() {
            const items = document.querySelectorAll('.wf_item');
            items.forEach(item => {
                if (item.querySelector('.image-big')) {
                    return;
                }
                const threadAnchor = item.querySelector('a[href]');
                const qualityTag = resolveQualityTagFromListItem(item, threadAnchor);
                let badge = item.querySelector('.clm-text-quality');
                if (!qualityTag) {
                    if (badge) {
                        badge.remove();
                    }
                    return;
                }
                const textContainer = item.querySelector('.wf_text');
                if (!textContainer) {
                    return;
                }
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'clm-quality-badge clm-text-quality';
                    textContainer.appendChild(badge);
                }
                updateQualityBadgeElement(badge, qualityTag);
            });
        }

        attachCoverDownloadButtons();
        attachTextOnlyQualityBadges();

        const coverObserver = new MutationObserver(() => {
            attachCoverDownloadButtons();
            attachTextOnlyQualityBadges();
        });
        coverObserver.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * -------------------------------
     *   全局：右下角設置面板 & qBittorrent
     * -------------------------------
     */

    const STORAGE_KEY = '草榴ManagerSettings';

    const DEFAULT_SETTINGS = {
        qb: {
            enabled: false,
            baseUrl: '',
            username: '',
            password: '',
            defaultCategory: '',
            savePresets: [
                {
                    id: 'default',
                    name: '預設下載目錄',
                    savePath: '',
                    tags: ''
                }
            ]
        }
    };

    function loadSettings() {
        let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    if (parsed.qb) {
                        Object.assign(settings.qb, parsed.qb);
                        if (Array.isArray(parsed.qb.savePresets)) {
                            settings.qb.savePresets = parsed.qb.savePresets.map((preset) => Object.assign({}, preset));
                        }
                    }
                }
            }
        } catch (e) {
            console.error('草榴Manager: 設置讀取失敗，使用默認值', e);
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        }
        normalizeSavePresets(settings);
        return settings;
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('草榴Manager: 設置保存失敗', e);
        }
    }

    function normalizeSavePresets(settings) {
        const list = Array.isArray(settings.qb.savePresets) ? settings.qb.savePresets : [];
        if (!list.length) {
            settings.qb.savePresets = DEFAULT_SETTINGS.qb.savePresets.map((preset) => Object.assign({}, preset));
            return;
        }
        let mutated = false;
        settings.qb.savePresets = list.map((preset, index) => {
            const cloned = Object.assign({}, preset);
            if (!cloned.id) {
                cloned.id = index === 0 ? 'default' : `preset_${Date.now()}_${index}`;
                mutated = true;
            }
            return cloned;
        });
        if (mutated) {
            saveSettings(settings);
        }
    }

    /**
     * 向頁面注入右下角的設置按鈕與面板
     */
    function createSettingsUI() {
        injectStyle(`
            .clm-settings-btn {
                position: fixed;
                right: 16px;
                bottom: 16px;
                z-index: 10001;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                border-radius: 16px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1.4;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
                user-select: none;
            }
            .clm-settings-btn:hover {
                background: rgba(0, 0, 0, 0.85);
            }
            .clm-settings-panel-mask {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .clm-settings-panel {
                width: 420px;
                max-width: 95vw;
                max-height: 85vh;
                background: #f5f5f5;
                color: #333;
                border-radius: 8px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
                font-size: 12px;
                display: flex;
                flex-direction: column;
            }
            .clm-settings-header {
                padding: 10px 12px;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #fafafa;
            }
            .clm-settings-close {
                cursor: pointer;
                padding: 0 6px;
            }
            .clm-settings-body {
                padding: 10px 12px;
                overflow: auto;
            }
            .clm-settings-footer {
                padding: 8px 12px;
                border-top: 1px solid #ddd;
                text-align: right;
                background: #fafafa;
            }
            .clm-form-row {
                margin-bottom: 8px;
            }
            .clm-form-row label {
                display: block;
                margin-bottom: 2px;
                font-weight: bold;
            }
            .clm-form-row input[type="text"],
            .clm-form-row input[type="password"] {
                width: 100%;
                box-sizing: border-box;
                padding: 4px 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
            }
            .clm-form-row input[type="checkbox"] {
                margin-right: 4px;
            }
            .clm-presets-list {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 6px;
                background: #fff;
                max-height: 200px;
                overflow: auto;
            }
            .clm-test-row {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .clm-test-status {
                font-size: 11px;
                color: #555;
            }
            .clm-test-status.clm-ok {
                color: #15803d;
            }
            .clm-test-status.clm-failed {
                color: #b91c1c;
            }
            .clm-preset-item {
                border-bottom: 1px dashed #eee;
                padding-bottom: 6px;
                margin-bottom: 6px;
            }
            .clm-preset-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
                margin-bottom: 0;
            }
            .clm-preset-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                font-weight: bold;
            }
            .clm-small-btn {
                display: inline-block;
                padding: 2px 6px;
                font-size: 11px;
                border-radius: 3px;
                border: 1px solid #aaa;
                background: #f7f7f7;
                cursor: pointer;
                margin-left: 4px;
            }
            .clm-small-btn:hover {
                background: #eee;
            }
            .clm-primary-btn {
                border-color: #2b7cff;
                background: #2b7cff;
                color: #fff;
            }
            .clm-primary-btn:hover {
                background: #1f5ecc;
            }
            .clm-log-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }
            .clm-log-box {
                max-height: 160px;
                overflow: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 6px;
                background: #fff;
                font-family: Consolas, monospace;
                font-size: 11px;
                line-height: 1.5;
            }
            .clm-log-entry {
                display: flex;
                gap: 6px;
                border-bottom: 1px dotted #eee;
                padding: 2px 0;
            }
            .clm-log-entry:last-child {
                border-bottom: none;
            }
            .clm-log-time {
                color: #6b7280;
                flex: 0 0 52px;
            }
            .clm-log-message {
                flex: 1;
                color: #111827;
            }
            .clm-log-entry.clm-log-info .clm-log-message {
                color: #1f2937;
            }
            .clm-log-entry.clm-log-success .clm-log-message {
                color: #15803d;
            }
            .clm-log-entry.clm-log-warning .clm-log-message {
                color: #b45309;
            }
            .clm-log-entry.clm-log-error .clm-log-message {
                color: #b91c1c;
            }
            .clm-log-empty {
                color: #9ca3af;
                text-align: center;
                padding: 8px 0;
            }
        `);

        const btn = document.createElement('div');
        btn.className = 'clm-settings-btn';
        btn.textContent = '草榴Manager 設置';
        btn.addEventListener('click', () => {
            openSettingsPanel();
        });
        document.body.appendChild(btn);
    }

    function openSettingsPanel() {
        const settings = loadSettings();
        let logUnsubscribe = null;
        let connectivityStatusEl = null;
        function clearConnectivityStatus() {
            if (!connectivityStatusEl) return;
            connectivityStatusEl.textContent = '';
            connectivityStatusEl.classList.remove('clm-ok', 'clm-failed');
        }

        const mask = document.createElement('div');
        mask.className = 'clm-settings-panel-mask';

        const panel = document.createElement('div');
        panel.className = 'clm-settings-panel';

        function closePanel() {
            if (logUnsubscribe) {
                logUnsubscribe();
                logUnsubscribe = null;
            }
            if (mask.parentNode) {
                mask.parentNode.removeChild(mask);
            }
        }

        const header = document.createElement('div');
        header.className = 'clm-settings-header';
        header.innerHTML = '<span>草榴Manager 設置</span>';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'clm-settings-close';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            closePanel();
        });
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.className = 'clm-settings-body';

        // qBittorrent 開關
        const rowEnable = document.createElement('div');
        rowEnable.className = 'clm-form-row';
        const enableLabel = document.createElement('label');
        const enableCheckbox = document.createElement('input');
        enableCheckbox.type = 'checkbox';
        enableCheckbox.checked = !!settings.qb.enabled;
        enableCheckbox.addEventListener('change', () => clearConnectivityStatus());
        enableLabel.appendChild(enableCheckbox);
        enableLabel.appendChild(document.createTextNode('啟用 qBittorrent 集成'));
        rowEnable.appendChild(enableLabel);
        body.appendChild(rowEnable);

        // 基本連接信息
        body.appendChild(createInputRow('qBittorrent WebUI 地址（如：http://127.0.0.1:8080）', settings.qb.baseUrl, (val) => {
            settings.qb.baseUrl = val.trim();
            clearConnectivityStatus();
        }));
        body.appendChild(createInputRow('qBittorrent 用戶名', settings.qb.username, (val) => {
            settings.qb.username = val.trim();
            clearConnectivityStatus();
        }));

        const rowPwd = document.createElement('div');
        rowPwd.className = 'clm-form-row';
        const pwdLabel = document.createElement('label');
        pwdLabel.textContent = 'qBittorrent 密碼';
        const pwdInput = document.createElement('input');
        pwdInput.type = 'password';
        pwdInput.value = settings.qb.password || '';
        pwdInput.addEventListener('input', () => {
            settings.qb.password = pwdInput.value;
            clearConnectivityStatus();
        });
        rowPwd.appendChild(pwdLabel);
        rowPwd.appendChild(pwdInput);
        body.appendChild(rowPwd);

        body.appendChild(createInputRow('統一分類（category）', settings.qb.defaultCategory, (val) => {
            settings.qb.defaultCategory = val.trim();
            clearConnectivityStatus();
        }));

        const testRow = document.createElement('div');
        testRow.className = 'clm-form-row clm-test-row';
        const testBtn = document.createElement('button');
        testBtn.type = 'button';
        testBtn.className = 'clm-small-btn';
        testBtn.textContent = '測試連通性';
        const testStatus = document.createElement('span');
        testStatus.className = 'clm-test-status';
        connectivityStatusEl = testStatus;
        testBtn.addEventListener('click', async () => {
            clearConnectivityStatus();
            testBtn.disabled = true;
            testBtn.textContent = '測試中…';
            try {
                const snapshot = JSON.parse(JSON.stringify(settings));
                snapshot.qb.enabled = enableCheckbox.checked;
                const version = await testQbittorrentConnectivity(snapshot);
                testStatus.textContent = '連通成功，版本：' + version;
                testStatus.classList.add('clm-ok');
            } catch (err) {
                testStatus.textContent = '連通失敗：' + (err?.message || err);
                testStatus.classList.add('clm-failed');
            } finally {
                testBtn.disabled = false;
                testBtn.textContent = '測試連通性';
            }
        });
        testRow.appendChild(testBtn);
        testRow.appendChild(testStatus);
        body.appendChild(testRow);

        // 多個儲存位置預設
        const presetsRow = document.createElement('div');
        presetsRow.className = 'clm-form-row';
        const presetsLabel = document.createElement('label');
        presetsLabel.textContent = '儲存位置預設（可為每個路徑設置標籤）';
        presetsRow.appendChild(presetsLabel);

        const presetsWrap = document.createElement('div');
        presetsWrap.className = 'clm-presets-list';

        function renderPresets() {
            presetsWrap.innerHTML = '';
            settings.qb.savePresets.forEach((preset, index) => {
                const item = document.createElement('div');
                item.className = 'clm-preset-item';

                const header = document.createElement('div');
                header.className = 'clm-preset-item-header';
                const title = document.createElement('span');
                title.textContent = preset.name || ('預設路徑 ' + (index + 1));
                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'clm-small-btn';
                deleteBtn.textContent = '刪除';
                deleteBtn.addEventListener('click', () => {
                    if (settings.qb.savePresets.length <= 1) {
                        alert('至少保留一個儲存位置。');
                        return;
                    }
                    settings.qb.savePresets.splice(index, 1);
                    renderPresets();
                });
                header.appendChild(title);
                header.appendChild(deleteBtn);
                item.appendChild(header);

                item.appendChild(createInputRow('名稱', preset.name, (val) => {
                    preset.name = val;
                    title.textContent = val || ('預設路徑 ' + (index + 1));
                }));
                item.appendChild(createInputRow('儲存路徑（savepath）', preset.savePath, (val) => {
                    preset.savePath = val;
                }));
                item.appendChild(createInputRow('標籤（tags，逗號分隔）', preset.tags, (val) => {
                    preset.tags = val;
                }));

                presetsWrap.appendChild(item);
            });
        }

        renderPresets();

        const addPresetBtn = document.createElement('button');
        addPresetBtn.className = 'clm-small-btn';
        addPresetBtn.textContent = '新增儲存位置';
        addPresetBtn.addEventListener('click', () => {
            const id = 'preset_' + Date.now();
            settings.qb.savePresets.push({
                id,
                name: '新建儲存位置',
                savePath: '',
                tags: ''
            });
            renderPresets();
        });

        presetsRow.appendChild(presetsWrap);
        presetsRow.appendChild(addPresetBtn);
        body.appendChild(presetsRow);

        const logRow = document.createElement('div');
        logRow.className = 'clm-form-row';
        const logLabel = document.createElement('label');
        logLabel.textContent = 'qBittorrent 調試日誌';
        logRow.appendChild(logLabel);

        const logToolbar = document.createElement('div');
        logToolbar.className = 'clm-log-toolbar';
        const logHint = document.createElement('span');
        logHint.textContent = '僅保留最近 80 條記錄';
        const clearLogBtn = document.createElement('button');
        clearLogBtn.type = 'button';
        clearLogBtn.className = 'clm-small-btn';
        clearLogBtn.textContent = '清空日誌';
        clearLogBtn.addEventListener('click', () => {
            clearQbLogs();
            showToast('日志已清空', 'success');
        });
        logToolbar.appendChild(logHint);
        logToolbar.appendChild(clearLogBtn);
        logRow.appendChild(logToolbar);

        const logBox = document.createElement('div');
        logBox.className = 'clm-log-box';
        logRow.appendChild(logBox);

        function renderLogs(entries) {
            const logs = (entries || getQbLogs()).slice().reverse();
            logBox.innerHTML = '';
            if (!logs.length) {
                const empty = document.createElement('div');
                empty.className = 'clm-log-empty';
                empty.textContent = '暫無日誌';
                logBox.appendChild(empty);
                return;
            }
            logs.forEach((log) => {
                const item = document.createElement('div');
                item.className = `clm-log-entry clm-log-${log.level || 'info'}`;

                const timeEl = document.createElement('span');
                timeEl.className = 'clm-log-time';
                timeEl.textContent = formatLogTime(log.time);

                const msgEl = document.createElement('span');
                msgEl.className = 'clm-log-message';
                msgEl.textContent = log.message;

                item.appendChild(timeEl);
                item.appendChild(msgEl);
                logBox.appendChild(item);
            });
        }
        renderLogs();
        logUnsubscribe = subscribeQbLogs(renderLogs);

        body.appendChild(logRow);

        const footer = document.createElement('div');
        footer.className = 'clm-settings-footer';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'clm-small-btn clm-primary-btn';
        saveBtn.textContent = '保存並關閉';
        saveBtn.addEventListener('click', () => {
            settings.qb.enabled = enableCheckbox.checked;
            saveSettings(settings);
            closePanel();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'clm-small-btn';
        cancelBtn.textContent = '取消';
        cancelBtn.addEventListener('click', () => {
            closePanel();
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(footer);

        mask.appendChild(panel);
        mask.addEventListener('click', (e) => {
            if (e.target === mask) {
                closePanel();
            }
        });

        document.body.appendChild(mask);
    }

    function createInputRow(labelText, value, onChange) {
        const row = document.createElement('div');
        row.className = 'clm-form-row';
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value || '';
        input.addEventListener('input', () => {
            onChange(input.value);
        });
        row.appendChild(label);
        row.appendChild(input);
        return row;
    }

    function openPresetPickerDialog(settingsOverride) {
        const settings = settingsOverride || loadSettings();
        normalizeSavePresets(settings);
        const presets = Array.isArray(settings.qb.savePresets) ? settings.qb.savePresets : [];
        if (!settings.qb.enabled) {
            showToast('請先啟用 qBittorrent 集成。', 'warning');
            return Promise.resolve(null);
        }
        if (!presets.length) {
            showToast('請先在設置中新增至少一個儲存位置。', 'warning');
            return Promise.resolve(null);
        }
        return new Promise((resolve) => {
            const mask = document.createElement('div');
            mask.className = 'clm-preset-picker-mask';

            const panel = document.createElement('div');
            panel.className = 'clm-preset-picker';

            const title = document.createElement('div');
            title.className = 'clm-preset-picker-title';
            title.textContent = '選擇儲存位置';
            panel.appendChild(title);

            const list = document.createElement('div');
            list.className = 'clm-preset-picker-list';

            presets.forEach((preset, index) => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'clm-preset-picker-option';
                const nameEl = document.createElement('strong');
                nameEl.textContent = preset.name || ('預設路徑 ' + (index + 1));
                const pathEl = document.createElement('span');
                pathEl.textContent = preset.savePath || '使用 qBittorrent 默認路徑';
                option.appendChild(nameEl);
                option.appendChild(pathEl);
                option.addEventListener('click', () => {
                    cleanup();
                    resolve(preset);
                });
                list.appendChild(option);
            });

            panel.appendChild(list);

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'clm-preset-picker-cancel';
            cancelBtn.textContent = '取消';
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });
            panel.appendChild(cancelBtn);

            mask.appendChild(panel);
            document.body.appendChild(mask);

            // 点击 mask 区域（但不是 panel）时关闭
            mask.addEventListener('click', (ev) => {
                if (ev.target === mask) {
                    cleanup();
                    resolve(null);
                }
            });
            
            // 阻止 panel 内的点击事件冒泡到 mask
            panel.addEventListener('click', (ev) => {
                ev.stopPropagation();
            });

            function cleanup() {
                if (mask.parentNode) {
                    mask.parentNode.removeChild(mask);
                }
            }
        });
    }

    async function ensureQbittorrentLogin(baseUrl, qbSettings, options = {}) {
        const { throwOnFail = false } = options;
        if (!qbSettings?.username || !qbSettings?.password) {
            return true;
        }
        const body = new URLSearchParams();
        body.set('username', qbSettings.username);
        body.set('password', qbSettings.password);
        try {
            const resp = await gmCompatibleFetch(baseUrl + '/api/v2/auth/login', {
                method: 'POST',
                credentials: 'include',
                body
            });
            if (!resp.ok) {
                const errMsg = 'HTTP ' + resp.status;
                if (throwOnFail) {
                    throw new Error('登錄失敗：' + errMsg);
                }
                console.error('草榴Manager: qBittorrent 登錄失敗', errMsg);
                return false;
            }
            const text = (await resp.text()).trim().toLowerCase();
            if (text.includes('fail')) {
                if (throwOnFail) {
                    throw new Error('登錄失敗，請確認帳號密碼');
                }
                console.error('草榴Manager: qBittorrent 登錄失敗 - 憑證錯誤');
                return false;
            }
            return true;
        } catch (err) {
            if (throwOnFail) {
                throw err;
            }
            console.error('草榴Manager: qBittorrent 登錄失敗', err);
            return false;
        }
    }

    async function testQbittorrentConnectivity(settings) {
        if (!settings?.qb?.baseUrl) {
            throw new Error('請先填寫 qBittorrent WebUI 地址。');
        }
        const base = settings.qb.baseUrl.replace(/\/+$/, '');
        appendQbLog('開始測試 qBittorrent 連線：' + base, 'info');
        await ensureQbittorrentLogin(base, settings.qb, { throwOnFail: true });
        try {
            const resp = await gmCompatibleFetch(base + '/api/v2/app/version', {
                method: 'GET',
                credentials: 'include'
            });
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            const version = (await resp.text()).trim();
            appendQbLog('連線測試成功，版本：' + (version || 'Unknown'), 'success');
            return version || 'Unknown';
        } catch (err) {
            const msg = err?.message || err;
            appendQbLog('連線測試失敗：' + msg, 'error');
            throw new Error('連線失敗：' + msg);
        }
    }

    /**
     * 對外導出：調用 qBittorrent 添加種子 / 磁力的函數
     * 可在 console 中調用：
     *   window.草榴ManagerSendToQb('magnet:?xt=urn:btih:....', '某個預設ID');
     */
    async function sendToQbittorrent(torrentSource, presetId) {
        const settings = loadSettings();
        const sourceDescriptor = typeof torrentSource === 'string'
            ? torrentSource
            : (torrentSource?.url || torrentSource?.filename || '');
        const resourceLabel = summarizeResource(sourceDescriptor);
        appendQbLog('收到下載請求：' + resourceLabel, 'info');
        if (!settings.qb.enabled) {
            appendQbLog('qBittorrent 集成未啟用，已取消請求。', 'warning');
            showToast('請先在設置中啟用 qBittorrent 集成。', 'warning');
            return false;
        }
        if (!settings.qb.baseUrl) {
            appendQbLog('未配置 qBittorrent WebUI 地址，已取消請求。', 'warning');
            showToast('請在設置中填寫 qBittorrent WebUI 地址。', 'warning');
            return false;
        }

        const base = settings.qb.baseUrl.replace(/\/+$/, '');
        appendQbLog('使用 WebUI 地址：' + base, 'info');

        try {
            await ensureQbittorrentLogin(base, settings.qb, { throwOnFail: true });
            appendQbLog('與 qBittorrent 會話建立成功。', 'success');
        } catch (err) {
            const msg = err?.message || err;
            appendQbLog('登入 qBittorrent 失敗：' + msg, 'error');
            showToast('登入 qBittorrent 失敗：' + msg, 'error');
            return false;
        }

        let preset = null;
        if (presetId) {
            preset = (settings.qb.savePresets || []).find(p => p.id === presetId);
        }
        if (!preset) {
            preset = settings.qb.savePresets && settings.qb.savePresets[0];
        }

        if (!preset) {
            appendQbLog('沒有可用的儲存位置預設，請先在設置中新增。', 'warning');
            showToast('請先新增儲存位置預設。', 'warning');
            return false;
        }

        appendQbLog('使用儲存預設：' + (preset.name || preset.id || '未命名') +
            (preset.savePath ? ` | 路徑：${preset.savePath}` : ''), 'info');

        const isBinaryPayload = typeof torrentSource === 'object' && !!torrentSource?.torrentBinary;
        let torrentUrl = null;
        let qbPayload = null;

        if (isBinaryPayload) {
            const buffer = ensureArrayBuffer(torrentSource.torrentBinary);
            if (!buffer || !buffer.byteLength) {
                appendQbLog('種子文件內容無效，已取消。', 'error');
                showToast('種子文件內容無效，無法發送。', 'error');
                return false;
            }
            const blob = new Blob([buffer], { type: 'application/x-bittorrent' });
            qbPayload = new FormData();
            qbPayload.append('torrents', blob, torrentSource.filename || 'download.torrent');
            appendQbLog('已取得種子文件，準備以上傳方式提交。', 'info');
        } else {
            torrentUrl = typeof torrentSource === 'string' ? torrentSource : torrentSource?.url;
            if (!torrentUrl) {
                appendQbLog('缺少有效的下載地址，已取消。', 'error');
                showToast('沒有可用的下載地址。', 'error');
                return false;
            }
            qbPayload = new URLSearchParams();
            qbPayload.append('urls', torrentUrl);
            appendQbLog('將以遠程 URL 方式提交種子。', 'info');
        }

        const appendCommonField = (key, value) => {
            if (!value) return;
            qbPayload.append(key, value);
        };
        appendCommonField('category', settings.qb.defaultCategory);
        appendCommonField('savepath', preset.savePath);
        appendCommonField('tags', preset.tags);

        appendQbLog(isBinaryPayload ? '正在以上傳方式向 qBittorrent 發送種子…' : '正在向 qBittorrent 發送下載請求…', 'info');

        // 尝试发送请求，如果失败则重试一次（重新登录后）
        let lastError = null;
        for (let attempt = 0; attempt < 2; attempt++) {
            if (attempt > 0) {
                appendQbLog('請求失敗，嘗試重新登錄後重試…', 'info');
                try {
                    await ensureQbittorrentLogin(base, settings.qb, { throwOnFail: true });
                    appendQbLog('重新登錄成功，正在重試…', 'success');
                } catch (loginErr) {
                    appendQbLog('重新登錄失敗：' + (loginErr?.message || loginErr), 'error');
                    break;
                }
            }

            try {
                const resp = await gmCompatibleFetch(base + '/api/v2/torrents/add', {
                    method: 'POST',
                    credentials: 'include',
                    body: qbPayload
                });
                const bodyText = (await resp.text()).trim();
                const lowered = bodyText.toLowerCase();
                
                if (!resp.ok || lowered.includes('fail')) {
                    const msg = `HTTP ${resp.status}` + (bodyText ? `，響應：${bodyText}` : '');
                    lastError = msg;
                    
                    // 检查是否是任务已存在的情况（HTTP 200 + "Fails."）
                    // qBittorrent 在任务已存在时会返回 HTTP 200 但响应内容是 "Fails."
                    if (resp.status === 200 && (bodyText === 'Fails.' || lowered === 'fails.')) {
                        // 这通常意味着任务已存在，不是真正的错误
                        appendQbLog('qBittorrent 回覆：任務可能已存在（' + bodyText + '）。請在 qBittorrent 客戶端檢查是否已有該下載任務。', 'warning');
                        showToast('任務可能已存在於 qBittorrent 中，請在客戶端確認。', 'warning');
                        return true; // 返回 true，因为这不是真正的错误
                    }
                    
                    // 如果是第一次尝试且响应是"Fails."，尝试重新登录后重试
                    if (attempt === 0 && lowered.includes('fail') && resp.status === 200) {
                        appendQbLog('下載請求被拒：' + msg + '，將嘗試重新登錄後重試…', 'warning');
                        continue; // 重试
                    }
                    
                    // 第二次尝试仍然失败，或者不是认证问题
                    let errorDetail = msg;
                    if (lowered.includes('fail')) {
                        if (!isBinaryPayload && torrentUrl) {
                            errorDetail += '。可能原因：1) 磁力鏈接無效或無法訪問；2) qBittorrent 無法連接到該 URL；3) 種子文件已損壞。';
                        } else if (isBinaryPayload) {
                            errorDetail += '。可能原因：1) 種子文件格式錯誤或已損壞；2) qBittorrent 配置問題。';
                        } else {
                            errorDetail += '。請檢查 qBittorrent 設置和日誌。';
                        }
                    }
                    appendQbLog('下載請求被拒：' + errorDetail, 'error');
                    showToast('發送到 qBittorrent 失敗：' + msg, 'error');
                    return false;
                }
                
                // 成功
                appendQbLog('qBittorrent 回覆成功：' + (bodyText || 'Ok'), 'success');
                showToast('已提交至 qBittorrent，請在客戶端確認。', 'success');
                
                // 在成功响应后 0.5 秒触发跳转到广告页面
                setTimeout(() => {
                    try {
                        // 获取 iframe（通过全局变量或参数传递）
                        const frame = window.clmInlineDownloadWindow?.getFrame?.();
                        if (!frame) {
                            console.warn('草榴Manager: 无法获取 iframe，跳转可能不会发生');
                            return;
                        }
                        
                        const iframeWindow = frame.contentWindow;
                        const iframeDoc = frame.contentDocument || iframeWindow.document;
                        
                        // 提取 poData
                        let poData = null;
                        
                        // 方法1: 直接从 window 对象获取
                        if (iframeWindow.poData && Array.isArray(iframeWindow.poData) && iframeWindow.poData.length > 0) {
                            poData = iframeWindow.poData;
                        } else {
                            // 方法2: 从 script 标签中提取 poData
                            const scripts = iframeDoc.querySelectorAll('script');
                            for (let script of scripts) {
                                const scriptText = script.textContent || script.innerHTML;
                                // 查找 poJson 的定义（支持单引号和双引号）
                                const poJsonMatch = scriptText.match(/var\s+poJson\s*=\s*['"]([^'"]+)['"]/);
                                if (poJsonMatch) {
                                    try {
                                        // 处理转义字符
                                        let poJson = poJsonMatch[1]
                                            .replace(/\\\//g, '/')
                                            .replace(/\\"/g, '"')
                                            .replace(/\\'/g, "'")
                                            .replace(/\\\\/g, '\\');
                                        const parsed = JSON.parse(poJson);
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                            poData = parsed;
                                            break;
                                        }
                                    } catch (e) {
                                        console.warn('草榴Manager: 解析 poJson 失败', e);
                                    }
                                }
                            }
                            
                            // 方法3: 如果 poData 为空，尝试从 rmData 获取
                            if (!poData && iframeWindow.rmData && Array.isArray(iframeWindow.rmData) && iframeWindow.rmData.length > 0) {
                                poData = iframeWindow.rmData;
                            }
                        }
                        
                        // 如果找到了 poData，触发跳转
                        if (poData && poData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * poData.length);
                            const adUrl = poData[randomIndex].u;
                            if (adUrl) {
                                console.log('草榴Manager: qBittorrent 成功响应，跳转到广告页面:', adUrl);
                                iframeWindow.location.href = adUrl;
                            }
                        } else {
                            console.warn('草榴Manager: 未找到 poData，跳转可能不会发生');
                        }
                    } catch (e) {
                        console.warn('草榴Manager: 跳转失败', e);
                    }
                }, 500); // 0.5秒后触发
                
                return true;
            } catch (e) {
                const msg = e?.message || e;
                lastError = msg;
                console.error('草榴Manager: 發送到 qBittorrent 時出錯', e);
                
                // 如果是第一次尝试，且可能是认证问题，则重试
                if (attempt === 0 && (msg.includes('401') || msg.includes('403') || msg.includes('認證') || msg.includes('登錄'))) {
                    appendQbLog('發送過程發生錯誤：' + msg + '，將嘗試重新登錄後重試…', 'warning');
                    continue; // 重试
                }
                
                // 其他错误或第二次尝试失败
                appendQbLog('發送過程發生錯誤：' + msg, 'error');
                showToast('發送到 qBittorrent 時出錯：' + msg, 'error');
                return false;
            }
        }
        
        // 如果所有重试都失败
        if (lastError) {
            appendQbLog('重試後仍然失敗：' + lastError, 'error');
            showToast('發送到 qBittorrent 失敗：' + lastError, 'error');
        }
        return false;
    }

    // 對外暴露到 window，方便後續與頁面其他腳本集成
    pageWindow.草榴ManagerSendToQb = sendToQbittorrent;

    // 在所有匹配頁面中創建右下角設置入口
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSettingsUI);
    } else {
        createSettingsUI();
    }
})();

