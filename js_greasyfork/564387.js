// ==UserScript==
// @name         Ovu.moe Calendar Popup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays the ovu.moe monthly calendar when hovering over a VTuber's channel name on YouTube or Twitch.
// @author       SkAnon
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://www.twitch.tv/*
// @connect      ovu.moe
// @icon         https://ovu.moe/favicon/favicon-96x96.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle\
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564387/Ovumoe%20Calendar%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/564387/Ovumoe%20Calendar%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const DEBUG = false; // Set to false to disable console logs
    const HOVER_DELAY = 600; // ms to wait before showing popup
    const BASE_URL = 'https://ovu.moe';

    // --- DEBUG HELPER ---
    function debugLog(msg, ...args) {
        if (DEBUG) {
            console.log(`%c[OVU-DBG] ${msg}`, 'color: #00aaff; font-weight: bold;', ...args);
        }
    }

    // --- CSS INJECTION ---
    const STYLES = `
        #ovu-popup {
            position: absolute;
            z-index: 99999;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            padding: 10px;
            border-radius: 8px;
            width: 350px;
            font-family: sans-serif;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            display: none;
            color: black;
        }
        #ovu-popup.visible {
            opacity: 1;
            display: block;
        }
        #ovu-popup .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        #ovu-popup .error {
            text-align: center;
            padding: 10px;
            color: #d9534f;
            font-weight: bold;
        }
        #ovu-popup .monthly {
            --table-hover-color: #ddd;
            --table-stripe-color: #f2f2f2;
            --table-header-color: black;
            --table-header-text: white;
            --inactive-month: #bbb;
            width: 100%;
        }
        #ovu-popup table.calendar {
            table-layout: fixed;
            width: 100%;
            border-collapse: collapse;
        }
        #ovu-popup table.calendar td {
            width: calc(100% / 7);
            border: 1px solid #eee;
            padding: 2px;
            vertical-align: top;
            height: 40px;
            box-sizing: border-box;
        }
        #ovu-popup table.calendar th {
            background-color: var(--table-header-color);
            color: var(--table-header-text);
            padding: 4px;
            font-size: 0.85em;
        }
        #ovu-popup .day {
            width: 100%;
            height: 1.5em;
            border: 1px blue solid;
            display: flex;
            flex-direction: row;
            margin-top: 2px;
        }
        #ovu-popup .day div {
            background-color: var(--c);
            height: 100%;
            flex: var(--l);
        }
        #ovu-popup td.lastmonth,
        #ovu-popup td.nextmonth {
            background-color: var(--inactive-month);
            opacity: 0.5;
        }
        #ovu-popup .day-number {
            font-size: 0.8em;
            font-weight: bold;
        }
        #ovu-popup td.today-highlight {
            border: 2px solid #007bff !important;
            background-color: rgba(0, 123, 255, 0.1);
        }
    `;

    GM_addStyle(STYLES);

    // --- STATE MANAGEMENT ---
    let popupEl = null;
    let hoverTimer = null;
    let currentRequestAbort = null; // Store abort function if needed
    let cache = {}; // { name: { date: 'YYYY-MM-DD', html: string, found: bool } }

    // --- INITIALIZATION ---
    function init() {
        debugLog('Script initializing...');
        
        // Create Popup Container
        popupEl = document.createElement('div');
        popupEl.id = 'ovu-popup';
        document.body.appendChild(popupEl);
        debugLog('Popup container injected into DOM.');

        // Observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            // throttle logic could go here, but for now we just re-attach
            attachListeners();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        debugLog('MutationObserver started.');
        
        attachListeners();
    }

    // --- DOM HANDLING ---
    function attachListeners() {
        // Selectors for YouTube and Twitch
        const selectors = [
            // YouTube
            '#channel-name #text a', 
            'ytd-channel-name a',
            '#owner-name a',
            'a.channel-link.yt-simple-endpoint.style-scope', // Generic YT strings often used for names
            // Twitch
            'h1.tw-title',
            '[data-a-target="user-channel-header-item"]',
            '.channel-info-content a',
            'a[data-test-selector="channel-card-title-link"]',
            'p[data-a-target="channel-header-name"]' // Twitch sidebar/header variations
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        let newCount = 0;

        elements.forEach(el => {
            if (el.dataset.ovuAttached) return;
            
            // Filter out empty links or video titles that might get caught
            if (!el.innerText && !el.textContent) return;

            el.dataset.ovuAttached = "true";
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
            newCount++;
        });

        if (newCount > 0) {
            debugLog(`Attached listeners to ${newCount} new elements.`);
        }
    }

    function handleMouseEnter(e) {
        const target = e.target;
        
        // Extract text content (Channel Name) the "href" contains the channel name
        let url = new URL(target.href);
        let parts = url.pathname.split('/');
        let rawText = parts.pop() || parts.pop() || '';
        // let rawText = target.innerText || target.textContent;

        let channelName = rawText.trim().replace(/\/@/g, '').replace(/\//g, '').replace(/[\n\r]/g, '').replace(/\s+/g, '').replace(/%40/g, '').replace(/\@/g, '');

        // hashmap of things to remove from channel name
        const badNames = new Map([
            ['ASMRCh', ''],
            [/Ch$/g, ''],
        ]);

        // remove bad names
        for (const [key, value] of badNames) {
            channelName = channelName.replace(key, value);
        }


        if (!channelName) {
            debugLog('Hovered element has no text content, ignoring.');
            return;
        }

        debugLog(`Mouse Enter: "${channelName}"`);

        updatePopupPosition(e.clientX, e.clientY);

        // Debounce
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            debugLog(`Hover timer triggered for: "${channelName}"`);
            showPopup(channelName);
        }, HOVER_DELAY);
    }

    function handleMouseLeave() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            debugLog('Mouse Leave: Timer cancelled.');
        } else {
            debugLog('Mouse Leave: Popup hiding.');
        }
        hidePopup();
    }

    function updatePopupPosition(x, y) {
        const offset = 15;
        let left = x + offset;
        let top = y + offset;

        // Viewport checks
        if (left + 360 > window.innerWidth) {
            left = x - 365;
        }
        if (top + 400 > window.innerHeight) {
            top = y - 410;
        }

        popupEl.style.left = `${left + window.scrollX}px`;
        popupEl.style.top = `${top + window.scrollY}px`;
    }

    // --- LOGIC ---

    async function showPopup(channelName) {
        popupEl.classList.add('visible');
        // remove spaces from channel name
        popupEl.innerHTML = `<div class="loading">Searching ovu.moe for<br><strong>${escapeHtml(channelName)}</strong>...</div>`;

        const todayDate = new Date().toISOString().split('T')[0];
        debugLog(`Processing: ${channelName} | Date: ${todayDate}`);

        // 1. Check Cache
        if (cache[channelName]) {
            const cached = cache[channelName];
            debugLog(`Cache hit for ${channelName}. Cached Date: ${cached.date}`);

            if (cached.date === todayDate) {
                debugLog('Cache is fresh. Rendering from cache.');
                renderResult(cached.found, cached.html);
                return;
            } else {
                debugLog('Cache is stale. Refetching.');
            }
        } else {
            debugLog('No cache found. Fetching fresh.');
        }

        // 2. Fetch Fresh Data
        try {
            // Cancel previous logic if specific abort controller existed (not implemented in GM_xmlhttprequest easily, but we simulate structure)

            // Step A: Search ID

            const searchUrl = `${BASE_URL}/api/idol/search/${encodeURIComponent(channelName)}`;
            debugLog(`API Request: ${searchUrl}`);
            
            const searchRes = await gmFetch(searchUrl);
            debugLog(`API Response Status: ${searchRes.status}`);

            if (searchRes.status !== 200) {
                 throw new Error(`API returned ${searchRes.status} / Ovu.moe may be down`);
            }

            const searchData = JSON.parse(searchRes.responseText);
            debugLog('API Data:', searchData);

            if (!searchData || searchData.length === 0) {
                debugLog('API returned no results.');
                cacheResult(channelName, false, null);
                renderResult(false);
                return;
            }

            // Find best match
            const match = searchData.find(i => i.display_name.toLowerCase() === channelName.toLowerCase()) || searchData[0];
            debugLog(`Selected match: ${match.display_name} (Label: ${match.label})`);
            
            const label = match.label;

            // Step B: Fetch HTML Profile
            const profileUrl = `${BASE_URL}/v/${label}`;
            debugLog(`Profile Request: ${profileUrl}`);
            
            const profileRes = await gmFetch(profileUrl);
            debugLog(`Profile Response Status: ${profileRes.status}`);

            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(profileRes.responseText, "text/html");
            const monthlyDiv = doc.querySelector('.monthly');

            if (monthlyDiv) {
                debugLog('Found .monthly div in profile HTML.');
                const htmlContent = monthlyDiv.outerHTML;
                cacheResult(channelName, true, htmlContent);
                renderResult(true, htmlContent);
            } else {
                debugLog('Profile loaded, but .monthly div not found.');
                cacheResult(channelName, false, null);
                renderResult(false);
            }

        } catch (err) {
            console.error('[OVU-ERR]', err);
            popupEl.innerHTML = `<div class="error">Error fetching data:<br>${err.message || err}</div>`;
        }
    }

    function renderResult(found, html) {
        if (!found) {
            popupEl.innerHTML = `<div class="error">No tracking data found for this channel.</div>`;
            return;
        }

        // Inject HTML
        popupEl.innerHTML = html;
        debugLog('HTML injected into popup.');

        highlightToday();
    }

    function highlightToday() {
        const today = new Date();
        const dayNum = today.getDate(); // 1-31
        debugLog(`Highlighting day: ${dayNum}`);

        const cells = popupEl.querySelectorAll('td.thismonth');
        let highlighted = false;

        cells.forEach(td => {
            // The structure is usually <div>Number</div>...
            const numDiv = td.querySelector('div:first-child');
            if (numDiv) {
                const textNum = parseInt(numDiv.textContent.trim());
                if (textNum === dayNum) {
                    td.classList.add('today-highlight');
                    highlighted = true;
                }
            }
        });
        
        if(highlighted) debugLog('Today highlighted successfully.');
        else debugLog('Could not find cell for today to highlight.');
    }

    function cacheResult(name, found, html) {
        const todayDate = new Date().toISOString().split('T')[0];
        cache[name] = {
            date: todayDate,
            found: found,
            html: html
        };
        debugLog(`Saved to cache: ${name}`);
    }

    function hidePopup() {
        popupEl.classList.remove('visible');
    }

    // --- UTILITIES ---

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
                    "Accept": "text/html,application/json"
                },
                onload: (response) => {
                    resolve(response);
                },
                onerror: (err) => {
                    debugLog('GM_xmlhttpRequest Error:', err);
                    reject("Network Error");
                },
                ontimeout: () => {
                     debugLog('GM_xmlhttpRequest Timeout');
                     reject("Timeout");
                }
            });
        });
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

    // Run
    init();

})();