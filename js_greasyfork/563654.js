// ==UserScript==
// @name         Switzerland mugger
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays health % and estimated rehab cost on people page.
// @author       Adobi
// @match        https://www.torn.com/index.php?page=people*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563654/Switzerland%20mugger.user.js
// @updateURL https://update.greasyfork.org/scripts/563654/Switzerland%20mugger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const API_KEY = 'api key';
    const SEARCH_PRECISION_HOURS = 24;
    const DELAY_BETWEEN_CALLS = 1000;

    const userQueue = [];
    let isProcessingUser = false;

    // --- OBSERVER ---
    const observer = new MutationObserver((mutations) => {
        const userList = document.querySelector('ul.users-list');

        if (userList) {
            const rows = userList.querySelectorAll('li');
            rows.forEach(row => {
                const anchor = row.querySelector('a[href*="profiles.php?XID="]');
                if (!anchor) return;

                // Check marker to ensure we don't process twice
                if (row.dataset.xanProcessed) return;

                // --- FIND THE CORRECT STATUS COLUMN ---
                // We look for the div with class 'status'.
                // IMPORTANT: We must ensure this isn't the action button container.
                let statusDiv = row.querySelector('.status');

                if (statusDiv) {
                    // Mark row as processed so we don't keep clearing it
                    row.dataset.xanProcessed = "true";

                    // 1. Clear original text (Okay, Hospital, etc.)
                    statusDiv.innerHTML = '';

                    // 2. Apply styling to the div itself to ensure alignment
                    // We DO NOT change display to flex, as that breaks the row layout.
                    statusDiv.style.textAlign = 'center';
                    statusDiv.style.verticalAlign = 'middle';
                    statusDiv.style.justifyContent = 'center';

                    // 3. Create a wrapper for our data
                    const display = document.createElement('span');
                    display.className = 'xan-rehab-data';
                    display.style.display = 'inline-block';
                    display.style.lineHeight = '1.2'; // Tight line height
                    display.style.fontSize = '11px';
                    display.style.fontWeight = 'normal';
                    display.style.color = '#333';
                    display.style.width = '100%';

                    statusDiv.appendChild(display);

                    const userId = anchor.href.match(/XID=(\d+)/)[1];
                    const cachedData = getCache(userId);

                    if (cachedData) {
                        // CACHED
                        renderResult(display, cachedData.health, cachedData.cost, false);
                        setupClickToRefresh(display, row, userId);
                    } else {
                        // FRESH
                        display.style.color = '#e67e22';
                        display.style.cursor = 'pointer';
                        display.innerText = 'Queueing';
                        display.title = "Click to prioritize";

                        const queueItem = { row: row, display: display, userId: userId };
                        userQueue.push(queueItem);

                        display.onclick = function() {
                            const index = userQueue.indexOf(queueItem);
                            if (index > -1) {
                                userQueue.splice(index, 1);
                                userQueue.unshift(queueItem);
                                display.innerText = '[Next]';
                                display.style.fontWeight = 'bold';
                            }
                        };
                    }
                }
            });
            processGlobalQueue();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- PROCESSING QUEUE ---
    function processGlobalQueue() {
        if (isProcessingUser || userQueue.length === 0) return;

        isProcessingUser = true;
        const currentUser = userQueue.shift();

        currentUser.display.style.cursor = 'default';
        currentUser.display.onclick = null;

        startUserLogic(currentUser, () => {
            isProcessingUser = false;
            processGlobalQueue();
        });
    }

    // --- LOGIC FLOW ---
    function startUserLogic(userObj, onComplete) {
        const display = userObj.display;
        const userId = userObj.userId;
        display.innerText = "...";

        apiCall(`user/${userId}?selections=personalstats,profile&stat=rehabs,xantaken`, null, (data) => {
            if (!data || !data.personalstats || !data.life) {
                display.innerText = "Err";
                onComplete();
                return;
            }

            const curRehabs = data.personalstats.rehabs || 0;
            const curXanax = data.personalstats.xantaken || 0;
            const healthPct = Math.floor((data.life.current / data.life.maximum) * 100);

            if (curRehabs < 1000) {
                renderResult(display, healthPct, "Newbie", true);
                saveCache(userId, healthPct, "Newbie");
                onComplete();
                return;
            }

            if (curRehabs === 0) {
                const cost = calculateRehabCost(curRehabs, curXanax, 0);
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
            display.innerText = ">4y";
            onComplete();
            return;
        }
        display.innerText = `-${daysBack}d`;
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
            display.innerText = "End";
            apiCall(`user/${userId}?selections=personalstats&stat=rehabs,xantaken`, endTs, (data) => {
                const oldXanax = data.personalstats ? (data.personalstats.xantaken || 0) : 0;
                let diff = targetXanax - oldXanax;
                if (diff < 0) diff = 0;
                const daysSince = (Math.floor(Date.now() / 1000) - endTs) / 86400;

                const cost = calculateRehabCost(targetRehabs, diff, daysSince);

                renderResult(display, healthPct, cost, true);
                saveCache(userId, healthPct, cost);
                onComplete();
            });
            return;
        }

        display.innerText = `~${Math.round(rangeHours)}h`;
        apiCall(`user/${userId}?selections=personalstats&stat=rehabs,xantaken`, midTs, (data) => {
            const midRehabs = data.personalstats ? (data.personalstats.rehabs || 0) : 0;
            if (midRehabs < targetRehabs) {
                binarySearch(userId, midTs, endTs, targetRehabs, targetXanax, healthPct, display, onComplete);
            } else {
                binarySearch(userId, startTs, midTs, targetRehabs, targetXanax, healthPct, display, onComplete);
            }
        });
    }

    function calculateRehabCost(totalRehabs, xanSince, daysSince) {
        const rawCost = (2857 + 10.28 * Math.min(20000, totalRehabs)) * (xanSince * 18 - daysSince * 21);
        return Math.max(0, rawCost) / 1000000;
    }

    // --- UI HELPER ---
    function renderResult(element, health, cost, wasJustFetched) {
        element.onclick = null;
        element.style.cursor = 'default';

        if (!wasJustFetched) {
            element.style.opacity = '0.6';
        } else {
            element.style.opacity = '1';
        }

        let costHtml = '';
        if (cost === "Newbie") {
            costHtml = `<span style="color:#999; font-weight:bold;">Newbie</span>`;
        } else {
            let color = '#377d22';
            if (cost > 10) color = '#f39c12';
            if (cost > 50) color = 'red';
            costHtml = `<span style="color:${color}; font-weight:bold;">$${cost.toFixed(2)}M</span>`;
        }

        // Simple break tag to stack them, keeping the flow natural
        element.innerHTML = `<span>HP: ${health}%</span><br>${costHtml}`;
    }

    function setupClickToRefresh(display, row, userId) {
        display.style.cursor = 'pointer';
        display.title = "Cached result. Click to force refresh.";
        display.onclick = function() {
            display.onclick = null;
            display.style.cursor = 'default';
            display.style.opacity = '1';
            display.innerText = 'Queue';
            display.style.fontWeight = 'bold';
            display.style.color = '#e67e22';

            const queueItem = { row: row, display: display, userId: userId };
            userQueue.unshift(queueItem);
            processGlobalQueue();
        };
    }

    // --- CACHE & API ---
    function getCache(userId) {
        const key = `xan_calc_${userId}`;
        const raw = localStorage.getItem(key);
        if(!raw) return null;

        const obj = JSON.parse(raw);
        const now = new Date();
        const lastMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

        if (obj.timestamp < lastMidnightUTC.getTime()) {
            return null;
        }
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