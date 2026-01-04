// ==UserScript==
// @name         Torn Profile Company Star Rating + Working Stats
// @namespace    https://torn.com/
// @version      1.1.0
// @description  Adds company star rating and working stats to Torn profile pages
// @author       swervelord
// @match        https://www.torn.com/profiles.php?XID*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/559473/Torn%20Profile%20Company%20Star%20Rating%20%2B%20Working%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/559473/Torn%20Profile%20Company%20Star%20Rating%20%2B%20Working%20Stats.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const API_KEY_STORAGE = 'torn_public_api_key';

    let cachedCompanyRating = null;
    let cachedWorkingStats = null;

    /* ---------------- API KEY ---------------- */

    function getApiKey() {
        let key = GM_getValue(API_KEY_STORAGE, null);
        if (!key) {
            key = prompt('Enter your Torn API key (Public Access is sufficient):');
            if (!key || key.length < 10) return null;
            GM_setValue(API_KEY_STORAGE, key.trim());
        }
        return key;
    }

    /* ---------------- UTIL ---------------- */

    function getProfileUserId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('XID');
    }

    function numberWithCommas(num) {
        return num.toLocaleString();
    }

    /* ---------------- DOM HELPERS ---------------- */

    function findInfoTable() {
        return document.querySelector('.profile-left-wrapper .info-table');
    }

    function findRow(labelText) {
        return [...document.querySelectorAll('.info-table > li')]
            .find(li => li.querySelector('.bold')?.textContent.trim() === labelText);
    }

    function findCompanyLink() {
        const jobRow = findRow('Job');
        return jobRow?.querySelector('a[href*="corpinfo&ID="]') || null;
    }

    function extractCompanyId(link) {
        const match = link.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    }

    /* ---------------- INJECTION ---------------- */

    function injectCompanyRating(link, rating) {
        if (link.parentElement.querySelector('.company-star-rating')) return;

        const span = document.createElement('span');
        span.className = 'company-star-rating';
        span.textContent = ` ${rating}/10⭐`;
        span.style.marginLeft = '6px';
        span.style.whiteSpace = 'nowrap';

        link.after(span);
    }

    function injectWorkingStats(statsValue) {
        const table = findInfoTable();
        if (!table) return;

        if (table.querySelector('.working-stats-row')) return;

        const jobRow = findRow('Job');
        const lifeRow = findRow('Life');
        if (!jobRow || !lifeRow) return;

        const li = document.createElement('li');
        li.className = 'working-stats-row';

        li.innerHTML = `
            <div class="user-information-section">
                <span class="bold">Working Stats</span>
            </div>
            <div class="user-info-value">
                <span>${numberWithCommas(statsValue)}</span>
            </div>
        `;

        table.insertBefore(li, lifeRow);
    }

    /* ---------------- API ---------------- */

    function fetchCompanyRating(companyId, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/company/${companyId}?selections=profile&key=${apiKey}`,
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (typeof data?.company?.rating === 'number') {
                            resolve(data.company.rating);
                        } else reject();
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    function fetchWorkingStats(userId, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/user/${userId}/hof?key=${apiKey}`,
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (typeof data?.hof?.working_stats?.value === 'number') {
                            resolve(data.hof.working_stats.value);
                        } else reject();
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    /* ---------------- CORE ---------------- */

    async function ensureInjected() {
        const apiKey = getApiKey();
        if (!apiKey) return;

        const userId = getProfileUserId();
        if (!userId) return;

        // Company rating
        const companyLink = findCompanyLink();
        if (companyLink && cachedCompanyRating === null) {
            const companyId = extractCompanyId(companyLink);
            if (companyId) {
                cachedCompanyRating = await fetchCompanyRating(companyId, apiKey);
            }
        }
        if (companyLink && cachedCompanyRating !== null) {
            injectCompanyRating(companyLink, cachedCompanyRating);
        }

        // Working stats
        if (cachedWorkingStats === null) {
            cachedWorkingStats = await fetchWorkingStats(userId, apiKey);
        }
        if (cachedWorkingStats !== null) {
            injectWorkingStats(cachedWorkingStats);
        }
    }

    /* ---------------- OBSERVER ---------------- */

    function observe() {
        const target = document.querySelector('.profile-left-wrapper') || document.body;
        const observer = new MutationObserver(() => {
            ensureInjected().catch(() => {});
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    /* ---------------- INIT ---------------- */

    setTimeout(() => {
        ensureInjected().then(observe);
    }, 500);

})();
