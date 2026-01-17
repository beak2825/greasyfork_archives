// ==UserScript==
// @name         微信流量主收入税后计算器 (WeChat Publisher Tax Calculator)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在腾讯微信流量主财务页面自动计算并显示税后收入（基于2025年实际执行的1%增值税+按月合并计税规则）
// @author       Antigravity
// @match        https://mp.weixin.qq.com/cgi-bin/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562836/%E5%BE%AE%E4%BF%A1%E6%B5%81%E9%87%8F%E4%B8%BB%E6%94%B6%E5%85%A5%E7%A8%8E%E5%90%8E%E8%AE%A1%E7%AE%97%E5%99%A8%20%28WeChat%20Publisher%20Tax%20Calculator%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562836/%E5%BE%AE%E4%BF%A1%E6%B5%81%E9%87%8F%E4%B8%BB%E6%94%B6%E5%85%A5%E7%A8%8E%E5%90%8E%E8%AE%A1%E7%AE%97%E5%99%A8%20%28WeChat%20Publisher%20Tax%20Calculator%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /**
     * tax_formulas
     * Based on analysis:
     * VAT = Income / 1.01 * 0.01 (Discounted rate 1% for small-scale)
     * Surtax = VAT * 0.06 (6% of VAT)
     * Net = Income - VAT - Surtax
     * IIT: Calculated on a MONTHLY basis.
     *      MonthlyTotal > 4000: (MonthlyNet * 0.8) * 0.2
     *      MonthlyTotal <= 4000: max(0, MonthlyNet - 800) * 0.2
     * RowTax = MonthlyTax * (RowNet / MonthlyTotalNet)
     */

    const LOG_PREFIX = "[TaxCalc]";
    let isProcessing = false;
    // Helper: Parse currency "2,599.42" -> 2599.42
    function parseMoney(str) {
        if (!str || str === '-') return 0;
        return parseFloat(str.replace(/,/g, ''));
    }
    // Helper: Format currency
    function formatMoney(num) {
        return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    function calculateTaxes(rowsData) {
        // First pass: Group by Month to calculate Monthly Totals
        // rowsData: [{ id, income, monthKey, element, netBeforeIIT }]
        const monthlyTotals = {};
        // Step 1: Calculate VAT/Surtax and group
        rowsData.forEach(row => {
            // Logic: VAT applies if Income >= 500? Use simple logic for now.
            // Analysis showed even 530.06 had tax. So threshold is likely low or applied.
            // However, usually < 500 is VAT free. But standard rules usually apply.
            // Let's assume VAT applies for all > 0 for safety, or strictly >= 500?
            // User doc says >= 500. Let's strictly follow >= 500 logic for VAT.

            let vat = 0;
            let surtax = 0;
            if (row.income >= 500) {
                vat = row.income / 1.01 * 0.01;
                surtax = vat * 0.06;
            }

            row.netBeforeIIT = row.income - vat - surtax;
            row.vatAndSurtax = vat + surtax;

            if (!monthlyTotals[row.monthKey]) {
                monthlyTotals[row.monthKey] = 0;
            }
            monthlyTotals[row.monthKey] += row.netBeforeIIT;
        });
        // Step 2: Calculate IIT for each month and distribute
        const monthlyTax = {};
        for (const [month, totalNet] of Object.entries(monthlyTotals)) {
            let iit = 0;
            if (totalNet > 4000) {
                iit = totalNet * 0.8 * 0.2;
            } else {
                iit = Math.max(0, totalNet - 800) * 0.2;
            }
            monthlyTax[month] = iit;
        }
        // Step 3: Assign back to rows
        rowsData.forEach(row => {
            const totalNetInMonth = monthlyTotals[row.monthKey];
            const totalTaxInMonth = monthlyTax[row.monthKey];

            let rowIIT = 0;
            if (totalNetInMonth > 0) {
                // Pro-rate based on contribution to net income
                rowIIT = totalTaxInMonth * (row.netBeforeIIT / totalNetInMonth);
            }

            row.finalTax = row.vatAndSurtax + rowIIT;
            row.afterTax = row.income - row.finalTax;
        });
    }
    function processTable() {
        if (isProcessing) return;
        isProcessing = true;
        const table = document.querySelector('.adui-table-mainTable');
        if (!table) {
            isProcessing = false;
            return;
        }
        // CHECK IF ALREADY INJECTED
        const headerRow = table.querySelector('.adui-table-thead');
        if (headerRow && headerRow.querySelector('.tax-calc-header')) {
            // Already initialized
            isProcessing = false;
            return;
        }
        console.log(LOG_PREFIX, "Processing Table...");
        // 1. INSERT HEADER
        // Insert before the last column (Operations)
        // Operation column usually has data-column="7"
        // Let's find column 6 (Settlement Income) and insert after it.
        const header6 = headerRow.querySelector('[data-column="6"]');
        if (header6) {
            const newHeader = header6.cloneNode(true);
            newHeader.setAttribute('data-column', 'calc_result');
            newHeader.classList.add('tax-calc-header');
            const cell = newHeader.querySelector('.adui-table-cellInner') || newHeader.querySelector('.adui-table-cell');
            // inner text
            if(newHeader.querySelector('.adui-icon-base')) {
               newHeader.querySelector('.adui-icon-base').remove();
            }

            // Clean text
            if(newHeader.querySelector('.adui-table-cellInner')) {
                // Keep the flex structure but replace text
                const inner = newHeader.querySelector('.adui-table-cellInner');
                // Remove existing children (like svg icons)
                while(inner.firstChild) inner.removeChild(inner.firstChild);
                inner.innerText = "预估税后 (元)";
                inner.style.color = "#07c160"; // WeChat Green
                inner.style.fontWeight = "bold";
            } else {
                newHeader.innerText = "预估税后 (元)";
            }
            // Insert before Column 7
            const header7 = headerRow.querySelector('[data-column="7"]');
            if (header7) {
                headerRow.insertBefore(newHeader, header7);
            } else {
                headerRow.appendChild(newHeader);
            }
        }
        // 2. PARSE ROWS
        const rows = table.querySelectorAll('.adui-table-tbody .adui-table-tr');
        const rowsData = [];
        rows.forEach((row, index) => {
            // Extract Date (Col 0)
            const dateCell = row.querySelector('[data-column="0"]');
            const dateText = dateCell ? dateCell.innerText : "";
            // Format: "2025年12月16日至31日"
            // Regex to capture YYYY年MM月
            const match = dateText.match(/(\d{4})年(\d{1,2})月/);
            const monthKey = match ? `${match[1]}-${match[2].padStart(2, '0')}` : "Unknown";
            // Extract Income (Col 3) - Original Income
            const incomeCell = row.querySelector('[data-column="3"]');
            const incomeText = incomeCell ? incomeCell.innerText : "0";
            const income = parseMoney(incomeText);
            rowsData.push({
                index: index,
                element: row,
                income: income,
                monthKey: monthKey
            });
        });
        // 3. CALCULATE
        calculateTaxes(rowsData);
        // 4. INJECT CELLS
        rowsData.forEach(data => {
            const row = data.element;
            const cell6 = row.querySelector('[data-column="6"]');
            const cell7 = row.querySelector('[data-column="7"]');

            if (cell6) {
                const newCell = cell6.cloneNode(true);
                newCell.setAttribute('data-column', 'calc_result');

                const inner = newCell.querySelector('.adui-table-cellInner');
                if (inner) {
                   inner.innerText = formatMoney(data.afterTax);
                   inner.style.color = "#07c160"; // Green for money
                   inner.style.fontWeight = "bold";
                   inner.title = `原始: ${data.income}\n预估扣税: ${formatMoney(data.finalTax)}\n(含增值税及附加 + 个税)`;
                }
                if (cell7) {
                    row.insertBefore(newCell, cell7);
                } else {
                    row.appendChild(newCell);
                }
            }
        });
        isProcessing = false;
    }
    // OBSERVER to handle page load / date switch
    const observer = new MutationObserver((mutations) => {
        // Debounce simple check
        const table = document.querySelector('.adui-table-mainTable');
        if (table && !table.querySelector('.tax-calc-header')) {
             processTable();
        }
    });
    // Start observing body for subtree changes (Since SPA)
    observer.observe(document.body, { childList: true, subtree: true });
    // Initial check
    setTimeout(processTable, 2000);
})();