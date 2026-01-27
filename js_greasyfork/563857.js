// ==UserScript==
// @name Nekohouse Video Filter v1
// @namespace http://tampermonkey.net/
// @version 1.1.1
// @description Filters posts with videos/GIFs on nekohouse.su by scraping HTML. Designed to be respectful of server resources.
// @author harryangstrom, xdegeneratex, remuru, ImTrep, DeepSeek, Grok
// @match https://*.nekohouse.su/*
// @icon https://www.google.com/s2/favicons?domain=nekohouse.su/&sz=64
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563857/Nekohouse%20Video%20Filter%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/563857/Nekohouse%20Video%20Filter%20v1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const VIDEO_EXTENSIONS = new Set([
        'mp4', 'm4v', 'mov', 'webm', 'avi', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg',
        'm2ts', 'mts', 'ogv', 'qt', 'rm', 'rmvb', 'vob', 'asf', '3gp', 'f4v',
        'mxf', 'swf', 'ts', 'm4a', 'm4b', 'm4p', 'm4r', 'm4v'
    ]);
    const SUBSTRING_TITLE_LENGTH = 100;
    const LS_COLLAPSE_KEY = 'nekohouseVideoFilterPanelCollapsed_v1';
    const LS_CACHE_KEY = 'nekohouseVideoFilterCache_v1';
    const CACHE_TTL = 15 * 60 * 1000;
    const MAX_THUMBNAIL_RETRIES = 2;
    const THUMBNAIL_RETRY_DELAY = 1000;
    const VIDEO_LOAD_TIMEOUT = 10000;
    let currentDomain = window.location.hostname;
    let allFoundVideoUrls = [];
    let mediaIntersectionObserver = null;
    let isPanelCollapsed = false;
    let isFiltering = false;
    const thumbnailRetryMap = new Map();
    const failedThumbnails = new Set();
    let totalMediaToLoad = 0;
    let mediaLoadedCount = 0;
    let allMediaLoadedShown = false;
    const uiContainer = document.createElement('div');
    uiContainer.id = 'video-filter-ui';
    Object.assign(uiContainer.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#2c2c2e',
        color: '#e0e0e0',
        border: '1px solid #444444',
        padding: '12px',
        zIndex: '9999',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        borderRadius: '4px',
        transition: 'width 0.2s ease-in-out, height 0.2s ease-in-out, padding 0.2s ease-in-out'
    });
    const collapseButton = document.createElement('button');
    collapseButton.id = 'video-filter-collapse-button';
    collapseButton.innerHTML = '»';
    collapseButton.title = 'Collapse/Expand Panel';
    collapseButton.setAttribute('aria-label', 'Collapse or Expand Filter Panel');
    Object.assign(collapseButton.style, {
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        width: '25px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        fontSize: '16px',
        backgroundColor: '#4a4a4c',
        color: '#f0f0f0',
        border: '1px solid #555555',
        borderRadius: '3px',
        cursor: 'pointer',
        zIndex: '1'
    });
    const panelMainContent = document.createElement('div');
    panelMainContent.id = 'video-filter-main-content';
    panelMainContent.style.marginLeft = '30px';
    const pageInputLabel = document.createElement('span');
    pageInputLabel.textContent = 'Page: ';
    pageInputLabel.style.marginRight = '8px';
    const pageInput = document.createElement('input');
    pageInput.type = 'number';
    pageInput.id = 'video-filter-page-input';
    pageInput.value = '1';
    pageInput.min = '1';
    pageInput.style.width = '60px';
    pageInput.style.marginRight = '12px';
    pageInput.style.padding = '6px 8px';
    pageInput.style.backgroundColor = '#1e1e1e';
    pageInput.style.color = '#e0e0e0';
    pageInput.style.border = '1px solid #555555';
    pageInput.style.borderRadius = '3px';
    const filterButton = document.createElement('button');
    filterButton.id = 'video-filter-button';
    filterButton.textContent = 'Filter Videos/GIFs';
    filterButton.setAttribute('aria-label', 'Filter Videos and GIFs on Current Page');
    const copyUrlsButton = document.createElement('button');
    copyUrlsButton.id = 'video-copy-urls-button';
    copyUrlsButton.textContent = 'Copy URLs';
    copyUrlsButton.disabled = true;
    copyUrlsButton.setAttribute('aria-label', 'Copy URLs of Filtered Media');
    const statusMessage = document.createElement('div');
    statusMessage.id = 'video-filter-status';
    Object.assign(statusMessage.style, {
        marginTop: '8px',
        fontSize: '12px',
        minHeight: '15px',
        color: '#cccccc'
    });
    const baseButtonBg = '#3a3a3c';
    const hoverButtonBg = '#4a4a4c';
    const disabledButtonBg = '#303030';
    const disabledButtonColor = '#777777';
    function styleButton(button, disabled = false) {
        if (disabled) {
            button.style.backgroundColor = disabledButtonBg;
            button.style.color = disabledButtonColor;
            button.style.cursor = 'default';
        } else {
            button.style.backgroundColor = baseButtonBg;
            button.style.color = '#f0f0f0';
            button.style.cursor = 'pointer';
        }
        Object.assign(button.style, {
            marginRight: '8px',
            padding: '6px 12px',
            border: '1px solid #555555',
            borderRadius: '3px'
        });
    }
    [filterButton, copyUrlsButton].forEach(btn => {
        styleButton(btn, btn.disabled);
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled) btn.style.backgroundColor = hoverButtonBg;
        });
        btn.addEventListener('mouseleave', () => {
            if (!btn.disabled) btn.style.backgroundColor = baseButtonBg;
        });
    });
    collapseButton.addEventListener('mouseenter', () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) {
            collapseButton.style.backgroundColor = hoverButtonBg;
        }
    });
    collapseButton.addEventListener('mouseleave', () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) {
            collapseButton.style.backgroundColor = '#4a4a4c';
        }
    });
    panelMainContent.appendChild(pageInputLabel);
    panelMainContent.appendChild(pageInput);
    panelMainContent.appendChild(filterButton);
    panelMainContent.appendChild(copyUrlsButton);
    panelMainContent.appendChild(statusMessage);
    uiContainer.appendChild(collapseButton);
    uiContainer.appendChild(panelMainContent);
    document.body.appendChild(uiContainer);
    const cache = {
        get: function(key) {
            try {
                const item = localStorage.getItem(`${LS_CACHE_KEY}_${key}`);
                if (!item) return null;
                const { data, timestamp } = JSON.parse(item);
                if (Date.now() - timestamp > CACHE_TTL) {
                    this.delete(key);
                    return null;
                }
                return data;
            } catch (e) {
                return null;
            }
        },
        set: function(key, data) {
            try {
                const item = JSON.stringify({
                    data: data,
                    timestamp: Date.now()
                });
                localStorage.setItem(`${LS_CACHE_KEY}_${key}`, item);
            } catch (e) {
            }
        },
        delete: function(key) {
            try {
                localStorage.removeItem(`${LS_CACHE_KEY}_${key}`);
            } catch (e) {
            }
        }
    };
    function togglePanelCollapse() {
        isPanelCollapsed = !isPanelCollapsed;
        if (isPanelCollapsed) {
            panelMainContent.style.display = 'none';
            collapseButton.innerHTML = '«';
            uiContainer.style.width = '41px';
            uiContainer.style.height = '80px';
            uiContainer.style.padding = '0';
        } else {
            panelMainContent.style.display = 'block';
            collapseButton.innerHTML = '»';
            uiContainer.style.width = '';
            uiContainer.style.height = '';
            uiContainer.style.padding = '12px';
        }
        localStorage.setItem(LS_COLLAPSE_KEY, isPanelCollapsed.toString());
    }
    function setupMediaIntersectionObserver() {
        if (mediaIntersectionObserver) {
            mediaIntersectionObserver.disconnect();
        }
        mediaIntersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const mediaId = element.dataset.mediaId || Math.random().toString(36).substr(2, 9);
                    if (!thumbnailRetryMap.has(mediaId)) {
                        thumbnailRetryMap.set(mediaId, 0);
                    }
                    if (failedThumbnails.has(mediaId)) {
                        mediaIntersectionObserver.unobserve(element);
                        return;
                    }
                    if (element.tagName === 'VIDEO') {
                        const sourceElement = element.querySelector('source[data-src]');
                        if (sourceElement) {
                            const mediaUrl = sourceElement.getAttribute('data-src');
                            setupMediaErrorHandling(element, mediaId, mediaUrl);
                            const loadTimeout = setTimeout(() => {
                                if (!element.hasAttribute('data-loaded')) {
                                    handleMediaLoadError(element, mediaId, mediaUrl, 'Timeout loading video');
                                }
                            }, VIDEO_LOAD_TIMEOUT);
                            element.dataset.loadTimeout = loadTimeout;
                            sourceElement.setAttribute('src', mediaUrl);
                            element.load();
                            sourceElement.removeAttribute('data-src');
                            mediaIntersectionObserver.unobserve(element);
                        }
                    } else if (element.tagName === 'IMG' && element.classList.contains('lazy-load-gif')) {
                        const mediaUrl = element.getAttribute('data-src');
                        if (mediaUrl) {
                            setupMediaErrorHandling(element, mediaId, mediaUrl);
                            const loadTimeout = setTimeout(() => {
                                if (!element.hasAttribute('data-loaded')) {
                                    handleMediaLoadError(element, mediaId, mediaUrl, 'Timeout loading GIF');
                                }
                            }, VIDEO_LOAD_TIMEOUT);
                            element.dataset.loadTimeout = loadTimeout;
                            element.setAttribute('src', mediaUrl);
                            element.removeAttribute('data-src');
                            mediaIntersectionObserver.unobserve(element);
                        }
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        });
    }
    function setupMediaErrorHandling(element, mediaId, mediaUrl) {
        element.onerror = null;
        element.onload = null;
        element.onloadeddata = null;
        element.onerror = function() {
            const errorDetails = element.error ? element.error.message : 'Unknown media error';
            handleMediaLoadError(element, mediaId, mediaUrl, errorDetails);
        };
        if (element.tagName === 'VIDEO') {
            element.onloadeddata = function() {
                clearTimeout(element.dataset.loadTimeout);
                element.setAttribute('data-loaded', 'true');
                mediaLoadedCount++;
                if (!allMediaLoadedShown && totalMediaToLoad > 0 && mediaLoadedCount >= totalMediaToLoad) {
                    showAllMediaLoadedMessage();
                }
            };
        } else if (element.tagName === 'IMG') {
            element.onload = function() {
                clearTimeout(element.dataset.loadTimeout);
                element.setAttribute('data-loaded', 'true');
                mediaLoadedCount++;
                if (!allMediaLoadedShown && totalMediaToLoad > 0 && mediaLoadedCount >= totalMediaToLoad) {
                    showAllMediaLoadedMessage();
                }
            };
        }
    }
    function showAllMediaLoadedMessage() {
        if (allMediaLoadedShown) return;
        allMediaLoadedShown = true;
        showStatus('All media loaded successfully!', 'success');
    }
    function handleMediaLoadError(element, mediaId, mediaUrl, errorDetails) {
        clearTimeout(element.dataset.loadTimeout);
        const retryCount = thumbnailRetryMap.get(mediaId) || 0;
        if (retryCount >= MAX_THUMBNAIL_RETRIES) {
            failedThumbnails.add(mediaId);
            showThumbnailWarning(element, mediaUrl, `Failed after ${MAX_THUMBNAIL_RETRIES} retries: ${errorDetails}`);
            mediaLoadedCount++;
            if (!allMediaLoadedShown && totalMediaToLoad > 0 && mediaLoadedCount >= totalMediaToLoad) {
                showAllMediaLoadedMessage();
            }
            console.error(`Media load failed: ${mediaUrl} - ${errorDetails}`);
            return;
        }
        thumbnailRetryMap.set(mediaId, retryCount + 1);
        const warningMsg = `Retry ${retryCount + 1}/${MAX_THUMBNAIL_RETRIES} for media`;
        showStatus(warningMsg, 'warning');
        const delay = Math.min(THUMBNAIL_RETRY_DELAY * (retryCount + 1), 5000);
        setTimeout(() => {
            if (!failedThumbnails.has(mediaId) && element.isConnected) {
                if (element.tagName === 'VIDEO') {
                    const sourceElement = element.querySelector('source');
                    if (sourceElement) {
                        sourceElement.setAttribute('src', '');
                        sourceElement.setAttribute('src', mediaUrl);
                        element.load();
                        const newTimeout = setTimeout(() => {
                            if (!element.hasAttribute('data-loaded')) {
                                handleMediaLoadError(element, mediaId, mediaUrl, 'Retry timeout');
                            }
                        }, VIDEO_LOAD_TIMEOUT);
                        element.dataset.loadTimeout = newTimeout;
                    }
                } else if (element.tagName === 'IMG') {
                    element.setAttribute('src', '');
                    element.setAttribute('src', mediaUrl);
                    const newTimeout = setTimeout(() => {
                        if (!element.hasAttribute('data-loaded')) {
                            handleMediaLoadError(element, mediaId, mediaUrl, 'Retry timeout');
                        }
                    }, VIDEO_LOAD_TIMEOUT);
                    element.dataset.loadTimeout = newTimeout;
                }
            }
        }, delay);
    }
    function showThumbnailWarning(element, mediaUrl, message) {
        const warningOverlay = document.createElement('div');
        warningOverlay.className = 'thumbnail-warning-overlay';
        Object.assign(warningOverlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffcc00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            fontSize: '12px',
            zIndex: '10',
            pointerEvents: 'none'
        });
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.setAttribute('aria-label', 'Retry Loading Media');
        Object.assign(retryButton.style, {
            backgroundColor: '#4a4a4c',
            color: '#f0f0f0',
            border: '1px solid #555555',
            borderRadius: '3px',
            padding: '4px 8px',
            marginTop: '8px',
            cursor: 'pointer',
            pointerEvents: 'auto'
        });
        retryButton.onclick = function(e) {
            e.stopPropagation();
            warningOverlay.remove();
            const mediaId = element.dataset.mediaId || Math.random().toString(36).substr(2, 9);
            thumbnailRetryMap.delete(mediaId);
            failedThumbnails.delete(mediaId);
            element.removeAttribute('data-loaded');
            if (element.tagName === 'VIDEO') {
                const sourceElement = element.querySelector('source');
                if (sourceElement) {
                    sourceElement.setAttribute('src', '');
                    sourceElement.setAttribute('src', mediaUrl);
                    element.load();
                }
            } else if (element.tagName === 'IMG') {
                element.setAttribute('src', '');
                element.setAttribute('src', mediaUrl);
            }
            showStatus('Manual retry initiated', 'info');
        };
        warningOverlay.innerHTML = `
            <div style="max-width: 100%;">
                <div style="color: #ff6b6b; margin-bottom: 5px; font-weight: bold;">Media Failed</div>
                <div style="font-size: 11px; margin-bottom: 10px; color: #cccccc;">${message}</div>
            </div>
        `;
        const container = warningOverlay.querySelector('div');
        container.appendChild(retryButton);
        if (getComputedStyle(element.parentElement).position === 'static') {
            element.parentElement.style.position = 'relative';
        }
        element.parentElement.appendChild(warningOverlay);
    }
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        switch (type) {
            case 'error':
                statusMessage.style.color = '#ff6b6b';
                break;
            case 'success':
                statusMessage.style.color = '#76c7c0';
                break;
            case 'warning':
                statusMessage.style.color = '#ffcc00';
                break;
            case 'info':
            default:
                statusMessage.style.color = '#cccccc';
                break;
        }
        if (type === 'success' && message.includes("Copied")) {
            setTimeout(() => {
                if (statusMessage.textContent === message) {
                    statusMessage.textContent = '';
                    statusMessage.style.color = '#cccccc';
                }
            }, 3000);
        }
    }
    function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        const postDetailMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)\/post\/([^/]+)$/);
        if (pathname === '/posts' && query) {
            return {
                type: 'global_search',
                query: query
            };
        }
        if (pathname === '/posts') {
            return {
                type: 'global_search',
                query: null
            };
        }
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
                query: query
            };
        }
        if (postDetailMatch) {
            return {
                type: 'post_detail',
                service: postDetailMatch[1],
                userId: postDetailMatch[2],
                postId: postDetailMatch[3]
            };
        }
        return null;
    }
    function buildPageUrl(context, offset) {
        let baseUrl = `https://${currentDomain}/${context.service}/user/${context.userId}`;
        let queryParams = [`o=${offset}`];
        switch (context.type) {
            case 'profile':
                return `${baseUrl}?${queryParams.join('&')}`;
            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseUrl}?${queryParams.join('&')}`;
            case 'global_search':
                baseUrl = `https://${currentDomain}/posts`;
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseUrl}?${queryParams.join('&')}`;
            default:
                return null;
        }
    }
    function fetchHtml(pageUrl) {
        const cachedHtml = cache.get(pageUrl);
        if (cachedHtml) {
            return Promise.resolve(cachedHtml);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: pageUrl,
                headers: {
                    "Accept": "text/html",
                    "Referer": window.location.href,
                    "User-Agent": navigator.userAgent
                },
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        cache.set(pageUrl, resp.responseText);
                        resolve(resp.responseText);
                    } else {
                        reject(`HTML request failed for ${pageUrl}: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`HTML request error for ${pageUrl}: ${resp.statusText || 'Network error'}`),
                ontimeout: () => reject(`HTML request timeout for ${pageUrl}`),
                timeout: 30000
            });
        });
    }
    function isVideoFile(filenameOrPath) {
        if (!filenameOrPath) return false;
        const lowerName = filenameOrPath.toLowerCase();
        const extension = lowerName.split('.').pop();
        return VIDEO_EXTENSIONS.has(extension);
    }
    function isGifFile(filenameOrPath) {
        if (!filenameOrPath) return false;
        const lowerName = filenameOrPath.toLowerCase();
        return lowerName.endsWith('.gif');
    }
    function extractPostsFromHtml(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const postElements = doc.querySelectorAll('.post-card.post-card--scrape');
        const posts = [];
        postElements.forEach(postElement => {
            const linkElement = postElement.querySelector('a');
            if (!linkElement) return;
            const postUrl = linkElement.getAttribute('href');
            const titleElement = postElement.querySelector('.post-card__header');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const timeElement = postElement.querySelector('time');
            const dateTime = timeElement ? timeElement.getAttribute('datetime') : '';
            const imgElement = postElement.querySelector('.post-card__image');
            const thumbnailUrl = imgElement ? imgElement.getAttribute('src') : '';
            const postIdMatch = postUrl.match(/\/post\/(\d+)/);
            const postId = postIdMatch ? postIdMatch[1] : '';
            posts.push({
                id: postId,
                title: title,
                published: dateTime,
                postUrl: `https://${currentDomain}${postUrl}`,
                thumbnailUrl: thumbnailUrl ? `https://${currentDomain}${thumbnailUrl}` : null,
            });
        });
        return posts;
    }
    async function processSinglePost(post) {
        const cacheKey = `post_${post.id}`;
        const cachedMedia = cache.get(cacheKey);
        if (cachedMedia) return cachedMedia;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: post.postUrl,
                headers: {
                    "Accept": "text/html",
                    "Referer": window.location.href,
                    "User-Agent": navigator.userAgent
                },
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        const html = resp.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const mediaList = [];
                        // Video detection
                        const videoElements = doc.querySelectorAll('video.post__video, video#nkh-player1, video[src*=".mp4"], video[src*=".webm"], video[src*=".mov"]');
                        videoElements.forEach(videoElement => {
                            const sourceElement = videoElement.querySelector('source');
                            const videoSrc = sourceElement ? sourceElement.getAttribute('src') : videoElement.getAttribute('src');
                            if (videoSrc) {
                                const fullUrl = videoSrc.startsWith('http') ? videoSrc : `https://${currentDomain}${videoSrc}`;
                                mediaList.push({ type: 'video', url: fullUrl });
                            }
                        });
                        // Media detection in attachments
                        const attachmentsList = doc.querySelector('.scrape__attachments');
                        if (attachmentsList) {
                            const attachmentLinks = attachmentsList.querySelectorAll('a');
                            attachmentLinks.forEach(link => {
                                const href = link.getAttribute('href');
                                if (href) {
                                    const fullUrl = href.startsWith('http') ? href : `https://${currentDomain}${href}`;
                                    if (isGifFile(href)) {
                                        mediaList.push({ type: 'gif', url: fullUrl });
                                    } else if (isVideoFile(href)) {
                                        mediaList.push({ type: 'video', url: fullUrl });
                                    }
                                }
                            });
                        }
                        // GIF detection in files section
                        const filesSection = doc.querySelector('.scrape__files');
                        if (filesSection) {
                            const gifImages = filesSection.querySelectorAll('img[src$=".gif"]');
                            gifImages.forEach(img => {
                                const src = img.getAttribute('src');
                                if (src) {
                                    const fullUrl = src.startsWith('http') ? src : `https://${currentDomain}${src}`;
                                    mediaList.push({ type: 'gif', url: fullUrl });
                                }
                            });
                        }
                        const result = mediaList.length > 0 ? mediaList : null;
                        if (result) {
                            cache.set(cacheKey, result);
                        }
                        resolve(result);
                    } else {
                        reject(`Post request failed: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`Post request error: ${resp.statusText || 'Network error'}`),
                ontimeout: () => reject(`Post request timeout`),
                timeout: 15000
            });
        });
    }
    function createPostCardHtml(post, mediaList) {
        const postDate = new Date(post.published || Date.now());
        const formattedDate = postDate.toLocaleString();
        const dateTimeAttr = postDate.toISOString();
        let displayTitle = post.title || 'No Title';
        if (displayTitle.length > SUBSTRING_TITLE_LENGTH) {
            displayTitle = displayTitle.substring(0, SUBSTRING_TITLE_LENGTH) + '...';
        }
        let mediaHtml = '';
        let hasMultiple = mediaList.length > 1;
        const firstMedia = mediaList[0];
        const mediaId = `media_${post.id}`;
        if (firstMedia.type === 'video') {
            mediaHtml = `
                <div style="text-align: center; margin-bottom: 5px; background-color: #000; position: relative;">
                    <video class="lazy-load-video" controls preload="none" width="100%" style="max-height: 300px; display: block;" data-media-id="${mediaId}">
                        <source data-src="${firstMedia.url}" type="video/mp4">
                    </video>
                </div>`;
        } else if (firstMedia.type === 'gif') {
            mediaHtml = `
                <div style="text-align: center; margin-bottom: 5px; background-color: #000; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                    <img class="lazy-load-gif" data-src="${firstMedia.url}" alt="GIF" style="width: 100%; height: auto; max-height: 300px; object-fit: contain; display: block;" data-media-id="${mediaId}">
                </div>`;
        }
        let footerExtra = hasMultiple ? '<div style="font-size: 11px; color: #999;">(Multiple media items)</div>' : '';
        return `
        <article class="post-card post-card--preview">
          <a class="fancy-link fancy-link--nekohouse" href="${post.postUrl}" target="_blank" rel="noopener noreferrer">
           <header class="post-card__header" title="${displayTitle.replace(/"/g, '&quot;')}">${displayTitle}</header>
           ${mediaHtml}
           <footer class="post-card__footer">
             <div>
                <div>
                  <time datetime="${dateTimeAttr}">${formattedDate}</time>
                </div>
                ${footerExtra}
              </div>
            </footer>
          </a>
        </article>`;
    }
    async function executeFilterOperation() {
        const pageNum = parseInt(pageInput.value, 10);
        if (isNaN(pageNum) || pageNum < 1) {
            showStatus('Please enter a valid page number (1 or higher).', 'error');
            return;
        }
        const context = determinePageContext();
        if (!context || context.type === 'post_detail') {
            showStatus('Filtering is only available on user profile or search pages.', 'error');
            return;
        }
        const postListContainer = document.querySelector('.card-list__items');
        if (!postListContainer) {
            showStatus('Post container not found.', 'error');
            return;
        }
        postListContainer.style.setProperty('--card-size', '350px');
        postListContainer.innerHTML = '';
        document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(menu => {
            menu.style.display = 'none';
        });
        const paginatorInfo = document.querySelector('.paginator > small, .content > div > small.subtle-text');
        if (paginatorInfo) {
            paginatorInfo.textContent = `Filtering page ${pageNum}...`;
        }
        filterButton.textContent = 'Processing...';
        showStatus(`Loading page ${pageNum}...`, 'info');
        try {
            const offset = (pageNum - 1) * 50;
            const pageUrl = buildPageUrl(context, offset);
            if (!pageUrl) {
                throw new Error('Could not build page URL');
            }
            const html = await fetchHtml(pageUrl);
            let posts = extractPostsFromHtml(html);
            if (posts.length === 0) {
                showStatus(`No posts found on page ${pageNum}.`, 'info');
                if (paginatorInfo) {
                    paginatorInfo.textContent = `No posts on page ${pageNum}.`;
                }
                return;
            }
            posts.forEach(post => {
                post.service = context.service || '';
                post.user = context.userId || '';
            });
            const fragment = document.createDocumentFragment();
            let processedCount = 0;
            let foundMediaCount = 0;
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                showStatus(`Checking post ${i + 1}/${posts.length} for media...`, 'info');
                const delay = 350;
                await new Promise(resolve => setTimeout(resolve, delay));
                const mediaList = await processSinglePost(post);
                processedCount++;
                if (mediaList && mediaList.length > 0) {
                    mediaList.forEach(media => {
                        allFoundVideoUrls.push(media.url);
                        if (media.type === 'video' || media.type === 'gif') {
                            totalMediaToLoad++;
                        }
                    });
                    const cardHtml = createPostCardHtml(post, mediaList);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cardHtml;
                    fragment.appendChild(tempDiv.firstElementChild);
                    foundMediaCount++;
                }
                const progress = Math.floor((processedCount / posts.length) * 100);
                showStatus(`Progress: ${progress}% (${foundMediaCount} media found)`, 'info');
            }
            if (fragment.children.length > 0) {
                postListContainer.appendChild(fragment);
                postListContainer.querySelectorAll('video.lazy-load-video, img.lazy-load-gif').forEach(el => {
                    if (el.hasAttribute('data-src') || el.querySelector('source[data-src]')) {
                        mediaIntersectionObserver.observe(el);
                    }
                });
                showStatus(`Found ${foundMediaCount} media posts on page ${pageNum}.`, 'success');
                styleButton(copyUrlsButton, false);
                copyUrlsButton.disabled = false;
            } else {
                showStatus(`No video/GIF posts found on page ${pageNum}.`, 'info');
                styleButton(copyUrlsButton, true);
                copyUrlsButton.disabled = true;
            }
            if (paginatorInfo) {
                paginatorInfo.textContent = `Showing ${foundMediaCount} media posts from page ${pageNum}.`;
            }
        } catch (error) {
            console.error('Filter error:', error);
            showStatus(`Error: ${error.message || 'Unknown error'}`, 'error');
            if (paginatorInfo) {
                paginatorInfo.textContent = '';
            }
            document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(menu => {
                menu.style.display = '';
            });
        } finally {
            isFiltering = false;
            filterButton.textContent = 'Filter Videos/GIFs';
            styleButton(filterButton, false);
            filterButton.disabled = false;
        }
    }
    function handleFilter() {
        if (isFiltering) {
            showStatus('Already filtering, please wait...', 'warning');
            return;
        }
        allFoundVideoUrls = [];
        thumbnailRetryMap.clear();
        failedThumbnails.clear();
        totalMediaToLoad = 0;
        mediaLoadedCount = 0;
        allMediaLoadedShown = false;
        setupMediaIntersectionObserver();
        isFiltering = true;
        filterButton.textContent = 'Starting...';
        styleButton(filterButton, true);
        filterButton.disabled = true;
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        showStatus('Preparing filter...', 'info');
        const delay = 500;
        setTimeout(() => {
            executeFilterOperation();
        }, delay);
    }
    function handleCopyUrls() {
        if (allFoundVideoUrls.length === 0) {
            showStatus("No URLs to copy.", 'error');
            return;
        }
        const uniqueUrls = [...new Set(allFoundVideoUrls)];
        GM_setClipboard(uniqueUrls.join('\n'));
        copyUrlsButton.textContent = `Copied ${uniqueUrls.length} URLs!`;
        showStatus(`Copied ${uniqueUrls.length} unique media URLs!`, 'success');
        setTimeout(() => {
            copyUrlsButton.textContent = 'Copy URLs';
        }, 3000);
    }
    function handleUrlChangeAndSetStatus() {
        const currentContext = determinePageContext();
        allFoundVideoUrls = [];
        thumbnailRetryMap.clear();
        failedThumbnails.clear();
        totalMediaToLoad = 0;
        mediaLoadedCount = 0;
        allMediaLoadedShown = false;
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        if (mediaIntersectionObserver) {
            mediaIntersectionObserver.disconnect();
        }
        if (currentContext && currentContext.type !== 'post_detail') {
            showStatus("Ready to filter current page.", 'info');
            styleButton(filterButton, false);
            filterButton.disabled = false;
        } else {
            showStatus("Filter disabled on this page.", 'error');
            styleButton(filterButton, true);
            filterButton.disabled = true;
        }
    }
    function loadSettings() {
        const savedPage = localStorage.getItem('nekohouse_last_page');
        if (savedPage) {
            pageInput.value = savedPage;
        }
    }
    function saveSettings() {
        localStorage.setItem('nekohouse_last_page', pageInput.value);
    }
    filterButton.addEventListener('click', handleFilter);
    copyUrlsButton.addEventListener('click', handleCopyUrls);
    collapseButton.addEventListener('click', togglePanelCollapse);
    pageInput.addEventListener('change', saveSettings);
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('custompushstate'));
    };
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('customreplacestate'));
    };
    window.addEventListener('popstate', handleUrlChangeAndSetStatus);
    window.addEventListener('custompushstate', handleUrlChangeAndSetStatus);
    window.addEventListener('customreplacestate', handleUrlChangeAndSetStatus);
    const initiallyCollapsed = localStorage.getItem(LS_COLLAPSE_KEY) === 'true';
    if (initiallyCollapsed) {
        togglePanelCollapse();
    }
    loadSettings();
    handleUrlChangeAndSetStatus();
    window.addEventListener('beforeunload', () => {
        if (mediaIntersectionObserver) {
            mediaIntersectionObserver.disconnect();
        }
        document.querySelectorAll('video.lazy-load-video, img.lazy-load-gif').forEach(el => {
            if (el.dataset.loadTimeout) {
                clearTimeout(el.dataset.loadTimeout);
            }
        });
    });
})();