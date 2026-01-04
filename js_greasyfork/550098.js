// ==UserScript==
// @name         SafeSchools Video Skipper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skips videos by simulating completion with manual 'Skip Video' buttons for SafeSchools (Vector LMS). Optimized for performance.
// @author       Grok Assistant
// @match        https://northwarren-nj.safeschools.com/training/*
// @match        https://*.safeschools.com/training/*
// @icon         https://www.safeschools.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550098/SafeSchools%20Video%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/550098/SafeSchools%20Video%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to wait for a specified number of seconds
    function asyncWaitSeconds(seconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    // Utility to debounce a function
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

    // Function to add a Skip Video button to each video item
    function addSkipVideoButton(videoItem, videoData) {
        if (videoItem.querySelector('.skip-video-btn')) return; // Avoid duplicates
        const skipBtn = document.createElement('button');
        skipBtn.className = 'skip-video-btn';
        skipBtn.textContent = 'Skip Video';
        skipBtn.style.cssText = 'margin-left: 10px; background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
        skipBtn.onclick = async () => {
            try {
                skipBtn.disabled = true;
                skipBtn.textContent = 'Skipping...';
                const school_host = window.location.host;
                const startUrl = `https://${school_host}/rpc/v2/json/training/tracking_start?course_item_id=${videoData.item_id}&course_work_id=${videoData.work_id}`;
                const startResponse = await fetch(startUrl);
                if (!startResponse.ok) throw new Error(`Start failed: ${startResponse.status}`);
                const startData = await startResponse.json();
                if (!startData.course_work_hist_id) throw new Error('No hist_id');
                videoData.work_hist_id = startData.course_work_hist_id;
                console.log(`Started tracking for: ${videoData.title}`);

                // Minimal delay for manual skip
                await asyncWaitSeconds(2);

                const finishUrl = `https://${school_host}/rpc/v2/json/training/tracking_finish?course_work_hist_id=${videoData.work_hist_id}&_=${Date.now()}`;
                const finishResponse = await fetch(finishUrl);
                if (!finishResponse.ok) throw new Error(`Finish failed: ${finishResponse.status}`);
                const finishData = await finishResponse.json();
                const completed = finishData.tracking_status === 0;

                if (completed) {
                    console.log(`Completed: ${videoData.title}`);
                    const iconSquare = videoItem.querySelector('.IconSquare');
                    if (iconSquare) {
                        iconSquare.innerHTML = `<span class="fa fa-check fa-fw u-color-tertiary"></span>`;
                    }
                    skipBtn.textContent = 'Completed';
                    skipBtn.style.background = 'green';
                } else {
                    console.warn(`Failed to complete: ${videoData.title}`);
                    skipBtn.textContent = 'Failed';
                    skipBtn.style.background = 'red';
                }
            } catch (err) {
                console.error(`Error skipping ${videoData.title}:`, err);
                skipBtn.textContent = 'Error';
                skipBtn.style.background = 'red';
            }
        };
        videoItem.appendChild(skipBtn);
    }

    // Function to process videos with retry limit
    async function skipVideos(retryCount = 0, maxRetries = 5) {
        if (retryCount >= maxRetries) {
            console.log('Max retries reached. No TOC items found.');
            return;
        }

        const TOC_items = Array.from(document.getElementsByClassName('TOC_item'));
        if (TOC_items.length === 0) {
            console.log('No TOC items found. Retrying...');
            setTimeout(() => skipVideos(retryCount + 1, maxRetries), 2000);
            return;
        }

        const unwatched_videos = [];
        for (const item of TOC_items) {
            try {
                const isVideo = item.querySelector('.fa-play') !== null;
                if (!isVideo) continue;

                const isCompleted = item.querySelector('.fa-check') !== null;
                if (isCompleted) {
                    console.log(`Skipping completed video: ${item.querySelector('.lead')?.innerText || 'Unknown'}`);
                    continue;
                }

                const data_entry = {};
                data_entry.element = item;
                data_entry.href = item.getAttribute('href');
                data_entry.title = item.querySelector('.lead')?.innerText || `Video ${unwatched_videos.length + 1}`;
                const hrefParts = data_entry.href.split('?')[0].split('/');
                data_entry.work_id = hrefParts[hrefParts.length - 1];
                data_entry.item_id = hrefParts[hrefParts.length - 2];
                const durationElement = item.querySelector('.span_link')?.innerText;
                data_entry.time_min = 0.5;
                if (durationElement) {
                    const match = durationElement.match(/(\d+)/);
                    data_entry.time_min = match ? parseInt(match[1]) + 0.5 : 0.5;
                }

                addSkipVideoButton(item, data_entry);
                unwatched_videos.push(data_entry);
            } catch (err) {
                console.error(`Error scraping TOC item:`, err);
            }
        }

        if (unwatched_videos.length === 0) {
            console.log('No unwatched videos found.');
            return;
        }

        console.log(`Found ${unwatched_videos.length} videos to process.`);

        // Process videos with a delay to prevent blocking
        for (const video of unwatched_videos) {
            try {
                const school_host = window.location.host;
                const startUrl = `https://${school_host}/rpc/v2/json/training/tracking_start?course_item_id=${video.item_id}&course_work_id=${video.work_id}`;
                const startResponse = await fetch(startUrl);
                if (!startResponse.ok) throw new Error(`Start failed: ${startResponse.status}`);
                const startData = await startResponse.json();
                if (!startData.course_work_hist_id) throw new Error('No hist_id');
                video.work_hist_id = startData.course_work_hist_id;
                console.log(`Started tracking for: ${video.title}`);

                // Wait for video duration
                console.log(`Waiting ${video.time_min * 60} seconds for: ${video.title}`);
                await asyncWaitSeconds(video.time_min * 60);

                const finishUrl = `https://${school_host}/rpc/v2/json/training/tracking_finish?course_work_hist_id=${video.work_hist_id}&_=${Date.now()}`;
                const finishResponse = await fetch(finishUrl);
                if (!finishResponse.ok) throw new Error(`Finish failed: ${finishResponse.status}`);
                const finishData = await finishResponse.json();
                const completed = finishData.tracking_status === 0;

                if (completed) {
                    console.log(`Completed: ${video.title}`);
                    const iconSquare = video.element.querySelector('.IconSquare');
                    if (iconSquare) {
                        iconSquare.innerHTML = `<span class="fa fa-check fa-fw u-color-tertiary"></span>`;
                    }
                    const skipBtn = video.element.querySelector('.skip-video-btn');
                    if (skipBtn) {
                        skipBtn.textContent = 'Completed';
                        skipBtn.style.background = 'green';
                    }
                } else {
                    console.warn(`Failed to complete: ${video.title}`);
                }

                // Yield to prevent blocking
                await asyncWaitSeconds(0.5);
            } catch (err) {
                console.error(`Error skipping ${video.title}:`, err);
            }
        }

        // Delayed reload to ensure DOM updates
        setTimeout(() => {
            console.log('All videos processed. Reloading page...');
            location.reload();
        }, 3000);
    }

    // Debounced skipVideos to prevent MutationObserver overload
    const debouncedSkipVideos = debounce(skipVideos, 1000);

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => debouncedSkipVideos());
    } else {
        debouncedSkipVideos();
    }

    // Observe for dynamic content with debouncing
    const observer = new MutationObserver(debouncedSkipVideos);
    observer.observe(document.body, { childList: true, subtree: true });
})();