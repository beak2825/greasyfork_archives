// ==UserScript==
// @name         Plex Swiper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description 一个为 Plex Web 客户端定制的 UI 美化脚本，为首页和媒体库推荐页添加轮播图。
// @description:zh-CN 一个为 Plex Web 客户端定制的 UI 美化脚本，为首页和媒体库推荐页添加轮播图。
// @description:en  A polished, auto-discovering, mixed-library sorting swiper for Plex Home & Libraries
// @author       onelxzy
// @match        https://app.plex.tv/*
// @match        http://*:32400/*
// @icon         https://app.plex.tv/desktop/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/560306/Plex%20Swiper.user.js
// @updateURL https://update.greasyfork.org/scripts/560306/Plex%20Swiper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. Bootstrapper: Environment & Dependencies
    // ==========================================

    const safeAddStyle = (css) => {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    const loadDependencies = (callback) => {
        const swiperCssUrl = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        if (!document.querySelector(`link[href="${swiperCssUrl}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = swiperCssUrl;
            document.head.appendChild(link);
        }

        if (typeof Swiper !== 'undefined') {
            callback();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
            script.onload = () => callback();
            script.onerror = () => console.error("Plex Swiper: Failed to load Swiper.js");
            document.head.appendChild(script);
        }
    };

    // ==========================================
    // 2. Core Application Logic
    // ==========================================

    const initPlexSwiper = () => {
        const CONFIG = {
            serverUrl: null,
            token: null,
            machineIdentifier: null
        };

        const DataCache = new Map();
        const CACHE_TTL = 10 * 60 * 1000;

        const State = {
            isConfigReady: false,
            sections: null,
            activeObserver: null,
            currentContainer: null
        };

        // --- Styles Injection ---
        safeAddStyle(`
            .plex-home-swiper-wrapper {
                width: calc(100% - 48px);
                max-width: 1600px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 32px;
                padding-bottom: 46%;
                height: 0;
                max-height: 75vh;
                border-radius: 8px;
                position: relative;
                z-index: 1;
                background: #0d0d0d;
                display: block !important;
                overflow: hidden;
                box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                transform: translateZ(0); will-change: transform;
            }

            .plex-home-swiper-wrapper.is-home {
                margin-top: 2px;
            }

            .plex-home-swiper-wrapper.is-library {
                margin-top: -15px;
            }

            @media (min-width: 1921px) {
                .plex-home-swiper-wrapper {
                     width: calc(100% - 80px);
                     padding-bottom: 38%;
                }
            }

            @media (max-width: 1000px) {
                .plex-home-swiper-wrapper {
                    width: calc(100% - 24px);
                    margin-top: 10px !important;
                    margin-bottom: 16px;
                }
            }

            .swiper { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
            .swiper-slide { background-position: center top; background-size: cover; position: relative; }

            .main-swiper .swiper-slide:not(.swiper-slide-active) { pointer-events: none !important; z-index: 0; }
            .main-swiper .swiper-slide-active { pointer-events: auto !important; z-index: 10; }
            .main-swiper .swiper-slide:not(.swiper-slide-active) .info-layer a { pointer-events: none !important; }

            .banner-mask {
                position: absolute; inset: 0;
                background: linear-gradient(to right, #000 0%, rgba(0,0,0,0.5) 40%, transparent 100%),
                            linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 40%, transparent 100%);
                z-index: 1;
                pointer-events: none;
            }
            .info-layer {
                position: absolute; bottom: 10%; left: 4%; width: 45%; z-index: 20;
                color: #eeeff0; text-shadow: 0 2px 4px rgba(0,0,0,0.9); pointer-events: none;
            }
            .info-layer a { pointer-events: auto; }
            .title-link { text-decoration: none; color: inherit; display: inline-block; transition: transform 0.2s ease; cursor: pointer; }
            .title-link:hover { transform: scale(1.02); opacity: 0.9; }

            .info-logo { max-width: 280px; max-height: 110px; width: auto; height: auto; display: block; margin-bottom: 15px; object-fit: contain; object-position: left bottom; }
            .info-title-text { font-size: clamp(1.5rem, 2.5vw, 3rem); font-weight: 700; line-height: 1.1; margin-bottom: 8px; font-family: "Open Sans", sans-serif; display: none; }
            .info-meta { font-size: 1rem; color: #e5a00d; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
            .info-desc { font-size: 0.95rem; line-height: 1.6; opacity: 0.85; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; max-width: 600px; }

            .thumb-layer {
                position: absolute; bottom: 20px;
                right: 20px; left: auto; transform: none;
                width: auto; z-index: 20; padding: 5px; background: transparent;
            }
            .thumb-layer .swiper-wrapper { justify-content: flex-end !important; width: auto !important; }

            .thumb-layer .swiper-slide {
                width: 40px !important; height: 60px !important; border-radius: 4px; overflow: hidden;
                opacity: 0.5; border: 2px solid transparent; background: #1a1a1a;
                cursor: pointer; transition: all 0.2s ease; margin: 0 4px !important; flex-shrink: 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.8); pointer-events: auto !important;
            }
            .thumb-layer .swiper-slide:hover { opacity: 0.9; transform: translateY(-2px); }
            .thumb-layer .swiper-slide-thumb-active { opacity: 1; border-color: #e5a00d; transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.9); z-index: 2; }
            .thumb-layer img { width: 100%; height: 100%; object-fit: cover; }
        `);

        // --- Config Recovery (Direct Injection Support) ---
        function tryRecoverConfig() {
            if (State.isConfigReady) return;

            const localToken = localStorage.getItem('myPlexAccessToken');
            if (localToken) CONFIG.token = localToken;

            if (!CONFIG.serverUrl && window.location.hostname !== 'app.plex.tv') {
                CONFIG.serverUrl = window.location.origin;
            }

            if (CONFIG.token && CONFIG.serverUrl) {
                State.isConfigReady = true;
                initMachineId();
                fetchSections();
            }
        }

        // --- Hooks & Networking ---

        function hookHistory() {
            const wrap = function(type) {
                const orig = history[type];
                return function() {
                    const rv = orig.apply(this, arguments);
                    const e = new Event(type);
                    e.arguments = arguments;
                    window.dispatchEvent(e);
                    return rv;
                };
            };
            history.pushState = wrap('pushState');
            history.replaceState = wrap('replaceState');
        }

        function hookNetwork() {
            const checkUrl = (url) => {
                if (State.isConfigReady) return;
                if (!url) return;
                if (url.includes('/hubs') || url.includes('/library') || url.includes('/sections')) {
                    try {
                        const urlObj = new URL(url);
                        const params = new URLSearchParams(urlObj.search);
                        const token = params.get('X-Plex-Token');
                        const serverUrl = urlObj.origin;
                        if (token && serverUrl && serverUrl.startsWith('http')) {
                            CONFIG.serverUrl = serverUrl;
                            CONFIG.token = token;
                            State.isConfigReady = true;
                            initMachineId();
                            fetchSections();
                        }
                    } catch (e) {}
                }
            };
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const [resource] = args;
                if (typeof resource === 'string') checkUrl(resource);
                else if (resource instanceof Request) checkUrl(resource.url);
                return originalFetch.apply(this, args);
            };
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                checkUrl(url);
                return originalOpen.apply(this, arguments);
            };
        }

        // --- API Helpers ---

        function getScreenQuality() {
            const width = window.innerWidth * (window.devicePixelRatio || 1);
            if (width > 2560) return { w: 3840, h: 2160 };
            if (width > 1920) return { w: 2560, h: 1440 };
            return { w: 1920, h: 1080 };
        }

        function getTranscodeUrl(path, targetType) {
            if (!path || !CONFIG.serverUrl) return '';
            let width, height;
            if (targetType === 'art') {
                const quality = getScreenQuality();
                width = quality.w; height = quality.h;
            } else {
                width = 300; height = 450;
            }
            const internalBase = 'http://127.0.0.1:32400';
            const assetUrl = `${internalBase}${path}?X-Plex-Token=${CONFIG.token}`;
            return `${CONFIG.serverUrl}/photo/:/transcode?url=${encodeURIComponent(assetUrl)}&width=${width}&height=${height}&minSize=1&X-Plex-Token=${CONFIG.token}`;
        }

        function getLogoUrl(item) {
            if (!CONFIG.serverUrl) return '';
            const id = item._targetId || item.ratingKey;
            const internalBase = 'http://127.0.0.1:32400';
            const assetUrl = `${internalBase}/library/metadata/${id}/clearLogo?X-Plex-Token=${CONFIG.token}`;
            return `${CONFIG.serverUrl}/photo/:/transcode?url=${encodeURIComponent(assetUrl)}&width=300&height=120&minSize=1&format=png&X-Plex-Token=${CONFIG.token}`;
        }

        async function initMachineId() {
            if (CONFIG.machineIdentifier) return;
            // Fallback: Try parsing from URL first
            const hashMatch = window.location.hash.match(/server\/([a-zA-Z0-9]+)\//);
            if (hashMatch && hashMatch[1]) {
                CONFIG.machineIdentifier = hashMatch[1];
            }
            // API call
            try {
                const res = await fetch(`${CONFIG.serverUrl}/?X-Plex-Token=${CONFIG.token}`, { headers: {'Accept': 'application/json'} });
                const data = await res.json();
                if (data.MediaContainer?.machineIdentifier) {
                    CONFIG.machineIdentifier = data.MediaContainer.machineIdentifier;
                }
            } catch(e) {}
        }

        async function fetchSections() {
            if (State.sections) return State.sections;
            try {
                const res = await fetch(`${CONFIG.serverUrl}/library/sections?X-Plex-Token=${CONFIG.token}`, { headers: {'Accept': 'application/json'} });
                const data = await res.json();
                State.sections = data.MediaContainer?.Directory || [];
                return State.sections;
            } catch { return []; }
        }

        async function hydrateItemDetails(item) {
            if (item.type === 'movie' || !item._isEpisodeAnchor) return item;
            const showId = item._targetId;
            const url = `${CONFIG.serverUrl}/library/metadata/${showId}?X-Plex-Token=${CONFIG.token}`;
            try {
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
                const showMetadata = data.MediaContainer?.Metadata?.[0];
                if (showMetadata) {
                    return { ...item, summary: showMetadata.summary || item.summary, year: showMetadata.year || item.year, rating: showMetadata.rating || item.rating, title: showMetadata.title || item.title };
                }
            } catch (e) {}
            return item;
        }

        // --- Data Fetching ---

        async function fetchSectionData(sec, limit = 15) {
            const typeStr = sec.type === 'show' ? '4' : '1';
            const url = `${CONFIG.serverUrl}/library/sections/${sec.key}/all?type=${typeStr}&sort=addedAt%3Adesc&limit=${limit}&X-Plex-Token=${CONFIG.token}`;
            return fetch(url, { headers: { 'Accept': 'application/json' } })
                .then(r => r.json())
                .then(d => d.MediaContainer?.Metadata || [])
                .then(items => items.map(i => ({
                    ...i,
                    title: i.grandparentTitle || i.title,
                    art: i.grandparentArt || i.art,
                    thumb: i.grandparentThumb || i.thumb,
                    _sortDate: parseInt(i.addedAt),
                    _targetId: i.grandparentRatingKey || i.ratingKey,
                    _isEpisodeAnchor: sec.type === 'show'
                })));
        }

        async function getDataForContext(contextType, sectionId = null, contextKey) {
            if (!State.isConfigReady) tryRecoverConfig();
            if (!State.isConfigReady) return [];

            if (!CONFIG.machineIdentifier) await initMachineId();

            const cached = DataCache.get(contextKey);
            if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) return cached.data;

            const sections = await fetchSections();
            let rawItems = [];

            if (contextType === 'home') {
                let promises = sections.map(sec => fetchSectionData(sec, 15));
                const results = await Promise.all(promises);
                rawItems = results.flat();
            } else if (contextType === 'library' && sectionId) {
                const targetSection = sections.find(s => s.key === sectionId);
                if (targetSection) rawItems = await fetchSectionData(targetSection, 15);
            }

            if (rawItems.length === 0) return [];
            rawItems.sort((a, b) => b._sortDate - a._sortDate);

            const uniqueMap = new Map();
            const candidateItems = [];
            for (const item of rawItems) {
                if (candidateItems.length >= 11) break;
                if (!item.art) continue;
                if (!uniqueMap.has(item._targetId)) {
                    uniqueMap.set(item._targetId, true);
                    candidateItems.push(item);
                }
            }

            const finalItems = await Promise.all(candidateItems.map(hydrateItemDetails));
            DataCache.set(contextKey, { data: finalItems, timestamp: Date.now() });
            return finalItems;
        }

        // --- Rendering ---

        function renderSwiper(container, items, contextKey) {
            if (container.dataset.swiperContext === contextKey && container.querySelector('.plex-home-swiper-wrapper')) return;
            const oldWrapper = container.querySelector('.plex-home-swiper-wrapper');
            if (oldWrapper) oldWrapper.remove();

            const serverId = CONFIG.machineIdentifier;

            const wrapper = document.createElement('div');
            wrapper.className = `plex-home-swiper-wrapper ${contextKey === 'home' ? 'is-home' : 'is-library'}`;
            wrapper.innerHTML = `
                <div class="swiper main-swiper"><div class="swiper-wrapper">
                ${items.map((item, index) => {
                    const logoUrl = getLogoUrl(item);
                    const slideId = `slide-${index}-${item.ratingKey}`;
                    const targetId = item._targetId;
                    const href = serverId ? `#!/server/${serverId}/details?key=${encodeURIComponent('/library/metadata/' + targetId)}` : '#';
                    const clickAction = serverId ? `window.location.hash='${href}'; return false;` : 'return false;';

                    return `<div class="swiper-slide" style="background-image: url('${getTranscodeUrl(item.art, 'art')}')">
                        <div class="banner-mask"></div>
                        <div class="info-layer">
                            <a href="${href}" class="title-link" onclick="${clickAction}">
                                <img src="${logoUrl}" class="info-logo" onload="this.style.display='block'" onerror="this.style.display='none'; document.getElementById('title-${slideId}').style.display='block';" />
                                <h1 id="title-${slideId}" class="info-title-text">${item.title}</h1>
                            </a>
                            <div class="info-meta">
                                <span>${item.year || ''}</span>
                                <span style="border:1px solid #e5a00d; padding:0 4px; border-radius:3px; font-size:0.8em;">${item.type === 'movie' ? '电影' : '剧集'}</span>
                                <span>${item.rating ? '★ ' + item.rating : ''}</span>
                            </div>
                            <div class="info-desc">${item.summary || ''}</div>
                        </div>
                    </div>`;
                }).join('')}
                </div></div>
                <div class="swiper thumb-layer"><div class="swiper-wrapper">
                ${items.map(item => `<div class="swiper-slide"><img src="${getTranscodeUrl(item.thumb, 'thumb')}" /></div>`).join('')}
                </div></div>`;

            if (container.firstChild) container.insertBefore(wrapper, container.firstChild);
            else container.appendChild(wrapper);
            container.dataset.swiperContext = contextKey;

            try {
                const thumbSwiper = new Swiper('.thumb-layer', { slidesPerView: 'auto', spaceBetween: 0, watchSlidesProgress: true, allowTouchMove: false, loop: false, centerInsufficientSlides: true });
                new Swiper('.main-swiper', { spaceBetween: 0, effect: 'fade', speed: 1000, loop: true, autoplay: { delay: 10000, disableOnInteraction: false }, thumbs: { swiper: thumbSwiper } });
            } catch (e) { console.error("Plex Swiper Error:", e); }
        }

        // --- Context Detection & Loop ---

        function isContextPage() {
            const hash = window.location.hash;
            const cleanBase = hash.split('?')[0].replace(/\/$/, '');
            if ((cleanBase === '#!' || cleanBase === '#!/desktop') && !hash.includes('tab=') && !hash.includes('/details')) return { type: 'home', key: 'home' };
            if (hash.includes('com.plexapp.plugins.library') && hash.includes('source=') && !hash.includes('pivot=library')) {
                const isRecommended = hash.includes('pivot=recommended') || document.querySelector('a[class*="TabButton-selected"]')?.innerText === '推荐' || document.querySelector('a[class*="TabButton-selected"]')?.innerText === 'Recommended';
                if (isRecommended || document.querySelector('[class*="Hub-hub-"]')) {
                    const sid = new URLSearchParams(hash.split('?')[1]).get('source');
                    if (sid) return { type: 'library', key: `lib_${sid}`, id: sid };
                }
            }
            return null;
        }

        function startObserver(container, context) {
            if (State.activeObserver && State.currentContainer === container && container.dataset.observerContext === context.key) return;
            if (State.activeObserver) { State.activeObserver.disconnect(); State.activeObserver = null; }

            State.currentContainer = container;
            container.dataset.observerContext = context.key;
            checkAndRender(container, context);

            const observer = new MutationObserver(() => checkAndRender(container, context));
            observer.observe(container, { childList: true });
            State.activeObserver = observer;
        }

        async function checkAndRender(container, context) {
            const currentCtx = isContextPage();
            if (!currentCtx || currentCtx.key !== context.key) return;
            if (!container.querySelector('.plex-home-swiper-wrapper')) {
                const items = await getDataForContext(context.type, context.id, context.key);
                if (items.length > 0) renderSwiper(container, items, context.key);
            }
        }

        const runLoop = () => {
            if (!State.isConfigReady) tryRecoverConfig();
            if (!State.isConfigReady) return;

            const context = isContextPage();
            const selectors = ['.PageContent-pageContentScroller-dvaH3C', '[class*="PageContent-pageContentScroller"]', '.DirectoryHubsPageContent-pageContentScroller-jceJrG', '[class*="DirectoryHubsPageContent-pageContentScroller"]', '[data-testid="home-page-content"]'];
            let container = null;
            for (let sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.offsetHeight > 0) { container = el; break; }
            }

            if (context && container) {
                startObserver(container, context);
            } else {
                if (State.activeObserver) { State.activeObserver.disconnect(); State.activeObserver = null; }
                if (container) {
                    const swiper = container.querySelector('.plex-home-swiper-wrapper');
                    if (swiper) swiper.remove();
                    container.removeAttribute('data-swiper-context');
                    container.removeAttribute('data-observer-context');
                }
            }
        };

        hookNetwork();
        hookHistory();
        setInterval(runLoop, 200);
        window.addEventListener('hashchange', runLoop);
        window.addEventListener('popstate', runLoop);
        document.addEventListener('click', () => setTimeout(runLoop, 50));
    };

    // ==========================================
    // 3. Execution
    // ==========================================
    loadDependencies(initPlexSwiper);

})();