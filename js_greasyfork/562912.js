// ==UserScript==
// @name         JAVLibrary Highlight My Movies v2.4
// @namespace    https://javlibrary.com/
// @version      2.4
// @description  Highlight movies from Wanted, Watched, and Owned lists with different colors
// @author       Kojiro Sama
// @match        *://www.javlibrary.com/*
// @match        *://javlibrary.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562912/JAVLibrary%20Highlight%20My%20Movies%20v24.user.js
// @updateURL https://update.greasyfork.org/scripts/562912/JAVLibrary%20Highlight%20My%20Movies%20v24.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const CONFIG = {
        colors: {
            wanted: {
                background: 'rgba(255, 193, 7, 0.5)',
                border: '#FFC107',
                label: '⭐'
            },
            watched: {
                background: 'rgba(76, 175, 80, 0.5)',
                border: '#4CAF50',
                label: '✓'
            },
            owned: {
                background: 'rgba(33, 150, 243, 0.5)',
                border: '#2196F3',
                label: '📁'
            }
        },
        cacheExpiry: 24 * 60 * 60 * 1000
    };

    // Mapping des types de listes aux vrais noms de pages JAVLibrary
    const LIST_MAP = {
        wanted: 'mv_wanted.php',
        watched: 'mv_watched.php',
        owned: 'mv_owned.php'
    };

    function getLang() {
        const match = window.location.pathname.match(/^\/(en|ja|tw|cn)\//);
        return match ? match[1] : 'en';
    }

    const LANG = getLang();
    const BASE_URL = window.location.origin;

    // ========== STYLES CSS ==========
    GM_addStyle(`
        .video.jav-wanted {
            background: ${CONFIG.colors.wanted.background} !important;
            outline: 3px solid ${CONFIG.colors.wanted.border} !important;
            outline-offset: -3px;
        }
        .video.jav-watched {
            background: ${CONFIG.colors.watched.background} !important;
            outline: 3px solid ${CONFIG.colors.watched.border} !important;
            outline-offset: -3px;
        }
        .video.jav-owned {
            background: ${CONFIG.colors.owned.background} !important;
            outline: 3px solid ${CONFIG.colors.owned.border} !important;
            outline-offset: -3px;
        }
        .jav-tag {
            position: absolute;
            top: 3px;
            left: 3px;
            font-size: 16px;
            text-shadow: 0 0 3px black, 0 0 3px black, 0 0 5px black;
            z-index: 100;
        }
        #jav-panel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 220px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        #jav-panel .title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            border-bottom: 1px solid #444;
            padding-bottom: 8px;
        }
        #jav-panel .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
            align-items: center;
        }
        #jav-panel .dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        #jav-panel button {
            width: 100%;
            margin-top: 12px;
            padding: 8px;
            background: #2196F3;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        #jav-panel button:hover {
            background: #1976D2;
        }
        #jav-panel .error { color: #ff6b6b; }
        #jav-panel .loading { color: #ffd93d; }
        #jav-panel .success { color: #69db7c; }
        #jav-panel .cache-info {
            font-size: 10px;
            color: #888;
            margin-top: 8px;
            border-top: 1px solid #444;
            padding-top: 8px;
        }
        #jav-loader-frame {
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 1px;
            height: 1px;
            visibility: hidden;
        }
    `);

    // ========== UI ==========
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'jav-panel';
        panel.innerHTML = `
            <div class="title">🎬 JAV Highlighter</div>
            <div id="jav-status">Initializing...</div>
            <div id="jav-stats"></div>
            <div id="jav-cache-info" class="cache-info"></div>
            <button id="jav-refresh">🔄 Refresh Cache</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('jav-refresh').addEventListener('click', async () => {
            clearCache();
            setStatus('Refreshing...', 'loading');
            await loadAndHighlight(true);
        });

        return panel;
    }

    function setStatus(msg, type = '') {
        const el = document.getElementById('jav-status');
        if (el) {
            el.className = type;
            el.textContent = msg;
        }
    }

    function setStats(wanted, watched, owned) {
        const el = document.getElementById('jav-stats');
        if (el) {
            el.innerHTML = `
                <div class="row"><span><span class="dot" style="background:${CONFIG.colors.wanted.border}"></span>Wanted</span><span>${wanted}</span></div>
                <div class="row"><span><span class="dot" style="background:${CONFIG.colors.watched.border}"></span>Watched</span><span>${watched}</span></div>
                <div class="row"><span><span class="dot" style="background:${CONFIG.colors.owned.border}"></span>Owned</span><span>${owned}</span></div>
            `;
        }
    }

    function setCacheInfo(wanted, watched, owned) {
        const el = document.getElementById('jav-cache-info');
        if (el) {
            el.innerHTML = `In lists: ${wanted} wanted, ${watched} watched, ${owned} owned`;
        }
    }

    // ========== CACHE ==========
    function getCached(key) {
        try {
            const data = GM_getValue(key, null);
            if (data) {
                const parsed = JSON.parse(data);
                if (Date.now() - parsed.time < CONFIG.cacheExpiry) {
                    return parsed.codes;
                }
            }
        } catch (e) {
            console.error('[JAV] Cache read error:', e);
        }
        return null;
    }

    function setCache(key, codes) {
        GM_setValue(key, JSON.stringify({ codes, time: Date.now() }));
    }

    function clearCache() {
        GM_setValue('jav_wanted', null);
        GM_setValue('jav_watched', null);
        GM_setValue('jav_owned', null);
        console.log('[JAV] Cache cleared');
    }

    // ========== IFRAME LOADER ==========
    function loadPageViaIframe(url) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.id = 'jav-loader-frame';
            iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;visibility:hidden;';

            const timeout = setTimeout(() => {
                iframe.remove();
                reject(new Error('Timeout loading page'));
            }, 15000);

            iframe.onload = function() {
                try {
                    clearTimeout(timeout);
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const html = doc.documentElement.outerHTML;
                    iframe.remove();
                    resolve(html);
                } catch (e) {
                    iframe.remove();
                    reject(new Error('Cannot access iframe content: ' + e.message));
                }
            };

            iframe.onerror = function() {
                clearTimeout(timeout);
                iframe.remove();
                reject(new Error('Failed to load iframe'));
            };

            iframe.src = url;
            document.body.appendChild(iframe);
        });
    }

function parseVideos(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const codes = new Set();

    // 1️⃣ Scan des liens texte (pages mv_*)
    doc.querySelectorAll('a').forEach(a => {
        const text = a.textContent.trim().toUpperCase();
        const match = text.match(/^([A-Z]{2,5}-\d{2,5})\b/);
        if (match) {
            codes.add(match[1]);
        }
    });

    // 2️⃣ Fallback (au cas où JAVLibrary change)
    doc.body.innerText
        .split('\n')
        .forEach(line => {
            const match = line.trim().toUpperCase().match(/^([A-Z]{2,5}-\d{2,5})\b/);
            if (match) {
                codes.add(match[1]);
            }
        });

    // 3️⃣ Détection pagination
    let maxPage = 1;
    doc.querySelectorAll('a').forEach(a => {
        const m = a.href?.match(/page=(\d+)/);
        if (m) maxPage = Math.max(maxPage, parseInt(m[1]));
    });

    console.log(`[JAV] Parsed ${codes.size} movies, ${maxPage} pages`);
    return { codes: [...codes], maxPage };
}

    async function fetchList(listType, forceRefresh = false) {
        const listFile = LIST_MAP[listType];
        const cacheKey = `jav_${listType}`;

        if (!forceRefresh) {
            const cached = getCached(cacheKey);
            if (cached) {
                console.log(`[JAV] ${listType}: ${cached.length} from cache`);
                return cached;
            }
        }

        const allCodes = [];
        const firstUrl = `${BASE_URL}/${LANG}/${listFile}`;
        console.log(`[JAV] Fetching: ${firstUrl}`);

        try {
            setStatus(`Loading ${listType}...`, 'loading');
            const firstHtml = await loadPageViaIframe(firstUrl);

            console.log(`[JAV] ${listType} HTML length: ${firstHtml.length}`);

            // Vérifie si on est sur la page de login
            if (firstHtml.includes('name="username"') && firstHtml.includes('name="password"')) {
                console.error(`[JAV] ${listType}: Login page detected!`);
                setStatus('Please login to JAVLibrary first!', 'error');
                return [];
            }

            const { codes, maxPage } = parseVideos(firstHtml);
            allCodes.push(...codes);
            console.log(`[JAV] ${listType}: page 1/${maxPage}, found ${codes.length}`);

            // Charge les pages suivantes si nécessaire
            for (let page = 2; page <= maxPage; page++) {
                setStatus(`Loading ${listType} (${page}/${maxPage})...`, 'loading');
                await sleep(800); // Délai entre les requêtes

                const url = `${BASE_URL}/${LANG}/${listFile}?page=${page}`;
                console.log(`[JAV] Fetching page ${page}: ${url}`);

                try {
                    const html = await loadPageViaIframe(url);
                    const { codes: pageCodes } = parseVideos(html);
                    allCodes.push(...pageCodes);
                    console.log(`[JAV] ${listType}: page ${page}/${maxPage}, found ${pageCodes.length}`);
                } catch (e) {
                    console.error(`[JAV] Error loading page ${page}:`, e);
                }
            }

            setCache(cacheKey, allCodes);
            console.log(`[JAV] ${listType}: total ${allCodes.length} cached`);
            return allCodes;

        } catch (error) {
            console.error(`[JAV] Error fetching ${listType}:`, error);
            return [];
        }
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // ========== HIGHLIGHT ==========
    function highlightVideos(wanted, watched, owned) {
        const counts = { wanted: 0, watched: 0, owned: 0 };

        document.querySelectorAll('.video').forEach(video => {
            video.classList.remove('jav-wanted', 'jav-watched', 'jav-owned');
            const oldTag = video.querySelector('.jav-tag');
            if (oldTag) oldTag.remove();

            const idEl = video.querySelector('.id');
            if (!idEl) return;

            const code = idEl.textContent.trim().toUpperCase();
            let type = null;

            if (owned.includes(code)) {
                type = 'owned';
            } else if (watched.includes(code)) {
                type = 'watched';
            } else if (wanted.includes(code)) {
                type = 'wanted';
            }

            if (type) {
                video.classList.add(`jav-${type}`);
                video.style.position = 'relative';

                const tag = document.createElement('span');
                tag.className = 'jav-tag';
                tag.textContent = CONFIG.colors[type].label;
                video.appendChild(tag);

                counts[type]++;
            }
        });

        return counts;
    }

    // ========== MAIN ==========
    async function loadAndHighlight(forceRefresh = false) {
        try {
            setStatus('Loading lists...', 'loading');

            const wanted = await fetchList('wanted', forceRefresh);
            await sleep(300);
            const watched = await fetchList('watched', forceRefresh);
            await sleep(300);
            const owned = await fetchList('owned', forceRefresh);

            setCacheInfo(wanted.length, watched.length, owned.length);

            const counts = highlightVideos(wanted, watched, owned);
            const total = counts.wanted + counts.watched + counts.owned;

            if (total > 0) {
                setStatus(`${total} matches on this page`, 'success');
            } else {
                setStatus('No matches on this page');
            }

            setStats(counts.wanted, counts.watched, counts.owned);
            console.log(`[JAV] Done! Matches: ${JSON.stringify(counts)}`);

            // Observer pour contenu dynamique
            const target = document.querySelector('.videothumblist, .videos') || document.body;
            const observer = new MutationObserver(() => {
                highlightVideos(wanted, watched, owned);
            });
            observer.observe(target, { childList: true, subtree: true });

        } catch (error) {
            console.error('[JAV] Error:', error);
            setStatus(`Error: ${error.message}`, 'error');
        }
    }

    // ========== INIT ==========
    function init() {
        console.log('[JAV] Highlighter v2.4 starting...');
        console.log('[JAV] Language:', LANG);
        console.log('[JAV] URL:', window.location.href);

        // Ne pas s'exécuter sur les pages de liste elles-mêmes pour éviter la récursion (sauf iframe)
        if (window.location.href.includes('mv_wanted.php') ||
            window.location.href.includes('mv_watched.php') ||
            window.location.href.includes('mv_owned.php')) {

            if (window.self !== window.top) {
                console.log('[JAV] On a list page in iframe, skipping');
                return;
            }
            console.log('[JAV] On a list page, running normally');
        }

        createPanel();
        setTimeout(() => loadAndHighlight(), 500);
    }

    // Menu commands
    GM_registerMenuCommand('🔄 Refresh Movie Lists', () => {
        clearCache();
        location.reload();
    });

    GM_registerMenuCommand('📊 Show Cache Stats', () => {
        const wanted = getCached('jav_wanted') || [];
        const watched = getCached('jav_watched') || [];
        const owned = getCached('jav_owned') || [];
        alert(`Cached movies:\n- Wanted: ${wanted.length}\n- Watched: ${watched.length}\n- Owned: ${owned.length}`);
    });

    GM_registerMenuCommand('🗑️ Clear Cache', () => {
        clearCache();
        alert('Cache cleared!');
    });

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();