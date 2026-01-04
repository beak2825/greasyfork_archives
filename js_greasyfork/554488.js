// ==UserScript==
// @name         Torn - AFK Market
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Analyze your listings while you are unable to.
// @author       Upsilon [3212478]
// @license      ISC
// @match        https://www.torn.com/profiles.php?XID=*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554488/Torn%20-%20AFK%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/554488/Torn%20-%20AFK%20Market.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class TornItemMarketAnalyzer {
        constructor() {
            this.apiKey = GM_getValue('ups-itemmarket-api-key', '');
            this.data = [];
            this.initialized = false;
            this.setupProfileUI();
        }

        setupProfileUI() {
            const currentProfileId = this.getCurrentProfileId();
            if (!currentProfileId) return;

            const pollInterval = 150;
            const maxWait = 10000;
            let waited = 0;

            const id = setInterval(() => {
                const profileLink = document.querySelector('.settings-menu > .link > a:first-child');
                if (profileLink && profileLink.href) {
                    const m = profileLink.href.match(/XID=(\d+)/);
                    const localId = m ? m[1] : null;
                    if (localId && localId === currentProfileId) {
                        this.createAccordion();
                    } else {
                        console.log('[UpsAfkMarket] Not my profile — skipping accordion.');
                    }
                    clearInterval(id);
                    return;
                }
                waited += pollInterval;
                if (waited >= maxWait) {
                    console.warn('[UpsAfkMarket] Timeout waiting for profile link.');
                    clearInterval(id);
                }
            }, pollInterval);
        }

        getCurrentProfileId() {
            const m = window.location.href.match(/XID=(\d+)/);
            return m ? m[1] : null;
        }

        async refreshData() {
            const resultDiv = document.getElementById('itemmarket-results');
            if (!resultDiv) {
                console.warn('[AFK Market] No result container found for refresh.');
                return;
            }

            resultDiv.innerHTML = '<p>⏳ Refreshing market data...</p>';

            try {
                const items = await this.fetchItemMarket();

                if (!items || !items.length) {
                    resultDiv.innerHTML = '<p>No items found on your market.</p>';
                    return;
                }

                const tableHtml = this.renderTable(items);
                resultDiv.innerHTML = tableHtml;
                this.initialized = true;

                (window.Ups?.showToast?.('✅ Market data refreshed!')) ||
                console.log('[AFK Market] Market data refreshed.');
            } catch (err) {
                console.error('[AFK Market] Refresh error:', err);
                resultDiv.innerHTML = `<p style="color:red;">❌ Error fetching data: ${err.message || err}</p>`;
            }
        }

        createAccordion() {
            if (document.querySelector('#ups-itemmarket-settings')) return;

            const profileWrapper = document.querySelector('.profile-wrapper') || document.querySelector('h4#skip-to-content.left')?.parentElement;
            if (!profileWrapper) return;

            const style = document.createElement('style');
            style.textContent = `
        details.ups-settings-accordion {
          margin: 12px 0 0 0;
          border: 1px solid #2d2d2d;
          border-radius: 8px;
          background: #1e1e1e;
          color: #e9e9e9;
          overflow: hidden;
        }
        details.ups-settings-accordion > summary {
          list-style: none;
          cursor: pointer;
          padding: 10px 14px;
          font-weight: 700;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #242424;
          border-bottom: 1px solid #2d2d2d;
        }
        details.ups-settings-accordion > summary::-webkit-details-marker { display: none; }
        details.ups-settings-accordion > summary:before {
          content: "▸";
          transition: transform .15s ease;
          font-size: 12px;
          opacity: .9;
        }
        details.ups-settings-accordion[open] > summary:before { transform: rotate(90deg); }
        .ups-settings-content {
          padding: 12px 14px 14px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          font-family: Consolas, Menlo, monospace;
        }
        .ups-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .ups-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; }
        .ups-btn.primary { background: #00bcd4; color: #000; }
        .ups-btn.ghost { background: #424242; color: #fff; }
        .ups-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border-radius: 6px;
          overflow: hidden;
        }

        .ups-table th, .ups-table td {
            border: 1px solid #3a3a3a;
            padding: 10px 8px;
            text-align: center;
            color: #f0f0f0;
        }

        .ups-table th {
          background: #2c2c2c;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .ups-table tbody tr:nth-child(odd) {
          background: #242424;
        }

        .ups-table tbody tr:nth-child(even) {
          background: #1e1e1e;
        }

        .ups-table .ups-type-row {
          background: linear-gradient(90deg, #263238 0%, #1e272c 100%) !important;
        }

        .ups-table .ups-type-row:hover {
          background: linear-gradient(90deg, #2f3e44 0%, #263238 100%) !important;
        }

        .ups-table tbody tr:hover {
          background: #333;
          transition: background 0.2s ease;
        }

        .ups-table tbody tr td {
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .ups-total {
          margin-top: 18px;
          font-weight: 700;
          text-align: right;
          border-top: 1px solid #3a3a3a;
          padding-top: 8px;
        }

        .ups-field input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #3a3a3a;
          border-radius: 6px;
          background: #2b2b2b;
          color: #eee;
          outline: none;
        }

        #ups-itemmarket-apiKey {
          filter: blur(4px);
          transition: filter 0.2s ease;
        }

        #ups-itemmarket-apiKey:focus {
          filter: none;
        }

        .ups-type-row {
          font-weight: 700;
          color: #4dd0e1;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .ups-type-row:hover {
          background: linear-gradient(90deg, #2f3e44 0%, #263238 100%);
          color: #80deea;
        }

        .ups-type-row td {
          border-top: 2px solid #3f4a4d;
          border-bottom: 2px solid #3f4a4d;
        }

        .ups-arrow {
          display: inline-block;
          margin-right: 6px;
          transition: transform 0.2s ease;
          font-size: 12px;
          color: #80deea;
        }

        .ups-item-row {
          background: #1b1b1b;
        }

        .ups-item-row:nth-child(odd) {
          background: #202020;
        }

        .ups-item-row td {
          padding-top: 8px;
          padding-bottom: 8px;
        }
      `;
            document.head.appendChild(style);

            const details = document.createElement('details');
            details.className = 'ups-settings-accordion';
            details.id = 'ups-itemmarket-settings';
            details.innerHTML = `
        <summary>💼 Ups - AFK Market</summary>
        <div class="ups-settings-content">
          <div class="ups-field">
            <label>API Key</label>
            <input id="ups-itemmarket-apiKey" type="text" placeholder="Enter API Key...">
          </div>
          <div class="ups-actions">
            <button id="ups-itemmarket-save" class="ups-btn primary" type="button">Save</button>
          </div>
          <div id="ups-itemmarket-results"></div>
        </div>
      `;
            profileWrapper.parentNode.insertBefore(details, profileWrapper.nextSibling);

            const apiInput = document.getElementById('ups-itemmarket-apiKey');
            const saveBtn = document.getElementById('ups-itemmarket-save');
            const resultDiv = document.getElementById('ups-itemmarket-results');

            apiInput.value = this.apiKey;
            const self = this;

            saveBtn.addEventListener('click', async () => {
                const newKey = apiInput.value.trim();
                GM_setValue('ups-itemmarket-api-key', newKey);
                this.apiKey = newKey;
                await this.loadMarketData(resultDiv);
                this.initialized = true;
            });

            details.addEventListener('toggle', async () => {
                if (details.open && !this.initialized) {
                    await this.loadMarketData(resultDiv);
                    this.initialized = true;
                }
            });
        }

        slugifyType(type) {
            return type.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        }

        async fetchItemMarket(link = null) {
            if (!this.apiKey) throw new Error('API Key not configured.');

            const url = link || `https://api.torn.com/v2/user/itemmarket?offset=0&key=${this.apiKey}`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET', url, onload: async (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) return reject(data.error);

                            const currentItems = data.itemmarket || [];

                            // Vérifie s’il y a une page suivante
                            const nextLink = data._metadata?.links?.next;
                            if (nextLink) {
                                const nextItems = await this.fetchItemMarket(nextLink);
                                resolve([...currentItems, ...nextItems]);
                            } else {
                                resolve(currentItems);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    }, onerror: reject,
                });
            });
        }

        attachTypeRowListeners() {
            const rows = document.querySelectorAll('.ups-type-row');
            rows.forEach(row => {
                row.addEventListener('click', () => {
                    const typeSlug = row.dataset.type;
                    const items = document.querySelectorAll(`.ups-item-${CSS.escape(typeSlug)}`);
                    const expanded = row.classList.toggle('expanded');

                    items.forEach(r => {
                        r.style.display = expanded ? 'table-row' : 'none';
                    });

                    const arrow = row.querySelector('.ups-arrow');
                    if (arrow) arrow.style.transform = expanded ? 'rotate(90deg)' : 'rotate(0deg)';
                });
            });
        }

        async loadMarketData(container) {
            container.innerHTML = '<p>⏳ Loading market data...</p>';
            try {
                const items = await this.fetchItemMarket();
                if (!items || !items.length) {
                    container.innerHTML = '<p>No items found on your market.</p>';
                    return;
                }
                const tableHtml = this.renderTable(items);
                container.innerHTML = tableHtml;
            } catch (e) {
                container.innerHTML = `<p style="color:red;">❌ Error: ${e.message || e}</p>`;
            }
        }

        formatNumber(num) {
            if (isNaN(num)) return num;
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        renderTable(rows) {
            const grouped = {};
            for (const r of rows) {
                const type = r.item?.type || 'Unknown';
                if (!grouped[type]) grouped[type] = [];
                grouped[type].push(r);
            }

            const grandTotal = rows.reduce((acc, r) => acc + (r.price * r.amount), 0);

            const tableRows = Object.entries(grouped).map(([type, items]) => {
                const typeTotal = items.reduce((acc, r) => acc + (r.price * r.amount), 0);
                const typeCount = items.length;

                const typeRow = `
  <tr class="ups-type-row" data-type="${this.slugifyType(type)}">
    <td style="text-align: left; padding-left: 32px;"><span class="ups-arrow">▸</span><strong>${type}</strong></td>
    <td>${this.formatNumber(typeCount)}</td>
    <td>—</td>
    <td>$${this.formatNumber(typeTotal)}</td>
  </tr>
`;

                const itemRows = items.map(r => `
      <tr class="ups-item-row ups-item-${this.slugifyType(type)}" style="display:none;">
        <td>${r.item?.name || 'Unknown'}</td>
        <td>${this.formatNumber(r.amount)}</td>
        <td>$${this.formatNumber(r.price)}</td>
        <td>$${this.formatNumber((r.price * r.amount))}</td>
      </tr>
    `).join('');

                return typeRow + itemRows;
            }).join('');

            const table = `
    <table class="ups-table">
      <thead>
        <tr>
          <th>Item / Type</th>
          <th>Quantity</th>
          <th>Price (each)</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="ups-total">💰 Grand Total: ${grandTotal.toLocaleString()} $</div>
  `;

            setTimeout(() => this.attachTypeRowListeners(), 0);
            return table;
        }
    }

    new TornItemMarketAnalyzer();
})();
