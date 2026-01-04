// ==UserScript==
// @name         Post Gallery
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Transforms post list into a gallery.
// @author       remuru
// @match        *://kemono.cr/*
// @match        *://coomer.st/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      kemono.cr
// @connect      coomer.st
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550228/Post%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/550228/Post%20Gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Configuration & Settings ---
    const DEFAULT_CONFIG = {
        LAYOUT: {
            GRID_GAP: "16px",
            GRID_COLUMN_COUNT: 4
        }
    };
    const MAX_CONCURRENT_DOWNLOADS = 10;
    let settings;
    const currentDomain = window.location.hostname;

    function loadSettings() {
        const savedSettings = localStorage.getItem('gallerySettings');
        settings = savedSettings ? {
            ...{
                gridColumnCount: DEFAULT_CONFIG.LAYOUT.GRID_COLUMN_COUNT
            },
            ...JSON.parse(savedSettings)
        } : {
            gridColumnCount: DEFAULT_CONFIG.LAYOUT.GRID_COLUMN_COUNT
        };
    }

    function saveSettings() {
        localStorage.setItem('gallerySettings', JSON.stringify(settings));
    }

    // --- 2. UI & Styling ---
    function addGlobalStyles() {
        // Using user-provided styles
        const STYLES = `
            body { position: relative; }
            body.lightbox-open { overflow: hidden; }
            .post-card { width: 100% !important; margin: 0 !important; break-inside: avoid; background: rgba(30, 32, 34, 0.8); border-radius: 8px; overflow: hidden; height: auto !important; transition: transform 0.2s ease, box-shadow 0.2s ease; }
            .post-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            #gallery-loader { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 8px; z-index: 10001; display: flex; align-items: center; font-family: sans-serif; }
            .loading-spinner { width: 20px; height: 20px; border: 3px solid #fff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 10px; }
            @keyframes spin { to { transform: rotate(360deg); } }

            .post-card__slider-container { position: relative; width: 100%; height: 0; padding-bottom: 125%; background-color: #000; overflow: hidden; }
            .slider-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; transition: transform 0.4s ease-in-out; }
            .slider-media-item { width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; display: block; background-color: #000; }
            .slider-btn { position: absolute;  z-index: 10; background-color: rgba(20, 20, 20, 0.6); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; line-height: 32px; text-align: center; cursor: pointer; opacity: 0; transition: opacity 0.2s ease, background-color 0.2s ease; user-select: none; }
            .slider-btn-centreY{top: 50%; transform: translateY(-50%);}
            .post-card:hover .slider-btn { opacity: 1; }
            .slider-btn:hover { background-color: rgba(0, 0, 0, 0.8); }
            .slider-btn-prev { left: 8px; }
            .slider-btn-next { right: 8px; }
            .slider-btn-zoom { left: 8px; width: 32px; height: 32px; font-size: 18px; line-height:32px; }
            .slider-counter { position: absolute; top: 8px; right: 8px; z-index: 10; background-color: rgba(20, 20, 20, 0.7); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; user-select: none; }

            /* Paginator Settings Styles */
             #gallery-paginator-settings { position: relative; margin-left: 20px; } #gallery-settings-toggle { background: #3a3f44; color: #ddd; border: 1px solid #555; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 14px; } #gallery-settings-toggle:hover { background: #4a4f54; }
            #gallery-settings-dropdown { display: none; position: absolute; margin-top:10px; left: 50%; transform: translateX(-50%); margin-bottom: 10px; background-color: rgba(30, 32, 34, 0.95); padding: 8px; border-radius: 8px; z-index: 1000; border: 1px solid #444; width: 220px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            #gallery-settings-dropdown input[type=range] { width: 100%; }

            /* Lightbox Styles */
            #gallery-lightbox { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.9); z-index: 11000; }
            .lightbox-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .lightbox-wrapper { width: 100%; height: 100%; display: flex; transition: transform 0.4s ease-in-out; }
            .lightbox-slide { width: 100%; height: 100%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
            .lightbox-media-item { max-width: 95vw; max-height: 95vh; object-fit: contain; }
            .lightbox-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 11002; background-color: rgba(20, 20, 20, 0.6); color: white; border: none; border-radius: 50%; width: 48px; height: 48px; font-size: 28px; cursor: pointer; transition: background-color 0.2s ease; user-select: none; }
            .lightbox-btn:hover { background-color: rgba(0, 0, 0, 0.8); }
            .lightbox-prev-btn { left: 15px; } .lightbox-next-btn { right: 15px; }
            .lightbox-close-btn { top: 15px; right: 15px; transform: none; }
            .lightbox-fullscreen-btn { top: 15px; right: 75px; transform: none; }
            .lightbox-counter { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); background-color: rgba(20, 20, 20, 0.7); color: white; padding: 4px 12px; border-radius: 16px; font-size: 16px; user-select: none; }
        `;
        GM_addStyle(STYLES);
        const dynamicStyles = document.createElement('style');
        dynamicStyles.id = 'dynamic-gallery-styles';
        document.head.appendChild(dynamicStyles);
    }

    function updateGridStyle() {
        const dynamicStyles = document.getElementById('dynamic-gallery-styles');
        if (dynamicStyles) {
            dynamicStyles.innerHTML = `.card-list--legacy .card-list__items { display: grid !important; grid-template-columns: repeat(${settings.gridColumnCount}, 1fr); gap: ${DEFAULT_CONFIG.LAYOUT.GRID_GAP}; padding-top: ${DEFAULT_CONFIG.LAYOUT.GRID_GAP}; width: 100%; margin: 0 auto; }`;
        }
    }

    function createPaginatorSettings() {
        if (document.getElementById('gallery-paginator-settings')) return;
        const paginatorMenu = document.querySelector('.paginator menu');
        if (!paginatorMenu) return;
        const container = document.createElement('div');
        container.id = 'gallery-paginator-settings';
        container.innerHTML = `<button id="gallery-settings-toggle">Columns:<span id="gallery-column-count-display">${settings.gridColumnCount}</span></button><div id="gallery-settings-dropdown"><input type="range" id="column-count-slider" min="1" max="12" step="1" value="${settings.gridColumnCount}"></div>`;
        paginatorMenu.insertAdjacentElement('afterend', container);
        const toggleBtn = container.querySelector('#gallery-settings-toggle');
        const dropdown = container.querySelector('#gallery-settings-dropdown');
        const slider = container.querySelector('#column-count-slider');
        const display = container.querySelector('#gallery-column-count-display');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        slider.addEventListener('input', () => {
            settings.gridColumnCount = parseInt(slider.value, 10);
            display.textContent = settings.gridColumnCount;
            updateGridStyle();
        });
        slider.addEventListener('change', saveSettings);
    }

    // --- 2.1. Lightbox Creation & Control ---
    function createLightbox() {
        if (document.getElementById('gallery-lightbox')) return;
        const lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-btn lightbox-close-btn">&times;</button>
            <button class="lightbox-btn lightbox-fullscreen-btn">&#x26F6;</button>
            <div class="lightbox-container">
                <button class="lightbox-btn lightbox-prev-btn">&#10094;</button>
                <div class="lightbox-wrapper"></div>
                <button class="lightbox-btn lightbox-next-btn">&#10095;</button>
            </div>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);
        lightbox.querySelector('.lightbox-close-btn').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-fullscreen-btn').addEventListener('click', () => toggleFullscreen(lightbox));
    }

    /**
 * Creates and appends a media element (image or video) to a slide.
 * @param {HTMLElement} slide - The slide element to append the media to.
 * @param {number} slideIndex - The index of the current slide.
 * @param {number} currentIndex - The index of the active lightbox slide.
 */
