// ==UserScript==
// @name         Battle Dashboard (Functional)
// @namespace    http://tampermonkey.net/
// @version      31.0
// @description  Final version with corrected user damage detection and clean code formatting.
// @author       [DELULU] Klairmonng
// @match        *://*/battle.php*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551859/Battle%20Dashboard%20%28Functional%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551859/Battle%20Dashboard%20%28Functional%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    const STAMINA_COSTS = { slash: 1, powerSlash: 10, heroicSlash: 50 };

    let state = {
        player: { baseATK: 0, itemATK: 0, petATK: 0, petDmgBonus: 0, petCritRateBonus: 0, petCritDmgBonus: 0, totalATK: 0, currentStamina: 0, currentDamage: 0 },
        ui: { panelMinimized: false },
        monster: { name: '', id: null, maxHP: 0, defense: null },
        monsterDB: {}
    };

    // --- DATA STORAGE ---
    async function loadData() {
        state.ui = await GM_getValue('battle_dashboard_ui_final', { panelMinimized: false });
        state.monsterDB = await GM_getValue('monster_defense_db', {});
    }
    async function saveData() {
        await GM_setValue('battle_dashboard_ui_final', state.ui);
        await GM_setValue('monster_defense_db', state.monsterDB);
    }

    // --- AUTOMATIC STAT SCRAPING ---
    function GM_fetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: res => (res.status === 200) ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`)),
                onerror: reject
            });
        });
    }

    async function scrapeStatsPage() {
        const html = await GM_fetch(`/stats.php`);
        const doc = new DOMParser().parseFromString(html, "text/html");
        const baseATK = parseInt(doc.getElementById('v-attack')?.textContent || '0', 10);
        return { baseATK };
    }

    async function scrapeInventoryPage() {
        const html = await GM_fetch(`/inventory.php?set=attack`);
        const doc = new DOMParser().parseFromString(html, "text/html");
        const equippedGrid = Array.from(doc.querySelectorAll('.section-title')).find(el => el.textContent.includes('Equipped Items'))?.nextElementSibling;
        if (!equippedGrid) throw new Error("Equipped items not found.");

        let itemATK = 0;
        equippedGrid.querySelectorAll('.slot-box .label').forEach(label => {
            const match = label.innerHTML.match(/🔪\s*([\d,]+)\s*ATK/);
            if (match && match[1]) {
                itemATK += parseInt(match[1].replace(/,/g, ''), 10) || 0;
            }
        });
        return { itemATK };
    }

    async function scrapePetsPage() {
        const html = await GM_fetch(`/pets.php?team=atk`);
        const doc = new DOMParser().parseFromString(html, "text/html");
        const equippedGrid = Array.from(doc.querySelectorAll('.section-title')).find(el => el.textContent.includes('Equipped Pets'))?.nextElementSibling;
        if (!equippedGrid) throw new Error("Equipped pets not found.");

        let petATK = 0, petDmgBonus = 0, petCritRateBonus = 0, petCritDmgBonus = 0;
        equippedGrid.querySelectorAll('.slot-box').forEach(card => {
            petATK += parseInt(card.querySelector('.pet-atk')?.textContent || '0', 10);
            const powerText = card.querySelector('.pet-power')?.textContent || '';
            const dmgMatch = powerText.match(/(\d+\.?\d*)% Extra Damage To Monsters/);
            if (dmgMatch) petDmgBonus += parseFloat(dmgMatch[1]);
            const critRateMatch = powerText.match(/Increase Critical Rate By (\d+\.?\d*)%/);
            if (critRateMatch) petCritRateBonus += parseFloat(critRateMatch[1]);
            const critDmgMatch = powerText.match(/Increase Critical Damage By (\d+\.?\d*)%/);
            if (critDmgMatch) petCritDmgBonus += parseFloat(critDmgMatch[1]);
        });
        return { petATK, petDmgBonus, petCritRateBonus, petCritDmgBonus };
    }

    async function fetchAllStats() {
        updateStatus("Fetching all stats...");
        try {
            const [stats, inventory, pets] = await Promise.all([scrapeStatsPage(), scrapeInventoryPage(), scrapePetsPage()]);
            Object.assign(state.player, stats, inventory, pets);
            state.player.totalATK = state.player.baseATK + state.player.itemATK + state.player.petATK;
            updateStatus("All stats loaded!");
        } catch (e) {
            updateStatus(`Fetch Error: ${e.message}`, true);
        }
    }

    // --- CALCULATIONS ---
    const FORMULA_CONSTANTS = { C1: 225, C_ITEM: 15, C_PET: 10, C_SCALE: 1000 };
    function calculateBaseSlashDamage(p, monsterDEF) {
        if (monsterDEF === null) return null;
        const { C1, C_ITEM, C_PET, C_SCALE } = FORMULA_CONSTANTS;
        const base = C1 + (p.itemATK * C_ITEM) + (p.petATK * C_PET) + 0;
        const scaling = C_SCALE * Math.pow(Math.max(0, p.totalATK - monsterDEF), 0.25);
        const totalDamage = base + scaling;
        const finalDamage = totalDamage * (1 + (p.petDmgBonus / 100));
        return Math.round(finalDamage);
    }

    function reverseCalculateMonsterDef(actualDamage, p) {
        const { C1, C_ITEM, C_PET, C_SCALE } = FORMULA_CONSTANTS;
        const damageBeforeBonus = actualDamage / (1 + (p.petDmgBonus / 100));
        const P = C1 + (p.itemATK * C_ITEM) + (p.petATK * C_PET) + 0;
        return Math.round(p.totalATK - Math.pow((damageBeforeBonus - P) / C_SCALE, 4));
    }

    function runUpdateAndRecalculate() {
        const staminaSpan = document.getElementById('stamina_span');
        state.player.currentStamina = staminaSpan ? parseInt(staminaSpan.textContent.replace(/,/g, ''), 10) : 0;

        const damageEl = document.getElementById('yourDamageValue');
        state.player.currentDamage = damageEl ? parseInt(damageEl.textContent.replace(/\D/g, '')) : 0;

        const monsterImage = document.getElementById('monsterImage');
        state.monster.id = monsterImage ? monsterImage.src : 'unknown';
        state.monster.name = monsterImage?.nextElementSibling?.nextElementSibling?.textContent?.trim() || 'Unknown';
        const hpTextEl = document.getElementById('hpText');
        const hpText = hpTextEl ? hpTextEl.textContent || '' : '';
        state.monster.maxHP = parseInt(hpText.split('/')[1]?.replace(/[^0-9]/g, '')) || 0;
        const savedDef = state.monsterDB[state.monster.id];
        state.monster.defense = (savedDef !== undefined && savedDef !== null) ? savedDef : null;
        updateDisplay();
    }

    // --- UI ---
    function updateStatus(message, persistent = false) {
        const el = document.getElementById('calc-status');
        if (el) {
            el.textContent = message;
            if (!persistent) setTimeout(() => { if (el.textContent === message) el.textContent = ''; }, 4000);
        }
    }

    function createUI() {
        const panelHTML = `
            <div class="calc-header">
                <span class="calc-title">Battle Dashboard</span>
                <span id="calc-status"></span>
                <div>
                    <button id="calc-minimize-btn" class="calc-header-btn">—</button>
                </div>
            </div>
            <div id="calc-content" class="calc-content">
                <div class="calc-section">
                    <h4>Player Stats</h4>
                    <div class="calc-row"><strong>Total ATK:</strong> <span id="totalAtkStat">...</span></div>
                    <div class="calc-row-sub"><span>(Base: <span id="baseAtkStat">0</span> + Item: <span id="itemAtkStat">0</span> + Pet: <span id="petAtkStat">0</span>)</span></div>
                    <div class="calc-row"><strong>Pet Bonuses:</strong> <span id="petBonusStat">...</span></div>
                </div>
                <div class="calc-section">
                    <h4>Monster Stats</h4>
                    <div class="calc-row"><span>Name:</span> <span id="monsterName">...</span></div>
                    <div class="calc-row"><span>Max HP:</span> <span id="monsterHp">...</span></div>
                    <div class="calc-row"><span>DEF:</span> <span id="monsterDef">...</span></div>
                    <div class="calc-row"><span>Dmg Cap (20%):</span> <span id="dmgCap">...</span></div>
                </div>
                <div class="calc-section">
                    <h4>Damage Prediction</h4>
                    <div class="calc-row"><span>Slash Damage:</span> <span id="slashDmg">...</span></div>
                    <div class="calc-row"><span>Power Slash Damage:</span> <span id="powerDmg">...</span></div>
                    <div class="calc-row"><span>Heroic Slash Damage:</span> <span id="heroicDmg">...</span></div>
                </div>
                <div class="calc-section">
                    <h4>Stamina Burst Potential</h4>
                    <div class="calc-row"><span>With Slashes:</span> <span id="burstSlash">...</span></div>
                    <div class="calc-row"><span>With Power Slashes:</span> <span id="burstPower">...</span></div>
                    <div class="calc-row"><span>With Heroic Slashes:</span> <span id="burstHeroic">...</span></div>
                </div>
                <div class="calc-section">
                    <h4>Remaining Hits to Unlock / Cap</h4>
                    <table id="unlocksTable">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>`;
        const panel = document.createElement('div');
        panel.id = 'battle-calculator';
        panel.className = 'calc-panel';
        panel.innerHTML = panelHTML;
        document.body.appendChild(panel);

        injectCSS();
        setupEventListeners();
        applyUIVisibility();
    }

    function updateDisplay() {
        const { player: p, monster: m } = state;
        document.getElementById('totalAtkStat').textContent = p.totalATK > 0 ? p.totalATK.toLocaleString() : '...';
        document.getElementById('baseAtkStat').textContent = p.baseATK.toLocaleString();
        document.getElementById('itemAtkStat').textContent = p.itemATK.toLocaleString();
        document.getElementById('petAtkStat').textContent = p.petATK.toLocaleString();
        document.getElementById('petBonusStat').textContent = `${p.petDmgBonus.toFixed(2)}% Dmg, ${p.petCritRateBonus.toFixed(2)}% Crit Rate, ${p.petCritDmgBonus.toFixed(2)}% Crit Dmg`;
        document.getElementById('monsterName').textContent = m.name;
        document.getElementById('monsterHp').textContent = m.maxHP > 0 ? m.maxHP.toLocaleString() : '...';
        document.getElementById('monsterDef').innerHTML = m.defense === null ? `<span class="calc-warn">Unknown (Use Slash)</span>` : m.defense.toLocaleString();
        const damageCap = Math.floor(m.maxHP * 0.20);
        document.getElementById('dmgCap').textContent = damageCap > 0 ? damageCap.toLocaleString() : '...';
        const dmgSlash = calculateBaseSlashDamage(p, m.defense);
        const dmgPower = dmgSlash ? dmgSlash * 10 : null;
        const dmgHeroic = dmgSlash ? dmgSlash * 50 : null;
        const formatDmg = (d) => d !== null ? `~${d.toLocaleString()}` : 'N/A';
        document.getElementById('slashDmg').textContent = formatDmg(dmgSlash);
        document.getElementById('powerDmg').textContent = formatDmg(dmgPower);
        document.getElementById('heroicDmg').textContent = formatDmg(dmgHeroic);
        const formatBurst = (dmg, cost) => {
            if (!dmg) return 'N/A';
            const hits = Math.floor(p.currentStamina / cost);
            return `~${(hits * dmg).toLocaleString()} dmg (${hits} hits)`;
        };
        document.getElementById('burstSlash').textContent = formatBurst(dmgSlash, STAMINA_COSTS.slash);
        document.getElementById('burstPower').textContent = formatBurst(dmgPower, STAMINA_COSTS.powerSlash);
        document.getElementById('burstHeroic').textContent = formatBurst(dmgHeroic, STAMINA_COSTS.heroicSlash);
        const tableBody = document.querySelector('#unlocksTable tbody');
        tableBody.innerHTML = '';
        const targets = [];
        document.querySelectorAll('.loot-card .chip').forEach(chip => {
            const chipText = chip.textContent || '';
            if (chipText.includes('DMG req')) {
                const req = parseInt(chipText.replace(/\D/g, ''));
                const card = chip.closest('.loot-card');
                const name = card ? (card.querySelector('.loot-name') || {}).textContent : 'Unknown';
                targets.push({ name, req });
            }
        });
        if (damageCap > 0) targets.push({ name: 'Damage Cap', req: damageCap });
        targets.forEach(target => {
            const damageNeeded = Math.max(0, target.req - p.currentDamage);
            const hits = (d, c) => {
                if (d === null || d <= 0) return '∞';
                if (damageNeeded === 0) return '✔';
                const numHits = Math.ceil(damageNeeded / d);
                return `${numHits} (${(numHits * c).toLocaleString()} st)`;
            };
            tableBody.innerHTML += `<tr><td>${target.name} (${target.req.toLocaleString()})</td><td>${hits(dmgSlash, STAMINA_COSTS.slash)}</td><td>${hits(dmgPower, STAMINA_COSTS.powerSlash)}</td><td>${hits(dmgHeroic, STAMINA_COSTS.heroicSlash)}</td></tr>`;
        });
    }

    function setupEventListeners() {
        document.getElementById('calc-minimize-btn').addEventListener('click', () => {
            state.ui.panelMinimized = !state.ui.panelMinimized;
            applyUIVisibility();
            saveData();
        });
    }

    function applyUIVisibility() {
        const content = document.getElementById('calc-content');
        const btn = document.getElementById('calc-minimize-btn');
        content.style.display = state.ui.panelMinimized ? 'none' : 'block';
        btn.textContent = state.ui.panelMinimized ? '＋' : '—';
    }

    function setupLogObserver() {
        // Observer for the log panel (to discover DEF)
        const logPanel = document.querySelector('.log-panel');
        if (logPanel) {
            const defObserver = new MutationObserver(() => {
                if (state.monster.defense !== null) { defObserver.disconnect(); return; }
                const logLines = logPanel.innerHTML.split('<br>');
                if (logLines.length < 2) return;
                const firstLogLine = logLines[1];
                const match = firstLogLine.match(/used Slash for ([\d,]+) DMG/);
                if (match) {
                    const actualDamage = parseInt(match[1].replace(/,/g, ''), 10);
                    const def = reverseCalculateMonsterDef(actualDamage, state.player);
                    state.monster.defense = def;
                    state.monsterDB[state.monster.id] = def;
                    saveData();
                    updateStatus(`Monster DEF discovered: ${def}`);
                    // No disconnect, let main observer handle updates
                }
            });
            defObserver.observe(logPanel, { childList: true });
        }

        // Observer for ANY change in the main panels to trigger a dynamic refresh
        // This will catch log updates, leaderboard updates, hp updates, etc.
        const mainPanels = document.querySelectorAll('.panel');
        if (mainPanels.length > 0) {
            const dynamicObserver = new MutationObserver(() => {
                // This is a lightweight function that just reads current page state
                runUpdateAndRecalculate();
            });
            // Observe the parent container of the panels for efficiency
            const container = document.querySelector('body > div:nth-of-type(2)');
            if (container) {
                 dynamicObserver.observe(container, { childList: true, subtree: true, characterData: true });
            }
        }
    }

    function injectCSS() {
        const css = `
            .calc-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 380px;
                background: #1a1b25;
                border: 1px solid #24263a;
                border-radius: 12px;
                box-shadow: 0 6px 16px rgba(0,0,0,0.25);
                color: #e9e9ef;
                font-family: Arial, sans-serif;
                font-size: 13px;
                z-index: 9998;
            }
            .calc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #24263a;
                border-radius: 12px 12px 0 0;
                font-weight: 700;
                user-select: none;
            }
            .calc-title {
                flex-grow: 1;
            }
            .calc-header-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #1a1b25;
                border: 1px solid #24263a;
                color: #fff;
                cursor: pointer;
                border-radius: 5px;
                width: 24px;
                height: 24px;
                font-size: 16px;
                line-height: 1;
                padding: 0;
                margin-left: 8px;
            }
            #calc-status {
                font-size: 11px;
                color: #ccc;
                font-weight: 400;
                margin: 0 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                flex-shrink: 1;
            }
            .calc-content {
                padding: 12px;
                max-height: 70vh;
                overflow-y: auto;
            }
            .calc-section {
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #24263a;
            }
            .calc-section:last-child {
                border-bottom: none;
            }
            .calc-section h4 {
                margin: 0 0 10px;
                color: #ffd86a;
                font-size: 14px;
            }
            .calc-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .calc-row-sub {
                font-size: 11px;
                color: #aaa;
                margin: -4px 0 8px;
            }
            .calc-warn {
                color: #ffc107;
            }
            #unlocksTable {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                margin-top: 8px;
            }
            #unlocksTable th,
            #unlocksTable td {
                padding: 6px 4px;
                text-align: left;
                border-bottom: 1px solid #24263a;
            }
            #unlocksTable th {
                font-weight: 700;
                white-space: nowrap;
            }
            #unlocksTable td:not(:first-child) {
                text-align: center;
            }
            #unlocksTable tr:last-child td {
                border-bottom: none;
            }
        `;
        const style = document.createElement("style");
        style.innerText = css;
        document.head.appendChild(style);
    }

    async function main() {
        await loadData();
        createUI();
        await fetchAllStats();
        runUpdateAndRecalculate();
        setupLogObserver();
    }

    window.addEventListener('load', main);
})();