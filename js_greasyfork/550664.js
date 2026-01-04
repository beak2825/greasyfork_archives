// ==UserScript==
// @name         4chan-masonry
// @namespace    0000xFFFF
// @version      1.3.3
// @description  View all media (images+videos) from a 4chan thread in a masonry grid layout.
// @author       0000xFFFF
// @license      MIT
// @match        *://boards.4chan.org/*/thread/*
// @match        *://boards.4channel.org/*/thread/*
// @grant        GM_addStyle
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIACaAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAGFJREFUeJxjYICA/0iYEMBQ+z/tjDEcEzAEp1piDCFOM7EGYBiCxW/EihH2KxFhg10zzCZSDMHQTKohFBtAkRdQQhtPIGI1CJ9CrAYjG0JxUqaOAcg0IQOwqf2PRuMDKGoBmcLsrWcgpCUAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/550664/4chan-masonry.user.js
// @updateURL https://update.greasyfork.org/scripts/550664/4chan-masonry.meta.js
// ==/UserScript==

const GRID_ROWS_MIN = 1;
const GRID_ROWS_MAX = 15;
const GRID_ROWS_DEFAULT = 4;
const CONCURRENT_LOADS_IMAGE = 3;
const CONCURRENT_LOADS_VIDEO = 1;
const LOAD_DELAY_IMAGE = 10;
const LOAD_DELAY_VIDEO = 300;
const PRELOAD_VIEWPORT_BUFFER = 200; // Load images within 200px of viewport

function GM_addStyle(css) {
    const style = document.createElement("style");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    return style;
}

// Usage

var MasonryCss = `

#fcm_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.95);
    z-index: 10000;
    overflow: auto;
    box-sizing: border-box;
}

#fcm_topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    z-index: 999;
    transition: transform 0.3s ease-in-out;
    will-change: transform;
    backdrop-filter: blur(5px);
}

.fcm_slider_container {
    display: flex;
    align-items: center;
    gap: 15px;
}

.fcm_close {
    padding: 8px 12px;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.2s ease;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fcm_close:hover {
    background: #b71c1c;
    transform: scale(1.05);
}

#fcm_masonry {
    display: block;
    gap: 10px;
    margin-top: 90px;
    column-gap: 5px;
}

.fcm_shortcut_4chanx {
    margin: 0 0 0 5px;
    padding: 0;
    cursor: pointer;
    justify-content: center;
}

.fcm_shortcut_4chanx img {
    width: 16px;
    height: 13px;
}

.fcm_button_regular {
    padding: 12px 18px;
    display: flex;
    gap: 5px;
    background: #2d5016;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.fcm_button_regular:hover {
    background: #4a7c21;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.fcm_button_regular img {
    height: 15px;
}

.fcm_container {
    display: flex;
    margin: 15px 0 15px 0;
}

.fcm_grid_container {
    max-width: 97vw;
    margin: 0 auto;
}

.fcm_value_display {
    color: white;
    font-weight: bold;
    font-size: 16px;
    min-width: 20px;
}

.fcm_media_wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.fcm_media_wrapper:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0,0,0,0.6);
    z-index: 100;
}

.fcm_media_img,
.fcm_media_thumb,
.fcm_media_video {
    width: 100%;
    display: block;
    object-fit: cover;
    cursor: pointer;
}

.fcm_media_loading, .fcm_media_thumb {

}

.fcm_media_img {
    object-fit: contain;
    transition: opacity 0.3s ease;
}

.fcm_media_video {
    object-fit: contain;
    display: none;
}

.fcm_play_btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    pointer-events: none;
    opacity: 0.4;
}

.fcm_tooltip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 8px;
    font-size: 12px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    word-break: break-all;
}

.fcm_media_wrapper:hover .fcm_tooltip {
    transform: translateY(0);
}

`;

GM_addStyle(MasonryCss);

const userscript_icon_1 = "data:image/ico;base64,AAABAAEAEBAAAAEAIACFAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAExJREFUeJxjYBhM4D8SJlnN/7QzxnCMwxCCavApIE0zIQNwGoLFj9jYhMIJ01ZiNVDNAEJeIMtWolxDUTRSzwBkmkg5VEPQaGLlyAcAWwCk9UAWSQAAAAAASUVORK5CYII="
const userscript_icon_2 = "data:image/ico;base64,AAABAAEAEBAAAAEAIACaAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAGFJREFUeJxjYICA/0iYEMBQ+z/tjDEcEzAEp1piDCFOM7EGYBiCxW/EihH2KxFhg10zzCZSDMHQTKohFBtAkRdQQhtPIGI1CJ9CrAYjG0JxUqaOAcg0IQOwqf2PRuMDKGoBmcLsrWcgpCUAAAAASUVORK5CYII=";
const userscript_icon_3 = "data:image/ico;base64,AAABAAEACggAAAEAIABkAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAKAAAACAgGAAAAwPputgAAACtJREFUeJxjYEAF/9EwVvA/7YwxCsamGF0Sq2IMRbgUE62QaKtJ8gzB4AEA82hZQXIdFlEAAAAASUVORK5CYII="


