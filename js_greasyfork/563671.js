// ==UserScript==
// @name          Tampermonkey Video Filter v4.1
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Filters posts with videos/GIFs using dynamic content detection. Extended video format support (mkv, avi, wmv, etc.), GIF thumbnails, caching, and performance optimizations.
// @author       harryangstrom, xdegeneratex, remuru, [YourUsername]
// @match        https://*.coomer.party/*
// @match        https://*.coomer.su/*
// @match        https://*.coomer.st/*
// @match        https://*.kemono.su/*
// @match        https://*.kemono.party/*
// @match        https://*.kemono.cr/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563671/Tampermonkey%20Video%20Filter%20v41.user.js
// @updateURL https://update.greasyfork.org/scripts/563671/Tampermonkey%20Video%20Filter%20v41.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Expanded video extensions list
    const VIDEO_EXTENSIONS = new Set([
        'mp4', 'm4v', 'mov', 'webm', 'avi', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg',
        'm2ts', 'mts', 'ogv', 'qt', 'rm', 'rmvb', 'vob', 'asf', '3gp', 'f4v',
        'mxf', 'swf', 'ts', 'm4a', 'm4b', 'm4p', 'm4r', 'm4v'
    ]);
    
    // GIF extension
    const GIF_EXTENSION = 'gif';
    
    // Image extensions
    const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'bmp', 'webp', 'svg']);
    
    // Performance constants
    const POSTS_PER_PAGE = 50;
    const API_DELAY = 1500; // Increased to avoid rate limiting
    const MAX_CONCURRENT_REQUESTS = 2; // Limit concurrent API requests
    const SUBSTRING_TITLE_LENGTH = 100;
    const LS_COLLAPSE_KEY = 'videoFilterPanelCollapsed_v1';
    const LS_PAGES_KEY = 'videoFilterPageRange_v1';
    const LS_CACHE_KEY = 'videoFilterCache_v1';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
    
    let currentDomain = window.location.hostname;
    let allFoundVideoUrls = [];
    let videoIntersectionObserver = null;
    let isPanelCollapsed = false;
    let isFiltering = false; // Prevent multiple filter operations
    let activeRequests = 0; // Track active requests
    let requestQueue = []; // Queue for API requests
    
    // Create UI container
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
    
    // Collapse button
    const collapseButton = document.createElement('button');
    collapseButton.id = 'video-filter-collapse-button';
    collapseButton.innerHTML = '»';
    collapseButton.title = 'Collapse/Expand Panel';
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
    
    // Main content panel
    const panelMainContent = document.createElement('div');
    panelMainContent.id = 'video-filter-main-content';
    panelMainContent.style.marginLeft = '30px';
    
    // Page range input
    const pageRangeInput = document.createElement('input');
    pageRangeInput.type = 'text';
    pageRangeInput.id = 'video-filter-page-range';
    pageRangeInput.value = '1';
    pageRangeInput.placeholder = 'e.g., 1, 2-5, 7';
    Object.assign(pageRangeInput.style, {
        width: '100px',
        marginRight: '8px',
        padding: '6px 8px',
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        border: '1px solid #555555',
        borderRadius: '3px'
    });
    
    // Filter button
    const filterButton = document.createElement('button');
    filterButton.id = 'video-filter-button';
    filterButton.textContent = 'Filter Videos/GIFs';
    
    // Copy URLs button
    const copyUrlsButton = document.createElement('button');
    copyUrlsButton.id = 'video-copy-urls-button';
    copyUrlsButton.textContent = 'Copy URLs';
    copyUrlsButton.disabled = true;
    
    // Status message
    const statusMessage = document.createElement('div');
    statusMessage.id = 'video-filter-status';
    Object.assign(statusMessage.style, {
        marginTop: '8px',
        fontSize: '12px',
        minHeight: '15px',
        color: '#cccccc'
    });
    
    // Button styling
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
    
    // Apply button styling
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
    
    // Assemble UI
    panelMainContent.appendChild(document.createTextNode('Pages: '));
    panelMainContent.appendChild(pageRangeInput);
    panelMainContent.appendChild(filterButton);
    panelMainContent.appendChild(copyUrlsButton);
    panelMainContent.appendChild(statusMessage);
    uiContainer.appendChild(collapseButton);
    uiContainer.appendChild(panelMainContent);
    document.body.appendChild(uiContainer);
    
    // Cache management
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
                console.warn('Video Filter: Cache set failed', e);
            }
        },
        
        delete: function(key) {
            try {
                localStorage.removeItem(`${LS_CACHE_KEY}_${key}`);
            } catch (e) {
                console.warn('Video Filter: Cache delete failed', e);
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
    
    function setupVideoIntersectionObserver() {
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
        
        videoIntersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const videoElement = entry.target;
                    const sourceElement = videoElement.querySelector('source[data-src]');
                    if (sourceElement) {
                        const videoUrl = sourceElement.getAttribute('data-src');
                        sourceElement.setAttribute('src', videoUrl);
                        videoElement.load();
                        sourceElement.removeAttribute('data-src');
                        videoIntersectionObserver.unobserve(videoElement);
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        });
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
    
    function parsePageRange(inputStr) {
        const pages = new Set();
        if (!inputStr || inputStr.trim() === '') {
            showStatus('Error: Page range cannot be empty.', 'error');
            return null;
        }
        
        const parts = inputStr.split(',');
        for (const part of parts) {
            const trimmedPart = part.trim();
            if (trimmedPart.includes('-')) {
                const [startStr, endStr] = trimmedPart.split('-').map(s => s.trim());
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
                    showStatus(`Error: Invalid range "${trimmedPart}". Start must be > 0 and end >= start.`, 'error');
                    return null;
                }
                for (let i = start; i <= end; i++) pages.add(i);
            } else {
                const page = parseInt(trimmedPart, 10);
                if (isNaN(page) || page <= 0) {
                    showStatus(`Error: Invalid page number "${trimmedPart}". Must be > 0.`, 'error');
                    return null;
                }
                pages.add(page);
            }
        }
        
        if (pages.size === 0) {
            showStatus('Error: No valid pages specified.', 'error');
            return null;
        }
        
        return Array.from(pages).sort((a, b) => a - b);
    }
    
    function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        
        // Posts search page - the main issue
        if (pathname === '/posts' && query) {
            return {
                type: 'global_search',
                query: query
            };
        }
        
        // Posts search page without query (shows all posts)
        if (pathname === '/posts') {
            return {
                type: 'global_search',
                query: null
            };
        }
        
        // Popular posts
        if (pathname === '/posts/popular') {
            return {
                type: 'popular_posts',
                date: searchParams.get('date') || 'none',
                period: searchParams.get('period') || 'recent'
            };
        }
        
        // User profile pages
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
                query
            };
        }
        
        console.warn('Video Filter: Unknown page structure for context.', pathname, window.location.search);
        return null;
    }
    
    function buildApiUrl(context, offset) {
        let baseApiUrl = `https://${currentDomain}/api/v1`;
        let queryParams = [`o=${offset}`];
        
        switch (context.type) {
            case 'profile':
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'global_search':
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/posts?${queryParams.join('&')}`;
            case 'popular_posts':
                if (context.date != 'none') queryParams.push(`date=${encodeURIComponent(context.date)}`);
                queryParams.push(`period=${encodeURIComponent(context.period)}`);
                return `${baseApiUrl}/posts/popular?${queryParams.join('&')}`;
            default:
                return null;
        }
    }
    
    function fetchData(apiUrl, useCache = true) {
        // Try cache first
        if (useCache) {
            const cachedData = cache.get(apiUrl);
            if (cachedData) {
                console.log('Video Filter: Using cached data for', apiUrl);
                return Promise.resolve(cachedData);
            }
        }
        
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    "Accept": "text/css",
                    "Referer": window.location.href,
                    "User-Agent": navigator.userAgent,
                    "X-Requested-With": "XMLHttpRequest"
                },
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            const data = JSON.parse(resp.responseText);
                            // Cache successful responses
                            cache.set(apiUrl, data);
                            resolve(data);
                        } catch (e) {
                            reject(`Error parsing JSON from ${apiUrl}: ${e.message}`);
                        }
                    } else {
                        reject(`API request failed for ${apiUrl}: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`API request error for ${apiUrl}: ${resp.statusText || 'Network error'}`),
                ontimeout: () => reject(`API request timeout for ${apiUrl}`),
                timeout: 30000 // 30 second timeout
            });
        });
    }
    
    function processRequestQueue() {
        if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
            return;
        }
        
        const nextRequest = requestQueue.shift();
        activeRequests++;
        
        fetchData(nextRequest.apiUrl, nextRequest.useCache)
            .then(data => {
                nextRequest.resolve(data);
            })
            .catch(error => {
                nextRequest.reject(error);
            })
            .finally(() => {
                activeRequests--;
                setTimeout(processRequestQueue, API_DELAY); // Delay between requests
            });
    }
    
    function queueApiRequest(apiUrl, useCache = true) {
        return new Promise((resolve, reject) => {
            requestQueue.push({
                apiUrl,
                useCache,
                resolve,
                reject
            });
            processRequestQueue();
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
    
    function isImageFile(filenameOrPath) {
        if (!filenameOrPath) return false;
        const lowerName = filenameOrPath.toLowerCase();
        const extension = lowerName.split('.').pop();
        return IMAGE_EXTENSIONS.has(extension);
    }
    
    function getBestMediaUrlFromPost(post) {
        const domain = `https://${currentDomain}/data`;
        
        // Priority 1: Video files
        if (post.file && isVideoFile(post.file.path)) {
            return { type: 'video', url: domain + post.file.path };
        }
        
        // Priority 2: GIF files
        if (post.file && isGifFile(post.file.path)) {
            return { type: 'gif', url: domain + post.file.path };
        }
        
        // Check attachments for videos and gifs
        if (post.attachments) {
            // First check for videos in attachments
            for (const att of post.attachments) {
                if (isVideoFile(att.path)) {
                    return { type: 'video', url: domain + att.path };
                }
            }
            // Then check for gifs in attachments
            for (const att of post.attachments) {
                if (isGifFile(att.path)) {
                    return { type: 'gif', url: domain + att.path };
                }
            }
        }
        
        return null;
    }
    
    function getPostPreviewUrl(post, apiPreviewsEntry) {
        if (apiPreviewsEntry && apiPreviewsEntry.length > 0 && apiPreviewsEntry[0] && apiPreviewsEntry[0].server && apiPreviewsEntry[0].path) {
            return `${apiPreviewsEntry[0].server}${apiPreviewsEntry[0].path}`;
        }
        if (post.file && post.file.path && isImageFile(post.file.path)) return `https://${currentDomain}/data${post.file.path}`;
        if (post.attachments) {
            for (const attachment of post.attachments) {
                if (attachment.path && isImageFile(attachment.path)) return `https://${currentDomain}/data${attachment.path}`;
            }
        }
        return null;
    }
    
    function createPostCardHtml(post, mediaInfo, previewUrl) {
        const postDate = new Date(post.published || post.added);
        const formattedDate = postDate.toLocaleString();
        const dateTimeAttr = postDate.toISOString();
        const attachmentCount = post.attachments ? post.attachments.length : 0;
        const attachmentText = attachmentCount === 1 ? "1 Attachment" : `${attachmentCount} Attachments`;
        
        let displayTitle = (post.title || '').trim();
        if (!displayTitle && post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            let contentForTitle = (tempDiv.textContent || "").trim();
            if (contentForTitle) {
                displayTitle = contentForTitle.substring(0, SUBSTRING_TITLE_LENGTH) + 
                             (contentForTitle.length > SUBSTRING_TITLE_LENGTH ? '...' : '');
            }
        }
        displayTitle = displayTitle || 'No Title';
        
        const postLink = `/${post.service}/user/${post.user}/post/${post.id}`;
        
        let mediaHtml = '';
        
        if (mediaInfo.type === 'video') {
            const posterAttribute = previewUrl ? `poster="${previewUrl}"` : '';
            mediaHtml = `
                <div style="text-align: center; margin-bottom: 5px; background-color: #000;">
                    <video class="lazy-load-video" controls preload="none" width="100%" style="max-height: 300px; display: block;" ${posterAttribute}>
                        <source data-src="${mediaInfo.url}" type="video/mp4">
                    </video>
                </div>`;
        } else if (mediaInfo.type === 'gif') {
            mediaHtml = `
                <div style="text-align: center; margin-bottom: 5px; background-color: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="${mediaInfo.url}" alt="GIF" style="width: 100%; height: auto; max-height: 300px; object-fit: contain; display: block;">
                </div>`;
        }
        
        return `
        <article class="post-card post-card--preview">
          <a class="fancy-link fancy-link--kemono" href="${postLink}" target="_blank" rel="noopener noreferrer">
           <header class="post-card__header" title="${displayTitle.replace(/"/g, '&quot;')}">${displayTitle}</header>
           ${mediaHtml}
           <footer class="post-card__footer">
             <div>
                <div>
                  <time datetime="${dateTimeAttr}">${formattedDate}</time>
                  <div>${attachmentCount > 0 ? attachmentText : 'No Attachments'}</div>
                </div>
              </div>
            </footer>
          </a>
        </article>`;
    }
    
    async function handleFilter() {
        if (isFiltering) {
            showStatus('Already filtering, please wait...', 'warning');
            return;
        }
        
        showStatus('');
        isFiltering = true;
        filterButton.textContent = 'Filtering...';
        styleButton(filterButton, true);
        filterButton.disabled = true;
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        
        allFoundVideoUrls = [];
        requestQueue = [];
        activeRequests = 0;
        setupVideoIntersectionObserver();
        
        const pagesToFetch = parsePageRange(pageRangeInput.value);
        if (!pagesToFetch) {
            resetFilterButton();
            return;
        }
        
        localStorage.setItem(LS_PAGES_KEY, pageRangeInput.value);
        
        const context = determinePageContext();
        if (!context) {
            showStatus('Error: Page context invalid for filtering.', 'error');
            resetFilterButton();
            return;
        }
        
        const postListContainer = document.querySelector('.card-list__items');
        if (!postListContainer) {
            showStatus('Error: Post container not found.', 'error');
            resetFilterButton();
            return;
        }
        
        // Clear container and set up
        postListContainer.style.setProperty('--card-size', '350px');
        postListContainer.innerHTML = '';
        
        // Hide pagination
        document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(menu => {
            menu.style.display = 'none';
        });
        
        const paginatorInfo = document.querySelector('.paginator > small, .content > div > small.subtle-text');
        if (paginatorInfo) {
            paginatorInfo.textContent = `Filtering posts...`;
        }
        
        let totalVideoPostsFound = 0;
        let totalGifPostsFound = 0;
        let errors = 0;
        const maxErrors = 3; // Stop after too many errors
        
        // Process pages in batches
        for (let i = 0; i < pagesToFetch.length; i++) {
            if (errors >= maxErrors) {
                showStatus('Stopped due to too many errors.', 'error');
                break;
            }
            
            const pageNum = pagesToFetch[i];
            const offset = (pageNum - 1) * POSTS_PER_PAGE;
            const apiUrl = buildApiUrl(context, offset);
            
            if (!apiUrl) {
                showStatus('Error: Could not build API URL.', 'error');
                errors++;
                continue;
            }
            
            filterButton.textContent = `Filtering Page ${i + 1}/${pagesToFetch.length}...`;
            showStatus(`Fetching page ${pageNum}...`, 'info');
            
            try {
                // Use queued request with caching
                const apiResponse = await queueApiRequest(apiUrl, true);
                
                let posts = Array.isArray(apiResponse) ? apiResponse : (apiResponse.results || apiResponse.posts);
                if (!Array.isArray(posts)) {
                    console.warn("Video Filter: Could not extract a valid posts array from API response:", apiResponse);
                    showStatus(`Warning: Unexpected API structure on page ${pageNum}.`, 'warning');
                    continue;
                }
                
                // Process posts
                const fragment = document.createDocumentFragment();
                let pageVideoCount = 0;
                let pageGifCount = 0;
                
                for (const post of posts) {
                    const mediaInfo = getBestMediaUrlFromPost(post);
                    if (mediaInfo) {
                        if (mediaInfo.type === 'video') {
                            totalVideoPostsFound++;
                            pageVideoCount++;
                        } else if (mediaInfo.type === 'gif') {
                            totalGifPostsFound++;
                            pageGifCount++;
                        }
                        
                        allFoundVideoUrls.push(mediaInfo.url);
                        const cardHtml = createPostCardHtml(post, mediaInfo, null);
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = cardHtml;
                        fragment.appendChild(tempDiv.firstElementChild);
                    }
                }
                
                // Append all cards at once for better performance
                if (fragment.children.length > 0) {
                    postListContainer.appendChild(fragment);
                }
                
                // Update status
                const totalFound = totalVideoPostsFound + totalGifPostsFound;
                if (paginatorInfo) {
                    let typeText = '';
                    if (pageVideoCount > 0 && pageGifCount > 0) {
                        typeText = ` (+${pageVideoCount} videos, +${pageGifCount} GIFs)`;
                    } else if (pageVideoCount > 0) {
                        typeText = ` (+${pageVideoCount} videos)`;
                    } else if (pageGifCount > 0) {
                        typeText = ` (+${pageGifCount} GIFs)`;
                    }
                    paginatorInfo.textContent = `Showing ${totalFound} media posts${typeText}.`;
                }
                
            } catch (error) {
                console.error("Video Filter error:", error);
                showStatus(`Error on page ${pageNum}: ${error.message || error}`, 'error');
                errors++;
                
                // Don't wait too long if we're getting errors
                if (errors >= maxErrors) {
                    break;
                }
            }
        }
        
        // Setup lazy loading for video elements
        postListContainer.querySelectorAll('video.lazy-load-video').forEach(videoEl => {
            if (videoEl.querySelector('source[data-src]')) {
                videoIntersectionObserver.observe(videoEl);
            }
        });
        
        finishFiltering(totalVideoPostsFound, totalGifPostsFound);
    }
    
    function resetFilterButton() {
        isFiltering = false;
        filterButton.textContent = 'Filter Videos/GIFs';
        styleButton(filterButton, false);
        filterButton.disabled = false;
    }
    
    function finishFiltering(videoCount, gifCount) {
        isFiltering = false;
        filterButton.textContent = 'Filter Videos/GIFs';
        styleButton(filterButton, false);
        filterButton.disabled = false;
        
        const totalFound = videoCount + gifCount;
        if (totalFound > 0) {
            let statusText = `Filter complete. Found ${totalFound} media posts`;
            if (videoCount > 0 && gifCount > 0) {
                statusText += ` (${videoCount} videos, ${gifCount} GIFs)`;
            } else if (videoCount > 0) {
                statusText += ` (${videoCount} videos)`;
            } else if (gifCount > 0) {
                statusText += ` (${gifCount} GIFs)`;
            }
            statusText += '.';
            showStatus(statusText, 'success');
            styleButton(copyUrlsButton, false);
            copyUrlsButton.disabled = false;
        } else {
            showStatus('Filter complete. No video/GIF posts found.', 'info');
            styleButton(copyUrlsButton, true);
            copyUrlsButton.disabled = true;
        }
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
        console.log("Video Filter: URL change detected or initial load.");
        const currentContext = determinePageContext();
        allFoundVideoUrls = [];
        requestQueue = [];
        activeRequests = 0;
        
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
        
        if (currentContext) {
            showStatus("Filter ready.", 'info');
            styleButton(filterButton, false);
            filterButton.disabled = false;
        } else {
            showStatus("Page context not recognized. Filter disabled.", 'error');
            styleButton(filterButton, true);
            filterButton.disabled = true;
        }
    }
    
    function loadSettings() {
        const savedPages = localStorage.getItem(LS_PAGES_KEY);
        if (savedPages) {
            pageRangeInput.value = savedPages;
        }
    }
    
    // --- SCRIPT INITIALIZATION ---
    
    filterButton.addEventListener('click', handleFilter);
    copyUrlsButton.addEventListener('click', handleCopyUrls);
    collapseButton.addEventListener('click', togglePanelCollapse);
    
    // History state tracking
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
    
    // Initialize
    const initiallyCollapsed = localStorage.getItem(LS_COLLAPSE_KEY) === 'true';
    if (initiallyCollapsed) {
        togglePanelCollapse();
    }
    
    loadSettings();
    handleUrlChangeAndSetStatus();
    
    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
    });

})();