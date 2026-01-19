// ==UserScript==
// @name         Universal Servarr Add Tool (RT, MAL, ANN, IMDb, JustWatch, Letterboxd)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Add content to Sonarr/Radarr with Deep Scraping (RT/JW/MAL/Lboxd), Batch Enrichment, and Manual Controls.
// @author       mostmurda
// @license      MIT
// @match        https://myanimelist.net/*
// @match        https://www.rottentomatoes.com/*
// @match        https://editorial.rottentomatoes.com/*
// @match        https://www.animenewsnetwork.com/encyclopedia/anime.php*
// @match        https://www.imdb.com/title/*
// @match        https://www.justwatch.com/*
// @match        https://letterboxd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=cvillarreal42073@gmail.com
// @contributionAmount $5
// @downloadURL https://update.greasyfork.org/scripts/563209/Universal%20Servarr%20Add%20Tool%20%28RT%2C%20MAL%2C%20ANN%2C%20IMDb%2C%20JustWatch%2C%20Letterboxd%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563209/Universal%20Servarr%20Add%20Tool%20%28RT%2C%20MAL%2C%20ANN%2C%20IMDb%2C%20JustWatch%2C%20Letterboxd%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // MODULE: UTILITIES
    // ==========================================
    const Utils = {
        escapeHTML: (str) => {
            if (!str) return '';
            return str.replace(/[&<>'"]/g,
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
        },
        formatBytes: (bytes, decimals = 1) => {
            if (!bytes) return '0 B';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        normalize: (str) => {
            if (!str) return '';
            return str.replace(/[\p{Z}\s]+/gu, ' ').toLowerCase().replace(/[^a-z0-9]/g, '');
        },
        cleanTitle: (str) => {
            if (!str) return '';
            let clean = str.replace(/[\p{Z}\s]+/gu, ' ').trim();
            clean = clean.replace(/\s*\((TV|movie|OAV|ONA|special|\d{4})\)$/i, '');
            clean = clean.replace(/\s+(II|III|IV|V|VI)$/i, '');
            clean = clean.replace(/^Poster for\s+/i, ''); // Lboxd cleanup

            const triggers = [
                ' Season', ' : Season', ' - Season',
                ' Part', ' : Part', ' - Part',
                ' Cour', ' : Cour', ' - Cour',
                ' 2nd Season', ' 3rd Season', ' 4th Season',
                ' Final Season', ' The Final Season'
            ];
            const lower = clean.toLowerCase();
            let cutoffIndex = -1;
            for (const trigger of triggers) {
                const idx = lower.indexOf(trigger.toLowerCase());
                if (idx > -1) {
                    if (cutoffIndex === -1 || idx < cutoffIndex) cutoffIndex = idx;
                }
            }
            if (cutoffIndex > -1) clean = clean.substring(0, cutoffIndex);
            clean = clean.replace(/\s+Season\s+\d+.*$/i, '');
            return clean.trim();
        },
        toast: (message, type = 'info') => {
            const id = 'servarr-toast-container';
            let container = document.getElementById(id);
            if (!container) {
                container = document.createElement('div');
                container.id = id;
                container.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; display: flex; flex-direction: column; gap: 10px; pointer-events: none;`;
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            const bg = type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db';
            toast.style.cssText = `background: ${bg}; color: white; padding: 12px 24px; border-radius: 6px; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-weight: 600; opacity: 0; transform: translateY(20px); transition: all 0.3s;`;
            toast.textContent = message;
            container.appendChild(toast);
            requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
            setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; setTimeout(() => toast.remove(), 300); }, 3500);
        }
    };

    // ==========================================
    // MODULE: CONFIGURATION & CACHE
    // ==========================================
    const Config = {
        get: () => ({
            radarrUrl: GM_getValue('radarr_url', '').replace(/\/+$/, ''),
            sonarrUrl: GM_getValue('sonarr_url', '').replace(/\/+$/, ''),
            radarrKey: GM_getValue('radarr_api_key', ''),
            sonarrKey: GM_getValue('sonarr_api_key', ''),
            iconPos: JSON.parse(GM_getValue('icon_pos', '{"top":"20px","left":"20px"}')),
            lastProfileId: GM_getValue('last_profile_id', null),
            lastRootPath: GM_getValue('last_root_path', null),
            lastSearchNow: GM_getValue('last_search_now', true)
        }),
        isValid: () => {
            const c = Config.get();
            // If any key is missing, prompt user
            return c.radarrUrl && c.sonarrUrl && c.radarrKey && c.sonarrKey;
        },
        save: (rUrl, sUrl, rKey, sKey) => {
            GM_setValue('radarr_url', rUrl);
            GM_setValue('sonarr_url', sUrl);
            GM_setValue('radarr_api_key', rKey);
            GM_setValue('sonarr_api_key', sKey);
            GM_setValue('cache_radarr', '');
            GM_setValue('cache_sonarr', '');
        },
        savePos: (top, left) => {
            GM_setValue('icon_pos', JSON.stringify({ top, left }));
        },
        saveDefaults: (profileId, rootPath, searchNow) => {
            GM_setValue('last_profile_id', profileId);
            GM_setValue('last_root_path', rootPath);
            GM_setValue('last_search_now', searchNow);
        },
        reset: () => {
            if (confirm("Reset all Servarr credentials?")) {
                GM_setValue('radarr_url', ''); GM_setValue('sonarr_url', ''); GM_setValue('radarr_api_key', ''); GM_setValue('sonarr_api_key', ''); GM_setValue('cache_radarr', ''); GM_setValue('cache_sonarr', '');
                location.reload();
            }
        }
    };
    GM_registerMenuCommand("Reset Servarr Credentials", Config.reset);

    // ==========================================
    // MODULE: API CLIENT & DEEP SCRAPER
    // ==========================================
    const Api = {
        fetch: async (url, apiKey, options = {}) => {
            const headers = { 'X-Api-Key': apiKey, 'Content-Type': 'application/json', ...options.headers };
            const res = await fetch(url, { ...options, headers });
            if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
            return res.json();
        },
        fetchPage: (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (response) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        resolve(doc);
                    },
                    onerror: reject
                });
            });
        },
        getOptions: async (destination) => {
            const CACHE_KEY = `cache_${destination}`;
            const cached = GM_getValue(CACHE_KEY, null);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed.data && Array.isArray(parsed.data.folders) && Array.isArray(parsed.data.profiles)) return parsed.data;
                } catch (e) { GM_setValue(CACHE_KEY, ''); }
            }
            const c = Config.get();
            const key = destination === 'radarr' ? c.radarrKey : c.sonarrKey;
            const url = destination === 'radarr' ? c.radarrUrl : c.sonarrUrl;
            const [profiles, folders] = await Promise.all([
                Api.fetch(`${url}/api/v3/qualityProfile`, key),
                Api.fetch(`${url}/api/v3/rootfolder`, key)
            ]);
            const data = { profiles, folders };
            GM_setValue(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: data }));
            return data;
        },
        processTags: async (url, apiKey, tagString) => {
            if (!tagString) return [];
            const tags = tagString.split(',').map(t => t.trim()).filter(Boolean);
            const existingTags = await Api.fetch(`${url}/api/v3/tag`, apiKey);
            const tagIds = [];
            for (const label of tags) {
                const match = existingTags.find(t => t.label.toLowerCase() === label.toLowerCase());
                if (match) tagIds.push(match.id);
                else {
                    const newTag = await Api.fetch(`${url}/api/v3/tag`, apiKey, { method: 'POST', body: JSON.stringify({ label }) });
                    tagIds.push(newTag.id);
                }
            }
            return tagIds;
        },
        findStrictMatch: (results, data) => {
            return results.find(item => {
                if (data.tmdbId && item.tmdbId === parseInt(data.tmdbId)) return true;
                if (data.imdbId && item.imdbId === data.imdbId) return true;
                const dbTitle = Utils.normalize(item.title);
                const mainTitle = Utils.normalize(data.title);
                const cleanMainTitle = Utils.normalize(Utils.cleanTitle(data.title));
                const engTitle = Utils.normalize(data.engTitle);
                const cleanEngTitle = Utils.normalize(Utils.cleanTitle(data.engTitle));

                if (dbTitle === mainTitle) return true;
                if (dbTitle === cleanMainTitle) return true;
                if (engTitle && dbTitle === engTitle) return true;
                if (cleanEngTitle && dbTitle === cleanEngTitle) return true;
                return false;
            });
        },
        checkLibrary: async (destination, data) => {
            const c = Config.get();
            const key = destination === 'radarr' ? c.radarrKey : c.sonarrKey;
            const url = destination === 'radarr' ? c.radarrUrl : c.sonarrUrl;
            try {
                const terms = [
                    data.tmdbId ? `tmdb:${data.tmdbId}` : null,
                    data.imdbId ? `imdb:${data.imdbId}` : null,
                    data.engTitle ? Utils.cleanTitle(data.engTitle) : null,
                    destination === 'sonarr' ? Utils.cleanTitle(data.title) : null,
                    data.title
                ].filter(Boolean);
                const endpoint = destination === 'radarr' ? 'movie' : 'series';
                const items = await Api.fetch(`${url}/api/v3/${endpoint}/lookup?term=${encodeURIComponent(terms[0])}`, key);
                const match = Api.findStrictMatch(items, data);
                if (match && match.id > 0) return match;
                return null;
            } catch (e) { return null; }
        },

        // --- UNIVERSAL DEEP SCRAPER ---
        enrichData: async (data) => {
            if (!data.detailUrl) return data;

            // 1. MyAnimeList
            if (data.detailUrl.includes('myanimelist.net') && !data.engTitle) {
                try {
                    const doc = await Api.fetchPage(data.detailUrl);
                    const sidebarDivs = doc.querySelectorAll('.spaceit_pad');
                    for (const div of sidebarDivs) {
                        if (div.innerText.includes('English:')) {
                            data.engTitle = div.innerText.split('English:')[1].trim();
                            break;
                        }
                    }
                    if (data.engTitle) data.engTitle = Utils.cleanTitle(data.engTitle);
                } catch(e) { console.warn('MAL Scan failed', e); }
            }

            // 2. Rotten Tomatoes
            if (data.detailUrl.includes('rottentomatoes.com') && data.year === 'Unknown') {
                try {
                    const doc = await Api.fetchPage(data.detailUrl);
                    const schema = doc.querySelector('script[type="application/ld+json"]');
                    if (schema) {
                        const json = JSON.parse(schema.textContent);
                        const date = json.datePublished || json.dateCreated || json.startDate;
                        if (date) {
                            const match = date.match(/\d{4}/);
                            if (match) data.year = match[0];
                        }
                    }
                    if (data.year === 'Unknown') {
                        const h1 = doc.querySelector('h1');
                        if (h1 && h1.textContent.match(/\(\d{4}\)/)) {
                            data.year = h1.textContent.match(/\((\d{4})\)/)[1];
                        }
                    }
                } catch(e) { console.warn('RT Scan failed', e); }
            }

            // 3. JustWatch
            if (data.detailUrl.includes('justwatch.com') && data.year === 'Unknown') {
                try {
                    const doc = await Api.fetchPage(data.detailUrl);
                    const titleBlock = doc.querySelector('.title-block h1');
                    if (titleBlock) {
                        const match = titleBlock.textContent.match(/\((\d{4})\)/);
                        if (match) data.year = match[1];
                    }
                    if (data.year === 'Unknown') {
                        const rel = doc.querySelector('.release-year');
                        if (rel) data.year = rel.textContent.trim();
                    }
                } catch(e) { console.warn('JW Scan failed', e); }
            }

            // 4. Letterboxd
            if (data.detailUrl.includes('letterboxd.com') && (!data.tmdbId || data.year === 'Unknown')) {
                try {
                    const doc = await Api.fetchPage(data.detailUrl);
                    if (doc.body.dataset.tmdbId) data.tmdbId = doc.body.dataset.tmdbId;
                    const jsonLd = doc.querySelector('script[type="application/ld+json"]');
                    if (jsonLd) {
                        const json = JSON.parse(jsonLd.textContent.split('\n').filter(l=>!l.includes('//')).join('\n'));
                        if (json.datePublished) data.year = json.datePublished.substring(0,4);
                    }
                    if (data.year === 'Unknown') {
                        const dateLink = doc.querySelector('.releasedate a');
                        if (dateLink) data.year = dateLink.textContent.trim();
                    }
                } catch (e) { console.warn('Letterboxd Scan failed', e); }
            }

            return data;
        }
    };
    // ==========================================
    // MODULE: SITE ADAPTERS
    // ==========================================
    const SiteAdapters = [
        {
            name: 'RottenTomatoes',
            domain: 'rottentomatoes.com',
            detect: () => /^\/(m|tv)\//.test(window.location.pathname),
            theme: { id: 'rt', overlay: 'rgba(255, 255, 255, 0.85)', bg: '#FFFFFF', text: '#2A2C32', primaryBtn: '#FA320A', secondaryBtn: '#E8E8E8', accentColor: '#FA320A', font: '"Franklin Gothic FS", "Helvetica Neue", Helvetica, Arial, sans-serif', radius: '24px', inputBg: '#F3F3F3', inputBorder: '1px solid transparent', badgeBg: '#E8E8E8', shadow: '0 10px 40px rgba(0,0,0,0.15)', headerTransform: 'uppercase' },
            scrape: async () => {
                let title = 'Unknown', year = 'Unknown', type = 'unknown', imdbId = null;
                const jsonLd = document.querySelector('script[type="application/ld+json"]');
                if (jsonLd) { try { const data = JSON.parse(jsonLd.textContent); if (data.name) title = data.name; const date = data.dateCreated || data.datePublished || data.startDate; if (date) year = (date.match(/\d{4}/) || [])[0] || 'Unknown'; if (data['@type'] === 'Movie') type = 'movie'; else if (data['@type'] === 'TVSeries') type = 'tv'; if (data.sameAs) { const imdbLink = Array.isArray(data.sameAs) ? data.sameAs.find(l => l.includes('imdb.com/title/')) : (data.sameAs.includes('imdb.com') ? data.sameAs : null); if (imdbLink) { const match = imdbLink.match(/tt\d+/); if (match) imdbId = match[0]; } } } catch(e) {} }
                if (title === 'Unknown') title = document.querySelector('h1')?.textContent.trim() || 'Unknown';
                if (year === 'Unknown') year = document.querySelector('rt-text[slot="metadataProp"]')?.textContent.trim() || 'Unknown';
                if (type === 'unknown') type = window.location.pathname.startsWith('/m/') ? 'movie' : 'tv';
                if (type === 'tv' && window.location.pathname.match(/\/s\d+$/)) title = title.split('–')[1]?.trim() || title.replace(/^Season \d+[\s–-]/i, '').trim();
                return { title, year, type, imdbId, detailUrl: window.location.href };
            }
        },
        {
            name: 'MyAnimeList',
            domain: 'myanimelist.net',
            detect: () => /^\/anime\//.test(window.location.pathname),
            theme: { id: 'mal', overlay: 'rgba(0, 0, 0, 0.7)', bg: '#FFFFFF', text: '#323232', primaryBtn: '#2E51A2', secondaryBtn: '#EDF1F5', accentColor: '#2E51A2', font: 'Verdana, Arial, sans-serif', radius: '6px', inputBg: '#FFFFFF', inputBorder: '1px solid #BEBEBE', badgeBg: '#EDF1F5', shadow: '0 10px 30px rgba(0,0,0,0.4)', headerTransform: 'none' },
            scrape: async () => {
                const title = document.querySelector('h1.title-name, h1.title')?.textContent.trim() || 'Unknown';
                let engTitle = document.querySelector('p.title-english')?.textContent.trim() || '';
                let type = 'tv', year = 'Unknown', imdbId = null;
                const labels = document.querySelectorAll('.spaceit_pad');
                for (const label of labels) { if (label.textContent.includes('Type:')) if (/Movie|OVA|ONA/i.test(label.textContent)) type = 'movie'; if (label.textContent.includes('Aired:')) year = (label.textContent.match(/\d{4}/) || [])[0] || 'Unknown'; }
                const extLinks = document.querySelectorAll('a[href*="imdb.com/title/"]');
                if (extLinks.length > 0) { const match = extLinks[0].href.match(/tt\d+/); if (match) imdbId = match[0]; }
                return { title, engTitle, year, type, imdbId, detailUrl: window.location.href };
            }
        },
        {
            name: 'AnimeNewsNetwork',
            domain: 'animenewsnetwork.com',
            detect: () => /encyclopedia\/anime\.php/.test(window.location.pathname),
            theme: { id: 'ann', overlay: 'rgba(0, 0, 0, 0.7)', bg: '#FFFFFF', text: '#323232', primaryBtn: '#2D50A7', secondaryBtn: '#F3F3F3', accentColor: '#2D50A7', font: 'Arial, Helvetica, sans-serif', radius: '0px', inputBg: '#FFFFFF', inputBorder: '1px solid #ccc', badgeBg: '#E0E0E0', shadow: '0 10px 30px rgba(0,0,0,0.3)', headerTransform: 'none' },
            scrape: async () => {
                const h1 = document.querySelector('h1#page_header');
                let rawTitle = h1 ? h1.childNodes[0].textContent.trim() : 'Unknown';
                let type = 'tv'; if (rawTitle.match(/\(movie\)$/i)) type = 'movie'; else if (rawTitle.match(/\(OAV\)$/i)) type = 'movie'; else if (rawTitle.match(/\(special\)$/i)) type = 'tv';
                const title = rawTitle.replace(/\s*\((TV|movie|OAV|ONA|special)\)$/i, '').trim();
                let year = 'Unknown'; const vintageDiv = document.querySelector('#infotype-7'); if (vintageDiv) { const dateText = vintageDiv.textContent; const match = dateText.match(/\d{4}/); if (match) year = match[0]; }
                const altTitles = []; const altDiv = document.querySelector('#infotype-2'); if (altDiv) { const tabs = altDiv.querySelectorAll('.tab'); tabs.forEach(t => altTitles.push(t.textContent.trim())); }
                return { title, engTitle: '', altTitles, year, type, imdbId: null };
            }
        },
        {
            name: 'IMDb',
            domain: 'imdb.com',
            detect: () => /^\/title\/tt/.test(window.location.pathname),
            theme: { id: 'imdb', overlay: 'rgba(0, 0, 0, 0.8)', bg: '#1f1f1f', text: '#ffffff', primaryBtn: '#F5C518', secondaryBtn: '#333333', accentColor: '#F5C518', font: 'Roboto, Helvetica, Arial, sans-serif', radius: '4px', inputBg: '#2f2f2f', inputBorder: '1px solid #444', badgeBg: '#333333', shadow: '0 10px 40px rgba(0,0,0,0.5)', headerTransform: 'uppercase' },
            scrape: async () => {
                const h1 = document.querySelector('h1'); const title = h1 ? h1.textContent.trim() : 'Unknown'; const idMatch = window.location.pathname.match(/tt\d+/); const imdbId = idMatch ? idMatch[0] : null; let year = 'Unknown'; let type = 'movie';
                const jsonLd = document.querySelector('script[type="application/ld+json"]'); if (jsonLd) { try { const data = JSON.parse(jsonLd.textContent); if (data.datePublished) year = (data.datePublished.match(/\d{4}/) || [])[0] || 'Unknown'; if (data['@type'] === 'TVSeries' || data['@type'] === 'TVSeason') type = 'tv'; } catch(e) {} }
                if (year === 'Unknown') { const metaYear = document.querySelector('a[href*="/releaseinfo"]'); if (metaYear && metaYear.textContent.match(/\d{4}/)) year = metaYear.textContent.match(/\d{4}/)[0]; }
                if (document.body.innerText.includes('TV Series') || document.querySelector('meta[property="og:type"][content*="tv_show"]')) { type = 'tv'; }
                return { title, engTitle: '', year, type, imdbId };
            }
        },
        {
            name: 'JustWatch',
            domain: 'justwatch.com',
            detect: () => /^\/[a-z]{2}\/(movie|tv-show)\//.test(window.location.pathname),
            theme: { id: 'jw', overlay: 'rgba(0, 0, 0, 0.85)', bg: '#10161d', text: '#fff', primaryBtn: '#fbc500', secondaryBtn: '#222c38', accentColor: '#fbc500', font: '"Lato", Arial, sans-serif', radius: '4px', inputBg: '#222c38', inputBorder: '1px solid #333', badgeBg: '#333', shadow: '0 10px 40px rgba(0,0,0,0.6)', headerTransform: 'uppercase' },
            scrape: async () => {
                const h1 = document.querySelector('h1'); if (!h1) throw new Error('Not a details page');
                let rawTitle = h1.textContent.trim();
                let title = rawTitle;
                let year = 'Unknown';
                let type = 'unknown';
                let imdbId = null;
                const titleYearMatch = rawTitle.match(/\s\((\d{4})\)$/);
                if (titleYearMatch) {
                    year = titleYearMatch[1];
                    title = rawTitle.replace(/\s\(\d{4}\)$/, '').trim();
                } else {
                    const titleBlock = document.querySelector('.title-block');
                    if (titleBlock) {
                        const yearMatch = titleBlock.innerText.match(/(?:19\d{2}|20[0-3]\d)/);
                        if (yearMatch) year = yearMatch[0];
                    }
                }
                title = Utils.cleanTitle(title);
                if (window.location.pathname.includes('/movie/')) type = 'movie'; else if (window.location.pathname.includes('/tv-show/')) type = 'tv';
                const imdbLink = document.querySelector('a[href*="imdb.com"]'); if (imdbLink) { const match = imdbLink.href.match(/tt\d+/); if (match) imdbId = match[0]; }
                return { title, engTitle: '', year, type, imdbId, detailUrl: window.location.href };
            }
        },
        {
            name: 'Letterboxd',
            domain: 'letterboxd.com',
            detect: () => /^\/film\//.test(window.location.pathname),
            theme: { id: 'lboxd', overlay: 'rgba(20, 24, 28, 0.9)', bg: '#14181C', text: '#FFFFFF', primaryBtn: '#00E054', secondaryBtn: '#445566', accentColor: '#00E054', font: '"Graphik", Helvetica, Arial, sans-serif', radius: '4px', inputBg: '#2C3440', inputBorder: '1px solid #456', badgeBg: '#445566', shadow: '0 10px 40px rgba(0,0,0,0.5)', headerTransform: 'none' },
            scrape: async () => {
                const title = document.querySelector('h1.headline-1')?.textContent.trim() || 'Unknown';
                const yearLink = document.querySelector('.releasedate a');
                const year = yearLink ? yearLink.textContent.trim() : 'Unknown';
                let type = 'movie'; // Letterboxd is mostly movies
                if (document.body.dataset.tmdbType === 'tv') type = 'tv';
                const tmdbId = document.body.dataset.tmdbId ? parseInt(document.body.dataset.tmdbId) : null;
                const imdbLink = document.querySelector('a[data-track-action="IMDb"]');
                let imdbId = null;
                if (imdbLink) { const match = imdbLink.href.match(/tt\d+/); if (match) imdbId = match[0]; }
                return { title, engTitle: '', year, type, tmdbId, imdbId, detailUrl: window.location.href };
            }
        }
    ];
    // ==========================================
    // MODULE: UI STYLES
    // ==========================================
    GM_addStyle(`
        :root { --servarr-accent: #fbc500; }
        body.servarr-site-rt { --servarr-accent: #FA320A !important; }
        body.servarr-site-mal { --servarr-accent: #2E51A2 !important; }
        body.servarr-site-lboxd { --servarr-accent: #00E054 !important; }

        .servarr-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2147483640; backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.2s; }
        .servarr-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); width: 450px; max-width: 90vw; z-index: 2147483641; padding: 0; opacity: 0; transition: all 0.2s; box-sizing: border-box; overflow: hidden; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
        .servarr-modal.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        .servarr-modal.wide { width: 700px; }
        .servarr-overlay.visible { opacity: 1; }
        .servarr-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 15px; border-bottom: 2px solid; margin-bottom: 20px; flex-shrink: 0; }
        .servarr-title { font-size: 18px; font-weight: 700; line-height: 1.3; margin-bottom: 6px; }
        .servarr-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 15px; }
        .servarr-badge-input { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; width: 50px; border: none; outline: none; text-align: center; }
        .servarr-field-group { margin-bottom: 15px; flex-shrink: 0; }
        .servarr-label { display: block; margin-bottom: 6px; font-weight: 700; font-size: 11px; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.5px; }
        .servarr-input { width: 100%; box-sizing: border-box; outline: none; transition: border 0.2s; }
        .servarr-actions { display: flex; gap: 10px; margin-top: 15px; flex-shrink: 0; }
        .servarr-btn { border: none; cursor: pointer; font-weight: 700; font-size: 13px; text-transform: uppercase; display: flex; align-items: center; justify-content: center !important; text-align: center; transition: opacity 0.2s; width: 100%; }
        .servarr-btn:hover { opacity: 0.9; }

        /* TEXT-ONLY PICKER */
        #servarr-results-container { margin-top: 15px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; max-height: 250px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
        .servarr-result-item { display: flex; flex-direction: column; gap: 4px; padding: 12px; border: 1px solid transparent; cursor: pointer; transition: 0.2s; border-radius: 6px; background: rgba(0,0,0,0.2); }
        .servarr-result-item:hover { background: rgba(255,255,255,0.1); border-color: var(--servarr-accent); }
        .servarr-result-title { font-weight: bold; font-size: 14px; }
        .servarr-result-meta { font-size: 11px; opacity: 0.7; font-weight: bold; margin-bottom: 2px; }
        .servarr-result-overview { font-size: 11px; opacity: 0.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }

        /* BATCH REVIEW LIST - EDITABLE */
        #bm-review-list { max-height: 250px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 6px; padding: 10px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .bm-review-item { display: flex; gap: 10px; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .bm-review-item:last-child { border-bottom: none; }
        .bm-edit-title { flex: 1; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2); color: inherit; font-size: 12px; padding: 2px 4px; outline: none; }
        .bm-edit-title:focus { border-color: var(--servarr-accent); }
        .bm-edit-year { width: 50px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2); color: inherit; font-size: 12px; padding: 2px 4px; text-align: center; outline: none; }
        .bm-edit-year:focus { border-color: var(--servarr-accent); }
        .bm-remove-btn { background: transparent; border: none; color: #e74c3c; cursor: pointer; font-weight: bold; font-size: 14px; padding: 0 5px; flex-shrink: 0; }
        .bm-remove-btn:hover { color: #c0392b; }

        /* Grid Icons & Checkbox */
        .servarr-grid-icon { position: absolute; top: 5px; right: 5px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); border-radius: 50%; z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); transition: transform 0.2s, background 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.5); user-select: none; }
        .servarr-grid-icon:hover { transform: scale(1.1); background: rgba(0,0,0,0.95); border-color: #fff; }
        .servarr-grid-icon img { width: 20px; height: 20px; display: block; pointer-events: none; }
        .servarr-grid-icon.owned { border-color: #2ecc71; }
        .servarr-grid-icon.owned::after { content: '✔'; position: absolute; bottom: -2px; right: -2px; background: #2ecc71; color: white; width: 14px; height: 14px; font-size: 9px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .servarr-checkbox { position: absolute; top: 5px; left: 5px; width: 24px; height: 24px; background: rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.5); border-radius: 4px; z-index: 9999; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .servarr-checkbox:hover { background: rgba(0,0,0,0.8); border-color: #fff; }
        .servarr-checkbox.selected { background: var(--servarr-accent) !important; border-color: var(--servarr-accent) !important; }
        .servarr-checkbox.selected::after { content: '✓'; color: black; font-weight: bold; font-size: 16px; }
        .servarr-inline-checkbox { position:static; width:auto; height:auto; margin:0; }

        /* MAL Tweaks */
        body.servarr-site-mal .servarr-grid-icon { width: 16px; height: 16px; top: 1px; right: 1px; }
        body.servarr-site-mal .servarr-grid-icon img { width: 8px; height: 8px; }
        body.servarr-site-mal .servarr-checkbox { width: 14px; height: 14px; top: 1px; left: 1px; }
        body.servarr-site-mal .servarr-checkbox.selected::after { font-size: 8px; line-height: 14px; }

        #servarr-batch-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px); background: #10161d; color: white; padding: 15px 30px; border-radius: 50px; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); z-index: 2147483650; transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); border: 1px solid #333; }
        #servarr-batch-bar.visible { transform: translateX(-50%) translateY(0); }
        .servarr-batch-count { font-weight: bold; font-size: 16px; }
        .servarr-split-layout { display: flex; gap: 20px; }
        .servarr-col { flex: 1; }
        .servarr-section-title { font-weight: bold; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid; opacity: 0.8; }
    `);

    const BatchManager = {
        selected: new Set(),

        toggle: (data) => {
            const id = `${data.type}:${data.title}:${data.year}`;
            const existing = Array.from(BatchManager.selected).find(i => `${i.type}:${i.title}:${i.year}` === id);
            if (existing) BatchManager.selected.delete(existing);
            else BatchManager.selected.add(data);
            BatchManager.updateUI();
        },

        updateUI: () => {
            document.querySelectorAll('.servarr-checkbox').forEach(box => {
                const id = box.dataset.id;
                const isSelected = Array.from(BatchManager.selected).some(i => `${i.type}:${i.title}:${i.year}` === id);
                if (isSelected) box.classList.add('selected'); else box.classList.remove('selected');
            });
            const adapter = SiteAdapters.find(a => location.hostname.includes(a.domain)) || SiteAdapters.find(a => a.name === 'JustWatch');
            const t = adapter.theme;
            let bar = document.getElementById('servarr-batch-bar');
            if (!bar) {
                bar = document.createElement('div'); bar.id = 'servarr-batch-bar';
                bar.style.background = t.bg; bar.style.color = t.text; bar.style.border = `1px solid ${t.inputBorder}`;
                bar.innerHTML = `<div class="servarr-batch-count">0 Items Selected</div><div style="display:flex; gap:10px"><button id="sb-clear" style="background:transparent; border:1px solid ${t.text}; color:${t.text}; padding:8px 16px; border-radius:20px; cursor:pointer;">Clear</button><button id="sb-add" style="background:${t.primaryBtn}; border:none; color:white; padding:8px 24px; border-radius:20px; font-weight:bold; cursor:pointer;">CONFIGURE & ADD</button></div>`;
                document.body.appendChild(bar);
                document.getElementById('sb-clear').onclick = () => { BatchManager.selected.clear(); BatchManager.updateUI(); };
                document.getElementById('sb-add').onclick = () => BatchManager.showBatchModal();
            }
            const count = BatchManager.selected.size;
            if (count > 0) {
                const movies = Array.from(BatchManager.selected).filter(i => i.type === 'movie').length;
                const shows = Array.from(BatchManager.selected).filter(i => i.type === 'tv').length;
                let text = []; if (movies) text.push(`${movies} Movie${movies > 1 ? 's' : ''}`); if (shows) text.push(`${shows} Show${shows > 1 ? 's' : ''}`);
                bar.querySelector('.servarr-batch-count').textContent = text.join(', ') + ' Selected';
                bar.classList.add('visible');
            } else { bar.classList.remove('visible'); }
        },

        showBatchModal: async () => {
            const btn = document.getElementById('sb-add');
            if(btn) { btn.textContent = 'ENRICHING METADATA...'; btn.disabled = true; }

            // --- BATCH ENRICHMENT STEP ---
            const items = Array.from(BatchManager.selected);
            for (let i = 0; i < items.length; i++) {
                await Api.enrichData(items[i]);
            }
            if(btn) { btn.textContent = 'CONFIGURE & ADD'; btn.disabled = false; }
            // -----------------------------

            const movies = Array.from(BatchManager.selected).filter(i => i.type === 'movie');
            const shows = Array.from(BatchManager.selected).filter(i => i.type === 'tv');
            const hasMovies = movies.length > 0;
            const hasShows = shows.length > 0;
            let rOpts, sOpts;
            try {
                if (hasMovies) rOpts = await Api.getOptions('radarr');
                if (hasShows) sOpts = await Api.getOptions('sonarr');
            } catch (e) { Utils.toast(`Connection Failed: ${e.message}`, 'error'); return; }
            const adapter = SiteAdapters.find(a => location.hostname.includes(a.domain)) || SiteAdapters.find(a => a.name === 'JustWatch');
            const t = adapter.theme;
            const overlay = document.createElement('div'); overlay.className = 'servarr-overlay'; overlay.style.background = t.overlay; document.body.appendChild(overlay);
            const modal = document.createElement('div'); modal.className = `servarr-modal`;
            if (hasMovies && hasShows) modal.classList.add('wide');
            modal.style.cssText = `background: ${t.bg}; color: ${t.text}; border-radius: ${t.radius}; padding: 30px; border: ${t.inputBorder}`;

            const defProfile = Config.get().lastProfileId;
            const defRoot = Config.get().lastRootPath;
            const defSearch = Config.get().lastSearchNow;

            let html = `<div class="servarr-header" style="border-color:${t.accentColor}"><div style="color:${t.accentColor}; font-weight:800; font-size:20px;">BATCH ADD (${BatchManager.selected.size} ITEMS)</div></div>`;

            // --- BATCH REVIEW LIST WITH INPUTS ---
            html += `<div id="bm-review-list">`;
            BatchManager.selected.forEach(item => {
                const safeTitle = Utils.escapeHTML(item.engTitle || item.title);
                const safeYear = Utils.escapeHTML(item.year === 'Unknown' ? '' : item.year);
                const dataId = `${item.type}:${item.title}:${item.year}`; // Original ID for deletion

                html += `
                <div class="bm-review-item" data-type="${item.type}" data-original-id="${dataId}">
                    <input type="text" class="bm-edit-title" value="${safeTitle}">
                    <input type="text" class="bm-edit-year" value="${safeYear}" placeholder="Year">
                    <button class="bm-remove-btn">✕</button>
                </div>`;
            });
            html += `</div>`;

            html += `<div class="${hasMovies && hasShows ? 'servarr-split-layout' : ''}">`;
            const inputStyle = `background-color: ${t.inputBg}; color: ${t.text}; border: ${t.inputBorder}; padding: 8px; border-radius: ${t.radius}`;
            if (hasMovies) {
                html += `<div class="servarr-col"><div class="servarr-section-title" style="border-color:${t.accentColor}">MOVIES (${movies.length})</div><div class="servarr-field-group"><label class="servarr-label">Root Folder</label><select id="bm-r-root" class="servarr-input" style="${inputStyle}">${rOpts.folders.map(f => `<option value="${f.path}" ${f.path === defRoot ? 'selected' : ''}>${f.path} (${Utils.formatBytes(f.freeSpace)})</option>`).join('')}</select></div><div class="servarr-field-group"><label class="servarr-label">Profile</label><select id="bm-r-profile" class="servarr-input" style="${inputStyle}">${rOpts.profiles.map(p => `<option value="${p.id}" ${p.id == defProfile ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div><div class="servarr-field-group"><label class="servarr-label">Monitor</label><select id="bm-r-monitor" class="servarr-input" style="${inputStyle}"><option value="true">Yes</option><option value="false">No</option></select></div></div>`;
            }
            if (hasShows) {
                html += `<div class="servarr-col"><div class="servarr-section-title" style="border-color:${t.accentColor}">TV SHOWS (${shows.length})</div><div class="servarr-field-group"><label class="servarr-label">Root Folder</label><select id="bm-s-root" class="servarr-input" style="${inputStyle}">${sOpts.folders.map(f => `<option value="${f.path}" ${f.path === defRoot ? 'selected' : ''}>${f.path} (${Utils.formatBytes(f.freeSpace)})</option>`).join('')}</select></div><div class="servarr-field-group"><label class="servarr-label">Profile</label><select id="bm-s-profile" class="servarr-input" style="${inputStyle}">${sOpts.profiles.map(p => `<option value="${p.id}" ${p.id == defProfile ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div><div class="servarr-field-group"><label class="servarr-label">Monitor</label><select id="bm-s-monitor" class="servarr-input" style="${inputStyle}"><option value="all">All Episodes</option><option value="future">Future</option><option value="missing">Missing</option><option value="firstSeason">First Season</option><option value="latestSeason">Latest Season</option></select></div><div class="servarr-field-group"><label class="servarr-label">Type</label><select id="bm-s-type" class="servarr-input" style="${inputStyle}"><option value="standard">Standard</option><option value="anime">Anime</option></select></div></div>`;
            }
            html += `<div class="servarr-field-group" style="display:flex; align-items:center; gap:10px; margin-top:15px;"><input type="checkbox" id="bm-search-now" class="servarr-inline-checkbox" ${defSearch ? 'checked' : ''}><label class="servarr-label" style="margin:0; cursor:pointer;" for="bm-search-now">Start Search on Add</label></div>`;
            html += `</div><div class="servarr-actions"><button id="bm-cancel" class="servarr-btn" style="flex:1; background:${t.secondaryBtn}; color:${t.text}; border-radius:${t.radius}">CANCEL</button><button id="bm-submit" class="servarr-btn" style="flex:2; background:${t.primaryBtn}; color:white; border-radius:${t.radius}">ADD ALL</button></div>`;
            modal.innerHTML = html; document.body.appendChild(modal);
            requestAnimationFrame(() => { overlay.classList.add('visible'); modal.classList.add('visible'); });

            const close = () => { overlay.classList.remove('visible'); modal.classList.remove('visible'); setTimeout(() => { overlay.remove(); modal.remove(); }, 200); };
            overlay.onclick = close; document.getElementById('bm-cancel').onclick = close;

            document.querySelectorAll('.bm-remove-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const row = e.target.closest('.bm-review-item');
                    const id = row.dataset.originalId;
                    const itemToRemove = Array.from(BatchManager.selected).find(i => `${i.type}:${i.title}:${i.year}` === id);
                    if (itemToRemove) {
                        BatchManager.selected.delete(itemToRemove);
                        const checkbox = document.querySelector(`.servarr-checkbox[data-id="${id}"]`);
                        if (checkbox) checkbox.classList.remove('selected');
                        row.remove();
                        const count = document.querySelectorAll('.bm-review-item').length;
                        const header = modal.querySelector('.servarr-header div');
                        if(header) header.textContent = `BATCH ADD (${count} ITEMS)`;
                    }
                };
            });

            document.getElementById('bm-submit').onclick = async function() {
                this.textContent = 'PROCESSING...'; this.disabled = true; this.style.opacity = '0.5';
                try {
                    const c = Config.get();
                    const searchNow = document.getElementById('bm-search-now').checked;
                    const rows = document.querySelectorAll('.bm-review-item');
                    const batchMovies = [];
                    const batchShows = [];

                    rows.forEach(row => {
                        const type = row.dataset.type;
                        const title = row.querySelector('.bm-edit-title').value;
                        let year = row.querySelector('.bm-edit-year').value;
                        if (!year) year = 'Unknown';
                        const item = { title, year, type, imdbId: null, engTitle: null };
                        if (type === 'movie') batchMovies.push(item);
                        else batchShows.push(item);
                    });

                    if (batchMovies.length > 0) {
                        const rParams = { rootFolderPath: document.getElementById('bm-r-root').value, qualityProfileId: parseInt(document.getElementById('bm-r-profile').value), monitored: document.getElementById('bm-r-monitor').value === 'true', tags: [], searchNow: searchNow };
                        Config.saveDefaults(rParams.qualityProfileId, rParams.rootFolderPath, searchNow);
                        for (const m of batchMovies) await performAdd(m, 'radarr', c.radarrUrl, c.radarrKey, rParams);
                    }
                    if (batchShows.length > 0) {
                        const sParams = { rootFolderPath: document.getElementById('bm-s-root').value, qualityProfileId: parseInt(document.getElementById('bm-s-profile').value), monitored: true, monitor: document.getElementById('bm-s-monitor').value, seriesType: document.getElementById('bm-s-type').value, tags: [], searchNow: searchNow };
                        Config.saveDefaults(sParams.qualityProfileId, sParams.rootFolderPath, searchNow);
                        for (const s of batchShows) await performAdd(s, 'sonarr', c.sonarrUrl, c.sonarrKey, sParams);
                    }
                    Utils.toast(`Batch Complete!`, 'success');
                    BatchManager.selected.clear(); BatchManager.updateUI();
                    JustWatchGrid.inject();
                    if (location.hostname.includes('rottentomatoes.com')) RottenTomatoesGrid.inject();
                    if (location.hostname.includes('myanimelist.net')) MyAnimeListGrid.inject();
                    if (location.hostname.includes('letterboxd.com')) LetterboxdGrid.inject();
                    close();
                } catch (e) { console.error(e); Utils.toast(`Batch Error: ${e.message}`, 'error'); this.textContent = 'RETRY'; this.disabled = false; this.style.opacity = '1'; }
            };
        }
    };
    // ==========================================
    // MODULE: GRID OBSERVERS
    // ==========================================

    const JustWatchGrid = {
        init: () => {
            const observer = new MutationObserver(() => { JustWatchGrid.inject(); });
            observer.observe(document.body, { childList: true, subtree: true });
            JustWatchGrid.inject();
        },
        inject: () => {
            const links = document.querySelectorAll('a[href*="/movie/"]:not(.servarr-injected), a[href*="/tv-show/"]:not(.servarr-injected)');
            links.forEach(link => {
                const img = link.querySelector('img');
                if (!img) return;
                if (link.closest('header') || link.closest('.jw-nav')) return;

                link.classList.add('servarr-injected'); link.style.position = 'relative';
                const isMovie = link.href.includes('/movie/'); const destination = isMovie ? 'radarr' : 'sonarr';
                let title = img.alt || 'Unknown';
                let year = 'Unknown';

                const yearMatch = title.match(/\((\d{4})\)/);
                if (yearMatch) { year = yearMatch[1]; title = title.replace(/\s*\(\d{4}\).*/, '').trim(); }

                title = Utils.cleanTitle(title);
                const data = { title, year, type: isMovie ? 'movie' : 'tv', engTitle: '', imdbId: null, detailUrl: link.href };

                const icon = document.createElement('div'); icon.className = 'servarr-grid-icon';
                const logo = document.createElement('img');
                logo.src = isMovie ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';
                icon.appendChild(logo);
                icon.onclick = (e) => { e.preventDefault(); e.stopPropagation(); quickAdd(data, destination, SiteAdapters.find(a => a.name === 'JustWatch').theme); };

                const check = document.createElement('div'); check.className = 'servarr-checkbox'; check.dataset.id = `${data.type}:${data.title}:${data.year}`;
                check.onclick = (e) => { e.preventDefault(); e.stopPropagation(); check.classList.toggle('selected'); BatchManager.toggle(data); };

                Api.checkLibrary(destination, data).then(match => {
                    if (match && match.id > 0) { icon.classList.add('owned'); icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.7"; check.style.display = 'none'; }
                });
                link.appendChild(icon); link.appendChild(check);
            });
        }
    };

    const RottenTomatoesGrid = {
        init: () => {
            const observer = new MutationObserver(() => { RottenTomatoesGrid.inject(); });
            observer.observe(document.body, { childList: true, subtree: true });
            RottenTomatoesGrid.inject();
        },
        inject: () => {
            const buttons = document.querySelectorAll('watchlist-button:not(.servarr-processed)');
            buttons.forEach(btn => {
                btn.classList.add('servarr-processed');
                let title = btn.getAttribute('media-title');
                const rawType = btn.getAttribute('media-type');
                if (!title || !rawType) return;
                const isMovie = rawType.toLowerCase() === 'movie';
                const destination = isMovie ? 'radarr' : 'sonarr';
                let container = btn.parentElement;
                let link = null;
                let depth = 0;
                while(container && depth < 5) {
                    link = container.querySelector('a');
                    if (link && (link.getAttribute('href') || '').match(/\/(m|tv)\//)) break;
                    container = container.parentElement;
                    depth++;
                }
                if (!link) return;
                let year = 'Unknown';
                const containerText = container.textContent;
                const dateMatch = containerText.match(/(?:19|20)\d{2}/);
                if (dateMatch) year = dateMatch[0];
                const titleYearMatch = title.match(/\((\d{4})\)/);
                if (titleYearMatch) { year = titleYearMatch[1]; title = title.replace(/\s*\(\d{4}\).*/, '').trim(); }
                const data = { title: Utils.cleanTitle(title), year, type: isMovie ? 'movie' : 'tv', engTitle: '', imdbId: null, detailUrl: link.href };
                const card = btn.parentElement;
                if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
                const icon = document.createElement('div'); icon.className = 'servarr-grid-icon';
                const logo = document.createElement('img');
                logo.src = isMovie ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';
                icon.appendChild(logo);
                icon.style.top = '5px'; icon.style.right = '5px';
                icon.onclick = (e) => { e.preventDefault(); e.stopPropagation(); quickAdd(data, destination, SiteAdapters.find(a => a.name === 'RottenTomatoes').theme); };
                const check = document.createElement('div'); check.className = 'servarr-checkbox';
                check.dataset.id = `${data.type}:${data.title}:${data.year}`;
                check.style.top = '5px'; check.style.left = '5px';
                check.onclick = (e) => { e.preventDefault(); e.stopPropagation(); check.classList.toggle('selected'); BatchManager.toggle(data); };
                Api.checkLibrary(destination, data).then(match => {
                    if (match && match.id > 0) { icon.classList.add('owned'); icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.7"; check.style.display = 'none'; }
                });
                card.appendChild(icon);
                card.appendChild(check);
            });

            const editorialImages = document.querySelectorAll('img.article_poster:not(.servarr-processed)');
            editorialImages.forEach(img => {
                img.classList.add('servarr-processed');
                const row = img.closest('.row.countdown-item');
                if (!row) return;
                const titleLink = row.querySelector('.article_movie_title a');
                if (!titleLink) return;
                let rawTitle = titleLink.textContent.trim();
                let year = 'Unknown';
                const yearMatch = rawTitle.match(/\((\d{4})\)/);
                if (yearMatch) {
                    year = yearMatch[1];
                    rawTitle = rawTitle.replace(/\s*\(\d{4}\).*/, '').trim();
                }
                let title = rawTitle.replace(/^\d+\.\s*/, '');
                const href = titleLink.getAttribute('href');
                let type = 'movie';
                if (href && href.includes('/tv/')) type = 'tv';
                const isMovie = type === 'movie';
                const destination = isMovie ? 'radarr' : 'sonarr';
                const data = { title: Utils.cleanTitle(title), year, type, engTitle: '', imdbId: null, detailUrl: titleLink.href };
                const wrapper = img.parentElement;
                if (getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';
                const icon = document.createElement('div'); icon.className = 'servarr-grid-icon';
                const logo = document.createElement('img');
                logo.src = isMovie ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';
                icon.appendChild(logo);
                icon.style.top = '5px'; icon.style.right = '5px';
                icon.onclick = (e) => { e.preventDefault(); e.stopPropagation(); quickAdd(data, destination, SiteAdapters.find(a => a.name === 'RottenTomatoes').theme); };
                const check = document.createElement('div'); check.className = 'servarr-checkbox';
                check.dataset.id = `${data.type}:${data.title}:${data.year}`;
                check.style.top = '5px'; check.style.left = '5px';
                check.onclick = (e) => { e.preventDefault(); e.stopPropagation(); check.classList.toggle('selected'); BatchManager.toggle(data); };
                Api.checkLibrary(destination, data).then(match => {
                    if (match && match.id > 0) { icon.classList.add('owned'); icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.7"; check.style.display = 'none'; }
                });
                wrapper.appendChild(icon);
                wrapper.appendChild(check);
            });
        }
    };

    const MyAnimeListGrid = {
        init: () => {
            const observer = new MutationObserver(() => { MyAnimeListGrid.inject(); });
            observer.observe(document.body, { childList: true, subtree: true });
            MyAnimeListGrid.inject();
        },
        inject: () => {
            const rows = document.querySelectorAll('tr.ranking-list:not(.servarr-processed)');
            rows.forEach(row => {
                row.classList.add('servarr-processed');
                const titleNode = row.querySelector('h3.anime_ranking_h3 a');
                const infoNode = row.querySelector('.information');
                const imageLink = row.querySelector('td.title > a.hoverinfo_trigger');
                if (!titleNode || !infoNode || !imageLink) return;
                const title = titleNode.textContent.trim();
                const infoText = infoNode.textContent;
                const detailUrl = titleNode.href;
                let type = 'tv';
                if (infoText.includes('Movie')) type = 'movie';
                else if (infoText.includes('OVA') || infoText.includes('Special')) type = 'tv';
                let year = 'Unknown';
                const yearMatch = infoText.match(/\d{4}/);
                if (yearMatch) year = yearMatch[0];
                const isMovie = type === 'movie';
                const destination = isMovie ? 'radarr' : 'sonarr';
                const data = { title: Utils.cleanTitle(title), year, type, engTitle: '', imdbId: null, detailUrl: detailUrl };
                if (getComputedStyle(imageLink).position === 'static') imageLink.style.position = 'relative';
                const icon = document.createElement('div'); icon.className = 'servarr-grid-icon';
                const logo = document.createElement('img');
                logo.src = isMovie ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';
                icon.appendChild(logo);
                icon.onclick = (e) => { e.preventDefault(); e.stopPropagation(); quickAdd(data, destination, SiteAdapters.find(a => a.name === 'MyAnimeList').theme); };
                const check = document.createElement('div'); check.className = 'servarr-checkbox';
                check.dataset.id = `${data.type}:${data.title}:${data.year}`;
                check.onclick = (e) => { e.preventDefault(); e.stopPropagation(); check.classList.toggle('selected'); BatchManager.toggle(data); };
                Api.checkLibrary(destination, data).then(match => {
                    if (match && match.id > 0) { icon.classList.add('owned'); icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.7"; check.style.display = 'none'; }
                });
                imageLink.appendChild(icon);
                imageLink.appendChild(check);
            });
        }
    };

    const LetterboxdGrid = {
        init: () => {
            const observer = new MutationObserver(() => { LetterboxdGrid.inject(); });
            observer.observe(document.body, { childList: true, subtree: true });
            LetterboxdGrid.inject();
        },
        inject: () => {
            // Target div.film-poster directly (covers lists, diaries, search, etc.)
            const posters = document.querySelectorAll('div.film-poster:not(.servarr-processed)');
            posters.forEach(div => {
                div.classList.add('servarr-processed');
                const img = div.querySelector('img');
                if (!img) return;

                const rawAlt = img.alt || '';
                let title = rawAlt;
                let year = 'Unknown';

                const yearMatch = rawAlt.match(/.+\s\((\d{4})\)$/);
                if (yearMatch) {
                    year = yearMatch[1];
                    title = rawAlt.replace(/\s\(\d{4}\)$/, '');
                }

                title = title.replace(/^Poster for\s+/i, '').trim();

                if (!title && div.dataset.filmSlug) {
                    title = div.dataset.filmSlug.replace(/-/g, ' ');
                }

                if (!title) return;

                let detailUrl = null;
                const link = div.querySelector('a.frame');
                if (link) detailUrl = link.href;
                else if (div.dataset.targetLink) detailUrl = 'https://letterboxd.com' + div.dataset.targetLink;

                let type = 'movie';
                const destination = 'radarr';

                const data = { title: Utils.cleanTitle(title), year, type, engTitle: '', imdbId: null, detailUrl: detailUrl };

                if (getComputedStyle(div).position === 'static') div.style.position = 'relative';

                const icon = document.createElement('div'); icon.className = 'servarr-grid-icon';
                const logo = document.createElement('img');
                logo.src = 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png';
                icon.appendChild(logo);
                icon.onclick = (e) => { e.preventDefault(); e.stopPropagation(); quickAdd(data, destination, SiteAdapters.find(a => a.name === 'Letterboxd').theme); };

                const check = document.createElement('div'); check.className = 'servarr-checkbox';
                check.dataset.id = `${data.type}:${data.title}:${data.year}`;
                check.onclick = (e) => { e.preventDefault(); e.stopPropagation(); check.classList.toggle('selected'); BatchManager.toggle(data); };

                // Fix z-index overlap on Letterboxd
                icon.style.zIndex = '100';
                check.style.zIndex = '100';

                Api.checkLibrary(destination, data).then(match => {
                    if (match && match.id > 0) { icon.classList.add('owned'); icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.7"; check.style.display = 'none'; }
                });

                div.appendChild(icon);
                div.appendChild(check);
            });
        }
    };

    // --- MAIN SEARCH & ADD LOGIC ---
    async function performDirectAdd(data, destination, url, key, options) {
        const endpoint = destination === 'radarr' ? 'movie' : 'series';
        const payload = {
            title: data.title,
            qualityProfileId: options.qualityProfileId,
            rootFolderPath: options.rootFolderPath,
            images: [],
            titleSlug: data.titleSlug,
            monitored: options.monitored,
            tags: options.tags || []
        };
        const searchNow = options.searchNow !== false;
        if (destination === 'radarr') {
            payload.tmdbId = data.tmdbId;
            payload.year = data.year;
            payload.addOptions = { searchForMovie: searchNow };
        } else {
            payload.tvdbId = data.tvdbId;
            payload.seriesType = options.seriesType;
            payload.seasonFolder = true;
            payload.addOptions = { searchForMissingEpisodes: searchNow, monitor: options.monitor };
        }
        await Api.fetch(`${url}/api/v3/${endpoint}`, key, { method: 'POST', body: JSON.stringify(payload) });
    }

    async function quickAdd(data, destination, theme) {
        Utils.toast(`Quick Adding...`);
        try {
            const c = Config.get(); const key = destination === 'radarr' ? c.radarrKey : c.sonarrKey; const url = destination === 'radarr' ? c.radarrUrl : c.sonarrUrl;
            await Api.enrichData(data);
            await performAdd(data, destination, url, key, {
                rootFolderPath: (await Api.getOptions(destination)).folders[0].path,
                qualityProfileId: (await Api.getOptions(destination)).profiles[0].id,
                monitored: true,
                seriesType: 'standard',
                monitor: 'all',
                tags: [],
                searchNow: Config.get().lastSearchNow
            });
            Utils.toast(`${data.title} Added!`, 'success');
        } catch (e) { console.error(e); Utils.toast(e.message, 'error'); }
    }

    async function performAdd(data, destination, url, key, options) {
        if (!data.engTitle && data.detailUrl && data.detailUrl.includes('myanimelist.net')) {
            try {
                const doc = await Api.fetchPage(data.detailUrl);
                const sidebarDivs = doc.querySelectorAll('.spaceit_pad');
                for (const div of sidebarDivs) {
                    if (div.innerText.includes('English:')) { data.engTitle = div.innerText.split('English:')[1].trim(); break; }
                }
                if (data.engTitle) data.engTitle = Utils.cleanTitle(data.engTitle);
            } catch(e) {}
        }

        const finalTitle = data.engTitle || data.title;
        const terms = [
            data.tmdbId ? `tmdb:${data.tmdbId}` : null,
            data.imdbId ? `imdb:${data.imdbId}` : null,
            finalTitle,
            destination === 'sonarr' ? Utils.cleanTitle(data.title) : null,
            data.title
        ].filter(Boolean);

        let match;
        const endpoint = destination === 'radarr' ? 'movie' : 'series';
        for (const term of terms) {
            const lookup = await Api.fetch(`${url}/api/v3/${endpoint}/lookup?term=${encodeURIComponent(term)}`, key);
            match = Api.findStrictMatch(lookup, data);
            if (match) break;
        }
        if (!match) throw new Error(`No match: "${finalTitle}"`);
        await performDirectAdd(match, destination, url, key, options);
    }

    function createIcon(type, isRadarr, theme, onClick, onShiftClick) {
        if (document.getElementById('servarr-floating-icon')) return;

        const icon = document.createElement('div'); icon.id = 'servarr-floating-icon';
        const img = document.createElement('img'); const check = document.createElement('div');

        const pos = Config.get().iconPos;
        icon.style.cssText = `position: fixed; top: ${pos.top}; left: ${pos.left}; width: 48px; height: 48px; border-radius: 50%; cursor: grab; z-index: 2147483647; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: white; transition: transform 0.2s; user-select: none;`;
        img.src = isRadarr ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';
        img.draggable = false;

        img.style.cssText = `width: 100%; height: 100%; border-radius: 50%; display: block; pointer-events: none;`;
        check.innerHTML = '✔';
        check.style.cssText = `position: absolute; bottom: -2px; right: -2px; width: 20px; height: 20px; background: #27ae60; color: white; border-radius: 50%; font-size: 12px; font-weight: bold; display: none; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);`;
        icon.appendChild(img); icon.appendChild(check);
        icon.setOwned = (isOwned) => {
            icon._isOwned = isOwned;
            if (isOwned) { icon.style.filter = "grayscale(100%)"; icon.style.opacity = "0.6"; check.style.display = "flex"; }
            else { icon.style.filter = "none"; icon.style.opacity = "1"; check.style.display = "none"; }
        };

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        icon.onmousedown = (e) => {
            e.preventDefault();
            isDragging = false; startX = e.clientX; startY = e.clientY; initialLeft = icon.offsetLeft; initialTop = icon.offsetTop;
            document.onmousemove = (e) => { isDragging = true; icon.style.cursor = 'grabbing'; icon.style.left = `${initialLeft + e.clientX - startX}px`; icon.style.top = `${initialTop + e.clientY - startY}px`; };
            document.onmouseup = () => {
                document.onmousemove = null; document.onmouseup = null; icon.style.cursor = 'grab';
                if (isDragging) { Config.savePos(icon.style.top, icon.style.left); setTimeout(() => { isDragging = false; }, 50); }
            };
        };
        icon.onclick = (e) => {
            if (!isDragging) { if(e.shiftKey && onShiftClick && !icon._isOwned) onShiftClick(); else onClick(icon._isOwned); }
        };
        document.body.appendChild(icon);
        return icon;
    }

    async function showAddPopup(data, destination, theme) {
        if (document.getElementById('servarr-modal')) return;
        let options; try { options = await Api.getOptions(destination); } catch (e) { Utils.toast(`Connection Failed: ${e.message}`, 'error'); return; }
        const overlay = document.createElement('div'); overlay.className = 'servarr-overlay'; overlay.style.background = theme.overlay; document.body.appendChild(overlay);
        const modal = document.createElement('div'); modal.id = 'servarr-modal'; modal.className = `servarr-modal servarr-theme-${theme.id}`;
        modal.style.cssText = `background: ${theme.bg}; color: ${theme.text}; border-radius: ${theme.radius}; box-shadow: ${theme.shadow}; font-family: ${theme.font};`;
        const logoUrl = destination === 'radarr' ? 'https://raw.githubusercontent.com/Radarr/Radarr/develop/Logo/128.png' : 'https://raw.githubusercontent.com/Sonarr/Sonarr/develop/Logo/128.png';

        // SINGLE ADD DEEP SCRAPE
        await Api.enrichData(data);
        let displayTitle = data.engTitle || data.title;
        displayTitle = Utils.cleanTitle(displayTitle);

        const defProfile = Config.get().lastProfileId;
        const defRoot = Config.get().lastRootPath;
        const defSearch = Config.get().lastSearchNow;

        modal.innerHTML = `
            <div style="padding: 25px;">
                <div class="servarr-header" style="border-color: ${theme.accentColor};">
                    <div style="color: ${theme.accentColor}; font-weight: 800; font-size: 20px;">ADD TO ${destination.toUpperCase()}</div>
                    <img src="${logoUrl}" style="width: 24px; height: 24px;">
                </div>
                <div class="servarr-field-group">
                    <label class="servarr-label">Search Title (Edit if incorrect)</label>
                    <input id="s-custom-title" class="servarr-input" type="text" value="${Utils.escapeHTML(displayTitle)}" style="font-weight:bold; font-size:14px; padding:10px;">
                </div>
                <div class="servarr-meta" style="margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                    <label class="servarr-label" style="margin:0;">Year:</label>
                    <input id="s-custom-year" class="servarr-badge-input" type="text" value="${data.year}" style="background: ${theme.badgeBg}; color: ${theme.text};">
                </div>
                <div class="servarr-field-group"><label class="servarr-label">Path</label><select id="s-root" class="servarr-input" style="border: ${theme.inputBorder}; border-radius: ${theme.inputRadius}; background-color: ${theme.inputBg}; color: ${theme.text};">${options.folders.map(f => `<option value="${f.path}" ${f.path === defRoot ? 'selected' : ''}>${f.path} (${Utils.formatBytes(f.freeSpace)})</option>`).join('')}</select></div>
                <div class="servarr-field-group"><label class="servarr-label">Profile</label><select id="s-profile" class="servarr-input" style="border: ${theme.inputBorder}; border-radius: ${theme.inputRadius}; background-color: ${theme.inputBg}; color: ${theme.text};">${options.profiles.map(p => `<option value="${p.id}" ${p.id == defProfile ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div>
                <div class="servarr-field-group"><label class="servarr-label">Tags</label><input id="s-tags" type="text" class="servarr-input" placeholder="e.g. anime, 4k" style="border: ${theme.inputBorder}; border-radius: ${theme.inputRadius}; background-color: ${theme.inputBg}; color: ${theme.text}; padding: 10px;"></div>
                <div class="servarr-field-group"><label class="servarr-label">Monitor</label><select id="s-monitor" class="servarr-input" style="border: ${theme.inputBorder}; border-radius: ${theme.inputRadius}; background-color: ${theme.inputBg}; color: ${theme.text};">${destination === 'radarr' ? `<option value="true">Yes</option><option value="false">No</option>` : `<option value="all">All Episodes</option><option value="future">Future Episodes</option><option value="missing">Missing Episodes</option><option value="firstSeason">First Season</option><option value="latestSeason">Latest Season</option><option value="none">None</option>`}</select></div>
                ${destination === 'sonarr' ? `<div class="servarr-field-group"><label class="servarr-label">Series Type</label><select id="s-type" class="servarr-input" style="border: ${theme.inputBorder}; border-radius: ${theme.inputRadius}; background-color: ${theme.inputBg}; color: ${theme.text};"><option value="standard">Standard</option><option value="anime">Anime</option></select></div>` : ''}

                <div class="servarr-field-group" style="display:flex; align-items:center; gap:10px; margin-top:15px;">
                    <input type="checkbox" id="s-search-now" class="servarr-inline-checkbox" ${defSearch ? 'checked' : ''}>
                    <label class="servarr-label" style="margin:0; cursor:pointer;" for="s-search-now">Start Search on Add</label>
                </div>

                <div class="servarr-actions">
                    <button id="s-cancel" class="servarr-btn" style="flex: 1; background: ${theme.secondaryBtn}; color: ${theme.text}; padding: 12px; border-radius: ${theme.radius};">CANCEL</button>
                    <button id="s-search" class="servarr-btn" style="flex: 2; background: ${theme.primaryBtn}; color: ${theme.id === 'imdb' ? 'black' : 'white'}; padding: 12px; border-radius: ${theme.radius};">SEARCH & SELECT</button>
                </div>
                <div id="servarr-results-container"></div>
            </div>`;

        document.body.appendChild(modal);
        requestAnimationFrame(() => { overlay.classList.add('visible'); modal.classList.add('visible'); });
        document.getElementById('s-custom-title').select();
        const close = () => { overlay.classList.remove('visible'); modal.classList.remove('visible'); setTimeout(() => { overlay.remove(); modal.remove(); }, 200); };
        overlay.onclick = close; document.getElementById('s-cancel').onclick = close;

        const executeSearch = async () => {
            const container = document.getElementById('servarr-results-container');
            const btn = document.getElementById('s-search');
            let query = document.getElementById('s-custom-title').value;
            const yearInput = document.getElementById('s-custom-year').value;
            if (destination === 'radarr' && yearInput && yearInput !== 'Unknown') { query += ` ${yearInput}`; }

            btn.textContent = 'SEARCHING...'; btn.disabled = true; container.innerHTML = '';

            try {
                const c = Config.get(); const key = destination === 'radarr' ? c.radarrKey : c.sonarrKey; const url = destination === 'radarr' ? c.radarrUrl : c.sonarrUrl;
                const results = await Api.fetch(`${url}/api/v3/${destination === 'radarr' ? 'movie' : 'series'}/lookup?term=${encodeURIComponent(query)}`, key);
                btn.textContent = 'SEARCH & SELECT'; btn.disabled = false;

                if (!results || results.length === 0) { container.innerHTML = '<div style="padding:10px; opacity:0.7;">No results found.</div>'; return; }

                results.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'servarr-result-item';
                    el.innerHTML = `<div class="servarr-result-title">${item.title}</div><div class="servarr-result-meta">${item.year}</div><div class="servarr-result-overview">${item.overview || 'No description available.'}</div>`;
                    el.onclick = async () => {
                        el.style.opacity = '0.5'; el.style.pointerEvents = 'none';
                        try {
                            const searchNow = document.getElementById('s-search-now').checked;
                            const addParams = {
                                rootFolderPath: document.getElementById('s-root').value,
                                qualityProfileId: parseInt(document.getElementById('s-profile').value),
                                monitored: true,
                                seriesType: destination === 'sonarr' ? document.getElementById('s-type').value : null,
                                monitor: destination === 'sonarr' ? document.getElementById('s-monitor').value : null,
                                tags: [],
                                searchNow: searchNow
                            };
                            Config.saveDefaults(addParams.qualityProfileId, addParams.rootFolderPath, searchNow);
                            await performDirectAdd(item, destination, url, key, addParams);
                            Utils.toast(`${item.title} Added!`, 'success');
                            close();
                            const icon = document.getElementById('servarr-floating-icon');
                            if(icon && icon.setOwned) icon.setOwned(true);
                        } catch(e) { Utils.toast(`Error: ${e.message}`, 'error'); el.style.opacity = '1'; el.style.pointerEvents = 'all'; }
                    };
                    container.appendChild(el);
                });
            } catch (e) { console.error(e); Utils.toast(`Search Error: ${e.message}`, 'error'); btn.textContent = 'RETRY'; btn.disabled = false; }
        };

        document.getElementById('s-search').onclick = executeSearch;
        document.getElementById('s-custom-title').onkeydown = (e) => { if(e.key === 'Enter') executeSearch(); };
        document.getElementById('s-custom-title').oninput = () => { data.detailUrl = null; };
        document.getElementById('s-custom-year').onkeydown = (e) => { if(e.key === 'Enter') executeSearch(); };
        setTimeout(executeSearch, 100);
    }

    function showConfig() {
        if (document.getElementById('servarr-config-modal')) return;
        const overlay = document.createElement('div'); overlay.className = 'servarr-overlay visible';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'servarr-config-modal';
        modal.className = 'servarr-modal visible';
        modal.style.cssText = `background: #1f1f1f; color: white; border-radius: 8px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); font-family: sans-serif; z-index: 2147483650; width: 400px;`;

        const c = Config.get();

        modal.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">Servarr Settings</div>
            <div class="servarr-field-group">
                <label class="servarr-label" style="color: #ccc;">Radarr URL</label>
                <input id="cfg-r-url" class="servarr-input" type="text" value="${c.radarrUrl}" placeholder="http://localhost:7878" style="background: #333; color: white; border: 1px solid #444; padding: 8px; border-radius: 4px;">
            </div>
            <div class="servarr-field-group">
                <label class="servarr-label" style="color: #ccc;">Radarr API Key</label>
                <input id="cfg-r-key" class="servarr-input" type="text" value="${c.radarrKey}" style="background: #333; color: white; border: 1px solid #444; padding: 8px; border-radius: 4px;">
            </div>
            <div class="servarr-field-group">
                <label class="servarr-label" style="color: #ccc;">Sonarr URL</label>
                <input id="cfg-s-url" class="servarr-input" type="text" value="${c.sonarrUrl}" placeholder="http://localhost:8989" style="background: #333; color: white; border: 1px solid #444; padding: 8px; border-radius: 4px;">
            </div>
            <div class="servarr-field-group">
                <label class="servarr-label" style="color: #ccc;">Sonarr API Key</label>
                <input id="cfg-s-key" class="servarr-input" type="text" value="${c.sonarrKey}" style="background: #333; color: white; border: 1px solid #444; padding: 8px; border-radius: 4px;">
            </div>
            <button id="cfg-save" class="servarr-btn" style="background: #27ae60; color: white; padding: 10px; border-radius: 4px; margin-top: 10px;">SAVE CONFIGURATION</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('cfg-save').onclick = () => {
            const rUrl = document.getElementById('cfg-r-url').value.trim();
            const rKey = document.getElementById('cfg-r-key').value.trim();
            const sUrl = document.getElementById('cfg-s-url').value.trim();
            const sKey = document.getElementById('cfg-s-key').value.trim();
            Config.save(rUrl, sUrl, rKey, sKey);
            overlay.remove();
            modal.remove();
            Utils.toast('Settings Saved! Reloading...', 'success');
            setTimeout(() => location.reload(), 1000);
        };
    }

    const App = {
        init: async () => {
            if (!Config.isValid()) { showConfig(); return; }
            const observer = new MutationObserver(() => { App.handlePageLoad(); });
            observer.observe(document.body, { childList: true, subtree: true });
            if (location.hostname.includes('rottentomatoes.com')) { document.body.classList.add('servarr-site-rt'); }
            if (location.hostname.includes('myanimelist.net')) { document.body.classList.add('servarr-site-mal'); }
            if (location.hostname.includes('letterboxd.com')) { document.body.classList.add('servarr-site-lboxd'); }
            App.handlePageLoad();
        },
        lastUrl: '',
        handlePageLoad: async () => {
            if (location.href !== App.lastUrl) {
                App.lastUrl = location.href;
                const existing = document.querySelectorAll('#servarr-floating-icon');
                existing.forEach(el => el.remove());
            }
            if (location.hostname.includes('justwatch.com')) { JustWatchGrid.inject(); }
            if (location.hostname.includes('rottentomatoes.com')) { RottenTomatoesGrid.inject(); }
            if (location.hostname.includes('myanimelist.net')) { MyAnimeListGrid.inject(); }
            if (location.hostname.includes('letterboxd.com')) { LetterboxdGrid.inject(); }

            if (document.getElementById('servarr-floating-icon')) return;
            const adapter = SiteAdapters.find(a => a.detect());
            if (!adapter) return;
            setTimeout(async () => {
                 let data; try { data = await adapter.scrape(); } catch (e) { return; }
                 const showRadarr = data.type === 'movie' || data.type === 'unknown';
                 const showSonarr = data.type === 'tv' || data.type === 'unknown';

                 await Api.enrichData(data);

                 if (document.getElementById('servarr-floating-icon')) return;

                 const createAndLink = async (destination) => {
                     const match = await Api.checkLibrary(destination, data);
                     const btn = createIcon('icon', showRadarr, adapter.theme,
                         (owned) => {
                             if(owned && match && match.titleSlug) {
                                 const c = Config.get();
                                 const url = destination === 'radarr' ? c.radarrUrl : c.sonarrUrl;
                                 window.open(`${url}/${destination === 'radarr' ? 'movie' : 'series'}/${match.titleSlug}`, '_blank');
                             } else {
                                 showAddPopup(data, destination, adapter.theme);
                             }
                         },
                         () => quickAdd(data, destination, adapter.theme)
                     );
                     if (match && match.id > 0) btn.setOwned(true);
                 };

                 if (showRadarr) createAndLink('radarr');
                 else if (showSonarr) createAndLink('sonarr');
            }, 1000);
        }
    };

    App.init();

})();