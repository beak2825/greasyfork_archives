// ==UserScript==
// @name         SangTacViet Auto Collect & Treo Máy
// @version      1.7.1
// @description  (v1.7.1) Tự động nhặt bảo trên sangtacviet & có chế độ treo máy & có thể xem lịch sử và thống kê vật phẩm đã nhặt & có cài đặt tùy chỉnh theo ý muốn.
// @author       @AnotherLDK
// @match        *://*.sangtacviet.app/*
// @match        *://*.sangtacviet.me/*
// @match        *://*.sangtacviet.pro/*
// @match        *://*.sangtacviet.com/*
// @match        *://sangtacviet.app/*
// @match        *://sangtacviet.me/*
// @match        *://sangtacviet.pro/*
// @match        *://sangtacviet.com/*
// @match        *://14.225.254.182/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/555578/SangTacViet%20Auto%20Collect%20%20Treo%20M%C3%A1y.user.js
// @updateURL https://update.greasyfork.org/scripts/555578/SangTacViet%20Auto%20Collect%20%20Treo%20M%C3%A1y.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COOLDOWN_PRESETS = {
        '10m': 10 * 60 * 1000,
        '1m45s': (1 * 60 + 45) * 1000
    };
    const STORAGE_KEY_COUNT = 'stv_collect_count';
    const STORAGE_KEY_COOLDOWN_END = 'stv_cooldown_end_time';
    const STORAGE_KEY_PRESET = 'stv_cooldown_preset';
    const STORAGE_KEY_LAST_ITEM = 'stv_last_collected_item_v6';
    const STORAGE_KEY_MINIMIZED = 'stv_popup_minimized';

    const STORAGE_KEY_ITEM_COUNTS = 'stv_item_counts_v6';
    const STORAGE_KEY_DRUG_DETAILS = 'stv_drug_details_v5';
    // Key lưu trữ thống kê theo ngày (Mới ở v1.6)
    const STORAGE_KEY_DAILY_STATS = 'stv_daily_stats_v1';

    const STORAGE_KEY_DRUG_TOGGLE = 'stv_drug_details_toggled';
    const STORAGE_KEY_TREO_MAY_TOGGLE = 'stv_treo_may_enabled';
    const STORAGE_KEY_TREO_MAY_TARGET = 'stv_treo_may_target';
    const STORAGE_KEY_TREO_MAY_SESSION_COUNT = 'stv_treo_may_session_count';
    const STORAGE_KEY_TREO_MAY_STATE = 'stv_treo_may_state';
    const STORAGE_KEY_TREO_MAY_HUNT_END = 'stv_treo_may_hunt_end_time';
    const STORAGE_KEY_TREO_MAY_ERROR_STATE = 'stv_treo_may_error_state';

    const STORAGE_KEY_HISTORY_LOG_V2 = 'stv_collect_history_v2';
    const MAX_HISTORY_PER_DAY = 150;
    const MAX_HISTORY_DAYS = 2;

    const STORAGE_KEY_SCRIPT_ENABLED = 'stv_script_enabled_v1';
    const STORAGE_KEY_ACTIVE_TAB = 'stv_active_tab_v1';
    const STORAGE_KEY_PANEL_HIDDEN = 'stv_panel_hidden_v1';
    const STORAGE_KEY_UI_THEME = 'stv_ui_theme_v1';
    const STORAGE_KEY_STATS_VIEW_MODE = 'stv_stats_view_mode';

    const DETAILED_DRUG_LEVELS = [1, 2, 3, 4, 5, 6];
    const CUSTOM_QUALITY_TO_LEVEL_MAP = {
        'bất nhập lưu': 1, 'hạ phẩm': 2, 'trung phẩm': 3,
        'thượng phẩm': 4, 'cực phẩm': 5, 'tuyệt phẩm': 6,
    };
    const CUSTOM_LEVEL_TO_QUALITY_MAP = {
        1: 'Bất Nhập Lưu', 2: 'Hạ Phẩm', 3: 'Trung Phẩm',
        4: 'Thượng Phẩm', 5: 'Cực Phẩm', 6: 'Tuyệt Phẩm',
    };

    const DRUG_TYPE_MAPPING = {
        'thiên vận đan': 'ThienVan', 'tụ linh đan': 'TuLinh', 'tẩy tủy đan': 'TayTuy', 'tụ khí đan': 'TuKhi',
    };

    const READING_PAGE_REGEX = /^\/truyen\/[^/]+\/\d+\/\d+\/\d+\/?/;
    const EXCLUDED_PAGE_REGEX = /^\/user\/0\//;

    let collectCount = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
    let cooldownEndTime = parseInt(localStorage.getItem(STORAGE_KEY_COOLDOWN_END) || '0', 10);
    let currentPreset = localStorage.getItem(STORAGE_KEY_PRESET) || '10m';
    let isMinimized = localStorage.getItem(STORAGE_KEY_MINIMIZED) === 'true';
    let isDrugDetailsVisible = localStorage.getItem(STORAGE_KEY_DRUG_TOGGLE) === 'true';

    let lastCollectedItem = JSON.parse(localStorage.getItem(STORAGE_KEY_LAST_ITEM) || '{}');
    const initialItemCounts = { 'CongPhap': 0, 'VoKy': 0, 'LinhThach': 0, 'LenhBaiUyVong': 0, 'DanDuoc': 0 };
    let itemCounts = { ...initialItemCounts, ...JSON.parse(localStorage.getItem(STORAGE_KEY_ITEM_COUNTS) || '{}') };

    const initialDrugDetails = {};
    for (const key of Object.values(DRUG_TYPE_MAPPING)) { initialDrugDetails[key] = {}; }
    let drugDetails = { ...initialDrugDetails, ...JSON.parse(localStorage.getItem(STORAGE_KEY_DRUG_DETAILS) || '{}') };

    // Load Daily Stats
    let dailyStats = JSON.parse(localStorage.getItem(STORAGE_KEY_DAILY_STATS) || '{}');

    let isTreoMayEnabled = localStorage.getItem(STORAGE_KEY_TREO_MAY_TOGGLE) === 'true';
    let treoMayTarget = parseInt(localStorage.getItem(STORAGE_KEY_TREO_MAY_TARGET) || '1', 10);
    let treoMaySessionCount = parseInt(localStorage.getItem(STORAGE_KEY_TREO_MAY_SESSION_COUNT) || '0', 10);
    let treoMayState = localStorage.getItem(STORAGE_KEY_TREO_MAY_STATE) || 'COOLDOWN';
    let huntEndTime = parseInt(localStorage.getItem(STORAGE_KEY_TREO_MAY_HUNT_END) || '0', 10);
    let isErrorState = localStorage.getItem(STORAGE_KEY_TREO_MAY_ERROR_STATE) === 'true';

    let historyData = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY_LOG_V2) || '{}');

    let isScriptEnabled = localStorage.getItem(STORAGE_KEY_SCRIPT_ENABLED) === null ? true : (localStorage.getItem(STORAGE_KEY_SCRIPT_ENABLED) === 'true');
    let activeTab = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB) || 'treo-may';
    let currentTheme = localStorage.getItem(STORAGE_KEY_UI_THEME) || 'light';
    let isPanelHidden = localStorage.getItem(STORAGE_KEY_PANEL_HIDDEN) === 'true';
    let statsViewMode = localStorage.getItem(STORAGE_KEY_STATS_VIEW_MODE) || 'total';

    let originalPageTitle = '';

    var count = 0;
    var waitTime = 0;
    var cType = 0;
    var isCollecting = false;

    let collectIntervalHandle = null;
    let uiMounted = false;

    let elPopup, elMainHeaderText, elAutoReloadSessionDisplayHeader, elResetSessionBtn,
        elCollectCount, elCollectStatus, elCooldownLabelText, elCooldownDisplay,
        elLastItemName, elItemCountsList,
        elHistoryLogList, elHistorySearchInput, elMinimizeIconSvg,
        elStatsViewSelect, elResetTotalCountBtn;

    function injectGlobalUIStyles() {
        if (document.getElementById('stv-global-ui-style')) return;

        const style = document.createElement('style');
        style.id = 'stv-global-ui-style';
        style.textContent = `
            :root {
                --bg-dark-primary: #202124;
                --bg-dark-secondary: #2C2D30;
                --bg-dark-header: #303134;
                --text-dark-primary: #E8EAED;
                --text-dark-secondary: #BDC1C6;
                --border-dark: #404144;
                --blue-accent: #8AB4F8;

                --bg-light-primary: #FFFFFF;
                --bg-light-secondary: #F8F9FA;
                --bg-light-header: #F1F3F4;
                --text-light-primary: #202124;
                --text-light-secondary: #5F6368;
                --border-light: #E0E0E0;
            }

            #stv-timer-popup {
                position: fixed; top: 20px; left: 20px;
                width: 280px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                font-family: 'Arial', sans-serif;
                color: #333;
                background-color: #fff;
                z-index: 99999;
                transition: opacity 0.3s ease;
                border: 1px solid var(--border-dark);
                text-align: center;
                resize: both;
                min-width: 240px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                max-height: 90vh;
                min-height: 400px;
                opacity: 0.95;
            }
            #stv-timer-popup:hover {
                opacity: 1;
            }

            #stv-toggle-button {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 45px;
                height: 45px;
                background-color: #303134;
                color: white;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 99998;
                cursor: pointer;
                display: none;
                opacity: 0.7;
                transition: opacity 0.2s;
                font-size: 24px;
                line-height: 45px;
                text-align: center;
                user-select: none;
            }
            #stv-toggle-button:hover { opacity: 1; }
            #stv-timer-popup.panel-hidden { display: none !important; }
            #stv-toggle-button.panel-visible { display: block !important; }

            #stv-timer-popup {
                background-color: var(--bg-light-primary);
                color: var(--text-light-primary);
                border-color: var(--border-light);
            }
            #stv-timer-popup:not(.light-theme) {
                background-color: var(--bg-dark-primary);
                color: var(--text-dark-primary);
                border-color: var(--border-dark);
            }

            #popup-header-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background-color: var(--bg-light-header);
                border-bottom: 1px solid var(--border-light);
                flex-shrink: 0;
                user-select: none;
            }
            #stv-timer-popup:not(.light-theme) #popup-header-status {
                background-color: var(--bg-dark-header);
                border-bottom: 1px solid var(--border-dark);
            }

            .header-title-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 1.1em;
            }

            #led-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #5F6368;
                border: 2px solid rgba(0,0,0,0.2);
                transition: background-color 0.3s;
            }
            #led-indicator.led-gray { background-color: #9AA0A6; }
            #led-indicator.led-green { background-color: #34A853; }
            #led-indicator.led-yellow { background-color: #FBBC04; }
            #led-indicator.led-red { background-color: #EA4335; }
            #led-indicator.led-disabled { background-color: #5F6368; }

            .header-controls-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #minimize-btn, #close-panel-btn {
                width: 30px; height: 30px;
                background: none; border: none;
                cursor: pointer; padding: 0;
                opacity: 0.7;
                color: var(--text-light-secondary);
                display: flex; align-items: center; justify-content: center;
            }
            #stv-timer-popup:not(.light-theme) #minimize-btn,
            #stv-timer-popup:not(.light-theme) #close-panel-btn {
                 color: var(--text-dark-secondary);
            }
            #minimize-btn:hover, #close-panel-btn:hover { opacity: 1; }
            #minimize-btn svg, #close-panel-btn svg {
                width: 22px; height: 22px;
                stroke: currentColor;
                stroke-width: 2.5;
            }

            .main-status-wrapper {
                padding: 15px;
                text-align: center;
                flex-shrink: 0;
                border-bottom: 1px solid var(--border-light);
            }
            #stv-timer-popup:not(.light-theme) .main-status-wrapper {
                border-bottom: 1px solid var(--border-dark);
            }
            #cooldown-label-text {
                font-size: 0.9em;
                font-weight: 600;
                color: var(--text-light-secondary);
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            #cooldown-display {
                font-size: 3.5em;
                font-weight: 900;
                letter-spacing: 1px;
                color: var(--text-light-primary);
                line-height: 1.1;
            }
            #collect-status {
                font-size: 0.9em;
                color: var(--text-light-secondary);
                min-height: 1.2em;
                margin-top: 5px;
            }
            .status-line {
                font-size: 0.9em;
                color: var(--text-light-secondary);
                margin-top: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
            }
            #collect-count {
                font-weight: 700;
                color: var(--text-light-primary);
            }
            #reset-total-count-btn {
                background: none; border: none; cursor: pointer;
                color: var(--text-light-secondary); font-size: 1.1em;
                padding: 0 4px; line-height: 1; opacity: 0.6;
            }
            #reset-total-count-btn:hover { opacity: 1; color: #EA4335; }

            #stv-timer-popup:not(.light-theme) #cooldown-label-text,
            #stv-timer-popup:not(.light-theme) #collect-status,
            #stv-timer-popup:not(.light-theme) .status-line,
            #stv-timer-popup:not(.light-theme) #reset-total-count-btn {
                color: var(--text-dark-secondary);
            }
            #stv-timer-popup:not(.light-theme) #cooldown-display,
            #stv-timer-popup:not(.light-theme) #collect-count {
                color: var(--text-dark-primary);
            }

            .status-led-green #cooldown-display { color: #34A853 !important; }
            .status-led-gray #cooldown-display { color: #9AA0A6 !important; }
            .status-led-red #cooldown-display { color: #EA4335 !important; }

            .status-led-yellow #cooldown-display {
                color: #FBBC04 !important;
                font-size: 1.8em !important;
            }

            .tab-nav-container {
                display: flex;
                justify-content: space-around;
                padding: 0 10px;
                border-bottom: 1px solid var(--border-light);
                flex-shrink: 0;
            }
            #stv-timer-popup:not(.light-theme) .tab-nav-container {
                border-bottom: 1px solid var(--border-dark);
            }
            .tab-btn {
                padding: 12px 8px;
                cursor: pointer;
                background: none;
                border: none;
                font-weight: 700;
                font-size: 0.9em;
                color: var(--text-light-secondary);
                border-bottom: 3px solid transparent;
                margin-bottom: -1px;
                transition: color 0.2s, border-color 0.2s;
            }
            #stv-timer-popup:not(.light-theme) .tab-btn {
                 color: var(--text-dark-secondary);
            }
            .tab-btn.hover {
                color: var(--text-light-primary);
            }
            #stv-timer-popup:not(.light-theme) .tab-btn:hover {
                color: var(--text-dark-primary);
            }
            .tab-btn.active {
                color: var(--blue-accent);
                border-bottom: 3px solid var(--blue-accent);
            }

            .tab-content-wrapper {
                flex-grow: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .tab-content-wrapper::-webkit-scrollbar { width: 6px; }
            .tab-content-wrapper::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); }
            #stv-timer-popup:not(.light-theme) .tab-content-wrapper::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }

            .tab-panel {
                padding: 15px;
                text-align: left;
                background-color: var(--bg-light-secondary);
                min-height: 100%;
            }
            #stv-timer-popup:not(.light-theme) .tab-panel {
                background-color: var(--bg-dark-secondary);
            }
            .tab-panel.hidden {
                display: none;
            }

            #popup-footer-status {
                padding: 10px 15px;
                background-color: var(--bg-light-header);
                border-top: 1px solid var(--border-light);
                flex-shrink: 0;
                text-align: left;
                font-size: 0.85em;
                color: var(--text-light-secondary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: help;
            }
            #stv-timer-popup:not(.light-theme) #popup-footer-status {
                background-color: var(--bg-dark-header);
                border-top: 1px solid var(--border-dark);
                color: var(--text-dark-secondary);
            }
            #last-item-name-footer {
                font-weight: 700;
                color: var(--text-light-primary);
            }
            #stv-timer-popup:not(.light-theme) #last-item-name-footer {
                 color: var(--text-dark-primary);
            }

            .section-title {
                font-weight: 700;
                font-size: 0.9em;
                color: var(--text-light-secondary);
                margin-bottom: 12px;
                padding-bottom: 5px;
                border-bottom: 1px solid var(--border-light);
                text-transform: uppercase;
            }
            #stv-timer-popup:not(.light-theme) .section-title {
                 color: var(--text-dark-secondary);
                 border-bottom-color: var(--border-dark);
            }

            input[type="number"], input[type="text"], select {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid var(--border-light);
                border-radius: 6px;
                font-size: 0.9em;
                font-weight: 600;
                background-color: var(--bg-light-primary);
                color: var(--text-light-primary);
                box-sizing: border-box;
            }
            #stv-timer-popup:not(.light-theme) input[type="number"],
            #stv-timer-popup:not(.light-theme) input[type="text"],
            #stv-timer-popup:not(.light-theme) select {
                background-color: var(--bg-dark-primary);
                color: var(--text-dark-primary);
                border-color: var(--border-dark);
            }

            .switch-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid var(--border-light);
            }
            .switch-item:last-child {
                border-bottom: none;
            }
            #stv-timer-popup:not(.light-theme) .switch-item {
                 border-bottom-color: var(--border-dark);
            }
            .switch-item-label {
                 font-weight: 600;
                 color: var(--text-light-primary);
            }
            #stv-timer-popup:not(.light-theme) .switch-item-label {
                 color: var(--text-dark-primary);
            }
            .switch-item-desc {
                font-size: 0.85em;
                color: var(--text-light-secondary);
                margin-top: 4px;
            }
            #stv-timer-popup:not(.light-theme) .switch-item-desc {
                 color: var(--text-dark-secondary);
            }

            .switch { position: relative; display: inline-block; width: 40px; height: 20px; flex-shrink: 0; margin-left: 10px;}
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #CCC; transition: .4s; border-radius: 20px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            #stv-timer-popup:not(.light-theme) .slider { background-color: #555; }
            input:checked + .slider { background-color: var(--blue-accent); }
            input:checked + .slider:before { transform: translateX(20px); }

            .btn-primary {
                width: 100%;
                background-color: var(--blue-accent);
                color: #202124;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 0.9em;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .btn-primary:hover { opacity: 0.8; }
            .btn-danger {
                background-color: #EA4335;
                color: white;
            }

            #item-counts-list .count-item {
                display: flex; justify-content: space-between; font-size: 0.9em; padding: 10px 5px; border-bottom: 1px solid var(--border-light);
            }
            #stv-timer-popup:not(.light-theme) #item-counts-list .count-item {
                 border-bottom-color: var(--border-dark);
            }
            #item-counts-list .count-item:last-child { border-bottom: none; }
            #item-counts-list .count-value { font-weight: 800; color: var(--blue-accent); }
            #item-counts-list .drug-item { font-weight: bold; color: #34A853; cursor: pointer; }
            #item-counts-list .toggle-icon { margin-left: 5px; display: inline-block; transition: transform 0.2s; }
            #item-counts-list .drug-item.toggled .toggle-icon { transform: rotate(90deg); }

            .drug-detail-list { padding-left: 10px; margin-top: 10px; border-left: 2px solid #34A853; display: block; margin-bottom: 10px; }
            .drug-detail-group-title {
                display: flex; justify-content: space-between; font-weight: 600; font-size: 0.85em; color: #34A853; margin: 5px 0 3px 0; padding-bottom: 3px; border-bottom: 1px dashed #34A853;
            }
            .drug-detail-group-title .total-count { font-weight: 700; color: #FBBC04; font-size: 1.1em; }
            .drug-detail-item { display: flex; justify-content: space-between; font-size: 0.8em; padding: 4px 0; color: var(--text-light-secondary); border-bottom: 1px dotted var(--border-light); }
            #stv-timer-popup:not(.light-theme) .drug-detail-item { color: var(--text-dark-secondary); border-bottom-color: var(--border-dark); }
            .drug-detail-item .count-value { font-weight: 700; color: var(--blue-accent); }
            .stats-controls { margin-bottom: 15px; display: flex; gap: 10px; }
            .stats-controls .btn-primary { background-color: #f0ad4e; color: #333; }
            .stats-controls select { width: 50% !important; }

            .history-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            .history-delete-btn {
                background-color: #f0ad4e; color: #333;
                border: none; border-radius: 6px; padding: 0 12px;
                font-size: 0.85em; font-weight: 700; cursor: pointer;
                flex-shrink: 0; opacity: 0.9;
            }
            .history-delete-btn:hover { opacity: 1; }
            #history-delete-all-btn { background-color: #EA4335; color: white; }

            #history-log-list { max-height: 270px; overflow-y: auto; text-align: left; }
            .history-day-group { margin-bottom: 8px; border: 1px solid var(--border-light); border-radius: 6px; overflow: hidden; }
            #stv-timer-popup:not(.light-theme) .history-day-group { border-color: var(--border-dark); }
            .history-day-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 10px; background-color: var(--bg-light-primary);
                cursor: pointer; list-style: none;
            }
            #stv-timer-popup:not(.light-theme) .history-day-header { background-color: var(--bg-dark-primary); }
            .history-day-header::-webkit-details-marker { display: none; }
            .history-day-group[open] .history-day-header { border-bottom: 1px solid var(--border-light); }
            #stv-timer-popup:not(.light-theme) .history-day-group[open] .history-day-header { border-bottom-color: var(--border-dark); }
            .history-day-header::before {
                content: '►'; font-size: 0.7em; margin-right: 8px;
                color: var(--text-light-secondary); transition: transform 0.2s;
            }
            #stv-timer-popup:not(.light-theme) .history-day-header::before { color: var(--text-dark-secondary); }
            .history-day-group[open] .history-day-header::before { transform: rotate(90deg); }
            .history-day-label {
                font-weight: 800; font-size: 0.9em;
                color: var(--blue-accent); flex-grow: 1;
            }
            .history-day-header .history-delete-btn { padding: 4px 8px; font-size: 0.75em; margin-left: 10px; }
            .history-day-content { padding: 0 10px 5px 10px; }
            .history-item {
                display: flex; justify-content: space-between; font-size: 0.85em;
                padding: 6px 0; border-bottom: 1px dotted var(--border-light);
                color: var(--text-light-secondary);
            }
            #stv-timer-popup:not(.light-theme) .history-item { color: var(--text-dark-secondary); border-bottom-color: var(--border-dark); }
            .history-day-content .history-item:last-child { border-bottom: none; }
            .history-time { font-weight: 700; color: var(--blue-accent); margin-right: 8px; flex-shrink: 0; }
            .history-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; font-weight: 500; }
            .history-empty-placeholder {
                text-align: center; color: var(--text-light-secondary);
                font-size: 0.85em; padding: 20px 0;
            }
            #stv-timer-popup:not(.light-theme) .history-empty-placeholder { color: var(--text-dark-secondary); }

            #stv-timer-popup.minimized {
                width: 120px !important; padding: 0 !important;
                height: auto !important; min-width: 120px !important;
                overflow: hidden !important; resize: none !important;
                min-height: 0 !important;
            }
            #stv-timer-popup.minimized .main-status-wrapper,
            #stv-timer-popup.minimized .tab-nav-container,
            #stv-timer-popup.minimized .tab-content-wrapper,
            #stv-timer-popup.minimized #popup-footer-status,
            #stv-timer-popup.minimized #close-panel-btn {
                display: none !important;
            }
            #stv-timer-popup.minimized #popup-header-status {
                border-bottom: none !important;
                padding: 10px;
            }
            #stv-timer-popup.minimized #main-header-text {
                display: none;
            }
            #stv-timer-popup.minimized #minimize-btn {
                position: static;
                color: var(--text-light-secondary);
            }
            #stv-timer-popup.minimized:not(.light-theme) #minimize-btn {
                color: var(--text-dark-secondary);
            }

            #stv-timer-popup.script-disabled {
                border-color: #555;
            }
            #stv-timer-popup.script-disabled #popup-header-status {
                background-color: #333;
            }
            #stv-timer-popup.script-disabled #popup-footer-status {
                display: none;
            }
            #stv-timer-popup.script-disabled #cooldown-display {
                color: #777 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function setPageTitle(statusText) {
        if (!originalPageTitle) {
            originalPageTitle = document.title;
        }
        if (statusText && statusText.length > 0) {
            document.title = `(${statusText}) ${originalPageTitle}`;
        } else {
            document.title = originalPageTitle;
        }
    }

    function createErrorUI(message) {
        if (document.getElementById('stv-error-popup')) return;
        const popup = document.createElement('div');
        popup.id = 'stv-error-popup';
        popup.style.cssText = `position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background-color: #d9534f; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 100001; text-align: center; font-family: Arial; font-size: 1.1em;`;
        popup.innerHTML = `
            <strong style="display: block; margin-bottom: 5px;">STV Auto-Collect Lỗi Treo Máy</strong>
            <span id="error-message-text">${message}</span><br>
            <strong id="error-timer-display" style="font-size: 1.3em; margin-top: 5px; display: block;">Tải lại sau: 40s</strong>
        `;
        document.body.appendChild(popup);
    }

    function updateErrorUI(timeLeftMs) {
        const errorDisplay = document.getElementById('error-timer-display');
        if (!errorDisplay) return;
        const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
        const displayTime = `Tải lại sau: ${totalSeconds}s`;
        errorDisplay.textContent = displayTime;
        setPageTitle(`🔥 LỖI ${totalSeconds}s`);
    }

    function removeErrorUI() {
        const popup = document.getElementById('stv-error-popup');
        if (popup) popup.remove();
        setPageTitle('');
    }

    let debounceTimer;
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    function renderHistoryLog() {
        if (!elHistoryLogList) return;

        let searchText = '';
        if (elHistorySearchInput) {
            searchText = elHistorySearchInput.value.toLowerCase().trim();
        }

        let logHtml = '';
        const dateKeys = Object.keys(historyData).sort().reverse();

        if (dateKeys.length === 0) {
            logHtml = '<div class="history-empty-placeholder">Chưa có vật phẩm nào được nhặt.</div>';
            elHistoryLogList.innerHTML = logHtml;
            return;
        }

        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        today.setDate(today.getDate() - 1);
        const yesterdayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        let resultsFound = false;

        dateKeys.forEach(dateKey => {
            const items = historyData[dateKey];
            const filteredItems = items.filter(log => {
                if (searchText === '') return true;
                return log.name.toLowerCase().includes(searchText);
            });

            if (filteredItems.length === 0) {
                return;
            }

            resultsFound = true;
            let dayLabel = '';
            if (dateKey === todayKey) {
                dayLabel = 'Hôm nay';
            } else if (dateKey === yesterdayKey) {
                dayLabel = 'Hôm qua';
            } else {
                const parts = dateKey.split('-');
                dayLabel = `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const isToday = (dateKey === todayKey);
            const itemCount = items.length;

            logHtml += `<details class="history-day-group" ${isToday ? 'open' : ''}>`;
            logHtml += `
                <summary class="history-day-header">
                    <span class="history-day-label">${dayLabel} (${itemCount} / ${MAX_HISTORY_PER_DAY})</span>
                    <button class="history-delete-day-btn history-delete-btn" data-date-key="${dateKey}" title="Xóa lịch sử ngày ${dayLabel}">Xóa</button>
                </summary>
            `;
            logHtml += `<div class="history-day-content">`;
            filteredItems.forEach(log => {
                logHtml += `
                    <div class="history-item" title="${log.name}">
                        <span class="history-time">[${log.time}]</span>
                        <span class="history-name">${log.name}</span>
                    </div>
                `;
            });
            logHtml += `</div>`;
            logHtml += `</details>`;
        });

        if (!resultsFound) {
             if (searchText !== '') {
                 logHtml = '<div class="history-empty-placeholder">Không tìm thấy kết quả nào.</div>';
             } else {
                 logHtml = '<div class="history-empty-placeholder">Chưa có vật phẩm nào được nhặt.</div>';
             }
        }

        elHistoryLogList.innerHTML = logHtml;
    }

    function createTimerUI() {
        const oldPopup = document.getElementById('stv-timer-popup');
        if (oldPopup) oldPopup.remove();
        const oldToggleButton = document.getElementById('stv-toggle-button');
        if (oldToggleButton) oldToggleButton.remove();

        if (EXCLUDED_PAGE_REGEX.test(window.location.pathname) || uiMounted) {
            return;
        }

        if (!originalPageTitle) {
            originalPageTitle = document.title;
        }

        const initialTreoMayTarget = Math.max(1, parseInt(localStorage.getItem(STORAGE_KEY_TREO_MAY_TARGET) || '1', 10));

        const popup = document.createElement('div');
        popup.id = 'stv-timer-popup';
        if (currentTheme === 'light') {
            popup.classList.add('light-theme');
        }
        if (isMinimized) popup.classList.add('minimized');
        if (isPanelHidden) popup.classList.add('panel-hidden');
        if (!isScriptEnabled) popup.classList.add('script-disabled');

        const minimizeIcon = `
            <svg id="minimize-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="${isMinimized ? '6 9 12 15 18 9' : '18 15 12 9 6 15'}"></polyline>
            </svg>
        `;
        const closeIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        popup.innerHTML = `
            <div class="header" id="popup-header-status">
                <div class="header-title-wrapper">
                    <span id="led-indicator" class="led-disabled" title="Trạng thái"></span>
                    <span id="main-header-text">STV Auto-Collect</span>
                </div>
                <div class="header-controls-wrapper">
                    <button id="close-panel-btn" title="Ẩn Panel (Hiện nút ⚙️)">${closeIcon}</button>
                    <button id="minimize-btn" title="Thu nhỏ/Phóng to">${minimizeIcon}</button>
                </div>
            </div>

            <div class="main-status-wrapper">
                <div class="cooldown-label" id="cooldown-label-text">Đang tải...</div>
                <div id="cooldown-display">--:--</div>
                <div id="collect-status">Đang chờ thiết lập...</div>
                <div class="status-line">
                    <span>Đã nhặt (Tổng):</span>
                    <span id="collect-count" class="status-value">${collectCount.toLocaleString()}</span>
                    <button id="reset-total-count-btn" title="Reset số đếm tổng về 0 (Giữ nguyên thống kê chi tiết)">&#8634;</button>
                </div>
            </div>

            <div class="tab-nav-container">
                <button class="tab-btn ${activeTab === 'treo-may' ? 'active' : ''}" data-tab="treo-may">Treo Máy</button>
                <button class="tab-btn ${activeTab === 'stats' ? 'active' : ''}" data-tab="stats">Thống Kê</button>
                <button class="tab-btn ${activeTab === 'history' ? 'active' : ''}" data-tab="history">Lịch Sử</button>
                <button class="tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">Cài Đặt</button>
            </div>

            <div class="tab-content-wrapper">

                <div id="tab-treo-may" class="tab-panel ${activeTab === 'treo-may' ? '' : 'hidden'}">
                    <div class="section-title">Chế Độ Treo Máy</div>
                    <div class="switch-item">
                        <div>
                            <div class="switch-item-label">Treo Máy (Bật/Tắt)</div>
                            <div class="switch-item-desc">Tự động tải lại trang để săn.</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="auto-reload-toggle" ${isTreoMayEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="switch-item">
                        <div>
                            <div class="switch-item-label">Mục tiêu Nhặt (Session)</div>
                            <div class="switch-item-desc" id="auto-reload-session-display-header">
                                Đã nhặt: ${treoMaySessionCount.toLocaleString()} / ${treoMayTarget.toLocaleString()}
                            </div>
                        </div>
                        <input type="number" id="auto-reload-target" min="1" value="${initialTreoMayTarget}" style="width: 70px; text-align: center;">
                    </div>
                    <div class="switch-item">
                         <button id="reset-session-btn" class="btn-primary" style="background-color: #f0ad4e; color: #333;">Reset Phiên Treo Máy</button>
                    </div>
                </div>

                <div id="tab-stats" class="tab-panel ${activeTab === 'stats' ? '' : 'hidden'}">
                    <div class="stats-controls">
                        <select id="stats-view-select">
                            <option value="total" ${statsViewMode === 'total' ? 'selected' : ''}>Toàn bộ</option>
                            <option value="today" ${statsViewMode === 'today' ? 'selected' : ''}>Hôm nay</option>
                            <option value="yesterday" ${statsViewMode === 'yesterday' ? 'selected' : ''}>Hôm qua</option>
                        </select>
                        <button id="stats-reset-btn" class="btn-primary" title="Reset toàn bộ đếm vật phẩm về 0">Reset</button>
                    </div>
                    <div id="item-counts-list">
                        </div>
                </div>

                <div id="tab-history" class="tab-panel ${activeTab === 'history' ? '' : 'hidden'}">
                    <div class="history-controls">
                        <input type="text" id="history-search-input" placeholder="Tìm kiếm lịch sử...">
                        <button id="history-delete-all-btn" class="history-delete-btn" title="Xóa toàn bộ lịch sử">Xóa</button>
                    </div>
                    <div id="history-log-list">
                        </div>
                </div>

                <div id="tab-settings" class="tab-panel ${activeTab === 'settings' ? '' : 'hidden'}">
                    <div class="section-title">Script</div>
                    <div class="switch-item">
                        <div>
                            <div class="switch-item-label">Bật Script</div>
                            <div class="switch-item-desc">Tắt script sẽ vô hiệu hóa toàn bộ.</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="script-enable-toggle" ${isScriptEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="switch-item">
                        <div>
                            <div class="switch-item-label">Giao diện (Theme)</div>
                            <div class="switch-item-desc" id="theme-toggle-label">${currentTheme === 'light' ? 'Đang dùng: Sáng' : 'Đang dùng: Tối'}</div>
                        </div>
                        <button id="theme-toggle-btn" class="btn-primary" style="width: 100px;">Chuyển</button>
                    </div>

                    <div class="section-title" style="margin-top: 20px;">Cooldown</div>
                    <div class="switch-item">
                        <div class="switch-item-label">Mốc Cooldown</div>
                        <select id="cooldown-select" style="width: 150px;">
                            <option value="10m">8 - 10 Phút</option>
                            <option value="1m45s">30s - 1m 45s</option>
                        </select>
                    </div>

                    <div class="section-title" style="margin-top: 20px;">Dữ liệu</div>
                    <div class="switch-item">
                        <button id="main-control-btn" class="btn-primary btn-danger">
                            RESET TẤT CẢ DỮ LIỆU
                        </button>
                    </div>
                </div>

            </div>

            <div id="popup-footer-status" title="Vật phẩm gần nhất (chưa có)">
                <span>Cuối cùng:</span>
                <span id="last-item-name-footer">N/A</span>
            </div>
        `;

        document.body.appendChild(popup);

        const toggleButton = document.createElement('div');
        toggleButton.id = 'stv-toggle-button';
        toggleButton.title = 'Mở Panel Auto-Collect';
        toggleButton.innerHTML = '⚙️';
        if (isPanelHidden) {
            toggleButton.classList.add('panel-visible');
        }
        document.body.appendChild(toggleButton);

        uiMounted = true;

        elPopup = popup;
        elMainHeaderText = document.getElementById('main-header-text');
        elAutoReloadSessionDisplayHeader = document.getElementById('auto-reload-session-display-header');
        elResetSessionBtn = document.getElementById('reset-session-btn');
        elCollectCount = document.getElementById('collect-count');
        elCollectStatus = document.getElementById('collect-status');
        elCooldownLabelText = document.getElementById('cooldown-label-text');
        elCooldownDisplay = document.getElementById('cooldown-display');
        elLastItemName = document.getElementById('last-item-name-footer');
        elItemCountsList = document.getElementById('item-counts-list');
        elHistoryLogList = document.getElementById('history-log-list');
        elHistorySearchInput = document.getElementById('history-search-input');
        elMinimizeIconSvg = document.getElementById('minimize-icon-svg');
        elStatsViewSelect = document.getElementById('stats-view-select');
        elResetTotalCountBtn = document.getElementById('reset-total-count-btn');

        document.getElementById('main-control-btn').addEventListener('click', () => {
            if (window.confirm("Bạn có chắc chắn muốn RESET tất cả trạng thái, số lần nhặt và bộ đếm thời gian, bao gồm cả thống kê vật phẩm, lịch sử và trạng thái Treo Máy?")) {
                resetAllState();
            }
        });

        document.getElementById('minimize-btn').addEventListener('click', toggleMinimize);

        const elToggleButton = document.getElementById('stv-toggle-button');
        const elClosePanelBtn = document.getElementById('close-panel-btn');
        function setPanelHidden(hidden) {
            isPanelHidden = hidden;
            localStorage.setItem(STORAGE_KEY_PANEL_HIDDEN, isPanelHidden);

            if (hidden) {
                elPopup.classList.add('panel-hidden');
                elToggleButton.classList.add('panel-visible');
                setPageTitle('');
            } else {
                elPopup.classList.remove('panel-hidden');
                elToggleButton.classList.remove('panel-visible');
                if (!isMinimized) updateDynamicUI();
            }
        }
        elClosePanelBtn.addEventListener('click', () => setPanelHidden(true));
        elToggleButton.addEventListener('click', () => setPanelHidden(false));

        document.getElementById('cooldown-select').value = currentPreset;
        document.getElementById('cooldown-select').addEventListener('change', (e) => {
            currentPreset = e.target.value;
            localStorage.setItem(STORAGE_KEY_PRESET, currentPreset);
            if (Date.now() >= cooldownEndTime) startNewCooldown(true);
            updateDynamicUI();
        });

        document.getElementById('script-enable-toggle').addEventListener('change', (e) => {
            isScriptEnabled = e.target.checked;
            localStorage.setItem(STORAGE_KEY_SCRIPT_ENABLED, isScriptEnabled);
            alert(isScriptEnabled ? 'Đã BẬT Script. Trang sẽ tải lại.' : 'Đã TẮT Script. Trang sẽ tải lại.');
            window.location.reload();
        });

        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
            localStorage.setItem(STORAGE_KEY_UI_THEME, currentTheme);
            elPopup.classList.toggle('light-theme');
            document.getElementById('theme-toggle-label').textContent = (currentTheme === 'light') ? 'Đang dùng: Sáng' : 'Đang dùng: Tối';
        });

        const tabNav = popup.querySelector('.tab-nav-container');
        const tabContent = popup.querySelector('.tab-content-wrapper');
        tabNav.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-btn');
            if (!tabButton || tabButton.classList.contains('active')) return;

            const tabKey = tabButton.dataset.tab;
            activeTab = tabKey;
            localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);

            tabNav.querySelector('.tab-btn.active').classList.remove('active');
            tabContent.querySelector('.tab-panel:not(.hidden)').classList.add('hidden');

            tabButton.classList.add('active');
            tabContent.querySelector(`#tab-${tabKey}`).classList.remove('hidden');
        });

        const tabStats = document.getElementById('tab-stats');
        tabStats.addEventListener('click', (e) => {
            const drugItemCount = e.target.closest('#drug-item-count');
            if (drugItemCount) {
                toggleDrugDetails();
            }
            if (e.target.id === 'stats-reset-btn') {
                if (window.confirm("Bạn có chắc chắn muốn RESET toàn bộ thống kê vật phẩm (công pháp, đan dược, v.v.)?\n\n(Hành động này KHÔNG ảnh hưởng đến Tổng số nhặt.)")) {
                    resetStatistics();
                }
            }
        });

        elStatsViewSelect.addEventListener('change', (e) => {
             statsViewMode = e.target.value;
             localStorage.setItem(STORAGE_KEY_STATS_VIEW_MODE, statsViewMode);
             updateStaticUI();
        });

        if (elResetTotalCountBtn) {
            elResetTotalCountBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.confirm("Bạn muốn reset bộ đếm TỔNG (số lớn) về 0?\n(Thao tác này chỉ reset số hiển thị, không xóa dữ liệu thống kê chi tiết).")) {
                    collectCount = 0;
                    localStorage.setItem(STORAGE_KEY_COUNT, '0');
                    updateStaticUI();
                    if(window.ui && window.ui.notif) window.ui.notif("Đã reset bộ đếm tổng.");
                }
            });
        }

        const autoReloadToggle = document.getElementById('auto-reload-toggle');
        const autoReloadTargetInput = document.getElementById('auto-reload-target');
        autoReloadToggle.addEventListener('change', (e) => {
            isTreoMayEnabled = e.target.checked;
            localStorage.setItem(STORAGE_KEY_TREO_MAY_TOGGLE, isTreoMayEnabled);
            if (isTreoMayEnabled && !READING_PAGE_REGEX.test(window.location.pathname) && window.ui && window.ui.alert) {
                window.ui.alert("Vui lòng vào trang đọc truyện để kích hoạt tính năng Treo Máy!");
            }
            if (!isTreoMayEnabled) resetTreoMayState(false);
            updateDynamicUI();
        });
        autoReloadTargetInput.addEventListener('change', (e) => {
            let target = parseInt(e.target.value, 10);
            if (isNaN(target) || target < 1) {
                target = 1;
                e.target.value = 1;
            }
            treoMayTarget = target;
            localStorage.setItem(STORAGE_KEY_TREO_MAY_TARGET, treoMayTarget);
            updateDynamicUI();
        });
        elResetSessionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.confirm("Bạn có muốn reset số đếm của phiên treo máy này (ví dụ: 1/15 -> 0/15)?\n(Hành động này không reset Tổng số nhặt.)")) {
                treoMaySessionCount = 0;
                localStorage.setItem(STORAGE_KEY_TREO_MAY_SESSION_COUNT, '0');
                updateDynamicUI();
            }
        });

        const tabHistory = document.getElementById('tab-history');
        if (elHistorySearchInput) {
            elHistorySearchInput.addEventListener('input', debounce(renderHistoryLog, 250));
        }
        tabHistory.addEventListener('click', (e) => {
            if (e.target.id === 'history-delete-all-btn') {
                if (window.confirm("Bạn có chắc chắn muốn XÓA TOÀN BỘ lịch sử vật phẩm? (2 ngày)")) {
                    historyData = {};
                    localStorage.setItem(STORAGE_KEY_HISTORY_LOG_V2, '{}');
                    renderHistoryLog();
                }
            }
            const deleteDayBtn = e.target.closest('.history-delete-day-btn');
            if (deleteDayBtn) {
                const dateKey = deleteDayBtn.dataset.dateKey;
                if (dateKey && window.confirm(`Bạn có chắc chắn muốn XÓA toàn bộ lịch sử của ngày ${dateKey}?`)) {
                    delete historyData[dateKey];
                    localStorage.setItem(STORAGE_KEY_HISTORY_LOG_V2, JSON.stringify(historyData));
                    renderHistoryLog();
                }
            }
        });

        updateDynamicUI();
        renderHistoryLog();
        updateStaticUI();
    }

    function resetStatistics() {
        itemCounts = { ...initialItemCounts };
        drugDetails = { ...initialDrugDetails };
        isDrugDetailsVisible = false;
        dailyStats = {};

        localStorage.setItem(STORAGE_KEY_ITEM_COUNTS, JSON.stringify(itemCounts));
        localStorage.setItem(STORAGE_KEY_DRUG_DETAILS, JSON.stringify(drugDetails));
        localStorage.setItem(STORAGE_KEY_DRUG_TOGGLE, 'false');
        localStorage.setItem(STORAGE_KEY_DAILY_STATS, '{}');

        if(window.ui && window.ui.notif) {
             window.ui.notif("Đã reset thống kê vật phẩm!");
        }
        updateStaticUI();
    }


    function resetTreoMayState(shouldSave = true) {
        treoMaySessionCount = 0;
        treoMayState = 'COOLDOWN';
        huntEndTime = 0;
        if (shouldSave) {
            localStorage.setItem(STORAGE_KEY_TREO_MAY_SESSION_COUNT, '0');
            localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'COOLDOWN');
            localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, '0');
        }
    }

    function resetAllState() {
        collectCount = 0;
        cooldownEndTime = 0;
        lastCollectedItem = {};
        itemCounts = { ...initialItemCounts };
        drugDetails = { ...initialDrugDetails };
        dailyStats = {};
        historyData = {};
        setPageTitle('');
        isTreoMayEnabled = false;
        treoMayTarget = 1;
        resetTreoMayState(false);
        isScriptEnabled = true;
        activeTab = 'treo-may';
        isPanelHidden = false;
        currentTheme = 'light';
        statsViewMode = 'total';

        localStorage.setItem(STORAGE_KEY_COUNT, '0');
        localStorage.setItem(STORAGE_KEY_COOLDOWN_END, '0');
        localStorage.setItem(STORAGE_KEY_LAST_ITEM, '{}');
        localStorage.setItem(STORAGE_KEY_ITEM_COUNTS, JSON.stringify(itemCounts));
        localStorage.setItem(STORAGE_KEY_DRUG_DETAILS, JSON.stringify(drugDetails));
        localStorage.setItem(STORAGE_KEY_DRUG_TOGGLE, 'false');
        localStorage.setItem(STORAGE_KEY_DAILY_STATS, '{}');

        localStorage.setItem(STORAGE_KEY_HISTORY_LOG_V2, '{}');

        localStorage.removeItem(STORAGE_KEY_TREO_MAY_TOGGLE);
        localStorage.setItem(STORAGE_KEY_TREO_MAY_TARGET, '1');
        localStorage.removeItem(STORAGE_KEY_TREO_MAY_SESSION_COUNT);
        localStorage.removeItem(STORAGE_KEY_TREO_MAY_STATE);
        localStorage.removeItem(STORAGE_KEY_TREO_MAY_HUNT_END);
        localStorage.removeItem(STORAGE_KEY_TREO_MAY_ERROR_STATE);
        localStorage.removeItem(STORAGE_KEY_SCRIPT_ENABLED);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_TAB);
        localStorage.removeItem(STORAGE_KEY_PANEL_HIDDEN);
        localStorage.removeItem(STORAGE_KEY_UI_THEME);
        localStorage.removeItem(STORAGE_KEY_STATS_VIEW_MODE);

        if(window.ui && window.ui.notif) {
             window.ui.notif("Đã RESET toàn bộ trạng thái!");
        }

        const toggleBtn = document.getElementById('stv-toggle-button');
        if (toggleBtn) toggleBtn.remove();
        if(elPopup) elPopup.remove();
        uiMounted = false;

        window.location.reload();
    }

    function toggleDrugDetails() {
        isDrugDetailsVisible = !isDrugDetailsVisible;
        localStorage.setItem(STORAGE_KEY_DRUG_TOGGLE, isDrugDetailsVisible);
        updateStaticUI();
    }

    function toggleMinimize() {
        const popup = elPopup;
        const minimizeIconSvg = elMinimizeIconSvg;
        if (!popup || !minimizeIconSvg) return;

        isMinimized = !isMinimized;
        localStorage.setItem(STORAGE_KEY_MINIMIZED, isMinimized);

        if (isMinimized) {
            popup.classList.add('minimized');
            minimizeIconSvg.innerHTML = `<polyline points="6 9 12 15 18 9"></polyline>`;
            setPageTitle('');
        } else {
            popup.classList.remove('minimized');
            minimizeIconSvg.innerHTML = `<polyline points="18 15 12 9 6 15"></polyline>`;
            updateStaticUI();
        }
        updateDynamicUI();
    }

    function renderDrugDetails(sourceDrugDetails) {
        let html = '';
        const drugTypeNames = { 'ThienVan': 'Thiên Vận Đan', 'TuLinh': 'Tụ Linh Đan', 'TayTuy': 'Tẩy Tủy Đan', 'TuKhi': 'Tụ Khí Đan' };
        let totalDrugCount = 0;

        for (const key in drugTypeNames) {
            if (sourceDrugDetails.hasOwnProperty(key)) {
                const groupTitle = drugTypeNames[key];
                let currentDrugTotal = 0;

                const levelsData = DETAILED_DRUG_LEVELS.map(level => {
                    const levelStr = level.toString();
                    const data = sourceDrugDetails[key][levelStr];
                    if (data && data.count > 0) {
                        currentDrugTotal += data.count;
                        const quality = CUSTOM_LEVEL_TO_QUALITY_MAP[level] || 'N/A';
                        return { levelStr, count: data.count, quality: quality };
                    }
                    return null;
                }).filter(Boolean).sort((a, b) => parseInt(a.levelStr) - parseInt(b.levelStr));

                totalDrugCount += currentDrugTotal;

                if (currentDrugTotal > 0) {
                    html += `<div class="drug-detail-list">`;
                    html += `<div class="drug-detail-group-title">
                                <span>${groupTitle}</span>
                                <span class="total-count">(Tổng: ${currentDrugTotal.toLocaleString()})</span>
                            </div>`;
                    levelsData.forEach(({ levelStr, count, quality }) => {
                        const displayQuality = quality ? `(${quality})` : '';
                        html += `
                            <div class="drug-detail-item">
                                <span>- Cấp ${levelStr} <span class="quality-level">${displayQuality}</span></span>
                                <span class="count-value">${count.toLocaleString()}</span>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }
            }
        }
        return { html, total: totalDrugCount };
    }

    function updateStaticUI() {
        if (!elPopup || isMinimized) return;

        if (elCollectCount) elCollectCount.textContent = collectCount.toLocaleString();

        const footer = document.getElementById('popup-footer-status');
        if (elLastItemName && footer) {
            const itemName = lastCollectedItem.name || 'N/A';
            elLastItemName.textContent = itemName;

            const itemLevel = lastCollectedItem.level || 'Cấp: N/A';
            let itemInfo = (lastCollectedItem.info || 'Thông tin: N/A').replace(/<br\s*\/?>/gi, '\n');
            itemInfo = itemInfo.replace(/<[^>]*>/g, '');

            const tooltipText = `Tên: ${itemName}\n${itemLevel}\n${itemInfo}`;

            footer.setAttribute('title', tooltipText);
        }

        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        today.setDate(today.getDate() - 1);
        const yesterdayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        let displayCounts = { ...initialItemCounts };
        let displayDrugDetails = { ...initialDrugDetails };

        if (statsViewMode === 'today') {
            if (dailyStats[todayKey]) {
                displayCounts = { ...initialItemCounts, ...dailyStats[todayKey].counts };
                displayDrugDetails = dailyStats[todayKey].drugs || { ...initialDrugDetails };
            }
        } else if (statsViewMode === 'yesterday') {
            if (dailyStats[yesterdayKey]) {
                displayCounts = { ...initialItemCounts, ...dailyStats[yesterdayKey].counts };
                displayDrugDetails = dailyStats[yesterdayKey].drugs || { ...initialDrugDetails };
            }
        } else {
            // 'total'
            displayCounts = itemCounts;
            displayDrugDetails = drugDetails;
        }

        const itemMapping = { 'CongPhap': 'Công pháp', 'VoKy': 'Võ kỹ', 'LinhThach': 'Linh thạch', 'LenhBaiUyVong': 'Lệnh bài Uy Vọng', 'DanDuoc': 'Đan dược' };
        let countsHtml = '';
        const drugRenderResult = renderDrugDetails(displayDrugDetails);
        const drugDetailsHtml = drugRenderResult.html;
        displayCounts['DanDuoc'] = drugRenderResult.total;

        const itemCountsList = elItemCountsList;

        for (const key in displayCounts) {
            if (displayCounts.hasOwnProperty(key) && itemMapping[key] && displayCounts[key] >= 0) {
                const isDrugItem = key === 'DanDuoc';
                const itemClass = isDrugItem ? 'count-item drug-item' : 'count-item';
                const drugItemAttr = isDrugItem ? `id="drug-item-count" class="${itemClass} ${isDrugDetailsVisible ? 'toggled' : ''}"` : `class="${itemClass}"`;

                countsHtml += `
                    <div ${drugItemAttr}>
                        <span>${itemMapping[key]}
                            ${isDrugItem ? `<span class="toggle-icon">${isDrugDetailsVisible ? '&#9660;' : '&#9658;'}</span>` : ''}
                        </span>
                        <span class="count-value">${displayCounts[key].toLocaleString()}</span>
                    </div>
                `;

                if (isDrugItem) {
                    countsHtml += `<div id="drug-details-wrapper" style="display: ${isDrugDetailsVisible ? 'block' : 'none'};" class="drug-detail-wrapper">${drugDetailsHtml}</div>`;
                }
            }
        }
        if (itemCountsList) itemCountsList.innerHTML = countsHtml;
    }


    function updateDynamicUI() {
        if (isCollecting) {
            return;
        }

        const popup = elPopup;
        if (!popup && !document.getElementById('stv-error-popup')) return;

        const mainHeaderText = elMainHeaderText;
        const collectStatus = elCollectStatus;
        const cooldownDisplay = elCooldownDisplay;
        const cooldownLabelText = elCooldownLabelText;
        const autoReloadSessionDisplayHeader = elAutoReloadSessionDisplayHeader;
        const led = document.getElementById('led-indicator');
        const toggleButton = document.getElementById('stv-toggle-button');

        let ledStatusClass = 'led-disabled';
        function setLedStatus(status) {
            ledStatusClass = `led-${status}`;
        }

        if (!isScriptEnabled) {
            if (popup) {
                popup.className = 'script-disabled ' +
                                  (currentTheme === 'light' ? 'light-theme ' : '') +
                                  (isMinimized ? 'minimized ' : '') +
                                  (isPanelHidden ? 'panel-hidden ' : '');
            }
            if (toggleButton) {
                toggleButton.classList.toggle('panel-visible', isPanelHidden);
            }

            if (mainHeaderText) mainHeaderText.textContent = 'SCRIPT ĐÃ TẮT';

            popup.querySelector('.main-status-wrapper').style.display = 'none';
            popup.querySelector('#popup-footer-status').style.display = 'none';
            popup.querySelector('.tab-nav-container').style.display = 'flex';
            popup.querySelector('.tab-content-wrapper').style.display = 'block';

            popup.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab !== 'settings') {
                    btn.style.display = 'none';
                } else {
                    btn.style.display = 'block';
                    if (!btn.classList.contains('active')) {
                        const oldActiveTab = popup.querySelector('.tab-btn.active');
                        if (oldActiveTab) oldActiveTab.classList.remove('active');
                        btn.classList.add('active');
                        activeTab = 'settings';
                        localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
                    }
                }
            });
            popup.querySelector('.tab-nav-container').style.justifyContent = 'center';

            popup.querySelectorAll('.tab-panel').forEach(panel => {
                if (panel.id !== 'tab-settings') {
                    if (!panel.classList.contains('hidden')) panel.classList.add('hidden');
                } else {
                    panel.classList.remove('hidden');
                }
            });

            setLedStatus('disabled');
            setPageTitle('SCRIPT ĐÃ TẮT');
            if (led) led.className = ledStatusClass;
            return;
        }

        if (popup) {
            popup.querySelector('.main-status-wrapper').style.display = 'block';
            popup.querySelector('#popup-footer-status').style.display = 'block';
            popup.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'block');
            popup.querySelector('.tab-nav-container').style.justifyContent = 'space-around';

            popup.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === activeTab);
            });
            popup.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('hidden', panel.id !== `tab-${activeTab}`);
            });
        }


        const isChapterReadingPage = READING_PAGE_REGEX.test(window.location.pathname);
        const now = Date.now();
        const timeLeftMs = cooldownEndTime - now;
        const isCooldownOver = timeLeftMs <= 0;

        let statusMessage = 'Đang chờ thiết lập...';
        let headerText = 'STV Auto-Collect';
        let displayTime = '--:--';
        let labelText = 'Lần nhặt tiếp theo';
        let pageTitleText = '';

        const autoReloadTargetInput = document.getElementById('auto-reload-target');
        const autoReloadTarget = autoReloadTargetInput ? parseInt(autoReloadTargetInput.value) : treoMayTarget;
        const isTargetReached = treoMaySessionCount >= autoReloadTarget;

        if (autoReloadSessionDisplayHeader) {
            autoReloadSessionDisplayHeader.textContent = `Đã nhặt: ${treoMaySessionCount.toLocaleString()} / ${autoReloadTarget.toLocaleString()}`;
        }

        if (isErrorState) {
            const timeSinceError = now - (huntEndTime || now);
            const errorReloadInterval = randomFn(39000, 45000);
            const errorTimeLeft = errorReloadInterval - (timeSinceError % errorReloadInterval);
            if (document.getElementById('stv-error-popup')) {
                 updateErrorUI(errorTimeLeft);
            }
            return;
        }

        const format = (n) => String(n).padStart(2, '0');

        if (isTreoMayEnabled && isChapterReadingPage) {
             if (isTargetReached) {
                setLedStatus('gray');
                headerText = 'ĐÃ HOÀN THÀNH';
                statusMessage = 'Đã đạt mục tiêu. Treo Máy TẮT.';
                displayTime = 'DONE!';
                pageTitleText = '✅ ĐÃ XONG!';
             } else if (treoMayState === 'HUNTING') {
                const huntTimeLeftMs = huntEndTime - now;
                const totalSeconds = Math.max(0, Math.floor(huntTimeLeftMs / 1000));
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                displayTime = `${format(minutes)}:${format(seconds)}`;

                setLedStatus('red');
                headerText = 'AUTO ĐANG SĂN';
                statusMessage = 'Đang tìm kiếm nút...';
                labelText = 'Thời gian săn còn lại';
                pageTitleText = `⚔️ SĂN ${displayTime}`;
            } else if (treoMayState === 'RELOAD_DELAY') {
                const delayEndTime = huntEndTime;
                const delayTimeLeftMs = delayEndTime - now;
                const totalSeconds = Math.max(0, Math.floor(delayTimeLeftMs / 1000));
                displayTime = `CHỜ ${totalSeconds}s`;

                setLedStatus('yellow');
                headerText = 'CHUẨN BỊ RELOAD';
                statusMessage = 'Đang chờ trước khi tải lại trang...';
                labelText = 'Đếm ngược';
                pageTitleText = `⏱️ CHỜ ${totalSeconds}s`;
            } else {
                if (isCooldownOver) {
                    setLedStatus('green');
                    headerText = 'AUTO SẴN SÀNG';
                    statusMessage = 'Đã hết Cooldown. Chuẩn bị kích hoạt Reload!';
                    displayTime = 'RELOAD!';
                    labelText = 'Trạng thái';
                    pageTitleText = '🔄 RELOAD!';
                } else {
                    const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    displayTime = `${format(minutes)}:${format(seconds)}`;

                    setLedStatus('gray');
                    headerText = 'AUTO ĐANG CHỜ';
                    statusMessage = 'Đang hồi chiêu (Chờ Treo Máy)';
                    labelText = 'Lần nhặt tiếp theo';
                    pageTitleText = `⏳ ${displayTime}`;
                }
            }
        } else if (isTreoMayEnabled && !isChapterReadingPage) {
            setLedStatus('yellow');
            headerText = 'TREO MÁY TẠM DỪNG';
            statusMessage = 'Vui lòng vào trang đọc truyện!';
            displayTime = 'TẠM DỪNG';
            labelText = 'Trạng thái';
            pageTitleText = '⏸️ TẠM DỪNG';
        } else {
            labelText = 'Lần nhặt tiếp theo';
            if (isCooldownOver) {
                setLedStatus('green');
                headerText = 'AUTO SẴN SÀNG';
                statusMessage = 'Sẵn sàng nhặt khi nút xuất hiện.';
                displayTime = 'SẴN SÀNG!';
                pageTitleText = '✅ SẴN SÀNG!';
            } else {
                const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                displayTime = `${format(minutes)}:${format(seconds)}`;

                setLedStatus('gray');
                headerText = 'AUTO ĐANG CHỜ';
                statusMessage = 'Đã nhặt (CHƯA SẴN SÀNG)';
                pageTitleText = `⏳ ${displayTime}`;
            }
        }

        if(popup) {
            popup.className = (currentTheme === 'light' ? 'light-theme ' : '') +
                              (isMinimized ? 'minimized ' : '') +
                              (isPanelHidden ? 'panel-hidden ' : '') +
                              (`status-${ledStatusClass}`);

            if (mainHeaderText) mainHeaderText.textContent = headerText;
            if (collectStatus) collectStatus.textContent = statusMessage;
            if (cooldownDisplay) cooldownDisplay.textContent = displayTime;
            if (cooldownLabelText) cooldownLabelText.textContent = labelText;
            if (led) led.className = ledStatusClass;
        }

        if (toggleButton) {
            toggleButton.classList.toggle('panel-visible', isPanelHidden);
        }

        if (!isMinimized && !isPanelHidden) {
             setPageTitle(pageTitleText);
        }
    }

    function parseDrugItem(itemName, levelText) {
        itemName = itemName.toLowerCase().trim();
        let level = 0;
        let qualityName = '';
        let drugTypeKey = null;

        for (const quality in CUSTOM_QUALITY_TO_LEVEL_MAP) {
            if (itemName.startsWith(quality)) {
                qualityName = quality;
                level = CUSTOM_QUALITY_TO_LEVEL_MAP[quality];
                break;
            }
        }

        const nameWithoutQuality = itemName.replace(qualityName, '').trim();
        for (const drugName in DRUG_TYPE_MAPPING) {
            if (nameWithoutQuality.includes(drugName)) {
                 drugTypeKey = DRUG_TYPE_MAPPING[drugName];
                 break;
            }
        }

        if (level === 0) {
             const levelMatch = levelText.match(/(\d+)/);
             level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
             if (!drugTypeKey && itemName.includes("đan")) {
                 drugTypeKey = 'UnknownDanDuoc';
             }
        }

        return {
            level: level,
            qualityName: CUSTOM_LEVEL_TO_QUALITY_MAP[level] || null,
            drugTypeKey: drugTypeKey
        };
    }

    function cleanRawLevel(rawLevel) {
        if (!rawLevel || typeof rawLevel !== 'string') return rawLevel || 'N/A';
        let cleaned = rawLevel.trim().replace(/^(Cấp|Level|Câp):\s*/i, '').trim();
        const numberMatch = cleaned.match(/^\d+/);
        if (numberMatch) {
            return numberMatch[0];
        }
        return cleaned || 'N/A';
    }

    // Helper for Daily Stats Update
    function updateDailyStats(itemType, drugData) {
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (!dailyStats[todayKey]) {
            dailyStats[todayKey] = {
                counts: { ...initialItemCounts },
                drugs: {}
            };
            for (const key of Object.values(DRUG_TYPE_MAPPING)) { dailyStats[todayKey].drugs[key] = {}; }
        }

        // Update counts
        if (itemType && itemType !== 'DanDuoc') {
            if (dailyStats[todayKey].counts.hasOwnProperty(itemType)) {
                dailyStats[todayKey].counts[itemType] += 1;
            } else {
                dailyStats[todayKey].counts[itemType] = 1;
            }
        }

        // Update drugs
        if (itemType === 'DanDuoc' && drugData) {
            if (DETAILED_DRUG_LEVELS.includes(drugData.level) && drugData.drugTypeKey) {
                const levelStr = drugData.level.toString();
                const drugKey = drugData.drugTypeKey;

                if (!dailyStats[todayKey].drugs[drugKey]) dailyStats[todayKey].drugs[drugKey] = {};
                if (!dailyStats[todayKey].drugs[drugKey][levelStr]) dailyStats[todayKey].drugs[drugKey][levelStr] = { count: 0 };

                dailyStats[todayKey].drugs[drugKey][levelStr].count += 1;
            }
        }

        // Prune old days (Keep today and yesterday)
        const dateKeys = Object.keys(dailyStats).sort().reverse();
        if (dateKeys.length > MAX_HISTORY_DAYS) {
            for (let i = MAX_HISTORY_DAYS; i < dateKeys.length; i++) {
                delete dailyStats[dateKeys[i]];
            }
        }

        localStorage.setItem(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));
    }


    function incrementCollectCount(item) {
        collectCount += 1;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.message;
        const nameElement = tempDiv.querySelector('b[style*="color:red"]');
        const name = nameElement ? nameElement.textContent.trim() : item.name || 'Vật phẩm ẩn danh';

        const itemType = classifyItem(name);
        let rawLevelDisplay = item.level || 'N/A';
        let cleanedLevel = cleanRawLevel(rawLevelDisplay);
        let finalLevelDisplay = `Cấp: ${cleanedLevel}`;
        let drugData = null;

        if (itemType === 'DanDuoc') {
            drugData = parseDrugItem(name, rawLevelDisplay);
            if (DETAILED_DRUG_LEVELS.includes(drugData.level) && drugData.drugTypeKey) {
                const levelStr = drugData.level.toString();
                const drugKey = drugData.drugTypeKey;

                if (!drugDetails[drugKey]) drugDetails[drugKey] = {};
                if (!drugDetails[drugKey][levelStr]) drugDetails[drugKey][levelStr] = { count: 0 };

                drugDetails[drugKey][levelStr].count += 1;
                localStorage.setItem(STORAGE_KEY_DRUG_DETAILS, JSON.stringify(drugDetails));

                const qualityText = drugData.qualityName ? `(Phẩm chất: ${drugData.qualityName})` : '';
                finalLevelDisplay = `Cấp: ${drugData.level} ${qualityText}`;
            } else {
                 finalLevelDisplay = `Cấp: ${cleanedLevel}`;
            }
        }
        else {
             finalLevelDisplay = `Cấp: ${cleanedLevel}`;
        }

        if (itemType && itemType !== 'DanDuoc') {
             if (itemCounts.hasOwnProperty(itemType)) {
                 itemCounts[itemType] += 1;
             } else {
                 itemCounts[itemType] = 1;
             }
        }
        localStorage.setItem(STORAGE_KEY_ITEM_COUNTS, JSON.stringify(itemCounts));

        // Update Daily Stats (New v1.6)
        updateDailyStats(itemType, drugData);

        lastCollectedItem = {
            name: name,
            level: finalLevelDisplay,
            info: item.info || 'N/A'
        };

        localStorage.setItem(STORAGE_KEY_COUNT, collectCount);
        localStorage.setItem(STORAGE_KEY_LAST_ITEM, JSON.stringify(lastCollectedItem));

        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;
        const logEntry = { time: timeString, name: name };
        if (!historyData[todayKey]) {
            historyData[todayKey] = [];
        }
        historyData[todayKey].unshift(logEntry);
        if (historyData[todayKey].length > MAX_HISTORY_PER_DAY) {
            historyData[todayKey].pop();
        }
        const dateKeys = Object.keys(historyData).sort().reverse();
        if (dateKeys.length > MAX_HISTORY_DAYS) {
            for (let i = MAX_HISTORY_DAYS; i < dateKeys.length; i++) {
                delete historyData[dateKeys[i]];
            }
        }
        localStorage.setItem(STORAGE_KEY_HISTORY_LOG_V2, JSON.stringify(historyData));

        if (isTreoMayEnabled) {
            treoMaySessionCount += 1;
            treoMayState = 'COOLDOWN';
            localStorage.setItem(STORAGE_KEY_TREO_MAY_SESSION_COUNT, treoMaySessionCount);
            localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'COOLDOWN');
        }

        updateDynamicUI();
        renderHistoryLog();
        updateStaticUI();
    }

    function startNewCooldown(forceStart = false) {
        let cooldownDuration = 0;

        if (currentPreset === '10m') {
            const min = 8 * 60 * 1000;
            const max = 10 * 60 * 1000;
            const range = max - min;
            const weightedRandom = Math.pow(Math.random(), 2);
            cooldownDuration = min + Math.floor(weightedRandom * (range + 1));

        } else if (currentPreset === '1m45s') {
            const min = 30 * 1000;
            const max = (1 * 60 + 45) * 1000;
            const range = max - min;
            const weightedRandom = (Math.random() + Math.random()) / 2;
            cooldownDuration = min + Math.floor(weightedRandom * (range + 1));
        } else {
            cooldownDuration = COOLDOWN_PRESETS['1m45s'];
        }

        if (!cooldownDuration) return;

        if (forceStart || Date.now() >= cooldownEndTime) {
            cooldownEndTime = Date.now() + cooldownDuration;
            localStorage.setItem(STORAGE_KEY_COOLDOWN_END, cooldownEndTime);

            if (isTreoMayEnabled) {
                treoMayState = 'COOLDOWN';
                localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'COOLDOWN');
            }
            updateDynamicUI();
        }
    }

    function classifyItem(itemName) {
        if (!itemName) return null;
        itemName = itemName.toLowerCase().trim();
        if (itemName.includes("đan") || itemName.includes("dược")) return "DanDuoc";
        if (itemName.includes("công pháp") || itemName.includes("cẩm nang")) return "CongPhap";
        if (itemName.includes("linh thạch") || itemName.includes("đá linh")) return "LinhThach";
        if (itemName.includes("lệnh bài uy vọng")) return "LenhBaiUyVong";
        if (itemName.includes("vũ kỹ") || itemName.includes("võ kỹ") || itemName.includes("pháp") || itemName.includes("thuật") || itemName.includes("bí kíp")) return "VoKy";
        return null;
    }

    var collectFn = function () {
        return new Promise((resolve, reject) => {
            let itemInfo = { name: "...", info: "", level: "", message: "Đang nhặt...", type: 3 };
            try {
                var params = "ngmar=collect&ajax=collect";
                var http = new XMLHttpRequest();
                var url = '/index.php';
                http.open('POST', url, true);

                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');

                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        try {
                            itemInfo = JSON.parse(http.responseText);
                            if (window.g) {
                                window.g("cInfo").innerHTML = itemInfo.info;
                                window.g("cName").innerHTML = itemInfo.name;
                                window.g("cLevel").innerHTML = itemInfo.level;
                            }
                            itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin:  ${itemInfo.info}`
                            resolve(itemInfo);
                            cType = itemInfo.type;
                            if (cType == 3 || cType == 4 && window.g) {
                                window.g("cInfo").contentEditable = true;
                                window.g("cInfo").style.border = "1px solid black";
                                window.g("cName").contentEditable = true;
                                window.g("cName").style.border = "1px solid black";
                                window.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
                            }
                        }
                        catch (f) {
                            window.console.error("Lỗi phân tích JSON từ phản hồi collect:", http.responseText);
                            itemInfo.error = http.responseText;
                            resolve(itemInfo);
                        }
                    }
                }
                http.send(params);
            } catch (err) {
                window.console.error(err);
                itemInfo.error = err;
                resolve(itemInfo);
            }
        });
    };

    var submitFn = function (item) {
        return new Promise((resolve, reject) => {
            if (!window.ui || !window.ui.alert || !window.ui.notif) {
                window.console.error("STVAuto Error: window.ui chưa sẵn sàng. Bỏ qua submit.");
                isCollecting = false;
                count = 0;
                resolve("Thư viện UI chưa sẵn sàng");
                return;
            }

            try {
                var params = "ajax=fcollect&c=137";
                if (cType == 3 || cType == 4) {
                    var nname = window.g && window.g("cName") ? window.g("cName").innerText : "";
                    if (nname.length > 80) {
                        window.ui.alert("Tên công pháp/vũ kỹ quá dài.");
                        return;
                    }
                    var ninfo = window.g && window.g("cInfo") ? window.g("cInfo").innerText : "";
                    params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(ninfo);
                }
                var http = new XMLHttpRequest();
                var url = '/index.php';
                http.open('POST', url, true);

                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');

                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        try {
                            var x = JSON.parse(http.responseText);
                            if (x.code == 1) {
                                incrementCollectCount(item);
                                startNewCooldown(true);
                                window.ui.notif("Thành công");
                            } else {
                                if (x.err && x.err.includes("không nhặt được gì")) {
                                    window.ui.alert("Thật đáng tiếc, kỳ ngộ đã không cánh mà bay, có duyên gặp lại ah.");
                                } else if (x.err) {
                                    window.ui.alert(x.err);
 } else {
                                    window.ui.alert("Lỗi không xác định khi hoàn thành nhặt bảo.");
                                }
                            }
                            resolve("Nhặt bảo thành công");
                        }
                        catch (e) {
                            window.console.error("Nhặt bảo thất bại(ex2)", e);
                            resolve(http.responseText);
                        }
                    }
                }
                http.send(params);
            } catch (err) {
                window.console.error(err);
                resolve("Nhặt bảo thất bại(ex1)");
            } finally {
                if(collectIntervalHandle) {
                    clearInterval(collectIntervalHandle);
                    collectIntervalHandle = null;
                }

                isCollecting = false;
                count = 0;

                if (uiMounted && elPopup && !isPanelHidden && !isMinimized) {
                    updateDynamicUI();
                }
            }
        });
    };

    var randomFn = function (min, max) {
        min = min || 1000;
        max = max || 10000;
        return Math.floor((Math.random()) * (max - min + 1)) + min;
    };
    var randomTimeoutFn = function (time, action) {
        time = time || randomFn();
        window.console.log("STVAuto delay start in ", time, "ms");
        var handle = setTimeout(() => {
            action();
            clearTimeout(handle);
            window.console.log("STVAuto delay end in ", time, "ms");
        }, time);
    };
    function sleep(time) {
        time = time || randomFn(500, 3000);
        window.console.log("STVAuto sleep in ", time, "ms");
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    function isCloudflareErrorPage() {
        const title = document.title;
        return title.includes("Error 520") ||
               title.includes("Error 502") ||
               title.includes("Bad gateway") ||
               title.includes("Web server is returning an unknown error");
    }

    function handleTreoMayState(now) {
        if (isCollecting) {
            return;
        }

        const isChapterReadingPage = READING_PAGE_REGEX.test(window.location.pathname);
        const isCooldownOver = cooldownEndTime <= now;
        const isTargetReached = treoMaySessionCount >= treoMayTarget;

        if (isCloudflareErrorPage()) {
            if (!isErrorState) {
                isErrorState = true;
                localStorage.setItem(STORAGE_KEY_TREO_MAY_ERROR_STATE, 'true');
                huntEndTime = now;
                localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, now);
                window.console.error("STVAuto Error: Phát hiện lỗi Cloudflare 502/520. Chuyển sang chế độ khôi phục.");
                createErrorUI("Phát hiện lỗi Server (502/520). Đang chờ 40s để tải lại.");
            }
            const errorReloadInterval = randomFn(39000, 45000);
            const timeSinceError = now - huntEndTime;
            if (timeSinceError >= errorReloadInterval) {
                window.console.log("STVAuto Error: Hết 40s khôi phục. Tải lại trang...");
                localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, now);
                window.location.reload();
            } else {
                 updateErrorUI(errorReloadInterval - (timeSinceError % errorReloadInterval));
            }
            return;
        } else {
            if (isErrorState) {
                isErrorState = false;
                localStorage.setItem(STORAGE_KEY_TREO_MAY_ERROR_STATE, 'false');
                removeErrorUI();
                window.location.reload();
                return;
            }
        }

        if (!isTreoMayEnabled || !isChapterReadingPage || isTargetReached) {
            if (isTreoMayEnabled && isTargetReached) {
                isTreoMayEnabled = false;
                localStorage.setItem(STORAGE_KEY_TREO_MAY_TOGGLE, 'false');
                setPageTitle('✅ ĐÃ XONG!');
                alert(`Đã đạt mục tiêu nhặt ${treoMayTarget.toLocaleString()} lần. Treo Máy đã tự động tắt.`);
            }
            return;
        }

        switch (treoMayState) {
            case 'COOLDOWN':
                if (isCooldownOver) {
                    treoMayState = 'RELOAD_DELAY';
                    huntEndTime = now + randomFn(2500, 4000);
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'RELOAD_DELAY');
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, huntEndTime);
                    window.console.log("STVAuto Treo May: Cooldown xong. Bắt đầu chờ reload.");
                }
                break;

            case 'RELOAD_DELAY':
                if (now >= huntEndTime) {
                    window.console.log("STVAuto Treo May: Hết thời gian chờ. Tải lại trang để săn nút.");
                    treoMayState = 'HUNTING';
                    huntEndTime = now + randomFn(33000, 38000);
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'HUNTING');
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, huntEndTime);
                    window.location.reload();
                    return;
                }
                break;

            case 'HUNTING':
                if (now >= huntEndTime) {
                    window.console.log("STVAuto Treo May: Hết thời gian săn nút. Lặp lại chu kỳ tải lại.");
                    treoMayState = 'RELOAD_DELAY';
                    huntEndTime = now + randomFn(2500, 4000);
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_STATE, 'RELOAD_DELAY');
                    localStorage.setItem(STORAGE_KEY_TREO_MAY_HUNT_END, huntEndTime);
                }
                break;
        }
    }


    (function mainLoop() {
        const now = Date.now();
        let nextInterval = 900 + Math.random() * 200;

        try {
            if (!uiMounted && window.ui && window.jQuery) {
                window.console.log("STVAuto: Đã phát hiện window.ui & window.jQuery. Bắt đầu khởi tạo UI (v1.6)...");
                injectGlobalUIStyles();
                createTimerUI();
            }

            if (isScriptEnabled) {
                if (isTreoMayEnabled) {
                    handleTreoMayState(now);
                    if (isErrorState) {
                    }
                }

                if (!isErrorState) {
                    const isChapterReadingPage = READING_PAGE_REGEX.test(window.location.pathname);
                    let btn = document.querySelector('.contentbox .btn.btn-info[id]');

                    if (!window.ui || !window.jQuery) {
                        if (btn && isChapterReadingPage) {
                            window.console.warn("STVAuto Warning: Đã tìm thấy nút nhưng thư viện gốc chưa sẵn sàng. Đang chờ...");
                        }
                    } else {
                        if (btn && isChapterReadingPage && !isCollecting) {
                            count++;
                            if(window.ui && window.ui.notif) {
                                window.ui.notif(`[AUTO-COLLECT] Phát hiện bảo vật (${count}) - Kích hoạt (trễ ngẫu nhiên).`);
                            }
                            window.console.log("STVAuto: Phát hiện bảo vật. Kích hoạt (trễ ngẫu nhiên).", count);

                            if (count == 1) {
                                isCollecting = true;

                                let failSafeSeconds = randomFn(18, 22);
                                console.log(`[STV-FailSafe] Kích hoạt bộ đếm: ${failSafeSeconds}s`);

                                const updateFailSafeUI = (secs) => {
                                     if(elCooldownDisplay) elCooldownDisplay.textContent = `TIMEOUT: ${secs}s`;
                                     if(elCollectStatus) elCollectStatus.textContent = "Đang chờ Server phản hồi...";

                                     const led = document.getElementById('led-indicator');
                                     if(led) led.className = 'led-yellow';
                                     if(elPopup) elPopup.className = (currentTheme === 'light' ? 'light-theme ' : '') + `status-led-yellow`;
                                     if(elMainHeaderText) elMainHeaderText.textContent = '...ĐANG NHẶT...';
                                     setPageTitle('...ĐANG NHẶT...');
                                };

                                updateFailSafeUI(failSafeSeconds);

                                collectIntervalHandle = setInterval(() => {
                                    failSafeSeconds--;
                                    updateFailSafeUI(failSafeSeconds);

                                    if (failSafeSeconds <= 0) {
                                        clearInterval(collectIntervalHandle);
                                        console.warn("[STV-FailSafe] Quá trình nhặt quá lâu! Đang tải lại trang...");
                                        window.location.reload();
                                    }
                                }, 1000);


                                if (isTreoMayEnabled && treoMayState === 'HUNTING') {
                                    startNewCooldown(true);
                                }

                                waitTime = randomFn();
                                randomTimeoutFn(waitTime, () => {
                                    collectFn().then(async (item) => {
                                        let format = `color:red;font-size:16px;font-weigth:bold;`;
                                        console.log("STVAuto: ------------------------");
                                        window.console.log("STVAuto: Tìm thấy " + item.name);
                                        console.log(`%c${item.name}, Level: ${item.level}, Thông tin: ${item.info}`, format);

                                        await sleep();
                                        await submitFn(item).then((resolve, reject) => {
                                            let showTime = 10;
                                            let notiCountHandle = setInterval(() => {
                                                showTime--;
                                                if(window.ui && window.ui.notif) {
                                                    window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây<a></b>`);
                                                }
                                                if (showTime <= 1) {
                                                    clearInterval(notiCountHandle);
                                                }
                                            }, 1000);
                                            window.console.log("STVAuto: " + resolve + item.name);
                                        });
                                        console.log("STVAuto: ------------------------");
                                    });

                                    if(window.jQuery) {
                                        const buttonToRemove = window.jQuery(btn);
                                        if (buttonToRemove && buttonToRemove.length > 0) {
                                            buttonToRemove.remove();
                                        }
                                    }
                                });
                            }
                        }
                        else if (btn && isChapterReadingPage && isCollecting) {
                            if (count == 0) count = 1;
                        }
                        else {
                            count = 0;
                        }
                    }
                }
            }

            if (uiMounted && elPopup && !isPanelHidden) {
                updateDynamicUI();
            }

        } catch (err) {
            console.error("STVAuto LỖI VÒNG LẶP CHÍNH:", err);
        } finally {
            setTimeout(mainLoop, nextInterval);
        }
    })();

})();