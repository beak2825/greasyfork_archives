// ==UserScript==
// @name         Safebooru Endless Scroll
// @namespace    https://github.com/maikgr/SafebooruEndlessScroll
// @version      1.0
// @description  Adds endless scrolling to Safebooru
// @author       maikgr
// @match        https://safebooru.org/index.php?page=post&s=list*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559919/Safebooru%20Endless%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/559919/Safebooru%20Endless%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loading = false;
    let currentPage = 0;
    let noMorePosts = false;

    // Parse current page number from URL
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('pid')) || 0;
    }

    // Initialize
    currentPage = getCurrentPage();

    // Create floating loading indicator for auto-scroll
    function createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'scroll-loading-indicator';
        indicator.textContent = 'Loading more posts...';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    // Create load more button
    function createLoadButton() {
        const button = document.createElement('button');
        button.id = 'load-more-btn';
        button.textContent = 'Load More Posts';
        button.style.cssText = `
            display: block;
            margin: 20px auto;
            padding: 12px 24px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        `;
        button.onclick = loadMorePosts;
        return button;
    }

    // Update button state and appearance
    function setButtonState(state) {
        switch (state) {
            case 'loading':
                loadButton.textContent = 'Loading...';
                loadButton.disabled = true;
                loadButton.style.backgroundColor = '#999';
                loadButton.style.cursor = 'not-allowed';
                break;
            case 'ready':
                loadButton.textContent = 'Load More Posts';
                loadButton.disabled = false;
                loadButton.style.backgroundColor = '#4CAF50';
                loadButton.style.cursor = 'pointer';
                break;
            case 'error':
                loadButton.textContent = 'Error - Click to Retry';
                loadButton.disabled = false;
                loadButton.style.backgroundColor = '#e74c3c';
                loadButton.style.cursor = 'pointer';
                break;
            case 'done':
                loadButton.textContent = 'No More Posts';
                loadButton.disabled = true;
                loadButton.style.backgroundColor = '#999';
                loadButton.style.cursor = 'not-allowed';
                break;
        }
    }

    // Find the image list container
    const imageList = document.querySelector('div.image-list');
    if (!imageList) {
        console.error('Image list not found');
        return;
    }

    // Find the paginator to insert button before it
    const paginator = document.querySelector('div#paginator');
    if (!paginator) {
        console.error('Paginator not found');
        return;
    }

    // Hide the original paginator
    paginator.style.display = 'none';

    // Insert load more button after the image list
    const loadButton = createLoadButton();
    paginator.parentNode.insertBefore(loadButton, paginator);

    // Create floating loading indicator
    const loadingIndicator = createLoadingIndicator();

    // Load more posts
    async function loadMorePosts() {
        if (loading || noMorePosts) return;

        loading = true;
        setButtonState('loading');
        loadingIndicator.style.display = 'block';

        const nextPage = currentPage + 42; // Safebooru uses pid increments of 42 (42 posts per page)

        try {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('pid', nextPage);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

            const response = await fetch(newUrl);

            // Check for HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newImageList = doc.querySelector('div.image-list');

            if (newImageList && newImageList.innerHTML.trim()) {
                // Check if we got actual posts (look for span.thumb)
                const newPosts = newImageList.querySelectorAll('span.thumb');

                if (newPosts.length === 0) {
                    noMorePosts = true;
                    setButtonState('done');
                    return;
                }

                // Append new posts to the image list (using insertAdjacentHTML for performance)
                imageList.insertAdjacentHTML('beforeend', newImageList.innerHTML);

                // Update currentPage only after successful load
                currentPage = nextPage;

                setButtonState('ready');
            } else {
                noMorePosts = true;
                setButtonState('done');
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
            setButtonState('error');
        } finally {
            loading = false;
            loadingIndicator.style.display = 'none';
        }
    }

    // Add hover effect only when button is interactive
    loadButton.addEventListener('mouseenter', () => {
        if (!loadButton.disabled) {
            loadButton.style.backgroundColor = '#45a049';
        }
    });
    loadButton.addEventListener('mouseleave', () => {
        if (!loadButton.disabled) {
            loadButton.style.backgroundColor = '#4CAF50';
        }
    });

    // Create a sentinel element to observe for infinite scroll
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    paginator.parentNode.insertBefore(sentinel, loadButton);

    // Use Intersection Observer for reliable scroll detection
    const observerOptions = {
        root: null, // viewport
        rootMargin: '500px', // trigger 500px before element is visible
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !loading && !noMorePosts) {
                loadMorePosts();
            }
        });
    }, observerOptions);

    scrollObserver.observe(sentinel);

    console.log('Safebooru Endless Scroll loaded!');
})();
