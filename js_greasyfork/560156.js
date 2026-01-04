// ==UserScript==
// @name         Anilist Granular Name & Title Language Settings
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Completely customizable title display preferences (Native, English, Phonetic) for Anime/Manga/Characters/Staff based on origin country.
// @author       Slop
// @match        https://anilist.co/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560156/Anilist%20Granular%20Name%20%20Title%20Language%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/560156/Anilist%20Granular%20Name%20%20Title%20Language%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const DEFAULT_PREF = {
        JP: 'native',
        KR: 'english',
        CN: 'english',
        TW: 'english',
        DEFAULT: 'english'
    };

    // Load saved preferences or use defaults
    let PREF = GM_getValue('granular_pref', DEFAULT_PREF);



    const CACHE_KEY_PREFIX = 'anilist_granular_';
    const BATCH_DELAY = 100;
    const TTL = 7 * 24 * 60 * 60 * 1000;

    let pending = {
        MEDIA: new Set(),
        CHARACTER: new Set(),
        STAFF: new Set(),
        REVIEW: new Set()
    };
    let batchTimeout = null;
    let pendingReviewCards = new Map(); // reviewId -> card element

    // --- Floating Settings Panel ---

    function createSettingsPanel() {
        // Prevent duplicates
        if (document.getElementById('granular-settings-panel')) {
            document.getElementById('granular-settings-panel').style.display = 'flex';
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'granular-settings-panel';
        overlay.innerHTML = `
            <style>
                #granular-settings-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 99999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                #granular-settings-box {
                    background: #1f2631;
                    border-radius: 12px;
                    padding: 24px;
                    min-width: 320px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    color: #fff;
                }
                #granular-settings-box h2 {
                    margin: 0 0 16px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #3db4f2;
                }
                .granular-setting-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .granular-setting-row label {
                    font-size: 14px;
                    color: #9fadbd;
                }
                .granular-setting-row select {
                    background: #11161d;
                    border: 1px solid #2b3542;
                    border-radius: 6px;
                    padding: 6px 12px;
                    color: #fff;
                    font-size: 14px;
                    cursor: pointer;
                    min-width: 120px;
                }
                .granular-setting-row select:hover {
                    border-color: #3db4f2;
                }
                .granular-btn-row {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    justify-content: flex-end;
                }
                .granular-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }
                .granular-btn:hover {
                    opacity: 0.85;
                }
                .granular-btn-primary {
                    background: #3db4f2;
                    color: #fff;
                }
                .granular-btn-secondary {
                    background: #2b3542;
                    color: #9fadbd;
                }
                .granular-btn-danger {
                    background: #e85d75;
                    color: #fff;
                }
                .granular-divider {
                    border: none;
                    border-top: 1px solid #2b3542;
                    margin: 16px 0;
                }
            </style>
            <div id="granular-settings-box">
                <h2>🌐 Granular Name & Title Settings</h2>
                <div class="granular-setting-row">
                    <label>Japan (JP)</label>
                    <select id="granular-pref-jp">
                        <option value="native">Native (日本語)</option>
                        <option value="english">English</option>
                        <option value="phonetic">Phonetic (Romaji)</option>
                    </select>
                </div>
                <div class="granular-setting-row">
                    <label>South Korea (KR)</label>
                    <select id="granular-pref-kr">
                        <option value="native">Native (한국어)</option>
                        <option value="english">English</option>
                        <option value="phonetic">Phonetic (Romaja)</option>
                    </select>
                </div>
                <div class="granular-setting-row">
                    <label>China (CN)</label>
                    <select id="granular-pref-cn">
                        <option value="native">Native (中文)</option>
                        <option value="english">English</option>
                        <option value="phonetic">Phonetic (Pinyin)</option>
                    </select>
                </div>
                <div class="granular-setting-row">
                    <label>Taiwan (TW)</label>
                    <select id="granular-pref-tw">
                        <option value="native">Native (中文)</option>
                        <option value="english">English</option>
                        <option value="phonetic">Phonetic (Pinyin)</option>
                    </select>
                </div>
                <div class="granular-setting-row">
                    <label>Other Countries</label>
                    <select id="granular-pref-default">
                        <option value="native">Native</option>
                        <option value="english">English</option>
                        <option value="phonetic">Phonetic</option>
                    </select>
                </div>
                <hr class="granular-divider">
                <div class="granular-btn-row">
                    <button class="granular-btn granular-btn-danger" id="granular-clear-cache">Clear Cache</button>
                    <button class="granular-btn granular-btn-secondary" id="granular-cancel">Cancel</button>
                    <button class="granular-btn granular-btn-primary" id="granular-save">Save & Reload</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Set current values
        document.getElementById('granular-pref-jp').value = PREF.JP || 'native';
        document.getElementById('granular-pref-kr').value = PREF.KR || 'english';
        document.getElementById('granular-pref-cn').value = PREF.CN || 'english';
        document.getElementById('granular-pref-tw').value = PREF.TW || 'english';
        document.getElementById('granular-pref-default').value = PREF.DEFAULT || 'english';

        // Event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettingsPanel();
        });

        document.getElementById('granular-cancel').addEventListener('click', closeSettingsPanel);

        document.getElementById('granular-clear-cache').addEventListener('click', () => {
            let count = 0;
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(key);
                    count++;
                }
            });
            alert(`Cleared ${count} cached entries.`);
        });

        document.getElementById('granular-save').addEventListener('click', () => {
            PREF.JP = document.getElementById('granular-pref-jp').value;
            PREF.KR = document.getElementById('granular-pref-kr').value;
            PREF.CN = document.getElementById('granular-pref-cn').value;
            PREF.TW = document.getElementById('granular-pref-tw').value;
            PREF.DEFAULT = document.getElementById('granular-pref-default').value;
            GM_setValue('granular_pref', PREF);
            location.reload();
        });
    }

    function closeSettingsPanel() {
        const panel = document.getElementById('granular-settings-panel');
        if (panel) panel.style.display = 'none';
    }

    // Single menu command to open the panel
    GM_registerMenuCommand('⚙️ Open Settings', createSettingsPanel);

    // --- Helper Functions ---

    function getCacheKey(id, type) {
        return `${CACHE_KEY_PREFIX}${type}_${id} `;
    }

    function getCachedData(id, type) {
        const key = getCacheKey(id, type);
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            if (parsed.timestamp && Date.now() - parsed.timestamp > TTL) {
                localStorage.removeItem(key);
                return null;
            }
            return parsed.data;
        } catch (e) {
            console.warn('[Granular] Error parsing cached data', e);
            localStorage.removeItem(key);
            return null;
        }
    }

    function setCachedData(id, type, data) {
        const key = getCacheKey(id, type);
        const payload = { timestamp: Date.now(), data: data };
        try {
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (e) {
            console.warn('[Granular] Quota exceeded, clearing cache...');
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith(CACHE_KEY_PREFIX)) localStorage.removeItem(k);
            });
            try {
                localStorage.setItem(key, JSON.stringify(payload));
            } catch (e2) {
                console.error('[Granular] Failed to cache even after clearing:', e2);
            }
        }
    }

    function hasKana(str) {
        if (!str) return false;
        return /[\u3040-\u309F\u30A0-\u30FF]/.test(str);
    }

    function hasHangul(str) {
        if (!str) return false;
        return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(str);
    }

    // --- Core Logic ---

    function queueFetch(id, type) {
        if (!id || !type) return;
        if (getCachedData(id, type)) return;

        pending[type].add(parseInt(id));

        if (batchTimeout) clearTimeout(batchTimeout);
        batchTimeout = setTimeout(flushBatch, BATCH_DELAY);
    }

    async function flushBatch() {
        const mediaIds = Array.from(pending.MEDIA);
        const charIds = Array.from(pending.CHARACTER);
        const staffIds = Array.from(pending.STAFF);
        const reviewIds = Array.from(pending.REVIEW);

        pending.MEDIA.clear();
        pending.CHARACTER.clear();
        pending.STAFF.clear();
        pending.REVIEW.clear();

        // Fetch reviews separately to get their media IDs
        if (reviewIds.length > 0) {
            await fetchReviews(reviewIds);
        }

        if (mediaIds.length === 0 && charIds.length === 0 && staffIds.length === 0) return;



        const query = `
query($mediaIds: [Int], $charIds: [Int], $staffIds: [Int]) {
    mediaPage: Page(page: 1, perPage: 50) {
        media(id_in: $mediaIds) {
            id
            countryOfOrigin
            title { native romaji english }
        }
    }
    charPage: Page(page: 1, perPage: 50) {
        characters(id_in: $charIds) {
            id
            name { full native }
            media(page: 1, perPage: 1, sort: FAVOURITES_DESC) {
                nodes { countryOfOrigin }
            }
        }
    }
    staffPage: Page(page: 1, perPage: 50) {
        staff(id_in: $staffIds) {
            id
            name { full native }
            staffMedia(page: 1, perPage: 1, sort: FAVOURITES_DESC) {
                nodes { countryOfOrigin }
            }
        }
    }
}
`;

        try {
            const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    query: query,
                    variables: { mediaIds, charIds, staffIds }
                })
            });

            const json = await response.json();
            if (json.errors) {
                console.error('[Granular] GraphQL Errors:', json.errors);
            }

            const data = json.data;

            if (data?.mediaPage?.media) {
                data.mediaPage.media.forEach(item => {
                    setCachedData(item.id, 'MEDIA', item);
                    updateElementsOnPage(item.id, 'MEDIA');
                });
            }

            if (data?.charPage?.characters) {
                data.charPage.characters.forEach(item => {
                    setCachedData(item.id, 'CHARACTER', item);
                    updateElementsOnPage(item.id, 'CHARACTER');
                });
            }

            if (data?.staffPage?.staff) {
                data.staffPage.staff.forEach(item => {
                    setCachedData(item.id, 'STAFF', item);
                    updateElementsOnPage(item.id, 'STAFF');
                });
            }

        } catch (e) {
            console.error('[Granular] Network Error:', e);
        }
    }

    async function fetchReviews(reviewIds) {
        if (!reviewIds || reviewIds.length === 0) return;



        // AniList has a bug where one 404 in a batched query nullifies ALL results
        // So we must fetch each review individually
        // Also, we need to rate-limit to avoid 429 errors

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchSingleReview = async (reviewId) => {
            const query = `query { Review(id: ${reviewId}) { id media { id countryOfOrigin title { native romaji english } } } }`;
            try {
                const response = await fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ query })
                });
                const json = await response.json();
                if (json.data?.Review?.media) {
                    return { reviewId, review: json.data.Review };
                }
                return { reviewId, review: null };
            } catch (e) {
                console.warn(`[Granular] Failed to fetch review ${reviewId}:`, e);
                return { reviewId, review: null };
            }
        };

        // AniList rate limit is 30 requests/minute = 1 request per 2 seconds
        const REQUEST_DELAY = 2100; // Wait 2.1 seconds between requests to be safe
        let successCount = 0;

        for (let i = 0; i < reviewIds.length; i++) {
            const reviewId = reviewIds[i];
            const { review: fetchedReview } = await fetchSingleReview(reviewId);

            if (fetchedReview && fetchedReview.media) {
                successCount++;
                // Cache the media data
                setCachedData(fetchedReview.media.id, 'MEDIA', fetchedReview.media);
                // Also cache review -> media mapping
                setCachedData(fetchedReview.id, 'REVIEW', { mediaId: fetchedReview.media.id });

                // Update the pending card if we have it
                const card = pendingReviewCards.get(fetchedReview.id);
                if (card) {
                    updateReviewCard(card, fetchedReview.media.id);
                    pendingReviewCards.delete(fetchedReview.id);
                }
            } else {
                // Review was null/deleted - remove from pending to avoid re-fetching
                pendingReviewCards.delete(reviewId);
            }

            // Wait before next request (but not after the last one)
            if (i < reviewIds.length - 1) {
                await delay(REQUEST_DELAY);
            }
        }


    }

    function updateReviewCard(card, mediaId) {
        const header = card.querySelector('.header');
        if (!header) return;

        const text = header.innerText;
        const match = text.match(/^Review of (.+) by (.+)$/);

        if (match) {
            const titleText = match[1];
            const userText = match[2];

            card.dataset.granularReviewProcessed = 'true';
            header.innerHTML = `Review of <span class="granular-title" data-granular-id="${mediaId}">${escapeHtml(titleText)}</span> by ${escapeHtml(userText)}`;

            const newTitleEl = header.querySelector('.granular-title');
            updateElement(newTitleEl, mediaId, 'MEDIA');
        }
    }

    function getPrefferedName(item, type) {
        if (!item) return null;

        let origin = 'JP';

        if (type === 'MEDIA') {
            origin = item.countryOfOrigin || 'JP';
        } else if (type === 'CHARACTER') {
            const assocMedia = item.media?.nodes?.[0];
            origin = assocMedia ? assocMedia.countryOfOrigin : 'JP';
        } else if (type === 'STAFF') {
            const assocMedia = item.staffMedia?.nodes?.[0];
            origin = assocMedia ? assocMedia.countryOfOrigin : 'JP';
        }

        const prefType = PREF[origin] || PREF.DEFAULT;

        const getName = (pref) => {
            if (type === 'MEDIA') {
                if (pref === 'native') return item.title.native;
                if (pref === 'english') return item.title.english;
                if (pref === 'phonetic') return item.title.romaji;
            } else {
                if (pref === 'native') return item.name.native;
                return item.name.full;
            }
            return null;
        };

        let finalName = getName(prefType);
        if (!finalName) finalName = getName('english');
        if (!finalName) finalName = getName('phonetic');
        if (!finalName) finalName = getName('native');

        return finalName;
    }

    function updateElementsOnPage(id, type) {
        processPage();
    }

    function updateElement(el, id, type) {
        // Fix for SPA Navigation: Detect if this element was reused for a new ID
        if (el.dataset.granularId && el.dataset.granularId != id) {
            delete el.dataset.granularUpdated; // Reset lock for new ID
        }

        if (el.dataset.granularUpdated === 'true') return;

        const text = el.innerText;
        if (hasKana(text)) {
            if (PREF.JP === 'native') {
                el.dataset.granularUpdated = 'true';
                el.dataset.granularId = id;
                return;
            }
        }
        if (hasHangul(text)) {
            if (PREF.KR === 'native') {
                el.dataset.granularUpdated = 'true';
                el.dataset.granularId = id;
                return;
            }
        }

        const data = getCachedData(id, type);
        if (!data) {
            queueFetch(id, type);
            return;
        }

        const newName = getPrefferedName(data, type);
        if (newName && newName !== el.innerText) {
            el.title = `Original: ${el.innerText} `;
            el.innerText = newName;
            el.dataset.granularUpdated = 'true';
            el.dataset.granularId = id; // Lock to this ID
        }
    }

    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function processReviews() {
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach(card => {
            // Skip if already processed or pending
            if (card.dataset.granularReviewProcessed === 'true') return;
            if (card.dataset.granularReviewPending === 'true') return;

            const header = card.querySelector('.header');
            if (!header) return;

            // Try to extract media ID from banner first
            const banner = card.querySelector('.banner');
            let mediaId = null;

            if (banner) {
                const style = banner.getAttribute('style');
                if (style) {
                    const idMatch = style.match(/\/media\/(?:anime|manga)\/banner\/(\d+)/);
                    if (idMatch) {
                        mediaId = idMatch[1];
                    }
                }
            }

            if (mediaId) {
                // We have the media ID from banner - process immediately
                const text = header.innerText;
                const match = text.match(/^Review of (.+) by (.+)$/);

                if (match) {
                    const titleText = match[1];
                    const userText = match[2];

                    card.dataset.granularReviewProcessed = 'true';
                    header.innerHTML = `Review of <span class="granular-title" data-granular-id="${mediaId}">${escapeHtml(titleText)}</span> by ${escapeHtml(userText)}`;

                    const newTitleEl = header.querySelector('.granular-title');
                    updateElement(newTitleEl, mediaId, 'MEDIA');
                }
            } else {
                // No banner - check heuristics first before fetching
                const text = header.innerText;
                const titleMatch = text.match(/^Review of (.+) by (.+)$/);
                if (!titleMatch) return;

                const titleText = titleMatch[1];

                // Apply Kana/Hangul heuristics - skip fetch if already in preferred format
                if (hasKana(titleText) && PREF.JP === 'native') {
                    card.dataset.granularReviewProcessed = 'true';
                    return; // Already in native Japanese, no need to fetch
                }
                if (hasHangul(titleText) && PREF.KR === 'native') {
                    card.dataset.granularReviewProcessed = 'true';
                    return; // Already in native Korean, no need to fetch
                }

                // Need to fetch via review ID
                const href = card.getAttribute('href');
                if (!href) return;

                const reviewMatch = href.match(/\/review\/(\d+)/);
                if (!reviewMatch) return;

                const reviewId = parseInt(reviewMatch[1]);

                // Check if we already have cached review data
                const cachedReview = getCachedData(reviewId, 'REVIEW');
                if (cachedReview && cachedReview.mediaId) {
                    updateReviewCard(card, cachedReview.mediaId);
                } else {
                    // Queue fetch for this review
                    card.dataset.granularReviewPending = 'true';
                    pendingReviewCards.set(reviewId, card);
                    pending.REVIEW.add(reviewId);

                    if (batchTimeout) clearTimeout(batchTimeout);
                    batchTimeout = setTimeout(flushBatch, BATCH_DELAY);
                }
            }
        });
    }

    function processPage() {
        // Process standard links
        const links = document.querySelectorAll('a[href*="/anime/"], a[href*="/manga/"], a[href*="/character/"], a[href*="/staff/"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            // Fix: Exclude links inside .relations container (staff roles, character roles)
            if (link.closest('.relations')) return;
            let match, type, id;

            if ((match = href.match(/\/(anime|manga)\/(\d+)/))) {
                type = 'MEDIA';
                id = match[2];
            } else if ((match = href.match(/\/character\/(\d+)/))) {
                type = 'CHARACTER';
                id = match[1];
            } else if ((match = href.match(/\/staff\/(\d+)/))) {
                type = 'STAFF';
                id = match[1];
            }

            if (!type || !id) return;

            if (link.classList.contains('title') || link.classList.contains('name')) {
                updateElement(link, id, type);
            }
            // Support for User Lists (div.title > a)
            else if (link.parentElement.classList.contains('title')) {
                updateElement(link, id, type);
            }
            else if (link.parentElement.classList.contains('content') || link.classList.contains('cover')) {
                const card = link.closest('.media-card, .char-card, .staff-card, .review-card, .recommendation-card') || link.parentElement;
                if (card) {
                    const exactTitle = card.querySelector('.title, .name');
                    if (exactTitle && exactTitle.tagName !== 'A') {
                        updateElement(exactTitle, id, type);
                    }
                }
            }
            else {
                const childTitle = link.querySelector('.title, .name');
                if (childTitle) {
                    updateElement(childTitle, id, type);
                }
            }
        });

        // Banner titles
        const path = window.location.pathname;
        const pageMatch = path.match(/^\/(anime|manga)\/(\d+)/);
        if (pageMatch) {
            const mediaId = pageMatch[2];
            const bannerTitle = document.querySelector('.banner-content h1, .header .content h1');
            if (bannerTitle) {
                updateElement(bannerTitle, mediaId, 'MEDIA');
            }
        }

        // Process Review Cards (Home & Review Page)
        processReviews();
    }

    // --- MutationObserver ---

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const m of mutations) {
            // Check for new nodes being added
            if (m.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
            // Check for attribute changes on banner elements (lazy-loading)
            if (m.type === 'attributes' && m.attributeName === 'style') {
                const target = m.target;
                if (target.classList && target.classList.contains('banner')) {
                    // A banner's style changed - might be lazy-load completing
                    const card = target.closest('.review-card');
                    if (card && card.dataset.granularReviewProcessed !== 'true') {
                        shouldProcess = true;
                        break;
                    }
                }
            }
        }
        if (shouldProcess) {
            if (window.granularDebounceTimer) clearTimeout(window.granularDebounceTimer);
            window.granularDebounceTimer = setTimeout(processPage, 200);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    processPage();

})();
