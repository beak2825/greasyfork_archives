// ==UserScript==
// @name         YouTube Performance Mode(discontinued for the foreseeable future)
// @namespace    https://github.com/
// @version      5.2
// @license      MIT
// @description  Optimized performance enhancer for YouTube with smarter techniques
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555906/YouTube%20Performance%20Mode%28discontinued%20for%20the%20foreseeable%20future%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555906/YouTube%20Performance%20Mode%28discontinued%20for%20the%20foreseeable%20future%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    //////////////////////////////////////////////////////////////////////
    // CONFIG - Easy tweaking
    //////////////////////////////////////////////////////////////////////
    const CONFIG = {
        thumbnailQuality: 'mq',        // 'mq' = medium, 'sd' = standard, 'hq' = high
        maxChatMessages: 50,
        chatPruneInterval: 2000,
        enableComments: true,
        enableSidebar: true,
        mutationBatchLimit: 20,
        debounceDelay: 150
    };

    //////////////////////////////////////////////////////////////////////
    // UTILITIES
    //////////////////////////////////////////////////////////////////////
    const addCSS = (css) => {
        const style = document.createElement("style");
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        return style;
    };

    // Debounce helper for performance
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    //////////////////////////////////////////////////////////////////////
    // 1. SMART ANIMATION CONTROL
    //////////////////////////////////////////////////////////////////////
    // Only disable expensive animations, keep basic ones for UX
    addCSS(`
        /* Disable heavy layout-triggering animations */
        ytd-page-manager,
        ytd-watch-flexy,
        #secondary,
        ytd-guide-renderer {
            animation: none !important;
        }

        /* Reduce transition times instead of removing */
        * {
            transition-duration: 0.1s !important;
        }

        /* Keep basic hover feedback for better UX */
        ytd-thumbnail:hover {
            transition: opacity 0.1s !important;
        }
    `);

    //////////////////////////////////////////////////////////////////////
    // 2. THUMBNAIL OPTIMIZATION
    //////////////////////////////////////////////////////////////////////
    const getThumbnailURL = (originalURL, quality = CONFIG.thumbnailQuality) => {
        if (!originalURL) return originalURL;

        const qualityMap = {
            'mq': 'mqdefault',
            'sd': 'sddefault',
            'hq': 'hqdefault'
        };

        const targetQuality = qualityMap[quality] || 'mqdefault';

        return originalURL
            .replace(/\/(maxresdefault|hq720|hqdefault|sddefault|mqdefault)\.(jpg|webp)/gi,
                     `/${targetQuality}.jpg`)
            .replace(/=s\d+-/, '=s320-'); // Fix avatar sizes too
    };

    const optimizeThumbnails = debounce(() => {
        document.querySelectorAll('img[src*="ytimg.com"], img[src*="ggpht.com"]').forEach(img => {
            const optimized = getThumbnailURL(img.src);
            if (optimized !== img.src) {
                img.src = optimized;
            }
            // Prevent lazy loading from reverting changes
            if (img.hasAttribute('src')) {
                img.removeAttribute('srcset');
            }
        });
    }, CONFIG.debounceDelay);

    //////////////////////////////////////////////////////////////////////
    // 3. DISABLE HOVER PREVIEWS
    //////////////////////////////////////////////////////////////////////
    addCSS(`
        /* Kill video hover previews completely */
        ytd-thumbnail-overlay-hover-text-renderer,
        ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"],
        #mouseover-overlay,
        #video-preview {
            display: none !important;
        }

        /* Prevent hover preview loading */
        ytd-thumbnail:hover ytd-moving-thumbnail-renderer {
            display: none !important;
        }
    `);

    //////////////////////////////////////////////////////////////////////
    // 4. COMMENT OPTIMIZATION
    //////////////////////////////////////////////////////////////////////
    if (CONFIG.enableComments) {
        addCSS(`
            /* Use CSS containment for better rendering */
            ytd-comment-thread-renderer,
            ytd-comment-renderer {
                contain: layout style paint !important;
            }

            /* Hide avatars to reduce image loading */
            ytd-comment-renderer #author-thumbnail img,
            ytd-comment-renderer tp-yt-paper-tooltip {
                display: none !important;
            }

            /* Simplify comment layout */
            ytd-comment-renderer #body {
                contain: layout !important;
            }
        `);
    } else {
        addCSS(`
            ytd-comments,
            #comments {
                display: none !important;
            }
        `);
    }

    //////////////////////////////////////////////////////////////////////
    // 5. LIVE CHAT OPTIMIZATION
    //////////////////////////////////////////////////////////////////////
    addCSS(`
        yt-live-chat-renderer {
            contain: strict !important;
        }

        /* Remove avatars and badges in chat */
        yt-live-chat-author-photo,
        yt-live-chat-author-badge-renderer {
            display: none !important;
        }

        /* Simplify chat messages */
        yt-live-chat-text-message-renderer {
            contain: layout style !important;
        }
    `);

    // Prune old chat messages to prevent memory bloat
    const pruneChat = () => {
        const chatContainer = document.querySelector('yt-live-chat-item-list-renderer #items');
        if (!chatContainer) return;

        const messages = chatContainer.children;
        const excess = messages.length - CONFIG.maxChatMessages;

        if (excess > 0) {
            for (let i = 0; i < excess; i++) {
                chatContainer.removeChild(messages[0]);
            }
        }
    };

    setInterval(pruneChat, CONFIG.chatPruneInterval);

    //////////////////////////////////////////////////////////////////////
    // 6. SIDEBAR OPTIMIZATION
    //////////////////////////////////////////////////////////////////////
    if (CONFIG.enableSidebar) {
        addCSS(`
            /* Containment for sidebar items */
            ytd-compact-video-renderer,
            ytd-compact-playlist-renderer {
                contain: layout style paint !important;
            }

            /* Remove hover overlays */
            ytd-compact-video-renderer #mouseover-overlay,
            ytd-compact-video-renderer #hover-overlays {
                display: none !important;
            }

            /* Simplify sidebar layout */
            #secondary {
                contain: layout style !important;
            }
        `);
    } else {
        addCSS(`
            #secondary,
            #related {
                display: none !important;
            }
        `);
    }

    //////////////////////////////////////////////////////////////////////
    // 7. SMART MUTATION OBSERVER
    //////////////////////////////////////////////////////////////////////
    let observerActive = true;

    const smartObserver = new MutationObserver((mutations) => {
        if (!observerActive) return;

        // Throttle if too many mutations
        if (mutations.length > CONFIG.mutationBatchLimit) {
            observerActive = false;
            setTimeout(() => {
                optimizeThumbnails();
                observerActive = true;
            }, 500);
            return;
        }

        optimizeThumbnails();
    });

    // Start observing when DOM is ready
    if (document.documentElement) {
        smartObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    //////////////////////////////////////////////////////////////////////
    // 8. DISABLE EXPENSIVE TELEMETRY
    //////////////////////////////////////////////////////////////////////
    const neuterProperty = (obj, prop) => {
        try {
            Object.defineProperty(obj, prop, {
                value: () => {},
                writable: false,
                configurable: false
            });
        } catch (e) {
            // Already defined, skip
        }
    };

    // Block heavy logging/tracking
    ['ytLoggingLatencyTick_', 'ytcsi.tick', 'yt.timing.tick'].forEach(prop => {
        neuterProperty(window, prop);
    });

    //////////////////////////////////////////////////////////////////////
    // 9. OPTIMIZE POLYMER/WEB COMPONENTS
    //////////////////////////////////////////////////////////////////////
    addCSS(`
        /* Force hardware acceleration on key elements */
        ytd-watch-flexy,
        #player-container,
        ytd-page-manager {
            transform: translateZ(0) !important;
            will-change: auto !important;
        }

        /* Reduce repaints on scroll */
        ytd-app {
            contain: layout style !important;
        }
    `);

    //////////////////////////////////////////////////////////////////////
    // 10. INITIAL OPTIMIZATION RUN
    //////////////////////////////////////////////////////////////////////
    // Run immediately and after page loads
    optimizeThumbnails();

    window.addEventListener('load', () => {
        optimizeThumbnails();
        pruneChat();
    });

    // Re-optimize on navigation (YouTube SPA)
    document.addEventListener('yt-navigate-finish', optimizeThumbnails);

    //////////////////////////////////////////////////////////////////////
    // DEBUG INFO (remove for production)
    //////////////////////////////////////////////////////////////////////
    console.log('YouTube Performance Mode v5.0 loaded', CONFIG);

})();