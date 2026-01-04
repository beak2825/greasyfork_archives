// ==UserScript==
// @name         亞馬遜廣告分析工具 (v8.3 儀表板強化版)
// @namespace    http://tampermonkey.net/
// @version      8.3
// @description  【儀表板強化】1. 整體績效概覽頁，補回「平均指標」卡片。 2. ASIN總覽區塊新增可收合的詳細數據表。 3. 為概覽頁的三大核心表格（廣告活動、ASIN、關鍵字）表頭增加點擊排序功能。
// @author       Gemini (Dashboard Designer & Analyst)
// @match        https://gs.amazon.com.tw/onboarding-service*
// @match        https://sellercentral.amazon.com/*
// @match        https://advertising.amazon.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGOTkwMCIgd2lkd2g9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNC4xNyA1SDVWMTloMTJ2LTkuMTdMMTQuMTcgNXptLTYuMzUgMTFMMTYgNy44MyAxOC4xNyAxMEw5LjgzIDE4LjE3IDcgMThsLjgyLTQuMTV6TTIwLjcxIDcuNDFsLTIuNTQtMi4xZMtLjM5LS43NDFsLTIuNTQtMi4xZMtLjM5LS4zOS0xLjAyLS4zOS0xLjQxIDBsLTEuMjkgMS4yOSA0IDQgMS4yOS0xLjjjDy5Yy4zOS0uMzguMzktMS4wMiAwLTEuNDF6Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/549086/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v83%20%E5%84%80%E8%A1%A8%E6%9D%BF%E5%BC%B7%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549086/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v83%20%E5%84%80%E8%A1%A8%E6%9D%BF%E5%BC%B7%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 啟動按鈕的樣式 (與旧版保持一致)
    GM_addStyle(`
        #gemini-report-banner { position: fixed; top: 0; left: 0; width: 100%; background-color: #232f3e; color: #fff; padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 2147483647 !important; display: flex; align-items: center; justify-content: center; font-family: 'Noto Sans TC', sans-serif; }
        #gemini-report-banner span { font-size: 14px; font-weight: 500; margin-right: 15px; }
        #gemini-report-generator-btn { background: linear-gradient(to bottom, #f7dfa5, #f0c14b); color: #111; border: 1px solid #a88734; border-radius: 4px; padding: 6px 12px; font-size: 14px; font-weight: bold; text-shadow: 0 1px 0 rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s ease; }
        #gemini-report-generator-btn:hover { background: linear-gradient(to bottom, #f5d78e, #eeb933); border-color: #9c7e31; }
        body { margin-top: 50px !important; }
    `);

    // 核心函式：產生新的儀表板 HTML 內容
    function getToolHTML() {
        return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>互動式廣告分析工具 v8.3</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
        :root {
            --amazon-orange: #FF9900; --amazon-yellow: #f5c242; --amazon-blue: #232f3e;
            --dark-bg: #131921; --nav-hover: #232f3e; --light-text: #FFFFFF;
            --dark-text: #111; --gray-text: #6c757d; --border-color: #dee2e6;
            --card-shadow: 0 4px 12px rgba(0,0,0,0.08); --main-bg: #f3f4f6;
        }
        body { font-family: 'Noto Sans TC', sans-serif; margin: 0; background-color: var(--main-bg); color: var(--dark-text); display: flex; transition: padding-left 0.3s ease; scroll-behavior: smooth; }
        #side-nav { position: fixed; top: 0; left: 0; width: 260px; height: 100vh; background-color: var(--dark-bg); color: var(--light-text); display: flex; flex-direction: column; padding: 20px 10px; box-sizing: border-box; transition: width 0.3s ease; z-index: 1000; }
        .nav-header { text-align: center; padding: 0 10px 20px 10px; border-bottom: 1px solid var(--nav-hover); }
        .nav-header h2 { margin: 0; font-size: 1.2em; color: var(--amazon-orange); }
        .nav-header p { margin: 5px 0 0; font-size: 0.8em; color: var(--gray-text); }
        #upload-section { padding: 20px 10px 15px 10px; }
        #upload-section .control-group { margin-bottom: 15px; }
        #upload-section label { font-size: 0.85em; font-weight: 500; color: var(--light-text); margin-bottom: 8px; display: block; }
        #upload-section input[type="file"] { width: 100%; padding: 5px; border-radius: 4px; border: 1px solid var(--gray-text); font-size: 0.8em; color: var(--gray-text); background-color: var(--nav-hover); }
        input[type="file"]::file-selector-button { background-color: var(--amazon-orange); color: var(--dark-bg); border: none; padding: 4px 8px; border-radius: 3px; font-weight: bold; cursor: pointer; margin-right: 8px; }
        .nav-links { list-style: none; padding: 0; margin: 0; flex-grow: 1; }
        .nav-links li .nav-btn { display: flex; align-items: center; width: 100%; padding: 12px 15px; margin-bottom: 5px; border: none; background: none; color: var(--light-text); font-size: 0.9em; text-align: left; cursor: pointer; border-radius: 6px; transition: background-color 0.2s ease, color 0.2s ease; }
        .nav-links li .nav-btn .nav-icon { margin-right: 15px; width: 20px; height: 20px; opacity: 0.8; flex-shrink: 0; }
        .nav-links li .nav-btn:hover { background-color: var(--nav-hover); }
        .nav-links li .nav-btn.active { background-color: var(--amazon-orange); color: var(--dark-bg); font-weight: 700; }
        #nav-toggle-btn { position: absolute; top: 15px; right: -15px; width: 30px; height: 30px; border-radius: 50%; background-color: var(--nav-hover); color: var(--light-text); border: 2px solid var(--main-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1001; transition: transform 0.3s ease; }
        #side-nav.collapsed { width: 80px; }
        #side-nav.collapsed .nav-header h2, #side-nav.collapsed .nav-header p, #side-nav.collapsed #upload-section, #side-nav.collapsed .nav-text { display: none; }
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
        .control-section-grid, #keyword-overview-section .control-section-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 12px; }
        .control-group label, #keyword-overview-section .control-group label { display: block; font-weight: 500; font-size: 0.85em; margin-bottom: 4px; }
        input[type="number"], select { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; box-sizing: border-box; background-color: #fff;}
        .clear-btn { font-size: 0.8em; font-weight: normal; color: #007bff; background: none; border: none; cursor: pointer; padding: 2px 5px;}
        .dashboard-grid { display: grid; gap: 15px; }
        #campaign-overview-section .dashboard-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
        #keyword-overview-section .dashboard-grid { grid-template-columns: repeat(7, 1fr); }
        .metric-card { background-color: var(--light-text); border: 1px solid #e9ecef; border-left: 4px solid var(--amazon-blue); border-radius: 8px; padding: 15px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: 700; color: var(--amazon-orange); line-height: 1.1; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
        #campaign-overview-content .metric-value { font-size: 1.7em; white-space: normal; line-height: 1.2; overflow: visible; word-break: break-all; }
        #campaign-overview-content .total-metrics-grid .metric-value { font-size: 1.5em; } /* Smaller font for single row */
        .metric-label { font-size: 0.85em; font-weight: 500; color: var(--dark-text); }
        #keyword-overview-section .metric-card { padding: 12px; }
        #keyword-overview-section .metric-value { font-size: 1.6em; margin-bottom: 5px; }
        #keyword-overview-section .metric-label { font-size: 0.8em; }
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
        .status-treemap { display: flex; height: 160px; gap: 8px; }
        .status-block { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; border-radius: 6px; padding: 10px; text-align: center; }
        .status-block .count { font-size: 1.8em; font-weight: 700; line-height: 1.2; }
        .status-running { background-color: var(--amazon-orange); }
        .status-paused { background-color: var(--amazon-yellow); }
        .type-donut-chart-area { display: flex; align-items: center; justify-content: center; gap: 20px; height: 160px; }
        .donut-chart { position: relative; width: 120px; height: 120px; border-radius: 50%; }
        .donut-chart::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 75%; height: 75%; background: #f8f9fa; border-radius: 50%; }
        .donut-legend { list-style: none; padding: 0; margin: 0; font-size: 0.9em; width: 120px; }
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
        #grade-explanation-list { list-style: none; padding: 0; font-size: 0.9em; }
        #grade-explanation-list li { margin-bottom: 8px; }
        #grade-explanation-list strong { color: var(--amazon-blue); }
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
        #result-content .result-table { table-layout: fixed; width: 100%; }
        #result-content .result-table th:nth-child(1) { width: 28%; } #result-content .result-table th:nth-child(n+2):nth-child(-n+5) { width: 7%; } #result-content .result-table th:nth-child(6) { width: 12%; } #result-content .result-table th:nth-child(n+7) { width: 8%; }
        .analysis-section .result-table { font-size: 0.83em; table-layout: fixed; width: 100%; }
        .analysis-section .result-table th:nth-child(1) { width: 16%; } .analysis-section .result-table th:nth-child(n+2):nth-child(-n+9) { width: 5%; } .analysis-section .result-table th:nth-child(10) { width: 7%; } .analysis-section .result-table th:nth-child(11) { width: 32%; }
        .strategy-list { padding-left: 20px; }
        .strategy-list li { margin-bottom: 10px; }

        /* --- Styles for ASIN Analysis Chart & Layout --- */
        .asin-chart-container { position: relative; max-width: 500px; margin: 20px auto 50px auto; padding-left: 70px; padding-right: 10px; padding-bottom: 40px; user-select: none; }
        .asin-chart-axes { position: relative; width: 100%; aspect-ratio: 1.5/1; border-left: 2px solid var(--dark-text); border-bottom: 2px solid var(--dark-text); }
        .asin-chart-axes::before { content: ''; position: absolute; top: -12px; left: -7px; border-width: 0 6px 12px 6px; border-style: solid; border-color: transparent transparent var(--dark-text) transparent; }
        .asin-chart-axes::after { content: ''; position: absolute; right: -12px; bottom: -7px; border-width: 6px 0 6px 12px; border-style: solid; border-color: transparent transparent transparent var(--dark-text); }
        .quadrant-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
        .quadrant-box { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 15px; cursor: pointer; transition: background-color 0.2s; border-right: 1px dashed var(--gray-text); border-top: 1px dashed var(--gray-text); }
        .quadrant-box:hover { background-color: #fff5e6; }
        .quadrant-title { font-size: 1.25em; font-weight: bold; color: var(--dark-text); margin-bottom: 8px; }
        .quadrant-tags span { background: var(--amazon-orange); color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8em; }
        .axis-label { position: absolute; font-weight: bold; color: var(--dark-text); white-space: nowrap; }
        .y-axis { left: -70px; top: 50%; transform: translateY(-50%) rotate(-90deg); }
        .x-axis { bottom: -30px; left: 50%; transform: translateX(-50%); }
        .quadrant-details { border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 15px; }
        .quadrant-details summary { cursor: pointer; padding: 12px 15px; background-color: #f8f9fa; font-weight: bold; font-size: 1.1em; color: var(--amazon-blue); border-radius: 5px; transition: background-color 0.2s; }
        .quadrant-details[open] > summary { background-color: var(--amazon-blue); color: white; border-radius: 5px 5px 0 0; }
        .quadrant-details summary:hover { background-color: #e9ecef; }
        .quadrant-details[open] > summary:hover { background-color: #31445a; }
        .quadrant-details-content { padding: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .info-block { background-color: #f8f9fa; border: 1px solid var(--border-color); border-left: 4px solid var(--amazon-orange); border-radius: 6px; padding: 15px; }
        .info-block h4 { margin: 0 0 10px 0; font-size: 1.1em; color: var(--dark-text); }
        .info-block ul { margin: 0; padding-left: 20px; }

        /* --- Styles for ASIN Overview Treemap --- */
        .asin-overview-treemap { display: flex; width: 100%; height: 300px; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; background-color: #f8f9fa; }
        .treemap-col { display: flex; flex-direction: column; height: 100%; transition: flex-basis 0.5s ease-in-out; }
        .treemap-quadrant { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 15px; text-align: center; color: white; transition: filter 0.2s ease, flex-basis 0.5s ease-in-out; border: 1px solid rgba(255,255,255,0.2); box-sizing: border-box; }
        .treemap-quadrant:hover { filter: brightness(1.1); }
        .treemap-quadrant h4, .treemap-quadrant p, .treemap-quadrant span { text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
        .treemap-quadrant h4 { margin: 0 0 5px 0; font-size: 1.2em; font-weight: 700; }
        .treemap-quadrant p { margin: 0 0 10px 0; font-size: 0.9em; opacity: 0.9; }
        .treemap-quadrant span { font-size: 1em; font-weight: 700; }
        .tq-1 { background-color: #D4AC02; }
        .tq-2 { background-color: #F49F05; }
        .tq-3 { background-color: #F18904; }
        .tq-4 { background-color: #BDA589; }

        .summary-section { margin-top: 25px; background: #f8f9fa; border: 1px solid var(--border-color); border-radius: 6px; padding: 20px; }
        .summary-section h4 { margin: 0 0 15px 0; font-size: 1.2em; color: var(--amazon-blue); border-bottom: 2px solid var(--amazon-orange); padding-bottom: 8px;}
        .summary-section ul { list-style-type: disc; padding-left: 20px; margin: 0; }
        .summary-section li { margin-bottom: 10px; line-height: 1.6; }

        /* --- Styles for Campaign Analysis --- */
        .campaign-analysis-item { border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 15px; }
        .campaign-analysis-item summary { cursor: pointer; padding: 12px 15px; background-color: #f8f9fa; font-weight: bold; border-radius: 5px; display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; overflow: hidden; }
        .campaign-analysis-item[open] > summary { background-color: #e9ecef; border-radius: 5px 5px 0 0; }
        .campaign-analysis-item .campaign-title { font-size: 1em; color: var(--amazon-blue); flex-grow: 1; flex-shrink: 1; min-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .campaign-analysis-item .campaign-tag { font-size: 0.8em; padding: 3px 8px; border-radius: 4px; color: white; font-weight: normal; flex-shrink: 0; }
        .campaign-analysis-item .campaign-tag.auto { background-color: #007bff; }
        .campaign-analysis-item .campaign-tag.manual { background-color: var(--amazon-orange); }
        .campaign-analysis-item .campaign-metric { font-size: 0.9em; font-weight: normal; color: #555; background-color: #e9ecef; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; white-space: nowrap; }
        .campaign-analysis-item .analysis-content { padding: 20px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 25px; border-top: 1px solid var(--border-color); }
        .campaign-analysis-item .analysis-block h4 { color: var(--dark-text); font-size: 1.1em; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 0; }
        .campaign-analysis-item .analysis-block p { font-size: 0.9em; line-height: 1.6; margin-top: 10px; }
        .campaign-analysis-item .analysis-block ul { margin: 10px 0 0 0; padding-left: 20px; font-size: 0.9em; line-height: 1.7; }
        .campaign-analysis-item .analysis-block li { margin-bottom: 8px; }

        /* --- Styles for Tooltips --- */
        .tooltip { position: relative; display: inline-block; border-bottom: 1px dotted var(--dark-text); cursor: help; }
        .tooltip .tooltiptext { visibility: hidden; width: 280px; background-color: #333; color: #fff; text-align: left; border-radius: 6px; padding: 8px 12px; position: absolute; z-index: 10; bottom: 125%; left: 50%; margin-left: -140px; opacity: 0; transition: opacity 0.3s; font-size: 0.85em; line-height: 1.5; font-weight: normal; }
        .tooltip .tooltiptext::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #333 transparent transparent transparent; }
        .tooltip:hover .tooltiptext { visibility: visible; opacity: 1; }
        .tooltip .tooltiptext b { color: var(--amazon-yellow); }

        /* --- [NEW] Styles for Campaign Overview Page --- */
        #campaign-overview-content .total-metrics-grid { grid-template-columns: repeat(5, 1fr); }
        #campaign-overview-content .avg-metrics-grid { grid-template-columns: repeat(5, 1fr); }
        .campaign-type-performance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 25px;}
        .campaign-type-performance-grid .viz-chart-card { display: flex; flex-direction: column; }
        .campaign-type-performance-grid .type-donut-chart-area { flex-grow: 1; }
        .campaign-type-performance-grid .donut-legend { width: auto; }
        .campaign-type-performance-grid .donut-legend li { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .campaign-type-performance-grid .legend-label { margin-left: 8px; flex-grow: 1; }
        .campaign-type-performance-grid .legend-percent { font-weight: bold; }
        .legend-color-box { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0;}

        @media (max-width: 900px) {
            .campaign-analysis-item .analysis-content { grid-template-columns: 1fr; }
            .overview-viz-container, .campaign-type-performance-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <nav id="side-nav">
        <button id="nav-toggle-btn" title="收合/展開導覽列"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button>
        <div class="nav-header"><h2>分析儀表板</h2><p>v8.3</p></div>
        <div id="upload-section">
             <div class="control-group"><label for="keyword-file">上傳搜尋字詞報告</label><input type="file" id="keyword-file" accept=".csv,.txt"></div>
             <div class="control-group"><label for="campaign-file">上傳廣告活動報告</label><input type="file" id="campaign-file" accept=".csv,.txt"></div>
             <div class="control-group"><label for="asin-file">上傳廣告產品報告</label><input type="file" id="asin-file" accept=".csv,.txt"></div>
        </div>
        <ul class="nav-links">
            <li><button class="nav-btn active" data-target="overview"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg><span class="nav-text">整體績效概覽</span></button></li>
            <li><button class="nav-btn" data-target="analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg><span class="nav-text">關鍵字績效分析</span></button></li>
            <li><button class="nav-btn" data-target="campaign-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg><span class="nav-text">廣告活動分析</span></button></li>
            <li><button class="nav-btn" data-target="asin-analysis"><svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><span class="nav-text">ASIN績效分析</span></button></li>
        </ul>
    </nav>

    <main id="main-content">
        <div id="page-overview" class="page-content active">
            <div class="page-header"><h1>整體績效概覽</h1></div>
            <div class="card" id="campaign-overview-section"><div class="card-header"><h3>廣告活動總覽</h3></div><div id="campaign-overview-content"><div class="placeholder"><p>請先上傳「廣告活動報告」以顯示總覽。</p></div></div></div>
            <div class="card" id="asin-overview-section"><div class="card-header"><h3>ASIN 總覽</h3></div><div id="asin-overview-content"><div class="placeholder"><p>請先上傳「廣告產品報告」以顯示總覽。</p></div></div></div>
            <div class="card" id="keyword-overview-section">
                <div class="card-header"><h3>關鍵字總覽</h3></div>
                <div id="keyword-grade-summary"><div class="placeholder"><p>請先上傳報告以生成關鍵字績效分級儀表板。</p></div></div>
                <div id="keyword-overview-summary"></div>
                <details>
                    <summary>顯示/隱藏 關鍵字詳細數據與篩選器</summary>
                    <div style="padding-top: 20px;">
                        <div id="top-controls">
                            <div class="card-header" style="border-bottom:none; padding: 0 0 15px 0;"><h4>篩選器與門檻</h4><button id="clear-overview-controls-btn" class="clear-btn">全部清除</button></div>
                            <div class="control-section-grid">
                                <div class="control-group"><label for="campaign-filter">Campaign Name</label><select id="campaign-filter" disabled><option>---</option></select></div>
                                <div class="control-group"><label for="adgroup-filter">Ad Group Name</label><select id="adgroup-filter" disabled><option>---</option></select></div>
                                <div class="control-group"><label for="targeting-filter">Targeting</label><select id="targeting-filter" disabled><option>---</option></select></div>
                                <div class="control-group"><label for="matchtype-filter">Match Type</label><select id="matchtype-filter" disabled><option>---</option></select></div>
                                <div class="control-group"><label for="impression-threshold">曝光量 ></label><input type="number" id="impression-threshold" placeholder="e.g., 1000"></div>
                                <div class="control-group"><label for="ctr-threshold">CTR > (%)</label><input type="number" id="ctr-threshold" placeholder="e.g., 0.5"></div>
                                <div class="control-group"><label for="cvr-threshold">CVR > (%)</label><input type="number" id="cvr-threshold" placeholder="e.g., 10"></div>
                                <div class="control-group"><label for="acos-threshold">ACoS < (%)</label><input type="number" id="acos-threshold" placeholder="e.g., 30"></div>
                                <div class="control-group"><label for="roas-threshold">RoAS ></label><input type="number" id="roas-threshold" placeholder="e.g., 3"></div>
                            </div>
                        </div>
                        <div id="summary-dashboard" style="margin-top:25px;"><div class="placeholder"><p>請先上傳「消費者搜尋字詞報告」以顯示總覽。</p></div></div>
                        <div id="result-content" style="margin-top:25px;"><div class="placeholder"><p>請先上傳「消費者搜尋字詞報告」以顯示表格。</p></div></div>
                    </div>
                </details>
            </div>
        </div>
        <div id="page-analysis" class="page-content">
            <div class="page-header"><h1>關鍵字績效分析</h1></div>
            <div class="card">
                <div class="card-header"><h3>分析門檻 <small style="font-weight:normal; color: #555; margin-left:10px;">(不滿足門檻的關鍵字視為數據量不足)</small></h3></div>
                <div class="control-section-grid">
                    <div class="control-group"><label for="analysis-impressions">曝光量 ≥</label><input type="number" id="analysis-impressions" placeholder="選填，預設為 0"></div>
                    <div class="control-group"><label for="analysis-clicks">點擊量 ≥</label><input type="number" id="analysis-clicks" placeholder="選填，預設為 0"></div>
                    <div class="control-group"><label for="analysis-orders">訂單量 ≥</label><input type="number" id="analysis-orders" placeholder="選填，預設為 0"></div>
                </div>
                <button id="start-analysis-btn" class="start-analysis-btn" disabled>開始分析</button>
            </div>
            <div class="card">
                <div class="card-header"><h3>績效等級說明</h3></div>
                <ul id="grade-explanation-list">
                    <li><strong>👑 SSS級:</strong> 超級出單詞，利潤核心。</li><li><strong>⭐ A級:</strong> 績優成長詞，廣告活動中流砥柱。</li><li><strong>🌱 B級:</strong> 潛力觀察詞，具備潛力，需觀察或扶持。</li><li><strong>👀 C級:</strong> 表現平平或數據不足，需診斷或觀察。</li><li><strong>📉 D級:</strong> 低曝光詞，需檢查競價與預算。</li><li><strong>💔 E級:</strong> 低轉化詞，需優化Listing。</li><li><strong>🕳️ F級:</strong> 預算黑洞，應立即止損。</li>
                </ul>
            </div>
            <div class="card">
                 <div id="analysis-result-container"><div class="placeholder"><p>請先上傳「消費者搜尋字詞報告」以啟用此分析頁面。</p></div></div>
            </div>
        </div>
        <div id="page-campaign-analysis" class="page-content">
            <div class="page-header"><h1>廣告活動分析與優化建議</h1></div>
            <div class="card">
                <div id="campaign-analysis-content">
                    <div class="placeholder"><p>請先上傳「廣告活動報告」。</p></div>
                </div>
            </div>
        </div>
        <div id="page-asin-analysis" class="page-content">
             <div class="page-header"><h1>ASIN 四象限深度分析</h1></div>
             <div class="card" id="asin-analysis-content">
                <div class="placeholder"><p>請先從左方上傳「廣告產品報告」以啟用此分析頁面。</p></div>
            </div>
        </div>
    </main>
    <script>
        // --- Global Data, Element Cache, and Event Listeners ---
        let rawDataObjects = [], headerRow = [], processedGlobalData = [], campaignReportData = [], advertisedProductData = [], reportAverages = null;
        const keywordFileInput = document.getElementById('keyword-file'), campaignFileInput = document.getElementById('campaign-file'), asinFileInput = document.getElementById('asin-file'), resultContent = document.getElementById('result-content'), summaryDashboard = document.getElementById('summary-dashboard'), campaignFilter = document.getElementById('campaign-filter'), adgroupFilter = document.getElementById('adgroup-filter'), targetingFilter = document.getElementById('targeting-filter'), matchtypeFilter = document.getElementById('matchtype-filter'), allOverviewFilters = [campaignFilter, adgroupFilter, targetingFilter, matchtypeFilter], allOverviewThresholds = document.querySelectorAll('#top-controls input[type="number"]'), clearOverviewControlsBtn = document.getElementById('clear-overview-controls-btn'), startAnalysisBtn = document.getElementById('start-analysis-btn'), analysisResultContainer = document.getElementById('analysis-result-container'), navToggleBtn = document.getElementById('nav-toggle-btn'), sideNav = document.getElementById('side-nav'), navBtns = document.querySelectorAll('.nav-btn'), pageContents = document.querySelectorAll('.page-content');
        keywordFileInput.addEventListener('change', handleFileUpload); campaignFileInput.addEventListener('change', handleCampaignFileUpload); asinFileInput.addEventListener('change', handleAsinFileUpload);
        allOverviewFilters.forEach(filter => filter.addEventListener('change', updateOverviewUI));
        allOverviewThresholds.forEach(input => input.addEventListener('input', updateOverviewUI));
        clearOverviewControlsBtn.addEventListener('click', () => { allOverviewFilters.forEach(f => f.value = 'all'); allOverviewThresholds.forEach(i => i.value = ''); updateOverviewUI(); });
        startAnalysisBtn.addEventListener('click', handlePerformanceAnalysis);
        navToggleBtn.addEventListener('click', () => { sideNav.classList.toggle('collapsed'); document.body.classList.toggle('nav-collapsed'); });
        navBtns.forEach(btn => { btn.addEventListener('click', () => { navBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); pageContents.forEach(c => c.classList.remove('active')); document.getElementById('page-' + btn.dataset.target).classList.add('active'); }); });

        // --- Core Logic ---
        async function handleFileUpload() { try { const csvText = await readFile(keywordFileInput.files[0]); const parsedData = parseCSV(csvText); if (parsedData.length < 2) throw new Error("報告為空或格式無法解析。"); headerRow = parsedData[0]; const searchTermKey = headerRow.find(h => h === 'Customer Search Term' || h === '搜尋詞'); if (!searchTermKey) throw new Error("報告中找不到 'Customer Search Term' 欄位。"); rawDataObjects = parsedData.slice(1).map(row => { const obj = {}; headerRow.forEach((key, i) => obj[key] = row[i]); return obj; }); processedGlobalData = processData(rawDataObjects); reportAverages = calculateAverages(processedGlobalData); allOverviewFilters.forEach(filter => filter.value = 'all'); updateOverviewUI(); startAnalysisBtn.disabled = false; analysisResultContainer.innerHTML = '<div class="placeholder"><p>報告已上傳，請點擊上方按鈕開始分析。</p></div>'; } catch(error) { summaryDashboard.innerHTML = ''; resultContent.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`; document.getElementById('keyword-grade-summary').innerHTML = '<div class="placeholder"><p>請先上傳報告以生成關鍵字績效分級儀表板。</p></div>'; document.getElementById('keyword-overview-summary').innerHTML = ''; startAnalysisBtn.disabled = true; } }
        async function handleCampaignFileUpload() {
            const container = document.getElementById('campaign-analysis-content');
            try {
                const csvText = await readFile(campaignFileInput.files[0]);
                const parsedData = parseCSV(csvText);
                if (parsedData.length < 2) throw new Error("廣告活動報告為空");
                const reportHeader = parsedData[0];
                const rawCampaignData = parsedData.slice(1).map(row => { const obj = {}; reportHeader.forEach((key, i) => obj[key] = row[i]); return obj; });
                rawCampaignData.forEach(item => {
                    item.impressions = getNumber(item, ['Impressions', '曝光量']); item.clicks = getNumber(item, ['Clicks', '點擊量']); item.orders = getNumber(item, ['7 Day Total Orders (#)', '7 天總訂單數 (#)']); item.sales = getNumber(item, ['7 Day Total Sales', '7 天總銷售額']); item.spend = getNumber(item, ['Spend', '花費']);
                    item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0; item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0; item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0; item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0; item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                });
                campaignReportData = rawCampaignData;
                renderCampaignOverview(campaignReportData);
                const analysisHTML = generateCampaignAnalysisHTML(campaignReportData);
                container.innerHTML = analysisHTML;

            } catch (error) {
                document.getElementById('campaign-overview-content').innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                container.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
            }
        }
        async function handleAsinFileUpload() {
            const analysisContainer = document.getElementById('asin-analysis-content');
            const overviewContainer = document.getElementById('asin-overview-content');
            try {
                const csvText = await readFile(asinFileInput.files[0]);
                const parsedData = parseCSV(csvText);
                if (parsedData.length < 2) throw new Error("廣告產品報告為空");
                const reportHeader = parsedData[0];
                const rawAsinData = parsedData.slice(1).map(row => { const obj = {}; reportHeader.forEach((key, i) => obj[key] = row[i]); return obj; });
                const aggregationMap = new Map();
                const sumFields = { impressions: ['Impressions', '曝光量'], clicks: ['Clicks', '點擊量'], spend: ['Spend', '花費'], sales: ['7 Day Total Sales', '7 天總銷售額'], orders: ['7 Day Total Orders (#)', '7 天總訂單數 (#)']};
                const asinKey = reportHeader.find(h => h === 'Advertised ASIN' || h === '廣告ASIN');
                if (!asinKey) { throw new Error("報告中找不到 'Advertised ASIN' 或 '廣告ASIN' 欄位。"); }
                rawAsinData.forEach(row => {
                    const asinValue = row[asinKey];
                    if (!asinValue || asinValue.trim() === '') return;
                    let entry = aggregationMap.get(asinValue);
                    if (!entry) {
                        entry = { asin: asinValue };
                        Object.keys(sumFields).forEach(field => entry[field] = 0);
                        aggregationMap.set(asinValue, entry);
                    }
                    Object.entries(sumFields).forEach(([key, pHeaders]) => entry[key] += getNumber(row, pHeaders));
                });
                let processedAsinData = Array.from(aggregationMap.values());
                processedAsinData.forEach(item => {
                    item.impressions = item.impressions || 0;
                    item.clicks = item.clicks || 0;
                    item.orders = item.orders || 0;
                    item.sales = item.sales || 0;
                    item.spend = item.spend || 0;
                    item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0;
                    item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0;
                    item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0;
                    item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0;
                    item.roas = item.spend > 0 ? (item.sales / item.spend) : 0;
                });
                advertisedProductData = processedAsinData;
                renderAsinOverview(advertisedProductData);
                renderAsinAnalysis(advertisedProductData);
            } catch (error) {
                analysisContainer.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
                overviewContainer.innerHTML = \`<div class="placeholder"><p style="color:red; font-weight:bold;">\${error.message}</p></div>\`;
            }
        }
        function processData(dataToProcess) { const searchTermKey = headerRow.find(h => h === 'Customer Search Term' || h === '搜尋詞'); const aggregationMap = new Map(); const sumFields = { impressions: ['Impressions', '曝光量'], clicks: ['Clicks', '點擊量'], spend: ['Spend', '花費'], sales: ['7 Day Total Sales', '7 天總銷售額'], orders: ['7 Day Total Orders (#)', '7 天總訂單數 (#)'] }; dataToProcess.forEach(row => { const searchTermValue = row[searchTermKey]; if (!searchTermValue || searchTermValue.trim() === '' || searchTermValue === '*') return; let entry = aggregationMap.get(searchTermValue); if (!entry) { entry = { searchTerm: searchTermValue }; Object.keys(sumFields).forEach(field => entry[field] = 0); aggregationMap.set(searchTermValue, entry); } Object.entries(sumFields).forEach(([key, pHeaders]) => entry[key] += getNumber(row, pHeaders)); }); let processed = Array.from(aggregationMap.values()); processed.forEach(item => { item.ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100) : 0; item.cvr = item.clicks > 0 ? (item.orders / item.clicks * 100) : 0; item.cpc = item.clicks > 0 ? (item.spend / item.clicks) : 0; item.acos = item.sales > 0 ? (item.spend / item.sales * 100) : 0; item.roas = item.spend > 0 ? (item.sales / item.spend) : 0; }); return processed; }

        // --- UI & Rendering ---
        function updateOverviewUI() { if (rawDataObjects.length === 0) return; const campaignKey = headerRow.find(h => h === 'Campaign Name'), adgroupKey = headerRow.find(h => h === 'Ad Group Name'), targetingKey = headerRow.find(h => h === 'Targeting'), matchtypeKey = headerRow.find(h => h === 'Match Type'); const selectedCampaign = campaignFilter.value, selectedAdgroup = adgroupFilter.value, selectedTargeting = targetingFilter.value; const dataForAdGroup = (selectedCampaign === 'all') ? rawDataObjects : rawDataObjects.filter(r => r[campaignKey] === selectedCampaign); const dataForTargeting = (selectedAdgroup === 'all' || !dataForAdGroup.some(r => r[adgroupKey] === selectedAdgroup)) ? dataForAdGroup : dataForAdGroup.filter(r => r[adgroupKey] === selectedAdgroup); const dataForMatchType = (selectedTargeting === 'all' || !dataForTargeting.some(r => r[targetingKey] === selectedTargeting)) ? dataForTargeting : dataForTargeting.filter(r => r[targetingKey] === selectedTargeting); populateSelect(campaignFilter, rawDataObjects, campaignKey, 'Campaigns', selectedCampaign); populateSelect(adgroupFilter, dataForAdGroup, adgroupKey, 'Ad Groups', selectedAdgroup); populateSelect(targetingFilter, dataForTargeting, targetingKey, 'Targeting', selectedTargeting); populateSelect(matchtypeFilter, dataForMatchType, matchtypeKey, 'Match Types', matchtypeFilter.value); const finalFilteredRawData = rawDataObjects.filter(row => (campaignFilter.value === 'all' || row[campaignKey] === campaignFilter.value) && (adgroupFilter.value === 'all' || row[adgroupKey] === adgroupFilter.value) && (targetingFilter.value === 'all' || row[targetingKey] === targetingFilter.value) && (matchtypeFilter.value === 'all' || row[matchtypeKey] === matchtypeFilter.value)); const processedData = processData(finalFilteredRawData); const finalData = applyOverviewThresholds(processedData); renderSummary(finalData.data, summaryDashboard); renderOverviewResults(finalData); renderKeywordGradeSummary(finalData.data); renderKeywordOverviewSummary(finalData.data); }
        function populateSelect(selectEl, data, key, label, currentValue) { const options = new Set(data.map(row => row[key]).filter(val => val && val.trim() !== '')); const currentValExists = options.has(currentValue); selectEl.innerHTML = \`<option value="all">All \${label}</option>\`; [...options].sort().forEach(option => { let displayText = option; if (key === 'Targeting' && option === '*') displayText = '* (自動廣告)'; if (key === 'Match Type' && option === '-') displayText = '- (自動廣告)'; selectEl.innerHTML += \`<option value="\${option}">\${displayText}</option>\`; }); selectEl.value = currentValExists ? currentValue : 'all'; selectEl.disabled = false; }
        function applyOverviewThresholds(data) { const getThreshold = (id) => { const val = document.getElementById(id).value; return val === '' ? null : parseFloat(val); }; const thresholds = { impressions: getThreshold('impression-threshold'), ctr: getThreshold('ctr-threshold'), cvr: getThreshold('cvr-threshold'), acos: getThreshold('acos-threshold'), roas: getThreshold('roas-threshold') }; const summaryEl = document.createElement('div'); const criteriaText = Object.entries(thresholds).filter(([, value]) => value !== null).map(([key, value]) => { if (key === 'acos') return \`<strong>ACoS</strong> &lt; \${value}%\`; if (key === 'roas') return \`<strong>RoAS</strong> &gt; \${value}\`; return \`<strong>\${key.toUpperCase()}</strong> &gt; \${value}\${['ctr', 'cvr'].includes(key) ? '%' : ''}\`; }).join(', '); summaryEl.innerHTML = \`<div style="padding: 15px; background-color: #e6f3ff; border-radius: 5px; margin-bottom: 15px;"><strong>門檻篩選：</strong> \${criteriaText || '未設定任何門檻。'}</div>\`; const filtered = data.filter(k => { if (thresholds.impressions !== null && k.impressions <= thresholds.impressions) return false; if (thresholds.ctr !== null && k.ctr <= thresholds.ctr) return false; if (thresholds.cvr !== null && k.cvr <= thresholds.cvr) return false; if (thresholds.acos !== null && k.acos > thresholds.acos && k.acos !== 0) return false; if (thresholds.roas !== null && k.roas < thresholds.roas) return false; return true; }); return { summaryElement: summaryEl, data: filtered }; }
        function renderSummary(data, container) { let tI=0,tC=0,tS=0,tSa=0,tO=0;data.forEach(i=>{tI+=i.impressions||0;tC+=i.clicks||0;tS+=i.spend||0;tSa+=i.sales||0;tO+=i.orders||0;});const avgCtr=tI>0?(tC/tI*100):0,avgCvr=tC>0?(tO/tC*100):0,avgAcos=tSa>0?(tS/tSa*100):0,avgRoas=tS>0?(tSa/tS):0;container.innerHTML=\`<div class="dashboard-grid"><div class="metric-card"><div class="metric-value">\${tI.toLocaleString()}</div><div class="metric-label">總曝光量</div></div><div class="metric-card"><div class="metric-value">\${tC.toLocaleString()}</div><div class="metric-label">總點擊</div></div><div class="metric-card"><div class="metric-value">\${tO.toLocaleString()}</div><div class="metric-label">總訂單</div></div><div class="metric-card"><div class="metric-value">\${avgCtr.toFixed(2)}%</div><div class="metric-label">平均CTR</div></div><div class="metric-card"><div class="metric-value">\${avgCvr.toFixed(2)}%</div><div class="metric-label">平均CVR</div></div><div class="metric-card"><div class="metric-value">\${avgAcos.toFixed(2)}%</div><div class="metric-label">平均ACoS</div></div><div class="metric-card"><div class="metric-value">\${avgRoas.toFixed(2)}</div><div class="metric-label">平均RoAS</div></div></div>\`;}
        function renderOverviewResults(finalData) { const { summaryElement, data } = finalData; const tableHTML = createTable(data, ['關鍵字', '曝光', '點擊', 'CPC', '訂單', '銷售額', 'CVR', 'ACoS', 'ROAS']); resultContent.innerHTML = ''; resultContent.appendChild(summaryElement); const tableContainer = document.createElement('div'); tableContainer.className = 'table-container'; tableContainer.innerHTML = tableHTML; resultContent.appendChild(tableContainer); }
        function renderCampaignOverview(data) {
            const container=document.getElementById('campaign-overview-content');
            if(!data || data.length===0){container.innerHTML='<div class="placeholder"><p>報告數據為空。</p></div>';return;}

            // --- Aggregation Logic ---
            const initialTotals = { spend: 0, sales: 0, orders: 0, impressions: 0, clicks: 0 };
            const autoTotals = { ...initialTotals, count: 0 };
            const manualTotals = { ...initialTotals, count: 0 };

            data.forEach(c => {
                const type = (c['Targeting Type'] || c['廣告投放類型'] || '').toLowerCase();
                const target = (type === 'automatic targeting' || type === '自動') ? autoTotals : manualTotals;
                target.count++;
                Object.keys(initialTotals).forEach(key => target[key] += c[key] || 0);
            });

            const grandTotal = {
                spend: autoTotals.spend + manualTotals.spend,
                sales: autoTotals.sales + manualTotals.sales,
                impressions: autoTotals.impressions + manualTotals.impressions,
                clicks: autoTotals.clicks + manualTotals.clicks,
                orders: autoTotals.orders + manualTotals.orders
            };

            autoTotals.acos = autoTotals.sales > 0 ? (autoTotals.spend / autoTotals.sales * 100) : 0;
            manualTotals.acos = manualTotals.sales > 0 ? (manualTotals.spend / manualTotals.sales * 100) : 0;
            autoTotals.roas = autoTotals.spend > 0 ? (autoTotals.sales / autoTotals.spend) : 0;
            manualTotals.roas = manualTotals.spend > 0 ? (manualTotals.sales / manualTotals.spend) : 0;
            autoTotals.spendPerc = grandTotal.spend > 0 ? (autoTotals.spend / grandTotal.spend * 100) : 0;
            manualTotals.spendPerc = grandTotal.spend > 0 ? (manualTotals.spend / grandTotal.spend * 100) : 0;
            autoTotals.salesPerc = grandTotal.sales > 0 ? (autoTotals.sales / grandTotal.sales * 100) : 0;
            manualTotals.salesPerc = grandTotal.sales > 0 ? (manualTotals.sales / grandTotal.sales * 100) : 0;

            const totalCampaigns=autoTotals.count + manualTotals.count;
            const runningCampaigns=data.filter(c=>(c['Status']||c['Campaign Status']||c['狀態']||'').toLowerCase()==='enabled').length;
            const pausedCampaigns=totalCampaigns - runningCampaigns;
            const runningFlex=runningCampaigns>0?\`flex-grow: \${runningCampaigns}\`:'display:none';
            const pausedFlex=pausedCampaigns>0?\`flex-grow: \${pausedCampaigns}\`:'display:none';

            // --- [NEW] Average Metrics Calculation ---
            const avgCTR = grandTotal.impressions > 0 ? (grandTotal.clicks / grandTotal.impressions * 100) : 0;
            const avgCVR = grandTotal.clicks > 0 ? (grandTotal.orders / grandTotal.clicks * 100) : 0;
            const avgCPC = grandTotal.clicks > 0 ? (grandTotal.spend / grandTotal.clicks) : 0;
            const avgACoS = grandTotal.sales > 0 ? (grandTotal.spend / grandTotal.sales * 100) : 0;
            const avgRoAS = grandTotal.spend > 0 ? (grandTotal.sales / grandTotal.spend) : 0;

            // --- HTML Generation ---
            const vizHTML=\`<div class="overview-viz-container"><div class="viz-chart-card"><h4>廣告活動狀態分佈 (共 \${totalCampaigns} 個)</h4><div class="status-treemap"><div class="status-block status-running" style="\${runningFlex}"><div class="count">\${runningCampaigns}</div><div class="label">運行中</div></div><div class="status-block status-paused" style="\${pausedFlex}"><div class="count">\${pausedCampaigns}</div><div class="label">已暫停</div></div></div></div><div class="viz-chart-card"><h4>廣告活動類型</h4><div class="type-donut-chart-area"><div class="donut-chart" style="background: conic-gradient(var(--amazon-orange) 0% \${manualTotals.count / totalCampaigns * 100}%, var(--amazon-yellow) \${manualTotals.count / totalCampaigns * 100}% 100%);"></div><ul class="donut-legend"><li><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span><span class="legend-label">手動</span>(\${manualTotals.count})</li><li><span class="legend-color-box" style="background-color: var(--amazon-yellow);"></span><span class="legend-label">自動</span>(\${autoTotals.count})</li></ul></div></div></div>\`;

            const metricsHTML=\`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">總量指標</h4><div class="dashboard-grid total-metrics-grid"><div class="metric-card"><div class="metric-value">\${grandTotal.impressions.toLocaleString()}</div><div class="metric-label">總曝光</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.clicks.toLocaleString()}</div><div class="metric-label">總點擊</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.orders.toLocaleString()}</div><div class="metric-label">總訂單</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">總花費</div></div><div class="metric-card"><div class="metric-value">\${grandTotal.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">總銷售額</div></div></div>\`;

            // --- [NEW] Average Metrics HTML ---
            const avgMetricsHTML = \`<h4 style="margin-top:25px;margin-bottom:15px;color:#333;">平均指標</h4><div class="dashboard-grid avg-metrics-grid"><div class="metric-card"><div class="metric-value">\${avgCTR.toFixed(2)}%</div><div class="metric-label">平均 CTR</div></div><div class="metric-card"><div class="metric-value">\${avgCVR.toFixed(2)}%</div><div class="metric-label">平均 CVR</div></div><div class="metric-card"><div class="metric-value">\${avgCPC.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div class="metric-label">平均 CPC</div></div><div class="metric-card"><div class="metric-value">\${avgACoS.toFixed(2)}%</div><div class="metric-label">平均 ACoS</div></div><div class="metric-card"><div class="metric-value">\${avgRoAS.toFixed(2)}</div><div class="metric-label">平均 RoAS</div></div></div>\`;

            const typePerformanceHTML = \`
            <div class="campaign-type-performance-grid">
                <div class="viz-chart-card">
                    <h4>花費佔比 & 績效</h4>
                    <div class="type-donut-chart-area">
                        <div class="donut-chart" style="background: conic-gradient(#007bff 0% \${autoTotals.spendPerc}%, var(--amazon-orange) \${autoTotals.spendPerc}% 100%);"></div>
                        <ul class="donut-legend">
                            <li><span class="legend-color-box" style="background-color: #007bff;"></span><span class="legend-label">自動廣告</span> <span class="legend-percent">\${autoTotals.spendPerc.toFixed(1)}%</span></li>
                            <li><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span><span class="legend-label">手動廣告</span> <span class="legend-percent">\${manualTotals.spendPerc.toFixed(1)}%</span></li>
                        </ul>
                    </div>
                    <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                        <div><b>自動:</b> \${autoTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${autoTotals.acos.toFixed(2)}%</div>
                        <div><b>手動:</b> \${manualTotals.spend.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>ACoS:</b> \${manualTotals.acos.toFixed(2)}%</div>
                    </div>
                </div>
                <div class="viz-chart-card">
                    <h4>銷售額佔比 & 績效</h4>
                     <div class="type-donut-chart-area">
                        <div class="donut-chart" style="background: conic-gradient(#007bff 0% \${autoTotals.salesPerc}%, var(--amazon-orange) \${autoTotals.salesPerc}% 100%);"></div>
                        <ul class="donut-legend">
                            <li><span class="legend-color-box" style="background-color: #007bff;"></span><span class="legend-label">自動廣告</span> <span class="legend-percent">\${autoTotals.salesPerc.toFixed(1)}%</span></li>
                            <li><span class="legend-color-box" style="background-color: var(--amazon-orange);"></span><span class="legend-label">手動廣告</span> <span class="legend-percent">\${manualTotals.salesPerc.toFixed(1)}%</span></li>
                        </ul>
                    </div>
                    <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; font-size: 0.9em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                        <div><b>自動:</b> \${autoTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${autoTotals.roas.toFixed(2)}</div>
                        <div><b>手動:</b> \${manualTotals.sales.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div><div style="text-align:right;"><b>RoAS:</b> \${manualTotals.roas.toFixed(2)}</div>
                    </div>
                </div>
            </div>\`;

            const summaryHTML = generateCampaignOverallSummary(autoTotals, manualTotals, grandTotal);
            const collapsibleTableHTML=\`<details style="margin-top: 25px;"><summary>顯示/隱藏 所有廣告活動數據表</summary><div class="table-container">\${createGenericTableHTML([...data].sort((a,b)=>b.spend-a.spend),['廣告活動','狀態','預算','花費','銷售額','ACoS','RoAS','曝光','點擊','CTR','訂單','CVR'],{'廣告活動':'Campaign Name','狀態':'Status','預算':'Budget','花費':'spend','銷售額':'sales','ACoS':'acos','RoAS':'roas','曝光':'impressions','點擊':'clicks','CTR':'ctr','訂單':'orders','CVR':'cvr'})}</div></details>\`;

            container.innerHTML = vizHTML + metricsHTML + avgMetricsHTML + typePerformanceHTML + summaryHTML + collapsibleTableHTML;
        }

        // --- ASIN Analysis ---
        function classifyAsinData(data) {
            if (!data || data.length === 0) return { classifiedData: [], medianClicks: 0, medianCvr: 0 };
            const medianClicks = getMedian(data.map(item => item.clicks));
            const medianCvr = getMedian(data.map(item => item.cvr));
            const classifiedData = data.map(item => {
                const newItem = { ...item };
                const highTraffic = newItem.clicks > medianClicks;
                const highCvr = newItem.cvr > medianCvr;
                if (highTraffic && highCvr) newItem.quadrant = 1;
                else if (!highTraffic && highCvr) newItem.quadrant = 2;
                else if (!highTraffic && !highCvr) newItem.quadrant = 3;
                else if (highTraffic && !highCvr) newItem.quadrant = 4;
                return newItem;
            });
            return { classifiedData, medianClicks, medianCvr };
        }

        function renderAsinOverview(data) {
            const container = document.getElementById('asin-overview-content');
            if (!data || data.length === 0) {
                container.innerHTML = '<div class="placeholder"><p>報告數據為空。</p></div>';
                return;
            }
            const { classifiedData } = classifyAsinData(data);
            const totalAsins = classifiedData.length;
            const quadrantCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
            classifiedData.forEach(item => { if(quadrantCounts[item.quadrant] !== undefined) quadrantCounts[item.quadrant]++; });

            const quadrantInfo = { 1: { name: "主力商品", desc: "高轉化・高流量" }, 2: { name: "潛力商品", desc: "高轉化・低流量" }, 3: { name: "滯銷商品", desc: "低轉化・低流量" }, 4: { name: "漏水的桶", desc: "低轉化・高流量" } };
            const percentages = {};
            [1, 2, 3, 4].forEach(q => { percentages[q] = totalAsins > 0 ? (quadrantCounts[q] / totalAsins) * 100 : 0; });

            const flexBasis_Col1 = percentages[2] + percentages[3];
            const flexBasis_Col2 = percentages[1] + percentages[4];

            const treemapHTML = \`
                <div class="asin-overview-treemap">
                    <div class="treemap-col" style="flex-basis: \${flexBasis_Col1}%; \${flexBasis_Col1 === 0 ? 'display:none;' : ''}">
                        <div class="treemap-quadrant tq-2" style="flex-basis: \${flexBasis_Col1 > 0 ? (percentages[2] / flexBasis_Col1 * 100) : 0}%; \${percentages[2] === 0 ? 'display:none;' : ''}">
                            <h4>\${quadrantInfo[2].name}</h4><p>\${quadrantInfo[2].desc}</p><span>\${quadrantCounts[2]} ASINs (\${percentages[2].toFixed(1)}%)</span>
                        </div>
                        <div class="treemap-quadrant tq-3" style="flex-basis: \${flexBasis_Col1 > 0 ? (percentages[3] / flexBasis_Col1 * 100) : 0}%; \${percentages[3] === 0 ? 'display:none;' : ''}">
                            <h4>\${quadrantInfo[3].name}</h4><p>\${quadrantInfo[3].desc}</p><span>\${quadrantCounts[3]} ASINs (\${percentages[3].toFixed(1)}%)</span>
                        </div>
                    </div>
                    <div class="treemap-col" style="flex-basis: \${flexBasis_Col2}%; \${flexBasis_Col2 === 0 ? 'display:none;' : ''}">
                        <div class="treemap-quadrant tq-1" style="flex-basis: \${flexBasis_Col2 > 0 ? (percentages[1] / flexBasis_Col2 * 100) : 0}%; \${percentages[1] === 0 ? 'display:none;' : ''}">
                            <h4>\${quadrantInfo[1].name}</h4><p>\${quadrantInfo[1].desc}</p><span>\${quadrantCounts[1]} ASINs (\${percentages[1].toFixed(1)}%)</span>
                        </div>
                        <div class="treemap-quadrant tq-4" style="flex-basis: \${flexBasis_Col2 > 0 ? (percentages[4] / flexBasis_Col2 * 100) : 0}%; \${percentages[4] === 0 ? 'display:none;' : ''}">
                            <h4>\${quadrantInfo[4].name}</h4><p>\${quadrantInfo[4].desc}</p><span>\${quadrantCounts[4]} ASINs (\${percentages[4].toFixed(1)}%)</span>
                        </div>
                    </div>
                </div>\`;

            let summaryHTML = '<div class="summary-section asin-summary-section"><h4>結論與下一步建議</h4><ul>';
            if (totalAsins === 0) {
                summaryHTML += '<li>報告中無有效的ASIN數據可供分析。</li>';
            } else if (percentages[1] >= 40) {
                summaryHTML += '<li><b>主要發現：</b>大部分廣告ASIN表現為「主力商品」，這是非常健康的狀態。</li><li><b>下一步：</b>持續加大對這些ASIN的【競爭】與【品牌防禦】廣告投入，鞏固市場地位，並確保庫存充足。</li>';
            } else if (percentages[4] >= 35) {
                summaryHTML += '<li><b>主要發現：</b>較多ASIN屬於「漏水的桶」，廣告花費效率有待提升。</li><li><b>下一步：</b>立即對這些ASIN進行【否定關鍵字】操作，並深入分析其【Listing詳情頁】的轉化瓶頸（如價格、評論、圖片），考慮將預算轉移至潛力商品。</li>';
            } else if (percentages[2] >= 35) {
                summaryHTML += '<li><b>主要發現：</b>賬戶中存在大量「潛力商品」，轉化率高但流量不足。</li><li><b>下一步：</b>核心目標是為這些ASIN【引流】。增加其廣告預算，嘗試更廣泛的【品類關鍵詞】和【自動廣告】，並配合【Coupon】提升點擊率。</li>';
            } else {
                summaryHTML += '<li><b>主要發現：</b>ASIN表現分佈較為均衡，需要採取多元化管理策略。</li><li><b>下一步：</b>針對「主力商品」應持續投資；對「潛力商品」需加大引流；對「漏水的桶」應立即優化或止損；對「滯銷商品」需評估其市場潛力，決定是否繼續投入。</li>';
            }
             if (totalAsins > 0) summaryHTML += '<li><b>持續監控：</b>建議定期（如每週）上傳新報告，追蹤各ASIN在四象限中的流動變化，動態調整廣告策略。</li>';
            summaryHTML += '</ul></div>';

            // --- [NEW] Collapsible ASIN Table ---
            const collapsibleTableHTML = \`<details style="margin-top: 25px;">
                <summary>顯示/隱藏 所有ASIN數據表</summary>
                <div class="table-container">
                    \${createTableForAsin(classifiedData, ['ASIN', '支出', '銷售額', '曝光', '點擊', 'CTR', 'CVR', 'ACoS'])}
                </div>
            </details>\`;

            container.innerHTML = treemapHTML + summaryHTML + collapsibleTableHTML;
        }

        function renderAsinAnalysis(data) {
            const container = document.getElementById('asin-analysis-content');
            if (!data || data.length === 0) {
                container.innerHTML = '<div class="placeholder"><p>報告數據為空或無法解析。</p></div>';
                return;
            }
            const { classifiedData, medianClicks, medianCvr } = classifyAsinData(data);
            const quadrantData = { 1: classifiedData.filter(i => i.quadrant === 1), 2: classifiedData.filter(i => i.quadrant === 2), 3: classifiedData.filter(i => i.quadrant === 3), 4: classifiedData.filter(i => i.quadrant === 4) };
            const headers = ['ASIN', '支出', '銷售額', '曝光', '點擊', 'CTR', 'CVR', 'ACoS'];
            const chartHTML = \`
                <div class="asin-chart-container">
                    <div class="asin-chart-axes">
                        <div class="quadrant-grid">
                            <div class="quadrant-box" data-quadrant="2"><div class="quadrant-title">潛力商品</div><div class="quadrant-tags"><span>高轉化・低流量</span></div></div>
                            <div class="quadrant-box" data-quadrant="1"><div class="quadrant-title">主力商品</div><div class="quadrant-tags"><span>高轉化・高流量</span></div></div>
                            <div class="quadrant-box" data-quadrant="3"><div class="quadrant-title">滯銷商品</div><div class="quadrant-tags"><span>低轉化・低流量</span></div></div>
                            <div class="quadrant-box" data-quadrant="4"><div class="quadrant-title">漏水的桶</div><div class="quadrant-tags"><span>低轉化・高流量</span></div></div>
                        </div>
                    </div>
                    <div class="axis-label y-axis">低 → 轉化率 (CVR) → 高 (中位數: \${medianCvr.toFixed(2)}%)</div>
                    <div class="axis-label x-axis">低 → 流量 (點擊) → 高 (中位數: \${medianClicks.toLocaleString()})</div>
                </div>\`;

            const quadrantInfo = {
                1: { title: "第一象限：👑 主力商品 (高流量, 高轉化)", content: \`<div class="info-grid"><div class="info-block"><h4>狀態解讀</h4><p>貢獻大部分銷售額和利潤的明星產品。</p></div><div class="info-block"><h4>如何識別</h4><p>點擊量與轉化率(CVR)皆高於整體ASIN<b>中位數</b>。</p></div></div><div class="info-grid"><div class="info-block" style="grid-column: 1 / -1;"><h4>策略建議</h4><p>核心目標是【最大化曝光】與【品牌防禦】</p><ul><li><b>投放策略：</b>以【競爭】及【品牌防禦】為投放重心，積極搶佔 Best Seller 廣告位。</li><li><b>關鍵字投放：</b>主要使用【自身品牌詞】、【競品品牌詞】及【品類核心詞】。</li><li><b>商品投放：</b>鎖定【自身其他ASIN】(防禦)與【競品Best Seller ASIN】(進攻)。</li><li><b>展示型廣告：</b>針對訪問過此ASIN但未購買的受眾進行【再行銷 (Remarketing)】。</li></ul></div></div>\` },
                2: { title: "第二象限：🌱 潛力商品 (低流量, 高轉化)", content: \`<div class="info-grid"><div class="info-block"><h4>狀態解讀</h4><p>潛力股，只要有人看到它們，就很有可能購買。</p></div><div class="info-block"><h4>如何識別</h4><p>轉化率(CVR)高於<b>中位數</b>，但點擊量低於<b>中位數</b>。</p></div></div><div class="info-grid"><div class="info-block" style="grid-column: 1 / -1;"><h4>策略建議</h4><p>核心目標是【提升流量】與【創造聲量】</p><ul><li><b>廣告目標：</b>以【創造知名度及可見度】為主，支援新品或測試特定商品。</li><li><b>關鍵字投放：</b>使用【品牌詞】和【品類寬泛詞】，並開啟【自動廣告】廣泛探索新機會。</li><li><b>商品投放：</b>主要定位於【自身的主力ASIN】頁面，進行交叉銷售。</li><li><b>促銷工具：</b>可嘗試使用【Deals】或【Coupon】等工具，提升廣告點擊率(CTR)。</li><li><b>廣告位：</b>爭取【搜索結果首頁 (Top of Search)】以最大化曝光。</li></ul></div></div>\` },
                3: { title: "第三象限：❄️ 滯銷商品 (低流量, 低轉化)", content: \`<div class="info-grid"><div class="info-block"><h4>狀態解讀</h4><p>曝光和轉化雙低，需判斷是否為新品或季節性商品。</p></div><div class="info-block"><h4>可能因素</h4><p>廣告投入不足、商品頁基礎不足、市場需求低或競爭過度。</p></div></div><div class="info-grid"><div class="info-block" style="grid-column: 1 / -1;"><h4>策略建議</h4><p>核心目標是【提升流量】並【優化基礎】</p><ul><li><b>競價調整：</b>手動廣告可考慮將CPC出價提高30-50%，並開啟自動廣告探索潛在關鍵字。</li><li><b>預算分配：</b>將此ASIN的廣告日預算提高50-100%，並設置預算警報。</li><li><b>基礎優化：</b>全面檢查主圖、標題、五點描述、A+內容與後台關鍵字是否完善且具競爭力。</li></ul></div></div>\` },
                4: { title: "第四象限：💧 漏水的桶 (高流量, 低轉化)", content: \`<div class="info-grid"><div class="info-block"><h4>狀態解讀</h4><p>點擊量高，但轉化率低，ACoS通常偏高，侵蝕利潤。</p></div><div class="info-block"><h4>可能因素</h4><p>引流詞相關性差、Listing吸引力不足、價格或評價處於劣勢。</p></div></div><div class="info-grid"><div class="info-block" style="grid-column: 1 / -1;"><h4>策略建議</h4><p>核心目標是【抓住細分機會】與【提升轉化】</p><ul><li><b>廣告目標：</b>轉向【抓住細分商品機會及長尾銷量】，進行多樣化促銷。</li><li><b>否定關鍵字：</b>嚴格篩選搜索詞報告，將點擊多次但無轉化的詞設為【否定精準】。</li><li><b>關鍵字投放：</b>增加【長尾精準關鍵字】的投放，吸引高意向的精準流量。</li><li><b>商品投放：</b>針對【競品ASIN的商品詳情頁】進行投放，實現交叉銷售與流量攔截。</li><li><b>促銷工具：</b>可考慮使用【Deals+展示型廣告】的組合，利用促銷標識提升頁面轉化率。</li></ul></div></div>\` }
            };

            let accordionHTML = '<div class="quadrant-analysis-container">';
            [1, 2, 3, 4].forEach(q => {
                accordionHTML += \`
                <details class="quadrant-details" id="quadrant-details-\${q}">
                    <summary>\${quadrantInfo[q].title}</summary>
                    <div class="quadrant-details-content">
                        \${quadrantInfo[q].content}
                        <div class="table-container">\${createTableForAsin(quadrantData[q], headers)}</div>
                    </div>
                </details>\`;
            });
            accordionHTML += '</div>';
            container.innerHTML = chartHTML + accordionHTML;
            container.querySelectorAll('.quadrant-box').forEach(box => {
                box.addEventListener('click', () => {
                    const quadrantNumber = box.dataset.quadrant;
                    const targetDetails = container.querySelector(\`#quadrant-details-\${quadrantNumber}\`);
                    if (targetDetails) {
                        container.querySelectorAll('.quadrant-details').forEach(d => {
                           if(d !== targetDetails) d.open = false;
                        });
                        targetDetails.open = true;
                        targetDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }

        // --- Performance Analysis & Suggestions ---
        function calculateAverages(data) { let tI = 0, tC = 0, tS = 0, tSa = 0, tO = 0; data.forEach(i => { tI += i.impressions||0; tC += i.clicks||0; tS += i.spend||0; tSa += i.sales||0; tO += i.orders||0; }); const kC = data.length||1; return { avgCtr: tI>0?(tC/tI*100):0, avgCvr: tC>0?(tO/tC*100):0, avgAcos: tSa>0?(tS/tSa*100):0, avgRoas: tS>0?(tSa/tS):0, avgClicks: tC/kC, avgSpend: tS/kC, avgImpressions: tI/kC }; }
        function getAdSuggestion_v8(item, averages) { const { impressions, clicks, orders, acos, cvr, ctr, spend } = item; const { avgCtr, avgCvr, avgAcos, avgClicks, avgSpend, avgImpressions } = averages; const SIGNIFICANT_CLICKS = 20; const SIGNIFICANT_IMPRESSIONS = 5000; const hasSufficientData = impressions >= SIGNIFICANT_IMPRESSIONS || clicks >= SIGNIFICANT_CLICKS; const formatSuggestion = (diagnosis, suggestionList) => { const s = suggestionList.map(i => \`<li>\${i}</li>\`).join(''); return \`<div class='suggestion-wrapper'><div class='suggestion-block'><strong class='suggestion-title'>數據診斷：</strong>\${diagnosis}</div><div class='suggestion-block'><strong class='suggestion-title'>✅ 優化建議：</strong><ul>\${s}</ul></div></div>\`; }; if (clicks > SIGNIFICANT_CLICKS && spend > avgSpend && orders === 0) { return { level: "F", category: "low", suggestion: formatSuggestion('已累積大量點擊(>20)且花費高於平均，但完全沒有訂單。', ['此詞與商品相關性極低。<b>策略：</b>【立即將其添加為否定精準關鍵字】，徹底切斷無效花費。']) }; } if (clicks > avgClicks && cvr < avgCvr) { return { level: "E", category: "low", suggestion: formatSuggestion('已累積大量點擊(>平均)，但轉化率(CVR)遠低於平均，導致ACoS非常高。', ['低轉化源於Listing綜合實力不足。<b>策略：</b>深度優化【Listing詳情頁、五點描述、A+頁面、評論】，並在優化期間【逐步降低競價】控制虧損。']) }; } if (impressions < 1000 && orders === 0) { return { level: "D", category: "low", suggestion: formatSuggestion('廣告曝光量極低，且沒有訂單。', ['曝光不足主要源於【預算不足】或【競價過低】。<b>策略：</b>檢查廣告活動日預算，並參考系統「建議競價」適當提高出價。']) }; } if (hasSufficientData && ctr > avgCtr && cvr > avgCvr && (acos < 15 || acos < avgAcos * 0.7)) { return { level: "SSS", category: "high", suggestion: formatSuggestion('超級出單詞/ASIN，點擊與轉化俱佳，ACoS極低，是利潤核心。', ['<b>操作：</b>可評估為此關鍵字建立獨立的【手動精準匹配】廣告活動，並配置獨立的高預算。', '<b>競價：</b>建議可嘗試「大幅提高競價」（+30% 至 +50%），積極爭取並鞏固「搜索結果首頁頂部」的廣告位。']) }; } if (ctr > avgCtr && cvr > avgCvr) { const s = impressions < SIGNIFICANT_IMPRESSIONS ? '<b>情境 1 (曝光量 < 5000)：</b>屬於「展現量低，轉化率高」的潛力股。<b>建議：</b>可「顯著提高競價」（+20% 至 +40%），以獲取更多曝光機會。' : '<b>情境 2 (曝光量 > 5000)：</b>曝光充足的中流砥柱。<b>建議：</b>可「穩步提高競價」（+10% 至 +15%），獲取更高排名，並評估轉為【精準匹配】。'; return { level: "A", category: "high", suggestion: formatSuggestion('績優成長詞/ASIN，點擊率與轉化率高於平均，ACoS健康。', [s]) }; } if ((impressions < avgImpressions || clicks < avgClicks || ctr < avgCtr) && cvr > avgCvr) { return { level: "B", category: "medium", suggestion: formatSuggestion('潛力轉單詞/ASIN，曝光或點擊偏低，但轉化率高於平均。', ['具銷售潛力，瓶頸在於曝光不足。<b>策略：</b>可「穩步提高競價」（+10% 至 +15%）爭取更好展示位。', '若曝光仍不足，可考慮為其建立獨立的廣告組/活動。']) }; } if (!hasSufficientData && orders > 0) { return { level: "B", category: "medium", suggestion: formatSuggestion('潛力觀察詞/ASIN，數據累積不足(曝光<5000或點擊<20)，但已有訂單。', ['雖有訂單但數據量不足影響判讀。<b>策略：</b>【保持不動，繼續觀察】，等待數據累積後再做決策。']) }; } if (impressions > SIGNIFICANT_IMPRESSIONS && ctr < avgCtr) { return { level: "C", category: "medium", suggestion: formatSuggestion('低點擊率詞/ASIN，曝光量充足(>5000)，但點擊率遠低於平均。', ['問題出在搜索結果頁缺乏吸引力。<b>策略：</b>優化【商品主圖、標題、價格、星等、評論數】。', '若優化後CTR依舊很低，說明關鍵字相關性差，可評估「降低競價」或設為【否定】。']) }; } if (!hasSufficientData && orders === 0) { return { level: "C", category: "medium", suggestion: formatSuggestion('數據觀察詞/ASIN，數據累積不足(曝光<5000或點擊<20)，且無訂單。', ['觀察周期較短，數據不具備參考性。<b>策略：</b>【保持不動，繼續觀察】，以避免錯殺潛力詞。']) }; } return { level: "N/A", category: "medium", suggestion: formatSuggestion('數據表現特殊，建議手動個案分析。', ['請綜合考量商品的生命週期、利潤率以及廣告活動的整體目標，來決定具體操作。']) }; }
        function handlePerformanceAnalysis() { if (processedGlobalData.length === 0) { analysisResultContainer.innerHTML = '<div class="placeholder"><p>請先上傳報告</p></div>'; return; } analysisResultContainer.innerHTML = '<div class="placeholder"><p>正在分析數據...</p></div>'; const getAnThresh = (id) => { const v = document.getElementById(id).value; return v === '' ? 0 : parseInt(v); }; const thresholds = { impressions: getAnThresh('analysis-impressions'), clicks: getAnThresh('analysis-clicks'), orders: getAnThresh('analysis-orders') }; const qualifiedData = processedGlobalData.filter(k => k.impressions >= thresholds.impressions && k.clicks >= thresholds.clicks && k.orders >= thresholds.orders); qualifiedData.forEach(k => { const res = getAdSuggestion_v8(k, reportAverages); k.level = res.level; k.suggestion = res.suggestion; k.category = res.category; }); const levelOrder = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 }; const sortFn = (a, b) => (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0); const highPerf = qualifiedData.filter(k => k.category === 'high').sort(sortFn); const mediumPerf = qualifiedData.filter(k => k.category === 'medium').sort(sortFn); const lowPerf = qualifiedData.filter(k => k.category === 'low').sort(sortFn); const analysisHeaders = ['關鍵字/ASIN', '支出', '曝光', '點擊', '訂單', 'CTR', 'CVR', 'ACoS', 'RoAS', '等級', '廣告建議']; let html = \`<div class="analysis-section"><h4>I. 高績效與高潛力目標：機會放大區</h4><p>總體策略：放大成功，積極進攻。</p><div class="table-container">\${createTable(highPerf, analysisHeaders)}</div></div>\`; html += \`<div class="analysis-section"><h4>II. 中等績效目標：觀察診斷區</h4><p>總體策略：數據不足則謹慎觀察，表現中等則微調。</p><div class="table-container">\${createTable(mediumPerf, analysisHeaders)}</div></div>\`; html += \`<div class="analysis-section"><h4>III. 低績效目標：止損優化區</h4><p>總體策略：及時止損，提升預算效率。</p><div class="table-container">\${createTable(lowPerf, analysisHeaders)}</div></div>\`; analysisResultContainer.innerHTML = html; }
        function renderKeywordGradeSummary(data) { const container = document.getElementById('keyword-grade-summary'); if (!data || data.length === 0) { container.innerHTML = '<div class="placeholder"><p>無符合條件的關鍵字可供分析。</p></div>'; return; } const gradeMap = { 'SSS': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1, 'N/A': 0 }; const levelMap = [ { score: 1, level: 'F', comment: '嚴重虧損' }, { score: 2, level: 'E', comment: '亟待優化' }, { score: 3, level: 'D', comment: '曝光不足' }, { score: 4, level: 'C', comment: '表現平平' }, { score: 5, level: 'B', comment: '潛力觀察' }, { score: 6, level: 'A', comment: '績優成長' }, { score: 7, level: 'SSS', comment: '超級明星' }]; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; const gradeOrder = ['SSS', 'A', 'B', 'C', 'D', 'E', 'F', 'N/A']; let totalScore = 0; const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; totalScore += gradeMap[result.level] || 0; }); const avgScore = data.length > 0 ? totalScore / data.length : 0; const avgGradeInfo = levelMap.reduce((prev, curr) => Math.abs(curr.score - avgScore) < Math.abs(prev.score - avgScore) ? curr : prev); const leftHTML = \`<div class="avg-grade-container"><div class="avg-grade-display">\${levelEmojis[avgGradeInfo.level]}</div><div class="avg-grade-level">\${avgGradeInfo.level} 級</div><div class="avg-grade-comment">平均績效：\${avgGradeInfo.comment}</div></div>\`; let rightHTML = '<div class="grade-dist-container"><h4>關鍵字等級分佈</h4><ul class="grade-dist-list">'; gradeOrder.forEach(level => { if (gradeCounts[level] > 0) { const percentage = (gradeCounts[level] / data.length * 100).toFixed(1); rightHTML += \`<li class="grade-dist-item"><div class="grade-dist-label">\${levelEmojis[level]} \${level}</div><div class="grade-dist-bar-bg"><div class="grade-dist-bar" style="width: \${percentage}%;"></div></div><div class="grade-dist-value">\${percentage}%</div></li>\`; } }); rightHTML += '</ul></div>'; container.innerHTML = leftHTML + rightHTML; }
        function renderKeywordOverviewSummary(data) { const container = document.getElementById('keyword-overview-summary'); if (!data || data.length === 0) { container.innerHTML = ''; return; } const gradeCounts = { 'SSS': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'N/A': 0 }; data.forEach(item => { const result = getAdSuggestion_v8(item, reportAverages); gradeCounts[result.level]++; }); const totalKeywords = data.length; const highPerfCount = gradeCounts['SSS'] + gradeCounts['A']; const lowPerfCount = gradeCounts['E'] + gradeCounts['F']; const midPerfCount = totalKeywords - highPerfCount - lowPerfCount; const highPerfPerc = totalKeywords > 0 ? (highPerfCount / totalKeywords) * 100 : 0; const lowPerfPerc = totalKeywords > 0 ? (lowPerfCount / totalKeywords) * 100 : 0; let summaryHTML = '<div class="summary-section keyword-summary-section"><h4>結論與下一步建議</h4><ul>'; if (totalKeywords === 0) { summaryHTML += '<li>無符合條件的關鍵字可供分析。</li>'; } else if (highPerfPerc >= 40) { summaryHTML += '<li><b>主要發現：</b>大部分關鍵字表現為「高績效」(SSS/A級)，廣告賬戶健康度高。</li><li><b>下一步：</b>建議為頭部關鍵字【創建獨立的精準匹配廣告】，並【穩步提高競價與預算】以擴大戰果，鞏固優勢廣告位。</li>'; } else if (lowPerfPerc >= 35) { summaryHTML += '<li><b>主要發現：</b>賬戶中「低績效」(E/F級)關鍵字佔比較高，存在明顯的預算浪費。</li><li><b>下一步：</b>立即將F級（預算黑洞）關鍵字設為【否定精準】，並對E級（低轉化）關鍵字暫停投放或大幅降低競價，優先【優化對應的商品Listing】。將釋放的預算重新分配給高潛力詞。</li>'; } else if ((midPerfCount / totalKeywords) >= 0.5) { summaryHTML += '<li><b>主要發現：</b>多數關鍵字處於「潛力/觀察期」(B/C/D級)，賬戶仍在數據積累階段。</li><li><b>下一步：</b>核心策略是【耐心觀察，精準微調】。對B級詞可【小幅提高競價】爭取更多機會；對C/D級詞需重點分析其【點擊率(CTR)】，若CTR過低則需優化主圖/標題，或判斷為不相關詞並降低出價。</li>'; } else { summaryHTML += '<li><b>主要發現：</b>關鍵字表現分佈較為均衡，需採取精細化運營策略。</li><li><b>下一步：</b>對高績效詞【放大投入】，對低績效詞【及時止損】，對中等績效詞【持續觀察和優化】，實現整體廣告效益最大化。</li>'; } summaryHTML += '</ul></div>'; container.innerHTML = summaryHTML; }

        // --- Campaign Analysis Functions ---
        function getCampaignSuggestions(campaign, isAuto) {
            let diagnosis = ''; let suggestions = [];
            const { spend, sales, orders, impressions, acos, ctr } = campaign;
            const hasSignificantSpend = spend > 20;
            const hasSales = sales > 0;
            const highACoSThreshold = 50;
            const lowCTRThreshold = 0.3;

            const scene1_auto = '<span class="tooltip">場景1<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景1</b><br>檢驗和優化商品刊登的品質：自動廣告基於系統對商品刊登的識別來匹配流量。</span></span>';
            const scene3_auto = '<span class="tooltip">場景3<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景3</b><br>配合手動廣告，提升流量精準度：將自動廣告中高轉化的長尾詞/品牌詞轉移至手動廣告進行精準投放。</span></span>';
            const scene4_auto = '<span class="tooltip">場景4<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景4</b><br>破冰, 尋找曝光：新品類或新商品可採用自動廣告來快速獲得初始曝光。</span></span>';
            const scene5_auto = '<span class="tooltip">場景5<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景5</b><br>持續拓展優質關鍵字：利用自動廣告發掘商品的新使用場景（如瑜珈球用於孕婦鍛鍊）。</span></span>';
            const scene6_auto = '<span class="tooltip">場景6<span class="tooltiptext"><b>出處: 投放進階優化-自動廣告, 場景6</b><br>低成本獲得藍海關鍵字：用低預算和低競價的自動廣告，捕獲競爭度低的長尾流量。</span></span>';
            const scene3_manual = '<span class="tooltip">場景三<span class="tooltiptext"><b>出處: 投放進階優化-關鍵字投放, 場景三</b><br>提升目標關鍵字排名：對高轉換關鍵字，使用獨立預算和高競價來爭取更高排名。</span></span>';
            const scene4_manual = '<span class="tooltip">場景四<span class="tooltiptext"><b>出處: 投放進階優化-關鍵字投放, 場景四</b><br>品牌建設, 流量防禦：透過投放自身品牌詞，防禦競品流量，並建議使用廣泛匹配以低成本獲取流量。</span></span>';

            if (isAuto) {
                if (hasSignificantSpend && !hasSales) {
                    diagnosis = '此自動廣告花費較高但沒有產生任何銷售，可能正在浪費預算或Listing品質有待優化。';
                    suggestions = ['<b>立即行動：</b>下載此廣告活動的「搜尋詞報告」。', '<b>止損：</b>將報告中所有不相關、高點擊無訂單的搜尋詞添加為【否定關鍵字】。', \`<b>檢查商品：</b>根據\${scene1_auto}，檢查廣告中的商品Listing品質，確保標題、五點描述、後台關鍵字都已「深埋」商品屬性，幫助系統準確識別。\`];
                } else if (acos > highACoSThreshold && hasSignificantSpend) {
                    diagnosis = 'ACoS過高，廣告效率低下。自動廣告雖用於探索，但需控制預算浪費。';
                    suggestions = ['<b>優化核心：</b>下載「搜尋詞報告」，這是自動廣告最有價值的產出。', \`<b>收割關鍵字(高轉化詞)：</b>根據\${scene3_auto}，找出報告中帶來訂單且ACoS符合目標的【高轉化長尾詞/品牌詞】，將它們以【精準匹配】方式添加到手動廣告活動中，並設定高競價高預算。\`, '<b>收割ASIN(高轉化ASIN)：</b>同樣在報告中找出高轉化的競品ASIN，加入到【手動商品投放】廣告中。', '<b>否定關鍵字(無轉化詞)：</b>將大量點擊但無轉化的搜尋詞添加為【否定關鍵字】，及時止損。'];
                } else if (acos <= highACoSThreshold && hasSales) {
                    diagnosis = '此自動廣告表現良好，正以健康的ACoS穩定地尋找新機會與出單詞，是重要的流量補充和數據來源。';
                    suggestions = ['<b>持續收割：</b>定期（如每週）下載「搜尋詞報告」，持續將表現好的新搜尋詞和ASIN轉移到手動廣告活動中進行放大。', \`<b>預算保障：</b>確保此廣告活動有充足的預算，讓它能持續探索新的潛在流量（如\${scene5_auto}的新使用場景、\${scene6_auto}的藍海關鍵字）。\`, '<b>保持開啟：</b>根據官方建議，自動廣告應與手動廣告【長期並行】，作為流量的補充和防禦，並持續驗證Listing優化效果。'];
                } else {
                    diagnosis = '數據量不足或曝光較低，處於探索階段。';
                    suggestions = [\`<b>新品推廣：</b>若為新品，此為正常現象（如\${scene4_auto}的破冰期）。自動廣告是新品獲取初始流量和數據的最佳途徑。\`, '<b>繼續觀察：</b>讓廣告活動繼續運行以積累更多數據。', '<b>檢查預算/競價：</b>如果曝光量過低，請檢查廣告活動的日預算是否充足，並可考慮參考系統建議，採用【按定向組設定競價】的方式，對更有潛力的匹配方式（如緊密匹配）設定更高的出價。'];
                }
            } else { // Manual Campaign Logic
                if (hasSignificantSpend && !hasSales) {
                    diagnosis = '此手動廣告花費較高但完全沒有轉化，是主要的預算黑洞，需緊急處理。';
                    suggestions = ['<b>立即審查：</b>深入檢查此活動下的所有投放目標（關鍵字/商品/品類）。', '<b>暫停無效投放：</b>立即【暫停】或【存檔】所有高花費、零訂單的關鍵字或投放ASIN。', '<b>檢查相關性：</b>確認投放的關鍵字/商品與您的商品是否高度相關。不相關的投放是預算浪費的主要原因。'];
                } else if (acos > highACoSThreshold && hasSignificantSpend) {
                    diagnosis = 'ACoS遠超健康範圍，投入產出比極低，正在侵蝕利潤。';
                    suggestions = ['<b>精細化競價：</b>根據搜尋詞報告，【降低】高ACoS關鍵字/投放目標的競價，目標是將其ACoS控制在盈虧線以下。', '<b>否定搜尋詞：</b>如果使用「寬泛」或「詞組」匹配，請務必下載「搜尋詞報告」，將不相關的搜尋詞添加為【否定關鍵字】。', '<b>檢查落地頁：</b>高點擊但低轉化可能意味著您的【商品詳情頁】存在問題，請檢查價格、評論、庫存、主圖等是否具備競爭力。'];
                } else if (acos <= highACoSThreshold && hasSales) {
                    diagnosis = '這是一個績優廣告活動，是您主要的利潤來源之一，應重點維護與放大。';
                    suggestions = ['<b>保障預算：</b>確保此廣告活動預算充足，避免因預算耗盡而錯失訂單。', \`<b>穩步加價：</b>可嘗試對其中表現最好的核心關鍵字/投放目標【小幅提高競價】（如5-10%），以爭取更好的廣告排名和更多的曝光（\${scene3_manual}）。\`, \`<b>流量防禦：</b>若此為品牌詞廣告，應使用【廣泛匹配】並配合建議競價中的最低出價，用小成本獲得更多流量入口，實現品牌建設與流量防禦（\${scene4_manual}）。\`];
                } else if (impressions > 5000 && ctr < lowCTRThreshold) {
                     diagnosis = '廣告獲得了大量曝光，但點擊率(CTR)偏低，說明廣告創意或投放相關性有待提高。';
                     suggestions = ['<b>優化主圖：</b>檢查商品【主圖】在搜尋結果頁中是否足夠吸引人、能否脫穎而出。', '<b>檢查標題與價格：</b>確認【標題】是否包含核心關鍵字，【價格】是否有競爭力，是否有優惠券等標識。', '<b>提高相關性：</b>重新評估投放的關鍵字是否與商品高度匹配。不匹配的曝光會拉低整體點擊率。'];
                } else {
                    diagnosis = '數據量不足或表現尚可，處於觀察階段。';
                    suggestions = ['<b>繼續觀察：</b>讓廣告活動繼續運行以積累更多數據，以便做出更準確的判斷。', '<b>檢查競價：</b>如果曝光量過低，可能是【競價不足】導致的。請參考亞馬遜的「建議競價」範圍，適當調整出價。', '<b>擴充投放目標：</b>根據官方建議，一個手動廣告組中至少應有【30個關鍵字】或投放足夠的ASIN/品類來增加展示機會。'];
                }
            }
            return { diagnosis, suggestions };
        }

        function generateCampaignOverallSummary(autoTotals, manualTotals, grandTotal) {
            let insights = [];
            if (grandTotal.spend === 0) {
                insights.push('<li>報告中無有效的廣告花費數據，無法生成摘要。</li>');
            } else {
                if(autoTotals.spendPerc > 65 && autoTotals.salesPerc < manualTotals.salesPerc && autoTotals.acos > manualTotals.acos) {
                    insights.push('<li><b>主要發現：</b>自動廣告消耗了大部分預算，但其銷售貢獻和效率（ACoS）均不如手動廣告。</li><li><b>下一步：</b>建議將優化重心放在自動廣告上。立即下載其「搜尋詞報告」，將高績效詞轉移至手動廣告，並將無效花費的詞設為否定，以提高預算利用效率。</li>');
                } else if (manualTotals.spendPerc > 65 && manualTotals.salesPerc < autoTotals.salesPerc && manualTotals.acos > autoTotals.acos) {
                     insights.push('<li><b>主要發現：</b>手動廣告是主要的花費渠道，但其投入產出比低於自動廣告，可能存在投放目標效率不佳的問題。</li><li><b>下一步：</b>請重點審查手動廣告中高花費、高ACoS的關鍵字或商品投放，考慮降低其競價或暫停。同時，持續從表現良好的自動廣告中發掘新的、高效的投放目標。</li>');
                } else if (autoTotals.salesPerc > 60 && autoTotals.acos < manualTotals.acos) {
                    insights.push('<li><b>主要發現：</b>廣告賬戶目前高度依賴自動廣告帶來轉化，且其效率優於手動廣告。</li><li><b>下一步：</b>這是健康的拓詞階段。請保持自動廣告的預算，並建立「定期（每週）收割」的機制，將自動廣告報告中的出單詞及時添加到手動廣告中，逐步建立穩定的手動廣告結構。</li>');
                } else if (manualTotals.salesPerc > 60 && manualTotals.acos < autoTotals.acos) {
                    insights.push('<li><b>主要發現：</b>廣告賬戶結構健康，已建立起高效的手動廣告作為主要的銷售來源。</li><li><b>下一步：</b>重點應放在【放大戰果】上。對核心手動廣告活動應保障充足預算，並穩步提高核心關鍵字的競價。同時，保持自動廣告開啟，作為捕捉新流量和防禦流量的補充手段。</li>');
                } else {
                    insights.push('<li><b>主要發現：</b>自動與手動廣告的表現較為均衡，處於一個穩定的廣告結構中。</li><li><b>下一步：</b>維持現有的【自動拓詞、手動放大】的互補策略。持續監控兩種類型廣告的ACoS變化，動態調整預算分配，確保整體廣告效益最大化。</li>');
                }
            }
            return \`<div class="summary-section"><h4>結論與下一步建議</h4><ul>\${insights.join('')}</ul></div>\`;
        }

        function generateCampaignAnalysisHTML(data) {
            if (!data || data.length === 0) { return '<div class="placeholder"><p>廣告活動報告數據為空。</p></div>'; }
            const sortedData = [...data].sort((a, b) => b.spend - a.spend);
            let html = '<p style="margin-bottom: 20px; font-size: 0.9em; color: #555;">以下分析根據您的廣告活動類型和績效指標提供診斷與優化建議。建議優先處理列表頂端的高花費活動。</p>';
            sortedData.forEach(campaign => {
                const type = (campaign['Targeting Type'] || campaign['廣告投放類型'] || '').toLowerCase();
                const isAuto = type === 'automatic targeting' || type === '自動';
                const { diagnosis, suggestions } = getCampaignSuggestions(campaign, isAuto);
                const campaignName = campaign['Campaign Name'] || '未知活動';
                html += \`
                    <details class="campaign-analysis-item">
                        <summary>
                            <span class="campaign-title" title="\${campaignName.replace(/"/g, '&quot;')}">\${campaignName}</span>
                            <span class="campaign-tag \${isAuto ? 'auto' : 'manual'}">\${isAuto ? '自動廣告' : '手動廣告'}</span>
                            <span class="campaign-metric">花費: \${campaign.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            <span class="campaign-metric">銷售額: \${campaign.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            <span class="campaign-metric">ACoS: \${campaign.acos.toFixed(2)}%</span>
                        </summary>
                        <div class="analysis-content">
                            <div class="analysis-block">
                                <h4>📈 績效診斷</h4>
                                <p>\${diagnosis}</p>
                            </div>
                            <div class="analysis-block">
                                <h4>💡 優化建議</h4>
                                <ul>\${suggestions.map(s => \`<li>\${s}</li>\`).join('')}</ul>
                            </div>
                        </div>
                    </details>
                \`;
            });
            return html;
        }

        // --- [NEW] Table Sorting Function ---
        function sortColumn(event, colIndex) {
            const header = event.currentTarget;
            const table = header.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));

            // Sort always descending as requested
            rows.sort((a, b) => {
                const cellA = a.cells[colIndex]?.innerText || '';
                const cellB = b.cells[colIndex]?.innerText || '';

                // Handle text sort for first column (heuristic)
                if (colIndex === 0) {
                    return cellB.localeCompare(cellA, ['zh-Hans-CN', 'en-US']);
                }

                // Handle numeric sort for other columns
                const valA = parseFloat(String(cellA).replace(/[^0-9.-]+/g, '')) || -Infinity;
                const valB = parseFloat(String(cellB).replace(/[^0-9.-]+/g, '')) || -Infinity;

                return valB - valA;
            });

            // Visually indicate which column is sorted
            table.querySelectorAll('th').forEach(th => {
                 th.innerHTML = th.innerHTML.replace(/ ▼$/, ''); // Remove indicator from all
            });
            if (!header.innerHTML.includes('▼')) {
                 header.innerHTML += ' ▼'; // Add indicator to clicked header
            }

            // Re-append rows
            tbody.append(...rows);
        }

        // --- Table Creation & Utility Functions ---
        function createTable(data, headers) { const isAnalysisTable = headers.includes('廣告建議'); const dataToRender = isAnalysisTable ? data : [...data].sort((a, b) => b.impressions - a.impressions); if (!dataToRender || dataToRender.length === 0) return '<p style="padding:15px; text-align:center;"><i>此分類無符合條件的數據。</i></p>'; const levelEmojis = { 'SSS': '👑', 'A': '⭐', 'B': '🌱', 'C': '👀', 'D': '📉', 'E': '💔', 'F': '🕳️', 'N/A': '🤔' }; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; dataToRender.forEach(row => { const levelDisplay = isAnalysisTable ? \`\${levelEmojis[row.level] || ''} \${row.level}\` : ''; const cells = { '關鍵字/ASIN': row.searchTerm, 'ASIN': row.asin, '等級': levelDisplay, '廣告建議': row.suggestion || '---', '支出': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '曝光': row.impressions.toLocaleString(), '點擊': row.clicks.toLocaleString(), '訂單': row.orders.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, 'CVR': \`\${row.cvr.toFixed(2)}%\`, 'ACoS': \`\${row.acos.toFixed(1)}%\`, 'RoAS': row.roas.toFixed(2), '關鍵字': row.searchTerm, 'CPC': \`\${row.cpc.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '銷售額': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`}; table += '<tr>'; headers.forEach(h => { let cellContent = (cells[h] !== undefined) ? String(cells[h]) : '---'; if (h !== '廣告建議' && h !== '等級') { cellContent = cellContent.replace(/</g, "&lt;").replace(/>/g, "&gt;"); } if (h === '等級') { table += \`<td style="text-align: center; font-weight: bold;">\${cellContent}</td>\`; } else { table += \`<td>\${cellContent}</td>\`; } }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
        function createGenericTableHTML(data, headers, keyMap) { if (!data || data.length === 0) return '<p><i>無數據</i></p>'; let tableHTML = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => tableHTML += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); tableHTML += '</tr></thead><tbody>'; data.forEach(row => { tableHTML += '<tr>'; headers.forEach(header => { const key = keyMap[header]; let cellContent; if (header === '狀態') { cellContent = row['Status'] || row['Campaign Status'] || row['狀態'] || '---'; } else { cellContent = (row[key] !== undefined && row[key] !== null) ? row[key] : '---'; } if (typeof cellContent === 'number') { if (['spend', 'sales', 'Budget'].includes(key)) { cellContent = \`\${cellContent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`; } else if (['acos', 'ctr', 'cvr'].includes(key)) { cellContent = \`\${cellContent.toFixed(2)}%\`; } else if (key === 'roas') { cellContent = cellContent.toFixed(2); } else { cellContent = cellContent.toLocaleString(); } } tableHTML += \`<td>\${cellContent}</td>\`; }); tableHTML += '</tr>'; }); tableHTML += '</tbody></table>'; return tableHTML; }
        function createTableForAsin(data, headers) { if (!data || data.length === 0) return '<p style="padding:15px; text-align:center;"><i>此象限無符合條件的數據。</i></p>'; let table = '<table class="result-table"><thead><tr>'; headers.forEach((h, i) => table += \`<th onclick="sortColumn(event, \${i})">\${h}</th>\`); table += '</tr></thead><tbody>'; data.sort((a,b) => b.spend - a.spend).forEach(row => { const cells = { 'ASIN': row.asin, '支出': \`\${row.spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '銷售額': \`\${row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\`, '曝光': row.impressions.toLocaleString(), '點擊': row.clicks.toLocaleString(), 'CTR': \`\${row.ctr.toFixed(2)}%\`, 'CVR': \`\${row.cvr.toFixed(2)}%\`, 'ACoS': \`\${row.acos.toFixed(1)}%\` }; table += '<tr>'; headers.forEach(h => { table += \`<td>\${cells[h] !== undefined ? cells[h] : '---'}</td>\`; }); table += '</tr>'; }); table += '</tbody></table>'; return table; }
        function parseCSV(text) { let result = []; let lines = text.split(/\\r\\n|\\n/); if (lines.length > 0 && lines[0].charCodeAt(0) === 0xFEFF) lines[0] = lines[0].substring(1); for (let i = 0; i < lines.length; i++) { if (!lines[i].trim()) continue; let row = []; let current = ''; let inQuotes = false; for (let j = 0; j < lines[i].length; j++) { let char = lines[i][j]; if (char === '"') { if (inQuotes && j < lines[i].length - 1 && lines[i][j+1] === '"') { current += '"'; j++; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; } else { current += char; } } row.push(current.trim()); result.push(row); } return result; }
        function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = event => resolve(event.target.result); reader.onerror = error => reject(error); reader.readAsText(file, 'UTF-8'); }); }
        function getNumber(item, keys) { for (const key of keys) { if (item[key] !== undefined && item[key] !== '') return parseFloat(String(item[key]).replace(/[^0-9.-]+/g, "")) || 0; } return 0; }
        function getMedian(arr) { if (!arr.length) return 0; const sorted = arr.slice().sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); if (sorted.length % 2 === 0) { return (sorted[mid - 1] + sorted[mid]) / 2; } return sorted[mid]; }
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
        button.textContent = '🚀 啟動廣告分析儀表板 (v8.3)';
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