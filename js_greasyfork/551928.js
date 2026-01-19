// ==UserScript==
// @name         [Inventory] ASIN table viewer - with trend
// @namespace    http://tampermonkey.net/
// @version      5.17
// @description  [新增 ASIN 趨勢分析] 銷售 & 庫存報表 + YTD 月度銷售趨勢資料 (Long Format CSV)
// @match        https://www.sellercentral.amazon.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551928/%5BInventory%5D%20ASIN%20table%20viewer%20-%20with%20trend.user.js
// @updateURL https://update.greasyfork.org/scripts/551928/%5BInventory%5D%20ASIN%20table%20viewer%20-%20with%20trend.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- 輔助函式:等待與讀取 Token ----------
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else {
                    elapsedTime += intervalTime;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        reject(new Error(`等待元素 "${selector}" 超時 (${timeout}ms)。`));
                    }
                }
            }, intervalTime);
        });
    }

    function getCsrfToken() {
        const metaTag = document.querySelector('meta[name="anti-csrftoken-a2z"]');
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }
        console.error("❌ CSRF Token meta tag ('anti-csrftoken-a2z') not found in the page HTML!");
        return null;
    }


    // ---------- 日期工具 ----------
    function fmt(y, m, d) { return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
    function lastDay(y, m) { return new Date(y, m, 0).getDate(); }

    function getDateRanges() {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const lastMonth = m - 1 > 0 ? m - 1 : 12;
        const lastYearForLastMonth = m - 1 > 0 ? y : y - 1;
        const lastMonthStart = fmt(lastYearForLastMonth, lastMonth, 1);
        const lastMonthEnd = fmt(lastYearForLastMonth, lastMonth, lastDay(lastYearForLastMonth, lastMonth));
        const prevMonth = m - 2 > 0 ? m - 2 : 12 + (m - 2);
        const prevYearForPrevMonth = m - 2 > 0 ? y : y - 1;
        const prevMonthStart = fmt(prevYearForPrevMonth, prevMonth, 1);
        const prevMonthEnd = fmt(prevYearForPrevMonth, prevMonth, lastDay(prevYearForPrevMonth, prevMonth));
        const lastYearStart = fmt(y - 1, lastMonth, 1);
        const lastYearEnd = fmt(y - 1, lastMonth, lastDay(y - 1, lastMonth));
        return {
            lastMonth: { start: lastMonthStart, end: lastMonthEnd },
            prevMonth: { start: prevMonthStart, end: prevMonthEnd },
            lastYear: { start: lastYearStart, end: lastYearEnd }
        };
    }

    function getComparisonRanges(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const prevEnd = new Date(start.getTime() - (1000 * 60 * 60 * 24));
        const prevStart = new Date(prevEnd.getTime() - (1000 * 60 * 60 * 24 * (diffDays - 1)));
        const yoyStart = new Date(start.getFullYear() - 1, start.getMonth(), start.getDate());
        const yoyEnd = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
        let prevLabel = 'PoP';
        if (diffDays === 7) { prevLabel = 'WoW'; }
        else if (diffDays === 1) { prevLabel = 'DoD'; }
        return {
            current: { start: startDateStr, end: endDateStr },
            prev: { start: prevStart.toISOString().split('T')[0], end: prevEnd.toISOString().split('T')[0] },
            yoy: { start: yoyStart.toISOString().split('T')[0], end: yoyEnd.toISOString().split('T')[0] },
            labels: { prev: prevLabel, yoy: 'YoY' }
        };
    }

    // ---------- 抓 Seller Name ----------
    async function fetchSellerName() {
        try {
            const res = await fetch("https://www.sellercentral.amazon.dev/account-switcher/global-and-regional-account/merchantMarketplace?", {
                method: "GET", credentials: "include", headers: { accept: "application/json" }
            });
            const data = await res.json();
            return deepFindLabel(data) || "UnknownSeller";
        } catch (e) {
            console.error("❌ Seller Name API 失敗", e);
            return "UnknownSeller";
        }
    }
    function deepFindLabel(obj) {
        if (!obj) return null;
        if (typeof obj === "object") {
            if (obj.label) return obj.label;
            for (let k in obj) {
                const found = deepFindLabel(obj[k]);
                if (found) return found;
            }
        }
        return null;
    }

    // ---------- API 請求 ----------
    async function fetchReport(startDate, endDate) {
        try {
            const res = await fetch("https://www.sellercentral.amazon.dev/business-reports/api", {
                method: "POST", credentials: "include",
                headers: { "accept": "*/*", "content-type": "application/json" },
                body: JSON.stringify({
                    operationName: "reportDataQuery",
                    variables: { input: { legacyReportId: "102:DetailSalesTrafficByChildItem", startDate, endDate, asins: [] } },
                    query: `query reportDataQuery($input: GetReportDataInput) { getReportData(input: $input) { startDate endDate columns { label } rows } }`
                })
            });
            if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
            const json = await res.json();
            return json?.data?.getReportData || { columns: [], rows: [] };
        } catch(e) {
            console.error(`❌ Fetch report failed for ${startDate} to ${endDate}`, e);
            return null;
        }
    }

    async function fetchInventoryData() {
        const csrfToken = getCsrfToken();
        if (!csrfToken) { return new Map(); }
        const inventoryMap = new Map();
        let currentPage = 1;
        let totalCount = 0;
        const pageSize = 50;
        const bodyTemplate = {
            operationName: "getPrimeInventory",
            variables: {
                withProductDetails: true, withAvailable: true, withTotalDaysOfSupply: true,
                input: {
                    pagination: { pageNumber: 1, pageSize: pageSize },
                    filters: [],
                    sortings: [{ sortDirection: "DESC", sortColumn: "SALES_T90" }]
                }
            },
            query: `query getPrimeInventory($input: GetPrimeInventoryInput!, $withProductDetails: Boolean!, $withAvailable: Boolean!, $withTotalDaysOfSupply: Boolean!) {
              primeInventory(input: $input) {
                totalCount
                primeInventoryRecords {
                  asin
                  itemName @include(if: $withProductDetails)
                  available @include(if: $withAvailable) { availableQuantity }
                  totalDaysOfSupply @include(if: $withTotalDaysOfSupply) { daysOfSupply }
                }
              }
            }`
        };

        console.log("🚀 Starting inventory fetch with CSRF token from meta tag...");
        try {
            do {
                const body = JSON.parse(JSON.stringify(bodyTemplate));
                body.variables.input.pagination.pageNumber = currentPage;
                const response = await fetch("https://www.sellercentral.amazon.dev/ipv2/bff/graphql", {
                    method: "POST",
                    headers: {
                        "accept": "application/json, text/plain, */*", "content-type": "application/json",
                        "x-requested-with": "XMLHttpRequest", "anti-csrftoken-a2z": csrfToken
                    },
                    body: JSON.stringify(body),
                    credentials: "include"
                });
                if (!response.ok) throw new Error(`API request for page ${currentPage} failed: ${response.statusText}`);
                const json = await response.json();
                const records = json?.data?.primeInventory?.primeInventoryRecords || [];
                totalCount = json?.data?.primeInventory?.totalCount || 0;

                // [v5.15 修改] 同 ASIN 多筆時，取 available 最大的那筆資料
                records.forEach(item => {
                    if (item.asin) {
                        const newAvailable = item.available?.availableQuantity ?? 0;

                        if (inventoryMap.has(item.asin)) {
                            const existing = inventoryMap.get(item.asin);
                            const existingAvailable = existing.available === 'N/A' ? 0 : existing.available;

                            // 只有當新的 available 更大時才覆蓋整筆資料
                            if (newAvailable > existingAvailable) {
                                inventoryMap.set(item.asin, {
                                    itemName: item.itemName ?? 'N/A',
                                    available: newAvailable,
                                    supplyDays: item.totalDaysOfSupply?.daysOfSupply ?? 'N/A',
                                });
                            }
                        } else {
                            inventoryMap.set(item.asin, {
                                itemName: item.itemName ?? 'N/A',
                                available: newAvailable,
                                supplyDays: item.totalDaysOfSupply?.daysOfSupply ?? 'N/A',
                            });
                        }
                    }
                });

                currentPage++;
            } while (inventoryMap.size < totalCount && currentPage < 20);
            console.log(`✅ Inventory data fetched. Total ${inventoryMap.size} of ${totalCount} items.`);
            return inventoryMap;
        } catch (error) {
            console.error("❌ Fetch inventory data failed:", error);
            return new Map();
        }
    }

    // ---------- 數字與聚合 ----------
    const toNumber = (val) => (val == null ? 0 : (parseFloat(val.toString().replace(/[^0-9.\-]/g, "")) || 0));
    function calcChange(curr, base, isPct = false) {
        if (!base || base === 0) return "N/A";
        if (isPct) { return ((curr - base) * 100).toFixed(0) + " bps"; }
        return ((curr - base) / base * 100).toFixed(2) + "%";
    }
    function findColumnIndex(columns, patterns) {
        const labels = columns.map(c => c.label);
        for (let i = 0; i < labels.length; i++) {
            if (patterns.some(p => p.toLowerCase() === labels[i].toLowerCase())) return i;
        }
        for (let i = 0; i < labels.length; i++) {
            const L = labels[i].toLowerCase();
            const norm = L.replace(/[()]/g, '').replace(/\s+/g, ' ');
            if (norm.includes('featured offer') && norm.includes('percentage')) return i;
            if (norm.includes('buy box') && norm.includes('percentage')) return i;
        }
        return -1;
    }
    function aggregateByASIN(report) {
        if (!report || !report.columns || !report.rows) return [];
        const cols = report.columns;
        const asinIdx = findColumnIndex(cols, ["(Child) ASIN", "Child ASIN"]);
        const sessionsIdx = findColumnIndex(cols, ["Sessions - Total"]);
        const itemsIdx = findColumnIndex(cols, ["Total Order Items"]);
        const salesIdx = findColumnIndex(cols, ["Ordered Product Sales"]);
        const b2bSalesIdx = findColumnIndex(cols, ["Ordered Product Sales - B2B"]);
        const featuredIdx = findColumnIndex(cols, ["Featured Offer Percentage", "Featured Offer (Buy Box) Percentage", "Buy Box Percentage", "Featured Offer %"]);
        const result = {};
        report.rows.forEach(r => {
            const asin = asinIdx >= 0 ? r[asinIdx] : "(unknown)";
            if (!result[asin]) result[asin] = { asin, sessions: 0, items: 0, sales: 0, b2bSales: 0, featuredSum: 0, featuredWeight: 0 };
            const s = sessionsIdx >= 0 ? toNumber(r[sessionsIdx]) : 0;
            result[asin].sessions += s;
            result[asin].items += itemsIdx >= 0 ? toNumber(r[itemsIdx]) : 0;
            result[asin].sales += salesIdx >= 0 ? toNumber(r[salesIdx]) : 0;
            result[asin].b2bSales += b2bSalesIdx >= 0 ? toNumber(r[b2bSalesIdx]) : 0;
            if (featuredIdx >= 0) {
                let f = toNumber(r[featuredIdx]);
                if (typeof r[featuredIdx] === "string" && !r[featuredIdx].includes("%") && f > 0 && f <= 1) f *= 100;
                if (s > 0 && f >= 0) { result[asin].featuredSum += f * s; result[asin].featuredWeight += s; }
            }
        });
        Object.values(result).forEach(r => {
            r.cvr = r.sessions > 0 ? (r.items / r.sessions) * 100 : 0;
            r.featured = r.featuredWeight > 0 ? r.featuredSum / r.featuredWeight : null;
            // b2bPct 將在 renderComparisonTable 中計算（需要用到 totalSales）
        });
        return Object.values(result);
    }

    // ---------- [新增] Trailing 12 Months 趨勢分析功能 ----------
    async function fetchYTDTrendData() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // 1-12

        // 計算 trailing 12 months (從當前月份往回推 12 個月)
        const months = [];
        for (let i = 0; i < 12; i++) {
            let targetMonth = currentMonth - i;
            let targetYear = currentYear;

            // 處理跨年
            while (targetMonth <= 0) {
                targetMonth += 12;
                targetYear -= 1;
            }

            months.push({ year: targetYear, month: targetMonth });
        }

        // 反轉順序，讓最舊的月份在前面 (2025-02, 2025-03, ..., 2026-01)
        months.reverse();

        const firstMonth = months[0];
        const lastMonth = months[months.length - 1];
        console.log(`🔄 開始抓取 Trailing 12 Months 趨勢資料 (${firstMonth.year}-${String(firstMonth.month).padStart(2, '0')} ~ ${lastMonth.year}-${String(lastMonth.month).padStart(2, '0')})...`);

        const promises = [];

        // 抓取 trailing 12 months 的資料
        for (const { year, month } of months) {
            const startDate = fmt(year, month, 1);
            const endDate = fmt(year, month, lastDay(year, month));
            promises.push(
                fetchReport(startDate, endDate).then(report => ({
                    month: `${year}-${String(month).padStart(2, '0')}`,
                    report: report
                }))
            );
        }

        const results = await Promise.all(promises);

        // 彙整成 Wide Format: Child ASIN 為列，月份為欄
        const asinMonthMap = new Map(); // Key: ASIN, Value: { "2025-01": sales, "2025-02": sales, ... }
        const allMonths = []; // 收集所有月份

        results.forEach(({ month, report }) => {
            if (!report || !report.columns || !report.rows) return;
            if (!allMonths.includes(month)) allMonths.push(month);

            const cols = report.columns;
            const asinIdx = findColumnIndex(cols, ["(Child) ASIN", "Child ASIN"]);
            const salesIdx = findColumnIndex(cols, ["Ordered Product Sales"]);

            if (asinIdx < 0 || salesIdx < 0) return;

            report.rows.forEach(row => {
                const asin = row[asinIdx];
                const sales = toNumber(row[salesIdx]);

                if (!asinMonthMap.has(asin)) {
                    asinMonthMap.set(asin, {});
                }

                const asinData = asinMonthMap.get(asin);
                if (!asinData[month]) {
                    asinData[month] = 0;
                }
                asinData[month] += sales;
            });
        });

        // 排序月份 (確保欄位順序正確)
        allMonths.sort();

        console.log(`✅ 趨勢資料抓取完成！共 ${asinMonthMap.size} 個 ASIN，${allMonths.length} 個月份`);
        return { asinMonthMap, allMonths };
    }

    async function downloadYTDTrendCSV() {
        const statusDiv = document.createElement('div');
        Object.assign(statusDiv.style, {
            position: "fixed", top: "110px", right: "20px", zIndex: "1000000",
            padding: "10px", background: "#2563eb", color: "white",
            borderRadius: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        });
        statusDiv.innerText = "🔄 正在抓取 YTD 趨勢資料...";
        document.body.appendChild(statusDiv);

        try {
            const { asinMonthMap, allMonths } = await fetchYTDTrendData();

            if (asinMonthMap.size === 0) {
                throw new Error("沒有抓取到任何資料");
            }

            // 生成 CSV (Wide Format)
            // 表頭：Child ASIN, 2025-01, 2025-02, ...
            let csv = "Child ASIN," + allMonths.join(",") + "\n";

            // 每個 ASIN 一列
            asinMonthMap.forEach((monthData, asin) => {
                let row = `"${asin}"`;
                allMonths.forEach(month => {
                    const sales = monthData[month] || 0;
                    row += `,${sales.toFixed(2)}`;
                });
                csv += row + "\n";
            });

            // 下載檔案
            const seller = await fetchSellerName();
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            const safeSeller = seller.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
            const filename = `${dateStr}_${safeSeller}_ASIN_Trend_YTD.csv`;

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();

            statusDiv.innerText = "✅ YTD 趨勢 CSV 下載完成！";
            statusDiv.style.background = "#16a34a";
        } catch (error) {
            console.error("❌ 下載 YTD 趨勢 CSV 失敗:", error);
            statusDiv.innerText = "❌ 下載失敗！";
            statusDiv.style.background = "#dc2626";
        } finally {
            setTimeout(() => statusDiv.remove(), 3000);
        }
    }

    // ---------- CSV ----------
    async function downloadTableAsCSV(tableId) {
        const table = document.getElementById(tableId);
        if (!table) { alert("❌ 找不到表格"); return; }
        let csv = [];
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const cols = row.querySelectorAll("th,td");
            csv.push(Array.from(cols).map(c => `"${c.innerText.replace(/"/g, '""')}"`).join(","));
        });
        const seller = await fetchSellerName();
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const safeSeller = seller.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
        const filename = `${dateStr}_${safeSeller}_ASIN_Report_${tableId}.csv`;
        const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // ---------- Render ----------
    function colorize(val) {
        if (val === "N/A") return `<span style="color:#6b7280">${val}</span>`;
        const n = parseFloat(val);
        if (isNaN(n)) return val;
        if (n > 0) return `<span style="color:#16a34a">${val}</span>`;
        if (n < 0) return `<span style="color:#dc2626">${val}</span>`;
        return val;
    }

    // [MODIFIED] 此版本已更新欄位標題和背景顏色
    function renderComparisonTable(title, tableId, currentData, prevData, yoyData, range, labels, inventoryData) {
        const { prev: prevLabel, yoy: yoyLabel } = labels;
        const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);

        // 計算每個 ASIN 的 B2B% = B2B Sales / Total GMS
        currentData.forEach(r => {
            r.b2bPct = totalSales > 0 ? (r.b2bSales / totalSales) * 100 : 0;
        });

        currentData.sort((a, b) => b.sales - a.sales);

        let html = `<h2>${title} (${range.start} ~ ${range.end})
            <button onclick="downloadTableAsCSV('${tableId}')"
            style="margin-left:20px;padding:4px 10px;border:none;border-radius:6px;background:#374151;color:#fff;cursor:pointer;">下載CSV</button>
        </h2>`;
        html += `<table id="${tableId}" border='1' cellspacing='0' cellpadding='6' style='border-collapse:collapse; margin-top: 10px; font-size: 14px;'>`;

        // 表頭 (<th>) 的順序和名稱已根據您的要求修改
        html += "<tr style='text-align: center;'>" +
            "<th>Child ASIN</th>" +
            "<th style='text-align: left;'>Title</th>" +
            "<th style='background-color:#fffbe6;'>Sales Contribution %</th>" +
            "<th>Featured Offer %</th>" +
            // --- Ordered Product Sales 區塊 ---
            `<th>Ordered Product Sales</th><th style="background-color:#e0f2fe;">Ordered Product Sales - Prior Period</th><th style="background-color:#f0fdf4;">Ordered Product Sales - Last Year</th><th style='background:#3b82f6;color:#fff;'>${prevLabel}</th><th style='background:#10b981;color:#fff;border-right:3px solid #000;'>${yoyLabel}</th>` +
            // --- B2B 區塊 ---
            `<th style='background-color:#fff3cd;'>B2B Sales</th><th style='background-color:#fff3cd;border-right:3px solid #000;'>B2B %</th>` +
            // --- Sessions - Total 區塊 ---
            `<th>Sessions - Total</th><th style="background-color:#e0f2fe;">Sessions - Total - Prior Period</th><th style="background-color:#f0fdf4;">Sessions - Total - Last Year</th><th style='background:#3b82f6;color:#fff;'>${prevLabel}</th><th style='background:#10b981;color:#fff;border-right:3px solid #000;'>${yoyLabel}</th>` +
            // --- Total Order Items 區塊 ---
            `<th>Total Order Items</th><th style="background-color:#e0f2fe;">Total Order Items - Prior Period</th><th style="background-color:#f0fdf4;">Total Order Items - Last Year</th><th style='background:#3b82f6;color:#fff;'>${prevLabel}</th><th style='background:#10b981;color:#fff;border-right:3px solid #000;'>${yoyLabel}</th>` +
            // --- Unit Session Percentage 區塊 ---
            `<th>Unit Session Percentage</th><th style="background-color:#e0f2fe;">Unit Session % - Prior Period</th><th style="background-color:#f0fdf4;">Unit Session % - Last Year</th><th style='background:#3b82f6;color:#fff;'>${prevLabel}</th><th style='background:#10b981;color:#fff;border-right:3px solid #000;'>${yoyLabel}</th>` +
            // --- 庫存資訊區塊 ---
            `<th style='background-color:#e0f2fe; border-left: 3px solid #000;'>Available</th>` +
            `<th style='background-color:#e0f2fe;'>Total Days of Supply</th>` +
            `<th style='background-color:#e0f2fe;'>WOC</th>` +
            "</tr>";

        if (currentData.length === 0) {
            html += `<tr><td colspan="29" style="text-align:center; padding: 20px;">此期間無資料</td></tr>`;
        } else {
            currentData.forEach(r => {
                const p = prevData.find(x => x.asin === r.asin) || { sessions: 0, items: 0, sales: 0, cvr: 0, featured: null };
                const y = yoyData.find(x => x.asin === r.asin)  || { sessions: 0, items: 0, sales: 0, cvr: 0, featured: null };
                const inv = inventoryData.get(r.asin) || { itemName: 'N/A', available: 'N/A', supplyDays: 'N/A' };
                const featuredStr = (r.featured == null) ? "-" : `${r.featured.toFixed(2)}%`;
                const salesPercentage = totalSales > 0 ? ((r.sales / totalSales) * 100).toFixed(2) + '%' : '0.00%';
                const supplyDaysNum = parseInt(inv.supplyDays, 10);
                const woc = !isNaN(supplyDaysNum) ? Math.floor(supplyDaysNum / 7) : 'N/A';

                // 資料格 (<td>) 的順序與顏色已同步調整
                html += `<tr style='text-align: right;'>
                    <td style='text-align: left;'>${r.asin}</td>
                    <td style='text-align: left; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' title="${inv.itemName.replace(/"/g, '&quot;')}">${inv.itemName}</td>
                    <td style='background-color:#fffbe6;'>${salesPercentage}</td>
                    <td>${featuredStr}</td>

                    <!-- Ordered Product Sales 資料區塊 -->
                    <td>${r.sales.toFixed(2)}</td><td style="background-color:#e0f2fe;">${p.sales.toFixed(2)}</td><td style="background-color:#f0fdf4;">${y.sales.toFixed(2)}</td><td>${colorize(calcChange(r.sales, p.sales))}</td><td style='border-right:3px solid #000;'>${colorize(calcChange(r.sales, y.sales))}</td>

                    <!-- B2B 資料區塊 -->
                    <td style='background-color:#fff3cd;'>$${r.b2bSales.toFixed(2)}</td><td style='background-color:#fff3cd;border-right:3px solid #000;'>${r.b2bPct.toFixed(1)}%</td>

                    <!-- Sessions - Total 資料區塊 -->
                    <td>${r.sessions}</td><td style="background-color:#e0f2fe;">${p.sessions}</td><td style="background-color:#f0fdf4;">${y.sessions}</td><td>${colorize(calcChange(r.sessions, p.sessions))}</td><td style='border-right:3px solid #000;'>${colorize(calcChange(r.sessions, y.sessions))}</td>

                    <!-- Total Order Items 資料區塊 -->
                    <td>${r.items}</td><td style="background-color:#e0f2fe;">${p.items}</td><td style="background-color:#f0fdf4;">${y.items}</td><td>${colorize(calcChange(r.items, p.items))}</td><td style='border-right:3px solid #000;'>${colorize(calcChange(r.items, y.items))}</td>

                    <!-- Unit Session Percentage 資料區塊 -->
                    <td>${r.cvr.toFixed(2)}%</td><td style="background-color:#e0f2fe;">${p.cvr.toFixed(2)}%</td><td style="background-color:#f0fdf4;">${y.cvr.toFixed(2)}%</td><td>${colorize(calcChange(r.cvr, p.cvr, true))}</td><td style='border-right:3px solid #000;'>${colorize(calcChange(r.cvr, y.cvr, true))}</td>

                    <!-- 庫存資料 -->
                    <td style='background-color:#f0f9ff; border-left: 3px solid #000;'>${inv.available}</td>
                    <td style='background-color:#f0f9ff;'>${inv.supplyDays}</td>
                    <td style='background-color:#f0f9ff;'>${woc}</td>
                </tr>`;
            });
        }
        html += "</table><br>";
        return html;
    }

    function renderSingleTable(title, data, range, id) {
        let html = `<h2>${title} (${range.start} ~ ${range.end})</h2>`;
        html += `<table id="${id}" border='1' cellspacing='0' cellpadding='6' style='border-collapse:collapse; margin-top: 10px; font-size: 14px;'>`;
        html += "<tr style='text-align: center;'><th>Child ASIN</th><th>Featured Offer %</th><th>Sessions - Total</th><th>Total Order Items</th><th>Ordered Product Sales</th><th>Unit Session Percentage</th></tr>";

        if (data.length === 0) {
            html += `<tr><td colspan="6" style="text-align:center; padding: 20px;">此期間無資料</td></tr>`;
        } else {
            data.forEach(r => {
                const featuredStr = (r.featured == null) ? "-" : `${r.featured.toFixed(2)}%`;
                html += `<tr style='text-align: right;'>
                    <td style='text-align: left;'>${r.asin}</td><td>${featuredStr}</td>
                    <td>${r.sessions}</td><td>${r.items}</td><td>${r.sales.toFixed(2)}</td><td>${r.cvr.toFixed(2)}%</td>
                </tr>`;
            });
        }
        html += "</table><br>";
        return html;
    }

    async function handleCustomDateFetch() {
        const startDate = document.getElementById('customStartDate').value;
        const endDate = document.getElementById('customEndDate').value;
        const statusDiv = document.getElementById('customReportStatus');
        if (!startDate || !endDate) { alert("請選擇開始與結束日期"); return; }
        if (new Date(startDate) > new Date(endDate)) { alert("開始日期不能晚於結束日期"); return; }
        statusDiv.innerHTML = '正在抓取資料中，請稍候...';
        statusDiv.style.color = '#3b82f6';
        const ranges = getComparisonRanges(startDate, endDate);
        const [current, prev, yoy, inventoryData] = await Promise.all([
            fetchReport(ranges.current.start, ranges.current.end),
            fetchReport(ranges.prev.start, ranges.prev.end),
            fetchReport(ranges.yoy.start, ranges.yoy.end),
            fetchInventoryData()
        ]);
        if (current === null || prev === null || yoy === null) {
            statusDiv.innerHTML = "❌ 資料抓取失敗，請檢查主控台錯誤訊息 (F12)。";
            statusDiv.style.color = '#dc2626';
            return;
        }
        const aggCurrent = aggregateByASIN(current);
        const aggPrev = aggregateByASIN(prev);
        const aggYoY = aggregateByASIN(yoy);
        const tableHtml = renderComparisonTable("自訂時間段報表", "customRangeTable", aggCurrent, aggPrev, aggYoY, ranges.current, ranges.labels, inventoryData);
        const container = document.getElementById('customReportContainer');
        if (container) { container.innerHTML = tableHtml; }
        statusDiv.innerHTML = '自訂報表抓取完成！';
        statusDiv.style.color = '#16a34a';
    }

    function initializeReportButton() {
        if (document.getElementById("openReportBtn")) return;

        // 主報表按鈕
        const btn = document.createElement("button");
        btn.id = "openReportBtn";
        btn.innerText = "📊 Sales & Inventory Report";
        Object.assign(btn.style, {
            position: "fixed", top: "65px", right: "20px", zIndex: "999999",
            padding: "8px 14px", background: "#1f2937", color: "#fff",
            fontSize: "13px", border: "none", borderRadius: "6px", cursor: "pointer"
        });
        document.body.appendChild(btn);

        // [新增] YTD 趨勢按鈕
        const trendBtn = document.createElement("button");
        trendBtn.id = "downloadYTDTrendBtn";
        trendBtn.innerText = "📈 下載 ASIN 趨勢 (YTD)";
        Object.assign(trendBtn.style, {
            position: "fixed", top: "172px", right: "20px", zIndex: "999999",
            padding: "8px 14px", background: "#10b981", color: "#fff",
            fontSize: "13px", border: "none", borderRadius: "6px", cursor: "pointer"
        });
        document.body.appendChild(trendBtn);

        trendBtn.onclick = downloadYTDTrendCSV;

        btn.onclick = async () => {
            const statusDiv = document.createElement('div');
            Object.assign(statusDiv.style, {
                position: "fixed", top: "150px", right: "20px", zIndex: "1000000",
                padding: "10px", background: "#2563eb", color: "white",
                borderRadius: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
            });
            statusDiv.innerText = "🔄 正在抓取所有報表資料...";
            document.body.appendChild(statusDiv);
            try {
                const ranges = getDateRanges();
                const [last, prev, yoy, inventoryData] = await Promise.all([
                    fetchReport(ranges.lastMonth.start, ranges.lastMonth.end),
                    fetchReport(ranges.prevMonth.start, ranges.prevMonth.end),
                    fetchReport(ranges.lastYear.start, ranges.lastYear.end),
                    fetchInventoryData()
                ]);
                if (last === null || prev === null || yoy === null) { throw new Error("基礎銷售資料抓取失敗。"); }
                const aggLast = aggregateByASIN(last);
                const aggPrev = aggregateByASIN(prev);
                const aggYoY  = aggregateByASIN(yoy);
                const today = new Date();
                const maxDate = today.toISOString().split('T')[0];
                const newWin = window.open("", "_blank");
                newWin.document.write(`
                    <html><head><title>Sales & Inventory Report</title><style> body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; } </style></head>
                    <body>
                        <div style="padding: 15px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 20px; background-color: #f9f9f9;">
                            <h2>選擇任意時間段 (自動 WoW/DoD/PoP 比較)</h2>
                            <label for="customStartDate">開始日期:</label>
                            <input type="date" id="customStartDate" max="${maxDate}" style="margin-right: 10px; padding: 5px;">
                            <label for="customEndDate">結束日期:</label>
                            <input type="date" id="customEndDate" max="${maxDate}" style="margin-right: 10px; padding: 5px;">
                            <button id="fetchCustomReportBtn" style="padding: 6px 12px; border: none; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer;">抓取自訂報表</button>
                            <div id="customReportStatus" style="margin-top: 10px; font-weight: bold;"></div>
                            <div id="customReportContainer" style="margin-top: 15px;"></div>
                        </div>
                        <hr>
                `);
                const lastMonthLabels = { prev: 'MoM', yoy: 'YoY' };
                const lastMonthHtml = renderComparisonTable("上個月", "lastMonthTable", aggLast, aggPrev, aggYoY, ranges.lastMonth, lastMonthLabels, inventoryData);
                const prevMonthHtml = renderSingleTable("上上個月", aggPrev, ranges.prevMonth, "prevMonthTable");
                const lastYearHtml = renderSingleTable("去年同期", aggYoY, ranges.lastYear, "lastYearTable");
                newWin.document.write(lastMonthHtml);
                newWin.document.write(prevMonthHtml);
                newWin.document.write(lastYearHtml);
                newWin.document.write(`
                        <script>
                            window.downloadTableAsCSV = ${downloadTableAsCSV.toString()};
                            window.fetchSellerName = ${fetchSellerName.toString()};
                            window.deepFindLabel = ${deepFindLabel.toString()};
                            const handleCustomDateFetch = ${handleCustomDateFetch.toString()};
                            const getComparisonRanges = ${getComparisonRanges.toString()};
                            const fetchReport = ${fetchReport.toString()};
                            const aggregateByASIN = ${aggregateByASIN.toString()};
                            const renderComparisonTable = ${renderComparisonTable.toString()};
                            const colorize = ${colorize.toString()};
                            const calcChange = ${calcChange.toString()};
                            const findColumnIndex = ${findColumnIndex.toString()};
                            const toNumber = ${toNumber.toString()};
                            const getCsrfToken = ${getCsrfToken.toString()};
                            const fetchInventoryData = ${fetchInventoryData.toString()};
                            document.getElementById('fetchCustomReportBtn').addEventListener('click', handleCustomDateFetch);
                        <\/script>
                    </body></html>
                `);
                newWin.document.close();
                statusDiv.innerText = "✅ 報表產生完畢！";
                statusDiv.style.background = "#16a34a";
            } catch (error) {
                console.error("❌ 產生報表時發生錯誤:", error);
                alert("產生報表時發生錯誤，請檢查主控台。");
                statusDiv.innerText = "❌ 報表產生失敗！";
                statusDiv.style.background = "#dc2626";
            } finally {
                setTimeout(() => statusDiv.remove(), 3000);
            }
        };
    }

    // 主邏輯入口
    waitForElement('meta[name="anti-csrftoken-a2z"]')
        .then(() => {
            console.log("✅ CSRF Token meta tag found. Initializing report button.");
            initializeReportButton();
        })
        .catch(error => {
            console.error(error);
            console.warn("無法初始化報表按鈕，因為頁面缺少必要的安全令牌。");
        });
})();
