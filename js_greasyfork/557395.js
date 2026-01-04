// ==UserScript==
// @name         Jellyfin 海报图添加分辨率标识（Jellyfin-Qualitytags）
// @namespace    http://tampermonkey.net/
// @version      2025-11-30
// @description  Jellyfin 给海报图添加分辨率标识，来源：https://github.com/BobHasNoSoul/Jellyfin-Qualitytags
// @author       BobHasNoSoul
// @match        *://*/web/*
// @match        *://*/*/web/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557395/Jellyfin%20%E6%B5%B7%E6%8A%A5%E5%9B%BE%E6%B7%BB%E5%8A%A0%E5%88%86%E8%BE%A8%E7%8E%87%E6%A0%87%E8%AF%86%EF%BC%88Jellyfin-Qualitytags%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557395/Jellyfin%20%E6%B5%B7%E6%8A%A5%E5%9B%BE%E6%B7%BB%E5%8A%A0%E5%88%86%E8%BE%A8%E7%8E%87%E6%A0%87%E8%AF%86%EF%BC%88Jellyfin-Qualitytags%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    const overlayClass = 'quality-overlay-label';
    const CACHE_VERSION = 'v9';
    const CACHE_KEY = `qualityOverlayCache-${CACHE_VERSION}`;

    const IGNORE_SELECTORS = [
        'html.preload.layout-desktop body.force-scroll.libraryDocument div#reactRoot div.mainAnimatedPages.skinBody div#itemDetailPage.page.libraryPage.itemDetailPage.noSecondaryNavPage.selfBackdropPage.mainAnimatedPage div.detailPageWrapperContainer div.detailPageSecondaryContainer.padded-bottom-page div.detailPageContent div#castCollapsible.verticalSection.detailVerticalSection.emby-scroller-container a.cardImageContainer',
        'html.preload.layout-desktop body.force-scroll.libraryDocument.withSectionTabs.mouseIdle div#reactRoot div.mainAnimatedPages.skinBody div#indexPage.page.homePage.libraryPage.allLibraryPage.backdropPage.pageWithAbsoluteTabs.withTabs.mainAnimatedPage div#homeTab.tabContent.pageTabContent.is-active div.sections.homeSectionsContainer div.verticalSection.MyMedia.emby-scroller-container a.cardImageContainer'
    ];

    const MEDIA_TYPES = new Set(['Movie', 'Episode', 'Series', 'Season']);

    let qualityOverlayCache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    let seenItems = new Set();
    let pendingRequests = new Set();
    let errorCount = 0;
    let currentDelay = 1000;

    const qualityColors = {
        '720p': 'rgba(255, 165, 0, 0.85)',
        '1080p': 'rgba(0, 204, 204, 0.85)',
        SD: 'rgba(150, 150, 150, 0.85)',
        HD: 'rgba(0, 102, 204, 0.85)',
        UHD: 'rgba(0, 153, 51, 0.85)'
    };

    const config = {
        MAX_CONCURRENT_REQUESTS: 9,
        BASE_DELAY: 1000,
        MAX_DELAY: 10000,
        VISIBLE_PRIORITY_DELAY: 200,
        CACHE_TTL: 7 * 24 * 60 * 60 * 1000,
        REQUEST_TIMEOUT: 5000
    };

    const visibilityObserver = new IntersectionObserver(handleIntersection, {
        rootMargin: '300px',
        threshold: 0.01
    });

    let currentUrl = window.location.href;
    let navigationHandlerSetup = false;

    function getUserId() {
        try {
            return (window.ApiClient?._serverInfo?.UserId) || null;
        } catch {
            return null;
        }
    }

    function saveCache() {
        try {
            const now = Date.now();
            for (const [key, entry] of Object.entries(qualityOverlayCache)) {
                if (now - entry.timestamp > config.CACHE_TTL) {
                    delete qualityOverlayCache[key];
                }
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(qualityOverlayCache));
        } catch (e) {
            console.warn('Failed to save cache', e);
        }
    }

    function createLabel(label) {
        const badge = document.createElement('div');
        badge.textContent = label;
        badge.className = overlayClass;
        badge.style.background = qualityColors[label] || qualityColors.SD;
        badge.style.position = 'absolute';
        badge.style.top = '6px';
        badge.style.left = '6px';
        badge.style.color = 'white';
        badge.style.padding = '2px 6px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.borderRadius = '4px';
        badge.style.zIndex = '99';
        badge.style.pointerEvents = 'none';
        badge.style.userSelect = 'none';
        return badge;
    }

    function getQuality(mediaStream) {
        if (!mediaStream) return null;
        const height = mediaStream.Height || 0;

        if (height >= 1200) return 'UHD';
        if (height >= 900 && height < 1200) return '1080p';
        if (height >= 500 && height < 900) return '720p';
        if (height > 0 && height < 500) return 'SD';
        return null;
    }

    async function fetchFirstEpisode(userId, seriesId) {
        try {
            const episodeResponse = await ApiClient.ajax({
                type: "GET",
                url: ApiClient.getUrl("/Items", {
                    ParentId: seriesId,
                    IncludeItemTypes: "Episode",
                    Recursive: true,
                    SortBy: "PremiereDate",
                    SortOrder: "Ascending",
                    Limit: 1,
                    userId: userId
                }),
                dataType: "json"
            });

            const episode = episodeResponse.Items?.[0];
            if (!episode?.Id) return null;
            return episode;
        } catch {
            return null;
        }
    }

    async function fetchItemQuality(userId, itemId) {
        if (pendingRequests.has(itemId)) return null;
        pendingRequests.add(itemId);

        try {
            let item;
            try {
                item = await ApiClient.getItem(userId, itemId);
            } catch {
                const url = ApiClient.getUrl(`/Items/${itemId}`, { userId });
                const response = await fetchWithTimeout(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                item = await response.json();
            }

            if (!item || !MEDIA_TYPES.has(item.Type)) return null;

            let videoStream = null;
            let quality = null;

            if (item.Type === "Series") {
                const ep = await fetchFirstEpisode(userId, item.Id);
                if (ep?.Id) {
                    const fullEp = await ApiClient.getItem(userId, ep.Id);
                    videoStream = fullEp?.MediaSources?.[0]?.MediaStreams?.find(s => s.Type === 'Video');
                    quality = getQuality(videoStream);
                }
            } else if (item.Type === "Season") {
                const seasonEpisodes = await ApiClient.ajax({
                    type: "GET",
                    url: ApiClient.getUrl("/Items", {
                        ParentId: item.Id,
                        IncludeItemTypes: "Episode",
                        Limit: 1,
                        SortBy: "PremiereDate",
                        SortOrder: "Ascending",
                        userId: userId
                    }),
                    dataType: "json"
                });

                if (seasonEpisodes.Items?.[0]?.Id) {
                    const episode = await ApiClient.getItem(userId, seasonEpisodes.Items[0].Id);
                    videoStream = episode?.MediaSources?.[0]?.MediaStreams?.find(s => s.Type === 'Video');
                    quality = getQuality(videoStream);
                }
            } else {
                videoStream = item?.MediaSources?.[0]?.MediaStreams?.find(s => s.Type === 'Video');
                quality = getQuality(videoStream);
            }

            if (quality) {
                qualityOverlayCache[itemId] = {
                    quality,
                    timestamp: Date.now()
                };
                saveCache();
                return quality;
            }

            return null;
        } catch {
            handleApiError();
            return null;
        } finally {
            pendingRequests.delete(itemId);
        }
    }

    function handleApiError() {
        errorCount++;
        currentDelay = Math.min(
            config.MAX_DELAY,
            config.BASE_DELAY * Math.pow(2, Math.min(errorCount, 5)) * (0.8 + Math.random() * 0.4)
        );
    }

    function insertOverlay(container, quality) {
        if (!container || container.querySelector(`.${overlayClass}`)) return;

        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        const label = createLabel(quality);
        container.appendChild(label);
    }

    function getItemIdFromElement(el) {
        if (el.href) {
            const match = el.href.match(/id=([a-f0-9]{32})/i);
            if (match) return match[1];
        }
        if (el.style.backgroundImage) {
            const match = el.style.backgroundImage.match(/\/Items\/([a-f0-9]{32})\//i);
            if (match) return match[1];
        }
        return null;
    }

    function shouldIgnoreElement(el) {
        return IGNORE_SELECTORS.some(selector => el.closest(selector) !== null);
    }

    async function processElement(el, isPriority = false) {
        if (shouldIgnoreElement(el)) return;

        const itemId = getItemIdFromElement(el);
        if (!itemId || seenItems.has(itemId)) return;
        seenItems.add(itemId);

        const cached = qualityOverlayCache[itemId];
        if (cached) {
            insertOverlay(el, cached.quality);
            return;
        }

        const userId = getUserId();
        if (!userId) return;

        const delay = isPriority ?
            Math.min(config.VISIBLE_PRIORITY_DELAY, currentDelay) :
            currentDelay;

        await new Promise(resolve => setTimeout(resolve, delay));

        if (qualityOverlayCache[itemId]) {
            insertOverlay(el, qualityOverlayCache[itemId].quality);
            return;
        }

        const quality = await fetchItemQuality(userId, itemId);
        if (quality) insertOverlay(el, quality);
    }

    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight + 300) &&
            rect.bottom >= -300 &&
            rect.left <= (window.innerWidth + 300) &&
            rect.right >= -300
        );
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                visibilityObserver.unobserve(el);
                processElement(el, true);
            }
        });
    }

    function renderVisibleTags() {
        const elements = Array.from(document.querySelectorAll('a.cardImageContainer, div.listItemImage'));

        elements.forEach(el => {
            if (shouldIgnoreElement(el)) return;

            const itemId = getItemIdFromElement(el);
            if (!itemId) return;

            const cached = qualityOverlayCache[itemId];
            if (cached) {
                insertOverlay(el, cached.quality);
                return;
            }

            if (isElementVisible(el)) {
                processElement(el, true);
            } else {
                visibilityObserver.observe(el);
            }
        });
    }

    function hookIntoHistoryChanges(callback) {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            callback();
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            callback();
        };

        window.addEventListener('popstate', callback);
    }

    function setupNavigationHandlers() {
        if (navigationHandlerSetup) return;
        navigationHandlerSetup = true;

        document.addEventListener('click', (e) => {
            const backButton = e.target.closest('button.headerButtonLeft:nth-child(1) > span:nth-child(1)');
            if (backButton) {
                setTimeout(() => {
                    seenItems.clear();
                    renderVisibleTags();
                }, 500);
            }
        });

        hookIntoHistoryChanges(() => {
            currentUrl = window.location.href;
            seenItems.clear();
            visibilityObserver.disconnect();
            setTimeout(renderVisibleTags, 300);
        });
    }

    function addStyles() {
        if (document.getElementById('quality-tag-style')) return;
        const style = document.createElement('style');
        style.id = 'quality-tag-style';
        style.textContent = `
            .${overlayClass} {
                user-select: none;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    addStyles();

    setTimeout(() => {
        setupNavigationHandlers();
        renderVisibleTags();
    }, 1500);

    window.addEventListener('beforeunload', saveCache);
    setInterval(saveCache, 60000);

    const mutationObserver = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            setTimeout(renderVisibleTags, 1000);
        }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    async function fetchWithTimeout(url, timeout = config.REQUEST_TIMEOUT) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
        ]);
    }
})();