// ==UserScript==
// @name         Torn Attack Log API Data
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shows API data for attacks on attack log pages
// @author       Your Name
// @match        https://www.torn.com/loader.php?sid=attackLog*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560249/Torn%20Attack%20Log%20API%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/560249/Torn%20Attack%20Log%20API%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let API_KEY = GM_getValue('tornApiKey', '');

    if (!API_KEY) {
        const key = prompt('Enter your Torn API key for Attack Log Data script:');
        if (key && key.length === 16) {
            GM_setValue('tornApiKey', key);
            API_KEY = key;
        } else {
            alert('Invalid API key. Please refresh and try again.');
            return;
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const attackCode = urlParams.get('ID');

    if (!attackCode) return;

    const observer = new MutationObserver((mutations, obs) => {
        const logInfoWrap = document.querySelector('.log-info-wrap');
        const actionLog = document.querySelector('.action-log');
        if (logInfoWrap && actionLog) {
            obs.disconnect();
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        const logInfoWrap = document.querySelector('.log-info-wrap');
        if (logInfoWrap) {
            observer.disconnect();
            init();
        }
    }, 500);

    function init() {
        // Get participant IDs from the page
        const participantLinks = document.querySelectorAll('.players-in-attack .participants-list a[href*="profiles.php"]');
        const participantIds = new Set();
        participantLinks.forEach(link => {
            const match = link.href.match(/XID=(\d+)/);
            if (match) participantIds.add(parseInt(match[1]));
        });

        // Get timestamp
        const logOptionsList = document.querySelector('.log-options .participants-list');
        if (!logOptionsList) return;

        const items = logOptionsList.querySelectorAll('li');
        if (items.length < 2) return;

        const timestampText = items[1].textContent.trim();
        const timestamp = parseTimestamp(timestampText);

        if (!timestamp) return;

        const fromTime = timestamp - 60;
        const toTime = timestamp + 60;

        fetchAttackData(fromTime, toTime, attackCode, 'faction', participantIds);
    }

    function parseTimestamp(text) {
        const match = text.match(/(\d{1,2}):(\d{2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
        if (!match) return null;

        let [, hours, minutes, seconds, day, month, year] = match.map(Number);
        if (year < 100) year = 2000 + year;

        const date = Date.UTC(year, month - 1, day, hours, minutes, seconds);
        return Math.floor(date / 1000);
    }

    function fetchAttackData(from, to, code, source, participantIds) {
        const baseUrl = source === 'faction'
            ? `https://api.torn.com/faction/?key=${API_KEY}&from=${from}&to=${to}&selections=attacks`
            : `https://api.torn.com/user/?key=${API_KEY}&from=${from}&to=${to}&selections=attacks`;

        showLoading();

        GM_xmlhttpRequest({
            method: 'GET',
            url: baseUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.error) {
                        if (source === 'faction' && (data.error.code === 7 || data.error.code === 15)) {
                            fetchAttackData(from, to, code, 'user', participantIds);
                            return;
                        }
                        displayError(data.error.error);
                        if (data.error.code === 2) {
                            GM_setValue('tornApiKey', '');
                        }
                        return;
                    }

                    const attacks = data.attacks || {};

                    // Find the main attack by code
                    let mainAttack = null;
                    for (const [id, attack] of Object.entries(attacks)) {
                        if (attack.code === code) {
                            mainAttack = { id, ...attack };
                            break;
                        }
                    }

                    if (!mainAttack && source === 'faction') {
                        fetchAttackData(from, to, code, 'user', participantIds);
                        return;
                    }

                    // Find all attacks that are part of this fight
                    // Based on: participant IDs AND similar end timestamp (within 5 seconds of main attack)
                    const fightAttacks = [];
                    const mainEndTime = mainAttack ? mainAttack.timestamp_ended : null;

                    for (const [id, attack] of Object.entries(attacks)) {
                        const isParticipant = participantIds.has(attack.attacker_id) || participantIds.has(attack.defender_id);
                        const isSameTimeframe = mainEndTime
                            ? Math.abs(attack.timestamp_ended - mainEndTime) <= 5
                            : true;

                        if (isParticipant && isSameTimeframe) {
                            fightAttacks.push({ id, ...attack, isMain: attack.code === code });
                        }
                    }

                    // Sort by timestamp
                    fightAttacks.sort((a, b) => a.timestamp_started - b.timestamp_started);

                    displayData(fightAttacks);
                } catch (e) {
                    if (source === 'faction') {
                        fetchAttackData(from, to, code, 'user', participantIds);
                    } else {
                        displayError('Parse error');
                    }
                }
            },
            onerror: function() {
                if (source === 'faction') {
                    fetchAttackData(from, to, code, 'user', participantIds);
                } else {
                    displayError('Request failed');
                }
            }
        });
    }

    function showLoading() {
        const container = createContainer();
        container.innerHTML = `
            <div class="viewport">
                <ul class="participants-list overview">
                    <li style="color: #666; text-align: center;">Loading...</li>
                </ul>
            </div>
        `;
        insertContainer(container);
    }

    function displayError(message) {
        const container = createContainer();
        container.innerHTML = `
            <div class="viewport">
                <ul class="participants-list overview">
                    <li style="color: #c44; font-size: 11px;">${message}</li>
                    <li><a href="#" id="reset-api-key-link" style="color: #69c; font-size: 10px;">Reset API Key</a></li>
                </ul>
            </div>
        `;
        insertContainer(container);

        document.getElementById('reset-api-key-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            GM_setValue('tornApiKey', '');
            location.reload();
        });
    }

    function displayData(attacks) {
        const container = createContainer();

        if (!attacks || attacks.length === 0) {
            container.innerHTML = `
                <div class="viewport">
                    <ul class="participants-list overview">
                        <li style="color: #666; font-size: 11px;">No API data</li>
                    </ul>
                </div>
            `;
            insertContainer(container);
            return;
        }

        let html = `
            <style>
                #attack-api-box .attack-entry {
                    padding: 6px 8px;
                    border-bottom: 1px solid #333;
                    font-size: 11px;
                }
                #attack-api-box .attack-entry:last-child {
                    border-bottom: none;
                }
                #attack-api-box .attack-entry.main {
                    background: rgba(100, 200, 100, 0.1);
                }
                #attack-api-box .attack-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }
                #attack-api-box .attack-names {
                    color: #aaa;
                }
                #attack-api-box .attack-names a {
                    color: #69c;
                    text-decoration: none;
                }
                #attack-api-box .attack-arrow {
                    color: #555;
                    margin: 0 4px;
                }
                #attack-api-box .attack-result {
                    font-weight: bold;
                    font-size: 10px;
                }
                #attack-api-box .attack-stats {
                    display: flex;
                    gap: 8px;
                    color: #777;
                    font-size: 10px;
                }
                #attack-api-box .attack-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 3px;
                    margin-top: 4px;
                }
                #attack-api-box .tag {
                    font-size: 9px;
                    padding: 1px 4px;
                    border-radius: 2px;
                    background: #333;
                }
                #attack-api-box .footer {
                    padding: 6px 8px;
                    font-size: 10px;
                    color: #555;
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #333;
                }
            </style>
            <div class="viewport">
        `;

        for (const attack of attacks) {
            const m = attack.modifiers || {};

            // Result color
            const resultColors = {
                'Hospitalized': '#ef4444',
                'Attacked': '#22c55e',
                'Mugged': '#f97316',
                'Assist': '#3b82f6',
                'Lost': '#ec4899',
                'Stalemate': '#6b7280',
                'Escaped': '#a855f7'
            };
            const resultColor = resultColors[attack.result] || '#999';

            // Build tags
            const tags = [];
            if (attack.stealthed) tags.push({ label: 'Stealth', color: '#a855f7' });
            if (attack.raid) tags.push({ label: 'Raid', color: '#ef4444' });
            if (attack.ranked_war) tags.push({ label: 'RW', color: '#f97316' });
            if (m.retaliation && m.retaliation !== 1) tags.push({ label: 'Retal', color: '#eab308' });
            if (m.group_attack && m.group_attack !== 1) tags.push({ label: 'Group', color: '#3b82f6' });
            if (m.overseas && m.overseas !== 1) tags.push({ label: 'Overseas', color: '#22c55e' });
            if (m.chain_bonus && m.chain_bonus !== 1) tags.push({ label: `Chain ${m.chain_bonus.toFixed(1)}x`, color: '#ec4899' });

            // Fair fight
            const ff = m.fair_fight || 1;
            const ffColor = ff >= 2.5 ? '#22c55e' : ff >= 1.5 ? '#eab308' : '#ef4444';

            // Respect
            let respectHtml = '';
            if (attack.respect_gain > 0) {
                respectHtml = `<span style="color: #22c55e;">+${attack.respect_gain.toFixed(2)}</span>`;
            } else if (attack.respect_loss > 0) {
                respectHtml = `<span style="color: #ef4444;">-${attack.respect_loss.toFixed(2)}</span>`;
            }

            // Chain - clickable if > 10 and stealthed
            const chainClickable = attack.chain > 10 && attack.stealthed;
            let chainHtml = '';
            if (attack.chain) {
                chainHtml = chainClickable
                    ? `<a href="https://www.torn.com/page.php?sid=factionWarfare#/chains" style="color: #69c;">#${attack.chain}</a>`
                    : `#${attack.chain}`;
            }

            html += `
                <div class="attack-entry${attack.isMain ? ' main' : ''}">
                    <div class="attack-header">
                        <span class="attack-names">
                            <a href="profiles.php?XID=${attack.attacker_id}">${attack.attacker_name || '?'}</a>
                            <span class="attack-arrow">→</span>
                            <a href="profiles.php?XID=${attack.defender_id}">${attack.defender_name || '?'}</a>
                        </span>
                        <span class="attack-result" style="color: ${resultColor};">${attack.result}</span>
                    </div>
                    <div class="attack-stats">
                        <span style="color: ${ffColor};">FF ${ff.toFixed(2)}</span>
                        ${respectHtml ? `<span>${respectHtml}</span>` : ''}
                        ${chainHtml ? `<span>${chainHtml}</span>` : ''}
                    </div>
                    ${tags.length > 0 ? `
                        <div class="attack-tags">
                            ${tags.map(t => `<span class="tag" style="color: ${t.color};">${t.label}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += `
                <div class="footer">
                    <span>${attacks.length} attack${attacks.length > 1 ? 's' : ''}</span>
                    <a href="#" id="reset-api-key-link" style="color: #555;">⚙</a>
                </div>
            </div>
        `;

        container.innerHTML = html;
        insertContainer(container);

        document.getElementById('reset-api-key-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Reset API key?')) {
                GM_setValue('tornApiKey', '');
                location.reload();
            }
        });
    }

    function createContainer() {
        const container = document.createElement('div');
        container.id = 'attack-api-box';
        container.className = 'log-options cont-black m-top10';
        return container;
    }

    function insertContainer(container) {
        const existing = document.getElementById('attack-api-box');
        if (existing) existing.remove();

        const logInfoWrap = document.querySelector('.log-info-wrap');
        if (logInfoWrap) {
            const lastLogOptions = logInfoWrap.querySelector('.log-options:last-of-type');
            if (lastLogOptions) {
                lastLogOptions.after(container);
            } else {
                logInfoWrap.appendChild(container);
            }
        }
    }

})();