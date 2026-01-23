// ==UserScript==
// @name         BullionVault Pro Dashboard Suite
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Complete visual overhaul: Live Spreads & Fees on Order Board + Real-time Liquidation Values on P&L.
// @author       http://github.com/9iiota
// @match        https://www.bullionvault.com/secure/order-board.do*
// @match        https://www.bullionvault.com/secure/profit-and-loss.do*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563611/BullionVault%20Pro%20Dashboard%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/563611/BullionVault%20Pro%20Dashboard%20Suite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- ROUTER LOGIC ---
    const currentUrl = window.location.href;

    if (currentUrl.includes('order-board.do')) {
        initOrderBoard();
    } else if (currentUrl.includes('profit-and-loss.do')) {
        initProfitLoss();
    }

    // =========================================================================
    // MODULE 1: ORDER BOARD (Spread & Fees)
    // =========================================================================
    function initOrderBoard() {
        console.log("BV Suite: Initializing Order Board Module...");

        // CONFIGURATION
        const OBSERVE_TARGET_ID = 'orderBoardContainer';
        const FEE_PERCENTAGE = 0.5; // 0.5% fee
        const SUBSCRIPT_TEXT = 'fee';
        const TOOLTIP_TEXT = "The 'Round Trip' cost. This is the exact percentage the market Bid price must rise for you to break even if you buy now (accounting for the 0.5% commission on both buying and selling).";

        // --- VISUAL OVERHAUL ---
        function addGlobalStyle() {
            const style = document.createElement('style');
            style.innerHTML = `
            /* --- 1. CORE LAYOUT FIXES --- */
            .webpage--order-board .table--order-board .bids .price,
            .webpage--order-board .table--order-board .offers .price {
                overflow: visible !important;
            }

            @media (min-width: 992px) {
                .webpage--order-board .card--order-board .bids,
                .webpage--order-board .card--order-board .offers {
                    width: auto !important;
                }
            }

            /* --- 2. Z-INDEX FIX FOR NATIVE TOOLTIP --- */
            #orderTip {
                z-index: 2147483647 !important;
                pointer-events: none;
            }

            /* Table padding fixes */
            .table--full-width td:last-child, .table--full-width th:last-child { padding-right: unset !important; }
            .table--full-width td:first-child, .table--full-width th:first-child { padding-left: .75rem !important; }
            .webpage--order-board .table--order-board td { padding-top: 8px !important; padding-bottom: 8px !important; vertical-align: middle !important; }

            /* --- 3. INFO ICON STYLING --- */
            .bv-info-icon {
                display: inline-block; width: 12px; height: 12px; line-height: 12px;
                text-align: center; border-radius: 50%; border: 1px solid #999;
                color: #999; font-size: 9px; font-family: serif; font-style: italic;
                margin-left: 5px; cursor: help; opacity: 0.7; transition: all 0.2s;
            }
            .bv-info-icon:hover { border-color: #333; color: #333; opacity: 1; font-weight: bold; transform: scale(1.2); }

            /* --- 4. MODERN DASHBOARD THEME (NEUTRAL COLORS) --- */

            /* A. Metal Identity Strips (Left Border) */
            tr.pitch { border-left: 4px solid transparent; transition: background 0.1s; }
            tr.pitch--gold { border-left-color: #FFD700 !important; }
            tr.pitch--silver { border-left-color: #C0C0C0 !important; }
            tr.pitch--platinum { border-left-color: #E5E4E2 !important; }
            tr.pitch--palladium { border-left-color: #CED0DD !important; }

            /* B. Row Hover Effect */
            tr.pitch:hover { background-color: #f8f9fa !important; }

            /* C. Zone Coloring (Buy vs Sell) */
            td.pitch__bids { background-color: rgba(40, 167, 69, 0.03); border-left: 1px solid rgba(0,0,0,0.05); }
            td.pitch__offers { background-color: rgba(220, 53, 69, 0.03); border-left: 1px solid rgba(0,0,0,0.05); }

            /* D. "Best Price" Card Styling */
            .price.best {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                padding: 6px 8px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                position: relative;
                min-width: 120px;
            }

            /* E. Typography Tweaks */
            .pitch__security { font-weight: 600; color: #444; }
            .pitch__currency { color: #888; font-size: 0.9em; }
        `;
            document.head.appendChild(style);
        }

        // Helper to parse numbers
        function parseLocaleNumber(stringNumber) {
            if (!stringNumber) return NaN;
            return parseFloat(stringNumber.replace(/[^0-9.-]+/g, ""));
        }

        function getCurrencySymbol(stringText) {
            return stringText.replace(/[0-9.,\s-]/g, '') || '';
        }

        function formatPrice(price, decimals = 0) {
            return price.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }

        // Fix the container width
        function fixContainerWidth() {
            const card = document.querySelector('.card.card--order-board');
            if (card) {
                card.style.width = 'max-content';
            }
        }

        // Main calculation function
        function calculateSpreads() {
            const rows = document.querySelectorAll('tr.pitch');

            rows.forEach(row => {
                const bidElem = row.querySelector('.pitch__bids .price.best .price__limit');
                const offerElem = row.querySelector('.pitch__offers .price.best .price__limit');
                const targetContainer = row.querySelector('.pitch__security');

                if (!bidElem || !offerElem || !targetContainer) return;

                const bidText = bidElem.innerText;
                const offerText = offerElem.innerText;

                const bid = parseLocaleNumber(bidText);
                const offer = parseLocaleNumber(offerText);

                if (isNaN(bid) || isNaN(offer)) return;

                const currency = getCurrencySymbol(bidText);

                // Prices with fees
                const bidWithFee = bid * (1 - FEE_PERCENTAGE / 100);
                const offerWithFee = offer * (1 + FEE_PERCENTAGE / 100);
                const spreadWithFees = offerWithFee - bidWithFee;
                const midPriceWithFees = (offerWithFee + bidWithFee) / 2;
                const percentageWithFees = (spreadWithFees / midPriceWithFees) * 100;

                const decimals = 0;

                // --- Subscript HTML Generator ---
                const subHTML = `<sub style="font-size: 0.65em; opacity: 0.6; margin-left: 2px; font-weight: 700;">${SUBSCRIPT_TEXT}</sub>`;

                // === ADD FEE LABELS TO BID PRICES ===
                const bidPriceDiv = row.querySelector('.pitch__bids .price.best');
                if (bidPriceDiv) {
                    let bidFeeLabel = bidPriceDiv.querySelector('.bv-fee-label');
                    if (!bidFeeLabel) {
                        bidFeeLabel = document.createElement('div');
                        bidFeeLabel.className = 'bv-fee-label';
                        bidFeeLabel.style.fontWeight = '700';
                        bidFeeLabel.style.borderBottom = '2px solid #000';
                        bidFeeLabel.style.paddingBottom = '3px';
                        bidFeeLabel.style.marginBottom = '3px';
                        bidPriceDiv.prepend(bidFeeLabel);
                    }
                    const bidFeeHTML = `${currency}${formatPrice(bidWithFee, decimals)}${subHTML}`;
                    if (bidFeeLabel.innerHTML !== bidFeeHTML) {
                        bidFeeLabel.innerHTML = bidFeeHTML;
                    }
                }

                // === ADD FEE LABELS TO OFFER PRICES ===
                const offerPriceDiv = row.querySelector('.pitch__offers .price.best');
                if (offerPriceDiv) {
                    let offerFeeLabel = offerPriceDiv.querySelector('.bv-fee-label');
                    if (!offerFeeLabel) {
                        offerFeeLabel = document.createElement('div');
                        offerFeeLabel.className = 'bv-fee-label';
                        offerFeeLabel.style.fontWeight = '700';
                        offerFeeLabel.style.borderBottom = '2px solid #000';
                        offerFeeLabel.style.paddingBottom = '3px';
                        offerFeeLabel.style.marginBottom = '3px';
                        offerPriceDiv.prepend(offerFeeLabel);
                    }
                    const offerFeeHTML = `${currency}${formatPrice(offerWithFee, decimals)}${subHTML}`;
                    if (offerFeeLabel.innerHTML !== offerFeeHTML) {
                        offerFeeLabel.innerHTML = offerFeeHTML;
                    }
                }

                // === ADD SPREAD INFORMATION ===
                let container = row.querySelector('.bv-custom-container');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'bv-custom-container';
                    targetContainer.appendChild(container);
                }

                const spreadSubHTML = `<sub style="font-size: 0.65em; opacity: 0.6; margin-left: 2px; font-weight: 500;">${SUBSCRIPT_TEXT}</sub>`;

                const html = `
                <div style="font-weight: 500; display: flex; align-items: center; margin-top: 4px; color: inherit;">
                    Spread${spreadSubHTML}: <span style="font-weight: 700; margin-left: 4px;">${percentageWithFees.toFixed(2)}%</span>
                    <span class="bv-info-icon" title="${TOOLTIP_TEXT}">i</span>
                </div>
            `;

                if (container.innerHTML !== html) {
                    container.innerHTML = html;
                }
            });
        }

        // --- SAFETY LOGIC ---
        function startScript() {
            const targetNode = document.getElementById(OBSERVE_TARGET_ID);
            if (!targetNode) {
                console.log("BullionVault Spread: Waiting for table...");
                setTimeout(startScript, 1000);
                return;
            }

            addGlobalStyle();
            fixContainerWidth();
            calculateSpreads();

            const observer = new MutationObserver((mutations) => {
                observer.disconnect();
                fixContainerWidth();
                calculateSpreads();
                observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
            });

            observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
            console.log("BullionVault Spread: Script started successfully.");
        }

        startScript();
    }


    // =========================================================================
    // MODULE 2: PROFIT & LOSS (Real-time Liquidation)
    // =========================================================================
    function initProfitLoss() {
        console.log("BV Suite: Initializing P&L Module...");

        const CONFIG = {
            balanceUrl: 'https://www.bullionvault.com/secure/api/v2/view_balance_xml.do?simple=true',
            marketUrl: 'https://www.bullionvault.com/secure/api/v2/view_market_xml.do',
            rateLimits: { viewMarket: 48, viewBalance: 8 },
            refreshInterval: 30000,
            tooltips: {
                realVal: "The 'Liquidation Value'. This is the exact amount you would receive if you sold this position right now at the best market Bid price, minus the 0.5% selling commission.",
                realPL: "Your actual Profit/Loss if you exited the market immediately. Calculated as: (Real Valuation) - (Book Cost).",
                realChange: "The percentage return on your investment after all fees."
            }
        };

        let state = {
            lastUpdate: 0,
            positions: [],
            cashBalance: 0,
            netDeposit: 0,
            isUpdating: false
        };

        // --- VISUAL OVERHAUL ---
        function addGlobalStyle() {
            const style = document.createElement('style');
            style.innerHTML = `
            /* --- 1. FONTS & ALIGNMENT --- */
            .table--bookcost td, .table--bookcost th { vertical-align: middle !important; }

            /* --- 2. METAL IDENTITY STRIPS --- */
            tr.bv-row { border-left: 4px solid transparent; transition: background 0.1s; }
            tr.bv-row:hover { background-color: #f8f9fa !important; }

            tr.bv-row--gold { border-left-color: #FFD700 !important; }
            tr.bv-row--silver { border-left-color: #C0C0C0 !important; }
            tr.bv-row--platinum { border-left-color: #E5E4E2 !important; }
            tr.bv-row--palladium { border-left-color: #CED0DD !important; }

            /* --- 3. INFO ICON STYLING --- */
            .bv-info-icon {
                display: inline-block; width: 12px; height: 12px; line-height: 12px;
                text-align: center; border-radius: 50%; border: 1px solid #999;
                color: #999; font-size: 9px; font-family: serif; font-style: italic;
                margin-left: 5px; cursor: help; opacity: 0.7; transition: all 0.2s;
            }
            .bv-info-icon:hover { border-color: #333; color: #333; opacity: 1; font-weight: bold; transform: scale(1.2); }

            /* --- 4. COLORS --- */
            .bv-text-pos { color: #28a745 !important; font-weight: 700; }
            .bv-text-neg { color: #dc3545 !important; font-weight: 700; }
            .bv-text-info { color: #0066cc !important; font-weight: 700; }
            .bv-text-muted { color: #888; font-size: 0.85em; font-weight: normal; }

            /* --- 5. TOTALS ROW --- */
            #bv-totals-row { border-top: 2px solid #ccc; background-color: #f9f9f9; }
        `;
            document.head.appendChild(style);
        }

        function log(msg) { console.log(`%c[BV] ${msg}`, 'color: #0066cc; font-weight: bold;'); }

        // --- RATE LIMITER ---
        class RateLimiter {
            constructor() { this.requests = { viewMarket: [], viewBalance: [] }; }
            cleanup(type) { const t = Date.now() - 60000; this.requests[type] = this.requests[type].filter(x => x > t); }
            async waitForSlot(type) {
                this.cleanup(type);
                while (this.requests[type].length >= CONFIG.rateLimits[type]) {
                    await new Promise(r => setTimeout(r, 1000));
                    this.cleanup(type);
                }
            }
            recordRequest(type) { this.requests[type].push(Date.now()); }
        }
        const rateLimiter = new RateLimiter();

        // --- DATA FETCHING ---
        const parseXML = (str) => new DOMParser().parseFromString(str, 'text/xml');

        async function fetchBalance() {
            await rateLimiter.waitForSlot('viewBalance');
            rateLimiter.recordRequest('viewBalance');
            const response = await fetch(CONFIG.balanceUrl);
            if (!response.ok) throw new Error('Balance fetch failed');
            const xmlDoc = parseXML(await response.text());

            const positions = [];
            let totalCash = 0;

            xmlDoc.querySelectorAll('clientPosition').forEach(pos => {
                const narrative = pos.getAttribute('classNarrative');
                const available = parseFloat(pos.getAttribute('available'));
                const securityId = pos.getAttribute('securityId');
                if (narrative === 'CURRENCY') totalCash += available;
                else if (available > 0) positions.push({ securityId, available, narrative });
            });
            return { positions, totalCash };
        }

        async function fetchSellValue(securityId, quantity) {
            await rateLimiter.waitForSlot('viewMarket');
            rateLimiter.recordRequest('viewMarket');
            const response = await fetch(`${CONFIG.marketUrl}?considerationCurrency=EUR&securityId=${securityId}&marketWidth=5`);
            const xmlDoc = parseXML(await response.text());

            const buyOrders = xmlDoc.querySelectorAll('buyPrices price');
            let remainingQty = quantity;
            let grossValue = 0;

            for (let order of buyOrders) {
                if (remainingQty <= 0) break;
                const limit = parseFloat(order.getAttribute('limit'));
                const qty = parseFloat(order.getAttribute('quantity'));
                const fill = Math.min(remainingQty, qty);
                grossValue += (fill * limit);
                remainingQty -= fill;
            }
            return { grossValue, fee: grossValue * 0.005, netValue: grossValue * 0.995 };
        }

        // --- FORMATTERS ---
        const parseCurrency = (str) => {
            if (!str) return 0;
            const isNegative = str.includes('(') || str.includes('-');
            const cleanStr = str.replace(/[^0-9.]/g, '');
            const val = parseFloat(cleanStr) || 0;
            return isNegative ? -val : val;
        };

        const formatEUR = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        // --- UI UPDATES ---

        function updateSummaryTable(realAccountValuation) {
            const summaryTableBody = document.querySelector('.table--profit-and-loss-summary tbody');
            if (!summaryTableBody) return;

            const rows = Array.from(summaryTableBody.querySelectorAll('tr'));
            let overallValRow, totalReturnRow;
            let netDeposit = 0;

            rows.forEach(row => {
                const label = row.cells[0].textContent.trim();
                if (label.includes('Overall account valuation')) overallValRow = row;
                else if (label.includes('Total return')) totalReturnRow = row;
                else if (label.includes('Net deposit')) netDeposit = parseCurrency(row.cells[1].textContent);
            });

            const realTotalReturn = realAccountValuation - netDeposit;
            let realReturnPct = 0;
            if (netDeposit !== 0) realReturnPct = (realTotalReturn / netDeposit) * 100;

            // Helper to create summary rows
            const updateOrInsertRow = (id, label, value, isPct = false) => {
                let row = document.getElementById(id);
                if (!row) {
                    row = document.createElement('tr');
                    row.id = id;
                    row.innerHTML = `<td>${label} <span class="bv-info-icon" title="Calculated using real-time market Bid prices minus 0.5% sell fees.">i</span></td><td class="bv-mono"></td><td></td>`;
                    // Insert logic
                    if (id === 'bv-real-val-row' && overallValRow) insertAfter(row, overallValRow);
                    else if (totalReturnRow) insertAfter(row, document.getElementById('bv-real-return-row') || totalReturnRow);
                }

                const cell = row.cells[1];
                cell.textContent = isPct ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` : `${value >= 0 && id !== 'bv-real-val-row' ? '+' : ''}${formatEUR.format(value)}`;

                // Color logic
                if (id !== 'bv-real-val-row') {
                    cell.className = value >= 0 ? 'bv-text-pos bv-mono' : 'bv-text-neg bv-mono';
                } else {
                    cell.className = 'bv-mono';
                    cell.style.fontWeight = 'bold';
                }
            };

            updateOrInsertRow('bv-real-val-row', 'Real overall account valuation', realAccountValuation);
            updateOrInsertRow('bv-real-return-row', 'Real total return', realTotalReturn);
            updateOrInsertRow('bv-real-return-pct-row', 'Real total return %', realReturnPct, true);
        }

        function updateMainTable() {
            const table = document.querySelector('.table--bookcost');
            if (!table) return;

            const theadRow = table.querySelector('thead tr');
            const tbody = table.querySelector('tbody');

            // Add Headers if missing
            if (!theadRow.querySelector('.bv-real-col')) {
                const createTh = (text, tooltip) => {
                    const th = document.createElement('th');
                    th.className = 'bv-real-col';
                    th.innerHTML = `${text} <span class="bv-info-icon" title="${tooltip}">i</span>`;
                    return th;
                };
                theadRow.insertBefore(createTh('Real Valuation', CONFIG.tooltips.realVal), theadRow.lastElementChild); // Insert before Change
                theadRow.insertBefore(createTh('Real P/L', CONFIG.tooltips.realPL), theadRow.lastElementChild);
                theadRow.appendChild(createTh('Real Change', CONFIG.tooltips.realChange));
            }

            let totalRealVal = 0;
            let totalRealPL = 0;
            const rows = Array.from(tbody.querySelectorAll('tr:not(#bv-totals-row)'));

            rows.forEach(row => {
                // Metal Strip Logic
                row.classList.add('bv-row');
                const titleEl = row.querySelector('.bookcost__title');
                if (!titleEl) return;
                const metalName = titleEl.textContent.trim().toUpperCase();

                // Apply Metal Color Strip
                if (metalName.includes('GOLD')) row.classList.add('bv-row--gold');
                else if (metalName.includes('SILVER')) row.classList.add('bv-row--silver');
                else if (metalName.includes('PLATINUM')) row.classList.add('bv-row--platinum');
                else if (metalName.includes('PALLADIUM')) row.classList.add('bv-row--palladium');

                const posData = state.positions.find(p => p.narrative.toUpperCase() === metalName);

                let bookCost = 0;
                const valEl = row.querySelector('.bookcost__value');
                if (valEl) bookCost = parseCurrency(valEl.textContent);

                let realValCell = row.querySelector('.bv-real-val-cell');
                let realPLCell = row.querySelector('.bv-real-pl-cell');
                let realChangeCell = row.querySelector('.bv-real-change-cell');

                if (!realValCell) {
                    // Insert columns in specific order to match headers
                    realValCell = document.createElement('td'); realValCell.className = 'bv-real-val-cell bv-mono';
                    row.insertBefore(realValCell, row.lastElementChild); // Before Change column
                    realPLCell = document.createElement('td'); realPLCell.className = 'bv-real-pl-cell bv-mono';
                    row.insertBefore(realPLCell, row.lastElementChild);
                    realChangeCell = document.createElement('td'); realChangeCell.className = 'bv-real-change-cell bv-mono';
                    row.appendChild(realChangeCell);
                }

                if (posData && posData.netValue) {
                    totalRealVal += posData.netValue;
                    const profitLoss = posData.netValue - bookCost;
                    totalRealPL += profitLoss;

                    realValCell.innerHTML = `<span class="bv-text-info">${formatEUR.format(posData.netValue)}</span><br><span class="bv-text-muted">(fee: ${formatEUR.format(posData.fee)})</span>`;

                    if (bookCost > 0) {
                        const changePct = (profitLoss / bookCost) * 100;
                        const sign = profitLoss >= 0 ? '+' : '';
                        const cssClass = profitLoss >= 0 ? 'bv-text-pos' : 'bv-text-neg';

                        realPLCell.innerHTML = `<span class="${cssClass}">${sign}${formatEUR.format(profitLoss)}</span>`;
                        realChangeCell.innerHTML = `<span class="${cssClass}">${sign}${changePct.toFixed(2)}%</span>`;
                    }
                } else {
                    realValCell.innerHTML = '<span class="bv-text-muted">...</span>';
                    realPLCell.innerHTML = '<span class="bv-text-muted">...</span>';
                    realChangeCell.innerHTML = '<span class="bv-text-muted">...</span>';
                }
            });

            // --- UPDATE TOTALS ROW ---
            let totalsRow = document.getElementById('bv-totals-row');
            // Calculate header index for alignment
            const headerCells = Array.from(theadRow.cells);
            const valColIndex = headerCells.findIndex(cell => cell.textContent.includes('Real Valuation'));
            const totalCols = headerCells.length;

            if (!totalsRow) {
                totalsRow = document.createElement('tr');
                totalsRow.id = 'bv-totals-row';

                const labelCell = document.createElement('td');
                labelCell.textContent = 'Totals';
                labelCell.style.fontWeight = 'bold';
                labelCell.style.textAlign = 'right';
                labelCell.colSpan = valColIndex > 0 ? valColIndex : 1;
                totalsRow.appendChild(labelCell);

                const valCell = document.createElement('td');
                valCell.id = 'bv-total-val';
                valCell.className = 'bv-text-info bv-mono';
                totalsRow.appendChild(valCell);

                const plCell = document.createElement('td');
                plCell.id = 'bv-total-pl';
                plCell.className = 'bv-mono';
                totalsRow.appendChild(plCell);

                const remainingCols = totalCols - (valColIndex + 2);
                if (remainingCols > 0) {
                    const spacer = document.createElement('td');
                    spacer.colSpan = remainingCols;
                    totalsRow.appendChild(spacer);
                }
                tbody.appendChild(totalsRow);
            }

            const valCell = document.getElementById('bv-total-val');
            if (valCell) valCell.textContent = formatEUR.format(totalRealVal);

            const plCell = document.getElementById('bv-total-pl');
            if (plCell) {
                plCell.textContent = `${totalRealPL >= 0 ? '+' : ''}${formatEUR.format(totalRealPL)}`;
                plCell.className = totalRealPL >= 0 ? 'bv-text-pos bv-mono' : 'bv-text-neg bv-mono';
            }
        }

        // --- MAIN ---
        async function refreshData() {
            if (state.isUpdating) return;
            state.isUpdating = true;
            try {
                const balance = await fetchBalance();
                state.cashBalance = balance.totalCash;
                state.positions = balance.positions;
                let totalNetMetalValue = 0;

                if (state.positions.length > 0) {
                    for (let pos of state.positions) {
                        try {
                            const prices = await fetchSellValue(pos.securityId, pos.available);
                            Object.assign(pos, prices);
                            totalNetMetalValue += prices.netValue;
                        } catch (e) { console.error(e); }
                    }
                }

                updateMainTable();
                updateSummaryTable(state.cashBalance + totalNetMetalValue);
            } catch (e) { console.error('BV Update Error:', e); }
            finally { state.isUpdating = false; }
        }

        addGlobalStyle();

        // Init Logic
        new MutationObserver(() => {
            const hasMainTable = document.querySelector('.table--bookcost');
            if (hasMainTable) {
                if (Date.now() - state.lastUpdate > CONFIG.refreshInterval) {
                    state.lastUpdate = Date.now();
                    refreshData();
                } else if (!document.querySelector('.bv-real-col')) {
                    updateMainTable();
                    updateSummaryTable(state.cashBalance); // Try to repaint if cached
                }
            }
        }).observe(document.body, { childList: true, subtree: true });

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshData);
        else refreshData();
        setInterval(refreshData, CONFIG.refreshInterval);
    }

})();