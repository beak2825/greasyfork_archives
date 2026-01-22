// ==UserScript==
// @name         Torn Stock Investment Advisor
// @namespace    http://tampermonkey.net/
// @version      2.05
// @description  Calculates optimal next stock investment based on ROI
// @author       Oatshead [3487562]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563524/Torn%20Stock%20Investment%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/563524/Torn%20Stock%20Investment%20Advisor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        resolve({
                            ok: response.status >= 200 && response.status < 300,
                            status: response.status,
                            json: async () => JSON.parse(response.responseText)
                        });
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // WORKER_URL removed as it is no longer needed.

    // Hardcoded Investment Table to replace the server-side paywalled data.
    // This list represents a standard high-ROI order.
    const DEFAULT_INVESTMENT_TABLE = [
        { acronym: 'SYM', increment: 1, shares_to_buy: 1000000 },
        { acronym: 'FHG', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'TSB', increment: 1, shares_to_buy: 1000000 },
        { acronym: 'HRG', increment: 1, shares_to_buy: 1000000 },
        { acronym: 'TCT', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'LSC', increment: 1, shares_to_buy: 2500000 },
        { acronym: 'PRN', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'MUN', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'CNC', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'MSG', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'TMI', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'TCP', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'IIL', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'WSU', increment: 1, shares_to_buy: 1000000 },
        { acronym: 'IST', increment: 1, shares_to_buy: 1000000 },
        { acronym: 'BAG', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'EVL', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'MCS', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'WLT', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'TCC', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'SYS', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'LAG', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'IOU', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'GRN', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'THS', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'YAZ', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'TGP', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'ASS', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'CBD', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'LOS', increment: 1, shares_to_buy: 2000000 },
        { acronym: 'PTS', increment: 1, shares_to_buy: 2000000 }
    ];

    let INVESTMENT_TABLE = JSON.parse(JSON.stringify(DEFAULT_INVESTMENT_TABLE));

    const STOCK_MAP = {
        1: 'TSB', 2: 'TCI', 3: 'SYS', 4: 'LAG', 5: 'IOU',
        6: 'GRN', 7: 'THS', 8: 'YAZ', 9: 'TCT', 10: 'CNC',
        11: 'MSG', 12: 'TMI', 13: 'TCP', 14: 'IIL', 15: 'FHG',
        16: 'SYM', 17: 'LSC', 18: 'PRN', 19: 'EWM', 20: 'TCM',
        21: 'ELT', 22: 'HRG', 23: 'TGP', 24: 'MUN', 25: 'WSU',
        26: 'IST', 27: 'BAG', 28: 'EVL', 29: 'MCS', 30: 'WLT',
        31: 'TCC', 32: 'ASS', 33: 'CBD', 34: 'LOS', 35: 'PTS'
    };

    const STOCK_IMAGES = {
        'TSB': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TSB.svg',
        'TCI': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TCI.svg',
        'SYS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/SYS.svg',
        'LAG': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/LAG.svg',
        'IOU': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/IOU.svg',
        'GRN': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/GRN.svg',
        'THS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/THS.svg',
        'YAZ': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/YAZ.svg',
        'TCT': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TCT.svg',
        'CNC': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/CNC.svg',
        'MSG': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/MSG.svg',
        'TMI': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TMI.svg',
        'TCP': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TCP.svg',
        'IIL': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/IIL.svg',
        'FHG': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/FHG.svg',
        'SYM': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/SYM.svg',
        'LSC': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/LSC.svg',
        'PRN': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/PRN.svg',
        'EWM': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/EWM.svg',
        'TCM': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TCM.svg',
        'ELT': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/ELT.svg',
        'HRG': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/HRG.svg',
        'TGP': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TGP.svg',
        'MUN': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/MUN.svg',
        'WSU': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/WSU.svg',
        'IST': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/IST.svg',
        'BAG': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/BAG.svg',
        'EVL': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/EVL.svg',
        'MCS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/MCS.svg',
        'WLT': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/WLT.svg',
        'TCC': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/TCC.svg',
        'ASS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/ASS.svg',
        'CBD': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/CBD.svg',
        'LOS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/LOS.svg',
        'PTS': 'https://www.torn.com/images/v2/stock-market/dark-mode/logos/PTS.svg'
    };

    const STORAGE_KEY = 'torn_stock_advisor_api_key';
    const SETTINGS_KEY = 'torn_stock_advisor_settings';
    const INVESTMENTS_KEY = 'torn_stock_advisor_investments';
    const EXTRA_STOCKS_KEY = 'torn_stock_advisor_extra_stocks';
    const COMPANY_ESCROW_KEY = 'torn_stock_advisor_company_escrow';
    const INVESTMENT_TABLE_SESSION_KEY = 'torn_stock_advisor_investment_table_session';
    let apiKey = localStorage.getItem(STORAGE_KEY) || '';

    let settings = {
        pending: true, wallet: true, bank: true, cayman: true, vault: true, piggybank: true,
        items: true, displaycase: true, bazaar: true, trade: true, itemmarket: true,
        properties: true, auctionhouse: true, bookie: true, enlistedcars: true, loan: true,
        unpaidfees: true, points: true, factionMoney: true, company: true, companyEscrow: true, extraStockShares: true
    };

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) settings = { ...settings, ...JSON.parse(savedSettings) };

    let investmentPreferences = {};
    const savedInvestments = localStorage.getItem(INVESTMENTS_KEY);
    if (savedInvestments) {
        const saved = JSON.parse(savedInvestments);
        if (Object.keys(saved).some(key => !isNaN(key))) {
            console.log('Old investment preferences detected, please reconfigure in settings');
            investmentPreferences = {};
        } else {
            investmentPreferences = saved;
        }
    }

    function getInvestmentKey(acronym, increment) {
        return `${acronym}-${increment}`;
    }

    let extraStockPreferences = {};
    const savedExtraStocks = localStorage.getItem(EXTRA_STOCKS_KEY);
    if (savedExtraStocks) extraStockPreferences = JSON.parse(savedExtraStocks);

    let companyEscrowPreferences = { weeklyAdBudget: true, weeklyWageBudget: true };
    const savedCompanyEscrow = localStorage.getItem(COMPANY_ESCROW_KEY);
    if (savedCompanyEscrow) companyEscrowPreferences = JSON.parse(savedCompanyEscrow);

    async function checkAuthorization(apiKeyToCheck) {
        try {
            // Only check the Torn API to verify the key works.
            // Bypassed the "ShadowCrest" worker check.
            const userResponse = await fetch(`https://api.torn.com/v2/user?selections=&key=${apiKeyToCheck}`);
            const userData = await userResponse.json();

            console.log('User data:', userData);

            if (userData.error) return { authorized: false, error: 'Invalid API key' };

            // We use the local table now, but we still need to enrich it with live prices
            if (INVESTMENT_TABLE) {
                const enrichedTable = await enrichInvestmentTableWithPrices(INVESTMENT_TABLE, apiKeyToCheck);
                sessionStorage.setItem(INVESTMENT_TABLE_SESSION_KEY, JSON.stringify(enrichedTable));
                INVESTMENT_TABLE = enrichedTable;
            }

            return { authorized: true };
        } catch (error) {
            console.error('Authorization error:', error);
            return { authorized: false, error: 'API check failed' };
        }
    }

    function formatMoney(amount) { return '$' + amount.toLocaleString('en-US'); }
    function saveApiKey(key) { localStorage.setItem(STORAGE_KEY, key); apiKey = key; }
    function clearApiKey() { localStorage.removeItem(STORAGE_KEY); apiKey = ''; }
    function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
    function saveInvestmentPreferences() { localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(investmentPreferences)); }
    function saveExtraStockPreferences() { localStorage.setItem(EXTRA_STOCKS_KEY, JSON.stringify(extraStockPreferences)); }
    function saveCompanyEscrowPreferences() { localStorage.setItem(COMPANY_ESCROW_KEY, JSON.stringify(companyEscrowPreferences)); }

    function createButton() {
        const isPDA = /android|iphone|ipad|mobile/i.test(navigator.userAgent.toLowerCase()) || window.innerWidth <= 768;
        const container = document.createElement('div');
        container.style.cssText = `position: fixed; top: ${isPDA ? '35px' : '50px'}; right: ${isPDA ? '10px' : '20px'}; z-index: 99999; display: flex; gap: ${isPDA ? '5px' : '10px'}; align-items: center;`;

        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '📊';
        toggleBtn.style.cssText = `padding: ${isPDA ? '8px 10px' : '10px 15px'}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: ${isPDA ? '14px' : '16px'}; transition: all 0.3s ease;`;
        toggleBtn.onmouseover = () => { toggleBtn.style.transform = 'translateY(-2px)'; toggleBtn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.4)'; };
        toggleBtn.onmouseout = () => { toggleBtn.style.transform = 'translateY(0)'; toggleBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; };

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `display: none; gap: ${isPDA ? '5px' : '10px'};`;

        const button = document.createElement('button');
        button.innerHTML = '📊 Stock Advisor';
        button.style.cssText = `padding: ${isPDA ? '8px 12px' : '10px 20px'}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: ${isPDA ? '12px' : '14px'}; transition: all 0.3s ease;`;
        button.onmouseover = () => { button.style.transform = 'translateY(-2px)'; button.style.boxShadow = '0 6px 8px rgba(0,0,0,0.4)'; };
        button.onmouseout = () => { button.style.transform = 'translateY(0)'; button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; };
        button.onclick = calculateRecommendation;

        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.style.cssText = `padding: ${isPDA ? '8px 10px' : '10px 15px'}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: ${isPDA ? '14px' : '16px'}; transition: all 0.3s ease;`;
        settingsBtn.onmouseover = () => { settingsBtn.style.transform = 'translateY(-2px)'; settingsBtn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.4)'; };
        settingsBtn.onmouseout = () => { settingsBtn.style.transform = 'translateY(0)'; settingsBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; };
        settingsBtn.onclick = openSettings;

        buttonsContainer.appendChild(button);
        buttonsContainer.appendChild(settingsBtn);
        toggleBtn.onclick = () => {
            if (buttonsContainer.style.display === 'none') buttonsContainer.style.display = 'flex';
            else buttonsContainer.style.display = 'none';
        };

        container.appendChild(buttonsContainer);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
    }

   function showNotification(message, type = 'info') {
       const notification = document.createElement('div');
       notification.style.cssText = `position: fixed; top: 80px; right: 20px; z-index: 100000; padding: 20px 25px 20px 20px; background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'}; color: white; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.3); max-width: 400px; font-size: 14px; line-height: 1.6; animation: slideIn 0.3s ease; display: flex; gap: 15px; align-items: flex-start;`;

       const messageDiv = document.createElement('div');
       messageDiv.innerHTML = message;
       messageDiv.style.cssText = `flex: 1;`;

       const closeBtn = document.createElement('button');
       closeBtn.innerHTML = '✕';
       closeBtn.style.cssText = `background: rgba(255,255,255,0.2); border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 16px; line-height: 1; padding: 0; flex-shrink: 0; transition: background 0.2s;`;
       closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,255,255,0.3)'; };
       closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.2)'; };
       closeBtn.onclick = () => {
           notification.style.animation = 'slideIn 0.3s ease reverse';
           setTimeout(() => notification.remove(), 300);
       };

       notification.appendChild(messageDiv);
       notification.appendChild(closeBtn);

       const style = document.createElement('style');
       style.textContent = `@keyframes slideIn { from { transform: translateX(500px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
       document.head.appendChild(style);
       document.body.appendChild(notification);

       setTimeout(() => {
           notification.style.animation = 'slideIn 0.3s ease reverse';
           setTimeout(() => notification.remove(), 300);
       }, 4000);
   }

    async function openSettings() {

        if (!INVESTMENT_TABLE) {
            const cachedTable = sessionStorage.getItem(INVESTMENT_TABLE_SESSION_KEY);
            if (cachedTable) {
                INVESTMENT_TABLE = JSON.parse(cachedTable);
            }
        }

        if (INVESTMENT_TABLE && INVESTMENT_TABLE.length > 0 && !INVESTMENT_TABLE[0].cost && apiKey) {
            try {
                INVESTMENT_TABLE = await enrichInvestmentTableWithPrices(INVESTMENT_TABLE, apiKey);
                sessionStorage.setItem(INVESTMENT_TABLE_SESSION_KEY, JSON.stringify(INVESTMENT_TABLE));
            } catch (error) {
                console.log('Could not enrich table:', error);
            }
        }

        const backdrop = document.createElement('div');
        backdrop.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100001; display: flex; justify-content: center; align-items: center;`;

        const modal = document.createElement('div');
        modal.style.cssText = `background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 500px; max-height: 80vh; overflow-y: auto;`;

        const title = document.createElement('h2');
        title.textContent = 'Settings';
        title.style.cssText = `margin: 0 0 20px 0; color: #333; font-size: 20px;`;
        modal.appendChild(title);

        const apiKeySection = document.createElement('div');
        apiKeySection.style.cssText = `margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #eee;`;

        const apiKeyTitle = document.createElement('h3');
        apiKeyTitle.textContent = 'API Key';
        apiKeyTitle.style.cssText = `margin: 0 0 10px 0; color: #333; font-size: 16px;`;

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.value = apiKey;
        apiKeyInput.placeholder = 'Enter your Torn API key';
        apiKeyInput.style.cssText = `width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;`;

        apiKeySection.appendChild(apiKeyTitle);
        apiKeySection.appendChild(apiKeyInput);
        modal.appendChild(apiKeySection);

        const monthlyProfitSection = document.createElement('div');
        monthlyProfitSection.style.cssText = `margin-bottom: 25px;`;

        const monthlyProfitBtn = document.createElement('button');
        monthlyProfitBtn.textContent = '💰 Monthly Profit ▼';
        monthlyProfitBtn.style.cssText = `width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; text-align: left;`;

        const monthlyProfitContent = document.createElement('div');
        monthlyProfitContent.id = 'monthly_profit_content';
        monthlyProfitContent.style.cssText = `display: none; margin-top: 10px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 13px;`;

        monthlyProfitBtn.onclick = async () => {
            if (monthlyProfitContent.style.display === 'none') {
                if (!apiKey) { alert('Please enter your API key first.'); return; }

                monthlyProfitContent.innerHTML = '<div style="text-align: center; color: #666;">Loading...</div>';
                monthlyProfitContent.style.display = 'block';
                monthlyProfitBtn.textContent = '💰 Monthly Profit ▲';

                const authResult = await checkAuthorization(apiKey);
                if (!authResult.authorized) {
                    monthlyProfitContent.innerHTML = `<div style="color: #e74c3c; text-align: center;">Error loading data. Please check your API key.</div>`;
                    return;
                }

                try {
                    const stocksData = await fetchAPI(`https://api.torn.com/v2/user?selections=stocks&key=${apiKey}`);
                    const tornStocksData = await fetchAPI(`https://api.torn.com/v2/torn?selections=stocks&key=${apiKey}`);

                    let totalCash = 0;
                    let benefits = {};

                    for (const [stockId, stockInfo] of Object.entries(stocksData.stocks || {})) {
                        const acronym = STOCK_MAP[stockId];
                        if (!acronym) continue;

                        const tornStock = tornStocksData.stocks[stockId];
                        if (!tornStock || !tornStock.benefit) continue;

                        let currentIncrement = 0;
                        if (stockInfo.dividend) currentIncrement = stockInfo.dividend.increment;
                        else if (stockInfo.benefit) currentIncrement = stockInfo.benefit.increment;

                        if (currentIncrement === 0) continue;

                        const description = tornStock.benefit.description;
                        const frequency = tornStock.benefit.frequency;
                        const monthlyMultiplier = frequency === 7 ? 4 : 1;

                        if (description.startsWith('$')) {
                            const cashMatch = description.match(/\$([0-9,]+)/);
                            if (cashMatch) {
                                const cashValue = parseInt(cashMatch[1].replace(/,/g, ''));
                                totalCash += cashValue * currentIncrement * monthlyMultiplier;
                            }
                        } else if (description.match(/^(\d+)\s+(.+)/)) {

                            const match = description.match(/^(\d+)\s+(.+)/);
                            const baseAmount = parseInt(match[1]);
                            const type = match[2];
                            const monthlyAmount = baseAmount * currentIncrement * monthlyMultiplier;
                            benefits[type] = (benefits[type] || 0) + monthlyAmount;
                        } else if (description.match(/^1x\s+(.+)/)) {

                            const match = description.match(/^1x\s+(.+)/);
                            const item = match[1];
                            const monthlyAmount = 1 * currentIncrement * monthlyMultiplier;
                            benefits[item] = (benefits[item] || 0) + monthlyAmount;
                        } else if (description.match(/(\d+)%/)) {

                            const percentMatch = description.match(/(\d+)%/);
                            const percent = parseInt(percentMatch[1]);
                            const monthlyPercent = percent * currentIncrement * monthlyMultiplier;
                            benefits[description] = (benefits[description] || 0) + monthlyPercent;
                        } else {

                            const count = currentIncrement * monthlyMultiplier;
                            if (benefits[description]) {
                                benefits[description] += count;
                            } else {
                                benefits[description] = count;
                            }
                        }
                    }

                    let html = '<div style="color: #333; line-height: 1.5;">';

                    if (totalCash > 0) {
                        html += `<div style="margin-bottom: 4px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">•</span> <strong>Cash:</strong> ${formatMoney(totalCash)}</div>`;
                    }

                    for (const [benefit, amount] of Object.entries(benefits)) {
                        html += `<div style="margin-bottom: 4px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">•</span> <strong>${benefit}:</strong> ${amount.toLocaleString()}</div>`;
                    }

                    if (totalCash === 0 && Object.keys(benefits).length === 0) {
                        html = '<div style="text-align: center; color: #666;">No monthly profits found.</div>';
                    }

                    html += '</div>';
                    monthlyProfitContent.innerHTML = html;

                } catch (error) {
                    monthlyProfitContent.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
                }
            } else {
                monthlyProfitContent.style.display = 'none';
                monthlyProfitBtn.textContent = '💰 Monthly Profit ▼';
            }
        };

        monthlyProfitSection.appendChild(monthlyProfitBtn);
        monthlyProfitSection.appendChild(monthlyProfitContent);
        modal.appendChild(monthlyProfitSection);

        const balanceDistSection = document.createElement('div');
        balanceDistSection.style.cssText = `margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #eee;`;

        const balanceDistBtn = document.createElement('button');
        balanceDistBtn.textContent = '💰 Balance Distribution ▼';
        balanceDistBtn.style.cssText = `width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; text-align: left;`;

        const balanceContent = document.createElement('div');
        balanceContent.id = 'balance_content';
        balanceContent.style.cssText = `display: none; margin-top: 10px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 13px;`;

        balanceDistBtn.onclick = async () => {
            if (balanceContent.style.display === 'none') {
                if (!apiKey) { alert('Please enter your API key first.'); return; }

                balanceContent.innerHTML = '<div style="text-align: center; color: #666;">Loading...</div>';
                balanceContent.style.display = 'block';
                balanceDistBtn.textContent = '💰 Balance Distribution ▲';

                const authResult = await checkAuthorization(apiKey);
                if (!authResult.authorized) {
                    balanceContent.innerHTML = `<div style="color: #e74c3c; text-align: center;">Error loading data. Please check your API key.</div>`;
                    return;
                }

                try {
                    const moneyData = await fetchAPI(`https://api.torn.com/v2/user/money?key=${apiKey}`);
                    const money = moneyData.money;

                    const networthData = await fetchAPI(`https://api.torn.com/v2/user?selections=networth&key=${apiKey}`);
                    const nw = networthData.networth;

                    let html = '';
                    let totalBalance = 0;

                    const moneyComponents = [
                        { key: 'wallet', label: 'Wallet', value: money.wallet || 0 },
                        { key: 'bank', label: 'Bank', value: money.city_bank?.amount || 0 },
                        { key: 'cayman', label: 'Cayman', value: money.cayman_bank || 0 },
                        { key: 'vault', label: 'Vault', value: money.vault || 0 },
                    ];

                    moneyComponents.forEach(comp => {
                        if (settings[comp.key] && comp.value !== 0) {
                            html += `<div style="margin-bottom: 5px; color: #333;"><strong>${comp.label}:</strong> ${formatMoney(comp.value)}</div>`;
                            totalBalance += comp.value;
                        }
                    });

                    const networthComponents = [
                        { key: 'pending', label: 'Pending', value: nw.pending || 0 },
                        { key: 'points', label: 'Points', value: nw.points || 0 },
                        { key: 'piggybank', label: 'Piggy Bank', value: nw.piggybank || 0 },
                        { key: 'items', label: 'Items', value: nw.items || 0 },
                        { key: 'displaycase', label: 'Display Case', value: nw.displaycase || 0 },
                        { key: 'bazaar', label: 'Bazaar', value: nw.bazaar || 0 },
                        { key: 'trade', label: 'Trade', value: nw.trade || 0 },
                        { key: 'itemmarket', label: 'Item Market', value: nw.itemmarket || 0 },
                        { key: 'properties', label: 'Properties', value: nw.properties || 0 },
                        { key: 'auctionhouse', label: 'Auction House', value: nw.auctionhouse || 0 },
                        { key: 'bookie', label: 'Bookie', value: nw.bookie || 0 },
                        { key: 'enlistedcars', label: 'Enlisted Cars', value: nw.enlistedcars || 0 },
                        { key: 'loan', label: 'Loan', value: nw.loan || 0 },
                        { key: 'unpaidfees', label: 'Unpaid Fees', value: nw.unpaidfees || 0 }
                    ];

                    networthComponents.forEach(comp => {
                        if (settings[comp.key] && comp.value !== 0) {
                            html += `<div style="margin-bottom: 5px; color: #333;"><strong>${comp.label}:</strong> ${formatMoney(comp.value)}</div>`;
                            totalBalance += comp.value;
                        }
                    });

                    if (settings.factionMoney) {
                        const factionMoney = money.faction?.money || 0;
                        if (factionMoney !== 0) {
                            html += `<div style="margin-bottom: 5px; color: #333;"><strong>Faction Money:</strong> ${formatMoney(factionMoney)}</div>`;
                            totalBalance += factionMoney;
                        }
                    }
                    if (settings.company) {
                        const companyMoney = money.company || 0;
                        if (companyMoney !== 0) {
                            html += `<div style="margin-bottom: 5px; color: #333;"><strong>Company Money:</strong> ${formatMoney(companyMoney)}</div>`;
                            totalBalance += companyMoney;
                        }
                    }

                    if (settings.companyEscrow) {
                        try {
                            const companyData = await fetchAPI(`https://api.torn.com/v2/company?selections=detailed,employees&key=${apiKey}`);

                            if (companyData.error || !companyData.company_detailed) {
                                html += `<div style="margin-bottom: 5px; color: #e74c3c;"><strong>Company Escrow:</strong> ❌ You are NOT a company owner!</div>`;
                            } else {
                                const adBudget = companyData.company_detailed.advertising_budget || 0;
                                const weeklyAdBudget = adBudget * 7;

                                let totalWages = 0;
                                for (const [employeeId, employeeData] of Object.entries(companyData.company_employees || {})) {
                                    totalWages += employeeData.wage || 0;
                                }
                                const weeklyWageBudget = totalWages * 7;

                                let escrowTotal = 0;
                                if (companyEscrowPreferences.weeklyAdBudget) escrowTotal += weeklyAdBudget;
                                if (companyEscrowPreferences.weeklyWageBudget) escrowTotal += weeklyWageBudget;

                                if (escrowTotal > 0) {
                                    html += `<div style="margin: 10px 0 5px 0; color: #333;"><strong>Company Escrow:</strong> -${formatMoney(escrowTotal)}<button id="company_escrow_toggle" style="margin-left: 8px; padding: 2px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">▼</button></div><div id="company_escrow_content" style="display: none; margin-left: 15px; padding: 10px; background: white; border-radius: 6px; margin-top: 5px; font-size: 12px;">`;

                                    if (companyEscrowPreferences.weeklyAdBudget) {
                                        html += `<div style="margin-bottom: 4px; color: #333;">Weekly Ad Budget: ${formatMoney(weeklyAdBudget)}</div>`;
                                    }
                                    if (companyEscrowPreferences.weeklyWageBudget) {
                                        html += `<div style="margin-bottom: 4px; color: #333;">Weekly Wage Budget: ${formatMoney(weeklyWageBudget)}</div>`;
                                    }

                                    html += `</div>`;
                                    totalBalance -= escrowTotal;
                                }
                            }
                        } catch (error) {
                            html += `<div style="margin-bottom: 5px; color: #e74c3c;"><strong>Company Escrow:</strong> Error loading data</div>`;
                        }
                    }

                    if (settings.extraStockShares) {
                        const stocksData = await fetchAPI(`https://api.torn.com/v2/user?selections=stocks&key=${apiKey}`);
                        const tornStocksData = await fetchAPI(`https://api.torn.com/v2/torn?selections=stocks&key=${apiKey}`);
                        let stockBreakdown = [];
                        let stockTotal = 0;

                        for (const [stockId, stockInfo] of Object.entries(stocksData.stocks || {})) {
                            const acronym = STOCK_MAP[stockId];
                            if (acronym) {
                                const currentPrice = tornStocksData.stocks[stockId]?.current_price || 0;
                                const baseRequirement = tornStocksData.stocks[stockId]?.benefit?.requirement || 0;

                                if (stockInfo.dividend || stockInfo.benefit) {
                                    let actualIncrement = 0;
                                    for (let i = 1; i <= 4; i++) {
                                        let sharesForIncrement = (i === 1) ? baseRequirement : (baseRequirement * Math.pow(2, i)) - baseRequirement;
                                        if (stockInfo.total_shares >= sharesForIncrement) actualIncrement = i;
                                        else break;
                                    }
                                    let totalSharesNeeded = (actualIncrement === 1) ? baseRequirement : (baseRequirement * Math.pow(2, actualIncrement)) - baseRequirement;
                                    const extraShares = stockInfo.total_shares - totalSharesNeeded;
                                    if (extraShares > 0 && extraStockPreferences[acronym] !== false) {
                                        const value = extraShares * currentPrice;
                                        stockBreakdown.push({ acronym, shares: extraShares, price: currentPrice, value });
                                        stockTotal += value;
                                    }
                                } else {
                                    if (extraStockPreferences[acronym] !== false) {
                                        const value = stockInfo.total_shares * currentPrice;
                                        stockBreakdown.push({ acronym, shares: stockInfo.total_shares, price: currentPrice, value });
                                        stockTotal += value;
                                    }
                                }
                            }
                        }

                        if (stockTotal > 0) {
                            html += `<div style="margin: 10px 0 5px 0; color: #333;"><strong>Extra Stock Shares:</strong> ${formatMoney(stockTotal)}<button id="stock_details_toggle" style="margin-left: 8px; padding: 2px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">▼</button></div><div id="stock_details_content" style="display: none; margin-left: 15px; padding: 10px; background: white; border-radius: 6px; margin-top: 5px; font-size: 12px;">`;
                            stockBreakdown.forEach(stock => {
                                html += `<div style="margin-bottom: 4px; color: #333;">${stock.acronym}: ${stock.shares.toLocaleString()} × ${formatMoney(stock.price)} = ${formatMoney(stock.value)}</div>`;
                            });
                            html += `</div>`;
                            totalBalance += stockTotal;
                        }
                    }

                    html += `<div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #ddd; font-weight: bold; color: #333;">Total: ${formatMoney(totalBalance)}</div>`;
                    balanceContent.innerHTML = html;

                    const stockToggle = document.getElementById('stock_details_toggle');
                    if (stockToggle) {
                        stockToggle.onclick = () => {
                            const stockDetails = document.getElementById('stock_details_content');
                            if (stockDetails.style.display === 'none') {
                                stockDetails.style.display = 'block';
                                stockToggle.textContent = '▲';
                            } else {
                                stockDetails.style.display = 'none';
                                stockToggle.textContent = '▼';
                            }
                        };
                    }
                    const escrowToggle = document.getElementById('company_escrow_toggle');
                    if (escrowToggle) {
                        escrowToggle.onclick = () => {
                            const escrowContent = document.getElementById('company_escrow_content');
                            if (escrowContent.style.display === 'none') {
                                escrowContent.style.display = 'block';
                                escrowToggle.textContent = '▲';
                            } else {
                                escrowContent.style.display = 'none';
                                escrowToggle.textContent = '▼';
                            }
                        };
                    }
                } catch (error) {
                    balanceContent.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
                }
            } else {
                balanceContent.style.display = 'none';
                balanceDistBtn.textContent = '💰 Balance Distribution ▼';
            }
        };

        balanceDistSection.appendChild(balanceDistBtn);
        balanceDistSection.appendChild(balanceContent);
        modal.appendChild(balanceDistSection);

        const balanceTitle = document.createElement('h3');
        balanceTitle.textContent = 'Balance Calculation';
        balanceTitle.style.cssText = `margin: 0 0 10px 0; color: #333; font-size: 16px;`;

        const description = document.createElement('p');
        description.textContent = 'Select which components to include in your balance calculation:';
        description.style.cssText = `margin: 0 0 15px 0; color: #666; font-size: 14px;`;

        modal.appendChild(balanceTitle);
        modal.appendChild(description);

        const settingsOptions = [
            { key: 'pending', label: 'Pending' }, { key: 'wallet', label: 'Wallet' }, { key: 'bank', label: 'Bank' },
            { key: 'cayman', label: 'Cayman' }, { key: 'vault', label: 'Vault' }, { key: 'piggybank', label: 'Piggy Bank' },
            { key: 'items', label: 'Items' }, { key: 'displaycase', label: 'Display Case' }, { key: 'bazaar', label: 'Bazaar' },
            { key: 'trade', label: 'Trade' }, { key: 'itemmarket', label: 'Item Market' }, { key: 'properties', label: 'Properties' },
            { key: 'auctionhouse', label: 'Auction House' }, { key: 'bookie', label: 'Bookie' }, { key: 'enlistedcars', label: 'Enlisted Cars' },
            { key: 'loan', label: 'Loan' }, { key: 'unpaidfees', label: 'Unpaid Fees' }, { key: 'points', label: 'Points' },
            { key: 'factionMoney', label: 'Faction Money' }, { key: 'company', label: 'Company Money' }, { key: 'companyEscrow', label: 'Company Escrow' }, { key: 'extraStockShares', label: 'Extra Stock Shares' }
        ];

        settingsOptions.forEach(option => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.cssText = `margin-bottom: 12px; display: flex; align-items: center;`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `setting_${option.key}`;
            checkbox.checked = settings[option.key];
            checkbox.style.cssText = `width: 18px; height: 18px; cursor: pointer; margin-right: 10px;`;
            checkbox.onchange = (e) => {
                settings[option.key] = e.target.checked;

                if (option.key === 'extraStockShares') {
                    const btn = modal.querySelector('#config_stocks_btn');
                    if (btn) {
                        btn.style.display = e.target.checked ? 'block' : 'none';
                        if (!e.target.checked) {
                            const content = modal.querySelector('#config_stocks_content');
                            if (content) content.style.display = 'none';
                            btn.textContent = '🔧 Configure Stocks ▼';
                        }
                    }
                }
                if (option.key === 'companyEscrow') {
                    const btn = modal.querySelector('#config_company_escrow_btn');
                    if (btn) {
                        btn.style.display = e.target.checked ? 'block' : 'none';
                        if (!e.target.checked) {
                            const content = modal.querySelector('#config_company_escrow_content');
                            if (content) content.style.display = 'none';
                            btn.textContent = '🔧 Configure Company Escrow ▼';
                        }
                    }
                }
            };

            const label = document.createElement('label');
            label.htmlFor = `setting_${option.key}`;
            label.textContent = option.label;
            label.style.cssText = `color: #333; font-size: 14px; cursor: pointer;`;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            modal.appendChild(checkboxContainer);

            if (option.key === 'companyEscrow') {
                const configCompanyEscrowBtn = document.createElement('button');
                configCompanyEscrowBtn.textContent = '🔧 Configure Company Escrow ▼';
                configCompanyEscrowBtn.id = 'config_company_escrow_btn';
                configCompanyEscrowBtn.style.cssText = `width: 100%; padding: 10px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; text-align: left; margin-top: 8px; margin-bottom: 12px; display: ${settings.companyEscrow ? 'block' : 'none'};`;

                const configCompanyEscrowContent = document.createElement('div');
                configCompanyEscrowContent.id = 'config_company_escrow_content';
                configCompanyEscrowContent.style.cssText = `display: none; margin-top: 10px; margin-bottom: 12px; padding: 12px; background: #f9f9f9; border-radius: 6px; font-size: 13px;`;

                configCompanyEscrowBtn.onclick = async () => {
                    if (configCompanyEscrowContent.style.display === 'none') {
                        if (!apiKey) { alert('Please enter your API key first.'); return; }

                        configCompanyEscrowContent.innerHTML = '<div style="text-align: center; color: #666;">Loading company data...</div>';
                        configCompanyEscrowContent.style.display = 'block';
                        configCompanyEscrowBtn.textContent = '🔧 Configure Company Escrow ▲';

                        try {
                            const companyData = await fetchAPI(`https://api.torn.com/v2/company?selections=detailed,employees&key=${apiKey}`);

                            if (companyData.error || !companyData.company_detailed) {
                                configCompanyEscrowContent.innerHTML = '<div style="text-align: center; color: #e74c3c;">❌ You are NOT a company owner!</div>';
                                return;
                            }

                            const adBudget = companyData.company_detailed.advertising_budget || 0;
                            const weeklyAdBudget = adBudget * 7;

                            let totalWages = 0;
                            for (const [employeeId, employeeData] of Object.entries(companyData.company_employees || {})) {
                                totalWages += employeeData.wage || 0;
                            }
                            const weeklyWageBudget = totalWages * 7;

                            let html = '<div style="margin-bottom: 10px; font-weight: bold; color: #333;">Select components to deduct from balance:</div>';

                            html += `<div style="margin-bottom: 10px; display: flex; align-items: center; padding: 8px; background: white; border-radius: 4px;">
                    <input type="checkbox" id="company_escrow_ad" ${companyEscrowPreferences.weeklyAdBudget ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer; margin-right: 10px; flex-shrink: 0;">
                    <label for="company_escrow_ad" style="color: #333; font-size: 13px; cursor: pointer; flex-grow: 1;">
                        <strong>Weekly Ad Budget</strong> - ${formatMoney(weeklyAdBudget)}
                    </label>
                </div>`;

                            html += `<div style="margin-bottom: 10px; display: flex; align-items: center; padding: 8px; background: white; border-radius: 4px;">
                    <input type="checkbox" id="company_escrow_wage" ${companyEscrowPreferences.weeklyWageBudget ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer; margin-right: 10px; flex-shrink: 0;">
                    <label for="company_escrow_wage" style="color: #333; font-size: 13px; cursor: pointer; flex-grow: 1;">
                        <strong>Weekly Wage Budget</strong> - ${formatMoney(weeklyWageBudget)}
                    </label>
                </div>`;

                            configCompanyEscrowContent.innerHTML = html;

                            const adCheckbox = document.getElementById('company_escrow_ad');
                            const wageCheckbox = document.getElementById('company_escrow_wage');
                            if (adCheckbox) adCheckbox.onchange = (e) => { companyEscrowPreferences.weeklyAdBudget = e.target.checked; };
                            if (wageCheckbox) wageCheckbox.onchange = (e) => { companyEscrowPreferences.weeklyWageBudget = e.target.checked; };

                        } catch (error) {
                            configCompanyEscrowContent.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
                        }
                    } else {
                        configCompanyEscrowContent.style.display = 'none';
                        configCompanyEscrowBtn.textContent = '🔧 Configure Company Escrow ▼';
                    }
                };

                checkboxContainer.appendChild(configCompanyEscrowBtn);
                checkboxContainer.appendChild(configCompanyEscrowContent);
            }

            if (option.key === 'extraStockShares') {
                const configStocksBtn = document.createElement('button');
                configStocksBtn.textContent = '🔧 Configure Stocks ▼';
                configStocksBtn.id = 'config_stocks_btn';
                configStocksBtn.style.cssText = `width: 100%; padding: 10px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; text-align: left; margin-top: 8px; margin-bottom: 12px; display: ${settings.extraStockShares ? 'block' : 'none'};`;

                const configStocksContent = document.createElement('div');
                configStocksContent.id = 'config_stocks_content';
                configStocksContent.style.cssText = `display: none; margin-top: 10px; margin-bottom: 12px; padding: 12px; background: #f9f9f9; border-radius: 6px; font-size: 13px; max-height: 250px; overflow-y: auto;`;

                configStocksBtn.onclick = async () => {
                    if (configStocksContent.style.display === 'none') {
                        if (!apiKey) { alert('Please enter your API key first.'); return; }

                        configStocksContent.innerHTML = '<div style="text-align: center; color: #666;">Loading stocks...</div>';
                        configStocksContent.style.display = 'block';
                        configStocksBtn.textContent = '🔧 Configure Stocks ▲';

                        try {
                            const stocksData = await fetchAPI(`https://api.torn.com/v2/user?selections=stocks&key=${apiKey}`);
                            const tornStocksData = await fetchAPI(`https://api.torn.com/v2/torn?selections=stocks&key=${apiKey}`);
                            let html = '';
                            let hasStocks = false;

                            for (const [stockId, stockInfo] of Object.entries(stocksData.stocks || {})) {
                                const acronym = STOCK_MAP[stockId];
                                if (acronym && stockInfo.total_shares > 0) {
                                    const currentPrice = tornStocksData.stocks[stockId]?.current_price || 0;
                                    const baseRequirement = tornStocksData.stocks[stockId]?.benefit?.requirement || 0;
                                    let extraShares = 0;
                                    let extraValue = 0;

                                    if (stockInfo.dividend || stockInfo.benefit) {
                                        let actualIncrement = 0;
                                        for (let i = 1; i <= 4; i++) {
                                            let sharesForIncrement = (i === 1) ? baseRequirement : (baseRequirement * Math.pow(2, i)) - baseRequirement;
                                            if (stockInfo.total_shares >= sharesForIncrement) actualIncrement = i;
                                            else break;
                                        }
                                        let totalSharesNeeded = (actualIncrement === 1) ? baseRequirement : (baseRequirement * Math.pow(2, actualIncrement)) - baseRequirement;
                                        extraShares = stockInfo.total_shares - totalSharesNeeded;
                                        extraValue = extraShares * currentPrice;
                                    } else {
                                        extraShares = stockInfo.total_shares;
                                        extraValue = extraShares * currentPrice;
                                    }

                                    if (extraShares > 0) {
                                        hasStocks = true;
                                        if (extraStockPreferences[acronym] === undefined) extraStockPreferences[acronym] = true;
                                        html += `<div style="margin-bottom: 10px; display: flex; align-items: center; padding: 8px; background: white; border-radius: 4px;"><input type="checkbox" id="extra_stock_${acronym}" ${extraStockPreferences[acronym] ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer; margin-right: 10px; flex-shrink: 0;"><label for="extra_stock_${acronym}" style="color: #333; font-size: 13px; cursor: pointer; flex-grow: 1;"><strong>${acronym}</strong> - ${extraShares.toLocaleString()} shares (${formatMoney(extraValue)})</label></div>`;
                                    }
                                }
                            }

                            if (hasStocks) {
                                configStocksContent.innerHTML = html;
                                Object.keys(extraStockPreferences).forEach(acronym => {
                                    const cb = document.getElementById(`extra_stock_${acronym}`);
                                    if (cb) cb.onchange = (e) => { extraStockPreferences[acronym] = e.target.checked; };
                                });
                            } else {
                                configStocksContent.innerHTML = '<div style="text-align: center; color: #666;">No extra stock shares found.</div>';
                            }
                        } catch (error) {
                            configStocksContent.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
                        }
                    } else {
                        configStocksContent.style.display = 'none';
                        configStocksBtn.textContent = '🔧 Configure Stocks ▼';
                    }
                };

                checkboxContainer.appendChild(configStocksBtn);
                checkboxContainer.appendChild(configStocksContent);
            }
        });

        const investmentSection = document.createElement('div');
        investmentSection.style.cssText = `margin-top: 25px; padding-top: 25px; border-top: 2px solid #eee;`;

        const investmentTitle = document.createElement('h3');
        investmentTitle.textContent = 'Investment Rankings';
        investmentTitle.style.cssText = `margin: 0 0 10px 0; color: #333; font-size: 16px;`;

        const investmentDesc = document.createElement('p');
        investmentDesc.textContent = 'Select which investments you want to consider (in priority order):';
        investmentDesc.style.cssText = `margin: 0 0 15px 0; color: #666; font-size: 14px;`;

        investmentSection.appendChild(investmentTitle);
        investmentSection.appendChild(investmentDesc);

        if (!INVESTMENT_TABLE || INVESTMENT_TABLE.length === 0) {
            const loadingMsg = document.createElement('div');
            loadingMsg.textContent = 'Investment data will load after authorization...';
            loadingMsg.style.cssText = `padding: 15px; background: #f9f9f9; border-radius: 8px; color: #666; text-align: center;`;
            investmentSection.appendChild(loadingMsg);
            modal.appendChild(investmentSection);
        } else {
            const toggleButtonsContainer = document.createElement('div');
            toggleButtonsContainer.style.cssText = `margin-bottom: 15px; display: flex; gap: 10px;`;

            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = 'Select All';
            selectAllBtn.style.cssText = `padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;`;
            selectAllBtn.onclick = () => {
                INVESTMENT_TABLE.forEach((inv) => {
                    const invKey = getInvestmentKey(inv.acronym, inv.increment);
                    investmentPreferences[invKey] = true;
                    const checkbox = document.getElementById(`inv_${invKey}`);
                    if (checkbox) checkbox.checked = true;
                });
            };

            const deselectAllBtn = document.createElement('button');
            deselectAllBtn.textContent = 'Deselect All';
            deselectAllBtn.style.cssText = `padding: 6px 12px; background: #95a5a6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;`;
            deselectAllBtn.onclick = () => {
                INVESTMENT_TABLE.forEach((inv) => {
                    const invKey = getInvestmentKey(inv.acronym, inv.increment);
                    investmentPreferences[invKey] = false;
                    const checkbox = document.getElementById(`inv_${invKey}`);
                    if (checkbox) checkbox.checked = false;
                });
            };

            toggleButtonsContainer.appendChild(selectAllBtn);
            toggleButtonsContainer.appendChild(deselectAllBtn);
            investmentSection.appendChild(toggleButtonsContainer);

            const investmentList = document.createElement('div');
            investmentList.style.cssText = `max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 10px; background: #f9f9f9;`;

            INVESTMENT_TABLE.forEach((investment, index) => {
                const invKey = getInvestmentKey(investment.acronym, investment.increment);

                if (investmentPreferences[invKey] === undefined) {
                    investmentPreferences[invKey] = true;
                }

                const invContainer = document.createElement('div');
                invContainer.style.cssText = `margin-bottom: 8px; display: flex; align-items: center; padding: 5px; background: white; border-radius: 4px;`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `inv_${invKey}`;
                checkbox.checked = investmentPreferences[invKey];
                checkbox.style.cssText = `width: 16px; height: 16px; cursor: pointer; margin-right: 10px; flex-shrink: 0;`;
                checkbox.onchange = (e) => { investmentPreferences[invKey] = e.target.checked; };

                const label = document.createElement('label');
                label.htmlFor = `inv_${invKey}`;
                label.textContent = `${index + 1}. ${investment.acronym} - Increment ${investment.increment} (${investment.shares_to_buy.toLocaleString()} shares)`;
                label.style.cssText = `color: #333; font-size: 13px; cursor: pointer; flex-grow: 1;`;

                invContainer.appendChild(checkbox);
                invContainer.appendChild(label);
                investmentList.appendChild(invContainer);
            });

            investmentSection.appendChild(investmentList);
            modal.appendChild(investmentSection);
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `margin-top: 25px; display: flex; gap: 10px; justify-content: flex-end;`;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;`;
        saveBtn.onclick = () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey && newKey !== apiKey) saveApiKey(newKey);
            saveSettings();
            saveInvestmentPreferences();
            saveExtraStockPreferences();
            saveCompanyEscrowPreferences();
            backdrop.remove();
            showNotification('Settings saved successfully!', 'success');
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;`;
        cancelBtn.onclick = () => { backdrop.remove(); };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);
        modal.appendChild(buttonContainer);

        backdrop.appendChild(modal);
        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
        document.body.appendChild(backdrop);
    }

    async function fetchAPI(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        } catch (error) {
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
    }

    async function enrichInvestmentTableWithPrices(investmentTable, apiKey) {
        try {
            const tornStocksData = await fetchAPI(`https://api.torn.com/v2/torn?selections=stocks&key=${apiKey}`);

            return investmentTable.map(investment => {
                const stockId = Object.keys(STOCK_MAP).find(id => STOCK_MAP[id] === investment.acronym);
                const currentPrice = tornStocksData.stocks[stockId]?.current_price || 0;

                return {
                    ...investment,
                    cost: investment.shares_to_buy * currentPrice,
                    current_price: currentPrice
                };
            });
        } catch (error) {
            console.error('Error enriching investment table:', error);
            return investmentTable;
        }
    }

    async function calculateRecommendation() {
        if (!apiKey) {
            const newKey = prompt('Enter your Limited or Full Access Torn API key:');
            if (!newKey) { showNotification('API key is required to calculate recommendations.', 'error'); return; }
            saveApiKey(newKey);
        }

        if (!INVESTMENT_TABLE || INVESTMENT_TABLE.length === 0) {
            const cachedTable = sessionStorage.getItem(INVESTMENT_TABLE_SESSION_KEY);
            if (cachedTable) {
                INVESTMENT_TABLE = JSON.parse(cachedTable);
            } else {
                showNotification('Loading investment data...', 'info');
                const authResult = await checkAuthorization(apiKey);
                if (!authResult.authorized) {
                    if (authResult.error && authResult.error.includes('Invalid API key')) {
                        clearApiKey();
                    }
                    showNotification(authResult.error, 'error');
                    return;
                }
                if (!INVESTMENT_TABLE || INVESTMENT_TABLE.length === 0) {
                    showNotification('Failed to load investment data. Please try again.', 'error');
                    return;
                }
            }
        }

        const authResult = await checkAuthorization(apiKey);
        if (!authResult.authorized) {
            if (authResult.error && authResult.error.includes('Invalid API key')) {
                clearApiKey();
            }
            showNotification(authResult.error, 'error');
            return;
        }


        const savedInvestments = localStorage.getItem(INVESTMENTS_KEY);
        if (savedInvestments) investmentPreferences = { ...investmentPreferences, ...JSON.parse(savedInvestments) };

        showNotification('Calculating your next investment... Please wait.', 'info');

        try {
            const moneyData = await fetchAPI(`https://api.torn.com/v2/user/money?key=${apiKey}`);
            const money = moneyData.money;

            const networthData = await fetchAPI(`https://api.torn.com/v2/user?selections=networth&key=${apiKey}`);
            const nw = networthData.networth;

            let balance = 0;

            if (settings.wallet) balance += (money.wallet || 0);
            if (settings.bank) balance += (money.city_bank?.amount || 0);
            if (settings.cayman) balance += (money.cayman_bank || 0);
            if (settings.vault) balance += (money.vault || 0);
            if (settings.factionMoney) balance += (money.faction?.money || 0);
            if (settings.company) balance += (money.company || 0);
            if (settings.pending) balance += (nw.pending || 0);
            if (settings.points) balance += (nw.points || 0);
            if (settings.piggybank) balance += (nw.piggybank || 0);
            if (settings.items) balance += (nw.items || 0);
            if (settings.displaycase) balance += (nw.displaycase || 0);
            if (settings.bazaar) balance += (nw.bazaar || 0);
            if (settings.trade) balance += (nw.trade || 0);
            if (settings.itemmarket) balance += (nw.itemmarket || 0);
            if (settings.properties) balance += (nw.properties || 0);
            if (settings.auctionhouse) balance += (nw.auctionhouse || 0);
            if (settings.bookie) balance += (nw.bookie || 0);
            if (settings.enlistedcars) balance += (nw.enlistedcars || 0);
            if (settings.loan) balance += (nw.loan || 0);
            if (settings.unpaidfees) balance += (nw.unpaidfees || 0);

            if (settings.companyEscrow) {
                try {
                    const companyData = await fetchAPI(`https://api.torn.com/v2/company?selections=detailed,employees&key=${apiKey}`);

                    if (!companyData.error && companyData.company_detailed) {
                        const adBudget = companyData.company_detailed.advertising_budget || 0;
                        const weeklyAdBudget = adBudget * 7;

                        let totalWages = 0;
                        for (const [employeeId, employeeData] of Object.entries(companyData.company_employees || {})) {
                            totalWages += employeeData.wage || 0;
                        }
                        const weeklyWageBudget = totalWages * 7;

                        if (companyEscrowPreferences.weeklyAdBudget) balance -= weeklyAdBudget;
                        if (companyEscrowPreferences.weeklyWageBudget) balance -= weeklyWageBudget;
                    }
                } catch (error) {
                    console.log('Company escrow data not available');
                }
            }

            const stocksData = await fetchAPI(`https://api.torn.com/v2/user?selections=stocks&key=${apiKey}`);
            const tornStocksData = await fetchAPI(`https://api.torn.com/v2/torn?selections=stocks&key=${apiKey}`);

            const userStocks = {};
            let stockTotal = 0;

            for (const [stockId, stockInfo] of Object.entries(stocksData.stocks || {})) {
                const acronym = STOCK_MAP[stockId];
                if (acronym) {
                    const currentPrice = tornStocksData.stocks[stockId]?.current_price || 0;
                    const baseRequirement = tornStocksData.stocks[stockId]?.benefit?.requirement || 0;

                    if (stockInfo.dividend || stockInfo.benefit) {
                        let actualIncrement = 0;
                        for (let i = 1; i <= 4; i++) {
                            let sharesForIncrement = (i === 1) ? baseRequirement : (baseRequirement * Math.pow(2, i)) - baseRequirement;
                            if (stockInfo.total_shares >= sharesForIncrement) actualIncrement = i;
                            else break;
                        }
                        userStocks[acronym] = actualIncrement;

                        if (settings.extraStockShares) {
                            let totalSharesNeeded = (actualIncrement === 1) ? baseRequirement : (baseRequirement * Math.pow(2, actualIncrement)) - baseRequirement;
                            const extraShares = stockInfo.total_shares - totalSharesNeeded;
                            if (extraShares > 0 && extraStockPreferences[acronym] !== false) {
                                stockTotal += extraShares * currentPrice;
                            }
                        }
                    } else {
                        userStocks[acronym] = 0;
                        if (settings.extraStockShares && extraStockPreferences[acronym] !== false) {
                            stockTotal += stockInfo.total_shares * currentPrice;
                        }
                    }
                }
            }

            if (settings.extraStockShares) balance += stockTotal;

            let nextInvestment = null;
            for (let i = 0; i < INVESTMENT_TABLE.length; i++) {
                const investment = INVESTMENT_TABLE[i];

                const invKey = getInvestmentKey(investment.acronym, investment.increment);
                if (investmentPreferences[invKey] === false) continue;

                const currentIncrement = userStocks[investment.acronym] || 0;
                if (currentIncrement < investment.increment) {
                    nextInvestment = investment;
                    break;
                }
            }

            if (!nextInvestment) {
                showNotification('🎉 Congratulations! You have completed all recommended stock investments!', 'success');
                return;
            }

            const canAfford = balance >= nextInvestment.cost;
            const shortfall = canAfford ? 0 : nextInvestment.cost - balance;

            let message = `
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">📈 Next Investment Recommendation</div>
            <div style="text-align: center; margin: 15px 0;">
                <img src="${STOCK_IMAGES[nextInvestment.acronym]}" alt="${nextInvestment.acronym}" style="width: 80px; height: 80px; border-radius: 10px; background: rgba(255,255,255,0.1); padding: 10px;">
            </div>
            <div style="margin-bottom: 8px;"><strong>Stock:</strong> ${nextInvestment.acronym} (Increment ${nextInvestment.increment})</div>
            <div style="margin-bottom: 8px;"><strong>Shares to Buy:</strong> ${nextInvestment.shares_to_buy.toLocaleString()}</div>
            <div style="margin-bottom: 8px;"><strong>Cost:</strong> ${formatMoney(nextInvestment.cost)} <span style="font-size: 12px; opacity: 0.8;">(at current price)</span></div>
            <div style="margin-bottom: 8px;"><strong>Your Balance:</strong> ${formatMoney(balance)}</div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.3);">
                ${canAfford ? `✅ <strong>You can invest now!</strong><br><a href="https://www.torn.com/page.php?sid=stocks&stockID=${Object.keys(STOCK_MAP).find(key => STOCK_MAP[key] === nextInvestment.acronym)}&tab=owned" style="color: white; text-decoration: underline; font-weight: bold;">Take me there!</a>` : `❌ You need ${formatMoney(shortfall)} more to invest.`}
            </div>
        `;

            showNotification(message, canAfford ? 'success' : 'info');
        } catch (error) {
            showNotification(`Error: ${error.message}<br><br>Please check your API key and try again.`, 'error');
            clearApiKey();
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createButton);
    else createButton();
})();