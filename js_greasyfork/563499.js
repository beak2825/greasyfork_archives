// ==UserScript==
// @name         Trade Assistant
// @namespace    http://tampermonkey.net/
// @version      1.00.1
// @description  Trading Assistant for Torn.com
// @author       Oatshead [3487562]
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/563499/Trade%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/563499/Trade%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        commission: 3,
        showOnItemMarket: false,
        autoAddTradedValueMode: "none",
        flag1: true, // Enabled by default
        opt1: true,
        opt2: true,
        opt3: true,
        opt4: true,
        opt5: true,
        opt6: 200,
        tradeBreakdownMessage: `🏆 Trade Breakdown 🏆
Save {savings} compared to market!

💰 Breakdown:
- Market value: {market_value}\n- Traded value: {traded_value}
- Market fee (5%): {market_fee}\\n- My fee ({commission}%): {trade_fee}
- Your savings: {savings}

Safe & mug-free trade.`,
        tradeCompleteMessage: `🎉 Trade Complete! 🎉
Traded value: {traded_value}
Saved: {savings}

As promised, a safe, mug-free trade. Looking forward to the next one!`,
        salesPitchMessage: `Hi, if you trade your plushies/flowers directly with me you'll save 2%.

Market makes off 5% from you whereas I only charge {commission}%.\n\nI offer safe and mug-free trades. To get started, simply initiate a trade with me whenever you are ready.`,
        yourUserId: "",
        yourUsername: "",
        activationKey: "UNLOCKED",
        autoCopySettings: {
            stage1: {
                type: "none",
                silent: false,
                prioritizeCashAutoCopy: false
            },
            stage2: {
                type: "none",
                silent: false,
                prioritizeCashAutoCopy: false
            }
        },
        minCarryingBalance: 500000,
        cashCheckEnabled: true,
        numberFormatTraded: "short",
        numberFormatMarket: "short",
        cashRequiredFormatDisplay: "short",
        cashRequiredFormatCopy: "short",
        decimals: 2,
        minBalanceDisplay: {
            stage1: {
                mode: "default",
                showMissingAmount: true
            },
            stage2: {
                mode: "default",
                showMissingAmount: true
            }
        },
        debugLogs: [],
        maxLogs: 10,
        debugModeEnabled: true,
    };

    let config;

    // --- UNLOCK LOGIC ---
    // Always return true for validity checks
    function _cV() {
        return true;
    }
    // --------------------

    function _lTC(...args) {
        if (config && config.debugModeEnabled) {
            console.log('[Trade Helper Pro]', ...args);
        }
    }

    function addPersistentLog(...args) {
        if (config && Array.isArray(config.debugLogs)) {
            const logMessageParts = args.map(arg => {
                if (arg instanceof HTMLElement) {
                    const id = arg.id ? `#${arg.id}` : '';
                    const classes = arg.className ? `.${arg.className.split(' ').join('.')}` : '';
                    return `<${arg.tagName.toLowerCase()}${id}${classes}>`;
                } else if (typeof arg === 'object' && arg !== null) {
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                        return `[Object with circular ref or complex structure: ${e.message}]`;
                    }
                }
                return String(arg);
            });

            const logMessage = logMessageParts.join(' ');

            config.debugLogs.push({
                timestamp: new Date().toLocaleString(),
                message: logMessage
            });

            const maxLogs = typeof config.maxLogs === 'number' ? config.maxLogs : 10;
            if (config.debugLogs.length > maxLogs) {
                config.debugLogs.shift();
            }
        }
    }

    function saveConfig() {
        if (config) {
            _lTC('saveConfig: Attempting to save config to GM storage.', JSON.parse(JSON.stringify(config)));
            GM_setValue('tradeHelperConfig', JSON.parse(JSON.stringify(config)));
        }
    }

    function loadConfig() {
        _lTC('loadConfig: Attempting to load config from GM storage.');
        const savedConfig = GM_getValue('tradeHelperConfig');

        if (savedConfig) {
            for (const key in savedConfig) {
                if (Object.prototype.hasOwnProperty.call(savedConfig, key)) {
                    if (typeof savedConfig[key] === 'object' && savedConfig[key] !== null && !Array.isArray(savedConfig[key])) {
                        if (config[key] && typeof config[key] === 'object' && !Array.isArray(config[key])) {
                            config[key] = {...config[key], ...savedConfig[key]};
                        } else {
                            config[key] = savedConfig[key];
                        }
                    } else {
                        config[key] = savedConfig[key];
                    }
                }
            }
            // Ensure flags are unlocked even if loaded config says otherwise
            config.flag1 = true;
        } else {
            _lTC('loadConfig: No saved config found, using default values.');
        }
    }

    const settingsPages = [
        { id: 'generalInfo', title: 'General & User Info', pro: false },
        { id: 'autoAddTradedValue', title: 'Auto-add Traded Value', pro: false },
        { id: 'cashManagement', title: 'Cash Management', pro: false },
        { id: 'minBalanceDisplay', title: 'Min Balance Display (UI)', pro: false },
        { id: 'autoCopy', title: 'Auto-copy Settings', pro: false },
        { id: 'messageTemplates', title: 'Message Templates', pro: false },
        { id: 'detectionDebug', title: 'Detection & Debug', pro: false },
        { id: 'resetOptions', title: 'Reset Options', pro: false },
        { id: 'about', title: 'About', pro: false },
        { id: 'versionHistory', title: 'Version History', pro: false }
    ];

    const faqContent = [
        {
            id: 'autoCopyFeature',
            title: 'Auto-Copy Feature',
            description: `The Auto-Copy feature automatically copies relevant information to your clipboard after a trade analysis.`,
            pro: true
        },
        // ... (truncated standard FAQ content for brevity, functional logic remains same)
    ];

    let appState = {
        currentMode: 'main',
        currentResult: { marketValue: 0, marketFee: 0, tradeFee: 0, tradeValue: 0, savings: 0 },
        cashStatus: { sufficient: false, amountNeeded: 0 },
        lastDetectionResult: {},
        tradeStage: 1,
        popup: null,
        overlay: null,
        confirmationModal: null,
        isPro: true, // Always PRO
        isUserInfoSet: false,
        isSpecialModeUnlocked: true // Always Unlocked
    };

    GM_registerMenuCommand("⚙️ Configure Trade Helper", showTradeAnalysis);

    GM_addStyle(`
        .trade-enhancer-popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 800px; max-height: 85vh; background: rgba(20, 30, 40, 0.98); border-radius: 10px; padding: 20px; box-shadow: 0 0 30px rgba(0, 0, 0, 0.7); z-index: 99999; border: 1px solid #2a7d2f; font-family: Arial, sans-serif; color: #e0e0e0; display: none; overflow-y: auto; }
        .trade-enhancer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99998; display: none; }
        .enhancer-popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #3a556e; padding-bottom: 10px; position: sticky; top: 0; background: rgba(20, 30, 40, 0.98); z-index: 1; }
        .enhancer-popup-header h3 { color: #4CAF50; margin: 0; font-size: 1.4rem; }
        .enhancer-nav-btn, .enhancer-close-btn, .enhancer-faq-btn { background-color: #6a5acd; color: #fff; border: none; border-radius: 4px; cursor: pointer; padding: 6px 12px; font-weight: bold; font-size: 0.9rem; }
        .enhancer-nav-btn:hover, .enhancer-close-btn:hover, .enhancer-faq-btn:hover { background-color: #7b68ee; }
        .enhancer-close-btn { background-color: #555; }
        #mainPanel { width: 100%; display: block; }
        #settingsPanel, #faqPanel { display: none; flex-direction: row; gap: 20px; height: calc(85vh - 100px); overflow: hidden; }
        @media (max-width: 768px) { #settingsPanel, #faqPanel { flex-direction: column; height: auto; overflow-y: auto; } }
        .settings-nav, .faq-nav { flex: 0 0 200px; background: rgba(30, 45, 60, 0.8); border-radius: 8px; padding: 10px; overflow-y: auto; border-right: 1px solid #3a556e; }
        @media (max-width: 768px) { .settings-nav, .faq-nav { flex: none; width: 100%; border-right: none; border-bottom: 1px solid #3a556e; margin-bottom: 15px; } }
        .settings-nav-item, .faq-nav-item { padding: 10px 15px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; color: #c0c0c0; transition: background-color 0.2s, color 0.2s; font-weight: bold; font-size: 0.95rem; }
        .settings-nav-item:hover, .faq-nav-item:hover { background-color: rgba(60, 80, 100, 0.5); color: #fff; }
        .settings-nav-item.active, .faq-nav-item.active { background-color: #2a7d2f; color: #fff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); }
        .settings-content, .faq-content { flex: 1; background: rgba(30, 45, 60, 0.8); border-radius: 8px; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .settings-page, .faq-page { display: none; flex-grow: 1; }
        .settings-page.active, .faq-page.active { display: block; }
        .faq-search-bar { width: 100%; padding: 8px 12px; margin-bottom: 15px; border: 1px solid #3a556e; border-radius: 5px; background-color: rgba(50, 70, 90, 0.7); color: #e0e0e0; box-sizing: border-box; font-size: 1rem; }
        .enhancer-value-display { background: rgba(40, 60, 80, 0.6); border-radius: 8px; padding: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .enhancer-value-label { font-weight: bold; color: #8c9ba5; width: 60%; font-size: 0.95rem; }
        .enhancer-value-amount { font-size: 1.4rem; font-weight: bold; color: #4CAF50; text-align: right; width: 40%; }
        .enhancer-value-input { background: rgba(50, 70, 90, 0.7); border: 1px solid #3a556e; border-radius: 4px; color: #fff; font-size: 1.2rem; font-weight: bold; padding: 6px 10px; text-align: right; width: 100%; box-sizing: border-box; }
        .enhancer-input-container { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .enhancer-input-label { font-size: 13px; color: #8c9ba5; font-weight: bold; }
        .enhancer-btn-group { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; justify-content: space-between; }
        .enhancer-btn { background-color: #2a7d2f; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.3s; text-align: center; font-size: 13px; flex: 1 1 auto; min-width: 140px; }
        .enhancer-btn:hover { background-color: #1d8c2f; transform: translateY(-2px); }
        .enhancer-btn.secondary { background-color: #3a556e; }
        .enhancer-btn.blue { background-color: #1a5c7a; }
        #enhancerAutoAddTradedValueBtn { flex-basis: calc(33.33% - 7px); flex-grow: 0; flex-shrink: 1; width: 120px; height: 30px; padding: 5px 8px; font-size: 11px; background-color: #8b008b; }
        #enhancerAutoAddTradedValueBtn:hover { background-color: #9932cc; }
        .enhancer-message-box { background: rgba(20, 35, 50, 0.7); border-radius: 8px; padding: 15px; margin-top: 15px; border-left: 4px solid #3a556e; font-family: monospace; white-space: pre-wrap; line-height: 1.6; max-height: 150px; overflow-y: auto; font-size: 12px; }
        .copied-indicator { color: #4CAF50; font-weight: bold; margin-left: 8px; opacity: 0; transition: opacity 0.3s; font-size: 0.9rem; }
        .copied { opacity: 1; }
        #tradeEnhancerBtn, #tradeHelperBtn { background-color: #1d8c2f; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold; cursor: pointer; margin-left: 0 !important; transition: all 0.3s; font-size: 0.9rem; }
        #tradeHelperBtn { background-color: #1a5c7a; }
        #tradeFaqBtn { background-color: #6a5acd; margin-left: 2px !important; }
        #tradeFaqBtn:hover { background-color: #7b68ee; }
        #tradeEnhancerButtonGroup { display: flex; gap: 2px; margin-left: 15px; }
        .enhancer-credit { margin-top: 15px; padding-top: 10px; border-top: 1px dashed #3a556e; text-align: center; font-size: 12px; color: #8c9ba5; }
        .enhancer-credit a { color: #4CAF50; text-decoration: none; }
        .settings-row { display: flex; align-items: flex-start; margin-bottom: 12px; gap: 12px; }
        .settings-label { width: 180px; font-weight: bold; color: #8c9ba5; padding-top: 8px; font-size: 13px; }
        .settings-input { flex: 1; background: rgba(50, 70, 90, 0.7); border: 1px solid #3a556e; border-radius: 4px; color: #fff; padding: 6px 10px; font-size: 13px; }
        .settings-checkbox { width: 18px; height: 18px; accent-color: #4CAF50; }
        .settings-textarea { flex: 1; background: rgba(50, 70, 90, 0.7); border: 1px solid #3a556e; border-radius: 4px; color: #fff; padding: 6px 10px; min-height: 80px; resize: vertical; font-family: monospace; font-size: 12px; line-height: 1.4; }
        .settings-buttons { display: flex; justify-content: flex-end; gap: 8px; margin-top: auto; padding-top: 15px; border-top: 1px solid #3a556e; }
        .settings-buttons .enhancer-btn { padding: 6px 10px; font-size: 0.85rem; flex: 0 0 auto; width: 90px; height: 30px; }
        .placeholder-hint { font-size: 11px; color: #8c9ba5; margin-top: 6px; padding: 8px; background: rgba(40, 60, 80, 0.3); border-radius: 4px; border-left: 3px solid #4CAF50; }
        .placeholder-list { margin-top: 6px; padding-left: 0; list-style: none; }
        .placeholder-list li { margin-bottom: 4px; font-family: monospace; font-size: 11px; }
        .placeholder-list code { background: rgba(60, 80, 100, 0.5); padding: 1px 4px; border-radius: 3px; color: #4CAF50; font-weight: bold; }
        .warning-message { background: rgba(255, 193, 7, 0.1); border: 1px solid #ffc107; padding: 8px; margin: 8px 0; color: #ffc107; font-weight: bold; text-align: center; font-size: 12px; }
        .detection-info { background: rgba(40, 60, 80, 0.4); border-radius: 4px; padding: 8px; margin: 8px 0; font-size: 11px; color: #8c9ba5; border-left: 3px solid #2196F3; }
        .detection-log { background: rgba(40, 60, 80, 0.4); border-radius: 4px; padding: 8px; margin: 8px 0; font-size: 11px; color: #8c9ba5; border-left: 3px solid #ff9800; max-height: 120px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; }
        .cash-status { font-size: 1.3rem; font-weight: bold; text-align: center; padding: 8px; border-radius: 8px; margin: 12px 0; }
        .cash-sufficient { background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; }
        .cash-insufficient { background: rgba(244, 67, 54, 0.2); color: #F44336; border: 2px solid #F44336; }
        .cash-sufficient-partial { background: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 2px solid #4CAF50; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; font-size: 1.3rem; }
        .cash-status-small-red { color: #F44336; font-size: 0.7em; margin-left: 5px; font-weight: normal; }
        .commission-display { font-size: 0.9rem; color: #8c9ba5; margin-left: 5px; font-weight: normal; }
        .stage-indicator { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-left: 8px; }
        .stage-1 { background-color: #4CAF50; color: white; }
        .stage-2 { background-color: #2196F3; color: white; }
        .thp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; }
        .thp-modal-content { background: rgba(20, 30, 40, 0.98); border-radius: 10px; padding: 25px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.7); z-index: 100001; border: 1px solid #2a7d2f; color: #e0e0e0; text-align: center; max-width: 400px; width: 90%; }
        .thp-modal-content h4 { color: #ffc107; margin-top: 0; margin-bottom: 15px; font-size: 1.3rem; }
        .thp-modal-content p { margin-bottom: 20px; line-height: 1.5; font-size: 1rem; }
        .thp-modal-buttons { display: flex; justify-content: center; gap: 15px; }
        .thp-modal-buttons button { padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; font-weight: bold; transition: background-color 0.2s; }
        .thp-modal-buttons .confirm-btn { background-color: #F44336; color: white; }
        .thp-modal-buttons .confirm-btn:hover { background-color: #d32f2f; }
        .thp-modal-buttons .cancel-btn { background-color: #3a556e; color: white; }
        .thp-modal-buttons .cancel-btn:hover { background-color: #2c4050; }
        .debug-log-container { background: rgba(30, 45, 60, 0.8); border-radius: 8px; padding: 10px; max-height: 250px; overflow-y: auto; margin-top: 10px; border: 1px solid #3a556e; }
        .debug-log-entry { display: flex; align-items: flex-start; margin-bottom: 5px; padding: 5px; background: rgba(40, 60, 80, 0.4); border-radius: 4px; font-size: 0.85rem; line-height: 1.3; word-break: break-word; }
        .debug-log-entry:last-child { margin-bottom: 0; }
        .log-number { font-weight: bold; color: #4CAF50; margin-right: 8px; flex-shrink: 0; }
        .log-timestamp { color: #8c9ba5; margin-right: 8px; flex-shrink: 0; }
        .log-message { flex-grow: 1; color: #e0e0e0; }
        .debug-copy-btn { background-color: #555; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 0.75rem; margin-left: 10px; flex-shrink: 0; }
        .debug-copy-btn:hover { background-color: #777; }
        .about-section h5 { color: #2196F3; font-size: 1.1rem; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px dotted #3a556e; padding-bottom: 5px; }
        .about-section ul { list-style: none; padding-left: 0; }
        .about-section ul li { margin-bottom: 8px; padding-left: 15px; position: relative; }
        .about-section ul li::before { content: '✨'; position: absolute; left: 0; color: #4CAF50; }
        .about-section p { line-height: 1.5; margin-bottom: 10px; color: #c0c0c0; }
        .about-section a { color: #4CAF50; text-decoration: none; font-weight: bold; }
        .about-section a:hover { text-decoration: underline; }
        .version-entry { background: rgba(40, 60, 80, 0.4); border-radius: 8px; padding: 12px; margin-bottom: 15px; border-left: 4px solid #6a5acd; }
        .version-entry h5 { color: #6a5acd; margin-top: 0; margin-bottom: 8px; font-size: 1.1rem; }
        .version-entry p { font-size: 0.95rem; line-height: 1.4; color: #c0c0c0; }
    `);

    function getCleanScriptVersion() {
        let rawVersion = GM_info.script.version;
        const match = rawVersion.match(/^(\d+(?:\.\d+)*)/);
        if (match && match[1]) {
            return match[1];
        }
        return 'Unknown Version';
    }

    function generateMessage(template, result, commission) {
        let message = template;
        message = message.replace(/{market_value}/g, formatNumber(result.marketValue, true, 'market'));
        message = message.replace(/{traded_value}/g, formatNumber(result.tradeValue, true, 'traded'));
        message = message.replace(/{market_fee}/g, formatNumber(result.marketFee, true, 'market'));
        message = message.replace(/{trade_fee}/g, formatNumber(result.tradeFee, true, 'traded'));
        message = message.replace(/{savings}/g, formatNumber(result.savings, true, 'traded'));
        message = message.replace(/{commission}/g, commission.toFixed(1));
        return message;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function createSummaryOfChangesHTML() {
        return `
            <div id="versionHistoryPage" class="settings-page">
                <h4>Version History</h4>
                <div class="version-entry">
                    <h5>Version 12.48.1 (Unlocked)</h5>
                    <p>Modified to unlock all PRO and Advanced+ features by default.</p>
                </div>
            </div>
        `;
    }

    function createFAQPanelHTML() {
        let navHtml = '<div class="faq-nav">';
        navHtml += '<input type="text" id="faqSearchInput" class="faq-search-bar" placeholder="Search FAQ...">';
        navHtml += '<div id="faqNavItems">';
        faqContent.forEach((item) => {
           navHtml += `<div class="faq-nav-item" data-faq-id="${item.id}">${item.title}</div>`;
        });
        navHtml += '</div>';
        navHtml += '</div>';

        let contentHtml = '<div class="faq-content">';
        contentHtml += '<div id="faqDescriptionArea">';
        contentHtml += '<h4 id="faqDescriptionTitle">Welcome to the FAQ!</h4>';
        contentHtml += '<div id="faqDescriptionContent" class="faq-description-content">';
        contentHtml += '<p>Select a feature from the left to learn more, or use the search bar above.</p>';
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '</div>';

        return `
            <div id="faqPanel">
                ${navHtml}
                ${contentHtml}
            </div>
        `;
    }

    function createSettingsPanelHTML() {
        const isPro = true; // Always PRO

        const placeholdersContent = `
            <div class="placeholder-hint">
                <p>You can use the following placeholders in any message template:</p>
                <ul class="placeholder-list">
                    <li><code>{market_value}</code> - Total market value of customer's items</li>
                    <li><code>{traded_value}</code> - Cash amount you will offer (after your commission)</li>
                    <li><code>{market_fee}</code> - Standard Torn market fee (5% of market value)</li>
                    <li><code>{trade_fee}</code> - Your commission fee</li>
                    <li><code>{savings}</code> - Amount customer saves by trading with you</li>
                    <li><code>{commission}</code> - Your commission percentage</li>
                </ul>
                <p>Note: Some placeholders may not be applicable in certain contexts and will be replaced with 'N/A' if no value is available.</p>
            </div>
        `;

        let navHtml = '<div class="settings-nav">';
        settingsPages.forEach((page, index) => {
            navHtml += `<div class="settings-nav-item ${index === 0 ? 'active' : ''}" data-page="${page.id}">${page.title}</div>`;
        });
        navHtml += '</div>';

        let settingsContentInnerHtml = '';

        settingsContentInnerHtml += `
            <div id="generalInfoPage" class="settings-page active">
                <h4>General & User Info</h4>
                <div class="settings-row">
                    <div class="settings-label">Your Username</div>
                    <input type="text" id="yourUsername" class="settings-input" value="${escapeHtml(config.yourUsername)}" placeholder="Your Torn username" readonly title="Automatically detected from Torn.com profile.">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Your User ID</div>
                    <input type="text" id="yourUserId" class="settings-input" value="${escapeHtml(config.yourUserId)}" placeholder="Your Torn user ID" readonly title="Automatically detected from Torn.com profile.">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Commission Rate (%)</div>
                    <input type="number" id="commissionRate" class="settings-input" value="${config.commission}" min="1" max="10" step="0.1">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show on Item Market</div>
                    <input type="checkbox" id="showOnItemMarket" class="settings-checkbox" ${config.showOnItemMarket ? 'checked' : ''}>
                </div>
                <div class="placeholder-hint">
                    <p><b>Market Value Detection:</b> This script relies on Torn Tools (or similar extensions) to automatically detect the total market value of items in a trade. If Torn Tools is not running, automatic detection may not work.</p>
                    <p>You can always manually enter or adjust the "Market Value" in the main popup, and all calculations will dynamically update.</p>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="autoAddTradedValuePage" class="settings-page">
                <h4>Auto-add Traded Value (Stage 1)</h4>
                <div class="settings-row">
                    <div class="settings-label">Auto-add Mode</div>
                    <select id="autoAddTradedValueMode" class="settings-input">
                        <option value="none" ${config.autoAddTradedValueMode === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="basic" ${config.autoAddTradedValueMode === 'basic' ? 'selected' : ''}>Basic (Auto-fill only)</option>
                        <option value="advanced" ${config.autoAddTradedValueMode === 'advanced' ? 'selected' : ''}>Advanced (Auto-fill & Click Change)</option>
                        <option value="advanced_plus" ${config.autoAddTradedValueMode === 'advanced_plus' ? 'selected' : ''}>Advanced+ (Highly Discreet)</option>
                    </select>
                </div>
                <div id="advancedPlusSettingsContainer" style="display: ${config.autoAddTradedValueMode === 'advanced_plus' ? 'block' : 'none'};">
                    <hr style="border-color: #3a556e; margin: 20px 0;">
                    <h5>Advanced+ Realism Settings (Only for Advanced+ Mode)</h5>
                    <div class="settings-row">
                        <div class="settings-label">Enable Typing Errors</div>
                        <input type="checkbox" id="enableTypingErrors" class="settings-checkbox" ${config.opt1 ? 'checked' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Pre-Click Hesitation</div>
                        <input type="checkbox" id="enablePreClickHesitation" class="settings-checkbox" ${config.opt2 ? 'checked' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Micro-Interactions</div>
                        <input type="checkbox" id="enableMicroInteractions" class="settings-checkbox" ${config.opt3 ? 'checked' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Keyboard Simulations</div>
                        <input type="checkbox" id="enableKeyboardSimulations" class="settings-checkbox" ${config.opt4 ? 'checked' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Human-in-Loop Prompt</div>
                        <input type="checkbox" id="enableHumanInLoopPrompt" class="settings-checkbox" ${config.opt5 ? 'checked' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Human-in-Loop Frequency (1 in X)</div>
                        <input type="number" id="humanInLoopFrequency" class="settings-input" value="${config.opt6}" min="10" max="1000" step="10">
                    </div>
                </div>
                <div class="placeholder-hint">
                    <p><b>Note:</b> For "Auto-add Traded Value" to function correctly, ensure your <b>Stage 1 Auto-copy</b> setting (found under "Auto-copy Settings") is configured to copy "Traded Value" or "Missing Cash Amount" (with prioritization). This allows the script to retrieve the necessary value for auto-filling.</p>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="cashManagementPage" class="settings-page">
                <h4>Cash Management</h4>
                <div class="settings-row">
                    <div class="settings-label">Enable Cash Check</div>
                    <input type="checkbox" id="cashCheckEnabled" class="settings-checkbox" ${config.cashCheckEnabled ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Minimum Carrying Balance</div>
                    <input type="text" id="minCarryingBalance" class="settings-input" value="${escapeHtml(formatShort(config.minCarryingBalance, false))}" placeholder="e.g., 500k, 1.2m or 0">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Traded Value Format</div>
                    <select id="numberFormatTraded" class="settings-input">
                        <option value="short" ${config.numberFormatTraded === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.numberFormatTraded === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Market Value Format</div>
                    <select id="numberFormatMarket" class="settings-input">
                        <option value="short" ${config.numberFormatMarket === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.numberFormatMarket === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Cash Required Display Format</div>
                    <select id="cashRequiredFormatDisplay" class="settings-input">
                        <option value="short" ${config.cashRequiredFormatDisplay === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.cashRequiredFormatDisplay === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Cash Required Copy Format</div>
                    <select id="cashRequiredFormatCopy" class="settings-input">
                        <option value="short" ${config.cashRequiredFormatCopy === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.cashRequiredFormatCopy === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Decimal Places (for Short Format)</div>
                    <input type="number" id="decimals" class="settings-input" value="${config.decimals}" min="0" max="3" step="1">
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="minBalanceDisplayPage" class="settings-page">
                <h4>Min Balance Display (UI)</h4>
                <h5>Stage 1 Display:</h5>
                <div class="settings-row">
                    <div class="settings-label">Display Mode</div>
                    <select id="minBalanceDisplayModeStage1" class="settings-input">
                        <option value="default" ${config.minBalanceDisplay.stage1.mode === 'default' ? 'selected' : ''}>Default (Green/Red)</option>
                        <option value="always_red_cross" ${config.minBalanceDisplay.stage1.mode === 'always_red_cross' ? 'selected' : ''}>Always Red with Cross</option>
                        <option value="green_with_small_red" ${config.minBalanceDisplay.stage1.mode === 'green_with_small_red' ? 'selected' : ''}>Green with Small Red (if trade value met)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show Missing Amount Text</div>
                    <input type="checkbox" id="minBalanceShowMissingAmountStage1" class="settings-checkbox" ${config.minBalanceDisplay.stage1.showMissingAmount ? 'checked' : ''}>
                </div>

                <h5>Stage 2 Display:</h5>
                <div class="settings-row">
                    <div class="settings-label">Display Mode</div>
                    <select id="minBalanceDisplayModeStage2" class="settings-input">
                        <option value="default" ${config.minBalanceDisplay.stage2.mode === 'default' ? 'selected' : ''}>Default (Green/Red)</option>
                        <option value="always_red_cross" ${config.minBalanceDisplay.stage2.mode === 'always_red_cross' ? 'selected' : ''}>Always Red with Cross</option>
                        <option value="green_with_small_red" ${config.minBalanceDisplay.stage2.mode === 'green_with_small_red' ? 'selected' : ''}>Green with Small Red (if trade value met)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show Missing Amount Text</div>
                    <input type="checkbox" id="minBalanceShowMissingAmountStage2" class="settings-checkbox" ${config.minBalanceDisplay.stage2.showMissingAmount ? 'checked' : ''}>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="autoCopyPage" class="settings-page">
                <h4>Auto-copy Settings</h4>
                <h5>Stage 1 Auto-copy:</h5>
                <div class="settings-row">
                    <div class="settings-label">Auto-copy on Analyze</div>
                    <select id="autoCopySettingStage1" class="settings-input">
                        <option value="none" ${config.autoCopySettings.stage1.type === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="traded_value" ${config.autoCopySettings.stage1.type === 'traded_value' ? 'selected' : ''}>Traded Value</option>
                        <option value="trade_breakdown" ${config.autoCopySettings.stage1.type === 'trade_breakdown' ? 'selected' : ''}>Trade Breakdown Message</option>
                        <option value="trade_complete" ${config.autoCopySettings.stage1.type === 'trade_complete' ? 'selected' : ''}>Trade Complete Message</option>
                        <option value="missing_cash" ${config.autoCopySettings.stage1.type === 'missing_cash' ? 'selected' : ''}>Missing Cash Amount</option>
                        <option value="cash_on_hand_minus_min_balance" ${config.autoCopySettings.stage1.type === 'cash_on_hand_minus_min_balance' ? 'selected' : ''}>Cash on Hand (minus Min Balance)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Silent Auto-copy</div>
                    <input type="checkbox" id="autoCopySilentStage1" class="settings-checkbox" ${config.autoCopySettings.stage1.silent ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Prioritize Missing Cash Auto-copy</div>
                    <input type="checkbox" id="prioritizeCashAutoCopyStage1" class="settings-checkbox" ${config.autoCopySettings.stage1.prioritizeCashAutoCopy ? 'checked' : ''}>
                </div>

                <h5>Stage 2 Auto-copy:</h5>
                <div class="settings-row">
                    <div class="settings-label">Auto-copy on Analyze</div>
                    <select id="autoCopySettingStage2" class="settings-input">
                        <option value="none" ${config.autoCopySettings.stage2.type === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="traded_value" ${config.autoCopySettings.stage2.type === 'traded_value' ? 'selected' : ''}>Traded Value</option>
                        <option value="trade_breakdown" ${config.autoCopySettings.stage2.type === 'trade_breakdown' ? 'selected' : ''}>Trade Breakdown Message</option>
                        <option value="trade_complete" ${config.autoCopySettings.stage2.type === 'trade_complete' ? 'selected' : ''}>Trade Complete Message</option>
                        <option value="missing_cash" ${config.autoCopySettings.stage2.type === 'missing_cash' ? 'selected' : ''}>Missing Cash Amount</option>
                        <option value="cash_on_hand_minus_min_balance" ${config.autoCopySettings.stage2.type === 'cash_on_hand_minus_min_balance' ? 'selected' : ''}>Cash on Hand (minus Min Balance)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Silent Auto-copy</div>
                    <input type="checkbox" id="autoCopySilentStage2" class="settings-checkbox" ${config.autoCopySettings.stage2.silent ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Prioritize Missing Cash Auto-copy</div>
                    <input type="checkbox" id="prioritizeCashAutoCopyStage2" class="settings-checkbox" ${config.autoCopySettings.stage2.prioritizeCashAutoCopy ? 'checked' : ''}>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="messageTemplatesPage" class="settings-page">
                <h4>Message Templates</h4>
                <div class="settings-row">
                    <div class="settings-label">Trade Breakdown Message</div>
                    <textarea id="tradeBreakdownMessage" class="settings-textarea">${escapeHtml(config.tradeBreakdownMessage)}</textarea>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Trade Complete Message</div>
                    <textarea id="tradeCompleteMessage" class="settings-textarea">${escapeHtml(config.tradeCompleteMessage)}</textarea>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Sales Pitch Message</div>
                    <textarea id="salesPitchMessage" class="settings-textarea">${escapeHtml(config.salesPitchMessage)}</textarea>
                </div>
                ${placeholdersContent}
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="detectionDebugPage" class="settings-page">
                <h4>Detection & Debug</h4>
                <div class="settings-row">
                    <div class="settings-label">Enable Debug Console Logging</div>
                    <input type="checkbox" id="debugModeEnabled" class="settings-checkbox" ${config.debugModeEnabled ? 'checked' : ''}>
                </div>
                <p class="placeholder-hint">
                    This section displays information about the <strong>last analyzed trade</strong>.
                    To get the most accurate debug data, first click the "🔍 Analyze" button on a trade page,
                    then open these settings.
                </p>
                <div id="warningMessage" class="warning-message" style="display: none;"></div>
                <div id="detectionInfo" class="detection-info"></div>
                <div id="detectionLog" class="detection-log">
                </div>
                <div class="settings-row" style="justify-content: flex-end; margin-top: 15px; gap: 8px;">
                    <button class="enhancer-btn secondary" id="clearLogsBtn">Clear All Logs</button>
                    <button class="enhancer-btn secondary" id="copyLast3LogsBtn">📋 Copy Last 3 Logs</button>
                    <button class="enhancer-btn secondary" id="copyAllLogsBtn">📋 Copy All Logs</button>
                </div>
                <div id="debugLogContainer" class="debug-log-container">
                </div>
                <button class="enhancer-btn" id="copyDebugInfoBtn" style="margin-top: 15px;">📋 Copy Debug Info</button>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="resetOptionsPage" class="settings-page">
                <h4>Reset Options</h4>
                <p class="placeholder-hint">
                    Use these options to reset your Trade Helper Pro settings.
                    This cannot be undone without manually re-entering your preferences.
                </p>
                <div class="settings-row">
                    <button class="enhancer-btn secondary" id="resetSettingsOnlyBtn" style="flex: 1;">Reset Settings Only</button>
                </div>
                <p class="placeholder-hint">
                    Resets all settings to default, but keeps your custom message templates.
                </p>
                <div class="settings-row">
                    <button class="enhancer-btn secondary" id="fullResetBtn" style="flex: 1; background-color: #F44336;">Full Reset</button>
                </div>
                <p class="placeholder-hint" style="border-left-color: #F44336;">
                    Resets ALL settings, custom message templates, and user info to default.
                    This is irreversible.
                </p>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="aboutPage" class="settings-page about-section">
                <h4>About Trade Helper Pro (Unlocked)</h4>
                <p>
                    Trade Helper Pro is an advanced Tampermonkey script designed to streamline your trading experience on Torn.com.
                    It provides real-time trade analysis and powerful automation features to enhance your efficiency and profitability.
                </p>
                <h5>💡 Key Features:</h5>
                <ul>
                    <li><strong>Real-time Trade Analysis:</strong> Instantly calculates traded value, market fees, your commission, and customer savings.</li>
                    <li><strong>Smart Cash Management:</strong> Monitors your cash on hand against a customizable minimum balance, providing clear visual alerts.</li>
                    <li><strong>Customizable Messages:</strong> Generate and auto-copy personalized trade breakdown, completion, and sales pitch messages with dynamic placeholders.</li>
                    <li><strong>Automated Value Addition:</strong> For Stage 1 trades, automatically fills and can submit the calculated traded value, saving clicks.</li>
                    <li><strong>Persistent Settings:</strong> All your preferences are saved locally and persist across browser sessions and refreshes.</li>
                    <li><strong>Detailed Debugging:</strong> Access comprehensive trade detection logs and persistent script activity logs for troubleshooting.</li>
                </ul>
            </div>
        `;

        settingsContentInnerHtml += createSummaryOfChangesHTML();


        settingsContentInnerHtml += `
            <div class="settings-buttons">
                <button class="enhancer-btn secondary" id="settingsCancelBtn">Cancel</button>
                <button class="enhancer-btn" id="settingsSaveBtn">💾 Save Settings</button>
            </div>
        `;

        let contentHtml = `<div class="settings-content">${settingsContentInnerHtml}</div>`;

        return `
            <div id="settingsPanel">
                ${navHtml}
                ${contentHtml}
            </div>
        `;
    }
    async function waitForElement(selector, timeout = 5000, interval = 50) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
                } else {
                    setTimeout(checkElement, interval);
                }
            };
            checkElement();
        });
    }

    async function renderDebugLogs() {
        let logContainer;
        try {
            logContainer = await waitForElement('#debugLogContainer');
        } catch (error) {
            return;
        }

        logContainer.innerHTML = '';

        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            logContainer.innerHTML = '<p style="text-align: center; color: #8c9ba5; padding: 10px;">No debug logs available.</p>';
            return;
        }

        config.debugLogs.forEach((log, index) => {
            const logEntryDiv = document.createElement('div');
            logEntryDiv.className = 'debug-log-entry';

            const logNumberSpan = document.createElement('span');
            logNumberSpan.className = 'log-number';
            logNumberSpan.textContent = `${index + 1}.`;

            const logTimestampSpan = document.createElement('span');
            logTimestampSpan.className = 'log-timestamp';
            logTimestampSpan.textContent = `[${escapeHtml(log.timestamp)}]`;

            const logMessageSpan = document.createElement('span');
            logMessageSpan.className = 'log-message';
            logMessageSpan.textContent = escapeHtml(log.message);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'enhancer-btn debug-copy-btn';
            copyBtn.textContent = '📋 Copy';

            copyBtn.addEventListener('click', () => {
                const fullLog = `[${log.timestamp}] ${log.message}`;
                GM_setClipboard(fullLog, 'text');
                showCopiedIndicator(copyBtn, 'Copied!');
            });

            logEntryDiv.appendChild(logNumberSpan);
            logEntryDiv.appendChild(logTimestampSpan);
            logEntryDiv.appendChild(logMessageSpan);
            logEntryDiv.appendChild(copyBtn);

            logContainer.appendChild(logEntryDiv);
        });
    }

    function copySelectedLogs(numLogs) {
        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            GM_setClipboard("No debug logs available to copy.", 'text');
            showCopiedIndicator(document.getElementById(`copyLast${numLogs}LogsBtn`) || document.getElementById('copyAllLogsBtn'), 'Nothing to copy!');
            return;
        }

        const logsToCopy = config.debugLogs.slice(-numLogs);
        const content = logsToCopy.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        GM_setClipboard(content, 'text');
        showCopiedIndicator(document.getElementById(`copyLast${numLogs}LogsBtn`), `Copied last ${logsToCopy.length} logs!`);
    }

    function copyAllLogs() {
        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            GM_setClipboard("No debug logs available to copy.", 'text');
            showCopiedIndicator(document.getElementById('copyAllLogsBtn'), 'Nothing to copy!');
            return;
        }

        const content = config.debugLogs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        GM_setClipboard(content, 'text');
        showCopiedIndicator(document.getElementById('copyAllLogsBtn'), `Copied all ${config.debugLogs.length} logs!`);
    }


    function formatNumber(amount, includeDollar = true, formatPreference = 'traded') {
        let format;
        if (formatPreference === 'traded') {
            format = config.numberFormatTraded;
        } else if (formatPreference === 'market') {
            format = config.numberFormatMarket;
        } else if (formatPreference === 'cashRequiredDisplay') {
            format = config.cashRequiredFormatDisplay;
        } else if (formatPreference === 'cashRequiredCopy') {
            format = config.cashRequiredFormatCopy;
        } else {
            format = "short";
        }

        if (format === "short") {
            return formatShort(amount, includeDollar);
        }

        const formatted = Math.round(amount).toLocaleString();
        return includeDollar ? `$${formatted}` : formatted;
    }

    function formatShort(amount, includeDollar = true) {
        let formatted = "";
        const currentDecimals = config.decimals;

        if (amount >= 1000000) {
            const value = amount / 1000000;
            formatted = value.toFixed(currentDecimals).replace(/\.0+$/, '') + 'm';
        } else if (amount >= 1000) {
            const value = amount / 1000;
            formatted = value.toFixed(currentDecimals).replace(/\.0+$/, '') + 'k';
        } else {
            formatted = Math.round(amount).toString();
        }

        return includeDollar ? `$${formatted}` : formatted;
    }

    function parseShort(input) {
        const cleanInput = (input || '').toString().trim().toLowerCase().replace(/[^0-9km.]/g, '');
        if (!cleanInput) return 0;

        const numValue = parseFloat(cleanInput.replace(/[km]$/, ''));
        if (isNaN(numValue)) return 0;

        if (cleanInput.endsWith('m')) {
            return Math.round(numValue * 1000000);
        } else if (cleanInput.endsWith('k')) {
            return Math.round(numValue * 1000);
        }
        return Math.round(numValue);
    }

    function getUserCash() {
        try {
            const cashElement = document.getElementById('user-money');
            if (!cashElement) return 0;

            if (cashElement.dataset.money) {
                return parseInt(cashElement.dataset.money, 10) || 0;
            }

            const cashText = cashElement.textContent || '';
            const cashValue = cashText.replace(/[^0-9.]/g, '');
            return parseInt(cashValue, 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function checkCashAvailability(tradeValue, stage) {
        if (!config.cashCheckEnabled) return null;

        const cashOnHand = getUserCash();
        const minBalance = config.minCarryingBalance || 0;

        let requiredTotal, amountNeeded, sufficientForTradeValueOnly;

        if (stage === 1) {
            requiredTotal = tradeValue + minBalance;
            amountNeeded = Math.max(0, requiredTotal - cashOnHand);
            sufficientForTradeValueOnly = (cashOnHand >= tradeValue);
        } else {
            requiredTotal = minBalance;
            amountNeeded = Math.max(0, minBalance - cashOnHand);
            sufficientForTradeValueOnly = true;
        }

        return {
            cashOnHand,
            minBalance,
            requiredTotal,
            amountNeeded,
            sufficient: amountNeeded <= 0,
            sufficientForTradeValueOnly
        };
    }

    function updateCashStatusDisplay(status, stage) {
        const display = document.getElementById('cashStatusDisplay');
        if (!display) {
            return;
        }

        if (!status || !config.cashCheckEnabled) {
            display.style.display = 'none';
            return;
        }

        display.style.display = 'block';

        const currentDisplayMode = config.minBalanceDisplay[`stage${stage}`].mode;
        const showMissingAmountText = config.minBalanceDisplay[`stage${stage}`].showMissingAmount;

        if (status.sufficient) {
            display.className = 'cash-status cash-sufficient';
            display.textContent = '✅ Sufficient Funds';
        } else {
            if (currentDisplayMode === "always_red_cross") {
                display.className = 'cash-status cash-insufficient';
                display.textContent = `❌ Need ${showMissingAmountText ? formatNumber(status.amountNeeded, true, 'cashRequiredDisplay') + ' more' : 'more funds'}`;
            } else if (currentDisplayMode === "green_with_small_red" && (stage === 2 || status.sufficientForTradeValueOnly)) {
                let text = '';
                if (stage === 1) {
                    text = `✅ Funds for Trade Value. `;
                } else {
                    text = `✅ Traded Value Met. `;
                }
                let smallRedText = '';
                if (showMissingAmountText) {
                    smallRedText = `(Need ${formatNumber(status.amountNeeded, true, 'cashRequiredDisplay')} for min balance)`;
                }
                else {
                    smallRedText = `(Min balance not met)`;
                }
                display.innerHTML = `${text}<span class="cash-status-small-red">${smallRedText}</span>`;
                display.className = 'cash-status cash-sufficient-partial';
            } else {
                display.className = 'cash-status cash-insufficient';
                display.textContent = `❌ Need ${showMissingAmountText ? formatNumber(status.amountNeeded, true, 'cashRequiredDisplay') + ' more' : 'more funds'}`;
            }
        }
    }

    function updateSettingsUI() {
        const yourUsernameEl = document.getElementById('yourUsername');
        if (yourUsernameEl) {
            yourUsernameEl.value = config.yourUsername;
            yourUsernameEl.readOnly = true;
            yourUsernameEl.title = "Automatically detected from Torn.com profile.";
        }
        const yourUserIdEl = document.getElementById('yourUserId');
        if (yourUserIdEl) {
            yourUserIdEl.value = config.yourUserId;
            yourUserIdEl.readOnly = true;
            yourUserIdEl.title = "Automatically detected from Torn.com profile.";
        }
        const commissionRateEl = document.getElementById('commissionRate');
        if (commissionRateEl) commissionRateEl.value = config.commission;

        const showOnItemMarketEl = document.getElementById('showOnItemMarket');
        if (showOnItemMarketEl) {
            showOnItemMarketEl.checked = config.showOnItemMarket;
        }
        const autoAddTradedValueModeEl = document.getElementById('autoAddTradedValueMode');
        if (autoAddTradedValueModeEl) {
            autoAddTradedValueModeEl.value = config.autoAddTradedValueMode;
            autoAddTradedValueModeEl.dataset.oldValue = config.autoAddTradedValueMode;
        }

        const advancedPlusSettingsContainer = document.getElementById('advancedPlusSettingsContainer');
        if (advancedPlusSettingsContainer) {
            advancedPlusSettingsContainer.style.display = config.autoAddTradedValueMode === 'advanced_plus' ? 'block' : 'none';
        }

        const enableTypingErrorsEl = document.getElementById('enableTypingErrors');
        if (enableTypingErrorsEl) { enableTypingErrorsEl.checked = config.opt1; }
        const enablePreClickHesitationEl = document.getElementById('enablePreClickHesitation');
        if (enablePreClickHesitationEl) { enablePreClickHesitationEl.checked = config.opt2; }
        const enableMicroInteractionsEl = document.getElementById('enableMicroInteractions');
        if (enableMicroInteractionsEl) { enableMicroInteractionsEl.checked = config.opt3; }
        const enableKeyboardSimulationsEl = document.getElementById('enableKeyboardSimulations');
        if (enableKeyboardSimulationsEl) { enableKeyboardSimulationsEl.checked = config.opt4; }
        const enableHumanInLoopPromptEl = document.getElementById('enableHumanInLoopPrompt');
        if (enableHumanInLoopPromptEl) { enableHumanInLoopPromptEl.checked = config.opt5; }
        const humanInLoopFrequencyEl = document.getElementById('humanInLoopFrequency');
        if (humanInLoopFrequencyEl) { humanInLoopFrequencyEl.value = config.opt6; }


        const cashCheckEnabledEl = document.getElementById('cashCheckEnabled');
        if (cashCheckEnabledEl) cashCheckEnabledEl.checked = config.cashCheckEnabled;
        const minCarryingBalanceEl = document.getElementById('minCarryingBalance');
        if (minCarryingBalanceEl) minCarryingBalanceEl.value = formatShort(config.minCarryingBalance, false);

        const numberFormatTradedEl = document.getElementById('numberFormatTraded');
        if (numberFormatTradedEl) { numberFormatTradedEl.value = config.numberFormatTraded; }
        const numberFormatMarketEl = document.getElementById('numberFormatMarket');
        if (numberFormatMarketEl) { numberFormatMarketEl.value = config.numberFormatMarket; }
        const cashRequiredFormatDisplayEl = document.getElementById('cashRequiredFormatDisplay');
        if (cashRequiredFormatDisplayEl) { cashRequiredFormatDisplayEl.value = config.cashRequiredFormatDisplay; }
        const cashRequiredFormatCopyEl = document.getElementById('cashRequiredFormatCopy');
        if (cashRequiredFormatCopyEl) { cashRequiredFormatCopyEl.value = config.cashRequiredFormatCopy; }
        const decimalsEl = document.getElementById('decimals');
        if (decimalsEl) { decimalsEl.value = config.decimals; }

        const minBalanceDisplayModeStage1El = document.getElementById('minBalanceDisplayModeStage1');
        if (minBalanceDisplayModeStage1El) { minBalanceDisplayModeStage1El.value = config.minBalanceDisplay.stage1.mode; }
        const minBalanceShowMissingAmountStage1El = document.getElementById('minBalanceShowMissingAmountStage1');
        if (minBalanceShowMissingAmountStage1El) { minBalanceShowMissingAmountStage1El.checked = config.minBalanceDisplay.stage1.showMissingAmount; }
        const minBalanceDisplayModeStage2El = document.getElementById('minBalanceDisplayModeStage2');
        if (minBalanceDisplayModeStage2El) { minBalanceDisplayModeStage2El.value = config.minBalanceDisplay.stage2.mode; }
        const minBalanceShowMissingAmountStage2El = document.getElementById('minBalanceShowMissingAmountStage2');
        if (minBalanceShowMissingAmountStage2El) { minBalanceShowMissingAmountStage2El.checked = config.minBalanceDisplay.stage2.showMissingAmount; }

        const autoCopySettingStage1El = document.getElementById('autoCopySettingStage1');
        if (autoCopySettingStage1El) { autoCopySettingStage1El.value = config.autoCopySettings.stage1.type; }
        const autoCopySilentStage1El = document.getElementById('autoCopySilentStage1');
        if (autoCopySilentStage1El) { autoCopySilentStage1El.checked = config.autoCopySettings.stage1.silent; }
        const prioritizeCashAutoCopyStage1El = document.getElementById('prioritizeCashAutoCopyStage1');
        if (prioritizeCashAutoCopyStage1El) { prioritizeCashAutoCopyStage1El.checked = config.autoCopySettings.stage1.prioritizeCashAutoCopy; }

        const autoCopySettingStage2El = document.getElementById('autoCopySettingStage2');
        if (autoCopySettingStage2El) { autoCopySettingStage2El.value = config.autoCopySettings.stage2.type; }
        const autoCopySilentStage2El = document.getElementById('autoCopySilentStage2');
        if (autoCopySilentStage2El) { autoCopySilentStage2El.checked = config.autoCopySettings.stage2.silent; }
        const prioritizeCashAutoCopyStage2El = document.getElementById('prioritizeCashAutoCopyStage2');
        if (prioritizeCashAutoCopyStage2El) { prioritizeCashAutoCopyStage2El.checked = config.autoCopySettings.stage2.prioritizeCashAutoCopy; }

        const tradeBreakdownMessageEl = document.getElementById('tradeBreakdownMessage');
        if (tradeBreakdownMessageEl) { tradeBreakdownMessageEl.value = config.tradeBreakdownMessage; }
        const tradeCompleteMessageEl = document.getElementById('tradeCompleteMessage');
        if (tradeCompleteMessageEl) { tradeCompleteMessageEl.value = config.tradeCompleteMessage; }
        const salesPitchMessageEl = document.getElementById('salesPitchMessage');
        if (salesPitchMessageEl) { salesPitchMessageEl.value = config.salesPitchMessage; }

        const debugModeEnabledEl = document.getElementById('debugModeEnabled');
        if (debugModeEnabledEl) { debugModeEnabledEl.checked = config.debugModeEnabled; }

        const clearLogsBtn = document.getElementById('clearLogsBtn');
        if (clearLogsBtn) clearLogsBtn.disabled = false;
        const copyLast3LogsBtn = document.getElementById('copyLast3LogsBtn');
        if (copyLast3LogsBtn) copyLast3LogsBtn.disabled = false;
        const copyAllLogsBtn = document.getElementById('copyAllLogsBtn');
        if (copyAllLogsBtn) copyAllLogsBtn.disabled = false;
        const copyDebugInfoBtn = document.getElementById('copyDebugInfoBtn');
        if (copyDebugInfoBtn) copyDebugInfoBtn.disabled = false;
    }


    function toggleMode(mode) {
        const mainPanel = document.getElementById('mainPanel');
        const settingsPanel = document.getElementById('settingsPanel');
        const faqPanel = document.getElementById('faqPanel');
        const navBtn = document.getElementById('enhancerNavBtn');
        const faqBtn = document.getElementById('enhancerFaqBtn');

        mainPanel.style.display = 'none';
        settingsPanel.style.display = 'none';
        faqPanel.style.display = 'none';

        if (mode === 'settings') {
            settingsPanel.style.display = 'flex';
            navBtn.textContent = '⬅️ Back';
            if (faqBtn) faqBtn.textContent = '❓ FAQ';
            appState.currentMode = 'settings';
            updateSettingsUI();
            activateSettingsPage(settingsPages[0].id);
        } else if (mode === 'faq') {
            faqPanel.style.display = 'flex';
            if (navBtn) navBtn.textContent = '⚙️ Settings';
            faqBtn.textContent = '⬅️ Back';
            appState.currentMode = 'faq';
            activateFAQPage(faqContent[0].id);
        }
        else {
            mainPanel.style.display = 'block';
            navBtn.textContent = '⚙️ Settings';
            if (faqBtn) faqBtn.textContent = '❓ FAQ';
            appState.currentMode = 'main';
        }
        if (appState.popup) appState.popup.style.display = 'block';
        if (appState.overlay) appState.overlay.style.display = 'block';
    }

    function activateSettingsPage(pageId) {
        document.querySelectorAll('.settings-nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.settings-page').forEach(page => page.classList.remove('active'));

        const navItem = document.querySelector(`.settings-nav-item[data-page="${pageId}"]`);
        const pageContent = document.getElementById(`${pageId}Page`);

        if (navItem) navItem.classList.add('active');
        if (pageContent) pageContent.classList.add('active');

        if (pageId === 'detectionDebug') {
            setTimeout(() => {
                showDetectionInfo(appState.lastDetectionResult);
                renderDebugLogs();
            }, 100);
        }
    }

    function activateFAQPage(faqId) {
        document.querySelectorAll('.faq-nav-item').forEach(item => item.classList.remove('active'));
        const navItem = document.querySelector(`.faq-nav-item[data-faq-id="${faqId}"]`);
        if (navItem) navItem.classList.add('active');

        const faqItem = faqContent.find(item => item.id === faqId);
        const titleEl = document.getElementById('faqDescriptionTitle');
        const contentEl = document.getElementById('faqDescriptionContent');

        if (faqItem && titleEl && contentEl) {
            titleEl.textContent = faqItem.title;
            contentEl.innerHTML = faqItem.description;
        } else {
            titleEl.textContent = 'FAQ Item Not Found';
            contentEl.innerHTML = '<p>The requested FAQ item could not be found.</p>';
        }
    }

    function filterFAQItems() {
        const searchTerm = document.getElementById('faqSearchInput').value.toLowerCase();
        const navItemsContainer = document.getElementById('faqNavItems');
        if (!navItemsContainer) return;

        navItemsContainer.innerHTML = '';

        const filteredContent = faqContent.filter(item =>
            (item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm))
        );

        if (filteredContent.length > 0) {
            filteredContent.forEach(item => {
                const div = document.createElement('div');
                div.className = 'faq-nav-item';
                div.dataset.faqId = item.id;
                div.textContent = item.title;
                div.addEventListener('click', () => activateFAQPage(item.id));
                navItemsContainer.appendChild(div);
            });
            activateFAQPage(filteredContent[0].id);
        } else {
            navItemsContainer.innerHTML = '<p style="color: #8c9ba5; text-align: center; padding: 10px;">No matching FAQs found.</p>';
            document.getElementById('faqDescriptionTitle').textContent = 'No Results';
            document.getElementById('faqDescriptionContent').innerHTML = '<p>Try a different search term.</p>';
        }
    }


    function detectTradeValues() {
        let result = {
            marketValue: null,
            confidence: 'low',
            method: 'unknown',
            warning: null,
            details: [],
            log: [],
            stage: 1
        };

        try {
            const yourUserId = config.yourUserId;
            result.log.push(`Your User ID: ${yourUserId}`);

            const totalElements = document.querySelectorAll('.tt-total-value span');
            result.log.push(`Found ${totalElements.length} total elements`);

            const totals = [];
            totalElements.forEach(el => {
                const match = el.textContent.match(/\$([\d,]+)/);
                if (match) {
                    const value = parseFloat(match[1].replace(/,/g, ''));
                    if (value > 0) {
                        totals.push({
                            element: el,
                            value: value,
                            parent: el.closest('.user')
                        });
                    }
                }
            });

            result.log.push(`Found ${totals.length} non-zero totals with user context`);

            if (totals.length === 1) {
                result.log.push('Detected Stage 1 trade (only one non-zero total)');
                result.marketValue = totals[0].value;
                result.method = 'Stage 1 (Single Total)';
                result.confidence = 'high';
                result.stage = 1;
                result.details.push(`Customer total extracted: ${formatNumber(result.marketValue, true, 'market')}`);
            }
            else if (totals.length === 2) {
                result.log.push('Detected Stage 2 trade (two non-zero totals)');
                result.stage = 2;

                for (const total of totals) {
                    if (total.parent) {
                        const link = total.parent.querySelector('a[href*="XID="]');
                        if (link) {
                            const href = link.getAttribute('href');
                            const match = href.match(/XID=(\d+)/);
                            if (match) {
                                const userId = match[1];
                                result.log.push(`Found user element with ID: ${userId}`);

                                if (userId !== yourUserId) {
                                    result.marketValue = total.value;
                                    result.method = 'Stage 2 (ID-based)';
                                    result.confidence = 'high';
                                    result.details.push(`Customer section identified by ID mismatch (${userId} vs ${yourUserId})`);
                                    result.log.push(`Value extracted: ${formatNumber(result.marketValue, true, 'market')}`);
                                    break;
                                }
                            }
                        }
                    }
                }

                if (result.marketValue === null) {
                    result.log.push('ID detection failed for Stage 2, trying commission-based fallback');
                    const [total1, total2] = totals;
                    const higherTotal = Math.max(total1.value, total2.value);
                    const lowerTotal = Math.min(total1.value, total2.value);

                    result.marketValue = higherTotal;
                    const commissionDiff = higherTotal - lowerTotal;

                    result.method = 'Stage 2 (Commission-based fallback)';
                    result.confidence = 'medium';
                    result.details.push(`Assumed higher total (${formatNumber(result.marketValue, true, 'market')}) as customer; difference (${formatNumber(commissionDiff, true, 'market')}) approximates commission`);
                    result.log.push(`Values: ${formatNumber(total1.value, true, 'market')}, ${formatNumber(total2.value, true, 'market')}`);
                }
            }

            if (result.marketValue === null || result.marketValue === 0) {
                result.warning = 'Could not detect customer total. Please enter manually.';
                result.method = 'Manual fallback required';
                result.confidence = 'low';
                result.log.push('Detection failed: No valid market value found.');
            }
        } catch (error) {
            result.warning = `Detection error: ${error.message}`;
            result.details.push(`Error during detection: ${error.message}`);
            result.log.push(`ERROR during detection: ${error.message}`);
        }

        appState.lastDetectionResult = result;
        appState.tradeStage = result.stage;
        return result;
    }

    function calculate(value, commission) {
        let numericValue = value;
        if (typeof value === 'string') {
            numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        }
        if (isNaN(numericValue)) numericValue = 0;

        const commissionRate = commission / 100;
        const tradeValue = Math.round(numericValue * (1 - commissionRate));
        return {
            marketValue: numericValue,
            marketFee: numericValue * 0.05,
            tradeFee: numericValue * commissionRate,
            tradeValue: tradeValue,
            savings: numericValue * (0.05 - commissionRate)
        };
    }

    function updatePopupValues(result, commission) {
        document.getElementById('enhancerMarketValueInput').value = Math.round(result.marketValue);
        document.getElementById('enhancerTradedValue').textContent = formatNumber(result.tradeValue, true, 'traded');
        document.getElementById('enhancerSavings').textContent = formatNumber(result.savings, true, 'traded');

        document.querySelector('.commission-display').textContent = `(${commission}% commission)`;

        appState.cashStatus = checkCashAvailability(result.tradeValue, appState.tradeStage);
        updateCashStatusDisplay(appState.cashStatus, appState.tradeStage);

        const autoAddBtn = document.getElementById('enhancerAutoAddTradedValueBtn');
        if (window.location.href.includes('trade.php') && appState.tradeStage === 1 && config.autoAddTradedValueMode !== 'none') {
             autoAddBtn.style.display = 'inline-block';
        } else {
             autoAddBtn.style.display = 'none';
        }
    }

    async function showDetectionInfo(detectionResult) {
        let infoEl, warningEl, logEl;
        try {
            infoEl = await waitForElement('#detectionInfo');
            warningEl = await waitForElement('#warningMessage');
            logEl = await waitForElement('#detectionLog');
        } catch (error) {
            return;
        }

        if (!detectionResult || Object.keys(detectionResult).length === 0 || !detectionResult.log) {
            infoEl.innerHTML = '<strong>No detection information available.</strong><br>Perform a trade analysis first.';
            warningEl.style.display = 'none';
            logEl.textContent = 'No detailed logs available for this detection. Perform a trade analysis first.';
            return;
        }

        if (detectionResult.details && detectionResult.details.length > 0) {
            infoEl.innerHTML = `
                <strong>Detection Info:</strong><br>
                Method: ${detectionResult.method} (${detectionResult.confidence} confidence)<br>
                Stage: <span class="stage-indicator stage-${detectionResult.stage}">Stage ${detectionResult.stage}</span><br>
                ${detectionResult.details.join('<br>')}
            `;
        } else {
            infoEl.innerHTML = '<strong>No specific detection details available.</strong>';
        }

        if (detectionResult.warning) {
            warningEl.textContent = detectionResult.warning;
            warningEl.style.display = 'block';
        } else {
            warningEl.style.display = 'none';
        }

        if (detectionResult.log && detectionResult.log.length > 0) {
            logEl.textContent = detectionResult.log.join('\n');
        } else {
            logEl.textContent = 'No detailed logs for this detection.';
        }
    }

    function copyDebugInfo() {
        const detectionResult = appState.lastDetectionResult;

        if (!detectionResult || Object.keys(detectionResult).length === 0 || !detectionResult.log) {
            GM_setClipboard("No debug information available to copy. Perform a trade analysis first.", 'text');
            showCopiedIndicator(document.getElementById('copyDebugInfoBtn'), 'Nothing to copy!');
            return;
        }

        let copyContent = `--- Trade Helper Pro Debug Info ---\n`;
        copyContent += `Version: ${getCleanScriptVersion()}\n`;
        copyContent += `URL: ${window.location.href}\n\n`;

        copyContent += `Detection Summary:\n`;
        copyContent += `  Market Value: ${detectionResult.marketValue !== null ? formatNumber(detectionResult.marketValue, true, 'market') : 'N/A'}\n`;
        copyContent += `  Method: ${detectionResult.method}\n`;
        copyContent += `  Confidence: ${detectionResult.confidence}\n`;
        copyContent += `  Trade Stage: ${detectionResult.stage}\n`;
        if (detectionResult.warning) {
            copyContent += `  Warning: ${detectionResult.warning}\n`;
        }
        if (detectionResult.details && detectionResult.details.length > 0) {
            copyContent += `  Details:\n    - ${detectionResult.details.join('\n    - ')}\n`;
        }
        copyContent += `\n--- Full Detection Log ---\n`;
        if (detectionResult.log && detectionResult.log.length > 0) {
            copyContent += detectionResult.log.join('\n');
        } else {
            copyContent += 'No detailed logs for this detection.';
        }
        copyContent += `\n\n--- Persistent Script Activity Logs ---\n`;
        if (config.debugLogs && config.debugLogs.length > 0) {
            copyContent += config.debugLogs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        } else {
            copyContent += 'No persistent script activity logs available.';
        }
        copyContent += `\n\n--- End Debug Info ---`;

        GM_setClipboard(copyContent, 'text');
        showCopiedIndicator(document.getElementById('copyDebugInfoBtn'), 'Copied!');
    }

    function showCopiedIndicator(element, text = 'Copied!') {
        const existing = element.querySelector('.copied-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('span');
        indicator.className = 'copied-indicator';
        indicator.textContent = text;
        element.appendChild(indicator);

        setTimeout(() => indicator.classList.add('copied'), 10);
        setTimeout(() => {
            indicator.classList.remove('copied');
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    }

    function performAutoCopy(result, commission) {
        const autoCopyConfig = config.autoCopySettings[`stage${appState.tradeStage}`];

        let effectiveAutoCopyType = autoCopyConfig.type;
        if (autoCopyConfig.prioritizeCashAutoCopy && appState.cashStatus && !appState.cashStatus.sufficient) {
            effectiveAutoCopyType = 'missing_cash';
        }

        if (effectiveAutoCopyType === 'none') {
            return;
        }
        if (!result || result.tradeValue === 0) {
            return;
        }

        let content = '';
        let element = null;
        let indicatorText = 'Auto-copied!';

        switch(effectiveAutoCopyType) {
            case 'traded_value':
                content = formatNumber(result.tradeValue, false, 'traded');
                element = document.getElementById('enhancerTradedValue');
                break;
            case 'trade_breakdown':
                content = generateMessage(config.tradeBreakdownMessage, result, commission);
                element = document.getElementById('enhancerCopyBreakdown');
                break;
            case 'trade_complete':
                content = generateMessage(config.tradeCompleteMessage, result, commission);
                element = document.getElementById('enhancerCopyComplete');
                break;
            case 'missing_cash':
                if (appState.cashStatus && !appState.cashStatus.sufficient) {
                    content = formatNumber(appState.cashStatus.amountNeeded, false, 'cashRequiredCopy');
                    element = document.getElementById('cashStatusDisplay');
                    indicatorText = 'Copied missing cash!';
                } else {
                    effectiveAutoCopyType = autoCopyConfig.type;
                    switch(effectiveAutoCopyType) {
                        case 'traded_value':
                            content = formatNumber(result.tradeValue, false, 'traded');
                            element = document.getElementById('enhancerTradedValue');
                            break;
                        case 'trade_breakdown':
                            content = generateMessage(config.tradeBreakdownMessage, result, commission);
                            element = document.getElementById('enhancerCopyBreakdown');
                            break;
                        case 'trade_complete':
                            content = generateMessage(config.tradeCompleteMessage, result, commission);
                            element = document.getElementById('enhancerCopyComplete');
                            break;
                        default:
                            return;
                    }
                }
                break;
            case 'cash_on_hand_minus_min_balance':
                const cashOnHand = getUserCash();
                const minBalance = config.minCarryingBalance || 0;
                let cashToCopy = cashOnHand - minBalance;
                if (minBalance === 0) {
                    cashToCopy = cashOnHand;
                }
                content = formatNumber(cashToCopy, false, 'cashRequiredCopy');
                element = document.getElementById('cashStatusDisplay');
                indicatorText = 'Copied cash on hand!';
                break;
        }

        if (content) {
            GM_setClipboard(content, 'text');
            if (element && !autoCopyConfig.silent) {
                showCopiedIndicator(element, indicatorText);
            }
            document.getElementById('enhancerMessagePreview').textContent = content;
        }
    }

    function normalRandom(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num * stdDev + mean;
        return num;
    }

    function bellDelay(minMs, maxMs, meanFactor = 0.5, stdDevFactor = 0.15) {
        const range = maxMs - minMs;
        const mean = minMs + range * meanFactor;
        const stdDev = range * stdDevFactor;
        let delay = normalRandom(mean, stdDev);
        return Math.max(minMs, Math.min(maxMs, delay));
    }

    async function simulateTyping(inputElement, value, minDelay, maxDelay, errorChance = 0.15) {
        if (!inputElement) return;

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));

        for (let i = 0; i < value.length; i++) {
            if (config.opt1 && Math.random() < errorChance) {
                let wrongChar = String.fromCharCode(48 + Math.floor(Math.random() * 10));
                if (wrongChar === value[i]) {
                    wrongChar = String.fromCharCode(48 + (Math.floor(Math.random() * 9) + 1) % 10);
                }

                inputElement.value += wrongChar;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: wrongChar, bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: wrongChar, bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: wrongChar, bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));

                inputElement.value = inputElement.value.slice(0, -1);
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', code: 'Backspace', bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));
            }

            inputElement.value += value[i];
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: value[i], bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: value[i], bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: value[i], bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));
        }
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function simulateMicroInteractions() {
        if (!config.opt3) return;

        const randomFactor = Math.random();

        if (randomFactor < 0.3) {
            window.scrollBy(0, Math.random() > 0.5 ? 1 : -1);
            await new Promise(resolve => setTimeout(resolve, bellDelay(50, 150)));
            window.scrollBy(0, Math.random() > 0.5 ? 1 : -1);
            addPersistentLog('Simulated micro-scroll.');
        } else if (randomFactor < 0.6) {
            const interactableElements = Array.from(document.querySelectorAll('a, button, input:not([type="hidden"]), select, textarea'));
            if (interactableElements.length > 5) {
                const randomElement = interactableElements[Math.floor(Math.random() * interactableElements.length)];
                if (randomElement && randomElement !== document.activeElement) {
                    const originalActiveElement = document.activeElement;
                    randomElement.focus();
                    await new Promise(resolve => setTimeout(resolve, bellDelay(100, 300)));
                    if (originalActiveElement) originalActiveElement.focus();
                    else randomElement.blur();
                    addPersistentLog(`Simulated focus/blur on element: ${randomElement.tagName}${randomElement.id ? '#' + randomElement.id : ''}`);
                }
            }
        }
    }

    async function simulateKeyboardInteraction() {
        if (!config.opt4) return;

        if (Math.random() < 0.05) {
            const currentActive = document.activeElement;
            currentActive.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
            currentActive.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, bellDelay(100, 300)));
            document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true }));
            document.activeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true }));
            addPersistentLog('Simulated Tab/Shift+Tab interaction.');
        }
    }

    async function autoAddTradedValueToTrade(amountToAdd) {
        if (appState.popup) appState.popup.style.display = 'none';
        if (appState.overlay) appState.overlay.style.display = 'none';
        addPersistentLog(`Attempting to auto-add ${amountToAdd} to trade. Popup closed.`);

        const autoAddResult = {
            marketValue: appState.currentResult.marketValue,
            confidence: 'N/A',
            method: 'Auto-add Attempt',
            warning: null,
            details: [],
            log: [`Auto-add attempt for amount: ${amountToAdd}`],
            stage: appState.tradeStage
        };

        try {
            let addMoneyButton = document.querySelector('.trade-cont .user-right-wrapper .money-cont .plus-icon') ||
                                 document.querySelector('.trade-cont .plus-icon') ||
                                 document.querySelector('i.plus-icon');

            if (!addMoneyButton) {
                autoAddResult.warning = 'Auto-add failed: Add Money button not found.';
                autoAddResult.details.push('Could not find the "+" icon next to your cash in the trade window. This button is required to open the money input form.');
                autoAddResult.log.push('Add Money (+) button not found. Cannot proceed.');
                addPersistentLog('Auto-add failed: Add Money (+) button not found.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, bellDelay(200, 800)));
            autoAddResult.log.push(`Delayed before clicking plus icon for ${bellDelay(200, 800)}ms.`);

            autoAddResult.log.push('Clicking Add Money (+) button.');
            addPersistentLog('Clicking Add Money (+) button.');
            addMoneyButton.click();

            await new Promise(resolve => setTimeout(resolve, bellDelay(500, 1500)));
            autoAddResult.log.push(`Delayed after clicking plus icon for ${bellDelay(500, 1500)}ms.`);


            let moneyInput = null;
            let changeButton = null;
            let attempts = 0;
            const maxAttempts = 60;
            const pollInterval = 100;

            while ((!moneyInput || !changeButton) && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));

                moneyInput = document.querySelector('input.user-id.input-money[type="text"]') ||
                             document.querySelector('input[data-money-input]') ||
                             document.querySelector('input[type="text"][name="amount"]') ||
                             document.querySelector('input[type="text"][placeholder*="Amount"]');

                changeButton = document.querySelector('input[type="submit"][value="Change"]') ||
                               document.querySelector('button.btn.green.btn-trade') ||
                               document.querySelector('button.btn.green.t-confirm') ||
                               Array.from(document.querySelectorAll('input[type="submit"], button')).find(el => el.value === 'Change' || el.textContent.includes('Change'));

                attempts++;
                autoAddResult.log.push(`Polling for form elements. Attempt ${attempts}/${maxAttempts}. Input found: ${!!moneyInput}, Change button found: ${!!changeButton}`);
            }

            if (!moneyInput || !changeButton) {
                autoAddResult.warning = 'Auto-add failed: Money input or change button not found on the "Add Money" page.';
                autoAddResult.details.push('The input field or the "Change" button on the "Add Money" page could not be found after clicking the "+" icon. This suggests a change in Torn.com\'s UI for adding money.');
                autoAddResult.log.push('Money input or change button not found after polling (max attempts reached).');
                addPersistentLog('Auto-add failed: Money input or change button not found after polling.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                return;
            }
            autoAddResult.log.push('Money input and change button found. Proceeding to input amount.');


            autoAddResult.log.push(`Setting money input value to ${amountToAdd}.`);

            if (config.autoAddTradedValueMode === "advanced_plus") {
                autoAddResult.log.push('Special mode: Simulating highly discreet human-like typing behavior with errors.');
                addPersistentLog('Special mode: Simulating highly discreet typing amount.');

                let typingMinDelay = 50;
                let typingMaxDelay = 150;
                let errorChance = 0.15;
                if (amountToAdd > 100000000) {
                    typingMinDelay = 70;
                    typingMaxDelay = 200;
                    errorChance = 0.20;
                }
                await simulateTyping(moneyInput, String(amountToAdd), typingMinDelay, typingMaxDelay, config.opt1 ? errorChance : 0);

                if (amountToAdd > 1000000) {
                    await new Promise(resolve => setTimeout(resolve, bellDelay(500, 2000)));
                    autoAddResult.log.push(`Contextual delay after typing large amount for ${bellDelay(500, 2000)}ms.`);
                }

                if (config.opt2) {
                    await new Promise(resolve => setTimeout(resolve, bellDelay(500, 3000)));
                    autoAddResult.log.push(`Pre-click hesitation delay for ${bellDelay(500, 3000)}ms.`);
                }

                await simulateMicroInteractions();
                await simulateKeyboardInteraction();

                if (config.opt3 && Math.random() < 0.02) {
                    moneyInput.select();
                    await new Promise(resolve => setTimeout(resolve, bellDelay(50, 150)));
                    moneyInput.blur();
                    addPersistentLog('Simulated re-check of typed value.');
                }

                if (config.opt5 && Math.random() * config.opt6 < 1) {
                    addPersistentLog('Human-in-loop prompt triggered.');
                    const confirmed = await showConfirmationDialog(
                        'Manual Action Required (Special Mode)',
                        'For enhanced discretion, please manually click the "Change" button now. The script will resume after you click it.',
                        'I have clicked "Change"',
                        'Cancel Automation'
                    );
                    if (!confirmed) {
                        autoAddResult.warning = 'Auto-add cancelled by user (Human-in-loop).';
                        autoAddResult.details.push('User chose to cancel automation during human-in-loop prompt.');
                        autoAddResult.log.push('Human-in-loop cancelled automation.');
                        addPersistentLog('Auto-add cancelled by user (Human-in-loop).');
                        appState.lastDetectionResult = autoAddResult;
                        showDetectionInfo(appState.lastDetectionResult);
                        return;
                    }
                    addPersistentLog('User manually clicked "Change" button.');
                }


            } else if (config.autoAddTradedValueMode === 'advanced') {
                autoAddResult.log.push('Advanced mode: Simulating typing for human-like behavior.');
                addPersistentLog('Advanced mode: Simulating typing amount.');
                await simulateTyping(moneyInput, String(amountToAdd), 50, 150, 0);
            } else {
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.$ && typeof unsafeWindow.$(moneyInput).val === 'function') {
                    unsafeWindow.$(moneyInput).val(amountToAdd);
                    autoAddResult.log.push('Used jQuery .val() to set input (Basic mode).');
                } else {
                    moneyInput.value = amountToAdd;
                }
                moneyInput.dispatchEvent(new Event('input', { bubbles: true }));
                moneyInput.dispatchEvent(new Event('change', { bubbles: true }));
                moneyInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter', code: 'Enter' }));
                moneyInput.dispatchEvent(new Event('blur', { bubbles: true }));
                autoAddResult.log.push('Dispatched input, change, keyup, blur events (Basic mode).');
            }

            if (config.autoAddTradedValueMode === 'basic') {
                autoAddResult.warning = 'Auto-add set to Basic mode: Amount filled, manual click required to change.';
                autoAddResult.details.push('The traded value has been filled. Please manually click the "Change" button to complete the action.');
                autoAddResult.log.push('Auto-add mode is "basic", stopping before clicking "Change" button.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                showCopiedIndicator(document.getElementById('enhancerAutoAddTradedValueBtn'), 'Filled!');
                return;
            }

            if (!config.opt5 || Math.random() * config.opt6 >= 1) {
                await new Promise(resolve => setTimeout(resolve, bellDelay(300, 1000)));
                autoAddResult.log.push(`Delayed before clicking change button for ${bellDelay(300, 1000)}ms.`);

                autoAddResult.log.push('Clicking Change button.');
                changeButton.click();
            }

            showCopiedIndicator(document.getElementById('enhancerAutoAddTradedValueBtn'), 'Added!');
            autoAddResult.log.push(`Successfully attempted to add ${amountToAdd} to trade.`);

        } catch (e) {
            console.error('ERROR in autoAddTradedValueToTrade:', e);
            autoAddResult.warning = `Auto-add failed: An unexpected error occurred.`;
            autoAddResult.details.push(`Error: ${e.message}`);
            autoAddResult.log.push(`An unexpected error occurred during auto-add: ${e.message}`);
            addPersistentLog(`Auto-add failed: An unexpected error occurred: ${e.message}`);
        } finally {
            appState.lastDetectionResult = autoAddResult;
            showDetectionInfo(appState.lastDetectionResult);
        }
    }

    function ensurePopupAndOverlayExist() {
        let currentPopup = document.getElementById('trade-helper-popup');
        let currentOverlay = document.querySelector('.trade-enhancer-overlay');

        if (!currentPopup) {
            appState.popup = document.createElement('div');
            appState.popup.id = 'trade-helper-popup';
            appState.popup.className = 'trade-enhancer-popup';
            document.body.appendChild(appState.popup);
        } else {
            appState.popup = currentPopup;
        }

        if (!currentOverlay) {
            appState.overlay = document.createElement('div');
            appState.overlay.className = 'trade-enhancer-overlay';
            document.body.appendChild(appState.overlay);
        } else {
            appState.overlay = currentOverlay;
        }

        const popupContentHtml = `
            <div class="enhancer-popup-header">
                <h3>Trade Helper Pro v${getCleanScriptVersion()} <span style="color: #FFD700; font-size: 0.8em;">(Unlocked)</span></h3>
                <div class="buttons">
                    <button class="enhancer-faq-btn" id="enhancerFaqBtn">❓ FAQ</button>
                    <button class="enhancer-nav-btn" id="enhancerNavBtn">⚙️ Settings</button>
                    <button class="enhancer-close-btn" id="enhancerClosePopup">Close</button>
                </div>
            </div>
            <div id="mainPanel">
                <div class="enhancer-input-container">
                    <div class="enhancer-input-label">Market Value (Auto-detected or manual entry)</div>
                    <input type="text" id="enhancerMarketValueInput" class="enhancer-value-input" value="0">
                </div>

                <div class="enhancer-value-display">
                    <span class="enhancer-value-label">
                        Traded Value
                        <span class="commission-display">(${config.commission}% commission)</span>
                    </span>
                    <span class="enhancer-value-amount" id="enhancerTradedValue">$0</span>
                </div>
                <div class="enhancer-value-display">
                    <span class="enhancer-value-label">Customer Savings (vs Market):</span>
                    <span class="enhancer-value-amount" id="enhancerSavings">$0</span>
                </div>

                <div id="cashStatusDisplay" class="cash-status" style="display: none;"></div>

                <div class="enhancer-btn-group">
                    <button class="enhancer-btn" id="enhancerCopyBreakdown">📋 Copy Trade Breakdown</button>
                    <button class="enhancer-btn" id="enhancerCopyComplete">✅ Copy Trade Complete</button>
                    <button class="enhancer-btn blue" id="enhancerCopySalesPitch">💬 Copy Sales Pitch</button>
                    <button class="enhancer-btn" id="enhancerAutoAddTradedValueBtn" style="display: none;">✨ Auto-add Traded Value</button>
                </div>
                <div class="enhancer-message-box" id="enhancerMessagePreview">
                    Preview of copied message.
                </div>
                <div class="enhancer-credit">
                    Created by <a href="https://www.torn.com/profiles.php?XID=3487562" target="_blank">Oatshead [3487562]</a>.
                </div>
            </div>
            ${createSettingsPanelHTML()}
            ${createFAQPanelHTML()}
        `;

        try {
            appState.popup.innerHTML = '';

            const parser = new DOMParser();
            const doc = parser.parseFromString(popupContentHtml, 'text/html');

            while (doc.body.firstChild) {
                appState.popup.appendChild(doc.body.firstChild);
            }
        } catch (e) {
            console.error('ERROR: Failed to set popup content using DOMParser.', e);
            appState.popup.innerHTML = '<div style="color: red; padding: 20px;">Error loading Trade Helper Pro UI. Please check console for details.</div>';
            return;
        }
        setupEventListeners();
    }


    function showTradeAnalysis() {
        ensurePopupAndOverlayExist();

        const detectionResult = detectTradeValues();

        if (detectionResult.marketValue) {
            appState.currentResult = calculate(detectionResult.marketValue, config.commission);
            document.getElementById('enhancerMarketValueInput').value = Math.round(appState.currentResult.marketValue);
            updatePopupValues(appState.currentResult, config.commission);
        } else {
            const marketValue = parseFloat(document.getElementById('enhancerMarketValueInput').value) || 0;
            appState.currentResult = calculate(marketValue, config.commission);
            updatePopupValues(appState.currentResult, config.commission);
        }

        document.getElementById('enhancerMessagePreview').textContent = generateMessage(config.tradeBreakdownMessage, appState.currentResult, config.commission);
        performAutoCopy(appState.currentResult, config.commission);

        toggleMode('main');
    }

    function showTradeHelper(event) {
        if (event) event.stopPropagation();
        ensurePopupAndOverlayExist();

        const marketValue = parseFloat(document.getElementById('enhancerMarketValueInput').value) || 0;

        appState.currentResult = calculate(marketValue, config.commission);
        updatePopupValues(appState.currentResult, config.commission);

        document.getElementById('enhancerMessagePreview').textContent = generateMessage(config.salesPitchMessage, appState.currentResult, config.commission);

        appState.lastDetectionResult = {
            marketValue: marketValue,
            confidence: 'manual',
            method: 'Manual Entry',
            warning: null,
            details: ['Manual mode activated - enter market value above'],
            log: ['Manual mode activated, no automatic detection performed.'],
            stage: 1
        };
        showDetectionInfo(appState.lastDetectionResult);

        toggleMode('main');
    }

    function addMainButton() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('trade.php')) {
            let buttonGroup = document.getElementById('tradeEnhancerButtonGroup');
            let analyzeButton = document.getElementById('tradeEnhancerBtn');

            const container = document.querySelector('.content-title') ||
                              document.querySelector('.trade-wrapper') ||
                              document.querySelector('.user-left-wrapper');

            if (container) {
                try {
                    if (!buttonGroup) {
                        buttonGroup = document.createElement('div');
                        buttonGroup.id = 'tradeEnhancerButtonGroup';
                        buttonGroup.className = 'button-group';
                        const contentTitle = container.querySelector('.content-title');
                        if (contentTitle) {
                            contentTitle.after(buttonGroup);
                        } else {
                            container.appendChild(buttonGroup);
                        }
                    }

                    if (!analyzeButton) {
                        const button = document.createElement('button');
                        button.id = 'tradeEnhancerBtn';
                        button.textContent = '🔍 Analyze';
                        button.addEventListener('click', showTradeAnalysis);
                        if (buttonGroup) {
                            buttonGroup.appendChild(button);
                        }
                    }
                } catch (e) {
                    console.error('ERROR in addMainButton (trade.php section):', e);
                }
            }
        } else if (currentUrl.includes('page.php?sid=ItemMarket')) {
            let tradeHelperButton = document.getElementById('tradeHelperBtn');

            if (config.showOnItemMarket) {
                if (tradeHelperButton) {
                    return;
                }
                const bazaarButton = document.querySelector('a[href="bazaar.php"]');
                if (bazaarButton) {
                    try {
                        const newButton = document.createElement('button');
                        newButton.id = 'tradeHelperBtn';
                        newButton.textContent = '💼 Trade Helper';
                        newButton.addEventListener('click', showTradeHelper);
                        bazaarButton.parentNode.insertBefore(newButton, bazaarButton.nextSibling);
                    }
                    catch (e) {
                        console.error('ERROR in addMainButton (ItemMarket section):', e);
                    }
                }
            } else {
                if (tradeHelperButton) {
                    tradeHelperButton.remove();
                }
            }
        }
    }

    function showConfirmationDialog(title, message, confirmText = 'Yes, proceed', cancelText = 'Cancel') {
        return new Promise(resolve => {
            if (appState.confirmationModal) {
                appState.confirmationModal.remove();
                appState.confirmationModal = null;
            }

            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'thp-modal-overlay';

            const modalContent = document.createElement('div');
            modalContent.className = 'thp-modal-content';
            modalContent.innerHTML = `
                <h4>${escapeHtml(title)}</h4>
                <p>${message}</p>
                <div class="thp-modal-buttons">
                    <button class="confirm-btn">${escapeHtml(confirmText)}</button>
                    <button class="cancel-btn">${escapeHtml(cancelText)}</button>
                </div>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            appState.confirmationModal = modalOverlay;

            const confirmBtn = modalContent.querySelector('.confirm-btn');
            const cancelBtn = modalContent.querySelector('.cancel-btn');

            const cleanup = (result) => {
                if (appState.confirmationModal) {
                    appState.confirmationModal.remove();
                    appState.confirmationModal = null;
                }
                resolve(result);
            };

            confirmBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    cleanup(false);
                }
            });
        });
    }

    async function handleReset(resetType) {
        let confirmTitle, confirmMessage;
        if (resetType === 'full') {
            confirmTitle = 'Confirm Full Reset';
            confirmMessage = 'Are you sure you want to reset ALL settings, custom messages, and user info to their default values? This action cannot be undone.';
        } else {
            confirmTitle = 'Confirm Settings Reset';
            confirmMessage = 'Are you sure you want to reset all settings (excluding custom messages and user info) to their default values?';
        }

        const confirmed = await showConfirmationDialog(confirmTitle, confirmMessage);

        if (confirmed) {
            if (resetType === 'full') {
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                appState.isSpecialModeUnlocked = true;
            } else {
                const preservedData = {
                    tradeBreakdownMessage: config.tradeBreakdownMessage,
                    tradeCompleteMessage: config.tradeCompleteMessage,
                    salesPitchMessage: config.salesPitchMessage,
                    yourUserId: config.yourUserId,
                    yourUsername: config.yourUsername,
                    activationKey: config.activationKey,
                    flag1: true
                };
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                config.tradeBreakdownMessage = preservedData.tradeBreakdownMessage;
                config.tradeCompleteMessage = preservedData.tradeCompleteMessage;
                config.salesPitchMessage = preservedData.salesPitchMessage;
                config.yourUserId = preservedData.yourUserId;
                config.yourUsername = preservedData.yourUsername;
                config.activationKey = preservedData.activationKey;
                config.flag1 = true;
            }
            saveConfig();
            appState.isPro = true;

            ensurePopupAndOverlayExist();
            toggleMode('settings');
            activateSettingsPage('resetOptions');
            showCopiedIndicator(document.getElementById(`${resetType === 'full' ? 'fullResetBtn' : 'resetSettingsOnlyBtn'}`), 'Reset Complete!');
            setTimeout(addMainButton, 100);
        } else {
            showCopiedIndicator(document.getElementById(`${resetType === 'full' ? 'fullResetBtn' : 'resetSettingsOnlyBtn'}`), 'Reset Cancelled.');
        }
    }


    function saveSettings() {
        config.commission = parseFloat(document.getElementById('commissionRate').value) || 3;

        config.cashCheckEnabled = document.getElementById('cashCheckEnabled').checked;
        let parsedMinBalance = parseShort(document.getElementById('minCarryingBalance').value);
        config.minCarryingBalance = (parsedMinBalance !== undefined && parsedMinBalance !== null) ? parsedMinBalance : 500000;


        config.showOnItemMarket = document.getElementById('showOnItemMarket').checked;
        config.autoAddTradedValueMode = document.getElementById('autoAddTradedValueMode').value;

        config.opt1 = document.getElementById('enableTypingErrors').checked;
        config.opt2 = document.getElementById('enablePreClickHesitation').checked;
        config.opt3 = document.getElementById('enableMicroInteractions').checked;
        config.opt4 = document.getElementById('enableKeyboardSimulations').checked;
        config.opt5 = document.getElementById('enableHumanInLoopPrompt').checked;
        config.opt6 = parseInt(document.getElementById('humanInLoopFrequency').value) || DEFAULT_CONFIG.opt6;


        config.tradeBreakdownMessage = document.getElementById('tradeBreakdownMessage').value;
        config.tradeCompleteMessage = document.getElementById('tradeCompleteMessage').value;
        config.salesPitchMessage = document.getElementById('salesPitchMessage').value;

        config.autoCopySettings.stage1.type = document.getElementById('autoCopySettingStage1').value;
        config.autoCopySettings.stage1.silent = document.getElementById('autoCopySilentStage1').checked;
        config.autoCopySettings.stage1.prioritizeCashAutoCopy = document.getElementById('prioritizeCashAutoCopyStage1').checked;

        config.autoCopySettings.stage2.type = document.getElementById('autoCopySettingStage2').value;
        config.autoCopySettings.stage2.silent = document.getElementById('autoCopySilentStage2').checked;
        config.autoCopySettings.stage2.prioritizeCashAutoCopy = document.getElementById('prioritizeCashAutoCopyStage2').checked;

        config.numberFormatTraded = document.getElementById('numberFormatTraded').value;
        config.numberFormatMarket = document.getElementById('numberFormatMarket').value;
        config.cashRequiredFormatDisplay = document.getElementById('cashRequiredFormatDisplay').value;
        config.cashRequiredFormatCopy = document.getElementById('cashRequiredFormatCopy').value;
        config.decimals = parseInt(document.getElementById('decimals').value) || 2;

        config.minBalanceDisplay.stage1.mode = document.getElementById('minBalanceDisplayModeStage1').value;
        config.minBalanceDisplay.stage1.showMissingAmount = document.getElementById('minBalanceShowMissingAmountStage1').checked;
        config.minBalanceDisplay.stage2.mode = document.getElementById('minBalanceDisplayModeStage2').value;
        config.minBalanceDisplay.stage2.showMissingAmount = document.getElementById('minBalanceShowMissingAmountStage2').checked;

        config.debugModeEnabled = document.getElementById('debugModeEnabled').checked;

        saveConfig();

        appState.isPro = true;

        toggleMode('main');
        updatePopupValues(appState.currentResult, config.commission);
        showCopiedIndicator(document.getElementById('settingsSaveBtn'), 'Saved!');
        setTimeout(addMainButton, 100);
    }

    function setupEventListeners() {
        const closePopupBtn = document.getElementById('enhancerClosePopup');
        if (closePopupBtn) {
            closePopupBtn.removeEventListener('click', () => { });
            closePopupBtn.addEventListener('click', () => {
                if (appState.popup) appState.popup.style.display = 'none';
                if (appState.overlay) appState.overlay.style.display = 'none';
            });
        }

        if (appState.overlay) {
            appState.overlay.removeEventListener('click', () => { });
            appState.overlay.addEventListener('click', () => {
                if (appState.popup) appState.popup.style.display = 'none';
                if (appState.overlay) appState.overlay.style.display = 'none';
            });
        }


        const navBtn = document.getElementById('enhancerNavBtn');
        if (navBtn) {
            navBtn.removeEventListener('click', () => toggleMode(appState.currentMode === 'settings' ? 'main' : 'settings'));
            navBtn.addEventListener('click', () => toggleMode(appState.currentMode === 'settings' ? 'main' : 'settings'));
        }

        const faqBtn = document.getElementById('enhancerFaqBtn');
        if (faqBtn) {
            faqBtn.removeEventListener('click', () => toggleMode(appState.currentMode === 'faq' ? 'main' : 'faq'));
            faqBtn.addEventListener('click', () => toggleMode(appState.currentMode === 'faq' ? 'main' : 'faq'));
        }


        const settingsCancelBtn = document.getElementById('settingsCancelBtn');
        if (settingsCancelBtn) {
            settingsCancelBtn.removeEventListener('click', () => toggleMode('main'));
            settingsCancelBtn.addEventListener('click', () => toggleMode('main'));
        }

        const settingsSaveBtn = document.getElementById('settingsSaveBtn');
        if (settingsSaveBtn) {
            settingsSaveBtn.removeEventListener('click', saveSettings);
            settingsSaveBtn.addEventListener('click', saveSettings);
        }

        document.querySelectorAll('.settings-nav-item').forEach(item => {
            const oldListener = item._clickHandler;
            if (oldListener) {
                item.removeEventListener('click', oldListener);
            }

            const newListener = function() {
                const pageId = this.dataset.page;
                activateSettingsPage(pageId);
            };
            item.addEventListener('click', newListener);
            item._clickHandler = newListener;
        });

        document.querySelectorAll('.faq-nav-item').forEach(item => {
            const oldListener = item._faqClickHandler;
            if (oldListener) {
                item.removeEventListener('click', oldListener);
            }
            const newListener = function() {
                const faqId = this.dataset.faqId;
                activateFAQPage(faqId);
            };
            item.addEventListener('click', newListener);
            item._faqClickHandler = newListener;
        });

        const faqSearchInput = document.getElementById('faqSearchInput');
        if (faqSearchInput) {
            faqSearchInput.removeEventListener('input', filterFAQItems);
            faqSearchInput.addEventListener('input', filterFAQItems);
        }


        const fullResetBtn = document.getElementById('fullResetBtn');
        if (fullResetBtn) {
            fullResetBtn.removeEventListener('click', () => handleReset('full'));
            fullResetBtn.addEventListener('click', () => handleReset('full'));
        }
        const resetSettingsOnlyBtn = document.getElementById('resetSettingsOnlyBtn');
        if (resetSettingsOnlyBtn) {
            resetSettingsOnlyBtn.removeEventListener('click', () => handleReset('settingsOnly'));
            resetSettingsOnlyBtn.addEventListener('click', () => handleReset('settingsOnly'));
        }


        const copyDebugInfoBtn = document.getElementById('copyDebugInfoBtn');
        if (copyDebugInfoBtn) {
            copyDebugInfoBtn.removeEventListener('click', copyDebugInfo);
            copyDebugInfoBtn.addEventListener('click', copyDebugInfo);
        }

        const clearLogsBtn = document.getElementById('clearLogsBtn');
        if (clearLogsBtn) {
            clearLogsBtn.removeEventListener('click', () => { });
            clearLogsBtn.addEventListener('click', () => {
                config.debugLogs = [];
                saveConfig();
                renderDebugLogs();
                showCopiedIndicator(clearLogsBtn, 'Logs Cleared!');
            });
        }

        const copyLast3LogsBtn = document.getElementById('copyLast3LogsBtn');
        if (copyLast3LogsBtn) {
            copyLast3LogsBtn.removeEventListener('click', () => { });
            copyLast3LogsBtn.addEventListener('click', () => {
                copySelectedLogs(3);
            });
        }

        const copyAllLogsBtn = document.getElementById('copyAllLogsBtn');
        if (copyAllLogsBtn) {
            copyAllLogsBtn.removeEventListener('click', () => { });
            copyAllLogsBtn.addEventListener('click', () => {
                copyAllLogs();
            });
        }

        const marketValueInput = document.getElementById('enhancerMarketValueInput');
        if (marketValueInput) {
            marketValueInput.removeEventListener('focus', () => { });
            marketValueInput.addEventListener('focus', function() {
                if (this.value === '0') {
                    this.value = '';
                }
                this.select();
            });

            marketValueInput.removeEventListener('input', () => { });
            marketValueInput.addEventListener('input', function() {
                const cleanedValue = this.value.replace(/[^0-9.]/g, '');
                if (cleanedValue !== this.value) {
                    this.value = cleanedValue;
                }

                const marketValue = parseFloat(cleanedValue) || 0;
                appState.currentResult = calculate(marketValue, config.commission);
                updatePopupValues(appState.currentResult, config.commission);
            });
        }


        const commissionRateInput = document.getElementById('commissionRate');
        if (commissionRateInput) {
            commissionRateInput.removeEventListener('input', () => { });
            commissionRateInput.addEventListener('input', function() {
                config.commission = parseFloat(this.value) || 3;
                appState.currentResult = calculate(appState.currentResult.marketValue, config.commission);
                updatePopupValues(appState.currentResult, config.commission);
            });
        }

        const autoAddTradedValueModeEl = document.getElementById('autoAddTradedValueMode');
        if (autoAddTradedValueModeEl) {
            const oldModeChangeListener = autoAddTradedValueModeEl._modeChangeListener;
            if (oldModeChangeListener) {
                autoAddTradedValueModeEl.removeEventListener('change', oldModeChangeListener);
            }

            const newModeChangeListener = async function() {
                const newValue = this.value;
                const oldValue = this.dataset.oldValue;

                const advancedPlusSettingsContainer = document.getElementById('advancedPlusSettingsContainer');
                if (newValue === 'advanced_plus') {
                    if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'block';
                } else {
                    if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'none';
                }

                if (newValue === 'advanced' || newValue === 'advanced_plus') {
                    const confirmed = await showConfirmationDialog(
                        'Warning: Advanced Auto-Add Feature',
                        'This advanced auto-add feature is experimental and may potentially break Torn rules for script usage. Use at your own risk or after confirmation from Torn script moderators. Click confirm if you agree. Deny will keep it switched off.'
                    );

                    if (!confirmed) {
                        this.value = oldValue;
                        if (oldValue === 'advanced_plus') {
                             if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'block';
                        } else {
                             if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'none';
                        }
                        showCopiedIndicator(this, 'Activation denied!');
                    } else {
                        this.dataset.oldValue = newValue;
                        showCopiedIndicator(this, `${newValue} mode ON!`);
                    }
                }
                else {
                    this.dataset.oldValue = newValue;
                }
            };
            autoAddTradedValueModeEl.addEventListener('change', newModeChangeListener);
            autoAddTradedValueModeEl._modeChangeListener = newModeChangeListener;
        }


        const copyBreakdownBtn = document.getElementById('enhancerCopyBreakdown');
        if (copyBreakdownBtn) {
            copyBreakdownBtn.removeEventListener('click', () => { });
            copyBreakdownBtn.addEventListener('click', function() {
                const message = generateMessage(config.tradeBreakdownMessage, appState.currentResult, config.commission);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
            });
        }


        const copyCompleteBtn = document.getElementById('enhancerCopyComplete');
        if (copyCompleteBtn) {
            copyCompleteBtn.removeEventListener('click', () => { });
            copyCompleteBtn.addEventListener('click', function() {
                const message = generateMessage(config.tradeCompleteMessage, appState.currentResult, config.commission);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
            });
        }


        const copySalesPitchBtn = document.getElementById('enhancerCopySalesPitch');
        if (copySalesPitchBtn) {
            copySalesPitchBtn.removeEventListener('click', () => { });
            copySalesPitchBtn.addEventListener('click', function() {
                const message = generateMessage(config.salesPitchMessage, appState.currentResult, config.commission);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
            });
        }


        const autoAddTradedValueBtn = document.getElementById('enhancerAutoAddTradedValueBtn');
        if (autoAddTradedValueBtn) {
            autoAddTradedValueBtn.removeEventListener('click', () => { });
            autoAddTradedValueBtn.addEventListener('click', () => {
                if (appState.currentResult && appState.currentResult.tradeValue > 0) {
                    autoAddTradedValueToTrade(appState.currentResult.tradeValue);
                } else {
                    appState.lastDetectionResult = {
                        marketValue: appState.currentResult.marketValue,
                        confidence: 'N/A',
                        method: 'Auto-add Attempt',
                        warning: 'Auto-add failed: No valid trade value to add. Please analyze the trade first.',
                        details: ['Ensure a trade is active and analyzed to get a valid traded value.'],
                        log: appState.lastDetectionResult.log.concat(['Auto-add failed: No valid trade value (0 or null).']) || ['Auto-add failed: No valid trade value (0 or null).'],
                        stage: appState.tradeStage
                    };
                    showDetectionInfo(appState.lastDetectionResult);
                }
            });
        }
    }

    async function fetchAndSetUserInfo() {
        let detectedUsername = '';
        let detectedUserId = '';

        try {
            const userAnchor = document.querySelector('a.menu-value___gLaLR[href*="XID="]');

            if (userAnchor) {
                detectedUsername = userAnchor.textContent.trim();
                const href = userAnchor.getAttribute('href');
                const idMatch = href.match(/XID=(\d+)/);
                if (idMatch && idMatch[1]) {
                    detectedUserId = idMatch[1];
                }
            }
        } catch (error) {
            // silent fail
        }

        if (detectedUserId && detectedUsername) {
            if (config.yourUserId !== detectedUserId || config.yourUsername !== detectedUsername) {
                config.yourUserId = detectedUserId;
                config.yourUsername = detectedUsername;
                saveConfig();
            }
        }
    }

    async function init() {
        config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

        loadConfig();

        appState.isSpecialModeUnlocked = true;

        await fetchAndSetUserInfo();
        appState.isPro = true;

        ensurePopupAndOverlayExist();
        updateSettingsUI();
        addMainButton();

        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('tradeEnhancerBtn') && window.location.href.includes('trade.php')) {
                addMainButton();
            }
            if (config.showOnItemMarket && !document.getElementById('tradeHelperBtn') && window.location.href.includes('page.php?sid=ItemMarket')) {
                addMainButton();
            }
            if ((!config.showOnItemMarket) && document.getElementById('tradeHelperBtn')) {
                document.getElementById('tradeHelperBtn').remove();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();