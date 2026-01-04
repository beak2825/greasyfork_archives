// ==UserScript==
// @name         TesterTV_Instagram Stories Viewer & Downloader
// @namespace    https://greasyfork.org/ru/scripts/560823-testertv-instagram-stories-viewer-downloader
// @version      1.4
// @description  View and download Instagram stories from the last 24 hours (all or per user)
// @author       You
// @match        https://www.instagram.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *
// @connect      cdninstagram.com
// @connect      fbcdn.net
// @connect      instagram.com
// @run-at       document-idle
// @license      GPLv3. or higher
// @downloadURL https://update.greasyfork.org/scripts/560823/TesterTV_Instagram%20Stories%20Viewer%20%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560823/TesterTV_Instagram%20Stories%20Viewer%20%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles
    const styles = `
        #ig-stories-btn {
            position: fixed;
            bottom: 100px;
            right: 32px;
            z-index: 99999;
            background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #ig-stories-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        #ig-stories-btn .btn-text {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        #ig-stories-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 100000;
            overflow-y: auto;
        }
        #ig-stories-modal.active {
            display: block;
        }
        .ig-modal-header {
            position: sticky;
            top: 0;
            background: #1a1a1a;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
            z-index: 100001;
            flex-wrap: wrap;
            gap: 10px;
        }
        .ig-modal-title {
            color: white;
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .ig-modal-title img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        .ig-modal-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .ig-modal-btn {
            background: #0095f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        .ig-modal-btn:hover {
            background: #0077cc;
        }
        .ig-modal-btn.close {
            background: #333;
        }
        .ig-modal-btn.close:hover {
            background: #555;
        }
        .ig-modal-btn.download-all {
            background: #00c853;
        }
        .ig-modal-btn.download-all:hover {
            background: #00a844;
        }
        .ig-stories-container {
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .ig-user-section {
            background: #262626;
            border-radius: 12px;
            padding: 15px;
            width: 100%;
            max-width: 800px;
        }
        .ig-user-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #444;
            flex-wrap: wrap;
        }
        .ig-user-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }
        .ig-user-name {
            color: white;
            font-size: 16px;
            font-weight: bold;
        }
        .ig-user-download-all {
            margin-left: auto;
            background: #0095f6;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        .ig-stories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
        }
        .ig-story-item {
            position: relative;
            aspect-ratio: 9/16;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            background: #333;
        }
        .ig-story-item img,
        .ig-story-item video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .ig-story-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ig-story-time {
            color: white;
            font-size: 11px;
        }
        .ig-story-download {
            background: #0095f6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        }
        .ig-story-type {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
        }
        .ig-loading {
            color: white;
            text-align: center;
            padding: 50px;
            font-size: 18px;
        }
        .ig-no-stories {
            color: #888;
            text-align: center;
            padding: 50px;
            font-size: 16px;
        }
        .ig-preview-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 100002;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .ig-preview-modal.active {
            display: flex;
        }
        .ig-preview-content {
            max-width: 90%;
            max-height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .ig-preview-content img,
        .ig-preview-content video {
            max-width: 100%;
            max-height: 75vh;
            object-fit: contain;
        }
        .ig-preview-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
        }
        .ig-preview-actions {
            position: absolute;
            bottom: 20px;
            display: flex;
            gap: 10px;
        }
        .ig-preview-download {
            background: #0095f6;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
        .ig-preview-download:hover {
            background: #0077cc;
        }
        .ig-preview-open {
            background: #00c853;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
        .ig-status {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 99999;
            display: none;
            max-width: 300px;
        }
        .ig-status.active {
            display: block;
        }
        .ig-status.success {
            background: #00c853;
        }
        .ig-status.error {
            background: #f44336;
        }
    `;

    // Add styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create main button
    const mainBtn = document.createElement('button');
    mainBtn.id = 'ig-stories-btn';
    mainBtn.innerHTML = '<span class="btn-icon">📸</span><span class="btn-text">Stories</span>';
    document.body.appendChild(mainBtn);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'ig-stories-modal';
    modal.innerHTML = `
        <div class="ig-modal-header">
            <span class="ig-modal-title">Stories (Last 24 Hours)</span>
            <div class="ig-modal-actions">
                <button class="ig-modal-btn" id="ig-refresh-btn">🔄 Refresh</button>
                <button class="ig-modal-btn download-all" id="ig-download-all-btn">⬇️ Download All</button>
                <button class="ig-modal-btn close" id="ig-close-btn">✕ Close</button>
            </div>
        </div>
        <div class="ig-stories-container" id="ig-stories-container">
            <div class="ig-loading">Loading stories...</div>
        </div>
    `;
    document.body.appendChild(modal);

    // Create preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'ig-preview-modal';
    previewModal.innerHTML = `
        <button class="ig-preview-close">✕</button>
        <div class="ig-preview-content"></div>
        <div class="ig-preview-actions">
            <button class="ig-preview-download">⬇️ Download</button>
            <button class="ig-preview-open">🔗 Open in New Tab</button>
        </div>
    `;
    document.body.appendChild(previewModal);

    // Create status element
    const status = document.createElement('div');
    status.className = 'ig-status';
    document.body.appendChild(status);

    // Global state
    let allStories = [];
    let currentPreviewIndex = null;
    let currentMode = 'all';      // 'all' or 'user'
    let currentUsername = null;
    let isLoadingStories = false;

    const CACHE_TTL = 60 * 1000; // 60 секунд
    const cache = {
        all: {
            loadedAt: 0,
            userSections: [],
            stories: []
        },
        users: {
            // usernameLower: { loadedAt, user, stories }
        }
    };

    // Helpers

    function showStatus(message, type = 'info', duration = 3000) {
        status.textContent = message;
        status.className = 'ig-status active';
        if (type === 'success') status.classList.add('success');
        if (type === 'error') status.classList.add('error');
        setTimeout(() => status.classList.remove('active', 'success', 'error'), duration);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    async function igFetch(url) {
        const response = await fetch(url, {
            headers: {
                'x-ig-app-id': '936619743392459',
                'x-requested-with': 'XMLHttpRequest',
                'x-csrftoken': getCookie('csrftoken') || '',
            },
            credentials: 'include'
        });
        return response.json();
    }

    // Определение типа страницы и username
    function getPageInfo() {
        const path = window.location.pathname;

        // Главная страница
        if (path === '/' || path === '') {
            return { isUserPage: false, username: null };
        }

        // Первый сегмент пути: /username/, /username/tagged/, /p/..., /reels/...
        const match = path.match(/^\/([^\/]+)/);
        if (!match) {
            return { isUserPage: false, username: null };
        }

        const slug = match[1];

        // Зарезервированные пути, которые не являются профилем пользователя
        const reserved = new Set([
            'explore',
            'reels',
            'direct',
            'stories',
            'accounts',
            'p',
            'reel',
            'tv'
        ]);

        if (!reserved.has(slug)) {
            return { isUserPage: true, username: slug };
        }

        return { isUserPage: false, username: null };
    }

    function updateButtonText() {
        const pageInfo = getPageInfo();
        const btnText = mainBtn.querySelector('.btn-text');

        if (pageInfo.isUserPage) {
            btnText.textContent = `@${pageInfo.username}`;
            mainBtn.title = `View stories from @${pageInfo.username}`;
        } else {
            btnText.textContent = 'All Stories';
            mainBtn.title = 'View all stories';
        }
    }

    function timeAgo(timestampSec) {
        const seconds = Math.floor(Date.now() / 1000 - timestampSec);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    }

    function formatDateForFilename(unixSeconds) {
        const d = new Date(unixSeconds * 1000);
        const pad = n => String(n).padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        const ss = pad(d.getSeconds());
        return `${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}`;
    }

    function escapeAttr(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function isCacheFresh(ts) {
        return (Date.now() - ts) < CACHE_TTL;
    }

    // Instagram API helpers

    async function getUserIdByUsername(username) {
        try {
            const data = await igFetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`);
            return data.data?.user?.id || null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    }

    async function getStoryReelsTray() {
        try {
            const data = await igFetch('https://www.instagram.com/api/v1/feed/reels_tray/');
            return data.tray || [];
        } catch (error) {
            console.error('Error fetching stories tray:', error);
            return [];
        }
    }

    async function getUserStories(userId) {
        try {
            const data = await igFetch(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${userId}`);
            return data.reels_media || [];
        } catch (error) {
            console.error('Error fetching user stories:', error);
            return [];
        }
    }

    // Media helpers

    function getBestUrl(item) {
        if (item.video_versions && item.video_versions.length > 0) {
            const sorted = [...item.video_versions].sort((a, b) => (b.width * b.height) - (a.width * a.height));
            return {
                url: sorted[0].url,
                type: 'video',
                ext: 'mp4'
            };
        }
        if (item.image_versions2 && item.image_versions2.candidates) {
            const sorted = [...item.image_versions2.candidates].sort((a, b) => (b.width * b.height) - (a.width * a.height));
            return {
                url: sorted[0].url,
                type: 'image',
                ext: 'jpg'
            };
        }
        return null;
    }

    // Download helpers (асинхронные, с реальным ожиданием)

    function gmDownloadAsPromise(url, filename) {
        return new Promise((resolve, reject) => {
            if (typeof GM_download === 'undefined') {
                resolve(false);
                return;
            }
            try {
                GM_download({
                    url,
                    name: filename,
                    saveAs: false,
                    onload() {
                        showStatus(`Downloaded: ${filename}`, 'success');
                        resolve(true);
                    },
                    onerror(err) {
                        console.log('GM_download failed, trying alternative...', err);
                        resolve(false);
                    }
                });
            } catch (e) {
                console.log('GM_download error:', e);
                resolve(false);
            }
        });
    }

    function downloadMethod2(url, filename) {
        return new Promise((resolve) => {
            if (typeof GM_xmlhttpRequest === 'undefined') {
                resolve(false);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'blob',
                headers: {
                    'Referer': 'https://www.instagram.com/',
                },
                onload(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const blobUrl = URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();

                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(blobUrl);
                        }, 100);

                        showStatus(`Downloaded: ${filename}`, 'success');
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                onerror() {
                    resolve(false);
                }
            });
        });
    }

    async function downloadMethod3(url, filename) {
        try {
            const response = await fetch(url, {
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                return false;
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 100);

            showStatus(`Downloaded: ${filename}`, 'success');
            return true;
        } catch (e) {
            return false;
        }
    }

    async function downloadFile(url, filename) {
        showStatus(`Downloading: ${filename}`, 'info', 5000);

        // 1) GM_download
        const gmOk = await gmDownloadAsPromise(url, filename);
        if (gmOk) return;

        // 2) GM_xmlhttpRequest
        const gmXmlOk = await downloadMethod2(url, filename);
        if (gmXmlOk) return;

        // 3) fetch
        const fetchOk = await downloadMethod3(url, filename);
        if (fetchOk) return;

        // 4) последнее спасение — просто открыть в новой вкладке
        showStatus(`Opening in new tab - Right-click to save: ${filename}`, 'info', 5000);
        window.open(url, '_blank');
    }

    async function downloadMultiple(stories, username = 'stories') {
        if (!stories || !stories.length) {
            showStatus('No stories to download', 'error');
            return;
        }

        showStatus(`Starting download of ${stories.length} stories...`, 'info', 3000);

        for (let i = 0; i < stories.length; i++) {
            const story = stories[i];
            const ts = formatDateForFilename(story.takenAt);
            const filename = `${story.username}_${ts}_${i + 1}.${story.ext}`;

            showStatus(`Downloading ${i + 1}/${stories.length}: ${filename}`, 'info', 2000);

            await downloadFile(story.url, filename);
            await new Promise(r => setTimeout(r, 800)); // небольшая пауза между загрузками
        }

        showStatus(`Completed downloading ${stories.length} stories!`, 'success', 5000);
    }

    // Rendering helpers

    function renderUserStories(user, stories) {
        const container = document.getElementById('ig-stories-container');
        const titleEl = modal.querySelector('.ig-modal-title');

        titleEl.innerHTML = `
            <img src="${user.profile_pic_url}" alt="${user.username}">
            <span>Stories from @${user.username}</span>
        `;

        const storiesHtml = stories.map(story => {
            const fullTime = new Date(story.takenAt * 1000).toLocaleString();
            const titleTime = escapeAttr(fullTime);
            return `
                <div class="ig-story-item"
                    data-idx="${story.globalIdx}"
                    data-type="${story.type}"
                    data-username="${story.username}"
                    data-ext="${story.ext}"
                    data-taken="${story.takenAt}">
                    ${story.type === 'video'
                        ? `<video src="${story.url}" muted preload="metadata"></video>`
                        : `<img src="${story.url}" alt="Story" loading="lazy">`
                    }
                    <span class="ig-story-type">${story.type === 'video' ? '🎬' : '📷'}</span>
                    <div class="ig-story-overlay">
                        <span class="ig-story-time" title="${titleTime}">${timeAgo(story.takenAt)}</span>
                        <button class="ig-story-download">⬇️</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="ig-user-section">
                <div class="ig-user-header">
                    <img class="ig-user-avatar" src="${user.profile_pic_url}" alt="${user.username}">
                    <span class="ig-user-name">@${user.username}</span>
                    <button class="ig-user-download-all" data-username="${user.username}">
                        ⬇️ Download All (${stories.length})
                    </button>
                </div>
                <div class="ig-stories-grid">
                    ${storiesHtml}
                </div>
            </div>
        `;

        attachStoryEventListeners();
    }

    function renderAllStoriesFromSections(userSections) {
        const container = document.getElementById('ig-stories-container');
        const titleEl = modal.querySelector('.ig-modal-title');

        titleEl.innerHTML = '<span>All Stories (Last 24 Hours)</span>';

        const html = userSections.map(section => {
            const user = section.user;
            const storiesHtml = section.stories.map(story => {
                const fullTime = new Date(story.takenAt * 1000).toLocaleString();
                const titleTime = escapeAttr(fullTime);
                return `
                    <div class="ig-story-item"
                        data-idx="${story.globalIdx}"
                        data-type="${story.type}"
                        data-username="${story.username}"
                        data-ext="${story.ext}"
                        data-taken="${story.takenAt}">
                        ${story.type === 'video'
                            ? `<video src="${story.url}" muted preload="metadata"></video>`
                            : `<img src="${story.url}" alt="Story" loading="lazy">`
                        }
                        <span class="ig-story-type">${story.type === 'video' ? '🎬' : '📷'}</span>
                        <div class="ig-story-overlay">
                            <span class="ig-story-time" title="${titleTime}">${timeAgo(story.takenAt)}</span>
                            <button class="ig-story-download">⬇️</button>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="ig-user-section">
                    <div class="ig-user-header">
                        <img class="ig-user-avatar" src="${user.profile_pic_url}" alt="${user.username}">
                        <span class="ig-user-name">@${user.username}</span>
                        <button class="ig-user-download-all" data-username="${user.username}">
                            ⬇️ Download All (${section.stories.length})
                        </button>
                    </div>
                    <div class="ig-stories-grid">
                        ${storiesHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        attachStoryEventListeners();
    }

    // Load stories for a specific user (with cache)
    async function loadUserStories(username, { useCache = true } = {}) {
        const container = document.getElementById('ig-stories-container');
        const titleEl = modal.querySelector('.ig-modal-title');
        const cacheKey = username.toLowerCase();

        if (useCache && cache.users[cacheKey] && isCacheFresh(cache.users[cacheKey].loadedAt)) {
            const entry = cache.users[cacheKey];
            allStories = entry.stories.slice();
            renderUserStories(entry.user, entry.stories);
            return;
        }

        container.innerHTML = `<div class="ig-loading">Loading stories for @${username}...</div>`;
        titleEl.innerHTML = `<span>Stories from @${username}</span>`;
        allStories = [];

        try {
            showStatus(`Getting user info for @${username}...`, 'info');
            const userId = await getUserIdByUsername(username);

            if (!userId) {
                container.innerHTML = `<div class="ig-no-stories">Could not find user @${username}</div>`;
                return;
            }

            const reelsMedia = await getUserStories(userId);

            if (!reelsMedia || reelsMedia.length === 0 || !reelsMedia[0].items || reelsMedia[0].items.length === 0) {
                container.innerHTML = `<div class="ig-no-stories">No stories available for @${username}</div>`;
                return;
            }

            const reel = reelsMedia[0];
            const user = reel.user;

            let stories = reel.items.map(item => {
                const media = getBestUrl(item);
                if (!media) return null;
                return {
                    ...media,
                    id: item.id,
                    takenAt: item.taken_at,
                    username: user.username,
                    userId: user.pk,
                    globalIdx: -1
                };
            }).filter(s => s && s.url);

            if (stories.length === 0) {
                container.innerHTML = `<div class="ig-no-stories">No stories available for @${username}</div>`;
                return;
            }

            // сортировка по времени (новые сверху)
            stories.sort((a, b) => b.takenAt - a.takenAt);

            // назначаем глобальные индексы и собираем общий список
            stories.forEach(story => {
                story.globalIdx = allStories.length;
                allStories.push(story);
            });

            cache.users[cacheKey] = {
                loadedAt: Date.now(),
                user,
                stories: stories.slice()
            };

            renderUserStories(user, stories);
            showStatus(`Loaded ${stories.length} stories from @${username}`, 'success');

        } catch (error) {
            console.error('Error loading user stories:', error);
            container.innerHTML = `<div class="ig-no-stories">Error loading stories for @${username}. They might not have any active stories.</div>`;
        }
    }

    // Load all stories (with cache)
    async function loadAllStories({ useCache = true } = {}) {
        const container = document.getElementById('ig-stories-container');
        const titleEl = modal.querySelector('.ig-modal-title');

        if (useCache && cache.all.userSections.length && isCacheFresh(cache.all.loadedAt)) {
            allStories = cache.all.stories.slice();
            renderAllStoriesFromSections(cache.all.userSections);
            return;
        }

        container.innerHTML = '<div class="ig-loading">Loading all stories...</div>';
        titleEl.innerHTML = '<span>All Stories (Last 24 Hours)</span>';
        allStories = [];

        try {
            const tray = await getStoryReelsTray();

            if (tray.length === 0) {
                container.innerHTML = '<div class="ig-no-stories">No stories available. Make sure you are logged in.</div>';
                return;
            }

            container.innerHTML = '<div class="ig-loading">Loading story details... 0/' + tray.length + '</div>';

            const batchSize = 5;
            const userSections = [];

            for (let i = 0; i < tray.length; i += batchSize) {
                const batch = tray.slice(i, i + batchSize);
                const userIds = batch.map(item => item.id).join(',');

                container.querySelector('.ig-loading').textContent =
                    `Loading story details... ${Math.min(i + batchSize, tray.length)}/${tray.length}`;

                try {
                    const data = await igFetch(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${userIds}`);

                    if (data.reels_media) {
                        data.reels_media.forEach(reel => {
                            if (reel.items && reel.items.length > 0) {
                                const user = reel.user;
                                let stories = reel.items.map(item => {
                                    const media = getBestUrl(item);
                                    if (!media) return null;
                                    return {
                                        ...media,
                                        id: item.id,
                                        takenAt: item.taken_at,
                                        username: user.username,
                                        userId: user.pk,
                                        globalIdx: -1
                                    };
                                }).filter(s => s && s.url);

                                if (stories.length > 0) {
                                    // сортировка по времени
                                    stories.sort((a, b) => b.takenAt - a.takenAt);

                                    // назначаем глобальные индексы и добавляем в общий список
                                    stories.forEach(story => {
                                        story.globalIdx = allStories.length;
                                        allStories.push(story);
                                    });

                                    userSections.push({
                                        user,
                                        stories
                                    });
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error('Batch error:', e);
                }

                await new Promise(r => setTimeout(r, 300));
            }

            if (userSections.length === 0) {
                container.innerHTML = '<div class="ig-no-stories">No stories found</div>';
                return;
            }

            cache.all = {
                loadedAt: Date.now(),
                userSections,
                stories: allStories.slice()
            };

            renderAllStoriesFromSections(userSections);
            showStatus(`Loaded ${allStories.length} stories from ${userSections.length} users`, 'success');

        } catch (error) {
            console.error('Error loading stories:', error);
            container.innerHTML = '<div class="ig-no-stories">Error loading stories. Please refresh and try again.</div>';
        }
    }

    // Attach event listeners to story items
    function attachStoryEventListeners() {
        document.querySelectorAll('.ig-story-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const idx = Number(item.dataset.idx);
                const story = allStories[idx];
                if (!story) return;

                if (e.target.classList.contains('ig-story-download')) {
                    e.stopPropagation();
                    const ts = formatDateForFilename(story.takenAt);
                    const filename = `${story.username}_${ts}.${story.ext}`;
                    downloadFile(story.url, filename);
                } else {
                    openPreviewByIndex(idx);
                }
            });
        });

        document.querySelectorAll('.ig-user-download-all').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const username = btn.dataset.username;
                const userStories = allStories.filter(s => s.username === username);
                downloadMultiple(userStories, username);
            });
        });
    }

    // Preview helpers (with navigation)

    function openPreviewByIndex(index) {
        if (index == null || index < 0 || index >= allStories.length) return;

        const prevVideo = previewModal.querySelector('video');
        if (prevVideo) prevVideo.pause();

        currentPreviewIndex = index;
        const story = allStories[index];
        const content = previewModal.querySelector('.ig-preview-content');

        if (story.type === 'video') {
            content.innerHTML = `<video src="${story.url}" controls autoplay playsinline></video>`;
        } else {
            content.innerHTML = `<img src="${story.url}" alt="Story">`;
        }

        previewModal.classList.add('active');
    }

    function closePreview() {
        const video = previewModal.querySelector('video');
        if (video) video.pause();
        previewModal.classList.remove('active');
        currentPreviewIndex = null;
    }

    function showNextStory() {
        if (currentPreviewIndex == null || allStories.length === 0) return;
        let next = currentPreviewIndex + 1;
        if (next >= allStories.length) next = 0;
        openPreviewByIndex(next);
    }

    function showPreviousStory() {
        if (currentPreviewIndex == null || allStories.length === 0) return;
        let prev = currentPreviewIndex - 1;
        if (prev < 0) prev = allStories.length - 1;
        openPreviewByIndex(prev);
    }

    // Main load function - decides what to load based on current page
    async function loadStories({ force = false } = {}) {
        if (isLoadingStories) return;
        isLoadingStories = true;
        try {
            const pageInfo = getPageInfo();
            if (pageInfo.isUserPage) {
                currentMode = 'user';
                currentUsername = pageInfo.username;
                await loadUserStories(pageInfo.username, { useCache: !force });
            } else {
                currentMode = 'all';
                currentUsername = null;
                await loadAllStories({ useCache: !force });
            }
        } finally {
            isLoadingStories = false;
        }
    }

    // Navigation / URL change
    function handlePageChange() {
        updateButtonText();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handlePageChange();
        }
    }).observe(document, { subtree: true, childList: true });

    window.addEventListener('popstate', handlePageChange);

    // Event listeners

    mainBtn.addEventListener('click', () => {
        modal.classList.add('active');
        loadStories({ force: false });
    });

    document.getElementById('ig-close-btn').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.getElementById('ig-refresh-btn').addEventListener('click', () => {
        loadStories({ force: true });
    });

    document.getElementById('ig-download-all-btn').addEventListener('click', async () => {
        if (allStories.length > 0) {
            const msg = currentMode === 'user'
                ? `Download all ${allStories.length} stories from @${currentUsername}?`
                : `Download all ${allStories.length} stories? This may take a while.`;

            if (confirm(msg)) {
                await downloadMultiple(allStories, currentUsername || 'all');
            }
        } else {
            showStatus('No stories to download', 'error');
        }
    });

    previewModal.querySelector('.ig-preview-close').addEventListener('click', () => {
        closePreview();
    });

    previewModal.querySelector('.ig-preview-download').addEventListener('click', () => {
        if (currentPreviewIndex == null) return;
        const story = allStories[currentPreviewIndex];
        const ts = formatDateForFilename(story.takenAt);
        const filename = `${story.username}_${ts}.${story.ext}`;
        downloadFile(story.url, filename);
    });

    previewModal.querySelector('.ig-preview-open').addEventListener('click', () => {
        if (currentPreviewIndex == null) return;
        const story = allStories[currentPreviewIndex];
        window.open(story.url, '_blank');
    });

    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closePreview();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (previewModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closePreview();
                return;
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                showNextStory();
                return;
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showPreviousStory();
                return;
            }
        }

        if (modal.classList.contains('active') && e.key === 'Escape') {
            modal.classList.remove('active');
        }
    });

    const storiesContainer = document.getElementById('ig-stories-container');

    storiesContainer.addEventListener('click', (e) => {
        if (e.target === storiesContainer) {
            modal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Initialize
    updateButtonText();
    console.log('Instagram Stories Viewer & Downloader (Improved) loaded!');

})();