let gridRows = GRID_ROWS_DEFAULT;
let isGridOpen = false;
let gridOverlay = null;
let loadQueue = [];
let activeLoadsImage = 0;
let activeLoadsVideo = 0;
let preloadCache = new Map(); // Cache to avoid duplicate requests

// Rate limiting function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if element is near viewport
function isNearViewport(element, buffer = PRELOAD_VIEWPORT_BUFFER) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    return (
        rect.bottom >= -buffer &&
        rect.top <= windowHeight + buffer &&
        rect.right >= -buffer &&
        rect.left <= windowWidth + buffer
    );
}

// Queue-based image preloader
async function preloadMedia(url, priority = 'low', type = 'image') {
    if (preloadCache.has(url)) {
        return preloadCache.get(url);
    }

    return new Promise((resolve, reject) => {
        loadQueue.push({ url, resolve, reject, priority, type });
        processLoadQueue();
    });
}

// Process the load queue with rate limiting
async function processLoadQueue() {
    if ((activeLoadsImage >= CONCURRENT_LOADS_IMAGE || activeLoadsVideo >= CONCURRENT_LOADS_VIDEO) || loadQueue.length === 0) {
        return;
    }

    // Sort by priority (high priority first)
    loadQueue.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const item = loadQueue.shift();

    let delayMs = 0;
    if (item.type === 'image') {
        activeLoadsImage++;
        delayMs = LOAD_DELAY_IMAGE;
    }
    else {
        activeLoadsVideo++;
        delayMs = LOAD_DELAY_VIDEO;
    }

    try {
        await delay(delayMs); // Rate limiting delay

        const result = await loadMedia(item.url, item.type);
        preloadCache.set(item.url, result);
        item.resolve(result);
    } catch (error) {
        console.warn(`Failed to load ${item.url}:`, error);
        item.reject(error);
    } finally {
        if (item.type === 'image') {
            activeLoadsImage--;
        }
        else {
            activeLoadsVideo--;
        }

        // Process next item in queue
        setTimeout(processLoadQueue, 50);
    }
}

function updateQueuePriority(url, newPriority) {
    const item = loadQueue.find(i => i.url === url);
    if (item) {
        item.priority = newPriority;
    }
}

function updatePriorities() {
    document.querySelectorAll('.fcm_media_img').forEach(img => {
        const url = img.dataset.fullUrl;

        if (!url) return; // Already loaded
        if (preloadCache.has(url)) return; // Already done

        const item = loadQueue.find(i => i.url === url);
        if (item) {
            item.priority = isNearViewport(img) ? 'medium' : 'low';
        }
    });
}

function throttle(fn, delay) {
    let lastCall = 0;
    let timeout;

    return function (...args) {
        const now = Date.now();

        if (now - lastCall < delay) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                lastCall = Date.now();
                fn.apply(this, args);
            }, delay - (now - lastCall));
        } else {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

const throttledUpdatePriorities = throttle(updatePriorities, 800);
window.addEventListener('scroll', throttledUpdatePriorities);
window.addEventListener('resize', throttledUpdatePriorities);

// Actual media loading function
function loadMedia(url, type) {
    return new Promise((resolve, reject) => {
        if (type === 'image') {
            const img = new Image();

            const timeout = setTimeout(() => {
                reject(new Error('Image load timeout'));
            }, 10000); // 10 second timeout

            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Image load failed'));
            };

            img.src = url;
        } else if (type === 'video') {
            const video = document.createElement('video');

            const timeout = setTimeout(() => {
                reject(new Error('Video load timeout'));
            }, 15000); // 15 second timeout for videos

            video.addEventListener('loadeddata', () => {
                clearTimeout(timeout);
                resolve(video);
            });

            video.addEventListener('error', () => {
                clearTimeout(timeout);
                reject(new Error('Video load failed'));
            });

            video.src = url;
            video.preload = 'metadata'; // Only load metadata initially
        }
    });
}

// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const fullUrl = img.dataset.fullUrl;

            if (fullUrl && !img.dataset.loading) {
                img.dataset.loading = 'true';

                preloadMedia(fullUrl, isNearViewport(img) ? 'medium' : 'low').then((fullImg) => {
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.src = fullImg.src;
                        img.style.opacity = '1';
                        img.removeAttribute('data-full-url');
                        img.removeAttribute('data-loading');
                        img.classList.remove("fcm_media_loading");
                    }, 200);
                }).catch(() => {
                    img.removeAttribute('data-loading');
                    img.classList.remove("fcm_media_loading");
                });
            }
        }
    });
}, {
    rootMargin: '200px' // Start loading 200px before entering viewport
});

function createOptimizedVideoElement(mediaData, thumbImg, playBtn, mediaWrapper) {
    let video = null;
    let videoLoaded = false;
    let hoverTimeout = null;
    let isHovering = false;

    const createVideo = () => {
        if (!video) {
            video = document.createElement('video');
            video.className = "fcm_media_video";
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.style.display = 'none';

            video.addEventListener('canplay', () => {
                videoLoaded = true;
                if (isNearViewport(video) && !video.controls) {
                    showVideo();
                }
            });

            video.addEventListener('loadstart', () => {
                console.log('Video loading started:', mediaData.url);
            });

            mediaWrapper.appendChild(video);
        }
        return video;
    };

    const showVideo = () => {
        if (video && videoLoaded) {
            thumbImg.style.display = 'none';
            playBtn.style.display = 'none';
            video.style.display = 'block';
            video.play().catch(() => { });
        }
    };

    const hideVideo = () => {
        if (video && !video.controls) {
            video.pause();
            video.style.display = 'none';
            thumbImg.style.display = 'block';
            playBtn.style.display = 'flex';
        }
    };

    // Hover enter - start loading after delay
    mediaWrapper.addEventListener('mouseenter', () => {
        isHovering = true;
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
            if (isHovering) { // Double-check still hovering
                const vid = createVideo();

                if (videoLoaded) {
                    // Video already loaded, show immediately
                    showVideo();
                }
                else if (!vid.src) {
                    // Queue the video load instead of hitting server immediately
                    preloadMedia(mediaData.url, 'high', 'video')
                        .then((videoEl) => {
                            vid.src = mediaData.url;
                        })
                        .catch(() => {
                            console.warn("Failed to queue video load:", mediaData.url);
                        });
                }
                // If video is loading, showVideo() will be called from 'canplay' event
            }
        }, 100); // Reduced delay for better responsiveness
    });

    // Hover leave - hide video and cancel loading if needed
    mediaWrapper.addEventListener('mouseleave', () => {
         isHovering = false;
         clearTimeout(hoverTimeout);
         //hideVideo();
    });

    // Click handler - permanent video with controls
    mediaWrapper.addEventListener('click', (e) => {
        if (!video || video.controls) return; // Already clicked or no video

        e.preventDefault();
        const vid = createVideo();

        // Set up for permanent display
        vid.muted = false;
        vid.controls = true;
        vid.style.display = 'block';
        thumbImg.style.display = 'none';
        playBtn.style.display = 'none';

        if (!vid.src) {
            vid.src = mediaData.url;
        }

        // Play when ready
        if (videoLoaded) {
            vid.play().catch(() => { });
        } else {
            vid.addEventListener('canplay', () => {
                vid.play().catch(() => { });
            }, { once: true });
        }
    });
}

// Replace the image creation part in createMasonryGrid function
function createOptimizedMediaElement(mediaData) {
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = "fcm_media_wrapper";

    if (mediaData.isVideo) {
        // Thumbnail image
        const thumbImg = document.createElement('img');
        thumbImg.src = mediaData.thumbnail;
        thumbImg.className = "fcm_media_thumb";
        thumbImg.loading = 'lazy';
        mediaWrapper.appendChild(thumbImg);

        // Play button overlay
        const playBtn = document.createElement('div');
        playBtn.className = "fcm_play_btn";
        playBtn.innerHTML = '&#9658;';
        mediaWrapper.appendChild(playBtn);

        // Use optimized video creation
        createOptimizedVideoElement(mediaData, thumbImg, playBtn, mediaWrapper);
    } else {
        const img = document.createElement('img');
        img.className = "fcm_media_img fcm_media_loading";
        img.src = mediaData.thumbnail;
        img.loading = 'lazy';
        img.dataset.fullUrl = mediaData.url;

        mediaWrapper.addEventListener('mouseenter', () => {
            updateQueuePriority(mediaData.url, 'high');
        });

        // Use Intersection Observer for lazy loading
        imageObserver.observe(img);
        mediaWrapper.appendChild(img);
    }

    // Filename tooltip
    const tooltip = document.createElement('div');
    tooltip.textContent = mediaData.originalName;
    tooltip.className = "fcm_tooltip";

    // Middle click handler
    mediaWrapper.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            window.open(mediaData.url, '_blank');
        }
    });

    mediaWrapper.appendChild(tooltip);
    return mediaWrapper;
}

