// ==UserScript==
// @name         Faction Target Finder + War Mode (FF Ranked)
// @version      2.0.0
// @namespace    http://tampermonkey.net/
// @description  Adds buttons to find raid targets or rank war targets by estimated Fair Fight bonus.
// @author       BuzzC137
// @license      all rights resrved
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548399/Faction%20Target%20Finder%20%2B%20War%20Mode%20%28FF%20Ranked%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548399/Faction%20Target%20Finder%20%2B%20War%20Mode%20%28FF%20Ranked%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /******************************************************************
     * CONFIG / STATE
     ******************************************************************/
    // These are faction IDs, listed in priority order for RAID mode
    let facIDs = [
        52067
    ];

    // Local state (loaded from localStorage via init())
    let maxLevel, apiKey, attackLink, newTab, randTarget, randFaction;
    let enemyFactionId, throttleMs, cacheTtlMs;

    init();

    function init() {
        maxLevel       = parseInt(localStorage.getItem('FTF_LEVEL') || '100', 10);
        apiKey         = localStorage.getItem('FTF_API') || null;
        attackLink     = localStorage.getItem('FTF_PROFILE') === 'true';  // open attack page directly?
        newTab         = localStorage.getItem('FTF_NEWTAB') === 'true';    // open in new tab?
        randFaction    = localStorage.getItem('FTF_RAND_FACTION') === 'true';
        randTarget     = localStorage.getItem('FTF_RAND_TARGET') === 'true';

        enemyFactionId = localStorage.getItem('FTF_ENEMY_FACTION') || '';
        throttleMs     = parseInt(localStorage.getItem('FTF_THROTTLE_MS') || '650', 10); // ~92 calls/min
        cacheTtlMs     = parseInt(localStorage.getItem('FTF_CACHE_TTL_MS') || (10 * 60 * 1000).toString(), 10); // 10 min
    }

    /******************************************************************
     * SETTINGS UI
     ******************************************************************/
    function promptAPIKey() {
        const key = prompt('Enter a full-access API key here (needed for battlestats):');
        if (key && key.trim() !== '') {
            localStorage.setItem('FTF_API', key.trim());
            init();
        } else {
            alert('No valid API key entered!');
        }
    }

    function changeSettings() {
        const newApiKey       = document.querySelector('#ftf-api').value.trim();
        const newLevel        = parseInt(document.querySelector('#ftf-max-level').value, 10);
        const newProfile      = document.querySelector('#ftf-profile').checked;
        const newNewTab       = document.querySelector('#ftf-newtab').checked;
        const newRandFaction  = document.querySelector('#ftf-random-faction').checked;
        const newRandTarget   = document.querySelector('#ftf-random-target').checked;
        const newEnemyFaction = (document.querySelector('#ftf-enemy-faction').value || '').trim();
        const newThrottle     = parseInt(document.querySelector('#ftf-throttle').value, 10);
        const newCacheTtl     = parseInt(document.querySelector('#ftf-cache-ttl').value, 10);

        // Save toggles
        localStorage.setItem('FTF_PROFILE', newProfile);
        localStorage.setItem('FTF_NEWTAB', newNewTab);
        localStorage.setItem('FTF_RAND_FACTION', newRandFaction);
        localStorage.setItem('FTF_RAND_TARGET', newRandTarget);

        // API key
        if (newApiKey && newApiKey.length >= 16) {
            localStorage.setItem('FTF_API', newApiKey);
        } else {
            alert('Invalid API key entered!');
            return;
        }

        // Max level
        if (!isNaN(newLevel) && newLevel >= 0 && newLevel <= 100) {
            localStorage.setItem('FTF_LEVEL', String(newLevel));
        } else {
            alert('Invalid max level, please enter a value between 0 and 100!');
            return;
        }

        // Enemy faction
        if (newEnemyFaction && !isNaN(parseInt(newEnemyFaction, 10))) {
            localStorage.setItem('FTF_ENEMY_FACTION', newEnemyFaction);
        } else {
            // allow blank; user can set later
            localStorage.setItem('FTF_ENEMY_FACTION', '');
        }

        // Throttle (ms per user stats request)
        if (!isNaN(newThrottle) && newThrottle >= 400 && newThrottle <= 1200) {
            localStorage.setItem('FTF_THROTTLE_MS', String(newThrottle));
        } else {
            alert('Invalid throttle. Enter 400–1200 ms per request.');
            return;
        }

        // Cache TTL (ms)
        if (!isNaN(newCacheTtl) && newCacheTtl >= 60_000 && newCacheTtl <= 60 * 60 * 1000) {
            localStorage.setItem('FTF_CACHE_TTL_MS', String(newCacheTtl));
        } else {
            alert('Invalid cache TTL. Enter 60000–3600000 ms.');
            return;
        }

        init();
        alert("Settings saved!");
    }

    /******************************************************************
     * RAID MODE (existing behavior)
     ******************************************************************/
    function processUrls(index = 0, checked = new Set()) {
        if (!apiKey) {
            promptAPIKey();
            if (!apiKey) return;
        }
        if (checked.size >= facIDs.length) {
            alert("No players met the conditions (or API key is invalid).");
            return;
        }

        if (randFaction) {
            do {
                index = Math.floor(Math.random() * facIDs.length);
            } while (checked.has(index));
        }

        checked.add(index);

        const url = `https://api.torn.com/faction/${facIDs[index]}?selections=basic&timestamp=${Date.now()}&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload(response) {
                const roster = safeJson(response.responseText);
                const target = checkCondition(roster);

                if (target) {
                    let profileLink;
                    if (attackLink) profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${target}`;
                    else profileLink = `https://www.torn.com/profiles.php?XID=${target}`;

                    if (newTab) window.open(profileLink, '_blank');
                    else window.location.href = profileLink;
                } else {
                    processUrls((index + 1) % facIDs.length, checked);
                }
            },
            onerror() {
                console.log(`Error loading URL: ${url}`);
                processUrls((index + 1) % facIDs.length, checked);
            }
        });
    }

    function checkCondition(roster) {
        if (!roster || "error" in roster) {
            console.log("Failed fetching faction roster, reason:", roster);
            return null;
        }

        const targets = Object.keys(roster.members || {}).filter(userId => {
            const m = roster.members[userId];
            return m.level <= maxLevel && m.status?.state === "Okay" && m.days_in_faction >= 15;
        });

        if (targets.length === 0) return null;
        if (randTarget) {
            const idx = Math.floor(Math.random() * targets.length);
            return targets[idx];
        }
        return targets[0];
    }

    /******************************************************************
     * WAR MODE (rank by estimated Fair Fight)
     ******************************************************************/
    function processWarTargets() {
        if (!apiKey) {
            promptAPIKey();
            if (!apiKey) return;
        }
        if (!enemyFactionId || isNaN(parseInt(enemyFactionId, 10))) {
            alert("Set a valid Enemy Faction ID in Settings first.");
            return;
        }

        openWarPanel(); // create/clear panel & show progress

        setWarPanelStatus("Fetching your battlestats...");
        getMyStats((myStats) => {
            if (!myStats) {
                setWarPanelStatus("Could not fetch your battlestats (check API perms).");
                return;
            }
            setWarPanelStatus("Fetching enemy roster...");
            getFactionMembers(enemyFactionId, (members) => {
                if (!members) {
                    setWarPanelStatus("Failed to fetch enemy roster.");
                    return;
                }

                const ids = Object.keys(members);
                // Filter attackable-ish: status Okay
                const attackables = ids.filter(uid => (members[uid]?.status?.state === "Okay"));

                if (attackables.length === 0) {
                    setWarPanelStatus("No attackable targets (state=Okay) found right now.");
                    return;
                }

                // Fetch stats with throttle & cache
                const results = [];
                let done = 0;
                setWarPanelProgress(done, attackables.length);

                const fetchNext = (i) => {
                    if (i >= attackables.length) {
                        // Sort & render
                        results.sort((a, b) => b.ff - a.ff);
                        renderWarTargets(results);
                        return;
                    }
                    const uid = attackables[i];

                    getEnemyStatsCached(uid, (enStats) => {
                        if (enStats) {
                            const ff = estimateFairFight(myStats, enStats);
                            const m = members[uid] || {};
                            results.push({
                                id: uid,
                                name: m.name || `User ${uid}`,
                                level: m.level || 0,
                                ff,
                                last_action: m.last_action?.relative || '',
                            });
                        }
                        done++;
                        setWarPanelProgress(done, attackables.length);
                        setTimeout(() => fetchNext(i + 1), throttleMs);
                    });
                };

                fetchNext(0);
            });
        });
    }

    // Estimate FF (rough heuristic using total stats ratio, clamped)
    function estimateFairFight(myStats, enemyStats) {
        const myTotal = sumStats(myStats);
        const enTotal = sumStats(enemyStats);
        if (myTotal <= 0 || enTotal <= 0) return 50; // base floor
        let ff = 100 * (enTotal / myTotal);
        if (ff < 50) ff = 50;
        if (ff > 150) ff = 150;
        return ff;
    }

    function sumStats(s) {
        if (!s) return 0;
        // Torn returns: strength, speed, dexterity, defense (and possibly total)
        const keys = ["strength", "speed", "dexterity", "defense", "strength_modifier", "speed_modifier", "dexterity_modifier", "defense_modifier"];
        let total = 0;
        for (const k of keys) {
            if (typeof s[k] === 'number' && isFinite(s[k])) total += s[k];
        }
        // If API includes "total", prefer it
        if (typeof s.total === 'number' && isFinite(s.total) && s.total > 0) return s.total;
        return total;
    }

    /******************************************************************
     * API HELPERS
     ******************************************************************/
    function getMyStats(cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=battlestats&key=${apiKey}`,
            onload(res) {
                const data = safeJson(res.responseText);
                if (data?.error) {
                    console.warn("Error fetching your battlestats:", data.error);
                    cb(null);
                    return;
                }
                cb(data?.battle_stats || null);
            },
            onerror() {
                cb(null);
            }
        });
    }

    function getFactionMembers(fid, cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/${fid}?selections=basic&key=${apiKey}`,
            onload(res) {
                const data = safeJson(res.responseText);
                if (data?.error) {
                    console.warn("Error fetching faction:", data.error);
                    cb(null);
                    return;
                }
                cb(data?.members || null);
            },
            onerror() { cb(null); }
        });
    }

    // Cached enemy battlestats per user
    function getEnemyStatsCached(userId, cb) {
        const cacheKey = `FTF_CACHE_${userId}`;
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
            try {
                const cached = JSON.parse(raw);
                if (cached && cached.ts && (Date.now() - cached.ts) < cacheTtlMs) {
                    cb(cached.stats);
                    return;
                }
            } catch (_) {}
        }
        // Fetch fresh
        getEnemyStats(userId, (stats) => {
            if (stats) {
                localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), stats }));
            }
            cb(stats);
        });
    }

    function getEnemyStats(userId, cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${userId}?selections=battlestats&key=${apiKey}`,
            onload(res) {
                const data = safeJson(res.responseText);
                if (data?.error) {
                    // Private or insufficient perms → skip
                    // console.warn(`User ${userId} stats error:`, data.error);
                    cb(null);
                    return;
                }
                cb(data?.battle_stats || null);
            },
            onerror() { cb(null); }
        });
    }

    function safeJson(txt) {
        try { return JSON.parse(txt); } catch { return null; }
    }

    /******************************************************************
     * WAR PANEL UI
     ******************************************************************/
    function openWarPanel() {
        // Remove if exists
        const old = document.getElementById('ftf-war-panel');
        if (old) old.remove();

        const panel = document.createElement('div');
        panel.id = 'ftf-war-panel';
        panel.innerHTML = `
            <div class="ftf-war-header">
                <span>War Targets (FF Ranked)</span>
                <button class="ftf-war-close" title="Close">✕</button>
            </div>
            <div class="ftf-war-body">
                <div class="ftf-war-status">Preparing...</div>
                <div class="ftf-war-progress"><div class="ftf-war-bar" style="width:0%"></div></div>
                <div class="ftf-war-list"></div>
            </div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('.ftf-war-close').addEventListener('click', () => panel.remove());
    }

    function setWarPanelStatus(text) {
        const el = document.querySelector('#ftf-war-panel .ftf-war-status');
        if (el) el.textContent = text;
    }

    function setWarPanelProgress(done, total) {
        const bar = document.querySelector('#ftf-war-panel .ftf-war-bar');
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        if (bar) bar.style.width = pct + '%';
        setWarPanelStatus(`Fetching enemy stats... ${done}/${total}`);
    }

    function renderWarTargets(results) {
        const list = document.querySelector('#ftf-war-panel .ftf-war-list');
        const status = document.querySelector('#ftf-war-panel .ftf-war-status');
        const prog = document.querySelector('#ftf-war-panel .ftf-war-progress');
        if (status) status.textContent = `Done. ${results.length} targets ranked.`;
        if (prog) prog.style.display = 'none';

        if (!list) return;

        // Build HTML
        const rows = results.map(t => {
            const attackHref = `https://www.torn.com/loader.php?sid=attack&user2ID=${t.id}`;
            const profHref   = `https://www.torn.com/profiles.php?XID=${t.id}`;
            return `
                <div class="ftf-war-item">
                    <div class="ftf-war-left">
                        <div class="ftf-war-name">L${t.level} — ${escapeHtml(t.name)}</div>
                        <div class="ftf-war-sub">FF ~ ${t.ff.toFixed(1)}% • ${escapeHtml(t.last_action || '')}</div>
                    </div>
                    <div class="ftf-war-actions">
                        <a class="ftf-war-btn attack" href="${attackHref}" ${newTab ? 'target="_blank"' : ''}>Attack</a>
                        <a class="ftf-war-btn profile" href="${profHref}" ${newTab ? 'target="_blank"' : ''}>Profile</a>
                    </div>
                </div>
            `;
        }).join('');
        list.innerHTML = rows || '<div class="ftf-war-empty">No targets to show.</div>';
    }

    function escapeHtml(s) {
        if (!s && s !== 0) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /******************************************************************
     * BUTTONS & SETTINGS PANEL
     ******************************************************************/
    const raidBtn = createButton('Raid', 'ftf-btn', () => processUrls());
    const warBtn  = createButton('War Targets', 'ftf-war', () => processWarTargets());
    const settBtn = createButton('Settings', 'ftf-settings', toggleSettings);

    const settDiv = createDiv('ftf-settings-container');
    settDiv.append(settBtn);
    const container = createDiv('ftf-container');
    container.append(raidBtn, warBtn, settDiv);
    document.body.appendChild(container);

    function toggleSettings() {
        const container = document.getElementsByClassName("ftf-settings-container")[0];
        if (!container.classList.contains("ftf-settings-container-expanded")) {
            container.classList.toggle("ftf-settings-container-expanded");
            document.querySelector(".ftf-settings").textContent = "Close Settings";

            const appendRow = (parent, labelEl, inputEl) => {
                const row = document.createElement('div');
                row.classList.add('temp-row');
                row.append(labelEl, inputEl);
                parent.append(row);
            };

            // Inputs
            const { input: apiKeyInput, label: apiKeyLabel } = createInput('ftf-api', "API Key (Full)", apiKey || "", "text");
            appendRow(container, apiKeyLabel, apiKeyInput);

            const { input: maxInput, label: maxLabel } = createInput('ftf-max-level', "Raid Max Level (0-100)", String(maxLevel), "number");
            appendRow(container, maxLabel, maxInput);

            const { checkbox: profileCheckbox, label: profileLabel } = createCheckbox('ftf-profile', "Open directly to attack page?", attackLink);
            appendRow(container, profileLabel, profileCheckbox);

            const { checkbox: tabCheckbox, label: tabLabel } = createCheckbox('ftf-newtab', "Open in new tab?", newTab);
            appendRow(container, tabLabel, tabCheckbox);

            const { checkbox: randomFCheckbox, label: randomFLabel } = createCheckbox('ftf-random-faction', "Raid: random faction?", randFaction);
            appendRow(container, randomFLabel, randomFCheckbox);

            const { checkbox: randomTCheckbox, label: randomTLabel } = createCheckbox('ftf-random-target', "Raid: random targets?", randTarget);
            appendRow(container, randomTLabel, randomTCheckbox);

            const { input: enemyInput, label: enemyLabel } = createInput('ftf-enemy-faction', "Enemy Faction ID (war)", enemyFactionId || "", "number");
            appendRow(container, enemyLabel, enemyInput);

            const { input: throttleInput, label: throttleLabel } = createInput('ftf-throttle', "War throttle (ms, 400–1200)", String(throttleMs), "number");
            appendRow(container, throttleLabel, throttleInput);

            const { input: cacheTtlInput, label: cacheTtlLabel } = createInput('ftf-cache-ttl', "Cache TTL (ms, 60000–3600000)", String(cacheTtlMs), "number");
            appendRow(container, cacheTtlLabel, cacheTtlInput);

            const saveBtn = createButton('Save', 'ftf-save', changeSettings);
            container.append(saveBtn);
        } else {
            container.classList.toggle("ftf-settings-container-expanded");
            document.querySelector(".ftf-settings").textContent = "Settings";

            // Remove dynamic children (keep the Settings button itself)
            while (container.children.length > 1) {
                container.removeChild(container.lastChild);
            }
        }
    }

    /******************************************************************
     * STYLES
     ******************************************************************/
    addGlobalStyle(`
        .ftf-btn, .ftf-war, .ftf-save {
            background-color: green;
            color: white;
            border: 1px solid white;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        .ftf-war {
            background-color: #b22222;
        }
        .ftf-settings {
            padding: 6px 10px;
            cursor: pointer;
            border: 1px solid white;
            border-radius: 6px;
            background: #444;
            color: #fff;
            font-size: 12px;
        }
        .ftf-container {
            align-items: end;
            display: flex;
            flex-direction: column;
            gap: 6px;
            position: fixed;
            top: 30%;
            right: 0;
            z-index: 9999;
            background-color: transparent;
            padding: 4px;
        }
        .ftf-settings-container {
           color: black;
           display: flex;
           flex-direction: column;
           align-items: flex-start;
           background-color: rgba(255,165,0,0.9);
           border-radius: 6px;
           padding: 6px;
        }
        .ftf-settings-container-expanded {
           width: 260px;
           height: fit-content;
           border: 1px solid white;
           align-items: center;
           justify-content: flex-start;
           gap: 4px;
        }
        #ftf-api, #ftf-max-level,
        #ftf-enemy-faction, #ftf-throttle, #ftf-cache-ttl {
            width: 140px; text-align: center; margin-left: 6px;
        }
        .temp-row { display:flex; align-items:center; justify-content:space-between; width: 100%; margin:2px 0; gap: 8px; }
        .temp-row label { font-size: 12px; color: #111; }

        /* War panel */
        #ftf-war-panel {
            position: fixed;
            right: 10px;
            bottom: 10px;
            width: 380px;
            max-height: 70vh;
            overflow: hidden;
            background: #111;
            color: #eee;
            border: 1px solid #333;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            flex-direction: column;
        }
        .ftf-war-header {
            display:flex; justify-content:space-between; align-items:center;
            padding: 8px 10px; background: #222; border-bottom: 1px solid #333;
            font-weight: bold;
        }
        .ftf-war-close {
            background: transparent; color: #ccc; border: none; cursor: pointer; font-size: 16px;
        }
        .ftf-war-body { padding: 8px; overflow-y: auto; }
        .ftf-war-status { font-size: 12px; margin-bottom: 6px; color: #ddd; }
        .ftf-war-progress { width: 100%; height: 6px; background: #333; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .ftf-war-bar { height: 100%; background: #1e90ff; width: 0%; }

        .ftf-war-list { display: flex; flex-direction: column; gap: 6px; }
        .ftf-war-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 6px; border: 1px solid #333; border-radius: 6px; background: #181818;
        }
        .ftf-war-name { font-size: 13px; font-weight: 600; color: #fff; }
        .ftf-war-sub { font-size: 11px; color: #aaa; margin-top: 2px; }
        .ftf-war-actions { display: flex; gap: 6px; }
        .ftf-war-btn {
            padding: 4px 8px; border-radius: 6px; font-size: 12px; text-decoration: none; border: 1px solid #444;
        }
        .ftf-war-btn.attack { background: #b22222; color: #fff; }
        .ftf-war-btn.profile { background: #333; color: #eee; }

        /* Keep existing small container button look too */
    `);

    /******************************************************************
     * DOM HELPERS
     ******************************************************************/
    function addGlobalStyle(css) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    function createInput(id, labelText, value, type) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value ?? '';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        return { input, label };
    }

    function createCheckbox(id, text, value) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = !!value;

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;

        return { checkbox, label };
    }
})();
