// ==UserScript==
// @name         TORN Company Dashboard + Stock Autofill (Dynamic)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Dynamic stock autofill and company analytics, Torn-compliant UI, auto-updates on tab changes
// @match        https://www.torn.com/companies.php?step=your&type=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560238/TORN%20Company%20Dashboard%20%2B%20Stock%20Autofill%20%28Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560238/TORN%20Company%20Dashboard%20%2B%20Stock%20Autofill%20%28Dynamic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_STORAGE_KEY = "torn_company_api_key";
    let apiKey = localStorage.getItem(API_STORAGE_KEY);
    if (!apiKey) {
        apiKey = prompt("Enter your LIMITED Torn Director API key:");
        if (apiKey) localStorage.setItem(API_STORAGE_KEY, apiKey);
    }

    function setApiKey(key) {
        localStorage.setItem(API_STORAGE_KEY, key);
        apiKey = key;
    }

    // ********** CREATE COMPLIANT UI PANEL **********
    function createUI() {
        const iconBar = document.querySelector("#main .menu, .icon-bar");
        if (!iconBar) return;

        if(document.getElementById("company-dashboard-ui")) return; // prevent duplicates

        const container = document.createElement("div");
        container.id = "company-dashboard-ui";
        container.className = "content-box"; // Torn-style container
        container.style.marginTop = "10px";
        container.style.padding = "10px";

        container.innerHTML = `
            <div class="content-box-header"><b>Company Dashboard & Stock Autofill</b></div>
            <div class="content-box-content">
                <div style="margin-bottom:5px;">
                    <input type="text" id="company-api-key" placeholder="Enter API key" value="${apiKey || ''}" style="width:60%;">
                    <button id="save-api-key">Save</button>
                </div>
                <div style="margin-bottom:10px;">
                    <button id="autofill-stock">Autofill Stock (7 days)</button>
                    <span id="stock-status" style="margin-left:5px;"></span>
                </div>
                <div>
                    <b>Company Analytics (Last 7 days)</b>
                    <div id="company-analytics" style="margin-top:5px;">Loading...</div>
                </div>
            </div>
        `;

        iconBar.parentNode.insertBefore(container, iconBar.nextSibling);

        document.getElementById("save-api-key").addEventListener("click", () => {
            const key = document.getElementById("company-api-key").value.trim();
            if (key) setApiKey(key);
            alert("API key saved!");
        });

        document.getElementById("autofill-stock").addEventListener("click", async () => {
            document.getElementById("stock-status").innerText = "Filling...";
            await autofillStock();
        });
    }

    // ********** WAIT FOR STOCK TABLE **********
    function waitForStockTable() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const table = document.querySelector("#stock_table, table");
                if (table) {
                    clearInterval(interval);
                    resolve(table);
                }
            }, 300);
        });
    }

    // ********** FETCH LAST 7 DAYS SALES **********
    async function fetchSalesFromAPI() {
        if (!apiKey) return null;

        try {
            const response = await fetch(`https://api.torn.com/company/?selections=daily&key=${apiKey}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const sales = {};
            const dailyReports = Object.entries(data.company.daily_reports)
                .sort((a,b) => b[0].localeCompare(a[0]))
                .slice(0,7);

            dailyReports.forEach(([date, day]) => {
                if (day.items_sold) {
                    Object.entries(day.items_sold).forEach(([id, qty]) => {
                        sales[id] = (sales[id] || 0) + qty;
                    });
                }
            });

            return { sales, dailyReports, companyData: data.company };
        } catch (err) {
            console.warn("API error:", err);
            return null;
        }
    }

    // ********** AUTOFILL STOCK **********
    async function autofillStock() {
        const table = await waitForStockTable();
        const stockStatus = document.getElementById("stock-status");
        const result = await fetchSalesFromAPI();
        if (!result) {
            stockStatus.innerText = "API failed!";
            return;
        }

        const { sales } = result;
        let filled = 0;

        table.querySelectorAll("input[type='text'], input[type='number']").forEach(input => {
            const itemId = input.getAttribute("data-itemid");
            if (itemId && sales[itemId] !== undefined) {
                input.value = sales[itemId];
                filled++;
            }
        });

        stockStatus.innerText = `Autofilled ${filled} items`;
        updateAnalytics(result);
    }

    // ********** UPDATE COMPANY ANALYTICS **********
    function updateAnalytics({ dailyReports, companyData }) {
        const analyticsDiv = document.getElementById("company-analytics");
        if (!dailyReports || !companyData) {
            analyticsDiv.innerText = "No data available";
            return;
        }

        let weeklyIncome = 0;
        let weeklyExpenses = 0;
        let weeklySalaries = 0;
        let weeklyItemsSold = 0;

        dailyReports.forEach(([date, day]) => {
            if (day.income) weeklyIncome += day.income;
            if (day.expenses) weeklyExpenses += day.expenses;
            if (day.salaries) weeklySalaries += day.salaries;
            if (day.items_sold) weeklyItemsSold += Object.values(day.items_sold).reduce((a,b)=>a+b,0);
        });

        const profit = weeklyIncome - weeklyExpenses - weeklySalaries;

        analyticsDiv.innerHTML = `
            <div>Income: $${weeklyIncome.toLocaleString()}</div>
            <div>Expenses: $${weeklyExpenses.toLocaleString()}</div>
            <div>Salaries: $${weeklySalaries.toLocaleString()}</div>
            <div>Items Sold: ${weeklyItemsSold}</div>
            <div><b>Profit: $${profit.toLocaleString()}</b></div>
        `;
    }

    // ********** DYNAMIC UPDATES ON TAB CHANGE **********
    let lastHash = location.hash;
    function checkHashChange() {
        if(location.hash !== lastHash) {
            lastHash = location.hash;
            fetchSalesFromAPI().then(result => { if(result) updateAnalytics(result); });
        }
    }

    setInterval(checkHashChange, 500); // check every 0.5s

    // ********** INIT **********
    createUI();
    if(apiKey) fetchSalesFromAPI().then(result => { if(result) updateAnalytics(result); });

})();
