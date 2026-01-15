// ==UserScript==
// @name         JIGS (Jigglymoose's Intelligent Gear Simulator)
// @namespace    http://tampermonkey.net/
// @version      30.172
// @description  Automates running multiple simulations on the MWI Combat Simulator with a dynamic, grouped UI and cost-analysis.
// @author       Gemini & Jigglymoose
// @license      MIT
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @match        https://shykai.github.io/MWICombatSimulator/dist/
// @connect      gist.githubusercontent.com
// @connect      www.milkywayidle.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/550346/JIGS%20%28Jigglymoose%27s%20Intelligent%20Gear%20Simulator%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550346/JIGS%20%28Jigglymoose%27s%20Intelligent%20Gear%20Simulator%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- JIGS-ENVIRONMENT-CHECK ---
        const jigsAllowedUrls = ["https://shykai.github.io/MWICombatSimulatorTest/dist/", "https://shykai.github.io/MWICombatSimulator/dist/"];
        if (!jigsAllowedUrls.some(url => window.location.href.startsWith(url))) {alert("JIGS (Jigglymoose's Intelligent Gear Simulator):\n\nThis script is running on the WRONG PAGE.\n\nJIGS is built for the 'shykai' combat simulator, not the main MWI game. Please delete this script for the main game in Steam.  Please reference the installation instructions here -> https://rentry.co/jigs-complete-insturctions");
        return; // Exit script
    }

    // --- END-CHECK ---

    console.log("JIGS (Jigglymoose's Intelligent Gear Simulator) v30.173 Loaded");

    // --- CONFIGURATION ---
    const MARKET_API_URL = 'https://www.milkywayidle.com/game_data/marketplace.json';
    const JIGS_DATA_URL = 'https://gist.githubusercontent.com/JigglyMoose/79db9d275a73a26dec30305865692525/raw/jigs_data.json';

    // --- DATA VARIABLES ---
    let HOUSE_RECIPES = {};
    let ITEM_ID_TO_NAME_MAP = {};
    let SPELL_BOOK_XP = {};
    let SIMULATOR_TO_MARKET_MAP = {};
    let ABILITY_XP_LEVELS = [];
    let baselineDps = 0;
    let baselineProfit = 0;
    let baselineExp = 0;
    let baselineEph = 0;
    let baselineDph = 0;
    let baselineSkillXpRates = {};
    let baselineRunTime = 0;
    let marketData = null;
    let isBatchRunning = false;
    let detailedResults = [];
    let simulationQueue = [];
    let jigsNameToPageElementMap = new Map();
    const skillKeywords = ["Stamina", "Intelligence", "Attack", "Melee", "Defense", "Ranged", "Magic"];
    const equipmentKeywords = ["Head", "Necklace", "Earrings", "Body", "Legs", "Feet", "Hands", "Ring", "Main Hand", "Off Hand", "Pouch", "Back", "Charm"];
    const specialIdMap = { 'Zone': 'selectZone', 'Difficulty': 'selectDifficulty', 'Duration': 'inputSimulationTime' };
    let houseKeywords = [];

    // --- 1. UI & STYLES ---
    const controlsPanel = document.createElement('div');
    controlsPanel.id = 'batch-panel';
controlsPanel.innerHTML = `
        <div id="batch-header" title="Jigglymoose's Intelligent Gear Simulator">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>JIGS</span>
                <a id="jigs-kofi-button" href="https://ko-fi.com/jigglymoose" target="_blank" title="Help keep JIGS updated!  Fuel the Moose with a coffee.">☕</a>
            </div>
            <div id="jigs-header-buttons">
                <button id="reset-panels-button" title="Reset Panel Positions">⟲</button>
                <button id="batch-toggle">-</button>
            </div>
        </div>
        <div id="batch-content">
            <div id="controls-grid">
                <button id="capture-setup-button" disabled>Manual Capture</button>
                <div id="import-triggers-wrapper">
                    <input type="checkbox" id="import-triggers-checkbox" title="Check this to include trigger import during baseline update.">
                    <label for="import-triggers-checkbox">Import Triggers</label>
                </div>
                <button id="update-baseline-button" disabled>Update Baseline</button>
                <div id="baseline-container">
                    <label for="baseline-dps-input">Baseline DPS</label><input type="text" id="baseline-dps-input" value="0">
                    <label for="baseline-profit-input">Profit/Day</label><input type="text" id="baseline-profit-input" value="0">
                    <label for="baseline-exp-input">Exp/Hour</label><input type="text" id="baseline-exp-input" value="0">
                    <label for="baseline-eph-input">EPH</label><input type="text" id="baseline-eph-input" value="0">
                    <label for="baseline-dph-input">DPH</label><input type="text" id="baseline-dph-input" value="0">
                </div>
                <div id="jigs-baseline-results-display" style="grid-column: 1 / -1; border: 1px solid #555; padding: 5px; margin-top: 5px; display: none !important;">
    <strong>Baseline:</strong>
    <table id="base-results-table" style="width: 100%; font-size: 0.9em; margin-top: 5px;">
        <tr>
            <td>DPS:</td><td id="base-dps" style="text-align: right;">N/A</td>
            <td>Profit/Day:</td><td id="base-profit" style="text-align: right;">N/A</td>
            <td>Exp/Hr:</td><td id="base-exp" style="text-align: right;">N/A</td>
            <td>EPH:</td><td id="base-eph" style="text-align: right;">N/A</td>
            <td>DPH:</td><td id="base-dph" style="text-align: right;">N/A</td>
        </tr>
    </table>
</div>
                <button id="run-batch-button" disabled>Run Queue</button>
                <div id="queue-actions-group">
                    <button id="add-to-queue-button" disabled>Add to Queue</button>
                    <button id="reset-button" disabled>Reset Inputs</button>
                </div>
                <button id="stop-batch-button" style="display: none;">Stop</button>
            </div>
            <div id="batch-status">Status: Loading game data...</div>
            <div id="jigs-progress-container" style="display: none;">
                <div id="jigs-progress-bar"></div>
            </div>
            <div id="batch-inputs-container">
                 <div id="jigs-player-select-container"></div>
                <details id="sim-settings-group" open><summary>Simulation Settings</summary></details>
                <details id="skills-group" open><summary>Skills</summary></details>
                <details id="equipment-group" open><summary>Equipment</summary></details>
                <details id="abilities-group" open><summary>Abilities</summary></details>
                <details id="food-drink-group" open><summary>Food & Drink</summary></details>
                <details id="house-group" open><summary>House</summary><div id="house-grid-container"></div></details>
            </div>
        </div>
        <div class="jigs-resizer"></div>
    `;
    document.body.appendChild(controlsPanel);

const resultsPanel = document.createElement('div');
    resultsPanel.id = 'jigs-results-panel';
    resultsPanel.innerHTML = `
        <div id="jigs-results-header">
            <span>Results</span>
            <div style="display: flex; gap: 5px;">
                <button id="reset-panels-button-results" title="Reset Panel Positions">⟲</button>
                <button id="results-toggle">-</button>
            </div>
        </div>
        <div id="jigs-results-content">
             <div id="column-toggle-container">
                  <button id="clear-results-button">Clear Results</button>
                  <div id="column-checkboxes">
                        Show Columns:
                        <label><input type="checkbox" class="column-toggle" data-col="ttp-col" checked> Time to Purchase</label>
                        <label><input type="checkbox" class="column-toggle" data-col="dps-col" checked> DPS</label>
                        <label><input type="checkbox" class="column-toggle" data-col="profit-col" checked> Profit</label>
                        <label><input type="checkbox" class="column-toggle" data-col="exp-col" checked> Experience</label>
                        <label><input type="checkbox" class="column-toggle" data-col="eph-col" checked> EPH</label>
                        <label><input type="checkbox" class="column-toggle" data-col="dph-col" checked> DPH</label>
                  </div>
                  <button id="export-csv-button" disabled>Export to CSV</button>
             </div>
            <div id="batch-results-container">
                <table id="batch-results-table">
                    <thead>
                        <tr>
                            <th class="upgrade-col" data-sort-key="upgrade" title="The specific upgrade being tested">Upgrade</th>
                            <th class="cost-col" data-sort-key="cost" title="The net cost of the upgrade.&#013;Formula: (New Item Buy Price - Old Item Sell Price)">Upgrade Cost</th>
                            <th class="ttp-col" data-sort-key="timeToPurchase" title="Estimated time to afford this upgrade.&#013;Formula: (Upgrade Cost / Baseline Profit Per Day)">Time to Purchase</th>
                            <th class="dps-col" data-sort-key="dpsChange" title="The raw DPS increase from this change.&#013;Formula: New DPS - Baseline DPS">DPS Change</th>
                            <th class="dps-col" data-sort-key="percentChange" title="The percentage of DPS gained.&#013;Formula: (DPS Change / Baseline DPS) * 100">% DPS Change</th>
                            <th class="dps-col" data-sort-key="costPerDps" title="Gold cost for every 0.01% increase in total DPS. Lower is better!&#013;Formula: (Upgrade Cost / % DPS Change) * 0.01">Gold per 0.01% DPS</th>
                            <th class="profit-col" data-sort-key="profitChange" title="The raw profit increase from this change.&#013;Formula: New Profit - Baseline Profit">Profit Change</th>
                            <th class="profit-col" data-sort-key="percentProfitChange" title="The percentage of profit gained.&#013;Formula: (Profit Change / Baseline Profit) * 100">% Profit Change</th>
                            <th class="profit-col" data-sort-key="costPerProfit" title="Gold cost for every 0.01% increase in total Profit. Lower is better!&#013;Formula: (Upgrade Cost / % Profit Change) * 0.01">Gold per 0.01% Profit</th>
                            <th class="exp-col" data-sort-key="expChange" title="The raw experience per hour increase from this change.&#013;Formula: New Exp/Hr - Baseline Exp/Hr">Exp/Hr Change</th>
                            <th class="exp-col" data-sort-key="percentExpChange" title="The percentage of experience per hour gained.&#013;Formula: (Exp Change / Baseline Exp) * 100">% Exp/Hr Change</th>
                            <th class="exp-col" data-sort-key="costPerExp" title="Gold cost for every 0.01% increase in total Exp/Hr. Lower is better!&#013;Formula: (Upgrade Cost / % Exp Change) * 0.01">Gold per 0.01% Exp/Hr</th>
                            <th class="eph-col" data-sort-key="ephChange" title="The raw EPH increase from this change.&#013;Formula: New EPH - Baseline EPH">EPH Change</th>
                            <th class="eph-col" data-sort-key="percentEphChange" title="The percentage of EPH gained.&#013;Formula: (EPH Change / Baseline EPH) * 100">% EPH Change</th>
                            <th class="eph-col" data-sort-key="costPerEph" title="Gold cost for every 0.01% increase in total EPH. Lower is better!&#013;Formula: (Upgrade Cost / % EPH Change) * 0.01">Gold per 0.01% EPH</th>
                            <th class="dph-col" data-sort-key="dphChange" title="The raw DPH change from this change.&#013;Note: Negative is good!&#013;Formula: New DPH - Baseline DPH">DPH Change</th>
                            <th class="dph-col" data-sort-key="percentDphChange" title="The percentage of DPH changed.&#013;Formula: (DPH Change / Baseline DPH) * 100">% DPH Change</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div class="jigs-resizer"></div>
    `;
    document.body.appendChild(resultsPanel);

