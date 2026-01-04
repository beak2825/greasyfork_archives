// ==UserScript==
// @name         VectorLMS
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Vector LMS Auto Task Completion Script. Sequentially runs tracking_start and tracking_finish for each course_item (i.e., video) on the page used for vectorlmsedu.com
// @author       savetheplanet07, wu5bocheng
// @match        https://*.vectorlmsedu.com/training/launch/course_work/*
// @icon         https://cmu-pa.vectorlmsedu.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550080/VectorLMS.user.js
// @updateURL https://update.greasyfork.org/scripts/550080/VectorLMS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility function to wait for a specified number of seconds
    function asyncWaitSeconds(seconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    async function main() {
        // Get all TOC items
        const TOC_items = document.getElementsByClassName("TOC_item");
        const TOC_unwatched_videos = [];

        // Scrape the /training/launch/course_work/COURSEID page for video data
        for (let i = 0; i < TOC_items.length; i++) {
            try {
                const item = TOC_items[i];
                const isVideo = item.querySelector(".fa-play") !== null;
                if (!isVideo) continue; // Skip non-video items

                // Check if the video is already completed
                const isCompleted = item.querySelector(".fa-check") !== null;
                if (isCompleted) {
                    console.log(`Skipping already completed video: ${item.querySelector(".lead")?.innerText || 'Unknown'}`);
                    continue;
                }

                const data_entry = {};
                data_entry.element = item;
                data_entry.href = item.getAttribute("href");
                data_entry.title = item.querySelector(".lead")?.innerText || `Video ${i + 1}`;
                
                // Extract work_id and item_id from href
                const hrefParts = item.getAttribute("href").split("?")[0].split("/");
                data_entry.work_id = hrefParts[hrefParts.length - 1];
                data_entry.item_id = hrefParts[hrefParts.length - 2];

                // Parse video duration safely
                const durationElement = item.querySelector(".span_link")?.innerText;
                let time_min = 0;
                if (durationElement) {
                    const match = durationElement.match(/(\d+)/);
                    time_min = match ? parseInt(match[1]) + 0.5 : 0.5; // Default to 0.5 if parsing fails
                }
                data_entry.time_min = time_min;
                data_entry.completed = false;

                TOC_unwatched_videos.push(data_entry);
            } catch (err) {
                console.error(`Error scraping TOC item ${i + 1}:`, err);
            }
        }

        if (TOC_unwatched_videos.length === 0) {
            console.log("No unwatched videos found.");
            return;
        }

        // Process each unwatched video
        for (const video of TOC_unwatched_videos) {
            try {
                const school_host = window.location.host;
                // Request tracking start
                const tracking_start_url = `https://${school_host}/rpc/v2/json/training/tracking_start?course_item_id=${video.item_id}&course_work_id=${video.work_id}`;
                const startResponse = await fetch(tracking_start_url, { method: 'GET' });
                
                if (!startResponse.ok) {
                    throw new Error(`Tracking start failed for ${video.title}: ${startResponse.status}`);
                }

                const startData = await startResponse.json();
                if (!startData.course_work_hist_id) {
                    throw new Error(`No course_work_hist_id returned for ${video.title}`);
                }

                video.work_hist_id = startData.course_work_hist_id;
                console.log(`Video time tracking started for: ${video.title}`);

                // Wait for the length of the video
                console.log(`Waiting for ${video.time_min * 60} seconds...`);
                await asyncWaitSeconds(video.time_min * 60);

                // Request tracking finish
                const tracking_finish_url = `https://${school_host}/rpc/v2/json/training/tracking_finish?course_work_hist_id=${video.work_hist_id}&_=${Date.now()}`;
                const finishResponse = await fetch(tracking_finish_url, { method: 'GET' });
                
                if (!finishResponse.ok) {
                    throw new Error(`Tracking finish failed for ${video.title}: ${finishResponse.status}`);
                }

                const finishData = await finishResponse.json();
                video.completed = finishData.tracking_status === 0; // 0 means completed

                if (video.completed) {
                    console.log(`Completed video: ${video.title}`);
                    // Update DOM to reflect completion
                    try {
                        const iconSquare = video.element.querySelector(".IconSquare");
                        if (iconSquare) {
                            iconSquare.innerHTML = `
                                <div style="height: 33px; width: 33px" class="IconSquare u-border-radius-4 u-overflow-hidden u-pos-relative" aria-hidden="true">
                                    <span><div class="color-overlay u-bg-tertiary-light"></div></span>
                                    <div class="u-absolute-center u-text-center">
                                        <span class="fa fa-check fa-fw u-color-tertiary"></span>
                                    </div>
                                </div>`;
                        }

                        const badge = video.element.querySelector(".hidden-xs");
                        if (badge) {
                            badge.innerHTML = `
                                <div class="badge u-text-capitalize u-border-radius-10 u-m-0 u-bg-tertiary-light u-color-tertiary-darker">
                                    Completed
                                </div>`;
                        }
                    } catch (err) {
                        console.error(`Error updating DOM for ${video.title}:`, err);
                    }
                } else {
                    console.warn(`Failed to complete video: ${video.title}`);
                }
            } catch (err) {
                console.error(`Error processing video ${video.title}:`, err);
            }
        }

        // Reload page only after all videos are processed
        console.log("All videos processed. Reloading page...");
        location.reload();
    }

    // Execute main function and handle any top-level errors
    main().catch((err) => {
        console.error("Script execution failed:", err);
    });
})();