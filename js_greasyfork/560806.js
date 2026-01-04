// ==UserScript==
// @name         [TMS] RoboForex Accounts Enhancer
// @namespace    https://greasyfork.org/en/users/30331-setcher
// @version      1.0
// @description  4-tab modal, fixed saving, dark mode toggle works, fixed height, no auto-open
// @author       Setcher
// @match        https://my.roboforex.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560806/%5BTMS%5D%20RoboForex%20Accounts%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560806/%5BTMS%5D%20RoboForex%20Accounts%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaults = {
        dashStrategyPos: 2,
        dashAllocatedPos: 3,
        dashPercentPos: 4,

        tableStrategyPos: 2,
        tableAllocatedPos: 3,
        tablePercentPos: 4,

        balanceFontSize: '',
        balanceDecimals: null,
        removeCurrency: false,

        removeWindows: false,
        removeChrome: false,
        removeAndroid: false,
        removeIOS: false,

        keepInvisiblePlaceholder: true,

        strategyText: ``,
        scrapeTable: false,
        missingDataText: ``,
        modalDarkMode: false
    };

    let settings = {
        dashStrategyPos: parseInt(GM_getValue('dashStrategyPos', defaults.dashStrategyPos)),
        dashAllocatedPos: parseInt(GM_getValue('dashAllocatedPos', defaults.dashAllocatedPos)),
        dashPercentPos: parseInt(GM_getValue('dashPercentPos', defaults.dashPercentPos)),

        tableStrategyPos: parseInt(GM_getValue('tableStrategyPos', defaults.tableStrategyPos)),
        tableAllocatedPos: parseInt(GM_getValue('tableAllocatedPos', defaults.tableAllocatedPos)),
        tablePercentPos: parseInt(GM_getValue('tablePercentPos', defaults.tablePercentPos)),

        balanceFontSize: GM_getValue('balanceFontSize', defaults.balanceFontSize),
        balanceDecimals: GM_getValue('balanceDecimals', defaults.balanceDecimals),
        removeCurrency: GM_getValue('removeCurrency', defaults.removeCurrency),

        removeWindows: GM_getValue('removeWindows', defaults.removeWindows),
        removeChrome: GM_getValue('removeChrome', defaults.removeChrome),
        removeAndroid: GM_getValue('removeAndroid', defaults.removeAndroid),
        removeIOS: GM_getValue('removeIOS', defaults.removeIOS),

        keepInvisiblePlaceholder: GM_getValue('keepInvisiblePlaceholder', defaults.keepInvisiblePlaceholder),

        strategyText: GM_getValue('strategyText', defaults.strategyText),
        scrapeTable: GM_getValue('scrapeTable', defaults.scrapeTable),
        missingDataText: GM_getValue('missingDataText', defaults.missingDataText),
        modalDarkMode: GM_getValue('modalDarkMode', defaults.modalDarkMode)
    };

    function saveSettings() {
        // Map input IDs to settings keys
        const idToKey = {
            'dash-strategy-pos': 'dashStrategyPos',
            'dash-allocated-pos': 'dashAllocatedPos',
            'dash-percent-pos': 'dashPercentPos',
            'table-strategy-pos': 'tableStrategyPos',
            'table-allocated-pos': 'tableAllocatedPos',
            'table-percent-pos': 'tablePercentPos',
            'balance-font-size': 'balanceFontSize',
            'balance-decimals': 'balanceDecimals',
            'remove-currency': 'removeCurrency',
            'remove-windows': 'removeWindows',
            'remove-chrome': 'removeChrome',
            'remove-android': 'removeAndroid',
            'remove-ios': 'removeIOS',
            'keep-invisible': 'keepInvisiblePlaceholder',
            'rf-strategy-text': 'strategyText',
            'scrape-table': 'scrapeTable',
            'rf-missing-text': 'missingDataText',
            'modal-dark-mode': 'modalDarkMode'
        };

        // Get and save each setting
        for (const [id, key] of Object.entries(idToKey)) {
            const el = document.getElementById(id);
            if (!el) continue;

            let value;
            if (el.type === 'checkbox') {
                value = el.checked;
            } else if (el.type === 'number') {
                value = el.value === '' ? defaults[key] : parseInt(el.value);
            } else if (id === 'balance-decimals') {
                value = el.value === '' ? null : parseInt(el.value);
            } else {
                value = el.value;
            }

            GM_setValue(key, value);
        }
    }

    function parseStrategyData(text) {
        const map = {};
        const lines = text.trim().split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            const parts = line.split(/[\s,]+/).filter(p => p.length > 0);
            if (parts.length >= 2) {
                const acc = parts[0].trim().replace(/-/g, '');
                const strategy = parts[1].trim();
                const allocated = parts.length >= 3 ? parseFloat(parts.slice(2).join('').replace(/,/g, '')) : null;
                map[acc] = {strategy, allocated: allocated !== null && !isNaN(allocated) ? allocated : null};
            }
        }
        return map;
    }

    function parseMissingData(text) {
        const map = {};
        const lines = text.trim().split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            const parts = line.split(',');
            if (parts.length >= 5) {
                const acc = parts[0].trim();
                const iconFile = parts[1].trim();
                const balance = parseFloat(parts[4].trim());
                map[acc] = {
                    iconFile: iconFile,
                    group: parts[2].trim(),
                    type: parts[3].trim(),
                    balance: isNaN(balance) ? null : balance
                };
            }
        }
        return map;
    }

    let strategyMap = parseStrategyData(settings.strategyText);
    let missingMap = parseMissingData(settings.missingDataText);

    const baseIconUrl = '/themes/rbforex/images/';

    GM_addStyle(`
        #rf-enhancer-btn {
            position: fixed;
            right: 25px;
            bottom: 80px;
            width: 48px;
            height: 48px;
            background: #0959f6;
            color: white;
            border-radius: 50%;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #rf-enhancer-btn:hover { background: #0870e0; }

        #rf-enhancer-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 2147483646;
        }

        #rf-enhancer-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 660px;
            height: 80vh; /* Fixed height - no more resizing */
            background: white;
            color: black;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 2147483647;
            overflow: hidden;
            font-family: system-ui, -apple-system, Arial, sans-serif;
            font-size: 14px;
            flex-direction: column;
        }
        #rf-enhancer-modal.dark-mode {
            background: #1e1e1e;
            color: #eee;
        }

        #rf-modal-header {
            padding: 12px 20px;
            background: #f5f5f5;
            cursor: move;
            user-select: none;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        #rf-enhancer-modal.dark-mode #rf-modal-header { background: #2d2d2d; }

        .rf-modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
        }
        .rf-modal-close:hover { color: #333; }
        #rf-enhancer-modal.dark-mode .rf-modal-close { color: #ccc; }
        #rf-enhancer-modal.dark-mode .rf-modal-close:hover { color: #fff; }

        .rf-tabs {
            display: flex;
            background: #f0f0f0;
            border-bottom: 1px solid #ddd;
            flex-shrink: 0;
        }
        #rf-enhancer-modal.dark-mode .rf-tabs { background: #2a2a2a; border-bottom-color: #444; }

        .rf-tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 15px;
            font-weight: 500;
        }
        .rf-tab:hover { background: #e0e0e0; }
        #rf-enhancer-modal.dark-mode .rf-tab:hover { background: #333; }
        .rf-tab.active {
            background: white;
            color: #0959f6;
            border-bottom: 3px solid #0959f6;
        }
        #rf-enhancer-modal.dark-mode .rf-tab.active {
            background: #1e1e1e;
            color: #4a9eff;
            border-bottom-color: #4a9eff;
        }

        .rf-tab-contents {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .rf-tab-content {
            display: none;
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .rf-tab-content.active { display: block; }

        .rf-modal-section { margin-bottom: 24px; }
        .rf-modal-section:last-child { margin-bottom: 0; }
        .rf-modal-section h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 600;
            color: #0959f6;
        }
        #rf-enhancer-modal.dark-mode .rf-modal-section h3 { color: #4a9eff; }

        .rf-modal-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .rf-modal-row label { flex: 1; min-width: 220px; font-weight: 500; }
        .rf-modal-row input[type=number], .rf-modal-row input[type=text] {
            width: 120px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;
        }
        #rf-enhancer-modal.dark-mode .rf-modal-row input { background: #333; border-color: #555; color: #eee; }
        .rf-modal-row textarea {
            width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;
            min-height: 140px; resize: vertical; font-family: monospace; font-size: 13px;
        }
        #rf-enhancer-modal.dark-mode .rf-modal-row textarea { background: #333; border-color: #555; color: #eee; }

        .rf-modal-footer {
            padding: 12px 20px;
            background: #f9f9f9;
            border-top: 1px solid #eee;
            text-align: right;
            flex-shrink: 0;
        }
        #rf-enhancer-modal.dark-mode .rf-modal-footer { background: #2d2d2d; border-top-color: #444; }
        .rf-modal-footer button {
            padding: 8px 20px;
            margin-left: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        #rf-cancel-btn { background: #e0e0e0; color: #333; }

        #rf-save-btn { background: #28a745; color: white; }
        #rf-enhancer-modal.dark-mode #rf-save-btn { background: #2e7d32; }
        #rf-save-refresh-btn { background: #0959f6; color: white; }
        #rf-enhancer-modal.dark-mode #rf-cancel-btn { background: #444; color: #eee; }

        .rf-accounts-list-balance.rf-balance-modified { font-size: var(--rf-balance-size) !important; }

        .rf-accounts-list .rf-custom-div {
            flex: 1;
            text-align: center;
            white-space: nowrap;
            min-width: 80px;
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 6px;
            box-sizing: border-box;
        }
        .rf-accounts-list_row .rf-allocated-div { text-align: right !important; }

        .rf-missing-row { opacity: 0.7 !important; background: rgba(255, 255, 0, 0.3) !important; }
        .rf-missing-balance { color: #999 !important; font-style: italic; }

        #rf-toast {
            position: fixed;
            bottom: 20px;
            right: 175px;
            background: rgba(0,0,0,0.88);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2147483647;
            max-width: 340px;
            white-space: pre-wrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        #rf-toast.show { opacity: 1; }
        #rf-toast-close { cursor: pointer; font-weight: bold; font-size: 18px; }
    `);

    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'rf-enhancer-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'RoboForex Accounts Enhancer Settings';
    document.body.appendChild(settingsBtn);

    const overlay = document.createElement('div');
    overlay.id = 'rf-enhancer-overlay';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.id = 'rf-enhancer-modal';
    if (settings.modalDarkMode) modal.classList.add('dark-mode');

    modal.innerHTML = `
        <div id="rf-modal-header">
            Accounts Enhancer Settings (drag to move)
            <button class="rf-modal-close">&times;</button>
        </div>

        <div class="rf-tabs">
            <button class="rf-tab active" data-tab="dashboard">Dashboard</button>
            <button class="rf-tab" data-tab="allaccounts">All Accounts</button>
            <button class="rf-tab" data-tab="data">Data & Strategy</button>
            <button class="rf-tab" data-tab="appearance">Appearance</button>
        </div>

        <div class="rf-tab-contents">
            <div id="dashboard-tab" class="rf-tab-content active">
                <div class="rf-modal-section">
                    <h3>Column Positions</h3>
                    <div class="rf-modal-row"><label>Strategy position</label><input type="number" id="dash-strategy-pos" min="1" value="${settings.dashStrategyPos}"></div>
                    <div class="rf-modal-row"><label>Allocated position</label><input type="number" id="dash-allocated-pos" min="1" value="${settings.dashAllocatedPos}"></div>
                    <div class="rf-modal-row"><label>% position</label><input type="number" id="dash-percent-pos" min="1" value="${settings.dashPercentPos}"></div>
                </div>

                <div class="rf-modal-section">
                    <h3>Balance Column</h3>
                    <div class="rf-modal-row"><label>Font size (e.g. 16px)</label><input type="text" id="balance-font-size" value="${settings.balanceFontSize}"></div>
                    <div class="rf-modal-row"><label>Fixed decimals (empty = auto)</label><input type="number" id="balance-decimals" min="0" placeholder="auto" value="${settings.balanceDecimals === null ? '' : settings.balanceDecimals}"></div>
                    <div class="rf-modal-row"><label>Remove currency (USD)</label><input type="checkbox" id="remove-currency"${settings.removeCurrency ? ' checked' : ''}></div>
                </div>

                <div class="rf-modal-section">
                    <h3>Remove terminal icons</h3>
                    <div class="rf-modal-row">
                        <label>Windows</label><input type="checkbox" id="remove-windows"${settings.removeWindows ? ' checked' : ''}>
                        <label>Chrome</label><input type="checkbox" id="remove-chrome"${settings.removeChrome ? ' checked' : ''}>
                        <label>Android</label><input type="checkbox" id="remove-android"${settings.removeAndroid ? ' checked' : ''}>
                        <label>iOS</label><input type="checkbox" id="remove-ios"${settings.removeIOS ? ' checked' : ''}>
                    </div>
                    <div class="rf-modal-row">
                        <label>Keep invisible placeholder</label><input type="checkbox" id="keep-invisible"${settings.keepInvisiblePlaceholder ? ' checked' : ''}>
                    </div>
                </div>
            </div>

            <div id="allaccounts-tab" class="rf-tab-content">
                <div class="rf-modal-section">
                    <h3>Column Positions (My Accounts table)</h3>
                    <div class="rf-modal-row"><label>Strategy position</label><input type="number" id="table-strategy-pos" min="1" value="${settings.tableStrategyPos}"></div>
                    <div class="rf-modal-row"><label>Allocated position</label><input type="number" id="table-allocated-pos" min="1" value="${settings.tableAllocatedPos}"></div>
                    <div class="rf-modal-row"><label>% position</label><input type="number" id="table-percent-pos" min="1" value="${settings.tablePercentPos}"></div>
                </div>
            </div>

            <div id="data-tab" class="rf-tab-content">
                <div class="rf-modal-section">
                    <h3>Strategy Data</h3>
                    <div class="rf-modal-row"><label>One account per line: account strategy [allocated]</label><textarea id="rf-strategy-text">${settings.strategyText}</textarea></div>
                </div>

                <div class="rf-modal-section">
                    <h3>Missing Accounts</h3>
                    <div class="rf-modal-row"><label>Scrape data on table page</label><input type="checkbox" id="scrape-table"${settings.scrapeTable ? ' checked' : ''}></div>
                    <div class="rf-modal-row"><label>Missing Account Data<br>(acc,icon_filename,group,type,balance)</label><textarea id="rf-missing-text">${settings.missingDataText}</textarea></div>
                </div>
            </div>

            <div id="appearance-tab" class="rf-tab-content">
                <div class="rf-modal-section">
                    <h3>Modal Appearance</h3>
                    <div class="rf-modal-row">
                        <label>Dark mode for this modal</label><input type="checkbox" id="modal-dark-mode"${settings.modalDarkMode ? ' checked' : ''}>
                    </div>
                </div>
            </div>
        </div>

        <div class="rf-modal-footer">
            <button id="rf-cancel-btn">Cancel</button>
            <button id="rf-save-btn">Save</button>
            <button id="rf-save-refresh-btn">Save & Refresh</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Draggable
    const header = modal.querySelector('#rf-modal-header');
    let isDragging = false, dragX = 0, dragY = 0;
    header.addEventListener('mousedown', e => {
        if (e.target.tagName === 'BUTTON') return;
        const rect = modal.getBoundingClientRect();
        dragX = e.clientX - rect.left;
        dragY = e.clientY - rect.top;
        isDragging = true;
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        modal.style.top = (e.clientY - dragY) + 'px';
        modal.style.left = (e.clientX - dragX) + 'px';
        modal.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // Open modal ONLY on button click
    function openModal() {
        overlay.style.display = 'block';
        modal.style.display = 'flex';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
    }
    settingsBtn.addEventListener('click', openModal);

    modal.querySelector('.rf-modal-close').addEventListener('click', () => {
        overlay.style.display = modal.style.display = 'none';
    });
    modal.querySelector('#rf-cancel-btn').addEventListener('click', () => {
        overlay.style.display = modal.style.display = 'none';
    });
    overlay.addEventListener('click', () => {
        overlay.style.display = modal.style.display = 'none';
    });

    // Tab switching
    modal.querySelectorAll('.rf-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            modal.querySelectorAll('.rf-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.rf-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
        });
    });

    // Dark mode live toggle
    modal.querySelector('#modal-dark-mode').addEventListener('change', function() {
        modal.classList.toggle('dark-mode', this.checked);
    });

    // Save button (without refresh)
    modal.querySelector('#rf-save-btn').addEventListener('click', () => {
        saveSettings();
        showToast('Settings saved');
        overlay.style.display = modal.style.display = 'none';
    });

    // Save & Refresh button
    modal.querySelector('#rf-save-refresh-btn').addEventListener('click', () => {
        saveSettings();
        showToast('Settings saved, refreshing...');
        setTimeout(() => location.reload(), 500);
    });

    // Toast function
    function showToast(message) {
        let toast = document.getElementById('rf-toast');
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.id = 'rf-toast';
        toast.innerHTML = `<span>${message}</span><span id="rf-toast-close">×</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        const close = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        };
        toast.querySelector('#rf-toast-close').addEventListener('click', close);
        setTimeout(close, 3000);
    }

    let scrapeTimeout = null;
    function scrapeTableData() {
        clearTimeout(scrapeTimeout);
        scrapeTimeout = setTimeout(() => {
            const scraped = {};
            let currentIconFile = '', currentGroup = '';

            document.querySelectorAll('table.table_accounts tbody tr').forEach(tr => {
                if (tr.classList.contains('count-table-ctype')) {
                    const b = tr.querySelector('b');
                    if (b) {
                        currentGroup = b.textContent.trim();
                        const img = b.querySelector('img.ctype-img');
                        currentIconFile = img ? img.src.split('/').pop() : '';
                    }
                } else {
                    const accLink = tr.querySelector('a.login');
                    if (accLink) {
                        const acc = accLink.textContent.trim();
                        const balCell = tr.querySelector('td[data-th-responsive="Balance"]');
                        const balText = balCell ? balCell.textContent.trim().replace(/,/g, '') : '0';
                        const balance = parseFloat(balText) || 0;
                        const typeSpan = tr.querySelector('span.account-type');
                        const type = typeSpan ? typeSpan.textContent.trim() : '';
                        scraped[acc] = {iconFile: currentIconFile, group: currentGroup, type, balance};
                    }
                }
            });

            if (Object.keys(scraped).length === 0) return;

            const lines = [];
            const updated = [];

            for (const [acc, data] of Object.entries(scraped)) {
                const existing = missingMap[acc];
                if (!existing || existing.balance !== data.balance) {
                    updated.push(acc);
                }
                lines.push(`${acc},${data.iconFile},${data.group},${data.type},${data.balance}`);
            }

            if (updated.length > 0) {
                settings.missingDataText = lines.join('\n');
                GM_setValue('missingDataText', settings.missingDataText);
                missingMap = parseMissingData(settings.missingDataText);
                showToast(updated.map(a => `${a} account updated`).join(',\n'));
            }
        }, 2000);
    }

    function formatNumber(num, fixedDecimals) {
        if (num == null || isNaN(num)) return '?';
        if (fixedDecimals === null) {
            return num % 1 === 0 ? num.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        return num.toLocaleString(undefined, {minimumFractionDigits: fixedDecimals, maximumFractionDigits: fixedDecimals});
    }

    function applyBalanceMods() {
        if (settings.balanceFontSize) {
            document.documentElement.style.setProperty('--rf-balance-size', settings.balanceFontSize);
        }

        document.querySelectorAll('.rf-accounts-list-balance').forEach(cell => {
            if (cell.dataset.rfModified) return;
            let text = cell.textContent.trim();
            if (settings.removeCurrency) text = text.replace(/\s*USD$/i, '').trim();
            const num = parseFloat(text.replace(/,/g, ''));
            if (isNaN(num)) return;
            const formatted = formatNumber(num, settings.balanceDecimals);
            cell.textContent = settings.removeCurrency ? formatted : formatted + ' USD';
            cell.classList.add('rf-balance-modified');
            cell.dataset.rfModified = 'true';
        });
    }

        function enhance(type) {
        const isTable = type === 'table';
        const container = isTable ? document.querySelector('table.table_accounts') : document.querySelector('ul.rf-accounts-list');
        if (!container) return;

        const head = isTable ? container.querySelector('thead tr') : container.querySelector('.rf-accounts-list_head');
        if (!head) return;

        strategyMap = parseStrategyData(settings.strategyText);
        missingMap = parseMissingData(settings.missingDataText);

        const sPos = isTable ? settings.tableStrategyPos - 1 : settings.dashStrategyPos - 1;
        const aPos = isTable ? settings.tableAllocatedPos - 1 : settings.dashAllocatedPos - 1;
        const pPos = isTable ? settings.tablePercentPos - 1 : settings.dashPercentPos - 1;

        const cols = [
            {key: 'strategy', pos: sPos, text: 'Strategy', cls: ''},
            {key: 'allocated', pos: aPos, text: 'Allocated', cls: isTable ? 'rf-allocated-td' : 'rf-allocated-div'},
            {key: 'percent', pos: pPos, text: '%', cls: isTable ? 'rf-percent-td' : 'rf-percent-div'}
        ];

        cols.forEach(c => {
            if (head.querySelector(`[data-col="${c.key}"]`)) return;
            const el = document.createElement(isTable ? 'th' : 'div');
            el.textContent = c.text;
            el.className = isTable ? 'rf-custom-th' : 'rf-custom-div';
            el.dataset.col = c.key;
            const before = head.children[c.pos] || null;
            head.insertBefore(el, before);
        });

        const existingAccs = new Set();
        const rows = isTable
            ? container.querySelectorAll('tbody > tr:not(.count-table-ctype)')
            : container.querySelectorAll('.rf-accounts-list_row');

        rows.forEach(row => {
            const accEl = isTable ? row.querySelector('td.acc_change a.login') : row.querySelector('.rf-accounts-list-acc_number');
            if (!accEl) return;
            const acc = accEl.textContent.trim().split('-')[0].trim();
            existingAccs.add(acc);

            const balEl = isTable ? row.querySelector('td[data-th-responsive="Balance"]') : row.querySelector('.rf-accounts-list-balance');
            if (!balEl) return;
            let balText = balEl.textContent.trim();
            if (settings.removeCurrency) balText = balText.replace(/\s*USD$/i, '');
            const balance = parseFloat(balText.replace(/,/g, '')) || null;

            const data = strategyMap[acc] || {strategy: '—', allocated: null};

            cols.forEach(c => {
                if (row.querySelector(`[data-col="${c.key}"]`)) return;
                let content = '—';
                if (c.key === 'strategy') content = data.strategy || '—';
                if (c.key === 'allocated') content = formatNumber(data.allocated, null);
                if (c.key === 'percent' && balance !== null && data.allocated !== null && data.allocated > 0) {
                    const pct = ((balance - data.allocated) / data.allocated) * 100;
                    const color = pct >= 0 ? '#0b9c00' : '#d40000';
                    content = `<span style="color:${color};">${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%</span>`;
                }

                const el = document.createElement(isTable ? 'td' : 'div');
                el.innerHTML = content;
                el.className = (isTable ? 'rf-custom-td' : 'rf-custom-div') + ' ' + c.cls;
                el.dataset.col = c.key;
                const before = row.children[c.pos] || null;
                row.insertBefore(el, before);
            });
        });

        if (!isTable) {
            for (const [acc, stratData] of Object.entries(strategyMap)) {
                if (existingAccs.has(acc)) continue;

                const missData = missingMap[acc] || {};
                const hasBalance = missData.balance !== null && !isNaN(missData.balance);
                const balance = hasBalance ? missData.balance : null;

                const iconHtml = missData.iconFile ? `<img src="${baseIconUrl}${missData.iconFile}" class="ctype-img" alt="">` : '';
                const group = missData.group || '(Missing / Hidden)';
                const note = hasBalance ? '' : ' (Check All Accounts)';
                const leverage = missData.type ? missData.type.split('/').pop().trim() : '?';

                let balanceHtml = hasBalance
                    ? formatNumber(balance, settings.balanceDecimals) + (settings.removeCurrency ? '' : ' USD')
                    : '?';

                let percentHtml = '—';
                if (hasBalance && stratData.allocated !== null && stratData.allocated > 0) {
                    const pct = ((balance - stratData.allocated) / stratData.allocated) * 100;
                    const color = pct >= 0 ? '#0b9c00' : '#d40000';
                    percentHtml = `<span style="color:${color};">${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%</span>`;
                } else if (!hasBalance) {
                    percentHtml = '?';
                }

                const row = document.createElement('li');
                row.className = 'rf-accounts-list_row uk-flex-space-between rf-missing-row';
                row.innerHTML = `
                    <div class="rf-accounts-list-acc_info">
                        <div class="rf-accounts-list-acc_info-icon">${iconHtml}</div>
                        <div class="rf-accounts-list-acc_info-text">
                            <div class="rf-accounts-list-acc_number">${acc}</div>
                            <div class="rf-accounts-list-acc_type uk-margin-small-bottom">${group}${note}</div>
                        </div>
                    </div>
                    <div class="rf-custom-div" data-col="strategy">${stratData.strategy || '—'}</div>
                    <div class="rf-custom-div rf-allocated-div" data-col="allocated">${formatNumber(stratData.allocated, null)}</div>
                    <div class="rf-accounts-list-balance rf-balance-modified ${hasBalance ? '' : 'rf-missing-balance'}">${balanceHtml}</div>
                    <div class="rf-custom-div rf-percent-div" data-col="percent">${percentHtml}</div>
                    <div class="rf-accounts-list-leverage">${leverage}</div>
                    <div class="rf-accounts-list-terminals uk-text-right"></div>
                    <div class="rf-accounts-list-deposit"></div>
                `;

                cols.forEach(c => {
                    const el = row.querySelector(`[data-col="${c.key}"]`);
                    if (el) {
                        const before = row.children[c.pos] || null;
                        row.insertBefore(el, before);
                    }
                });

                container.appendChild(row);
            }
        }
    }

    function removeIcons() {
        const containers = document.querySelectorAll('.rf-accounts-list-terminals');
        if (containers.length === 0) return;

        const placeholder = document.createElement('span');
        placeholder.style.cssText = 'display:inline-block;width:32px;height:32px;';

        containers.forEach(container => {
            const replace = (el) => {
                if (!el) return;
                if (settings.keepInvisiblePlaceholder) {
                    const ph = placeholder.cloneNode();
                    el.parentNode.replaceChild(ph, el);
                } else {
                    el.remove();
                }
            };

            if (settings.removeWindows) replace(container.querySelector('a[href*="roboforexltd"], a[href$="setup.exe"], a.uk-hidden-small img[src*="windows.svg"]'));
            if (settings.removeChrome) replace(container.querySelector('a[href*="webtrader.roboforex.com"], img[src*="chrome.svg"]'));
            if (settings.removeAndroid) replace(container.querySelector('a[href*="play.google.com"], a.rf-ios-hidden img[src*="playmarket.svg"]'));
            if (settings.removeIOS) replace(container.querySelector('a[href*="apps.apple.com"], a.rf-android-hidden img[src*="appstore.svg"]'));
        });
    }

    function run() {
        setTimeout(() => {
            if (settings.scrapeTable && document.querySelector('table.table_accounts')) {
                scrapeTableData();
            }
            enhance('table');
            enhance('list');
            applyBalanceMods();
            removeIcons();
        }, 100);
    }

    setTimeout(run, 600);

    const observer = new MutationObserver(() => {
        clearTimeout(window.rfTimeout);
        window.rfTimeout = setTimeout(run, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand('Accounts Enhancer Settings', openModal);
})();