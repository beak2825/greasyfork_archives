// ==UserScript==
// @name         Torn Profile Stats Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Display personal stats dashboard on Torn profiles
// @author       Systoned
// @match        https://www.torn.com/profiles.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562469/Torn%20Profile%20Stats%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/562469/Torn%20Profile%20Stats%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TornPDA will replace this at runtime with the user's API key
    let apiKey = '###PDA-APIKEY###';

    function getApiKey() {
        // If PDA replaced the placeholder, use it
        if (apiKey && apiKey.length === 16 && !apiKey.includes('#')) {
            return apiKey;
        }

        // Try GM storage
        let key = null;
        try {
            if (typeof GM_getValue !== 'undefined') {
                key = GM_getValue('tornApiKey', null);
            }
        } catch (e) {}

        // Fallback to localStorage
        if (!key) {
            key = localStorage.getItem('tornApiKey');
        }

        return key;
    }

    function setApiKey(key) {
        try {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('tornApiKey', key);
            }
        } catch (e) {
            // GM not available
        }
        localStorage.setItem('tornApiKey', key);
    }

    function promptForApiKey() {
        const key = prompt('Enter your Torn API key (Public access required):');
        if (key && key.length === 16) {
            setApiKey(key);
            return key;
        } else if (key) {
            alert('Invalid API key. Must be 16 characters.');
            return null;
        }
        return null;
    }

    function getUserIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('XID');
    }

    async function fetchPersonalStats(userId, apiKey) {
        try {
            const response = await fetch(
                `https://api.torn.com/user/${userId}?selections=personalstats&cat=attacking,drugs,travel,jobs,racing,networth,other&key=${apiKey}`
            );
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                if (data.error.code === 2) {
                    alert('Invalid API key. Please refresh and try again.');
                    localStorage.removeItem('tornApiKey');
                    try {
                        if (typeof GM_setValue !== 'undefined') {
                            GM_setValue('tornApiKey', null);
                        }
                    } catch(e) {}
                    return null;
                }
                return null;
            }

            console.log('Fetched stats:', data.personalstats);
            return data.personalstats || {};
        } catch (e) {
            console.error('Error fetching stats:', e);
            return null;
        }
    }

    function formatNumber(num) {
        if (num === undefined || num === null) return '0';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 't';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'b';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'm';
        if (num >= 1e3) return num.toLocaleString();
        return num.toString();
    }

    function formatTime(seconds) {
        if (!seconds) return '0s';
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        let parts = [];
        if (days > 0) parts.push(days + 'd');
        if (hours > 0) parts.push(hours + 'h');
        if (mins > 0) parts.push(mins + 'm');
        if (secs > 0 || parts.length === 0) parts.push(secs + 's');

        return parts.join(' ');
    }

    function createDashboard(stats) {
        const container = document.createElement('div');
        container.id = 'custom-stats-dashboard';
        container.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: #ccc;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px 30px;
        `;

        // Map the API field names to display
        // API fields from https://tornapi.tornplayground.eu/user/personalstats:
        // - useractivity: Time played in seconds
        // - networth: Total networth
        // - racingskill: Racing skill
        // - activestreak: Current activity streak in days
        // - bestactivestreak: Best activity streak in days
        // - xantaken: Xanax taken
        // - refills: Energy refills (point refills)
        // - nerverefills: Nerve refills
        // - statenhancersused: Stat enhancers used
        // - traveltimes: Times traveled
        // - switravel: Times traveled to Switzerland
        // - energydrinkused: Energy drinks drunk (E-cans)
        // - rankedwarhits: Ranked war hits
        // - attackswon: Attacks won
        // - attacksassisted: Attacks assisted
        // - defendswon: Defends won
        // - defendslost: Defends lost
        // - respectforfaction: Total respect gained for factions
        // - trainsreceived: Times trained by director
        // - jobpointsused: Job points used
        // - reviveskill: Revive skill

        const statItems = [
            { label: 'Time Played', value: formatTime(stats.useractivity) },
            { label: 'Total Networth', value: '$' + formatNumber(stats.networth) },
            { label: 'Racing Skill', value: stats.racingskill || 0 },
            { label: 'Activity Streak', value: (stats.activestreak || 0) + ' days' },

            { label: '', value: '' },
            { label: 'Networth Gain', value: 'N/A' }, // Not available via API
            { label: 'Revive Skill', value: stats.reviveskill || 0 },
            { label: 'Best Streak', value: (stats.bestactivestreak || 0) + ' days' },

            { label: 'Xanax Taken', value: formatNumber(stats.xantaken || 0) },
            { label: 'Refills', value: (stats.refills || 0) + ' E + ' + (stats.nerverefills || 0) + ' N' },
            { label: 'SEs Used', value: stats.statenhancersused || 0 },
            { label: 'Swiss Trips', value: stats.switravel || 0 },

            { label: 'E Cans Used', value: formatNumber(stats.energydrinkused || 0) },
            { label: 'Ranked War Hits', value: stats.rankedwarhits || 0 },
            { label: 'Total Respect', value: formatNumber(stats.respectforfaction || 0) },
            { label: 'Times Trained', value: formatNumber(stats.trainsreceived || 0) },

            { label: '', value: '' },
            { label: 'Attacks Won', value: formatNumber(stats.attackswon || 0) },
            { label: 'Defends Won', value: formatNumber(stats.defendswon || 0) },
            { label: 'Job Points Used', value: formatNumber(stats.jobpointsused || 0) },

            { label: '', value: '' },
            { label: 'Attacks Assisted', value: formatNumber(stats.attacksassisted || 0) },
            { label: 'Defends Lost', value: formatNumber(stats.defendslost || 0) },
            { label: '', value: '' },
        ];

        statItems.forEach(item => {
            const statDiv = document.createElement('div');
            
            if (item.label === '') {
                grid.appendChild(statDiv);
                return;
            }

            statDiv.style.cssText = 'line-height: 1.4;';

            const labelSpan = document.createElement('span');
            labelSpan.style.color = '#999';
            labelSpan.textContent = item.label + ': ';

            const valueSpan = document.createElement('span');
            valueSpan.style.color = '#e04040';
            valueSpan.style.fontWeight = 'bold';
            valueSpan.textContent = item.value;

            statDiv.appendChild(labelSpan);
            statDiv.appendChild(valueSpan);
            grid.appendChild(statDiv);
        });

        container.appendChild(grid);

        const note = document.createElement('div');
        note.style.cssText = `
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #333;
            font-size: 11px;
            color: #777;
        `;
        note.textContent = 'Stats shown are daily snapshots from Torn API.';
        container.appendChild(note);

        return container;
    }

    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'stats-toggle-btn';
        btn.textContent = 'Show Personal Stats';
        btn.style.cssText = `
            background: #333;
            color: #ccc;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 8px 15px;
            margin: 10px 0;
            cursor: pointer;
            font-size: 13px;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#444';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#333';
        });

        return btn;
    }

    async function init() {
        const profileWrapper = document.querySelector('.profile-wrapper');
        if (!profileWrapper) {
            setTimeout(init, 500);
            return;
        }

        const userId = getUserIdFromUrl();
        if (!userId) {
            console.log('Could not find user ID');
            return;
        }

        const toggleBtn = createToggleButton();
        let dashboardVisible = false;
        let dashboard = null;

        profileWrapper.parentNode.insertBefore(toggleBtn, profileWrapper.nextSibling);

        toggleBtn.addEventListener('click', async () => {
            if (dashboardVisible && dashboard) {
                dashboard.style.display = 'none';
                toggleBtn.textContent = 'Show Personal Stats';
                dashboardVisible = false;
                return;
            }

            if (dashboard) {
                dashboard.style.display = 'block';
                toggleBtn.textContent = 'Hide Personal Stats';
                dashboardVisible = true;
                return;
            }

            let apiKey = getApiKey();
            if (!apiKey) {
                apiKey = promptForApiKey();
                if (!apiKey) return;
            }

            toggleBtn.textContent = 'Loading...';
            toggleBtn.disabled = true;

            const stats = await fetchPersonalStats(userId, apiKey);

            toggleBtn.disabled = false;

            if (!stats) {
                toggleBtn.textContent = 'Show Personal Stats';
                return;
            }

            dashboard = createDashboard(stats);
            toggleBtn.parentNode.insertBefore(dashboard, toggleBtn.nextSibling);
            toggleBtn.textContent = 'Hide Personal Stats';
            dashboardVisible = true;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();