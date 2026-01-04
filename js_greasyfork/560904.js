// ==UserScript==
// @name         Twitter/X Layout Modifier
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.4.5
// @description  Remove right sidebar, expand middle column, and inject custom vertical image stack with sizing fixes
// @author       maye9999
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560904/TwitterX%20Layout%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/560904/TwitterX%20Layout%20Modifier.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 1. CSS for Structural Layout Changes (Sidebar & Column Width)
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --ag-max-height: 85vh;       /* [EDIT HERE] Global Max Height for media */
            --ag-layout-width: 100%;     /* [EDIT HERE] Global Column Width (set to 100% for full monitor width) */
            --ag-media-max-width: 100%;  /* [EDIT HERE] Max width for single images (e.g. 1200px) */
        }
        
        /* Remove the right sidebar */
        [data-testid="sidebarColumn"] {
            display: none !important;
        }

        /* Expand the middle column (primaryColumn) */
        [data-testid="primaryColumn"] {
            max-width: var(--ag-layout-width) !important;
            width: var(--ag-layout-width) !important;
            flex-basis: auto !important;
        }

        /* Ensure parent containers allow expansion */
        div:has(> [data-testid="primaryColumn"]) {
             max-width: var(--ag-layout-width) !important;
             width: var(--ag-layout-width) !important;
        }
        
        .r-1ye8kvj {
            max-width: var(--ag-layout-width) !important;
        }
        
        /* Custom class for our injected container */
        .ag-custom-media-stack {
            display: flex;
            flex-direction: row;   /* Allow horizontal flow */
            flex-wrap: wrap;       /* Allow wrapping */
            width: 100%;
            margin-top: 10px;
            gap: 12px;             /* Space between images (both horizontal and vertical) */
            align-items: flex-start;
        }
        
        /* Image styling */
        .ag-custom-media-stack img {
            width: auto;
            max-width: var(--ag-media-max-width);       
            max-height: var(--ag-max-height);
            height: auto;
            border-radius: 12px;
            display: block;
            border: 1px solid rgba(255,255,255,0.1);
            cursor: pointer;
            object-fit: contain;
            flex: 0 1 auto;        /* Allow image to be its natural size, but shrink if needed */
        }
        
        /* Lightbox-like effect on click (optional simple zoom) */
        .ag-custom-media-stack img:active {
            transform: scale(1.02);
            transition: transform 0.1s;
        }
        
        /* STRICT Video Scaling Rules */
        .ag-custom-media-stack video {
            object-fit: contain !important;
            background-color: black !important;
        }
        
        .ag-custom-media-stack div[style*="background-image"] {
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
    `;
    document.head.appendChild(style);



    // Helper: Hijack Video Pause
    function hijackVideo(videoEl, wrapper, getLastInteraction, getLastPlayTime) {
        if (videoEl.dataset.agHijacked) return;
        videoEl.dataset.agHijacked = 'true';

        console.log('[AntiGravity] Hijacking video element:', videoEl);

        // Save original pause functionality
        const originalPause = videoEl.pause.bind(videoEl);

        // Overwrite pause function
        videoEl.pause = function (arg) {
            const now = Date.now();
            const timeSinceInteraction = now - getLastInteraction();
            const timeSincePlay = now - getLastPlayTime();

            // 1. Is it a user pause? (Recent interaction < 500ms)
            if (timeSinceInteraction < 500) {
                return originalPause(arg);
            }

            // 2. Is it a "First Click" conflict? 
            if (timeSincePlay < 500) {
                console.log('[AntiGravity] Blocked auto-pause (First-Click Guard)');
                return;
            }

            // 3. Is it an auto-pause? Check visibility.
            const rect = wrapper.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );

            if (isVisible) {
                console.log('[AntiGravity] Blocked auto-pause via hijack');
                return;
            } else {
                return originalPause(arg);
            }
        };

        // Ensure styles
        videoEl.style.objectFit = 'contain';
        videoEl.style.backgroundColor = 'black';
    }


    // 2. JavaScript for Custom Layout Injection
    function processTweets() {
        // Find all tweets or photo-containing elements
        const photos = document.querySelectorAll('[data-testid="tweetPhoto"]');

        // Map to store unique root containers we've found in this pass
        // Map<Element, Array<{type: 'img'|'video', src?: string, node?: Element, aspectRatio?: number}>>
        const rootsToProcess = new Map();

        photos.forEach(photo => {
            if (photo.hasAttribute('data-ag-processed')) return;

            // Determine content type: Image or Video?
            // Videos are often nested inside tweetPhoto or siblings in the same grid.
            // Actually, for mixed grids, Twitter might use tweetPhoto for images and something else for video, 
            // OR reuse tweetPhoto but put a video player inside.
            // Based on profile.html, videoPlayer is inside placementTracking inside tweetPhoto (or similar structure).

            let itemData = null;
            const videoComponent = photo.querySelector('[data-testid="videoPlayer"]');

            if (videoComponent) {
                // It's a video!
                // We want to grab the whole player to preserve functionality.
                // We also need the aspect ratio to size it correctly.
                // Twitter usually puts a padding-bottom on a child div for aspect ratio.
                let ratio = 0.5625; // Default 16:9
                const spacer = videoComponent.querySelector('div[style*="padding-bottom"]');
                if (spacer) {
                    const pb = spacer.style.paddingBottom;
                    if (pb && pb.includes('%')) {
                        ratio = parseFloat(pb) / 100;
                    }
                }

                itemData = {
                    type: 'video',
                    node: videoComponent, // We will move this node
                    aspectRatio: ratio
                };
            } else {
                // It's an image
                const img = photo.querySelector('img');
                if (!img) return; // Skip if no image found

                let src = img.src;
                if (src.includes('&name=')) {
                    src = src.replace(/&name=[a-z0-9]+/, '&name=large');
                }
                itemData = {
                    type: 'img',
                    src: src
                };
            }

            // Find root container logic (same as before)
            const tweet = photo.closest('[data-testid="tweet"]');
            if (tweet) {
                const allImagesInTweet = Array.from(tweet.querySelectorAll('[data-testid="tweetPhoto"]'));
                if (allImagesInTweet.length > 0) {
                    let ancestor = allImagesInTweet[0];
                    if (allImagesInTweet.length > 1) {
                        const parents = new Set();
                        let p = ancestor;
                        while (p && p !== tweet) {
                            parents.add(p);
                            p = p.parentElement;
                        }
                        let p2 = allImagesInTweet[1].parentElement;
                        while (p2 && p2 !== tweet) {
                            if (parents.has(p2)) {
                                ancestor = p2;
                                break;
                            }
                            p2 = p2.parentElement;
                        }
                    }

                    let contentRoot = ancestor;
                    while (contentRoot.parentElement && contentRoot.parentElement !== tweet) {
                        if (contentRoot.parentElement.querySelector('[data-testid="tweetText"]')) {
                            break;
                        }
                        contentRoot = contentRoot.parentElement;
                    }

                    if (!rootsToProcess.has(contentRoot)) {
                        rootsToProcess.set(contentRoot, []);
                    }

                    const list = rootsToProcess.get(contentRoot);
                    // Avoid duplicates
                    if (itemData.type === 'img') {
                        if (!list.some(i => i.type === 'img' && i.src === itemData.src)) {
                            list.push(itemData);
                        }
                    } else {
                        // For video, check reference equality or something? 
                        // Just check if we already added this node
                        if (!list.some(i => i.type === 'video' && i.node === itemData.node)) {
                            list.push(itemData);
                        }
                    }

                    photo.setAttribute('data-ag-processed', 'true');
                }
            }
        });

        // Now process the roots
        rootsToProcess.forEach((items, root) => {
            if (root.getAttribute('data-ag-replaced')) return;

            // Hide Root
            root.style.display = "none";
            root.setAttribute('data-ag-replaced', 'true');

            // Inject Custom Stack
            const stack = document.createElement('div');
            stack.className = 'ag-custom-media-stack';

            items.forEach((item) => {
                if (item.type === 'img') {
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.onclick = (e) => {
                        e.stopPropagation();
                        window.open(item.src, '_blank');
                    };
                    stack.appendChild(img);
                } else if (item.type === 'video') {
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = `
                        flex: 0 1 auto;
                        width: 100%;
                        position: relative;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid rgba(255,255,255,0.1);
                     `;

                    // Calculate Max Width to respect 85vh constraint
                    // If Height = Width * Ratio, and Height_Max = 85vh
                    // Then Width_Max = 85vh / Ratio
                    if (item.aspectRatio > 0) {
                        // 85vh in pixels (approx) or use calc
                        // Using calc is safer: calc(85vh / ratio)
                        // But ratio is a number. Let's use JS to set a clean max-width percentage or pixel value if possible, 
                        // or just standard CSS max-height won't work on padding-hack boxes.

                        // We can set 'max-width' on the wrapper.
                        // 1 / ratio = inverse ratio (width/height)
                        // max-width = 85vh * (1/ratio)

                        const inverseRatio = 1 / item.aspectRatio;
                        wrapper.style.maxWidth = `calc(var(--ag-max-height) * ${inverseRatio})`;
                    }

                    // Move the node
                    wrapper.appendChild(item.node);

                    // Ensure the video player fills our wrapper and is visible
                    item.node.style.cssText = `
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                        width: 100% !important;
                        height: auto !important;
                        display: block !important;
                        max-width: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                     `;

                    // --- ROBUST ANTI-PAUSE (METHOD HIJACKING) ---

                    // TRACK INTERACTIONS
                    let lastUserInteraction = 0;
                    let lastPlayTime = 0;
                    const markInteraction = () => lastUserInteraction = Date.now();
                    const markPlay = () => lastPlayTime = Date.now();
                    const getLastInteraction = () => lastUserInteraction;
                    const getLastPlayTime = () => lastPlayTime;

                    item.node.addEventListener('mousedown', markInteraction, true);
                    item.node.addEventListener('keydown', markInteraction, true);
                    item.node.addEventListener('touchstart', markInteraction, true);
                    item.node.addEventListener('click', markInteraction, true);
                    item.node.addEventListener('play', markPlay, true);

                    // INITIAL CHECK
                    const existingVideo = item.node.querySelector('video');
                    if (existingVideo) {
                        hijackVideo(existingVideo, wrapper, getLastInteraction, getLastPlayTime);
                    }

                    // OBSERVER for Lazy Loaded Videos
                    const videoObserver = new MutationObserver((mutations) => {
                        mutations.forEach(m => {
                            m.addedNodes.forEach(node => {
                                if (node.nodeName === 'VIDEO') {
                                    hijackVideo(node, wrapper, getLastInteraction, getLastPlayTime);
                                } else if (node.querySelectorAll) {
                                    const v = node.querySelector('video');
                                    if (v) hijackVideo(v, wrapper, getLastInteraction, getLastPlayTime);
                                }
                            });
                        });
                    });
                    videoObserver.observe(item.node, { childList: true, subtree: true });

                    stack.appendChild(wrapper);
                }
            });

            root.insertAdjacentElement('afterend', stack);
        });
    }

    // 3. Observe the DOM for new tweets
    const observer = new MutationObserver((mutations) => {
        processTweets();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    setTimeout(processTweets, 500);
    setInterval(processTweets, 2000);

})();
