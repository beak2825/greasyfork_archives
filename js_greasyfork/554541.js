// ==UserScript==
// @name         Trade Value Calculator
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Calculates the total value of items in a trade on Torn.com.
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      weav3r.dev
// @connect      api.torn.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554541/Trade%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/554541/Trade%20Value%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isTradePage = location.pathname.startsWith('/trade.php');

    // Detect if we're on mobile (check both user agent and screen width)
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 784;

    // Only inject viewport meta and trade UI styles on the trade page
    if (isTradePage) {
        // Add viewport meta tag if it doesn't exist (critical for mobile)
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    const styles = isTradePage ? `
:root {--bg-dark:#1a1a1a;--bg-darker:#222;--bg-med:#333;--bg-light:#444;--bg-lighter:#555;--border:#444;--text:#fff;--text-muted:#e2e8f0;--success:#28a745;--success-hover:#218838;--error:#f66;--transition:all .3s ease;--shadow:0 4px 8px rgba(0,0,0,.2);--radius:6px}
.title-red + .warning-cont, .title-red + .warning-cont + hr {display:none !important}
.title-red:has(+ .warning-cont) {display:none !important}
.trade-status-indicator {font-weight:600;font-size:10px;margin-left:8px;padding:3px 7px;border-radius:3px;white-space:nowrap;display:inline-block}
.stripe-container {width:100%;background:var(--bg-med);margin:0;border-radius:8px;display:flex;justify-content:center;align-items:center;padding:15px 30px;border:1px solid var(--border);box-shadow:var(--shadow);transition:var(--transition);box-sizing:border-box;gap:10px;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.stripe-container.expanded {justify-content:space-around}
.calculate-button,.total-value-container,.receipt-url-container,.copy-url-button,.view-edit-receipt-button,.accept-trade-button {padding:10px 20px;background:linear-gradient(145deg,var(--bg-light),var(--bg-lighter));color:var(--text);border:1px solid var(--bg-med);border-radius:var(--radius);cursor:pointer;font:14px 'Segoe UI',Tahoma,sans-serif;margin:0;transition:var(--transition),transform .2s;text-align:center;white-space:nowrap;min-width:150px;flex:0 1 auto;-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.calculate-button:hover,.total-value-container:hover,.receipt-url-container:hover,.copy-url-button:hover,.view-edit-receipt-button:hover,.accept-trade-button:hover:not(:disabled),.calculate-button:active,.total-value-container:active,.receipt-url-container:active,.copy-url-button:active,.view-edit-receipt-button:active,.accept-trade-button:active:not(:disabled) {background:linear-gradient(145deg,var(--bg-lighter),var(--bg-light));transform:translateY(-2px)}
.accept-trade-button:disabled {opacity:.5;cursor:not-allowed;background:linear-gradient(145deg,var(--bg-med),var(--bg-light))}
.accept-trade-button.enabled {background:linear-gradient(145deg,var(--success),var(--success-hover))}
.accept-trade-button.enabled:hover {background:linear-gradient(145deg,var(--success-hover),var(--success))}
.button-icon {display:none}
.button-text {display:inline}
.value-container {display:none;align-items:center;justify-content:space-evenly;flex-grow:1}
.value-container.visible {display:flex}
.hidden {display:none}
.copy-confirmation {color:#6b6 !important;transition:color .3s;pointer-events:none}
.error-button {background-color:var(--error) !important;border-color:#c00 !important}
a {color:#e0e0e0;text-decoration:none;cursor:pointer;transition:color .3s}
a:hover {color:var(--text)}
.receipt-modal-overlay {position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;justify-content:center;align-items:center;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}
.receipt-modal-overlay.visible {opacity:1;visibility:visible}
.receipt-modal {background:var(--bg-dark);border-radius:12px;width:90%;max-width:650px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 4px 30px rgba(0,0,0,.5);transform:translateY(20px);opacity:0;transition:transform .3s,opacity .3s}
.receipt-modal-overlay.visible .receipt-modal {transform:translateY(0);opacity:1}
.modal-header {background:var(--bg-darker);padding:12px 20px;border-bottom:1px solid var(--bg-med);display:flex;justify-content:space-between;align-items:center}
.modal-header h2 {margin:0;color:var(--text);font-size:1.1em;font-weight:500}
.close-modal {background:none;border:none;color:var(--text);font-size:24px;cursor:pointer;padding:0;opacity:.8;transition:opacity .2s}
.close-modal:hover {opacity:1}
.modal-content {padding:15px;background:var(--bg-dark);flex:1;overflow-y:auto}
.receipt-content {height:100%}
.loading-spinner {width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;margin:20px auto}
@keyframes spin {to {transform:rotate(360deg)}}
.items-table {width:100%;border-collapse:separate;border-spacing:0 8px;margin:0;background:var(--bg-dark);font-size:14px}
.items-table th {background:var(--bg-med);font:600 13px/1 'Segoe UI';text-transform:uppercase;letter-spacing:.5px;padding:14px 15px;color:var(--text);text-align:center;border-bottom:2px solid var(--border)}
.items-table td {background:var(--bg-darker);border:1px solid var(--border);padding:14px 15px;text-align:center;color:var(--text-muted);font-family:'Courier New',monospace}
.items-table tbody tr {transition:transform .2s,background-color .2s}
.items-table tbody tr:hover {transform:translateY(-2px)}
.items-table tbody tr:hover td {background:#2f2f2f}
.price-editable {cursor:pointer;position:relative;padding-right:20px}
.price-editable::after {content:'✎';position:absolute;right:5px;opacity:0;transition:opacity .2s}
.price-editable:hover::after {opacity:.7}
.price-edited::after {content:'*';color:#fd7;position:absolute;right:-8px;top:0}
.save-changes-button {transition:var(--transition);position:relative;overflow:hidden}
.save-changes-button.saving {background:#666;cursor:wait}
.save-changes-button.saving::after {content:'Saving...';position:absolute;inset:0;background:#666;display:flex;align-items:center;justify-content:center}
.save-changes-button.saved {background:#45a049}
.save-changes-button.error {background:var(--error);animation:shake .5s}
.receipt-url-copy {margin-bottom:15px;padding:10px;background:#2a2a2a;border-radius:4px;border:1px solid var(--border)}
.url-display {display:flex;align-items:center;justify-content:space-between;gap:10px}
.url-text {color:var(--text-muted);font:12px monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.items-table input[type="number"] {background:var(--bg-med);border:1px solid var(--border);color:var(--text);border-radius:4px;font:14px 'Courier New',monospace;width:100%;padding:8px}
.items-table input[type="number"]:focus {outline:2px solid #4a9eff;border-color:#4a9eff}
.calculate-button.calculating {opacity:.7;cursor:not-allowed}
.calculate-button.error {animation:shake .5s;background-color:#f44}
@keyframes shake {0%,100% {transform:translateX(0)}25% {transform:translateX(-5px)}75% {transform:translateX(5px)}}
@media only screen and (max-width:784px), only screen and (max-device-width:784px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:8px !important;padding:15px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:12px 20px !important;font-size:16px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-2 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-1 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.accept-trade-button {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:0 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container .button-icon {display:inline-block !important;width:18px !important;height:18px !important;vertical-align:middle !important}
.stripe-container .button-text {display:none !important}
.copy-url-button,.view-edit-receipt-button {width:100%;padding:12px 20px;touch-action:manipulation}
.receipt-modal {width:95%;margin:20px}
.items-table {border-spacing:0 12px}
.items-table td,.items-table th {padding:16px;font-size:15px}
.url-display {flex-direction:column;gap:5px}
}
@media only screen and (max-width:480px), only screen and (max-device-width:480px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:6px !important;padding:12px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:14px !important;font-size:14px !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:-2 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:-1 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.accept-trade-button {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:0 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container .button-icon {display:inline-block !important;width:16px !important;height:16px !important;vertical-align:middle !important}
.receipt-modal {width:100%;margin:15px}
.items-table {border-spacing:0 10px}
.items-table td,.items-table th {padding:14px 12px;font-size:14px}
.modal-header {padding:10px 15px}
.modal-header h2 {font-size:1em}
.close-modal {font-size:20px}
.save-changes-button {width:100%;margin:15px 0;touch-action:manipulation}
.copy-url-button,.view-edit-receipt-button {width:100%;padding:14px 20px;touch-action:manipulation}
.new-trade-toggle-header{cursor:pointer;position:relative}
.new-trade-toggle-header::after{content:'▼';font-size:11px;position:absolute;right:10px;top:50%;transform:translateY(-50%);opacity:.7;transition:transform .2s}
.new-trade-toggle-header.expanded::after{transform:translateY(-50%) rotate(-180deg)}
}` : '';

    if (isTradePage && styles) {
        document.head.appendChild(Object.assign(document.createElement('style'), { textContent: styles }));
    }

    // Storage wrapper
    const storage = {
        get: (keys) => Promise.resolve((Array.isArray(keys) ? keys : [keys]).reduce((acc, key) => {
            const val = GM_getValue(key);
            if (val !== undefined) acc[key] = val;
            return acc;
        }, {})),
        set: (items) => Promise.resolve(Object.entries(items).forEach(([k, v]) => GM_setValue(k, v)))
    };

    // Trade event types
    const TRADE_EVENTS = {
        INITIATED: 4401,
        ITEMS_ADDED: 4482,
        ITEMS_REMOVED: 4483,
        MONEY_ADDED: 4442,
        MONEY_REMOVED: 4443,
        ACCEPTED: 4431,
        COMPLETED: 4430,
        EXPIRED: 4420,
        CANCELLED: 4411
    };
    const TERMINAL_EVENTS = [TRADE_EVENTS.COMPLETED, TRADE_EVENTS.EXPIRED, TRADE_EVENTS.CANCELLED];

    // Performance: Debounce helper (increased wait time on mobile for better performance)
    const debounce = (func, wait) => {
        const actualWait = isMobile ? wait * 1.5 : wait; // 50% longer on mobile
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), actualWait);
        };
    };

    // Re-check mobile status on resize (for device rotation, responsive testing, etc.)
    window.addEventListener('resize', debounce(() => {
        const wasMobile = isMobile;
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 784;

        // If mobile status changed, we might need to re-initialize some things
        if (wasMobile !== isMobile) {
            console.log('Mobile status changed:', isMobile);
        }
    }, 250));

    // Performance: Cache for user profiles (reduces API calls)
    const userProfileCache = new Map();
    const CACHE_DURATION = 3600000; // 1 hour
    const MAX_CACHE_SIZE = 100; // Prevent unbounded memory growth

    // Performance: Batch storage updates to reduce I/O
    let storageBatch = {};
    let storageBatchTimeout = null;
    const flushStorageBatch = () => {
        if (Object.keys(storageBatch).length > 0) {
            storage.set(storageBatch);
            storageBatch = {};
        }
    };
    const batchedStorage = {
        set: (key, value) => {
            storageBatch[key] = value;
            clearTimeout(storageBatchTimeout);
            storageBatchTimeout = setTimeout(flushStorageBatch, 50);
        },
        flush: flushStorageBatch // Expose manual flush for cleanup
    };

    // Common selectors
    const SELECTORS = {
        // Only target the "Current Trade" list (no m-bottom10 class), not "Past Trades"
        // Past trades share the same base classes but add "m-bottom10" on the <ul>
        TRADE_LIST: '.trades-cont.current:not(.m-bottom10)',
        TRADE_LIST_ITEM: '.trades-cont.current:not(.m-bottom10) li',
        TRADE_LINK: '.view a[href*="ID="]',
        STRIPE_CONTAINER: '.stripe-container',
        TRADE_CONTAINER: '#trade-container',
        INFO_MSG_GREEN: '.info-msg-cont.green'
    };

    // State configuration
    const TRADE_STATES = {
        empty: { text: 'Empty', color: '#6b7280' },
        'needs-money': { text: 'Needs Money', color: '#f59e0b' },
        'too-low': { text: 'Too Low', color: '#ef4444' },
        'too-high': { text: 'Too High', color: '#ef4444' },
        ready: { text: 'Ready', color: '#10b981' },
        accepted: { text: 'Accepted', color: '#8b5cf6' },
        unknown: { text: 'Unknown', color: '#6b7280' }
    };

    // API key management
    const apiKey = {
        get: async () => (await storage.get(['torn_api_key'])).torn_api_key || null,
        set: (key) => storage.set({ torn_api_key: key }),
        ensure: async () => {
            let key = await apiKey.get();
            if (!key) {
                key = prompt('Please enter your Torn API key for real-time trade updates:');
                if (key) await apiKey.set(key);
            }
            return key;
        }
    };

    // Fetch user profile data (with caching to reduce API calls)
    const fetchUserProfile = async (userID) => {
        // Check cache first
        const cached = userProfileCache.get(userID);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const key = await apiKey.get();
        if (!key) return null;

        try {
            const response = await fetch(`https://api.torn.com/user/${userID}?key=${key}&comment=AutoTrade&selections=profile`);
            const data = await response.json();

            if (data?.error) return null;

            // Cache the result (with LRU eviction to prevent memory issues)
            if (userProfileCache.size >= MAX_CACHE_SIZE) {
                // Remove oldest entry
                const firstKey = userProfileCache.keys().next().value;
                userProfileCache.delete(firstKey);
            }
            userProfileCache.set(userID, { data, timestamp: Date.now() });

            return data;
        } catch (error) {
            return null;
        }
    };

    // Helper to add click + touch handlers (reduces code duplication)
    const addHandler = (elem, handler, preventDisabled = false) => {
        elem._clickHandler = handler;
        elem.addEventListener('click', handler);
        if (isMobile) {
            elem._touchHandler = (e) => {
                if (!preventDisabled || !elem.disabled) {
                    e.preventDefault();
                    handler(e);
                }
            };
            elem.addEventListener('touchend', elem._touchHandler, { passive: false });
        }
    };

    // Helper to remove click + touch handlers
    const removeHandler = (elem) => {
        if (elem._clickHandler) {
            elem.removeEventListener('click', elem._clickHandler);
            if (isMobile && elem._touchHandler) {
                elem.removeEventListener('touchend', elem._touchHandler);
            }
        }
    };

    const el = (tag, { classes, text, html, attributes, style, onClick, children } = {}) => {
        const e = document.createElement(tag);
        if (classes) e.classList.add(...(Array.isArray(classes) ? classes : [classes]));
        if (text) e.textContent = text;
        if (html) e.innerHTML = html;
        if (attributes) Object.entries(attributes).forEach(([k, v]) => e.setAttribute(k, v));
        if (style) Object.assign(e.style, style);
        if (onClick) addHandler(e, onClick, true);
        if (children) children.forEach(c => c && e.appendChild(c));
        return e;
    };

    let lastProcessedEventID = null;
    let tradePollingInterval = null;
    let timeRefreshInterval = null;
    let isFirstPoll = true;
    let lastPollTime = 0;
    let apiTradeData = {}; // Cache of trade data from API

    const processActivityLog = async (eventsData) => {
        if (!eventsData || typeof eventsData !== 'object') return;

        // Process activity logs on all pages to populate apiTradeData and save states
        // Only skip if we're on a trade page with a step (view/accept/etc) - still process on main trade page
        const step = getStep();
        const isMainTradePage = isTradePage && !step;
        const tradeList = isMainTradePage ? q(SELECTORS.TRADE_LIST) : null;

        // Convert object to array and sort by timestamp (newest first)
        const events = Object.entries(eventsData)
            .map(([id, event]) => ({ ...event, ID: id }))
            .sort((a, b) => b.timestamp - a.timestamp);

        // First pass: determine most recent status for each trade
        const tradeStatuses = {}; // Maps tradeID -> most recent event log type
        const tradesToCreate = []; // List of trades that need to be created

        for (const event of events) {
            // Early exit if we've reached previously processed events
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;

            if (event.category !== 'Trades') continue;

            const tradeIDMatch = event.data?.trade_id?.match(/ID=(\d+)/);
            if (!tradeIDMatch) continue;

            const tradeID = tradeIDMatch[1];

            // Track most recent status (since we're going newest to oldest, first one wins)
            if (!tradeStatuses[tradeID]) {
                tradeStatuses[tradeID] = event.log;
            }

            // If this is a trade initiation event, save it for potential creation
            if (event.log === TRADE_EVENTS.INITIATED) {
                tradesToCreate.push({
                    tradeID,
                    userID: event.data?.user,
                    description: event.data?.description || 'Trade',
                    timestamp: event.timestamp,
                    eventID: event.ID
                });
            }
        }

        // Filter out trades with terminal statuses (expired/completed/cancelled)
        const validTrades = tradesToCreate.filter(trade => {
            const status = tradeStatuses[trade.tradeID];
            return !TERMINAL_EVENTS.includes(status);
        });

        // Sort valid trades by timestamp (oldest first) for proper insertion order
        validTrades.sort((a, b) => a.timestamp - b.timestamp);

        // Initialize apiTradeData for all trades (needed for state inference on all pages)
        for (const trade of validTrades) {
            if (!apiTradeData[trade.tradeID]) {
                apiTradeData[trade.tradeID] = { items: [], moneyTotal: 0, hasItems: false, hasMoney: false };
            }
            apiTradeData[trade.tradeID].userID = trade.userID;
            apiTradeData[trade.tradeID].lastEventTime = trade.timestamp * 1000; // Store initial event timestamp
        }

        // Create trade rows in chronological order (only on main trade page where tradeList exists)
        if (tradeList) {
            for (const trade of validTrades) {
                // Check if trade already exists in list
                const allTrades = Array.from(qa(SELECTORS.TRADE_LIST_ITEM));
                const existingTrade = allTrades.find(li => {
                    const link = li.querySelector(SELECTORS.TRADE_LINK);
                    return link && link.href.includes(`ID=${trade.tradeID}`);
                });

                if (!existingTrade) {
                    await createTradeRow(trade.tradeID, trade.userID, trade.description, trade.timestamp);
                }
            }
        }

        // Second pass: process all events for updates to existing trades
        for (const event of events) {
            // Skip if we've already processed this event
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;

            const isNewEvent = !isFirstPoll; // Only show toasts for events after initial load

            // Only process trade events
            if (event.category !== 'Trades') continue;

            // Extract trade ID from data.trade_id
            const tradeIDMatch = event.data?.trade_id?.match(/ID=(\d+)/);
            if (!tradeIDMatch) continue;

            const tradeID = tradeIDMatch[1];
            const userID = event.data?.user;

            // Initialize trade data if not exists
            if (!apiTradeData[tradeID]) {
                apiTradeData[tradeID] = { items: [], moneyTotal: 0, hasItems: false, hasMoney: false };
            }

            // Handle different trade event types (skip INITIATED as already handled in first pass)
            if (event.log === TRADE_EVENTS.ITEMS_ADDED || event.log === TRADE_EVENTS.ITEMS_REMOVED) {
                const action = event.log === TRADE_EVENTS.ITEMS_ADDED ? 'added items to' : 'removed items from';
                if (event.log === TRADE_EVENTS.ITEMS_ADDED && event.data?.items) {
                    apiTradeData[tradeID].items = event.data.items;
                    apiTradeData[tradeID].hasItems = true;
                } else if (event.log === TRADE_EVENTS.ITEMS_REMOVED) {
                    apiTradeData[tradeID].hasItems = false;
                }
                apiTradeData[tradeID].lastEventTime = event.timestamp * 1000; // Store event timestamp
                await inferStateFromAPI(tradeID);
                if (isMainTradePage) {
                    updateTradeStatusBadge(tradeID);
                }
            } else if (event.log === TRADE_EVENTS.MONEY_ADDED || event.log === TRADE_EVENTS.MONEY_REMOVED) {
                const action = event.log === TRADE_EVENTS.MONEY_ADDED ? 'added' : 'removed';
                const money = event.data?.money || 0;
                const moneyTotal = event.data?.total || 0;
                apiTradeData[tradeID].moneyTotal = moneyTotal;
                apiTradeData[tradeID].hasMoney = moneyTotal > 0;
                apiTradeData[tradeID].lastEventTime = event.timestamp * 1000; // Store event timestamp
                await inferStateFromAPI(tradeID);
                if (isMainTradePage) {
                    updateTradeStatusBadge(tradeID);
                }
            } else if (event.log === TRADE_EVENTS.ACCEPTED) {
                apiTradeData[tradeID].accepted = true;
                apiTradeData[tradeID].acceptedAt = event.timestamp * 1000;
                apiTradeData[tradeID].lastEventTime = event.timestamp * 1000; // Store event timestamp
                await inferStateFromAPI(tradeID);
                if (isMainTradePage) {
                    updateTradeStatusBadge(tradeID);
                }
            } else if (TERMINAL_EVENTS.includes(event.log)) {
                const statusText = event.log === TRADE_EVENTS.COMPLETED ? 'completed ✓' :
                                 event.log === TRADE_EVENTS.EXPIRED ? 'expired' : 'cancelled';
                if (isMainTradePage) {
                    removeTradeFromList(tradeID);
                }
                delete apiTradeData[tradeID]; // Clean up cache
                // Clean up localStorage (batched)
                batchedStorage.set(`trade_state_${tradeID}`, undefined);
            }
        }

        // After processing all events, ensure all trades in apiTradeData have their states inferred and saved
        // This ensures that when we navigate to trade.php, the states are already in localStorage
        for (const tradeID of Object.keys(apiTradeData)) {
            const existingState = await getTradeState(tradeID);
            // Only infer if we don't already have a recent state, or if API data has been updated
            if (!existingState || (apiTradeData[tradeID].lastEventTime && existingState.eventTimestamp !== apiTradeData[tradeID].lastEventTime)) {
                await inferStateFromAPI(tradeID);
            }
        }

        // Update last processed event
        if (events.length > 0) {
            lastProcessedEventID = events[0].ID;
        }

        // Mark first poll as complete
        if (isFirstPoll) {
            isFirstPoll = false;
        }
    };

    const calculateTimeRemaining = (timestamp) => {
        const remaining = (timestamp * 1000 + 6 * 60 * 60 * 1000) - Date.now();
        if (remaining <= 0) return '0 mins';

        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
    };

    const createTradeRow = async (tradeID, userID, description, timestamp) => {
        const tradeList = q(SELECTORS.TRADE_LIST);
        if (!tradeList) return;

        // Fetch user profile for honor badge and name
        const profile = await fetchUserProfile(userID);

        const userName = profile?.name || `User [${userID}]`;
        const honor = profile?.honor || 0;

        const timeRemaining = calculateTimeRemaining(timestamp);

        // Generate username HTML with honor badge (similar to Torn's structure)
        const userNameChars = userName.split('').map(c => `<span data-char="${c}"></span>`).join('');
        const honorImageBase = `/images/honors/${honor}/`;

        // Create trade row matching Torn's structure
        const li = el('li');
        li.innerHTML = `
            <div class="namet t-blue h">
                <a class="user name t-hide" data-placeholder="${userName} [${userID}]" href="/profiles.php?XID=${userID}" title="${userName} [${userID}]">
                    <div class="honor-text-wrap default" style="--arrow-width: 20px;">
                        <img srcset="${honorImageBase}f.png 1x, ${honorImageBase}f@2x.png 2x, ${honorImageBase}f@3x.png 3x, ${honorImageBase}f@4x.png 4x" src="${honorImageBase}f.png" border="0" alt="${userName} [${userID}]">
                        <span class="honor-text honor-text-svg">${userNameChars}</span>
                        <span class="honor-text">${userName}</span>
                    </div>
                </a>
                <a class="user name t-show" data-placeholder="${userName} [${userID}]" href="/profiles.php?XID=${userID}" title="${userName} [${userID}]">
                    <div class="honor-text-wrap default" style="--arrow-width: 20px;">
                        <img srcset="${honorImageBase}h.png 1x, ${honorImageBase}h@2x.png 2x, ${honorImageBase}h@3x.png 3x, ${honorImageBase}h@4x.png 4x" src="${honorImageBase}h.png" border="0" alt="${userName} [${userID}]">
                        <span class="honor-text honor-text-svg">${userNameChars}</span>
                        <span class="honor-text">${userName}</span>
                    </div>
                </a>
            </div>
            <div class="desc">
                <span class="desk">Expires in -</span>
                <span class="mob">Exp:</span>
                <span class="time">${timeRemaining} </span>
                <p>Description: ${description}</p>
            </div>
            <div class="view">
                <a href="trade.php#step=view&ID=${tradeID}" area-label="view">
                    <i class="view-icon"></i>
                </a>
            </div>
        `;

        // Insert at the bottom of the list
        const lastLi = tradeList.querySelector('li.last');
        if (lastLi) lastLi.classList.remove('last');

        tradeList.appendChild(li);
        li.classList.add('last');

        // Add status indicator (debounced)
        debouncedDisplayStates();

        // Flash animation
        li.style.animation = 'flashNew 1s ease-in-out';
        const flashStyle = document.getElementById('flash-styles') || el('style', { id: 'flash-styles' });
        flashStyle.textContent = '@keyframes flashNew { 0%, 100% { background: transparent; } 50% { background: rgba(59, 130, 246, 0.1); } }';
        if (!document.getElementById('flash-styles')) {
            document.head.appendChild(flashStyle);
        }
    };

    const updateTradeStatusBadge = async (tradeID) => {
        // Find the trade in the list
        const allTrades = qa(SELECTORS.TRADE_LIST_ITEM);
        for (const li of allTrades) {
            const link = li.querySelector(SELECTORS.TRADE_LINK);
            if (link && link.href.includes(`ID=${tradeID}`)) {
                // Update the status indicator
                const statusIndicator = li.querySelector('.trade-status-indicator');
                if (statusIndicator) {
                    statusIndicator.remove();
                    debouncedDisplayStates();
                }

                // Flash the row to indicate update
                li.style.animation = 'flashNew 0.5s ease-in-out';
                break;
            }
        }
    };

    const removeTradeFromList = (tradeID) => {
        for (const li of qa(SELECTORS.TRADE_LIST_ITEM)) {
            const link = li.querySelector(SELECTORS.TRADE_LINK);
            if (link?.href.match(/ID=(\d+)/)?.[1] === String(tradeID)) {
                Object.assign(li.style, { transition: 'opacity 0.3s, transform 0.3s', opacity: '0', transform: 'translateX(-20px)' });
                setTimeout(() => li.remove(), 300);
                return;
            }
        }
    };

    const pollTradeEvents = async () => {
        // Prevent polling more frequently than every 30 seconds (with 1 second buffer for timing variance)
        const now = Date.now();
        if (now - lastPollTime < 29000) return;

        lastPollTime = now;

        const key = await apiKey.get();
        if (!key) return;

        const fiveMinutesAgo = Math.floor((Date.now() - 300000) / 1000); // 5 minutes

        try {
            const response = await fetch(`https://api.torn.com/user/?key=${key}&cat=94&from=${fiveMinutesAgo}&selections=log`);
            const data = await response.json();

            if (data?.error) {
                if (data.error.code === 2) {
                    // Invalid API key
                    await storage.set({ torn_api_key: undefined });
                    stopTradePolling();
                }
                return;
            }

            if (data?.log && typeof data.log === 'object') {
                await processActivityLog(data.log);
                // After processing activity log, refresh trade states display on trade list page
                if (isTradePage && !getStep()) {
                    // Use a small delay to ensure DOM is ready
                    setTimeout(() => debouncedDisplayStates(), 100);
                }
            }
        } catch (error) {
            // Silent fail - polling will retry
        }
    };

    const startTradePolling = async () => {
        // If already polling, don't start again
        if (tradePollingInterval) return;

        const key = await apiKey.ensure();
        if (!key) return;

        // Reset first poll flag
        isFirstPoll = true;

        // Initial poll (respects 30 second rate limit)
        await pollTradeEvents();

        // Poll every 30 seconds
        tradePollingInterval = setInterval(pollTradeEvents, 30000);

        // Start time refresh interval (every second for real-time updates)
        if (!timeRefreshInterval) {
            timeRefreshInterval = setInterval(refreshTradeStatusTimes, 1000);
        }
    };

    const stopTradePolling = () => {
        if (tradePollingInterval) {
            clearInterval(tradePollingInterval);
            tradePollingInterval = null;
        }
        if (timeRefreshInterval) {
            clearInterval(timeRefreshInterval);
            timeRefreshInterval = null;
        }
    };

    const showMsg = (element, message, duration = 1000, className = 'copy-confirmation') => {
        const span = element.querySelector('.button-text');
        const orig = span ? span.textContent : (element.children.length ? element.innerHTML : element.textContent);
        const prop = element.children.length ? 'innerHTML' : 'textContent';

        span ? (span.textContent = message) : (element[prop] = message);
        element.classList.add(className);

        setTimeout(() => {
            span ? (span.textContent = orig) : (element[prop] = orig);
            element.classList.remove(className);
        }, duration);
    };

    const createTable = (items = []) => {
        const tbody = el('tbody');
        items.forEach(item => {
            const itemId = item.id || item.itemId || '';
            const imageUrl = itemId ? `https://www.torn.com/images/items/${itemId}/medium.png` : '';
            const row = el('tr', {
                html: `<td><img src="${imageUrl}" alt="Item" style="max-width:50px;max-height:50px;"/></td><td>${item.name}</td><td>${item.quantity}</td><td>$${(item.priceUsed || 0).toLocaleString()}</td><td>$${(item.totalValue || 0).toLocaleString()}</td>`
            });
            // Store itemId as data attribute for later retrieval
            row.dataset.itemId = itemId;
            tbody.appendChild(row);
        });
        return el('table', { classes: 'items-table', children: [
            el('thead', { html: '<tr><th>Image</th><th>Name</th><th>Quantity</th><th>Price</th><th>Total</th></tr>' }),
            tbody
        ]});
    };

    let currentReceipt = null, currentReceiptURL = null;

    const getParam = (name) => new URLSearchParams(location.hash.substring(1)).get(name);
    const getTradeID = () => getParam('ID');
    const getStep = () => getParam('step');
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => document.querySelectorAll(sel);

    // Extract receipt ID from receipt URL
    const getReceiptIdFromURL = (receiptURL) => {
        if (!receiptURL) return null;
        try {
            const url = new URL(receiptURL);
            const pathParts = url.pathname.split('/');
            const receiptIndex = pathParts.indexOf('receipt');
            if (receiptIndex !== -1 && receiptIndex < pathParts.length - 1) {
                return pathParts[receiptIndex + 1];
            }
        } catch (e) {
            console.error('Failed to parse receipt URL:', e);
        }
        return null;
    };

    const getStoredData = async (tradeID) => (await storage.get([`trade_${tradeID}`]))[`trade_${tradeID}`] || null;

    const storeData = async (tradeID, items, receipt, receiptURL) => {
        const existing = await getStoredData(tradeID);
        const manual_prices = existing?.manual_prices || {};
        return storage.set({
            [`trade_${tradeID}`]: { items, receipt, receiptURL, timestamp: Date.now(), total_value: receipt.total_value, manual_prices }
        });
    };

    const itemsMatch = (items1, items2) => {
        if (items1.length !== items2.length) return false;
        const sort = arr => [...arr].sort((a, b) => a.name.localeCompare(b.name));
        const [s1, s2] = [sort(items1), sort(items2)];
        return s1.every((item, i) => item.name === s2[i].name && item.quantity === s2[i].quantity);
    };

    const getMoneyInTrade = () => {
        const match = q('.user.left .cont li.color1 ul.desc li .name.left')?.textContent?.trim()?.match(/\$([0-9,]+)/);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    };

    const moneyMatches = () => currentReceipt?.total_value && getMoneyInTrade() === currentReceipt.total_value;
    const parseValidItems = () => parseItems().filter(i => i.name.toLowerCase() !== "no items in trade");

    // Trade state tracking
    const SEVEN_HOURS = 7 * 60 * 60 * 1000;

    const getTradeState = async (tradeID) => {
        const key = `trade_state_${tradeID}`;
        const data = (await storage.get([key]))[key];
        if (!data) return null;

        // Check if expired (older than 7 hours)
        if (Date.now() - data.timestamp > SEVEN_HOURS) {
            await storage.set({ [key]: undefined });
            return null;
        }
        return data;
    };

    const setTradeState = async (tradeID, state, additionalData = {}) => {
        const key = `trade_state_${tradeID}`;
        const data = {
            state,
            timestamp: Date.now(),
            ...additionalData
        };
        // Use batched storage for better performance
        batchedStorage.set(key, data);
    };

    const determineTradeState = () => {
        const items = parseValidItems();
        const hasItems = items.length > 0;
        const moneyInTrade = getMoneyInTrade();
        const expectedValue = currentReceipt?.total_value || 0;
        const acceptButtonExists = !!q('.btn.accept.torn-btn.green');

        if (!hasItems) return 'empty';
        if (moneyInTrade === 0) return 'needs-money';
        if (expectedValue > 0 && moneyInTrade < expectedValue) return 'too-low';
        if (expectedValue > 0 && moneyInTrade > expectedValue) return 'too-high';
        if (moneyInTrade > 0 && !acceptButtonExists) return 'accepted'; // Changed from 'waiting'
        if (moneyInTrade === expectedValue && acceptButtonExists) return 'ready';
        return 'unknown';
    };

    const formatTimeAgo = (timestamp) => {
        const s = Math.floor((Date.now() - timestamp) / 1000);
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
    };

    const inferStateFromAPI = async (tradeID) => {
        const apiData = apiTradeData[tradeID];
        if (!apiData) return null;

        // Infer state from API data
        let inferredState = null;
        if (apiData.accepted) {
            inferredState = 'accepted';
        } else if (!apiData.hasItems) {
            inferredState = 'empty';
        } else if (apiData.hasItems && !apiData.hasMoney) {
            inferredState = 'needs-money';
        } else if (apiData.hasItems && apiData.hasMoney) {
            // If we have both items and money but don't know the values, show as ready
            inferredState = 'ready';
        }

        // Save inferred state to localStorage for persistence
        if (inferredState) {
            const additionalData = {
                totalValue: apiData.moneyTotal || 0,
                eventTimestamp: apiData.lastEventTime // Use event timestamp, not current time
            };
            if (apiData.accepted && apiData.acceptedAt) {
                additionalData.acceptedAt = apiData.acceptedAt;
            }
            await setTradeState(tradeID, inferredState, additionalData);
        }

        return inferredState;
    };

    const getStateDisplay = async (stateData, tradeID = null) => {
        // Only try to infer from API if we have API data for this trade
        if (!stateData && tradeID && apiTradeData[tradeID]) {
            const inferred = await inferStateFromAPI(tradeID);
            if (inferred) {
                stateData = await getTradeState(tradeID);
            }
        }

        // Only show "Not opened" if we've actually checked and there's no state
        // Don't show it if we just haven't loaded the data yet (apiTradeData is empty)
        if (!stateData) {
            // If we don't have API data yet, return null to skip display (wait for activity log processing)
            if (tradeID && !apiTradeData[tradeID]) {
                return null;
            }
            return { text: 'Not opened', color: '#6b7280' };
        }

        const state = stateData.state;
        const baseDisplay = TRADE_STATES[state] || { text: 'Not opened', color: '#6b7280' };
        const timestampToUse = (state === 'accepted' && stateData.acceptedAt) || stateData.eventTimestamp || stateData.timestamp;

        let displayText = baseDisplay.text;
        if (timestampToUse) displayText += ` ${formatTimeAgo(timestampToUse)}`;
        if (stateData.totalValue && state !== 'empty') displayText += ` ($${stateData.totalValue.toLocaleString()})`;

        return { text: displayText, color: baseDisplay.color };
    };

    const updateTradeState = async () => {
        const tradeID = getTradeID();
        if (!tradeID || getStep() !== 'view') return;

        const state = determineTradeState();
        const existing = await getTradeState(tradeID);
        const additionalData = { totalValue: currentReceipt?.total_value || 0 };

        if (state === 'accepted' || existing?.acceptedAt) {
            additionalData.acceptedAt = existing?.acceptedAt || Date.now();
        }

        await setTradeState(tradeID, state, additionalData);
    };

    const cleanupOldStates = async () => {
        const allKeys = await storage.get([]);
        const now = Date.now();
        const toDelete = Object.keys(allKeys)
            .filter(k => k.startsWith('trade_state_') && allKeys[k] && now - allKeys[k].timestamp > SEVEN_HOURS)
            .reduce((obj, k) => ({ ...obj, [k]: undefined }), {});

        if (Object.keys(toDelete).length) await storage.set(toDelete);
    };

    const displayTradeStates = async () => {
        // Only run on the trade list page
        if (!isTradePage || getStep()) return;

        const tradeListItems = qa(SELECTORS.TRADE_LIST_ITEM);
        if (!tradeListItems.length) return;

        // Use Promise.all to fetch all states in parallel
        await Promise.all(Array.from(tradeListItems).map(async (li) => {
            // Skip if already has status indicator
            if (li.querySelector('.trade-status-indicator')) return;

            // Extract trade ID from the view link
            const viewLink = li.querySelector(SELECTORS.TRADE_LINK);
            const tradeID = viewLink?.href.match(/ID=(\d+)/)?.[1];
            if (!tradeID) return;

            const stateData = await getTradeState(tradeID);
            const display = await getStateDisplay(stateData, tradeID);

            // Skip if display is null (no data available yet)
            if (!display) return;

            // Create status indicator (styles now in CSS)
            const statusSpan = el('span', {
                classes: 'trade-status-indicator',
                text: display.text,
                attributes: { 'data-trade-id': tradeID },
                style: {
                    color: display.color,
                    backgroundColor: `${display.color}20`,
                    border: `1px solid ${display.color}40`
                }
            });

            // Insert status after the description
            const descP = li.querySelector('.desc p');
            if (descP) descP.appendChild(statusSpan);
        }));
    };

    // Debounced version to prevent excessive DOM updates
    const debouncedDisplayStates = debounce(displayTradeStates, 100);

    const refreshTradeStatusTimes = async () => {
        if (getStep()) return;

        const statusBadges = qa('.trade-status-indicator[data-trade-id]');
        if (!statusBadges.length) return;

        await Promise.all(Array.from(statusBadges).map(async (badge) => {
            const tradeID = badge.getAttribute('data-trade-id');
            if (!tradeID) return;

            const display = await getStateDisplay(await getTradeState(tradeID), tradeID);
            if (badge.textContent !== display.text) {
                badge.textContent = display.text;
                Object.assign(badge.style, {
                    color: display.color,
                    backgroundColor: `${display.color}20`,
                    border: `1px solid ${display.color}40`
                });
            }
        }));
    };

    // Button creation helper
    const createButton = (classes, iconSvg, text, onClick) =>
        el('button', { classes, html: `${iconSvg}<span class="button-text">${text}</span>`, onClick });

    const SVG_ICONS = {
        receipt: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        back: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13S14.22 4.41 6.42 4.41V1L0 6.7l6.42 5.9V8.75c4.24 0 7.37.38 9.58 4.25"/></svg>',
        dashboard: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
        calculate: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>',
        money: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>',
        add: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
        check: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    };

    // Helper to configure accept button state (reduces repetition)
    const setButtonState = (btn, { icon, text, disabled, enabled, background, onClick }) => {
        const iconEl = btn.querySelector('.button-icon');
        const textEl = btn.querySelector('.button-text');

        if (iconEl && icon) iconEl.outerHTML = icon;
        if (textEl && text) textEl.textContent = text;
        if (!iconEl || !textEl) btn.innerHTML = `${icon}<span class="button-text">${text}</span>`;

        btn.disabled = disabled;
        btn.classList.toggle('enabled', enabled);
        btn.style.background = background || '';

        removeHandler(btn);
        if (onClick) addHandler(btn, onClick, true);
    };

    const apiCall = (endpoint, data) => new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://weav3r.dev/api/${endpoint}`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            onload: (r) => {
                try { resolve(JSON.parse(r.responseText)); }
                catch { resolve(endpoint.startsWith('pricelist/') ? { receipt: null, receiptURL: null } : { success: false }); }
            },
            onerror: () => resolve(endpoint.startsWith('pricelist/') ? { receipt: null, receiptURL: null } : { success: false })
        });
    });

    const parseItems = () => {
        const items = [];
        qa('.user.right .cont li.color2 ul.desc li').forEach(row => {
            const name = row.querySelector('.name.left')?.childNodes[0]?.nodeValue?.trim()?.match(/^(.+?)(?:\s+x(\d+))?$/);
            if (name) items.push({ name: name[1].trim(), quantity: parseInt(name[2] || 1, 10) });
        });
        return items;
    };

    let cachedUsername = null;
    const getUsername = () => cachedUsername || (cachedUsername = q('.user.right .title-black')?.childNodes[0]?.nodeValue?.trim() || null);

    // Get current user's ID from the hidden input on the page
    let cachedUserID = null;
    const getCurrentUserID = () => {
        if (cachedUserID) return cachedUserID;
        try {
            const tornUserInput = q('#torn-user');
            if (tornUserInput && tornUserInput.value) {
                const userData = JSON.parse(tornUserInput.value);
                if (userData && userData.id) {
                    cachedUserID = userData.id;
                    return cachedUserID;
                }
            }
        } catch (e) {
            console.error('Failed to get user ID:', e);
        }
        return null;
    };

    const colorCodeItemsByValue = () => {
        if (!currentReceipt?.items) return;

        const items = currentReceipt.items;
        if (!items.length) return;

        // Find all item names on the page
        const itemElements = qa('.user.right .cont li.color2 ul.desc li');
        itemElements.forEach(element => {
            const nameElement = element.querySelector('.name.left');
            if (!nameElement) return;

            // Get the item name from the DOM (extract from first text node)
            const textNode = nameElement.childNodes[0]?.nodeValue?.trim();
            if (!textNode) return;
            const match = textNode.match(/^(.+?)(?:\s+x\d+)?$/);
            const itemName = match ? match[1].trim() : textNode;

            if (!itemName) return;

            // Find matching item in receipt
            const receiptItem = items.find(i => i.name === itemName);
            if (!receiptItem) return;

            // Check if item has no price
            const hasPrice = receiptItem.priceUsed !== undefined && receiptItem.priceUsed !== null && receiptItem.priceUsed !== 0 && !isNaN(receiptItem.priceUsed);

            // Apply color based on value
            let color;
            if (!hasPrice || !receiptItem.totalValue) {
                color = '#7f1d1d'; // Dark red for no price
            } else {
                // Get min and max values for normalization
                const validItems = items.filter(i => i.totalValue && i.totalValue > 0);
                if (validItems.length === 0) {
                    color = '#7f1d1d'; // No valid values
                } else {
                    const values = validItems.map(i => i.totalValue);
                    const maxValue = Math.max(...values);
                    const minValue = Math.min(...values);

                    const value = receiptItem.totalValue || 0;

                    // Normalize value to 0-1 range, handle equal min/max case
                    let normalizedValue = 0;
                    if (maxValue > minValue) {
                        normalizedValue = (value - minValue) / (maxValue - minValue);
                    } else if (value === maxValue) {
                        normalizedValue = 1; // All values are the same
                    }

                    // Clamp to [0, 1]
                    normalizedValue = Math.max(0, Math.min(1, normalizedValue));

                    // Color stops with better distribution to avoid misleading colors
                    const colorStops = [
                        { pos: 0, r: 127, g: 29, b: 29 },     // Dark red (#7f1d1d) - lowest
                        { pos: 0.15, r: 239, g: 68, b: 68 },  // Red (#ef4444)
                        { pos: 0.35, r: 251, g: 146, b: 60 }, // Orange (#fb923c)
                        { pos: 0.5, r: 251, g: 191, b: 36 },  // Yellow (#fbbf24)
                        { pos: 0.7, r: 163, g: 230, b: 53 },  // Light green (#a3e635)
                        { pos: 0.85, r: 101, g: 217, b: 101 }, // Medium green (#65d965)
                        { pos: 1, r: 74, g: 222, b: 128 }     // Green (#4ade80) - highest
                    ];

                    // Find which two colors to interpolate between
                    let color1, color2;
                    for (let i = 0; i < colorStops.length - 1; i++) {
                        if (normalizedValue <= colorStops[i + 1].pos) {
                            color1 = colorStops[i];
                            color2 = colorStops[i + 1];
                            break;
                        }
                    }

                    // Interpolate between colors
                    if (color1 && color2) {
                        const ratio = (normalizedValue - color1.pos) / (color2.pos - color1.pos);
                        const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
                        const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
                        const b = Math.round(color1.b + (color2.b - color1.b) * ratio);
                        color = `rgb(${r}, ${g}, ${b})`;
                    } else {
                        color = '#7f1d1d';
                    }
                }
            }

            // Apply color to the name element
            nameElement.style.color = color;
            nameElement.style.transition = 'color 0.3s ease';
        });
    };

    const updateUI = () => {
        const total = q('.total-value-container'), receipt = q('.receipt-url-container');
        const container = q('.value-container'), stripe = q('.stripe-container');

        if (total && currentReceipt?.total_value !== undefined) {
            total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;

            // Only show receipt button if we have items and a receipt URL
            if (currentReceipt.items?.length > 0 && currentReceiptURL) {
                [total, receipt].forEach(e => e.classList.remove('hidden'));
                removeHandler(receipt);
                addHandler(receipt, showModal);
            } else {
                total.classList.remove('hidden');
                receipt.classList.add('hidden');
            }

            container.classList.add('visible');
            stripe.classList.add('expanded');

            removeHandler(total);
            addHandler(total, () => {
                navigator.clipboard.writeText(currentReceipt.total_value.toString());
                showMsg(total, 'Copied!', 1000);
            });

            updateAcceptBtn();

            // Decorations handled by autoCalc or manual calculation

            // Set up periodic updates for the accept button state and trade state (less frequent on mobile to save battery)
            if (!window.acceptBtnUpdateInterval) {
                window.acceptBtnUpdateInterval = setInterval(() => {
                    if (q('.accept-trade-button')) {
                        updateAcceptBtn();
                        updateTradeState();
                    }
                }, isMobile ? 750 : 500);
            }

            // Update trade state immediately
            updateTradeState();
        }
    };

    const autoCalc = async () => {
        const tradeID = getTradeID();
        if (!tradeID) return;

        const items = parseValidItems();

        // If no items, show empty state
        if (!items.length) {
            currentReceipt = { items: [], total_value: 0 };
            currentReceiptURL = null;
            updateUI();
            return;
        }

        // Show calculating state immediately for better UX
        const totalEl = q('.total-value-container');
        if (totalEl && !currentReceipt) {
            totalEl.textContent = 'Calculating...';
            totalEl.classList.remove('hidden');
            q('.value-container')?.classList.add('visible');
        }

        // Check cache first (this is fast)
        const stored = await getStoredData(tradeID);
        if (stored && itemsMatch(stored.items, items)) {
            currentReceipt = stored.receipt;
            currentReceiptURL = stored.receiptURL;

            if (stored.manual_prices) {
                currentReceipt.items = currentReceipt.items.map(item =>
                    stored.manual_prices[item.name]
                        ? { ...item, priceUsed: stored.manual_prices[item.name], totalValue: stored.manual_prices[item.name] * item.quantity }
                        : item
                );
                currentReceipt.total_value = currentReceipt.items.reduce((sum, i) => sum + i.totalValue, 0);
            }
            updateUI();

            // Run decorations asynchronously without blocking
            requestAnimationFrame(() => {
                colorCodeItemsByValue();
            });
            return;
        }

        // Make API call (parallelize username fetch with API call preparation)
        const username = getUsername();
        const userID = getCurrentUserID();
        if (!userID) {
            console.error('Could not get current user ID');
            return;
        }
        const res = await apiCall(`pricelist/${userID}`, { items, username, tradeID });

        if (res?.receipt?.total_value !== undefined && res.receiptURL) {
            currentReceipt = res.receipt;
            currentReceiptURL = res.receiptURL;

            // Store data and update UI in parallel
            storeData(tradeID, items, res.receipt, res.receiptURL); // No await - let it happen in background
            updateUI();

            // Run decorations asynchronously without blocking
            requestAnimationFrame(() => {
                colorCodeItemsByValue();
            });
        }
    };


    const initNewTradeCollapsible = (root = document) => {
        // Only collapse "New Trade" on the main trade.php page (no step=)
        if (getStep()) return;

        const containers = root.querySelectorAll('.init-trade.m-top10');
        containers.forEach(container => {
            if (container.dataset.newTradeCollapsedInit === '1') return;
            const heading = container.querySelector('.title-black.top-round[role="heading"]');
            const content = container.querySelector('.cont-gray.bottom-round');
            if (!heading || !content) return;

            container.dataset.newTradeCollapsedInit = '1';

            // Start collapsed
            content.style.display = 'none';
            heading.classList.add('new-trade-toggle-header');

            addHandler(heading, () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                heading.classList.toggle('expanded', isHidden);
            }, true);
        });
    };

    const initializeScript = () => {
        const obs = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === 'childList') {
                    const nodes = Array.from(m.addedNodes);
                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('trade-cont'))) {
                        initStripe();
                        autoCalc(); // autoCalc now handles decorations internally
                    }
                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('add-money'))) {
                        initStripe();
                        autoFill();
                    }

                    // Initialize collapsible "New Trade" section when it appears/reappears
                    if (nodes.some(n =>
                        n.nodeType === 1 &&
                        (n.classList?.contains('init-trade') || n.querySelector?.('.init-trade.m-top10'))
                    )) {
                        initNewTradeCollapsible();
                    }

                    // Check if trade list was added
                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('trades-cont'))) {
                        debouncedDisplayStates();
                    }

                    // Handle success messages that appear after adding money (but not accept trade confirmations)
                    for (const node of nodes) {
                        if (node.nodeType === 1 && node.classList?.contains('info-msg-cont') && node.classList?.contains('green')) {
                            const msgText = node.querySelector('.msg')?.textContent?.trim();

                            // Check if this is the accept trade confirmation message
                            if (msgText && msgText.includes('accepted the trade')) {
                                // Initialize stripe on accept page (minimal delay)
                                setTimeout(() => initStripe(), 50);
                            }
                            // Only intercept the "add money" success message, not the accept trade confirmation
                            else if (msgText && msgText.includes('changed your money for the trade') && !msgText.includes('accepted') && !msgText.includes('complete')) {
                                // Remove the message from DOM
                                node.style.display = 'none';
                                requestAnimationFrame(() => node.remove());
                            }
                        }
                    }
                }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        initNewTradeCollapsible();
        initStripe();
        autoCalc();
    };

    // Initialize trade-page UI only on trade.php
    if (isTradePage) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScript);
        } else {
            initializeScript();
        }
    }

    const createModal = () => {
        const closeModal = () => overlay.classList.remove('visible');
        const overlay = el('div', { classes: 'receipt-modal-overlay', onClick: (e) => e.target === overlay && closeModal() });
        const modal = el('div', { classes: 'receipt-modal', children: [
            el('div', { classes: 'modal-header', children: [
                el('h2', { text: 'Trade Items' }),
                el('button', { classes: 'close-modal', html: '&times;', onClick: closeModal })
            ]}),
            el('div', { classes: 'modal-content', children: [
                el('div', { classes: 'receipt-content', children: [el('div', { classes: 'loading-spinner', text: 'Loading...' })] })
            ]})
        ]});
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        return overlay;
    };

    const showModal = () => {
        if (!currentReceipt || !currentReceiptURL) return;
        let modal = q('.receipt-modal-overlay') || createModal();
        const content = modal.querySelector('.receipt-content');
        content.innerHTML = '<div class="loading-spinner">Loading...</div>';
        modal.classList.add('visible');

        setTimeout(() => {
            content.innerHTML = '';
            const copyBtn = el('button', { classes: 'copy-url-button', text: 'Copy URL',
                onClick: () => navigator.clipboard.writeText(currentReceiptURL).then(() => showMsg(copyBtn, 'Copied!', 2000))
            });
            content.appendChild(el('div', { classes: 'receipt-url-copy', children: [
                el('div', { classes: 'url-display', children: [
                    el('span', { classes: 'url-text', text: currentReceiptURL }), copyBtn
                ]})
            ]}));

            const table = createTable(currentReceipt.items);
            content.appendChild(table);

            const saveBtn = el('button', { classes: 'save-changes-button', text: 'Save Changes',
                style: { display: 'none' }, onClick: () => saveChanges(table, saveBtn)
            });
            content.appendChild(saveBtn);

            makeEditable(table, saveBtn);
            updateTotals(table);
        }, 200);
    };

    const makeEditable = (table, saveBtn) => {
        table.querySelectorAll('tbody tr td:nth-child(4)').forEach(cell => {
            cell.classList.add('price-editable');
            addHandler(cell, () => {
                const price = cell.textContent.replace(/[^0-9.]/g, '');
                const input = Object.assign(document.createElement('input'), { type: 'number', value: price });
                Object.assign(input.style, { width: isMobile ? '80px' : '100px', padding: '5px', textAlign: 'center', fontSize: '16px' });
                cell.textContent = '';
                cell.appendChild(input);
                input.focus();

                const done = () => {
                    const newPrice = parseFloat(input.value);
                    cell.textContent = isNaN(newPrice) ? `$${price}` : `$${newPrice.toLocaleString()}`;
                    if (!isNaN(newPrice)) {
                        cell.classList.add('price-edited');
                        updateTotals(table);
                        saveBtn.style.display = 'block';
                    }
                };
                input.addEventListener('blur', done, { passive: true });
                input.addEventListener('keypress', (e) => e.key === 'Enter' && input.blur());
            });
        });
    };

    const updateTotals = (table) => table.querySelectorAll('tbody tr').forEach(row => {
        const qty = parseInt(row.cells[2].textContent) || 0;
        const price = parseFloat(row.cells[3].textContent.replace(/[^0-9.]/g, '')) || 0;
        row.cells[4].textContent = `$${(qty * price).toLocaleString()}`;
    });

    const saveChanges = async (table, saveBtn) => {
        saveBtn.classList.add('saving');
        saveBtn.disabled = true;

        const updatedItems = [], manualPrices = {};
        table.querySelectorAll('tbody tr').forEach(row => {
            const name = row.cells[1].textContent;
            const priceUsed = parseFloat(row.cells[3].textContent.replace(/[^0-9.]/g, '')) || 0;
            const wasEdited = row.cells[3].classList.contains('price-edited');
            const itemId = parseInt(row.dataset.itemId);

            if (wasEdited && itemId && !isNaN(itemId)) {
                manualPrices[name] = priceUsed;
                // Only send items that were edited, in the format: { itemId, price }
                updatedItems.push({
                    itemId: itemId,
                    price: priceUsed
                });
            }
        });

        // Extract receipt ID from receipt URL
        const receiptId = getReceiptIdFromURL(currentReceiptURL);
        if (!receiptId) {
            saveBtn.classList.remove('saving');
            saveBtn.disabled = false;
            saveBtn.classList.add('error');
            setTimeout(() => saveBtn.classList.remove('error'), 2000);
            return;
        }

        // Only make API call if there are items to update
        if (updatedItems.length === 0) {
            saveBtn.classList.remove('saving');
            saveBtn.disabled = false;
            return;
        }

        const res = await apiCall(`updateReceipt/${receiptId}`, { items: updatedItems });

        saveBtn.classList.remove('saving');
        saveBtn.disabled = false;

        // Check if there was an error - if res.success is explicitly false, it's an error
        // Otherwise, treat it as success (API might not return success field)
        if (res?.success === false) {
            saveBtn.classList.add('error');
            setTimeout(() => saveBtn.classList.remove('error'), 2000);
        } else {
            const tradeID = getTradeID();

            // Update current receipt with new prices
            if (currentReceipt && currentReceipt.items) {
                // Create a map of updated prices by itemId
                const priceMap = new Map();
                updatedItems.forEach(item => {
                    priceMap.set(item.itemId, item.price);
                });

                // Update receipt items with new prices
                currentReceipt.items = currentReceipt.items.map(item => {
                    const itemId = item.id || item.itemId;
                    if (priceMap.has(itemId)) {
                        const newPrice = priceMap.get(itemId);
                        return {
                            ...item,
                            priceUsed: newPrice,
                            totalValue: newPrice * (item.quantity || 1)
                        };
                    }
                    return item;
                });

                // Recalculate total
                currentReceipt.total_value = currentReceipt.items.reduce((sum, item) => sum + (item.totalValue || 0), 0);
            }

            // Save to localStorage
            if (tradeID) {
                const items = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
                    name: row.cells[1].textContent,
                    quantity: parseInt(row.cells[2].textContent)
                }));

                // Get existing data first to preserve manual_prices and receiptURL
                const existing = await getStoredData(tradeID) || {};
                existing.items = items;
                existing.receipt = currentReceipt;
                existing.receiptURL = existing.receiptURL || currentReceiptURL; // Preserve existing receiptURL
                existing.total_value = currentReceipt?.total_value || 0;
                existing.timestamp = Date.now();
                existing.manual_prices = { ...existing.manual_prices, ...manualPrices };

                await storage.set({ [`trade_${tradeID}`]: existing });
            }

            // Update the table in the modal with the new data
            const tbody = table.querySelector('tbody');
            if (tbody && currentReceipt && currentReceipt.items) {
                tbody.innerHTML = '';
                currentReceipt.items.forEach(item => {
                    const isEdited = manualPrices.hasOwnProperty(item.name);
                    const priceValue = `$${(item.priceUsed || 0).toLocaleString()}`;

                    const itemId = item.id || item.itemId || '';
                    const imageUrl = itemId ? `https://www.torn.com/images/items/${itemId}/medium.png` : '';
                    const img = el('img', {
                        attributes: { src: imageUrl, alt: 'Item' },
                        style: { maxWidth: '50px', maxHeight: '50px' }
                    });
                    const imgCell = el('td');
                    imgCell.appendChild(img);

                    const nameCell = el('td', { text: item.name });
                    const qtyCell = el('td', { text: item.quantity.toString() });
                    const priceCell = el('td', { text: priceValue, classes: isEdited ? ['price-edited'] : [] });
                    const totalCell = el('td', { text: `$${(item.totalValue || 0).toLocaleString()}` });

                    const row = el('tr', { children: [imgCell, nameCell, qtyCell, priceCell, totalCell] });
                    // Store itemId as data attribute for later retrieval
                    row.dataset.itemId = item.id || item.itemId || '';
                    tbody.appendChild(row);
                });
                // Make it editable again after updating
                makeEditable(table, saveBtn);
            }

            // Update UI
            const total = q('.total-value-container');
            if (total) total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
            updateAcceptBtn();

            saveBtn.classList.add('saved');
            setTimeout(() => {
                saveBtn.style.display = 'none';
                saveBtn.classList.remove('saved');
            }, 2000);
        }
    };

    const initStripe = () => {
        // Check if we're on the accept confirmation page
        const isAcceptPage = getStep() === 'accept2';

        // Try to find trade container on regular trade page
        let tc = q('.trade-cont.m-top10');
        const isAddMoneyPage = !!q('.init-trade.add-money.m-top10');

        // If on accept page, find the confirmation message to insert after
        if (isAcceptPage) {
            const confirmMsg = q('.info-msg-cont.green');
            if (confirmMsg && !q('.stripe-container')) {
                // Create the stripe for the accept page
                const total = el('div', { classes: ['total-value-container'], text: 'Total Value: $0',
                    onClick: () => currentReceipt?.total_value && (navigator.clipboard.writeText(currentReceipt.total_value.toString()), showMsg(total, 'Copied!', 1000))
                });

                const receipt = el('div', {
                    classes: ['receipt-url-container'],
                    html: `${SVG_ICONS.receipt}<span class="button-text">View/Edit Receipt</span>`,
                    onClick: showModal
                });

                const container = el('div', { classes: ['value-container'], children: [total, receipt] });

                const tradeID = getTradeID();
                const backToTradeBtn = createButton(
                    ['calculate-button'],
                    SVG_ICONS.back,
                    'Back to Trade',
                    () => tradeID && (window.location.hash = `#step=view&ID=${tradeID}`)
                );

                const dashboardBtn = createButton(
                    ['accept-trade-button', 'enabled'],
                    SVG_ICONS.dashboard,
                    'Dashboard',
                    () => window.location.hash = '#'
                );

                const stripe = el('div', { classes: ['stripe-container', 'expanded'], children: [backToTradeBtn, container, dashboardBtn] });

                // Insert after the confirmation message
                confirmMsg.parentNode.insertBefore(stripe, confirmMsg.nextSibling);

                // Load stored data to show total value
                (async () => {
                    if (tradeID) {
                        const stored = await getStoredData(tradeID);
                        if (stored?.receipt) {
                            currentReceipt = stored.receipt;
                            currentReceiptURL = stored.receiptURL;
                            total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;

                            // Show/hide receipt button based on whether we have items
                            if (currentReceipt.items?.length > 0 && currentReceiptURL) {
                                receipt.classList.remove('hidden');
                                container.classList.add('visible');
                            } else {
                                receipt.classList.add('hidden');
                            }
                        }
                    }
                })();
            }
            return; // Exit early for accept page
        }

        // If not found, try add money page
        if (!tc && isAddMoneyPage) {
            tc = q('.init-trade.add-money.m-top10');
        }

        // Add expiration message container to add money page for layout consistency
        if (isAddMoneyPage && !q('.info-msg-cont')) {
            (async () => {
                let messageText = 'Add money to complete your side of the trade';

                // Try to get the calculated trade value
                const tradeID = getTradeID();
                if (tradeID) {
                    const stored = await getStoredData(tradeID);
                    if (stored?.total_value) {
                        messageText = `Add $${stored.total_value.toLocaleString()} to complete your side of the trade`;
                    }
                }

                // Create spacer element to maintain consistent layout with a custom message
                const spacerMsg = el('div', {
                    classes: ['info-msg-cont', 'border-round', 'm-top10', 'r3210'],
                    html: `<div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round" role="alert" aria-live="polite">${messageText}</div></div></div>`
                });
                // Insert before the stripe-container if it exists, otherwise before the trade container
                const existingStripe = q('.stripe-container');
                if (existingStripe) {
                    existingStripe.parentNode.insertBefore(spacerMsg, existingStripe);
                } else if (tc) {
                    tc.parentNode.insertBefore(spacerMsg, tc);
                }
            })();
        }

        if (!tc || q('.stripe-container')) return;

        const total = el('div', { classes: ['hidden', 'total-value-container'], text: 'Total Value: $0',
            onClick: () => currentReceipt?.total_value && (navigator.clipboard.writeText(currentReceipt.total_value.toString()), showMsg(total, 'Copied!', 1000))
        });

        const receipt = el('div', { classes: ['hidden', 'receipt-url-container'],
            html: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg><span class="button-text">View/Edit Receipt</span>',
            onClick: showModal
        });

        const container = el('div', { classes: ['value-container'], children: [total, receipt] });
        let children = [];

        const pasteIcon = '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';

        if (isAddMoneyPage) {
            // Add Money page buttons
            const pasteBtn = createButton(['calculate-button'], pasteIcon, 'Paste', async () => {
                const text = await navigator.clipboard.readText();
                qa('input.input-money').forEach(input => {
                    input.value = text;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            });

            const placeholderContainer = el('div', {
                classes: ['value-container', 'visible'],
                children: [
                    createButton(['calculate-button'], SVG_ICONS.money, 'Placeholder 1', () => {}),
                    createButton(['calculate-button'], SVG_ICONS.money, 'Placeholder 2', () => {})
                ]
            });

            const changeBtn = createButton(['accept-trade-button', 'enabled'], SVG_ICONS.check, 'Change',
                () => q('input[type="submit"].torn-btn')?.click()
            );

            children = [pasteBtn, placeholderContainer, changeBtn];
        } else {
            // Regular trade page buttons
            const accept = createButton(['accept-trade-button'], SVG_ICONS.check, 'Accept Trade',
                () => moneyMatches() && q('.btn.accept.torn-btn.green')?.click()
            );
            accept.disabled = true;

            const calculateHandler = async () => {
                btn.classList.add('calculating');
                btn.disabled = true;

                // Show "Calculating..." immediately
                total.textContent = 'Calculating...';
                total.classList.remove('hidden');
                container.classList.add('visible');

                const items = parseValidItems();
                if (!items.length) {
                    showMsg(btn, 'No items found', 2000, 'error');
                    btn.classList.remove('calculating');
                    btn.disabled = false;
                    total.classList.add('hidden');
                    container.classList.remove('visible');
                    return;
                }

                const username = getUsername();
                const tradeID = getTradeID();
                const userID = getCurrentUserID();
                if (!userID) {
                    showMsg(btn, 'Could not get user ID', 2000, 'error');
                    btn.classList.remove('calculating');
                    btn.disabled = false;
                    return;
                }
                const res = await apiCall(`pricelist/${userID}`, { items, username, tradeID });

                btn.classList.remove('calculating');
                btn.disabled = false;

                if (res?.receipt?.total_value !== undefined && res.receiptURL) {
                    currentReceipt = res.receipt;
                    currentReceiptURL = res.receiptURL;
                    total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
                    [total, receipt].forEach(e => e.classList.remove('hidden'));
                    container.classList.add('visible');
                    stripe.classList.add('expanded');
                    updateAcceptBtn(accept);

                    // Run decorations asynchronously
                    requestAnimationFrame(() => {
                        colorCodeItemsByValue();
                    });

                    // Store in background
                    storeData(tradeID, items, res.receipt, res.receiptURL);
                }
            };

            const btn = createButton(['calculate-button'], SVG_ICONS.calculate, 'Calculate Trade', calculateHandler);

            children = [btn, container, accept];
        }

        const stripe = el('div', { classes: ['stripe-container'], children });
        tc.parentNode.insertBefore(stripe, tc);
    };

    const updateAcceptBtn = (btn) => {
        if (!btn) btn = q('.accept-trade-button');
        if (!btn) return;

        const moneyInTrade = getMoneyInTrade();
        const acceptButtonExists = !!q('.btn.accept.torn-btn.green');
        const expectedValue = currentReceipt?.total_value || 0;
        const hasItems = currentReceipt?.items?.length > 0;
        const goToAddMoney = () => q('.user.left .cont li.color1 .add a[href*="step=addmoney"]')?.click();

        // No items in trade
        if (!hasItems) return setButtonState(btn, {
            icon: SVG_ICONS.add, text: 'No Items', disabled: true, enabled: false
        });

        // No money in trade
        if (!moneyInTrade) return setButtonState(btn, {
            icon: SVG_ICONS.add, text: 'Add Money', disabled: false, enabled: false, onClick: goToAddMoney
        });

        // Money in trade but no accept button - already accepted
        if (moneyInTrade > 0 && !acceptButtonExists) return setButtonState(btn, {
            icon: SVG_ICONS.check, text: 'Accepted', disabled: true, enabled: false,
            background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
        });

        // Check if money amount is correct, too low, or too high
        if (expectedValue > 0 && moneyInTrade !== expectedValue) {
            return setButtonState(btn, {
                icon: SVG_ICONS.add,
                text: moneyInTrade < expectedValue ? 'Too Low' : 'Too High',
                disabled: false, enabled: false,
                background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                onClick: goToAddMoney
            });
        }

        // Money matches - normal accept state
        const matches = moneyMatches();
        setButtonState(btn, {
            icon: SVG_ICONS.check, text: 'Accept Trade', disabled: !matches, enabled: matches,
            onClick: async () => {
                if (!moneyMatches()) return;
                const acceptBtn = q('.btn.accept.torn-btn.green');
                if (acceptBtn) {
                    const tradeID = getTradeID();
                    if (tradeID) {
                        await setTradeState(tradeID, 'accepted', {
                            acceptedAt: Date.now(),
                            totalValue: currentReceipt?.total_value || 0
                        });
                    }
                    acceptBtn.click();
                }
            }
        });
    };

    const autoFill = async () => {
        if (getStep() !== 'addmoney') return;
        const stored = await getStoredData(getTradeID());
        if (!stored?.total_value) return;

        const fill = () => {
            const inputs = qa('input.input-money');
            if (!inputs.length) return false;
            inputs.forEach(i => {
                // Prevent zoom on mobile when focusing input
                if (isMobile && i.style.fontSize !== '16px') {
                    i.style.fontSize = '16px'; // iOS won't zoom if font-size >= 16px
                }
                i.value = stored.total_value.toString();
                i.dispatchEvent(new Event('input', { bubbles: true }));
                i.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return true;
        };

        if (fill()) return;
        const obs = new MutationObserver((_, o) => fill() && o.disconnect());
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), isMobile ? 7000 : 5000); // Longer timeout on mobile
    };

    if (isTradePage && getStep() === 'addmoney') autoFill();
    if (isTradePage && getStep() === 'accept2') initStripe();

    // Cleanup old states (use idle callback for better performance)
    if (window.requestIdleCallback) {
        requestIdleCallback(() => cleanupOldStates(), { timeout: 5000 });
    } else {
        setTimeout(cleanupOldStates, 100);
    }

    // Start polling for trade updates on all Torn pages (DOM updates only occur on trade pages)
    startTradePolling();

    if (isTradePage && !getStep()) {
        // On main trade list page, display states and watch for list changes
        displayTradeStates();

        const tradeListObserver = new MutationObserver(debouncedDisplayStates);
        const tradeList = q(SELECTORS.TRADE_LIST);
        if (tradeList) {
            tradeListObserver.observe(tradeList, { childList: true });
        }
    }

    window.addEventListener('hashchange', () => {
        if (window.acceptBtnUpdateInterval) {
            clearInterval(window.acceptBtnUpdateInterval);
            window.acceptBtnUpdateInterval = null;
        }

        if (isTradePage) {
            if (getStep() === 'addmoney') autoFill();
            if (getStep() === 'accept2') {
                setTimeout(() => initStripe(), 50); // Small delay to let DOM update
            }
            if (!getStep()) {
                debouncedDisplayStates();
            }
        }

        // Ensure polling continues across hash changes on all pages
        startTradePolling();
    });

    // Performance: Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopTradePolling();
        batchedStorage.flush(); // Ensure all pending storage writes complete
    });
})();
