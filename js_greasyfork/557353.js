// ==UserScript==
// @name         Torn Target Finder (TF-9)
// @namespace    http://tampermonkey.net/
// @version      1.0-TF9
// @description  Highlights traveling players with a different color.
// @author       Gemini
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// ==UserScript==
// @name         Torn Target Finder (TF-9)
// @namespace    http://tampermonkey.net/
// @description  Highlights traveling players with a different color.
// @author       Gemini
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/557353/Torn%20Target%20Finder%20%28TF-9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557353/Torn%20Target%20Finder%20%28TF-9%29.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2025 Gemini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // --- Styles ---
    const styles = `
        #target-finder-container { font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; font-size: 12px; color: #333; }
        #target-finder-header {
            background-color: #606060;
            color: #fff;
            font-weight: bold; padding: 8px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
        #target-finder-content { padding: 8px; background-color: #f9f9f9; border: 1px solid #ccc; border-top: none; max-height: 400px; overflow-y: auto; }
        #target-finder-content label { display: block; margin-top: 5px; font-weight: bold; }
        #target-finder-content input, #target-finder-content select { width: 100%; padding: 5px; margin-bottom: 5px; box-sizing: border-box; }
        #target-finder-content button { background-color: #4CAF50; color: white; padding: 8px 12px; border: none; cursor: pointer; margin-right: 5px; width: 100%; }
        #target-finder-content button:hover { background-color: #45a049; }
        .target-finder-member { display: block; padding: 5px; border-bottom: 1px solid #ddd; }
        .target-finder-member a { color: #337ab7; text-decoration: none; }
        .target-finder-member a:hover { text-decoration: underline; }
        .target-finder-header-buttons button { background-color: transparent; border: none; color: #fff; font-size: 16px; cursor: pointer; }
        .threat-low { color: #5cb85c; }
        .threat-medium { color: #f0ad4e; }
        .threat-high { color: #d9534f; }
        .target-stats-grid { display: grid; grid-template-columns: 1fr 1fr; font-size: 11px; color: #666; }
    `;

    // --- Configuration & Mappings ---
    let apiKey = GM_getValue('tornApiKey', '');
    let filterState = GM_getValue('tornFilterState', 'All');
    let maxLevelFilter = GM_getValue('tornMaxLevelFilter', 100);
    let isCollapsed = GM_getValue('tornIsCollapsed', false);
    const rankValues = { "Absolute beginner": 1, "Beginner": 2, "Inexperienced": 3, "Rookie": 4, "Novice": 5, "Below average": 6, "Average": 7, "Reasonable": 8, "Above average": 9, "Competent": 10, "Highly competent": 11, "Veteran": 12, "Distinguished": 13, "Highly distinguished": 14, "Professional": 15, "Star": 16, "Master": 17, "Outstanding": 18, "Celebrity": 19, "Supreme": 20, "Idolized": 21, "Champion": 22, "Hero": 23, "Legendary": 24, "Elite": 25, "Invincible": 26, "Don": 27, "Kingpin": 28 };

    // --- UI Elements ---
    const container = document.createElement('div');
    container.id = 'target-finder-container';
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.right = '20px';
    container.style.width = '380px';
    container.style.zIndex = '9998';
    document.body.appendChild(container);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const header = document.createElement('div');
    header.id = 'target-finder-header';
    header.innerHTML = `<span>Target Finder (TF-9)</span><div class="target-finder-header-buttons"><button id="tf-settings-btn">&#9881;</button><button id="tf-collapse-btn">${isCollapsed ? '&#9660;' : '&#9650;'}</button></div>`;
    container.appendChild(header);

    const content = document.createElement('div');
    content.id = 'target-finder-content';
    content.style.display = isCollapsed ? 'none' : 'block';
    container.appendChild(content);

    // --- Settings UI ---
    const settingsDiv = document.createElement('div');
    settingsDiv.style.display = 'none';
    settingsDiv.innerHTML = `<input type="text" id="tf-api-key-input" placeholder="Enter API Key" value="${apiKey}"><button id="tf-save-api-key-btn" style="width:auto;">Save</button>`;
    content.appendChild(settingsDiv);

    // --- Main UI ---
    const mainControls = document.createElement('div');
    mainControls.innerHTML = `
        <label>Filter by State:</label>
        <select id="tf-state-filter">
            <option value="All">All</option>
            <option value="Okay">Okay</option>
            <option value="Hospital">Hospital</option>
            <option value="Traveling">Traveling</option>
            <option value="Jail">Jail</option>
        </select>
        <label>Max Level:</label>
        <input type="number" id="tf-max-level-input" min="1" value="100">
        <button id="tf-scan-btn">Scan Page for Targets</button>
    `;
    content.appendChild(mainControls);
    document.getElementById('tf-state-filter').value = filterState;
    document.getElementById('tf-max-level-input').value = maxLevelFilter;

    const targetListDiv = document.createElement('div');
    content.appendChild(targetListDiv);

    // --- Event Listeners ---
    document.getElementById('tf-settings-btn').onclick = () => { settingsDiv.style.display = settingsDiv.style.display === 'none' ? 'block' : 'none'; };
    document.getElementById('tf-collapse-btn').onclick = () => {
        isCollapsed = !isCollapsed;
        content.style.display = isCollapsed ? 'none' : 'block';
        document.getElementById('tf-collapse-btn').innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
        GM_setValue('tornIsCollapsed', isCollapsed);
    };
    document.getElementById('tf-save-api-key-btn').onclick = () => {
        apiKey = document.getElementById('tf-api-key-input').value;
        GM_setValue('tornApiKey', apiKey);
        alert('API Key saved!');
    };
    document.getElementById('tf-state-filter').onchange = (e) => {
        filterState = e.target.value;
        GM_setValue('tornFilterState', filterState);
    };
    document.getElementById('tf-max-level-input').onchange = (e) => {
        maxLevelFilter = parseInt(e.target.value, 10);
        GM_setValue('tornMaxLevelFilter', maxLevelFilter);
    };
    document.getElementById('tf-scan-btn').onclick = scanPageForTargets;

    // --- Draggable UI ---
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        dragOffsetX = e.clientX - container.offsetLeft;
        dragOffsetY = e.clientY - container.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = (e.clientX - dragOffsetX) + 'px';
            container.style.top = (e.clientY - dragOffsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // --- API & Logic ---
    function apiRequest(url, callback) {
        if (!apiKey) { alert('API key is required.'); return; }
        GM_xmlhttpRequest({
            method: 'GET', url: url,
            onload: (res) => {
                const data = JSON.parse(res.responseText);
                if (data.error) { console.error('Torn API Error:', data.error); targetListDiv.innerHTML = `<i>API Error: ${data.error.error}</i>`; return; }
                callback(data);
            },
            onerror: (res) => { console.error('Torn API Error:', res); alert('An error occurred fetching API data.'); }
        });
    }

    function getTargetData(targetId, callback) {
        const url = `https://api.torn.com/user/${targetId}?selections=profile,personalstats&key=${apiKey}`;
        apiRequest(url, (data) => {
            const threat = assessThreat(data);
            callback({
                id: data.player_id, name: data.name, level: data.level,
                rank: data.rank, age: data.age, awards: data.awards,
                life: data.life,
                status: data.status.description,
                state: data.status.state,
                details: data.status.details,
                threat: threat
            });
        });
    }

    function assessThreat(data) {
        const rankValue = rankValues[data.rank] || 0;
        if (data.level < 25 && (data.age > 365 || data.awards > 300 || rankValue > 15)) {
            return { level: 'High', class: 'threat-high' };
        }
        if (data.level < 30 && (data.age > 150 || data.awards > 100 || rankValue > 10)) {
            return { level: 'Medium', class: 'threat-medium' };
        }
        return { level: 'Low', class: 'threat-low' };
    }

    function formatTime(seconds) {
        if (seconds <= 0) return "00:00:00";
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function scanPageForTargets() {
        targetListDiv.innerHTML = '<i>Scanning... (This may take a moment)</i>';
        const profileLinks = Array.from(document.querySelectorAll('a[href*="profiles.php?XID="]'));
        const userIds = [...new Set(profileLinks.map(a => a.href.match(/XID=(\d+)/)[1]))];

        let targetsFound = [];
        let processedCount = 0;

        if (userIds.length === 0) {
            targetListDiv.innerHTML = 'No potential targets found on this page.';
            return;
        }

        userIds.forEach(id => {
            getTargetData(id, (targetData) => {
                processedCount++;
                if (targetData) {
                    const stateMatch = filterState === 'All' || targetData.state === filterState;
                    const levelMatch = targetData.level <= maxLevelFilter;

                    if (stateMatch && levelMatch) {
                        targetsFound.push(targetData);
                    }
                }

                if (processedCount === userIds.length) {
                    renderTargets(targetsFound);
                }
            });
        });
    }

    // --- UI Rendering ---
    function renderTargets(targets) {
        targetListDiv.innerHTML = '';
        if (targets.length === 0) {
            targetListDiv.innerHTML = '<i>No targets found matching your criteria.</i>';
            return;
        }

        targets.sort((a, b) => {
            const aEnds = a.details ? a.details.ends : null;
            const bEnds = b.details ? b.details.ends : null;

            if (aEnds && bEnds) { return aEnds - bEnds; }
            if (aEnds) { return -1; }
            if (bEnds) { return 1; }
            return a.level - b.level; // Fallback sort for non-timed users
        });

        for (const target of targets) {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'target-finder-member';

            if (target.state === 'Traveling') {
                memberDiv.style.backgroundColor = '#eaf6ff'; // Light blue for travelers
            }

            let timeRemainingHTML = '';
            if (target.details && target.details.ends) {
                const remainingSeconds = target.details.ends - (Date.now() / 1000);
                if (remainingSeconds > 0) {
                    timeRemainingHTML = ` <span style="color: #888;">(ends in ${formatTime(remainingSeconds)})</span>`;
                }
            }

            const memberInfo = document.createElement('div');
            memberInfo.innerHTML = `
                <div>
                    <a href="https://www.torn.com/profiles.php?XID=${target.id}" target="_blank">${target.name} [${target.id}]</a>
                    - <strong class="${target.threat.class}">${target.threat.level} Threat</strong>
                </div>
                <div class="target-stats-grid">
                    <span>Lvl: ${target.level}</span>
                    <span>Rank: ${target.rank}</span>
                    <span>Awards: ${target.awards}</span>
                    <span>Life: ${target.life.current} / ${target.life.maximum}</span>
                </div>
                <div style="font-weight:bold; color:blue;">State: ${target.state}</div>
                <div style="font-weight:bold;">Status: ${target.status}${timeRemainingHTML}</div>
            `;

            memberDiv.appendChild(memberInfo);
            targetListDiv.appendChild(memberDiv);
        }
    }
})();
