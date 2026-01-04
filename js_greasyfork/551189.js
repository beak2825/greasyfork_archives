// ==UserScript==
// @name         YouTube Live Chat Viewer Count Inserter Improved with API and Delay
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  Grab YouTube live viewers from YouTube Data API or channel iframe and insert count into live chat popout UI every 5 minutes with retries, fallback, and initial 30s delay
// @match        https://www.youtube.com/live_chat?is_popout=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551189/YouTube%20Live%20Chat%20Viewer%20Count%20Inserter%20Improved%20with%20API%20and%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/551189/YouTube%20Live%20Chat%20Viewer%20Count%20Inserter%20Improved%20with%20API%20and%20Delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "AIzaSyDkwkQGyNH-pDxSIAg9qfDQRiPQm4OFxeE";
    const CHANNEL_ID = "UC0R8dnn-IrgBERm18tNiyjg";
    const STREAM_URL = "https://www.youtube.com/@picklesggs/live";

    // Insert viewer count text in UI
    function insertViewerCountElement(text) {
        let container = document.querySelector("yt-sort-filter-sub-menu-renderer");
        if (!container) return;

        let existing = document.getElementById("tampermonkey-live-viewers");
        if (!existing) {
            existing = document.createElement("div");
            existing.id = "tampermonkey-live-viewers";
            existing.style.cssText = `
            color: white;
            font-weight: 500;
            font-size: 14px;
            justify-content: center;
            align-items: center;
            display: inline-block;
            background: grey;
            margin: 0px 50px;
            white-space: nowrap;
            padding: 10px;
            border-radius: 20px;
        `;
            container.appendChild(existing);
        }
        existing.textContent = "Live Viewers: " + (text || "N/A");
    }

    // Step 1: Get live video ID from channel's live stream using YouTube Data API
    async function getLiveVideoId() {
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                return data.items[0].id.videoId;
            }
        } catch (e) {
            console.error("Error fetching live video ID from API:", e);
        }
        return null;
    }

    // Step 2: Get concurrent viewers from live video using YouTube Data API
    async function getLiveViewerCountFromAPI(videoId) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,liveStreamingDetails&id=${videoId}&key=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                let liveDetails = data.items[0].liveStreamingDetails;
                if (liveDetails && liveDetails.concurrentViewers) {
                    return liveDetails.concurrentViewers;
                }
            }
        } catch (e) {
            console.error("Error fetching live viewers from API:", e);
        }
        return null;
    }

    // Main function to update viewer count prioritizing API fallback to iframe
    async function updateViewerCount() {
        let videoId = await getLiveVideoId();
        if (videoId) {
            let viewers = await getLiveViewerCountFromAPI(videoId);
            if (viewers !== null) {
                insertViewerCountElement(viewers);
                return;
            }
        }
    }

    // Run initial update after 30 seconds delay, then every 5 minutes
    setTimeout(() => {
        updateViewerCount();
        setInterval(updateViewerCount, 5 * 60 * 1000); // every 5 minutes
    }, 15000);

})();