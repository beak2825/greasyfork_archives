// ==UserScript==
// @name         Douyin Live Chat & Stats Scraper
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Scrapes chat messages and current viewer count.
// @author       You
// @match        https://live.douyin.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559609/Douyin%20Live%20Chat%20%20Stats%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/559609/Douyin%20Live%20Chat%20%20Stats%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const API_URL = "http://192.168.2.114:8000/api/receive_comments";

    // === CSS SELECTORS ===
    const SEL_ROW = '.NkS2Invn';      // Chat row container
    const SEL_NAME = '.v8LY0gZF';     // Username class
    const SEL_CONTENT = '.cL385mHb';  // Content class
    const SEL_AUDIENCE = '[data-e2e="live-room-audience"]'; // Viewer count

    // Cache for deduplication
    const dedupCache = new Map();

    console.log(`%c[System] Scraper Started. Target: ${API_URL}`, "color: green; font-weight: bold");

    setInterval(() => {
        const batchData = [];
        const now = Date.now();

        // --- 1. Get Viewer Count ---
        let viewerCount = 0;
        try {
            let audienceEl = document.querySelector(SEL_AUDIENCE);
            if (audienceEl) {
                // Remove commas if present (e.g. "3,247") before parsing
                viewerCount = parseInt(audienceEl.innerText.replace(/,/g, ''), 10) || 0;
            }
        } catch (e) {
            console.error("Viewer Count Error:", e);
        }

        // --- 2. Process Chat Messages ---
        let rows = document.querySelectorAll(SEL_ROW);

        rows.forEach(div => {
            if (div.getAttribute('data-sent')) return;

            try {
                let nameEl = div.querySelector(SEL_NAME);
                let contentEl = div.querySelector(SEL_CONTENT);

                if (nameEl && contentEl) {
                    let rawName = nameEl.innerText.trim();
                    let rawContent = contentEl.innerText.trim();
                    let cleanName = rawName.replace(/[:：]$/, '').trim();

                    if (!cleanName || !rawContent) return;

                    let key = cleanName + "|" + rawContent;
                    if (dedupCache.has(key) && (now - dedupCache.get(key) < 30000)) {
                        div.setAttribute('data-sent', 'true');
                        return;
                    }

                    batchData.push({
                        "username": cleanName,
                        "content": rawContent,
                        "ts": now,
                        "viewers": viewerCount // Attach viewer count to every message
                    });

                    dedupCache.set(key, now);
                    div.setAttribute('data-sent', 'true');
                }
            } catch (e) {
                console.error("Parse Error:", e);
            }
        });

        // --- 3. Send Data (Even if only viewer count updated? No, only on chat) ---
        // Strategy: Only send if there are new chats.
        // If you want to send viewer stats even without chat, you'd need a separate logic.
        // For now, we attach it to chat messages.

        if (batchData.length > 0) {
            console.log(`%c[Sending] ${batchData.length} msg(s) | Viewers: ${viewerCount}`, "color: blue");

            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(batchData),
                onload: (res) => {},
                onerror: (err) => console.error(`[Network Error]`, err)
            });
        }

        // Cleanup cache
        for (let [k, t] of dedupCache) {
            if (now - t > 35000) dedupCache.delete(k);
        }

    }, 3000);

})();