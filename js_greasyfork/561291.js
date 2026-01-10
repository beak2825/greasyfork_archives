// ==UserScript==
// @name         TornW3B Trading Companion
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Calculates the total value of items in a trade on Torn.com.
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      weav3r.dev
// @connect      api.torn.com
// @connect      www.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561291/TornW3B%20Trading%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/561291/TornW3B%20Trading%20Companion.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
        TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
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

    const API_KEY_INVALID_CODES = [1, 2, 10, 13, 18];
    const shouldInvalidateApiKey = (errorCode) => API_KEY_INVALID_CODES.includes(errorCode);

    const handleApiKeyError = async (tornError, stopPolling = false) => {
        if (tornError && shouldInvalidateApiKey(tornError.code)) {
            await storage.set({ torn_api_key: undefined });
            if (stopPolling) stopTradePolling();
            return true;
        }
        return false;
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
        PAST_TRADES_LIST: '.trades-cont.current.m-bottom10',
        PAST_TRADES_ITEM: '.trades-cont.current.m-bottom10 li',
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
        paste: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
        close: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        chat: '<svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
    };

    const isTradePage = location.pathname.startsWith('/trade.php');
    const checkIsMobile = () => {
        const ua = navigator.userAgent.toLowerCase();
        const mobilePatterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
        if (mobilePatterns.test(ua)) return true;

        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
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
.price-editable {cursor:pointer;position:relative;padding-right:24px;transition:background .2s;touch-action:manipulation}
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
.items-table input[type="text"] {background:var(--bg-med);border:2px solid #4a9eff;color:var(--text);border-radius:4px;font:14px 'Segoe UI',sans-serif;width:100%;padding:8px;box-shadow:0 0 0 3px rgba(74,158,255,0.1);outline:none;text-align:center;touch-action:manipulation}
.items-table input[type="text"]:focus {border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2)}
.editable-input {width:100px;padding:6px;text-align:center;font-size:15px;touch-action:manipulation}
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
.message-section {margin-bottom:16px;padding:14px;background:var(--bg-darker);border-radius:6px;border:1px solid var(--border)}
.message-content {color:var(--text-muted);font:13px 'Segoe UI',sans-serif;line-height:1.5;margin-bottom:12px;white-space:pre-wrap;word-wrap:break-word}
.message-content a {color:#4a9eff;text-decoration:underline}
.message-content a:hover {color:#6bb3ff}
.message-section .copy-url-button {display:block;width:100%}
@media only screen and (max-width:784px), only screen and (max-device-width:784px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:8px !important;padding:15px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:12px 20px !important;font-size:16px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button,.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container,.stripe-container>.accept-trade-button {width:calc(33.333% - 5.33px) !important;max-width:calc(33.333% - 5.33px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 5.33px) !important;margin:0 !important;padding:12px 6px !important;font-size:12px !important;box-shadow:0 2px 4px rgba(0,0,0,.2) !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.calculate-button {order:-2 !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {order:-1 !important}
.stripe-container>.accept-trade-button {order:0 !important}
.stripe-container .button-icon {display:inline-block !important;width:18px !important;height:18px !important;vertical-align:middle !important}
.stripe-container .button-text {display:none !important}
.copy-url-button,.view-edit-receipt-button {width:auto;padding:10px 16px;touch-action:manipulation;font-size:13px}
.receipt-modal {width:90%;max-width:600px;margin:20px;max-height:80vh}
.modal-header {padding:12px 16px}
.modal-header h2 {font-size:1.1em}
.close-modal {font-size:20px;padding:3px 8px}
.modal-content {padding:14px}
.items-table {font-size:12px}
.items-table th {padding:9px 6px;font-size:11px;white-space:nowrap}
.items-table td {padding:7px 4px !important;font-size:12px}
.items-table th:first-child,.items-table td:first-child {display:none}
.items-table td:nth-child(2) {font-size:11px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.item-image {max-width:35px;max-height:35px}
.url-display {flex-direction:row;gap:8px;flex-wrap:wrap}
.url-text {font-size:11px}
.completed-trade{flex-wrap:wrap !important;padding:8px !important;gap:8px}
.completed-trade>a.user.name{flex:1 1 100%;min-width:0}
.completed-trade .completed-actions{flex:1 1 100%;flex-wrap:wrap;padding:0;justify-content:center;gap:6px}
.completed-trade .completed-actions .total-display{font-size:11px;width:100%;text-align:center;margin-bottom:4px}
.completed-trade .completed-actions .action-btn{padding:6px 10px;font-size:10px;flex:1 1 auto;min-width:60px}
.completed-trade .completed-actions .dismiss-btn{width:20px;height:20px;margin-left:4px}
.completed-trade .completed-actions .dismiss-btn svg{width:14px;height:14px}
}
@media only screen and (max-width:480px), only screen and (max-device-width:480px) {
.stripe-container {display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;gap:6px !important;padding:12px !important;align-items:stretch !important;justify-content:space-between !important}
.stripe-container>.value-container,.stripe-container>.value-container.visible {display:contents !important;flex-direction:unset !important}
.stripe-container>.value-container>.total-value-container,.stripe-container .total-value-container {width:100% !important;max-width:100% !important;min-width:100% !important;flex:0 0 100% !important;margin:0 !important;padding:14px !important;font-size:14px !important;order:-3 !important;box-sizing:border-box !important}
.stripe-container>.calculate-button,.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container,.stripe-container>.accept-trade-button {width:calc(33.333% - 4px) !important;max-width:calc(33.333% - 4px) !important;min-width:0 !important;flex:0 0 calc(33.333% - 4px) !important;margin:0 !important;padding:12px 3px !important;font-size:11px !important;white-space:nowrap !important;overflow:hidden !important;box-sizing:border-box !important;text-overflow:clip !important}
.stripe-container>.calculate-button {order:-2 !important}
.stripe-container>.value-container>.receipt-url-container,.stripe-container .receipt-url-container {order:-1 !important}
.stripe-container>.accept-trade-button {order:0 !important}
.stripe-container .button-icon {display:inline-block !important;width:16px !important;height:16px !important;vertical-align:middle !important}
.receipt-modal {width:92%;max-width:none;margin:15px;max-height:80vh}
.modal-header {padding:10px 14px}
.modal-header h2 {font-size:1em}
.close-modal {font-size:18px;padding:2px 7px}
.modal-content {padding:10px}
.items-table {font-size:11px;table-layout:fixed}
.items-table th {padding:8px 3px;font-size:10px;white-space:nowrap}
.items-table td {padding:6px 3px !important;font-size:11px}
.items-table th:first-child,.items-table td:first-child {display:none}
.items-table td:nth-child(2) {font-size:10px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.items-table th:nth-child(2) {width:35%}
.items-table th:nth-child(3) {width:20%}
.items-table th:nth-child(4) {width:22.5%}
.items-table th:nth-child(5) {width:22.5%}
.item-image {max-width:30px;max-height:30px}
.save-changes-button {width:100%;margin:12px 0;touch-action:manipulation}
.copy-url-button,.view-edit-receipt-button {width:auto;padding:10px 14px;touch-action:manipulation;font-size:12px}
.url-display {flex-direction:row;gap:6px;flex-wrap:wrap}
.url-text {font-size:10px}
.editable-input {width:70px;font-size:13px;padding:5px}
.completed-trade .completed-actions .action-btn{padding:5px 8px;font-size:9px;min-width:50px}
.completed-trade .completed-actions .dismiss-btn{width:18px;height:18px}
.completed-trade .completed-actions .dismiss-btn svg{width:12px;height:12px}
}
.new-trade-toggle-header{cursor:pointer;position:relative}
.new-trade-toggle-header::after{content:'▼';font-size:11px;position:absolute;right:10px;top:50%;transform:translateY(-50%);opacity:.7;transition:transform .2s}
.new-trade-toggle-header.expanded::after{transform:translateY(-50%) rotate(-180deg)}
.completed-trade{background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(16,185,129,0.05)) !important;border-left:3px solid #22c55e;display:flex !important;flex-direction:row !important;align-items:center !important;padding:8px 15px !important;min-height:40px !important;height:auto !important;position:relative !important;overflow:visible !important;gap:15px}
.completed-trade .desc{display:none !important;visibility:hidden !important;height:0 !important;padding:0 !important;margin:0 !important;overflow:hidden !important}
.completed-trade .view{display:none !important;visibility:hidden !important;height:0 !important;padding:0 !important;margin:0 !important;overflow:hidden !important}
.completed-trade>a.user.name{flex-shrink:0;opacity:.7}
.completed-trade .completed-actions{display:flex !important;align-items:center;justify-content:center;gap:10px;flex:1;padding:0;position:relative !important;z-index:2 !important}
.completed-trade .completed-actions .action-btn{padding:5px 10px;background:linear-gradient(145deg,var(--bg-light),var(--bg-lighter));color:var(--text);border:1px solid var(--border);border-radius:4px;cursor:pointer;font:500 11px 'Segoe UI';transition:all .2s;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}
.completed-trade .completed-actions .action-btn:hover{background:linear-gradient(145deg,var(--bg-lighter),var(--bg-light));transform:translateY(-1px)}
.completed-trade .completed-actions .action-btn svg{width:12px;height:12px}
.completed-trade .completed-actions .total-display{font:600 12px 'Segoe UI';color:#22c55e}
.completed-trade .completed-actions .dismiss-btn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;color:#ef4444;cursor:pointer;transition:transform .2s,color .2s;border-radius:4px;border:none;background:transparent;padding:0;margin-left:8px}
.completed-trade .completed-actions .dismiss-btn:hover{transform:scale(1.15);color:#dc2626;background:rgba(239,68,68,0.1)}
.completed-trade .completed-actions .dismiss-btn svg{width:16px;height:16px}
.has-unpriced-items{background:linear-gradient(145deg,#ff00ff,#cc00cc) !important;animation:unpriced-pulse 2s ease-in-out infinite}
.has-unpriced-items .button-text{color:#fff !important;font-weight:700}
@keyframes unpriced-pulse{0%,100%{box-shadow:0 0 5px rgba(255,0,255,0.5)}50%{box-shadow:0 0 20px rgba(255,0,255,0.8)}}
.tutorial-highlight{position:fixed;border:3px solid #4a9eff;border-radius:6px;z-index:10001;pointer-events:none;box-shadow:0 0 20px rgba(74,158,255,0.5);animation:tutorial-pulse 1.5s ease-in-out infinite}
@keyframes tutorial-pulse{0%,100%{box-shadow:0 0 20px rgba(74,158,255,0.5)}50%{box-shadow:0 0 30px rgba(74,158,255,0.8)}}
.tutorial-popup{background:#1e1e1e;border:2px solid #444;border-radius:8px;padding:20px;max-width:360px;min-width:280px;z-index:10002;box-shadow:0 4px 30px rgba(0,0,0,0.8);position:fixed}
.tutorial-header{margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #333}
.tutorial-title{font-size:16px;font-weight:600;color:#fff;margin:0}
.tutorial-step{font-size:11px;color:#666;margin-top:4px}
.tutorial-content{color:#ccc;font-size:14px;line-height:1.6;margin-bottom:16px}
.tutorial-content p{margin:8px 0}
.tutorial-content strong{color:#fff}
.tutorial-content ul{margin:8px 0;padding-left:18px}
.tutorial-content li{margin:4px 0}
.tutorial-buttons{display:flex;gap:10px;justify-content:flex-end}
.tutorial-btn{padding:8px 16px;border-radius:4px;border:none;cursor:pointer;font-weight:600;font-size:13px}
.tutorial-btn-skip{background:#333;color:#999}
.tutorial-btn-skip:hover{background:#444;color:#fff}
.tutorial-btn-next{background:#4a9eff;color:#fff}
.tutorial-btn-next:hover{background:#3b82f6}
.tutorial-btn-finish{background:#10b981;color:#fff}
.tutorial-btn-finish:hover{background:#059669}
.tutorial-progress{display:flex;gap:6px;margin-top:12px;justify-content:center}
.tutorial-progress-dot{width:8px;height:8px;border-radius:50%;background:#333}
.tutorial-progress-dot.active{background:#4a9eff}
.tutorial-progress-dot.completed{background:#10b981}
`);
    }

    if (isTradePage) {
        if (!document.querySelector('meta[name="viewport"]')) {
            const head = document.head || document.getElementsByTagName('head')[0];
            if (head) {
                const viewport = document.createElement('meta');
                viewport.name = 'viewport';
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                head.appendChild(viewport);
            }
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

    const storageKeys = {
        trade: (tradeID) => `trade_${tradeID}`,
        tradeState: (tradeID) => `trade_state_${tradeID}`,
        TRADE_STATE_PREFIX: 'trade_state_'
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = 60000) => {
        return new Promise((resolve) => {
            const existing = document.querySelector(selector);
            if (existing) {
                resolve(existing);
                return;
            }

            const startTime = Date.now();

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    resolve(null);
                } else {
                    requestAnimationFrame(check);
                }
            };

            requestAnimationFrame(check);
        });
    };

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

    const includeMessageSetting = {
        get: async () => (await storage.get(['include_receipt_message'])).include_receipt_message || false,
        set: (value) => storage.set({ include_receipt_message: value }),
        toggle: async () => {
            const current = await includeMessageSetting.get();
            await includeMessageSetting.set(!current);
            return !current;
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
                await handleApiKeyError(tornError);
                return null;
            }

            if (userProfileCache.size >= CONFIG.MAX_CACHE_SIZE) {
                userProfileCache.delete(userProfileCache.keys().next().value);
            }
            userProfileCache.set(userID, { data, timestamp: Date.now() });
            return data;
        } catch (e) {
            console.error('Failed to fetch user profile:', e);
            return null;
        }
    };

    const addHandler = (elem, handler, preventDisabled = false) => {
        elem._pointerHandler = handler;
        elem.addEventListener('pointerdown', handler);
    };

    const removeHandler = (elem) => {
        if (elem._pointerHandler) {
            elem.removeEventListener('pointerdown', elem._pointerHandler);
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
    const getParam = (name) => {
        let hashStr = location.hash.substring(1);
        if (hashStr.startsWith('/')) {
            hashStr = hashStr.substring(1);
        }
        return new URLSearchParams(hashStr).get(name);
    };
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
    let currentTradeMessage = null;

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
        } catch (e) {
            console.error('Failed to get user ID:', e);
        }
        return null;
    };

    const parseMoney = (text) => {
        const match = text?.match(/\$([0-9,]+)/);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    };

    const parseItemNameQty = (text) => {
        if (!text) return null;
        const match = text.match(/^(.+?)(?:\s+x(\d+))?$/);
        return match ? { name: match[1].trim(), quantity: parseInt(match[2] || 1, 10) } : null;
    };

    const getMoneyInTrade = () => parseMoney(q(SELECTORS.USER_LEFT_MONEY)?.textContent?.trim());

    const moneyMatches = () => currentReceipt?.total_value && getMoneyInTrade() === currentReceipt.total_value;

    const getUnpricedItems = (receipt) => {
        if (!receipt?.items?.length) return [];
        return receipt.items.filter(item =>
            item.priceUsed === undefined ||
            item.priceUsed === null ||
            item.priceUsed === 0 ||
            isNaN(item.priceUsed)
        );
    };

    const hasUnpricedItems = (receipt) => getUnpricedItems(receipt).length > 0;

    const parseItems = () => {
        const items = [];
        qa(SELECTORS.USER_RIGHT_ITEMS).forEach(row => {
            const text = row.querySelector('.name.left')?.childNodes[0]?.nodeValue?.trim();
            const parsed = parseItemNameQty(text);
            if (parsed) items.push(parsed);
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

    const getStoredData = async (tradeID) => {
        const key = storageKeys.trade(tradeID);
        return (await storage.get([key]))[key] || null;
    };

    const storeData = async (tradeID, items, receipt, receiptURL, message = null) => {
        const existing = await getStoredData(tradeID);
        const manual_prices = existing?.manual_prices || {};
        await storage.set({
            [storageKeys.trade(tradeID)]: { items, receipt, receiptURL, message, timestamp: Date.now(), total_value: receipt.total_value, manual_prices }
        });
        const playerName = getUsername();
        if (playerName && items.length > 0 && receipt?.total_value > 0) {
            await storeCompletedTradeData(playerName, items, receipt, receiptURL, message);
        }
    };

    const COMPLETED_TRADES_KEY = 'completed_trades_index';

    const getCompletedTradesIndex = async () => {
        const data = (await storage.get([COMPLETED_TRADES_KEY]))[COMPLETED_TRADES_KEY];
        return data || [];
    };

    const storeCompletedTradeData = async (playerName, items, receipt, receiptURL, message = null) => {
        const index = await getCompletedTradesIndex();
        const now = Date.now();

        const itemsKey = items
            .map(i => `${i.name.toLowerCase()}:${i.quantity}`)
            .sort()
            .join('|');

        const tradeEntry = {
            playerName: playerName.toLowerCase(),
            items,
            itemsKey,
            totalValue: receipt.total_value,
            receipt,
            receiptURL,
            message,
            timestamp: now
        };

        const filtered = index.filter(entry =>
            !(entry.playerName === tradeEntry.playerName &&
              entry.itemsKey === tradeEntry.itemsKey &&
              entry.totalValue === tradeEntry.totalValue)
        );

        filtered.push(tradeEntry);

        const validEntries = filtered.filter(entry =>
            now - entry.timestamp < CONFIG.TWENTY_FOUR_HOURS
        );

        await storage.set({ [COMPLETED_TRADES_KEY]: validEntries });
    };

    const findMatchingCompletedTrade = async (playerName, items, moneyAmount) => {
        const index = await getCompletedTradesIndex();
        const now = Date.now();

        const itemsKey = items
            .map(i => `${i.name.toLowerCase()}:${i.quantity}`)
            .sort()
            .join('|');

        for (const entry of index) {
            if (now - entry.timestamp > CONFIG.TWENTY_FOUR_HOURS) continue;

            if (entry.playerName !== playerName.toLowerCase()) continue;

            if (entry.itemsKey !== itemsKey) continue;

            if (Math.abs(entry.totalValue - moneyAmount) <= 1) {
                return entry;
            }
        }

        return null;
    };

    const cleanupCompletedTrades = async () => {
        const index = await getCompletedTradesIndex();
        const now = Date.now();
        const validEntries = index.filter(entry =>
            now - entry.timestamp < CONFIG.TWENTY_FOUR_HOURS
        );

        if (validEntries.length !== index.length) {
            await storage.set({ [COMPLETED_TRADES_KEY]: validEntries });
        }
    };

    const isLogviewPage = () => getStep() === 'logview';

    const parseLogviewTrade = () => {
        const tradeCont = q('.trade-cont.m-top10');
        if (!tradeCont) return null;

        const leftUser = tradeCont.querySelector('.user.left');
        const rightUser = tradeCont.querySelector('.user.right');
        if (!leftUser || !rightUser) return null;

        const leftHeader = leftUser.querySelector('.title-black')?.textContent?.trim() || '';
        const rightHeader = rightUser.querySelector('.title-black')?.textContent?.trim() || '';

        const leftPlayerMatch = leftHeader.match(/^(.+?)(?:'s items traded|'s items|$)/i);
        const rightPlayerMatch = rightHeader.match(/^(.+?)(?:'s items traded|'s items|$)/i);

        const leftPlayerName = leftPlayerMatch ? leftPlayerMatch[1].trim() : '';
        const rightPlayerName = rightPlayerMatch ? rightPlayerMatch[1].trim() : '';

        const parseMoneyFromSide = (side) => {
            const moneyText = side.querySelector('.cont li.color1 .name.left')?.textContent?.trim() || '';
            return parseMoney(moneyText);
        };

        const parseItemsFromSide = (side) => {
            const items = [];
            const itemsList = side.querySelector('.cont li.color2 ul.desc');
            if (!itemsList) return items;

            itemsList.querySelectorAll('li').forEach(li => {
                const nameEl = li.querySelector('.name.left');
                if (!nameEl) return;

                const text = nameEl.childNodes[0]?.nodeValue?.trim() || nameEl.textContent?.trim() || '';
                if (!text || text.toLowerCase() === 'no items in trade') return;

                const parsed = parseItemNameQty(text);
                if (parsed) items.push(parsed);
            });
            return items;
        };

        const leftMoney = parseMoneyFromSide(leftUser);
        const rightMoney = parseMoneyFromSide(rightUser);
        const leftItems = parseItemsFromSide(leftUser);
        const rightItems = parseItemsFromSide(rightUser);

        return {
            leftPlayerName,
            rightPlayerName,
            leftMoney,
            rightMoney,
            leftItems,
            rightItems
        };
    };

    const getTradeState = async (tradeID) => {
        const key = storageKeys.tradeState(tradeID);
        const data = (await storage.get([key]))[key];
        if (!data) return null;
        if (Date.now() - data.timestamp > CONFIG.SEVEN_HOURS) {
            await storage.set({ [key]: undefined });
            return null;
        }
        return data;
    };

    const setTradeState = async (tradeID, state, additionalData = {}) => {
        batchedStorage.set(storageKeys.tradeState(tradeID), { state, timestamp: Date.now(), ...additionalData });
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

    const flashClass = (element, className, duration = 2000) => {
        element.classList.add(className);
        sleep(duration).then(() => element.classList.remove(className));
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
            .filter(k => k.startsWith(storageKeys.TRADE_STATE_PREFIX) && allKeys[k] && now - allKeys[k].timestamp > CONFIG.SEVEN_HOURS)
            .reduce((obj, k) => ({ ...obj, [k]: undefined }), {});

        if (Object.keys(toDelete).length) await storage.set(toDelete);

        await cleanupCompletedTrades();
    };

    const isMainTradePage = () => isTradePage && !getStep();
    const isTradePageView = () => isTradePage && getStep() === 'view';

    const getTradeIDFromElement = (element) => {
        const link = element.querySelector?.(SELECTORS.TRADE_LINK) || element;
        if (!link?.href) return null;
        const match = link.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    };

    const findTradeListItem = (tradeID) => {
        for (const li of qa(SELECTORS.TRADE_LIST_ITEM)) {
            const linkTradeID = getTradeIDFromElement(li);
            if (linkTradeID === String(tradeID)) return li;
        }
        return null;
    };

    const ensureTradeData = (tradeID) => {
        if (!apiTradeData[tradeID]) {
            apiTradeData[tradeID] = initTradeData();
        }
        return apiTradeData[tradeID];
    };

    const getTradeList = () => q(SELECTORS.TRADE_LIST) || ensureTradeListExists();

    const updateIndicator = async (li, tradeID) => {
        if (!li || !tradeID) return;
        const stateData = await getTradeState(tradeID);
        const display = await getStateDisplay(stateData, tradeID);
        if (!display) return;

        let statusSpan = li.querySelector('.trade-status-indicator');
        if (!statusSpan) {
            statusSpan = el('span', {
                classes: 'trade-status-indicator',
                attributes: { 'data-trade-id': tradeID }
            });
            const descP = li.querySelector('.desc p');
            if (descP) descP.appendChild(statusSpan);
        }

        statusSpan.textContent = display.text;
        Object.assign(statusSpan.style, {
            color: display.color,
            backgroundColor: `${display.color}20`,
            border: `1px solid ${display.color}40`
        });
    };

    const displayTradeStates = async () => {
        if (!isMainTradePage()) return;

        ensureTradeListExists();
        const tradeListItems = qa(SELECTORS.TRADE_LIST_ITEM);
        if (!tradeListItems.length) return;

        await Promise.all(Array.from(tradeListItems).map(async (li) => {
            const tradeID = getTradeIDFromElement(li);
            if (!tradeID) return;
            await updateIndicator(li, tradeID);
        }));
    };

    const debouncedDisplayStates = debounce(displayTradeStates, 100);

    const refreshTradeStatusTimes = async () => {
        if (!isMainTradePage()) return;

        const statusBadges = qa('.trade-status-indicator[data-trade-id]');
        if (!statusBadges.length) return;

        await Promise.all(Array.from(statusBadges).map(async (badge) => {
            const tradeID = badge.getAttribute('data-trade-id');
            const li = badge.closest('li');
            if (tradeID && li) await updateIndicator(li, tradeID);
        }));
    };

    const createTradeRow = async (tradeID, userID, description, timestamp) => {
        if (!isTradePage) return;

        const tradeList = getTradeList();
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
        await updateIndicator(li, tradeID);
        li.classList.add('flash-new');
    };


    const removeTradeFromList = (tradeID) => {
        if (!isMainTradePage()) return;

        const li = findTradeListItem(tradeID);
        if (li) {
            li.classList.add('fade-out');
            sleep(300).then(() => li.remove());
        }
    };

    const openChat = (userID) => {
        if (window.chat && typeof window.chat === 'object') {
            window.chat.r(userID);
        } else {
            window.dispatchEvent(new CustomEvent('chat.openChannel', {
                detail: { userId: String(userID) }
            }));
        }
    };

    const transformToCompletedTrade = async (tradeID, userID) => {
        if (!isMainTradePage()) return;

        const li = findTradeListItem(tradeID);
        if (!li) return;

        const stored = await getStoredData(tradeID);
        const totalValue = stored?.total_value || 0;
        const message = stored?.message || null;
        const hasReceipt = stored?.receiptURL && stored?.receipt;

        li.classList.add('completed-trade');
        li.classList.add('flash-new');

        const nametDiv = li.querySelector('.namet');
        if (nametDiv) {
            const nameLinks = Array.from(nametDiv.querySelectorAll('a.user.name'));
            nameLinks.forEach(link => {
                link.style.opacity = '0.7';
                link.style.flexShrink = '0';
                li.insertBefore(link, li.firstChild);
            });
            nametDiv.remove();
        }

        const descDiv = li.querySelector('.desc');
        if (descDiv) {
            descDiv.style.display = 'none';
            descDiv.style.visibility = 'hidden';
            descDiv.style.height = '0';
            descDiv.style.padding = '0';
            descDiv.style.margin = '0';
            descDiv.style.overflow = 'hidden';

            const actionsDiv = el('div', { classes: 'completed-actions' });

            actionsDiv.appendChild(el('span', {
                classes: 'total-display',
                text: `✓ Completed${totalValue > 0 ? ` - $${totalValue.toLocaleString()}` : ''}`
            }));

            if (hasReceipt) {
                const viewReceiptBtn = el('button', {
                    classes: 'action-btn',
                    html: `${SVG_ICONS.receipt} View Receipt`,
                    onClick: async () => {
                        currentReceipt = stored.receipt;
                        currentReceiptURL = stored.receiptURL;
                        currentTradeMessage = stored.message || null;
                        showModal();
                    }
                });
                actionsDiv.appendChild(viewReceiptBtn);
            }

            if (message) {
                const copyMsgBtn = el('button', {
                    classes: 'action-btn',
                    html: `${SVG_ICONS.paste} Copy Message`,
                    onClick: () => {
                        navigator.clipboard.writeText(message);
                        showMsg(copyMsgBtn, 'Copied!', 1000);
                    }
                });
                actionsDiv.appendChild(copyMsgBtn);
            }

            if (userID) {
                const chatBtn = el('button', {
                    classes: 'action-btn',
                    html: `${SVG_ICONS.chat} Open Chat`,
                    onClick: () => openChat(userID)
                });
                actionsDiv.appendChild(chatBtn);
            }

            const dismissBtn = el('button', {
                classes: 'dismiss-btn',
                html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
                onClick: () => {
                    li.classList.add('fade-out');
                    sleep(300).then(() => li.remove());
                }
            });
            actionsDiv.appendChild(dismissBtn);

            descDiv.parentNode.insertBefore(actionsDiv, descDiv.nextSibling);
        }

        const viewDiv = li.querySelector('.view');
        if (viewDiv) {
            viewDiv.style.display = 'none';
            viewDiv.style.visibility = 'hidden';
            viewDiv.style.height = '0';
            viewDiv.style.padding = '0';
            viewDiv.style.margin = '0';
            viewDiv.style.overflow = 'hidden';
        }

        const statusIndicator = li.querySelector('.trade-status-indicator');
        if (statusIndicator) statusIndicator.remove();
    };

    const processActivityLog = async (eventsData) => {
        if (!eventsData || typeof eventsData !== 'object') return;

        const tradeList = isMainTradePage() ? getTradeList() : null;

        const events = Object.entries(eventsData)
            .map(([id, event]) => ({ ...event, ID: id }))
            .sort((a, b) => b.timestamp - a.timestamp);

        const tradeStatuses = {};
        const tradesToCreate = [];

        for (const event of events) {
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;
            if (event.category !== 'Trades') continue;

            const tradeID = event.data?.parsed_trade_id;
            if (!tradeID) continue;
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
            const data = ensureTradeData(trade.tradeID);
            data.userID = trade.userID;
            data.lastEventTime = trade.timestamp * 1000;
        }

        if (tradeList) {
            for (const trade of validTrades) {
                if (!findTradeListItem(trade.tradeID)) {
                    await createTradeRow(trade.tradeID, trade.userID, trade.description, trade.timestamp);
                }
            }
        }

        for (const event of events) {
            if (lastProcessedEventID && event.ID === lastProcessedEventID) break;
            if (event.category !== 'Trades') continue;

            const tradeID = event.data?.parsed_trade_id;
            if (!tradeID) continue;

            const data = ensureTradeData(tradeID);

            const eventLog = Number(event.log);

            if (TERMINAL_EVENTS.includes(eventLog)) {
                if (isMainTradePage()) {
                    if (eventLog === TRADE_EVENTS.COMPLETED) {
                        const userID = data.userID || event.data?.user;
                        transformToCompletedTrade(tradeID, userID);
                    } else {
                        removeTradeFromList(tradeID);
                    }
                }
                delete apiTradeData[tradeID];
                batchedStorage.set(storageKeys.tradeState(tradeID), undefined);
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

            if (eventLog === TRADE_EVENTS.OTHER_ITEMS_ADD) {
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
                if (isMainTradePage()) {
                    const li = findTradeListItem(tradeID);
                    if (li) await updateIndicator(li, tradeID);
                }
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

        const tenMinutesAgo = Math.floor((Date.now() - 600000) / 1000);

        try {
            const apiUrl = `${CONFIG.TORN_API}user/?key=${key}&cat=94&from=${tenMinutesAgo}&comment=W3B-Script&selections=log`;
            const response = await fetch(apiUrl);
            const httpError = handleHttpError(response.status);
            if (httpError) return;

            const data = await response.json();
            const tornError = handleTornApiError(data);
            if (tornError) {
                await handleApiKeyError(tornError, true);
                return;
            }

            if (data?.log && typeof data.log === 'object') {
                await processActivityLog(data.log);
                if (isMainTradePage()) {
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
            if (!hasPrice || !value) return '#ff00ff';
            if (validItems.length === 0) return '#ff00ff';

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

    const clickAcceptButton = () => {
        const acceptBtn = q(SELECTORS.ACCEPT_BTN);
        if (acceptBtn) {
            acceptBtn.click();
        }
    };

    const updateAcceptBtn = (btn) => {
        if (!isTradePage) return;
        if (!btn) btn = q('.accept-trade-button');
        if (!btn) return;

        const moneyInTrade = getMoneyInTrade();
        const acceptButtonExists = !!q(SELECTORS.ACCEPT_BTN);
        const expectedValue = currentReceipt?.total_value || 0;
        const hasItems = currentReceipt?.items?.length > 0;
        const goToAddMoney = () => {
            const tradeID = getTradeID();
            if (tradeID) {
                window.location.href = `https://www.torn.com/trade.php#step=addmoney&ID=${tradeID}`;
            }
        };

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
                    const tradeID = getTradeID();
                    if (tradeID) {
                        await setTradeState(tradeID, 'accepted', {
                            acceptedAt: Date.now(),
                            totalValue: currentReceipt?.total_value || 0
                        });
                        clickAcceptButton();
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
            currentTradeMessage = stored.message || null;

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

        const includeMessage = await includeMessageSetting.get();
        const res = await apiCall(`pricelist/${userID}`, { items, username, tradeID: parseInt(tradeID), includeMessage });

        if (res?.error) {
            const totalEl = q('.total-value-container');
            if (totalEl) {
                totalEl.textContent = `Error: ${res.error}`;
                flashClass(totalEl, 'error-button', 3000);
            }
            return;
        }

        if (res?.receipt?.total_value !== undefined && res.receiptURL) {
            currentReceipt = res.receipt;
            currentReceiptURL = res.receiptURL;
            currentTradeMessage = res.message || null;
            storeData(tradeID, items, res.receipt, res.receiptURL, res.message);
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
                html: `<td><img src="${imageUrl}" alt="Item" class="item-image"/></td><td>${item.name}</td><td>${(item.quantity || 0).toLocaleString()}</td><td>$${(item.priceUsed || 0).toLocaleString()}</td><td>$${(item.totalValue || 0).toLocaleString()}</td>`
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

            const activateEdit = (e) => {
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

                setTimeout(() => {
                    input.focus();
                    input.select();
                }, 10);

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

                input.addEventListener('blur', done);
                input.addEventListener('keypress', (e) => e.key === 'Enter' && input.blur());

                const handleOutsideClick = (e) => {
                    if (!input.contains(e.target) && !cell.contains(e.target)) {
                        input.blur();
                        document.removeEventListener('pointerdown', handleOutsideClick);
                    }
                };

                setTimeout(() => {
                    document.addEventListener('pointerdown', handleOutsideClick);
                }, 100);
            };

            cell.addEventListener('pointerdown', activateEdit);
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

                await storage.set({ [storageKeys.trade(tradeID)]: existing });
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
                            el('td', { text: (item.quantity || 0).toLocaleString() }),
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
            await sleep(2000);
            saveBtn.classList.add('save-button-hidden');
            saveBtn.classList.remove('saved');
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

            if (currentTradeMessage) {
                const copyMsgBtn = el('button', {
                    classes: 'copy-url-button',
                    text: 'Copy Message',
                    onClick: () => navigator.clipboard.writeText(currentTradeMessage).then(() => showMsg(copyMsgBtn, 'Copied!', 2000))
                });

                const messageContainer = el('div', { classes: 'message-section' });
                const messageContent = el('div', { classes: 'message-content' });
                messageContent.innerHTML = currentTradeMessage.replace(/\n/g, '<br>');
                messageContainer.appendChild(messageContent);
                messageContainer.appendChild(copyMsgBtn);
                content.appendChild(messageContainer);
            }

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
        if (!isMainTradePage()) return null;

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
        if (!isMainTradePage()) return;
        if (retryCount > 20) return;

        if (q('.api-key-button')) return;

        const currentTradeHeading = Array.from(qa('.title-black.top-round.m-top10')).find(el =>
            el.textContent.trim() === 'Current Trade'
        );

        const noTradesMsg = Array.from(qa('.info-msg-cont')).find(el => {
            const msg = el.querySelector('.msg.right-round');
            return msg && msg.textContent.trim() === 'You have no current trades.';
        })?.querySelector('.msg.right-round');

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
            const existingMsgBtn = container.querySelector('.msg-toggle-button');
            if (existingMsgBtn) existingMsgBtn.remove();

            const hasKey = !!(await apiKey.get());

            const button = el('button', {
                classes: 'api-key-button',
                text: hasKey ? 'Remove key' : 'Set API key',
                onClick: async (e) => {
                    e.stopPropagation();
                    if (hasKey) {
                        if (!confirm('Are you sure you want to remove your API key? This will stop real-time trade updates.')) {
                            return;
                        }
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

            const includeMsg = await includeMessageSetting.get();
            const msgToggleBtn = el('button', {
                classes: ['api-key-button', 'msg-toggle-button'],
                text: includeMsg ? 'Including Message' : 'Excluding Message',
                onClick: async (e) => {
                    e.stopPropagation();
                    const newValue = await includeMessageSetting.toggle();
                    msgToggleBtn.textContent = newValue ? 'Including Message' : 'Excluding Message';
                }
            });

            container.appendChild(msgToggleBtn);
        };

        await updateButton();
    };

    const debouncedInitApiKeyButton = debounce(initApiKeyButton, 100);

    const initNewTradeCollapsible = (root = document) => {
        if (!isMainTradePage()) return;

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
        if (!isTradePage || !getStep()) return;

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
                    () => window.location.hash = ''
                );

                const stripe = el('div', { classes: ['stripe-container', 'expanded'], children: [backToTradeBtn, container, dashboardBtn] });
                confirmMsg.parentNode.insertBefore(stripe, confirmMsg.nextSibling);

                (async () => {
                    if (tradeID) {
                        const stored = await getStoredData(tradeID);
                        if (stored?.receipt) {
                            currentReceipt = stored.receipt;
                            currentReceiptURL = stored.receiptURL;
                            currentTradeMessage = stored.message || null;
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
            const accept = createButton(['accept-trade-button'], SVG_ICONS.check, 'Accept Trade', null);
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

                const includeMessage = await includeMessageSetting.get();
                const res = await apiCall(`pricelist/${userID}`, { items, username, tradeID: parseInt(tradeID), includeMessage });

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
                    currentTradeMessage = res.message || null;
                    total.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
                    [total, receipt].forEach(e => e.classList.remove('hidden'));
                    container.classList.add('visible');
                    stripe.classList.add('expanded');
                    updateAcceptBtn(accept);
                    requestAnimationFrame(() => colorCodeItemsByValue());
                    storeData(tradeID, items, res.receipt, res.receiptURL, res.message);

                    const unpricedItems = getUnpricedItems(res.receipt);
                    if (unpricedItems.length > 0) {
                        btn.classList.add('has-unpriced-items');
                        const unpricedCount = unpricedItems.length;
                        const btnText = btn.querySelector('.button-text');
                        if (btnText) {
                            btnText.textContent = `⚠ ${unpricedCount} Unpriced`;
                            btnText.title = `${unpricedCount} item${unpricedCount > 1 ? 's have' : ' has'} no price data: ${unpricedItems.map(i => i.name).join(', ')}`;
                        }
                    }
                }
            };

            const btn = createButton(['calculate-button'], SVG_ICONS.calculate, 'Calculate Trade', calculateHandler);
            children = [btn, container, accept];
        }

        const stripe = el('div', { classes: ['stripe-container'], children });
        tc.parentNode.insertBefore(stripe, tc);
    };

    const initLogviewStripe = async () => {
        if (!isTradePage || !isLogviewPage()) return;
        if (q('.stripe-container')) return;

        const tradeCont = q('.trade-cont.m-top10');
        if (!tradeCont) return;

        const tradeData = parseLogviewTrade();
        if (!tradeData) return;

        let otherPlayerName, itemsReceived, moneyPaid;

        if (tradeData.leftMoney > 0 && tradeData.rightItems.length > 0) {
            otherPlayerName = tradeData.rightPlayerName;
            itemsReceived = tradeData.rightItems;
            moneyPaid = tradeData.leftMoney;
        } else if (tradeData.rightMoney > 0 && tradeData.leftItems.length > 0) {
            otherPlayerName = tradeData.leftPlayerName;
            itemsReceived = tradeData.leftItems;
            moneyPaid = tradeData.rightMoney;
        } else {
            return;
        }

        if (!otherPlayerName || itemsReceived.length === 0 || moneyPaid === 0) return;

        const matchedTrade = await findMatchingCompletedTrade(otherPlayerName, itemsReceived, moneyPaid);

        if (matchedTrade) {
            currentReceipt = matchedTrade.receipt;
            currentReceiptURL = matchedTrade.receiptURL;
            currentTradeMessage = matchedTrade.message || null;
        }

        const total = el('div', {
            classes: ['total-value-container'],
            text: matchedTrade
                ? `Total Value: $${matchedTrade.totalValue.toLocaleString()}`
                : `Trade Value: $${moneyPaid.toLocaleString()}`,
            onClick: () => {
                const value = matchedTrade?.totalValue || moneyPaid;
                navigator.clipboard.writeText(value.toString());
                showMsg(total, 'Copied!', 1000);
            }
        });

        const receipt = el('div', {
            classes: ['receipt-url-container', matchedTrade ? '' : 'hidden'].filter(Boolean),
            html: `${SVG_ICONS.receipt}<span class="button-text">View Receipt</span>`,
            onClick: matchedTrade ? showModal : null
        });

        const container = el('div', { classes: ['value-container', 'visible'], children: [total, receipt] });

        const statusBtn = createButton(
            ['accept-trade-button', matchedTrade ? 'button-accepted' : ''].filter(Boolean),
            SVG_ICONS.check,
            matchedTrade ? 'Completed' : 'No Receipt',
            null
        );
        statusBtn.disabled = true;
        statusBtn.style.cursor = 'default';
        if (matchedTrade) {
            statusBtn.title = `Receipt found - trade with ${otherPlayerName}`;
        } else {
            statusBtn.title = 'No matching receipt found in storage';
        }

        const dashboardBtn = createButton(['calculate-button'], SVG_ICONS.dashboard, 'Dashboard',
            () => window.location.hash = ''
        );

        const stripe = el('div', { classes: ['stripe-container', 'expanded'], children: [dashboardBtn, container, statusBtn] });
        tradeCont.parentNode.insertBefore(stripe, tradeCont);
    };

    const autoFill = async () => {
        if (!isTradePage || getStep() !== 'addmoney') return;
        const stored = await getStoredData(getTradeID());
        if (!stored?.total_value) return;

        const input = await waitForElement('input.input-money');
        if (!input) return;

        const inputs = qa('input.input-money');
        inputs.forEach(i => {
            if (isMobile) i.classList.add('mobile-input-font');
            i.value = stored.total_value.toString();
            i.dispatchEvent(new Event('input', { bubbles: true }));
            i.dispatchEvent(new Event('change', { bubbles: true }));
        });
    };

    let messageObserver = null;

    const initMessageObserver = () => {
        if (messageObserver) return messageObserver;

        messageObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;

                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (!node.classList?.contains('info-msg-cont')) continue;

                    const msgText = node.querySelector?.('.msg')?.textContent?.trim();
                    if (!msgText) continue;

                    if (msgText.includes('changed your money for the trade') &&
                        !msgText.includes('accepted') &&
                        !msgText.includes('complete')) {
                        node.classList.add('info-hidden');
                        const nextSibling = node.nextElementSibling;
                        node.remove();
                        if (nextSibling?.tagName === 'HR' && nextSibling.classList.contains('page-head-delimiter')) {
                            nextSibling.remove();
                        }
                    }
                }
            }
        });

        messageObserver.observe(document.body, { childList: true, subtree: true });
        return messageObserver;
    };

    const stopMessageObserver = () => {
        if (messageObserver) {
            messageObserver.disconnect();
            messageObserver = null;
        }
    };

    const TUTORIAL_STORAGE_KEY = 'tutorial_completed';
    const TUTORIAL_VERSION = 1;

    const tutorialSettings = {
        get: async () => {
            const data = (await storage.get([TUTORIAL_STORAGE_KEY]))[TUTORIAL_STORAGE_KEY];
            return data || { completed: false, version: 0 };
        },
        set: (value) => storage.set({ [TUTORIAL_STORAGE_KEY]: value }),
        markCompleted: async () => {
            await tutorialSettings.set({ completed: true, version: TUTORIAL_VERSION });
        },
        needsTutorial: async () => {
            const data = await tutorialSettings.get();
            return !data.completed || data.version < TUTORIAL_VERSION;
        }
    };

    const TUTORIAL_STEPS = [
        {
            id: 'welcome',
            title: 'Quick Tutorial',
            content: `<p>This script turns your trade page into a <strong>live trading dashboard</strong>.</p>
            <p>Everything updates in real-time - <strong>no refreshing needed, ever</strong>. Just leave the page open and watch trades update automatically.</p>`,
            demoAction: null
        },
        {
            id: 'api-key',
            title: 'API Key Required',
            content: `<p>To enable the live dashboard, you need to set your API key.</p>
            <p>Your key must have <strong style="color:#ef4444">Full Access</strong> permissions.</p>
            <p>Once set, trades update automatically in the background - you can idle on this page indefinitely.</p>
            <p style="font-size:12px;color:#888">Find it at: Torn → Settings → API Key</p>`,
            targetSelector: '.api-key-button',
            highlightTarget: true,
            demoAction: null
        },
        {
            id: 'demo-trade-initiated',
            title: 'New Trade Started',
            content: `<p>A new trade just appeared in your list - <strong>without refreshing</strong>.</p>
            <p>When someone initiates a trade with you, it shows up here automatically. You don't need to reload the page to see new trades.</p>`,
            demoAction: 'createTradeRow'
        },
        {
            id: 'demo-items-received',
            title: 'Items Added',
            content: `<p>The other player just added items to the trade.</p>
            <p>See the <span style="background:#f59e0b;color:#000;padding:1px 6px;border-radius:3px;font-size:12px">Items Received</span> badge? This appeared automatically - <strong>no page refresh</strong>.</p>
            <p>You can leave this page open all day and every trade update appears instantly.</p>`,
            demoAction: 'updateStatus:items-received'
        },
        {
            id: 'demo-trade-page',
            title: 'Inside the Trade',
            content: `<p>When you open the trade, you see a button bar with three buttons:</p>
            <p><strong>Calculate Trade</strong> - Gets prices for all items (runs automatically when you open a trade)</p>
            <p><strong>Total Value</strong> - Shows the calculated total (click to copy)</p>
            <p><strong>Accept Trade</strong> - Accept when ready</p>`,
            demoAction: 'showStripe'
        },
        {
            id: 'demo-calculated',
            title: 'Auto-Calculate',
            content: `<p>The script automatically calculates prices when you open a trade.</p>
            <p>Items get color-coded: <span style="color:#4ade80">green</span> = high value, <span style="color:#fbbf24">yellow</span> = medium, <span style="color:#ef4444">red</span> = lower.</p>
            <p style="color:#ff00ff">Pink items have no price data - check these manually!</p>`,
            demoAction: 'showCalculated'
        },
        {
            id: 'demo-receipt',
            title: 'View/Edit Receipt',
            content: `<p>Click <strong>Total Value</strong> to copy the amount, or a <strong>View Receipt</strong> button appears to see the full breakdown.</p>
            <p>You can edit prices in the receipt if needed and save changes.</p>`,
            demoAction: 'showReceipt'
        },
        {
            id: 'demo-add-money',
            title: 'Add Money Page',
            content: `<p>When you click <strong>Add Money</strong>, you're taken to a page to enter the payment amount.</p>
            <p>The script <strong>automatically fills in</strong> the exact amount from the receipt - no typing needed.</p>
            <p>The button bar stays in the same position so you can quickly click through without hunting for buttons.</p>`,
            demoAction: null
        },
        {
            id: 'demo-accept-blocked',
            title: 'Scam Protection',
            content: `<p>The Accept button is <strong>blocked</strong> if the money doesn't match the receipt value.</p>
            <p>It shows <span style="background:#ef4444;color:#fff;padding:1px 6px;border-radius:3px;font-size:12px">Too Low</span> or <span style="background:#ef4444;color:#fff;padding:1px 6px;border-radius:3px;font-size:12px">Too High</span> if amounts don't match.</p>
            <p>This prevents you from accepting a trade where the other person changed the amount.</p>`,
            demoAction: 'showBlocked'
        },
        {
            id: 'demo-accept-ready',
            title: 'Ready to Accept',
            content: `<p>When the money matches, the button turns green and says <span style="background:#10b981;color:#fff;padding:1px 6px;border-radius:3px;font-size:12px">Accept Trade</span>.</p>
            <p>Now it's safe to accept!</p>`,
            demoAction: 'showReady'
        },
        {
            id: 'demo-accepted',
            title: 'Trade Accepted',
            content: `<p>After you accept, the status updates to <span style="background:#8b5cf6;color:#fff;padding:1px 6px;border-radius:3px;font-size:12px">Accepted</span>.</p>
            <p>Now just wait - when the other player accepts, the trade will complete and update automatically. No need to refresh or check back.</p>`,
            demoAction: 'updateStatus:accepted'
        },
        {
            id: 'demo-completed',
            title: 'Trade Completed',
            content: `<p>The trade row transforms when completed, showing:</p>
            <p><strong>Receipt</strong> - View the price breakdown</p>
            <p><strong>Message</strong> - Copy the generated message</p>
            <p><strong>Chat</strong> - Quick link to message the player</p>
            <p><strong>X</strong> - Dismiss from the list</p>`,
            demoAction: 'showCompleted'
        },
        {
            id: 'done',
            title: 'All Set!',
            content: `<p><strong>Your live trading dashboard is ready.</strong></p>
            <ul style="margin:8px 0;padding-left:18px;line-height:1.7;font-size:13px">
                <li>Set API key (Full Access) to enable live updates</li>
                <li>Leave the page open - everything updates automatically</li>
                <li>Prices calculate automatically when opening trades</li>
                <li>Money auto-fills on the Add Money page</li>
                <li>Accept button blocked if amounts don't match</li>
                <li>Completed trades show quick action buttons</li>
            </ul>
            <p style="margin-top:10px;color:#888;font-size:12px"><strong>No refreshing needed - ever.</strong> Just idle and trade.</p>
            <p style="margin-top:12px;padding-top:12px;border-top:1px solid #333;font-size:13px">
                <strong>Important:</strong> Set up your pricelist at <a href="https://weav3r.dev" target="_blank" style="color:#4a9eff">weav3r.dev</a> for buy price calculations. Calculate trade won't do anything for you if you don't have a pricelist!
            </p>
            <p style="margin-top:10px;font-size:13px">
                Questions? <a href="https://www.torn.com/profiles.php?XID=1853324" target="_blank" style="color:#4a9eff">Message Weav3r</a> or join the <a href="https://discord.gg/ZDRZV8qCkJ" target="_blank" style="color:#4a9eff">Discord</a>
            </p>`,
            demoAction: 'cleanup'
        }
    ];

    const createTutorialPopup = (step, stepIndex, totalSteps, onNext, onSkip) => {
        const isLastStep = stepIndex === totalSteps - 1;

        return el('div', {
            classes: 'tutorial-popup',
            children: [
                el('div', {
                    classes: 'tutorial-header',
                    children: [
                        el('div', { classes: 'tutorial-title', text: step.title }),
                        el('div', { classes: 'tutorial-step', text: `${stepIndex + 1} / ${totalSteps}` })
                    ]
                }),
                el('div', { classes: 'tutorial-content', html: step.content }),
                el('div', {
                    classes: 'tutorial-buttons',
                    children: [
                        el('button', {
                            classes: ['tutorial-btn', 'tutorial-btn-skip'],
                            text: 'Skip',
                            onClick: onSkip
                        }),
                        el('button', {
                            classes: ['tutorial-btn', isLastStep ? 'tutorial-btn-finish' : 'tutorial-btn-next'],
                            text: isLastStep ? 'Done' : 'Next',
                            onClick: onNext
                        })
                    ]
                }),
                el('div', {
                    classes: 'tutorial-progress',
                    children: TUTORIAL_STEPS.map((_, i) => el('div', {
                        classes: ['tutorial-progress-dot', i === stepIndex ? 'active' : '', i < stepIndex ? 'completed' : ''].filter(Boolean)
                    }))
                })
            ]
        });
    };

    const DEMO_TRADE_ID = 'tutorial-demo-99999';
    const DEMO_USER_NAME = 'TutorialTrader';
    const DEMO_USER_ID = '1853324';

    const createDemoTradeRow = () => {
        const li = el('li', { attributes: { id: DEMO_TRADE_ID } });
        const userNameChars = DEMO_USER_NAME.split('').map(c => `<span data-char="${c}"></span>`).join('');
        li.innerHTML = `
            <div class="namet t-blue h">
                <a class="user name t-hide" data-placeholder="${DEMO_USER_NAME} [${DEMO_USER_ID}]" href="/profiles.php?XID=${DEMO_USER_ID}" title="${DEMO_USER_NAME} [${DEMO_USER_ID}]">
                    <div class="honor-text-wrap default" style="--arrow-width: 20px;">
                        <img src="/images/honors/843/f.png" border="0" alt="${DEMO_USER_NAME} [${DEMO_USER_ID}]">
                        <span class="honor-text honor-text-svg">${userNameChars}</span>
                        <span class="honor-text">${DEMO_USER_NAME}</span>
                    </div>
                </a>
                <a class="user name t-show" data-placeholder="${DEMO_USER_NAME} [${DEMO_USER_ID}]" href="/profiles.php?XID=${DEMO_USER_ID}" title="${DEMO_USER_NAME} [${DEMO_USER_ID}]">
                    <div class="honor-text-wrap default" style="--arrow-width: 20px;">
                        <img src="/images/honors/843/h.png" border="0" alt="${DEMO_USER_NAME} [${DEMO_USER_ID}]">
                        <span class="honor-text honor-text-svg">${userNameChars}</span>
                        <span class="honor-text">${DEMO_USER_NAME}</span>
                    </div>
                </a>
            </div>
            <div class="desc">
                <span class="desk">Expires in -</span>
                <span class="mob">Exp:</span>
                <span class="time">5 hrs 59 mins</span>
                <p>Description: Buying items</p>
            </div>
            <div class="view">
                <a href="trade.php#step=view&ID=${DEMO_TRADE_ID}" area-label="view">
                    <i class="view-icon"></i>
                </a>
            </div>
        `;
        li.classList.add('flash-new');
        return li;
    };

    const addDemoStatusBadge = (status) => {
        const li = document.querySelector(`#${DEMO_TRADE_ID}`);
        if (!li) return;

        const states = {
            'items-received': { text: 'Items Received', color: '#f59e0b' },
            'money-received': { text: 'Money Received', color: '#10b981' },
            'accepted': { text: 'Accepted', color: '#8b5cf6' }
        };
        const display = states[status];
        if (!display) return;

        let statusSpan = li.querySelector('.trade-status-indicator');
        if (!statusSpan) {
            statusSpan = el('span', {
                classes: 'trade-status-indicator',
                attributes: { 'data-trade-id': DEMO_TRADE_ID }
            });
            const descP = li.querySelector('.desc p');
            if (descP) descP.appendChild(statusSpan);
        }

        statusSpan.textContent = display.text;
        Object.assign(statusSpan.style, {
            color: display.color,
            backgroundColor: `${display.color}20`,
            border: `1px solid ${display.color}40`
        });
    };

    const createDemoCompletedRow = () => {
        const li = el('li', { attributes: { id: DEMO_TRADE_ID + '-completed' } });
        li.classList.add('completed-trade');
        li.classList.add('flash-new');

        const nameLink = el('a', {
            classes: ['user', 'name'],
            attributes: { href: `/profiles.php?XID=${DEMO_USER_ID}` },
            html: `<div class="honor-text-wrap default"><span class="honor-text">${DEMO_USER_NAME}</span></div>`
        });
        nameLink.style.opacity = '0.7';
        nameLink.style.flexShrink = '0';
        li.appendChild(nameLink);

        const actionsDiv = el('div', { classes: 'completed-actions' });

        actionsDiv.appendChild(el('span', {
            classes: 'total-display',
            text: '✓ Completed - $1,250,000'
        }));

        const viewReceiptBtn = el('button', {
            classes: 'action-btn',
            html: `${SVG_ICONS.receipt} Receipt`
        });
        actionsDiv.appendChild(viewReceiptBtn);

        const copyMsgBtn = el('button', {
            classes: 'action-btn',
            html: `${SVG_ICONS.paste} Message`
        });
        actionsDiv.appendChild(copyMsgBtn);

        const chatBtn = el('button', {
            classes: 'action-btn',
            html: `${SVG_ICONS.chat} Chat`
        });
        actionsDiv.appendChild(chatBtn);

        const dismissBtn = el('button', {
            classes: 'dismiss-btn',
            html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
        });
        actionsDiv.appendChild(dismissBtn);

        li.appendChild(actionsDiv);
        return li;
    };

    const createDemoStripe = (state) => {
        const stripe = el('div', {
            attributes: { id: DEMO_TRADE_ID + '-stripe' },
            classes: ['stripe-container']
        });

        const calcBtn = createButton(['calculate-button'], SVG_ICONS.calculate, 'Calculate Trade', null);

        const total = el('div', {
            classes: ['total-value-container'],
            text: 'Total Value: $0'
        });

        const receipt = el('div', {
            classes: ['hidden', 'receipt-url-container'],
            html: `${SVG_ICONS.receipt}<span class="button-text">View/Edit Receipt</span>`
        });

        const container = el('div', { classes: ['value-container'], children: [total, receipt] });

        const accept = createButton(['accept-trade-button'], SVG_ICONS.check, 'Accept Trade', null);
        accept.disabled = true;

        stripe.appendChild(calcBtn);
        stripe.appendChild(container);
        stripe.appendChild(accept);

        return stripe;
    };

    const updateDemoStripe = (stripe, state) => {
        if (!stripe) return;

        const total = stripe.querySelector('.total-value-container');
        const receipt = stripe.querySelector('.receipt-url-container');
        const container = stripe.querySelector('.value-container');
        const accept = stripe.querySelector('.accept-trade-button');

        if (!total || !receipt || !container || !accept) return;

        if (state === 'calculated') {
            total.textContent = 'Total Value: $1,250,000';
            total.classList.remove('hidden');
            receipt.classList.remove('hidden');
            container.classList.add('visible');
            stripe.classList.add('expanded');
            accept.disabled = false;
            accept.innerHTML = `${SVG_ICONS.add}<span class="button-text">Add Money</span>`;
            accept.style.background = 'linear-gradient(145deg, #f59e0b, #d97706)';
            accept.style.color = '#000';
        } else if (state === 'receipt-highlight') {
            receipt.style.outline = '2px solid #4a9eff';
            receipt.style.outlineOffset = '2px';
        } else if (state === 'blocked') {
            total.textContent = 'Total Value: $1,250,000';
            receipt.style.outline = '';
            accept.innerHTML = `${SVG_ICONS.add}<span class="button-text">Too Low</span>`;
            accept.style.background = 'linear-gradient(145deg, #dc2626, #b91c1c)';
            accept.style.color = '#fff';
            accept.disabled = true;
        } else if (state === 'ready') {
            total.textContent = 'Total Value: $1,250,000';
            accept.innerHTML = `${SVG_ICONS.check}<span class="button-text">Accept Trade</span>`;
            accept.classList.add('enabled');
            accept.disabled = false;
            accept.style.background = '';
            accept.style.color = '';
        }
    };

    const cleanupDemoElements = () => {
        document.querySelector(`#${DEMO_TRADE_ID}`)?.remove();
        document.querySelector(`#${DEMO_TRADE_ID}-completed`)?.remove();
        document.querySelector(`#${DEMO_TRADE_ID}-stripe`)?.remove();
    };

    const showTutorial = async () => {
        let currentStep = 0;
        let highlight = null;
        let demoTradeRow = null;
        let demoCompletedRow = null;
        let demoStripe = null;

        const popupContainer = el('div', {
            attributes: { id: 'tutorial-popup-container' },
            style: { position: 'fixed', zIndex: '10002', pointerEvents: 'none' }
        });
        document.body.appendChild(popupContainer);

        const overlay = el('div', {
            attributes: { id: 'tutorial-overlay' },
            style: { position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)', zIndex: '10000', display: 'none' }
        });
        document.body.appendChild(overlay);

        const cleanup = () => {
            if (highlight) { highlight.remove(); highlight = null; }
        };

        const fullCleanup = () => {
            cleanup();
            cleanupDemoElements();
            popupContainer.remove();
            overlay.remove();
        };

        const getTradeList = () => document.querySelector('.trades-cont.current:not(.m-bottom10)');

        const executeDemoAction = (action) => {
            if (!action) return;

            const tradeList = getTradeList();

            if (action === 'createTradeRow') {
                if (!demoTradeRow && tradeList) {
                    demoTradeRow = createDemoTradeRow();
                    tradeList.insertBefore(demoTradeRow, tradeList.firstChild);
                }
            }
            else if (action.startsWith('updateStatus:')) {
                const status = action.split(':')[1];
                addDemoStatusBadge(status);
            }
            else if (action === 'showStripe') {
                if (!demoStripe) {
                    demoStripe = createDemoStripe();
                    const insertPoint = tradeList || document.querySelector('.trades-cont');
                    if (insertPoint) {
                        insertPoint.parentNode.insertBefore(demoStripe, insertPoint);
                    }
                }
            }
            else if (action === 'showCalculated') {
                updateDemoStripe(demoStripe, 'calculated');
            }
            else if (action === 'showReceipt') {
                updateDemoStripe(demoStripe, 'receipt-highlight');
            }
            else if (action === 'showAddMoney') {
            }
            else if (action === 'showBlocked') {
                updateDemoStripe(demoStripe, 'blocked');
            }
            else if (action === 'showReady') {
                updateDemoStripe(demoStripe, 'ready');
            }
            else if (action === 'showCompleted') {
                if (demoTradeRow) { demoTradeRow.remove(); demoTradeRow = null; }
                if (demoStripe) { demoStripe.remove(); demoStripe = null; }

                if (tradeList && !demoCompletedRow) {
                    demoCompletedRow = createDemoCompletedRow();
                    tradeList.insertBefore(demoCompletedRow, tradeList.firstChild);
                }
            }
            else if (action === 'cleanup') {
                cleanupDemoElements();
                demoTradeRow = null;
                demoCompletedRow = null;
                demoStripe = null;
            }
        };

        const renderStep = () => {
            cleanup();
            popupContainer.innerHTML = '';

            const step = TUTORIAL_STEPS[currentStep];

            executeDemoAction(step.demoAction);

            let targetEl = step.targetSelector ? document.querySelector(step.targetSelector) : null;

            if (!targetEl) {
                if (step.demoAction === 'createTradeRow' || step.demoAction?.startsWith('updateStatus:')) {
                    targetEl = document.querySelector(`#${DEMO_TRADE_ID}`);
                } else if (step.demoAction?.startsWith('show') && step.demoAction !== 'showCompleted') {
                    targetEl = document.querySelector(`#${DEMO_TRADE_ID}-stripe`);
                } else if (step.demoAction === 'showCompleted') {
                    targetEl = document.querySelector(`#${DEMO_TRADE_ID}-completed`);
                }
            }

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                highlight = el('div', { classes: 'tutorial-highlight' });
                highlight.style.left = `${rect.left - 4}px`;
                highlight.style.top = `${rect.top - 4}px`;
                highlight.style.width = `${rect.width + 8}px`;
                highlight.style.height = `${rect.height + 8}px`;
                document.body.appendChild(highlight);
                overlay.style.display = 'none';
            } else {
                overlay.style.display = 'block';
            }

            const popup = createTutorialPopup(
                step,
                currentStep,
                TUTORIAL_STEPS.length,
                () => {
                    if (currentStep < TUTORIAL_STEPS.length - 1) {
                        currentStep++;
                        renderStep();
                    } else {
                        fullCleanup();
                        tutorialSettings.markCompleted();
                    }
                },
                () => {
                    if (confirm("Are you sure you want to skip the tutorial? Weav3r will be sad if you come to him asking questions this tutorial answers :(")) {
                        fullCleanup();
                        tutorialSettings.markCompleted();
                    }
                }
            );

            popup.style.pointerEvents = 'auto';

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                popup.classList.add('positioned');

                let left = rect.right + 20;
                let top = rect.top;
                if (left + 380 > window.innerWidth) {
                    left = Math.max(20, rect.left);
                    top = rect.bottom + 20;
                }

                top = Math.max(20, Math.min(top, window.innerHeight - 400));
                left = Math.max(20, Math.min(left, window.innerWidth - 380));

                popup.style.left = `${left}px`;
                popup.style.top = `${top}px`;
            } else {
                popup.style.left = '50%';
                popup.style.top = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
            }

            popupContainer.appendChild(popup);
        };

        renderStep();
    };

    const checkAndShowTutorial = async () => {
        const needsTutorial = await tutorialSettings.needsTutorial();
        if (needsTutorial) {
            await sleep(500);
            await showTutorial();
        }
    };

    const handlePageStep = async (step) => {
        const stepHandlers = {
            'view': async () => {
                await waitForElement('.trade-cont.m-top10');
                initStripe();
                autoCalc();
                initMessageObserver();
            },
            'addmoney': async () => {
                await waitForElement('.init-trade.add-money');
                initStripe();
                autoFill();
                initMessageObserver();
            },
            'accept2': async () => {
                await waitForElement('.info-msg-cont.green');
                initStripe();
                initMessageObserver();
            },
            'logview': async () => {
                await waitForElement('.trade-cont.m-top10');
                initLogviewStripe();
                stopMessageObserver();
            }
        };

        const defaultHandler = async () => {
            await waitForElement('.trades-cont, .info-msg-cont');
            ensureTradeListExists();
            displayTradeStates();
            initApiKeyButton();
            initNewTradeCollapsible();
            stopMessageObserver();
        };

        const handler = stepHandlers[step] || defaultHandler;
        await handler();
    };

    const initializeScript = async () => {
        if (!isTradePage) return;

        if (!getStep()) {
            checkAndShowTutorial();
        }

        await handlePageStep(getStep());
    };

    if (isTradePage) {
        initializeScript();
    }

    if (window.requestIdleCallback) {
        requestIdleCallback(() => cleanupOldStates(), { timeout: 5000 });
    } else {
        sleep(100).then(() => cleanupOldStates());
    }

    startTradePolling();

    window.addEventListener('hashchange', async () => {
        if (window.acceptBtnUpdateInterval) {
            clearInterval(window.acceptBtnUpdateInterval);
            window.acceptBtnUpdateInterval = null;
        }

        if (!isTradePage) return;

        await sleep(100);
        await handlePageStep(getStep());
    });

    window.addEventListener('beforeunload', () => {
        stopTradePolling();
        batchedStorage.flush();
    });
})();
