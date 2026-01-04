// ==UserScript==
// @name         百合会论坛阅读增强
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  为百合会论坛提供漫画/小说的沉浸式阅读体验，支持多种阅读模式、暗色模式、Material Design风格
// @author       bluelightgit
// @match        https://bbs.yamibo.com/thread-*
// @match        https://bbs.yamibo.com/forum.php?mod=viewthread*
// @icon         https://bbs.yamibo.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      bbs.yamibo.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553075/%E7%99%BE%E5%90%88%E4%BC%9A%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553075/%E7%99%BE%E5%90%88%E4%BC%9A%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';

        function normalizeSeriesTitle(rawTitle) {
            if (!rawTitle) return '';
            let title = rawTitle;
            title = title.replace(/[（(]\s*\d+\s*p\s*[）)]\s*$/i, '');
            title = title.replace(/第[\d一二三四五六七八九十百千万〇零兩两1234567890\.]+[话話章节節回卷篇]/gi, ' ');
            title = title.replace(/\d+(?:\.\d+)?\s*[话話章节節回卷篇]/gi, ' ');
            title = title.replace(/\d+(?:\.\d+)?\s*[上下前后前後左右中篇部卷期全完]+(?:\s*[+＋&和及與并並,，/]\s*[上下前后前後左右中篇部卷期全完]+)+/gi, ' ');
            title = title.replace(/[（(][上下前后前後中全完]+(?:\s*[,，+＋&和及與并並/]\s*[上下前后前後中全完]+)*[）)]/g, ' ');
            title = title.replace(/\d+(?:\.\d+)?\s*[上下前后前後左右中篇部卷期全完]+/gi, ' ');
            title = title.replace(/(?:\s+|[-‐‑‒–—―－~～·•_、:：])?\d+(?:\.\d+)*(?:\s*[上下前后前後左右中篇部卷期話话节節全完])?\s*$/g, ' ');
            title = title.replace(/[-－—–~～\u2013\u2014\s]+$/g, ' ');
            title = title.replace(/[\[\]【】（）()]/g, ' ');
            title = title.replace(/\s+/g, ' ').trim();
            if (!title) {
                return rawTitle.trim();
            }
            return title;
        }

        function buildSeriesKey(title) {
            const normalized = normalizeSeriesTitle(title || '');
            const base = normalized || (title || '').trim();
            return base.toLowerCase();
        }

        function normalizeSearchResultsPerPageValue(rawValue) {
            const numeric = Number(rawValue);
            if (!Number.isFinite(numeric)) {
                return CONFIG.SEARCH_RESULTS_PER_PAGE_DEFAULT;
            }
            const clamped = Math.min(
                CONFIG.SEARCH_RESULTS_PER_PAGE_MAX,
                Math.max(CONFIG.SEARCH_RESULTS_PER_PAGE_MIN, Math.floor(numeric))
            );
            return clamped;
        }

        // =========================
        const CONFIG = {
            GOLDEN_RATIO: 0.618,
            DEFAULT_MAIN_WIDTH_RATIO: 0.7,
            SEARCH_RESULTS_PER_PAGE_DEFAULT: 60,
            SEARCH_RESULTS_PER_PAGE_MIN: 20,
            SEARCH_RESULTS_PER_PAGE_MAX: 120,
            MAX_SEARCH_PAGES: 10,
            IMAGE_SIZE_THRESHOLD: 100 * 1024,
            PRELOAD_COUNT: 3,
            SEARCH_RETRY_DELAY: 10000,
            STORAGE_KEY: 'yamibo_reader_data',
            AUTO_OPEN_KEY: 'yamibo_reader_auto_open',
            // 阅读模式
            VIEW_MODES: {
                SCROLL_DOWN: 'scroll-down',
                SCROLL_LEFT: 'scroll-left',
                SCROLL_RIGHT: 'scroll-right',
                FLIP_LEFT_SINGLE: 'flip-left-single',
                FLIP_LEFT_DOUBLE: 'flip-left-double',
                FLIP_RIGHT_SINGLE: 'flip-right-single',
                FLIP_RIGHT_DOUBLE: 'flip-right-double'
            }
        };

        // =========================
        // SVG 图标库
        // =========================
        const ICONS = {
            book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
            bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
            bookmarkFilled: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',
            settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
            close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
            search: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
            arrowLeft: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
            arrowRight: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
            chevronsLeft: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7.41L15.59 6l-6 6 6 6L17 16.59 12.41 12z"/><path d="M11 7.41L9.59 6l-6 6 6 6L11 16.59 6.41 12z"/></svg>',
            chevronsRight: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6L5.59 7.41 10.17 12l-4.58 4.59L7 18l6-6z"/><path d="M15 6l-1.41 1.41L18.17 12l-4.58 4.59L15 18l6-6z"/></svg>',
            darkMode: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/></svg>',
            lightMode: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>',
            viewMode: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>',
            play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
            delete: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>'
        };

        const ALL_VIEW_MODES = new Set(Object.values(CONFIG.VIEW_MODES));
        const LEGACY_VIEW_MODE_MAP = {
            'scroll-ttb': CONFIG.VIEW_MODES.SCROLL_DOWN,
            'scroll-ltr': CONFIG.VIEW_MODES.SCROLL_RIGHT,
            'scroll-rtl': CONFIG.VIEW_MODES.SCROLL_LEFT,
            'page-single': CONFIG.VIEW_MODES.FLIP_RIGHT_SINGLE,
            'page-double': CONFIG.VIEW_MODES.FLIP_RIGHT_DOUBLE
        };

        // =========================
        // 图片缓存管理
        // =========================
        class ImageCache {
            constructor() {
                this.cache = new Map(); // url -> objectUrl
            }

            async load(url) {
                if (this.cache.has(url)) {
                    return this.cache.get(url);
                }

                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    this.cache.set(url, objectUrl);
                    return objectUrl;
                } catch (e) {
                    console.error('Failed to load image:', url, e);
                    return url;
                }
            }

            has(url) {
                return this.cache.has(url);
            }

            get(url) {
                return this.cache.get(url);
            }

            clear() {
                for (const objectUrl of this.cache.values()) {
                    URL.revokeObjectURL(objectUrl);
                }
                this.cache.clear();
            }
        }

    // =========================
    // 数据存储管理
    // =========================
    class DataStore {
        constructor() {
            this.data = this.load();
            this.ensureStructure();
        }

        load() {
            const stored = GM_getValue(CONFIG.STORAGE_KEY, '{}');
            try {
                const data = JSON.parse(stored);
                return data;
            } catch (e) {
                console.error('Failed to parse storage data:', e);
                return {
                    favorites: {},
                    readingProgress: {},
                    settings: {
                        darkMode: false,
                        viewMode: CONFIG.VIEW_MODES.SCROLL_DOWN,
                        floatingButtonPosition: null,
                        searchResultsPerPage: CONFIG.SEARCH_RESULTS_PER_PAGE_DEFAULT,
                        sidebarCollapsed: false
                    }
                };
            }
        }

        save() {
            GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
        }

        ensureStructure() {
            let settingsUpdated = false;
            if (!this.data.settings) {
                this.data.settings = {
                    darkMode: false,
                    viewMode: CONFIG.VIEW_MODES.SCROLL_DOWN,
                    floatingButtonPosition: null,
                    searchResultsPerPage: CONFIG.SEARCH_RESULTS_PER_PAGE_DEFAULT,
                    sidebarCollapsed: false
                };
                settingsUpdated = true;
            }
            if (!this.data.favorites || typeof this.data.favorites !== 'object') {
                this.data.favorites = {};
            }
            if (!this.data.readingProgress || typeof this.data.readingProgress !== 'object') {
                this.data.readingProgress = {};
            }
            if (!this.data.seriesNameOverrides || typeof this.data.seriesNameOverrides !== 'object') {
                this.data.seriesNameOverrides = {};
            }
            const pos = this.data.settings.floatingButtonPosition;
            if (pos && (typeof pos !== 'object' || pos.left === undefined || pos.top === undefined ||
                !Number.isFinite(Number(pos.left)) || !Number.isFinite(Number(pos.top)))) {
                this.data.settings.floatingButtonPosition = null;
                settingsUpdated = true;
            }
            if (!Object.prototype.hasOwnProperty.call(this.data.settings, 'floatingButtonPosition')) {
                this.data.settings.floatingButtonPosition = null;
                settingsUpdated = true;
            }
            if (!Object.prototype.hasOwnProperty.call(this.data.settings, 'searchResultsPerPage')) {
                this.data.settings.searchResultsPerPage = CONFIG.SEARCH_RESULTS_PER_PAGE_DEFAULT;
                settingsUpdated = true;
            } else {
                const normalizedPerPage = normalizeSearchResultsPerPageValue(this.data.settings.searchResultsPerPage);
                if (normalizedPerPage !== this.data.settings.searchResultsPerPage) {
                    this.data.settings.searchResultsPerPage = normalizedPerPage;
                    settingsUpdated = true;
                }
            }
            if (!Object.prototype.hasOwnProperty.call(this.data.settings, 'sidebarCollapsed')) {
                this.data.settings.sidebarCollapsed = false;
                settingsUpdated = true;
            } else if (typeof this.data.settings.sidebarCollapsed !== 'boolean') {
                this.data.settings.sidebarCollapsed = !!this.data.settings.sidebarCollapsed;
                settingsUpdated = true;
            }
            this.migrateLegacyFavorites();

            let favoritesUpdated = false;
            if (this.data.favorites && typeof this.data.favorites === 'object') {
                Object.values(this.data.favorites).forEach(series => {
                    if (!series || typeof series !== 'object') {
                        return;
                    }
                    if (!Object.prototype.hasOwnProperty.call(series, 'directoryCount')) {
                        const storedChapters = series.chapters && typeof series.chapters === 'object'
                            ? Object.keys(series.chapters).length
                            : 0;
                        series.directoryCount = storedChapters;
                        favoritesUpdated = true;
                    } else {
                        const numericCount = Number(series.directoryCount);
                        const normalized = Number.isFinite(numericCount) && numericCount >= 0
                            ? Math.floor(numericCount)
                            : 0;
                        if (series.directoryCount !== normalized) {
                            series.directoryCount = normalized;
                            favoritesUpdated = true;
                        }
                    }
                });
            }

            if (favoritesUpdated || settingsUpdated) {
                this.save();
            }
        }

        migrateLegacyFavorites() {
            const favorites = this.data.favorites;
            if (!favorites) return;
            const legacyEntries = Object.values(favorites).filter(fav => fav && !fav.seriesKey);
            if (legacyEntries.length === 0) {
                return;
            }

            const migrated = Object.values(favorites).reduce((acc, fav) => {
                if (fav && fav.seriesKey) {
                    acc[fav.seriesKey] = fav;
                }
                return acc;
            }, {});
            legacyEntries.forEach(fav => {
                const title = fav.title || '';
                const seriesTitle = normalizeSeriesTitle(title) || title || '未命名合集';
                const seriesKey = buildSeriesKey(title || fav.threadId || String(Date.now()));
                const timestamp = fav.lastVisited || fav.addedAt || Date.now();
                if (!migrated[seriesKey]) {
                    migrated[seriesKey] = {
                        seriesKey,
                        seriesTitle,
                        author: fav.author || '',
                        chapters: {},
                        latestThreadId: '',
                        latestTitle: '',
                        latestUrl: '',
                        latestFloor: 0,
                        latestTotalFloors: 0,
                        directoryCount: 0,
                        addedAt: fav.addedAt || timestamp,
                        lastVisited: timestamp
                    };
                }

                if (fav.threadId) {
                    migrated[seriesKey].chapters[fav.threadId] = {
                        threadId: fav.threadId,
                        title: fav.title || '',
                        url: fav.url || '',
                        currentFloor: fav.currentFloor || 0,
                        totalFloors: fav.totalFloors || 0,
                        lastVisited: timestamp
                    };

                    const latest = migrated[seriesKey];
                    const latestRef = latest.latestThreadId ? latest.chapters[latest.latestThreadId] : null;
                    if (!latestRef || (latestRef.lastVisited || 0) <= timestamp) {
                        latest.latestThreadId = fav.threadId;
                        latest.latestTitle = fav.title || '';
                        latest.latestUrl = fav.url || '';
                        latest.latestFloor = fav.currentFloor || 0;
                        latest.latestTotalFloors = fav.totalFloors || 0;
                        latest.lastVisited = timestamp;
                    }

                    const chapterTotal = latest.chapters ? Object.keys(latest.chapters).length : 0;
                    latest.directoryCount = chapterTotal;
                }
            });

            this.data.favorites = migrated;
            this.save();
        }

        addOrUpdateFavorite(seriesKey, payload) {
            if (!seriesKey) return;
            if (!this.data.favorites) this.data.favorites = {};

            const now = Date.now();
            if (!this.data.favorites[seriesKey]) {
                const seriesTitle = payload?.seriesTitle || normalizeSeriesTitle(payload?.chapterTitle || '') || seriesKey;
                this.data.favorites[seriesKey] = {
                    seriesKey,
                    seriesTitle,
                    author: payload?.author || '',
                    chapters: {},
                    latestThreadId: '',
                    latestTitle: '',
                    latestUrl: '',
                    latestFloor: 0,
                    latestTotalFloors: 0,
                    directoryCount: Number.isFinite(payload?.directoryCount) && payload.directoryCount >= 0
                        ? Math.floor(payload.directoryCount)
                        : 0,
                    addedAt: now,
                    lastVisited: now
                };
            }

            const series = this.data.favorites[seriesKey];
            if (!Object.prototype.hasOwnProperty.call(series, 'directoryCount') ||
                !Number.isFinite(Number(series.directoryCount)) || series.directoryCount < 0) {
                series.directoryCount = 0;
            }

            if (Number.isFinite(payload?.directoryCount) && payload.directoryCount >= 0) {
                const normalizedPayloadCount = Math.floor(payload.directoryCount);
                if (series.directoryCount < normalizedPayloadCount) {
                    series.directoryCount = normalizedPayloadCount;
                }
            }

            this.updateFavoriteChapter(seriesKey, payload, now, false);
            this.save();
        }

        updateFavoriteChapter(seriesKey, payload, timestamp = Date.now(), autoSave = true) {
            if (!seriesKey || !payload || !payload.threadId) return;
            const series = this.data.favorites && this.data.favorites[seriesKey];
            if (!series) return;

            if (payload.seriesTitle) {
                series.seriesTitle = payload.seriesTitle;
            }
            if (payload.author) {
                series.author = payload.author;
            }

            if (!series.chapters) {
                series.chapters = {};
            }

            const chapter = {
                threadId: payload.threadId,
                title: payload.chapterTitle || payload.title || '',
                url: payload.url || '',
                currentFloor: payload.currentFloor || 0,
                totalFloors: payload.totalFloors || 0,
                lastVisited: timestamp
            };

            series.chapters[payload.threadId] = chapter;
            series.lastVisited = timestamp;

            const latest = series.latestThreadId ? series.chapters[series.latestThreadId] : null;
            if (!latest || (latest.lastVisited || 0) <= timestamp || series.latestThreadId === payload.threadId) {
                series.latestThreadId = payload.threadId;
                series.latestTitle = chapter.title;
                series.latestUrl = chapter.url;
                series.latestFloor = chapter.currentFloor;
                series.latestTotalFloors = chapter.totalFloors;
            }

            const totalChapters = series.chapters ? Object.keys(series.chapters).length : 0;
            const existingDirectoryCount = Number(series.directoryCount);
            if (!Number.isFinite(existingDirectoryCount) || existingDirectoryCount < totalChapters) {
                series.directoryCount = totalChapters;
            }

            if (autoSave) {
                this.save();
            }
        }

        removeFavorite(seriesKey) {
            if (this.data.favorites && this.data.favorites[seriesKey]) {
                delete this.data.favorites[seriesKey];
                this.save();
            }
        }

        isSeriesFavorited(seriesKey) {
            return !!(this.data.favorites && this.data.favorites[seriesKey]);
        }

        updateSeriesDirectoryCount(seriesKey, count) {
            if (!seriesKey) {
                return;
            }
            const series = this.data.favorites && this.data.favorites[seriesKey];
            if (!series) {
                return;
            }
            const numericCount = Number(count);
            if (!Number.isFinite(numericCount) || numericCount < 0) {
                return;
            }
            const normalized = Math.floor(numericCount);
            if (Number(series.directoryCount) === normalized) {
                return;
            }
            series.directoryCount = normalized;
            this.save();
        }

        getSeriesDirectoryCount(seriesKey) {
            const series = this.data.favorites && this.data.favorites[seriesKey];
            if (!series) {
                return 0;
            }
            const numericCount = Number(series.directoryCount);
            return Number.isFinite(numericCount) && numericCount >= 0 ? Math.floor(numericCount) : 0;
        }

        getFavorite(seriesKey) {
            return this.data.favorites && this.data.favorites[seriesKey];
        }

        getSeriesNameOverride(baseKey) {
            if (!baseKey) {
                return null;
            }
            const overrides = this.data.seriesNameOverrides;
            if (!overrides || typeof overrides !== 'object') {
                return null;
            }
            const value = overrides[baseKey];
            return typeof value === 'string' && value.trim() ? value.trim() : null;
        }

        setSeriesNameOverride(baseKey, name) {
            if (!baseKey) {
                return;
            }
            const trimmed = typeof name === 'string' ? name.trim() : '';
            if (!trimmed) {
                return;
            }
            if (!this.data.seriesNameOverrides || typeof this.data.seriesNameOverrides !== 'object') {
                this.data.seriesNameOverrides = {};
            }
            if (this.data.seriesNameOverrides[baseKey] === trimmed) {
                return;
            }
            this.data.seriesNameOverrides[baseKey] = trimmed;
            this.save();
        }

        renameFavoriteSeries(oldKey, newKey, newTitle) {
            if (!oldKey || !newKey || oldKey === newKey) {
                return;
            }
            if (!this.data.favorites || typeof this.data.favorites !== 'object') {
                return;
            }
            const source = this.data.favorites[oldKey];
            if (!source) {
                return;
            }

            let target = this.data.favorites[newKey];
            if (target && target !== source) {
                // 合并章节
                if (!target.chapters || typeof target.chapters !== 'object') {
                    target.chapters = {};
                }
                if (source.chapters && typeof source.chapters === 'object') {
                    Object.keys(source.chapters).forEach(threadId => {
                        if (!target.chapters[threadId]) {
                            target.chapters[threadId] = source.chapters[threadId];
                        }
                    });
                }

                // 更新元数据
                const timestamps = [target.lastVisited, source.lastVisited].filter(Boolean);
                target.lastVisited = timestamps.length ? Math.max(...timestamps) : Date.now();
                target.addedAt = Math.min(target.addedAt || Date.now(), source.addedAt || Date.now());
                if (!target.author && source.author) {
                    target.author = source.author;
                }
                const sourceLastVisited = source.lastVisited || 0;
                const targetLastVisited = target.lastVisited || 0;
                if ((!target.latestThreadId && source.latestThreadId) || sourceLastVisited >= targetLastVisited) {
                    target.latestThreadId = source.latestThreadId;
                    target.latestTitle = source.latestTitle;
                    target.latestUrl = source.latestUrl;
                    target.latestFloor = source.latestFloor;
                    target.latestTotalFloors = source.latestTotalFloors;
                }
                const sourceChapterCount = source.chapters ? Object.keys(source.chapters).length : 0;
                const targetChapterCount = target.chapters ? Object.keys(target.chapters).length : 0;
                const sourceDirectoryCount = Number(source.directoryCount);
                const targetDirectoryCount = Number(target.directoryCount);
                const normalizedSourceDirectoryCount = Number.isFinite(sourceDirectoryCount) && sourceDirectoryCount >= 0
                    ? Math.floor(sourceDirectoryCount)
                    : sourceChapterCount;
                const normalizedTargetDirectoryCount = Number.isFinite(targetDirectoryCount) && targetDirectoryCount >= 0
                    ? Math.floor(targetDirectoryCount)
                    : targetChapterCount;
                target.directoryCount = Math.max(normalizedTargetDirectoryCount, normalizedSourceDirectoryCount, targetChapterCount);
            } else {
                this.data.favorites[newKey] = source;
                target = this.data.favorites[newKey];
            }

            delete this.data.favorites[oldKey];

            if (target) {
                target.seriesKey = newKey;
                if (newTitle) {
                    target.seriesTitle = newTitle;
                }
            }

            this.save();
        }

        getAllFavorites() {
            if (!this.data.favorites) return [];
            return Object.values(this.data.favorites);
        }

        setProgress(threadId, floor) {
            if (!this.data.readingProgress) this.data.readingProgress = {};
            this.data.readingProgress[threadId] = {
                floor,
                timestamp: Date.now()
            };
            this.save();
        }

        getProgress(threadId) {
            return this.data.readingProgress && this.data.readingProgress[threadId];
        }

        setSetting(key, value) {
            if (!this.data.settings) this.data.settings = {};
            this.data.settings[key] = value;
            this.save();
        }

        getSetting(key, defaultValue) {
            return this.data.settings && this.data.settings[key] !== undefined
                ? this.data.settings[key]
                : defaultValue;
        }

        getFloatingButtonPosition() {
            const raw = this.getSetting('floatingButtonPosition', null);
            if (!raw || typeof raw !== 'object') {
                return null;
            }
            const left = Number(raw.left);
            const top = Number(raw.top);
            if (!Number.isFinite(left) || !Number.isFinite(top)) {
                return null;
            }
            return { left, top };
        }

        setFloatingButtonPosition(left, top) {
            if (!Number.isFinite(left) || !Number.isFinite(top)) {
                return;
            }
            const payload = {
                left: Math.round(left),
                top: Math.round(top)
            };
            this.setSetting('floatingButtonPosition', payload);
        }

        exportData(pretty = true) {
            const payload = {
                favorites: this.data.favorites || {},
                settings: this.data.settings || {},
                readingProgress: this.data.readingProgress || {},
                seriesNameOverrides: this.data.seriesNameOverrides || {}
            };
            return JSON.stringify(payload, pretty ? 2 : 0);
        }

        importData(jsonInput) {
            if (!jsonInput) {
                throw new Error('数据为空');
            }

            let parsed = jsonInput;
            if (typeof jsonInput === 'string') {
                try {
                    parsed = JSON.parse(jsonInput);
                } catch (e) {
                    throw new Error('JSON 解析失败');
                }
            }

            if (!parsed || typeof parsed !== 'object') {
                throw new Error('数据格式不正确');
            }

            const nextData = {
                favorites: typeof parsed.favorites === 'object' && parsed.favorites !== null ? parsed.favorites : {},
                settings: typeof parsed.settings === 'object' && parsed.settings !== null ? parsed.settings : {},
                readingProgress: typeof parsed.readingProgress === 'object' && parsed.readingProgress !== null ? parsed.readingProgress : {},
                seriesNameOverrides: typeof parsed.seriesNameOverrides === 'object' && parsed.seriesNameOverrides !== null ? parsed.seriesNameOverrides : {}
            };

            this.data = {
                ...this.data,
                ...nextData
            };
            this.ensureStructure();
            this.save();
        }
    }

    // =========================
    // 内容解析器
    // =========================
    class ContentParser {
        constructor() {
            this.threadId = this.getThreadId();
            this.threadTitle = this.getThreadTitle();
            this.authorUid = this.getAuthorUid();
            this.authorName = this.getAuthorName();
            this.seriesTitle = normalizeSeriesTitle(this.threadTitle);
            this.seriesKey = buildSeriesKey(this.threadTitle);
        }

        getThreadId() {
            const href = window.location.href;
            let match = href.match(/thread-(\d+)-/);
            if (match) {
                return match[1];
            }

            try {
                const url = new URL(href);
                const tidParam = url.searchParams.get('tid');
                if (tidParam) {
                    return tidParam;
                }
            } catch (e) {
                // ignore URL parsing errors and fallback to regex below
            }

            match = href.match(/[?&]tid=(\d+)/);
            return match ? match[1] : null;
        }

        getThreadTitle() {
            const titleElement = document.querySelector('#thread_subject');
            return titleElement ? titleElement.textContent.trim() : '';
        }

        getAuthorUid() {
            const firstPost = document.querySelector('#postlist > div[id^="post_"]');
            if (firstPost) {
                const authorLink = firstPost.querySelector('.favatar .authi a');
                if (authorLink) {
                    const href = authorLink.getAttribute('href');
                    let match = href.match(/uid=(\d+)/);
                    if (!match) {
                        match = href.match(/uid-(\d+)/);
                    }
                    return match ? match[1] : null;
                }
            }
            return null;
        }

        getAuthorName() {
            const firstPost = document.querySelector('#postlist > div[id^="post_"]');
            if (firstPost) {
                const authorLink = firstPost.querySelector('.favatar .authi a');
                if (authorLink) {
                    return authorLink.textContent.trim();
                }
            }
            return '';
        }

        // 获取楼主的所有帖子
        getAuthorPosts() {
            const posts = [];
            const postElements = document.querySelectorAll('#postlist > div[id^="post_"]');

            postElements.forEach((postEl) => {
                const authorLink = postEl.querySelector('.favatar .authi a');
                if (authorLink) {
                    const href = authorLink.getAttribute('href');
                    let match = href.match(/uid=(\d+)/);
                    if (!match) {
                        match = href.match(/uid-(\d+)/);
                    }

                    if (match && match[1] === this.authorUid) {
                        const postId = postEl.id.replace('post_', '');
                        const floorNum = this.getFloorNumber(postEl);
                        const content = postEl.querySelector('.t_f, .pcb');
                        const images = content ? Array.from(content.querySelectorAll('img.zoom, img[id^="aimg_"]')) : [];

                        // 统计图片总数（包括未加载的）
                        const imageUrls = images.map(img => {
                            return img.getAttribute('file') ||
                                   img.getAttribute('zoomfile') ||
                                   img.getAttribute('src') ||
                                   img.getAttribute('data-original') ||
                                   '';
                        }).filter(url => url && !url.includes('static/image'));

                        posts.push({
                            postId,
                            floor: floorNum,
                            element: postEl,
                            content: content,
                            images: imageUrls,
                            imageCount: imageUrls.length
                        });
                    }
                }
            });

            return posts;
        }

        getFloorNumber(postEl) {
            const floorElement = postEl.querySelector('.pi strong a em');
            if (floorElement) {
                const text = floorElement.textContent;
                const match = text.match(/(\d+)/);
                return match ? parseInt(match[1]) : 1;
            }

            const postnumLink = postEl.querySelector('[id^="postnum"]');
            if (postnumLink) {
                const em = postnumLink.querySelector('em');
                if (em) {
                    const match = em.textContent.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 1;
                }
            }

            return 1;
        }

        extractSeriesName() {
            return normalizeSeriesTitle(this.threadTitle);
        }
    }

    // =========================
    // 阅读模式界面
    // =========================
    class ReaderUI {
        constructor(parser, dataStore) {
            this.parser = parser;
            this.dataStore = dataStore;
            this.isReaderMode = false;
            this.currentFloor = 0;
            this.currentImageIndex = 0;
            this.posts = [];
            this.allImages = [];
            this.directory = [];
            this.searchRetryTimer = null;
            this.readerContainer = null;
            const storedViewMode = dataStore.getSetting('viewMode', CONFIG.VIEW_MODES.SCROLL_DOWN);
            this.viewMode = LEGACY_VIEW_MODE_MAP[storedViewMode] || storedViewMode;
            if (!ALL_VIEW_MODES.has(this.viewMode)) {
                this.viewMode = CONFIG.VIEW_MODES.SCROLL_DOWN;
                this.dataStore.setSetting('viewMode', this.viewMode);
            } else if (this.viewMode !== storedViewMode) {
                this.dataStore.setSetting('viewMode', this.viewMode);
            }
            this.darkMode = dataStore.getSetting('darkMode', false);
            this.imageCache = new ImageCache(); // 图片缓存
            this.scrollHandler = null;
            this.scrollUpdateScheduled = false;
            this.currentScrollImageIndex = 0;
            this.lastFlipDirection = 'next';
            this.baseSeriesKey = buildSeriesKey(this.parser.threadTitle);
            const defaultSeriesName = this.parser.seriesTitle || normalizeSeriesTitle(this.parser.threadTitle) || this.parser.threadTitle || '未命名合集';
            const storedSeriesName = this.dataStore.getSeriesNameOverride(this.baseSeriesKey);
            this.currentSeriesName = (storedSeriesName || defaultSeriesName).trim() || defaultSeriesName;
            this.seriesTitle = this.currentSeriesName;
            this.seriesKey = buildSeriesKey(this.currentSeriesName);
            if (this.seriesKey !== this.baseSeriesKey && this.dataStore.getFavorite && this.dataStore.getFavorite(this.baseSeriesKey)) {
                this.dataStore.renameFavoriteSeries(this.baseSeriesKey, this.seriesKey, this.currentSeriesName);
            }
            const storedMainWidth = parseFloat(this.dataStore.getSetting('mainWidthRatio', CONFIG.DEFAULT_MAIN_WIDTH_RATIO));
            this.mainWidthRatio = Number.isFinite(storedMainWidth) ? storedMainWidth : CONFIG.DEFAULT_MAIN_WIDTH_RATIO;
            this.mainWidthRatio = Math.min(Math.max(this.mainWidthRatio, 0.5), 0.9);
            this.sidebarCollapsed = !!this.dataStore.getSetting('sidebarCollapsed', false);

            this.currentDirectoryCount = null;
            this.createFloatingButton();
            this.autoOpenIfRequested();
        }

        createFloatingButton() {
            const button = document.createElement('div');
            button.id = 'yamibo-reader-btn';
            button.innerHTML = ICONS.book;
            button.title = '开启阅读模式';

            this.makeDraggable(button);
            document.body.appendChild(button);
            this.floatingBtn = button;
            this.applyFloatingButtonPosition();
            this.handleWindowResize = () => this.updateFloatingButtonDockState();
            window.addEventListener('resize', this.handleWindowResize, { passive: true });
            button.addEventListener('mouseenter', () => this.handleFloatingButtonHover(true));
            button.addEventListener('mouseleave', () => this.handleFloatingButtonHover(false));
        }

        applyFloatingButtonPosition() {
            if (!this.floatingBtn) {
                return;
            }
            const saved = this.dataStore.getFloatingButtonPosition();
            const element = this.floatingBtn;
            if (saved) {
                element.style.left = `${saved.left}px`;
                element.style.top = `${saved.top}px`;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
                element.style.transform = 'none';
            } else {
                element.style.left = 'auto';
                element.style.bottom = 'auto';
                element.style.right = '20px';
                element.style.top = '50%';
                element.style.transform = 'translateY(-50%)';
            }
            this.updateFloatingButtonDockState();
        }

        updateFloatingButtonDockState() {
            if (!this.floatingBtn) {
                return;
            }
            if (this.floatingBtn.dataset.dockExpanded === '1') {
                return;
            }
            const rect = this.floatingBtn.getBoundingClientRect();
            const threshold = 12;
            const nearLeft = rect.left <= threshold;
            const nearRight = window.innerWidth - rect.right <= threshold;
            const isLeftOnly = nearLeft && !nearRight;
            const isRightOnly = nearRight && !nearLeft;
            let dockState = '';
            if (isLeftOnly) {
                this.floatingBtn.classList.add('edge-left');
                this.floatingBtn.classList.remove('edge-right');
                dockState = 'left';
            } else if (isRightOnly) {
                this.floatingBtn.classList.add('edge-right');
                this.floatingBtn.classList.remove('edge-left');
                dockState = 'right';
            } else {
                this.floatingBtn.classList.remove('edge-left', 'edge-right');
            }
            this.applyFloatingButtonDockOffset(dockState);
        }

        applyFloatingButtonDockOffset(direction, options = {}) {
            const btn = this.floatingBtn;
            if (!btn) {
                return;
            }
            const { preserveState = false, force = false } = options;
            const previous = btn.dataset.dockState || '';
            if (!direction && preserveState && previous) {
                // fall through to restoration without clearing state
            } else if (previous === direction && !force) {
                return;
            }

            const hasStoredLeft = Object.prototype.hasOwnProperty.call(btn.dataset, 'restoreLeft');
            const hasStoredRight = Object.prototype.hasOwnProperty.call(btn.dataset, 'restoreRight');

            if (!direction) {
                if (hasStoredLeft) {
                    btn.style.left = btn.dataset.restoreLeft;
                }
                if (hasStoredRight) {
                    btn.style.right = btn.dataset.restoreRight;
                }
                if (!preserveState) {
                    delete btn.dataset.restoreLeft;
                    delete btn.dataset.restoreRight;
                    btn.dataset.dockState = '';
                }
                return;
            }

            if (!hasStoredLeft) {
                btn.dataset.restoreLeft = btn.style.left || '';
            }
            if (!hasStoredRight) {
                btn.dataset.restoreRight = btn.style.right || '';
            }

            const halfWidth = Math.round(btn.offsetWidth / 2);
            if (direction === 'left') {
                btn.style.left = `${-halfWidth}px`;
                btn.style.right = 'auto';
            } else if (direction === 'right') {
                btn.style.right = `${-halfWidth}px`;
                btn.style.left = 'auto';
            }

            btn.dataset.dockState = direction;
        }

        handleFloatingButtonHover(isHovering) {
            const btn = this.floatingBtn;
            if (!btn) {
                return;
            }
            const dockState = btn.dataset.dockState || '';
            if (!dockState) {
                return;
            }

            if (isHovering) {
                if (btn.dataset.dockExpanded === '1') {
                    return;
                }
                this.applyFloatingButtonDockOffset('', { preserveState: true });
                btn.classList.add('edge-expanded');
                btn.dataset.dockExpanded = '1';
            } else {
                if (btn.dataset.dockExpanded !== '1') {
                    return;
                }
                btn.classList.remove('edge-expanded');
                delete btn.dataset.dockExpanded;
                this.applyFloatingButtonDockOffset(dockState, { force: true });
            }
        }

        makeDraggable(element) {
            const DRAG_DELAY = 300;
            let isDragging = false;
            let dragTimeoutId = null;
            let pointerDownTime = 0;
            let pointerId = null;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            const clearDragTimer = () => {
                if (dragTimeoutId !== null) {
                    clearTimeout(dragTimeoutId);
                    dragTimeoutId = null;
                }
            };

            const beginDragging = () => {
                if (isDragging) return;
                isDragging = true;
                element.style.transition = 'none';
                element.style.transform = 'none';
                element.style.left = `${startLeft}px`;
                element.style.top = `${startTop}px`;
                element.style.right = 'auto';
                element.style.cursor = 'move';
                document.body.classList.add('reader-btn-dragging');
                element.classList.remove('edge-left', 'edge-right');
                if (element.dataset.dockExpanded === '1') {
                    this.handleFloatingButtonHover(false);
                }
            };

            const endDragging = () => {
                if (!isDragging) return;
                isDragging = false;
                const rect = element.getBoundingClientRect();
                this.dataStore.setFloatingButtonPosition(rect.left, rect.top);
                this.applyFloatingButtonPosition();
                element.style.transition = '';
                element.style.cursor = '';
                document.body.classList.remove('reader-btn-dragging');
                this.updateFloatingButtonDockState();
            };

            element.addEventListener('pointerdown', (e) => {
                if (typeof e.button === 'number' && e.button !== 0) {
                    return;
                }

                pointerDownTime = performance.now();
                pointerId = e.pointerId;
                startX = e.clientX;
                startY = e.clientY;
                const rect = element.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                clearDragTimer();
                dragTimeoutId = window.setTimeout(() => {
                    if (pointerId !== null) {
                        beginDragging();
                    }
                }, DRAG_DELAY);

                element.setPointerCapture?.(pointerId);
                e.preventDefault();
            });

            element.addEventListener('pointermove', (e) => {
                if (!isDragging) {
                    return;
                }

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop));

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                element.style.right = 'auto';
            });

            const handlePointerEnd = (e) => {
                if (pointerId !== null && element.releasePointerCapture) {
                    try {
                        element.releasePointerCapture(pointerId);
                    } catch (err) {
                        /* ignore */
                    }
                }

                clearDragTimer();

                if (isDragging) {
                    endDragging();
                } else if (pointerDownTime > 0) {
                    const elapsed = performance.now() - pointerDownTime;
                    if (elapsed < DRAG_DELAY) {
                        this.toggleReaderMode();
                    }
                }

                pointerDownTime = 0;
                pointerId = null;
            };

            element.addEventListener('pointerup', handlePointerEnd);
            element.addEventListener('pointercancel', handlePointerEnd);
        }

        toggleReaderMode() {
            if (!this.isReaderMode) {
                this.enterReaderMode();
            } else {
                this.exitReaderMode();
            }
        }

        enterReaderMode() {
            this.isReaderMode = true;
            this.posts = this.parser.getAuthorPosts();

            if (this.posts.length === 0) {
                alert('未找到楼主的帖子内容');
                return;
            }

            // 收集所有图片
            this.allImages = [];
            this.posts.forEach(post => {
                post.images.forEach(img => {
                    this.allImages.push({
                        url: img,
                        floor: post.floor,
                        loaded: false
                    });
                });
            });

            document.body.classList.add('yamibo-reader-active');
            if (this.darkMode) {
                document.body.classList.add('dark-mode');
            }

            this.createReaderContainer();

            const progress = this.dataStore.getProgress(this.parser.threadId);
            if (progress) {
                this.currentFloor = progress.floor;
            }

            this.renderContent();
            this.loadDirectory();
        }

        exitReaderMode() {
            this.isReaderMode = false;
            document.body.classList.remove('yamibo-reader-active', 'dark-mode', 'reader-resizing');
            this.teardownScrollInteractions();

            const container = document.getElementById('yamibo-reader-container');
            if (container) {
                container.classList.remove('resizing');
                container.remove();
            }
            this.readerContainer = null;
        }

        createReaderContainer() {
            const currentPreload = this.dataStore.getSetting('preloadCount', CONFIG.PRELOAD_COUNT);
            const cachedCount = this.imageCache.cache.size;
            const container = document.createElement('div');
            container.id = 'yamibo-reader-container';
            container.innerHTML = `
                <div class="reader-main" id="reader-main">
                    <div class="reader-main-inner">
                        <div class="reader-toolbar">
                            <div class="toolbar-left">
                                <button id="view-mode-btn" class="icon-btn" title="切换阅读模式">
                                    ${ICONS.viewMode}
                                </button>
                                <button id="dark-mode-btn" class="icon-btn" title="切换暗色模式">
                                    ${this.darkMode ? ICONS.lightMode : ICONS.darkMode}
                                </button>
                            </div>
                            <div class="toolbar-center">
                                <div class="reader-controls">
                                    <button id="prev-floor" class="nav-btn" title="上一页">
                                        ${ICONS.arrowLeft}
                                    </button>
                                    <span id="floor-indicator">1 / ${this.posts.length}</span>
                                    <button id="next-floor" class="nav-btn" title="下一页">
                                        ${ICONS.arrowRight}
                                    </button>
                                </div>
                            </div>
                            <div class="toolbar-right">
                                <button id="close-reader-top" class="icon-btn" title="关闭阅读模式">
                                    ${ICONS.close}
                                </button>
                                <button id="toggle-sidebar-btn" class="icon-btn" title="收起右侧菜单" aria-pressed="false">
                                    ${ICONS.chevronsRight}
                                </button>
                            </div>
                        </div>
                        <div class="reader-content-wrapper">
                            <div class="reader-content" id="reader-content" data-view-mode="${this.viewMode}">
                                <div class="content-loading">正在加载图片...</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="reader-resizer" id="reader-resizer"></div>
                <div class="reader-sidebar">
                        <div class="sidebar-top">
                            <div class="sidebar-tabs">
                            <button class="tab-btn active" data-tab="directory">目录</button>
                            <button class="tab-btn" data-tab="comments">评论</button>
                            <button class="tab-btn" data-tab="favorites">收藏</button>
                        </div>
                    </div>
                    <div class="sidebar-content">
                        <div class="tab-panel active" id="directory-panel">
                            <div class="directory-search">
                                <input type="text" placeholder="搜索系列..." id="series-search">
                                <button id="search-btn" class="icon-btn">${ICONS.search}</button>
                                <button id="favorite-btn" class="icon-btn" title="收藏本系列">
                                    ${this.dataStore.isSeriesFavorited(this.seriesKey) ? ICONS.bookmarkFilled : ICONS.bookmark}
                                </button>
                            </div>
                            <div class="directory-list" id="directory-list">
                                <div class="loading">正在加载目录...</div>
                            </div>
                        </div>
                        <div class="tab-panel" id="comments-panel">
                            <div class="comments-list" id="comments-list">
                                <div class="loading">加载评论中...</div>
                            </div>
                        </div>
                        <div class="tab-panel" id="favorites-panel">
                            <div class="favorites-list" id="favorites-list">
                                <div class="empty-message">暂无收藏</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="view-mode-menu" class="popup-menu" style="display: none;">
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.SCROLL_DOWN}">
                        <span>滑动-下</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.SCROLL_LEFT}">
                        <span>滑动-左</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.SCROLL_RIGHT}">
                        <span>滑动-右</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.FLIP_LEFT_SINGLE}">
                        <span>翻页-左-单页</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.FLIP_LEFT_DOUBLE}">
                        <span>翻页-左-双页</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.FLIP_RIGHT_SINGLE}">
                        <span>翻页-右-单页</span>
                    </div>
                    <div class="menu-item" data-mode="${CONFIG.VIEW_MODES.FLIP_RIGHT_DOUBLE}">
                        <span>翻页-右-双页</span>
                    </div>
                    <div class="menu-divider"></div>
                    <div class="menu-settings">
                        <div class="menu-section-title">阅读设置</div>
                        <label class="menu-range-label" for="menu-preload-slider">
                            预加载图片
                            <span id="menu-preload-value">${currentPreload}</span>
                        </label>
                        <input type="range" id="menu-preload-slider" min="0" max="10" step="1" value="${currentPreload}">
                        <label class="menu-input-label" for="menu-search-per-page">每页搜索数量</label>
                        <input
                            type="number"
                            id="menu-search-per-page"
                            class="menu-number-input"
                            min="${CONFIG.SEARCH_RESULTS_PER_PAGE_MIN}"
                            max="${CONFIG.SEARCH_RESULTS_PER_PAGE_MAX}"
                            step="10"
                            value="${this.getSearchResultsPerPage()}">
                        <div class="menu-hint">少于该数量时停止翻页</div>
                        <div class="menu-cache-info">已缓存: <span id="menu-cache-count">${cachedCount}</span> 张</div>
                        <button id="menu-clear-cache" class="menu-action-btn">清除图片缓存</button>
                        <button id="menu-data-transfer" class="menu-action-btn">导入/导出</button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            this.readerContainer = container;
            const searchInput = document.getElementById('series-search');
            if (searchInput) {
                searchInput.value = this.currentSeriesName;
            }
            this.applyLayoutSizing();
            this.bindReaderEvents();
            this.setupResizer();
            this.applySidebarState();
        }

        bindReaderEvents() {
            document.getElementById('prev-floor').addEventListener('click', () => this.prevFloor());
            document.getElementById('next-floor').addEventListener('click', () => this.nextFloor());

            // 点击内容区域左右两侧翻页
            const contentDiv = document.getElementById('reader-content');
            const applyCursorZone = (zone) => {
                if (!contentDiv) {
                    return;
                }
                contentDiv.classList.toggle('reader-content-hover', zone !== 'center');
                contentDiv.classList.toggle('cursor-left', zone === 'left');
                contentDiv.classList.toggle('cursor-right', zone === 'right');
            };

            contentDiv.addEventListener('click', (e) => {
                const rect = contentDiv.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const isScrollLeft = this.viewMode === CONFIG.VIEW_MODES.SCROLL_LEFT;
                // 左侧 30% 区域
                if (clickX < width * 0.3) {
                    if (isScrollLeft) {
                        this.nextFloor();
                    } else {
                        this.prevFloor();
                    }
                }
                // 右侧 30% 区域
                else if (clickX > width * 0.7) {
                    if (isScrollLeft) {
                        this.prevFloor();
                    } else {
                        this.nextFloor();
                    }
                }
            });

            const updateHoverCursor = (event) => {
                const rect = contentDiv.getBoundingClientRect();
                const hoverX = event.clientX - rect.left;
                const width = rect.width;
                if (hoverX < width * 0.3) {
                    applyCursorZone('left');
                } else if (hoverX > width * 0.7) {
                    applyCursorZone('right');
                } else {
                    applyCursorZone('center');
                }
            };

            contentDiv.addEventListener('mousemove', updateHoverCursor);
            contentDiv.addEventListener('mouseleave', () => {
                applyCursorZone('center');
            });

            document.addEventListener('keydown', (e) => {
                if (!this.isReaderMode) return;

                if (e.key === 'ArrowLeft') {
                    this.prevFloor();
                } else if (e.key === 'ArrowRight') {
                    this.nextFloor();
                } else if (e.key === 'Escape') {
                    this.exitReaderMode();
                }
            });

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.target.closest('.tab-btn').dataset.tab;
                    this.switchTab(tab);
                });
            });

            document.getElementById('favorite-btn').addEventListener('click', () => this.toggleFavorite());
            document.getElementById('close-reader-top').addEventListener('click', () => this.exitReaderMode());
            const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
            if (toggleSidebarBtn) {
                toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar());
            }
            document.getElementById('search-btn').addEventListener('click', () => this.searchDirectory());
            const searchInputEl = document.getElementById('series-search');
            if (searchInputEl) {
                searchInputEl.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.searchDirectory();
                    }
                });
                searchInputEl.addEventListener('blur', () => {
                    const value = searchInputEl.value.trim();
                    if (!value) {
                        searchInputEl.value = this.currentSeriesName;
                        return;
                    }
                    this.updateSeriesName(value, { persistOverride: true });
                });
            }

            // 暗色模式切换
            document.getElementById('dark-mode-btn').addEventListener('click', () => this.toggleDarkMode());

            // 阅读模式切换
            document.getElementById('view-mode-btn').addEventListener('click', (e) => {
                const menu = document.getElementById('view-mode-menu');
                const rect = e.target.getBoundingClientRect();
                menu.style.top = `${rect.bottom + 5}px`;
                menu.style.left = `${rect.left}px`;

                this.syncMenuSettingControls();

                menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
            });

            document.querySelectorAll('#view-mode-menu .menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const mode = e.target.closest('.menu-item').dataset.mode;
                    this.changeViewMode(mode);
                    document.getElementById('view-mode-menu').style.display = 'none';
                });
            });

            const dataTransferBtn = document.getElementById('menu-data-transfer');
            if (dataTransferBtn) {
                dataTransferBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const menu = document.getElementById('view-mode-menu');
                    if (menu) {
                        menu.style.display = 'none';
                    }
                    this.showDataTransferDialog();
                });
            }

            // 点击其他地方关闭菜单
            document.addEventListener('click', (e) => {
                const menu = document.getElementById('view-mode-menu');
                const btn = document.getElementById('view-mode-btn');
                if (menu && !menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.style.display = 'none';
                }

                const preloadSlider = document.getElementById('menu-preload-slider');
                const preloadValue = document.getElementById('menu-preload-value');
                const cacheCountSpan = document.getElementById('menu-cache-count');
                const clearCacheBtn = document.getElementById('menu-clear-cache');
                const perPageInput = document.getElementById('menu-search-per-page');

                if (preloadSlider && preloadValue && !preloadSlider.dataset.bound) {
                    preloadSlider.dataset.bound = 'true';
                    preloadSlider.addEventListener('input', (event) => {
                        const value = Number(event.target.value);
                        preloadValue.textContent = value;
                        this.dataStore.setSetting('preloadCount', value);
                    });
                }

                if (perPageInput && !perPageInput.dataset.bound) {
                    perPageInput.dataset.bound = 'true';
                    perPageInput.addEventListener('change', (event) => {
                        const normalized = normalizeSearchResultsPerPageValue(event.target.value);
                        event.target.value = normalized;
                        this.dataStore.setSetting('searchResultsPerPage', normalized);
                    });
                }

                if (clearCacheBtn && cacheCountSpan && !clearCacheBtn.dataset.bound) {
                    clearCacheBtn.dataset.bound = 'true';
                    clearCacheBtn.addEventListener('click', () => {
                        this.imageCache.clear();
                        cacheCountSpan.textContent = '0';
                    });
                }
            });

            this.updateFavoriteButton();
        }

        applyLayoutSizing() {
            const container = document.getElementById('yamibo-reader-container');
            if (!container) {
                return;
            }

            const ratio = Math.min(Math.max(this.mainWidthRatio, 0.5), 0.9);
            this.mainWidthRatio = ratio;
            const sidebarRatio = 1 - ratio;
            const mainWidthPercent = (ratio * 100).toFixed(3) + '%';
            const sidebarWidthPercent = (sidebarRatio * 100).toFixed(3) + '%';
            const contentScale = (ratio / CONFIG.DEFAULT_MAIN_WIDTH_RATIO).toFixed(3);

            container.style.setProperty('--main-width', mainWidthPercent);
            container.style.setProperty('--sidebar-width', sidebarWidthPercent);
            container.style.setProperty('--content-scale', contentScale);
        }

        setupResizer() {
            const resizer = document.getElementById('reader-resizer');
            const container = document.getElementById('yamibo-reader-container');
            if (!resizer || !container) {
                return;
            }

            const handlePointerMove = (event) => {
                const rect = container.getBoundingClientRect();
                if (rect.width <= 0) {
                    return;
                }
                let ratio = (event.clientX - rect.left) / rect.width;
                ratio = Math.min(0.9, Math.max(0.5, ratio));
                this.mainWidthRatio = ratio;
                this.applyLayoutSizing();
            };

            const handlePointerUp = (event) => {
                if (event?.pointerId !== undefined) {
                    resizer.releasePointerCapture?.(event.pointerId);
                }
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
                window.removeEventListener('pointercancel', handlePointerUp);
                container.classList.remove('resizing');
                document.body.classList.remove('reader-resizing');
                const persistedRatio = Number(this.mainWidthRatio.toFixed(3));
                this.mainWidthRatio = persistedRatio;
                this.dataStore.setSetting('mainWidthRatio', persistedRatio);
            };

            resizer.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                if (event.pointerId !== undefined) {
                    resizer.setPointerCapture?.(event.pointerId);
                }
                container.classList.add('resizing');
                document.body.classList.add('reader-resizing');
                window.addEventListener('pointermove', handlePointerMove);
                window.addEventListener('pointerup', handlePointerUp);
                window.addEventListener('pointercancel', handlePointerUp);
            });
        }

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            this.dataStore.setSetting('sidebarCollapsed', this.sidebarCollapsed);
            this.applySidebarState();
        }

        applySidebarState() {
            const container = this.readerContainer || document.getElementById('yamibo-reader-container');
            if (!container) {
                return;
            }
            container.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
            const toggleBtn = document.getElementById('toggle-sidebar-btn');
            if (toggleBtn) {
                toggleBtn.innerHTML = this.sidebarCollapsed ? ICONS.chevronsLeft : ICONS.chevronsRight;
                toggleBtn.title = this.sidebarCollapsed ? '展开右侧菜单' : '收起右侧菜单';
                toggleBtn.setAttribute('aria-pressed', String(this.sidebarCollapsed));
            }
        }

        isScrollMode() {
            return this.viewMode === CONFIG.VIEW_MODES.SCROLL_DOWN ||
                this.viewMode === CONFIG.VIEW_MODES.SCROLL_LEFT ||
                this.viewMode === CONFIG.VIEW_MODES.SCROLL_RIGHT;
        }

        isHorizontalScrollMode() {
            return this.viewMode === CONFIG.VIEW_MODES.SCROLL_LEFT ||
                this.viewMode === CONFIG.VIEW_MODES.SCROLL_RIGHT;
        }

        isFlipMode() {
            return this.viewMode === CONFIG.VIEW_MODES.FLIP_LEFT_SINGLE ||
                this.viewMode === CONFIG.VIEW_MODES.FLIP_LEFT_DOUBLE ||
                this.viewMode === CONFIG.VIEW_MODES.FLIP_RIGHT_SINGLE ||
                this.viewMode === CONFIG.VIEW_MODES.FLIP_RIGHT_DOUBLE;
        }

        isFlipLeftDirection() {
            return this.viewMode === CONFIG.VIEW_MODES.FLIP_LEFT_SINGLE ||
                this.viewMode === CONFIG.VIEW_MODES.FLIP_LEFT_DOUBLE;
        }

        isFlipDouble() {
            return this.viewMode === CONFIG.VIEW_MODES.FLIP_LEFT_DOUBLE ||
                this.viewMode === CONFIG.VIEW_MODES.FLIP_RIGHT_DOUBLE;
        }

        scrollByPage(direction) {
            if (!this.isHorizontalScrollMode()) {
                return false;
            }

            const contentDiv = document.getElementById('reader-content');
            if (!contentDiv) {
                return false;
            }

            const containers = Array.from(contentDiv.querySelectorAll('.image-container'));
            if (containers.length === 0) {
                return false;
            }

            this.updateScrollCurrentPage(contentDiv);
            let targetIndex = this.currentScrollImageIndex + direction;
            targetIndex = Math.max(0, Math.min(containers.length - 1, targetIndex));
            if (targetIndex === this.currentScrollImageIndex) {
                return false;
            }

            const target = containers[targetIndex];
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
                this.currentScrollImageIndex = targetIndex;
                this.currentImageIndex = targetIndex;
                this.updateFloorIndicator();
            }

            return true;
        }

        navigateFlip(direction) {
            if (direction === 0 || !this.isFlipMode()) {
                return;
            }

            const post = this.posts[this.currentFloor];
            if (!post) {
                return;
            }

            this.lastFlipDirection = direction > 0 ? 'next' : 'prev';
            const step = this.isFlipDouble() ? 2 : 1;

            if (direction > 0) {
                if (post.images.length > 0 && this.currentImageIndex + step < post.images.length) {
                    this.currentImageIndex += step;
                    this.currentScrollImageIndex = this.currentImageIndex;
                    this.renderContent();
                } else if (this.currentFloor < this.posts.length - 1) {
                    this.currentFloor++;
                    this.currentImageIndex = 0;
                    this.currentScrollImageIndex = 0;
                    this.renderContent();
                }
            } else {
                if (this.currentImageIndex > 0) {
                    this.currentImageIndex = Math.max(0, this.currentImageIndex - step);
                    this.currentScrollImageIndex = this.currentImageIndex;
                    this.renderContent();
                } else if (this.currentFloor > 0) {
                    this.currentFloor--;
                    const prevPost = this.posts[this.currentFloor];
                    if (prevPost && prevPost.images.length > 0) {
                        const remainder = prevPost.images.length % step;
                        if (remainder === 0) {
                            this.currentImageIndex = Math.max(0, prevPost.images.length - step);
                        } else {
                            this.currentImageIndex = Math.max(0, prevPost.images.length - remainder);
                        }
                    } else {
                        this.currentImageIndex = 0;
                    }
                    this.currentScrollImageIndex = this.currentImageIndex;
                    this.renderContent();
                }
            }
        }

        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            this.dataStore.setSetting('darkMode', this.darkMode);
            document.body.classList.toggle('dark-mode', this.darkMode);

            const btn = document.getElementById('dark-mode-btn');
            btn.innerHTML = this.darkMode ? ICONS.lightMode : ICONS.darkMode;
        }

        changeViewMode(mode) {
            this.viewMode = mode;
            this.dataStore.setSetting('viewMode', mode);
            this.lastFlipDirection = 'next';

            // 重置图片索引
            this.currentImageIndex = 0;

            const contentDiv = document.getElementById('reader-content');
            contentDiv.setAttribute('data-view-mode', mode);

            this.renderContent();
        }

        async renderContent() {
            const post = this.posts[this.currentFloor];
            if (!post) return;

            const contentDiv = document.getElementById('reader-content');
            if (contentDiv) {
                contentDiv.setAttribute('data-view-mode', this.viewMode);
            }

            if (this.isFlipMode()) {
                this.teardownScrollInteractions();
                this.renderPageMode(contentDiv, post, this.isFlipDouble());
            } else {
                this.renderScrollMode(contentDiv, post);
            }

            this.preloadImages();
            this.updateFloorIndicator();
            this.dataStore.setProgress(this.parser.threadId, this.currentFloor);

            // 如果已收藏，更新阅读进度
            if (this.dataStore.isSeriesFavorited(this.seriesKey)) {
                this.dataStore.updateFavoriteChapter(this.seriesKey, {
                    seriesTitle: this.seriesTitle,
                    author: this.parser.authorName || '未知作者',
                    threadId: this.parser.threadId,
                    chapterTitle: this.parser.threadTitle,
                    url: window.location.href,
                    currentFloor: this.currentFloor + 1,
                    totalFloors: this.posts.length
                });
            }
        }

        updateFloorIndicator() {
            const post = this.posts[this.currentFloor];
            const indicator = document.getElementById('floor-indicator');

            if (this.isFlipMode()) {
                // 翻页模式显示图片索引
                if (post && post.images.length > 0) {
                    const step = this.isFlipDouble() ? 2 : 1;
                    const startIndex = this.currentImageIndex;
                    const endIndex = Math.min(startIndex + step, post.images.length);
                    indicator.textContent = `第${this.currentFloor + 1}楼 ${startIndex + 1}-${endIndex}/${post.images.length}图`;
                } else {
                    indicator.textContent = `${this.currentFloor + 1} / ${this.posts.length}`;
                }
            } else {
                // 滚动模式显示当前可视图片索引
                if (post && post.images.length > 0) {
                    const current = Math.min(this.currentScrollImageIndex + 1, post.images.length);
                    indicator.textContent = `第${this.currentFloor + 1}楼 ${current}/${post.images.length}图`;
                } else {
                    indicator.textContent = `${this.currentFloor + 1} / ${this.posts.length}`;
                }
            }
        }

        async renderScrollMode(contentDiv, post) {
            // 不清空内容，只更新图片
            const existingImages = contentDiv.querySelectorAll('.image-container');
            const existingCount = existingImages.length;

            // 如果已经有相同楼层的图片，不重新渲染
            if (existingCount === post.images.length &&
                contentDiv.dataset.floor === post.floor.toString()) {
                return;
            }

            contentDiv.innerHTML = '';
            contentDiv.dataset.floor = post.floor;
            this.currentScrollImageIndex = 0;
            this.currentImageIndex = 0;

            if (post.images.length > 0) {
                for (let index = 0; index < post.images.length; index++) {
                    const imgSrc = post.images[index];
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'image-container';

                    // 检查缓存
                    if (this.imageCache.has(imgSrc)) {
                        const cachedUrl = this.imageCache.get(imgSrc);
                        const img = document.createElement('img');
                        img.src = cachedUrl;
                        img.alt = `第 ${post.floor} 楼 - 图片 ${index + 1}`;
                        imgContainer.appendChild(img);
                    } else {
                        // 显示加载状态
                        const loader = document.createElement('div');
                        loader.className = 'image-loader';
                        loader.textContent = `加载中 ${index + 1}/${post.images.length}...`;
                        imgContainer.appendChild(loader);

                        // 加载并缓存图片
                        this.loadAndCacheImage(imgSrc, imgContainer, loader, post.floor, index + 1, post.images.length);
                    }

                    contentDiv.appendChild(imgContainer);
                }
            } else if (post.content) {
                const textContent = post.content.cloneNode(true);
                textContent.querySelectorAll('.pstatus, .psign, .pattm').forEach(el => el.remove());
                contentDiv.appendChild(textContent);
            }

            this.setupScrollInteractions(contentDiv, post);
        }

        setupScrollInteractions(contentDiv, post) {
            this.teardownScrollInteractions();

            if (!post || !Array.isArray(post.images) || post.images.length === 0) {
                this.updateFloorIndicator();
                return;
            }

            const containers = contentDiv.querySelectorAll('.image-container');
            containers.forEach((container, index) => {
                container.dataset.imageIndex = index;
            });

            this.scrollHandler = () => {
                if (this.scrollUpdateScheduled) return;
                this.scrollUpdateScheduled = true;
                requestAnimationFrame(() => {
                    this.scrollUpdateScheduled = false;
                    this.updateScrollCurrentPage(contentDiv);
                });
            };

            contentDiv.addEventListener('scroll', this.scrollHandler, { passive: true });
            this.updateScrollCurrentPage(contentDiv);
        }

        teardownScrollInteractions() {
            const contentDiv = document.getElementById('reader-content');
            if (contentDiv && this.scrollHandler) {
                contentDiv.removeEventListener('scroll', this.scrollHandler);
            }
            this.scrollHandler = null;
            this.scrollUpdateScheduled = false;
        }

        updateScrollCurrentPage(contentDiv) {
            const containers = Array.from(contentDiv.querySelectorAll('.image-container'));
            if (containers.length === 0) {
                this.currentScrollImageIndex = 0;
                this.currentImageIndex = 0;
                this.updateFloorIndicator();
                return;
            }

            const rect = contentDiv.getBoundingClientRect();
            const referenceX = rect.left + rect.width / 2;
            const referenceY = rect.top + rect.height / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            containers.forEach((container, index) => {
                const containerRect = container.getBoundingClientRect();
                const centerX = containerRect.left + containerRect.width / 2;
                const centerY = containerRect.top + containerRect.height / 2;
                const distance = this.viewMode === CONFIG.VIEW_MODES.SCROLL_DOWN
                    ? Math.abs(centerY - referenceY)
                    : Math.abs(centerX - referenceX);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            this.currentScrollImageIndex = closestIndex;
            this.currentImageIndex = closestIndex;
            this.updateFloorIndicator();
        }

        autoOpenIfRequested() {
            const raw = GM_getValue(CONFIG.AUTO_OPEN_KEY, '');
            if (!raw) {
                return;
            }

            let data = null;
            try {
                data = JSON.parse(raw);
            } catch (e) {
                console.warn('[阅读模式] 自动开启配置解析失败:', e);
            }

            GM_setValue(CONFIG.AUTO_OPEN_KEY, '');

            if (!data || !data.enabled) {
                return;
            }

            if (data.target && data.target !== this.parser.threadId) {
                return;
            }

            if (data.timestamp && Date.now() - data.timestamp > 60000) {
                return;
            }

            if (data.seriesName && typeof data.seriesName === 'string') {
                this.updateSeriesName(data.seriesName, { persistOverride: true });
            }

            setTimeout(() => {
                if (!this.isReaderMode) {
                    this.enterReaderMode();
                }
            }, 100);
        }

        async renderPageMode(contentDiv, post, isDouble) {
            // 翻页模式需要维护当前图片索引
            if (!Number.isInteger(this.currentImageIndex) || this.currentImageIndex < 0) {
                this.currentImageIndex = 0;
            }
            this.currentScrollImageIndex = this.currentImageIndex;

            // 清空内容
            contentDiv.innerHTML = '';
            contentDiv.dataset.floor = post.floor;

            if (post.images.length > 0) {
                const imagesToShow = isDouble ? 2 : 1;
                const startIndex = this.currentImageIndex;
                const endIndex = Math.min(startIndex + imagesToShow, post.images.length);

                for (let i = startIndex; i < endIndex; i++) {
                    const imgSrc = post.images[i];
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'image-container';

                    // 检查缓存
                    if (this.imageCache.has(imgSrc)) {
                        const cachedUrl = this.imageCache.get(imgSrc);
                        const img = document.createElement('img');
                        img.src = cachedUrl;
                        img.alt = `第 ${post.floor} 楼 - 图片 ${i + 1}`;
                        imgContainer.appendChild(img);
                    } else {
                        // 显示加载状态
                        const loader = document.createElement('div');
                        loader.className = 'image-loader';
                        loader.textContent = `加载中 ${i + 1}/${post.images.length}...`;
                        imgContainer.appendChild(loader);

                        // 加载并缓存图片
                        this.loadAndCacheImage(imgSrc, imgContainer, loader, post.floor, i + 1, post.images.length);
                    }

                    contentDiv.appendChild(imgContainer);
                    this.applyFlipAnimation(imgContainer);
                }
            } else if (post.content) {
                const textContent = post.content.cloneNode(true);
                textContent.querySelectorAll('.pstatus, .psign, .pattm').forEach(el => el.remove());
                contentDiv.appendChild(textContent);
            }
        }

        applyFlipAnimation(container) {
            if (!container || !this.isFlipMode()) {
                return;
            }
            const direction = this.lastFlipDirection === 'prev' ? 'prev' : 'next';
            const baseClass = direction === 'prev' ? 'flip-slide-enter-prev' : 'flip-slide-enter-next';
            container.classList.add('flip-slide-enter', baseClass);
            const cleanup = () => {
                container.classList.remove('flip-slide-enter', 'flip-slide-enter-next', 'flip-slide-enter-prev');
                container.removeEventListener('animationend', cleanup);
            };
            container.addEventListener('animationend', cleanup);
        }

        async loadAndCacheImage(imgSrc, container, loader, floor, index, total) {
            try {
                const cachedUrl = await this.imageCache.load(imgSrc);
                const img = document.createElement('img');
                img.src = cachedUrl;
                img.alt = `第 ${floor} 楼 - 图片 ${index}`;

                img.onload = () => {
                    if (loader && loader.parentNode) {
                        loader.remove();
                    }
                    container.appendChild(img);
                };

                img.onerror = () => {
                    if (loader) {
                        loader.textContent = '加载失败';
                        loader.classList.add('error');
                    }
                };
            } catch (e) {
                console.error('Failed to load image:', imgSrc, e);
                if (loader) {
                    loader.textContent = '加载失败';
                    loader.classList.add('error');
                }
            }
        }

        preloadImages() {
            // 获取预加载数量配置（按图片计数）
            const preloadCount = this.dataStore.getSetting('preloadCount', CONFIG.PRELOAD_COUNT);

            if (preloadCount === 0) {
                return;
            }

            let scheduledCount = 0;
            const totalPosts = this.posts.length;
            // 从当前楼层的下一张图片开始，逐张预加载
            for (let floorIndex = this.currentFloor; floorIndex < totalPosts && scheduledCount < preloadCount; floorIndex++) {
                const post = this.posts[floorIndex];
                if (!post || !Array.isArray(post.images) || post.images.length === 0) {
                    continue;
                }

                const startImageIndex = floorIndex === this.currentFloor ? (this.currentImageIndex || 0) + 1 : 0;
                if (startImageIndex >= post.images.length) {
                    continue;
                }

                for (let imgIndex = startImageIndex; imgIndex < post.images.length && scheduledCount < preloadCount; imgIndex++) {
                    const imgSrc = post.images[imgIndex];
                    if (!imgSrc) {
                        continue;
                    }

                    if (this.imageCache.has(imgSrc)) {
                        continue;
                    }

                    this.imageCache.load(imgSrc).then(() => {
                    }).catch(e => {
                        console.error(`[预加载] ✗ 失败: 第${floorIndex + 1}楼-第${imgIndex + 1}张`, e);
                    });

                    scheduledCount++;
                }
            }
        }

        prevFloor() {
            if (this.isHorizontalScrollMode() && this.scrollByPage(-1)) {
                return;
            }

            if (this.isFlipMode()) {
                const stepDirection = this.isFlipLeftDirection() ? 1 : -1;
                this.navigateFlip(stepDirection);
                return;
            }

            if (this.currentFloor > 0) {
                this.currentFloor--;
                this.currentImageIndex = 0;
                this.currentScrollImageIndex = 0;
                this.renderContent();
            }
        }

        nextFloor() {
            if (this.isHorizontalScrollMode() && this.scrollByPage(1)) {
                return;
            }

            if (this.isFlipMode()) {
                const stepDirection = this.isFlipLeftDirection() ? -1 : 1;
                this.navigateFlip(stepDirection);
                return;
            }

            if (this.currentFloor < this.posts.length - 1) {
                this.currentFloor++;
                this.currentImageIndex = 0;
                this.currentScrollImageIndex = 0;
                this.renderContent();
            }
        }

        goToFloor(targetFloor, targetImageIndex = 0) {
            if (!this.isReaderMode) {
                this.enterReaderMode();
            }

            if (!Array.isArray(this.posts) || this.posts.length === 0) {
                return;
            }

            const clampedFloor = Math.max(0, Math.min(this.posts.length - 1, targetFloor));
            const clampedImageIndex = Math.max(0, targetImageIndex);

            this.currentFloor = clampedFloor;
            this.currentImageIndex = clampedImageIndex;
            this.currentScrollImageIndex = clampedImageIndex;
            this.lastFlipDirection = 'next';

            this.renderContent();

            const contentDiv = document.getElementById('reader-content');
            if (contentDiv) {
                contentDiv.scrollTop = 0;
                contentDiv.scrollLeft = 0;
            }
        }

        switchTab(tabName) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });

            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `${tabName}-panel`);
            });

            if (tabName === 'comments') {
                this.loadComments();
            } else if (tabName === 'favorites') {
                this.loadFavorites();
            } else if (tabName === 'directory') {
                this.scrollDirectoryToCurrent();
            }
        }

        updateSeriesName(rawName, options = {}) {
            const { persistOverride = true } = options;
            const trimmed = typeof rawName === 'string' ? rawName.trim() : '';
            if (!trimmed) {
                return false;
            }

            const previousKey = this.seriesKey;
            const previousName = this.currentSeriesName;

            this.currentSeriesName = trimmed;
            this.seriesTitle = trimmed;
            const newKey = buildSeriesKey(trimmed) || previousKey;
            this.seriesKey = newKey;

            if (persistOverride) {
                this.dataStore.setSeriesNameOverride(this.baseSeriesKey, trimmed);
            }

            if (previousKey && previousKey !== newKey) {
                this.dataStore.renameFavoriteSeries(previousKey, newKey, trimmed);
            } else if (previousKey === newKey && previousName !== trimmed) {
                const existingFavorite = this.dataStore.getFavorite(newKey);
                if (existingFavorite) {
                    existingFavorite.seriesTitle = trimmed;
                    this.dataStore.save();
                }
            }

            const searchInput = document.getElementById('series-search');
            if (searchInput && searchInput.value.trim() !== trimmed) {
                searchInput.value = trimmed;
            }

            this.updateFavoriteButton();
            this.updateFavoriteDirectoryCountDisplay();

            const favPanel = document.getElementById('favorites-panel');
            if (favPanel && favPanel.classList.contains('active')) {
                this.loadFavorites();
            }

            return previousKey !== newKey || previousName !== trimmed;
        }

        toggleFavorite() {
            const isFavorited = this.dataStore.isSeriesFavorited(this.seriesKey);

            if (isFavorited) {
                this.dataStore.removeFavorite(this.seriesKey);
            } else {
                this.dataStore.addOrUpdateFavorite(this.seriesKey, {
                    seriesTitle: this.seriesTitle,
                    author: this.parser.authorName || '未知作者',
                    threadId: this.parser.threadId,
                    chapterTitle: this.parser.threadTitle,
                    url: window.location.href,
                    currentFloor: this.currentFloor + 1,
                    totalFloors: this.posts.length,
                    directoryCount: typeof this.currentDirectoryCount === 'number' && this.currentDirectoryCount >= 0
                        ? Math.floor(this.currentDirectoryCount)
                        : this.dataStore.getSeriesDirectoryCount(this.seriesKey)
                });
            }

            this.updateFavoriteButton();
            // 刷新收藏列表（如果正在显示）
            const favPanel = document.getElementById('favorites-panel');
            if (favPanel && favPanel.classList.contains('active')) {
                this.loadFavorites();
            }
        }

        updateFavoriteButton() {
            const btn = document.getElementById('favorite-btn');
            if (btn) {
                const isFavorited = this.dataStore.isSeriesFavorited(this.seriesKey);
                btn.innerHTML = isFavorited ? ICONS.bookmarkFilled : ICONS.bookmark;
                btn.classList.toggle('favorited', isFavorited);
                btn.title = isFavorited ? '取消收藏' : '收藏';
            }
        }

        showDataTransferDialog() {
            const existingOverlay = document.getElementById('data-transfer-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            const overlay = document.createElement('div');
            overlay.id = 'data-transfer-overlay';
            overlay.className = 'data-transfer-overlay';
            overlay.innerHTML = `
                <div class="data-transfer-dialog">
                    <div class="data-transfer-header">
                        <h3>数据导入 / 导出</h3>
                        <button type="button" class="data-transfer-close" title="关闭">${ICONS.close}</button>
                    </div>
                    <div class="data-transfer-body">
                        <textarea id="data-transfer-textarea" spellcheck="false"></textarea>
                        <div class="data-transfer-desc">包含收藏、阅读设置与阅读进度。打开时会展示当前保存的数据。</div>
                    </div>
                    <div class="data-transfer-footer">
                        <button type="button" class="data-transfer-btn primary" id="data-transfer-save">保存</button>
                        <button type="button" class="data-transfer-btn secondary" id="data-transfer-cancel">关闭</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const dialog = overlay.querySelector('.data-transfer-dialog');
            const textarea = overlay.querySelector('#data-transfer-textarea');
            const saveBtn = overlay.querySelector('#data-transfer-save');
            const cancelBtn = overlay.querySelector('#data-transfer-cancel');
            const closeBtn = overlay.querySelector('.data-transfer-close');

            let handleKeydown = null;
            const closeDialog = () => {
                if (handleKeydown) {
                    document.removeEventListener('keydown', handleKeydown);
                }
                if (overlay && overlay.parentNode) {
                    overlay.remove();
                }
            };

            handleKeydown = (event) => {
                if (event.key === 'Escape') {
                    closeDialog();
                }
            };
            document.addEventListener('keydown', handleKeydown);

            if (textarea) {
                textarea.value = this.dataStore.exportData(true);
                textarea.focus();
                textarea.select();
            }

            if (saveBtn && textarea) {
                saveBtn.addEventListener('click', () => {
                    const raw = textarea.value.trim();
                    if (!raw) {
                        alert('请先填写 JSON 数据');
                        textarea.focus();
                        return;
                    }
                    try {
                        this.dataStore.importData(raw);
                        this.applySettingsFromStore();
                        textarea.value = this.dataStore.exportData(true);
                        alert('数据已保存！');
                    } catch (err) {
                        console.error('导入失败', err);
                        alert(`导入失败: ${err.message || err}`);
                    }
                });
            }

            const registerClose = (element) => {
                if (!element) {
                    return;
                }
                element.addEventListener('click', () => {
                    closeDialog();
                });
            };

            registerClose(cancelBtn);
            registerClose(closeBtn);

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    closeDialog();
                }
            });

            if (dialog) {
                dialog.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
            }
        }

        applySettingsFromStore() {
            const storedPreload = parseInt(this.dataStore.getSetting('preloadCount', CONFIG.PRELOAD_COUNT), 10);
            if (Number.isFinite(storedPreload)) {
                CONFIG.PRELOAD_COUNT = storedPreload;
            }

            this.darkMode = this.dataStore.getSetting('darkMode', false);
            document.body.classList.toggle('dark-mode', this.darkMode);
            const darkModeBtn = document.getElementById('dark-mode-btn');
            if (darkModeBtn) {
                darkModeBtn.innerHTML = this.darkMode ? ICONS.lightMode : ICONS.darkMode;
            }

            let importedViewMode = this.dataStore.getSetting('viewMode', CONFIG.VIEW_MODES.SCROLL_DOWN);
            importedViewMode = LEGACY_VIEW_MODE_MAP[importedViewMode] || importedViewMode;
            if (!ALL_VIEW_MODES.has(importedViewMode)) {
                importedViewMode = CONFIG.VIEW_MODES.SCROLL_DOWN;
            }
            this.viewMode = importedViewMode;

            const ratioSetting = Number(this.dataStore.getSetting('mainWidthRatio', this.mainWidthRatio));
            if (Number.isFinite(ratioSetting)) {
                this.mainWidthRatio = Math.min(Math.max(ratioSetting, 0.5), 0.9);
                this.applyLayoutSizing();
            }

            this.applyFloatingButtonPosition();
            this.updateFavoriteButton();
            this.syncMenuSettingControls();
            this.sidebarCollapsed = !!this.dataStore.getSetting('sidebarCollapsed', this.sidebarCollapsed);
            this.applySidebarState();

            if (this.isReaderMode) {
                const contentDiv = document.getElementById('reader-content');
                if (contentDiv) {
                    contentDiv.setAttribute('data-view-mode', this.viewMode);
                }
                this.renderContent();
                this.scrollDirectoryToCurrent();
                const favPanel = document.getElementById('favorites-panel');
                if (favPanel && favPanel.classList.contains('active')) {
                    this.loadFavorites();
                }
            }
        }

        syncMenuSettingControls() {
            const slider = document.getElementById('menu-preload-slider');
            const sliderValue = document.getElementById('menu-preload-value');
            const cacheCountSpan = document.getElementById('menu-cache-count');
            const perPageInput = document.getElementById('menu-search-per-page');

            const currentPreload = this.dataStore.getSetting('preloadCount', CONFIG.PRELOAD_COUNT);
            if (slider) {
                slider.value = currentPreload;
            }
            if (sliderValue) {
                sliderValue.textContent = currentPreload;
            }
            if (cacheCountSpan) {
                cacheCountSpan.textContent = this.imageCache.cache.size;
            }
            if (perPageInput) {
                perPageInput.value = this.getSearchResultsPerPage();
            }
        }

        getViewModeName(mode) {
            const names = {
                [CONFIG.VIEW_MODES.SCROLL_DOWN]: '滑动-下',
                [CONFIG.VIEW_MODES.SCROLL_LEFT]: '滑动-左',
                [CONFIG.VIEW_MODES.SCROLL_RIGHT]: '滑动-右',
                [CONFIG.VIEW_MODES.FLIP_LEFT_SINGLE]: '翻页-左-单页',
                [CONFIG.VIEW_MODES.FLIP_LEFT_DOUBLE]: '翻页-左-双页',
                [CONFIG.VIEW_MODES.FLIP_RIGHT_SINGLE]: '翻页-右-单页',
                [CONFIG.VIEW_MODES.FLIP_RIGHT_DOUBLE]: '翻页-右-双页'
            };
            return names[mode] || mode;
        }

        extractThreadIdFromUrl(url) {
            if (!url) return null;
            let match = url.match(/thread-(\d+)-/);
            if (match) {
                return match[1];
            }
            match = url.match(/[?&]tid=(\d+)/);
            return match ? match[1] : null;
        }

        handleDirectoryNavigation(event, anchor) {
            event.preventDefault();
            const url = anchor.href;
            const targetThreadId = anchor.dataset.threadId || this.extractThreadIdFromUrl(url);

            if (!url) {
                return;
            }

            if (!targetThreadId) {
                window.location.href = url;
                return;
            }

            if (targetThreadId === this.parser.threadId) {
                return;
            }

            this.scheduleAutoOpen(targetThreadId);
            window.location.href = url;
        }

        scheduleAutoOpen(targetThreadId) {
            const payload = {
                enabled: true,
                target: targetThreadId,
                timestamp: Date.now(),
                seriesName: this.currentSeriesName
            };
            GM_setValue(CONFIG.AUTO_OPEN_KEY, JSON.stringify(payload));
        }

        loadDirectory() {
            this.searchDirectory();
        }

        getSearchResultsPerPage() {
            const storedValue = this.dataStore.getSetting('searchResultsPerPage', CONFIG.SEARCH_RESULTS_PER_PAGE_DEFAULT);
            const normalized = normalizeSearchResultsPerPageValue(storedValue);
            if (normalized !== storedValue) {
                this.dataStore.setSetting('searchResultsPerPage', normalized);
            }
            return normalized;
        }

        searchDirectory() {
            console.log('[搜索] ===== 开始搜索合集 =====');
            const searchInput = document.getElementById('series-search');
            const query = searchInput ? searchInput.value.trim() : '';
            console.log('[搜索] 搜索关键词:', query);

            if (!query) {
                console.log('[搜索] 错误: 搜索关键词为空');
                this.showDirectoryError('请输入搜索关键词');
                return;
            }

            this.updateSeriesName(query, { persistOverride: true });

            const perPageSetting = this.getSearchResultsPerPage();
            this.setDirectoryLoadingMessage(`搜索中... (每页${perPageSetting}条)`);

            // Discuz 搜索需要先GET获取formhash
            console.log('[搜索] 第一步: 获取搜索页面formhash');
            const searchPageUrl = 'https://bbs.yamibo.com/search.php?mod=forum';

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchPageUrl,
                onload: (response) => {
                    console.log('[搜索] 获取搜索页面成功，状态码:', response.status);

                    // 提取formhash
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const formhashInput = doc.querySelector('input[name="formhash"]');
                    const formhash = formhashInput ? formhashInput.value : '';
                    console.log('[搜索] 提取到formhash:', formhash);

                    // 直接使用GET方式搜索（更可靠）
                    const finalSearchUrl = `https://bbs.yamibo.com/search.php?mod=forum&srchtxt=${encodeURIComponent(query)}&formhash=${formhash}&searchsubmit=yes`;
                    console.log('[搜索] 第二步: 执行搜索请求');
                    console.log('[搜索] 请求URL:', finalSearchUrl);

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: finalSearchUrl,
                        onload: (searchResponse) => {
                            console.log('[搜索] 搜索请求完成! 状态码:', searchResponse.status);
                            console.log('[搜索] 最终URL:', searchResponse.finalUrl);
                            console.log('[搜索] 响应内容长度:', searchResponse.responseText.length);

                            // 检查是否是错误页面
                            if (searchResponse.responseText.includes('System Error') ||
                                searchResponse.responseText.includes('搜索无结果')) {
                                console.log('[搜索] 错误: 搜索返回错误页面或无结果');
                                this.showDirectoryError('搜索失败，请稍后重试');
                                return;
                            }

                            this.handleSearchResponse(searchResponse, perPageSetting);
                        },
                        onerror: (error) => {
                            console.error('[搜索] 搜索请求失败:', error);
                            this.showDirectoryError('搜索失败，10秒后自动重试');
                            this.scheduleRetry();
                        }
                    });
                },
                onerror: (error) => {
                    console.error('[搜索] 获取搜索页面失败:', error);
                    this.showDirectoryError('搜索失败，10秒后自动重试');
                    this.scheduleRetry();
                }
            });
        }

        handleSearchResponse(searchResponse, perPageSetting) {
            const aggregatedEntries = [];
            const seenKeys = new Set();
            const normalizedUrl = this.buildSearchPageUrl(searchResponse?.finalUrl, 1, perPageSetting);

            if (normalizedUrl) {
                this.fetchFirstPageAndContinue({
                    url: normalizedUrl,
                    perPage: perPageSetting,
                    aggregatedEntries,
                    seenKeys
                });
                return;
            }

            console.log('[搜索] 未能构造分页URL，直接使用初始响应渲染');
            this.processSearchPageHtml(searchResponse.responseText, normalizedUrl, perPageSetting, aggregatedEntries, seenKeys);
        }

        fetchFirstPageAndContinue({ url, perPage, aggregatedEntries, seenKeys }) {
            this.setDirectoryLoadingMessage('搜索中... (第1页)');
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (resp) => {
                    console.log('[搜索] 第 1 页重新获取成功，状态码:', resp.status);
                    this.processSearchPageHtml(resp.responseText, url, perPage, aggregatedEntries, seenKeys);
                },
                onerror: (error) => {
                    console.error('[搜索] 重新获取第 1 页失败:', error);
                    this.showDirectoryError('搜索失败，请稍后重试');
                }
            });
        }

        processSearchPageHtml(html, baseUrl, perPage, aggregatedEntries, seenKeys) {
            const firstPageEntries = this.extractSearchEntriesFromHtml(html);
            const firstPageCount = this.appendDirectoryEntries(firstPageEntries, aggregatedEntries, seenKeys);
            console.log(`[搜索] 第 1 页解析完成，条目数: ${firstPageCount}`);

            if (!baseUrl) {
                console.log('[搜索] 未能构造有效的分页URL，直接渲染当前结果');
                this.renderDirectoryEntries(aggregatedEntries);
                return;
            }

            if (firstPageCount < perPage) {
                this.renderDirectoryEntries(aggregatedEntries);
                return;
            }

            this.fetchAdditionalSearchPages({
                baseUrl,
                nextPage: 2,
                perPage,
                aggregatedEntries,
                seenKeys
            });
        }

        fetchAdditionalSearchPages({ baseUrl, nextPage, perPage, aggregatedEntries, seenKeys }) {
            if (nextPage > CONFIG.MAX_SEARCH_PAGES) {
                console.log(`[搜索] 已达到最大翻页数量 ${CONFIG.MAX_SEARCH_PAGES}，停止继续请求`);
                this.renderDirectoryEntries(aggregatedEntries);
                return;
            }

            const nextUrl = this.buildSearchPageUrl(baseUrl, nextPage, perPage);
            if (!nextUrl) {
                console.log('[搜索] 无法构造下一页URL，停止继续请求');
                this.renderDirectoryEntries(aggregatedEntries);
                return;
            }

            this.setDirectoryLoadingMessage(`搜索中... (第${nextPage}页)`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: nextUrl,
                onload: (resp) => {
                    console.log(`[搜索] 第 ${nextPage} 页请求完成，状态码:`, resp.status);
                    const pageEntries = this.extractSearchEntriesFromHtml(resp.responseText);
                    const pageCount = this.appendDirectoryEntries(pageEntries, aggregatedEntries, seenKeys);
                    if (pageCount < perPage) {
                        this.renderDirectoryEntries(aggregatedEntries);
                    } else {
                        this.fetchAdditionalSearchPages({
                            baseUrl,
                            nextPage: nextPage + 1,
                            perPage,
                            aggregatedEntries,
                            seenKeys
                        });
                    }
                },
                onerror: (error) => {
                    console.error(`[搜索] 第 ${nextPage} 页请求失败:`, error);
                    this.renderDirectoryEntries(aggregatedEntries);
                }
            });
        }

        buildSearchPageUrl(baseUrl, pageNumber, perPage) {
            if (!baseUrl) {
                return '';
            }
            let urlObj;
            try {
                urlObj = new URL(baseUrl);
            } catch (err) {
                try {
                    urlObj = new URL(baseUrl, 'https://bbs.yamibo.com/');
                } catch (error) {
                    console.error('[搜索] 无法解析搜索URL:', baseUrl, error);
                    return '';
                }
            }
            if (pageNumber !== undefined && pageNumber !== null) {
                urlObj.searchParams.set('page', String(pageNumber));
            }
            if (perPage) {
                urlObj.searchParams.set('perpage', String(perPage));
            }
            return urlObj.toString();
        }


        appendDirectoryEntries(entries, aggregatedEntries, seenKeys) {
            if (!Array.isArray(entries) || entries.length === 0) {
                return 0;
            }
            entries.forEach(entry => {
                const key = entry.threadId ? `tid:${entry.threadId}` : (entry.url ? `url:${entry.url}` : '');
                if (key && seenKeys.has(key)) {
                    return;
                }
                if (key) {
                    seenKeys.add(key);
                }
                aggregatedEntries.push(entry);
            });
            return entries.length;
        }

        extractSearchEntriesFromHtml(html) {
            console.log('[解析] ===== 开始解析搜索结果 =====');
            const entries = [];
            if (!html) {
                return entries;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const selectors = [
                'tbody[id^="normalthread_"]',
                '#threadlist tbody',
                'table.tbopt tbody[id^="normalthread_"]',
                '.tl tbody',
                '.pbw .xl.xl2.o.cl li',
                '.pbw .xl.xl2 li',
                '.threadlist li',
                '#threadlist li',
                'li.pbw'
            ];

            let results = [];
            let usedSelector = '';
            for (const selector of selectors) {
                results = doc.querySelectorAll(selector);
                if (results.length > 0) {
                    usedSelector = selector;
                    console.log(`[解析] 使用选择器 "${selector}" 找到 ${results.length} 个结果`);
                    break;
                }
            }

            if (results.length === 0) {
                results = doc.querySelectorAll('a.s.xst, a.xst');
                usedSelector = 'a.s.xst, a.xst';
                console.log(`[解析] 使用兜底选择器 "${usedSelector}" 找到 ${results.length} 个链接`);
            }

            const linkSelector = 'a.s.xst, a.xst, a[href*="thread-"], a[href*="viewthread"]';

            results.forEach((item, index) => {
                let link = null;
                if (item.tagName === 'TBODY' || item.tagName === 'LI') {
                    link = item.querySelector(linkSelector);
                } else if (item.tagName === 'A') {
                    link = item;
                }

                if (!link) {
                    return;
                }

                const title = link.textContent.trim();
                const href = link.getAttribute('href');
                const isThreadLink = !!href && (/thread-\d+-/.test(href) || href.includes('mod=viewthread'));

                if (!href || !title || !isThreadLink) {
                    console.log(`[解析] 跳过第 ${index + 1} 个结果: href=${href}, title=${title}`);
                    return;
                }

                const sanitizedHref = href.replace(/^\/+/, '');
                const fullUrl = href.startsWith('http') ? href : `https://bbs.yamibo.com/${sanitizedHref}`;
                const threadId = this.extractThreadIdFromUrl(fullUrl);

                entries.push({
                    title,
                    url: fullUrl,
                    threadId
                });
            });

            console.log(`[解析] 原始页面共解析到 ${entries.length} 个项目`);
            return entries;
        }

        renderDirectoryEntries(entries) {
            const listDiv = document.getElementById('directory-list');
            if (!listDiv) {
                return;
            }

            if (!entries || entries.length === 0) {
                console.log('[解析] 未找到任何有效搜索结果');
                this.showDirectoryError('未找到相关内容');
                return;
            }

            listDiv.innerHTML = '';
            let foundCount = 0;

            entries.forEach(entry => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'directory-item';
                if (entry.threadId && entry.threadId === this.parser.threadId) {
                    itemDiv.classList.add('current');
                }

                const anchor = document.createElement('a');
                anchor.href = entry.url;
                anchor.textContent = entry.title;
                if (entry.threadId) {
                    anchor.dataset.threadId = entry.threadId;
                }
                anchor.addEventListener('click', (event) => this.handleDirectoryNavigation(event, anchor));
                itemDiv.appendChild(anchor);
                listDiv.appendChild(itemDiv);
                foundCount++;
            });

            console.log(`[解析] 解析完成，共找到 ${foundCount} 个有效结果`);
            this.currentDirectoryCount = foundCount;
            this.updateFavoriteDirectoryCountDisplay();
            if (this.dataStore.isSeriesFavorited(this.seriesKey)) {
                this.dataStore.updateSeriesDirectoryCount(this.seriesKey, foundCount);
            }
            requestAnimationFrame(() => this.scrollDirectoryToCurrent());
        }

        setDirectoryLoadingMessage(text) {
            const listDiv = document.getElementById('directory-list');
            if (listDiv) {
                listDiv.innerHTML = `<div class="loading">${text}</div>`;
            }
            this.currentDirectoryCount = null;
            this.updateFavoriteDirectoryCountDisplay();
        }

        scrollDirectoryToCurrent() {
            const listDiv = document.getElementById('directory-list');
            if (!listDiv) {
                return;
            }
            const currentItem = listDiv.querySelector('.directory-item.current');
            if (!currentItem) {
                return;
            }
            const targetScroll = currentItem.offsetTop - Math.max(0, (listDiv.clientHeight - currentItem.offsetHeight) / 2);
            listDiv.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }

        showDirectoryError(message) {
            const listDiv = document.getElementById('directory-list');
            listDiv.innerHTML = `<div class="error">${message}</div>`;
            this.currentDirectoryCount = null;
            this.updateFavoriteDirectoryCountDisplay();
        }

        scheduleRetry() {
            if (this.searchRetryTimer) {
                clearTimeout(this.searchRetryTimer);
            }

            this.searchRetryTimer = setTimeout(() => {
                this.searchDirectory();
            }, CONFIG.SEARCH_RETRY_DELAY);
        }

        loadComments() {
            const commentsDiv = document.getElementById('comments-list');
            const allPosts = document.querySelectorAll('#postlist > div[id^="post_"]');
            const comments = [];

            allPosts.forEach((postEl) => {
                const authorLink = postEl.querySelector('.favatar .authi a');
                if (authorLink) {
                    const href = authorLink.getAttribute('href');
                    let match = href.match(/uid=(\d+)/);
                    if (!match) {
                        match = href.match(/uid-(\d+)/);
                    }

                    if (match && match[1] !== this.parser.authorUid) {
                        const author = authorLink.textContent.trim();
                        const content = postEl.querySelector('.t_f, .pcb');
                        const floorNum = this.parser.getFloorNumber(postEl);
                        const timeEl = postEl.querySelector('.pti .authi em');

                        comments.push({
                            floor: floorNum,
                            author,
                            content: content ? content.innerHTML : '',
                            time: timeEl ? timeEl.textContent : ''
                        });
                    }
                }
            });

            if (comments.length === 0) {
                commentsDiv.innerHTML = '<div class="no-comments">暂无评论</div>';
                return;
            }

            commentsDiv.innerHTML = '';
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-floor">#${comment.floor}</span>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                `;
                commentsDiv.appendChild(commentDiv);
            });
        }

        updateFavoriteDirectoryCountDisplay() {
            const selector = `.favorite-count[data-series-key="${this.seriesKey}"]`;
            const stored = this.dataStore.getSeriesDirectoryCount
                ? this.dataStore.getSeriesDirectoryCount(this.seriesKey)
                : 0;
            const normalizedStored = Number.isFinite(stored) && stored >= 0 ? Math.floor(stored) : 0;
            const hasCurrent = typeof this.currentDirectoryCount === 'number' && this.currentDirectoryCount >= 0;
            const normalizedCurrent = hasCurrent ? Math.floor(this.currentDirectoryCount) : null;
            const displayCount = normalizedCurrent !== null ? normalizedCurrent : normalizedStored;
            document.querySelectorAll(selector).forEach(span => {
                span.textContent = `收录章节: ${displayCount} 篇`;
            });
        }

        loadFavorites() {
            const favoritesDiv = document.getElementById('favorites-list');
            const favorites = this.dataStore.getAllFavorites();

            favoritesDiv.innerHTML = '';

            if (favorites.length === 0) {
                favoritesDiv.innerHTML = '<div class="empty-message">暂无收藏</div>';
                return;
            }

            // 按最后访问时间排序
            favorites.sort((a, b) => (b.lastVisited || 0) - (a.lastVisited || 0));

            favorites.forEach(fav => {
                const favItem = document.createElement('div');
                favItem.className = 'favorite-item';

                const isCurrentSeries = fav.seriesKey === this.seriesKey;
                if (isCurrentSeries) {
                    favItem.classList.add('current');
                }

                const seriesTitle = fav.seriesTitle || '未命名合集';
                const latestTitle = fav.latestTitle || '未记录章节';
                const latestUrl = fav.latestUrl || '';
                const latestThreadId = fav.latestThreadId || '';
                const latestFloor = fav.latestFloor || 0;
                const latestTotalFloors = fav.latestTotalFloors || 0;
                const storedChapterCount = fav.chapters ? Object.keys(fav.chapters).length : 0;
                const storedDirectoryCountRaw = Number(fav.directoryCount);
                const normalizedStoredDirectoryCount = Number.isFinite(storedDirectoryCountRaw) && storedDirectoryCountRaw >= 0
                    ? Math.floor(storedDirectoryCountRaw)
                    : Math.max(0, storedChapterCount);
                const hasCurrentDirectoryCount = fav.seriesKey === this.seriesKey && typeof this.currentDirectoryCount === 'number' && this.currentDirectoryCount >= 0;
                const currentSeriesDirectoryCount = hasCurrentDirectoryCount ? Math.floor(this.currentDirectoryCount) : null;
                const directoryCount = hasCurrentDirectoryCount
                    ? currentSeriesDirectoryCount
                    : normalizedStoredDirectoryCount;

                let timeStr = '未访问';
                if (fav.lastVisited) {
                    const date = new Date(fav.lastVisited);
                    const now = new Date();
                    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

                    if (diffDays === 0) {
                        timeStr = '今天';
                    } else if (diffDays === 1) {
                        timeStr = '昨天';
                    } else if (diffDays < 7) {
                        timeStr = `${diffDays}天前`;
                    } else {
                        timeStr = date.toLocaleDateString();
                    }
                }

                let progressText = '未开始';
                if (latestFloor > 0 && latestTotalFloors > 0) {
                    progressText = `第${latestFloor}/${latestTotalFloors}楼`;
                } else if (latestFloor > 0) {
                    progressText = `第${latestFloor}楼`;
                }

                const authorText = fav.author ? `<span class="favorite-author">作者: ${fav.author}</span>` : '';
                const displayDirectoryCount = Number.isFinite(directoryCount) && directoryCount >= 0 ? directoryCount : 0;
                const chapterCountText = `<span class="favorite-count" data-series-key="${fav.seriesKey}">收录章节: ${displayDirectoryCount} 篇</span>`;
                const continueDisabled = !latestUrl;
                const continueTitle = continueDisabled ? '暂无可继续的章节' : '继续阅读';
                const seriesTitleHtml = continueDisabled
                    ? `<span class="favorite-title">${seriesTitle}</span>`
                    : `<a href="${latestUrl}" target="_blank" class="favorite-title">${seriesTitle}</a>`;
                const latestLink = latestUrl
                    ? `<a href="${latestUrl}" target="_blank">${latestTitle}</a>`
                    : `<span class="favorite-latest-text">${latestTitle}</span>`;

                favItem.innerHTML = `
                    <div class="favorite-header">
                        <div class="favorite-title-line">
                            ${seriesTitleHtml}
                            ${authorText}
                        </div>
                        ${chapterCountText}
                    </div>
                    <div class="favorite-meta">
                        <div class="favorite-latest">上次阅读: ${latestLink}</div>
                        <div class="favorite-progress">进度: ${progressText}</div>
                        <div class="favorite-time">最近阅读: ${timeStr}</div>
                    </div>
                    <div class="favorite-actions">
                        <button class="favorite-action-btn" data-action="continue" data-series-key="${fav.seriesKey}" data-thread-id="${latestThreadId}" data-floor="${latestFloor}" data-url="${latestUrl}" title="${continueTitle}" ${continueDisabled ? 'disabled' : ''}>
                            ${ICONS.play || '▶'}
                        </button>
                        <button class="favorite-action-btn" data-action="remove" data-series-key="${fav.seriesKey}" title="取消收藏">
                            ${ICONS.delete || '🗑'}
                        </button>
                    </div>
                `;

                favoritesDiv.appendChild(favItem);
            });

            favoritesDiv.querySelectorAll('.favorite-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const action = btn.dataset.action;
                    const seriesKey = btn.dataset.seriesKey;
                    const threadId = btn.dataset.threadId;
                    const floor = parseInt(btn.dataset.floor || '0', 10) || 0;
                    const targetUrl = btn.dataset.url;

                    if (action === 'continue') {
                        const fav = favorites.find(f => f.seriesKey === seriesKey);
                        if (fav) {
                            if (threadId && threadId === this.parser.threadId) {
                                if (floor > 0) {
                                    this.goToFloor(Math.max(0, floor - 1));
                                }
                            } else if (targetUrl) {
                                window.open(targetUrl, '_blank');
                            }
                        }
                    } else if (action === 'remove') {
                        if (confirm('确定要取消收藏吗？')) {
                            this.dataStore.removeFavorite(seriesKey);
                            this.loadFavorites();

                            if (seriesKey === this.seriesKey) {
                                this.updateFavoriteButton();
                            }
                        }
                    }
                });
            });

            this.updateFavoriteDirectoryCountDisplay();
        }
    }

    // =========================
    // Material Design 样式
    // =========================
    GM_addStyle(`
        :root {
            --primary-color: #4caf50;
            --primary-dark: #388e3c;
            --primary-light: #81c784;
            --accent-color: #66bb6a;
            --background: #fafafa;
            --surface: #ffffff;
            --error: #f44336;
            --text-primary: rgba(0,0,0,0.87);
            --text-secondary: rgba(0,0,0,0.6);
            --divider: rgba(0,0,0,0.12);
            --shadow-1: 0 2px 4px rgba(0,0,0,0.1);
            --shadow-2: 0 4px 8px rgba(0,0,0,0.12);
            --shadow-3: 0 8px 16px rgba(0,0,0,0.15);
        }

        body.dark-mode {
            --primary-color: #66bb6a;
            --primary-dark: #4caf50;
            --primary-light: #81c784;
            --accent-color: #81c784;
            --background: #121212;
            --surface: #1e1e1e;
            --error: #cf6679;
            --text-primary: rgba(255,255,255,0.87);
            --text-secondary: rgba(255,255,255,0.6);
            --divider: rgba(255,255,255,0.12);
        }

        #yamibo-reader-btn {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow-3);
            z-index: 99999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            touch-action: none;
        }

        #yamibo-reader-btn svg {
            width: 28px;
            height: 28px;
        }

        #yamibo-reader-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 12px 24px rgba(76,175,80,0.3);
        }

        #yamibo-reader-btn.edge-left,
        #yamibo-reader-btn.edge-right {
            opacity: 0.4;
        }

        #yamibo-reader-btn.edge-left {
            clip-path: inset(0 0 0 50%);
        }

        #yamibo-reader-btn.edge-right {
            clip-path: inset(0 50% 0 0);
        }

        #yamibo-reader-btn.edge-left.edge-expanded,
        #yamibo-reader-btn.edge-right.edge-expanded {
            clip-path: none;
            opacity: 1;
        }

        body.yamibo-reader-active > *:not(#yamibo-reader-container):not(#yamibo-reader-btn):not(#data-transfer-overlay) {
            display: none !important;
        }

        #yamibo-reader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background);
            color: var(--text-primary);
            z-index: 99998;
            display: flex;
            --main-width: 70%;
            --sidebar-width: 30%;
            --content-scale: 1.133;
            --toolbar-height: 44px;
        }

        .reader-main {
            flex: 0 0 var(--main-width);
            width: var(--main-width);
            height: 100%;
            display: flex;
            flex-direction: column;
            background: var(--surface);
            overflow: hidden;
        }

        .reader-main-inner {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .reader-content-wrapper {
            flex: 1;
            display: flex;
            position: relative;
            overflow: hidden;
            min-width: 0;
            min-height: 0;
        }

        .reader-content-wrapper .reader-content {
            flex: 1;
            width: calc(100% / var(--content-scale));
            height: calc(100% / var(--content-scale));
            transform: scale(var(--content-scale));
            transform-origin: left top;
            min-width: 0;
            min-height: 0;
        }

        .reader-resizer {
            flex: 0 0 6px;
            width: 6px;
            background: var(--divider);
            cursor: col-resize;
            position: relative;
            z-index: 12;
            transition: background 0.2s ease;
            touch-action: none;
        }

        .reader-resizer::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2px;
            height: 40px;
            background: var(--text-secondary);
            border-radius: 1px;
            opacity: 0.6;
        }

        #yamibo-reader-container.resizing .reader-resizer,
        .reader-resizer:hover {
            background: var(--primary-light);
        }

        body.reader-resizing {
            user-select: none;
            cursor: col-resize;
        }

        body.reader-btn-dragging {
            cursor: move !important;
        }

        .reader-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: var(--surface);
            border-bottom: 1px solid var(--divider);
            box-shadow: var(--shadow-1);
            min-height: var(--toolbar-height);
        }

        .toolbar-left, .toolbar-right {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .toolbar-center {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .icon-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: var(--surface);
            color: var(--text-primary);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: var(--shadow-1);
        }

        .icon-btn:hover {
            background: var(--divider);
            box-shadow: var(--shadow-2);
        }

        .icon-btn svg {
            width: 18px;
            height: 18px;
        }

        .icon-btn.favorited {
            color: var(--primary-color);
        }

        .reader-content {
            flex: none;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            display: flex;
            gap: 20px;
        }

        .reader-content[data-view-mode="scroll-down"] {
            flex-direction: column;
            align-items: center;
        }

        .reader-content[data-view-mode="scroll-right"] {
            flex-direction: row;
            align-items: flex-start;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
        }

        .reader-content.reader-content-hover {
            cursor: pointer;
        }

        .reader-content.cursor-left {
            cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2NCcgaGVpZ2h0PSc2NCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJz48cGF0aCBmaWxsPScjNGNhZjUwJyBmaWxsLW9wYWNpdHk9JzAuOCcgZD0nTTE1LjQxIDcuNDFMMTQgNmwtNiA2IDYgNiAxLjQxLTEuNDFMMTAuODMgMTJ6Jy8+PC9zdmc+') 16 32, pointer;
        }

        .reader-content.cursor-right {
            cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2NCcgaGVpZ2h0PSc2NCcgdmlld0JveD0nMCAwIDI0IDI0JyBmaWxsPSdub25lJz48cGF0aCBmaWxsPScjNGNhZjUwJyBmaWxsLW9wYWNpdHk9JzAuOCcgZD0nTTEwIDZMOC41OSA3LjQxIDEzLjE3IDEybC00LjU4IDQuNTlMMTAgMThsNi02eicvPjwvc3ZnPg==') 48 32, pointer;
        }

        .image-container.flip-slide-enter {
            will-change: opacity, filter;
            animation-duration: 0.32s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            animation-fill-mode: both;
        }

        .image-container.flip-slide-enter-next {
            animation-name: flip-slide-next;
        }

        .image-container.flip-slide-enter-prev {
            animation-name: flip-slide-prev;
        }

        @keyframes flip-slide-next {
            0% {
                opacity: 0;
                filter: brightness(0.75);
            }
            60% {
                opacity: 1;
                filter: brightness(0.92);
            }
            100% {
                opacity: 1;
                filter: brightness(1);
            }
        }

        @keyframes flip-slide-prev {
            0% {
                opacity: 0;
                filter: brightness(0.75);
            }
            60% {
                opacity: 1;
                filter: brightness(0.92);
            }
            100% {
                opacity: 1;
                filter: brightness(1);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .image-container.flip-slide-enter {
                animation: none !important;
            }
        }

        .reader-content[data-view-mode="scroll-left"] {
            flex-direction: row-reverse;
            align-items: flex-start;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
        }

        .reader-content[data-view-mode="flip-left-single"],
        .reader-content[data-view-mode="flip-right-single"] {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12px 0;
        }

        .reader-content[data-view-mode="flip-left-double"],
        .reader-content[data-view-mode="flip-right-double"] {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            gap: 12px;
        }

        .reader-content[data-view-mode="flip-left-double"] {
            flex-direction: row-reverse;
        }

        .image-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .reader-content[data-view-mode="scroll-down"] .image-container,
        .reader-content[data-view-mode="flip-left-single"] .image-container,
        .reader-content[data-view-mode="flip-right-single"] .image-container {
            width: 100%;
        }

        .reader-content[data-view-mode="scroll-right"] .image-container,
        .reader-content[data-view-mode="scroll-left"] .image-container {
            flex-shrink: 0;
            height: calc(100vh - 120px);
            scroll-snap-align: center;
            margin: 0 6px;
        }

        .reader-content[data-view-mode="flip-left-double"] .image-container,
        .reader-content[data-view-mode="flip-right-double"] .image-container {
            flex: 1;
            max-width: 49%;
            height: calc(100vh - 120px);
        }

        .image-container img {
            max-width: 100%;
            height: auto;
            box-shadow: var(--shadow-2);
            border-radius: 8px;
        }

        .reader-content[data-view-mode="flip-left-single"] .image-container img,
        .reader-content[data-view-mode="flip-right-single"] .image-container img {
            max-height: calc(100vh - 120px);
            width: auto;
        }

        .reader-content[data-view-mode="flip-left-double"] .image-container img,
        .reader-content[data-view-mode="flip-right-double"] .image-container img {
            max-height: 100%;
            width: auto;
            object-fit: contain;
        }

        .reader-content[data-view-mode="scroll-right"] .image-container img,
        .reader-content[data-view-mode="scroll-left"] .image-container img {
            height: 100%;
            width: auto;
            max-width: none;
            object-fit: contain;
        }

        .image-loader {
            padding: 40px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .image-loader.error {
            color: var(--error);
        }

        .reader-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        .nav-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            box-shadow: var(--shadow-1);
        }

        .nav-btn:hover {
            background: var(--primary-dark);
            box-shadow: var(--shadow-2);
        }

        .nav-btn:active {
            transform: scale(0.95);
        }

        .nav-btn svg {
            width: 18px;
            height: 18px;
        }

        #floor-indicator {
            font-size: 14px;
            color: var(--text-primary);
            font-weight: 500;
            min-width: 120px;
            text-align: center;
        }

        .reader-sidebar {
            flex: 0 0 var(--sidebar-width);
            width: var(--sidebar-width);
            height: 100%;
            display: flex;
            flex-direction: column;
            background: var(--surface);
            border-left: 1px solid var(--divider);
            position: relative;
            z-index: 10;
            transition: transform 0.3s ease, opacity 0.3s ease;
            transform: translateX(0);
        }

        .sidebar-top {
            padding: 6px 10px;
            border-bottom: 1px solid var(--divider);
            background: var(--surface);
            position: relative;
            z-index: 11;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: var(--toolbar-height);
            box-shadow: var(--shadow-1);
        }

        .sidebar-tabs {
            display: flex;
            gap: 6px;
            margin: 0;
            width: 100%;
            justify-content: center;
            align-items: center;
            height: 100%;
        }

        .tab-btn {
            flex: 1;
            padding: 6px 10px;
            border: none;
            background: var(--surface);
            color: var(--text-secondary);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
            font-size: 14px;
            box-shadow: var(--shadow-1);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tab-btn:hover {
            background: var(--divider);
            box-shadow: var(--shadow-2);
        }

        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            box-shadow: var(--shadow-2);
        }

        .sidebar-content {
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .tab-panel {
            display: none;
            height: 100%;
            flex-direction: column;
        }

        .tab-panel.active {
            display: flex;
        }

        #yamibo-reader-container.sidebar-collapsed .reader-main {
            flex: 1 1 auto;
            width: 100%;
        }

        #yamibo-reader-container.sidebar-collapsed .reader-sidebar {
            flex: 0 0 0;
            width: 0;
            opacity: 0;
            pointer-events: none;
            transform: translateX(32px);
            border-left: none;
        }

        #yamibo-reader-container.sidebar-collapsed .reader-resizer {
            opacity: 0;
            pointer-events: none;
        }

        .directory-search {
            padding: 16px;
            border-bottom: 1px solid var(--divider);
            display: flex;
            gap: 8px;
        }

        .directory-search input {
            flex: 1;
            padding: 10px 16px;
            border: 1px solid var(--divider);
            border-radius: 8px;
            font-size: 14px;
            background: var(--surface);
            color: var(--text-primary);
            transition: border-color 0.2s;
        }

        .directory-search .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            box-shadow: none;
        }

        .directory-search .icon-btn:hover {
            box-shadow: none;
        }

        .directory-search input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .directory-list {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
        }

        .directory-item {
            padding: 12px 16px;
            margin-bottom: 8px;
            background: var(--background);
            border-radius: 8px;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }

        .directory-item:hover {
            background: var(--divider);
            transform: translateX(4px);
        }

        .directory-item.current {
            background: rgba(76,175,80,0.1);
            border-left-color: var(--primary-color);
        }

        .directory-item a {
            color: var(--text-primary);
            text-decoration: none;
            display: block;
            font-size: 14px;
        }

        .directory-item.current a {
            color: var(--primary-color);
            font-weight: 500;
        }

        .comments-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .comment-item {
            margin-bottom: 16px;
            padding: 16px;
            background: var(--background);
            border-radius: 8px;
            box-shadow: var(--shadow-1);
        }

        .comment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 13px;
        }

        .comment-author {
            font-weight: 600;
            color: var(--primary-color);
        }

        .comment-floor {
            color: var(--text-secondary);
            font-size: 12px;
        }

        .comment-time {
            margin-left: auto;
            color: var(--text-secondary);
            font-size: 12px;
        }

        .comment-content {
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-primary);
        }

        /* 收藏列表样式 */
        .favorites-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .favorite-item {
            margin-bottom: 12px;
            padding: 16px;
            background: var(--background);
            border-radius: 8px;
            box-shadow: var(--shadow-1);
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .favorite-item:hover {
            box-shadow: var(--shadow-2);
            transform: translateX(2px);
        }

        .favorite-item.current {
            border-left-color: var(--primary-color);
            background: var(--surface);
        }

        .favorite-header {
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .favorite-title-line {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .favorite-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .favorite-author,
        .favorite-count {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .favorite-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .favorite-latest a {
            color: var(--primary-color);
            text-decoration: none;
        }

        .favorite-latest a:hover {
            text-decoration: underline;
        }

        .favorite-latest-text {
            color: var(--text-secondary);
        }

        .favorite-progress {
            font-weight: 500;
            color: var(--primary-color);
        }

        .favorite-time {
            font-size: 11px;
        }

        .favorite-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        .favorite-action-btn {
            padding: 6px 12px;
            background: var(--surface);
            border: 1px solid var(--divider);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        .favorite-action-btn:hover {
            background: var(--primary-light);
            border-color: var(--primary-color);
            transform: scale(1.05);
        }

        .favorite-action-btn[disabled],
        .favorite-action-btn[disabled]:hover {
            opacity: 0.6;
            cursor: not-allowed;
            background: var(--surface);
            border-color: var(--divider);
            transform: none;
        }

        .favorite-action-btn svg {
            width: 14px;
            height: 14px;
        }

        .empty-message {
            padding: 60px 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .loading, .error, .no-comments, .content-loading {
            padding: 60px 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .error {
            color: var(--error);
        }

        .popup-menu {
            position: fixed;
            background: var(--surface);
            border-radius: 8px;
            box-shadow: var(--shadow-3);
            z-index: 100000;
            min-width: 200px;
            overflow: hidden;
        }

        .menu-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 14px;
            color: var(--text-primary);
        }

        .menu-item:hover {
            background: var(--divider);
        }

        .menu-divider {
            height: 1px;
            background: var(--divider);
            margin: 4px 0;
        }

        .menu-settings {
            padding: 12px 16px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .menu-section-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        .menu-range-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-primary);
        }

        .menu-range-label span {
            font-weight: 600;
            color: var(--primary-color);
        }

        .menu-input-label {
            font-size: 13px;
            color: var(--text-primary);
        }

        .menu-number-input {
            width: 100%;
            padding: 6px 10px;
            border-radius: 6px;
            border: 1px solid var(--divider);
            background: var(--surface);
            color: var(--text-primary);
            font-size: 13px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            box-sizing: border-box;
        }

        .menu-number-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(76,175,80,0.15);
        }

        .menu-hint {
            font-size: 12px;
            color: var(--text-secondary);
        }

        #menu-preload-slider {
            width: 100%;
            height: 6px;
            background: var(--divider);
            border-radius: 3px;
            -webkit-appearance: none;
            appearance: none;
            outline: none;
        }

        #menu-preload-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--primary-color);
            cursor: pointer;
            box-shadow: var(--shadow-1);
        }

        #menu-preload-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--primary-color);
            cursor: pointer;
            border: none;
            box-shadow: var(--shadow-1);
        }

        .menu-cache-info {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .menu-action-btn {
            align-self: flex-end;
            padding: 8px 12px;
            background: var(--surface);
            border: 1px solid var(--divider);
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--text-primary);
            box-shadow: var(--shadow-1);
        }

        .menu-action-btn:hover {
            background: var(--primary-light);
            border-color: var(--primary-color);
            color: var(--text-primary);
            box-shadow: var(--shadow-2);
        }

        #data-transfer-overlay.data-transfer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100002;
            padding: 24px;
        }

        .data-transfer-dialog {
            background: var(--surface);
            color: var(--text-primary);
            box-shadow: var(--shadow-3);
            border-radius: 12px;
            width: min(520px, 100%);
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px 24px;
        }

        .data-transfer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .data-transfer-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .data-transfer-close {
            border: none;
            background: transparent;
            color: var(--text-primary);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease;
        }

        .data-transfer-close:hover {
            background: var(--divider);
            color: var(--primary-color);
        }

        .data-transfer-body {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        #data-transfer-textarea {
            width: 100%;
            height: 220px;
            border: 1px solid var(--divider);
            border-radius: 8px;
            padding: 12px;
            resize: vertical;
            background: var(--background);
            color: var(--text-primary);
            font-family: Consolas, 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.08);
            box-sizing: border-box;
        }

        #data-transfer-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
        }

        .data-transfer-desc {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .data-transfer-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .data-transfer-btn {
            min-width: 88px;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .data-transfer-btn.primary {
            border: none;
            background: var(--primary-color);
            color: #ffffff;
            box-shadow: var(--shadow-1);
        }

        .data-transfer-btn.primary:hover {
            background: var(--primary-dark);
            box-shadow: var(--shadow-2);
        }

        .data-transfer-btn.secondary {
            border: 1px solid var(--divider);
            background: var(--surface);
            color: var(--text-primary);
        }

        .data-transfer-btn.secondary:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--background);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--divider);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary);
        }

        @media (max-width: 1024px) {
            .reader-main {
                width: 100%;
            }
            .reader-sidebar {
                display: none;
            }
        }
    `);

    // =========================
    // 初始化
    // =========================
    function init() {
        const parser = new ContentParser();
        if (!parser.threadId) {
            return;
        }

        const dataStore = new DataStore();
        new ReaderUI(parser, dataStore);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
