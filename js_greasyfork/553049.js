// ==UserScript==
// @name         NHentai Infinite Scroll Stable
// @namespace    http://tampermonkey.net/
// @version      3.45
// @license      MIT
// @description  Bidirectional infinite scroll on all pages, memory-limited, loads all thumbnails immediately
// @match        https://nhentai.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553049/NHentai%20Infinite%20Scroll%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/553049/NHentai%20Infinite%20Scroll%20Stable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%cInfinite scroll script started', 'color: green; font-weight: bold');

    // Prevent layout shift and flashing
    const style = document.createElement('style');
    style.textContent = `
        html {
            scrollbar-gutter: stable;
            scroll-behavior: auto !important;
        }
        body {
            overflow-y: scroll;
        }
    `;
    document.head.appendChild(style);

    const maxPagesInDOM = 3;
    const scrollBuffer = 2000;
    const baseUrl = 'https://nhentai.net/';

    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.error('Timeout waiting for element:', selector);
            }
        }, 200);
    }

    function getBaseUrlForCurrentPage() {
        const path = window.location.pathname;
        const search = window.location.search;

        // Remove any page parameter from search
        const params = new URLSearchParams(search);
        params.delete('page');

        let baseUrlStr = baseUrl.replace(/\/$/, '') + path;
        if (params.toString()) {
            baseUrlStr += '?' + params.toString();
        }

        return baseUrlStr;
    }

    waitForElement('.container.index-container', (homepageContainer) => {
        console.log('%cInitializing infinite scroll', 'color: orange');

        const wrapper = homepageContainer.parentNode;
        const loadedPages = new Map();
        const pageOrder = [];
        const loadingSet = new Set();

        // Store original starting page state
        let originalStartingPage = null;
        let startingPageNum = null;
        const urlParams = new URLSearchParams(window.location.search);
        const currentPageNum = parseInt(urlParams.get('page')) || 1;
        const basePageUrl = getBaseUrlForCurrentPage();

        console.log(`Base URL: ${basePageUrl}`);
        console.log(`Current page: ${currentPageNum}`);

        homepageContainer.dataset.pageNum = currentPageNum.toString();
        loadedPages.set(currentPageNum, homepageContainer);
        pageOrder.push(currentPageNum);

        // Store a deep clone of the starting page for permanent backup
        originalStartingPage = homepageContainer.cloneNode(true);
        startingPageNum = currentPageNum;
        console.log(`Stored original page ${currentPageNum} state`);

        function loadAllImages(container) {
            container.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });

            container.querySelectorAll('noscript').forEach(noscript => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = noscript.innerHTML;
                const img = tempDiv.querySelector('img');
                if (img) {
                    noscript.parentNode.insertBefore(img, noscript);
                    noscript.remove();
                }
            });
        }

        async function fetchPage(pageNum) {
            const separator = basePageUrl.includes('?') ? '&' : '?';
            const url = `${basePageUrl}${separator}page=${pageNum}`;
            console.log(`Fetching page ${pageNum}... URL: ${url}`);

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const container = doc.querySelector('.container.index-container');

                if (!container) {
                    console.warn(`No container found on page ${pageNum}`);
                    return null;
                }

                const newContainer = container.cloneNode(true);
                newContainer.dataset.pageNum = pageNum.toString();
                loadAllImages(newContainer);

                return newContainer;
            } catch (error) {
                console.error(`Error fetching page ${pageNum}:`, error);
                return null;
            }
        }

        function loadForward() {
            const lastPageNum = pageOrder[pageOrder.length - 1];
            const nextPageNum = lastPageNum + 1;

            if (loadingSet.has(nextPageNum) || loadedPages.has(nextPageNum)) {
                console.log(`Page ${nextPageNum} already loading or loaded`);
                return;
            }

            loadingSet.add(nextPageNum);
            console.log(`Attempting to load page ${nextPageNum}`);

            // Check if we need to restore from backup
            if (nextPageNum === startingPageNum && !loadedPages.has(nextPageNum) && originalStartingPage) {
                console.log(`Restoring page ${startingPageNum} from backup`);
                const restoredPage = originalStartingPage.cloneNode(true);
                wrapper.appendChild(restoredPage);
                loadedPages.set(startingPageNum, restoredPage);
                pageOrder.push(startingPageNum);
                console.log(`Restored page ${startingPageNum} (total pages in DOM: ${pageOrder.length})`);
                loadingSet.delete(nextPageNum);

                // Check if we need to dump a page
                if (pageOrder.length > maxPagesInDOM) {
                    const oldestPageNum = pageOrder.shift();
                    const oldContainer = loadedPages.get(oldestPageNum);
                    if (oldContainer) {
                        oldContainer.remove();
                        loadedPages.delete(oldestPageNum);
                        console.log(`Removed page ${oldestPageNum} (total pages in DOM: ${pageOrder.length})`);
                    }
                }
                return;
            }

            fetchPage(nextPageNum).then(newContainer => {
                if (!newContainer) {
                    loadingSet.delete(nextPageNum);
                    console.warn(`Failed to load page ${nextPageNum}`);
                    return;
                }

                wrapper.appendChild(newContainer);
                loadedPages.set(nextPageNum, newContainer);
                pageOrder.push(nextPageNum);
                console.log(`Loaded page ${nextPageNum} (total pages in DOM: ${pageOrder.length})`);

                if (pageOrder.length > maxPagesInDOM) {
                    const oldestPageNum = pageOrder.shift();
                    const oldContainer = loadedPages.get(oldestPageNum);
                    if (oldContainer) {
                        oldContainer.remove();
                        loadedPages.delete(oldestPageNum);
                        console.log(`Removed page ${oldestPageNum} (total pages in DOM: ${pageOrder.length})`);
                    }
                }

                loadingSet.delete(nextPageNum);
            });
        }

        function loadBackward() {
            const firstPageNum = pageOrder[0];
            if (firstPageNum <= 1) return;

            const prevPageNum = firstPageNum - 1;

            if (loadingSet.has(prevPageNum) || loadedPages.has(prevPageNum)) {
                console.log(`Page ${prevPageNum} already loading or loaded`);
                return;
            }

            loadingSet.add(prevPageNum);

            // Check if we need to restore from backup
            if (prevPageNum === startingPageNum && !loadedPages.has(prevPageNum) && originalStartingPage) {
                console.log(`Restoring page ${startingPageNum} from backup`);
                const restoredPage = originalStartingPage.cloneNode(true);

                // Store current scroll position BEFORE inserting
                const scrollBefore = window.scrollY;

                wrapper.insertBefore(restoredPage, wrapper.firstChild);

                // Use requestAnimationFrame to ensure rendering is complete
                requestAnimationFrame(() => {
                    const newFirstPageHeight = restoredPage.offsetHeight;
                    console.log(`Restored page height: ${newFirstPageHeight}px`);
                    window.scrollTo(0, scrollBefore + newFirstPageHeight);
                });

                loadedPages.set(startingPageNum, restoredPage);
                pageOrder.unshift(startingPageNum);
                console.log(`Restored page ${startingPageNum} (total pages in DOM: ${pageOrder.length})`);

                if (pageOrder.length > maxPagesInDOM) {
                    const newestPageNum = pageOrder.pop();
                    const newestContainer = loadedPages.get(newestPageNum);
                    if (newestContainer) {
                        newestContainer.remove();
                        loadedPages.delete(newestPageNum);
                        console.log(`Removed page ${newestPageNum} (total pages in DOM: ${pageOrder.length})`);
                    }
                }

                loadingSet.delete(prevPageNum);
                return;
            }

            fetchPage(prevPageNum).then(newContainer => {
                if (!newContainer) {
                    loadingSet.delete(prevPageNum);
                    return;
                }

                // Store scroll position BEFORE insertion
                const scrollBefore = window.scrollY;

                wrapper.insertBefore(newContainer, wrapper.firstChild);
                loadedPages.set(prevPageNum, newContainer);
                pageOrder.unshift(prevPageNum);
                console.log(`Loaded page ${prevPageNum} (total pages in DOM: ${pageOrder.length})`);

                // Wait for browser to render, then adjust scroll
                requestAnimationFrame(() => {
                    const newPageHeight = newContainer.offsetHeight;
                    console.log(`New page height: ${newPageHeight}px`);

                    if (newPageHeight > 0) {
                        window.scrollTo(0, scrollBefore + newPageHeight);
                    } else {
                        // Fallback: wait one more frame if height is still 0
                        requestAnimationFrame(() => {
                            const retryHeight = newContainer.offsetHeight;
                            console.log(`Retry height: ${retryHeight}px`);
                            window.scrollTo(0, scrollBefore + retryHeight);
                        });
                    }
                });

                if (pageOrder.length > maxPagesInDOM) {
                    const newestPageNum = pageOrder.pop();
                    const newestContainer = loadedPages.get(newestPageNum);
                    if (newestContainer) {
                        newestContainer.remove();
                        loadedPages.delete(newestPageNum);
                        console.log(`Removed page ${newestPageNum} (total pages in DOM: ${pageOrder.length})`);
                    }
                }

                loadingSet.delete(prevPageNum);
            });
        }

        let lastScrollCheck = 0;
        const scrollDebounceMs = 100;

        function handleScroll() {
            const now = Date.now();
            if (now - lastScrollCheck < scrollDebounceMs) return;
            lastScrollCheck = now;

            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollBottom = scrollTop + clientHeight;

            // Load forward when near bottom
            if (scrollBottom >= scrollHeight - scrollBuffer) {
                loadForward();
            }

            // Load backward when near top - increased threshold for better UX
            if (scrollTop <= (scrollBuffer * 2) && pageOrder[0] > 1) {
                loadBackward();
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        console.log('%cInfinite scroll initialized', 'color: green');
    });
})();
