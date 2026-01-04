// ==UserScript==
// @name         Vector LMS Video Auto-Completer
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Auto-complete videos on Vector LMS training pages with timer
// @author       savetheplanet07, wu5bocheng, Updated by: Mehdi Mamas
// @match        *://*.vectorlmsedu.com/*
// @license      MIT
// @match        *://*.vectorlmsedu.com/training/launch/course_work/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551802/Vector%20LMS%20Video%20Auto-Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/551802/Vector%20LMS%20Video%20Auto-Completer.meta.js
// ==/UserScript==

console.log("████████████████████████████████████████████████████████");
console.log("██ VECTOR LMS AUTO-COMPLETER SCRIPT LOADED ██");
console.log("████████████████████████████████████████████████████████");
console.log("Script version: 2.4");
console.log("Current URL:", window.location.href);
console.log("Document ready state:", document.readyState);

(function() {
    'use strict';

    console.log("IIFE started");

    const STORAGE_KEY = 'vectorlms_autocomplete_active';
    const COURSE_KEY = 'vectorlms_current_course';

    let timerInterval = null;
    let remainingSeconds = 0;

    function asyncWaitSeconds(seconds) {
        console.log(`asyncWaitSeconds called with ${seconds} seconds`);
        return new Promise((resolve, reject) => {
            remainingSeconds = seconds;
            updateTimerDisplay();

            timerInterval = setInterval(() => {
                remainingSeconds--;
                updateTimerDisplay();

                if (remainingSeconds <= 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(timerInterval);
                resolve();
            }, seconds * 1000);
        });
    }

    function updateTimerDisplay() {
        let timerDiv = document.getElementById('vectorlms-timer');
        if (!timerDiv) {
            return;
        }

        if (remainingSeconds > 0) {
            let minutes = Math.floor(remainingSeconds / 60);
            let seconds = remainingSeconds % 60;
            timerDiv.innerHTML = `⏱️ Time remaining: ${minutes}m ${seconds}s`;
            timerDiv.style.display = 'block';
        } else {
            timerDiv.style.display = 'none';
        }
    }

    function getCourseId() {
        let match = window.location.pathname.match(/\/course_work\/([^\/]+)/);
        let courseId = match ? match[1] : null;
        console.log("Course ID:", courseId);
        return courseId;
    }

    function isAutoCompleteActive() {
        try {
            let active = GM_getValue(STORAGE_KEY, false);
            let storedCourseId = GM_getValue(COURSE_KEY, null);
            let currentCourseId = getCourseId();

            console.log(`Auto-complete status check:`, {
                active: active,
                storedCourseId: storedCourseId,
                currentCourseId: currentCourseId,
                result: active && storedCourseId === currentCourseId
            });

            return active && storedCourseId === currentCourseId;
        } catch (e) {
            console.error("Error checking auto-complete status:", e);
            return false;
        }
    }

    function startAutoComplete() {
        try {
            let courseId = getCourseId();
            GM_setValue(STORAGE_KEY, true);
            GM_setValue(COURSE_KEY, courseId);
            console.log(`✓ Auto-complete activated for course: ${courseId}`);
        } catch (e) {
            console.error("Error starting auto-complete:", e);
        }
    }

    function stopAutoComplete() {
        try {
            GM_deleteValue(STORAGE_KEY);
            GM_deleteValue(COURSE_KEY);
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            console.log('✓ Auto-complete stopped');
        } catch (e) {
            console.error("Error stopping auto-complete:", e);
        }
    }

    async function main() {
        console.log("════════════════════════════════════════════════");
        console.log("MAIN FUNCTION STARTED");
        console.log("════════════════════════════════════════════════");

        // Wait for page to fully load
        console.log("Waiting 2 seconds for page to load...");
        await asyncWaitSeconds(2);

        let TOC_items = document.getElementsByClassName("TOC_item");
        console.log(`Found ${TOC_items.length} TOC items`);

        if (TOC_items.length === 0) {
            console.log("⚠️ No TOC items found - may not be on course overview page");
            return;
        }

        let TOC_unwatched_videos = [];

        // Scrape the page for video data
        for (let i = 0; i < TOC_items.length; i++) {
            try {
                let data_entry = {};
                data_entry.element = TOC_items[i];

                // Check if it's a video by looking for the play icon
                data_entry.isVideo = TOC_items[i].querySelector(".fa-play") != null;

                // Get the href - locked items won't have one
                let href = TOC_items[i].getAttribute("href");

                // Skip locked items (no href) or non-videos
                if (!href || !data_entry.isVideo) {
                    continue;
                }

                data_entry.href = href;
                data_entry.title = TOC_items[i].querySelector(".lead").innerText;

                let len = href.split("?")[0].split("/").length;
                data_entry.work_id = href.split("?")[0].split("/")[len - 1];
                data_entry.item_id = href.split("?")[0].split("/")[len - 2];

                // Extract video duration
                let timeText = TOC_items[i].querySelector(".span_link").innerText;
                let timeMatch = timeText.match(/(\d+)\s*Minutes?/i);
                data_entry.time_min = timeMatch ? parseInt(timeMatch[1]) + 0.5 : 1;

                data_entry.completed = false;
                TOC_unwatched_videos.push(data_entry);
                console.log(`✓ Added video: ${data_entry.title} (${data_entry.time_min} min)`);
            } catch (err) {
                console.error("Error scraping TOC item:", err);
            }
        }

        console.log(`════════════════════════════════════════════════`);
        console.log(`📊 SUMMARY: Found ${TOC_unwatched_videos.length} unwatched videos`);
        console.log(`════════════════════════════════════════════════`);

        if (TOC_unwatched_videos.length === 0) {
            console.log("🎉 All videos completed! Stopping auto-complete.");
            stopAutoComplete();
            updateButton(true);
            return;
        }

        // Process the first unwatched video
        let unwatched_video = TOC_unwatched_videos[0];
        let school_host = window.location.host;

        console.log(`▶️ Processing video: ${unwatched_video.title}`);
        updateStatusDisplay(`Processing: ${unwatched_video.title}`, `${TOC_unwatched_videos.length} videos remaining`);

        // Request the tracking start
        let tracking_start_url = `https://${school_host}/rpc/v2/json/training/tracking_start?course_item_id=${unwatched_video.item_id}&course_work_id=${unwatched_video.work_id}`;
        console.log(`📡 Calling tracking_start...`);

        const tracking_start_response = await fetch(tracking_start_url);
        let tracking_start_data = await tracking_start_response.json();
        unwatched_video.work_hist_id = tracking_start_data.course_work_hist_id;

        console.log(`✓ Video tracking started. Work hist ID: ${unwatched_video.work_hist_id}`);

        // Delay for video length
        let waitTime = unwatched_video.time_min * 60;
        console.log(`⏱️ Waiting ${waitTime} seconds (${unwatched_video.time_min} minutes)...`);
        updateStatusDisplay(`Watching: ${unwatched_video.title}`, `${TOC_unwatched_videos.length} videos remaining`);
        await asyncWaitSeconds(waitTime);

        // Request the tracking finish
        let tracking_finish_url = `https://${school_host}/rpc/v2/json/training/tracking_finish?course_work_hist_id=${unwatched_video.work_hist_id}&_=${(Date.now() + unwatched_video.time_min * 60 * 1000).toString()}`;
        console.log(`📡 Calling tracking_finish...`);

        const tracking_finish_response = await fetch(tracking_finish_url);
        let tracking_finish_data = await tracking_finish_response.json();

        console.log(`Tracking finish response:`, tracking_finish_data);

        // 0 is completed, 1 is not completed
        unwatched_video.completed = !(tracking_finish_data.tracking_status);

        if (unwatched_video.completed) {
            console.log(`✅ COMPLETED: ${unwatched_video.title}`);
            console.log("🔄 Reloading page to continue with next video...");
            updateStatusDisplay(`✓ Completed: ${unwatched_video.title}`, 'Reloading...');
            setTimeout(() => location.reload(), 1000);
        } else {
            console.log(`❌ FAILED: ${unwatched_video.title}`);
            console.log("Stopping auto-complete due to failure.");
            stopAutoComplete();
            updateButton(false);
            updateStatusDisplay('Failed to complete video', 'Auto-complete stopped');
        }
    }

    function updateStatusDisplay(mainText, subText) {
        let statusDiv = document.getElementById('vectorlms-status');
        if (!statusDiv) {
            return;
        }

        statusDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${mainText}</div>
            <div style="font-size: 12px; opacity: 0.9;">${subText}</div>
        `;
    }

    function updateButton(completed) {
        let button = document.getElementById('vectorlms-autocomplete-btn');
        if (!button) {
            return;
        }

        if (isAutoCompleteActive()) {
            button.innerHTML = '⏸ Stop Auto-Complete';
            button.style.background = '#dc3545';
        } else if (completed) {
            button.innerHTML = '✓ All Videos Completed!';
            button.style.background = '#28a745';
            button.disabled = false;
        } else {
            button.innerHTML = '▶ Start Auto-Complete';
            button.style.background = '#007bff';
            button.disabled = false;
        }
    }

    function createUI() {
        console.log("════════════════════════════════════════════════");
        console.log("CREATING UI ELEMENTS");
        console.log("════════════════════════════════════════════════");

        if (!document.body) {
            console.error("❌ document.body is null! Retrying in 500ms...");
            setTimeout(createUI, 500);
            return;
        }

        // Check if UI already exists
        if (document.getElementById('vectorlms-container')) {
            console.log("⚠️ UI already exists, skipping creation");
            return;
        }

        // Create container div
        console.log("Creating container div...");
        let container = document.createElement('div');
        container.id = 'vectorlms-container';
        container.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 999999 !important;
            font-family: Arial, sans-serif !important;
        `;

        // Create a button to start/stop the process
        let button = document.createElement('button');
        button.id = 'vectorlms-autocomplete-btn';
        button.innerHTML = isAutoCompleteActive() ? '⏸ Stop Auto-Complete' : '▶ Start Auto-Complete';
        button.style.cssText = `
            width: 100% !important;
            padding: 12px 20px !important;
            background: ${isAutoCompleteActive() ? '#dc3545' : '#007bff'} !important;
            color: white !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            font-size: 14px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            margin-bottom: 10px !important;
        `;

        // Create status display
        let statusDiv = document.createElement('div');
        statusDiv.id = 'vectorlms-status';
        statusDiv.style.cssText = `
            padding: 10px !important;
            background: white !important;
            color: #333 !important;
            border-radius: 5px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            margin-bottom: 10px !important;
            font-size: 13px !important;
            display: none !important;
            min-width: 250px !important;
        `;

        // Create timer display
        let timerDiv = document.createElement('div');
        timerDiv.id = 'vectorlms-timer';
        timerDiv.style.cssText = `
            padding: 10px !important;
            background: #fff3cd !important;
            color: #856404 !important;
            border-radius: 5px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            font-size: 14px !important;
            font-weight: bold !important;
            text-align: center !important;
            display: none !important;
            min-width: 250px !important;
        `;

        button.onclick = function() {
            console.log("🖱️ BUTTON CLICKED!");
            if (isAutoCompleteActive()) {
                stopAutoComplete();
                button.innerHTML = '▶ Start Auto-Complete';
                button.style.background = '#007bff';
                statusDiv.style.display = 'none';
                timerDiv.style.display = 'none';
            } else {
                startAutoComplete();
                button.disabled = true;
                button.innerHTML = '⏳ Starting...';
                statusDiv.style.display = 'block';
                main().then(() => {
                    console.log("✓ Main function completed");
                }).catch(err => {
                    console.error("❌ Error in main function:", err);
                    stopAutoComplete();
                    updateButton(false);
                    statusDiv.style.display = 'none';
                    timerDiv.style.display = 'none';
                });
            }
        };

        container.appendChild(button);
        container.appendChild(statusDiv);
        container.appendChild(timerDiv);
        document.body.appendChild(container);
        console.log("✅ UI CREATION COMPLETE!");

        // If auto-complete is active, automatically continue
        if (isAutoCompleteActive()) {
            console.log("🔄 Auto-complete is active, continuing automatically...");
            button.disabled = true;
            button.innerHTML = '⏳ Processing...';
            statusDiv.style.display = 'block';
            main().then(() => {
                console.log("✓ Main function completed");
            }).catch(err => {
                console.error("❌ Error in main function:", err);
                stopAutoComplete();
                updateButton(false);
                statusDiv.style.display = 'none';
                timerDiv.style.display = 'none';
            });
        } else {
            console.log("💡 Click the button to start auto-completing videos.");
        }
    }

    // Multiple attempts to ensure UI is created
    if (document.readyState === 'loading') {
        console.log("Document is loading, waiting for DOMContentLoaded...");
        document.addEventListener('DOMContentLoaded', function() {
            console.log("🎯 DOMContentLoaded event fired!");
            setTimeout(createUI, 500);
        });
    } else {
        console.log("Document already loaded");
        setTimeout(createUI, 500);
    }

    // Backup - also try on window.load
    window.addEventListener('load', function() {
        console.log("🎯 Window load event fired!");
        if (!document.getElementById('vectorlms-container')) {
            console.log("UI not found, creating now...");
            createUI();
        }
    });

})();