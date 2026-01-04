// ==UserScript==
// @name         BGA to BGG - BoardGameArenaGeek
// @namespace    https://github.com/coezbek/BoardGameArenaGeek
// @version      1.0.2
// @description  Fetches BoardGameGeek.com (BGG) stats for games on BoardGameArena.com (BGA).
// @author       coezbek
// @match        https://boardgamearena.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      boardgamegeek.com
// @connect      duckduckgo.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557541/BGA%20to%20BGG%20-%20BoardGameArenaGeek.user.js
// @updateURL https://update.greasyfork.org/scripts/557541/BGA%20to%20BGG%20-%20BoardGameArenaGeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const REQUEST_DELAY = 3000; // 3 seconds (Safe for scraping)

    // --- STATE ---
    let totalDetected = 0;
    let totalProcessed = 0;
    let queue = [];
    let isBusy = false;
    let isExpanded = false;

    // --- UI CONSTRUCTION ---
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed', bottom: '10px', left: '10px', zIndex: '100000',
        fontFamily: 'monospace', fontSize: '12px',
        display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-start' // Expands upwards, aligns left
    });
    document.body.appendChild(container);

    // 1. Minimized Status Pill
    const statusPill = document.createElement('div');
    Object.assign(statusPill.style, {
        background: '#222', color: '#aaa', padding: '5px 10px',
        borderRadius: '20px', border: '1px solid #444', cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.5)', userSelect: 'none', transition: 'color 0.3s',
        marginTop: '5px'
    });
    statusPill.innerText = "BGG: 0/0";
    statusPill.onclick = toggleUI;
    container.appendChild(statusPill);

    // 2. Expanded Panel (Hidden by default)
    const mainPanel = document.createElement('div');
    Object.assign(mainPanel.style, {
        width: '320px', height: '300px', background: 'rgba(20,20,20,0.95)',
        borderRadius: '8px', border: '1px solid #444', marginBottom: '5px',
        display: 'none', flexDirection: 'column', overflow: 'hidden'
    });
    container.appendChild(mainPanel);

    // Controls Area
    const controls = document.createElement('div');
    Object.assign(controls.style, { display: 'flex', gap: '1px', borderBottom: '1px solid #444' });

    const btnResetIDs = createBtn("Reset IDs", "#c0392b", () => clearCache('map'));
    const btnResetData = createBtn("Reset Stats", "#2980b9", () => clearCache('data'));
    const btnRescan = createBtn("Force Rescan", "#d35400", forceRescan);

    controls.appendChild(btnResetIDs);
    controls.appendChild(btnResetData);
    controls.appendChild(btnRescan);
    mainPanel.appendChild(controls);

    // Log Area
    const logBox = document.createElement('div');
    Object.assign(logBox.style, {
        flex: '1', overflowY: 'auto', padding: '8px', color: '#ddd', fontSize: '11px',
        display: 'flex', flexDirection: 'column-reverse' // Newest at bottom
    });
    mainPanel.appendChild(logBox);


    // --- UI LOGIC ---
    function toggleUI() {
        isExpanded = !isExpanded;
        mainPanel.style.display = isExpanded ? 'flex' : 'none';
        statusPill.style.color = isExpanded ? '#fff' : '#aaa';
        statusPill.style.background = isExpanded ? '#333' : '#222';
    }

    function createBtn(text, color, action) {
        const b = document.createElement('button');
        b.innerText = text;
        Object.assign(b.style, {
            flex: '1', background: color, color: 'white', border: 'none', padding: '8px',
            cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
        });
        b.onclick = action;
        return b;
    }

    function updateStatus() {
        const qCount = queue.length + (isBusy ? 1 : 0);
        if (qCount > 0) {
            statusPill.innerText = `BGG: ${qCount} left...`;
            statusPill.style.borderColor = '#f1c40f'; // Yellow border working
        } else {
            statusPill.innerText = `BGG: ${totalProcessed}/${totalDetected}`;
            statusPill.style.borderColor = '#2ecc71'; // Green border done
        }
    }

    function log(msg, type='info') {
        const colorMap = {
            info: '#bdc3c7', success: '#2ecc71', warn: '#f39c12', error: '#e74c3c'
        };

        // Console
        console.log(`%c[BGG] ${msg}`, `color:${colorMap[type]}`);

        // Visual Log
        const line = document.createElement('div');
        line.style.borderBottom = "1px solid #333";
        line.style.padding = "2px 0";
        line.style.color = colorMap[type];
        line.innerText = msg;
        logBox.insertBefore(line, logBox.firstChild);
    }

    // --- ACTIONS ---
    function clearCache(type) {
        const prefix = type === 'map' ? 'bgg_map_' : 'bgg_data_';
        const keys = GM_listValues().filter(k => k.startsWith(prefix));
        keys.forEach(k => GM_deleteValue(k));
        log(`Deleted ${keys.length} ${type} records. Reload page.`, 'warn');
    }

    function forceRescan() {
        log("Forcing rescan...", 'warn');
        document.querySelectorAll('.bga-game-item, .panel-header').forEach(el => delete el.dataset.bggScan);
        scan();
    }

    // --- CACHE ---
    function getCache(key) {
        return GM_getValue(key);
    }
    function setCache(key, val) {
        GM_setValue(key, val);
    }

    // --- QUEUE ---
    function addToQueue(task) {
        // 1. Clean Name
        task.cleanName = cleanTitle(task.name);

        // 2. Check Cache
        const cachedData = getCache(`bgg_data_${task.bgaId}`);
        const cachedUrl = getCache(`bgg_map_${task.bgaId}`);

        if (cachedData && cachedUrl) {
            log(`Cache: ${task.cleanName}`, 'success');
            render(task.el, cachedData, cachedUrl, task.mode);
            totalProcessed++;
            totalDetected++;
            updateStatus();
            return;
        }

        // 3. Deduplicate
        if (queue.some(q => q.bgaId === task.bgaId)) return;

        // 4. Enqueue
        totalDetected++;
        queue.push(task);
        updateStatus();
        processQueue();
    }

    function processQueue() {
        if (isBusy || queue.length === 0) return;
        isBusy = true;
        updateStatus();

        const task = queue.shift();

        processTask(task)
            .catch(err => log(`Error: ${err.message}`, 'error'))
            .finally(() => {
                totalProcessed++;
                setTimeout(() => {
                    isBusy = false;
                    updateStatus();
                    processQueue();
                }, REQUEST_DELAY);
            });
    }

    // --- CORE LOGIC ---
    async function processTask(task) {
        const mapKey = `bgg_map_${task.bgaId}`;
        const dataKey = `bgg_data_${task.bgaId}`;

        log(`Processing: ${task.cleanName}`);

        // 1. Get URL (Cache or Search)
        let bggUrl = getCache(mapKey);

        if (!bggUrl) {
            log(`Searching DDG...`, 'info');
            const bggId = await searchDuckDuckGo(task.cleanName);

            if (bggId) {
                bggUrl = `https://boardgamegeek.com/boardgame/${bggId}`;
                setCache(mapKey, bggUrl);
            } else {
                log(`Not found: ${task.cleanName}`, 'error');
                return;
            }
        }

        // 2. Fetch Stats
        try {
            const html = await fetchPage(bggUrl);
            const stats = parseBGGHtml(html);

            if (stats) {
                log(`Parsed: ${stats.score} (Rank ${stats.rank})`, 'success');
                setCache(dataKey, stats);
                render(task.el, stats, bggUrl, task.mode);
            } else {
                log(`Parse failed: ${task.cleanName}`, 'error');
            }
        } catch (e) {
            log(`Network Error: ${e.message}`, 'error');
            if (e.message.includes('404')) {
                GM_deleteValue(mapKey); // Bad link, remove it
            }
        }
    }

    // --- SEARCH ENGINE ---
    function searchDuckDuckGo(query) {
        return new Promise(resolve => {
            const q = encodeURIComponent(`site:boardgamegeek.com/boardgame ${query}`);
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://html.duckduckgo.com/html/?q=${q}`,
                onload: (res) => {
                    const match = res.responseText.match(/boardgamegeek\.com\/boardgame\/(\d+)/);
                    resolve(match ? match[1] : null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: (res) => {
                    if (res.status === 200) resolve(res.responseText);
                    else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: (err) => reject(err)
            });
        });
    }

    // --- DATA EXTRACTION ---
    function parseBGGHtml(html) {
        try {
            const regex = /GEEK\.geekitemPreload\s*=\s*(\{.*?\})\s*;\s*\n\s*GEEK/s;
            const match = html.match(regex);

            if (match && match[1]) {
                const data = JSON.parse(match[1]);
                const item = data.item;

                const score = item.stats?.average ? parseFloat(item.stats.average).toFixed(1) : "?";
                const weight = item.stats?.avgweight ? parseFloat(item.stats.avgweight).toFixed(2) : "?";

                // Rankinfo Example:
                // rankinfo":[
                //   {
                //       "prettyname":"Board Game Rank",
                //       "shortprettyname":"Overall Rank",
                //       "veryshortprettyname":"Overall",
                //       "subdomain":null,
                //       "rankobjecttype":"subtype",
                //       "rankobjectid":1,
                //       "browsesubtype":"boardgame",
                //       "rank":"10343",
                //       "baverage":"5.57968"
                //   },
                //   {
                //       "prettyname":"Family Game Rank",
                //       "shortprettyname":"Family Rank",
                //       "veryshortprettyname":"Family ",
                //       "subdomain":"familygames",
                //       "rankobjecttype":"family",
                //       "rankobjectid":5499,
                //       "browsesubtype":"boardgame",
                //       "rank":"2502",
                //       "baverage":"5.59625"
                //   }
                // ],
                let rank = "-";
                if (Array.isArray(item.rankinfo)) {
                    // 1. Try to find the specific "Overall" rank (ID 1)
                    // 2. Fallback to the first item in the list (usually the main rank)
                    const rObj = item.rankinfo.find(r => r.rankobjectid === 1) ||
                                item.rankinfo.find(r => r.rankobjectid === "1") || // Just in case it's a string in other contexts
                                item.rankinfo[0];

                    // Ensure the rank is a valid number/string and not "Not Ranked"
                    if (rObj && rObj.rank && rObj.rank !== "Not Ranked") {
                        rank = rObj.rank;
                    }
                }

                let best = "?";
                let min = item.minplayers;
                let max = item.maxplayers;

                try {
                    if (item.polls && item.polls.userplayers) {
                        let maxVotes = -1;
                        Object.keys(item.polls.userplayers).forEach(k => {
                            const arr = item.polls.userplayers[k];
                            if (Array.isArray(arr)) {
                                const bestOpt = arr.find(o => o.value === "Best");
                                if (bestOpt) {
                                    const v = parseInt(bestOpt.numvotes);
                                    if (v > maxVotes && v > 0) {
                                        maxVotes = v;
                                        best = k;
                                    }
                                }
                            }
                        });
                    }
                } catch(e) {}

                if (best === "?" || best === "-") {
                    if(min && max) best = (min == max) ? min : `${min}-${max}`;
                }

                return { score, rank, weight, best };
            }
        } catch(e) { }
        return null;
    }

    function cleanTitle(raw) {
        let s = raw;
        s = s.replace(/^(Spiele|Play|Jugar|Jouer)\s+/i, '');
        s = s.replace(/\s+(online|en ligne|im Browser).*$/i, '');
        s = s.replace(/ • Board Game Arena$/, '');
        return s.trim();
    }

    // --- RENDERING ---
    function render(el, data, url, mode) {
        if (el.querySelector('.bgg-badge')) return;

        // Layout Styles
        const isList = mode === 'list';
        const styleStr = isList
            ? "position:absolute; bottom:5px; left:5px; z-index:9000; background:rgba(30,30,40,0.95); font-size:10px; padding:3px 6px;"
            : "display:inline-flex; margin-top:8px; background:#2d3748; font-size:13px; padding:5px 10px;";

        const html = `
            <a href="${url}" target="_blank" class="bgg-badge" style="
                ${styleStr}
                border-left: 4px solid #22c55e; color: white;
                font-family: 'Roboto', sans-serif; text-decoration: none;
                display: inline-flex; gap: 10px; align-items: center; line-height: 1.2;
                box-shadow: 0 4px 8px rgba(0,0,0,0.8); border-radius: 4px; cursor: pointer;
                transition: transform 0.1s; pointer-events: auto;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">

                <div style="text-align:center">
                    <div style="color:#22c55e;font-weight:bold;font-size:1.2em">${data.score}</div>
                    <div style="color:#a0aec0;font-size:0.8em;text-transform:uppercase">Score</div>
                </div>
                <div style="width:1px; height:20px; background:#4a5568"></div>
                <div style="text-align:center">
                    <div style="font-weight:bold">#${data.rank}</div>
                    <div style="color:#a0aec0;font-size:0.8em;text-transform:uppercase">Rank</div>
                </div>
                <div style="width:1px; height:20px; background:#4a5568"></div>
                <div style="text-align:center">
                    <div style="font-weight:bold">${data.best}</div>
                    <div style="color:#a0aec0;font-size:0.8em;text-transform:uppercase"><i class="fa fa-user"></i></div>
                </div>
                <div style="width:1px; height:20px; background:#4a5568"></div>
                <div style="text-align:center">
                    <div style="font-weight:bold">${data.weight}</div>
                    <div style="color:#a0aec0;font-size:0.8em;text-transform:uppercase">Wght</div>
                </div>
            </a>
        `;

        if (isList) {
            el.style.position = 'relative';
            el.insertAdjacentHTML('beforeend', html);
        } else {
            el.insertAdjacentHTML('afterend', html);
        }
    }

    // --- SCANNERS ---
    function scan() {
        if(!isBusy && queue.length === 0) updateStatus();

        // 1. LIST VIEW
        if (location.href.includes('gamelist')) {
            document.querySelectorAll('.bga-game-item').forEach(card => {
                if (card.dataset.bggScan) return;

                // Mark as scanned
                card.dataset.bggScan = "1";

                let name = "";
                const nameEl = card.querySelector('.gamename, .text-center');
                if (nameEl) name = nameEl.innerText.trim();

                // Fallback ID
                const link = card.getAttribute('href');
                if (!link) return;

                const id = link.split('game=')[1];
                if (!name) name = id.replace(/([A-Z])/g, ' $1').replace(/[0-9]/g, ' ');

                addToQueue({
                    name: name,
                    cleanName: name,
                    bgaId: id,
                    el: card,
                    mode: 'list'
                });
            });
        }

        // 2. PANEL VIEW
        if (location.href.includes('gamepanel')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('game');
            const target = document.querySelector('.panel-header .flex.justify-start.items-center');
            const header = document.querySelector('.panel-header');

            if (id && target && header && !header.dataset.bggScan) {
                header.dataset.bggScan = "1";
                let name = document.title.split(' • ')[0].trim();
                addToQueue({ name, cleanName: name, bgaId: id, el: target, mode: 'panel' });
            }
        }
    }

// --- SCHEDULER & NAVIGATION HANDLER ---

    let currentUrl = location.href;
    let scanInterval = null;

    // Logic to start the "2s wait -> Scan -> 15s Loop" pattern
    function startSchedule() {
        // Stop any existing loop
        if (scanInterval) clearInterval(scanInterval);

        // 1. Wait 2 seconds (allow page to load), then Scan
        setTimeout(() => {
            scan();

            // 2. Start the 15-second loop
            scanInterval = setInterval(scan, 15000);
        }, 2000);
    }

    // Watch for URL changes (checks every 1s)
    setInterval(() => {
        if (location.href !== currentUrl) {
            log("Navigation detected - Resetting...", 'warn');
            currentUrl = location.href;

            // 1. Clear the Queue
            queue = [];
            totalDetected = 0;
            totalProcessed = 0;

            // 2. Reset Status UI
            updateStatus();

            // 3. Restart the Schedule
            startSchedule();
        }
    }, 1000);

    // Initial Start
    startSchedule();

})();
