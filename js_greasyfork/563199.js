// ==UserScript==
// @name         Eporner   Load All Videos on Profile
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Fetch and display all videos from all pages on a single page
// @author       You
// @match        https://www.eporner.com/profile/*/uploaded-videos/*
// @match        https://www.eporner.com/profile/*/uploaded-videos/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563199/Eporner%20%20%20Load%20All%20Videos%20on%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/563199/Eporner%20%20%20Load%20All%20Videos%20on%20Profile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isLoading = false;
    let totalVideosLoaded = 0;

    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 40px 15px 15px 15px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        min-width: 280px;
        max-width: 350px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;

    const statusText = document.createElement('div');
    statusText.style.marginBottom = '10px';
    statusText.style.fontWeight = 'bold';

    const progressText = document.createElement('div');
    progressText.style.cssText = 'margin-bottom: 10px; font-size: 12px; color: #aaa;';

    const debugText = document.createElement('div');
    debugText.style.cssText = 'margin-bottom: 10px; font-size: 11px; color: #666; max-height: 150px; overflow-y: auto; padding-right: 5px;';

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 20px;
        background: #333;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        transition: width 0.3s ease;
    `;
    progressBar.appendChild(progressFill);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Load All Videos';
    startBtn.style.cssText = `
        flex: 1;
        padding: 10px;
        background: #4CAF50;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
    `;

    const sortBtn = document.createElement('button');
    sortBtn.textContent = 'Sort by Duration';
    sortBtn.style.cssText = `
        flex: 1;
        padding: 10px;
        background: #2196F3;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
    `;
    sortBtn.disabled = true;
    sortBtn.style.opacity = '0.5';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        padding: 0;
        background: #f44336;
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        line-height: 1;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;

    buttonContainer.appendChild(startBtn);
    buttonContainer.appendChild(sortBtn);

    controlPanel.style.position = 'fixed';
    controlPanel.appendChild(closeBtn);
    controlPanel.appendChild(statusText);
    controlPanel.appendChild(progressText);
    controlPanel.appendChild(debugText);
    controlPanel.appendChild(progressBar);
    controlPanel.appendChild(buttonContainer);
    document.body.appendChild(controlPanel);

    function addDebug(msg) {
        debugText.innerHTML += msg + '<br>';
        debugText.scrollTop = debugText.scrollHeight;
        console.log('[Video Loader]', msg);
    }

    function updateStatus(message, color = 'white') {
        statusText.textContent = message;
        statusText.style.color = color;
    }

    function updateProgress(current, total) {
        progressText.textContent = `Loading page ${current} of ${total}... (${totalVideosLoaded} videos)`;
        const percent = (current / total) * 100;
        progressFill.style.width = percent + '%';
    }

    function getCurrentPage() {
        const urlMatch = window.location.pathname.match(/\/uploaded-videos\/(\d+)/);
        return urlMatch ? parseInt(urlMatch[1]) : 1;
    }

    function getBaseUrl() {
        const path = window.location.pathname.split('/uploaded-videos/')[0];
        return window.location.origin + path + '/uploaded-videos/';
    }

    function getTotalPages() {
        const allLinks = document.querySelectorAll('a');
        const pageNumberLinks = Array.from(allLinks).filter(link => {
            const text = link.textContent.trim();
            const num = parseInt(text);
            return !isNaN(num) && num > 0 && num < 1000;
        });

        addDebug(`Found ${pageNumberLinks.length} page number links`);

        if (pageNumberLinks.length === 0) {
            const nextButton = Array.from(allLinks).find(link =>
                link.textContent.includes('NEXT') ||
                link.textContent.includes('»') ||
                link.textContent.includes('>')
            );

            if (nextButton) {
                addDebug('Found NEXT button, extracting page count...');
                const match = nextButton.href.match(/\/uploaded-videos\/(\d+)/);
                if (match) {
                    const nextPage = parseInt(match[1]);
                    addDebug(`Next page is ${nextPage}, so current max is ${nextPage - 1}`);
                    return nextPage - 1;
                }
            }

            addDebug('No pagination found - only 1 page');
            return 1;
        }

        const pages = pageNumberLinks.map(link => parseInt(link.textContent.trim()));
        const maxPage = Math.max(...pages);

        addDebug(`Page numbers found: ${pages.join(', ')}`);

        const nextButton = Array.from(allLinks).find(link =>
            link.textContent.includes('NEXT') ||
            link.textContent.includes('»') ||
            link.textContent.includes('>')
        );

        if (nextButton) {
            addDebug('Found NEXT button');
            const match = nextButton.href.match(/\/uploaded-videos\/(\d+)/);
            if (match) {
                const nextPage = parseInt(match[1]);
                addDebug(`NEXT points to page ${nextPage}`);
                const estimatedMax = Math.max(maxPage, nextPage);
                addDebug(`Estimated max (considering NEXT): ${estimatedMax}`);
                return estimatedMax;
            }
        }

        addDebug(`Max page number: ${maxPage}`);

        return maxPage;
    }

    function getAllCurrentVideos() {
        // Find all video card elements currently on the page
        const allLinks = document.querySelectorAll('a[href*="/video-"]');
        const videoCards = [];
        const seen = new Set();

        allLinks.forEach(link => {
            let card = link;
            // Go up to find the video card wrapper
            for (let i = 0; i < 6; i++) {
                card = card.parentElement;
                if (!card) break;

                const className = card.className || '';
                const hasImage = card.querySelector('img');

                if (hasImage && (className.match(/\bmb\b/) || className.match(/\bmbtm\b/))) {
                    if (!seen.has(card)) {
                        seen.add(card);
                        videoCards.push(card);
                    }
                    break;
                }
            }
        });

        return videoCards;
    }

    async function fetchPage(pageNum) {
        const url = pageNum === 1 ? getBaseUrl() : `${getBaseUrl()}${pageNum}/`;
        addDebug(`Fetching: ${url}`);

        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc;
        } catch (error) {
            addDebug(`ERROR fetching page ${pageNum}: ${error.message}`);
            return null;
        }
    }

    function extractVideos(doc) {
        const videoLinks = doc.querySelectorAll('a[href*="/video-"]');
        addDebug(`Found ${videoLinks.length} video links in document`);

        if (videoLinks.length === 0) return [];

        const videoElements = [];
        const seen = new Set();

        videoLinks.forEach(link => {
            let videoItem = link;

            for (let i = 0; i < 6; i++) {
                videoItem = videoItem.parentElement;
                if (!videoItem) break;

                const className = videoItem.className || '';
                const hasImage = videoItem.querySelector('img');

                if (hasImage && (className.match(/\bmb\b/) || className.match(/\bmbtm\b/))) {
                    const videoUrl = link.href;
                    if (!seen.has(videoUrl)) {
                        seen.add(videoUrl);
                        videoElements.push(videoItem);
                    }
                    break;
                }
            }
        });

        addDebug(`Extracted ${videoElements.length} unique video card elements`);
        return videoElements;
    }

    function hidePagination() {
        const paginationSelectors = [
            '.pagination',
            '[class*="paginat"]',
            '[class*="pages"]',
            'nav[role="navigation"]'
        ];

        paginationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });

        const bottomLinks = document.querySelectorAll('a');
        bottomLinks.forEach(link => {
            const text = link.textContent.trim().toUpperCase();
            if (text === 'NEXT' || text === '»' || text === 'PREVIOUS' || text === '«') {
                const parent = link.parentElement;
                if (parent && parent.querySelectorAll('a').length > 3) {
                    parent.style.display = 'none';
                }
            }
        });

        addDebug('Pagination hidden');
    }

    async function loadAllVideos() {
        if (isLoading) return;

        isLoading = true;
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        startBtn.textContent = 'Loading...';

        debugText.innerHTML = '';
        updateStatus('Starting...', '#2196F3');

        let totalPages = getTotalPages();
        const currentPage = getCurrentPage();

        addDebug(`Current page: ${currentPage}`);
        addDebug(`Initial total pages detected: ${totalPages}`);

        if (currentPage !== 1) {
            addDebug('Not on page 1, redirecting...');
            window.location.href = getBaseUrl();
            return;
        }

        // Get all current videos and find where to insert new ones
        const currentVideos = getAllCurrentVideos();
        totalVideosLoaded = currentVideos.length;

        if (currentVideos.length === 0) {
            addDebug('ERROR: Could not find any video cards on page');
            updateStatus('❌ Error: No videos found', '#f44336');
            isLoading = false;
            return;
        }

        addDebug(`Found ${currentVideos.length} existing video cards`);

        // Get the last video card to use as insertion point
        const lastVideo = currentVideos[currentVideos.length - 1];
        const insertionParent = lastVideo.parentElement;

        addDebug(`Will insert after: <${lastVideo.tagName} class="${lastVideo.className}">`);
        addDebug(`Insertion parent: <${insertionParent.tagName} class="${insertionParent.className || 'none'}">`);

        // Track seen URLs
        const seenVideoUrls = new Set();
        currentVideos.forEach(video => {
            const link = video.querySelector('a[href*="/video-"]');
            if (link) seenVideoUrls.add(link.href);
        });

        hidePagination();

        // Fetch and insert videos from other pages
        let page = 2;
        let consecutiveEmptyPages = 0;
        let addedFromPage = 0;
        let lastInsertedVideo = lastVideo;

        while (consecutiveEmptyPages < 2) {
            updateStatus('Loading...', '#4CAF50');
            updateProgress(page, Math.max(totalPages, page));

            const doc = await fetchPage(page);
            if (!doc) {
                addDebug(`ERROR fetching page ${page}`);
                consecutiveEmptyPages++;
                page++;
                continue;
            }

            const videos = extractVideos(doc);
            addedFromPage = 0;

            // Insert each new video after the last one
            videos.forEach(video => {
                const link = video.querySelector('a[href*="/video-"]');
                if (link && !seenVideoUrls.has(link.href)) {
                    seenVideoUrls.add(link.href);
                    const clone = video.cloneNode(true);

                    // Insert after the last video
                    if (lastInsertedVideo.nextSibling) {
                        insertionParent.insertBefore(clone, lastInsertedVideo.nextSibling);
                    } else {
                        insertionParent.appendChild(clone);
                    }

                    lastInsertedVideo = clone;
                    addedFromPage++;
                    totalVideosLoaded++;
                }
            });

            addDebug(`Page ${page}: Found ${videos.length} videos, added ${addedFromPage} new (${videos.length - addedFromPage} duplicates)`);

            if (addedFromPage === 0) {
                addDebug(`Page ${page} has no new videos`);
                consecutiveEmptyPages++;
            } else {
                consecutiveEmptyPages = 0;
            }

            page++;

            if (page > 500) {
                addDebug('Reached safety limit of 500 pages');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const actualPages = page - consecutiveEmptyPages - 1;
        updateStatus('✓ Complete!', '#4CAF50');
        progressText.textContent = `Loaded ${totalVideosLoaded} unique videos from ${actualPages} pages`;
        progressFill.style.width = '100%';
        addDebug(`DONE! Total unique videos: ${totalVideosLoaded} from ${actualPages} pages`);

        hidePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        sortBtn.disabled = false;
        sortBtn.style.opacity = '1';

        isLoading = false;
    }

    function sortVideosByDuration() {
        addDebug('Starting sort by duration...');
        updateStatus('Sorting...', '#2196F3');

        const allVideos = getAllCurrentVideos();

        if (allVideos.length === 0) {
            addDebug('ERROR: No videos found to sort');
            return;
        }

        addDebug(`Found ${allVideos.length} videos to sort`);

        // Get the parent container - use the first video's parent
        const parent = allVideos[0].parentElement;
        addDebug(`Parent container: <${parent.tagName} class="${parent.className || 'none'}">`);

        // Extract duration from each video
        const videosWithDuration = allVideos.map(el => {
            // Look for duration in multiple places
            let durationText = null;

            // Method 1: Look for duration class
            const durationEl = el.querySelector('[class*="dur"]') || el.querySelector('[class*="time"]');
            if (durationEl) {
                durationText = durationEl.textContent.trim();
            }

            // Method 2: Look for text that matches time pattern anywhere
            if (!durationText) {
                const allText = el.textContent;
                const match = allText.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
                if (match) {
                    durationText = match[0];
                }
            }

            // Method 3: Look in overlay divs
            if (!durationText) {
                const overlays = el.querySelectorAll('div');
                for (let overlay of overlays) {
                    const text = overlay.textContent.trim();
                    if (/^\d{1,2}:\d{2}$/.test(text) || /^\d{1,2}:\d{2}:\d{2}$/.test(text)) {
                        durationText = text;
                        break;
                    }
                }
            }

            let duration = 0;
            let timeText = 'Unknown';

            if (durationText) {
                timeText = durationText;
                const timeMatch = durationText.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
                if (timeMatch) {
                    if (timeMatch[3]) {
                        // Format: HH:MM:SS
                        const hours = parseInt(timeMatch[1]);
                        const minutes = parseInt(timeMatch[2]);
                        const seconds = parseInt(timeMatch[3]);
                        duration = hours * 3600 + minutes * 60 + seconds;
                    } else {
                        // Format: MM:SS
                        const minutes = parseInt(timeMatch[1]);
                        const seconds = parseInt(timeMatch[2]);
                        duration = minutes * 60 + seconds;
                    }
                }
            }

            return { element: el, duration, timeText };
        });

        // Log some samples
        addDebug(`Sample durations: ${videosWithDuration.slice(0, 5).map(v => v.timeText).join(', ')}`);

        // Sort by duration (longest first)
        videosWithDuration.sort((a, b) => b.duration - a.duration);

        const longest = videosWithDuration[0];
        const shortest = videosWithDuration[videosWithDuration.length - 1];
        addDebug(`Longest: ${longest.timeText} (${longest.duration}s)`);
        addDebug(`Shortest: ${shortest.timeText} (${shortest.duration}s)`);

        // Remove all videos from parent first
        videosWithDuration.forEach(item => {
            if (item.element.parentElement === parent) {
                parent.removeChild(item.element);
            }
        });

        // Re-append in sorted order
        videosWithDuration.forEach(item => {
            parent.appendChild(item.element);
        });

        addDebug('Videos re-ordered in parent');
        updateStatus('✓ Sorted by duration!', '#4CAF50');

        // Scroll to top to see the longest videos
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    // Event listeners
    startBtn.addEventListener('click', loadAllVideos);
    sortBtn.addEventListener('click', sortVideosByDuration);
    closeBtn.addEventListener('click', () => {
        controlPanel.style.display = 'none';
    });

    // Initialize
    function init() {
        const totalPages = getTotalPages();
        updateStatus('Ready', '#2196F3');
        progressText.textContent = `Found ${totalPages} page${totalPages > 1 ? 's' : ''} (will load all)`;

        if (totalPages > 1) {
            addDebug('Auto-starting in 2 seconds...');
            setTimeout(loadAllVideos, 2000);
        } else {
            progressText.textContent = 'Checking for more pages...';
            addDebug('Only 1 page detected, but will check for more...');
            setTimeout(loadAllVideos, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();