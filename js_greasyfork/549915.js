// ==UserScript==
// @name         AMC Rating Helper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Display Rotten Tomatoes and IMDb ratings next to movie titles on amctheatres site
// @author       wu5bocheng
// @match        *://www.amctheatres.com/movie-theatres/*
// @match        *://www.amctheatres.com/movies/*
// @match        *://www.amctheatres.com/movies
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549915/AMC%20Rating%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549915/AMC%20Rating%20Helper.meta.js
// ==/UserScript==

/*
SETUP INSTRUCTIONS:
1. Get a free OMDb API key from https://www.omdbapi.com/apikey.aspx
2. Replace 'YOUR_OMDB_API_KEY_HERE' with your actual API key
3. Install the script in Tampermonkey/Greasemonkey
4. Visit AMC Theatres website to see ratings displayed next to movie titles

FEATURES:
- Shows IMDb ratings (via OMDb API)
- Shows Rotten Tomatoes ratings (via OMDb API)
- Shows box office information when available
- Hover tooltips with detailed movie information
- Intelligent caching (24-hour cache duration)
- Instant display for previously loaded movies
- Rate limiting to avoid overwhelming APIs
- Loading indicators while fetching data
- Error handling for failed requests
- Clickable ratings that open the respective service
*/
(function () {
    'use strict';

    // Storage keys
    const STORAGE_KEYS = {
        omdbApiKey: 'amc_omdb_api_key'
    };

    // Helpers to get/set API key
    function getStoredApiKey() {
        try { return (GM_getValue(STORAGE_KEYS.omdbApiKey, '') || '').trim(); } catch { return ''; }
    }
    function setStoredApiKey(key) {
        try { GM_setValue(STORAGE_KEYS.omdbApiKey, (key || '').trim()); } catch {}
    }

    // Setup tab rendering (hash or query param triggers it)
    function isSetupMode() {
        try {
            const hash = (location.hash || '').toLowerCase();
            if (hash.includes('#amc-omdb-setup')) return true;
            const qs = new URLSearchParams(location.search);
            return qs.get('amc-omdb-setup') === '1';
        } catch { return false; }
    }

    function renderSetupPage() {
        const existing = document.getElementById('amc-omdb-setup-root');
        if (existing) return;
        const root = document.createElement('div');
        root.id = 'amc-omdb-setup-root';
        root.setAttribute('style', `
            position: fixed; inset: 0; background: #0b1020; color: #fff; z-index: 2147483647;
            display: flex; align-items: center; justify-content: center; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        `);
        const panel = document.createElement('div');
        panel.setAttribute('style', `
            width: min(560px, 92vw); background: #121a34; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,.5);
            padding: 24px; border: 1px solid rgba(255,255,255,.08);
        `);
        panel.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <div style="width:36px; height:36px; border-radius:8px; background:#2a5298; display:flex; align-items:center; justify-content:center; font-weight:800;">AMC</div>
                <div style="font-size:18px; font-weight:700;">AMC Rating Helper – Setup</div>
            </div>
            <div style="font-size:14px; opacity:.9; margin-bottom:16px;">
                Enter your free OMDb API key to enable IMDb and Rotten Tomatoes ratings.
                Get one at <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" style="color:#4ea1ff; text-decoration:underline;">omdbapi.com</a>.
            </div>
            <label style="display:block; font-size:12px; opacity:.8; margin-bottom:6px;">OMDb API Key</label>
            <input id="amc-omdb-key-input" type="text" placeholder="e.g. abcd1234" style="width:100%; box-sizing:border-box; padding:10px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.14); background:#0e152b; color:#fff; outline:none;" />
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:16px;">
                <button id="amc-omdb-cancel" style="padding:8px 12px; border-radius:10px; background:#263154; color:#fff; border:1px solid rgba(255,255,255,.1); cursor:pointer;">Cancel</button>
                <button id="amc-omdb-save" style="padding:8px 12px; border-radius:10px; background:#2a7ade; color:#fff; border:1px solid #2a7ade; cursor:pointer; font-weight:700;">Save & Apply</button>
            </div>
        `;
        root.appendChild(panel);
        document.documentElement.appendChild(root);

        const input = panel.querySelector('#amc-omdb-key-input');
        input.value = getStoredApiKey();
        const close = () => {
            if (root && root.parentNode) root.parentNode.removeChild(root);
            // Clean URL hash if used
            if (location.hash && location.hash.includes('amc-omdb-setup')) {
                try { history.replaceState(null, '', location.pathname + location.search); } catch {}
            }
        };
        panel.querySelector('#amc-omdb-cancel').addEventListener('click', close);
        panel.querySelector('#amc-omdb-save').addEventListener('click', () => {
            const val = (input.value || '').trim();
            if (!val) {
                input.focus();
                input.style.borderColor = '#d9534f';
                return;
            }
            setStoredApiKey(val);
            close();
            // Optionally refresh to apply immediately
            location.reload();
        });
    }

    // Ensure a menu command to open setup
    try {
        GM_registerMenuCommand('AMC Ratings: Set OMDb API Key…', () => {
            // Use current tab: set hash and render
            try { location.hash = '#amc-omdb-setup'; } catch {}
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', renderSetupPage, { once: true });
            } else {
                renderSetupPage();
            }
        });
    } catch {}

    // First-run onboarding: open setup in current tab if key missing
    try {
        const hasKey = !!getStoredApiKey();
        if (!hasKey) {
            try { location.hash = '#amc-omdb-setup'; } catch {}
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', renderSetupPage, { once: true });
            } else {
                renderSetupPage();
            }
        }
    } catch {}

    // If in setup mode, render setup UI
    if (isSetupMode()) {
        // Defer to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderSetupPage);
        } else {
            renderSetupPage();
        }
    }

    // Use stored key for requests
    function getApiKey() {
        const key = getStoredApiKey();
        return key && key.length > 0 ? key : null;
    }

    // Rate limiting to avoid overwhelming APIs
    const requestQueue = [];
    const maxConcurrentRequests = 10; // Increased for faster processing
    let activeRequests = 0;

    // Cache for storing ratings to avoid repeated API calls
    const ratingsCache = new Map();
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Cache management functions
    function getCacheKey(title) {
        return cleanTitle(title).toLowerCase().trim();
    }

    function getCachedRatings(title) {
        const key = getCacheKey(title);
        const cached = ratingsCache.get(key);

        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            return cached.data;
        }

        return null;
    }

    function setCachedRatings(title, ratings) {
        const key = getCacheKey(title);
        ratingsCache.set(key, {
            data: ratings,
            timestamp: Date.now()
        });
    }

    function clearExpiredCache() {
        const now = Date.now();
        for (const [key, value] of ratingsCache.entries()) {
            if (now - value.timestamp >= CACHE_DURATION) {
                ratingsCache.delete(key);
            }
        }
    }

    // Rate limiting function
    function rateLimitedRequest(requestFn) {
        return new Promise((resolve, reject) => {
            requestQueue.push({ requestFn, resolve, reject });
            processQueue();
        });
    }

    function processQueue() {
        if (activeRequests >= maxConcurrentRequests || requestQueue.length === 0) {
            return;
        }

        activeRequests++;
        const { requestFn, resolve, reject } = requestQueue.shift();

        requestFn()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                activeRequests--;
                processQueue();
            });
    }

    function cleanTitle(title) {
        let clean = title.trim();
        // General removals
        clean = clean.replace(/\bQ&A.*$/i, "");
        clean = clean.split("/")[0];
        clean = clean.replace(/[-–]\s*studio ghibli fest\s*\d{4}/gi, "");
        clean = clean.replace(/\bstudio ghibli fest\s*\d{4}/gi, "");
        clean = clean.replace(/\bstudio ghibli fest\b/gi, "");
        clean = clean.replace(/[-–]\s*\d+(st|nd|rd|th)?\s+anniversary\b/gi, "");
        clean = clean.replace(/\b\d+(st|nd|rd|th)?\s+anniversary\b/gi, "");
        clean = clean.replace(/\bunrated\b/gi, "");
        clean = clean.replace(/\b4k\b/gi, "");
        clean = clean.replace(/\b3d\b/gi, "");
        clean = clean.replace(/\bfathom\s*\d{4}\b/gi, "");
        clean = clean.replace(/\bfathom\b/gi, "");
        clean = clean.replace(/\bopening night fan event\b/gi, "");
        clean = clean.replace(/\bopening night\b/gi, "");
        clean = clean.replace(/\bfan event\b/gi, "");
        clean = clean.replace(/\bspecial screening\b/gi, "");
        clean = clean.replace(/\bdouble feature\b/gi, "");
        clean = clean.replace(/\([^)]*\)/g, "");
        // Targeted cleanups
        const cutPhrases = [
            " - Opening Weekend Event",
            "Private Theatre",
            "Early Access",
            "Sneak Peak",
            "IMAX",
            "Sensory Friendly Screening"
        ];
        for (let phrase of cutPhrases) {
            const regex = new RegExp(`[:\\-]?\\s*${phrase}.*$`, "i");
            clean = clean.replace(regex, "");
        }
        return clean.trim();
    }

    // Helper function to parse OMDb data consistently
    function parseOMDbData(data) {
        const imdb = data.imdbRating || null;
        const imdbId = data.imdbID || null;
        const rottenTomatoes = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || null;
        const boxOffice = data.BoxOffice || null;

        // Extract additional movie details for tooltip
        const movieDetails = {
            title: data.Title,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            poster: data.Poster,
            metascore: data.Metascore,
            imdbVotes: data.imdbVotes,
            type: data.Type,
            dvd: data.DVD,
            production: data.Production,
            website: data.Website
        };

        return { imdb, imdbId, rottenTomatoes, boxOffice, movieDetails };
    }

    // Create search-friendly title variants
    function createSearchVariants(title) {
        const cleaned = cleanTitle(title);
        const variants = [cleaned];

        // Remove subtitles
        const noSubtitle = cleaned.split(':')[0].trim();
        if (noSubtitle !== cleaned) variants.push(noSubtitle);

        // Remove "The" from beginning
        if (cleaned.startsWith('The ')) variants.push(cleaned.substring(4));

        // Remove descriptive words
        const simplified = cleaned.replace(/\b(movie|film|the movie|infinity castle)\b/gi, '').trim();
        if (simplified !== cleaned && simplified.length > 3) variants.push(simplified);

        return [...new Set(variants)];
    }

    // Search for movie using OMDb search API
    function searchOMDbMovie(title) {
        const variants = createSearchVariants(title);

        async function tryVariant(index) {
            if (index >= variants.length) return null;

            const API_KEY = getApiKey();
            if (!API_KEY) return null;

            const searchTitle = variants[index];
            return new Promise((resolve) => {
                const searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTitle)}&apikey=${API_KEY}&type=movie`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: searchUrl,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.Response === 'True' && data.Search && data.Search.length > 0) {
                                resolve(data.Search[0].imdbID);
                            } else {
                                tryVariant(index + 1).then(resolve);
                            }
                        } catch (error) {
                            tryVariant(index + 1).then(resolve);
                        }
                    },
                    onerror: function() {
                        tryVariant(index + 1).then(resolve);
                    }
                });
            });
        }

        return rateLimitedRequest(() => tryVariant(0));
    }

    // Fetch detailed movie info by IMDb ID
    function fetchOMDbByID(imdbId) {
        return rateLimitedRequest(() => {
            return new Promise((resolve) => {
                const API_KEY = getApiKey();
                if (!API_KEY) {
                    resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                    return;
                }
                const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${API_KEY}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.Response === 'True') {
                                resolve(parseOMDbData(data));
                            } else {
                                resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                            }
                        } catch (error) {
                            resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                        }
                    },
                    onerror: function() {
                        resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                    }
                });
            });
        });
    }

    // Fetch ratings from OMDb API with search fallback
    function fetchOMDbRatings(title) {
        const cached = getCachedRatings(title);
        if (cached && cached.omdb) {
            return Promise.resolve(cached.omdb);
        }

        return rateLimitedRequest(() => {
            return new Promise((resolve) => {
                const API_KEY = getApiKey();
                if (!API_KEY) {
                    console.warn('OMDb API key not set. Open the menu "AMC Ratings: Set OMDb API Key…" to configure.');
                    resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                    return;
                }

                const directUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: directUrl,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.Response === 'True') {
                                const ratings = parseOMDbData(data);
                                const existingCache = getCachedRatings(title) || {};
                                setCachedRatings(title, { ...existingCache, omdb: ratings });
                                resolve(ratings);
                            } else {
                                searchOMDbMovie(title).then(imdbId => {
                                    if (imdbId) {
                                        fetchOMDbByID(imdbId).then(ratings => {
                                            const existingCache = getCachedRatings(title) || {};
                                            setCachedRatings(title, { ...existingCache, omdb: ratings });
                                            resolve(ratings);
                                        }).catch(() => {
                                            resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                                        });
                                    } else {
                                        resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                                    }
                                }).catch(() => {
                                    resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                                });
                            }
                        } catch (error) {
                            resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                        }
                    },
                    onerror: function() {
                        resolve({ imdb: null, imdbId: null, rottenTomatoes: null, boxOffice: null, movieDetails: null });
                    }
                });
            });
        });
    }


    // Rotten Tomatoes slug
    function makeRtSlug(title) {
        let clean = cleanTitle(title).toLowerCase();
        clean = clean.replace(/&/g, " and ");
        clean = clean.replace(/[':;!?,.\-–]/g, "");
        clean = clean.replace(/\s+/g, "_");
        clean = clean.replace(/^_+|_+$/g, "");
        return clean.trim();
    }


    // Create rating display element
    function createRatingElement(service, rating, url, movieDetails = null) {
        const container = document.createElement("div");
        container.className = `${service}-rating`;
        container.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            position: relative;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            pointer-events: auto;
        `;

        if (url) {
            container.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(url, '_blank');
            };
        }

        // Prevent event bubbling to parent elements
        container.onmousedown = (e) => e.stopPropagation();
        container.onmouseup = (e) => e.stopPropagation();

        // Simplified hover handling - tooltip won't interfere due to pointer-events: none
        let showTimeout = null;
        let hideTimeout = null;
        let isShowing = false;

        container.addEventListener('mouseenter', (e) => {
            e.stopPropagation();

            if (isShowing) return;


            // Clear any pending hide timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            if (movieDetails) {
                showTimeout = setTimeout(() => {
                    if (!isShowing) {
                        showTooltip(container, movieDetails);
                        isShowing = true;
                    }
                }, 150); // Reduced delay for faster response
            }
        });

        container.addEventListener('mouseleave', (e) => {
            e.stopPropagation();


            // Clear any pending show timeout
            if (showTimeout) {
                clearTimeout(showTimeout);
                showTimeout = null;
            }

            if (movieDetails && isShowing) {
                hideTimeout = setTimeout(() => {
                    hideTooltip(container);
                    isShowing = false;
                }, 200);
            }
        });

        // Set colors and content based on service
        switch (service) {
            case 'imdb':
                container.style.backgroundColor = '#f5c518';
                container.style.color = '#000';
                container.innerHTML = `IMDb: ${rating || 'N/A'}`;
                break;
            case 'rotten':
                container.style.backgroundColor = '#d92323';
                container.style.color = '#fff';
                container.innerHTML = `🍅 ${rating || 'N/A'}`;
                break;
        }

        return container;
    }

    // Create loading indicator
    function createLoadingElement() {
        const loading = document.createElement("div");
        loading.className = "ratings-loading";
        loading.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            color: #666;
            background-color: #f0f0f0;
        `;
        loading.textContent = "Loading ratings...";
        return loading;
    }

    // Helper function to validate box office data
    function isValidBoxOffice(boxOffice) {
        if (!boxOffice) {
            return false;
        }
        if (typeof boxOffice !== 'string') {
            return false;
        }
        const trimmed = boxOffice.trim();
        if (trimmed === '' || trimmed === 'N/A' || trimmed === 'null' || trimmed === 'undefined') {
            return false;
        }
        // Check if it contains any currency symbols or numbers
        const isValid = /[\$£€¥₹]|\d/.test(trimmed);
        return isValid;
    }

    // Create box office element
    function createBoxOfficeElement(boxOffice) {
        // Clean up box office value
        let cleanBoxOffice = boxOffice;
        if (typeof cleanBoxOffice === 'string') {
            cleanBoxOffice = cleanBoxOffice.trim();
        }

        const container = document.createElement("div");
        container.className = "box-office";
        container.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-decoration: none;
            cursor: default;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            background-color: #4caf50;
            color: white;
        `;
        container.innerHTML = `💰 ${cleanBoxOffice}`;

        // Prevent event bubbling
        container.onmousedown = (e) => e.stopPropagation();
        container.onmouseup = (e) => e.stopPropagation();
        container.onmouseover = (e) => e.stopPropagation();
        container.onmouseout = (e) => e.stopPropagation();

        return container;
    }

    // Create tooltip element
    function createTooltip(movieDetails) {
        if (!movieDetails) return null;

        const tooltip = document.createElement("div");
        tooltip.className = "movie-tooltip";
        tooltip.style.cssText = `
            position: absolute;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 400px;
            font-size: 13px;
            line-height: 1.4;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            border: 1px solid rgba(255,255,255,0.1);
            visibility: visible;
            display: block;
        `;

        // Create tooltip content
        let content = `<div style="display: flex; gap: 12px; margin-bottom: 12px;">`;

        // Poster
        if (movieDetails.poster && movieDetails.poster !== 'N/A') {
            content += `
                <img src="${movieDetails.poster}"
                     style="width: 80px; height: 120px; object-fit: cover; border-radius: 6px; flex-shrink: 0;"
                     onerror="this.style.display='none'">
            `;
        }

        // Basic info
        content += `
            <div style="flex: 1;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #ffd700;">
                    ${movieDetails.title} (${movieDetails.year})
                </div>
                <div style="margin-bottom: 4px;"><strong>Rated:</strong> ${movieDetails.rated || 'N/A'}</div>
                <div style="margin-bottom: 4px;"><strong>Runtime:</strong> ${movieDetails.runtime || 'N/A'}</div>
                <div style="margin-bottom: 4px;"><strong>Genre:</strong> ${movieDetails.genre || 'N/A'}</div>
                <div style="margin-bottom: 4px;"><strong>Released:</strong> ${movieDetails.released || 'N/A'}</div>
            </div>
        </div>`;

        // Plot
        if (movieDetails.plot && movieDetails.plot !== 'N/A') {
            content += `<div style="margin-bottom: 12px;"><strong>Plot:</strong><br>${movieDetails.plot}</div>`;
        }

        // Crew and cast
        content += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">`;

        if (movieDetails.director && movieDetails.director !== 'N/A') {
            content += `<div><strong>Director:</strong><br>${movieDetails.director}</div>`;
        }

        if (movieDetails.actors && movieDetails.actors !== 'N/A') {
            const actors = movieDetails.actors.split(',').slice(0, 3).join(', ');
            content += `<div><strong>Cast:</strong><br>${actors}${movieDetails.actors.split(',').length > 3 ? '...' : ''}</div>`;
        }

        content += `</div>`;

        // Additional info
        if (movieDetails.awards && movieDetails.awards !== 'N/A') {
            content += `<div style="margin-bottom: 8px;"><strong>Awards:</strong> ${movieDetails.awards}</div>`;
        }

        if (movieDetails.country && movieDetails.country !== 'N/A') {
            content += `<div style="margin-bottom: 8px;"><strong>Country:</strong> ${movieDetails.country}</div>`;
        }

        if (movieDetails.language && movieDetails.language !== 'N/A') {
            content += `<div style="margin-bottom: 8px;"><strong>Language:</strong> ${movieDetails.language}</div>`;
        }

        tooltip.innerHTML = content;

        // Tooltip has pointer-events: none, so no mouse handlers needed

        return tooltip;
    }

    // Show tooltip
    function showTooltip(element, movieDetails) {
        if (!movieDetails) {
            return;
        }

        // Check if tooltip already exists
        if (element._tooltip) {
            return;
        }

        // Hide any existing tooltip first
        hideTooltip(element);

        const tooltip = createTooltip(movieDetails);
        if (!tooltip) return;

        // Force a reflow to get accurate dimensions
        tooltip.offsetHeight;

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();


        // Position tooltip
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.setAttribute('style', `
            position: fixed !important;
            left: ${left}px !important;
            top: ${top}px !important;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            color: white !important;
            padding: 16px !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
            z-index: 999999 !important;
            max-width: 400px !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            pointer-events: none !important;
        `);

        // Append to documentElement for maximum compatibility
        document.documentElement.appendChild(tooltip);



        // Store reference for cleanup
        element._tooltip = tooltip;
    }

    // Hide tooltip
    function hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.style.opacity = '0';
            element._tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (element._tooltip && element._tooltip.parentNode) {
                    element._tooltip.parentNode.removeChild(element._tooltip);
                }
                element._tooltip = null;
                // Reset hovering state
                element.isHovering = false;
            }, 300);
        }
    }

    async function addRatings() {
        const movieTitleEls = document.querySelectorAll(".md\\:text-2xl.font-bold, h3 > a.headline, h1.headline");

        movieTitleEls.forEach(async (movieTitleEl) => {
            const rawTitle = movieTitleEl.textContent.trim();
            if (!rawTitle || /amc/i.test(rawTitle)) return;
            if (movieTitleEl.querySelector(".ratings-container")) return;

            const cleanTitleText = cleanTitle(rawTitle);

            // Check if we have all ratings cached
            const cached = getCachedRatings(cleanTitleText);
            const hasAllCached = cached &&
                cached.omdb &&
                (cached.omdb.imdb !== null || cached.omdb.rottenTomatoes !== null);

            // Create container for all ratings
            const ratingsContainer = document.createElement("div");
            ratingsContainer.className = "ratings-container";
            ratingsContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                margin-left: 8px;
                gap: 4px;
                position: relative;
                z-index: 10;
            `;

            // Prevent event bubbling to parent elements (AMC navigation)
            ratingsContainer.onmousedown = (e) => e.stopPropagation();
            ratingsContainer.onmouseup = (e) => e.stopPropagation();
            ratingsContainer.onclick = (e) => e.stopPropagation();

            // If we have cached data, show it immediately
            if (hasAllCached) {
                // Use IMDb ID if available, otherwise fall back to search
                const imdbUrl = cached.omdb.imdbId
                    ? `https://www.imdb.com/title/${cached.omdb.imdbId}/`
                    : `https://www.imdb.com/find/?q=${encodeURIComponent(cleanTitleText)}`;
                const rtSlug = makeRtSlug(rawTitle);
                const rtUrl = `https://www.rottentomatoes.com/m/${rtSlug}`;

                // Add IMDb rating
                const imdbEl = createRatingElement('imdb', cached.omdb.imdb, imdbUrl, cached.omdb.movieDetails);
                ratingsContainer.appendChild(imdbEl);

                // Add Rotten Tomatoes rating
                const rtEl = createRatingElement('rotten', cached.omdb.rottenTomatoes, rtUrl, cached.omdb.movieDetails);
                ratingsContainer.appendChild(rtEl);

                // Add box office if available
                if (isValidBoxOffice(cached.omdb.boxOffice)) {
                    const boxOfficeEl = createBoxOfficeElement(cached.omdb.boxOffice);
                    ratingsContainer.appendChild(boxOfficeEl);
                }

                movieTitleEl.appendChild(ratingsContainer);
                return;
            }

            // Add loading indicator for non-cached data
            const loadingEl = createLoadingElement();
            ratingsContainer.appendChild(loadingEl);
            movieTitleEl.appendChild(ratingsContainer);

            try {
                // Fetch ratings
                const omdbRatings = await fetchOMDbRatings(cleanTitleText);

                // Remove loading indicator
                ratingsContainer.removeChild(loadingEl);

                // Create rating elements
                // Use IMDb ID if available, otherwise fall back to search
                const imdbUrl = omdbRatings.imdbId
                    ? `https://www.imdb.com/title/${omdbRatings.imdbId}/`
                    : `https://www.imdb.com/find/?q=${encodeURIComponent(cleanTitleText)}`;
                const rtSlug = makeRtSlug(rawTitle);
                const rtUrl = `https://www.rottentomatoes.com/m/${rtSlug}`;

                // Add IMDb rating
                const imdbEl = createRatingElement('imdb', omdbRatings.imdb, imdbUrl, omdbRatings.movieDetails);
                ratingsContainer.appendChild(imdbEl);

                // Add Rotten Tomatoes rating
                const rtEl = createRatingElement('rotten', omdbRatings.rottenTomatoes, rtUrl, omdbRatings.movieDetails);
                ratingsContainer.appendChild(rtEl);

                // Add box office if available
                if (isValidBoxOffice(omdbRatings.boxOffice)) {
                    const boxOfficeEl = createBoxOfficeElement(omdbRatings.boxOffice);
                    ratingsContainer.appendChild(boxOfficeEl);
                }

            } catch (error) {
                // Remove loading and show error
                ratingsContainer.removeChild(loadingEl);
                const errorEl = document.createElement("div");
                errorEl.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    margin-left: 8px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    color: #d32f2f;
                    background-color: #ffebee;
                `;
                errorEl.textContent = "Error loading ratings";
                ratingsContainer.appendChild(errorEl);
            }
        });
    }

    // Clean up tooltips
    function cleanupTooltips() {
        const tooltips = document.querySelectorAll('.movie-tooltip');
        tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }

    // Initialize script
    clearExpiredCache(); // Clean up expired cache entries on startup
    addRatings();
    const observer = new MutationObserver(() => {
        cleanupTooltips(); // Clean up tooltips when DOM changes
        addRatings();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