function createMediaElement(slide, slideIndex, currentIndex) {
    if (!slide || slide.childElementCount > 0) {
        return;
    }

    const { type, fullSrc, src } = slide.dataset;
    let mediaElement;

    if (type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = src;
        Object.assign(mediaElement, {
            controls: true,
            autoplay: slideIndex === currentIndex,
            muted: true,
            loop: true
        });
    } else {
        mediaElement = document.createElement('img');
        mediaElement.src = fullSrc;
    }

    mediaElement.className = 'lightbox-media-item';
    slide.appendChild(mediaElement);
}

/**
 * Preloads a window of slides around the current index for a lightbox.
 * @param {HTMLElement} wrapper - The container for the lightbox slides.
 * @param {number} currentIndex - The index of the currently displayed slide.
 * @param {number} PRELOAD_WINDOW - The number of slides to preload on each side.
 */
function preloadLightboxSlides(wrapper, currentIndex, PRELOAD_WINDOW) {
    const slides = wrapper.children;
    const totalSlides = slides.length;
    currentIndex = parseInt(currentIndex);

    for (let i = currentIndex - PRELOAD_WINDOW; i <= currentIndex + PRELOAD_WINDOW; i++) {
        const slideIndex = (i + totalSlides) % totalSlides;
        const slide = slides[slideIndex];
        createMediaElement(slide, slideIndex, currentIndex);
    }
}

    function openLightbox(mediaData, startingIndex) {
        const lightbox = document.getElementById('gallery-lightbox');
        const wrapper = lightbox.querySelector('.lightbox-wrapper');
        if (!lightbox || !wrapper) return;

        wrapper.innerHTML = '';
        mediaData.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'lightbox-slide';
            slide.addEventListener('click', (e) => {
                if (e.target === slide) closeLightbox();
            });
            slide.dataset.type = item.type;
            if (item.type === 'video') {
                slide.dataset.src = item.src;
            } else {
                slide.dataset.fullSrc = item.full;
            }
            wrapper.appendChild(slide);
        });
        preloadLightboxSlides(wrapper, startingIndex, 0)
        setupLightboxSlider(wrapper, startingIndex);
        document.body.classList.add('lightbox-open');
        lightbox.style.display = 'block';        
    }

    function closeLightbox() {
        const lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) return;
        document.body.classList.remove('lightbox-open');
        lightbox.style.display = 'none';
        lightbox.querySelector('.lightbox-wrapper').innerHTML = '';
        if (document.fullscreenElement) document.exitFullscreen();
    }

    function toggleFullscreen(element) {
        if (!document.fullscreenElement) {
            element.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    }

    function showLoader() {
        if (!document.getElementById('gallery-loader')) {
            const l = document.createElement('div');
            l.id = 'gallery-loader';
            l.innerHTML = `<div class="loading-spinner"></div><span>Gallery: Loading...</span>`;
            document.body.appendChild(l);
        }
    }

    function hideLoader() {
        const l = document.getElementById('gallery-loader');
        if (l) l.remove();
    }

     function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        if (userProfileMatch && !query) return {
            type: 'profile',
            service: userProfileMatch[1],
            userId: userProfileMatch[2]
        };
        if (userProfileMatch && query) return {
            type: 'user_search',
            service: userProfileMatch[1],
            userId: userProfileMatch[2],
            query
        };
        if (pathname === '/posts/popular') {
            return {
                type: 'popular_posts',
                date: searchParams.get('date') || 'none',
                period: searchParams.get('period') || 'recent'
            };
        };
        if (pathname === '/posts') return {
            type: 'global_search',
            query: query || null
        };
        console.error('Video Filter: Unknown page structure for context.', pathname, window.location.search);
        return null;
    }

    /**
     * Constructs the appropriate API URL based on the determined page context and offset.
     * @param {object} context - The context object from determinePageContext.
     * @param {number} offset - The post offset for pagination.
     * @returns {string|null} The constructed API URL or null.
     */
    function buildApiUrl(context, offset) {
        let baseApiUrl = `https://${currentDomain}/api/v1`;
        let queryParams = [];
        switch (context.type) {
            case 'profile':
                if(offset>0) queryParams.push(`o=${offset}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                if(offset>0) queryParams.push(`o=${offset}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'global_search':
                if(offset>0) queryParams.push(`o=${offset}`);
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/posts?${queryParams.join('&')}`;
            case 'popular_posts':
                if(context.date !='none' && context.period!="recent") queryParams.push(`date=${encodeURIComponent(context.date)}`);
                if(offset>0) queryParams.push(`o=${offset}`);
                queryParams.push(`period=${encodeURIComponent(context.period)}`);
                return `${baseApiUrl}/posts/popular?${queryParams.join('&')}`;
            default:
                return null;
        }
    }

    function fetchData(apiUrl) {
        console.log('apiUrl', apiUrl);
        const headers = { "Accept": "text/css", "Referer": window.location.href, "User-Agent": navigator.userAgent, "X-Requested-With": "XMLHttpRequest" };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: apiUrl, headers: headers,
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) { try { resolve(JSON.parse(resp.responseText)); } catch (e) { reject(`Error parsing JSON: ${e.message}`); } }
                    else { reject(`API request failed: ${resp.status}`); }
                },
                onerror: resp => reject(`API request error: ${resp.statusText || 'Network error'}`)
            });
        });
    }

    function processApiData(posts) {
        const mediaMap = new Map();
        for (const post of posts) {
            if (!post.id) continue;
            const postVideos = [],
                postImages = [],
                allFiles = [post.file, ...post.attachments].filter(f => f && f.path);
            for (const file of allFiles) {
                if (!file.path) continue;
                const n = file.name ? file.name.toLowerCase() : '',
                    u = `https://${currentDomain}/data${file.path}`;
                if (['.mp4', '.webm', '.mov', '.m4v'].some(e => n.endsWith(e))) postVideos.push({
                    type: 'video',
                    src: u
                });
                else if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(e => n.endsWith(e))) postImages.push({
                    type: 'image',
                    thumbnail: u.replace(`https://${currentDomain}/`, `https://img.${currentDomain}/thumbnail/`),
                    full: u
                });
            }
            const uniqueVideos = Array.from(new Map(postVideos.map(v => [v.src, v])).values()),
                uniqueImages = Array.from(new Map(postImages.map(img => [img.full, img])).values()),
                posterUrl = uniqueImages.length > 0 ? uniqueImages[0].thumbnail : null;
            uniqueVideos.forEach(v => v.poster = posterUrl);
            mediaMap.set(post.id, {
                media: [...uniqueVideos, ...uniqueImages]
            });
        }
        return mediaMap;
    }

    // --- 4. DOM Manipulation & Interactivity ---
        function setupLightboxSlider(wrapper, startingIndex) {
        const lightbox = document.getElementById('gallery-lightbox');
        const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
        const nextBtn = lightbox.querySelector('.lightbox-next-btn');
        const counter = lightbox.querySelector('.lightbox-counter');
        const slides = wrapper.children;
        const totalSlides = slides.length;
        let currentIndex = startingIndex;

        if (totalSlides <= 1) { 
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (counter) counter.style.display = 'none';
            updateView();
            return;
        } else {
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
            if (counter) counter.style.display = 'block';
        }


        function updateView(previousIndex) {
            currentIndex = parseInt(currentIndex);
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            preloadLightboxSlides(wrapper, currentIndex, 2);
            if (counter) counter.textContent = `${1 + parseInt(currentIndex)} / ${totalSlides}`;
            if (previousIndex !== undefined && previousIndex !== currentIndex) {
                const prevSlide = slides[previousIndex];
                const prevMedia = prevSlide ? prevSlide.querySelector('video') : null;
                if (prevMedia) prevMedia.pause();
            }
            const currentSlide = slides[currentIndex];
            const currentMedia = currentSlide ? currentSlide.querySelector('video') : null;
            if (currentMedia) currentMedia.play().catch(() => {});
        }

        const clickHandler = (direction) => {
            const previousIndex = currentIndex;
            if (direction === -1) { 
                currentIndex = (parseInt(currentIndex) - 1 + totalSlides) % totalSlides;
            } else { 
                currentIndex = (parseInt(currentIndex) + 1) % totalSlides;
            }

            if (previousIndex !== currentIndex) {
                updateView(previousIndex);
            }
        };

        prevBtn.onclick = (e) => {
            e.stopPropagation();
            clickHandler(-1);
        };
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            clickHandler(1);
        };

        updateView();
    }

        function setupCardSlider(container, PRELOAD_RADIUS = 1) {
    const wrapper = container.querySelector('.slider-wrapper');
    const prevBtn = container.querySelector('.slider-btn-prev');
    const nextBtn = container.querySelector('.slider-btn-next');
    const counter = container.querySelector('.slider-counter');
    const mediaElements = Array.from(wrapper.children);
    const totalSlides = mediaElements.length;
    let currentIndex = 0;

    if (!prevBtn || !nextBtn) return;

    const lazyLoadInWindow = (PRELOAD_RADIUS) => {
        for (let i = -PRELOAD_RADIUS; i <= PRELOAD_RADIUS; i++) {
            const indexToLoad = (currentIndex + i + totalSlides) % totalSlides;
            const img = mediaElements[indexToLoad];

            if (img && img.tagName === 'IMG' && !img.src) {
                img.src = img.dataset.thumbnailSrc;
            }
        }
    };

    const updateView = () => {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        container.dataset.currentIndex = currentIndex;
        if (counter) counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    };

    const clickHandler = (direction) => {
        if (direction === -1) {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        } else if (direction === 1) {
            currentIndex = (currentIndex + 1) % totalSlides;
        } else {
            return;
        }

        lazyLoadInWindow(PRELOAD_RADIUS = 2);
        updateView();
    };

    prevBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        clickHandler(-1);
    };

    nextBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        clickHandler(1);
    };

    lazyLoadInWindow();
    updateView();
}


    function updateDOM(mediaMap) {
        document.querySelectorAll('.post-card:not([data-gallery-processed])').forEach(card => {
            card.dataset.galleryProcessed = 'true';
            const postId = card.dataset.id;
            if (!postId) return;

            const data = mediaMap.get(postId);
            if (!data || !data.media || data.media.length === 0) return;

            const mediaItems = data.media;
            const originalContainer = card.querySelector('.post-card__image-container, .post-card__video-container');
            const newMediaContainer = document.createElement('div');
            newMediaContainer.className = 'post-card__slider-container';

            const wrapper = document.createElement('div');
            wrapper.className = 'slider-wrapper';

            mediaItems.forEach((item, index) => {
                let mediaElement;
                if (item.type === 'video') {
                    mediaElement = document.createElement('video');
                    Object.assign(mediaElement, {
                        loop: true,
                        muted: true,
                        preload: "metadata",
                        controls: true
                    });
                    if (item.poster) mediaElement.poster = item.poster;
                    mediaElement.dataset.src = item.src;
                    lazyLoadObserver.observe(mediaElement);
                } else {
                    mediaElement = document.createElement('img');
                    if (index === 0) {
                        mediaElement.src = item.thumbnail;
                    } else {
                        mediaElement.dataset.thumbnailSrc = item.thumbnail;
                    }
                    mediaElement.dataset.fullSrc = item.full;
                }
                mediaElement.className = 'slider-media-item';
                wrapper.appendChild(mediaElement);
            });
            newMediaContainer.appendChild(wrapper);

            let buttonsHTML = '';
            if (mediaItems.length > 1) {
                buttonsHTML += `<button class="slider-btn slider-btn-prev slider-btn-centreY">&#10094;</button><button class="slider-btn slider-btn-next slider-btn-centreY">&#10095;</button><div class="slider-counter">1 / ${mediaItems.length}</div>`;
            }
            buttonsHTML += `<button class="slider-btn slider-btn-zoom" title="View in Lightbox">&#x26F6;</button>`;
            newMediaContainer.insertAdjacentHTML('beforeend', buttonsHTML);

            if (originalContainer) originalContainer.replaceWith(newMediaContainer);
            else {
                const header = card.querySelector('.post-card__header');
                if (header) header.insertAdjacentElement('afterend', newMediaContainer);
                else card.prepend(newMediaContainer);
            }

            const zoomBtn = newMediaContainer.querySelector('.slider-btn-zoom');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentIndex = newMediaContainer.dataset.currentIndex || 0;
                    openLightbox(mediaItems, currentIndex);
                });
            }

            if (mediaItems.length > 1) {
                setupCardSlider(newMediaContainer,0);
            }

            const firstVideo = newMediaContainer.querySelector('video');
            if (firstVideo) {
                card.addEventListener('mouseenter', () => {
                    firstVideo.play().catch(() => {});
                });
                card.addEventListener('mouseleave', () => {
                    firstVideo.pause();
                });
            }

        });
    }

    // --- 5. Performance & Loading ---
    let downloadQueue = [];
    let activeDownloads = 0;

    function getVideoMimeType(u) {
        const e = u.split('.').pop().toLowerCase();
        switch (e) {
            case 'mp4':
            case 'm4v':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'mov':
                return 'video/quicktime';
            default:
                return 'video/mp4';
        }
    }

    function startVideoLoad(v) {
        const onComplete = () => {
            activeDownloads--;
            processQueue();
        };
        v.addEventListener('loadeddata', onComplete, {
            once: true
        });
        v.addEventListener('error', () => {
            console.error('Video load error:', v.dataset.src);
            onComplete();
        }, {
            once: true
        });
        const s = document.createElement('source');
        s.src = v.dataset.src;
        s.type = getVideoMimeType(v.dataset.src);
        v.appendChild(s);
        v.load();
    }

    function processQueue() {
        while (activeDownloads < MAX_CONCURRENT_DOWNLOADS && downloadQueue.length > 0) {
            activeDownloads++;
            const v = downloadQueue.shift();
            startVideoLoad(v);
        }
    }
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const m = entry.target;
                observer.unobserve(m);
                if (m.tagName === 'VIDEO') {
                    downloadQueue.push(m);
                    processQueue();
                }
            }
        });
    }, {
        rootMargin: "200px"
    });

    // --- 6. Main Execution Logic ---
    async function runScript() {
        const postContainer = document.querySelector('.card-list__items');
        if (!postContainer || postContainer.querySelector('.post-card').dataset.galleryInitialized) return;
        postContainer.querySelector('.post-card').dataset.galleryInitialized = 'true';

        showLoader();
        createPaginatorSettings();
        try {
            const context = determinePageContext();
            const apiUrl = buildApiUrl(context, new URLSearchParams(window.location.search).get('o') || 0);
            if (!apiUrl) throw new Error("Could not build API URL.");
            const apiResponse = await fetchData(apiUrl);
            const postsArray = Array.isArray(apiResponse) ? apiResponse : (apiResponse && Array.isArray(apiResponse.posts)) ? apiResponse.posts : [];
            if (postsArray.length === 0) {
                hideLoader();
                return;
            }
            updateDOM(processApiData(postsArray));
        } catch (error) {
            console.error("Gallery script failed:", error);
        } finally {
            hideLoader();
            console.log('runScript!!!!!!!!');
        }
    }


function setupNavigationObserver() {
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(runScript, 100);
    };
    window.addEventListener('popstate', runScript);

    const observerTarget = document.querySelector('#content') || document.body;

    const observer = new MutationObserver(() => {
        const unprocessedContainer = document.querySelector('.card-list__items:not([data-gallery-initialized])');
        if (unprocessedContainer) {
            runScript();
        }
    });

    observer.observe(observerTarget, {
        childList: true,
        subtree: true
    });
}

    function initialize() {
        loadSettings();
        addGlobalStyles();
        createLightbox();
        updateGridStyle();
        (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', runScript): runScript();
        setupNavigationObserver();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
    initialize();

})();