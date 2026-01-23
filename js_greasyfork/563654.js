// ==UserScript==
// @name         Estimate rehab cost of people abroad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculates health % and Rehab Cost on the 'People' page abroad.
// @author       Adobi
// @match        https://www.torn.com/index.php?page=people*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563654/Estimate%20rehab%20cost%20of%20people%20abroad.user.js
// @updateURL https://update.greasyfork.org/scripts/563654/Estimate%20rehab%20cost%20of%20people%20abroad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // PASTE YOUR API KEY HERE. DO NOT SHARE THIS SCRIPT WITH YOUR KEY IN IT.
    const API_KEY = 'YOUR_API_KEY_HERE';

    const CACHE_HOURS = 24;
    const SEARCH_PRECISION_HOURS = 24;
    const DELAY_BETWEEN_CALLS = 1000;

    const userQueue = [];
    let isProcessingUser = false;

    // --- OBSERVER ---
    const observer = new MutationObserver((mutations) => {
        // The list of people abroad usually has the class 'users-list'
        const usersList = document.querySelector('ul.users-list');

        if (usersList) {
            const rows = usersList.querySelectorAll('li');
            rows.forEach(row => {
                // Prevent duplicate processing
                if (row.querySelector('.rehab-stat')) return;

                // Make sure row is relative so we can absolute position the stats
                row.style.position = 'relative';

                // Find the user ID from the profile link
                const anchor = row.querySelector('a[href*="profiles.php?XID="]');
                if (!anchor) return;
                const userId = anchor.href.match(/XID=(\d+)/)[1];

                // Create the display container
                const display = document.createElement('div');
                display.className = 'rehab-stat';
                // Styling specifically for the "Abroad" user list layout
                display.style.position = 'absolute';
                display.style.right = '10px';
                display.style.top = '50%';
                display.style.transform = 'translateY(-50%)';
                display.style.fontSize = '11px';
                display.style.textAlign = 'right';
                display.style.lineHeight = '12px';
                display.style.color = 'inherit';
                display.style.backgroundColor = 'var(--default-bg-panel-color, #fff)'; // Adapt to dark/light mode
                display.style.padding = '2px 5px';
                display.style.zIndex = '5';
                display.style.whiteSpace = 'nowrap';

                row.appendChild(display);

                const cachedData = getCache(userId);

                if (cachedData) {
                    // CACHED: Load immediately
                    renderResult(display, cachedData.health, cachedData.cost, false);
                } else {
                    // FRESH: Add to queue
                    display.style.backgroundColor = 'rgba(243, 156, 18, 0.15)';
                    display.style.border = '1px dashed #f39c12';
                    display.style.borderRadius = '3px';

                    display.innerText = 'Queueing...';
                    userQueue.push({ row: row, display: display, userId: userId });
                }
            });
            processGlobalQueue();
        }
    });

    // Observe body for changes (Torn pages load dynamically)
    observer.observe(document.body, { childList: true, subtree: true });

    function processGlobalQueue() {
        if (isProcessingUser || userQueue.length === 0) return;
        isProcessingUser = true;
        const currentUser = userQueue.shift();
        startUserLogic(currentUser, () => {
            isProcessingUser = false;
            processGlobalQueue();
        });
    }

    // --- LOGIC FLOW ---

    function startUserLogic(userObj, onComplete) {
        const display = userObj.display;
        const userId = userObj.userId;
        display.innerText = "1. Current...";

        apiCall(`user/${userId}?selections=personalstats,profile&stat=rehabs,xantaken`, null, (data) => {
            if (!data || !data.personalstats || !data.life) {
                display.innerText = "API Err";
                onComplete();
                return;
            }

            const curRehabs = data.personalstats.rehabs || 0;
            const curXanax = data.personalstats.xantaken || 0;
            const healthPct = Math.floor((data.life.current / data.life.maximum) * 100);

            if (curRehabs === 0) {
                const cost = calculateRehabCost(curXanax, curXanax, 0);
                renderResult(display, healthPct, cost, true);
                saveCache(userId, healthPct, cost);
                onComplete();
                return;
            }

            const nowTs = Math.floor(Date.now() / 1000);
            findDateRange(userId, curRehabs, curXanax, healthPct, 14, nowTs, display, onComplete);
        });
    }

    function findDateRange(userId, targetRehabs, targetXanax, healthPct, daysBack, upperBoundTs, display, onComplete) {
        if (daysBack > 1500) {
            display.innerText = "> 4 Yrs";
            onComplete();
            return;
        }
        display.innerText = `Scan -${daysBack}d`;
        const timestamp = Math.floor(Date.now() / 1000) - (daysBack * 86400);

        apiCall(`user/${userId}?selections=personalstats&stat=rehabs,xantaken`, timestamp, (data) => {
            const pastRehabs = data.personalstats ? (data.personalstats.rehabs || 0) : 0;
            if (pastRehabs < targetRehabs) {
                binarySearch(userId, timestamp, upperBoundTs, targetRehabs, targetXanax, healthPct, display, onComplete);
            } else {
                findDateRange(userId, targetRehabs, targetXanax, healthPct, daysBack * 2, timestamp, display, onComplete);
            }
        });
    }

    function binarySearch(userId, startTs, endTs, targetRehabs, targetXanax, healthPct, display, onComplete) {
        const rangeHours = (endTs - startTs) / 3600;
        const midTs = Math.floor((startTs + endTs) / 2);

        if (rangeHours < SEARCH_PRECISION_HOURS) {
            display.innerText = "Finalizing...";
            apiCall(`user/${userId}?selections=personalstats&stat=rehabs,xantaken`, endTs, (data) => {
                const oldXanax = data.personalstats ? (data.personalstats.xantaken || 0) : 0;
                let diff = targetXanax - oldXanax;
                if (diff < 0) diff = 0;
                const daysSince = (Math.floor(Date.now() / 1000) - endTs) / 86400;
                const cost = calculateRehabCost(targetXanax, diff, daysSince);

                renderResult(display, healthPct, cost, true);
                saveCache(userId, healthPct, cost);
                onComplete();
            });
            return;
        }

        display.innerText = `Narrow ${Math.round(rangeHours)}h`;
        apiCall(`user/${userId}?selections=personalstats&stat=rehabs,xantaken`, midTs, (data) => {
            const midRehabs = data.personalstats ? (data.personalstats.rehabs || 0) : 0;
            if (midRehabs < targetRehabs) {
                binarySearch(userId, midTs, endTs, targetRehabs, targetXanax, healthPct, display, onComplete);
            } else {
                binarySearch(userId, startTs, midTs, targetRehabs, targetXanax, healthPct, display, onComplete);
            }
        });
    }

    function calculateRehabCost(lifetimeXanax, xanSince, daysSince) {
        const rawCost = (2857 + 10.28 * lifetimeXanax) * (xanSince * 18 - daysSince * 21);
        return Math.max(0, rawCost) / 1000000;
    }

    // --- UI HELPER ---
    function renderResult(element, health, cost, wasJustFetched) {
        // Reset styles for final display
        element.style.backgroundColor = 'transparent';
        element.style.border = 'none';

        // Apply faded look only if loaded from cache
        if (!wasJustFetched) {
            element.style.opacity = '0.6';
        }

        let color = '#377d22'; // Green
        if (cost > 10) color = '#f39c12'; // Orange
        if (cost > 50) color = '#e74c3c'; // Red

        element.innerHTML = `
            <div>Health: ${health}%</div>
            <div style="color:${color}; font-weight:bold;">Cost: $${cost.toFixed(2)}M</div>
        `;
    }

    function getCache(userId) {
        const key = `xan_calc_${userId}`;
        const raw = localStorage.getItem(key);
        if(!raw) return null;
        const obj = JSON.parse(raw);
        if (Date.now() - obj.timestamp > (CACHE_HOURS * 3600 * 1000)) return null;
        return obj;
    }

    function saveCache(userId, health, cost) {
        localStorage.setItem(`xan_calc_${userId}`, JSON.stringify({
            timestamp: Date.now(),
            health: health,
            cost: cost
        }));
    }

    function apiCall(endpoint, timestamp, callback) {
        let url = `https://api.torn.com/${endpoint}&key=${API_KEY}`;
        if (timestamp) url += `&timestamp=${timestamp}&comment=XanCalc`;
        setTimeout(() => {
            fetch(url).then(res => res.json()).then(data => callback(data)).catch(() => callback({}));
        }, DELAY_BETWEEN_CALLS);
    }
})();