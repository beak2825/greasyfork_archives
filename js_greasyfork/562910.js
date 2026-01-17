// ==UserScript==
// @name         IGG Games Infinite Scroll
// @namespace    github.com/GreenMan36
// @version      1.0.2
// @description  Infinite scroll for igg-games
// @author       GreenMan36
// @license      MIT
// @match        https://igg-games.com/
// @icon         https://igg-games.com/wp-content/uploads/2023/08/i96x96.png
// @require      https://cdn.jsdelivr.net/npm/idb@7/build/umd.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562910/IGG%20Games%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/562910/IGG%20Games%20Infinite%20Scroll.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- CONFIGURATION ---
    const BUFFER_PIXELS = 1000;
    const DB_NAME = 'IGG_Scroll_Cache';
    const STORE_NAME = 'articles';
    const SETTINGS_STORE = 'settings';
    const ITEMS_PER_PAGE = 10;

    // --- THROTTLING CONFIG ---
    let minRequestGap = 1000;
    const BURST_THRESHOLD = 10;
    const BURST_WINDOW = 10000;
    const requestTimestamps = [];

    // --- STATE ---
    let isLoading = false;
    let mode = 'INITIAL_CHECK';
    let currentPage = 1;
    let lastRequestTime = 0;

    // --- DATABASE SETUP ---
    const dbPromise = idb.openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('date', 'date');
            }
            if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                db.createObjectStore(SETTINGS_STORE);
            }
        },
    });

    // --- MENU COMMANDS ---
    GM_registerMenuCommand("🗑️ Clear Cache & Reset", async () => {
        if (confirm("Delete all cached games and reload the page?")) {
            try {
                const db = await dbPromise;
                db.close();
                await idb.deleteDB(DB_NAME);
                location.reload();
            } catch (e) {
                alert("Error: " + e);
            }
        }
    });

    const TARGET_SELECTOR = '.container-main-post > div:nth-child(2)';

    // --- HELPER: TOAST ---
    const showToast = (msg, isError = false) => {
        let toast = document.getElementById('igg-scroll-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'igg-scroll-toast';
            toast.style = "position:fixed; bottom:20px; right:20px; background:#333; color:#fff; padding:10px 20px; border-radius:5px; z-index:9999; font-family:sans-serif; transition: opacity 0.3s; opacity:0; pointer-events:none;";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.borderLeft = isError ? "5px solid #ff4444" : "5px solid #44ff44";
        toast.style.opacity = "1";
        setTimeout(() => { toast.style.opacity = "0"; }, 3000);
    };

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    async function adaptiveThrottle() {
        const now = Date.now();
        while (requestTimestamps.length > 0 && now - requestTimestamps[0] > BURST_WINDOW) {
            requestTimestamps.shift();
        }
        if (requestTimestamps.length >= BURST_THRESHOLD) {
            if (minRequestGap !== 2000) {
                minRequestGap = 2000;
                showToast("Burst detected! Throttling increased to 2s.", true);
            }
        }
        const timeSinceLast = now - lastRequestTime;
        if (timeSinceLast < minRequestGap) {
            await sleep(minRequestGap - timeSinceLast);
        }
        lastRequestTime = Date.now();
        requestTimestamps.push(lastRequestTime);
    }

    // --- INIT ---
    await initialize();

    window.addEventListener('scroll', () => {
        if (isLoading) return;
        const dist = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
        if (dist < BUFFER_PIXELS) loadNextBatch();
    });

    async function initialize() {
        const currentGrid = document.querySelector(TARGET_SELECTOR);
        if (!currentGrid) return;

        const items = Array.from(currentGrid.children);
        const parsedItems = items.map(parseArticleElement).filter(i => i);
        if (parsedItems.length === 0) return;

        // Save current page items to cache
        await saveItemsToDB(parsedItems);

        const db = await dbPromise;
        const lastKnownTopId = await db.get(SETTINGS_STORE, 'latest_seen_id');
        const currentTopId = parsedItems[0].id;

        // Decide Mode
        if (lastKnownTopId === currentTopId) {
            mode = 'CACHE_STREAM';
        } else {
            console.log(`[Cache] Update detected (Old: ${lastKnownTopId} vs New: ${currentTopId}). GAP FILL.`);
            mode = 'NETWORK_GAP_FILL';
            await db.put(SETTINGS_STORE, currentTopId, 'latest_seen_id');
        }
    }

    async function loadNextBatch() {
        isLoading = true;
        try {
            if (mode === 'CACHE_STREAM') await streamFromCache();
            else await fetchFromNetwork();
        } catch (err) {
            console.error(err);
        } finally {
            isLoading = false;
        }
    }

    async function streamFromCache() {
        const articles = document.querySelectorAll('article');
        const lastArticle = articles[articles.length - 1];
        if (!lastArticle) return;

        const lastDateStr = extractDate(lastArticle);
        const db = await dbPromise;
        const index = db.transaction(STORE_NAME).store.index('date');

        // Get older items from DB
        let cursor = await index.openCursor(IDBKeyRange.upperBound(lastDateStr, true), 'prev');

        const nextItems = [];
        while (cursor && nextItems.length < ITEMS_PER_PAGE) {
            // DEDUPLICATION: Check if ID exists in DOM
            if (!document.getElementById(cursor.value.id)) {
                nextItems.push(cursor.value);
            }
            cursor = await cursor.continue();
        }

        if (nextItems.length > 0) {
            appendItemsToDom(nextItems);
        } else {
            mode = 'NETWORK_FALLBACK';
            await fetchFromNetwork();
        }
    }

    async function fetchFromNetwork() {
        await adaptiveThrottle();

        // Calculate next page based on current DOM count if we just switched from Cache
        if (mode === 'NETWORK_FALLBACK') {
             const total = document.querySelectorAll('article').length;
             // Ensure we don't jump backwards. If we have 55 items, we are roughly at end of page 5 or 6.
             // (55 / 10) + 1 = 6.
             currentPage = Math.floor(total / ITEMS_PER_PAGE) + 1;
             mode = 'NETWORK_GAP_FILL'; // Switch state so we don't recalc every time
        } else {
             currentPage++;
        }

        console.log(`[Network] Fetching Page ${currentPage}...`);

        try {
            const response = await fetch(`https://igg-games.com/page/${currentPage}`);
            if (!response.ok) return;

            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const fetchedGrid = doc.querySelector(TARGET_SELECTOR);

            if (fetchedGrid) {
                const rawElements = Array.from(fetchedGrid.children);
                const parsedData = rawElements.map(parseArticleElement).filter(i => i);

                if (parsedData.length > 0) {
                    await saveItemsToDB(parsedData);

                    const currentGrid = document.querySelector(TARGET_SELECTOR);

                    // STRICT DEDUPLICATION LOOP
                    let appendedCount = 0;
                    rawElements.forEach(el => {
                        const article = el.querySelector('article');
                        if (article && !document.getElementById(article.id)) {
                            currentGrid.appendChild(el);
                            appendedCount++;
                        }
                    });

                    // Cleanup
                    const pag = document.querySelector('.uk-pagination');
                    if (pag) pag.remove();

                    if (appendedCount === 0) {
                        console.log("[Network] All items on this page were duplicates. Fetching next...");
                        // Optional: Recursively fetch next page immediately if we got a page of pure dupes
                        // fetchFromNetwork();
                    }
                }
            }
        } catch (err) {
            showToast("Network Error", true);
        }
    }

    // --- HELPERS ---
    function parseArticleElement(div) {
        const article = div.querySelector('article');
        if (!article) return null;
        return { id: article.id, date: extractDate(article), html: div.outerHTML };
    }

    async function saveItemsToDB(items) {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await Promise.all([...items.map(item => tx.store.put(item)), tx.done]);
    }

    function appendItemsToDom(dbItems) {
        const container = document.querySelector(TARGET_SELECTOR);
        const temp = document.createElement('div');
        dbItems.forEach(item => {
            temp.innerHTML = item.html;
            container.appendChild(temp.firstElementChild);
        });
        const pag = document.querySelector('.uk-pagination');
        if (pag) pag.remove();
    }

    function extractDate(article) {
        const timeTag = article.querySelector('time');
        return timeTag ? timeTag.getAttribute('datetime') : new Date().toISOString();
    }
})();