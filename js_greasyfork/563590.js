// ==UserScript==
// @name         MAL Rating Hover Provider
// @namespace    http://github.com/quantavil
// @version      3.2
// @description  Shows MAL rating on hover. Features: Gold Badge (>8), Smart Caching, Color Grading, and Menu option to Clear Cache.
// @author       Quantavil 

// --- Domain Wildcards ---
// @match        *://123animes.*/*
// @match        *://9anime.*/*
// @match        *://anicore.*/*
// @match        *://anidap.*/*
// @match        *://anigo.*/*
// @match        *://anihq.*/*
// @match        *://anikai.*/*
// @match        *://anikototv.*/*
// @match        *://animedefenders.*/*
// @match        *://animegers.*/*
// @match        *://animeheaven.*/*
// @match        *://animekai.*/*
// @match        *://animeland.*/*
// @match        *://animelok.*/*
// @match        *://animelon.*/*
// @match        *://animenosub.*/*
// @match        *://animepahe.*/*
// @match        *://animestar.*/*
// @match        *://animetsu.*/*
// @match        *://animex.*/*
// @match        *://animeya.*/*
// @match        *://animeyy.*/*
// @match        *://anime.nexus/*
// @match        *://anime.uniquestream.*/*
// @match        *://anitaro.*/*
// @match        *://anitaku.*/*
// @match        *://aniwave.*/*
// @match        *://aniworld.*/*
// @match        *://gogoanime.*/*
// @match        *://hianime.*/*
// @match        *://justanime.*/*
// @match        *://kawaiifu.*/*
// @match        *://kimoitv.*/*
// @match        *://miruro.*/*
// @match        *://ramenflix.*/*
// @match        *://rivestream.*/*
// @match        *://senshi.*/*
// @match        *://wcostream.*/*
// @match        *://yugenanime.*/*

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563590/MAL%20Rating%20Hover%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/563590/MAL%20Rating%20Hover%20Provider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        CACHE_PREFIX: 'mal_v5_',
        CACHE_EXPIRY_SUCCESS: 14 * 24 * 60 * 60 * 1000, // 14 Days
        CACHE_EXPIRY_ERROR: 12 * 60 * 60 * 1000,        // 12 Hours
        DEBOUNCE_DELAY: 200,
        LONG_PRESS_DELAY: 200,
        API_INTERVAL: 350,
        MATCH_THRESHOLD: 0.5,
        SELECTORS: {
            ITEM: `
                .flw-item, .film_list-wrap > div, .poster-card, .f-item, .aitem, .anime-item, .ep-item, .anicard,
                .bsx, .bs, .item, .coverListItem,
                .content-card, .new-card-animate, .pe-episode-card, .news-item, .TPostMv, .gallery, .mini-previews,
                .video-block, .card, 
                a[href*="/series/"], a[data-discover], a[href*="/watch/"], .anime-card,
                .vod-item, a[href*="/anime/info/"], .chart2g, .items li,
                .snap-center, [class*="MovieCardSmall"], article.group, app-anime-item,
                div:has(.item-title)
            `,
            TITLE: `
                .film-name, .dynamic-name, .film-name a,
                .title, .d-title, .anime-name, .name, .mv-namevn,
                h2, h3, h5, .content-title, .new-card-title, .pe-title, .news-item-title, .Title,
                .line-clamp-2, .line-clamp-1, .item-title,
                .charttitle2g a
            `
        }
    };

    let hoverTimeout;
    let longPressTimeout;
    let isTouchInteraction = false;
    const KEY_REGEX = /[^a-z0-9]/g;

    // === Request Queue ===
    const requestQueue = {
        queue: [],
        processing: false,
        currentJob: null,

        add(title, cleanT, callback) {
            if ((this.currentJob && this.currentJob.cleanT === cleanT) ||
                this.queue.some(q => q.cleanT === cleanT)) {
                return;
            }
            this.queue.push({ title, cleanT, callback, retries: 0 });
            this.process();
        },
        async process() {
            if (this.processing || this.queue.length === 0) return;
            this.processing = true;

            const job = this.queue.shift();
            this.currentJob = job; // Set current job
            const { cleanT, callback, retries } = job;

            try {
                const data = await fetchMalData(cleanT);

                if (data && data.status === 429) {
                    if (retries < 2) {
                        job.retries++;
                        this.queue.unshift(job);
                        this.currentJob = null; // Clear current before timeout return
                        setTimeout(() => {
                            this.processing = false;
                            this.process();
                        }, 2500);
                        return;
                    } else {
                        callback({ error: true, temp: true });
                    }
                } else {
                    if (!data.temp && !data.error) {
                        const cacheKey = cleanT.toLowerCase().replace(KEY_REGEX, '');
                        // Check if key is valid before caching
                        if (cacheKey.length > 0) setCache(cacheKey, data);
                    }
                    callback(data);
                }
            } catch (e) {
                console.error(e);
                callback({ error: true, temp: true });
            }

            this.currentJob = null; // Clear current job
            setTimeout(() => {
                this.processing = false;
                this.process();
            }, CONFIG.API_INTERVAL);
        }
    };

    // === CSS Styles ===
    GM_addStyle(`
        .mal-container-rel { position: relative !important; }
        
        .mal-rating-badge {
            position: absolute;
            top: 6px; right: 6px;
            background: rgba(18, 20, 32, 0.96);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #e0e0e0;
            padding: 4px 8px;
            border-radius: 6px;
            font-family: sans-serif;
            font-size: 11px;
            font-weight: 700;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            min-width: 40px;
            opacity: 0;
            transform: translateY(-4px);
            animation: malFadeIn 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            transition: all 0.2s ease;
            pointer-events: auto; 
            user-select: none;
        }

        .mal-rating-badge:hover, .mal-rating-badge.mobile-active {
            transform: translateY(0) scale(1.05);
            background: rgba(25, 28, 45, 1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.7);
            z-index: 10000;
        }

        .mal-rating-badge .score { 
            font-size: 13px; color: #fff; display: flex; align-items: center; gap: 2px;
        }
        .mal-rating-badge .score::before { content: '★'; font-size: 10px; opacity: 0.8; }
        .mal-rating-badge .members { font-size: 9px; color: #9aa0b0; font-weight: 500; }

        /* Color Grading */
        
        /* 8+ : Golden Yellow */
        .mal-rating-badge.score-gold { border-color: rgba(234, 179, 8, 0.5); background: rgba(30, 25, 10, 0.95); box-shadow: 0 0 8px rgba(234, 179, 8, 0.3); }
        .mal-rating-badge.score-gold .score { color: #facc15; text-shadow: 0 0 5px rgba(250, 204, 21, 0.4); } 
        .mal-rating-badge.score-gold .score::before { color: #fbbf24; font-size: 14px; } /* Bigger star */

        /* 7-8 : Green */
        .mal-rating-badge.score-green { border-color: rgba(74, 222, 128, 0.4); }
        .mal-rating-badge.score-green .score { color: #86efac; } .mal-rating-badge.score-green .score::before { color: #4ade80; }

        /* 6-7 : Orange */
        .mal-rating-badge.score-orange { border-color: rgba(251, 146, 60, 0.4); }
        .mal-rating-badge.score-orange .score { color: #fdba74; } .mal-rating-badge.score-orange .score::before { color: #fb923c; }

        /* 5-6 : Red */
        .mal-rating-badge.score-red { border-color: rgba(248, 113, 113, 0.4); }
        .mal-rating-badge.score-red .score { color: #fca5a5; } .mal-rating-badge.score-red .score::before { color: #f87171; }
        
        /* <5 : Purple */
        .mal-rating-badge.score-purple { border-color: rgba(192, 132, 252, 0.4); background: rgba(20, 10, 30, 0.95); }
        .mal-rating-badge.score-purple .score { color: #d8b4fe; } .mal-rating-badge.score-purple .score::before { color: #c084fc; }

        .mal-rating-badge.loading { 
            background: rgba(0, 0, 0, 0.8); 
            min-width: unset; 
            padding: 6px 10px;
            pointer-events: none;
        }
        .mal-rating-badge.error { background: rgba(80, 80, 80, 0.9); color: #bbb; border-color: rgba(255,255,255,0.1); }

        /* Toast Notification */
        #mal-toast {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(30,30,30,0.9); color: white; padding: 10px 20px;
            border-radius: 8px; font-family: sans-serif; font-size: 13px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 9999999;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        #mal-toast.show { opacity: 1; }

        @media (pointer: coarse) { .mal-rating-badge { padding: 6px 10px; top: 8px; right: 8px; } }
        @keyframes malFadeIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes malPulse { from { opacity: 0.5; } to { opacity: 1; } }
    `);

    // === Logic ===
    function getCache(key) {
        const fullKey = CONFIG.CACHE_PREFIX + key;
        const data = GM_getValue(fullKey);
        if (!data) return null;

        const expiryDuration = data.expiryDuration || CONFIG.CACHE_EXPIRY_SUCCESS;

        if (Date.now() - data.timestamp > expiryDuration) {
            GM_deleteValue(fullKey);
            return null;
        }
        return data.payload;
    }

    function setCache(key, payload) {
        // Double check we aren't caching errors
        if (payload.temp || (payload.error && !payload.found)) return;

        const expiryDuration = payload.found ? CONFIG.CACHE_EXPIRY_SUCCESS : CONFIG.CACHE_EXPIRY_ERROR;
        GM_setValue(CONFIG.CACHE_PREFIX + key, {
            payload,
            timestamp: Date.now(),
            expiryDuration: expiryDuration
        });
    }

    // === Menu Command: Clear Cache ===
    function showToast(msg) {
        let toast = document.getElementById('mal-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'mal-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function clearMalCache() {
        const keys = GM_listValues();
        let count = 0;
        keys.forEach(key => {
            if (key.startsWith(CONFIG.CACHE_PREFIX)) {
                GM_deleteValue(key);
                count++;
            }
        });
        showToast(`🗑️ Cleared ${count} items from MAL Cache.`);
    }

    GM_registerMenuCommand("🗑️ Clear MAL Cache", clearMalCache);

    function formatMembers(num) {
        if (!num) return '0';
        return num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' : num >= 1e3 ? (num / 1e3).toFixed(1) + 'K' : num;
    }

    function getSimilarity(s1, s2) {
        const len1 = s1.length, len2 = s2.length;
        const maxDist = Math.max(len1, len2);
        if (len1 === 0 || len2 === 0) return maxDist === 0 ? 1 : 0;
        const row = Array(len1 + 1).fill(0).map((_, i) => i);
        for (let i = 1; i <= len2; i++) {
            let prev = i;
            for (let j = 1; j <= len1; j++) {
                const val = (s2[i - 1] === s1[j - 1]) ? row[j - 1] : Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
                row[j - 1] = prev;
                prev = val;
            }
            row[len1] = prev;
        }
        return 1 - (row[len1] / maxDist);
    }

    function cleanTitle(title) {
        let clean = title
            .replace(/^Title:\s*/i, '') // Remove "Title: " prefix
            .replace(/(\(|\[)\s*(sub|dub|uncensored|tv|bd|blu-ray|4k|hd|special|ova|ona|complete|re-upload).+?(\)|\])/gi, '')
            .replace(/[-:]\s*season\s*\d+/gi, '')
            .replace(/S\d+$/, '')
            .replace(/\s+/g, ' ')
            .trim();

        return clean;
    }

    async function fetchMalData(cleanT) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanT)}&limit=10`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.status === 429) return { status: 429 };

            const json = await res.json();
            const results = json.data || [];

            let bestMatch = null;
            let highestScore = -1;

            if (results.length > 0) {
                const targetLower = cleanT.toLowerCase();
                const targetKey = targetLower.replace(/[^a-z0-9]/g, '');

                // Keywords that imply we are looking for a special type
                const typeKeywords = ['movie', 'special', 'ova', 'film', 'theater'];
                const hasTypeInQuery = typeKeywords.some(k => targetLower.includes(k));

                results.forEach(item => {
                    const titleLower = (item.title || '').toLowerCase();
                    const titleEngLower = (item.title_english || '').toLowerCase();
                    const titleJapLower = (item.title_japanese || '').toLowerCase();

                    const sim1 = getSimilarity(targetLower, titleLower);
                    const sim2 = getSimilarity(targetLower, titleEngLower);
                    const sim3 = getSimilarity(targetLower, titleJapLower);

                    let score = Math.max(sim1, sim2, sim3);

                    // --- Scoring Adjustments ---

                    // 1. Exact Match Bonus
                    // Check strict alphanumeric match to handle "Fullmetal Alchemist: Brotherhood" vs "Fullmetal Alchemist"
                    const itemKey = titleLower.replace(/[^a-z0-9]/g, '');
                    const itemEngKey = titleEngLower.replace(/[^a-z0-9]/g, '');
                    const itemJapKey = titleJapLower.replace(/[^a-z0-9]/g, '');

                    if (targetKey === itemKey || targetKey === itemEngKey || targetKey === itemJapKey) {
                        score += 0.3; // Major boost for exact match
                    } else if ((itemKey.includes(targetKey) && itemKey.length < targetKey.length + 5) ||
                        (itemEngKey.includes(targetKey) && itemEngKey.length < targetKey.length + 5) ||
                        (itemJapKey.includes(targetKey) && itemJapKey.length < targetKey.length + 5)) {
                        score += 0.1; // Minor boost for very close containment
                    }

                    // 2. Type Penalty
                    // If query doesn't ask for Movie/Special, penalize them.
                    const isTypeVariant = ['Movie', 'Special', 'OVA', 'ONA', 'Music'].includes(item.type);
                    if (isTypeVariant && !hasTypeInQuery) {
                        score -= 0.25;
                    }

                    // 3. Popularity Bias as Tie-Breaker
                    // Add tiny score based on log of members to favor popular shows (TV series) over obscure OVAs in ties
                    if (item.members) {
                        score += (Math.log10(item.members) * 0.01);
                    }

                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = item;
                    }
                });
            }

            // Threshold check (slightly lower threshold due to penalties potentially lowering valid scores, 
            // but the exact match bonus raises them)
            // We use 0.45 as a safe baseline since purely different titles will have scores < 0.3 usually.
            if (bestMatch && highestScore > 0.45) {
                return {
                    found: true,
                    score: bestMatch.score ? bestMatch.score : 'N/A',
                    members: formatMembers(bestMatch.members),
                    url: bestMatch.url,
                };
            } else {
                return { found: false };
            }

        } catch (e) {
            return { error: true, temp: true };
        }
    }

    // === Render Logic ===
    function renderBadge(container, data) {
        const existing = container.querySelector('.mal-rating-badge');
        if (existing) existing.remove();

        // If it's a temp error, don't show badge (or show loading state if you prefer)
        if (data.temp && !data.loading) return;
        if (data.error && !data.found && !data.loading) return; // Silent fail on error

        const badge = document.createElement('div');
        badge.className = 'mal-rating-badge';
        if (isTouchInteraction) badge.classList.add('mobile-active');

        if (data.loading) {
            badge.classList.add('loading');
            badge.innerText = '• • •';
            badge.style.animation = 'malPulse 0.8s infinite alternate';
        } else if (data.found) {
            badge.title = "View on MyAnimeList";
            badge.innerHTML = `<span class="score">${data.score}</span><span class="members">${data.members}</span>`;

            const numScore = parseFloat(data.score);
            if (!isNaN(numScore)) {
                if (numScore >= 8.0) badge.classList.add('score-gold'); // >8 Golden
                else if (numScore >= 7.0) badge.classList.add('score-green'); // 7-8 Green
                else if (numScore >= 6.0) badge.classList.add('score-orange'); // 6-7 Orange
                else if (numScore >= 5.0) badge.classList.add('score-red'); // 5-6 Red
                else badge.classList.add('score-purple'); // <5 Purple
            } else {
                badge.classList.add('score-purple'); // N/A
            }

            badge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                GM_openInTab(data.url, { active: true });
            }, { once: true });

        } else {
            badge.classList.add('error');
            badge.innerText = '?';
            badge.title = "Not found (Cached 12h)";
        }

        if (!container.classList.contains('mal-container-rel') && window.getComputedStyle(container).position === 'static') {
            container.classList.add('mal-container-rel');
        }

        if (!data.loading) badge.style.animation = '';
        container.appendChild(badge);
    }

    function processItem(item) {
        if (item.querySelector('.mal-rating-badge')) return;

        const titleEl = item.querySelector(CONFIG.SELECTORS.TITLE);
        let title = item.getAttribute('data-title') || item.getAttribute('aria-label');
        if (!title && titleEl) {
            title = titleEl.getAttribute('title') || titleEl.innerText || titleEl.getAttribute('alt');
        }
        if (!title) return;

        const cleanT = cleanTitle(title);
        if (!cleanT || cleanT.length < 2) return;

        const cacheKey = cleanT.toLowerCase().replace(KEY_REGEX, '');
        if (!cacheKey) return;

        const cachedData = getCache(cacheKey);
        if (cachedData) {
            renderBadge(item, cachedData);
            return;
        }

        const interactionId = Date.now() + Math.random().toString();
        item.dataset.malInteraction = interactionId;
        renderBadge(item, { loading: true });

        requestQueue.add(title, cleanT, (data) => {
            if (document.body.contains(item) && item.dataset.malInteraction === interactionId) {
                renderBadge(item, data);
            }
        });
    }

    // === Event Listeners ===
    document.body.addEventListener('mouseover', function (e) {
        if (isTouchInteraction) return;
        const item = e.target.closest(CONFIG.SELECTORS.ITEM);
        if (!item) return;

        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            processItem(item);
        }, CONFIG.DEBOUNCE_DELAY);
    });

    document.body.addEventListener('mouseout', (e) => {
        if (isTouchInteraction) return;
        const item = e.target.closest(CONFIG.SELECTORS.ITEM);
        if (item) {
            if (item.contains(e.relatedTarget)) return;
            clearTimeout(hoverTimeout);
            const badge = item.querySelector('.mal-rating-badge.loading');
            if (badge) {
                badge.remove();
                delete item.dataset.malInteraction;
            }
        }
    });

    // Mobile Logic
    let touchStartX = 0;
    let touchStartY = 0;
    document.body.addEventListener('touchstart', (e) => {
        const item = e.target.closest(CONFIG.SELECTORS.ITEM);
        if (!item) return;
        isTouchInteraction = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        longPressTimeout = setTimeout(() => {
            processItem(item);
            if (navigator.vibrate) navigator.vibrate(40);
        }, CONFIG.LONG_PRESS_DELAY);
    }, { passive: true });

    document.body.addEventListener('touchmove', (e) => {
        if (!longPressTimeout) return;
        if (Math.abs(e.touches[0].clientX - touchStartX) > 15 || Math.abs(e.touches[0].clientY - touchStartY) > 15) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
        }
    }, { passive: true });

    document.body.addEventListener('touchend', () => {
        if (longPressTimeout) clearTimeout(longPressTimeout);
        setTimeout(() => { isTouchInteraction = false; }, 600);
    });

})();