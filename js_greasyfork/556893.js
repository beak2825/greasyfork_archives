// ==UserScript==
// @name         Suwayomi Comick Tracker
// @namespace    http://tampermonkey.net/
// @version      18.0
// @description  Track Comick.dev chapter counts on Suwayomi. Fully customizable.
// @license      MIT
//
// ==============================================================================
// 📖 DOCUMENTATION & CONFIGURATION 📖
// ==============================================================================
//
// 1. HOW TO ADD YOUR URL (Important!)
//    Tampermonkey needs to know where to run this script.
//    Look at the lines starting with "@match" below.
//    - If you use localhost, keep the default lines.
//    - If you use a custom domain (e.g., mysuwayomi.com), ADD a new line like:
//      // @match https://mysuwayomi.com/*
//
// 2. TIMINGS (Performance vs. Speed)
//    - CACHE_TIME: How long to remember a chapter count before checking Comick again.
//      Default is 24 hours. Set to (1000 * 60 * 60 * 2) for 2 hours.
//    - REQUEST_DELAY: Time to wait between fetching each manga (in milliseconds).
//      WARNING: Do not set lower than 1000ms (1 second) or Comick might ban your IP.
//    - SCAN_INTERVAL: How often the script checks the page for new images (in milliseconds).
//
// 3. BUTTON POSITIONS (Visuals)
//    You can change 'bottom', 'right', 'gap', and 'direction' in the variables below.
//
// ==============================================================================
//
// @match        http://localhost:4567/*
// @match        http://127.0.0.1:4567/*
// @match        https://YOUR-SUWAYOMI-DOMAIN.com/*
//
// @icon         https://comick.dev/favicon.ico
// @connect      api.comick.dev
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/556893/Suwayomi%20Comick%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/556893/Suwayomi%20Comick%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 🛠️ SETTINGS AREA (EDIT VALUES HERE) 🛠️
    // ==========================================

    // --- ⏱️ TIMING SETTINGS ---
    const CACHE_TIME = 1000 * 60 * 60 * 24;  // 24 Hours (in milliseconds)
    const REQUEST_DELAY = 1500;              // 1.5 Seconds delay between API requests
    const SCAN_INTERVAL = 1000;              // 2.5 Seconds check for new images on screen

    // --- 🎨 BUTTON STYLE: LIBRARY PAGE ---
    const LIB_STYLE = {
        bottom: '20px',      // Distance from bottom of screen
        right: '20px',       // Distance from right of screen
        gap: '10px',         // Space between buttons
        direction: 'column'  // 'column' (Vertical) or 'row' (Horizontal)
    };

    // --- 🎨 BUTTON STYLE: MANGA DETAILS PAGE ---
    const MANGA_STYLE = {
        bottom: '90px',      // Higher to avoid blocking the "Resume" button
        right: '60px',       // Moved left to avoid blocking the 3-dot menu
        gap: '8px',          // Tighter spacing
        direction: 'column'  // Vertical stack
    };

    // ==========================================
    // ⛔ CONFIGURATION END ⛔
    // ==========================================

    const COMICK_API_URL = "https://api.comick.dev/v1.0/search";
    const OVERRIDE_PREFIX = "title_override_";

    let processingQueue = false;
    let queue = [];

    // --- UI: BUTTONS ---
    function manageButtonVisibility() {
        const url = window.location.href;

        const isLibrary = url.includes('/library');
        const isMangaDetails = url.includes('/manga/') && !url.includes('/chapter/');
        const isAllowedPage = isLibrary || isMangaDetails;

        // 1. Get or Create Container
        let container = document.getElementById('comick-btn-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'comick-btn-container';
            Object.assign(container.style, {
                position: 'fixed',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'flex-end',
                transition: 'bottom 0.3s, right 0.3s'
            });
            document.body.appendChild(container);
        }

        // 2. Apply Styles Based on Location
        if (isAllowedPage) {
            container.style.display = 'flex';

            if (isMangaDetails) {
                container.style.bottom = MANGA_STYLE.bottom;
                container.style.right = MANGA_STYLE.right;
                container.style.gap = MANGA_STYLE.gap;
                container.style.flexDirection = MANGA_STYLE.direction;
            } else {
                container.style.bottom = LIB_STYLE.bottom;
                container.style.right = LIB_STYLE.right;
                container.style.gap = LIB_STYLE.gap;
                container.style.flexDirection = LIB_STYLE.direction;
            }

            // 3. Manage Individual Buttons

            // --- Link Button ---
            let linkBtn = document.getElementById('comick-link-btn');
            if (!linkBtn) {
                linkBtn = createButton('comick-link-btn', '↗ Comick', '#ff6740', null);
                container.appendChild(linkBtn);
            }

            if (isMangaDetails) {
                const items = findDetailsCover();
                if (items.length > 0) {
                    const cached = GM_getValue(items[0].title);
                    if (cached && cached.slug) {
                        linkBtn.style.display = 'block';
                        linkBtn.onclick = () => window.open(`https://comick.dev/comic/${cached.slug}`, '_blank');
                    } else {
                        linkBtn.style.display = 'none';
                    }
                } else {
                    linkBtn.style.display = 'none';
                }
            } else {
                linkBtn.style.display = 'none';
            }

            // --- Edit Button ---
            let editBtn = document.getElementById('comick-edit-btn');
            if (!editBtn) {
                editBtn = createButton('comick-edit-btn', '✎ Edit Search', '#4CAF50', handleEditClick);
                container.appendChild(editBtn);
            }
            editBtn.style.display = isMangaDetails ? 'block' : 'none';

            // --- Refresh Button ---
            let refreshBtn = document.getElementById('comick-refresh-btn');
            if (!refreshBtn) {
                refreshBtn = createButton('comick-refresh-btn', '↻ Refresh', '#2196F3', handleRefreshClick);
                container.appendChild(refreshBtn);
            }
            refreshBtn.style.display = 'block';
            refreshBtn.innerHTML = isMangaDetails ? '↻ Refresh Manga' : '↻ Refresh All';

        } else {
            container.style.display = 'none';
        }
    }

    function createButton(id, text, color, handler) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.innerHTML = text;

        Object.assign(btn.style, {
            padding: '6px 12px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            transition: 'transform 0.2s, opacity 0.2s',
            opacity: '0.9',
            whiteSpace: 'nowrap',
            width: 'fit-content'
        });

        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.opacity = '1';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.opacity = '0.9';
        };
        if (handler) btn.onclick = handler;

        return btn;
    }

    // --- HANDLERS ---
    function handleEditClick() {
        const items = findDetailsCover();
        if (items.length === 0) return alert("Wait for the page to load fully.");

        const originalTitle = items[0].title;
        const currentOverride = GM_getValue(OVERRIDE_PREFIX + originalTitle, "");

        const newTitle = prompt(
            `Enter the EXACT title to search on Comick for:\n"${originalTitle}"\n\n(Leave empty to reset to default)`,
            currentOverride || originalTitle
        );

        if (newTitle !== null) {
            if (newTitle.trim() === "" || newTitle.trim() === originalTitle) {
                GM_deleteValue(OVERRIDE_PREFIX + originalTitle);
                alert("Search title reset to default.");
            } else {
                GM_setValue(OVERRIDE_PREFIX + originalTitle, newTitle.trim());
            }
            singleReset(originalTitle);
        }
    }

    function handleRefreshClick() {
        const url = window.location.href;
        const isMangaDetails = url.includes('/manga/') && !url.includes('/chapter/');

        if (isMangaDetails) {
            const items = findDetailsCover();
            if (items.length > 0) {
                const title = items[0].title;
                const override = GM_getValue(OVERRIDE_PREFIX + title);
                const msg = override ? `Refresh "${title}" using custom search "${override}"?` : `Refresh chapter count for "${title}"?`;

                if (confirm(msg)) singleReset(title);
            }
        } else {
            if (confirm("Clear cache and re-scan ALL manga in library?")) fullReset();
        }
    }

    function updateButtonStatus(text, color) {
        const btn = document.getElementById('comick-refresh-btn');
        if (btn) {
            btn.innerHTML = text;
            if (color) btn.style.backgroundColor = color;
        }
    }

    // --- LOGIC ---
    function singleReset(title) {
        GM_deleteValue(title);
        const items = findDetailsCover();
        if (items.length > 0) {
            const container = items[0].element;
            const badge = container.querySelector('.comick-tracker-badge');
            if (badge) badge.remove();
            delete container.dataset.comickProcessed;
        }
        scan();
    }

    function fullReset() {
        const keys = GM_listValues();
        keys.forEach(key => {
            if (!key.startsWith(OVERRIDE_PREFIX)) {
                GM_deleteValue(key);
            }
        });

        document.querySelectorAll('.comick-tracker-badge').forEach(el => el.remove());
        document.querySelectorAll('[data-comick-processed]').forEach(el => delete el.dataset.comickProcessed);
        queue = [];
        processingQueue = false;
        scan();
    }

    function findLibraryCards() {
        const images = document.querySelectorAll('img');
        const cards = [];
        images.forEach(img => {
            if (img.width < 50 || img.height < 50) return;
            const title = img.alt || img.title;
            if (!title) return;
            const container = img.parentElement;
            if (container.dataset.comickProcessed) return;
            cards.push({ element: container, title: title, type: 'library' });
        });
        return cards;
    }

    function findDetailsCover() {
        const images = Array.from(document.querySelectorAll('img'));
        const potentialCovers = images.filter(img => img.width > 150 && img.height > 200 && !img.closest('button'));
        if (potentialCovers.length === 0) return [];

        const mainCover = potentialCovers[0];
        const container = mainCover.parentElement;

        let title = document.title.split(' - ')[0].trim();
        if (title === "Suwayomi" || title === "Library") title = mainCover.alt;
        if (!title) return [];

        return [{ element: container, title: title, type: 'details' }];
    }

    function createBadge(number, type) {
        const badge = document.createElement('div');
        badge.className = 'comick-tracker-badge';
        badge.innerText = number;

        const style = {
            position: 'absolute',
            backgroundColor: number === 'Err' ? '#757575' : '#d32f2f',
            color: 'white',
            borderRadius: '4px',
            padding: '2px 6px',
            fontWeight: 'bold',
            zIndex: '9999',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            border: '1px solid white',
            fontFamily: 'sans-serif'
        };

        if (type === 'details') {
            style.fontSize = '14px';
            style.padding = '4px 10px';
            style.top = '10px';
            style.left = '10px';
        } else {
            style.fontSize = '11px';
            style.top = '30px';
            style.left = '5px';
        }
        Object.assign(badge.style, style);
        return badge;
    }

    function fetchComickData(originalTitle, callback) {
        const override = GM_getValue(OVERRIDE_PREFIX + originalTitle);
        const searchTitle = override || originalTitle;
        const query = encodeURIComponent(searchTitle);

        GM_xmlhttpRequest({
            method: "GET",
            url: `${COMICK_API_URL}?q=${query}&limit=8`,
            timeout: 5000,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (Array.isArray(data) && data.length > 0) {

                            const targetTitle = searchTitle.toLowerCase();
                            const relevantMatches = data.filter(item => {
                                const itemTitle = item.title.toLowerCase();
                                return itemTitle.includes(targetTitle) || targetTitle.includes(itemTitle);
                            });

                            const candidates = relevantMatches.length > 0 ? relevantMatches : data;
                            let maxChapter = 0;
                            let bestMatch = null;
                            let bestSlug = null;

                            candidates.forEach(comic => {
                                const currentChap = parseFloat(comic.last_chapter);
                                if (!isNaN(currentChap) && currentChap > maxChapter) {
                                    maxChapter = currentChap;
                                    bestMatch = comic.last_chapter;
                                    bestSlug = comic.slug;
                                }
                            });

                            callback({ count: bestMatch || "?", slug: bestSlug });
                        } else {
                            callback({ count: "N/A", slug: null });
                        }
                    } catch (e) {
                        callback({ count: "Err", slug: null });
                    }
                } else {
                    callback({ count: "Err", slug: null });
                }
            },
            onerror: function(err) {
                callback({ count: "Err", slug: null });
            }
        });
    }

    function processQueue() {
        if (queue.length === 0) {
            processingQueue = false;
            const url = window.location.href;
            const isMangaDetails = url.includes('/manga/') && !url.includes('/chapter/');
            updateButtonStatus(isMangaDetails ? '↻ Refresh Manga' : '↻ Refresh All', '#2196F3');
            manageButtonVisibility();
            return;
        }

        processingQueue = true;
        updateButtonStatus(`Scanning... (${queue.length})`, '#FF9800');

        const { element, title, type } = queue.shift();
        const cached = GM_getValue(title);
        const now = Date.now();

        if (cached && (now - cached.timestamp < CACHE_TIME)) {
            const count = (typeof cached.count === 'object') ? cached.count.count : cached.count;
            updateCardUI(element, count, type);
            requestAnimationFrame(processQueue);
        } else {
            fetchComickData(title, (result) => {
                if (result.count !== "Err") {
                    GM_setValue(title, { count: result.count, slug: result.slug, timestamp: now });
                }
                updateCardUI(element, result.count, type);
                setTimeout(processQueue, REQUEST_DELAY);
            });
        }
    }

    function updateCardUI(container, count, type) {
        if (!container) return;
        const style = window.getComputedStyle(container);
        if (style.position === 'static') container.style.position = 'relative';

        const oldBadge = container.querySelector('.comick-tracker-badge');
        if (oldBadge) oldBadge.remove();

        const badge = createBadge(count, type);
        container.appendChild(badge);
    }

    function scan() {
        manageButtonVisibility();
        const url = window.location.href;
        let newItems = [];

        const isLibrary = url.includes('/library');
        const isMangaDetails = url.includes('/manga/') && !url.includes('/chapter/');

        if (isLibrary) newItems = findLibraryCards();
        else if (isMangaDetails) newItems = findDetailsCover();

        if (newItems && newItems.length > 0) {
            newItems.forEach(item => {
                if (isMangaDetails || !item.element.dataset.comickProcessed) {
                    item.element.dataset.comickProcessed = "true";
                    queue.push(item);
                }
            });
        }

        if (!processingQueue) processQueue();
    }

    // --- INIT ---
    setTimeout(scan, 1500);
    setInterval(scan, SCAN_INTERVAL);

})();