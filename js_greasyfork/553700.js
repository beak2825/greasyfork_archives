// ==UserScript==
// @name         JIGS Stats
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Companion statistics panel for JIGS, with selectable metrics, advanced stats, charts with CI, collapsible sections
// @author       Jigglymoose & Frotty
// @license      MIT
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @match        https://shykai.github.io/MWICombatSimulator/dist/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553700/JIGS%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/553700/JIGS%20Stats.meta.js
// ==/UserScript==

(function() { // <--- Start of main IIFE
    'use strict';

    console.log("JIGS Stats v1.1.1 Loaded"); // <-- Updated version

    // --- CONFIGURATION & STATE VARIABLES ---
    const METRIC_CONFIG = {
        'dpsChange':    { label: 'DPS Δ',        isCostMetric: false, datasetKey: 'dpsChange',    format: 'number', allowZero: true,  chartLabel: 'DPS Change' },
        'profitChange': { label: 'Profit Δ',     isCostMetric: false, datasetKey: 'profitChange',   format: 'gold',   allowZero: true,  chartLabel: 'Profit Change' },
        'expChange':    { label: 'Exp/Hr Δ',     isCostMetric: false, datasetKey: 'expChange',    format: 'number', allowZero: true,  chartLabel: 'Exp/Hr Change' },
        'ephChange':    { label: 'EPH Δ',        isCostMetric: false, datasetKey: 'ephChange',    format: 'number', allowZero: true,  chartLabel: 'EPH Change' },
        'cost':         { label: 'Cost',         isCostMetric: true,  datasetKey: 'cost',         format: 'gold',   allowZero: false, chartLabel: 'Cost', hidden: true },
        'timeToPurchase': { label: 'Time',       isCostMetric: true,  datasetKey: 'timeToPurchase', format: 'time',   allowZero: true,  chartLabel: 'Time', hidden: true } // *** FIX 1: Corrected datasetKey ***
    };

    let currentMetric = GM_getValue('jig_rigger_current_metric', 'dpsChange');
    if (currentMetric !== 'trueValueSummary' && (!METRIC_CONFIG[currentMetric] || METRIC_CONFIG[currentMetric].hidden)) {
        currentMetric = 'dpsChange';
    }

    let chartInstance = null; let isChartVisible = false; let currentSortKey = null; let currentSortDirection = 1;
    const itemAggregation = new Map(); const lineByLineData = []; let updateCounter = 0;
    let originalPanelPosition = { top: '10px', left: '10px' };
    let isWinsorized = false; // State for Winsorizing
    let isIsolateTrueValue = false; // State for Isolating TV on chart

    // --- MODIFIED: Store all baseline stats ---
    let baselineProfit = 0;
    let baselineDps = 0;
    let baselineExp = 0;
    let baselineEph = 0;

    // =============================================
    // === FUNCTION DEFINITIONS                  ===
    // =============================================
    function makeDraggable(panel, handle) { let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; handle.onmousedown = dragMouseDown; function dragMouseDown(e) { e = e || window.event; if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; if (!panel.style.top && !panel.style.left) { const rect = panel.getBoundingClientRect(); panel.style.top = rect.top + 'px'; panel.style.left = rect.left + 'px'; } document.onmouseup = closeDragElement; document.onmousemove = elementDrag; } function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; panel.style.top = (panel.offsetTop - pos2) + "px"; panel.style.left = (panel.offsetLeft - pos1) + "px"; } function closeDragElement() { document.onmouseup = null; document.onmousemove = null; const savedPositions = GM_getValue('jig_rigger_panel_position', {}); savedPositions.top = panel.style.top; savedPositions.left = panel.style.left; GM_setValue('jig_rigger_panel_position', savedPositions); } }
    function makeResizable(panel, resizer) { let startX, startY, startWidth, startHeight; resizer.addEventListener('mousedown', initDrag, false); function initDrag(e) { startX = e.clientX; startY = e.clientY; startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10); startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10); document.documentElement.addEventListener('mousemove', doDrag, false); document.documentElement.addEventListener('mouseup', stopDrag, false); } function doDrag(e) { panel.style.width = (startWidth + e.clientX - startX) + 'px'; panel.style.height = (startHeight + e.clientY - startY) + 'px'; } function stopDrag() { document.documentElement.removeEventListener('mousemove', doDrag, false); document.documentElement.removeEventListener('mouseup', stopDrag, false); const savedPositions = GM_getValue('jig_rigger_panel_position', {}); savedPositions.width = panel.style.width; savedPositions.height = panel.style.height; GM_setValue('jig_rigger_panel_position', savedPositions); } }
    function extractItemName(upgradeText) { return upgradeText; }

    function parseValueFromDataset(rawValue) {
        if (rawValue === 'N/A' || rawValue === undefined || rawValue === null) return 0;
        if (rawValue === 'Free') return 0;
        if (rawValue === 'Never' || rawValue === 'Infinity') return Infinity;
        const numValue = parseFloat(rawValue);
        return isNaN(numValue) ? 0 : numValue;
    }

    function parseGoldValue(text) {
        if (!text) return 0;
        text = text.trim().toUpperCase().replace(/,/g, '');
        const num = parseFloat(text);
        if (isNaN(num)) return 0;
        if (text.endsWith('K')) return num * 1000;
        if (text.endsWith('M')) return num * 1000000;
        if (text.endsWith('B')) return num * 1000000000;
        return num;
    }

    function parseNumberValue(text) {
        if (!text) return 0;
        text = text.trim().replace(/,/g, '');
        const num = parseFloat(text);
        return isNaN(num) ? 0 : num;
    }

    // --- MODIFIED: Function to find all baseline stats from INPUT fields ---
    function getBaselineStats() {
         try {
             // Target the input fields directly
             const baseProfitInput = document.getElementById('baseline-profit-input');
             const baseDpsInput = document.getElementById('baseline-dps-input');
             const baseExpInput = document.getElementById('baseline-exp-input');
             const baseEphInput = document.getElementById('baseline-eph-input');

             // Read the .value property and parse it
             if (baseProfitInput) {
                 baselineProfit = parseGoldValue(baseProfitInput.value); // Use parseGoldValue
                 console.log('JIGS Stats: Baseline Profit captured from input:', baselineProfit);
             } else { console.warn('JIGS Stats: Could not find #baseline-profit-input.'); baselineProfit = 0;}

             if (baseDpsInput) {
                 baselineDps = parseNumberValue(baseDpsInput.value); // Use parseNumberValue
                 console.log('JIGS Stats: Baseline DPS captured from input:', baselineDps);
             } else { console.warn('JIGS Stats: Could not find #baseline-dps-input.'); baselineDps = 0;}

             if (baseExpInput) {
                 // Exp might have commas, remove them before parsing
                 baselineExp = parseNumberValue(baseExpInput.value.replace(/,/g, '')); // Use parseNumberValue
                 console.log('JIGS Stats: Baseline Exp/Hr captured from input:', baselineExp);
             } else { console.warn('JIGS Stats: Could not find #baseline-exp-input.'); baselineExp = 0;}

             if (baseEphInput) {
                 baselineEph = parseNumberValue(baseEphInput.value); // Use parseNumberValue
                 console.log('JIGS Stats: Baseline EPH captured from input:', baselineEph);
             } else { console.warn('JIGS Stats: Could not find #baseline-eph-input.'); baselineEph = 0;}

         } catch (e) {
              console.error('JIGS Stats: Error capturing baseline stats from inputs.', e);
             // Default all baselines to 0 on error
             baselineProfit = 0;
             baselineDps = 0;
             baselineExp = 0;
             baselineEph = 0;
         }
    }

    function isNA(rawValue) {
        return rawValue === 'N/A' || rawValue === undefined || rawValue === null || rawValue === 'Never' || rawValue === 'Infinity';
    }

    // --- Formatting Functions ---
    function formatValue(value, metricKey, allowZeroOverride = null) {
        const formatConfig = METRIC_CONFIG[metricKey];
        if (!formatConfig) {
            if (metricKey === 'roi') return formatPercent(value);
            if (metricKey.startsWith('gPer')) return formatGoldValue(value, true);
            return "N/A";
        }
        const allowZero = allowZeroOverride ?? formatConfig.allowZero;
        if (value === null || value === undefined || !isFinite(value)) return 'N/A';
        if (value === 0 && !allowZero) return 'N/A';
        switch(formatConfig.format) {
            case 'gold': return formatGoldValue(value, allowZero);
            case 'percent': return formatPercent(value);
            case 'time': return formatTime(value, metricKey); // <-- Pass metricKey
            case 'number': default: return formatNumber(value, 2);
        }
    }
    function formatGoldValue(value, allowZero = false) { if (value === null || value === undefined || !isFinite(value)) return 'N/A'; if (value === 0) return allowZero ? '0' : 'N/A'; if (Math.abs(value) < 1000) return Math.round(value).toLocaleString(); if (Math.abs(value) < 1000000) return `${(value / 1000).toFixed(1)}k`; return `${(value / 1000000).toFixed(2)}M`; }
    function formatNumber(value, decimals = 2) { if (value === null || value === undefined || !isFinite(value)) return 'N/A'; return value.toFixed(decimals); }
    function formatPercent(value) { if (value === null || value === undefined || !isFinite(value)) return 'N/A'; if (value === Infinity) return '∞'; return `${value.toFixed(1)}%`; }
    // --- THIS IS THE CORRECTED v1.1.7 FUNCTION ---
    function formatTime(days, metricKey = null) {
        // --- MODIFIED: Handle 0 specifically for timeToPurchase ---
        if (days === 0 && metricKey === 'timeToPurchase') {
             return 'Never'; // If TV of Time is 0, it means underlying was likely Infinity
        }
        // --- END MODIFICATION ---
        if (!isFinite(days) || days === Infinity || days === null) { return 'Never'; }
        if (days <= 0) { return 'Free'; } // Keep "Free" for other potential time metrics or negative values
        const hours = days * 24;
        if (hours < 1) { const minutes = hours * 60; return `${minutes.toFixed(0)} min`; }
        if (days < 1) { return `${hours.toFixed(1)} hrs`; }
        const months = days / 30.44;
        if (months >= 1) { return `${months.toFixed(1)} mon`; }
        return `${days.toFixed(1)} days`;
    }

    // --- Stat Calculation Functions ---
    function winsorizeData(values, percentile = 0.05) {
        const finiteValues = values.filter(isFinite);
        if (finiteValues.length < 3) return values;
        const sorted = [...finiteValues].sort((a, b) => a - b);
        const n = sorted.length;
        const numToClip = Math.ceil(percentile * n);
        if (numToClip === 0 || numToClip * 2 >= n) { return values; }
        const lowerLimit = sorted[numToClip];
        const upperLimit = sorted[n - 1 - numToClip];
        if (lowerLimit === upperLimit) return values;
        return values.map(val => {
            if (!isFinite(val)) return val;
            if (val < lowerLimit) return lowerLimit;
            if (val > upperLimit) return upperLimit;
            return val;
        });
    }
    function calculateMedian(values, allowZero) { if (!values || values.length === 0) return 0; const filteredValues = allowZero ? values.filter(isFinite) : values.filter(v => v !== 0 && isFinite(v)); if (filteredValues.length === 0) return 0; const sorted = [...filteredValues].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); if (sorted.length % 2 === 0) { return (sorted[middle - 1] + sorted[middle]) / 2; } else { return sorted[middle]; } }
    function calculateStatistics(values, allowZero) { const filteredValues = allowZero ? values.filter(isFinite) : values.filter(v => v !== 0 && isFinite(v)); const n = filteredValues.length; if (n === 0) return { mean: 0, variance: 0, stddev: 0, se: 0, n: 0 }; const mean = filteredValues.reduce((sum, val) => sum + val, 0) / n; if (n === 1) return { mean: mean, variance: 0, stddev: 0, se: 0, n: n }; const variance = filteredValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1); const stddev = Math.sqrt(variance); const se = stddev / Math.sqrt(n); return { mean: mean, variance: variance, stddev: stddev, se: se, n: n }; }
    function calculateVariancePct(average, min, max) { if (!average && average !== 0) return 'N/A'; if (average === 0) { if (min < 0 && max > 0) return '-∞%/+∞%'; if (min < 0) return '-∞%'; if (max > 0) return '+∞%'; return 'N/A';} if (average < 0) { const minP = ((min - average) / Math.abs(average)) * 100; const maxP = ((max - average) / Math.abs(average)) * 100; return `${minP.toFixed(0)}%/+${maxP.toFixed(0)}%`; } const minP = ((min - average) / average) * 100; const maxP = ((max - average) / average) * 100; return `${minP.toFixed(0)}%/+${maxP.toFixed(0)}%`; }
    function calculateAvgUOVariancePct(average, avgUnder, avgOver) { if (!average && average !== 0) return 'N/A'; if (avgUnder === 0 && avgOver === 0) return 'N/A'; if (average === 0) { if (avgUnder < 0 && avgOver > 0) return '-∞%/+∞%'; if (avgUnder < 0) return '-∞%'; if (avgOver > 0) return '+∞%'; return 'N/A';} if (average < 0) { const underP = avgUnder !== 0 ? ((avgUnder - average) / Math.abs(average)) * 100 : 0; const overP = avgOver !== 0 ? ((avgOver - average) / Math.abs(average)) * 100 : 0; return `${underP.toFixed(0)}%/+${overP.toFixed(0)}%`; } const underP = avgUnder !== 0 ? ((avgUnder - average) / average) * 100 : 0; const overP = avgOver !== 0 ? ((avgOver - average) / average) * 100 : 0; return `${underP.toFixed(0)}%/+${overP.toFixed(0)}%`; }

    // --- Panel State & Data Update Functions ---
    function applySavedPanelState() { const savedPosition = GM_getValue('jig_rigger_panel_position'); const riggerPanelElement = document.getElementById('jig-rigger-panel'); if (riggerPanelElement) { if (savedPosition) { if (savedPosition.top && savedPosition.left) { riggerPanelElement.style.top = savedPosition.top; riggerPanelElement.style.left = savedPosition.left; originalPanelPosition = { top: savedPosition.top, left: savedPosition.left }; } if (savedPosition.width) riggerPanelElement.style.width = savedPosition.width; if (savedPosition.height) riggerPanelElement.style.height = savedPosition.height; } const isMinimized = GM_getValue('jig_rigger_minimized', false); if (isMinimized) { riggerPanelElement.classList.add('jig-rigger-minimized'); const toggleButton = document.getElementById('rigger-toggle'); if (toggleButton) toggleButton.textContent = '+'; } } isChartVisible = GM_getValue('jig_rigger_chart_visible', false); const isAggregatedCollapsed = GM_getValue('jig_rigger_aggregated_collapsed', false); const aggSection = document.getElementById('aggregated-section'); const aggToggle = document.getElementById('aggregated-toggle'); if (aggSection && aggToggle) { if (isAggregatedCollapsed) { aggSection.classList.add('collapsed'); aggToggle.textContent = '+'; } else { aggSection.classList.remove('collapsed'); aggToggle.textContent = '-'; } } const isLineByLineCollapsed = GM_getValue('jig_rigger_line_by_line_collapsed', false); const lineSection = document.getElementById('line-by-line-section'); const lineToggle = document.getElementById('line-by-line-toggle'); if(lineSection && lineToggle) { if (isLineByLineCollapsed) { lineSection.classList.add('collapsed'); lineToggle.textContent = '+'; } else { lineSection.classList.remove('collapsed'); lineToggle.textContent = '-'; } } isWinsorized = GM_getValue('jig_rigger_winsorized', false); const winsorizeCheckbox = document.getElementById('jr-winsorize-checkbox'); if (winsorizeCheckbox) winsorizeCheckbox.checked = isWinsorized;
        isIsolateTrueValue = GM_getValue('jig_rigger_isolate_tv', false);
        const isolateCheckbox = document.getElementById('jr-isolate-tv-checkbox');
        if (isolateCheckbox) isolateCheckbox.checked = isIsolateTrueValue;
        updateTableHeaders();
    }
    function updateAggregation(itemName, trElement) { if (!itemAggregation.has(itemName)) itemAggregation.set(itemName, new Map()); const itemMetrics = itemAggregation.get(itemName); const lineEntryStats = {}; for (const metricKey in METRIC_CONFIG) { const config = METRIC_CONFIG[metricKey]; const rawValue = trElement.dataset[config.datasetKey]; const valueIsNA = isNA(rawValue); const parsedValue = parseValueFromDataset(rawValue); if (!itemMetrics.has(metricKey)) itemMetrics.set(metricKey, { count: 0, naCount: 0, values: [] }); const metricData = itemMetrics.get(metricKey); metricData.count++; if (valueIsNA) metricData.naCount++; metricData.values.push(parsedValue); const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values; const total = valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0); const avg = metricData.count > 0 ? total / metricData.count : 0; const useZerosForStats = config.allowZero; const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v)); const median = calculateMedian(valuesToProcess, useZerosForStats); const stats = calculateStatistics(relevantValues, useZerosForStats); const min = relevantValues.length > 0 ? Math.min(...relevantValues) : 0; const max = relevantValues.length > 0 ? Math.max(...relevantValues) : 0; const valuesUnder = relevantValues.filter(v => v < stats.mean); const valuesOver = relevantValues.filter(v => v > stats.mean); const avgUnder = valuesUnder.length > 0 ? valuesUnder.reduce((sum, val) => sum + val, 0) / valuesUnder.length : 0; const avgOver = valuesOver.length > 0 ? valuesOver.reduce((sum, val) => sum + val, 0) / valuesOver.length : 0; const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0; const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0; const tStat = (stats.n > 1 && stats.se > 0) ? stats.mean / stats.se : 0;
        const hasValidCi = stats.n > 1;
        let trueValue = null;
        const calculatedTv = (avg + median) / 2;
        if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
            trueValue = calculatedTv;
        }
        lineEntryStats[metricKey] = {
            count: metricData.count,
            naCount: metricData.naCount,
            total, avg, median,
            stddev: stats.stddev,
            ci_lower, ci_upper,
            trueValue, tStat,
            min, max, avgUnder, avgOver,
            minMaxVariance: calculateVariancePct(avg, min, max),
            avgUOVariance: calculateAvgUOVariancePct(avg, avgUnder, avgOver)
        };
    }
    updateCounter++; const timestamp = new Date().toLocaleTimeString(); lineByLineData.push({ id: updateCounter, timestamp, itemName, stats: lineEntryStats }); updateRiggerTable(); updateLineByLineTable(); }

    function updateTableHeaders() {
        const aggTable = document.getElementById('rigger-results-table');
        const aggTHeadTr = aggTable ? aggTable.querySelector('thead tr') : null;
        const lineTHeadTr = document.querySelector('#line-by-line-table thead tr');
        const lineByLineSection = document.getElementById('line-by-line-section');
        const chartContainer = document.getElementById('jr_chart-container');
        const isolateTvLabel = document.getElementById('jr-isolate-tv-label');
        const aggSection = document.getElementById('aggregated-section');
        const aggContainer = document.getElementById('rigger-results-container');
        const rankLedger = document.getElementById('jigs-rank-ledger');
        if (!aggTHeadTr || !lineByLineSection || !chartContainer || !isolateTvLabel || !lineTHeadTr || !aggSection || !aggContainer || !rankLedger) return;

        if (currentMetric === 'trueValueSummary') {
            let headers = '<th data-sort-key="name">Item Name</th><th data-sort-key="count">#</th>';
            headers += '<th data-sort-key="cost">Upgrade Cost</th><th data-sort-key="timeToPurchase">Time</th>';
            for (const key in METRIC_CONFIG) {
                if (METRIC_CONFIG[key].hidden) continue;
                headers += `<th data-sort-key="${key}" title="${METRIC_CONFIG[key].label}">${METRIC_CONFIG[key].label}</th>`;
                if (key.endsWith('Change')) {
                    const newKey = `gPer${key.replace('Change', '')}`;
                    let newLabel = `G/0.01% TV ${METRIC_CONFIG[key].label.replace('Δ', '')}`;
                    headers += `<th data-sort-key="${newKey}" title="${newLabel}">${newLabel}</th>`;
                }
            }
            headers += '<th data-sort-key="roi">ROI (1yr)</th>';
            // --- NEW: Add Score column ---
            headers += '<th data-sort-key="score" title="Total rank points. R1=5, R2=4, R3=3, R4=2, R5=1.">Score</th>';
            // --- END NEW ---

            aggTHeadTr.innerHTML = headers;
            aggTable.classList.add('jigs-summary-table');
            aggTable.classList.remove('jigs-metric-table');
            lineByLineSection.style.display = 'none';
            chartContainer.style.display = 'none';
            isolateTvLabel.style.display = 'none';
            rankLedger.style.display = 'flex';
            aggSection.style.flexGrow = '1';
            aggContainer.style.maxHeight = 'none';

            if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
            const canvas = document.getElementById('jr_chart-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#aaa'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('Chart is disabled for "True Value" summary view', canvas.width / 2, canvas.height / 2 - 10);
                ctx.fillText('due to incompatible Y-axis scales.', canvas.width / 2, canvas.height / 2 + 10);
            }
        } else {
            aggTHeadTr.innerHTML = `
                <th data-sort-key="name" title="The name of the item being upgraded.">Item Name</th>
                <th data-sort-key="count" title="The total number of times this item has appeared in the simulation results.">#</th>
                <th data-sort-key="naCount" title="The number of times this item's value was 'N/A' or 'Free' for the selected metric.">N/A</th>
                <th data-sort-key="trueValue" title="Median of the Avg and Median, *if* the calculated TV is within the 95% CI. (Avg+Median)/2">True Value</th>
                <th data-sort-key="total" title="The sum of all values for this item for the selected metric.">Total</th>
                <th data-sort-key="avg" title="The average value (arithmetic mean) including N/A (as 0) entries. (Total / #)">Avg</th>
                <th data-sort-key="median" title="The *median* value (50th percentile) excluding N/A (0) entries. Good measure of the 'typical' value.">Median</th>
                <th data-sort-key="stddev" title="Standard Deviation: Square root of Variance. Measures typical deviation from the average, in the original units. (Math: √Variance)">Std Dev</th>
                <th data-sort-key="ci" title="95% Confidence Interval: We are 95% confident the *true* average lies within this range. (Math: Avg ± 1.96 * StdErr)">95% CI</th>
                <th data-sort-key="tStat" title="T-Statistic: Tests if the average value is statistically different from zero. Absolute value > ~2 is generally significant. (Math: Avg / StdErr)">T-Stat</th>
                <th data-sort-key="min" title="The lowest value recorded for this item (excluding N/A=0 unless metric allows 0).">Min</th>
                <th data-sort-key="max" title="The highest value recorded for this item.">Max</th>
                <th data-sort-key="minMaxVariance" title="Percentage difference of Min/Max from the Avg.">Min/Max %Var</th>
                <th data-sort-key="avgUnder" title="The average of values *below* the main Avg.">Avg Under</th>
                <th data-sort-key="avgOver" title="The average of values *above* the main Avg.">Avg Over</th>
                <th data-sort-key="avgUOVariance" title="Percentage difference of Avg Under/Over from the main Avg.">Avg U/O %Var</th>
            `;
            aggTable.classList.remove('jigs-summary-table');
            aggTable.classList.add('jigs-metric-table');
            lineTHeadTr.innerHTML = `
                <th title="Update counter.">#</th> <th title="Timestamp of the update.">Timestamp</th> <th title="Item name.">Item Name</th> <th title="Cumulative count for this item.">#</th> <th title="Cumulative N/A count for the selected metric.">N/A</th> <th title="Median of the Avg and Median, *if* the calculated TV is within the 95% CI. (Avg+Median)/2">True Value</th> <th title="Cumulative total value for the selected metric.">Total</th> <th title="Cumulative average value.">Avg</th> <th title="Cumulative median value.">Median</th> <th title="Cumulative standard deviation.">Std Dev</th> <th title="Cumulative 95% CI.">95% CI</th> <th title="Cumulative T-Statistic.">T-Stat</th> <th title="Cumulative minimum value.">Min</th> <th title="Cumulative maximum value.">Max</th> <th title="Cumulative Min/Max % Variance.">Min/Max %Var</th> <th title="Cumulative Avg Under.">Avg Under</th> <th title="Cumulative Avg Over.">Avg Over</th> <th title="Cumulative Avg U/O % Variance.">Avg U/O %Var</th>
            `;
            lineByLineSection.style.display = 'flex';
            isolateTvLabel.style.display = 'block';
            rankLedger.style.display = 'none';
            aggSection.style.flexGrow = '0';
            aggContainer.style.maxHeight = '250px';
            if (isChartVisible) {
                chartContainer.style.display = 'block';
            }
        }
    }


