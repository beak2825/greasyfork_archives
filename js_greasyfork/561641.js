// ==UserScript==
// @name                [YouTube] Channel Location [20260106] v1.0.0
// @name:zh-CN          [YouTube] 显示频道国家/地区 [20260106] v1.0.0
// @namespace           https://github.com/0-V-linuxdo/YouTube-Channel-Location
// @description         Show channel location/country on YouTube
// @description:zh-CN   在 YouTube 页面显示频道的国家/地区（Location/Country）
//
// @version             [20260106] v1.0.0
// @update-log          [20260106] v1.0.0 Add fork notice (upstream credits)
//
// @license             MIT
//
// @match               https://www.youtube.com/*
//
// @run-at              document-start
//
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
//
// @icon                https://github.com/0-V-linuxdo/YouTube-Channel-Location/raw/refs/heads/main/icon/icon.svg
// @downloadURL https://update.greasyfork.org/scripts/561641/%5BYouTube%5D%20Channel%20Location%20%5B20260106%5D%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/561641/%5BYouTube%5D%20Channel%20Location%20%5B20260106%5D%20v100.meta.js
// ==/UserScript==

// ================================================
// Fork Notice (Upstream Credits):
// Name:    YouTubeChannelLocation
// Author:  arsxrs
// Link:    https://github.com/arsxrs/YouTubeChannelLocation?tab=readme-ov-file
// Version: 1.3
// ================================================

