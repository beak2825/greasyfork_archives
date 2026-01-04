// ==UserScript==
// @name         【YouTube/ニコニコ動画】詳細時間表示ツール
// @name:en      【YouTube/Niconico】Detailed Upload Time Display
// @name:zh-CN   【YouTube/Niconico】详细上传时间显示工具
// @name:zh-TW   【YouTube/Niconico】詳細上傳時間顯示工具
// @name:ko      【YouTube/니코니코】상세 업로드 시간 표시 도구
// @namespace    torokesou
// @version      1.0.0
// @description  YouTubeやニコニコ動画の動画投稿時刻を何時何分何秒まで細かく表示するように変更します。
// @description:en  Displays the exact upload time (hour, minute, second) for YouTube and Niconico videos.
// @description:zh-CN  将YouTube和Niconico视频的上传时间精确显示到时分秒。
// @description:zh-TW  將YouTube和Niconico影片的上傳時間精確顯示到時分秒。
// @description:ko  YouTube 및 니코니코 동영상의 업로드 시간을 시, 분, 초까지 정확하게 표시합니다.
// @author       torokesou
// @license      MIT
// @icon         https://files.catbox.moe/5qwltd.png
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://www.nicovideo.jp/*
// @match        *://nicovideo.jp/*
// @match        *://sp.nicovideo.jp/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559643/%E3%80%90YouTube%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%80%91%E8%A9%B3%E7%B4%B0%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/559643/%E3%80%90YouTube%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%80%91%E8%A9%B3%E7%B4%B0%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = '';
    let observerYouTube = null;
    let observerNiconico = null;
    let debounceTimer = null;
    const DEBOUNCE_DELAY = 50;

    const publishDateCache = new Map();

    function formatDateTime(isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return null;

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        } catch (e) {
            return null;
        }
    }

    function isDetailedFormat(text) {
        return /\d{2}:\d{2}:\d{2}/.test(text);
    }

    function getYouTubeVideoId() {
        try {
            const url = new URL(window.location.href);
            if (url.pathname === '/watch') {
                return url.searchParams.get('v');
            } else if (url.pathname.startsWith('/shorts/')) {
                return url.pathname.split('/shorts/')[1]?.split(/[?#]/)[0];
            }
        } catch (e) {}
        return null;
    }

    function getNiconicoVideoId() {
        try {
            const match = window.location.pathname.match(/\/watch\/([a-z]{2}\d+)/);
            return match ? match[1] : null;
        } catch (e) {}
        return null;
    }

    function extractYouTubeVideoIdFromUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.pathname === '/watch') {
                return urlObj.searchParams.get('v');
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                return urlObj.pathname.split('/shorts/')[1]?.split(/[?#]/)[0];
            }
        } catch (e) {}
        return null;
    }

    function extractNiconicoVideoIdFromUrl(url) {
        try {
            const match = url.match(/\/watch\/([a-z]{2}\d+)/);
            return match ? match[1] : null;
        } catch (e) {}
        return null;
    }

    function extractYouTubeDateFromHtml(html, videoId) {
        try {
            if (!html.includes(videoId)) return null;

            const metaMatch = html.match(/<meta\s+itemprop="datePublished"\s+content="([^"]+)"/);
            if (metaMatch) return metaMatch[1];

            const jsonMatch = html.match(/"publishDate"\s*:\s*"([^"]+)"/);
            if (jsonMatch) return jsonMatch[1];

            return null;
        } catch (e) {
            return null;
        }
    }

    function extractYouTubeDateFromJson(json, videoId) {
        try {
            if (json?.videoDetails?.videoId !== videoId) return null;
            return json?.microformat?.playerMicroformatRenderer?.publishDate || null;
        } catch (e) {
            return null;
        }
    }

    function extractNiconicoDatesFromHtml(html, videoId) {
        try {
            if (!html.includes(videoId)) return null;

            const ldJsonMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
            if (ldJsonMatch) {
                try {
                    const ldJson = JSON.parse(ldJsonMatch[1]);
                    if (ldJson.uploadDate) return ldJson.uploadDate;
                } catch (e) {}
            }

            const uploadDateMatch = html.match(/"uploadDate"\s*:\s*"([^"]+)"/);
            if (uploadDateMatch) return uploadDateMatch[1];

            return null;
        } catch (e) {
            return null;
        }
    }

    function extractNiconicoDateFromJson(json) {
        try {
            return json?.data?.metadata?.jsonLds?.[0]?.uploadDate || null;
        } catch (e) {
            return null;
        }
    }

    function cacheAndTriggerUpdate(videoId, publishDate, site) {
        if (!videoId || !publishDate) return;
        if (publishDateCache.get(videoId) === publishDate) return;

        publishDateCache.set(videoId, publishDate);

        setTimeout(() => {
            if (site === 'youtube') {
                processYouTube();
            } else if (site === 'niconico') {
                processNiconico();
            }
        }, 100);
    }

    function setupNetworkInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

                if (url.includes('/youtubei/v1/player')) {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(json => {
                        const videoId = json?.videoDetails?.videoId;
                        if (videoId) {
                            const publishDate = extractYouTubeDateFromJson(json, videoId);
                            if (publishDate) cacheAndTriggerUpdate(videoId, publishDate, 'youtube');
                        }
                    }).catch(() => {});
                }

                if ((url.includes('/watch?v=') || url.includes('/shorts/')) &&
                    !url.includes('youtubei') && !url.includes('pbj=1')) {
                    const videoId = extractYouTubeVideoIdFromUrl(url);
                    if (videoId) {
                        const clonedResponse = response.clone();
                        clonedResponse.text().then(html => {
                            const publishDate = extractYouTubeDateFromHtml(html, videoId);
                            if (publishDate) cacheAndTriggerUpdate(videoId, publishDate, 'youtube');
                        }).catch(() => {});
                    }
                }

                if (url.includes('nicovideo.jp/watch/') && url.includes('responseType=json')) {
                    const videoId = extractNiconicoVideoIdFromUrl(url);
                    if (videoId) {
                        const clonedResponse = response.clone();
                        clonedResponse.json().then(json => {
                            const uploadDate = extractNiconicoDateFromJson(json);
                            if (uploadDate) cacheAndTriggerUpdate(videoId, uploadDate, 'niconico');
                        }).catch(() => {});
                    }
                }

                if (url.includes('nicovideo.jp/watch/') && !url.includes('responseType=json')) {
                    const videoId = extractNiconicoVideoIdFromUrl(url);
                    if (videoId) {
                        const clonedResponse = response.clone();
                        clonedResponse.text().then(html => {
                            const uploadDate = extractNiconicoDatesFromHtml(html, videoId);
                            if (uploadDate) cacheAndTriggerUpdate(videoId, uploadDate, 'niconico');
                        }).catch(() => {});
                    }
                }
            } catch (e) {}

            return response;
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            this._method = method;
            return originalXhrOpen.apply(this, [method, url, ...rest]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('load', function() {
                try {
                    const url = this._url || '';

                    if (url.includes('/youtubei/v1/player')) {
                        try {
                            const json = JSON.parse(this.responseText);
                            const videoId = json?.videoDetails?.videoId;
                            if (videoId) {
                                const publishDate = extractYouTubeDateFromJson(json, videoId);
                                if (publishDate) cacheAndTriggerUpdate(videoId, publishDate, 'youtube');
                            }
                        } catch (e) {}
                    }

                    if ((url.includes('/watch?v=') || url.includes('/shorts/')) &&
                        !url.includes('youtubei') && !url.includes('pbj=1')) {
                        const videoId = extractYouTubeVideoIdFromUrl(url);
                        if (videoId && this.responseText) {
                            const publishDate = extractYouTubeDateFromHtml(this.responseText, videoId);
                            if (publishDate) cacheAndTriggerUpdate(videoId, publishDate, 'youtube');
                        }
                    }

                    if (url.includes('nicovideo.jp/watch/') && url.includes('responseType=json')) {
                        const videoId = extractNiconicoVideoIdFromUrl(url);
                        if (videoId) {
                            try {
                                const json = JSON.parse(this.responseText);
                                const uploadDate = extractNiconicoDateFromJson(json);
                                if (uploadDate) cacheAndTriggerUpdate(videoId, uploadDate, 'niconico');
                            } catch (e) {}
                        }
                    }

                    if (url.includes('nicovideo.jp/watch/') && !url.includes('responseType=json')) {
                        const videoId = extractNiconicoVideoIdFromUrl(url);
                        if (videoId && this.responseText) {
                            const uploadDate = extractNiconicoDatesFromHtml(this.responseText, videoId);
                            if (uploadDate) cacheAndTriggerUpdate(videoId, uploadDate, 'niconico');
                        }
                    }
                } catch (e) {}
            });

            return originalXhrSend.apply(this, args);
        };
    }

    function extractDateFromInitialPage() {
        try {
            if (isYouTube()) {
                const videoId = getYouTubeVideoId();
                if (!videoId || publishDateCache.has(videoId)) return;

                if (window.ytInitialPlayerResponse) {
                    const publishDate = extractYouTubeDateFromJson(window.ytInitialPlayerResponse, videoId);
                    if (publishDate) {
                        publishDateCache.set(videoId, publishDate);
                        return;
                    }
                }

                const meta = document.querySelector('meta[itemprop="datePublished"]');
                if (meta) {
                    const publishDate = meta.getAttribute('content');
                    if (publishDate) {
                        publishDateCache.set(videoId, publishDate);
                        return;
                    }
                }
            } else if (isNiconico()) {
                const videoId = getNiconicoVideoId();
                if (!videoId || publishDateCache.has(videoId)) return;

                const ldJsonScript = document.querySelector('script[type="application/ld+json"]');
                if (ldJsonScript) {
                    try {
                        const ldJson = JSON.parse(ldJsonScript.textContent);
                        if (ldJson.uploadDate) {
                            publishDateCache.set(videoId, ldJson.uploadDate);
                            return;
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}
    }

    function updateYouTubeWatchDate(videoId) {
        const publishDate = publishDateCache.get(videoId);
        if (!publishDate) return false;

        const formattedDate = formatDateTime(publishDate);
        if (!formattedDate) return false;

        const watchMetadata = document.querySelector('ytd-watch-metadata');
        if (!watchMetadata) return false;

        const allSpans = watchMetadata.querySelectorAll('span[dir="auto"]');
        for (const span of allSpans) {
            const text = span.textContent.trim();

            if (isDetailedFormat(text)) continue;

            if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(text)) {
                span.textContent = formattedDate;
                return true;
            }

            if (/^\d{4}\/\d{1,2}\/\d{1,2}に公開済み$/.test(text)) {
                span.textContent = formattedDate + 'に公開済み';
                return true;
            }
        }

        return false;
    }

    function updateYouTubeShortsDate(videoId) {
        const publishDate = publishDateCache.get(videoId);
        if (!publishDate) return false;

        const formattedDate = formatDateTime(publishDate);
        if (!formattedDate) return false;

        const factoidRenderers = document.querySelectorAll('factoid-renderer');

        for (const renderer of factoidRenderers) {
            const div = renderer.querySelector('.ytwFactoidRendererFactoid');
            if (!div) continue;

            const ariaLabel = div.getAttribute('aria-label');
            if (!ariaLabel) continue;

            if (isDetailedFormat(ariaLabel)) continue;

            const isDatePattern = (
                /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(ariaLabel) ||
                /^\d{1,2}月\d{1,2}日$/.test(ariaLabel) ||
                /^\d{4}年\d{1,2}月\d{1,2}日$/.test(ariaLabel) ||
                /^\d+\s*(秒|分|時間|日|週間|か月|ヶ月|年)\s*前$/.test(ariaLabel)
            );

            if (isDatePattern) {
                div.setAttribute('aria-label', formattedDate);

                const valueSpan = div.querySelector('.ytwFactoidRendererValue span');
                const labelSpan = div.querySelector('.ytwFactoidRendererLabel span');

                if (valueSpan && labelSpan) {
                    const [datePart, timePart] = formattedDate.split(' ');
                    valueSpan.textContent = datePart;
                    labelSpan.textContent = timePart;
                    return true;
                }
            }
        }

        return false;
    }

    function processYouTube() {
        const url = window.location.href;
        const videoId = getYouTubeVideoId();
        if (!videoId) return;

        if (url.includes('/watch')) {
            const expander = document.querySelector('#description-inline-expander');
            if (!expander || !expander.hasAttribute('is-expanded')) return;
            updateYouTubeWatchDate(videoId);
        } else if (url.includes('/shorts/')) {
            updateYouTubeShortsDate(videoId);
        }
    }

    function processNiconico() {
        const videoId = getNiconicoVideoId();
        if (!videoId) return;

        const descriptionPanel = document.querySelector('[data-decoration-video-id]');
        if (!descriptionPanel) return;

        const isHidden = descriptionPanel.getAttribute('aria-hidden') === 'true';
        if (isHidden) return;

        const timeElement = descriptionPanel.querySelector('time[datetime]');
        if (!timeElement) return;

        if (isDetailedFormat(timeElement.textContent)) return;

        const datetime = timeElement.getAttribute('datetime');
        if (!datetime) return;

        const formattedDate = formatDateTime(datetime);
        if (!formattedDate) return;

        timeElement.textContent = formattedDate;
    }

    function debounceProcess(processFn) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => processFn(), DEBOUNCE_DELAY);
    }

    function startYouTubeObserver() {
        if (observerYouTube) observerYouTube.disconnect();

        observerYouTube = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let immediate = false;

            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'is-expanded') {
                        shouldProcess = true;
                        immediate = true;
                        break;
                    }
                } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName?.toLowerCase();
                            if (tagName === 'ytd-watch-metadata' ||
                                tagName === 'factoid-renderer' ||
                                node.id === 'description-inline-expander' ||
                                node.querySelector?.('.ytwFactoidRendererFactoid') ||
                                node.querySelector?.('span[dir="auto"]')) {
                                shouldProcess = true;
                                immediate = true;
                                break;
                            }
                        }
                    }
                    if (shouldProcess) break;
                }
            }

            if (shouldProcess) {
                if (immediate) processYouTube();
                else debounceProcess(processYouTube);
            }
        });

        if (document.body) {
            observerYouTube.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['is-expanded']
            });
        }

        extractDateFromInitialPage();
        processYouTube();
        setTimeout(processYouTube, 300);
        setTimeout(processYouTube, 1000);
    }

    function startNiconicoObserver() {
        if (observerNiconico) observerNiconico.disconnect();

        observerNiconico = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                    shouldProcess = true;
                    break;
                } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector?.('time[datetime]')) {
                            shouldProcess = true;
                            break;
                        }
                    }
                    if (shouldProcess) break;
                }
            }

            if (shouldProcess) debounceProcess(processNiconico);
        });

        if (document.body) {
            observerNiconico.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-hidden']
            });
        }

        extractDateFromInitialPage();
        processNiconico();
        setTimeout(processNiconico, 300);
        setTimeout(processNiconico, 1000);
    }

    function checkUrlChange() {
        const newUrl = window.location.href;

        if (currentUrl !== newUrl) {
            currentUrl = newUrl;

            if (isYouTube()) startYouTubeObserver();
            else if (isNiconico()) startNiconicoObserver();
        }
    }

    function isYouTube() {
        return window.location.hostname.includes('youtube.com');
    }

    function isNiconico() {
        return window.location.hostname.includes('nicovideo.jp');
    }

    function init() {
        setupNetworkInterceptor();

        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(checkUrlChange, 50);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(checkUrlChange, 50);
        };

        window.addEventListener('popstate', () => setTimeout(checkUrlChange, 50));
        window.addEventListener('yt-navigate-finish', () => setTimeout(checkUrlChange, 50));
        window.addEventListener('yt-page-data-updated', () => setTimeout(checkUrlChange, 50));

        const startObserver = () => {
            currentUrl = window.location.href;
            if (isYouTube()) startYouTubeObserver();
            else if (isNiconico()) startNiconicoObserver();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver);
        } else {
            startObserver();
        }

        setInterval(checkUrlChange, 500);
    }

    init();
})();