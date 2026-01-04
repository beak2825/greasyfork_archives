// ==UserScript==
// @name        Extremely Strong Efficiency Booster From 30 To 120 FPS
// @namespace   http://tampermonkey.net/
// @version     2.0
// @description Optimizes website performance by deferring scripts, lazy-loading media, prefetching links, and more.
// @author      Gugu8
// @match       *://*/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549499/Extremely%20Strong%20Efficiency%20Booster%20From%2030%20To%20120%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/549499/Extremely%20Strong%20Efficiency%20Booster%20From%2030%20To%20120%20FPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        enablePerformanceMonitoring: true,
        enableMediaOptimization: true,
        enableScriptOptimization: true,
        enableNetworkOptimization: true,
        enableDOMOptimization: true,
        enableResourceBlocking: true,
        enableCaching: true,
        monitoring: {
            reportInterval: 5000 // in milliseconds
        },
        media: {
            lazyLoadThreshold: 200, // pixels
            optimizeImages: true,
            optimizeVideos: true,
            defaultImage: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 1\'%3E%3C/svg%3E'
        },
        prefetch: {
            enableDNSPrefetch: true,
            enablePreconnect: true,
            enableLinkPrefetch: true,
            prefetchDelay: 500, // milliseconds
            maxPrefetchLinks: 3 // max links to prefetch on hover
        },
        dom: {
            cleanupInterval: 60000 // milliseconds
        }
    };

    // --- Utility Functions ---
    const Utils = {
        debounce: (func, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },
        throttle: (func, delay) => {
            let inThrottle = false;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    // FIX: Changed concise arrow function to a block body
                    setTimeout(() => {
                        inThrottle = false;
                    }, delay);
                }
            };
        },
        scheduleIdleTask: (callback, timeout = 500) => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(callback, {
                    timeout
                });
            } else {
                setTimeout(callback, timeout);
            }
        },
        formatBytes: (bytes, decimals = 2) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    };

    // --- Cache Manager ---
    class CacheManager {
        constructor() {
            this.cacheName = 'website-optimizer-cache-v1';
            this.init();
        }

        async init() {
            if ('caches' in window) {
                this.cache = await caches.open(this.cacheName);
                console.log('[Optimizer] 📦 Cache Manager initialized.');
            } else {
                console.warn('[Optimizer] ❌ Caching not supported by this browser.');
            }
        }

        async fetch(request) {
            if (!this.cache) return fetch(request);
            const cachedResponse = await this.cache.match(request);
            if (cachedResponse) {
                const headers = cachedResponse.headers;
                const cacheControl = headers.get('Cache-Control');
                if (cacheControl && cacheControl.includes('no-cache')) {
                    this.updateCache(request);
                    return cachedResponse;
                }
                return cachedResponse;
            }
            this.updateCache(request);
            return fetch(request);
        }

        async updateCache(request) {
            try {
                const response = await fetch(request);
                if (response.status === 200) {
                    this.cache.put(request, response.clone());
                    console.log(`[Optimizer] 🔄 Updated cache for: ${request.url}`);
                }
                return response;
            } catch (error) {
                console.error('[Optimizer] ❌ Failed to update cache:', error);
            }
        }
    }

    // --- Resource Blocker ---
    class ResourceBlocker {
        constructor() {
            this.blockedUrls = new Set();
            this.init();
        }

        init() {
            const blockedPatterns = [
                /google-analytics\.com/i,
                /googletagmanager\.com/i,
                /doubleclick\.net/i,
                /adservice\.google\.com/i,
                /facebook\.com\/tr\//i,
                /pixel\.facebook\.com/i,
                /criteo\.com/i
            ];
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'SCRIPT' && node.src) {
                            if (blockedPatterns.some(pattern => pattern.test(node.src))) {
                                node.remove();
                                this.blockedUrls.add(node.src);
                                console.log(`[Optimizer] 🚫 Blocked script: ${node.src}`);
                                if (optimizer?.components?.performanceMonitor) {
                                    optimizer.components.performanceMonitor.incrementCounter('resourcesBlocked');
                                }
                            }
                        }
                    });
                });
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // --- Advanced DOM Optimizer ---
    class AdvancedDOMOptimizer {
        constructor() {
            this.init();
        }

        init() {
            Utils.scheduleIdleTask(() => {
                this.performInitialCleanup();
            });
            setInterval(() => {
                this.performPeriodicCleanup();
            }, CONFIG.dom.cleanupInterval);
        }

        performInitialCleanup() {
            this.removeEmptyTags();
            this.mergeTextNodes();
            console.log('[Optimizer] 🧹 Initial DOM cleanup complete.');
        }

        performPeriodicCleanup() {
            this.removeHiddenElements();
            this.pruneUnusedAttributes();
            console.log('[Optimizer] 🧹 Periodic DOM cleanup complete.');
        }

        removeEmptyTags() {
            const emptyTags = document.querySelectorAll('p:empty, div:empty, span:empty');
            emptyTags.forEach(tag => {
                if (tag.textContent.trim() === '' && tag.children.length === 0) {
                    tag.remove();
                }
            });
        }

        removeHiddenElements() {
            const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
            hiddenElements.forEach(element => {
                if (element.offsetWidth === 0 && element.offsetHeight === 0) {
                    element.remove();
                }
            });
        }

        mergeTextNodes() {
            const elements = document.querySelectorAll('body *:not(script):not(style)');
            elements.forEach(element => {
                const childNodes = Array.from(element.childNodes);
                let textContent = '';
                const nodesToRemove = [];
                for (let i = 0; i < childNodes.length; i++) {
                    const node = childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent += node.textContent;
                        nodesToRemove.push(node);
                    } else {
                        if (textContent.trim() !== '') {
                            const newTextNode = document.createTextNode(textContent);
                            element.insertBefore(newTextNode, node);
                            textContent = '';
                        }
                        nodesToRemove.forEach(n => n.remove());
                        nodesToRemove.length = 0;
                    }
                }
                if (textContent.trim() !== '') {
                    const newTextNode = document.createTextNode(textContent);
                    element.appendChild(newTextNode);
                    nodesToRemove.forEach(n => n.remove());
                }
            });
        }

        pruneUnusedAttributes() {
            const elements = document.querySelectorAll('*');
            const unusedAttributes = ['data-id', 'data-name', 'data-tracking-id'];
            elements.forEach(element => {
                unusedAttributes.forEach(attr => {
                    if (element.hasAttribute(attr)) {
                        if (!element.getAttribute(attr)) {
                            element.removeAttribute(attr);
                        }
                    }
                });
            });
        }
    }

    // --- Advanced Media Optimizer ---
    class AdvancedMediaOptimizer {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            if (CONFIG.media.optimizeImages || CONFIG.media.optimizeVideos) {
                this.setupIntersectionObserver();
            }
            this.scanForMedia();
        }

        setupIntersectionObserver() {
            const options = {
                rootMargin: `0px 0px ${CONFIG.media.lazyLoadThreshold}px 0px`,
                threshold: 0.01
            };
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        this.loadMedia(target);
                        observer.unobserve(target);
                    }
                });
            }, options);
        }

        scanForMedia() {
            if (CONFIG.media.optimizeImages) {
                const images = document.querySelectorAll('img[data-src]');
                images.forEach(img => {
                    this.observer.observe(img);
                });
            }
            if (CONFIG.media.optimizeVideos) {
                const videos = document.querySelectorAll('video[data-src]');
                videos.forEach(video => {
                    this.observer.observe(video);
                });
            }
            this.replaceGIFsWithVideos();
        }

        loadMedia(mediaElement) {
            const src = mediaElement.getAttribute('data-src');
            const srcset = mediaElement.getAttribute('data-srcset');
            if (src) {
                mediaElement.src = src;
                mediaElement.removeAttribute('data-src');
            }
            if (srcset) {
                mediaElement.srcset = srcset;
                mediaElement.removeAttribute('data-srcset');
            }
            if (mediaElement.tagName === 'IMG' && CONFIG.media.optimizeImages) {
                this.optimizeImage(mediaElement);
            }
            if (mediaElement.tagName === 'VIDEO' && CONFIG.media.optimizeVideos) {
                mediaElement.load();
                mediaElement.play();
            }
            console.log(`[Optimizer] 🖼️ Lazy-loaded media: ${src}`);
        }

        optimizeImage(img) {
            if (img.src.endsWith('.webp')) return;
            const newSrc = img.src.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
            if (newSrc !== img.src) {
                img.src = newSrc;
                console.log(`[Optimizer] ✨ Optimized image to WebP: ${newSrc}`);
                if (optimizer?.components?.performanceMonitor) {
                    optimizer.components.performanceMonitor.incrementCounter('imagesOptimized');
                }
            }
        }

        replaceGIFsWithVideos() {
            const gifs = document.querySelectorAll('img[src$=".gif"]');
            gifs.forEach(gif => {
                const video = document.createElement('video');
                video.src = gif.src.replace('.gif', '.mp4');
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.className = gif.className;
                video.style.cssText = gif.style.cssText;
                gif.parentNode.replaceChild(video, gif);
                console.log(`[Optimizer] 🔄 Replaced GIF with video: ${video.src}`);
            });
        }

        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    // --- Performance Monitor ---
    class PerformanceMonitor {
        constructor() {
            this.metrics = {
                pageLoadTime: null,
                domContentLoaded: null,
                memoryUsage: null,
                resourcesBlocked: 0,
                imagesOptimized: 0
            };
            this.init();
        }

        init() {
            if ('performance' in window) {
                window.addEventListener('load', () => this.recordMetrics());
                this.startMemoryMonitoring();
                this.startReporting();
            }
        }

        recordMetrics() {
            const timing = performance.timing;
            this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        }

        startMemoryMonitoring() {
            if ('memory' in performance) {
                setInterval(() => {
                    this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                }, CONFIG.monitoring.reportInterval);
            }
        }

        startReporting() {
            setInterval(() => {
                this.generateReport();
            }, CONFIG.monitoring.reportInterval);
        }

        generateReport() {
            const report = {
                'Page Load Time': this.metrics.pageLoadTime ? `${this.metrics.pageLoadTime.toFixed(2)}ms` : 'N/A',
                'DOM Content Loaded': this.metrics.domContentLoaded ? `${this.metrics.domContentLoaded.toFixed(2)}ms` : 'N/A',
                'Memory Usage': this.metrics.memoryUsage ? Utils.formatBytes(this.metrics.memoryUsage) : 'N/A',
                'Resources Blocked': this.metrics.resourcesBlocked,
                'Images Optimized': this.metrics.imagesOptimized
            };
            console.group('[Optimizer] 📊 Performance Report');
            Object.entries(report).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
            console.groupEnd();
        }

        incrementCounter(metric) {
            if (this.metrics.hasOwnProperty(metric)) {
                this.metrics[metric]++;
            }
        }
    }

    // --- Network Optimizer ---
    class NetworkOptimizer {
        constructor() {
            this.prefetchedUrls = new Set();
            this.init();
        }

        init() {
            if (CONFIG.prefetch.enableDNSPrefetch) {
                this.addDNSPrefetch();
            }
            if (CONFIG.prefetch.enablePreconnect) {
                this.addPreconnect();
            }
            if (CONFIG.prefetch.enableLinkPrefetch) {
                setTimeout(() => {
                    this.initLinkPrefetching();
                }, CONFIG.prefetch.prefetchDelay);
            }
        }

        addDNSPrefetch() {
            const domains = this.extractDomains();
            domains.forEach(domain => {
                if (!document.querySelector(`link[rel="dns-prefetch"][href*="${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = `//${domain}`;
                    document.head.appendChild(link);
                }
            });
        }

        addPreconnect() {
            const criticalDomains = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];
            criticalDomains.forEach(domain => {
                if (!document.querySelector(`link[rel="preconnect"][href*="${domain}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = `https://${domain}`;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            });
        }

        extractDomains() {
            const domains = new Set();
            const links = document.querySelectorAll('a[href], img[src], script[src], link[href]');
            links.forEach(element => {
                const url = element.href || element.src;
                if (url) {
                    try {
                        const domain = new URL(url).hostname;
                        if (domain !== window.location.hostname) {
                            domains.add(domain);
                        }
                    } catch (e) {}
                }
            });
            return Array.from(domains);
        }

        initLinkPrefetching() {
            const links = document.querySelectorAll('a[href]');
            const internalLinks = Array.from(links).filter(link => {
                try {
                    const url = new URL(link.href);
                    return url.hostname === window.location.hostname;
                } catch (e) {
                    return false;
                }
            }).slice(0, CONFIG.prefetch.maxPrefetchLinks);

            internalLinks.forEach(link => {
                let timeoutId;
                link.addEventListener('mouseenter', () => {
                    timeoutId = setTimeout(() => {
                        this.prefetchUrl(link.href);
                    }, 100);
                });
                link.addEventListener('mouseleave', () => {
                    clearTimeout(timeoutId);
                });
            });
        }

        prefetchUrl(url) {
            if (this.prefetchedUrls.has(url)) return;
            this.prefetchedUrls.add(url);
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
            console.log(`[Optimizer] 🔗 Prefetched: ${url}`);
        }
    }

    // --- Script Optimizer ---
    class ScriptOptimizer {
        constructor() {
            this.deferredScripts = [];
            this.init();
        }

        init() {
            this.optimizeScriptLoading();
            this.deferNonCriticalScripts();
        }

        optimizeScriptLoading() {
            const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
            scripts.forEach(script => {
                if (!this.isCriticalScript(script.src)) {
                    script.defer = true;
                    console.log(`[Optimizer] ⚡ Deferred script: ${script.src}`);
                }
            });
        }

        isCriticalScript(src) {
            const criticalPatterns = [
                /jquery/i,
                /bootstrap/i,
                /react/i,
                /vue/i,
                /angular/i
            ];
            return criticalPatterns.some(pattern => pattern.test(src));
        }

        deferNonCriticalScripts() {
            const inlineScripts = document.querySelectorAll('script:not([src])');
            inlineScripts.forEach(script => {
                if (!this.isCriticalInlineScript(script.textContent)) {
                    const scriptContent = script.textContent;
                    script.remove();
                    window.addEventListener('load', () => {
                        Utils.scheduleIdleTask(() => {
                            const newScript = document.createElement('script');
                            newScript.textContent = scriptContent;
                            document.body.appendChild(newScript);
                        });
                    });
                }
            });
        }

        isCriticalInlineScript(content) {
            const criticalPatterns = [
                /document\.write/i,
                /window\.location/i,
                /gtag|ga\(/i
            ];
            return criticalPatterns.some(pattern => pattern.test(content));
        }
    }

    // --- CSS Optimizer ---
    class CSSOptimizer {
        constructor() {
            this.init();
        }

        init() {
            Utils.scheduleIdleTask(() => {
                this.optimizeCSS();
                this.removeUnusedCSS();
            }, 2000);
        }

        optimizeCSS() {
            const styleSheets = document.querySelectorAll('style');
            styleSheets.forEach(style => {
                if (style.textContent) {
                    const optimized = this.minifyCSS(style.textContent);
                    if (optimized.length < style.textContent.length) {
                        style.textContent = optimized;
                        console.log(`[Optimizer] 🎨 Optimized CSS: ${((style.textContent.length - optimized.length) / style.textContent.length * 100).toFixed(1)}% reduction`);
                    }
                }
            });
        }

        minifyCSS(css) {
            return css
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/;\s*}/g, '}')
                .replace(/\s*{\s*/g, '{')
                .replace(/}\s*/g, '}')
                .replace(/:\s*/g, ':')
                .replace(/;\s*/g, ';')
                .trim();
        }

        removeUnusedCSS() {
            const allElements = document.querySelectorAll('*');
            const usedClasses = new Set();
            const usedIds = new Set();
            allElements.forEach(element => {
                if (element.className) {
                    element.className.split(' ').forEach(cls => {
                        if (cls.trim()) usedClasses.add(cls.trim());
                    });
                }
                if (element.id) {
                    usedIds.add(element.id);
                }
            });
            console.log(`[Optimizer] 📊 CSS Analysis: ${usedClasses.size} classes, ${usedIds.size} IDs in use`);
        }
    }

    // --- Main Optimizer Class ---
    class WebsiteOptimizer {
        constructor() {
            this.components = {};
            this.startTime = performance.now();
            this.init();
        }

        async init() {
            console.log('[Optimizer] 🚀 Initializing Website Performance Optimizer v2.0');
            if (CONFIG.enableCaching) {
                this.components.cacheManager = new CacheManager();
            }
            if (CONFIG.enablePerformanceMonitoring) {
                this.components.performanceMonitor = new PerformanceMonitor();
            }
            if (CONFIG.enableResourceBlocking) {
                this.components.resourceBlocker = new ResourceBlocker();
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initDOMOptimizations();
                });
            } else {
                this.initDOMOptimizations();
            }
            if (CONFIG.enableNetworkOptimization) {
                this.components.networkOptimizer = new NetworkOptimizer();
            }
            if (CONFIG.enableScriptOptimization) {
                this.components.scriptOptimizer = new ScriptOptimizer();
            }
            this.setupGlobalOptimizations();
        }

        initDOMOptimizations() {
            if (CONFIG.enableMediaOptimization) {
                this.components.mediaOptimizer = new AdvancedMediaOptimizer();
            }
            if (CONFIG.enableDOMOptimization) {
                this.components.domOptimizer = new AdvancedDOMOptimizer();
            }
            this.components.cssOptimizer = new CSSOptimizer();
        }

        setupGlobalOptimizations() {
            this.optimizeScrolling();
            this.optimizeResizing();
            window.addEventListener('beforeunload', () => {
                this.cleanup();
            });
            const initTime = performance.now() - this.startTime;
            console.log(`[Optimizer] ✅ Initialization completed in ${initTime.toFixed(2)}ms`);
        }

        optimizeScrolling() {
            let ticking = false;
            const scrollTask = () => {
                // Scroll-based optimizations can be added here
                ticking = false;
            };
            const optimizedScrollHandler = () => {
                if (!ticking) {
                    requestAnimationFrame(scrollTask);
                    ticking = true;
                }
            };
            window.addEventListener('scroll', optimizedScrollHandler, {
                passive: true
            });
        }

        optimizeResizing() {
            const optimizedResizeHandler = Utils.debounce(() => {
                if (this.components.mediaOptimizer) {
                    Utils.scheduleIdleTask(() => {
                        this.components.mediaOptimizer.scanForMedia();
                    });
                }
            }, 250);
            window.addEventListener('resize', optimizedResizeHandler);
        }

        cleanup() {
            Object.values(this.components).forEach(component => {
                if (component.cleanup && typeof component.cleanup === 'function') {
                    component.cleanup();
                }
            });
        }

        optimizeNow() {
            console.log('[Optimizer] 🔧 Manual optimization triggered');
            if (this.components.mediaOptimizer) {
                this.components.mediaOptimizer.scanForMedia();
            }
            if (this.components.domOptimizer) {
                this.components.domOptimizer.performPeriodicCleanup();
            }
        }

        getStats() {
            return this.components.performanceMonitor ?
                this.components.performanceMonitor.metrics : {};
        }
    }

    // --- Global Variables ---
    let optimizer;
    let resourceBlocker;

    // --- Initialization ---
    function initializeOptimizer() {
        try {
            optimizer = new WebsiteOptimizer();
            if (typeof window !== 'undefined') {
                window.websiteOptimizer = optimizer;
            }
        } catch (error) {
            console.error('[Optimizer] ❌ Failed to initialize:', error);
        }
    }

    // --- Enhanced Error Handling ---
    window.addEventListener('error', (event) => {
        if (event.error && event.error.message && event.error.message.includes('Optimizer')) {
            console.error('[Optimizer] ❌ Global error caught:', event.error);
        }
    });

    // --- Start Optimization ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOptimizer);
    } else {
        initializeOptimizer();
    }

    // --- Console Commands for Manual Control ---
    if (typeof window !== 'undefined') {
        window.optimizerCommands = {
            optimize: () => optimizer?.optimizeNow(),
            stats: () => optimizer?.getStats(),
            config: CONFIG,
            toggleMedia: () => {
                CONFIG.enableMediaOptimization = !CONFIG.enableMediaOptimization;
                console.log(`Media optimization: ${CONFIG.enableMediaOptimization ? 'enabled' : 'disabled'}`);
            },
            toggleBlocking: () => {
                CONFIG.enableResourceBlocking = !CONFIG.enableResourceBlocking;
                console.log(`Resource blocking: ${CONFIG.enableResourceBlocking ? 'enabled' : 'disabled'}`);
            }
        };
        console.log('[Optimizer] 💡 Available commands: window.optimizerCommands');
    }

})();
// ==/UserScript==