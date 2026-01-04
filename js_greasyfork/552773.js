// ==UserScript==
// @name         Stake Wheel Bot
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Advanced Wheel Bot for Stake.us and Stake.com with a resizable UI, intelligent triggers, notifications, and enhanced strategy options.
// @author       shdw_lol (Adapted by Gemini)
// @license      MIT
// @match        *://stake.com/casino/games/wheel*
// @match        *://stake.com/*/casino/games/wheel*
// @match        *://stake.ac/casino/games/wheel*
// @match        *://stake.ac/*/casino/games/wheel*
// @match        *://stake.games/casino/games/wheel*
// @match        *://stake.games/*/casino/games/wheel*
// @match        *://stake.bet/casino/games/wheel*
// @match        *://stake.bet/*/casino/games/wheel*
// @match        *://stake.pink/casino/games/wheel*
// @match        *://stake.pink/*/casino/games/wheel*
// @match        *://stake.mba/casino/games/wheel*
// @match        *://stake.mba/*/casino/games/wheel*
// @match        *://stake.jp/casino/games/wheel*
// @match        *://stake.jp/*/casino/games/wheel*
// @match        *://stake.bz/casino/games/wheel*
// @match        *://stake.bz/*/casino/games/wheel*
// @match        *://stake.ceo/casino/games/wheel*
// @match        *://stake.ceo/*/casino/games/wheel*
// @match        *://stake.krd/casino/games/wheel*
// @match        *://stake.krd/*/casino/games/wheel*
// @match        *://staketr.com/casino/games/wheel*
// @match        *://staketr.com/*/casino/games/wheel*
// @match        *://stake.us/casino/games/wheel*
// @match        *://stake.us/*/casino/games/wheel*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552773/Stake%20Wheel%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/552773/Stake%20Wheel%20Bot.meta.js
// ==/UserScript==

// --- DISCLAIMER ---
// This script interacts with the Stake API to perform actions like changing your game seed.
// To do this, it needs to use your account's session token. This token is retrieved from your browser's
// storage (cookies or local storage) and is ONLY sent back to Stake's official servers.
// It is never sent to any third-party server or stored outside of your browser.
// The password feature uses SHA-256 hashing and stores the result in your browser's local storage.
// It is never transmitted over the network.

