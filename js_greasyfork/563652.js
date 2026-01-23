// ==UserScript==
// @name         Scopus Citation Forecaster
// @namespace    http://tampermonkey.net/
// @version      20.0
// @description  Forecasts citations with advanced models. Includes a "Force Update" button in the toolbar for instant reloading after filtering.
// @author       Gemini
// @match        https://www.scopus.com/*
// @match        *://*-scopus-com.*/*citation*
// @match        *://scopus-com.*/*citation*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563652/Scopus%20Citation%20Forecaster.user.js
// @updateURL https://update.greasyfork.org/scripts/563652/Scopus%20Citation%20Forecaster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        forecastYears: 10,
        pollingInterval: 1000,
        debounceTime: 500,
        explosionThresholdMultiplier: 5
    };

    let tableObserver = null;
    let debounceTimer = null;
    let globalComparisonData = null;

    // ==========================================
    //      MATH KERNEL
    // ==========================================

    const MathUtil = {
        isLeap: (y) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0),
        daysInYear: (y) => MathUtil.isLeap(y) ? 366 : 365,
        solveLinearSystem: (matrix, vector) => {
            const n = vector.length;
            for (let i = 0; i < n; i++) {
                let maxEl = Math.abs(matrix[i][i]), maxRow = i;
                for (let k = i + 1; k < n; k++) if (Math.abs(matrix[k][i]) > maxEl) { maxEl = Math.abs(matrix[k][i]); maxRow = k; }
                for (let k = i; k < n; k++) { const tmp = matrix[maxRow][k]; matrix[maxRow][k] = matrix[i][k]; matrix[i][k] = tmp; }
                const tmp = vector[maxRow]; vector[maxRow] = vector[i]; vector[i] = tmp;
                if (Math.abs(matrix[i][i]) < 1e-10) return null;
                for (let k = i + 1; k < n; k++) {
                    const c = -matrix[k][i] / matrix[i][i];
                    for (let j = i; j < n; j++) { if (i === j) matrix[k][j] = 0; else matrix[k][j] += c * matrix[i][j]; }
                    vector[k] += c * vector[i];
                }
            }
            const x = new Array(n).fill(0);
            for (let i = n - 1; i > -1; i--) {
                let sum = 0;
                for (let j = i + 1; j < n; j++) sum += matrix[i][j] * x[j];
                x[i] = (vector[i] - sum) / matrix[i][i];
            }
            return x;
        }
    };

    const Regression = {
        calculateAnnualL1: (xYears, yActual, predictDailyFn, startYear) => {
            let sumAbsError = 0;
            const currentYear = new Date().getFullYear();
            let count = 0;
            for(let i=0; i<xYears.length; i++) {
                if (xYears[i] >= currentYear) continue;
                const days = MathUtil.daysInYear(xYears[i]);
                const relYr = xYears[i] - startYear;
                const predictedAnnual = predictDailyFn(relYr) * days;
                if (!isFinite(predictedAnnual)) return Infinity;
                sumAbsError += Math.abs(yActual[i] - predictedAnnual);
                count++;
            }
            return count > 0 ? sumAbsError / count : Infinity;
        },

        linear: (x, y) => {
            const n = y.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (let i = 0; i < n; i++) { sumX += x[i]; sumY += y[i]; sumXY += x[i] * y[i]; sumXX += x[i] * x[i]; }
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            return { name: 'Linear', formula: 'mx + c', predict: (val) => slope * val + intercept };
        },
        exponential: (x, y) => {
            const yLog = y.map(val => Math.log(Math.max(val, 0.001)));
            const n = x.length;
            let sx = 0, syL = 0, sxyL = 0, sxx = 0;
            for(let i=0; i<n; i++){ sx+=x[i]; syL+=yLog[i]; sxyL+=x[i]*yLog[i]; sxx+=x[i]*x[i]; }
            const b = (n*sxyL - sx*syL)/(n*sxx - sx*sx);
            const a = Math.exp((syL - b*sx)/n);
            if (b > 1.0) return null;
            return { name: 'Exponential', formula: 'ae^(bx)', predict: (val) => a * Math.exp(b * val) };
        },
        polynomial: (x, y, degree) => {
            const matrix = Array.from({ length: degree + 1 }, () => Array(degree + 1).fill(0));
            const vector = Array(degree + 1).fill(0);
            const xPowers = Array(2 * degree + 1).fill(0);
            for (let i = 0; i < 2 * degree + 1; i++) xPowers[i] = x.reduce((sum, xi) => sum + Math.pow(xi, i), 0);
            for (let i = 0; i <= degree; i++) {
                for (let j = 0; j <= degree; j++) matrix[i][j] = xPowers[i + j];
                vector[i] = x.reduce((sum, xi, k) => sum + Math.pow(xi, i) * y[k], 0);
            }
            const coeffs = MathUtil.solveLinearSystem(matrix, vector);
            if(!coeffs) return null;
            return {
                name: degree === 2 ? 'Quadratic' : 'Cubic',
                formula: 'Polynomial',
                predict: (val) => coeffs.reduce((sum, coeff, power) => sum + coeff * Math.pow(val, power), 0)
            };
        },
        gaussian: (x, y) => {
            const yLog = y.map(val => Math.log(Math.max(val, 0.001)));
            const poly = Regression.polynomial(x, yLog, 2);
            if (!poly) return null;
            return { name: 'Gaussian', formula: 'Bell Curve', predict: (val) => Math.exp(poly.predict(val)) };
        }
    };

    // ==========================================
    //      PLOTTING ENGINE
    // ==========================================

    function generateSVG(data, model, comparison) {
        const { xYears, yCitations, lastYear, currentYear, currentYearProjection, startYear } = data;
        const width = 600, height = 300;
        const pad = { t: 30, b: 40, l: 50, r: 20 };
        const drawW = width - pad.l - pad.r;
        const drawH = height - pad.t - pad.b;

        const isRelativeMode = !!comparison;
        const getOffset = (isComp) => {
            if (!isRelativeMode) return 0;
            if (isComp) return comparison.historyX[0];
            return startYear;
        };
        const currentOffset = getOffset(false);
        const compOffset = comparison ? getOffset(true) : 0;

        const forecastX = [];
        const forecastY = [];
        for(let i=1; i<=CONFIG.forecastYears; i++) {
            const yr = lastYear + i;
            const relYr = yr - startYear;
            const val = Math.max(0, model.predict(relYr) * MathUtil.daysInYear(yr));
            forecastX.push(yr - currentOffset);
            forecastY.push(val);
        }

        const histX = xYears.filter(y => y < currentYear).map(y => y - currentOffset);
        const histY = yCitations.filter((_, i) => xYears[i] < currentYear);

        let compHistX = [], compHistY = [], compForeX = [], compForeY = [];
        if (comparison) {
            compHistX = comparison.historyX.map(y => y - compOffset);
            compHistY = comparison.historyY;
            compForeX = comparison.forecastX.map(y => y - compOffset);
            compForeY = comparison.forecastY;
        }

        const allX = [...histX, ...forecastX, ...compHistX, ...compForeX];
        const allY = [...histY, ...forecastY, ...compHistY, ...compForeY];
        let currX = null, currY = null;
        if (currentYearProjection) {
            currX = currentYear - currentOffset;
            currY = currentYearProjection;
            allX.push(currX); allY.push(currY);
        }

        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = 0;
        const maxY = Math.max(...allY) * 1.15;

        const sX = (v) => pad.l + ((v - minX) / (maxX - minX)) * drawW;
        const sY = (v) => pad.t + drawH - ((v - minY) / (maxY - minY)) * drawH;

        const drawLine = (xs, ys, color, dash, opacity=1) => {
            if (xs.length < 2) return '';
            let d = `M ${sX(xs[0])} ${sY(ys[0])}`;
            for(let i=1; i<xs.length; i++) d += ` L ${sX(xs[i])} ${sY(ys[i])}`;
            return `<path d="${d}" stroke="${color}" stroke-width="2" fill="none" opacity="${opacity}" ${dash ? 'stroke-dasharray="5,3"' : ''} />`;
        };

        const drawCircles = (xs, ys, color, labelPrefix) => xs.map((x, i) => `
            <g>
                <title>${labelPrefix || ''} Year ${isRelativeMode ? x : x}: ${Math.round(ys[i])} citations</title>
                <circle cx="${sX(x)}" cy="${sY(ys[i])}" r="3.5" fill="${color}" style="cursor:pointer"/>
            </g>`).join('');

        let pModel = "";
        for(let i=0; i<=drawW; i+=3) {
            const plotX = minX + (i/drawW) * (maxX - minX);
            const relInput = isRelativeMode ? plotX : plotX - startYear;
            const daily = model.predict(relInput);
            const annual = daily * 365.25;
            const pixelY = sY(annual);
            if (pixelY < -500 || pixelY > height + 500) continue;
            pModel += (pModel ? " L " : "M ") + `${pad.l + i} ${Math.min(Math.max(pixelY, -50), height+50)}`;
        }
        const modelCurvePath = `<path d="${pModel}" stroke="#FF6D00" stroke-width="2.5" stroke-dasharray="4,2" fill="none" opacity="0.8" />`;

        const grid = [];
        for(let i=0; i<=5; i++){
            const val = minY + (maxY-minY)*(i/5);
            const y = sY(val);
            grid.push(`<line x1="${pad.l}" y1="${y}" x2="${width-pad.r}" y2="${y}" stroke="#f0f0f0" />`);
            grid.push(`<text x="${pad.l-5}" y="${y+4}" text-anchor="end" font-size="10" fill="#999">${Math.round(val)}</text>`);
        }
        const xLab = [];
        const step = Math.max(1, Math.ceil((maxX - minX) / 8));
        for(let val=Math.ceil(minX); val<=Math.floor(maxX); val+=step){
            const label = isRelativeMode ? `Yr ${val}` : val;
            xLab.push(`<text x="${sX(val)}" y="${height-10}" text-anchor="middle" font-size="10" fill="#999">${label}</text>`);
        }

        let currPt = "";
        if (currX !== null) {
            currPt = `<g><title>Current Year Projection\nBased on run-rate: ${Math.round(currY)}</title><circle cx="${sX(currX)}" cy="${sY(currY)}" r="5" stroke="#FF6D00" stroke-width="2" fill="white" style="cursor:help" /></g>`;
        }

        return `
            <svg width="100%" viewBox="0 0 ${width} ${height}" style="background:white; border-radius:4px; margin-top:10px;">
                ${grid.join('')} ${xLab.join('')}
                <text x="${width/2}" y="${height-25}" text-anchor="middle" font-size="9" fill="#aaa" style="font-weight:bold; letter-spacing:1px;">
                    ${isRelativeMode ? 'YEARS ACTIVE' : 'CALENDAR YEAR'}
                </text>
                ${drawLine(compHistX, compHistY, '#9c27b0', false, 0.6)}
                ${drawLine(compForeX, compForeY, '#ce93d8', true, 0.6)}
                ${drawCircles(compHistX, compHistY, '#9c27b0', 'Comparison')}
                ${drawLine(histX, histY, '#007398', false, 0.4)}
                ${modelCurvePath}
                ${drawCircles(histX, histY, '#007398', 'Actual')}
                ${drawCircles(forecastX, forecastY, '#FF6D00', 'Forecast')}
                ${currPt}
                <g transform="translate(${pad.l + 10}, ${pad.t})">
                    <rect x="0" y="-10" width="10" height="10" fill="#007398"/>
                    <text x="15" y="0" font-size="11" fill="#333">Actual</text>
                    <rect x="70" y="-10" width="10" height="2" fill="#FF6D00"/>
                    <text x="85" y="0" font-size="11" fill="#333">Trend</text>
                    ${comparison ? `<text x="140" y="0" font-size="11" fill="#9c27b0">Compare</text>` : ''}
                </g>
            </svg>
        `;
    }

    function injectStyles() {
        if (document.getElementById('scopus-forecast-styles')) return;
        const style = document.createElement('style');
        style.id = 'scopus-forecast-styles';
        style.innerHTML = `
            #scopus-forecast-ui { margin: 15px 0; padding: 15px; background: #fff; border: 1px solid #e0e0e0; border-left: 4px solid #FF6D00; font-family: "NexusSans", Arial, sans-serif; color: #333; max-width: 800px; }
            .sf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-wrap:wrap; gap:10px;}
            .sf-header h3 { margin: 0; font-size: 16px; color: #444; }
            .sf-controls { display:flex; gap:5px; align-items: center; }
            .sf-btn { border:1px solid #ccc; background:#f9f9f9; padding:4px 8px; cursor:pointer; border-radius:3px; font-size:11px; font-weight:600; color:#444; }
            .sf-btn:hover { background:#eee; }
            .sf-btn-update { border-color:#FF6D00; color:#d84315; }
            .sf-controls select { padding: 3px 5px; border: 1px solid #ccc; font-size: 11px; color: #444; }
            .sf-stats { font-size: 11px; color: #888; border-bottom:1px solid #f0f0f0; padding-bottom:8px; margin-bottom:8px; }
            .sf-warning { color: #d32f2f; margin-left: 10px; font-style: italic; }
            .sf-table-wrapper { max-height: 180px; overflow-y:auto; margin-top:10px; border-top: 1px solid #eee; }
            .sf-table { width: 100%; border-collapse: collapse; font-size: 11px; }
            .sf-table th { position:sticky; top:0; background: #fafafa; padding: 5px; text-align: left; border-bottom: 1px solid #ddd; color: #666; }
            .sf-table td { padding: 4px 5px; border-bottom: 1px solid #f5f5f5; }
            .sf-pred { color: #FF6D00; font-weight: bold; }
            .sf-cumulative { color: #555; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    //      LOGIC & INIT
    // ==========================================

    function processData(xYears, yCitations) {
        const firstNonZero = yCitations.findIndex(c => c > 0);
        if (firstNonZero > -1) { xYears = xYears.slice(firstNonZero); yCitations = yCitations.slice(firstNonZero); }
        if (xYears.length === 0) return null;

        const currentYear = new Date().getFullYear();
        const now = new Date();
        const startOfYear = new Date(currentYear, 0, 1);
        const daysElapsed = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

        const xTrain = [];
        const yTrainDaily = [];
        const historySum = yCitations.reduce((a, b) => a + b, 0);
        let currentYearProjection = null;

        xYears.forEach((year, index) => {
            const raw = yCitations[index];
            if (year < currentYear) {
                xTrain.push(year - xYears[0]);
                yTrainDaily.push(raw / MathUtil.daysInYear(year));
            } else if (year === currentYear) {
                const dailyRate = raw / Math.max(1, daysElapsed);
                currentYearProjection = dailyRate * MathUtil.daysInYear(year);
            }
        });

        const startYear = xYears[0];
        const lastCompleteYear = xYears.filter(y => y < currentYear).pop() || startYear;
        return { xYears, yCitations, xTrain, yTrainDaily, startYear, lastYear: lastCompleteYear, historySum, currentYear, currentYearProjection };
    }

    function runModels(data) {
        if (!data || data.xTrain.length < 2) return { valid: [], hidden: 0 };
        const models = [
            Regression.linear(data.xTrain, data.yTrainDaily),
            Regression.polynomial(data.xTrain, data.yTrainDaily, 2),
            Regression.polynomial(data.xTrain, data.yTrainDaily, 3),
            Regression.exponential(data.xTrain, data.yTrainDaily),
            Regression.gaussian(data.xTrain, data.yTrainDaily)
        ].filter(m => m !== null);

        models.forEach(m => {
            m.l1 = Regression.calculateAnnualL1(data.xYears, data.yCitations, m.predict, data.startYear);
        });

        const maxHistoryDaily = Math.max(...data.yTrainDaily);
        const validModels = [];
        let hiddenCount = 0;

        models.forEach(m => {
            let safe = true;
            for(let i=1; i<=CONFIG.forecastYears; i++) {
                const relYr = (data.lastYear + i) - data.startYear;
                const pred = m.predict(relYr);
                if (pred > maxHistoryDaily * CONFIG.explosionThresholdMultiplier || pred < 0 || isNaN(pred)) {
                    safe = false; break;
                }
            }
            if (safe) validModels.push(m); else hiddenCount++;
        });

        if (validModels.length === 0) validModels.push(models.find(m => m.name === 'Linear') || models[0]);
        validModels.sort((a, b) => a.l1 - b.l1);
        return { valid: validModels, hidden: hiddenCount };
    }

    function getAuthorName() {
        const h1 = document.querySelector('h1');
        if (h1) return h1.innerText.replace('Citation overview', '').trim();
        return "Unknown Author";
    }

    async function copyToClipboard(data, model, forecastY) {
        const forecastX = [];
        for(let i=1; i<=CONFIG.forecastYears; i++) forecastX.push(data.lastYear + i);
        const payload = {
            name: getAuthorName(),
            historyX: data.xYears.filter(y => y < data.currentYear),
            historyY: data.yCitations.filter((_,i) => data.xYears[i] < data.currentYear),
            forecastX: forecastX,
            forecastY: forecastY
        };
        try {
            await navigator.clipboard.writeText(JSON.stringify(payload));
            const btn = document.querySelector('#sf-btn-copy');
            if(btn) { btn.innerText = "✅ Copied"; setTimeout(() => btn.innerText = "📋 Copy", 2000); }
        } catch (err) { alert("Clipboard error."); }
    }

    async function pasteFromClipboard(renderCallback) {
        try {
            const text = await navigator.clipboard.readText();
            const json = JSON.parse(text);
            if (json.historyX && json.historyY) { globalComparisonData = json; renderCallback(); }
            else { alert("Invalid data."); }
        } catch (err) { alert("Clipboard error."); }
    }

    // --- UI Creation ---
    function injectManualButton() {
        if (document.getElementById('sf-manual-trigger')) return;

        // Try to find the toolbar actions wrapper
        const actionsWrapper = document.querySelector('.Actions_wrapper__jCB49') || document.querySelector('[class*="Actions_wrapper"]');

        if (actionsWrapper) {
            const btn = document.createElement('button');
            btn.id = 'sf-manual-trigger';
            btn.className = 'Button_button__9XFW1 Button_container__MiJqt Button_size-s__HCckE Button_secondary__wBObt';
            btn.style.marginLeft = "10px";
            btn.style.border = "1px solid #FF6D00";
            btn.style.color = "#FF6D00";
            btn.innerHTML = `<span class="Button_text__0dddp">🔄 Update Forecast</span>`;

            btn.onclick = () => {
                btn.innerHTML = `<span class="Button_text__0dddp">Updating...</span>`;
                setTimeout(() => {
                    attemptExtraction();
                    btn.innerHTML = `<span class="Button_text__0dddp">🔄 Update Forecast</span>`;
                }, 100);
            };
            actionsWrapper.appendChild(btn);
        }
    }

    function render(data, modelResult) {
        const models = modelResult.valid;
        const hiddenCount = modelResult.hidden;
        injectStyles();
        injectManualButton(); // Ensure button exists

        let container = document.getElementById('scopus-forecast-ui');
        if (!container) {
            container = document.createElement('div');
            container.id = 'scopus-forecast-ui';
            const tableWrapper = document.querySelector('table').closest('div');
            if (tableWrapper) tableWrapper.parentNode.insertBefore(container, tableWrapper);
            else document.querySelector('table').parentNode.insertBefore(container, document.querySelector('table'));
        }

        const select = document.getElementById('sf-model-selector');
        let currentModel = models[select && select.options[select.selectedIndex] ? select.selectedIndex : 0] || models[0];

        let htmlTable = '';
        let cumulative = data.historySum;
        const forecastY = [];
        const startForecast = data.lastYear + 1;
        const endForecast = startForecast + CONFIG.forecastYears;

        for (let yr = startForecast; yr < endForecast; yr++) {
            const relYr = yr - data.startYear;
            const days = MathUtil.daysInYear(yr);
            let daily = currentModel.predict(relYr);
            if(daily < 0) daily = 0;
            let annual = Math.round(daily * days);
            forecastY.push(annual);
            cumulative += annual;
            htmlTable += `<tr><td>${yr}</td><td class="sf-pred">${annual.toLocaleString()}</td><td class="sf-cumulative">${cumulative.toLocaleString()}</td></tr>`;
        }

        const warningText = hiddenCount > 0 ? `<span class="sf-warning" title="Models hidden due to unstable projections">⚠ ${hiddenCount} hidden</span>` : '';

        container.innerHTML = `
            <div class="sf-header">
                <h3>📈 Citation Forecast${globalComparisonData ? ' (Compare)' : ''}</h3>
                <div class="sf-controls">
                     <button id="sf-btn-copy" class="sf-btn">📋 Copy</button>
                     <button id="sf-btn-paste" class="sf-btn">📥 Paste</button>
                    <select id="sf-model-selector">
                        ${models.map((m, i) => `<option value="${i}" ${m === currentModel ? 'selected' : ''}>${m.name} (Err: ±${Math.round(m.l1)})</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="sf-stats">
                Data Start: <strong>${data.startYear}</strong> | Formula: ${currentModel.formula} ${warningText}
            </div>
            ${generateSVG(data, currentModel, globalComparisonData)}
            <div class="sf-table-wrapper">
                <table class="sf-table">
                    <thead><tr><th>Year</th><th>Predicted</th><th>Cumulative</th></tr></thead>
                    <tbody>${htmlTable}</tbody>
                </table>
            </div>
        `;

        container.querySelector('#sf-model-selector').addEventListener('change', (e) => { currentModel = models[e.target.value]; render(data, modelResult); });
        container.querySelector('#sf-btn-copy').addEventListener('click', () => copyToClipboard(data, currentModel, forecastY));
        container.querySelector('#sf-btn-paste').addEventListener('click', () => pasteFromClipboard(() => render(data, modelResult)));
    }

    function attemptExtraction() {
        const table = document.querySelector('table');
        if (!table) return;

        // Ensure button is there
        injectManualButton();

        if (!tableObserver) {
            tableObserver = new MutationObserver(() => { clearTimeout(debounceTimer); debounceTimer = setTimeout(attemptExtraction, CONFIG.debounceTime); });
            tableObserver.observe(table, { childList: true, subtree: true, characterData: true });
        }
        const rows = Array.from(table.querySelectorAll('tr'));
        let headerRow = null, maxYears = 0;
        rows.forEach(r => {
            const c = Array.from(r.children).filter(td => /^(19|20)\d{2}$/.test(td.innerText.trim())).length;
            if (c > maxYears) { maxYears = c; headerRow = r; }
        });
        if (!headerRow || maxYears < 3) return;
        const dataRow = rows.find(r => r !== headerRow && (r.innerText.toLowerCase().includes('total') || r.innerText.toLowerCase().includes('subtotal')));
        if (!dataRow) return;

        const xRaw = [], yRaw = [];
        const hCells = Array.from(headerRow.children);
        const dCells = Array.from(dataRow.children);
        hCells.forEach((th, i) => {
            const yr = parseInt(th.innerText.trim(), 10);
            if (!isNaN(yr) && yr > 1900 && yr < 2100) {
                if (dCells[i]) {
                    const valStr = dCells[i].innerText.replace(/,/g, '').trim();
                    if (/^\d+$/.test(valStr)) { xRaw.push(yr); yRaw.push(parseInt(valStr, 10)); }
                }
            }
        });
        if (xRaw.length < 3) return;
        const processed = processData(xRaw, yRaw);
        if (processed) {
            const modelResult = runModels(processed);
            if (modelResult.valid.length) render(processed, modelResult);
        }
    }

    setInterval(() => { const t = document.querySelector('table'); if (t && !tableObserver) attemptExtraction(); }, CONFIG.pollingInterval);

})();