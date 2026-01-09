// ==UserScript==
// @name         Coomer BetterUI
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/mp4box@0.5.2/dist/mp4box.all.min.js
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @require      https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js
// @require      https://cdn.jsdelivr.net/npm/@glidejs/glide@3.6.0/dist/glide.min.js
// @version      3.10.4
// @description  Video thumbnails, modal gallery carousel, avatar placeholders, Pinterest-style layout
// @author       xxxchimp
// @license      MIT
// @match        https://coomer.st/*/user/*
// @match        https://coomer.su/*/user/*
// @match        https://kemono.su/*/user/*
// @match        https://kemono.party/*/user/*
// @match        https://kemono.cr/*/user/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      coomer.st
// @connect      coomer.su
// @connect      kemono.su
// @connect      kemono.party
// @connect      kemono.cr
// @connect      n1.coomer.st
// @connect      n2.coomer.st
// @connect      n3.coomer.st
// @connect      n4.coomer.st
// @connect      n5.coomer.st
// @connect      n6.coomer.st
// @connect      c1.coomer.st
// @connect      c2.coomer.st
// @connect      c3.coomer.st
// @connect      c4.coomer.st
// @connect      c5.coomer.st
// @connect      c6.coomer.st
// @connect      n1.kemono.su
// @connect      n2.kemono.su
// @connect      n3.kemono.su
// @connect      n4.kemono.su
// @connect      api.anthropic.com
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558590/Coomer%20BetterUI.user.js
// @updateURL https://update.greasyfork.org/scripts/558590/Coomer%20BetterUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // CONFIGURATION & SETTINGS
    // =========================================================================

    const DEFAULT_SETTINGS = {
        pauseGifsWhenHidden: true,
        prefixFilenamesWithTitle: false,
        maxFilenamePrefixLength: 40,
        debug: false,
        analyzeMp4Atoms: false,
        // AI thumbnail settings
        aiProvider: 'none', // 'none', 'claude', 'gemini'
        aiAutoFallback: false // Auto-try AI when standard thumbnail fails
    };

    const settings = {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(GM_getValue('betterui_settings', '{}') || '{}')
    };

    const saveSettings = () => GM_setValue('betterui_settings', JSON.stringify(settings));

    // AI API keys stored separately (not in settings object)
    const getAiApiKey = (provider) => GM_getValue(`betterui_ai_key_${provider}`, '');
    const setAiApiKey = (provider, key) => GM_setValue(`betterui_ai_key_${provider}`, key);

    const CONFIG = {
        thumbnailSize: 180,
        seekTime: 2,
        maxConcurrentVideo: 3,
        maxConcurrentApi: 8,
        retryDelay: 200,
        maxVideoSizeForThumbnail: 300 * 1024 * 1024, // 300MB
        maxNonFaststartSize: 20 * 1024 * 1024, // 20MB
        thumbnailCacheMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        thumbnailCacheMaxSize: 500, // Max cached thumbnails
        // AI frame selection config
        aiFrameCount: 6, // Number of frames to extract for AI analysis
        aiFramePositions: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85], // Positions as fraction of video duration
        extensions: {
            video: ['.mp4', '.webm', '.mov', '.m4v', '.mkv', '.avi', '.m3u8'],
            image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'],
            archive: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
            audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
            document: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.psd', '.ai']
        }
    };

    // =========================================================================
    // THUMBNAIL CACHE (IndexedDB via Dexie)
    // =========================================================================

    let thumbnailDb = null;

    /**
     * Initialize IndexedDB for thumbnail caching
     */
    async function initThumbnailCache() {
        if (typeof Dexie === 'undefined') {
            debugLog('Dexie not available, caching disabled');
            return false;
        }

        try {
            thumbnailDb = new Dexie('BetterUIThumbnails');
            thumbnailDb.version(1).stores({
                thumbnails: 'url, dataUrl, duration, createdAt'
            });
            await thumbnailDb.open();
            debugLog('Thumbnail cache initialized');

            // Cleanup old entries periodically
            cleanupThumbnailCache();
            return true;
        } catch (e) {
            debugLog('Failed to init thumbnail cache:', e.message);
            thumbnailDb = null;
            return false;
        }
    }

    /**
     * Get cached thumbnail
     */
    async function getCachedThumbnail(url) {
        if (!thumbnailDb) return null;
        try {
            const cached = await thumbnailDb.thumbnails.get(url);
            if (cached) {
                // Check if expired
                if (Date.now() - cached.createdAt > CONFIG.thumbnailCacheMaxAge) {
                    await thumbnailDb.thumbnails.delete(url);
                    return null;
                }
                debugLog('Cache hit:', url.substring(url.lastIndexOf('/') + 1));
                return { dataUrl: cached.dataUrl, duration: cached.duration };
            }
        } catch (e) {
            debugLog('Cache read error:', e.message);
        }
        return null;
    }

    /**
     * Store thumbnail in cache
     */
    async function cacheThumbnail(url, dataUrl, duration) {
        if (!thumbnailDb) return;
        try {
            await thumbnailDb.thumbnails.put({
                url,
                dataUrl,
                duration: duration || 0,
                createdAt: Date.now()
            });
            debugLog('Cached:', url.substring(url.lastIndexOf('/') + 1));
        } catch (e) {
            debugLog('Cache write error:', e.message);
        }
    }

    /**
     * Cleanup old cache entries
     */
    async function cleanupThumbnailCache() {
        if (!thumbnailDb) return;
        try {
            const expiry = Date.now() - CONFIG.thumbnailCacheMaxAge;
            const deleted = await thumbnailDb.thumbnails
                .where('createdAt')
                .below(expiry)
                .delete();
            if (deleted > 0) debugLog(`Cleaned ${deleted} expired cache entries`);

            // Also limit total size
            const count = await thumbnailDb.thumbnails.count();
            if (count > CONFIG.thumbnailCacheMaxSize) {
                const excess = count - CONFIG.thumbnailCacheMaxSize;
                const oldest = await thumbnailDb.thumbnails
                    .orderBy('createdAt')
                    .limit(excess)
                    .toArray();
                await thumbnailDb.thumbnails.bulkDelete(oldest.map(t => t.url));
                debugLog(`Removed ${excess} excess cache entries`);
            }
        } catch (e) {
            debugLog('Cache cleanup error:', e.message);
        }
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    const debugLog = (msg, data = '') => settings.debug && console.log(`[BetterUI] ${msg}`, data);

    /**
     * Create Material Symbols icon HTML
     * @param {string} name - Icon name (e.g., 'close', 'download')
     * @param {string} size - Size class: 'sm', 'md', 'lg' (default: 'md')
     * @param {boolean} filled - Use filled variant
     */
    function icon(name, size = 'md', filled = false) {
        const sizeClass = size === 'md' ? '' : ` icon-${size}`;
        const fillClass = filled ? ' icon-filled' : '';
        return `<span class="material-symbols-rounded${sizeClass}${fillClass}">${name}</span>`;
    }

    /**
     * Detect file type from path
     */
    function getFileType(path) {
        if (!path) return 'other';
        const lowerPath = path.toLowerCase();
        for (const [type, exts] of Object.entries(CONFIG.extensions)) {
            if (exts.some(ext => lowerPath.includes(ext))) return type;
        }
        return 'other';
    }

    const isVideo = path => getFileType(path) === 'video';
    const isImage = path => getFileType(path) === 'image';

    /**
     * Convert relative path to full URL
     */
    function toFullUrl(path, baseUrl) {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('/')) return `${baseUrl}${path}`;
        return `${baseUrl}/data/${path}`;
    }

    /**
     * Sanitise string for use in filenames
     */
    function sanitiseFilename(str, maxLength = 50) {
        if (!str) return '';
        return str
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
            .substring(0, maxLength);
    }

    /**
     * Extract filename from URL
     */
    function getFilenameFromUrl(url, fallback = 'download') {
        try {
            const pathname = new URL(url).pathname;
            const filename = pathname.split('/').pop();
            return filename?.includes('.') ? decodeURIComponent(filename) : fallback;
        } catch {
            return fallback;
        }
    }

    /**
     * Escape HTML entities
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Convert URLs in text to clickable links
     */
    function linkifyText(text) {
        if (!text) return '';
        const escaped = escapeHtml(text);
        return escaped
            .replace(/(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');
    }

    /**
     * Sanitize string for use as filename
     */
    function sanitizeFilename(name) {
        if (!name) return 'untitled';
        return name
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 100);
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.betterui-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `betterui-toast betterui-toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('visible'));

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =========================================================================
    // XHR WRAPPER
    // =========================================================================

    /**
     * Promisified GM_xmlhttpRequest wrapper
     */
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            // Set appropriate Accept header based on response type
            let defaultHeaders = {};
            if (options.responseType === 'json') {
                defaultHeaders['Accept'] = 'text/css';
            } else if (options.responseType === 'arraybuffer' || options.responseType === 'blob') {
                defaultHeaders['Accept'] = '*/*';
            }

            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url,
                responseType: options.responseType || 'text',
                headers: options.headers || defaultHeaders,
                data: options.data || null,
                timeout: options.timeout || 30000,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        debugLog('HTTP error:', response.status, url);
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: (err) => {
                    debugLog('Network error:', url);
                    reject(new Error('Network error'));
                },
                ontimeout: () => {
                    debugLog('Timeout:', url);
                    reject(new Error('Timeout'));
                }
            });
        });
    }

    /**
     * Resolve redirects to get final URL
     */
    async function resolveRedirectUrl(url) {
        try {
            const response = await gmFetch(url, { method: 'HEAD' });
            const finalUrl = response.finalUrl || url;
            if (finalUrl !== url) debugLog('Redirect:', `${url} -> ${finalUrl}`);
            return finalUrl;
        } catch {
            return url;
        }
    }

    /**
     * Get file size via HEAD request
     */
    async function getFileSize(url) {
        try {
            const finalUrl = await resolveRedirectUrl(url);
            const response = await gmFetch(finalUrl, { method: 'HEAD' });
            const contentLength = response.responseHeaders?.match(/content-length:\s*(\d+)/i);
            return contentLength ? parseInt(contentLength[1], 10) : null;
        } catch {
            return null;
        }
    }

    /**
     * Fetch JSON from API
     */
    async function fetchJson(url) {
        const response = await gmFetch(url, { responseType: 'json', timeout: 15000 });
        return response.response;
    }

    // =========================================================================
    // MP4 ANALYSIS
    // =========================================================================

    /**
     * Parse MP4 atom structure from ArrayBuffer
     */
    function parseMp4Atoms(buffer) {
        const view = new DataView(buffer);
        const atoms = [];
        let offset = 0;

        while (offset < buffer.byteLength - 8 && atoms.length < 50) {
            try {
                let size = view.getUint32(offset, false);
                const type = String.fromCharCode(
                    view.getUint8(offset + 4),
                    view.getUint8(offset + 5),
                    view.getUint8(offset + 6),
                    view.getUint8(offset + 7)
                );

                if (!/^[\x20-\x7E]{4}$/.test(type)) break;

                let actualSize = size;
                if (size === 1 && offset + 16 <= buffer.byteLength) {
                    actualSize = view.getUint32(offset + 8, false) * 0x100000000 + view.getUint32(offset + 12, false);
                }

                atoms.push({ type, size, actualSize, offset });
                if (size === 0) break;
                offset += size === 1 ? actualSize : size;
            } catch {
                break;
            }
        }
        return atoms;
    }

    /**
     * Analyze MP4 atom structure
     */
    async function analyzeMp4Structure(url, logToConsole = false) {
        try {
            const finalUrl = await resolveRedirectUrl(url);
            const response = await gmFetch(finalUrl, {
                responseType: 'arraybuffer',
                headers: { 'Range': 'bytes=0-65535' },
                timeout: 15000
            });

            const atoms = parseMp4Atoms(response.response);
            let moovOffset = null, mdatOffset = null;

            atoms.forEach(atom => {
                if (atom.type === 'moov') moovOffset = atom.offset;
                if (atom.type === 'mdat') mdatOffset = atom.offset;
            });

            const isFaststart = moovOffset !== null && mdatOffset !== null && moovOffset < mdatOffset;

            if (logToConsole && settings.analyzeMp4Atoms) {
                const filename = url.split('/').pop();
                console.group(`[MP4 Analysis] ${filename}`);
                atoms.forEach((a, i) => console.log(`${i + 1}. [${a.type}] offset: ${(a.offset / 1024).toFixed(1)}KB`));
                console.log(isFaststart ? '%c✓ FASTSTART' : '%c✗ NOT FASTSTART', `color: ${isFaststart ? 'green' : 'red'}; font-weight: bold`);
                console.groupEnd();
            }

            return { atoms, moovFound: moovOffset !== null, mdatFound: mdatOffset !== null, isFaststart };
        } catch {
            return null;
        }
    }

    // =========================================================================
    // MEDIA EXTRACTION
    // =========================================================================

    /**
     * Extract media URLs from post data
     */
    function extractMediaFromPost(postData, baseUrl, options = {}) {
        const { type = 'all', includeText = false } = options;
        const items = [];
        const post = postData.post || postData;
        const postTitle = post.title || post.substring || '';

        const shouldInclude = (path) => {
            if (type === 'all') return isVideo(path) || isImage(path);
            if (type === 'video') return isVideo(path);
            if (type === 'image') return isImage(path);
            return false;
        };

        // Add text content first if requested
        // API returns HTML content, mark it for proper rendering
        if (includeText && post.content?.trim()) {
            items.push({
                type: 'text',
                title: postTitle,
                content: post.content,
                isHtml: true, // Content from API is HTML
                isDownloadable: false
            });
        }

        // Main file
        if (post.file?.path && shouldInclude(post.file.path)) {
            items.push({
                url: toFullUrl(post.file.path, baseUrl),
                type: getFileType(post.file.path),
                name: post.file.name || post.file.path,
                postTitle,
                isDownloadable: true
            });
        }

        // Attachments
        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path && shouldInclude(att.path)) {
                    items.push({
                        url: toFullUrl(att.path, baseUrl),
                        type: getFileType(att.path),
                        name: att.name || att.path,
                        postTitle,
                        isDownloadable: true
                    });
                }
            });
        }

        // Embed (video only)
        if (type !== 'image' && post.embed?.url && isVideo(post.embed.url)) {
            items.push({
                url: post.embed.url,
                type: 'video',
                name: 'embed',
                postTitle,
                isDownloadable: true
            });
        }

        return items;
    }

    /**
     * Count file types in post
     */
    function countPostFiles(postData) {
        const post = postData.post || postData;
        const counts = { video: 0, image: 0, archive: 0, audio: 0, document: 0, other: 0 };

        if (post.file?.path) counts[getFileType(post.file.path)]++;
        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path) counts[getFileType(att.path)]++;
            });
        }
        return counts;
    }

    // =========================================================================
    // URL PARSING
    // =========================================================================

    /**
     * Parse post URL to extract components
     */
    function parsePostUrl(url) {
        try {
            const urlObj = new URL(url);
            const match = urlObj.pathname.match(/^\/([^/]+)\/user\/([^/]+)\/post\/([^/]+)/);
            if (!match) return null;
            return {
                baseUrl: urlObj.origin,
                service: match[1],
                userId: match[2],
                postId: match[3]
            };
        } catch {
            return null;
        }
    }

    const isUserPage = () => /\/[^/]+\/user\/[^/]+/.test(window.location.pathname);
    const isPostPage = () => /\/[^/]+\/user\/[^/]+\/post\/[^/]+/.test(window.location.pathname);

    /**
     * Get current page offset from URL (?o=XX)
     * Returns 0 for first page
     */
    function getPageOffset() {
        const params = new URLSearchParams(window.location.search);
        const offset = parseInt(params.get('o'), 10);
        return isNaN(offset) ? 0 : offset;
    }

    // =========================================================================
    // STATE MANAGEMENT
    // =========================================================================

    let videoThumbnailQueue = [];
    let activeVideoProcesses = 0;
    let apiQueue = [];
    let activeApiProcesses = 0;

    const userPostsCache = new Map(); // cacheKey -> Map(postId -> postData)
    const fetchedOffsets = new Map(); // cacheKey -> Set of fetched offsets
    const pendingBatchFetches = new Map();
    const postDataCache = new Map();
    const pendingRequests = new Map();

    let userAvatarUrl = null;
    let currentUserPath = null; // Track current creator for navigation detection
    let videoThumbnailObserver = null;

    // GIF control - track which elements have been set up
    const gifHoverSetup = new WeakSet();

    let galleryOverlay = null;
    let galleryMediaItems = [];
    let galleryPostUrl = null;
    let galleryGlide = null; // Glide.js instance
    let galleryDocumentHandlerBound = false;

    // Bulk selection state
    const selectedPosts = new Map(); // postUrl -> { parsed, postData }
    let bulkActionBar = null;
    let bulkDownloadInProgress = false;

    // Volume persistence across media players
    let persistedVolume = parseFloat(GM_getValue('betterui_volume', '1')) || 1;

    // Preload cache for gallery items
    const preloadedMedia = new Map();

    /**
     * Save volume level
     */
    function setPersistedVolume(volume) {
        persistedVolume = volume;
        GM_setValue('betterui_volume', volume.toString());
    }

    /**
     * Preload media items for smoother gallery experience
     */
    function preloadGalleryItems(items, startIndex = 0, count = 3) {
        const indicesToPreload = [];
        for (let i = 0; i < count; i++) {
            const idx = startIndex + i;
            if (idx < items.length && items[idx].type !== 'text') {
                indicesToPreload.push(idx);
            }
        }

        indicesToPreload.forEach(idx => {
            const item = items[idx];
            if (preloadedMedia.has(item.url)) return;

            if (item.type === 'image') {
                const img = new Image();
                img.src = item.url;
                preloadedMedia.set(item.url, img);
                debugLog('Preloading image:', item.url);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.src = item.url;
                preloadedMedia.set(item.url, video);
                debugLog('Preloading video metadata:', item.url);
            }
        });
    }

    /**
     * Get current user path from URL
     */
    function getCurrentUserPath() {
        const match = window.location.pathname.match(/^\/([^/]+)\/user\/([^/]+)/);
        return match ? `${match[1]}/${match[2]}` : null;
    }

    /**
     * Handle navigation to new creator
     */
    function handleNavigationChange() {
        const newUserPath = getCurrentUserPath();

        if (newUserPath && newUserPath !== currentUserPath) {
            debugLog('Creator changed:', currentUserPath, '->', newUserPath);
            currentUserPath = newUserPath;

            // Reset avatar URL for new creator
            userAvatarUrl = null;

            // Clear caches specific to previous creator
            postDataCache.clear();
            userPostsCache.clear();
            fetchedOffsets.clear();
            pendingBatchFetches.clear();

            // Clear bulk selection
            selectedPosts.clear();
            updateBulkActionBar();

            // Re-fetch avatar for new creator
            // Use setTimeout to allow DOM to update
            setTimeout(() => {
                getUserAvatarUrl();
                setupPostCards();
            }, 100);
        }
    }

    /**
     * Initialize navigation observer
     */
    function initNavigationObserver() {
        currentUserPath = getCurrentUserPath();

        // Listen for browser back/forward
        window.addEventListener('popstate', handleNavigationChange);

        // Intercept pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleNavigationChange();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleNavigationChange();
        };

        // Also observe link clicks that might trigger SPA navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="/user/"]');
            if (link && link.href.includes('/user/')) {
                // Check after navigation completes
                setTimeout(handleNavigationChange, 200);
            }
        }, true);

        debugLog('Navigation observer initialized');
    }

    // =========================================================================
    // STYLES
    // =========================================================================

    function injectStyles() {
        if (document.getElementById('betterui-styles')) return;

        // Load Material Symbols font
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
        document.head.appendChild(fontLink);

        const css = `
        /* Material Icons */
        .material-symbols-rounded {
            font-family: 'Material Symbols Rounded' !important;
            font-weight: normal !important;
            font-style: normal !important;
            font-size: 24px !important;
            line-height: 1 !important;
            letter-spacing: normal !important;
            text-transform: none !important;
            display: inline-block !important;
            white-space: nowrap !important;
            word-wrap: normal !important;
            direction: ltr !important;
            -webkit-font-feature-settings: 'liga' !important;
            font-feature-settings: 'liga' !important;
            -webkit-font-smoothing: antialiased !important;
        }
        .icon-sm { font-size: 18px !important; }
        .icon-md { font-size: 24px !important; }
        .icon-lg { font-size: 32px !important; }
        .icon-filled { font-variation-settings: 'FILL' 1 !important; }

        /* Card Layout */
        .site-section--user .card-list .card-list__items {
            --card-size: 242px !important;
        }

        .card-list--legacy, .card-list__items {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
            padding: 16px !important;
        }
        .card-list .card-list__items .post-card {
            flex: 0 0 calc((100% - 64px) / 5) !important;
            max-width: calc((100% - 64px) / 5) !important;
            height: initial;
            margin: 0 !important;
            background: #1e1e1e !important;
            text-decoration: none !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
        }
        .card-list .card-list__items .post-card > .fancy-link:hover,
        .card-list .card-list__items .post-card > .fancy-link:focus,
        .card-list .card-list__items .post-card > .fancy-link:active {
            background-color: #000;
            border-bottom-color: var(--local-color1-primary);
        }
        .card-list__items .post-card .card-thumbnail-wrapper {
            position: relative !important;
            height: var(--card-size);
            width: 100% !important;
            overflow: hidden !important;
            background: #1a1a1a !important;
        }
        .card-list__items .post-card .card-thumbnail-wrapper img,
        .card-list__items .post-card .post__thumbnail .image-link,
        .card-list__items .post-card .post__thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover !important;
            transition: opacity 0.15s ease !important;
        }

        /* Generated thumbnails */
        .generated-thumbnail, .thumbnail-placeholder, .thumbnail-loading, .avatar-placeholder {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
        }
        .generated-thumbnail img, .avatar-placeholder img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        /* File count overlay */
        .file-count-overlay {
            position: absolute !important;
            bottom: 8px !important;
            left: 8px !important;
            display: flex !important;
            gap: 4px !important;
            z-index: 10 !important;
            pointer-events: none !important;
        }
        .file-count-badge {
            background: rgba(0,0,0,0.75) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            display: flex !important;
            align-items: center !important;
            gap: 3px !important;
        }

        /* Video play indicator */
        .video-play-indicator {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: rgba(0,0,0,0.7) !important;
            color: white !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            z-index: 5 !important;
            pointer-events: none !important;
            transition: transform 0.2s ease, background 0.2s ease !important;
        }
        .video-play-indicator.retry-available {
            background: rgba(200,50,50,0.8) !important;
            cursor: pointer !important;
            pointer-events: auto !important;
        }
        .video-play-indicator.ai-retry-available {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
            cursor: pointer !important;
            pointer-events: auto !important;
        }
        .video-play-indicator.ai-retry-available:hover {
            background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%) !important;
            transform: scale(1.1) !important;
        }
        .video-duration {
            position: absolute !important;
            bottom: 8px !important;
            right: 8px !important;
            background: rgba(0,0,0,0.75) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            z-index: 10 !important;
        }

        /* GIF placeholder for hover-to-play */
        .gif-placeholder {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #4ade80 !important;
            z-index: 3 !important;
            pointer-events: none !important;
            transition: opacity 0.15s ease !important;
        }
        .gif-placeholder .material-symbols-rounded {
            font-size: 48px !important;
            opacity: 0.8 !important;
        }

        /* Text content area */
        .card-list__items .post-card .post-card__header,
        .card-list__items .post-card .post-card__footer {
            padding: 12px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            flex-grow: 1 !important;
        }

        /* Post title */
        .card-list__items .post-card .post-card__header {
            font-size: 14px !important;
            font-weight: 500 !important;
            text-shadow: none !important;
            color: #e0e0e0 !important;
            line-height: 1.4 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            word-break: break-word !important;
        }

        /* Date styling */
        .card-list__items .post-card .post-card__footer time {
            font-size: 11px !important;
            color: #fff !important;
        }

        /* Attachment count text */
        .card-list__items .post-card .post-card__footer > div > div > div {
            font-size: 11px !important;
            color: #fff !important;
        }

        /* Image collage */
        .image-collage {
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            gap: 2px !important;
        }
        .image-collage.collage-2,.image-collage.collage-3 { flex-wrap: nowrap !important; flex-direction: rowcolumn !important;}
        .image-collage.collage-2 .collage-img { width: 50% !important; height: 100% !important; }
        .image-collage.collage-3 .collage-left { width: 60% !important; height: 100% !important; }
        .image-collage.collage-3 .collage-right { width: 40% !important; display: flex !important; flex-direction: column !important; gap: 2px !important; }
        .image-collage.collage-3 .collage-right .collage-img { width: 100% !important; height: 48% !important; }
        .collage-img { object-fit: cover !important; border-radius: 5px !important; }
        .collage-more-indicator {
            position: absolute !important;
            bottom: 6px !important;
            left: 6px !important;
            background: rgba(0,0,0,0.75) !important;
            color: white !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            z-index: 10 !important;
        }

        /* Responsive breakpoints */
        @media (max-width: 1400px) { .card-list .card-list__items .post-card { flex: 0 0 calc((100% - 48px) / 4) !important; max-width: calc((100% - 48px) / 4) !important; } }
        @media (max-width: 1100px) { .card-list .card-list__items .post-card { flex: 0 0 calc((100% - 32px) / 3) !important; max-width: calc((100% - 32px) / 3) !important; } }
        @media (max-width: 768px) { .card-list .card-list__items .post-card { flex: 0 0 calc((100% - 12px) / 2) !important; max-width: calc((100% - 12px) / 2) !important; } }
        @media (max-width: 480px) { .card-list .card-list__items .post-card { flex: 0 0 100% !important; max-width: 100% !important; } }

        /* Gallery Overlay */
        .media-gallery-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.95) !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s !important;
        }
        .media-gallery-overlay.active { opacity: 1; visibility: visible; }

        .gallery-close, .gallery-download-all {
            position: absolute !important;
            top: 16px !important;
            height: 44px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 22px !important;
            color: white !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background 0.2s !important;
            z-index: 10 !important;
        }
        .gallery-close { right: 16px !important; width: 44px !important; font-size: 24px !important; }
        .gallery-download-all { right: 70px !important; padding: 0 16px !important; gap: 8px !important; font-size: 14px !important; }
        .gallery-close:hover, .gallery-download-all:hover { background: rgba(255, 255, 255, 0.25) !important; }
        .gallery-download-all:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }

        .gallery-nav {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 50px !important;
            height: 50px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 50% !important;
            color: white !important;
            font-size: 24px !important;
            cursor: pointer !important;
            transition: background 0.2s !important;
            z-index: 10 !important;
        }
        .gallery-nav.prev { left: 16px !important; }
        .gallery-nav.next { right: 16px !important; }
        .gallery-nav:hover { background: rgba(255, 255, 255, 0.25) !important; }
        .gallery-nav:disabled { opacity: 0.3 !important; cursor: not-allowed !important; }

        /* Glide.js Core Styles */
        .glide { position: relative; width: 90vw; max-width: 90vw; perspective: 1200px; }
        .glide__track { overflow: visible !important; }
        .glide__slides {
            display: flex;
            flex-wrap: nowrap;
            will-change: transform;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            touch-action: pan-Y;
            padding: 0;
            margin: 0;
            list-style: none;
            white-space: nowrap;
        }
        .glide__slide {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 70vh !important;
            flex-shrink: 0 !important;
            white-space: normal !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
            transition: transform 0.4s ease, opacity 0.4s ease !important;
            transform-style: preserve-3d !important;
        }
        .glide__slide .slide-inner {
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            transition: transform 0.4s ease, opacity 0.4s ease !important;
            transform-style: preserve-3d !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            background: rgba(0,0,0,0.3) !important;
        }
        .glide__slide.is-active .slide-inner {
            transform: perspective(1200px) rotateY(0deg) scale(1) !important;
            opacity: 1 !important;
            z-index: 10 !important;
        }
        .glide__slide.is-prev .slide-inner {
            transform-origin: 100% 50% !important;
            transform: perspective(1200px) rotateY(35deg) scale(0.85) translateX(10%) !important;
            opacity: 0.7 !important;
            z-index: 5 !important;
        }
        .glide__slide.is-next .slide-inner {
            transform-origin: 0% 50% !important;
            transform: perspective(1200px) rotateY(-35deg) scale(0.85) translateX(-10%) !important;
            opacity: 0.7 !important;
            z-index: 5 !important;
        }
        .glide__slide.is-far-prev .slide-inner {
            transform-origin: 100% 50% !important;
            transform: perspective(1200px) rotateY(50deg) scale(0.7) translateX(20%) !important;
            opacity: 0.4 !important;
            z-index: 1 !important;
        }
        .glide__slide.is-far-next .slide-inner {
            transform-origin: 0% 50% !important;
            transform: perspective(1200px) rotateY(-50deg) scale(0.7) translateX(-20%) !important;
            opacity: 0.4 !important;
            z-index: 1 !important;
        }
        .glide__slide img,
        .glide__slide video {
            max-width: 100% !important;
            max-height: 70vh !important;
            object-fit: contain !important;
        }
        .glide__slide video {
            outline: none !important;
        }
        .glide__slide audio {
            min-width: 300px !important;
        }
        .glide--dragging { cursor: grabbing !important; }

        .gallery-thumbnails {
            display: flex !important;
            gap: 8px !important;
            padding: 16px !important;
            max-width: 90vw !important;
            overflow-x: auto !important;
            margin-top: 16px !important;
        }
        .gallery-thumb {
            width: 60px !important;
            height: 60px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            opacity: 0.5 !important;
            border: 2px solid transparent !important;
            flex-shrink: 0 !important;
            background: #333 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
        }
        .gallery-thumb.active { opacity: 1 !important; border-color: white !important; }
        .gallery-thumb img { width: 100% !important; height: 100% !important; object-fit: cover !important; }

        .gallery-counter {
            position: absolute !important;
            bottom: 16px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            color: white !important;
            font-size: 14px !important;
            background: rgba(0,0,0,0.5) !important;
            padding: 4px 12px !important;
            border-radius: 12px !important;
        }
        .gallery-info {
            position: absolute !important;
            top: 16px !important;
            left: 16px !important;
            color: white !important;
            font-size: 14px !important;
            max-width: 50% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }
        .gallery-item-download {
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            width: 44px !important;
            height: 44px !important;
            background: rgba(0, 0, 0, 0.7) !important;
            border: none !important;
            border-radius: 50% !important;
            color: white !important;
            font-size: 20px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background 0.2s, transform 0.2s !important;
            z-index: 10 !important;
        }
        .gallery-item-download:hover { background: rgba(0, 0, 0, 0.9) !important; transform: scale(1.1) !important; }
        .gallery-item-download.downloading { animation: pulse 1s infinite !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .gallery-loading {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
            color: white !important;
        }
        .loading-spinner {
            width: 48px !important;
            height: 48px !important;
            border: 4px solid rgba(255,255,255,0.2) !important;
            border-top-color: rgba(255,255,255,0.8) !important;
            border-radius: 50% !important;
            animation: spin 1s linear infinite !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Gallery Text Content */
        .gallery-text-content {
            max-width: 800px !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
            padding: 24px !important;
            background: #1a1a1a !important;
            border-radius: 8px !important;
            color: #ddd !important;
            font-size: 15px !important;
            line-height: 1.6 !important;
        }
        .gallery-text-content h3 {
            color: #fff !important;
            font-size: 20px !important;
            margin: 0 0 16px 0 !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #333 !important;
        }
        .gallery-text-content a { color: #4ade80 !important; text-decoration: none !important; }
        .gallery-text-content a:hover { text-decoration: underline !important; }
        .gallery-text-body { word-wrap: break-word !important; }
        .gallery-text-body p { margin: 0 0 12px 0 !important; }
        .gallery-text-body img { max-width: 100% !important; height: auto !important; border-radius: 4px !important; margin: 8px 0 !important; }
        .gallery-text-body ul, .gallery-text-body ol { margin: 0 0 12px 20px !important; padding: 0 !important; }
        .gallery-text-body li { margin-bottom: 4px !important; }
        .gallery-text-body blockquote { border-left: 3px solid #444 !important; margin: 12px 0 !important; padding-left: 12px !important; color: #aaa !important; }
        .gallery-text-body pre, .gallery-text-body code { background: #2a2a2a !important; border-radius: 4px !important; padding: 2px 6px !important; font-family: monospace !important; }
        .gallery-text-body pre { padding: 12px !important; overflow-x: auto !important; }
        .gallery-text-badge {
            display: inline-block !important;
            background: #333 !important;
            color: #aaa !important;
            font-size: 10px !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            margin-bottom: 12px !important;
        }

        /* Download Toast */
        .download-toast {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 320px !important;
            background: #1a1a1a !important;
            border: 1px solid #333 !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
            z-index: 999999 !important;
            padding: 16px !important;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s !important;
        }
        .download-toast.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .download-toast-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 12px !important; }
        .download-toast-title { color: #fff !important; font-size: 14px !important; font-weight: 600 !important; }
        .download-toast-close { background: transparent !important; border: none !important; color: #888 !important; font-size: 16px !important; cursor: pointer !important; }
        .download-toast-progress { height: 6px !important; background: #333 !important; border-radius: 3px !important; overflow: hidden !important; margin-bottom: 10px !important; }
        .download-toast-progress-bar { height: 100% !important; background: linear-gradient(90deg, #4ade80, #22c55e) !important; width: 0%; transition: width 0.3s !important; }
        .download-toast-status { color: #aaa !important; font-size: 12px !important; margin-bottom: 4px !important; }
        .download-toast-filename { color: #888 !important; font-size: 11px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }

        /* Settings Button */
        .betterui-settings-btn {
            position: fixed !important;
            top: 16px !important;
            left: 16px !important;
            height: 44px !important;
            background: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid #333 !important;
            border-radius: 22px !important;
            color: #aaa !important;
            font-size: 20px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            z-index: 99990 !important;
            transition: all 0.3s !important;
            overflow: hidden !important;
            padding: 0 14px !important;
        }
        .betterui-settings-btn:hover { background: rgba(40, 40, 40, 0.98) !important; color: #fff !important; }
        .betterui-settings-btn .settings-label {
            max-width: 0 !important;
            opacity: 0 !important;
            overflow: hidden !important;
            margin-left: 0 !important;
            transition: all 0.3s !important;
            font-size: 13px !important;
            white-space: nowrap !important;
        }
        .betterui-settings-btn:hover .settings-label { max-width: 200px !important; opacity: 1 !important; margin-left: 8px !important; }

        /* Settings Modal */
        .betterui-settings-modal {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.85) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s !important;
        }
        .betterui-settings-modal.active { opacity: 1; visibility: visible; }
        .betterui-settings-content {
            background: #1a1a1a !important;
            border: 1px solid #333 !important;
            border-radius: 12px !important;
            width: 90% !important;
            max-width: 480px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
        }
        .betterui-settings-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 16px 20px !important;
            border-bottom: 1px solid #333 !important;
        }
        .betterui-settings-header h2 { color: #fff !important; font-size: 18px !important; margin: 0 !important; }
        .betterui-settings-close { background: transparent !important; border: none !important; color: #888 !important; font-size: 24px !important; cursor: pointer !important; }
        .betterui-settings-body { padding: 20px !important; }
        .betterui-setting-group { margin-bottom: 20px !important; }
        .betterui-setting-group h3 { color: #888 !important; font-size: 11px !important; text-transform: uppercase !important; margin: 0 0 12px 0 !important; }
        .betterui-setting-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #2a2a2a !important;
        }
        .betterui-setting-item:last-child { border-bottom: none !important; }
        .betterui-setting-info { flex: 1 !important; margin-right: 16px !important; }
        .betterui-setting-label { color: #fff !important; font-size: 14px !important; margin-bottom: 4px !important; }
        .betterui-setting-desc { color: #666 !important; font-size: 12px !important; }

        /* Toggle Switch */
        .betterui-toggle { position: relative !important; width: 44px !important; height: 24px !important; flex-shrink: 0 !important; display: inline-block !important; cursor: pointer !important; }
        .betterui-toggle input {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            opacity: 0 !important;
            cursor: pointer !important;
            z-index: 2 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .betterui-toggle-slider {
            position: absolute !important;
            inset: 0 !important;
            background: #333 !important;
            border-radius: 12px !important;
            pointer-events: none !important;
            transition: 0.3s !important;
        }
        .betterui-toggle-slider:before {
            content: "" !important;
            position: absolute !important;
            height: 18px !important;
            width: 18px !important;
            left: 3px !important;
            bottom: 3px !important;
            background: #888 !important;
            border-radius: 50% !important;
            transition: 0.3s !important;
        }
        .betterui-toggle input:checked + .betterui-toggle-slider { background: #22c55e !important; }
        .betterui-toggle input:checked + .betterui-toggle-slider:before { transform: translateX(20px) !important; background: #fff !important; }

        /* Select dropdown */
        .betterui-select {
            background: #2a2a2a !important;
            border: 1px solid #444 !important;
            border-radius: 6px !important;
            color: #fff !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
            cursor: pointer !important;
            min-width: 150px !important;
        }
        .betterui-select:focus { outline: none !important; border-color: #6366f1 !important; }

        /* Text input */
        .betterui-input {
            background: #2a2a2a !important;
            border: 1px solid #444 !important;
            border-radius: 6px !important;
            color: #fff !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
            min-width: 180px !important;
        }
        .betterui-input:focus { outline: none !important; border-color: #6366f1 !important; }
        .betterui-input::placeholder { color: #666 !important; }

        /* AI key items - hidden by default */
        .ai-key-item { display: none !important; }
        .ai-key-item.visible { display: flex !important; }

        /* Bulk Selection */
        .post-select-checkbox {
            position: absolute !important;
            top: 8px !important;
            left: 8px !important;
            width: 24px !important;
            height: 24px !important;
            background: rgba(0,0,0,0.7) !important;
            border: 2px solid #666 !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            z-index: 15 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            opacity: 0.6 !important;
        }
        .post-select-checkbox:hover {
            opacity: 1 !important;
            border-color: #22c55e !important;
        }
        .post-select-checkbox.selected {
            background: #22c55e !important;
            border-color: #22c55e !important;
            opacity: 1 !important;
        }
        .post-select-checkbox .material-symbols-rounded {
            color: #fff !important;
            font-size: 18px !important;
            display: none !important;
        }
        .post-select-checkbox.selected .material-symbols-rounded {
            display: block !important;
        }
        .card-thumbnail-wrapper:hover .post-select-checkbox {
            opacity: 1 !important;
        }

        /* Bulk Action Bar */
        .bulk-action-bar {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
            border-top: 1px solid #333 !important;
            padding: 12px 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            z-index: 9999 !important;
            transform: translateY(100%) !important;
            transition: transform 0.3s ease !important;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.5) !important;
        }
        .bulk-action-bar.visible {
            transform: translateY(0) !important;
        }
        .bulk-action-bar .selection-info {
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            color: #fff !important;
            font-size: 14px !important;
        }
        .bulk-action-bar .selection-count {
            font-weight: 600 !important;
            color: #22c55e !important;
        }
        .bulk-action-bar .bulk-actions {
            display: flex !important;
            gap: 10px !important;
        }
        .bulk-action-bar button {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 8px 16px !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        .bulk-action-bar .btn-download {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
            color: #fff !important;
        }
        .bulk-action-bar .btn-download:hover {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
        }
        .bulk-action-bar .btn-download:disabled {
            background: #444 !important;
            cursor: not-allowed !important;
        }
        .bulk-action-bar .btn-clear {
            background: #333 !important;
            color: #fff !important;
        }
        .bulk-action-bar .btn-clear:hover {
            background: #444 !important;
        }
        .bulk-action-bar .btn-select-all {
            background: transparent !important;
            color: #888 !important;
            border: 1px solid #444 !important;
        }
        .bulk-action-bar .btn-select-all:hover {
            background: #333 !important;
            color: #fff !important;
        }
        .bulk-progress {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            color: #fff !important;
        }
        .bulk-progress-bar {
            width: 200px !important;
            height: 6px !important;
            background: #333 !important;
            border-radius: 3px !important;
            overflow: hidden !important;
        }
        .bulk-progress-fill {
            height: 100% !important;
            background: #22c55e !important;
            transition: width 0.2s ease !important;
        }

        /* Toast notifications */
        .betterui-toast {
            position: fixed !important;
            bottom: 80px !important;
            left: 50% !important;
            transform: translateX(-50%) translateY(20px) !important;
            background: #1a1a2e !important;
            color: #fff !important;
            padding: 12px 24px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            z-index: 10001 !important;
            opacity: 0 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }
        .betterui-toast.visible {
            opacity: 1 !important;
            transform: translateX(-50%) translateY(0) !important;
        }
        .betterui-toast-success {
            border-left: 4px solid #22c55e !important;
        }
        .betterui-toast-error {
            border-left: 4px solid #ef4444 !important;
        }
        .betterui-toast-info {
            border-left: 4px solid #3b82f6 !important;
        }
        `;

        const style = document.createElement('style');
        style.id = 'betterui-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // =========================================================================
    // SETTINGS UI
    // =========================================================================

    function createSettingsUI() {
        const btn = document.createElement('button');
        btn.className = 'betterui-settings-btn';
        btn.innerHTML = `${icon('settings', 'sm')}<span class="settings-label">BetterUI Settings</span>`;
        btn.addEventListener('click', () => {
            document.getElementById('betterui-settings-modal')?.classList.add('active');
        });
        document.body.appendChild(btn);

        const modal = document.createElement('div');
        modal.className = 'betterui-settings-modal';
        modal.id = 'betterui-settings-modal';
        modal.innerHTML = `
            <div class="betterui-settings-content">
                <div class="betterui-settings-header">
                    <h2>BetterUI Settings</h2>
                    <button class="betterui-settings-close">${icon('close', 'md')}</button>
                </div>
                <div class="betterui-settings-body">
                    <div class="betterui-setting-group">
                        <h3>Performance</h3>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">GIF hover-to-play</div>
                                <div class="betterui-setting-desc">GIFs pause when not hovered (thumbnails) or inactive (gallery)</div>
                            </div>
                            <label class="betterui-toggle">
                                <input type="checkbox" data-setting="pauseGifsWhenHidden">
                                <span class="betterui-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="betterui-setting-group">
                        <h3>Downloads</h3>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Prefix filenames with post title</div>
                                <div class="betterui-setting-desc">Add post title to downloaded files</div>
                            </div>
                            <label class="betterui-toggle">
                                <input type="checkbox" data-setting="prefixFilenamesWithTitle">
                                <span class="betterui-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="betterui-setting-group">
                        <h3>AI Thumbnails</h3>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">AI Provider</div>
                                <div class="betterui-setting-desc">Select AI for smart frame selection</div>
                            </div>
                            <select data-setting-select="aiProvider" class="betterui-select">
                                <option value="none">Disabled</option>
                                <option value="claude">Claude (Anthropic)</option>
                                <option value="gemini">Gemini (Google)</option>
                            </select>
                        </div>
                        <div class="betterui-setting-item ai-key-item" data-provider="claude">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Claude API Key</div>
                                <div class="betterui-setting-desc">Get from console.anthropic.com</div>
                            </div>
                            <input type="password" class="betterui-input" data-api-key="claude" placeholder="sk-ant-...">
                        </div>
                        <div class="betterui-setting-item ai-key-item" data-provider="gemini">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Gemini API Key</div>
                                <div class="betterui-setting-desc">Get from aistudio.google.com</div>
                            </div>
                            <input type="password" class="betterui-input" data-api-key="gemini" placeholder="AIza...">
                        </div>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Auto-fallback to AI</div>
                                <div class="betterui-setting-desc">Automatically try AI when standard thumbnail fails</div>
                            </div>
                            <label class="betterui-toggle">
                                <input type="checkbox" data-setting="aiAutoFallback">
                                <span class="betterui-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="betterui-setting-group">
                        <h3>Developer</h3>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Debug mode</div>
                                <div class="betterui-setting-desc">Log debug messages to console</div>
                            </div>
                            <label class="betterui-toggle">
                                <input type="checkbox" data-setting="debug">
                                <span class="betterui-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="betterui-setting-item">
                            <div class="betterui-setting-info">
                                <div class="betterui-setting-label">Analyze MP4 atoms</div>
                                <div class="betterui-setting-desc">Log MP4 structure to console</div>
                            </div>
                            <label class="betterui-toggle">
                                <input type="checkbox" data-setting="analyzeMp4Atoms">
                                <span class="betterui-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append to DOM first
        document.body.appendChild(modal);

        // Close handlers
        const closeModal = () => modal.classList.remove('active');
        modal.querySelector('.betterui-settings-close').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        // Set initial checkbox states and bind events
        modal.querySelectorAll('input[data-setting]').forEach(input => {
            const settingName = input.dataset.setting;

            // Set initial state
            input.checked = settings[settingName];

            // Use addEventListener for change event
            input.addEventListener('change', function(e) {
                e.stopPropagation();
                settings[settingName] = this.checked;
                saveSettings();
                console.log(`[BetterUI] Setting "${settingName}" changed to:`, this.checked);
            });

            // Also handle click on the label/toggle wrapper
            const label = input.closest('.betterui-toggle');
            if (label) {
                label.addEventListener('click', function(e) {
                    // Only handle if click wasn't on the input itself
                    if (e.target !== input) {
                        e.preventDefault();
                        e.stopPropagation();
                        input.checked = !input.checked;
                        settings[settingName] = input.checked;
                        saveSettings();
                        console.log(`[BetterUI] Setting "${settingName}" toggled to:`, input.checked);
                    }
                });
            }
        });

        // AI Provider select handler
        const aiProviderSelect = modal.querySelector('select[data-setting-select="aiProvider"]');
        if (aiProviderSelect) {
            aiProviderSelect.value = settings.aiProvider;
            updateAiKeyVisibility(modal, settings.aiProvider);

            aiProviderSelect.addEventListener('change', function(e) {
                e.stopPropagation();
                settings.aiProvider = this.value;
                saveSettings();
                updateAiKeyVisibility(modal, this.value);
                console.log(`[BetterUI] AI Provider changed to:`, this.value);
            });
        }

        // AI API key input handlers
        modal.querySelectorAll('input[data-api-key]').forEach(input => {
            const provider = input.dataset.apiKey;
            input.value = getAiApiKey(provider);

            input.addEventListener('change', function(e) {
                e.stopPropagation();
                setAiApiKey(provider, this.value.trim());
                console.log(`[BetterUI] ${provider} API key updated`);
            });

            input.addEventListener('blur', function(e) {
                e.stopPropagation();
                setAiApiKey(provider, this.value.trim());
            });
        });
    }

    /**
     * Show/hide API key inputs based on selected provider
     */
    function updateAiKeyVisibility(modal, provider) {
        modal.querySelectorAll('.ai-key-item').forEach(item => {
            item.classList.remove('visible');
        });
        if (provider !== 'none') {
            const keyItem = modal.querySelector(`.ai-key-item[data-provider="${provider}"]`);
            if (keyItem) keyItem.classList.add('visible');
        }
    }

    // =========================================================================
    // AVATAR & THUMBNAIL HELPERS
    // =========================================================================

    /*function getUserAvatarUrl() {
        const avatarImg = document.querySelector('.user-header__avatar .fancy-image__image');
        if (avatarImg?.src) {
            userAvatarUrl = avatarImg.src;
            debugLog('Found avatar:', userAvatarUrl);
        }
    }*/

    function getUserAvatarUrl() {
        if (userAvatarUrl) return userAvatarUrl;

        // Primary selector path
        const avatarImg = document.querySelector('#main > section.site-section--user > header.user-header > a.user-header__avatar > picture.fancy-image__picture > img.fancy-image__image');
        if (avatarImg?.src) {
            userAvatarUrl = avatarImg.src;
            return userAvatarUrl;
        }

        // Fallback selectors
        const fallbackSelectors = [
            '.user-header__avatar img',
            '.user-header .fancy-image__image',
            '.user-header img'
        ];

        for (const selector of fallbackSelectors) {
            const img = document.querySelector(selector);
            if (img?.src) {
                userAvatarUrl = img.src;
                return userAvatarUrl;
            }
        }

        return null;
    }

    function getOrCreateThumbnailWrapper(link) {
        let wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'card-thumbnail-wrapper';

            const existingThumb = link.querySelector('.post-card__image');
            if (existingThumb) {
                wrapper.appendChild(existingThumb);
            }

            link.insertBefore(wrapper, link.firstChild);
        }
        return wrapper;
    }

    function insertAvatarPlaceholder(link) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper || wrapper.querySelector('.avatar-placeholder')) return;

        if (!userAvatarUrl) {
            userAvatarUrl = getUserAvatarUrl();
        }

        const placeholder = document.createElement('div');
        placeholder.className = 'avatar-placeholder';
        const img = document.createElement('img');
        img.src = userAvatarUrl;
        img.loading = 'eager';
        placeholder.appendChild(img);
        wrapper.appendChild(placeholder);
    }

    function removeAvatarPlaceholder(link) {
        link.querySelector('.avatar-placeholder')?.remove();
    }

    function formatDuration(seconds) {
        if (!seconds || !isFinite(seconds)) return '';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // =========================================================================
    // THUMBNAIL GENERATION
    // =========================================================================

    /**
     * Check if video is suitable for thumbnail generation
     */
    async function checkVideoSuitability(videoUrl) {
        const fileSize = await getFileSize(videoUrl);

        if (fileSize && fileSize > CONFIG.maxVideoSizeForThumbnail) {
            return { suitable: false, reason: 'File too large' };
        }

        if (videoUrl.toLowerCase().includes('.mp4')) {
            const atomInfo = await analyzeMp4Structure(videoUrl, true);
            if (atomInfo && !atomInfo.isFaststart && fileSize && fileSize > CONFIG.maxNonFaststartSize) {
                return { suitable: false, reason: 'Non-faststart MP4 too large' };
            }
        }

        return { suitable: true };
    }

    /**
     * Fetch video as blob with range request
     */
    async function fetchVideoBlob(videoUrl, mode = 'start') {
        const finalUrl = await resolveRedirectUrl(videoUrl);
        const headers = { 'Accept': '*/*' };

        if (mode === 'start') headers['Range'] = 'bytes=0-5242880';
        else if (mode === 'end') headers['Range'] = 'bytes=-10485760';

        const response = await gmFetch(finalUrl, { responseType: 'blob', headers, timeout: 120000 });
        return URL.createObjectURL(response.response);
    }

    /**
     * Generate thumbnail from video
     */
    function generateThumbnail(videoUrl) {
        return new Promise(async (resolve, reject) => {
            const modes = ['start', 'combined', 'full'];
            let currentMode = 0;

            const tryMode = async () => {
                if (currentMode >= modes.length) {
                    reject(new Error('All modes failed'));
                    return;
                }

                const mode = modes[currentMode];
                debugLog(`Thumbnail attempt: ${mode}`);

                // Size check for full mode
                if (mode === 'full') {
                    const size = await getFileSize(videoUrl);
                    if (size && size > CONFIG.maxVideoSizeForThumbnail) {
                        reject(new Error('File too large'));
                        return;
                    }
                }

                let blobUrl;
                try {
                    if (mode === 'combined' && typeof MP4Box !== 'undefined') {
                        blobUrl = await fetchMp4BoxBlob(videoUrl);
                    } else {
                        blobUrl = await fetchVideoBlob(videoUrl, mode);
                    }
                } catch (e) {
                    currentMode++;
                    tryMode();
                    return;
                }

                const video = document.createElement('video');
                video.muted = true;
                video.preload = 'metadata';
                video.src = blobUrl;

                const cleanup = () => {
                    video.src = '';
                    URL.revokeObjectURL(blobUrl);
                };

                const timeout = setTimeout(() => {
                    cleanup();
                    currentMode++;
                    tryMode();
                }, 15000);

                video.onloadedmetadata = () => {
                    const seekTo = Math.min(CONFIG.seekTime, video.duration * 0.1);
                    video.currentTime = seekTo;
                };

                video.onseeked = () => {
                    clearTimeout(timeout);
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = CONFIG.thumbnailSize;
                        canvas.height = CONFIG.thumbnailSize;
                        const ctx = canvas.getContext('2d');

                        const aspect = video.videoWidth / video.videoHeight;
                        let dw, dh, dx, dy;
                        if (aspect > 1) {
                            dh = canvas.height;
                            dw = dh * aspect;
                            dx = (canvas.width - dw) / 2;
                            dy = 0;
                        } else {
                            dw = canvas.width;
                            dh = dw / aspect;
                            dx = 0;
                            dy = (canvas.height - dh) / 2;
                        }

                        ctx.drawImage(video, dx, dy, dw, dh);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        cleanup();
                        resolve({ dataUrl, duration: video.duration });
                    } catch (e) {
                        cleanup();
                        reject(e);
                    }
                };

                video.onerror = () => {
                    clearTimeout(timeout);
                    cleanup();
                    currentMode++;
                    tryMode();
                };
            };

            tryMode();
        });
    }

    /**
     * Fetch MP4 using MP4Box for non-faststart files
     */
    function fetchMp4BoxBlob(videoUrl) {
        return new Promise(async (resolve, reject) => {
            if (typeof MP4Box === 'undefined') {
                reject(new Error('MP4Box not available'));
                return;
            }

            const finalUrl = await resolveRedirectUrl(videoUrl);
            const fileSize = await getFileSize(videoUrl);
            if (!fileSize) {
                reject(new Error('Cannot determine file size'));
                return;
            }

            const mp4box = MP4Box.createFile();
            let resolved = false;

            mp4box.onError = () => !resolved && reject(new Error('MP4Box error'));
            mp4box.onReady = info => {
                if (resolved) return;
                resolved = true;

                const track = info.tracks.find(t => t.type === 'video');
                if (!track) {
                    reject(new Error('No video track'));
                    return;
                }

                mp4box.setSegmentOptions(track.id, null, { nbSamples: 100 });
                const initSegs = mp4box.initializeSegmentation();
                mp4box.start();

                const chunks = [initSegs[0].buffer];
                mp4box.onSegment = (id, user, buffer) => chunks.push(buffer);

                setTimeout(() => {
                    mp4box.stop();
                    const blob = new Blob(chunks, { type: 'video/mp4' });
                    resolve(URL.createObjectURL(blob));
                }, 500);
            };

            // Fetch start and end of file
            const fetchRange = async (start, end) => {
                const response = await gmFetch(finalUrl, {
                    responseType: 'arraybuffer',
                    headers: { 'Range': `bytes=${start}-${end}` },
                    timeout: 30000
                });
                const buffer = response.response;
                buffer.fileStart = start;
                return buffer;
            };

            try {
                const startBuffer = await fetchRange(0, Math.min(5 * 1024 * 1024, fileSize - 1));
                mp4box.appendBuffer(startBuffer);

                if (fileSize > 10 * 1024 * 1024) {
                    const endStart = Math.max(0, fileSize - 10 * 1024 * 1024);
                    const endBuffer = await fetchRange(endStart, fileSize - 1);
                    mp4box.appendBuffer(endBuffer);
                }

                mp4box.flush();
            } catch (e) {
                reject(e);
            }
        });
    }

    // =========================================================================
    // AI SMART FRAME SELECTION
    // =========================================================================

    /**
     * Extract multiple frames from video at different positions
     * Returns array of { position, dataUrl } objects
     */
    async function extractVideoFrames(videoUrl, positions = CONFIG.aiFramePositions) {
        return new Promise(async (resolve, reject) => {
            let blobUrl;
            try {
                blobUrl = await fetchVideoBlob(videoUrl, 'full');
            } catch (e) {
                reject(new Error('Failed to fetch video for frame extraction'));
                return;
            }

            const video = document.createElement('video');
            video.muted = true;
            video.preload = 'metadata';
            video.src = blobUrl;

            const cleanup = () => {
                video.src = '';
                URL.revokeObjectURL(blobUrl);
            };

            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('Frame extraction timeout'));
            }, 60000);

            video.onloadedmetadata = async () => {
                const frames = [];
                const duration = video.duration;

                for (const pos of positions) {
                    const seekTo = duration * pos;
                    try {
                        const dataUrl = await extractFrameAt(video, seekTo);
                        frames.push({ position: pos, time: seekTo, dataUrl });
                    } catch (e) {
                        debugLog(`Frame extraction failed at ${pos}:`, e.message);
                    }
                }

                clearTimeout(timeout);
                cleanup();

                if (frames.length === 0) {
                    reject(new Error('No frames extracted'));
                } else {
                    resolve({ frames, duration });
                }
            };

            video.onerror = () => {
                clearTimeout(timeout);
                cleanup();
                reject(new Error('Video load error'));
            };
        });
    }

    /**
     * Extract a single frame at specified time
     */
    function extractFrameAt(video, time) {
        return new Promise((resolve, reject) => {
            video.currentTime = time;

            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                try {
                    const canvas = document.createElement('canvas');
                    // Use smaller size for AI to reduce token usage
                    canvas.width = 256;
                    canvas.height = 256;
                    const ctx = canvas.getContext('2d');

                    const aspect = video.videoWidth / video.videoHeight;
                    let dw, dh, dx, dy;
                    if (aspect > 1) {
                        dh = canvas.height;
                        dw = dh * aspect;
                        dx = (canvas.width - dw) / 2;
                        dy = 0;
                    } else {
                        dw = canvas.width;
                        dh = dw / aspect;
                        dx = 0;
                        dy = (canvas.height - dh) / 2;
                    }

                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, dx, dy, dw, dh);

                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                } catch (e) {
                    reject(e);
                }
            };

            video.addEventListener('seeked', onSeeked);
        });
    }

    /**
     * Call Claude API for frame selection
     */
    async function selectBestFrameClaude(frames) {
        const apiKey = getAiApiKey('claude');
        if (!apiKey) throw new Error('Claude API key not configured');

        const imageContent = frames.map((frame, idx) => ([
            {
                type: 'text',
                text: `Frame ${idx + 1} (at ${Math.round(frame.time)}s):`
            },
            {
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: frame.dataUrl.split(',')[1]
                }
            }
        ])).flat();

        const response = await gmFetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            data: JSON.stringify({
                model: 'claude-3-5-haiku-latest',
                max_tokens: 50,
                messages: [{
                    role: 'user',
                    content: [
                        ...imageContent,
                        {
                            type: 'text',
                            text: 'Select the best frame for a video thumbnail. Consider: visual clarity, interesting content, good composition, not a black/blank frame. Reply with ONLY the frame number (1-' + frames.length + ').'
                        }
                    ]
                }]
            }),
            responseType: 'json',
            timeout: 30000
        });

        const result = JSON.parse(response.responseText);
        if (result.error) throw new Error(result.error.message);

        const text = result.content?.[0]?.text || '';
        const match = text.match(/(\d+)/);
        if (!match) throw new Error('Could not parse frame selection');

        const frameNum = parseInt(match[1], 10);
        if (frameNum < 1 || frameNum > frames.length) throw new Error('Invalid frame number');

        return frameNum - 1; // Return 0-indexed
    }

    /**
     * Call Gemini API for frame selection
     */
    async function selectBestFrameGemini(frames) {
        const apiKey = getAiApiKey('gemini');
        if (!apiKey) throw new Error('Gemini API key not configured');

        const parts = [];
        frames.forEach((frame, idx) => {
            parts.push({ text: `Frame ${idx + 1} (at ${Math.round(frame.time)}s):` });
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: frame.dataUrl.split(',')[1]
                }
            });
        });
        parts.push({
            text: 'Select the best frame for a video thumbnail. Consider: visual clarity, interesting content, good composition, not a black/blank frame. Reply with ONLY the frame number (1-' + frames.length + ').'
        });

        const response = await gmFetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { maxOutputTokens: 50 }
            }),
            responseType: 'json',
            timeout: 30000
        });

        const result = JSON.parse(response.responseText);
        if (result.error) throw new Error(result.error.message);

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/(\d+)/);
        if (!match) throw new Error('Could not parse frame selection');

        const frameNum = parseInt(match[1], 10);
        if (frameNum < 1 || frameNum > frames.length) throw new Error('Invalid frame number');

        return frameNum - 1; // Return 0-indexed
    }

    /**
     * Generate thumbnail using AI frame selection
     */
    async function generateAiThumbnail(videoUrl) {
        const provider = settings.aiProvider;
        if (provider === 'none') throw new Error('AI provider not configured');

        debugLog(`AI thumbnail generation using ${provider}`);

        // Extract frames
        const { frames, duration } = await extractVideoFrames(videoUrl);
        debugLog(`Extracted ${frames.length} frames for AI analysis`);

        // Select best frame via AI
        let bestFrameIndex;
        if (provider === 'claude') {
            bestFrameIndex = await selectBestFrameClaude(frames);
        } else if (provider === 'gemini') {
            bestFrameIndex = await selectBestFrameGemini(frames);
        } else {
            throw new Error('Unknown AI provider');
        }

        debugLog(`AI selected frame ${bestFrameIndex + 1}`);

        // Generate full-size thumbnail from selected frame position
        const selectedFrame = frames[bestFrameIndex];
        const fullSizeDataUrl = await generateThumbnailAtTime(videoUrl, selectedFrame.time);

        return { dataUrl: fullSizeDataUrl, duration };
    }

    /**
     * Generate thumbnail at specific time (for AI-selected frame)
     */
    function generateThumbnailAtTime(videoUrl, time) {
        return new Promise(async (resolve, reject) => {
            let blobUrl;
            try {
                blobUrl = await fetchVideoBlob(videoUrl, 'full');
            } catch (e) {
                reject(e);
                return;
            }

            const video = document.createElement('video');
            video.muted = true;
            video.preload = 'metadata';
            video.src = blobUrl;

            const cleanup = () => {
                video.src = '';
                URL.revokeObjectURL(blobUrl);
            };

            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('Thumbnail generation timeout'));
            }, 30000);

            video.onloadedmetadata = () => {
                video.currentTime = time;
            };

            video.onseeked = () => {
                clearTimeout(timeout);
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = CONFIG.thumbnailSize;
                    canvas.height = CONFIG.thumbnailSize;
                    const ctx = canvas.getContext('2d');

                    const aspect = video.videoWidth / video.videoHeight;
                    let dw, dh, dx, dy;
                    if (aspect > 1) {
                        dh = canvas.height;
                        dw = dh * aspect;
                        dx = (canvas.width - dw) / 2;
                        dy = 0;
                    } else {
                        dw = canvas.width;
                        dh = dw / aspect;
                        dx = 0;
                        dy = (canvas.height - dh) / 2;
                    }

                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, dx, dy, dw, dh);

                    cleanup();
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                } catch (e) {
                    cleanup();
                    reject(e);
                }
            };

            video.onerror = () => {
                clearTimeout(timeout);
                cleanup();
                reject(new Error('Video load error'));
            };
        });
    }

    /**
     * Check if AI is available for thumbnail generation
     */
    function isAiAvailable() {
        if (settings.aiProvider === 'none') return false;
        const apiKey = getAiApiKey(settings.aiProvider);
        return !!apiKey;
    }

    /**
     * Handle AI thumbnail retry click
     */
    async function handleAiThumbnailRetry(link) {
        if (!isAiAvailable()) {
            debugLog('AI not available for retry');
            return;
        }

        const playIndicator = link.querySelector('.video-play-indicator');
        if (playIndicator) {
            playIndicator.innerHTML = icon('hourglass_empty', 'lg');
            playIndicator.classList.remove('retry-available', 'ai-retry-available');
            playIndicator.title = 'AI processing...';
        }

        const parsed = parsePostUrl(link.href);
        if (!parsed) return;

        let postData = postDataCache.get(link.href);
        if (!postData) {
            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            postData = userPostsCache.get(cacheKey)?.get(parsed.postId);
        }

        if (!postData) {
            markThumbnailFailed(link, 'No post data');
            return;
        }

        const videoItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'video' });
        if (videoItems.length === 0) {
            markThumbnailFailed(link, 'No video');
            return;
        }

        for (const item of videoItems) {
            try {
                const result = await generateAiThumbnail(item.url);
                insertVideoThumbnail(link, result.dataUrl, result.duration);
                await cacheThumbnail(item.url, result.dataUrl, result.duration);
                debugLog('AI thumbnail generated successfully');
                return;
            } catch (e) {
                debugLog('AI thumbnail failed:', e.message);
            }
        }

        markThumbnailFailed(link, 'AI failed');
    }

    function insertVideoThumbnail(link, dataUrl, duration) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper) return;

        removeAvatarPlaceholder(link);
        wrapper.querySelector('.generated-thumbnail')?.remove();

        const container = document.createElement('div');
        container.className = 'generated-thumbnail';

        const img = document.createElement('img');
        img.src = dataUrl;
        container.appendChild(img);

        const playIcon = document.createElement('div');
        playIcon.className = 'video-play-indicator';
        playIcon.innerHTML = icon('play_arrow', 'lg', true);
        container.appendChild(playIcon);

        if (duration) {
            const durationEl = document.createElement('div');
            durationEl.className = 'video-duration';
            durationEl.textContent = formatDuration(duration);
            container.appendChild(durationEl);
        }

        wrapper.appendChild(container);
        link.dataset.videoThumbnailSuccess = 'true';
    }

    function insertImageFallbackThumbnail(link, imageUrl) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper) return;

        removeAvatarPlaceholder(link);

        const container = document.createElement('div');
        container.className = 'generated-thumbnail video-fallback';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.loading = 'eager';
        container.appendChild(img);

        const playIcon = document.createElement('div');
        playIcon.className = 'video-play-indicator';
        playIcon.innerHTML = icon('play_arrow', 'lg', true);
        container.appendChild(playIcon);

        wrapper.appendChild(container);
        link.dataset.videoThumbnailSuccess = 'true';
    }

    function markThumbnailFailed(link, message = 'Failed') {
        link.dataset.videoThumbnailFailed = 'true';
        const playIndicator = link.querySelector('.video-play-indicator');
        if (playIndicator) {
            insertAvatarPlaceholder(link);

            // Check if AI is available for retry
            if (isAiAvailable() && message !== 'AI failed') {
                playIndicator.classList.add('ai-retry-available');
                playIndicator.innerHTML = icon('auto_awesome', 'lg');
                playIndicator.title = `${message} - Click for AI thumbnail`;
            } else {
                playIndicator.classList.add('retry-available');
                playIndicator.innerHTML = '↻';
                playIndicator.title = `${message} - Click to retry`;
            }
        }
    }

    /**
     * Mark thumbnail for AI retry without marking as failed
     * Used when fallback to image/avatar succeeded but AI could improve it
     */
    function markThumbnailForAiRetry(link, message = 'Skipped') {
        const playIndicator = link.querySelector('.video-play-indicator');
        if (playIndicator) {
            playIndicator.classList.add('ai-retry-available');
            playIndicator.innerHTML = icon('auto_awesome', 'lg');
            playIndicator.title = `${message} - Click for AI thumbnail`;
        }
    }

    // =========================================================================
    // IMAGE COLLAGE
    // =========================================================================

    function insertImageCollage(link, imageUrls, totalCount) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper) return;
        const thumbnail = wrapper.querySelector('.post-card__image');
        if (thumbnail) thumbnail.classList.add('hidden');

        removeAvatarPlaceholder(link);
        wrapper.querySelector('.image-collage')?.remove();

        const count = Math.min(imageUrls.length, 3);
        const collage = document.createElement('div');
        collage.className = `image-collage collage-${count}`;

        if (count === 1) {
            const img = document.createElement('img');
            img.src = imageUrls[0];
            img.className = 'collage-img';
            img.loading = 'eager';
            collage.appendChild(img);
        } else if (count === 2) {
            imageUrls.slice(0, 2).forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'collage-img';
                img.loading = 'eager';
                collage.appendChild(img);
            });
        } else {
            const left = document.createElement('div');
            left.className = 'collage-left';
            const leftImg = document.createElement('img');
            leftImg.src = imageUrls[0];
            leftImg.className = 'collage-img';
            leftImg.loading = 'eager';
            left.appendChild(leftImg);

            const right = document.createElement('div');
            right.className = 'collage-right';
            imageUrls.slice(1, 3).forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'collage-img';
                img.loading = 'eager';
                right.appendChild(img);
            });

            collage.appendChild(left);
            collage.appendChild(right);
        }

        if (totalCount > 3) {
            const indicator = document.createElement('div');
            indicator.className = 'collage-more-indicator';
            indicator.textContent = `+${totalCount - 3} more`;
            collage.appendChild(indicator);
        }

        wrapper.appendChild(collage);
    }

    // =========================================================================
    // FILE COUNT OVERLAY
    // =========================================================================

    function insertFileCountOverlay(link, counts) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper || wrapper.querySelector('.file-count-overlay')) return;

        const icons = { video: icon('videocam', 'sm', true), image: icon('image', 'sm', true), archive: icon('folder_zip', 'sm', true), audio: icon('headphones', 'sm', true), document: icon('description', 'sm', true) };
        const badges = [];

        for (const [type, count] of Object.entries(counts)) {
            if (count > 0 && icons[type]) {
                badges.push(`<div class="file-count-badge">${icons[type]} ${count}</div>`);
            }
        }

        if (badges.length > 0) {
            const overlay = document.createElement('div');
            overlay.className = 'file-count-overlay';
            overlay.innerHTML = badges.join('');
            wrapper.appendChild(overlay);
        }
    }

    // =========================================================================
    // VIDEO THUMBNAIL QUEUE
    // =========================================================================

    function processVideoQueue() {
        while (activeVideoProcesses < CONFIG.maxConcurrentVideo && videoThumbnailQueue.length > 0) {
            const link = videoThumbnailQueue.shift();
            if (link && !link.dataset.videoThumbnailProcessed) {
                activeVideoProcesses++;
                processVideoThumbnail(link).finally(() => {
                    activeVideoProcesses--;
                    processVideoQueue();
                });
            }
        }
    }

    async function processVideoThumbnail(link) {
        if (link.dataset.videoThumbnailSuccess === 'true') return;
        link.dataset.videoThumbnailProcessed = 'true';

        const parsed = parsePostUrl(link.href);
        if (!parsed) return;

        let postData = postDataCache.get(link.href);
        if (!postData) {
            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            if (userPostsCache.has(cacheKey)) {
                postData = userPostsCache.get(cacheKey).get(parsed.postId);
            }
            if (!postData) {
                try {
                    postData = await fetchJson(`${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`);
                } catch {
                    markThumbnailFailed(link, 'API error');
                    return;
                }
            }
            postDataCache.set(link.href, postData);
        }

        const videoItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'video' });
        if (videoItems.length === 0) {
            removeAvatarPlaceholder(link);
            return;
        }

        const imageItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'image' });

        let anyAttempted = false;
        let skipReason = '';

        for (const item of videoItems) {
            // Check cache first
            const cached = await getCachedThumbnail(item.url);
            if (cached) {
                insertVideoThumbnail(link, cached.dataUrl, cached.duration);
                return;
            }

            const suitability = await checkVideoSuitability(item.url);
            if (!suitability.suitable) {
                debugLog(`Skipping video: ${suitability.reason}`);
                skipReason = suitability.reason;
                continue;
            }

            anyAttempted = true;
            try {
                const result = await generateThumbnail(item.url);
                insertVideoThumbnail(link, result.dataUrl, result.duration);

                // Cache the result
                await cacheThumbnail(item.url, result.dataUrl, result.duration);
                return;
            } catch (e) {
                debugLog('Thumbnail failed:', e.message);
            }
        }

        // If all videos were skipped and AI is available, show AI retry option
        const allSkipped = !anyAttempted && videoItems.length > 0;

        // Fallback to image (but still show AI option if videos were skipped)
        if (imageItems.length > 0) {
            insertImageFallbackThumbnail(link, imageItems[0].url);
            if (allSkipped && isAiAvailable()) {
                markThumbnailForAiRetry(link, skipReason || 'Skipped');
            }
            return;
        }

        // Fallback to avatar (but still show AI option if videos were skipped)
        if (userAvatarUrl) {
            link.dataset.videoThumbnailSuccess = 'true';
            if (allSkipped && isAiAvailable()) {
                markThumbnailForAiRetry(link, skipReason || 'Skipped');
            }
            return;
        }

        // Auto AI fallback if enabled
        if (settings.aiAutoFallback && isAiAvailable()) {
            debugLog('Attempting automatic AI fallback');
            for (const item of videoItems) {
                try {
                    const result = await generateAiThumbnail(item.url);
                    insertVideoThumbnail(link, result.dataUrl, result.duration);
                    await cacheThumbnail(item.url, result.dataUrl, result.duration);
                    debugLog('AI auto-fallback thumbnail generated');
                    return;
                } catch (e) {
                    debugLog('AI auto-fallback failed:', e.message);
                }
            }
        }

        markThumbnailFailed(link, allSkipped ? (skipReason || 'Skipped') : 'Preview failed');
    }

    // =========================================================================
    // BATCH API FETCHING
    // =========================================================================

    /**
     * Batch fetch posts for a user starting from a specific offset
     * Fetches current page and next page (100 posts total if available)
     * Skips offsets that have already been fetched
     */
    async function batchFetchUserPosts(baseUrl, service, userId, startOffset = 0) {
        const cacheKey = `${baseUrl}/${service}/user/${userId}`;
        const limit = 50;

        // Initialize cache structures if needed
        if (!userPostsCache.has(cacheKey)) {
            userPostsCache.set(cacheKey, new Map());
        }
        if (!fetchedOffsets.has(cacheKey)) {
            fetchedOffsets.set(cacheKey, new Set());
        }

        const postsMap = userPostsCache.get(cacheKey);
        const fetched = fetchedOffsets.get(cacheKey);

        // Determine which offsets need to be fetched (current page + next page)
        const offsetsToFetch = [];
        const currentPageOffset = Math.floor(startOffset / limit) * limit; // Normalize to page boundary

        // Add current page and next page if not already fetched
        if (!fetched.has(currentPageOffset)) {
            offsetsToFetch.push(currentPageOffset);
        }
        const nextPageOffset = currentPageOffset + limit;
        if (!fetched.has(nextPageOffset)) {
            offsetsToFetch.push(nextPageOffset);
        }

        if (offsetsToFetch.length === 0) {
            debugLog(`All offsets already fetched for ${service}/${userId}`);
            return postsMap;
        }

        // Check for pending fetch for same offsets
        const pendingKey = `${cacheKey}:${offsetsToFetch.join(',')}`;
        if (pendingBatchFetches.has(pendingKey)) {
            return pendingBatchFetches.get(pendingKey);
        }

        const fetchPromise = (async () => {
            try {
                for (const offset of offsetsToFetch) {
                    const url = `${baseUrl}/api/v1/${service}/user/${userId}/posts?o=${offset}&limit=${limit}`;
                    debugLog(`Fetching posts offset=${offset} for ${service}/${userId}`);

                    const posts = await fetchJson(url);

                    if (Array.isArray(posts) && posts.length > 0) {
                        posts.forEach(post => postsMap.set(post.id, post));
                        fetched.add(offset);
                        debugLog(`Fetched ${posts.length} posts at offset ${offset}`);
                    } else {
                        // Mark as fetched even if empty (end of posts)
                        fetched.add(offset);
                        debugLog(`No more posts at offset ${offset}`);
                    }
                }

                debugLog(`Cache now has ${postsMap.size} posts for ${service}/${userId}`);
            } catch (e) {
                debugLog('Batch fetch failed:', e.message);
            }

            pendingBatchFetches.delete(pendingKey);
            return postsMap;
        })();

        pendingBatchFetches.set(pendingKey, fetchPromise);
        return fetchPromise;
    }

    // =========================================================================
    // INTERSECTION OBSERVERS
    // =========================================================================

    function initVideoThumbnailObserver() {
        if (videoThumbnailObserver) return;

        videoThumbnailObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    if (!link.dataset.videoThumbnailQueued && !link.dataset.videoThumbnailProcessed) {
                        link.dataset.videoThumbnailQueued = 'true';
                        videoThumbnailQueue.push(link);
                        processVideoQueue();
                    }
                }
            });
        }, { rootMargin: '200px' });
    }

    // =========================================================================
    // GIF CONTROL (hover-to-load)
    // =========================================================================

    /**
     * Setup hover-to-play for GIF in thumbnail wrapper
     * JS controls visibility to avoid CSS hover issues with transparent images
     */
    function setupThumbnailGifHover(wrapper) {
        if (gifHoverSetup.has(wrapper)) return;

        const img = wrapper.querySelector('img[src*=".gif"], img[src*=".GIF"]');
        if (!img) return;

        gifHoverSetup.add(wrapper);

        const gifUrl = img.src;
        const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        // Create placeholder with GIF icon
        const placeholder = document.createElement('div');
        placeholder.className = 'gif-placeholder';
        placeholder.innerHTML = `${icon('gif_box', 'lg', true)}`;

        // Store URL and initially hide image
        img.dataset.gifSrc = gifUrl;
        img.style.opacity = '0';
        img.src = transparentPixel;

        wrapper.appendChild(placeholder);

        // Use mouseenter/mouseleave with explicit visibility control
        wrapper.addEventListener('mouseenter', () => {
            // Load GIF if needed
            if (img.dataset.gifSrc && img.src !== img.dataset.gifSrc) {
                img.src = img.dataset.gifSrc;
            }
            img.style.opacity = '1';
            placeholder.style.opacity = '0';
        });

        wrapper.addEventListener('mouseleave', () => {
            img.style.opacity = '0';
            placeholder.style.opacity = '1';
        });
    }

    /**
     * Process GIFs in thumbnail wrappers on the page
     */
    function processPageGifs() {
        if (!settings.pauseGifsWhenHidden) return;

        document.querySelectorAll('.card-thumbnail-wrapper').forEach(wrapper => {
            setupThumbnailGifHover(wrapper);
        });
    }

    /**
     * Control GIF playback in gallery slides
     * Only load GIF src for active slide, clear for inactive
     */
    function updateGalleryGifPlayback(activeIndex) {
        galleryOverlay?.querySelectorAll('.glide__slide').forEach((slide, index) => {
            const img = slide.querySelector('img[data-gif-src]');
            if (!img) return;

            if (index === activeIndex) {
                // Load GIF for active slide
                if (img.dataset.gifSrc && img.src !== img.dataset.gifSrc) {
                    img.src = img.dataset.gifSrc;
                }
            } else {
                // Unload GIF for inactive slides - use tiny transparent pixel
                if (img.src && img.src !== 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') {
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            }
        });
    }

    // =========================================================================
    // GALLERY
    // =========================================================================

    function createGalleryOverlay() {
        if (galleryOverlay) return;

        galleryOverlay = document.createElement('div');
        galleryOverlay.className = 'media-gallery-overlay';
        galleryOverlay.innerHTML = `
            <button class="gallery-close" aria-label="Close">${icon('close', 'md')}</button>
            <button class="gallery-download-all">${icon('download', 'sm')}<span class="download-label">Download All</span><span class="download-progress" style="display:none"></span></button>
            <div class="gallery-info"></div>
            <button class="gallery-nav prev" aria-label="Previous">${icon('chevron_left', 'lg')}</button>
            <button class="gallery-nav next" aria-label="Next">${icon('chevron_right', 'lg')}</button>
            <div class="glide">
                <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides"></ul>
                </div>
            </div>
            <div class="gallery-thumbnails"></div>
            <div class="gallery-counter"></div>
        `;

        galleryOverlay.querySelector('.gallery-close').onclick = closeGallery;
        galleryOverlay.querySelector('.gallery-nav.prev').onclick = () => navigateGallery(-1);
        galleryOverlay.querySelector('.gallery-nav.next').onclick = () => navigateGallery(1);
        galleryOverlay.querySelector('.gallery-download-all').onclick = downloadAllMedia;
        galleryOverlay.onclick = e => e.target === galleryOverlay && closeGallery();

        document.body.appendChild(galleryOverlay);

        // Single keyboard handler for gallery
        document.addEventListener('keydown', handleGalleryKeyboard, true);
    }

    async function openGallery(link) {
        const parsed = parsePostUrl(link.href);
        if (!parsed) return;

        createGalleryOverlay();

        // Clear preload cache for new gallery
        preloadedMedia.clear();

        // Destroy previous Glide instance
        if (galleryGlide) {
            galleryGlide.destroy();
            galleryGlide = null;
        }

        const slidesContainer = galleryOverlay.querySelector('.glide__slides');
        slidesContainer.innerHTML = '<li class="glide__slide"><div class="slide-inner"><div class="gallery-loading"><div class="loading-spinner"></div><span>Loading media...</span></div></div></li>';

        galleryOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Always fetch from API to get full post content (HTML)
        let postData;
        try {
            const apiUrl = `${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`;
            postData = await fetchJson(apiUrl);
            postDataCache.set(link.href, postData);
        } catch {
            // Fallback to cached data if API fails
            postData = postDataCache.get(link.href);
            if (!postData) {
                const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
                if (userPostsCache.has(cacheKey)) {
                    postData = userPostsCache.get(cacheKey).get(parsed.postId);
                }
            }
            if (!postData) {
                slidesContainer.innerHTML = '<li class="glide__slide"><div class="slide-inner"><div class="gallery-loading"><span>Failed to load media</span></div></div></li>';
                return;
            }
        }

        galleryMediaItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'all', includeText: true });
        galleryPostUrl = link.href;

        if (galleryMediaItems.length === 0) {
            slidesContainer.innerHTML = '<li class="glide__slide"><div class="slide-inner"><div class="gallery-loading"><span>No media found</span></div></div></li>';
            return;
        }

        const post = postData.post || postData;
        galleryOverlay.querySelector('.gallery-info').textContent = post.title || post.content?.substring(0, 50)?.replace(/<[^>]*>/g, '') || post.substring || 'post';

        // Preload first 3 media items
        preloadGalleryItems(galleryMediaItems, 0, 3);

        // Build slides
        buildGallerySlides();
        buildGalleryThumbnails();

        // Initialize Glide
        initGlide();

        galleryOverlay.setAttribute('tabindex', '-1');
        galleryOverlay.focus();
    }

    /**
     * Build Glide slides from media items
     */
    /**
     * Setup video frame capture for gallery videos
     * Captures frame when video plays/seeks for caching
     */
    function setupGalleryVideoCapture(video, videoUrl) {
        if (!videoUrl) return;

        let captured = false;

        const doCapture = async () => {
            if (captured) return;
            if (capturedVideoUrls.has(videoUrl)) {
                captured = true;
                return;
            }

            // Wait a bit for video to stabilize
            await new Promise(r => setTimeout(r, 500));

video.addEventListener("loadedmetadata", async function() {
    console.log(video.videoWidth);
            // Only capture if we have video dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            try {
                await captureVideoFrame(video, videoUrl);
                captured = true;
                debugLog('Gallery video frame captured:', videoUrl);
            } catch (e) {
                debugLog('Gallery video capture failed:', e.message);
            }
});
        };

        // Capture when video plays
        video.addEventListener('play', doCapture, { once: true });

        // Also try on timeupdate (in case play event was missed)
        const onTimeUpdate = () => {
            if (video.currentTime > 0.5 && !captured) {
                doCapture();
                video.removeEventListener('timeupdate', onTimeUpdate);
            }
        };
        video.addEventListener('timeupdate', onTimeUpdate);
    }

    function buildGallerySlides() {
        const slidesContainer = galleryOverlay.querySelector('.glide__slides');
        slidesContainer.innerHTML = '';

        galleryMediaItems.forEach((item, index) => {
            const slide = document.createElement('li');
            slide.className = 'glide__slide';
            slide.dataset.index = index;

            // Inner wrapper for coverflow transforms
            const inner = document.createElement('div');
            inner.className = 'slide-inner';

            if (item.type === 'text') {
                const container = document.createElement('div');
                container.className = 'gallery-text-content';
                const contentHtml = item.isHtml ? item.content : linkifyText(item.content);
                container.innerHTML = `
                    <span class="gallery-text-badge">POST CONTENT</span>
                    ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ''}
                    <div class="gallery-text-body">${contentHtml}</div>
                `;
                inner.appendChild(container);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.url;
                video.controls = true;
                video.preload = 'metadata';
                video.volume = persistedVolume;
                video.addEventListener('volumechange', () => setPersistedVolume(video.volume));

                // Set up frame capture for caching
                video.dataset.videoUrl = item.url;
                setupGalleryVideoCapture(video, item.url);

                inner.appendChild(video);
                addDownloadButton(inner, item);
            } else if (item.type === 'audio') {
                const audio = document.createElement('audio');
                audio.src = item.url;
                audio.controls = true;
                audio.volume = persistedVolume;
                audio.addEventListener('volumechange', () => setPersistedVolume(audio.volume));
                inner.appendChild(audio);
                addDownloadButton(inner, item);
            } else {
                const img = document.createElement('img');
                const isGif = item.url.toLowerCase().includes('.gif');

                if (isGif && settings.pauseGifsWhenHidden) {
                    // For GIFs: store src, only load for first slide
                    img.dataset.gifSrc = item.url;
                    if (index === 0) {
                        img.src = item.url;
                    } else {
                        // Use transparent placeholder for inactive slides
                        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    }
                } else {
                    img.src = item.url;
                }

                img.loading = index < 3 ? 'eager' : 'lazy';
                inner.appendChild(img);
                addDownloadButton(inner, item);
            }

            slide.appendChild(inner);
            slidesContainer.appendChild(slide);
        });
    }

    /**
     * Initialize Glide.js carousel with coverflow effect
     */
    function initGlide() {
        const glideElement = galleryOverlay.querySelector('.glide');
        const slideCount = galleryMediaItems.length;

        // Determine perView based on slide count
        const perView = slideCount >= 3 ? 3 : slideCount;

        galleryGlide = new Glide(glideElement, {
            type: 'slider',
            startAt: 0,
            focusAt: 'center',
            perView: perView,
            gap: 20,
            peek: { before: 50, after: 50 },
            keyboard: false, // We handle keyboard ourselves
            rewind: false,
            animationDuration: 400,
            animationTimingFunc: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            swipeThreshold: 80,
            dragThreshold: 120,
            breakpoints: {
                768: { perView: 1, peek: 0, gap: 0 }
            }
        });

        // Update UI and coverflow on slide change
        galleryGlide.on(['mount.after', 'run'], () => {
            updateCoverflowClasses();
            updateGalleryUI();
            handleSlideChange();
        });

        galleryGlide.mount();
    }

    /**
     * Apply coverflow CSS classes based on slide position
     */
    function updateCoverflowClasses() {
        if (!galleryGlide) return;

        const slides = galleryOverlay.querySelectorAll('.glide__slide');
        const currentIndex = galleryGlide.index;

        slides.forEach((slide, i) => {
            // Remove all position classes
            slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');

            const diff = i - currentIndex;

            if (diff === 0) {
                slide.classList.add('is-active');
            } else if (diff === -1) {
                slide.classList.add('is-prev');
            } else if (diff === 1) {
                slide.classList.add('is-next');
            } else if (diff < -1) {
                slide.classList.add('is-far-prev');
            } else if (diff > 1) {
                slide.classList.add('is-far-next');
            }
        });
    }

    /**
     * Handle slide change - autoplay video, pause others
     */
    function handleSlideChange() {
        if (!galleryGlide) return;
        const index = galleryGlide.index;

        // Pause all videos except current ---improve logic by fetching all slides, then using ifs to check for class and index for more accurate iteration
        galleryOverlay.querySelectorAll('.glide__slide video').forEach((video, i) => {
            if (i+1 === index) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        // Control GIF playback - only active slide plays
        updateGalleryGifPlayback(index);

        // Preload upcoming slides
        preloadGalleryItems(galleryMediaItems, index + 1, 3);
    }

    /**
     * Update gallery UI elements
     */
    function updateGalleryUI() {
        if (!galleryGlide) return;

        const index = galleryGlide.index;
        const total = galleryMediaItems.length;

        // Update counter
        galleryOverlay.querySelector('.gallery-counter').textContent = `${index + 1} / ${total}`;

        // Update nav buttons
        galleryOverlay.querySelector('.gallery-nav.prev').disabled = index === 0;
        galleryOverlay.querySelector('.gallery-nav.next').disabled = index === total - 1;

        // Update thumbnails
        galleryOverlay.querySelectorAll('.gallery-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });

        galleryOverlay.querySelectorAll('.gallery-thumb')[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }

    function buildGalleryThumbnails() {
        const strip = galleryOverlay.querySelector('.gallery-thumbnails');
        strip.innerHTML = '';

        galleryMediaItems.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb';
            if (index === 0) thumb.classList.add('active');

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.url;
                img.loading = 'lazy';
                thumb.appendChild(img);
            } else if (item.type === 'video') {
                thumb.innerHTML = icon('play_arrow', 'md', true);
            } else if (item.type === 'audio') {
                thumb.innerHTML = icon('headphones', 'sm', true);
            } else if (item.type === 'text') {
                thumb.innerHTML = icon('article', 'sm', true);
            } else {
                thumb.innerHTML = icon('attach_file', 'sm', true);
            }

            thumb.onclick = () => {
                if (galleryGlide) {
                    galleryGlide.go('=' + index);
                }
            };
            strip.appendChild(thumb);
        });
    }

    function addDownloadButton(container, item) {
        const btn = document.createElement('button');
        btn.className = 'gallery-item-download';
        btn.innerHTML = icon('download', 'md');
        btn.title = `Download ${item.name || item.type}`;
        btn.onclick = (e) => {
            e.stopPropagation();
            downloadSingleMedia(item, btn);
        };
        container.appendChild(btn);
    }

    function navigateGallery(dir) {
        if (!galleryGlide) return;
        if (dir < 0) {
            galleryGlide.go('<');
        } else {
            galleryGlide.go('>');
        }
    }

    function closeGallery() {
        if (!galleryOverlay) return;

        // Pause all videos
        galleryOverlay.querySelectorAll('video').forEach(video => {
            video.pause();
            video.src = '';
        });

        // Destroy Glide instance
        if (galleryGlide) {
            galleryGlide.destroy();
            galleryGlide = null;
        }

        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';
        galleryMediaItems = [];
        galleryPostUrl = null;
    }

    function handleGalleryKeyboard(e) {
        if (!galleryOverlay?.classList.contains('active')) return;

        // Keys to intercept when gallery is open
        const interceptKeys = ['Escape', 'ArrowLeft', 'ArrowRight', ' ', 'ArrowUp', 'ArrowDown'];

        if (interceptKeys.includes(e.key)) {
            // Block ALL propagation to prevent native page navigation
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            switch (e.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    navigateGallery(-1);
                    break;
                case 'ArrowRight':
                    navigateGallery(1);
                    break;
                case ' ':
                    const video = galleryOverlay.querySelector('.glide__slide.is-active video');
                    if (video) video.paused ? video.play() : video.pause();
                    break;
                // ArrowUp/Down - just block, don't do anything
            }
        }
    }

    // =========================================================================
    // DOWNLOADS
    // =========================================================================

    function getProgressToast() {
        let toast = document.getElementById('download-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'download-toast';
            toast.className = 'download-toast';
            toast.innerHTML = `
                <div class="download-toast-header">
                    <span class="download-toast-title">Downloading...</span>
                    <button class="download-toast-close">${icon('close', 'sm')}</button>
                </div>
                <div class="download-toast-progress"><div class="download-toast-progress-bar"></div></div>
                <div class="download-toast-status">Preparing...</div>
                <div class="download-toast-filename"></div>
            `;
            toast.querySelector('.download-toast-close').onclick = () => toast.classList.remove('active');
            document.body.appendChild(toast);
        }
        return toast;
    }

    function updateToast(toast, { title, progress, status, filename, show = true }) {
        if (title !== undefined) toast.querySelector('.download-toast-title').textContent = title;
        if (progress !== undefined) toast.querySelector('.download-toast-progress-bar').style.width = `${Math.min(100, progress)}%`;
        if (status !== undefined) toast.querySelector('.download-toast-status').textContent = status;
        if (filename !== undefined) toast.querySelector('.download-toast-filename').textContent = filename;
        if (show) toast.classList.add('active');
    }

    function hideToast(toast, delay = 3000) {
        setTimeout(() => toast.classList.remove('active'), delay);
    }

    function getDownloadFilename(item) {
        let filename = getFilenameFromUrl(item.url, item.name);
        if (settings.prefixFilenamesWithTitle && item.postTitle) {
            const prefix = sanitiseFilename(item.postTitle, settings.maxFilenamePrefixLength);
            if (prefix) filename = `${prefix}_${filename}`;
        }
        return filename;
    }

    async function downloadSingleMedia(item, btn) {
        if (!item?.url) return;

        const filename = getDownloadFilename(item);

        if (btn) {
            btn.disabled = true;
            btn.classList.add('downloading');
            btn.innerHTML = '⏳';
        }

        try {
            const finalUrl = await resolveRedirectUrl(item.url);
            const response = await gmFetch(finalUrl, { responseType: 'blob', timeout: 300000 });

            const blobUrl = URL.createObjectURL(response.response);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            if (btn) btn.innerHTML = icon('check', 'md');
        } catch {
            if (btn) btn.innerHTML = icon('close', 'md');
        }

        if (btn) {
            setTimeout(() => {
                btn.innerHTML = icon('download', 'md');
                btn.disabled = false;
                btn.classList.remove('downloading');
            }, 1500);
        }
    }

    async function downloadAllMedia() {
        const downloadable = galleryMediaItems.filter(i => i.isDownloadable !== false);
        if (downloadable.length === 0) return;

        const btn = galleryOverlay.querySelector('.gallery-download-all');
        const label = btn.querySelector('.download-label');
        const progress = btn.querySelector('.download-progress');
        const toast = getProgressToast();

        btn.disabled = true;
        label.style.display = 'none';
        progress.style.display = 'inline';

        const postTitle = sanitiseFilename(galleryOverlay.querySelector('.gallery-info')?.textContent || 'media', 50);
        const zipFilename = `${postTitle}_${Date.now()}.zip`;

        updateToast(toast, { title: 'Preparing Download', progress: 0, status: `0 / ${downloadable.length} files`, filename: zipFilename });

        const usedNames = new Set();
        const getUniqueName = (name) => {
            if (!usedNames.has(name)) { usedNames.add(name); return name; }
            const dot = name.lastIndexOf('.');
            const base = dot > 0 ? name.slice(0, dot) : name;
            const ext = dot > 0 ? name.slice(dot) : '';
            let i = 1;
            while (usedNames.has(`${base}_${i}${ext}`)) i++;
            const unique = `${base}_${i}${ext}`;
            usedNames.add(unique);
            return unique;
        };

        // Collect files for fflate
        const files = {};
        let completed = 0, failed = 0;

        console.log('[BetterUI] Starting download of', downloadable.length, 'files');

        for (const item of downloadable) {
            const filename = getUniqueName(getDownloadFilename(item));
            updateToast(toast, { status: `Downloading ${completed + 1} / ${downloadable.length}`, filename, progress: (completed / downloadable.length) * 85 });
            progress.textContent = `${completed + 1}/${downloadable.length}`;

            try {
                console.log('[BetterUI] Fetching:', filename);
                const finalUrl = await resolveRedirectUrl(item.url);
                const response = await gmFetch(finalUrl, { responseType: 'arraybuffer', timeout: 300000 });

                // Convert ArrayBuffer to Uint8Array for fflate
                const uint8Array = new Uint8Array(response.response);
                files[filename] = uint8Array;
                console.log('[BetterUI] Downloaded:', filename, uint8Array.byteLength, 'bytes');
            } catch (e) {
                console.error('[BetterUI] Download failed:', filename, e);
                failed++;
            }
            completed++;
        }

        const fileCount = Object.keys(files).length;
        console.log('[BetterUI] Creating zip with', fileCount, 'files');

        if (fileCount === 0) {
            updateToast(toast, { title: 'Download Failed', status: 'No files could be downloaded', progress: 0 });
            hideToast(toast, 5000);
            label.style.display = 'inline';
            progress.style.display = 'none';
            label.innerHTML = `${icon('error', 'sm')} Error`;
            setTimeout(() => { label.textContent = 'Download All'; btn.disabled = false; }, 2000);
            return;
        }

        updateToast(toast, { status: 'Creating zip...', progress: 88 });

        try {
            // Use fflate to create zip - wrapped in Promise for async/await
            const zipData = await new Promise((resolve, reject) => {
                console.log('[BetterUI] Starting fflate.zip()');

                // fflate.zip(files, options, callback)
                fflate.zip(files, { level: 6 }, (err, data) => {
                    if (err) {
                        console.error('[BetterUI] fflate error:', err);
                        reject(err);
                    } else {
                        console.log('[BetterUI] fflate complete, size:', data.byteLength);
                        resolve(data);
                    }
                });
            });

            updateToast(toast, { status: 'Preparing download...', progress: 95 });
            console.log('[BetterUI] Zip created:', zipData.byteLength, 'bytes');

            const blob = new Blob([zipData], { type: 'application/zip' });
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = zipFilename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                console.log('[BetterUI] Blob URL revoked');
            }, 60000);

            updateToast(toast, { title: 'Download Complete', status: `Downloaded ${completed - failed} of ${downloadable.length} files`, progress: 100 });
            label.innerHTML = `${icon('check_circle', 'sm')} Done`;
            hideToast(toast, 3000);
            console.log('[BetterUI] Download complete');

        } catch (e) {
            console.error('[BetterUI] Zip creation failed:', e);
            updateToast(toast, { title: 'Download Failed', status: e.message || 'Zip creation failed' });
            label.innerHTML = `${icon('error', 'sm')} Error`;
            hideToast(toast, 5000);
        }

        label.style.display = 'inline';
        progress.style.display = 'none';
        setTimeout(() => { label.textContent = 'Download All'; btn.disabled = false; }, 2000);
    }

    // =========================================================================
    // GALLERY CLICK HANDLING
    // =========================================================================

    function handleGalleryClick(e) {
        // Skip checkbox clicks
        if (e.target.closest('.post-select-checkbox')) return;

        // Handle AI retry click
        const aiRetryIndicator = e.target.closest('.video-play-indicator.ai-retry-available');
        if (aiRetryIndicator) {
            const link = aiRetryIndicator.closest('.fancy-link');
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                handleAiThumbnailRetry(link);
            }
            return;
        }

        // Skip regular retry clicks
        if (e.target.closest('.video-play-indicator.retry-available')) return;

        const wrapper = e.target.closest('.card-thumbnail-wrapper') || e.target.closest('.post-card__image-container');
        if (!wrapper) return;

        const link = wrapper.closest('.fancy-link[data-gallery-click]');
        if (!link) return;

        debugLog('Gallery click intercepted');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openGallery(link);
    }

    function bindGalleryClickHandler() {
        if (galleryDocumentHandlerBound) return;
        galleryDocumentHandlerBound = true;

        // Checkbox handler - must be registered first to run first in capture phase
        document.addEventListener('click', (e) => {
            const checkbox = e.target.closest('.post-select-checkbox');
            if (checkbox) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const link = checkbox.closest('.fancy-link');
                if (link) togglePostSelection(link);
            }
        }, true);

        document.addEventListener('click', handleGalleryClick, true);
    }

    function addGalleryClickHandler(link) {
        if (link.dataset.galleryClick) return;
        link.dataset.galleryClick = 'true';
        bindGalleryClickHandler();

        const wrapper = link.querySelector('.card-thumbnail-wrapper, .post-card__image-container');
        if (wrapper) wrapper.style.cursor = 'pointer';
    }

    // =========================================================================
    // BULK SELECTION & DOWNLOAD
    // =========================================================================

    /**
     * Create the bulk action bar UI
     */
    function createBulkActionBar() {
        if (bulkActionBar) return;

        bulkActionBar = document.createElement('div');
        bulkActionBar.className = 'bulk-action-bar';
        bulkActionBar.innerHTML = `
            <div class="selection-info">
                <span>${icon('check_box', 'sm')}</span>
                <span><span class="selection-count">0</span> posts selected</span>
            </div>
            <div class="bulk-actions">
                <button class="btn-select-all">${icon('select_all', 'sm')}Select All</button>
                <button class="btn-clear">${icon('close', 'sm')}Clear</button>
                <button class="btn-download">${icon('download', 'sm')}Download All</button>
            </div>
        `;

        bulkActionBar.querySelector('.btn-select-all').addEventListener('click', selectAllPosts);
        bulkActionBar.querySelector('.btn-clear').addEventListener('click', clearSelection);
        bulkActionBar.querySelector('.btn-download').addEventListener('click', startBulkDownload);

        document.body.appendChild(bulkActionBar);
    }

    /**
     * Update the bulk action bar visibility and count
     */
    function updateBulkActionBar() {
        if (!bulkActionBar) return;

        const count = selectedPosts.size;
        bulkActionBar.querySelector('.selection-count').textContent = count;

        if (count > 0) {
            bulkActionBar.classList.add('visible');
        } else {
            bulkActionBar.classList.remove('visible');
        }
    }

    /**
     * Add selection checkbox to a post card
     */
    function addSelectionCheckbox(link) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (!wrapper || wrapper.querySelector('.post-select-checkbox')) return;

        const checkbox = document.createElement('div');
        checkbox.className = 'post-select-checkbox';
        checkbox.innerHTML = icon('check', 'sm');
        checkbox.title = 'Select for bulk download';

        // Use capture phase to intercept before gallery handler
        checkbox.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            togglePostSelection(link);
        }, true);

        wrapper.appendChild(checkbox);
    }

    /**
     * Toggle selection state for a post
     */
    async function togglePostSelection(link) {
        const postUrl = link.href;
        const checkbox = link.querySelector('.post-select-checkbox');

        if (selectedPosts.has(postUrl)) {
            selectedPosts.delete(postUrl);
            checkbox?.classList.remove('selected');
        } else {
            const parsed = parsePostUrl(postUrl);
            if (!parsed) return;

            // Get post data
            let postData = postDataCache.get(postUrl);
            if (!postData) {
                const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
                postData = userPostsCache.get(cacheKey)?.get(parsed.postId);
            }

            selectedPosts.set(postUrl, { parsed, postData });
            checkbox?.classList.add('selected');
        }

        updateBulkActionBar();
    }

    /**
     * Select all visible posts
     */
    function selectAllPosts() {
        document.querySelectorAll('.fancy-link[data-card-setup]').forEach(link => {
            if (!selectedPosts.has(link.href)) {
                togglePostSelection(link);
            }
        });
    }

    /**
     * Clear all selections
     */
    function clearSelection() {
        selectedPosts.forEach((_, postUrl) => {
            const link = document.querySelector(`.fancy-link[href="${postUrl}"]`);
            const checkbox = link?.querySelector('.post-select-checkbox');
            checkbox?.classList.remove('selected');
        });
        selectedPosts.clear();
        updateBulkActionBar();
    }

    /**
     * Start bulk download of selected posts
     */
    async function startBulkDownload() {
        if (bulkDownloadInProgress || selectedPosts.size === 0) return;

        bulkDownloadInProgress = true;
        const downloadBtn = bulkActionBar.querySelector('.btn-download');
        const actionsDiv = bulkActionBar.querySelector('.bulk-actions');

        // Show progress UI
        const originalContent = actionsDiv.innerHTML;
        actionsDiv.innerHTML = `
            <div class="bulk-progress">
                <span class="progress-text">Preparing...</span>
                <div class="bulk-progress-bar">
                    <div class="bulk-progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        const progressText = actionsDiv.querySelector('.progress-text');
        const progressFill = actionsDiv.querySelector('.bulk-progress-fill');

        try {
            const allFiles = [];
            const posts = Array.from(selectedPosts.entries());
            let processedPosts = 0;

            // Collect all files from selected posts
            for (const [postUrl, { parsed, postData }] of posts) {
                progressText.textContent = `Scanning ${processedPosts + 1}/${posts.length}...`;
                progressFill.style.width = `${(processedPosts / posts.length) * 30}%`;

                let data = postData;
                if (!data && parsed) {
                    try {
                        data = await fetchJson(`${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`);
                    } catch (e) {
                        debugLog('Failed to fetch post data:', postUrl);
                    }
                }

                if (data) {
                    const mediaItems = extractMediaFromPost(data, parsed.baseUrl, {});
                    const postTitle = sanitizeFilename(data.title || parsed.postId);

                    mediaItems.forEach((item, idx) => {
                        if (item.type === 'text') return;
                        allFiles.push({
                            url: item.url,
                            filename: item.filename,
                            postTitle,
                            postId: parsed.postId
                        });
                    });
                }

                processedPosts++;
            }

            if (allFiles.length === 0) {
                showToast('No files found in selected posts', 'error');
                return;
            }

            progressText.textContent = `Downloading ${allFiles.length} files...`;

            // Download files and create ZIP
            const zipFiles = {};
            let downloadedCount = 0;

            for (const file of allFiles) {
                try {
                    const response = await gmFetch(file.url, {
                        responseType: 'arraybuffer',
                        timeout: 120000
                    });
                    if (typeof file.filename === 'undefined') {
                        file.filename = getFilenameFromUrl(file.url);
                    }

                    // Create folder structure: postTitle_postId/filename
                    const folderName = `${file.postTitle}_${file.postId}`;
                    const filePath = `${folderName}/${file.filename}`;

                    zipFiles[filePath] = new Uint8Array(response.response);
                    downloadedCount++;

                    const progress = 30 + (downloadedCount / allFiles.length) * 60;
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `Downloading ${downloadedCount}/${allFiles.length}...`;

                } catch (e) {
                    debugLog('Failed to download:', file.url, e.message);
                }
            }

            if (downloadedCount === 0) {
                showToast('Failed to download any files', 'error');
                return;
            }

            progressText.textContent = 'Creating ZIP...';
            progressFill.style.width = '95%';

            // Create ZIP using fflate
            const zipped = fflate.zipSync(zipFiles, { level: 0 });
            const blob = new Blob([zipped], { type: 'application/zip' });

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 10);
            const creatorNameLookupByElement = document.querySelector('.user-header__profile span[itemprop="name"]').textContent;
            const creatorMatch = window.location.pathname.match(/\/([^/]+)\/user\/([^/]+)/);
            const creatorName = creatorNameLookupByElement ? creatorNameLookupByElement : (creatorMatch ? creatorMatch[2] : 'posts');
            const zipFilename = `${creatorName}_${selectedPosts.size}_posts_${timestamp}.zip`;

            // Trigger download
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = zipFilename;
            a.click();
            URL.revokeObjectURL(downloadUrl);

            progressFill.style.width = '100%';
            progressText.textContent = `Downloaded ${downloadedCount} files!`;

            showToast(`Downloaded ${downloadedCount} files from ${selectedPosts.size} posts`, 'success');

            // Clear selection after successful download
            setTimeout(() => {
                clearSelection();
            }, 1500);

        } catch (e) {
            debugLog('Bulk download error:', e);
            showToast('Download failed: ' + e.message, 'error');
        } finally {
            bulkDownloadInProgress = false;
            setTimeout(() => {
                actionsDiv.innerHTML = originalContent;
                actionsDiv.querySelector('.btn-select-all').addEventListener('click', selectAllPosts);
                actionsDiv.querySelector('.btn-clear').addEventListener('click', clearSelection);
                actionsDiv.querySelector('.btn-download').addEventListener('click', startBulkDownload);
            }, 2000);
        }
    }

    // =========================================================================
    // POST CARD SETUP
    // =========================================================================

    async function setupPostCards() {
        const links = document.querySelectorAll('.card-list .card-list__items .post-card .fancy-link');

        // Get current page offset from URL
        const currentOffset = getPageOffset();

        // Collect unique users for batch fetching
        const users = new Map();
        links.forEach(link => {
            if (!link.href?.includes('/post/') || link.dataset.cardSetup) return;
            const parsed = parsePostUrl(link.href);
            if (!parsed) return;
            const key = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            if (!users.has(key)) users.set(key, parsed);
        });

        // Batch fetch all users with current page offset
        await Promise.all([...users.values()].map(p => batchFetchUserPosts(p.baseUrl, p.service, p.userId, currentOffset)));

        // Process each card
        links.forEach(link => {
            if (!link.href?.includes('/post/') || link.dataset.cardSetup) return;
            link.dataset.cardSetup = 'true';

            getOrCreateThumbnailWrapper(link);

            const parsed = parsePostUrl(link.href);
            if (!parsed) return;

            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            const postsMap = userPostsCache.get(cacheKey);
            const postData = postsMap?.get(parsed.postId);

            if (!postData) return;

            const counts = countPostFiles(postData);
            const videoItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'video' });
            const imageItems = extractMediaFromPost(postData, parsed.baseUrl, { type: 'image' });

            addGalleryClickHandler(link);
            addSelectionCheckbox(link);
            insertFileCountOverlay(link, counts);

            if (videoItems.length > 0) {
                insertAvatarPlaceholder(link);
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-indicator';
                playIcon.innerHTML = icon('play_arrow', 'lg', true);
                link.querySelector('.card-thumbnail-wrapper')?.appendChild(playIcon);
                videoThumbnailObserver?.observe(link);
            } else if (imageItems.length > 0) {
                insertImageCollage(link, imageItems.map(i => i.url), imageItems.length);
            }
        });
    }

    // =========================================================================
    // POST PAGE VIDEO CAPTURE
    // =========================================================================

    const capturedVideoUrls = new Set(); // Track captured videos to avoid duplicates

    /**
     * Capture first frame from video element and cache it
     */
    async function captureVideoFrame(video, videoUrl) {
        if (capturedVideoUrls.has(videoUrl)) return;

        // Check if already cached
        const cached = await getCachedThumbnail(videoUrl);
        if (cached) {
            debugLog('Video already cached:', videoUrl);
            capturedVideoUrls.add(videoUrl);
            return;
        }

        try {
            // Wait for video to have enough data
            if (video.readyState < 2) {
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
                    video.addEventListener('loadeddata', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                });
            }

            // Only seek if video is paused and near the start
            // Don't disrupt active playback
            if (video.paused && video.currentTime < 1) {
                const seekTo = Math.min(2, video.duration * 0.1);
                video.currentTime = seekTo;
                await new Promise(resolve => {
                    video.addEventListener('seeked', resolve, { once: true });
                });
            }

            // Capture frame at current position
            const canvas = document.createElement('canvas');
            canvas.width = CONFIG.thumbnailSize;
            canvas.height = CONFIG.thumbnailSize;
            const ctx = canvas.getContext('2d');

            const aspect = video.videoWidth / video.videoHeight;
            let dw, dh, dx, dy;
            if (aspect > 1) {
                dh = canvas.height;
                dw = dh * aspect;
                dx = (canvas.width - dw) / 2;
                dy = 0;
            } else {
                dw = canvas.width;
                dh = dw / aspect;
                dx = 0;
                dy = (canvas.height - dh) / 2;
            }

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, dx, dy, dw, dh);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            // Cache it
            await cacheThumbnail(videoUrl, dataUrl, video.duration);
            capturedVideoUrls.add(videoUrl);

            debugLog('Captured and cached video frame:', videoUrl);
        } catch (e) {
            debugLog('Failed to capture video frame:', e.message);
        }
    }

    /**
     * Setup video frame capture on post pages
     * Monitors video elements and captures frames when they load/play
     */
    function initPostPageCapture() {
        if (!isPostPage()) return;

        debugLog('Setting up post page video capture');

        // Find all video elements on the page
        const setupVideoCapture = () => {
            document.querySelectorAll('video').forEach(video => {
                if (video.dataset.captureSetup) return;
                video.dataset.captureSetup = 'true';

                // Get video URL from src or source element
                let videoUrl = video.src || video.querySelector('source')?.src;
                if (!videoUrl) return;

                // Normalize URL
                if (videoUrl.startsWith('/')) {
                    videoUrl = window.location.origin + videoUrl;
                }

                debugLog('Found video on post page:', videoUrl);

                // Capture on various events
                const doCapture = () => captureVideoFrame(video, videoUrl);

                // Try to capture when video has data
                if (video.readyState >= 2) {
                    doCapture();
                } else {
                    video.addEventListener('loadeddata', doCapture, { once: true });
                }

                // Also capture on play (in case loadeddata already fired)
                video.addEventListener('play', doCapture, { once: true });
            });
        };

        // Initial setup
        setupVideoCapture();

        // Watch for dynamically added videos
        const observer = new MutationObserver(mutations => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                setupVideoCapture();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // =========================================================================
    // CLEANUP
    // =========================================================================

    function cleanup() {
        closeGallery();
        galleryOverlay?.remove();
        galleryOverlay = null;

        if (galleryDocumentHandlerBound) {
            document.removeEventListener('click', handleGalleryClick, true);
            galleryDocumentHandlerBound = false;
        }

        // Remove keyboard listener
        document.removeEventListener('keydown', handleGalleryKeyboard, true);

        videoThumbnailObserver?.disconnect();
        videoThumbnailObserver = null;

        videoThumbnailQueue = [];
        apiQueue = [];
        postDataCache.clear();
        pendingRequests.clear();
        userPostsCache.clear();
        fetchedOffsets.clear();
        pendingBatchFetches.clear();
        preloadedMedia.clear();
        selectedPosts.clear();
        bulkActionBar?.remove();
        bulkActionBar = null;
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    async function init() {
        // Initialize thumbnail cache for both user pages and post pages
        await initThumbnailCache();

        // On post pages, just set up video capture
        if (isPostPage()) {
            debugLog('Initializing v3.10.4 (post page capture mode)');
            initPostPageCapture();
            return;
        }

        // On user list pages, run full initialization
        if (!isUserPage()) {
            debugLog('Not a user page, skipping');
            return;
        }

        debugLog('Initializing v3.10.4');

        // Initialize navigation observer for SPA navigation
        initNavigationObserver();

        getUserAvatarUrl();
        injectStyles();
        createSettingsUI();
        createBulkActionBar();
        initVideoThumbnailObserver();

        setupPostCards();

        // Process GIFs for hover-to-play
        if (settings.pauseGifsWhenHidden) {
            processPageGifs();
        }

        const mutationObserver = new MutationObserver(mutations => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                setupPostCards();
                if (settings.pauseGifsWhenHidden) processPageGifs();
            }
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('beforeunload', cleanup);

        debugLog('Initialized');
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();