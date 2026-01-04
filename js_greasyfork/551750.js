// ==UserScript==
// @name         FarmRPG Buddy Doll Simulator
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Simulates the number of picks (rolls) required to obtain K unique items out of N total items, condensing the longest 10% of sequences.
// @author       ClientCoin
// @match        *farmrpg.com/index.php
// @match        *farmrpg.com/
// @match        *alpha.farmrpg.com/
// @match        *alpha.farmrpg.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/551750/FarmRPG%20Buddy%20Doll%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/551750/FarmRPG%20Buddy%20Doll%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------------------------------------------------------------------------------------
    // 1. UI STYLING
    // ------------------------------------------------------------------------------------------------

    GM_addStyle(`
        #applet-container {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            user-select: none;
        }
        #toggle-button {
            padding: 8px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        #applet-content {
            background-color: #001f3f;
            color: white;
            border: 2px solid #005f9f;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
            width: 450px;
            min-width: 250px;
            max-width: 1200px;
            display: none;
            overflow: hidden;
            position: relative;
        }
        #resize-handle {
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 100%;
            cursor: w-resize;
            z-index: 100000;
            border-left: 1px solid rgba(255, 255, 255, 0.5);
        }
        #config-section {
            border-bottom: 1px solid #005f9f;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        #config-section label {
            display: inline-block;
            width: 150px;
            margin-top: 5px;
        }
        #config-section input {
            width: 50px;
            padding: 2px;
            border: 1px solid #ccc;
            background-color: #eee;
            color: black;
            text-align: right;
        }
        #run-button {
            padding: 5px 15px;
            background-color: green;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
        }
        #simulationTable {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
            table-layout: fixed;
        }
        #simulationTable th, #simulationTable td {
            padding: 4px 5px;
            border: 1px solid #005f9f;
            text-align: center;
            word-wrap: break-word;
        }
        #simulationTable th {
            background-color: #003366;
        }
        .highlight { color: #ffcc00; font-weight: bold; }
        .cdf-top { background-color: lightgreen; color: black; font-weight: bold; }
        .cdf-bottom { background-color: lightcoral; color: black; font-weight: bold; }
    `);

    // ------------------------------------------------------------------------------------------------
    // 2. STATE AND CONFIGURATION
    // ------------------------------------------------------------------------------------------------

    let simulationRunning = false;
    let counters = {};
    let latestSequences = {};
    let longestSequence = "";
    let latestSequence = "";
    let totalIterations = 0;

    // Configurable defaults
    let totalItems = 7;
    let requiredItems = 1;
    const simulationDurationMs = 2000; // 2 seconds

    // Dynamic probability setup
    let options = [];
    let requiredPicks = new Set();
    let cumulativeProbabilities = [];
    let cumulativeSum = 0;

    // Resizing state
    let isResizing = false;
    const minWidth = 250;
    const maxWidth = 1200;

    // Condensation threshold for the table display
    const CONDENSE_THRESHOLD_PERCENT = 90.0; // Condense results after the top 90% is displayed

    // ------------------------------------------------------------------------------------------------
    // 3. CORE SIMULATION FUNCTIONS
    // ------------------------------------------------------------------------------------------------

    function setupSimulation(N, K) {
        counters = {};
        latestSequences = {};
        longestSequence = "";
        latestSequence = "";
        totalIterations = 0;

        options = Array.from({ length: N }, (_, i) =>
            i < 26 ? String.fromCharCode(65 + i) : (i + 1).toString()
        );

        requiredPicks = new Set(options.slice(0, K));
        cumulativeProbabilities = [];
        cumulativeSum = N;
        let runningSum = 0;

        options.forEach(option => {
            runningSum += 1;
            cumulativeProbabilities.push({ option, probability: runningSum });
        });
    }

    function pickWeightedOption() {
        let randomValue = Math.random() * cumulativeSum;
        const result = cumulativeProbabilities.find(entry => randomValue <= entry.probability);
        return result ? result.option : null;
    }

    function generateSequence() {
        let sequence = [];
        let seen = new Set();

        while (![...requiredPicks].every(pick => seen.has(pick))) {
            let pick = pickWeightedOption();
            if (pick) {
                sequence.push(pick);
                seen.add(pick);
            } else {
                 break;
            }
        }
        return sequence.join("");
    }

    function runSimulation(iterations) {
        for (let i = 0; i < iterations; i++) {
            let sequence = generateSequence();
            let numPicks = sequence.length;

            latestSequence = sequence;
            if (sequence.length > longestSequence.length) {
                longestSequence = sequence;
            }

            counters[numPicks] = (counters[numPicks] || 0) + 1;
            latestSequences[numPicks] = sequence;
        }
        totalIterations += iterations;
    }

    // ------------------------------------------------------------------------------------------------
    // 4. RESIZING LOGIC
    // ------------------------------------------------------------------------------------------------

    function startResize(e) {
        isResizing = true;
        e.preventDefault();
    }

    function resize(e) {
        if (!isResizing) return;

        const container = document.getElementById('applet-container');
        const appletContent = document.getElementById('applet-content');

        const newWidth = container.offsetWidth + (container.getBoundingClientRect().left - e.clientX);

        let clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        appletContent.style.width = clampedWidth + 'px';
    }

    function stopResize() {
        isResizing = false;
    }

    // ------------------------------------------------------------------------------------------------
    // 5. UI MANIPULATION AND INTERACTIVITY
    // ------------------------------------------------------------------------------------------------

    function createBaseUI() {
        const container = document.createElement('div');
        container.id = 'applet-container';
        document.body.appendChild(container);

        // 1. Toggle Button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-button';
        toggleButton.textContent = 'FarmRPG Buddy Doll Sim 📊';
        toggleButton.addEventListener('click', toggleAppletVisibility);
        container.appendChild(toggleButton);

        // 2. Applet Content
        const content = document.createElement('div');
        content.id = 'applet-content';
        content.innerHTML = `
            <div id="resize-handle"></div>
            <h3 style="text-align: center; color: #ffcc00; margin-top: 0;">Buddy Doll Simulator</h3>
            <div id="config-section">
                <label for="input-total">Total Items (N):</label>
                <input type="number" id="input-total" min="1" max="100" value="${totalItems}"><br>
                <label for="input-required">Required Unique Items (K):</label>
                <input type="number" id="input-required" min="1" max="100" value="${requiredItems}"><br>
                <button id="run-button">START SIMULATION (2s)</button>
            </div>
            <div id="status-display">
                <p>Status: <span id="sim-status" class="highlight">Ready</span> | Total Runs: <span id="total-runs" class="highlight">0</span></p>
                <p>Latest Seq: <span id="latest-seq" class="highlight"></span></p>
                <p>Longest Seq: <span id="longest-seq" class="highlight"></span></p>
            </div>
            <table id="simulationTable"></table>
        `;
        container.appendChild(content);

        // Attach event listeners
        document.getElementById('run-button').addEventListener('click', startTimedSimulation);

        // Attach resizing listeners
        document.getElementById('resize-handle').addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    function toggleAppletVisibility() {
        const content = document.getElementById('applet-content');
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    }

    function updateUI(status) {
        const table = document.getElementById("simulationTable");
        const statusEl = document.getElementById("sim-status");
        const runsEl = document.getElementById("total-runs");
        const latestEl = document.getElementById("latest-seq");
        const longestEl = document.getElementById("longest-seq");
        const runButton = document.getElementById("run-button");

        statusEl.textContent = status;
        runsEl.textContent = totalIterations.toLocaleString();
        latestEl.textContent = latestSequence ? `${latestSequence} (${latestSequence.length} picks)` : 'N/A';
        longestEl.textContent = longestSequence ? `${longestSequence} (${longestSequence.length} picks)` : 'N/A';


        if (simulationRunning) {
             runButton.style.backgroundColor = 'red';
             runButton.textContent = 'STOPPING...';
             runButton.disabled = true;
        } else {
             runButton.style.backgroundColor = 'green';
             runButton.textContent = 'START SIMULATION (2s)';
             runButton.disabled = false;
        }

        if (totalIterations === 0) {
            table.innerHTML = "<tr><td>Click 'Start' to run simulation.</td></tr>";
            return;
        }

        table.innerHTML = "";

        // Header
        let headerRow = table.insertRow();
        ["Picks", "Count", "Percent (%)", "CDF (%)", "Latest Seq"].forEach(text => {
            let cell = document.createElement("th");
            cell.textContent = text;
            headerRow.appendChild(cell);
        });

        // Data
        let total = Object.values(counters).reduce((a, b) => a + b, 0);
        let cumulativePercentSum = 0;
        let finalCDFPercent = 0;
        let condensedRows = [];

        Object.keys(counters)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach(num => {
                let count = counters[num];
                let percentage = (count / total) * 100;

                // CHECK NEW CONDENSATION THRESHOLD (90.0)
                if (cumulativePercentSum >= CONDENSE_THRESHOLD_PERCENT) {
                    condensedRows.push({ num, count, percentage });
                    finalCDFPercent += percentage;
                    return;
                }

                let row = table.insertRow();
                row.insertCell(0).textContent = num;
                row.insertCell(1).textContent = count.toLocaleString();
                row.insertCell(2).textContent = percentage.toFixed(3);

                cumulativePercentSum += percentage;

                let cdfCell = row.insertCell(3);
                if (cumulativePercentSum < 50) {
                    cdfCell.className = 'cdf-top';
                    cdfCell.textContent = `Top ${cumulativePercentSum.toFixed(2)}%`;
                } else {
                    cdfCell.className = 'cdf-bottom';
                    cdfCell.textContent = `Bottom ${(100 - cumulativePercentSum).toFixed(2)}%`;
                }
                row.insertCell(4).textContent = latestSequences[num] || "-";
            });

        // Condensed Row (Bottom 10%)
        if (condensedRows.length > 0) {
            let row = table.insertRow();
            row.insertCell(0).textContent = `≥ ${condensedRows[0].num}`;
            row.insertCell(1).textContent = condensedRows.reduce((sum, r) => sum + r.count, 0).toLocaleString();
            row.insertCell(2).textContent = finalCDFPercent.toFixed(3);
            let cdfCell = row.insertCell(3);
            cdfCell.className = 'cdf-bottom';
            // Show the actual percentage of the tail
            cdfCell.textContent = `Bottom ${finalCDFPercent.toFixed(2)}%`;
            row.insertCell(4).textContent = "...";
        }
    }

    // ------------------------------------------------------------------------------------------------
    // 6. TIMED EXECUTION CONTROL
    // ------------------------------------------------------------------------------------------------

    async function startTimedSimulation() {
        if (simulationRunning) return;

        // 1. Read and validate inputs
        const inputN = parseInt(document.getElementById('input-total').value);
        const inputK = parseInt(document.getElementById('input-required').value);

        if (isNaN(inputN) || isNaN(inputK) || inputN < 1 || inputK < 1 || inputK > inputN) {
            alert("Invalid configuration: Total Items (N) and Required Items (K) must be positive integers, and K cannot be greater than N.");
            return;
        }

        totalItems = inputN;
        requiredItems = inputK;

        // 2. Setup and initial UI update
        setupSimulation(totalItems, requiredItems);
        simulationRunning = true;
        updateUI("Running...");

        const startTime = performance.now();
        const batchSize = 5000;

        while (simulationRunning && (performance.now() - startTime) < simulationDurationMs) {
            runSimulation(batchSize);
            updateUI("Running...");
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // 3. Finalization
        simulationRunning = false;
        updateUI("Finished!");
    }

    // ------------------------------------------------------------------------------------------------
    // 7. INITIALIZATION
    // ------------------------------------------------------------------------------------------------

    createBaseUI();
    setupSimulation(totalItems, requiredItems);
    updateUI("Ready");

})();