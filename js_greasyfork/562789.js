// ==UserScript==
// @name         Tampermonkey Video Filter v5.1 (Hybrid Enhanced)
// @namespace    http://tampermonkey.net/
// @version      5.1.0
// @description  Advanced video filtering combining v4's proven core with v5's modern UI - supports all page types including popular posts
// @author       harryangstrom, xdegeneratex, remuru, AI Assistant insomniakin
// @match        https://*.coomer.party/*
// @match        https://*.coomer.su/*
// @match        https://*.coomer.st/*
// @match        https://*.kemono.su/*
// @match        https://*.kemono.party/*
// @match        https://*.kemono.cr/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562789/Tampermonkey%20Video%20Filter%20v51%20%28Hybrid%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562789/Tampermonkey%20Video%20Filter%20v51%20%28Hybrid%20Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        VIDEO_EXTENSIONS: ['mp4', 'm4v', 'mov', 'webm'],
        IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif'],
        POSTS_PER_PAGE: 50,
        API_DELAY: 1000,
        SUBSTRING_TITLE_LENGTH: 100,
        VIDEO_DURATION_CHECK_TIMEOUT: 50000,
        MAX_CONCURRENT_METADATA_REQUESTS: 25,
        THEME: {
            bg: '#1a1a1e',
            bgSecondary: '#2c2c2e',
            bgTertiary: '#3a3a3c',
            border: '#444',
            text: '#e0e0e0',
            textSecondary: '#999',
            accent: '#00d4ff',
            accentHover: '#00e6ff',
            success: '#76c7c0',
            error: '#ff6b6b',
            warning: '#ffa500'
        }
    };

    const LS_KEYS = {
        COLLAPSED: 'vf_collapsed_v5',
        PAGES: 'vf_pages_v5',
        DURATION: 'vf_duration_v5',
        SORT: 'vf_sort_v5',
        HISTORY: 'vf_history_v5',
        MAX_CONCURRENT: 'vf_max_concurrent_v5'
    };

    // ==================== GLOBAL STATE ====================
    let state = {
        currentDomain: window.location.hostname,
        allFoundVideoUrls: [],
        videoIntersectionObserver: null,
        isPanelCollapsed: false,
        isFiltering: false,
        postsProcessedCounter: 0,
        matchedPostsCounter: 0
    };

    // ==================== STYLES ====================
    const STYLES = `
        * { box-sizing: border-box; }

        select option { color: var(--colour0-primary, #e0e0e0) !important; }

        #video-filter-ui {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, ${CONFIG.THEME.bg} 0%, ${CONFIG.THEME.bgSecondary} 100%);
            color: ${CONFIG.THEME.text};
            border: 2px solid ${CONFIG.THEME.accent};
            border-radius: 12px;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            padding: 12px;
        }

        #video-filter-ui:hover {
            box-shadow: 0 12px 48px rgba(0, 212, 255, 0.25);
        }

        #video-filter-collapse-button {
            position: absolute;
            bottom: 8px;
            left: 8px;
            width: 32px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            font-size: 18px;
            font-weight: bold;
            background: linear-gradient(135deg, ${CONFIG.THEME.bgTertiary}, ${CONFIG.THEME.bgSecondary});
            color: ${CONFIG.THEME.accent};
            border: 1px solid ${CONFIG.THEME.accent};
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 1;
        }

        #video-filter-collapse-button:hover {
            background: ${CONFIG.THEME.accent};
            color: ${CONFIG.THEME.bg};
            transform: scale(1.05);
        }

        #video-filter-main-content {
            margin-left: 40px;
            padding: 16px;
            max-width: 500px;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .vf-section {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${CONFIG.THEME.border};
        }

        .vf-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .vf-section-title {
            font-weight: 600;
            color: ${CONFIG.THEME.accent};
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .vf-input-group {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }

        .vf-label {
            display: block;
            margin-bottom: 4px;
            color: ${CONFIG.THEME.textSecondary};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input[type="text"],
        input[type="number"],
        select {
            flex: 1;
            min-width: 80px;
            padding: 8px 12px;
            background-color: ${CONFIG.THEME.bg};
            color: ${CONFIG.THEME.text};
            border: 1px solid ${CONFIG.THEME.border};
            border-radius: 6px;
            font-size: 12px;
            transition: all 0.2s ease;
            font-family: inherit;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
            outline: none;
            border-color: ${CONFIG.THEME.accent};
            box-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
            background-color: ${CONFIG.THEME.bgSecondary};
        }

        .vf-button {
            padding: 8px 14px;
            border: 1px solid ${CONFIG.THEME.accent};
            border-radius: 6px;
            background: linear-gradient(135deg, ${CONFIG.THEME.bgTertiary}, ${CONFIG.THEME.bgSecondary});
            color: ${CONFIG.THEME.accent};
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s ease;
            white-space: nowrap;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .vf-button:hover:not(:disabled) {
            background: ${CONFIG.THEME.accent};
            color: ${CONFIG.THEME.bg};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }

        .vf-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            border-color: ${CONFIG.THEME.textSecondary};
            color: ${CONFIG.THEME.textSecondary};
        }

        .vf-button.secondary {
            border-color: ${CONFIG.THEME.textSecondary};
            color: ${CONFIG.THEME.textSecondary};
        }

        .vf-button.secondary:hover:not(:disabled) {
            background: ${CONFIG.THEME.textSecondary};
            color: ${CONFIG.THEME.bg};
        }

        #video-filter-status {
            margin-top: 12px;
            padding: 10px 12px;
            font-size: 11px;
            min-height: 18px;
            color: ${CONFIG.THEME.textSecondary};
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            border-left: 3px solid ${CONFIG.THEME.accent};
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .vf-status-success {
            border-left-color: ${CONFIG.THEME.success};
            color: ${CONFIG.THEME.success};
        }

        .vf-status-error {
            border-left-color: ${CONFIG.THEME.error};
            color: ${CONFIG.THEME.error};
        }

        .vf-status-warning {
            border-left-color: ${CONFIG.THEME.warning};
            color: ${CONFIG.THEME.warning};
        }

        .vf-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
            font-size: 11px;
        }

        .vf-stat-item {
            background-color: rgba(0, 212, 255, 0.1);
            padding: 8px;
            border-radius: 4px;
            border-left: 2px solid ${CONFIG.THEME.accent};
        }

        .vf-stat-label {
            color: ${CONFIG.THEME.textSecondary};
            font-size: 10px;
            text-transform: uppercase;
        }

        .vf-stat-value {
            color: ${CONFIG.THEME.accent};
            font-weight: bold;
            font-size: 14px;
        }

        .vf-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 12px;
            border-bottom: 1px solid ${CONFIG.THEME.border};
        }

        .vf-tab {
            padding: 8px 12px;
            background: none;
            border: none;
            color: ${CONFIG.THEME.textSecondary};
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .vf-tab:hover {
            color: ${CONFIG.THEME.accent};
        }

        .vf-tab.active {
            color: ${CONFIG.THEME.accent};
            border-bottom-color: ${CONFIG.THEME.accent};
        }

        .vf-tab-content {
            display: none;
        }

        .vf-tab-content.active {
            display: block;
            animation: slideIn 0.2s ease-out;
        }

        .vf-button-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .vf-button-group.vertical {
            flex-direction: column;
        }

        .vf-checkbox-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .vf-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        .vf-checkbox input {
            cursor: pointer;
            accent-color: ${CONFIG.THEME.accent};
        }

        .vf-checkbox label {
            cursor: pointer;
            font-size: 12px;
        }
    `;

    GM_addStyle(STYLES);

    // ==================== DURATION CHECKER POOL (from v4) ====================

    /**
     * Fetches the duration of a single video by loading its metadata.
     */
    function _getVideoDurationInternal(videoUrl) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.style.display = 'none';
            document.body.appendChild(video);

            let resolved = false;
            let timeoutId = null;

            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId);
                video.onloadedmetadata = video.onerror = video.onabort = null;
                try {
                    video.src = '';
                    video.removeAttribute('src');
                    while (video.firstChild) {
                        video.removeChild(video.firstChild);
                    }
                } catch (e) { /* ignore */ }
                if (video.parentNode) video.parentNode.removeChild(video);
            };

            timeoutId = setTimeout(() => {
                if (resolved) return;
                resolved = true;
                const errorMsg = `Timeout loading metadata for ${videoUrl.split('/').pop()} after ${CONFIG.VIDEO_DURATION_CHECK_TIMEOUT / 1000}s.`;
                console.warn(errorMsg);
                reject(new Error(errorMsg));
                cleanup();
            }, CONFIG.VIDEO_DURATION_CHECK_TIMEOUT);

            video.onloadedmetadata = () => {
                if (resolved) return;
                resolved = true;
                const duration = video.duration;
                if (typeof duration === 'number' && !isNaN(duration) && isFinite(duration)) {
                    resolve(duration);
                } else {
                    reject(new Error(`Invalid duration for ${videoUrl.split('/').pop()}: ${duration}`));
                }
                cleanup();
            };

            video.onerror = () => {
                if (resolved) return;
                resolved = true;
                reject(new Error(`Error loading metadata for ${videoUrl.split('/').pop()}`));
                cleanup();
            };

            video.onabort = () => {
                if (resolved) return;
                resolved = true;
                reject(new Error(`Metadata loading aborted for ${videoUrl.split('/').pop()}.`));
                cleanup();
            };

            const sourceElement = document.createElement('source');
            sourceElement.src = videoUrl;
            video.appendChild(sourceElement);
            video.load();
        });
    }

    /**
     * Manages a pool of concurrent requests to get video durations.
     */
    class DurationCheckerPool {
        constructor(maxConcurrent) {
            this.maxConcurrent = maxConcurrent;
            this.queue = [];
            this.activeCount = 0;
        }

        add(videoUrl) {
            return new Promise((resolve, reject) => {
                this.queue.push({ videoUrl, resolve, reject });
                this._processQueue();
            });
        }

        _processQueue() {
            if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) return;

            this.activeCount++;
            const { videoUrl, resolve, reject } = this.queue.shift();
            const videoFileName = videoUrl.split('/').pop();

            showStatus(`Checking duration (${this.activeCount}/${this.maxConcurrent}, Q:${this.queue.length}): ${videoFileName.substring(0, 20)}...`, 'info');

            _getVideoDurationInternal(videoUrl)
                .then(duration => resolve(duration))
                .catch(error => reject(error))
                .finally(() => {
                    this.activeCount--;
                    this._processQueue();
                });
        }
    }

    // ==================== PAGE CONTEXT AND API (from v4) ====================

    /**
     * Analyzes the current URL to determine the page context.
     */
    function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');

        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        if (userProfileMatch && !query) {
            return {
                type: 'profile',
                service: userProfileMatch[1],
                userId: userProfileMatch[2]
            };
        }

        if (userProfileMatch && query) {
            return {
                type: 'user_search',
                service: userProfileMatch[1],
                userId: userProfileMatch[2],
                query
            };
        }

        if (pathname === '/posts/popular') {
            return {
                type: 'popular_posts',
                date: searchParams.get('date') || 'none',
                period: searchParams.get('period') || 'recent'
            };
        }

        if (pathname === '/posts') {
            return {
                type: 'global_search',
                query: query || null
            };
        }

        console.error('Video Filter: Unknown page structure for context.', pathname, window.location.search);
        return null;
    }

    /**
     * Constructs the appropriate API URL based on the page context.
     */
    function buildApiUrl(context, offset) {
        let baseApiUrl = `https://${state.currentDomain}/api/v1`;
        let queryParams = [`o=${offset}`];

        switch (context.type) {
            case 'profile':
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;

            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;

            case 'global_search':
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/posts?${queryParams.join('&')}`;

            case 'popular_posts':
                if (context.date != 'none' && context.period != "recent") {
                    queryParams.push(`date=${encodeURIComponent(context.date)}`);
                }
                if (offset > 0) queryParams.push(`o=${offset}`);
                queryParams.push(`period=${encodeURIComponent(context.period)}`);
                return `${baseApiUrl}/posts/popular?${queryParams.join('&')}`;

            default:
                return null;
        }
    }

    /**
     * Fetches data from a given API URL.
     */
    function fetchData(apiUrl) {
        const headers = {
            "Accept": "text/css",
            "Referer": window.location.href,
            "User-Agent": navigator.userAgent,
            "X-Requested-With": "XMLHttpRequest"
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: headers,
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            resolve(JSON.parse(resp.responseText));
                        } catch (e) {
                            reject(`Error parsing JSON: ${e.message}`);
                        }
                    } else {
                        reject(`API request failed: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`Network error: ${resp.statusText || 'Unknown'}`)
            });
        });
    }

    // ==================== HELPER FUNCTIONS ====================

    function isVideoFile(path) {
        return path ? CONFIG.VIDEO_EXTENSIONS.some(ext => path.toLowerCase().endsWith('.' + ext)) : false;
    }

    function isImageFile(path) {
        return path ? CONFIG.IMAGE_EXTENSIONS.some(ext => path.toLowerCase().endsWith('.' + ext)) : false;
    }

    function getPostPreviewUrl(post, apiPreviewsEntry) {
        if (apiPreviewsEntry && apiPreviewsEntry.length > 0 && apiPreviewsEntry[0]?.server && apiPreviewsEntry[0]?.path) {
            return `${apiPreviewsEntry[0].server}${apiPreviewsEntry[0].path}`;
        }
        if (post.file?.path && isImageFile(post.file.path)) {
            return `https://${state.currentDomain}/data${post.file.path}`;
        }
        if (post.attachments) {
            for (const a of post.attachments) {
                if (a.path && isImageFile(a.path)) {
                    return `https://${state.currentDomain}/data${a.path}`;
                }
            }
        }
        return null;
    }

    function getAllVideoUrlsFromPost(post) {
        const dataPrefix = `https://${state.currentDomain}/data`;
        const urls = [];

        if (post.file?.path && isVideoFile(post.file.path)) {
            urls.push(dataPrefix + post.file.path);
        }
        if (post.attachments) {
            for (const a of post.attachments) {
                if (a.path && isVideoFile(a.path)) {
                    urls.push(dataPrefix + a.path);
                }
            }
        }
        return [...new Set(urls)];
    }

    function getFirstVideoUrlForDisplay(post) {
        const videos = getAllVideoUrlsFromPost(post);
        return videos.length > 0 ? videos[0] : null;
    }

    /**
     * Generates the HTML string for a single post card.
     */
    function createPostCardHtml(postData, previewUrl, videoDurationToDisplay = null) {
        const { post, postDate } = postData;
        const formattedDate = postDate.toLocaleString();
        const attachmentCount = post.attachments?.length || 0;
        const attachmentText = attachmentCount === 1 ? "1 Attachment" : `${attachmentCount} Attachments`;

        let displayTitle = (post.title || '').trim();
        if (!displayTitle) {
            const div = document.createElement('div');
            div.innerHTML = post.content || '';
            displayTitle = (div.textContent || "").trim().substring(0, CONFIG.SUBSTRING_TITLE_LENGTH);
        }
        displayTitle = displayTitle || 'No Title';

        const firstVideoUrlForCard = getFirstVideoUrlForDisplay(post);
        const durationDisplay = videoDurationToDisplay !== null
            ? `<div style="position:absolute;bottom:5px;right:5px;background:rgba(0,0,0,0.7);color:white;padding:2px 5px;font-size:0.8em;border-radius:3px;">${Math.round(videoDurationToDisplay)}s</div>`
            : '';

        let mediaHtml = '';
        if (firstVideoUrlForCard) {
            const poster = previewUrl ? `poster="${previewUrl}"` : '';
            mediaHtml = `<div style="position:relative;background:#000;"><video class="lazy-load-video" controls preload="none" width="100%" style="max-height:265px;display:block;" ${poster}><source data-src="${firstVideoUrlForCard}" type="video/mp4"></video>${durationDisplay}</div>`;
        } else if (previewUrl) {
            mediaHtml = `<div><img src="${previewUrl}" style="max-width:100%;max-height:200px;object-fit:contain;"></div>`;
        } else {
            mediaHtml = `<div style="height:100px;display:flex;align-items:center;justify-content:center;background:#333;color:#aaa;">No Preview</div>`;
        }

        const postLink = `/${post.service}/user/${post.user}/post/${post.id}`;
        const sortDate = postDate.getTime();
        const sortDuration = videoDurationToDisplay !== null ? Math.round(videoDurationToDisplay) : -1;

        return `<article class="post-card post-card--preview" data-sort-date="${sortDate}" data-sort-duration="${sortDuration}">
            <a class="fancy-link" href="${postLink}" target="_blank" rel="noopener noreferrer">
                <header class="post-card__header" title="${displayTitle.replace(/"/g, '&quot;')}">${displayTitle}</header>
                ${mediaHtml}
                <footer class="post-card__footer">
                    <div>
                        <div>
                            <time datetime="${postDate.toISOString()}">${formattedDate}</time>
                            <div>${attachmentCount > 0 ? attachmentText : 'No Attachments'}</div>
                        </div>
                    </div>
                </footer>
            </a>
        </article>`;
    }

    // ==================== UI HELPER FUNCTIONS ====================

    function showStatus(message, type = 'info') {
        statusDiv.textContent = message;
        statusDiv.className = 'vf-status-' + type;
        if (!statusDiv.className.includes('vf-status-')) {
            statusDiv.className = '';
        }
        if (type === 'success' && message.includes("Copied")) {
            setTimeout(() => {
                if (statusDiv.textContent === message) {
                    statusDiv.textContent = 'Ready to filter';
                    statusDiv.className = '';
                }
            }, 3000);
        }
    }

    function updateStats(stats) {
        const showStats = document.getElementById('vf-show-stats')?.checked !== false;
        if (!showStats) {
            statsDiv.style.display = 'none';
            return;
        }
        statsDiv.style.display = 'grid';
        statsDiv.innerHTML = `
            <div class="vf-stat-item">
                <div class="vf-stat-label">Videos Found</div>
                <div class="vf-stat-value">${stats.videosFound || 0}</div>
            </div>
            <div class="vf-stat-item">
                <div class="vf-stat-label">Posts Processed</div>
                <div class="vf-stat-value">${stats.postsProcessed || 0}</div>
            </div>
        `;
    }

    function parsePageRange(inputStr) {
        const pages = new Set();
        if (!inputStr || inputStr.trim() === '') {
            showStatus('Error: Page range cannot be empty.', 'error');
            return null;
        }
        const parts = inputStr.split(',');
        for (const part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
                    showStatus(`Error: Invalid range "${part}".`, 'error');
                    return null;
                }
                for (let i = start; i <= end; i++) pages.add(i);
            } else {
                const page = parseInt(part, 10);
                if (isNaN(page) || page <= 0) {
                    showStatus(`Error: Invalid page number "${part}".`, 'error');
                    return null;
                }
                pages.add(page);
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    }

    function parseDurationRange(inputStr) {
        if (!inputStr || inputStr.trim() === '') return null;
        const trimmed = inputStr.trim();
        let match;

        match = trimmed.match(/^(\d+)-(\d+)$/);
        if (match) return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };

        match = trimmed.match(/^(\d+)-$/);
        if (match) return { min: parseInt(match[1], 10), max: Infinity };

        match = trimmed.match(/^-(\d+)$/);
        if (match) return { min: 0, max: parseInt(match[1], 10) };

        showStatus(`Error: Invalid duration format "${trimmed}".`, 'error');
        return { error: true };
    }

    function setupVideoIntersectionObserver() {
        if (state.videoIntersectionObserver) {
            state.videoIntersectionObserver.disconnect();
        }

        const options = {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        };

        state.videoIntersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const videoElement = entry.target;
                    const sourceElement = videoElement.querySelector('source[data-src]');
                    if (sourceElement) {
                        const videoUrl = sourceElement.getAttribute('data-src');
                        sourceElement.setAttribute('src', videoUrl);
                        videoElement.load();
                        sourceElement.removeAttribute('data-src');
                        observer.unobserve(videoElement);
                    }
                }
            });
        }, options);
    }

    function saveSettings() {
        localStorage.setItem(LS_KEYS.PAGES, pageRangeInput.value);
        localStorage.setItem(LS_KEYS.DURATION, durationRangeInput.value);
        localStorage.setItem(LS_KEYS.SORT, sortBySelect.value);
        const maxConcurrent = document.getElementById('vf-max-concurrent')?.value;
        if (maxConcurrent) {
            localStorage.setItem(LS_KEYS.MAX_CONCURRENT, maxConcurrent);
            CONFIG.MAX_CONCURRENT_METADATA_REQUESTS = parseInt(maxConcurrent, 10);
        }
    }

    function loadSettings() {
        const pages = localStorage.getItem(LS_KEYS.PAGES) || '1';
        const duration = localStorage.getItem(LS_KEYS.DURATION) || '';
        const sort = localStorage.getItem(LS_KEYS.SORT) || 'date_desc';
        const maxConcurrent = localStorage.getItem(LS_KEYS.MAX_CONCURRENT) || '25';

        pageRangeInput.value = pages;
        durationRangeInput.value = duration;
        sortBySelect.value = sort;

        const maxConcurrentInput = document.getElementById('vf-max-concurrent');
        if (maxConcurrentInput) {
            maxConcurrentInput.value = maxConcurrent;
            CONFIG.MAX_CONCURRENT_METADATA_REQUESTS = parseInt(maxConcurrent, 10);
        }
    }

    function addToHistory(filter) {
        let history = JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) || '[]');
        history.unshift({
            ...filter,
            timestamp: new Date().toLocaleString()
        });
        history = history.slice(0, 10);
        localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(history));
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) || '[]');
        const historyList = document.getElementById('vf-history-list');

        if (!historyList) return;

        if (history.length === 0) {
            historyList.innerHTML = `<p style="color: ${CONFIG.THEME.textSecondary}; font-size: 11px;">No history yet</p>`;
            return;
        }

        historyList.innerHTML = history.map((item) => `
            <div style="padding: 8px; background-color: rgba(0, 212, 255, 0.05); border-radius: 4px; margin-bottom: 6px; font-size: 11px;">
                <div style="color: ${CONFIG.THEME.accent}; font-weight: bold;">${item.timestamp}</div>
                <div style="color: ${CONFIG.THEME.textSecondary}; margin-top: 4px;">
                    Pages: ${item.pages || 'N/A'}<br>
                    Duration: ${item.duration || 'Any'}<br>
                    Found: ${item.found} videos
                </div>
                <button class="vf-button" style="width: 100%; margin-top: 6px; padding: 4px;" onclick="
                    document.getElementById('vf-pages').value = '${item.pages}';
                    document.getElementById('vf-duration').value = '${item.duration}';
                    document.getElementById('vf-sort').value = '${item.sort}';
                    window.switchTab('Filter');
                ">Restore</button>
            </div>
        `).join('');
    }

    // ==================== UI CREATION ====================

    const uiContainer = document.createElement('div');
    uiContainer.id = 'video-filter-ui';

    const collapseButton = document.createElement('button');
    collapseButton.id = 'video-filter-collapse-button';
    collapseButton.innerHTML = '⚙️';
    collapseButton.title = 'Toggle Filter Panel';

    const mainContent = document.createElement('div');
    mainContent.id = 'video-filter-main-content';

    // Tab System
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'vf-tabs';

    const tabs = ['Filter', 'Settings', 'History'];
    const tabButtons = {};
    const tabContents = {};

    tabs.forEach((tabName, index) => {
        const btn = document.createElement('button');
        btn.className = 'vf-tab' + (index === 0 ? ' active' : '');
        btn.textContent = tabName;
        btn.onclick = () => switchTab(tabName);
        tabButtons[tabName] = btn;
        tabsContainer.appendChild(btn);

        const content = document.createElement('div');
        content.className = 'vf-tab-content' + (index === 0 ? ' active' : '');
        content.id = `vf-tab-${tabName.toLowerCase()}`;
        tabContents[tabName] = content;
    });

    function switchTab(tabName) {
        Object.values(tabButtons).forEach(btn => btn.classList.remove('active'));
        Object.values(tabContents).forEach(content => content.classList.remove('active'));
        tabButtons[tabName].classList.add('active');
        tabContents[tabName].classList.add('active');
    }

    window.switchTab = switchTab;

    // Filter Tab
    const filterTabContent = tabContents['Filter'];

    const pagesSection = document.createElement('div');
    pagesSection.className = 'vf-section';
    pagesSection.innerHTML = `
        <div class="vf-section-title">📄 Pages</div>
        <label class="vf-label">Page Range (e.g., 1, 2-5, 7)</label>
        <input type="text" id="vf-pages" placeholder="1" style="width: 100%;">
    `;
    filterTabContent.appendChild(pagesSection);

    const pageRangeInput = pagesSection.querySelector('#vf-pages');

    const durationSection = document.createElement('div');
    durationSection.className = 'vf-section';
    durationSection.innerHTML = `
        <div class="vf-section-title">⏱️ Duration Filter</div>
        <label class="vf-label">Duration Range (seconds)</label>
        <input type="text" id="vf-duration" placeholder="e.g., 10-30, 60-, -120" style="width: 100%;">
        <small style="color: ${CONFIG.THEME.textSecondary}; margin-top: 4px; display: block; font-size: 10px;">
            Leave empty to skip duration check
        </small>
    `;
    filterTabContent.appendChild(durationSection);

    const durationRangeInput = durationSection.querySelector('#vf-duration');

    const sortSection = document.createElement('div');
    sortSection.className = 'vf-section';
    sortSection.innerHTML = `
        <div class="vf-section-title">🔀 Sort Options</div>
        <label class="vf-label">Sort By</label>
        <select id="vf-sort" style="width: 100%;">
            <option value="date_desc">📅 Date (Newest First)</option>
            <option value="date_asc">📅 Date (Oldest First)</option>
            <option value="duration_desc">⏱️ Duration (Longest First)</option>
            <option value="duration_asc">⏱️ Duration (Shortest First)</option>
        </select>
    `;
    filterTabContent.appendChild(sortSection);

    const sortBySelect = sortSection.querySelector('#vf-sort');

    const optionsSection = document.createElement('div');
    optionsSection.className = 'vf-section';
    optionsSection.innerHTML = `
        <div class="vf-section-title">⚙️ Options</div>
        <div class="vf-checkbox-group">
            <div class="vf-checkbox">
                <input type="checkbox" id="vf-show-stats" checked>
                <label for="vf-show-stats">Show Stats</label>
            </div>
        </div>
    `;
    filterTabContent.appendChild(optionsSection);

    const actionSection = document.createElement('div');
    actionSection.className = 'vf-section';
    const actionButtonGroup = document.createElement('div');
    actionButtonGroup.className = 'vf-button-group vertical';

    const filterBtn = document.createElement('button');
    filterBtn.className = 'vf-button';
    filterBtn.textContent = '🔍 Filter Videos';
    filterBtn.id = 'vf-filter-btn';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'vf-button secondary';
    copyBtn.textContent = '📋 Copy URLs';
    copyBtn.id = 'vf-copy-btn';
    copyBtn.disabled = true;

    actionButtonGroup.appendChild(filterBtn);
    actionButtonGroup.appendChild(copyBtn);
    actionSection.appendChild(actionButtonGroup);
    filterTabContent.appendChild(actionSection);

    const statusDiv = document.createElement('div');
    statusDiv.id = 'video-filter-status';
    statusDiv.textContent = 'Ready to filter';
    filterTabContent.appendChild(statusDiv);

    const statsDiv = document.createElement('div');
    statsDiv.className = 'vf-stats';
    statsDiv.id = 'vf-stats';
    statsDiv.style.display = 'none';
    filterTabContent.appendChild(statsDiv);

    // Settings Tab
    const settingsTabContent = tabContents['Settings'];
    settingsTabContent.innerHTML = `
        <div class="vf-section">
            <div class="vf-section-title">⚡ Performance</div>
            <label class="vf-label">Max Concurrent Requests</label>
            <input type="number" id="vf-max-concurrent" value="25" min="1" max="100" style="width: 100%;">
            <small style="color: ${CONFIG.THEME.textSecondary}; margin-top: 4px; display: block; font-size: 10px;">
                Higher = faster but more resource intensive
            </small>
        </div>
        <div class="vf-section">
            <div class="vf-section-title">💾 Data</div>
            <div class="vf-button-group vertical">
                <button class="vf-button secondary" id="vf-export-settings">📤 Export Settings</button>
                <button class="vf-button secondary" id="vf-import-settings">📥 Import Settings</button>
                <button class="vf-button" id="vf-reset-settings" style="border-color: ${CONFIG.THEME.error}; color: ${CONFIG.THEME.error};">🔄 Reset All</button>
            </div>
        </div>
    `;

    // History Tab
    const historyTabContent = tabContents['History'];
    historyTabContent.innerHTML = `
        <div class="vf-section">
            <div class="vf-section-title">📜 Recent Filters</div>
            <div id="vf-history-list" style="max-height: 300px; overflow-y: auto;">
                <p style="color: ${CONFIG.THEME.textSecondary}; font-size: 11px;">No history yet</p>
            </div>
        </div>
        <div class="vf-section">
            <button class="vf-button" id="vf-clear-history" style="width: 100%; border-color: ${CONFIG.THEME.error}; color: ${CONFIG.THEME.error};">Clear History</button>
        </div>
    `;

    // Assemble UI
    mainContent.appendChild(tabsContainer);
    mainContent.appendChild(tabContents['Filter']);
    mainContent.appendChild(tabContents['Settings']);
    mainContent.appendChild(tabContents['History']);

    uiContainer.appendChild(collapseButton);
    uiContainer.appendChild(mainContent);
    document.body.appendChild(uiContainer);

    // ==================== MAIN FILTER LOGIC (from v4) ====================

    async function handleFilter() {
        showStatus('');
        filterBtn.textContent = 'Filtering...';
        filterBtn.disabled = true;
        copyBtn.disabled = true;
        state.allFoundVideoUrls = [];
        state.postsProcessedCounter = 0;
        state.matchedPostsCounter = 0;
        setupVideoIntersectionObserver();

        const pagesToFetch = parsePageRange(pageRangeInput.value);
        if (!pagesToFetch) {
            filterBtn.disabled = false;
            filterBtn.textContent = '🔍 Filter Videos';
            return;
        }

        const parsedDurationFilter = parseDurationRange(durationRangeInput.value);
        if (parsedDurationFilter?.error) {
            filterBtn.disabled = false;
            filterBtn.textContent = '🔍 Filter Videos';
            return;
        }

        saveSettings();

        const context = determinePageContext();
        if (!context) {
            showStatus('Filter disabled, context not recognized.', 'error');
            filterBtn.disabled = false;
            filterBtn.textContent = '🔍 Filter Videos';
            return;
        }

        const postListContainer = document.querySelector('.card-list__items');
        if (!postListContainer) {
            showStatus('Error: Post container not found.', 'error');
            filterBtn.disabled = false;
            filterBtn.textContent = '🔍 Filter Videos';
            return;
        }

        postListContainer.style.setProperty('--card-size', '350px');
        postListContainer.innerHTML = '';
        document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(m => m.style.display = 'none');
        const paginatorInfo = document.querySelector('.paginator > small, .content > div > small.subtle-text');
        if (paginatorInfo) paginatorInfo.textContent = `Filtering posts...`;

        const sortOption = sortBySelect.value;
        const needsDurationCheck = !!parsedDurationFilter || sortOption.startsWith('duration_');
        const durationCheckerPool = new DurationCheckerPool(CONFIG.MAX_CONCURRENT_METADATA_REQUESTS);

        const allProcessingPromises = [];

        for (let i = 0; i < pagesToFetch.length; i++) {
            const pageNum = pagesToFetch[i];
            const offset = (pageNum - 1) * CONFIG.POSTS_PER_PAGE;
            const apiUrl = buildApiUrl(context, offset);

            if (!apiUrl) {
                showStatus('Error: Could not build API URL.', 'error');
                break;
            }

            filterBtn.textContent = `Fetching Page ${i + 1}/${pagesToFetch.length}...`;

            try {
                const apiResponse = await fetchData(apiUrl);
                const posts = Array.isArray(apiResponse) ? apiResponse : (apiResponse.results || apiResponse.posts || []);
                const resultPreviews = apiResponse.result_previews;

                for (const post of posts) {
                    state.postsProcessedCounter++;

                    const postProcessingPromise = (async () => {
                        const postVideoUrls = getAllVideoUrlsFromPost(post);
                        if (postVideoUrls.length === 0) return false;

                        let postDuration = null;
                        let matchesDurationFilter = !parsedDurationFilter;

                        if (needsDurationCheck) {
                            const durationPromises = postVideoUrls.map(url => durationCheckerPool.add(url));
                            const results = await Promise.allSettled(durationPromises);

                            for (const result of results) {
                                if (result.status === 'fulfilled') {
                                    const duration = result.value;
                                    if (postDuration === null) postDuration = duration;

                                    if (parsedDurationFilter && duration >= parsedDurationFilter.min && duration <= parsedDurationFilter.max) {
                                        matchesDurationFilter = true;
                                        postDuration = duration;
                                        break;
                                    }
                                } else {
                                    console.warn(`Could not get duration for video in post ${post.id}:`, result.reason.message);
                                }
                            }

                            if (!parsedDurationFilter && postDuration !== null) {
                                matchesDurationFilter = true;
                            }
                        }

                        if (matchesDurationFilter) {
                            state.allFoundVideoUrls.push(...postVideoUrls);
                            state.matchedPostsCounter++;

                            const apiPreviewEntry = resultPreviews ? (resultPreviews[post.id] || (Array.isArray(resultPreviews) ? resultPreviews.find(p => p.id === post.id) : null)) : null;
                            const postData = {
                                post,
                                postDate: new Date(post.published || post.added)
                            };

                            const cardHtml = createPostCardHtml(postData, getPostPreviewUrl(post, apiPreviewEntry), postDuration);
                            postListContainer.insertAdjacentHTML('beforeend', cardHtml);

                            const newCard = postListContainer.lastElementChild;
                            const newVideo = newCard.querySelector('video.lazy-load-video');
                            if (newVideo) state.videoIntersectionObserver.observe(newVideo);

                            updateStats({
                                videosFound: state.matchedPostsCounter,
                                postsProcessed: state.postsProcessedCounter
                            });

                            return true;
                        }

                        return false;
                    })();

                    allProcessingPromises.push(postProcessingPromise);
                }
            } catch (error) {
                showStatus(`Error on page ${pageNum}: ${error}`, 'error');
                console.error("Filter error:", error);
            }

            if (i < pagesToFetch.length - 1) {
                await new Promise(r => setTimeout(r, CONFIG.API_DELAY));
            }
        }

        showStatus('Processing remaining videos...', 'info');
        await Promise.all(allProcessingPromises);

        showStatus('Sorting results...', 'info');

        const cards = Array.from(postListContainer.children);
        cards.sort((a, b) => {
            const aDate = Number(a.dataset.sortDate);
            const bDate = Number(b.dataset.sortDate);
            const aDuration = Number(a.dataset.sortDuration);
            const bDuration = Number(b.dataset.sortDuration);

            switch (sortOption) {
                case 'date_asc':
                    return aDate - bDate;
                case 'duration_desc':
                    return bDuration - aDuration;
                case 'duration_asc':
                    return aDuration - bDuration;
                case 'date_desc':
                default:
                    return bDate - aDate;
            }
        });

        cards.forEach(card => postListContainer.appendChild(card));

        if (paginatorInfo) {
            paginatorInfo.textContent = `Showing ${state.matchedPostsCounter} video posts. Processed ${state.postsProcessedCounter} posts.`;
        }

        filterBtn.textContent = '🔍 Filter Videos';
        filterBtn.disabled = false;

        if (state.matchedPostsCounter > 0) {
            showStatus(`Filter complete. Found ${state.matchedPostsCounter} video posts.`, 'success');
            copyBtn.disabled = false;

            addToHistory({
                pages: pageRangeInput.value,
                duration: durationRangeInput.value,
                sort: sortBySelect.value,
                found: state.matchedPostsCounter
            });
        } else {
            showStatus(`Filter complete. No matching video posts found.`, 'info');
        }

        updateStats({
            videosFound: state.matchedPostsCounter,
            postsProcessed: state.postsProcessedCounter
        });
    }

    // ==================== EVENT HANDLERS ====================

    collapseButton.addEventListener('click', () => {
        state.isPanelCollapsed = !state.isPanelCollapsed;
        if (state.isPanelCollapsed) {
            mainContent.style.display = 'none';
            collapseButton.innerHTML = '◀️';
            uiContainer.style.width = '50px';
            uiContainer.style.padding = '8px';
        } else {
            mainContent.style.display = 'block';
            collapseButton.innerHTML = '⚙️';
            uiContainer.style.width = 'auto';
            uiContainer.style.padding = '12px';
        }
        localStorage.setItem(LS_KEYS.COLLAPSED, state.isPanelCollapsed);
    });

    filterBtn.addEventListener('click', handleFilter);

    copyBtn.addEventListener('click', () => {
        if (state.allFoundVideoUrls.length === 0) {
            showStatus("No video URLs to copy.", 'error');
            return;
        }
        const uniqueUrls = [...new Set(state.allFoundVideoUrls)];
        GM_setClipboard(uniqueUrls.join('\n'));
        copyBtn.textContent = `Copied ${uniqueUrls.length} URLs!`;
        showStatus(`Copied ${uniqueUrls.length} unique video URLs!`, 'success');
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy URLs';
        }, 3000);
    });

    document.getElementById('vf-clear-history')?.addEventListener('click', () => {
        if (confirm('Clear all filter history?')) {
            localStorage.removeItem(LS_KEYS.HISTORY);
            updateHistoryDisplay();
            showStatus('✅ History cleared', 'success');
        }
    });

    document.getElementById('vf-reset-settings')?.addEventListener('click', () => {
        if (confirm('Reset all settings to default?')) {
            Object.values(LS_KEYS).forEach(key => localStorage.removeItem(key));
            location.reload();
        }
    });

    document.getElementById('vf-export-settings')?.addEventListener('click', () => {
        const settings = {
            pages: pageRangeInput.value,
            duration: durationRangeInput.value,
            sort: sortBySelect.value,
            maxConcurrent: document.getElementById('vf-max-concurrent').value
        };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vf-settings-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showStatus('✅ Settings exported', 'success');
    });

    document.getElementById('vf-import-settings')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    pageRangeInput.value = settings.pages || '1';
                    durationRangeInput.value = settings.duration || '';
                    sortBySelect.value = settings.sort || 'date_desc';
                    document.getElementById('vf-max-concurrent').value = settings.maxConcurrent || '25';
                    saveSettings();
                    showStatus('✅ Settings imported', 'success');
                } catch (error) {
                    showStatus('❌ Invalid settings file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });

    // SPA Navigation Handling
    function handleUrlChangeAndSetStatus() {
        setTimeout(() => {
            const currentContext = determinePageContext();
            state.allFoundVideoUrls = [];
            copyBtn.disabled = true;
            if (state.videoIntersectionObserver) state.videoIntersectionObserver.disconnect();

            if (currentContext) {
                showStatus("Video filter ready. Set filters and click 'Filter Videos'.", 'info');
                filterBtn.disabled = false;
            } else {
                showStatus("Page context not recognized. Filter disabled on this page.", 'error');
                filterBtn.disabled = true;
            }
        }, 100);
    }

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('custompushstate'));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('customreplacestate'));
    };

    window.addEventListener('popstate', handleUrlChangeAndSetStatus);
    window.addEventListener('custompushstate', handleUrlChangeAndSetStatus);
    window.addEventListener('customreplacestate', handleUrlChangeAndSetStatus);

    // ==================== INITIALIZATION ====================

    loadSettings();
    updateHistoryDisplay();

    const initiallyCollapsed = localStorage.getItem(LS_KEYS.COLLAPSED) === 'true';
    if (initiallyCollapsed) collapseButton.click();

    handleUrlChangeAndSetStatus();

    console.log('🎬 Video Filter v5.1 Hybrid - Loaded Successfully');

})();