function buildTrueValueSummaryTable() {
    // Read baselines just before calculating
    getBaselineStats();

    const tbody = document.querySelector('#rigger-results-table tbody');
    tbody.innerHTML = '';
    // --- MODIFIED: Corrected key names ---
    const newCalculatedMetricKeys = ['gPerProfit', 'gPerDps', 'gPerExpHr', 'gPerEph', 'roi'];

    let itemsArray = Array.from(itemAggregation.entries()).map(([itemName, itemMetrics]) => {
        const itemData = { name: itemName };
        const firstMetricKey = Object.keys(METRIC_CONFIG)[0];
        const defaultMetricData = itemMetrics.get('profitChange') || itemMetrics.get(firstMetricKey);
        if (!defaultMetricData) return null;
        itemData.count = defaultMetricData.count;
        itemData.naCount = defaultMetricData.naCount;

        // Calculate True Values for raw metrics first
        for (const metricKey in METRIC_CONFIG) {
            const config = METRIC_CONFIG[metricKey];
            const metricData = itemMetrics.get(metricKey);

            if (!metricData) {
                itemData[metricKey] = null;
                itemData[metricKey + '_text'] = 'N/A';
                continue;
            }

            const useZerosForStats = config.allowZero;
            const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values;
            const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v));
            const total = valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0);
            const avg = metricData.count > 0 ? total / metricData.count : 0;
            const median = calculateMedian(valuesToProcess, useZerosForStats);
            const stats = calculateStatistics(relevantValues, useZerosForStats);

            const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0;
            const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0;

            const hasValidCi = stats.n > 1;
            let trueValue = null;
            let trueValueText;
            const calculatedTv = (avg + median) / 2;

            if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
                trueValue = calculatedTv;
                if (metricKey === 'timeToPurchase') {
                    trueValueText = formatTime(trueValue, metricKey);
                } else {
                    trueValueText = formatValue(trueValue, metricKey, true);
                }
            } else {
                trueValueText = 'Not Enough Data';
            }
            itemData[metricKey] = trueValue;
            itemData[metricKey + '_text'] = trueValueText;
        }


        // --- *** CALCULATE NEW METRICS *** ---
        const tvCost = itemData['cost'];

        // --- Helper function for G/% calculation ---
        const calculateGPer = (tvRawChange, baselineValue, cost) => {
            let tvPct = null;
            if (tvRawChange !== null && baselineValue > 0) {
                tvPct = (tvRawChange / baselineValue) * 100;
            } else if (tvRawChange !== null && tvRawChange > 0 && baselineValue <= 0) {
                tvPct = Infinity; // Positive gain from zero baseline
            }

            let gPerValue = null;
            if (cost !== null && tvPct !== null && isFinite(tvPct) && tvPct > 0) {
                gPerValue = (cost / (tvPct * 100));
            }

            let gPerText;
            if (gPerValue !== null) {
                gPerText = formatValue(gPerValue, 'gPer', true);
            } else {
                if (cost === 0 && tvPct !== null && tvPct > 0) gPerText = "Free";
                else if (cost !== null && cost > 0 && tvPct === Infinity) gPerText = "0";
                else gPerText = "N/A";
            }
            // --- MODIFICATION: Set value to 0 if text is "Free" for ranking ---
            if (gPerText === 'Free') {
                gPerValue = 0;
            }
            // --- END MODIFICATION ---

            return { value: gPerValue, text: gPerText };
        };

        // --- 1. G/0.01% TV Profit ---
        const tvProfitRaw = itemData['profitChange'];
        const profitGPer = calculateGPer(tvProfitRaw, baselineProfit, tvCost);
        itemData['gPerProfit'] = profitGPer.value;
        itemData['gPerProfit_text'] = profitGPer.text;

        // --- 2. G/0.01% TV DPS ---
        const tvDpsRaw = itemData['dpsChange'];
        const dpsGPer = calculateGPer(tvDpsRaw, baselineDps, tvCost);
        itemData['gPerDps'] = dpsGPer.value;
        itemData['gPerDps_text'] = dpsGPer.text;

        // --- 3. G/0.01% TV Exp/Hr ---
        const tvExpRaw = itemData['expChange'];
        const expGPer = calculateGPer(tvExpRaw, baselineExp, tvCost);
        itemData['gPerExpHr'] = expGPer.value;
        itemData['gPerExpHr_text'] = expGPer.text;

        // --- 4. G/0.01% TV EPH ---
        const tvEphRaw = itemData['ephChange'];
        const ephGPer = calculateGPer(tvEphRaw, baselineEph, tvCost);
        itemData['gPerEph'] = ephGPer.value;
        itemData['gPerEph_text'] = ephGPer.text;

        // --- 5. ROI (1yr) ---
        let roi = null;
        if (tvCost !== null && tvProfitRaw !== null && tvProfitRaw > 0) {
            if (tvCost > 0) {
                const gainPerYear = tvProfitRaw * 24 * 365;
                roi = (gainPerYear / tvCost) * 100;
            } else if (tvCost === 0) {
                roi = Infinity;
            }
        }
        itemData['roi'] = roi;
        itemData['roi_text'] = formatValue(roi, 'roi');
        // --- *** END CALCULATIONS *** ---

        return itemData;
    }).filter(item => item !== null);


    // --- NEW: Rank columns and calculate scores ---
    const RANK_POINTS = [5, 4, 3, 2, 1]; // Rank 1=5pts, Rank 2=4pts...
    const columnRanks = {};

    const keysToScore = [];
    // 1. Add non-hidden METRIC_CONFIG keys
    for (const key in METRIC_CONFIG) {
        if (!METRIC_CONFIG[key].hidden) {
            keysToScore.push(key); // dpsChange, profitChange, etc.
        }
    }
    // 2. Add cost and time (which are in METRIC_CONFIG but hidden)
    // --- MODIFICATION (v1.2.0): REMOVED 'cost' and 'timeToPurchase' from scoring ---
    // keysToScore.push('cost');
    // keysToScore.push('timeToPurchase');
    // --- END MODIFICATION ---

    // 3. Add new calculated keys
    keysToScore.push(...newCalculatedMetricKeys); // gPer..., roi

    for (const metricKey of keysToScore) {
        let isCost = false; // Default to benefit
        if (metricKey.startsWith('gPer')) {
            isCost = true;
        } else if (metricKey === 'roi') {
            isCost = false;
        } else if (METRIC_CONFIG[metricKey]) {
            isCost = METRIC_CONFIG[metricKey].isCostMetric;
        } else {
            isCost = true; // Default
        }

        // Get all valid, finite, unique values
        let values = itemsArray
            .map(item => item[metricKey])
            .filter(v => v !== null && v !== undefined && isFinite(v));

        // Handle special "best" values
        if (metricKey === 'roi') {
            // Check for Infinity
            if (itemsArray.some(item => item[metricKey] === Infinity)) {
                values.push(Infinity);
            }
        } else if (metricKey.startsWith('gPer')) {
            // Check for 0 ("Free")
            if (itemsArray.some(item => item[metricKey + '_text'] === 'Free')) {
                values.push(0); // 'Free' items have value 0
            }
        }

        let uniqueValues = [...new Set(values)];

        // Sort: cost=ascending, benefit=descending
        if (isCost) {
            uniqueValues.sort((a, b) => a - b); // Lower is better
        } else {
            uniqueValues.sort((a, b) => b - a); // Higher is better
        }

        // Store the top 5 values
        columnRanks[metricKey] = uniqueValues.slice(0, 5);
    }

    // Calculate score for each item
    itemsArray.forEach(item => {
        item.score = 0;
        for (const metricKey of keysToScore) {
            const val = item[metricKey];
            const textVal = item[metricKey + '_text'];
            const ranks = columnRanks[metricKey];
            if (!ranks) continue;

            let valToTest = val;
            // Handle "Free" gPer case, where value is 0
            if (metricKey.startsWith('gPer') && textVal === 'Free') {
                valToTest = 0;
            }

            if (valToTest === null || valToTest === undefined) continue;

            // Handle Infinity separately for indexOf
            if (valToTest === Infinity) {
                if (ranks.includes(Infinity)) {
                     const rankIndex = ranks.indexOf(Infinity);
                     item.score += RANK_POINTS[rankIndex];
                }
                continue; // Move to next key
            }

            if (!isFinite(valToTest)) continue; // Skip non-finite values that aren't Infinity

            const rankIndex = ranks.indexOf(valToTest); // Find if the value is in the top 5
            if (rankIndex !== -1) {
                item.score += RANK_POINTS[rankIndex];
            }
        }
    });

    // Get the distinct scores for ranking
    const distinctScores = [...new Set(itemsArray.map(item => item.score))]
        .filter(score => score > 0)
        .sort((a, b) => b - a); // Sort scores descending

    // Map top 5 scores to ranks 1-5
    const scoreToRank = {};
    distinctScores.slice(0, 5).forEach((score, index) => {
        scoreToRank[score] = index + 1; // index 0 (highest score) = rank 1
    });

    // Assign rank to each item
    itemsArray.forEach(item => {
        item.rank = scoreToRank[item.score] || null;
    });
    // --- END NEW LOGIC ---

    // --- DELETED: Old columnExtremes logic ---


    // Sort
    if (currentSortKey) {
         itemsArray.sort((a, b) => {
             let valA, valB, valA_text, valB_text;
             // --- MODIFIED: Use correct key casing ---
             if (METRIC_CONFIG[currentSortKey] || ['cost', 'timeToPurchase'].includes(currentSortKey)) {
                 valA = a[currentSortKey];
                 valB = b[currentSortKey];
                 valA_text = a[currentSortKey + '_text'];
                 valB_text = b[currentSortKey + '_text'];
                 if (valA_text === 'Not Enough Data') return 1 * currentSortDirection;
                 if (valB_text === 'Not Enough Data') return -1 * currentSortDirection;
                 if (valA_text === 'Never') return 1 * currentSortDirection; // 'Never' goes last
                 if (valB_text === 'Never') return -1 * currentSortDirection;
             }
             else if (newCalculatedMetricKeys.includes(currentSortKey)) { // Handle calculated metrics
                 valA = a[currentSortKey];
                 valB = b[currentSortKey];
                 valA_text = a[currentSortKey + '_text'];
                 valB_text = b[currentSortKey + '_text'];

                 // Handle 'Free' (value 0) as best
                 if(valA_text === 'Free') valA = 0;
                 if(valB_text === 'Free') valB = 0;

                 if (valA_text === 'N/A' || valA_text === 'Never') return 1 * currentSortDirection; // N/A, Never go last
                 if (valB_text === 'N/A' || valB_text === 'Never') return -1 * currentSortDirection;

                 if (currentSortKey === 'roi') {
                     if (valA === Infinity && valB === Infinity) return 0;
                     if (valA === Infinity) return -1 * currentSortDirection; // Infinity ROI is best
                     if (valB === Infinity) return 1 * currentSortDirection;
                 }
             }
             else if (currentSortKey === 'name' || currentSortKey === 'count' || currentSortKey === 'score') { // Added 'score'
                 valA = a[currentSortKey];
                 valB = b[currentSortKey];
                 if(currentSortKey === 'name') return valA.localeCompare(valB) * currentSortDirection;
                 return (valA - valB) * currentSortDirection;
             }

             // General comparison for null/undefined/finite numbers
             if (valA === null || valA === undefined) return 1 * currentSortDirection;
             if (valB === null || valB === undefined) return -1 * currentSortDirection;

             return (valA - valB) * currentSortDirection;
         });
    } else {
        // Default sort by new Score
        itemsArray.sort((a, b) => (b.score || 0) - (a.score || 0));
        currentSortKey = 'score';
        currentSortDirection = -1; // We sorted b - a, so set this for subsequent clicks
    }

    // --- *** MODIFIED RENDER SECTION (v1.1.9) *** ---
    // Render
    for (const item of itemsArray) {
        const row = tbody.insertRow();

        // --- NEW: Get overall score rank for Item Name cell ---
        let itemNameRankClass = (item.rank) ? ` jigs-rank-${item.rank}` : '';

        let rowHTML = `<td class="${itemNameRankClass}">${item.name}</td><td>${item.count}</td>`;

        // --- Handle 'cost' cell ---
        let costClassName = '';
        const costVal = item['cost'];
        const costRanks = columnRanks['cost']; // This will now be undefined
        if (costRanks && costVal !== null && isFinite(costVal)) { // This 'if' will fail
            const rankIndex = costRanks.indexOf(costVal);
            if (rankIndex !== -1) {
                costClassName = `jigs-rank-${rankIndex + 1}`;
            }
        }
        rowHTML += `<td class="jigs-tv-raw-data ${costClassName}">${item['cost_text']}</td>`;

        // --- Handle 'timeToPurchase' cell ---
        let timeClassName = '';
        const timeVal = item['timeToPurchase'];
        const timeRanks = columnRanks['timeToPurchase']; // This will now be undefined
        if (timeRanks && timeVal !== null && isFinite(timeVal)) { // This 'if' will fail
            const rankIndex = timeRanks.indexOf(timeVal);
            if (rankIndex !== -1) {
                timeClassName = `jigs-rank-${rankIndex + 1}`;
            }
        }
        rowHTML += `<td class="jigs-tv-raw-data ${timeClassName}">${item['timeToPurchase_text']}</td>`;


        for (const metricKey in METRIC_CONFIG) {
              if (METRIC_CONFIG[metricKey].hidden) continue;

              // --- Handle raw metric cell (DPS, Profit, etc) ---
              let className = '';
              const val = item[metricKey];
              const ranks = columnRanks[metricKey];
              if (ranks && val !== null && isFinite(val)) {
                  const rankIndex = ranks.indexOf(val);
                  if (rankIndex !== -1) {
                      className = `jigs-rank-${rankIndex + 1}`;
                  }
              }
              rowHTML += `<td class="${className}">${item[metricKey + '_text']}</td>`;

              if (metricKey.endsWith('Change')) {
                  // --- MODIFIED: Use correct key casing ---
                  let newKey = `gPer${metricKey.charAt(0).toUpperCase() + metricKey.slice(1).replace('Change', '')}`;

                  // --- *** FIX 2: Manually correct expChange key *** ---
                  if (metricKey === 'expChange') {
                      newKey = 'gPerExpHr';
                  }
                  // --- *** END FIX 2 *** ---

                  // --- Handle 'gPer...' cell ---
                  const newVal = item[newKey];
                  const newTextVal = item[newKey + '_text'];
                  const newRanks = columnRanks[newKey];
                  let newClassName = '';
                  let valToTest = (newTextVal === 'Free') ? 0 : newVal; // Handle "Free"

                  if (newRanks && valToTest !== null && isFinite(valToTest)) {
                       const rankIndex = newRanks.indexOf(valToTest);
                       if (rankIndex !== -1) {
                          newClassName = `jigs-rank-${rankIndex + 1}`;
                       }
                  }
                  rowHTML += `<td class="${newClassName}">${item[newKey + '_text']}</td>`;
              }
        }

        // --- Handle 'roi' cell ---
        let roiClassName = '';
        const roiVal = item['roi'];
        const roiRanks = columnRanks['roi'];
        if (roiRanks && roiVal !== null) { // This will check null/undefined
            const rankIndex = roiRanks.indexOf(roiVal); // Works for numbers and Infinity
            if (rankIndex !== -1) {
                roiClassName = `jigs-rank-${rankIndex + 1}`;
            }
        }
        rowHTML += `<td class="${roiClassName}">${item['roi_text']}</td>`;

        // --- NEW: Add Score cell (no rank color) ---
        rowHTML += `<td class="jigs-tv-raw-data">${item.score}</td>`;
        // --- END NEW ---

        row.innerHTML = rowHTML;
    }
}
// --- *** END MODIFIED RENDER SECTION *** ---

    function updateRiggerTable() {
        if (currentMetric === 'trueValueSummary') {
            buildTrueValueSummaryTable();
            // --- NEW: Set default sort highlighting ---
            const scoreHeader = document.querySelector('#rigger-results-table th[data-sort-key="score"]');
            if (scoreHeader && currentSortKey === 'score') {
                document.querySelectorAll('#rigger-results-table th').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc'));
                scoreHeader.classList.add(currentSortDirection === 1 ? 'sorted-asc' : 'sorted-desc');
            }
            // --- END NEW ---
            return;
        }
        const tbody = document.querySelector('#rigger-results-table tbody');
        tbody.innerHTML = '';
        const config = METRIC_CONFIG[currentMetric];
        if (!config) {
             console.error("JIGS Stats: Invalid currentMetric in updateRiggerTable:", currentMetric);
             return;
        }
        let itemsArray = Array.from(itemAggregation.entries()).map(([itemName, itemMetrics]) => { const metricData = itemMetrics.get(currentMetric); if (!metricData || metricData.values.length === 0) return null; const useZerosForStats = config.allowZero; const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values; const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v)); const total = valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0); const avg = metricData.count > 0 ? total / metricData.count : 0; const median = calculateMedian(valuesToProcess, useZerosForStats); const stats = calculateStatistics(relevantValues, useZerosForStats); if (!stats) { console.warn(`Stats calculation failed for ${itemName}, metric ${currentMetric}`); return null; } const min = relevantValues.length > 0 ? Math.min(...relevantValues) : 0; const max = relevantValues.length > 0 ? Math.max(...relevantValues) : 0; const valuesUnder = relevantValues.filter(v => v < stats.mean); const valuesOver = relevantValues.filter(v => v > stats.mean); const avgUnder = valuesUnder.length > 0 ? valuesUnder.reduce((sum, val) => sum + val, 0) / valuesUnder.length : 0; const avgOver = valuesOver.length > 0 ? valuesOver.reduce((sum, val) => sum + val, 0) / valuesOver.length : 0; const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0; const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0; const confidenceInterval = (stats.n > 1) ? `${formatValue(ci_lower, currentMetric, true)} - ${formatValue(ci_upper, currentMetric, true)}` : 'N/A'; const tStat = (stats.n > 1 && stats.se > 0) ? stats.mean / stats.se : 0;
        const hasValidCi = stats.n > 1;
        let trueValue = null;
        let trueValueText;
        const calculatedTv = (avg + median) / 2;
        if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
            trueValue = calculatedTv;
            trueValueText = formatValue(trueValue, currentMetric, true);
        } else {
            trueValueText = 'Not Enough Data';
        }
        return {
            name: itemName,
            count: metricData.count,
            naCount: metricData.naCount,
            trueValue, trueValueText,
            total, avg, median,
            stddev: stats.stddev,
            ci: confidenceInterval, tStat,
            min, max, avgUnder, avgOver,
            minMaxVariance: calculateVariancePct(avg, min, max),
            avgUOVariance: calculateAvgUOVariancePct(avg, avgUnder, avgOver)
        };
    }).filter(item => item !== null); if (currentSortKey) { itemsArray.sort((a, b) => { let valA = a[currentSortKey]; let valB = b[currentSortKey]; if (typeof valA === 'string') { if (valA === 'N/A' || valA.includes('N/A') || valA === 'Not Enough Data') return 1 * currentSortDirection; if (valB === 'N/A' || valB.includes('N/A') || valB === 'Not Enough Data') return -1 * currentSortDirection; return valA.localeCompare(valB) * currentSortDirection; } if (valA === null) return 1 * currentSortDirection; if (valB === null) return -1 * currentSortDirection; return (valA - valB) * currentSortDirection; }); } else { itemsArray.sort((a, b) => a.name.localeCompare(b.name)); } for (const item of itemsArray) { const row = tbody.insertRow(); row.innerHTML = `<td>${item.name ?? 'N/A'}</td><td>${item.count ?? 'N/A'}</td><td>${item.naCount ?? 'N/A'}</td><td>${item.trueValueText}</td><td>${formatValue(item.total, currentMetric, true)}</td><td>${formatValue(item.avg, currentMetric, true)}</td><td>${formatValue(item.median, currentMetric, config.allowZero)}</td><td>${formatValue(item.stddev, currentMetric, true)}</td><td>${item.ci ?? 'N/A'}</td><td>${formatNumber(item.tStat, 2)}</td><td>${formatValue(item.min, currentMetric, config.allowZero)}</td><td>${formatValue(item.max, currentMetric, true)}</td><td>${item.minMaxVariance ?? 'N/A'}</td><td>${formatValue(item.avgUnder, currentMetric, true)}</td><td>${formatValue(item.avgOver, currentMetric, true)}</td><td>${item.avgUOVariance ?? 'N/A'}</td>`; } if (isChartVisible) updateChart(); }

    function updateLineByLineTable(redrawAll = false) {
        if (currentMetric === 'trueValueSummary') return;
        if (!METRIC_CONFIG[currentMetric]) return;
        const tbody = document.querySelector('#line-by-line-table tbody');
        if (redrawAll) { tbody.innerHTML = ''; for (let i = lineByLineData.length - 1; i >= 0; i--) { addLineByLineRow(tbody, lineByLineData[i]); } } else if (lineByLineData.length > 0) { addLineByLineRow(tbody, lineByLineData[lineByLineData.length - 1], true); }
    }

    function addLineByLineRow(tbody, lineData, insertAtTop = false){ if (!lineData || !lineData.stats) { console.warn("JIGS Stats: addLineByLineRow called with invalid lineData:", lineData); return; }
        if (!METRIC_CONFIG[currentMetric]) { console.warn("JIGS Stats: addLineByLineRow called with invalid currentMetric:", currentMetric); return; }
        const stats = lineData.stats[currentMetric]; if (!stats || typeof stats.min === 'undefined') { console.warn(`JIGS Stats: addLineByLineRow - stats missing or invalid for metric ${currentMetric} in item ${lineData.itemName}`); return; }
        const config = METRIC_CONFIG[currentMetric];
        let trueValueText;
        if (stats.trueValue !== null) {
            trueValueText = formatValue(stats.trueValue, currentMetric, true);
        } else {
            trueValueText = 'Not Enough Data';
        }
        const row = insertAtTop ? tbody.insertRow(0) : tbody.insertRow();
        const confidenceInterval = (stats.ci_lower !== undefined && stats.ci_upper !== undefined) ? `${formatValue(stats.ci_lower, currentMetric, true)} - ${formatValue(stats.ci_upper, currentMetric, true)}` : 'N/A'; const minMaxVarText = stats.minMaxVariance !== undefined ? stats.minMaxVariance : 'N/A'; const avgUOVarText = stats.avgUOVariance !== undefined ? stats.avgUOVariance : 'N/A';
        row.innerHTML = `<td>${lineData.id}</td><td>${lineData.timestamp}</td><td>${lineData.itemName}</td><td>${stats.count ?? 'N/A'}</td><td>${stats.naCount ?? 'N/A'}</td><td>${trueValueText}</td><td>${formatValue(stats.total, currentMetric, true)}</td><td>${formatValue(stats.avg, currentMetric, true)}</td><td>${formatValue(stats.median, currentMetric, config.allowZero)}</td><td>${formatValue(stats.stddev, currentMetric, true)}</td><td>${confidenceInterval}</td><td>${formatNumber(stats.tStat, 2)}</td><td>${formatValue(stats.min, currentMetric, config.allowZero)}</td><td>${formatValue(stats.max, currentMetric, true)}</td><td>${minMaxVarText}</td><td>${formatValue(stats.avgUnder, currentMetric, true)}</td><td>${formatValue(stats.avgOver, currentMetric, true)}</td><td>${avgUOVarText}</td>`;
    }
    function clearRiggerData() { itemAggregation.clear(); lineByLineData.length = 0; updateCounter = 0; updateRiggerTable(); document.querySelector('#line-by-line-table tbody').innerHTML = ''; if (isChartVisible) updateChart(); }

    function updateChart() {
        if (currentMetric === 'trueValueSummary') {
            updateTableHeaders();
            return;
        }
        const canvas = document.getElementById('jr_chart-canvas');
        const ctx = canvas.getContext('2d');
        const config = METRIC_CONFIG[currentMetric];
        if (!config) return;
        const itemsArray = Array.from(itemAggregation.entries()).map(([itemName, itemMetrics]) => {
            const metricData = itemMetrics.get(currentMetric);
            if (!metricData) return null;
            const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values;
            const useZerosForStats = config.allowZero;
            const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v));
            const stats = calculateStatistics(relevantValues, useZerosForStats);
            if(!stats) return null;
            const avg = metricData.count > 0 ? valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0) / metricData.count : 0;
            const median = calculateMedian(valuesToProcess, useZerosForStats);
            const min = relevantValues.length > 0 ? Math.min(...relevantValues) : 0;
            const max = relevantValues.length > 0 ? Math.max(...relevantValues) : 0;
            const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0;
            const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0;
            const hasValidCi = stats.n > 1;
            let trueValue = null;
            const calculatedTv = (avg + median) / 2;
            if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
                trueValue = calculatedTv;
            }
            return { name: itemName, min, max, avg, median, ci_lower, ci_upper, n: stats.n, trueValue };
        }).filter(item => item !== null);

        itemsArray.sort((a, b) => (b.median ?? 0) - (a.median ?? 0));
        if (itemsArray.length === 0) {
            if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#aaa'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }
        const hasNegativeOrZero = itemsArray.some(item =>
            item && ( (item.min <= 0 && isFinite(item.min)) || (item.avg <= 0) || (item.median <= 0) || (item.ci_lower <= 0) || (item.trueValue <= 0) )
        );
        const newYScaleType = (hasNegativeOrZero) ? 'linear' : 'logarithmic';
        let newScaleMin = undefined, newScaleMax = undefined;
        const allPositiveData = itemsArray.flatMap(item =>
            item ? [item.min, item.avg, item.median, item.ci_lower, item.ci_upper, item.max, item.trueValue] : []
        ).filter(v => v > 0 && isFinite(v));
        if (allPositiveData.length > 0) {
            const trueDataMin = Math.min(...allPositiveData);
            if (newYScaleType === 'logarithmic') {
                newScaleMin = Math.pow(10, Math.floor(Math.log10(trueDataMin)));
            } else {
                const coreData = itemsArray.flatMap(item => item ? [item.median, item.ci_lower, item.ci_upper, item.trueValue] : []).filter(v => isFinite(v));
                if (coreData.length > 0) {
                    let min = Math.min(...coreData);
                    let max = Math.max(...coreData);
                    const overallMin = Math.min(...allPositiveData);
                    const overallMax = Math.max(...allPositiveData);
                    if (overallMin < min) min = overallMin;
                    if (overallMax > max) max = overallMax;
                    const padding = (max - min) * 0.1 || 10;
                    newScaleMin = min - padding;
                    newScaleMax = max + padding;
                }
            }
        }
        const chartLabelCallback = function(value) {
            const fullLabel = this.getLabelForValue(value);
            let targetName = fullLabel;
            const arrowIndex = fullLabel.indexOf('->');
            if (arrowIndex > -1) {
                const afterArrow = fullLabel.substring(arrowIndex + 2).trim();
                if (/^(&|Enh|\d|\s|\+)+$/.test(afterArrow) && afterArrow.length < 10) {
                    targetName = fullLabel.substring(0, arrowIndex).trim();
                } else {
                    targetName = afterArrow;
                }
            }
            const junkWords = ['&', 'of', 'the', 'a', 'an'];
            const cleanedName = targetName.replace(/:/g, ' ').replace(/&/g, '').replace(/Enh/g, '').replace(/\d+/g, '').replace(/\+/g, '').replace(/ +/g, ' ').trim();
            const parts = cleanedName.split(' ').filter(p => p && !junkWords.includes(p.toLowerCase()));
            const firstWord = parts[0] ? parts[0].substring(0, 5) : '';
            const secondWord = parts[1] ? parts[1].substring(0, 5) : '';
            const label = secondWord ? `${firstWord} ${secondWord}` : firstWord;
            return label || fullLabel.substring(0,10);
        };
        if (!chartInstance) {
            const datasets = [
                { label: '95% CI', type: 'bar', data: itemsArray.map(item => ({ x: item.name, y: (item && item.n > 1 && (newYScaleType === 'linear' || item.ci_lower > 0)) ? [item.ci_lower, item.ci_upper] : null })), backgroundColor: 'rgba(100, 100, 100, 0.5)', borderColor: 'rgba(150, 150, 150, 0.7)', borderWidth: 1, barPercentage: 0.1, categoryPercentage: 0.5, order: 1, hidden: isIsolateTrueValue },
                { label: 'Min', data: itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.min > 0)) ? item.min : null })), type: 'scatter', backgroundColor: 'rgba(34, 197, 94, 1)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 3, pointRadius: 6, pointStyle: 'line', pointHoverRadius: 8, showLine: false, order: 2, hidden: isIsolateTrueValue },
                { label: 'Max', data: itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.max > 0)) ? item.max : null })), type: 'scatter', backgroundColor: 'rgba(239, 68, 68, 1)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 3, pointRadius: 6, pointStyle: 'line', pointHoverRadius: 8, showLine: false, order: 3, hidden: isIsolateTrueValue },
                { label: 'Average', data: itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.avg > 0)) ? item.avg : null })), type: 'scatter', backgroundColor: 'rgba(255, 206, 86, 1)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 2, pointRadius: 3, pointStyle: 'rectRot', pointHoverRadius: 5, showLine: false, order: 4, hidden: isIsolateTrueValue },
                { label: 'Median', data: itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.median > 0)) ? item.median : null })), type: 'scatter', backgroundColor: 'rgba(153, 102, 255, 1)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2, pointRadius: 3, pointStyle: 'triangle', pointHoverRadius: 5, showLine: false, spanGaps: true, order: 5, hidden: isIsolateTrueValue },
                { label: 'True Value', data: itemsArray.map(item => ({ x: item.name, y: (item && item.trueValue !== null && (newYScaleType === 'linear' || item.trueValue > 0)) ? item.trueValue : null })), type: 'scatter', backgroundColor: 'rgba(54, 162, 235, 1)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2, pointRadius: 5, pointStyle: 'star', pointHoverRadius: 7, showLine: true, spanGaps: true, order: 6 }
            ];
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: { labels: itemsArray.map(item => item.name), datasets },
                options: {
                    responsive: true, maintainAspectRatio: false, animation: { duration: 750, easing: 'easeInOutQuart' },
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        title: { display: true, text: `${config.chartLabel} - Item Statistics`, color: '#eee', font: { size: 16 } },
                        legend: { display: true, position: 'top', labels: { color: '#eee', font: { size: 12 }, usePointStyle: true } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    let valueLabel = '';
                                    if (context.dataset.type === 'bar') {
                                        const value = context.parsed._custom;
                                        if (value) { valueLabel = `[${formatValue(value.min, currentMetric, true)}, ${formatValue(value.max, currentMetric, true)}]`; } else { valueLabel = 'N/A'; }
                                    } else {
                                        valueLabel = formatValue(context.parsed.y, currentMetric, true);
                                    }
                                    return `${label}: ${valueLabel}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { type: 'category', labels: itemsArray.map(item => item.name), offset: true, ticks: { color: '#eee', maxRotation: 45, minRotation: 45, font: { size: 10 }, callback: chartLabelCallback }, grid: { color: 'rgba(255, 255, 255, 0.1)', offset: true } },
                        y: {
                            type: newYScaleType,
                            min: newScaleMin,
                            max: newScaleMax,
                            ticks: { color: '#eee', callback: val => formatValue(val, currentMetric, true) },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            title: { display: true, text: `${config.chartLabel} Amount (${newYScaleType} Scale)`, color: '#eee' }
                        }
                    }
                }
            });
        } else {
            const itemNames = itemsArray.map(item => item.name);
            chartInstance.data.labels = itemNames;
            chartInstance.options.scales.x.labels = itemNames;
            chartInstance.options.plugins.title.text = `${config.chartLabel} - Item Statistics`;
            chartInstance.options.scales.y.type = newYScaleType;
            chartInstance.options.scales.y.title.text = `${config.chartLabel} Amount (${newYScaleType} Scale)`;
            chartInstance.options.scales.x.ticks.callback = chartLabelCallback;
            chartInstance.options.scales.y.min = newScaleMin;
            chartInstance.options.scales.y.max = newScaleMax;
            chartInstance.data.datasets[0].data = itemsArray.map(item => ({ x: item.name, y: (item && item.n > 1 && (newYScaleType === 'linear' || item.ci_lower > 0)) ? [item.ci_lower, item.ci_upper] : null }));
            chartInstance.data.datasets[1].data = itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.min > 0)) ? item.min : null }));
            chartInstance.data.datasets[2].data = itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.max > 0)) ? item.max : null }));
            chartInstance.data.datasets[3].data = itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.avg > 0)) ? item.avg : null }));
            chartInstance.data.datasets[4].data = itemsArray.map(item => ({ x: item.name, y: (item && (newYScaleType === 'linear' || item.median > 0)) ? item.median : null }));
            chartInstance.data.datasets[4].showLine = false;
            if (!chartInstance.data.datasets[5]) {
                chartInstance.data.datasets[5] = { label: 'True Value', data: [], type: 'scatter', backgroundColor: 'rgba(54, 162, 235, 1)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2, pointRadius: 5, pointStyle: 'star', pointHoverRadius: 7, showLine: true, spanGaps: true, order: 6 };
            }
            chartInstance.data.datasets[5].data = itemsArray.map(item => ({ x: item.name, y: (item && item.trueValue !== null && (newYScaleType === 'linear' || item.trueValue > 0)) ? item.trueValue : null }));
            chartInstance.data.datasets[5].showLine = true;
            chartInstance.data.datasets[5].spanGaps = true;
            chartInstance.data.datasets[0].hidden = isIsolateTrueValue;
            chartInstance.data.datasets[1].hidden = isIsolateTrueValue;
            chartInstance.data.datasets[2].hidden = isIsolateTrueValue;
            chartInstance.data.datasets[3].hidden = isIsolateTrueValue;
            chartInstance.data.datasets[4].hidden = isIsolateTrueValue;
            chartInstance.data.datasets[5].hidden = false;
            chartInstance.update('active');
        }
    }

    function exportToCSV() { try { console.log('JIGS Stats: Starting CSV export...'); let csv = '';
        if (currentMetric === 'trueValueSummary') {
            csv += `True Value Summary\n`;
            let header = 'Item Name,Count,Upgrade Cost,Time';
            for (const key in METRIC_CONFIG) {
                if (METRIC_CONFIG[key].hidden) continue;
                header += `,"${METRIC_CONFIG[key].label}"`;
                if (key.endsWith('Change')) {
                    const newLabel = `G/0.01% TV ${METRIC_CONFIG[key].label.replace('Δ', '')}`;
                    header += `,"${newLabel}"`;
                }
            }
            header += ',"ROI (1yr)"\n';
            csv += header;

            let itemsArray = Array.from(itemAggregation.entries()).map(([itemName, itemMetrics]) => {
                const itemData = { name: itemName };
                const firstMetricKey = Object.keys(METRIC_CONFIG)[0];
                const defaultMetricData = itemMetrics.get('profitChange') || itemMetrics.get(firstMetricKey);
                if (!defaultMetricData) return null;
                itemData.count = defaultMetricData.count;

                for (const metricKey in METRIC_CONFIG) {
                    const config = METRIC_CONFIG[metricKey];
                    const metricData = itemMetrics.get(metricKey);
                    if (!metricData) {
                        itemData[metricKey] = null;
                        itemData[metricKey + '_text'] = 'N/A';
                        continue;
                    }
                    const useZerosForStats = config.allowZero;
                    const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values;
                    const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v));
                    const total = valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0);
                    const avg = metricData.count > 0 ? total / metricData.count : 0;
                    const median = calculateMedian(valuesToProcess, useZerosForStats);
                    const stats = calculateStatistics(relevantValues, useZerosForStats);
                    const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0;
                    const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0;
                    const hasValidCi = stats.n > 1;
                    const calculatedTv = (avg + median) / 2;
                    if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
                        itemData[metricKey] = calculatedTv;
                        // --- MODIFIED: Pass key to formatTime ---
                        if (metricKey === 'timeToPurchase') {
                            itemData[metricKey + '_text'] = formatTime(calculatedTv, metricKey);
                        } else {
                            itemData[metricKey + '_text'] = formatValue(calculatedTv, metricKey, true);
                        }
                    } else {
                        itemData[metricKey] = null;
                        itemData[metricKey + '_text'] = 'Not Enough Data';
                    }
                }

                // --- MODIFIED: Calculate all new metrics for export ---
                const tvCost = itemData['cost'];
                const tvProfitRaw = itemData['profitChange'];

                let tvProfitPct = null;
                if (tvProfitRaw !== null && baselineProfit > 0) {
                    tvProfitPct = (tvProfitRaw / baselineProfit) * 100;
                } else if (tvProfitRaw !== null && tvProfitRaw > 0 && baselineProfit <= 0){
                    tvProfitPct = Infinity;
                }
                itemData['gPerprofit'] = (tvCost !== null && tvProfitPct !== null && isFinite(tvProfitPct) && tvProfitPct > 0) ? (tvCost / (tvProfitPct * 100)) : null;
                if (itemData['gPerprofit'] === null) {
                    if (tvCost === 0 && tvProfitPct !== null && tvProfitPct > 0) itemData['gPerprofit_text'] = "Free";
                    else if (tvCost !== null && tvCost > 0 && tvProfitPct === Infinity) itemData['gPerprofit_text'] = "0";
                    else itemData['gPerprofit_text'] = "N/A";
                } else {
                    itemData['gPerprofit_text'] = itemData['gPerprofit'].toString(); // Use raw number for CSV
                }


                const tvDpsRaw = itemData['dpsChange'];
                let tvDpsPct = null;
                if (tvDpsRaw !== null && baselineDps > 0) {
                    tvDpsPct = (tvDpsRaw / baselineDps) * 100;
                } else if (tvDpsRaw !== null && tvDpsRaw > 0 && baselineDps <= 0){
                    tvDpsPct = Infinity;
                }
                itemData['gPerdps'] = (tvCost !== null && tvDpsPct !== null && isFinite(tvDpsPct) && tvDpsPct > 0) ? (tvCost / (tvDpsPct * 100)) : null;
                if (itemData['gPerdps'] === null) {
                    if (tvCost === 0 && tvDpsPct !== null && tvDpsPct > 0) itemData['gPerdps_text'] = "Free";
                    else if (tvCost !== null && tvCost > 0 && tvDpsPct === Infinity) itemData['gPerdps_text'] = "0";
                    else itemData['gPerdps_text'] = "N/A";
                } else {
                    itemData['gPerdps_text'] = itemData['gPerdps'].toString();
                }

                const tvExpRaw = itemData['expChange'];
                let tvExpPct = null;
                if (tvExpRaw !== null && baselineExp > 0) {
                    tvExpPct = (tvExpRaw / baselineExp) * 100;
                } else if (tvExpRaw !== null && tvExpRaw > 0 && baselineExp <= 0){
                    tvExpPct = Infinity;
                }
                itemData['gPerexpHr'] = (tvCost !== null && tvExpPct !== null && isFinite(tvExpPct) && tvExpPct > 0) ? (tvCost / (tvExpPct * 100)) : null;
                if (itemData['gPerexpHr'] === null) {
                    if (tvCost === 0 && tvExpPct !== null && tvExpPct > 0) itemData['gPerexpHr_text'] = "Free";
                    else if (tvCost !== null && tvCost > 0 && tvExpPct === Infinity) itemData['gPerexpHr_text'] = "0";
                    else itemData['gPerexpHr_text'] = "N/A";
                } else {
                    itemData['gPerexpHr_text'] = itemData['gPerexpHr'].toString();
                }

                const tvEphRaw = itemData['ephChange'];
                let tvEphPct = null;
                if (tvEphRaw !== null && baselineEph > 0) {
                    tvEphPct = (tvEphRaw / baselineEph) * 100;
                } else if (tvEphRaw !== null && tvEphRaw > 0 && baselineEph <= 0){
                    tvEphPct = Infinity;
                }
                itemData['gPereph'] = (tvCost !== null && tvEphPct !== null && isFinite(tvEphPct) && tvEphPct > 0) ? (tvCost / (tvEphPct * 100)) : null;
                if (itemData['gPereph'] === null) {
                    if (tvCost === 0 && tvEphPct !== null && tvEphPct > 0) itemData['gPereph_text'] = "Free";
                    else if (tvCost !== null && tvCost > 0 && tvEphPct === Infinity) itemData['gPereph_text'] = "0";
                    else itemData['gPereph_text'] = "N/A";
                } else {
                    itemData['gPereph_text'] = itemData['gPereph'].toString();
                }

                let roi = null;
                if (tvCost !== null && tvProfitRaw !== null && tvProfitRaw > 0) {
                    if (tvCost > 0) {
                        const gainPerYear = tvProfitRaw * 24 * 365;
                        roi = (gainPerYear / tvCost) * 100;
                    } else if (tvCost === 0) {
                         roi = Infinity;
                    }
                }
                itemData['roi_text'] = formatValue(roi, 'roi');
                // --- END MODIFICATION ---
                return itemData;
            }).filter(item => item !== null);

            itemsArray.sort((a, b) => a.name.localeCompare(b.name));

            for (const item of itemsArray) {
                let row = `"${item.name}",${item.count},"${item['cost_text']}","${item['timeToPurchase_text']}"`;
                for (const metricKey in METRIC_CONFIG) {
                    if (METRIC_CONFIG[metricKey].hidden) continue;
                    row += `,"${item[metricKey + '_text']}"`;
                    if (metricKey.endsWith('Change')) {
                        const newKey = `gPer${metricKey.replace('Change', '')}`;
                        row += `,"${item[newKey + '_text']}"`;
                    }
                }
                row += `,"${item['roi_text']}"\n`;
                csv += row;
            }
        } else {
            if (!METRIC_CONFIG[currentMetric]) return;
            const config = METRIC_CONFIG[currentMetric];
            const metricLabel = config.label.replace('G/0.01% ', '');
            csv += `Aggregated Results (Metric: ${config.label})\n`;
            csv += `Item Name,Count,N/A Count,True Value,Total ${metricLabel},Average (${metricLabel}),Median (${metricLabel}),Std Dev (${metricLabel}),95% CI Lower,95% CI Upper,T-Stat,Min ${metricLabel},Max ${metricLabel},Min/Max %Var,Avg Under,Avg Over,Avg U/O %Var\n`;
            const itemsArray = Array.from(itemAggregation.entries()).map(([itemName, itemMetrics]) => { const metricData = itemMetrics.get(currentMetric); if (!metricData) return null; const useZerosForStats = config.allowZero; const valuesToProcess = isWinsorized ? winsorizeData(metricData.values, 0.05) : metricData.values; const relevantValues = useZerosForStats ? valuesToProcess.filter(isFinite) : valuesToProcess.filter(v => v !== 0 && isFinite(v)); const total = valuesToProcess.reduce((sum, val) => sum + (isFinite(val) ? val : 0), 0); const avg = metricData.count > 0 ? total / metricData.count : 0; const median = calculateMedian(valuesToProcess, useZerosForStats); const stats = calculateStatistics(relevantValues, useZerosForStats); const min = relevantValues.length > 0 ? Math.min(...relevantValues) : 0; const max = relevantValues.length > 0 ? Math.max(...relevantValues) : 0; const valuesUnder = relevantValues.filter(v => v < stats.mean); const valuesOver = relevantValues.filter(v => v > stats.mean); const avgUnder = valuesUnder.length > 0 ? valuesUnder.reduce((sum, val) => sum + val, 0) / valuesUnder.length : 0; const avgOver = valuesOver.length > 0 ? valuesOver.reduce((sum, val) => sum + val, 0) / valuesOver.length : 0; const ci_lower = (stats.n > 1) ? stats.mean - (1.96 * stats.se) : 0; const ci_upper = (stats.n > 1) ? stats.mean + (1.96 * stats.se) : 0; const tStat = (stats.n > 1 && stats.se > 0) ? stats.mean / stats.se : 0;
                const hasValidCi = stats.n > 1;
                let trueValueText;
                const calculatedTv = (avg + median) / 2;
                if (hasValidCi && calculatedTv >= ci_lower && calculatedTv <= ci_upper) {
                    trueValueText = calculatedTv.toString();
                } else {
                    trueValueText = 'Not Enough Data';
                }
                return {
                    name: itemName,
                    count: metricData.count,
                    naCount: metricData.naCount,
                    trueValueText, total, avg, median,
                    stddev: stats.stddev,
                    ci_lower, ci_upper, tStat,
                    min, max, avgUnder, avgOver,
                    minMaxVariance: calculateVariancePct(avg, min, max),
                    avgUOVariance: calculateAvgUOVariancePct(avg, avgUnder, avgOver)
                };
            }).filter(item => item !== null); itemsArray.sort((a, b) => a.name.localeCompare(b.name));
            for (const item of itemsArray) {
                csv += `"${item.name}",${item.count},${item.naCount},"${item.trueValueText}",${item.total},${item.avg},${item.median},${item.stddev},${item.ci_lower},${item.ci_upper},${item.tStat},${item.min},${item.max},"${item.minMaxVariance}",${item.avgUnder},${item.avgOver},"${item.avgUOVariance}"\n`;
            }
            csv += `\nLine-by-Line Updates (Metric: ${config.label})\n`;
            csv += `Update #,Timestamp,Item Name,Count,N/A Count,True Value,Total ${metricLabel},Average (${metricLabel}),Median (${metricLabel}),Std Dev (${metricLabel}),95% CI Lower,95% CI Upper,T-Stat,Min ${metricLabel},Max ${metricLabel},Min/Max %Var,Avg Under,Avg Over,Avg U/O %Var\n`;
            for (const line of lineByLineData) {
                const stats = line.stats[currentMetric];
                let trueValueText;
                if (stats.trueValue !== null) {
                    trueValueText = stats.trueValue.toString();
                } else {
                    trueValueText = 'Not Enough Data';
                }
                if (stats) {
                    csv += `${line.id},${line.timestamp},"${line.itemName}",${stats.count},${stats.naCount},"${trueValueText}",${stats.total},${stats.avg},${stats.median},${stats.stddev},${stats.ci_lower},${stats.ci_upper},${stats.tStat},${stats.min},${stats.max},"${stats.minMaxVariance}",${stats.avgUnder},${stats.avgOver},"${stats.avgUOVariance}"\n`;
                }
            }
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const filename = `jigs-stats-export-${currentMetric}-${new Date().toISOString().slice(0,10)}.csv`;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`JIGS Stats: CSV export complete - ${filename}`);
    } catch (error) {
        console.error('JIGS Stats: Error exporting CSV:', error);
        alert('Error exporting CSV. Check console for details.');
    }
}

    // --- OBSERVE JIGS RESULTS ---
    function observeJigsResults() {
        const jigsResultsTable = document.querySelector('#batch-results-table tbody');
        if (!jigsResultsTable) {
            console.log("JIGS Stats: JIGS results table body not found yet, will retry...");
            setTimeout(observeJigsResults, 1000);
            return;
        }

        console.log("JIGS Stats: Observing JIGS results table");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'TR' && node.dataset.upgrade) {
                            const upgradeText = node.dataset.upgrade.trim();
                            const itemName = extractItemName(upgradeText);
                            updateAggregation(itemName, node);
                        }
                    });
                }
            });
        });
        observer.observe(jigsResultsTable, { childList: true, subtree: false });

        const clearButton = document.getElementById('clear-results-button');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                console.log("JIGS Stats: Clearing data");
                setTimeout(clearRiggerData, 100);
            });
        }

        const thead = document.querySelector('#rigger-results-table thead');
        if (thead) {
            thead.addEventListener('click', event => {
                const headerCell = event.target.closest('th');
                if (!headerCell) return;
                const sortKey = headerCell.dataset.sortKey;
                if (!sortKey) return;
                if (currentSortKey === sortKey) {
                    currentSortDirection *= -1;
                } else {
                    currentSortKey = sortKey;
                    currentSortDirection = 1;
                }
                thead.querySelectorAll('th').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc'));
                headerCell.classList.add(currentSortDirection === 1 ? 'sorted-asc' : 'sorted-desc');
                updateRiggerTable();
            });
        }
    }

    // --- INITIALIZATION WRAPPER ---
    function initializeWhenReady() {
        if (!document.body || !document.getElementById('batch-results-table')) {
            console.log("JIGS Stats: Waiting for document body and JIGS table...");
            setTimeout(initializeWhenReady, 200);
            return;
        }

        // --- REMOVED: Do not call getBaselineStats() on initial load ---
        // getBaselineStats(); // <-- This was the problem line

        const riggerPanel = document.createElement('div');
        riggerPanel.id = 'jig-rigger-panel';
        let metricSelectorsHTML = '<div id="jr-metric-selector">';
        for (const key in METRIC_CONFIG) {
            if (METRIC_CONFIG[key].hidden) continue;
            const checked = key === currentMetric ? 'checked' : '';
            metricSelectorsHTML += `<label><input type="radio" name="jr-metric" value="${key}" ${checked}> ${METRIC_CONFIG[key].label}</label>`;
        }
        const tvChecked = currentMetric === 'trueValueSummary' ? 'checked' : '';
        metricSelectorsHTML += `<label><input type="radio" name="jr-metric" value="trueValueSummary" ${tvChecked}> <strong>True Value</strong></label>`;
        metricSelectorsHTML += '</div>';

        let winsorizeHTML = `<label id="jr-winsorize-label" title="Winsorize data (clip outliers) at 5% and 95% percentile before calculating stats."><input type="checkbox" id="jr-winsorize-checkbox"> Winsorize</label>`;
        let isolateTvHTML = `<label id="jr-isolate-tv-label" title="Isolate True Value on chart"><input type="checkbox" id="jr-isolate-tv-checkbox"> Isolate TV</label>`;

        riggerPanel.innerHTML = `
            <div id="jig-rigger-header">
                <span>JIGS Stats</span>
                ${metricSelectorsHTML}
                <div class="jr-header-controls">
                    ${winsorizeHTML}
                    ${isolateTvHTML}
                    <button id="jr_toggle-chart-button" title="Toggle Chart">📊 Chart</button>
                    <button id="jr_export-csv-button" title="Export to CSV">💾 Export CSV</button>
                    <button id="rigger-toggle">-</button>
                </div>
            </div>
            <div id="jig-rigger-content">
                <div id="jr_chart-container" style="display: none;">
                    <canvas id="jr_chart-canvas"></canvas>
                </div>
                <div id="aggregated-section">
                    <div class="jr-section-header" id="aggregated-header">
                        <span>Aggregated Results</span>
                        <div id="jigs-rank-ledger">
                            <span>Rank:</span>
                            <span class="rank-1-box">1</span>
                            <span class="rank-2-box">2</span>
                            <span class="rank-3-box">3</span>
                            <span class="rank-4-box">4</span>
                            <span class="rank-5-box">5</span>
                        </div>
                        <button class="jr-section-toggle" id="aggregated-toggle">-</button>
                    </div>
                    <div id="rigger-results-container">
                        <table id="rigger-results-table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                <div id="line-by-line-section">
                    <div class="jr-section-header" id="line-by-line-header">
                        <span>Line-by-Line Updates</span>
                        <button class="jr-section-toggle" id="line-by-line-toggle">-</button>
                    </div>
                    <div id="line-by-line-content">
                        <table id="line-by-line-table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="jig-rigger-resizer"></div>
        `;

        document.body.appendChild(riggerPanel);

        // --- STYLES ---
        GM_addStyle(`
            #jig-rigger-panel { position: fixed; top: 10px; left: 10px; width: 900px; height: 600px; background-color: #2c2c2c; border: 1px solid #444; border-radius: 5px; color: #eee; z-index: 9996; font-family: sans-serif; display: flex; flex-direction: column; overflow: hidden; }
            #jig-rigger-header { background-color: #333; padding: 8px; cursor: move; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; border-bottom: 1px solid #444; flex-shrink: 0;}
            #jig-rigger-header span { font-weight: bold; }
            .jr-header-controls { display: flex; align-items: center; gap: 10px; }
            #export-csv-button, #jr_export-csv-button, #jr_toggle-chart-button, #rigger-toggle { background: #555; border: 1px solid #777; color: white; border-radius: 3px; cursor: pointer; padding: 4px 8px; }
            #export-csv-button:hover, #jr_export-csv-button:hover, #jr_toggle-chart-button:hover, #rigger-toggle:hover { background: #666; }
            #jr-metric-selector { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; background-color: #444; padding: 4px 8px; border-radius: 4px; }
            #jr-metric-selector label { cursor: pointer; color: #ccc; white-space: nowrap; font-size: 0.85em; }
            #jr-metric-selector input[type="radio"] { margin-right: 4px; vertical-align: middle; }
            #jr-metric-selector label:has(input:checked) { color: #fff; font-weight: bold; }
            #jr-winsorize-label, #jr-isolate-tv-label { font-size: 0.9em; color: #ccc; cursor: pointer; white-space: nowrap; }
            #jr-winsorize-label:has(input:checked), #jr-isolate-tv-label:has(input:checked) { color: #fff; font-weight: bold; }
            #jr-winsorize-label input, #jr-isolate-tv-label input { vertical-align: middle; margin-right: 4px; }
            #jr_chart-container { width: 100%; height: 400px; padding: 10px; background-color: #2a2a2a; border: 1px solid #444; border-radius: 3px; margin-bottom: 10px; flex-shrink: 0; }
            #jr_chart-canvas { width: 100% !important; height: 100% !important; }
            #jig-rigger-content { padding: 10px; display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; gap: 10px; }
            #aggregated-section, #line-by-line-section { border: 1px solid #444; border-radius: 3px; display: flex; flex-direction: column; overflow: hidden; }
            .jr-section-header { background-color: #333; padding: 6px 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; flex-shrink: 0;}
            .jr-section-header span { font-weight: bold; font-size: 0.95em; }
            .jr-section-toggle { background: #555; border: 1px solid #777; color: white; border-radius: 3px; cursor: pointer; padding: 2px 6px; font-size: 0.9em; }
            #aggregated-section.collapsed #rigger-results-container, #line-by-line-section.collapsed #line-by-line-content { display: none; }
            #aggregated-section.collapsed, #line-by-line-section.collapsed { flex-grow: 0; min-height: 0; height: auto; }
            #rigger-results-container, #line-by-line-content { overflow-y: auto; flex-grow: 1; padding: 5px; min-height: 50px; }
            #rigger-results-container { max-height: 250px; }
            #line-by-line-content { max-height: 150px; }
            #rigger-results-table, #line-by-line-table { width: 100%; border-collapse: collapse; }
            #rigger-results-table th, #rigger-results-table td, #line-by-line-table th, #line-by-line-table td { border: 1px solid #444; padding: 5px; text-align: left; font-size: 0.8em; white-space: nowrap; }
            #rigger-results-table th, #line-by-line-table th { background-color: #333; position: sticky; top: 0; z-index: 1; cursor: pointer; }
            #rigger-results-table th[title], #line-by-line-table th[title] { cursor: help; text-decoration: underline dotted; text-decoration-thickness: 1px; }
            #rigger-results-table th:hover, #line-by-line-table th:hover { background-color: #444; }

            #rigger-results-table.jigs-summary-table td:nth-child(n+3) { text-align: right; }
            #rigger-results-table.jigs-summary-table td.jigs-tv-raw-data { background-color: rgba(0,0,0,0.2); }

            #rigger-results-table.jigs-metric-table td:nth-child(n+5),
            #line-by-line-table td:nth-child(n+5) { text-align: right; }

            .jigs-tv-best { background-color: rgba(34, 139, 34, 0.4); font-weight: bold; color: #fff !important; }
            .jigs-tv-worst { background-color: rgba(220, 20, 60, 0.4); color: #fff !important; }

            #jigs-rank-ledger { display: none; align-items: center; gap: 5px; font-size: 0.9em; margin-left: auto; margin-right: 10px; }
            #jigs-rank-ledger span { vertical-align: middle; }
            #jigs-rank-ledger [class*="-box"] { padding: 2px 6px; border-radius: 3px; color: #000; font-weight: bold; }
            .rank-1-box { background-color: #228B22; color: #fff; }
            .rank-2-box { background-color: #4682B4; color: #fff; }
            .rank-3-box { background-color: #DAA520; }
            .rank-4-box { background-color: #CD853F; }
            .rank-5-box { background-color: #808080; color: #fff; }

            /* --- MODIFIED (v1.1.9): Apply rank colors to cells (Item Name or Data) --- */
            #rigger-results-table.jigs-summary-table td.jigs-rank-1 { background-color: #228B22; color: #fff !important; font-weight: bold; }
            #rigger-results-table.jigs-summary-table td.jigs-rank-2 { background-color: #4682B4; color: #fff !important; font-weight: bold; }
            #rigger-results-table.jigs-summary-table td.jigs-rank-3 { background-color: #DAA520; color: #000 !important; font-weight: bold; }
            #rigger-results-table.jigs-summary-table td.jigs-rank-4 { background-color: #CD853F; color: #fff !important; font-weight: bold; }
            #rigger-results-table.jigs-summary-table td.jigs-rank-5 { background-color: #808080; color: #fff !important; font-weight: bold; }
            /* --- END MODIFICATION --- */

            .sorted-asc::after { content: ' ▲'; }
            .sorted-desc::after { content: ' ▼'; }
            #line-by-line-table tbody tr:nth-child(odd) { background-color: #2a2a2a; }
            .jig-rigger-resizer { position: absolute; width: 12px; height: 12px; right: 0; bottom: 0; cursor: se-resize; }
            #jig-rigger-panel.jig-rigger-minimized { position: fixed !important; top: 150px !important; right: 10px !important; left: auto !important; bottom: auto !important; width: auto !important; height: auto !important; z-index: 9997; }
            #jig-rigger-panel.jig-rigger-minimized #jig-rigger-content, #jig-rigger-panel.jig-rigger-minimized .jig-rigger-resizer, #jig-rigger-panel.jig-rigger-minimized #jr-metric-selector { display: none; }
            #jig-rigger-panel.jig-rigger-minimized #jig-rigger-header { cursor: pointer; }
        `);

        // --- INITIALIZE (Listeners, Initial State) ---
        setTimeout(function() {
            const riggerPanelElement = document.getElementById('jig-rigger-panel');
            const riggerHeaderElement = document.getElementById('jig-rigger-header');
            const riggerResizerElement = riggerPanelElement ? riggerPanelElement.querySelector('.jig-rigger-resizer') : null;

            if (riggerPanelElement && riggerHeaderElement && riggerResizerElement) {
                console.log("JIGS Stats: Panel elements found. Initializing...");
                makeDraggable(riggerPanelElement, riggerHeaderElement);
                makeResizable(riggerPanelElement, riggerResizerElement);
                try {
                    document.getElementById('rigger-toggle').addEventListener('click', function() { const isMinimized = riggerPanelElement.classList.contains('jig-rigger-minimized'); if (!isMinimized) { originalPanelPosition.top = riggerPanelElement.style.top || '10px'; originalPanelPosition.left = riggerPanelElement.style.left || '10px'; } riggerPanelElement.classList.toggle('jig-rigger-minimized'); this.textContent = riggerPanelElement.classList.contains('jig-rigger-minimized') ? '+' : '-'; if (!riggerPanelElement.classList.contains('jig-rigger-minimized')) { riggerPanelElement.style.top = originalPanelPosition.top; riggerPanelElement.style.left = originalPanelPosition.left; riggerPanelElement.style.right = 'auto'; riggerPanelElement.style.bottom = 'auto'; const savedPositions = GM_getValue('jig_rigger_panel_position', {}); savedPositions.top = riggerPanelElement.style.top; savedPositions.left = riggerPanelElement.style.left; GM_setValue('jig_rigger_panel_position', savedPositions); } GM_setValue('jig_rigger_minimized', riggerPanelElement.classList.contains('jig-rigger-minimized')); });
                    document.getElementById('aggregated-toggle').addEventListener('click', function() { const section = document.getElementById('aggregated-section'); section.classList.toggle('collapsed'); this.textContent = section.classList.contains('collapsed') ? '+' : '-'; GM_setValue('jig_rigger_aggregated_collapsed', section.classList.contains('collapsed')); });
                    document.getElementById('line-by-line-toggle').addEventListener('click', function() { const section = document.getElementById('line-by-line-section'); section.classList.toggle('collapsed'); this.textContent = section.classList.contains('collapsed') ? '+' : '-'; GM_setValue('jig_rigger_line_by_line_collapsed', section.classList.contains('collapsed')); });
                    document.getElementById('jr_export-csv-button').addEventListener('click', exportToCSV);
                    document.getElementById('jr_toggle-chart-button').addEventListener('click', function() {
                        isChartVisible = !isChartVisible;
                        GM_setValue('jig_rigger_chart_visible', isChartVisible);
                        const chartContainer = document.getElementById('jr_chart-container');
                        if (isChartVisible && currentMetric !== 'trueValueSummary') {
                            chartContainer.style.display = 'block';
                            updateChart();
                        } else {
                            chartContainer.style.display = 'none';
                        }
                    });
                    document.querySelectorAll('#jr-metric-selector input[name="jr-metric"]').forEach(radio => {
                        radio.addEventListener('change', function() {
                            if (this.checked) {
                                currentMetric = this.value;
                                GM_setValue('jig_rigger_current_metric', currentMetric);
                                console.log("JIGS Stats: Metric changed to", currentMetric);
                                currentSortKey = (currentMetric === 'trueValueSummary') ? 'score' : 'name'; // Default to score for TV
                                currentSortDirection = (currentMetric === 'trueValueSummary') ? -1 : 1; // Score default desc
                                updateTableHeaders();
                                updateRiggerTable();
                                updateLineByLineTable(true);
                                const chartContainer = document.getElementById('jr_chart-container');
                                if (isChartVisible && currentMetric !== 'trueValueSummary') {
                                    chartContainer.style.display = 'block';
                                    updateChart();
                                } else {
                                    chartContainer.style.display = 'none';
                                }
                            }
                        });
                    });
                    document.getElementById('jr-winsorize-checkbox').addEventListener('change', function() {
                        isWinsorized = this.checked;
                        GM_setValue('jig_rigger_winsorized', isWinsorized);
                        console.log("JIGS Stats: Winsorize set to", isWinsorized);
                        updateRiggerTable();
                        updateLineByLineTable(true);
                        if (isChartVisible) updateChart();
                    });
                    document.getElementById('jr-isolate-tv-checkbox').addEventListener('change', function() {
                        isIsolateTrueValue = this.checked;
                        GM_setValue('jig_rigger_isolate_tv', isIsolateTrueValue);
                        console.log("JIGS Stats: Isolate True Value set to", isIsolateTrueValue);
                        if (isChartVisible && chartInstance) {
                            chartInstance.data.datasets[0].hidden = isIsolateTrueValue;
                            chartInstance.data.datasets[1].hidden = isIsolateTrueValue;
                            chartInstance.data.datasets[2].hidden = isIsolateTrueValue;
                            chartInstance.data.datasets[3].hidden = isIsolateTrueValue;
                            chartInstance.data.datasets[4].hidden = isIsolateTrueValue;
                            chartInstance.update('active');
                        }
                    });
                } catch (error) { console.error("JIGS Stats: Error attaching event listener:", error); }
                applySavedPanelState();
                setTimeout(observeJigsResults, 100);
            } else {
                console.error("JIGS Stats: Could not find essential panel elements during initialization timeout!");
                if (!riggerPanelElement) console.error("Missing: #jig-rigger-panel");
                if (!riggerHeaderElement) console.error("Missing: #jig-rigger-header");
                if (riggerPanelElement && !riggerResizerElement) console.error("Missing: .jig-rigger-resizer inside panel");
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWhenReady);
    } else {
        initializeWhenReady();
    }
})();