const queuePanel = document.createElement('div');
    queuePanel.id = 'jigs-queue-panel';
    queuePanel.innerHTML = `
        <div id="jigs-queue-header">
            <span>Simulation Queue</span>
            <div style="display: flex; gap: 5px;">
                <button id="reset-panels-button-queue" title="Reset Panel Positions">⟲</button>
                <button id="queue-toggle">-</button>
            </div>
        </div>
        <div id="jigs-queue-content">
             <div id="jigs-queue-estimate"></div>
             <div id="jigs-queue-actions">
                <button id="clear-queue-button">Clear Queue</button>
                <label id="infinite-run-label"><input type="checkbox" id="infinite-queue-checkbox"> Infinite</label>
             </div>
             <ul id="jigs-queue-list"></ul>
        </div>
        <div class="jigs-resizer"></div>
    `;
    document.body.appendChild(queuePanel);

    GM_addStyle(`
        #batch-panel { position: fixed; bottom: 10px; right: 10px; width: 600px; max-height: 90vh; background-color: #2c2c2c; border: 1px solid #444; border-radius: 5px; color: #eee; z-index: 9999; font-family: sans-serif; display: flex; flex-direction: column; overflow: hidden; }
        #jigs-results-panel { position: fixed; bottom: 10px; left: 10px; width: 1050px; max-height: 90vh; background-color: #2c2c2c; border: 1px solid #444; border-radius: 5px; color: #eee; z-index: 9998; font-family: sans-serif; display: flex; flex-direction: column; overflow: hidden; }
        #jigs-queue-panel { position: fixed; top: 10px; right: 10px; width: 600px; height: 300px; max-height: 45vh; background-color: #2c2c2c; border: 1px solid #444; border-radius: 5px; color: #eee; z-index: 9997; font-family: sans-serif; display: flex; flex-direction: column; overflow: hidden; }
        #jigs-results-header, #jigs-queue-header { background-color: #333; padding: 8px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; }
        #jigs-results-header span, #jigs-queue-header span { font-weight: bold; }
        #results-toggle, #queue-toggle { background: #555; border: 1px solid #777; color: white; border-radius: 3px; cursor: pointer; margin-left: 5px; }
        #jigs-results-content, #jigs-queue-content { padding: 10px; display: flex; flex-direction: column; overflow-y: auto; }
        #jigs-queue-list { list-style: decimal; padding-left: 20px; margin: 10px 0 0; font-size: 0.9em; }
        #jigs-queue-estimate { text-align: center; font-style: italic; color: #ccc; margin-bottom: 10px; }
        #jigs-queue-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        #infinite-run-label { display: flex; align-items: center; gap: 5px; font-size: 0.9em; cursor: pointer; }
        #clear-queue-button { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
        #batch-header { background-color: #333; padding: 8px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; }
        #batch-header span { font-weight: bold; }
        #jigs-header-buttons { display: flex; gap: 5px; }
        #jigs-kofi-button {
            text-decoration: none;
            font-size: 1.2em;
            color: #FF5E5B; /* Ko-fi Red */
            transition: transform 0.2s;
            cursor: pointer;
            filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        }
        #jigs-kofi-button:hover {
            transform: scale(1.2);
            filter: drop-shadow(0 0 4px #FF5E5B);
        }
        #batch-toggle, #reset-panels-button, #reset-panels-button-results, #reset-panels-button-queue { background: #555; border: 1px solid #777; color: white; border-radius: 3px; cursor: pointer; }
        #batch-content { padding: 10px; display: flex; flex-direction: column; overflow-y: auto; position: relative; }
        .jigs-resizer { position: absolute; width: 12px; height: 12px; right: 0; bottom: 0; cursor: se-resize; }
        #batch-panel.jigs-minimized, #jigs-results-panel.jigs-minimized, #jigs-queue-panel.jigs-minimized { height: auto !important; width: auto !important; bottom: auto !important; left: auto !important; right: 10px !important; }
        #batch-panel.jigs-minimized #batch-content, #jigs-results-panel.jigs-minimized #jigs-results-content, #jigs-queue-panel.jigs-minimized #jigs-queue-content { display: none; }
        #batch-panel.jigs-minimized .jigs-resizer, #jigs-results-panel.jigs-minimized .jigs-resizer, #jigs-queue-panel.jigs-minimized .jigs-resizer { display: none; }
        #batch-panel.jigs-minimized { top: 10px !important; }
        #jigs-results-panel.jigs-minimized { top: 60px !important; }
        #jigs-queue-panel.jigs-minimized { top: 110px !important; }
        #controls-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; gap: 8px; margin-bottom: 10px; }
        #stop-batch-button { background-color: #c9302c; grid-column: 2 / 3; grid-row: 2/3;}
        #controls-grid button { width: 100%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #capture-setup-button { grid-column: 1 / 2; grid-row: 1 / 2; }
        #import-triggers-wrapper { grid-column: 2 / 3; grid-row: 1 / 2; display: flex; align-items: center; justify-content: center; font-size: 0.9em; }
        #update-baseline-button { grid-column: 3 / 4; grid-row: 1 / 2; }
        #baseline-container { grid-column: 1 / 2; grid-row: 2 / 3; display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; align-items: center; font-size: 0.9em; color: #ccc; }
        #baseline-container input { background-color: #1e1e1e; color: #ddd; border: 1px solid #555; width: 100%; box-sizing: border-box; text-align: right; padding: 2px 4px; }
        #jigs-baseline-results-display {
        grid-column: 1 / -1;
        border: 1px solid #555;
        padding: 5px;
        margin-top: 5px;
        display: none !important;}
        #run-batch-button { grid-column: 2 / 3; grid-row: 2 / 3; }
        #queue-actions-group { grid-column: 3 / 4; grid-row: 2 / 3; display: flex; gap: 5px; }
        #queue-actions-group > button { flex: 1; }
        #capture-setup-button { background-color: #337ab7; }
        #update-baseline-button { background-color: #f44336; }
        #run-batch-button { background-color: #4CAF50; }
        #add-to-queue-button { background-color: #6f42c1; }
        #reset-button { background-color: #f0ad4e; }
        #run-batch-button:disabled, #capture-setup-button:disabled, #update-baseline-button:disabled, #export-csv-button:disabled, #reset-button:disabled, #add-to-queue-button:disabled, #import-triggers-checkbox:disabled { cursor: not-allowed; }
        #run-batch-button:disabled, #capture-setup-button:disabled, #update-baseline-button:disabled, #export-csv-button:disabled, #reset-button:disabled, #add-to-queue-button:disabled { background-color: #555; }
        #batch-status { margin-bottom: 5px; font-style: italic; color: #aaa; text-align: center; }
        #jigs-progress-container { width: 100%; background-color: #555; border-radius: 5px; height: 10px; margin-bottom: 10px; border: 1px solid #333; }
        #jigs-progress-bar { width: 0%; height: 100%; background-color: #4CAF50; border-radius: 5px; transition: width 0.1s linear; }
        #batch-inputs-container { display: flex; flex-direction: column; gap: 5px; max-height: 40vh; overflow-y: auto; border: 1px solid #444; padding: 10px; margin-bottom: 10px; }
        #jigs-player-select-container { display: grid; grid-template-columns: 100px 1fr; align-items: center; margin-bottom: 10px; gap: 5px; padding-bottom: 10px; border-bottom: 1px solid #444;}
        summary { font-weight: bold; cursor: pointer; padding: 4px; background-color: #333; margin-bottom: 5px; }
        details { border-left: 1px solid #444; padding-left: 10px; margin-bottom: 5px;}
        .batch-input-row { display: grid; grid-template-columns: 100px 1fr auto; align-items: center; margin-bottom: 5px; gap: 5px; }
        .batch-input-row-equip { display: grid; grid-template-columns: 60px 1fr 80px auto; grid-template-rows: auto auto; align-items: center; margin-bottom: 10px; row-gap: 5px; column-gap: 5px; }
        .batch-input-row-ability { display: grid; grid-template-columns: 60px 1fr 80px auto; align-items: center; margin-bottom: 5px; gap: 5px; }
        .batch-input-row label, .batch-input-row-equip > label, .batch-input-row-ability > label { font-size: 0.9em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; grid-row: 1; }
        .batch-input-row select, .batch-input-row input, .batch-input-row-equip > select, .batch-input-row-equip > input[type=number], .batch-input-row-ability > select, .batch-input-row-ability > input { background-color: #1e1e1e; color: #ddd; border: 1px solid #555; width: 100%; box-sizing: border-box; }
        .price-info-container { grid-column: 2 / 4; grid-row: 2 / 3; display: flex; align-items: center; gap: 10px; }
        .jigs-price-override { width: 90px !important; background-color: #1e1e1e; color: #ddd; border: 1px solid #555; box-sizing: border-box; text-align: right; padding: 2px 4px; }
        .constant-checkbox-container { display: flex; align-items: center; justify-content: center; padding: 0 5px; grid-row: 1; grid-column: 4; }
        .market-indicators { flex-grow: 1; display: flex; flex-wrap: wrap; gap: 4px; }
        .market-dot { background-color: #555; color: #ddd; font-size: 0.8em; padding: 1px 5px; border-radius: 4px; cursor: pointer; border: 1px solid #777; }
        .market-dot:hover { background-color: #777; border-color: #999; }
        .market-dot.selected { border-color: #28a745 !important; border-width: 2px !important; padding: 0px 4px !important; }
        .jigs-modified { border-left: 3px solid #f0ad4e !important; }
        #house-grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .house-grid-item { display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px 8px; }
        .house-grid-item label { grid-column: 1 / -1; font-size: 0.8em; margin-bottom: 4px; height: 2.5em; overflow: hidden; text-align: center; }
        .house-grid-item input { grid-column: 1 / 2; width: 100%; text-align: center; }
        .house-grid-item .constant-checkbox-container { grid-column: 2 / 3; grid-row: 2 / 3; }
        #column-toggle-container { margin: 5px 0 10px 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; }
        #column-checkboxes { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; align-items: center; }
        #clear-results-button, #export-csv-button { padding: 4px 8px; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #export-csv-button { background-color: #5bc0de; }
        #export-csv-button:hover { background-color: #46b8da; }
        #clear-results-button { background-color: #dc3545; }
        #clear-results-button:hover { background-color: #c82333; }
        #batch-results-container { margin-top: 10px; max-height: 80vh; overflow-y: auto; }
        #batch-results-table { width: 100%; border-collapse: collapse; }
        #batch-results-table td.best-upgrade { background-color: #28a745 !important; color: #fff !important; }
        #batch-results-table td.worst-upgrade { background-color: #dc3545 !important; color: #fff !important; }
        #batch-results-table th, #batch-results-table td { border: 1px solid #444; padding: 5px; text-align: left; font-size: 0.9em; }
        #batch-results-table th { background-color: #333; cursor: pointer; position: sticky; top: 0; z-index: 1; }
        #batch-results-table th:hover { background-color: #444; }
        .sorted-asc::after { content: ' ▲'; }
        .sorted-desc::after { content: ' ▼'; }
        .trigger-container { margin-left: 20px; margin-bottom: 10px; padding-top: 5px; border-top: 1px solid #444; }
        .trigger-row, .trigger-range-row { display: grid; grid-template-columns: 60px 1fr 1fr 1fr 1fr; gap: 5px; align-items: center; }
        .trigger-row label { font-size: 0.9em; font-style: italic; }
        .trigger-range-row { margin-top: 5px; grid-template-columns: 60px auto 1fr auto 1fr; }
        .trigger-range-row .jigs-range-label, .trigger-range-row .jigs-increment-label { font-size: 0.8em; font-style: italic; text-align: right; padding-right: 5px; }
        .trigger-row select, .trigger-row input, .trigger-range-row input { background-color: #1e1e1e; color: #ddd; border: 1px solid #555; width: 100%; box-sizing: border-box; }
        #jigs-queue-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .jigs-queue-item-label {
            flex-grow: 1;
            padding-right: 10px;
            word-break: break-all;
        }
        .jigs-remove-queue-item-button {
            background-color: #c9302c;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            padding: 0;
            flex-shrink: 0;
        }
        .jigs-remove-queue-item-button:hover {
            background-color: #dc3545;
        }
    `);

    // --- 3. HELPER FUNCTIONS ---
    const statusDiv = document.getElementById('batch-status');
    const groupContainers = { skills: document.querySelector('#skills-group'), house: document.querySelector('#house-grid-container'), abilities: document.querySelector('#abilities-group'), equipment: document.querySelector('#equipment-group'), food: document.querySelector('#food-drink-group'), sim: document.querySelector('#sim-settings-group'), };

    function exportResultsToCSV() {
        if (detailedResults.length === 0) {
            alert("No results to export!");
            return;
        }

        // Define the columns explicitly to match the user's screenshot headers
        const columns = [
            { header: "Upgrade", key: "upgrade" },
            { header: "Upgrade Cost", key: "cost" },
            { header: "Time to Purchase", key: "timeToPurchase" },
            { header: "DPS Change", key: "dps" },
            { header: "% DPS Change", key: "percent" },
            { header: "Gold per 0.01% DPS", key: "costPerDps" },
            { header: "Profit Change", key: "profitChange" },
            { header: "% Profit Change", key: "percentProfitChange" },
            { header: "Gold per 0.01% Profit", key: "costPerProfit" },
            { header: "Exp/Hr Change", key: "expChange" },
            { header: "% Exp/Hr Change", key: "percentExpChange" },
            { header: "Gold per 0.01% Exp/Hr", key: "costPerExp" },
            { header: "EPH Change", key: "ephChange" },
            { header: "% EPH Change", key: "percentEphChange" },
            { header: "Gold per 0.01% EPH", key: "costPerEph" },
            { header: "DPH Change", key: "dphChange" },
            { header: "% DPH Change", key: "percentDphChange" }
        ];

        // Create Header Row
        const headerRow = columns.map(c => `"${c.header}"`).join(',');

        // Create Data Rows
        const rows = detailedResults.map(result => {
            return columns.map(col => {
                let value = result[col.key];

                if (col.key === 'upgrade') {
                    // Always treat Upgrade Name as a string and prevent it from being cleared by numeric checks
                    if (value === null || value === undefined) value = "";
                } else {
                    // Logic for numeric columns
                    if (value === null || value === undefined || value === "N/A") {
                        value = '';
                    } else if (value === "Free") {
                        value = 0;
                    } else if (typeof value === 'number' && !isFinite(value)) {
                        value = '';
                    }
                }

                const valueStr = String(value);
                if (valueStr.includes(',')) {
                    return `"${valueStr.replace(/"/g, '""')}"`;
                }
                return valueStr;
            }).join(',');
        });

        const csvContent = [headerRow, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.setAttribute("href", url);
        link.setAttribute("download", `jigs_results_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function resetPanelPositions() {
        console.log("JIGS DEBUG: Resetting panel positions to default.");
        const panelIds = ['batch-panel', 'jigs-results-panel', 'jigs-queue-panel'];
        panelIds.forEach(id => {
            GM_deleteValue(`jigs_panel_positions_${id}`);
            const panel = document.getElementById(id);
            if (panel) {
                panel.style.top = '';
                panel.style.left = '';
                panel.style.width = '';
                panel.style.height = '';
                panel.style.bottom = '';
                panel.style.right = '';
            }
        });
        statusDiv.textContent = 'Status: Panel positions reset.';
    }

    const groupAllChanges = (itemChanges, triggerChanges) => {
        const upgrades = [];
        const processed = new Set();
        const nameMap = new Map(itemChanges.map(c => [c.name, c]));
        for (const change of itemChanges) {
            if (processed.has(change.name)) continue;
            let baseName = change.name.replace(' Enhancement', '').replace(' Level', '');
            if (processed.has(baseName)) continue;
            processed.add(baseName);
            const mainChange = nameMap.get(baseName);
            const enhChange = nameMap.get(`${baseName} Enhancement`);
            const lvlChange = nameMap.get(`${baseName} Level`);
            const baseChangeObject = mainChange || enhChange || lvlChange;
            let combinedUpgrade = { ...baseChangeObject,
                name: baseName
            };
            if (mainChange) {
                combinedUpgrade.value = mainChange.value;
                combinedUpgrade.originalValue = mainChange.originalValue;
            } else {
                delete combinedUpgrade.value;
                delete combinedUpgrade.originalValue;
            }
            if (enhChange) {
                combinedUpgrade.enhancement = enhChange;
            }
            if (lvlChange) {
                combinedUpgrade.level = lvlChange;
            }

            const priceOverride = mainChange?.priceOverride || enhChange?.priceOverride;
            if (priceOverride) {
                combinedUpgrade.priceOverride = priceOverride;
            }

            if (baseName.startsWith('Ability') || baseName.startsWith('Food') || baseName.startsWith('Drink')) {
                const type = baseName.startsWith('Ability') ? 'ability' : (baseName.startsWith('Food') ? 'food' : 'drink');
                const index = parseInt(baseName.match(/\d+/)[0]) - 1;
                const triggerIndex = triggerChanges.findIndex(t => t.type === type && t.index == index);
                if (triggerIndex > -1) {
                    combinedUpgrade.triggerChange = triggerChanges[triggerIndex];
                    triggerChanges.splice(triggerIndex, 1);
                }
            }
            upgrades.push(combinedUpgrade);
        }
        for (const trigger of triggerChanges) {
            upgrades.push({
                name: `Trigger ${trigger.type} ${parseInt(trigger.index) + 1}`,
                isTriggerOnly: true,
                triggerChange: trigger,
                isConstant: trigger.isConstant
            });
        }
        return upgrades;
    };

    function makeDraggable(panel, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            if (!panel.style.top && !panel.style.left) {
                const rect = panel.getBoundingClientRect();
                panel.style.top = rect.top + 'px';
                panel.style.left = rect.left + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            panel.style.top = (panel.offsetTop - pos2) + "px";
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            const savedPositions = GM_getValue(`jigs_panel_positions_${panel.id}`, {});
            savedPositions.top = panel.style.top;
            savedPositions.left = panel.style.left;
            GM_setValue(`jigs_panel_positions_${panel.id}`, savedPositions);
        }
    }

function makeResizable(panel) {
    let startX, startY, startWidth, startHeight, dragDir;
    const MIN_WIDTH = 300;
    const MIN_HEIGHT = 100;
    const RESIZE_AREA = 10; // Pixels from edge considered a drag handle

    panel.addEventListener('mousedown', initDrag, false);
    panel.addEventListener('mousemove', setCursor, false);

    function getDragDirection(e) {
        const rect = panel.getBoundingClientRect();
        const top = e.clientY < rect.top + RESIZE_AREA;
        const bottom = e.clientY > rect.bottom - RESIZE_AREA;
        const left = e.clientX < rect.left + RESIZE_AREA;
        const right = e.clientX > rect.right - RESIZE_AREA;

        if (bottom && right) return 'se';
        if (bottom && left) return 'sw';
        if (top && right) return 'ne';
        if (top && left) return 'nw';
        if (right) return 'e';
        if (left) return 'w';
        if (top) return 'n';
        if (bottom) return 's';
        return null;
    }

// Inside makeResizable function:

    function setCursor(e) {
        if (panel.classList.contains('jigs-minimized')) {
            panel.style.cursor = 'default'; // Ensure default cursor when minimized
            return;
        }
        const dir = getDragDirection(e);
        panel.style.cursor = dir ? dir + '-resize' : 'default';
    }

// Inside makeResizable function:

function initDrag(e) {
        if (panel.classList.contains('jigs-minimized')) return;

        dragDir = getDragDirection(e);

        if (!dragDir) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);

        // *** CRITICAL FIX: Lock the position using computed bounding box for W/N resizes ***
        if (dragDir.includes('n') || dragDir.includes('w')) {
            const rect = panel.getBoundingClientRect();
            panel.style.top = rect.top + 'px';
            panel.style.left = rect.left + 'px';
            panel.style.right = 'auto'; // Disable right/bottom positioning
            panel.style.bottom = 'auto';
            // Also store the *starting* numerical coordinates for the calculation
            panel.dataset.startLeft = rect.left;
            panel.dataset.startTop = rect.top;
        } else {
            // Ensure W/N start positions are cleared for E/S resizes
            panel.dataset.startLeft = panel.offsetLeft;
            panel.dataset.startTop = panel.offsetTop;
        }

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }

    // No changes needed for doDrag or stopDrag functions.

function doDrag(e) {
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newWidth = startWidth;
        let newHeight = startHeight;

        // --- West (Left) Resize Logic (Includes NW, SW) ---
        if (dragDir.includes('w')) {
            newWidth = Math.max(MIN_WIDTH, startWidth - dx);

            // Adjust left position by the change in width
            const leftAdjustment = newWidth - startWidth;

            // Use the *initial* left position (startLeft) + the delta (dx)
            const startingLeft = parseFloat(panel.dataset.startLeft) || 0;
            const newLeft = startingLeft + dx;

            panel.style.left = newLeft + 'px';
        }
        // --- East (Right) Resize Logic (Includes NE, SE) ---
        else if (dragDir.includes('e')) {
            newWidth = Math.max(MIN_WIDTH, startWidth + dx);
        }

        // --- North (Top) Resize Logic (Includes NW, NE) ---
        if (dragDir.includes('n')) {
            newHeight = Math.max(MIN_HEIGHT, startHeight - dy);

            // Use the *initial* top position (startTop) + the delta (dy)
            const startingTop = parseFloat(panel.dataset.startTop) || 0;
            const newTop = startingTop + dy;

            panel.style.top = newTop + 'px';
        }
        // --- South (Bottom) Resize Logic (Includes SW, SE) ---
        else if (dragDir.includes('s')) {
            newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
        }

        // Apply size changes
        panel.style.width = newWidth + 'px';
        panel.style.height = newHeight + 'px';
    }

    function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
        panel.style.cursor = 'default';
        const savedPositions = GM_getValue(`jigs_panel_positions_${panel.id}`, {});
        savedPositions.width = panel.style.width;
        savedPositions.height = panel.style.height;
        savedPositions.top = panel.style.top;
        savedPositions.left = panel.style.left;
        GM_setValue(`jigs_panel_positions_${panel.id}`, savedPositions);
    }
}

    function createTriggerRow(type, index) {
        const container = document.createElement('div');
        container.className = 'trigger-container';
        const mainRow = document.createElement('div');
        mainRow.className = 'trigger-row';
        mainRow.dataset.triggerType = type;
        mainRow.dataset.triggerIndex = index;
        mainRow.innerHTML = `
            <label>Trigger:</label>
            <select class="jigs-trigger-dependency" data-field="dependency" title="Condition 1" data-original-value=""><option value=""></option></select>
            <select class="jigs-trigger-condition" data-field="condition" title="Condition 2" data-original-value=""><option value=""></option></select>
            <select class="jigs-trigger-comparator" data-field="comparator" title="Condition 3" data-original-value=""><option value=""></option></select>
            <input type="number" class="jigs-trigger-value" data-field="value" placeholder="Value" title="Condition 4" data-original-value="">
        `;
        const rangeRow = document.createElement('div');
        rangeRow.className = 'trigger-range-row';
        rangeRow.innerHTML = `
            <label></label> <label class="jigs-range-label">Range:</label>
            <input type="text" class="jigs-trigger-range" placeholder="e.g., 2000-2500" data-original-value="">
            <label class="jigs-increment-label">Increment:</label>
            <input type="number" class="jigs-trigger-increment" placeholder="e.g., 100" data-original-value="">
        `;
        container.appendChild(mainRow);
        container.appendChild(rangeRow);
        return container;
    }

    function createConstantCheckbox() {
        const container = document.createElement('div');
        container.className = 'constant-checkbox-container';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'jigs-constant-checkbox';
        checkbox.title = 'Include this change in every simulation';
        container.appendChild(checkbox);
        return container;
    }

    function updateModifiedIndicator(element) {
        if (!element || typeof element.dataset.originalValue === 'undefined') {
            return;
        }
        const hasChanged = element.value !== element.dataset.originalValue;
        if (hasChanged) {
            element.classList.add('jigs-modified');
        } else {
            element.classList.remove('jigs-modified');
        }
    }

function normalizeAndParseFloat(s) {
        if (typeof s !== 'string' || !s) return NaN;

        // Remove all whitespace, including non-breaking spaces (\u00A0),
        // which are commonly used as thousands separators in French (e.g. "1 200,50")
        s = s.trim().replace(/[\s\u00A0]/g, '');

        // Check if the format is European/French (Comma is the decimal separator)
        // Logic: Comma exists AND (Dot doesn't exist OR Comma appears after the last Dot)
        if (s.indexOf(',') > -1 && (s.indexOf('.') === -1 || s.lastIndexOf(',') > s.lastIndexOf('.'))) {
            // Remove dots (thousands separators in some formats) and swap comma to dot
            return parseFloat(s.replace(/\./g, '').replace(',', '.'));
        }

        // Standard English format: remove commas (thousands separators)
        return parseFloat(s.replace(/,/g, ''));
    }

    function parseGold(value) {
        if (typeof value !== 'string') return NaN;
        value = value.toLowerCase().trim();
        const suffix = value.slice(-1);
        let multiplier = 1;
        let numPart = value;

        if (['k', 'm', 'b'].includes(suffix)) {
            numPart = value.slice(0, -1);
            if (suffix === 'k') multiplier = 1e3;
            if (suffix === 'm') multiplier = 1e6;
            if (suffix === 'b') multiplier = 1e9;
        }

        const num = normalizeAndParseFloat(numPart);
        return num * multiplier;
    }

    function updateBaselinesFromInputs() {
        console.log("JIGS DEBUG: Reading baseline values from input fields.");
        const dpsStr = document.getElementById('baseline-dps-input').value;
        const profitStr = document.getElementById('baseline-profit-input').value;
        const expStr = document.getElementById('baseline-exp-input').value;
        const ephStr = document.getElementById('baseline-eph-input').value;
        const dphStr = document.getElementById('baseline-dph-input').value;
        baselineDps = parseGold(dpsStr) || 0;
        baselineProfit = parseGold(profitStr) || 0;
        baselineExp = parseInt(expStr.replace(/\D/g, ''), 10) || 0;
        baselineEph = normalizeAndParseFloat(ephStr) || 0;
        baselineDph = normalizeAndParseFloat(dphStr) || 0;
        console.log(`JIGS DEBUG: Baselines updated to DPS: ${baselineDps} (from '${dpsStr}'), Profit: ${baselineProfit} (from '${profitStr}'), Exp: ${baselineExp} (from '${expStr}'), EPH: ${baselineEph} (from '${ephStr}'), DPH: ${baselineDph} (from '${dphStr}')`);
    }
    function createNumberInput(name, value, min, max, isHouse = false, withCheckbox = true) {
        const container = document.createElement('div');
        container.className = isHouse ? 'house-grid-item' : 'batch-input-row';
        const label = document.createElement('label');
        label.textContent = name;
        label.title = name;
        const input = document.createElement('input');
        input.type = 'number';
        input.value = value;
        input.min = min ?? 1;
        input.max = max ?? 400;
        input.dataset.originalValue = value;
        input.dataset.name = name;
        container.appendChild(label);
        container.appendChild(input);
        if (withCheckbox) {
            container.appendChild(createConstantCheckbox());
        } else {
             container.style.gridTemplateColumns = '100px 1fr';
        }
        return container;
    }
    function createSelect(name, value, options, withCheckbox = true) {
        const row = document.createElement('div');
        row.className = 'batch-input-row';
        const label = document.createElement('label');
        label.textContent = name;
        label.title = name;
        const select = document.createElement('select');
        select.dataset.originalValue = value;
        select.dataset.name = name;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });
        select.value = value;
        row.appendChild(label);
        row.appendChild(select);
        if (withCheckbox) {
            row.appendChild(createConstantCheckbox());
        } else {
            row.style.gridTemplateColumns = '100px 1fr';
        }
        return row;
    }
    function createEquipmentRow(name, itemValue, itemOptions, enhValue) {
        const row = document.createElement('div');
        row.className = 'batch-input-row-equip';
        const label = document.createElement('label');
        label.textContent = name;
        label.title = name;
        const itemSelect = document.createElement('select');
        itemSelect.dataset.originalValue = itemValue;
        itemSelect.dataset.name = name;
        itemOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            itemSelect.appendChild(option);
        });
        itemSelect.value = itemValue;
        const enhInput = document.createElement('input');
        enhInput.type = 'number';
        enhInput.value = enhValue;
        enhInput.min = 0;
        enhInput.max = 20;
        enhInput.dataset.originalValue = enhValue;
        enhInput.dataset.name = `${name} Enhancement`;
        const priceInfoContainer = document.createElement('div');
        priceInfoContainer.className = 'price-info-container';
        const priceOverrideInput = document.createElement('input');
        priceOverrideInput.type = 'text';
        priceOverrideInput.className = 'jigs-price-override';
        priceOverrideInput.placeholder = 'Auto Price';
        priceOverrideInput.title = 'Manual price override. Use "k", "m", "b". Clears on item/enh change.';
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'market-indicators';
        priceInfoContainer.appendChild(indicatorContainer);
        priceInfoContainer.appendChild(priceOverrideInput);
        row.appendChild(label);
        row.appendChild(itemSelect);
        row.appendChild(enhInput);
        row.appendChild(createConstantCheckbox());
        row.appendChild(priceInfoContainer);
        itemSelect.addEventListener('change', () => {
            updateMarketIndicators(row);
            updatePriceOverrideField(row);
        });
        enhInput.addEventListener('change', () => {
            updateMarketIndicators(row);
            updatePriceOverrideField(row);
        });
        return row;
    }
    function createAbilityRow(name, itemValue, itemOptions, lvlValue) {
        const row = document.createElement('div');
        row.className = 'batch-input-row-ability';
        const label = document.createElement('label');
        label.textContent = name;
        label.title = name;
        const itemSelect = document.createElement('select');
        itemSelect.dataset.originalValue = itemValue;
        itemSelect.dataset.name = name;
        itemOptions.forEach(opt => {
            if (opt !== 'Promote') {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                itemSelect.appendChild(option);
            }
        });
        itemSelect.value = itemValue;
        const lvlInput = document.createElement('input');
        lvlInput.type = 'number';
        lvlInput.value = lvlValue;
        lvlInput.min = 1;
        lvlInput.max = 200;
        lvlInput.dataset.originalValue = lvlValue;
        lvlInput.dataset.name = `${name} Level`;
        row.appendChild(label);
        row.appendChild(itemSelect);
        row.appendChild(lvlInput);
        row.appendChild(createConstantCheckbox());
        return row;
    }
    function findPageElementByName(name, tag = 'input, select') { if (specialIdMap[name]) { return document.getElementById(specialIdMap[name]); } const labels = Array.from(document.querySelectorAll('label')); const targetLabel = labels.find(l => l.textContent && l.textContent.trim().toLowerCase() === name.toLowerCase()); if (!targetLabel) return null; const parentRow = targetLabel.closest('.row'); if (parentRow) { return parentRow.querySelector(tag); } return null; }
    function getDpsValue() { const resultsContainer = document.getElementById('simulationResultTotalDamageDone'); if (!resultsContainer || !resultsContainer.hasChildNodes()) { return null; } const totalLabelElement = Array.from(resultsContainer.querySelectorAll('div.col-md-5')).find(el => el.textContent.trim() === 'Total'); if (!totalLabelElement) { return null; } const dpsElement = totalLabelElement.nextElementSibling?.nextElementSibling; if (dpsElement) { return dpsElement.textContent.trim(); } return null; }
    function formatGold(value) { if (value === 'N/A' || value === 'Free') return value; if (!isFinite(value) || value === Infinity) return "N/A"; if (value < 1000) return Math.round(value).toLocaleString(); if (value < 1000000) return `${(value / 1000).toFixed(1)}k`; return `${(value / 1000000).toFixed(2)}M`; }
    function addResultRow(result) {
        const resultsTbody = document.querySelector('#batch-results-table tbody');
        const row = resultsTbody.insertRow();
        let costText = formatGold(result.cost);
        let costPerDpsText = formatGold(result.costPerDps);
        let costPerProfitText = formatGold(result.costPerProfit);
        let costPerExpText = formatGold(result.costPerExp);
        let costPerEphText = formatGold(result.costPerEph);
        if (result.cost === Infinity) {
            costText = 'No Seller';
            costPerDpsText = 'N/A';
            costPerProfitText = 'N/A';
            costPerExpText = 'N/A';
            costPerEphText = 'N/A';
        }
        let upgradeText = result.upgrade;
        if (result.books > 0) {
            upgradeText += ` (${result.books.toLocaleString()} books)`;
        } else if (result.timeToLevelText) {
            upgradeText += ` ${result.timeToLevelText}`;
        }
        row.dataset.upgrade = result.upgrade;
        row.dataset.cost = isFinite(result.cost) ? result.cost : Infinity;
        row.dataset.timeToPurchase = isFinite(result.timeToPurchase) ? result.timeToPurchase : Infinity;
        row.dataset.dpsChange = result.dps;
        row.dataset.percentChange = isFinite(result.percent) ? result.percent : Infinity;
        row.dataset.costPerDps = result.costPerDps === 'Free' ? 0 : (isFinite(result.costPerDps) ? result.costPerDps : Infinity);
        row.dataset.profitChange = result.profitChange;
        row.dataset.percentProfitChange = isFinite(result.percentProfitChange) ? result.percentProfitChange : Infinity;
        row.dataset.costPerProfit = result.costPerProfit === 'Free' ? 0 : (isFinite(result.costPerProfit) ? result.costPerProfit : Infinity);
        row.dataset.expChange = result.expChange;
        row.dataset.percentExpChange = isFinite(result.percentExpChange) ? result.percentExpChange : Infinity;
        row.dataset.costPerExp = result.costPerExp === 'Free' ? 0 : (isFinite(result.costPerExp) ? result.costPerExp : Infinity);
        row.dataset.ephChange = result.ephChange;
        row.dataset.percentEphChange = isFinite(result.percentEphChange) ? result.percentEphChange : Infinity;
        row.dataset.costPerEph = result.costPerEph === 'Free' ? 0 : (isFinite(result.costPerEph) ? result.costPerEph : Infinity);
        row.dataset.dphChange = result.dphChange;
        row.dataset.percentDphChange = isFinite(result.percentDphChange) ? result.percentDphChange : Infinity;

        row.innerHTML = ` <td class="upgrade-col">${upgradeText}</td>
                                <td class="cost-col">${costText}</td>
                                <td class="ttp-col">${formatTime(result.timeToPurchase)}</td>
                                <td class="dps-col">${result.dps > 0 ? '+' : ''}${result.dps.toFixed(2)}</td>
                                <td class="dps-col">${isFinite(result.percent) ? result.percent.toFixed(2)+'%' : '∞'}</td>
                                <td class="dps-col">${costPerDpsText}</td>
                                <td class="profit-col">${result.profitChange > 0 ? '+' : ''}${formatGold(result.profitChange)}</td>
                                <td class="profit-col">${isFinite(result.percentProfitChange) ? result.percentProfitChange.toFixed(2)+'%' : '∞'}</td>
                                <td class="profit-col">${costPerProfitText}</td>
                                <td class="exp-col">${result.expChange > 0 ? '+' : ''}${result.expChange.toLocaleString()}</td>
                                <td class="exp-col">${isFinite(result.percentExpChange) ? result.percentExpChange.toFixed(2)+'%' : '∞'}</td>
                                <td class="exp-col">${costPerExpText}</td>
                                <td class="eph-col">${result.ephChange > 0 ? '+' : ''}${result.ephChange.toFixed(2)}</td>
                                <td class="eph-col">${isFinite(result.percentEphChange) ? result.percentEphChange.toFixed(2)+'%' : '∞'}</td>
                                <td class="eph-col">${costPerEphText}</td>
                                <td class="dph-col">${result.dphChange > 0 ? '+' : ''}${result.dphChange.toFixed(2)}</td>
                                <td class="dph-col">${isFinite(result.percentDphChange) ? result.percentDphChange.toFixed(2)+'%' : '∞'}</td>`;
    }
    function getProfitValue() {
        const durationInput = document.getElementById('inputSimulationTime');
        const durationHours = durationInput ? parseFloat(durationInput.value) : 24;
        if (isNaN(durationHours) || durationHours <= 0) { return null; }
        const durationInDays = durationHours / 24;
        const newProfitElement = document.getElementById('noRngProfitPreview');
        if (newProfitElement) {
            const profitString = newProfitElement.textContent.trim();
            const totalProfit = normalizeAndParseFloat(profitString);
            if (!isNaN(totalProfit)) {
                return totalProfit / durationInDays;
            }
        }
        const profitElement = document.querySelector('div[i18n-id="i18n-realDailyProfitTitle"]');
        if (!profitElement) { return null; }
        let profitString = '';
        if (profitElement.hasAttribute('i18n-data')) {
            profitString = profitElement.getAttribute('i18n-data');
        } else {
            profitString = profitElement.textContent;
        }
        profitString = (profitString.split(':')[1] || '').trim();
        if (profitString === '') { return null; }
        const profitValue = normalizeAndParseFloat(profitString);
        return isNaN(profitValue) ? null : profitValue;
    }
    function getExpValue() {
        const allTotalLabels = Array.from(document.querySelectorAll('div')).filter(el => el.textContent.trim() === 'Total');
        const totalLabelElement = allTotalLabels.find(el => el.parentElement.classList.contains('row') && el.nextElementSibling);
        if (!totalLabelElement) {
            return null;
        }
        const expElement = totalLabelElement.nextElementSibling;
        if (expElement) {
            const expString = expElement.textContent.trim().replace(/\D/g, '');
            const expValue = parseInt(expString, 10);
            return isNaN(expValue) ? null : expValue;
        }
        return null;
    }
    function getEphValue() { const ephLabel = document.querySelector('div[data-i18n="common:simulationResults.encounters"]'); if (!ephLabel) { return null; } const ephElement = ephLabel.nextElementSibling; if (ephElement) { const ephString = ephElement.textContent.trim(); const ephValue = normalizeAndParseFloat(ephString); return isNaN(ephValue) ? null : ephValue; } return null; }
    function getDphValue() {
        const dphHeader = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'Deaths Per Hour');
        if (!dphHeader) { return null; }
        const dphContainer = dphHeader.nextElementSibling;
        if (!dphContainer) return null;
        const valueElement = dphContainer.querySelector('.row > :last-child');
        if (valueElement) {
            const dphString = valueElement.textContent.trim();
            const dphValue = normalizeAndParseFloat(dphString);
            return isNaN(dphValue) ? null : dphValue;
        }
        return null;
    }
    function captureBaselineSkillRates() {
        console.log("JIGS DEBUG: Capturing baseline skill XP rates...");
        baselineSkillXpRates = {}; // Clear previous rates
        const container = document.getElementById('simulationResultExperienceGain');
        if (!container) {
            console.error("JIGS DEBUG: Could not find skill XP results container '#simulationResultExperienceGain'.");
            return;
        }

        const skillRows = container.querySelectorAll('.row');
        skillRows.forEach(row => {
            const children = row.children;
            if (children.length === 2) {
                const skillName = children[0].textContent.trim().toLowerCase();
                const xpValue = children[1].textContent.trim();
                // Exclude the "Total" row
                if (skillName !== 'total') {
                    const rate = parseInt(xpValue.replace(/,/g, ''), 10) || 0;
                    baselineSkillXpRates[skillName] = rate;
                }
            }
        });
        console.log("JIGS DEBUG: Captured rates:", baselineSkillXpRates);
    }
    function getSkillXpRate(skillName) {
        const rate = baselineSkillXpRates[skillName.toLowerCase()] || 0;
        if (rate === 0) {
            console.warn(`JIGS DEBUG: No baseline XP rate found for skill "${skillName}". Time-to-level will not be calculated.`);
        }
        return rate;
    }
    function resetInputsToBaseline() {
        document.querySelectorAll('#batch-inputs-container input, #batch-inputs-container select:not(#jigs-player-select)').forEach(el => {
            if (el.dataset.originalValue !== undefined) {
                el.value = el.dataset.originalValue;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        setTimeout(() => {
            document.querySelectorAll('.batch-input-row-equip').forEach(row => {
                updatePriceOverrideField(row);
            });
        }, 100);
        statusDiv.textContent = 'Status: All inputs reset to baseline.';
    }
    function updateQueuePanelUI() {
        const queueList = document.getElementById('jigs-queue-list');
        queueList.innerHTML = '';
        simulationQueue.forEach((item, index) => {
            const li = document.createElement('li');

            const labelSpan = document.createElement('span');
            labelSpan.textContent = item.label;
            labelSpan.className = 'jigs-queue-item-label';

            const removeButton = document.createElement('button');
            removeButton.textContent = '✖';
            removeButton.className = 'jigs-remove-queue-item-button';
            removeButton.title = 'Remove this item from the queue';
            removeButton.dataset.index = index; // Store the item's index on the button

            li.appendChild(labelSpan);
            li.appendChild(removeButton);
            queueList.appendChild(li);
        });
        updateQueueEstimate();
    }
    function updateQueueEstimate() {
        const estimateDiv = document.getElementById('jigs-queue-estimate');
        const infiniteCheckbox = document.getElementById('infinite-queue-checkbox');
        const isInfinite = infiniteCheckbox ? infiniteCheckbox.checked : false;

        if (baselineRunTime <= 0 || simulationQueue.length === 0) {
            estimateDiv.textContent = '';
            return;
        }
        const multiplier = parseInt(document.querySelector('#sim-settings-group [data-name="Multiplier"]')?.value) || 1;
        const totalMs = simulationQueue.length * multiplier * baselineRunTime;
        const totalSeconds = totalMs / 1000;

        let estimateText = '';
        if (totalSeconds < 60) {
            estimateText = `~${Math.round(totalSeconds)} seconds`;
        } else {
            const totalMinutes = totalSeconds / 60;
            estimateText = `~${totalMinutes.toFixed(1)} minutes`;
        }

        if (isInfinite) {
            estimateDiv.textContent = `Est. time per loop: ${estimateText}`;
        } else {
            estimateDiv.textContent = `Estimated time: ${estimateText}`;
        }
    }
    function updateColumnVisibility() { document.querySelectorAll('.column-toggle').forEach(checkbox => { const columnClass = checkbox.dataset.col; const isVisible = checkbox.checked; document.querySelectorAll(`.${columnClass}`).forEach(el => el.style.display = isVisible ? '' : 'none'); }); }
    function formatTime(days) { if (!isFinite(days) || days === Infinity) { return 'Never'; } if (days <= 0) { return 'Free'; } const hours = days * 24; if (hours < 1) { const minutes = hours * 60; return `${minutes.toFixed(0)} min`; } if (days < 1) { return `${hours.toFixed(1)} hrs`; } const months = days / 30.44; if (months >= 1) { return `${months.toFixed(1)} mon`; } return `${days.toFixed(1)} days`; }
    function switchPlayerAndCapture(playerName) { const playerTabs = Array.from(document.querySelectorAll('a[id^="player"][id$="-tab"]')); const targetTab = playerTabs.find(tab => tab.textContent.trim() === playerName); if (targetTab) { statusDiv.textContent = `Switching to ${playerName}...`; targetTab.click(); setTimeout(() => { buildInputsUI(); }, 500); } else { statusDiv.textContent = `Error: Could not find player ${playerName}.`; } }
    function populatePlayerDropdown() {
        const container = document.getElementById('jigs-player-select-container');
        if (!container) return;
        container.innerHTML = '';
        const playerTabs = Array.from(document.querySelectorAll('a[id^="player"][id$="-tab"]'));
        if (playerTabs.length > 1) {
            const playerNames = playerTabs.map(tab => tab.textContent.trim());
            const activeTab = playerTabs.find(tab => tab.classList.contains('active'));
            const currentPlayer = activeTab ? activeTab.textContent.trim() : playerNames[0];
            const playerSelectRow = createSelect('Select Player', currentPlayer, playerNames, false);
            const selectEl = playerSelectRow.querySelector('select');
            if (selectEl) selectEl.id = 'jigs-player-select';
            container.append(...playerSelectRow.childNodes);
            container.className = 'batch-input-row';
            container.style.gridTemplateColumns = '100px 1fr';
        } else {
            container.className = '';
        }
    }
    function highlightResults() {
        const rows = document.querySelectorAll('#batch-results-table tbody tr');
        if (rows.length < 2) { return; }
        document.querySelectorAll('#batch-results-table td').forEach(td => {
            td.classList.remove('best-upgrade', 'worst-upgrade');
        });
        const metrics = [
            { key: 'costPerDps', colIndex: 5 },
            { key: 'costPerProfit', colIndex: 8 },
            { key: 'costPerExp', colIndex: 11 },
            { key: 'costPerEph', colIndex: 14 }
        ];
        for (const metric of metrics) {
            let values = [];
            for (const row of rows) {
                const cost = parseFloat(row.dataset.cost);
                const metricValue = parseFloat(row.dataset[metric.key]);

                if (cost === 0 || !isFinite(metricValue)) {
                    continue;
                }
                values.push({ value: metricValue, row: row });
            }
            if (values.length < 2) { continue; }
            values.sort((a, b) => a.value - b.value);
            const minVal = values[0].value;
            const maxVal = values[values.length - 1].value;
            if (minVal === maxVal) { continue; }
            const minRow = values[0].row;
            const maxRow = values[values.length - 1].row;
            const minCell = minRow.children[metric.colIndex];
            const maxCell = maxRow.children[metric.colIndex];
            if (minCell) minCell.classList.add('best-upgrade');
            if (maxCell) maxCell.classList.add('worst-upgrade');
        }
    }
    function updateMarketIndicators(equipmentRow) {
        if (!marketData) return;
        const itemSelect = equipmentRow.querySelector('select');
        const enhInput = equipmentRow.querySelector('input[type="number"]');
        const indicatorContainer = equipmentRow.querySelector('.market-indicators');
        if (!itemSelect || !enhInput || !indicatorContainer) return;
        indicatorContainer.innerHTML = '';
        const simItemName = itemSelect.value;
        if (simItemName === 'Empty') return;
        const marketItemName = SIMULATOR_TO_MARKET_MAP[simItemName] || simItemName;
        const itemKeyBase = marketItemName.replace(/'/g, '').toLowerCase();
        const currentEnh = parseInt(enhInput.value, 10);
        for (let i = 1; i <= 20; i++) {
            const marketKey = `${itemKeyBase} +${i}`;
            const priceData = marketData[marketKey];
            if (priceData && priceData.seller && priceData.seller !== -1) {
                const dot = document.createElement('div');
                dot.className = 'market-dot';
                dot.textContent = `+${i}`;
                dot.title = `+${i}: ${formatGold(priceData.seller)}`;
                if (i === currentEnh) {
                    dot.classList.add('selected');
                }
                dot.addEventListener('click', () => {
                    enhInput.value = i;
                    enhInput.dispatchEvent(new Event('change', { bubbles: true }));
                });
                indicatorContainer.appendChild(dot);
            }
        }
    }
    function updatePriceOverrideField(equipmentRow) {
        if (!marketData) return;
        const itemSelect = equipmentRow.querySelector('select');
        const enhInput = equipmentRow.querySelector('input[type="number"]');
        const priceInput = equipmentRow.querySelector('.jigs-price-override');
        if (!itemSelect || !enhInput || !priceInput) return;
        const simItemName = itemSelect.value;
        const enhLevel = enhInput.value;
        priceInput.value = '';
        if (simItemName === 'Empty' || enhLevel === '0') return;
        const marketItemName = SIMULATOR_TO_MARKET_MAP[simItemName] || simItemName;
        const itemKeyBase = marketItemName.replace(/'/g, '').toLowerCase();
        const marketKey = enhLevel === '0' ? itemKeyBase : `${itemKeyBase} +${enhLevel}`;
        const priceData = marketData[marketKey];
        if (priceData && priceData.seller && priceData.seller !== -1) {
            priceInput.value = formatGold(priceData.seller);
        }
    }

    // --- 4. CORE LOGIC ---
    async function fetchJigsData() { return new Promise((resolve) => { GM_xmlhttpRequest({ method: "GET", url: JIGS_DATA_URL, onload: function(response) { if (response.status === 200) { try { const data = JSON.parse(response.responseText); HOUSE_RECIPES = data.recipes; ITEM_ID_TO_NAME_MAP = data.itemMap; SPELL_BOOK_XP = data.spellBookXp; SIMULATOR_TO_MARKET_MAP = data.refinedMap; ABILITY_XP_LEVELS = data.abilityXp; resolve(true); } catch(e) { console.error("JIGS: Failed to parse JIGS data.", e); resolve(false); } } else { console.error("JIGS: Failed to fetch JIGS data.", response.status); resolve(false); } }, onerror: function() { console.error("JIGS: Error fetching JIGS data."); resolve(false); } }); }); }
    async function fetchMarketData() { if (marketData) { return marketData; } return new Promise((resolve) => { GM_xmlhttpRequest({ method: "GET", url: MARKET_API_URL, onload: function(response) { if (response.status === 200) { try { const responseObject = JSON.parse(response.responseText); const rawMarketData = responseObject.marketData; if (typeof rawMarketData !== 'object' || rawMarketData === null) { resolve(null); return; } marketData = {}; for (const itemId in rawMarketData) { const itemName = ITEM_ID_TO_NAME_MAP[itemId]; if (!itemName) continue; const itemEnhancements = rawMarketData[itemId]; for (const enhancementLevel in itemEnhancements) { const prices = itemEnhancements[enhancementLevel]; const fullName = enhancementLevel === "0" ? itemName : `${itemName} +${enhancementLevel}`; marketData[fullName.replace(/'/g, '').toLowerCase()] = { buyer: prices.b, seller: prices.a }; } } resolve(marketData); } catch (e) { resolve(null); } } else { resolve(null); } }, onerror: function() { resolve(null); } }); }); }
    async function runSimulation(progressCallback) { return new Promise((resolve) => { let progressWatcher, dpsWatcher; const cleanup = () => { clearInterval(progressWatcher); clearInterval(dpsWatcher); }; const setupButton = document.getElementById('buttonSimulationSetup'); if (!setupButton) { cleanup(); resolve(null); return; } setupButton.click(); setTimeout(() => { const startButton = document.getElementById('buttonStartSimulation'); if (!startButton) { cleanup(); resolve(null); return; } const resultsContainer = document.getElementById('simulationResultTotalDamageDone'); if (resultsContainer) resultsContainer.innerHTML = ''; startButton.click(); progressWatcher = setInterval(() => { if (!isBatchRunning) { console.log("JIGS DEBUG: Simulation stopped by user request."); cleanup(); resolve(null); return; } const progressBar = document.getElementById('simulationProgressBar'); if (progressBar) { const progress = parseInt(progressBar.textContent) || 0; if (progressCallback) progressCallback(progress); } if (progressBar && progressBar.textContent.includes('100%')) { clearInterval(progressWatcher); let attemptsWithoutAllMetrics = 0; const maxAttempts = 50; dpsWatcher = setInterval(() => { const dpsVal = getDpsValue(); const profitVal = getProfitValue(); const expVal = getExpValue(); const ephVal = getEphValue(); const dphVal = getDphValue(); if (dpsVal && profitVal !== null && expVal !== null && ephVal !== null && dphVal !== null) { cleanup(); resolve({ dps: normalizeAndParseFloat(dpsVal), profit: profitVal, exp: expVal, eph: ephVal, dph: dphVal, }); } else if (dpsVal && attemptsWithoutAllMetrics >= maxAttempts) { console.warn("JIGS: Max attempts reached, capturing with available metrics. DPS=" + dpsVal + ", Profit=" + profitVal + ", EXP=" + expVal + ", EPH=" + ephVal + ", DPH=" + dphVal); cleanup(); resolve({ dps: normalizeAndParseFloat(dpsVal), profit: profitVal || 0, exp: expVal || 0, eph: ephVal || 0, dph: dphVal || 0, }); } else { attemptsWithoutAllMetrics++; } }, 100); } }, 200); }, 300); }); }
    async function runSimulationMultiple(multiplier, progressCallback) {
        let totals = { dps: 0, profit: 0, exp: 0, eph: 0, dph: 0 };
        let successfulRuns = 0;
        let allDpsResults = [];
        for (let i = 0; i < multiplier; i++) {
            if (!isBatchRunning) break;
            const singleRunProgress = (progress) => {
                if (progressCallback) {
                    const overallProgress = ((i * 100) + progress) / multiplier;
                    progressCallback(overallProgress);
                }
            };
            const result = await runSimulation(singleRunProgress);
            if (result && !isNaN(result.dps)) {
                totals.dps += result.dps;
                totals.profit += result.profit;
                totals.exp += result.exp;
                totals.eph += result.eph;
                totals.dph += result.dph;
                successfulRuns++;
                allDpsResults.push(result.dps);
            } else {
                console.error(`JIGS: Simulation run ${i + 1} of ${multiplier} failed.`);
            }
        }

        if (successfulRuns === 0) {
            return { averageDps: NaN, averageProfit: NaN, averageExp: NaN, averageEph: NaN, averageDph: NaN, individualRuns: [] };
        }
        return {
            averageDps: totals.dps / successfulRuns,
            averageProfit: totals.profit / successfulRuns,
            averageExp: totals.exp / successfulRuns,
            averageEph: totals.eph / successfulRuns,
            averageDph: totals.dph / successfulRuns,
            individualRuns: allDpsResults
        };
    }
    function setRunningState(isRunning) {
        isBatchRunning = isRunning;
        document.getElementById('run-batch-button').style.display = isRunning ? 'none' : 'block';
        document.getElementById('stop-batch-button').style.display = isRunning ? 'block' : 'none';
        document.getElementById('capture-setup-button').disabled = isRunning;
        document.getElementById('update-baseline-button').disabled = isRunning;
        document.getElementById('import-triggers-checkbox').disabled = isRunning;
        if (isRunning) {
            document.getElementById('export-csv-button').disabled = true;
        }
        document.getElementById('reset-button').disabled = isRunning;
        document.getElementById('add-to-queue-button').disabled = isRunning;
    }
    async function buildInputsUI() {
        statusDiv.textContent = 'Status: Reading data and fetching market prices...';
        jigsNameToPageElementMap = new Map();
        await fetchMarketData();
        document.getElementById('run-batch-button').disabled = true;
        document.getElementById('capture-setup-button').disabled = true;
        document.getElementById('update-baseline-button').disabled = true;
        document.getElementById('reset-button').disabled = true;
        document.getElementById('add-to-queue-button').disabled = true;
        document.getElementById('import-triggers-checkbox').disabled = true;

        const excludedRooms = [ "Shed", "Dairy Barn", "Garden", "Forge", "Workshop", "Sewing Parlor", "Kitchen", "Brewery", "Laboratory", "Observatory", "Log Shed" ];
        const currentMultiplier = document.querySelector('#sim-settings-group [data-name="Multiplier"]')?.value || 1;
        Object.values(groupContainers).forEach(c => { if (c.id !== 'house-grid-container') c.innerHTML = `<summary>${c.querySelector('summary').textContent}</summary>`; else c.innerHTML = ''; });
        let itemsFound = 0;
        houseKeywords = [];
        populatePlayerDropdown();
        skillKeywords.forEach(name => { const pageEl = findPageElementByName(name); if (pageEl) { groupContainers.skills.appendChild(createNumberInput(name, pageEl.value, pageEl.min, pageEl.max)); jigsNameToPageElementMap.set(name, pageEl); itemsFound++; } });
        equipmentKeywords.forEach(name => { const itemSelect = findPageElementByName(name, 'select'); const enhInput = findPageElementByName(name, 'input'); if (itemSelect && enhInput) { const itemValue = itemSelect.options[itemSelect.selectedIndex].text; const itemOptions = Array.from(itemSelect.options).map(opt => opt.text); const enhValue = enhInput.value; const equipmentRow = createEquipmentRow(name, itemValue, itemOptions, enhValue); groupContainers.equipment.appendChild(equipmentRow); updateMarketIndicators(equipmentRow); updatePriceOverrideField(equipmentRow); jigsNameToPageElementMap.set(name, itemSelect); jigsNameToPageElementMap.set(`${name} Enhancement`, enhInput); itemsFound++; } });
        for (let i = 0; i < 5; i++) { const abilitySelect = document.getElementById(`selectAbility_${i}`); const levelInput = document.getElementById(`inputAbilityLevel_${i}`); if (abilitySelect && levelInput) { const name = `Ability ${i + 1}`; const itemValue = abilitySelect.options[abilitySelect.selectedIndex].text; const itemOptions = Array.from(abilitySelect.options).map(opt => opt.text); const lvlValue = levelInput.value; groupContainers.abilities.appendChild(createAbilityRow(name, itemValue, itemOptions, lvlValue)); groupContainers.abilities.appendChild(createTriggerRow('ability', i)); jigsNameToPageElementMap.set(name, abilitySelect); jigsNameToPageElementMap.set(`${name} Level`, levelInput); itemsFound++; } }
        document.querySelectorAll('select[id^="selectFood_"], select[id^="selectDrink_"]').forEach(el => {
            const isFood = el.id.includes('Food');
            const type = isFood ? 'food' : 'drink';
            const indexFromId = parseInt(el.id.split('_')[1], 10);
            const name = `${type} ${indexFromId + 1}`;
            const currentValue = el.options[el.selectedIndex].text;
            const options = Array.from(el.options).map(opt => opt.text);
            groupContainers.food.appendChild(createSelect(name, currentValue, options));
            groupContainers.food.appendChild(createTriggerRow(type, indexFromId));
            jigsNameToPageElementMap.set(name, el);
            itemsFound++;
        });
        document.querySelectorAll('#houseRoomsList .row').forEach(row => {
            const labelEl = row.querySelector('div[data-i18n]');
            const inputEl = row.querySelector('input');
            if (labelEl && inputEl) {
                const name = labelEl.textContent.trim();
                if (excludedRooms.includes(name)) return;
                houseKeywords.push(name);
                groupContainers.house.appendChild(createNumberInput(name, inputEl.value, inputEl.min, inputEl.max, true));
                jigsNameToPageElementMap.set(name, inputEl);
                itemsFound++;
            }
        });
        for (const name of Object.keys(specialIdMap)) {
            const pageEl = findPageElementByName(name);
            if (pageEl) {
                if (pageEl.tagName === 'SELECT') {
                    const currentValue = pageEl.options[pageEl.selectedIndex].text;
                    const options = Array.from(pageEl.options).map(opt => opt.text);
                    const selectEl = createSelect(name, currentValue, options, false);
                    groupContainers.sim.appendChild(selectEl);
                } else {
                    const numInput = createNumberInput(name, pageEl.value, pageEl.min, pageEl.max, false, false);
                    groupContainers.sim.appendChild(numInput);
                }
                jigsNameToPageElementMap.set(name, pageEl);
                itemsFound++;
            }
        }
        const multInput = createNumberInput('Multiplier', currentMultiplier, 1, 100, false, false);
        groupContainers.sim.appendChild(multInput);

        if (itemsFound > 0) {
            statusDiv.textContent = 'Status: Idle.';
            document.getElementById('run-batch-button').disabled = false;
            document.getElementById('update-baseline-button').disabled = false;
            document.getElementById('reset-button').disabled = false;
            document.getElementById('add-to-queue-button').disabled = false;
            document.getElementById('import-triggers-checkbox').disabled = false;
        } else {
            statusDiv.textContent = 'Status: No data found. Import or use Capture Setup.';
        }
        document.getElementById('capture-setup-button').disabled = false;
    }
    async function updateBaseline(withTriggers = true) {
        const getPricesButton = document.getElementById('buttonGetPrices');
        if (getPricesButton) {
            console.log("JIGS DEBUG: Clicking 'Get Prices' button as a backup.");
            getPricesButton.click();
        }
        console.log("JIGS DEBUG: updateBaseline started.");
        setRunningState(true);
        const jigsProgressContainer = document.getElementById('jigs-progress-container');
        const jigsProgressBar = document.getElementById('jigs-progress-bar');

        if (withTriggers) {
            statusDiv.textContent = 'Status: Importing triggers for baseline...';
            await importTriggers(true);
        }

        statusDiv.textContent = 'Status: Applying settings and updating baseline...';
        jigsProgressContainer.style.display = 'block';
        jigsProgressBar.style.width = '0%';
        try {
            const simSettings = document.querySelectorAll('#sim-settings-group select, #sim-settings-group input');
            console.log("JIGS DEBUG: Applying sim setting changes before baseline run.");
            simSettings.forEach(uiEl => {
                if (!uiEl.dataset.name) return;
                if (uiEl.value !== uiEl.dataset.originalValue) {
                    const pageEl = jigsNameToPageElementMap.get(uiEl.dataset.name);
                    if (pageEl) {
                        console.log(`JIGS DEBUG: Changing '${uiEl.dataset.name}' on page to '${uiEl.value}'`);
                        if (pageEl.tagName === 'SELECT') {
                            const opt = Array.from(pageEl.options).find(o => o.text === uiEl.value);
                            if (opt) pageEl.value = opt.value;
                        } else {
                            pageEl.value = uiEl.value;
                        }
                        pageEl.dispatchEvent(new Event('change', { bubbles: true }));
                        pageEl.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            });
            const multiplier = parseInt(document.querySelector('#sim-settings-group [data-name="Multiplier"]').value) || 1;
            console.log(`JIGS DEBUG: Running baseline simulation with multiplier: ${multiplier}`);

            const startTime = performance.now();
            const simResult = await runSimulationMultiple(multiplier, progress => { jigsProgressBar.style.width = `${progress}%`; });
            const endTime = performance.now();
            if (multiplier > 0) {
                baselineRunTime = (endTime - startTime) / multiplier;
            }

            console.log(`JIGS DEBUG: Baseline sim complete. Result:`, simResult);

            if (!isNaN(simResult.averageDps)) {
                baselineDps = simResult.averageDps;
                baselineProfit = simResult.averageProfit;
                baselineExp = simResult.averageExp;
                baselineEph = simResult.averageEph;
                baselineDph = simResult.averageDph;
                console.log(`JIGS DEBUG: New baselines set -> DPS: ${baselineDps}, Profit: ${baselineProfit}, Exp: ${baselineExp}, EPH: ${baselineEph}, DPH: ${baselineDph}`);
                document.getElementById('baseline-dps-input').value = baselineDps.toFixed(2);
                document.getElementById('baseline-profit-input').value = formatGold(baselineProfit);
                document.getElementById('baseline-exp-input').value = baselineExp.toLocaleString();
                document.getElementById('baseline-eph-input').value = baselineEph.toFixed(2);
                document.getElementById('baseline-dph-input').value = baselineDph.toFixed(2);

                captureBaselineSkillRates();
                updateQueueEstimate();

const baselineDisplayDiv = document.getElementById('jigs-baseline-results-display');
if (baselineDisplayDiv) {
    // Use the same formatters JIGS Stats expects or simple number formats
    document.getElementById('base-dps').textContent = baselineDps.toFixed(2); // Use number format
    document.getElementById('base-profit').textContent = formatGold(baselineProfit); // Gold format is correct here
    document.getElementById('base-exp').textContent = baselineExp.toLocaleString(); // Number format is fine
    document.getElementById('base-eph').textContent = baselineEph.toFixed(2); // Number format
    // DPH isn't used by Stats, but keep it for display consistency
    document.getElementById('base-dph').textContent = baselineDph.toFixed(2);
    baselineDisplayDiv.style.display = 'block'; // Make the table visible
}

                document.querySelectorAll('#batch-inputs-container input, #batch-inputs-container select').forEach(el => {
                    if (el.dataset.originalValue !== undefined) {
                        el.dataset.originalValue = el.value;
                        el.classList.remove('jigs-modified');
                    }
                });
                statusDiv.textContent = 'Status: Baseline updated.';
            } else if (isBatchRunning) {
                statusDiv.textContent = 'Error: Failed to update baseline. Try again.';
                console.error("JIGS DEBUG: Failed to update baseline; simulation returned NaN.");
            }
        } finally {
            setRunningState(false);
        }
    }

    async function applyTriggerChanges(triggerData) {
        const type = triggerData.type;
        const index = triggerData.index;
        const typeCap = type.charAt(0).toUpperCase() + type.slice(1);
        const buttonId = `button${typeCap}Trigger_${index}`;
        const triggerButton = document.getElementById(buttonId);

        if (!triggerButton) {
            console.error(`JIGS: Could not find trigger button ${buttonId} to apply changes.`);
            return;
        }

        triggerButton.click();
        await new Promise(r => setTimeout(r, 100));

        const modal = document.getElementById('triggerModal');
        if (!modal || !modal.classList.contains('show')) {
            const closeBtn = document.querySelector('button.btn-close[data-bs-dismiss="modal"]');
            if(closeBtn) closeBtn.click();
            throw new Error(`Modal for ${buttonId} did not open for applying trigger changes.`);
        }

        const setPageSelect = (selectElement, textToFind) => {
            const option = Array.from(selectElement.options).find(o => o.text === textToFind);
            if (option) {
                selectElement.value = option.value;
            } else if (textToFind === "") {
                selectElement.value = "";
            }
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setPageSelect(document.getElementById('selectTriggerDependency_0'), triggerData.dependency);
        setPageSelect(document.getElementById('selectTriggerCondition_0'), triggerData.condition);
        setPageSelect(document.getElementById('selectTriggerComparator_0'), triggerData.comparator);

        const valInput = document.getElementById('inputTriggerValue_0');
        valInput.value = triggerData.value;
        valInput.dispatchEvent(new Event('input', { bubbles: true }));
        valInput.dispatchEvent(new Event('change', { bubbles: true }));

        document.getElementById('buttonTriggerModalSave').click();
        await new Promise(r => setTimeout(r, 100));
    }

    function addChangesToQueue() {
        let allChanges = [];
        document.querySelectorAll("#batch-inputs-container input:not([type=checkbox]), #batch-inputs-container select").forEach(el => {
            const triggerContainer = el.closest('.trigger-container');
            if (el.id !== 'jigs-player-select' && !el.classList.contains('jigs-price-override') && !triggerContainer && !el.disabled && el.dataset.name && el.value !== el.dataset.originalValue) {
                const row = el.closest('.batch-input-row, .batch-input-row-equip, .batch-input-row-ability, .house-grid-item');
                const isConstant = row.querySelector('.jigs-constant-checkbox')?.checked || false;
                const change = {
                    element: el,
                    name: el.dataset.name,
                    value: el.value,
                    originalValue: el.dataset.originalValue,
                    isConstant: isConstant
                };
                if (row.classList.contains('batch-input-row-equip')) {
                    const priceInput = row.querySelector('.jigs-price-override');
                    if (priceInput && priceInput.value.trim() !== '') {
                        change.priceOverride = priceInput.value.trim();
                    }
                }
                allChanges.push(change);
            }
        });

        let allTriggerChanges = [];
        document.querySelectorAll('.trigger-container').forEach(container => {
            const mainRow = container.querySelector('.trigger-row');
            const rangeRow = container.querySelector('.trigger-range-row');
            const depEl = mainRow.querySelector('.jigs-trigger-dependency');
            const condEl = mainRow.querySelector('.jigs-trigger-condition');
            const compEl = mainRow.querySelector('.jigs-trigger-comparator');
            const valEl = mainRow.querySelector('.jigs-trigger-value');
            const rangeEl = rangeRow.querySelector('.jigs-trigger-range');
            const incEl = rangeRow.querySelector('.jigs-trigger-increment');
            const hasChanged = depEl.value !== depEl.dataset.originalValue ||
                                 condEl.value !== condEl.dataset.originalValue ||
                                 compEl.value !== compEl.dataset.originalValue ||
                                 valEl.value !== valEl.dataset.originalValue ||
                                 rangeEl.value !== rangeEl.dataset.originalValue ||
                                 incEl.value !== incEl.dataset.originalValue;
            if (hasChanged) {
                allTriggerChanges.push({
                    type: mainRow.dataset.triggerType,
                    index: mainRow.dataset.triggerIndex,
                    isConstant: false,
                    data: { dependency: depEl.value, condition: condEl.value, comparator: compEl.value, value: valEl.value },
                    range: rangeEl.value.trim(),
                    increment: incEl.value.trim()
                });
            }
        });

        const allGroupedChanges = groupAllChanges(allChanges, allTriggerChanges);
        if (allGroupedChanges.length === 0) {
            statusDiv.textContent = 'Status: No changes detected to add to queue.';
            return;
        }

        const generateLabel = (upgrades) => {
            let labelParts = [];
            for (const upgrade of upgrades) {
                let partLabel = upgrade.customLabel || '';
                if (!partLabel) {
                    if (!upgrade.isTriggerOnly) {
                        const baseName = upgrade.name;
                        const isConsumableOrAbility = baseName.startsWith('Ability') || baseName.startsWith('Food') || baseName.startsWith('Drink');
                        const itemChanged = upgrade.value && upgrade.originalValue && upgrade.value !== upgrade.originalValue;
                        const enhChanged = upgrade.enhancement;
                        const levelChanged = upgrade.level;

                        if (itemChanged) {
                            partLabel = isConsumableOrAbility ? `${upgrade.originalValue} -> ${upgrade.value}` : `${baseName}: ${upgrade.originalValue} -> ${upgrade.value}`;
                        }

                        if (enhChanged) {
                            const staticItemName = upgrade.value || document.querySelector(`#batch-inputs-container [data-name="${baseName}"]`)?.dataset.originalValue;
                            let enhLabel = `Enh ${upgrade.enhancement.originalValue} -> ${upgrade.enhancement.value}`;
                            partLabel = itemChanged ? `${partLabel} & ${enhLabel}` : `${staticItemName}: ${enhLabel}`;
                        } else if (levelChanged) {
                            const staticItemName = upgrade.value || document.querySelector(`#batch-inputs-container [data-name="${baseName}"]`)?.dataset.originalValue;
                            let levelLabel = `Lvl ${upgrade.level.originalValue} -> ${upgrade.level.value}`;
                            partLabel = itemChanged ? `${partLabel} & ${levelLabel}` : `${staticItemName}: ${levelLabel}`;
                        }
                    }
                    if (upgrade.triggerChange) {
                        let triggerLabel = 'Trigger Change';
                         if (upgrade.triggerChange.data && upgrade.triggerChange.data.value) {
                            triggerLabel += ` (Val: ${upgrade.triggerChange.data.value})`;
                        }
                        if (!upgrade.isTriggerOnly) {
                            const triggerBaseName = upgrade.value || document.querySelector(`#batch-inputs-container [data-name="${upgrade.name}"]`)?.dataset.originalValue;
                            triggerLabel = `${triggerBaseName} ${triggerLabel}`;
                        } else {
                            const tc = upgrade.triggerChange;
                            const jigsName = `${tc.type.charAt(0).toUpperCase() + tc.type.slice(1)} ${parseInt(tc.index) + 1}`;
                            const associatedSelect = document.querySelector(`#batch-inputs-container [data-name="${jigsName}"]`);
                            if (associatedSelect) {
                                triggerLabel = `${associatedSelect.value} ${triggerLabel}`;
                            }
                        }
                        partLabel = partLabel ? `${partLabel} & ${triggerLabel}` : triggerLabel;
                    }
                }
                if(partLabel) labelParts.push(partLabel);
            }
            return labelParts.filter(p => p).join(' & ');
        };

        const constantUpgrades = allGroupedChanges.filter(c => c.isConstant);
        const individualUpgrades = allGroupedChanges.filter(c => !c.isConstant);
        let itemsAdded = 0;

        if (individualUpgrades.length === 0 && constantUpgrades.length > 0) {
            const queueItem = { upgrades: constantUpgrades, label: generateLabel(constantUpgrades) || 'Constants Only' };
            simulationQueue.push(queueItem);
            itemsAdded = 1;
        } else {
             for (const individual of individualUpgrades) {
                const tc = individual.triggerChange;
                const hasRange = tc && tc.range && tc.increment;

                if (hasRange) {
                    const [startStr, endStr] = tc.range.split('-').map(s => s.trim());
                    const start = parseInt(startStr);
                    const end = parseInt(endStr);
                    const increment = parseInt(tc.increment);

                    if (!isNaN(start) && !isNaN(end) && !isNaN(increment) && increment > 0 && end >= start) {
                        for (let value = start; value <= end; value += increment) {
                            const simUpgrade = JSON.parse(JSON.stringify(individual));
                            simUpgrade.triggerChange.data.value = value;

                            const upgrades = [...constantUpgrades, simUpgrade];
                            simulationQueue.push({ upgrades, label: generateLabel(upgrades) });
                            itemsAdded++;
                        }
                    } else {
                        const upgrades = [...constantUpgrades, individual];
                        simulationQueue.push({ upgrades, label: generateLabel(upgrades) });
                        itemsAdded++;
                    }
                } else {
                    const upgrades = [...constantUpgrades, individual];
                    simulationQueue.push({ upgrades, label: generateLabel(upgrades) });
                    itemsAdded++;
                }
            }
        }

        statusDiv.textContent = `Status: Added ${itemsAdded} simulation(s) to queue.`;
        updateQueuePanelUI();
        resetInputsToBaseline();
    }

    async function startBatch() {
        if (simulationQueue.length === 0) {
            statusDiv.textContent = 'Status: Queue is empty. Add simulations first.';
            return;
        }
        const getPricesButton = document.getElementById('buttonGetPrices');
        if (getPricesButton) {
            console.log("JIGS DEBUG: Clicking 'Get Prices' button as a backup.");
            getPricesButton.click();
        }
        console.log("JIGS DEBUG: startBatch started.");
        updateBaselinesFromInputs();

        const isInfinite = document.getElementById('infinite-queue-checkbox').checked;
        let lastModifiedTriggers = [];
        setRunningState(true);

        try {
            await fetchMarketData();
            if (!isBatchRunning) { statusDiv.textContent = 'Status: Stopped by user.'; return; }
            if (!marketData) { console.error("JIGS DEBUG: Market data not available."); setRunningState(false); return; }
            if (baselineDps === 0) { statusDiv.textContent = 'Error: Please set a baseline first.'; console.warn("JIGS DEBUG: baselineDps is 0."); setRunningState(false); return; }

            const jigsProgressContainer = document.getElementById('jigs-progress-container');
            const jigsProgressBar = document.getElementById('jigs-progress-bar');
            jigsProgressContainer.style.display = 'block';

            const simulationsToRun = [...simulationQueue];
            console.log(`JIGS DEBUG: Found ${simulationsToRun.length} simulations to run from queue. Infinite mode: ${isInfinite}`);

            const multiplier = parseInt(document.querySelector('#sim-settings-group [data-name="Multiplier"]').value) || 1;
            let totalSimsCompleted = 0;

            while (isBatchRunning) { // Main loop for infinite mode
                for (let i = 0; i < simulationsToRun.length; i++) {
                    const simulation = simulationsToRun[i];
                    if (!isBatchRunning) break;

                    jigsProgressBar.style.width = '0%'; // Reset progress for each item in the queue


// --- Reset all page elements to baseline ---
jigsNameToPageElementMap.forEach((pageEl, name) => {
    const jigsEl = document.querySelector(`#batch-inputs-container [data-name="${name}"]`);
    if(jigsEl && pageEl) {
        const originalValue = jigsEl.dataset.originalValue;

        if (pageEl.tagName === 'SELECT') {
            const opt = Array.from(pageEl.options).find(o => o.text === originalValue);
            if (opt) pageEl.value = opt.value;
        } else {
            // For all other inputs (including house number inputs)
            pageEl.value = originalValue;
        }

        // Dispatch change event
        pageEl.dispatchEvent(new Event('change', { bubbles: true }));

        // Dispatch input event for number/text inputs to ensure simulator updates immediately
        if (pageEl.tagName !== 'SELECT') {
            pageEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});

                    // --- Reset all triggers to baseline ---
                    for (const triggerToReset of lastModifiedTriggers) {
                        const type = triggerToReset.type;
                        const index = triggerToReset.index;
                        const triggerRow = document.querySelector(`.trigger-row[data-trigger-type="${type}"][data-trigger-index="${index}"]`);
                        if (triggerRow) {
                            const originalState = {
                                type: type, index: index,
                                dependency: triggerRow.querySelector('.jigs-trigger-dependency').dataset.originalValue,
                                condition: triggerRow.querySelector('.jigs-trigger-condition').dataset.originalValue,
                                comparator: triggerRow.querySelector('.jigs-trigger-comparator').dataset.originalValue,
                                value: triggerRow.querySelector('.jigs-trigger-value').dataset.originalValue
                            };
                            await applyTriggerChanges(originalState);
                        }
                    }
                    lastModifiedTriggers = [];
                    await new Promise(r => setTimeout(r, 50));

                    let totalCost = 0;
                    let totalBooks = 0;
                    let timeToLevelText = '';

                    // --- Apply this simulation's specific upgrades ---
                    for (const upgrade of simulation.upgrades) {
                        if (!upgrade.isTriggerOnly) {
                            const applyChange = (name, newValue) => {
                                const el = jigsNameToPageElementMap.get(name);
                                if (!el) { console.warn(`JIGS: Could not find page element for "${name}" to apply change.`); return; }
                                if (el.tagName === 'SELECT') {
                                    const opt = Array.from(el.options).find(o => o.text === newValue);
                                    if (opt) el.value = opt.value;
                                } else {
                                    el.value = newValue;
                                }
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                                el.dispatchEvent(new Event('input', { bubbles: true }));
                            };

                            if (upgrade.value) { applyChange(upgrade.name, upgrade.value); }
                            if (upgrade.enhancement) { applyChange(upgrade.enhancement.name, upgrade.enhancement.value); }
                            if (upgrade.level) { applyChange(upgrade.level.name, upgrade.level.value); }
                        }
                        if (upgrade.triggerChange) {
                            const tc = upgrade.triggerChange;
                            await applyTriggerChanges({ ...tc.data, type: tc.type, index: tc.index });
                            lastModifiedTriggers.push(tc);
                        }
                    }

                    // --- Update status and run the simulation ---
                    const statusText = isInfinite
                        ? `Status: Simulating (Loop Run, Total: ${totalSimsCompleted + 1}): ${simulation.label}`
                        : `Status: Simulating (${i + 1}/${simulationsToRun.length}): ${simulation.label}`;
                    statusDiv.textContent = statusText;

                    const singleSimProgress = (progress) => {
                        const overallProgress = isInfinite
                            ? progress // In infinite mode, progress bar is for the current item only
                            : ((i + (progress / 100)) / simulationsToRun.length) * 100;
                        jigsProgressBar.style.width = `${overallProgress}%`;
                    };

                    const simResult = await runSimulationMultiple(multiplier, singleSimProgress);
                    const newDps = simResult.averageDps;
                    const newProfit = simResult.averageProfit;
                    const newExp = simResult.averageExp;
                    const newEph = simResult.averageEph;
                    const newDph = simResult.averageDph;

                    totalSimsCompleted++;
                    if (isNaN(newDps)) { console.error(`JIGS DEBUG: DPS is NaN for this upgrade. Skipping.`); continue; }

                    // --- Calculate cost and process results ---
                    for (const upgrade of simulation.upgrades) {
                        if (upgrade.isTriggerOnly) continue;
                        let cost = 0;
                        let booksNeeded = 0;
                        try {
                            if (houseKeywords.includes(upgrade.name)) {
                                const startLvl = parseInt(upgrade.originalValue);
                                const endLvl = parseInt(upgrade.value);
                                const roomRecipes = HOUSE_RECIPES[upgrade.name];
                                if (roomRecipes) {
                                    for (let j = startLvl; j < endLvl; j++) {
                                        if (!isFinite(cost)) break;
                                        const recipe = roomRecipes[j + 1];
                                        if (recipe) {
                                            cost += recipe.gold;
                                            for (const materialId in recipe.materials) {
                                                const materialName = ITEM_ID_TO_NAME_MAP[materialId];
                                                if (!materialName) { cost = Infinity; break; }
                                                const materialKey = materialName.replace(/'/g, '').toLowerCase();
                                                const price = marketData[materialKey]?.seller === -1 ? Infinity : marketData[materialKey]?.seller || Infinity;
                                                if (price === Infinity) { cost = Infinity; break; }
                                                cost += price * recipe.materials[materialId];
                                            }
                                        }
                                    }
                                }
                            } else if (skillKeywords.includes(upgrade.name)) {
                                cost = 0;
                                const startLvl = parseInt(upgrade.originalValue);
                                const endLvl = parseInt(upgrade.value);
                                if (endLvl > startLvl) {
                                    const xpRate = getSkillXpRate(upgrade.name);
                                    if (xpRate > 0) {
                                        const startXp = ABILITY_XP_LEVELS[startLvl] || 0;
                                        const endXp = ABILITY_XP_LEVELS[endLvl] || 0;
                                        const xpNeeded = endXp - startXp;
                                        if (xpNeeded > 0) {
                                            const hoursNeeded = xpNeeded / xpRate;
                                            const daysNeeded = hoursNeeded / 24;
                                            timeToLevelText = daysNeeded < 1 ? `(${(hoursNeeded).toFixed(1)} hrs)` : `(${(daysNeeded).toFixed(1)} days)`;
                                        }
                                    }
                                }
                            } else if (equipmentKeywords.includes(upgrade.name)) {
                                let newPrice = Infinity;
                                if (upgrade.priceOverride) {
                                    const parsedPrice = parseGold(upgrade.priceOverride);
                                    if (isFinite(parsedPrice)) { newPrice = parsedPrice; }
                                } else {
                                    const baseName = upgrade.name;
                                    const newSimName = upgrade.value || document.querySelector(`#batch-inputs-container [data-name="${baseName}"]`)?.dataset.originalValue;
                                    const newMarketName = SIMULATOR_TO_MARKET_MAP[newSimName] || newSimName;
                                    const newEnhName = `${baseName} Enhancement`;
                                    const newEnh = upgrade.enhancement ? upgrade.enhancement.value : document.querySelector(`#batch-inputs-container [data-name="${newEnhName}"]`)?.dataset.originalValue || 0;
                                    const newKey = newEnh == 0 ? newMarketName.replace(/'/g, '').toLowerCase() : `${newMarketName.replace(/'/g, '').toLowerCase()} +${newEnh}`;
                                    const newPriceRaw = marketData[newKey]?.seller;
                                    newPrice = (newPriceRaw === undefined || newPriceRaw === -1) ? Infinity : newPriceRaw;
                                }

                                const baseName = upgrade.name;
                                const oldSimName = upgrade.originalValue || document.querySelector(`#batch-inputs-container [data-name="${baseName}"]`)?.dataset.originalValue;
                                if (!oldSimName) { throw new Error(`Could not determine original item name for ${baseName}`); }

                                const oldMarketName = SIMULATOR_TO_MARKET_MAP[oldSimName] || oldSimName;
                                const oldEnhName = `${baseName} Enhancement`;
                                const oldEnh = upgrade.enhancement ? upgrade.enhancement.originalValue : document.querySelector(`#batch-inputs-container [data-name="${oldEnhName}"]`)?.dataset.originalValue || 0;
                                const oldKey = oldEnh == 0 ? oldMarketName.replace(/'/g, '').toLowerCase() : `${oldMarketName.replace(/'/g, '').toLowerCase()} +${oldEnh}`;
                                const oldPriceRaw = marketData[oldKey]?.buyer;
                                const oldPrice = (oldPriceRaw === undefined || oldPriceRaw === -1 || oldMarketName === 'Empty') ? 0 : oldPriceRaw;

                                cost = newPrice - oldPrice;
                            } else if (upgrade.name.startsWith('Ability')) {
                                const baseName = upgrade.name;
                                const abilityName = upgrade.value || document.querySelector(`#batch-inputs-container [data-name="${baseName}"]`)?.dataset.originalValue;
                                const marketItemName = abilityName;
                                const correctlyCasedKey = Object.keys(SPELL_BOOK_XP).find(k => k.toLowerCase() === marketItemName.toLowerCase());
                                const xpPerBook = correctlyCasedKey ? SPELL_BOOK_XP[correctlyCasedKey] : undefined;
                                if (abilityName === 'Empty' || xpPerBook === undefined) { cost = 0; } else {
                                    const materialKey = marketItemName.replace(/'/g, '').toLowerCase();
                                    const priceOfThisBook = marketData[materialKey]?.seller === -1 ? Infinity : marketData[materialKey]?.seller || Infinity;
                                    const levelName = `${baseName} Level`;
                                    const startLvl = upgrade.level ? upgrade.level.originalValue : document.querySelector(`#batch-inputs-container [data-name="${levelName}"]`)?.dataset.originalValue;
                                    const endLvl = upgrade.level ? upgrade.level.value : document.querySelector(`#batch-inputs-container [data-name="${levelName}"]`)?.dataset.originalValue;
                                    if (Number(endLvl) > Number(startLvl)) {
                                        const startXp = ABILITY_XP_LEVELS[startLvl] || 0;
                                        const endXp = ABILITY_XP_LEVELS[endLvl] || 0;
                                        const xpNeeded = endXp - startXp;
                                        booksNeeded = Math.ceil(xpNeeded / xpPerBook);
                                        cost = booksNeeded * priceOfThisBook;
                                    }
                                }
                            }
                        } catch (e) {
                            cost = Infinity;
                        }
                        if (isFinite(cost)) {
                            totalCost += cost;
                        } else {
                            totalCost = Infinity;
                        }
                        totalBooks += booksNeeded;
                    }

                    const dpsGain = newDps - baselineDps; const percentChange = (baselineDps > 0) ? (dpsGain / baselineDps) * 100 : (dpsGain > 0 ? Infinity : 0);
                    const profitChange = newProfit - baselineProfit; const percentProfitChange = (baselineProfit > 0) ? (profitChange / baselineProfit) * 100 : (profitChange > 0 ? Infinity : 0);
                    const expChange = newExp - baselineExp; const percentExpChange = (baselineExp > 0) ? (expChange / baselineExp) * 100 : (expChange > 0 ? Infinity : 0);
                    const ephChange = newEph - baselineEph; const percentEphChange = (baselineEph > 0) ? (ephChange / baselineEph) * 100 : (ephChange > 0 ? Infinity : 0);
                    const dphChange = newDph - baselineDph; const percentDphChange = (baselineDph > 0) ? (dphChange / baselineDph) * 100 : (dphChange !== 0 ? Infinity : 0);
                    const costPerPercent = (percentChange > 0 && isFinite(totalCost) && totalCost !== 0) ? (totalCost / percentChange) * 0.01 : (totalCost === 0 && dpsGain > 0 ? "Free" : "N/A");
                    const costPerProfitPercent = (percentProfitChange > 0 && isFinite(totalCost) && totalCost !== 0) ? (totalCost / percentProfitChange) * 0.01 : (totalCost === 0 && profitChange > 0 ? "Free" : "N/A");
                    const costPerExpPercent = (percentExpChange > 0 && isFinite(totalCost) && totalCost !== 0) ? (totalCost / percentExpChange) * 0.01 : (totalCost === 0 && expChange > 0 ? "Free" : "N/A");
                    const costPerEphPercent = (percentEphChange > 0 && isFinite(totalCost) && totalCost !== 0) ? (totalCost / percentEphChange) * 0.01 : (totalCost === 0 && ephChange > 0 ? "Free" : "N/A");
                    const timeToPurchaseDays = (baselineProfit > 0 && isFinite(totalCost)) ? (totalCost / baselineProfit) : Infinity;
                    const resultData = { upgrade: simulation.label, cost: totalCost, timeToPurchase: timeToPurchaseDays, dps: dpsGain, percent: percentChange, costPerDps: costPerPercent, books: totalBooks, averageDps: newDps, individualRuns: simResult.individualRuns, profitChange: profitChange, percentProfitChange: percentProfitChange, costPerProfit: costPerProfitPercent, expChange: expChange, percentExpChange: percentExpChange, costPerExp: costPerExpPercent, ephChange: ephChange, percentEphChange: percentEphChange, costPerEph: costPerEphPercent, dphChange: dphChange, percentDphChange: percentDphChange, timeToLevelText: timeToLevelText };
                    addResultRow(resultData);
                    detailedResults.push(resultData);
                } // End for loop

                if (!isInfinite || !isBatchRunning) {
                    break; // Break the main while loop
                }
                console.log("JIGS DEBUG: Infinite run restarting queue.");
                statusDiv.textContent = 'Status: Restarting queue...';
                await new Promise(r => setTimeout(r, 1000)); // Brief pause before restarting
            } // End while loop
        } finally {
            // --- Reset page elements back to their original baseline state ---
            document.querySelectorAll('#batch-inputs-container [data-original-value]').forEach(jigsEl => {
                const name = jigsEl.dataset.name;
                const originalValue = jigsEl.dataset.originalValue;
                const pageEl = jigsNameToPageElementMap.get(name);
                if (pageEl) {
                    if (pageEl.tagName === 'SELECT') {
                        const opt = Array.from(pageEl.options).find(o => o.text === originalValue);
                        if (opt) pageEl.value = opt.value;
                    } else {
                        pageEl.value = originalValue;
                    }
                    pageEl.dispatchEvent(new Event('change', { bubbles: true }));
                    pageEl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            for (const triggerToReset of lastModifiedTriggers) {
                 const type = triggerToReset.type;
                 const index = triggerToReset.index;
                 const triggerRow = document.querySelector(`.trigger-container [data-trigger-type="${type}"][data-trigger-index="${index}"]`);
                 if (triggerRow) {
                       const originalState = {
                           type: type, index: index,
                           dependency: triggerRow.querySelector('.jigs-trigger-dependency').dataset.originalValue,
                           condition: triggerRow.querySelector('.jigs-trigger-condition').dataset.originalValue,
                           comparator: triggerRow.querySelector('.jigs-trigger-comparator').dataset.originalValue,
                           value: triggerRow.querySelector('.jigs-trigger-value').dataset.originalValue
                       };
                       await applyTriggerChanges(originalState);
                 }
            }

            if (isBatchRunning) { statusDiv.textContent = 'Status: Done!'; } // Only shows on normal completion

            if (!isInfinite) {
                simulationQueue = [];
                updateQueuePanelUI();
            }

            if(detailedResults.length > 0) { document.getElementById('export-csv-button').disabled = false; }
            setRunningState(false);
            highlightResults();
            updateColumnVisibility();
        }
    }

    async function importTriggers(isCalledFromBaseline = false) {
        if (!isCalledFromBaseline) {
            console.log("JIGS DEBUG: Starting trigger import.");
            statusDiv.textContent = 'Status: Importing triggers...';
            setRunningState(true);
        }

        const waitForModalContent = () => {
            return new Promise((resolve) => {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    const dependencySelect = document.getElementById('selectTriggerDependency_0');
                    if (dependencySelect && dependencySelect.options.length > 1) {
                        clearInterval(interval);
                        resolve(true);
                    } else if (attempts > 20) { // Timeout after ~5 seconds
                        clearInterval(interval);
                        resolve(false);
                    }
                }, 250);
            });
        };

        try {
            const itemTypes = [
                { type: 'ability', count: 5, prefix: 'buttonAbilityTrigger_' },
                { type: 'food', count: 3, prefix: 'buttonFoodTrigger_' },
                { type: 'drink', count: 3, prefix: 'buttonDrinkTrigger_' }
            ];

            for (const item of itemTypes) {
                for (let i = 0; i < item.count; i++) {
                    if (!isBatchRunning && !isCalledFromBaseline) throw new Error('User stopped');

                    const buttonId = `${item.prefix}${i}`;
                    const triggerButton = document.getElementById(buttonId);
                    const jigsTriggerContainer = document.querySelector(`.trigger-container [data-trigger-type="${item.type}"][data-trigger-index="${i}"]`)?.closest('.trigger-container');
                    if (!triggerButton || !jigsTriggerContainer) continue;

                    if (!isCalledFromBaseline) {
                        statusDiv.textContent = `Importing for ${item.type} ${i + 1}...`;
                    }

                    triggerButton.click();

                    if (!await waitForModalContent()) {
                          console.warn(`JIGS: Modal content for ${buttonId} did not load.`);
                          const closeBtn = document.querySelector('#triggerModal button.btn-close');
                          if (closeBtn) closeBtn.click();
                          await new Promise(r => setTimeout(r, 250));
                          continue;
                    }

                    const scrapeAndSetSelect = (pageSelect, jigsSelect) => {
                        jigsSelect.innerHTML = '';
                        const selectedText = pageSelect.selectedOptions.length > 0 ? pageSelect.selectedOptions[0].text : '';
                        for (const option of pageSelect.options) {
                            jigsSelect.add(new Option(option.text, option.text));
                        }
                        jigsSelect.value = selectedText;
                        jigsSelect.dataset.originalValue = selectedText;
                    };

                    scrapeAndSetSelect(document.getElementById('selectTriggerDependency_0'), jigsTriggerContainer.querySelector('.jigs-trigger-dependency'));
                    scrapeAndSetSelect(document.getElementById('selectTriggerCondition_0'), jigsTriggerContainer.querySelector('.jigs-trigger-condition'));
                    scrapeAndSetSelect(document.getElementById('selectTriggerComparator_0'), jigsTriggerContainer.querySelector('.jigs-trigger-comparator'));

                    const valEl = document.getElementById('inputTriggerValue_0');
                    const jigsVal = jigsTriggerContainer.querySelector('.jigs-trigger-value');
                    jigsVal.value = valEl.value;
                    jigsVal.dataset.originalValue = valEl.value;

                    const rangeEl = jigsTriggerContainer.querySelector('.jigs-trigger-range');
                    rangeEl.value = '';
                    rangeEl.dataset.originalValue = '';
                    const incEl = jigsTriggerContainer.querySelector('.jigs-trigger-increment');
                    incEl.value = '';
                    incEl.dataset.originalValue = '';

                    document.querySelector('#triggerModal button.btn-close').click();
                    await new Promise(r => setTimeout(r, 250));
                }
            }
            if (!isCalledFromBaseline) {
                statusDiv.textContent = 'Status: Trigger import complete.';
            }
        } catch (e) {
            if (e.message === 'User stopped') {
                statusDiv.textContent = 'Status: Trigger import stopped by user.';
            } else {
                console.error('JIGS: Error during trigger import.', e);
                statusDiv.textContent = 'Error during trigger import. Check console.';
            }
        } finally {
            if (!isCalledFromBaseline) {
                setRunningState(false);
            }
        }
    }

    function applySavedPanelStates() {
        const panels = [
            { id: 'batch-panel', toggleId: 'batch-toggle' },
            { id: 'jigs-results-panel', toggleId: 'results-toggle' },
            { id: 'jigs-queue-panel', toggleId: 'queue-toggle' }
        ];
        panels.forEach(p => {
            const panel = document.getElementById(p.id);
            if (!panel) return;

            const savedData = GM_getValue(`jigs_panel_positions_${p.id}`);
            if (savedData) {
                if (savedData.top && savedData.left) {
                    panel.style.top = savedData.top;
                    panel.style.left = savedData.left;
                    panel.style.bottom = 'auto';
                    panel.style.right = 'auto';
                }
                if (savedData.width) panel.style.width = savedData.width;
                if (savedData.height) panel.style.height = savedData.height;
            }

            const isMinimized = GM_getValue(`jigs_panel_minimized_${p.id}`, false);
            if (isMinimized) {
                panel.classList.add('jigs-minimized');
                const toggleButton = document.getElementById(p.toggleId);
                if (toggleButton) toggleButton.textContent = '+';
            }
        });
    }

    // --- 5. INITIALIZATION ---
    async function initializeScript() {
        console.log("JIGS DEBUG: Step 1 - initializeScript started.");
        if (!await fetchJigsData()) {
            statusDiv.textContent = 'Error: Could not load critical JIGS data. The script cannot continue.';
            return;
        }
        console.log("JIGS DEBUG: Step 2 - fetchJigsData successful.");
        const controlsPanel = document.getElementById('batch-panel');
        controlsPanel.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;
            switch (button.id) {
                case 'batch-toggle':
                    controlsPanel.classList.toggle('jigs-minimized');
                    button.textContent = controlsPanel.classList.contains('jigs-minimized') ? '+' : '-';
                    GM_setValue(`jigs_panel_minimized_batch-panel`, controlsPanel.classList.contains('jigs-minimized'));
                    break;
                case 'run-batch-button':
                    startBatch();
                    break;
                case 'stop-batch-button':
                    isBatchRunning = false;
                    statusDiv.textContent = 'Status: Stopping...';
                    const stopSimButton = document.getElementById('buttonStopSimulation');
                    if (stopSimButton) {
                        stopSimButton.click();
                    }
                    break;
                case 'capture-setup-button':
                    buildInputsUI();
                    break;
                case 'update-baseline-button':
                    const importTriggers = document.getElementById('import-triggers-checkbox').checked;
                    updateBaseline(importTriggers);
                    break;
                case 'reset-button':
                    resetInputsToBaseline();
                    break;
                case 'add-to-queue-button':
                    addChangesToQueue();
                    break;
                case 'reset-panels-button':
                    resetPanelPositions();
                    break;
            }
        });
const resultsPanel = document.getElementById('jigs-results-panel');
        resultsPanel.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;
            switch (button.id) {
                case 'reset-panels-button-results':
                    resetPanelPositions();
                    break;
                case 'results-toggle':
                    resultsPanel.classList.toggle('jigs-minimized');
                    button.textContent = resultsPanel.classList.contains('jigs-minimized') ? '+' : '-';
                    GM_setValue(`jigs_panel_minimized_jigs-results-panel`, resultsPanel.classList.contains('jigs-minimized'));
                    break;
                case 'clear-results-button':
                    console.log("JIGS DEBUG: Clearing all results.");
                    document.querySelector('#batch-results-table tbody').innerHTML = '';
                    detailedResults = [];
                    document.getElementById('export-csv-button').disabled = true;
                    break;
                case 'export-csv-button':
                    exportResultsToCSV();
                    break;
            }
        });

const queuePanel = document.getElementById('jigs-queue-panel');
        queuePanel.addEventListener('click', (event) => {
            const target = event.target;

            // Added check for reset button below
            if (target.matches('#queue-toggle') || target.matches('#clear-queue-button') || target.matches('#reset-panels-button-queue')) {
                switch (target.id) {
                    case 'reset-panels-button-queue':
                        resetPanelPositions();
                        break;
                    case 'queue-toggle':
                        queuePanel.classList.toggle('jigs-minimized');
                        target.textContent = queuePanel.classList.contains('jigs-minimized') ? '+' : '-';
                        GM_setValue(`jigs_panel_minimized_jigs-queue-panel`, queuePanel.classList.contains('jigs-minimized'));
                        break;
                    case 'clear-queue-button':
                        console.log("JIGS DEBUG: Clearing simulation queue.");
                        simulationQueue = [];
                        updateQueuePanelUI();
                        break;
                }
                return;
            }

            if (target.classList.contains('jigs-remove-queue-item-button')) {
                const indexToRemove = parseInt(target.dataset.index, 10);
                if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < simulationQueue.length) {
                    console.log(`JIGS DEBUG: Removing item at index ${indexToRemove} from queue.`);
                    simulationQueue.splice(indexToRemove, 1);
                    updateQueuePanelUI();
                }
            }
        });

        queuePanel.addEventListener('change', (event) => {
            if (event.target.id === 'infinite-queue-checkbox') {
                updateQueueEstimate();
            }
        });

        const inputsContainer = document.getElementById('batch-inputs-container');
        if (inputsContainer) {
            inputsContainer.addEventListener('change', (event) => {
                if (event.target.dataset.name === 'Multiplier') {
                    updateQueueEstimate();
                }
                if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                    updateModifiedIndicator(event.target);
                }
            }, true);
        }

        controlsPanel.addEventListener('change', async (event) => {
            if (event.target.id === 'jigs-player-select') {
                const selectedPlayerName = event.target.value;
                switchPlayerAndCapture(selectedPlayerName);
            }
        });
        const columnToggleContainer = document.getElementById('column-toggle-container');
        if (columnToggleContainer) {
            columnToggleContainer.addEventListener('change', updateColumnVisibility);
        }
        document.getElementById('baseline-dps-input').addEventListener('change', updateBaselinesFromInputs);
        document.getElementById('baseline-profit-input').addEventListener('change', updateBaselinesFromInputs);
        document.getElementById('baseline-exp-input').addEventListener('change', updateBaselinesFromInputs);
        document.getElementById('baseline-eph-input').addEventListener('change', updateBaselinesFromInputs);
        document.getElementById('baseline-dph-input').addEventListener('change', updateBaselinesFromInputs);
        const resultsThead = document.querySelector('#batch-results-table thead');
        if (resultsThead) {
            resultsThead.addEventListener('click', (event) => {
                const headerCell = event.target.closest('th');
                if (!headerCell) return;
                const sortKey = headerCell.dataset.sortKey;
                if (!sortKey) return;
                const tbody = headerCell.closest('table').querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const isDesc = headerCell.classList.contains('sorted-desc');
                const direction = isDesc ? 1 : -1;
                rows.sort((a, b) => {
                    const valA = a.dataset[sortKey];
                    const valB = b.dataset[sortKey];
                    const numA = parseFloat(valA);
                    const numB = parseFloat(valB);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return (numA - numB) * direction;
                    }
                    return valA.localeCompare(valB) * direction;
                });
                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
                headerCell.parentElement.querySelectorAll('th').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc'));
                if (direction === 1) {
                    headerCell.classList.add('sorted-asc');
                } else {
                    headerCell.classList.add('sorted-desc');
                }
            });
        } else {
            console.error("JIGS Error: Could not find the results table header to attach the sort listener.");
        }
        statusDiv.textContent = 'Status: Ready. Please import a character.';
        document.getElementById('capture-setup-button').disabled = false;
        const findButtonInterval = setInterval(() => {
            const importButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Import solo/group'));
            if (importButton) {
                clearInterval(findButtonInterval);
                importButton.addEventListener('click', () => {
                    statusDiv.textContent = 'Import initiated! Waiting for player names and initial sim...';
                    const resultsContainer = document.getElementById('simulationResultTotalDamageDone');
                    if (resultsContainer) resultsContainer.innerHTML = '';
                    const baselineObserver = new MutationObserver(() => {
                        const dpsVal = getDpsValue();
                        if (dpsVal) {
                            baselineObserver.disconnect();
                            baselineDps = normalizeAndParseFloat(dpsVal);
                            baselineProfit = getProfitValue() || 0;
                            baselineExp = getExpValue() || 0;
                            baselineEph = getEphValue() || 0;
                            baselineDph = getDphValue() || 0;
                            document.getElementById('baseline-dps-input').value = baselineDps.toFixed(2);
                            document.getElementById('baseline-profit-input').value = formatGold(baselineProfit);
                            document.getElementById('baseline-exp-input').value = baselineExp.toLocaleString();
                            document.getElementById('baseline-eph-input').value = baselineEph.toFixed(2);
                            document.getElementById('baseline-dph-input').value = baselineDph.toFixed(2);

                            captureBaselineSkillRates();
                            updateQueueEstimate();
                        }
                    });
                    baselineObserver.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    let uiBuildAttempt = 0;
                    const uiBuilderInterval = setInterval(() => {
                        uiBuildAttempt++;
                        const playerTabs = Array.from(document.querySelectorAll('a[id^="player"][id$="-tab"]'));
                        const namesAreLoaded = playerTabs.length > 0 && playerTabs.some(tab => !tab.textContent.trim().startsWith('Player '));
                        if (namesAreLoaded) {
                            clearInterval(uiBuilderInterval);
                            buildInputsUI();
                        } else if (uiBuildAttempt > 50) {
                            clearInterval(uiBuilderInterval);
                            statusDiv.textContent = 'Status: Could not detect player names. Please use Capture Setup.';
                        }
                    }, 200);
                });
            }
        }, 500);
        updateColumnVisibility();

        makeDraggable(document.getElementById('batch-panel'), document.getElementById('batch-header'));
        makeResizable(document.getElementById('batch-panel'));

        makeDraggable(document.getElementById('jigs-results-panel'), document.getElementById('jigs-results-header'));
        makeResizable(document.getElementById('jigs-results-panel'));

        makeDraggable(document.getElementById('jigs-queue-panel'), document.getElementById('jigs-queue-header'));
        makeResizable(document.getElementById('jigs-queue-panel'));

        applySavedPanelStates();
    }
    initializeScript();
})();