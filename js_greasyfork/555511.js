// ==UserScript==
// @name         活動/利潤計算器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  活動成本效益分析工具，透過基礎成本與折扣方案，快速計算、比較並預測促銷活動在不同銷售階段下的潛在總利潤。
// @author       Moz(qixiuyan@)
// @match        https://sellercentral.amazon.com/inventory*
// @match        https://www.sellercentral.amazon.dev/myinventory/inventory*
// @match        https://sellercentral.amazon.com/myinventory/inventory*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     customFont https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap
// ==/UserScript==

(function() {
    'use strict';

    // --- Internationalization (i18n) ---
    const i18n = {
        'zh': {
            available: ['有貨 (FBA)', '有貨'],
            inbound: ['入庫數量'],
            reserved: ['預留數量']
        },
        'en': {
            available: ['Available (FBA)', 'Available'],
            inbound: ['Inbound'],
            reserved: ['Reserved']
        }
    };

    const pageLang = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
    const LABELS = i18n[pageLang];

    // --- Inject Custom Font ---
    const fontCss = GM_getResourceText("customFont");
    GM_addStyle(fontCss);

    // --- Global State ---
    let scrapedProducts = []; // Array to store scraped data for each product

    // --- Helper Functions ---
    function parsePercent(str) {
        if (typeof str !== 'string' || !str.endsWith('%')) return null;
        const numStr = str.slice(0, -1);
        const num = parseInt(numStr, 10);
        if (isNaN(num) || num < 5 || num > 80 || num.toString() !== numStr) return null;
        return num / 100;
    }

    function parseCurrency(str) {
        if (typeof str !== 'string') return null;
        const num = parseFloat(str.replace(/[^0-9.-]+/g, ""));
        return isNaN(num) ? null : num;
    }

     function safeParseFloat(val) {
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
    }

    function safeParseInt(str) {
        const num = parseInt(str, 10);
        return isNaN(num) ? 0 : num;
    }

    function formatCurrency(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'N/A';
        const isNegative = num < 0;
        const formattedNum = isNegative ? `-$${Math.abs(num).toFixed(2)}` : `$${num.toFixed(2)}`;
        return `<span class="${isNegative ? 'negative-value' : ''}">${formattedNum}</span>`;
    }

    function formatForecastCurrency(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'N/A';
        const isNegative = num < 0;
        const roundedNum = Math.round(Math.abs(num));
        const formattedStr = roundedNum.toLocaleString('en-US');
        const formattedNum = isNegative ? `-$${formattedStr}` : `$${formattedStr}`;
        return `<span class="${isNegative ? 'negative-value' : ''}">${formattedNum}</span>`;
    }

    // --- UI Panel ---
    const panel = document.createElement('div');
    panel.id = 'gemini-amazon-calculator';
    document.body.appendChild(panel);

    // --- Use GM_addStyle for all CSS ---
    GM_addStyle(`
        :root {
            --primary-color: #84994F; --secondary-color: #FCB53B; --light-yellow-bg: #FFFBEF;
            --negative-color: #A72703; --border-color: #EAE8E1; --text-color: #3D453C;
            --label-color: #606C5D; --panel-bg: #FFFFFF; --header-text: #FFFFFF;
            --font-family: 'Noto Sans TC', 'Huninn', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            --error-color: #D32F2F; --error-bg: #FFEBEE;
        }
        #gemini-amazon-calculator {
            position: fixed; top: 40px; left: 50%; width: 1300px; transform: translateX(-50%); background-color: var(--panel-bg);
            border: 1px solid var(--border-color); border-radius: 10px; z-index: 10001;
            box-shadow: 0 6px 18px rgba(0,0,0,0.1); font-family: var(--font-family);
            display: flex; flex-direction: column; max-height: 95vh; overflow: hidden;
        }
        #scrapePanelContainer { display: flex; flex-direction: column; gap: 16px; color: var(--text-color); flex: 1; min-height: 0; }
        #scrapePanelContainer h3 {
            position: relative; margin: 0; padding: 14px 40px 14px 20px; background-color: var(--primary-color);
            color: var(--header-text); font-size: 18px; font-weight: 700; border-top-left-radius: 10px;
            border-top-right-radius: 10px; letter-spacing: 1px; cursor: move;
        }
        #gemini-close-btn {
            position: absolute; top: 50%; right: 15px; transform: translateY(-50%); font-size: 26px;
            font-weight: normal; color: var(--header-text); cursor: pointer; line-height: 1;
            transition: opacity 0.2s; padding: 0 5px;
        }
        #gemini-close-btn:hover { opacity: 0.7; }
        .panel-section { padding: 0 20px; }
        #initialInputs { padding-bottom: 20px; }
        #asinInput {
            padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; width: 100%;
            box-sizing: border-box; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            height: 80px;
        }
        #asinInput:focus {
            outline: none; border-color: var(--secondary-color);
            box-shadow: 0 0 0 3px rgba(252, 181, 59, 0.25);
        }
        .action-button {
            margin: 0 20px 20px; padding: 12px 15px; font-size: 16px; font-weight: 700; color: var(--header-text);
            background-color: var(--primary-color); border: none; border-radius: 6px; cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
        }
        .action-button:hover { background-color: #718544; }
        .action-button:active { transform: scale(0.98); }
        #resultsContainer { overflow-y: auto; padding-bottom: 10px; flex: 1; min-height: 0; }
        #baseTableContainer, #calcControlsContainer, #resultArea { padding: 0 20px 10px; }
        #tables-container { display: flex; justify-content: space-between; gap: 20px; }
        .table-container { flex: 1; }
        .table-title { font-weight: 700; margin-top: 10px; margin-bottom: 10px; font-size: 16px; padding-left: 5px; }
        .result-table { table-layout: fixed; width: 100%; border-collapse: collapse; font-size: 13px; }
        .result-table th, .result-table td {
            padding: 10px; text-align: right; border-bottom: 1px solid var(--border-color); white-space: nowrap;
        }
        .result-table th:first-child, .result-table td:first-child { text-align: left; font-weight: 500; }
        .result-table td:first-child { font-weight: 700; }
        .result-table th { background-color: #F8F7F4; font-weight: 700; }
        .result-table tbody tr:hover { background-color: var(--light-yellow-bg); }
        .negative-value { color: var(--negative-color); font-weight: 500; }
        #notFoundAreaWrapper { padding: 0 20px 10px; }
        #notFoundArea, .no-forecast { padding: 10px 15px; margin-top: 10px; border-radius: 5px; font-size: 13px; background-color: #FFF9C4; color: #795548; border: 1px solid #FBC02D; }
        .editable-input { width: 90%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align: right; box-sizing: border-box; }
        .editable-input.input-error { border-color: var(--error-color); background-color: var(--error-bg); }
        .control-group { display: flex; align-items: center; gap: 8px;}
         #combinedControls {
            display: flex; justify-content: space-around; gap: 10px; align-items: center;
            padding: 15px; background-color: #F8F7F4; border-radius: 8px; border: 1px solid var(--border-color); flex-wrap: wrap;
        }
        #combinedControls label { font-weight: 700; font-size: 14px; }
        #combinedControls input {
            padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; width: 120px;
        }
        #combinedControls button {
            padding: 8px 15px; font-size: 14px; font-weight: 500; color: #fff; background-color: var(--secondary-color);
            border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;
        }
        #combinedControls button:hover { background-color: #E6A335; }
        #combinedControls #calculateBtn { background-color: var(--negative-color); }
        #combinedControls #calculateBtn:hover { background-color: #C62828;}
        .delete-row-btn {
             background-color: var(--negative-color); color: white; border: none; padding: 5px 9px;
             font-size: 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s;
        }
        .delete-row-btn:hover { background-color: #C62828; }
        .title-explanation, .forecast-explanation { font-size: 12px; color: #606C5D; font-weight: 400; }
        .forecast-explanation { padding-top: 8px; }
        #forecastArea .result-table td:first-child { font-weight: 400;}
    `);

    panel.innerHTML = `
        <div id="scrapePanelContainer">
            <h3>活動成本/收益計算器<span id="gemini-close-btn" title="關閉">&times;</span></h3>
            <div id="initialInputs" class="panel-section">
                 <textarea id="asinInput" placeholder="請輸入ASIN，多個請用逗號或換行分隔"></textarea>
            </div>
            <button id="fetchBtn" class="action-button">抓取庫存資訊</button>
            <div id="resultsContainer">
                <div id="baseTableContainer"></div>
                <div id="calcControlsContainer"></div>
                <div id="resultArea"></div>
                <div id="notFoundAreaWrapper"></div>
            </div>
        </div>
    `;

    // --- Element References ---
    const fetchBtn = document.getElementById('fetchBtn');
    const asinInput = document.getElementById('asinInput');
    const baseTableContainer = document.getElementById('baseTableContainer');
    const calcControlsContainer = document.getElementById('calcControlsContainer');
    const resultArea = document.getElementById('resultArea');
    const notFoundAreaWrapper = document.getElementById('notFoundAreaWrapper');
    const closeBtn = document.getElementById('gemini-close-btn');

    // --- Drag Panel Logic ---
    let isDragging = false;
    let offsetX, offsetY;
    const header = panel.querySelector("h3");
    header.addEventListener('mousedown', (e) => {
        if (e.target.id === 'gemini-close-btn') return;
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = 'move';
    });

    // --- Event Listeners ---
    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
    });

    fetchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const asinsToFind = asinInput.value.split(/[\n,]+/).map(asin => asin.trim().toUpperCase()).filter(Boolean);
        if (asinsToFind.length === 0) {
            alert('請輸入有效的ASIN！');
            return;
        }

        baseTableContainer.innerHTML = '<p style="text-align: center; padding: 20px;">正在滾動頁面以加載所有商品...</p>';
        calcControlsContainer.innerHTML = '';
        resultArea.innerHTML = '';
        notFoundAreaWrapper.innerHTML = '';
        scrapedProducts = [];

        const scrollInterval = setInterval(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                clearInterval(scrollInterval);
                scrapeAndBuildBaseTable(asinsToFind);
            } else {
                window.scrollTo(0, document.body.scrollHeight);
            }
        }, 150);
    });

    function scrapeAndBuildBaseTable(asins) {
        let notFoundAsins = [...asins];
        let baseTableBodyHtml = '';

        const rows = document.querySelectorAll('div.JanusTable-module__tableContentRow--MGDsi');

        if (rows.length === 0) {
            notFoundAreaWrapper.innerHTML = "<div id='notFoundArea'>錯誤：在此頁面找不到任何商品列。請確認您在「管理庫存」頁面，且頁面已加載完畢。</div>";
            baseTableContainer.innerHTML = '';
            return;
        }

        rows.forEach(row => {
            let currentAsin = '', currentSku = '';
            const detailPanels = row.querySelectorAll('.JanusSplitBox-module__row--yjQ5L');

            detailPanels.forEach(panel => {
                const keyElement = panel.querySelector('.JanusSplitBox-module__panel--AbYDg:first-child');
                if (keyElement) {
                    const key = keyElement.textContent.trim();
                    const valueElement = keyElement.nextElementSibling;
                    if (valueElement) {
                        const value = valueElement.textContent.trim();
                        if (key === 'ASIN') currentAsin = value.toUpperCase();
                        else if (key === 'SKU') currentSku = value;
                    }
                }
            });

            if (!currentAsin || !asins.includes(currentAsin) || !currentSku) return;

            const uniqueId = `${currentAsin}_${currentSku}`;
            if (scrapedProducts.some(p => p.uniqueId === uniqueId)) return;

            const index = notFoundAsins.indexOf(currentAsin);
            if (index > -1) notFoundAsins.splice(index, 1);

            let available = '0', inbound = '0', reserved = '0';
            const inventoryRows = row.querySelectorAll('.JanusSplitBox-module__row--yjQ5L');
            inventoryRows.forEach(invRow => {
                const text = invRow.textContent;
                const valueEl = invRow.querySelector('.JanusSplitBox-module__panel--AbYDg:last-child');
                if (!valueEl) return;
                const value = valueEl.textContent.trim();

                if (LABELS.available.some(label => text.includes(label))) {
                    available = value;
                } else if (LABELS.inbound.some(label => text.includes(label))) {
                    inbound = value;
                } else if (LABELS.reserved.some(label => text.includes(label))) {
                    reserved = value;
                }
            });

            const priceInputEl = row.querySelector('.VolusPriceInputComposite-module__container--PTx1A kat-input[value]');
            const priceStr = priceInputEl ? priceInputEl.getAttribute('value') : 'N/A';
            const fbaFeeEl = row.querySelector('.estimated-fees-cell .JanusSplitBox-module__row--yjQ5L:nth-child(2) .JanusSplitBox-module__panel--AbYDg:nth-child(2) span');
            const fbaFeeStr = fbaFeeEl ? fbaFeeEl.textContent : 'N/A';

            const priceNum = parseCurrency(priceStr);
            const fbaFeeNum = parseCurrency(fbaFeeStr);
            const maxInventory = safeParseInt(available) + safeParseInt(inbound) + safeParseInt(reserved);

            const productData = {
                uniqueId: uniqueId, asin: currentAsin, sku: currentSku, maxInventory: maxInventory,
                available: available, inbound: inbound, reserved: reserved, price: priceNum, fbaFee: fbaFeeNum
            };
            scrapedProducts.push(productData);

            baseTableBodyHtml += `
                <tr data-row-id="${uniqueId}">
                    <td>${currentAsin}<br><span style="color: #666; font-size: 12px;">(${currentSku})</span></td>
                    <td>${maxInventory} (${available}/${inbound}/${reserved})</td>
                    <td>${formatCurrency(priceNum)}</td>
                    <td><input type="number" class="editable-input cost-input" data-id="${uniqueId}" step="0.01" placeholder="> 0 且 ≤ 價格"></td>
                    <td><input type="text" class="editable-input discount-input" data-id="${uniqueId}" placeholder="5-80 的整數%"></td>
                    <td style="text-align: center;"><button class="delete-row-btn" data-id="${uniqueId}">刪除</button></td>
                </tr>`;
        });

        if (scrapedProducts.length > 0) {
            const baseTableHtml = `
                <div class="table-container">
                    <table class="result-table">
                        <thead><tr>
                            <th style="width: 15%;">ASIN (SKU)</th>
                            <th style="width: 20%;">最大庫存 (有貨/入庫/預留)</th>
                            <th style="width: 15%;">客單價</th>
                            <th style="width: 20%;">基礎成本 ($)</th>
                            <th style="width: 20%;">折扣力度 (%)</th>
                            <th style="width: 10%;">操作</th>
                        </tr></thead>
                        <tbody id="baseInfoBody">${baseTableBodyHtml}</tbody>
                    </table>
                </div>`;
            baseTableContainer.innerHTML = baseTableHtml;
            renderCalculationUI();
        } else {
             baseTableContainer.innerHTML = '';
        }

        if (notFoundAsins.length > 0) {
            notFoundAreaWrapper.innerHTML = `<div id="notFoundArea">找不到以下 ASIN: ${[...new Set(notFoundAsins)].join(', ')}</div>`;
        }
    }

    function renderCalculationUI() {
        const controlsHtml = `
        <div id="combinedControls">
            <div class="control-group">
                <label for="bulkCost">成本($):</label>
                <input type="text" id="bulkCost" placeholder="數字或 %">
                <button id="applyBulkCost">應用</button>
            </div>

            <div class="control-group">
                <label for="bulkDiscount">折扣(%):</label>
                <input type="text" id="bulkDiscount" placeholder="5-80 的數字">
                <button id="applyBulkDiscount">應用</button>
            </div>

            <div class="control-group">
                <label for="promoFee">活動費用($):</label>
                <input type="text" id="promoFee" value="$ 0">
            </div>

            <button id="calculateBtn">計算最終利潤</button>
        </div>
         <div class="title-explanation" style="padding: 0px 15px 5px;">
            * PED (Prime Exclusive Discount) 活動提醒：折扣至少為 20%，活動費用為 $245。
        </div>
            `;
        calcControlsContainer.innerHTML = controlsHtml;

        document.getElementById('applyBulkCost').addEventListener('click', () => {
            const bulkCostStr = document.getElementById('bulkCost').value.trim();
            if (!bulkCostStr) return;

            if (bulkCostStr.includes('%')) {
                const rate = parsePercent(bulkCostStr);
                if (rate === null || rate < 0) {
                    alert('百分比格式錯誤或數值無效！請輸入5%-80%之間的值。');
                    return;
                }
                scrapedProducts.forEach(product => {
                    const costInput = document.querySelector(`.cost-input[data-id="${product.uniqueId}"]`);
                    if (product.price !== null && costInput) {
                        const calculatedCost = (product.price * rate).toFixed(2);
                        costInput.value = calculatedCost;
                    }
                });
            } else {
                const bulkCostNum = safeParseFloat(bulkCostStr);
                if (bulkCostNum === null || bulkCostNum <= 0) {
                    alert('成本必須是個大於 0 的數字！');
                    return;
                }
                document.querySelectorAll('.cost-input').forEach(input => input.value = bulkCostNum);
            }
        });

        document.getElementById('applyBulkDiscount').addEventListener('click', () => {
            let bulkDiscount = document.getElementById('bulkDiscount').value.trim();
            if (!bulkDiscount) return;

            if (!isNaN(bulkDiscount) && !bulkDiscount.endsWith('%')) {
                bulkDiscount += '%';
            }
            document.querySelectorAll('.discount-input').forEach(input => input.value = bulkDiscount);
        });

        document.getElementById('calculateBtn').addEventListener('click', performFinalCalculations);

        baseTableContainer.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-row-btn')) {
                const uniqueIdToDelete = e.target.getAttribute('data-id');
                scrapedProducts = scrapedProducts.filter(p => p.uniqueId !== uniqueIdToDelete);
                const rowToDelete = document.querySelector(`tr[data-row-id="${uniqueIdToDelete}"]`);
                if (rowToDelete) rowToDelete.remove();
            }
        });
    }

    function performFinalCalculations() {
        const promoFee = parseCurrency(document.getElementById('promoFee').value);
        if (promoFee === null) {
            alert('活動費用格式錯誤！請輸入有效的數字 (例如: $ 245 或 245)。');
            return;
        }

        let allInputsValid = true;
        document.querySelectorAll('.editable-input').forEach(input => input.classList.remove('input-error'));

        scrapedProducts.forEach(product => {
            const costInput = document.querySelector(`.cost-input[data-id="${product.uniqueId}"]`);
            const discountInput = document.querySelector(`.discount-input[data-id="${product.uniqueId}"]`);

            const costValue = safeParseFloat(costInput.value);
            const discountRate = parsePercent(discountInput.value);

            if (discountRate === null) {
                discountInput.classList.add('input-error');
                allInputsValid = false;
            }
            if (costValue === null || costValue <= 0 || (product.price !== null && costValue > product.price)) {
                costInput.classList.add('input-error');
                allInputsValid = false;
            }

            product.baseCost = costValue;
            product.discountRate = discountRate;
        });

        if (!allInputsValid) {
            alert('輸入驗證失敗！\n\n- 折扣力度必須是 5% 到 80% 之間的整數百分比 (例如: 20%)。\n- 基礎成本必須是大於 0 且不大於客單價的數字。\n\n請修正標紅的欄位後再試一次。');
            return;
        }

        let potentialSalesProfitTotal = 0;
        let potentialDiscountedProfitTotal = 0;
        let currentProfitBodyHtml = '';
        let discountProfitBodyHtml = '';

        scrapedProducts.forEach(p => {
            let referralFeeNum = null, salesProfitNum = null, discountedPriceNum = null,
                discountedReferralFeeNum = null, discountedProfitNum = null;

            if (p.price !== null) {
                referralFeeNum = p.price * 0.15;
                discountedPriceNum = p.price * (1 - p.discountRate);
                discountedReferralFeeNum = discountedPriceNum * 0.15;

                if (p.fbaFee !== null) {
                    salesProfitNum = p.price - p.baseCost - p.fbaFee - referralFeeNum;
                    discountedProfitNum = discountedPriceNum - p.baseCost - p.fbaFee - discountedReferralFeeNum;
                    if (p.maxInventory > 0) {
                       potentialSalesProfitTotal += salesProfitNum * p.maxInventory;
                       potentialDiscountedProfitTotal += discountedProfitNum * p.maxInventory;
                    }
                }
            }
            const identifierHtml = `${p.asin}<br><span style="color: #666; font-size: 12px;">(${p.sku})</span>`;
            currentProfitBodyHtml += `<tr><td>${identifierHtml}</td><td>${formatCurrency(p.price)}</td><td>${formatCurrency(referralFeeNum)}</td><td>${formatCurrency(p.fbaFee)}</td><td>${formatCurrency(salesProfitNum)}</td></tr>`;
            discountProfitBodyHtml += `<tr><td>${identifierHtml}</td><td>${formatCurrency(discountedPriceNum)}</td><td>${formatCurrency(discountedReferralFeeNum)}</td><td>${formatCurrency(p.fbaFee)}</td><td>${formatCurrency(discountedProfitNum)}</td></tr>`;
        });

        resultArea.innerHTML = `
            <div id="tables-container">
                <div class="table-container">
                    <div class="table-title">當前利潤表 <span class="title-explanation">(價格 - 成本 - 佣金 - FBA費用)</span></div>
                    <table class="result-table">
                        <thead><tr><th>ASIN (SKU)</th><th>價格</th><th>佣金</th><th>FBA配送費</th><th>利潤</th></tr></thead>
                        <tbody>${currentProfitBodyHtml}</tbody>
                    </table>
                </div>
                <div class="table-container">
                    <div class="table-title">折扣利潤表 <span class="title-explanation">(折扣價 - 成本 - 佣金 - FBA費用)</span></div>
                    <table class="result-table">
                         <thead><tr><th>ASIN (SKU)</th><th>折扣價</th><th>佣金</th><th>FBA配送費</th><th>利潤</th></tr></thead>
                        <tbody>${discountProfitBodyHtml}</tbody>
                    </table>
                </div>
            </div>
            <div id="forecastArea" style="padding-top: 20px;"></div>`;
        const forecastArea = document.getElementById('forecastArea');
        const hasInventoryForForecast = potentialSalesProfitTotal !== 0 || potentialDiscountedProfitTotal !== 0;

        if (scrapedProducts.length > 0 && hasInventoryForForecast) {
        let retentionRateRowHtml = '';
        if (potentialSalesProfitTotal > 0) {
            const cells = [...Array(10)].map((_, i) => {
                const percentage = (i + 1) / 10;
                const originalProfitForTier = potentialSalesProfitTotal * percentage;
                const discountedProfitForTier = (potentialDiscountedProfitTotal * percentage) - promoFee;

                if (originalProfitForTier <= 0) return '<td>N/A</td>';

                const rate = (discountedProfitForTier / originalProfitForTier) * 100;
                const formattedRate = rate.toFixed(1) + '%';
                let rateColor = 'inherit';
                if (rate < 50) {
                    rateColor = 'var(--negative-color)';
                } else if (rate >= 50 && rate < 60) {
                    rateColor = 'var(--secondary-color)';
                } else if (rate >= 80) {
                    rateColor = 'var(--primary-color)';
                }

                return `<td><span style=" color: ${rateColor};">${formattedRate}</span></td>`;
            }).join('');

            retentionRateRowHtml = `
                <tr>
                    <td style="font-weight: 400;">利潤保留率</td>
                    ${cells}
                </tr>`;
        }
            let forecastHTML = `
                <div class="table-container">
                    <div class="table-title">銷售預估/利潤預測 (基於最大庫存)</div>
                    <table class="result-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th><b>銷售進度</b></th>
                                ${[...Array(10)].map((_, i) => `<th>${(i + 1) * 10}%</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>折扣前預估</td>
                                ${[...Array(10)].map((_, i) => `<td>${formatForecastCurrency(potentialSalesProfitTotal * ((i + 1) / 10))}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>折扣後預估</td>
                                ${[...Array(10)].map((_, i) => `<td>${formatForecastCurrency((potentialDiscountedProfitTotal * ((i + 1) / 10)) - promoFee)}</td>`).join('')}
                            </tr>
                             ${retentionRateRowHtml}
                        </tbody>
                    </table>
                    <div class="forecast-explanation">* 折扣前預估 = SUM((單件利潤) x 預計銷售%)；      折扣後預估 = SUM((折扣後單件利潤) x 預計銷售%) - 活動費。</div>
                </div>`;
            forecastArea.innerHTML = forecastHTML;
        } else if (scrapedProducts.length > 0) {
            forecastArea.innerHTML = `<div class="no-forecast"><div class="table-title" style="margin-top:0;">無法生成銷售預測</div><p style="font-size:12px; margin:0;">原因：所有已選 ASIN 的最大庫存總和為 0。</p></div>`;
        } else {
             forecastArea.innerHTML = '';
        }
    }
})();