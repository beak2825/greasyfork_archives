// ==UserScript==
// @name         Torn - NPC alert tags by srsbsns (Enhanced with Profit Tiers)
// @namespace    http://torn.com/
// @version      2.3
// @description  NPC price on market items with smart filtering, dropdown support, and customizable 3-tier profit highlighting
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @match        *://www.torn.com/imarket.php*
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560894/Torn%20-%20NPC%20alert%20tags%20by%20srsbsns%20%28Enhanced%20with%20Profit%20Tiers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560894/Torn%20-%20NPC%20alert%20tags%20by%20srsbsns%20%28Enhanced%20with%20Profit%20Tiers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const S_KEY = 'torn_arbiter_api_key';
    const S_CAT = 'torn_arbiter_catalog';
    const S_SETTINGS = 'torn_npc_profit_settings';

    // Configuration: Only show tags when market price is within this percentage of NPC price
    const RELEVANCE_THRESHOLD = 0.20; // 20% - adjust this value if needed

    // Default settings for 3-tier profit highlighting
    let profitSettings = JSON.parse(localStorage.getItem(S_SETTINGS)) || {
        tier1: 100,   tier1Enabled: true,  tier1Color: '#ffff00', tier1Glow: true,
        tier2: 500,   tier2Enabled: true,  tier2Color: '#ff8c00', tier2Glow: true,
        tier3: 1000,  tier3Enabled: true,  tier3Color: '#ff0000', tier3Glow: true
    };

    GM_addStyle(`
        /* Dynamic animations for each tier */
        @keyframes neonPulseTier1 {
            0% { box-shadow: 0 0 5px var(--tier1-color); border-color: var(--tier1-color); background: rgba(0, 0, 0, 0.7); }
            50% { box-shadow: 0 0 20px var(--tier1-color); border-color: #fff; background: rgba(0, 0, 0, 0.9); }
            100% { box-shadow: 0 0 5px var(--tier1-color); border-color: var(--tier1-color); background: rgba(0, 0, 0, 0.7); }
        }

        @keyframes neonPulseTier2 {
            0% { box-shadow: 0 0 5px var(--tier2-color); border-color: var(--tier2-color); background: rgba(0, 0, 0, 0.7); }
            50% { box-shadow: 0 0 20px var(--tier2-color); border-color: #fff; background: rgba(0, 0, 0, 0.9); }
            100% { box-shadow: 0 0 5px var(--tier2-color); border-color: var(--tier2-color); background: rgba(0, 0, 0, 0.7); }
        }

        @keyframes neonPulseTier3 {
            0% { box-shadow: 0 0 5px var(--tier3-color); border-color: var(--tier3-color); background: rgba(0, 0, 0, 0.7); }
            50% { box-shadow: 0 0 30px var(--tier3-color); border-color: #fff; background: rgba(0, 0, 0, 0.9); }
            100% { box-shadow: 0 0 5px var(--tier3-color); border-color: var(--tier3-color); background: rgba(0, 0, 0, 0.7); }
        }

        .npc-tag {
            background: rgba(0, 0, 0, 0.85) !important;
            color: #76c776 !important;
            font-size: 10px !important;
            padding: 1px 4px !important;
            border-radius: 2px !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            z-index: 100 !important;
            border: 1px solid rgba(118, 199, 118, 0.5) !important;
            pointer-events: none !important;
        }

        /* Tier-specific styles */
        .profit-tier1 .npc-tag {
            color: var(--tier1-color) !important;
            animation: neonPulseTier1 1.2s infinite ease-in-out !important;
            font-weight: bold !important;
            border: 1px solid #fff !important;
        }

        .profit-tier1.no-glow .npc-tag {
            animation: none !important;
            box-shadow: none !important;
            border: 1px solid var(--tier1-color) !important;
        }

        .profit-tier2 .npc-tag {
            color: var(--tier2-color) !important;
            animation: neonPulseTier2 1.0s infinite ease-in-out !important;
            font-weight: bold !important;
            border: 1px solid #fff !important;
        }

        .profit-tier2.no-glow .npc-tag {
            animation: none !important;
            box-shadow: none !important;
            border: 1px solid var(--tier2-color) !important;
        }

        .profit-tier3 .npc-tag {
            color: var(--tier3-color) !important;
            animation: neonPulseTier3 0.8s infinite ease-in-out !important;
            font-weight: bold !important;
            border: 1px solid #fff !important;
            font-size: 11px !important;
        }

        .profit-tier3.no-glow .npc-tag {
            animation: none !important;
            box-shadow: none !important;
            border: 1px solid var(--tier3-color) !important;
        }

        /* Styles for dropdown menu tags */
        .dropdown-npc-tag {
            background: rgba(0, 0, 0, 0.85) !important;
            color: #76c776 !important;
            font-size: 9px !important;
            padding: 1px 3px !important;
            border-radius: 2px !important;
            position: absolute !important;
            right: 10px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            border: 1px solid rgba(118, 199, 118, 0.5) !important;
            z-index: 999999 !important;
            pointer-events: none !important;
        }

        /* Settings Menu Styles */
        #npc-profit-menu {
            position: fixed;
            bottom: 65px;
            left: 20px;
            z-index: 999999;
            background: #222;
            color: #ccc;
            border: 1px solid #444;
            border-radius: 5px;
            font-family: Tahoma, Arial, sans-serif;
            width: 200px;
            box-shadow: 0 0 10px #000;
        }

        #npc-menu-header {
            padding: 6px;
            cursor: pointer;
            background: #333;
            border-radius: 5px 5px 0 0;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
            color: #fff;
        }

        #npc-menu-content {
            display: none;
            padding: 10px;
            border-top: 1px solid #444;
            max-height: 400px;
            overflow-y: auto;
        }

        #npc-menu-content::-webkit-scrollbar {
            width: 6px;
        }

        #npc-menu-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;
        }

        .npc-tier-section {
            background: #2a2a2a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
        }

        .npc-tier-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px solid #444;
        }

        .npc-tier-title {
            font-weight: bold;
            font-size: 10px;
            color: #fff;
            flex: 1;
        }

        .npc-setting-row {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 9px;
        }

        .npc-setting-label {
            color: #aaa;
            width: 50px;
            flex-shrink: 0;
            font-size: 9px;
        }

        .npc-setting-row input[type="number"] {
            width: 45px;
            background: #000;
            color: #fff;
            border: 1px solid #555;
            text-align: center;
            border-radius: 2px;
            font-size: 9px;
            padding: 2px;
        }

        .npc-setting-row input[type="color"] {
            width: 40px;
            height: 22px;
            background: #000;
            border: 1px solid #555;
            border-radius: 2px;
            cursor: pointer;
            padding: 1px;
        }

        #npc-save-btn {
            width: 100%;
            cursor: pointer;
            background: #76c776;
            color: #000;
            border: none;
            padding: 8px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 6px;
        }

        #npc-save-btn:hover {
            background: #8ed68e;
        }
    `);

    let isRunning = false;

    /**
     * Determines if an NPC tag should be shown based on price relevance
     */
    function shouldShowTag(marketPrice, npcPrice) {
        if (marketPrice <= 1 || npcPrice <= 1) return false;
        const ratio = marketPrice / npcPrice;
        const lowerBound = 1 - RELEVANCE_THRESHOLD;
        const upperBound = 1 + RELEVANCE_THRESHOLD;
        return ratio >= lowerBound && ratio <= upperBound;
    }

    /**
     * Handles dropdown menus (like armor/weapon selectors)
     */
    function tagDropdownItems() {
        const catalog = JSON.parse(GM_getValue(S_CAT, '{}'));
        if (Object.keys(catalog).length === 0) return;

        const dropdowns = document.querySelectorAll('select, .dropdown-menu, [class*="dropdown"], [class*="select"]');

        dropdowns.forEach(dropdown => {
            const options = dropdown.querySelectorAll('option, li, [role="option"]');

            options.forEach(option => {
                if (option.querySelector('.dropdown-npc-tag')) return;

                const text = option.innerText || option.textContent;
                if (!text) return;

                const name = text.trim().toLowerCase().replace(/ x\d+$/, '').replace(/^stock /, '');

                if (catalog[name]) {
                    const npcPrice = catalog[name];
                    option.style.position = 'relative';

                    const tag = document.createElement('span');
                    tag.className = 'dropdown-npc-tag';
                    tag.innerText = `NPC: $${npcPrice.toLocaleString()}`;
                    option.appendChild(tag);
                }
            });
        });
    }

    /**
     * Determines profit tier based on amount
     */
    function getProfitTier(profitAmount) {
        if (profitSettings.tier3Enabled && profitAmount >= profitSettings.tier3) {
            return { tier: 3, color: profitSettings.tier3Color, glow: profitSettings.tier3Glow };
        }
        if (profitSettings.tier2Enabled && profitAmount >= profitSettings.tier2) {
            return { tier: 2, color: profitSettings.tier2Color, glow: profitSettings.tier2Glow };
        }
        if (profitSettings.tier1Enabled && profitAmount >= profitSettings.tier1) {
            return { tier: 1, color: profitSettings.tier1Color, glow: profitSettings.tier1Glow };
        }
        return null;
    }

    function runNpcLogic() {
        const url = window.location.href;

        if (url.includes('bazaar.php#/add') || url.includes('bazaar.php#/manage')) {
            document.querySelectorAll('.npc-tag').forEach(tag => tag.remove());
            return;
        }

        if (isRunning) return;
        isRunning = true;

        const catalog = JSON.parse(GM_getValue(S_CAT, '{}'));
        if (Object.keys(catalog).length === 0) {
            isRunning = false;
            return;
        }

        // Set CSS variables for tier colors
        document.documentElement.style.setProperty('--tier1-color', profitSettings.tier1Color);
        document.documentElement.style.setProperty('--tier2-color', profitSettings.tier2Color);
        document.documentElement.style.setProperty('--tier3-color', profitSettings.tier3Color);

        const isBazaar = url.includes('bazaar.php');
        const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"], .market-main-wrap .row');

        items.forEach(item => {
            if (item.closest('#search-container, .search-results, .search-dropdown, #header-root')) return;

            const text = item.innerText;
            if (!text) return;

            const lines = text.split('\n').map(l => l.trim().toLowerCase());

            let foundMatch = false;
            for (let i = 0; i < Math.min(lines.length, 5); i++) {
                let name = lines[i].replace(/ x\d+$/, '').replace(/^stock /, '');

                if (catalog[name]) {
                    const floor = catalog[name];
                    foundMatch = true;

                    let unitPrice = null;
                    for (let j = 0; j < lines.length; j++) {
                        if (lines[j].includes('$') && !lines[j].includes('total') && !lines[j].includes('npc')) {
                            const match = lines[j].replace(/,/g, '').match(/\$([\d]+)/);
                            if (match) {
                                unitPrice = parseInt(match[1]);
                                break;
                            }
                        }
                    }

                    if (unitPrice !== null) {
                        const isProfit = (unitPrice > 1 && unitPrice < floor);
                        const profitAmount = floor - unitPrice;
                        const isRelevant = shouldShowTag(unitPrice, floor);

                        // Remove all tier classes first
                        item.classList.remove('profit-tier1', 'profit-tier2', 'profit-tier3', 'no-glow');

                        if (isProfit || isRelevant) {
                            let tag = item.querySelector('.npc-tag');
                            if (!tag) {
                                tag = document.createElement('div');
                                tag.className = 'npc-tag';
                                item.style.position = 'relative';
                                item.appendChild(tag);
                            }

                            if (isProfit) {
                                tag.innerText = `NPC Profit: $${profitAmount.toLocaleString()}`;

                                // Apply tier-based styling
                                const tierInfo = getProfitTier(profitAmount);
                                if (tierInfo) {
                                    item.classList.add(`profit-tier${tierInfo.tier}`);
                                    // Add no-glow class if glow is disabled
                                    if (!tierInfo.glow) {
                                        item.classList.add('no-glow');
                                    } else {
                                        item.classList.remove('no-glow');
                                    }
                                }
                            } else {
                                tag.innerText = `NPC: $${floor.toLocaleString()}`;
                            }
                        } else {
                            const existingTag = item.querySelector('.npc-tag');
                            if (existingTag) existingTag.remove();
                        }
                    }
                    break;
                }
            }
            if (!foundMatch) {
                const existingTag = item.querySelector('.npc-tag');
                if (existingTag) existingTag.remove();
                item.classList.remove('profit-tier1', 'profit-tier2', 'profit-tier3', 'no-glow');
            }
        });

        tagDropdownItems();

        setTimeout(() => { isRunning = false; }, 400);
    }

    async function fetchCatalog() {
        const key = GM_getValue(S_KEY, '');
        if (!key) return;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/torn/?selections=items&key=${key}`,
            onload: (res) => {
                const data = JSON.parse(res.responseText);
                if (data.items) {
                    const catalog = {};
                    for (const id in data.items) {
                        catalog[data.items[id].name.toLowerCase()] = data.items[id].sell_price;
                    }
                    GM_setValue(S_CAT, JSON.stringify(catalog));
                    runNpcLogic();
                }
            }
        });
    }

    // Create settings menu
    const menu = document.createElement('div');
    menu.id = 'npc-profit-menu';
    menu.innerHTML = `
        <div id="npc-menu-header">💰 NPC Profit Tiers</div>
        <div id="npc-menu-content">
            <div class="npc-tier-section">
                <div class="npc-tier-header">
                    <input type="checkbox" id="npc-check-tier3" ${profitSettings.tier3Enabled ? 'checked' : ''}>
                    <span class="npc-tier-title">Tier 3 (High)</span>
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Min $:</span>
                    <input type="number" id="npc-tier3-amount" value="${profitSettings.tier3}" min="1" step="100">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Color:</span>
                    <input type="color" id="npc-tier3-color" value="${profitSettings.tier3Color}">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Glow:</span>
                    <input type="checkbox" id="npc-tier3-glow" ${profitSettings.tier3Glow ? 'checked' : ''}>
                </div>
            </div>

            <div class="npc-tier-section">
                <div class="npc-tier-header">
                    <input type="checkbox" id="npc-check-tier2" ${profitSettings.tier2Enabled ? 'checked' : ''}>
                    <span class="npc-tier-title">Tier 2 (Mid)</span>
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Min $:</span>
                    <input type="number" id="npc-tier2-amount" value="${profitSettings.tier2}" min="1" step="100">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Color:</span>
                    <input type="color" id="npc-tier2-color" value="${profitSettings.tier2Color}">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Glow:</span>
                    <input type="checkbox" id="npc-tier2-glow" ${profitSettings.tier2Glow ? 'checked' : ''}>
                </div>
            </div>

            <div class="npc-tier-section">
                <div class="npc-tier-header">
                    <input type="checkbox" id="npc-check-tier1" ${profitSettings.tier1Enabled ? 'checked' : ''}>
                    <span class="npc-tier-title">Tier 1 (Low)</span>
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Min $:</span>
                    <input type="number" id="npc-tier1-amount" value="${profitSettings.tier1}" min="1" step="10">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Color:</span>
                    <input type="color" id="npc-tier1-color" value="${profitSettings.tier1Color}">
                </div>
                <div class="npc-setting-row">
                    <span class="npc-setting-label">Glow:</span>
                    <input type="checkbox" id="npc-tier1-glow" ${profitSettings.tier1Glow ? 'checked' : ''}>
                </div>
            </div>

            <button id="npc-save-btn">Save & Apply</button>
        </div>
    `;
    document.body.appendChild(menu);

    // Event listeners
    document.getElementById('npc-menu-header').onclick = () => {
        const content = document.getElementById('npc-menu-content');
        content.style.display = (content.style.display === 'block') ? 'none' : 'block';
    };

    document.getElementById('npc-save-btn').onclick = () => {
        profitSettings.tier1Enabled = document.getElementById('npc-check-tier1').checked;
        profitSettings.tier2Enabled = document.getElementById('npc-check-tier2').checked;
        profitSettings.tier3Enabled = document.getElementById('npc-check-tier3').checked;

        profitSettings.tier1 = parseInt(document.getElementById('npc-tier1-amount').value);
        profitSettings.tier2 = parseInt(document.getElementById('npc-tier2-amount').value);
        profitSettings.tier3 = parseInt(document.getElementById('npc-tier3-amount').value);

        profitSettings.tier1Color = document.getElementById('npc-tier1-color').value;
        profitSettings.tier2Color = document.getElementById('npc-tier2-color').value;
        profitSettings.tier3Color = document.getElementById('npc-tier3-color').value;

        profitSettings.tier1Glow = document.getElementById('npc-tier1-glow').checked;
        profitSettings.tier2Glow = document.getElementById('npc-tier2-glow').checked;
        profitSettings.tier3Glow = document.getElementById('npc-tier3-glow').checked;

        localStorage.setItem(S_SETTINGS, JSON.stringify(profitSettings));

        // Immediate visual update
        runNpcLogic();
    };

    if (!GM_getValue(S_KEY)) {
        const key = prompt('Enter API Key for NPC Tags:');
        if (key) { GM_setValue(S_KEY, key.trim()); fetchCatalog(); }
    }

    const observer = new MutationObserver(runNpcLogic);
    observer.observe(document.body, { childList: true, subtree: true });

    fetchCatalog();
    runNpcLogic();
})();