// ==UserScript==
// @name         Last.fm & MusicBrainz Auto-Fill Bio for RED
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  Auto-fill artist biography from Last.fm or MusicBrainz/Wikipedia with external links, and rehost high-res images on redacted.sh
// @author       kdln
// @match        https://redacted.sh/*
// @match        https://*.redacted.sh/*
// @icon         https://www.last.fm/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      ws.audioscrobbler.com
// @connect      last.fm
// @connect      ptpimg.me
// @connect      lastfm.freetls.fastly.net
// @connect      musicbrainz.org
// @connect      wikipedia.org
// @connect      wikidata.org
// @connect      cdn.simpleicons.org
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554013/Lastfm%20%20MusicBrainz%20Auto-Fill%20Bio%20for%20RED.user.js
// @updateURL https://update.greasyfork.org/scripts/554013/Lastfm%20%20MusicBrainz%20Auto-Fill%20Bio%20for%20RED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    const CONFIG = {
        LAST_FM_API_BASE: 'https://ws.audioscrobbler.com/2.0/',
        MUSICBRAINZ_API_BASE: 'https://musicbrainz.org/ws/2/',
        WIKIPEDIA_API_BASE: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
        WIKIDATA_API_BASE: 'https://www.wikidata.org/w/api.php',
        PTPIMG_UPLOAD_URL: 'https://ptpimg.me/upload.php',
        CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        API_KEY_STORAGE: 'lastfm_api_key',
        PTPIMG_API_KEY_STORAGE: 'ptpimg_api_key',
        IMAGE_REHOST_PREFERENCE: 'lastfm_image_rehost_pref', // 'always', 'only-if-not-ptp', 'never'
        CACHE_PREFIX: 'lastfm_cache_',
        CACHE_PREFIX_MB: 'musicbrainz_cache_',
        BIO_PREFERENCE: 'lastfm_bio_preference', // 'full' or 'summary'
        ENABLED_LINKS: 'lastfm_enabled_links', // JSON array of enabled link keys
        USER_AGENT: 'REDArtistBioFiller/1.5.0 (https://redacted.sh)'
    };

    // Default enabled links (all enabled by default)
    const DEFAULT_ENABLED_LINKS = [
        'official', 'spotify', 'appleMusic', 'bandcamp', 'soundcloud', 'youtube',
        'youtubeMusic', 'deezer', 'tidal', 'discogs', 'allmusic', 'rateyourmusic',
        'lastfm', 'wikipedia', 'twitter', 'facebook', 'instagram', 'musicbrainz',
        'beatport', 'genius', 'amazonmusic', 'tiktok', 'patreon', 'linktree',
        'imdb', 'wikidata', 'songkick'
    ];

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    /**
     * Get or prompt for Last.fm API key
     */
    function getAPIKey() {
        let apiKey = GM_getValue(CONFIG.API_KEY_STORAGE, '');

        if (!apiKey) {
            apiKey = prompt(
                'Last.fm API Key Required\n\n' +
                'Please enter your Last.fm API key.\n' +
                'Get one free at: https://www.last.fm/api/account/create'
            );

            if (apiKey && apiKey.trim()) {
                GM_setValue(CONFIG.API_KEY_STORAGE, apiKey.trim());
                showNotification('API key saved successfully!', 'success');
                return apiKey.trim();
            } else {
                showNotification('API key is required to use this script', 'error');
                return null;
            }
        }

        return apiKey;
    }

    /**
     * Show notification to user
     */
    function showNotification(message, type = 'info') {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${colors[type] || colors.info};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-family: Arial, sans-serif;
            max-width: 400px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => notification.style.opacity = '1', 10);

        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Convert HTML to BBCode format for RED
     */
    function htmlToBBCode(html) {
        if (!html) return '';

        let text = html;

        // Remove Last.fm "Read more" links before processing (we don't want these as BBCode)
        text = text.replace(/<a[^>]*href="[^"]*last\.fm[^"]*"[^>]*>.*?<\/a>/gi, '');

        // Convert bold tags to BBCode
        text = text.replace(/<(b|strong)>/gi, '[b]');
        text = text.replace(/<\/(b|strong)>/gi, '[/b]');

        // Convert italic tags to BBCode
        text = text.replace(/<(i|em)>/gi, '[i]');
        text = text.replace(/<\/(i|em)>/gi, '[/i]');

        // Convert external links to BBCode (but not Last.fm internal links)
        text = text.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (match, url, linkText) => {
            // Skip Last.fm internal links
            if (url.includes('last.fm') || url.includes('lastfm')) {
                return linkText; // Just return the text without link
            }
            return `[url=${url}]${linkText}[/url]`;
        });

        // Convert paragraph tags to double line breaks
        text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
        text = text.replace(/<p[^>]*>/gi, '');
        text = text.replace(/<\/p>/gi, '\n\n');

        // Convert line breaks to single line break
        text = text.replace(/<br\s*\/?>/gi, '\n');

        // Strip any remaining HTML tags
        const div = document.createElement('div');
        div.innerHTML = text;
        text = div.textContent || div.innerText || '';

        return text;
    }

    /**
     * Convert fancy Unicode characters (Mathematical Bold/Italic) to BBCode
     * These characters appear as styled text in Last.fm bios but break on submission
     * Example: 𝗦𝗹𝗮𝘂𝗴𝗵𝘁𝗲𝗿 → [b]Slaughter[/b]
     */
    function convertFancyUnicodeToBBCode(text) {
        if (!text) return '';

        // Unicode ranges for Mathematical Alphanumeric Symbols
        const ranges = {
            // Bold (sans-serif) - uppercase and lowercase
            boldSansUpper: { start: 0x1D5D4, end: 0x1D5ED, offset: 0x1D5D4 - 65, tag: 'b' },  // 𝗔-𝗭 → A-Z
            boldSansLower: { start: 0x1D5EE, end: 0x1D607, offset: 0x1D5EE - 97, tag: 'b' },  // 𝗮-𝘇 → a-z
            // Italic (sans-serif) - uppercase and lowercase
            italicSansUpper: { start: 0x1D608, end: 0x1D621, offset: 0x1D608 - 65, tag: 'i' },  // 𝘈-𝘡 → A-Z
            italicSansLower: { start: 0x1D622, end: 0x1D63B, offset: 0x1D622 - 97, tag: 'i' },  // 𝘢-𝘻 → a-z
            // Bold (serif) - uppercase and lowercase
            boldSerifUpper: { start: 0x1D400, end: 0x1D419, offset: 0x1D400 - 65, tag: 'b' },  // 𝐀-𝐙 → A-Z
            boldSerifLower: { start: 0x1D41A, end: 0x1D433, offset: 0x1D41A - 97, tag: 'b' },  // 𝐚-𝐳 → a-z
            // Italic (serif) - uppercase and lowercase
            italicSerifUpper: { start: 0x1D434, end: 0x1D44D, offset: 0x1D434 - 65, tag: 'i' },  // 𝐴-𝑍 → A-Z
            italicSerifLower: { start: 0x1D44E, end: 0x1D467, offset: 0x1D44E - 97, tag: 'i' },  // 𝑎-𝑧 → a-z
            // Bold Italic (sans-serif) - uppercase and lowercase
            boldItalicSansUpper: { start: 0x1D63C, end: 0x1D655, offset: 0x1D63C - 65, tag: 'b' },  // 𝘼-𝙕 → A-Z
            boldItalicSansLower: { start: 0x1D656, end: 0x1D66F, offset: 0x1D656 - 97, tag: 'b' },  // 𝙖-𝙯 → a-z
            // Bold Italic (serif) - uppercase and lowercase
            boldItalicSerifUpper: { start: 0x1D468, end: 0x1D481, offset: 0x1D468 - 65, tag: 'b' },  // 𝑨-𝒁 → A-Z
            boldItalicSerifLower: { start: 0x1D482, end: 0x1D49B, offset: 0x1D482 - 97, tag: 'b' },  // 𝒂-𝒛 → a-z
        };

        // Helper to find which range a character belongs to
        function getCharInfo(char) {
            const code = char.codePointAt(0);
            for (const [name, range] of Object.entries(ranges)) {
                if (code >= range.start && code <= range.end) {
                    const asciiCode = code - range.offset;
                    return { ascii: String.fromCharCode(asciiCode), tag: range.tag };
                }
            }
            return null;
        }

        // Process text character by character, grouping consecutive styled chars
        let result = '';
        let currentRun = '';
        let currentTag = null;

        // Use Array.from to properly handle surrogate pairs (Unicode characters > 0xFFFF)
        const chars = Array.from(text);

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const info = getCharInfo(char);

            if (info) {
                // This is a fancy Unicode character
                if (currentTag === info.tag) {
                    // Same style, continue the run
                    currentRun += info.ascii;
                } else {
                    // Different style, close previous run and start new one
                    if (currentRun && currentTag) {
                        result += `[${currentTag}]${currentRun}[/${currentTag}]`;
                    }
                    currentRun = info.ascii;
                    currentTag = info.tag;
                }
            } else {
                // Regular character, close any open run
                if (currentRun && currentTag) {
                    result += `[${currentTag}]${currentRun}[/${currentTag}]`;
                    currentRun = '';
                    currentTag = null;
                }
                result += char;
            }
        }

        // Close any remaining run
        if (currentRun && currentTag) {
            result += `[${currentTag}]${currentRun}[/${currentTag}]`;
        }

        return result;
    }

    /**
     * Decode HTML entities to their actual characters
     * This is needed because Last.fm API sometimes returns fancy Unicode as HTML entities
     */
    function decodeHTMLEntities(text) {
        if (!text) return '';
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    /**
     * Clean Last.fm biography text and convert to BBCode
     */
    function cleanBiography(bioText) {
        if (!bioText) return '';

        // First, decode HTML entities (&#120294; → actual Unicode characters)
        // This is crucial because Last.fm sometimes returns fancy Unicode as entities
        let cleaned = decodeHTMLEntities(bioText);
        console.log('[Last.fm Auto-Fill] After decodeHTMLEntities (first 200 chars):', cleaned.substring(0, 200));

        // Convert fancy Unicode (Mathematical Bold/Italic) to BBCode
        // This must happen before HTML tag processing to preserve styling intent
        cleaned = convertFancyUnicodeToBBCode(cleaned);
        console.log('[Last.fm Auto-Fill] After convertFancyUnicodeToBBCode (first 200 chars):', cleaned.substring(0, 200));

        // Convert HTML to BBCode (preserves formatting and structure)
        cleaned = htmlToBBCode(cleaned);

        // Remove "Read more on Last.fm" text (sometimes survives as plain text)
        cleaned = cleaned.replace(/Read more on Last\.fm\.?\s*/gi, '');
        cleaned = cleaned.replace(/Read more about .* on Last\.fm\.?\s*/gi, '');

        // Remove Creative Commons footer text - be very specific to only remove the footer
        // This pattern looks for the CC text at the END of the string or before common endings
        cleaned = cleaned.replace(/\s*User-contributed text is available under the Creative Commons By-SA License; additional terms may apply\.?\s*$/gi, '');
        cleaned = cleaned.replace(/\s*User-contributed text is available under the Creative Commons By-SA License[^.]*\.?\s*$/gi, '');

        // Also catch it when it appears after content
        cleaned = cleaned.replace(/\s+User-contributed text is available under the Creative Commons[^.]*\.?\s*$/gi, '');

        // Remove Wikipedia attribution (usually at the end)
        cleaned = cleaned.replace(/\s*This article uses material from the Wikipedia article[^.]*\.?\s*$/gi, '');

        // Remove standalone periods at start/end
        cleaned = cleaned.replace(/^\.\s*/g, '');
        cleaned = cleaned.replace(/\s*\.+$/g, '.');

        // Clean up excessive whitespace but preserve intentional line breaks
        // Replace 3+ newlines with 2 newlines (paragraph break)
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        // Ensure single newlines between lines in same paragraph become spaces
        // But preserve double newlines (paragraph breaks)
        cleaned = cleaned.replace(/([^\n])\n([^\n])/g, '$1 $2');

        // Clean up spaces around remaining newlines (paragraph breaks)
        cleaned = cleaned.replace(/[ \t]+\n/g, '\n');
        cleaned = cleaned.replace(/\n[ \t]+/g, '\n');

        // Clean up multiple spaces within lines
        cleaned = cleaned.replace(/[ \t]+/g, ' ');

        // Final trim
        cleaned = cleaned.trim();

        // If we ended up with just a period or very short text, return empty
        if (cleaned === '.' || cleaned.length < 3) {
            return '';
        }

        return cleaned;
    }

    // ========================================
    // CACHING FUNCTIONS
    // ========================================

    /**
     * Get cached data if still valid
     */
    function getCachedData(key) {
        const cacheKey = CONFIG.CACHE_PREFIX + key;
        const cached = GM_getValue(cacheKey, null);

        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;

                if (age < CONFIG.CACHE_DURATION) {
                    console.log(`[Last.fm Auto-Fill] Using cached data for: ${key}`);
                    return data;
                }
            } catch (e) {
                console.error('[Last.fm Auto-Fill] Cache parse error:', e);
            }
        }

        return null;
    }

    /**
     * Store data in cache
     */
    function setCachedData(key, data) {
        const cacheKey = CONFIG.CACHE_PREFIX + key;
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };

        GM_setValue(cacheKey, JSON.stringify(cacheData));
        console.log(`[Last.fm Auto-Fill] Cached data for: ${key}`);
    }

    // ========================================
    // LAST.FM API FUNCTIONS
    // ========================================

    /**
     * Make request to Last.fm API
     */
    function fetchFromLastFM(params) {
        return new Promise((resolve, reject) => {
            const url = new URL(CONFIG.LAST_FM_API_BASE);

            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            console.log(`[Last.fm Auto-Fill] Fetching: ${url.toString()}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url.toString(),
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            // Check for API errors
                            if (data.error) {
                                reject(new Error(`Last.fm API Error ${data.error}: ${data.message}`));
                                return;
                            }

                            resolve(data);
                        } catch (e) {
                            reject(new Error('Failed to parse Last.fm response: ' + e.message));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('Request timed out'));
                }
            });
        });
    }

    /**
     * Get artist biography from Last.fm
     */
    async function getArtistBio(artistName) {
        const cacheKey = `bio_${artistName.toLowerCase()}`;
        const cached = getCachedData(cacheKey);

        if (cached) {
            return cached;
        }

        const apiKey = getAPIKey();
        if (!apiKey) {
            throw new Error('No API key available');
        }

        try {
            const data = await fetchFromLastFM({
                method: 'artist.getInfo',
                artist: artistName,
                api_key: apiKey,
                format: 'json',
                autocorrect: '1'
            });

            if (data.artist && data.artist.bio) {
                const cleanedSummary = cleanBiography(data.artist.bio.summary);
                const cleanedContent = cleanBiography(data.artist.bio.content);

                console.log('[Last.fm Auto-Fill] Cleaned summary length:', cleanedSummary?.length || 0);
                console.log('[Last.fm Auto-Fill] Cleaned content length:', cleanedContent?.length || 0);

                // Check if we have any actual content after cleaning
                if (!cleanedSummary && !cleanedContent) {
                    console.warn('[Last.fm Auto-Fill] Biography exists but is empty after cleaning');
                    return null;
                }

                // Check if both are too short (likely just boilerplate)
                const summaryTooShort = !cleanedSummary || cleanedSummary.length < 10;
                const contentTooShort = !cleanedContent || cleanedContent.length < 10;

                if (summaryTooShort && contentTooShort) {
                    console.warn('[Last.fm Auto-Fill] Both summary and content too short after cleaning');
                    console.warn('Summary:', cleanedSummary);
                    console.warn('Content:', cleanedContent);
                    return null;
                }

                const bioData = {
                    summary: cleanedSummary || '',
                    content: cleanedContent || '',
                    artistName: data.artist.name,
                    url: data.artist.url
                };

                setCachedData(cacheKey, bioData);
                return bioData;
            }

            return null;
        } catch (error) {
            console.error('[Last.fm Auto-Fill] Error fetching bio:', error);
            throw error;
        }
    }


    // ========================================
    // MUSICBRAINZ & WIKIPEDIA API FUNCTIONS
    // ========================================

    /**
     * Search for artist on MusicBrainz
     * Returns the best matching artist with MBID
     */
    function searchMusicBrainz(artistName) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.MUSICBRAINZ_API_BASE}artist/?query=artist:${encodeURIComponent(artistName)}&fmt=json&limit=5`;

            console.log(`[MusicBrainz] Searching for: ${artistName}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Accept': 'application/json'
                },
                timeout: 15000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (data.artists && data.artists.length > 0) {
                                // Find best match (exact name match or highest score)
                                const exactMatch = data.artists.find(a =>
                                    a.name.toLowerCase() === artistName.toLowerCase()
                                );
                                const bestMatch = exactMatch || data.artists[0];

                                console.log(`[MusicBrainz] Found artist: ${bestMatch.name} (${bestMatch.id})`);
                                resolve(bestMatch);
                            } else {
                                reject(new Error('No artists found on MusicBrainz'));
                            }
                        } catch (e) {
                            reject(new Error('Failed to parse MusicBrainz response: ' + e.message));
                        }
                    } else if (response.status === 503) {
                        reject(new Error('MusicBrainz rate limit exceeded. Please wait a moment.'));
                    } else {
                        reject(new Error(`MusicBrainz HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error searching MusicBrainz: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('MusicBrainz search timed out'));
                }
            });
        });
    }

    /**
     * Get artist details from MusicBrainz including URL relationships
     * This fetches Wikipedia/Wikidata links
     */
    function getMusicBrainzArtistDetails(mbid) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.MUSICBRAINZ_API_BASE}artist/${mbid}?inc=url-rels+aliases&fmt=json`;

            console.log(`[MusicBrainz] Fetching details for MBID: ${mbid}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Accept': 'application/json'
                },
                timeout: 15000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log(`[MusicBrainz] Got details for: ${data.name}`);
                            resolve(data);
                        } catch (e) {
                            reject(new Error('Failed to parse MusicBrainz details: ' + e.message));
                        }
                    } else if (response.status === 503) {
                        reject(new Error('MusicBrainz rate limit exceeded. Please wait a moment.'));
                    } else {
                        reject(new Error(`MusicBrainz HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error fetching MusicBrainz details: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('MusicBrainz details request timed out'));
                }
            });
        });
    }

    /**
     * Extract Wikipedia article title from Wikidata ID
     */
    function getWikipediaTitleFromWikidata(wikidataId) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.WIKIDATA_API_BASE}?action=wbgetentities&ids=${wikidataId}&props=sitelinks&sitefilter=enwiki&format=json&origin=*`;

            console.log(`[Wikidata] Fetching Wikipedia link for: ${wikidataId}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Accept': 'application/json'
                },
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const entity = data.entities && data.entities[wikidataId];

                            if (entity && entity.sitelinks && entity.sitelinks.enwiki) {
                                const title = entity.sitelinks.enwiki.title;
                                console.log(`[Wikidata] Found Wikipedia article: ${title}`);
                                resolve(title);
                            } else {
                                reject(new Error('No English Wikipedia article linked'));
                            }
                        } catch (e) {
                            reject(new Error('Failed to parse Wikidata response: ' + e.message));
                        }
                    } else {
                        reject(new Error(`Wikidata HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error fetching Wikidata: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('Wikidata request timed out'));
                }
            });
        });
    }

    /**
     * Fetch biography from Wikipedia REST API
     */
    function fetchWikipediaBio(articleTitle) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.WIKIPEDIA_API_BASE}${encodeURIComponent(articleTitle)}`;

            console.log(`[Wikipedia] Fetching article: ${articleTitle}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Accept': 'application/json'
                },
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (data.extract) {
                                console.log(`[Wikipedia] Got extract (${data.extract.length} chars)`);
                                resolve({
                                    extract: data.extract,
                                    title: data.title,
                                    description: data.description || '',
                                    url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}`
                                });
                            } else {
                                reject(new Error('Wikipedia article has no extract'));
                            }
                        } catch (e) {
                            reject(new Error('Failed to parse Wikipedia response: ' + e.message));
                        }
                    } else if (response.status === 404) {
                        reject(new Error('Wikipedia article not found'));
                    } else {
                        reject(new Error(`Wikipedia HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error fetching Wikipedia: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('Wikipedia request timed out'));
                }
            });
        });
    }

    /**
     * Extract all external links from MusicBrainz relations
     * Returns an object with categorized links
     */
    function extractExternalLinks(relations) {
        const links = {
            // Streaming & Music Platforms
            spotify: null,
            appleMusic: null,
            deezer: null,
            tidal: null,
            soundcloud: null,
            bandcamp: null,
            youtube: null,
            youtubeMusic: null,
            // Databases & Info
            discogs: null,
            allmusic: null,
            rateyourmusic: null,
            lastfm: null,
            musicbrainz: null,
            // Social Media
            twitter: null,
            facebook: null,
            instagram: null,
            // Official
            official: null,
            // Knowledge bases
            wikipedia: null,
            wikidata: null
        };

        if (!relations) return links;

        for (const rel of relations) {
            if (!rel.url || !rel.url.resource) continue;

            const url = rel.url.resource;
            const type = rel.type;

            // Map relation types to our link categories
            switch (type) {
                case 'discogs':
                    links.discogs = url;
                    break;
                case 'allmusic':
                    links.allmusic = url;
                    break;
                case 'last.fm':
                case 'lastfm':
                    links.lastfm = url;
                    break;
                case 'bandcamp':
                    links.bandcamp = url;
                    break;
                case 'soundcloud':
                    links.soundcloud = url;
                    break;
                case 'youtube':
                    links.youtube = url;
                    break;
                case 'streaming':
                case 'free streaming':
                    // Check URL to determine platform
                    if (url.includes('spotify.com')) links.spotify = url;
                    else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) links.appleMusic = url;
                    else if (url.includes('deezer.com')) links.deezer = url;
                    else if (url.includes('tidal.com')) links.tidal = url;
                    else if (url.includes('music.youtube.com')) links.youtubeMusic = url;
                    break;
                case 'social network':
                    if (url.includes('twitter.com') || url.includes('x.com')) links.twitter = url;
                    else if (url.includes('facebook.com')) links.facebook = url;
                    else if (url.includes('instagram.com')) links.instagram = url;
                    break;
                case 'official homepage':
                    links.official = url;
                    break;
                case 'wikipedia':
                    if (url.includes('en.wikipedia.org')) links.wikipedia = url;
                    break;
                case 'wikidata':
                    links.wikidata = url;
                    break;
                default:
                    // Additional URL pattern matching for common platforms
                    if (url.includes('spotify.com') && !links.spotify) links.spotify = url;
                    else if (url.includes('bandcamp.com') && !links.bandcamp) links.bandcamp = url;
                    else if (url.includes('soundcloud.com') && !links.soundcloud) links.soundcloud = url;
                    else if (url.includes('discogs.com') && !links.discogs) links.discogs = url;
                    else if (url.includes('rateyourmusic.com') && !links.rateyourmusic) links.rateyourmusic = url;
                    break;
            }
        }

        return links;
    }

    /**
     * Build BBCode for external links section
     * Creates a visually formatted links section with favicon images
     * Uses direct favicon URLs from each site
     */
    function buildExternalLinksBBCode(links, artistName) {
        const linkItems = [];

        // Get user's enabled links preferences
        const enabledLinks = getEnabledLinks();

        // Define link display info with ptpimg-hosted icons
        const linkConfig = {
            official: { label: 'Official', favicon: null }, // No favicon for official sites
            spotify: { label: 'Spotify', favicon: 'https://ptpimg.me/rz292z.png' },
            appleMusic: { label: 'Apple Music', favicon: 'https://ptpimg.me/219d6u.png' },
            bandcamp: { label: 'Bandcamp', favicon: 'https://ptpimg.me/2un9oq.png' },
            soundcloud: { label: 'SoundCloud', favicon: 'https://ptpimg.me/k0a904.png' },
            youtube: { label: 'YouTube', favicon: 'https://ptpimg.me/8r2l41.png' },
            youtubeMusic: { label: 'YT Music', favicon: 'https://ptpimg.me/8r2l41.png' },
            deezer: { label: 'Deezer', favicon: 'https://ptpimg.me/1848r3.png' },
            tidal: { label: 'Tidal', favicon: 'https://ptpimg.me/0i7vdw.png' },
            discogs: { label: 'Discogs', favicon: 'https://ptpimg.me/xy76w2.png' },
            allmusic: { label: 'AllMusic', favicon: null }, // Not available on Simple Icons
            rateyourmusic: { label: 'RYM', favicon: null }, // Not available on Simple Icons
            lastfm: { label: 'Last.fm', favicon: 'https://ptpimg.me/spe132.png' },
            wikipedia: { label: 'Wikipedia', favicon: 'https://ptpimg.me/vk0utv.png' },
            twitter: { label: 'X', favicon: 'https://ptpimg.me/971u7k.png' },
            facebook: { label: 'Facebook', favicon: 'https://ptpimg.me/99i0w9.png' },
            instagram: { label: 'Instagram', favicon: 'https://ptpimg.me/1zvyp5.png' },
            musicbrainz: { label: 'MusicBrainz', favicon: 'https://ptpimg.me/66g0c1.png' },
            beatport: { label: 'Beatport', favicon: null }, // Not uploaded
            genius: { label: 'Genius', favicon: 'https://ptpimg.me/27xjc2.png' },
            amazonmusic: { label: 'Amazon Music', favicon: null }, // Not uploaded
            tiktok: { label: 'TikTok', favicon: 'https://ptpimg.me/q1n48f.png' },
            patreon: { label: 'Patreon', favicon: 'https://ptpimg.me/eo600i.png' },
            linktree: { label: 'Linktree', favicon: 'https://ptpimg.me/3rj9wi.png' },
            imdb: { label: 'IMDb', favicon: 'https://ptpimg.me/4bnzq2.png' },
            wikidata: { label: 'Wikidata', favicon: 'https://ptpimg.me/2je4o0.png' },
            songkick: { label: 'Songkick', favicon: 'https://ptpimg.me/kvjywr.png' }
        };

        // Build link items for each available link (only if enabled in settings)
        for (const [key, config] of Object.entries(linkConfig)) {
            // Skip if link is not enabled in user settings
            if (!enabledLinks.includes(key)) {
                continue;
            }

            if (links[key]) {
                const url = links[key];

                if (config.favicon) {
                    linkItems.push(`[url=${url}][img]${config.favicon}[/img] ${config.label}[/url]`);
                } else {
                    // Text-only for official sites or if no favicon
                    linkItems.push(`[url=${url}]${config.label}[/url]`);
                }
            }
        }

        if (linkItems.length === 0) {
            return '';
        }

        // Format as a centered, separated list
        return `[align=center][b]External Links:[/b] ${linkItems.join(' | ')}[/align]`;
    }

    /**
     * Main function to get artist bio from MusicBrainz → Wikipedia
     * Flow: Search MusicBrainz → Get URL relations → Find Wikidata → Get Wikipedia title → Fetch bio
     * Now also extracts all external links and handles no-Wikipedia gracefully
     */
    async function getArtistBioFromMusicBrainz(artistName) {
        const cacheKey = `mb_bio_${artistName.toLowerCase()}`;
        const cached = getCachedDataMB(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Step 1: Search MusicBrainz for the artist
            const searchResult = await searchMusicBrainz(artistName);

            // Check search confidence (score out of 100)
            const searchScore = searchResult.score || 0;
            console.log(`[MusicBrainz] Search score: ${searchScore}% for "${searchResult.name}"`);

            if (searchScore < 98) {
                console.warn(`[MusicBrainz] Low confidence match (${searchScore}%). Expected "${artistName}", got "${searchResult.name}"`);
                // Still proceed but note the potential mismatch
            }

            // Small delay to respect MusicBrainz rate limits (1 req/sec)
            await new Promise(resolve => setTimeout(resolve, 1100));

            // Step 2: Get full artist details with URL relationships
            const artistDetails = await getMusicBrainzArtistDetails(searchResult.id);

            // Step 3: Extract ALL external links from relations
            const externalLinks = extractExternalLinks(artistDetails.relations);
            externalLinks.musicbrainz = `https://musicbrainz.org/artist/${artistDetails.id}`;

            console.log(`[MusicBrainz] Found external links:`, Object.entries(externalLinks).filter(([k,v]) => v).map(([k,v]) => k));

            // Step 4: Find Wikipedia article
            let wikipediaTitle = null;
            let wikidataId = null;

            // Extract Wikidata ID from links
            if (externalLinks.wikidata) {
                const match = externalLinks.wikidata.match(/wikidata\.org\/wiki\/(Q\d+)/);
                if (match) {
                    wikidataId = match[1];
                }
            }

            // Extract Wikipedia title from direct link
            if (externalLinks.wikipedia) {
                const match = externalLinks.wikipedia.match(/en\.wikipedia\.org\/wiki\/(.+)/);
                if (match) {
                    wikipediaTitle = decodeURIComponent(match[1].replace(/_/g, ' '));
                }
            }

            // Step 5: If we have Wikidata ID but no Wikipedia title, fetch it
            if (wikidataId && !wikipediaTitle) {
                try {
                    wikipediaTitle = await getWikipediaTitleFromWikidata(wikidataId);
                } catch (e) {
                    console.warn(`[MusicBrainz] Could not get Wikipedia from Wikidata: ${e.message}`);
                }
            }

            // Step 6: Try to fetch Wikipedia biography
            let wikiBio = null;
            let hasWikipedia = false;

            if (wikipediaTitle) {
                try {
                    wikiBio = await fetchWikipediaBio(wikipediaTitle);
                    hasWikipedia = true;
                } catch (e) {
                    console.warn(`[MusicBrainz] Wikipedia fetch failed for "${wikipediaTitle}": ${e.message}`);
                }
            }

            // Step 7: If no Wikipedia from MusicBrainz links, try artist name directly
            if (!hasWikipedia) {
                console.log(`[MusicBrainz] No Wikipedia link found, trying artist name directly`);
                try {
                    wikiBio = await fetchWikipediaBio(artistDetails.name || artistName);
                    hasWikipedia = true;
                } catch (e) {
                    console.log(`[MusicBrainz] No Wikipedia article exists for this artist`);
                }
            }

            // Build result object
            const bioData = {
                // Bio content (may be null if no Wikipedia)
                content: wikiBio?.extract || null,
                summary: wikiBio?.extract?.split('\n')[0] || null,
                hasWikipedia: hasWikipedia,
                // Artist identification
                artistName: artistDetails.name,
                mbid: artistDetails.id,
                searchScore: searchScore,
                // URLs
                wikipediaUrl: wikiBio?.url || externalLinks.wikipedia || null,
                musicbrainzUrl: externalLinks.musicbrainz,
                // All external links
                externalLinks: externalLinks,
                // Source identifier
                source: hasWikipedia ? 'MusicBrainz/Wikipedia' : 'MusicBrainz',
                // MusicBrainz metadata
                type: artistDetails.type || null,
                country: artistDetails.country || artistDetails.area?.name || null,
                lifeSpan: artistDetails['life-span'] || null,
                disambiguation: artistDetails.disambiguation || '',
                // Area info
                area: artistDetails.area?.name || null,
                beginArea: artistDetails['begin-area']?.name || null
            };

            // Cache the result
            setCachedDataMB(cacheKey, bioData);

            return bioData;

        } catch (error) {
            console.error('[MusicBrainz] Error in bio fetch pipeline:', error);
            throw error;
        }
    }

    /**
     * Get cached MusicBrainz data if still valid
     */
    function getCachedDataMB(key) {
        const cacheKey = CONFIG.CACHE_PREFIX_MB + key;
        const cached = GM_getValue(cacheKey, null);

        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;

                if (age < CONFIG.CACHE_DURATION) {
                    console.log(`[MusicBrainz] Using cached data for: ${key}`);
                    return data;
                }
            } catch (e) {
                console.error('[MusicBrainz] Cache parse error:', e);
            }
        }

        return null;
    }

    /**
     * Store MusicBrainz data in cache
     */
    function setCachedDataMB(key, data) {
        const cacheKey = CONFIG.CACHE_PREFIX_MB + key;
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };

        GM_setValue(cacheKey, JSON.stringify(cacheData));
        console.log(`[MusicBrainz] Cached data for: ${key}`);
    }

    // ========================================
    // SETTINGS MODAL
    // ========================================

    /**
     * Get image rehost preference
     */
    function getImageRehostPreference() {
        return GM_getValue(CONFIG.IMAGE_REHOST_PREFERENCE, 'only-if-not-ptp');
    }

    /**
     * Set image rehost preference
     */
    function setImageRehostPreference(value) {
        GM_setValue(CONFIG.IMAGE_REHOST_PREFERENCE, value);
    }

    /**
     * Get enabled external links
     */
    function getEnabledLinks() {
        const stored = GM_getValue(CONFIG.ENABLED_LINKS, null);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return DEFAULT_ENABLED_LINKS;
            }
        }
        return DEFAULT_ENABLED_LINKS;
    }

    /**
     * Set enabled external links
     */
    function setEnabledLinks(links) {
        GM_setValue(CONFIG.ENABLED_LINKS, JSON.stringify(links));
    }

    /**
     * Link configuration with labels for settings UI
     */
    const LINK_LABELS = {
        official: 'Official Website',
        spotify: 'Spotify',
        appleMusic: 'Apple Music',
        bandcamp: 'Bandcamp',
        soundcloud: 'SoundCloud',
        youtube: 'YouTube',
        youtubeMusic: 'YouTube Music',
        deezer: 'Deezer',
        tidal: 'Tidal',
        discogs: 'Discogs',
        allmusic: 'AllMusic',
        rateyourmusic: 'RateYourMusic',
        lastfm: 'Last.fm',
        wikipedia: 'Wikipedia',
        twitter: 'X (Twitter)',
        facebook: 'Facebook',
        instagram: 'Instagram',
        musicbrainz: 'MusicBrainz',
        beatport: 'Beatport',
        genius: 'Genius',
        amazonmusic: 'Amazon Music',
        tiktok: 'TikTok',
        patreon: 'Patreon',
        linktree: 'Linktree',
        imdb: 'IMDb',
        wikidata: 'Wikidata',
        songkick: 'Songkick'
    };

    /**
     * Build HTML for link checkboxes in settings modal
     */
    function buildLinksCheckboxesHTML() {
        const enabledLinks = getEnabledLinks();
        let html = '';

        // Group links by category
        const categories = {
            'Streaming': ['spotify', 'appleMusic', 'youtubeMusic', 'deezer', 'tidal', 'amazonmusic', 'bandcamp', 'soundcloud'],
            'Video': ['youtube'],
            'Databases': ['discogs', 'allmusic', 'rateyourmusic', 'musicbrainz', 'lastfm', 'genius', 'beatport'],
            'Social': ['twitter', 'facebook', 'instagram', 'tiktok'],
            'Reference': ['wikipedia', 'wikidata', 'imdb'],
            'Other': ['official', 'patreon', 'linktree', 'songkick']
        };

        for (const [category, keys] of Object.entries(categories)) {
            html += `<div class="lastfm-link-category"><strong>${category}</strong></div>`;
            for (const key of keys) {
                if (LINK_LABELS[key]) {
                    const checked = enabledLinks.includes(key) ? 'checked' : '';
                    html += `
                        <label class="lastfm-checkbox-label">
                            <input type="checkbox" name="link-toggle" value="${key}" ${checked}>
                            <span>${LINK_LABELS[key]}</span>
                        </label>
                    `;
                }
            }
        }

        return html;
    }

    /**
     * Create and display settings modal
     */
    function openSettingsModal() {
        // Check if modal already exists
        if (document.getElementById('lastfm-settings-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'lastfm-settings-modal';
        modal.innerHTML = `
            <div class="lastfm-modal-overlay">
                <div class="lastfm-modal-content">
                    <div class="lastfm-modal-header">
                        <h2>Last.fm Auto-Fill Settings</h2>
                        <button class="lastfm-modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="lastfm-modal-body">
                        <div class="lastfm-setting-group">
                            <label for="lastfm-api-key">Last.fm API Key</label>
                            <div class="lastfm-input-group">
                                <input type="password" id="lastfm-api-key" class="lastfm-input" placeholder="Enter your Last.fm API key" value="${GM_getValue(CONFIG.API_KEY_STORAGE, '')}">
                                <button type="button" class="lastfm-toggle-visibility" data-target="lastfm-api-key">Show</button>
                            </div>
                        </div>

                        <div class="lastfm-setting-group">
                            <label for="ptpimg-api-key">ptpimg.me API Key</label>
                            <div class="lastfm-input-group">
                                <input type="password" id="ptpimg-api-key" class="lastfm-input" placeholder="Enter your ptpimg API key" value="${GM_getValue(CONFIG.PTPIMG_API_KEY_STORAGE, '')}">
                                <button type="button" class="lastfm-toggle-visibility" data-target="ptpimg-api-key">Show</button>
                            </div>
                        </div>

                        <div class="lastfm-setting-group">
                            <label>Image Rehosting</label>
                            <div class="lastfm-radio-group">
                                <label class="lastfm-radio-label">
                                    <input type="radio" name="image-rehost" value="always" ${getImageRehostPreference() === 'always' ? 'checked' : ''}>
                                    <span>Always</span>
                                    <small>Always fetch and rehost images to ptpimg</small>
                                </label>
                                <label class="lastfm-radio-label">
                                    <input type="radio" name="image-rehost" value="only-if-not-ptp" ${getImageRehostPreference() === 'only-if-not-ptp' ? 'checked' : ''}>
                                    <span>Only if not PTP</span>
                                    <small>Only rehost if image is not already on ptpimg (default)</small>
                                </label>
                                <label class="lastfm-radio-label">
                                    <input type="radio" name="image-rehost" value="never" ${getImageRehostPreference() === 'never' ? 'checked' : ''}>
                                    <span>Never</span>
                                    <small>Never rehost images (biography only)</small>
                                </label>
                            </div>
                        </div>

                        <div class="lastfm-setting-group">
                            <label>External Links to Include</label>
                            <small style="margin-bottom: 10px;">Select which links to show in the bio's External Links section</small>
                            <div class="lastfm-links-grid" id="links-checkboxes">
                                ${buildLinksCheckboxesHTML()}
                            </div>
                            <div style="margin-top: 10px;">
                                <button type="button" class="lastfm-btn-small" id="select-all-links">Select All</button>
                                <button type="button" class="lastfm-btn-small" id="deselect-all-links">Deselect All</button>
                            </div>
                        </div>
                    </div>
                    <div class="lastfm-modal-footer">
                        <button class="lastfm-btn lastfm-btn-cancel">Cancel</button>
                        <button class="lastfm-btn lastfm-btn-save">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lastfm-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.2s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .lastfm-modal-content {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .lastfm-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #333;
            }

            .lastfm-modal-header h2 {
                margin: 0;
                font-size: 20px;
                color: #fff;
                font-weight: 600;
            }

            .lastfm-modal-close {
                background: none;
                border: none;
                color: #999;
                font-size: 28px;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .lastfm-modal-close:hover {
                background: #333;
                color: #fff;
            }

            .lastfm-modal-body {
                padding: 24px;
            }

            .lastfm-setting-group {
                margin-bottom: 24px;
            }

            .lastfm-setting-group:last-child {
                margin-bottom: 0;
            }

            .lastfm-setting-group > label {
                display: block;
                margin-bottom: 8px;
                color: #fff;
                font-weight: 600;
                font-size: 14px;
            }

            .lastfm-input-group {
                display: flex;
                gap: 8px;
            }

            .lastfm-input {
                flex: 1;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 10px 12px;
                color: #fff;
                font-size: 14px;
                font-family: 'Courier New', monospace;
                transition: border-color 0.2s;
            }

            .lastfm-input:focus {
                outline: none;
                border-color: #0078d4;
            }

            .lastfm-toggle-visibility {
                background: #333;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 10px 16px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .lastfm-toggle-visibility:hover {
                background: #444;
                border-color: #555;
            }

            .lastfm-setting-group small {
                display: block;
                margin-top: 6px;
                color: #999;
                font-size: 12px;
            }

            .lastfm-setting-group small a {
                color: #0078d4;
                text-decoration: none;
            }

            .lastfm-setting-group small a:hover {
                text-decoration: underline;
            }

            .lastfm-radio-group {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .lastfm-radio-label {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 12px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .lastfm-radio-label:hover {
                background: #333;
                border-color: #555;
            }

            .lastfm-radio-label input[type="radio"] {
                margin-top: 2px;
                cursor: pointer;
            }

            .lastfm-radio-label > span {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .lastfm-radio-label > span > :first-child {
                color: #fff;
                font-weight: 500;
                font-size: 14px;
            }

            .lastfm-radio-label small {
                margin: 0;
                color: #999;
                font-size: 12px;
            }

            .lastfm-radio-label input[type="radio"]:checked {
                accent-color: #0078d4;
            }

            .lastfm-modal-footer {
                padding: 16px 24px;
                border-top: 1px solid #333;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }

            .lastfm-btn {
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .lastfm-btn-cancel {
                background: #333;
                color: #fff;
            }

            .lastfm-btn-cancel:hover {
                background: #444;
            }

            .lastfm-btn-save {
                background: #0078d4;
                color: #fff;
            }

            .lastfm-btn-save:hover {
                background: #005a9e;
            }

            .lastfm-links-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-top: 10px;
                max-height: 300px;
                overflow-y: auto;
                padding: 10px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 6px;
            }

            .lastfm-link-category {
                grid-column: 1 / -1;
                color: #888;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 8px;
                padding-bottom: 4px;
                border-bottom: 1px solid #444;
            }

            .lastfm-link-category:first-child {
                margin-top: 0;
            }

            .lastfm-checkbox-label {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 8px;
                background: #333;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: #ddd;
                transition: background 0.2s;
            }

            .lastfm-checkbox-label:hover {
                background: #444;
            }

            .lastfm-checkbox-label input[type="checkbox"] {
                cursor: pointer;
                accent-color: #0078d4;
            }

            .lastfm-btn-small {
                padding: 6px 12px;
                margin-right: 8px;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }

            .lastfm-btn-small:hover {
                background: #555;
            }
        `;

        modal.appendChild(style);
        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('.lastfm-modal-close');
        const cancelBtn = modal.querySelector('.lastfm-btn-cancel');
        const saveBtn = modal.querySelector('.lastfm-btn-save');
        const overlay = modal.querySelector('.lastfm-modal-overlay');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Toggle password visibility
        modal.querySelectorAll('.lastfm-toggle-visibility').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = 'Hide';
                } else {
                    input.type = 'password';
                    btn.textContent = 'Show';
                }
            });
        });

        // Select All / Deselect All buttons for external links
        const selectAllBtn = modal.querySelector('#select-all-links');
        const deselectAllBtn = modal.querySelector('#deselect-all-links');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                modal.querySelectorAll('input[name="link-toggle"]').forEach(cb => {
                    cb.checked = true;
                });
            });
        }

        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', () => {
                modal.querySelectorAll('input[name="link-toggle"]').forEach(cb => {
                    cb.checked = false;
                });
            });
        }

        // Save settings
        saveBtn.addEventListener('click', () => {
            const lastfmKey = modal.querySelector('#lastfm-api-key').value.trim();
            const ptpimgKey = modal.querySelector('#ptpimg-api-key').value.trim();
            const rehostPref = modal.querySelector('input[name="image-rehost"]:checked').value;

            // Save API keys
            if (lastfmKey) {
                GM_setValue(CONFIG.API_KEY_STORAGE, lastfmKey);
            }
            if (ptpimgKey) {
                GM_setValue(CONFIG.PTPIMG_API_KEY_STORAGE, ptpimgKey);
            }

            // Save image rehost preference
            setImageRehostPreference(rehostPref);

            // Save enabled external links
            const enabledLinks = [];
            modal.querySelectorAll('input[name="link-toggle"]:checked').forEach(cb => {
                enabledLinks.push(cb.value);
            });
            setEnabledLinks(enabledLinks);

            showNotification('Settings saved successfully!', 'success');
            closeModal();
        });
    }


    // ========================================
    // PTPIMG IMAGE REHOSTING
    // ========================================

    /**
     * Get or prompt for ptpimg API key
     */
    function getPtpimgAPIKey() {
        let apiKey = GM_getValue(CONFIG.PTPIMG_API_KEY_STORAGE, '');

        if (!apiKey) {
            apiKey = prompt(
                'ptpimg.me API Key Required\n\n' +
                'Please enter your ptpimg.me API key.\n' +
                'Get one at: https://ptpimg.me/register.php'
            );

            if (apiKey && apiKey.trim()) {
                GM_setValue(CONFIG.PTPIMG_API_KEY_STORAGE, apiKey.trim());
                showNotification('ptpimg API key saved successfully!', 'success');
                return apiKey.trim();
            } else {
                showNotification('ptpimg API key is required for image uploading', 'error');
                return null;
            }
        }

        return apiKey;
    }

    /**
     * Upload image URL to ptpimg
     */
    function uploadToPtpimg(imageUrl) {
        return new Promise((resolve, reject) => {
            const apiKey = getPtpimgAPIKey();
            if (!apiKey) {
                reject(new Error('No ptpimg API key available'));
                return;
            }

            // Create form data for URL upload
            const formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('link-upload', imageUrl);
            formData.append('upload-links', ''); // This triggers the URL upload

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.PTPIMG_UPLOAD_URL,
                data: formData,
                headers: {
                    'Referer': 'https://ptpimg.me/index.php',
                    'User-Agent': 'LastFM-RED-AutoFill/1.2.0'
                },
                timeout: 30000,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`ptpimg upload failed: HTTP ${response.status}`));
                        return;
                    }

                    if (!response.responseText || !response.responseText.trim()) {
                        reject(new Error('ptpimg returned empty response'));
                        return;
                    }

                    try {
                        // Log raw response for debugging (Issue #1)
                        console.log(`[Last.fm Auto-Fill] PTPimg raw response:`, response.responseText);

                        const data = JSON.parse(response.responseText);

                        // Standard format: array with code and ext
                        if (Array.isArray(data) && data.length > 0) {
                            const upload = data[0];
                            if (upload.code && upload.ext) {
                                const ptpimgUrl = `https://ptpimg.me/${upload.code}.${upload.ext}`;
                                console.log(`[Last.fm Auto-Fill] Image uploaded: ${ptpimgUrl}`);
                                resolve(ptpimgUrl);
                                return;
                            }
                            // Alternative field names (id instead of code, format instead of ext)
                            if (upload.id && (upload.ext || upload.format)) {
                                const ext = upload.ext || upload.format;
                                const ptpimgUrl = `https://ptpimg.me/${upload.id}.${ext}`;
                                console.log(`[Last.fm Auto-Fill] Image uploaded (alt format): ${ptpimgUrl}`);
                                resolve(ptpimgUrl);
                                return;
                            }
                            // Pre-formatted URL in response
                            if (upload.url) {
                                console.log(`[Last.fm Auto-Fill] Image uploaded (url format): ${upload.url}`);
                                resolve(upload.url);
                                return;
                            }
                        }

                        // Check for nested images array
                        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                            const upload = data.images[0];
                            if (upload.code && upload.ext) {
                                const ptpimgUrl = `https://ptpimg.me/${upload.code}.${upload.ext}`;
                                console.log(`[Last.fm Auto-Fill] Image uploaded (nested): ${ptpimgUrl}`);
                                resolve(ptpimgUrl);
                                return;
                            }
                        }

                        // Direct URL field at root level
                        if (data.url) {
                            console.log(`[Last.fm Auto-Fill] Image uploaded (direct url): ${data.url}`);
                            resolve(data.url);
                            return;
                        }

                        if (data.error) {
                            reject(new Error(`ptpimg error: ${data.error}`));
                            return;
                        }

                        // Log the actual response structure for debugging
                        console.error(`[Last.fm Auto-Fill] Unexpected ptpimg response structure:`, JSON.stringify(data, null, 2));
                        reject(new Error(`Unexpected ptpimg response format. Check console for details.`));

                    } catch (e) {
                        console.error(`[Last.fm Auto-Fill] Failed to parse ptpimg response:`, e);
                        console.error(`[Last.fm Auto-Fill] Raw response was:`, response.responseText);
                        reject(new Error('Failed to parse ptpimg response'));
                    }
                },
                onerror: function(error) {
                    console.error(`[Last.fm Auto-Fill] ptpimg upload error:`, error);
                    reject(new Error('Network error uploading to ptpimg'));
                },
                ontimeout: function() {
                    reject(new Error('ptpimg upload timed out'));
                }
            });
        });
    }

    /**
     * Fetch artist header image from Last.fm page HTML
     * Fallback for when API returns placeholder image
     */
    async function fetchHeaderImageFromPage(artistName) {
        return new Promise((resolve) => {
            const lastfmUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: lastfmUrl,
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        const html = response.responseText;
                        const match = html.match(/header-new-background-image[^>]*style="background-image:\s*url\(([^)]+)\)/i);

                        if (match && match[1]) {
                            let imageUrl = match[1].trim().replace(/^['"]|['"]$/g, '');

                            // Check if it's a placeholder
                            if (imageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
                                resolve(null);
                            } else {
                                console.log(`[Last.fm Auto-Fill] Found header image fallback`);
                                resolve(imageUrl);
                            }
                        } else {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                },
                ontimeout: function() {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Get artist image from Last.fm and rehost to ptpimg
     * Fetches the high-res "ar0" image directly
     * Falls back to header image if API returns placeholder
     */
    async function rehostArtistImage(artistName) {
        // Check user preference for image rehosting
        const preference = getImageRehostPreference();

        if (preference === 'never') {
            console.log('[Last.fm Auto-Fill] Image rehosting disabled by user preference');
            return null;
        }

        // Check if image field already has a ptpimg URL
        const imageField = document.querySelector('input[name="image"]');
        if (preference === 'only-if-not-ptp' && imageField && imageField.value && imageField.value.includes('ptpimg.me')) {
            console.log('[Last.fm Auto-Fill] Image field already contains ptpimg URL, skipping rehost');
            showNotification('Image already hosted on ptpimg, skipping upload', 'info');
            return imageField.value;
        }

        showNotification(`Fetching artist image...`, 'info');

        try {
            const apiKey = getAPIKey();
            if (!apiKey) {
                throw new Error('No Last.fm API key available');
            }

            const data = await fetchFromLastFM({
                method: 'artist.getInfo',
                artist: artistName,
                api_key: apiKey,
                format: 'json',
                autocorrect: '1'
            });

            if (!data.artist || !data.artist.image) {
                throw new Error('No image data found for artist');
            }

            const images = data.artist.image;
            const largeImage = images.find(img => img.size === 'mega' || img.size === 'extralarge');

            if (!largeImage || !largeImage['#text']) {
                throw new Error('No large image available');
            }

            let imageUrl = largeImage['#text'];

            // Check if it's a placeholder image
            if (imageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
                showNotification('Checking for header image fallback...', 'info');
                const headerImageUrl = await fetchHeaderImageFromPage(artistName);

                if (headerImageUrl) {
                    imageUrl = headerImageUrl;
                } else {
                    showNotification('Artist has no custom image available', 'warning');
                    return null;
                }
            }

            // Convert to high-res "ar0" URL
            imageUrl = imageUrl.replace(/\/(avatar170s|34s|64s|174s|300x300|[0-9]+x[0-9]+)\//g, '/ar0/');

            showNotification('Uploading to ptpimg.me...', 'info');
            const ptpimgUrl = await uploadToPtpimg(imageUrl);

            // Fill the image field
            if (imageField) {
                imageField.value = ptpimgUrl;
                imageField.dispatchEvent(new Event('input', { bubbles: true }));
                imageField.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Copy to clipboard
            navigator.clipboard.writeText(ptpimgUrl).then(() => {
                showNotification(`Image rehosted & filled!`, 'success');
            }).catch(() => {
                showNotification(`Image rehosted: ${ptpimgUrl}`, 'success');
            });

            return ptpimgUrl;

        } catch (error) {
            console.error('[Last.fm Auto-Fill] Image rehost error:', error);
            showNotification(`Error: ${error.message}`, 'error');
            return null;
        }
    }


    // ========================================
    // DOM MANIPULATION & AUTO-FILL
    // ========================================

    /**
     * Extract artist name from the page
     * Specifically for redacted.ch/redacted.sh structure
     */
    function getArtistNameFromPage() {
        // Method 1: Get from URL parameter on edit page
        // Example: https://redacted.sh/artist.php?action=edit&artistid=743
        const urlParams = new URLSearchParams(window.location.search);
        const artistId = urlParams.get('artistid') || urlParams.get('id');

        if (artistId) {
            // Try to get artist name from page heading
            const heading = document.querySelector('h2');
            if (heading && heading.textContent) {
                // Extract artist name from heading and clean up any "Edit" or "Create" prefixes
                let match = heading.textContent.trim();

                // Remove "Edit " or "Create " from the beginning
                match = match.replace(/^(Edit|Create)\s+/i, '').trim();

                if (match) {
                    console.log(`[Last.fm Auto-Fill] Found artist name from heading: ${match}`);
                    return match;
                }
            }
        }

        // Method 2: Get from artist name input field
        const selectors = [
            'input[name="name"]',           // Common artist name input
            'input[name="artist"]',
            'input[name="artistname"]',
            '#artist',
            '#artistname',
            'input[id*="artist"]',
            'input[placeholder*="Artist"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.value && element.value.trim()) {
                const value = element.value.trim();

                // Skip generic placeholders or labels
                if (value.toLowerCase() === 'artist' ||
                    value.toLowerCase() === 'artists' ||
                    value.toLowerCase() === 'artist name') {
                    console.log(`[Last.fm Auto-Fill] Skipping generic placeholder: ${value}`);
                    continue;
                }

                console.log(`[Last.fm Auto-Fill] Found artist name from input: ${value}`);
                return value;
            }
        }

        // Method 3: Check if we're on artist.php page and get from page structure
        if (window.location.pathname.includes('artist.php')) {
            const h2 = document.querySelector('.header h2');
            if (h2 && h2.textContent && h2.textContent.trim()) {
                console.log(`[Last.fm Auto-Fill] Found artist name from .header h2: ${h2.textContent.trim()}`);
                return h2.textContent.trim();
            }
        }

        return null;
    }

    /**
     * Find the artist information textarea/field
     * Specifically for redacted.ch structure: <textarea name="body" id="body">
     */
    function getArtistInfoField() {
        // Primary selector: textarea#body (confirmed from redacted.sh)
        const bodyTextarea = document.querySelector('textarea#body[name="body"]');
        if (bodyTextarea) {
            console.log('[Last.fm Auto-Fill] Found artist info field: textarea#body');
            return bodyTextarea;
        }

        // Fallback selectors
        const selectors = [
            'textarea[name="body"]',
            'textarea[id="body"]',
            'textarea[name="artist_info"]',
            'textarea[name="biography"]',
            'textarea[name="bio"]',
            'textarea[placeholder*="Artist"]',
            'textarea[placeholder*="biography"]',
            '#artistinfo',
            '#artist_info'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`[Last.fm Auto-Fill] Found artist info field: ${selector}`);
                return element;
            }
        }

        return null;
    }


    /**
     * Main auto-fill function
     */
    async function performAutoFill() {
        console.log('[Last.fm Auto-Fill] Starting auto-fill process...');

        // Get artist name
        const artistName = getArtistNameFromPage();

        if (!artistName) {
            showNotification('Could not find artist name on page. Please enter it manually.', 'warning');

            // Prompt user for artist name
            const manualArtist = prompt('Enter artist name:');
            if (!manualArtist || !manualArtist.trim()) {
                return;
            }

            await performAutoFillWithArtist(manualArtist.trim());
            return;
        }

        await performAutoFillWithArtist(artistName);
    }

    /**
     * Perform auto-fill with specific artist name
     */
    async function performAutoFillWithArtist(artistName) {
        console.log(`[Last.fm Auto-Fill] Fetching data for: ${artistName}`);

        // Show loading notification
        showNotification(`Fetching Last.fm data for ${artistName}...`, 'info');

        try {
            // Fetch biography
            const bio = await getArtistBio(artistName);

            // Fill biography
            if (bio) {
                const bioField = getArtistInfoField();
                if (bioField) {
                    // Get user preference for bio length
                    const bioPreference = GM_getValue(CONFIG.BIO_PREFERENCE, 'full');

                    // Use full content or summary based on preference
                    let bioText;
                    if (bioPreference === 'summary' && bio.summary) {
                        bioText = bio.summary;
                    } else {
                        bioText = bio.content || bio.summary;
                    }

                    // Validate the text is meaningful (not just empty or a period)
                    if (bioText && bioText.length > 5 && bioText !== '.') {
                        // Add BBCode signature at the end with link to artist's Last.fm page
                        const signature = `\n\n[align=center][u][url=${bio.url}]Fetched bio from Last.fm[/url][/u][/align]`;
                        bioField.value = bioText + signature;
                        bioField.dispatchEvent(new Event('input', { bubbles: true }));
                        bioField.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(`[Last.fm Auto-Fill] Biography filled successfully (${bioPreference} version, ${bioText.length} chars)`);

                        showNotification(`Biography filled! Fetching artist image...`, 'success');
                    } else {
                        console.warn('[Last.fm Auto-Fill] Biography text too short or invalid:', bioText);
                        showNotification(`Biography for ${artistName} is too short or empty after cleaning`, 'warning');
                    }
                } else {
                    console.warn('[Last.fm Auto-Fill] Could not find biography field');
                    showNotification('Could not find biography field on page', 'warning');
                }
            } else {
                showNotification(`No biography found for ${artistName}`, 'warning');
            }

            // Also try to rehost the artist image
            await rehostArtistImage(artistName);

        } catch (error) {
            console.error('[Last.fm Auto-Fill] Error:', error);
            showNotification(`Error: ${error.message}`, 'error');
        }
    }

    /**
     * MusicBrainz auto-fill function
     */
    async function performMusicBrainzAutoFill() {
        console.log('[MusicBrainz] Starting auto-fill process...');

        // Get artist name
        const artistName = getArtistNameFromPage();

        if (!artistName) {
            showNotification('Could not find artist name on page. Please enter it manually.', 'warning');

            // Prompt user for artist name
            const manualArtist = prompt('Enter artist name:');
            if (!manualArtist || !manualArtist.trim()) {
                return;
            }

            await performMusicBrainzAutoFillWithArtist(manualArtist.trim());
            return;
        }

        await performMusicBrainzAutoFillWithArtist(artistName);
    }

    /**
     * Perform MusicBrainz auto-fill with specific artist name
     * Now handles cases with no Wikipedia by showing metadata + external links
     */
    async function performMusicBrainzAutoFillWithArtist(artistName) {
        console.log(`[MusicBrainz] Fetching data for: ${artistName}`);

        // Show loading notification
        showNotification(`Searching MusicBrainz for ${artistName}...`, 'info');

        try {
            // Fetch biography from MusicBrainz → Wikipedia
            const bio = await getArtistBioFromMusicBrainz(artistName);

            if (!bio) {
                showNotification(`No MusicBrainz data found for ${artistName}`, 'warning');
                return;
            }

            // Check search confidence
            if (bio.searchScore < 98) {
                console.warn(`[MusicBrainz] Low confidence match: ${bio.searchScore}%`);
                showNotification(`Low confidence match (${bio.searchScore}%) - verify artist name`, 'warning');
            }

            const bioField = getArtistInfoField();
            if (!bioField) {
                console.warn('[MusicBrainz] Could not find biography field');
                showNotification('Could not find biography field on page', 'warning');
                return;
            }

            // Build metadata header if available
            let metadataHeader = '';
            if (bio.type || bio.country || bio.lifeSpan || bio.beginArea) {
                const parts = [];
                if (bio.type && bio.type !== 'Unknown') {
                    parts.push(`[b]Type:[/b] ${bio.type}`);
                }
                if (bio.country) {
                    parts.push(`[b]Country:[/b] ${bio.country}`);
                }
                if (bio.beginArea && bio.beginArea !== bio.country) {
                    parts.push(`[b]Origin:[/b] ${bio.beginArea}`);
                }
                if (bio.lifeSpan && bio.lifeSpan.begin) {
                    const yearInfo = bio.lifeSpan.ended
                        ? `${bio.lifeSpan.begin} - ${bio.lifeSpan.end || 'Unknown'}`
                        : `${bio.lifeSpan.begin} - present`;
                    parts.push(`[b]Active:[/b] ${yearInfo}`);
                }
                if (parts.length > 0) {
                    metadataHeader = parts.join(' | ') + '\n\n';
                }
            }

            // Build external links section
            const externalLinksSection = buildExternalLinksBBCode(bio.externalLinks, bio.artistName);

            // Handle case WITH Wikipedia bio
            if (bio.hasWikipedia && bio.content) {
                // Get user preference for bio length
                const bioPreference = GM_getValue(CONFIG.BIO_PREFERENCE, 'full');

                // Use full content or summary based on preference
                let bioText;
                if (bioPreference === 'summary' && bio.summary) {
                    bioText = bio.summary;
                } else {
                    bioText = bio.content;
                }

                // Validate the text is meaningful
                if (bioText && bioText.length > 10) {
                    // Build attribution signature
                    const signature = `\n\n[align=center][u][url=${bio.wikipediaUrl}]Bio from Wikipedia[/url] via [url=${bio.musicbrainzUrl}]MusicBrainz[/url][/u][/align]`;

                    // Combine: metadata + bio + external links + signature
                    let fullContent = metadataHeader + bioText;
                    if (externalLinksSection) {
                        fullContent += '\n\n' + externalLinksSection;
                    }
                    fullContent += signature;

                    bioField.value = fullContent;
                    bioField.dispatchEvent(new Event('input', { bubbles: true }));
                    bioField.dispatchEvent(new Event('change', { bubbles: true }));

                    const linkCount = Object.values(bio.externalLinks).filter(v => v).length;
                    console.log(`[MusicBrainz] Biography filled successfully (${bioPreference} version, ${bioText.length} chars, ${linkCount} links)`);
                    showNotification(`Biography filled from Wikipedia! (${bioText.length} chars, ${linkCount} external links)`, 'success');
                } else {
                    console.warn('[MusicBrainz] Biography text too short or invalid');
                    showNotification(`Biography for ${artistName} is too short or empty`, 'warning');
                }
            }
            // Handle case WITHOUT Wikipedia bio - still show metadata + links
            else {
                const linkCount = Object.values(bio.externalLinks).filter(v => v).length;

                if (linkCount === 0 && !metadataHeader) {
                    showNotification(`No Wikipedia bio or links found for ${artistName}`, 'warning');
                    return;
                }

                // Build content with just metadata and external links
                let content = '';

                // Add artist name as header
                content += `[b][size=4]${bio.artistName}[/size][/b]`;
                if (bio.disambiguation) {
                    content += ` [i](${bio.disambiguation})[/i]`;
                }
                content += '\n\n';

                // Add metadata
                if (metadataHeader) {
                    content += metadataHeader;
                }

                // Add external links
                if (externalLinksSection) {
                    content += externalLinksSection + '\n';
                }

                // Add MusicBrainz attribution
                content += `\n[align=center][i]No Wikipedia biography available[/i]\n[u][url=${bio.musicbrainzUrl}]View on MusicBrainz[/url][/u][/align]`;

                bioField.value = content;
                bioField.dispatchEvent(new Event('input', { bubbles: true }));
                bioField.dispatchEvent(new Event('change', { bubbles: true }));

                console.log(`[MusicBrainz] Metadata filled (no Wikipedia bio, ${linkCount} external links)`);
                showNotification(`No Wikipedia bio available. Filled metadata + ${linkCount} external links.`, 'info');
            }

        } catch (error) {
            console.error('[MusicBrainz] Error:', error);
            showNotification(`MusicBrainz Error: ${error.message}`, 'error');
        }
    }

    /**
     * Open MusicBrainz page for current artist
     */
    function openMusicBrainzPage() {
        const artistName = getArtistNameFromPage();

        if (!artistName) {
            const manualArtist = prompt('Enter artist name to search on MusicBrainz:');
            if (manualArtist && manualArtist.trim()) {
                const encodedName = encodeURIComponent(manualArtist.trim());
                window.open(`https://musicbrainz.org/search?query=${encodedName}&type=artist`, '_blank');
            }
            return;
        }

        const encodedName = encodeURIComponent(artistName);
        window.open(`https://musicbrainz.org/search?query=${encodedName}&type=artist`, '_blank');
    }

    /**
     * Open Last.fm page for current artist
     */
    function openLastFmPage() {
        const artistName = getArtistNameFromPage();

        if (!artistName) {
            const manualArtist = prompt('Enter artist name to view on Last.fm:');
            if (manualArtist && manualArtist.trim()) {
                const encodedName = encodeURIComponent(manualArtist.trim());
                window.open(`https://www.last.fm/music/${encodedName}`, '_blank');
            }
            return;
        }

        const encodedName = encodeURIComponent(artistName);
        window.open(`https://www.last.fm/music/${encodedName}`, '_blank');
    }

    /**
     * Configuration for dynamic link buttons
     * Maps link types to their display properties
     */
    const LINK_BUTTON_CONFIG = {
        official: { label: 'Official', icon: '🌐', color: '#2E7D32' },
        spotify: { label: 'Spotify', icon: '🎧', color: '#1DB954' },
        appleMusic: { label: 'Apple Music', icon: '🍎', color: '#FA243C' },
        bandcamp: { label: 'Bandcamp', icon: '💿', color: '#629aa9' },
        soundcloud: { label: 'SoundCloud', icon: '☁️', color: '#FF5500' },
        youtube: { label: 'YouTube', icon: '▶️', color: '#FF0000' },
        youtubeMusic: { label: 'YT Music', icon: '🎵', color: '#FF0000' },
        deezer: { label: 'Deezer', icon: '🎶', color: '#FEAA2D' },
        tidal: { label: 'Tidal', icon: '🌊', color: '#000000' },
        discogs: { label: 'Discogs', icon: '📀', color: '#333333' },
        allmusic: { label: 'AllMusic', icon: '🎼', color: '#E41B17' },
        rateyourmusic: { label: 'RYM', icon: '⭐', color: '#2B5F9E' },
        lastfm: { label: 'Last.fm', icon: '📻', color: '#d51007' },
        musicbrainz: { label: 'MusicBrainz', icon: '📊', color: '#BA478F' },
        wikipedia: { label: 'Wikipedia', icon: '📖', color: '#666666' },
        wikidata: { label: 'Wikidata', icon: '📚', color: '#339966' },
        twitter: { label: 'X/Twitter', icon: '🐦', color: '#1DA1F2' },
        facebook: { label: 'Facebook', icon: '👤', color: '#1877F2' },
        instagram: { label: 'Instagram', icon: '📷', color: '#E4405F' }
    };

    /**
     * Store for discovered external links (populated after Build Bio runs)
     */
    let discoveredLinks = {};

    /**
     * Create a styled link button
     */
    function createLinkButton(key, url, config) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = `${config.icon} ${config.label}`;
        btn.title = `Open ${config.label}`;
        btn.dataset.linkKey = key;
        btn.style.cssText = `
            padding: 6px 10px;
            margin: 3px;
            background-color: ${config.color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: opacity 0.2s, transform 0.1s;
            display: inline-block;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '0.85';
            btn.style.transform = 'scale(1.02)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', () => {
            window.open(url, '_blank');
        });

        return btn;
    }

    /**
     * Update the dynamic links row based on discovered links
     */
    function updateDynamicLinksRow() {
        const linksRow = document.getElementById('bio-dynamic-links-row');
        if (!linksRow) return;

        // Clear existing buttons
        linksRow.innerHTML = '';

        const linkCount = Object.values(discoveredLinks).filter(v => v).length;
        if (linkCount === 0) {
            linksRow.innerHTML = '<span style="color: #888; font-size: 12px; font-style: italic;">Click "Build Bio" to discover external links</span>';
            return;
        }

        // Add label
        const label = document.createElement('span');
        label.textContent = 'Found Links: ';
        label.style.cssText = 'font-size: 12px; color: #666; margin-right: 5px;';
        linksRow.appendChild(label);

        // Create buttons for each discovered link
        for (const [key, url] of Object.entries(discoveredLinks)) {
            if (url && LINK_BUTTON_CONFIG[key]) {
                const btn = createLinkButton(key, url, LINK_BUTTON_CONFIG[key]);
                linksRow.appendChild(btn);
            }
        }
    }

    /**
     * Unified Build Bio function - fetches from all sources and combines results
     */
    async function performBuildBio() {
        const artistName = getArtistNameFromPage();

        if (!artistName) {
            const manualArtist = prompt('Could not detect artist name. Please enter it:');
            if (manualArtist && manualArtist.trim()) {
                await performBuildBioWithArtist(manualArtist.trim());
            }
            return;
        }

        await performBuildBioWithArtist(artistName);
    }

    /**
     * Build Bio with specific artist name
     * Primary flow: Last.fm bio first, then MusicBrainz for metadata and external links
     */
    async function performBuildBioWithArtist(artistName) {
        console.log(`[Build Bio] Starting unified fetch for: ${artistName}`);

        // Update button to show loading state
        const buildBioBtn = document.getElementById('build-bio-btn');
        if (buildBioBtn) {
            buildBioBtn.textContent = '⏳ Building...';
            buildBioBtn.disabled = true;
        }

        showNotification(`Building bio for ${artistName}...`, 'info');

        try {
            // Step 1: Fetch bio from Last.fm (primary source)
            let lastfmBio = null;

            showNotification(`Fetching bio from Last.fm...`, 'info');
            try {
                lastfmBio = await getArtistBio(artistName);
                console.log('[Build Bio] Last.fm bio fetched successfully');
            } catch (e) {
                console.warn('[Build Bio] Last.fm fetch failed:', e.message);
            }

            // Step 2: Fetch from MusicBrainz for metadata and external links
            let mbData = null;

            showNotification(`Fetching links from MusicBrainz...`, 'info');
            try {
                mbData = await getArtistBioFromMusicBrainz(artistName);
                console.log('[Build Bio] MusicBrainz data fetched successfully');
            } catch (e) {
                console.warn('[Build Bio] MusicBrainz fetch failed:', e.message);
            }

            // Step 3: Store discovered links for dynamic buttons
            if (mbData && mbData.externalLinks) {
                discoveredLinks = { ...mbData.externalLinks };
                // Also add Last.fm link if we have one
                if (lastfmBio && lastfmBio.url) {
                    discoveredLinks.lastfm = lastfmBio.url;
                }
                updateDynamicLinksRow();
            } else if (lastfmBio && lastfmBio.url) {
                // At minimum, add Last.fm link
                discoveredLinks = { lastfm: lastfmBio.url };
                updateDynamicLinksRow();
            }

            // Step 4: Get bio field
            const bioField = getArtistInfoField();
            if (!bioField) {
                showNotification('Could not find biography field on page', 'warning');
                return;
            }

            // Step 5: Build the bio content - Last.fm bio is primary
            let bioContent = '';
            let bioSource = '';

            if (lastfmBio && lastfmBio.content) {
                const bioPreference = GM_getValue(CONFIG.BIO_PREFERENCE, 'full');
                const bioText = (bioPreference === 'summary' && lastfmBio.summary) ? lastfmBio.summary : lastfmBio.content;

                // Add MusicBrainz metadata header if available
                let metadataHeader = '';
                if (mbData) {
                    metadataHeader = buildMetadataHeader(mbData);
                }

                // Build external links section from MusicBrainz data
                let externalLinksSection = '';
                if (mbData && mbData.externalLinks) {
                    externalLinksSection = buildExternalLinksBBCode(mbData.externalLinks, artistName);
                }

                // Build attribution
                let signature = `\n\n[align=center][u][url=${lastfmBio.url}]Bio from Last.fm[/url]`;
                if (mbData && mbData.musicbrainzUrl) {
                    signature += ` | [url=${mbData.musicbrainzUrl}]MusicBrainz[/url]`;
                }
                signature += `[/u][/align]`;

                bioContent = metadataHeader + bioText;
                if (externalLinksSection) {
                    bioContent += '\n\n' + externalLinksSection;
                }
                bioContent += signature;
                bioSource = 'Last.fm';
            }
            // Fall back to Wikipedia via MusicBrainz if Last.fm has no bio
            else if (mbData && mbData.hasWikipedia && mbData.content) {
                console.log('[Build Bio] No Last.fm bio, using Wikipedia via MusicBrainz...');

                const bioPreference = GM_getValue(CONFIG.BIO_PREFERENCE, 'full');
                const bioText = (bioPreference === 'summary' && mbData.summary) ? mbData.summary : mbData.content;

                // Build metadata header
                let metadataHeader = buildMetadataHeader(mbData);

                // Build external links section
                const externalLinksSection = buildExternalLinksBBCode(mbData.externalLinks, mbData.artistName);

                // Build attribution
                const signature = `\n\n[align=center][u][url=${mbData.wikipediaUrl}]Bio from Wikipedia[/url] via [url=${mbData.musicbrainzUrl}]MusicBrainz[/url][/u][/align]`;

                bioContent = metadataHeader + bioText;
                if (externalLinksSection) {
                    bioContent += '\n\n' + externalLinksSection;
                }
                bioContent += signature;
                bioSource = 'Wikipedia via MusicBrainz';
            }

            // Step 6: If no bio but have metadata/links, show that
            if (!bioContent && mbData) {
                const linkCount = Object.values(mbData.externalLinks || {}).filter(v => v).length;

                if (linkCount > 0 || mbData.type || mbData.country) {
                    // Build content with just metadata and external links
                    let content = `[b][size=4]${mbData.artistName}[/size][/b]`;
                    if (mbData.disambiguation) {
                        content += ` [i](${mbData.disambiguation})[/i]`;
                    }
                    content += '\n\n';

                    const metadataHeader = buildMetadataHeader(mbData);
                    if (metadataHeader) {
                        content += metadataHeader;
                    }

                    const externalLinksSection = buildExternalLinksBBCode(mbData.externalLinks, mbData.artistName);
                    if (externalLinksSection) {
                        content += externalLinksSection + '\n';
                    }

                    content += `\n[align=center][i]No biography available[/i]\n[u][url=${mbData.musicbrainzUrl}]View on MusicBrainz[/url][/u][/align]`;

                    bioContent = content;
                    bioSource = 'MusicBrainz (metadata only)';
                }
            }

            // Step 7: Fill the field or show error
            if (bioContent) {
                bioField.value = bioContent;
                bioField.dispatchEvent(new Event('input', { bubbles: true }));
                bioField.dispatchEvent(new Event('change', { bubbles: true }));

                const linkCount = Object.values(discoveredLinks).filter(v => v).length;
                console.log(`[Build Bio] Success from ${bioSource} with ${linkCount} external links`);
                showNotification(`Bio filled from ${bioSource}! (${linkCount} links found)`, 'success');

                // Step 8: Fetch and rehost artist image from Last.fm
                try {
                    await rehostArtistImage(artistName);
                } catch (imgError) {
                    console.warn('[Build Bio] Failed to rehost artist image:', imgError.message);
                }
            } else {
                showNotification(`No biography or metadata found for ${artistName}`, 'warning');
            }

        } catch (error) {
            console.error('[Build Bio] Error:', error);
            showNotification(`Error building bio: ${error.message}`, 'error');
        } finally {
            // Restore button state
            if (buildBioBtn) {
                buildBioBtn.textContent = '🔨 Build Bio';
                buildBioBtn.disabled = false;
            }
        }
    }

    /**
     * Helper to build metadata header BBCode
     * Currently disabled - returns empty string
     */
    function buildMetadataHeader(data) {
        // Metadata header disabled - just return empty string
        return '';
    }

    /**
     * Create and inject the auto-fill buttons
     */
    function injectAutoFillButton() {
        // Check if buttons already exist
        if (document.getElementById('build-bio-btn')) {
            return;
        }

        // Only inject on artist edit/create pages (not regular artist view pages)
        const urlParams = new URLSearchParams(window.location.search);
        const isEditPage = urlParams.get('action') === 'edit' || urlParams.get('action') === 'create';

        if (!window.location.pathname.includes('artist.php') || !isEditPage) {
            console.log('[Auto-Fill] Not on artist edit/create page, skipping button injection');
            return;
        }

        // Create main Build Bio button
        const buildBioButton = document.createElement('button');
        buildBioButton.id = 'build-bio-btn';
        buildBioButton.type = 'button';
        buildBioButton.textContent = '🔨 Build Bio';
        buildBioButton.title = 'Fetch biography and discover all external links for this artist';
        buildBioButton.style.cssText = `
            padding: 10px 20px;
            margin: 10px 5px;
            background: linear-gradient(135deg, #BA478F 0%, #d51007 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        buildBioButton.addEventListener('mouseenter', () => {
            buildBioButton.style.transform = 'scale(1.02)';
            buildBioButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        buildBioButton.addEventListener('mouseleave', () => {
            buildBioButton.style.transform = 'scale(1)';
            buildBioButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });

        buildBioButton.addEventListener('click', performBuildBio);

        // Create Settings button
        const settingsButton = document.createElement('button');
        settingsButton.id = 'bio-settings-btn';
        settingsButton.type = 'button';
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Open settings';
        settingsButton.style.cssText = `
            padding: 10px 12px;
            margin: 10px 5px;
            background-color: #444;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            transition: background-color 0.2s;
            display: inline-block;
        `;

        settingsButton.addEventListener('mouseenter', () => {
            settingsButton.style.backgroundColor = '#333';
        });
        settingsButton.addEventListener('mouseleave', () => {
            settingsButton.style.backgroundColor = '#444';
        });
        settingsButton.addEventListener('click', openSettingsModal);

        // Helper function to create button container
        function createButtonContainer(styleOverrides = '') {
            const container = document.createElement('div');
            container.id = 'bio-builder-container';
            container.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.03); border-radius: 8px;' + styleOverrides;

            // Row 1: Main action buttons
            const mainRow = document.createElement('div');
            mainRow.style.cssText = 'margin-bottom: 8px;';
            mainRow.appendChild(buildBioButton);
            mainRow.appendChild(settingsButton);

            // Row 2: Dynamic links (populated after Build Bio runs)
            const linksRow = document.createElement('div');
            linksRow.id = 'bio-dynamic-links-row';
            linksRow.style.cssText = 'min-height: 30px; padding: 5px 0;';
            linksRow.innerHTML = '<span style="color: #888; font-size: 12px; font-style: italic;">Click "Build Bio" to discover external links</span>';

            container.appendChild(mainRow);
            container.appendChild(linksRow);

            return container;
        }

        // Try to find a good place to inject the buttons
        const injectLocations = [
            () => {
                // Method 1: Inject after the "Artist information:" heading
                const h3 = Array.from(document.querySelectorAll('h3')).find(
                    h => h.textContent.includes('Artist information')
                );
                if (h3) {
                    const container = createButtonContainer();
                    h3.parentElement.insertBefore(container, h3.nextSibling);
                    console.log('[Auto-Fill] Buttons injected after "Artist information" heading');
                    return true;
                }
                return false;
            },
            () => {
                // Method 2: Inject before the textarea wrapper div
                const textareaWrap = document.querySelector('#textarea_wrap_0');
                if (textareaWrap && textareaWrap.parentElement) {
                    const container = createButtonContainer();
                    textareaWrap.parentElement.insertBefore(container, textareaWrap);
                    console.log('[Auto-Fill] Buttons injected before textarea wrapper');
                    return true;
                }
                return false;
            },
            () => {
                // Method 3: Inject before the BBCode toolbar
                const wbbcode = document.querySelector('.wbbcode');
                if (wbbcode && wbbcode.parentElement && wbbcode.parentElement.parentElement) {
                    const container = createButtonContainer(' padding: 10px 0;');
                    wbbcode.parentElement.parentElement.insertBefore(container, wbbcode.parentElement);
                    console.log('[Auto-Fill] Buttons injected before BBCode toolbar');
                    return true;
                }
                return false;
            },
            () => {
                // Method 4: Try to find artist info field and inject before it
                const bioField = getArtistInfoField();
                if (bioField && bioField.parentElement && bioField.parentElement.parentElement) {
                    const container = createButtonContainer(' padding: 10px;');
                    bioField.parentElement.parentElement.insertBefore(container, bioField.parentElement);
                    console.log('[Auto-Fill] Buttons injected before artist info field');
                    return true;
                }
                return false;
            },
            () => {
                // Method 5: Inject at the top of the form
                const form = document.querySelector('form');
                if (form) {
                    const container = createButtonContainer(' padding: 10px; background-color: #f5f5f5; border-radius: 4px;');
                    form.insertBefore(container, form.firstChild);
                    console.log('[Auto-Fill] Buttons injected at top of form');
                    return true;
                }
                return false;
            },
            () => {
                // Last resort: sticky header
                if (document.body) {
                    const container = createButtonContainer(' position: sticky; top: 0; z-index: 1000; background: #f5f5f5; padding: 10px; border-bottom: 2px solid #BA478F; text-align: center;');
                    document.body.insertBefore(container, document.body.firstChild);
                    console.log('[Auto-Fill] Buttons injected at top of page (sticky)');
                    return true;
                }
                return false;
            }
        ];

        // Try each injection method
        for (const inject of injectLocations) {
            if (inject()) {
                console.log('[Auto-Fill] Buttons injected successfully');
                return;
            }
        }

        console.warn('[Auto-Fill] Could not find suitable location for buttons');
    }

    /**
     * Clear Last.fm API key (for menu command)
     */
    function clearAPIKey() {
        GM_setValue(CONFIG.API_KEY_STORAGE, '');
        showNotification('Last.fm API key cleared. You will be prompted on next use.', 'info');
    }

    /**
     * Set ptpimg API key (for menu command)
     */
    function setPtpimgAPIKey() {
        const currentKey = GM_getValue(CONFIG.PTPIMG_API_KEY_STORAGE, '');
        const message = currentKey
            ? 'Current ptpimg API key is set.\n\nEnter a new ptpimg API key (or leave blank to cancel):'
            : 'Enter your ptpimg.me API key:\n\nGet one at: https://ptpimg.me/register.php';

        const apiKey = prompt(message, currentKey ? '(hidden)' : '');

        if (apiKey && apiKey.trim() && apiKey !== '(hidden)') {
            GM_setValue(CONFIG.PTPIMG_API_KEY_STORAGE, apiKey.trim());
            showNotification('ptpimg API key saved successfully!', 'success');
        } else if (apiKey === '') {
            showNotification('No changes made to ptpimg API key', 'info');
        }
    }

    /**
     * Clear ptpimg API key (for menu command)
     */
    function clearPtpimgAPIKey() {
        GM_setValue(CONFIG.PTPIMG_API_KEY_STORAGE, '');
        showNotification('ptpimg API key cleared. You will be prompted on next use.', 'info');
    }

    /**
     * Show ptpimg API key (for debugging)
     */
    function showPtpimgAPIKey() {
        const apiKey = GM_getValue(CONFIG.PTPIMG_API_KEY_STORAGE, '');
        if (apiKey) {
            alert(`Your ptpimg.me API Key:\n\n${apiKey}\n\n(Copy this before closing)`);
        } else {
            alert('No ptpimg API key is currently saved.');
        }
    }

    /**
     * Clear cache (for menu command)
     */
    function clearCache() {
        let clearedCount = 0;

        // Use GM_listValues to get all stored keys and delete cache entries
        try {
            const keys = GM_listValues();
            console.log(`[Auto-Fill] Found ${keys.length} stored keys`);

            keys.forEach(key => {
                // Clear both Last.fm and MusicBrainz cache entries
                if (key.startsWith(CONFIG.CACHE_PREFIX) || key.startsWith(CONFIG.CACHE_PREFIX_MB)) {
                    GM_deleteValue(key);
                    console.log(`[Auto-Fill] Deleted cache key: ${key}`);
                    clearedCount++;
                }
            });
        } catch (e) {
            console.error('[Auto-Fill] Error clearing cache:', e);

            // Fallback: clear the specific artist cache keys we know about
            const artistName = getArtistNameFromPage();
            if (artistName) {
                const lastfmCacheKey = CONFIG.CACHE_PREFIX + `bio_${artistName.toLowerCase()}`;
                const mbCacheKey = CONFIG.CACHE_PREFIX_MB + `mb_bio_${artistName.toLowerCase()}`;
                GM_deleteValue(lastfmCacheKey);
                GM_deleteValue(mbCacheKey);
                console.log(`[Auto-Fill] Cleared cache for: ${artistName}`);
                clearedCount += 2;
            }
        }

        showNotification(`Cache cleared (${clearedCount} entries)! Try auto-fill again.`, 'success');
    }

    /**
     * Toggle biography preference
     */
    function toggleBioPreference() {
        const currentPref = GM_getValue(CONFIG.BIO_PREFERENCE, 'full');
        const newPref = currentPref === 'full' ? 'summary' : 'full';
        GM_setValue(CONFIG.BIO_PREFERENCE, newPref);
        showNotification(`Biography preference set to: ${newPref}`, 'info');
    }

    /**
     * Show current API key (for debugging)
     */
    function showAPIKey() {
        const apiKey = GM_getValue(CONFIG.API_KEY_STORAGE, '');
        if (apiKey) {
            alert(`Your Last.fm API Key:\n\n${apiKey}\n\n(Copy this before closing)`);
        } else {
            alert('No API key is currently saved.');
        }
    }


    // ========================================
    // FAVICON UPLOAD UTILITY (Dev)
    // ========================================

    /**
     * Fetch SVG and convert to PNG data URL using canvas
     * @param {string} svgUrl - URL of the SVG to fetch
     * @param {number} size - Output size in pixels (default 32)
     * @returns {Promise<Blob>} - PNG blob
     */
    function svgToPngBlob(svgUrl, size = 32) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: svgUrl,
                timeout: 10000,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`Failed to fetch SVG: HTTP ${response.status}`));
                        return;
                    }

                    try {
                        // Create a blob URL from the SVG content
                        const svgBlob = new Blob([response.responseText], { type: 'image/svg+xml' });
                        const svgBlobUrl = URL.createObjectURL(svgBlob);

                        // Create an image element to load the SVG
                        const img = new Image();
                        img.onload = function() {
                            // Create canvas and draw the image
                            const canvas = document.createElement('canvas');
                            canvas.width = size;
                            canvas.height = size;
                            const ctx = canvas.getContext('2d');

                            // Draw SVG onto canvas
                            ctx.drawImage(img, 0, 0, size, size);

                            // Convert to PNG blob
                            canvas.toBlob(function(blob) {
                                URL.revokeObjectURL(svgBlobUrl);
                                if (blob) {
                                    resolve(blob);
                                } else {
                                    reject(new Error('Failed to convert canvas to blob'));
                                }
                            }, 'image/png');
                        };

                        img.onerror = function() {
                            URL.revokeObjectURL(svgBlobUrl);
                            reject(new Error('Failed to load SVG as image'));
                        };

                        img.src = svgBlobUrl;
                    } catch (e) {
                        reject(new Error('Error processing SVG: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error fetching SVG: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('SVG fetch timed out'));
                }
            });
        });
    }

    /**
     * Upload a PNG blob to ptpimg
     * @param {Blob} pngBlob - PNG blob to upload
     * @param {string} filename - Filename for the upload
     * @returns {Promise<string>} - ptpimg URL
     */
    function uploadBlobToPtpimg(pngBlob, filename) {
        return new Promise((resolve, reject) => {
            const apiKey = getPtpimgAPIKey();
            if (!apiKey) {
                reject(new Error('No ptpimg API key available'));
                return;
            }

            // Create form data for file upload
            const formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('file-upload[]', pngBlob, filename);

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.PTPIMG_UPLOAD_URL,
                data: formData,
                headers: {
                    'Referer': 'https://ptpimg.me/index.php'
                },
                timeout: 30000,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`ptpimg upload failed: HTTP ${response.status}`));
                        return;
                    }

                    try {
                        console.log(`[Favicon Upload] PTPimg raw response:`, response.responseText);
                        const data = JSON.parse(response.responseText);

                        if (Array.isArray(data) && data.length > 0) {
                            const upload = data[0];
                            if (upload.code && upload.ext) {
                                resolve(`https://ptpimg.me/${upload.code}.${upload.ext}`);
                                return;
                            }
                        }

                        if (data.error) {
                            reject(new Error(`ptpimg error: ${data.error}`));
                            return;
                        }

                        reject(new Error('Unexpected ptpimg response format'));
                    } catch (e) {
                        reject(new Error('Failed to parse ptpimg response: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error uploading to ptpimg: ' + error));
                },
                ontimeout: function() {
                    reject(new Error('ptpimg upload timed out'));
                }
            });
        });
    }

    /**
     * Upload all Simple Icons SVGs to ptpimg as PNGs
     * This is a dev utility to generate the hardcoded ptpimg URLs
     */
    async function uploadFavicons() {
        // Simple Icons CDN SVG URLs with brand colors
        const iconsToUpload = {
            spotify: { svg: 'https://cdn.simpleicons.org/spotify/1DB954', color: '1DB954' },
            appleMusic: { svg: 'https://cdn.simpleicons.org/applemusic/FA243C', color: 'FA243C' },
            bandcamp: { svg: 'https://cdn.simpleicons.org/bandcamp/629AA9', color: '629AA9' },
            soundcloud: { svg: 'https://cdn.simpleicons.org/soundcloud/FF5500', color: 'FF5500' },
            youtube: { svg: 'https://cdn.simpleicons.org/youtube/FF0000', color: 'FF0000' },
            youtubeMusic: { svg: 'https://cdn.simpleicons.org/youtubemusic/FF0000', color: 'FF0000' },
            deezer: { svg: 'https://cdn.simpleicons.org/deezer/FEAA2D', color: 'FEAA2D' },
            tidal: { svg: 'https://cdn.simpleicons.org/tidal/000000', color: '000000' },
            discogs: { svg: 'https://cdn.simpleicons.org/discogs/333333', color: '333333' },
            allmusic: { svg: 'https://cdn.simpleicons.org/allmusic/E41B17', color: 'E41B17' },
            lastfm: { svg: 'https://cdn.simpleicons.org/lastdotfm/D51007', color: 'D51007' },
            wikipedia: { svg: 'https://cdn.simpleicons.org/wikipedia/000000', color: '000000' },
            twitter: { svg: 'https://cdn.simpleicons.org/x/000000', color: '000000' },
            facebook: { svg: 'https://cdn.simpleicons.org/facebook/1877F2', color: '1877F2' },
            instagram: { svg: 'https://cdn.simpleicons.org/instagram/E4405F', color: 'E4405F' },
            musicbrainz: { svg: 'https://cdn.simpleicons.org/musicbrainz/BA478F', color: 'BA478F' },
            beatport: { svg: 'https://cdn.simpleicons.org/beatport/94D500', color: '94D500' },
            genius: { svg: 'https://cdn.simpleicons.org/genius/FFFF64', color: 'FFFF64' },
            amazonmusic: { svg: 'https://cdn.simpleicons.org/amazonmusic/FF9900', color: 'FF9900' }
        };

        const results = {};
        let successCount = 0;
        let failCount = 0;

        showNotification('Starting SVG→PNG→ptpimg upload... Check console for progress.', 'info');
        console.log('[Favicon Upload] Starting upload of ' + Object.keys(iconsToUpload).length + ' icons...');

        for (const [name, config] of Object.entries(iconsToUpload)) {
            try {
                console.log(`[Favicon Upload] Processing ${name}: ${config.svg}`);

                // Step 1: Fetch SVG and convert to PNG blob
                showNotification(`Converting ${name} SVG to PNG...`, 'info');
                const pngBlob = await svgToPngBlob(config.svg, 32);
                console.log(`[Favicon Upload] Converted ${name} to PNG (${pngBlob.size} bytes)`);

                // Step 2: Upload PNG blob to ptpimg
                showNotification(`Uploading ${name} to ptpimg...`, 'info');
                const ptpimgUrl = await uploadBlobToPtpimg(pngBlob, `${name}-icon.png`);

                results[name] = ptpimgUrl;
                successCount++;
                console.log(`[Favicon Upload] ✓ ${name}: ${ptpimgUrl}`);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (error) {
                console.error(`[Favicon Upload] ✗ ${name} failed:`, error.message);
                results[name] = `ERROR: ${error.message}`;
                failCount++;
            }
        }

        // Log results as JavaScript object for easy copy-paste into linkConfig
        console.log('\n[Favicon Upload] === RESULTS ===');
        console.log('Copy these URLs into the linkConfig object:\n');

        const configOutput = Object.entries(results)
            .filter(([k, v]) => !v.startsWith('ERROR'))
            .map(([k, v]) => `            ${k}: { label: '${k}', favicon: '${v}' },`)
            .join('\n');

        console.log(configOutput);
        console.log('\n=================================');

        // Also create a simple object for storage
        const ptpimgFavicons = {};
        for (const [k, v] of Object.entries(results)) {
            if (!v.startsWith('ERROR')) {
                ptpimgFavicons[k] = v;
            }
        }

        // Store in GM storage for later use
        GM_setValue('ptpimg_favicons', JSON.stringify(ptpimgFavicons));
        console.log('[Favicon Upload] Saved to GM storage as "ptpimg_favicons"');

        showNotification(`Upload complete! ${successCount} success, ${failCount} failed. Check console for URLs.`, successCount > 0 ? 'success' : 'error');

        // Show results in alert
        alert('Favicon Upload Results:\n\n' +
            Object.entries(results)
                .map(([k, v]) => `${k}: ${v.substring(0, 50)}${v.length > 50 ? '...' : ''}`)
                .join('\n') +
            '\n\nFull URLs logged to console.\nSaved to GM storage.');

        return results;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize the script
     */
    function init() {
        console.log('[Auto-Fill] Last.fm & MusicBrainz Bio Auto-Fill v1.5.0 initialized');

        // Register menu commands
        GM_registerMenuCommand('Settings', openSettingsModal);
        GM_registerMenuCommand('─────────────────────', () => {}); // Separator
        GM_registerMenuCommand('Clear Cache', clearCache);
        GM_registerMenuCommand('Toggle Bio Length (Full/Summary)', toggleBioPreference);
        GM_registerMenuCommand('Upload Favicons to ptpimg (Dev)', uploadFavicons);

        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectAutoFillButton);
        } else {
            // DOM already loaded
            setTimeout(injectAutoFillButton, 500);
        }

        // Also try to inject after a delay (for dynamic content)
        setTimeout(injectAutoFillButton, 2000);
    }

    // Start the script
    init();

})();