(async () => {
    'use strict';

    const SCRIPT_ID = 'ytdc-channel-location';
    const STORAGE_CONFIG_KEY = `${SCRIPT_ID}:config:v1`;
    const STORAGE_CACHE_KEY = `${SCRIPT_ID}:country-cache:v1`;

    const PILL_CONTAINER_CLASS = 'ytdc-channel-country-name-container';
    const PILL_TEXT_CONTAINER_CLASS = 'ytdc-channel-country-name-text-container';
    const PILL_SELECTOR = `.${PILL_CONTAINER_CLASS}[data-ytdc-pill="1"]`;

    const SETTINGS_ROOT_ID = 'ytdc-settings-root';

    const CHANNEL_ANCHOR_SELECTOR = ['a[href^="/@"]', 'a[href^="/channel/"]', 'a[href^="/c/"]', 'a[href^="/user/"]'].join(
        ',',
    );

    const DEFAULT_CONFIG = {
        pages: {
            watch: true,
            home: true,
            channel: true,
            search: true,
            subscriptions: true,
            trending: true,
            shorts: true,
        },
        unknownCountryText: '❓',
        cache: {
            enabled: true,
        },
    };

    const STYLE = `
.${PILL_CONTAINER_CLASS}[data-ytdc-pill="1"] {
  background: var(--yt-spec-additive-background) !important;
  border-radius: 14px !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 6px !important;
  vertical-align: middle;
  flex: 0 0 auto !important;
  align-self: center !important;
  padding: 0 !important;
  border: 0 !important;
  box-sizing: border-box;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  min-width: 0 !important;
}

.${PILL_CONTAINER_CLASS}[data-ytdc-pill="1"] .${PILL_TEXT_CONTAINER_CLASS} {
  text-transform: uppercase;
  color: var(--yt-spec-text-primary);
  font-size: 13px !important;
  padding: 1px 7px !important;
  white-space: nowrap;
  line-height: 1.2 !important;
}

#${SETTINGS_ROOT_ID} {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2147483647;
}

#${SETTINGS_ROOT_ID}[data-open="1"] {
  display: flex;
}

#${SETTINGS_ROOT_ID} .ytdc-panel {
  width: min(347px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  background: var(--yt-spec-base-background);
  color: var(--yt-spec-text-primary);
  border: 1px solid var(--yt-spec-10-percent-layer);
  border-radius: 14px;
  padding: 18px 18px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  font-family: Roboto, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 400;
}

#${SETTINGS_ROOT_ID} button,
#${SETTINGS_ROOT_ID} input {
  font: inherit;
}

#${SETTINGS_ROOT_ID} .ytdc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

#${SETTINGS_ROOT_ID} .ytdc-title {
  font-size: 18px;
  font-weight: 700;
}

#${SETTINGS_ROOT_ID} .ytdc-close {
  border: 0;
  background: transparent;
  color: var(--yt-spec-text-primary);
  font-size: 20px;
  line-height: 20px;
  padding: 4px 8px;
  cursor: pointer;
}

#${SETTINGS_ROOT_ID} .ytdc-section {
  margin-top: 14px;
}

#${SETTINGS_ROOT_ID} .ytdc-section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

#${SETTINGS_ROOT_ID} .ytdc-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 2px;
  user-select: none;
  font-size: 14px;
}

#${SETTINGS_ROOT_ID} input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

#${SETTINGS_ROOT_ID} .ytdc-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 8px 0 10px;
}

#${SETTINGS_ROOT_ID} .ytdc-input {
  flex: 1 1 260px;
  min-width: 160px;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid var(--yt-spec-10-percent-layer);
  background: var(--yt-spec-base-background);
  color: var(--yt-spec-text-primary);
  font-size: 14px;
}

#${SETTINGS_ROOT_ID} .ytdc-setting-line {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  column-gap: 10px;
  row-gap: 8px;
  margin: 10px 0 12px;
}

#${SETTINGS_ROOT_ID} .ytdc-setting-label {
  min-width: 0;
  font-size: 14px;
  line-height: 1.35;
}

#${SETTINGS_ROOT_ID} .ytdc-setting-line .ytdc-input {
  flex: none;
  min-width: 0;
  width: 170px;
}

#${SETTINGS_ROOT_ID} .ytdc-icon-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

#${SETTINGS_ROOT_ID} .ytdc-cache-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 12px;
}

#${SETTINGS_ROOT_ID} .ytdc-cache-label {
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  font-size: 14px;
}

#${SETTINGS_ROOT_ID} .ytdc-cache-count {
  white-space: nowrap;
  font-size: 14px;
}

#${SETTINGS_ROOT_ID} .ytdc-btn {
  border: 1px solid var(--yt-spec-10-percent-layer);
  background: var(--yt-spec-additive-background);
  color: var(--yt-spec-text-primary);
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
  font-size: 14px;
}

#${SETTINGS_ROOT_ID} .ytdc-btn.ytdc-primary {
  background: #28a745;
  border-color: #28a745;
  color: #fff;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 120px;
}

#${SETTINGS_ROOT_ID} .ytdc-muted {
  color: var(--yt-spec-text-secondary);
  font-size: 12px;
  margin-top: 10px;
}

#${SETTINGS_ROOT_ID} .ytdc-link {
  color: var(--yt-spec-call-to-action);
  text-decoration: none;
}
`;

    let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    const memoryCacheByAboutPath = new Map(); // pathname -> string|null
    const persistentCacheByAboutPath = new Map(); // pathname -> string|null

    let cacheSaveTimer = null;

    let running = false;
    let updateRequested = false;
    let updateSeq = 0;

    let processedAnchors = new WeakSet();
    let observedAnchors = new WeakSet();

    let intersectionObserver = null;
    let mutationObserver = null;

    const inflightByCacheKey = new Map(); // pathname -> Promise<string|null>
    const fetchQueue = [];
    let activeFetches = 0;
    const MAX_CONCURRENT_FETCHES = 4;

    function addStyle(cssText) {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(cssText);
            return;
        }
        const style = document.createElement('style');
        style.textContent = cssText;
        (document.head || document.documentElement).appendChild(style);
    }

    function isPromiseLike(value) {
        return Boolean(value && typeof value === 'object' && typeof value.then === 'function');
    }

    async function getStoredString(key) {
        try {
            if (typeof GM_getValue === 'function') {
                const v = GM_getValue(key);
                const resolved = isPromiseLike(v) ? await v : v;
                return typeof resolved === 'string' ? resolved : null;
            }
            if (typeof GM === 'object' && typeof GM.getValue === 'function') {
                const resolved = await GM.getValue(key);
                return typeof resolved === 'string' ? resolved : null;
            }
        } catch {}

        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    async function setStoredString(key, value) {
        try {
            if (typeof GM_setValue === 'function') {
                const r = GM_setValue(key, value);
                if (isPromiseLike(r)) await r;
                return;
            }
            if (typeof GM === 'object' && typeof GM.setValue === 'function') {
                await GM.setValue(key, value);
                return;
            }
        } catch {}

        try {
            localStorage.setItem(key, value);
        } catch {}
    }

    async function deleteStoredKey(key) {
        try {
            if (typeof GM_deleteValue === 'function') {
                const r = GM_deleteValue(key);
                if (isPromiseLike(r)) await r;
                return;
            }
            if (typeof GM === 'object' && typeof GM.deleteValue === 'function') {
                await GM.deleteValue(key);
                return;
            }
        } catch {}

        try {
            localStorage.removeItem(key);
        } catch {}
    }

    async function getJson(key, fallbackValue) {
        const raw = await getStoredString(key);
        if (!raw) return fallbackValue;
        try {
            return JSON.parse(raw);
        } catch {
            return fallbackValue;
        }
    }

    async function setJson(key, value) {
        await setStoredString(key, JSON.stringify(value));
    }

    function normalizeConfig(loaded) {
        const next = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        if (!loaded || typeof loaded !== 'object') return next;

        if (loaded.pages && typeof loaded.pages === 'object') {
            for (const k of Object.keys(next.pages)) {
                if (typeof loaded.pages[k] === 'boolean') next.pages[k] = loaded.pages[k];
            }
        }

        if (typeof loaded.unknownCountryText === 'string') next.unknownCountryText = loaded.unknownCountryText;

        if (loaded.cache && typeof loaded.cache === 'object' && typeof loaded.cache.enabled === 'boolean') {
            next.cache.enabled = loaded.cache.enabled;
        }

        return next;
    }

    async function loadConfig() {
        const loaded = await getJson(STORAGE_CONFIG_KEY, null);
        config = normalizeConfig(loaded);
    }

    async function saveConfig() {
        await setJson(STORAGE_CONFIG_KEY, config);
    }

    async function loadPersistentCache() {
        const loaded = await getJson(STORAGE_CACHE_KEY, {});
        if (!loaded || typeof loaded !== 'object') return;

        for (const [k, v] of Object.entries(loaded)) {
            if (typeof v === 'string' || v === null) persistentCacheByAboutPath.set(k, v);
        }
    }

    function scheduleSavePersistentCache() {
        if (cacheSaveTimer) return;
        cacheSaveTimer = setTimeout(() => {
            cacheSaveTimer = null;
            savePersistentCache().catch(() => {});
        }, 800);
    }

    async function savePersistentCache() {
        const obj = {};
        for (const [k, v] of persistentCacheByAboutPath.entries()) obj[k] = v;
        await setJson(STORAGE_CACHE_KEY, obj);
    }

    async function resetCache() {
        persistentCacheByAboutPath.clear();
        memoryCacheByAboutPath.clear();
        inflightByCacheKey.clear();
        await deleteStoredKey(STORAGE_CACHE_KEY);
        updateSettingsCacheCount();
    }

    function getCacheCount() {
        return persistentCacheByAboutPath.size;
    }

    function getPageType() {
        const pathname = new URL(location.href).pathname.replace(/\/+$/, '') || '/';

        if (pathname === '/watch') return 'watch';
        if (pathname.startsWith('/shorts')) return 'shorts';
        if (pathname === '/results') return 'search';
        if (pathname === '/feed/subscriptions') return 'subscriptions';
        if (pathname === '/feed/trending' || pathname === '/feed/explore') return 'trending';
        if (pathname === '/') return 'home';

        const parts = pathname.split('/').filter(Boolean);
        if (parts[0]?.startsWith('@')) return 'channel';
        if (['channel', 'c', 'user'].includes(parts[0] || '') && parts[1]) return 'channel';

        return 'other';
    }

    function isEnabledForPage(pageType) {
        return Boolean(config.pages?.[pageType]);
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function waitFor(getter, { timeoutMs = 15000, intervalMs = 200 } = {}) {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            const value = getter();
            if (value) return value;
            await sleep(intervalMs);
        }
        return null;
    }

    function removeExistingPills() {
        document.querySelectorAll(PILL_SELECTOR).forEach((el) => el.remove());
    }

    function getOwnerRenderer() {
        return document.querySelector('ytd-video-owner-renderer');
    }

    function getShortsOwnerAnchor() {
        return (
            document.querySelector('ytd-reel-player-header-renderer a[href^="/@"]') ||
            document.querySelector('ytd-reel-player-header-renderer a[href^="/channel/"]') ||
            document.querySelector('ytd-reel-player-header-renderer a[href^="/c/"]') ||
            document.querySelector('ytd-reel-player-header-renderer a[href^="/user/"]')
        );
    }

    function getChannelBasePath(pathname) {
        const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
        if (parts.length === 0) return null;
        if (parts[0].startsWith('@')) return `/${parts[0]}`;
        if (['channel', 'c', 'user'].includes(parts[0]) && parts[1]) return `/${parts[0]}/${parts[1]}`;
        return null;
    }

    function getChannelAnchor(ownerRenderer) {
        if (!ownerRenderer) return null;

        return (
            ownerRenderer.querySelector('ytd-channel-name a[href]') ||
            ownerRenderer.querySelector('a.yt-simple-endpoint[href^="/channel/"]') ||
            ownerRenderer.querySelector('a.yt-simple-endpoint[href^="/@"]') ||
            ownerRenderer.querySelector('a.yt-simple-endpoint[href^="/c/"]') ||
            ownerRenderer.querySelector('a.yt-simple-endpoint[href^="/user/"]')
        );
    }

    function buildAboutUrl(channelUrl) {
        const url = new URL(channelUrl, location.origin);
        url.hash = '';
        url.search = '';

        const basePath = getChannelBasePath(url.pathname);
        let path = (basePath || url.pathname).replace(/\/+$/, '');
        if (!path.endsWith('/about')) path += '/about';
        url.pathname = path;
        return url;
    }

    function decodeJsonString(maybeEscaped) {
        try {
            return JSON.parse(`"${maybeEscaped}"`);
        } catch {
            return maybeEscaped;
        }
    }

    function parseCountryFromAboutHtml(htmlText) {
        const patterns = [
            /"country"\s*:\s*\{\s*"simpleText"\s*:\s*"((?:\\.|[^"\\])*)"\s*\}/,
            /"country"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"((?:\\.|[^"\\])*)"/,
            /"channelCountry"\s*:\s*"((?:\\.|[^"\\])*)"/,
            /"country"\s*:\s*"((?:\\.|[^"\\])*)"/,
        ];

        for (const re of patterns) {
            const m = htmlText.match(re);
            if (m?.[1]) {
                const decoded = decodeJsonString(m[1]).trim();
                if (decoded) return decoded;
            }
        }

        const legacy = htmlText.match(/country":{"simpleText":"(.*?)"},"/);
        if (legacy?.[1]) return legacy[1].trim();

        return null;
    }

    function createPill(country) {
        const container = document.createElement('span');
        const textContainer = document.createElement('span');
        const text = document.createElement('span');

        container.className = PILL_CONTAINER_CLASS;
        textContainer.className = PILL_TEXT_CONTAINER_CLASS;
        text.textContent = country;
        container.dataset.ytdcPill = '1';

        textContainer.appendChild(text);
        container.appendChild(textContainer);
        return container;
    }

    function insertPill(ownerRenderer, pill) {
        const badge = ownerRenderer.querySelector('ytd-channel-name > ytd-badge-supported-renderer');
        if (badge?.parentElement) {
            badge.parentElement.insertBefore(pill, badge.nextSibling);
            return;
        }

        const channelName = ownerRenderer.querySelector('ytd-channel-name');
        if (channelName) {
            (channelName.querySelector('#container') || channelName).appendChild(pill);
            return;
        }

        (ownerRenderer.querySelector('#upload-info') || ownerRenderer).appendChild(pill);
    }

    function enqueueFetch(task) {
        return new Promise((resolve, reject) => {
            fetchQueue.push({ task, resolve, reject });
            pumpFetchQueue();
        });
    }

    function pumpFetchQueue() {
        if (activeFetches >= MAX_CONCURRENT_FETCHES) return;

        const next = fetchQueue.shift();
        if (!next) return;

        activeFetches += 1;
        Promise.resolve()
            .then(next.task)
            .then(next.resolve)
            .catch(next.reject)
            .finally(() => {
                activeFetches -= 1;
                pumpFetchQueue();
            });
    }

    async function fetchCountryFromAbout(aboutUrl) {
        const res = await fetch(aboutUrl.toString(), { credentials: 'include' });
        const htmlText = await res.text();
        return parseCountryFromAboutHtml(htmlText);
    }

    async function getCountryForChannelUrl(channelUrl) {
        const aboutUrl = buildAboutUrl(channelUrl);
        const cacheKey = aboutUrl.pathname;

        if (memoryCacheByAboutPath.has(cacheKey)) return memoryCacheByAboutPath.get(cacheKey);

        if (config.cache.enabled && persistentCacheByAboutPath.has(cacheKey)) {
            const v = persistentCacheByAboutPath.get(cacheKey);
            memoryCacheByAboutPath.set(cacheKey, v);
            return v;
        }

        if (inflightByCacheKey.has(cacheKey)) return inflightByCacheKey.get(cacheKey);

        const p = enqueueFetch(async () => {
            try {
                const country = await fetchCountryFromAbout(aboutUrl);
                return country || null;
            } catch {
                return null;
            }
        })
            .then((country) => {
                memoryCacheByAboutPath.set(cacheKey, country);
                if (config.cache.enabled) {
                    persistentCacheByAboutPath.set(cacheKey, country);
                    scheduleSavePersistentCache();
                    updateSettingsCacheCount();
                }
                return country;
            })
            .finally(() => {
                inflightByCacheKey.delete(cacheKey);
            });

        inflightByCacheKey.set(cacheKey, p);
        return p;
    }

    async function runUpdate(seq) {
        removeExistingPills();

        processedAnchors = new WeakSet();
        observedAnchors = new WeakSet();

        mutationObserver?.disconnect();
        mutationObserver = null;

        intersectionObserver?.disconnect();
        intersectionObserver = null;

        const pageType = getPageType();
        if (!isEnabledForPage(pageType)) return;

        intersectionObserver = window.IntersectionObserver
            ? new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (!entry.isIntersecting) continue;
                            const anchor = entry.target;
                            intersectionObserver?.unobserve(anchor);
                            renderPillNextToAnchor(anchor, seq).catch(() => {});
                        }
                    },
                    { root: null, rootMargin: '200px 0px' },
                )
            : null;

        if (pageType === 'watch') {
            const ownerRenderer = await waitFor(() => getOwnerRenderer());
            if (!ownerRenderer || seq !== updateSeq) return;

            const channelAnchor = await waitFor(() => getChannelAnchor(ownerRenderer));
            if (!channelAnchor || seq !== updateSeq) return;

            const country = await getCountryForChannelUrl(channelAnchor.href);
            if (seq !== updateSeq) return;
            const display = (country || config.unknownCountryText || '').trim();
            if (!display) return;

            insertPill(ownerRenderer, createPill(display));
            return;
        }

        if (pageType === 'shorts') {
            const ownerAnchor = await waitFor(() => getShortsOwnerAnchor(), { timeoutMs: 15000, intervalMs: 250 });
            if (ownerAnchor && seq === updateSeq) {
                await renderPillNextToAnchor(ownerAnchor, seq);
            }
            observeAndScanPage(seq);
            return;
        }

        if (pageType === 'channel') {
            await renderChannelHeaderPill(seq);
            observeAndScanPage(seq);
            return;
        }

        observeAndScanPage(seq);
    }

    function isValidChannelAnchor(anchor) {
        if (!(anchor instanceof HTMLAnchorElement)) return false;
        if (!anchor.isConnected) return false;
        if (anchor.closest(`#${SETTINGS_ROOT_ID}`)) return false;
        if (anchor.closest(PILL_SELECTOR)) return false;
        if (
            getPageType() === 'channel' &&
            anchor.closest('ytd-c4-tabbed-header-renderer, yt-page-header-renderer, ytd-channel-page-header-renderer')
        ) {
            return false;
        }

        const text = (anchor.textContent || '').trim();
        if (!text) return false;

        const href = anchor.getAttribute('href') || '';
        if (!href.startsWith('/@') && !href.startsWith('/channel/') && !href.startsWith('/c/') && !href.startsWith('/user/')) return false;

        return true;
    }

    function observeAndScanPage(seq) {
        const root = document.querySelector('ytd-page-manager') || document.body || document.documentElement;
        scanNodeForAnchors(root, seq);

        mutationObserver = new MutationObserver((mutations) => {
            if (seq !== updateSeq) return;
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (!(n instanceof Element)) continue;
                    scanNodeForAnchors(n, seq);
                }
            }
        });

        mutationObserver.observe(root, { childList: true, subtree: true });
    }

    function scanNodeForAnchors(node, seq) {
        if (seq !== updateSeq) return;

        if (node.matches?.(CHANNEL_ANCHOR_SELECTOR)) scheduleAnchor(node, seq);
        node.querySelectorAll?.(CHANNEL_ANCHOR_SELECTOR).forEach((a) => scheduleAnchor(a, seq));
    }

    function scheduleAnchor(anchor, seq) {
        if (!isValidChannelAnchor(anchor)) return;
        if (observedAnchors.has(anchor)) return;
        observedAnchors.add(anchor);

        const insertionTarget = getPillInsertionTarget(anchor);
        if (hasExistingPill(insertionTarget)) return;

        if (intersectionObserver) {
            intersectionObserver.observe(anchor);
            return;
        }

        renderPillNextToAnchor(anchor, seq).catch(() => {});
    }

    function getPillInsertionTarget(anchor) {
        const pageType = getPageType();
        if (pageType === 'search') {
            const channelRenderer = anchor.closest('ytd-channel-renderer');
            if (channelRenderer) {
                const titleEl =
                    anchor.querySelector('#channel-title') ||
                    anchor.querySelector('h3') ||
                    channelRenderer.querySelector('#channel-title') ||
                    channelRenderer.querySelector('h3') ||
                    channelRenderer.querySelector('ytd-channel-name') ||
                    channelRenderer.querySelector('#channel-name') ||
                    null;

                if (titleEl && titleEl.isConnected) return { type: 'append', el: titleEl };
            }
        }

        return { type: 'after', el: anchor };
    }

    function hasExistingPill(target) {
        if (!target?.el) return false;
        if (target.type === 'append') return Boolean(target.el.querySelector?.(PILL_SELECTOR));
        return Boolean(target.el.nextElementSibling?.matches?.(PILL_SELECTOR));
    }

    function insertPillAtTarget(target, pill) {
        if (!target?.el) return;
        if (target.type === 'append') target.el.appendChild(pill);
        else target.el.after(pill);
    }

    async function renderPillNextToAnchor(anchor, seq) {
        if (!isValidChannelAnchor(anchor)) return;
        if (processedAnchors.has(anchor)) return;
        processedAnchors.add(anchor);

        const href = anchor.href;
        if (!href) return;

        const country = await getCountryForChannelUrl(href);
        if (seq !== updateSeq) return;
        if (!anchor.isConnected) return;

        const display = (country || config.unknownCountryText || '').trim();
        if (!display) return;

        const pill = createPill(display);
        const insertionTarget = getPillInsertionTarget(anchor);
        if (hasExistingPill(insertionTarget)) return;
        insertPillAtTarget(insertionTarget, pill);
    }

    function getChannelHeaderNameTarget() {
        const header =
            document.querySelector('ytd-c4-tabbed-header-renderer') ||
            document.querySelector('yt-page-header-renderer') ||
            document.querySelector('ytd-channel-page-header-renderer') ||
            null;

        if (!header) return null;

        const ytdChannelName = header.querySelector('ytd-channel-name');
        if (ytdChannelName) return ytdChannelName;

        const channelNameRoot = header.querySelector('#channel-name') || header;

        const textContainer = channelNameRoot.querySelector('#text-container');
        if (textContainer) return textContainer;

        const titleH1 = channelNameRoot.querySelector('h1');
        if (titleH1) return titleH1;

        const textEl =
            channelNameRoot.querySelector('yt-formatted-string#text') ||
            channelNameRoot.querySelector('#text') ||
            channelNameRoot.querySelector('yt-formatted-string') ||
            null;

        const container = textEl?.parentElement || null;
        if (container && container !== channelNameRoot) return container;

        if (channelNameRoot.querySelector('#buttons, ytd-subscribe-button-renderer, yt-subscribe-button-view-model')) {
            return null;
        }

        return channelNameRoot === header ? null : channelNameRoot;
    }

    async function renderChannelHeaderPill(seq) {
        const base = getChannelBasePath(new URL(location.href).pathname);
        if (!base) return;

        const target = await waitFor(() => getChannelHeaderNameTarget(), { timeoutMs: 15000, intervalMs: 250 });
        if (!target || seq !== updateSeq) return;

        const channelUrl = new URL(base, location.origin).toString();
        const country = await getCountryForChannelUrl(channelUrl);
        if (seq !== updateSeq) return;

        const display = (country || config.unknownCountryText || '').trim();
        if (!display) return;

        const pill = createPill(display);
        const host = target.matches('ytd-channel-name') ? target : target.querySelector('ytd-channel-name') || target;

        const badge = host.querySelector?.('ytd-badge-supported-renderer');
        if (badge?.parentElement) {
            badge.parentElement.insertBefore(pill, badge.nextSibling);
            return;
        }

        const container = host.querySelector?.('#container') || host.querySelector?.('#text-container') || host;
        container.appendChild(pill);
    }

    function requestUpdate() {
        updateSeq += 1;
        updateRequested = true;

        if (running) return;
        running = true;

        (async () => {
            while (updateRequested) {
                updateRequested = false;
                const seq = updateSeq;
                await runUpdate(seq);
            }
        })()
            .catch(() => {})
            .finally(() => {
                running = false;
            });
    }

    function ensureSettingsUi() {
        if (document.getElementById(SETTINGS_ROOT_ID)) return;

        const root = document.createElement('div');
        root.id = SETTINGS_ROOT_ID;
        root.dataset.open = '0';

        root.innerHTML = `
      <div class="ytdc-panel" role="dialog" aria-modal="true">
        <div class="ytdc-header">
          <div class="ytdc-title">YouTube Channel Location</div>
          <button class="ytdc-close" type="button" aria-label="Close">×</button>
        </div>

        <div class="ytdc-section">
          <div class="ytdc-section-title">Show the location info on the:</div>
          <div class="ytdc-list">
            <label><input type="checkbox" data-page="watch"> Watch page</label>
            <label><input type="checkbox" data-page="home"> Home page</label>
            <label><input type="checkbox" data-page="channel"> Channel page</label>
            <label><input type="checkbox" data-page="search"> Search page</label>
            <label><input type="checkbox" data-page="subscriptions"> Subscriptions page</label>
            <label><input type="checkbox" data-page="trending"> Trending page</label>
            <label><input type="checkbox" data-page="shorts"> Shorts page</label>
          </div>
        </div>

        <div class="ytdc-section">
          <div class="ytdc-section-title">Other settings:</div>

          <div class="ytdc-setting-line">
            <div class="ytdc-setting-label">If the author did not specify the country of the channel, show:</div>
            <input class="ytdc-input" type="text" data-field="unknownCountryText" maxlength="40">
            <button class="ytdc-btn ytdc-icon-btn" type="button" data-action="save-unknown" title="Save">✓</button>
          </div>

          <div class="ytdc-cache-line">
            <label class="ytdc-cache-label">
              <input type="checkbox" data-field="cacheEnabled">
              <span>Cache location info</span>
            </label>
            <a class="ytdc-link ytdc-cache-count" href="#" data-action="refresh-cache-count"><span data-role="cache-count">0 items cached</span></a>
          </div>

          <button class="ytdc-btn ytdc-primary" type="button" data-action="reset-cache">Reset cache</button>
        </div>
      </div>
    `;

        root.addEventListener('click', (e) => {
            if (e.target === root) closeSettings();
        });

        root.querySelector('.ytdc-close')?.addEventListener('click', () => closeSettings());

        root.querySelectorAll('input[type="checkbox"][data-page]').forEach((el) => {
            el.addEventListener('change', async () => {
                const page = el.getAttribute('data-page');
                if (!page) return;
                config.pages[page] = el.checked;
                await saveConfig();
                requestUpdate();
            });
        });

        const unknownInput = root.querySelector('input[data-field="unknownCountryText"]');
        const saveUnknown = async () => {
            if (!unknownInput) return;
            config.unknownCountryText = unknownInput.value;
            await saveConfig();
            requestUpdate();
        };

        unknownInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveUnknown().catch(() => {});
        });

        root.querySelector('[data-action="save-unknown"]')?.addEventListener('click', () => saveUnknown().catch(() => {}));

        const cacheEnabled = root.querySelector('input[data-field="cacheEnabled"]');
        cacheEnabled?.addEventListener('change', async () => {
            config.cache.enabled = Boolean(cacheEnabled.checked);
            await saveConfig();
            requestUpdate();
        });

        root.querySelector('[data-action="refresh-cache-count"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            updateSettingsCacheCount();
        });

        root.querySelector('[data-action="reset-cache"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            resetCache().catch(() => {});
            requestUpdate();
        });

        (document.body || document.documentElement).appendChild(root);
        syncSettingsUiFromConfig();
        updateSettingsCacheCount();
    }

    function syncSettingsUiFromConfig() {
        const root = document.getElementById(SETTINGS_ROOT_ID);
        if (!root) return;

        root.querySelectorAll('input[type="checkbox"][data-page]').forEach((el) => {
            const page = el.getAttribute('data-page');
            if (!page) return;
            el.checked = Boolean(config.pages?.[page]);
        });

        const unknownInput = root.querySelector('input[data-field="unknownCountryText"]');
        if (unknownInput) unknownInput.value = config.unknownCountryText ?? '';

        const cacheEnabled = root.querySelector('input[data-field="cacheEnabled"]');
        if (cacheEnabled) cacheEnabled.checked = Boolean(config.cache.enabled);
    }

    function updateSettingsCacheCount() {
        const root = document.getElementById(SETTINGS_ROOT_ID);
        if (!root) return;
        const el = root.querySelector('[data-role="cache-count"]');
        if (el) el.textContent = `${getCacheCount()} items cached`;
    }

    function openSettings() {
        ensureSettingsUi();
        syncSettingsUiFromConfig();
        updateSettingsCacheCount();

        const root = document.getElementById(SETTINGS_ROOT_ID);
        if (!root) return;
        root.dataset.open = '1';
    }

    function closeSettings() {
        const root = document.getElementById(SETTINGS_ROOT_ID);
        if (!root) return;
        root.dataset.open = '0';
    }

    function toggleSettings() {
        const root = document.getElementById(SETTINGS_ROOT_ID);
        if (!root || root.dataset.open !== '1') openSettings();
        else closeSettings();
    }

    addStyle(STYLE);

    await loadConfig();
    await loadPersistentCache();

    if (typeof GM_registerMenuCommand === 'function') {
        try {
            GM_registerMenuCommand('Settings', openSettings);
        } catch {}
    }

    window.addEventListener('yt-navigate-finish', requestUpdate, true);
    window.addEventListener('popstate', requestUpdate, true);
    window.addEventListener('load', requestUpdate, true);

    requestUpdate();
})();
