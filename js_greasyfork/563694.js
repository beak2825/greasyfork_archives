// ==UserScript==
// @name         Finviz Fullscreen Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A professional, fullscreen dashboard with reliable Card Scaling, Compact Single-Line Layout, and Fixed News Scoring using Table Data.
// @author       Game Abuse Studios
// @license      MIT
// @match        https://finviz.com/screener.ashx*
// @match        https://elite.finviz.com/screener.ashx*
// @icon         https://finviz.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @resource     fontAwesomeCSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/563694/Finviz%20Fullscreen%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/563694/Finviz%20Fullscreen%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    // --- 1. SCRIPT INITIALIZATION & STATE ---
    let isScriptActive = true;
    let selectedTicker = null;
    let lastCalculatedCandidates = [];
    let currentScanOrder = [];
    let sortState = { column: 'totalScore', direction: 'desc' };
    let isManuallySelected = false;

    let commentHistory = {};
    let stockDataHistory = {};
    let haltTracking = {};
    let highOfDayData = {};
    let quotePageCache = {};

    let lastDisqualifiedResetHour = -1;
    let lastWipeHour = -1;
    let updateDebounce = null;
    let haltObserver = null;

    // --- CUSTOM SCORE RECIPES ---
    const CUSTOM_RECIPES = {
        'buzz': {
            name: 'Buzz',
            desc: 'News + Comments',
            weights: { news: 1.0, comment: 1.0 }
        },
        'squeeze': {
            name: 'Squeeze',
            desc: 'Short % + Low Float',
            weights: { shortFloat: 2.0, lowFloat: 1.0 }
        },
        'velocity': {
            name: 'Velocity',
            desc: 'RelVol + Momentum',
            weights: { relVolChange: 1.5, momentum: 1.0 }
        }
    };
    // --- STORAGE KEYS ---
    const SETTINGS_KEY = 'fvDashboardSettings_v50_46'; // Increment for new defaults
    const CHART_UI_STATE_KEY = 'fvChartUIState_v1';
    const LAYOUT_STATE_KEY = 'fvDashboardLayoutState_v1';
    const DASHBOARD_STATE_KEY = 'fvDashboardState_v1';
    const VIEWS_STATE_KEY = 'fvDashboardViews_v1';
    const HALT_DATA_KEY = 'fvDashboardHaltTracking_v1';
    const SCALE_KEY = 'fvDashboardCardScale_v1';
    const CUSTOM_MODE_KEY = 'fvDashboardCustomMode_v1';
    // --- CONSTANTS FOR NEWS PARSING ---
    const MONTH_MAP = { 'Jan':0, 'Feb':1, 'Mar':2, 'Apr':3, 'May':4, 'Jun':5, 'Jul':6, 'Aug':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Dec':11 };

    // ===================================================================================
    // --- 2. VIEW MANAGER ---
    // ===================================================================================
    const viewManager = {
        views: {},
        activeViewId: 'screener',

        init() {
            const savedState = JSON.parse(GM_getValue(VIEWS_STATE_KEY, '{}'));
            this.views = { screener: { id: 'screener', type: 'screener', title: 'Dashboard' } };
            this.renderTabs();
            if (savedState.views) {
                for (const view of Object.values(savedState.views)) {
                    if (view.type === 'broker' && view.ticker !== 'HALT-MONITOR') {
                        this.openView(view.ticker, view.url, false);
                    }
                }
            }
            this.switchView(savedState.activeViewId || 'screener');
        },

        saveState() {
            const stateToSave = {
                views: this.views,
                activeViewId: this.activeViewId,
            };
            GM_setValue(VIEWS_STATE_KEY, JSON.stringify(stateToSave));
        },

        openView(ticker, url, setActive = true) {
            const isHaltMonitor = ticker === 'HALT-MONITOR';
            const existingView = Object.values(this.views).find(v => v.ticker === ticker && v.type === 'broker');
            if (existingView) {
                if (setActive) this.switchView(existingView.id);
                return;
            }

            const viewId = isHaltMonitor ? 'halt-monitor' : `view-${Date.now()}`;
            this.views[viewId] = { id: viewId, type: 'broker', ticker: ticker, url: url, title: ticker };
            const dashboardBody = document.getElementById('fv-dashboard-body');
            const viewPane = document.createElement('div');
            viewPane.id = viewId;
            viewPane.className = 'fv-view-pane';

            let extraHtml = '';
            if (isHaltMonitor) {
                extraHtml = `<div id="fv-halt-monitor-status" style="position:absolute; top:10px; right:20px; z-index:100; background:var(--bg-header); padding:5px 10px; border:1px solid var(--border-color); border-radius:4px; font-weight:bold; color:var(--text-secondary); pointer-events:none;">Initializing...</div>`;
            }

            viewPane.innerHTML = extraHtml + `<iframe class="fv-broker-iframe" src="${url}" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`;
            dashboardBody.appendChild(viewPane);

            if (isHaltMonitor) {
                const iframe = viewPane.querySelector('iframe');
                iframe.onload = () => {
                    initHaltObserver(iframe);
                };
            }

            this.renderTabs();
            if (setActive) {
                this.switchView(viewId);
            } else {
                this.saveState();
            }
        },

        switchView(viewId) {
            if (!this.views[viewId]) return;
            this.activeViewId = viewId;

            document.querySelectorAll('.fv-view-pane').forEach(pane => pane.classList.remove('is-active'));
            const paneToActivate = document.getElementById(viewId);
            if (paneToActivate) {
                paneToActivate.classList.add('is-active');
            }

            if (viewId === 'screener') {
                updateDisplay({ candidates: lastCalculatedCandidates });
            }

            this.renderTabs();
            this.saveState();
        },

        closeView(viewId) {
            if (viewId === 'screener' || !this.views[viewId]) return;
            const viewPane = document.getElementById(viewId);
            if (viewPane) viewPane.remove();
            delete this.views[viewId];

            if (viewId === 'halt-monitor' && haltObserver) {
                haltObserver.disconnect();
                haltObserver = null;
            }

            if (this.activeViewId === viewId) {
                this.switchView('screener');
            } else {
                this.renderTabs();
                this.saveState();
            }
        },

        renderTabs() {
            const tabsContainer = document.getElementById('fv-view-tabs');
            if (!tabsContainer) return;

            tabsContainer.innerHTML = Object.values(this.views).map(view => {
                const isActive = view.id === this.activeViewId;
                const closeButton = view.type === 'broker' ? `<span class="close-tab-btn" title="Close Tab">&times;</span>` : '';
                const iconClass = view.ticker === 'HALT-MONITOR' ? 'fa-shield-halved' : (view.type === 'broker' ? 'fa-arrow-up-right-from-square' : 'fa-table-columns');

                return `
                   <div class="fv-view-tab ${isActive ? 'is-active' : ''}" data-view-id="${view.id}">
                        <i class="fa-solid ${iconClass}"></i>
                        <span>${view.title}</span>
                        ${closeButton}
                   </div>
                `;
            }).join('');
        }
    };

    // ===================================================================================
    // --- 2.5 UI COMPONENTS & TEMPLATES ---
    // ===================================================================================
    const UI_COMPONENTS = {
        mainDashboardHTML: `
            <div id="fv-dashboard-header">
                <div class="fv-header-left">
                    <label class="fv-toggle-switch"><input type="checkbox" id="fv-script-toggle" checked><span class="fv-slider"></span></label>
                    <div id="fv-main-status"><span class="fv-status-dot"></span><span id="fv-status-text"></span></div>
                     <div class="fv-scale-control" title="Card Zoom Level">
                        <i class="fa-solid fa-magnifying-glass" style="font-size:12px; color:var(--text-secondary);"></i>
                        <input type="range" id="fv-card-scale-input" min="0.5" max="1.5" step="0.1" value="1">
                     </div>
                </div>
                <h2>Finviz Velocity Dashboard</h2>
                <div class="fv-header-right">
                    <div id="fv-settings-btn" class="fv-icon-btn" title="Open Settings"><i class="fa-solid fa-gear"></i></div>
                    <button id="fv-close-dashboard-btn" class="fv-icon-btn" title="Close Dashboard"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
            <div id="fv-view-tabs"></div>
            <div id="fv-dashboard-body">
                 <div id="screener" class="fv-view-pane is-active">
                      <div id="fv-main-content">
                             <div id="fv-controls-toolbar">
                                <div id="fv-sort-controls"></div>
                                <div id="fv-score-toggles-container"></div>
                             </div>

                             <div id="fv-card-container"></div>
                             <div id="fv-chart-showcase">
                                   <div id="fv-chart-resize-handle"></div>
                                   <div id="fv-chart-showcase-header">
                                         <div id="fv-toggle-chart-visibility" class="fv-icon-btn" title="Toggle Chart Visibility">
                                               <i class="fa-solid fa-chevron-up"></i>
                                         </div>
                                   </div>
                                   <div id="fv-details-chart-container">
                                       <div id="fv-details-chart"></div>
                                   </div>
                             </div>
                      </div>
                       <div id="fv-vertical-resize-handle"></div>
                       <div id="fv-details-pane">
                             <div id="fv-details-header">
                                   <h3 id="fv-details-ticker">Select a Ticker</h3>
                                   <div id="fv-details-actions">
                                       <a id="fv-robinhood-btn" href="#" class="fv-action-btn fv-hidden" title="Open on Robinhood">
                                             <svg viewBox="12 11 24 29" fill="currentColor" width="16" height="16"><g><path d="M26.9628 17.8828H21.3259C21.122 17.8828 20.9365 17.956 20.8067 18.1389L16.7645 23.0787C16.1712 23.8105 16.0228 24.4875 16.0228 25.4571V30.5067C14.7063 34.1475 13.8719 36.6174 13.26 38.8495C13.2044 38.9959 13.2786 39.069 13.4084 39.069H14.0203C14.1315 39.069 14.2242 39.0141 14.2799 38.9227C18.8969 27.3233 23.9219 21.5785 27.074 18.1389C27.2038 17.9926 27.1482 17.8828 26.9628 17.8828Z"></path><path d="M26.9301 12.4049C26.5826 12.5695 26.3998 12.6062 26.0341 12.9355C24.3884 14.3443 23.2913 15.4603 22.2491 16.5581C22.1211 16.6862 22.1759 16.8142 22.3588 16.8142H28.5209C29.0877 16.8142 29.4168 17.1436 29.4168 17.7107V24.6632C29.4168 24.8462 29.5631 24.9011 29.6728 24.7364L33.3848 19.888C33.988 19.1013 34.171 18.8634 34.3356 17.7656C34.555 16.1556 34.4269 13.6856 33.458 12.661C32.5985 11.7462 28.722 11.7097 26.9301 12.4049Z"></path><path d="M28.2108 19.2855C24.3556 23.5866 21.349 28.1092 18.5637 33.5549C18.4899 33.7025 18.5821 33.8133 18.7481 33.7579L24.5032 31.9858C25.1488 31.8197 25.5177 31.5243 25.8313 31.0074L28.3952 26.7801C28.4506 26.6694 28.469 26.5402 28.469 26.4479V19.3962C28.469 19.2116 28.3399 19.1378 28.2108 19.2855Z"></path></g></svg>
                                             <span>Robinhood</span>
                                         </a>
                                         <div id="fv-disqualify-btn" class="fv-action-btn fv-action-btn-neg fv-hidden" title="Disqualify Ticker">
                                              <i class="fa-solid fa-ban"></i>
                                              <span>Disqualify</span>
                                         </div>
                                   </div>
                             </div>
                              <div id="fv-details-tabs">
                                   <button class="fv-details-tab-btn" data-tab="news">News</button>
                                   <button class="fv-details-tab-btn" data-tab="comments">Comments</button>
                              </div>
                             <div id="fv-details-content">
                                    <div id="fv-details-news" class="fv-details-tab-pane"></div>
                                    <div id="fv-details-comments" class="fv-details-tab-pane"></div>
                             </div>
                       </div>
                  </div>
        </div>`,
        settingsPanelHTML: `
            <div class="fv-settings-header">
                <span>Dashboard Settings</span>
                <button class="fv-icon-btn fv-settings-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="fv-settings-body">
                 <div class="fv-settings-tabs"></div>
                <div class="fv-settings-content"></div>
            </div>
            <div class="fv-settings-footer">
                <button class="fv-settings-btn" id="fv-settings-reset-all">Reset All Defaults</button>
                <button class="fv-settings-btn" id="fv-settings-apply" style="margin-left: 10px; background-color: rgba(var(--color-primary-rgb), 0.1); border-color: var(--color-primary); color: var(--color-primary); font-weight: 700;">Apply Changes</button>
            </div>`,
        stylesCSS: `
            /* --- Professional Refactor: Font & Color Palette --- */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            :root {
                --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
                --shadow-md: 0 4px 12px rgba(0,0,0,0.4); --transition: all 0.25s cubic-bezier(.4,0,.2,1);

                --color-primary: #3498db;
                --color-primary-rgb: 52, 152, 219;
                --color-positive: #2ecc71; --color-negative: #e74c3c; --color-negative-rgb: 231, 76, 60;
                --color-warning: #f1c40f; --color-neutral: #95a5a6; --color-robinhood: #00C805;

                --bg-app: rgba(18, 20, 25, 0.95);
                --bg-header: rgba(28, 31, 38, 0.98);
                --bg-content: rgba(23, 26, 32, 0.9);
                --bg-card: rgba(35, 39, 46, 0.9);
                --bg-card-hover: rgba(42, 46, 54, 0.95);
                --bg-selected: rgba(var(--color-primary-rgb), 0.1);
                --bg-input: rgba(44, 48, 56, 0.8);

                --text-primary: #EAECEF; --text-secondary: #A6ACBE; --text-tertiary: #808B96;
                --border-color: rgba(80, 80, 90, 0.5);
                --border-color-light: rgba(80, 80, 90, 0.25);
                --border-color-focus: var(--color-primary);

                --score-color-comment: #e67e22; --score-color-relvol: #3498db; --score-color-price: #2ecc71;
                --score-color-ah: #9b59b6;
                --score-color-lowfloat: #f1c40f; --score-color-shortfloat: #e74c3c;
                --score-color-marketcap: #1abc9c;
                --score-color-momentum: #8e44ad;
                --score-color-news: #f1c40f;
                --score-color-custom: #ffffff;

                /* CARD SCALING VARIABLE - USER CONTROLLED */
                --card-scale: 1.0;
                /* BASE FONT SIZE FOR SCALING MATH (13px default) */
                --card-base-size: 13px;
            }

            /* --- Base & Scrollbar --- */
            #fv-fullscreen-container, #fv-fullscreen-container *, #fv-settings-panel, #fv-settings-panel * { box-sizing: border-box; font-family: var(--font-primary); font-size: 14px; line-height: 1.4; }
            #fv-fullscreen-container ::-webkit-scrollbar, #fv-settings-panel ::-webkit-scrollbar { width: 8px; height: 8px; }
            #fv-fullscreen-container ::-webkit-scrollbar-track, #fv-settings-panel ::-webkit-scrollbar-track { background: var(--bg-header); }
            #fv-fullscreen-container ::-webkit-scrollbar-thumb, #fv-settings-panel ::-webkit-scrollbar-thumb { background: var(--text-tertiary); border-radius: 10px; border: 2px solid var(--bg-header); }
            #fv-fullscreen-container ::-webkit-scrollbar-thumb:hover, #fv-settings-panel ::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }

            /* --- Dashboard Shell & Toggle --- */
            #fv-dashboard-toggle { position: fixed; bottom: 20px; right: 20px; z-index: 999998; width: 56px; height: 56px; border-radius: 50%; border: none; background-color: var(--color-primary); color: white; box-shadow: var(--shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, background-color 0.2s ease; }
            #fv-dashboard-toggle:hover { transform: scale(1.1); background-color: #2980b9; }
            #fv-dashboard-toggle .svg-inline--fa { font-size: 22px; }

            #fv-fullscreen-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; background: var(--bg-app); backdrop-filter: blur(12px) saturate(150%); color: var(--text-primary); display: flex; flex-direction: column; opacity: 0; pointer-events: none; transform: scale(1.02); transition: opacity 0.3s ease, transform 0.3s ease; }
            #fv-fullscreen-container.is-visible { opacity: 1; pointer-events: auto; transform: scale(1); }

            /* --- Dashboard Header --- */
            #fv-dashboard-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-bottom: 1px solid var(--border-color); background-color: var(--bg-header); flex-shrink: 0; }
            #fv-dashboard-header h2 { margin: 0; font-size: 18px; color: var(--text-primary); font-weight: 600; text-align: center; }
            .fv-header-left, .fv-header-right { display: flex; align-items: center; gap: 12px; flex: 1; }
            .fv-header-right { justify-content: flex-end; }
            .fv-icon-btn { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; display:flex; align-items:center; justify-content:center; padding: 6px; border-radius: var(--radius-sm); transition: var(--transition); width: 32px; height: 32px; }
            .fv-icon-btn .svg-inline--fa { font-size: 16px; }
            #fv-close-dashboard-btn .svg-inline--fa { font-size: 20px; }
            .fv-icon-btn:hover { color: var(--text-primary); background-color: rgba(255,255,255,0.08); }

            /* --- Scale Control --- */
            .fv-scale-control { display: flex; align-items: center; gap: 8px; margin-left: 15px; background: var(--bg-input); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-color); }
            #fv-card-scale-input { width: 80px; accent-color: var(--color-primary); cursor: pointer; }

            /* --- Status Indicator --- */
            #fv-main-status { display: flex; align-items: center; gap: 8px; font-size: 13px; background-color: var(--bg-content); padding: 5px 12px; border-radius: var(--radius-sm); color: var(--text-secondary); border: 1px solid var(--border-color); }
            .fv-status-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
            .fv-dot-idle { background-color: var(--color-neutral); }
            .fv-dot-error { background-color: var(--color-negative); }
            .fv-dot-active { background-color: var(--color-positive); box-shadow: 0 0 8px var(--color-positive); animation: fv-pulse 2s infinite; }
            .fv-dot-holding { background-color: var(--color-warning); }
            @keyframes fv-pulse { 0% { opacity: 1 } 50% { opacity: 0.6 } 100% { opacity: 1 } }

            /* --- Main Layout & Panes --- */
            #fv-dashboard-body { flex-grow: 1; overflow: hidden; position: relative; }
            #screener { display: flex; }
            #fv-main-content { position: relative; flex: 2; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

            /* --- FIXED PANE STYLING (LOCKED WIDTH) --- */
            #fv-details-pane {
                flex-basis: 450px; flex-shrink: 0; flex-grow: 0;
                width: 450px; /* Default */
                min-width: 450px; /* Lock */
                max-width: 450px; /* Lock */
                display: flex; flex-direction: column;
                background-color: var(--bg-header);
            }

            #fv-vertical-resize-handle { width: 2px; flex-shrink: 0; cursor: ew-resize; background-color: var(--border-color); transition: background-color 0.2s ease; }
            #fv-vertical-resize-handle:hover { background-color: var(--color-primary); }

            /* --- Controls Toolbar (Flex Container) --- */
            #fv-controls-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; background-color: var(--bg-header); gap: 15px; }
            #fv-sort-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
            .fv-control-group { display: flex; align-items: center; gap: 8px; }
            .fv-control-group label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
            .fv-control-group select, .fv-control-group button { background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); padding: 5px 10px; font-size: 13px; }

            /* --- Score Toggles (COMPACT & CLEAN) --- */
            #fv-score-toggles-container { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; justify-content: flex-end; }
            .fv-score-toggle-btn { background-color: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 3px 10px; /* SMALLER PADDING */ border-radius: 100px; font-size: 10px; /* SMALLER FONT */ font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 4px; user-select: none; opacity: 0.8; }
            .fv-score-toggle-btn:hover { opacity: 1; border-color: var(--text-primary); color: var(--text-primary); }
            .fv-score-toggle-btn.is-active { background-color: transparent; border: 1px solid var(--btn-color); color: #ffffff; opacity: 1; box-shadow: none; }

            /* --- Card Grid (SMART SCALING) --- */
            #fv-card-container {
                flex-grow: 1; padding: 16px; overflow-y: auto; display: grid;
                /* Column width is calculated using EM units relative to the scaled base size */
                grid-template-columns: repeat(auto-fill, minmax(calc(22em * var(--card-scale)), 1fr));
                gap: 16px; align-content: flex-start; background-color: var(--bg-content);
            }
            .fv-message-cell { text-align: center !important; color: var(--text-secondary); padding: 40px; font-size: 14px; grid-column: 1 / -1; }

            /* --- Card Styles (SMART SCALING) --- */
            .fv-ticker-card {
                /* FORCE MINIMUM FONT SIZE TO PREVENT OVERFLOW */
                /* 1. Calculate ideal size based on zoom. 2. Clamp it to >= 10px to ensure browser renders it */
                font-size: max(11px, calc(var(--card-base-size) * var(--card-scale)));
                background-color: var(--bg-card); border: 1px solid var(--border-color);
                border-radius: 0.75em; /* relative radius */
                padding: 0.5em; /* relative padding */
                cursor: pointer; transition: var(--transition);
                position: relative; display: flex; flex-direction: column; gap: 0.5em; /* relative gap */
                /* Height auto allows it to shrink tight to content */
                height: auto; flex-shrink: 0;
            }
            .fv-ticker-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); background-color: var(--bg-card-hover); border-color: var(--border-color-focus); }
            .fv-ticker-card.selected { border-color: var(--border-color-focus); background-color: var(--bg-selected); box-shadow: 0 0 0 1px var(--color-primary); }

            /* COMPACT HEADER LAYOUT */
            .card-header {
                display: grid; grid-template-columns: auto 1fr auto; align-items: center;
                gap: 0.5em; border-bottom: 1px solid var(--border-color-light); padding-bottom: 0.5em; margin-bottom: 0.2em;
            }
            .card-rank { font-size: 0.85em; background: rgba(255,255,255,0.1); padding: 0.2em 0.5em; border-radius: 4px; color: var(--text-tertiary); }
            .card-ticker { font-size: 1.6em; font-weight: 800; color: var(--text-primary); line-height: 1; }
            .card-price-block { text-align: right; }
            .card-price { font-size: 1.2em; font-weight: 600; display: block; line-height: 1; }
            .card-total-score-mini { font-size: 0.85em; color: var(--text-secondary); font-weight: 500; margin-top: 2px;}
            .card-total-score-mini strong { color: var(--text-primary); font-weight: 800; font-size: 1.1em; }

            /* COMPACT GRID */
            .card-score-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4em; flex-grow: 1; }
            .score-item { background-color: var(--bg-content); border-radius: 0.4em; padding: 0.4em 0.6em; display: flex; flex-direction: column; justify-content: center; border: 1px solid rgba(255,255,255,0.03); }
            .score-item label { font-size: 0.75em; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; margin-bottom: 0.1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
            /* Hover hint for clickable label */
            .score-custom label:hover { color: #fff; text-decoration: underline; }

            .score-item-row { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5em; }
            .score-item .score-value { font-size: 1.2em; font-weight: 700; line-height: 1; white-space: nowrap; }
            .score-item .score-raw-value { font-size: 0.8em; color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

            /* COMPACT FOOTER */
            .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.85em; color: var(--text-secondary); border-top: 1px solid var(--border-color-light); padding-top: 0.6em; margin-top: 0.2em; }
            .card-info-item { display: flex; align-items: center; gap: 0.4em; white-space: nowrap; }
            .card-info-item i { font-size: 0.9em; opacity: 0.7; }

            /* Halted State Styles */
            .fv-ticker-card.is-halted { border: 2px solid var(--color-negative) !important; }
            .fv-ticker-card.is-halted .card-score-grid,
            .fv-ticker-card.is-halted .card-footer,
            .fv-ticker-card.is-halted .card-header { opacity: 0.3; filter: grayscale(100%); }
            .fv-halt-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; display: flex; align-items: center; justify-content: center; }

            /* --- SHARP SVG WATERMARK (SKEWED) --- */
            .fv-halt-overlay::before {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0 L100 100 M100 0 L0 100' stroke='rgba(255, 50, 50, 0.25)' stroke-width='15' vector-effect='non-scaling-stroke' /%3E%3C/svg%3E");
                background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
            }
            .fv-halt-stamp {
                font-size: 4em; font-weight: 900; color: rgba(255, 50, 50, 0.7); border: 0.2em solid rgba(255, 50, 50, 0.7);
                padding: 0.2em 0.8em; border-radius: 0.2em; transform: rotate(-15deg); text-transform: uppercase; background-color: rgba(0,0,0,0.4);
            }

            .score-item .score-comment { color: var(--score-color-comment); } .score-item .score-relvol { color: var(--score-color-relvol); } .score-item .score-price { color: var(--score-color-price); } .score-item .score-ah { color: var(--score-color-ah); } .score-item .score-lowfloat { color: var(--score-color-lowfloat); } .score-item .score-shortfloat { color: var(--score-color-shortfloat); } .score-item .score-marketcap { color: var(--score-color-marketcap); }
            .score-item .score-news { color: var(--score-color-news); }
            .score-item .score-custom-val { color: var(--score-color-custom); }

            /* --- Custom Dropdown Menu --- */
            #fv-custom-score-menu {
                position: absolute; z-index: 1000000;
                background: var(--bg-card); border: 1px solid var(--border-color);
                box-shadow: 0 4px 12px rgba(0,0,0,0.5); border-radius: 4px;
                padding: 4px 0; min-width: 120px; display: none;
            }
            .fv-menu-item { padding: 8px 16px; cursor: pointer; color: var(--text-secondary); font-size: 13px; transition: background 0.1s; }
            .fv-menu-item:hover { background: var(--bg-input); color: var(--text-primary); }
            .fv-menu-item.active { color: var(--color-primary); font-weight: 700; }

            /* --- Details Pane --- */
            #fv-details-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
            #fv-details-header h3 { margin: 0; font-size: 18px; color: var(--text-primary); font-weight: 600; }
            #fv-details-actions { display: flex; align-items: center; gap: 8px; }
            .fv-action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background-color: rgba(0, 200, 5, 0.15); color: var(--color-robinhood); border: 1px solid var(--color-robinhood); border-radius: var(--radius-sm); text-decoration: none; font-size: 13px; font-weight: 500; transition: var(--transition); }
            .fv-action-btn:hover { background-color: rgba(0, 200, 5, 0.3); color: #33ff33; }
            .fv-action-btn.fv-action-btn-neg { background-color: rgba(var(--color-negative-rgb), 0.15); color: var(--color-negative); border-color: var(--color-negative); cursor: pointer; }
            .fv-action-btn.fv-action-btn-neg:hover { background-color: rgba(var(--color-negative-rgb), 0.3); color: #ff8a80; }
            #fv-details-tabs { display: flex; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
            .fv-details-tab-btn { flex: 1; padding: 12px 15px; border: none; background: transparent; color: var(--text-secondary); font-weight: 500; cursor: pointer; font-size: 14px; position: relative; transition: color 0.2s ease; }
            .fv-details-tab-btn:hover { color: var(--text-primary); }
            .fv-details-tab-btn.active { color: var(--color-primary); }
            .fv-details-tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background-color: var(--color-primary); }
            #fv-details-content { flex-grow: 1; overflow-y: auto; position: relative; min-height: 0; }
            .fv-details-tab-pane { display: none; height: 100%; overflow-y: auto; } .fv-details-tab-pane.active { display: block; } .fv-hidden { display: none !important; }
            .fv-message { padding: 30px 10px; text-align: center; color: var(--text-secondary); font-size: 13px; }

            /* --- News & Comments Content --- */
            .fv-news-item { display: block; padding: 12px 20px; border-bottom: 1px solid var(--border-color-light); text-decoration: none; color: inherit; transition: background-color 0.2s ease; }
            .fv-news-item:last-child { border-bottom: none; }
            .fv-news-item:hover { background-color: rgba(255,255,255,0.04); }
            .fv-news-time { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
            .fv-news-headline { font-size: 14px; font-weight: 400; color: var(--text-primary); }
            .fv-highlight-keyword { color: var(--color-positive); font-weight: 600; background-color: rgba(46, 204, 113, 0.1); padding: 1px 4px; border-radius: var(--radius-sm); }
            .fv-comment-item { display: flex; padding: 12px 20px; border-bottom: 1px solid var(--border-color-light); }
            .fv-comment-avatar { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; flex-shrink: 0; }
            .fv-comment-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
            .fv-comment-name { font-weight: 600; font-size: 14px; color: var(--text-primary); }
            .fv-comment-username, .fv-comment-time { font-size: 12px; color: var(--text-secondary); }
            .fv-comment-time { margin-left: auto; }
            .fv-comment-body { margin: 0; line-height: 1.5; word-wrap: break-word; color: var(--text-primary); font-size: 14px; }
            .fv-comment-body a { color: var(--color-primary); text-decoration: none; transition: color 0.2s ease; }
            .fv-comment-body a:hover { text-decoration: underline; }

            /* --- Sticky Chart Showcase --- */
            #fv-chart-showcase { position: absolute; bottom: 0; left: 0; right: 0; z-index: 20; flex-shrink: 0; display: flex; flex-direction: column; background-color: var(--bg-content); }
            #fv-chart-resize-handle { height: 2px; cursor: ns-resize; background-color: var(--border-color); transition: background-color 0.2s ease; }
            #fv-chart-resize-handle:hover { background-color: var(--color-primary); }
            #fv-chart-showcase-header { position: relative; height: 1px; background-color: var(--border-color); cursor: pointer; }
            #fv-toggle-chart-visibility { position: absolute; top: 50%; left: 20px; transform: translateY(-50%); background-color: var(--bg-header); border-radius: 50%; border: 1px solid var(--border-color); width: 28px; height: 28px; }
            #fv-toggle-chart-visibility .svg-inline--fa { font-size: 14px; transition: transform 0.3s ease; }
            #fv-chart-showcase.is-collapsed #fv-toggle-chart-visibility .svg-inline--fa { transform: rotate(180deg); }
            #fv-details-chart-container { overflow: hidden; background-color: var(--bg-header); transition: max-height 0.3s ease-in-out, height 0.3s ease-in-out; }
            #fv-chart-showcase.is-collapsed #fv-details-chart-container { max-height: 0 !important; }
            #fv-details-chart { height: 100%; width: 100%; position: relative; }

            /* --- Settings Panel --- */
            #fv-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.98); z-index: 1000001; width: 850px; max-width: 95vw; height: 80vh; max-height: 700px; background: var(--bg-app); backdrop-filter: blur(10px) saturate(150%); color: var(--text-primary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,.5); opacity: 0; pointer-events: none; transition: var(--transition); display: flex; flex-direction: column; }
            #fv-settings-panel.is-visible { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%) scale(1); }
            .fv-settings-header { padding: 15px 25px; font-size: 18px; font-weight: 600; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            .fv-settings-body { display: flex; flex-grow: 1; overflow: hidden; }
            .fv-settings-tabs { flex-basis: 220px; flex-shrink: 0; border-right: 1px solid var(--border-color); padding: 15px 0; display: flex; flex-direction: column; gap: 4px; }
            .fv-settings-tab { padding: 12px 25px; cursor: pointer; font-size: 14px; border-left: 3px solid transparent; color: var(--text-secondary); transition: all 0.2s ease; display: flex; align-items: center; gap: 12px; }
            .fv-settings-tab .svg-inline--fa { width: 16px; text-align: center; color: var(--text-tertiary); transition: color 0.2s ease; }
            .fv-settings-tab:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
            .fv-settings-tab.is-active { border-left-color: var(--color-primary); font-weight: 600; color: var(--text-primary); background-color: rgba(var(--color-primary-rgb), 0.1); }
            .fv-settings-tab.is-active .svg-inline--fa { color: var(--color-primary); }
            .fv-settings-content { padding: 25px; overflow-y: auto; flex-grow: 1; }
            .fv-settings-section { display: none; } .fv-settings-section.is-active { display: block; }
            .fv-settings-section h3 { margin-top: 0; margin-bottom: 25px; color: var(--color-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; font-size: 16px; font-weight: 600; }
            .fv-setting-item { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; gap: 20px; }
            .fv-setting-item-label { flex-basis: 55%; font-size: 14px; line-height: 1.3; color: var(--text-primary); }
            .fv-setting-item-label small { display: block; color: var(--text-secondary); font-size: 12px; margin-top: 4px; font-style: italic; }
            .fv-setting-item-control { flex-basis: 45%; }
            .fv-setting-item input[type="number"], .fv-setting-item input[type="text"], .fv-setting-item select, .fv-setting-item textarea { width: 100%; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 14px; transition: var(--transition); }
            .fv-setting-item input:focus, .fv-setting-item select:focus, .fv-setting-item textarea:focus { border-color: var(--border-color-focus); outline: none; box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2); }
            .fv-setting-item textarea { min-height: 80px; font-family: monospace; resize: vertical; }
            .fv-settings-footer { padding: 15px 25px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; align-items: center; background-color: var(--bg-header); flex-shrink: 0; }
            .fv-settings-btn { padding: 8px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background-color: var(--bg-input); color: var(--text-primary); cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 500; }
            .fv-settings-btn:hover { background-color: var(--bg-card-hover); border-color: var(--color-primary); }
            #fv-settings-reset-all { background-color: rgba(var(--color-negative-rgb), 0.1); border-color: var(--color-negative); color: var(--color-negative); }
            #fv-settings-reset-all:hover { background-color: rgba(var(--color-negative-rgb), 0.2); color: #ff8a80; }

            /* --- View Tabs & Panes (for Broker) --- */
            #fv-view-tabs { flex-shrink: 0; display: flex; flex-wrap: nowrap; overflow-x: auto; background-color: var(--bg-header); border-bottom: 1px solid var(--border-color); padding: 5px 15px 0; gap: 5px; }
            .fv-view-tab { display: flex; align-items: center; gap: 8px; padding: 8px 15px; background-color: var(--bg-content); border: 1px solid var(--border-color); border-bottom: none; border-top-left-radius: var(--radius-sm); border-top-right-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary); font-weight: 500; transition: var(--transition); position: relative; bottom: -1px; white-space: nowrap; }
            .fv-view-tab:hover { background-color: var(--bg-card); color: var(--text-primary); }
            .fv-view-tab.is-active { background-color: var(--bg-app); color: var(--text-primary); border-color: var(--border-color); border-bottom-color: var(--bg-app); }
            .fv-view-tab .close-tab-btn { font-size: 18px; line-height: 1; padding: 0 5px; margin-left: 5px; border-radius: 50%; }
            .fv-view-tab .close-tab-btn:hover { background-color: rgba(255,255,255,0.1); color: var(--color-negative); }
            .fv-view-pane { position: absolute; top: 0; left: 0; width: 100%; height: 100%; visibility: hidden; opacity: 0; z-index: 1; transition: opacity 0.2s; background-color: var(--bg-app); }
            .fv-view-pane.is-active { visibility: visible; opacity: 1; z-index: 10; }
            .fv-broker-iframe { width: 100%; height: 100%; border: none; }
            .fv-broker-fallback { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; z-index: 1; color: var(--text-secondary); }
            .fv-broker-message .svg-inline--fa { font-size: 48px; color: var(--color-warning); margin-bottom: 15px; }
            .fv-open-new-window-btn { display: inline-flex; align-items:center; gap: 8px; margin-top: 20px; padding: 10px 20px; background-color: var(--color-primary); color: white; text-decoration: none; border-radius: var(--radius-sm); font-weight: 500; transition: background-color 0.2s; }

            /* --- Form Controls & Toggles --- */
            .fv-toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .fv-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .fv-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--bg-input); border: 1px solid var(--border-color); transition: .3s cubic-bezier(.4,0,.2,1); border-radius: 12px; }
            .fv-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; top: 50%; transform: translateY(-50%); background-color: var(--text-primary); transition: .3s cubic-bezier(.4,0,.2,1); border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
            input:checked + .fv-slider { background-color: var(--color-positive); border-color: transparent; }
            input:focus + .fv-slider { box-shadow: 0 0 0 2px var(--bg-app), 0 0 0 4px var(--color-primary); }
            input:checked + .fv-slider:before { transform: translateY(-50%) translateX(20px); }
        `
    };
    const defaultSettings = {
        general: {
            scanLimit: 20,
            marketOpenTime: '04:00',
            marketCloseTime: '20:00',
            overrideMarketHours: true, // DEFAULT: ON
            disqualifiedTickers: '',
            haltScreenerUrl: 'https://elite.finviz.com/screener.ashx?v=111&s=f_halted&f=ta_change_u10&ft=4&o=-relativevolume&ar=1',
        },
        scoring: {
            lookbackWindowMinutes: 5,
            commentWeight: 1.0,
            commentRefetchSeconds: 5,
            relVolChangeThreshold: 5.0,
            priceChangeThreshold: 1.0,
            shortFloatThreshold: 10.0,
            momentumDivisor: 10.0,
            newsScoreStep: 5.0, // Points per step
            newsLookbackMinutes: 240, // Default 4 hours
            newsScanInterval: 5, // Default 5 seconds
            enabledComponents: {
                comment: true,
                relVolChange: true,
                priceChange: true,
                lowFloat: true,
                shortFloat: true,
                marketCap: true,
                momentum: false, // DEFAULT: OFF
                news: true,
                custom: false // DEFAULT: OFF (NEW)
            }
        },
        additiveBonuses: {
            lowFloatBonus: [3, 2, 1],
            marketCapBonus: [3, 2, 1],
        },
        redirectAlerts: {
            enabled: false, // DEFAULT: OFF
            minScoreThreshold: 50,
            requireHODforAlert: false, // DEFAULT: OFF
            redirectUrl: 'https://robinhood.com/stocks/{ticker}',
        },
        news: {
            positiveKeywords: 'FDA,approval,beats,pdufa,guidance,profitable,acquisition,buyout,merger,takeover,agreement,collaboration,contract,partnership,phase 3,phase 2,positive data,positive results,statistically significant,breakthrough,fast track,insider buying,short squeeze',
        },
    };
    let settings = {};
    let currentCustomMode = 'buzz'; // Default custom mode

    function loadSettings() {
        const savedSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
        let loaded = {};
        try {
            loaded = JSON.parse(savedSettings);
        } catch (e) {
            console.error("Finviz Dashboard: Could not parse settings, loading defaults.", e);
            loaded = defaultSettings;
        }
        const merge = (defaultObj, loadedObj) => {
            let out = { ...defaultObj };
            for (let key in defaultObj) {
                if (key in loadedObj) {
                    if (typeof defaultObj[key] === 'object' && defaultObj[key] !== null && !Array.isArray(defaultObj[key])) {
                        out[key] = merge(defaultObj[key], loadedObj[key]);
                    } else {
                        out[key] = loadedObj[key];
                    }
                }
            }
            return out;
        };
        settings = merge(defaultSettings, loaded);
        currentCustomMode = GM_getValue(CUSTOM_MODE_KEY, 'buzz');
    }

    function applyPruning() {
        stockDataHistory = pruneStaleHistory(stockDataHistory);
    }

    function saveSettings(newSettings) {
        GM_setValue(SETTINGS_KEY, JSON.stringify(newSettings));
        loadSettings();
        applyPruning();
        // Force an update to reflect new settings immediately
        handleTableUpdate();
    }

    function updateAndSaveSetting(path, value) {
        const newSettings = JSON.parse(JSON.stringify(settings));
        let current = newSettings;
        const keys = path.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            current[key] = current[key] || {};
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
        saveSettings(newSettings);
    }

    function pruneStaleHistory(historyObject) {
        const now = Date.now();
        const lookbackMs = (settings.scoring.lookbackWindowMinutes || 5) * 60 * 1000;
        const cutoffTime = now - lookbackMs;
        const prunedHistory = {};
        for (const ticker in historyObject) {
            const freshEntries = historyObject[ticker]?.filter(entry => entry && entry.timestamp >= cutoffTime);
            if (freshEntries && freshEntries.length > 0) {
                prunedHistory[ticker] = freshEntries;
            }
        }
        return prunedHistory;
    }

    function pruneCommentHistory(historyObject) {
        const now = Date.now();
        const lookbackMs = (settings.scoring.lookbackWindowMinutes || 5) * 60 * 1000;
        const cutoffTime = now - lookbackMs;
        const prunedHistory = {};
        for (const ticker in historyObject) {
            const tickerData = historyObject[ticker];
            if (tickerData && Array.isArray(tickerData.comments)) {
                const freshComments = tickerData.comments.filter(comment => {
                    return comment && new Date(comment.created_at).getTime() >= cutoffTime;
                });
                prunedHistory[ticker] = {
                    ...tickerData,
                    comments: freshComments
                };
            }
        }
        return prunedHistory;
    }

    function clearScriptMemory() {
        stockDataHistory = {};
        commentHistory = {};
        highOfDayData = {};
        quotePageCache = {};
        haltTracking = {}; // Reset halts
        selectedTicker = null;
        // ALSO CLEAR PERSISTED HALTS
        GM_setValue(HALT_DATA_KEY, '{}');
        console.log('[Finviz Dashboard] Script session memory has been cleared.');
    }

    function scheduleAutomaticWipes() {
        setInterval(() => {
            const now = new Date();
            const nowInET = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
            const hour = nowInET.getHours();
            if (hour === 4 && lastWipeHour !== 4) {
                clearScriptMemory();
                lastWipeHour = 4;
            } else if (hour !== 4) { lastWipeHour = -1; }
            if (hour === 21 && lastDisqualifiedResetHour !== 21) {
                if (settings.general.disqualifiedTickers) {
                    const newSettings = JSON.parse(JSON.stringify(settings));
                    newSettings.general.disqualifiedTickers = '';
                    saveSettings(newSettings);
                    console.log('[Finviz Dashboard] Disqualified tickers list cleared.');
                }
                lastDisqualifiedResetHour = 21;
            } else if (hour !== 21) { lastDisqualifiedResetHour = -1; }
        }, 60000);
    }

    // --- HALT OBSERVER INIT ---
    function initHaltObserver(iframe) {
        if (!iframe || !iframe.contentDocument) return;
        // Clean up old observer
        if (haltObserver) {
            haltObserver.disconnect();
            haltObserver = null;
        }

        const doc = iframe.contentDocument;
        const statusEl = document.getElementById('fv-halt-monitor-status');
        if(statusEl) statusEl.textContent = 'Active (Waiting for updates)';

        // Function to run when mutation happens
        const onMutation = () => {
             fetchHaltedTickers();
        };

        haltObserver = new MutationObserver(onMutation);
        haltObserver.observe(doc.body, {
            childList: true,
            subtree: true
        });
        // Run once immediately
        fetchHaltedTickers();
    }

    function ensureHaltMonitor() {
        const haltTickerName = 'HALT-MONITOR';
        const viewId = 'halt-monitor';

        // Only create if it doesn't exist
        if (!viewManager.views[viewId]) {
             console.log('[Finviz Dashboard] Initializing Halt Monitor...');
             let url = settings.general.haltScreenerUrl;
             if (window.location.hostname.includes('elite')) {
                 url = url.replace('www.finviz.com', 'elite.finviz.com');
             } else {
                 url = url.replace('elite.finviz.com', 'www.finviz.com');
             }
             viewManager.openView(haltTickerName, url, false);
        }
    }


    // --- HALT DETECTION (DOM BASED) ---
    function fetchHaltedTickers() {
        const viewId = 'halt-monitor';
        // 2. Access the DOM of the iframe
        const iframe = document.querySelector(`#${viewId} iframe`);
        const statusEl = document.getElementById('fv-halt-monitor-status');
        if (!iframe || !iframe.contentDocument) {
             return;
        }

        try {
            const doc = iframe.contentDocument;
            const tickerLinks = doc.querySelectorAll('a[href*="quote.ashx?t="]');
            const currentlyHaltedSet = new Set();

            tickerLinks.forEach(link => {
                 const ticker = link.textContent.trim();
                 if(ticker && ticker.length < 10) currentlyHaltedSet.add(ticker);
            });
            if(statusEl) statusEl.textContent = `Active: ${currentlyHaltedSet.size} Tickers Detected`;

            let hasChanges = false;
            // NEW HALT COUNTING LOGIC (State Based)
            for(const ticker in stockDataHistory) {
                // Initialize state if needed
                if (!haltTracking[ticker]) {
                     haltTracking[ticker] = { count: 0, isHalted: false };
                }

                const isCurrentlyInHaltTable = currentlyHaltedSet.has(ticker);
                const wasAlreadyHalted = haltTracking[ticker].isHalted;

                if (isCurrentlyInHaltTable) {
                    // It is currently halted.
                    // Did it JUST become halted?
                    if (!wasAlreadyHalted) {
                        haltTracking[ticker].count++;
                        // Increment count ONLY on new halt event
                        haltTracking[ticker].isHalted = true;
                        // Set state to halted
                        hasChanges = true;
                    }
                    // If it was already halted, do nothing (keep state true, count stays same)
                } else {
                    // Not in halt table.
                    if(wasAlreadyHalted) {
                        // It WAS halted, now trading again.
                        // Reset state to false.
                        haltTracking[ticker].isHalted = false;
                        hasChanges = true;
                    }
                }
            }

            // Save to Persistence if anything changed
            if (hasChanges) {
                GM_setValue(HALT_DATA_KEY, JSON.stringify(haltTracking));
                // If halt status changed, re-render display
                if (viewManager.activeViewId === 'screener') updateDisplay({ candidates: lastCalculatedCandidates });
            }

        } catch(e) {
            console.warn("Halt Monitor: DOM access not ready or restricted.", e);
        }
    }


    async function runUpdateCycle() {
        if (!isScriptActive) {
            if (viewManager.activeViewId === 'screener') updateDisplay({ state: 'paused' });
            return;
        }

        const now = new Date();
        const isMarketHours = () => {
            const timeString = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' });
            return timeString >= settings.general.marketOpenTime && timeString < settings.general.marketCloseTime;
        };

        if (!settings.general.overrideMarketHours && !isMarketHours()) {
            if (viewManager.activeViewId === 'screener') updateDisplay({ state: 'closed' });
            return;
        }

        if (lastCalculatedCandidates.length === 0 && viewManager.activeViewId === 'screener') {
            updateDisplay({ state: 'scanning' });
        }

        const rows = Array.from(document.querySelectorAll('table.screener_table tr.styled-row')).slice(0, settings.general.scanLimit);
        if (rows.length === 0) {
            if (viewManager.activeViewId === 'screener') updateDisplay({ error: "No stocks found. Adjust screener filters." });
            return;
        }

        const columnIndexes = findColumnIndexes(rows[0].closest('table'));
        const requiredPerfKey = 'perf' + settings.scoring.lookbackWindowMinutes;
        if(columnIndexes[requiredPerfKey] === undefined) {
             if (viewManager.activeViewId === 'screener') updateDisplay({ error: `Missing required column: Perf ${settings.scoring.lookbackWindowMinutes} Min. Please add it to your Finviz view.` });
             return;
        }
        if(columnIndexes['newsTime'] === undefined) {
             if (viewManager.activeViewId === 'screener') updateDisplay({ error: `Missing required column: News Time. Please add it to your Finviz view.` });
             return;
        }

        scrapeAndStoreData(rows, columnIndexes);
        // Note: fetchHaltedTickers is now triggered by MutationObserver,
        // but we can call it here once just to ensure sync with new main data.
        fetchHaltedTickers();

        lastCalculatedCandidates = await calculateAllScores();
        if (lastCalculatedCandidates.length > 0) {
            const sortedForRedirect = [...lastCalculatedCandidates].sort((a, b) => b.totalScore - a.totalScore);
            const leader = sortedForRedirect[0];
            const isPotentiallyWorthy = settings.redirectAlerts.enabled &&
                leader.totalScore >= settings.redirectAlerts.minScoreThreshold &&
                (!sessionStorage.getItem('lastRedirectedTicker') || sessionStorage.getItem('lastRedirectedTicker') !== leader.ticker);

            if (isPotentiallyWorthy) {
                let shouldTriggerAlert = false;
                let triggerReason = 'HOD check disabled';

                if (settings.redirectAlerts.requireHODforAlert === false) {
                    shouldTriggerAlert = true;
                } else {
                    const intradayData = await getIntradayData(leader.ticker);
                    if (intradayData) {
                        const latestHODInfo = intradayData.prices.reduce((hod, price, index) => {
                            if (price > hod.price) {
                                return { price: price, timestamp: intradayData.timestamps[index] };
                            }
                            return hod;
                        }, { price: -Infinity, timestamp: 0 });
                        const previousHOD = highOfDayData[leader.ticker] || { price: -Infinity };
                        const isNewHOD = latestHODInfo.price > previousHOD.price;
                        const sevenAmET = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
                        sevenAmET.setHours(7, 0, 0, 0);
                        const isAfter7AM = latestHODInfo.timestamp > sevenAmET.getTime();
                        highOfDayData[leader.ticker] = latestHODInfo;

                        if (isAfter7AM || isNewHOD) {
                            shouldTriggerAlert = true;
                            triggerReason = isNewHOD ? 'New HOD' : 'HOD after 7AM ET';
                        }
                    }
                }

                if (shouldTriggerAlert) {
                    console.log(`BROKER TAB TRIGGERED for ${leader.ticker}! Score: ${leader.totalScore}. Reason: ${triggerReason}`);
                    sessionStorage.setItem('lastRedirectedTicker', leader.ticker);
                    const url = settings.redirectAlerts.redirectUrl.replace('{ticker}', leader.ticker.replace('-', '.'));
                    viewManager.openView(leader.ticker, url);

                    console.log(`[Finviz Dashboard] Auto-disqualifying ${leader.ticker} after alert.`);
                    const currentList = settings.general.disqualifiedTickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
                    if (!currentList.includes(leader.ticker.toUpperCase())) {
                        currentList.push(leader.ticker.toUpperCase());
                        // Manual save here
                        const newSettings = JSON.parse(JSON.stringify(settings));
                        newSettings.general.disqualifiedTickers = currentList.join(', ');
                        saveSettings(newSettings);
                    }
                }
            }
        }
        if (viewManager.activeViewId === 'screener') {
            updateDisplay({ candidates: lastCalculatedCandidates });
        }
    }


    function scrapeAndStoreData(rows, indexes) {
        const now = Date.now();
        // --- NEW: PRESERVE SCAN ORDER ---
        currentScanOrder = [];
        // Reset order for this scan

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const ticker = parseSimpleTicker(row, indexes);
            if (!ticker) return;

            currentScanOrder.push(ticker); // Keep track of the order

            const dataPoint = {
                timestamp: now,
                price: parseValue(cells[indexes.price]?.textContent),
                priceChange: parsePercentage(cells[indexes.change]?.textContent),
                ahChange: parsePercentage(cells[indexes.ahChange]?.textContent),
                relVol: parseValue(cells[indexes.relVolume]?.textContent),
                float: parseValue(cells[indexes.float]?.textContent),
                shortFloat: parsePercentage(cells[indexes.shortFloat]?.textContent),
                marketCap: parseValue(cells[indexes.marketCap]?.textContent),
                perf1: parsePercentage(cells[indexes.perf1]?.textContent),
                perf2: parsePercentage(cells[indexes.perf2]?.textContent),
                perf3: parsePercentage(cells[indexes.perf3]?.textContent),
                perf5: parsePercentage(cells[indexes.perf5]?.textContent),
                perf10: parsePercentage(cells[indexes.perf10]?.textContent),
                perf15: parsePercentage(cells[indexes.perf15]?.textContent),
                perf30: parsePercentage(cells[indexes.perf30]?.textContent),
                perf60: parsePercentage(cells[indexes.perf60]?.textContent),
                perf120: parsePercentage(cells[indexes.perf120]?.textContent),
                perf240: parsePercentage(cells[indexes.perf240]?.textContent),
                newsTime: cells[indexes.newsTime]?.textContent.trim() || '',
            };
            if (!stockDataHistory[ticker]) stockDataHistory[ticker] = [];
            stockDataHistory[ticker].push(dataPoint);
        });
        applyPruning();
    }

    async function calculateAllScores() {
        const disqualifiedList = settings.general.disqualifiedTickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
        const candidates = [];
        const now = Date.now();

        // --- CHANGED: Iterate through currentScanOrder to preserve table sort ---
        for (const ticker of currentScanOrder) {
            if (disqualifiedList.includes(ticker.toUpperCase())) continue;
            const history = stockDataHistory[ticker];
            if (!history || history.length < 1) continue;
            // Get Halt Data
            const haltInfo = haltTracking[ticker] || { count: 0, isHalted: false };

            // === PRE-FETCH CHART DATA REMOVED FOR PERFORMANCE ===
            // We now calculate news score using table data only to prevent IP blocks.
            // Intraday Data is no longer used for scoring loop, only for HOD check on alert
            let intradayData = null;

            const scoreContext = {
                comments: commentHistory[ticker]?.comments || [],
                history: history,
                newest: history[history.length - 1],
                now: now,
                intradayData: null, // No longer used for scoring
                latestNewsTime: 0   // No longer used for scoring
            };
            const scoringFunctions = {
                comment: calculateCommentScore,
                relVolChange: calculateRelVolChangeScore,
                priceChange: calculatePriceChangeScore,
                lowFloat: calculateLowFloatScore,
                shortFloat: calculateShortFloatScore,
                marketCap: calculateMarketCapScore,
                momentum: calculateMomentumScore,
                news: calculateNewsScore // UPDATED
            };
            let totalScore = 0;
            const scoreData = {};
            for (const [name, calculator] of Object.entries(scoringFunctions)) {
                const score = calculator(scoreContext);
                scoreData[`${name}Score`] = score;
                if (settings.scoring.enabledComponents[name] !== false && score > 0) {
                    totalScore += score;
                }
            }

            // --- CALCULATE CUSTOM SCORES ---
            const customScores = {};
            for (const [key, recipe] of Object.entries(CUSTOM_RECIPES)) {
                let cScore = 0;
                for (const [component, weight] of Object.entries(recipe.weights)) {
                    // Check if component exists in scoreData (e.g., 'newsScore')
                    // Note: recipe keys like 'news' map to 'newsScore' in scoreData
                    const val = scoreData[component + 'Score'] || 0;
                    cScore += val * weight;
                }
                customScores[key] = Math.round(cScore);
            }
            scoreData.customScores = customScores;
            if (totalScore >= 0) {
                candidates.push({
                    ticker,
                    totalScore: Math.round(totalScore),
                    scoreData,
                    rawData: scoreContext.newest,
                    haltInfo: haltInfo // Pass halt info
                });
            }
        }
        return candidates;
    }

    const isExtendedHours = () => {
        const nowInET = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
        const hour = nowInET.getHours();
        return hour >= 16 || hour < 4;
    };
    function calculateCommentScore({ comments, now }) {
        const timeframeMs = (settings.scoring.lookbackWindowMinutes || 5) * 60 * 1000;
        const recentComments = comments.filter(c => now - new Date(c.created_at).getTime() < timeframeMs).length;
        // FLAT SCORING: 1 comment = 1 point
        return recentComments;
    }
    function calculateRelVolChangeScore({ history }) {
        if (!history || history.length < 2) return 0;
        const netChange = history[history.length - 1].relVol - history[0].relVol;
        if (netChange <= 0 || settings.scoring.relVolChangeThreshold <= 0) return 0;
        return Math.floor(netChange / settings.scoring.relVolChangeThreshold);
    }
    function calculatePriceChangeScore({ newest }) {
        const perfKey = 'perf' + settings.scoring.lookbackWindowMinutes;
        const netChange = newest[perfKey] || 0;
        if (netChange <= 0 || settings.scoring.priceChangeThreshold <= 0) return 0;
        return Math.floor(netChange / settings.scoring.priceChangeThreshold);
    }
    function calculateLowFloatScore({ newest }) {
        const val = newest.float;
        if (val <= 0) return 0;
        if (val <= 5000000) return settings.additiveBonuses.lowFloatBonus[0];
        if (val <= 10000000) return settings.additiveBonuses.lowFloatBonus[1];
        if (val <= 15000000) return settings.additiveBonuses.lowFloatBonus[2];
        return 0;
    }
    function calculateShortFloatScore({ newest }) {
        const val = newest.shortFloat;
        return (val > 0 && settings.scoring.shortFloatThreshold > 0) ? Math.floor(val / settings.scoring.shortFloatThreshold) : 0;
    }
    function calculateMarketCapScore({ newest }) {
        const val = newest.marketCap;
        if (val <= 0) return 0;
        if (val <= 50000000) return settings.additiveBonuses.marketCapBonus[0];
        if (val <= 300000000) return settings.additiveBonuses.marketCapBonus[1];
        if (val <= 500000000) return settings.additiveBonuses.marketCapBonus[2];
        return 0;
    }
    function calculateMomentumScore({ newest }) {
        const inExtended = isExtendedHours();
        // Use AH change if in extended hours AND data is present, otherwise fallback to regular change
        const baseChange = (inExtended && newest.ahChange !== 0) ? newest.ahChange : newest.priceChange;

        // --- FILTER: IF STOCK IS RED OR FLAT, MOMENTUM IS ZERO ---
        if (baseChange <= 0) return 0;
        const perfKey = 'perf' + settings.scoring.lookbackWindowMinutes;
        const perfChange = newest[perfKey] || 0;
        const rawMomentum = baseChange * perfChange;
        const divisor = settings.scoring.momentumDivisor || 10;
        return Math.round(rawMomentum / divisor);
    }

    // --- REFINED NEWS SCORE LOGIC (TABLE BASED) ---
    function calculateNewsScore({ newest }) {
        const timeStr = newest.newsTime;
        if (!timeStr || timeStr === '-') return 0;

        // 1. Parse "News Time" text to Minutes
        let ageMinutes = 99999;

        if (timeStr.includes('min')) {
            // Format: "1 min", "59 min"
            ageMinutes = parseInt(timeStr.replace(/\D/g, ''), 10) || 0;
        } else if (timeStr.includes('hour')) {
             // Format: "1 hour", "2 hours"
             // Note: User specified "1 hour" (no s) and "2 hours" (with s) - regex handles both
             const hours = parseInt(timeStr.replace(/\D/g, ''), 10) || 0;
             ageMinutes = hours * 60;
        } else if (timeStr.includes('-')) {
             // Format: "Jan-21" (Date) -> Too old for velocity news scoring
             return 0;
        }

        // 2. Check Window
        const windowMinutes = settings.scoring.newsLookbackMinutes || 240; // Default 4 hours
        if (ageMinutes > windowMinutes) return 0;

        // 3. Determine Gain using the correct Perf Column
        // Logic: Find the smallest Perf bucket that covers the age of the news.
        let gainPct = 0;

        if (ageMinutes <= 1) gainPct = newest.perf1;
        else if (ageMinutes <= 2) gainPct = newest.perf2;
        else if (ageMinutes <= 3) gainPct = newest.perf3;
        else if (ageMinutes <= 5) gainPct = newest.perf5;
        else if (ageMinutes <= 10) gainPct = newest.perf10;
        else if (ageMinutes <= 15) gainPct = newest.perf15;
        else if (ageMinutes <= 30) gainPct = newest.perf30 || newest.perf15; // Fallback if col missing
        else if (ageMinutes <= 60) gainPct = newest.perf60 || newest.perf30;
        else if (ageMinutes <= 120) gainPct = newest.perf120 || newest.perf60;
        else if (ageMinutes <= 240) gainPct = newest.perf240 || newest.perf120;
        else gainPct = newest.priceChange; // Fallback to Day change

        // 4. POSITIVE ONLY FILTER
        if (!gainPct || gainPct <= 0) return 0;

        // 5. Base Score & Decay
        const step = settings.scoring.newsScoreStep || 5.0;
        const baseScore = gainPct / step;

        const decayFactor = 1 - (ageMinutes / windowMinutes);
        const finalScore = baseScore * decayFactor;

        return Math.floor(finalScore > 0 ? finalScore : 0);
    }

    // ===================================================================================
    // --- 4. UNIFIED DATA FETCHER & CACHE ---
    // ===================================================================================

    function fetchUnifiedQuotePageData(ticker) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://elite.finviz.com/quote.ashx?t=${ticker.toUpperCase()}&p=i5`, // Added p=i5 for 5-min data
                onload: function(response) {
                    const extractedData = {
                        chartData: null,
                        latestNewsTimestamp: 0,
                        headlines: [],
                        timestamp: Date.now()
                    };

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        // --- ROBUST CHART DATA PARSING (FROM CHART MODULE) ---
                        // Looks for "var data = { ... }" in the source code
                        const chartMatch = response.responseText.match(/var\s+data\s*=\s*(\{.*?\});/s);
                        if (chartMatch && chartMatch[1]) {
                            const rawData = JSON.parse(chartMatch[1]);
                            // Extract prices and timestamps directly
                            if (rawData.date && rawData.close && rawData.date.length > 0) {
                                const timestamps = rawData.date.map(t => t * 1000);
                                // Convert to ms
                                const prices = rawData.close;
                                extractedData.chartData = { prices, timestamps };
                            }
                        }

                        const newsRows = doc.querySelectorAll("table.fullview-news-outer tr");
                        newsRows.forEach((row, index) => {
                            const link = row.querySelector("a");
                            const timeCell = row.querySelector("td:first-child");
                            if(link && timeCell) {
                                const timeStr = timeCell.textContent.trim();
                                extractedData.headlines.push({
                                    time: timeStr,
                                    headline: link.textContent.trim(),
                                    link: link.href
                                });
                                if(index === 0) {
                                    extractedData.latestNewsTimestamp = parseNewsTimestamp(timeStr);
                                }
                            }
                        });
                        extractedData.headlines = extractedData.headlines.slice(0,15);

                    } catch (e) {
                        console.error(`[Finviz Dashboard] Error parsing unified data for ${ticker}:`, e);
                    } finally {
                        quotePageCache[ticker] = extractedData;
                        resolve(extractedData);
                    }
                },
                onerror: () => resolve({ chartData: null, latestNewsTimestamp: 0, headlines: [], timestamp: Date.now() })
            });
        });
    }

    async function getOrFetchUnifiedData(ticker) {
        const cacheEntry = quotePageCache[ticker];
        // USE DYNAMIC SETTING FOR CACHE TTL
        const ttl = (settings.scoring.newsScanInterval || 5) * 1000;
        const isCacheValid = cacheEntry && (Date.now() - cacheEntry.timestamp < ttl);
        if (isCacheValid) {
            return cacheEntry;
        }
        return await fetchUnifiedQuotePageData(ticker);
    }

    async function getIntradayData(ticker) {
        const data = await getOrFetchUnifiedData(ticker);
        return data.chartData;
    }

    async function getRecentHeadlines(ticker) {
        if (!ticker) return [];
        const data = await getOrFetchUnifiedData(ticker);
        return data.headlines;
    }


    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
    function formatNumber(num) {
        if (num === null || num === undefined || !isFinite(num) || num === 0) return '-';
        if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    }
    function parseSimpleTicker(row, indexes) { const cell = row.querySelectorAll('td')[indexes.ticker]; return cell ? (cell.querySelector('a')?.textContent.trim() || cell.textContent.trim()) : null;
    }
    function parsePercentage(valueStr) { if (!valueStr || typeof valueStr !== 'string' || valueStr.trim() === '-') return 0;
    return parseFloat(valueStr.replace(/[%$+,]/g, "")); }
    function parseValue(valueStr) { if (!valueStr || typeof valueStr !== 'string' || valueStr.trim() === '-') return 0;
    let num = parseFloat(valueStr.replace(/[$,%]/g, "")); if (valueStr.endsWith("M")) num *= 1e6; if (valueStr.endsWith("B")) num *= 1e9; return num;
    }

    // --- REPLACED NEWS PARSER WITH "SUPERIOR CHART MODULE" LOGIC ---
    function parseNewsTimestamp(timeStr) {
        if (!timeStr || timeStr.trim() === '-') return 0;
        const now = new Date();
        // Use midnight logic from Source Script
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
        const parts = fmt.formatToParts(now);
        const y = parts.find(p => p.type === 'year').value;
        const m = parts.find(p => p.type === 'month').value;
        const d = parts.find(p => p.type === 'day').value;
        const dateString = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}T00:00:00`;
        const localDate = new Date(dateString);
        const etString = new Date(localDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
        const etDate = new Date(etString);
        const diff = localDate.getTime() - etDate.getTime();
        const midnightET = localDate.getTime() + diff;

        let ts = 0;

        const dateMatch = timeStr.match(/([a-zA-Z]{3})-(\d{1,2})-(\d{2})\s+(\d{1,2}):(\d{2})(AM|PM)/);
        if (dateMatch) {
              const monthStr = dateMatch[1];
              const day = parseInt(dateMatch[2], 10);
              let year = parseInt(dateMatch[3], 10) + 2000;
              const h = parseInt(dateMatch[4], 10);
              const m = parseInt(dateMatch[5], 10);
              const ampm = dateMatch[6];
              const mo = MONTH_MAP[monthStr];
              let hour24 = h;
              if (ampm === 'PM' && h !== 12) hour24 += 12;
              if (ampm === 'AM' && h === 12) hour24 = 0;
              const tempD = new Date(year, mo, day);
              const anchorDate = new Date(midnightET);
              if (anchorDate.getDate() === day) {
                  ts = midnightET + (hour24 * 3600000) + (m * 60000);
              } else {
                  ts = tempD.getTime() + (hour24 * 3600000) + (m * 60000);
              }
              return ts;
        }
        else if (/^\d{1,2}:\d{2}(AM|PM)$/.test(timeStr)) {
              const timeParts = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/);
              if (timeParts) {
                  let h = parseInt(timeParts[1], 10);
                  const m = parseInt(timeParts[2], 10);
                  const ampm = timeParts[3];
                  if (ampm === 'PM' && h !== 12) h += 12;
                  if (ampm === 'AM' && h === 12) h = 0;
                  // If it's just time, it's today relative to ET midnight
                  ts = midnightET + (h * 3600000) + (m * 60000);
                  return ts;
              }
        }
        // Fallback for simple date (e.g. "May-24")
        const simpleDateMatch = timeStr.match(/([a-zA-Z]{3})-(\d{1,2})/);
        if (simpleDateMatch) {
             const mo = MONTH_MAP[simpleDateMatch[1]];
             const day = parseInt(simpleDateMatch[2], 10);
             const nowYear = new Date().getFullYear();
             const d = new Date(nowYear, mo, day);
             return d.getTime();
        }

        return 0;
    }

    function findColumnIndexes(table) {
        const headers = table.querySelectorAll('thead th');
        const indexes = {};
        const headerMap = {
            'Ticker': 'ticker', 'Price': 'price', 'Change': 'change', 'News Time': 'newsTime',
            'Rel Volume': 'relVolume', 'Market Cap': 'marketCap', 'Float': 'float', 'Short Float': 'shortFloat',
            'AH Change': 'ahChange',
            'Perf 1 Min': 'perf1', 'Perf 2 Min': 'perf2', 'Perf 3 Min': 'perf3', 'Perf 5 Min': 'perf5',
            'Perf 10 Min': 'perf10', 'Perf 15 Min': 'perf15', 'Perf 30 Min': 'perf30',
            'Perf 1 Hr': 'perf60', 'Perf 2 Hr': 'perf120', 'Perf 4 Hr': 'perf240'
        };
        headers.forEach((header, i) => { const key = headerMap[header.textContent.trim()]; if (key) indexes[key] = i; });
        return indexes;
    }

    async function fetchAllMissingComments() {
        const commentPromises = [];
        const now = Date.now();
        const refetchIntervalMs = (settings.scoring.commentRefetchSeconds || 5) * 1000;
        for (const ticker in stockDataHistory) {
            const needsFetch = !commentHistory[ticker] || (now - commentHistory[ticker].lastFetch > refetchIntervalMs);
            if (needsFetch) {
                commentPromises.push(
                    fetchStockTwitsComments(ticker).then(comments => ({ ticker, comments }))
                );
            }
        }
        const fetchedResults = await Promise.all(commentPromises);
        fetchedResults.forEach(res => {
            if (!commentHistory[res.ticker]) {
                commentHistory[res.ticker] = { lastFetch: 0, comments: [] };
            }
            commentHistory[res.ticker].lastFetch = Date.now();
            const existingIds = new Set(commentHistory[res.ticker].comments.map(c => c.id));
            let newCommentsFound = false;
            res.comments.forEach(comment => {
                if (!existingIds.has(comment.id)) {
                    commentHistory[res.ticker].comments.push(comment);
                    newCommentsFound = true;
                }
            });

            commentHistory[res.ticker].comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            if (newCommentsFound && selectedTicker && res.ticker === selectedTicker) {
                const commentsEl = document.getElementById('fv-details-comments');
                if (commentsEl) {
                    renderComments(commentsEl, { comments: commentHistory[res.ticker].comments });
                }
            }
        });
    }

    async function fetchAndStoreComments(ticker) {
        const comments = await fetchStockTwitsComments(ticker);
        if (!commentHistory[ticker]) {
            commentHistory[ticker] = { lastFetch: 0, comments: [] };
        }
        commentHistory[ticker].lastFetch = Date.now();

        const existingIds = new Set(commentHistory[ticker].comments.map(c => c.id));
        comments.forEach(comment => {
            if (!existingIds.has(comment.id)) {
                commentHistory[ticker].comments.push(comment);
            }
        });
        commentHistory[ticker].comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return commentHistory[ticker].comments;
    }

    function fetchStockTwitsComments(ticker) { return new Promise(resolve => { if (!ticker) return resolve([]); GM_xmlhttpRequest({ method: "GET", url: `https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json`, responseType: 'json', onload: response => { if (response.status === 200 && response.response.messages) { resolve(response.response.messages); } else { resolve([]); } }, onerror: (e) => { console.error(`Error fetching StockTwits for ${ticker}:`, e); resolve([]); } }); });
    }

    function initializeResizablePanels() {
        const chartShowcase = document.getElementById('fv-chart-showcase');
        const chartContainer = document.getElementById('fv-details-chart-container');
        const horizontalHandle = document.getElementById('fv-chart-resize-handle');
        const cardContainer = document.getElementById('fv-card-container');
        const savedChartState = JSON.parse(GM_getValue(CHART_UI_STATE_KEY, JSON.stringify({ height: 300, isCollapsed: false })));
        const updateContainerPadding = () => {
            if (!chartShowcase || !cardContainer) return;
            const height = chartShowcase.offsetHeight;
            cardContainer.style.paddingBottom = `${height + 16}px`;
        };
        const applyChartState = (state) => {
            chartContainer.style.height = `${state.height}px`;
            chartContainer.style.maxHeight = `${state.height}px`;
            chartShowcase.classList.toggle('is-collapsed', state.isCollapsed);
            setTimeout(updateContainerPadding, 50);
        };

        applyChartState(savedChartState);

        document.getElementById('fv-chart-showcase-header').addEventListener('click', () => {
            const isCurrentlyCollapsed = chartShowcase.classList.toggle('is-collapsed');
            const currentState = JSON.parse(GM_getValue(CHART_UI_STATE_KEY, '{}'));
            currentState.isCollapsed = isCurrentlyCollapsed;
            GM_setValue(CHART_UI_STATE_KEY, JSON.stringify(currentState));
            setTimeout(updateContainerPadding, 50);
        });
        horizontalHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = chartContainer.offsetHeight;
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';

            const doDrag = (moveEvent) => {
                const newHeight = startHeight - (moveEvent.clientY - startY);
                if (newHeight > 100) {
                    chartContainer.style.height = `${newHeight}px`;
                    chartContainer.style.maxHeight = `${newHeight}px`;
                    updateContainerPadding();
                 }
            };
            const stopDrag = () => {
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                const currentState = JSON.parse(GM_getValue(CHART_UI_STATE_KEY, '{}'));
                currentState.height = chartContainer.offsetHeight;
                GM_setValue(CHART_UI_STATE_KEY, JSON.stringify(currentState));
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            };
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });

        const verticalHandle = document.getElementById('fv-vertical-resize-handle');
        const detailsPane = document.getElementById('fv-details-pane');
        const savedLayoutState = JSON.parse(GM_getValue(LAYOUT_STATE_KEY, JSON.stringify({ detailsPaneWidth: 450 })));

        // --- APPLY LOCKED WIDTH IMMEDIATELY ---
        if (detailsPane) {
            const width = savedLayoutState.detailsPaneWidth || 450;
            detailsPane.style.flexBasis = `${width}px`;
            detailsPane.style.width = `${width}px`;
            detailsPane.style.minWidth = `${width}px`;
            detailsPane.style.maxWidth = `${width}px`;
        }

        if (!verticalHandle || !detailsPane) return;
        verticalHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = detailsPane.offsetWidth;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';

            const doDrag = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                let newWidth = startWidth - deltaX;
                const minWidth = 300;
                const minMainWidth = 500;
                const maxWidth = window.innerWidth - minMainWidth;
                if (newWidth < minWidth) newWidth = minWidth;
                if (newWidth > maxWidth) newWidth = maxWidth;

                // Set rigid constraints during drag
                detailsPane.style.flexBasis = `${newWidth}px`;
                detailsPane.style.width = `${newWidth}px`;
                detailsPane.style.minWidth = `${newWidth}px`;
                detailsPane.style.maxWidth = `${newWidth}px`;
            };
            const stopDrag = () => {
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                const currentLayoutState = JSON.parse(GM_getValue(LAYOUT_STATE_KEY, '{}'));
                currentLayoutState.detailsPaneWidth = detailsPane.offsetWidth;
                GM_setValue(LAYOUT_STATE_KEY, JSON.stringify(currentLayoutState));
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            };
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });
    }

    function createDisplayPanels() {
        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'fv-fullscreen-container';
        dashboardContainer.innerHTML = UI_COMPONENTS.mainDashboardHTML;
        document.body.appendChild(dashboardContainer);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'fv-dashboard-toggle';
        toggleBtn.title = 'Toggle Velocity Dashboard';
        toggleBtn.innerHTML = `<i class="fa-solid fa-gauge-high"></i>`;
        document.body.appendChild(toggleBtn);

        createSettingsPanel();
        initializeControlsToolbar();
        viewManager.init();
        initializeResizablePanels();

        const lastTab = GM_getValue('fvDashboard_lastTab', 'news');
        document.querySelector(`.fv-details-tab-btn[data-tab="${lastTab}"]`)?.classList.add('active');
        document.getElementById(`fv-details-${lastTab}`)?.classList.add('active');
        // --- SCALE CONTROL LOGIC ---
        const scaleInput = document.getElementById('fv-card-scale-input');
        if (scaleInput) {
            const savedScale = GM_getValue(SCALE_KEY, 1.0);
            scaleInput.value = savedScale;
            document.documentElement.style.setProperty('--card-scale', savedScale);

            scaleInput.addEventListener('input', (e) => {
                const val = e.target.value;
                document.documentElement.style.setProperty('--card-scale', val);
                GM_setValue(SCALE_KEY, val);
            });
        }

        const setDashboardVisible = (isVisible) => {
            dashboardContainer.classList.toggle('is-visible', isVisible);
            document.body.style.overflow = isVisible ? 'hidden' : '';
            GM_setValue(DASHBOARD_STATE_KEY, JSON.stringify({ isVisible }));
        };
        toggleBtn.addEventListener('click', () => {
            setDashboardVisible(!dashboardContainer.classList.contains('is-visible'));
        });
        document.getElementById('fv-close-dashboard-btn').addEventListener('click', () => {
            setDashboardVisible(false);
        });
        document.getElementById('fv-script-toggle').addEventListener('change', function() {
            isScriptActive = this.checked;
            if (isScriptActive) {
               updateDisplay({ state: 'scanning' });
               handleTableUpdate();
            } else {
               updateDisplay({ state: 'paused' });
             }
        });
        document.getElementById('fv-robinhood-btn').addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedTicker) {
                const url = e.currentTarget.href;
                viewManager.openView(selectedTicker, url);
            }
        });
        document.getElementById('fv-card-container').addEventListener('click', (e) => {
             const card = e.target.closest('.fv-ticker-card');
             if(card && card.dataset.ticker) {
                // If clicked on Custom Score Label, DON'T SELECT TICKER, OPEN MENU
                if(e.target.closest('.score-custom label')) return;

                isManuallySelected = true;
                handleTickerSelection(card.dataset.ticker);
             }
        });
        // --- GLOBAL CLICK TO CLOSE MENU ---
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('fv-custom-score-menu');
            if(menu && menu.style.display === 'block') {
                 menu.style.display = 'none';
            }
        });
        document.getElementById('fv-details-tabs').addEventListener('click', (e) => {
            if (e.target.matches('.fv-details-tab-btn')) {
                const tabId = e.target.dataset.tab;
                document.querySelectorAll('.fv-details-tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.fv-details-tab-pane').forEach(pane => pane.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(`fv-details-${tabId}`).classList.add('active');
                GM_setValue('fvDashboard_lastTab', tabId);
            }
        });
        document.getElementById('fv-view-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.fv-view-tab');
            if (!tab) return;

            const viewId = tab.dataset.viewId;

            if (e.target.classList.contains('close-tab-btn')) {
                e.stopPropagation();
                viewManager.closeView(viewId);
             } else {
                viewManager.switchView(viewId);
            }
        });
        document.getElementById('fv-disqualify-btn').addEventListener('click', () => {
            if (selectedTicker) {
                const currentList = settings.general.disqualifiedTickers.split(',').map(t => t.trim()).filter(Boolean);
                if (!currentList.includes(selectedTicker)) {
                    currentList.push(selectedTicker);
                    // Manual save here
                    const newSettings = JSON.parse(JSON.stringify(settings));
                    newSettings.general.disqualifiedTickers = currentList.join(', ');
                    saveSettings(newSettings);

                    selectedTicker = null;
                    isManuallySelected = false;
                    runUpdateCycle();
                }
            }
        });
        // --- RENDER SCORE TOGGLES ---
        renderScoreToggles();
    }

    function renderScoreToggles() {
        const container = document.getElementById('fv-score-toggles-container');
        if (!container) return;

        const togglesMap = [
            { key: 'momentum', label: 'Momentum', color: 'var(--score-color-momentum)' },
            { key: 'comment', label: 'Comments', color: 'var(--score-color-comment)' },
            { key: 'relVolChange', label: 'Rel Vol', color: 'var(--score-color-relvol)' },
            { key: 'priceChange', label: 'Price Perf', color: 'var(--score-color-price)' },
            { key: 'lowFloat', label: 'Float', color: 'var(--score-color-lowfloat)' },
            { key: 'shortFloat', label: 'Short %', color: 'var(--score-color-shortfloat)' },
            { key: 'marketCap', label: 'Mkt Cap', color: 'var(--score-color-marketcap)' },
            { key: 'news', label: 'News', color: 'var(--score-color-news)' },
            { key: 'custom', label: 'Custom', color: 'var(--score-color-custom)' } // NEW TOGGLE
        ];
        container.innerHTML = togglesMap.map(t => {
            const isActive = settings.scoring.enabledComponents[t.key] !== false;
            return `<div class="fv-score-toggle-btn ${isActive ? 'is-active' : ''}" data-key="${t.key}" style="--btn-color: ${t.color}">
                <i class="fa-solid ${isActive ? 'fa-check' : 'fa-minus'}"></i>
                <span>${t.label}</span>
            </div>`;
         }).join('');

        // Re-attach listeners
        container.querySelectorAll('.fv-score-toggle-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const key = btn.dataset.key;
                const currentState = settings.scoring.enabledComponents[key] !== false;

                // Toggle state
                settings.scoring.enabledComponents[key] = !currentState;

                // Update UI immediately
                btn.classList.toggle('is-active');
                const icon = btn.querySelector('i');
                icon.className = `fa-solid ${!currentState ? 'fa-check' : 'fa-minus'}`;

                // Save and recalculate
                saveSettings(settings);
                // Force a recalculation without fetching new data
                lastCalculatedCandidates = await calculateAllScores();
                updateDisplay({ candidates: lastCalculatedCandidates });
            });
        });
    }

    function handleSort(columnKey, direction) {
        sortState.column = columnKey;
        if(direction) {
            sortState.direction = direction;
        } else {
            sortState.direction = sortState.direction === 'desc' ? 'asc' : 'desc';
        }
        isManuallySelected = false;
        updateDisplay({ candidates: lastCalculatedCandidates });
    }

    async function handleTickerSelection(ticker) {
        if (!ticker) return;
        selectedTicker = ticker;

        document.body.dataset.fvCurrentTicker = ticker;

        document.querySelectorAll('#fv-card-container .fv-ticker-card').forEach(r => r.classList.remove('selected'));
        const card = document.querySelector(`#fv-card-container .fv-ticker-card[data-ticker="${ticker}"]`);
        if(card) card.classList.add('selected');

        const tickerHeaderEl = document.getElementById('fv-details-ticker');
        const robinhoodBtn = document.getElementById('fv-robinhood-btn');
        const disqualifyBtn = document.getElementById('fv-disqualify-btn');

        tickerHeaderEl.textContent = ticker;
        const url = settings.redirectAlerts.redirectUrl.replace('{ticker}', ticker.replace('-', '.'));
        robinhoodBtn.href = url;

        robinhoodBtn.classList.remove('fv-hidden');
        disqualifyBtn.classList.remove('fv-hidden');

        const newsEl = document.getElementById('fv-details-news');
        const commentsEl = document.getElementById('fv-details-comments');
        const chartEl = document.getElementById('fv-details-chart');
        newsEl.innerHTML = `<div class="fv-message">Loading News...</div>`;
        commentsEl.innerHTML = `<div class="fv-message">Loading Comments...</div>`;
        if (chartEl && !chartEl.dataset.chartInitialized) {
            chartEl.innerHTML = `<div class="fv-message">Waiting for chart script...</div>`;
        }

        document.body.dispatchEvent(new CustomEvent('FVDashboard_TickerChanged', {
            detail: { ticker: ticker }
        }));
        const [headlines, comments] = await Promise.all([
            getRecentHeadlines(ticker),
            fetchAndStoreComments(ticker),
        ]);
        renderNews(newsEl, { headlines });
        renderComments(commentsEl, { comments });
    }

    function updateDisplay(data) {
        updateStatus(data);
        if (data.candidates) {
            renderTickerCards(data.candidates);
        }
    }

    function updateStatus(data) {
        const statusTextEl = document.getElementById('fv-status-text');
        const statusDotEl = document.querySelector('#fv-main-status .fv-status-dot');
        const cardContainer = document.getElementById('fv-card-container');
        if (!statusTextEl || !statusDotEl) return;

        let message = '';
        let dotClass = 'fv-dot-holding';

        if (data.state) {
            const isPaused = data.state === 'paused';
            const isClosed = data.state === 'closed';
            if(isPaused) { message = 'Script is paused.'; dotClass = 'fv-dot-idle'; }
            else if(isClosed) { message = 'Market is currently closed.'; dotClass = 'fv-dot-idle'; }
            else { message = 'Scanning for high velocity stocks...'; dotClass = 'fv-dot-holding'; }
            statusTextEl.textContent = isPaused ? 'Paused' : (isClosed ? 'Market Closed' : `Scanning ${settings.general.scanLimit}...`);
        } else if (data.error) {
            message = data.error;
            dotClass = 'fv-dot-error';
            statusTextEl.textContent = 'Error';
        } else {
            statusTextEl.textContent = 'Live';
            dotClass = 'fv-dot-active';
        }

        statusDotEl.className = 'fv-status-dot';
        statusDotEl.classList.add(dotClass);
        if (viewManager.activeViewId === 'screener') {
            if (cardContainer && message && (!data.candidates || data.candidates.length === 0)) {
                cardContainer.innerHTML = `<div class="fv-message-cell">${message}</div>`;
            }
        }
    }

    function renderTickerCards(candidates) {
        if (viewManager.activeViewId !== 'screener') return;
        const cardContainer = document.getElementById('fv-card-container');
        if (!cardContainer) return;

        const sortKey = sortState.column;
        const sortDir = sortState.direction === 'desc' ? -1 : 1;

        let renderList = [];

        // --- SORT LOGIC ---
        if (sortKey === 'none') {
            // Keep original order, but filter to current candidates
            // We use currentScanOrder which is ordered by scraper
            // We map that to the candidates we calculated
            const candidatesMap = new Map(candidates.map(c => [c.ticker, c]));
            currentScanOrder.forEach(ticker => {
                if (candidatesMap.has(ticker)) {
                    renderList.push(candidatesMap.get(ticker));
                }
            });
        } else {
            // Standard sorting
            renderList = [...candidates].sort((a, b) => {
                let valA, valB;
                if (sortKey === 'totalScore' || sortKey === 'ticker') {
                    valA = a[sortKey];
                    valB = b[sortKey];
                } else if (sortKey === 'price') {
                    valA = a.rawData.price;
                    valB = b.rawData.price;
                } else if (sortKey === 'haltCount') {
                    valA = a.haltInfo ? a.haltInfo.count : 0;
                    valB = b.haltInfo ? b.haltInfo.count : 0;
                } else if (sortKey === 'custom') {
                    valA = a.scoreData.customScores[currentCustomMode];
                    valB = b.scoreData.customScores[currentCustomMode];
                } else {
                    valA = a.scoreData[sortKey + 'Score'];
                    valB = b.scoreData[sortKey + 'Score'];
                 }
                if (typeof valA === 'string') return valA.localeCompare(valB) * sortDir;
                return (valA - valB) * sortDir;
            });
        }

        const formatRawChange = (val) => {
            const perfKey = 'perf' + settings.scoring.lookbackWindowMinutes;
            const value = val[perfKey] || 0;
            const sign = value >= 0 ? '+' : '';
            return `<span class="fv-sign">${sign}</span>${value.toFixed(2)}%`;
        };
        const inExtendedHours = isExtendedHours();
        const changeColumnClass = inExtendedHours ? 'score-ah' : 'score-price';
        const scoreItemsMap = [
            { key: 'momentum', label: 'Momentum', raw: (r, s) => s.momentumScore, className: 'score-momentum' },
            { key: 'comment', label: 'Comments', raw: (r, s) => `${s.commentScore || 0} recent`, className: 'score-comment' },
            { key: 'relVolChange', label: 'Rel Vol', raw: (r) => r.relVol.toFixed(2), className: 'score-relvol' },
            { key: 'priceChange', label: `Perf ${settings.scoring.lookbackWindowMinutes}m`, raw: (r) => formatRawChange(r), className: changeColumnClass },
            { key: 'lowFloat', label: 'Float', raw: (r) => formatNumber(r.float), className: 'score-lowfloat' },
            { key: 'shortFloat', label: 'Short %', raw: (r) => `${r.shortFloat.toFixed(1)}%`, className: 'score-shortfloat' },
            { key: 'marketCap', label: 'Mkt Cap', raw: (r) => formatNumber(r.marketCap), className: 'score-marketcap' },
            { key: 'news', label: 'News', raw: (r, s) => `${s.newsScore || 0} pts`, className: 'score-news' },
            { key: 'custom', label: CUSTOM_RECIPES[currentCustomMode].name, raw: (r, s) => s.customScores[currentCustomMode] + ' pts', className: 'score-custom-val', isCustom: true },
            { key: 'haltCount', label: 'Halts', raw: (r, s, h) => `${h.count} Halts`, className: 'score-negative', isHalt: true }
        ];
        let cardsHtml = '';
        renderList.forEach((stock, index) => {
            const s = stock.scoreData;
            const r = stock.rawData;
            const h = stock.haltInfo || { count: 0, isHalted: false };

            const useAH = inExtendedHours; // ALWAYS USE AH COLUMN IF PAST 4PM
            const marketChangeValue = useAH ? r.ahChange : r.priceChange;
            const marketSign = marketChangeValue > 0 ? '+' : (marketChangeValue < 0 ? '' : '');
            const formattedMarketChange = `${marketSign}${marketChangeValue.toFixed(2)}%`;
            const priceColorClass = marketChangeValue >= 0 ? 'var(--color-positive)' : 'var(--color-negative)';
            const changeLabel = useAH ? 'AH Chg' : 'Change';

            const scoreItemsHtml = scoreItemsMap.map(item => {
                // FILTER DISABLED SCORES FROM DISPLAY
                if (item.key !== 'haltCount' && settings.scoring.enabledComponents[item.key] === false) return '';

                if (item.isHalt) {
                     return `<div class="score-item">
                        <label>${item.label}</label>
                        <div class="score-item-row">
                            <span class="score-value" style="color: var(--color-negative)">${h.count}</span>
                            <span class="score-raw-value">HALTS</span>
                        </div>
                    </div>`;
                }
                const customClass = item.isCustom ? 'score-custom' : '';
                return `
                <div class="score-item ${customClass}">
                    <label>${item.label} ${item.isCustom ? '<i class="fa-solid fa-caret-down" style="font-size:0.8em; margin-left:4px;"></i>' : ''}</label>
                    <div class="score-item-row">
                        <span class="score-value ${item.className}" ${item.key === 'momentum' ? 'style="color: var(--score-color-momentum)"' : ''}>${item.isCustom ? s.customScores[currentCustomMode] : (s[item.key + 'Score'] || 0)}</span>
                        <span class="score-raw-value">${item.raw(r, s, h)}</span>
                    </div>
                </div>`
            }).join('');
            // HALT OVERLAY LOGIC
            const haltedClass = h.isHalted ? 'is-halted' : '';
            const haltedOverlay = h.isHalted ? `
                <div class="fv-halt-overlay">
                    <div class="fv-halt-stamp">HALTED</div>
                </div>
            ` : '';
            cardsHtml += `
                <div class="fv-ticker-card ${haltedClass} ${stock.ticker === selectedTicker ? 'selected' : ''}" data-ticker="${stock.ticker}">
                    ${haltedOverlay}
                    <div class="card-header">
                        <div style="display:flex; align-items:center; gap:0.5em;">
                            <span class="card-rank">#${index + 1}</span>
                            <span class="card-ticker">${stock.ticker}</span>
                        </div>
                        <div class="card-price-block">
                            <span class="card-price" style="color: ${priceColorClass};">$${r.price.toFixed(2)}</span>
                            <div class="card-total-score-mini">Score: <strong>${stock.totalScore}</strong></div>
                        </div>
                     </div>
                    <div class="card-score-grid">${scoreItemsHtml}</div>
                    <div class="card-footer">
                        <div class="card-info-item"><i class="fa-regular fa-newspaper"></i> ${r.newsTime || '-'}</div>
                        <div class="card-info-item" style="color: ${priceColorClass}; font-weight:700;">${changeLabel}: ${formattedMarketChange}</div>
                    </div>
                </div>
            `;
        });
        cardContainer.innerHTML = cardsHtml;

        // --- ATTACH CLICK HANDLER FOR CUSTOM PILL ---
        const customPills = cardContainer.querySelectorAll('.score-custom label');
        customPills.forEach(pill => {
             pill.addEventListener('click', (e) => {
                 e.stopPropagation(); // Stop card selection
                 showCustomMenu(e);
             });
        });
        if (!isManuallySelected && renderList.length > 0) {
            const topTicker = renderList[0].ticker;
            if (topTicker !== selectedTicker) {
                handleTickerSelection(topTicker);
            }
        }
    }

    function showCustomMenu(event) {
        let menu = document.getElementById('fv-custom-score-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'fv-custom-score-menu';
            document.body.appendChild(menu);
        }

        let html = '';
        for (const [key, recipe] of Object.entries(CUSTOM_RECIPES)) {
            const activeClass = key === currentCustomMode ? 'active' : '';
            html += `<div class="fv-menu-item ${activeClass}" data-mode="${key}">
                <div style="font-weight:700;">${recipe.name}</div>
                <div style="font-size:0.85em; opacity:0.7;">${recipe.desc}</div>
            </div>`;
        }
        menu.innerHTML = html;

        const rect = event.target.getBoundingClientRect();
        menu.style.left = `${rect.left}px`;
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.display = 'block';

        menu.querySelectorAll('.fv-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                currentCustomMode = item.dataset.mode;
                GM_setValue(CUSTOM_MODE_KEY, currentCustomMode);
                menu.style.display = 'none';

                // --- UPDATE DROPDOWN LABEL ---
                updateSortDropdown();

                updateDisplay({ candidates: lastCalculatedCandidates });
            });
        });
    }

    // --- HELPER TO UPDATE SORT DROPDOWN LABEL ---
    function updateSortDropdown() {
        const select = document.getElementById('fv-sort-select');
        if(!select) return;
        const customOpt = select.querySelector('option[value="custom"]');
        if(customOpt) {
            customOpt.textContent = `Sort By: ${CUSTOM_RECIPES[currentCustomMode].name} Score`;
        }
    }

    function renderNews(element, data) {
        if (!data.headlines || data.headlines.length === 0) {
            element.innerHTML = `<div class="fv-message">No recent news.</div>`;
            return;
        }
        const keywords = settings.news.positiveKeywords.split(',').map(k => k.trim()).filter(Boolean);
        const keywordRegex = keywords.length > 0 ? new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi') : null;
        element.innerHTML = data.headlines.map(item => {
            const highlighted = keywordRegex ? item.headline.replace(keywordRegex, `<span class="fv-highlight-keyword">$1</span>`) : item.headline;
            return `<a href="${item.link}" target="_blank" class="fv-news-item"><span class="fv-news-time">${item.time}</span><span class="fv-news-headline">${highlighted}</span></a>`;
        }).join('');
    }

    function renderComments(element, data) {
        if (!data.comments || data.comments.length === 0) {
            element.innerHTML = `<div class="fv-message">No comments found.</div>`;
            return;
        }
        element.innerHTML = data.comments.map(comment => {
            const date = new Date(comment.created_at);
            const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            let body = comment.body.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            body = body.replace(/\$([A-Z]{1,6}\b)/g, '<a href="https://stocktwits.com/symbol/$1" target="_blank">$$$1</a>').replace(/@([A-Za-z0-9_]+)/g, '<a href="https://stocktwits.com/$1" target="_blank">@$1</a>');
            return `<div class="fv-comment-item"><img class="fv-comment-avatar" src="${comment.user.avatar_url_ssl}" alt="${comment.user.username}'s avatar"><div class="fv-comment-content"><div class="fv-comment-header"><span class="fv-comment-name">${comment.user.name}</span><span class="fv-comment-username">@${comment.user.username}</span><span class="fv-comment-time">${timeString}</span></div><p class="fv-comment-body">${body}</p></div></div>`;
        }).join('');
    }

    function injectStyles() {
        const fontAwesomeCss = GM_getResourceText('fontAwesomeCSS');
        GM_addStyle(fontAwesomeCss);
        GM_addStyle(UI_COMPONENTS.stylesCSS);
    }

    function initializeControlsToolbar() {
        const toolbar = document.getElementById('fv-controls-toolbar');
        const sortContainer = document.getElementById('fv-sort-controls');
        if(!sortContainer) return;

        const sortOptions = [
            { value: 'none', text: 'None (Default)' }, // NEW: Default to Table Order
            { value: 'totalScore', text: 'Total Score' },
            { value: 'momentum', text: 'Momentum' },
            { value: 'news', text: 'News Score' },
            { value: 'custom', text: `Sort By: ${CUSTOM_RECIPES[currentCustomMode].name} Score` }, // INITIAL LABEL
            { value: 'haltCount', text: 'Halt Count' },
            { value: 'ticker', text: 'Ticker' },
            { value: 'price', text: 'Price' }, { value: 'comment', text: 'Comments' },
            { value: 'relVolChange', text: 'Rel Vol' }, { value: 'priceChange', text: `Perf ${settings.scoring.lookbackWindowMinutes}m` },
            { value: 'lowFloat', text: 'Float' }, { value: 'shortFloat', text: 'Short Float' },
            { value: 'marketCap', text: 'Market Cap' }
        ];
        sortContainer.innerHTML = `
            <div class="fv-control-group">
                <label for="fv-sort-select">Sort By:</label>
                <select id="fv-sort-select">
                    ${sortOptions.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                </select>
                <button id="fv-sort-dir-btn" title="Toggle Sort Direction">
                    <i class="fa-solid fa-arrow-down-wide-short"></i>
                </button>
            </div>
        `;
        const sortSelect = document.getElementById('fv-sort-select');
        const sortDirBtn = document.getElementById('fv-sort-dir-btn');

        sortSelect.value = sortState.column;
        sortDirBtn.innerHTML = sortState.direction === 'desc'
            ? '<i class="fa-solid fa-arrow-down-wide-short"></i>'
            : '<i class="fa-solid fa-arrow-up-wide-short"></i>';
        sortSelect.addEventListener('change', (e) => {
            handleSort(e.target.value, 'desc'); // Default to desc when changing column
            sortDirBtn.innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i>';
        });
        sortDirBtn.addEventListener('click', () => {
            handleSort(sortState.column); // Toggle direction
            sortDirBtn.innerHTML = sortState.direction === 'desc'
                ? '<i class="fa-solid fa-arrow-down-wide-short"></i>'
                : '<i class="fa-solid fa-arrow-up-wide-short"></i>';
        });
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'fv-settings-panel';
        panel.innerHTML = UI_COMPONENTS.settingsPanelHTML;
        document.body.appendChild(panel);

        const tabsContainer = panel.querySelector('.fv-settings-tabs');
        const contentContainer = panel.querySelector('.fv-settings-content');
        const sections = {
            'General': {
                icon: 'fa-solid fa-sliders',
                items: [
                    { id: 'general.scanLimit', type: 'number', label: 'Scan Limit', desc: 'Number of stocks to scan from the top of the list.', opts: { min: 1, max: 50 } },
                    // REMOVED BACKGROUND REFRESH TIMER SETTING
                    { id: 'general.haltScreenerUrl', type: 'text', label: 'Halt Screener URL', desc: 'URL used to detect halted stocks (Background Observer).'},
                    { id: 'general.marketOpenTime', type: 'text', label: 'Market Open Time (ET)', desc: 'The time the market opens in 24-hour format (e.g., 04:00 for 4 AM).', opts: { pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$', placeholder: 'HH:MM' } },
                    { id: 'general.marketCloseTime', type: 'text', label: 'Market Close Time (ET)', desc: 'The time the market closes in 24-hour format (e.g., 20:00 for 8 PM).', opts: { pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$', placeholder: 'HH:MM' } },
                    { id: 'general.overrideMarketHours', type: 'checkbox', label: 'Override Market Hours', desc: 'Forces the script to run even when the market is closed.'},
                    { id: 'general.disqualifiedTickers', type: 'textarea', label: 'Disqualified Tickers List', desc: 'Comma-separated list of tickers to ignore until 9 PM ET.'},
                    { id: 'clear-memory', type: 'button', label: 'Clear Session Memory', desc: 'Manually wipe all stored stock history for this session.'},
                ]
            },
            'Scoring & Thresholds': {
                icon: 'fa-solid fa-calculator',
                items: [
                    { id: 'scoring.lookbackWindowMinutes', type: 'select', label: 'Performance Timeframe', desc: 'Sets the timeframe for scoring. Uses the corresponding "Perf X Min" column for Change scores.', options: [{value: 1, text: 'Perf 1 Min'},{value: 2, text: 'Perf 2 Min'},{value: 3, text: 'Perf 3 Min'},{value: 5, text: 'Perf 5 Min'},{value: 10, text: 'Perf 10 Min'},{value: 15, text: 'Perf 15 Min'}] },
                    { id: 'scoring.commentWeight', type: 'number', label: 'Comment Score Weight', desc: 'Points added per recent comment. Default: 1.0', opts: { min: 0, step: 0.1 } },
                    { id: 'scoring.commentRefetchSeconds', type: 'number', label: 'Comment Refetch (seconds)', desc: 'How often to re-fetch comments for active stocks. Default: 5 seconds', opts: { min: 1 } },
                    { id: 'scoring.relVolChangeThreshold', type: 'number', label: 'Rel Vol Change Threshold', desc: 'Increase in RelVol over the time window needed for +1 score point.', opts: { min: 0.1, step: 0.1 } },
                    { id: 'scoring.priceChangeThreshold', type: 'number', label: 'Price Change Threshold', desc: 'Increase in % Change over the time window needed for +1 score point.', opts: { min: 0.1, step: 0.1 } },
                    { id: 'scoring.newsScoreStep', type: 'number', label: 'News Score Step (%)', desc: 'Percentage increase since news required for +1 score point. Default: 5.0%', opts: { min: 0.5, step: 0.5 } }, // NEW SETTING
                    { id: 'scoring.newsLookbackMinutes', type: 'select', label: 'News Score Timeframe', desc: 'Select the maximum age of news to score. Points decay over this period.', options: [ {value: 1, text: '1 Minute'}, {value: 2, text: '2 Minutes'}, {value: 3, text: '3 Minutes'}, {value: 5, text: '5 Minutes'}, {value: 10, text: '10 Minutes'}, {value: 15, text: '15 Minutes'}, {value: 30, text: '30 Minutes'}, {value: 60, text: '1 Hour'}, {value: 120, text: '2 Hours'}, {value: 240, text: '4 Hours'} ] },
                    { id: 'scoring.newsScanInterval', type: 'number', label: 'News Scan Interval (Seconds)', desc: 'How often to fetch fresh news/chart data. Default: 5s', opts: { min: 2, step: 1 } }, // NEW SETTING
                    { id: 'scoring.shortFloatThreshold', type: 'number', label: 'Short Float Threshold', desc: 'Short float % needed for +1 score point. Default: 10.0', opts: { min: 1, step: 1 } },
                    { id: 'scoring.momentumDivisor', type: 'number', label: 'Momentum Divisor', desc: 'Divides the raw momentum (Change% * Perf%) to keep the score manageable.', opts: { min: 1, step: 1 } },
                ]
            },
            'Bonus Points': {
                icon: 'fa-solid fa-star',
                items: [
                    { id: 'additiveBonuses.lowFloatBonus.0', type: 'number', label: 'Low Float Bonus (<5M)', desc: 'Bonus for float less than 5 million.', opts: { min: 0, step: 1 } },
                    { id: 'additiveBonuses.lowFloatBonus.1', type: 'number', label: 'Low Float Bonus (<10M)', desc: 'Bonus for float less than 10 million.', opts: { min: 0, step: 1 } },
                    { id: 'additiveBonuses.lowFloatBonus.2', type: 'number', label: 'Low Float Bonus (<15M)', desc: 'Bonus for float less than 15 million.', opts: { min: 0, step: 1 } },
                    { id: 'additiveBonuses.marketCapBonus.0', type: 'number', label: 'Market Cap Bonus (<50M)', desc: 'Bonus for market cap less than 50 million.', opts: { min: 0, step: 1 } },
                    { id: 'additiveBonuses.marketCapBonus.1', type: 'number', label: 'Market Cap Bonus (<300M)', desc: 'Bonus for market cap less than 300 million.', opts: { min: 0, step: 1 } },
                    { id: 'additiveBonuses.marketCapBonus.2', type: 'number', label: 'Market Cap Bonus (<500M)', desc: 'Bonus for market cap less than 500 million.', opts: { min: 0, step: 1 } },
                ]
            },
            'Alerts & News': {
                icon: 'fa-solid fa-bell',
                items: [
                    { id: 'redirectAlerts.enabled', type: 'checkbox', label: 'Enable Broker Tab Alert', desc: 'Automatically opens a broker tab when a stock meets the score threshold.'},
                    { id: 'redirectAlerts.minScoreThreshold', type: 'number', label: 'Minimum Score for Alert', desc: 'The minimum score a stock must achieve to trigger an alert.', opts: { min: 0, step: 1 } },
                    { id: 'redirectAlerts.requireHODforAlert', type: 'checkbox', label: 'Require New HOD for Alert', desc: 'If enabled, an alert triggers only on a new high of day. If disabled, an alert triggers as soon as the score threshold is met.'},
                    { id: 'redirectAlerts.redirectUrl', type: 'text', label: 'Broker URL Template', desc: 'The destination URL. Use {ticker} as a placeholder.' },
                    { id: 'news.positiveKeywords', type: 'textarea', label: 'Positive Keywords List', desc: 'Comma-separated words to highlight in the news panel.'},
                ]
            }
        };
        Object.entries(sections).forEach(([title, { icon, items }], index) => {
            const tabId = `fv-tab-${title.replace(/[^a-zA-Z0-9]/g, '-')}`;
            tabsContainer.innerHTML += `<div class="fv-settings-tab ${index === 0 ? 'is-active' : ''}" data-tab="${tabId}"><i class="${icon}"></i><span>${title}</span></div>`;
            let sectionHtml = `<div class="fv-settings-section ${index === 0 ? 'is-active' : ''}" id="${tabId}"><h3>${title}</h3>`;
            items.forEach(item => {
                let controlHtml = '';
                const optsStr = item.opts ? Object.entries(item.opts).map(([k, v]) => `${k}="${v}"`).join(' ') : '';
                const commonLabel = `<div class="fv-setting-item-label"><label for="${item.id}">${item.label}</label><small>${item.desc}</small></div>`;

                if (item.type === 'checkbox') {
                    controlHtml = `${commonLabel}<div class="fv-setting-item-control" style="flex-basis: auto;"><label class="fv-toggle-switch"><input type="checkbox" data-setting="${item.id}"><span class="fv-slider"></span></label></div>`;
                } else if (item.type === 'textarea') {
                    sectionHtml += `<div class="fv-setting-item" style="flex-direction: column; align-items: stretch;">${commonLabel}<div class="fv-setting-item-control" style="width:100%"><textarea data-setting="${item.id}"></textarea></div></div>`;
                    return;
                } else if (item.type === 'button') {
                    controlHtml = `${commonLabel}<div class="fv-setting-item-control"><button class="fv-settings-btn" id="fv-clear-memory-btn">${item.label}</button></div>`;
                } else if (item.type === 'select') {
                    const optionsHtml = item.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
                    controlHtml = `${commonLabel}<div class="fv-setting-item-control"><select data-setting="${item.id}">${optionsHtml}</select></div>`;
                } else {
                    controlHtml = `${commonLabel}<div class="fv-setting-item-control"><input type="${item.type}" data-setting="${item.id}" ${optsStr}></div>`;
                }
                sectionHtml += `<div class="fv-setting-item ${item.type === 'checkbox' ? 'is-toggle' : ''}">${controlHtml}</div>`;
            });
            sectionHtml += `</div>`;
            contentContainer.innerHTML += sectionHtml;
        });

        tabsContainer.addEventListener('click', e => {
            const tab = e.target.closest('.fv-settings-tab');
            if (tab) {
                const tabId = tab.dataset.tab;
                tabsContainer.querySelectorAll('.fv-settings-tab').forEach(t => t.classList.remove('is-active'));
                contentContainer.querySelectorAll('.fv-settings-section').forEach(s => s.classList.remove('is-active'));
                tab.classList.add('is-active');
                document.getElementById(tabId).classList.add('is-active');
            }
        });
        const getNestedValue = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
        const populateForm = (source) => { panel.querySelectorAll('[data-setting]').forEach(input => { const path = input.dataset.setting; const value = getNestedValue(source, path); if (value === undefined) return; if (input.type === 'checkbox') input.checked = value; else input.value = value; });
        };
        document.getElementById('fv-settings-btn').addEventListener('click', (e) => { e.stopPropagation(); populateForm(settings); panel.classList.add('is-visible'); });
        panel.querySelector('.fv-settings-close-btn').addEventListener('click', () => panel.classList.remove('is-visible'));
        panel.querySelector('#fv-settings-reset-all').addEventListener('click', () => { if (confirm('Are you sure you want to reset ALL settings to their defaults? This will save and apply immediately.')) { saveSettings(defaultSettings); populateForm(settings); } });
        // --- NEW SCRAPE-AND-SAVE LOGIC ---
        panel.querySelector('#fv-settings-apply').addEventListener('click', (e) => {
            const oldHaltUrl = settings.general.haltScreenerUrl;
            const newSettings = JSON.parse(JSON.stringify(settings));
            panel.querySelectorAll('[data-setting]').forEach(input => {
                const path = input.dataset.setting;
                let value;
                if (input.type === 'checkbox') {
                    value = input.checked;
                } else if (input.type === 'number' || input.tagName === 'SELECT') {
                    value = Number(input.value); // Ensure it's a number
                } else {
                    value = input.value;
                }
                const keys = path.split('.');
                let current = newSettings;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
            });

            // Check if Halt URL changed
            if (oldHaltUrl !== newSettings.general.haltScreenerUrl) {
                console.log('[Finviz Dashboard] Halt URL changed. Respawning monitor...');
                viewManager.closeView('halt-monitor');
                // The next loop will automatically reopen it, but we can force it here or just save
            }

            saveSettings(newSettings);
            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = 'Settings Applied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });

        const clearMemoryBtn = panel.querySelector('#fv-clear-memory-btn');
        if (clearMemoryBtn) { clearMemoryBtn.addEventListener('click', (e) => { if (confirm('Are you sure you want to clear all of the script\'s session memory?')) { clearScriptMemory(); const btn = e.target; btn.textContent = 'Memory Cleared!'; setTimeout(() => { btn.textContent = 'Clear Session Memory'; }, 2000); } });
        }
    }

    async function primeData() {
        console.log('[Finviz Dashboard] Priming data with initial scan...');
        const rows = Array.from(document.querySelectorAll('table.screener_table tr.styled-row')).slice(0, settings.general.scanLimit);
        if (rows.length === 0) return;
        const columnIndexes = findColumnIndexes(rows[0].closest('table'));

        scrapeAndStoreData(rows, columnIndexes);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const currentRows = Array.from(document.querySelectorAll('table.screener_table tr.styled-row')).slice(0, settings.general.scanLimit);
        scrapeAndStoreData(currentRows, columnIndexes);
        console.log('[Finviz Dashboard] Data priming complete.');
    }

    // --- MAIN REACTIVE LOOP (Replaces Timer) ---
    async function handleTableUpdate() {
        if (updateDebounce) clearTimeout(updateDebounce);
        updateDebounce = setTimeout(async () => {
             await runUpdateCycle();
        }, 300);
        // 300ms Debounce to prevent rapid-fire updates
    }


    function startCommentRefreshLoop() {
        setInterval(async () => {
            if (isScriptActive && Object.keys(stockDataHistory).length > 0) {
                await fetchAllMissingComments();
                // --- MOVED PRUNING HERE FOR INDEPENDENCE ---
                commentHistory = pruneCommentHistory(commentHistory);
            }
        }, (settings.scoring.commentRefetchSeconds || 5) * 1000);
    }

    // --- NO MORE BACKGROUND TIMER FUNCTION ---
    // The MutationObserver now drives the entire "Live" aspect.
    async function init() {
        loadSettings();
        scheduleAutomaticWipes();
        injectStyles();
        createDisplayPanels();
        ensureHaltMonitor();
        // Ensure this is created ASAP

        // --- FIX: LOAD HALT COUNTS FROM STORAGE ---
        try {
            const savedHalts = JSON.parse(GM_getValue(HALT_DATA_KEY, '{}'));
            haltTracking = savedHalts;
            console.log(`[Finviz Dashboard] Loaded halt tracking for ${Object.keys(haltTracking).length} tickers.`);
        } catch (e) {
            console.error("[Finviz Dashboard] Error loading halt tracking:", e);
            haltTracking = {};
        }

        updateDisplay({ state: 'scanning' });

        const savedDashboardState = JSON.parse(GM_getValue(DASHBOARD_STATE_KEY, '{}'));
        if (savedDashboardState.isVisible) {
            document.getElementById('fv-fullscreen-container').classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }

        console.log('[Finviz Dashboard] Waiting for screener table to load...');
        await waitForElement('table.screener_table tr.styled-row');
        console.log('[Finviz Dashboard] Screener table found. Initializing scan.');

        await primeData();
        await fetchAllMissingComments();
        // Trigger ONE initial run manually, then let Observer take over
        handleTableUpdate();

        startCommentRefreshLoop();
        const screenerTable = document.getElementById('screener-views-table');
        if (screenerTable) {
            // THE ENGINE: MutationObserver triggers the update cycle on table change
            const observer = new MutationObserver(() => {
                isManuallySelected = false;
                handleTableUpdate();
            });
            observer.observe(screenerTable, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-value'] });
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();