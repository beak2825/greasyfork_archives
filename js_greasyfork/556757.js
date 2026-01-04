// ==UserScript==
// @name         Twitter Account Location Flag
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Shows country flag emoji next to Twitter usernames based on account location
// @author       X1aoS0ng
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      x.com
// @connect      twitter.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556757/Twitter%20Account%20Location%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/556757/Twitter%20Account%20Location%20Flag.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Region Emojis Mapping (US State Flags) ====================
    const REGION_EMOJIS = {
        "East Asia & Pacific": "🌏",
        "Europe & Central Asia": "🌍",
        "Latin America & Caribbean": "🌎",
        "Middle East & North Africa": "🕌",
        "North America": "🌎",
        "South Asia": "🌏",
        "Sub-Saharan Africa": "🌍",
        "Global": "🌐",
        "Worldwide": "🌐"
    };

    // ==================== Country Flags Mapping ====================
    const COUNTRY_FLAGS = {
        // A
        "Afghanistan": "🇦🇫",
        "Albania": "🇦🇱",
        "Algeria": "🇩🇿",
        "Andorra": "🇦🇩",
        "Angola": "🇦🇴",
        "Antigua and Barbuda": "🇦🇬",
        "Argentina": "🇦🇷",
        "Armenia": "🇦🇲",
        "Australia": "🇦🇺",
        "Austria": "🇦🇹",
        "Azerbaijan": "🇦🇿",
        // B
        "Bahamas": "🇧🇸",
        "Bahrain": "🇧🇭",
        "Bangladesh": "🇧🇩",
        "Barbados": "🇧🇧",
        "Belarus": "🇧🇾",
        "Belgium": "🇧🇪",
        "Belize": "🇧🇿",
        "Benin": "🇧🇯",
        "Bhutan": "🇧🇹",
        "Bolivia": "🇧🇴",
        "Bosnia and Herzegovina": "🇧🇦",
        "Botswana": "🇧🇼",
        "Brazil": "🇧🇷",
        "Brunei": "🇧🇳",
        "Bulgaria": "🇧🇬",
        "Burkina Faso": "🇧🇫",
        "Burundi": "🇧🇮",
        // C
        "Cambodia": "🇰🇭",
        "Cameroon": "🇨🇲",
        "Canada": "🇨🇦",
        "Cape Verde": "🇨🇻",
        "Central African Republic": "🇨🇫",
        "Chad": "🇹🇩",
        "Chile": "🇨🇱",
        "China": "🇨🇳",
        "Colombia": "🇨🇴",
        "Comoros": "🇰🇲",
        "Congo": "🇨🇬",
        "Costa Rica": "🇨🇷",
        "Croatia": "🇭🇷",
        "Cuba": "🇨🇺",
        "Cyprus": "🇨🇾",
        "Czech Republic": "🇨🇿",
        "Czechia": "🇨🇿",
        // D
        "Democratic Republic of the Congo": "🇨🇩",
        "Denmark": "🇩🇰",
        "Djibouti": "🇩🇯",
        "Dominica": "🇩🇲",
        "Dominican Republic": "🇩🇴",
        // E
        "Ecuador": "🇪🇨",
        "Egypt": "🇪🇬",
        "El Salvador": "🇸🇻",
        "Equatorial Guinea": "🇬🇶",
        "Eritrea": "🇪🇷",
        "Estonia": "🇪🇪",
        "Eswatini": "🇸🇿",
        "Ethiopia": "🇪🇹",
        "Europe": "🇪🇺",
        "European Union": "🇪🇺",
        // F
        "Fiji": "🇫🇯",
        "Finland": "🇫🇮",
        "France": "🇫🇷",
        // G
        "Gabon": "🇬🇦",
        "Gambia": "🇬🇲",
        "Georgia": "🇬🇪",
        "Germany": "🇩🇪",
        "Ghana": "🇬🇭",
        "Greece": "🇬🇷",
        "Grenada": "🇬🇩",
        "Guatemala": "🇬🇹",
        "Guinea": "🇬🇳",
        "Guinea-Bissau": "🇬🇼",
        "Guyana": "🇬🇾",
        // H
        "Haiti": "🇭🇹",
        "Honduras": "🇭🇳",
        "Hong Kong": "🇭🇰",
        "Hungary": "🇭🇺",
        // I
        "Iceland": "🇮🇸",
        "India": "🇮🇳",
        "Indonesia": "🇮🇩",
        "Iran": "🇮🇷",
        "Iraq": "🇮🇶",
        "Ireland": "🇮🇪",
        "Israel": "🇮🇱",
        "Italy": "🇮🇹",
        "Ivory Coast": "🇨🇮",
        // J
        "Jamaica": "🇯🇲",
        "Japan": "🇯🇵",
        "Jordan": "🇯🇴",
        // K
        "Kazakhstan": "🇰🇿",
        "Kenya": "🇰🇪",
        "Kiribati": "🇰🇮",
        "Korea": "🇰🇷",
        "Kosovo": "🇽🇰",
        "Kuwait": "🇰🇼",
        "Kyrgyzstan": "🇰🇬",
        // L
        "Laos": "🇱🇦",
        "Latvia": "🇱🇻",
        "Lebanon": "🇱🇧",
        "Lesotho": "🇱🇸",
        "Liberia": "🇱🇷",
        "Libya": "🇱🇾",
        "Liechtenstein": "🇱🇮",
        "Lithuania": "🇱🇹",
        "Luxembourg": "🇱🇺",
        // M
        "Madagascar": "🇲🇬",
        "Malawi": "🇲🇼",
        "Malaysia": "🇲🇾",
        "Maldives": "🇲🇻",
        "Mali": "🇲🇱",
        "Malta": "🇲🇹",
        "Marshall Islands": "🇲🇭",
        "Mauritania": "🇲🇷",
        "Mauritius": "🇲🇺",
        "Mexico": "🇲🇽",
        "Micronesia": "🇫🇲",
        "Moldova": "🇲🇩",
        "Monaco": "🇲🇨",
        "Mongolia": "🇲🇳",
        "Montenegro": "🇲🇪",
        "Morocco": "🇲🇦",
        "Mozambique": "🇲🇿",
        "Myanmar": "🇲🇲",
        // N
        "Namibia": "🇳🇦",
        "Nauru": "🇳🇷",
        "Nepal": "🇳🇵",
        "Netherlands": "🇳🇱",
        "New Zealand": "🇳🇿",
        "Nicaragua": "🇳🇮",
        "Niger": "🇳🇪",
        "Nigeria": "🇳🇬",
        "North Korea": "🇰🇵",
        "North Macedonia": "🇲🇰",
        "Norway": "🇳🇴",
        // O
        "Oman": "🇴🇲",
        // P
        "Pakistan": "🇵🇰",
        "Palau": "🇵🇼",
        "Palestine": "🇵🇸",
        "Panama": "🇵🇦",
        "Papua New Guinea": "🇵🇬",
        "Paraguay": "🇵🇾",
        "Peru": "🇵🇪",
        "Philippines": "🇵🇭",
        "Poland": "🇵🇱",
        "Portugal": "🇵🇹",
        // Q
        "Qatar": "🇶🇦",
        // R
        "Romania": "🇷🇴",
        "Russia": "🇷🇺",
        "Rwanda": "🇷🇼",
        // S
        "Saint Kitts and Nevis": "🇰🇳",
        "Saint Lucia": "🇱🇨",
        "Saint Vincent and the Grenadines": "🇻🇨",
        "Samoa": "🇼🇸",
        "San Marino": "🇸🇲",
        "Sao Tome and Principe": "🇸🇹",
        "Saudi Arabia": "🇸🇦",
        "Senegal": "🇸🇳",
        "Serbia": "🇷🇸",
        "Seychelles": "🇸🇨",
        "Sierra Leone": "🇸🇱",
        "Singapore": "🇸🇬",
        "Slovakia": "🇸🇰",
        "Slovenia": "🇸🇮",
        "Solomon Islands": "🇸🇧",
        "Somalia": "🇸🇴",
        "South Africa": "🇿🇦",
        "South Korea": "🇰🇷",
        "South Sudan": "🇸🇸",
        "Spain": "🇪🇸",
        "Sri Lanka": "🇱🇰",
        "Sudan": "🇸🇩",
        "Suriname": "🇸🇷",
        "Sweden": "🇸🇪",
        "Switzerland": "🇨🇭",
        "Syria": "🇸🇾",
        // T
        "Taiwan": "🇹🇼",
        "Tajikistan": "🇹🇯",
        "Tanzania": "🇹🇿",
        "Thailand": "🇹🇭",
        "Timor-Leste": "🇹🇱",
        "Togo": "🇹🇬",
        "Tonga": "🇹🇴",
        "Trinidad and Tobago": "🇹🇹",
        "Tunisia": "🇹🇳",
        "Turkey": "🇹🇷",
        "Turkmenistan": "🇹🇲",
        "Tuvalu": "🇹🇻",
        // U
        "Uganda": "🇺🇬",
        "Ukraine": "🇺🇦",
        "United Arab Emirates": "🇦🇪",
        "United Kingdom": "🇬🇧",
        "United States": "🇺🇸",
        "Uruguay": "🇺🇾",
        "Uzbekistan": "🇺🇿",
        // V
        "Vanuatu": "🇻🇺",
        "Vatican City": "🇻🇦",
        "Venezuela": "🇻🇪",
        "Vietnam": "🇻🇳",
        // Y
        "Yemen": "🇾🇪",
        // Z
        "Zambia": "🇿🇲",
        "Zimbabwe": "🇿🇼"
    };


    function getCountryFlag(locationName) {
        if (!locationName) {
            return null;
        }

        // Try region emojis first (exact match)
        if (REGION_EMOJIS[locationName]) {
            return REGION_EMOJIS[locationName];
        }

        // Try country flags (exact match)
        if (COUNTRY_FLAGS[locationName]) {
            return COUNTRY_FLAGS[locationName];
        }

        // Try case-insensitive match in regions
        const normalized = locationName.trim();
        for (const [region, emoji] of Object.entries(REGION_EMOJIS)) {
            if (region.toLowerCase() === normalized.toLowerCase()) {
                return emoji;
            }
        }

        // Try case-insensitive match in countries
        for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
            if (country.toLowerCase() === normalized.toLowerCase()) {
                return flag;
            }
        }

        return null;
    }

    // ==================== Cache Management ====================
    let locationCache = new Map();
    const CACHE_KEY = 'twitter_location_cache';
    const CACHE_EXPIRY_DAYS = 30;

    // Load cache from GM storage
    function loadCache() {
        try {
            const cached = GM_getValue(CACHE_KEY, '{}');
            const cacheObj = JSON.parse(cached);
            const now = Date.now();

            for (const [username, data] of Object.entries(cacheObj)) {
                if (data.expiry && data.expiry > now && data.location !== null) {
                    locationCache.set(username, data.location);
                }
            }
        } catch (error) {
        }
    }

    // Save cache to GM storage
    function saveCache() {
        try {
            const cacheObj = {};
            const now = Date.now();
            const expiry = now + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

            for (const [username, location] of locationCache.entries()) {
                cacheObj[username] = {
                    location: location,
                    expiry: expiry,
                    cachedAt: now
                };
            }

            GM_setValue(CACHE_KEY, JSON.stringify(cacheObj));
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }

    // Save a single entry to cache
    function saveCacheEntry(username, location) {
        locationCache.set(username, location);
        if (!saveCacheEntry.timeout) {
            saveCacheEntry.timeout = setTimeout(() => {
                saveCache();
                saveCacheEntry.timeout = null;
            }, 5000);
        }
    }

    // ==================== Rate Limiting ====================
    const requestQueue = [];
    let isProcessingQueue = false;
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 2000;
    const MAX_CONCURRENT_REQUESTS = 2;
    let activeRequests = 0;
    let rateLimitResetTime = 0;
    const processingUsernames = new Set();

    // ==================== Direct API Call (No Page Script Needed) ====================

    // Get CSRF token from cookies
    function getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'ct0') {
                return value;
            }
        }
        return null;
    }

    // Debug: Log all cookies to find the auth token
    function debugCookies() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
        }
    }

    function fetchLocationFromAPI(screenName) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCsrfToken();

            if (!csrfToken) {
                debugCookies();
                resolve(null);
                return;
            }

            const variables = JSON.stringify({ screenName: screenName });
            const url = `https://x.com/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery?variables=${encodeURIComponent(variables)}`;

            // Use GM_xmlhttpRequest which automatically includes cookies
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                    'X-Csrf-Token': csrfToken,
                    'X-Twitter-Auth-Type': 'OAuth2Session',
                    'X-Twitter-Active-User': 'yes',
                    'Content-Type': 'application/json'
                },
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const location = data?.data?.user_result_by_screen_name?.result?.about_profile?.account_based_in || null;
                            resolve(location);
                        } catch (error) {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                },
                onerror: function (error) {
                    resolve(null);
                }
            });
        });
    }

    // ==================== API Request Functions ====================
    async function processRequestQueue() {
        if (isProcessingQueue || requestQueue.length === 0) return;

        if (rateLimitResetTime > 0) {
            const now = Math.floor(Date.now() / 1000);
            if (now < rateLimitResetTime) {
                const waitTime = (rateLimitResetTime - now) * 1000;
                setTimeout(processRequestQueue, Math.min(waitTime, 60000));
                return;
            } else {
                rateLimitResetTime = 0;
            }
        }

        isProcessingQueue = true;

        while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
            const now = Date.now();
            const timeSinceLastRequest = now - lastRequestTime;

            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
            }

            const { screenName, resolve, reject } = requestQueue.shift();
            activeRequests++;
            lastRequestTime = Date.now();

            makeLocationRequest(screenName)
                .then(location => resolve(location))
                .catch(error => reject(error))
                .finally(() => {
                    activeRequests--;
                    setTimeout(processRequestQueue, 200);
                });
        }

        isProcessingQueue = false;
    }

    async function makeLocationRequest(screenName) {
        try {
            const location = await fetchLocationFromAPI(screenName);

            if (location) {
                saveCacheEntry(screenName, location);
            } else {
                saveCacheEntry(screenName, null);
            }

            return location;
        } catch (error) {
            return null;
        }
    }

    async function getUserLocation(screenName) {
        if (locationCache.has(screenName)) {
            const cached = locationCache.get(screenName);
            if (cached !== null) {
                return cached;
            } else {
                locationCache.delete(screenName);
            }
        }

        return new Promise((resolve, reject) => {
            requestQueue.push({ screenName, resolve, reject });
            processRequestQueue();
        });
    }

    // ==================== Username Extraction ====================
    function extractUsername(element) {
        const usernameElement = element.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');
        if (usernameElement) {
            const links = usernameElement.querySelectorAll('a[href^="/"]');
            for (const link of links) {
                const href = link.getAttribute('href');
                const match = href.match(/^\/([^\/\?]+)/);
                if (match && match[1]) {
                    const username = match[1];
                    const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities'];
                    if (!excludedRoutes.includes(username) &&
                        !username.startsWith('hashtag') &&
                        !username.startsWith('search') &&
                        username.length > 0 &&
                        username.length < 20) {
                        return username;
                    }
                }
            }
        }

        const allLinks = element.querySelectorAll('a[href^="/"]');
        const seenUsernames = new Set();

        for (const link of allLinks) {
            const href = link.getAttribute('href');
            if (!href) continue;

            const match = href.match(/^\/([^\/\?]+)/);
            if (!match || !match[1]) continue;

            const potentialUsername = match[1];
            if (seenUsernames.has(potentialUsername)) continue;
            seenUsernames.add(potentialUsername);

            const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities', 'hashtag'];
            if (excludedRoutes.some(route => potentialUsername === route || potentialUsername.startsWith(route))) {
                continue;
            }

            if (potentialUsername.includes('status') || potentialUsername.match(/^\d+$/)) {
                continue;
            }

            const text = link.textContent?.trim() || '';
            const linkText = text.toLowerCase();
            const usernameLower = potentialUsername.toLowerCase();

            if (text.startsWith('@')) {
                return potentialUsername;
            }

            if (linkText === usernameLower || linkText === `@${usernameLower}`) {
                return potentialUsername;
            }

            const parent = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
            if (parent) {
                if (potentialUsername.length > 0 && potentialUsername.length < 20 && !potentialUsername.includes('/')) {
                    return potentialUsername;
                }
            }

            if (text && text.trim().startsWith('@')) {
                const atUsername = text.trim().substring(1);
                if (atUsername === potentialUsername) {
                    return potentialUsername;
                }
            }
        }

        const textContent = element.textContent || '';
        const atMentionMatches = textContent.matchAll(/@([a-zA-Z0-9_]+)/g);
        for (const match of atMentionMatches) {
            const username = match[1];
            const link = element.querySelector(`a[href="/${username}"], a[href^="/${username}?"]`);
            if (link) {
                const isInUserNameContainer = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
                if (isInUserNameContainer) {
                    return username;
                }
            }
        }

        return null;
    }

    function findHandleSection(container, screenName) {
        return Array.from(container.querySelectorAll('div')).find(div => {
            const link = div.querySelector(`a[href="/${screenName}"]`);
            if (link) {
                const text = link.textContent?.trim();
                return text === `@${screenName}`;
            }
            return false;
        });
    }

    // ==================== UI Functions ====================
    function createLoadingShimmer() {
        const shimmer = document.createElement('span');
        shimmer.setAttribute('data-twitter-flag-shimmer', 'true');
        shimmer.style.display = 'inline-block';
        shimmer.style.width = '20px';
        shimmer.style.height = '16px';
        shimmer.style.marginLeft = '4px';
        shimmer.style.marginRight = '4px';
        shimmer.style.verticalAlign = 'middle';
        shimmer.style.borderRadius = '2px';
        shimmer.style.background = 'linear-gradient(90deg, rgba(113, 118, 123, 0.2) 25%, rgba(113, 118, 123, 0.4) 50%, rgba(113, 118, 123, 0.2) 75%)';
        shimmer.style.backgroundSize = '200% 100%';
        shimmer.style.animation = 'shimmer 1.5s infinite';

        if (!document.getElementById('twitter-flag-shimmer-style')) {
            const style = document.createElement('style');
            style.id = 'twitter-flag-shimmer-style';
            style.textContent = `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes marquee-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }

        return shimmer;
    }

    // ==================== Add Flag to Username ====================
    async function addFlagToUsername(usernameElement, screenName) {
        if (usernameElement.dataset.flagAdded === 'true') {
            return;
        }

        if (processingUsernames.has(screenName)) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (usernameElement.dataset.flagAdded === 'true') return;
            usernameElement.dataset.flagAdded = 'waiting';
            return;
        }

        usernameElement.dataset.flagAdded = 'processing';
        processingUsernames.add(screenName);

        const userNameContainer = usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

        const shimmerSpan = createLoadingShimmer();
        let shimmerInserted = false;

        if (userNameContainer) {
            const handleSection = findHandleSection(userNameContainer, screenName);
            if (handleSection && handleSection.parentNode) {
                try {
                    handleSection.parentNode.insertBefore(shimmerSpan, handleSection);
                    shimmerInserted = true;
                } catch (e) {
                    try {
                        userNameContainer.appendChild(shimmerSpan);
                        shimmerInserted = true;
                    } catch (e2) {
                    }
                }
            } else {
                try {
                    userNameContainer.appendChild(shimmerSpan);
                    shimmerInserted = true;
                } catch (e) {
                }
            }
        }

        try {
            const location = await getUserLocation(screenName);

            if (shimmerInserted && shimmerSpan.parentNode) {
                shimmerSpan.remove();
            }

            if (!location) {
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            const flag = getCountryFlag(location);
            if (!flag) {
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            let usernameLink = null;
            const containerForLink = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

            if (containerForLink) {
                const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
                for (const link of containerLinks) {
                    const text = link.textContent?.trim();
                    const href = link.getAttribute('href');
                    const match = href.match(/^\/([^\/\?]+)/);

                    if (match && match[1] === screenName) {
                        if (text === `@${screenName}` || text === screenName) {
                            usernameLink = link;
                            break;
                        }
                    }
                }
            }

            if (!usernameLink && containerForLink) {
                const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
                for (const link of containerLinks) {
                    const text = link.textContent?.trim();
                    if (text === `@${screenName}`) {
                        usernameLink = link;
                        break;
                    }
                }
            }

            if (!usernameLink) {
                const links = usernameElement.querySelectorAll('a[href^="/"]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const text = link.textContent?.trim();
                    if ((href === `/${screenName}` || href.startsWith(`/${screenName}?`)) &&
                        (text === `@${screenName}` || text === screenName)) {
                        usernameLink = link;
                        break;
                    }
                }
            }

            if (!usernameLink) {
                const links = usernameElement.querySelectorAll('a[href^="/"]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const match = href.match(/^\/([^\/\?]+)/);
                    if (match && match[1] === screenName) {
                        const hasVerificationBadge = link.closest('[data-testid="User-Name"]')?.querySelector('[data-testid="icon-verified"]');
                        if (!hasVerificationBadge || link.textContent?.trim() === `@${screenName}`) {
                            usernameLink = link;
                            break;
                        }
                    }
                }
            }

            if (!usernameLink) {
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            const existingFlag = usernameElement.querySelector('[data-twitter-flag]');
            if (existingFlag) {
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'true';
                return;
            }

            const flagSpan = document.createElement('span');
            flagSpan.style.display = 'inline-block';
            flagSpan.style.maxWidth = '17px';
            flagSpan.textContent = ` ${flag}`;
            flagSpan.setAttribute('data-twitter-flag', 'true');

            // 尺寸和形状：长方形 + 小圆角
            flagSpan.style.padding = '0px 7px';   // 高度更低
            flagSpan.style.borderRadius = '4px'; // 小圆角，不再是胶囊
            flagSpan.style.fontSize = '1em';  // 更接近 Twitter 的高度
            flagSpan.style.lineHeight = '1.5';     // 避免 emoji 撑高

            // 边框：浅灰色
            flagSpan.style.border = '1px solid rgba(255,255,255,0.4)';

            // 背景：轻微深灰色（更像 Twitter）
            flagSpan.style.background = 'rgba(255,255,255,0.15)';

            // 不需要动画了，去掉更干净
            flagSpan.style.backgroundImage = '';
            flagSpan.style.animation = '';
            flagSpan.style.backgroundClip = '';
            flagSpan.style.backgroundOrigin = '';
            flagSpan.style.backgroundSize = '';


            const containerForFlag = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

            if (!containerForFlag) {
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            const handleSection = findHandleSection(containerForFlag, screenName);
            let inserted = false;

            if (handleSection && handleSection.parentNode === containerForFlag) {
                try {
                    containerForFlag.insertBefore(flagSpan, handleSection);
                    inserted = true;
                } catch (e) {
                }
            }

            if (!inserted && handleSection && handleSection.parentNode) {
                try {
                    const handleParent = handleSection.parentNode;
                    if (handleParent !== containerForFlag && handleParent.parentNode) {
                        handleParent.parentNode.insertBefore(flagSpan, handleParent);
                        inserted = true;
                    } else if (handleParent === containerForFlag) {
                        containerForFlag.insertBefore(flagSpan, handleSection);
                        inserted = true;
                    }
                } catch (e) {
                }
            }

            if (!inserted && handleSection) {
                try {
                    const displayNameLink = containerForFlag.querySelector('a[href^="/"]');
                    if (displayNameLink) {
                        const displayNameContainer = displayNameLink.closest('div');
                        if (displayNameContainer && displayNameContainer.parentNode) {
                            if (displayNameContainer.parentNode === handleSection.parentNode) {
                                displayNameContainer.parentNode.insertBefore(flagSpan, handleSection);
                                inserted = true;
                            } else {
                                displayNameContainer.parentNode.insertBefore(flagSpan, displayNameContainer.nextSibling);
                                inserted = true;
                            }
                        }
                    }
                } catch (e) {
                }
            }

            if (!inserted) {
                try {
                    containerForFlag.appendChild(flagSpan);
                    inserted = true;
                } catch (e) {
                }
            }

            if (inserted) {
                usernameElement.dataset.flagAdded = 'true';

                const waitingContainers = document.querySelectorAll(`[data-flag-added="waiting"]`);
                waitingContainers.forEach(container => {
                    const waitingUsername = extractUsername(container);
                    if (waitingUsername === screenName) {
                        addFlagToUsername(container, screenName).catch(() => { });
                    }
                });
            } else {
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
            }
        } catch (error) {
            if (shimmerInserted && shimmerSpan.parentNode) {
                shimmerSpan.remove();
            }
            usernameElement.dataset.flagAdded = 'failed';
        } finally {
            processingUsernames.delete(screenName);
        }
    }

    // ==================== Process Usernames ====================
    async function processUsernames() {
        const containers = document.querySelectorAll('article[data-testid="tweet"], [data-testid="UserCell"], [data-testid="User-Names"], [data-testid="User-Name"]');

        let foundCount = 0;
        let processedCount = 0;
        let skippedCount = 0;

        for (const container of containers) {
            const screenName = extractUsername(container);
            if (screenName) {
                foundCount++;
                const status = container.dataset.flagAdded;
                if (!status || status === 'failed') {
                    processedCount++;
                    addFlagToUsername(container, screenName).catch(err => {
                        container.dataset.flagAdded = 'failed';
                    });
                } else {
                    skippedCount++;
                }
            }
        }
    }

    // ==================== Observer for Dynamic Content ====================
    let observer = null;

    function initObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let addedNodesCount = 0;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    addedNodesCount += mutation.addedNodes.length;
                }
            }

            if (shouldProcess) {
                setTimeout(processUsernames, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== Initialization ====================
    function init() {
        loadCache();

        setTimeout(() => {
            processUsernames();
        }, 2000);

        initObserver();

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(processUsernames, 2000);
            }
        }).observe(document, { subtree: true, childList: true });

        setInterval(() => {
            saveCache();
        }, 30000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

