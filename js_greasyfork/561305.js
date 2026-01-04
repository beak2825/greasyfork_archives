// ==UserScript==
// @name         Trade Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calculates the total value of items in a trade on Torn.com.
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      weav3r.dev
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561305/Trade%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/561305/Trade%20Value%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chrome WebView compatibility: Set up GM_* API fallbacks BEFORE any usage
    if (typeof GM_addStyle === 'undefined') {
        window.GM_addStyle = function(css) {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        };
    }
    if (typeof GM_getValue === 'undefined') {
        window.GM_getValue = function(key, defaultValue) {
            try {
                const item = localStorage.getItem('GM_' + key);
                return item !== null ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        };
    }
    if (typeof GM_setValue === 'undefined') {
        window.GM_setValue = function(key, value) {
            try {
                if (value === undefined || value === null) {
                    localStorage.removeItem('GM_' + key);
                } else {
                    localStorage.setItem('GM_' + key, JSON.stringify(value));
                }
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    const keys = Object.keys(localStorage).filter(k => k.startsWith('GM_'));
                    if (keys.length > 0) localStorage.removeItem(keys[0]);
                    localStorage.setItem('GM_' + key, JSON.stringify(value));
                }
            }
        };
    }
    if (typeof GM_xmlhttpRequest === 'undefined') {
        window.GM_xmlhttpRequest = function(options) {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            let aborted = false;
            const fetchOptions = {
                method: options.method || 'GET',
                headers: options.headers || {}
            };
            if (controller) fetchOptions.signal = controller.signal;
            if (options.data && fetchOptions.method !== 'GET') {
                fetchOptions.body = options.data;
                if (!fetchOptions.headers['Content-Type']) {
                    fetchOptions.headers['Content-Type'] = 'application/json';
                }
            }
            fetch(options.url, fetchOptions).then(response => {
                if (aborted) return;
                return response.text().then(text => {
                    if (aborted) return;
                    const result = {
                        status: response.status,
                        statusText: response.statusText,
                        responseText: text,
                        response: text,
                        readyState: 4,
                        responseHeaders: Object.fromEntries(response.headers.entries())
                    };
                    if (response.ok) {
                        options.onload && options.onload(result);
                    } else {
                        options.onerror && options.onerror(result);
                    }
                });
            }).catch(error => {
                if (!aborted) {
                    options.onerror && options.onerror({
                        status: 0,
                        statusText: error.message,
                        responseText: '',
                        response: '',
                        readyState: 4
                    });
                }
            });
            if (options.timeout) {
                setTimeout(() => {
                    if (!aborted) {
                        aborted = true;
                        if (controller) controller.abort();
                        options.ontimeout && options.ontimeout({
                            status: 0,
                            statusText: 'Request timeout',
                            responseText: '',
                            response: '',
                            readyState: 4
                        });
                    }
                }, options.timeout);
            }
            return { abort: function() { aborted = true; if (controller) controller.abort(); } };
        };
    }

    const CONFIG = {
        API_BASE: 'https://weav3r.dev/api/',
        TORN_API: 'https://api.torn.com/',
        CACHE_DURATION: 3600000,
        MAX_CACHE_SIZE: 100,
        SEVEN_HOURS: 7 * 60 * 60 * 1000,
        POLL_INTERVAL: 30000,
        POLL_BUFFER: 29000
    };

    const TORN_API_ERRORS = {
        0: 'Unknown error',
        1: 'API key is empty',
        2: 'Incorrect API key',
        3: 'Wrong type',
        4: 'Wrong fields',
        5: 'Too many requests (max 100 per minute)',
        6: 'Incorrect ID',
        7: 'Incorrect ID-entity relation',
        8: 'IP blocked due to abuse',
        9: 'API system is currently disabled',
        10: 'Key owner is in federal jail',
        11: 'Key change error (once every 60 seconds)',
        12: 'Key read error',
        13: 'Key disabled due to owner inactivity',
        14: 'Daily read limit reached',
        15: 'Temporary error',
        16: 'Access level of this key is not high enough',
        17: 'Backend error, please try again',
        18: 'API key has been paused by the owner',
        19: 'Must be migrated to crimes 2.0',
        20: 'Race not yet finished',
        21: 'Incorrect category',
        22: 'This selection is only available in API v1',
        23: 'This selection is only available in API v2',
        24: 'Temporarily closed'
    };

    const handleTornApiError = (data) => {
        if (!data?.error) return null;
        const code = data.error.code;
        const message = TORN_API_ERRORS[code] || data.error.error || 'Unknown error';
        return { code, message };
    };

    const handleHttpError = (status) => {
        if (status >= 200 && status < 300) return null;
        if (status === 400) return 'Bad request';
        if (status === 401) return 'Unauthorized';
        if (status === 403) return 'Forbidden';
        if (status === 404) return 'Not found';
        if (status === 429) return 'Too many requests';
        if (status >= 500) return 'Server error';
        return `HTTP error ${status}`;
    };

    const TRADE_EVENTS = {
        INITIATED: 4401,
        CANCELLED: 4411,
        DECLINED: 4413,
        EXPIRED: 4420,
        COMPLETED: 4430,
        ACCEPTED: 4431,
        OTHER_MONEY_ADD: 4480,
        OTHER_MONEY_REMOVE: 4481,
        OTHER_ITEMS_ADD: 4482,
        OTHER_ITEMS_REMOVE: 4483,
        OTHER_PROPERTY_ADD: 4484,
        OTHER_PROPERTY_REMOVE: 4494,
        OTHER_FACTION_ADD: 4490,
        OTHER_FACTION_REMOVE: 4491,
        OTHER_COMPANY_ADD: 4492,
        OTHER_COMPANY_REMOVE: 4493
    };

    const TERMINAL_EVENTS = [TRADE_EVENTS.COMPLETED, TRADE_EVENTS.EXPIRED, TRADE_EVENTS.CANCELLED];

    const OTHER_ADD_EVENTS = [
        TRADE_EVENTS.OTHER_ITEMS_ADD, TRADE_EVENTS.OTHER_MONEY_ADD, TRADE_EVENTS.OTHER_PROPERTY_ADD,
        TRADE_EVENTS.OTHER_FACTION_ADD, TRADE_EVENTS.OTHER_COMPANY_ADD
    ];

    const OTHER_REMOVE_EVENTS = [
        TRADE_EVENTS.OTHER_ITEMS_REMOVE, TRADE_EVENTS.OTHER_MONEY_REMOVE, TRADE_EVENTS.OTHER_PROPERTY_REMOVE,
        TRADE_EVENTS.OTHER_FACTION_REMOVE, TRADE_EVENTS.OTHER_COMPANY_REMOVE
    ];

    const TRACKED_EVENTS = [...OTHER_ADD_EVENTS, ...OTHER_REMOVE_EVENTS, TRADE_EVENTS.ACCEPTED, TRADE_EVENTS.DECLINED];

    const TRADE_STATES = {
        empty: { text: 'Empty', color: '#6b7280' },
        'needs-money': { text: 'Items Received', color: '#f59e0b' },
        'too-low': { text: 'Too Low', color: '#ef4444' },
        'too-high': { text: 'Too High', color: '#ef4444' },
        ready: { text: 'Ready', color: '#10b981' },
        accepted: { text: 'Accepted', color: '#8b5cf6' },
        completed: { text: 'Completed', color: '#22c55e' },
        expired: { text: 'Expired', color: '#6b7280' },
        cancelled: { text: 'Cancelled', color: '#ef4444' },
        declined: { text: 'Declined', color: '#ef4444' },
        'items-received': { text: 'Items Received', color: '#f59e0b' },
        'items-removed': { text: 'Items Removed', color: '#f59e0b' },
        'money-received': { text: 'Money Received', color: '#10b981' },
        'money-removed': { text: 'Money Removed', color: '#f59e0b' },
        'property-received': { text: 'Property Received', color: '#8b5cf6' },
        'property-removed': { text: 'Property Removed', color: '#f59e0b' },
        'faction-received': { text: 'Faction Received', color: '#06b6d4' },
        'faction-removed': { text: 'Faction Removed', color: '#f59e0b' },
        'company-received': { text: 'Company Received', color: '#14b8a6' },
        'company-removed': { text: 'Company Removed', color: '#f59e0b' },
        'assets-added': { text: 'Assets Added', color: '#3b82f6' },
        'assets-removed': { text: 'Assets Removed', color: '#f59e0b' },
        unknown: { text: 'Unknown', color: '#6b7280' }
    };

    const EVENT_TO_STATE = {
        [TRADE_EVENTS.OTHER_ITEMS_ADD]: 'items-received',
        [TRADE_EVENTS.OTHER_ITEMS_REMOVE]: 'items-removed',
        [TRADE_EVENTS.OTHER_MONEY_ADD]: 'money-received',
        [TRADE_EVENTS.OTHER_MONEY_REMOVE]: 'money-removed',
        [TRADE_EVENTS.OTHER_PROPERTY_ADD]: 'property-received',
        [TRADE_EVENTS.OTHER_PROPERTY_REMOVE]: 'property-removed',
        [TRADE_EVENTS.OTHER_FACTION_ADD]: 'faction-received',
        [TRADE_EVENTS.OTHER_FACTION_REMOVE]: 'faction-removed',
        [TRADE_EVENTS.OTHER_COMPANY_ADD]: 'company-received',
        [TRADE_EVENTS.OTHER_COMPANY_REMOVE]: 'company-removed',
        [TRADE_EVENTS.ACCEPTED]: 'accepted',
        [TRADE_EVENTS.DECLINED]: 'declined'
    };

    const SELECTORS = {
        TRADE_LIST: '.trades-cont.current:not(.m-bottom10)',
        TRADE_LIST_ITEM: '.trades-cont.current:not(.m-bottom10) li',
        TRADE_LINK: '.view a[href*="ID="]',
        STRIPE_CONTAINER: '.stripe-container',
        TRADE_CONTAINER: '#trade-container',
        INFO_MSG_GREEN: '.info-msg-cont.green',
        ACCEPT_BTN: '.btn.accept.torn-btn.green',
        USER_LEFT_MONEY: '.user.left .cont li.color1 ul.desc li .name.left',
        USER_RIGHT_ITEMS: '.user.right .cont li.color2 ul.desc li',
        ADD_MONEY_LINK: '.user.left .cont li.color1 .add a[href*="step=addmoney"]'
    };

    const SVG_ICONS = {
        receipt: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        back: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13S14.22 4.41 6.42 4.41V1L0 6.7l6.42 5.9V8.75c4.24 0 7.37.38 9.58 4.25"/></svg>',
        dashboard: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
        calculate: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>',
        money: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>',
        add: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
        check: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        paste: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
    };

    const isTradePage = location.pathname.startsWith('/trade.php');
    const checkIsMobile = () => window.innerWidth <= 784;
    let isMobile = checkIsMobile();

    if (isTradePage) {
        GM_addStyle(`
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
.accept-trade-button.button-accepted {background:linear-gradient(145deg,#8b5cf6,#7c3aed)}
.accept-trade-button.button-error {background:linear-gradient(145deg,#dc2626,#b91c1c)}
.button-icon {display:none}
.button-text {display:inline}
.value-container {display:none;align-items:center;justify-content:space-evenly;flex-grow:1}
.value-container.visible {display:flex}
.hidden {display:none}
.content-hidden {display:none}
.content-visible {display:block}
.copy-confirmation {color:#6b6 !important;transition:color .3s;pointer-events:none}
.error-button {background-color:var(--error) !important;border-color:#c00 !important}
a {color:#e0e0e0;text-decoration:none;cursor:pointer;transition:color .3s}
a:hover {color:var(--text)}
.receipt-modal-overlay {position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;display:flex;justify-content:center;align-items:center;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s;backdrop-filter:blur(2px)}
.receipt-modal-overlay.visible {opacity:1;visibility:visible}
.receipt-modal {background:var(--bg-dark);border-radius:12px;width:90%;max-width:700px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,.7);border:1px solid var(--border);transform:translateY(20px);opacity:0;transition:transform .3s,opacity .3s}
.receipt-modal-overlay.visible .receipt-modal {transform:translateY(0);opacity:1}
.modal-header {background:var(--bg-darker);padding:12px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:flex-end;align-items:center;border-radius:12px 12px 0 0}
.close-modal {background:none;border:none;color:var(--text);font-size:24px;cursor:pointer;padding:0;opacity:.8;transition:opacity .2s;line-height:1}
.close-modal:hover {opacity:1}
.modal-content {padding:20px;background:var(--bg-dark);flex:1;overflow-y:auto;border-radius:0 0 12px 12px}
.receipt-content {height:100%;display:flex;flex-direction:column;gap:16px}
.loading-spinner {width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;margin:20px auto}
@keyframes spin {to {transform:rotate(360deg)}}
.items-table {width:100%;border-collapse:separate;border-spacing:0;margin:0;background:var(--bg-dark);font-size:14px;border:1px solid var(--border);border-radius:6px;overflow:hidden}
.items-table th {background:var(--bg-med);font:600 13px/1 'Segoe UI';text-transform:uppercase;letter-spacing:.5px;padding:14px 12px;color:var(--text);text-align:center;border-bottom:2px solid var(--border)}
.items-table td {background:var(--bg-darker);border-bottom:1px solid var(--border);padding:8px 12px !important;text-align:center;color:var(--text-muted);font-family:'Segoe UI',sans-serif;transition:background .2s;vertical-align:middle}
.items-table tbody tr:last-child td {border-bottom:none}
.items-table tbody tr:hover td {background:var(--bg-light)}
.price-editable {cursor:pointer;position:relative;padding-right:24px;transition:background .2s}
.price-editable:hover {background:rgba(59,130,246,0.1)}
.price-editable::after {content:'✎';position:absolute;right:8px;top:50%;transform:translateY(-50%);opacity:0;transition:opacity .2s;font-size:13px;color:#4a9eff}
.price-editable:hover::after {opacity:.8}
.price-edited {position:relative}
.price-edited::after {content:'*';color:#fbbf24;position:absolute;right:4px;top:2px;font-size:16px;font-weight:bold}
.save-changes-button {transition:var(--transition);position:relative;overflow:hidden;padding:10px 20px;background:linear-gradient(145deg,var(--bg-light),var(--bg-lighter));color:var(--text);border:1px solid var(--border);border-radius:6px;cursor:pointer;font:500 14px 'Segoe UI';width:auto;margin-top:12px;display:inline-block}
.save-changes-button:hover {background:linear-gradient(145deg,var(--bg-lighter),var(--bg-light))}
.save-changes-button.saving {background:#666;cursor:wait}
.save-changes-button.saving::after {content:'Saving...';position:absolute;inset:0;background:#666;display:flex;align-items:center;justify-content:center}
.save-changes-button.saved {background:linear-gradient(145deg,#10b981,#059669)}
.save-changes-button.error {background:var(--error);animation:shake .5s}
.save-changes-button.save-button-hidden {display:none}
.receipt-url-copy {margin-bottom:12px;padding:14px;background:var(--bg-darker);border-radius:6px;border:1px solid var(--border)}
.url-display {display:flex;align-items:center;justify-content:space-between;gap:12px}
.url-text {color:var(--text-muted);font:12px 'Courier New',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.items-table input[type="text"] {background:var(--bg-med);border:2px solid #4a9eff;color:var(--text);border-radius:4px;font:14px 'Segoe UI',sans-serif;width:100%;padding:8px;box-shadow:0 0 0 3px rgba(74,158,255,0.1);outline:none;text-align:center}
.items-table input[type="text"]:focus {border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2)}
.editable-input {width:100px;padding:6px;text-align:center;font-size:15px}
.copy-url-button,.view-edit-receipt-button {background:linear-gradient(145deg,var(--bg-light),var(--bg-lighter));border:1px solid var(--border);border-radius:6px;cursor:pointer;font-weight:600;transition:var(--transition)}
.copy-url-button:hover,.view-edit-receipt-button:hover {background:linear-gradient(145deg,var(--bg-lighter),var(--bg-light));transform:translateY(-1px)}
@media (max-width:784px) {.editable-input {width:80px;font-size:14px}}
.calculate-button.calculating {opacity:.7;cursor:not-allowed}
.calculate-button.error {animation:shake .5s;background-color:#f44}
@keyframes shake {0%,100% {transform:translateX(0)}25% {transform:translateX(-5px)}75% {transform:translateX(5px)}}
@keyframes flashNew {0%,100% {background:transparent}50% {background:rgba(59,130,246,0.1)}}
.flash-new {animation:flashNew 1s ease-in-out}
.flash-update {animation:flashNew 0.5s ease-in-out}
.fade-out {transition:opacity 0.3s,transform 0.3s;opacity:0;transform:translateX(-20px)}
.item-image {max-width:50px;max-height:50px;display:block;margin:0 auto}
.item-name-colored {transition:color 0.3s ease}
.mobile-input-font {font-size:16px}
.info-hidden {display:none}
.msg.right-round button.api-key-button,.title-black button.api-key-button {font-size:10px !important;padding:4px 8px !important;margin-left:8px !important;background:rgba(255,255,255,0.5) !important;border:1px solid rgba(0,0,0,0.15) !important;border-radius:3px !important;color:#555 !important;cursor:pointer !important;vertical-align:middle !important;display:inline-block !important}
body.dark-mode .msg.right-round button.api-key-button,body.dark-mode .title-black button.api-key-button {background:rgba(0,0,0,0.35) !important;border:1px solid rgba(255,255,255,0.1) !important;color:#999 !important}
@media only screen and (max-width:784px), only screen and (max-device-width:784px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:8px !important;padding:15px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:12px 20px !important;font-size:16px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-2 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-1 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.accept-trade-button {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:0 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container .button-icon {display:inline-block !important;width:18px !important;height:18px !important;vertical-align:middle !important}
.stripe-container .button-text {display:none !important}
.copy-url-button,.view-edit-receipt-button {width:auto;padding:10px 16px;touch-action:manipulation;font-size:13px}
.receipt-modal {width:95%;max-width:95%;margin:10px;max-height:90vh}
.modal-header {padding:14px 18px}
.modal-header h2 {font-size:1.1em}
.close-modal {font-size:20px;padding:3px 8px}
.modal-content {padding:16px}
.items-table {font-size:13px}
.items-table th {padding:10px 8px;font-size:13px}
.items-table td {padding:8px 8px !important;font-size:13px}
.url-display {flex-direction:row;gap:8px;flex-wrap:wrap}
.url-text {font-size:11px}
}
@media only screen and (max-width:480px), only screen and (max-device-width:480px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:6px !important;padding:12px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:14px !important;font-size:14px !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:-2 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:-1 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.accept-trade-button {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;order:0 !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container .button-icon {display:inline-block !important;width:16px !important;height:16px !important;vertical-align:middle !important}
.receipt-modal {width:100%;max-width:100%;margin:5px;max-height:95vh}
.modal-header {padding:12px 16px}
.modal-header h2 {font-size:1em}
.close-modal {font-size:18px;padding:2px 7px}
.modal-content {padding:14px}
.items-table {font-size:12px}
.items-table th {padding:9px 6px;font-size:12px}
.items-table td {padding:8px 6px !important;font-size:12px}
.save-changes-button {width:100%;margin:12px 0;touch-action:manipulation}
.copy-url-button,.view-edit-receipt-button {width:auto;padding:10px 14px;touch-action:manipulation;font-size:12px}
.url-display {flex-direction:row;gap:6px;flex-wrap:wrap}
.url-text {font-size:10px}
.editable-input {width:70px;font-size:13px;padding:5px}
}
.new-trade-toggle-header{cursor:pointer;position:relative}
.new-trade-toggle-header::after{content:'▼';font-size:11px;position:absolute;right:10px;top:50%;transform:translateY(-50%);opacity:.7;transition:transform .2s}
.new-trade-toggle-header.expanded::after{transform:translateY(-50%) rotate(-180deg)}
`);
    }

    if (isTradePage) {
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    const storage = {
        get: (keys) => Promise.resolve((Array.isArray(keys) ? keys : [keys]).reduce((acc, key) => {
            const val = GM_getValue(key);
            if (val !== undefined) acc[key] = val;
            return acc;
        }, {})),
        set: (items) => Promise.resolve(Object.entries(items).forEach(([k, v]) => GM_setValue(k, v)))
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const retry = async (fn, maxAttempts = 5, delay = 100) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const result = await fn();
                if (result !== false && result !== null && result !== undefined) {
                    return result;
                }
            } catch (error) {
                if (attempt === maxAttempts) throw error;
            }
            if (attempt < maxAttempts) await sleep(delay);
        }
        return null;
    };

    const debounce = (func, wait) => {
        const actualWait = isMobile ? wait * 1.5 : wait;
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), actualWait);
        };
    };

    const updateMobileStatus = () => {
        const wasMobile = isMobile;
        isMobile = checkIsMobile();
        if (wasMobile !== isMobile) console.log('Mobile status changed:', isMobile);
    };

    window.addEventListener('resize', debounce(updateMobileStatus, 250));

    const userProfileCache = new Map();
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
        flush: flushStorageBatch
    };

    const apiKey = {
        get: async () => (await storage.get(['torn_api_key'])).torn_api_key || null,
        set: (key) => storage.set({ torn_api_key: key }),
        remove: () => storage.set({ torn_api_key: undefined }),
        ensure: async () => {
            let key = await apiKey.get();
            if (!key) {
                key = prompt('Please enter your Torn API key for real-time trade updates:');
                if (key) await apiKey.set(key);
            }
            return key;
        }
    };

    const fetchUserProfile = async (userID) => {
        const cached = userProfileCache.get(userID);
        if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) return cached.data;

        const key = await apiKey.get();
        if (!key) return null;

        try {
            const response = await fetch(`${CONFIG.TORN_API}user/${userID}?key=${key}&comment=AutoTrade&selections=profile`);
            const httpError = handleHttpError(response.status);
            if (httpError) return null;

            const data = await response.json();
            const tornError = handleTornApiError(data);
            if (tornError) {
                if (tornError.code === 2) {
                    await storage.set({ torn_api_key: undefined });
                }
                return null;
            }

            if (userProfileCache.size >= CONFIG.MAX_CACHE_SIZE) {
                userProfileCache.delete(userProfileCache.keys().next().value);
            }
            userProfileCache.set(userID, { data, timestamp: Date.now() });
            return data;
        } catch {
            return null;
        }
    };

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

    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => document.querySelectorAll(sel);
    const getParam = (name) => new URLSearchParams(location.hash.substring(1)).get(name);
    const getTradeID = () => getParam('ID');
    const getStep = () => getParam('step');

    let lastProcessedEventID = null;
    let tradePollingInterval = null;
    let timeRefreshInterval = null;
    let isFirstPoll = true;
    let lastPollTime = 0;
    let apiTradeData = {};
    let currentReceipt = null;
    let currentReceiptURL = null;

    const initTradeData = () => ({
        items: [],
        moneyTotal: 0,
        hasItems: false,
        hasMoney: false,
        hasProperty: false,
        hasFaction: false,
        hasCompany: false,
        accepted: false,
        declined: false,
        lastEventType: null,
        lastEventState: null
    });

    const getUsername = () => q('.user.right .title-black')?.childNodes[0]?.nodeValue?.trim() || null;

    const getCurrentUserID = () => {
        try {
            const tornUserInput = q('#torn-user');
            if (tornUserInput?.value) {
                const userData = JSON.parse(tornUserInput.value);
                if (userData?.id) {
                    return userData.id;
                }
            }
        } catch (e) { console.error('Failed to get user ID:', e); }
        return null;
    };

    const getMoneyInTrade = () => {
        const match = q(SELECTORS.USER_LEFT_MONEY)?.textContent?.trim()?.match(/\$([0-9,]+)/);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    };

    const moneyMatches = () => currentReceipt?.total_value && getMoneyInTrade() === currentReceipt.total_value;

    const parseItems = () => {
        const items = [];
        qa(SELECTORS.USER_RIGHT_ITEMS).forEach(row => {
            const name = row.querySelector('.name.left')?.childNodes[0]?.nodeValue?.trim()?.match(/^(.+?)(?:\s+x(\d+))?$/);
            if (name) items.push({ name: name[1].trim(), quantity: parseInt(name[2] || 1, 10) });
        });
        return items;
    };

    const parseValidItems = () => parseItems().filter(i => i.name.toLowerCase() !== "no items in trade");

    const itemsMatch = (items1, items2) => {
        if (items1.length !== items2.length) return false;
        const sort = arr => [...arr].sort((a, b) => a.name.localeCompare(b.name));
        const [s1, s2] = [sort(items1), sort(items2)];
        return s1.every((item, i) => item.name === s2[i].name && item.quantity === s2[i].quantity);
    };

    const getStoredData = async (tradeID) => (await storage.get([`trade_${tradeID}`]))[`trade_${tradeID}`] || null;

    const storeData = async (tradeID, items, receipt, receiptURL) => {
        const existing = await getStoredData(tradeID);
        const manual_prices = existing?.manual_prices || {};
        return storage.set({
            [`trade_${tradeID}`]: { items, receipt, receiptURL, timestamp: Date.now(), total_value: receipt.total_value, manual_prices }
        });
    };

    const getTradeState = async (tradeID) => {
        const key = `trade_state_${tradeID}`;
        const data = (await storage.get([key]))[key];
        if (!data) return null;
        if (Date.now() - data.timestamp > CONFIG.SEVEN_HOURS) {
            await storage.set({ [key]: undefined });
            return null;
        }
        return data;
    };

    const setTradeState = async (tradeID, state, additionalData = {}) => {
        batchedStorage.set(`trade_state_${tradeID}`, { state, timestamp: Date.now(), ...additionalData });
    };

    const formatTimeAgo = (timestamp) => {
        const s = Math.floor((Date.now() - timestamp) / 1000);
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
    };

    const calculateTimeRemaining = (timestamp) => {
        const remaining = (timestamp * 1000 + 6 * 60 * 60 * 1000) - Date.now();
        if (remaining <= 0) return '0 mins';
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
    };

    const getReceiptIdFromURL = (receiptURL) => {
        if (!receiptURL) return null;
        try {
            const url = new URL(receiptURL);
            const pathParts = url.pathname.split('/');
            const receiptIndex = pathParts.indexOf('receipt');
            if (receiptIndex !== -1 && receiptIndex < pathParts.length - 1) {
                return pathParts[receiptIndex + 1];
            }
        } catch (e) { console.error('Failed to parse receipt URL:', e); }
        return null;
    };

    const apiCall = (endpoint, data) => new Promise((resolve) => {
        const defaultResponse = endpoint.startsWith('pricelist/') ? { receipt: null, receiptURL: null, error: null } : { success: false, error: null };
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${CONFIG.API_BASE}${endpoint}`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            onload: (r) => {
                const httpError = handleHttpError(r.status);
                if (httpError) {
                    resolve({ ...defaultResponse, error: httpError });
                    return;
                }
                try {
                    const parsed = JSON.parse(r.responseText);
                    if (parsed.error) {
                        resolve({ ...defaultResponse, error: parsed.error });
                        return;
                    }
                    resolve(parsed);
                } catch {
                    resolve({ ...defaultResponse, error: 'Invalid response' });
                }
            },
            onerror: () => resolve({ ...defaultResponse, error: 'Network error' }),
            ontimeout: () => resolve({ ...defaultResponse, error: 'Request timeout' })
        });
    });

    const showMsg = async (element, message, duration = 1000, className = 'copy-confirmation') => {
        const span = element.querySelector('.button-text');
        const orig = span ? span.textContent : (element.children.length ? element.innerHTML : element.textContent);
        const prop = element.children.length ? 'innerHTML' : 'textContent';

        span ? (span.textContent = message) : (element[prop] = message);
        element.classList.add(className);

        await sleep(duration);
        span ? (span.textContent = orig) : (element[prop] = orig);
        element.classList.remove(className);
    };

    const createButton = (classes, iconSvg, text, onClick) =>
        el('button', { classes, html: `${iconSvg}<span class="button-text">${text}</span>`, onClick });

    const setButtonState = (btn, { icon, text, disabled, enabled, background, onClick }) => {
        const iconEl = btn.querySelector('.button-icon');
        const textEl = btn.querySelector('.button-text');

        if (iconEl && icon) iconEl.outerHTML = icon;
        if (textEl && text) textEl.textContent = text;
        if (!iconEl || !textEl) btn.innerHTML = `${icon}<span class="button-text">${text}</span>`;

        btn.disabled = disabled;
        btn.classList.toggle('enabled', enabled);
        btn.classList.toggle('button-accepted', background && background.includes('8b5cf6'));
        btn.classList.toggle('button-error', background && background.includes('dc2626'));
        btn.style.background = background || '';

        removeHandler(btn);
        if (onClick) addHandler(btn, onClick, true);
    };

    const determineTradeState = () => {
        const items = parseValidItems();
        const hasItems = items.length > 0;
        const moneyInTrade = getMoneyInTrade();
        const expectedValue = currentReceipt?.total_value || 0;
        const acceptButtonExists = !!q(SELECTORS.ACCEPT_BTN);
        const tradeID = getTradeID();
        const tradeData = tradeID ? apiTradeData[tradeID] : null;
        const hasAnyAssets = hasItems || tradeData?.hasProperty || tradeData?.hasFaction || tradeData?.hasCompany;

        if (!hasAnyAssets) return 'empty';
        if (moneyInTrade === 0) return 'needs-money';
        if (expectedValue > 0 && moneyInTrade < expectedValue) return 'too-low';
        if (expectedValue > 0 && moneyInTrade > expectedValue) return 'too-high';
        if (moneyInTrade > 0 && !acceptButtonExists) return 'accepted';
        if (moneyInTrade === expectedValue && acceptButtonExists) return 'ready';
        return 'unknown';
    };

    const inferStateFromAPI = async (tradeID) => {
        const apiData = apiTradeData[tradeID];
        if (!apiData) return null;

        let inferredState = null;
        const hasAnyAssets = apiData.hasItems || apiData.hasProperty || apiData.hasFaction || apiData.hasCompany;

        if (apiData.declined && apiData.lastEventType === TRADE_EVENTS.DECLINED) {
            inferredState = 'declined';
        } else if (apiData.accepted) {
            inferredState = 'accepted';
        } else if (apiData.lastEventState && EVENT_TO_STATE[apiData.lastEventType]) {
            inferredState = EVENT_TO_STATE[apiData.lastEventType];
        } else if (!hasAnyAssets && !apiData.hasMoney) {
            inferredState = 'empty';
        } else if (hasAnyAssets && !apiData.hasMoney) {
            inferredState = 'needs-money';
        } else if (hasAnyAssets && apiData.hasMoney) {
            inferredState = 'ready';
        }

        if (inferredState) {
            const existingState = await getTradeState(tradeID);
            const stateChanged = !existingState || existingState.state !== inferredState;

            const additionalData = {
                totalValue: apiData.moneyTotal || 0,
                eventTimestamp: stateChanged ? apiData.lastEventTime : (existingState?.eventTimestamp || apiData.lastEventTime),
                lastEventType: apiData.lastEventType
            };

            if (apiData.accepted && apiData.acceptedAt) {
                additionalData.acceptedAt = stateChanged ? apiData.acceptedAt : (existingState?.acceptedAt || apiData.acceptedAt);
            }
            if (apiData.declined && apiData.declinedAt) {
                additionalData.declinedAt = stateChanged ? apiData.declinedAt : (existingState?.declinedAt || apiData.declinedAt);
            }

            await setTradeState(tradeID, inferredState, additionalData);
        }

        return inferredState;
    };

    const getStateDisplay = async (stateData, tradeID = null) => {
        if (!stateData && tradeID && apiTradeData[tradeID]) {
            const inferred = await inferStateFromAPI(tradeID);
            if (inferred) stateData = await getTradeState(tradeID);
        }

        if (!stateData) {
            if (tradeID && !apiTradeData[tradeID]) return null;
            return { text: 'Not opened', color: '#6b7280' };
        }

        const state = stateData.state;
        const baseDisplay = TRADE_STATES[state] || { text: 'Not opened', color: '#6b7280' };
        const timestampToUse = (state === 'accepted' && stateData.acceptedAt) ||
                               (state === 'declined' && stateData.declinedAt) ||
                               stateData.eventTimestamp || stateData.timestamp;
        const skipValueStates = ['empty', 'completed', 'expired', 'cancelled', 'declined'];

        let displayText = baseDisplay.text;
        if (timestampToUse) displayText += ` ${formatTimeAgo(timestampToUse)}`;
        if (stateData.totalValue && !skipValueStates.includes(state)) {
            displayText += ` ($${stateData.totalValue.toLocaleString()})`;
        }

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
            .filter(k => k.startsWith('trade_state_') && allKeys[k] && now - allKeys[k].timestamp > CONFIG.SEVEN_HOURS)
            .reduce((obj, k) => ({ ...obj, [k]: undefined }), {});

        if (Object.keys(toDelete).length) await storage.set(toDelete);
    };

    const displayTradeStates = async () => {
        if (!isTradePage || getStep()) return;

        ensureTradeListExists();
        const tradeListItems = qa(SELECTORS.TRADE_LIST_ITEM);
        if (!tradeListItems.length) return;

        await Promise.all(Array.from(tradeListItems).map(async (li) => {
            if (li.querySelector('.trade-status-indicator')) return;

            const viewLink = li.querySelector(SELECTORS.TRADE_LINK);
            const tradeID = viewLink?.href.match(/ID=(\d+)/)?.[1];
            if (!tradeID) return;

            const stateData = await getTradeState(tradeID);
            const display = await getStateDisplay(stateData, tradeID);
            if (!display) return;

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

            const descP = li.querySelector('.desc p');
            if (descP) descP.appendChild(statusSpan);
        }));
    };

    const debouncedDisplayStates = debounce(displayTradeStates, 100);

    const refreshTradeStatusTimes = async () => {
        if (!isTradePage || getStep()) return;

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

    const createTradeRow = async (tradeID, userID, description, timestamp) => {
        if (!isTradePage) return;
        
        const tradeList = q(SELECTORS.TRADE_LIST) || ensureTradeListExists();
        if (!tradeList) return;

        const profile = await fetchUserProfile(userID);
        const userName = profile?.name || `User [${userID}]`;
        const honor = profile?.honor || 0;
        const timeRemaining = calculateTimeRemaining(timestamp);
        const userNameChars = userName.split('').map(c => `<span data-char="${c}"></span>`).join('');
        const honorImageBase = `/images/honors/${honor}/`;

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

        const lastLi = tradeList.querySelector('li.last');
        if (lastLi) lastLi.classList.remove('last');

        tradeList.appendChild(li);
        li.classList.add('last');
        debouncedDisplayStates();

        li.classList.add('flash-new');
    };

    const updateTradeStatusBadge = async (tradeID) => {
        if (!isTradePage) return;
        
        const allTrades = qa(SELECTORS.TRADE_LIST_ITEM);
        for (const li of allTrades) {
            const link = li.querySelector(SELECTORS.TRADE_LINK);
            if (link && link.href.includes(`ID=${tradeID}`)) {
                const statusIndicator = li.querySelector('.trade-status-indicator');
                if (statusIndicator) {
                    statusIndicator.remove();
                    debouncedDisplayStates();
                }
                li.classList.add('flash-update');
                break;
            }
        }
    };

    const removeTradeFromList = (tradeID) => {
        if (!isTradePage) return;
        
        for (const li of qa(SELECTORS.TRADE_LIST_ITEM)) {
            const link = li.querySelector(SELECTORS.TRADE_LINK);
            if (link?.href.match(/ID=(\d+)/)?.[1] === String(tradeID)) {
                li.classList.add('fade-out');
                sleep(300).then(() => li.remove());
                return;
            }
        }
    };

    const processActivityLog = async (eventsData) => {
        if (!eventsData || typeof eventsData !== 'object') return;

        const step = getStep();
        const isMainTradePage = isTradePage && !step;
        const tradeList = isMainTradePage ? (q(SELECTORS.TRADE_LIST) || ensureTradeListExists()) : null;

        const events = Object.entries(eventsData)
            .map(([id, event]) => ({ ...event, ID: id }))
            .sort((a, b) => b.timestamp - a.timestamp);

        const tradeStatuses = {};
        const tradesToCreate = [];

        for (const event of events) {
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;
            if (event.category !== 'Trades') continue;

            const tradeIDMatch = event.data?.trade_id?.match(/ID=(\d+)/);
            if (!tradeIDMatch) continue;

            const tradeID = tradeIDMatch[1];
            const eventLog = Number(event.log);

            if (!tradeStatuses[tradeID]) tradeStatuses[tradeID] = eventLog;

            if (eventLog === TRADE_EVENTS.INITIATED) {
                tradesToCreate.push({
                    tradeID,
                    userID: event.data?.user,
                    description: event.data?.description || 'Trade',
                    timestamp: event.timestamp,
                    eventID: event.ID
                });
            }
        }

        const validTrades = tradesToCreate
            .filter(trade => !TERMINAL_EVENTS.includes(tradeStatuses[trade.tradeID]))
            .sort((a, b) => a.timestamp - b.timestamp);

        for (const trade of validTrades) {
            if (!apiTradeData[trade.tradeID]) {
                apiTradeData[trade.tradeID] = initTradeData();
            }
            apiTradeData[trade.tradeID].userID = trade.userID;
            apiTradeData[trade.tradeID].lastEventTime = trade.timestamp * 1000;
        }

        if (tradeList) {
            for (const trade of validTrades) {
                const allTrades = Array.from(qa(SELECTORS.TRADE_LIST_ITEM));
                const existingTrade = allTrades.find(li => {
                    const link = li.querySelector(SELECTORS.TRADE_LINK);
                    return link && link.href.includes(`ID=${trade.tradeID}`);
                });
                if (!existingTrade) await createTradeRow(trade.tradeID, trade.userID, trade.description, trade.timestamp);
            }
        }

        for (const event of events) {
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;
            if (event.category !== 'Trades') continue;

            const tradeIDMatch = event.data?.trade_id?.match(/ID=(\d+)/);
            if (!tradeIDMatch) continue;

            const tradeID = tradeIDMatch[1];

            if (!apiTradeData[tradeID]) {
                apiTradeData[tradeID] = initTradeData();
            }

            const data = apiTradeData[tradeID];

            const eventLog = Number(event.log);

            if (TERMINAL_EVENTS.includes(eventLog)) {
                if (isMainTradePage) removeTradeFromList(tradeID);
                delete apiTradeData[tradeID];
                batchedStorage.set(`trade_state_${tradeID}`, undefined);
                continue;
            }

            const isTrackedEvent = TRACKED_EVENTS.includes(eventLog);
            if (isTrackedEvent) {
                data.lastEventTime = event.timestamp * 1000;
                data.lastEventType = eventLog;
                data.lastEventState = EVENT_TO_STATE[eventLog] || null;
            }

            if (eventLog === TRADE_EVENTS.ACCEPTED) {
                data.accepted = true;
                data.acceptedAt = event.timestamp * 1000;
            }

            if (eventLog === TRADE_EVENTS.DECLINED) {
                data.declined = true;
                data.declinedAt = event.timestamp * 1000;
            }

            if ([TRADE_EVENTS.OTHER_ITEMS_ADD].includes(eventLog)) {
                if (event.data?.items) data.items = event.data.items;
                data.hasItems = true;
            } else if (eventLog === TRADE_EVENTS.OTHER_ITEMS_REMOVE) {
                data.hasItems = false;
            }

            if ([TRADE_EVENTS.OTHER_MONEY_ADD].includes(eventLog)) {
                data.moneyTotal = event.data?.total || event.data?.money || 0;
                data.hasMoney = data.moneyTotal > 0;
            } else if (eventLog === TRADE_EVENTS.OTHER_MONEY_REMOVE) {
                data.moneyTotal = event.data?.total || 0;
                data.hasMoney = data.moneyTotal > 0;
            }

            if ([TRADE_EVENTS.OTHER_PROPERTY_ADD].includes(eventLog)) {
                data.hasProperty = true;
            } else if (eventLog === TRADE_EVENTS.OTHER_PROPERTY_REMOVE) {
                data.hasProperty = false;
            }

            if ([TRADE_EVENTS.OTHER_FACTION_ADD].includes(eventLog)) {
                data.hasFaction = true;
            } else if (eventLog === TRADE_EVENTS.OTHER_FACTION_REMOVE) {
                data.hasFaction = false;
            }

            if ([TRADE_EVENTS.OTHER_COMPANY_ADD].includes(eventLog)) {
                data.hasCompany = true;
            } else if (eventLog === TRADE_EVENTS.OTHER_COMPANY_REMOVE) {
                data.hasCompany = false;
            }

            if (isTrackedEvent) {
                await inferStateFromAPI(tradeID);
                if (isMainTradePage) updateTradeStatusBadge(tradeID);
            }
        }

        await Promise.all(Object.keys(apiTradeData).map(async (tradeID) => {
            const existingState = await getTradeState(tradeID);
            if (!existingState || (apiTradeData[tradeID].lastEventTime && existingState.eventTimestamp !== apiTradeData[tradeID].lastEventTime)) {
                await inferStateFromAPI(tradeID);
            }
        }));

        if (events.length > 0) lastProcessedEventID = events[0].ID;
        if (isFirstPoll) isFirstPoll = false;
    };

    const pollTradeEvents = async () => {
        const now = Date.now();
        if (now - lastPollTime < CONFIG.POLL_BUFFER) return;
        lastPollTime = now;

        const key = await apiKey.get();
        if (!key) return;

        const fiveMinutesAgo = Math.floor((Date.now() - 300000) / 1000);

        try {
            const response = await fetch(`${CONFIG.TORN_API}user/?key=${key}&cat=94&from=${fiveMinutesAgo}&selections=log`);
            const httpError = handleHttpError(response.status);
            if (httpError) return;

            const data = await response.json();
            const tornError = handleTornApiError(data);
            if (tornError) {
                if ([1, 2, 10, 13, 18].includes(tornError.code)) {
                    await storage.set({ torn_api_key: undefined });
                    stopTradePolling();
                }
                return;
            }

            if (data?.log && typeof data.log === 'object') {
                await processActivityLog(data.log);
                if (isTradePage && !getStep()) {
                    await sleep(100);
                    debouncedDisplayStates();
                }
            }
        } catch {
            return;
        }
    };

    const startTradePolling = async () => {
        if (tradePollingInterval) return;

        const key = await apiKey.get();
        if (!key) return;

        isFirstPoll = true;
        await pollTradeEvents();
        tradePollingInterval = setInterval(pollTradeEvents, CONFIG.POLL_INTERVAL);

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

    const colorCodeItemsByValue = () => {
        if (!isTradePage || !currentReceipt?.items?.length) return;

        const items = currentReceipt.items;
        const validItems = items.filter(i => i.totalValue && i.totalValue > 0);
        const values = validItems.map(i => i.totalValue);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);

        const colorStops = [
            { pos: 0, r: 127, g: 29, b: 29 },
            { pos: 0.15, r: 239, g: 68, b: 68 },
            { pos: 0.35, r: 251, g: 146, b: 60 },
            { pos: 0.5, r: 251, g: 191, b: 36 },
            { pos: 0.7, r: 163, g: 230, b: 53 },
            { pos: 0.85, r: 101, g: 217, b: 101 },
            { pos: 1, r: 74, g: 222, b: 128 }
        ];

        const getColor = (value, hasPrice) => {
            if (!hasPrice || !value) return '#7f1d1d';
            if (validItems.length === 0) return '#7f1d1d';

            let normalizedValue = maxValue > minValue ? (value - minValue) / (maxValue - minValue) : (value === maxValue ? 1 : 0);
            normalizedValue = Math.max(0, Math.min(1, normalizedValue));

            let color1, color2;
            for (let i = 0; i < colorStops.length - 1; i++) {
                if (normalizedValue <= colorStops[i + 1].pos) {
                    color1 = colorStops[i];
                    color2 = colorStops[i + 1];
                    break;
                }
            }

            if (color1 && color2) {
                const ratio = (normalizedValue - color1.pos) / (color2.pos - color1.pos);
                const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
                const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
                const b = Math.round(color1.b + (color2.b - color1.b) * ratio);
                return `rgb(${r}, ${g}, ${b})`;
            }
            return '#7f1d1d';
        };

        qa(SELECTORS.USER_RIGHT_ITEMS).forEach(element => {
            const nameElement = element.querySelector('.name.left');
            if (!nameElement) return;

            const textNode = nameElement.childNodes[0]?.nodeValue?.trim();
            if (!textNode) return;
            const match = textNode.match(/^(.+?)(?:\s+x\d+)?$/);
            const itemName = match ? match[1].trim() : textNode;
            if (!itemName) return;

            const receiptItem = items.find(i => i.name === itemName);
            if (!receiptItem) return;

            const hasPrice = receiptItem.priceUsed !== undefined && receiptItem.priceUsed !== null && receiptItem.priceUsed !== 0 && !isNaN(receiptItem.priceUsed);
            nameElement.classList.add('item-name-colored');
            nameElement.style.color = getColor(receiptItem.totalValue, hasPrice);
        });
    };

    const updateAcceptBtn = (btn) => {
        if (!isTradePage) return;
        if (!btn) btn = q('.accept-trade-button');
        if (!btn) return;

        const moneyInTrade = getMoneyInTrade();
        const acceptButtonExists = !!q(SELECTORS.ACCEPT_BTN);
        const expectedValue = currentReceipt?.total_value || 0;
        const hasItems = currentReceipt?.items?.length > 0;
        const goToAddMoney = () => q(SELECTORS.ADD_MONEY_LINK)?.click();

        let newState;
        if (!hasItems) {
            newState = { icon: SVG_ICONS.add, text: 'No Items', disabled: true, enabled: false };
        } else if (!moneyInTrade) {
            newState = { icon: SVG_ICONS.add, text: 'Add Money', disabled: false, enabled: false, onClick: goToAddMoney };
        } else if (moneyInTrade > 0 && !acceptButtonExists) {
            newState = {
                icon: SVG_ICONS.check,
                text: 'Accepted',
                disabled: true,
                enabled: false,
                background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)'
            };
        } else if (expectedValue > 0 && moneyInTrade !== expectedValue) {
            newState = {
                icon: SVG_ICONS.add,
                text: moneyInTrade < expectedValue ? 'Too Low' : 'Too High',
                disabled: false,
                enabled: false,
                background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                onClick: goToAddMoney
            };
        } else {
            const matches = moneyMatches();
            newState = {
                icon: SVG_ICONS.check,
                text: 'Accept Trade',
                disabled: !matches,
                enabled: matches,
                onClick: async () => {
                    if (!moneyMatches()) return;
                    const acceptBtn = q(SELECTORS.ACCEPT_BTN);
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
            };
        }

        const currentText = btn.querySelector('.button-text')?.textContent;
        const currentDisabled = btn.disabled;
        const currentEnabled = btn.classList.contains('enabled');
        const currentBackground = btn.style.background;

        if (currentText !== newState.text || 
            currentDisabled !== newState.disabled || 
            currentEnabled !== newState.enabled ||
            currentBackground !== (newState.background || '')) {
            setButtonState(btn, newState);
        }
    };

    const updateUI = () => {
        if (!isTradePage) return;
        
        const total = q('.total-value-container');
        const receipt = q('.receipt-url-container');
        const container = q('.value-container');
        const stripe = q('.stripe-container');

        if (total && currentReceipt?.total_value !== undefined) {
            total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;

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

            if (!window.acceptBtnUpdateInterval) {
                window.acceptBtnUpdateInterval = setInterval(() => {
                    if (q('.accept-trade-button')) {
                        updateAcceptBtn();
                        updateTradeState();
                    }
                }, isMobile ? 750 : 500);
            }

            updateTradeState();
        }
    };

    const autoCalc = async () => {
        if (!isTradePage) return;
        
        const tradeID = getTradeID();
        if (!tradeID) return;

        const items = parseValidItems();

        if (!items.length) {
            currentReceipt = { items: [], total_value: 0 };
            currentReceiptURL = null;
            updateUI();
            return;
        }

        const totalEl = q('.total-value-container');
        if (totalEl && !currentReceipt) {
            totalEl.textContent = 'Calculating...';
            totalEl.classList.remove('hidden');
            q('.value-container')?.classList.add('visible');
        }

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
            requestAnimationFrame(() => colorCodeItemsByValue());
            return;
        }

        const username = getUsername();
        const userID = getCurrentUserID();
        if (!userID) {
            console.error('Could not get current user ID');
            return;
        }

        const res = await apiCall(`pricelist/${userID}`, { items, username, tradeID });

        if (res?.error) {
            const totalEl = q('.total-value-container');
            if (totalEl) {
                totalEl.textContent = `Error: ${res.error}`;
                totalEl.classList.add('error-button');
                sleep(3000).then(() => totalEl.classList.remove('error-button'));
            }
            return;
        }

        if (res?.receipt?.total_value !== undefined && res.receiptURL) {
            currentReceipt = res.receipt;
            currentReceiptURL = res.receiptURL;
            storeData(tradeID, items, res.receipt, res.receiptURL);
            updateUI();
            requestAnimationFrame(() => colorCodeItemsByValue());
        }
    };

    const createTable = (items = []) => {
        const tbody = el('tbody');
        items.forEach(item => {
            const itemId = item.id || item.itemId || '';
            const imageUrl = itemId ? `https://www.torn.com/images/items/${itemId}/medium.png` : '';
            const row = el('tr', {
                html: `<td><img src="${imageUrl}" alt="Item" class="item-image"/></td><td>${item.name}</td><td>${item.quantity}</td><td>$${(item.priceUsed || 0).toLocaleString()}</td><td>$${(item.totalValue || 0).toLocaleString()}</td>`
            });
            row.dataset.itemId = itemId;
            tbody.appendChild(row);
        });
        return el('table', {
            classes: 'items-table',
            children: [
                el('thead', { html: '<tr><th>Image</th><th>Name</th><th>Quantity</th><th>Price</th><th>Total</th></tr>' }),
                tbody
            ]
        });
    };

    const createModal = () => {
        const closeModal = () => overlay.classList.remove('visible');
        const overlay = el('div', { classes: 'receipt-modal-overlay', onClick: (e) => e.target === overlay && closeModal() });
        const modal = el('div', {
            classes: 'receipt-modal',
            children: [
                el('div', {
                    classes: 'modal-header',
                    children: [
                        el('button', { classes: 'close-modal', html: '&times;', onClick: closeModal })
                    ]
                }),
                el('div', {
                    classes: 'modal-content',
                    children: [el('div', { classes: 'receipt-content', children: [el('div', { classes: 'loading-spinner', text: 'Loading...' })] })]
                })
            ]
        });
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        return overlay;
    };

    const makeEditable = (table, saveBtn) => {
        table.querySelectorAll('tbody tr td:nth-child(4)').forEach(cell => {
            cell.classList.add('price-editable');
            addHandler(cell, () => {
                if (cell.querySelector('input')) return;
                
                const price = cell.textContent.replace(/[^0-9.]/g, '');
                const formattedPrice = parseFloat(price).toLocaleString();
                const input = Object.assign(document.createElement('input'), { 
                    type: 'text', 
                    value: formattedPrice, 
                    className: 'editable-input'
                });
                cell.textContent = '';
                cell.appendChild(input);
                input.focus();
                
                input.select();

                const formatInput = () => {
                    const rawValue = input.value.replace(/[^0-9.]/g, '');
                    const numValue = parseFloat(rawValue);
                    if (!isNaN(numValue)) {
                        const cursorPos = input.selectionStart;
                        const oldLength = input.value.length;
                        input.value = numValue.toLocaleString();
                        const newLength = input.value.length;
                        const diff = newLength - oldLength;
                        input.setSelectionRange(cursorPos + diff, cursorPos + diff);
                    }
                };

                input.addEventListener('input', (e) => {
                    input.value = input.value.replace(/[^0-9.,]/g, '');
                });

                const done = () => {
                    const rawValue = input.value.replace(/[^0-9.]/g, '');
                    const newPrice = parseFloat(rawValue);
                    cell.textContent = isNaN(newPrice) ? `$${parseFloat(price).toLocaleString()}` : `$${newPrice.toLocaleString()}`;
                    if (!isNaN(newPrice)) {
                        cell.classList.add('price-edited');
                        updateTotals(table);
                        saveBtn.classList.remove('save-button-hidden');
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

        const updatedItems = [];
        const manualPrices = {};

        table.querySelectorAll('tbody tr').forEach(row => {
            const name = row.cells[1].textContent;
            const priceUsed = parseFloat(row.cells[3].textContent.replace(/[^0-9.]/g, '')) || 0;
            const wasEdited = row.cells[3].classList.contains('price-edited');
            const itemId = parseInt(row.dataset.itemId);

            if (wasEdited && itemId && !isNaN(itemId)) {
                manualPrices[name] = priceUsed;
                updatedItems.push({ itemId, price: priceUsed });
            }
        });

        const receiptId = getReceiptIdFromURL(currentReceiptURL);
        if (!receiptId) {
            saveBtn.classList.remove('saving');
            saveBtn.disabled = false;
            saveBtn.classList.add('error');
            sleep(2000).then(() => saveBtn.classList.remove('error'));
            return;
        }

        if (updatedItems.length === 0) {
            saveBtn.classList.remove('saving');
            saveBtn.disabled = false;
            return;
        }

        const res = await apiCall(`updateReceipt/${receiptId}`, { items: updatedItems });

        saveBtn.classList.remove('saving');
        saveBtn.disabled = false;

        if (res?.error || res?.success === false) {
            saveBtn.classList.add('error');
            saveBtn.textContent = res?.error || 'Save failed';
            sleep(2000).then(() => {
                saveBtn.classList.remove('error');
                saveBtn.textContent = 'Save Changes';
            });
        } else {
            const tradeID = getTradeID();

            if (currentReceipt?.items) {
                const priceMap = new Map(updatedItems.map(item => [item.itemId, item.price]));

                currentReceipt.items = currentReceipt.items.map(item => {
                    const itemId = item.id || item.itemId;
                    if (priceMap.has(itemId)) {
                        const newPrice = priceMap.get(itemId);
                        return { ...item, priceUsed: newPrice, totalValue: newPrice * (item.quantity || 1) };
                    }
                    return item;
                });

                currentReceipt.total_value = currentReceipt.items.reduce((sum, item) => sum + (item.totalValue || 0), 0);
            }

            if (tradeID) {
                const items = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
                    name: row.cells[1].textContent,
                    quantity: parseInt(row.cells[2].textContent)
                }));

                const existing = await getStoredData(tradeID) || {};
                existing.items = items;
                existing.receipt = currentReceipt;
                existing.receiptURL = existing.receiptURL || currentReceiptURL;
                existing.total_value = currentReceipt?.total_value || 0;
                existing.timestamp = Date.now();
                existing.manual_prices = { ...existing.manual_prices, ...manualPrices };

                await storage.set({ [`trade_${tradeID}`]: existing });
            }

            const tbody = table.querySelector('tbody');
            if (tbody && currentReceipt?.items) {
                tbody.innerHTML = '';
                currentReceipt.items.forEach(item => {
                    const isEdited = manualPrices.hasOwnProperty(item.name);
                    const itemId = item.id || item.itemId || '';
                    const imageUrl = itemId ? `https://www.torn.com/images/items/${itemId}/medium.png` : '';

                    const row = el('tr', {
                        children: [
                            el('td', { children: [el('img', { attributes: { src: imageUrl, alt: 'Item' }, classes: 'item-image' })] }),
                            el('td', { text: item.name }),
                            el('td', { text: item.quantity.toString() }),
                            el('td', { text: `$${(item.priceUsed || 0).toLocaleString()}`, classes: isEdited ? ['price-edited'] : [] }),
                            el('td', { text: `$${(item.totalValue || 0).toLocaleString()}` })
                        ]
                    });
                    row.dataset.itemId = itemId;
                    tbody.appendChild(row);
                });
                makeEditable(table, saveBtn);
            }

            const total = q('.total-value-container');
            if (total) total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
            updateAcceptBtn();

            saveBtn.classList.add('saved');
            sleep(2000).then(() => {
                saveBtn.classList.add('save-button-hidden');
                saveBtn.classList.remove('saved');
            });
        }
    };

    const showModal = async () => {
        if (!isTradePage || !currentReceipt || !currentReceiptURL) return;

        let modal = q('.receipt-modal-overlay') || createModal();
        const content = modal.querySelector('.receipt-content');
        content.innerHTML = '<div class="loading-spinner">Loading...</div>';
        modal.classList.add('visible');

        await sleep(200);
        content.innerHTML = '';

            const copyBtn = el('button', {
                classes: 'copy-url-button',
                text: 'Copy URL',
                onClick: () => navigator.clipboard.writeText(currentReceiptURL).then(() => showMsg(copyBtn, 'Copied!', 2000))
            });

            content.appendChild(el('div', {
                classes: 'receipt-url-copy',
                children: [el('div', { classes: 'url-display', children: [el('span', { classes: 'url-text', text: currentReceiptURL }), copyBtn] })]
            }));

            const table = createTable(currentReceipt.items);
            content.appendChild(table);

            const saveBtn = el('button', {
                classes: ['save-changes-button', 'save-button-hidden'],
                text: 'Save Changes',
                onClick: () => saveChanges(table, saveBtn)
            });
            content.appendChild(saveBtn);

            makeEditable(table, saveBtn);
            updateTotals(table);
    };

    const ensureTradeListExists = () => {
        if (!isTradePage || getStep()) return null;

        let tradeList = q(SELECTORS.TRADE_LIST);
        if (tradeList) return tradeList;

        const noTradesMsg = Array.from(qa('.info-msg-cont')).find(el => {
            const msg = el.querySelector('.msg.right-round');
            return msg && msg.textContent.trim() === 'You have no current trades.';
        });

        if (!noTradesMsg) return null;

        tradeList = el('ul', {
            classes: ['trades-cont', 'current', 'cont-gray', 'bottom-round']
        });

        noTradesMsg.parentNode.insertBefore(tradeList, noTradesMsg.nextSibling);
        return tradeList;
    };

    const initApiKeyButton = async (retryCount = 0) => {
        if (!isTradePage || getStep()) return;
        if (retryCount > 20) return; // Stop retrying after 2 seconds

        const currentTradeHeading = Array.from(qa('.title-black.top-round.m-top10')).find(el => 
            el.textContent.trim() === 'Current Trade'
        );

        const noTradesMsg = Array.from(qa('.info-msg-cont')).find(el => {
            const msg = el.querySelector('.msg.right-round');
            return msg && msg.textContent.trim() === 'You have no current trades.';
        })?.querySelector('.msg.right-round');

        // Try alternative selectors if the primary ones don't work
        const altHeading = q('.title-black.top-round') || q('.title-black.m-top10');
        const altMsg = Array.from(qa('.info-msg-cont')).find(el => {
            const msg = el.querySelector('.msg');
            return msg && msg.textContent.trim().includes('no current trades');
        })?.querySelector('.msg');
        
        const container = currentTradeHeading || noTradesMsg || altHeading || altMsg;
        if (!container) {
            sleep(100).then(() => initApiKeyButton(retryCount + 1));
            return;
        }
        if (container.querySelector('.api-key-button')) return;

        const updateButton = async () => {
            const existingBtn = container.querySelector('.api-key-button');
            if (existingBtn) existingBtn.remove();

            const hasKey = !!(await apiKey.get());
            
            const button = el('button', {
                classes: 'api-key-button',
                text: hasKey ? 'Remove key' : 'Set API key',
                onClick: async () => {
                    if (hasKey) {
                        await apiKey.remove();
                        stopTradePolling();
                        updateButton();
                    } else {
                        const key = prompt('Please enter your FULL access API key');
                        if (key) {
                            await apiKey.set(key);
                            updateButton();
                            startTradePolling();
                        }
                    }
                }
            });

            container.appendChild(button);
        };

        await updateButton();
    };

    const debouncedInitApiKeyButton = debounce(initApiKeyButton, 100);

    const initNewTradeCollapsible = (root = document) => {
        if (!isTradePage || getStep()) return;

        root.querySelectorAll('.init-trade.m-top10').forEach(container => {
            if (container.dataset.newTradeCollapsedInit === '1') return;

            const heading = container.querySelector('.title-black.top-round[role="heading"]');
            const content = container.querySelector('.cont-gray.bottom-round');
            if (!heading || !content) return;

            container.dataset.newTradeCollapsedInit = '1';
            content.style.display = 'none';
            heading.classList.add('new-trade-toggle-header');

            addHandler(heading, () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                heading.classList.toggle('expanded', isHidden);
            }, true);
        });
    };

    const initStripe = () => {
        if (!isTradePage) return;
        
        const isAcceptPage = getStep() === 'accept2';
        let tc = q('.trade-cont.m-top10');
        const isAddMoneyPage = !!q('.init-trade.add-money.m-top10');

        if (isAcceptPage) {
            const confirmMsg = q('.info-msg-cont.green');
            if (confirmMsg && !q('.stripe-container')) {
                const total = el('div', {
                    classes: ['total-value-container'],
                    text: 'Total Value: $0',
                    onClick: () => currentReceipt?.total_value && (navigator.clipboard.writeText(currentReceipt.total_value.toString()), showMsg(total, 'Copied!', 1000))
                });

                const receipt = el('div', {
                    classes: ['receipt-url-container'],
                    html: `${SVG_ICONS.receipt}<span class="button-text">View/Edit Receipt</span>`,
                    onClick: showModal
                });

                const container = el('div', { classes: ['value-container'], children: [total, receipt] });
                const tradeID = getTradeID();

                const backToTradeBtn = createButton(['calculate-button'], SVG_ICONS.back, 'Back to Trade',
                    () => tradeID && (window.location.hash = `#step=view&ID=${tradeID}`)
                );

                const dashboardBtn = createButton(['accept-trade-button', 'enabled'], SVG_ICONS.dashboard, 'Dashboard',
                    () => window.location.hash = '#'
                );

                const stripe = el('div', { classes: ['stripe-container', 'expanded'], children: [backToTradeBtn, container, dashboardBtn] });
                confirmMsg.parentNode.insertBefore(stripe, confirmMsg.nextSibling);

                (async () => {
                    if (tradeID) {
                        const stored = await getStoredData(tradeID);
                        if (stored?.receipt) {
                            currentReceipt = stored.receipt;
                            currentReceiptURL = stored.receiptURL;
                            total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;

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
            return;
        }

        if (!tc && isAddMoneyPage) tc = q('.init-trade.add-money.m-top10');

        if (isAddMoneyPage && !q('.info-msg-cont')) {
            (async () => {
                let messageText = 'Add money to complete your side of the trade';
                const tradeID = getTradeID();
                if (tradeID) {
                    const stored = await getStoredData(tradeID);
                    if (stored?.total_value) {
                        messageText = `Add $${stored.total_value.toLocaleString()} to complete your side of the trade`;
                    }
                }

                const spacerMsg = el('div', {
                    classes: ['info-msg-cont', 'border-round', 'm-top10', 'r3210'],
                    html: `<div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round" role="alert" aria-live="polite">${messageText}</div></div></div>`
                });

                const existingStripe = q('.stripe-container');
                if (existingStripe) {
                    existingStripe.parentNode.insertBefore(spacerMsg, existingStripe);
                } else if (tc) {
                    tc.parentNode.insertBefore(spacerMsg, tc);
                }
            })();
        }

        if (!tc || q('.stripe-container')) return;

        const total = el('div', {
            classes: ['hidden', 'total-value-container'],
            text: 'Total Value: $0',
            onClick: () => currentReceipt?.total_value && (navigator.clipboard.writeText(currentReceipt.total_value.toString()), showMsg(total, 'Copied!', 1000))
        });

        const receipt = el('div', {
            classes: ['hidden', 'receipt-url-container'],
            html: `${SVG_ICONS.receipt}<span class="button-text">View/Edit Receipt</span>`,
            onClick: showModal
        });

        const container = el('div', { classes: ['value-container'], children: [total, receipt] });
        let children = [];

        if (isAddMoneyPage) {
            const pasteBtn = createButton(['calculate-button'], SVG_ICONS.paste, 'Paste', async () => {
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
            const accept = createButton(['accept-trade-button'], SVG_ICONS.check, 'Accept Trade',
                () => moneyMatches() && q(SELECTORS.ACCEPT_BTN)?.click()
            );
            accept.disabled = true;

            const calculateHandler = async () => {
                btn.classList.add('calculating');
                btn.disabled = true;

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

                if (res?.error) {
                    showMsg(btn, res.error, 3000, 'error-button');
                    total.textContent = `Error: ${res.error}`;
                    return;
                }

                if (res?.receipt?.total_value !== undefined && res.receiptURL) {
                    currentReceipt = res.receipt;
                    currentReceiptURL = res.receiptURL;
                    total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
                    [total, receipt].forEach(e => e.classList.remove('hidden'));
                    container.classList.add('visible');
                    stripe.classList.add('expanded');
                    updateAcceptBtn(accept);
                    requestAnimationFrame(() => colorCodeItemsByValue());
                    storeData(tradeID, items, res.receipt, res.receiptURL);
                }
            };

            const btn = createButton(['calculate-button'], SVG_ICONS.calculate, 'Calculate Trade', calculateHandler);
            children = [btn, container, accept];
        }

        const stripe = el('div', { classes: ['stripe-container'], children });
        tc.parentNode.insertBefore(stripe, tc);
    };

    const autoFill = async () => {
        if (!isTradePage || getStep() !== 'addmoney') return;
        const stored = await getStoredData(getTradeID());
        if (!stored?.total_value) return;

            const fill = () => {
            const inputs = qa('input.input-money');
            if (!inputs.length) return false;
            inputs.forEach(i => {
                if (isMobile) i.classList.add('mobile-input-font');
                i.value = stored.total_value.toString();
                i.dispatchEvent(new Event('input', { bubbles: true }));
                i.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return true;
        };

        if (fill()) return;
        const obs = new MutationObserver((_, o) => fill() && o.disconnect());
        obs.observe(document.body, { childList: true, subtree: true });
        sleep(isMobile ? 7000 : 5000).then(() => obs.disconnect());
    };

    const initializeScript = () => {
        if (!isTradePage) return;
        
        const obs = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === 'childList') {
                    const nodes = Array.from(m.addedNodes);

                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('trade-cont'))) {
                        initStripe();
                        autoCalc();
                    }

                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('add-money'))) {
                        initStripe();
                        autoFill();
                    }

                    if (nodes.some(n => n.nodeType === 1 && (n.classList?.contains('init-trade') || n.querySelector?.('.init-trade.m-top10')))) {
                        initNewTradeCollapsible();
                    }

                    if (nodes.some(n => n.nodeType === 1 && n.classList?.contains('trades-cont'))) {
                        debouncedDisplayStates();
                    }

                    if (nodes.some(n => n.nodeType === 1 && (n.classList?.contains('title-black') || n.querySelector?.('.title-black.top-round.m-top10')))) {
                        debouncedInitApiKeyButton();
                    }

                    if (nodes.some(n => n.nodeType === 1 && (n.classList?.contains('info-msg-cont') || n.querySelector?.('.info-msg-cont')))) {
                        ensureTradeListExists();
                        debouncedInitApiKeyButton();
                    }

                    for (const node of nodes) {
                        if (node.nodeType === 1 && node.classList?.contains('info-msg-cont') && node.classList?.contains('green')) {
                            const msgText = node.querySelector('.msg')?.textContent?.trim();

                            if (msgText?.includes('accepted the trade')) {
                                sleep(50).then(() => initStripe());
                            } else if (msgText?.includes('changed your money for the trade') && !msgText?.includes('accepted') && !msgText?.includes('complete')) {
                                node.classList.add('info-hidden');
                                const nextSibling = node.nextElementSibling;
                                requestAnimationFrame(() => {
                                    node.remove();
                                    if (nextSibling?.tagName === 'HR' && nextSibling.classList.contains('page-head-delimiter')) {
                                        nextSibling.remove();
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });

        obs.observe(document.body, { childList: true, subtree: true });
        initNewTradeCollapsible();
        debouncedInitApiKeyButton();
        ensureTradeListExists();
        initStripe();
        autoCalc();
    };

    if (isTradePage) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScript);
        } else {
            initializeScript();
        }
    }

    if (isTradePage && getStep() === 'addmoney') autoFill();
    if (isTradePage && getStep() === 'accept2') initStripe();

    if (window.requestIdleCallback) {
        requestIdleCallback(() => cleanupOldStates(), { timeout: 5000 });
    } else {
        sleep(100).then(() => cleanupOldStates());
    }

    startTradePolling();

    if (isTradePage && !getStep()) {
        ensureTradeListExists();
        displayTradeStates();
        initApiKeyButton(); // Also call directly in case MutationObserver misses it
        const tradeListObserver = new MutationObserver(debouncedDisplayStates);
        const tradeList = q(SELECTORS.TRADE_LIST);
        if (tradeList) tradeListObserver.observe(tradeList, { childList: true });
    }

    window.addEventListener('hashchange', () => {
        if (window.acceptBtnUpdateInterval) {
            clearInterval(window.acceptBtnUpdateInterval);
            window.acceptBtnUpdateInterval = null;
        }

        if (isTradePage) {
            if (getStep() === 'addmoney') autoFill();
            if (getStep() === 'accept2') sleep(50).then(() => initStripe());
            if (!getStep()) debouncedDisplayStates();
        }
    });

    window.addEventListener('beforeunload', () => {
        stopTradePolling();
        batchedStorage.flush();
    });
})();
