// ==UserScript==
// @name         Auction House Companion
// @namespace    ahcompanion.zero.nao
// @version      0.1
// @description  Intercepts inventory item data and displays historical auction data from AuctionDB.
// @author       nao [2669774]
// @match        https://www.torn.com/amarket.php*
// @grant        GM_xmlhttpRequest
// @connect      rijndael.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/563640/Auction%20House%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/563640/Auction%20House%20Companion.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE = 'https://rijndael.pythonanywhere.com/api/search';

    let state = {
        itemInfo: null,
        results: [],
        sortKey: 'timestamp',
        sortDir: -1, // -1 for DESC, 1 for ASC
    };

    // UI Styles
    const CSS = `
        #ahc-overlay {
            margin-top: 20px;
            width: 100%;
            background: #f4f1ea;
            border: 2px solid #2c2c2c;
            display: flex;
            flex-direction: column;
            font-family: 'Courier New', Courier, monospace;
            color: #2c2c2c;
            overflow: hidden;
            box-sizing: border-box;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        #ahc-header {
            background: #2c2c2c;
            color: #fff;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #2c2c2c;
        }

        #ahc-header h3 {
            margin: 0;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        #ahc-close {
            background: none;
            border: 1px solid #fff;
            color: #fff;
            cursor: pointer;
            padding: 3px 10px;
            font-size: 0.9rem;
            font-weight: bold;
            transition: all 0.2s;
        }

        #ahc-close:hover {
            background: #fff;
            color: #2c2c2c;
        }

        #ahc-content {
            padding: 0;
            flex-grow: 1;
        }

        .ahc-stats-summary {
            padding: 18px 20px;
            font-size: 1rem;
            background: #fff;
            border-bottom: 2px solid #2c2c2c;
            line-height: 1.6;
        }

        .ahc-section-header {
            background: #e6e3da;
            padding: 12px 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.95rem;
            letter-spacing: 1px;
            border-bottom: 2px solid #2c2c2c;
            border-top: 1px solid #2c2c2c;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ahc-section-header.exact {
            background: #dfdacd;
            border-left: 8px solid #2c2c2c;
        }

        .ahc-table-wrapper {
            width: 100%;
            overflow-x: auto;
            border-bottom: 1px solid #2c2c2c;
        }

        .ahc-table {
            width: 100%;
            min-width: 900px;
            border-collapse: collapse;
            font-size: 0.9rem;
            background: #fff;
        }

        .ahc-table th {
            text-align: left;
            border-bottom: 1px solid #2c2c2c;
            padding: 12px 10px;
            text-transform: uppercase;
            background: #fdfdfd;
            font-size: 0.75rem;
            color: #555;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
        }

        .ahc-table th:hover {
            background: #f0f0f0;
            color: #000;
        }

        .ahc-table th.sorted-asc::after { content: " ↑"; }
        .ahc-table th.sorted-desc::after { content: " ↓"; }

        .ahc-table td {
            padding: 10px 10px;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
            white-space: nowrap;
        }

        .ahc-price {
            font-weight: bold;
            color: #000;
        }

        .ahc-bonus-cell {
            font-size: 0.8rem;
            color: #444;
        }

        .ahc-loading {
            text-align: center;
            padding: 40px;
            font-style: italic;
            font-size: 1rem;
        }

        .ahc-no-results {
            text-align: center;
            padding: 30px;
            color: #888;
            font-style: italic;
            font-size: 1rem;
        }

        .ahc-diff {
            font-size: 0.75rem;
            margin-left: 5px;
            font-weight: bold;
        }
        .ahc-diff-pos { color: #27ae60; }
        .ahc-diff-neg { color: #e74c3c; }
        .ahc-diff-neut { color: #888; }

        .badge-exact {
            background: #2c2c2c;
            color: #fff;
            padding: 2px 8px;
            font-size: 0.7rem;
            letter-spacing: 1px;
            font-weight: bold;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = CSS;
    document.head.appendChild(styleElement);

    // Intercept XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', function () {
            if (this._url && this._url.includes('sid=inventory')) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.itemName) {
                        processItemData(response);
                    }
                } catch (e) { }
            }
        });
        return originalSend.apply(this, arguments);
    };

    function processItemData(item) {
        state.itemInfo = {
            name: item.itemName,
            type: item.itemType,
            id: item.itemID,
            armoryID: item.armoryID,
            damage: null,
            accuracy: null,
            quality: null,
            bonuses: []
        };

        if (item.extras) {
            item.extras.forEach(extra => {
                if (extra.title === 'Damage') state.itemInfo.damage = parseFloat(extra.value);
                else if (extra.title === 'Accuracy') state.itemInfo.accuracy = parseFloat(extra.value);
                else if (extra.title === 'Quality') state.itemInfo.quality = parseFloat(extra.value.replace('%', ''));
                else if (extra.title === 'Bonus') {
                    const val = extra.rawValue ? parseFloat(extra.rawValue.replace('%', '')) : null;
                    state.itemInfo.bonuses.push({ name: extra.value, value: val });
                }
            });
        }

        showOverlay();
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { observer.disconnect(); resolve(el); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); reject(new Error('Timeout')); }, timeout);
        });
    }

    async function showOverlay() {
        try {
            const selector = `span[armoury="${state.itemInfo.armoryID}"]`;
            const itemSpan = await waitForElement(selector);
            const container = itemSpan.closest('li');
            if (!container) return;

            let overlay = document.getElementById('ahc-overlay');
            if (overlay) overlay.remove();

            overlay = document.createElement('div');
            overlay.id = 'ahc-overlay';
            overlay.innerHTML = `
                <div id="ahc-header">
                    <h3>Ledger: ${state.itemInfo.name}</h3>
                    <button id="ahc-close">X</button>
                </div>
                <div id="ahc-content">
                    <div class="ahc-loading">Processing archive...</div>
                </div>
            `;
            container.appendChild(overlay);
            document.getElementById('ahc-close').onclick = () => overlay.remove();

            fetchHistoricalData();
        } catch (e) {
            console.error('AuctionDB:', e);
        }
    }

    function fetchHistoricalData() {
        const params = new URLSearchParams();
        const info = state.itemInfo;
        params.append('item_name', info.name);
        if (info.damage) {
            params.append('damage_min', (info.damage - 0.50).toFixed(2));
            params.append('damage_max', (info.damage + 0.50).toFixed(2));
        }
        if (info.accuracy) {
            params.append('accuracy_min', (info.accuracy - 0.50).toFixed(2));
            params.append('accuracy_max', (info.accuracy + 0.50).toFixed(2));
        }
        if (info.quality) {
            params.append('quality_min', (info.quality - 5.0).toFixed(2));
            params.append('quality_max', (info.quality + 5.0).toFixed(2));
        }
        if (info.bonuses.length > 0) {
            params.append('bonus1_title', info.bonuses[0].name);
            if (info.bonuses[0].value) {
                params.append('bonus1_value_min', (info.bonuses[0].value - 3.0).toFixed(2));
                params.append('bonus1_value_max', (info.bonuses[0].value + 3.0).toFixed(2));
            }
            if (info.bonuses.length > 1) {
                params.append('bonus2_title', info.bonuses[1].name);
                if (info.bonuses[1].value) {
                    params.append('bonus2_value_min', (info.bonuses[1].value - 3.0).toFixed(2));
                    params.append('bonus2_value_max', (info.bonuses[1].value + 3.0).toFixed(2));
                }
            }
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_BASE}?${params.toString()}`,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    state.results = data.success ? data.data : [];
                    renderContent();
                } catch (e) {
                    document.getElementById('ahc-content').innerHTML = `<div class="ahc-no-results">Error: ${e.message}</div>`;
                }
            }
        });
    }

    function isExactMatch(row, target) {
        const eps = 0.015;
        const dMatch = !target.damage || Math.abs(row.item_damage - target.damage) < eps;
        const aMatch = !target.accuracy || Math.abs(row.item_accuracy - target.accuracy) < eps;
        const qMatch = !target.quality || Math.abs(row.item_quality - target.quality) < eps;
        let bMatch = true;
        if (target.bonuses.length > 0) {
            if (target.bonuses[0].value && Math.abs(row.bonus1_value - target.bonuses[0].value) > eps) bMatch = false;
            if (target.bonuses.length > 1 && target.bonuses[1].value && Math.abs(row.bonus2_value - target.bonuses[1].value) > eps) bMatch = false;
        }
        return dMatch && aMatch && qMatch && bMatch;
    }

    function renderContent() {
        const content = document.getElementById('ahc-content');
        if (state.results.length === 0) {
            content.innerHTML = `<div class="ahc-no-results">No historical matches found.</div>`;
            return;
        }

        // Sort data
        const sorted = [...state.results].sort((a, b) => {
            let valA = a[state.sortKey];
            let valB = b[state.sortKey];
            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * state.sortDir;
            }
            return (valA - valB) * state.sortDir;
        });

        const exact = sorted.filter(r => isExactMatch(r, state.itemInfo)).slice(0, 10);
        const close = sorted.filter(r => !isExactMatch(r, state.itemInfo)).slice(0, 10);

        let html = `
            <div class="ahc-stats-summary">
               <strong>TARGET:</strong> DMG ${state.itemInfo.damage || '-'} / ACC ${state.itemInfo.accuracy || '-'} / Q ${state.itemInfo.quality || '-'}%
               | ${state.itemInfo.bonuses.map(b => `${b.name} ${b.value || ''}`).join(', ')}
            </div>
            ${generateTableHTML(exact, 'Exact Matches', 'exact')}
            ${generateTableHTML(close, 'Close Market Proxies', 'close')}
        `;
        content.innerHTML = html;

        // Attach listeners
        content.querySelectorAll('th[data-sort]').forEach(th => {
            th.onclick = () => {
                const key = th.getAttribute('data-sort');
                if (state.sortKey === key) {
                    state.sortDir *= -1;
                } else {
                    state.sortKey = key;
                    state.sortDir = 1;
                }
                renderContent();
            };
            if (state.sortKey === th.getAttribute('data-sort')) {
                th.classList.add(state.sortDir === 1 ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }

    function generateTableHTML(rows, title, typeClass) {
        if (rows.length === 0) return '';

        const formatDiff = (val, target) => {
            if (val == null || target == null) return '';
            const diff = val - target;
            const roundedDiff = parseFloat(diff.toFixed(1));

            if (roundedDiff === 0) {
                return `<span class="ahc-diff ahc-diff-neut">0.0</span>`;
            }

            const cls = roundedDiff > 0 ? 'ahc-diff-pos' : 'ahc-diff-neg';
            const sign = roundedDiff > 0 ? '+' : '';
            return `<span class="ahc-diff ${cls}">${sign}${roundedDiff.toFixed(1)}</span>`;
        };

        const formatPrice = (num) => {
            if (num == null) return '-';
            if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
            return num.toLocaleString();
        };

        const getTargetBonusVal = (name) => {
            const b = state.itemInfo.bonuses.find(x => x.name === name);
            return b ? b.value : null;
        };

        return `
            <div class="ahc-section-header ${typeClass}">
                <span>${title}</span>
                ${typeClass === 'exact' ? '<span class="badge-exact">PERFECT</span>' : ''}
            </div>
            <div class="ahc-table-wrapper">
                <table class="ahc-table">
                    <colgroup>
                        <col style="width: 10%"> <!-- Price -->
                        <col style="width: 8%">  <!-- Dmg -->
                        <col style="width: 8%">  <!-- Acc -->
                        <col style="width: 8%">  <!-- Qual -->
                        <col style="width: 14%"> <!-- B1 -->
                        <col style="width: 8%">  <!-- V1 -->
                        <col style="width: 14%"> <!-- B2 -->
                        <col style="width: 8%">  <!-- V2 -->
                        <col style="width: 11%"> <!-- Seller -->
                        <col style="width: 11%"> <!-- Date -->
                    </colgroup>
                <thead>
                    <tr>
                        <th data-sort="price">Price</th>
                        <th data-sort="item_damage">Dmg</th>
                        <th data-sort="item_accuracy">Acc</th>
                        <th data-sort="item_quality">Q%</th>
                        <th data-sort="bonus1_title">B1</th>
                        <th data-sort="bonus1_value">V1</th>
                        <th data-sort="bonus2_title">B2</th>
                        <th data-sort="bonus2_value">V2</th>
                        <th data-sort="seller_name">Seller</th>
                        <th data-sort="timestamp">Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            <td class="ahc-price">${r.price != null ? '$' + formatPrice(r.price) : '-'}</td>
                            <td>${r.item_damage != null ? r.item_damage.toFixed(1) : '-'}${formatDiff(r.item_damage, state.itemInfo.damage)}</td>
                            <td>${r.item_accuracy != null ? r.item_accuracy.toFixed(1) : '-'}${formatDiff(r.item_accuracy, state.itemInfo.accuracy)}</td>
                            <td>${r.item_quality != null ? r.item_quality.toFixed(1) : '-'}${formatDiff(r.item_quality, state.itemInfo.quality)}</td>
                            <td class="ahc-bonus-cell">${r.bonus1_title || '-'}</td>
                            <td>${r.bonus1_value != null ? r.bonus1_value : '-'}${formatDiff(r.bonus1_value, getTargetBonusVal(r.bonus1_title))}</td>
                            <td class="ahc-bonus-cell">${r.bonus2_title || '-'}</td>
                            <td>${r.bonus2_value != null ? r.bonus2_value : '-'}${formatDiff(r.bonus2_value, getTargetBonusVal(r.bonus2_title))}</td>
                            <td>${r.seller_name || r.seller_id || '-'}</td>
                            <td>${r.timestamp ? new Date(r.timestamp * 1000).toISOString().split('T')[0] : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
                </table>
            </div>
        `;
    }

})();