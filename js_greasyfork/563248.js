// ==UserScript==
// @name         Torn – Networth in Search Results
// @namespace    https://torn.com/
// @version      1.5
// @description  Show player networth using Torn API, fixed-width badge, and sort UserList + HOF by networth
// @author       VonRayzer [3815470]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/page.php?sid=hof*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563248/Torn%20%E2%80%93%20Networth%20in%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/563248/Torn%20%E2%80%93%20Networth%20in%20Search%20Results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********************
     * CONFIG
     ********************/
    const API_KEY_STORAGE_KEY = 'tsn_api_key_prompt_v1';
    const CACHE_KEY = 'tsn_networth_cache_v1';
    const CACHE_TTL_MS = 10 * 60 * 1000;

    /********************
     * STATE
     ********************/
    const inflight = new Map();
    let persistentCache = GM_getValue(CACHE_KEY, {});
    let enhanceScheduled = false;

    /********************
     * HELPERS
     ********************/
    function formatNetworth(num) {
        if (typeof num !== 'number' || isNaN(num)) return '?';
        const abs = Math.abs(num);
        if (abs >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (abs >= 1e9)  return (num / 1e9).toFixed(2) + 'B';
        if (abs >= 1e6)  return (num / 1e6).toFixed(1) + 'M';
        if (abs >= 1e3)  return (num / 1e3).toFixed(0) + 'k';
        return String(num);
    }

    function parseNetworthText(text) {
        if (!text) return 0;
        const m = text.replace('NW:', '').trim().match(/^([\d.]+)\s*([kMBT])?$/i);
        if (!m) return 0;

        const n = parseFloat(m[1]);
        const u = (m[2] || '').toUpperCase();

        return u === 'K' ? n * 1e3 :
               u === 'M' ? n * 1e6 :
               u === 'B' ? n * 1e9 :
               u === 'T' ? n * 1e12 : n;
    }

    function extractXIDFromLink(a) {
        try {
            return new URL(a.href, location.origin).searchParams.get('XID');
        } catch {
            return null;
        }
    }

    /********************
     * API KEY
     ********************/
    function requestApiKey() {
        const key = prompt(
            'Torn Networth Script\n\nEnter your Torn API key (Public / Minimal access):'
        );
        if (!key) return null;
        GM_setValue(API_KEY_STORAGE_KEY, key.trim());
        return key.trim();
    }

    function getApiKey() {
        let key = GM_getValue(API_KEY_STORAGE_KEY, '');
        if (!key) key = requestApiKey();
        return key || null;
    }

    function invalidateApiKey() {
        GM_deleteValue(API_KEY_STORAGE_KEY);
        alert('Torn API key is invalid or expired.\nYou will be prompted again.');
    }

    /********************
     * API FETCH
     ********************/
    function fetchNetworth(xid, apiKey) {
        const now = Date.now();
        const cached = persistentCache[xid];

        if (cached && now - cached.time < CACHE_TTL_MS) {
            return Promise.resolve(cached.value);
        }

        if (inflight.has(xid)) return inflight.get(xid);

        const url = `https://api.torn.com/user/${xid}?selections=personalstats&key=${apiKey}`;

        const p = new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: res => {
                    let value = null;
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.error) {
                            if ([1, 2, 3, 10].includes(data.error.code)) {
                                invalidateApiKey();
                            }
                        } else {
                            value = data.personalstats?.networth ?? null;
                        }
                    } catch {}

                    persistentCache[xid] = { value, time: Date.now() };
                    GM_setValue(CACHE_KEY, persistentCache);
                    inflight.delete(xid);
                    resolve(value);
                },
                onerror: () => {
                    inflight.delete(xid);
                    resolve(null);
                }
            });
        });

        inflight.set(xid, p);
        return p;
    }

    /********************
     * UI BADGE
     ********************/
    function createBadge() {
        const span = document.createElement('span');
        span.className = 'tsn-networth-badge';
        span.textContent = 'NW: ...';

        Object.assign(span.style, {
            marginLeft: '6px',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '10px',
            background: '#333',
            color: '#ffd27f',
            border: '1px solid #555',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            minWidth: '70px',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums'
        });

        return span;
    }

    /********************
     * SORT – USER LIST
     ********************/
    function sortUserInfoList() {
        const ul = document.querySelector('ul.user-info-list-wrap');
        if (!ul) return;

        const items = Array.from(ul.children).filter(li => li.tagName === 'LI');

        items.sort((a, b) => {
            const aNW = parseNetworthText(
                a.querySelector('.tsn-networth-badge')?.textContent
            );
            const bNW = parseNetworthText(
                b.querySelector('.tsn-networth-badge')?.textContent
            );
            return bNW - aNW;
        });

        items.forEach(li => ul.appendChild(li));
    }

    /********************
     * SORT – HALL OF FAME
     ********************/
function sortHOFTable() {
    const tbody = document.querySelector('tbody.tableBody___zyVTt');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr.tableRow___nX6Th'));

    rows.sort((a, b) => {
        const aNW = parseNetworthText(
            a.querySelector('.tsn-networth-badge')?.textContent
        );
        const bNW = parseNetworthText(
            b.querySelector('.tsn-networth-badge')?.textContent
        );
        return bNW - aNW;
    });

    rows.forEach(row => tbody.appendChild(row));
}

    /********************
     * MAIN SCAN
     ********************/
    function enhanceProfileLinks() {
        const apiKey = getApiKey();
        if (!apiKey) return;

        document.querySelectorAll('a[href*="profiles.php?XID="]').forEach(link => {
            if (link.dataset.tsnProcessed) return;

            const xid = extractXIDFromLink(link);
            if (!xid) return;

            link.dataset.tsnProcessed = '1';
            const badge = createBadge();
            link.parentElement?.appendChild(badge);

            fetchNetworth(xid, apiKey).then(value => {
                badge.textContent = value == null
                    ? 'NW: ?'
                    : 'NW: ' + formatNetworth(value);

                setTimeout(() => {
                    sortUserInfoList();
                    sortHOFTable();
                }, 300);
            });
        });
    }

    /********************
     * OBSERVER
     ********************/
    function scheduleEnhance() {
        if (enhanceScheduled) return;
        enhanceScheduled = true;
        setTimeout(() => {
            enhanceScheduled = false;
            enhanceProfileLinks();
        }, 500);
    }

    new MutationObserver(scheduleEnhance).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        setTimeout(enhanceProfileLinks, 1000);
    });

})();
