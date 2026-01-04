// ==UserScript==
// @name         4chan Thumbnail Classifier (Advanced)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Slowly classifies 4chan thumbnails, saves results, and adds a UI to view them.
// @author       wormpilled
// @match        https://boards.4chan.org/g/catalog
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      workers.dev
// @downloadURL https://update.greasyfork.org/scripts/548543/4chan%20Thumbnail%20Classifier%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548543/4chan%20Thumbnail%20Classifier%20%28Advanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const WORKER_URL = 'https://image-classification-worker.YOUUUUUUUUU.workers.dev/'; // !!! MAKE SURE THIS IS CORRECT !!!
    const PROCESSING_DELAY_MS = 500; // Delay in milliseconds between each API call.
    const STORAGE_PREFIX = '4chan_classifier_'; // Used for localStorage keys.

    // --- STYLES ---
    GM_addStyle(`
        .thumb.classified {
            border: 3px solid #FF4500; /* A nice orange-red border */
            box-sizing: border-box;
        }
        .classification-icon {
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
            filter: grayscale(1);
            opacity: 0.6;
            transition: all 0.2s ease-in-out;
        }
        .classification-icon:hover {
            filter: grayscale(0);
            opacity: 1;
            transform: scale(1.2);
        }
        #classifier-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #classifier-popup-content {
            background: #282c34;
            color: #abb2bf;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #3e4451;
            min-width: 300px;
            text-align: left;
        }
        #classifier-popup-content h3 {
            margin-top: 0;
            border-bottom: 1px solid #3e4451;
            padding-bottom: 10px;
        }
        #classifier-popup-content ul {
            list-style: none;
            padding: 0;
        }
        #classifier-popup-content li {
            margin-bottom: 5px;
        }
    `);

    // --- CORE LOGIC ---

    // Function to show classification results in a popup
    function showResultsPopup(results, threadId) {
        // Remove any existing popup
        const existingPopup = document.getElementById('classifier-popup-overlay');
        if (existingPopup) existingPopup.remove();

        const overlay = document.createElement('div');
        overlay.id = 'classifier-popup-overlay';

        const content = document.createElement('div');
        content.id = 'classifier-popup-content';
        content.innerHTML = `<h3>Classification for #${threadId}</h3>`;

        const list = document.createElement('ul');
        results.forEach(result => {
            const listItem = document.createElement('li');
            const scorePercent = (result.score * 100).toFixed(1);
            listItem.textContent = `${result.label}: ${scorePercent}%`;
            list.appendChild(listItem);
        });
        content.appendChild(list);
        overlay.appendChild(content);

        // Click anywhere on the overlay to close it
        overlay.addEventListener('click', () => overlay.remove());

        document.body.appendChild(overlay);
    }

    // Updates the UI for a given thread (adds border and icon)
    function updateThreadUI(thread, results) {
        const thumb = thread.querySelector('img.thumb');
        const meta = thread.querySelector('.meta');
        const threadId = thread.id.replace('thread-', '');

        if (!thumb || !meta) return;

        // 1. Add the red border
        thumb.classList.add('classified');

        // 2. Add the clickable icon
        if (!meta.querySelector('.classification-icon')) {
            const icon = document.createElement('span');
            icon.className = 'classification-icon';
            icon.textContent = '🏷️'; // Tag emoji
            icon.title = 'View Classification Tags';
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showResultsPopup(results, threadId);
            });
            meta.appendChild(icon);
        }
    }

    // Fetches classification from the worker and stores it
    async function classifyAndStore(thread) {
        const thumb = thread.querySelector('img.thumb');
        const threadId = thread.id.replace('thread-', '');
        const storageKey = STORAGE_PREFIX + threadId;

        return new Promise((resolve, reject) => {
            console.log(`[Classifier] Processing thread #${threadId}...`);
            GM_xmlhttpRequest({
                method: 'POST',
                url: WORKER_URL,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ imageUrl: thumb.src }),
                onload: async function(response) {
                    if (response.status === 200) {
                        const results = JSON.parse(response.responseText);
                        await GM_setValue(storageKey, JSON.stringify(results)); // Store results
                        console.log(`[Classifier] SUCCESS for #${threadId}:`, results[0].label);
                        updateThreadUI(thread, results);
                        resolve();
                    } else {
                        console.error(`[Classifier] ERROR for #${threadId}: Worker returned status ${response.status}`);
                        reject();
                    }
                },
                onerror: function(response) {
                    console.error(`[Classifier] FATAL for #${threadId}: Request failed.`);
                    reject();
                }
            });
        });
    }

    // Main function to start the process
    async function initializeClassifier() {
        console.log('[Classifier] Initializing...');
        const allThreads = document.querySelectorAll('.thread');
        const threadsToProcess = [];

        for (const thread of allThreads) {
            const threadId = thread.id.replace('thread-', '');
            const storageKey = STORAGE_PREFIX + threadId;
            const storedResults = await GM_getValue(storageKey, null);

            if (storedResults) {
                // Already classified, just update the UI from storage
                console.log(`[Classifier] Loading #${threadId} from storage.`);
                updateThreadUI(thread, JSON.parse(storedResults));
            } else {
                // Not classified, add to the queue
                threadsToProcess.push(thread);
            }
        }

        console.log(`[Classifier] Found ${threadsToProcess.length} new thumbnails to classify.`);

        // Process the queue slowly
        for (const thread of threadsToProcess) {
            try {
                await classifyAndStore(thread);
                // Wait for the specified delay before the next iteration
                await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY_MS));
            } catch (error) {
                console.warn('[Classifier] An error occurred, continuing to next item.');
            }
        }
        console.log('[Classifier] All new thumbnails have been processed.');
    }

    // Run the script after the page has loaded
    window.addEventListener('load', initializeClassifier);
})();