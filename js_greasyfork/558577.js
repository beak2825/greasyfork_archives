// ==UserScript==
// @name         Amazon Ads Analysis Tool (v10.13.10 English Version)
// @namespace    http://tampermonkey.net/
// @version      10.13.10
// @description  [Fix] Fixed Syntax Error causing unresponsiveness. English Interface.
// @author       Gemini (Dashboard Designer & Analyst) / Module Refactored by Gemini
// @match        https://gs.amazon.com.tw/onboarding-service*
// @match        https://sellercentral.amazon.com/*
// @match        https://advertising.amazon.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGOTkwMCIgd2lkd2g9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ0MTdMMTQuMTcgNXptLTYuMzUgMTFMMTYgNy44MyAxOC4xNyAxMEw5LjgzIDE4LE4uMTcgIDcgMThsLjgyLTQuMTV6TTIwLjcxIDcuNDFsLTIuNTQtMi4xZMtLjM5LS43OTEtMS4wMi0uMzktMS40MSAwbC0xLjI5IDEuMjkgNCA0IDEuMjktMS44jjjDy5Yy4zOS0uMzguMzktMS4wMiAwLTEuNDF6Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/558577/Amazon%20Ads%20Analysis%20Tool%20%28v101310%20English%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558577/Amazon%20Ads%20Analysis%20Tool%20%28v101310%20English%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Banner Style
    GM_addStyle(`
        #gemini-report-banner { position: fixed; top: 0; left: 0; width: 100%; background-color: #232f3e; color: #fff; padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 2147483647 !important; display: flex; align-items: center; justify-content: center; font-family: 'Arial', sans-serif; }
        #gemini-report-banner span { font-size: 14px; font-weight: 500; margin-right: 15px; }
        #gemini-report-generator-btn { background: linear-gradient(to bottom, #f7dfa5, #f0c14b); color: #111; border: 1px solid #a88734; border-radius: 4px; padding: 6px 12px; font-size: 14px; font-weight: bold; text-shadow: 0 1px 0 rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s ease; }
        #gemini-report-generator-btn:hover { background: linear-gradient(to bottom, #f5d78e, #eeb933); border-color: #9c7e31; }
        body { margin-top: 50px !important; }
    `);

    // --- HTML Generation Functions ---

    function getDashboardCSS() {
        return `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            :root {
                --amazon-orange: #FF9900; --amazon-yellow: #f5c242; --amazon-blue: #232f3e;
                --dark-bg: #131921; --nav-hover: #232f3e; --light-text: #FFFFFF;
                --dark-text: #111; --gray-text: #6c757d; --border-color: #dee2e6;
                --card-shadow: 0 4px 12px rgba(0,0,0,0.08); --main-bg: #f3f4f6;
                --natural-color: #28a745; --ad-color: #007bff;
            }
            body { font-family: 'Roboto', 'Arial', sans-serif; margin: 0; background-color: var(--main-bg); color: var(--dark-text); display: flex; transition: padding-left 0.3s ease; scroll-behavior: smooth; }
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

    function getSideNavHTML() {
        return `
        <nav id="side-nav">
            <button id="nav-toggle-btn" title="Collapse/Expand"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button>
            <div class="nav-header"><h2>Analysis Dashboard</h2><p>v10.13.10</p></div>
            <div id="upload-section">
                <div class="control-group">
                    <label for="business-file">Business Report (CSV) <span class="sidetip">?<span class="sidetiptext">Path: Seller Central > Reports > Business Reports > By Date > Sales and Traffic > Download CSV. (Date range should match Campaign Report)</span></span></label>
                    <input type="file" id="business-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="asin-file">Advertised Product Report (CSV) <span class="sidetip">?<span class="sidetiptext">Path: Advertising > Reports > Create report > Report Category: Advertised Product > Run > Download.</span></span></label>
                    <input type="file" id="asin-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="campaign-file">Campaign Report (CSV) <span class="sidetip">?<span class="sidetiptext">Path: Advertising > Reports > Create report > Report Category: Campaign > Unit of time: Monthly (for charts) > Run > Download.</span></span></label>
                    <input type="file" id="campaign-file" accept=".csv,.txt">
                </div>
                <div class="control-group">
                    <label for="keyword-file">Search Term Report (CSV) <span class="sidetip">?<span class="sidetiptext">Path: Advertising > Reports > Create report > Report Category: Search Term > Run > Download.</span></span></label>
                    <input type="file" id="keyword-file" accept=".csv,.txt">
                </div>
            </div>
            <ul class="nav-links">
                <li><button class="nav-btn active" data-target="overview"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><span class="nav-text">Overview</span></button></li>
                <li><button class="nav-btn" data-target="asin-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><span class="nav-text">ASIN Performance</span></button></li>
                <li><button class="nav-btn" data-target="campaign-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2-H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg><span class="nav-text">Campaign Analysis</span></button></li>
                <li><button class="nav-btn" data-target="analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg><span class="nav-text">Keyword Analysis</span></button></li>
            </ul>
            <div class="nav-footer">
                 <button id="export-report-btn" class="nav-btn"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2-H5z"/></svg><span class="nav-text">Export HTML Report</span></button>
            </div>
        </nav>
        `;
    }

    function getOverviewPageHTML() {
        return `
        <div id="page-overview" class="page-content active">
            <div class="page-header"><h1>Overall Performance</h1></div>
            <div class="card" id="account-overview-section">
                <div class="card-header"><h3>Account Overview</h3></div>
                <div id="account-overview-content">
                    <div class="placeholder"><p>Please upload "Business Report" and "Campaign Report" (same date range) to view.</p></div>
                </div>
            </div>
            <div class="card" id="campaign-overview-section">
                <div class="card-header"><h3>Campaign Overview</h3></div>
                <div id="campaign-overview-content">
                    <div class="placeholder"><p>Please upload "Campaign Report" to view.</p></div>
                </div>
            </div>
            <div class="card" id="overall-summary-section">
                 <div class="placeholder"><p>Please upload both reports to generate summary.</p></div>
            </div>
        </div>
        `;
    }

    function getKeywordAnalysisPageHTML() {
        return `
        <div id="page-analysis" class="page-content">
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Keyword Performance Analysis</h1>
                <button id="export-keyword-excel-btn" class="start-analysis-btn" disabled>Export to Excel</button>
            </div>
            <div id="keyword-analysis-container">
                <div class="card">
                    <div class="placeholder"><p>Please upload "Search Term Report" to enable this section.</p></div>
                </div>
            </div>
        </div>
        `;
    }

    function getCampaignAnalysisPageHTML() {
        return `
        <div id="page-campaign-analysis" class="page-content">
            <div class="page-header"><h1>Campaign Analysis & Optimization</h1></div>
            <div id="campaign-analysis-content">
                <div class="placeholder"><p>Please upload "Campaign Report".</p></div>
            </div>
        </div>
        `;
    }

    function getAsinAnalysisPageHTML() {
        return `
        <div id="page-asin-analysis" class="page-content">
             <div class="page-header"><h1>ASIN Performance Analysis</h1></div>
             <div class="card">
                <div class="card-header"><h3>ASIN Spend & Sales Analyzer</h3></div>
                <div id="analyzer-controls">
                    <label for="campaign-selector">Select Campaign:</label>
                    <select id="campaign-selector" disabled>
                        <option>Please upload Advertised Product Report first</option>
                    </select>
                </div>
                <div id="charts-grid-container">
                    <div class="chart-wrapper" id="spend-chart-wrapper">
                        <p>Upload report to see spend chart.</p>
                        <canvas id="spend-chart" style="display:none;"></canvas>
                    </div>
                    <div class="chart-wrapper" id="sales-chart-wrapper">
                         <p>Upload report to see sales chart.</p>
                         <canvas id="sales-chart" style="display:none;"></canvas>
                    </div>
                </div>
                <div id="skewed-campaigns-list"></div>
             </div>
             <div id="asin-analysis-content">
                <div class="card">
                    <div class="placeholder"><p>Please upload "Advertised Product Report" to enable grading analysis.</p></div>
                </div>
            </div>
        </div>
        `;
    }

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

    function getToolHTML() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Amazon Ads Analysis Tool v10.13.10</title>
            ${getDashboardCSS()}
            <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"><\/script>
        </head>
        <body>
            ${getSideNavHTML()}
            ${getMainContentHTML()}
            <script>
                const HEADER_CONFIG = {
                    impressions: ['Impressions', '廣告曝光', '展示量'],
                    clicks: ['Clicks', '點擊', '点击量'],
                    spend: ['Spend', '支出', '花费'],
                    sales: ['7 Day Total Sales', '7 天總銷售額', '7天总销售额'],
                    orders: ['7 Day Total Orders (#)', '7 天總訂單數 (#)', '7天总订单数(#)'],

                    searchTerm: ['Customer Search Term', '客戶搜尋字詞', '客户搜索词'],
                    campaignName: ['Campaign Name', '廣告活動名稱', '广告活动名称'],
                    adGroupName: ['Ad Group Name', '廣告群組名稱', '广告组名称'],
                    targeting: ['Targeting', '關鍵字', '投放'],
                    matchType: ['Match Type', '符合類型', '匹配类型'],

                    status: ['Status', 'Campaign Status', '狀態', '狀態', '状态'],
                    budget: ['Budget', '預算', '预算'],
                    targetingType: ['Targeting Type', '廣告投放類型', '定位类型'],
                    startDate: ['Start Date', '開始日期', '开始日期'],
                    endDate: ['End Date', '結束日期', '結束日期'],

                    advertisedASIN: ['Advertised ASIN', '廣告ASIN', '廣告 ASIN', '广告ASIN'],

                    businessDate: ['Date', '日期'],
                    businessSessions: ['Sessions - Total', 'Sessions', '工作階段 - 總計', '会话数 - 总计'],
                    businessUnitsOrdered: ['Units Ordered', '已訂購單位數量', '已订购商品数量'],
                    businessSales: ['Ordered Product Sales', '訂購產品銷售額', '已订购商品销售额']
                };

                let rawDataObjects = [], headerRow = [], processedGlobalData = [], campaignReportData = [], advertisedProductData = [], reportAverages = null;
                let businessReportData = [];
                let gHighPerf = [], gMediumPerf = [], gLowPerf = [];
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
                        selector.innerHTML = '<option>No valid data found in report</option>';
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
                        spendChartWrapper.innerHTML = '<p>Please select a valid campaign.</p>';
                        salesChartWrapper.innerHTML = '<p>Please select a valid campaign.</p>';
                        return;
                    }

                    const spendData = spendCampaignData[selectedCampaign];
                    if (spendData) {
                        drawPieChart(Object.keys(spendData), Object.values(spendData), 'spend');
                    } else {
                        spendChartWrapper.innerHTML = '<p>No spend data for this campaign.</p>';
                        spendChartWrapper.appendChild(spendChartCanvas);
                        spendChartCanvas.style.display = 'none';
                    }

                    const salesData = salesCampaignData[selectedCampaign];
                    if (salesData) {
                        drawPieChart(Object.keys(salesData), Object.values(salesData), 'sales');
                    } else {
                        salesChartWrapper.innerHTML = '<p>No sales data for this campaign.</p>';
                        salesChartWrapper.appendChild(salesChartCanvas);
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
                    const title = isSpend ? \`\${selector.value} - ASIN Spend Share\` : \`\${selector.value} - ASIN Sales Share\`;

                    chartInstance = new Chart(canvas.getContext('2d'), {
                        type: 'pie',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: isSpend ? 'Spend' : 'Sales',
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
                        const totalSales = Object.values(asinSalesData).reduce((a, b) => a + b, 0);

                        if (totalSpend === 0) continue;

                        let campaignDetails = [];

                        for (const asin in asinSpendData) {
                            const spend = asinSpendData[asin];
                            const sales = asinSalesData[asin] || 0;

                            const spendPct = (spend / totalSpend) * 100;
                            const salesPct = totalSales > 0 ? (sales / totalSales) * 100 : 0;

                            if (spendPct > 50 && Math.abs(spendPct - salesPct) > 20) {
                                campaignDetails.push(
                                    \`\${asin} (Spend:\${spendPct.toFixed(1)}% vs Sales:\${salesPct.toFixed(1)}%)\`
                                );
                            }
                        }

                        if (campaignDetails.length > 0) {
                            skewedResults.push({ name: campaignName, details: campaignDetails.join(', ') });
                        }
                    }

                    let html = '<h4>⚠️ ASINs with Significant Spend-Sales Disparities</h4>';
                    html += '<p style="font-size: 0.85em; color: #555; margin-top: -10px; margin-bottom: 15px; line-height: 1.5;">Spend-to-Sales Ratio: For instance, if ASIN A consumes 80% of the campaign budget but only contributes 10% of the sales, this represents a typical "inefficient imbalance" that requires immediate optimization. Conversely, if ASIN B accounts for a low percentage of spend but generates a high percentage of sales, it presents an opportunity to scale up investment.</p>';

                    if (skewedResults.length > 0) {
                        html += '<ul>';
                        skewedResults.forEach(item => {
                            html += \`<li><strong>\${item.name}:</strong> \${item.details}</li>\`;
                        });
                        html += '</ul>';
                    } else {
                        html += '<p style="font-size: 0.9em; margin: 10px 0 0 0;">No significant spending inefficiencies found across ASINs.</p>';
                    }
                    container.innerHTML = html;
                }

                function resetAsinAnalyzerUI() {
                    selector.innerHTML = '<option>Please upload Advertised Product Report first</option>';
                    selector.disabled = true;
                    spendChartWrapper.innerHTML = '<p>Upload report to see spend chart.</p>';
                    salesChartWrapper.innerHTML = '<p>Upload report to see sales chart.</p>';
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

                function findHeader(headers, key) {
                    const possibleNames = HEADER_CONFIG[key];
                    if (!possibleNames) return null;
                    return headers.find(h => possibleNames.includes(h));
                }

                function parseDate(dateStr) {
                    if (!dateStr || typeof dateStr !== 'string') return null;
                    const parts = dateStr.split(/[\\/.]/);
                    if (parts.length === 3) {
                        // Attempt US/Standard format MM/DD/YYYY or YYYY/MM/DD
                        const month = parseInt(parts[0], 10) - 1;
                        const day = parseInt(parts[1], 10);
                        const year = parseInt(parts[2], 10);
                        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month < 12) {
                            const fullYear = year < 100 ? 2000 + year : year;
                            return new Date(fullYear, month, day);
                        }
                        // Fallback for DD/MM/YYYY (if first attempt failed logic, though simplistic)
                        // This simplistic parser assumes US format primarily as per original script logic.
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

                async function handleBusinessFileUpload() {
                    const container = document.getElementById('account-overview-content');
                    try {
                        const csvText = await readFile(businessFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("Business report is empty or invalid.");

                        const bHeader = parsedData[0];
                        const keys = {
                            date: findHeader(bHeader, 'businessDate'),
                            sessions: findHeader(bHeader, 'businessSessions'),
                            units: findHeader(bHeader, 'businessUnitsOrdered'),
                            sales: findHeader(bHeader, 'businessSales')
                        };

                        if (!keys.date || !keys.sessions || !keys.units || !keys.sales) {
                            throw new Error("Missing required columns in Business Report (Date, Sessions, Units Ordered, Sales).");
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
                        if (parsedData.length < 2) throw new Error("Report is empty or invalid.");
                        headerRow = parsedData[0];
                        const searchTermKey = findHeader(headerRow, 'searchTerm');
                        if (!searchTermKey) throw new Error("Cannot find 'Customer Search Term' column. Please check report type.");
                        rawDataObjects = parsedData.slice(1).map(row => { const obj = {}; headerRow.forEach((key, i) => obj[key] = row[i]); return obj; });
                        processedGlobalData = processData(rawDataObjects);
                        reportAverages = calculateAverages(processedGlobalData);
                        handlePerformanceAnalysis();
                    } catch(error) {
                        keywordAnalysisContainer.innerHTML = \`<div class="card"><div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div></div>\`;
                    }
                }

                async function handleCampaignFileUpload() {
                    const container = document.getElementById('campaign-analysis-content');
                    try {
                        const csvText = await readFile(campaignFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("Campaign report is empty.");
                        const reportHeader = parsedData[0];

                        const keys = {
                           impressions: findHeader(reportHeader, 'impressions'),
                           clicks: findHeader(reportHeader, 'clicks'),
                           orders: findHeader(reportHeader, 'orders'),
                           sales: findHeader(reportHeader, 'sales'),
                           spend: findHeader(reportHeader, 'spend'),
                           targetingType: findHeader(reportHeader, 'targetingType'),
                           status: findHeader(reportHeader, 'status'),
                           campaignName: findHeader(reportHeader, 'campaignName'),
                           budget: findHeader(reportHeader, 'budget'),
                           startDate: findHeader(reportHeader, 'startDate')
                        };

                        if (!keys.campaignName) throw new Error("Cannot find 'Campaign Name' column.");

                        const rawCampaignData = parsedData.slice(1).map(row => { const obj = {}; reportHeader.forEach((key, i) => obj[key] = row[i]); return obj; });

                        rawCampaignData.forEach(item => {
                            item.impressions = getNumber(item, keys.impressions); item.clicks = getNumber(item, keys.clicks);
                            item.orders = getNumber(item, keys.orders); item.sales = getNumber(item, keys.sales);
                            item.spend = getNumber(item, keys.spend);
                            item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0;
                            item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0;
                            item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0;
                            item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0;
                            item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                        });

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

                        const campaignMap = new Map();

                        rawCampaignData.forEach(row => {
                            const name = row[keys.campaignName];
                            if (!name) return;

                            if (!campaignMap.has(name)) {
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

                        aggregatedCampaignData.forEach(c => {
                            c.ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100) : 0;
                            c.cvr = c.clicks > 0 ? (c.orders / c.clicks * 100) : 0;
                            c.cpc = c.clicks > 0 ? (c.spend / c.clicks) : 0;
                            c.acos = c.sales > 0 ? (c.spend / c.sales * 100) : 0;
                            c.roas = c.spend > 0 ? (c.sales / c.spend) : 0;

                            const isGreen = c.ctr > avgMetrics.ctr && c.cvr > avgMetrics.cvr && c.acos < avgMetrics.acos && c.orders > 0;
                            const isRed = c.ctr < avgMetrics.ctr && c.cvr < avgMetrics.cvr && c.acos > avgMetrics.acos && c.sales > 0;

                            if (isGreen) { c.level = 'Green'; c.levelText = 'Good Performance'; }
                            else if (isRed) { c.level = 'Red'; c.levelText = 'Poor Performance'; }
                            else { c.level = 'Orange'; c.levelText = 'Observation Needed'; }
                        });

                        campaignReportData = rawCampaignData;
                        const monthlyChartData = aggregateMonthlyData(rawCampaignData, reportHeader);

                        renderCampaignOverview(rawCampaignData, { keys }, monthlyChartData);
                        renderClassifiedCampaigns(aggregatedCampaignData, avgMetrics, { keys });
                        updateAccountOverview();

                    } catch (error) {
                        campaignReportData = [];
                        console.error(error);
                        document.getElementById('campaign-overview-content').innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                        container.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                    }
                }

                async function handleAsinFileUpload() {
                    const analysisContainer = document.getElementById('asin-analysis-content');
                    try {
                        const csvText = await readFile(asinFileInput.files[0]);
                        const parsedData = parseCSV(csvText);
                        if (parsedData.length < 2) throw new Error("Advertised Product Report is empty.");

                        const reportHeader = parsedData[0];
                        const rawAsinData = parsedData.slice(1).map(row => {
                            const obj = {};
                            reportHeader.forEach((key, i) => obj[key] = row[i]);
                            return obj;
                        });

                        resetAsinAnalyzerUI();
                        const campaignKey = findHeader(reportHeader, 'campaignName');
                        const asinKey = findHeader(reportHeader, 'advertisedASIN');
                        const spendKey = findHeader(reportHeader, 'spend');
                        const salesKey = findHeader(reportHeader, 'sales');

                        if (campaignKey && asinKey && (spendKey || salesKey)) {
                            const newSpendData = {};
                            const newSalesData = {};

                            globalAsinToCampaignMap.clear();

                            rawAsinData.forEach(row => {
                                const campaignName = row[campaignKey];
                                const asin = row[asinKey];
                                const spend = getNumber(row, spendKey);
                                const sales = getNumber(row, salesKey);

                                if (!campaignName || !asin) return;

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

                        const aggregationMap = new Map();
                        const keys = {
                           impressions: findHeader(reportHeader, 'impressions'), clicks: findHeader(reportHeader, 'clicks'),
                           orders: findHeader(reportHeader, 'orders'), sales: salesKey,
                           spend: spendKey, asin: asinKey
                        };

                        if (!keys.asin) { throw new Error("Cannot find 'Advertised ASIN' column. Please check report type."); }

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
                        container.innerHTML = '<div class="placeholder"><p>No data found.</p></div>';
                        return;
                    }

                    let chartHTML = '';
                    if (monthlyChartData && monthlyChartData.labels.length > 0) {
                        chartHTML = \`
                        <div class="campaign-chart-container">
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">Campaign Totals Trend (Monthly)</h4>
                             <canvas id="campaignTotalsChart"></canvas>
                        </div>
                        <div class="campaign-chart-container">
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">Campaign Efficiency Trend (Monthly)</h4>
                             <canvas id="campaignRatiosChart"></canvas>
                        </div>\`;
                    } else {
                        chartHTML = '<div class="placeholder" style="margin-bottom:20px;"><p>No "Start Date" found for trend charts.</p></div>';
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
                        const target = (type.includes('automatic') || type.includes('auto') || type === '自動' || type === '自动投放') ? autoTotals : manualTotals;
                        target.count++;
                        Object.keys(autoTotals).forEach(key => { if(key !== 'count') target[key] += c[key] || 0; });
                    });
                    autoTotals.acos = autoTotals.sales > 0 ? (autoTotals.spend / autoTotals.sales * 100) : 0; manualTotals.acos = manualTotals.sales > 0 ? (manualTotals.spend / manualTotals.sales * 100) : 0;
                    autoTotals.roas = autoTotals.spend > 0 ? (autoTotals.sales / autoTotals.spend) : 0; manualTotals.roas = manualTotals.spend > 0 ? (manualTotals.sales / manualTotals.spend) : 0;
                    autoTotals.spendPerc = grandTotal.spend > 0 ? (autoTotals.spend / grandTotal.spend * 100) : 0; manualTotals.spendPerc = grandTotal.spend > 0 ? (manualTotals.spend / grandTotal.spend * 100) : 0;
                    autoTotals.salesPerc = grandTotal.sales > 0 ? (autoTotals.sales / grandTotal.sales * 100) : 0; manualTotals.salesPerc = grandTotal.sales > 0 ? (manualTotals.sales / grandTotal.sales * 100) : 0;

                    const metricsHTML=\`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">Total Metrics</h4><div class="dashboard-grid total-metrics-grid"><div class="metric-card"><div class="metric-value">\${grandTotal.impressions.toLocaleString()}</div><div class="metric-label">Total Impressions</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.clicks.toLocaleString()}</div><div class="metric-label">Total Clicks</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.orders.toLocaleString()}</div><div class="metric-label">Total Orders</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">Total Spend</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">Total Sales</div></div></div>\`;
                    const avgMetricsHTML = \`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">Average Metrics</h4><div class="dashboard-grid avg-metrics-grid"><div class="metric-card"><div class="metric-value">\${avgCTR.toFixed(2)}%</div><div class="metric-label">Avg CTR</div></div><div class="metric-card"><div class="metric-value">\${avgCVR.toFixed(2)}%</div><div class="metric-label">Avg CVR</div></div><div class="metric-card"><div class="metric-value">\${avgCPC.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">Avg CPC</div></div><div class="metric-card"><div class="metric-value">\${avgACoS.toFixed(2)}%</div><div class="metric-label">Avg ACoS</div></div><div class="metric-card"><div class="metric-value">\${avgRoAS.toFixed(2)}</div><div class="metric-label">Avg RoAS</div></div></div>\`;
                    const typePerformanceHTML = \`<div class="campaign-type-performance-grid"><div class="viz-chart-card"><h4>Spend Share & Performance</h4><div class="type-donut-chart-area"><div class="donut-chart-viz" style="background: conic-gradient(#007bff 0% \${autoTotals.spendPerc}%, var(--amazon-orange) \${autoTotals.spendPerc}% 100%); width: 120px; height: 120px;"></div><ul class="donut-chart-legend" style="width: auto;"><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: #007bff;"></span>Auto Ads</div><span class="legend-percent">\${autoTotals.spendPerc.toFixed(1)}%</span></li><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span>Manual Ads</div><span class="legend-percent">\${manualTotals.spendPerc.toFixed(1)}%</span></li></ul></div><div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;"><div><b>Auto:</b> \${autoTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${autoTotals.acos.toFixed(2)}%</div><div><b>Manual:</b> \${manualTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${manualTotals.acos.toFixed(2)}%</div></div></div><div class="viz-chart-card"><h4>Sales Share & Performance</h4><div class="type-donut-chart-area"><div class="donut-chart-viz" style="background: conic-gradient(#007bff 0% \${autoTotals.salesPerc}%, var(--amazon-orange) \${autoTotals.salesPerc}% 100%); width: 120px; height: 120px;"></div><ul class="donut-chart-legend" style="width: auto;"><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: #007bff;"></span>Auto Ads</div><span class="legend-percent">\${autoTotals.salesPerc.toFixed(1)}%</span></li><li><div class="legend-label-group"><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span>Manual Ads</div><span class="legend-percent">\${manualTotals.salesPerc.toFixed(1)}%</span></li></ul></div><div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;"><div><b>Auto:</b> \${autoTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${autoTotals.roas.toFixed(2)}</div><div><b>Manual:</b> \${manualTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${manualTotals.roas.toFixed(2)}</div></div></div></div>\`;
                    const collapsibleTableHTML=\`<details style="margin-top: 25px;"><summary>Show/Hide All Campaigns Data</summary><div class="table-container">\${createGenericTableHTML([...data].sort((a,b)=>b.spend-a.spend),['Campaign','Status','Budget','Spend','Sales','ACoS','RoAS','Impressions','Clicks','CTR','Orders','CVR'], {keys})}</div></details>\`;

                    container.innerHTML = chartHTML + metricsHTML + avgMetricsHTML + typePerformanceHTML + collapsibleTableHTML;

                    if (monthlyChartData && monthlyChartData.labels.length > 0) {
                        // Chart 1: Totals
                        const ctxTotals = document.getElementById('campaignTotalsChart').getContext('2d');
                        new Chart(ctxTotals, {
                            type: 'line',
                            data: {
                                labels: monthlyChartData.labels,
                                datasets: [
                                    { label: 'Impressions', data: monthlyChartData.impressions, borderColor: '#4bc0c0', backgroundColor: 'rgba(75, 192, 192, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: 'Clicks', data: monthlyChartData.clicks, borderColor: '#36a2eb', backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: 'Orders', data: monthlyChartData.orders, borderColor: '#9966ff', backgroundColor: 'rgba(153, 102, 255, 0.1)', tension: 0.1, yAxisID: 'y-counts' },
                                    { label: 'Spend', data: monthlyChartData.spend, borderColor: '#ff6384', backgroundColor: 'rgba(255, 99, 132, 0.1)', tension: 0.1, yAxisID: 'y-currency' },
                                    { label: 'Sales', data: monthlyChartData.sales, borderColor: '#ffce56', backgroundColor: 'rgba(255, 206, 86, 0.1)', tension: 0.1, yAxisID: 'y-currency' }
                                ]
                            },
                            options: {
                                responsive: true, interaction: { mode: 'index', intersect: false },
                                scales: {
                                    'y-counts': { type: 'linear', position: 'left', title: { display: true, text: 'Count' } },
                                    'y-currency': { type: 'linear', position: 'right', title: { display: true, text: 'Currency ($)' }, grid: { drawOnChartArea: false }, ticks: { callback: value => '$' + value.toLocaleString() } }
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
                                    'y-percent': { type: 'linear', position: 'left', title: { display: true, text: 'Percent (%)' }, ticks: { callback: value => value.toFixed(2) + '%' } },
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
                        container.innerHTML = '<div class="card"><div class="placeholder"><p>No valid data.</p></div></div>';
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
                            <div class="card-header"><h3>Performance Grade Filter</h3></div>
                            <div id="asin-filter-controls" style="padding: 15px;">
                                <button class="asin-filter-btn active" data-category="all">All (\${data.length})</button>
                                <button class="asin-filter-btn" data-category="high">🟢 High Performance (\${highPerfAsins.length})</button>
                                <button class="asin-filter-btn" data-category="medium">🟠 Medium/Still Need Observe (\${mediumPerfAsins.length})</button>
                                <button class="asin-filter-btn" data-category="low">🔴 Low Performance (\${lowPerfAsins.length})</button>
                            </div>
                            <div style="padding: 0 15px 15px 15px; font-size: 0.85em; color: #555; border-top: 1px solid #eee; margin: 0 15px; padding-top: 15px;">
                                <p style="margin:0;"><b>Grading Criteria (vs ASIN Average):</b><br>
                                - <strong style="color: #28a745;">High:</strong> CTR > Avg AND CVR > Avg.<br>
                                - <strong style="color: #dc3545;">Low:</strong> CTR < Avg AND CVR < Avg.<br>
                                - <strong style="color: #fd7e14;">Medium:</strong> All other cases.
                                </p>
                            </div>
                        </div>
                    \`;

                    const headers = ['ASIN', 'Spend', 'Sales', 'ACoS', 'Impressions', 'Clicks', 'CTR', 'Orders', 'CVR'];
                    const resultsHTML = \`
                        <div class="card">
                            <div class="asin-analysis-category" data-category="high"><div class="analysis-section"><h4>🟢 High Performance ASINs</h4><p>These ASINs outperform the average in both CTR and CVR.</p><div class="table-container">\${createTableForAsin(highPerfAsins.sort((a,b) => b.sales - a.sales), headers)}</div></div></div>
                            <div class="asin-analysis-category" data-category="medium"><div class="analysis-section"><h4>🟠 Medium/Still Need Observe ASINs</h4><p>Mixed performance. Need observation or specific optimization.</p><div class="table-container">\${createTableForAsin(mediumPerfAsins.sort((a,b) => b.spend - a.spend), headers)}</div></div></div>
                            <div class="asin-analysis-category" data-category="low"><div class="analysis-section"><h4>🔴 Low Performance ASINs</h4><p>Both CTR and CVR are below average. Possible relevance issues or listings need optimization.</p><div class="table-container">\${createTableForAsin(lowPerfAsins.sort((a,b) => b.spend - a.spend), headers)}</div></div></div>
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
                            const target = (type.includes('automatic') || type.includes('auto') || type === '自動' || type === '自动投放') ? autoTotals : manualTotals;
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
                             <div class="chart-summary-value">Total TACOS: \${totals.tacos.toFixed(2)}%</div>
                             <h4 style="margin: 0 0 15px 0; text-align: center; color: #333; font-size: 1.1em;">TACOS Trend (Monthly)</h4>
                             \${!hasChartData ? \`
                                <div class="placeholder" style="padding: 30px;">
                                    <p style="margin:0;">Chart unavailable.<br><span style="font-size:0.9em; color:#888;">Ensure date ranges overlap in Business & Campaign reports.</span></p>
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
                                <h4>Organic Traffic Share</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalTrafficPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalTrafficPerc}%, var(--ad-color) \${naturalTrafficPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>Organic</div><div class="legend-value">\${totals.naturalSessions.toLocaleString()} <span class="legend-percent">(\${naturalTrafficPerc.toFixed(1)}%)</span></div></li>
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>Ad Clicks</div><div class="legend-value">\${campaignTotals.clicks.toLocaleString()} <span class="legend-percent">(\${adTrafficPerc.toFixed(1)}%)</span></div></li>
                                </ul>
                            </div>
                            <div class="donut-chart-wrapper">
                                <h4>Organic Orders Share</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalOrdersPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalOrdersPerc}%, var(--ad-color) \${naturalOrdersPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>Organic</div><div class="legend-value">\${totals.naturalOrders.toLocaleString()} <span class="legend-percent">(\${naturalOrdersPerc.toFixed(1)}%)</span></div></li>
                                    <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>Ad Orders</div><div class="legend-value">\${campaignTotals.orders.toLocaleString()} <span class="legend-percent">(\${adOrdersPerc.toFixed(1)}%)</span></div></li>
                                </ul>
                            </div>
                            <div class="donut-chart-wrapper">
                                <h4>Organic Sales Share</h4>
                                <div class="donut-viz-container">
                                    <div class="donut-chart-center-label">\${naturalSalesPerc.toFixed(1)}%</div>
                                    <div class="donut-chart-viz" style="background: conic-gradient(var(--natural-color) 0% \${naturalSalesPerc}%, var(--ad-color) \${naturalSalesPerc}% 100%);"></div>
                                </div>
                                <ul class="donut-chart-legend">
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--natural-color);"></span>Organic</div><div class="legend-value">\${totals.naturalSales.toLocaleString('en-US', {style:'currency', currency: 'USD'})} <span class="legend-percent">(\${naturalSalesPerc.toFixed(1)}%)</span></div></li>
                                     <li><div class="legend-label-group"><span class="legend-color-box" style="background:var(--ad-color);"></span>Ad Sales</div><div class="legend-value">\${campaignTotals.sales.toLocaleString('en-US', {style:'currency', currency: 'USD'})} <span class="legend-percent">(\${adSalesPerc.toFixed(1)}%)</span></div></li>
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
                    let suggestions = new Set();

                    // 1. Analyze TACOS Trend
                    if (tacosChartData.tacosData && tacosChartData.tacosData.length > 1) {
                        const startTacos = tacosChartData.tacosData[0];
                        const endTacos = tacosChartData.tacosData[tacosChartData.tacosData.length - 1];
                        if (endTacos > startTacos * 1.1) {
                            findings.push('<li><span class="summary-icon">📉</span><div class="summary-text"><b>Lowlight:</b> TACOS is trending upwards, implying decreasing ad efficiency or sales growth lagging behind ad spend.</div></li>');
                            suggestions.add('<li><span class="summary-icon">1️⃣</span><div class="summary-text"><b>Control TACOS:</b> Check "Campaign Analysis" for Red-light campaigns. Optimize budgets or targets for these campaigns.</div></li>');
                        } else {
                            findings.push('<li><span class="summary-icon">📈</span><div class="summary-text"><b>Highlight:</b> TACOS is stable or decreasing, maintaining a healthy balance between ad spend and total sales.</div></li>');
                        }
                    }

                    // 2. Analyze Ad Dependency (Natural Sales %)
                    if (naturalSalesPerc < 40) {
                        findings.push('<li><span class="summary-icon">⚠️</span><div class="summary-text"><b>Finding:</b> High dependency on ads (Organic Sales < 40%). Risky for long-term margins.</div></li>');
                        suggestions.add('<li><span class="summary-icon">2️⃣</span><div class="summary-text"><b>Boost Organic Rank:</b> Focus on SEO (Title, Bullets) for ASINs bringing ad sales to convert ad orders into organic rank.</div></li>');
                    } else {
                         findings.push('<li><span class="summary-icon">💪</span><div class="summary-text"><b>Finding:</b> Healthy organic base (Organic Sales > 40%), providing a good safety margin.</div></li>');
                    }

                     // 3. Analyze Ad Structure (Auto vs Manual)
                    if (autoTotals.spendPerc > 60 && autoTotals.acos > manualTotals.acos * 1.2) {
                        findings.push('<li><span class="summary-icon">🔬</span><div class="summary-text"><b>Finding:</b> Budget heavily skewed to Auto Ads with lower efficiency (higher ACoS) than Manual Ads.</div></li>');
                        suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>Structure Optimization:</b> Move high-performing keywords (SSS/A grade) from Auto to Manual (Exact Match). Add negative keywords to Auto campaigns.</div></li>');
                    } else if (manualTotals.sales > autoTotals.sales) {
                        suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>Scale Winners:</b> Manual ads are driving sales. Ensure "Green" manual campaigns have sufficient budget and consider bid increases (5-10%) for top placements.</div></li>');
                    } else {
                         suggestions.add('<li><span class="summary-icon">3️⃣</span><div class="summary-text"><b>Maintain Balance:</b> Good structure. Continue harvesting keywords from Auto to Manual for refined targeting.</div></li>');
                    }

                    let suggestionsHTML = Array.from(suggestions).slice(0, 3).join('');

                    container.innerHTML = \`
                        <div class="summary-section" style="margin-top:0;">
                            <h4>Conclusions</h4>
                            <ul>\${findings.join('')}</ul>
                        </div>
                        <div class="summary-section">
                            <h4>Next Steps</h4>
                            <ul>\${suggestionsHTML}</ul>
                        </div>
                    \`;
                }


                // --- Performance Analysis & Suggestions ---
                function calculateAverages(data) { let tI = 0, tC = 0, tS = 0, tSa = 0, tO = 0; data.forEach(i => { tI += i.impressions||0; tC += i.clicks||0; tS += i.spend||0; tSa += i.sales||0; tO += i.orders||0; }); const kC = data.length||1; return { avgCtr: tI>0?(tC/tI*100):0, avgCvr: tC>0?(tO/tC*100):0, avgAcos: tSa>0?(tS/tSa*100):0, avgRoas: tS>0?(tSa/tS):0, avgClicks: tC/kC, avgSpend: tS/kC, avgImpressions: tI/kC }; }
                function getAdSuggestion_v8(item, averages) {
                    const { impressions, clicks, orders, acos, cvr, ctr, spend } = item;
                    const { avgCtr, avgCvr, avgAcos, avgClicks, avgSpend, avgImpressions } = averages;
                    const SIGNIFICANT_CLICKS = 20;
                    const SIGNIFICANT_IMPRESSIONS = 5000;
                    const hasSufficientData = impressions >= SIGNIFICANT_IMPRESSIONS || clicks >= SIGNIFICANT_CLICKS;
                    const formatSuggestion = (diagnosis, suggestionList) => {
                        const s = suggestionList.map(i => \`<li>\${i}</li>\`).join('');
                        return \`<div class='suggestion-wrapper'><div class='suggestion-block'><strong class='suggestion-title'>Diagnosis:</strong>\${diagnosis}</div><div class='suggestion-block'><strong class='suggestion-title'>✅ Advice:</strong><ul>\${s}</ul></div></div>\`;
                    };

                    if (clicks > SIGNIFICANT_CLICKS && spend > avgSpend && orders === 0) {
                        return { level: "F", category: "low", suggestion: formatSuggestion('High clicks (>20) and spend, but ZERO orders.', ['Irrelevant keyword. <b>Action:</b> Add as 【Negative Exact】 immediately.']) };
                    }
                    if (clicks > avgClicks && cvr < avgCvr) {
                        return { level: "E", category: "low", suggestion: formatSuggestion('High clicks, but low CVR, leading to high ACoS.', ['Low conversion usually means Listing issues. <b>Action:</b> Optimize 【Listing, Bullets, A+】. Meanwhile, 【Lower Bid】 to control loss.']) };
                    }
                    if (impressions < 1000 && orders === 0) {
                        return { level: "D", category: "low", suggestion: formatSuggestion('Very low impressions, no orders.', ['Low impressions usually mean 【Low Budget】 or 【Low Bid】. <b>Action:</b> Check budget or increase bid towards suggested range.']) };
                    }
                    if (hasSufficientData && ctr > avgCtr && cvr > avgCvr && (acos < 15 || acos < avgAcos * 0.7)) {
                        return { level: "SSS", category: "high", suggestion: formatSuggestion('Super Star. High CTR & CVR, very low ACoS. Profit driver.', ['<b>Action:</b> Create a dedicated 【Manual Exact】 campaign with high budget.', '<b>Bid:</b> Aggressively 【Increase Bid】 (+30% to +50%) for Top of Search.']) };
                    }
                    if (ctr > avgCtr && cvr > avgCvr) {
                        const s = impressions < SIGNIFICANT_IMPRESSIONS ? '<b>Scenario 1 (Low Imp):</b> Good potential. <b>Action:</b> 【Increase Bid】 (+20% to +40%) to get more exposure.' : '<b>Scenario 2 (High Imp):</b> Mainstay keyword. <b>Action:</b> Steadily 【Increase Bid】 (+10%) and consider 【Exact Match】.';
                        return { level: "A", category: "high", suggestion: formatSuggestion('High Performance. CTR & CVR > Avg. Healthy ACoS.', [s]) };
                    }
                    if ((impressions < avgImpressions || clicks < avgClicks || ctr < avgCtr) && cvr > avgCvr) {
                        return { level: "B", category: "medium", suggestion: formatSuggestion('Potential Winner. Low exposure but high conversion.', ['Bottleneck is exposure. <b>Action:</b> Steadily 【Increase Bid】 (+10% to +15%).', 'Consider moving to a dedicated Ad Group.']) };
                    }
                    if (!hasSufficientData && orders > 0) {
                        return { level: "B", category: "medium", suggestion: formatSuggestion('Potential / Observing. Insufficient data but has orders.', ['Data is insufficient. <b>Action:</b> 【Keep Observing】. Do not change yet.']) };
                    }
                    if (impressions > SIGNIFICANT_IMPRESSIONS && ctr < avgCtr) {
                        return { level: "C", category: "medium", suggestion: formatSuggestion('Low CTR. High impressions (>5000) but low clicks.', ['Listing is not attractive in search results. <b>Action:</b> Optimize 【Main Image, Title, Price, Rating】.']) };
                    }
                    if (!hasSufficientData && orders === 0) {
                        return { level: "C", category: "medium", suggestion: formatSuggestion('Observing. Insufficient data, no orders yet.', ['Too early to tell. <b>Action:</b> 【Keep Observing】 to avoid killing potential keywords.']) };
                    }
                    return { level: "N/A", category: "medium", suggestion: formatSuggestion('Special case.', ['Analyze manually based on product lifecycle.']) };
                }

                function handlePerformanceAnalysis() {
                    if (processedGlobalData.length === 0) {
                        keywordAnalysisContainer.innerHTML = '<div class="card"><div class="placeholder"><p>Please upload "Search Term Report" first.</p></div></div>';
                        return;
                    }
                    keywordAnalysisContainer.innerHTML = '<div class="card"><div class="placeholder"><p>Analyzing data...</p></div></div>';

                    const qualifiedData = processedGlobalData;
                    qualifiedData.forEach(k => { const res = getAdSuggestion_v8(k, reportAverages); k.level = res.level; k.suggestion = res.suggestion; k.category = res.category; });
                    const levelOrder = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 };
                    const sortFn = (a, b) => (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);

                    gHighPerf = qualifiedData.filter(k => k.category === 'high').sort(sortFn);
                    gMediumPerf = qualifiedData.filter(k => k.category === 'medium').sort(sortFn);
                    gLowPerf = qualifiedData.filter(k => k.category === 'low').sort(sortFn);

                    const filterCardHTML = \`
                        <div class="card">
                            <div class="card-header"><h3>Grade Filter & Legend</h3></div>
                            <div id="keyword-filter-controls">
                                <button class="keyword-filter-btn active" data-category="all">✔️🔶⚠️ All (\${qualifiedData.length})</button>
                                <button class="keyword-filter-btn" data-category="high">✔️ High Perf & Potential (\${gHighPerf.length})</button>
                                <button class="keyword-filter-btn" data-category="medium">🔶 Medium & Observing (\${gMediumPerf.length})</button>
                                <button class="keyword-filter-btn" data-category="low">⚠️ Low Perf & Waste (\${gLowPerf.length})</button>
                            </div>
                            <div id="grade-explanation-details">
                                <p>
                                    <b>High Perf:</b><span class="tooltip">👑 SSS<span class="tooltiptext"><b>Super Star.</b><br>Validated across all metrics. CTR & CVR are above the report average. Sufficient data volume (>5,000 impressions or 20 clicks). Ultra-low ACoS (e.g., <15% or far below average), high ROAS, and stable high order volume.</span></span>,
                                    <span class="tooltip">⭐ A<span class="tooltiptext"><b>Mainstay.</b><br>Strong overall performance. CTR & CVR are above the report average. Healthy ACoS (e.g., 15-35% or close to average). These keywords are the stable pillars of your campaign.</span></span>
                                </p>
                                <p>
                                    <b>Observing:</b><span class="tooltip">🌱 B<span class="tooltiptext"><b>Potential.</b><br>Showing promise but needs monitoring or boosting. Low exposure (below average impressions/clicks) but CVR is higher than average. Typically <5,000 impressions and <20 clicks, but Orders > 0.</span></span>,
                                    <span class="tooltip">👀 C<span class="tooltiptext"><b>Mediocre / Insufficient Data.</b><br>Hard to judge due to lack of data, or failing at the CTR stage. Either insufficient data (<5,000 impressions, <20 clicks, 0 Orders) OR sufficient impressions (>5,000) but CTR is far below average.</span></span>
                                </p>
                                <p>
                                    <b>Low Perf:</b><span class="tooltip">📉 D<span class="tooltiptext"><b>Low Impressions.</b><br>Active ads generating almost no visibility. The issue lies in the initial delivery stage. Negligible impressions and 0 Orders. Requires reviewing bids and budget settings.</span></span>,
                                    <span class="tooltip">💔 E<span class="tooltiptext"><b>Low Conversion.</b><br>High clicks but low orders. High accumulated clicks (> report average) but CVR is far below average, causing very high ACoS. Your product detail page needs optimization.</span></span>,
                                    <span class="tooltip">🕳️ F<span class="tooltiptext"><b>Budget Waster.</b><br>The highest priority for removal. High spend but ZERO orders. High clicks (e.g., >20) and spend > average, but 0 Orders.</span></span>
                                </p>
                            </div>
                        </div>
                    \`;

                    const summaryCardHTML = \`
                        <div class="card" id="keyword-overview-moved-section">
                            <div class="card-header"><h3>Keyword Overview</h3></div>
                            <div id="keyword-grade-summary">
                                <div class="placeholder"><p>Generating summary...</p></div>
                            </div>
                            <div id="keyword-overview-summary"></div>
                        </div>
                    \`;

                    const analysisHeaders = ['Keyword/ASIN', 'Spend', 'Impressions', 'Clicks', 'Orders', 'CTR', 'CVR', 'ACoS', 'RoAS', 'Grade', 'Suggestion'];
                    const resultsHTML = \`
                        <div class="card">
                            <div class="keyword-analysis-category" data-category="high"><div class="analysis-section"><h4>✔️ High Performance: Scale Up</h4><p>Strategy: Maximize exposure and bid aggressively.</p><div class="table-container">\${createTable(gHighPerf, analysisHeaders)}</div></div></div>
                            <div class="keyword-analysis-category" data-category="medium"><div class="analysis-section"><h4>🔶 Medium Performance: Observe/Diagnose</h4><p>Strategy: Fine-tune bids or wait for more data.</p><div class="table-container">\${createTable(gMediumPerf, analysisHeaders)}</div></div></div>
                            <div class="keyword-analysis-category" data-category="low"><div class="analysis-section"><h4>⚠️ Low Performance: Cut Loss</h4><p>Strategy: Negative keywords or optimize listing.</p><div class="table-container">\${createTable(gLowPerf, analysisHeaders)}</div></div></div>
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
                function renderKeywordGradeSummary(data) { const container = document.getElementById('keyword-grade-summary'); if (!data || data.length === 0) { container.innerHTML = '<div class="placeholder"><p>No data.</p></div>'; return; } const gradeMap = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1, 'N/A': 0 }; const levelMap = [ { score: 1, level: 'F', comment: 'Serious Loss' }, { score: 2, level: 'E', comment: 'Optimize Listing' }, { score: 3, level: 'D', comment: 'Low Exposure' }, { score: 4, level: 'C', comment: 'Mediocre' }, { score: 5, level: 'B', comment: 'Potential' }, { score: 6, level: 'A', comment: 'Growth' }, { score: 7, level: 'SSS', comment: 'Super Star' }]; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; const gradeOrder = ['SSS', 'A', 'B', 'C', 'D', 'E', 'F', 'N/A']; let totalScore = 0; const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; totalScore += gradeMap[result.level] || 0; }); const avgScore = data.length > 0 ? totalScore / data.length : 0; const avgGradeInfo = levelMap.reduce((prev, curr) => Math.abs(curr.score - avgScore) < Math.abs(prev.score - avgScore) ? curr : prev); const leftHTML = \`<div class="avg-grade-container"><div class="avg-grade-display">\${levelEmojis[avgGradeInfo.level]}</div><div class="avg-grade-level">\${avgGradeInfo.level}</div><div class="avg-grade-comment">Avg Perf: \${avgGradeInfo.comment}</div></div>\`; let rightHTML = '<div class="grade-dist-container"><h4>Grade Distribution</h4><ul class="grade-dist-list">'; gradeOrder.forEach(level => { if (gradeCounts[level] > 0) { const percentage = (gradeCounts[level] / data.length * 100).toFixed(1); rightHTML += \`<li class="grade-dist-item"><div class="grade-dist-label">\${levelEmojis[level]} \${level}</div><div class="grade-dist-bar-bg"><div class="grade-dist-bar" style="width: \${percentage}%;"></div></div><div class="grade-dist-value">\${percentage}%</div></li>\`; } }); rightHTML += '</ul></div>'; container.innerHTML = leftHTML + rightHTML; }
                function renderKeywordOverviewSummary(data) { const container = document.getElementById('keyword-overview-summary'); if (!data || data.length === 0) { container.innerHTML = ''; return; } const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; }); const totalKeywords = data.length; const highPerfCount = gradeCounts['SSS'] + gradeCounts['A']; const lowPerfCount = gradeCounts['E'] + gradeCounts['F']; const midPerfCount = totalKeywords - highPerfCount - lowPerfCount; const highPerfPerc = totalKeywords > 0 ? (highPerfCount / totalKeywords) * 100 : 0; const lowPerfPerc = totalKeywords > 0 ? (lowPerfCount / totalKeywords) * 100 : 0; let summaryHTML = '<div class="summary-section keyword-summary-section"><h4>Conclusion & Next Steps</h4><ul>'; if (totalKeywords === 0) { summaryHTML += '<li>No keywords found.</li>'; } else if (highPerfPerc >= 40) { summaryHTML += '<li><b>Finding:</b> Account health is excellent. Most keywords are High Performance (SSS/A).</li><li><b>Next Step:</b> Scale up! Move top keywords to 【Exact Match】 campaigns and increase budgets.</li>'; } else if (lowPerfPerc >= 35) { summaryHTML += '<li><b>Finding:</b> Significant budget waste. Many Low Performance (E/F) keywords.</li><li><b>Next Step:</b> Add F-grade words as 【Negative Exact】. Pause or lower bids for E-grade words and optimize Listing.</li>'; } else if ((midPerfCount / totalKeywords) >= 0.5) { summaryHTML += '<li><b>Finding:</b> Most keywords are in Pontential/Need-Observation phase (B/C/D).</li><li><b>Next Step:</b> Patience & Fine-tuning. Slightly Increase Bids to gain more exposure opportunities for B grade. Analyzing CTR for C/D grade. If the CTR is too low, you must optimize the Main Image/Title; otherwise, identify the keyword as irrelevant and lower bids accordingly. </li>'; } else { summaryHTML += '<li><b>Finding:</b> Balanced performance.</li><li><b>Next Step:</b> Scale winners, cut losers, and observe the rest.</li>'; } summaryHTML += '</ul></div>'; container.innerHTML = summaryHTML; }

                // --- Campaign Analysis Functions ---
                function getCampaignSuggestions(campaign, isAuto) {
                    let diagnosis = '';
                    let suggestions = [];
                    const { spend, sales, orders, impressions, acos, ctr } = campaign;
                    const hasSignificantSpend = spend > 20;
                    const hasSales = sales > 0;
                    const highACoSThreshold = 50;

                    if (isAuto) {
                        if (hasSignificantSpend && !hasSales) {
                            diagnosis = 'High spend with NO sales. Likely irrelevant traffic or listing issue.';
                            suggestions = [
                                '<b>Action:</b> Download Search Term Report.',
                                '<b>Cut Loss:</b> Add irrelevant terms as Negative Keywords.',
                                '<b>Check Listing:</b> Ensure product attributes are buried in listing for better auto-matching.'
                            ];
                        } else if (acos > highACoSThreshold && hasSignificantSpend) {
                            diagnosis = 'High ACoS indicates low efficiency. While Automatic campaigns are for discovery, budget waste must be controlled.';
                            suggestions = [
                                '<b>Core Optimization:</b> Download the "Search Term Report"—this is the most valuable output of an automatic campaign.',
                                '<b>Harvest Keywords (High Conversion):</b> Identify high-converting long-tail/brand keywords from the report that meet your ACoS targets. Add them to Manual campaigns using [Exact Match] with higher bids and budgets.',
                                '<b>Harvest ASINs (High Conversion):</b> Similarly, identify high-converting competitor ASINs from the report and add them to [Product Targeting] campaigns.',
                                '<b>Negative Match(Zero Conversion):</b> Add search terms with high clicks but no conversions as [Negative Keywords] to stop the bleeding immediately.',
                            ];
                        } else if (acos <= highACoSThreshold && hasSales) {
                            diagnosis = 'Good Performance. Auto ad is finding cheap traffic.';
                            suggestions = [
                                '<b>Harvest:</b> Regularly move winners to Manual campaigns.',
                                '<b>Maintain:</b> Keep running to find new keywords/ASINs.',
                            ];
                        } else {
                            diagnosis = 'Low data or exploration phase.';
                            suggestions = [
                                '<b>Observe:</b> Wait for more data.',
                                '<b>Check Bid:</b> If impressions are low, increase bid slightly.'
                            ];
                        }
                    } else { // Manual Campaign
                        if (hasSignificantSpend && !hasSales) {
                            diagnosis = 'Budget Waster. High spend but zero conversions, requiring urgent attention.';
                            suggestions = [
                                '<b>Immediate Review:</b> Check all targets(keywords/products/categories) in this campaign.',
                                '<b>Pause Ineffective Targets:</b> Pause keywords/ASINs with high spend and 0 orders.',
                                '<b>Check Relevance:</b> Ensure the targeted keywords/products are highly relevant to your item.'
                            ];
                        } else if (acos > highACoSThreshold && hasSignificantSpend) {
                            diagnosis = 'ACoS is far beyond the healthy range, resulting in low ROI and eroding profits';
                            suggestions = [
                                '<b>Lower Bids:</b> Based on the Search Term Report, reduce bids on high ACoS targets.',
                                '<b>Negate:</b> If using "Broad" or "Phrase" match, you must review the "Search Term Report" and add irrelevant terms as [Negative Keywords].',
                                '<b>Check Listing:</b> High clicks/low sales often means poor listing conversion. Check if your price, reviews, inventory, and main image are competitive.'
                            ];
                        } else if (acos <= highACoSThreshold && hasSales) {
                            diagnosis = 'This is a top-performing campaign and a key profit driver. Prioritize maintaining and scaling it.';
                            suggestions = [
                                '<b>Secure Budget:</b> Ensure this campaign has enough budget or set up budget rules to prevent missing out on orders due to budget exhaustion.',
                                '<b>Increase Bid:</b> Try slightly increasing bids (e.g., 5-10%) on the best-performing core keywords/targets to compete for better ad ranking and more visibility.',
                                '<b>Traffic Defense:</b> If this is a Brand Keyword campaign, try to use [Broad Match] combined with the lower end of the "Suggested Bid" range. This captures traffic at a low cost, aiding in brand building and defensive strategy.',
                            ];
                        } else if (impressions > 5000 && ctr < 0.4) {
                            diagnosis = 'High impressions but a relatively low CTR, suggesting the listing performance, ads placements or targeting relevance needs improvement.';
                            suggestions = [
                                '<b>Main Image:</b> Check if your [Main Image] is attractive enough to stand out in the search results.',
                                '<b>Title & Price:</b> Ensure Title includes core keywords, Price is competitive, and adopt merchandising tools (Ex: Deals, PED, Coupons).',
                                '<b>Relevance:</b> Re-evaluate if the targeted keywords highly match the product.'
                            ];
                        } else {
                            diagnosis = 'Insufficient data or average performance; currently in the observation phase.';
                            suggestions = [
                                '<b>Continue Observing:</b> Allow the campaign to run longer to accumulate more data for accurate decision-making.',
                                '<b>Check Bid:</b> If impressions are too low, it may be due to [Insufficient Bids]. Refer to Amazon "Suggested Bid" range and adjust accordingly.',
                                '<b>Expand Targets:</b> Suggest to have at least 30 Keywords or sufficient ASINs/categories in a manual ad group to increase exposure opportunities.'
                            ];
                        }
                    }
                    return { diagnosis, suggestions };
                }

                function renderClassifiedCampaigns(data, avgMetrics, { keys }) {
                    const container = document.getElementById('campaign-analysis-content');
                    if (!campaignReportData || campaignReportData.length === 0) {
                        container.innerHTML = '<div class="placeholder"><p>No Campaign Data.</p></div>';
                        return;
                    }

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

                    const filterHTML = \`
                        <div class="card" style="margin-bottom:25px;">
                            <div class="card-header"><h3>Filters & Comparison</h3></div>
                            <div id="campaign-filter-controls" style="padding: 15px;">
                                <div style="margin-bottom: 20px; border-bottom: 1px dashed #eee; padding-bottom: 15px;">
                                    <label style="font-weight: 500; font-size: 0.9em; margin-bottom: 8px; display: block;">Select Months to Compare (Multi-select):</label>
                                    <div id="month-select-container" style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        \${sortedMonths.map(m => \`<label style="font-size: 0.9em; display: flex; align-items: center; background: #f8f9fa; padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"><input type="checkbox" class="month-checkbox" value="\${m}" style="margin-right: 6px;"> \${m}</label>\`).join('')}
                                    </div>
                                    <p style="font-size: 0.8em; color: #666; margin-top: 5px; margin-bottom: 0;">* Default: All time aggregated. Select multiple months to see MoM growth (PoP).</p>
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <span style="font-weight: 500; font-size: 0.9em; margin-right: 10px;">Performance Level:</span>
                                    <button class="campaign-filter-btn active" data-level="All">All</button>
                                    <button class="campaign-filter-btn" data-level="Green">🟢 Good</button>
                                    <button class="campaign-filter-btn" data-level="Orange">🟠 Medium/Need Observing</button>
                                    <button class="campaign-filter-btn" data-level="Red">🔴 Poor</button>
                                </div>

                                <div style="border-top: 1px dashed #eee; padding-top: 10px; display: flex; align-items: center; gap: 10px;">
                                    <label for="campaign-asin-search" style="font-size: 0.9em; font-weight: 500;">ASIN Lookup:</label>
                                    <input type="text" id="campaign-asin-search" placeholder="Enter ASIN (Requires Product Report)" style="width: 250px; padding: 6px; border: 1px solid #dee2e6; border-radius: 4px;">
                                    <button id="campaign-asin-btn" class="campaign-filter-btn" style="padding: 6px 12px; font-size: 0.85em;">Search</button>
                                    <button id="campaign-asin-reset-btn" class="clear-btn">Reset</button>
                                </div>
                            </div>
                        </div>\`;

                    container.innerHTML = filterHTML + '<div id="campaign-list-container"></div>';

                    const renderList = (groupedData, isComparisonMode) => {
                        const listContainer = document.getElementById('campaign-list-container');
                        if (!groupedData || groupedData.length === 0) {
                            listContainer.innerHTML = '<p style="text-align:center; padding: 20px; color:#666;">No campaigns match criteria.</p>';
                            return;
                        }

                        const levelOrder = { 'Green': 1, 'Orange': 2, 'Red': 3 };
                        const sortedGroups = [...groupedData].sort((a, b) => {
                             return (levelOrder[a.summary.level] || 4) - (levelOrder[b.summary.level] || 4);
                        });

                        let html = '';
                        sortedGroups.forEach(group => {
                            const summary = group.summary;
                            const rows = group.rows;

                            const isAuto = (summary[keys.targetingType] || '').toLowerCase().includes('auto') || (summary[keys.targetingType] || '') === '自動';
                            const { diagnosis, suggestions } = getCampaignSuggestions(summary, isAuto);
                            const campaignNameKey = findHeader(Object.keys(summary), 'campaignName');
                            const campaignName = summary[campaignNameKey] || 'Unknown';

                            html += \`<details class="campaign-analysis-item" data-level="\${summary.level}">
                                <summary>
                                    <span class="campaign-level-indicator level-\${summary.level}" title="\${summary.levelText}"></span>
                                    <span class="campaign-title">\${campaignName}</span>
                                    <span class="campaign-tag \${isAuto ? 'auto' : 'manual'}">\${isAuto ? 'Auto' : 'Manual'}</span>
                                </summary>
                                <div class="analysis-content">
                                    <table class="campaign-metrics-table">
                                        <thead>
                                            <tr>
                                                \${isComparisonMode ? '<th>Month</th>' : ''}
                                                <th>Imp</th><th>Clicks</th><th>Orders</th><th>Spend</th><th>Sales</th><th>CTR</th><th>CVR</th><th>CPC</th><th>ACoS</th><th>RoAS</th>
                                            </tr>
                                        </thead>
                                        <tbody>\`;

                            rows.forEach((row, index) => {
                                let popData = {};

                                if (isComparisonMode && index > 0) {
                                    const prevRow = rows[index - 1];
                                    if (!row.isMissing && !prevRow.isMissing) {
                                        const calcPoP = (curr, prev, isPct) => {
                                            if (!prev || prev === 0 && !isPct) return null;
                                            if (isPct) {
                                                const diff = curr - prev;
                                                return { val: Math.round(diff * 100), unit: 'bps' };
                                            } else {
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
                                        <td colspan="10" style="color:#999; text-align:center;">- No Data -</td>
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
                                        <div class="analysis-block"><h4>📈 Diagnosis(Selected Period)</h4><p>\${diagnosis}</p></div>
                                        <div class="analysis-block"><h4>💡 Advice</h4><ul>\${suggestions.map(s => \`<li>\${s}</li>\`).join('')}</ul></div>
                                    </div>
                                </div>
                            </details>\`;
                        });
                        listContainer.innerHTML = sortedGroups.length ? html : '<p>No Data</p>';
                    };

                    const updateDataAndRender = () => {
                        const selectedMonths = Array.from(document.querySelectorAll('.month-checkbox:checked')).map(cb => cb.value);
                        let displayGroups = [];
                        const isComparisonMode = selectedMonths.length > 0;

                        if (!isComparisonMode) {
                            displayGroups = data.map(item => ({
                                summary: item,
                                rows: [item]
                            }));
                        } else {
                            const filteredRaw = campaignReportData.filter(row => {
                                const date = parseDate(row[keys.startDate]);
                                if (!date) return false;
                                const mKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
                                return selectedMonths.includes(mKey);
                            });

                            const uniqueNames = new Set();
                            filteredRaw.forEach(r => { if(r[keys.campaignName]) uniqueNames.add(r[keys.campaignName]); });

                            const monthlyAggMap = new Map();

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

                            uniqueNames.forEach(name => {
                                const groupRows = [];
                                const groupSummary = {
                                    [keys.campaignName]: name,
                                    impressions: 0, clicks: 0, spend: 0, sales: 0, orders: 0
                                };

                                selectedMonths.forEach(m => {
                                    const compositeKey = \`\${name}|\${m}\`;
                                    if (monthlyAggMap.has(compositeKey)) {
                                        const c = monthlyAggMap.get(compositeKey);
                                        c.ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100) : 0;
                                        c.cvr = c.clicks > 0 ? (c.orders / c.clicks * 100) : 0;
                                        c.cpc = c.clicks > 0 ? (c.spend / c.clicks) : 0;
                                        c.acos = c.sales > 0 ? (c.spend / c.sales * 100) : 0;
                                        c.roas = c.spend > 0 ? (c.sales / c.spend) : 0;

                                        groupSummary.impressions += c.impressions;
                                        groupSummary.clicks += c.clicks;
                                        groupSummary.spend += c.spend;
                                        groupSummary.sales += c.sales;
                                        groupSummary.orders += c.orders;
                                        if(!groupSummary[keys.targetingType]) groupSummary[keys.targetingType] = c[keys.targetingType];
                                        if(!groupSummary[keys.status]) groupSummary[keys.status] = c[keys.status];

                                        groupRows.push(c);
                                    } else {
                                        groupRows.push({ month: m, isMissing: true });
                                    }
                                });

                                groupSummary.ctr = groupSummary.impressions > 0 ? (groupSummary.clicks / groupSummary.impressions * 100) : 0;
                                groupSummary.cvr = groupSummary.clicks > 0 ? (groupSummary.orders / groupSummary.clicks * 100) : 0;
                                groupSummary.cpc = groupSummary.clicks > 0 ? (groupSummary.spend / groupSummary.clicks) : 0;
                                groupSummary.acos = groupSummary.sales > 0 ? (groupSummary.spend / groupSummary.sales * 100) : 0;
                                groupSummary.roas = groupSummary.spend > 0 ? (groupSummary.sales / groupSummary.spend) : 0;

                                const isGreen = groupSummary.ctr > avgMetrics.ctr && groupSummary.cvr > avgMetrics.cvr && groupSummary.acos < avgMetrics.acos && groupSummary.orders > 0;
                                const isRed = groupSummary.ctr < avgMetrics.ctr && groupSummary.cvr < avgMetrics.cvr && groupSummary.acos > avgMetrics.acos && groupSummary.sales > 0;
                                if (isGreen) { groupSummary.level = 'Green'; groupSummary.levelText = 'Good'; }
                                else if (isRed) { groupSummary.level = 'Red'; groupSummary.levelText = 'Poor'; }
                                else { groupSummary.level = 'Orange'; groupSummary.levelText = 'Observing'; }

                                displayGroups.push({
                                    summary: groupSummary,
                                    rows: groupRows
                                });
                            });
                        }

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

                    updateDataAndRender();

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

                function sortColumn(event, colIndex) { const header = event.currentTarget; const table = header.closest('table'); const tbody = table.querySelector('tbody'); const rows = Array.from(tbody.querySelectorAll('tr')); rows.sort((a, b) => { const cellA = a.cells[colIndex]?.innerText || ''; const cellB = b.cells[colIndex]?.innerText || ''; if (colIndex === 0) { return cellB.localeCompare(cellA, ['en-US']); } const valA = parseFloat(String(cellA).replace(/[^0-9.-]+/g, '')) || -Infinity; const valB = parseFloat(String(cellB).replace(/[^0-9.-]+/g, '')) || -Infinity; return valB - valA; }); table.querySelectorAll('th').forEach(th => { th.innerHTML = th.innerHTML.replace(/ ▼$/, ''); }); if (!header.innerHTML.includes('▼')) { header.innerHTML += ' ▼'; } tbody.append(...rows); }

                function createTable(data, headers) { const isAnalysisTable = headers.includes('Suggestion'); const dataToRender = isAnalysisTable ? data : [...data].sort((a, b) => b.impressions - a.impressions); if (!dataToRender || dataToRender.length === 0) return '<p style="padding:15px; text-align:center;"><i>No Data</i></p>'; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; dataToRender.forEach(row => { const levelDisplay = isAnalysisTable ? \`\${levelEmojis[row.level] || ''} \${row.level}\` : ''; const cells = { 'Keyword/ASIN': row.searchTerm, 'ASIN': row.asin, 'Grade': levelDisplay, 'Suggestion': row.suggestion || '---', 'Spend': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, 'Impressions': row.impressions.toLocaleString(), 'Clicks': row.clicks.toLocaleString(), 'Orders': row.orders.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, 'CVR': \`\${row.cvr.toFixed(2)}%\`, 'ACoS': \`\${row.acos.toFixed(1)}%\`, 'RoAS': row.roas.toFixed(2), 'Keyword': row.searchTerm, 'CPC': \`\${row.cpc.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, 'Sales': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`}; table += '<tr>'; headers.forEach(h => { let cellContent = (cells[h] !== undefined) ? String(cells[h]) : '---'; if (h !== 'Suggestion' && h !== 'Grade') { cellContent = cellContent.replace(/</g, "&lt;").replace(/>/g, "&gt;"); } if (h === 'Grade') { table += \`<td style="text-align: center; font-weight: bold;">\${cellContent}</td>\`; } else { table += \`<td>\${cellContent}</td>\`; } }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
                function createGenericTableHTML(data, headers, { keys }) { if (!data || data.length === 0) return '<p><i>No Data</i></p>'; const campaignNameKey = findHeader(Object.keys(data[0]), 'campaignName'); const statusKey = findHeader(Object.keys(data[0]), 'status'); const budgetKey = findHeader(Object.keys(data[0]), 'budget'); let tableHTML = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => tableHTML += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); tableHTML += '</tr></thead><tbody>'; data.forEach(row => { tableHTML += '<tr>'; const cellData = { 'Campaign': row[campaignNameKey], 'Status': row[statusKey], 'Budget': row[budgetKey], 'Spend': row.spend, 'Sales': row.sales, 'ACoS': row.acos, 'RoAS': row.roas, 'Impressions': row.impressions, 'Clicks': row.clicks, 'CTR': row.ctr, 'Orders': row.orders, 'CVR': row.cvr }; headers.forEach(header => { let cellContent = (cellData[header] !== undefined && cellData[header] !== null) ? cellData[header] : '---'; if (typeof cellContent === 'number') { if (['Spend', 'Sales', 'Budget'].includes(header)) { cellContent = \`\${cellContent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`; } else if (['ACoS', 'CTR', 'CVR'].includes(header)) { cellContent = \`\${cellContent.toFixed(2)}%\`; } else if (header === 'RoAS') { cellContent = cellContent.toFixed(2); } else { cellContent = cellContent.toLocaleString(); } } tableHTML += \`<td>\${cellContent}</td>\`; }); tableHTML += '</tr>'; }); tableHTML += '</tbody></table>'; return tableHTML; }
                function createTableForAsin(data, headers) { if (!data || data.length === 0) return '<p style="padding:15px; text-align:center;"><i>No Data</i></p>'; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; data.forEach(row => { const cells = { 'ASIN': row.asin, 'Spend': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, 'Sales': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, 'ACoS': \`\${row.acos.toFixed(1)}%\`, 'Impressions': row.impressions.toLocaleString(), 'Clicks': row.clicks.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, 'Orders': row.orders.toLocaleString(), 'CVR': \`\${row.cvr.toFixed(2)}%\` }; table += '<tr>'; headers.forEach(h => { table += \`<td>\${cells[h] !== undefined ? cells[h] : '---'}</td>\`; }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
                function parseCSV(text) { let result = []; let lines = text.split(/\\r\\n|\\n/); if (lines.length > 0 && lines[0].charCodeAt(0) === 0xFEFF) lines[0] = lines[0].substring(1); for (let i = 0; i < lines.length; i++) { if (!lines[i].trim()) continue; let row = []; let current = ''; let inQuotes = false; for (let j = 0; j < lines[i].length; j++) { let char = lines[i][j]; if (char === '"') { if (inQuotes && j < lines[i].length - 1 && lines[i][j+1] === '"') { current += '"'; j++; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; } else { current += char; } } row.push(current.trim()); result.push(row); } return result; }
                function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = event => resolve(event.target.result); reader.onerror = error => reject(error); reader.readAsText(file, 'UTF-8'); }); }
                function getNumber(item, key) {
                    if (!key || item[key] === undefined || item[key] === '') return 0;
                    const cleanedString = String(item[key]).replace(/[^0-9.-]+/g,"");
                    return parseFloat(cleanedString) || 0;
                }
                function getMedian(arr) { if (!arr.length) return 0; const sorted = arr.slice().sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); if (sorted.length % 2 === 0) { return (sorted[mid - 1] + sorted[mid]) / 2; } return sorted[mid]; }

                function exportDashboardToHTML() {
                    const now = new Date();
                    const timestamp = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;
                    const filename = \`Amazon_Ads_Analysis_Report_\${timestamp}.html\`;

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
                function exportKeywordAnalysisToExcel() { if (gHighPerf.length === 0 && gMediumPerf.length === 0 && gLowPerf.length === 0) { alert('No data to export.'); return; } const headers = ["Category", "Keyword/ASIN", "Spend", "Impressions", "Clicks", "Orders", "CTR(%)", "CVR(%)", "ACoS(%)", "RoAS", "Grade", "Suggestion"]; const dataRows = []; const processCategory = (data, categoryName) => { data.forEach(row => { const rowData = [ categoryName, row.searchTerm || 'N/A', row.spend || 0, row.impressions || 0, row.clicks || 0, row.orders || 0, row.ctr ? row.ctr.toFixed(2) : '0.00', row.cvr ? row.cvr.toFixed(2) : '0.00', row.acos ? row.acos.toFixed(1) : '0.0', row.roas ? row.roas.toFixed(2) : '0.00', row.level || 'N/A', row.suggestion || '---' ]; dataRows.push(rowData); }); }; processCategory(gHighPerf, 'High Performance'); processCategory(gMediumPerf, 'Observing'); processCategory(gLowPerf, 'Low Performance'); const csvContent = [ headers.join(','), ...dataRows.map(row => row.map(formatCsvCell).join(',')) ].join('\\n'); const now = new Date(); const timestamp = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`; const filename = \`Keyword_Analysis_\${timestamp}.csv\`; const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
            <\/script>
        </body>
        </html>`;
    }

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
        textSpan.textContent = 'Amazon Ads Analysis Tool:';
        const button = document.createElement('button');
        button.id = 'gemini-report-generator-btn';
        button.textContent = '🚀 Launch Dashboard (v10.13.10 English)';
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