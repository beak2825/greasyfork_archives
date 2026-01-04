// ==UserScript==
// @name         Last.fm Artwork Upload Helper
// @namespace    https://github.com/chr1sx/Last.fm-Artwork-Upload-Helper
// @version      1.2.3
// @description  A userscript that streamlines the process of uploading album artwork to Last.fm with visual missing artwork detection
// @author       chr1sx
// @match        https://www.last.fm/*
// @match        https://covers.musichoarders.xyz/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      covers.musichoarders.xyz
// @run-at       document-idle
// @license      MIT
// @icon         https://raw.githubusercontent.com/chr1sx/Last.fm-Artwork-Upload-Helper/refs/heads/main/Images/logo-128.png
// @downloadURL https://update.greasyfork.org/scripts/554242/Lastfm%20Artwork%20Upload%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554242/Lastfm%20Artwork%20Upload%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Configuration ===
    const DEFAULT_CONFIG = {
        theme: 'light',
        resolution: '0',
        sources: ['Bandcamp', 'Deezer', 'Discogs', 'iTunes', 'KuGou', 'Qobuz', 'Spotify'],
        country: 'us',
        remoteAgent: 'lastfm-mh-integration/3.4',
        showMissingIndicators: true,
        openInNewTab: true,
        compressImages: true
    };

    let MH_CONFIG = {};

    const ALL_SOURCES = [
        'Amazon Music', 'Apple Music', 'Bandcamp', 'Beatport', 'BOOTH', 'Bugs', 'Deezer', 'Discogs',
        'Fanart.tv', 'FLO', 'Gaana', 'iTunes', 'KKBOX', 'KuGou', 'LINE MUSIC', 'Melon',
        'MusicBrainz', 'OTOTOY', 'Qobuz', 'Soulseek', 'Spotify', 'THWiki', 'TIDAL', 'VGMdb'
    ];

    // Creates a clean slug for source names to use in HTML IDs
    function createSourceSlug(sourceName) {
        return sourceName.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    // === Utility Functions ===
    const $mh = (s, r = document) => r.querySelector(s);
    const $$mh = (s, r = document) => Array.from(r.querySelectorAll(s));
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&quot;', "'": '&#39;' }[m]));
    const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    async function getImageDimensions(blob) {
        return new Promise((resolve) => {
            if (!blob || blob.size === 0) {
                resolve({ width: 0, height: 0 });
                return;
            }
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve({ width: 0, height: 0 });
            };
            img.src = URL.createObjectURL(blob);
        });
    }

    /**
     * Compresses/converts an image blob to meet size and format requirements.
     * @param {Blob} blob - The image blob to process
     * @param {number} maxSizeMB - Maximum allowed size in megabytes (default: 5)
     * @param {boolean} forceResize - If true, always resize to maxDimension. If false, only resize if needed for size/quality (default: true)
     * @param {string} targetMimeType - Desired output format (default: 'image/jpeg')
     * @returns {Promise<{blob: Blob, wasModified: boolean}>} Processed blob and modification flag
     */
    async function compressImage(blob, maxSizeMB = 5, forceResize = true, targetMimeType = 'image/jpeg') {
        const sizeInMB = blob.size / (1024 * 1024);

        // Short-circuit if no processing needed
        if (!forceResize && sizeInMB <= maxSizeMB && blob.type === targetMimeType) {
            return { blob, wasModified: false };
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                const maxDimension = 1400;

                // Resize logic: force resize if enabled, or if image exceeds maxDimension
                if (forceResize && (width > maxDimension || height > maxDimension)) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.92;
                const originalBlob = blob;

                const tryCompress = () => {
                    canvas.toBlob((compressedBlob) => {
                        if (!compressedBlob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        const compressedSizeMB = compressedBlob.size / (1024 * 1024);

                        // Reduce quality by 5% if still over limit and quality can be reduced further
                        if (compressedSizeMB > maxSizeMB && quality > 0.5) {
                            quality -= 0.05;
                            tryCompress();
                        } else {
                            // Mark as modified if size changed significantly or format changed
                            const wasModified = originalBlob.size > compressedBlob.size + 1024 || originalBlob.type !== compressedBlob.type;
                            resolve({ blob: compressedBlob, wasModified });
                        }
                    }, targetMimeType, quality);
                };

                tryCompress();
            };

            img.onerror = () => reject(new Error('Failed to load image for compression'));
            img.src = URL.createObjectURL(blob);
        });
    }

    function encodeSources(list) {
        return list.map(s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')).join(',');
    }

    async function saveConfig() {
        await GM_setValue('mh_config', JSON.stringify(MH_CONFIG));
    }

    async function loadConfig() {
        const storedConfig = await GM_getValue('mh_config');
        let loadedConfig = storedConfig ? JSON.parse(storedConfig) : {};

        MH_CONFIG = Object.assign({}, DEFAULT_CONFIG, loadedConfig);

        if (!MH_CONFIG.hasOwnProperty('compressImages')) {
            MH_CONFIG.compressImages = DEFAULT_CONFIG.compressImages;
        }

        if (!MH_CONFIG.country) {
            MH_CONFIG.country = DEFAULT_CONFIG.country;
        }

        if (MH_CONFIG.hasOwnProperty('autoHighlightMissing')) {
            delete MH_CONFIG.autoHighlightMissing;
        }

        if (!storedConfig) await saveConfig();
    }

    function buildMhUrl({ artist, album }, opts = {}) {
        const params = new URLSearchParams();
        const cfg = Object.assign({}, MH_CONFIG, opts || {});

        if (cfg.theme) params.set('theme', cfg.theme);
        if (cfg.resolution) params.set('resolution', cfg.resolution);
        if (cfg.sources && cfg.sources.length) params.set('sources', encodeSources(cfg.sources));
        if (cfg.country) params.set('country', cfg.country.toLowerCase());
        if (artist) params.set('artist', artist);
        if (album) params.set('album', album);

        params.set('remote.port', 'browser');
        if (cfg.remoteAgent) params.set('remote.agent', cfg.remoteAgent);
        if (opts.remoteText) params.set('remote.text', opts.remoteText);

        return `https://covers.musichoarders.xyz/?${params.toString()}`;
    }

    // === Missing Artwork Detection ===
    function isMissingArtwork(element) {
        if (!element) return false;

        const src = element.src || element.dataset?.src || '';

        const placeholderPatterns = [
            '/defaults/images/album/default_album_300_3.png',
            '/defaults/images/album/default_album_',
            '2a96cbd8b46e442fc41c2b86b821562f.png',
            '2a96cbd8b46e442fc41c2b86b821562f.jpg',
            'c6f59c1e5e7240a4c0d427abd71f3dbb.png',
            'c6f59c1e5e7240a4c0d427abd71f3dbb.jpg',
            'c6f59c1e5e7240a4c0d427abd71f3dbb',
            'default_album'
        ];

        return placeholderPatterns.some(pattern => src.includes(pattern));
    }

    function getUploadUrlFromElement(element) {
    try {
        const container = element.closest('tr') ||
                          element.closest('.chartlist-row') ||
                          element.closest('.album-item') ||
                          element.closest('.grid-items-item') ||
                          element.closest('.grid-items-item-main-text') ||
                          element.closest('.resource-list--release-list-item') ||
                          element.closest('.recs-feed-item') ||
                          element.closest('li') ||
                          element.closest('section');

        if (!container) return null;

        let albumLink = null;
        let hasTrackLink = false;
        const allLinks = container.querySelectorAll('a[href*="/music/"]');

        for (const link of allLinks) {
            const href = link.getAttribute('href');
            if (!href) continue;

            if (href.includes('/_/')) {
                hasTrackLink = true;
                continue;
            }

            const pathParts = href.split('/').filter(Boolean);
            const musicIndex = pathParts.findIndex(p => p === 'music');

            if (musicIndex >= 0 && pathParts.length >= musicIndex + 3) {
                albumLink = link;
                break;
            }
        }

        if (albumLink) {
            const href = albumLink.getAttribute('href');
            if (!href) return null;

            let cleanHref = href.split('#')[0].split('?')[0].replace(/\/$/, '');
            if (cleanHref.startsWith('/')) {
                cleanHref = 'https://www.last.fm' + cleanHref;
            }

            const pathParts = cleanHref.split('/').filter(Boolean);
            const musicIndex = pathParts.indexOf('music');

            if (musicIndex >= 0 && pathParts.length >= musicIndex + 3) {
                const albumPath = pathParts.slice(musicIndex).join('/');
                return `https://www.last.fm/${albumPath}/+images/upload`;
            }
        }

        if (!albumLink && !hasTrackLink) {
            const albumTitleLink = container.querySelector('a.link-block-target');
            if (albumTitleLink) {
                let href = albumTitleLink.getAttribute('href');
                if (href) {
                    let cleanHref = href.split('#')[0].split('?')[0].replace(/\/$/, '');
                    if (cleanHref.startsWith('/')) {
                        cleanHref = 'https://www.last.fm' + cleanHref;
                    }

                    const pathParts = cleanHref.split('/').filter(Boolean);
                    const musicIndex = pathParts.indexOf('music');

                    if (musicIndex >= 0 && pathParts.length >= musicIndex + 3) {
                        const albumPath = pathParts.slice(musicIndex).join('/');
                        return `https://www.last.fm/${albumPath}/+images/upload`;
                    }
                }
            }

            const currentPath = window.location.pathname;
            if (currentPath.includes('/+albums')) {
                const pathParts = currentPath.split('/').filter(Boolean);
                const musicIndex = pathParts.indexOf('music');

                if (musicIndex >= 0 && pathParts.length > musicIndex + 1) {
                    const artistName = pathParts[musicIndex + 1];

                    const albumNameElement = container.querySelector('.link-block-target');
                    if (albumNameElement) {
                        const albumName = albumNameElement.textContent.trim();
                        if (albumName) {
                            const encodedAlbum = encodeURIComponent(albumName).replace(/%20/g, '+');
                            return `https://www.last.fm/music/${artistName}/${encodedAlbum}/+images/upload`;
                        }
                    }
                }
            }
        }

        if (!albumLink && hasTrackLink) {
            for (const link of allLinks) {
                const href = link.getAttribute('href');
                if (!href || href.includes('/_/')) continue;

                const pathParts = href.split('/').filter(Boolean);
                const musicIndex = pathParts.findIndex(p => p === 'music');

                if (musicIndex >= 0 && pathParts.length === musicIndex + 2) {
                    let cleanHref = href.split('#')[0].split('?')[0].replace(/\/$/, '');
                    if (cleanHref.startsWith('/')) {
                        cleanHref = 'https://www.last.fm' + cleanHref;
                    }
                    return `${cleanHref}/+albums`;
                }
            }
        }

        return null;

    } catch (e) {
        console.warn('[MH] Error getting upload URL:', e);
        return null;
    }
}
function addMissingArtworkIndicator(element, uploadUrl) {
    if (element.dataset.missingIndicatorAdded) return;
    element.dataset.missingIndicatorAdded = 'true';

    let container = element.closest('.cover-art') ||
                    element.closest('.album-cover-art') ||
                    element.closest('.header-new-background-image') ||
                    element.closest('.chartlist-image') ||
                    element.closest('.grid-items-cover-image') ||
                    element.closest('.resource-list--release-list-item-preview') ||
                    element.closest('.recs-feed-cover-image') ||
                    element.closest('.layout-image') ||
                    element.parentElement;

    if (!container) return;

    const position = window.getComputedStyle(container).position;
    if (position === 'static') {
        container.style.position = 'relative';
    }

    const borderOverlay = document.createElement('div');
    borderOverlay.className = 'mh-missing-border';
    borderOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid #d32f2f;
        border-radius: inherit;
        pointer-events: none;
        z-index: 10;
    `;

    const badge = document.createElement('div');
    badge.className = 'mh-missing-badge';
    badge.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        width: 24px;
        height: 24px;
        background: #d32f2f;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        font-weight: 300;
        font-family: Arial, sans-serif;
        line-height: 24px;
        cursor: pointer;
        z-index: 11;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        transition: transform 0.2s, background 0.2s;
        border: 2px solid white;
    `;
    badge.textContent = '+';
    badge.title = 'Missing Artwork - Click to upload';

    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.1)';
        badge.style.background = '#e53935';
    });
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
        badge.style.background = '#d32f2f';
    });

    badge.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (uploadUrl) {
            if (MH_CONFIG.openInNewTab) {
                window.open(uploadUrl, '_blank');
            } else {
                window.location.href = uploadUrl;
            }
        }
    });

    container.appendChild(borderOverlay);
    container.appendChild(badge);
}

    function scanPageForMissingArtwork() {
    if (!MH_CONFIG.showMissingIndicators) {
        return;
    }

    const allImages = Array.from(document.querySelectorAll('img[src*="lastfm"]'));

    const coverImages = allImages.filter(img => {
        const classList = img.className || '';
        const parentClass = img.parentElement?.className || '';

        const isAvatar = classList.includes('avatar') ||
                         parentClass.includes('avatar') ||
                         img.closest('.avatar');

        if (isAvatar) return false;

        const isAlbumCover = classList.includes('cover-art') ||
                             classList.includes('album-cover') ||
                             classList.includes('chartlist-image') ||
                             classList.includes('grid-items-cover-image-image') ||
                             classList.includes('resource-list--release-list-item-preview-image') ||
                             classList.includes('layout-image-image') ||
                             parentClass.includes('cover-art') ||
                             parentClass.includes('album') ||
                             parentClass.includes('chartlist-image') ||
                             parentClass.includes('grid-items-cover-image') ||
                             parentClass.includes('resource-list--release-list-item-preview') ||
                             parentClass.includes('layout-image');

        const hasAlbumContainer = img.closest('.cover-art') ||
                                  img.closest('.album-cover-art') ||
                                  img.closest('.chartlist-image') ||
                                  img.closest('.grid-items-cover-image') ||
                                  img.closest('.header-new-background-image') ||
                                  img.closest('.resource-list--release-list-item-preview') ||
                                  img.closest('.recs-feed-cover-image');

        const parentRow = img.closest('tr');
        if (parentRow) {
            const hasMusicLink = parentRow.querySelector('a[href*="/music/"]');
            if (hasMusicLink) return true;
        }

        return isAlbumCover || hasAlbumContainer;
    });

    coverImages.forEach(img => {
        if (img.dataset.missingIndicatorAdded) {
            return;
        }

        const isMissing = isMissingArtwork(img);
        if (isMissing) {
            const uploadUrl = getUploadUrlFromElement(img);
            if (uploadUrl) {
                addMissingArtworkIndicator(img, uploadUrl);
            }
        }
    });
}

    // === Page Detection & Extraction ===
    function isUploadPath(pathname = location.pathname) {
        if (/\/settings\/profile\/images\/upload(\/|$|\?)/i.test(pathname)) {
            return true;
        }

        if (!/\/\+images\/upload(\/|$|\?)/i.test(pathname)) {
            return false;
        }

        const parts = pathname.split('/').filter(Boolean);
        const musicIndex = parts.indexOf('music');

        if (musicIndex === -1) {
            return false;
        }

        const imagesIndex = parts.indexOf('+images');
        if (imagesIndex === -1) return false;

        const segmentsBetween = imagesIndex - musicIndex - 1;
        return segmentsBetween >= 2;
    }

    function extractArtistAlbum() {
        try {
            const metaArtist = document.querySelector('meta[property="music:musician"], meta[name="music:musician"]')?.content;
            const metaOgTitle = document.querySelector('meta[property="og:title"], meta[name="og:title"]')?.content;

            if (metaArtist && metaOgTitle) {
                let artist = metaArtist.trim();
                let album = metaOgTitle.trim();

                const byArtistPattern = new RegExp(` by ${escapeRegExp(artist)}`, 'i');
                if (byArtistPattern.test(album)) {
                    album = album.replace(byArtistPattern, '').trim();
                } else {
                    const dashIdx = album.indexOf(' — ');
                    if (dashIdx !== -1) {
                        const potentialArtist = album.substring(0, dashIdx).trim();
                        if (potentialArtist.toLowerCase() === artist.toLowerCase()) {
                            album = album.substring(dashIdx + 3).trim();
                        }
                    }
                }
                return { artist, album };
            }

            const artistLink = document.querySelector('a.header-new-crumb[href*="/music/"]');
            const albumHeading = document.querySelector('h1.header-new-title');

            if (artistLink && albumHeading) {
                return {
                    artist: artistLink.textContent.trim(),
                    album: albumHeading.textContent.trim()
                };
            }

            const parts = location.pathname.split('/').filter(Boolean);
            const mi = parts.indexOf('music');
            if (mi >= 0 && parts.length > mi + 2) {
                const d = s => {
                    try {
                        let normalized = s.replace(/\+/g, '%20');
                        let decoded = decodeURIComponent(normalized);
                        while (decoded.includes('%')) {
                            const next = decodeURIComponent(decoded);
                            if (next === decoded) break;
                               decoded = next;
                        }
                        return decoded;
                    } catch {
                        return s.replace(/\+/g, ' ');
                    }
                };
                return { artist: d(parts[mi + 1]), album: d(parts[mi + 2]) };
            }
        } catch (e) {
            console.warn('Error extracting artist/album:', e);
        }
        return null;
    }

    // === Cover Search Engine Page Logic ===
    const isMHPage = location.hostname === 'covers.musichoarders.xyz';

    if (isMHPage) {
        (function initMHPageHandlers() {
            const imageSizeCache = new Map();

            function getLargestImageUrl(element) {
                if (!element) return null;

                let imageUrl = null;

                if (element.tagName === 'IMG') {
                    const img = element;
                    const src = img.src;

                    try {
                        const domain = new URL(src).hostname;

                        // LINE MUSIC: Replace CDN domain and remove size parameters
                        if (domain === 'resource-jp-linemusic.line-scdn.net') {
                            imageUrl = src.replace(/:\/\/[^/]+\/+/, '://obs.line-scdn.net/');
                            imageUrl = imageUrl.replace(/\/m\d+x\d+/, '');
                        }
                        // MUSICBRAINZ: Remove size suffixes to get full resolution
                        else if (domain === 'coverartarchive.org' || domain.includes('musicbrainz.org')) {
                            imageUrl = src.replace(/-\d+(x\d+)?(\.jpg|\.png|\.gif)?$/, '$2');
                            if (!imageUrl || imageUrl === src) {
                                if (!src.endsWith('/full')) {
                                    imageUrl = src.split('?')[0].replace(/\/(\d+)(\.jpg|\.png|\.gif)?$/, '/$1/full$2');
                                    if (!imageUrl || imageUrl === src) {
                                        imageUrl = src;
                                    }
                                } else {
                                    imageUrl = src;
                                }
                            }
                        }
                        // SPOTIFY: Check parent link for full resolution
                        else if (domain.includes('scdn.co') && img.closest('a')?.href) {
                            imageUrl = img.closest('a').href;
                        }
                        // Check data attributes for full-size versions
                        else if (img.dataset.fullsize) imageUrl = img.dataset.fullsize;
                        else if (img.dataset.full) imageUrl = img.dataset.full;
                        else if (img.dataset.original) imageUrl = img.dataset.original;
                        else if (img.dataset.hires) imageUrl = img.dataset.hires;
                        // Check parent link for image files
                        else if (img.closest('a')?.href && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(img.closest('a').href)) {
                            imageUrl = img.closest('a').href;
                        }
                        else if (img.dataset.src) imageUrl = img.dataset.src;
                        // Parse srcset for largest resolution
                        else if (img.srcset) {
                            const sources = img.srcset.split(',').map(s => s.trim().split(' '));
                            let largestUrl = '', largestWidth = 0;
                            for (const [url, descriptor] of sources) {
                                const widthMatch = descriptor?.match(/(\d+)w/);
                                if (widthMatch) {
                                    const width = parseInt(widthMatch[1], 10);
                                    if (width > largestWidth) {
                                        largestWidth = width;
                                        largestUrl = url;
                                    }
                                }
                            }
                            if (largestUrl) imageUrl = largestUrl;
                        }

                        if (!imageUrl) imageUrl = src;

                    } catch (e) {
                        imageUrl = src;
                    }

                } else {
                    // Handle non-img elements with background images
                    const bgStyle = window.getComputedStyle(element);
                    if (bgStyle.backgroundImage && bgStyle.backgroundImage !== 'none') {
                        const match = bgStyle.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
                        if (match?.[1]) imageUrl = match[1];
                    }
                    const childImg = element.querySelector('img');
                    if (childImg) imageUrl = getLargestImageUrl(childImg);
                }

                return imageUrl;
            }

            async function checkImageSize(url) {
                if (imageSizeCache.has(url)) {
                    return imageSizeCache.get(url);
                }

                return new Promise((resolve) => {
                    if (typeof GM_xmlhttpRequest === 'function') {
                        GM_xmlhttpRequest({
                            method: 'HEAD',
                            url: url,
                            onload: (response) => {
                                const contentLength = response.responseHeaders.match(/content-length:\s*(\d+)/i);
                                const sizeInMB = contentLength ? parseInt(contentLength[1]) / (1024 * 1024) : 0;
                                imageSizeCache.set(url, sizeInMB);
                                resolve(sizeInMB);
                            },
                            onerror: () => {
                                imageSizeCache.set(url, 0);
                                resolve(0);
                            },
                            ontimeout: () => {
                                imageSizeCache.set(url, 0);
                                resolve(0);
                            }
                        });
                    } else {
                        fetch(url, { method: 'HEAD' })
                            .then(response => {
                                const contentLength = response.headers.get('content-length');
                                const sizeInMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;
                                imageSizeCache.set(url, sizeInMB);
                                resolve(sizeInMB);
                            })
                            .catch(() => {
                                imageSizeCache.set(url, 0);
                                resolve(0);
                            });
                    }
                });
            }

            function createSizeWarningBadge(sizeInMB) {
                const badge = document.createElement('div');
                badge.className = 'mh-size-warning';
                badge.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(255, 107, 107, 0.95);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                `;
                badge.textContent = `⚠️ ${sizeInMB.toFixed(1)}MB`;
                badge.title = `This image may exceed Last.fm's 5MB limit`;
                return badge;
            }
			function setupClickHandlers() {
                const processedElements = new Set();
                const allImages = document.querySelectorAll('img');

                allImages.forEach(img => {
                    const parentLink = img.closest('a');
                    if (parentLink && !processedElements.has(parentLink)) {
                        processedElements.add(parentLink);
                        attachHandlers(parentLink, img);
                    } else if (!parentLink && !processedElements.has(img)) {
                        processedElements.add(img);
                        attachHandlers(img, img);
                    }
                });

                function attachHandlers(clickTarget, imageElement) {
                    clickTarget.style.cursor = 'pointer';
                    imageElement.style.cursor = 'pointer';

                    if (getComputedStyle(clickTarget).position === 'static') {
                        clickTarget.style.position = 'relative';
                    }

                    clickTarget.querySelectorAll('*').forEach(child => {
                        if (child !== imageElement) child.style.pointerEvents = 'none';
                    });

                    const hoverHandler = async () => {
                        imageElement.style.outline = '3px solid #00ff00';
                        imageElement.style.boxShadow = '0 0 15px rgba(0,255,0,0.5)';
                        imageElement.style.filter = 'brightness(1.1)';

                        if (!clickTarget.querySelector('.mh-size-warning')) {
                            const imageUrl = getLargestImageUrl(imageElement);
                            if (imageUrl) {
                                const sizeInMB = await checkImageSize(imageUrl);
                                if (sizeInMB > 5) {
                                    const badge = createSizeWarningBadge(sizeInMB);
                                    clickTarget.appendChild(badge);
                                }
                            }
                        }
                    };

                    const unhoverHandler = () => {
                        if (!imageElement.dataset.selected) {
                            imageElement.style.outline = '';
                            imageElement.style.boxShadow = '';
                            imageElement.style.filter = '';
                        }
                    };

                    clickTarget.addEventListener('mouseenter', hoverHandler, true);
                    imageElement.addEventListener('mouseenter', hoverHandler, true);
                    clickTarget.addEventListener('mouseleave', unhoverHandler, true);
                    imageElement.addEventListener('mouseleave', unhoverHandler, true);

                    const handleSelection = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        const imageUrl = getLargestImageUrl(imageElement);

                        let source = 'Unknown Source';
                        const article = clickTarget.closest('article');
                        if (article) {
                            const detailsElement = article.closest('details');
                            if (detailsElement) {
                                const summary = detailsElement.querySelector('summary');
                                if (summary) {
                                    const titleSpan = summary.querySelector('span.title');
                                    if (titleSpan) {
                                        const titleText = titleSpan.childNodes[0]?.textContent?.trim() || titleSpan.textContent.replace(/\s*\([^)]*\)\s*/g, '').trim();
                                        source = titleText;
                                    }
                                }
                            }
                        }

                        if (imageUrl && window.opener && !window.opener.closed) {
                            window.opener.postMessage({
                                type: 'LASTFM_ARTWORK_SELECTED',
                                url: imageUrl,
                                source: source
                            }, 'https://www.last.fm');

                            imageElement.dataset.selected = 'true';
                            imageElement.style.outline = '3px solid #00ff00';
                            imageElement.style.boxShadow = '0 0 20px rgba(0,255,0,0.8)';

                            try { window.opener.focus(); } catch {}
                            setTimeout(() => window.close(), 500);
                        }
                        return false;
                    };

                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        clickTarget.addEventListener(eventType, handleSelection, true);
                        imageElement.addEventListener(eventType, handleSelection, true);
                    });
                }
            }

            const overlay = document.createElement('div');
            overlay.style.cssText = `position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#00c853 0%,#00e676 100%);color:white;text-align:center;padding:12px;z-index:999999;font-size:15px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,0.3);font-family:system-ui,-apple-system,sans-serif;`;
            overlay.textContent = '✨ Click any artwork to select it for Last.fm ✨';
            document.body.prepend(overlay);

            function waitForImages(callback, maxWait = 10000) {
                const startTime = Date.now();
                const checkInterval = setInterval(() => {
                    const images = document.querySelectorAll('img');
                    if (images.length > 0 || Date.now() - startTime > maxWait) {
                        clearInterval(checkInterval);
                        callback();
                    }
                }, 300);
            }

            waitForImages(setupClickHandlers);

            new MutationObserver(() => {
                if (document.querySelectorAll('img:not([data-mh-processed])').length > 0) {
                    setupClickHandlers();
                }
            }).observe(document.body, { childList: true, subtree: true });
        })();

        return;
    }

    // === Last.fm Page Logic ===
    let currentInfo = extractArtistAlbum();

    function createPanel() {
        $mh('#mh-cover-panel')?.remove();

        currentInfo = extractArtistAlbum();
        if (!currentInfo) return null;

        const panel = document.createElement('div');
        panel.id = 'mh-cover-panel';

        const isDark = MH_CONFIG.theme === 'dark';
        const colors = {
            bg: isDark ? '#0f1113' : '#ffffff',
            text: isDark ? '#ddd' : '#333',
            border: isDark ? '#222' : '#ccc',
            header: isDark ? '#fff' : '#000',
            inputBg: isDark ? '#111' : '#f5f5f5',
            inputBorder: isDark ? '#222' : '#ddd',
            label: isDark ? '#bbb' : '#666',
            topBorder: isDark ? '#1a1a1a' : '#e0e0e0',
            status: isDark ? '#9aa' : '#666'
        };

        panel.setAttribute('style', `
            position: fixed; right: 12px; top: 100px; z-index: 2147483647;
            background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};
            padding: 12px; border-radius: 8px;
            box-shadow: ${isDark ? '0 8px 30px rgba(0,0,0,0.6)' : '0 8px 30px rgba(0,0,0,0.15)'};
            width: 312px; max-height: 85vh; overflow-y: auto; overflow-x: hidden;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; font-size: 13px;
        `);

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-weight:700;color:${colors.header};font-size:15px;">Last.fm Artwork Upload Helper</div>
                <div style="display:flex;gap:4px;align-items:center;">
                    <button id="mh-settings-btn" style="background:none;border:none;color:#8a8a8a;font-size:20px;cursor:pointer;padding:0;line-height:1;width:17px;height:17px;display:flex;align-items:center;justify-content:center;">⚙️</button>
                    <button id="mh-close-btn" style="background:none;border:none;color:#8a8a8a;font-size:20px;cursor:pointer;padding:0;line-height:1;width:17px;height:17px;display:flex;align-items:center;justify-content:center;">×</button>
                </div>
            </div>
            <div style="border-top:1px solid ${colors.topBorder};padding-top:10px;">
                <div id="mh-artist-album-info" style="margin-bottom:10px;color:${colors.text};">
                    Artist: <b style="color:${colors.header}">${esc(currentInfo.artist)}</b><br>
                    Album: <b style="color:${colors.header}">${esc(currentInfo.album)}</b>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:12px">
                    <button id="mh-load-images" style="flex:1;padding:10px 15px;border-radius:5px;background:#337ab7;color:white;border:none;font-weight:bold;cursor:pointer;">
                        Open Artwork Search
                    </button>
                </div>
                <div id="mh-status" style="color:${colors.status};margin-top:8px;text-align:center;font-size:12px;">Ready to search.</div>
            </div>
            <div id="mh-settings-panel" style="display:none;border-top:1px solid ${colors.topBorder};padding-top:10px;margin-bottom:4px;">
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;color:${colors.label};">Sources: <span id="mh-source-counter" style="font-weight:bold;color:${colors.header};">0/9</span></label>
                    <div id="mh-sources-checkboxes" style="max-height:106px;overflow-y:auto;border:1px solid ${colors.inputBorder};padding:4px;border-radius:4px;background:${colors.inputBg}; display:flex; flex-wrap:wrap;">
                        ${ALL_SOURCES.map(source => {
                            const slug = createSourceSlug(source);
                            return `
                                <div style="display:flex;align-items:center;margin-bottom:4px;width:50%;">
                                    <input type="checkbox" id="mh-source-${slug}" name="mh-sources" value="${esc(source)}" style="margin-right:8px;accent-color:#337ab7;" class="mh-source-checkbox">
                                    <label for="mh-source-${slug}" style="color:${colors.label};flex-grow:1;cursor:pointer;text-align:left;">${esc(source)}</label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div id="mh-source-warning" style="display:none;color:#ff6b6b;font-size:11px;margin-top:4px;">Maximum 9 sources allowed</div>
                </div>
                <div style="margin-bottom:4px;">
                    <label style="display:block;margin-bottom:4px;color:${colors.label};">
                        <input type="checkbox" id="mh-show-missing" style="margin-right:4px;accent-color:#337ab7;">
                        Show Missing Artwork Indicators
                    </label>
                </div>
                <div style="margin-bottom:4px;">
                    <label style="display:block;margin-bottom:4px;color:${colors.label};">
                        <input type="checkbox" id="mh-open-new-tab" style="margin-right:4px;accent-color:#337ab7;">
                        Open Upload Page In New Tab
                    </label>
                </div>
                <div style="margin-bottom:4px;">
                    <label style="display:block;margin-bottom:4px;color:${colors.label};">
                        <input type="checkbox" id="mh-compress-images" style="margin-right:4px;accent-color:#337ab7;">
                        Compress Large Images
                    </label>
                </div>
                <div style="margin-bottom:8px;">
                    <label for="mh-res-input" style="display:block;margin-bottom:4px;color:${colors.label};">Minimal Resolution:</label>
                    <input type="number" id="mh-res-input" style="width:100%;padding:8px;border-radius:4px;background:${colors.inputBg};border:1px solid ${colors.inputBorder};color:${colors.text};">
                </div>
                <div style="margin-bottom:8px;">
                    <label for="mh-country-select" style="display:block;margin-bottom:4px;color:${colors.label};">Country:</label>
                    <select id="mh-country-select" style="width:100%;padding:8px;border-radius:4px;background:${colors.inputBg};border:1px solid ${colors.inputBorder};color:${colors.text};cursor:pointer;outline:none;">
                        <option value="au">Australia</option>
                        <option value="br">Brazil</option>
                        <option value="ca">Canada</option>
                        <option value="cn">China</option>
                        <option value="fr">France</option>
                        <option value="de">Germany</option>
                        <option value="in">India</option>
                        <option value="it">Italy</option>
                        <option value="jp">Japan</option>
                        <option value="kr">Korea</option>
                        <option value="es">Spain</option>
                        <option value="tw">Taiwan</option>
                        <option value="gb">United Kingdom</option>
                        <option value="us">United States</option>
                    </select>
                </div>
                <div style="margin-bottom:8px;">
                    <label for="mh-theme-select" style="display:block;margin-bottom:4px;color:${colors.label};">Theme:</label>
                    <select id="mh-theme-select" style="width:100%;padding:8px;border-radius:4px;background:${colors.inputBg};border:1px solid ${colors.inputBorder};color:${colors.text};cursor:pointer;outline:none;">
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                    </select>
                </div>
                <button id="mh-save-settings" style="width:100%;padding:8px;border-radius:5px;background:#28a745;color:white;border:none;cursor:pointer;">Save Settings</button>
            </div>
        `;
        document.body.appendChild(panel);

        $mh('#mh-load-images').addEventListener('click', loadCoverImages);
        $mh('#mh-settings-btn').addEventListener('click', toggleSettingsPanel);
        $mh('#mh-save-settings').addEventListener('click', saveAndCloseSettings);
        $mh('#mh-close-btn').addEventListener('click', () => panel.remove());

        return panel;
    }

    function toggleSettingsPanel() {
        const settingsPanel = $mh('#mh-settings-panel');
        const mainContent = $mh('#mh-artist-album-info')?.parentElement;

        if (settingsPanel.style.display === 'none') {
            loadSettingsIntoPanel();
            settingsPanel.style.display = 'block';
            if (mainContent) mainContent.style.display = 'none';
        } else {
            settingsPanel.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
        }
    }

    function loadSettingsIntoPanel() {
        const showMissingCheckbox = $mh('#mh-show-missing');
        if (showMissingCheckbox) showMissingCheckbox.checked = MH_CONFIG.showMissingIndicators;

        const openNewTabCheckbox = $mh('#mh-open-new-tab');
        if (openNewTabCheckbox) openNewTabCheckbox.checked = MH_CONFIG.openInNewTab;

        const compressImagesCheckbox = $mh('#mh-compress-images');
        if (compressImagesCheckbox) compressImagesCheckbox.checked = MH_CONFIG.compressImages;

        ALL_SOURCES.forEach(source => {
            const slug = createSourceSlug(source);
            const checkbox = $mh(`#mh-source-${slug}`);
            if (checkbox) checkbox.checked = MH_CONFIG.sources.includes(source);
        });
        $mh('#mh-country-select').value = MH_CONFIG.country;
        $mh('#mh-res-input').value = MH_CONFIG.resolution;
        $mh('#mh-theme-select').value = MH_CONFIG.theme;

        updateSourceCounter();
        setupSourceCheckboxListeners();
    }

    function updateSourceCounter() {
        const counter = $mh('#mh-source-counter');
        const warning = $mh('#mh-source-warning');
        if (!counter) return;

        const checkedCount = document.querySelectorAll('#mh-sources-checkboxes input[name="mh-sources"]:checked').length;
        counter.textContent = `${checkedCount}/9`;

        if (warning) {
            warning.style.display = checkedCount > 9 ? 'block' : 'none';
        }

        const allCheckboxes = document.querySelectorAll('#mh-sources-checkboxes input[name="mh-sources"]');
        if (checkedCount >= 9) {
            allCheckboxes.forEach(cb => {
                if (!cb.checked) {
                    cb.disabled = true;
                    cb.style.cursor = 'not-allowed';
                    cb.nextElementSibling.style.opacity = '0.5';
                    cb.nextElementSibling.style.cursor = 'not-allowed';
                }
            });
        } else {
            allCheckboxes.forEach(cb => {
                cb.disabled = false;
                cb.style.cursor = 'pointer';
                cb.nextElementSibling.style.opacity = '1';
                cb.nextElementSibling.style.cursor = 'pointer';
            });
        }
    }

    function setupSourceCheckboxListeners() {
        const checkboxes = document.querySelectorAll('#mh-sources-checkboxes input[name="mh-sources"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateSourceCounter);
        });
    }

    async function saveAndCloseSettings() {
        const checkedSources = Array.from(document.querySelectorAll('#mh-sources-checkboxes input[name="mh-sources"]:checked'))
            .map(cb => cb.value);

        if (checkedSources.length > 9) {
            alert('Please select a maximum of 9 sources.');
            return;
        }

        const showMissingCheckbox = $mh('#mh-show-missing');
        if (showMissingCheckbox) MH_CONFIG.showMissingIndicators = showMissingCheckbox.checked;

        const openNewTabCheckbox = $mh('#mh-open-new-tab');
        if (openNewTabCheckbox) MH_CONFIG.openInNewTab = openNewTabCheckbox.checked;

        const compressImagesCheckbox = $mh('#mh-compress-images');
        if (compressImagesCheckbox) MH_CONFIG.compressImages = compressImagesCheckbox.checked;

        MH_CONFIG.sources = checkedSources;
        MH_CONFIG.country = $mh('#mh-country-select').value;
        MH_CONFIG.resolution = $mh('#mh-res-input').value.trim();
        MH_CONFIG.theme = $mh('#mh-theme-select').value;

        await saveConfig();

        const panel = $mh('#mh-cover-panel');
        if (panel) {
            panel.remove();
            setTimeout(() => {
                const newPanel = createPanel();
                if (newPanel) $mh('#mh-status').textContent = 'Settings saved!';

                if (MH_CONFIG.showMissingIndicators) {
                    scanPageForMissingArtwork();
                }
            }, 100);
        }
    }

    async function loadCoverImages() {
        if (!currentInfo) {
            alert('Cannot determine artist/album info for this page.');
            return;
        }

        const statusEl = $mh('#mh-status');
        const loadBtn = $mh('#mh-load-images');

        if (statusEl) statusEl.textContent = 'Opening Cover Search Engine...';
        if (loadBtn) loadBtn.disabled = true;

        const url = buildMhUrl(currentInfo, {
            remoteText: `Pick an artwork for ${currentInfo.artist} - ${currentInfo.album}`
        });

        const popupWidth = 1000, popupHeight = 800;
        const left = (screen.width - popupWidth) / 2;
        const top = (screen.height - popupHeight) / 2;

        const popup = window.open(url, 'CoverSearchEngine',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`);

        if (!popup) {
            if (statusEl) statusEl.textContent = 'Failed to open popup. Please allow popups.';
            if (loadBtn) loadBtn.disabled = false;
            return;
        }

        if (statusEl) statusEl.textContent = 'Search opened, pick an artwork.';
        if (loadBtn) {
            loadBtn.textContent = 'Reopen Artwork Search';
            loadBtn.disabled = false;
        }
    }

    window.addEventListener('message', async (event) => {
        if (event.origin !== 'https://covers.musichoarders.xyz') return;
        if (event.data?.type === 'LASTFM_ARTWORK_SELECTED' && event.data.url) {
            const statusEl = $mh('#mh-status');
            try {
                const fileInput = await findLastFmFileInput();
                if (!fileInput) {
                    const errMsg = 'Upload input not found. Please ensure the upload dialog is open.';
                    if (statusEl) statusEl.textContent = errMsg;
                    return;
                }

                if (statusEl) statusEl.textContent = 'Artwork selected! Processing...';

                const { file } = await downloadImageAsFile(event.data.url, event.data.source);

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                fileInput.dispatchEvent(new Event('input', { bubbles: true }));
                await fillLastFmMetadata();

                if (statusEl) statusEl.textContent = `✓ Artwork set! You can now upload.`;
            } catch (e) {
                console.error('Failed to set artwork:', e);
                if (statusEl) statusEl.textContent = `Error: ${e.message}`;
            }
        }
    });

    async function fillLastFmMetadata() {
        try {
            await sleep(500);
            const pageInfo = extractArtistAlbum();
            if (!pageInfo) return;

            const titleInput = $mh('input#id_title[name="title"], input[name="title"]');
            const descInput = $mh('textarea#id_description[name="description"], textarea[name="description"]');

            if (titleInput) {
                const titleValue = `${pageInfo.artist} - ${pageInfo.album}`;
                titleInput.value = titleValue;
                titleInput.dispatchEvent(new Event('input', { bubbles: true }));
                titleInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (descInput) {
                const descValue = `Artwork of "${pageInfo.album}" by ${pageInfo.artist}`;
                descInput.value = descValue;
                descInput.dispatchEvent(new Event('input', { bubbles: true }));
                descInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } catch (e) {
            console.warn('Error filling metadata:', e);
        }
    }

    async function findLastFmFileInput(timeout = 10000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const fileInput = $mh('input#id_image[type="file"][name="image"]');
            if (fileInput?.offsetParent !== null) return fileInput;
            await sleep(500);
        }
        return null;
    }

    function getExtensionFromUrl(url) {
        try {
            const parts = url.split('?')[0].split('.');
            if (parts.length > 1) {
                const ext = parts[parts.length - 1].toLowerCase();
                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(ext)) return ext;
            }
        } catch {}
        return null;
    }

    function getExtensionFromMime(mime) {
        const map = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/bmp': 'bmp',
            'image/tiff': 'tiff',
            'image/svg+xml': 'svg'
        };
        return map[mime.toLowerCase()] || null;
    }
	/**
     * Downloads an image and processes it according to compression settings.
     * Returns the processed file with a descriptive filename.
     */
    async function downloadImageAsFile(url, source = 'Unknown Source') {
        let originalBlob;
        let wasModified = false;

        const fetchBlob = () => {
            if (typeof GM_xmlhttpRequest === 'function') {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                        onload: (res) => {
                            const hdrs = res.responseHeaders || '';
                            const m = hdrs.match(/content-type:\s*([^\r\n;]+)/i);
                            const mime = m?.[1] || 'image/jpeg';
                            resolve(new Blob([res.response], { type: mime }));
                        },
                        onerror: (err) => reject(new Error(`Failed to download: ${err.status || 'network error'}`)),
                        ontimeout: () => reject(new Error('Download timed out'))
                    });
                });
            } else {
                return fetch(url, { credentials: 'omit' })
                    .then(r => r.ok ? r.blob() : Promise.reject(new Error(`HTTP ${r.status}`)));
            }
        };

        originalBlob = await fetchBlob();
        let processedBlob = originalBlob;
        const originalSizeMB = originalBlob.size / (1024 * 1024);

        try {
            if (MH_CONFIG.compressImages && originalSizeMB > 5) {
                // Only compress if enabled AND image is over 5MB
                const result = await compressImage(originalBlob, 5, true, 'image/jpeg');
                processedBlob = result.blob;
                wasModified = result.wasModified;
            } else if (!MH_CONFIG.compressImages && (processedBlob.type !== 'image/jpeg' || originalSizeMB > 5)) {
                // Compression disabled: only convert to JPEG if needed for format or size
                const result = await compressImage(processedBlob, 5, false, 'image/jpeg');
                processedBlob = result.blob;
                wasModified = result.wasModified;
            }
        } catch (e) {
            console.error('[MH] Image processing failed:', e);
            processedBlob = originalBlob;
            wasModified = false;
        }

        const dimensions = await getImageDimensions(processedBlob);
        const mime = processedBlob.type || 'image/jpeg';
        const ext = getExtensionFromUrl(url) || getExtensionFromMime(mime) || 'jpg';
        const fileSizeMB = Math.max(0.1, parseFloat((processedBlob.size / (1024 * 1024)).toFixed(1)));

        const fileName = `${source}, ${dimensions.width}x${dimensions.height}, ${fileSizeMB}MB${wasModified ? ' (Compressed)' : ''}.${ext}`;

        try {
            return { file: new File([processedBlob], fileName, { type: mime }), wasModified };
        } catch {
            processedBlob.name = fileName;
            processedBlob.type = mime;
            return { file: processedBlob, wasModified };
        }
    }

    // === Initialization ===
    (async () => {
        await loadConfig();

        function checkAndCreatePanel() {
            const onUploadPath = isUploadPath();
            const panelExists = !!$mh('#mh-cover-panel');

            if (onUploadPath && !panelExists) {
                setTimeout(() => {
                    if (isUploadPath()) createPanel();
                }, 500);
            } else if (!onUploadPath && panelExists) {
                $mh('#mh-cover-panel')?.remove();
            }
        }

        checkAndCreatePanel();

        setTimeout(() => {
            if (MH_CONFIG.showMissingIndicators) {
                scanPageForMissingArtwork();
            }
        }, 2500);

        let lastUrl = location.href;
        let scanTimeout = null;

        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                checkAndCreatePanel();

                if (MH_CONFIG.showMissingIndicators) {
                    setTimeout(() => scanPageForMissingArtwork(), 1500);
                }
            } else {
                if (MH_CONFIG.showMissingIndicators) {
                    if (scanTimeout) clearTimeout(scanTimeout);

                    scanTimeout = setTimeout(() => {
                        scanPageForMissingArtwork();
                    }, 500);
                }
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: false
        });

        window.addEventListener('popstate', () => {
            checkAndCreatePanel();
            if (MH_CONFIG.showMissingIndicators) {
                setTimeout(() => scanPageForMissingArtwork(), 1000);
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && MH_CONFIG.showMissingIndicators) {
                setTimeout(() => scanPageForMissingArtwork(), 500);
            }
        });

        // Debug helper
        window._CoverFinder = {
            buildMhUrl: () => {
                const info = extractArtistAlbum();
                return info ? buildMhUrl(info) : 'Artist/Album info not available';
            },
            config: MH_CONFIG,
            saveConfig,
            loadConfig,
            createPanel,
            scanForMissing: scanPageForMissingArtwork
        };
    })();

})();