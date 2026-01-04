// ==UserScript==
// @name         AniDB Thumbnails Expander
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Automatically replaces AniDB thumbnail images with full high-resolution versions and enlarges them for better viewing. Includes smart caching, error handling, and performance optimizations.
// @author       Kristijan1001
// @match        https://anidb.net/*
// @match        https://*.anidb.net/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @icon         https://anidb.net/favicon.ico
// @icon64       https://anidb.net/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/551740/AniDB%20Thumbnails%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/551740/AniDB%20Thumbnails%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        thumbnailWidth: 300,
        checkInterval: 2000,
        initialDelay: 500,
        enableLogging: false
    };

    // Cache to track processed images
    const processedImages = new WeakSet();
    const failedUrls = new Set();

    // Logging utility
    const log = (...args) => CONFIG.enableLogging && console.log('[AniDB HD]', ...args);

    // Add enhanced CSS for better image display
    const style = document.createElement('style');
    style.textContent = `
        .g_image.thumb {
            width: ${CONFIG.thumbnailWidth}px !important;
            height: auto !important;
            max-width: none !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: zoom-in;
        }

        .g_image.thumb:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 100;
            position: relative;
        }

        /* Enhanced loading state */
        img[data-hd-loading="true"] {
            opacity: 0.6;
            filter: blur(2px);
            transition: opacity 0.3s ease, filter 0.3s ease;
        }

        img[data-hd-loaded="true"] {
            opacity: 1;
            filter: none;
        }
    `;
    document.head.appendChild(style);

    /**
     * Converts thumbnail URL to high-resolution URL
     * @param {string} url - Original image URL
     * @returns {string} High-resolution URL
     */
    function getHighResUrl(url) {
        if (!url || typeof url !== 'string') return url;

        // Remove thumbnail suffix and file extension for AniDB's image serving
        let hdUrl = url.replace(/-thumb(\.[^.]+)?$/, '');

        // Handle additional AniDB URL patterns
        hdUrl = hdUrl.replace(/\/thumbs?\//, '/images/');

        return hdUrl;
    }

    /**
     * Validates if URL is an AniDB image
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid AniDB image
     */
    function isAniDbImage(url) {
        return url && (
            url.includes('anidb.net') ||
            url.includes('-thumb')
        );
    }

    /**
     * Replaces thumbnail with high-resolution version
     * @param {HTMLImageElement} img - Image element to process
     */
    function replaceWithHighRes(img) {
        // Skip if already processed or failed
        if (processedImages.has(img) || failedUrls.has(img.src)) {
            return;
        }

        const originalSrc = img.src;

        // Only process AniDB images
        if (!isAniDbImage(originalSrc)) {
            return;
        }

        const hdUrl = getHighResUrl(originalSrc);

        // Skip if URL didn't change
        if (hdUrl === originalSrc) {
            processedImages.add(img);
            return;
        }

        log('Processing:', originalSrc, '->', hdUrl);

        // Mark as loading
        img.setAttribute('data-hd-loading', 'true');

        // Preload high-res image
        const hdImage = new Image();

        hdImage.onload = function() {
            img.src = hdUrl;
            img.setAttribute('data-hd-loaded', 'true');
            img.removeAttribute('data-hd-loading');
            processedImages.add(img);
            log('Loaded successfully:', hdUrl);
        };

        hdImage.onerror = function() {
            log('Failed to load:', hdUrl);
            failedUrls.add(originalSrc);
            img.removeAttribute('data-hd-loading');
            processedImages.add(img);
        };

        hdImage.src = hdUrl;
    }

    /**
     * Processes all images on the page
     */
    function processAllImages() {
        const images = document.querySelectorAll('img');
        let processedCount = 0;

        images.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                replaceWithHighRes(img);
                processedCount++;
            } else {
                // Wait for image to load before processing
                img.addEventListener('load', () => replaceWithHighRes(img), { once: true });
            }
        });

        if (processedCount > 0) {
            log(`Processed ${processedCount} images`);
        }
    }

    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initial processing after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllImages();
            setTimeout(processAllImages, CONFIG.initialDelay);
        });
    } else {
        processAllImages();
        setTimeout(processAllImages, CONFIG.initialDelay);
    }

    // Observe DOM changes for dynamically loaded content
    const debouncedProcess = debounce(processAllImages, 300);
    const observer = new MutationObserver((mutations) => {
        // Only process if images were actually added
        const hasNewImages = mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.nodeName === 'IMG' || (node.querySelectorAll && node.querySelectorAll('img').length > 0)
            )
        );

        if (hasNewImages) {
            debouncedProcess();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Periodic check with adaptive interval
    let checkCount = 0;
    const intervalId = setInterval(() => {
        processAllImages();
        checkCount++;

        // After 10 checks, reduce frequency to save resources
        if (checkCount > 10) {
            clearInterval(intervalId);
            setInterval(processAllImages, CONFIG.checkInterval * 3);
            log('Switched to reduced check frequency');
        }
    }, CONFIG.checkInterval);

    log('AniDB HD Image Enhancer initialized');
})();