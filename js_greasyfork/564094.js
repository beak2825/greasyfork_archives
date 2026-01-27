// ==UserScript==
// @name         Undumbing of Age (fast loader, hide comments until buttonpress)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A handy little userscript which replaces the navigation features with quicker ones (utilising pushState to load the next page's panel without the rest), and hides the comment section until you press the comments button.
// @author       edenwhisker
// @match        https://www.dumbingofage.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564094/Undumbing%20of%20Age%20%28fast%20loader%2C%20hide%20comments%20until%20buttonpress%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564094/Undumbing%20of%20Age%20%28fast%20loader%2C%20hide%20comments%20until%20buttonpress%29.meta.js
// ==/UserScript==

// if you're reading this: thank you for using my script!
// i love doa, but the recent panels have been really, really disappointing (as of the 26th of january, 2026).
// let's hope they get better from here on!

// what's new: refactored with kuilin's advice for preloading + now you get a config!

(function() {
    'use strict';

    console.log("Undumbing of Age loaded - userscript by edenwhisker on discord");

    const CONFIG = {
        cacheSize: 5, // don't set this too high! be nice to the website
        preloadDepthNext: 4,
        preloadDepthPrev: 1,
        navDebounceMs: 150,
        scrollBehavior: 'smooth' // set to 'instant' for it to jump instantly
    };

    class LRUCache {
        constructor(maxSize) {
            this.cache = new Map();
            this.maxSize = maxSize;
        }

        has(key) { return this.cache.has(key); }

        get(key) {
            if (!this.cache.has(key)) return undefined;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.maxSize) {
                const oldestKey = this.cache.keys().next().value;
                this.cache.delete(oldestKey);
            }
            this.cache.set(key, value);
        }

        keys() { return Array.from(this.cache.keys()); }
    }

    const preloadCache = new LRUCache(CONFIG.cacheSize);
    const inFlightRequests = new Set();
    const preloadedImages = new Set();

    let currentNavController = null;
    let navLock = false;

    const staticFirstUrl = captureHref(".first");
    const staticLatestUrl = captureHref(".latest");

    function captureHref(selector) {
        const el = document.querySelector(`${selector} a`) || document.querySelector(selector);
        return el?.href || null;
    }

    function resolveHref(element, baseUrl) {
        if (!element) return null;
        if (element.href) return element.href;
        if (element.src) return element.src;
        const rawUrl = element.getAttribute("href") || element.getAttribute("src");
        if (!rawUrl) return null;
        try {
            return new URL(rawUrl, baseUrl).href;
        } catch {
            return null;
        }
    }

    function normalizeUrl(url) {
        try {
            const parsed = new URL(url);
            parsed.pathname = parsed.pathname.replace(/\/$/, '') || '/';
            return parsed.href;
        } catch {
            return url;
        }
    }

    function getPageName(url) {
        try {
            const path = new URL(url).pathname.replace(/\/$/, '');
            const segments = path.split('/').filter(Boolean);
            return segments[segments.length - 1] || path;
        } catch {
            return url;
        }
    }

    function scheduleIdle(callback, timeout = 1000) {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(callback, { timeout });
        } else {
            setTimeout(callback, 1);
        }
    }

    function updatePreloadTitle() {
        const trigger = document.querySelector('div.jumbotron-header:nth-child(3)');
        if (!trigger) return;

        const cached = preloadCache.keys().map(getPageName);
        const loading = Array.from(inFlightRequests).map(getPageName);

        let title = `Cached (${cached.length}/${CONFIG.cacheSize}): `;
        title += cached.length ? cached.join(', ') : 'none';

        if (loading.length) {
            title += `\nLoading: ${loading.join(', ')}`;
        }

        title += `\nImages: ${preloadedImages.size}`;

        trigger.title = title;
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'undumbing-styles';
        style.textContent = `
            #comments { display: none !important; }
            #comments.visible { display: block !important; }
            #comic { cursor: pointer; }
            .undumbing-loading #comic { opacity: 0.7; transition: opacity 0.15s; }
            .nav-disabled { opacity: 0.3; pointer-events: none; }
        `;
        document.head.appendChild(style);
    }

    function addFooterCredit() {
        const footer = document.querySelector(".footer-info");
        if (footer && !footer.querySelector('.undumbing-credit')) {
            const credit = document.createElement('span');
            credit.className = 'undumbing-credit';
            credit.textContent = " | userscript by edenwhisker";
            credit.style.opacity = "0.7";
            footer.appendChild(credit);
        }
    }

    function preloadImage(src) {
        if (!src || preloadedImages.has(src)) return;
        preloadedImages.add(src);

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);

        if (preloadedImages.size > CONFIG.cacheSize * 2) {
            const oldLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
            oldLinks.forEach((link, index) => {
                if (index < oldLinks.length - CONFIG.cacheSize) {
                    link.remove();
                }
            });
        }

        updatePreloadTitle();
    }

    function preloadChain(url, depth, direction = 'next') {
        if (depth <= 0 || !url) return;

        const normalizedUrl = normalizeUrl(url);
        if (preloadCache.has(normalizedUrl) || inFlightRequests.has(normalizedUrl)) return;

        inFlightRequests.add(normalizedUrl);
        updatePreloadTitle();

      // thank you to kuilin from discord for help with the optimisation!
        fetch(url, { priority: 'low' })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.text();
            })
            .then(html => {
                preloadCache.set(normalizedUrl, html);

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const comicImg = doc.querySelector("#comic img");
                const imgSrc = resolveHref(comicImg, url);
                if (imgSrc) preloadImage(imgSrc);

                const nextSelector = direction === 'next' ? '.next-comic' : '.previous-comic';
                const nextBtn = doc.querySelector(nextSelector);
                const nextHref = resolveHref(nextBtn, url);

                if (nextHref && nextHref !== url) {
                    scheduleIdle(() => preloadChain(nextHref, depth - 1, direction));
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.debug("preload skipped:", url, err.message);
                }
            })
            .finally(() => {
                inFlightRequests.delete(normalizedUrl);
                updatePreloadTitle();
            });
    }

    function initPreload() {
        scheduleIdle(() => {
            const nextBtn = document.querySelector(".next-comic");
            if (nextBtn?.href) preloadChain(nextBtn.href, CONFIG.preloadDepthNext, 'next');
        });

        scheduleIdle(() => {
            const prevBtn = document.querySelector(".previous-comic");
            if (prevBtn?.href) preloadChain(prevBtn.href, CONFIG.preloadDepthPrev, 'prev');
        }, 500);
    }

    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
            if (navLock) return;

            let targetUrl = null;
            let shouldPrevent = false;

            switch (e.key) {
                case "ArrowRight":
                    targetUrl = document.querySelector(".next-comic")?.href;
                    break;
                case "ArrowLeft":
                    targetUrl = document.querySelector(".previous-comic")?.href;
                    break;
                case "Home":
                    targetUrl = staticFirstUrl;
                    shouldPrevent = true;
                    break;
                case "End":
                    targetUrl = staticLatestUrl;
                    shouldPrevent = true;
                    break;
                default:
                    return;
            }

            if (shouldPrevent) e.preventDefault();

            if (targetUrl) {
                navLock = true;
                loadComicPage(targetUrl);
                setTimeout(() => { navLock = false; }, CONFIG.navDebounceMs);
            }
        });
    }

    function setupClickHandling() {
        document.addEventListener('click', function(e) {
            const commentBtn = e.target.closest(".nav-comments");
            if (commentBtn) {
                e.preventDefault();
                toggleComments();
                return;
            }

            if (e.target.closest(".first")) {
                e.preventDefault();
                if (staticFirstUrl) loadComicPage(staticFirstUrl);
                return;
            }

            if (e.target.closest(".latest")) {
                e.preventDefault();
                if (staticLatestUrl) loadComicPage(staticLatestUrl);
                return;
            }

            const navLink = e.target.closest(".next-comic, .previous-comic");
            if (navLink?.href) {
                e.preventDefault();
                loadComicPage(navLink.href);
                return;
            }

            if (e.target.closest("#comic") && !e.target.closest("a")) {
                const nextBtn = document.querySelector(".next-comic");
                if (nextBtn?.href) {
                    e.preventDefault();
                    loadComicPage(nextBtn.href);
                }
            }
        });
    }

    function toggleComments() {
        const comments = document.querySelector("#comments");
        if (!comments) return;

        if (comments.classList.contains('visible')) {
            comments.classList.remove('visible');
        } else {
            comments.classList.add('visible');
            comments.scrollIntoView({ behavior: CONFIG.scrollBehavior });
        }
    }

    function loadComicPage(url) {
        if (!url) return;

        const normalizedUrl = normalizeUrl(url);

        if (currentNavController) currentNavController.abort();
        currentNavController = new AbortController();

        document.body.classList.add('undumbing-loading');
        preparePageForLoad();
        history.pushState({ url: normalizedUrl }, '', url);

        const fetchPromise = preloadCache.has(normalizedUrl)
            ? Promise.resolve(preloadCache.get(normalizedUrl))
            : fetch(url, { signal: currentNavController.signal }).then(r => {
                  if (!r.ok) throw new Error(`HTTP ${r.status}`);
                  return r.text();
              });

        fetchPromise
            .then(html => {
                if (!preloadCache.has(normalizedUrl)) {
                    preloadCache.set(normalizedUrl, html);
                }

                applyNewPage(html, url);
                document.body.classList.remove('undumbing-loading');
                updatePreloadTitle();

                scheduleIdle(() => {
                    const nextBtn = document.querySelector(".next-comic");
                    if (nextBtn?.href) preloadChain(nextBtn.href, CONFIG.preloadDepthNext, 'next');
                });
            })
            .catch(err => {
                document.body.classList.remove('undumbing-loading');
                if (err.name === 'AbortError') return;
                console.error("navigation failed:", err);
                window.location.href = url;
            });
    }

    function preparePageForLoad() {
        document.querySelector("#masthead")?.classList.remove('header-fixed');
        document.querySelector("#site-navigation")?.classList.remove('fixed-top');

        const comic = document.querySelector("#comic");
        if (comic) {
            comic.style.minHeight = `${comic.offsetHeight}px`;
            comic.innerHTML = '';
        }

        const comments = document.querySelector("#comments");
        if (comments) {
            comments.classList.remove('visible');
            comments.innerHTML = '';
        }
    }

    function applyNewPage(html, baseUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        if (doc.title) document.title = doc.title;

        const currentWrappers = document.querySelectorAll(".blog-wrapper");
        const newWrappers = doc.querySelectorAll(".blog-wrapper");
        currentWrappers.forEach((wrapper, index) => {
            if (newWrappers[index]) wrapper.innerHTML = newWrappers[index].innerHTML;
        });

        const currentComic = document.querySelector("#comic");
        const newComic = doc.querySelector("#comic");
        if (currentComic && newComic) {
            currentComic.innerHTML = newComic.innerHTML;
            currentComic.style.minHeight = '';
            window.scrollTo({ top: 0, behavior: CONFIG.scrollBehavior });
        }

        const currentComments = document.querySelector("#comments");
        const newComments = doc.querySelector("#comments");
        if (currentComments && newComments) {
            currentComments.innerHTML = newComments.innerHTML;
        }

        updateNavButton(".next-comic", doc, baseUrl);
        updateNavButton(".previous-comic", doc, baseUrl);
        updateStaticNavButton(".first", staticFirstUrl);
        updateStaticNavButton(".latest", staticLatestUrl);

        const currentCommentNav = document.querySelector(".nav-comments");
        const newCommentNav = doc.querySelector(".nav-comments");
        if (currentCommentNav && newCommentNav) {
            currentCommentNav.innerHTML = newCommentNav.innerHTML;
        }
    }

    function updateNavButton(selector, doc, baseUrl) {
        const newBtnData = doc.querySelector(selector);
        const newHref = resolveHref(newBtnData, baseUrl);

        document.querySelectorAll(selector).forEach(btn => {
            if (newHref) {
                btn.href = newHref;
                btn.classList.remove('nav-disabled');
            } else {
                btn.removeAttribute('href');
                btn.classList.add('nav-disabled');
            }
        });
    }

    function updateStaticNavButton(selector, staticUrl) {
        document.querySelectorAll(selector).forEach(container => {
            const link = container.tagName === 'A' ? container : container.querySelector("a");
            if (link && staticUrl) {
                link.href = staticUrl;
                link.classList.remove('nav-disabled');
            }
        });
    }

    function setupHistoryHandling() {
        window.addEventListener('popstate', (event) => {
            const url = event.state?.url || window.location.href;
            const normalizedUrl = normalizeUrl(url);

            if (preloadCache.has(normalizedUrl)) {
                preparePageForLoad();
                applyNewPage(preloadCache.get(normalizedUrl), url);
            } else {
                location.reload();
            }
        });
    }

    function init() {
        injectStyles();
        addFooterCredit();
        setupKeyboardNavigation();
        setupClickHandling();
        setupHistoryHandling();
        initPreload();
        updatePreloadTitle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();