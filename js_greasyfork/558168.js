// ==UserScript==
// @name         FC2PPVDB 統一增強版
// @namespace    http://tampermonkey.net/
// @version      7.1.0
// @description  FC2PPVDB 完整功能 - 圖片優化 + BT4G搜索 + 最近排名 + 月間排名 + FD2PPV跳轉
// @author       Duckee
// @match        *://fc2ppvdb.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      hdblog.me
// @connect      hd-auto.com
// @connect      pixhost.to
// @connect      bt4gprx.com
// @connect      paipancon.com
// @connect      fc2db.net
// @connect      adult.contents.fc2.com
// @connect      fd2ppv.cc
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558168/FC2PPVDB%20%E7%B5%B1%E4%B8%80%E5%A2%9E%E5%BC%B7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558168/FC2PPVDB%20%E7%B5%B1%E4%B8%80%E5%A2%9E%E5%BC%B7%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🚀 配置常量
    const CONFIG = {
        IMAGE_TIMEOUT: 3000,
        DEBUG: false,
        CACHE: {
            BT4G_EXPIRATION: 12 * 60 * 60 * 1000,           // 12小時
            RECENT_RANKING_EXPIRATION: 24 * 60 * 60 * 1000, // 24小時
            MONTHLY_RANKING_EXPIRATION: 24 * 60 * 60 * 1000, // 24小時
            MAX_LRU_SIZE: 50,
            MAX_SET_SIZE: 100
        }
    };

    function log(...args) {
        if (CONFIG.DEBUG) console.log(...args);
    }

    // ==================== 統一緩存管理器 ====================

    class UnifiedCacheManager {
        constructor() {
            this.caches = {
                localStorage: new LocalStorageCache(),
                lru: new LRUCache(CONFIG.CACHE.MAX_LRU_SIZE),
                set404: new LimitedSet(CONFIG.CACHE.MAX_SET_SIZE),
                setExists: new LimitedSet(CONFIG.CACHE.MAX_SET_SIZE),
                pending: new Map()
            };
        }

        // LocalStorage 緩存操作
        getLS(key) {
            return this.caches.localStorage.get(key);
        }

        setLS(key, value, expirationMs) {
            this.caches.localStorage.set(key, value, expirationMs);
        }

        // LRU 緩存操作
        getLRU(key) {
            return this.caches.lru.get(key);
        }

        setLRU(key, value) {
            this.caches.lru.set(key, value);
        }

        hasLRU(key) {
            return this.caches.lru.has(key);
        }

        // Set 緩存操作
        has404(url) {
            return this.caches.set404.has(url);
        }

        add404(url) {
            this.caches.set404.add(url);
        }

        hasExists(url) {
            return this.caches.setExists.has(url);
        }

        addExists(url) {
            this.caches.setExists.add(url);
        }

        // Pending 請求管理
        getPending(key) {
            return this.caches.pending.get(key);
        }

        setPending(key, callbacks) {
            this.caches.pending.set(key, callbacks);
        }

        hasPending(key) {
            return this.caches.pending.has(key);
        }

        deletePending(key) {
            this.caches.pending.delete(key);
        }
    }

    // LocalStorage 緩存類
    class LocalStorageCache {
        get(key) {
            try {
                const cached = localStorage.getItem(key);
                if (!cached) return null;

                const { timestamp, data, expiration } = JSON.parse(cached);
                const now = Date.now();

                if (expiration && now - timestamp > expiration) {
                    localStorage.removeItem(key);
                    return null;
                }

                return data;
            } catch (err) {
                console.error(`讀取緩存錯誤 [${key}]:`, err);
                return null;
            }
        }

        set(key, value, expirationMs = null) {
            try {
                const cacheData = {
                    timestamp: Date.now(),
                    data: value,
                    expiration: expirationMs
                };
                localStorage.setItem(key, JSON.stringify(cacheData));
            } catch (err) {
                console.error(`保存緩存錯誤 [${key}]:`, err);
                if (err.name === 'QuotaExceededError') {
                    console.warn('LocalStorage 已滿,清空舊緩存');
                    this.cleanup(key);
                }
            }
        }

        cleanup(keepKey) {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key !== keepKey && key.startsWith('fc2_')) {
                        const item = localStorage.getItem(key);
                        if (item) {
                            try {
                                const { timestamp, expiration } = JSON.parse(item);
                                if (expiration && Date.now() - timestamp > expiration) {
                                    localStorage.removeItem(key);
                                }
                            } catch (e) {
                                // 忽略解析錯誤
                            }
                        }
                    }
                });
            } catch (err) {
                console.error('清理緩存錯誤:', err);
            }
        }
    }

    // LRU 緩存類
    class LRUCache {
        constructor(maxSize = 50) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }

        get(key) {
            if (!this.cache.has(key)) return undefined;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(key, value);
        }

        has(key) {
            return this.cache.has(key);
        }
    }

    // 有限集合類
    class LimitedSet {
        constructor(maxSize = 100) {
            this.set = new Set();
            this.maxSize = maxSize;
        }

        add(item) {
            if (this.set.size >= this.maxSize) {
                const first = this.set.values().next().value;
                this.set.delete(first);
            }
            this.set.add(item);
        }

        has(item) {
            return this.set.has(item);
        }
    }

    // 請求隊列類
    class RequestQueue {
        constructor(maxConcurrent = 3) {
            this.queue = [];
            this.running = 0;
            this.maxConcurrent = maxConcurrent;
        }

        add(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this.process();
            });
        }

        process() {
            if (this.running >= this.maxConcurrent || this.queue.length === 0) return;

            const { fn, resolve, reject } = this.queue.shift();
            this.running++;

            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.process();
                });
        }
    }

    // ==================== 初始化 ====================

    console.log("=== FC2PPVDB 統一增強版啟動 ===");

    const cache = new UnifiedCacheManager();
    const imageRequestQueue = new RequestQueue(2);

    function GetFC2Num() {
        const result = window.location.href.match(/articles\/(\d+)/);
        return result ? result[1] : 0;
    }

    const FC2Num = GetFC2Num();
    const isDetailPage = /\/articles\/\d+/.test(window.location.pathname);
    const isBookmarkRankingPage = window.location.pathname === '/articles/bookmark-ranking';
    const isMonthlyRankingPage = window.location.pathname === '/articles/ranking';

    // ==================== 工具函數 ====================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function quickCheckImage(url, timeout = CONFIG.IMAGE_TIMEOUT) {
        return new Promise((resolve) => {
            const img = new Image();
            let settled = false;

            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    img.src = '';
                    log(`⏱️ 圖片檢測超時: ${url.substring(0, 50)}...`);
                    resolve(false);
                }
            }, timeout);

            img.onload = () => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(true);
                }
            };

            img.onerror = () => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(false);
                }
            };

            img.src = url;
        });
    }

    // ==================== BT4G 搜索功能 ====================

    function checkBT4GAvailability(fc2Id) {
        const cached = cache.getLS('fc2_bt4g_cache');
        if (cached && cached[fc2Id]) {
            log(`BT4G 緩存命中: ${fc2Id}`);
            return Promise.resolve({
                status: cached[fc2Id].result ? "SUCCESS" : "NOT_FOUND",
                magnetLink: cached[fc2Id].magnetLink || null,
            });
        }

        const searchUrl = `https://bt4gprx.com/search/${encodeURIComponent(fc2Id)}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET", url: searchUrl,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            if (doc.querySelector(".list-group")) {
                                fetchFirstMagnetLink(fc2Id).then(magnetLink => {
                                    resolve({ status: "SUCCESS", magnetLink: magnetLink });
                                });
                            } else {
                                resolve({ status: "NOT_FOUND", magnetLink: null });
                            }
                        } catch (e) {
                            console.error(`BT4G 響應解析錯誤: ${fc2Id}`, e);
                            resolve({ status: "FAILED", magnetLink: null });
                        }
                    } else {
                        resolve({ status: response.status === 404 ? "NOT_FOUND" : "FAILED", magnetLink: null });
                    }
                },
                onerror: () => resolve({ status: "FAILED", magnetLink: null })
            });
        });
    }

    function fetchFirstMagnetLink(fc2Id) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://bt4gprx.com/search?q=${encodeURIComponent(fc2Id)}&page=rss`,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/xml");
                            const linkElement = doc.querySelector('item link');
                            if (linkElement) {
                                const magnetLink = linkElement.textContent.trim();
                                console.log(`✅ 獲取到 magnet: ${magnetLink.substring(0, 50)}...`);
                                resolve(magnetLink);
                                return;
                            }
                        } catch (e) {
                            console.error(`RSS 解析錯誤:`, e);
                        }
                    }
                    resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function saveBT4GCache(fc2Id, result, magnetLink = null) {
        const cached = cache.getLS('fc2_bt4g_cache') || {};
        cached[fc2Id] = { result, magnetLink, timestamp: Date.now() };
        cache.setLS('fc2_bt4g_cache', cached, CONFIG.CACHE.BT4G_EXPIRATION);
    }

    // ==================== 圖片處理功能 ====================

    function fetchFallbackImage(fc2Number, callback) {
        const cacheKey = `cover_${fc2Number}`;

        if (cache.hasLRU(cacheKey)) {
            log(`📦 使用緩存的封面圖: ${fc2Number}`);
            callback(cache.getLRU(cacheKey));
            return;
        }

        if (cache.hasPending(cacheKey)) {
            log(`⏳ 等待現有請求: ${fc2Number}`);
            cache.getPending(cacheKey).push(callback);
            return;
        }

        cache.setPending(cacheKey, [callback]);
        imageRequestQueue.add(() => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://hdblog.me/?s=fc2+${fc2Number}`,
                    onload: function (response) {
                        const callbacks = cache.getPending(cacheKey) || [];
                        cache.deletePending(cacheKey);

                        if (response.status === 200) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const img = doc.querySelector('.entry-content img');
                            const src = img?.getAttribute('src');

                            if (src) {
                                log(`✅ 找到後備圖片: ${src}`);
                                cache.setLRU(cacheKey, src);
                                callbacks.forEach(cb => cb(src));
                            } else {
                                cache.setLRU(cacheKey, null);
                                callbacks.forEach(cb => cb(null));
                            }
                        } else {
                            callbacks.forEach(cb => cb(null));
                        }
                        resolve();
                    },
                    onerror: () => {
                        const callbacks = cache.getPending(cacheKey) || [];
                        cache.deletePending(cacheKey);
                        callbacks.forEach(cb => cb(null));
                        resolve();
                    }
                });
            });
        });
    }

    function fetchGridFallbackImage(fc2Number, callback) {
        const cacheKey = `grid_${fc2Number}`;

        if (cache.hasLRU(cacheKey)) {
            log(`📦 使用緩存的 grid 圖: ${fc2Number}`);
            callback(cache.getLRU(cacheKey));
            return;
        }

        if (cache.hasPending(cacheKey)) {
            cache.getPending(cacheKey).push(callback);
            return;
        }

        cache.setPending(cacheKey, [callback]);
        imageRequestQueue.add(() => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://hdblog.me/?s=fc2+${fc2Number}`,
                    onload: function (response) {
                        const callbacks = cache.getPending(cacheKey) || [];

                        if (response.status === 200) {
                            // 檢查是否有搜索結果
                            if (response.responseText.includes('no content matched your criteria')) {
                                log(`❌ FC2-${fc2Number}: hdblog.me 無搜索結果`);
                                cache.setLRU(cacheKey, null);
                                cache.deletePending(cacheKey);
                                callbacks.forEach(cb => cb(null));
                                resolve();
                                return;
                            }

                            const match = response.responseText.match(/<a href="(https:\/\/hdblog\.me\/\d+\/[^"]+)"/);
                            if (match?.[1]) {
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: match[1],
                                    onload: function (articleResponse) {
                                        if (articleResponse.status === 200) {
                                            const parser = new DOMParser();
                                            const doc = parser.parseFromString(articleResponse.responseText, 'text/html');
                                            const paragraphs = doc.querySelectorAll('p');

                                            for (let p of paragraphs) {
                                                if (p.textContent.includes('Preview:')) {
                                                    const img = p.querySelector('img');
                                                    let thumbUrl = img?.getAttribute('src') || img?.getAttribute('data-src');
                                                    if (thumbUrl) {
                                                        const imgUrl = thumbUrl.replace(/t(\d+)\.pixhost\.to\/thumbs\//, 'img$1.pixhost.to/images/');
                                                        cache.setLRU(cacheKey, imgUrl);
                                                        cache.deletePending(cacheKey);
                                                        callbacks.forEach(cb => cb(imgUrl));
                                                        resolve();
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                        cache.setLRU(cacheKey, null);
                                        cache.deletePending(cacheKey);
                                        callbacks.forEach(cb => cb(null));
                                        resolve();
                                    },
                                    onerror: () => {
                                        cache.deletePending(cacheKey);
                                        callbacks.forEach(cb => cb(null));
                                        resolve();
                                    }
                                });
                                return;
                            }
                        }
                        cache.deletePending(cacheKey);
                        callbacks.forEach(cb => cb(null));
                        resolve();
                    },
                    onerror: () => {
                        cache.deletePending(cacheKey);
                        cache.getPending(cacheKey)?.forEach(cb => cb(null));
                        resolve();
                    }
                });
            });
        });
    }

    // ==================== 詳情頁面 ====================

    if (isDetailPage && FC2Num != 0) {
        const articleInfo = document.querySelector('#article-info');
        if (articleInfo) {
            const observer = new MutationObserver(() => {
                const flexContainer = articleInfo.querySelector('.flex.flex-col');
                if (flexContainer && !document.querySelector('#custom-cover-container')) {
                    InsertCoverImage();
                    observer.disconnect();
                }
            });
            observer.observe(articleInfo, { childList: true, subtree: true });

            const flexContainer = articleInfo.querySelector('.flex.flex-col');
            if (flexContainer) {
                InsertCoverImage();
                observer.disconnect();
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDetailPage);
        } else {
            initDetailPage();
        }
    }

    // ==================== 列表頁面 ====================

    if (!isDetailPage && !isMonthlyRankingPage) {
        const processedImages = new Set();
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const fcNumSpan = card.querySelector('span.absolute.top-0.left-0');
                    if (fcNumSpan) {
                        const fc2Number = fcNumSpan.textContent.trim();
                        if (!processedImages.has(fc2Number)) {
                            processedImages.add(fc2Number);
                            processImage(card, fc2Number);
                        }
                    }
                    imageObserver.unobserve(card);
                }
            });
        }, { rootMargin: '500px', threshold: 0.01 });

        function applyImageToCard(img, url, card) {
            if (img.hasAttribute('data-src')) img.setAttribute('data-src', url);
            img.src = url;
            img.classList.remove('lazyload', 'hidden');
            card.querySelector('#NoImage')?.style.setProperty('display', 'none');
            card.querySelector('.brightness-50')?.classList.remove('brightness-50');
        }

        function processImage(card, fc2Number) {
            const img = card.querySelector('img');
            if (!img) return;

            const coverUrl = `https://paipancon.com/fc2daily/data/FC2-PPV-${fc2Number}/cover.jpg`;

            if (cache.has404(coverUrl)) {
                loadFallback();
                return;
            }

            if (cache.hasExists(coverUrl)) {
                applyImageToCard(img, coverUrl, card);
                return;
            }

            quickCheckImage(coverUrl).then(exists => {
                if (exists) {
                    cache.addExists(coverUrl);
                    applyImageToCard(img, coverUrl, card);
                } else {
                    cache.add404(coverUrl);
                    loadFallback();
                }
            });

            function loadFallback() {
                fetchFallbackImage(fc2Number, (fallbackUrl) => {
                    if (fallbackUrl) {
                        img.className = '';
                        img.style.cssText = 'width:100%;height:auto;display:block';
                        applyImageToCard(img, fallbackUrl, card);
                    }
                });
            }
        }

        function processListImages() {
            const cards = document.querySelectorAll('div.relative');
            cards.forEach((card) => {
                const fcNumSpan = card.querySelector('span.absolute.top-0.left-0');
                if (fcNumSpan) {
                    const fc2Number = fcNumSpan.textContent.trim();
                    if (!processedImages.has(fc2Number)) {
                        imageObserver.observe(card);
                    }
                }
            });
        }

        const throttledProcessListImages = throttle(processListImages, 500);
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                throttledProcessListImages();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processListImages);
        } else {
            setTimeout(processListImages, 500);
        }
    }

    // ==================== 詳情頁面功能 ====================

    function initDetailPage() {
        const container = document.querySelector('.container');
        const watchOnlineUrl = `https://missav.ai/cn/search/${FC2Num}`;
        const previewImageUrl = `https://paipancon.com/fc2daily/data/FC2-PPV-${FC2Num}/grid.jpg`;
        const isMobile = window.innerWidth < 768;

        AddQuickLink(container, watchOnlineUrl);
        AddPreviewImages(container, previewImageUrl, isMobile);
    }

    function AddQuickLink(container, watchOnlineUrl) {
        const QuickLinkContainer = document.createElement('div');
        QuickLinkContainer.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px;margin-top:10px;padding:10px 0;border-bottom:2px solid #1f2937;border-top:2px solid #1f2937;flex-wrap:wrap';

        const statusSpan = document.createElement('span');
        statusSpan.style.cssText = 'font-size:14px;padding:6px 12px;border-radius:6px;font-weight:500;color:#f59e0b;background:rgba(245,158,11,0.1)';
        statusSpan.textContent = '檢查中...';

        const createButton = (text, color, url) => {
            const btn = document.createElement('button');
            btn.innerHTML = text;
            btn.style.cssText = `padding:8px 20px;border:none;border-radius:6px;cursor:pointer;color:white;font-size:16px;font-weight:500;background:${color};transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.2)`;
            btn.onclick = (e) => { e.preventDefault(); GM_openInTab(url, { active: true }); };
            return btn;
        };

        const bt4gButton = createButton('BT4G 搜索', '#3b82f6', `https://bt4gprx.com/search/${FC2Num}`);
        const missavButton = createButton('MissAV 搜索', '#dc2626', watchOnlineUrl);
        const fd2ppvButton = createButton('FD2PPV 查看', '#8b5cf6', `https://fd2ppv.cc/articles/${FC2Num}`);

        const magnetButton = document.createElement('button');
        magnetButton.innerHTML = '📋 複製 Magnet';
        magnetButton.style.cssText = 'padding:8px 20px;border:none;border-radius:6px;cursor:pointer;color:white;font-size:16px;font-weight:500;background:#10b981;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:none';

        let currentMagnetLink = null;
        magnetButton.onclick = (e) => {
            e.preventDefault();
            if (currentMagnetLink && !magnetButton.dataset.copying) {
                magnetButton.dataset.copying = 'true';
                navigator.clipboard.writeText(currentMagnetLink).then(() => {
                    magnetButton.innerHTML = '✔ 已複製!';
                    magnetButton.style.background = '#22c55e';
                    setTimeout(() => {
                        magnetButton.innerHTML = '📋 複製 Magnet';
                        magnetButton.style.background = '#10b981';
                        delete magnetButton.dataset.copying;
                    }, 2000);
                });
            }
        };

        QuickLinkContainer.append(statusSpan, bt4gButton, missavButton, fd2ppvButton, magnetButton);
        container.appendChild(QuickLinkContainer);

        checkBT4GAvailability(FC2Num).then((result) => {
            if (result.status === "SUCCESS") {
                saveBT4GCache(FC2Num, true, result.magnetLink);
                statusSpan.style.cssText = 'font-size:14px;padding:6px 12px;border-radius:6px;font-weight:500;color:#10b981;background:rgba(16,185,129,0.1)';
                statusSpan.textContent = '✔ 有資源';
                if (result.magnetLink) {
                    currentMagnetLink = result.magnetLink;
                    magnetButton.style.display = 'block';
                }
            } else if (result.status === "NOT_FOUND") {
                saveBT4GCache(FC2Num, false);
                statusSpan.style.cssText = 'font-size:14px;padding:6px 12px;border-radius:6px;font-weight:500;color:#ef4444;background:rgba(239,68,68,0.1)';
                statusSpan.textContent = '✗ 無資源';
            } else {
                statusSpan.textContent = '檢查失敗';
            }
        });
    }

    function AddPreviewImages(container, previewImageUrl, isMobile) {
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `display:flex;flex-direction:${isMobile ? 'column' : 'row'};justify-content:center;margin-top:10px;gap:${isMobile ? '5px' : '0'}`;

        if (isMobile) {
            const createImg = (position) => {
                const img = document.createElement('img');
                img.src = previewImageUrl;
                img.loading = 'lazy';
                img.style.cssText = `width:100%;height:auto;display:block;object-fit:cover;object-position:${position} center;aspect-ratio:1/1`;
                return img;
            };

            const leftImg = createImg('left');
            const rightImg = createImg('right');

            quickCheckImage(previewImageUrl).then(exists => {
                if (!exists) {
                    fetchGridFallbackImage(FC2Num, (fallbackUrl) => {
                        if (fallbackUrl) {
                            rightImg.remove();
                            leftImg.style.cssText = 'width:100%;height:auto;display:block;object-fit:contain;object-position:center';
                            leftImg.src = fallbackUrl;
                        }
                    });
                }
            });

            imageContainer.append(leftImg, rightImg);
        } else {
            const img = document.createElement('img');
            img.src = previewImageUrl;
            img.loading = 'lazy';
            img.style.cssText = 'width:100%;max-width:1200px;height:auto';

            quickCheckImage(previewImageUrl).then(exists => {
                if (!exists) {
                    fetchGridFallbackImage(FC2Num, (fallbackUrl) => {
                        if (fallbackUrl) img.src = fallbackUrl;
                    });
                }
            });

            imageContainer.appendChild(img);
        }

        container.appendChild(imageContainer);
    }

    function InsertCoverImage() {
        const articleInfo = document.querySelector('#article-info');
        if (!articleInfo) return;

        const fc2Number = articleInfo.getAttribute('data-videoid');
        if (!fc2Number) return;

        const coverUrl = `https://paipancon.com/fc2daily/data/FC2-PPV-${fc2Number}/cover.jpg`;
        const coverContainer = document.createElement('div');
        coverContainer.id = 'custom-cover-container';
        coverContainer.className = 'lg:w-2/5 w-full mb-12 md:mb-0';
        coverContainer.style.cssText = 'display:flex;justify-content:center;align-items:center';

        const coverImg = document.createElement('img');
        coverImg.alt = fc2Number;
        coverImg.className = 'object-contain object-center w-full max-h-80 rounded-lg';
        coverImg.loading = 'lazy';

        quickCheckImage(coverUrl).then(exists => {
            if (exists) {
                coverImg.src = coverUrl;
                insertCover(false);
            } else {
                fetchFallbackImage(fc2Number, (fallbackUrl) => {
                    coverImg.src = fallbackUrl || coverUrl;
                    if (fallbackUrl) {
                        coverImg.className = '';
                        coverImg.style.cssText = 'max-width:100%;height:auto';
                    }
                    insertCover(!!fallbackUrl);
                });
            }
        });

        function insertCover(isFallback) {
            coverContainer.appendChild(coverImg);
            const flexContainer = articleInfo.querySelector('.flex.flex-col');
            if (flexContainer) {
                if (isFallback) {
                    coverContainer.className = '';
                    coverContainer.style.cssText = 'width:100%;margin-bottom:20px';
                }
                flexContainer.insertBefore(coverContainer, flexContainer.firstChild);
                document.querySelector('#NoImage')?.parentElement?.remove();
                document.querySelector('#ArticleImage')?.parentElement?.remove();
            }
        }
    }

    // ==================== 最近排名功能 ====================

    if (isBookmarkRankingPage) {
        console.log("=== 初始化最近排名功能 ===");

        async function initRecentRanking() {
            try {
                let cards = cache.getLS('fc2_recent_ranking');

                if (!cards) {
                    console.log('Fetching recent videos from fc2db.net...');
                    const html = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://fc2db.net/',
                            onload: (r) => r.status === 200 ? resolve(r.responseText) : reject(),
                            onerror: reject
                        });
                    });

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const gridContainer = doc.querySelector('.grid.gap-4.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5');

                    if (gridContainer) {
                        const cardElements = gridContainer.querySelectorAll('.rounded-2xl.shadow-sm.overflow-hidden.bg-card.border.border-border-color.transition-shadow.hover\\:shadow-lg');
                        cards = Array.from(cardElements).slice(0, 10).map(card => ({
                            href: card.querySelector('a')?.href || '#',
                            imgSrc: card.querySelector('img')?.src || '',
                            workId: card.querySelector('.text-xs.text-text-sub')?.textContent.trim() || '',
                            title: card.querySelector('.font-bold.font-serif.text-text-main')?.textContent.trim() || ''
                        }));

                        cache.setLS('fc2_recent_ranking', cards, CONFIG.CACHE.RECENT_RANKING_EXPIRATION);
                    }
                }

                if (cards?.length > 0) {
                    const section = document.createElement('section');
                    section.className = 'text-gray-400 bg-gray-900 body-font';
                    section.innerHTML = `
                        <div class="container lg:px-5 px-2 py-8 mx-auto">
                            <div class="text-white title-font text-lg font-medium py-4">最近ランキング</div>
                            <div class="flex flex-wrap -m-4 py-4">
                                ${cards.map(c => `
                                    <div class="2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/2 p-4">
                                        <div class="relative">
                                            <a class="block h-48 rounded overflow-hidden" href="/articles/${c.workId}">
                                                <img class="object-contain object-center w-full h-full block bg-gray-800 transition duration-300 ease-in-out hover:scale-110" src="${c.imgSrc}">
                                            </a>
                                            <span class="absolute top-0 left-0 text-white bg-gray-800 bg-opacity-90 px-1">${c.workId}</span>
                                        </div>
                                        <div class="mt-1">
                                            <a class="text-white title-font text-base font-medium line-clamp-2" href="/articles/${c.workId}">${c.title}</a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;

                    const bookmarkSection = document.querySelector('section.text-gray-400.bg-gray-900.body-font');
                    bookmarkSection?.parentNode?.insertBefore(section, bookmarkSection);
                    console.log('✅ Recent ranking section added');
                }
            } catch (error) {
                console.error('Error initializing recent ranking:', error);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRecentRanking);
        } else {
            initRecentRanking();
        }
    }

    // ==================== 月間排名功能 ====================

    // 添加側邊欄鏈接
    function addSidebarLink() {
        const dropdown = document.querySelector('#dropdown-ranking');
        if (!dropdown || dropdown.querySelector('a[href="/articles/ranking"]')) return;

        const newLi = document.createElement('li');
        const link = document.createElement('a');
        link.href = '/articles/ranking';
        link.className = 'flex items-center w-full text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700';
        link.textContent = '月間ランキング';
        newLi.appendChild(link);
        dropdown.appendChild(newLi);
    }

    function getCurrentYearMonth() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        if (month === 0) {
            year -= 1;
            month = 12;
        }
        return { year, month };
    }

    function generateMonthOptions() {
        const options = [];
        const current = getCurrentYearMonth();
        for (let year = 2022; year <= current.year; year++) {
            const endMonth = (year === current.year) ? current.month : 12;
            for (let month = 1; month <= endMonth; month++) {
                options.push({ year, month });
            }
        }
        return options.reverse();
    }

    function getCachedMonthlyRanking(year, month) {
        const cacheKey = `fc2_ranking_cache_${year}_${month}`;
        const cached = cache.getLS(cacheKey);
        return cached;
    }

    function setCachedMonthlyRanking(year, month, items) {
        const cacheKey = `fc2_ranking_cache_${year}_${month}`;
        cache.setLS(cacheKey, items, CONFIG.CACHE.MONTHLY_RANKING_EXPIRATION);
    }

    function fetchFC2Ranking(year, month) {
        const url = `https://adult.contents.fc2.com/ranking/article/monthly?year=${year}&month=${month}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3'
                },
                onload: (response) => {
                    if (response.status === 200 && !response.finalUrl?.includes('error.fc2.com')) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error('FC2にアクセスが拒否されました。'));
                    }
                },
                onerror: () => reject(new Error('ネットワークエラーが発生しました'))
            });
        });
    }

    function parseRankingData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = [];
        const rankingItems = doc.querySelectorAll('.c-ranklist-110');

        rankingItems.forEach((item, index) => {
            let title = item.querySelector('h3 a')?.textContent.trim() ||
                item.querySelector('h3')?.textContent.trim() || '';

            let link = '';
            if (item.tagName === 'A') {
                link = item.getAttribute('href') || '';
            } else {
                const linkElem = item.querySelector('a[href*="article"]') ||
                    item.querySelector('a[href*="id="]') ||
                    item.querySelector('h3 a');
                link = linkElem?.getAttribute('href') || '';
            }

            let fc2Number = '';
            const patterns = [
                /\/article_search\.php\?id=(\d+)/,
                /article_search\?id=(\d+)/,
                /id=(\d+)/,
                /article\/(\d+)/,
                /\/(\d{7,})/
            ];

            for (const pattern of patterns) {
                const match = link.match(pattern);
                if (match) {
                    fc2Number = match[1];
                    break;
                }
            }

            if (!fc2Number) {
                const imgSrc = item.querySelector('img')?.getAttribute('src') || '';
                const imgMatch = imgSrc.match(/\/file\/\d+\/(\d+)\//);
                if (imgMatch) fc2Number = imgMatch[1];
            }

            if (!fc2Number && title) {
                const titleMatch = title.match(/FC2-?PPV-?(\d+)/i) || title.match(/(\d{7,})/);
                if (titleMatch) fc2Number = titleMatch[1];
            }

            const imgElem = item.querySelector('.c-ranklist-110_tmb img') ||
                item.querySelector('.c-ranklist-110_tmbimg img') ||
                item.querySelector('img');
            const imageUrl = imgElem?.getAttribute('src') ||
                imgElem?.getAttribute('data-src') || '';

            if (fc2Number && title) {
                items.push({ fc2Number, title, link, imageUrl, rank: index + 1 });
            }
        });

        return items;
    }

    function createCardHTML(item) {
        const fc2ppvdbLink = `/articles/${item.fc2Number}`;
        const imageUrl = item.imageUrl || '/storage/images/article/no-image.jpg';

        return `<div class="2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/2 p-4">
            <div class="relative">
                <a class="block h-48 rounded overflow-hidden" href="${fc2ppvdbLink}">
                    <img title="Article Image" class="object-contain object-center w-full h-full block bg-gray-800 transition duration-300 ease-in-out hover:scale-110 lazyload" data-src="${imageUrl}" src="${imageUrl}">
                </a>
                <span class="absolute top-0 left-0 text-white bg-gray-800 bg-opacity-90 px-1">${item.fc2Number}</span>
                <span class="absolute top-0 right-0 text-white bg-blue-600 bg-opacity-90 px-2 py-1 text-sm font-bold">#${item.rank}</span>
            </div>
            <div class="mt-1">
                <a class="text-white title-font text-base font-medium line-clamp-2" href="${fc2ppvdbLink}" data-toggle="tooltip" data-placement="top" title="${item.title}">${item.title}</a>
            </div>
        </div>`;
    }

    function createMonthSelector(selectedYear, selectedMonth, options) {
        const optionsHTML = options.map(opt => {
            const selected = opt.year === selectedYear && opt.month === selectedMonth ? 'selected' : '';
            return `<option value="${opt.year}-${opt.month}" ${selected}>${opt.year}年${opt.month}月</option>`;
        }).join('');

        return `<div class="pb-4 flex flex-wrap items-center gap-2">
            <label class="text-gray-400 text-sm md:text-base">期間選択:</label>
            <select id="month-selector" class="bg-gray-800 text-white px-3 py-2 md:px-4 md:py-2 rounded border border-gray-700 text-sm md:text-base min-w-[140px] cursor-pointer">
                ${optionsHTML}
            </select>
        </div>`;
    }

    async function createRankingPage() {
        const main = document.querySelector('main');
        if (!main) return;

        const urlParams = new URLSearchParams(window.location.search);
        const defaultYM = getCurrentYearMonth();
        const selectedYear = parseInt(urlParams.get('year')) || defaultYM.year;
        const selectedMonth = parseInt(urlParams.get('month')) || defaultYM.month;
        const monthOptions = generateMonthOptions();

        main.innerHTML = `<div class="flex flex-col">
            <section class="text-gray-400 bg-gray-900 body-font">
                <div class="container lg:px-5 px-2 py-8 mx-auto">
                    <div class="text-white title-font text-lg font-medium py-4">月間ランキング</div>
                    ${createMonthSelector(selectedYear, selectedMonth, monthOptions)}
                    <div class="pb-4">
                        <span class="text-base font-medium text-gray-400">FC2公式の月間ランキングを読み込み中...</span>
                    </div>
                    <div class="flex justify-center items-center py-20">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                </div>
            </section>
        </div>`;

        try {
            let items = getCachedMonthlyRanking(selectedYear, selectedMonth);

            if (!items) {
                const html = await fetchFC2Ranking(selectedYear, selectedMonth);
                items = parseRankingData(html);
                if (items.length === 0) {
                    throw new Error('ランキングデータが見つかりませんでした。');
                }
                setCachedMonthlyRanking(selectedYear, selectedMonth, items);
            }

            const cardsHTML = items.map(createCardHTML).join('');
            const yearMonth = `${selectedYear}年${selectedMonth}月`;

            main.innerHTML = `<div class="flex flex-col">
                <section class="text-gray-400 bg-gray-900 body-font">
                    <div class="container lg:px-5 px-2 py-8 mx-auto">
                        <div class="text-white title-font text-lg font-medium py-4">月間ランキング (${yearMonth})</div>
                        ${createMonthSelector(selectedYear, selectedMonth, monthOptions)}
                        <div class="pb-4">
                            <span class="text-base font-medium text-gray-400">FC2公式の月間ランキングから取得 (${items.length}件)</span>
                        </div>
                        <div class="flex flex-wrap -m-4 py-4">${cardsHTML}</div>
                    </div>
                </section>
            </div>`;

            document.getElementById('month-selector')?.addEventListener('change', function () {
                const [year, month] = this.value.split('-');
                window.location.href = `/articles/ranking?year=${year}&month=${month}`;
            });

        } catch (error) {
            main.innerHTML = `<div class="flex flex-col">
                <section class="text-gray-400 bg-gray-900 body-font">
                    <div class="container lg:px-5 px-2 py-8 mx-auto">
                        <div class="text-white title-font text-lg font-medium py-4">月間ランキング</div>
                        ${createMonthSelector(selectedYear, selectedMonth, monthOptions)}
                        <div class="pb-4">
                            <span class="text-base font-medium text-red-400">エラー: ${error.message}</span>
                        </div>
                        <div class="py-4">
                            <p class="text-gray-400">ランキングデータの取得に失敗しました。</p>
                        </div>
                    </div>
                </section>
            </div>`;

            document.getElementById('month-selector')?.addEventListener('change', function () {
                const [year, month] = this.value.split('-');
                window.location.href = `/articles/ranking?year=${year}&month=${month}`;
            });
        }
    }

    // ==================== 初始化月間排名 ====================

    function initMonthlyRanking() {
        addSidebarLink();
        if (isMonthlyRankingPage) {
            createRankingPage();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMonthlyRanking);
    } else {
        initMonthlyRanking();
    }

})();
