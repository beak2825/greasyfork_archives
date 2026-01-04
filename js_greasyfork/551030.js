// ==UserScript==
// @name         Torn.com Mug Inactive Players
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add last action and job information to user search results
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/551030/Torncom%20Mug%20Inactive%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/551030/Torncom%20Mug%20Inactive%20Players.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let API_KEY = GM_getValue('torn_api_key', '');
    if (!API_KEY) {
        API_KEY = prompt('Enter Your Public API key:');
        if (!API_KEY) {
            alert('API key is required for this script to work.');
            return;
        }
        GM_setValue('torn_api_key', API_KEY);
    }

    GM_addStyle(`
        .search-enhancer-badge {
            display: inline;
            font-size: 10.5px;
            padding: 9px 10px;
            margin-left: 6px;
            border-radius: 2px;
            color: white;
            font-weight: bold;
        }

        .badge-online { background: #4CAF50; }
        .badge-idle { background: #FF9800; }
        .badge-offline { background: #666; }
        .badge-job-good { background: #4CAF50; margin-left: 2px; }
        .badge-job-bad { background: #f44336; margin-left: 2px; }
        .badge-loading { background: #999; }
        .badge-error { background: #f44336; }
    `);

    function extractUserId(imgElement) {
        const altText = imgElement.alt;
        const match = altText.match(/\[(\d+)\]/);
        return match ? match[1] : null;
    }

    function makeAPIRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Failed to parse JSON'));
                    }
                },
                onerror: function() {
                    reject(new Error('Network error'));
                }
            });
        });
    }

    async function getUserProfile(userId) {
        const url = `https://api.torn.com/v2/user/${userId}/profile?striptags=true&key=${API_KEY}`;
        return await makeAPIRequest(url);
    }

    async function getUserJob(userId) {
        const url = `https://api.torn.com/v2/user/${userId}/job?key=${API_KEY}`;
        return await makeAPIRequest(url);
    }

    function parseTimeAgo(relative) {
        if (!relative || relative.toLowerCase().includes('online')) {
            return 'now';
        }

        const match = relative.match(/(\d+)\s*(min|hour|day|week|month|year)/i);
        if (!match) return '?';

        const num = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.startsWith('min')) return `${num}m`;
        if (unit.startsWith('hour')) return `${num}h`;
        if (unit.startsWith('day')) return `${num}d`;
        if (unit.startsWith('week')) return `${num * 7}d`;
        if (unit.startsWith('month')) return `${Math.round(num * 30)}d`;
        return `${Math.round(num * 365)}d`;
    }

    function getJobCategory(jobData) {
        if (!jobData || !jobData.job) return 'N/A';

        if (jobData.job.type_id !== undefined) {
            const typeId = jobData.job.type_id;
            const companyNames = {
                1: 'HairS', 2: 'Law', 3: 'Flwr', 4: 'Car', 5: 'Clth', 6: 'Gun', 7: 'Game',
                8: 'Cndl', 9: 'Toy', 10: 'AN', 11: 'Cyber', 12: 'Groc', 13: 'Thtr',
                14: 'Swt', 15: 'Cruis', 16: 'TV', 18: 'Zoo', 19: 'FS', 20: 'Prop',
                21: 'Furn', 22: 'Gas', 23: 'Musc', 24: 'NClub', 25: 'Pub', 26: 'GStrip',
                27: 'Rest', 28: 'Oil', 29: 'Fit', 30: 'Mech', 31: 'Park', 32: 'Ling',
                33: 'Meat', 34: 'Farm', 35: 'Soft', 36: 'LStrip', 37: 'Sec', 38: 'Mine',
                39: 'Det', 40: 'Log'
            };
            return companyNames[typeId] || 'Pvt';
        }

        const jobName = jobData.job.name.toLowerCase();
        if (jobName.includes('army')) return 'Army';
        if (jobName.includes('casino')) return 'Casino';
        if (jobName.includes('hospital') || jobName.includes('medical')) return 'Med';
        if (jobName.includes('law') || jobName.includes('police')) return 'Law';
        if (jobName.includes('grocer')) return 'Shop';
        if (jobName.includes('education') || jobName.includes('school')) return 'Edu';
        return 'Pvt';
    }

    function getStatusClass(lastAction) {
        const status = lastAction.status.toLowerCase();
        if (status === 'online') return 'badge-online';
        if (status === 'idle') return 'badge-idle';
        return 'badge-offline';
    }

    function addBadgesToUser(userLink, userId) {

        if (userLink.dataset.enhanced === 'true') return;
        userLink.dataset.enhanced = 'true';

        const timeBadge = document.createElement('span');
        timeBadge.className = 'search-enhancer-badge badge-loading';
        timeBadge.textContent = '...';

        const jobBadge = document.createElement('span');
        jobBadge.className = 'search-enhancer-badge badge-job-bad';
        jobBadge.textContent = '...';

        userLink.parentNode.insertBefore(timeBadge, userLink.nextSibling);
        userLink.parentNode.insertBefore(jobBadge, timeBadge.nextSibling);

        Promise.all([
            getUserProfile(userId),
            getUserJob(userId)
        ]).then(([profileData, jobData]) => {

            if (profileData.profile && profileData.profile.last_action) {
                const timeAgo = parseTimeAgo(profileData.profile.last_action.relative);
                const statusClass = getStatusClass(profileData.profile.last_action);
                timeBadge.textContent = timeAgo;
                timeBadge.className = `search-enhancer-badge ${statusClass}`;
            } else {
                timeBadge.textContent = '?';
                timeBadge.className = 'search-enhancer-badge badge-error';
            }

            const jobText = getJobCategory(jobData);
            jobBadge.textContent = jobText;

            const isPlayerCompany = jobData.job && jobData.job.type_id !== undefined;

            if (jobText === 'N/A' || jobText === 'Pvt') {
                jobBadge.className = 'search-enhancer-badge badge-job-bad';
            } else if (isPlayerCompany) {
                jobBadge.className = 'search-enhancer-badge badge-job-bad';
            } else {
                jobBadge.className = 'search-enhancer-badge badge-job-good';
            }

        }).catch(error => {
            timeBadge.textContent = 'ERR';
            timeBadge.className = 'search-enhancer-badge badge-error';
            jobBadge.textContent = 'ERR';
            jobBadge.className = 'search-enhancer-badge badge-error';
        });
    }

    function processSearchResults() {

        const userLinks = document.querySelectorAll('a.user.name[href*="profiles.php?XID="]');

        userLinks.forEach(userLink => {
            const match = userLink.href.match(/XID=(\d+)/);
            if (match) {
                const userId = match[1];
                addBadgesToUser(userLink, userId);
            }
        });
    }

    setTimeout(processSearchResults, 1000);

    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
        });

        if (shouldProcess) {
            setTimeout(processSearchResults, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Torn.com User Search Enhancer loaded - minimal badges');
})();