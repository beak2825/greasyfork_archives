// ==UserScript==
// @name         RW Target Finder
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Finds targets for chaining. Prioritizes Ranked War enemies (fair fights) first, then falls back to FFScouter targets.
// @author       ANITABURN
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @connect      ffscouter.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/563473/RW%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/563473/RW%20Target%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TORN_API_KEY_STORAGE = 'smart_target_torn_key';
    const BUTTON_TEXT = 'Smart Chain';
    const BUTTON_COLOR = '#2e7d32';
    const IDEAL_FF_MIN = 1.0;
    const IDEAL_FF_MAX = 3.0;
    const TARGET_KEY = 'ffscouterv2-target';
    const FF_TARGET_STALENESS = 24 * 60 * 60 * 1000;

    function log(msg) {
        console.log(`[Smart Target Finder] ${msg}`);
    }

    function getApiKey(storageKey, serviceName) {
        let key = GM_getValue(storageKey);
        if (!key) {
            key = prompt(`Please enter your ${serviceName} API Key:`);
            if (key) {
                GM_setValue(storageKey, key);
            }
        }
        return key;
    }

    function makeRequest(method, url, data = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const json = JSON.parse(response.responseText);
                            resolve(json);
                        } catch (e) {
                            reject('Failed to parse JSON');
                        }
                    } else {
                        reject(`HTTP ${response.status}: ${response.statusText}`);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    function get_ff_ranges() {
        const defaultRange = { low: 2, high: 4, max: 8 };
        const rangeUnparsed = GM_getValue('ffscouterv2-ranges');
        if (!rangeUnparsed) {
            return defaultRange;
        }
        try {
            return JSON.parse(rangeUnparsed);
        } catch (error) {
            return defaultRange;
        }
    }

    function get_ff_perc() {
        const defaultRange = { low: 50, high: 40, max: 10 };
        const rangeUnparsed = GM_getValue('ffscouterv2-perc');
        if (!rangeUnparsed) {
            return defaultRange;
        }
        try {
            return JSON.parse(rangeUnparsed);
        } catch (error) {
            return defaultRange;
        }
    }

    function get_cached_targets(range) {
        const key = `${TARGET_KEY}-${range}`;
        const value = GM_getValue(key);
        if (!value) return null;

        let parsed = null;
        try {
            parsed = JSON.parse(value);
        } catch {
            return null;
        }

        if (parsed == null) return null;

        const lastUpdated = new Date(parsed.last_updated);
        if (Date.now() - lastUpdated.getTime() > FF_TARGET_STALENESS) {
            return null;
        }

        return parsed.targets;
    }

    async function update_ff_targets(tornKey) {
        const cached = get_cached_targets('low');
        if (cached) {
            log('Using cached FFScouter targets');
            return;
        }

        const stored_values = get_ff_ranges();

        for (const [range_key, range_value] of Object.entries(stored_values)) {
            const url = `https://ffscouter.com/api/v1/get-targets?key=${tornKey}&inactiveonly=1&maxff=${range_value}&limit=50`;

            try {
                log(`Fetching FFScouter targets for range ${range_value}`);
                const ff_response = await makeRequest('GET', url);

                if (ff_response && ff_response.error) {
                    console.error('FFScouter error:', ff_response.error);
                    if (ff_response.error.includes('Invalid API key') || ff_response.error.includes('unauthorized')) {
                        alert('FFScouter requires registration. Please visit ffscouter.com and register your Torn API key first.');
                        return;
                    }
                    continue;
                }

                if (ff_response.targets) {
                    const result = {
                        targets: ff_response.targets,
                        last_updated: new Date().toISOString(),
                    };
                    GM_setValue(TARGET_KEY + '-' + range_key, JSON.stringify(result));
                    log(`Cached ${ff_response.targets.length} targets for range ${range_key}`);
                }
            } catch (e) {
                console.error('Failed to fetch FFScouter targets:', e);
            }
        }
    }

    function get_random_chain_target() {
        const stored_percentages = get_ff_perc();
        const rand = Math.random() * 100;

        let rangeKey;
        if (rand < stored_percentages.low) {
            rangeKey = 'low';
        } else if (rand < stored_percentages.low + stored_percentages.high) {
            rangeKey = 'high';
        } else {
            rangeKey = 'max';
        }

        const targets = get_cached_targets(rangeKey);
        if (!targets || targets.length === 0) {
            return null;
        }

        const r = Math.floor(Math.random() * targets.length);
        return targets[r];
    }

    async function getRankedWarEnemies(tornKey) {
        log('Getting your faction ID...');

        const myDetails = await makeRequest('GET', `https://api.torn.com/user/?selections=profile&key=${tornKey}`);
        const myFactionId = myDetails.faction.faction_id;

        if (!myFactionId) {
            log('You are not in a faction.');
            return [];
        }

        log(`Your faction ID: ${myFactionId}`);
        log('Checking for active ranked wars...');

        const warData = await makeRequest('GET', `https://api.torn.com/v2/faction/rankedwars?offset=0&limit=1&sort=DESC&key=${tornKey}`);

        if (!warData.rankedwars || warData.rankedwars.length === 0) {
            log('No active ranked wars found.');
            return [];
        }

        const currentWar = warData.rankedwars[0];
        log(`Found ranked war ID: ${currentWar.id}`);

        const myFactionInWar = currentWar.factions.find(f => f.id === myFactionId);

        if (!myFactionInWar) {
            log('Your faction is not in the current ranked war.');
            return [];
        }

        const enemyFaction = currentWar.factions.find(f => f.id !== myFactionId);

        if (!enemyFaction) {
            log('Could not find enemy faction in the war.');
            return [];
        }

        log(`Found enemy faction: ${enemyFaction.name} (ID: ${enemyFaction.id})`);

        const enemyData = await makeRequest('GET', `https://api.torn.com/v2/faction/${enemyFaction.id}/members?striptags=true&key=${tornKey}`);

        if (!enemyData || !enemyData.members || enemyData.members.length === 0) {
            log('No members found in enemy faction.');
            return [];
        }

        const memberIds = enemyData.members.map(member => member.id);
        log(`Found ${memberIds.length} members in enemy faction ${enemyFaction.name}`);

        return memberIds;
    }

    async function filterTargetsByFF(targets, ffKey) {
        if (targets.length === 0) return null;

        log(`Filtering ${targets.length} targets via FFScouter...`);

        const CHUNK_SIZE = 50;
        let candidates = [];

        for (let i = 0; i < targets.length; i += CHUNK_SIZE) {
            const chunk = targets.slice(i, i + CHUNK_SIZE);
            const url = `https://ffscouter.com/api/v1/get-stats?key=${ffKey}&targets=${chunk.join(',')}`;

            try {
                const stats = await makeRequest('GET', url);

                if (stats && stats.error) {
                    console.error('FFScouter API error:', stats.error);
                    if (stats.error.includes('Invalid API key') || stats.error.includes('unauthorized')) {
                        alert('FFScouter API key invalid. Please register at ffscouter.com with your Torn API key.');
                        return null;
                    }
                    continue;
                }

                if (Array.isArray(stats)) {
                    for (const player of stats) {
                        if (player.fair_fight !== null && player.fair_fight >= IDEAL_FF_MIN && player.fair_fight <= IDEAL_FF_MAX) {
                            candidates.push(player);
                        }
                    }
                }
            } catch (e) {
                console.error("FFScouter check failed:", e);
            }
        }

        if (candidates.length > 0) {
            candidates.sort((a, b) => b.fair_fight - a.fair_fight);
            const topCandidates = candidates.slice(0, 5);
            return topCandidates[Math.floor(Math.random() * topCandidates.length)];
        }

        return null;
    }

    async function runScript() {
        const tornKey = getApiKey(TORN_API_KEY_STORAGE, 'Torn');
        if (!tornKey) return;

        const btn = document.getElementById('smart-chain-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Searching...';
        btn.disabled = true;

        try {
            const rwEnemies = await getRankedWarEnemies(tornKey);
            let target = null;

            if (rwEnemies.length > 0) {
                const rwTarget = await filterTargetsByFF(rwEnemies, tornKey);
                if (rwTarget) {
                    log(`Found RW Target: ${rwTarget.player_id} (FF: ${rwTarget.fair_fight})`);
                    target = rwTarget;
                }
            }

            if (!target) {
                log('No RW target found. Using FFScouter fallback.');
                await update_ff_targets(tornKey);
                const fbTarget = get_random_chain_target();
                if (fbTarget) {
                    log(`Found FFScouter Target: ${fbTarget.player_id} (FF: ${fbTarget.fair_fight})`);
                    target = fbTarget;
                }
            }

            if (target) {
                const link = `https://www.torn.com/loader.php?sid=attack&user2ID=${target.player_id}`;
                window.location.href = link;
            } else {
                alert('No suitable targets found!');
            }

        } catch (e) {
            console.error(e);
            alert('Error finding target. Check console.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    function createButton() {
        if (document.getElementById('smart-chain-btn')) return;

        const button = document.createElement('button');
        button.id = 'smart-chain-btn';
        button.innerHTML = BUTTON_TEXT;
        button.style.position = 'fixed';
        button.style.top = '35%';
        button.style.right = '0%';
        button.style.zIndex = '9999';
        button.style.backgroundColor = BUTTON_COLOR;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '8px 12px';
        button.style.borderRadius = '6px 0 0 6px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '-2px 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('click', runScript);
        document.body.appendChild(button);
    }

    createButton();

})();