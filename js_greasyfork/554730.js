// ==UserScript==
// @name         亞馬遜廣告分析工具 (v10.13.9 完整修復版)
// @namespace    http://tampermonkey.net/
// @version      10.13.9
// @description  【全功能修復】修復業務報告總覽顯示問題(回退至v10.13邏輯)；保留廣告活動PoP環比分析(BPS/%)與ASIN投入產出分析功能。
// @author       Gemini (Dashboard Designer & Analyst) / Module Refactored by Gemini
// @match        https://gs.amazon.com.tw/onboarding-service*
// @match        https://sellercentral.amazon.com/*
// @match        https://advertising.amazon.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGOTkwMCIgd2lkd2g9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ0MTdMMTQuMTcgNXptLTYuMzUgMTFMMTYgNy44MyAxOC4xNyAxMEw5LjgzIDE4LE4uMTcgIDcgMThsLjgyLTQuMTV6TTIwLjcxIDcuNDFsLTIuNTQtMi4xZMtLjM5LS43OTEtMS4wMi0uMzktMS40MSAwbC0xLjI5IDEuMjkgNCA0IDEuMjktMS44jjjDy5Yy4zOS0uMzguMzktMS4wMiAwLTEuNDF6Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/554730/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v10139%20%E5%AE%8C%E6%95%B4%E4%BF%AE%E5%BE%A9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554730/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v10139%20%E5%AE%8C%E6%95%B4%E4%BF%AE%E5%BE%A9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 啟動按鈕的樣式
    GM_addStyle(`
        #gemini-report-banner { position: fixed; top: 0; left: 0; width: 100%; background-color: #232f3e; color: #fff; padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 2147483647 !important; display: flex; align-items: center; justify-content: center; font-family: 'Noto Sans TC', sans-serif; }
        #gemini-report-banner span { font-size: 14px; font-weight: 500; margin-right: 15px; }
        #gemini-report-generator-btn { background: linear-gradient(to bottom, #f7dfa5, #f0c14b); color: #111; border: 1px solid #a88734; border-radius: 4px; padding: 6px 12px; font-size: 14px; font-weight: bold; text-shadow: 0 1px 0 rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s ease; }
        #gemini-report-generator-btn:hover { background: linear-gradient(to bottom, #f5d78e, #eeb933); border-color: #9c7e31; }
        body { margin-top: 50px !important; }
    `);

    // --- 模組化 HTML 生成函式 ---

    function getDashboardCSS() {
        return `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
            :root {
                --amazon-orange: #FF9900; --amazon-yellow: #f5c242; --amazon-blue: #232f3e;
                --dark-bg: #131921; --nav-hover: #232f3e; --light-text: #FFFFFF;
                --dark-text: #111; --gray-text: #6c757d; --border-color: #dee2e6;
                --card-shadow: 0 4px 12px rgba(0,0,0,0.08); --main-bg: #f3f4f6;
                --natural-color: #28a745; --ad-color: #007bff;
            }
            body { font-family: 'Noto Sans TC', sans-serif; margin: 0; background-color: var(--main-bg); color: var(--dark-text); display: flex; transition: padding-left 0.3s ease; scroll-behavior: smooth; }
            #side-nav { position: fixed; top: 0; left: 0; width: 260px; height: 100vh; background-color: var(--dark-bg); color: var(--light-text); display: flex; flex-direction: column; padding: 20px 10px; box-sizing: border-box; transition: width 0.3s ease; z-index: 1000; }
            .nav-header { text-align: center; padding: 0 10px 20px 10px; border-bottom: 1px solid var(--nav-hover); }
            .nav-header h2 { margin: 0; font-size: 1.2em; color: var(--amazon-orange); }
            .nav-header p { margin: 5px 0 0; font-size: 0.8em; color: var(--gray-text); }
            #upload-section { padding: 8px 8px 4px 8px; }
            #upload-section .control-group { margin-bottom: 5px; }
            #upload-section label { font-size: 0.7em; font-weight: 500; color: var(--light-text); margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between; }
            #upload-section input[type="file"] { width: 100%; padding: 3px; border-radius: 4px; border: 1px solid var(--gray-text); font-size: 0.7em; color: var(--gray-text); background-color: var(--nav-hover); }
            input[type="file"]::file-selector-button { background-color: var(--amazon-orange); color: var(--dark-bg); border: none; padding: 4px 8px; border-radius: 3px; font-weight: bold; cursor: pointer; margin-right: 8px; }
            .nav-links { list-style: none; padding: 0; margin: 0; flex-grow: 1; overflow-y: auto; }
            .nav-links li .nav-btn { display: flex; align-items: center; width: 100%; padding: 12px 15px; margin-bottom: 5px; border: none; background: none; color: var(--light-text); font-size: 0.9em; text-align: left; cursor: pointer; border-radius: 6px; transition: background-color 0.2s ease, color 0.2s ease; }
            .nav-links li .nav-btn .nav-icon { margin-right: 15px; width: 20px; height: 20px; opacity: 0.8; flex-shrink: 0; }
            .nav-links li .nav-btn:hover { background-color: var(--nav-hover); }
            .nav-links li .nav-btn.active { background-color: var(--amazon-orange); color: var(--dark-bg); font-weight: 700; }
            .nav-footer { padding: 15px 0 0 0; margin: 10px 0 0 0; border-top: 1px solid var(--nav-hover); flex-shrink: 0; }
            .nav-footer .nav-btn { display: flex; align-items: center; width: 100%; padding: 12px 15px; border: none; background: none; color: var(--light-text); font-size: 0.9em; text-align: left; cursor: pointer; border-radius: 6px; transition: background-color 0.2s ease, color 0.2s ease; }
            .nav-footer .nav-btn:hover { background-color: var(--nav-hover); }
            .nav-footer .nav-icon { margin-right: 15px; width: 20px; height: 20px; opacity: 0.8; flex-shrink: 0; }
            #nav-toggle-btn { position: absolute; top: 15px; right: -15px; width: 30px; height: 30px; border-radius: 50%; background-color: var(--nav-hover); color: var(--light-text); border: 2px solid var(--main-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1001; transition: transform 0.3s ease; }
            #side-nav.collapsed { width: 80px; }
            #side-nav.collapsed .nav-header h2, #side-nav.collapsed .nav-header p, #side-nav.collapsed #upload-section, #side-nav.collapsed .nav-text, #side-nav.collapsed .nav-footer { display: none; }
            #side-nav.collapsed #nav-toggle-btn { transform: rotate(180deg); }
            #main-content { width: 100%; padding: 25px; padding-left: calc(260px + 25px); transition: padding-left 0.3s ease; box-sizing: border-box; }
            body.nav-collapsed #main-content { padding-left: calc(80px + 25px); }
            .page-content { display: none; }
            .page-content.active { display: block; }
            .page-header { margin-bottom: 25px; }
            .page-header h1 { margin: 0; font-size: 2em; color: var(--dark-bg); }
            .card { background-color: var(--light-text); border-radius: 8px; box-shadow: var(--card-shadow); padding: 20px; margin-bottom: 25px; }
            .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;}
            .card-header h3 { margin: 0; font-size: 1.2em; color: var(--amazon-blue); }
            .placeholder { text-align: center; color: #555; padding: 50px; border: 2px dashed var(--border-color); border-radius: 5px; background-color: #fafafa; }
            .control-section-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 12px; }
            .control-group label { display: block; font-weight: 500; font-size: 0.85em; margin-bottom: 4px; }
            input[type="number"], select { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; box-sizing: border-box; background-color: #fff;}
            .clear-btn { font-size: 0.8em; font-weight: normal; color: #007bff; background: none; border: none; cursor: pointer; padding: 2px 5px;}
            .dashboard-grid { display: grid; gap: 15px; }
            #campaign-overview-section .dashboard-grid, #account-overview-section .dashboard-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
            .metric-card { background-color: var(--light-text); border: 1px solid #e9ecef; border-left: 4px solid var(--amazon-blue); border-radius: 8px; padding: 15px; text-align: center; }
            .metric-value { font-size: 2em; font-weight: 700; color: var(--amazon-orange); line-height: 1.1; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
            #campaign-overview-content .metric-value, #account-overview-content .metric-value { font-size: 1.7em; white-space: normal; line-height: 1.2; overflow: visible; word-break: break-all; }
            #campaign-overview-content .total-metrics-grid .metric-value { font-size: 1.5em; }
            .metric-label { font-size: 0.85em; font-weight: 500; color: var(--dark-text); }
            .table-container { max-height: 70vh; overflow: auto; margin-top: 10px; border: 1px solid var(--border-color); border-radius: 5px; }
            .result-table { width: 100%; border-collapse: collapse; font-size: 0.85em; table-layout: auto; }
            .result-table th, .result-table td { border: 1px solid var(--border-color); padding: 10px 12px; text-align: left; vertical-align: middle; }
            .result-table th { background-color: var(--amazon-blue); color: #fff; position: sticky; top: 0; z-index: 1;}
            .result-table th[onclick] { cursor: pointer; } .result-table th[onclick]:hover { background-color: #31445a; }
            .result-table td:not(:first-child) { text-align: right; }
            .result-table th:first-child, .result-table td:first-child { text-align: left; white-space: normal; }
            .overview-viz-container { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; align-items: start; margin-bottom: 25px; }
            .viz-chart-card { background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 15px; border-radius: 8px; }
            .viz-chart-card h4 { margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1em; }
            .type-donut-chart-area { display: flex; align-items: center; justify-content: center; gap: 20px; height: 160px; position: relative; }
            details { border: 1px solid var(--border-color); border-radius: 5px; }
            details > summary { cursor: pointer; padding: 12px 15px; background-color: #f8f9fa; font-weight: bold; border-radius: 5px; }
            details[open] > summary { border-radius: 5px 5px 0 0; }
            .analysis-section { margin-top: 25px; }
            .analysis-section h4 { color: var(--amazon-blue); font-size: 1.2em; border-bottom: 2px solid var(--amazon-orange); padding-bottom: 5px; }
            .analysis-section p, .analysis-section ul { font-size: 0.9em; color: #555; margin-top: 5px; margin-bottom: 15px; line-height: 1.6; }
            .start-analysis-btn { padding: 10px 20px; font-size: 1em; font-weight: bold; color: #fff; background-color: var(--amazon-orange); border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; transition: background-color 0.2s; }
            .start-analysis-btn:hover { background-color: #e68a00; }
            .start-analysis-btn:disabled { background-color: #ccc; cursor: not-allowed; }
            .suggestion-wrapper { text-align: left; white-space: normal; }
            .suggestion-block { margin-bottom: 8px; }
            .suggestion-title { font-weight: 700; color: var(--amazon-blue); display: block; margin-bottom: 4px; font-size: 0.9em; }
            .result-table .suggestion-wrapper ul, .result-table .suggestion-wrapper ol { margin: 0; padding-left: 18px; line-height: 1.5; font-size: 0.9em;}
            #keyword-grade-summary { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; background-color: #f8f9fa; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 20px;}
            .avg-grade-container { text-align: center; border-right: 1px solid var(--border-color); padding-right: 20px; }
            .avg-grade-display { font-size: 3em; font-weight: 700; color: var(--amazon-orange); line-height: 1; }
            .avg-grade-level { font-size: 1.5em; font-weight: bold; color: var(--amazon-blue); margin-top: 5px; }
            .avg-grade-comment { font-size: 0.9em; color: var(--gray-text); margin-top: 8px; }
            .grade-dist-container h4 { margin: 0 0 15px 0; text-align: left; color: #333; font-size: 1em; }
            .grade-dist-list { list-style: none; padding: 0; margin: 0; }
            .grade-dist-item { display: flex; align-items: center; margin-bottom: 5px; font-size: 0.85em; }
            .grade-dist-label { width: 80px; font-weight: 500; }
            .grade-dist-bar-bg { flex-grow: 1; background-color: #e9ecef; border-radius: 4px; height: 16px; }
            .grade-dist-bar { height: 100%; background-color: var(--amazon-orange); border-radius: 4px; transition: width 0.5s ease-out; }
            .grade-dist-value { width: 50px; text-align: right; font-weight: bold; color: var(--amazon-blue); }
            .analysis-section .result-table { font-size: 0.83em; table-layout: fixed; width: 100%; }
            .analysis-section .result-table th:nth-child(1) { width: 16%; } .analysis-section .result-table th:nth-child(n+2):nth-child(-n+9) { width: 5%; } .analysis-section .result-table th:nth-child(10) { width: 7%; } .analysis-section .result-table th:nth-child(11) { width: 32%; }
            #page-asin-analysis .analysis-section .result-table { font-size: 0.85em; table-layout: auto; }
            .summary-section { margin-top: 25px; background: #f8f9fa; border: 1px solid var(--border-color); border-radius: 6px; padding: 20px; }
            .summary-section h4 { margin: 0 0 15px 0; font-size: 1.2em; color: var(--amazon-blue); border-bottom: 2px solid var(--amazon-orange); padding-bottom: 8px;}
            .summary-section ul { list-style-type: none; padding-left: 0; margin: 0; }
            .summary-section li { margin-bottom: 12px; line-height: 1.6; display: flex; align-items: flex-start; }
            .summary-icon { font-size: 1.2em; margin-right: 12px; margin-top: 2px; }
            .summary-text b { color: var(--dark-text); }
            .campaign-analysis-item { border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 15px; }
            .campaign-analysis-item summary { cursor: pointer; padding: 12px 15px; background-color: #f8f9fa; font-weight: bold; border-radius: 5px; display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; overflow: hidden; }
            .campaign-analysis-item[open] > summary { background-color: #e9ecef; border-radius: 5px 5px 0 0; }
            .campaign-analysis-item .campaign-title { font-size: 1.1em; color: var(--amazon-blue); flex-grow: 1; flex-shrink: 1; min-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .campaign-analysis-item .campaign-tag { font-size: 0.8em; padding: 3px 8px; border-radius: 4px; color: white; font-weight: normal; flex-shrink: 0; }
            .campaign-analysis-item .campaign-tag.auto { background-color: #007bff; }
            .campaign-analysis-item .campaign-tag.manual { background-color: var(--amazon-orange); }
            .campaign-analysis-item .campaign-metric { font-size: 0.9em; font-weight: normal; color: #555; background-color: #e9ecef; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; white-space: nowrap; }
            .campaign-analysis-item .analysis-content { padding: 20px; display: block; border-top: 1px solid var(--border-color); }
            .campaign-analysis-item .analysis-block h4 { color: var(--dark-text); font-size: 1.1em; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 0; }
            .campaign-analysis-item .analysis-block p { font-size: 0.9em; line-height: 1.6; margin-top: 10px; }
            .campaign-analysis-item .analysis-block ul { margin: 10px 0 0 0; padding-left: 20px; font-size: 0.9em; line-height: 1.7; }
            .campaign-analysis-item .analysis-block li { margin-bottom: 8px; }
            #campaign-filter-controls, #asin-filter-controls { display: flex; gap: 10px; flex-wrap: wrap; }
            .campaign-filter-btn, .asin-filter-btn { padding: 8px 15px; border: 1px solid var(--border-color); border-radius: 20px; background-color: #f8f9fa; color: var(--dark-text); font-size: 0.9em; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
            .campaign-filter-btn:hover, .asin-filter-btn:hover { background-color: #e9ecef; }
            .campaign-filter-btn.active, .asin-filter-btn.active { color: #fff; background-color: var(--amazon-blue); border-color: var(--amazon-blue); }
            .campaign-level-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; flex-shrink: 0; }
            .level-Green { background-color: #28a745; } .level-Orange { background-color: #fd7e14; } .level-Red { background-color: #dc3545; }
            .campaign-metrics-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; font-size: 0.9em; }
            .campaign-metrics-table th, .campaign-metrics-table td { border: 1px solid var(--border-color); padding: 8px; text-align: center; }
            .campaign-metrics-table th { background-color: #f8f9fa; font-weight: 600; }
            .campaign-metrics-table td { background-color: #fff; }
            .tooltip { position: relative; display: inline-block; border-bottom: 1px dotted var(--dark-text); cursor: help; }
            .tooltip .tooltiptext { visibility: hidden; width: 320px; background-color: #333; color: #fff; text-align: left; border-radius: 6px; padding: 8px 12px; position: absolute; z-index: 10; bottom: 125%; left: 50%; margin-left: -120px; opacity: 0; transition: opacity 0.3s; font-size: 0.85em; line-height: 1.5; font-weight: normal; }
            .tooltip .tooltiptext::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #333 transparent transparent transparent; }
            .tooltip:hover .tooltiptext { visibility: visible; opacity: 1; }
            .tooltip .tooltiptext b { color: var(--amazon-yellow); }
            .sidetip { position: relative; display: inline-block; cursor: help; background-color: var(--gray-text); color: var(--dark-bg); border-radius: 50%; width: 16px; height: 16px; font-size: 11px; line-height: 16px; text-align: center; font-weight: bold; flex-shrink: 0; }
            .sidetip .sidetiptext { visibility: hidden; width: 260px; background-color: #f1f2f4; color: var(--dark-text); text-align: left; border-radius: 6px; padding: 10px; position: absolute; z-index: 1001; bottom: 50%; left: 130%; transform: translateY(50%); opacity: 0; transition: opacity 0.2s ease-in-out; font-size: 12px; font-weight: 500; line-height: 1.6; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }
            .sidetip .sidetiptext::before { content: ''; position: absolute; top: 50%; right: 100%; margin-top: -6px; border-width: 6px; border-style: solid; border-color: transparent #f1f2f4 transparent transparent; }
            .sidetip:hover .sidetiptext { visibility: visible; opacity: 1; }
            #campaign-overview-content .total-metrics-grid { grid-template-columns: repeat(5, 1fr); }
            #campaign-overview-content .avg-metrics-grid { grid-template-columns: repeat(5, 1fr); }
            .campaign-type-performance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 25px;}
            .campaign-type-performance-grid .viz-chart-card { display: flex; flex-direction: column; }
            .campaign-type-performance-grid .type-donut-chart-area { flex-grow: 1; }
            .campaign-type-performance-grid .donut-legend { width: auto; }
            .campaign-type-performance-grid .donut-legend li { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
            .campaign-type-performance-grid .legend-label { margin-left: 8px; flex-grow: 1; }
            .campaign-type-performance-grid .legend-percent { font-weight: bold; }
            #export-keyword-excel-btn { margin-top: 0; background: #6c757d; font-size: 0.8em; padding: 8px 15px; }
            #export-keyword-excel-btn:hover { background: #5a6268; }
            #export-keyword-excel-btn:disabled { background: #ccc; cursor: not-allowed; }
            #keyword-filter-controls { display: flex; gap: 10px; flex-wrap: wrap; padding: 0px 0px 15px 0px; }
            .keyword-filter-btn { padding: 8px 15px; border: 1px solid var(--border-color); border-radius: 20px; background-color: #f8f9fa; color: var(--dark-text); font-size: 0.9em; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
            .keyword-filter-btn:hover { background-color: #e9ecef; }
            .keyword-filter-btn.active { color: #fff; background-color: var(--amazon-blue); border-color: var(--amazon-blue); }
            #grade-explanation-details { padding: 15px 0 0 0; margin-top: 15px; border-top: 1px solid #eee; font-size: 0.9em; line-height: 1.8; }
            #grade-explanation-details .tooltip { font-weight: 700; }
            .keyword-analysis-category, .asin-analysis-category { display: block; }
            .campaign-chart-container, #tacos-chart-container { max-width: 70%; margin: 0 auto 20px auto; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; position: relative; }
            .chart-summary-value { position: absolute; top: 10px; right: 10px; background-color: rgba(240, 240, 240, 0.8); padding: 4px 8px; border-radius: 5px; font-size: 0.9em; font-weight: bold; color: var(--amazon-blue); }
            #campaign-chart-controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 15px; flex-wrap: wrap; }
            .chart-control-item { display: flex; align-items: center; cursor: pointer; font-size: 0.9em; }
            .chart-control-item input { margin-right: 6px; }
            .donut-charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 15px; }
            .donut-chart-wrapper { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center; }
            .donut-chart-wrapper h4 { margin: 0 0 15px 0; font-size: 1.1em; color: #333; }
            .donut-viz-container { position: relative; width: 140px; height: 140px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
            .donut-chart-viz { position: relative; width: 100%; height: 100%; border-radius: 50%; }
            .donut-chart-viz::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 65%; height: 65%; background: #f8f9fa; border-radius: 50%; z-index: 1; }
            .donut-chart-center-label { position: absolute; font-size: 1.6em; font-weight: 700; color: var(--natural-color); z-index: 2; }
            .donut-chart-legend { list-style: none; padding: 0; margin: 15px 0 0 0; text-align: left; font-size: 0.85em; }
            .donut-chart-legend li { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; }
            .legend-label-group { display: flex; align-items: center; }
            .legend-color-box { width: 12px; height: 12px; border-radius: 3px; margin-right: 8px; }
            .legend-value { font-weight: bold; }
            .legend-percent { color: var(--gray-text); margin-left: 5px; }
            /* [v10.10] ASIN Spend Analyzer specific styles - MODIFIED */
            #analyzer-controls { display: flex; gap: 20px; align-items: center; margin: 20px 0; }
            #analyzer-controls label, #analyzer-controls select { font-size: 14px; }
            #campaign-selector { padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex-grow: 1; }
            #charts-grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .chart-wrapper { min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #888; border: 2px dashed #ddd; border-radius: 5px; padding: 20px; position: relative; }
            #skewed-campaigns-list { margin-top: 25px; padding: 20px; background-color: #f8f9fa; border: 1px solid var(--border-color); border-radius: 8px; }
            #skewed-campaigns-list h4 { margin: 0 0 15px 0; font-size: 1.1em; color: var(--amazon-blue); border-bottom: 1px solid #eee; padding-bottom: 10px; }
            #skewed-campaigns-list ul { list-style-type: none; padding-left: 0; margin: 0; }
            #skewed-campaigns-list li { margin-bottom: 10px; font-size: 0.9em; line-height: 1.5; }
            #skewed-campaigns-list li strong { color: var(--dark-text); }


            @media (max-width: 900px) {
                .campaign-chart-container, #tacos-chart-container { max-width: 100%; }
                .campaign-analysis-item .analysis-content { grid-template-columns: 1fr; }
                .overview-viz-container, .campaign-type-performance-grid { grid-template-columns: 1fr; }
                .donut-charts-grid { grid-template-columns: 1fr; }
                /* [v10.10] Responsive chart grid */
                #charts-grid-container { grid-template-columns: 1fr; }
            }
        </style>
        `;
    }

    // [v10.8] 負責生成側邊導覽列 (Add CSV hint)
    function getSideNavHTML() {
        return `
        <nav id="side-nav">
            <button id="nav-toggle-btn" title="收合/展開導覽列"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button>
            <div class="nav-header"><h2>分析儀表板</h2><p>v10.13.9</p></div>
            <div id="upload-section">
                <div class="control-group">
                    <label for="business-file">上傳業務報告 (限CSV檔) <span class="sidetip">?<span class="sidetiptext">下載路徑：賣家後台>左上角選單>Reports> 業務報告> 按日期>銷售和流量>下載需分析的時間區間(需對齊廣告活動報告分析區間)>下載 </span></span></label>
                    <input type="file" id="business-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="asin-file">上傳廣告產品報告 (限CSV檔) <span class="sidetip">?<span class="sidetiptext">下載路徑：廣告後台>左邊選單>衡量與報告>推廣廣告報告>建立報告> 報告類型：廣告產品>執行報告>下載</span></span></label>
                    <input type="file" id="asin-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="campaign-file">上傳廣告活動報告 (限CSV檔) <span class="sidetip">?<span class="sidetiptext">下載路徑：廣告後台>左邊選單>衡量與報告>推廣廣告報告>建立報告> 報告類型：廣告活動>(若希望分析TACOS，時間單位請選"每月"，且"報告期間"對齊業務報告的時間區間)>執行報告>下載</span></span></label>
                    <input type="file" id="campaign-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="keyword-file">上傳搜尋字詞報告 (限CSV檔) <span class="sidetip">?<span class="sidetiptext">下載路徑：廣告後台>左邊選單>衡量與報告>推廣廣告報告>建立報告> 報告類型：搜尋字詞>執行報告>下載</span></span></label>
                    <input type="file" id="keyword-file" accept=".csv,.txt">
                </div>
            </div>
            <ul class="nav-links">
                <li><button class="nav-btn active" data-target="overview"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><span class="nav-text">整體績效概覽</span></button></li>
                <li><button class="nav-btn" data-target="asin-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><span class="nav-text">ASIN績效分析</span></button></li>
                <li><button class="nav-btn" data-target="campaign-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2-H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg><span class="nav-text">廣告活動分析</span></button></li>
                <li><button class="nav-btn" data-target="analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg><span class="nav-text">關鍵字績效分析</span></button></li>
            </ul>
            <div class="nav-footer">
                 <button id="export-report-btn" class="nav-btn"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2-H5z"/></svg><span class="nav-text">匯出HTML報告</span></button>
            </div>
        </nav>
        `;
    }

    // [v10.7] 負責生成「概覽」頁面
    function getOverviewPageHTML() {
        return `
        <div id="page-overview" class="page-content active">
            <div class="page-header"><h1>整體績效概覽</h1></div>
            <div class="card" id="account-overview-section">
                <div class="card-header"><h3>帳戶績效總覽</h3></div>
                <div id="account-overview-content">
                    <div class="placeholder"><p>請先上傳「同樣時間區間」的「業務報告」以及「廣告活動報告」以顯示總覽。</p></div>
                </div>
            </div>
            <div class="card" id="campaign-overview-section">
                <div class="card-header"><h3>廣告活動總覽</h3></div>
                <div id="campaign-overview-content">
                    <div class="placeholder"><p>請先上傳「廣告活動報告」以顯示總覽。</p></div>
                </div>
            </div>
            <div class="card" id="overall-summary-section">
                 <div class="placeholder"><p>請先上傳「業務報告」與「廣告活動報告」以生成總體結論。</p></div>
            </div>
        </div>
        `;
    }

    // 負責生成「關鍵字績效分析」頁面
    function getKeywordAnalysisPageHTML() {
        return `
        <div id="page-analysis" class="page-content">
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h1>關鍵字績效分析</h1>
                <button id="export-keyword-excel-btn" class="start-analysis-btn" disabled>匯出關鍵字分析報告</button>
            </div>
            <div id="keyword-analysis-container">
                <div class="card">
                    <div class="placeholder"><p>請先上傳「消費者搜尋字詞報告」以啟用此分析頁面。</p></div>
                </div>
            </div>
        </div>
        `;
    }

    // 負責生成「廣告活動分析」頁面
    function getCampaignAnalysisPageHTML() {
        return `
        <div id="page-campaign-analysis" class="page-content">
            <div class="page-header"><h1>廣告活動分析與優化建議</h1></div>
            <div id="campaign-analysis-content">
                <div class="placeholder"><p>請先上傳「廣告活動報告」。</p></div>
            </div>
        </div>
        `;
    }

    // [v10.10] 負責生成「ASIN 績效分析」頁面 - MODIFIED
    function getAsinAnalysisPageHTML() {
        return `
        <div id="page-asin-analysis" class="page-content">
             <div class="page-header"><h1>ASIN 績效分析</h1></div>
             <div class="card">
                <div class="card-header"><h3>ASIN 花費與銷售佔比分析</h3></div>
                <div id="analyzer-controls">
                    <label for="campaign-selector">選擇廣告活動:</label>
                    <select id="campaign-selector" disabled>
                        <option>請從左方上傳廣告產品報告</option>
                    </select>
                </div>
                <div id="charts-grid-container">
                    <div class="chart-wrapper" id="spend-chart-wrapper">
                        <p>請上傳報告以生成花費佔比圖表。</p>
                        <canvas id="spend-chart" style="display:none;"></canvas>
                    </div>
                    <div class="chart-wrapper" id="sales-chart-wrapper">
                         <p>請上傳報告以生成銷售佔比圖表。</p>
                         <canvas id="sales-chart" style="display:none;"></canvas>
                    </div>
                </div>
                <div id="skewed-campaigns-list"></div>
             </div>
             <div id="asin-analysis-content">
                <div class="card">
                    <div class="placeholder"><p>請先從左方上傳「廣告產品報告」以啟用下方分級分析。</p></div>
                </div>
            </div>
        </div>
        `;
    }

    // 負責將所有頁面組合到主內容區
    function getMainContentHTML() {
        return `
        <main id="main-content">
            ${getOverviewPageHTML()}
            ${getKeywordAnalysisPageHTML()}
            ${getCampaignAnalysisPageHTML()}
            ${getAsinAnalysisPageHTML()}
        </main>
        `;
    }

    // 核心函式：產生新的儀表板 HTML 內容
    function getToolHTML() {
        return `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
            <meta charset="UTF-8">
            <title>互動式廣告分析工具 v10.13.9</title>
            ${getDashboardCSS()}
            <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"><\/script>
        </head>
        <body>
            ${getSideNavHTML()}
            ${getMainContentHTML()}
            <script>
                // --- [v9.1] 報告欄位統一設定檔 ---
                const HEADER_CONFIG = {
                    // 通用指標
                    impressions: ['Impressions', '廣告曝光', '展示量'],
                    clicks: ['Clicks', '點擊', '点击量'],
                    spend: ['Spend', '支出', '花费'],
                    sales: ['7 Day Total Sales', '7 天總銷售額', '7天总销售额'],
                    orders: ['7 Day Total Orders (#)', '7 天總訂單數 (#)', '7天总订单数(#)'],

                    // 搜尋字詞報告 (Search Term Report)
                    searchTerm: ['Customer Search Term', '客戶搜尋字詞', '客户搜索词'],
                    campaignName: ['Campaign Name', '廣告活動名稱', '广告活动名称'],
                    adGroupName: ['Ad Group Name', '廣告群組名稱', '广告组名称'],
                    targeting: ['Targeting', '關鍵字', '投放'],
                    matchType: ['Match Type', '符合類型', '匹配类型'],

                    // 廣告活動報告 (Campaign Report)
                    status: ['Status', 'Campaign Status', '狀態', '狀態', '状态'],
                    budget: ['Budget', '預算', '预算'],
                    targetingType: ['Targeting Type', '廣告投放類型', '定位类型'],
                    startDate: ['Start Date', '開始日期', '开始日期'],
                    endDate: ['End Date', '結束日期', '結束日期'],

                    // 廣告產品報告 (Advertised Product Report)
                    advertisedASIN: ['Advertised ASIN', '廣告ASIN', '廣告 ASIN', '广告ASIN'],

                    // [v9.7] 業務報告 (Business Report) - 欄位修正
                    businessDate: ['Date', '日期'],
                    businessSessions: ['Sessions - Total', '工作階段 - 總計', '会话数 - 总计'],
                    businessUnitsOrdered: ['Units Ordered', '已訂購單位數量', '已订购商品数量'],
                    businessSales: ['Ordered Product Sales', '訂購產品銷售額', '已订购商品销售额']
                };

                // --- Global Data, Element Cache, and Event Listeners ---
                let rawDataObjects = [], headerRow = [], processedGlobalData = [], campaignReportData = [], advertisedProductData = [], reportAverages = null;
                let businessReportData = [];
                let gHighPerf = [], gMediumPerf = [], gLowPerf = [];
                // [v10.13.1] New Global Variable for ASIN to Campaign Mapping
                let globalAsinToCampaignMap = new Map();

                const businessFileInput = document.getElementById('business-file'), keywordFileInput = document.getElementById('keyword-file'), campaignFileInput = document.getElementById('campaign-file'), asinFileInput = document.getElementById('asin-file'), resultContent = document.getElementById('result-content'), keywordAnalysisContainer = document.getElementById('keyword-analysis-container'), navToggleBtn = document.getElementById('nav-toggle-btn'), sideNav = document.getElementById('side-nav'), navBtns = document.querySelectorAll('.nav-btn'), pageContents = document.querySelectorAll('.page-content');
                const exportReportBtn = document.getElementById('export-report-btn');
                const exportKeywordExcelBtn = document.getElementById('export-keyword-excel-btn');

                businessFileInput.addEventListener('change', handleBusinessFileUpload);
                keywordFileInput.addEventListener('change', handleFileUpload);
                campaignFileInput.addEventListener('change', handleCampaignFileUpload);
                asinFileInput.addEventListener('change', handleAsinFileUpload);
                navToggleBtn.addEventListener('click', () => { sideNav.classList.toggle('collapsed'); document.body.classList.toggle('nav-collapsed'); });
                navBtns.forEach(btn => { if(btn.dataset.target){ btn.addEventListener('click', () => { navBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); pageContents.forEach(c => c.classList.remove('active')); document.getElementById('page-' + btn.dataset.target).classList.add('active'); }); }});
                exportReportBtn.addEventListener('click', exportDashboardToHTML);
                exportKeywordExcelBtn.addEventListener('click', exportKeywordAnalysisToExcel);

                // --- [v10.10] ASIN Analyzer Logic - MODIFIED ---
                let spendChart = null, salesChart = null;
                let spendCampaignData = {}, salesCampaignData = {};
                const selector = document.getElementById('campaign-selector');
                const spendChartWrapper = document.getElementById('spend-chart-wrapper');
                const salesChartWrapper = document.getElementById('sales-chart-wrapper');
                const spendChartCanvas = document.getElementById('spend-chart');
                const salesChartCanvas = document.getElementById('sales-chart');
                selector.onchange = handleCampaignSelection;

                function populateCampaignSelector() {
                    const campaigns = Object.keys(spendCampaignData);
                    if (campaigns.length === 0) {
                        selector.innerHTML = '<option>報告中未找到有效數據</option>';
                        selector.disabled = true;
                        return;
                    }
                    selector.innerHTML = '';
                    campaigns.sort().forEach(campaign => {
                        const option = document.createElement('option');
                        option.value = campaign;
                        option.textContent = campaign;
                        selector.appendChild(option);
                    });
                    selector.disabled = false;
                    handleCampaignSelection();
                }

                function handleCampaignSelection() {
                    const selectedCampaign = selector.value;
                    if (!selectedCampaign) {
                        spendChartWrapper.innerHTML = '<p>請選擇一個有效的廣告活動。</p>';
                        salesChartWrapper.innerHTML = '<p>請選擇一個有效的廣告活動。</p>';
                        return;
                    }

                    // Draw Spend Chart
                    const spendData = spendCampaignData[selectedCampaign];
                    if (spendData) {
                        drawPieChart(Object.keys(spendData), Object.values(spendData), 'spend');
                    } else {
                        spendChartWrapper.innerHTML = '<p>此活動無廣告花費數據。</p>';
                        spendChartWrapper.appendChild(spendChartCanvas); // Re-add canvas for next selection
                        spendChartCanvas.style.display = 'none';
                    }

                    // Draw Sales Chart
                    const salesData = salesCampaignData[selectedCampaign];
                    if (salesData) {
                        drawPieChart(Object.keys(salesData), Object.values(salesData), 'sales');
                    } else {
                        salesChartWrapper.innerHTML = '<p>此活動無廣告銷售數據。</p>';
                        salesChartWrapper.appendChild(salesChartCanvas); // Re-add canvas for next selection
                        salesChartCanvas.style.display = 'none';
                    }
                }

                function drawPieChart(labels, values, type) {
                    const isSpend = type === 'spend';
                    const chartWrapper = isSpend ? spendChartWrapper : salesChartWrapper;
                    const canvas = isSpend ? spendChartCanvas : salesChartCanvas;
                    let chartInstance = isSpend ? spendChart : salesChart;

                    chartWrapper.innerHTML = '';
                    canvas.style.display = 'block';
                    chartWrapper.appendChild(canvas);

                    if (chartInstance) {
                        chartInstance.destroy();
                    }

                    const totalValue = values.reduce((acc, val) => acc + val, 0);
                    const title = isSpend ? \`\${selector.value} - ASIN 花費佔比\` : \`\${selector.value} - ASIN 銷售額佔比\`;

                    chartInstance = new Chart(canvas.getContext('2d'), {
                        type: 'pie',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: isSpend ? '花費' : '銷售額',
                                data: values,
                                backgroundColor: ['#FF9900', '#146EB4', '#232F3E', '#F5C242', '#565959', '#882255', '#117733', '#44AA99', '#DDCC77', '#CC6677'],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: { display: true, text: title, font: { size: 16 } },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            const label = context.label || '';
                                            const value = context.raw || 0;
                                            const percentage = ((value / totalValue) * 100).toFixed(2);
                                            const formattedValue = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                                            return \`\${label}: \${formattedValue} (\${percentage}%)\`;
                                        }
                                    }
                                },
                                legend: { position: 'bottom', labels: { boxWidth: 15, padding: 15 } }
                            }
                        }
                    });

                    if (isSpend) { spendChart = chartInstance; }
                    else { salesChart = chartInstance; }
                }

                function displaySkewedCampaigns() {
                    const container = document.getElementById('skewed-campaigns-list');
                    container.innerHTML = '';
                    let skewedResults = [];

                    for (const campaignName in spendCampaignData) {
                        const asinSpendData = spendCampaignData[campaignName];
                        const asinSalesData = salesCampaignData[campaignName] || {};

                        const asinCount = Object.keys(asinSpendData).length;
                        if (asinCount < 2) continue;

                        const totalSpend = Object.values(asinSpendData).reduce((a, b) => a + b, 0);
                        const totalSales = Object.values(asinSalesData).reduce((a, b) => a + b, 0); // Might be 0

                        if (totalSpend === 0) continue;

                        // Find problematic ASINs in this campaign
                        let campaignDetails = [];

                        for (const asin in asinSpendData) {
                            const spend = asinSpendData[asin];
                            const sales = asinSalesData[asin] || 0;

                            const spendPct = (spend / totalSpend) * 100;
                            const salesPct = totalSales > 0 ? (sales / totalSales) * 100 : 0;

                            // Criteria: Spend > 50% AND (Spend% - Sales% diff > 20%)
                            if (spendPct > 50 && Math.abs(spendPct - salesPct) > 20) {
                                campaignDetails.push(
                                    \`\${asin} (花費:\${spendPct.toFixed(1)}% vs 銷售:\${salesPct.toFixed(1)}%)\`
                                );
                            }
                        }

                        if (campaignDetails.length > 0) {
                            skewedResults.push({ name: campaignName, details: campaignDetails.join(', ') });
                        }
                    }

                    // Render
                    let html = '<h4>⚠️ 投入產出對比差距較大的ASIN</h4>';
                    html += '<p style="font-size: 0.85em; color: #555; margin-top: -10px; margin-bottom: 15px; line-height: 1.5;">投入產出對比: 例如 ASIN A 佔了廣告活動 80% 的花費，卻只貢獻了 10% 的銷售額，這就是典型的「低效傾斜」，需要立即優化；反之，若 ASIN B 花費佔比低但銷售佔比高，則是擴大投放的機會。</p>';

                    if (skewedResults.length > 0) {
                        html += '<ul>';
                        skewedResults.forEach(item => {
                            html += \`<li><strong>\${item.name}:</strong> \${item.details}</li>\`;
                        });
                        html += '</ul>';
                    } else {
                        html += '<p style="font-size: 0.9em; margin: 10px 0 0 0;">未發現投入產出差距過大的 ASIN。</p>';
                    }
                    container.innerHTML = html;
                }

                function resetAsinAnalyzerUI() {
                    selector.innerHTML = '<option>請從左方上傳廣告產品報告</option>';
                    selector.disabled = true;
                    spendChartWrapper.innerHTML = '<p>請上傳報告以生成花費佔比圖表。</p>';
                    salesChartWrapper.innerHTML = '<p>請上傳報告以生成銷售佔比圖表。</p>';
                    spendChartWrapper.appendChild(spendChartCanvas);
                    salesChartWrapper.appendChild(salesChartCanvas);
                    spendChartCanvas.style.display = 'none';
                    salesChartCanvas.style.display = 'none';
                    document.getElementById('skewed-campaigns-list').innerHTML = '';
                    if (spendChart) { spendChart.destroy(); spendChart = null; }
                    if (salesChart) { salesChart.destroy(); salesChart = null; }
                    spendCampaignData = {};
                    salesCampaignData = {};
                }
                // --- END of [v10.10] ASIN Analyzer Logic ---

                function findHeader(headers, key) {
                    const possibleNames = HEADER_CONFIG[key];
                    if (!possibleNames) return null;
                    return headers.find(h => possibleNames.includes(h));
                }

                function parseDate(dateStr) {
                    if (!dateStr || typeof dateStr !== 'string') return null;
                    const parts = dateStr.split(/[\\/.]/);
                    if (parts.length === 3) {
                        const month = parseInt(parts[0], 10) - 1;
                        const day = parseInt(parts[1], 10);
                        const year = parseInt(parts[2], 10);
                        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month < 12) {
                            const fullYear = year < 100 ? 2000 + year : year;
                            return new Date(fullYear, month, day);
                        }
                    }
                    const standardDate = new Date(dateStr);
                    if (!isNaN(standardDate.getTime())) return standardDate;
                    return null;
                }

                function aggregateMonthlyData(data, headers) {
                    const startDateKey = findHeader(headers, 'startDate');
                    if (!startDateKey) { return null; }
                    const monthlyAgg = {};
                    data.forEach(row => {
                        const date = parseDate(row[startDateKey]);
                        if (!date || isNaN(date.getTime())) return;
                        const monthKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
                        if (!monthlyAgg[monthKey]) {
                            monthlyAgg[monthKey] = { impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0 };
                        }
                        monthlyAgg[monthKey].impressions += row.impressions || 0;
                        monthlyAgg[monthKey].clicks += row.clicks || 0;
                        monthlyAgg[monthKey].spend += row.spend || 0;
                        monthlyAgg[monthKey].sales += row.sales || 0;
                        monthlyAgg[monthKey].orders += row.orders || 0;
                    });

                    const labels = Object.keys(monthlyAgg).sort();
                    const chartData = {
                        labels: labels, impressions: [], clicks: [], orders: [], sales: [], spend: [],
                        ctr: [], cvr: [], acos: [], roas: []
                    };

                    labels.forEach(label => {
                        const month = monthlyAgg[label];
                        chartData.impressions.push(Number(month.impressions));
                        chartData.clicks.push(Number(month.clicks));
                        chartData.orders.push(Number(month.orders));
                        chartData.sales.push(Number(month.sales));
                        chartData.spend.push(Number(month.spend));

                        const ctr = month.impressions > 0 ? (month.clicks / month.impressions * 100) : 0;
                        const cvr = month.clicks > 0 ? (month.orders / month.clicks * 100) : 0;
                        const acos = month.sales > 0 ? (month.spend / month.sales * 100) : 0;
                        const roas = month.spend > 0 ? (month.sales / month.spend) : 0;

                        chartData.ctr.push(Number(ctr));
                        chartData.cvr.push(Number(cvr));
                        chartData.acos.push(Number(acos));
                        chartData.roas.push(Number(roas));
                    });

                    return chartData;
                }

                // --- Core Logic (Restored from v10.13 to fix bugs) ---
                async function handleBusinessFileUpload() {
                    const container = document.getElementById('account-overview-content');
                    try {
                        const csvText = await readFile(businessFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("業務報告為空或格式無法解析。");

                        const bHeader = parsedData[0];
                        const keys = {
                            date: findHeader(bHeader, 'businessDate'),
                            sessions: findHeader(bHeader, 'businessSessions'),
                            units: findHeader(bHeader, 'businessUnitsOrdered'),
                            sales: findHeader(bHeader, 'businessSales')
                        };

                        if (!keys.date || !keys.sessions || !keys.units || !keys.sales) {
                            throw new Error("業務報告缺少必要的欄位 (日期/工作階段 - 總計/已訂購單位數量/訂購產品銷售額)。請檢查欄位名稱。");
                        }

                        const rawBusinessData = parsedData.slice(1).map(row => {
                            const obj = {};
                            bHeader.forEach((key, i) => obj[key] = row[i]);
                            return obj;
                        });

                        businessReportData = rawBusinessData.map(item => ({
                            date: item[keys.date],
                            sessions: getNumber(item, keys.sessions),
                            units: getNumber(item, keys.units),
                            sales: getNumber(item, keys.sales)
                        }));

                        updateAccountOverview();

                    } catch(error) {
                        businessReportData = [];
                        container.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                    }
                }

                async function handleFileUpload() {
                    try {
                        const csvText = await readFile(keywordFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("報告為空或格式無法解析。");
                        headerRow = parsedData[0];
                        const searchTermKey = findHeader(headerRow, 'searchTerm');
                        if (!searchTermKey) throw new Error("報告中找不到 'Customer Search Term' 或 '客戶搜尋字詞' 欄位。請確認您上傳的是【搜尋字詞報告】。");
                        rawDataObjects = parsedData.slice(1).map(row => { const obj = {}; headerRow.forEach((key, i) => obj[key] = row[i]); return obj; });
                        processedGlobalData = processData(rawDataObjects);
                        reportAverages = calculateAverages(processedGlobalData);
                        handlePerformanceAnalysis();
                    } catch(error) {
                        keywordAnalysisContainer.innerHTML = \`<div class="card"><div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div></div>\`;
                    }
                }

                // --- [Modified per request] 分離原始數據與聚合數據邏輯 ---
                async function handleCampaignFileUpload() {
                    const container = document.getElementById('campaign-analysis-content');
                    try {
                        const csvText = await readFile(campaignFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("廣告活動報告為空");
                        const reportHeader = parsedData[0];

                        // 1. 提取必要的欄位索引 (新增 campaignName, budget 以便聚合使用)
                        const keys = {
                           impressions: findHeader(reportHeader, 'impressions'),
                           clicks: findHeader(reportHeader, 'clicks'),
                           orders: findHeader(reportHeader, 'orders'),
                           sales: findHeader(reportHeader, 'sales'),
                           spend: findHeader(reportHeader, 'spend'),
                           targetingType: findHeader(reportHeader, 'targetingType'),
                           status: findHeader(reportHeader, 'status'),
                           campaignName: findHeader(reportHeader, 'campaignName'), // 新增：用於聚合
                           budget: findHeader(reportHeader, 'budget'),            // 新增：用於顯示
                           startDate: findHeader(reportHeader, 'startDate')       // 新增：用於月份篩選
                        };

                        if (!keys.campaignName) throw new Error("無法找到「廣告活動名稱」欄位，請確認報告格式。");

                        // 2. 處理原始數據 (Raw Data) - 用於「整體績效概覽」與「趨勢圖」
                        // 這裡保持原樣，保留日期維度，不進行聚合
                        const rawCampaignData = parsedData.slice(1).map(row => { const obj = {}; reportHeader.forEach((key, i) => obj[key] = row[i]); return obj; });

                        rawCampaignData.forEach(item => {
                            item.impressions = getNumber(item, keys.impressions); item.clicks = getNumber(item, keys.clicks);
                            item.orders = getNumber(item, keys.orders); item.sales = getNumber(item, keys.sales);
                            item.spend = getNumber(item, keys.spend);
                            // 原始數據的指標計算 (用於月度統計等)
                            item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0;
                            item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0;
                            item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0;
                            item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0;
                            item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                        });

                        // 計算全局平均指標 (用於分級基準) - 數學上，總和的平均等於分項的平均，所以用 rawCampaignData 計算總量沒問題
                        const totals = { spend: 0, sales: 0, impressions: 0, clicks: 0, orders: 0 };
                        rawCampaignData.forEach(c => {
                            totals.spend += c.spend; totals.sales += c.sales; totals.impressions += c.impressions;
                            totals.clicks += c.clicks; totals.orders += c.orders;
                        });
                        const avgMetrics = {
                            ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions * 100) : 0,
                            cvr: totals.clicks > 0 ? (totals.orders / totals.clicks * 100) : 0,
                            acos: totals.sales > 0 ? (totals.spend / totals.sales * 100) : 0,
                        };

                        // 3. 生成聚合數據 (Aggregated Data) - 專用於「廣告活動分析」頁面 (預設情況)
                        // 邏輯：依據 Campaign Name 進行 Group By，累加數值指標
                        const campaignMap = new Map();

                        rawCampaignData.forEach(row => {
                            const name = row[keys.campaignName];
                            if (!name) return; // 跳過無名稱的行

                            if (!campaignMap.has(name)) {
                                // 初始化聚合物件，保留該活動的靜態屬性 (取第一筆遇到的狀態與預算)
                                campaignMap.set(name, {
                                    [keys.campaignName]: name,
                                    [keys.status]: row[keys.status],
                                    [keys.budget]: row[keys.budget],
                                    [keys.targetingType]: row[keys.targetingType],
                                    impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0
                                });
                            }

                            const aggEntry = campaignMap.get(name);
                            aggEntry.impressions += row.impressions;
                            aggEntry.clicks += row.clicks;
                            aggEntry.spend += row.spend;
                            aggEntry.sales += row.sales;
                            aggEntry.orders += row.orders;
                        });

                        const aggregatedCampaignData = Array.from(campaignMap.values());

                        // 4. 對聚合後的數據重新計算指標 (Re-calculate Metrics)
                        aggregatedCampaignData.forEach(c => {
                            c.ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100) : 0;
                            c.cvr = c.clicks > 0 ? (c.orders / c.clicks * 100) : 0;
                            c.cpc = c.clicks > 0 ? (c.spend / c.clicks) : 0;
                            c.acos = c.sales > 0 ? (c.spend / c.sales * 100) : 0;
                            c.roas = c.spend > 0 ? (c.sales / c.spend) : 0;

                            // 5. 基於聚合後的表現進行紅綠燈分級
                            const isGreen = c.ctr > avgMetrics.ctr && c.cvr > avgMetrics.cvr && c.acos < avgMetrics.acos && c.orders > 0;
                            const isRed = c.ctr < avgMetrics.ctr && c.cvr < avgMetrics.cvr && c.acos > avgMetrics.acos && c.sales > 0; // 這裡邏輯維持原樣，若有銷量但表現全差則為紅

                            if (isGreen) { c.level = 'Green'; c.levelText = '整體表現佳'; }
                            else if (isRed) { c.level = 'Red'; c.levelText = '整體表現差'; }
                            else { c.level = 'Orange'; c.levelText = '表現中等或需再觀察'; }
                        });

                        // 更新全局變數 (用於 Account Overview 計算 TACOS 等，需保持原始 Raw Data)
                        campaignReportData = rawCampaignData;

                        // 生成圖表數據 (需使用 Raw Data 以保留時間軸)
                        const monthlyChartData = aggregateMonthlyData(rawCampaignData, reportHeader);

                        // --- 渲染分流 ---
                        // A. 概覽頁面：傳遞 Raw Data (確保月份趨勢圖正確)
                        renderCampaignOverview(rawCampaignData, { keys }, monthlyChartData);

                        // B. 分析頁面：傳遞 Aggregated Data (預設視圖)
                        renderClassifiedCampaigns(aggregatedCampaignData, avgMetrics, { keys });

                        // 更新帳戶總覽
                        updateAccountOverview();

                    } catch (error) {
                        campaignReportData = [];
                        console.error(error); // 方便 Debug
                        document.getElementById('campaign-overview-content').innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                        container.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                    }
                }

                // [v10.10] handleAsinFileUpload - MODIFIED
                async function handleAsinFileUpload() {
                    const analysisContainer = document.getElementById('asin-analysis-content');
                    try {
                        const csvText = await readFile(asinFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("廣告產品報告為空");

                        const reportHeader = parsedData[0];
                        const rawAsinData = parsedData.slice(1).map(row => {
                            const obj = {};
                            reportHeader.forEach((key, i) => obj[key] = row[i]);
                            return obj;
                        });

                        // --- Part 1: Process data for Spend & Sales Analyzers ---
                        resetAsinAnalyzerUI();
                        const campaignKey = findHeader(reportHeader, 'campaignName');
                        const asinKey = findHeader(reportHeader, 'advertisedASIN');
                        const spendKey = findHeader(reportHeader, 'spend');
                        const salesKey = findHeader(reportHeader, 'sales');

                        if (campaignKey && asinKey && (spendKey || salesKey)) {
                            const newSpendData = {};
                            const newSalesData = {};

                            // [v10.13.1] ASIN Reverse Lookup Logic
                            globalAsinToCampaignMap.clear();

                            rawAsinData.forEach(row => {
                                const campaignName = row[campaignKey];
                                const asin = row[asinKey];
                                const spend = getNumber(row, spendKey);
                                const sales = getNumber(row, salesKey);

                                if (!campaignName || !asin) return;

                                // Build Map for Reverse Lookup
                                const trimmedAsin = asin.trim();
                                if (trimmedAsin) {
                                    if (!globalAsinToCampaignMap.has(trimmedAsin)) {
                                        globalAsinToCampaignMap.set(trimmedAsin, new Set());
                                    }
                                    globalAsinToCampaignMap.get(trimmedAsin).add(campaignName);
                                }

                                if (spend > 0) {
                                    if (!newSpendData[campaignName]) newSpendData[campaignName] = {};
                                    if (!newSpendData[campaignName][asin]) newSpendData[campaignName][asin] = 0;
                                    newSpendData[campaignName][asin] += spend;
                                }
                                if (sales > 0) {
                                    if (!newSalesData[campaignName]) newSalesData[campaignName] = {};
                                    if (!newSalesData[campaignName][asin]) newSalesData[campaignName][asin] = 0;
                                    newSalesData[campaignName][asin] += sales;
                                }
                            });
                            spendCampaignData = newSpendData;
                            salesCampaignData = newSalesData;
                            populateCampaignSelector();
                            displaySkewedCampaigns();
                        }

                        // --- Part 2: Process data for ASIN Performance Tables (aggregated by ASIN) ---
                        const aggregationMap = new Map();
                        const keys = {
                           impressions: findHeader(reportHeader, 'impressions'), clicks: findHeader(reportHeader, 'clicks'),
                           orders: findHeader(reportHeader, 'orders'), sales: salesKey,
                           spend: spendKey, asin: asinKey
                        };

                        if (!keys.asin) { throw new Error("報告中找不到 'Advertised ASIN' 或 '廣告 ASIN' 欄位。請確認您上傳的是【廣告產品報告】。"); }

                        rawAsinData.forEach(row => {
                            const asinValue = row[keys.asin];
                            if (!asinValue || asinValue.trim() === '') return;
                            let entry = aggregationMap.get(asinValue);
                            if (!entry) {
                                entry = { asin: asinValue, impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0 };
                                aggregationMap.set(asinValue, entry);
                            }
                            entry.impressions += getNumber(row, keys.impressions); entry.clicks += getNumber(row, keys.clicks);
                            entry.spend += getNumber(row, keys.spend); entry.sales += getNumber(row, keys.sales);
                            entry.orders += getNumber(row, keys.orders);
                        });
                        let processedAsinData = Array.from(aggregationMap.values());
                        processedAsinData.forEach(item => {
                            item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0;
                            item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0;
                            item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0;
                            item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0;
                            item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                        });
                        advertisedProductData = processedAsinData;
                        renderNewAsinAnalysis(advertisedProductData);

                    } catch (error) {
                        analysisContainer.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                        resetAsinAnalyzerUI();
                        globalAsinToCampaignMap.clear();
                    }
                }

                function processData(dataToProcess) {
                    const searchTermKey = findHeader(headerRow, 'searchTerm');
                    const keys = {
                        impressions: findHeader(headerRow, 'impressions'), clicks: findHeader(headerRow, 'clicks'),
                        orders: findHeader(headerRow, 'orders'), sales: findHeader(headerRow, 'sales'),
                        spend: findHeader(headerRow, 'spend')
                    };
                    const aggregationMap = new Map();
                    dataToProcess.forEach(row => {
                        const searchTermValue = row[searchTermKey];
                        if (!searchTermValue || searchTermValue.trim() === '' || searchTermValue === '*') return;
                        let entry = aggregationMap.get(searchTermValue);
                        if (!entry) {
                            entry = { searchTerm: searchTermValue, impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0 };
                            aggregationMap.set(searchTermValue, entry);
                        }
                        entry.impressions += getNumber(row, keys.impressions); entry.clicks += getNumber(row, keys.clicks);
                        entry.spend += getNumber(row, keys.spend); entry.sales += getNumber(row, keys.sales);
                        entry.orders += getNumber(row, keys.orders);
                    });
                    let processed = Array.from(aggregationMap.values());
                    processed.forEach(item => {
                        item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0;
                        item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0;
                        item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0;
                        item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0;
                        item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                    });
                    return processed;
                }

                // --- UI & Rendering ---
                function renderCampaignOverview(data, { keys }, monthlyChartData) {
                    const container = document.getElementById('campaign-overview-content');
                    if (!data || data.length === 0) {
                        container.innerHTML = '<div class="placeholder"><p>報告數據為空。</p></div>';
                        return;
                    }

                    let chartHTML = '';
                    if (monthlyChartData && monthlyChartData.labels.length > 0) {
                        chartHTML = \`
                        <div class="campaign-chart-container">
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">廣告活動總量趨勢 (按月)</h4>
                             <canvas id="campaignTotalsChart"></canvas>
                        </div>
                        <div class="campaign-chart-container">
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">廣告活動效率趨勢 (按月)</h4>
                             <canvas id="campaignRatiosChart"></canvas>
                        </div>\`;
                    } else {
                        chartHTML = '<div class="placeholder" style="margin-bottom:20px;"><p>報告中缺少有效的 "Start Date" 欄位，無法生成趨勢圖。</p></div>';
                    }

                    const grandTotal = { spend: 0, sales: 0, orders: 0, impressions: 0, clicks: 0 };
                    data.forEach(c => {
                        grandTotal.spend += c.spend; grandTotal.sales += c.sales; grandTotal.impressions += c.impressions;
                        grandTotal.clicks += c.clicks; grandTotal.orders += c.orders;
                    });
                    const avgCTR = grandTotal.impressions > 0 ? (grandTotal.clicks / grandTotal.impressions * 100) : 0; const avgCVR = grandTotal.clicks > 0 ? (grandTotal.orders / grandTotal.clicks * 100) : 0;
                    const avgCPC = grandTotal.clicks > 0 ? (grandTotal.spend / grandTotal.clicks) : 0; const avgACoS = grandTotal.sales > 0 ? (grandTotal.spend / grandTotal.sales * 100) : 0; const avgRoAS = grandTotal.spend > 0 ? (grandTotal.sales / grandTotal.spend) : 0;

                    const autoTotals = { spend: 0, sales: 0, orders: 0, impressions: 0, clicks: 0, count: 0 };
                    const manualTotals = { ...autoTotals };
                     data.forEach(c => {
                        const type = (c[keys.targetingType] || '').toLowerCase();
                        const target = (type === 'automatic targeting' || type === '自動' || type === '自动投放' || type.includes('auto')) ? autoTotals : manualTotals;
                        target.count++;
                        Object.keys(autoTotals).forEach(key => { if(key !== 'count') target[key] += c[key] || 0; });
                    });
                    autoTotals.acos = autoTotals.sales > 0 ? (autoTotals.spend / autoTotals.sales * 100) : 0; manualTotals.acos = manualTotals.sales > 0 ? (manualTotals.spend / manualTotals.sales * 100) : 0;
                    autoTotals.roas = autoTotals.spend > 0 ? (autoTotals.sales / autoTotals.spend) : 0; manualTotals.roas = manualTotals.spend > 0 ? (manualTotals.sales / manualTotals.spend) : 0;
                    autoTotals.spendPerc = grandTotal.spend > 0 ? (autoTotals.spend / grandTotal.spend * 100) : 0; manualTotals.spendPerc = grandTotal.spend > 0 ? (manualTotals.spend / grandTotal.spend * 100) : 0;
                    autoTotals.salesPerc = grandTotal.sales > 0 ? (autoTotals.sales / grandTotal.sales * 100) : 0; manualTotals.salesPerc = grandTotal.sales > 0 ? (manualTotals.sales / grandTotal.sales * 100) : 0;

                    const metricsHTML=\`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">總量指標</h4><div class="dashboard-grid total-metrics-grid"><div class="metric-card"><div class="metric-value">\${grandTotal.impressions.toLocaleString()}</div><div class="metric-label">總曝光</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.clicks.toLocaleString()}</div><div class="metric-label">總點擊</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.orders.toLocaleString()}</div><div class="metric-label">總訂單</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">總花費</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">總銷售額</div></div></div>\`;
                    const avgMetricsHTML = \`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">平均指標</h4><div class="dashboard-grid avg-metrics-grid"><div class="metric-card"><div class="metric-value">\${avgCTR.toFixed(2)}%</div><div class="metric-label">平均 CTR</div></div><div class="metric-card"><div class="metric-value">\${avgCVR.toFixed(2)}%</div><div class="metric-label">平均 CVR</div></div><div class="metric-card"><div class="metric-value">\${avgCPC.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">平均 CPC</div></div><div class="metric-card"><div class="metric-value">\${avgACoS.toFixed(2)}%</div><div class="metric-label">平均 ACoS</div></div><div class="metric-card"><div class="metric-value">\${avgRoAS.toFixed(2)}</div><div class="metric-label">平均 RoAS</div></div></div>\`;
                    const typePerformanceHTML = \`<div class="campaign-type-performance-grid"><div class="viz-chart-card"><h4>花費佔比 & 績效</h4><div class="type-donut-chart-area"><div class="donut-chart-viz" style="background: conic-gradient(#007bff 0% \${autoTotals.spendPerc}%, var(--amazon-orange) \${autoTotals.spendPerc}% 100%); width: 120px; height: 120px;"></div><ul class="donut-chart-legend" style="width: auto;"><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: #007bff;"></span>自動廣告</div><span class="legend-percent">\${autoTotals.spendPerc.toFixed(1)}%</span></li><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span>手動廣告</div><span class="legend-percent">\${manualTotals.spendPerc.toFixed(1)}%</span></li></ul></div><div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;"><div><b>自動:</b> \${autoTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${autoTotals.acos.toFixed(2)}%</div><div><b>手動:</b> \${manualTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${manualTotals.acos.toFixed(2)}%</div></div></div><div class="viz-chart-card"><h4>銷售額佔比 & 績效</h4><div class="type-donut-chart-area"><div class="donut-chart-viz" style="background: conic-gradient(#007bff 0% \${autoTotals.salesPerc}%, var(--amazon-orange) \${autoTotals.salesPerc}% 100%); width: 120px; height: 120px;"></div><ul class="donut-chart-legend" style="width: auto;"><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: #007bff;"></span>自動廣告</div><span class="legend-percent">\${autoTotals.salesPerc.toFixed(1)}%</span></li><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span>手動廣告</div><span class="legend-percent">\${manualTotals.salesPerc.toFixed(1)}%</span></li></ul></div><div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;"><div><b>自動:</b> \${autoTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${autoTotals.roas.toFixed(2)}</div><div><b>手動:</b> \${manualTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${manualTotals.roas.toFixed(2)}</div></div></div></div>\`;
                    const collapsibleTableHTML=\`<details style="margin-top: 25px;"><summary>顯示/隱藏 所有廣告活動數據表</summary><div class="table-container">\${createGenericTableHTML([...data].sort((a,b)=>b.spend-a.spend),['廣告活動','狀態','預算','花費','銷售額','ACoS','RoAS','曝光','點擊','CTR','訂單','CVR'], {keys})}</div></details>\`;

                    container.innerHTML = chartHTML + metricsHTML + avgMetricsHTML + typePerformanceHTML + collapsibleTableHTML;

                    if (monthlyChartData && monthlyChartData.labels.length > 0) {
                        // Chart 1: Totals
                        const ctxTotals = document.getElementById('campaignTotalsChart').getContext('2d');
                        new Chart(ctxTotals, {
                            type: 'line',
                            data: {
                                labels: monthlyChartData.labels,
                                datasets: [
                                    { label: '總曝光', data: monthlyChartData.impressions, borderColor: '#4bc0c0', backgroundColor: 'rgba(75, 192, 192, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: '總點擊', data: monthlyChartData.clicks, borderColor: '#36a2eb', backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: '總訂單', data: monthlyChartData.orders, borderColor: '#9966ff', backgroundColor: 'rgba(153, 102, 255, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: '總花費', data: monthlyChartData.spend, borderColor: '#ff6384', backgroundColor: 'rgba(255, 99, 132, 0.1)', tension: 0.1, yAxisID: 'y-currency' },
                                    { label: '總銷售額', data: monthlyChartData.sales, borderColor: '#ffce56', backgroundColor: 'rgba(255, 206, 86, 0.1)', tension: 0.1, yAxisID: 'y-currency' }
                                ]
                            },
                            options: {
                                responsive: true, interaction: { mode: 'index', intersect: false },
                                scales: {
                                    'y-counts': { type: 'linear', position: 'left', title: { display: true, text: '數量' } },
                                    'y-currency': { type: 'linear', position: 'right', title: { display: true, text: '金額 ($)' }, grid: { drawOnChartArea: false }, ticks: { callback: value => '$' + value.toLocaleString() } }
                                },
                                plugins: { tooltip: { callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) { label += ': '; }
                                        let value = context.parsed.y;
                                        if (context.dataset.yAxisID === 'y-currency') {
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                                        } else {
                                            label += value.toLocaleString();
                                        }
                                        return label;
                                    }
                                }}}
                            }
                        });

                        // Chart 2: Ratios
                        const ctxRatios = document.getElementById('campaignRatiosChart').getContext('2d');
                        new Chart(ctxRatios, {
                            type: 'line',
                            data: {
                                labels: monthlyChartData.labels,
                                datasets: [
                                    { label: 'CTR (%)', data: monthlyChartData.ctr, borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.1)', tension: 0.1, yAxisID: 'y-percent' },
                                    { label: 'CVR (%)', data: monthlyChartData.cvr, borderColor: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.1)', tension: 0.1, yAxisID: 'y-percent' },
                                    { label: 'ACoS (%)', data: monthlyChartData.acos, borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.1)', tension: 0.1, yAxisID: 'y-percent' },
                                    { label: 'RoAS', data: monthlyChartData.roas, borderColor: '#ffc107', backgroundColor: 'rgba(255, 193, 7, 0.1)', tension: 0.1, yAxisID: 'y-ratio' }
                                ]
                            },
                            options: {
                                responsive: true, interaction: { mode: 'index', intersect: false },
                                scales: {
                                    'y-percent': { type: 'linear', position: 'left', title: { display: true, text: '比率 (%)' }, ticks: { callback: value => value.toFixed(2) + '%' } },
                                    'y-ratio': { type: 'linear', position: 'right', title: { display: true, text: 'RoAS' }, grid: { drawOnChartArea: false }, ticks: { callback: value => value.toFixed(2) } }
                                },
                                plugins: { tooltip: { callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) { label += ': '; }
                                        let value = context.parsed.y;
                                        if (context.dataset.yAxisID === 'y-percent') {
                                            label += value.toFixed(2) + '%';
                                        } else {
                                            label += value.toFixed(2);
                                        }
                                        return label;
                                    }
                                }}}
                            }
                        });
                    }
                }

                function renderNewAsinAnalysis(data) {
                    const container = document.getElementById('asin-analysis-content');
                    if (!data || data.length === 0) {
                        container.innerHTML = '<div class="card"><div class="placeholder"><p>報告數據為空或無法解析。</p></div></div>';
                        return;
                    }

                    let totalImpressions = 0, totalClicks = 0, totalOrders = 0;
                    data.forEach(item => {
                        totalImpressions += item.impressions;
                        totalClicks += item.clicks;
                        totalOrders += item.orders;
                    });
                    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
                    const avgCvr = totalClicks > 0 ? (totalOrders / totalClicks * 100) : 0;

                    const highPerfAsins = [], lowPerfAsins = [], mediumPerfAsins = [];
                    data.forEach(item => {
                        const isHigh = item.ctr > avgCtr && item.cvr > avgCvr;
                        const isLow = item.ctr < avgCtr && item.cvr < avgCvr;
                        if (isHigh) { highPerfAsins.push(item); }
                        else if (isLow) { lowPerfAsins.push(item); }
                        else { mediumPerfAsins.push(item); }
                    });

                    const filterCardHTML = \`
                        <div class="card">
                            <div class="card-header"><h3>績效等級篩選器</h3></div>
                            <div id="asin-filter-controls" style="padding: 15px;">
                                <button class="asin-filter-btn active" data-category="all">全部顯示 (\${data.length})</button>
                                <button class="asin-filter-btn" data-category="high">🟢 高績效ASIN (\${highPerfAsins.length})</button>
                                <button class="asin-filter-btn" data-category="medium">🟠 中等績效或待觀察ASIN (\${mediumPerfAsins.length})</button>
                                <button class="asin-filter-btn" data-category="low">🔴 低績效ASIN (\${lowPerfAsins.length})</button>
                            </div>
                            <div style="padding: 0 15px 15px 15px; font-size: 0.85em; color: #555; border-top: 1px solid #eee; margin: 0 15px; padding-top: 15px;">
                                <p style="margin:0;"><b>分級標準 (與報告整體平均值比較):</b><br>
                                - <strong style="color: #28a745;">高績效:</strong> 點擊率(CTR) > 平均 AND 轉化率(CVR) > 平均。<br>
                                - <strong style="color: #dc3545;">低績效:</strong> 點擊率(CTR) < 平均 AND 轉化率(CVR) < 平均。<br>
                                - <strong style="color: #fd7e14;">中等績效:</strong> 其他所有情況。
                                </p>
                            </div>
                        </div>
                    \`;

                    const headers = ['ASIN', '支出', '銷售額', 'ACoS', '曝光', '點擊', 'CTR', '訂單', 'CVR'];
                    const resultsHTML = \`
                        <div class="card">
                            <div class="asin-analysis-category" data-category="high"><div class="analysis-section"><h4>🟢 高績效ASIN</h4><p>這些ASIN的點擊率和轉化率均高於平均水平，是廣告表現的佼佼者。</p><div class="table-container">\${createTableForAsin(highPerfAsins.sort((a,b) => b.sales - a.sales), headers)}</div></div></div>
                            <div class="asin-analysis-category" data-category="medium"><div class="analysis-section"><h4>🟠 中等績效或待觀察ASIN</h4><p>這些ASIN在點擊率或轉化率方面至少有一項未達到平均水平，值得進一步觀察或進行單項優化。</p><div class="table-container">\${createTableForAsin(mediumPerfAsins.sort((a,b) => b.spend - a.spend), headers)}</div></div></div>
                            <div class="asin-analysis-category" data-category="low"><div class="analysis-section"><h4>🔴 低績效ASIN</h4><p>這些ASIN的點擊率和轉化率均低於平均水平，可能存在廣告相關性差或商品頁面轉化能力不足的問題。</p><div class="table-container">\${createTableForAsin(lowPerfAsins.sort((a,b) => b.spend - a.spend), headers)}</div></div></div>
                        </div>
                    \`;

                    container.innerHTML = filterCardHTML + resultsHTML;

                    const asinFilterContainer = document.getElementById('asin-filter-controls');
                    if (asinFilterContainer) {
                        asinFilterContainer.addEventListener('click', (e) => {
                            if (e.target.tagName === 'BUTTON') {
                                asinFilterContainer.querySelector('.active').classList.remove('active');
                                e.target.classList.add('active');
                                const category = e.target.dataset.category;
                                container.querySelectorAll('.asin-analysis-category').forEach(el => {
                                    el.style.display = (category === 'all' || el.dataset.category === category) ? 'block' : 'none';
                                });
                            }
                        });
                    }
                }

                function updateAccountOverview() {
                    if (businessReportData.length === 0 || campaignReportData.length === 0) {
                        return;
                    }

                    // Revert to v10.13 logic: campaignReportData here is expected to be raw array of objects
                    const campaignTotals = campaignReportData.reduce((acc, row) => {
                        acc.spend += row.spend || 0;
                        acc.sales += row.sales || 0;
                        acc.orders += row.orders || 0;
                        acc.clicks += row.clicks || 0;
                        return acc;
                    }, { spend: 0, sales: 0, orders: 0, clicks: 0 });

                    const businessTotals = businessReportData.reduce((acc, row) => {
                        acc.sales += row.sales || 0;
                        acc.units += row.units || 0;
                        acc.sessions += row.sessions || 0;
                        return acc;
                    }, { sales: 0, units: 0, sessions: 0 });

                    const accountTotals = {
                        naturalSessions: Math.max(0, businessTotals.sessions - campaignTotals.clicks),
                        naturalOrders: Math.max(0, businessTotals.units - campaignTotals.orders),
                        naturalSales: Math.max(0, businessTotals.sales - campaignTotals.sales),
                        tacos: businessTotals.sales > 0 ? (campaignTotals.spend / businessTotals.sales * 100) : 0
                    };

                    const campaignHeader = campaignReportData.length > 0 ? Object.keys(campaignReportData[0]) : [];
                    const targetingTypeKey = findHeader(campaignHeader, 'targetingType');

                    const autoTotals = { spend: 0, sales: 0 };
                    const manualTotals = { spend: 0, sales: 0 };
                    if(targetingTypeKey) {
                        campaignReportData.forEach(c => {
                            const type = (c[targetingTypeKey] || '').toLowerCase();
                            const target = (type === 'automatic targeting' || type === '自動' || type === '自动投放' || type.includes('auto')) ? autoTotals : manualTotals;
                            target.spend += c.spend || 0;
                            target.sales += c.sales || 0;
                        });
                        autoTotals.acos = autoTotals.sales > 0 ? (autoTotals.spend / autoTotals.sales * 100) : 1000;
                        manualTotals.acos = manualTotals.sales > 0 ? (manualTotals.spend / manualTotals.sales * 100) : 1000;
                        autoTotals.spendPerc = campaignTotals.spend > 0 ? (autoTotals.spend / campaignTotals.spend * 100) : 0;
                        manualTotals.spendPerc = campaignTotals.spend > 0 ? (manualTotals.spend / campaignTotals.spend * 100) : 0;
                    }

                    const monthlyTacosData = aggregateMonthlyTACOS();
                    renderAccountOverview(accountTotals, monthlyTacosData, businessTotals, campaignTotals, autoTotals, manualTotals);
                }

                function aggregateMonthlyTACOS() {
                    const monthlyCampaign = {};
                    // Revert to v10.13 logic
                    const campaignHeader = campaignReportData.length > 0 ? Object.keys(campaignReportData[0]) : [];
                    const startDateKey = findHeader(campaignHeader, 'startDate');

                    if (startDateKey) {
                        campaignReportData.forEach(row => {
                            const date = parseDate(row[startDateKey]);
                            if (date && !isNaN(date.getTime())) {
                                const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
                                if (!monthlyCampaign[monthKey]) {
                                    monthlyCampaign[monthKey] = { spend: 0 };
                                 }
                                monthlyCampaign[monthKey].spend += row.spend || 0;
                            }
                        });
                    }

                    const monthlyBusiness = {};
                    businessReportData.forEach(row => {
                        // businessReportData has .date already parsed or stored
                        const date = parseDate(row.date);
                        if (date && !isNaN(date.getTime())) {
                            const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
                            if (!monthlyBusiness[monthKey]) {
                                monthlyBusiness[monthKey] = { sales: 0 };
                            }
                            monthlyBusiness[monthKey].sales += row.sales || 0;
                        }
                    });

                    const matchedMonths = {};
                    Object.keys(monthlyCampaign).forEach(monthKey => {
                        if (monthlyBusiness[monthKey]) {
                            const adSpend = monthlyCampaign[monthKey].spend;
                            const totalSales = monthlyBusiness[monthKey].sales;
                            if (totalSales > 0) {
                                matchedMonths[monthKey] = (adSpend / totalSales * 100);
                            } else {
                                matchedMonths[monthKey] = 0;
                            }
                        }
                    });

                    const sortedLabels = Object.keys(matchedMonths).sort();
                    const tacosData = sortedLabels.map(label => matchedMonths[label]);
                    return { labels: sortedLabels, tacosData };
                }

                function renderAccountOverview(totals, chartData, businessTotals, campaignTotals, autoTotals, manualTotals) {
                    const container = document.getElementById('account-overview-content');
                    const hasChartData = chartData && chartData.labels && chartData.labels.length > 0;

                    let chartHTML = \`
                        <div id="tacos-chart-container">
                             <div class="chart-summary-value">總 TACOS: \${totals.tacos.toFixed(2)}%</div>
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">TACOS 趨勢 (按月)</h4>
                             \${!hasChartData ? \`
                                <div class="placeholder" style="padding: 30px;">
                                    <p style="margin:0;">無法生成趨勢圖。<br><span style="font-size:0.9em; color:#888;">請確保「業務報告」與「廣告活動報告」的日期範圍有重疊月份。</span></p>
                                </div>\` : \`<canvas id="tacosPerformanceChart"></canvas>\`
                             }
                        </div>\`;

                    const naturalTrafficPerc = businessTotals.sessions > 0 ? (totals.naturalSessions / businessTotals.sessions * 100) : 0;
                    const adTrafficPerc = 100 - naturalTrafficPerc;
                    const naturalOrdersPerc = businessTotals.units > 0 ? (totals.naturalOrders / businessTotals.units * 100) : 0;
                    const adOrdersPerc = 100 - naturalOrdersPerc;
                    const naturalSalesPerc = businessTotals.sales > 0 ? (totals.naturalSales / businessTotals.sales * 100) : 0;
                    const adSalesPerc = 100 - naturalSalesPerc;

                    const metricsHTML = \`
                        <div class="donut-charts-grid">
                            <div class="donut-chart-wrapper">
                                <h4>自然流量佔比</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalTrafficPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalTrafficPerc}%, var(--ad-color) \${naturalTrafficPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>自然流量</div><div class="legend-value">\${totals.naturalSessions.toLocaleString()} <span class="legend-percent">(\${naturalTrafficPerc.toFixed(1)}%)</span></div></li>
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>廣告點擊</div><div class="legend-value">\${campaignTotals.clicks.toLocaleString()} <span class="legend-percent">(\${adTrafficPerc.toFixed(1)}%)</span></div></li>
                                </ul>
                            </div>
                            <div class="donut-chart-wrapper">
                                <h4>自然單佔比</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalOrdersPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalOrdersPerc}%, var(--ad-color) \${naturalOrdersPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>自然單</div><div class="legend-value">\${totals.naturalOrders.toLocaleString()} <span class="legend-percent">(\${naturalOrdersPerc.toFixed(1)}%)</span></div></li>
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>廣告單</div><div class="legend-value">\${campaignTotals.orders.toLocaleString()} <span class="legend-percent">(\${adOrdersPerc.toFixed(1)}%)</span></div></li>
                                </ul>
                            </div>
                            <div class="donut-chart-wrapper">
                                <h4>自然銷售額佔比</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalSalesPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalSalesPerc}%, var(--ad-color) \${naturalSalesPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>自然銷售額</div><div class="legend-value">\${totals.naturalSales.toLocaleString('en-US', {style:'currency', currency: 'USD'})} <span class="legend-percent">(\${naturalSalesPerc.toFixed(1)}%)</span></div></li>
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>廣告銷售額</div><div class="legend-value">\${campaignTotals.sales.toLocaleString('en-US', {style:'currency', currency: 'USD'})} <span class="legend-percent">(\${adSalesPerc.toFixed(1)}%)</span></div></li>
                                </ul>
                            </div>
                        </div>
                    \`;

                    container.innerHTML = chartHTML + metricsHTML;

                    if (hasChartData) {
                        const ctx = document.getElementById('tacosPerformanceChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: chartData.labels,
                                datasets: [{
                                    label: 'TACOS (%)',
                                    data: chartData.tacosData,
                                    borderColor: '#6f42c1',
                                    backgroundColor: 'rgba(111, 66, 193, 0.1)',
                                    tension: 0.1,
                                    fill: true,
                                    spanGaps: false
                                }]
                            },
                            options: {
                                responsive: true,
                                scales: {
                                    y: { title: { display: true, text: 'TACOS (%)' }, ticks: { callback: value => value.toFixed(2) + '%' } }
                                },
                                plugins: { tooltip: { callbacks: { label: context => \`TACOS: \${context.parsed.y.toFixed(2)}%\` }}}
                            }
                        });
                    }

                    renderOverallPageSummary(totals, chartData, businessTotals, autoTotals, manualTotals, naturalSalesPerc);
                }

                function renderOverallPageSummary(accountTotals, tacosChartData, businessTotals, autoTotals, manualTotals, naturalSalesPerc) {
                    const container = document.getElementById('overall-summary-section');
                    let findings = [];
                    let suggestions = new Set(); // Use a Set to avoid duplicate suggestions

                    // 1. Analyze TACOS Trend
                    if (tacosChartData.tacosData && tacosChartData.tacosData.length > 1) {
                        const startTacos = tacosChartData.tacosData[0];
                        const endTacos = tacosChartData.tacosData[tacosChartData.tacosData.length - 1];
                        if (endTacos > startTacos * 1.1) {
                            findings.push('<li><span class="summary-icon">📉</span><div class="summary-text"><b>主要發現 (Lowlight):</b> 整體廣告成本佔比 (TACOS) 呈現上升趨勢，意味著廣告效率可能正在降低或銷售增長未能跟上廣告投入。</div></li>');
                            suggestions.add('<li><span class="summary-icon">1️⃣</span><div class="summary-text"><b>控制TACOS增長：</b>請優先檢視「廣告活動分析」頁面中的「表現差(紅燈)」活動，它們是拉高TACOS的主要原因。考慮降低其預算或優化其內部投放目標。</div></li>');
                        } else {
                            findings.push('<li><span class="summary-icon">📈</span><div class="summary-text"><b>主要發現 (Highlight):</b> 整體廣告成本佔比 (TACOS) 保持穩定或下降，顯示廣告投入與總銷售額之間維持著健康的平衡。</div></li>');
                        }
                    }

                    // 2. Analyze Ad Dependency (Natural Sales %)
                    if (naturalSalesPerc < 40) {
                        findings.push('<li><span class="summary-icon">⚠️</span><div class="summary-text"><b>主要發現:</b> 業務高度依賴廣告流量 (自然銷售佔比低於40%)。這在新品推廣期是正常的，但長期來看存在風險，且利潤空間可能受擠壓。</div></li>');
                        suggestions.add('<li><span class="summary-icon">2️⃣</span><div class="summary-text"><b>提升自然排名：</b>重點分析帶來最多廣告訂單的ASIN，針對這些ASIN的核心出單詞去優化其商品頁面的SEO (標題、五點、描述)，目標是將廣告訂單轉化為更高的自然排名與自然訂單。</div></li>');
                    } else {
                         findings.push('<li><span class="summary-icon">💪</span><div class="summary-text"><b>主要發現:</b> 帳戶擁有健康的自然銷售基礎 (自然銷售佔比高於40%)，這為廣告投放提供了很好的安全墊和利潤空間。</div></li>');
                    }

                     // 3. Analyze Ad Structure (Auto vs Manual)
                    if (autoTotals.spendPerc > 60 && autoTotals.acos > manualTotals.acos * 1.2) {
                        findings.push('<li><span class="summary-icon">🔬</span><div class="summary-text"><b>主要發現:</b> 廣告預算主要消耗在自動廣告上，但其效率 (ACoS) 明顯低於手動廣告，存在預算浪費的可能。</div></li>');
                        suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>優化廣告結構：</b>建立「每週一次」的複盤習慣。前往「關鍵字績效分析」頁面，將自動廣告跑出的高績效 (SSS/A級) 關鍵字/ASIN，以「精準匹配」加入手動廣告中，並將低績效 (E/F級) 的搜尋詞在自動廣告中設為「否定關鍵字」。</div></li>');
                    } else if (manualTotals.sales > autoTotals.sales) {
                        suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>放大核心優勢：</b>您的手動廣告是主要的銷售來源。請確保「表現佳(綠燈)」的核心手動廣告活動預算充足，並考慮對其核心關鍵字穩步提高競價 (5-10%)，以獲取更多頂部展示機會，擴大戰果。</div></li>');
                    } else {
                         suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>持續拓詞與收割：</b>當前廣告結構較為均衡。請繼續利用自動廣告探索新流量，並定期將驗證有效的關鍵字轉移到手動廣告中進行精細化運營，維持「自動拓詞、手動放大」的健康循環。</div></li>');
                    }

                    let suggestionsHTML = Array.from(suggestions).slice(0, 3).join('');

                    container.innerHTML = \`
                        <div class="summary-section" style="margin-top:0;">
                            <h4>結論</h4>
                            <ul>\${findings.join('')}</ul>
                        </div>
                        <div class="summary-section">
                            <h4>下一步優化建議</h4>
                            <ul>\${suggestionsHTML}</ul>
                        </div>
                    \`;
                }


                // --- Performance Analysis & Suggestions ---
                function calculateAverages(data) { let tI = 0, tC = 0, tS = 0, tSa = 0, tO = 0; data.forEach(i => { tI += i.impressions||0; tC += i.clicks||0; tS += i.spend||0; tSa += i.sales||0; tO += i.orders||0; }); const kC = data.length||1; return { avgCtr: tI>0?(tC/tI*100):0, avgCvr: tC>0?(tO/tC*100):0, avgAcos: tSa>0?(tS/tSa*100):0, avgRoas: tS>0?(tSa/tS):0, avgClicks: tC/kC, avgSpend: tS/kC, avgImpressions: tI/kC }; }
                function getAdSuggestion_v8(item, averages) { const { impressions, clicks, orders, acos, cvr, ctr, spend } = item; const { avgCtr, avgCvr, avgAcos, avgClicks, avgSpend, avgImpressions } = averages; const SIGNIFICANT_CLICKS = 20; const SIGNIFICANT_IMPRESSIONS = 5000; const hasSufficientData = impressions >= SIGNIFICANT_IMPRESSIONS || clicks >= SIGNIFICANT_CLICKS; const formatSuggestion = (diagnosis, suggestionList) => { const s = suggestionList.map(i => \`<li>\${i}</li>\`).join(''); return \`<div class='suggestion-wrapper'><div class='suggestion-block'><strong class='suggestion-title'>數據診斷：</strong>\${diagnosis}</div><div class='suggestion-block'><strong class='suggestion-title'>✅ 優化建議：</strong><ul>\${s}</ul></div></div>\`; }; if (clicks > SIGNIFICANT_CLICKS && spend > avgSpend && orders === 0) { return { level: "F", category: "low", suggestion: formatSuggestion('已累積大量點擊(>20)且花費高於平均，但完全沒有訂單。', ['此詞與商品相關性極低。<b>策略：</b>【立即將其添加為否定精準關鍵字】，徹底切斷無效花費。']) }; } if (clicks > avgClicks && cvr < avgCvr) { return { level: "E", category: "low", suggestion: formatSuggestion('已累積大量點擊(>平均)，但轉化率(CVR)遠低於平均，導致ACoS非常高。', ['低轉化源於Listing綜合實力不足。<b>策略：</b>深度優化【Listing詳情頁、五點描述、A+頁面、評論】，並在優化期間【逐步降低競價】控制虧損。']) }; } if (impressions < 1000 && orders === 0) { return { level: "D", category: "low", suggestion: formatSuggestion('廣告曝光量極低，且沒有訂單。', ['曝光不足主要源於【預算不足】或【競價過低】。<b>策略：</b>檢查廣告活動日預算，並參考系統「建議競價」適當提高出價。']) }; } if (hasSufficientData && ctr > avgCtr && cvr > avgCvr && (acos < 15 || acos < avgAcos * 0.7)) { return { level: "SSS", category: "high", suggestion: formatSuggestion('超級出單詞/ASIN，點擊與轉化俱佳，ACoS極低，是利潤核心。', ['<b>操作：</b>可評估為此關鍵字建立獨立的【手動精準匹配】廣告活動，並配置獨立的高預算。', '<b>競價：</b>建議可嘗試「大幅提高競價」（+30% 至 +50%），積極爭取並鞏固「搜索結果首頁頂部」的廣告位。']) }; } if (ctr > avgCtr && cvr > avgCvr) { const s = impressions < SIGNIFICANT_IMPRESSIONS ? '<b>情境 1 (曝光量 < 5000)：</b>屬於「展現量低，轉化率高」的潛力股。<b>建議：</b>可「顯著提高競價」（+20% 至 +40%），以獲取更多曝光機會。' : '<b>情境 2 (曝光量 > 5000)：</b>曝光充足的中流砥柱。<b>建議：</b>可「穩步提高競價」（+10% 至 +15%），獲取更高排名，並評估轉為【精準匹配】。'; return { level: "A", category: "high", suggestion: formatSuggestion('績優成長詞/ASIN，點擊率與轉化率高於平均，ACoS健康。', [s]) }; } if ((impressions < avgImpressions || clicks < avgClicks || ctr < avgCtr) && cvr > avgCvr) { return { level: "B", category: "medium", suggestion: formatSuggestion('潛力轉單詞/ASIN，曝光或點擊偏低，但轉化率高於平均。', ['具銷售潛力，瓶頸在於曝光不足。<b>策略：</b>可「穩步提高競價」（+10% 至 +15%）爭取更好展示位。', '若曝光仍不足，可考慮為其建立獨立的廣告組/活動。']) }; } if (!hasSufficientData && orders > 0) { return { level: "B", category: "medium", suggestion: formatSuggestion('潛力觀察詞/ASIN，數據累積不足(曝光<5000或點擊<20)，但已有訂單。', ['雖有訂單但數據量不足影響判讀。<b>策略：</b>【保持不動，繼續觀察】，等待數據累積後再做決策。']) }; } if (impressions > SIGNIFICANT_IMPRESSIONS && ctr < avgCtr) { return { level: "C", category: "medium", suggestion: formatSuggestion('低點擊率詞/ASIN，曝光量充足(>5000)，但點擊率遠低於平均。', ['問題出在搜索結果頁缺乏吸引力。<b>策略：</b>優化【商品主圖、標題、價格、星等、評論數】。', '若優化後CTR依舊很低，說明關鍵字相關性差，可評估「降低競價」或設為【否定】。']) }; } if (!hasSufficientData && orders === 0) { return { level: "C", category: "medium", suggestion: formatSuggestion('數據觀察詞/ASIN，數據累積不足(曝光<5000或點擊<20)，且無訂單。', ['觀察周期較短，數據不具備參考性。<b>策略：</b>【保持不動，繼續觀察】，以避免錯殺潛力詞。']) }; } return { level: "N/A", category: "medium", suggestion: formatSuggestion('數據表現特殊，建議手動個案分析。', ['請綜合考量商品的生命週期、利潤率以及廣告活動的整體目標，來決定具體操作。']) }; }

                function handlePerformanceAnalysis() {
                    if (processedGlobalData.length === 0) {
                        keywordAnalysisContainer.innerHTML = '<div class="card"><div class="placeholder"><p>請先上傳「消費者搜尋字詞報告」以啟用此分析頁面。</p></div></div>';
                        return;
                    }
                    keywordAnalysisContainer.innerHTML = '<div class="card"><div class="placeholder"><p>正在分析數據...</p></div></div>';

                    const qualifiedData = processedGlobalData;
                    qualifiedData.forEach(k => { const res = getAdSuggestion_v8(k, reportAverages); k.level = res.level; k.suggestion = res.suggestion; k.category = res.category; });
                    const levelOrder = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 };
                    const sortFn = (a, b) => (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);

                    gHighPerf = qualifiedData.filter(k => k.category === 'high').sort(sortFn);
                    gMediumPerf = qualifiedData.filter(k => k.category === 'medium').sort(sortFn);
                    gLowPerf = qualifiedData.filter(k => k.category === 'low').sort(sortFn);

                    const filterCardHTML = \`
                        <div class="card">
                            <div class="card-header"><h3>績效等級篩選與說明</h3></div>
                            <div id="keyword-filter-controls">
                                <button class="keyword-filter-btn active" data-category="all">✔️🔶⚠️ 全部顯示 (\${qualifiedData.length})</button>
                                <button class="keyword-filter-btn" data-category="high">✔️ 高績效與高潛力區 (\${gHighPerf.length})</button>
                                <button class="keyword-filter-btn" data-category="medium">🔶 中等績效與觀察區 (\${gMediumPerf.length})</button>
                                <button class="keyword-filter-btn" data-category="low">⚠️ 低績效與低潛力區 (\${gLowPerf.length})</button>
                            </div>
                            <div id="grade-explanation-details">
                                <p>
                                    <b>高績效區：</b><span class="tooltip">👑 SSS 級<span class="tooltiptext"><b>超級出單詞，利潤核心。</b><br>已通過曝光、點擊、轉化所有環節的考驗。點擊率與轉化率高於整體關鍵字報告的平均值，且數據量足夠 (需大於5000 次曝光或20 次點擊)。ACoS極低 (例如 < 15%或遠低於報告的平均值)，ROAS極高，且已帶來穩定的高訂單量。</span></span>、
                                    <span class="tooltip">⭐ A 級<span class="tooltiptext"><b>績優成長詞，廣告活動中流砥柱。</b><br>綜合表現優秀，點擊率與轉化率高於整體關鍵字報告的平均值。且ACoS健康（例如 15%-35%或接近報告平均值），是廣告活動的中流砥柱。</span></span>
                                </p>
                                <p>
                                    <b>觀察區：</b><span class="tooltip">🌱 B 級<span class="tooltiptext"><b>潛力觀察詞，具備潛力，需觀察或扶持。</b><br>關鍵字可能為曝光量或點擊量較少(低於平均曝光量、點擊量或平均點擊率)，但轉化率高於整體關鍵字報告的平均值；或是數據累積不足，無法做出準確判斷。通常表現為曝光少於5000次且點擊次數少於20次，但訂單數>0。</span></span>、
                                    <span class="tooltip">👀 C 級<span class="tooltiptext"><b>表現平平或數據不足，需診斷或觀察。</b><br>數據累積不足，無法做出準確判斷。關鍵字可能為曝光少於5000次且點擊次數少於20次，且訂單數=0；或是曝光量充足（> 5000次），但點擊率(CTR)遠低於整體關鍵字報告的平均值。問題出在「從曝光到點擊」的環節。</span></span>
                                </p>
                                <p>
                                    <b>低績效區：</b><span class="tooltip">📉 D 級<span class="tooltiptext"><b>低曝光詞，需檢查競價與預算。</b><br>廣告有投放，但幾乎沒有獲得曝光，且暫時沒有轉化(訂單數=0)。問題出在廣告投放的初始環節。</span></span>、
                                    <span class="tooltip">💔 E 級<span class="tooltiptext"><b>低轉化詞，需優化Listing。</b><br>已累積大量點擊（例如: > 廣告報告單一關鍵字的點擊量平均），但轉化率(CVR)遠低於整體關鍵字報告的平均值，ACoS因此非常高。問題出在「從點擊到購買」的環節，即商品詳情頁無法說服消費者。</span></span>、
                                    <span class="tooltip">🕳️ F 級<span class="tooltiptext"><b>預算黑洞，應立即止損。</b><br>這是最需要優先處理的目標。已累積大量點擊（例如: > 20次）且支出金額高於整體關鍵字的平均，但完全沒有任何訂單，持續消耗預算。</span></span>
                                </p>
                            </div>
                        </div>
                    \`;

                    const summaryCardHTML = \`
                        <div class="card" id="keyword-overview-moved-section">
                            <div class="card-header"><h3>關鍵字總覽</h3></div>
                            <div id="keyword-grade-summary">
                                <div class="placeholder"><p>正在生成關鍵字績效分級儀表板...</p></div>
                            </div>
                            <div id="keyword-overview-summary"></div>
                        </div>
                    \`;

                    const analysisHeaders = ['關鍵字/ASIN', '支出', '曝光', '點擊', '訂單', 'CTR', 'CVR', 'ACoS', 'RoAS', '等級', '廣告建議'];
                    const resultsHTML = \`
                        <div class="card">
                            <div class="keyword-analysis-category" data-category="high"><div class="analysis-section"><h4>✔️ 高績效與高潛力目標：機會放大區</h4><p>總體策略：放大成功，積極進攻。</p><div class="table-container">\${createTable(gHighPerf, analysisHeaders)}</div></div></div>
                            <div class="keyword-analysis-category" data-category="medium"><div class="analysis-section"><h4>🔶 中等績效目標：觀察診斷區</h4><p>總體策略：數據不足則謹慎觀察，表現中等則微調。</p><div class="table-container">\${createTable(gMediumPerf, analysisHeaders)}</div></div></div>
                            <div class="keyword-analysis-category" data-category="low"><div class="analysis-section"><h4>⚠️ 低績效目標：止損優化區</h4><p>總體策略：及時止損，提升預算效率。</p><div class="table-container">\${createTable(gLowPerf, analysisHeaders)}</div></div></div>
                        </div>
                    \`;

                    keywordAnalysisContainer.innerHTML = filterCardHTML + summaryCardHTML + resultsHTML;

                    renderKeywordGradeSummary(qualifiedData);
                    renderKeywordOverviewSummary(qualifiedData);

                    exportKeywordExcelBtn.disabled = false;

                    const keywordFilterContainer = document.getElementById('keyword-filter-controls');
                    if (keywordFilterContainer) {
                        keywordFilterContainer.addEventListener('click', (e) => {
                            if (e.target.tagName === 'BUTTON') {
                                keywordFilterContainer.querySelector('.active').classList.remove('active');
                                e.target.classList.add('active');
                                const category = e.target.dataset.category;
                                document.querySelectorAll('.keyword-analysis-category').forEach(el => {
                                    if (category === 'all' || el.dataset.category === category) {
                                        el.style.display = 'block';
                                    } else {
                                        el.style.display = 'none';
                                    }
                                });
                            }
                        });
                    }
                }
                function renderKeywordGradeSummary(data) { const container = document.getElementById('keyword-grade-summary'); if (!data || data.length === 0) { container.innerHTML = '<div class="placeholder"><p>無符合條件的關鍵字可供分析。</p></div>'; return; } const gradeMap = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1, 'N/A': 0 }; const levelMap = [ { score: 1, level: 'F', comment: '嚴重虧損' }, { score: 2, level: 'E', comment: '亟待優化' }, { score: 3, level: 'D', comment: '曝光不足' }, { score: 4, level: 'C', comment: '表現平平' }, { score: 5, level: 'B', comment: '潛力觀察' }, { score: 6, level: 'A', comment: '績優成長' }, { score: 7, level: 'SSS', comment: '超級明星' }]; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; const gradeOrder = ['SSS', 'A', 'B', 'C', 'D', 'E', 'F', 'N/A']; let totalScore = 0; const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; totalScore += gradeMap[result.level] || 0; }); const avgScore = data.length > 0 ? totalScore / data.length : 0; const avgGradeInfo = levelMap.reduce((prev, curr) => Math.abs(curr.score - avgScore) < Math.abs(prev.score - avgScore) ? curr : prev); const leftHTML = \`<div class="avg-grade-container"><div class="avg-grade-display">\${levelEmojis[avgGradeInfo.level]}</div><div class="avg-grade-level">\${avgGradeInfo.level} 級</div><div class="avg-grade-comment">平均績效：\${avgGradeInfo.comment}</div></div>\`; let rightHTML = '<div class="grade-dist-container"><h4>關鍵字等級分佈</h4><ul class="grade-dist-list">'; gradeOrder.forEach(level => { if (gradeCounts[level] > 0) { const percentage = (gradeCounts[level] / data.length * 100).toFixed(1); rightHTML += \`<li class="grade-dist-item"><div class="grade-dist-label">\${levelEmojis[level]} \${level}</div><div class="grade-dist-bar-bg"><div class="grade-dist-bar" style="width: \${percentage}%;"></div></div><div class="grade-dist-value">\${percentage}%</div></li>\`; } }); rightHTML += '</ul></div>'; container.innerHTML = leftHTML + rightHTML; }
                function renderKeywordOverviewSummary(data) { const container = document.getElementById('keyword-overview-summary'); if (!data || data.length === 0) { container.innerHTML = ''; return; } const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; }); const totalKeywords = data.length; const highPerfCount = gradeCounts['SSS'] + gradeCounts['A']; const lowPerfCount = gradeCounts['E'] + gradeCounts['F']; const midPerfCount = totalKeywords - highPerfCount - lowPerfCount; const highPerfPerc = totalKeywords > 0 ? (highPerfCount / totalKeywords) * 100 : 0; const lowPerfPerc = totalKeywords > 0 ? (lowPerfCount / totalKeywords) * 100 : 0; let summaryHTML = '<div class="summary-section keyword-summary-section"><h4>結論與下一步建議</h4><ul>'; if (totalKeywords === 0) { summaryHTML += '<li>無符合條件的關鍵字可供分析。</li>'; } else if (highPerfPerc >= 40) { summaryHTML += '<li><b>主要發現：</b>大部分關鍵字表現為「高績效」(SSS/A級)，廣告賬戶健康度高。</li><li><b>下一步：</b>建議為頭部關鍵字【創建獨立的精準匹配廣告】，並【穩步提高競價與預算】以擴大戰果，鞏固優勢廣告位。</li>'; } else if (lowPerfPerc >= 35) { summaryHTML += '<li><b>主要發現：</b>賬戶中「低績效」(E/F級)關鍵字佔比較高，存在明顯的預算浪費。</li><li><b>下一步：</b>立即將F級（預算黑洞）關鍵字設為【否定精準】，並將對E級（低轉化）關鍵字暫停投放或大幅降低競價，優先【優化對應的商品Listing】。將釋放的預算重新分配給高潛力詞。</li>'; } else if ((midPerfCount / totalKeywords) >= 0.5) { summaryHTML += '<li><b>主要發現：</b>多數關鍵字處於「潛力/觀察期」(B/C/D級)，賬戶仍在數據積累階段。</li><li><b>下一步：</b>核心策略是【耐心觀察，精準微調】。對B級詞可【小幅提高競價】爭取更多機會；對C/D級詞需重點分析其【點擊率(CTR)】，若CTR過低則需優化主圖/標題，或判斷為不相關詞並降低出價。</li>'; } else { summaryHTML += '<li><b>主要發現：</b>關鍵字表現分佈較為均衡，需採取精細化運營策略。</li><li><b>下一步：</b>對高績效詞【放大投入】，對低績效詞【及時止損】，對中等績效詞【持續觀察和優化】，實現整體廣告效益最大化。</li>'; } summaryHTML += '</ul></div>'; container.innerHTML = summaryHTML; }

                // --- Campaign Analysis Functions ---
                function getCampaignSuggestions(campaign, isAuto) {
                    let diagnosis = '';
                    let suggestions = [];
                    const { spend, sales, orders, impressions, acos, ctr } = campaign;
                    const hasSignificantSpend = spend > 20;
                    const hasSales = sales > 0;
                    const highACoSThreshold = 50;
                    const lowCTRThreshold = 0.3;
                    const scene1_auto = '<span class="tooltip">場景1<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景1</b><br>檢驗和優化商品刊登的品質：自動廣告基於系統對商品刊登的識別來匹配流量。</span></span>';
                    const scene3_auto = '<span class="tooltip">場景3<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景3</b><br>配合手動廣告，提升流量精準度：將自動廣告中高轉化的長尾詞/品牌詞轉移至手動廣告進行精準投放。</span></span>';
                    const scene4_auto = '<span class="tooltip">場景4<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景4</b><br>破冰, 尋找曝光：新品類或新商品可採用自動廣告來快速獲得初始曝光。</span></span>';
                    const scene5_auto = '<span class="tooltip">場景5<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景5</b><br>持續拓展優質關鍵字：利用自動廣告發掘商品の新使用場景（如瑜珈球用於孕婦鍛鍊）。</span></span>';
                    const scene6_auto = '<span class="tooltip">場景6<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景6</b><br>低成本獲得藍海關鍵字：用低預算和低競價的自動廣告，捕獲競爭度低的長尾流量。</span></span>';
                    const scene3_manual = '<span class="tooltip">場景三<span class="tooltiptext"><b>出處: 投放進階優化-關鍵字投放, 場景三</b><br>提升目標關鍵字排名：對高轉換關鍵字，使用獨立預算和高競價來爭取更高排名。</span></span>';
                    const scene4_manual = '<span class="tooltip">場景四<span class="tooltiptext"><b>出處: 投放進階優化-關鍵字投放, 場景四</b><br>品牌建設, 流量防禦：透過投放自身品牌詞，防禦競品流量，並建議使用廣泛匹配以低成本獲取流量。</span></span>';

                    if (isAuto) {
                        if (hasSignificantSpend && !hasSales) {
                            diagnosis = '此自動廣告花費較高但沒有產生任何銷售，可能正在浪費預算或Listing品質有待優化。';
                            suggestions = [
                                '<b>立即行動：</b>下載此廣告活動的「搜尋詞報告」。',
                                '<b>止損：</b>將報告中所有不相關、高點擊無訂單的搜尋詞添加為【否定關鍵字】。',
                                \`<b>檢查商品：</b>根據\${scene1_auto}，檢查廣告中的商品Listing品質，確保標題、五點描述、後台關鍵字都已「深埋」商品屬性，幫助系統準確識別。\`,
                            ];
                        } else if (acos > highACoSThreshold && hasSignificantSpend) {
                            diagnosis = 'ACoS過高，廣告效率低下。自動廣告雖用於探索，但需控制預算浪費。';
                            suggestions = [
                                '<b>優化核心：</b>下載「搜尋詞報告」，這是自動廣告最有價值的產出。',
                                \`<b>收割關鍵字(高轉化詞)：</b>根據\${scene3_auto}，找出報告中帶來訂單且ACoS符合目標的【高轉化長尾詞/品牌詞】，將它們以【精準匹配】方式添加到手動廣告活動中，並設定高競價高預算。\`,
                                '<b>收割ASIN(高轉化ASIN)：</b>同樣在報告中找出高轉化的競品ASIN，加入到【手動商品投放】廣告中。',
                                '<b>否定關鍵字(無轉化詞)：</b>將大量點擊但無轉化的搜尋詞添加為【否定關鍵字】，及時止損。'
                            ];
                        } else if (acos <= highACoSThreshold && hasSales) {
                            diagnosis = '此自動廣告表現良好，正以健康的ACoS穩定地尋找新機會與出單詞，是重要的流量補充和數據來源。';
                            suggestions = [
                                '<b>持續收割：</b>定期（每週）下載「搜尋詞報告」，持續將表現好的新搜尋詞和ASIN轉移到手動廣告活動中進行放大。',
                                \`<b>預算保障：</b>確保此廣告活動有充足的預算，讓它能持續探索新的潛在流量（如\${scene5_auto}の新使用場景、\${scene6_auto}の藍海關鍵字）。\`,
                                '<b>保持開啟：</b>根據官方建議，自動廣告應與手動廣告【長期並行】，作為流量的補充和防禦，並持續驗證Listing優化效果。'
                            ];
                        } else {
                            diagnosis = '數據量不足或曝光較低，處於探索階段。';
                            suggestions = [
                                \`<b>新品推廣：</b>若為新品，此為正常現象（如\${scene4_auto}の破冰期）。自動廣告是新品獲取初始流量和數據的最佳途徑。\`,
                                '<b>繼續觀察：</b>讓廣告活動繼續運行以積累更多數據。',
                                '<b>檢查預算/競價：</b>如果曝光量過低，請檢查廣告活動的日預算是否充足，並可考慮參考系統建議，採用【按定向組設定競價】的方式，對更有潛力的匹配方式（如緊密匹配）設定更高的出價。'
                            ];
                        }
                    } else { // Manual Campaign
                        if (hasSignificantSpend && !hasSales) {
                            diagnosis = '此手動廣告花費較高但完全沒有轉化，是主要的預算黑洞，需緊急處理。';
                            suggestions = [
                                '<b>立即審查：</b>深入檢查此活動下的所有投放目標（關鍵字/商品/品類）。',
                                '<b>暫停無效投放：</b>立即【暫停】或【存檔】所有高花費、零訂單的關鍵字或投放ASIN。',
                                '<b>檢查相關性：</b>確認投放的關鍵字/商品與您的商品是否高度相關。不相關的投放是預算浪費的主要原因。'
                            ];
                        } else if (acos > highACoSThreshold && hasSignificantSpend) {
                            diagnosis = 'ACoS遠超健康範圍，投入產出比極低，正在侵蝕利潤。';
                            suggestions = [
                                '<b>精細化競價：</b>根據搜尋詞報告，【降低】高ACoS關鍵字/投放目標的競價，目標是將其ACoS控制在盈虧線以下。',
                                '<b>否定搜尋詞：</b>如果使用「寬泛」或「詞組」匹配，請務必下載「搜尋詞報告」，將不相關的搜尋詞添加為【否定關鍵字】。',
                                '<b>檢查落地頁：</b>高點擊但低轉化可能意味著您的【商品詳情頁】存在問題，請檢查價格、評論、庫存、主圖等是否具備競爭力。'
                            ];
                        } else if (acos <= highACoSThreshold && hasSales) {
                            diagnosis = '這是一個績優廣告活動，是您主要的利潤來源之一，應重點維護與放大。';
                            suggestions = [
                                '<b>保障預算：</b>確保此廣告活動預算充足，避免因預算耗盡而錯失訂單。',
                                \`<b>穩步加價：</b>可嘗試對其中表現最好的核心關鍵字/投放目標【小幅提高競價】（如5-10%），以爭取更好的廣告排名和更多的曝光（\${scene3_manual}）。\`,
                                \`<b>流量防禦：</b>若此為品牌詞廣告，應使用【廣泛匹配】並配合建議競價中的最低出價，用小成本獲得更多流量入口，實現品牌建設與流量防禦（\${scene4_manual}）。\`
                            ];
                        } else if (impressions > 5000 && ctr < 0.3) {
                            diagnosis = '廣告獲得了大量曝光，但點擊率(CTR)偏低，說明廣告創意或投放相關性有待提高。';
                            suggestions = [
                                '<b>優化主圖：</b>檢查商品【主圖】在搜尋結果頁中是否足夠吸引人、能否脫穎而出。',
                                '<b>檢查標題與價格：</b>確認【標題】是否包含核心關鍵字，【價格】是否有競爭力，是否有優惠券等標識。',
                                '<b>提高相關性：</b>重新評估投放的關鍵字是否與商品高度匹配。不匹配的曝光會拉低整體點擊率。'
                            ];
                        } else {
                            diagnosis = '數據量不足或表現尚可，處於觀察階段。';
                            suggestions = [
                                '<b>繼續觀察：</b>讓廣告活動繼續運行以積累更多數據，以便做出更準確的判斷。',
                                '<b>檢查競價：</b>如果曝光量過低，可能是【競價不足】導致的。請參考亞馬遜的「建議競價」範圍，適當調整出價。',
                                '<b>擴充投放目標：</b>根據官方建議，一個手動廣告組中至少應有【30個關鍵字】或投放足夠的ASIN/品類來增加展示機會。'
                            ];
                        }
                    }
                    return { diagnosis, suggestions };
                }

                function renderClassifiedCampaigns(data, avgMetrics, { keys }) {
                    const container = document.getElementById('campaign-analysis-content');
                    // data 為預設的「全時段聚合數據」。當沒有選擇月份時，我們使用這個 data。
                    // 但為了構建月份篩選器，我們需要訪問全域的 campaignReportData (Raw Data)。

                    if (!campaignReportData || campaignReportData.length === 0) {
                        container.innerHTML = '<div class="placeholder"><p>廣告活動報告數據為空。</p></div>';
                        return;
                    }

                    // 1. 提取所有可用月份
                    const availableMonths = new Set();
                    const startDateKey = findHeader(Object.keys(campaignReportData[0]), 'startDate');
                    if (startDateKey) {
                        campaignReportData.forEach(row => {
                            const date = parseDate(row[startDateKey]);
                            if (date && !isNaN(date.getTime())) {
                                const monthKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
                                availableMonths.add(monthKey);
                            }
                        });
                    }
                    const sortedMonths = Array.from(availableMonths).sort();

                    // 2. 構建 UI
                    // levelCounts 仍基於預設 data 計算，這裡僅作初始顯示
                    const levelCounts = data.reduce((acc, c) => { acc[c.level] = (acc[c.level] || 0) + 1; return acc; }, {});

                    const filterHTML = \`
                        <div class="card" style="margin-bottom:25px;">
                            <div class="card-header"><h3>數據篩選與對比</h3></div>
                            <div id="campaign-filter-controls" style="padding: 15px;">
                                <!-- 月份篩選區 -->
                                <div style="margin-bottom: 20px; border-bottom: 1px dashed #eee; padding-bottom: 15px;">
                                    <label style="font-weight: 500; font-size: 0.9em; margin-bottom: 8px; display: block;">不同月份對比篩選器 (可多選):</label>
                                    <div id="month-select-container" style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        \${sortedMonths.map(m => \`<label style="font-size: 0.9em; display: flex; align-items: center; background: #f8f9fa; padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"><input type="checkbox" class="month-checkbox" value="\${m}" style="margin-right: 6px;"> \${m}</label>\`).join('')}
                                    </div>
                                    <p style="font-size: 0.8em; color: #666; margin-top: 5px; margin-bottom: 0;">* 若未勾選任何月份，將顯示所有時間段的聚合數據 (預設)。勾選多個月份後，表格將自動顯示前後月份的 PoP 環比增長率。</p>
                                </div>

                                <!-- 等級篩選區 -->
                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: 500; font-size: 0.9em; margin-right: 10px;">績效等級:</span>
                                    <button class="campaign-filter-btn active" data-level="All">全部</button>
                                    <button class="campaign-filter-btn" data-level="Green">🟢 表現佳</button>
                                    <button class="campaign-filter-btn" data-level="Orange">🟠 需觀察</button>
                                    <button class="campaign-filter-btn" data-level="Red">🔴 表現差</button>
                                </div>

                                <!-- ASIN 篩選區 -->
                                <div style="border-top: 1px dashed #eee; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
                                    <label for="campaign-asin-search" style="font-size: 0.9em; font-weight: 500;">ASIN 反查篩選:</label>
                                    <input type="text" id="campaign-asin-search" placeholder="輸入 ASIN (需先上傳廣告產品報告)" style="width: 250px; padding: 6px; border: 1px solid #dee2e6; border-radius: 4px;">
                                    <button id="campaign-asin-btn" class="campaign-filter-btn" style="padding: 6px 12px; font-size: 0.85em;">搜尋</button>
                                    <button id="campaign-asin-reset-btn" class="clear-btn">重置</button>
                                </div>
                            </div>
                            <div style="padding: 0 15px 15px 15px; font-size: 0.85em; color: #555; border-top: 1px solid #eee; margin: 0 15px; padding-top: 15px;">
                                <p style="margin:0;"><b>分級標準 (與整體平均值比較):</b><br>- <strong style="color: #28a745;">表現佳 (綠燈):</strong> CTR & CVR > 平均, 且 ACOS < 平均。<br>- <strong style="color: #dc3545;">表現差 (紅燈):</strong> CTR & CVR < 平均, 且 ACOS > 平均。<br>- <strong style="color: #fd7e14;">需觀察 (橘燈):</strong> 其他所有情況。</p>
                            </div>
                        </div>\`;

                    container.innerHTML = filterHTML + '<div id="campaign-list-container"></div>';

                    // 3. 渲染列表的核心函式 (Render Helper) - MODIFIED for Grouping & PoP
                    const renderList = (groupedData, isComparisonMode) => {
                        const listContainer = document.getElementById('campaign-list-container');
                        if (!groupedData || groupedData.length === 0) {
                            listContainer.innerHTML = '<p style="text-align:center; padding: 20px; color:#666;">無符合篩選條件的廣告活動。</p>';
                            return;
                        }

                        // Sort Logic (sort groups by their aggregated level/spend)
                        const levelOrder = { 'Green': 1, 'Orange': 2, 'Red': 3 };
                        const sortedGroups = [...groupedData].sort((a, b) => {
                             return (levelOrder[a.summary.level] || 4) - (levelOrder[b.summary.level] || 4);
                        });

                        let html = '';
                        sortedGroups.forEach(group => {
                            const summary = group.summary;
                            const rows = group.rows;

                            // Use summary data for container diagnosis
                            const isAuto = (summary[keys.targetingType] || '').toLowerCase().includes('auto') || (summary[keys.targetingType] || '') === '自動';
                            const { diagnosis, suggestions } = getCampaignSuggestions(summary, isAuto);
                            const campaignNameKey = findHeader(Object.keys(summary), 'campaignName');
                            const campaignName = summary[campaignNameKey] || '未知活動';

                            html += \`<details class="campaign-analysis-item" data-level="\${summary.level}">
                                <summary>
                                    <span class="campaign-level-indicator level-\${summary.level}" title="\${summary.levelText}"></span>
                                    <span class="campaign-title">\${campaignName}</span>
                                    <span class="campaign-tag \${isAuto ? 'auto' : 'manual'}">\${isAuto ? '自動廣告' : '手動廣告'}</span>
                                </summary>
                                <div class="analysis-content">
                                    <table class="campaign-metrics-table">
                                        <thead>
                                            <tr>
                                                \${isComparisonMode ? '<th>月份</th>' : ''}
                                                <th>曝光</th><th>點擊</th><th>訂單</th><th>花費</th><th>銷售額</th><th>CTR</th><th>CVR</th><th>CPC</th><th>ACoS</th><th>RoAS</th>
                                            </tr>
                                        </thead>
                                        <tbody>\`;

                            // Render Rows with PoP Logic
                            rows.forEach((row, index) => {
                                let popData = {};

                                if (isComparisonMode && index > 0) {
                                    const prevRow = rows[index - 1];
                                    if (!row.isMissing && !prevRow.isMissing) {
                                        const calcPoP = (curr, prev, isPct) => {
                                            if (!prev || prev === 0 && !isPct) return null;
                                            if (isPct) {
                                                // BPS Logic: (Current% - Prev%) * 100
                                                const diff = curr - prev;
                                                return { val: Math.round(diff * 100), unit: 'bps' };
                                            } else {
                                                // General data: Relative growth %
                                                if (prev === 0) return null;
                                                const growth = (curr - prev) / prev;
                                                return { val: (growth * 100).toFixed(1), unit: '%' };
                                            }
                                        };

                                        const metricKeys = [
                                            { k: 'impressions', isPct: false }, { k: 'clicks', isPct: false },
                                            { k: 'orders', isPct: false }, { k: 'spend', isPct: false },
                                            { k: 'sales', isPct: false }, { k: 'ctr', isPct: true },
                                            { k: 'cvr', isPct: true }, { k: 'cpc', isPct: false },
                                            { k: 'acos', isPct: true }, { k: 'roas', isPct: false }
                                        ];

                                        metricKeys.forEach(m => {
                                            const res = calcPoP(row[m.k], prevRow[m.k], m.isPct);
                                            if (res) {
                                                const sign = res.val > 0 ? '+' : '';
                                                const color = res.val >= 0 ? '#28a745' : '#dc3545';
                                                popData[m.k] = \`<div style="font-size:0.75em; color:\${color}; margin-top:2px; font-weight:500;">\${sign}\${res.val}\${res.unit} PoP</div>\`;
                                            } else {
                                                popData[m.k] = \`<div style="font-size:0.75em; color:#999; margin-top:2px;">-</div>\`;
                                            }
                                        });
                                    }
                                }

                                if (row.isMissing) {
                                     html += \`<tr>
                                        \${isComparisonMode ? \`<td>\${row.month}</td>\` : ''}
                                        <td colspan="10" style="color:#999; text-align:center;">- 無數據 -</td>
                                     </tr>\`;
                                } else {
                                    const getCell = (val, key, isCurrency, isPct) => {
                                        let content = val;
                                        if(isCurrency) content = val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                                        else if(isPct) content = val.toFixed(2) + '%';
                                        else if(key === 'roas') content = val.toFixed(2);
                                        else content = val.toLocaleString();

                                        return \`<td>\${content}\${popData[key] || ''}</td>\`;
                                    };

                                    html += \`<tr>
                                        \${isComparisonMode ? \`<td>\${row.month}</td>\` : ''}
                                        \${getCell(row.impressions, 'impressions')}
                                        \${getCell(row.clicks, 'clicks')}
                                        \${getCell(row.orders, 'orders')}
                                        \${getCell(row.spend, 'spend', true)}
                                        \${getCell(row.sales, 'sales', true)}
                                        \${getCell(row.ctr, 'ctr', false, true)}
                                        \${getCell(row.cvr, 'cvr', false, true)}
                                        \${getCell(row.cpc, 'cpc', true)}
                                        \${getCell(row.acos, 'acos', false, true)}
                                        \${getCell(row.roas, 'roas')}
                                    </tr>\`;
                                }
                            });

                            html +=     \`</tbody>
                                    </table>
                                    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 25px;">
                                        <div class="analysis-block"><h4>📈 績效診斷 (選定期間)</h4><p>\${diagnosis}</p></div>
                                        <div class="analysis-block"><h4>💡 優化建議</h4><ul>\${suggestions.map(s => \`<li>\${s}</li>\`).join('')}</ul></div>
                                    </div>
                                </div>
                            </details>\`;
                        });
                        listContainer.innerHTML = sortedGroups.length ? html : '<p>無數據</p>';
                    };

                    // 4. 動態聚合邏輯 (Core Logic Update)
                    const updateDataAndRender = () => {
                        const selectedMonths = Array.from(document.querySelectorAll('.month-checkbox:checked')).map(cb => cb.value);
                        let displayGroups = [];
                        const isComparisonMode = selectedMonths.length > 0;

                        if (!isComparisonMode) {
                            // Case A: 無篩選 -> 使用預設的全時段聚合數據 (data is already array of aggregated campaigns)
                            // Convert to "Group" structure compatible with renderList
                            displayGroups = data.map(item => ({
                                summary: item,
                                rows: [item] // Single row
                            }));
                        } else {
                            // Case B: 有篩選 -> 重新聚合
                            const filteredRaw = campaignReportData.filter(row => {
                                const date = parseDate(row[keys.startDate]);
                                if (!date) return false;
                                const mKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
                                return selectedMonths.includes(mKey);
                            });

                            // B-1. Identify all involved Campaigns
                            const uniqueNames = new Set();
                            filteredRaw.forEach(r => { if(r[keys.campaignName]) uniqueNames.add(r[keys.campaignName]); });

                            // B-2. Aggregate by (Name + Month)
                            const monthlyAggMap = new Map(); // Key: Name|Month

                            filteredRaw.forEach(row => {
                                const name = row[keys.campaignName];
                                const date = parseDate(row[keys.startDate]);
                                const mKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
                                const compositeKey = \`\${name}|\${mKey}\`;

                                if (!monthlyAggMap.has(compositeKey)) {
                                    monthlyAggMap.set(compositeKey, {
                                        [keys.campaignName]: name,
                                        [keys.status]: row[keys.status],
                                        [keys.budget]: row[keys.budget],
                                        [keys.targetingType]: row[keys.targetingType],
                                        month: mKey,
                                        impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0
                                    });
                                }
                                const entry = monthlyAggMap.get(compositeKey);
                                entry.impressions += row.impressions;
                                entry.clicks += row.clicks;
                                entry.spend += row.spend;
                                entry.sales += row.sales;
                                entry.orders += row.orders;
                            });

                            // B-3. Build Groups (One group per Campaign Name)
                            uniqueNames.forEach(name => {
                                const groupRows = [];
                                const groupSummary = {
                                    [keys.campaignName]: name,
                                    impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0
                                };

                                // Iterate selected months to ensure order and handle missing
                                selectedMonths.forEach(m => {
                                    const compositeKey = \`\${name}|\${m}\`;
                                    if (monthlyAggMap.has(compositeKey)) {
                                        const c = monthlyAggMap.get(compositeKey);
                                        // Metrics Calc
                                        c.ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100) : 0;
                                        c.cvr = c.clicks > 0 ? (c.orders / c.clicks * 100) : 0;
                                        c.cpc = c.clicks > 0 ? (c.spend / c.clicks) : 0;
                                        c.acos = c.sales > 0 ? (c.spend / c.sales * 100) : 0;
                                        c.roas = c.spend > 0 ? (c.sales / c.spend) : 0;

                                        // Add to Summary
                                        groupSummary.impressions += c.impressions;
                                        groupSummary.clicks += c.clicks;
                                        groupSummary.spend += c.spend;
                                        groupSummary.sales += c.sales;
                                        groupSummary.orders += c.orders;
                                        // Copy static props if not set
                                        if(!groupSummary[keys.targetingType]) groupSummary[keys.targetingType] = c[keys.targetingType];
                                        if(!groupSummary[keys.status]) groupSummary[keys.status] = c[keys.status];

                                        groupRows.push(c);
                                    } else {
                                        groupRows.push({ month: m, isMissing: true });
                                    }
                                });

                                // Finalize Summary Metrics & Level
                                groupSummary.ctr = groupSummary.impressions > 0 ? (groupSummary.clicks / groupSummary.impressions * 100) : 0;
                                groupSummary.cvr = groupSummary.clicks > 0 ? (groupSummary.orders / groupSummary.clicks * 100) : 0;
                                groupSummary.cpc = groupSummary.clicks > 0 ? (groupSummary.spend / groupSummary.clicks) : 0;
                                groupSummary.acos = groupSummary.sales > 0 ? (groupSummary.spend / groupSummary.sales * 100) : 0;
                                groupSummary.roas = groupSummary.spend > 0 ? (groupSummary.sales / groupSummary.spend) : 0;

                                const isGreen = groupSummary.ctr > avgMetrics.ctr && groupSummary.cvr > avgMetrics.cvr && groupSummary.acos < avgMetrics.acos && groupSummary.orders > 0;
                                const isRed = groupSummary.ctr < avgMetrics.ctr && groupSummary.cvr < avgMetrics.cvr && groupSummary.acos > avgMetrics.acos && groupSummary.sales > 0;
                                if (isGreen) { groupSummary.level = 'Green'; groupSummary.levelText = '選定期間表現佳'; }
                                else if (isRed) { groupSummary.level = 'Red'; groupSummary.levelText = '選定期間表現差'; }
                                else { groupSummary.level = 'Orange'; groupSummary.levelText = '需觀察'; }

                                displayGroups.push({
                                    summary: groupSummary,
                                    rows: groupRows
                                });
                            });
                        }

                        // Apply Filters (Level & ASIN)
                        const activeLevelBtn = document.querySelector('.campaign-filter-btn.active[data-level]');
                        const selectedLevel = activeLevelBtn ? activeLevelBtn.dataset.level : 'All';
                        const searchAsin = document.getElementById('campaign-asin-search').value.trim();

                        let allowedCampaignNames = null;
                        if (searchAsin) {
                            if (globalAsinToCampaignMap.size > 0 && globalAsinToCampaignMap.has(searchAsin)) {
                                allowedCampaignNames = globalAsinToCampaignMap.get(searchAsin);
                            } else {
                                allowedCampaignNames = new Set();
                            }
                        }

                        const filteredDisplayGroups = displayGroups.filter(group => {
                            const itemLevel = group.summary.level;
                            const itemName = group.summary[keys.campaignName];

                            const matchesLevel = (selectedLevel === 'All') || (itemLevel === selectedLevel);
                            const matchesAsin = (allowedCampaignNames === null) || (allowedCampaignNames.has(itemName));

                            return matchesLevel && matchesAsin;
                        });

                        renderList(filteredDisplayGroups, isComparisonMode);
                    };

                    // Initial Render
                    updateDataAndRender();

                    // 5. Event Listeners
                    document.querySelectorAll('.month-checkbox').forEach(cb => {
                        cb.addEventListener('change', updateDataAndRender);
                    });

                    document.querySelectorAll('.campaign-filter-btn[data-level]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            document.querySelectorAll('.campaign-filter-btn[data-level]').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            updateDataAndRender();
                        });
                    });

                    const asinSearchBtn = document.getElementById('campaign-asin-btn');
                    const asinResetBtn = document.getElementById('campaign-asin-reset-btn');
                    const asinInput = document.getElementById('campaign-asin-search');

                    if(asinSearchBtn) asinSearchBtn.addEventListener('click', updateDataAndRender);
                    if(asinResetBtn) asinResetBtn.addEventListener('click', () => {
                        asinInput.value = '';
                        updateDataAndRender();
                    });
                    if(asinInput) asinInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') updateDataAndRender();
                    });
                }

                // --- Table Sorting Function ---
                function sortColumn(event, colIndex) { const header = event.currentTarget; const table = header.closest('table'); const tbody = table.querySelector('tbody'); const rows = Array.from(tbody.querySelectorAll('tr')); rows.sort((a, b) => { const cellA = a.cells[colIndex]?.innerText || ''; const cellB = b.cells[colIndex]?.innerText || ''; if (colIndex === 0) { return cellB.localeCompare(cellA, ['zh-Hans-CN', 'en-US']); } const valA = parseFloat(String(cellA).replace(/[^0-9.-]+/g, '')) || -Infinity; const valB = parseFloat(String(cellB).replace(/[^0-9.-]+/g, '')) || -Infinity; return valB - valA; }); table.querySelectorAll('th').forEach(th => { th.innerHTML = th.innerHTML.replace(/ ▼$/, ''); }); if (!header.innerHTML.includes('▼')) { header.innerHTML += ' ▼'; } tbody.append(...rows); }

                // --- Table Creation & Utility Functions ---
                function createTable(data, headers) { const isAnalysisTable = headers.includes('廣告建議'); const dataToRender = isAnalysisTable ? data : [...data].sort((a, b) => b.impressions - a.impressions); if (!dataToRender || dataToRender.length === 0) return '<p style="padding:15px; text-align:center;"><i>此分類無符合條件的數據。</i></p>'; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; dataToRender.forEach(row => { const levelDisplay = isAnalysisTable ? \`\${levelEmojis[row.level] || ''} \${row.level}\` : ''; const cells = { '關鍵字/ASIN': row.searchTerm, 'ASIN': row.asin, '等級': levelDisplay, '廣告建議': row.suggestion || '---', '支出': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '曝光': row.impressions.toLocaleString(), '點擊': row.clicks.toLocaleString(), '訂單': row.orders.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, 'CVR': \`\${row.cvr.toFixed(2)}%\`, 'ACoS': \`\${row.acos.toFixed(1)}%\`, 'RoAS': row.roas.toFixed(2), '關鍵字': row.searchTerm, 'CPC': \`\${row.cpc.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '銷售額': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`}; table += '<tr>'; headers.forEach(h => { let cellContent = (cells[h] !== undefined) ? String(cells[h]) : '---'; if (h !== '廣告建議' && h !== '等級') { cellContent = cellContent.replace(/</g, "&lt;").replace(/>/g, "&gt;"); } if (h === '等級') { table += \`<td style="text-align: center; font-weight: bold;">\${cellContent}</td>\`; } else { table += \`<td>\${cellContent}</td>\`; } }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
                function createGenericTableHTML(data, headers, { keys }) { if (!data || data.length === 0) return '<p><i>無數據</i></p>'; const campaignNameKey = findHeader(Object.keys(data[0]), 'campaignName'); const statusKey = findHeader(Object.keys(data[0]), 'status'); const budgetKey = findHeader(Object.keys(data[0]), 'budget'); let tableHTML = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => tableHTML += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); tableHTML += '</tr></thead><tbody>'; data.forEach(row => { tableHTML += '<tr>'; const cellData = { '廣告活動': row[campaignNameKey], '狀態': row[statusKey], '預算': row[budgetKey], '花費': row.spend, '銷售額': row.sales, 'ACoS': row.acos, 'RoAS': row.roas, '曝光': row.impressions, '點擊': row.clicks, 'CTR': row.ctr, '訂單': row.orders, 'CVR': row.cvr }; headers.forEach(header => { let cellContent = (cellData[header] !== undefined && cellData[header] !== null) ? cellData[header] : '---'; if (typeof cellContent === 'number') { if (['花費', '銷售額', '預算'].includes(header)) { cellContent = \`\${cellContent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`; } else if (['ACoS', 'CTR', 'CVR'].includes(header)) { cellContent = \`\${cellContent.toFixed(2)}%\`; } else if (header === 'RoAS') { cellContent = cellContent.toFixed(2); } else { cellContent = cellContent.toLocaleString(); } } tableHTML += \`<td>\${cellContent}</td>\`; }); tableHTML += '</tr>'; }); tableHTML += '</tbody></table>'; return tableHTML; }
                function createTableForAsin(data, headers) { if (!data || data.length === 0) return '<p style="padding:15px; text-align:center;"><i>此分類無符合條件的數據。</i></p>'; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; data.forEach(row => { const cells = { 'ASIN': row.asin, '支出': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '銷售額': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, 'ACoS': \`\${row.acos.toFixed(1)}%\`, '曝光': row.impressions.toLocaleString(), '點擊': row.clicks.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, '訂單': row.orders.toLocaleString(), 'CVR': \`\${row.cvr.toFixed(2)}%\` }; table += '<tr>'; headers.forEach(h => { table += \`<td>\${cells[h] !== undefined ? cells[h] : '---'}</td>\`; }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
                function parseCSV(text) { let result = []; let lines = text.split(/\\r\\n|\\n/); if (lines.length > 0 && lines[0].charCodeAt(0) === 0xFEFF) lines[0] = lines[0].substring(1); for (let i = 0; i < lines.length; i++) { if (!lines[i].trim()) continue; let row = []; let current = ''; let inQuotes = false; for (let j = 0; j < lines[i].length; j++) { let char = lines[i][j]; if (char === '"') { if (inQuotes && j < lines[i].length - 1 && lines[i][j+1] === '"') { current += '"'; j++; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; } else { current += char; } } row.push(current.trim()); result.push(row); } return result; }
                function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = event => resolve(event.target.result); reader.onerror = error => reject(error); reader.readAsText(file, 'UTF-8'); }); }
                function getNumber(item, key) {
                    if (!key || item[key] === undefined || item[key] === '') return 0;
                    const cleanedString = String(item[key]).replace(/[^0-9.-]+/g,"");
                    return parseFloat(cleanedString) || 0;
                }
                function getMedian(arr) { if (!arr.length) return 0; const sorted = arr.slice().sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); if (sorted.length % 2 === 0) { return (sorted[mid - 1] + sorted[mid]) / 2; } return sorted[mid]; }

                // --- Export Functions ---
                function exportDashboardToHTML() {
                    const now = new Date();
                    const timestamp = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
                    const filename = \`亞馬遜廣告分析報告_\${timestamp}.html\`;

                    const detailsElements = document.querySelectorAll('details');
                    const originalOpenState = Array.from(detailsElements).map(d => d.open);
                    detailsElements.forEach(d => d.open = true);

                    const pageClone = document.documentElement.cloneNode(true);

                    const originalCanvases = document.querySelectorAll('canvas');
                    const clonedCanvases = pageClone.querySelectorAll('canvas');

                    originalCanvases.forEach((originalCanvas, i) => {
                        const clonedCanvas = clonedCanvases[i];
                        if (clonedCanvas) {
                            const dataUrl = originalCanvas.toDataURL('image/png');
                            const img = document.createElement('img');
                            img.src = dataUrl;
                            img.style.width = originalCanvas.style.width || '100%';
                            img.style.height = 'auto';
                            img.style.maxWidth = '100%';
                            img.style.display = 'block';
                            clonedCanvas.parentNode.replaceChild(img, clonedCanvas);
                        }
                    });

                    pageClone.querySelector('#side-nav').remove();
                    pageClone.querySelector('body').classList.remove('nav-collapsed');
                    pageClone.querySelector('body').style.margin = '0';
                    const mainContent = pageClone.querySelector('#main-content');
                    mainContent.style.padding = '25px';
                    mainContent.querySelectorAll('.page-content').forEach(page => {
                        page.style.display = 'block';
                    });

                    const scriptTag = pageClone.querySelector('script');
                    if(scriptTag) scriptTag.remove();

                    const exportHTML = pageClone.outerHTML;

                    detailsElements.forEach((d, i) => d.open = originalOpenState[i]);

                    const blob = new Blob([exportHTML], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                function formatCsvCell(str) { let result = String(str); result = result.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim(); result = result.replace(/"/g, '""'); if (result.search(/("|,|\\n)/g) >= 0) { result = '"' + result + '"'; } return result; }
                function exportKeywordAnalysisToExcel() { if (gHighPerf.length === 0 && gMediumPerf.length === 0 && gLowPerf.length === 0) { alert('沒有可匯出的分析數據。'); return; } const headers = ["總體績效表現", "關鍵字/ASIN", "支出", "曝光", "點擊", "訂單", "CTR(%)", "CVR(%)", "ACoS(%)", "RoAS", "等級", "廣告建議"]; const dataRows = []; const processCategory = (data, categoryName) => { data.forEach(row => { const rowData = [ categoryName, row.searchTerm || 'N/A', row.spend || 0, row.impressions || 0, row.clicks || 0, row.orders || 0, row.ctr ? row.ctr.toFixed(2) : '0.00', row.cvr ? row.cvr.toFixed(2) : '0.00', row.acos ? row.acos.toFixed(1) : '0.0', row.roas ? row.roas.toFixed(2) : '0.00', row.level || 'N/A', row.suggestion || '---' ]; dataRows.push(rowData); }); }; processCategory(gHighPerf, '高績效與高潛力目標：機會放大區'); processCategory(gMediumPerf, '中等績效目標：觀察診斷區'); processCategory(gLowPerf, '低績效目標：止損優化區'); const csvContent = [ headers.join(','), ...dataRows.map(row => row.map(formatCsvCell).join(',')) ].join('\\n'); const now = new Date(); const timestamp = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`; const filename = \`關鍵字分析報告_\${timestamp}.csv\`; const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
            <\/script>
        </body>
        </html>`;
    }

    // --- Bootstrapping Logic --- (NO CHANGE)
    function launchTool() {
        const toolHTML = getToolHTML();
        const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(toolHTML);
        GM_openInTab(dataUri, { active: true, insert: true, setParent: true });
    }
    function createUI() {
        if (document.getElementById('gemini-report-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'gemini-report-banner';
        const textSpan = document.createElement('span');
        textSpan.textContent = '亞馬遜廣告分析師工具：';
        const button = document.createElement('button');
        button.id = 'gemini-report-generator-btn';
        button.textContent = '🚀 啟動廣告分析儀表板 (v10.13.9)';
        button.onclick = launchTool;
        banner.appendChild(textSpan);
        banner.appendChild(button);
        document.body.prepend(banner);
    }
    const observer = new MutationObserver(createUI);
    window.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
            createUI();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

})();