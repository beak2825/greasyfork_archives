// ==UserScript==
// @name         Torn Stat Enhancer Calculator
// @namespace    icey.torn.stat.enhancer.calculator
// @version      2.3
// @description  Calculate stat enhancer requirements and costs on Torn home page
// @author       IceBlueFire [776]
// @license      MIT
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555776/Torn%20Stat%20Enhancer%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/555776/Torn%20Stat%20Enhancer%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornStatCalculatorCollapsed';

    // ---------- Theme vars ----------
    function isDark() {
        return document.body?.classList?.contains('dark-mode');
    }

    function themeVars() {
        if (isDark()) {
            return {
                panelBg: 'var(--default-bg-panel-color, #181a1b)',
                inputBg: 'rgba(255,255,255,.06)',
                inputText: '#eee',
                inputBorder: 'rgba(255,255,255,.18)',
                placeholder: '#b9b9b9',
                roBg: 'rgba(255,255,255,.04)',
                roText: '#bdbdbd',
                resultsBg: 'rgba(255,255,255,.06)',
                resultsBorder: 'rgba(255,255,255,.12)',
                chevron: '#9a9a9a',
            };
        }
        // light
        return {
            panelBg: 'var(--default-bg-panel-color, #ffffff)',
            inputBg: '#ffffff',
            inputText: '#222',
            inputBorder: 'rgba(0,0,0,.18)',
            placeholder: '#666',
            roBg: 'rgba(0,0,0,.04)',
            roText: '#666',
            resultsBg: 'rgba(0,0,0,.05)',
            resultsBorder: 'rgba(0,0,0,.12)',
            chevron: '#666',
        };
    }

    // ---------- math ----------
    const format = n => n.toLocaleString('en-US');
    const parseNum = s => parseInt(String(s).replace(/,/g, ''), 10) || 0;

    function calculateStatAfterN(current, n) {
        let stat = current;
        for (let i = 0; i < n; i++) stat *= 1.01;
        return Math.floor(stat);
    }

    function enhancersNeeded(current, target) {
        if (target <= current) return 0;
        return Math.ceil(Math.log(target / current) / Math.log(1.01));
    }

    // ---------- read current stat from page ----------
    function getStatValue(name) {
        const wrap = document.querySelector('.battle');
        if (!wrap) return null;
        for (const li of wrap.querySelectorAll('li')) {
            const label = li.querySelector('.label');
            const desc = li.querySelector('.desc');
            if (label && desc && label.textContent.trim() === name) {
                return parseInt(desc.textContent.replace(/,/g, ''), 10);
            }
        }
        return null;
    }

    // ---------- widget ----------
    function applyVars(root) {
        const v = themeVars();
        root.style.setProperty('--sc-panel-bg', v.panelBg);
        root.style.setProperty('--sc-input-bg', v.inputBg);
        root.style.setProperty('--sc-input-text', v.inputText);
        root.style.setProperty('--sc-input-border', v.inputBorder);
        root.style.setProperty('--sc-placeholder', v.placeholder);
        root.style.setProperty('--sc-ro-bg', v.roBg);
        root.style.setProperty('--sc-ro-text', v.roText);
        root.style.setProperty('--sc-results-bg', v.resultsBg);
        root.style.setProperty('--sc-results-border', v.resultsBorder);
        root.style.setProperty('--sc-chevron', v.chevron);
    }

    function createWidget() {
        const box = document.createElement('div');
        box.className = 't-blue-cont h';
        box.id = 'stat-calculator-widget';
        applyVars(box);

        box.innerHTML = `
      <style>
        #stat-calculator-widget select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: var(--sc-input-bg) url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path fill='%23aaaaaa' d='M0,0 L10,0 L5,6 Z'/></svg>") no-repeat right 8px center;
          background-size: 10px 6px;
          padding-right: 22px;
        }

        body.dark-mode #stat-calculator-widget select {
          background: #2a2a2a url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path fill='%23cccccc' d='M0,0 L10,0 L5,6 Z'/></svg>") no-repeat right 8px center;
          color: #f1f1f1;
          border-color: rgba(255,255,255,.15);
        }

        body.dark-mode #stat-calculator-widget select option {
          background-color: #2a2a2a;
          color: #f1f1f1;
        }
        #stat-calculator-widget{ background:var(--sc-panel-bg); border-radius:5px; margin:10px 0; }
        #stat-calculator-widget .statcalc-header { cursor: pointer; user-select: none; }
        #stat-calculator-widget .statcalc-header + .calc-body { display: block; }
        #stat-calculator-widget .statcalc-header.collapsed + .calc-body { display: none; }

        #stat-calculator-widget .statcalc-header .accordion-header-arrow {
          pointer-events: none;
          transition: transform .2s;
          transform: rotate(90deg);
        }

        #stat-calculator-widget .statcalc-header.collapsed .accordion-header-arrow {transform: rotate(0deg);}

        #stat-calculator-widget .calc-body{ }
        #stat-calculator-widget .calc-content{ padding:10px }
        #stat-calculator-widget .calc-row{ margin:8px 0; display:flex; align-items:center; gap:8px }
        #stat-calculator-widget .calc-row label{ min-width:140px; font-size:13px; flex-shrink:0 }

        #stat-calculator-widget select,
        #stat-calculator-widget input{
          flex:1; min-width:0; padding:6px 8px; font-size:13px; border-radius:3px;
          background:var(--sc-input-bg); color:var(--sc-input-text);
          border:1px solid var(--sc-input-border);
        }
        #stat-calculator-widget input::placeholder{ color:var(--sc-placeholder); opacity:1; }
        #stat-calculator-widget input[readonly]{ background:var(--sc-ro-bg); color:var(--sc-ro-text) }

        #stat-calculator-widget .input-group{ display:flex; gap:8px; flex:1; min-width:0 }
        #stat-calculator-widget .input-group input{ flex:0 1 auto; width:160px }

        #stat-calculator-widget .calc-results{
          margin-top:10px; padding:10px; border-radius:3px;
          background:var(--sc-results-bg); border:1px solid var(--sc-results-border); display:none;
        }
        #stat-calculator-widget .calc-results.show{ display:block }
        #stat-calculator-widget .calc-results .label{ font-weight:600; display:inline-block; min-width:150px }
        #stat-calculator-widget .calc-results .value{ color:#7cc576 }
      </style>

        <div class="title title-black top-round statcalc-header" role="table">
            <div class="arrow-wrap">
                <a href="#/" role="button" class="accordion-header-arrow right" aria-label="Toggle Stat Enhancer Calculator" tabindex="0"></a>
            </div>
            <div class="move-wrap"><i class="accordion-header-move right"></i></div>
            <h5 class="box-title">Stat Enhancer Calculator</h5>
        </div>

        <div class="bottom-round calc-body">
            <div class="cont-gray bottom-round calc-content">
                <div class="calc-row">
                    <label>Select Stat:</label>
                    <select id="stat-select">
                        <option value="Strength">Strength</option>
                        <option value="Defense">Defense</option>
                        <option value="Speed">Speed</option>
                        <option value="Dexterity">Dexterity</option>
                    </select>
                </div>
                <div class="calc-row">
                    <label>Current Value:</label>
                    <input type="text" id="current-stat" readonly>
                </div>
                <div class="calc-row">
                    <label>Enhancer Cost:</label>
                    <input type="text" id="enhancer-cost" value="450,000,000">
                </div>
                <div class="calc-row">
                    <label>Number of Enhancers:</label>
                    <div class="input-group">
                        <input type="number" id="num-enhancers" placeholder="Enter number">
                        <button id="calc-by-num" type="button" class="torn-btn">Calculate</button>
                    </div>
                </div>
                <div class="calc-row">
                    <label>Target Stat Value:</label>
                    <div class="input-group">
                        <input type="text" id="target-stat" placeholder="Enter target">
                        <button id="calc-by-target" type="button" class="torn-btn">Calculate</button>
                    </div>
                </div>

                <div class="calc-results" id="results">
                    <div><span class="label">Enhancers Needed:</span> <span class="value" id="result-enhancers">-</span></div>
                    <div><span class="label">New Stat Value:</span> <span class="value" id="result-new-stat">-</span></div>
                    <div><span class="label">Total Cost:</span> <span class="value" id="result-cost">-</span></div>
                    <div><span class="label">Stat Increase:</span> <span class="value" id="result-increase">-</span></div>
                </div>
            </div>
        </div>
    `;
        return box;
    }

    // ---------- persistence & results ----------
    const getCollapsed = () => localStorage.getItem(STORAGE_KEY) === 'true';
    const setCollapsed = v => localStorage.setItem(STORAGE_KEY, String(v));

    function showResults(eCount, newStat, cost, increase) {
        document.getElementById('result-enhancers').textContent = format(eCount);
        document.getElementById('result-new-stat').textContent = format(newStat);
        document.getElementById('result-cost').textContent = '$' + format(cost);
        const base = newStat - increase;
        const pct = base ? ((increase / base) * 100).toFixed(2) : '0.00';
        document.getElementById('result-increase').textContent = `${format(increase)} (+${pct}%)`;
        document.getElementById('results').classList.add('show');
    }

    function updateCurrentStat() {
        const statName = document.getElementById('stat-select').value;
        const val = getStatValue(statName);
        document.getElementById('current-stat').value = val ? val.toLocaleString('en-US') : 'Not found';
    }

    function wireUp(widget) {
        const header = widget.querySelector('.statcalc-header');
        const body = widget.querySelector('.calc-body');

        if (getCollapsed()) {
            header.classList.add('collapsed');
            body.style.display = 'none';
        }
        header.addEventListener('click', () => {
            const collapsed = header.classList.toggle('collapsed');
            body.style.display = collapsed ? 'none' : 'block';
            setCollapsed(collapsed);
        });

        widget.querySelector('#stat-select').addEventListener('change', updateCurrentStat);
        widget.querySelector('#calc-by-num').addEventListener('click', () => {
            const current = parseNum(document.getElementById('current-stat').value);
            const enh = parseNum(document.getElementById('num-enhancers').value);
            const each = parseNum(document.getElementById('enhancer-cost').value);
            if (!current || !enh) return;
            const newStat = calculateStatAfterN(current, enh);
            showResults(enh, newStat, each * enh, newStat - current);
        });
        widget.querySelector('#calc-by-target').addEventListener('click', () => {
            const current = parseNum(document.getElementById('current-stat').value);
            const target = parseNum(document.getElementById('target-stat').value);
            const each = parseNum(document.getElementById('enhancer-cost').value);
            if (!current || !target || target <= current) return;
            const enh = enhancersNeeded(current, target);
            const newStat = calculateStatAfterN(current, enh);
            showResults(enh, newStat, each * enh, newStat - current);
        });
    }

    function mount() {
        const anchor =
            document.querySelector('#item10639953') ||
            document.querySelector('.content-title') ||
            document.querySelector('#content') ||
            document.body;

        const widget = createWidget();
        (anchor.parentNode || document.body).insertBefore(widget, anchor.nextSibling);
        wireUp(widget);
        updateCurrentStat();

        // re-theme live if the user toggles Torn’s theme
        const obs = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.attributeName === 'class') {
                    applyVars(widget);
                }
            }
        });
        obs.observe(document.body, {attributes: true, attributeFilter: ['class']});
    }

    // Wait a tick for the home modules to render
    function ready(fn) {
        (document.readyState === 'interactive' || document.readyState === 'complete')
            ? fn()
            : document.addEventListener('DOMContentLoaded', fn);
    }

    ready(() => setTimeout(mount, 400));
})();
