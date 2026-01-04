// ==UserScript==
// @name        Advent Incremental tooltips
// @namespace   Violentmonkey Scripts
// @match       https://paperpilot.dev/advent/*
// @match       https://thepaperpilot.itch.io/advent-incremental/*
// @grant       none
// @version     1.12
// @license     MIT
// @description simple tooltips to display resources
// @downloadURL https://update.greasyfork.org/scripts/558548/Advent%20Incremental%20tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/558548/Advent%20Incremental%20tooltips.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RESOURCES = [ //group is deprecated from when i had a different display
        { label: 'Logs',    group: 'trees', color: '#4BDC13', regex: /([\d.,e+]+)\s*logs/i },
        { label: 'Coal',    group: 'coal',  color: '#aaa',    regex: /([\d.,e+]+)\s*coal/i },
        { label: 'Ash',     group: 'coal',  color: '#B2BEB5', regex: /([\d.,e+]+)\s*ash/i },
        { label: 'Paper',   group: 'paper', color: '#E8DCB8', regex: /([\d.,e+]+)\s*paper/i },
        { label: 'Boxes',   group: 'boxes', color: '#D2691E', regex: /([\d.,e+]+)\s*boxes/i },
        { label: 'Metal',   group: 'metal', color: '#888B8D', regex: /([\d.,e+]+)\s*metal\s*ingots/i },
        { label: 'Ore',     group: 'metal', color: '#666',    regex: /([\d.,e+]+)\s*ore/i },
        { label: 'Cloth',   group: 'cloth', color: '#fff',    regex: /([\d.,e+]+)\s*cloth/i },
        { label: 'Wool',    group: 'cloth', color: '#ddd',    regex: /([\d.,e+]+)\s*wool/i },
        { label: 'Sheep',   group: 'cloth', color: '#bbb',    regex: /([\d.,e+]+)\s*sheep/i },
        { label: 'Oil',     group: 'oil',   color: '#333',    regex: /([\d.,e+]+)\s*oil/i },
        { label: 'Plastic', group: 'oil',   color: '#B8AC74', regex: /([\d.,e+]+)\s*plastic/i },
        { label: 'Red Dye', group: 'dye',   color: 'red', regex: /([\d.,e+]+)\s*red\s*dye/i },
        { label: 'Yellow Dye', group: 'dye',   color: 'yellow', regex: /([\d.,e+]+)\s*yellow\s*dye/i },
        { label: 'Blue Dye', group: 'dye',   color: 'blue', regex: /([\d.,e+]+)\s*blue\s*dye/i },
        { label: 'Orange Dye', group: 'dye',   color: 'orange', regex: /([\d.,e+]+)\s*orange\s*dye/i },
        { label: 'Green Dye', group: 'dye',   color: 'green', regex: /([\d.,e+]+)\s*green\s*dye/i },
        { label: 'Purple Dye', group: 'dye',   color: 'purple', regex: /([\d.,e+]+)\s*purple\s*dye/i }
    ];

    // === STATE ===
    let LATEST_VALUES = {};
    let LATEST_RATES = {};
    let MOUSE_X = 0;
    let MOUSE_Y = 0;
    let LAST_TARGET = null;
    let TOOLTIP_VISIBLE = false;
    let TOOLTIP_CONTENT = '';

    // === STYLES ===
    const CSS = `
        #advent-cost-tooltip {
            position: fixed; top: 0; left: 0;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid #444;
            border-radius: 4px;
            padding: 4px 4px;
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            z-index: 99999;
            pointer-events: none; display: none;
            white-space: nowrap;
            box-shadow: 0 6px 12px rgba(0,0,0,0.5);
            text-align: left;
            will-change: transform;
            transition: none !important;
        }
        .tooltip-header {
        }
        .tooltip-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: baseline;
        }
        .tooltip-name {
            font-weight: bold;
        }
        .tooltip-right {
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        .tooltip-val {
            font-weight: bold;
        }
        .tooltip-rate {
            font-weight: normal;
            color: #777;
            font-size: 0.9em;
        }
        .tooltip-pct {
            font-weight: normal;
            font-size: 0.9em;
        }
    `;

    // === HELPER ===
    function parseGameNum(str) {
        if (!str) return 0;
        const clean = str.replace(/,/g, '');
        return parseFloat(clean);
    }

    // === INIT ===
    let tooltip = null;

    function init() {
        const s = document.createElement('style');
        s.innerHTML = CSS;
        document.head.appendChild(s);

        tooltip = document.createElement('div');
        tooltip.id = 'advent-cost-tooltip';
        document.body.appendChild(tooltip);

        document.body.addEventListener('mousemove', (e) => {
            MOUSE_X = e.clientX;
            MOUSE_Y = e.clientY;
            LAST_TARGET = e.target;
        });

        setInterval(scrapeData, 33);
        requestAnimationFrame(renderLoop);
    }

    // === LOOP 1: SCRAPE ===
    function scrapeData() {
        const values = {};
        const rates = {};
        const textNodes = document.querySelectorAll('.main-display, .layer-tab .desc');

        for (const node of textNodes) {
            const text = node.innerText;
            if (!text) continue;

            const isMain = node.classList.contains('main-display');

            for (const res of RESOURCES) {
                if (!values[res.label]) {
                    const match = text.match(res.regex);
                    if (match) {
                        values[res.label] = match[1];
                        if (isMain) {
                            const rateMatch = text.match(/([+\-][\d.,e+]+)\/s/);
                            if (rateMatch) rates[res.label] = rateMatch[1];
                        }
                    }
                }
            }
        }
        LATEST_VALUES = values;
        LATEST_RATES = rates;
    }

    // === LOOP 2: RENDER ===
    function renderLoop() {
        updateTooltipContent();

        if (TOOLTIP_VISIBLE) {
            tooltip.style.transform = `translate3d(${MOUSE_X + 15}px, ${MOUSE_Y + 15}px, 0)`;
            if (tooltip.innerHTML !== TOOLTIP_CONTENT) {
                tooltip.innerHTML = TOOLTIP_CONTENT;
            }
            tooltip.style.display = 'block';
        } else {
            tooltip.style.display = 'none';
        }
        requestAnimationFrame(renderLoop);
    }

    // === LOGIC ===
    function updateTooltipContent() {
        if (!LAST_TARGET) {
            TOOLTIP_VISIBLE = false;
            return;
        }

        const btn = LAST_TARGET.closest('button') || LAST_TARGET.closest('.feature');

        if (btn && btn.innerText && btn.innerText.includes('Cost:')) {
            const rawText = btn.innerText;
            const costIndex = rawText.indexOf("Cost:");
            const costText = rawText.substring(costIndex).toLowerCase();

            let rows = '';
            let foundMatch = false;

            RESOURCES.forEach(res => {
                const stockStr = LATEST_VALUES[res.label];
                if (stockStr && costText.includes(res.label.toLowerCase())) {

                    const costRegex = new RegExp('([\\d.,e+]+)\\s*' + res.label, 'i');
                    const costMatch = costText.match(costRegex);

                    let percentStr = '';
                    if (costMatch) {
                        const costVal = parseGameNum(costMatch[1]);
                        const stockVal = parseGameNum(stockStr);
                        if (stockVal > 0) {
                            const pct = (costVal / stockVal) * 100;
                            const nicePct = Math.round(pct);
                            const pctColor = pct > 100 ? '#ff4444' : '#777';
                            percentStr = `<span class="tooltip-pct" style="color: ${pctColor}">(${nicePct}%)</span>`;
                        }
                    }

                    // Get Rate if available
                    const rateStr = LATEST_RATES[res.label]
                        ? `<span class="tooltip-rate">(${LATEST_RATES[res.label]}/s)</span>`
                        : '';

                    rows += `
                        <div class="tooltip-row">
                            <span class="tooltip-name" style="color:${res.color}">${res.label}:</span>
                            <span class="tooltip-right">
                                <span class="tooltip-val" style="color:${res.color}">${stockStr}</span>
                                ${rateStr}
                                ${percentStr}
                            </span>
                        </div>
                    `;
                    foundMatch = true;
                }
            });

            if (foundMatch) {
                TOOLTIP_CONTENT = `<div class="tooltip-header"></div>${rows}`;
                TOOLTIP_VISIBLE = true;
            } else {
                TOOLTIP_VISIBLE = false;
            }
        } else {
            TOOLTIP_VISIBLE = false;
        }
    }

    init();

})();