// Add cleanup function for when grid is closed
function cleanupPreloading() {
    // Cancel pending loads
    loadQueue.forEach(item => {
        item.reject(new Error('Cleanup cancelled'));
    });
    loadQueue = [];
    activeLoads = 0;

    // this is handles with refresh
    // // Clear cache periodically to prevent memory leaks
    // if (preloadCache.size > 100) {
    //     preloadCache.clear();
    // }

    // Disconnect observer
    imageObserver.disconnect();
}

function initUI() {
    const button = document.createElement('span');
    button.title = "Masonry Grid";

    button.addEventListener('click', function(e) {
        e.preventDefault();
        openGrid();
    });

    const forchanX_header = document.getElementById("header-bar")
    if (forchanX_header) { // if 4chan X is detected

        const element = document.getElementById("shortcut-watcher");
        button.id = "shortcut-masonry";
        button.className = "shortcut brackets-wrap fcm_shortcut_4chanx";

        const img = document.createElement("img");
        img.src = userscript_icon_1;
        button.appendChild(img);


        img.addEventListener('mouseover', () => {
            if (!img.classList.contains('clicked')) {
                img.src = userscript_icon_2;
            }
        });


        img.addEventListener('mouseout', () => {
            if (!img.classList.contains('clicked')) {
                img.src = userscript_icon_1;
            }
        });

        img.addEventListener('mousedown', () => {
            img.classList.add('pressed');
            img.src = userscript_icon_3;
        });


        img.addEventListener('mouseup', () => {
            img.classList.remove('pressed');

            if (img.matches(':hover')) {
                img.src = userscript_icon_2;
            } else {
                img.src = userscript_icon_1;
            }
        });

        // also handle case where mouse is released outside the image
        document.addEventListener('mouseup', () => {
            if (img.classList.contains('pressed')) {
                img.classList.remove('pressed');
                if (img.matches(':hover')) {
                    img.src = 'icon2.png';
                } else {
                    img.src = 'icon1.png';
                }
            }
        });

        forchanX_header.appendChild(button);
        element.parentElement.insertBefore(button, element);
    }
    else {
        button.className = "fcm_button_regular";

        const img = document.createElement("img");
        img.src = userscript_icon_3;
        button.appendChild(img);

        const span = document.createElement("span");
        span.innerHTML = "Masonry Grid";
        button.appendChild(span);

        const containerDiv = document.createElement('div');
        containerDiv.id = "4chan_grid_cont";
        containerDiv.className = "fcm_container";

        containerDiv.appendChild(button);
        const threadElement = document.querySelector(".thread");
        threadElement.parentElement.insertBefore(containerDiv, threadElement);
    }

    findMediaLinks(button);
}

function findMediaLinks(button = null) {
    const mediaLinks = [];
    const files = document.querySelectorAll('div.file');

    files.forEach((fileDiv, index) => {
        const fileText = fileDiv.querySelector('.fileText');
        const fileThumb = fileDiv.querySelector('.fileThumb');
        const fileThumbImage = fileThumb.querySelector("img");
        let link = null;
        if (fileText) { link = fileText.querySelector('a'); }

        if (link && link.href) {
            const url = link.href.startsWith('//') ? 'https:' + link.href : link.href;

            const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url);
            const isVideo = /\.(mp4|webm|mkv|avi|mov)(\?|$)/i.test(url);

            if (isImage || isVideo) {
                const postId = url.split('/').pop().split('?')[0];
                let originalName = link.title.trim() || link.textContent.trim() || postId;

                // if 4chan-X is used fix the name fetching
                const fnfull = link.querySelector('.fnfull');
                if (fnfull) { originalName = fnfull.textContent.trim(); }

                // get file info text
                const fileInfo = fileDiv.querySelector(".file-info");
                let width = null;
                let height = null;
                if (fileInfo) {
                    const fileInfoClone = fileInfo.cloneNode(true);
                    fileInfoClone.querySelectorAll("a").forEach(a => a.remove());
                    const info = fileInfoClone.textContent.trim();
                    const size = info.split(", ")[1].replace(")", "");
                    const width_and_height = size.split("x");
                    width = width_and_height[0];
                    height = width_and_height[1];
                }

                const newElement = {
                    url: url,
                    originalName: originalName,
                    postId: postId,
                    index: index + 1,
                    isVideo: isVideo,
                    thumbnail: (fileThumbImage.src),
                    width: width,
                    height: height
                };
                mediaLinks.push(newElement);
            }
        }
    });

    if (button) {
        button.title = `Masonry Grid (${mediaLinks.length})`;
    }

    return mediaLinks;
}

