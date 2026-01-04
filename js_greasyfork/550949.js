// ==UserScript==
// @name         Torn Stock Buy/Sell Highlighter (Persistent, Fixed Selector)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add buy/sell thresholds to Torn stocks in their own column, highlight when matched, values persist after refresh
// @author       You
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550949/Torn%20Stock%20BuySell%20Highlighter%20%28Persistent%2C%20Fixed%20Selector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550949/Torn%20Stock%20BuySell%20Highlighter%20%28Persistent%2C%20Fixed%20Selector%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractPrice(priceDiv) {
        const spans = priceDiv.querySelectorAll('span.number___hhGqA');
        return parseFloat(Array.from(spans).map(span => span.textContent).join(''));
    }

    // safer way to get a unique stock key
    function getStockKey(stockEl) {
        // Torn usually sets a data-stock or data-id on the UL
        const dataId = stockEl.dataset?.stock || stockEl.dataset?.id;
        if (dataId) return `stock_${dataId}`;

        // fallback: try first heading inside the UL (name, ticker, etc.)
        const nameEl = stockEl.querySelector('li h4, li strong, li .name');
        if (nameEl) return `stock_${nameEl.textContent.trim()}`;

        // as last resort, unique index in DOM (won't persist well if order changes)
        return `stock_index_${[...stockEl.parentNode.children].indexOf(stockEl)}`;
    }

    function waitForStocksAndInit() {
        const container = document.querySelector('div.stockMarket___iB18v');
        if (!container) return setTimeout(waitForStocksAndInit, 500);

        const stockBlocks = container.querySelectorAll('ul[class*="stock__"]');
        if (!stockBlocks.length) return setTimeout(waitForStocksAndInit, 500);

        addThresholdColumn(stockBlocks);
        setInterval(() => checkThresholds(stockBlocks), 2000);
    }

    function addThresholdColumn(stockBlocks) {
        stockBlocks.forEach(stockEl => {
            if (stockEl.querySelector('.threshold-col')) return;

            const stockKey = getStockKey(stockEl);

            const liElements = stockEl.querySelectorAll('li');
            if (liElements.length < 3) return;

            const newCol = document.createElement('li');
            newCol.className = 'threshold-col';
            newCol.style.display = 'flex';
            newCol.style.flexDirection = 'column';
            newCol.style.alignItems = 'center';
            newCol.style.justifyContent = 'center';
            newCol.style.minWidth = '65px';
            newCol.style.padding = '0 4px';

            const inputStyle = `
            width: 55px;
            font-size: 11px;
            margin-bottom: 2px;
            text-align: center;
        `;

            const buyInput = document.createElement('input');
            buyInput.type = 'number';
            buyInput.placeholder = 'Buy';
            buyInput.className = 'buy-threshold';
            buyInput.style.cssText = inputStyle;

            const sellInput = document.createElement('input');
            sellInput.type = 'number';
            sellInput.placeholder = 'Sell';
            sellInput.className = 'sell-threshold';
            sellInput.style.cssText = inputStyle;

            // Load saved thresholds
            const saved = JSON.parse(localStorage.getItem('stockThresholds') || '{}');
            if (saved[stockKey]) {
                if (saved[stockKey].buy) buyInput.value = saved[stockKey].buy;
                if (saved[stockKey].sell) sellInput.value = saved[stockKey].sell;
            }

            function saveThresholds() {
                const data = JSON.parse(localStorage.getItem('stockThresholds') || '{}');
                data[stockKey] = {
                    buy: buyInput.value || null,
                    sell: sellInput.value || null
                };
                localStorage.setItem('stockThresholds', JSON.stringify(data));
            }

            buyInput.addEventListener('input', saveThresholds);
            sellInput.addEventListener('input', saveThresholds);

            // --- Clear Button ---
            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear';
            clearBtn.style.fontSize = '10px';
            clearBtn.style.padding = '2px 4px';
            clearBtn.style.marginTop = '2px';
            clearBtn.style.cursor = 'pointer';
            clearBtn.addEventListener('click', () => {
                buyInput.value = '';
                sellInput.value = '';
                const data = JSON.parse(localStorage.getItem('stockThresholds') || '{}');
                delete data[stockKey];
                localStorage.setItem('stockThresholds', JSON.stringify(data));
                stockEl.style.backgroundColor = ''; // remove highlight
            });

            newCol.appendChild(buyInput);
            newCol.appendChild(sellInput);
            newCol.appendChild(clearBtn);

            liElements[2].insertAdjacentElement('afterend', newCol);
        });
    }


    function checkThresholds(stockBlocks) {
        stockBlocks.forEach(stockEl => {
            const priceDiv = stockEl.querySelector('div.price___CTjJE');
            if (!priceDiv) return;

            const price = extractPrice(priceDiv);
            const buyVal = parseFloat(stockEl.querySelector('.buy-threshold')?.value);
            const sellVal = parseFloat(stockEl.querySelector('.sell-threshold')?.value);

            stockEl.style.backgroundColor = ''; // reset

            if (!isNaN(buyVal) && price <= buyVal) {
                stockEl.style.backgroundColor = 'rgba(0,255,0,0.15)';
            }
            if (!isNaN(sellVal) && price >= sellVal) {
                stockEl.style.backgroundColor = 'rgba(255,0,0,0.15)';
            }
        });
    }

    waitForStocksAndInit();
})();
