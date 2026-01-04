// ==UserScript==
// @name         monarch recruiter 3000
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  get ya titans here
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      api.torn.com
// @author       aquagloop
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556596/monarch%20recruiter%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/556596/monarch%20recruiter%203000.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'TORN_INTEGRATED_API_KEY_V1';
    const CACHE_PREFIX = 'TORN_CACHE_V1_';
    const CACHE_DURATION = 86400000;
    const WORK_STAT_CACHE_DURATION = 604800000;
    const XANAX_THRESHOLD = 60;
    const REFILLS_THRESHOLD = 25;
    const PLAYTIME_THRESHOLD_HOURS = 2;
    const API_DELAY = 1000; 

    GM_addStyle(`
        .tm-stats-row { height: 21px; background-color: #3b3b3b; border-bottom: 1px solid #222; line-height: 21px; width: 100%; clear: both; display: block; list-style: none; }
        .tm-integrated-stats-bar { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px; box-sizing: border-box; color: #d1d1d1; font-size: 11px; }
        .tm-integrated-stats-bar > span { flex: 1; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tm-stats-bar-message { width: 100%; text-align: center; font-style: italic; color: #999; }
        .tm-injected-stat { width: 100%; clear: both; }
        .tm-injected-stat .user-info-value span { font-weight: bold; }
        .tm-userlist-stat { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-weight: bold; color: #dddddd; font-size: 11px; z-index: 5; }
    `);

    const apiQueue = [];
    let isQueueProcessing = false;

    const processQueue = async () => {
        if (isQueueProcessing || apiQueue.length === 0) return;
        isQueueProcessing = true;

        while (apiQueue.length > 0) {
            const item = apiQueue[0];
            const { fn, resolve, reject, onStart } = item;

            try {
                // Constant 1 second delay
                await new Promise(r => setTimeout(r, API_DELAY));

                if (onStart) onStart();
                const result = await fn();

                resolve(result);
                apiQueue.shift();
            } catch (error) {
                const isRateLimit = error === 7 || (typeof error === 'string' && error.includes('Too many requests'));
                if (isRateLimit) {
                    if (onStart) onStart("Rate Limit! Pausing...");
                    await new Promise(r => setTimeout(r, 2500));
                } else {
                    reject(error);
                    apiQueue.shift();
                }
            }
        }
        isQueueProcessing = false;
    };

    const enqueueTask = (taskFn, onStart) => {
        return new Promise((resolve, reject) => {
            apiQueue.push({ fn: taskFn, resolve, reject, onStart });
            processQueue();
        });
    };

    const rawApiCall = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                headers: { Accept: 'application/json' },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) reject(data.error.code || data.error.error);
                        else resolve(data);
                    } catch (e) { reject('Parse Error'); }
                },
                ontimeout: () => reject('Timeout'),
                onerror: () => reject('Net Error')
            });
        });
    };

    const getWorkStats = async (userId, apiKey) => {
        const cacheKey = `${CACHE_PREFIX}WORK_${userId}`;
        const cached = GM_getValue(cacheKey);
        if (cached && (Date.now() - cached.timestamp < WORK_STAT_CACHE_DURATION)) return cached.value;

        const data = await rawApiCall(`https://api.torn.com/v2/user/${userId}/hof?key=${apiKey}`);
        const val = data.hof?.working_stats?.value || 0;
        GM_setValue(cacheKey, { timestamp: Date.now(), value: val });
        return val;
    };

    const getPersonalStats = async (userId, apiKey) => {
        const cacheKey = `${CACHE_PREFIX}PERS_${userId}`;
        const cached = GM_getValue(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) return cached.data;

        const extraStats = 'xantaken,refills,useractivity,energydrinkused,statenhancersused';
        const urlCurrent = `https://api.torn.com/user/${userId}?selections=personalstats,basic&key=${apiKey}`;
        const urlPast = `https://api.torn.com/user/${userId}?selections=personalstats&timestamp=-30days&stat=${extraStats}&key=${apiKey}`;

        const currentData = await rawApiCall(urlCurrent);
        const pastData = await rawApiCall(urlPast);

        const curr = currentData.personalstats || {};
        const past = pastData.personalstats || {};

        const stats = {
            xanax: (curr.xantaken || 0) - (past.xantaken || 0),
            refills: (curr.refills || 0) - (past.refills || 0),
            activity: (curr.useractivity || 0) - (past.useractivity || 0),
            cans: (curr.energydrinkused || 0) - (past.energydrinkused || 0),
            totalSEs: curr.statenhancersused || 0,
            activeStreak: curr.activestreak || 0,
            currentNetworth: curr.networth || 0
        };

        GM_setValue(cacheKey, { timestamp: Date.now(), data: stats });
        return stats;
    };

    const formatNumber = (num, isCurrency = false) => {
        if (num === null || typeof num === 'undefined' || isNaN(num)) return 'N/A';
        const sign = num < 0 ? "-" : "";
        const numAbs = Math.abs(num);
        const numStr = numAbs.toLocaleString(undefined, { maximumFractionDigits: 0 });
        return isCurrency ? `${sign}$${numStr}` : `${sign}${numStr}`;
    };

    const formatWorkStats = (value) => {
        if (value >= 1000) return Math.round(value / 100) / 10 + 'k';
        return value.toLocaleString();
    };

    const formatDailyAverageDuration = (totalSeconds) => {
        if (!totalSeconds) return 'N/A';
        const secondsPerDay = totalSeconds / 30;
        if (secondsPerDay < 60) return "< 1m / day";
        const hours = secondsPerDay / 3600;
        if (hours < 1) return `${Math.round(secondsPerDay / 60)}m / day`;
        return `${hours.toFixed(1)}h / day`;
    };

    const getApiKey = async () => {
        let key = await GM_getValue(STORAGE_KEY, null);
        if (!key) {
            key = prompt('Enter your Torn API key:');
            if (key && key.length > 5) await GM_setValue(STORAGE_KEY, key);
            else return null;
        }
        return key;
    };

    const renderActivityBar = (container, stats) => {
        container.innerHTML = '';
        const createItem = (label, val, color) => {
            const span = document.createElement('span');
            span.innerHTML = `<strong>${label}: </strong>${val}`;
            if (color) span.style.color = color;
            return span;
        };

        const green = 'limegreen', yellow = '#E8D44D', red = '#FF4C4C';
        let xColor = stats.xanax === 0 ? red : (stats.xanax < XANAX_THRESHOLD ? yellow : green);
        let rColor = stats.refills === 0 ? red : (stats.refills < REFILLS_THRESHOLD ? yellow : green);
        const dailyAvg = stats.activity / 30 / 3600;
        let pColor = dailyAvg < 0.1 ? red : (dailyAvg < PLAYTIME_THRESHOLD_HOURS ? yellow : green);

        container.appendChild(createItem('Xanax Δ', formatNumber(stats.xanax), xColor));
        container.appendChild(createItem('Refills Δ', formatNumber(stats.refills), rColor));
        container.appendChild(createItem('Activity', formatDailyAverageDuration(stats.activity), pColor));
        container.appendChild(createItem('Networth', formatNumber(stats.currentNetworth, true), null));
    };

    const createProfileRow = (label, val, color) => {
        const li = document.createElement('li');
        li.className = 'tm-injected-stat';
        const valHtml = color ? `<span style="color:${color}">${val}</span>` : `<span>${val}</span>`;
        li.innerHTML = `<div class="user-information-section"><span class="bold">${label}</span></div><div class="user-info-value">${valHtml}</div>`;
        return li;
    };

    const renderProfileRows = (container, stats) => {
        const green = 'limegreen', yellow = '#E8D44D', red = '#FF4C4C';
        let xColor = stats.xanax === 0 ? red : (stats.xanax < XANAX_THRESHOLD ? yellow : green);
        let rColor = stats.refills === 0 ? red : (stats.refills < REFILLS_THRESHOLD ? yellow : green);
        const dailyAvg = stats.activity / 30 / 3600;
        let pColor = dailyAvg < 0.1 ? red : (dailyAvg < PLAYTIME_THRESHOLD_HOURS ? yellow : green);

        container.appendChild(createProfileRow('Xanax (30d)', formatNumber(stats.xanax), xColor));
        container.appendChild(createProfileRow('Refills (30d)', formatNumber(stats.refills), rColor));
        container.appendChild(createProfileRow('SE Used (Total)', formatNumber(stats.totalSEs), stats.totalSEs > 0 ? green : null));
        container.appendChild(createProfileRow('Cans Used (30d)', formatNumber(stats.cans), stats.cans > 0 ? green : null));
        container.appendChild(createProfileRow('Active Streak', formatNumber(stats.activeStreak) + ' days', null));
        container.appendChild(createProfileRow('Activity (Avg)', formatDailyAverageDuration(stats.activity), pColor));
        container.appendChild(createProfileRow('Networth', formatNumber(stats.currentNetworth, true), null));
    };

    const handleFactionRow = (row, apiKey) => {
        if (row.dataset.tmProcessed) return;
        row.dataset.tmProcessed = 'true';

        const link = row.querySelector('a[href*="profiles.php"]');
        const userId = link ? link.href.match(/XID=(\d+)/)?.[1] : null;
        if (!userId) return;

        const posCell = row.querySelector('.positionCol___WXhYA') || row.querySelector('.position');
        let workStatSpan;
        if (posCell) {
            workStatSpan = document.createElement('span');
            workStatSpan.style.cssText = 'margin-left:5px; font-weight:bold; color:#aaa;';
            workStatSpan.textContent = '...';
            posCell.appendChild(workStatSpan);
        }

        const statsRow = document.createElement('li');
        statsRow.className = 'tm-stats-row';
        const statsContainer = document.createElement('div');
        statsContainer.className = 'tm-integrated-stats-bar';
        statsContainer.innerHTML = '<span class="tm-stats-bar-message">Waiting...</span>';
        statsRow.appendChild(statsContainer);
        row.insertAdjacentElement('afterend', statsRow);

        enqueueTask(async () => {
            try {
                const ws = await getWorkStats(userId, apiKey);
                if (workStatSpan) workStatSpan.textContent = formatWorkStats(ws);

                statsContainer.innerHTML = '<span class="tm-stats-bar-message">Fetching Activity...</span>';
                const ps = await getPersonalStats(userId, apiKey);
                renderActivityBar(statsContainer, ps);
            } catch (e) {
                statsContainer.innerHTML = `<span class="tm-stats-bar-message">Error: ${e}</span>`;
            }
        }, () => { statsContainer.innerHTML = '<span class="tm-stats-bar-message">Processing...</span>'; });
    };

    const handleUserListRow = (row, apiKey) => {
        if (row.dataset.tmProcessed) return;
        row.dataset.tmProcessed = 'true';
        row.style.position = 'relative';

        const link = row.querySelector('a.user.name');
        const userId = link ? link.href.match(/XID=(\d+)/)?.[1] : null;
        if (!userId) return;

        enqueueTask(async () => {
            try {
                const ws = await getWorkStats(userId, apiKey);
                if (!row.querySelector('.tm-userlist-stat')) {
                    const s = document.createElement('span');
                    s.className = 'tm-userlist-stat';
                    s.textContent = formatWorkStats(ws);
                    row.appendChild(s);
                }
            } catch (e) {}
        });
    };

    const handleProfilePage = (apiKey) => {
        const infoTable = document.querySelector('.basic-information ul.info-table');
        if (!infoTable || infoTable.dataset.tmProcessed) return;
        infoTable.dataset.tmProcessed = 'true';

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');
        if (!userId) return;

        const jobLi = Array.from(infoTable.querySelectorAll('li')).find(li => li.textContent.includes('Job'));
        let workRow;
        if (jobLi) {
            workRow = createProfileRow('Work Stats', 'Waiting...', null);
            jobLi.parentNode.insertBefore(workRow, jobLi.nextSibling);
        }

        const statusRow = createProfileRow('Analysis', 'Waiting...', '#999');
        infoTable.appendChild(statusRow);

        enqueueTask(async () => {
            try {
                if (workRow) {
                    const ws = await getWorkStats(userId, apiKey);
                    workRow.querySelector('.user-info-value span').textContent = ws.toLocaleString();
                }
                statusRow.querySelector('.user-info-value span').textContent = "Processing...";
                const ps = await getPersonalStats(userId, apiKey);
                statusRow.remove();
                renderProfileRows(infoTable, ps);
            } catch (e) {
                statusRow.querySelector('.user-info-value span').textContent = `Error: ${e}`;
            }
        });
    };

    const main = async () => {
        const apiKey = await getApiKey();
        if (!apiKey) return;

        if (window.location.href.includes('UserList')) {
            const listWrap = document.querySelector('.user-info-list-wrap');
            if (listWrap) {
                listWrap.querySelectorAll('li[class^="user"]').forEach(row => handleUserListRow(row, apiKey));
                new MutationObserver((mutations) => {
                    mutations.forEach(m => {
                        m.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && node.matches('li[class^="user"]')) handleUserListRow(node, apiKey);
                        });
                    });
                }).observe(listWrap, { childList: true, subtree: false });
            }
        } else if (window.location.pathname.includes('factions.php')) {
            const target = document.getElementById('factions');
            if (target) {
                new MutationObserver(() => {
                    const list = document.querySelector('.f-war-list.members-list ul.table-body');
                    if (list) list.querySelectorAll('li.table-row:not(.tm-processed)').forEach(row => handleFactionRow(row, apiKey));
                }).observe(target, { childList: true, subtree: true });
            }
        } else if (window.location.pathname.includes('profiles.php')) {
            const target = document.getElementById('mainContainer') || document.body;
            new MutationObserver(() => handleProfilePage(apiKey)).observe(target, { childList: true, subtree: true });
            handleProfilePage(apiKey);
        } else if (window.location.pathname.includes('joblist.php')) {
            new MutationObserver((mutations) => {
                mutations.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType === 1 && n.matches('li')) {
                        const link = n.querySelector('a.user.name');
                        const uid = link ? link.href.match(/XID=(\d+)/)?.[1] : null;
                        if (uid) {
                            enqueueTask(async () => {
                                try {
                                    const val = await getWorkStats(uid, apiKey);
                                    const rank = n.querySelector('.rank');
                                    if(rank) rank.innerHTML += `<span style="margin-left:5px; font-weight:bold">${formatWorkStats(val)}</span>`;
                                } catch(e){}
                            });
                        }
                    }
                }));
            }).observe(document.body, { childList: true, subtree: true });
        }
    };

    main();
})();