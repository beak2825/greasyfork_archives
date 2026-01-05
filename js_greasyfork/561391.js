// ==UserScript==
// @name        AO3: Series' [Public] Bookmarks total
// @namespace   https://greasyfork.org/en/users/1555174-charles-rockafellor
// @version     3.6
// @description Adds a row to author's stats page to show Series' [Public] Bookmarks total
// @icon        https://www.clipartmax.com/png/full/47-478415_mathematics-symbol-math-sig-sum-mathematics-sigma-png.png
// @author      Charles Rockafellor
// @homepageURL  https://archiveofourown.org/users/Charles_Rockafellor/collections
// @match       *://archiveofourown.org/users/*/stats*
// @match       *://www.archiveofourown.org/users/*/stats*
// @grant       GM_xmlhttpRequest
// @license     MIT; https://opensource.org/license/mit
// @connect     archiveofourown.org
// @downloadURL https://update.greasyfork.org/scripts/561391/AO3%3A%20Series%27%20%5BPublic%5D%20Bookmarks%20total.user.js
// @updateURL https://update.greasyfork.org/scripts/561391/AO3%3A%20Series%27%20%5BPublic%5D%20Bookmarks%20total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const statsList = document.querySelector('dl.statistics');
        if (!statsList || document.querySelector('.series-total-row')) return;

        // 1. DYNAMIC USERNAME EXTRACTION
        // We grab the path directly from the URL bar: /users/USERNAME/stats
        const pathParts = window.location.pathname.split('/');
        const userIdx = pathParts.indexOf('users');
        if (userIdx === -1) return;
        const currentUsername = pathParts[userIdx + 1];

        // 2. SETUP STATS DISPLAY
        const target = statsList.querySelector('dd.bookmarks');
        if (!target) return;

        const dt = document.createElement('dt');
        dt.className = 'series-total-row';
        dt.innerHTML = '<b><i>Series\'</i> [Public]</b> Bookmarks:';
        const dd = document.createElement('dd');
        dd.className = 'series-total-row';
        dd.textContent = 'Locating series index...';

        target.after(dd);
        dd.before(dt);

        let total = 0;
        let page = 1;

        // 3. SECURE FETCH LOGIC
        function fetchSeries() {
            // Relative URL ensures the browser uses the same domain (org/net/gay) you are on
            const url = `https://${window.location.hostname}/users/${currentUsername}/series?page=${page}`;
            dd.textContent = `Reading p${page}...`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                anonymous: false, // Vital for logged-in sessions
                onload: function(res) {
                    if (res.status === 404) {
                        dd.textContent = `404 Error: Could not find series for ${currentUsername}`;
                        return;
                    }

                    // Flexible Regex: Targets digits inside the /bookmarks link
                    // Handles potential 2026 whitespace changes with \s*
                    const regex = /\/series\/\d+\/bookmarks[^>]*>\s*([\d,]+)\s*<\/a>/g;
                    let match;
                    let foundOnPage = 0;

                    while ((match = regex.exec(res.responseText)) !== null) {
                        // Extract digits from the captured group (match[1])
                        const count = parseInt(match[1].replace(/\D/g, ''), 10);
                        if (!isNaN(count)) {
                            total += count;
                            foundOnPage++;
                        }
                    }

                    // Check for Pagination
                    if (res.responseText.includes('rel="next"')) {
                        page++;
                        setTimeout(fetchSeries, 500); 
                    } else {
                        // Final display with standard AO3 comma formatting
                        dd.textContent = total.toLocaleString();
                    }
                },
                onerror: () => { dd.textContent = "Fetch failed (Network Error)"; }
            });
        }
        fetchSeries();
    }

    // Delay start to allow AO3's dynamic totals to populate
    setTimeout(init, 1000);
})();