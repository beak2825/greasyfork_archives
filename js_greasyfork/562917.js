// ==UserScript==
// @name         Degen Idle Stats Calculator (Integrated)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Integrated DPS calculator that extracts stats from game and calculates directly.
// @author       RVN
// @match        https://degenidle.com/*
// @match        http://degenidle.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562917/Degen%20Idle%20Stats%20Calculator%20%28Integrated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562917/Degen%20Idle%20Stats%20Calculator%20%28Integrated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enemy/Boss Database
    const enemyDatabase = {
        enemy: [
            { name: "Shalehide Monitor", level: 70, defense: 35, penetration: 0, attack: 2.1 },
            { name: "Cragspike Harrower", level: 72, defense: 35, penetration: 0, attack: 2.1 },
            { name: "Riftjaw Gnarlbeast", level: 74, defense: 35, penetration: 0, attack: 2.5 },
            { name: "Crackjaw", level: 76, defense: 35, penetration: 0, attack: 2.5 },
            { name: "Shardgut Devourer", level: 78, defense: 35, penetration: 0, attack: 5 },
            { name: "Stormveil Brute", level: 80, defense: 45, penetration: 0, attack: 3.25 },
            { name: "Stormcarved Colossus", level: 82, defense: 45, penetration: 5, attack: 3.25 },
            { name: "Stormfang Sentinel", level: 84, defense: 45, penetration: 5, attack: 4 },
            { name: "Stormveil Defender", level: 86, defense: 45, penetration: 5, attack: 4 },
            { name: "Stormcaller", level: 88, defense: 45, penetration: 5, attack: 9 }
        ],
        boss: [
            { name: "Voidgrasp", level: 50, defense: 35, penetration: 20, attack: 14 },
            { name: "Blightmaw", level: 60, defense: 42, penetration: 20, attack: 16 },
            { name: "Thundermaw", level: 80, defense: 60, penetration: 20, attack: 30 }
        ]
    };

    let calculatorModal = null;
    let isModalOpen = false;

    // Extract stats from DOM
    function extractStatsFromDOM() {
        // Try multiple selectors to find stats container
        let statsContainer = document.querySelector("body > div.min-h-screen.bg-\\[\\#171922\\] > div.pt-\\[100px\\].md\\:pt-20.md\\:pl-\\[320px\\] > main > div > div.p-4 > div.hidden.lg\\:grid.lg\\:grid-cols-\\[60\\%_40\\%\\].gap-4 > div.relative > div > div");

        // Fallback: search for "Character Stats" heading
        if (!statsContainer) {
            const headings = Array.from(document.querySelectorAll('h3, h4'));
            const charStatsHeading = headings.find(h => h.textContent.includes('Character Stats'));
            if (charStatsHeading) {
                statsContainer = charStatsHeading.closest('div');
            }
        }

        if (!statsContainer) {
            console.error('[Degen Stats] Stats container not found');
            return null;
        }

        const stats = {};

        // Helper to extract value from stat row
        function extractStatValue(labelText) {
            const allRows = statsContainer.querySelectorAll('div[class*="bg-"]');
            for (const row of allRows) {
                const labelEl = row.querySelector('.text-gray-400, [class*="text-gray"]');
                const valueEl = row.querySelector('.font-medium, [class*="font-medium"]');

                if (labelEl && valueEl && labelEl.textContent.trim() === labelText) {
                    return valueEl.textContent.trim();
                }
            }
            return null;
        }

        // Extract Core Stats
        const health = extractStatValue('Health');
        const energy = extractStatValue('Energy');
        const attackPower = extractStatValue('Attack Power');
        const defense = extractStatValue('Defense');
        const attackSpeed = extractStatValue('Attack Speed');

        if (health) stats.health = parseFloat(health.replace(/[x%]/g, '')) || 0;
        if (energy) stats.energy = parseFloat(energy.replace(/[x%]/g, '')) || 0;
        if (attackPower) stats.attackPower = parseFloat(attackPower.replace(/[x%]/g, '')) || 0;
        if (defense) stats.defense = parseFloat(defense.replace(/[x%]/g, '')) || 0;
        if (attackSpeed) stats.attackSpeed = parseFloat(attackSpeed.replace(/[x%]/g, '')) || 0;

        // Extract Combat Stats
        const critChance = extractStatValue('Crit Chance');
        const critDamage = extractStatValue('Crit Damage');
        const blockChance = extractStatValue('Block Chance');
        const dodgeChance = extractStatValue('Dodge Chance');
        const defensePen = extractStatValue('Defense Penetration');

        if (critChance) stats.critChance = parseFloat(critChance.replace(/[%]/g, '')) || 0;
        if (critDamage) {
            const critDmgValue = parseFloat(critDamage.replace(/[%]/g, '')) || 0;
            stats.critDamage = critDmgValue / 100; // Convert 150% to 1.5 multiplier
        }
        if (blockChance) stats.blockChance = parseFloat(blockChance.replace(/[%]/g, '')) || 0;
        if (dodgeChance) stats.dodgeChance = parseFloat(dodgeChance.replace(/[%]/g, '')) || 0;
        if (defensePen) stats.defensePen = parseFloat(defensePen.replace(/[%]/g, '')) || 0;

        // Extract Utility Stats
        const resourceEff = extractStatValue('Resource Efficiency');
        if (resourceEff) stats.resourceEff = parseFloat(resourceEff.replace(/[%+]/g, '')) || 0;

        // Extract Recovery Stats
        const energyOnHit = extractStatValue('Energy on Hit');
        const energyOnCrit = extractStatValue('Energy on Crit');
        const energyOnBlock = extractStatValue('Energy on Block');
        const energyOnDodge = extractStatValue('Energy on Dodge');
        const healthOnHit = extractStatValue('Health on Hit');
        const healthOnCrit = extractStatValue('Health on Crit');
        const healthOnBlock = extractStatValue('Health on Block');
        const healthOnDodge = extractStatValue('Health on Dodge');

        if (energyOnHit) stats.energyOnHit = parseFloat(energyOnHit) || 0;
        if (energyOnCrit) stats.energyOnCrit = parseFloat(energyOnCrit) || 0;
        if (energyOnBlock) stats.energyOnBlock = parseFloat(energyOnBlock) || 0;
        if (energyOnDodge) stats.energyOnDodge = parseFloat(energyOnDodge) || 0;
        if (healthOnHit) stats.healthOnHit = parseFloat(healthOnHit) || 0;
        if (healthOnCrit) stats.healthOnCrit = parseFloat(healthOnCrit) || 0;
        if (healthOnBlock) stats.healthOnBlock = parseFloat(healthOnBlock) || 0;
        if (healthOnDodge) stats.healthOnDodge = parseFloat(healthOnDodge) || 0;

        // Extract Utility Stats (additional)
        const perfectBlock = extractStatValue('Perfect Block');
        const damageReflect = extractStatValue('Damage Reflect');
        if (perfectBlock) stats.perfectBlock = parseFloat(perfectBlock.replace(/[%]/g, '')) || 0;
        if (damageReflect) stats.damageReflect = parseFloat(damageReflect.replace(/[%]/g, '')) || 0;

        // Get character class - try to find it in the page
        stats.characterClass = 'Spellblade'; // Default
        const pageText = document.body.textContent || '';
        if (pageText.includes('mage') || pageText.includes('Mage')) {
            stats.characterClass = 'Spellblade';
        }

        console.log('[Degen Stats] Extracted stats:', stats);
        return stats;
    }

    // Create calculator modal with improved UI
    function createCalculatorModal() {
        if (calculatorModal) return calculatorModal;

        // Inject improved modal styles
        if (!document.getElementById('degenCalculatorModalStyles')) {
            const style = document.createElement('style');
            style.id = 'degenCalculatorModalStyles';
            style.textContent = `
                #degenCalculatorModal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(4px);
                    z-index: 9999999;
                    overflow-y: auto;
                    padding: 20px;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                #degenCalculatorModalContent {
                    position: relative;
                    max-width: 1200px;
                    margin: 20px auto;
                    background: #0B0E14;
                    border: 1px solid #1E2330;
                    border-radius: 12px;
                    padding: 0;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    color: #e4e4e7;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: slideUp 0.3s ease;
                    overflow: hidden;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #degenCalculatorModalHeader {
                    background: #161922;
                    border-bottom: 1px solid #1E2330;
                    padding: 20px 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #degenCalculatorModalTitle {
                    color: #a78bfa;
                    margin: 0;
                    font-size: 1.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                #degenCalculatorModalClose {
                    background: transparent;
                    border: none;
                    color: #9ca3af;
                    font-size: 24px;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                #degenCalculatorModalClose:hover {
                    background: #1E2330;
                    color: #ef4444;
                }

                #calculatorContent {
                    padding: 30px;
                    background: #0B0E14;
                }

                .calc-section {
                    background: rgba(30, 30, 46, 0.6);
                    border: 1px solid #1E2330;
                    border-radius: 10px;
                    padding: 24px;
                    margin-bottom: 20px;
                }

                .calc-section h2 {
                    color: #a78bfa;
                    margin: 0 0 20px 0;
                    font-size: 1.4em;
                    font-weight: 600;
                    border-bottom: 2px solid #1E2330;
                    padding-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .calc-input-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                }

                .calc-input-wrapper {
                    display: flex;
                    flex-direction: column;
                }

                .calc-input-wrapper label {
                    color: #a78bfa;
                    font-size: 0.875rem;
                    margin-bottom: 6px;
                    font-weight: 500;
                }

                .calc-input-wrapper input,
                .calc-input-wrapper select,
                #calcCharacterClass,
                #calcEnemyType,
                #calcEnemySelector {
                    padding: 10px 12px;
                    background: #161922 !important;
                    border: 1px solid #1E2330 !important;
                    border-radius: 6px !important;
                    color: #e4e4e7 !important;
                    font-size: 14px !important;
                    transition: all 0.2s ease;
                    width: 100%;
                    box-sizing: border-box;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    cursor: pointer;
                }

                .calc-input-wrapper input:focus,
                .calc-input-wrapper select:focus,
                #calcCharacterClass:focus,
                #calcEnemyType:focus,
                #calcEnemySelector:focus {
                    outline: none !important;
                    border-color: #8b5cf6 !important;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
                }

                /* Select arrow styling */
                .calc-input-wrapper select,
                .calc-class-select,
                .calc-enemy-select,
                #calcCharacterClass,
                #calcEnemyType,
                #calcEnemySelector {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 12px center !important;
                    padding-right: 36px !important;
                }

                /* Select options styling */
                .calc-input-wrapper select option,
                .calc-class-select option,
                .calc-enemy-select option,
                #calcCharacterClass option,
                #calcEnemyType option,
                #calcEnemySelector option {
                    background: #161922 !important;
                    color: #e4e4e7 !important;
                    padding: 10px !important;
                }

                .calc-input-wrapper select optgroup,
                .calc-enemy-select optgroup,
                #calcEnemySelector optgroup {
                    background: #0B0E14 !important;
                    color: #a78bfa !important;
                    font-weight: 600 !important;
                }

                .calc-result-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(45, 45, 68, 0.4);
                    border: 1px solid #1E2330;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    transition: all 0.2s ease;
                }

                .calc-result-box:hover {
                    background: rgba(45, 45, 68, 0.6);
                    border-color: #2A3041;
                }

                .calc-result-box.highlight {
                    background: rgba(139, 92, 246, 0.15);
                    border: 2px solid #8b5cf6;
                    font-size: 1.1em;
                }

                .calc-result-label {
                    color: #cbd5e1;
                    font-weight: 500;
                }

                .calc-result-value {
                    color: #22c55e;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    font-size: 1.05em;
                }

                .calc-enemy-selector {
                    background: rgba(45, 45, 68, 0.4);
                    border: 1px solid #1E2330;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .calc-enemy-selector-row {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 16px;
                    align-items: center;
                }

                .calc-enemy-selector-row label {
                    color: #a78bfa;
                    font-weight: 600;
                    font-size: 14px;
                    min-width: 80px;
                }
            `;
            document.head.appendChild(style);
        }

        const modal = document.createElement('div');
        modal.id = 'degenCalculatorModal';

        const modalContent = document.createElement('div');
        modalContent.id = 'degenCalculatorModalContent';

        // Header
        const header = document.createElement('div');
        header.id = 'degenCalculatorModalHeader';

        const title = document.createElement('h1');
        title.id = 'degenCalculatorModalTitle';
        title.innerHTML = '📊 DPS Calculator';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'degenCalculatorModalClose';
        closeBtn.innerHTML = '✕';
        closeBtn.title = 'Close';
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            isModalOpen = false;
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Calculator content
        const calculatorContent = document.createElement('div');
        calculatorContent.id = 'calculatorContent';

        modalContent.appendChild(header);
        modalContent.appendChild(calculatorContent);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                isModalOpen = false;
            }
        };

        calculatorModal = modal;
        return modal;
    }

    // Generate calculator HTML with improved UI
    function generateCalculatorHTML(stats) {
        return `
            <div class="calc-section" style="margin-bottom: 24px;">
                <div class="calc-input-wrapper" style="max-width: 250px;">
                    <label for="calcCharacterClass">Character Class</label>
                    <select id="calcCharacterClass" class="calc-class-select">
                        <option value="Spellblade" ${stats.characterClass === 'Spellblade' ? 'selected' : ''}>Spellblade</option>
                        <option value="Assassin" ${stats.characterClass === 'Assassin' ? 'selected' : ''}>Assassin</option>
                        <option value="Sniper" ${stats.characterClass === 'Sniper' ? 'selected' : ''}>Sniper</option>
                        <option value="Archemage" ${stats.characterClass === 'Archemage' ? 'selected' : ''}>Archemage</option>
                        <option value="Berserker" ${stats.characterClass === 'Berserker' ? 'selected' : ''}>Berserker</option>
                        <option value="Guardian" ${stats.characterClass === 'Guardian' ? 'selected' : ''}>Guardian</option>
                    </select>
                </div>
            </div>

            <div class="calc-section">
                <h2>⚔️ Character Stats</h2>
                <div class="calc-input-group">
                    <div class="calc-input-wrapper">
                        <label for="calcAttackPower">Attack Power</label>
                        <input type="number" id="calcAttackPower" value="${stats.attackPower || 0}" step="0.001">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcDefense">Defense</label>
                        <input type="number" id="calcDefense" value="${stats.defense || 0}" step="0.001">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcDefensePen">Defense Penetration (%)</label>
                        <input type="number" id="calcDefensePen" value="${stats.defensePen || 0}" step="0.01">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcCritChance">Critical Chance (%)</label>
                        <input type="number" id="calcCritChance" value="${stats.critChance || 0}" step="0.01">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcCritDamage">Critical Damage (multiplier)</label>
                        <input type="number" id="calcCritDamage" value="${stats.critDamage || 0}" step="0.01">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcDodgeChance">Dodge Chance (%)</label>
                        <input type="number" id="calcDodgeChance" value="${stats.dodgeChance || 0}" step="0.01">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcResourceEff">Resource Efficiency (%)</label>
                        <input type="number" id="calcResourceEff" value="${stats.resourceEff || 0}" step="0.01">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnergy">Energy</label>
                        <input type="number" id="calcEnergy" value="${stats.energy || 0}" step="1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcAttackSpeed">Attack Speed</label>
                        <input type="number" id="calcAttackSpeed" value="${stats.attackSpeed || 0}" step="0.01">
                    </div>
                </div>
            </div>

            <div class="calc-section">
                <h2>⚡ Recovery Stats</h2>
                <div class="calc-input-group">
                    <div class="calc-input-wrapper">
                        <label for="calcEnergyOnHit">Energy on Hit</label>
                        <input type="number" id="calcEnergyOnHit" value="${stats.energyOnHit || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnergyOnCrit">Energy on Crit</label>
                        <input type="number" id="calcEnergyOnCrit" value="${stats.energyOnCrit || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnergyOnBlock">Energy on Block</label>
                        <input type="number" id="calcEnergyOnBlock" value="${stats.energyOnBlock || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnergyOnDodge">Energy on Dodge</label>
                        <input type="number" id="calcEnergyOnDodge" value="${stats.energyOnDodge || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcHealthOnHit">Health on Hit</label>
                        <input type="number" id="calcHealthOnHit" value="${stats.healthOnHit || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcHealthOnCrit">Health on Crit</label>
                        <input type="number" id="calcHealthOnCrit" value="${stats.healthOnCrit || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcHealthOnBlock">Health on Block</label>
                        <input type="number" id="calcHealthOnBlock" value="${stats.healthOnBlock || 0}" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcHealthOnDodge">Health on Dodge</label>
                        <input type="number" id="calcHealthOnDodge" value="${stats.healthOnDodge || 0}" step="0.1">
                    </div>
                </div>
            </div>

            <div class="calc-section">
                <h2>👹 Enemy Stats</h2>
                <div class="calc-enemy-selector">
                    <div class="calc-enemy-selector-row">
                        <label for="calcEnemyType">Type:</label>
                        <select id="calcEnemyType" class="calc-enemy-select">
                            <option value="enemy">Enemy</option>
                            <option value="boss">Boss</option>
                        </select>
                    </div>
                    <div class="calc-enemy-selector-row" style="margin-top: 12px;">
                        <label for="calcEnemySelector">Select:</label>
                        <select id="calcEnemySelector" class="calc-enemy-select">
                            <option value="">-- Select an enemy/boss --</option>
                        </select>
                    </div>
                </div>
                <div class="calc-input-group">
                    <div class="calc-input-wrapper">
                        <label for="calcEnemyDefense">Enemy Defense</label>
                        <input type="number" id="calcEnemyDefense" value="0" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnemyPenetration">Enemy Penetration</label>
                        <input type="number" id="calcEnemyPenetration" value="0" step="0.1">
                    </div>
                    <div class="calc-input-wrapper">
                        <label for="calcEnemyAttack">Enemy Attack</label>
                        <input type="number" id="calcEnemyAttack" value="0" step="0.1">
                    </div>
                </div>
            </div>

            <div class="calc-section">
                <h2>💥 Final Damage</h2>
                <div class="calc-result-box highlight">
                    <span class="calc-result-label">Damage Per Second (DPS)</span>
                    <span class="calc-result-value" id="calcDPS">0</span>
                </div>
                <div class="calc-result-box">
                    <span class="calc-result-label">Damage Per Attack</span>
                    <span class="calc-result-value" id="calcDPA">0</span>
                </div>
                <div class="calc-result-box">
                    <span class="calc-result-label">Base Damage</span>
                    <span class="calc-result-value" id="calcBaseDamage">0</span>
                </div>
                <div class="calc-result-box">
                    <span class="calc-result-label">Empowered Up Time</span>
                    <span class="calc-result-value" id="calcEmpoweredUpTime">0</span>
                </div>
            </div>
        `;
    }

    // Calculator functions
    function getCalcStats() {
        return {
            characterClass: document.getElementById('calcCharacterClass')?.value || 'Spellblade',
            attackPower: parseFloat(document.getElementById('calcAttackPower')?.value) || 0,
            defense: parseFloat(document.getElementById('calcDefense')?.value) || 0,
            defensePen: parseFloat(document.getElementById('calcDefensePen')?.value) / 100 || 0,
            critChance: parseFloat(document.getElementById('calcCritChance')?.value) / 100 || 0,
            critDamage: parseFloat(document.getElementById('calcCritDamage')?.value) || 0,
            dodgeChance: parseFloat(document.getElementById('calcDodgeChance')?.value) / 100 || 0,
            resourceEff: parseFloat(document.getElementById('calcResourceEff')?.value) / 100 || 0,
            energyOnHit: parseFloat(document.getElementById('calcEnergyOnHit')?.value) || 0,
            energyOnCrit: parseFloat(document.getElementById('calcEnergyOnCrit')?.value) || 0,
            energyOnBlock: parseFloat(document.getElementById('calcEnergyOnBlock')?.value) || 0,
            energyOnDodge: parseFloat(document.getElementById('calcEnergyOnDodge')?.value) || 0,
            healthOnHit: parseFloat(document.getElementById('calcHealthOnHit')?.value) || 0,
            healthOnCrit: parseFloat(document.getElementById('calcHealthOnCrit')?.value) || 0,
            healthOnBlock: parseFloat(document.getElementById('calcHealthOnBlock')?.value) || 0,
            healthOnDodge: parseFloat(document.getElementById('calcHealthOnDodge')?.value) || 0,
            energy: parseFloat(document.getElementById('calcEnergy')?.value) || 0,
            attackSpeed: parseFloat(document.getElementById('calcAttackSpeed')?.value) || 0,
            enemyDefense: parseFloat(document.getElementById('calcEnemyDefense')?.value) || 0,
            enemyPenetration: parseFloat(document.getElementById('calcEnemyPenetration')?.value) || 0,
            enemyAttack: parseFloat(document.getElementById('calcEnemyAttack')?.value) || 0
        };
    }

    function calculateEmpoweredRaw(stats) {
        const classMap = {
            'Assassin': 1.1 * stats.attackPower + (2 * stats.dodgeChance * 100),
            'Sniper': 1.1 * stats.attackPower + (2 * stats.defensePen * 100),
            'Archemage': 1.1 * stats.attackPower + (2 * stats.critDamage * 100),
            'Spellblade': 1.1 * stats.attackPower + (1.5 * stats.resourceEff * 100),
            'Berserker': 1.1 * stats.attackPower + (2 * stats.critChance * 100),
            'Guardian': 1.1 * stats.attackPower + (1 * stats.defense),
            'default': 0
        };
        return classMap[stats.characterClass] || classMap['default'];
    }

    function calculateDPS() {
        const stats = getCalcStats();
        const baseDamage = Math.max(0, stats.attackPower * (1 - (stats.enemyDefense * (1 - stats.defensePen) / 90)));
        const critDamage = baseDamage * (1 + stats.critDamage);
        const empoweredCost = Math.max(1, 15 * (1 - stats.resourceEff));
        const empRaw = calculateEmpoweredRaw(stats);
        const empoweredDamage = Math.max(0, empRaw * Math.max(0, 1 - (stats.enemyDefense * Math.max(0, 1 - stats.defensePen) / 90)));

        // Calculate energy gained per second (including crit bonus)
        // Energy on Hit + (Crit Chance * Energy on Crit) per attack
        const energyPerAttack = stats.energyOnHit + (stats.critChance * stats.energyOnCrit);
        const energyGainedPerSec = energyPerAttack * stats.attackSpeed;
        const energyUsedPerSec = empoweredCost * stats.attackSpeed;
        const empoweredUpTime = energyUsedPerSec === 0 ? 0 : Math.min(1, energyGainedPerSec / energyUsedPerSec);

        const expectedNormalAttack = baseDamage * (1 + (stats.critChance * stats.critDamage));
        const expectedCritEmpoweredAttack = empoweredDamage * (1 + (stats.critChance * stats.critDamage));

        const damagePerAttack = (1 - empoweredUpTime) * expectedNormalAttack + empoweredUpTime * expectedCritEmpoweredAttack;
        const damagePerSecond = damagePerAttack * stats.attackSpeed;

        // Update UI
        const dpsEl = document.getElementById('calcDPS');
        const dpaEl = document.getElementById('calcDPA');
        const baseEl = document.getElementById('calcBaseDamage');
        const uptimeEl = document.getElementById('calcEmpoweredUpTime');

        if (dpsEl) dpsEl.textContent = damagePerSecond.toFixed(7);
        if (dpaEl) dpaEl.textContent = damagePerAttack.toFixed(7);
        if (baseEl) baseEl.textContent = baseDamage.toFixed(4);
        if (uptimeEl) uptimeEl.textContent = empoweredUpTime.toFixed(7);
    }

    // Update enemy list
    function updateEnemyList() {
        const type = document.getElementById('calcEnemyType')?.value;
        const selector = document.getElementById('calcEnemySelector');
        if (!selector) return;

        const enemies = enemyDatabase[type] || [];
        selector.innerHTML = '<option value="">-- Select an enemy/boss --</option>';

        if (type === 'boss') {
            const sortedBosses = [...enemies].sort((a, b) => a.level - b.level);
            sortedBosses.forEach(boss => {
                const option = document.createElement('option');
                option.value = boss.name;
                option.textContent = `Lv.${boss.level} ${boss.name}`;
                option.dataset.level = boss.level;
                selector.appendChild(option);
            });
        } else {
            const grouped = {};
            enemies.forEach(enemy => {
                const rangeStart = Math.floor(enemy.level / 10) * 10;
                const rangeEnd = rangeStart + 10;
                const rangeKey = `${rangeStart}-${rangeEnd}`;
                if (!grouped[rangeKey]) grouped[rangeKey] = [];
                grouped[rangeKey].push(enemy);
            });

            Object.keys(grouped).sort((a, b) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0])).forEach(range => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `Level ${range}`;
                grouped[range].sort((a, b) => a.level - b.level).forEach(enemy => {
                    const option = document.createElement('option');
                    option.value = enemy.name;
                    option.textContent = `Lv.${enemy.level} ${enemy.name}`;
                    option.dataset.level = enemy.level;
                    optgroup.appendChild(option);
                });
                selector.appendChild(optgroup);
            });
        }
    }

    function applyEnemyStats() {
        const type = document.getElementById('calcEnemyType')?.value;
        const selector = document.getElementById('calcEnemySelector');
        if (!selector) return;

        const selectedOption = selector.options[selector.selectedIndex];
        const selectedName = selector.value;
        if (!selectedName) return;

        const enemies = enemyDatabase[type] || [];
        const selectedLevel = parseInt(selectedOption.dataset.level);
        const selectedEnemy = enemies.find(e => e.name === selectedName && e.level === selectedLevel) ||
                             enemies.find(e => e.name === selectedName);

        if (selectedEnemy) {
            const defenseEl = document.getElementById('calcEnemyDefense');
            const penEl = document.getElementById('calcEnemyPenetration');
            const attackEl = document.getElementById('calcEnemyAttack');

            if (defenseEl) defenseEl.value = selectedEnemy.defense;
            if (penEl) penEl.value = selectedEnemy.penetration;
            if (attackEl) attackEl.value = selectedEnemy.attack;

            calculateDPS();
        }
    }

    // Check if on EQUIPS tab
    function isOnEquipsTab() {
        // Check if we're on inventory page
        if (!window.location.href.includes('/inventory') && !window.location.href.includes('/game/inventory')) {
            return false;
        }

        // Look for EQUIPS tab button
        const allButtons = Array.from(document.querySelectorAll('button, [role="tab"], div[role="tab"]'));
        const equipsTabElement = allButtons.find(tab => {
            const text = tab.textContent || tab.innerText || '';
            return text.trim().toUpperCase().includes('EQUIPS');
        });

        if (equipsTabElement) {
            // Check if it's active/selected
            const classes = equipsTabElement.className || '';
            const style = window.getComputedStyle(equipsTabElement);
            const bgColor = style.backgroundColor;
            const isActive = classes.includes('active') ||
                           classes.includes('selected') ||
                           equipsTabElement.getAttribute('aria-selected') === 'true' ||
                           (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent');

            return isActive;
        }

        // If we can't find the tab, assume false (better to show error than extract wrong data)
        return false;
    }

    // Open calculator modal
    function openCalculator() {
        // Check if on EQUIPS tab
        if (!isOnEquipsTab()) {
            alert('⚠️ Please switch to the EQUIPS tab in the Inventory page to extract your character stats.\n\nGo to: Inventory → EQUIPS tab');
            return;
        }

        const stats = extractStatsFromDOM();
        if (!stats) {
            alert('⚠️ Could not extract stats from page.\n\nPlease make sure you are:\n1. On the Inventory page\n2. On the EQUIPS tab (not INVENTORY, BANK, or PETS)');
            return;
        }

        const modal = createCalculatorModal();
        const content = document.getElementById('calculatorContent');
        content.innerHTML = generateCalculatorHTML(stats);

        // Attach event listeners
        setTimeout(() => {
            const inputs = content.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('input', calculateDPS);
                input.addEventListener('change', calculateDPS);
            });

            const enemyType = document.getElementById('calcEnemyType');
            const enemySelector = document.getElementById('calcEnemySelector');

            if (enemyType) {
                enemyType.addEventListener('change', () => {
                    updateEnemyList();
                    calculateDPS();
                });
            }

            if (enemySelector) {
                enemySelector.addEventListener('change', applyEnemyStats);
            }

            updateEnemyList();
            calculateDPS();
        }, 100);

        modal.style.display = 'block';
        isModalOpen = true;
    }

    // Remove any old button (in case it exists)
    function removeOldButton() {
        const oldBtn = document.getElementById('degenStatsCalculatorBtn');
        if (oldBtn) {
            oldBtn.remove();
            console.log('[Degen Stats Calculator] Old button removed');
        }

        // Also check for any button in bottom left
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(btn => {
            const style = window.getComputedStyle(btn);
            if (style.position === 'fixed' &&
                (style.bottom === '20px' || parseFloat(style.bottom) === 20) &&
                (style.left === '20px' || parseFloat(style.left) === 20) &&
                btn.textContent.includes('Stats Calculator')) {
                btn.remove();
                console.log('[Degen Stats Calculator] Found and removed old left button');
            }
        });
    }

    // Create button (exact style from example scripts)
    function createButton() {
        // Remove old button first
        removeOldButton();

        if (document.getElementById('degenStatsCalculatorBtn')) {
            return;
        }

        // Inject CSS (exact style from example scripts)
        const style = document.createElement('style');
        style.textContent = `
            #degenStatsCalculatorBtn {
                position: fixed;
                bottom: 160px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: #161922;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                z-index: 9998;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            #degenStatsCalculatorBtn:hover {
                background: #1E2330;
                transform: scale(1.05);
            }

            #degenStatsCalculatorBtn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);

        // Create toggle button (exact same way as example scripts)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'degenStatsCalculatorBtn';
        toggleBtn.innerHTML = '📊';
        toggleBtn.title = 'Stats Calculator';
        document.body.appendChild(toggleBtn);

        // Add click handler
        toggleBtn.addEventListener('click', openCalculator);
    }

    // Initialize
    function init() {
        if (document.body && document.head) {
            createButton();
        } else {
            setTimeout(init, 100);
        }
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Degen Stats Calculator] Script loaded');
})();
