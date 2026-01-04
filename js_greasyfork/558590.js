// ==UserScript==
// @name         Coomer BetterUI
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/mp4box@0.5.2/dist/mp4box.all.min.js
// @version      3.4.2
// @description  Video thumbnails, modal gallery carousel, avatar placeholders, Pinterest-style layout
// @author       xxxchimp
// @license      MIT
// @match        https://coomer.st/*/user/*
// @match        https://coomer.su/*/user/*
// @match        https://kemono.su/*/user/*
// @match        https://kemono.party/*/user/*
// @match        https://kemono.cr/*/user/*
// @grant        GM_xmlhttpRequest
// @connect      coomer.st
// @connect      coomer.su
// @connect      kemono.su
// @connect      kemono.party
// @connect      kemono.cr
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
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558590/Coomer%20BetterUI.user.js
// @updateURL https://update.greasyfork.org/scripts/558590/Coomer%20BetterUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        seekTime: 2,
        maxConcurrentVideo: 3,
        maxConcurrentApi: 8,
        retryDelay: 200,
        videoExtensions: ['.mp4', '.webm', '.mov', '.m4v', '.mkv', '.avi', '.m3u8'],
        imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'],
        archiveExtensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
        audioExtensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
        documentExtensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.psd', '.ai'],
        debug: false,
        analyzeMp4Atoms: false, // Set to true to enable MP4 structure analysis in console
        pauseGifsWhenHidden: true // Unload GIFs when scrolled out of view to save memory
    };

    /**
     * Analyze MP4 atom structure to find moov location
     * MP4 files are structured as boxes: [4-byte size][4-byte type][data]
     */
    function analyzeMp4Atoms(url) {
        return new Promise(async (resolve) => {
            // Fetch first 64KB to analyze atom structure
            let finalUrl;
            try {
                finalUrl = await resolveRedirectUrl(url);
            } catch (e) {
                finalUrl = url;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: finalUrl,
                responseType: 'arraybuffer',
                headers: {
                    'Range': 'bytes=0-65535'
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const buffer = response.response;
                        const atoms = parseMp4Atoms(buffer);

                        const filename = url.split('/').pop();
                        console.group(`[MP4 Analysis] ${filename}`);
                        console.log('URL:', finalUrl);
                        console.log('First 64KB atom structure:');

                        let moovFound = false;
                        let mdatFound = false;
                        let moovPosition = null;
                        let mdatPosition = null;

                        atoms.forEach((atom, i) => {
                            const posKB = (atom.offset / 1024).toFixed(1);
                            const sizeInfo = atom.size === 0 ? 'extends to EOF' :
                                           atom.size === 1 ? `extended size` :
                                           `${(atom.size / 1024).toFixed(1)}KB`;
                            console.log(`  ${i + 1}. [${atom.type}] offset: ${posKB}KB, size: ${sizeInfo}`);

                            if (atom.type === 'moov') {
                                moovFound = true;
                                moovPosition = atom.offset;
                            }
                            if (atom.type === 'mdat') {
                                mdatFound = true;
                                mdatPosition = atom.offset;
                            }
                        });

                        if (moovFound && mdatFound) {
                            if (moovPosition < mdatPosition) {
                                console.log('%c✓ FASTSTART: moov before mdat (good for streaming)', 'color: green; font-weight: bold');
                            } else {
                                console.log('%c✗ NOT FASTSTART: mdat before moov (moov at end of file)', 'color: red; font-weight: bold');
                            }
                        } else if (mdatFound && !moovFound) {
                            console.log('%c✗ moov NOT in first 64KB - likely at end of file', 'color: red; font-weight: bold');
                        } else if (moovFound) {
                            console.log('%c✓ moov found in first 64KB', 'color: green');
                        }

                        console.groupEnd();

                        resolve({
                            atoms,
                            moovFound,
                            mdatFound,
                            moovPosition,
                            mdatPosition,
                            isFaststart: moovFound && mdatFound && moovPosition < mdatPosition
                        });
                    } else {
                        console.warn('[MP4 Analysis] Failed to fetch:', response.status);
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                timeout: 15000
            });
        });
    }

    /**
     * Parse MP4 atoms from ArrayBuffer
     */
    function parseMp4Atoms(buffer) {
        const view = new DataView(buffer);
        const atoms = [];
        let offset = 0;

        while (offset < buffer.byteLength - 8) {
            try {
                // Read atom size (4 bytes, big-endian)
                let size = view.getUint32(offset, false);

                // Read atom type (4 bytes ASCII)
                const type = String.fromCharCode(
                    view.getUint8(offset + 4),
                    view.getUint8(offset + 5),
                    view.getUint8(offset + 6),
                    view.getUint8(offset + 7)
                );

                // Validate atom type (should be printable ASCII)
                if (!/^[a-zA-Z0-9©\-_ ]{4}$/.test(type) && !/^[\x00-\x7F]{4}$/.test(type)) {
                    break;
                }

                // Handle extended size (size == 1 means 64-bit size follows)
                let actualSize = size;
                if (size === 1 && offset + 16 <= buffer.byteLength) {
                    // 64-bit extended size
                    const high = view.getUint32(offset + 8, false);
                    const low = view.getUint32(offset + 12, false);
                    actualSize = high * 0x100000000 + low;
                }

                atoms.push({
                    type: type,
                    size: size,
                    actualSize: actualSize,
                    offset: offset
                });

                // size 0 means atom extends to end of file
                if (size === 0) break;

                // Move to next atom
                offset += (size === 1) ? actualSize : size;

                // Safety limit
                if (atoms.length > 50) break;

            } catch (e) {
                break;
            }
        }

        return atoms;
    }

    const FILE_ICONS = {
        video: '🎬',
        image: '🖼️',
        archive: '📦',
        audio: '🎵',
        document: '📄',
        other: '📎'
    };

    // Queue management
    let videoThumbnailQueue = [];
    let activeVideoProcesses = 0;
    let apiQueue = [];

    // Cache for batch-fetched user posts - keyed by "{baseUrl}/{service}/user/{userId}"
    const userPostsCache = new Map();
    // Track ongoing batch fetches to avoid duplicates
    const pendingBatchFetches = new Map();
    let activeApiProcesses = 0;

    // Caches
    const postDataCache = new Map();
    const pendingRequests = new Map();

    // User avatar URL (cached from page)
    let userAvatarUrl = null;

    // Intersection Observer for lazy loading video thumbnails
    let videoThumbnailObserver = null;

    // Intersection Observer for pausing GIFs when out of view
    let gifPauseObserver = null;
    // Track observed GIFs to avoid re-observing
    const observedGifs = new WeakSet();
    // Placeholder for unloaded GIFs (1x1 transparent pixel)
    const GIF_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // Gallery state
    let galleryOverlay = null;
    let galleryCurrentIndex = 0;
    let galleryMediaItems = [];
    let galleryPostUrl = null;

    /**
     * Check if current page is a user page
     */
    function isUserPage() {
        return /\/[^/]+\/user\/[^/]+/.test(window.location.pathname);
    }

    /**
     * Extract user avatar URL from page
     */
    function getUserAvatarUrl() {
        if (userAvatarUrl) return userAvatarUrl;

        // Primary selector path
        const avatarImg = document.querySelector('#main > section.site-section--user > header.user-header > a.user-header__avatar > picture.fancy-image__picture > img.fancy-image__image');
        if (avatarImg && avatarImg.src) {
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
            if (img && img.src) {
                userAvatarUrl = img.src;
                return userAvatarUrl;
            }
        }

        return null;
    }

    /**
     * Inject custom CSS for Pinterest-style flexbox card layout
     */
    function injectStyles() {
        const css = `
        .paginator>menu {
            display: flex;
            justify-self: flex-start;
        }

        .card-list .card-list__items .post-card {
            height: initial;
        }

        .card-list .card-list__items {
            --card-size: 242px !important;
        }

        /* Flexbox container for cards */
        .card-list--legacy,
        .card-list__items {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
            padding: 16px !important;
            max-width: 1600px;
            margin: 0 auto;
            justify-content: flex-start !important;
        }

        /* Card width calculation for 5 columns */
        .card-list__items .post-card {
            flex: 0 0 calc((100% - 64px) / 5) !important;
            display: flex !important;
            flex-direction: column !important;
            background: #1e1e1e !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            text-decoration: none !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }

        .card-list__items .post-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
        }

        /* Thumbnail container */
        .card-list__items .post-card .card-thumbnail-wrapper {
            width: 100% !important;
            aspect-ratio: 4 / 3 !important;
            overflow: hidden !important;
            background: #2a2a2a !important;
            position: relative !important;
            flex-shrink: 0 !important;
        }

        .card-list__items .post-card .card-thumbnail-wrapper img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        /* Existing site thumbnails */
        .card-list__items .post-card .post-card__image-container img {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .card-list__items .post-card .post__thumbnail .image-link,
        .card-list__items .post-card .post__thumbnail img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        /* Generated thumbnail containers */
        .card-list__items .post-card .generated-thumbnail,
        .card-list__items .post-card .thumbnail-placeholder,
        .card-list__items .post-card .thumbnail-loading,
        .card-list__items .post-card .avatar-placeholder {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }

        /* Avatar placeholder styling */
        .avatar-placeholder {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%) !important;
            overflow: hidden !important;
        }

        .avatar-placeholder img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            filter: blur(8px) !important;
            transform: scale(1.1) !important;
            opacity: 0.7 !important;
        }

        .avatar-placeholder .loading-spinner {
            position: absolute !important;
            width: 32px !important;
            height: 32px !important;
            border: 3px solid rgba(255,255,255,0.2) !important;
            border-top-color: rgba(255,255,255,0.8) !important;
            border-radius: 50% !important;
            animation: spin 1s linear infinite !important;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* File count overlay */
        .file-count-overlay {
            position: absolute !important;
            top: 6px !important;
            left: 6px !important;
            background: rgba(0,0,0,0.75) !important;
            color: white !important;
            padding: 3px 8px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            display: flex !important;
            gap: 6px !important;
            z-index: 10 !important;
            pointer-events: none !important;
        }

        /* Duration overlay */
        .duration-overlay {
            position: absolute !important;
            bottom: 6px !important;
            right: 6px !important;
            background: rgba(0,0,0,0.8) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            font-family: monospace !important;
            z-index: 10 !important;
            pointer-events: none !important;
        }

        /* Video play indicator */
        .video-play-indicator {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 48px !important;
            height: 48px !important;
            background: rgba(0,0,0,0.6) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-size: 20px !important;
            z-index: 5 !important;
            pointer-events: none !important;
            opacity: 0.9 !important;
        }

        /* Retry indicator on hover */
        .video-play-indicator.retry-available {
            cursor: pointer !important;
            pointer-events: auto !important;
        }

        .video-play-indicator.retry-available:hover {
            background: rgba(0,0,0,0.8) !important;
            transform: translate(-50%, -50%) scale(1.1) !important;
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

        /* Image collage container */
        .image-collage {
            background: #11171c;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            justify-content: space-between;
            flex-wrap: wrap !important;
            overflow: hidden !important;
        }

        /* Single image - full size */
        .image-collage.collage-1 .collage-img {
            width: 100% !important;
            height: 100% !important;
        }

        /* Two images - side by side */
        .image-collage.collage2 {
        flex-wrap: nowrap !important;
        }
        .image-collage.collage-2 img.collage-img {
            width: 50% !important;
            height: 100% !important;
        }

        /* Three images - one large left, two stacked right */
        .image-collage.collage-3 {
            flex-wrap: nowrap !important;
        }
        .image-collage.collage-3 > .collage-img:first-child {
            width: 58% !important;
            height: 100% !important;
            border-radius: 5px;
        }
        .image-collage.collage-3 .collage-right {
            width: 40% !important;
            height: 100% !important;
            display: flex !important;
            justify-content: space-between;
            flex-direction: column !important;
        }
        .image-collage.collage-3 .collage-right .collage-img {
            width: 100% !important;
            height: 48% !important;
            border-radius: 5px;
        }

        .collage-img {
            object-fit: cover !important;
            flex-shrink: 0 !important;
        }

        /* More images indicator */
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
            pointer-events: none !important;
        }

        /* Responsive: 4 columns */
        @media (max-width: 1400px) {
            .card-list .card-list__items .post-card {
                flex: 0 0 calc((100% - 48px) / 4) !important;
            }
        }

        /* Responsive: 3 columns */
        @media (max-width: 1100px) {
            .card-list .card-list__items .post-card {
                flex: 0 0 calc((100% - 32px) / 3) !important;
            }
        }

        /* Responsive: 2 columns */
        @media (max-width: 768px) {
            .card-list--legacy,
            .card-list__items {
                gap: 12px !important;
                padding: 12px !important;
            }
            .card-list .card-list__items .post-card {
                flex: 0 0 calc((100% - 12px) / 2) !important;
                max-width: calc((100% - 12px) / 2) !important;
            }
        }

        /* Responsive: 1 column */
        @media (max-width: 480px) {
            .card-list .card-list__items .post-card {
                flex: 0 0 100% !important;
                max-width: 100% !important;
            }
        }

        /* Modal Gallery Overlay */
        .media-gallery-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.95) !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease !important;
        }

        .media-gallery-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* Close button */
        .gallery-close {
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            width: 44px !important;
            height: 44px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 50% !important;
            color: white !important;
            font-size: 24px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background 0.2s ease !important;
            z-index: 10 !important;
        }

        .gallery-close:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }

        /* Gallery container */
        .gallery-container {
            position: relative !important;
            width: 90vw !important;
            height: 80vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* Media item wrapper */
        .gallery-media-wrapper {
            max-width: 100% !important;
            max-height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .gallery-media-wrapper img,
        .gallery-media-wrapper video {
            max-width: 90vw !important;
            max-height: 75vh !important;
            object-fit: contain !important;
            border-radius: 4px !important;
        }

        .gallery-media-wrapper video {
            background: #000 !important;
        }

        /* Navigation arrows */
        .gallery-nav {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 48px !important;
            height: 48px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 50% !important;
            color: white !important;
            font-size: 24px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background 0.2s ease, transform 0.2s ease !important;
            z-index: 10 !important;
        }

        .gallery-nav:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: translateY(-50%) scale(1.1) !important;
        }

        .gallery-nav:disabled {
            opacity: 0.3 !important;
            cursor: not-allowed !important;
        }

        .gallery-nav.prev {
            left: 16px !important;
        }

        .gallery-nav.next {
            right: 16px !important;
        }

        /* Counter */
        .gallery-counter {
            position: absolute !important;
            bottom: 16px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            font-size: 14px !important;
            font-family: monospace !important;
        }

        /* Thumbnail strip */
        .gallery-thumbnails {
            position: absolute !important;
            bottom: 60px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex !important;
            gap: 8px !important;
            padding: 8px !important;
            background: rgba(0, 0, 0, 0.5) !important;
            border-radius: 8px !important;
            max-width: 80vw !important;
            overflow-x: auto !important;
        }

        .gallery-thumb {
            width: 60px !important;
            height: 60px !important;
            border-radius: 4px !important;
            object-fit: cover !important;
            cursor: pointer !important;
            opacity: 0.5 !important;
            transition: opacity 0.2s ease, transform 0.2s ease !important;
            border: 2px solid transparent !important;
            flex-shrink: 0 !important;
        }

        .gallery-thumb:hover {
            opacity: 0.8 !important;
        }

        .gallery-thumb.active {
            opacity: 1 !important;
            border-color: white !important;
        }

        .gallery-thumb.video-thumb::after {
            content: '▶' !important;
            position: absolute !important;
            color: white !important;
            font-size: 12px !important;
        }

        /* Loading spinner in gallery */
        .gallery-loading {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
            color: white !important;
        }

        /* Gallery download buttons */
        .gallery-download-all {
            position: absolute !important;
            top: 16px !important;
            right: 70px !important;
            height: 44px !important;
            padding: 0 16px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 22px !important;
            color: white !important;
            font-size: 14px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: background 0.2s ease !important;
            z-index: 10 !important;
        }

        .gallery-download-all:hover {
            background: rgba(255, 255, 255, 0.25) !important;
        }

        .gallery-download-all:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }

        .gallery-download-all .download-progress {
            font-size: 12px !important;
            opacity: 0.8 !important;
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
            transition: background 0.2s ease, transform 0.2s ease !important;
            z-index: 10 !important;
        }

        .gallery-item-download:hover {
            background: rgba(0, 0, 0, 0.9) !important;
            transform: scale(1.1) !important;
        }

        .gallery-item-download:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }

        .gallery-item-download.downloading {
            animation: pulse 1s infinite !important;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* Media wrapper needs relative positioning for download button */
        .gallery-media-wrapper {
            position: relative !important;
        }

        .gallery-loading .loading-spinner {
            width: 48px !important;
            height: 48px !important;
            border: 4px solid rgba(255,255,255,0.2) !important;
            border-top-color: rgba(255,255,255,0.8) !important;
            border-radius: 50% !important;
            animation: spin 1s linear infinite !important;
        }

        /* Post info in gallery */
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
        `;

        const style = document.createElement('style');
        style.id = 'coomer-thumb-styles';
        style.textContent = css;
        document.head.appendChild(style);
        debugLog('Injected flexbox CSS');
    }

    /**
     * Log debug messages
     */
    function debugLog(message, data = null) {
        if (CONFIG.debug) {
            console.log(`[CoomerThumb] ${message}`, data || '');
        }
    }

    /**
     * Detect file type from path
     */
    function getFileType(path) {
        if (!path) return 'other';
        const lowerPath = path.toLowerCase();

        if (CONFIG.videoExtensions.some(ext => lowerPath.includes(ext))) return 'video';
        if (CONFIG.imageExtensions.some(ext => lowerPath.includes(ext))) return 'image';
        if (CONFIG.archiveExtensions.some(ext => lowerPath.includes(ext))) return 'archive';
        if (CONFIG.audioExtensions.some(ext => lowerPath.includes(ext))) return 'audio';
        if (CONFIG.documentExtensions.some(ext => lowerPath.includes(ext))) return 'document';

        return 'other';
    }

    /**
     * Count files by type from API response
     */
    function countFileTypes(postData) {
        const counts = { video: 0, image: 0, archive: 0, audio: 0, document: 0, other: 0 };
        const post = postData.post || postData;

        if (post.file && post.file.path) {
            counts[getFileType(post.file.path)]++;
        }

        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path) {
                    counts[getFileType(att.path)]++;
                }
            });
        }

        return counts;
    }

    /**
     * Generate HTML for file type icons
     */
    function generateFileIconsHtml(counts) {
        const parts = [];
        const order = ['video', 'image', 'audio', 'archive', 'document', 'other'];

        for (const type of order) {
            if (counts[type] > 0) {
                parts.push(`<span title="${counts[type]} ${type}${counts[type] > 1 ? 's' : ''}">${FILE_ICONS[type]}${counts[type] > 1 ? counts[type] : ''}</span>`);
            }
        }

        return parts.join(' ');
    }

    /**
     * Format duration to mm:ss or hh:mm:ss
     */
    function formatDuration(seconds) {
        if (!seconds || !isFinite(seconds)) return '';

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Parse post URL to extract service, user, post ID
     */
    function parsePostUrl(url) {
        try {
            const urlObj = new URL(url);
            const match = urlObj.pathname.match(/^\/([^/]+)\/user\/([^/]+)\/post\/([^/]+)/);
            if (match) {
                // TEMPORARY FIX: Skip account URLs
                if (match[1] === 'account') {
                    debugLog('Skipping account URL:', url);
                    return null;
                }
                return {
                    baseUrl: urlObj.origin,
                    service: match[1],
                    userId: match[2],
                    postId: match[3]
                };
            }
        } catch (e) {
            debugLog('Failed to parse URL:', url);
        }
        return null;
    }

    /**
     * Fetch JSON from API using GM_xmlhttpRequest
     * Includes request deduplication to prevent memory leaks
     */
    function fetchJson(url) {
        // TEMPORARY FIX: Block account/* endpoint requests
        if (url.includes('/account')) {
            debugLog('Blocked account endpoint request:', url);
            return Promise.reject(new Error('Account endpoint blocked'));
        }

        // Check if request already pending
        if (pendingRequests.has(url)) {
            return pendingRequests.get(url);
        }

        const promise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'text',
                headers: { 'Accept': 'text/css' },
                onload: function(response) {
                    pendingRequests.delete(url);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            reject(new Error('Invalid JSON'));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(e) {
                    pendingRequests.delete(url);
                    reject(e);
                },
                ontimeout: function() {
                    pendingRequests.delete(url);
                    reject(new Error('Timeout'));
                },
                timeout: 30000
            });
        });

        pendingRequests.set(url, promise);
        return promise;
    }

    /**
     * Extract video URLs from API response
     */
    function extractVideoUrlsFromApi(postData, baseUrl) {
        const videoUrls = [];
        const post = postData.post || postData;

        const isVideo = (path) => {
            if (!path) return false;
            return CONFIG.videoExtensions.some(ext => path.toLowerCase().includes(ext));
        };

        const toFullUrl = (path) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            if (path.startsWith('/')) return `${baseUrl}${path}`;
            return `${baseUrl}/data/${path}`;
        };

        if (post.file && post.file.path && isVideo(post.file.path)) {
            const url = toFullUrl(post.file.path);
            if (url) videoUrls.push(url);
        }

        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path && isVideo(att.path)) {
                    const url = toFullUrl(att.path);
                    if (url) videoUrls.push(url);
                }
            });
        }

        if (post.embed && post.embed.url && isVideo(post.embed.url)) {
            videoUrls.push(post.embed.url);
        }

        return [...new Set(videoUrls)];
    }

    /**
     * Extract image URLs from API response
     */
    function extractImageUrlsFromApi(postData, baseUrl) {
        const imageUrls = [];
        const post = postData.post || postData;

        const isImage = (path) => {
            if (!path) return false;
            return CONFIG.imageExtensions.some(ext => path.toLowerCase().includes(ext));
        };

        const toFullUrl = (path) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            if (path.startsWith('/')) return `${baseUrl}${path}`;
            return `${baseUrl}/data/${path}`;
        };

        if (post.file && post.file.path && isImage(post.file.path)) {
            const url = toFullUrl(post.file.path);
            if (url) imageUrls.push(url);
        }

        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path && isImage(att.path)) {
                    const url = toFullUrl(att.path);
                    if (url) imageUrls.push(url);
                }
            });
        }

        return [...new Set(imageUrls)];
    }

    /**
     * Resolve redirect to get final URL (follows 301/302 redirects)
     */
    function resolveRedirectUrl(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: url,
                onload: function(response) {
                    // finalUrl contains the URL after all redirects
                    const finalUrl = response.finalUrl || url;
                    if (finalUrl !== url) {
                        debugLog('Redirect resolved:', url, '->', finalUrl);
                    }
                    resolve(finalUrl);
                },
                onerror: function() {
                    // If HEAD fails, try with the original URL
                    resolve(url);
                },
                ontimeout: function() {
                    resolve(url);
                },
                timeout: 10000
            });
        });
    }

    /**
     * Fetch video as blob with proper cleanup tracking
     * Resolves redirects first to handle mirror switching
     * Supports: 'start' (first 5MB), 'end' (last 10MB), 'full' (entire file), 'combined' (start + end for non-faststart)
     */
    function fetchVideoAsBlob(videoUrl, rangeMode = 'start') {
        return new Promise(async (resolve, reject) => {
            // First resolve any redirects to get the actual mirror URL
            let finalUrl;
            try {
                finalUrl = await resolveRedirectUrl(videoUrl);
            } catch (e) {
                finalUrl = videoUrl;
            }

            const headers = { 'Accept': '*/*' };

            if (rangeMode === 'start') {
                headers['Range'] = 'bytes=0-5242880'; // First 5MB
            } else if (rangeMode === 'end') {
                headers['Range'] = 'bytes=-10485760'; // Last 10MB (negative range)
            }
            // 'full' mode - no Range header

            GM_xmlhttpRequest({
                method: 'GET',
                url: finalUrl,
                responseType: 'blob',
                headers: headers,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const blobUrl = URL.createObjectURL(response.response);
                        resolve({ blobUrl, finalUrl, rangeMode });
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout')),
                timeout: 120000 // Longer timeout for full file
            });
        });
    }

    /**
     * Fetch video thumbnail using mp4box.js for proper MP4 parsing
     * Uses MediaSource Extensions for playback of fragmented MP4
     */
    function fetchCombinedVideoBlob(videoUrl) {
        return new Promise(async (resolve, reject) => {
            // Check if MP4Box is available
            if (typeof MP4Box === 'undefined') {
                debugLog('MP4Box not available, falling back');
                reject(new Error('MP4Box not loaded'));
                return;
            }

            let finalUrl;
            try {
                finalUrl = await resolveRedirectUrl(videoUrl);
            } catch (e) {
                finalUrl = videoUrl;
            }

            const fileSize = await getFileSize(videoUrl);
            if (!fileSize) {
                reject(new Error('Could not determine file size'));
                return;
            }

            debugLog(`File size: ${(fileSize / 1048576).toFixed(1)}MB, using mp4box.js`);

            try {
                const mp4boxFile = MP4Box.createFile();
                let videoTrack = null;
                let resolved = false;

                mp4boxFile.onError = (e) => {
                    if (!resolved) {
                        debugLog('MP4Box error:', e);
                        reject(new Error('MP4Box parsing error'));
                    }
                };

                mp4boxFile.onReady = async (info) => {
                    if (resolved) return;

                    debugLog('MP4Box ready, tracks:', info.tracks.length);
                    videoTrack = info.tracks.find(t => t.type === 'video');

                    if (!videoTrack) {
                        reject(new Error('No video track found'));
                        return;
                    }

                    debugLog(`Video: ${videoTrack.codec}, ${videoTrack.video.width}x${videoTrack.video.height}`);

                    try {
                        // Set up segmentation for first few samples
                        mp4boxFile.setSegmentOptions(videoTrack.id, null, { nbSamples: 30 });

                        const initSegs = mp4boxFile.initializeSegmentation();
                        if (!initSegs || initSegs.length === 0) {
                            reject(new Error('Could not create init segment'));
                            return;
                        }

                        // Collect segments
                        const segments = [initSegs[0].buffer];

                        mp4boxFile.onSegment = (id, user, buffer, sampleNum, isLast) => {
                            debugLog(`Segment received: ${buffer.byteLength} bytes, sample ${sampleNum}`);
                            segments.push(buffer);
                        };

                        mp4boxFile.start();

                        // Wait a bit for segments to be processed
                        await new Promise(r => setTimeout(r, 100));

                        if (segments.length < 2) {
                            // Need to fetch sample data from start of file
                            debugLog('Fetching sample data from start');
                            const startBuffer = await fetchArrayBuffer(finalUrl, 0, 5242879);
                            startBuffer.fileStart = 0;
                            mp4boxFile.appendBuffer(startBuffer);
                            mp4boxFile.flush();
                            await new Promise(r => setTimeout(r, 200));
                        }

                        // Create blob from segments
                        const blob = new Blob(segments, { type: 'video/mp4' });

                        // For fMP4, we need to use MSE or create a data URL
                        // Try creating a video that can handle it
                        const blobUrl = URL.createObjectURL(blob);

                        debugLog(`Created fMP4 blob: ${(blob.size / 1024).toFixed(1)}KB with ${segments.length} segments`);

                        resolved = true;
                        resolve({ blobUrl, finalUrl, rangeMode: 'combined' });

                    } catch (e) {
                        if (!resolved) {
                            debugLog('Segmentation failed:', e.message);
                            reject(e);
                        }
                    }
                };

                // First try fetching end for moov
                const endChunkSize = Math.min(10485760, Math.floor(fileSize * 0.15)); // 10MB or 15%
                const endStart = Math.max(0, fileSize - endChunkSize);

                debugLog(`Fetching end: bytes ${endStart}-${fileSize - 1}`);
                const endBuffer = await fetchArrayBuffer(finalUrl, endStart, fileSize - 1);
                endBuffer.fileStart = endStart;
                mp4boxFile.appendBuffer(endBuffer);

                // Also fetch start for ftyp and frame data
                debugLog('Fetching start: bytes 0-5242879');
                const startBuffer = await fetchArrayBuffer(finalUrl, 0, 5242879);
                startBuffer.fileStart = 0;
                mp4boxFile.appendBuffer(startBuffer);

                mp4boxFile.flush();

                // Timeout fallback
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        reject(new Error('MP4Box timeout'));
                    }
                }, 15000);

            } catch (e) {
                debugLog('MP4Box processing failed:', e.message);
                reject(e);
            }
        });
    }

    /**
     * Fetch array buffer with Range header
     */
    function fetchArrayBuffer(url, start, end) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                headers: { 'Range': `bytes=${start}-${end}` },
                onload: (r) => {
                    if (r.status >= 200 && r.status < 300) {
                        resolve(r.response);
                    } else {
                        reject(new Error(`HTTP ${r.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout')),
                timeout: 60000
            });
        });
    }

    /**
     * Find moov atom by scanning for signature (fallback)
     */
    function findMoovAtom(buffer) {
        const view = new DataView(buffer);
        const moovSig = [0x6D, 0x6F, 0x6F, 0x76];

        for (let i = 0; i < buffer.byteLength - 8; i++) {
            if (view.getUint8(i) === moovSig[0] &&
                view.getUint8(i + 1) === moovSig[1] &&
                view.getUint8(i + 2) === moovSig[2] &&
                view.getUint8(i + 3) === moovSig[3]) {
                if (i >= 4) {
                    const size = view.getUint32(i - 4, false);
                    if (size > 8 && size < buffer.byteLength * 2) {
                        return { type: 'moov', offset: i - 4, size: size };
                    }
                }
            }
        }
        return null;
    }

    /**
     * Get file size via HEAD request
     */
    function getFileSize(url) {
        return new Promise(async (resolve) => {
            let finalUrl;
            try {
                finalUrl = await resolveRedirectUrl(url);
            } catch (e) {
                finalUrl = url;
            }

            GM_xmlhttpRequest({
                method: 'HEAD',
                url: finalUrl,
                onload: function(response) {
                    const contentLength = response.responseHeaders.match(/content-length:\s*(\d+)/i);
                    if (contentLength) {
                        resolve(parseInt(contentLength[1], 10));
                    } else {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null),
                timeout: 10000
            });
        });
    }

    /**
     * Generate thumbnail from video URL with proper resource cleanup
     * Tries: start of file -> combined (start+end) -> full file (if small)
     */
    function generateThumbnail(videoUrl) {
        return new Promise(async (resolve, reject) => {
            // Analyze MP4 structure if enabled
            if (CONFIG.analyzeMp4Atoms && videoUrl.toLowerCase().includes('.mp4')) {
                analyzeMp4Atoms(videoUrl);
            }

            let blobUrl = null;
            let video = null;
            let timeoutId = null;
            let isCleanedUp = false;
            let currentAttempt = 0;
            const maxAttempts = 3; // start, combined, full
            const attemptModes = ['start', 'combined', 'full'];

            const cleanup = () => {
                if (isCleanedUp) return;
                isCleanedUp = true;

                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }

                if (video) {
                    video.onloadedmetadata = null;
                    video.onseeked = null;
                    video.onerror = null;
                    video.src = '';
                    video.load();
                    video = null;
                }

                if (blobUrl) {
                    URL.revokeObjectURL(blobUrl);
                    blobUrl = null;
                }
            };

            const cleanupCurrentAttempt = () => {
                if (video) {
                    video.onloadedmetadata = null;
                    video.onseeked = null;
                    video.onerror = null;
                    video.src = '';
                    video.load();
                    video = null;
                }
                if (blobUrl) {
                    URL.revokeObjectURL(blobUrl);
                    blobUrl = null;
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            };

            const attemptWithMode = async (mode) => {
                // For full file mode, check size first
                if (mode === 'full') {
                    const fileSize = await getFileSize(videoUrl);
                    // Higher limit for full download (100MB) - last resort for non-faststart
                    if (fileSize && fileSize > 104857600) {
                        debugLog('File too large for full download:', (fileSize / 1048576).toFixed(1) + 'MB');
                        cleanup();
                        reject(new Error('File too large'));
                        return;
                    }
                    debugLog(`Full file download: ${(fileSize / 1048576).toFixed(1)}MB`);
                }

                debugLog(`Thumbnail attempt ${currentAttempt + 1}/${maxAttempts}: ${mode} mode`);

                try {
                    if (mode === 'combined') {
                        const result = await fetchCombinedVideoBlob(videoUrl);
                        blobUrl = result.blobUrl;
                    } else {
                        const result = await fetchVideoAsBlob(videoUrl, mode);
                        blobUrl = result.blobUrl;
                    }
                } catch (e) {
                    // Try next mode
                    debugLog(`Mode '${mode}' fetch failed:`, e.message);
                    currentAttempt++;
                    if (currentAttempt < maxAttempts) {
                        attemptWithMode(attemptModes[currentAttempt]);
                    } else {
                        cleanup();
                        reject(e);
                    }
                    return;
                }

                video = document.createElement('video');
                video.muted = true;
                video.preload = 'metadata';
                video.crossOrigin = 'anonymous';

                let videoDuration = 0;

                // For combined mode (fMP4), try MSE first
                if (mode === 'combined' && typeof MediaSource !== 'undefined') {
                    // Try common codec combinations
                    const codecStrings = [
                        'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
                        'video/mp4; codecs="avc1.4D401F,mp4a.40.2"',
                        'video/mp4; codecs="avc1.64001F,mp4a.40.2"',
                        'video/mp4; codecs="avc1.42E01E"',
                        'video/mp4'
                    ];

                    const supportedCodec = codecStrings.find(c => MediaSource.isTypeSupported(c));

                    if (supportedCodec) {
                        debugLog('Using MSE for fMP4 playback, codec:', supportedCodec);

                        const mediaSource = new MediaSource();
                        video.src = URL.createObjectURL(mediaSource);

                        mediaSource.addEventListener('sourceopen', async () => {
                            try {
                                const sourceBuffer = mediaSource.addSourceBuffer(supportedCodec);

                                // Fetch the blob data
                                const response = await fetch(blobUrl);
                                const data = await response.arrayBuffer();

                                sourceBuffer.appendBuffer(data);

                                sourceBuffer.addEventListener('updateend', () => {
                                    if (mediaSource.readyState === 'open') {
                                        try {
                                            mediaSource.endOfStream();
                                        } catch(e) {}
                                    }
                                });
                            } catch (e) {
                                debugLog('MSE append failed:', e.message);
                                // Fall back to direct blob URL
                                video.src = blobUrl;
                                video.load();
                            }
                        });

                        mediaSource.addEventListener('error', () => {
                            debugLog('MSE error, falling back to direct playback');
                            video.src = blobUrl;
                            video.load();
                        });
                    } else {
                        debugLog('MSE not supported for this codec, trying direct playback');
                        video.src = blobUrl;
                        video.load();
                    }
                } else {
                    // Regular blob URL playback
                    video.src = blobUrl;
                    video.load();
                }

                timeoutId = setTimeout(() => {
                    // Timeout on current attempt, try next
                    debugLog(`Mode '${mode}' timeout`);
                    cleanupCurrentAttempt();
                    currentAttempt++;
                    if (currentAttempt < maxAttempts) {
                        attemptWithMode(attemptModes[currentAttempt]);
                    } else {
                        isCleanedUp = true;
                        reject(new Error('Timeout'));
                    }
                }, 15000); // Shorter timeout per attempt

                video.onloadedmetadata = function() {
                    if (isCleanedUp) return;
                    videoDuration = video.duration;
                    const seekTo = Math.min(CONFIG.seekTime, videoDuration * 0.1);
                    video.currentTime = seekTo;
                };

                video.onseeked = function() {
                    if (isCleanedUp) return;

                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = CONFIG.thumbnailWidth;
                        canvas.height = CONFIG.thumbnailHeight;
                        const ctx = canvas.getContext('2d');

                        const videoAspect = video.videoWidth / video.videoHeight;
                        const canvasAspect = canvas.width / canvas.height;

                        let drawWidth, drawHeight, offsetX, offsetY;

                        if (videoAspect > canvasAspect) {
                            drawHeight = canvas.height;
                            drawWidth = drawHeight * videoAspect;
                            offsetX = (canvas.width - drawWidth) / 2;
                            offsetY = 0;
                        } else {
                            drawWidth = canvas.width;
                            drawHeight = drawWidth / videoAspect;
                            offsetX = 0;
                            offsetY = (canvas.height - drawHeight) / 2;
                        }

                        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                        cleanup();
                        resolve({ dataUrl, duration: videoDuration });
                    } catch (e) {
                        cleanup();
                        reject(e);
                    }
                };

                video.onerror = function() {
                    // Try next mode
                    cleanupCurrentAttempt();
                    currentAttempt++;
                    if (currentAttempt < maxAttempts) {
                        debugLog(`Mode '${mode}' video error, trying next`);
                        attemptWithMode(attemptModes[currentAttempt]);
                    } else {
                        isCleanedUp = true;
                        reject(new Error('Video load error'));
                    }
                };
            };

            // Start with first attempt mode
            attemptWithMode(attemptModes[0]);
        });
    }

    /**
     * Check if link has existing thumbnail
     */
    function hasExistingThumbnail(link) {
        const existingThumb = link.querySelector('.post-card__image-container img');
        return existingThumb && existingThumb.src;
    }

    /**
     * Get or create thumbnail wrapper element
     */
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

    /**
     * Insert avatar placeholder with loading spinner
     */
    function insertAvatarPlaceholder(link) {
        const wrapper = getOrCreateThumbnailWrapper(link);

        // Check if placeholder already exists
        if (wrapper.querySelector('.avatar-placeholder')) return;

        const placeholder = document.createElement('div');
        placeholder.className = 'avatar-placeholder';

        const avatarUrl = getUserAvatarUrl();
        if (avatarUrl) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = 'Loading...';
            placeholder.appendChild(img);
        }

        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        placeholder.appendChild(spinner);

        wrapper.appendChild(placeholder);
    }

    /**
     * Remove avatar placeholder
     */
    function removeAvatarPlaceholder(link) {
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (wrapper) {
            const placeholder = wrapper.querySelector('.avatar-placeholder');
            if (placeholder) placeholder.remove();
        }
    }

    /**
     * Add file count overlay to card
     */
    function addFileCountOverlay(link, fileCounts, hasVideos) {
        const wrapper = getOrCreateThumbnailWrapper(link);

        const existingOverlay = wrapper.querySelector('.file-count-overlay');
        if (existingOverlay) existingOverlay.remove();

        const iconsHtml = generateFileIconsHtml(fileCounts);
        if (iconsHtml) {
            const overlay = document.createElement('div');
            overlay.className = 'file-count-overlay';
            overlay.innerHTML = iconsHtml;
            wrapper.appendChild(overlay);
        }

        // Add video play indicator if has videos
        if (hasVideos) {
            let playIndicator = wrapper.querySelector('.video-play-indicator');
            if (!playIndicator) {
                playIndicator = document.createElement('div');
                playIndicator.className = 'video-play-indicator';
                playIndicator.innerHTML = '▶';
                wrapper.appendChild(playIndicator);
            }
        }
    }

    /**
     * Insert generated video thumbnail
     */
    function insertVideoThumbnail(link, thumbnailDataUrl, duration) {
        const wrapper = getOrCreateThumbnailWrapper(link);

        // Remove placeholders and indicators
        removeAvatarPlaceholder(link);

        const playIndicator = wrapper.querySelector('.video-play-indicator');
        if (playIndicator) playIndicator.remove();

        const loading = wrapper.querySelector('.thumbnail-loading');
        if (loading) loading.remove();

        const existingCollage = wrapper.querySelector('.image-collage');
        if (existingCollage) existingCollage.remove();

        // Create thumbnail element
        const thumbEl = document.createElement('div');
        thumbEl.className = 'generated-thumbnail';
        thumbEl.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1a1a1a;
        `;

        const img = document.createElement('img');
        img.src = thumbnailDataUrl;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        img.alt = 'Video thumbnail';
        thumbEl.appendChild(img);

        if (duration) {
            const durationEl = document.createElement('div');
            durationEl.className = 'duration-overlay';
            durationEl.textContent = formatDuration(duration);
            thumbEl.appendChild(durationEl);
        }

        wrapper.appendChild(thumbEl);
        link.dataset.videoThumbnailSuccess = 'true';
    }

    /**
     * Mark thumbnail as failed and enable retry on hover
     */
    function markThumbnailFailed(link, reason) {
        const wrapper = getOrCreateThumbnailWrapper(link);

        removeAvatarPlaceholder(link);

        const loading = wrapper.querySelector('.thumbnail-loading');
        if (loading) loading.remove();

        // Show collage if available
        const existingCollage = wrapper.querySelector('.image-collage');
        if (existingCollage) existingCollage.style.display = 'flex';

        // Update play indicator to show retry state
        let playIndicator = wrapper.querySelector('.video-play-indicator');
        if (!playIndicator) {
            playIndicator = document.createElement('div');
            playIndicator.className = 'video-play-indicator';
            wrapper.appendChild(playIndicator);
        }

        playIndicator.innerHTML = '🔄';
        playIndicator.title = `${reason} - Click to retry`;
        playIndicator.classList.add('retry-available');
        playIndicator.style.display = 'flex';

        link.dataset.videoThumbnailFailed = 'true';
        link.dataset.videoThumbnailProcessed = 'false';
    }

    /**
     * Insert image collage (max 3 images)
     */
    function insertImageCollage(link, imageUrls, totalImages) {
        if (imageUrls.length === 0) return;

        const wrapper = getOrCreateThumbnailWrapper(link);

        const thumbnail = wrapper.querySelector('.post-card__image');
        if (thumbnail) thumbnail.classList.add('hidden');

        const existingCollage = wrapper.querySelector('.image-collage');
        if (existingCollage) existingCollage.remove();

        const displayCount = Math.min(imageUrls.length, 3);
        const collage = document.createElement('div');
        collage.className = `image-collage collage-${displayCount}`;

        if (displayCount === 1) {
            const img = document.createElement('img');
            img.className = 'collage-img';
            img.src = imageUrls[0];
            img.alt = 'Post image';
            img.loading = 'lazy';
            collage.appendChild(img);
        } else if (displayCount === 2) {
            for (let i = 0; i < 2; i++) {
                const img = document.createElement('img');
                img.className = 'collage-img';
                img.src = imageUrls[i];
                img.alt = 'Post image';
                img.loading = 'lazy';
                collage.appendChild(img);
            }
        } else if (displayCount === 3) {
            const img1 = document.createElement('img');
            img1.className = 'collage-img';
            img1.src = imageUrls[0];
            img1.alt = 'Post image';
            img1.loading = 'lazy';
            collage.appendChild(img1);

            const rightCol = document.createElement('div');
            rightCol.className = 'collage-right';

            for (let i = 1; i < 3; i++) {
                const img = document.createElement('img');
                img.className = 'collage-img';
                img.src = imageUrls[i];
                img.alt = 'Post image';
                img.loading = 'lazy';
                rightCol.appendChild(img);
            }
            collage.appendChild(rightCol);
        }

        if (totalImages > displayCount) {
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'collage-more-indicator';
            moreIndicator.textContent = `+${totalImages - displayCount} more`;
            collage.appendChild(moreIndicator);
        }

        wrapper.appendChild(collage);
        link.dataset.collageInserted = 'true';
    }

    /**
     * Initialize Intersection Observer for lazy loading video thumbnails
     */
    function initVideoThumbnailObserver() {
        if (videoThumbnailObserver) return;

        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        videoThumbnailObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;

                    // Skip if already queued or processed
                    if (link.dataset.videoThumbnailQueued === 'true') return;
                    if (link.dataset.videoThumbnailSuccess === 'true') return;

                    // Only process if ready (has video data)
                    if (link.dataset.videoThumbnailReady !== 'true') return;

                    // Queue for thumbnail generation
                    link.dataset.videoThumbnailQueued = 'true';
                    videoThumbnailQueue.push(link);
                    processVideoQueue();

                    // Stop observing this element
                    videoThumbnailObserver.unobserve(link);
                }
            });
        }, options);

        debugLog('Video thumbnail observer initialized');
    }

    /**
     * Initialize Intersection Observer for pausing GIFs when out of view
     * Reduces memory usage on pages with many animated GIFs
     */
    function initGifPauseObserver() {
        if (gifPauseObserver) return;

        const options = {
            root: null,
            rootMargin: '200px', // Start loading slightly before entering viewport
            threshold: 0
        };

        gifPauseObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const img = entry.target;

                if (entry.isIntersecting) {
                    // GIF entering viewport - restore original src
                    if (img.dataset.gifOriginalSrc && img.src !== img.dataset.gifOriginalSrc) {
                        debugLog('Restoring GIF:', img.dataset.gifOriginalSrc.split('/').pop());
                        img.src = img.dataset.gifOriginalSrc;
                    }
                } else {
                    // GIF leaving viewport - unload to save memory
                    if (img.src && img.src !== GIF_PLACEHOLDER && !img.src.startsWith('data:')) {
                        // Only unload if it's actually a loaded GIF (not already placeholder)
                        if (!img.dataset.gifOriginalSrc) {
                            img.dataset.gifOriginalSrc = img.src;
                        }
                        debugLog('Unloading GIF:', img.src.split('/').pop());
                        img.src = GIF_PLACEHOLDER;
                    }
                }
            });
        }, options);

        debugLog('GIF pause observer initialized');
    }

    /**
     * Observe GIF images for pause/resume when scrolling
     */
    function observeGifsOnPage() {
        if (!gifPauseObserver) return;

        // Find all GIF images on the page
        const gifImages = document.querySelectorAll('img[src$=".gif"], img[src*=".gif?"]');
        let newlyObserved = 0;

        gifImages.forEach(img => {
            // Skip if already observed
            if (observedGifs.has(img)) return;

            // Skip tiny images (likely icons/UI elements)
            if (img.naturalWidth > 0 && img.naturalWidth < 50) return;
            if (img.width > 0 && img.width < 50) return;

            // Store original src before observing
            if (!img.dataset.gifOriginalSrc) {
                img.dataset.gifOriginalSrc = img.src;
            }

            observedGifs.add(img);
            gifPauseObserver.observe(img);
            newlyObserved++;
        });

        if (newlyObserved > 0) {
            debugLog(`Observing ${newlyObserved} new GIF(s) for pause/resume`);
        }
    }

    /**
     * Process API queue with concurrency limit
     */
    /**
     * Fetch all posts for a user in batches (50 per request)
     * Much more efficient than individual post API calls
     * API: GET /api/v1/{service}/user/{userId}?o={offset}
     */
    async function fetchUserPostsBatch(baseUrl, service, userId) {
        // TEMPORARY FIX: Block account service requests
        if (service === 'account' || userId === 'account') {
            debugLog('Blocked account batch fetch request');
            return new Map();
        }

        const cacheKey = `${baseUrl}/${service}/user/${userId}`;

        // Return cached data if available
        if (userPostsCache.has(cacheKey)) {
            return userPostsCache.get(cacheKey);
        }

        // Wait for pending fetch if one exists
        if (pendingBatchFetches.has(cacheKey)) {
            return pendingBatchFetches.get(cacheKey);
        }

        // Start batch fetch
        const fetchPromise = (async () => {
            const allPosts = [];
            let offset = 0;
            const batchSize = 50; // API returns 50 per page
            let hasMore = true;

            debugLog(`Batch fetching posts for ${service}/${userId}...`);

            while (hasMore) {
                try {
                    const apiUrl = `${baseUrl}/api/v1/${service}/user/${userId}?o=${offset}`;
                    const posts = await fetchJson(apiUrl);

                    if (Array.isArray(posts) && posts.length > 0) {
                        allPosts.push(...posts);
                        debugLog(`Fetched ${posts.length} posts (offset ${offset}), total: ${allPosts.length}`);

                        // If we got a full page, there might be more
                        if (posts.length >= batchSize) {
                            offset += batchSize;
                        } else {
                            hasMore = false;
                        }
                    } else {
                        hasMore = false;
                    }
                } catch (e) {
                    debugLog(`Batch fetch error at offset ${offset}:`, e.message);
                    hasMore = false;
                }
            }

            debugLog(`Batch fetch complete: ${allPosts.length} total posts for ${service}/${userId}`);

            // Create lookup map by post ID for quick access
            const postsMap = new Map();
            allPosts.forEach(post => {
                postsMap.set(post.id, post);
            });

            userPostsCache.set(cacheKey, postsMap);
            pendingBatchFetches.delete(cacheKey);

            return postsMap;
        })();

        pendingBatchFetches.set(cacheKey, fetchPromise);
        return fetchPromise;
    }

    /**
     * Process API queue - now uses batch fetching when possible
     */
    async function processApiQueue() {
        while (apiQueue.length > 0 && activeApiProcesses < CONFIG.maxConcurrentApi) {
            const item = apiQueue.shift();
            activeApiProcesses++;

            processPostData(item.link, item.parsed).finally(() => {
                activeApiProcesses--;
                processApiQueue();
            });
        }
    }

    /**
     * Process video thumbnail queue
     */
    async function processVideoQueue() {
        while (videoThumbnailQueue.length > 0 && activeVideoProcesses < CONFIG.maxConcurrentVideo) {
            const link = videoThumbnailQueue.shift();
            activeVideoProcesses++;

            processVideoThumbnail(link).finally(() => {
                activeVideoProcesses--;
                processVideoQueue();
            });
        }
    }

    /**
     * Fetch post data and observe for video thumbnail generation
     * Now uses batch cache when available to reduce API calls
     */
    async function processPostData(link, parsed) {
        // TEMPORARY FIX: Skip account service requests
        if (parsed.service === 'account') {
            debugLog('Skipping account service post:', link.href);
            return;
        }

        // First check if we have this post in batch cache
        const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
        let postData = null;

        // Try batch cache first (much more efficient)
        if (userPostsCache.has(cacheKey)) {
            const postsMap = userPostsCache.get(cacheKey);
            postData = postsMap.get(parsed.postId);
            if (postData) {
                debugLog(`Using batch cache for post ${parsed.postId}`);
            }
        }

        // Fallback to individual API call if not in batch cache
        if (!postData) {
            const apiUrl = `${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`;
            try {
                postData = await fetchJson(apiUrl);
            } catch (e) {
                debugLog('API error for:', link.href, e.message);
                link.dataset.fileCountsProcessed = 'error';
                return;
            }
        }

        postDataCache.set(link.href, postData);

        const fileCounts = countFileTypes(postData);
        const videoUrls = extractVideoUrlsFromApi(postData, parsed.baseUrl);
        const imageUrls = extractImageUrlsFromApi(postData, parsed.baseUrl);

        addFileCountOverlay(link, fileCounts, videoUrls.length > 0);

        link.dataset.hasVideos = videoUrls.length > 0 ? 'true' : 'false';
        link.dataset.hasImages = imageUrls.length > 0 ? 'true' : 'false';
        link.dataset.fileCountsProcessed = 'true';

        // Insert image collage for posts with images
        if (imageUrls.length > 0) {
            insertImageCollage(link, imageUrls, fileCounts.image);
        }

        // Observe for video thumbnail generation when in view
        if (videoUrls.length > 0 && !link.dataset.videoThumbnailQueued) {
            insertAvatarPlaceholder(link);
            link.dataset.videoThumbnailReady = 'true';

            // Observe element for viewport entry
            if (videoThumbnailObserver) {
                videoThumbnailObserver.observe(link);
            }
        }
    }

    /**
     * Process video thumbnail generation
     */
    async function processVideoThumbnail(link) {
        if (link.dataset.videoThumbnailSuccess === 'true') return;

        link.dataset.videoThumbnailProcessed = 'true';

        const parsed = parsePostUrl(link.href);
        if (!parsed) return;

        let postData = postDataCache.get(link.href);
        if (!postData) {
            // Try batch cache first
            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            if (userPostsCache.has(cacheKey)) {
                const postsMap = userPostsCache.get(cacheKey);
                postData = postsMap.get(parsed.postId);
            }

            // Fallback to individual API call
            if (!postData) {
                try {
                    const apiUrl = `${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`;
                    postData = await fetchJson(apiUrl);
                } catch (e) {
                    debugLog('Failed to fetch post data:', e.message);
                    markThumbnailFailed(link, 'API error');
                    return;
                }
            }
            postDataCache.set(link.href, postData);
        }

        const videoUrls = extractVideoUrlsFromApi(postData, parsed.baseUrl);
        if (videoUrls.length === 0) {
            removeAvatarPlaceholder(link);
            return;
        }

        let thumbnailGenerated = false;
        for (const videoUrl of videoUrls) {
            try {
                const result = await generateThumbnail(videoUrl);
                insertVideoThumbnail(link, result.dataUrl, result.duration);
                thumbnailGenerated = true;
                break;
            } catch (e) {
                debugLog('Thumbnail generation failed:', e.message);
            }
        }

        if (!thumbnailGenerated) {
            markThumbnailFailed(link, 'Preview failed');
        }
    }

    /**
     * Add hover listener for retry functionality
     */
    function addRetryHoverListener(link) {
        if (link.dataset.retryListenerBound) return;
        link.dataset.retryListenerBound = 'true';

        link.addEventListener('click', function(e) {
            const playIndicator = link.querySelector('.video-play-indicator.retry-available');
            if (playIndicator && playIndicator.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();

                // Reset and retry
                if (link.dataset.videoThumbnailFailed === 'true') {
                    link.dataset.videoThumbnailFailed = 'false';
                    link.dataset.videoThumbnailProcessed = 'false';
                    link.dataset.videoThumbnailQueued = 'true';

                    playIndicator.classList.remove('retry-available');
                    playIndicator.innerHTML = '▶';
                    playIndicator.title = '';

                    insertAvatarPlaceholder(link);
                    videoThumbnailQueue.push(link);
                    processVideoQueue();
                }
            }
        }, true);
    }

    /**
     * Setup all post cards
     * Now triggers batch fetch first to minimize individual API calls
     */
    async function setupPostCards() {
        const fancyLinks = document.querySelectorAll('.card-list .card-list__items .post-card .fancy-link');
        let processed = 0;

        // Collect unique users from visible post cards
        const uniqueUsers = new Map(); // key: cacheKey, value: {baseUrl, service, userId}

        fancyLinks.forEach(link => {
            if (!link.href || !link.href.includes('/post/')) return;
            if (link.dataset.cardSetup) return;

            const parsed = parsePostUrl(link.href);
            if (!parsed) return;

            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            if (!uniqueUsers.has(cacheKey)) {
                uniqueUsers.set(cacheKey, {
                    baseUrl: parsed.baseUrl,
                    service: parsed.service,
                    userId: parsed.userId
                });
            }
        });

        // Trigger batch fetch for all unique users (runs in parallel)
        if (uniqueUsers.size > 0) {
            debugLog(`Triggering batch fetch for ${uniqueUsers.size} unique user(s)`);
            const batchPromises = [];

            for (const [cacheKey, userInfo] of uniqueUsers) {
                // Only fetch if not already cached
                if (!userPostsCache.has(cacheKey) && !pendingBatchFetches.has(cacheKey)) {
                    batchPromises.push(
                        fetchUserPostsBatch(userInfo.baseUrl, userInfo.service, userInfo.userId)
                    );
                }
            }

            // Wait for batch fetches to complete (or at least start)
            if (batchPromises.length > 0) {
                try {
                    await Promise.all(batchPromises);
                    debugLog('Batch fetch(es) complete');
                } catch (e) {
                    debugLog('Some batch fetches failed:', e.message);
                }
            }
        }

        // Now setup individual cards (will use batch cache)
        fancyLinks.forEach(link => {
            if (!link.href || !link.href.includes('/post/')) return;
            if (link.dataset.cardSetup) return;
            link.dataset.cardSetup = 'true';

            getOrCreateThumbnailWrapper(link);

            const parsed = parsePostUrl(link.href);
            if (!parsed) return;

            if (!link.dataset.fileCountsProcessed) {
                apiQueue.push({ link, parsed });
            }

            addRetryHoverListener(link);
            addGalleryClickHandler(link);

            processed++;
        });

        if (processed > 0) {
            debugLog(`Setup ${processed} post cards`);
            processApiQueue();
        }
    }

    /**
     * Create gallery overlay DOM structure
     */
    function createGalleryOverlay() {
        if (galleryOverlay) return galleryOverlay;

        galleryOverlay = document.createElement('div');
        galleryOverlay.className = 'media-gallery-overlay';
        galleryOverlay.innerHTML = `
            <div class="gallery-info"></div>
            <button class="gallery-download-all" aria-label="Download all media">
                <span>⬇</span>
                <span class="download-label">Download All</span>
                <span class="download-progress" style="display: none;"></span>
            </button>
            <button class="gallery-close" aria-label="Close gallery">✕</button>
            <div class="gallery-container">
                <button class="gallery-nav prev" aria-label="Previous">❮</button>
                <div class="gallery-media-wrapper"></div>
                <button class="gallery-nav next" aria-label="Next">❯</button>
            </div>
            <div class="gallery-thumbnails"></div>
            <div class="gallery-counter"></div>
        `;

        // Close button
        galleryOverlay.querySelector('.gallery-close').addEventListener('click', closeGallery);

        // Download all button
        galleryOverlay.querySelector('.gallery-download-all').addEventListener('click', downloadAllMedia);

        // Navigation buttons
        galleryOverlay.querySelector('.gallery-nav.prev').addEventListener('click', () => navigateGallery(-1));
        galleryOverlay.querySelector('.gallery-nav.next').addEventListener('click', () => navigateGallery(1));

        // Close on overlay click (but not on content)
        galleryOverlay.addEventListener('click', (e) => {
            if (e.target === galleryOverlay || e.target.classList.contains('gallery-container')) {
                closeGallery();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleGalleryKeyboard);

        document.body.appendChild(galleryOverlay);
        return galleryOverlay;
    }

    /**
     * Extract all media URLs from post data
     */
    function extractAllMediaFromPost(postData, baseUrl) {
        const mediaItems = [];
        const post = postData.post || postData;

        const toFullUrl = (path) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            if (path.startsWith('/')) return `${baseUrl}${path}`;
            return `${baseUrl}/data/${path}`;
        };

        const getMediaType = (path) => {
            if (!path) return 'other';
            const lowerPath = path.toLowerCase();
            if (CONFIG.videoExtensions.some(ext => lowerPath.includes(ext))) return 'video';
            if (CONFIG.imageExtensions.some(ext => lowerPath.includes(ext))) return 'image';
            return 'other';
        };

        // Main file
        if (post.file && post.file.path) {
            const type = getMediaType(post.file.path);
            if (type === 'video' || type === 'image') {
                mediaItems.push({
                    url: toFullUrl(post.file.path),
                    type: type,
                    name: post.file.name || post.file.path
                });
            }
        }

        // Attachments
        if (Array.isArray(post.attachments)) {
            post.attachments.forEach(att => {
                if (att.path) {
                    const type = getMediaType(att.path);
                    if (type === 'video' || type === 'image') {
                        mediaItems.push({
                            url: toFullUrl(att.path),
                            type: type,
                            name: att.name || att.path
                        });
                    }
                }
            });
        }

        return mediaItems;
    }

    /**
     * Open gallery with media items for a post
     */
    async function openGallery(link) {
        const parsed = parsePostUrl(link.href);
        if (!parsed) return;

        createGalleryOverlay();

        // Show loading state
        const mediaWrapper = galleryOverlay.querySelector('.gallery-media-wrapper');
        mediaWrapper.innerHTML = `
            <div class="gallery-loading">
                <div class="loading-spinner"></div>
                <span>Loading media...</span>
            </div>
        `;

        galleryOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Get post data - try caches first
        let postData = postDataCache.get(link.href);
        if (!postData) {
            // Try batch cache
            const cacheKey = `${parsed.baseUrl}/${parsed.service}/user/${parsed.userId}`;
            if (userPostsCache.has(cacheKey)) {
                const postsMap = userPostsCache.get(cacheKey);
                postData = postsMap.get(parsed.postId);
                if (postData) {
                    postDataCache.set(link.href, postData);
                }
            }

            // Fallback to individual API call
            if (!postData) {
                try {
                    const apiUrl = `${parsed.baseUrl}/api/v1/${parsed.service}/user/${parsed.userId}/post/${parsed.postId}`;
                    postData = await fetchJson(apiUrl);
                    postDataCache.set(link.href, postData);
                } catch (e) {
                    mediaWrapper.innerHTML = `<div class="gallery-loading"><span>Failed to load media</span></div>`;
                    return;
                }
            }
        }

        // Extract media
        galleryMediaItems = extractAllMediaFromPost(postData, parsed.baseUrl);
        galleryPostUrl = link.href;
        galleryCurrentIndex = 0;

        if (galleryMediaItems.length === 0) {
            mediaWrapper.innerHTML = `<div class="gallery-loading"><span>No media found</span></div>`;
            return;
        }

        // Update info
        const post = postData.post || postData;
        const infoEl = galleryOverlay.querySelector('.gallery-info');
        infoEl.textContent = post.title || post.content?.substring(0, 50) || 'Post';

        // Build thumbnail strip
        buildGalleryThumbnails();

        // Show first item
        showGalleryItem(0);
    }

    /**
     * Build thumbnail strip for gallery
     */
    function buildGalleryThumbnails() {
        const thumbStrip = galleryOverlay.querySelector('.gallery-thumbnails');
        thumbStrip.innerHTML = '';

        galleryMediaItems.forEach((item, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb' + (item.type === 'video' ? ' video-thumb' : '');
            thumb.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 4px;
                cursor: pointer;
                opacity: 0.5;
                border: 2px solid transparent;
                flex-shrink: 0;
                position: relative;
                background: #333;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.url;
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 2px;';
                img.loading = 'lazy';
                thumb.appendChild(img);
            } else {
                thumb.innerHTML = `<span style="color: white; font-size: 20px;">▶</span>`;
            }

            thumb.addEventListener('click', () => showGalleryItem(index));
            thumbStrip.appendChild(thumb);
        });
    }

    /**
     * Show specific gallery item
     */
    function showGalleryItem(index) {
        if (index < 0 || index >= galleryMediaItems.length) return;

        galleryCurrentIndex = index;
        const item = galleryMediaItems[index];
        const mediaWrapper = galleryOverlay.querySelector('.gallery-media-wrapper');

        // Stop any playing videos
        const existingVideo = mediaWrapper.querySelector('video');
        if (existingVideo) {
            existingVideo.pause();
            existingVideo.src = '';
        }

        // Clear wrapper
        mediaWrapper.innerHTML = '';

        // Create media element
        if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.url;
            video.controls = true;
            video.autoplay = true;
            video.style.cssText = 'max-width: 90vw; max-height: 75vh; outline: none;';
            mediaWrapper.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = item.name || 'Image';
            img.style.cssText = 'max-width: 90vw; max-height: 75vh; object-fit: contain;';
            mediaWrapper.appendChild(img);
        }

        // Add individual download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'gallery-item-download';
        downloadBtn.setAttribute('aria-label', 'Download this item');
        downloadBtn.innerHTML = '⬇';
        downloadBtn.title = `Download ${item.name || (item.type === 'video' ? 'video' : 'image')}`;
        downloadBtn.addEventListener('click', () => downloadSingleMedia(item, downloadBtn));
        mediaWrapper.appendChild(downloadBtn);

        // Update counter
        const counter = galleryOverlay.querySelector('.gallery-counter');
        counter.textContent = `${index + 1} / ${galleryMediaItems.length}`;

        // Update navigation buttons
        const prevBtn = galleryOverlay.querySelector('.gallery-nav.prev');
        const nextBtn = galleryOverlay.querySelector('.gallery-nav.next');
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === galleryMediaItems.length - 1;

        // Update thumbnail active state
        const thumbs = galleryOverlay.querySelectorAll('.gallery-thumb');
        thumbs.forEach((thumb, i) => {
            thumb.style.opacity = i === index ? '1' : '0.5';
            thumb.style.borderColor = i === index ? 'white' : 'transparent';
        });

        // Scroll thumbnail into view
        if (thumbs[index]) {
            thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    /**
     * Navigate gallery
     */
    function navigateGallery(direction) {
        const newIndex = galleryCurrentIndex + direction;
        if (newIndex >= 0 && newIndex < galleryMediaItems.length) {
            showGalleryItem(newIndex);
        }
    }

    /**
     * Close gallery
     */
    function closeGallery() {
        if (!galleryOverlay) return;

        // Stop any playing videos
        const video = galleryOverlay.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
        }

        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Clear state
        galleryMediaItems = [];
        galleryPostUrl = null;
        galleryCurrentIndex = 0;
    }

    /**
     * Extract filename from URL or path
     */
    function getFilenameFromUrl(url, fallbackName) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const segments = pathname.split('/');
            const filename = segments[segments.length - 1];
            if (filename && filename.includes('.')) {
                return decodeURIComponent(filename);
            }
        } catch (e) {
            // Fallback for malformed URLs
        }
        return fallbackName || 'download';
    }

    /**
     * Download a single media item using GM_xmlhttpRequest
     * Resolves redirects first to handle mirror switching
     */
    async function downloadSingleMedia(item, buttonEl) {
        if (!item || !item.url) return;

        const filename = getFilenameFromUrl(item.url, item.name);

        if (buttonEl) {
            buttonEl.disabled = true;
            buttonEl.classList.add('downloading');
            buttonEl.innerHTML = '⏳';
        }

        // Resolve redirects first
        let finalUrl;
        try {
            finalUrl = await resolveRedirectUrl(item.url);
        } catch (e) {
            finalUrl = item.url;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: finalUrl,
            responseType: 'blob',
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

                    if (buttonEl) {
                        buttonEl.innerHTML = '✓';
                        setTimeout(() => {
                            buttonEl.innerHTML = '⬇';
                            buttonEl.disabled = false;
                            buttonEl.classList.remove('downloading');
                        }, 1500);
                    }

                    debugLog('Downloaded:', filename);
                } else {
                    debugLog('Download failed:', response.status, filename);
                    if (buttonEl) {
                        buttonEl.innerHTML = '✕';
                        setTimeout(() => {
                            buttonEl.innerHTML = '⬇';
                            buttonEl.disabled = false;
                            buttonEl.classList.remove('downloading');
                        }, 1500);
                    }
                }
            },
            onerror: function(error) {
                debugLog('Download error:', error, filename);
                if (buttonEl) {
                    buttonEl.innerHTML = '✕';
                    setTimeout(() => {
                        buttonEl.innerHTML = '⬇';
                        buttonEl.disabled = false;
                        buttonEl.classList.remove('downloading');
                    }, 1500);
                }
            }
        });
    }

    /**
     * Download all media items in gallery
     * Resolves redirects for each item before downloading
     */
    async function downloadAllMedia() {
        if (galleryMediaItems.length === 0) return;

        const btn = galleryOverlay.querySelector('.gallery-download-all');
        const label = btn.querySelector('.download-label');
        const progress = btn.querySelector('.download-progress');

        btn.disabled = true;
        label.style.display = 'none';
        progress.style.display = 'inline';

        let completed = 0;
        const total = galleryMediaItems.length;

        const updateProgress = () => {
            progress.textContent = `${completed}/${total}`;
        };

        updateProgress();

        // Download items sequentially to avoid overwhelming the browser
        for (const item of galleryMediaItems) {
            await new Promise(async (resolve) => {
                const filename = getFilenameFromUrl(item.url, item.name);

                // Resolve redirects first
                let finalUrl;
                try {
                    finalUrl = await resolveRedirectUrl(item.url);
                } catch (e) {
                    finalUrl = item.url;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: finalUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            const blob = response.response;
                            const blobUrl = URL.createObjectURL(blob);

                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                            debugLog('Downloaded:', filename);
                        } else {
                            debugLog('Download failed:', response.status, filename);
                        }

                        completed++;
                        updateProgress();

                        // Small delay between downloads
                        setTimeout(resolve, 300);
                    },
                    onerror: function(error) {
                        debugLog('Download error:', error, filename);
                        completed++;
                        updateProgress();
                        setTimeout(resolve, 300);
                    }
                });
            });
        }

        // Reset button state
        label.textContent = 'Done!';
        label.style.display = 'inline';
        progress.style.display = 'none';

        setTimeout(() => {
            label.textContent = 'Download All';
            btn.disabled = false;
        }, 2000);

        debugLog(`Downloaded ${completed} of ${total} items`);
    }

    /**
     * Handle keyboard navigation in gallery
     */
    function handleGalleryKeyboard(e) {
        if (!galleryOverlay || !galleryOverlay.classList.contains('active')) return;

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
                // Toggle video play/pause
                const video = galleryOverlay.querySelector('video');
                if (video) {
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
                break;
        }
    }

    /**
     * Document-level gallery click handler flag
     */
    let galleryDocumentHandlerBound = false;

    /**
     * Document-level click handler for gallery (capture phase)
     * Bound once at document level to intercept before site handlers
     */
    function handleGalleryClick(e) {
        // Debug: log all clicks to confirm handler is firing
        if (CONFIG.debug) {
            console.log('[Gallery] Click detected on:', e.target.tagName, e.target.className);
        }

        // Don't intercept if clicking retry button
        if (e.target.closest('.video-play-indicator.retry-available')) {
            debugLog('Click on retry button, allowing through');
            return;
        }

        // Find the card thumbnail wrapper OR the original image container
        const wrapper = e.target.closest('.card-thumbnail-wrapper');
        const imageContainer = e.target.closest('.post-card__image-container');

        if (!wrapper && !imageContainer) {
            if (CONFIG.debug && e.target.closest('.fancy-link')) {
                console.log('[Gallery] Click on fancy-link but NOT on thumbnail area');
            }
            return;
        }

        // Find the parent fancy-link
        const link = (wrapper || imageContainer).closest('.fancy-link[data-gallery-click-bound="true"]');
        if (!link) {
            debugLog('Thumbnail area found but no bound fancy-link parent');
            return;
        }

        debugLog('Gallery click intercepted, preventing navigation');

        // Prevent default navigation and stop propagation
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        openGallery(link);
    }

    /**
     * Bind document-level gallery click handler (once)
     */
    function bindGalleryDocumentHandler() {
        if (galleryDocumentHandlerBound) return;
        galleryDocumentHandlerBound = true;

        // Use capture phase at document level to intercept before any element handlers
        document.addEventListener('click', handleGalleryClick, true);

        // Also intercept mousedown to prevent React from capturing navigation intent early
        document.addEventListener('mousedown', handleGalleryMousedown, true);

        debugLog('Gallery document click handler bound');
    }

    /**
     * Mousedown handler to mark element for gallery handling
     * Prevents React from initiating navigation on mousedown
     */
    function handleGalleryMousedown(e) {
        if (e.target.closest('.video-play-indicator.retry-available')) return;

        const wrapper = e.target.closest('.card-thumbnail-wrapper');
        const imageContainer = e.target.closest('.post-card__image-container');

        if (!wrapper && !imageContainer) return;

        const link = (wrapper || imageContainer).closest('.fancy-link[data-gallery-click-bound="true"]');
        if (!link) return;

        // Mark that this mousedown should result in gallery open, not navigation
        link.dataset.galleryPendingClick = 'true';

        // Clear the flag after a short delay if no click follows
        setTimeout(() => {
            delete link.dataset.galleryPendingClick;
        }, 500);
    }

    /**
     * Mark link as gallery-click enabled and set cursor
     */
    function addGalleryClickHandler(link) {
        if (link.dataset.galleryClickBound) return;
        link.dataset.galleryClickBound = 'true';

        // Ensure document-level handler is bound
        bindGalleryDocumentHandler();

        // Set pointer cursor on clickable thumbnail areas
        const wrapper = link.querySelector('.card-thumbnail-wrapper');
        if (wrapper) {
            wrapper.style.cursor = 'pointer';
        }

        const imageContainer = link.querySelector('.post-card__image-container');
        if (imageContainer) {
            imageContainer.style.cursor = 'pointer';
        }
    }

    /**
     * Cleanup function for page unload
     */
    function cleanup() {
        // Close and remove gallery
        closeGallery();
        if (galleryOverlay) {
            galleryOverlay.remove();
            galleryOverlay = null;
        }
        document.removeEventListener('keydown', handleGalleryKeyboard);

        // Remove document-level gallery click handler
        if (galleryDocumentHandlerBound) {
            document.removeEventListener('click', handleGalleryClick, true);
            document.removeEventListener('mousedown', handleGalleryMousedown, true);
            galleryDocumentHandlerBound = false;
        }

        // Disconnect observer
        if (videoThumbnailObserver) {
            videoThumbnailObserver.disconnect();
            videoThumbnailObserver = null;
        }

        // Disconnect GIF pause observer
        if (gifPauseObserver) {
            gifPauseObserver.disconnect();
            gifPauseObserver = null;
        }

        // Clear queues
        videoThumbnailQueue = [];
        apiQueue = [];

        // Clear caches
        postDataCache.clear();
        pendingRequests.clear();
        userPostsCache.clear();
        pendingBatchFetches.clear();

        debugLog('Cleanup completed');
    }

    /**
     * Initialize script
     */
    function init() {
        // Only run on user pages
        if (!isUserPage()) {
            debugLog('Not a user page, skipping initialization');
            return;
        }

        debugLog('Initializing (v3.4.2 - GIF pause when out of view)');

        // Get user avatar early
        getUserAvatarUrl();

        injectStyles();

        // Initialize Intersection Observer for video thumbnails
        initVideoThumbnailObserver();

        // Initialize GIF pause observer for memory optimization
        if (CONFIG.pauseGifsWhenHidden) {
            initGifPauseObserver();
        }

        setupPostCards();

        // Observe existing GIFs on page
        if (CONFIG.pauseGifsWhenHidden) {
            observeGifsOnPage();
        }

        // Observe for dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) hasNewNodes = true;
            });

            if (hasNewNodes) {
                setupPostCards();
                // Also check for new GIFs
                if (CONFIG.pauseGifsWhenHidden) {
                    observeGifsOnPage();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cleanup on page unload to prevent memory leaks
        window.addEventListener('beforeunload', cleanup);

        debugLog('Observer initialized');
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();