(function() {
    'use strict';

    // --- CONFIGURATION & STATE ---

    const state = {
        running: false,
        isLocked: false,
        baseBet: 0.01,
        currentBet: 0.01,
        betCount: 0,
        totalProfit: 0,
        winStreak: 0,
        lossStreak: 0,
        lastBetWasWin: null,
        strategyFlags: {}, // For stateful conditions like 'firstStreakOf'
        persistentTriggerStates: {}, // For tracking profit/time based one-time actions
        lastWinTimestamp: 0,
        outcomeHistory: '', // String of 'W' and 'L'
        originalAutoStrategy: null,
        originalBetDelay: null,
        apiBlockStartTime: 0,
        stackingDelay: 0,
    };

    const semiAutoState = {
        currentBet: 0.01,
        isStarted: false,
    };

    let advancedStrategies = {};
    let isPickingElement = false;
    let logEntries = [];
    let isBotInitialized = false;
    let storedUsername = '';
    let storedPasswordHash = '';
    let pendingAction = null;

    const logFilters = {
        system: true,
        manual: true,
        auto: true,
        strategy: true,
    };

    // --- CONFIG & SELECTORS ---
    let CONFIG = {
        authToken: '',
        seedChangeEndpoint: '/_api/graphql',
        betButton: '[data-testid="bet-button"]',
        amountInput: '[data-testid="input-game-amount"]',
        riskSelect: '[data-testid="risk-select"]',
        segmentsSelect: '[data-testid="segments-select"]',
        betDelay: '100',
        maxBetAmount: 0,
        lossMultiplier: 1,
        pastBetsContainer: '.past-bets',
        autoTab: '[data-testid="auto-tab"]',
        manualTab: '[data-testid="manual-tab"]',
        uiScale: 100,
    };

    const CONFIG_FRIENDLY_NAMES = {
        authToken: "Auth Token",
        seedChangeEndpoint: "API Endpoint",
        betButton: "Bet Button",
        amountInput: "Amount Input",
        riskSelect: "Risk/Difficulty Select",
        segmentsSelect: "Segments Select",
        betDelay: "Bet Delay Range (ms)",
        maxBetAmount: "Max Bet Amount (0=off)",
        lossMultiplier: "Loss Threshold (> is Win)",
        pastBetsContainer: "Past Bets List",
        autoTab: "Auto Tab Button",
        manualTab: "Manual Tab Button",
        uiScale: "UI Scale (%)",
    };

    // --- UI (HTML & CSS) ---

    const botHtml = `
        <div id="bot-notification-container"></div>
        <div id="wheel-bot-window" class="bot-window">
            <div class="resizer resizer-t"></div>
            <div class="resizer resizer-r"></div>
            <div class="resizer resizer-b"></div>
            <div class="resizer resizer-l"></div>
            <div class="resizer resizer-tl"></div>
            <div class="resizer resizer-tr"></div>
            <div class="resizer resizer-br"></div>
            <div class="resizer resizer-bl"></div>
            <div id="bot-header" class="bot-header">
                <span>Stake Wheel Bot <span id="bot-status-indicator"></span> <span id="profit-loss-display"></span></span>
                <div class="window-controls">
                    <button id="minimize-btn" class="window-btn" title="Minimize">—</button>
                    <button id="close-btn" class="window-btn" title="Close">×</button>
                </div>
            </div>
            <div id="bot-main-content" class="bot-content">
                <div class="bot-tabs">
                    <button class="bot-tab-btn active" data-tab="semi-auto">Manual</button>
                    <button class="bot-tab-btn" data-tab="main">Auto</button>
                    <button class="bot-tab-btn" data-tab="advanced">Advanced</button>
                    <button class="bot-tab-btn" data-tab="log">Log</button>
                    <button class="bot-tab-btn" data-tab="config">Config</button>
                    <button class="bot-tab-btn" data-tab="admin">Admin</button>
                </div>
                <div id="tab-semi-auto" class="bot-tab-content active">
                    <div class="bot-input-group"><label>Base Amount</label><input type="number" id="semi-auto-base-bet" class="bot-input" value="0.01" step="any"></div>
                    <div class="bot-input-group"><label>Strategy</label><select id="semi-auto-strategy" class="bot-input"><option value="none" selected>None (Manual Betting)</option></select></div>
                    <p id="semi-auto-desc" class="strategy-desc">Select a custom strategy or use manual betting.</p>
                    <button id="semi-auto-step-btn" class="bot-btn bot-btn-primary" title="Run a single bet (D)">Run Step (D)</button>
                    <button id="semi-auto-reset-btn" class="bot-btn bot-btn-danger" title="Reset bet amount to base (R)">Reset to Base (R)</button>
                    <button id="manual-change-seed-btn" class="bot-btn bot-btn-secondary" title="Test the API seed change feature">Change Seed (API)</button>
                </div>
                <div id="tab-main" class="bot-tab-content">
                    <div class="bot-input-group"><label>Base Amount</label><input type="number" id="base-bet" class="bot-input" value="0.01" step="any"></div>
                    <div class="bot-input-group"><label>Difficulty</label><select id="auto-risk" class="bot-input"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div>
                    <div class="bot-input-group"><label>Segments</label><select id="auto-segments" class="bot-input"><option value="10" selected>10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option><option value="50">50</option></select></div>
                    <div class="bot-input-group"><label>Strategy</label><select id="auto-strategy-select" class="bot-input"><option value="none">None (No auto changes)</option></select></div>
                    <button id="start-stop-btn" class="bot-btn bot-btn-primary" title="Starts or stops the bot (S)">Start Auto (S)</button>
                </div>
                <div id="tab-advanced" class="bot-tab-content">
                    <div class="bot-input-group">
                        <label>Your Saved Strategies</label>
                        <select id="advanced-strategy-list" class="bot-input"></select>
                    </div>
                    <div class="btn-grid">
                        <button id="create-strategy-btn" class="bot-btn bot-btn-secondary">Create New</button>
                        <button id="edit-strategy-btn" class="bot-btn bot-btn-secondary">Edit Selected</button>
                        <button id="import-strategy-btn" class="bot-btn bot-btn-secondary">Import</button>
                        <button id="export-strategy-btn" class="bot-btn bot-btn-secondary">Export Selected</button>
                    </div>
                    <button id="delete-strategy-btn" class="bot-btn bot-btn-danger">Delete Selected</button>
                </div>
                <div id="tab-log" class="bot-tab-content">
                    <div id="log-filters">
                        <label><input type="checkbox" data-filter="system" checked> System</label>
                        <label><input type="checkbox" data-filter="manual" checked> Manual</label>
                        <label><input type="checkbox" data-filter="auto" checked> Auto</label>
                        <label><input type="checkbox" data-filter="strategy" checked> Strategy</label>
                    </div>
                    <div id="log-container"></div>
                    <div class="btn-grid">
                        <button id="reset-stats-btn" class="bot-btn bot-btn-danger">Reset Stats</button>
                        <button id="save-log-btn" class="bot-btn bot-btn-secondary">Save Log to File</button>
                    </div>
                </div>
                <div id="tab-config" class="bot-tab-content">
                    <p class="strategy-desc">Configure API settings and UI element selectors. The bot tries to find the Auth Token automatically.</p>
                    <div id="config-container"></div>
                    <button id="save-config-btn" class="bot-btn bot-btn-primary">Save Config</button>
                    <button id="reset-config-btn" class="bot-btn bot-btn-danger">Reset to Defaults</button>
                </div>
                <div id="tab-admin" class="bot-tab-content">
                    <p class="strategy-desc">Set a password to lock bot settings. When locked, only the Manual and Admin tabs are usable.</p>
                    <div class="bot-input-group">
                        <label>Username</label>
                        <input type="text" id="admin-username" class="bot-input" autocomplete="username">
                    </div>
                    <div class="bot-input-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input type="password" id="admin-password" class="bot-input" autocomplete="new-password">
                    </div>
                    <button id="save-credentials-btn" class="bot-btn bot-btn-secondary">Save Credentials</button>
                    <hr>
                    <button id="lock-unlock-btn" class="bot-btn bot-btn-primary">Lock</button>
                    <p id="admin-status" class="strategy-desc" style="margin-top: 15px; text-align: center;"></p>
                </div>
            </div>
        </div>

        <div id="wheel-bot-minimized-bar" style="display: none;">
            <span>Stake Wheel Bot</span>
            <div class="window-controls">
                <button id="maximize-btn" class="window-btn" title="Maximize">□</button>
                <button id="close-minimized-btn" class="window-btn" title="Close">×</button>
            </div>
        </div>

        <div id="strategy-modal" style="display: none;">
            <div id="strategy-modal-content">
                <h3 id="strategy-modal-title">Create Strategy</h3>
                <div class="bot-input-group"><label>Strategy Name</label><input type="text" id="strategy-name" class="bot-input"></div>
                <div id="strategy-rules-container"></div>
                <button id="add-rule-btn" class="bot-btn bot-btn-secondary">Add Condition Block</button>
                <hr>
                <p id="strategy-modal-warning" style="color: var(--accent-red); text-align: center; display: none;"></p>
                <button id="save-strategy-btn" class="bot-btn bot-btn-primary">Save Strategy</button>
                <button id="cancel-strategy-btn" class="bot-btn bot-btn-danger">Cancel</button>
            </div>
        </div>
        <div id="password-prompt-modal" style="display: none;">
            <div id="password-prompt-content">
                <h3>Password Required</h3>
                <p id="password-prompt-message">Please enter the password to unlock this feature.</p>
                <div class="bot-input-group">
                    <label>Password</label>
                    <input type="password" id="prompt-password-input" class="bot-input" autocomplete="current-password">
                </div>
                <p id="password-prompt-error" style="color: var(--accent-red); display: none;"></p>
                <button id="password-prompt-submit" class="bot-btn bot-btn-primary">Submit</button>
                <button id="password-prompt-cancel" class="bot-btn bot-btn-secondary">Cancel</button>
            </div>
        </div>
        <div id="element-picker-overlay"></div>
        <div id="element-picker-tooltip">Click an element to select it. Press ESC to cancel.</div>
    `;

    const botCss = `
        :root { --bg-primary: #0F212E; --bg-secondary: #213743; --bg-tertiary: #1a2c38; --accent-green: #00b373; --accent-red: #e53e3e; --accent-yellow: #FFC107; --text-primary: #fff; --text-secondary: #b1bad3; }
        .bot-window { position: fixed; top: 100px; right: 20px; width: 380px; min-width: 350px; max-width: 800px; height: 550px; min-height: 400px; max-height: 90vh; background-color: var(--bg-primary); border-radius: 8px; z-index: 9999; color: var(--text-primary); font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; }
        .bot-header { padding: 10px 15px; cursor: move; background-color: var(--bg-secondary); font-weight: 600; user-select: none; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        #bot-status-indicator { font-weight: normal; font-size: 12px; opacity: 0.8; margin-left: 8px; }
        #profit-loss-display { font-weight: 600; font-size: 12px; margin-left: 10px; }
        #profit-loss-display.profit { color: var(--accent-green); }
        #profit-loss-display.loss { color: var(--accent-red); }
        .window-controls { display: flex; gap: 8px; align-items: center; }
        .window-btn { background: none; border: none; color: var(--text-secondary); font-size: 20px; cursor: pointer; line-height: 1; padding: 0 5px; font-family: sans-serif; display: flex; align-items: center; justify-content: center; }
        .window-btn:hover { color: var(--text-primary); }
        #maximize-btn { font-size: 16px; }
        .bot-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
        .bot-tabs { display: flex; margin-bottom: 15px; background-color: var(--bg-primary); border-radius: 20px; padding: 4px; border: 1px solid var(--bg-secondary); flex-shrink: 0; }
        .bot-tab-btn { flex: 1; padding: 8px; cursor: pointer; background: transparent; border: none; color: var(--text-secondary); border-radius: 20px; font-weight: 500; transition: all 0.2s ease-in-out; font-size: 13px; white-space: nowrap; }
        .bot-tab-btn.active { background-color: var(--bg-secondary); color: var(--text-primary); }
        .bot-tabs.locked .bot-tab-btn:not([data-tab="semi-auto"]):not([data-tab="admin"]) { pointer-events: none; opacity: 0.5; }
        .bot-tab-content { display: none; }
        .bot-tab-content.active { display: flex; flex-grow: 1; flex-direction: column; }
        #tab-config { overflow-y: auto; }
        .bot-input-group { margin-bottom: 12px; display: flex; flex-direction: column; }
        .bot-input-group label { margin-bottom: 5px; font-size: 14px; color: #b1bad3; }
        .bot-input { width: 100%; padding: 8px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; color: #fff; box-sizing: border-box; }
        .bot-input:disabled { background-color: #2a414f; opacity: 0.7; }
        #on-win-loss-container.disabled { opacity: 0.5; pointer-events: none; }
        .bot-btn { width: 100%; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600; margin-top: 10px; }
        .bot-btn:disabled { background-color: #4A5568; cursor: not-allowed; opacity: 0.7; }
        .bot-btn-primary { background-color: var(--accent-green); color: #fff; }
        .bot-btn-danger { background-color: var(--accent-red); color: #fff; }
        .bot-btn-secondary { background-color: var(--bg-secondary); color: #fff; }
        .strategy-desc { font-size: 12px; color: #b1bad3; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; margin: 5px 0 15px 0; }
        #config-container { background-color: var(--bg-primary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; }
        #log-container { flex-grow: 1; overflow-y: auto; padding-right: 5px; background-color: var(--bg-primary); border: 1px solid var(--bg-secondary); border-radius: 4px; padding: 8px; font-size: 12px; line-height: 1.5; }
        #log-container p { margin: 0 0 5px 0; padding: 2px 4px; border-radius: 3px; }
        #log-container p.log-manual { color: var(--accent-green); }
        #log-container p.log-auto { color: var(--accent-red); }
        #log-container p.log-strategy { color: var(--accent-yellow); }
        #log-container p b { font-weight: 900; }
        #log-filters { display: flex; gap: 15px; margin-bottom: 10px; background-color: var(--bg-secondary); padding: 8px; border-radius: 4px; }
        #log-filters label { display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer; }
        #wheel-bot-minimized-bar { position: fixed; top: 100px; right: 20px; background-color: var(--bg-secondary); border-radius: 8px; z-index: 9999; color: #fff; font-family: 'Inter', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; justify-content: space-between; align-items: center; padding: 8px 12px; cursor: move; }
        #wheel-bot-minimized-bar span { font-weight: 600; user-select: none; }
        .config-group { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
        .config-group label { font-size: 12px; color: #b1bad3; flex-basis: 140px; flex-shrink: 0; display: flex; align-items: center; }
        .config-group .input-wrapper { display: flex; align-items: center; flex-grow: 1; position: relative; }
        .config-group input { flex-grow: 1; font-size: 11px; }
        .config-group input[type=text] { padding-right: 30px; }
        .config-group input.invalid-range { border-color: var(--accent-red) !important; }
        .config-range-wrapper { display: flex; align-items: center; gap: 5px; width: 100%; }
        .config-range-wrapper input { flex-grow: 1; text-align: center; }
        .config-range-wrapper span { color: #b1bad3; font-size: 11px; }
        .config-pick-btn, .config-toggle-vis-btn { padding: 6px 8px; font-size: 10px; flex-shrink: 0; background-color: #4A5568; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .config-toggle-vis-btn { position: absolute; right: 1px; top: 1px; bottom: 1px; background-color: var(--bg-secondary); padding: 0 8px; }
        .config-toggle-vis-btn svg { width: 16px; height: 16px; pointer-events: none; }
        .config-tooltip-trigger { display: inline-block; margin-left: 8px; background-color: var(--accent-yellow); color: var(--bg-primary); border-radius: 50%; width: 16px; height: 16px; text-align: center; line-height: 16px; font-weight: bold; cursor: help; position: relative; font-size: 12px; }
        .config-tooltip-trigger .tooltip-text { visibility: hidden; width: 220px; background-color: var(--bg-secondary); color: #fff; text-align: center; border-radius: 6px; padding: 8px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -110px; opacity: 0; transition: opacity 0.3s; font-weight: normal; font-size: 11px; }
        .config-tooltip-trigger:hover .tooltip-text { visibility: visible; opacity: 1; }
        #element-picker-overlay { position: fixed; background-color: rgba(0, 179, 115, 0.3); border: 2px solid var(--accent-green); z-index: 10000; pointer-events: none; display: none; transition: all 0.1s linear; }
        #element-picker-tooltip { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: black; color: white; padding: 10px 20px; border-radius: 5px; z-index: 10001; display: none; }
        #strategy-modal, #password-prompt-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center; }
        #strategy-modal-content, #password-prompt-content { background: var(--bg-primary); padding: 20px; border-radius: 8px; border: 1px solid var(--bg-secondary); width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        #strategy-modal-content > .bot-input-group, #strategy-modal-content > .bot-btn, #strategy-modal-content > hr { margin: 0; }
        #password-prompt-content { max-width: 380px; text-align: center; }
        #strategy-rules-container { overflow-y: auto; flex-grow: 1; min-height: 0; }
        .strategy-rule { background: var(--bg-secondary); padding: 8px; border-radius: 4px; margin-bottom: 8px; }
        .strategy-rule-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .strategy-rule-summary { display: flex; gap: 5px; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .strategy-rule-summary span { font-size: 13px; }
        .strategy-rule-summary .summary-action { color: var(--accent-yellow); }
        .strategy-rule-controls { display: flex; align-items: center; }
        .strategy-rule-editor { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--bg-primary); }
        .strategy-rule.expanded .strategy-rule-editor { display: block; }
        .strategy-rule.expanded .strategy-rule-summary { display: none; }
        .rule-toggle-group { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
        .rule-toggle-group label { background: var(--bg-primary); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .rule-toggle-group input { display: none; }
        .rule-toggle-group input:checked + label { background: var(--accent-green); color: white; }
        .rule-sentence { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; margin-bottom: 8px; }
        .rule-sentence span { font-size: 13px; }
        .rule-sentence .bot-input { width: auto; flex-grow: 1; min-width: 80px; padding: 4px 6px; }
        .action-sentence .action-type { width: 180px; flex-grow: 0; flex-shrink: 0; }
        .rule-sentence .bot-input[type=number] { max-width: 100px; }
        .remove-btn, .move-btn { color: #fff; cursor: pointer; font-weight: bold; background: none; border: none; font-size: 18px; padding: 0 5px; }
        .remove-btn { color: var(--accent-red); }
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        hr { border: none; border-top: 1px solid var(--bg-secondary); margin: 15px 0; }
        .resizer { position: absolute; z-index: 10; }
        .resizer-r { cursor: e-resize; height: 100%; width: 5px; right: 0; top: 0; }
        .resizer-l { cursor: w-resize; height: 100%; width: 5px; left: 0; top: 0; }
        .resizer-b { cursor: s-resize; height: 5px; width: 100%; right: 0; bottom: 0; }
        .resizer-t { cursor: n-resize; height: 5px; width: 100%; left: 0; top: 0; }
        .resizer-br { cursor: se-resize; height: 15px; width: 15px; right: 0; bottom: 0; }
        .resizer-bl { cursor: sw-resize; height: 15px; width: 15px; left: 0; bottom: 0; }
        .resizer-tr { cursor: ne-resize; height: 15px; width: 15px; right: 0; top: 0; }
        .resizer-tl { cursor: nw-resize; height: 15px; width: 15px; left: 0; top: 0; }
        .resizer-br::after { content: ''; position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 0 12px 12px; border-color: transparent transparent rgba(177, 186, 211, 0.2) transparent; pointer-events: none; }
        #bot-notification-container { position: fixed; top: 20px; right: 20px; z-index: 10005; display: flex; flex-direction: column; gap: 10px; }
        .bot-notification { background-color: var(--bg-secondary); color: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); width: 300px; opacity: 0; transform: translateX(100%); animation: slideIn 0.5s forwards; }
        .bot-notification.fade-out { animation: slideOut 0.5s forwards; }
        .bot-notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .bot-notification-header span { font-weight: bold; }
        .bot-notification-header .close-btn { background: none; border: none; color: #b1bad3; font-size: 20px; cursor: pointer; line-height: 1; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
    `;

    // --- CORE LOGIC ---

    function init() {
        if (isBotInitialized) return;
        isBotInitialized = true;

        loadConfig();
        loadStrategies();

        document.body.insertAdjacentHTML('beforeend', botHtml);
        GM_addStyle(botCss);
        document.getElementById('wheel-bot-window').style.display = 'flex';

        applyUiScale();
        loadSecurityConfig();
        populateConfigTab();
        populateStrategyDropdowns();
        setupEventListeners();
        makeDraggable(document.getElementById('wheel-bot-window'), document.getElementById('bot-header'));
        makeDraggable(document.getElementById('wheel-bot-minimized-bar'), document.getElementById('wheel-bot-minimized-bar'));
        makeResizable(document.getElementById('wheel-bot-window'));

        log("Bot UI Initialized. Waiting for game interface...", "system");
        waitForGameAndEnable();
        updateSemiAutoDescription();
        updateProfitDisplay();

        if (storedPasswordHash) {
            lockUI();
        } else {
            updateAdminStatus("No password set. Bot is unlocked.", "info");
        }
    }

    function setupEventListeners() {
        // Window Controls
        document.getElementById('minimize-btn').addEventListener('click', minimizeBot);
        document.getElementById('close-btn').addEventListener('click', closeBot);
        document.getElementById('maximize-btn').addEventListener('click', maximizeBot);
        document.getElementById('close-minimized-btn').addEventListener('click', closeBot);

        // Tab switching
        document.querySelectorAll('.bot-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (state.isLocked && e.currentTarget.dataset.tab !== 'semi-auto' && e.currentTarget.dataset.tab !== 'admin') {
                    promptForPassword(unlockUI);
                    return;
                }
                const tabName = e.currentTarget.dataset.tab;
                document.querySelectorAll('.bot-tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.querySelectorAll('.bot-tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === `tab-${tabName}`);
                });
            });
        });

        // Main controls
        document.getElementById('start-stop-btn').addEventListener('click', toggleBot);
        document.getElementById('semi-auto-step-btn').addEventListener('click', runSemiAutoStep);
        document.getElementById('semi-auto-reset-btn').addEventListener('click', resetSemiAutoProgression);
        document.getElementById('manual-change-seed-btn').addEventListener('click', handleManualSeedChange);
        document.getElementById('semi-auto-strategy').addEventListener('change', updateSemiAutoDescription);

        // Config tab
        document.getElementById('save-config-btn').addEventListener('click', saveConfig);
        document.getElementById('reset-config-btn').addEventListener('click', resetConfigToDefault);

        // Log Tab
        document.getElementById('save-log-btn').addEventListener('click', saveLogToFile);
        document.getElementById('reset-stats-btn').addEventListener('click', resetState);

        // Advanced Strategy tab
        document.getElementById('create-strategy-btn').addEventListener('click', () => openStrategyModal());
        document.getElementById('edit-strategy-btn').addEventListener('click', editSelectedStrategy);
        document.getElementById('delete-strategy-btn').addEventListener('click', deleteSelectedStrategy);
        document.getElementById('import-strategy-btn').addEventListener('click', importStrategy);
        document.getElementById('export-strategy-btn').addEventListener('click', exportSelectedStrategy);
        document.getElementById('save-strategy-btn').addEventListener('click', saveStrategy);
        document.getElementById('cancel-strategy-btn').addEventListener('click', () => document.getElementById('strategy-modal').style.display = 'none');
        document.getElementById('add-rule-btn').addEventListener('click', () => addRuleToModal());

        // Admin tab
        document.getElementById('save-credentials-btn').addEventListener('click', saveCredentials);
        document.getElementById('lock-unlock-btn').addEventListener('click', handleLockUnlock);

        // Password Prompt
        document.getElementById('password-prompt-submit').addEventListener('click', handleSubmitPassword);
        document.getElementById('password-prompt-cancel').addEventListener('click', () => document.getElementById('password-prompt-modal').style.display = 'none');

        // Log Filters
        document.getElementById('log-filters').addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                logFilters[e.target.dataset.filter] = e.target.checked;
                applyLogFilters();
            }
        });

        document.addEventListener('keydown', handleKeydown);
    }

    function toggleBot() {
        if (state.running) { // Stopping
            state.running = false;
            const btn = document.getElementById('start-stop-btn');
            btn.textContent = 'Start Auto (S)';
            btn.classList.replace('bot-btn-danger', 'bot-btn-primary');
            updateStatus('Stopped');
            log("Auto betting stopped.", "auto");
            updateInputDisabledState();
            if (state.originalAutoStrategy) {
                document.getElementById('auto-strategy-select').value = state.originalAutoStrategy;
                document.getElementById('semi-auto-strategy').value = state.originalAutoStrategy;
                state.originalAutoStrategy = null;
            }
        } else { // Starting
            state.running = true;
            state.originalAutoStrategy = document.getElementById('auto-strategy-select').value;
            const btn = document.getElementById('start-stop-btn');
            btn.textContent = 'Stop Auto (S)';
            btn.classList.replace('bot-btn-primary', 'bot-btn-danger');
            updateStatus('Auto Running...');
            updateInputDisabledState();
            startBot();
        }
    }

    // --- WINDOW CONTROLS ---
    function minimizeBot() {
        document.getElementById('wheel-bot-window').style.display = 'none';
        document.getElementById('wheel-bot-minimized-bar').style.display = 'flex';
    }

    function maximizeBot() {
        document.getElementById('wheel-bot-window').style.display = 'flex';
        document.getElementById('wheel-bot-minimized-bar').style.display = 'none';
    }

    function closeBot() {
        document.getElementById('wheel-bot-window').style.display = 'none';
        document.getElementById('wheel-bot-minimized-bar').style.display = 'none';
        log("Bot window closed. Refresh the page to reopen.", "system");
    }


    // --- SECURITY & ADMIN ---

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadSecurityConfig() {
        storedUsername = localStorage.getItem('stakeWheelBotUser') || '';
        storedPasswordHash = localStorage.getItem('stakeWheelBotPassHash') || '';
        document.getElementById('admin-username').value = storedUsername;
    }

    async function saveCredentials() {
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        const newUsername = usernameInput.value.trim();
        const newPassword = passwordInput.value;

        const performSave = async () => {
            if (newUsername !== storedUsername) {
                storedUsername = newUsername;
                localStorage.setItem('stakeWheelBotUser', storedUsername);
                log("Username updated.", "system");
            }
            if (newPassword) {
                storedPasswordHash = await hashPassword(newPassword);
                localStorage.setItem('stakeWheelBotPassHash', storedPasswordHash);
                passwordInput.value = '';
                log("Password updated.", "system");
                updateAdminStatus("Password updated. You can now lock the bot.", "info");
            }
            showNotification('Credentials saved!');
        };

        if (newPassword && storedPasswordHash) {
            promptForPassword(performSave, "Enter your CURRENT password to save changes.");
        } else {
            await performSave();
        }
    }

    function handleLockUnlock() {
        if (state.isLocked) {
            promptForPassword(unlockUI);
        } else {
            if (!storedPasswordHash) {
                showNotification("Please set a password before locking.");
                return;
            }
            lockUI();
        }
    }

    function lockUI() {
        state.isLocked = true;
        document.querySelector('.bot-tab-btn[data-tab="semi-auto"]').click();
        document.querySelector('.bot-tabs').classList.add('locked');
        const lockBtn = document.getElementById('lock-unlock-btn');
        lockBtn.textContent = "Unlock";
        lockBtn.classList.replace('bot-btn-primary', 'bot-btn-danger');
        updateAdminStatus(`Locked by ${storedUsername || 'Admin'}. UI is restricted.`, "locked");
        log("Bot settings locked.", "system");
    }

    function unlockUI() {
        state.isLocked = false;
        document.querySelector('.bot-tabs').classList.remove('locked');
        const lockBtn = document.getElementById('lock-unlock-btn');
        lockBtn.textContent = "Lock";
        lockBtn.classList.replace('bot-btn-danger', 'bot-btn-primary');
        updateAdminStatus("Bot is unlocked. Settings are editable.", "unlocked");
        log("Bot settings unlocked.", "system");
    }

    function promptForPassword(onSuccess, message = "Please enter the password to unlock this feature.") {
        pendingAction = onSuccess;
        const modal = document.getElementById('password-prompt-modal');
        modal.querySelector('#password-prompt-message').textContent = message;
        modal.querySelector('#prompt-password-input').value = "";
        modal.querySelector('#password-prompt-error').style.display = 'none';
        modal.style.display = 'flex';
        modal.querySelector('#prompt-password-input').focus();
    }

    async function handleSubmitPassword() {
        const password = document.getElementById('prompt-password-input').value;
        const hash = await hashPassword(password);
        if (hash === storedPasswordHash) {
            document.getElementById('password-prompt-modal').style.display = 'none';
            if (typeof pendingAction === 'function') {
                pendingAction();
            }
            pendingAction = null;
        } else {
            const errorEl = document.getElementById('password-prompt-error');
            errorEl.textContent = "Incorrect password. Please try again.";
            errorEl.style.display = 'block';
        }
    }

    function updateAdminStatus(text, status) {
        const statusEl = document.getElementById('admin-status');
        statusEl.textContent = text;
        statusEl.style.color = status === 'locked' ? 'var(--accent-red)' : status === 'unlocked' ? 'var(--accent-green)' : '#b1bad3';
    }


    // --- API & NETWORK LOGIC ---

    function getAuthToken() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('x-access-token')) {
                    const value = localStorage.getItem(key);
                    if (typeof value === 'string' && value.split('.').length === 3 && value.startsWith('ey')) {
                        console.log(`Auto-detected auth token in localStorage key: "${key}"`);
                        return JSON.parse(value);
                    }
                }
            }
            const cookieToken = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1];
            if (cookieToken) {
                console.log("Auto-detected auth token from cookie.");
                return cookieToken;
            }
        } catch (e) {
            console.error("Error retrieving auth token", e);
        }
        console.warn("Could not auto-detect auth token.");
        return '';
    }

    async function changeSeedProgrammatically() {
        updateStatus("Changing Seed...");
        log("Attempting to change seed via API...", "strategy");
        const token = CONFIG.authToken;
        if (!token) {
            updateStatus("Error: Auth Token not found!");
            log("Seed change failed: Auth Token missing.", "error");
            return false;
        }
        const newClientSeed = (Math.random() + 1).toString(36).substring(2);

        try {
            const response = await fetch(CONFIG.seedChangeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    query: `mutation changeClientSeed($seed: String!) { changeClientSeed(seed: $seed) { id, seed, __typename } }`,
                    variables: {
                        seed: newClientSeed
                    },
                    operationName: "changeClientSeed"
                }),
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const responseData = await response.json();
            if (responseData.errors) throw new Error(responseData.errors.map(e => e.message).join(', '));
            log(`Seed changed successfully. New seed: ${newClientSeed}`, "strategy");
            return true;
        } catch (error) {
            log(`Seed change failed: ${error.message}`, "error");
            return false;
        }
    }


    // --- CONFIGURATION MANAGEMENT ---

    function populateConfigTab() {
        const container = document.getElementById('config-container');
        container.innerHTML = '';
        for (const key in CONFIG) {
            const friendlyName = CONFIG_FRIENDLY_NAMES[key] || key;
            const group = document.createElement('div');
            group.className = 'config-group';

            let inputWrapperHtml = '';
            let labelHtml = `<label for="config-${key}">${friendlyName}</label>`;
            const isSelector = !["authToken", "seedChangeEndpoint", "betDelay", "maxBetAmount", "uiScale", "lossMultiplier"].includes(key);

            if (key === 'betDelay') {
                labelHtml = `<label>${friendlyName} <span class="config-tooltip-trigger" style="display: none;">?<span class="tooltip-text">A low delay (< 20ms) can cause the bot to miss bet results. Use with caution.</span></span></label>`;
                const parts = String(CONFIG.betDelay).split('-').map(p => p.trim());
                inputWrapperHtml = `<div class="input-wrapper config-range-wrapper"><input type="number" id="config-betDelay-min" class="bot-input" value="${parts[0] || ''}" placeholder="Min"><span>to</span><input type="number" id="config-betDelay-max" class="bot-input" value="${parts[1] || ''}" placeholder="Max"></div>`;
            } else if (key === 'uiScale') {
                inputWrapperHtml = `<div class="input-wrapper" style="display: flex; align-items: center; gap: 10px;"><input type="range" id="config-uiScale" class="bot-input" min="50" max="150" value="${CONFIG[key]}" style="flex-grow: 1; padding: 0;"><span id="config-uiScale-value" style="flex-basis: 40px; text-align: right;">${CONFIG[key]}%</span></div>`;
            } else if (key === 'authToken') {
                inputWrapperHtml = `<div class="input-wrapper"><input type="password" id="config-authToken" class="bot-input" value='${CONFIG[key]}'><button class="config-toggle-vis-btn" data-target="config-authToken"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button></div>`;
            } else {
                inputWrapperHtml = `<div class="input-wrapper"><input type="${typeof CONFIG[key] === 'number' ? 'number' : 'text'}" id="config-${key}" class="bot-input" value='${CONFIG[key]}'>${isSelector ? `<button class="config-pick-btn" data-key="${key}">Pick</button>` : ''}</div>`;
            }

            group.innerHTML = `${labelHtml}${inputWrapperHtml}`;
            container.appendChild(group);
        }

        container.querySelectorAll('.config-pick-btn').forEach(btn => btn.addEventListener('click', (e) => initSelectorPicker(e.target.dataset.key)));
        container.querySelectorAll('.config-toggle-vis-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const targetInput = document.getElementById(e.currentTarget.dataset.target);
            if (targetInput) targetInput.type = targetInput.type === 'password' ? 'text' : 'password';
        }));
        const minDelayInput = document.getElementById('config-betDelay-min'),
            maxDelayInput = document.getElementById('config-betDelay-max');
        if (minDelayInput && maxDelayInput) {
            const validate = () => {
                const showWarning = parseInt(minDelayInput.value, 10) < 20;
                const tooltip = minDelayInput.closest('.config-group').querySelector('.config-tooltip-trigger');
                if (tooltip) tooltip.style.display = showWarning ? 'inline-flex' : 'none';
            };
            minDelayInput.addEventListener('input', validate);
            maxDelayInput.addEventListener('input', validate);
            validate();
        }
        document.getElementById('config-uiScale')?.addEventListener('input', (e) => {
            document.getElementById('config-uiScale-value').textContent = `${e.target.value}%`;
            applyUiScale(e.target.value);
        });
    }

    function initSelectorPicker(configKey) {
        if (isPickingElement) return;
        isPickingElement = true;
        const overlay = document.getElementById('element-picker-overlay');
        const tooltip = document.getElementById('element-picker-tooltip');
        overlay.style.display = 'block';
        tooltip.style.display = 'block';

        const mouseMoveHandler = (e) => {
            const target = e.target;
            if (target.id === 'wheel-bot-window' || target.closest('#wheel-bot-window')) {
                overlay.style.display = 'none';
                return;
            }
            overlay.style.display = 'block';
            const rect = target.getBoundingClientRect();
            Object.assign(overlay.style, {
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                top: `${rect.top}px`,
                left: `${rect.left}px`
            });
        };

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;
            if (target.id === 'wheel-bot-window' || target.closest('#wheel-bot-window')) return;
            document.getElementById(`config-${configKey}`).value = generateSelector(target);
            cleanup();
        };

        const escHandler = (e) => e.key === "Escape" && cleanup();
        const cleanup = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('click', clickHandler, true);
            document.removeEventListener('keydown', escHandler, true);
            overlay.style.display = 'none';
            tooltip.style.display = 'none';
            isPickingElement = false;
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('click', clickHandler, true);
        document.addEventListener('keydown', escHandler, true);
    }

    function generateSelector(el) {
        if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
        if (el.id) return `#${el.id}`;
        if (el.className) {
            const classNames = typeof el.className === 'string' ? el.className.split(' ').filter(c => c && !c.includes('svelte-')) : [];
            if (classNames.length > 0) return `.${classNames.join('.')}`;
        }
        return el.tagName.toLowerCase();
    }

    function saveConfig() {
        updateConfigFromUI(); // Read current values from UI
        localStorage.setItem('stakeWheelBotConfig', JSON.stringify(CONFIG));
        showNotification('Configuration saved!');
        log("Configuration saved.", "system");
    }

    function updateConfigFromUI() {
        const newConfig = { ...CONFIG
        };
        // This function only reads values for the current session, it doesn't save them to localStorage
        for (const key in CONFIG) {
            if (key === 'betDelay') {
                const minEl = document.getElementById('config-betDelay-min');
                const maxEl = document.getElementById('config-betDelay-max');
                if (minEl && maxEl) {
                    const min = minEl.value.trim();
                    const max = maxEl.value.trim();
                    newConfig[key] = (min && max) ? `${min}-${max}` : min || '100';
                }
            } else {
                const el = document.getElementById(`config-${key}`);
                if (el) {
                    const value = el.value;
                    if (typeof CONFIG[key] === 'number' && key !== 'uiScale') {
                        newConfig[key] = parseFloat(value) || 0;
                    } else if (key === 'uiScale') {
                        newConfig[key] = parseInt(value, 10) || 100;
                    } else {
                        newConfig[key] = value;
                    }
                }
            }
        }
        CONFIG = newConfig;
    }


    function loadConfig() {
        const saved = localStorage.getItem('stakeWheelBotConfig');
        if (saved) {
            try {
                CONFIG = { ...CONFIG,
                    ...JSON.parse(saved)
                };
            } catch (e) {
                console.error("Failed to load config", e);
            }
        }
        if (!CONFIG.authToken) CONFIG.authToken = getAuthToken();
    }

    function resetConfigToDefault() {
        if (confirm("Are you sure you want to reset all configuration to defaults?")) {
            localStorage.removeItem('stakeWheelBotConfig');
            CONFIG = {
                authToken: '',
                seedChangeEndpoint: '/_api/graphql',
                betButton: '[data-testid="bet-button"]',
                amountInput: '[data-testid="input-game-amount"]',
                riskSelect: '[data-testid="risk-select"]',
                segmentsSelect: '[data-testid="segments-select"]',
                betDelay: '100',
                maxBetAmount: 0,
                lossMultiplier: 1,
                pastBetsContainer: '.past-bets',
                autoTab: '[data-testid="auto-tab"]',
                manualTab: '[data-testid="manual-tab"]',
                uiScale: 100,
            };
            loadConfig();
            populateConfigTab();
            applyUiScale();
            showNotification("Configuration has been reset to default.");
        }
    }

    // --- ADVANCED STRATEGY LOGIC ---

    function openStrategyModal(strategyName = '') {
        const modal = document.getElementById('strategy-modal');
        const nameInput = document.getElementById('strategy-name');
        nameInput.value = strategyName;
        nameInput.dataset.originalName = strategyName;
        modal.querySelector('#strategy-modal-title').textContent = strategyName ? 'Edit Strategy' : 'Create Strategy';
        modal.querySelector('#strategy-rules-container').innerHTML = '';
        if (strategyName && advancedStrategies[strategyName]) {
            advancedStrategies[strategyName].forEach(rule => addRuleToModal(rule));
        } else {
            addRuleToModal();
        }
        modal.style.display = 'flex';
    }

    function addRuleToModal(rule = {}) {
        const rulesContainer = document.getElementById('strategy-rules-container');
        const ruleDiv = document.createElement('div');
        ruleDiv.className = 'strategy-rule';
        const ruleId = `rule-${Date.now()}-${Math.random()}`;
        ruleDiv.id = ruleId;

        const defaults = {
            conditionType: 'bets',
            playConditionTerm: 'every',
            playConditionValue: 1,
            playConditionBetType: 'lose',
            netGainCondition: 'greater',
            netGainValue: 0,
            action: 'increaseByPercentage',
            actionValue: 100,
            timeSinceWinCondition: 'greater',
            timeSinceWinValue: 10,
            patternMatch: 'LWL'
        };
        const currentRule = { ...defaults,
            ...rule
        };

        ruleDiv.innerHTML = `
            <div class="strategy-rule-header">
                <div class="strategy-rule-summary"></div>
                <div class="strategy-rule-controls">
                    <button class="move-btn" data-direction="up" title="Move Up">↑</button>
                    <button class="move-btn" data-direction="down" title="Move Down">↓</button>
                    <button class="remove-btn" title="Remove Rule">&times;</button>
                </div>
            </div>
            <div class="strategy-rule-editor">
                <div class="rule-toggle-group">
                    <input type="radio" id="${ruleId}-type-bets" name="${ruleId}-type" value="bets" ${currentRule.conditionType === 'bets' ? 'checked' : ''}><label for="${ruleId}-type-bets">Play</label>
                    <input type="radio" id="${ruleId}-type-profit" name="${ruleId}-type" value="profit" ${currentRule.conditionType === 'profit' ? 'checked' : ''}><label for="${ruleId}-type-profit">Net Gain</label>
                    <input type="radio" id="${ruleId}-type-time" name="${ruleId}-type" value="time" ${currentRule.conditionType === 'time' ? 'checked' : ''}><label for="${ruleId}-type-time">Time</label>
                    <input type="radio" id="${ruleId}-type-pattern" name="${ruleId}-type" value="pattern" ${currentRule.conditionType === 'pattern' ? 'checked' : ''}><label for="${ruleId}-type-pattern">Pattern</label>
                </div>
                <div class="play-condition-sentence rule-sentence">
                    <span>On</span>
                    <select class="bot-input play-term"><option value="every">Every</option><option value="everyStreakOf">Every streak of</option><option value="firstStreakOf">First streak of</option><option value="streakGreaterThan">Streak greater than</option><option value="streakLowerThan">Streak lower than</option></select>
                    <input type="number" class="bot-input play-value" value="${currentRule.playConditionValue}">
                    <select class="bot-input play-bet-type"><option value="win">Wins</option><option value="lose">Losses</option><option value="bet">Games</option></select>
                </div>
                <div class="net-gain-condition-sentence rule-sentence"><span>If Net Gain is</span><select class="bot-input net-gain-condition"><option value="greater">&gt;</option><option value="less">&lt;</option><option value="=">=</option></select><input type="number" step="any" class="bot-input net-gain-value" value="${currentRule.netGainValue}"></div>
                <div class="time-condition-sentence rule-sentence"><span>If time since last win is</span><select class="bot-input time-condition"><option value="greater">&gt;</option><option value="less">&lt;</option></select><input type="number" class="bot-input time-value" value="${currentRule.timeSinceWinValue}"><span>seconds</span></div>
                <div class="pattern-condition-sentence rule-sentence"><span>If last bets match</span><input type="text" class="bot-input pattern-value" placeholder="e.g. LWL" value="${currentRule.patternMatch}"></div>
                <div class="action-sentence rule-sentence">
                    <span>Do</span>
                    <select class="bot-input action-type"><option value="increaseByPercentage">Increase Amount by %</option><option value="decreaseByPercentage">Decrease Amount by %</option><option value="setAmount">Set Amount</option><option value="resetAmount">Reset Amount</option><option value="setBaseBet">Set Base Bet</option><option value="increaseBaseBetByPercentage">Increase Base Bet by %</option><option value="decreaseBaseBetByPercentage">Decrease Base Bet by %</option><option value="setRisk">Set Risk/Difficulty</option><option value="setSegments">Set Segments</option><option value="changeSeed">Change Seed (API)</option><option value="switchStrategy">Switch Strategy</option><option value="stop">Stop Autoplay</option><option value="notify">Show Notification</option></select>
                    <input type="number" step="any" class="bot-input action-value" value="${currentRule.actionValue}">
                    <input type="text" class="bot-input action-value-text" style="display: none;" placeholder="Notification message...">
                    <select class="bot-input action-strategy-select" style="display: none;"></select>
                    <select class="bot-input action-risk-select" style="display: none;"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
                    <select class="bot-input action-segments-select" style="display: none;"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option><option value="50">50</option></select>
                </div>
            </div>`;
        rulesContainer.appendChild(ruleDiv);

        const setVal = (sel, val) => {
            if (val !== undefined) ruleDiv.querySelector(sel).value = val;
        };
        setVal('.play-term', currentRule.playConditionTerm);
        setVal('.play-bet-type', currentRule.playConditionBetType);
        setVal('.net-gain-condition', currentRule.netGainCondition);
        setVal('.time-condition', currentRule.timeSinceWinCondition);
        setVal('.action-type', currentRule.action);

        const actionStrategySelect = ruleDiv.querySelector('.action-strategy-select');
        Object.keys(advancedStrategies).forEach(name => actionStrategySelect.add(new Option(name, name)));
        if (currentRule.action === 'switchStrategy') actionStrategySelect.value = currentRule.actionValue;
        if (currentRule.action === 'setRisk') ruleDiv.querySelector('.action-risk-select').value = currentRule.actionValue;
        if (currentRule.action === 'setSegments') ruleDiv.querySelector('.action-segments-select').value = currentRule.actionValue;
        if (currentRule.action === 'notify') ruleDiv.querySelector('.action-value-text').value = currentRule.actionValue;


        const updateVisibility = () => {
            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`).value;
            ruleDiv.querySelectorAll('.play-condition-sentence, .net-gain-condition-sentence, .time-condition-sentence, .pattern-condition-sentence').forEach(el => {
                el.style.display = 'none';
            });
            ruleDiv.querySelector(`.${type === 'bets' ? 'play' : type === 'profit' ? 'net-gain' : type}-condition-sentence`).style.display = 'flex';

            const actionType = ruleDiv.querySelector('.action-type').value;
            const noValueActions = ['resetAmount', 'changeSeed', 'stop'];
            const selectActions = ['setRisk', 'setSegments', 'switchStrategy', 'notify'];
            ruleDiv.querySelector('.action-value').style.display = noValueActions.includes(actionType) || selectActions.includes(actionType) ? 'none' : 'block';
            ruleDiv.querySelector('.action-value-text').style.display = actionType === 'notify' ? 'block' : 'none';
            ruleDiv.querySelector('.action-strategy-select').style.display = actionType === 'switchStrategy' ? 'block' : 'none';
            ruleDiv.querySelector('.action-risk-select').style.display = actionType === 'setRisk' ? 'block' : 'none';
            ruleDiv.querySelector('.action-segments-select').style.display = actionType === 'setSegments' ? 'block' : 'none';
            updateSummary();
        };

        const updateSummary = () => {
            let conditionText = '',
                actionText = '',
                actionValueText = '';
            const type = ruleDiv.querySelector(`input[name="${ruleId}-type"]:checked`).value;
            if (type === 'bets') conditionText = `On ${ruleDiv.querySelector('.play-term option:checked').textContent} ${ruleDiv.querySelector('.play-value').value} ${ruleDiv.querySelector('.play-bet-type option:checked').textContent}`;
            else if (type === 'profit') conditionText = `If Net Gain ${ruleDiv.querySelector('.net-gain-condition option:checked').textContent} ${ruleDiv.querySelector('.net-gain-value').value}`;
            else if (type === 'time') conditionText = `If time since win ${ruleDiv.querySelector('.time-condition option:checked').textContent} ${ruleDiv.querySelector('.time-value').value}s`;
            else if (type === 'pattern') conditionText = `If pattern is ${ruleDiv.querySelector('.pattern-value').value}`;

            const actionTypeSelect = ruleDiv.querySelector('.action-type');
            actionText = actionTypeSelect.options[actionTypeSelect.selectedIndex].textContent;
            if (actionTypeSelect.value === 'notify') actionValueText = ` "${ruleDiv.querySelector('.action-value-text').value}"`;
            else if (actionTypeSelect.value === 'switchStrategy') actionValueText = ` to ${ruleDiv.querySelector('.action-strategy-select').value}`;
            else if (actionTypeSelect.value === 'setRisk') actionValueText = ` to ${ruleDiv.querySelector('.action-risk-select').value}`;
            else if (actionTypeSelect.value === 'setSegments') actionValueText = ` to ${ruleDiv.querySelector('.action-segments-select').value}`;
            else if (!['resetAmount', 'changeSeed', 'stop'].includes(actionTypeSelect.value)) actionValueText = ` ${ruleDiv.querySelector('.action-value').value}`;

            ruleDiv.querySelector('.strategy-rule-summary').innerHTML = `<span>${conditionText} →</span><span class="summary-action">${actionText}${actionValueText}</span>`;
        };

        ruleDiv.querySelector('.strategy-rule-header').addEventListener('click', (e) => {
            if (!e.target.closest('button')) ruleDiv.classList.toggle('expanded');
            updateSummary();
        });
        ruleDiv.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updateVisibility));
        ruleDiv.querySelector('.remove-btn').addEventListener('click', () => ruleDiv.remove());
        ruleDiv.querySelectorAll('.move-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const dir = e.target.dataset.direction;
            if (dir === 'up' && ruleDiv.previousElementSibling) ruleDiv.parentNode.insertBefore(ruleDiv, ruleDiv.previousElementSibling);
            else if (dir === 'down' && ruleDiv.nextElementSibling) ruleDiv.parentNode.insertBefore(ruleDiv.nextElementSibling, ruleDiv);
        }));
        updateVisibility();
    }

    function saveStrategy() {
        const nameInput = document.getElementById('strategy-name');
        const originalName = nameInput.dataset.originalName;
        const newName = nameInput.value.trim();
        if (!newName) return showNotification('Strategy name cannot be empty.', "error");
        if (newName !== originalName && advancedStrategies[newName]) return showNotification('A strategy with this name already exists.', "error");

        const rules = [];
        document.querySelectorAll('.strategy-rule').forEach(ruleDiv => {
            const action = ruleDiv.querySelector('.action-type').value;
            let actionValue;
            if (action === 'switchStrategy') actionValue = ruleDiv.querySelector('.action-strategy-select').value;
            else if (action === 'notify') actionValue = ruleDiv.querySelector('.action-value-text').value;
            else if (action === 'setRisk') actionValue = ruleDiv.querySelector('.action-risk-select').value;
            else if (action === 'setSegments') actionValue = ruleDiv.querySelector('.action-segments-select').value;
            else actionValue = parseFloat(ruleDiv.querySelector('.action-value').value);

            rules.push({
                conditionType: ruleDiv.querySelector('input[name*="-type"]:checked').value,
                playConditionTerm: ruleDiv.querySelector('.play-term').value,
                playConditionValue: parseFloat(ruleDiv.querySelector('.play-value').value),
                playConditionBetType: ruleDiv.querySelector('.play-bet-type').value,
                netGainCondition: ruleDiv.querySelector('.net-gain-condition').value,
                netGainValue: parseFloat(ruleDiv.querySelector('.net-gain-value').value),
                timeSinceWinCondition: ruleDiv.querySelector('.time-condition').value,
                timeSinceWinValue: parseFloat(ruleDiv.querySelector('.time-value').value),
                patternMatch: ruleDiv.querySelector('.pattern-value').value,
                action: action,
                actionValue: actionValue,
            });
        });

        if (originalName && originalName !== newName) delete advancedStrategies[originalName];
        advancedStrategies[newName] = rules;
        saveStrategies();
        document.getElementById('strategy-modal').style.display = 'none';
        log(`Strategy '${newName}' saved.`, "system");
    }

    function validateStrategyRules() {
        const warningEl = document.getElementById('strategy-modal-warning');
        const saveBtn = document.getElementById('save-strategy-btn');
        // Future wheel-specific validation can go here. For now, just ensure UI is correct.
        warningEl.style.display = 'none';
        saveBtn.disabled = false;
    }

    function editSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (selectedName) openStrategyModal(selectedName);
        else showNotification('Please select a strategy to edit.', "error");
    }

    function deleteSelectedStrategy() {
        const selectedName = document.getElementById('advanced-strategy-list').value;
        if (selectedName && confirm(`Are you sure you want to delete the strategy "${selectedName}"?`)) {
            delete advancedStrategies[selectedName];
            saveStrategies();
            log(`Strategy '${selectedName}' deleted.`, "system");
        }
    }

    async function executeAdvancedStrategy(rules, targetState, baseBet) {
        let betAmountModified = false;
        for (const [index, rule] of rules.entries()) {
            const conditionMet = checkCondition(rule);
            if (conditionMet) {
                log(`<b>Strategy Trigger:</b> Rule #${index + 1}`, "strategy");
                const action = rule.action;
                if (['increaseByPercentage', 'decreaseByPercentage', 'setAmount', 'resetAmount'].includes(action) && betAmountModified) {
                    log(`&nbsp;&nbsp;↳ Action skipped: Bet amount already modified.`, "strategy");
                    continue;
                }

                switch (action) {
                    case 'increaseByPercentage':
                        targetState.currentBet *= (1 + rule.actionValue / 100);
                        break;
                    case 'decreaseByPercentage':
                        targetState.currentBet *= (1 - rule.actionValue / 100);
                        break;
                    case 'setAmount':
                        targetState.currentBet = rule.actionValue;
                        break;
                    case 'resetAmount':
                        targetState.currentBet = baseBet;
                        break;
                    case 'setBaseBet':
                        state.baseBet = rule.actionValue;
                        document.getElementById('base-bet').value = rule.actionValue;
                        break;
                    case 'increaseBaseBetByPercentage':
                        state.baseBet *= (1 + rule.actionValue / 100);
                        document.getElementById('base-bet').value = state.baseBet;
                        break;
                    case 'decreaseBaseBetByPercentage':
                        state.baseBet *= (1 - rule.actionValue / 100);
                        document.getElementById('base-bet').value = state.baseBet;
                        break;
                    case 'setRisk':
                        setUIValue(CONFIG.riskSelect, rule.actionValue);
                        break;
                    case 'setSegments':
                        setUIValue(CONFIG.segmentsSelect, rule.actionValue);
                        break;
                    case 'changeSeed':
                        await changeSeedProgrammatically();
                        break;
                    case 'switchStrategy':
                        document.getElementById('auto-strategy-select').value = rule.actionValue;
                        break;
                    case 'stop':
                        if (state.running) toggleBot();
                        break;
                    case 'notify':
                        showNotification(rule.actionValue);
                        break;
                }
                log(`&nbsp;&nbsp;↳ Action: ${action.replace(/([A-Z])/g, ' $1')} ${rule.actionValue || ''}`, "strategy");
                if (['increaseByPercentage', 'decreaseByPercentage', 'setAmount', 'resetAmount'].includes(action)) betAmountModified = true;
            }
        }
    }

    function checkCondition(rule) {
        switch (rule.conditionType) {
            case 'bets':
                const value = rule.playConditionValue;
                const streak = rule.playConditionBetType === 'win' ? state.winStreak : state.lossStreak;
                switch (rule.playConditionTerm) {
                    case 'every':
                        return (rule.playConditionBetType === 'bet' && state.betCount > 0 && state.betCount % value === 0) || (streak > 0 && streak % value === 0);
                    case 'everyStreakOf':
                        return streak > 0 && streak % value === 0;
                    case 'firstStreakOf':
                        const flag = `firstStreak-${rule.playConditionBetType}-${value}`;
                        if (streak === value && !state.strategyFlags[flag]) return (state.strategyFlags[flag] = true);
                        if (streak < value) state.strategyFlags[flag] = false;
                        break;
                    case 'streakGreaterThan':
                        return streak > value;
                    case 'streakLowerThan':
                        return streak < value;
                }
                break;
            case 'profit':
                if (rule.netGainCondition === 'greater' && state.totalProfit > rule.netGainValue) return true;
                if (rule.netGainCondition === 'less' && state.totalProfit < rule.netGainValue) return true;
                if (rule.netGainCondition === '=' && state.totalProfit.toFixed(8) == rule.netGainValue.toFixed(8)) return true;
                break;
            case 'time':
                const timeSinceWin = (Date.now() - state.lastWinTimestamp) / 1000;
                if (rule.timeSinceWinCondition === 'greater' && timeSinceWin > rule.timeSinceWinValue) return true;
                if (rule.timeSinceWinCondition === 'less' && timeSinceWin < rule.timeSinceWinValue) return true;
                break;
            case 'pattern':
                return state.outcomeHistory.endsWith(rule.patternMatch.toUpperCase());
        }
        return false;
    }


    // --- HELPER & STATE FUNCTIONS ---

    function getBetDelay() {
        const parts = String(CONFIG.betDelay).split('-').map(p => parseInt(p.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] <= parts[1]) {
            return Math.floor(Math.random() * (parts[1] - parts[0] + 1)) + parts[0];
        }
        if (parts.length === 1 && !isNaN(parts[0])) return parts[0];
        return 100;
    }

    function showNotification(message, type = 'info') {
        const container = document.getElementById('bot-notification-container');
        const notification = document.createElement('div');
        notification.className = 'bot-notification';
        notification.innerHTML = `<div class="bot-notification-header"><span>${type === 'error' ? 'Error' : 'Bot Notification'}</span><button class="close-btn">&times;</button></div><p>${message}</p>`;
        if (type === 'error') notification.style.backgroundColor = 'var(--accent-red)';
        container.appendChild(notification);
        const close = () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        };
        notification.querySelector('.close-btn').addEventListener('click', close);
        setTimeout(close, 10000);
    }

    function simulateClick(element) {
        if (!element) return;
        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: unsafeWindow
        };
        element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
        element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
        element.dispatchEvent(new MouseEvent('click', eventOptions));
    }

    function setUIValue(selector, value) {
        const input = document.querySelector(selector);
        if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
            if (nativeInputValueSetter && input.tagName === 'INPUT') nativeInputValueSetter.call(input, value.toString());
            else if (nativeSelectValueSetter && input.tagName === 'SELECT') nativeSelectValueSetter.call(input, value.toString());
            else input.value = value;
            input.dispatchEvent(new Event('input', {
                bubbles: true
            }));
            input.dispatchEvent(new Event('change', {
                bubbles: true
            }));
            return true;
        }
        return false;
    }

    function getStakeBetAmount() {
        const el = document.querySelector(CONFIG.amountInput);
        return el ? parseFloat(el.value) : 0;
    }

    function updateStatus(text) {
        const el = document.getElementById('bot-status-indicator');
        if (el) el.textContent = `- ${text}`;
    }

    function updateProfitDisplay() {
        const el = document.getElementById('profit-loss-display');
        if (!el) return;
        el.textContent = `${state.totalProfit >= 0 ? '+' : ''}${state.totalProfit.toFixed(8)}`;
        el.className = state.totalProfit > 0 ? 'profit' : state.totalProfit < 0 ? 'loss' : '';
    }

    function resetState() {
        state.betCount = 0;
        state.totalProfit = 0;
        state.winStreak = 0;
        state.lossStreak = 0;
        state.lastBetWasWin = null;
        state.strategyFlags = {};
        state.persistentTriggerStates = {};
        state.lastWinTimestamp = Date.now();
        state.outcomeHistory = '';
        state.stackingDelay = 0;
        updateProfitDisplay();
        log("State reset for new session.", "system");
    }

    function updateStateFromResult(result) {
        state.betCount++;
        state.totalProfit += result.profit;
        state.lastBetWasWin = result.win;
        if (result.win) {
            state.winStreak++;
            state.lossStreak = 0;
            state.lastWinTimestamp = Date.now();
            state.outcomeHistory += 'W';
        } else {
            state.lossStreak++;
            state.winStreak = 0;
            state.outcomeHistory += 'L';
        }
        state.outcomeHistory = state.outcomeHistory.slice(-50);
        updateProfitDisplay();
    }

    function updateInputDisabledState() {
        const isRunning = state.running;
        document.querySelectorAll('#wheel-bot-window .bot-input, #wheel-bot-window .bot-btn, #wheel-bot-window .config-pick-btn, #wheel-bot-window select').forEach(el => {
            el.disabled = isRunning && el.id !== 'start-stop-btn';
        });
    }

    function updateSettings() {
        state.baseBet = parseFloat(document.getElementById('base-bet').value) || 0.01;
        state.currentBet = state.baseBet;
    }

    async function startBot() {
        updateConfigFromUI(); // Ensure latest config from UI is used for the session
        updateSettings();
        resetState();
        setUIValue(CONFIG.riskSelect, document.getElementById('auto-risk').value);
        setUIValue(CONFIG.segmentsSelect, document.getElementById('auto-segments').value);

        while (state.running) {
            if (CONFIG.maxBetAmount > 0 && state.currentBet > CONFIG.maxBetAmount) {
                log(`SAFETY STOP: Bet amount (${state.currentBet.toFixed(8)}) exceeded max bet (${CONFIG.maxBetAmount}).`, 'error');
                toggleBot();
                break;
            }
            setBetAmount(state.currentBet);
            const result = await placeBetAndGetResult('auto');
            if (result === null) {
                if (state.running) toggleBot();
                break;
            }
            updateStateFromResult(result);

            const strategyName = document.getElementById('auto-strategy-select').value;
            if (strategyName !== 'none' && advancedStrategies[strategyName]) {
                await executeAdvancedStrategy(advancedStrategies[strategyName], state, state.baseBet);
            }
            await sleep(getBetDelay());
        }
    }

    function setBetAmount(amount) {
        setUIValue(CONFIG.amountInput, amount.toFixed(8));
    }

    async function placeBetAndGetResult(betType = 'manual') {
        const amountForProfit = betType === 'auto' ? state.currentBet : semiAutoState.currentBet;
        const betButton = document.querySelector(CONFIG.betButton);
        if (!betButton || betButton.disabled) {
            updateStatus("ERROR: Bet button not found or disabled!");
            return null;
        }
        const pastBetsContainer = document.querySelector(CONFIG.pastBetsContainer);
        if (!pastBetsContainer) {
            updateStatus("ERROR: Past bets list not found!");
            return null;
        }
        const lastBetId = pastBetsContainer.querySelector('[data-past-bet-id]')?.getAttribute('data-past-bet-id');

        await sleep(50); // Give UI time to update from setBetAmount
        simulateClick(betButton);

        return new Promise(resolve => {
            let attempts = 0;
            const pollInterval = setInterval(() => {
                const newBetElement = pastBetsContainer.querySelector('[data-past-bet-id]');
                const newBetId = newBetElement?.getAttribute('data-past-bet-id');
                if (newBetElement && newBetId !== lastBetId) {
                    clearInterval(pollInterval);
                    const multiplierText = newBetElement.textContent || '';
                    const multiplier = parseFloat(multiplierText.replace('×', ''));

                    if (isNaN(multiplier)) {
                        log("Error parsing multiplier from bet result.", "error");
                        return resolve(null);
                    }

                    const isWin = multiplier > parseFloat(CONFIG.lossMultiplier);
                    const netProfit = (amountForProfit * multiplier) - amountForProfit;
                    log(`Bet #${state.betCount + 1}: ${isWin ? 'WIN' : 'LOSS'} (${multiplier}x). Profit: ${netProfit.toFixed(8)}`, betType);
                    resolve({
                        win: isWin,
                        profit: netProfit
                    });
                } else if (++attempts >= 75) {
                    clearInterval(pollInterval);
                    updateStatus("ERROR: Bet result timed out!");
                    log("Bet result timed out.", "error");
                    resolve(null);
                }
            }, 200);
        });
    }

    async function runSemiAutoStep() {
        const stepButton = document.getElementById('semi-auto-step-btn');
        stepButton.disabled = true;
        updateStatus('Manual Step...');
        if (!semiAutoState.isStarted) {
            updateConfigFromUI(); // Ensure latest config from UI is used for the session
            semiAutoState.isStarted = true;
            resetState();
            const baseBetInput = document.getElementById('semi-auto-base-bet');
            semiAutoState.currentBet = parseFloat(baseBetInput.value) || 0.01;
        }

        setBetAmount(semiAutoState.currentBet);
        const result = await placeBetAndGetResult('manual');
        if (result) {
            updateStateFromResult(result);
            const strategyName = document.getElementById('semi-auto-strategy').value;
            if (strategyName !== 'none' && advancedStrategies[strategyName]) {
                await executeAdvancedStrategy(advancedStrategies[strategyName], semiAutoState, parseFloat(document.getElementById('semi-auto-base-bet').value));
            }
        }
        updateStatus('Ready for next step.');
        stepButton.disabled = false;
    }

    async function handleManualSeedChange() {
        const btn = document.getElementById('manual-change-seed-btn');
        btn.disabled = true;
        await changeSeedProgrammatically();
        btn.disabled = false;
    }

    function resetSemiAutoProgression() {
        semiAutoState.isStarted = false;
        const baseBet = parseFloat(document.getElementById('semi-auto-base-bet').value) || 0.01;
        semiAutoState.currentBet = baseBet;
        setBetAmount(baseBet);
        log("Manual progression reset to base bet.", "manual");
    }

    function saveStrategies() {
        localStorage.setItem('stakeWheelBotStrategies', JSON.stringify(advancedStrategies));
        populateStrategyDropdowns();
    }

    function loadStrategies() {
        const saved = localStorage.getItem('stakeWheelBotStrategies');
        if (saved) {
            try {
                advancedStrategies = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load strategies:", e);
            }
        }
    }

    function populateStrategyDropdowns() {
        const selects = document.querySelectorAll('#semi-auto-strategy, #advanced-strategy-list, #auto-strategy-select');
        selects.forEach(sel => {
            const currentVal = sel.value;
            sel.innerHTML = sel.id.includes('list') ? '' : `<option value="none">${sel.id.includes('auto-strategy') ? 'None (No auto changes)' : 'None (Manual Betting)'}</option>`;
            for (const name in advancedStrategies) {
                sel.add(new Option(name, name));
            }
            sel.value = currentVal;
        });
    }

    function updateSemiAutoDescription() {
        const select = document.getElementById('semi-auto-strategy');
        const desc = document.getElementById('semi-auto-desc');
        desc.textContent = select.value === 'none' ? 'Manual Betting: Bet amount is not changed automatically.' : `Using advanced strategy: ${select.value}`;
    }

    function applyLogFilters() {
        document.getElementById('log-container').querySelectorAll('p').forEach(entry => {
            entry.style.display = logFilters[entry.dataset.logType] ? '' : 'none';
        });
    }

    function log(message, type = 'system') {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;
        const entry = document.createElement('p');
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        entry.dataset.logType = type;
        entry.className = `log-${type}`;
        if (!logFilters[type]) entry.style.display = 'none';
        logContainer.appendChild(entry);
        logEntries.push(`[${new Date().toLocaleTimeString()}] ${message.replace(/<[^>]*>/g, '')}`);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function saveLogToFile() {
        const blob = new Blob([logEntries.join('\n')], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stake_wheel_bot_log_${new Date().toISOString()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportSelectedStrategy() {
        const name = document.getElementById('advanced-strategy-list').value;
        if (!name || !advancedStrategies[name]) return showNotification("Please select a valid strategy to export.", "error");
        const blob = new Blob([JSON.stringify({
            name,
            rules: advancedStrategies[name]
        }, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.strategy.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importStrategy() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.strategy';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = re => {
                try {
                    const {
                        name,
                        rules
                    } = JSON.parse(re.target.result);
                    if (!name || !Array.isArray(rules)) throw new Error("Invalid format.");
                    if (advancedStrategies[name] && !confirm(`Strategy "${name}" already exists. Overwrite?`)) return;
                    advancedStrategies[name] = rules;
                    saveStrategies();
                    showNotification(`Strategy "${name}" imported successfully!`);
                } catch (err) {
                    showNotification(`Import failed: ${err.message}`, "error");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function makeDraggable(element, handle) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        handle.onmousedown = (e) => {
            if (e.target.closest('.window-btn')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    }

    function makeResizable(element) {
        const resizers = element.querySelectorAll('.resizer');
        const minimum_size = {
            width: parseFloat(getComputedStyle(element, null).getPropertyValue('min-width')),
            height: parseFloat(getComputedStyle(element, null).getPropertyValue('min-height'))
        };
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        resizers.forEach(currentResizer => {
            currentResizer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;

                const mouseMoveHandler = (e) => {
                    const dx = e.pageX - original_mouse_x;
                    const dy = e.pageY - original_mouse_y;

                    if (currentResizer.classList.contains('resizer-b') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-bl')) {
                        const height = original_height + dy;
                        if (height > minimum_size.height) {
                            element.style.height = height + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-t') || currentResizer.classList.contains('resizer-tr') || currentResizer.classList.contains('resizer-tl')) {
                        const height = original_height - dy;
                        if (height > minimum_size.height) {
                            element.style.height = height + 'px';
                            element.style.top = original_y + dy + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-r') || currentResizer.classList.contains('resizer-br') || currentResizer.classList.contains('resizer-tr')) {
                        const width = original_width + dx;
                        if (width > minimum_size.width) {
                            element.style.width = width + 'px';
                        }
                    }
                    if (currentResizer.classList.contains('resizer-l') || currentResizer.classList.contains('resizer-bl') || currentResizer.classList.contains('resizer-tl')) {
                        const width = original_width - dx;
                        if (width > minimum_size.width) {
                            element.style.width = width + 'px';
                            element.style.left = original_x + dx + 'px';
                        }
                    }
                };

                const mouseUpHandler = () => {
                    window.removeEventListener('mousemove', mouseMoveHandler);
                    window.removeEventListener('mouseup', mouseUpHandler);
                };

                window.addEventListener('mousemove', mouseMoveHandler);
                window.addEventListener('mouseup', mouseUpHandler);
            });
        });
    }

    function handleKeydown(e) {
        const tag = document.activeElement.tagName;
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag) || isPickingElement) return;
        switch (e.key.toLowerCase()) {
            case 's':
                document.getElementById('start-stop-btn').click();
                break;
            case 'd':
                document.getElementById('semi-auto-step-btn').click();
                break;
            case 'r':
                document.getElementById('semi-auto-reset-btn').click();
                break;
        }
    }

    function applyUiScale(scaleValue = CONFIG.uiScale) {
        const scale = scaleValue / 100;
        document.getElementById('wheel-bot-window').style.zoom = scale;
        document.getElementById('wheel-bot-minimized-bar').style.zoom = scale;
    }

    function waitForGameAndEnable() {
        const interval = setInterval(() => {
            if (document.querySelector(CONFIG.betButton)) {
                clearInterval(interval);
                updateInputDisabledState();
                updateStatus("Ready");
                log("Game interface found. Bot is active.", "system");
            }
        }, 1000);
        updateInputDisabledState();
    }

    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });

})();

