// ==UserScript==
// @name         Reddit + RedGifs Instant Preloader
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  True instant Reddit media preloading + lagless RedGifs looping
// @author       You
// @match        https://www.redgifs.com/*
// @match        https://redgifs.com/*
// @match        https://thumbs2.redgifs.com/*
// @match        https://thumbs3.redgifs.com/*
// @match        https://thumbs4.redgifs.com/*
// @match        https://api.redgifs.com/*
// @match        https://cdn.redgifs.com/*
// @match        https://embed.redgifs.com/*
// @match        https://i.redgifs.com/*
// @match        https://v3.redgifs.com/*
// @match        https://v2.redgifs.com/*
// @match        https://static.redgifs.com/*
// @match        https://media.redgifs.com/*
// @match        https://files.redgifs.com/*
// @match        https://*.redgifs.com/*
// @match        *://reddit.com/*/redgifs.com/*
// @match        *://*.reddit.com/*/redgifs.com/*
// @match        *://old.reddit.com/*/redgifs.com/*
// @match        *://new.reddit.com/*/redgifs.com/*
// @match        *://np.reddit.com/*/redgifs.com/*
// @match        *://m.reddit.com/*/redgifs.com/*
// @match        *://amp.reddit.com/*/redgifs.com/*
// @match        https://www.reddit.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547904/Reddit%20%2B%20RedGifs%20Instant%20Preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547904/Reddit%20%2B%20RedGifs%20Instant%20Preloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isReddit = /reddit\.com/.test(location.hostname);
    let isRedgifs = /redgifs\.com/.test(location.hostname);
    let hasRedgifsContent = document.querySelector('iframe[src*="redgifs.com"]') ||
                           document.querySelector('video[src*="redgifs.com"]') ||
                           document.body.innerHTML.includes('redgifs.com');

    // ============ REDDIT INSTANT PRELOADER ============

    if (isReddit) {
        let preloadedUrls = new Set();
        let lastScrollY = 0;
        let isPreloading = false;

        // True media preloading - create hidden elements
        function preloadMedia(url, type) {
            if (preloadedUrls.has(url)) return;
            preloadedUrls.add(url);

            if (type === 'image') {
                const img = new Image();
                img.src = url;
                img.style.display = 'none';
                img.style.position = 'absolute';
                img.style.top = '-9999px';
                document.body.appendChild(img);
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.src = url;
                video.preload = 'auto';
                video.muted = true;
                video.style.display = 'none';
                video.style.position = 'absolute';
                video.style.top = '-9999px';
                document.body.appendChild(video);
            }
        }

        // Extract Reddit post data from page
        function extractRedditPosts() {
            const posts = [];

            // New Reddit - look for JSON in script tags
            document.querySelectorAll('script').forEach(script => {
                const text = script.textContent;
                if (text.includes('"posts"') && text.includes('"url"')) {
                    try {
                        // Extract post objects from Reddit's client-side data
                        const matches = text.match(/"url":"([^"]+)"/g);
                        if (matches) {
                            matches.forEach(match => {
                                const url = match.replace('"url":"', '').replace('"', '');
                                if (url.startsWith('http')) {
                                    posts.push({ url: decodeURIComponent(url) });
                                }
                            });
                        }
                    } catch (e) {}
                }
            });

            // Old Reddit + fallback - parse visible links
            document.querySelectorAll('a[href*="i.redd.it"], a[href*="v.redd.it"], a[href*="redgifs.com"], a[href*="gfycat.com"], a[href*="imgur.com"]').forEach(link => {
                posts.push({ url: link.href });
            });

            // Look for data-* attributes that contain URLs
            document.querySelectorAll('[data-url], [data-permalink]').forEach(elem => {
                const url = elem.getAttribute('data-url') || elem.getAttribute('data-permalink');
                if (url && url.startsWith('http')) {
                    posts.push({ url });
                }
            });

            return posts;
        }

        // Preload upcoming media based on scroll position
        function preloadUpcoming() {
            if (isPreloading) return;
            isPreloading = true;

            try {
                const posts = extractRedditPosts();
                let preloadCount = 0;
                const maxPreload = 20;

                posts.forEach(post => {
                    if (preloadCount >= maxPreload) return;

                    const url = post.url;
                    if (!url) return;

                    // Images
                    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('i.redd.it')) {
                        preloadMedia(url, 'image');
                        preloadCount++;
                    }
                    // Videos
                    else if (url.match(/\.(mp4|webm|mov)$/i) || url.includes('v.redd.it')) {
                        preloadMedia(url, 'video');
                        preloadCount++;
                    }
                    // RedGifs
                    else if (url.includes('redgifs.com')) {
                        const gifId = url.match(/redgifs\.com\/\w+\/([a-zA-Z0-9]+)/);
                        if (gifId) {
                            preloadMedia(`https://thumbs2.redgifs.com/${gifId[1]}.mp4`, 'video');
                            preloadCount++;
                        }
                    }
                });

                if (preloadCount > 0) {
                    console.log(`Preloaded ${preloadCount} Reddit media items`);
                }
            } catch (e) {
                console.warn('Reddit preload error:', e);
            }

            setTimeout(() => { isPreloading = false; }, 1000);
        }

        // Scroll-based preloading
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY + 500) { // Scrolled down significantly
                    lastScrollY = currentScrollY;
                    preloadUpcoming();
                }
            }, 200);
        });

        // Initial preload
        setTimeout(preloadUpcoming, 1000);

        // Preload on navigation
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(preloadUpcoming, 500);
            }
        }, 1000);
    }

    // ============ REDGIFS LAGLESS LOOPER ============

    if (isRedgifs || (isReddit && hasRedgifsContent)) {
        function setupLaglessLoop(video) {
            if (video.hasAttribute('data-lagless')) return;

            // Skip if this is not a RedGifs video
            const src = video.src || video.currentSrc || '';
            const isRedgifsVideo = src.includes('redgifs.com') ||
                                 video.closest('iframe[src*="redgifs.com"]') ||
                                 video.closest('[data-domain*="redgifs"]');

            if (!isRedgifsVideo && isReddit) return;

            video.loop = false;
            video.preload = 'auto';
            let isLooping = false;

            // Seamless loop using requestAnimationFrame
            const checkForLoop = () => {
                if (video.paused || !video.duration) return;

                const timeLeft = video.duration - video.currentTime;

                // Restart before it ends to avoid gap
                if (timeLeft < 0.02 && !isLooping) {
                    isLooping = true;
                    requestAnimationFrame(() => {
                        video.currentTime = 0;
                        isLooping = false;
                    });
                }

                // Continue monitoring while playing
                if (!video.paused) {
                    requestAnimationFrame(checkForLoop);
                }
            };

            // Start monitoring when video plays
            video.addEventListener('playing', checkForLoop);

            // Backup end handler
            video.addEventListener('ended', () => {
                video.currentTime = 0;
                video.play().catch(() => {});
            });

            // Performance optimizations
            video.style.transform = 'translateZ(0)';
            video.style.willChange = 'transform';
            video.style.imageRendering = 'optimizeSpeed';

            video.setAttribute('data-lagless', 'true');
        }

        function optimizeRedgifsVideos() {
            // Check all videos, including those in iframes
            document.querySelectorAll('video').forEach(setupLaglessLoop);

            // Check iframes for RedGifs content
            document.querySelectorAll('iframe[src*="redgifs.com"]').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        iframeDoc.querySelectorAll('video').forEach(setupLaglessLoop);
                    }
                } catch (e) {
                    // Cross-origin iframe, can't access content
                }
            });
        }

        // Monitor for new videos more frequently on Reddit
        const observer = new MutationObserver(() => {
            setTimeout(optimizeRedgifsVideos, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial optimization
        setTimeout(optimizeRedgifsVideos, 500);

        // Re-check periodically for dynamically loaded content
        setInterval(() => {
            hasRedgifsContent = document.querySelector('iframe[src*="redgifs.com"]') ||
                               document.querySelector('video[src*="redgifs.com"]') ||
                               document.body.innerHTML.includes('redgifs.com');
            optimizeRedgifsVideos();
        }, 2000);

        // Clean interface (only on actual RedGifs site)
        if (isRedgifs) {
            function cleanRedgifsUI() {
                const hideSelectors = [
                    '.sidebar', '.related-content', '.comments-section',
                    '[class*="ad"]', '[class*="loading"]', '.popup', '.overlay'
                ];

                hideSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.display = 'none';
                    });
                });
            }

            setInterval(cleanRedgifsUI, 2000);

            // Add dark theme CSS
            const style = document.createElement('style');
            style.textContent = `
                body {
                    background: #1a1a1a !important;
                    color: white !important;
                }
                video {
                    border-radius: 8px !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
                }
                .sidebar, .related-content, .comments-section,
                [class*="ad"], [class*="loading"] {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    console.log(`${isReddit ? 'Reddit' : ''}${isReddit && isRedgifs ? ' + ' : ''}${isRedgifs ? 'RedGifs' : ''} optimizer loaded`);
})();