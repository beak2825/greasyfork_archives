// ==UserScript==
// @name         低端影视豆瓣助手
// @namespace    https://ddys.io/
// @version      1.0.1
// @description  在豆瓣电影页面一键查找低端影视(ddys.io)资源，快速跳转观看，本地记录观影历史
// @author       DDYS Helper
// @match        https://movie.douban.com/subject/*
// @match        https://movie.douban.com/explore*
// @match        https://movie.douban.com/tv/*
// @match        https://movie.douban.com/chart*
// @match        https://movie.douban.com/review/best/*
// @match        https://movie.douban.com/mine*
// @icon         https://ddys.io/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      ddys.io
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562834/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562834/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DDYS_API_BASE = 'https://ddys.io/api';
    const CACHE_DURATION = 24 * 60 * 60 * 1000;
    const STORAGE_KEY = 'ddys_watched_movies';

    class DDYSToast {
        constructor() {
            this.container = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            if (!document.body) {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.init());
                    return;
                }
            }
            if (!document.getElementById('ddys-toast-container')) {
                this.container = document.createElement('div');
                this.container.id = 'ddys-toast-container';
                this.container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;max-width:400px;display:flex;flex-direction:column;gap:12px;pointer-events:none;';
                document.body.appendChild(this.container);
            } else {
                this.container = document.getElementById('ddys-toast-container');
            }
            this.initialized = true;
        }

        show(message, type = 'info', duration = 3000) {
            if (!this.initialized) this.init();
            const toast = document.createElement('div');
            toast.className = 'ddys-toast-item';
            toast.style.cssText = 'background:white;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:16px;font-family:Inter,sans-serif;font-size:14px;opacity:0;transform:translateX(100%);transition:all 0.3s ease;pointer-events:auto;max-width:100%;word-wrap:break-word;';
            const icons = {
                success: '<svg style="width:20px;height:20px;color:#10b981;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
                error: '<svg style="width:20px;height:20px;color:#ef4444;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
                warning: '<svg style="width:20px;height:20px;color:#f59e0b;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
                info: '<svg style="width:20px;height:20px;color:#3b82f6;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            };
            toast.innerHTML = `<div style="display:flex;align-items:flex-start;gap:12px;"><div style="margin-top:2px;">${icons[type] || icons.info}</div><div style="flex:1;color:#111827;line-height:1.5;">${this.escapeHtml(message)}</div><button class="toast-close-btn" style="background:none;border:none;color:#9ca3af;cursor:pointer;padding:0;margin-left:8px;flex-shrink:0;"><svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`;
            this.container.appendChild(toast);
            const closeBtn = toast.querySelector('.toast-close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => this.close(toast));
            setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; }, 10);
            if (duration > 0) setTimeout(() => this.close(toast), duration);
            return toast;
        }

        close(toast) {
            if (!toast || !toast.parentElement) return;
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 300);
        }

        success(message, duration = 3000) { return this.show(message, 'success', duration); }
        error(message, duration = 4000) { return this.show(message, 'error', duration); }
        warning(message, duration = 3500) { return this.show(message, 'warning', duration); }
        info(message, duration = 3000) { return this.show(message, 'info', duration); }
        escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
    }

    const ddysToast = new DDYSToast();


    class DDYSDBManager {
        constructor() { this.storageKey = STORAGE_KEY; }
        async init() { return Promise.resolve(); }
        _getData() { return GM_getValue(this.storageKey, {}); }
        _setData(data) { GM_setValue(this.storageKey, data); }

        async addWatchedMovie(movieData) {
            const data = this._getData();
            const record = {
                douban_id: movieData.douban_id,
                title: movieData.title || '',
                title_en: movieData.title_en || '',
                year: movieData.year || 0,
                watched_date: new Date().toISOString().split('T')[0],
                ddys_url: movieData.ddys_url || null,
                ddys_slug: movieData.ddys_slug || null,
                has_resource: movieData.has_resource || false,
                poster: movieData.poster || null
            };
            data[movieData.douban_id] = record;
            this._setData(data);
            return record;
        }

        async isWatched(doubanId) { return !!this._getData()[doubanId]; }
        async getWatchedMovie(doubanId) { return this._getData()[doubanId] || null; }
        async getAllWatchedMovies() {
            const results = Object.values(this._getData());
            results.sort((a, b) => new Date(b.watched_date) - new Date(a.watched_date));
            return results;
        }
        async deleteWatchedMovie(doubanId) { const data = this._getData(); delete data[doubanId]; this._setData(data); return true; }
        async getCount() { return Object.keys(this._getData()).length; }
        async clearAll() { this._setData({}); return true; }
    }

    const dbManager = new DDYSDBManager();

    function extractMovieInfo() {
        const titleElement = document.querySelector('h1 span[property="v:itemreviewed"]');
        const yearElement = document.querySelector('h1 .year');
        if (!titleElement) return null;
        const fullTitle = titleElement.textContent.trim();
        const yearText = yearElement ? yearElement.textContent.trim() : '';
        const year = yearText.match(/\d{4}/) ? parseInt(yearText.match(/\d{4}/)[0]) : 0;
        let title = fullTitle;
        let title_en = '';
        if (fullTitle.includes(' ')) {
            const parts = fullTitle.split(' ');
            const chinesePart = parts.find(p => /[\u4e00-\u9fa5]/.test(p));
            const englishPart = parts.find(p => /[a-zA-Z]/.test(p));
            if (chinesePart) title = chinesePart;
            if (englishPart) title_en = englishPart;
        }
        const urlMatch = window.location.pathname.match(/\/subject\/(\d+)/);
        const douban_id = urlMatch ? urlMatch[1] : '';
        const posterElement = document.querySelector('#mainpic img');
        const poster = posterElement ? posterElement.src : null;
        return { douban_id, title, title_en, year, poster, full_title: fullTitle };
    }

    function getCachedResult(cacheKey) {
        return GM_getValue(cacheKey, null);
    }

    function setCachedResult(cacheKey, data) {
        GM_setValue(cacheKey, { data: data, timestamp: Date.now() });
    }

    function checkDDYSResource(movieInfo) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${DDYS_API_BASE}/search-douban-movie`,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data: JSON.stringify({ title: movieInfo.title, year: movieInfo.year }),
                timeout: 10000,
                onload: function(response) {
                    if (response.status !== 200) { resolve(null); return; }
                    const contentType = response.responseHeaders.match(/content-type:\s*([^\r\n]+)/i);
                    if (!contentType || !contentType[1].includes('application/json')) { resolve(null); return; }
                    let text = response.responseText;
                    const jsonStart = text.indexOf('{');
                    if (jsonStart > 0) text = text.substring(jsonStart);
                    try { resolve(JSON.parse(text)); } catch (e) { resolve(null); }
                },
                onerror: function() { resolve(null); },
                ontimeout: function() { resolve(null); }
            });
        });
    }

    function cleanExpiredCache() {
        const allKeys = GM_listValues();
        for (const key of allKeys) {
            if (key.startsWith('ddys_movie_') && key !== STORAGE_KEY) {
                const value = GM_getValue(key, null);
                if (value && value.timestamp && (Date.now() - value.timestamp > CACHE_DURATION)) {
                    GM_deleteValue(key);
                }
            }
        }
    }

    async function checkDDYSResourceWithCache(movieInfo) {
        const cacheKey = `ddys_movie_${movieInfo.douban_id}`;
        const cached = getCachedResult(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) return cached.data;
        const result = await checkDDYSResource(movieInfo);
        setCachedResult(cacheKey, result);
        return result;
    }


    function createDDYSLink(ddysUrl) {
        const linkContainer = document.createElement('span');
        linkContainer.className = 'ddys-resource-link';
        linkContainer.style.cssText = 'margin-left:8px;display:inline-block;';
        const link = document.createElement('a');
        link.href = `https://ddys.io${ddysUrl}`;
        link.target = '_blank';
        link.style.cssText = 'display:inline-flex!important;align-items:center;gap:4px;padding:6px 12px;background:#f5d547!important;color:#8b4513!important;text-decoration:none;border-radius:3px;font-size:13px;font-weight:normal;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;border:1px solid #e6c547!important;transition:background-color 0.2s ease,border-color 0.2s ease;line-height:1;';
        link.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>在DDYS.IO观看</span>';
        link.addEventListener('mouseenter', () => { link.style.background = '#f0c537'; link.style.borderColor = '#d9b537'; });
        link.addEventListener('mouseleave', () => { link.style.background = '#f5d547'; link.style.borderColor = '#e6c547'; });
        linkContainer.appendChild(link);
        return linkContainer;
    }

    function injectDDYSLink(ddysUrl) {
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;
        const existingLink = document.querySelector('.ddys-resource-link');
        if (existingLink) existingLink.remove();
        titleElement.appendChild(createDDYSLink(ddysUrl));
    }

    async function handleWatchedClick(movieInfo, ddysUrl) {
        try {
            const isAlreadyWatched = await dbManager.isWatched(movieInfo.douban_id);
            if (isAlreadyWatched) {
                const watchedRecord = await dbManager.getWatchedMovie(movieInfo.douban_id);
                ddysToast.info(`已于 ${watchedRecord.watched_date} 标记观看`);
                return;
            }
            const watchData = {
                douban_id: movieInfo.douban_id,
                title: movieInfo.title,
                title_en: movieInfo.title_en,
                year: movieInfo.year,
                poster: movieInfo.poster,
                has_resource: !!ddysUrl,
                ddys_url: ddysUrl || null,
                ddys_slug: ddysUrl ? ddysUrl.split('/').pop() : null,
                watched_date: new Date().toISOString().split('T')[0]
            };
            await dbManager.addWatchedMovie(watchData);
            ddysToast.success('✓ 已记录到观影历史');
            addWatchedIndicator(watchData);
        } catch (error) {
            ddysToast.error('✗ 保存失败');
        }
    }

    function addWatchedIndicator(watchData) {
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;
        const existingIndicator = titleElement.querySelector('.ddys-watched-indicator');
        if (existingIndicator) existingIndicator.remove();
        const indicator = document.createElement('span');
        indicator.className = 'ddys-watched-indicator';
        indicator.style.cssText = 'margin-left:8px;padding:4px 10px;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:4px;font-size:12px;font-weight:500;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;';
        indicator.textContent = `✓ 已观看 ${watchData.watched_date}`;
        titleElement.appendChild(indicator);
    }

    function isUserLoggedIn() { return !!document.querySelector('.nav-user-account'); }

    function getCsrfToken() {
        const urlMatch = window.location.href.match(/ck=([^&]+)/);
        if (urlMatch) return urlMatch[1];
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'ck') return value;
        }
        const linkWithCk = document.querySelector('a[href*="ck="]');
        if (linkWithCk) {
            const match = linkWithCk.href.match(/ck=([^&]+)/);
            if (match) return match[1];
        }
        return null;
    }

    async function syncToDoubanCollection(movieInfo) {
        const ck = getCsrfToken();
        if (!ck) return false;
        try {
            const formData = new FormData();
            formData.append('interest', 'collect');
            formData.append('private', 'on');
            formData.append('ck', ck);
            const response = await fetch(`/j/subject/${movieInfo.douban_id}/interest`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (response.ok) {
                setTimeout(() => window.location.reload(), 500);
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    function monitorWatchedButton(movieInfo, ddysUrl) {
        const alreadyCollected = document.querySelector('a.collect_btn[name*="pbtn"][name$="-collect"]:not([name*="-collect-"])');
        const modifyButton = document.querySelector('a.collect_btn[name*="pbtn"]:not([name*="wish"]):not([name*="collect"])');
        if (modifyButton && !alreadyCollected) return;
        const watchedButton = document.querySelector('a.collect_btn[name*="collect"]');
        if (watchedButton && !watchedButton.dataset.ddysbound) {
            watchedButton.dataset.ddysbound = 'true';
            watchedButton.addEventListener('click', async () => {
                if (isUserLoggedIn()) {
                    const synced = await syncToDoubanCollection(movieInfo);
                    if (synced) ddysToast.success('已保存到豆瓣(私密)');
                } else {
                    await handleWatchedClick(movieInfo, ddysUrl);
                }
            });
        }
    }

    async function checkWatchedStatus(movieInfo) {
        const isWatched = await dbManager.isWatched(movieInfo.douban_id);
        if (!isWatched) return;
        const watchedRecord = await dbManager.getWatchedMovie(movieInfo.douban_id);
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;
        const existingIndicator = titleElement.querySelector('.ddys-watched-indicator');
        if (existingIndicator) return;
        const indicator = document.createElement('span');
        indicator.className = 'ddys-watched-indicator';
        indicator.style.cssText = 'margin-left:8px;padding:4px 10px;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:4px;font-size:12px;font-weight:500;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;';
        indicator.textContent = `✓ 已观看 ${watchedRecord.watched_date}`;
        titleElement.appendChild(indicator);
    }

    function isMovieSubjectPage() { return /\/subject\/\d+/.test(window.location.pathname); }


    function removeAdsFromPage() {
        const aside = document.querySelector('.aside');
        if (aside) aside.remove();
        const daleAdIds = [
            'dale_movie_subject_top_right', 'dale_movie_subject_banner_after_intro',
            'dale_subject_right_guess_you_like', 'dale_movie_subject_inner_middle',
            'dale_movie_subject_middle_right', 'dale_movie_subject_bottom_super_banner',
            'dale_movie_subject_hovering_video', 'dale_movie_explore_middle_right',
            'dale_movie_explore_bottom_super_banner', 'dale_movie_chart_middle_right',
            'dale_movie_chart_bottom_super_banner', 'dale_movie_tv_middle_right',
            'dale_movie_tv_bottom_super_banner'
        ];
        daleAdIds.forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });
        document.querySelectorAll('[id^="dale_"]').forEach(el => el.remove());
        ['.customize-slot', '.ad-banner', '.dale-ad', '[class*="ad-"]', '[id*="ad-"]', '.ad-container', '.ad-frame-container'].forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
        ['https://www.douban.com', 'https://book.douban.com', 'https://music.douban.com',
         'https://www.douban.com/location', 'https://www.douban.com/group', 'https://read.douban.com',
         'https://fm.douban.com', 'https://time.douban.com', 'https://market.douban.com'
        ].forEach(url => {
            document.querySelectorAll(`a[href^="${url}"]`).forEach(link => {
                const li = link.closest('li');
                if (li && li.parentElement && li.parentElement.closest('.global-nav-items')) li.remove();
            });
        });
        const doumail = document.querySelector('#top-nav-doumail-link');
        if (doumail) { const li = doumail.closest('li'); if (li) li.remove(); }
        const app = document.querySelector('.top-nav-doubanapp');
        if (app) app.remove();
        const reminder = document.querySelector('.top-nav-reminder');
        if (reminder) reminder.remove();
        const footer = document.querySelector('#footer');
        if (footer) footer.remove();
    }

    async function init() {
        removeAdsFromPage();
        let debounceTimer = null;
        const observer = new MutationObserver(() => {
            if (debounceTimer) return;
            debounceTimer = setTimeout(() => {
                debounceTimer = null;
                document.querySelectorAll('[id^="dale_"]').forEach(el => { if (el.children.length > 0) el.remove(); });
                document.querySelectorAll('.ad-container, .ad-frame-container, [class*="ad-"]').forEach(el => {
                    if (el.closest('.ddys-resource-link') || el.closest('.ddys-watched-indicator')) return;
                    el.remove();
                });
            }, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        cleanExpiredCache();
        if (!isMovieSubjectPage()) return;
        const movieInfo = extractMovieInfo();
        if (!movieInfo) return;
        await checkWatchedStatus(movieInfo);
        const ddysData = await checkDDYSResourceWithCache(movieInfo);
        let ddysUrl = null;
        if (ddysData && ddysData.found) {
            ddysUrl = ddysData.url;
            injectDDYSLink(ddysUrl);
        }
        monitorWatchedButton(movieInfo, ddysUrl);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();