function findMediaLinksFromImgAndVideoElements() {
    const mediaLinks = []
    const imgElements = document.querySelectorAll('img[src*="jpg"], img[src*="jpeg"], img[src*="png"], img[src*="gif"], img[src*="webp"], img[src*="bmp"]');
    const videoElements = document.querySelectorAll('video[src*="mp4"], video[src*="webm"], video[src*="mkv"], video[src*="avi"], video[src*="mov"]');
    const mediaElements = [...imgElements, ...videoElements];
    mediaElements.forEach((img_or_vid, index) => {
        const url = img_or_vid.src;
        const filename = url.split('/').pop().split('?')[0];
        const isVideo = /\.(mp4|webm|mkv|avi|mov)(\?|$)/i.test(url);

        mediaLinks.push({
            url: url,
            originalName: filename,
            postId: filename,
            index: index + 1,
            isVideo: isVideo
        });
    });
    return mediaLinks;
}

function updateMasonryGrid() {
    const gridContainer = document.getElementById('fcm_masonry');
    if (gridContainer) {
        gridContainer.style.columnCount = gridRows;
    }
}

function createTopBar() {
    const topbar = document.createElement("div");
    topbar.id = "fcm_topbar";

    const sliderContainer = document.createElement('div');
    sliderContainer.className = "fcm_slider_container";

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = "setting_slider_cols";
    slider.min = GRID_ROWS_MIN;
    slider.max = GRID_ROWS_MAX;
    slider.step = "1";
    slider.value = gridRows;

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = gridRows;
    valueDisplay.className = "fcm_value_display";

    slider.addEventListener('input', (e) => {
        gridRows = parseInt(e.target.value);
        valueDisplay.textContent = gridRows;
        updateMasonryGrid();
    });

    function slider_left() { slider.value = Math.max(Number(slider.value) - Number(slider.step), slider.min); }
    function slider_right() { slider.value = Math.min(Number(slider.value) + Number(slider.step), slider.max); }

    slider.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft': slider_left(); break;
            case 'ArrowRight': slider_right(); break;
        }
    });

    slider.focus();
    slider.select();

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    topbar.appendChild(sliderContainer);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = "fcm_close";
    closeButton.innerHTML = '✕';
    closeButton.addEventListener('click', closeGrid);

    topbar.appendChild(closeButton);
    return topbar;
}

function createMasonryGrid(mediaLinks) {
    const overlay = document.createElement('div');
    overlay.id = 'fcm_overlay';

    const topbar = createTopBar();

    let lastScroll = 0;
    overlay.addEventListener("scroll", () => {
        const currentScroll = overlay.scrollTop;

        if (currentScroll > lastScroll) { topbar.style.transform = "translateY(-100%)"; }
        else { topbar.style.transform = "translateY(0)"; }

        lastScroll = currentScroll;
    });

    overlay.appendChild(topbar);

    const container = document.createElement('div');
    container.className = "fcm_grid_container";

    const handleParentClick = (event) => {
        event.preventDefault();
        if (event.target === event.currentTarget) {
            closeGrid();
        }
    };

    overlay.addEventListener('click', handleParentClick);
    container.addEventListener('click', handleParentClick);
    topbar.addEventListener('click', handleParentClick);

    // Grid container
    const gridContainer = document.createElement('div');
    gridContainer.id = 'fcm_masonry';
    gridContainer.style.columnCount = gridRows;

    // Create image elements
    mediaLinks.forEach((mediaData, index) => {
        const mediaWrapper = createOptimizedMediaElement(mediaData);
        gridContainer.appendChild(mediaWrapper);
    });

    container.appendChild(gridContainer);
    overlay.appendChild(container);

    return overlay;
}

function openGrid() {
    if (isGridOpen) return;

    const mediaLinks = findMediaLinks();
    if (mediaLinks.length === 0) {
        alert('No media found on this page!');
        return;
    }

    gridOverlay = createMasonryGrid(mediaLinks);
    document.body.appendChild(gridOverlay);
    isGridOpen = true;

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeGrid() {
    if (!isGridOpen || !gridOverlay) return;

    cleanupPreloading();

    document.body.removeChild(gridOverlay);
    gridOverlay = null;
    isGridOpen = false;
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleEscapeKey);
}


function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeGrid();
    }
}

async function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    setTimeout(async () => {
        try {
            initUI();

        } catch (error) {
            console.error('Error initializing userscript:', error);
        }
    }, 500);
}

init();
