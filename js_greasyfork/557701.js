// ==UserScript==
// @name         HEB Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert HEB search results pagination to infinite scroll
// @author       You
// @match        https://www.heb.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557701/HEB%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/557701/HEB%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isLoading = false;
    let hasMorePages = true;
    let currentPage = 1;
    let lastLoadedUrl = null;

    // Find the product grid container
    function findProductGrid() {
        // Try to find the container with class BasicGrid_basicGrid__dZgBP
        const grid = document.querySelector('.BasicGrid_basicGrid__dZgBP');
        if (grid) return grid;

        // Fallback: find container with product links
        const firstProduct = document.querySelector('a[href*="/product-detail/"]');
        if (firstProduct) {
            let container = firstProduct.parentElement;
            // Traverse up to find the grid container
            while (container && container !== document.body) {
                if (container.classList && container.classList.contains('BasicGrid_basicGrid__dZgBP')) {
                    return container;
                }
                // Check if this container has multiple product links
                if (container.querySelectorAll('a[href*="/product-detail/"]').length > 1) {
                    return container;
                }
                container = container.parentElement;
            }
        }
        return null;
    }

    // Find pagination navigation
    function findPagination() {
        return document.querySelector('nav[aria-label*="Pagination"], nav[aria-label*="pagination"]') ||
               document.querySelector('nav:has(a[href*="page="])');
    }

    // Get next page URL
    function getNextPageUrl(doc = document) {
        const pagination = doc.querySelector('nav[aria-label*="Pagination"], nav[aria-label*="pagination"]') ||
                           (doc === document ? findPagination() : null);
        if (!pagination) return null;

        // Find "Next" link
        const nextLink = pagination.querySelector('a[aria-label*="next"], a[aria-label*="Next"]') ||
                         Array.from(pagination.querySelectorAll('a')).find(a => 
                             a.textContent.trim().toLowerCase() === 'next'
                         );

        if (nextLink) {
            // Check if it's disabled or points to current page
            if (nextLink.hasAttribute('disabled') || 
                nextLink.classList.contains('disabled') ||
                !nextLink.href ||
                nextLink.href === window.location.href) {
                return null;
            }
            return nextLink.href;
        }

        // Fallback: find next page number link
        const currentPageLink = pagination.querySelector('a[aria-current="page"]') ||
                               Array.from(pagination.querySelectorAll('a')).find(a => 
                                   a.getAttribute('aria-current') === 'page' || 
                                   a.classList.contains('active')
                               );

        if (currentPageLink) {
            const currentPageNum = parseInt(currentPageLink.textContent.trim()) || 1;
            const nextPageNum = currentPageNum + 1;
            const nextPageLink = Array.from(pagination.querySelectorAll('a')).find(a => {
                const text = a.textContent.trim();
                return text === nextPageNum.toString() || a.href.includes(`page=${nextPageNum}`);
            });
            if (nextPageLink) return nextPageLink.href;
        }

        // Only construct URL if we're sure there are more pages
        // Don't auto-construct on last page
        return null;
    }

    // Check if there are more pages (can check a specific document/HTML)
    function checkHasMorePages(doc = document) {
        const pagination = doc.querySelector('nav[aria-label*="Pagination"], nav[aria-label*="pagination"]') ||
                           (doc === document ? findPagination() : null);
        
        if (!pagination) return false;

        // Check if "Next" link exists and is not disabled
        const nextLink = pagination.querySelector('a[aria-label*="next"], a[aria-label*="Next"]') ||
                         Array.from(pagination.querySelectorAll('a')).find(a => 
                             a.textContent.trim().toLowerCase() === 'next'
                         );

        if (nextLink) {
            // Check if it's disabled or has no href
            if (nextLink.hasAttribute('disabled') || 
                nextLink.classList.contains('disabled') ||
                !nextLink.href ||
                nextLink.href === window.location.href) {
                return false;
            }
            return true;
        }

        // Check if there are more page number links
        const pageLinks = Array.from(pagination.querySelectorAll('a[href*="page="]'));
        if (pageLinks.length > 0) {
            const pageNumbers = pageLinks.map(link => {
                const match = link.href.match(/page=(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }).filter(num => num > 0);
            
            if (pageNumbers.length === 0) return false;
            
            const maxPage = Math.max(...pageNumbers);
            const url = new URL(window.location.href);
            const currentPageNum = parseInt(url.searchParams.get('page')) || 1;
            return currentPageNum < maxPage;
        }

        return false;
    }

    // Extract product items from HTML
    function extractProducts(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const grid = doc.querySelector('.BasicGrid_basicGrid__dZgBP');

        if (!grid) return [];

        // Find all product wrapper elements (direct children of grid)
        // These are the elements that contain product cards
        const products = Array.from(grid.children).filter(child => {
            return child.querySelector('a[href*="/product-detail/"]');
        });

        return products;
    }

    // Load next page
    async function loadNextPage() {
        if (isLoading || !hasMorePages) return;

        const nextPageUrl = getNextPageUrl();
        if (!nextPageUrl) {
            hasMorePages = false;
            return;
        }

        // Prevent loading the same URL twice
        if (nextPageUrl === lastLoadedUrl) {
            hasMorePages = false;
            return;
        }

        // Normalize URLs for comparison (remove hash, trailing slashes, etc.)
        const normalizeUrl = (url) => {
            try {
                const u = new URL(url, window.location.origin);
                u.hash = '';
                // Normalize search params
                const params = new URLSearchParams(u.search);
                u.search = params.toString();
                return u.toString().replace(/\/$/, '');
            } catch {
                return url;
            }
        };

        const normalizedNextUrl = normalizeUrl(nextPageUrl);
        const normalizedLastUrl = lastLoadedUrl ? normalizeUrl(lastLoadedUrl) : null;

        if (normalizedNextUrl === normalizedLastUrl) {
            hasMorePages = false;
            return;
        }

        isLoading = true;
        const grid = findProductGrid();
        if (!grid) {
            isLoading = false;
            return;
        }

        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Loading more products...';
        loadingIndicator.style.cssText = `
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        `;
        grid.appendChild(loadingIndicator);

        try {
            const response = await fetch(nextPageUrl);
            const html = await response.text();
            
            // Parse the HTML to check pagination in the fetched page
            const parser = new DOMParser();
            const fetchedDoc = parser.parseFromString(html, 'text/html');
            
            const products = extractProducts(html);

            if (products.length === 0) {
                hasMorePages = false;
                loadingIndicator.textContent = 'No more products';
                setTimeout(() => loadingIndicator.remove(), 2000);
                return;
            }

            // Remove loading indicator
            loadingIndicator.remove();

            // Append products to grid
            // Import nodes from the parsed document into the main document
            products.forEach(product => {
                const importedProduct = document.importNode(product, true);
                grid.appendChild(importedProduct);
            });

            // Update tracking
            lastLoadedUrl = nextPageUrl;
            const url = new URL(nextPageUrl);
            const pageNum = parseInt(url.searchParams.get('page')) || currentPage + 1;
            currentPage = pageNum;

            // Update the pagination in the DOM with the fetched page's pagination
            const fetchedPagination = fetchedDoc.querySelector('nav[aria-label*="Pagination"], nav[aria-label*="pagination"]');
            if (fetchedPagination) {
                const currentPagination = findPagination();
                if (currentPagination) {
                    // Replace the pagination with the new one
                    const importedPagination = document.importNode(fetchedPagination, true);
                    currentPagination.replaceWith(importedPagination);
                }
            }

            // Check if there are more pages based on the fetched page's pagination
            // Also check if we can get a next page URL from the fetched page
            const nextPageUrlFromFetched = getNextPageUrl(fetchedDoc);
            hasMorePages = checkHasMorePages(fetchedDoc) && nextPageUrlFromFetched !== null;

            // Additional check: if the next page URL from fetched doc is the same as what we just loaded, we're stuck
            if (nextPageUrlFromFetched) {
                const normalizedFetchedNext = normalizeUrl(nextPageUrlFromFetched);
                const normalizedJustLoaded = normalizeUrl(nextPageUrl);
                if (normalizedFetchedNext === normalizedJustLoaded) {
                    hasMorePages = false;
                }
            }

            // Hide pagination if no more pages
            if (!hasMorePages) {
                const pagination = findPagination();
                if (pagination) {
                    pagination.style.display = 'none';
                }
                const endMessage = document.createElement('div');
                endMessage.textContent = 'No more products';
                endMessage.style.cssText = `
                    text-align: center;
                    padding: 20px;
                    margin-top: 20px;
                    color: #666;
                    font-size: 14px;
                `;
                grid.appendChild(endMessage);
            }

        } catch (error) {
            console.error('Error loading next page:', error);
            loadingIndicator.textContent = 'Error loading products';
            setTimeout(() => loadingIndicator.remove(), 2000);
            hasMorePages = false;
        } finally {
            isLoading = false;
        }
    }

    // Check if user is near bottom of page
    function checkScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Trigger when within 500px of bottom
        if (documentHeight - (scrollTop + windowHeight) < 500) {
            loadNextPage();
        }
    }

    // Initialize
    function init() {
        // Reset state on new page load
        isLoading = false;
        lastLoadedUrl = null;
        
        const grid = findProductGrid();
        if (!grid) {
            console.log('HEB Infinite Scroll: Product grid not found');
            return;
        }

        // Check initial pagination state
        hasMorePages = checkHasMorePages();

        // Hide pagination initially (we'll show it again if needed)
        const pagination = findPagination();
        if (pagination && hasMorePages) {
            pagination.style.opacity = '0.3';
        }

        // Set up scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkScrollPosition, 100);
        }, { passive: true });

        // Also check on initial load if page is already scrolled
        setTimeout(checkScrollPosition, 1000);
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
    } else {
        setTimeout(init, 1000);
    }

    // Re-initialize on navigation (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();

