// ==UserScript==
// @name         Sales Dashboard Viewer
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Always displays the data popup in English, regardless of the site's language. CSV download is calculable. Button is stable.
// @match        https://www.sellercentral.amazon.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551930/Sales%20Dashboard%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/551930/Sales%20Dashboard%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Helper Functions ---
  const $css = (el, styles) => Object.assign(el.style, styles);
  const includesAnyCI = (hay, needles) => {
    const lowerHay = (hay || "").toLowerCase();
    return needles.some(needle => lowerHay.includes((needle || "").toLowerCase()));
  };
  const get = (obj, path, dflt) => path.split('.').reduce((o, k) => (o && k in o) ? o[k] : dflt, obj);

  // ---------- [NEW] Translation Layer ----------
  function translateToEnglish(label) {
    if (typeof label !== 'string') return label;

    // Static translations for table rows
    const staticMap = {
      "本年至今": "This year so far",
      "去年": "Last year",
      "變動百分比 去年": "% change from last year"
    };
    if (staticMap[label]) {
      return staticMap[label];
    }

    // Dynamic translations for "through" dates
    if (label.includes("截至")) {
      return label
        .replace("今年 截至", "This year through")
        .replace("去年 截至", "Last year through")
        .replace(/凌晨 (\d+)\s*點/, "$1 AM")
        .replace(/上午 (\d+)\s*點/, "$1 AM")
        .replace(/下午 (\d+)\s*點/, (match, hourStr) => {
          const hour = parseInt(hourStr, 10);
          return hour === 12 ? "12 PM" : `${hour} PM`;
        });
    }

    // Graph X-Axis (Months)
    const monthMap = {
      "1 月": "Jan", "2 月": "Feb", "3 月": "Mar", "4 月": "Apr", "5 月": "May", "6 月": "Jun",
      "7 月": "Jul", "8 月": "Aug", "9 月": "Sep", "10 月": "Oct", "11 月": "Nov", "12 月": "Dec"
    };
    if (monthMap[label]) {
      return monthMap[label];
    }

    // Return original if no translation matches (e.g., if it's already in English)
    return label;
  }


  // ---------- 抓 Seller Name ----------
  async function fetchSellerName() {
    try {
      const res = await fetch("https://www.sellercentral.amazon.dev/account-switcher/global-and-regional-account/merchantMarketplace?", {
        method: "GET", credentials: "include", headers: { accept: "application/json" }
      });
      const data = await res.json();
      return deepFindLabel(data) || "UnknownSeller";
    } catch (e) { console.error("❌ Seller Name API 失敗", e); return "UnknownSeller"; }
  }
  function deepFindLabel(obj) {
    if (!obj) return null;
    if (typeof obj === "object") {
      if (obj.label) return obj.label;
      for (let k in obj) { const found = deepFindLabel(obj[k]); if (found) return found; }
    }
    return null;
  }

  // ---------- CSV 處理 ----------
  const cleanForCsvCalculation = (val) => {
    if (typeof val !== 'string') return val;
    return val.replace(/[$,%]/g, '');
  };

  function downloadCSV(filename, columns, rows, winDoc) {
    const formatCell = (val) => {
      const str = String(val ?? "");
      if (str.includes(',') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const csvRows = rows.map(r =>
      columns.map(c => formatCell(cleanForCsvCalculation(r[c]))).join(",")
    );
    const csv = [columns.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = winDoc.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    winDoc.body.appendChild(link);
    link.click();
    link.remove();
  }

  // ---------- UI Rendering ----------
  function renderKVTable(title, obj) {
    let html = `<h3>${title}</h3><table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:13px;">`;
    html += `<tr><th style="background:#f2f2f2">Key</th><th style="background:#f2f2f2">Value</th></tr>`;
    Object.keys(obj || {}).forEach(k => { html += `<tr><td>${k}</td><td>${obj[k]}</td></tr>`; });
    html += `</table><br/>`;
    return html;
  }
  const fmtPercent = val => (val == null || val === "" || isNaN(val)) ? "" : `${Number(val).toFixed(2)}%`;
  const fmtDollar = val => (val == null || val === "" || isNaN(val)) ? "" : `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  function renderTable(title, columns, rows, csvId) {
    const tableId = csvId.replace(/\s+/g, "_");
    let html = `<h3 style="display:flex;justify-content:space-between;align-items:center;"><span>${title}</span><button id="dl_${tableId}" style="padding:4px 8px;background:#2563eb;color:white;border:none;border-radius:4px;cursor:pointer;">📥 Download CSV</button></h3>`;
    html += `<table id="${tableId}" border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:13px;width:100%;margin-bottom:10px;">`;
    html += "<tr>" + columns.map(c => `<th style='background:#f2f2f2;text-align:left;'>${c}</th>`).join("") + "</tr>";
    rows.forEach(r => { html += "<tr>" + columns.map(c => `<td>${r[c] ?? ""}</td>`).join("") + "</tr>"; });
    html += "</table><br>";
    return html;
  }

  // ---------- 主要的點擊後執行的邏輯 ----------
  async function handleButtonClick() {
    const win = window.open("", "_blank", "width=1200,height=900,scrollbars=yes");
    win.document.open();
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Sales Dashboard</title></head><body style="font-family:Arial, sans-serif;"><h2>📊 Sales Dashboard</h2><div id="content">Loading data...</div></body></html>`);
    win.document.close();
    const content = () => win.document.getElementById("content");

    try {
      const [sellerName, today] = [await fetchSellerName(), new Date().toISOString().split("T")[0]];
      const res = await fetch("https://www.sellercentral.amazon.dev/business-reports/api", {
        method: "POST", credentials: "include", headers: { "accept": "*/*", "content-type": "application/json" },
        body: JSON.stringify({
          operationName: "salesDashboardDataQuery",
          variables: { input: { dashboardMode: "YEAR_TO_DATE", breakdownType: "MARKETPLACE_TOTAL", fulfillment: "BOTH", fromDate: today, endDate: today, isSundayStart: false } },
          query: `query salesDashboardDataQuery($input: GetSalesDashboardDataInput) { getSalesDashboardData(input: $input) { snapshotBarResponse { avgSalesPerOrderItem avgUnitsPerOrderItem orderedProductSales unitsOrdered totalOrderItems } compareSalesChartResponse { XAxisPoints seriesInfo { label orderedProductSalesSeriesPoints unitsOrderedSeriesPoints } } compareSalesTableResponse { salesRows { avgSalesPerOrderItem avgUnitsPerOrderItem label unitsOrdered totalOrderItems orderedProductSales } percentChangeBlocks { percentChangeRow { avgSalesPerOrderItem avgUnitsPerOrderItem label orderedProductSales totalOrderItems unitsOrdered } salesRows { avgSalesPerOrderItem avgUnitsPerOrderItem label orderedProductSales totalOrderItems unitsOrdered } } } } }`
        })
      });

      const json = await res.json();
      const dash = get(json, "data.getSalesDashboardData");
      if (!dash) { content().innerHTML = `<p style="color:red;">❌ 沒有資料</p>`; return; }

      let html = "";
      html += renderKVTable("Filter Selection", { dashboardMode: "YEAR_TO_DATE" });
      html += renderKVTable("Sales Snapshot", dash.snapshotBarResponse || {});

      const chart = dash.compareSalesChartResponse;
      let columnsG = [], rowsG = [];
      if (chart && Array.isArray(chart.seriesInfo)) {
        const x = chart.XAxisPoints || [];
        const sInfo = chart.seriesInfo;
        const thisYear = sInfo.find(s => includesAnyCI(s.label, ["this year so far", "本年至今"])) || sInfo[0];
        const lastYear = sInfo.find(s => includesAnyCI(s.label, ["last year", "去年"])) || sInfo[1];
        columnsG = ["Time", "This year so far (Sales)", "Last year (Sales)", "YoY (Sales)", "This year so far (Units ordered)", "Last year (Units ordered)", "YoY (Units)"];
        rowsG = x.map((pt, i) => {
          const thisSales = Number(thisYear.orderedProductSalesSeriesPoints?.[i] ?? 0);
          const lastSales = Number(lastYear.orderedProductSalesSeriesPoints?.[i] ?? 0);
          const thisUnits = Number(thisYear.unitsOrderedSeriesPoints?.[i] ?? 0);
          const lastUnits = Number(lastYear.unitsOrderedSeriesPoints?.[i] ?? 0);
          const yoySales = lastSales ? ((thisSales - lastSales) / lastSales) * 100 : null;
          const yoyUnits = lastUnits ? ((thisUnits - lastUnits) / lastUnits) * 100 : null;
          return {
            "Time": translateToEnglish(pt), // MODIFIED: Translate month to English
            "This year so far (Sales)": fmtDollar(thisSales),
            "Last year (Sales)": fmtDollar(lastSales),
            "YoY (Sales)": fmtPercent(yoySales),
            "This year so far (Units ordered)": thisUnits.toLocaleString(),
            "Last year (Units ordered)": lastUnits.toLocaleString(),
            "YoY (Units)": fmtPercent(yoyUnits)
          };
        });
        html += renderTable("Compare Sales - Graph View (Sales + Units + YoY)", columnsG, rowsG, "graph_csv");
      }

      const table = dash.compareSalesTableResponse;
      let columnsT = [], rowsT = [];
      if (table) {
        columnsT = ["Row", "Total Order Items", "Units Ordered", "Ordered Product Sales", "Average units/order item", "Average sales/order item"];
        function toRow(src) {
          if (!src) return null;
          const isPercentRow = includesAnyCI(src.label, ['% change', '變動百分比']);
          return {
            "Row": translateToEnglish(src.label), // MODIFIED: Translate row label to English
            "Total Order Items": isPercentRow ? fmtPercent(src.totalOrderItems) : (src.totalOrderItems ?? 0).toLocaleString(),
            "Units Ordered": isPercentRow ? fmtPercent(src.unitsOrdered) : (src.unitsOrdered ?? 0).toLocaleString(),
            "Ordered Product Sales": isPercentRow ? fmtPercent(src.orderedProductSales) : fmtDollar(src.orderedProductSales),
            "Average units/order item": isPercentRow ? fmtPercent(src.avgUnitsPerOrderItem) : Number(src.avgUnitsPerOrderItem ?? 0).toFixed(2),
            "Average sales/order item": isPercentRow ? fmtPercent(src.avgSalesPerOrderItem) : fmtDollar(src.avgSalesPerOrderItem)
          };
        }
        const findRow = (labelParts) => {
          const allRows = [...(table.salesRows || []), ...(get(table, 'percentChangeBlocks.0.salesRows') || []), get(table, 'percentChangeBlocks.0.percentChangeRow')].filter(Boolean);
          return allRows.find(r => includesAnyCI(r.label, labelParts));
        };
        rowsT = [
          toRow(findRow(["this year so far", "本年至今"])),
          toRow(findRow(["last year", "去年"])),
          toRow(findRow(["% change from last year", "變動百分比"])),
          toRow(findRow(["this year through", "今年 截至"])),
          toRow(findRow(["last year through", "去年 截至"]))
        ].filter(Boolean);
        html += renderTable("Compare Sales - Table View", columnsT, rowsT, "table_csv");
      }

      content().innerHTML = html;
      const nowDate = new Date().toISOString().split("T")[0];
      const sellerClean = sellerName.replace(/[^a-zA-Z0-9_-]/g, "_");
      const graphBtn = win.document.getElementById("dl_graph_csv");
      if (graphBtn) { graphBtn.onclick = () => downloadCSV(`${nowDate}_${sellerClean}_Month_YoY.csv`, columnsG, rowsG, win.document); }
      const tableBtn = win.document.getElementById("dl_table_csv");
      if (tableBtn) { tableBtn.onclick = () => downloadCSV(`${nowDate}_${sellerClean}_Total_Year_Change.csv`, columnsT, rowsT, win.document); }

    } catch (e) { content().innerHTML = `<p style="color:red;">❌ 錯誤：${e.message}</p>`; }
  }

  // ---------- 按鈕守護機制 ----------
  const BUTTON_ID = 'my-super-stable-dashboard-button-21';
  function ensureButtonExists() {
    if (document.getElementById(BUTTON_ID)) { return; }
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.textContent = "Sales Dashboard";
    $css(btn, { position: "fixed", top: "137px", right: "20px", zIndex: 99999, padding: "8px 14px", background: "#232f3e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" });
    btn.addEventListener("click", handleButtonClick);
    document.body.appendChild(btn);
  }
  setInterval(ensureButtonExists, 500);

})();