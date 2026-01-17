// ==UserScript==
// @name            FC2PPVDB Turbo
// @name:en         FC2PPVDB Turbo
// @description     聚合第三方公开数据，补充FC2PPVDB.com和FD2PPV.cc功能，提供预览图、预览视频、收藏、历史记录、缓存管理等功能。
// @description:en  Aggregates third-party public data to enhance the functionality of FC2PPVDB.com and FD2PPV.cc. Features include image/video previews, favorites, browsing history, cache management, and more.
// @namespace       NA
// @version         1.8
// @author          Js
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=fc2ppvdb.com
// @match           https://fc2ppvdb.com/*
// @match           https://fd2ppv.cc/*
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @connect         cdn.jsdelivr.net
// @connect         sukebei.nyaa.si
// @connect         wumaobi.com
// @connect         fourhoi.com
// @connect         i0.wp.com
// @connect         adult.contents.fc2.com
// @connect         fc2ppv.me
// @connect         missav.ws
// @connect         supjav.com
// @downloadURL https://update.greasyfork.org/scripts/560568/FC2PPVDB%20Turbo.user.js
// @updateURL https://update.greasyfork.org/scripts/560568/FC2PPVDB%20Turbo.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const getPreferredLanguage = () => {
        const langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || navigator.userLanguage].filter(Boolean);
        return (langs[0] || 'en').toLowerCase();
    };

    const DISCLAIMER_STATUS_KEY = 'disclaimer_status_v1';
    const AUTOPAGER_TIP_KEY = 'autopager_tip_v1';
    const Config = {
        CACHE_KEY: 'magnet_cache_v1',
        SETTINGS_KEY: 'settings_v1',
        HISTORY_KEY: 'history_v1',
        STATS_KEY: 'stats_v1',
        ACHIEVEMENTS_KEY: 'achievements_v1',
        MAX_HISTORY_SIZE: 200,
        CACHE_EXPIRATION_DAYS: 7,
        CACHE_MAX_SIZE: 1000,
        DEBOUNCE_DELAY: 400,
        COPIED_BADGE_DURATION: 1500,
        PREVIEW_VIDEO_TIMEOUT: 3000,
        PREVIEW_MIN_GAP_MS: 180,
        // 图片缓存配置
        IMAGE_CACHE_KEY: 'img_cache_v1',
        IMAGE_CACHE_EXPIRATION_HOURS: 24,
        IMAGE_CACHE_MAX_SIZE: 800,
        IMAGE_LOAD_TIMEOUT: 8000,
        IMAGE_LOAD_CONCURRENCY: 6,
        IMAGE_CHAIN_TIMEOUT: 30000,
        NO_IMAGE_FLAG: 'CACHE_NO_IMAGE_Marker', // 缓存标记
        // Base64 SVG 加载动画占位图
        LOADING_IMAGE: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgdmlld0JveD0iMCAwIDIwMCAxMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjUwIiByPSIxNSIgc3Ryb2tlPSIjODliNGZhIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1kYXNoYXJyYXk9IjQ3IDQ3IiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgMTAwIDUwIiB0bz0iMzYwIDEwMCA1MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICA8L2NpcmNsZT4KICA8dGV4dCB4PSIxMDAiIHk9Ijg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYTZhZGM4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+TG9hZGluZy4uLjwvdGV4dD4KPC9zdmc+`,
        // 无图占位图 URL
        NO_IMAGE_URL: 'https://fc2ppvdb.com/storage/images/article/no-image.jpg',
        NETWORK: {
            API_TIMEOUT: 20000,
            CHUNK_SIZE: 12,
            MAX_RETRIES: 2,
            RETRY_DELAY: 2000,
        },
        PREVIEW_HOVER_INTENT_MS: 220,
        PREVIEW_SCROLL_CANCEL_MS: 200,
        CLASSES: {
            cardRebuilt: 'card-rebuilt',
            processedCard: 'processed-card',
            hideNoMagnet: 'hide-no-magnet',
            videoPreviewContainer: 'video-preview-container',
            staticPreview: 'static-preview',
            previewElement: 'preview-element',
            hidden: 'hidden',
            infoArea: 'info-area',
            customTitle: 'custom-card-title',
            fc2IdBadge: 'fc2-id-badge',
            badgeCopied: 'copied',
            preservedIconsContainer: 'preserved-icons-container',
            resourceLinksContainer: 'resource-links-container',
            resourceBtn: 'resource-btn',
            btnLoading: 'is-loading',
            btnMagnet: 'magnet',
            tooltip: 'tooltip',
            buttonText: 'button-text',
            extraPreviewContainer: 'preview-container',
            extraPreviewTitle: 'preview-title',
            extraPreviewGrid: 'preview-grid',
            isCensored: 'is-censored',
            hideCensored: 'hide-censored',
            isViewed: 'is-viewed',
            hideViewed: 'hide-viewed',
        },
        SITES: {
            'fd2ppv.cc': {
                routes: [
                    { path: /^\/articles\/\d+/, processor: 'FD2PPV_DetailPageProcessor' },
                    { path: /^\/actresses\//, processor: 'FD2PPV_ActressPageProcessor' },
                    { path: /.*/, processor: 'FD2PPV_ListPageProcessor' },
                ]
            },
            'fc2ppvdb.com': {
                routes: [
                    { path: /^\/articles\/\d+/, processor: 'FC2PPVDB_DetailPageProcessor' },
                    { path: /.*/, processor: 'FC2PPVDB_ListPageProcessor' },
                ]
            }
        }
    };

    const Utils = {
        debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
        chunk: (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size)),
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        extractFC2Id: (url) => url?.match(/articles\/(\d+)/)?.[1] ?? null,
        extractImageUrl: (node) => {
            if (!node) return null;
            if (node.tagName === 'IMG') {
                return node.getAttribute('data-src') || node.getAttribute('data-original') || node.src || node.getAttribute('src');
            }
            const nodeDataUrl = node.getAttribute?.('data-src') || node.getAttribute?.('data-original') || node.getAttribute?.('data-url');
            if (nodeDataUrl) return nodeDataUrl;
            const img = node.querySelector && node.querySelector('img');
            if (img) {
                return img.getAttribute('data-src') || img.getAttribute('data-original') || img.src || img.getAttribute('src');
            }
            const text = node.textContent?.trim();
            if (text) {
                const match = text.match(/https?:\/\/\S+/i);
                if (match) return match[0];
            }
            const bg = node.style?.backgroundImage;
            const match = bg && bg.match(/url\(["']?(.*?)["']?\)/i);
            return match?.[1] || null;
        },
        getIconSortScore: (node) => {
            if (node.querySelector('.icon-mosaic_free')) return 0;
            if (node.querySelector('.icon-face_free')) return 1;
            return 2;
        },
    };

    const ExternalScripts = {
        chartJsPromise: null,
        loadChartJs() {
            if (typeof Chart !== 'undefined') return Promise.resolve(Chart);
            if (this.chartJsPromise) return this.chartJsPromise;
            const url = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
            this.chartJsPromise = new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest !== 'function') {
                    reject(new Error('GM_xmlhttpRequest unavailable'));
                    return;
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    timeout: Config.NETWORK.API_TIMEOUT,
                    onload: (res) => {
                        if (res.status < 200 || res.status >= 300) {
                            reject(new Error(`Chart.js load failed: ${res.status}`));
                            return;
                        }
                        try {
                            Function(res.responseText)();
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        if (typeof Chart === 'undefined') {
                            reject(new Error('Chart.js not available'));
                            return;
                        }
                        resolve(Chart);
                    },
                    onerror: () => reject(new Error('Chart.js request failed')),
                    ontimeout: () => reject(new Error('Chart.js request timeout')),
                });
            });
            this.chartJsPromise.catch(() => { this.chartJsPromise = null; });
            return this.chartJsPromise;
        },
    };

    /**
     * Global IntersectionObserver manager to avoid spawning one observer per card.
     * Keeps a weak mapping of targets to their enter/exit handlers.
     */
    class GlobalObserver {
        static observers = new Map();
        static handlerMaps = new Map();
        static fallbackItems = new Map();
        static fallbackInitialized = false;
        static fallbackScheduled = false;

        static _get(key, options) {
            if (!this.observers.has(key)) {
                const map = new WeakMap();
                let observer = null;
                if (typeof IntersectionObserver !== 'undefined') {
                    observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            const handlers = map.get(entry.target);
                            if (!handlers) return;
                            if (entry.isIntersecting) handlers.onEnter?.(entry);
                            else handlers.onExit?.(entry);
                        });
                    }, options);
                }
                this.observers.set(key, observer);
                this.handlerMaps.set(key, map);
            }
            return [this.observers.get(key), this.handlerMaps.get(key)];
        }

        static observe(key, element, handlers, options) {
            const [observer, map] = this._get(key, options);
            map.set(element, handlers);
            if (observer) observer.observe(element);
            if (!observer || this._shouldUseFallback()) this._addFallback(element, handlers, options);
        }

        static unobserve(key, element) {
            const observer = this.observers.get(key);
            const map = this.handlerMaps.get(key);
            if (observer) observer.unobserve(element);
            if (map) map.delete(element);
            this._removeFallback(element);
        }

        static _shouldUseFallback() {
            if (typeof IntersectionObserver === 'undefined') return true;
            if (document.getElementById('pagetual-sideController')) return true;
            if (document.querySelector('.pagetual_pageBar')) return true;
            return false;
        }

        static _addFallback(element, handlers, options) {
            if (!element || this.fallbackItems.has(element)) return;
            const margin = this._parseRootMargin(options?.rootMargin);
            this.fallbackItems.set(element, { handlers, margin, inView: false });
            this._ensureFallbackListeners();
            this._scheduleFallbackCheck();
        }

        static _removeFallback(element) {
            if (this.fallbackItems.has(element)) this.fallbackItems.delete(element);
        }

        static _ensureFallbackListeners() {
            if (this.fallbackInitialized) return;
            this.fallbackInitialized = true;
            window.addEventListener('scroll', () => this._scheduleFallbackCheck(), { passive: true });
            window.addEventListener('resize', () => this._scheduleFallbackCheck());
            document.addEventListener('visibilitychange', () => this._scheduleFallbackCheck());
        }

        static _scheduleFallbackCheck() {
            if (this.fallbackScheduled) return;
            this.fallbackScheduled = true;
            requestAnimationFrame(() => {
                this.fallbackScheduled = false;
                this._runFallbackCheck();
            });
        }

        static _runFallbackCheck() {
            if (this.fallbackItems.size === 0) return;
            const viewportW = window.innerWidth || document.documentElement.clientWidth;
            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            for (const [element, state] of this.fallbackItems.entries()) {
                if (!element.isConnected) {
                    this.fallbackItems.delete(element);
                    continue;
                }
                const rect = element.getBoundingClientRect();
                const margin = state.margin;
                const inView = rect.bottom >= -margin
                    && rect.top <= viewportH + margin
                    && rect.right >= -margin
                    && rect.left <= viewportW + margin;
                if (inView && !state.inView) {
                    state.inView = true;
                    state.handlers.onEnter?.({ target: element, isIntersecting: true });
                } else if (!inView && state.inView) {
                    state.inView = false;
                    state.handlers.onExit?.({ target: element, isIntersecting: false });
                }
            }
        }

        static _parseRootMargin(rootMargin) {
            if (!rootMargin) return 0;
            const value = parseFloat(String(rootMargin).trim().split(/\s+/)[0]);
            return Number.isFinite(value) ? value : 0;
        }
    }

    const Icons = {
        magnet: '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M0 160v96C0 379.7 100.3 480 224 480s224-100.3 224-224V160H320v96c0 53-43 96-96 96s-96-43-96-96V160H0zm0-32H128V64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64v64zm320 0H448V64c0-17.7-14.3-32-32-32H352c-17.7 0-32 14.3-32 32v64z"/></svg>',
        settings: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>',
        close: '<svg viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>',
        spinner: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" style="animation:spin 1s linear infinite"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>',
        globe: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>',
        bolt: '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"/></svg>',
        play: '<svg viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.8 23-24.4 23-41s-8.7-32.2-23-41L73 39z"/></svg>',
        videoSlash: '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M5 6a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h9a2 2 0 0 0 2-2v-1.3l3.4 2A1 1 0 0 0 21 16V8a1 1 0 0 0-1.6-.8L16 9.3V8a2 2 0 0 0-2-2H5z"/><path d="M2.6 3.9l17.5 17.5-1.4 1.4L1.2 5.3l1.4-1.4z"/></svg>',
        magnifyingGlass: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>',
        star: '<svg viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>',
        starOutline: '<svg viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 8.8 17.9 17.8s-2.4 18.2-9.2 24.6l-111.4 109.8 26.5 153.6c1.6 9.1-2.2 18.3-9.6 23.7s-17 4.5-25.1 .5L288 433l-132.4 74.4c-8.2 4-17.7 4.9-25.1-.5s-11.2-14.6-9.6-23.7l26.5-153.6L36.1 220C29.3 213.6 25.4 204.4 26.8 195.4s8.9-16.5 17.9-17.8l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 89L235.4 196.5c-1.6 3.2-5 5.5-8.8 6.1l-118.6 17.5 86.4 85.1c2.7 2.6 3.8 6.5 2.9 10.1l-20.7 119.5 106.6-59.9c1.5-.9 3.2-1.3 4.9-1.3s3.4 .5 4.9 1.3l106.6 59.9-20.7-119.5c-.9-3.7 .3-7.5 2.9-10.1l86.4-85.1-118.6-17.5c-3.8-.6-7.2-2.9-8.8-6.1L287.9 89z"/></svg>',
        eye: '<svg viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>',
        eyeSlash: '<svg viewBox="0 0 640 512" width="1em" height="1em" fill="currentColor"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>',
        plus: '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
        lock: '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>',
        edit: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0z"/></svg>',

        trash: '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>',
        folder: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg>',
        moon: '<svg viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>',
        sun: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 14.8l-72.1 94.8 43.5 94.1c2.1 4.7 1.2 10.2-2.3 14.2s-8.7 5.7-13.8 4.4L358.3 349.5l-49.4 103.2c-2.3 4.9-7.2 8.1-12.7 8.3s-10.6-2.5-13.7-6.9l-61.6-90.5L140 457.5c-4.4 4.3-11.2 5-16.2 1.6s-6.9-9.1-4.5-14.7l54.4-125.7L67.6 288.6c-5.2-1.3-9-5.4-9.6-10.7s2.5-10.3 7.3-13zM256 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM128 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM32 128a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM384 384a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM448 128a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM320 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
        laptop: '<svg viewBox="0 0 640 512" width="1em" height="1em" fill="currentColor"><path d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z"/></svg>',
        chevronDown: '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>',
    };

    const Localization = {
        _lang: 'en',
        _translations: {
            en: {
                settingsTitle: "FC2PPVDB Turbo",
                tabSettings: "Settings",
                tabStatistics: "Statistics",
                tabHistory: "Browsing History",
                tabCache: "Cache Management",
                groupFilters: "General Filters",
                optionHideNoMagnet: "Hide results with no magnet links",
                optionHideCensored: "Hide censored works",
                optionHideViewed: "Hide viewed works",
                groupAppearance: "Appearance & Interaction",
                groupImageLoadTuning: "Image Loading (Debug)",
                labelPreviewMode: "Preview Mode",
                previewModeStatic: "Static Image",
                previewModeHover: "Hover/Click to Play",
                previewModeAuto: "Auto Play (Muted)",
                labelCardLayout: "Card Layout",
                layoutDefault: "Default",
                layoutCompact: "Concise",
                labelGlowColor: "Hover Glow Color",
                labelViewedColor: "Viewed Border Color",
                labelImageLoadTimeout: "Per-source timeout (ms)",
                labelImageChainTimeout: "Chain timeout (ms)",
                labelImageLoadConcurrency: "Load concurrency",
                groupImageSources: "Image Sources (Debug, chained order: Fourhoi -> JavPop -> Wumaobi -> PPVDataBank -> FC2PPV.me -> FC2 Direct)",
                groupThumbnailSources: "Thumbnail Sources (Chained order: Fourhoi -> JavPop -> Wumaobi -> PPVDataBank -> FC2PPV.me -> FC2 Direct)",
                optionSourceFourhoi: "Fourhoi",
                optionSourceWumaobi: "Wumaobi (Fast)",
                optionSourcePPVDataBank: "PPVDataBank (Direct)",
                optionSourceJavPop: "JavPop (Direct)",
                optionSourceFC2Direct: "FC2 Direct (list thumbnails; some resources require a Japan node)",
                optionSourceFC2PPVMe: "FC2PPV.me (Fast Scrape)",
                optionDetailPPVDataBank: "PPVDataBank (Detail)",
                groupDataHistory: "Data & History",
                optionEnableHistory: "Enable history feature (Highlight/Hide)",
                optionLoadExtraPreviews: "Load extra previews on detail pages",
                optionEnableCollection: "Enable collection & tagging feature",
                labelCacheManagement: "Cache Management",
                labelMagnetCache: "Magnet Links",
                labelImageCache: "Cover Images", // 已添加
                labelTheme: "Theme",
                themeLight: "Light",
                themeDark: "Dark",
                themeAuto: "Auto (System)",
                confirmClearImageCacheSmart: "Are you sure you want to clear cached images? (Images in your History will be preserved)",
                btnClearCache: "Clear Cache",
                btnClearHistory: "Clear History",
                labelHistoryManagement: "History Management",
                collectionTitle: "My Collection",
                collectionEmpty: "No items in collection",
                tooltipAddToCollection: "Create New Tag",
                tooltipDeleteTag: "Delete Tag",
                tooltipEditCollection: "Edit Tags",
                confirmDeleteTag: "Delete tag \"{tag}\"? Items will lose this tag.",
                confirmClearHistory: "Are you sure you want to clear all history?",
                confirmClearCache: "Are you sure you want to clear all cache?",
                promptNewTag: "Enter new tag name:",
                btnSaveAndApply: "Save and Refresh",
                alertSettingsSaved: "Settings saved! Some changes may require a page refresh to take full effect.",
                alertCacheCleared: "Magnet link cache has been cleared!",
                alertHistoryCleared: "Browsing history has been cleared!",
                msgHistoryCleared: "History Cleared!", // 已添加
                menuOpenSettings: "⚙️ Open Settings Panel",
                tooltipCopyMagnet: "Copy Magnet Link",
                tooltipCopied: "Copied!",
                msgCacheCleared: "Cache Cleared!", // 已添加
                tooltipLoading: "Loading...",
                checking: "Checking...",
                resourceNotFound: "Resource not found",
                extraPreviewTitle: "Extra Previews",
                statTotalViews: "Total Views",
                labelNewTag: "New Collection Tag", // 已添加
                statCollectionCount: "Collected Items", // 已添加
                msgCollectionDeleted: "Collection Tag Deleted!", // 已添加
                msgHistoryEmpty: "No history records", // 已添加
                msgCacheEmpty: "Cache is empty", // 已添加
                statCachedMagnets: "Cached Magnets (FIFO, max 1000)",
                statImageCacheCombined: "Image Cache (FIFO)", // 已添加
                warnCacheDeletion: "This will also delete the cached images and magnet links for this video.", // 已添加
                warnTagCacheDeletion: "Items removed from collection will have their cached images/magnets deleted.", // 已添加
                statCacheHits: "Loaded from Cache", // 视频来源
                tipCacheReset: "(Resets after 100k)", // 缩略图来源
                chartLoading: "Loading chart...",
                chartActivityTitle: "Browsing Activity Trend",
                chartActivityLabel: "Views in the last 30 days",
                chartCacheTitle: "Cache Usage",
                chartCacheUsed: "Used Cache",
                chartCacheFree: "Free Space",
                achievementsTitle: "Achievement Milestones",
                statusUnlocked: "Unlocked",
                statusLocked: "Locked",
                ach_view10_title: "First Steps", ach_view10_desc: "View 10 works in total.",
                ach_view100_title: "Getting the Hang", ach_view100_desc: "View 100 works in total.",
                ach_view1000_title: "Seasoned Connoisseur", ach_view1000_desc: "View 1000 works in total.",
                ach_cache50_title: "Cache Master", ach_cache50_desc: "Load 5000 items from cache.", // 视频来源
                ach_cache500_title: "Efficiency Expert", ach_cache500_desc: "Load 20,000 items from cache.", // 更新为 20,000
                ach_nightOwl_title: "Night Owl", ach_nightOwl_desc: "Browsed between 2 AM and 4 AM.",
                ach_earlyBird_title: "Early Bird", ach_earlyBird_desc: "Browsed between 5 AM and 7 AM.",
                ach_weekendWarrior_title: "Weekend Warrior", ach_weekendWarrior_desc: "Viewed over 30 works during a single weekend.",
                ach_endurance_title: "Endurance Runner", ach_endurance_desc: "Browsed every day for 7 consecutive days.",
                ach_fullThrottle_title: "Full Throttle", ach_fullThrottle_desc: "Viewed over 20 works within 1 hour.",
                ach_luckyNumber_title: "Lucky Number", ach_luckyNumber_desc: "Viewed a work with '666' or '888' in its ID.",
                ach_veteranDriver_title: "Veteran Driver", ach_veteranDriver_desc: "First and last view records are more than 365 days apart.",
                ach_achievementHunter_title: "Achievement Hunter", ach_achievementHunter_desc: "Unlock your first achievement.",
                btnUnfavorite: "Remove from Collection",
                hintRightClickEdit: "Right-click to edit tags",
                confirmDeleteTag: "Are you sure you want to delete the tag \"{tag}\"?",
                groupDataManagement: "Data Management",
                btnExportData: "Export Data",
                btnImportData: "Import Data",
                alertExportSuccess: "Data export started. Check your browser downloads.",
                alertImportSuccess: "Data imported successfully! Please refresh the page to apply all changes.",
                alertImportError: "Import failed! The file is invalid, corrupted, or cannot be read.",
                tooltipMarkAsViewed: "Mark as viewed",
                tooltipMarkAsUnviewed: "Mark as un-viewed",
                tooltipAddToCollection: "Add to collection",
                tooltipEditCollection: "Edit collection tags",
                tagEditorTitle: "Edit Tags",
                placeholderAddTag: "Add a new tag...",
                btnAddTag: "Add",
                btnSaveTags: "Save Changes",
                btnCancel: "Cancel",
                tabCollection: "Collection",
                collectionEmpty: "You haven't collected any items yet.",
                collectionTitle: "Your Collections",
                tooltipEditTag: "Edit tag name",
                tooltipDeleteTag: "Delete tag (from all items)",
                promptEditTag: "Enter new name for the tag:",
                noPreviewImage: "No preview images",
                noPreviewVideo: "No preview videos",
                noVideoLabel: "No Video",
                groupPageBehavior: "Page Behavior",
                optionForceRefreshOnBack: "Force refresh video list on back",
                optionOpenDetailsInNewTab: "Open detail pages in new tab",
                optionPreferFd2SiteImage: "FD2PPV.cc: prefer site thumbnails (requires login)"
            },
            zh: {
                settingsTitle: "FC2PPVDB Turbo",
                tabSettings: "设置",
                tabStatistics: "统计",
                tabHistory: "浏览记录",
                tabCache: "缓存管理",
                tabCollection: "收藏",
                groupFilters: "通用过滤",
                optionHideNoMagnet: "隐藏无磁力结果",
                optionHideCensored: "隐藏有码作品",
                optionHideViewed: "隐藏已浏览的作品",
                groupAppearance: "外观与交互",
                groupImageLoadTuning: "图片加载调试(调试用)",
                labelPreviewMode: "预览模式",
                previewModeStatic: "静态图片",
                previewModeHover: "悬浮/点击播放",
                previewModeAuto: "自动播放",
                labelCardLayout: "卡片布局",
                layoutDefault: "默认",
                layoutCompact: "简洁",
                labelGlowColor: "悬停光晕颜色",
                labelViewedColor: "看过标记颜色",
                labelImageLoadTimeout: "单源超时(ms)",
                labelImageChainTimeout: "链路总超时(ms)",
                labelImageLoadConcurrency: "并发数",
                groupDataManagement: "数据管理",
                groupThumbnailSources: "缩略图调用开关 (调试用)(链式调用，顺序：Fourhoi -> JavPop -> Wumaobi -> PPVDataBank -> FC2PPV.me -> FC2官网)，调整链路后需要手动清空缓存", // 从 groupImageSources 重命名
                groupDetailSources: "详情页图片源 (调试用)(链式调用，顺序：Wumaobi -> JavPop -> PPVDataBank -> FC2官网)，调整链路后需要手动清空缓存", // 新增
                groupVideoSources: "视频源/按钮开关 (调试用)(默认全开)", // 新增

                // 选项（缩略图：复用现有键或按需更新文字；用户说明“原图源开关名已变”，仅改标签即可）
                optionSourceFourhoi: "Fourhoi (列表缩略图)",
                optionSourceWumaobi: "Wumaobi (列表缩略图)",
                optionSourcePPVDataBank: "PPVDataBank (列表缩略图)",
                optionSourceJavPop: "JavPop (列表缩略图)",
                optionSourceFC2Direct: "FC2 官网 (列表缩略图，部分资源需要本地连接日本节点)",
                optionSourceFC2PPVMe: "FC2PPV.me (列表缩略图)",

                // 切换到收藏标签页
                optionDetailWumaobi: "Wumaobi (详情页)",
                optionDetailPPVDataBank: "PPVDataBank (详情页)",
                optionDetailJavPop: "JavPop (详情页)",
                optionDetailFC2Direct: "FC2 官网 (详情页，部分资源需要本地连接日本节点)",

                // 切换到收藏标签页
                optionVideoMissAV: "MissAV 按钮",
                optionVideoSupjav: "Supjav 按钮",
                optionVideoSukebei: "Sukebei 按钮",
                optionVideoMagnet: "磁力链接按钮",
                groupDataHistory: "数据与历史",
                optionEnableHistory: "启用浏览记录功能 (高亮)",
                optionLoadExtraPreviews: "在详情页加载视频提取图预览",
                optionEnableCollection: "启用收藏与标签功能",
                labelCacheManagement: "缓存管理",
                labelMagnetCache: "磁力链接缓存",
                labelImageCache: "图片缓存",
                labelTheme: "主题外观",
                themeLight: "浅色模式",
                themeDark: "深色模式",
                themeAuto: "跟随系统",
                confirmClearImageCacheSmart: "您确定要清空图片缓存吗？\n（浏览记录中存在的封面图将会被保留）",
                btnClearCache: "清空缓存",
                btnClearHistory: "清空记录",
                labelHistoryManagement: "浏览记录管理",
                collectionTitle: "我的收藏",
                collectionEmpty: "收藏夹为空",
                labelNewTag: "新建收藏标签", // 视频来源
                tooltipAddToCollection: "添加到收藏",
                tooltipDeleteTag: "删除标签",
                tooltipEditCollection: "编辑标签",
                tooltipEditCollection: "编辑标签",
                confirmDeleteTag: "确定要删除标签 “{tag}” 吗？",
                confirmClearHistory: "确定要清空所有浏览记录吗？",
                confirmClearCache: "确定要清空所有缓存吗？",
                promptNewTag: "请输入新标签名称：",
                btnSaveAndApply: "保存并刷新",
                alertSettingsSaved: "设置已保存！部分更改可能需要刷新页面才能完全生效。",
                alertCacheCleared: "磁力链接缓存已清除！",
                alertHistoryCleared: "浏览记录已清除！",
                msgHistoryCleared: "已清空浏览记录！", // 已添加
                menuOpenSettings: "⚙️ 打开设置面板",
                tooltipCopyMagnet: "Magnet",
                tooltipCopied: "已复制!",
                tooltipMarkAsViewed: "标记为已看",
                tooltipMarkAsUnviewed: "标记为未看",
                msgCacheCleared: "缓存已清理!", // 已添加
                tooltipLoading: "获取中...",
                checking: "检测中...",
                resourceNotFound: "未找到资源",
                extraPreviewTitle: "额外预览",
                statTotalViews: "浏览总数 (FIFO淘汰)",
                statCollectionCount: "收藏数量", // 已添加
                msgRemovedFromCollection: "取消收藏成功!", // 已添加 - 修复缺失键
                msgCollectionDeleted: "收藏标签已删除!", // 已添加
                msgHistoryEmpty: "暂无浏览记录", // 已添加
                msgCacheEmpty: "缓存为空", // 已添加
                statCachedMagnets: "磁力缓存 (FIFO淘汰，上限1000)",
                statImageCacheCombined: "图片缓存 (FIFO淘汰)", // 已添加
                warnCacheDeletion: "这也将删除该视频的缓存图片和磁力链接。", // 已添加
                warnTagCacheDeletion: "从收藏夹中移除的项目将删除其缓存数据。", // 已添加
                statCacheHits: "从缓存加载",
                tipCacheReset: "(超过10万重置)", // 缩略图来源
                chartLoading: "图表加载中...",
                chartActivityTitle: "最近活跃趋势",
                chartActivityLabel: "每日浏览量 (14天)",
                chartCacheTitle: "缓存占用情况",
                chartCacheUsed: "已用空间",
                chartCacheFree: "剩余配额",
                achievementsTitle: "成就里程碑",
                statusUnlocked: "已解锁",
                statusLocked: "未解锁",
                ach_view10_title: "萌新上路", ach_view10_desc: "累计浏览10部作品。握紧方向盘！",
                ach_view100_title: "轻车熟路", ach_view100_desc: "累计浏览100部作品。这里不需要导航。",
                ach_view1000_title: "秋名山车神", ach_view1000_desc: "累计浏览1000部作品。车灯甚至追不上你的尾灯。",
                ach_cache50_title: "松鼠症候群", ach_cache50_desc: "累计从缓存加载 5000 次数据。囤积是一种美德。",
                ach_cache500_title: "人形数据中心", ach_cache500_desc: "累计从缓存加载 20,000 次数据。你的浏览器已经是个成熟的服务器了。",
                ach_nightOwl_title: "修仙党", ach_nightOwl_desc: "在凌晨2点到4点之间浏览。睡什么睡，起来嗨！",
                ach_earlyBird_title: "闻鸡起舞", ach_earlyBird_desc: "在清晨5点到7点之间浏览。一日之计在于晨（？）",
                ach_weekendWarrior_title: "周末狂欢", ach_weekendWarrior_desc: "单周末浏览超过30部作品。阳光？那是什么？",
                ach_endurance_title: "全勤奖", ach_endurance_desc: "连续7天每天都有浏览记录。比上班还准时。",
                ach_fullThrottle_title: "极速冲刺", ach_fullThrottle_desc: "1小时内浏览超过20部作品。你真的看完了吗？",
                ach_luckyNumber_title: "欧皇附体", ach_luckyNumber_desc: "浏览ID包含666或888的作品。玄学加成。",
                ach_veteranDriver_title: "时光旅人", ach_veteranDriver_desc: "第一次和最后一次浏览记录间隔超过365天。跨度超过一年的阅历，初心不改。",
                ach_achievementHunter_title: "第一滴血", ach_achievementHunter_desc: "解锁任意一个成就。欢迎来到新世界。",
                // 视频来源列表
                ach_malnourished_title: "营养跟不上了", ach_malnourished_desc: "24小时内浏览超过30部作品。注意身体，兄弟。",
                ach_dopamine_title: "多巴胺中毒", ach_dopamine_desc: "30天内浏览超过500部作品。普通的内容还能满足你吗？",
                ach_notEvenTrying_title: "甚至没有开始", ach_notEvenTrying_desc: "连续3天无浏览记录。清心寡欲，胜造七级浮屠。",
                ach_storageCrisis_title: "硬盘要炸了", ach_storageCrisis_desc: "缓存占用超过90%。瑟瑟发抖的存储空间。",
                btnUnfavorite: "取消收藏",
                hintRightClickEdit: "右键编辑标签",
                groupDataManagement: "数据管理",
                btnExportData: "导出数据",
                btnImportData: "导入数据",
                promptImport: "请在此处粘贴您导出的数据字符串：",
                alertExportSuccess: "数据导出已开始，请检查下载。",
                alertImportSuccess: "数据导入成功！请刷新页面以完全应用所有更改。",
                alertImportError: "导入失败！文件格式错误或无法读取。",
                tooltipEditTag: "编辑标签名称",
                tooltipDeleteTag: "删除标签 (将从所有项目中移除)",
                promptEditTag: "请输入标签的新名称：",
                tagEditorTitle: "编辑收藏标签",
                placeholderAddTag: "输入新标签名称...",
                btnAddTag: "添加",
                btnSaveTags: "保存",
                btnCancel: "取消",
                noPreviewImage: "暂无图片预览",
                noPreviewVideo: "暂无视频预览",
                noVideoLabel: "无预览视频",
                groupPageBehavior: "页面行为",
                optionForceRefreshOnBack: "回退页面强制刷新影片列表",
                optionOpenDetailsInNewTab: "在新标签页打开详情页",
                optionPreferFd2SiteImage: "fd2ppv.cc优先使用站点资源（需登录网站）"
            }
        },
        init() {
            const browserLang = getPreferredLanguage();
            this._lang = browserLang.startsWith('zh') ? 'zh' : 'en';
        },
        t(key) {
            return this._translations[this._lang]?.[key] || this._translations['en']?.[key] || key;
        }
    };
    const t = Localization.t.bind(Localization);

    class EventEmitter {
        constructor() { this.events = {}; }
        on(eventName, listener) {
            if (!this.events[eventName]) this.events[eventName] = [];
            this.events[eventName].push(listener);
        }
        emit(eventName, payload) {
            this.events[eventName]?.forEach(listener => listener(payload));
        }
    }
    const AppEvents = new EventEmitter();

    class StorageManager {
        static _pending = new Map();
        static _flushTimer = null;
        static _pendingWrites = 0;
        static FLUSH_DELAY_MS = 600;
        static FLUSH_THRESHOLD = 25;

        static get(key, def) {
            const pending = this._pending.get(key);
            if (pending) {
                if (pending.type === 'delete') return def;
                return pending.value;
            }
            return GM_getValue(key, def);
        }
        static set(key, val, options = {}) {
            if (options.immediate) {
                if (this._pending.delete(key)) {
                    this._pendingWrites = Math.max(0, this._pendingWrites - 1);
                }
                GM_setValue(key, val);
                return;
            }
            const hadKey = this._pending.has(key);
            this._pending.set(key, { type: 'set', value: val });
            if (!hadKey) this._pendingWrites += 1;
            this._scheduleFlush();
        }
        static delete(key, options = {}) {
            if (options.immediate) {
                if (this._pending.delete(key)) {
                    this._pendingWrites = Math.max(0, this._pendingWrites - 1);
                }
                GM_deleteValue(key);
                return;
            }
            const hadKey = this._pending.has(key);
            this._pending.set(key, { type: 'delete' });
            if (!hadKey) this._pendingWrites += 1;
            this._scheduleFlush();
        }
        static _scheduleFlush() {
            if (this._pendingWrites >= this.FLUSH_THRESHOLD) {
                this.flush();
                return;
            }
            if (this._flushTimer) return;
            this._flushTimer = setTimeout(() => {
                this._flushTimer = null;
                this.flush();
            }, this.FLUSH_DELAY_MS);
        }
        static flush() {
            if (this._flushTimer) {
                clearTimeout(this._flushTimer);
                this._flushTimer = null;
            }
            if (this._pending.size === 0) return;
            for (const [key, op] of this._pending.entries()) {
                if (op.type === 'set') GM_setValue(key, op.value);
                else GM_deleteValue(key);
            }
            this._pending.clear();
            this._pendingWrites = 0;
        }
    }

    class StatsTracker {
        static stats = {};
        static _dirty = false;
        static _pendingWrites = 0;
        static _saveTimer = null;
        static SAVE_INTERVAL_MS = 2000; // 基于时间的节流
        static SAVE_THRESHOLD = 50; // 基于时间的节流
        static load() { this.stats = StorageManager.get(Config.STATS_KEY, {}); this._dirty = false; this._pendingWrites = 0; }
        static _scheduleSave() {
            if (this._pendingWrites >= this.SAVE_THRESHOLD) {
                this.flush();
                return;
            }
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this.flush();
            }, this.SAVE_INTERVAL_MS);
        }
        static flush() {
            if (!this._dirty) return;
            this._dirty = false;
            this._pendingWrites = 0;
            StorageManager.set(Config.STATS_KEY, this.stats, { immediate: true });
        }
        static save() { this.flush(); } // 作为别名以兼容现有调用
        static get(key, def = 0) { return this.stats[key] ?? def; }
        static getAll() { return this.stats; }
        static increment(key) {
            this.stats[key] = (this.stats[key] || 0) + 1;
            if (key === 'cacheHits' && this.stats[key] > 100000) {
                this.stats[key] = 0;
            }
            this._dirty = true;
            this._pendingWrites += 1;
            this._scheduleSave();
        }
    }

    class TagEditorModal {
        constructor(fc2Id, currentTags, onSave) {
            this.fc2Id = fc2Id;
            this.currentTags = new Set(currentTags);
            this.onSave = onSave;
            this.backdrop = null;
            this.panel = null;
        }
        _createModal() {
            this.backdrop = UIBuilder.createElement('div', { className: 'turbo-modal-backdrop tag-editor-backdrop' });
            this.panel = UIBuilder.createElement('div', { className: 'turbo-modal-panel tag-editor-panel' });
            this.panel.innerHTML = `
                <div class="turbo-modal-header tag-editor-header"><h3>${t('tagEditorTitle')}</h3></div>
                <div class="tag-editor-content"><div class="tag-checklist"></div></div>
                <div class="tag-editor-add-new">
                    <input type="text" placeholder="${t('placeholderAddTag')}" class="new-tag-input">
                    <button class="fc2-turbo-btn">${t('btnAddTag')}</button>
                </div>
                <div class="turbo-modal-footer tag-editor-footer" style="justify-content: flex-end;">
                    <div>
                        <button class="fc2-turbo-btn cancel-btn">${t('btnCancel')}</button>
                        <button class="fc2-turbo-btn primary save-btn">${t('btnSaveTags')}</button>
                    </div>
                </div>
            `;
            document.body.append(this.backdrop, this.panel);
        }

        _populateTags() {
            const checklist = this.panel.querySelector('.tag-checklist');
            checklist.innerHTML = '';
            const masterList = TagManager.getMasterTagList();
            let selectedTag = null;
            if (this.currentTags.size > 0) {
                selectedTag = masterList.find(tag => this.currentTags.has(tag)) || this.currentTags.values().next().value;
                this.currentTags = new Set([selectedTag]);
            }
            const groupName = `tag-editor-${this.fc2Id}`;

            masterList.forEach(tag => {
                const isChecked = selectedTag === tag;
                const id = `tag-radio-${tag.replace(/\s/g, '-')}`;
                const itemDiv = UIBuilder.createElement('div', { className: 'tag-checklist-item' });
                const label = UIBuilder.createElement('label', { className: 'tag-label', htmlFor: id, textContent: ` ${tag}` });
                const radio = UIBuilder.createElement('input', { type: 'radio', id, checked: isChecked, name: groupName });
                radio.dataset.tag = tag;
                label.prepend(radio);
                const actionsDiv = UIBuilder.createElement('div', { className: 'tag-checklist-item-actions' });
                actionsDiv.innerHTML = `
                    <button data-action="edit" data-tag="${tag}" title="${t('tooltipEditTag')}"><i class="fa-solid fa-pencil"></i></button>
                    <button data-action="delete" data-tag="${tag}" title="${t('tooltipDeleteTag')}"><i class="fa-solid fa-trash-can"></i></button>
                `;
                itemDiv.append(label, actionsDiv);
                checklist.appendChild(itemDiv);
            });
        }
        _addEventListeners() {
            const hide = () => this.hide();
            this.backdrop.addEventListener('click', hide);
            this.panel.querySelector('.cancel-btn').addEventListener('click', hide);
            // 移除取消收藏按钮监听
            this.panel.querySelector('.save-btn').addEventListener('click', () => this._handleSave());

            const addBtn = this.panel.querySelector('.tag-editor-add-new button');
            const addInput = this.panel.querySelector('.new-tag-input');
            const addNewTag = () => {
                const newTag = addInput.value.trim();
                if (newTag && TagManager.addMasterTag(newTag)) {
                    this.currentTags = new Set([newTag]);
                    this._populateTags();
                    addInput.value = '';
                }
            };
            addBtn.addEventListener('click', addNewTag);
            addInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addNewTag(); });
            const checklist = this.panel.querySelector('.tag-checklist');
            checklist.addEventListener('change', (e) => {
                const input = e.target;
                if (input?.matches('input[type="radio"]')) {
                    this.currentTags = new Set([input.dataset.tag]);
                }
            });
            checklist.addEventListener('click', (e) => {
                const button = e.target.closest('button[data-action]');
                if (!button) return;

                const action = button.dataset.action;
                const tag = button.dataset.tag;

                if (action === 'edit') {
                    this._handleEditTag(tag);
                } else if (action === 'delete') {
                    this._handleDeleteTag(tag);
                }
            });
        }

        _handleEditTag(oldTag) {
            const newTag = prompt(t('promptEditTag'), oldTag);
            if (newTag && newTag !== oldTag) {
                if (TagManager.editMasterTag(oldTag, newTag)) {
                    if (this.currentTags.has(oldTag)) {
                        this.currentTags.delete(oldTag);
                        this.currentTags.add(newTag.trim());
                    }
                    this._populateTags();
                }
            }
        }

        _handleDeleteTag(tag) {
            if (confirm(t('confirmDeleteTag').replace('{tag}', tag))) {
                if (TagManager.deleteMasterTag(tag)) {
                    this.currentTags.delete(tag);
                    this._populateTags();
                }
            }
        }

        _handleSave() {
            const selected = this.panel.querySelector('.tag-checklist input[type="radio"]:checked');
            const newTags = selected ? [selected.dataset.tag] : [];
            this.onSave(newTags);
            this.hide();
        }

        show() {
            this._createModal();
            this._populateTags();
            this._addEventListeners();
        }

        hide() {
            this.backdrop?.remove();
            this.panel?.remove();
        }
    }

    class ResourceChecker {
        static async check(type, id) {
            return new Promise((resolve) => {
                let url = '';
                if (type === 'missav') {
                    url = `https://missav.ws/cn/fc2-ppv-${id}`;
                } else if (type === 'supjav') {
                    url = `https://supjav.com/zh/?s=${id}`;
                } else if (type === 'sukebei') {
                    url = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${id}`;
                }

                if (!url) return resolve(true);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    timeout: 8000,
                    onload: (res) => {
                        if (res.status !== 200 && res.status !== 404) return resolve(true);
                        const text = res.responseText;

                        if (type === 'missav') {
                            if (res.status === 404 || text.includes('404 Not Found')) resolve(false);
                            else resolve(true);
                        } else if (type === 'supjav') {
                            const noResult = text.includes('search-no-results') ||
                                /Search Result For:.*\(\s*0\s*\)/i.test(text) ||
                                /搜索结果\s*[:：]?.*\(\s*0\s*\)/.test(text) ||
                                /搜索结果\s*[:：]?.*（\s*0\s*）/.test(text);
                            if (noResult) resolve(false);
                            else resolve(true);
                        } else if (type === 'sukebei') {
                            if (text.includes('No torrents found') || text.includes('没有种子')) resolve(false);
                            else resolve(true);
                        } else {
                            resolve(true);
                        }
                    },
                    onerror: () => resolve(true),
                    ontimeout: () => resolve(true)
                });
            });
        }
    }

    class TagManager {
        static TAGS_KEY = 'tags_v1';
        static MASTER_TAG_LIST_KEY = 'master_tags_v1';
        static tags = {};
        static masterTagList = new Set();
        static _saveTimer = null;
        static SAVE_DELAY_MS = 600;
        static _emitCollectionChanged(id) {
            AppEvents.emit('collectionChanged', { id, tags: this.getTags(id) });
        }
        static _emitMasterTagsChanged() {
            AppEvents.emit('collectionTagsChanged', { masterTags: this.getMasterTagList() });
        }
        static load() {
            this.tags = StorageManager.get(this.TAGS_KEY, {});
            const loadedMasterList = StorageManager.get(this.MASTER_TAG_LIST_KEY, []);
            this.masterTagList = new Set(loadedMasterList);
        }
        static save() {
            this._scheduleSave();
        }

        static _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, this.SAVE_DELAY_MS);
        }

        static _doSave() {
            StorageManager.set(this.TAGS_KEY, this.tags);
            StorageManager.set(this.MASTER_TAG_LIST_KEY, [...this.masterTagList].sort());
        }

        static flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }

        static getTags(id) {
            return this.tags[id] || [];
        }

        static getMasterTagList() {
            return [...this.masterTagList].sort();
        }

        static getAllTaggedItems() {
            const itemsByTag = {};
            this.getMasterTagList().forEach(tag => itemsByTag[tag] = []);
            for (const id in this.tags) {
                const tags = this.tags[id];
                tags.forEach(tag => {
                    if (itemsByTag[tag]) {
                        itemsByTag[tag].push(id);
                    }
                });
            }
            return itemsByTag;
        }

        static addMasterTag(tag) {
            const trimmedTag = tag.trim();
            if (trimmedTag && !this.masterTagList.has(trimmedTag)) {
                this.masterTagList.add(trimmedTag);
                this.save();
                this._emitMasterTagsChanged();
                return true;
            }
            return false;
        }

        static editMasterTag(oldTag, newTag) {
            const trimmedNewTag = newTag.trim();
            if (!trimmedNewTag || !this.masterTagList.has(oldTag) || this.masterTagList.has(trimmedNewTag)) {
                return false;
            }
            this.masterTagList.delete(oldTag);
            this.masterTagList.add(trimmedNewTag);

            const affectedIds = [];
            for (const id in this.tags) {
                const itemTags = new Set(this.tags[id]);
                if (itemTags.has(oldTag)) {
                    itemTags.delete(oldTag);
                    itemTags.add(trimmedNewTag);
                    this.tags[id] = [...itemTags];
                    affectedIds.push(id);
                }
            }
            this.save();
            this._emitMasterTagsChanged();
            affectedIds.forEach(id => this._emitCollectionChanged(id));
            return true;
        }

        static deleteMasterTag(tagToDelete) {
            if (!this.masterTagList.has(tagToDelete)) return false;
            this.masterTagList.delete(tagToDelete);
            const affectedIds = [];
            for (const id in this.tags) {
                const initialLength = this.tags[id].length;
                this.tags[id] = this.tags[id].filter(tag => tag !== tagToDelete);
                if (this.tags[id].length === 0 && initialLength > 0) {
                    delete this.tags[id];
                    this._onItemRemoved(id); // 视频来源
                    affectedIds.push(id);
                } else if (initialLength !== this.tags[id].length) {
                    affectedIds.push(id);
                }
            }
            this.save();
            this._emitMasterTagsChanged();
            affectedIds.forEach(id => this._emitCollectionChanged(id));
            return true;
        }

        static setTags(id, tagsArray) {
            if (!id || !Array.isArray(tagsArray)) return;
            const prevTags = this.getTags(id);
            const prevMasterSize = this.masterTagList.size;
            const cleanedTags = [...new Set(tagsArray.map(t => t.trim()).filter(Boolean))];
            cleanedTags.forEach(tag => this.masterTagList.add(tag));

            if (cleanedTags.length > 0) {
                this.tags[id] = cleanedTags;
            } else {
                delete this.tags[id];
                this._onItemRemoved(id); // 视频来源
            }
            this.save();
            if (this.masterTagList.size !== prevMasterSize) this._emitMasterTagsChanged();
            const changed = JSON.stringify(prevTags) !== JSON.stringify(this.getTags(id));
            if (changed) this._emitCollectionChanged(id);
        }

        static _onItemRemoved(id) {
            CollectionMagnetManager.delete(id);
            CollectionImageManager.delete(id);
        }
    }

    class ItemDetailsManager {
        static ITEM_DETAILS_KEY = 'item_details_v1';
        static MAX_ITEM_DETAILS_SIZE = 1000;
        static details = new Map();
        static _saveTimer = null;
        static SAVE_DELAY_MS = 800;

        static load() {
            try {
                const storedDetails = JSON.parse(StorageManager.get(this.ITEM_DETAILS_KEY, '[]'));
                this.details = new Map(storedDetails);
            } catch (e) {
                this.details = new Map();
            }
        }

        static save() {
            this._scheduleSave();
        }

        static _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, this.SAVE_DELAY_MS);
        }

        static _doSave() {
            while (this.details.size > this.MAX_ITEM_DETAILS_SIZE) {
                const oldestKey = this.details.keys().next().value;
                this.details.delete(oldestKey);
            }
            StorageManager.set(this.ITEM_DETAILS_KEY, JSON.stringify([...this.details]));
        }

        static flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }

        static get(id) {
            return this.details.get(id);
        }

        static set(id, data) {
            if (!id || !data.title || !data.imageUrl) return;
            this.details.set(id, data);
            if (this.details.size > this.MAX_ITEM_DETAILS_SIZE) {
                const oldestKey = this.details.keys().next().value;
                this.details.delete(oldestKey);
            }
            this.save();
        }
    }

    class HistoryManager {
        static history = [];
        static _saveTimer = null;
        static SAVE_DELAY_MS = 600;
        static load() {
            if (!SettingsManager.get('enableHistory')) return;
            try {
                const storedHistory = JSON.parse(StorageManager.get(Config.HISTORY_KEY, '[]'));
                if (!Array.isArray(storedHistory)) { this.history = []; return; }
                if (storedHistory.length > 0 && typeof storedHistory[0] === 'string') {
                    this.history = storedHistory.map(id => ({ id: String(id), timestamp: Date.now() }));
                    this.save();
                } else { this.history = storedHistory; }
            } catch (e) { this.history = []; }
        }
        static save() {
            if (!SettingsManager.get('enableHistory')) return;
            this._scheduleSave();
        }

        static _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, this.SAVE_DELAY_MS);
        }

        static _doSave() {
            if (!SettingsManager.get('enableHistory')) return;
            if (this.history.length > Config.MAX_HISTORY_SIZE) {
                this.history.splice(0, this.history.length - Config.MAX_HISTORY_SIZE);
            }
            StorageManager.set(Config.HISTORY_KEY, JSON.stringify(this.history));
        }

        static flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }
        static add(id) {
            if (!SettingsManager.get('enableHistory') || !id) return;
            this.history = this.history.filter(item => item.id !== id);
            this.history.push({ id, timestamp: Date.now() });
            if (this.history.length > Config.MAX_HISTORY_SIZE) {
                this.history.splice(0, this.history.length - Config.MAX_HISTORY_SIZE);
            }
            this.save();
        }
        static remove(id) {
            if (!SettingsManager.get('enableHistory') || !id) return;
            const initialLength = this.history.length;
            this.history = this.history.filter(item => item.id !== id);
            if (this.history.length < initialLength) {
                this.save();
            }
        }
        static has(id) {
            if (!SettingsManager.get('enableHistory')) return false;
            return this.history.some(item => item.id === id);
        }
        static getRawData() { return this.history; }
        static clear() {
            this.history = [];
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            StorageManager.delete(Config.HISTORY_KEY, { immediate: true });
        }
    }

    class SettingsManager {
        static settings = {};
        static defaults = {
            previewMode: 'hover', // 更改：悬停 + 点击播放
            hideNoMagnet: false,
            hideCensored: false,
            cardLayoutMode: 'default',
            buttonStyle: 'icon',
            loadExtraPreviews: true, // 基于时间的节流
            enableHistory: true,
            hideViewed: false,
            enableCollection: true,
            sourceFourhoi: true, // 缩略图来源
            sourceWumaobi: true, // 缩略图来源
            sourcePPVDataBank: true, // 缩略图来源
            sourceJavPop: true, // 缩略图来源
            sourceFC2Direct: true, // 缩略图来源
            sourceFC2PPVMe: true, // 缩略图来源
            sourceDetailWumaobi: true, // 视频来源
            sourceDetailPPVDataBank: true, // 视频来源
            sourceDetailJavPop: true, // 视频来源
            sourceDetailFC2Direct: true, // 视频来源
            sourceVideoMissAV: true, // 视频来源
            sourceVideoSupjav: true, // 视频来源
            sourceVideoSukebei: true, // 视频来源
            sourceMagnet: true, // 视频来源列表
            forceRefreshOnBack: true, // 基于时间的节流
            openDetailsInNewTab: false,
            preferFd2SiteImage: true,
            glowColor: '#cba6f7', // 视频来源列表
            viewedColor: '#f5c2e7', // 缩略图来源
            theme: 'dark', // 缩略图来源
            imageLoadTimeout: Config.IMAGE_LOAD_TIMEOUT,
            imageChainTimeout: Config.IMAGE_CHAIN_TIMEOUT,
            imageLoadConcurrency: Config.IMAGE_LOAD_CONCURRENCY,
        };
        static load() { this.settings = { ...this.defaults, ...StorageManager.get(Config.SETTINGS_KEY, {}) }; }
        static get(key) { return this.settings[key]; }
        static getAll() { return this.settings; }
        static getNumber(key, fallback, min = -Infinity, max = Infinity) {
            const raw = this.get(key);
            const value = parseInt(raw, 10);
            if (!Number.isFinite(value)) return fallback;
            if (value < min) return min;
            if (value > max) return max;
            return value;
        }
        static set(key, value) {
            const oldValue = this.settings[key];
            if (oldValue !== value) {
                this.settings[key] = value;
                this.save();
                AppEvents.emit('settingsChanged', { key, newValue: value, oldValue });
            }
        }
        static save() { StorageManager.set(Config.SETTINGS_KEY, this.settings); }
    }

    class AchievementManager {
        static unlockedIds = new Set();
        static _achievements = [
            {
                id: 'view10', titleKey: 'ach_view10_title', descriptionKey: 'ach_view10_desc', icon: 'fa-seedling',
                isUnlocked: stats => stats.historyData.length >= 10,
                getProgress: stats => ({ current: stats.historyData.length, max: 10 })
            },
            {
                id: 'view100', titleKey: 'ach_view100_title', descriptionKey: 'ach_view100_desc', icon: 'fa-tree',
                isUnlocked: stats => stats.historyData.length >= 100,
                getProgress: stats => ({ current: stats.historyData.length, max: 100 })
            },
            {
                id: 'view1000', titleKey: 'ach_view1000_title', descriptionKey: 'ach_view1000_desc', icon: 'fa-forest',
                isUnlocked: stats => stats.historyData.length >= 1000,
                getProgress: stats => ({ current: stats.historyData.length, max: 1000 })
            },
            {
                id: 'cache5000', titleKey: 'ach_cache50_title', descriptionKey: 'ach_cache50_desc', icon: 'fa-bolt-lightning',
                isUnlocked: stats => stats.cacheStats.hits >= 5000,
                getProgress: stats => ({ current: stats.cacheStats.hits, max: 5000 })
            },
            {
                id: 'cache20000', titleKey: 'ach_cache500_title', descriptionKey: 'ach_cache500_desc', icon: 'fa-rocket',
                isUnlocked: stats => stats.cacheStats.hits >= 20000,
                getProgress: stats => ({ current: stats.cacheStats.hits, max: 20000 })
            },
            {
                id: 'nightOwl', titleKey: 'ach_nightOwl_title', descriptionKey: 'ach_nightOwl_desc', icon: 'fa-moon',
                isUnlocked: stats => stats.historyData.some(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 2 && hour < 4; }),
                getProgress: stats => ({ current: stats.historyData.filter(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 2 && hour < 4; }).length, max: 1 })
            },
            {
                id: 'earlyBird', titleKey: 'ach_earlyBird_title', descriptionKey: 'ach_earlyBird_desc', icon: 'fa-sun',
                isUnlocked: stats => stats.historyData.some(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 5 && hour < 7; }),
                getProgress: stats => ({ current: stats.historyData.filter(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 5 && hour < 7; }).length, max: 1 })
            },
            {
                id: 'weekendWarrior', titleKey: 'ach_weekendWarrior_title', descriptionKey: 'ach_weekendWarrior_desc', icon: 'fa-calendar-week',
                isUnlocked: stats => {
                    const weekendViews = new Map();
                    stats.historyData.forEach(item => {
                        const date = new Date(item.timestamp);
                        const day = date.getDay();
                        if (day === 0 || day === 6) {
                            const saturdayDate = new Date(date);
                            if (day === 0) saturdayDate.setDate(date.getDate() - 1);
                            const weekKey = saturdayDate.toISOString().slice(0, 10);
                            weekendViews.set(weekKey, (weekendViews.get(weekKey) || 0) + 1);
                        }
                    });
                    return [...weekendViews.values()].some(count => count >= 30);
                },
                getProgress: stats => {
                    const weekendViews = new Map();
                    stats.historyData.forEach(item => {
                        const date = new Date(item.timestamp);
                        const day = date.getDay();
                        if (day === 0 || day === 6) {
                            const saturdayDate = new Date(date);
                            if (day === 0) saturdayDate.setDate(date.getDate() - 1);
                            const weekKey = saturdayDate.toISOString().slice(0, 10);
                            weekendViews.set(weekKey, (weekendViews.get(weekKey) || 0) + 1);
                        }
                    });
                    const maxWeekend = Math.max(0, ...weekendViews.values());
                    return { current: maxWeekend, max: 30 };
                }
            },
            {
                id: 'endurance', titleKey: 'ach_endurance_title', descriptionKey: 'ach_endurance_desc', icon: 'fa-calendar-days',
                isUnlocked: stats => { /* 为简洁复制逻辑，理想情况下应抽为辅助函数 */
                    if (stats.historyData.length < 7) return false;
                    const uniqueDays = new Set(stats.historyData.map(item => new Date(item.timestamp).toISOString().slice(0, 10)));
                    const sortedDays = [...uniqueDays].sort();
                    let consecutiveCount = 1; let maxConsecutive = 1;
                    for (let i = 1; i < sortedDays.length; i++) {
                        const diff = (new Date(sortedDays[i]) - new Date(sortedDays[i - 1])) / (1000 * 60 * 60 * 24);
                        if (diff === 1) { consecutiveCount++; maxConsecutive = Math.max(maxConsecutive, consecutiveCount); }
                        else { consecutiveCount = 1; }
                    }
                    return maxConsecutive >= 7;
                },
                getProgress: stats => {
                    const uniqueDays = new Set(stats.historyData.map(item => new Date(item.timestamp).toISOString().slice(0, 10)));
                    const sortedDays = [...uniqueDays].sort();
                    let consecutiveCount = 1; let maxConsecutive = 1;
                    if (sortedDays.length === 0) return { current: 0, max: 7 };
                    for (let i = 1; i < sortedDays.length; i++) {
                        const diff = (new Date(sortedDays[i]) - new Date(sortedDays[i - 1])) / (1000 * 60 * 60 * 24);
                        if (diff === 1) { consecutiveCount++; maxConsecutive = Math.max(maxConsecutive, consecutiveCount); }
                        else { consecutiveCount = 1; }
                    }
                    return { current: maxConsecutive, max: 7 };
                }
            },
            {
                id: 'fullThrottle', titleKey: 'ach_fullThrottle_title', descriptionKey: 'ach_fullThrottle_desc', icon: 'fa-gauge-high',
                isUnlocked: stats => {
                    if (stats.historyData.length < 20) return false;
                    const sortedHistory = [...stats.historyData].sort((a, b) => a.timestamp - b.timestamp);
                    for (let i = 0; i <= sortedHistory.length - 20; i++) {
                        if (sortedHistory[i + 19].timestamp - sortedHistory[i].timestamp <= 3600000) return true;
                    }
                    return false;
                },
                getProgress: stats => {
                    // 近 1 小时的近似最大值
                    // 精确计算“当前最大值”成本很高，因此简化处理：
                    // 迁移：若已收藏但收藏缓存缺失，则尝试全局缓存并迁移
                    // 计算：以 1 小时为滑动窗口，取最大次数。
                    const sortedHistory = [...stats.historyData].sort((a, b) => a.timestamp - b.timestamp);
                    let maxInHour = 0;
                    if (sortedHistory.length === 0) return { current: 0, max: 20 };
                    for (let i = 0; i < sortedHistory.length; i++) {
                        let count = 0;
                        const startTime = sortedHistory[i].timestamp;
                        const endTime = startTime + 3600000;
                        for (let j = i; j < sortedHistory.length; j++) {
                            if (sortedHistory[j].timestamp <= endTime) count++;
                            else break;
                        }
                        maxInHour = Math.max(maxInHour, count);
                    }
                    return { current: maxInHour, max: 20 };
                }
            },
            {
                id: 'luckyNumber', titleKey: 'ach_luckyNumber_title', descriptionKey: 'ach_luckyNumber_desc', icon: 'fa-clover',
                isUnlocked: stats => stats.historyData.some(item => item.id.includes('666') || item.id.includes('888')),
                getProgress: stats => ({ current: stats.historyData.filter(item => item.id.includes('666') || item.id.includes('888')).length > 0 ? 1 : 0, max: 1 })
            },
            {
                id: 'veteranDriver', titleKey: 'ach_veteranDriver_title', descriptionKey: 'ach_veteranDriver_desc', icon: 'fa-award',
                isUnlocked: stats => {
                    if (stats.historyData.length < 2) return false;
                    const timestamps = stats.historyData.map(item => item.timestamp);
                    return (Math.max(...timestamps) - Math.min(...timestamps)) > (365 * 24 * 60 * 60 * 1000);
                },
                getProgress: stats => {
                    if (stats.historyData.length < 2) return { current: 0, max: 365 };
                    const timestamps = stats.historyData.map(item => item.timestamp);
                    const diffDays = (Math.max(...timestamps) - Math.min(...timestamps)) / (24 * 60 * 60 * 1000);
                    return { current: Math.floor(diffDays), max: 365 };
                }
            },
            // --- 事件监听 ---
            {
                id: 'malnourished', titleKey: 'ach_malnourished_title', descriptionKey: 'ach_malnourished_desc', icon: 'fa-skull', type: 'debuff',
                isUnlocked: stats => {
                    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                    return stats.historyData.filter(item => item.timestamp > oneDayAgo).length > 30;
                },
                getProgress: stats => {
                    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                    return { current: stats.historyData.filter(item => item.timestamp > oneDayAgo).length, max: 30 };
                }
            },
            {
                id: 'dopamine', titleKey: 'ach_dopamine_title', descriptionKey: 'ach_dopamine_desc', icon: 'fa-dna', type: 'debuff',
                isUnlocked: stats => {
                    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                    return stats.historyData.filter(item => item.timestamp > thirtyDaysAgo).length > 500;
                },
                getProgress: stats => {
                    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                    return { current: stats.historyData.filter(item => item.timestamp > thirtyDaysAgo).length, max: 500 };
                }
            },
            {
                id: 'notEvenTrying', titleKey: 'ach_notEvenTrying_title', descriptionKey: 'ach_notEvenTrying_desc', icon: 'fa-bed', type: 'debuff', // 悖论：通过“不做某事”解锁“负面效果”？还是增益？这里称为负面样式。
                isUnlocked: stats => {
                    if (stats.historyData.length === 0) return false; // 缩略图来源
                    const lastView = Math.max(...stats.historyData.map(i => i.timestamp));
                    return (Date.now() - lastView) > 3 * 24 * 60 * 60 * 1000;
                },
                getProgress: stats => {
                    if (stats.historyData.length === 0) return { current: 0, max: 3 };
                    const lastView = Math.max(...stats.historyData.map(i => i.timestamp));
                    const daysSince = (Date.now() - lastView) / (24 * 60 * 60 * 1000);
                    return { current: parseFloat(daysSince.toFixed(1)), max: 3 };
                }
            },
            {
                id: 'storageCrisis', titleKey: 'ach_storageCrisis_title', descriptionKey: 'ach_storageCrisis_desc', icon: 'fa-floppy-disk', type: 'debuff',
                isUnlocked: stats => stats.cacheSize >= Config.CACHE_MAX_SIZE * 0.9,
                getProgress: stats => ({ current: stats.cacheSize, max: Math.floor(Config.CACHE_MAX_SIZE * 0.9) })
            },
            // --- 首次击杀移到最后 ---
            {
                id: 'achievementHunter', titleKey: 'ach_achievementHunter_title', descriptionKey: 'ach_achievementHunter_desc', icon: 'fa-gift',
                isUnlocked: () => AchievementManager.getUnlockedIds().size >= 1,
                getProgress: () => ({ current: Math.min(1, AchievementManager.getUnlockedIds().size), max: 1 })
            },
        ];
        static load() { this.unlockedIds = new Set(StorageManager.get(Config.ACHIEVEMENTS_KEY, [])); }
        static checkAll(stats) {
            let newUnlocked = false;
            this._achievements.forEach(ach => {
                if (!this.unlockedIds.has(ach.id) && ach.isUnlocked(stats)) {
                    this.unlockedIds.add(ach.id);
                    newUnlocked = true;
                }
            });
            if (newUnlocked) {
                this._achievements.forEach(ach => {
                    if (ach.id === 'achievementHunter' && !this.unlockedIds.has(ach.id) && ach.isUnlocked(stats)) {
                        this.unlockedIds.add(ach.id);
                    }
                });
                StorageManager.set(Config.ACHIEVEMENTS_KEY, [...this.unlockedIds]);
            }
        }
        static getAll() { return this._achievements; }
        static getUnlockedIds() { return this.unlockedIds; }
    }

    class CacheManager {
        constructor() {
            this.key = Config.CACHE_KEY; this.maxSize = Config.CACHE_MAX_SIZE;
            this.expirationMs = Config.CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
            this.data = new Map(); this.load();
        }
        load() {
            try {
                const data = JSON.parse(StorageManager.get(this.key) || '{}');
                const now = Date.now();
                Object.entries(data)
                    .filter(([, value]) => value?.t && now - value.t < this.expirationMs)
                    .forEach(([key, value]) => this.data.set(key, value));
            } catch (e) { this.data = new Map(); }
        }
        getEntry(id) {
            const item = this.data.get(id);
            if (!item || Date.now() - item.t >= this.expirationMs) {
                if (item) this.data.delete(id);
                return { has: false, value: null };
            }
            // 触碰以更新 LRU 顺序
            this.data.delete(id); this.data.set(id, item);
            StatsTracker.increment('cacheHits');
            return { has: true, value: item.v };
        }
        get(id) { return this.getEntry(id).value; }
        set(id, value) {
            if (this.data.size >= this.maxSize && !this.data.has(id)) {
                this.data.delete(this.data.keys().next().value);
            }
            this.data.set(id, { v: value, t: Date.now() });
        }
        save() { StorageManager.set(this.key, JSON.stringify(Object.fromEntries(this.data))); }
        clear() { this.data.clear(); StorageManager.delete(this.key); }
        getSize() { return this.data.size; }
    }

    class ImageCacheManager {
        static SAVE_DELAY_MS = 800;
        constructor() {
            this.key = Config.IMAGE_CACHE_KEY;
            this.maxSize = Config.IMAGE_CACHE_MAX_SIZE;
            this.expirationMs = Config.IMAGE_CACHE_EXPIRATION_HOURS * 60 * 60 * 1000;
            this.data = new Map();
            this.load();
            this._saveTimer = null;
        }
        load() {
            try {
                const json = StorageManager.get(this.key) || '{}';
                const obj = JSON.parse(json);
                const now = Date.now();
                Object.entries(obj).forEach(([k, v]) => {
                    if (v && v.t && (now - v.t < this.expirationMs)) {
                        this.data.set(k, v);
                    }
                });
            } catch (e) { this.data = new Map(); }
        }
        get(id) {
            const item = this.data.get(id);
            if (!item) return null;
            if (Date.now() - item.t > this.expirationMs) {
                this.data.delete(id);
                this.save();
                return null;
            }
            StatsTracker.increment('cacheHits');
            return item.url;
        }
        set(id, url) {
            if (!url || url.startsWith('blob:') || url.startsWith('data:')) return; // 不缓存临时 URL 或 DataURL
            if (this.data.has(id)) this.data.delete(id); // 刷新顺序
            this.data.set(id, { url: url, t: Date.now() });
            this.trim();
            this.save();
        }
        trim() {
            if (this.data.size > this.maxSize) {
                // 删除最旧的
                const keys = [...this.data.keys()];
                const deleteCount = this.data.size - this.maxSize;
                for (let i = 0; i < deleteCount; i++) {
                    this.data.delete(keys[i]);
                }
            }
        }
        save() { this._scheduleSave(); }
        _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, ImageCacheManager.SAVE_DELAY_MS);
        }
        _doSave() {
            const obj = Object.fromEntries(this.data);
            StorageManager.set(this.key, JSON.stringify(obj));
        }
        flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }
        clear(excludeIds) {
            if (!excludeIds || excludeIds.size === 0) {
                this.data.clear();
                StorageManager.delete(this.key, { immediate: true });
            } else {
                for (const id of this.data.keys()) {
                    if (!excludeIds.has(id)) this.data.delete(id);
                }
                this.flush();
            }
        }
    }
    const GlobalImageCache = new ImageCacheManager();


    // --- 第一步：收藏专用磁力缓存（无限） ---
    class CollectionMagnetManager {
        static KEY = 'fc2_turbo_collection_magnets';
        static magnets = null; // 视频来源
        static _saveTimer = null;
        static SAVE_DELAY_MS = 600;

        static load() {
            if (this.magnets) return;
            this.magnets = StorageManager.get(this.KEY, {});
        }

        static save() { this._scheduleSave(); }
        static _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, this.SAVE_DELAY_MS);
        }
        static _doSave() {
            StorageManager.set(this.KEY, this.magnets);
        }
        static flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }

        static get(id) {
            this.load();
            return this.magnets[id];
        }

        static set(id, magnetLink) {
            this.load();
            this.magnets[id] = magnetLink;
            this.save();
        }

        static has(id) {
            this.load();
            return Object.prototype.hasOwnProperty.call(this.magnets, id);
        }

        static delete(id) {
            this.load();
            if (this.has(id)) {
                delete this.magnets[id];
                this.save();
            }
        }
    }

    // --- 第一步b：收藏专用图片缓存（无限） ---
    class CollectionImageManager {
        static KEY = 'fc2_turbo_collection_images';
        static images = null;
        static _saveTimer = null;
        static SAVE_DELAY_MS = 600;

        static load() {
            if (this.images) return;
            this.images = StorageManager.get(this.KEY, {});
        }

        static save() { this._scheduleSave(); }
        static _scheduleSave() {
            if (this._saveTimer) return;
            this._saveTimer = setTimeout(() => {
                this._saveTimer = null;
                this._doSave();
            }, this.SAVE_DELAY_MS);
        }
        static _doSave() {
            StorageManager.set(this.KEY, this.images);
        }
        static flush() {
            if (this._saveTimer) {
                clearTimeout(this._saveTimer);
                this._saveTimer = null;
            }
            this._doSave();
        }

        static get(id) {
            this.load();
            return this.images[id];
        }

        static set(id, url) {
            this.load();
            this.images[id] = url;
            this.save();
        }

        static has(id) {
            this.load();
            return Object.prototype.hasOwnProperty.call(this.images, id);
        }

        static delete(id) {
            this.load();
            if (this.has(id)) {
                delete this.images[id];
                this.save();
            }
        }
    }

    class NetworkManager {
        static async fetchMagnetLinks(fc2Ids) {
            if (!fc2Ids || fc2Ids.length === 0) return new Map();
            for (let attempt = 0; attempt <= Config.NETWORK.MAX_RETRIES; attempt++) {
                try {
                    if (attempt > 0) await Utils.sleep(Config.NETWORK.RETRY_DELAY * attempt);
                    return await this._doFetchMagnets(fc2Ids);
                } catch (e) {
                    if (attempt === Config.NETWORK.MAX_RETRIES) return new Map();
                }
            }
            return new Map();
        }

        // ---从 adult.contents.fc2.com 获取封面---
        static async fetchFC2DirectThumbnail(fc2Id) {
            return new Promise((resolve) => {
                const url = `https://adult.contents.fc2.com/article/${fc2Id}/`;
                const timeoutMs = SettingsManager.getNumber('imageLoadTimeout', Config.IMAGE_LOAD_TIMEOUT, 0, 60000);
                let settled = false;
                let timer = null;
                const finish = (value) => {
                    if (settled) return;
                    settled = true;
                    if (timer) clearTimeout(timer);
                    resolve(value);
                };
                if (timeoutMs > 0) {
                    timer = setTimeout(() => finish(null), timeoutMs);
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: timeoutMs,
                    onload: (res) => {
                        if (res.status !== 200) return finish(null);
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');

                            // 策略 1：元标签（高质量）
                            let cover = doc.querySelector('meta[property="og:image"]')?.content ||
                                doc.querySelector('meta[name="twitter:image"]')?.content;

                            // 策略 2：DOM 选择器（后备）
                            if (!cover) {
                                const coverSelectors = [
                                    '.items_article_MainThumbnail img',
                                    'div[class*="MainThumbnail"] img',
                                    '.items_article_MainItemThumb img',
                                    '.main_image img',
                                    '.main-photo img'
                                ];
                                for (const sel of coverSelectors) {
                                    const el = doc.querySelector(sel);
                                    if (el) {
                                        const parentLink = el.closest('a');
                                        if (parentLink && /\.(jpg|png|jpeg)$/i.test(parentLink.href)) {
                                            cover = parentLink.href;
                                        } else {
                                            cover = el.src;
                                        }
                                        break; // 找到即止
                                    }
                                }
                            }

                            // 如果找到的是相对路径，补全为绝对路径
                            if (cover && !cover.startsWith('http')) {
                                cover = new URL(cover, url).href;
                            }

                            finish(cover || null);
                        } catch (e) {
                            console.error("FC2 Direct Fetch Error:", e);
                            finish(null);
                        }
                    },
                    onerror: () => finish(null),
                    ontimeout: () => finish(null)
                });
            });
        }

        // --- 新增：从 FC2PPV.me 获取封面 ---
        static async fetchFC2PPVMeThumbnail(fc2Id) {
            return new Promise((resolve) => {
                const url = `https://fc2ppv.me/fc2-ppv-${fc2Id}`;
                const timeoutMs = SettingsManager.getNumber('imageLoadTimeout', Config.IMAGE_LOAD_TIMEOUT, 0, 60000);
                let settled = false;
                let timer = null;
                const finish = (value) => {
                    if (settled) return;
                    settled = true;
                    if (timer) clearTimeout(timer);
                    resolve(value);
                };
                if (timeoutMs > 0) {
                    timer = setTimeout(() => finish(null), timeoutMs);
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: timeoutMs,
                    onload: (res) => {
                        if (res.status !== 200) return finish(null);
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                            // 目标选择器：.items_article_MainitemThumb img
                            const img = doc.querySelector('.items_article_MainitemThumb img');
                            const src = img?.getAttribute('src');
                            if (src) return finish(src);
                        } catch (e) { console.error("FC2PPV.me Fetch Error:", e); }
                        finish(null);
                    },
                    onerror: () => finish(null),
                    ontimeout: () => finish(null)
                });
            });
        }




        static _doFetchMagnets(ids) {
            return new Promise((resolve, reject) => {
                const query = ids.map(id => `fc2-ppv-${id}`).join('|');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(query)}&s=seeders&o=desc`,
                    timeout: Config.NETWORK.API_TIMEOUT,
                    onload: (res) => {
                        if (res.status !== 200) return reject();
                        const magnetMap = new Map();
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        doc.querySelectorAll('table.torrent-list tbody tr').forEach(row => {
                            const title = row.querySelector('td[colspan="2"] a:not(.comments)')?.textContent;
                            const magnetLink = row.querySelector("a[href^='magnet:?']")?.href;
                            const match = title?.match(/fc2-ppv-(\d+)/i);
                            if (match?.[1] && magnetLink && !magnetMap.has(match[1])) {
                                magnetMap.set(match[1], magnetLink);
                            }
                        });
                        resolve(magnetMap);
                    },
                    onerror: reject,
                    ontimeout: reject
                });
            });
        }
        static async fetchExtraPreviews(fc2Id) {
            // 1. 尝试 Wumaobi
            if (SettingsManager.get('sourceDetailWumaobi')) {
                const wumaobiResults = await this._fetchWumaobiExtra(fc2Id);
                if (wumaobiResults.length > 0) return wumaobiResults;
            }

            // 2. 回退到 JavPop
            if (SettingsManager.get('sourceDetailJavPop')) {
                const javPopResults = await this._fetchJavPopExtra(fc2Id);
                if (javPopResults.length > 0) return javPopResults;
            }

            // 3. 回退到 PPVDataBank
            if (SettingsManager.get('sourceDetailPPVDataBank')) {
                const ppvDataBankResults = await this._fetchPPVDataBankExtra(fc2Id);
                if (ppvDataBankResults.length > 0) return ppvDataBankResults;
            }

            // 4. 回退到 FC2 Direct（新备用源）
            if (SettingsManager.get('sourceDetailFC2Direct')) {
                return await this._fetchFC2DirectExtra(fc2Id);
            }
            return [];
        }

        static _fetchWumaobiExtra(fc2Id) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://wumaobi.com/fc2daily/detail/FC2-PPV-${fc2Id}`,
                    timeout: 8000,
                    onload: (res) => {
                        if (res.status !== 200) return resolve([]);
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        const results = [];
                        const previewUrlHost = "https://wumaobi.com";

                        doc.querySelectorAll('img').forEach(img => {
                            try {
                                const src = img.getAttribute('src');
                                if (!src) return;
                                const fullSrc = src.startsWith('http') ? src : (src.startsWith('/') ? previewUrlHost + src : previewUrlHost + '/' + src);
                                if (fullSrc.includes('grid') && !fullSrc.match(/logo|icon|banner/i)) {
                                    results.push({ type: 'image', src: fullSrc });
                                }
                            } catch { }
                        });
                        doc.querySelectorAll('video').forEach(v => {
                            try {
                                const src = v.getAttribute('src');
                                if (!src) return;
                                const fullSrc = src.startsWith('http') ? src : (src.startsWith('/') ? previewUrlHost + src : previewUrlHost + '/' + src);
                                results.push({ type: 'video', src: fullSrc });
                            } catch { }
                        });
                        resolve(results);
                    },
                    onerror: () => resolve([]),
                    ontimeout: () => resolve([])
                });
            });
        }
        static async _fetchPPVDataBankExtra(fc2Id) {
            const results = [];
            const baseUrl = `https://ppvdatabank.com/article/${fc2Id}/img/ps`;
            const loadImageElement = (url, timeout = 8000) => new Promise(resolve => {
                const img = document.createElement('img');
                let done = false;
                const cleanup = () => {
                    img.onload = null;
                    img.onerror = null;
                };
                const finish = (ok) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(ok ? img : null);
                };
                const timer = setTimeout(() => finish(false), timeout);
                img.onload = () => {
                    clearTimeout(timer);
                    finish(true);
                };
                img.onerror = () => {
                    clearTimeout(timer);
                    finish(false);
                };
                img.src = url;
            });

            const firstUrl = `${baseUrl}1.webp`;
            const firstImg = await loadImageElement(firstUrl);
            if (!firstImg) return results;
            results.push({ type: 'image', src: firstUrl, element: firstImg });

            for (let index = 2; index <= 30; index++) {
                const nextUrl = `${baseUrl}${index}.webp`;
                const nextImg = await loadImageElement(nextUrl);
                if (!nextImg) break;
                results.push({ type: 'image', src: nextUrl, element: nextImg });
            }
            return results;
        }
        static async _fetchJavPopExtra(fc2Id) {
            const results = [];
            const baseUrl = `https://i0.wp.com/img.javpop.com/fc2/fc2_ppv-${fc2Id}`;
            const loadImageElement = (url, timeout = 8000) => new Promise(resolve => {
                const img = document.createElement('img');
                let done = false;
                const cleanup = () => {
                    img.onload = null;
                    img.onerror = null;
                };
                const finish = (ok) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(ok ? img : null);
                };
                const timer = setTimeout(() => finish(false), timeout);
                img.onload = () => {
                    clearTimeout(timer);
                    finish(true);
                };
                img.onerror = () => {
                    clearTimeout(timer);
                    finish(false);
                };
                img.src = url;
            });

            // 1. 显示加载占位
            // https://i0.wp.com/img.javpop.com/fc2/fc2_ppv-{ID}_screenshot.jpg
            const basicUrl = `${baseUrl}_screenshot.jpg`;
            const basicImg = await loadImageElement(basicUrl);
            if (basicImg) {
                results.push({ type: 'image', src: basicUrl, element: basicImg });
            }

            // 2. 检查从 0 开始的序列截图
            // https://i0.wp.com/img.javpop.com/fc2/fc2_ppv-{ID}_0_screenshot.jpg
            const zeroUrl = `${baseUrl}_0_screenshot.jpg`;
            const zeroImg = await loadImageElement(zeroUrl);
            if (!zeroImg) return results;
            results.push({ type: 'image', src: zeroUrl, element: zeroImg });

            // 若 0 存在，则尝试 2、3……
            for (let index = 2; index <= 30; index++) {
                const nextUrl = `${baseUrl}_${index}_screenshot.jpg`;
                const nextImg = await loadImageElement(nextUrl);
                if (!nextImg) break;
                results.push({ type: 'image', src: nextUrl, element: nextImg });
            }
            return results;
        }

        static async _fetchFC2DirectExtra(fc2Id) {
            return new Promise((resolve) => {
                const url = `https://adult.contents.fc2.com/article/${fc2Id}/`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (res) => {
                        if (res.status !== 200) return resolve([]);
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                            const results = [];

                            // 策略：在样本区查找包裹图片的 A 标签（高分辨率）
                            const sampleLinks = doc.querySelectorAll('.items_article_SampleImagesArea a, .items_article_SampleImages a, ul.slides li a');
                            sampleLinks.forEach(a => {
                                const href = a.href;
                                if (href && /\.(jpg|png|jpeg|gif)/i.test(href)) {
                                    // 检查有效的 FC2 域名或绝对 URL
                                    if (/fc2\.com/.test(href) && !href.includes('no_image')) {
                                        results.push({ type: 'image', src: href });
                                    }
                                }
                            });

                            // 回退：若无链接，直接查找图片（src 或 data-src）
                            if (results.length === 0) {
                                const sampleImages = doc.querySelectorAll('.items_article_SampleImagesArea img, .items_article_SampleImages img, ul.slides li img');
                                sampleImages.forEach(img => {
                                    let src = img.getAttribute('data-src') || img.getAttribute('src');
                                    if (src && !src.includes('no_image') && !src.includes('pixel.gif')) {
                                        if (src.startsWith('//')) src = 'https:' + src;
                                        else if (src.startsWith('/')) src = 'https://adult.contents.fc2.com' + src;

                                        results.push({ type: 'image', src: src });
                                    }
                                });
                            }

                            // 新增
                            const uniqueResults = [];
                            const seen = new Set();
                            results.forEach(item => {
                                if (!seen.has(item.src)) {
                                    seen.add(item.src);
                                    uniqueResults.push(item);
                                }
                            });

                            resolve(uniqueResults);
                        } catch (e) {
                            console.error("FC2 Extra Fetch Error", e);
                            resolve([]);
                        }
                    },
                    onerror: () => resolve([]),
                    ontimeout: () => resolve([])
                });
            });
        }
    }

    class PreviewManager {
        static activePreview = null;
        static hoverTimers = new WeakMap();
        static isScrolling = false;
        static scrollResetTimer = null;

        static init(container, cardSelector) {
            const mode = SettingsManager.get('previewMode');
            if (mode === 'static') return;

            // 滚动防护：滚动中忽略悬停开始
            const onScroll = () => {
                this.isScrolling = true;
                if (this.scrollResetTimer) clearTimeout(this.scrollResetTimer);
                this.scrollResetTimer = setTimeout(() => { this.isScrolling = false; }, Config.PREVIEW_SCROLL_CANCEL_MS);
            };
            window.addEventListener('scroll', onScroll, { passive: true });

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (mode === 'hover' && !isTouchDevice) {
                container.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, cardSelector), true);
                container.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, cardSelector), true);
            } else if (mode === 'hover' && isTouchDevice) {
                container.addEventListener('click', (e) => this.handleClick(e, cardSelector), false);
            }
        }
        static handleMouseEnter(event, cardSelector) {
            if (this.isScrolling) return;
            const card = event.target.closest(cardSelector);
            if (!card) return;
            const from = event.relatedTarget;
            if (from && card.contains(from)) return;
            if (this.activePreview?.card === card) return;
            // 悬停意图延迟，避免滚动时频繁播放/暂停
            const existingTimer = this.hoverTimers.get(card);
            if (existingTimer) clearTimeout(existingTimer);
            const timer = setTimeout(() => {
                this.hoverTimers.delete(card);
                this._showPreview(card);
            }, Config.PREVIEW_HOVER_INTENT_MS);
            this.hoverTimers.set(card, timer);
        }
        static handleMouseLeave(event, cardSelector) {
            const card = event.target.closest(cardSelector);
            if (!card) return;
            const to = event.relatedTarget;
            if (to && card.contains(to)) return;
            const timer = this.hoverTimers.get(card);
            if (timer) clearTimeout(timer);
            this.hoverTimers.delete(card);
            if (card && this.activePreview && this.activePreview.card === card) this.activePreview.hidePreview();
        }
        static handleClick(event, cardSelector) {
            const card = event.target.closest(cardSelector);
            if (!card) return;
            const isAlreadyPreviewing = this.activePreview?.card === card;
            if (isAlreadyPreviewing) return;
            if (this.activePreview && this.activePreview.card !== card) {
                this.activePreview.hidePreview();
            }
            if (!card.dataset.previewStarted) {
                event.preventDefault();
                this._showPreview(card);
                card.dataset.previewStarted = "true";
            }
        }
        static async _showPreview(card) {
            if (card.dataset.previewFailed) return;
            if (this.activePreview?.card === card) return;
            if (this.activePreview) this.activePreview.hidePreview();
            const fc2Id = card.dataset.fc2id;
            const container = card.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            if (!fc2Id || !container) return;
            const images = container.querySelectorAll(`img.${Config.CLASSES.staticPreview}`);
            let video = container.querySelector('video');
            if (!video) {
                video = this._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, card);
                container.appendChild(video);
            }
            images.forEach((img) => img.classList.add(Config.CLASSES.hidden));
            video.classList.remove(Config.CLASSES.hidden);
            const hidePreview = () => {
                video.pause();
                video.classList.add(Config.CLASSES.hidden);
                images.forEach((img) => img.classList.remove(Config.CLASSES.hidden));
                if (this.activePreview?.card === card) this.activePreview = null;
                card.dataset.previewStarted = "";
            };
            try {
                await video.play();
                this.activePreview = { video, card, hidePreview };
            } catch (e) { hidePreview(); }
        }
        static _createVideoElement(src, card) {
            const video = UIBuilder.createElement('video', {
                src: src,
                className: `${Config.CLASSES.previewElement} ${Config.CLASSES.hidden}`,
                loop: true, muted: true, playsInline: true, preload: 'auto'
            });
            let didLoad = false;
            const getOverlay = () => card?.querySelector('.no-video-overlay');
            const loadTimeout = setTimeout(() => {
                if (didLoad) return;
                video.remove();
                if (card) {
                    card.dataset.previewFailed = 'true';
                    const overlay = getOverlay();
                    if (overlay) overlay.classList.add('is-visible');
                }
            }, Config.PREVIEW_VIDEO_TIMEOUT);
            video.addEventListener('loadeddata', () => {
                didLoad = true;
                clearTimeout(loadTimeout);
                const overlay = getOverlay();
                if (overlay) overlay.classList.remove('is-visible');
            }, { once: true });
            video.addEventListener('error', () => {
                clearTimeout(loadTimeout);
                video.remove();
                if (card) {
                    card.dataset.previewFailed = 'true';
                    const overlay = getOverlay();
                    if (overlay) overlay.classList.add('is-visible');
                }
            }, { once: true });
            return video;
        }
    }

    let dynamicGridStyleElement = null;
    const GRID_COLUMNS_KEY = 'user_grid_columns_preference';

    function applyCustomGridColumns(largeScreenCount) {
        if (!dynamicGridStyleElement) {
            dynamicGridStyleElement = document.createElement('style');
            dynamicGridStyleElement.id = 'enh-dynamic-grid-style';
            document.head.appendChild(dynamicGridStyleElement);
        }
        let newCss = '';

        if (largeScreenCount > 0) {
            let containerSelector = '';
            let cardWrapperSelector = '';
            if (location.hostname === 'fc2ppvdb.com') {
                containerSelector = '.flex.flex-wrap.-m-4.py-4';
                cardWrapperSelector = `${containerSelector} > .${Config.CLASSES.cardRebuilt}`;
            } else if (location.hostname === 'fd2ppv.cc') {
                if (document.querySelector('.artist-list')) {
                    containerSelector = '.artist-list';
                } else if (document.querySelector('.other-works-grid')) {
                    containerSelector = '.other-works-grid';
                }
            }
            if (containerSelector) {
                newCss = `
                    ${containerSelector} {
                        display: grid !important;
                        grid-template-columns: repeat(${largeScreenCount === 2 ? 2 : 1}, 1fr) !important;
                        gap: 1rem !important;
                        margin: 0 !important;
                        padding: 1rem 0 !important;
                    }
                    ${cardWrapperSelector} {
                         padding: 0 !important;
                         margin: 0 !important;
                         width: auto !important;
                    }
                    ${containerSelector} .inner {
                        padding: 0 !important;
                    }
                    @media (min-width: 768px) {
                        ${containerSelector} {
                            grid-template-columns: repeat(${largeScreenCount}, 1fr) !important;
                        }
                    }
                `;
            }
        } else {
            // 默认“自动”模式：强制网格布局，修复移除内边距导致的叠层问题
            let containerSelector = '';
            let cardWrapperSelector = '';
            if (location.hostname === 'fc2ppvdb.com') {
                containerSelector = '.flex.flex-wrap.-m-4.py-4';
                cardWrapperSelector = `${containerSelector} > .${Config.CLASSES.cardRebuilt}`;
            }
            if (containerSelector) {
                newCss = `
                    ${containerSelector} {
                        display: grid !important;
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important; /* 可读性背景 */
                        gap: 16px !important;
                        margin: 0 !important;
                        padding: 1rem 0 !important;
                    }
                    ${cardWrapperSelector} {
                         padding: 0 !important;
                         margin: 0 !important;
                         width: auto !important;
                    }
                     @media (min-width: 640px) { ${containerSelector} { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
                     @media (min-width: 768px) { ${containerSelector} { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }
                     @media (min-width: 1024px) { ${containerSelector} { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
                     @media (min-width: 1280px) { ${containerSelector} { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; } }
                     @media (min-width: 1536px) { ${containerSelector} { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; } }
                `;
            }
        }
        dynamicGridStyleElement.innerHTML = newCss;
    }


    class StyleManager {
        static inject() {
            const C = Config.CLASSES;
            GM_addStyle(`
                /* --- 全局字体与基础 --- */
                body {
                    /* 收藏按钮提示 */
                    --fc2-turbo-bg: #1e1e2e;
                    --fc2-turbo-surface: rgba(30, 30, 46, 0.95);
                    --fc2-turbo-text: #cdd6f4;
                    --fc2-turbo-text-dim: #a6adc8;
                    --fc2-turbo-border: rgba(205, 214, 244, 0.1);
                    --fc2-turbo-primary: #89b4fa;
                    --fc2-turbo-accent-grad: linear-gradient(135deg, #cba6f7, #f5c2e7);
                    --fc2-turbo-radius: 12px;
                    --fc2-turbo-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    --fc2-turbo-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

                    /* 重新定位 */
                    --fc2-turbo-bg-card: #1a1a1a;
                    --fc2-turbo-bg-info: #252528;

                    /* 浅色主题对比度增强 */
                    --fc2-turbo-glow-color: ${SettingsManager.get('glowColor')};
                    --fc2-turbo-viewed-color: ${SettingsManager.get('viewedColor')};
                }

                /* 收藏按钮提示 */
                body[data-fc2-turbo-theme="light"] {
                    --fc2-turbo-bg: #eff1f5;
                    --fc2-turbo-surface: rgba(239, 241, 245, 0.95);
                    --fc2-turbo-text: #4c4f69;
                    --fc2-turbo-text-dim: #6c6f85;
                    --fc2-turbo-border: rgba(76, 79, 105, 0.2);
                    --fc2-turbo-primary: #1e66f5;
                    --fc2-turbo-accent-grad: linear-gradient(135deg, #8839ef, #7287fd);
                    --fc2-turbo-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);

                    --fc2-turbo-bg-card: #ffffff;
                    --fc2-turbo-bg-info: #e6e9ef;
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-settings-header .close-btn { color: #4c4f69; }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-tab-btn { color: #6c6f85; }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-tab-btn.active { color: #2f3353; border-image: linear-gradient(135deg, #7c8cff, #5c6bf5) 1; }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row select {
                    color-scheme: light;
                    background: linear-gradient(180deg, #ffffff 0%, #eef2ff 100%) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233b5bff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;
                    color: #2a3352;
                    border: 1px solid #c6d0f0;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(59, 91, 255, 0.1);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row select:hover {
                    border-color: #9fb0ff;
                    box-shadow: 0 0 0 3px rgba(59, 91, 255, 0.12);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row select:focus {
                    border-color: #3b5bff;
                    box-shadow: 0 0 0 4px rgba(59, 91, 255, 0.18);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row select option {
                    background: #ffffff;
                    color: #233053;
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row input[type="number"] {
                    background: linear-gradient(180deg, #ffffff 0%, #f1f4ff 100%);
                    color: #233053;
                    border: 1px solid #aab6e6;
                    box-shadow: 0 3px 8px rgba(59, 91, 255, 0.12);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-form-row input[type="number"]:focus {
                    border-color: #3b5bff;
                    box-shadow: 0 0 0 4px rgba(59, 91, 255, 0.22);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-btn {
                    background: linear-gradient(180deg, #f7f9ff 0%, #e6edff 100%);
                    color: #253257;
                    border: 1px solid #b4c2f1;
                    box-shadow: 0 3px 10px rgba(59, 91, 255, 0.14);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-btn:hover {
                    background: linear-gradient(180deg, #edf2ff 0%, #dae4ff 100%);
                    border-color: #7f92ff;
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-btn.primary {
                    background: linear-gradient(135deg, #2f6bff, #6b5cff);
                    color: #ffffff;
                    border: none;
                    box-shadow: 0 8px 18px rgba(47, 107, 255, 0.32);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-btn.primary:hover {
                    box-shadow: 0 10px 22px rgba(47, 107, 255, 0.42);
                }
                /* 浅色主题对比度增强 */
                body[data-fc2-turbo-theme="light"] .fc2-turbo-settings-panel,
                body[data-fc2-turbo-theme="light"] .turbo-modal-panel {
                    background: #f8f9fb;
                    border-color: rgba(76, 79, 105, 0.2);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-settings-footer {
                    background: linear-gradient(180deg, #f4f6ff 0%, #e9efff 100%);
                    border-top-color: rgba(59, 91, 255, 0.2);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-list,
                body[data-fc2-turbo-theme="light"] .fc2-turbo-chart-container,
                body[data-fc2-turbo-theme="light"] .fc2-turbo-achievements-container,
                body[data-fc2-turbo-theme="light"] .collection-group,
                body[data-fc2-turbo-theme="light"] .collection-item,
                body[data-fc2-turbo-theme="light"] .stat-block {
                    background: #ffffff;
                    border-color: rgba(76, 79, 105, 0.2);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-list-item {
                    border-bottom: 1px solid rgba(76, 79, 105, 0.12);
                }
                body[data-fc2-turbo-theme="light"] .fc2-turbo-toast {
                    background: #ffffff;
                    border-color: rgba(76, 79, 105, 0.2);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
                }
                body[data-fc2-turbo-theme="light"] .${C.resourceBtn} {
                    background: rgba(0, 0, 0, 0.05);
                }

                /* --- 网格布局微调（减少间隙） --- */
                .grid.gap-4 { gap: 8px !important; }

                /* --- 卡片基础样式 --- */
                .${C.cardRebuilt} { background: transparent !important; border: none !important; margin: 0 !important; padding: 0 !important; }
                .${C.processedCard} { position: relative; overflow: visible; border-radius: var(--fc2-turbo-radius); transition: var(--fc2-turbo-transition); background: var(--fc2-turbo-bg-card); border: 2px solid transparent; container-type: inline-size; container-name: card; }
                /* 悬停效果：不缩放，仅发光 */
                .${C.processedCard}:hover { transform: none; z-index: 5; box-shadow: 0 0 25px var(--fc2-turbo-glow-color); }
                /* 可读性背景 */
                .${C.processedCard}.${C.isViewed} { border-color: var(--fc2-turbo-viewed-color); box-shadow: 0 0 10px var(--fc2-turbo-viewed-color); }
                .${C.videoPreviewContainer} { position: relative; width: 100%; aspect-ratio: 16 / 10; background: #000; border-radius: var(--fc2-turbo-radius) var(--fc2-turbo-radius) 0 0; overflow: hidden; }
                @media (max-width: 768px) { .${C.videoPreviewContainer} { height: auto; aspect-ratio: 16 / 10; } }
                .${C.videoPreviewContainer} video, .${C.videoPreviewContainer} img.${C.staticPreview} { width: 100%; height: 100%; object-fit: contain; transition: transform .4s ease; }
                .${C.processedCard}:hover .${C.videoPreviewContainer} video, .${C.processedCard}:hover .${C.videoPreviewContainer} img.${C.staticPreview} { transform: scale(1.05); }
                .${C.previewElement} { position: absolute; top: 0; left: 0; transition: opacity 0.3s ease; }
                .${C.previewElement}.${C.hidden} { opacity: 0 !important; pointer-events: none; }
                .no-video-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(0,0,0,0.45); color: #e2e8f0; font-size: 12px; font-weight: 600; letter-spacing: 0.02em; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; z-index: 4; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
                .no-video-overlay svg { width: 1.1em; height: 1.1em; }
                .no-video-overlay.is-visible { opacity: 1; }
                .${C.videoPreviewContainer}[data-fc2-turbo-no-image="1"]::after {
                    content: "No image";
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.45);
                    color: #e2e8f0;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    pointer-events: none;
                    z-index: 5;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                body.fc2-turbo-site-fd2ppv .${C.videoPreviewContainer}[data-fc2-turbo-no-image="1"]::after {
                    padding-top: 4em;
                }
                .card-top-left-controls { position: absolute; top: 6px; left: 4px; right: auto; z-index: 10; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
                body.fc2-turbo-site-fd2ppv .card-top-left-controls { top: 44px; }
                .card-top-left-controls .${C.resourceBtn} { position: relative; padding: 6px; aspect-ratio: 1; font-size: 12px; line-height: 1; background: rgba(0,0,0,.5); backdrop-filter: blur(8px); color: #cdd6f4; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); transition: var(--fc2-turbo-transition); text-decoration: none; align-self: stretch; }
                .card-top-left-controls > *:hover { background: rgba(0,0,0,.7); transform: scale(1.05); }
                .card-id-container { position: absolute; top: 4px; right: 6px; z-index: 10; }
                .card-id-container .${C.fc2IdBadge} { position: relative; padding: 3px 8px; background: rgba(0,0,0,.5); backdrop-filter: blur(8px); color: #cdd6f4; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); transition: var(--fc2-turbo-transition); text-decoration: none; font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; }
                .card-id-container .${C.fc2IdBadge}:hover { background: rgba(0,0,0,.7); transform: scale(1.05); }
                .${C.fc2IdBadge}.${C.badgeCopied} { background: #a6e3a1 !important; color: #111; }
                .${C.processedCard}.${C.isViewed} .btn-toggle-view { color: var(--fc2-turbo-primary); }
                .btn-toggle-view .icon-viewed { display: none !important; }
                .btn-toggle-view .icon-unviewed { display: inline-block !important; }
                .btn-toggle-view.is-viewed .icon-viewed { display: inline-block !important; }
                .btn-toggle-view.is-viewed .icon-unviewed { display: none !important; }
                .btn-toggle-tag.is-tagged { color: #f9e2af !important; }
                .tags-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
                .tag-badge { background-color: rgba(205, 214, 244, 0.1); color: var(--fc2-turbo-text-dim); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; }
                .${C.infoArea} { padding: 0.5rem 0.8rem; background: var(--fc2-turbo-bg-info); display: flex; flex-direction: column; justify-content: flex-end; border-radius: 0 0 var(--fc2-turbo-radius) var(--fc2-turbo-radius); }
                .${C.customTitle} { color: var(--fc2-turbo-text); font-size: 14px; font-weight: 600; line-height: 1.3; margin: 0 0 6px; height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
                .${C.resourceLinksContainer} { display: flex; gap: 5px; align-items: center; margin-top: auto; justify-content: flex-end; }
                .${C.resourceBtn} { position: relative; display: inline-flex; align-items: center; justify-content: center; color: var(--fc2-turbo-text-dim); text-decoration: none; transition: var(--fc2-turbo-transition); cursor: pointer; padding: .5em; aspect-ratio: 1; border-radius: 8px; background: rgba(255,255,255,.1); }
                .${C.resourceBtn}:hover { transform: scale(1.1); color: var(--fc2-turbo-text); background: rgba(255,255,255,.15); }
                .${C.resourceBtn} i, .${C.resourceBtn} svg { font-size: .9em; pointer-events: none; }
                .${C.resourceBtn} .${C.tooltip} { position: absolute; top: 125%; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: .4em .8em; border-radius: 6px; font-size: .8em; white-space: nowrap; opacity: 0; visibility: hidden; transition: var(--fc2-turbo-transition); pointer-events: none; z-index: 1000; }
                .${C.resourceBtn}:hover .${C.tooltip} { opacity: 1; visibility: visible; }
                .${C.resourceBtn} .${C.buttonText} { display: none; }
                .${C.resourceBtn}.${C.btnLoading} { cursor: not-allowed; background: #4b5563; }
                .${C.resourceBtn}.${C.btnLoading} i { animation: spin 1s linear infinite; }
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                .${C.preservedIconsContainer} { position: absolute; top: 10px; left: 10px; z-index: 10; display: flex; flex-direction: row; gap: 6px; }
                .preserved-icons-container > div { display: inline-flex; align-items: center; }
                body.fc2-turbo-hide-no-magnet .${C.cardRebuilt}[data-has-magnet="0"] { display: none !important; }
                body.fc2-turbo-hide-censored .${C.cardRebuilt}.${C.isCensored} { display: none !important; }
                body.fc2-turbo-hide-viewed .${C.cardRebuilt}.${C.isViewed} { display: none !important; }

                /* Toast 通知 */
                #fc2-turbo-toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
                .fc2-turbo-toast { background: var(--fc2-turbo-surface); color: var(--fc2-turbo-text); padding: 10px 20px; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0; transform: translateY(-20px); transition: all 0.3s ease; border: 1px solid var(--fc2-turbo-border); display: flex; align-items: center; gap: 8px; pointer-events: auto; backdrop-filter: blur(4px); }
                .fc2-turbo-toast.show { opacity: 1; transform: translateY(0); }
                .fc2-turbo-toast.info { border-color: #89b4fa; }
                .fc2-turbo-toast.success { border-color: #a6e3a1; color: #a6e3a1; }
                .fc2-turbo-toast.error { border-color: #f38ba8; color: #f38ba8; }

                /* 收藏按钮提示 */
                .${C.resourceBtn}.checking { cursor: wait; opacity: 0.8; }
                .${C.resourceBtn}.checking svg { animation: spin 1s linear infinite; }
                /* --- 顶部左侧按钮提示右移，避免遮挡 --- */
                .card-top-left-controls .${C.resourceBtn} .${C.tooltip} {
                    top: 50%;
                    left: 120%;
                    transform: translateY(-50%);
                }
                /* --- 修复右上角按钮提示（强制向下显示，避免被切掉） --- */
                .card-top-right-controls .${C.resourceBtn} .${C.tooltip}, .card-top-right-controls .${C.fc2IdBadge} .${C.tooltip} {
                    bottom: auto !important;
                    top: 135% !important; /* 显示在按钮下方 */
                    left: 50%;
                    transform: translateX(-50%);
                }
                /* --- 额外预览 & 布局 --- */
                .${C.extraPreviewContainer} { margin-top: 1rem; }
                .${C.extraPreviewTitle} { font-size: 1.5rem; font-weight: 700; color: #fff; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--fc2-turbo-border); }
                .${C.extraPreviewGrid} { display: grid; gap: 10px; width: 100%; }
                .${C.extraPreviewGrid} img, .${C.extraPreviewGrid} video { max-width: 100%; height: auto; border-radius: var(--fc2-turbo-radius); background: #000; }
                .layout-compact .${C.videoPreviewContainer} { aspect-ratio: 16 / 9; }
                @media (max-width: 768px) { .layout-compact .${C.videoPreviewContainer} { height: auto; aspect-ratio: 16 / 9; } }
                .layout-compact .${C.infoArea} { padding: 0.5rem 0.75rem; display: flex;; align-items: center; min-height: auto; }
                .layout-compact .${C.customTitle} { display: none !important; }
                .layout-compact .${C.resourceLinksContainer} { margin-left: auto; gap: 5px; }
                .layout-compact .${C.resourceBtn} { padding: .3em; border-radius: 6px; }
                .layout-compact .${C.resourceBtn} i { font-size: .8em; }
                .buttons-text .${C.resourceBtn} { aspect-ratio: auto; padding: .4em .7em; }
                .buttons-text .${C.resourceBtn} .${C.buttonText} { display: inline; font-size: 0.8em; margin-left: 0.4em; }
                /* --- 详情页专用样式 --- */
                /* 1. 提示下置 + 层级修复 */
                body.fc2-turbo-detail-page .${C.processedCard} .${C.resourceLinksContainer} .${C.resourceBtn} { z-index: 10; }
                body.fc2-turbo-detail-page .${C.resourceLinksContainer} .${C.resourceBtn} .${C.tooltip} { bottom: auto; top: 125%; }

                /* 2. 禁止卡片悬停上移 (防止上方标记被遮挡) */
                body.fc2-turbo-detail-page .${C.processedCard}:hover { transform: none; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }

                /* --- 列表页：按钮响应式展开（容器查询） --- */
                /* 阶段 1：宽度 > 320px，先展开 MissAV 和 Supjav（左侧两个） */
                @container card (min-width: 320px) {
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-missav,
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-supjav { width: auto; aspect-ratio: auto; padding: 0.4em 0.8em; }
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-missav .${C.buttonText},
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-supjav .${C.buttonText} { display: inline; margin-left: 6px; font-size: 0.9em; }
                }
                /* 阶段 2：宽度 > 480px，再展开 Sukebei 和磁力（右侧两个） */
                @container card (min-width: 480px) {
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-sukebei,
                    .${C.resourceLinksContainer} .${C.resourceBtn}.magnet { width: auto; aspect-ratio: auto; padding: 0.4em 0.8em; }
                    .${C.resourceLinksContainer} .${C.resourceBtn}.btn-sukebei .${C.buttonText},
                    .${C.resourceLinksContainer} .${C.resourceBtn}.magnet .${C.buttonText} { display: inline; margin-left: 6px; font-size: 0.9em; }
                }
                /* 小尺寸自动减少按钮数量（优先级：磁力 < Supjav < Sukebei < MissAV） */
                @container card (max-width: 170px) { .${C.resourceBtn}.magnet { display: none !important; } }
                @container card (max-width: 140px) { .${C.resourceBtn}.btn-supjav { display: none !important; } }
                @container card (max-width: 110px) { .${C.resourceBtn}.btn-sukebei { display: none !important; } }
                @container card (max-width: 80px) { .${C.resourceBtn}.btn-missav { display: none !important; } }

                /* --- 通用模态框 --- */
                .turbo-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(17, 17, 27, 0.5); backdrop-filter: blur(8px); }
                .turbo-modal-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--fc2-turbo-bg); color: var(--fc2-turbo-text); border-radius: 16px; box-shadow: var(--fc2-turbo-shadow); display: flex; flex-direction: column; border: 1px solid var(--fc2-turbo-border); font-family: "Microsoft YaHei", "PingFang SC", "Heiti SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
                .turbo-modal-header h2, .turbo-modal-header h3 { margin: 0; font-weight: 600; }
                /* --- 设置面板 --- */
                .fc2-turbo-settings-backdrop { z-index: 10001; }
                .fc2-turbo-settings-panel { z-index: 10002; width: 95%; max-width: 1000px; height: 85vh; }
                .fc2-turbo-settings-header { padding: 1.25rem 2rem; border-bottom: 1px solid var(--fc2-turbo-border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
                .fc2-turbo-settings-header h2 { font-size: 1.4rem; }
                .fc2-turbo-settings-header .close-btn { background: none; border: none; color: var(--fc2-turbo-text-dim); font-size: 1.8rem; cursor: pointer; transition: var(--fc2-turbo-transition); }
                .fc2-turbo-settings-header .close-btn:hover { color: #fff; transform: rotate(90deg); }
                .fc2-turbo-settings-tabs { display: flex; padding: 0.5rem 2rem 0; border-bottom: 1px solid var(--fc2-turbo-border); flex-shrink: 0; }
                .fc2-turbo-tab-btn { background: none; border: none; color: var(--fc2-turbo-text-dim); padding: 1rem 1.25rem; cursor: pointer; border-bottom: 3px solid transparent; font-size: 1rem; font-weight: 500; transition: var(--fc2-turbo-transition); margin-bottom: -1px; }
                .fc2-turbo-tab-btn:hover { color: var(--fc2-turbo-text); }
                .fc2-turbo-tab-btn.active { color: var(--fc2-turbo-text); border-image: var(--fc2-turbo-accent-grad) 1; }
                .fc2-turbo-settings-content { padding: 0.8rem 2rem 2rem; overflow-y: auto; flex-grow: 1; }
                .fc2-turbo-tab-content { display: none; }
                .fc2-turbo-tab-content.active { display: block; animation: fadeIn 0.5s ease; }
                .fc2-turbo-settings-content::-webkit-scrollbar,
                .fc2-turbo-list::-webkit-scrollbar,
                .cache-image-grid::-webkit-scrollbar,
                .tag-editor-content::-webkit-scrollbar { width: 8px; }

                .fc2-turbo-settings-content::-webkit-scrollbar-track,
                .fc2-turbo-list::-webkit-scrollbar-track,
                .cache-image-grid::-webkit-scrollbar-track,
                .tag-editor-content::-webkit-scrollbar-track { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }

                .fc2-turbo-settings-content::-webkit-scrollbar-thumb,
                .fc2-turbo-list::-webkit-scrollbar-thumb,
                .cache-image-grid::-webkit-scrollbar-thumb,
                .tag-editor-content::-webkit-scrollbar-thumb { background-color: rgba(205, 214, 244, 0.25); border-radius: 10px; }

                .fc2-turbo-settings-content::-webkit-scrollbar-thumb:hover,
                .fc2-turbo-list::-webkit-scrollbar-thumb:hover,
                .cache-image-grid::-webkit-scrollbar-thumb:hover,
                .tag-editor-content::-webkit-scrollbar-thumb:hover { background-color: rgba(137, 180, 250, 0.5); }

                /* --- 顶部左侧按钮提示右移，避免遮挡 --- */
                .fc2-turbo-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
                .stat-block { background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--fc2-turbo-border); transition: var(--fc2-turbo-transition); }
                .stat-block:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); box-shadow: var(--fc2-turbo-shadow); }
                .stat-block .stat-value { font-size: 24px; font-weight: 800; color: var(--fc2-turbo-primary); margin-bottom: 4px; }
                .stat-block .stat-label { font-size: 12px; color: var(--fc2-turbo-text-dim); text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }

                /* 列表界面（历史与缓存） */
                .fc2-turbo-list-header { display: flex; justify-content: space-between; align-items: center; padding: 0 0 12px; margin-bottom: 12px; border-bottom: 1px solid var(--fc2-turbo-border); }
                .fc2-turbo-list-header h3 { font-size: 16px; font-weight: 600; margin: 0; color: var(--fc2-turbo-text); }
                .fc2-turbo-list { list-style: none; padding: 0; margin: 0; max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 8px; }
                .fc2-turbo-list-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
                .fc2-turbo-list-item:hover { background: rgba(255,255,255,0.05); }
                .fc2-turbo-list-item:last-child { border-bottom: none; }
                .fc2-turbo-list-item .item-id { font-family: monospace; color: var(--fc2-turbo-primary); font-size: 13px; }
                .fc2-turbo-list-item .item-date { font-size: 12px; color: var(--fc2-turbo-text-dim); margin-left: auto; margin-right: 12px; }
                .fc2-turbo-list-item .icon-btn { opacity: 0.6; transition: opacity 0.2s; background: none; border: none; font-size: 16px; cursor: pointer; color: var(--fc2-turbo-text); padding: 4px; }
                .fc2-turbo-list-item .icon-btn:hover { opacity: 1; color: #f38ba8; }
                .item-thumb { width: 60px; height: 40px; border-radius: 4px; overflow: hidden; margin-right: 12px; background: rgba(0,0,0,0.3); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .item-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s; }
                .item-thumb img.loaded { opacity: 1; }
                .fc2-turbo-list-item a { color: var(--fc2-turbo-primary); text-decoration: none; transition: color 0.2s; }
                .fc2-turbo-list-item a:hover { color: var(--fc2-turbo-accent); text-decoration: underline; }
                .cache-image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 4px; }
                .cache-image-item { position: relative; aspect-ratio: 16/9; border-radius: 6px; overflow: hidden; border: 1px solid var(--fc2-turbo-border); background: rgba(30, 30, 46, 0.4); group-hover; transition: transform 0.2s; }
                .cache-image-item.protected { border-color: rgba(243, 139, 168, 0.5); }
                .cache-image-item.protected .delete-btn.disabled { cursor: not-allowed; opacity: 0.5; background: rgba(0,0,0,0.5); color: #f38ba8; }
                .cache-image-item:hover { transform: scale(1.02); border-color: var(--fc2-turbo-primary); }
                .cache-image-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s; }
                .cache-image-item img.loaded { opacity: 1; }
                .cache-image-item .delete-btn { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); color: #ff6b6b; border: none; border-radius: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: opacity 0.2s; font-size: 16px; line-height: 1; }
                .cache-image-item:hover .delete-btn { opacity: 1; }
                .cache-image-item .id-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); color: #fff; font-size: 10px; padding: 12px 4px 4px; text-align: center; font-family: monospace; text-shadow: 0 1px 2px black; pointer-events: none; }

                /* 收藏按钮提示 */
                .collection-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--fc2-turbo-border); }
                .collection-header h2 { margin: 0; font-size: 18px; }
                .collection-actions { display: flex; gap: 10px; }

                .collection-group {
                    background: rgba(30, 30, 46, 0.4);
                    border-radius: 8px;
                    margin-bottom: 20px;
                    overflow: visible;
                    border: 1px solid var(--fc2-turbo-border);
                    padding-bottom: 10px;
                }
                .collection-group summary {
                    list-style: none; /* 收藏按钮提示 */
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 16px;
                    background: var(--fc2-turbo-bg-info);
                    border-radius: var(--fc2-turbo-radius);
                    user-select: none;
                }
                .collection-group summary::-webkit-details-marker { display: none; }
                .collection-group[open] .icon-chevron { transform: rotate(180deg); }
                .icon-chevron { transition: transform 0.3s ease; margin-right: 10px; display: flex; align-items: center; }

                .collection-item-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 24px;
                    padding: 24px 24px 24px 32px; /* 增加左侧内边距 */
                }
                .collection-item-wrapper {
                    position: relative;
                    border-radius: 8px;
                    overflow: visible;
                    transition: z-index 0s 0.2s, box-shadow 0.2s; /* 添加 box-shadow 过渡 */
                }
                .collection-item-wrapper:hover {
                    z-index: 100;
                    transition: z-index 0s;
                    box-shadow: 0 0 15px var(--fc2-turbo-glow-color); /* 重新定位 */
                }
                .collection-item { display: block; text-decoration: none; color: var(--fc2-turbo-text); text-align: center; }

                .collection-item img {
                    width: 100%;
                    aspect-ratio: 16/10;
                    object-fit: cover;
                    border-radius: 6px;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                    background: rgba(0,0,0,0.3);
                }
                .collection-item-wrapper:hover .collection-item img {
                    /* 移除边框颜色变化，保留位移 */
                    transform: translateY(-2px);
                }

                .collection-item-id-row {
                    font-size: 0.85em;
                    color: var(--fc2-turbo-primary);
                    padding: 6px 4px 0 4px;
                    font-weight: bold;
                    text-align: left;
                    font-family: inherit;
                }

                .collection-item-title {
                    font-size: 0.9em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: var(--fc2-turbo-text-dim);
                    padding: 4px 4px 8px 4px;
                    text-align: left;
                }

                /* 移除按钮（X / 垃圾桶） */
                .collection-remove-btn { position: absolute; top: -8px; left: -8px; width: 24px; height: 24px; background: rgba(243, 139, 168, 0.9); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transform: scale(0.8); transition: all 0.2s; z-index: 20; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px; }
                .collection-item-wrapper:hover .collection-remove-btn { opacity: 1; transform: scale(1); }
                .collection-remove-btn:hover { background: #f38ba8; transform: scale(1.1); }

                /* 收藏按钮提示 */
                .edit-item-tags { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 4px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s; cursor: pointer; font-size: 12px; backdrop-filter: blur(2px); }
                .collection-item-wrapper:hover .edit-item-tags { opacity: 1; }
                .edit-item-tags:hover { background: rgba(0,0,0,0.9); }

                /* 收藏按钮提示 */
                .collection-hover-actions {
                    position: absolute;
                    bottom: 70px; /* 调整：从 80px 下调 10px */
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none;
                    z-index: 15;
                }
                .collection-item-wrapper:hover .collection-hover-actions { opacity: 1; pointer-events: auto; }

                .collection-hover-actions .hover-btn { position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(30, 30, 46, 0.85); color: #fff; font-size: 14px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; backdrop-filter: blur(4px); cursor: pointer; text-decoration: none; }
                .collection-hover-actions .hover-btn:hover { transform: translateY(-4px); border-color: var(--fc2-turbo-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.4); background: rgba(30, 30, 46, 0.95); }
                .collection-hover-actions .hover-btn.btn-missav:hover { color: #f38ba8; border-color: #f38ba8; }
                .collection-hover-actions .hover-btn.btn-supjav:hover { color: #89b4fa; border-color: #89b4fa; }
                .collection-hover-actions .hover-btn.btn-sukebei:hover { color: #a6e3a1; border-color: #a6e3a1; }

                /* 收藏按钮提示 */
                .collection-hover-actions .hover-btn .fc2-turbo-tooltip { position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s; pointer-events: none; }
                .collection-hover-actions .hover-btn:hover .fc2-turbo-tooltip { opacity: 1; visibility: visible; }

                .collection-empty-tag { padding: 12px; text-align: center; color: var(--fc2-turbo-text-dim); font-style: italic; font-size: 12px; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .fc2-turbo-settings-group { margin-bottom: 2rem; }
                .fc2-turbo-settings-group h3 { margin-top: 0; margin-bottom: 1.25rem; border-bottom: 1px solid var(--fc2-turbo-border); padding-bottom: 0.75rem; font-size: 1.1rem; font-weight: 600; }
                .fc2-turbo-form-row { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .fc2-turbo-form-row label { font-weight: normal; }
                .fc2-turbo-form-row select { width: 100%; background: rgba(30, 30, 46, 0.6) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cdd6f4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center; border: 1px solid var(--fc2-turbo-border); border-radius: 12px; padding: 0.75rem 2.5rem 0.75rem 0.75rem; color: var(--fc2-turbo-text); box-sizing: border-box; appearance: none; cursor: pointer; transition: all 0.3s ease; }
                .fc2-turbo-form-row select:focus { border-color: var(--fc2-turbo-primary); outline: none; box-shadow: 0 0 0 4px rgba(137, 180, 250, 0.15); }
                .fc2-turbo-form-row label[for^="setting-"] { display: flex; align-items: center; cursor: pointer; }
                .fc2-turbo-form-row select option { background: var(--fc2-turbo-bg); color: var(--fc2-turbo-text); }
                .fc2-turbo-form-row input[type="number"] { width: 100%; background: rgba(30, 30, 46, 0.6); border: 1px solid var(--fc2-turbo-border); border-radius: 12px; padding: 0.75rem; color: var(--fc2-turbo-text); box-sizing: border-box; transition: all 0.3s ease; }
                .fc2-turbo-form-row input[type="number"]:focus { border-color: var(--fc2-turbo-primary); outline: none; box-shadow: 0 0 0 4px rgba(137, 180, 250, 0.15); }
                input[type="checkbox"] { appearance: none; width: 1.2em; height: 1.2em; border: 2px solid var(--fc2-turbo-border); border-radius: 4px; margin-right: 0.75rem; display: grid; place-content: center; transition: var(--fc2-turbo-transition); }
                input[type="checkbox"]::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; background: var(--fc2-turbo-accent-grad); clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
                input[type="checkbox"]:checked { background: var(--fc2-turbo-primary); border-color: var(--fc2-turbo-primary); }
                input[type="checkbox"]:checked::before { transform: scale(1.2); }
                .tag-checklist input[type="radio"] { appearance: none; width: 1.1em; height: 1.1em; border: 2px solid var(--fc2-turbo-border); border-radius: 999px; margin-right: 0.75rem; display: grid; place-content: center; transition: var(--fc2-turbo-transition); }
                .tag-checklist input[type="radio"]::before { content: ""; width: 0.55em; height: 0.55em; border-radius: 999px; transform: scale(0); transition: 120ms transform ease-in-out; background: var(--fc2-turbo-accent-grad); }
                .tag-checklist input[type="radio"]:checked { border-color: var(--fc2-turbo-primary); }
                .tag-checklist input[type="radio"]:checked::before { transform: scale(1); }
                .fc2-turbo-settings-footer { padding: 1.25rem 2rem; border-top: 1px solid var(--fc2-turbo-border); display: flex; justify-content: flex-end; gap: 1rem; background: rgba(0,0,0,0.2); border-radius: 0 0 16px 16px; }
                .fc2-turbo-btn { background: rgba(205, 214, 244, 0.1); border: 1px solid var(--fc2-turbo-border); color: var(--fc2-turbo-text); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: var(--fc2-turbo-transition); }
                .fc2-turbo-btn:hover { transform: translateY(-2px); background: rgba(205, 214, 244, 0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .fc2-turbo-btn.primary { background: var(--fc2-turbo-accent-grad); border: none; color: white; }
                .fc2-turbo-btn.primary:hover { box-shadow: 0 6px 15px rgba(203, 166, 247, 0.4); }
                /* --- 标签编辑器 --- */
                .tag-editor-backdrop { z-index: 10003; }
                .tag-editor-panel { z-index: 10004; width: 90%; max-width: 400px; }
                .tag-editor-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--fc2-turbo-border); }
                .tag-editor-header h3 { font-size: 1.2rem; }
                .tag-editor-content { padding: 1.5rem; max-height: 40vh; overflow-y: auto; }
                .tag-checklist { display: flex; flex-direction: column; gap: 0.75rem; }
                .tag-checklist-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
                .tag-checklist-item .tag-label { flex-grow: 1; display: flex; align-items: center; cursor: pointer; }
                .tag-checklist-item-actions { display: flex; gap: 8px; visibility: hidden; opacity: 0; transition: all 0.2s ease; }
                .tag-checklist-item:hover .tag-checklist-item-actions { visibility: visible; opacity: 1; }
                .tag-checklist-item-actions button { background: none; border: none; color: var(--fc2-turbo-text-dim); cursor: pointer; font-size: 14px; padding: 4px; }
                .tag-checklist-item-actions button:hover { color: var(--fc2-turbo-text); }
                .tag-editor-add-new { padding: 1rem 1.5rem; border-top: 1px solid var(--fc2-turbo-border); display: flex; gap: 0.5rem; }
                .tag-editor-add-new input { flex-grow: 1; background: rgba(0,0,0,0.2); border: 1px solid var(--fc2-turbo-border); border-radius: 8px; padding: 0.5rem 0.75rem; color: var(--fc2-turbo-text); }
                .tag-editor-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--fc2-turbo-border); display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
                .tag-editor-footer > div { display: flex; gap: 0.75rem; }
                .tag-editor-footer .fc2-turbo-btn.danger { background: rgba(243, 139, 168, 0.15); border-color: rgba(243, 139, 168, 0.3); color: #f38ba8; }
                .tag-editor-footer .fc2-turbo-btn.danger:hover { background: rgba(243, 139, 168, 0.25); }
                /* --- 统计 & 成就 & 收藏页 --- */
                .fc2-turbo-stats-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .fc2-turbo-stat-card { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--fc2-turbo-radius); text-align: center; border: 1px solid var(--fc2-turbo-border); transition: var(--fc2-turbo-transition); }
                .fc2-turbo-stat-card:hover { transform: translateY(-4px); background: rgba(0,0,0,0.3); }
                .fc2-turbo-stat-card-value { font-size: 2rem; font-weight: bold; color: var(--fc2-turbo-primary); }
                .fc2-turbo-stat-card-label { font-size: 0.9rem; color: var(--fc2-turbo-text-dim); margin-top: 0.5rem; }
                .fc2-turbo-chart-container, .fc2-turbo-achievements-container { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--fc2-turbo-radius); margin-top: 1.5rem; border: 1px solid var(--fc2-turbo-border); }
                .fc2-turbo-achievements-container h3 { margin: 0 0 1.5rem; font-size: 1.1rem; text-align: center; font-weight: 600; }
                .fc2-turbo-achievements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
                .fc2-turbo-achievement-badge { display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px; transition: var(--fc2-turbo-transition); border: 1px solid transparent; cursor: help; }
                .fc2-turbo-achievement-badge.locked { filter: grayscale(1); opacity: 0.6; }
                .fc2-turbo-achievement-badge.unlocked { background: linear-gradient(135deg, rgba(203, 166, 247, 0.1), rgba(245, 194, 231, 0.1)); border-color: rgba(203, 166, 247, 0.3); }
                .fc2-turbo-achievement-badge:hover { transform: scale(1.03); border-color: rgba(205, 214, 244, 0.3); }
                .fc2-turbo-achievement-badge .icon { font-size: 1.8rem; margin-right: 1rem; width: 35px; text-align: center; }
                .fc2-turbo-achievement-badge.unlocked .icon { color: #f9e2af; }
                .fc2-turbo-achievement-badge .details { display: flex; flex-direction: column; }
                .fc2-turbo-achievement-badge .title { font-weight: bold; font-size: 0.95rem; }
                .fc2-turbo-achievement-badge .description { font-size: 0.85rem; color: var(--fc2-turbo-text-dim); }
                .collection-container { padding: 0.5rem; }
                .collection-container h2 { text-align: center; font-size: 1.4rem; margin-bottom: 1.5rem; }
                .collection-group { margin-bottom: 1.5rem; }
                .collection-tag-title { font-size: 1.1rem; font-weight: 600; cursor: pointer; padding: 0.5rem; border-bottom: 1px solid var(--fc2-turbo-border); }
                .collection-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; padding: 1rem 0; }
                .collection-item { display: block; text-decoration: none; color: var(--fc2-turbo-text); border-radius: var(--fc2-turbo-radius); overflow: hidden; background: rgba(0,0,0,0.2); transition: var(--fc2-turbo-transition); }
                .collection-item:hover { transform: translateY(-4px); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
                .collection-item img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
                .collection-item-title { font-size: 12px; padding: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .collection-item-fallback { display: flex; align-items: center; justify-content: center; height: 80px; background: rgba(0,0,0,0.2); border-radius: 8px; text-decoration: none; color: var(--fc2-turbo-text-dim); font-size: 13px; }
                .collection-empty { text-align: center; margin-top: 2rem; color: var(--fc2-turbo-text-dim); }
                .collection-empty { text-align: center; margin-top: 2rem; color: var(--fc2-turbo-text-dim); }
                /* --- 悬浮设置按钮（头部布局覆盖旧固定定位） --- */
                #fc2-turbo-floating-btn {
                    position: static !important;
                    inset: auto !important;
                    padding: 0 !important;
                }
            `);
        }
    }



    class ImageLoader {
        static activeLoads = 0;
        static queue = [];

        static _enqueue(task) {
            this.queue.push(task);
            this._drainQueue();
        }

        static _drainQueue() {
            while (this.activeLoads < SettingsManager.getNumber('imageLoadConcurrency', Config.IMAGE_LOAD_CONCURRENCY, 1, 20) && this.queue.length > 0) {
                const task = this.queue.shift();
                this.activeLoads += 1;
                let finished = false;
                const done = () => {
                    if (finished) return;
                    finished = true;
                    this.activeLoads = Math.max(0, this.activeLoads - 1);
                    this._drainQueue();
                };
                try {
                    task(done);
                } catch (e) {
                    done();
                }
            }
        }

        static load(fc2Id, imgElement, options = {}) {
            const { onLoad = null, onError = null, force = false, preferUrl = null } = options;
            if (!fc2Id || !imgElement) return;
            this._setNoImageState(imgElement, false);

            // 重构：根据收藏状态选择缓存
            const isCollected = TagManager.getTags(fc2Id).length > 0;
            const targetCache = isCollected ? CollectionImageManager : GlobalImageCache;

            const task = (done) => {
                let finished = false;
                let chainTimer = null;
                const finalize = () => {
                    if (finished) return;
                    finished = true;
                    if (chainTimer) clearTimeout(chainTimer);
                    done();
                };
                const wrappedOnLoad = () => {
                    if (finished) return;
                    if (onLoad) onLoad();
                    finalize();
                };
                const wrappedOnError = (reason) => {
                    if (finished) return;
                    if (onError) onError(reason);
                    finalize();
                };

                const chainTimeoutMs = SettingsManager.getNumber('imageChainTimeout', Config.IMAGE_CHAIN_TIMEOUT, 0, 120000);
                if (chainTimeoutMs > 0) {
                    chainTimer = setTimeout(() => {
                        if (finished) return;
                        targetCache.set(fc2Id, Config.NO_IMAGE_FLAG);
                        this._applySrc(imgElement, Config.NO_IMAGE_URL, () => wrappedOnError('timeout'));
                    }, chainTimeoutMs);
                }

                // 1. 显示加载占位
                let cachedUrl = targetCache.get(fc2Id);

                // 迁移：若已收藏但收藏缓存缺失，则尝试全局缓存并迁移
                if (!cachedUrl && isCollected) {
                    const globalUrl = GlobalImageCache.get(fc2Id);
                    if (globalUrl) {
                        cachedUrl = globalUrl;
                        targetCache.set(fc2Id, globalUrl);
                    }
                }

                const proceedWithCacheOrChain = () => {
                    if (cachedUrl && !force) {
                        if (cachedUrl === Config.NO_IMAGE_FLAG) {
                            this._applySrc(imgElement, Config.NO_IMAGE_URL, wrappedOnError);
                        } else {
                            this._loadImage(
                                imgElement,
                                cachedUrl,
                                wrappedOnLoad,
                                () => this._startChain(fc2Id, imgElement, wrappedOnLoad, wrappedOnError, targetCache)
                            );
                        }
                        return;
                    }

                    // 2. 开始链式处理
                    this._startChain(fc2Id, imgElement, wrappedOnLoad, wrappedOnError, targetCache);
                };

                const preferUrlValue = typeof preferUrl === 'string' ? preferUrl.trim() : '';
                if (preferUrlValue && !force) {
                    this._loadImage(
                        imgElement,
                        preferUrlValue,
                        () => {
                            targetCache.set(fc2Id, preferUrlValue);
                            wrappedOnLoad();
                        },
                        proceedWithCacheOrChain
                    );
                    return;
                }

                proceedWithCacheOrChain();
            };

            this._enqueue(task);
        }

        static _startChain(fc2Id, imgElement, onLoad, onError, targetCache = GlobalImageCache) {
            const showNoImage = (reason) => {
                targetCache.set(fc2Id, Config.NO_IMAGE_FLAG);
                this._applySrc(imgElement, Config.NO_IMAGE_URL, () => {
                    if (onError) onError(reason);
                });
            };

            const tryJavPopInline = () => {
                if (!SettingsManager.get('sourceJavPop')) return tryWumaobi();
                const javPopUrl = `https://i0.wp.com/javpop.com/img/fc2/fc2_ppv-${fc2Id}_poster.jpg`;
                this._loadImage(imgElement, javPopUrl, () => {
                    imgElement.style.objectFit = 'contain';
                    targetCache.set(fc2Id, javPopUrl);
                    if (onLoad) onLoad();
                }, tryWumaobi);
            };

            const tryFC2Direct = () => {
                if (!SettingsManager.get('sourceFC2Direct')) return showNoImage();
                NetworkManager.fetchFC2DirectThumbnail(fc2Id).then(url => {
                    if (url) {
                        targetCache.set(fc2Id, url);
                        this._loadImage(imgElement, url, onLoad, showNoImage);
                    } else showNoImage();
                });
            };

            const tryFC2PPVMe = () => {
                // 备注：FC2PPV.me 是否默认启用，或需要新增设置？
                // 假设未禁用即启用，或根据上下文隐式启用。
                // 之前代码是否隐式检查 SettingsManager.get('sourceFC2PPVMe')？没有，之前是 tryFC2PPVMe -> NetworkManager.fetchFC2PPVMeThumbnail
                // 我会加个检查以防万一，或保持简单。
                if (!SettingsManager.get('sourceFC2PPVMe')) return tryFC2Direct();

                NetworkManager.fetchFC2PPVMeThumbnail(fc2Id).then(url => {
                    if (url) {
                        targetCache.set(fc2Id, url);
                        this._loadImage(imgElement, url, onLoad, tryFC2Direct);
                    } else tryFC2Direct();
                });
            };

            const tryWumaobi = () => {
                if (!SettingsManager.get('sourceWumaobi')) return tryPPVDataBank();
                const url = `https://wumaobi.com/fc2daily/data/FC2-PPV-${fc2Id}/cover.jpg`;
                this._loadImage(imgElement, url, () => {
                    targetCache.set(fc2Id, url);
                    if (onLoad) onLoad();
                }, tryPPVDataBank);
            };

            const tryPPVDataBank = () => {
                if (!SettingsManager.get('sourcePPVDataBank')) return tryFC2PPVMe();
                const url = `https://ppvdatabank.com/article/${fc2Id}/img/thumb.webp`;
                this._loadImage(imgElement, url, () => {
                    targetCache.set(fc2Id, url);
                    if (onLoad) onLoad();
                }, tryFC2PPVMe);
            };

            const tryFourhoi = () => {
                if (!SettingsManager.get('sourceFourhoi')) return tryJavPopInline();
                const url = `https://fourhoi.com/fc2-ppv-${fc2Id}/cover-t.jpg`;
                this._loadImage(imgElement, url, () => {
                    targetCache.set(fc2Id, url);
                    if (onLoad) onLoad();
                }, tryJavPopInline);
            };

            tryFourhoi();
        }

        static _setNoImageState(imgElement, isNoImage) {
            if (location.hostname !== 'fd2ppv.cc') return;
            const container = imgElement?.closest?.(`.${Config.CLASSES.videoPreviewContainer}`);
            if (!container) return;
            if (isNoImage) container.setAttribute('data-fc2-turbo-no-image', '1');
            else container.removeAttribute('data-fc2-turbo-no-image');
        }

        static _loadImage(img, src, onSuccess, onFail) {
            let done = false;
            let timeoutId = null;
            const handleLoad = () => {
                if (done) return;
                done = true;
                cleanup();
                img.classList.add('loaded');
                this._setNoImageState(img, src === Config.NO_IMAGE_URL);
                if (onSuccess) onSuccess();
            };
            const handleError = () => {
                if (done) return;
                done = true;
                cleanup();
                if (onFail) onFail('error');
            };
            const handleAbort = () => {
                if (done) return;
                done = true;
                cleanup();
                if (onFail) onFail('abort');
            };
            const handleTimeout = () => {
                if (done) return;
                done = true;
                cleanup();
                try { img.src = ''; } catch (e) { }
                if (onFail) onFail('timeout');
            };
            const cleanup = () => {
                img.removeEventListener('load', handleLoad);
                img.removeEventListener('error', handleError);
                img.removeEventListener('abort', handleAbort);
                if (timeoutId) clearTimeout(timeoutId);
            };
            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);
            img.addEventListener('abort', handleAbort);
            const timeoutMs = SettingsManager.getNumber('imageLoadTimeout', Config.IMAGE_LOAD_TIMEOUT, 0, 60000);
            if (timeoutMs > 0) {
                timeoutId = setTimeout(handleTimeout, timeoutMs);
            }
            img.src = src;
            if (img.complete) {
                if (img.naturalWidth > 0) handleLoad();
                else handleError();
            }
        }

        static _applySrc(img, src, cb) {
            img.src = src;
            img.classList.add('loaded');
            this._setNoImageState(img, src === Config.NO_IMAGE_URL);
            if (cb) cb();
        }
    }

    // --- Toast 通知 ---
    class Toast {
        static show(message, type = 'info', duration = 3000) {
            const container = document.getElementById('fc2-turbo-toast-container') || this._createContainer();
            const toast = document.createElement('div');
            toast.className = `fc2-turbo-toast ${type}`;
            toast.textContent = message;
            container.appendChild(toast);

            // 视频来源
            requestAnimationFrame(() => toast.classList.add('show'));

            // 视频来源
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, Math.max(1000, duration));
        }

        static _createContainer() {
            const container = document.createElement('div');
            container.id = 'fc2-turbo-toast-container';
            document.body.appendChild(container);
            return container;
        }

        static error(msg) { this.show(msg, 'error'); }
        static info(msg) { this.show(msg, 'info'); }
        static success(msg) { this.show(msg, 'success'); }
    }

    class UIBuilder {
        static createElement(tag, options = {}) {
            const el = document.createElement(tag);
            Object.entries(options).forEach(([k, v]) => k === 'className' ? el.className = v : el[k] = v);
            return el;
        }

        static _syncViewStatusUI(card, isViewed) {
            const C = Config.CLASSES;
            card.classList.toggle(C.isViewed, isViewed);
            const toggleViewBtn = card.querySelector('.btn-toggle-view');
            if (toggleViewBtn) {
                toggleViewBtn.classList.toggle('is-viewed', isViewed);
                const tooltipText = isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed');
                const tooltip = toggleViewBtn.querySelector(`.${C.tooltip}`);
                if (tooltip) tooltip.textContent = tooltipText;
                toggleViewBtn.title = tooltipText;
            }
        }

        static createResourceButton(type, title, iconSvg, url) {
            const C = Config.CLASSES;
            const btn = this.createElement('a', { href: url, className: `${C.resourceBtn} ${type}`, title: title });
            if (type !== 'magnet') { btn.target = '_blank'; btn.rel = 'noopener noreferrer'; }
            btn.innerHTML = `${iconSvg}<span class="${C.buttonText}">${title}</span><span class="${C.tooltip}">${title}</span>`;

            // 视频来源列表
            if (['MissAV', 'Supjav'].includes(title)) {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (btn.classList.contains('checking')) return;

                    const originalIcon = btn.querySelector('svg');
                    const originalHTML = btn.innerHTML;

                    // 视频来源列表
                    btn.classList.add('checking');
                    const loadingIcon = '<svg class="fa-spin" style="animation:spin 1s linear infinite" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75 48 48 0 1 0 142.9 142.8zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>';
                    btn.innerHTML = `${loadingIcon}<span class="${C.buttonText}">${t('checking') || 'Checking...'}</span><span class="${C.tooltip}">${t('checking') || 'Checking...'}</span>`;

                    // 提取 ID
                    let checkType = title.toLowerCase();
                    let id = '';
                    const m = url.match(/fc2-ppv-(\d+)/) || url.match(/q=(\d+)/) || url.match(/s=(\d+)/);
                    if (m) id = m[1];
                    // Supjav 特殊情况：正则可能没有 fc2-ppv- 前缀
                    // URL 模板：
                    // MissAV：https://missav.ws/cn/fc2-ppv-%ID%
                    // Supjav：https://supjav.com/zh/?s=%ID%（可能只有数字）

                    // 缩略图来源
                    if (id) {
                        const exists = await ResourceChecker.check(checkType, id);
                        if (exists) {
                            window.open(url, '_blank');
                        } else {
                            Toast.error(`${title}: ${t('resourceNotFound') || 'Resource not found'}`);
                        }
                    } else {
                        window.open(url, '_blank'); // 新增
                    }

                    // 视频来源
                    btn.classList.remove('checking');
                    btn.innerHTML = originalHTML;
                });
            }

            return btn;
        }

        static createTurboCard(data) {
            const C = Config.CLASSES;
            const card = this.createElement('div', { className: C.processedCard });
            card.dataset.fc2id = data.fc2Id;

            if (SettingsManager.get('enableCollection')) {
                ItemDetailsManager.set(data.fc2Id, { title: data.title, imageUrl: data.imageUrl });
            }

            const preview = this.createElement('div', { className: C.videoPreviewContainer });
            // --- 修改开始：加载占位 + Javtiful 后台静默替换 ---

            // 1. 定义源
            // 1. 创建加载背景层（始终存在）
            const loadingBg = this.createElement('img', {
                src: Config.LOADING_IMAGE,
                className: `${C.staticPreview} ${C.previewElement}`
            });
            loadingBg.style.position = 'absolute';
            loadingBg.style.top = '0';
            loadingBg.style.left = '0';
            loadingBg.style.zIndex = '1';

            // 2. 创建实际图片前景层（初始透明，加载成功后显示）
            const previewImage = this.createElement('img', {
                className: `${C.staticPreview} ${C.previewElement}`
            });
            previewImage.style.position = 'absolute';
            previewImage.style.top = '0';
            previewImage.style.left = '0';
            previewImage.style.zIndex = '2';
            previewImage.style.opacity = '0';
            previewImage.style.transition = 'opacity 0.35s ease';

            const noVideoOverlay = this.createElement('div', {
                className: 'no-video-overlay',
                innerHTML: `${Icons.videoSlash}<span>${t('noVideoLabel')}</span>`
            });

            // 3. 自动播放视频逻辑
            const previewVideoSrc = `https://fourhoi.com/fc2-ppv-${data.fc2Id}/preview.mp4`;
            let previewVideo = null;
            let autoplayTimeout = null;
            let autoplayLoaded = false;
            const startAutoplayTimeout = () => {
                if (autoplayTimeout || autoplayLoaded) return;
                autoplayTimeout = setTimeout(() => {
                    autoplayTimeout = null;
                    if (autoplayLoaded) return;
                    if (previewVideo) {
                        previewVideo.remove();
                        previewVideo = null;
                    }
                    videoIsActive = false;
                    previewImage.style.opacity = '1';
                    noVideoOverlay.classList.add('is-visible');
                    card.dataset.previewFailed = 'true';
                }, Config.PREVIEW_VIDEO_TIMEOUT);
            };
            const clearAutoplayTimeout = () => {
                if (!autoplayTimeout) return;
                clearTimeout(autoplayTimeout);
                autoplayTimeout = null;
            };
            if (SettingsManager.get('previewMode') === 'autoplay') {
                previewVideo = this.createElement('video', {
                    className: `${C.staticPreview} ${C.previewElement}`,
                    muted: true,
                    loop: true,
                    playsInline: true,
                    preload: 'none'
                });
                previewVideo.dataset.src = previewVideoSrc;
                previewVideo.style.position = 'absolute';
                previewVideo.style.top = '0';
                previewVideo.style.left = '0';
                previewVideo.style.zIndex = '3'; // 缩略图来源
                previewVideo.style.opacity = '0';
                previewVideo.style.objectFit = 'contain';
                previewVideo.style.width = '100%';
                previewVideo.style.height = '100%';
                previewVideo.style.transition = 'opacity 0.5s ease';

                // 错误处理：视频失败则回退到图片
                previewVideo.onerror = () => {
                    clearAutoplayTimeout();
                    previewVideo.remove();
                    previewVideo = null;
                    // 更新提示：警告会删除缓存
                    videoIsActive = false;
                    previewImage.style.opacity = '1';
                    noVideoOverlay.classList.add('is-visible');
                    card.dataset.previewFailed = 'true';
                };
                previewVideo.oncanplay = () => {
                    autoplayLoaded = true;
                    clearAutoplayTimeout();
                    previewVideo.style.opacity = '1';
                    // 重构：根据收藏状态选择缓存
                    videoIsActive = true;
                    previewImage.style.opacity = '0';
                    noVideoOverlay.classList.remove('is-visible');
                };
            }

            // 页面卸载前刷新节流统计，避免丢失计数
            let videoIsActive = false;

            // 4. 通过 ImageLoader 处理加载逻辑
            const maxLoadRetries = 2;
            const getLoadRetryCount = () => {
                const count = parseInt(preview.dataset.loadRetry || '0', 10);
                return Number.isFinite(count) ? count : 0;
            };
            const bumpLoadRetry = () => {
                preview.dataset.loadRetry = String(getLoadRetryCount() + 1);
            };
            const isPagetualActive = () => (
                !!document.getElementById('pagetual-sideController')
                || !!document.querySelector('.pagetual_pageBar')
            );
            const isPreviewInView = () => {
                const rect = preview.getBoundingClientRect();
                const margin = 60;
                const viewportW = window.innerWidth || document.documentElement.clientWidth;
                const viewportH = window.innerHeight || document.documentElement.clientHeight;
                return rect.bottom >= -margin
                    && rect.top <= viewportH + margin
                    && rect.right >= -margin
                    && rect.left <= viewportW + margin;
            };
            const finalizeLoadState = () => {
                preview.dataset.loading = '';
                preview.dataset.loaded = '1';
                preview.dataset.loadRetry = '0';
            };
            const startLoadingChain = (force = false) => {
                if (previewImage.classList.contains('loaded')) return;
                if (!force && (preview.dataset.loading === '1' || preview.dataset.loaded === '1')) return;
                preview.dataset.loading = '1';
                const preferUrl = (location.hostname === 'fd2ppv.cc' && SettingsManager.get('preferFd2SiteImage')) ? data.imageUrl : null;
                ImageLoader.load(data.fc2Id, previewImage, {
                    preferUrl,
                    onLoad: () => {
                        requestAnimationFrame(() => {
                            // 更新提示：警告会删除缓存
                            if (!videoIsActive) {
                                previewImage.style.opacity = '1';
                            }
                            setTimeout(() => loadingBg.remove(), 400);
                        });
                        finalizeLoadState();
                    },
                    onError: () => {
                        requestAnimationFrame(() => {
                            // 更新提示：警告会删除缓存
                            if (!videoIsActive) {
                                previewImage.style.opacity = '1';
                            }
                            setTimeout(() => loadingBg.remove(), 400);
                        });
                        if (isPagetualActive() && getLoadRetryCount() < maxLoadRetries) {
                            bumpLoadRetry();
                            preview.dataset.loading = '';
                            if (isPreviewInView()) {
                                setTimeout(() => startLoadingChain(true), 800);
                            }
                            return;
                        }
                        finalizeLoadState();
                    }
                });
            };

            // IntersectionObserver 监听（全局）
            GlobalObserver.observe(
                'preview-lazy',
                preview,
                {
                    onEnter: () => {
                        startLoadingChain();
                        if (previewVideo) {
                            if (!previewVideo.src) {
                                previewVideo.src = previewVideo.dataset.src || '';
                                if (previewVideo.src) startAutoplayTimeout();
                            }
                            if (!previewVideo.isConnected) preview.appendChild(previewVideo);
                            previewVideo.play().catch(() => { /* 自动播放被阻止，忽略 */ });
                        }
                    },
                    onExit: () => {
                        if (previewVideo) {
                            previewVideo.pause();
                            previewVideo.currentTime = 0;
                            clearAutoplayTimeout();
                        }
                    }
                },
                { rootMargin: '60px' }
            );

            preview.append(loadingBg, previewImage, noVideoOverlay);

            const topLeftControls = this.createElement('div', { className: 'card-top-left-controls' });

            if (SettingsManager.get('enableHistory')) {
                const isViewed = HistoryManager.has(data.fc2Id);
                const tooltipText = isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed');
                // 增加 title 属性
                const toggleViewBtn = this.createElement('a', { href: 'javascript:void(0);', className: `resource-btn btn-toggle-view`, title: tooltipText });
                if (isViewed) toggleViewBtn.classList.add('is-viewed');
                toggleViewBtn.innerHTML = `
                    <span class="icon-viewed">${Icons.eye}</span>
                    <span class="icon-unviewed">${Icons.eyeSlash}</span>
                    <span class="${C.tooltip}">${tooltipText}</span>
                `;
                toggleViewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cardElement = toggleViewBtn.closest(`.${C.processedCard}`);
                    const outerCard = cardElement?.closest(`.${C.cardRebuilt}`);
                    if (!cardElement) return;
                    const isNowViewed = !cardElement.classList.contains('is-viewed');
                    if (isNowViewed) {
                        HistoryManager.add(data.fc2Id);
                    } else {
                        HistoryManager.remove(data.fc2Id);
                    }
                    this._syncViewStatusUI(cardElement, isNowViewed);
                    if (outerCard) outerCard.classList.toggle('is-viewed', isNowViewed);
                    this.applyHistoryVisibility(outerCard);
                });
                topLeftControls.appendChild(toggleViewBtn);
            }

            if (SettingsManager.get('enableCollection')) {
                const currentTags = TagManager.getTags(data.fc2Id);
                const isTagged = currentTags.length > 0;
                const tooltipText = isTagged ? t('tooltipEditCollection') : t('tooltipAddToCollection');
                const tagBtn = this.createResourceButton(
                    'btn-toggle-tag',
                    tooltipText,
                    isTagged ? Icons.star : Icons.starOutline,
                    'javascript:void(0);'
                );
                // 确保 createResourceButton 已经加了 title 属性，这里如果不放心可以再强制加一下
                tagBtn.title = tooltipText;

                if (isTagged) tagBtn.classList.add('is-tagged');
                // 新增：复制磁力处理
                const onSaveCallback = (newTagsArray) => {
                    TagManager.setTags(data.fc2Id, newTagsArray);

                    const nowIsTagged = newTagsArray.length > 0;
                    if (nowIsTagged) {
                        try {
                            ItemDetailsManager.set(data.fc2Id, {
                                title: data.title || `FC2-PPV-${data.fc2Id}`,
                                imageUrl: data.imageUrl || `https://wumaobi.com/fc2daily/data/FC2-PPV-${data.fc2Id}/cover.jpg`
                            });
                        } catch (e) { }
                    }

                    const newTooltipText = nowIsTagged ? t('tooltipEditCollection') + ` (${t('hintRightClickEdit')})` : t('tooltipAddToCollection');

                    tagBtn.classList.toggle('is-tagged', nowIsTagged);
                    tagBtn.title = newTooltipText;

                    const newIconRaw = nowIsTagged ? Icons.star : Icons.starOutline;
                    tagBtn.innerHTML = `${newIconRaw}<span class="${C.buttonText}">${newTooltipText}</span><span class="${C.tooltip}">${newTooltipText}</span>`;
                };

                tagBtn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const currentTags = TagManager.getTags(data.fc2Id);
                    if (currentTags.length > 0) {
                        // 视频来源列表
                        if (confirm(t('btnUnfavorite') + '?')) {
                            onSaveCallback([]);
                        }
                    } else {
                        // 视频来源
                        new TagEditorModal(data.fc2Id, [], onSaveCallback).show();
                    }
                });

                tagBtn.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    new TagEditorModal(data.fc2Id, TagManager.getTags(data.fc2Id), onSaveCallback).show();
                });
                topLeftControls.appendChild(tagBtn);
            }

            const badge = this.createElement('div', { className: C.fc2IdBadge, textContent: data.fc2Id, title: t('tooltipCopyMagnet') });
            badge.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                GM_setClipboard(data.fc2Id);
                badge.textContent = t('tooltipCopied');
                badge.classList.add(C.badgeCopied);
                setTimeout(() => { if (badge.isConnected) { badge.textContent = data.fc2Id; badge.classList.remove(C.badgeCopied); } }, Config.COPIED_BADGE_DURATION);
            });
            const badgeContainer = this.createElement('div', { className: 'card-id-container' });
            badgeContainer.appendChild(badge);

            preview.appendChild(topLeftControls);
            preview.appendChild(badgeContainer);

            if (data.preservedIconsHTML) {
                const iconsContainer = this.createElement('div', { className: C.preservedIconsContainer, innerHTML: data.preservedIconsHTML });
                preview.appendChild(iconsContainer);
                const temp = this.createElement('div', { innerHTML: data.preservedIconsHTML });
                const mosaicIcon = temp.querySelector('.icon-mosaic_free, .icon-mosaic');
                if (mosaicIcon) {
                    const isCensored = mosaicIcon.classList.contains('icon-mosaic')
                        || mosaicIcon.classList.contains('color_free0')
                        || !!mosaicIcon.closest('.color_free0');
                    if (isCensored) card.classList.add(C.isCensored);
                }
            }

            const info = this.createElement('div', { className: C.infoArea });
            if (data.title) info.appendChild(this.createElement('div', { className: C.customTitle, textContent: data.title }));

            const links = this.createElement('div', { className: C.resourceLinksContainer });
            const defaultLinks = [];
            if (SettingsManager.get('sourceVideoMissAV')) defaultLinks.push({ name: 'MissAV', icon: Icons.play, urlTemplate: 'https://missav.ws/cn/fc2-ppv-%ID%' });
            if (SettingsManager.get('sourceVideoSupjav')) defaultLinks.push({ name: 'Supjav', icon: Icons.globe, urlTemplate: 'https://supjav.com/zh/?s=%ID%' });
            if (SettingsManager.get('sourceVideoSukebei')) defaultLinks.push({ name: 'Sukebei', icon: Icons.magnifyingGlass, urlTemplate: 'https://sukebei.nyaa.si/?f=0&c=0_0&q=%ID%' });
            defaultLinks.forEach(link => links.append(this.createResourceButton(`default-search btn-${link.name.toLowerCase()}`, link.name, link.icon, link.urlTemplate.replace('%ID%', data.fc2Id))));
            info.appendChild(links);
            card.append(preview, info);

            let finalElement = card;
            if (data.articleUrl) {
                finalElement = this.createElement('a', { href: data.articleUrl, style: 'text-decoration:none;' });
                finalElement.appendChild(card);
            }

            if (SettingsManager.get('enableHistory')) {
                if (HistoryManager.has(data.fc2Id)) {
                    this._syncViewStatusUI(card, true);
                }
                if (finalElement.tagName === 'A') {
                    finalElement.addEventListener('mousedown', (event) => {
                        const target = event.target;
                        if (target.closest('.btn-toggle-view') || target.closest(`.${C.fc2IdBadge}`) || target.closest(`.${C.resourceBtn}`)) {
                            return;
                        }
                        if (card.classList.contains(C.isViewed)) {
                            return;
                        }
                        HistoryManager.add(data.fc2Id);
                        this._syncViewStatusUI(card, true);
                        const outerCard = card.closest(`.${C.cardRebuilt}`);
                        this.applyHistoryVisibility(outerCard);
                    });
                }
            }
            return { finalElement, linksContainer: links, newCard: card };
        }

        static createExtraPreviewsGrid(previews) {
            if (!previews) return null;
            const C = Config.CLASSES;
            const container = this.createElement('div', { className: C.extraPreviewContainer });
            container.innerHTML = `<h2 class="${C.extraPreviewTitle}">${t('extraPreviewTitle')}</h2>`;

            const images = previews.filter(p => p.type === 'image');
            const videos = previews.filter(p => p.type === 'video');

            // --- 视频（参考脚本逻辑） ---
            if (images.length > 0) {
                const isMultImg = images.length > 3;

                const imageContainer = this.createElement('div');
                imageContainer.style.display = 'grid';
                imageContainer.style.gridTemplateColumns = isMultImg ? '1fr 1fr 1fr' : '1fr';
                imageContainer.style.gap = '10px';
                imageContainer.style.marginTop = '10px';

                images.forEach(p => {
                    const imgEle = (p.element instanceof HTMLImageElement) ? p.element : this.createElement('img');
                    if (!p.element && p.src) {
                        imgEle.src = p.src;
                    }
                    // 新增：复制磁力处理
                    imgEle.style.width = '100%';
                    imgEle.style.height = 'auto';
                    imgEle.style.objectFit = 'contain';

                    if (isMultImg && p.src && p.src.includes('grid')) {
                        imgEle.style.gridColumn = "span 3";
                    }
                    imageContainer.appendChild(imgEle);
                });
                container.appendChild(imageContainer);
            } else {
                const noImg = this.createElement('div', {
                    className: 'no-preview-placeholder',
                    textContent: t('noPreviewImage')
                });
                noImg.style.textAlign = 'center';
                noImg.style.padding = '20px';
                noImg.style.color = '#777';
                noImg.style.background = '#252525';
                noImg.style.marginTop = '10px';
                noImg.style.borderRadius = '8px';
                container.appendChild(noImg);
            }

            // --- 视频（参考脚本逻辑） ---
            if (videos.length > 0) {
                const videoContainer = this.createElement('div');
                videoContainer.style.display = 'grid';
                videoContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
                videoContainer.style.gap = '10px';
                videoContainer.style.marginTop = '10px';

                videos.forEach(p => {
                    const video = this.createElement('video');
                    video.src = p.src;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.style.width = '100%';
                    videoContainer.appendChild(video);
                });
                container.appendChild(videoContainer);
            } else {
                const noVideo = this.createElement('div', {
                    className: 'no-preview-placeholder',
                    textContent: t('noPreviewVideo')
                });
                noVideo.style.textAlign = 'center';
                noVideo.style.padding = '20px';
                noVideo.style.color = '#777';
                noVideo.style.background = '#252525';
                noVideo.style.marginTop = '10px';
                noVideo.style.borderRadius = '8px';
                container.appendChild(noVideo);
            }

            return container;
        }
        static toggleLoading(container, show) {
            if (!container?.isConnected) return;
            const loadingButton = container.querySelector(`.${Config.CLASSES.btnLoading}`);
            if (show && !loadingButton) container.appendChild(this.createResourceButton(Config.CLASSES.btnLoading, t('tooltipLoading'), Icons.spinner, '#'));
            else if (!show && loadingButton) loadingButton.remove();
        }
        static addMagnetButton(container, url) {
            const card = container?.closest?.(`.${Config.CLASSES.cardRebuilt}`);
            if (card) card.dataset.hasMagnet = '1';
            if (!SettingsManager.get('sourceMagnet')) return;
            if (container && !container.querySelector(`.${Config.CLASSES.btnMagnet}`)) {
                const btn = this.createResourceButton('magnet', t('tooltipCopyMagnet'), Icons.magnet, 'javascript:void(0);');
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    GM_setClipboard(url);
                    const tooltip = btn.querySelector(`.${Config.CLASSES.tooltip}`);
                    if (tooltip) {
                        tooltip.textContent = t('tooltipCopied');
                        setTimeout(() => { tooltip.textContent = t('tooltipCopyMagnet'); }, Config.COPIED_BADGE_DURATION);
                    }
                });
                container.appendChild(btn);
            }
        }
        static _syncViewStatusUI(card, isViewed) {
            if (!card) return;
            const btn = card.querySelector('.btn-toggle-view');
            if (btn) {
                btn.classList.toggle('is-viewed', isViewed);
                const tooltip = btn.querySelector(`.${Config.CLASSES.tooltip}`);
                if (tooltip) tooltip.textContent = isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed');
                btn.title = isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed');
            }
            card.classList.toggle(Config.CLASSES.isViewed, isViewed);
        }
        static applyCardVisibility(card, hasMagnet) {
            if (!card) return;
            card.dataset.hasMagnet = hasMagnet ? '1' : '0';
        }
        static applyCensoredFilter() { }
        static applyHistoryVisibility() { }

    }

    class DynamicStyleApplier {
        static init() {
            AppEvents.on('settingsChanged', this.handleSettingsChange.bind(this));
            this.applyFilterClasses();
        }
        static handleSettingsChange({ key, newValue }) {
            switch (key) {
                case 'hideNoMagnet':
                case 'hideCensored':
                case 'hideViewed':
                    this.applyFilterClasses();
                    break;
                case 'cardLayoutMode':
                    document.body.classList.remove('layout-default', 'layout-compact');
                    document.body.classList.add(`layout-${newValue}`);
                    break;
            }
        }
        static applyFilterClasses() {
            document.body.classList.toggle('fc2-turbo-hide-no-magnet', !!SettingsManager.get('hideNoMagnet'));
            document.body.classList.toggle('fc2-turbo-hide-censored', !!SettingsManager.get('hideCensored'));
            document.body.classList.toggle('fc2-turbo-hide-viewed', !!SettingsManager.get('hideViewed'));
        }
        static applyAllCardVisibilities() { this.applyFilterClasses(); }
        static applyAllCensoredFilters() { this.applyFilterClasses(); }
        static applyAllHistoryVisibilities() { this.applyFilterClasses(); }
    }

    // =============================================================================
    // 第二部分：基础处理器
    // =============================================================================
    class BaseListProcessor {
        constructor() {
            this.cardQueue = new Map();
            this.cache = new CacheManager();
            this.processQueueDebounced = Utils.debounce(() => this.processQueue(), Config.DEBOUNCE_DELAY);
            this.pendingRoots = new Set();
            this.scanScheduled = false;
            this.cardSelector = null;
        }
        init() {
            const targetNode = document.querySelector(this.getContainerSelector());
            if (!targetNode) return;
            this.cardSelector = this.getCardSelector();
            PreviewManager.init(targetNode, `.${Config.CLASSES.processedCard}`);
            this.scanForCards(targetNode);
            new MutationObserver(mutations => {
                for (const m of mutations) for (const n of m.addedNodes) {
                    if (n.nodeType === 1) {
                        this._queueRoot(n);
                    }
                }
            }).observe(targetNode, { childList: true, subtree: true });
        }
        scanForCards(root = document) {
            const selector = this.cardSelector || this.getCardSelector();
            const base = root?.querySelectorAll ? root : document;
            if (!base?.querySelectorAll) return;
            base.querySelectorAll(selector).forEach(c => this.processCard(c));
        }
        _queueRoot(node) {
            if (!node) return;
            this.pendingRoots.add(node);
            this._scheduleScan();
        }
        _scheduleScan() {
            if (this.scanScheduled) return;
            this.scanScheduled = true;
            const run = () => {
                this.scanScheduled = false;
                this._processPendingRoots();
            };
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(run, { timeout: 200 });
            } else {
                requestAnimationFrame(run);
            }
        }
        _processPendingRoots() {
            if (this.pendingRoots.size === 0) return;
            const selector = this.cardSelector || this.getCardSelector();
            const roots = Array.from(this.pendingRoots);
            this.pendingRoots.clear();
            const cards = new Set();
            roots.forEach(root => {
                if (root.nodeType !== 1) return;
                if (root.matches && root.matches(selector)) cards.add(root);
                if (root.querySelectorAll) root.querySelectorAll(selector).forEach(card => cards.add(card));
            });
            cards.forEach(card => this.processCard(card));
        }
        async processQueue() {
            if (this.cardQueue.size === 0) return;
            const queue = new Map(this.cardQueue); this.cardQueue.clear();
            const toFetch = [];
            for (const [id, container] of queue.entries()) {
                const cachedEntry = this.cache.getEntry(id);
                if (cachedEntry.has) {
                    this.updateCardUI(container, cachedEntry.value);
                } else {
                    toFetch.push(id);
                    UIBuilder.toggleLoading(container, true);
                }
            }
            if (toFetch.length === 0) return;
            for (const chunk of Utils.chunk(toFetch, Config.NETWORK.CHUNK_SIZE)) {
                const results = await NetworkManager.fetchMagnetLinks(chunk);
                for (const id of chunk) {
                    const url = results.get(id) ?? null;
                    this.cache.set(id, url);
                    if (queue.has(id)) this.updateCardUI(queue.get(id), url);
                }
            }
            this.cache.save();
        }
        updateCardUI(container, magnetUrl) {
            UIBuilder.toggleLoading(container, false);
            if (magnetUrl) UIBuilder.addMagnetButton(container, magnetUrl);
            const card = container.closest(`.${Config.CLASSES.cardRebuilt}`);
            UIBuilder.applyCardVisibility(card, !!magnetUrl);
        }
        getContainerSelector() { throw new Error("Not implemented"); }
        getCardSelector() { throw new Error("Not implemented"); }
        processCard() { throw new Error("Not implemented"); }
    }
    class BaseDetailProcessor {
        constructor() { this.cache = new CacheManager(); }
        async addExtraPreviews() {
            if (!SettingsManager.get('loadExtraPreviews')) return;
            const fc2Id = Utils.extractFC2Id(location.pathname); if (!fc2Id) return;
            const anchor = document.querySelector(this.getPreviewAnchorSelector()); if (!anchor) return;

            // 1. 显示加载占位
            const C = Config.CLASSES;
            const loadingDiv = document.createElement('div');
            loadingDiv.className = C.extraPreviewContainer;
            loadingDiv.style.textAlign = 'center';
            loadingDiv.style.padding = '20px';
            loadingDiv.innerHTML = `
                <h2 class="${C.extraPreviewTitle}">${t('extraPreviewTitle')}</h2>
                <div style="font-size: 2rem; color: var(--fc2-turbo-primary); display: flex; justify-content: center;">
                    ${Icons.spinner}
                </div>
            `;
            this.mountExtraPreviews(anchor, loadingDiv);

            // 2. 处理图片
            try {
                const previewsData = await NetworkManager.fetchExtraPreviews(fc2Id);
                const previewsGrid = UIBuilder.createExtraPreviewsGrid(previewsData);

                // 3. 用内容替换加载占位
                if (previewsGrid && loadingDiv.parentNode) {
                    // 新增：复制磁力处理
                    // 新增：复制磁力处理
                    previewsGrid.querySelectorAll('img').forEach(img => {
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';

                        const handleLoad = () => {
                            // 过滤逻辑：移除“无图”占位（通常为 1:1 方图）
                            // 真实视频截图几乎都是横向（16:9）
                            // 过滤任何完全正方形的图片（容差 5px）
                            const isSquare = Math.abs(img.naturalWidth - img.naturalHeight) < 5;

                            if (isSquare) {
                                img.style.display = 'none';
                                // 优先挂在页头内容区；回退时按内容宽度对齐而不是视口。
                            } else {
                                img.style.opacity = '1';
                            }
                        };

                        img.onload = handleLoad;
                        // 作为别名以兼容现有调用
                        if (img.complete && img.naturalWidth > 0) handleLoad();
                    });
                    loadingDiv.replaceWith(previewsGrid);
                }
            } catch (e) {
                console.error("Extra Preview Fetch Error:", e);
                // 移除取消收藏按钮监听
                const fallbackGrid = UIBuilder.createExtraPreviewsGrid([]);
                if (loadingDiv.parentNode) loadingDiv.replaceWith(fallbackGrid);
            }
        }
        getPreviewAnchorSelector() { throw new Error("Not implemented"); }
        mountExtraPreviews(anchor, grid) { anchor.after(grid); }
    }

    // =============================================================================
    // 第三部分：针对特定网站的处理器
    // =============================================================================
    class FD2PPV_ListPageProcessor extends BaseListProcessor {
        getContainerSelector() { return 'body'; }
        getCardSelector() { return '.artist-card:not(.card-rebuilt):not(.other-work-item)'; }
        _extractCardData(card) {
            const link = card.querySelector('h3 a');
            const p = card.querySelector('p');
            const photoNode = card.querySelector('.work-photos');
            const imageUrl = Utils.extractImageUrl(photoNode);
            const mainLink = photoNode?.closest('a[href*="/articles/"]')
                ?? card.querySelector('a[href^="/articles/"]')
                ?? card.querySelector('a[href*="/articles/"]');
            if (!link || !mainLink) return null;
            const fc2Id = link.textContent.trim(); if (!/^\d{6,8}$/.test(fc2Id)) return null;
            return { fc2Id, title: p?.textContent.trim() ?? null, imageUrl, articleUrl: mainLink.href };
        }
        processCard(card) {
            const data = this._extractCardData(card); if (!data) return;
            let icons = Array.from(card.querySelectorAll('.float')).filter(node => node.querySelector('.icon'));
            if (icons.length === 0) icons = Array.from(card.querySelectorAll('.float[class*="free"]'));
            icons.sort((a, b) => Utils.getIconSortScore(a) - Utils.getIconSortScore(b));
            const preservedIconsHTML = icons.map(node => { const c = node.cloneNode(true); c.classList.remove('float', 'float-right', 'float-left'); return c.outerHTML; }).join('');
            const { finalElement, linksContainer, newCard } = UIBuilder.createTurboCard({ ...data, preservedIconsHTML });
            card.classList.add(Config.CLASSES.cardRebuilt); card.innerHTML = ''; card.appendChild(finalElement);
            if (newCard.classList.contains(Config.CLASSES.isCensored)) card.classList.add(Config.CLASSES.isCensored);
            if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
            UIBuilder.applyCardVisibility(card, false); UIBuilder.applyCensoredFilter(card); UIBuilder.applyHistoryVisibility(card);
            this.cardQueue.set(data.fc2Id, linksContainer); this.processQueueDebounced();
        }
    }
    class FD2PPV_ActressPageProcessor extends FD2PPV_ListPageProcessor {
        getContainerSelector() { return '.other-works-grid'; }
        getCardSelector() { return '.other-work-item.artist-card:not(.card-rebuilt)'; }
        _extractCardData(card) {
            const link = card.querySelector('.other-work-title a');
            const photoNode = card.querySelector('.work-photos');
            const imageUrl = Utils.extractImageUrl(photoNode);
            if (!link) return null; const fc2Id = link.textContent.trim(); if (!/^\d{6,8}$/.test(fc2Id)) return null;
            return { fc2Id, title: null, imageUrl, articleUrl: link.href };
        }
    }
    class FD2PPV_DetailPageProcessor extends BaseDetailProcessor {
        init() { this.processMainImage(); this.addExtraPreviews(); new FD2PPV_ActressPageProcessor().init(); }
        getPreviewAnchorSelector() { return '.artist-info-card'; }
        async processMainImage() {
            const titleEl = document.querySelector('h1.work-title');
            const imageSection = document.querySelector('.work-image-section');
            let mainCont = imageSection?.querySelector('.work-image-large.work-photos')
                ?? document.querySelector('.work-image-large.work-photos');
            if (!titleEl) return;
            if (!mainCont && imageSection) {
                mainCont = document.createElement('div');
                mainCont.className = 'work-image-large work-photos';
                imageSection.appendChild(mainCont);
            }
            if (!mainCont || mainCont.classList.contains(Config.CLASSES.cardRebuilt)) return;
            const fc2Id = titleEl.firstChild?.textContent.trim();
            const imageUrl = Utils.extractImageUrl(mainCont);
            if (!fc2Id || !/^\d{6,8}$/.test(fc2Id)) return;
            if (imageUrl) {
                GlobalImageCache.set(fc2Id, imageUrl);
            }
            const { finalElement, linksContainer, newCard } = UIBuilder.createTurboCard({ fc2Id, title: null, imageUrl, articleUrl: null, preservedIconsHTML: null });
            const previewContainer = finalElement.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            const previewImage = previewContainer?.querySelector('img');
            if (previewContainer && previewImage && SettingsManager.get('previewMode') === 'autoplay') {
                const video = PreviewManager._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, newCard);
                previewContainer.appendChild(video); video.classList.remove(Config.CLASSES.hidden); previewImage.classList.add(Config.CLASSES.hidden); video.play().catch(() => { });
            }
            mainCont.classList.remove('hidden');
            mainCont.classList.add(Config.CLASSES.cardRebuilt); mainCont.innerHTML = ''; mainCont.appendChild(finalElement);
            PreviewManager.init(mainCont, `.${Config.CLASSES.processedCard}`);
            const cachedEntry = this.cache.getEntry(fc2Id);
            if (cachedEntry.has) {
                if (cachedEntry.value) UIBuilder.addMagnetButton(linksContainer, cachedEntry.value);
            } else {
                UIBuilder.toggleLoading(linksContainer, true);
                const res = await NetworkManager.fetchMagnetLinks([fc2Id]);
                const url = res.get(fc2Id) ?? null; this.cache.set(fc2Id, url); this.cache.save();
                UIBuilder.toggleLoading(linksContainer, false);
                if (url) UIBuilder.addMagnetButton(linksContainer, url);
            }
        }
    }
    class FC2PPVDB_ListPageProcessor extends BaseListProcessor {
        getContainerSelector() { return '.container'; }
        getCardSelector() { return 'div.p-4:not(.card-rebuilt), div[class*="p-4"]:not(.card-rebuilt)'; }
        processCard(card) {
            if (!card.querySelector('a[href^="/articles/"]')) return;
            const link = card.querySelector('a[href^="/articles/"]'); const titleLink = card.querySelector('div.mt-1 a.text-white');
            const idSpan = card.querySelector('span.absolute.top-0.left-0'); const fc2Id = idSpan?.textContent.trim() ?? Utils.extractFC2Id(link.href);
            if (!fc2Id) return;
            const imageUrl = `https://wumaobi.com/fc2daily/data/FC2-PPV-${fc2Id}/cover.jpg`;
            const title = titleLink?.textContent.trim() ?? `FC2-PPV-${fc2Id}`;
            const { finalElement, linksContainer, newCard } = UIBuilder.createTurboCard({ fc2Id, title, imageUrl, articleUrl: link.href, preservedIconsHTML: null });
            card.innerHTML = ''; card.appendChild(finalElement); card.classList.add(Config.CLASSES.cardRebuilt);
            if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
            UIBuilder.applyCardVisibility(card, false); UIBuilder.applyHistoryVisibility(card);
            this.cardQueue.set(fc2Id, linksContainer); this.processQueueDebounced();
        }
    }
    class FC2PPVDB_DetailPageProcessor extends BaseDetailProcessor {
        init() { this.waitForElementAndProcess(); this.addExtraPreviews(); this.observeConflict(); }
        getPreviewAnchorSelector() { return '.container'; }
        mountExtraPreviews(anchor, grid) { anchor.appendChild(grid); }
        waitForElementAndProcess(retries = 10, interval = 500) {
            if (retries <= 0) return;
            const container = document.querySelector('div.lg\\:w-2\\/5') ?? document.getElementById('ArticleImage')?.closest('div') ?? document.getElementById('NoImage')?.closest('div');
            if (container && !container.classList.contains(Config.CLASSES.cardRebuilt)) this.processMainImage(container);
            else if (!container) setTimeout(() => this.waitForElementAndProcess(retries - 1, interval), interval);
        }
        async processMainImage(mainContainer) {
            const fc2Id = Utils.extractFC2Id(location.href); if (!fc2Id) return;
            const imageUrl = `https://wumaobi.com/fc2daily/data/FC2-PPV-${fc2Id}/cover.jpg`;
            const { finalElement, linksContainer, newCard } = UIBuilder.createTurboCard({ fc2Id, title: null, imageUrl, articleUrl: null });
            const previewContainer = finalElement.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            const img = previewContainer?.querySelector('img');
            if (previewContainer && img && SettingsManager.get('previewMode') === 'autoplay') {
                const video = PreviewManager._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, newCard);
                previewContainer.appendChild(video); video.classList.remove(Config.CLASSES.hidden); img.classList.add(Config.CLASSES.hidden); video.play().catch(() => { });
            }
            mainContainer.classList.add(Config.CLASSES.cardRebuilt); mainContainer.innerHTML = ''; mainContainer.appendChild(finalElement);
            PreviewManager.init(mainContainer, `.${Config.CLASSES.processedCard}`);
            const cachedEntry = this.cache.getEntry(fc2Id);
            if (cachedEntry.has) {
                if (cachedEntry.value) UIBuilder.addMagnetButton(linksContainer, cachedEntry.value);
            } else {
                UIBuilder.toggleLoading(linksContainer, true);
                const res = await NetworkManager.fetchMagnetLinks([fc2Id]);
                const url = res.get(fc2Id) ?? null; this.cache.set(fc2Id, url); this.cache.save();
                UIBuilder.toggleLoading(linksContainer, false);
                if (url) UIBuilder.addMagnetButton(linksContainer, url);
            }
        }
        observeConflict() {
            new MutationObserver((_, obs) => {
                const img1 = document.getElementById('ArticleImage'); const img2 = document.getElementById('NoImage');
                if (img1 && img2) { img1.classList.remove('hidden'); img2.remove(); obs.disconnect(); }
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    // =============================================================================
    // 第四部分：启动器、菜单、设置面板和路由
    // =============================================================================

    class SettingsPanel {
        static panel = null; static backdrop = null; static statsRendered = false; static _collectionRerenderScheduled = false;
        static show() {
            if (!this.panel) this._createPanel();
            this.backdrop.style.display = 'block'; this.panel.style.display = 'flex';
            this._renderSettingsForm();
        }
        static hide() {
            if (this.panel) { this.backdrop.style.display = 'none'; this.panel.style.display = 'none'; }
        }

        static _createPanel() {
            this.backdrop = UIBuilder.createElement('div', { className: 'turbo-modal-backdrop fc2-turbo-settings-backdrop' });
            this.panel = UIBuilder.createElement('div', { className: 'turbo-modal-panel fc2-turbo-settings-panel' });
            const showCollectionTab = SettingsManager.get('enableCollection');
            this.panel.innerHTML = `
                <div class="turbo-modal-header fc2-turbo-settings-header">
                    <h2>${t('settingsTitle')}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="fc2-turbo-settings-tabs">
                    <button class="fc2-turbo-tab-btn active" data-tab="settings">${t('tabSettings')}</button>
                    ${showCollectionTab ? `<button class="fc2-turbo-tab-btn" data-tab="collection">${t('tabCollection')}</button>` : ''}
                    <button class="fc2-turbo-tab-btn" data-tab="history">${t('tabHistory')}</button>
                    <button class="fc2-turbo-tab-btn" data-tab="cache">${t('tabCache')}</button>
                    <button class="fc2-turbo-tab-btn" data-tab="statistics">${t('tabStatistics')}</button>
                </div>
                <div class="fc2-turbo-settings-content">
                    <div id="tab-content-settings" class="fc2-turbo-tab-content active"></div>
                    ${showCollectionTab ? `<div id="tab-content-collection" class="fc2-turbo-tab-content"></div>` : ''}
                    <div id="tab-content-history" class="fc2-turbo-tab-content"></div>
                    <div id="tab-content-cache" class="fc2-turbo-tab-content"></div>
                    <div id="tab-content-statistics" class="fc2-turbo-tab-content"></div>
                </div>
                <div class="fc2-turbo-settings-footer" id="settings-footer">
                    <button class="fc2-turbo-btn primary" id="fc2-turbo-save-btn">${t('btnSaveAndApply')}</button>
                </div>
            `;
            document.body.append(this.backdrop, this.panel);
            this._addEventListeners();
        }

        static _renderSettingsForm() {
            const content = this.panel.querySelector('#tab-content-settings');
            content.innerHTML = `
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupFilters')}</h3>
                    <div class="fc2-turbo-form-row"><label for="setting-hideNoMagnet"><input type="checkbox" id="setting-hideNoMagnet"> ${t('optionHideNoMagnet')}</label></div>
                    ${location.hostname === 'fd2ppv.cc' ? `<div class="fc2-turbo-form-row"><label for="setting-hideCensored"><input type="checkbox" id="setting-hideCensored"> ${t('optionHideCensored')}</label></div>` : ''}
                    <div class="fc2-turbo-form-row"><label for="setting-hideViewed"><input type="checkbox" id="setting-hideViewed"> ${t('optionHideViewed')}</label></div>
                </div>
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupPageBehavior')}</h3>
                    <div class="fc2-turbo-form-row"><label for="setting-forceRefreshOnBack"><input type="checkbox" id="setting-forceRefreshOnBack"> ${t('optionForceRefreshOnBack')}</label></div>
                    <div class="fc2-turbo-form-row"><label for="setting-openDetailsInNewTab"><input type="checkbox" id="setting-openDetailsInNewTab"> ${t('optionOpenDetailsInNewTab')}</label></div>
                    ${location.hostname === 'fd2ppv.cc' ? `<div class="fc2-turbo-form-row"><label for="setting-preferFd2SiteImage"><input type="checkbox" id="setting-preferFd2SiteImage"> ${t('optionPreferFd2SiteImage')}</label></div>` : ''}
                </div>
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupAppearance')}</h3>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-theme">${t('labelTheme')}</label>
                        <select id="setting-theme">
                            <option value="auto">${t('themeAuto')}</option>
                            <option value="dark">${t('themeDark')}</option>
                            <option value="light">${t('themeLight')}</option>
                        </select>
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-previewMode">${t('labelPreviewMode')}</label>
                        <select id="setting-previewMode">
                            <option value="static">${t('previewModeStatic')}</option>
                            <option value="hover">${t('previewModeHover')}</option>
                            <option value="autoplay">${t('previewModeAuto')}</option>
                        </select>
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-glowColor">${t('labelGlowColor')}</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="color" id="setting-glowColor" list="fc2-turbo-color-presets" style="height: 30px; width: 50px; padding: 0; border: none; background: transparent; cursor: pointer;">
                        </div>
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-viewedColor">${t('labelViewedColor')}</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="color" id="setting-viewedColor" list="fc2-turbo-color-presets" style="height: 30px; width: 50px; padding: 0; border: none; background: transparent; cursor: pointer;">
                        </div>
                    </div>
                    <datalist id="fc2-turbo-color-presets">
                        <option value="#cba6f7">紫色 (默认光晕)</option>
                        <option value="#f5c2e7">粉红 (默认看过)</option>
                        <option value="#f9e2af">金色</option>
                        <option value="#89dceb">青色</option>
                        <option value="#f38ba8">玫红</option>
                        <option value="#a6e3a1">绿色</option>
                        <option value="#89b4fa">蓝色</option>
                        <option value="#fab387">橙色</option>
                        <option value="#94e2d5">薄荷</option>
                        <option value="#b4befe">淡紫</option>
                        <option value="#74c7ec">天蓝</option>
                        <option value="#eba0ac">珊瑚</option>
                    </datalist>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-cardLayoutMode">${t('labelCardLayout')}</label>
                        <select id="setting-cardLayoutMode"><option value="default">${t('layoutDefault')}</option><option value="compact">${t('layoutCompact')}</option></select>
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-gridColumns">每行显示列数</label>
                        <select id="setting-gridColumns">
                            <option value="0">默认自适应</option>
                            <option value="1">强制 1 列</option>
                            <option value="2">强制 2 列</option>
                            <option value="3">强制 3 列</option>
                            <option value="4">强制 4 列</option>
                            <option value="5">强制 5 列</option>
                            <option value="6">强制 6 列</option>
                        </select>
                    </div>
                </div>
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupDataHistory')}</h3>
                    <div class="fc2-turbo-form-row"><label for="setting-enableHistory"><input type="checkbox" id="setting-enableHistory"> ${t('optionEnableHistory')}</label></div>
                    <div class="fc2-turbo-form-row"><label for="setting-enableCollection"><input type="checkbox" id="setting-enableCollection"> ${t('optionEnableCollection')}</label></div>
                    <div class="fc2-turbo-form-row"><label for="setting-loadExtraPreviews"><input type="checkbox" id="setting-loadExtraPreviews"> ${t('optionLoadExtraPreviews')}</label></div>

                    <div class="fc2-turbo-form-row" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--fc2-turbo-border);">
                        <label>${t('groupDataManagement')}</label>
                        <div style="display: flex; gap: 1rem;">
                            <button class="fc2-turbo-btn" id="fc2-turbo-export-btn">${t('btnExportData')}</button>
                            <button class="fc2-turbo-btn" id="fc2-turbo-import-btn">${t('btnImportData')}</button>
                        </div>
                    </div>
                </div>
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupImageLoadTuning')}</h3>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-imageLoadTimeout">${t('labelImageLoadTimeout')}</label>
                        <input type="number" id="setting-imageLoadTimeout" min="0" max="60000" step="500">
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-imageChainTimeout">${t('labelImageChainTimeout')}</label>
                        <input type="number" id="setting-imageChainTimeout" min="0" max="120000" step="1000">
                    </div>
                    <div class="fc2-turbo-form-row">
                        <label for="setting-imageLoadConcurrency">${t('labelImageLoadConcurrency')}</label>
                        <input type="number" id="setting-imageLoadConcurrency" min="1" max="20" step="1">
                    </div>
                </div>
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupThumbnailSources')}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <label><input type="checkbox" id="setting-sourceFourhoi"> ${t('optionSourceFourhoi')}</label>
                        <label><input type="checkbox" id="setting-sourceJavPop"> ${t('optionSourceJavPop')}</label>
                        <label><input type="checkbox" id="setting-sourceWumaobi"> ${t('optionSourceWumaobi')}</label>
                        <label><input type="checkbox" id="setting-sourcePPVDataBank"> ${t('optionSourcePPVDataBank')}</label>
                        <label><input type="checkbox" id="setting-sourceFC2PPVMe"> ${t('optionSourceFC2PPVMe')}</label>
                        <label><input type="checkbox" id="setting-sourceFC2Direct"> ${t('optionSourceFC2Direct')}</label>
                    </div>
                </div>
                <!-- Detail Page Sources -->
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupDetailSources')}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <label><input type="checkbox" id="setting-sourceDetailWumaobi"> ${t('optionDetailWumaobi')}</label>
                        <label><input type="checkbox" id="setting-sourceDetailJavPop"> ${t('optionDetailJavPop')}</label>
                        <label><input type="checkbox" id="setting-sourceDetailPPVDataBank"> ${t('optionDetailPPVDataBank')}</label>
                        <label><input type="checkbox" id="setting-sourceDetailFC2Direct"> ${t('optionDetailFC2Direct')}</label>
                    </div>
                </div>
                <!-- Video Sources -->
                <div class="fc2-turbo-settings-group">
                    <h3>${t('groupVideoSources')}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <label><input type="checkbox" id="setting-sourceVideoMissAV"> ${t('optionVideoMissAV')}</label>
                        <label><input type="checkbox" id="setting-sourceVideoSupjav"> ${t('optionVideoSupjav')}</label>
                        <label><input type="checkbox" id="setting-sourceVideoSukebei"> ${t('optionVideoSukebei')}</label>
                        <label><input type="checkbox" id="setting-sourceMagnet"> ${t('optionVideoMagnet')}</label>
                    </div>
                </div>
            `;
            this.panel.querySelector('#setting-theme').value = SettingsManager.get('theme') || 'auto';
            this.panel.querySelector('#setting-previewMode').value = SettingsManager.get('previewMode');
            this.panel.querySelector('#setting-hideNoMagnet').checked = SettingsManager.get('hideNoMagnet');
            if (location.hostname === 'fd2ppv.cc') this.panel.querySelector('#setting-hideCensored').checked = SettingsManager.get('hideCensored');
            this.panel.querySelector('#setting-hideViewed').checked = SettingsManager.get('hideViewed');
            this.panel.querySelector('#setting-cardLayoutMode').value = SettingsManager.get('cardLayoutMode');
            this.panel.querySelector('#setting-loadExtraPreviews').checked = SettingsManager.get('loadExtraPreviews');
            this.panel.querySelector('#setting-enableHistory').checked = SettingsManager.get('enableHistory');
            this.panel.querySelector('#setting-enableCollection').checked = SettingsManager.get('enableCollection');
            this.panel.querySelector('#setting-sourceFourhoi').checked = SettingsManager.get('sourceFourhoi');
            this.panel.querySelector('#setting-sourceWumaobi').checked = SettingsManager.get('sourceWumaobi');
            this.panel.querySelector('#setting-sourcePPVDataBank').checked = SettingsManager.get('sourcePPVDataBank');
            this.panel.querySelector('#setting-sourceJavPop').checked = SettingsManager.get('sourceJavPop');
            this.panel.querySelector('#setting-sourceFC2Direct').checked = SettingsManager.get('sourceFC2Direct');
            this.panel.querySelector('#setting-sourceFC2PPVMe').checked = SettingsManager.get('sourceFC2PPVMe');
            // 视频来源列表
            this.panel.querySelector('#setting-sourceDetailWumaobi').checked = SettingsManager.get('sourceDetailWumaobi');
            this.panel.querySelector('#setting-sourceDetailPPVDataBank').checked = SettingsManager.get('sourceDetailPPVDataBank');
            this.panel.querySelector('#setting-sourceDetailJavPop').checked = SettingsManager.get('sourceDetailJavPop');
            this.panel.querySelector('#setting-sourceDetailFC2Direct').checked = SettingsManager.get('sourceDetailFC2Direct');
            // 视频来源列表
            this.panel.querySelector('#setting-sourceVideoMissAV').checked = SettingsManager.get('sourceVideoMissAV');
            this.panel.querySelector('#setting-sourceVideoSupjav').checked = SettingsManager.get('sourceVideoSupjav');
            this.panel.querySelector('#setting-sourceVideoSukebei').checked = SettingsManager.get('sourceVideoSukebei');
            this.panel.querySelector('#setting-sourceMagnet').checked = SettingsManager.get('sourceMagnet');
            this.panel.querySelector('#setting-gridColumns').value = GM_getValue(GRID_COLUMNS_KEY, 0);
            this.panel.querySelector('#setting-forceRefreshOnBack').checked = SettingsManager.get('forceRefreshOnBack');
            this.panel.querySelector('#setting-openDetailsInNewTab').checked = SettingsManager.get('openDetailsInNewTab');
            if (location.hostname === 'fd2ppv.cc') {
                this.panel.querySelector('#setting-preferFd2SiteImage').checked = SettingsManager.get('preferFd2SiteImage');
            }
            this.panel.querySelector('#setting-imageLoadTimeout').value = SettingsManager.getNumber('imageLoadTimeout', Config.IMAGE_LOAD_TIMEOUT, 0, 60000);
            this.panel.querySelector('#setting-imageChainTimeout').value = SettingsManager.getNumber('imageChainTimeout', Config.IMAGE_CHAIN_TIMEOUT, 0, 120000);
            this.panel.querySelector('#setting-imageLoadConcurrency').value = SettingsManager.getNumber('imageLoadConcurrency', Config.IMAGE_LOAD_CONCURRENCY, 1, 20);

            // 更新提示：警告会删除缓存
            const glowInput = this.panel.querySelector('#setting-glowColor');
            const viewedInput = this.panel.querySelector('#setting-viewedColor');
            const themeSelect = this.panel.querySelector('#setting-theme');

            glowInput.value = SettingsManager.get('glowColor');
            viewedInput.value = SettingsManager.get('viewedColor');

            glowInput.addEventListener('input', (e) => document.body.style.setProperty('--fc2-turbo-glow-color', e.target.value));
            viewedInput.addEventListener('input', (e) => document.body.style.setProperty('--fc2-turbo-viewed-color', e.target.value));

            // 视频来源列表
            themeSelect.addEventListener('change', (e) => {
                const theme = e.target.value;
                if (theme === 'auto') {
                    // 移除属性以回退默认值（或按需处理 auto 逻辑）
                    // 优先挂在页头内容区；回退时按内容宽度对齐而不是视口。
                    // 先假设默认深色；若为 auto，可考虑检测媒体查询。
                    // 用户需求是“浅色/深色/自动”。
                    // 若为 auto，可能需要检查 window.matchMedia。
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                        document.body.setAttribute('data-fc2-turbo-theme', 'light');
                    } else {
                        document.body.removeAttribute('data-fc2-turbo-theme');
                    }
                } else {
                    document.body.setAttribute('data-fc2-turbo-theme', theme);
                }
            });
        }
        static async _renderStatistics() {
            if (this.statsRendered) return;
            const content = this.panel.querySelector('#tab-content-statistics');

            const historyData = HistoryManager.getRawData();
            const magnetCache = new CacheManager();
            const imageCache = GlobalImageCache; // 视频来源
            const cacheStats = { hits: StatsTracker.get('cacheHits', 0) };

            AchievementManager.checkAll({ historyData, cacheStats });
            const unlockedIds = AchievementManager.getUnlockedIds();

            // 视频来源
            const collectionCount = Object.keys(TagManager.tags).length;
            const imageCount = imageCache.data.size;

            content.innerHTML = `
                <div class="fc2-turbo-stats-grid">
                    <div class="stat-block collection">
                         <div class="stat-value">${collectionCount}</div>
                         <div class="stat-label">${t('statCollectionCount')}</div>
                    </div>
                    <div class="stat-block history">
                        <div class="stat-value">${historyData.length} / ${Config.MAX_HISTORY_SIZE}</div>
                        <div class="stat-label">${t('statTotalViews')}</div>
                    </div>
                    <div class="stat-block magnet">
                        <div class="stat-value">${magnetCache.getSize()} / ${Config.CACHE_MAX_SIZE}</div>
                        <div class="stat-label">${t('statCachedMagnets')}</div>
                    </div>
                    <div class="stat-block image">
                        <div class="stat-value">${imageCount} / ${Config.IMAGE_CACHE_MAX_SIZE}</div>
                        <div class="stat-label">${t('statImageCacheCombined')}</div>
                    </div>
                    <div class="stat-block hit">
                        <div class="stat-value">${cacheStats.hits}</div>
                        <div class="stat-label">${t('statCacheHits')}</div>
                        <div style="font-size: 0.8em; opacity: 0.7; margin-top: 4px;">${t('tipCacheReset')}</div>
                    </div>
                </div>
                <div class="fc2-turbo-chart-container" id="activity-chart-wrapper" style="margin-top: 20px;">${t('chartLoading')}</div>
                <div id="achievements-placeholder"></div>
            `;

            this._renderAchievements(content.querySelector('#achievements-placeholder'), AchievementManager.getAll(), unlockedIds);

            try {
                await ExternalScripts.loadChartJs();
                const activityWrapper = content.querySelector('#activity-chart-wrapper');
                activityWrapper.innerHTML = '<canvas id="activityChart" style="height: 120px; width: 100%;"></canvas>';
                Chart.defaults.color = '#a6adc8';
                Chart.defaults.borderColor = 'rgba(205, 214, 244, 0.1)';
                this._renderActivityChart(content.querySelector('#activityChart'), historyData);
            } catch (error) {
                content.querySelector('#activity-chart-wrapper').textContent = 'Chart loading failed.';
            }
            this.statsRendered = true;
        }
        static _renderAchievements(container, allAchievements, unlockedIds) {
            let gridHTML = `<div class="fc2-turbo-achievements-container"><h3>${t('achievementsTitle')}</h3><div class="fc2-turbo-achievements-grid">`;

            // 作为别名以兼容现有调用
            const stats = {
                historyData: HistoryManager.getRawData(),
                cacheStats: { hits: StatsTracker.get('cacheHits', 0) }, // 修复：将 cacheHits 映射为 hits
                cacheSize: new CacheManager().getSize() // 可用近似值或按需添加 getter
            };

            allAchievements.forEach(ach => {
                // 根据图标名映射为 emoji，移除 Font Awesome 依赖
                const iconMap = {
                    'fa-seedling': '🌱', 'fa-tree': '🌳', 'fa-forest': '🌲',
                    'fa-bolt-lightning': '⚡', 'fa-rocket': '🚀',
                    'fa-moon': '🌙', 'fa-sun': '🌅',
                    'fa-calendar-week': '📅', 'fa-calendar-days': '🔥',
                    'fa-gauge-high': '⏱️', 'fa-clover': '🍀',
                    'fa-award': '🏆', 'fa-trophy': '🎁', // 首次击杀 / 成就猎人
                    'fa-skull': '💀', 'fa-dna': '🧬', 'fa-bed': '🛌', 'fa-floppy-disk': '💾', 'fa-gift': '🎁'
                };
                const emoji = iconMap[ach.icon] || '🏅';
                const isUnlocked = unlockedIds.has(ach.id);
                const statusClass = isUnlocked ? 'unlocked' : 'locked';
                const debuffClass = ach.type === 'debuff' ? 'debuff' : '';

                // 视频来源
                let progressHTML = '';
                if (ach.getProgress) {
                    const progress = ach.getProgress(stats);
                    const percent = Math.min(100, Math.max(0, (progress.current / progress.max) * 100));
                    progressHTML = `
                        <div class="fc2-turbo-achievement-progress">
                            <div class="progress-bar" style="width: ${percent}%;"></div>
                        </div>
                        <div class="progress-text">${progress.current} / ${progress.max}</div>
                    `;
                }

                gridHTML += `
                    <div class="fc2-turbo-achievement-badge ${statusClass} ${debuffClass}" title="${t(ach.descriptionKey)}">
                        <div class="icon">${emoji}</div>
                        <div class="details">
                            <div class="title">${t(ach.titleKey)}</div>
                            <div class="description">${t(ach.descriptionKey)}</div>
                            ${progressHTML}
                        </div>
                    </div>`;
            });
            container.innerHTML = gridHTML;

            // 若未注入进度条 CSS 则注入（简单内联检查或追加）
            if (!document.getElementById('fc2-turbo-achievements-css')) {
                const style = document.createElement('style');
                style.id = 'fc2-turbo-achievements-css';
                style.textContent = `
                    .fc2-turbo-achievement-badge {
                        position: relative;
                        padding-bottom: 24px !important; /* 为进度条腾出空间 */
                    }
                    .fc2-turbo-achievement-badge.debuff {
                        border-color: rgba(243, 139, 168, 0.3) !important;
                        background: rgba(243, 139, 168, 0.05) !important;
                    }
                    .fc2-turbo-achievement-badge.debuff.unlocked {
                        border-color: rgba(243, 139, 168, 0.8) !important;
                        background: rgba(243, 139, 168, 0.1) !important;
                        box-shadow: 0 4px 12px rgba(243, 139, 168, 0.2);
                    }
                    .fc2-turbo-achievement-badge.debuff .icon {
                        filter: grayscale(0.2);
                    }
                    .fc2-turbo-achievement-progress {
                        position: absolute;
                        bottom: 8px;
                        left: 12px;
                        right: 12px;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                        overflow: hidden;
                    }
                    .fc2-turbo-achievement-progress .progress-bar {
                        height: 100%;
                        background: var(--fc2-turbo-primary);
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    }
                    /* 为进度条腾出空间 */
                    .fc2-turbo-achievement-badge.debuff .progress-bar {
                        background: #f38ba8;
                    }
                    .progress-text {
                        position: absolute;
                        bottom: 8px;
                        right: 12px;
                        font-size: 10px;
                        color: var(--fc2-turbo-text-dim);
                        line-height: 1;
                        background: rgba(30, 30, 46, 0.8); /* 可读性背景 */
                        padding: 0 4px;
                        border-radius: 4px;
                        display: none; /* 为进度条腾出空间 */
                    }
                    /* 文本悬停显示还是常显？这里常显并做样式优化 */
                    .progress-text { display: block; bottom: 16px; right: 12px; background: none; } /* 重新定位 */
                    .fc2-turbo-achievement-progress { bottom: 12px; }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-badge {
                        background: #ffffff;
                        border-color: rgba(59, 91, 255, 0.18);
                        box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
                    }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-badge.locked {
                        filter: grayscale(0.4);
                        opacity: 0.85;
                    }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-badge.unlocked {
                        background: linear-gradient(135deg, rgba(59, 91, 255, 0.12), rgba(123, 141, 255, 0.18));
                        border-color: rgba(59, 91, 255, 0.35);
                    }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-badge.debuff {
                        background: rgba(255, 99, 132, 0.08) !important;
                        border-color: rgba(255, 99, 132, 0.3) !important;
                    }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-badge.debuff.unlocked {
                        background: rgba(255, 99, 132, 0.14) !important;
                        border-color: rgba(255, 99, 132, 0.55) !important;
                        box-shadow: 0 6px 14px rgba(255, 99, 132, 0.2);
                    }
                    body[data-fc2-turbo-theme="light"] .fc2-turbo-achievement-progress {
                        background: rgba(59, 91, 255, 0.12);
                        box-shadow: inset 0 0 0 1px rgba(59, 91, 255, 0.16);
                    }
                    body[data-fc2-turbo-theme="light"] .progress-text {
                        color: #4c4f69;
                    }
                 `;
                document.head.appendChild(style); // 追加到 head 以保持持久
            }
        }

        static _renderHistory() {
            const content = this.panel.querySelector('#tab-content-history');
            const history = HistoryManager.getRawData();
            const magnetCache = new CacheManager(); // 初始化 CacheManager

            let html = `
                <div class="fc2-turbo-list-header">
                    <h3>${t('labelHistoryManagement')} (${history.length}/${Config.MAX_HISTORY_SIZE})</h3>
                    <button class="fc2-turbo-btn small danger" id="btn-clear-history">${t('btnClearHistory')}</button>
                </div>
            `;

            if (history.length === 0) {
                html += `<p class="collection-empty">${t('msgHistoryEmpty')}</p>`;
            } else {
                html += `<ul class="fc2-turbo-list">`;
                [...history].reverse().forEach(item => {
                    const date = new Date(item.timestamp).toLocaleString();
                    const url = `https://${location.hostname}/articles/${item.id}`;

                    // 我会加个检查以防万一，或保持简单。
                    let magnetLink = CollectionMagnetManager.get(item.id);
                    if (!magnetLink || magnetLink === 'NOT_FOUND') {
                        const cachedVal = magnetCache.data.get(item.id);
                        if (cachedVal && cachedVal.v && typeof cachedVal.v === 'string' && cachedVal.v.startsWith('magnet:')) {
                            magnetLink = cachedVal.v;
                        } else {
                            magnetLink = null;
                        }
                    }

                    const magnetBtn = magnetLink
                        ? `<button class="icon-btn copy-magnet-history" data-magnet="${magnetLink}" title="${t('tooltipCopyMagnet') || 'Copy Magnet'}" style="margin-left: 8px; color: var(--fc2-turbo-primary); font-size: 1.1em;">${Icons.magnet}</button>`
                        : '';

                    html += `
                    <li class="fc2-turbo-list-item">
                        <div style="display:flex; align-items:center;">
                            <div class="item-thumb" title="FC2-PPV-${item.id}">
                                <img src="${Config.LOADING_IMAGE}" data-fc2id="${item.id}" class="history-lazy-img">
                            </div>
                            <span class="item-name"><a href="${url}" target="_blank">FC2-PPV-${item.id}</a></span>
                            ${magnetBtn}
                        </div>
                        <div style="display:flex; align-items:center;">
                            <span class="item-date">${date}</span>
                            <button class="icon-btn delete-history-item" data-id="${item.id}" title="${t('tooltipDeleteTag')}">&times;</button>
                        </div>
                    </li>`;
                });
                html += `</ul>`;
            }
            content.innerHTML = html;

            // 缩略图来源
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const fc2Id = img.dataset.fc2id;
                        ImageLoader.load(fc2Id, img);
                        observer.unobserve(img);
                    }
                });
            }, { root: null, rootMargin: '200px' });

            content.querySelectorAll('.history-lazy-img').forEach(img => observer.observe(img));

            // 视频来源
            content.querySelector('#btn-clear-history')?.addEventListener('click', () => {
                if (confirm(t('confirmClearHistory'))) {
                    HistoryManager.clear();
                    this._renderHistory();
                    Toast.success(t('msgHistoryCleared')); // 改为 Toast
                }
            });

            content.querySelectorAll('.delete-history-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    HistoryManager.remove(id);
                    this._renderHistory();
                });
            });

            // 新增：复制磁力处理
            content.querySelectorAll('.copy-magnet-history').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const magnet = btn.dataset.magnet;
                    GM_setClipboard(magnet);
                    Toast.success(t('tooltipCopied') || 'Copied!');
                });
            });
        }

        static _renderCache() {
            const content = this.panel.querySelector('#tab-content-cache');
            const magnetCache = new CacheManager();
            const imageCache = GlobalImageCache;

            // 视频来源
            const combinedData = new Map();

            // 1. 处理磁力
            magnetCache.data.forEach((val, id) => {
                if (!val.v || typeof val.v !== 'string' || !val.v.startsWith('magnet:')) return;
                if (!combinedData.has(id)) combinedData.set(id, { id, t: 0 });
                const item = combinedData.get(id);
                item.magnet = val.v;
                item.t = Math.max(item.t, val.t);
            });

            // 2. 处理图片
            imageCache.data.forEach((val, id) => {
                if (!combinedData.has(id)) combinedData.set(id, { id, t: 0 });
                const item = combinedData.get(id);
                item.image = val.url;
                item.t = Math.max(item.t, val.t);
            });

            const sorted = [...combinedData.values()].sort((a, b) => b.t - a.t);

            let html = `
                <div class="fc2-turbo-list-header">
                     <h3>${t('labelCacheManagement') || '磁力与图片缓存'} (${sorted.length})</h3>
                     <button class="fc2-turbo-btn small danger" id="btn-clear-all-cache">${t('btnClearCache')}</button>
                </div>
            `;

            if (sorted.length === 0) {
                html += `<p class="collection-empty">${t('msgCacheEmpty')}</p>`;
            } else {
                html += `<ul class="fc2-turbo-list">`;
                const historyIds = new Set(HistoryManager.getRawData().map(i => i.id));

                sorted.forEach(item => {
                    const date = new Date(item.t).toLocaleString();
                    const isProtected = historyIds.has(item.id);
                    const protectedClass = isProtected ? 'protected' : '';

                    // 视频来源
                    const magnetIcon = item.magnet ? `<span title="Magnet Cached" style="color:var(--fc2-turbo-primary)">${Icons.magnet}</span>` : `<span style="opacity:0.3">${Icons.magnet}</span>`;
                    const imageIcon = item.image ? `<span title="Image Cached" style="color:var(--fc2-turbo-primary)">${Icons.image || '🖼️'}</span>` : `<span style="opacity:0.3">${Icons.image || '🖼️'}</span>`;

                    const deleteBtn = isProtected
                        ? `<button class="icon-btn disabled" title="Protected (In History)">${Icons.lock || '🔒'}</button>`
                        : `<button class="icon-btn delete-cache-item" data-id="${item.id}" title="${t('tooltipDeleteTag')}">&times;</button>`;

                    html += `
                    <li class="fc2-turbo-list-item ${protectedClass}">
                        <div style="display:flex; align-items:center;">
                             <div class="item-thumb" title="FC2-PPV-${item.id}">
                                <img src="${Config.LOADING_IMAGE}" data-fc2id="${item.id}" class="cache-lazy-img">
                            </div>
                            <div style="display:flex; flex-direction:column; margin-left: 8px;">
                                <span class="item-name">FC2-PPV-${item.id}</span>
                                <div style="display:flex; gap:8px; font-size:12px; margin-top:2px;">
                                    ${magnetIcon} ${imageIcon}
                                </div>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <span class="item-date">${date}</span>
                            ${deleteBtn}
                        </div>
                    </li>`;
                });
                html += `</ul>`;
            }

            content.innerHTML = html;

            // 缩略图来源
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const fc2Id = img.dataset.fc2id;
                        ImageLoader.load(fc2Id, img);
                        observer.unobserve(img);
                    }
                });
            }, { root: null, rootMargin: '200px' });
            content.querySelectorAll('.cache-lazy-img').forEach(img => observer.observe(img));

            // --- 事件监听 ---

            // 页面卸载前刷新节流统计，避免丢失计数
            content.querySelector('#btn-clear-all-cache')?.addEventListener('click', () => {
                if (confirm(t('confirmClearCache'))) {
                    const protectedIds = new Set(HistoryManager.getRawData().map(i => i.id));

                    // 视频来源
                    for (const id of magnetCache.data.keys()) {
                        if (!protectedIds.has(id)) magnetCache.data.delete(id);
                    }
                    magnetCache.save();

                    // 视频来源
                    GlobalImageCache.clear(protectedIds);

                    this._renderCache();
                    Toast.success(t('msgCacheCleared') || '缓存已清理');
                }
            });

            // 缩略图来源
            content.querySelectorAll('.delete-cache-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').dataset.id; // 点击图标时使用 closest

                    // 视频来源列表
                    if (magnetCache.data.has(id)) {
                        magnetCache.data.delete(id);
                        magnetCache.save();
                    }
                    if (GlobalImageCache.data.has(id)) {
                        GlobalImageCache.data.delete(id);
                        GlobalImageCache.save();
                    }

                    this._renderCache();
                });
            });
        }

        static _renderCollection() {
            const content = this.panel.querySelector('#tab-content-collection');
            const allTags = TagManager.getMasterTagList();
            const taggedItemsByTag = TagManager.getAllTaggedItems();
            const currentDomain = location.hostname;

            let html = `
                <div class="collection-container">
                    <div class="collection-header" style="justify-content: flex-start; padding-bottom: 13px;">
                        <button id="btn-create-tag" class="fc2-turbo-btn small" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 0.9em; height: 34px;">
                            ${Icons.plus} ${t('labelNewTag')}
                        </button>
                    </div>
            `;

            if (allTags.length === 0) {
                html += `<p class="collection-empty">${t('collectionEmpty')}</p>`;
            } else {
                allTags.forEach(tag => {
                    const items = taggedItemsByTag[tag] || [];
                    html += `<details class="collection-group" open>
                        <summary class="collection-tag-title">
                            <div style="display: flex; align-items: center;">
                                <span class="icon-chevron">${Icons.chevronDown}</span>
                                <span>${tag} (${items.length})</span>
                            </div>
                            <div class="tag-actions">
                                <span class="tag-action-btn delete-tag" data-tag="${tag}" title="${t('tooltipDeleteTag')}">${Icons.trash}</span>
                            </div>
                        </summary>`;

                    if (items.length > 0) {
                        html += `<div class="collection-item-grid">`;
                        items.forEach(id => {
                            let details = ItemDetailsManager.get(id);
                            if (!details) details = { title: `FC2-PPV-${id}` };
                            const articleUrl = `https://${currentDomain}/articles/${id}`;
                            // 使用全局 Icons
                            const C = Config.CLASSES;
                            html += `
                                <div class="collection-item-wrapper">
                                    <div class="collection-remove-btn" data-fc2id="${id}" title="${t('btnUnfavorite')}">${Icons.close || '&times;'}</div>
                                    <a href="${articleUrl}" target="_blank" class="collection-item">
                                        <img class="collection-lazy-img" data-fc2id="${id}" src="${Config.LOADING_IMAGE}">
                                        <div class="collection-item-id-row">FC2-PPV-${id}</div>
                                        <div class="collection-item-title" title="${details.title}">${details.title}</div>
                                    </a>
                                    <div class="collection-hover-actions">
                                        <a href="https://missav.ws/cn/fc2-ppv-${id}" target="_blank" class="hover-btn btn-missav resource-btn" title="MissAV">
                                            ${Icons.play}
                                            <span class="${C.tooltip}">MissAV</span>
                                        </a>
                                        <a href="https://supjav.com/zh/?s=${id}" target="_blank" class="hover-btn btn-supjav resource-btn" title="Supjav">
                                            ${Icons.globe}
                                            <span class="${C.tooltip}">Supjav</span>
                                        </a>
                                        <a href="https://sukebei.nyaa.si/?f=0&c=0_0&q=${id}" target="_blank" class="hover-btn btn-sukebei resource-btn" title="Sukebei">
                                            ${Icons.magnifyingGlass}
                                            <span class="${C.tooltip}">Sukebei</span>
                                        </a>
                                        </a>
                                        <div class="hover-btn btn-magnet resource-btn" data-fc2id="${id}" title="Magnet" style="${CollectionMagnetManager.get(id) === 'NOT_FOUND' ? 'display:none' : ''}">
                                            ${Icons.magnet}
                                            <span class="${C.tooltip}">Magnet</span>
                                        </div>
                                    </div>
                                    <button class="icon-btn edit-item-tags" data-id="${id}" title="${t('tooltipEditCollection')}">${Icons.edit}</button>
                                </div>`;
                        });
                        html += `</div>`;
                    } else {
                        html += `<div class="collection-empty-tag">${t('collectionEmpty')}</div>`;
                    }
                    html += `</details>`;
                });
            }
            html += `</div>`;
            content.innerHTML = html;

            content.querySelectorAll('.collection-lazy-img').forEach(img => {
                ImageLoader.load(img.dataset.fc2id, img, {
                    onLoad: () => img.classList.add('loaded')
                });
            });

            // 3. 开始链式处理
            const idsToCheck = [];
            const updateMagnetButton = (id, magnet) => {
                const btn = content.querySelector(`.btn-magnet[data-fc2id="${id}"]`);
                if (!btn) return;
                if (magnet === 'NOT_FOUND' || !magnet) {
                    btn.style.display = 'none';
                } else {
                    btn.style.display = 'inline-flex';
                    btn.classList.remove('checking');
                    btn.innerHTML = `${Icons.magnet}<span class="${Config.CLASSES.tooltip}">Magnet</span>`;
                }
            };

            // 收集 ID 并显示加载状态
            allTags.forEach(tag => {
                (taggedItemsByTag[tag] || []).forEach(id => {
                    if (!CollectionMagnetManager.has(id)) {
                        idsToCheck.push(id);
                        const btn = content.querySelector(`.btn-magnet[data-fc2id="${id}"]`);
                        if (btn) {
                            btn.classList.add('checking');
                            btn.innerHTML = `<svg class="fa-spin" style="animation:spin 1s linear infinite; font-size: 0.9em;" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75 48 48 0 1 0 142.9 142.8zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>`;
                        }
                    }
                });
            });

            // 视频来源列表
            if (idsToCheck.length > 0) {
                const CHUNK_SIZE = 20;
                for (let i = 0; i < idsToCheck.length; i += CHUNK_SIZE) {
                    const chunk = idsToCheck.slice(i, i + CHUNK_SIZE);
                    NetworkManager.fetchMagnetLinks(chunk).then(map => {
                        chunk.forEach(id => {
                            const magnet = map.get(id);
                            if (magnet) {
                                CollectionMagnetManager.set(id, magnet);
                                updateMagnetButton(id, magnet);
                            } else {
                                CollectionMagnetManager.set(id, 'NOT_FOUND');
                                updateMagnetButton(id, 'NOT_FOUND');
                            }
                        });
                    });
                }
            }

            // --- 首次击杀移到最后 ---

            // 1. 移除按钮（X）
            content.querySelectorAll('.collection-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const id = btn.dataset.fc2id;
                    // 更新提示：警告会删除缓存
                    if (confirm(`${t('btnUnfavorite')}?\n\n${t('warnCacheDeletion') || 'This will also delete the cached images and magnet links for this video.'}`)) {
                        TagManager.setTags(id, []);
                        this._renderCollection();
                        Toast.success(t('msgRemovedFromCollection') || 'Removed from collection');
                    }
                });
            });

            // ...（资源按钮代码已省略）

            content.querySelectorAll('.delete-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const tag = btn.dataset.tag;
                    // 更新提示：警告会删除缓存
                    if (confirm(t('confirmDeleteTag').replace('{tag}', tag) + `\n\n${t('warnTagCacheDeletion') || 'Items removed from collection will have their cached images/magnets deleted.'}`)) {
                        TagManager.deleteMasterTag(tag);
                        this._renderCollection();
                        Toast.success(t('msgCollectionDeleted')); // 已添加 Toast
                    }
                });
            });

            content.querySelectorAll('.edit-item-tags').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = btn.dataset.id; // 修复：使用 btn 而不是 e.target
                    if (!id) {
                        console.error('Edit tags: No ID found on button');
                        return;
                    }
                    const currentTags = TagManager.getTags(id);
                    new TagEditorModal(id, currentTags, (newTags) => {
                        TagManager.setTags(id, newTags);
                        this._renderCollection();
                    }).show();
                });
            });

            // 视频来源列表
            content.querySelector('#btn-create-tag')?.addEventListener('click', () => {
                const newTagName = prompt(t('placeholderAddTag') || 'Enter new tag name:');
                if (newTagName && newTagName.trim()) {
                    if (TagManager.addMasterTag(newTagName.trim())) {
                        this._renderCollection();
                        // 按需求移除 Toast
                    } else {
                        Toast.error(t('msgTagExists') || 'Tag already exists.');
                    }
                }
            });
        }

        static _scheduleCollectionRerender() {
            if (!this.panel || this.panel.style.display === 'none') return;
            const activeTab = this.panel.querySelector('.fc2-turbo-tab-btn.active')?.dataset.tab;
            if (activeTab !== 'collection') return;
            if (this._collectionRerenderScheduled) return;
            this._collectionRerenderScheduled = true;
            setTimeout(() => {
                this._collectionRerenderScheduled = false;
                this._renderCollection();
            }, 0);
        }

        static updateCollectionStat(count) {
            if (!this.panel || !this.statsRendered) return;
            const statNode = this.panel.querySelector('.stat-block.collection .stat-value');
            if (statNode) statNode.textContent = count;
        }

        static _renderActivityChart(canvas, historyData) {
            if (!canvas) return;
            // 配置：14 天
            const days = 14;
            const activityData = new Map();
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(); d.setDate(d.getDate() - i);
                activityData.set(d.toISOString().slice(0, 10), 0);
            }
            const cutOffDate = new Date(); cutOffDate.setDate(cutOffDate.getDate() - days);
            historyData.filter(item => item.timestamp >= cutOffDate.getTime()).forEach(item => {
                const dateStr = new Date(item.timestamp).toISOString().slice(0, 10);
                if (activityData.has(dateStr)) activityData.set(dateStr, activityData.get(dateStr) + 1);
            });

            // 缩略图来源
            new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [...activityData.keys()].map(d => d.slice(5)), // 月-日
                    datasets: [{
                        label: t('chartActivityLabel'),
                        data: [...activityData.values()],
                        backgroundColor: 'rgba(137, 180, 250, 0.6)',
                        borderColor: '#89b4fa',
                        borderWidth: 1,
                        borderRadius: 3,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // 切换到收藏标签页
                    scales: {
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: '#a6adc8', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 7 }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                            ticks: { display: false } // 隐藏 Y 轴数字以保持紧凑
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }, // 新增：复制磁力处理
                        tooltip: {
                            backgroundColor: 'rgba(30, 30, 46, 0.9)',
                            titleColor: '#cdd6f4',
                            bodyColor: '#cdd6f4',
                            padding: 8,
                            cornerRadius: 4,
                            displayColors: false
                        }
                    }
                }
            });
        }

        static _renderCacheChart(canvas, cacheSize, maxCacheSize) {
            if (!canvas) return;
            ExternalScripts.loadChartJs().then(() => {
                new Chart(canvas.getContext('2d'), { type: 'doughnut', data: { labels: [t('chartCacheUsed'), t('chartCacheFree')], datasets: [{ data: [cacheSize, Math.max(0, maxCacheSize - cacheSize)], backgroundColor: ['#89b4fa', 'rgba(0,0,0,0.3)'], borderColor: 'rgba(30, 30, 46, 0.8)', borderWidth: 4 }] }, options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#cdd6f4' } }, title: { display: true, text: t('chartCacheTitle'), color: '#cdd6f4' } } } });
            }).catch(() => { });
        }

        static _exportData() {
            try {
                flushAllData();
                const exportData = {
                    __id: 'FC2PPVDB_Turbo_Backup',
                    __version: GM_info.script.version,
                    __exportDate: new Date().toISOString(),
                    settings: { ...SettingsManager.getAll() },
                    history: HistoryManager.getRawData(),
                    stats: { ...StatsTracker.getAll() },
                    achievements: [...AchievementManager.getUnlockedIds()],
                    // 视频来源
                    collection: {
                        tags: TagManager.tags,
                        masterTagList: [...TagManager.masterTagList]
                    }
                };
                const exportString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([exportString], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `FC2PPVDB_TURBO_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
                console.log(t('alertExportSuccess'));
            } catch (e) {
                console.error("Failed to export data:", e);
            }
        }

        static _importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const importString = event.target.result;
                    this._processImportedData(importString);
                };
                reader.onerror = () => {
                    console.error("Failed to read file:", reader.error);
                    alert(t('alertImportError'));
                };
                reader.readAsText(file);
            });
            input.click();
        }

        static _processImportedData(importString) {
            try {
                const importData = JSON.parse(importString);
                if (importData.__id !== 'FC2PPVDB_Turbo_Backup' || !importData.settings) {
                    throw new Error("Invalid data format.");
                }
                if (importData.settings) {
                    const mergedSettings = { ...SettingsManager.defaults, ...importData.settings };
                    SettingsManager.settings = mergedSettings;
                    StorageManager.set(Config.SETTINGS_KEY, mergedSettings, { immediate: true });
                }
                if (importData.history && Array.isArray(importData.history)) {
                    StorageManager.set(Config.HISTORY_KEY, JSON.stringify(importData.history), { immediate: true });
                    HistoryManager.history = importData.history;
                }
                if (importData.stats) {
                    StatsTracker.stats = importData.stats;
                    StatsTracker._dirty = false;
                    StatsTracker._pendingWrites = 0;
                    StorageManager.set(Config.STATS_KEY, importData.stats, { immediate: true });
                }
                if (importData.achievements && Array.isArray(importData.achievements)) {
                    AchievementManager.unlockedIds = new Set(importData.achievements);
                    StorageManager.set(Config.ACHIEVEMENTS_KEY, importData.achievements, { immediate: true });
                }

                // 视频来源列表
                if (importData.collection) {
                    if (importData.collection.tags && typeof importData.collection.tags === 'object') {
                        StorageManager.set(TagManager.TAGS_KEY, importData.collection.tags, { immediate: true });
                        TagManager.tags = importData.collection.tags; // 视频来源列表
                    }
                    if (importData.collection.masterTagList && Array.isArray(importData.collection.masterTagList)) {
                        StorageManager.set(TagManager.MASTER_TAG_LIST_KEY, importData.collection.masterTagList, { immediate: true });
                        TagManager.masterTagList = new Set(importData.collection.masterTagList); // 视频来源列表
                    }
                    TagManager._emitMasterTagsChanged();
                    Object.keys(TagManager.tags).forEach(id => TagManager._emitCollectionChanged(id));
                }

                this.statsRendered = false;
                alert(t('alertImportSuccess'));
                this.hide();
            } catch (e) {
                console.error("Failed to import data:", e);
                alert(t('alertImportError'));
            }
        }

        static _save() {
            const gridColumns = parseInt(this.panel.querySelector('#setting-gridColumns').value, 10);
            GM_setValue(GRID_COLUMNS_KEY, gridColumns);
            const getNumberValue = (selector, fallback, min, max) => {
                const raw = this.panel.querySelector(selector)?.value;
                const value = parseInt(raw, 10);
                if (!Number.isFinite(value)) return fallback;
                if (value < min) return min;
                if (value > max) return max;
                return value;
            };
            const imageLoadTimeout = getNumberValue('#setting-imageLoadTimeout', Config.IMAGE_LOAD_TIMEOUT, 0, 60000);
            const imageChainTimeout = getNumberValue('#setting-imageChainTimeout', Config.IMAGE_CHAIN_TIMEOUT, 0, 120000);
            const imageLoadConcurrency = getNumberValue('#setting-imageLoadConcurrency', Config.IMAGE_LOAD_CONCURRENCY, 1, 20);
            const newSettings = {
                previewMode: this.panel.querySelector('#setting-previewMode').value,
                hideNoMagnet: this.panel.querySelector('#setting-hideNoMagnet').checked,
                hideViewed: this.panel.querySelector('#setting-hideViewed').checked,
                cardLayoutMode: this.panel.querySelector('#setting-cardLayoutMode').value,
                // buttonStyle：已移除 - 强制仅图标样式
                loadExtraPreviews: this.panel.querySelector('#setting-loadExtraPreviews').checked,
                enableHistory: this.panel.querySelector('#setting-enableHistory').checked,
                enableCollection: this.panel.querySelector('#setting-enableCollection').checked,
                sourceFourhoi: this.panel.querySelector('#setting-sourceFourhoi').checked,
                sourceWumaobi: this.panel.querySelector('#setting-sourceWumaobi').checked,
                sourcePPVDataBank: this.panel.querySelector('#setting-sourcePPVDataBank').checked,
                sourceJavPop: this.panel.querySelector('#setting-sourceJavPop').checked,
                sourceFC2Direct: this.panel.querySelector('#setting-sourceFC2Direct').checked,
                sourceFC2PPVMe: this.panel.querySelector('#setting-sourceFC2PPVMe').checked,
                // 视频来源列表
                sourceDetailWumaobi: this.panel.querySelector('#setting-sourceDetailWumaobi').checked,
                sourceDetailPPVDataBank: this.panel.querySelector('#setting-sourceDetailPPVDataBank').checked,
                sourceDetailJavPop: this.panel.querySelector('#setting-sourceDetailJavPop').checked,
                sourceDetailFC2Direct: this.panel.querySelector('#setting-sourceDetailFC2Direct').checked,
                // 视频来源列表
                sourceVideoMissAV: this.panel.querySelector('#setting-sourceVideoMissAV').checked,
                sourceVideoSupjav: this.panel.querySelector('#setting-sourceVideoSupjav').checked,
                sourceVideoSukebei: this.panel.querySelector('#setting-sourceVideoSukebei').checked,
                sourceMagnet: this.panel.querySelector('#setting-sourceMagnet').checked,
                forceRefreshOnBack: this.panel.querySelector('#setting-forceRefreshOnBack').checked,
                openDetailsInNewTab: this.panel.querySelector('#setting-openDetailsInNewTab').checked,
                glowColor: this.panel.querySelector('#setting-glowColor').value,
                viewedColor: this.panel.querySelector('#setting-viewedColor').value,
                theme: this.panel.querySelector('#setting-theme').value,
                imageLoadTimeout,
                imageChainTimeout,
                imageLoadConcurrency,
            };
            if (location.hostname === 'fd2ppv.cc') newSettings.hideCensored = this.panel.querySelector('#setting-hideCensored').checked;
            if (location.hostname === 'fd2ppv.cc') {
                newSettings.preferFd2SiteImage = this.panel.querySelector('#setting-preferFd2SiteImage').checked;
            }
            Object.entries(newSettings).forEach(([key, value]) => SettingsManager.set(key, value));
            flushAllData();
            location.reload();
        }

        static _addEventListeners() {
            this.panel.querySelector('.close-btn').addEventListener('click', () => this.hide());
            this.backdrop.addEventListener('click', () => this.hide());
            this.panel.querySelector('#fc2-turbo-save-btn').addEventListener('click', () => this._save());
            this.panel.querySelector('#tab-content-settings').addEventListener('click', e => {
                if (e.target.id === 'fc2-turbo-export-btn') { this._exportData(); }
                if (e.target.id === 'fc2-turbo-import-btn') { this._importData(); }
            });
            // 页面行为设置互斥（使用事件委托）
            this.panel.querySelector('#tab-content-settings').addEventListener('change', e => {
                if (e.target.id === 'setting-forceRefreshOnBack' && e.target.checked) {
                    const newTabCb = this.panel.querySelector('#setting-openDetailsInNewTab');
                    if (newTabCb) newTabCb.checked = false;
                } else if (e.target.id === 'setting-openDetailsInNewTab' && e.target.checked) {
                    const forceRefreshCb = this.panel.querySelector('#setting-forceRefreshOnBack');
                    if (forceRefreshCb) forceRefreshCb.checked = false;
                }
            });
            this.panel.querySelectorAll('.fc2-turbo-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    this.panel.querySelectorAll('.fc2-turbo-tab-btn, .fc2-turbo-tab-content').forEach(el => el.classList.remove('active'));
                    e.target.classList.add('active');
                    this.panel.querySelector(`#tab-content-${tabName}`).classList.add('active');
                    this.panel.querySelector('#settings-footer').style.display = (tabName === 'settings') ? 'flex' : 'none';
                    if (tabName === 'statistics') this._renderStatistics();
                    if (tabName === 'history') this._renderHistory();
                    if (tabName === 'cache') this._renderCache();
                    if (tabName === 'collection' && SettingsManager.get('enableCollection')) {
                        this._renderCollection();
                    }
                });
            });
            this.panel.querySelector('#tab-content-settings').addEventListener('change', e => {
                if (e.target.id === 'setting-gridColumns') {
                    const newColumnCount = parseInt(e.target.value, 10);
                    applyCustomGridColumns(newColumnCount);
                }
            });
        }
    }

    function syncCardCollectionState(id, tags = []) {
        const isTagged = Array.isArray(tags) && tags.length > 0;
        const tooltipText = isTagged ? `${t('tooltipEditCollection')} (${t('hintRightClickEdit')})` : t('tooltipAddToCollection');
        document.querySelectorAll(`.${Config.CLASSES.processedCard}[data-fc2id="${id}"] .btn-toggle-tag`).forEach(btn => {
            btn.classList.toggle('is-tagged', isTagged);
            btn.title = tooltipText;
            btn.innerHTML = `${isTagged ? Icons.star : Icons.starOutline}<span class="${Config.CLASSES.buttonText}">${tooltipText}</span><span class="${Config.CLASSES.tooltip}">${tooltipText}</span>`;
        });
    }

    function setupCollectionSyncListeners() {
        AppEvents.on('collectionChanged', ({ id, tags = [] } = {}) => {
            if (!id) return;
            syncCardCollectionState(id, tags);
            SettingsPanel.updateCollectionStat(Object.keys(TagManager.tags).length);
            SettingsPanel._scheduleCollectionRerender();
        });
        AppEvents.on('collectionTagsChanged', () => {
            SettingsPanel._scheduleCollectionRerender();
        });
    }

    class FloatingButton {
        static init() {
            // 按钮容器——样式见下方 CSS
            const container = document.createElement('div');
            container.id = 'fc2-turbo-floating-container';
            const swallowClick = event => {
                event.preventDefault();
                event.stopPropagation();
            };

            // 视频来源列表
            if (SettingsManager.get('enableCollection')) {
                const collectionBtn = document.createElement('button');
                collectionBtn.id = 'fc2-turbo-collection-btn';
                collectionBtn.innerHTML = Icons.folder;
                collectionBtn.title = t('tabCollection');
                collectionBtn.className = 'fc2-turbo-fab';
                collectionBtn.addEventListener('click', event => {
                    swallowClick(event);
                    SettingsPanel.show();
                    // 切换到收藏标签页
                    const tabBtn = document.querySelector('.fc2-turbo-tab-btn[data-tab="collection"]');
                    if (tabBtn) tabBtn.click();
                });
                container.appendChild(collectionBtn);
            }

            // 视频来源
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'fc2-turbo-floating-btn';
            settingsBtn.innerHTML = Icons.settings;
            settingsBtn.title = t('menuOpenSettings');
            settingsBtn.className = 'fc2-turbo-fab';
            settingsBtn.addEventListener('click', event => {
                swallowClick(event);
                SettingsPanel.show();
            });
            container.appendChild(settingsBtn);

            // 为悬浮按钮添加样式——现在放在页头区域
            const style = document.createElement('style');
            style.textContent = `
                #fc2-turbo-floating-container {
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin-left: 16px !important;
                    flex-shrink: 0 !important;
                }
                #fc2-turbo-floating-container.fc2-turbo-floating-fixed {
                    position: fixed !important;
                    top: 12px !important;
                    left: 0 !important;
                    z-index: 10000 !important;
                    margin-left: 0 !important;
                }
                .fc2-turbo-fab {
                    width: 36px !important;
                    height: 36px !important;
                    border-radius: 8px !important;
                    background: var(--fc2-turbo-bg-info, #374151) !important;
                    color: var(--fc2-turbo-text, #9ca3af) !important;
                    border: 1px solid var(--fc2-turbo-border, rgba(255,255,255,0.1)) !important;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 18px !important;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .fc2-turbo-fab:hover {
                    transform: scale(1.05) !important;
                    background: var(--fc2-turbo-primary, #89b4fa) !important;
                    color: #fff !important;
                    box-shadow: 0 4px 12px rgba(137, 180, 250, 0.4) !important;
                }
                #fc2-turbo-floating-btn:hover { transform: scale(1.05) rotate(90deg) !important; }
                /* 可读性背景 */
                @media (max-width: 768px) {
                    #fc2-turbo-floating-container {
                        margin-left: 8px !important;
                    }
                    .fc2-turbo-fab {
                        width: 32px !important;
                        height: 32px !important;
                        font-size: 16px !important;
                    }
                }
            `;
            document.head.appendChild(style);

            // 优先挂在页头内容区；回退时按内容宽度对齐而不是视口。
            const getHeaderAnchor = () => {
                const header = document.querySelector('header');
                if (!header) return null;
                const logoLink = header.querySelector('a[href="/"]') ||
                    header.querySelector('.flex.items-center a') ||
                    header.querySelector('a.flex');
                const logoContainer = logoLink?.closest('.flex.items-center') || logoLink?.parentElement;
                const headerFlex = header.querySelector('.flex') || header;
                const candidate = logoContainer ||
                    headerFlex.querySelector('.flex.items-center') ||
                    headerFlex.firstElementChild ||
                    headerFlex;
                if (!candidate) return null;
                const linkAncestor = candidate.closest('a');
                if (linkAncestor && linkAncestor.parentElement) return linkAncestor.parentElement;
                if (linkAncestor) return header;
                return candidate;
            };

            const getContentAnchor = () => {
                return document.querySelector('main .container') ||
                    document.querySelector('main [class*="container"]') ||
                    document.querySelector('.container') ||
                    document.querySelector('main [class*="max-w"]') ||
                    document.querySelector('[class*="max-w"]') ||
                    document.querySelector('main') ||
                    document.body;
            };

            let resizeHandler = null;
            const updateFixedPosition = () => {
                const anchor = getContentAnchor();
                if (!anchor) return;
                const rect = anchor.getBoundingClientRect();
                const left = Math.max(8, Math.round(rect.left));
                container.style.left = `${left}px`;
            };

            const enableFixedMode = () => {
                container.classList.add('fc2-turbo-floating-fixed');
                updateFixedPosition();
                if (!resizeHandler) {
                    resizeHandler = () => updateFixedPosition();
                    window.addEventListener('resize', resizeHandler);
                }
                if (!container.isConnected) {
                    document.body.appendChild(container);
                }
            };

            const disableFixedMode = () => {
                container.classList.remove('fc2-turbo-floating-fixed');
                container.style.left = '';
                if (resizeHandler) {
                    window.removeEventListener('resize', resizeHandler);
                    resizeHandler = null;
                }
            };

            const attachToHeader = () => {
                const anchor = getHeaderAnchor();
                if (!anchor || anchor === container) return false;
                anchor.appendChild(container);
                return true;
            };

            const ensurePlacement = () => {
                if (attachToHeader()) {
                    disableFixedMode();
                    return true;
                }
                enableFixedMode();
                return false;
            };

            const startObserver = () => {
                const observer = new MutationObserver(() => {
                    if (ensurePlacement()) observer.disconnect();
                });
                observer.observe(document.body, { childList: true, subtree: true });
            };

            // 等待 DOM 就绪
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!ensurePlacement()) startObserver();
                });
            } else {
                if (!ensurePlacement()) startObserver();
            }
        }
    }

    class MenuManager {
        static menuIds = [];
        static register() {
            this.menuIds.forEach(GM_unregisterMenuCommand); this.menuIds = [];
            this.menuIds.push(GM_registerMenuCommand(t('menuOpenSettings'), () => SettingsPanel.show()));
        }
    }

    class ProcessorFactory {
        static create(name) {
            const P = { FD2PPV_ListPageProcessor, FD2PPV_ActressPageProcessor, FD2PPV_DetailPageProcessor, FC2PPVDB_ListPageProcessor, FC2PPVDB_DetailPageProcessor };
            if (P[name]) return new P[name]();
            throw new Error(`Processor ${name} not found.`);
        }
    }

    const showDisclaimerTipOnce = () => {
        const status = GM_getValue(DISCLAIMER_STATUS_KEY, 'pending');
        if (status === 'accepted') return;
        const browserLang = getPreferredLanguage();
        const isChineseUser = browserLang.startsWith('zh');
        const tip_ZH = '本脚本聚合第三方数据用以增强FC2PPVDB.com、FD2PPV.cc网站浏览体验，脚本本身不提供、上传任何资源，收藏夹、缓存等数据仅在本地存储及管理。';
        const tip_EN = 'This script aggregates third-party data to enhance the browsing experience on FC2PPVDB.com and FD2PPV.cc. The script itself does not provide or upload any resources. Favorites, cache, and other data are stored and managed locally only.';
        const showTip = () => {
            Toast.show(isChineseUser ? tip_ZH : tip_EN, 'info', 10000);
            GM_setValue(DISCLAIMER_STATUS_KEY, 'accepted');
        };
        if (document.body) showTip();
        else document.addEventListener('DOMContentLoaded', showTip, { once: true });
    };

    const showAutopagerTipOnce = () => {
        if (GM_getValue(AUTOPAGER_TIP_KEY, false)) return;
        const browserLang = getPreferredLanguage();
        const isChineseUser = browserLang.startsWith('zh');
        const tip_ZH = '使用自动翻页插件(东方永页机)的用户，请在对应脚本中配置此站设置为自动拼接\n并且在本脚本中勾选设置：在新建标签页中打开详情页，避免图片加载异常！';
        const tip_EN = 'If you use the auto-paging plugin (Pagetual), please set this site to auto splice in that script.\nAlso enable "Open details in a new tab" in this script to avoid image loading issues.';
        const showTip = () => {
            Toast.show(isChineseUser ? tip_ZH : tip_EN, 'info', 15000);
            GM_setValue(AUTOPAGER_TIP_KEY, true);
        };
        if (document.body) showTip();
        else document.addEventListener('DOMContentLoaded', showTip, { once: true });
    };

    const flushAllData = () => {
        TagManager.flush?.();
        ItemDetailsManager.flush?.();
        HistoryManager.flush?.();
        CollectionMagnetManager.flush?.();
        CollectionImageManager.flush?.();
        GlobalImageCache?.flush?.();
        StatsTracker.flush();
        StorageManager.flush();
    };

    function main() {
        Localization.init();
        StatsTracker.load();
        // 页面卸载前刷新节流统计，避免丢失计数
        window.addEventListener('beforeunload', () => flushAllData(), { once: true });
        window.addEventListener('pagehide', () => flushAllData(), { once: true });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flushAllData();
        });
        SettingsManager.load();
        HistoryManager.load();
        AchievementManager.load();
        if (location.hostname === 'fd2ppv.cc') {
            document.body.classList.add('fc2-turbo-site-fd2ppv');
        }
        if (SettingsManager.get('enableCollection')) {
            TagManager.load();
            ItemDetailsManager.load();
        }
        StyleManager.inject();
        const savedColumns = GM_getValue(GRID_COLUMNS_KEY, 0);
        applyCustomGridColumns(savedColumns);
        MenuManager.register();
        FloatingButton.init();
        DynamicStyleApplier.init();
        setupCollectionSyncListeners();
        document.body.classList.add(`layout-${SettingsManager.get('cardLayoutMode')}`);

        // 视频来源
        const savedTheme = SettingsManager.get('theme');
        if (savedTheme === 'light') document.body.setAttribute('data-fc2-turbo-theme', 'light');
        else if (savedTheme === 'dark') document.body.setAttribute('data-fc2-turbo-theme', 'dark');
        else if (savedTheme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.setAttribute('data-fc2-turbo-theme', 'light');
        }

        showDisclaimerTipOnce();
        showAutopagerTipOnce();

        // 视频来源列表
        document.body.classList.add(`buttons-icon`);
        const siteConfig = Config.SITES[location.hostname]; if (!siteConfig) return;
        const route = siteConfig.routes.find(r => r.path.test(location.pathname));
        if (route) {
            // 重构：根据收藏状态选择缓存
            if (route.processor.includes('DetailPage')) {
                document.body.classList.add('fc2-turbo-detail-page');
            }
            try { ProcessorFactory.create(route.processor).init(); }
            catch (error) { console.error('Script execution error:', error); }
        }
    }

    // --- 导航设置运行时逻辑 ---
    function setupNavigationFeatures() {
        // 1. 浏览器返回时强制刷新
        if (SettingsManager.get('forceRefreshOnBack')) {
            // 方案 1：检查是否通过前进/后退导航加载（Chrome/桌面）
            // 处理 Chrome 恢复页面但脚本状态损坏的情况
            try {
                const navEntries = performance.getEntriesByType('navigation');
                if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
                    // 等待页面加载完成并延迟一小段时间，以确保可靠刷新
                    // 仅用 'load' 事件判断对返回导航不可靠
                    const performReload = () => setTimeout(() => location.reload(), 300);

                    if (document.readyState === 'complete') {
                        performReload();
                    } else {
                        window.addEventListener('load', performReload);
                    }
                }
            } catch (e) { console.error('FC2 Turbo: Navigation API error', e); }

            // 方案 2：bfcache 支持（Safari/Firefox/移动端）
            window.addEventListener('pageshow', (event) => {
                if (event.persisted) {
                    location.reload();
                }
            });
        }

        // 2. 在新标签页打开详情页
        if (SettingsManager.get('openDetailsInNewTab')) {
            document.addEventListener('click', (e) => {
                if (e.defaultPrevented || e.button !== 0) return;
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                const clickedLink = e.target.closest('a[href]');
                const articleLink = e.target.closest('a[href*="/articles/"]');
                if (!articleLink || articleLink.target) return;
                if (clickedLink && clickedLink !== articleLink) return;
                if (e.target.closest(`.${Config.CLASSES.resourceBtn}, .btn-toggle-view, .btn-toggle-tag, .${Config.CLASSES.fc2IdBadge}`)) return;
                if (e.target.closest('button, input, select, textarea, label')) return;
                e.preventDefault();
                window.open(articleLink.href, '_blank', 'noopener,noreferrer');
            }, true);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { main(); setupNavigationFeatures(); });
    } else {
        main();
        setupNavigationFeatures();
    }

})();
