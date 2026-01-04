// ==UserScript==
// @name         Xbout-Userscript
// @namespace    https://github.com/code-gal/Xbout-Userscript
// @version      1.11
// @description  Display the user's location, device type, and registration year on the X (Twitter) page.
// @author       code-gal
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556898/Xbout-Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/556898/Xbout-Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS Styles
    GM_addStyle(`
        .xbout-badge {
            display: flex !important;
            align-items: center;
            font-size: 13px;
            line-height: 1;
            white-space: nowrap;
            margin-top: 2px;
            opacity: 0;
            transition: opacity 0.2s ease-out;
            color: #536471;
            cursor: default;
            width: 100%;
            flex-basis: 100%;
        }
        .xbout-badge.loaded {
            opacity: 1;
        }
        .xbout-item {
            display: inline-flex;
            align-items: center;
            margin: 0 2px;
            padding: 1px 2px;
            border-radius: 4px;
        }
        .xbout-item:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        .xbout-dot {
            color: rgb(83, 100, 113);
            margin: 0 2px;
        }
        .xbout-sep {
            color: #536471;
            margin: 0 3px;
            font-size: 10px;
            opacity: 0.4;
        }
        .xbout-year {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-weight: 500;
            font-size: 12px;
        }
        .xbout-device-icon {
            width: 1.1em;
            height: 1.1em;
            vertical-align: -0.15em;
            filter: grayscale(100%);
            opacity: 0.7;
        }
        .xbout-ad-mark {
            font-size: 10px;
            border: 1px solid currentColor;
            border-radius: 3px;
            padding: 1px 3px;
            line-height: 1;
            margin-left: 2px;
            opacity: 0.8;
            font-weight: 500;
        }
        .xbout-proxy-mark {
            width: 1.1em;
            height: 1.1em;
            margin-left: 4px;
            cursor: help;
            opacity: 0.7;
            color: #536471;
            vertical-align: text-bottom;
        }
        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            .xbout-badge, .xbout-dot, .xbout-year, .xbout-sep {
                color: #71767b;
            }
            .xbout-item:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            .xbout-device-icon {
                filter: grayscale(100%) invert(1);
            }
        }
    `);

    // Configuration
    const CONFIG = {
        MIN_DELAY: 2000,          // 2s
        MAX_DELAY: 4000,          // 4s
        RATE_LIMIT_WAIT: 300000,  // 5m
        CACHE_DURATION: 7 * 24 * 60 * 60 * 1000,
        STORAGE_KEY: 'xbout_cache_v2',
        BEARER_TOKEN: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        FALLBACK_QUERY_ID: 'zs_jFPFT78rBpXv9Z3U2YQ',
        ICONS: {
            APPLE: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16.4 12.5c-.1 2.5 2.2 3.8 2.3 3.9-.0.1-.4 1.2-1.2 2.4-.7 1.1-1.5 2.1-2.7 2.1-1.2 0-1.6-.7-3-.7-1.4 0-1.8.7-3 .7-1.2 0-2.1-1.2-2.9-2.3C4.8 17.1 3.7 14.5 3.7 12c0-2.8 1.8-4.3 3.6-4.3 1.1 0 2.2.8 2.9.8.7 0 2-.9 3.3-.9 1.1.1 2.3.5 3 1.4-.1.1-1.7 1-1.7 3.5zM15 5.2c.6-1 1.1-2.2 1-3.4-1 .1-2.3.8-3 1.6-.6.8-1 2-1 3.2 1.1.1 2.3-.6 3-1.4z"/></svg>',
            ANDROID: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.5 18.5H6.5v-8h11v8zm-12-8H4v6h1.5v-6zm14.5 0H18v6h1.5v-6zM12 2.5c-3.6 0-6.5 2.7-6.5 6h13c0-3.3-2.9-6-6.5-6zm-3 4.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/></svg>',
            WEB: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8 0-.6.1-1.1.2-1.7h5.1c.4 0 .8-.3.9-.8v-1.6c0-.5.4-.9.9-.9h1.6c.5 0 .9-.4.9-.9V4.6c2.9.9 5 3.6 5 6.7.1 4.8-3.9 8.7-8.7 8.7z"/></svg>',
            AD: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', // Warning icon
            AIRPLANE: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>'
        }
    };

    // Extended Country Mapping
    const countryToFlag = {
        'china': '🇨🇳', 'japan': '🇯🇵', 'south korea': '🇰🇷', 'korea': '🇰🇷', 'taiwan': '🇹🇼', 'hong kong': '🇭🇰',
        'singapore': '🇸🇬', 'india': '🇮🇳', 'thailand': '🇹🇭', 'vietnam': '🇻🇳', 'malaysia': '🇲🇾', 'indonesia': '🇮🇩',
        'philippines': '🇵🇭', 'pakistan': '🇵🇰', 'bangladesh': '🇧🇩', 'nepal': '🇳🇵', 'sri lanka': '🇱🇰', 'myanmar': '🇲🇲',
        'cambodia': '🇰🇭', 'mongolia': '🇲🇳', 'saudi arabia': '🇸🇦', 'united arab emirates': '🇦🇪', 'uae': '🇦🇪',
        'israel': '🇮🇱', 'turkey': '🇹🇷', 'türkiye': '🇹🇷', 'iran': '🇮🇷', 'iraq': '🇮🇶', 'qatar': '🇶🇦', 'kuwait': '🇰🇼',
        'jordan': '🇯🇴', 'lebanon': '🇱🇧', 'bahrain': '🇧🇭', 'oman': '🇴🇲', 'united kingdom': '🇬🇧', 'uk': '🇬🇧',
        'england': '🇬🇧', 'france': '🇫🇷', 'germany': '🇩🇪', 'italy': '🇮🇹', 'spain': '🇪🇸', 'portugal': '🇵🇹',
        'netherlands': '🇳🇱', 'belgium': '🇧🇪', 'switzerland': '🇨🇭', 'austria': '🇦🇹', 'sweden': '🇸🇪', 'norway': '🇳🇴',
        'denmark': '🇩🇰', 'finland': '🇫🇮', 'poland': '🇵🇱', 'russia': '🇷🇺', 'ukraine': '🇺🇦', 'greece': '🇬🇷',
        'czech republic': '🇨🇿', 'czechia': '🇨🇿', 'hungary': '🇭🇺', 'romania': '🇷🇴', 'ireland': '🇮🇪', 'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'united states': '🇺🇸', 'usa': '🇺🇸', 'us': '🇺🇸', 'canada': '🇨🇦', 'mexico': '🇲🇽', 'brazil': '🇧🇷',
        'argentina': '🇦🇷', 'chile': '🇨🇱', 'colombia': '🇨🇴', 'peru': '🇵🇪', 'venezuela': '🇻🇪', 'australia': '🇦🇺',
        'new zealand': '🇳🇿', 'south africa': '🇿🇦', 'egypt': '🇪🇬', 'nigeria': '🇳🇬', 'kenya': '🇰🇪', 'morocco': '🇲🇦',
        'ethiopia': '🇪🇹', 'ghana': '🇬🇭', 'algeria': '🇩🇿', 'angola': '🇦🇴', 'benin': '🇧🇯', 'botswana': '🇧🇼',
        'burkina faso': '🇧🇫', 'burundi': '🇧🇮', 'cameroon': '🇨🇲', 'cape verde': '🇨🇻', 'chad': '🇹🇩', 'comoros': '🇰🇲',
        'congo': '🇨🇬', 'djibouti': '🇩🇯', 'equatorial guinea': '🇬t', 'eritrea': '🇪🇷', 'eswatini': '🇸🇿',
        'gabon': '🇬🇦', 'gambia': '🇬🇲', 'guinea': '🇬🇳', 'guinea-bissau': '🇬🇼', 'ivory coast': '🇨🇮', 'lesotho': '🇱🇸',
        'liberia': '🇱🇷', 'libya': '🇱🇾', 'madagascar': '🇲🇬', 'malawi': '🇲🇼', 'mali': '🇲🇱', 'mauritania': '🇲🇷',
        'mauritius': '🇲🇺', 'mozambique': '🇲🇿', 'namibia': '🇳🇦', 'niger': '🇳🇪', 'rwanda': '🇷🇼', 'senegal': '🇸🇳',
        'seychelles': '🇸🇨', 'sierra leone': '🇸🇱', 'somalia': '🇸🇴', 'south sudan': '🇸🇸', 'sudan': '🇸🇩', 'tanzania': '🇹🇿',
        'togo': '🇹🇬', 'tunisia': '🇹🇳', 'uganda': '🇺🇬', 'zambia': '🇿🇲', 'zimbabwe': '🇿🇼',
        'afghanistan': '🇦🇫', 'armenia': '🇦🇲', 'azerbaijan': '🇦🇿', 'bhutan': '🇧🇹', 'brunei': '🇧🇳', 'cyprus': '🇨🇾',
        'georgia': '🇬🇪', 'kazakhstan': '🇰🇿', 'kyrgyzstan': '🇰🇬', 'laos': '🇱🇦', 'maldives': '🇲🇻', 'north korea': '🇰🇵',
        'syria': '🇸🇾', 'tajikistan': '🇹🇯', 'timor-leste': '🇹🇱', 'turkmenistan': '🇹🇲', 'uzbekistan': '🇺🇿', 'yemen': '🇾🇪',
        'albania': '🇦🇱', 'andorra': '🇦🇩', 'belarus': '🇧🇾', 'bosnia': '🇧🇦', 'bulgaria': '🇧🇬', 'croatia': '🇭🇷',
        'estonia': '🇪🇪', 'iceland': '🇮🇸', 'kosovo': '🇽🇰', 'latvia': '🇱🇻', 'liechtenstein': '🇱🇮', 'lithuania': '🇱🇹',
        'luxembourg': '🇱🇺', 'malta': '🇲🇹', 'moldova': '🇲🇩', 'monaco': '🇲🇨', 'montenegro': '🇲🇪', 'north macedonia': '🇲🇰',
        'san marino': '🇸🇲', 'serbia': '🇷🇸', 'slovakia': '🇸🇰', 'slovenia': '🇸🇮', 'vatican': '🇻🇦',
        'antigua': '🇦🇬', 'bahamas': '🇧🇸', 'barbados': '🇧🇧', 'belize': '🇧🇿', 'costa rica': '🇨🇷', 'cuba': '🇨🇺',
        'dominica': '🇩🇲', 'dominican republic': '🇩🇴', 'el salvador': '🇸🇻', 'grenada': '🇬🇩', 'guatemala': '🇬🇹',
        'haiti': '🇭🇹', 'honduras': '🇭🇳', 'jamaica': '🇯🇲', 'nicaragua': '🇳🇮', 'panama': '🇵🇦', 'saint kitts': '🇰🇳',
        'saint lucia': '🇱🇨', 'saint vincent': '🇻🇨', 'trinidad': '🇹🇹',
        'bolivia': '🇧🇴', 'ecuador': '🇪🇨', 'guyana': '🇬🇾', 'paraguay': '🇵🇾', 'suriname': '🇸🇷', 'uruguay': '🇺🇾',
        'fiji': '🇫🇯', 'kiribati': '🇰🇮', 'marshall islands': '🇲🇭', 'micronesia': '🇫🇲', 'nauru': '🇳🇷', 'palau': '🇵🇼',
        'papua new guinea': '🇵🇬', 'samoa': '🇼🇸', 'solomon islands': '🇸🇧', 'tonga': '🇹🇴', 'tuvalu': '🇹🇻', 'vanuatu': '🇻🇺'
    };

    // --- State Management ---
    let queryId = null;
    let requestQueue = []; 
    let isProcessing = false;
    let rateLimitUntil = 0;
    const pendingRequests = new Map();
    const elementState = new WeakMap(); 
    const sessionRequestedUsers = new Set(); 

    // --- Cache Manager ---
    const Cache = (() => {
        let store = null;
        let saveTimer = null;

        const load = () => {
            if (store) return;
            try {
                store = GM_getValue(CONFIG.STORAGE_KEY, {});
            } catch (e) { store = {}; }
        };

        const save = () => {
            if (saveTimer) clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                GM_setValue(CONFIG.STORAGE_KEY, store);
                saveTimer = null;
            }, 2000);
        };

        return {
            get: (username) => {
                load();
                const record = store[username];
                if (!record) return null;
                if (Date.now() > record.expiry) {
                    delete store[username];
                    return null;
                }
                return record.data;
            },
            set: (username, data) => {
                load();
                if (Math.random() < 0.05) {
                     const now = Date.now();
                     for(const key in store) {
                         if(store[key].expiry < now) delete store[key];
                     }
                }
                store[username] = { data, expiry: Date.now() + CONFIG.CACHE_DURATION };
                save();
            }
        };
    })();

    // --- Helpers ---
    function getFlagInfo(location) {
        if (!location) return null;
        const loc = location.toLowerCase().trim();
        let emoji = '🌍';
        if (countryToFlag[loc]) {
            emoji = countryToFlag[loc];
        } else {
            for (const [country, flag] of Object.entries(countryToFlag)) {
                if (loc.includes(country) || country.includes(loc)) {
                    emoji = flag;
                    break;
                }
            }
        }
        return { emoji, name: location };
    }

    function getDeviceInfo(source) {
        if (!source) return null;
        const text = source.replace(/<[^>]*>?/gm, '');
        const s = text.toLowerCase();
        let icon = null;
        
        if (s.includes('iphone') || s.includes('ipad') || s.includes('mac') || s.includes('ios') || s.includes('app store')) {
            icon = CONFIG.ICONS.APPLE;
        } else if (s.includes('android')) {
            icon = CONFIG.ICONS.ANDROID;
        } else if (s.includes('web') || s.includes('browser') || s.includes('chrome') || s.includes('edge') || s.includes('safari')) {
            icon = CONFIG.ICONS.WEB;
        }

        if (icon) {
             return { icon, name: text };
        }
        return null;
    }

    function getYear(createdAt) {
        if (!createdAt) return '';
        const match = createdAt.match(/(\d{4})$/);
        return match ? match[1] : '';
    }

    function getCsrfToken() {
        const match = document.cookie.match(/ct0=([^;]+)/);
        return match ? match[1] : null;
    }

    // --- Networking ---
    async function fetchQueryId() {
        try {
            const entries = performance.getEntriesByType('resource');
            for (const entry of entries) {
                const match = entry.name.match(/graphql\/([^/]+)\/AboutAccountQuery/);
                if (match) return match[1];
            }
        } catch (e) {}
        return CONFIG.FALLBACK_QUERY_ID;
    }

    function initQueryIdListener() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const match = entry.name.match(/graphql\/([^/]+)\/AboutAccountQuery/);
                    if (match) queryId = match[1];
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        } catch (e) {}
    }

    async function fetchUserInfo(username) {
        const cached = Cache.get(username);
        if (cached) return cached;
        if (pendingRequests.has(username)) return pendingRequests.get(username);

        const promise = (async () => {
            const csrfToken = getCsrfToken();
            if (!csrfToken) return null;

            const qId = queryId || await fetchQueryId();
            const url = `https://x.com/i/api/graphql/${qId}/AboutAccountQuery?variables=${encodeURIComponent(JSON.stringify({ screenName: username }))}`;

            const resp = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'authorization': `Bearer ${CONFIG.BEARER_TOKEN}`,
                    'content-type': 'application/json',
                    'x-csrf-token': csrfToken,
                    'x-twitter-active-user': 'yes',
                    'x-twitter-auth-type': 'OAuth2Session'
                }
            });

            if (resp.status === 429) throw new Error('RATE_LIMIT');
            if (!resp.ok) return null;

            const data = await resp.json();
            const result = data?.data?.user_result_by_screen_name?.result;

            if (result) {
                const info = {
                    location: result.about_profile?.account_based_in || null,
                    source: result.about_profile?.source || null,
                    createdAt: result.core?.created_at || null,
                    isAccurate: result.about_profile?.location_accurate
                };
                if (info.location || info.source || info.createdAt) {
                    Cache.set(username, info);
                }
                return info;
            }
            return null;
        })();

        pendingRequests.set(username, promise);
        try { return await promise; } 
        catch (e) { throw e; } 
        finally { pendingRequests.delete(username); }
    }

    async function processQueue() {
        if (isProcessing) return;
        isProcessing = true;

        while (requestQueue.length > 0) {
            const now = Date.now();
            if (now < rateLimitUntil) {
                const wait = rateLimitUntil - now;
                console.log(`[Xbout] Rate limited. Resuming in ${Math.ceil(wait/1000)}s`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }

            const { username, resolve } = requestQueue.shift();

            try {
                const info = await fetchUserInfo(username);
                resolve(info);
                const delay = Math.floor(Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY + 1) + CONFIG.MIN_DELAY);
                await new Promise(r => setTimeout(r, delay));
            } catch (e) {
                if (e.message === 'RATE_LIMIT') {
                    console.warn(`[Xbout] 429 Rate Limit Hit. Pausing for ${CONFIG.RATE_LIMIT_WAIT / 1000 / 60} minutes.`);
                    rateLimitUntil = Date.now() + CONFIG.RATE_LIMIT_WAIT;
                    requestQueue.unshift({ username, resolve });
                } else {
                    resolve(null);
                }
            }
        }
        isProcessing = false;
    }

    function queueRequest(username) {
        return new Promise((resolve) => {
            if (Cache.get(username)) {
                resolve(Cache.get(username));
                return;
            }
            if (sessionRequestedUsers.has(username) && !pendingRequests.has(username)) {
                 resolve(null); 
                 return;
            }
            
            sessionRequestedUsers.add(username);
            requestQueue.push({ username, resolve });
            processQueue();
        });
    }

    // --- DOM & UI ---
    function createBadge(info, username, isAd = false) {
        if (!info) return null;
        
        const flagInfo = getFlagInfo(info.location);
        const deviceInfo = getDeviceInfo(info.source);
        const year = getYear(info.createdAt);

        if (!flagInfo && !deviceInfo && !year && !isAd) return null;

        const badge = document.createElement('div');
        badge.className = 'xbout-badge';
        badge.dataset.user = username;

        // Removed the dot as we are now on a new line
        // const dot = document.createElement('span');
        // dot.className = 'xbout-dot';
        // dot.textContent = '·';
        // badge.appendChild(dot);

        if (flagInfo) {
            const item = document.createElement('span');
            item.className = 'xbout-item';
            item.textContent = flagInfo.emoji;
            item.title = `Location: ${flagInfo.name}`;
            badge.appendChild(item);

            if (info.isAccurate === false) {
                const mark = document.createElement('span');
                mark.className = 'xbout-proxy-mark';
                mark.innerHTML = CONFIG.ICONS.AIRPLANE;
                mark.title = 'This data may be inaccurate.\nSome internet service providers may automatically use a proxy without user action.';
                badge.appendChild(mark);
            }
        }

        if (deviceInfo) {
            if (flagInfo) badge.appendChild(createSep());
            const item = document.createElement('span');
            item.className = 'xbout-item';
            item.innerHTML = deviceInfo.icon;
            item.title = `Source: ${deviceInfo.name}`; 
            badge.appendChild(item);
        }

        if (year) {
            if (flagInfo || deviceInfo) badge.appendChild(createSep());
            const item = document.createElement('span');
            item.className = 'xbout-item xbout-year';
            item.textContent = year;
            item.title = `Joined: ${year}`;
            badge.appendChild(item);
        }

        if (isAd) {
            if (flagInfo || deviceInfo || year) badge.appendChild(createSep());
            const item = document.createElement('span');
            item.className = 'xbout-ad-mark';
            item.textContent = 'Ad';
            item.title = 'Promoted Content';
            badge.appendChild(item);
        }

        setTimeout(() => badge.classList.add('loaded'), 50);
        return badge;
    }

    function createSep() {
        const sep = document.createElement('span');
        sep.className = 'xbout-sep';
        sep.textContent = '|';
        return sep;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const username = target.dataset.xboutUser;
                
                intersectionObserver.unobserve(target);
                
                const state = elementState.get(target) || {};
                if (state.requested) return;
                state.requested = true;
                elementState.set(target, state);

                queueRequest(username).then(info => {
                    if (info && !elementState.get(target).rendered) {
                        const header = target.closest('[data-testid="User-Name"]');
                        const isAd = header && !header.querySelector('time');

                        const badge = createBadge(info, username, isAd);
                        if (badge) {
                            const insertTarget = findInsertTarget(target, isAd);
                            if (insertTarget) {
                                insertTarget.after(badge);
                            } else {
                                target.after(badge);
                            }
                            const newState = elementState.get(target);
                            newState.rendered = true;
                            elementState.set(target, newState);
                        }
                    }
                });
            }
        });
    }, { rootMargin: '100px' }); 

    function findInsertTarget(userLink, isAd) {
        const header = userLink.closest('[data-testid="User-Name"]');
        if (!header) return userLink;
        
        // Insert after the header container to force a new line
        // The header container usually contains Name, Verified Icon, Handle, Time, etc.
        // We want to be outside of that flex container to break to a new line
        return header;
    }

    function processLink(link) {
        if (link.hasAttribute('data-xbout-user')) return;
        
        const text = (link.textContent || '').trim();
        if (!text.startsWith('@') || text.includes(' ')) return;
        
        const username = text.slice(1);
        const blacklist = ['home', 'explore', 'notifications', 'messages', 'settings', 'search', 'privacy', 'tos', 'about', 'support'];
        if (blacklist.includes(username.toLowerCase())) return;

        link.dataset.xboutUser = username;
        elementState.set(link, { requested: false, rendered: false });
        
        intersectionObserver.observe(link);
    }

    function scanNode(node) {
        if (node.nodeType !== 1) return;

        const check = (link) => {
            if (link.closest('[data-testid="User-Name"]')) {
                processLink(link);
            }
        };

        if (node.tagName === 'A' && node.getAttribute('href')?.startsWith('/')) {
            check(node);
        }
        
        node.querySelectorAll('a[href^="/"]').forEach(check);
    }

    // --- Optimized Mutation Observer ---
    const domObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    scanNode(node);
                }
            }
        }
    });

    function init() {
        console.log('[Xbout] v1.11 Initialized');
        initQueryIdListener();
        
        // Initial scan
        document.querySelectorAll('[data-testid="User-Name"]').forEach(container => {
            const links = container.querySelectorAll('a[href^="/"]');
            links.forEach(processLink);
        });

        // Observer config
        domObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
