// ==UserScript==
// @name         PCPartPicker Budget Helper (International)
// @namespace    https://e-z.bio/pnda
// @version      3.1.0
// @description  A powerful budgeting and helper tool for PCPartPicker (supports localized versions).
// @author       Pnda (https://e-z.bio/pnda)
// @match        https://*.pcpartpicker.com/list/*
// @match        https://*.pcpartpicker.com/products/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcpartpicker.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.currencyfreaks.com
// @license      MIT
// @contributionURL https://e-z.bio/pnda
// @homepageURL  https://e-z.bio/pnda
// @supportURL   https://e-z.bio/pnda
// @compatible firefox Tested on Firefox 142+ with Violentmonkey (and primarily on dk.pcpartpicker.com)
// @downloadURL https://update.greasyfork.org/scripts/548360/PCPartPicker%20Budget%20Helper%20%28International%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548360/PCPartPicker%20Budget%20Helper%20%28International%29.meta.js
// ==/UserScript==

/*
 * ATTRIBUTION & LICENSE
 * 
 * This userscript is a modified version of the original "PCPartPicker Budget Helper"
 * created by KHROTU (https://greasyfork.org/en/users/1465386-khrotu)
 * Original script: https://greasyfork.org/en/scripts/542125-pcpartpicker-budget-helper
 * 
 * The original work is licensed under MIT License.
 * This derivative work and its modifications are also licensed under MIT License.
 * 
 * Key modifications in this fork:
 * - Added support for all localized PCPartPicker versions (*.pcpartpicker.com)
 * - Added automatic currency detection based on region/domain
 * - Added site currency override functionality
 * - Enhanced price parsing for multiple currency formats
 * - Added support for Danish Kroner, Swedish Krona, and other regional currencies
 * 
 * MIT License
 * 
 * Copyright (c) 2024 KHROTU (Original)
 * Copyright (c) 2025 Pnda (https://e-z.bio/pnda) (Modifications)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
  'use strict';

  const App = {
    config: {
      keys: {
        apiKey: 'pcpp_apiKey_v2',
        budgetAmount: 'pcpp_budgetAmount_v2',
        budgetCurrency: 'pcpp_budgetCurrency_v2',
        siteCurrency: 'pcpp_siteCurrency_v2',
        salesTax: 'pcpp_salesTax_v2',
        notes: 'pcpp_notes_v2',
        isCollapsed: 'pcpp_isCollapsed_v2',
        cachedRates: 'pcpp_cachedRates_v2',
        cachedCurrencies: 'pcpp_cachedCurrencies_v2',
        summaryCache: 'pcpp_summaryCache_v2'
      },
      cacheDurations: {
        rates: 4 * 60 * 60 * 1000,
        currencies: 3 * 24 * 60 * 60 * 1000,
      },
      api: {
        baseUrl: 'https://api.currencyfreaks.com/v2.0',
      },
      // Currency mapping for different PCPP regions
      regionCurrencyMap: {
        'pcpartpicker.com': 'USD',
        'au.pcpartpicker.com': 'AUD',
        'be.pcpartpicker.com': 'EUR',
        'ca.pcpartpicker.com': 'CAD',
        'de.pcpartpicker.com': 'EUR',
        'dk.pcpartpicker.com': 'DKK',
        'es.pcpartpicker.com': 'EUR',
        'fr.pcpartpicker.com': 'EUR',
        'in.pcpartpicker.com': 'INR',
        'ie.pcpartpicker.com': 'EUR',
        'it.pcpartpicker.com': 'EUR',
        'nl.pcpartpicker.com': 'EUR',
        'nz.pcpartpicker.com': 'NZD',
        'pl.pcpartpicker.com': 'PLN',
        'se.pcpartpicker.com': 'SEK',
        'uk.pcpartpicker.com': 'GBP',
      },
      // Currency symbol patterns for price detection
      currencyPatterns: {
        'USD': { symbols: ['$'], regex: /\$?([\d,]+\.?\d*)\s*\$?/ },
        'EUR': { symbols: ['€'], regex: /€?([\d,]+\.?\d*)\s*€?/ },
        'GBP': { symbols: ['£'], regex: /£?([\d,]+\.?\d*)\s*£?/ },
        'DKK': { symbols: ['kr'], regex: /([\d,]+\.?\d*)\s*kr/i },
        'SEK': { symbols: ['kr'], regex: /([\d,]+\.?\d*)\s*kr/i },
        'NOK': { symbols: ['kr'], regex: /([\d,]+\.?\d*)\s*kr/i },
        'CAD': { symbols: ['$', 'CAD'], regex: /(?:CAD\s*)?\$?([\d,]+\.?\d*)\s*(?:CAD)?/ },
        'AUD': { symbols: ['$', 'AUD'], regex: /(?:AUD\s*)?\$?([\d,]+\.?\d*)\s*(?:AUD)?/ },
        'PLN': { symbols: ['zł'], regex: /([\d,]+\.?\d*)\s*zł/ },
        'INR': { symbols: ['₹'], regex: /₹?([\d,]+\.?\d*)\s*₹?/ },
        'NZD': { symbols: ['$', 'NZD'], regex: /(?:NZD\s*)?\$?([\d,]+\.?\d*)\s*(?:NZD)?/ },
      }
    },

    state: {
      exchangeRates: null,
      isCollapsed: false,
      currentRemainingBudget: 0,
      isFetching: false,
      detectedCurrency: null,
      localCurrency: null,
    },

    ui: {},

    async init() {
      const isListPage = window.location.pathname.startsWith('/list/');

      this.injectStyles();
      this.injectHtml();
      this.bindUiElements();

      // Detect local currency after UI is ready
      await this.detectLocalCurrency();

      this.state.isCollapsed = await GM_getValue(this.config.keys.isCollapsed, false);
      this.updateCollapseState();
      this.makeDraggable(this.ui.window);

      if (isListPage) {
        await this.initFullMode();
      } else {
        await this.initLiteMode();
      }
    },

    async detectLocalCurrency() {
      // First check if user has set an override
      const siteCurrencyOverride = await GM_getValue(this.config.keys.siteCurrency, 'auto');
      if (siteCurrencyOverride && siteCurrencyOverride !== 'auto') {
        this.state.localCurrency = siteCurrencyOverride;
        this.updateStatus(`Using site currency override: ${siteCurrencyOverride}`, 'info');
        return;
      }

      // Auto-detect from domain
      const hostname = window.location.hostname;
      const domainCurrency = this.config.regionCurrencyMap[hostname];

      if (domainCurrency) {
        this.state.localCurrency = domainCurrency;
        this.updateStatus(`Detected region currency: ${domainCurrency}`, 'info');
        return;
      }

      // Fallback: try to detect from price elements on the page
      const priceElements = document.querySelectorAll('.td__price, .price');
      for (const element of priceElements) {
        const priceText = element.textContent.trim();
        for (const [currency, pattern] of Object.entries(this.config.currencyPatterns)) {
          if (pattern.regex.test(priceText)) {
            this.state.localCurrency = currency;
            this.updateStatus(`Detected currency from prices: ${currency}`, 'info');
            return;
          }
        }
      }

      // Final fallback to USD
      this.state.localCurrency = 'USD';
      this.updateStatus('Using default currency: USD', 'info');
    },

    parsePrice(priceText) {
      if (!priceText) return { amount: 0, currency: this.state.localCurrency };

      // Try to parse with the local currency pattern first
      const localPattern = this.config.currencyPatterns[this.state.localCurrency];
      if (localPattern && localPattern.regex.test(priceText)) {
        const match = priceText.match(localPattern.regex);
        if (match && match[1]) {
          const amount = parseFloat(match[1].replace(/,/g, ''));
          return { amount, currency: this.state.localCurrency };
        }
      }

      // Try other currency patterns
      for (const [currency, pattern] of Object.entries(this.config.currencyPatterns)) {
        if (pattern.regex.test(priceText)) {
          const match = priceText.match(pattern.regex);
          if (match && match[1]) {
            const amount = parseFloat(match[1].replace(/,/g, ''));
            return { amount, currency };
          }
        }
      }

      // Fallback to old method
      const numericValue = parseFloat(priceText.replace(/[^0-9.-]+/g, "")) || 0;
      return { amount: numericValue, currency: this.state.localCurrency };
    },

    async initFullMode() {
      this.bindFullModeEventListeners();
      try {
        await this.populateCurrencies();
        await this.populateSiteCurrencies();
        await this.loadSettings();
        this.updateCurrencyLabel(); // Update UI after currency detection
        await this.updateAllCalculations();
        this.updatePsuCalculator();
        this.updateUpgradeDropdown();
        this.setupMutationObservers();
      } catch (error) {
        console.error("PCPartPicker Budget Helper Error (Full Mode):", error);
        this.updateStatus(`Initialization failed: ${error.message}`, 'error');
      }
    },

    async populateSiteCurrencies() {
      // Clear existing options (except auto-detect)
      const autoOption = this.ui.siteCurrency.querySelector('option[value="auto"]');
      this.ui.siteCurrency.innerHTML = '';
      this.ui.siteCurrency.appendChild(autoOption);

      try {
        const cached = JSON.parse(await GM_getValue(this.config.keys.cachedCurrencies, '{}'));
        const currencies = cached.data || {};
        const commonCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'DKK', 'SEK', 'NOK', 'PLN', 'INR', 'NZD'];

        // Add common currencies first
        commonCurrencies.forEach(code => {
          if (currencies[code] || this.config.currencyPatterns[code]) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${currencies[code] || code}`;
            this.ui.siteCurrency.appendChild(option);
          }
        });

        // Add a separator
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '────────────';
        this.ui.siteCurrency.appendChild(separator);

        // Add all other currencies
        const sortedCodes = Object.keys(currencies).sort().filter(code => !commonCurrencies.includes(code));
        for (const code of sortedCodes) {
          const option = document.createElement('option');
          option.value = code;
          option.textContent = `${code} - ${currencies[code]}`;
          this.ui.siteCurrency.appendChild(option);
        }
      } catch (error) {
        console.warn('Failed to populate site currencies:', error);
      }
    },

    updateCurrencyLabel() {
      // Update the budget label to show actual currency instead of "Local"
      const budgetRows = document.querySelectorAll('.pcpp-budget-row strong');
      budgetRows.forEach(row => {
        if (row.textContent.includes('Budget (Local)')) {
          row.textContent = `Budget (${this.state.localCurrency || 'Local'}):`;
        }
      });
    },

    async initLiteMode() {
      this.bindLiteModeEventListeners();
      this.ui.fieldsetSettings.style.display = 'none';
      this.ui.fieldsetUpgrade.style.display = 'none';
      this.ui.fieldsetPsu.style.display = 'none';
      this.ui.budgetHeader.querySelector('span').textContent = 'Budget Summary';

      this.ui.notes.value = await GM_getValue(this.config.keys.notes, '');

      const summary = JSON.parse(await GM_getValue(this.config.keys.summaryCache, '{}'));

      if (summary.originalBudget) {
        this.ui.displayOriginalBudget.textContent = summary.originalBudget;
        this.ui.displayTotalLocal.textContent = summary.budgetInLocal || summary.budgetInUsd || 'N/A'; // Backward compatibility
        this.ui.displaySpent.textContent = summary.spent;
        this.ui.displayRemaining.textContent = summary.remaining;
        this.ui.displayRemaining.className = summary.remaining.startsWith('-') ? 'pcpp-remaining-negative' : 'pcpp-remaining-positive';
        this.updateStatus('Lite mode. Edit settings on your part list.', 'info');
      } else {
        this.updateStatus('Visit a part list to calculate your budget.', 'info');
      }
    },

    injectStyles() {
      GM_addStyle(`
        :root {
          --bg-dark-1: #1e1e1e; --bg-dark-2: #2c2c2c; --bg-dark-3: #383838;
          --border-color: #555; --text-light: #eee; --text-dark: #1e1e1e;
          --primary: #61afef; --primary-hover: #7ac5ff; --secondary: #4b5263;
          --secondary-hover: #596377; --danger: #e06c75; --danger-hover: #ff848e;
          --warning: #e5c07b; --success: #98c379;
        }
        #pcpp-budget-helper {
          position: fixed; top: 100px; right: 20px; width: 320px;
          background-color: var(--bg-dark-2); border: 1px solid var(--border-color);
          border-radius: 8px; z-index: 9999; color: var(--text-light);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          box-shadow: 0 5px 20px rgba(0,0,0,0.5); font-size: 14px;
          user-select: none; overflow: hidden;
        }
        #pcpp-budget-header {
          padding: 10px 15px; cursor: move; background-color: var(--bg-dark-3);
          border-bottom: 1px solid var(--border-color); font-weight: bold;
          display: flex; justify-content: space-between; align-items: center;
          border-top-left-radius: 8px; border-top-right-radius: 8px;
        }
        #pcpp-collapse-toggle {
          cursor: pointer; font-size: 20px; font-weight: bold; transform: rotate(0deg);
          transition: transform 0.3s ease; line-height: 1; padding: 2px;
        }
        #pcpp-collapse-toggle.collapsed { transform: rotate(180deg); }
        #pcpp-budget-content {
          padding: 15px; max-height: 70vh; overflow-y: auto;
          transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.2s ease;
        }
        #pcpp-budget-content.collapsed {
          max-height: 0; padding-top: 0; padding-bottom: 0; overflow: hidden; opacity: 0;
        }
        #pcpp-budget-helper fieldset {
          border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; margin-bottom: 15px;
        }
        #pcpp-budget-helper legend { padding: 0 5px; font-weight: bold; color: var(--primary); }
        #pcpp-budget-helper label { display: block; margin: 10px 0 5px; }
        #pcpp-budget-helper input, #pcpp-budget-helper select, #pcpp-budget-helper textarea {
          width: 100%; box-sizing: border-box; padding: 8px; background-color: var(--bg-dark-1);
          border: 1px solid var(--border-color); color: var(--text-light); border-radius: 4px;
        }
        #pcpp-budget-helper textarea { resize: vertical; min-height: 60px; }
        #pcpp-budget-helper button {
          width: 100%; padding: 8px 10px; margin-top: 10px; background-color: var(--primary);
          border: none; color: var(--text-dark); font-weight: bold; cursor: pointer;
          border-radius: 4px; transition: background-color 0.2s, opacity 0.2s;
        }
        #pcpp-budget-helper button:hover { background-color: var(--primary-hover); }
        #pcpp-budget-helper button:disabled { opacity: 0.6; cursor: not-allowed; }
        #pcpp-budget-helper button.secondary { background-color: var(--secondary); color: #fff; }
        #pcpp-budget-helper button.secondary:hover { background-color: var(--secondary-hover); }
        #pcpp-budget-helper button.danger { background-color: var(--danger); }
        #pcpp-budget-helper button.danger:hover { background-color: var(--danger-hover); }
        .settings-io-buttons { display: flex; gap: 10px; }
        .pcpp-budget-row { display: flex; justify-content: space-between; align-items: center; margin: 5px 0; }
        .pcpp-budget-row strong { font-weight: normal; }
        .pcpp-budget-row span { font-weight: bold; }
        #pcpp-budget-progress-bar-container {
          width: 100%; background-color: var(--bg-dark-1); border-radius: 4px; border: 1px solid var(--border-color);
          height: 20px; overflow: hidden; margin-top: 10px;
        }
        #pcpp-budget-progress-bar {
          height: 100%; width: 0%; background-color: var(--success);
          border-radius: 4px; transition: width 0.5s ease, background-color 0.5s ease;
          text-align: center; line-height: 20px; color: var(--text-dark);
          font-weight: bold; font-size: 12px; white-space: nowrap;
        }
        .pcpp-remaining-positive { color: var(--success); }
        .pcpp-remaining-negative { color: var(--danger); }
        #pcpp-status-area {
          margin-top: 10px; font-style: italic; color: var(--warning); font-size: 12px;
          min-height: 15px; text-align: center; transition: color 0.3s;
        }
        #pcpp-status-area.error { color: var(--danger); }
        .pcpp-notes-header { display: flex; justify-content: space-between; align-items: center; }
        .pcpp-notes-header button { width: auto; margin-top: 0; padding: 2px 8px; font-size: 12px; }
        #pcpp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: none; align-items: center; justify-content: center; }
        #pcpp-modal-box { background: var(--bg-dark-2); padding: 20px; border-radius: 8px; z-index: 10001; width: 450px; max-width: 90%; }
        #pcpp-modal-box textarea { width: 100%; box-sizing: border-box; height: 120px; margin: 10px 0; }
        #pcpp-modal-box .modal-actions { text-align: right; margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px; }
        #pcpp-modal-box button { width: auto; margin-top: 0; }
      `);
    },

    injectHtml() {
      const uiHtml = `
        <div id="pcpp-budget-helper">
          <div id="pcpp-budget-header">
            <span>Budget Helper</span>
            <span id="pcpp-collapse-toggle">▼</span>
          </div>
          <div id="pcpp-budget-content">
            <fieldset id="pcpp-fieldset-settings">
              <legend>Settings</legend>
              <label for="pcpp-api-key">CurrencyFreaks API Key:</label>
              <input type="password" id="pcpp-api-key" placeholder="Enter your API Key">
              <label for="pcpp-budget-amount">Budget Amount:</label>
              <input type="number" id="pcpp-budget-amount" step="any">
              <label for="pcpp-budget-currency">Currency:</label>
              <select id="pcpp-budget-currency"></select>
              <label for="pcpp-site-currency">Site Currency Override:</label>
              <select id="pcpp-site-currency">
                <option value="auto">Auto-detect from site</option>
              </select>
              <label for="pcpp-sales-tax">Sales Tax (%):</label>
              <input type="number" id="pcpp-sales-tax" step="any" placeholder="e.g., 7.25">
              <button id="pcpp-save-settings">Save & Update</button>
              <div class="settings-io-buttons">
                <button id="pcpp-export-settings" class="secondary">Export</button>
                <button id="pcpp-import-settings" class="secondary">Import</button>
              </div>
              <button id="pcpp-clear-settings" class="danger">Clear All Settings</button>
            </fieldset>

            <fieldset>
              <legend>Summary</legend>
              <div class="pcpp-budget-row"><strong>Your Budget:</strong> <span id="pcpp-display-original-budget">N/A</span>
              </div>
              <div class="pcpp-budget-row"><strong>Budget (Local):</strong> <span id="pcpp-display-total-local">N/A</span></div>
              <div class="pcpp-budget-row"><strong>Spent (incl. tax):</strong> <span id="pcpp-display-spent">N/A</span></div>
              <div class="pcpp-budget-row"><strong>Remaining:</strong> <span id="pcpp-display-remaining">N/A</span></div>
              <div id="pcpp-budget-progress-bar-container">
                <div id="pcpp-budget-progress-bar">0%</div>
              </div>
            </fieldset>

            <fieldset id="pcpp-fieldset-upgrade">
              <legend>Upgrade Calculator</legend>
              <label for="pcpp-upgrade-part-select">If I return this part:</label>
              <select id="pcpp-upgrade-part-select">
                <option value="0">Select a part...</option>
              </select>
              <div class="pcpp-budget-row"><strong>New Part Budget:</strong> <span id="pcpp-display-upgrade-budget">N/A</span>
              </div>
            </fieldset>

            <fieldset id="pcpp-fieldset-psu">
              <legend>PSU Calculator</legend>
              <div class="pcpp-budget-row"><strong>Estimated Wattage:</strong> <span id="pcpp-psu-estimated">N/A</span></div>
              <div class="pcpp-budget-row"><strong>Recommended PSU:</strong> <span id="pcpp-psu-recommended">N/A</span></div>
            </fieldset>

            <fieldset>
              <div class="pcpp-notes-header">
                <legend>Notes / Scratchpad</legend>
                <button id="pcpp-clear-notes" class="secondary">Clear</button>
              </div>
              <textarea id="pcpp-notes" placeholder="e.g., Considering an RTX 4080 Super or RX 7900 XTX..."></textarea>
            </fieldset>
            <div id="pcpp-status-area">Initializing...</div>
          </div>
        </div>
        <div id="pcpp-modal-overlay">
          <div id="pcpp-modal-box">
            <h3 id="pcpp-modal-title"></h3>
            <div id="pcpp-modal-content"></div>
            <div class="modal-actions">
              <button id="pcpp-modal-action-extra"></button>
              <button id="pcpp-modal-action"></button>
              <button id="pcpp-modal-close" class="secondary">Close</button>
            </div>
          </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', uiHtml);
    },

    bindUiElements() {
      const ids = [
        'budget-helper', 'budget-header', 'collapse-toggle', 'budget-content', 'api-key', 'budget-amount',
        'budget-currency', 'site-currency', 'sales-tax', 'save-settings', 'export-settings', 'import-settings',
        'clear-settings', 'display-original-budget', 'display-total-local', 'display-spent',
        'display-remaining', 'budget-progress-bar', 'upgrade-part-select', 'display-upgrade-budget',
        'psu-estimated', 'psu-recommended', 'notes', 'clear-notes', 'status-area',
        'modal-overlay', 'modal-box', 'modal-title', 'modal-content', 'modal-action', 'modal-action-extra', 'modal-close',
        'fieldset-settings', 'fieldset-upgrade', 'fieldset-psu'
      ];
      this.ui.window = document.getElementById('pcpp-budget-helper');
      ids.forEach(id => {
        const camelCaseId = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
        this.ui[camelCaseId] = document.getElementById(`pcpp-${id}`);
      });
    },

    bindEventListeners() {
      this.ui.collapseToggle.addEventListener('click', () => this.toggleCollapse());
      this.ui.modalClose.addEventListener('click', () => this.closeModal());
      this.ui.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.ui.modalOverlay) this.closeModal();
      });
      this.ui.notes.addEventListener('input', this.debounce(() => GM_setValue(this.config.keys.notes, this.ui.notes.value), 500));
      this.ui.clearNotes.addEventListener('click', () => {
        this.ui.notes.value = '';
        GM_setValue(this.config.keys.notes, '');
      });
    },

    bindFullModeEventListeners() {
      this.bindEventListeners();
      this.ui.saveSettings.addEventListener('click', () => this.saveSettings());
      this.ui.clearSettings.addEventListener('click', () => this.clearSettings());
      this.ui.exportSettings.addEventListener('click', () => this.exportSettings());
      this.ui.importSettings.addEventListener('click', () => this.importSettings());
      this.ui.upgradePartSelect.addEventListener('change', () => this.handleUpgradeSelectionChange());
      this.ui.siteCurrency.addEventListener('change', async () => {
        await GM_setValue(this.config.keys.siteCurrency, this.ui.siteCurrency.value);
        await this.detectLocalCurrency();
        this.updateCurrencyLabel();
        await this.updateAllCalculations();
      });
    },

    bindLiteModeEventListeners() {
      this.bindEventListeners();
    },

    toggleCollapse() {
      this.state.isCollapsed = !this.state.isCollapsed;
      this.updateCollapseState();
      GM_setValue(this.config.keys.isCollapsed, this.state.isCollapsed);
    },

    updateCollapseState() {
      this.ui.budgetContent.classList.toggle('collapsed', this.state.isCollapsed);
      this.ui.collapseToggle.classList.toggle('collapsed', this.state.isCollapsed);
      this.ui.collapseToggle.textContent = this.state.isCollapsed ? '▼' : '▲';
    },

    async saveSettings() {
      this.ui.saveSettings.disabled = true;
      this.ui.saveSettings.textContent = 'Saving...';
      try {
        await GM_setValue(this.config.keys.apiKey, this.ui.apiKey.value);
        await GM_setValue(this.config.keys.budgetAmount, this.ui.budgetAmount.value || '0');
        await GM_setValue(this.config.keys.budgetCurrency, this.ui.budgetCurrency.value);
        await GM_setValue(this.config.keys.siteCurrency, this.ui.siteCurrency.value);
        await GM_setValue(this.config.keys.salesTax, this.ui.salesTax.value || '0');

        // If site currency was changed, re-detect and update
        if (this.ui.siteCurrency.value !== await GM_getValue(this.config.keys.siteCurrency, 'auto')) {
          await this.detectLocalCurrency();
          this.updateCurrencyLabel();
        }

        await this.updateStatus('Settings saved.', 'success');
        await this.updateAllCalculations(true);
      } catch (e) {
        await this.updateStatus(`Error saving settings: ${e.message}`, 'error');
      } finally {
        this.ui.saveSettings.disabled = false;
        this.ui.saveSettings.textContent = 'Save & Update';
      }
    },

    async loadSettings() {
      this.ui.apiKey.value = await GM_getValue(this.config.keys.apiKey, '');
      this.ui.budgetAmount.value = await GM_getValue(this.config.keys.budgetAmount, '');
      this.ui.salesTax.value = await GM_getValue(this.config.keys.salesTax, '');
      this.ui.notes.value = await GM_getValue(this.config.keys.notes, '');

      const savedCurrency = await GM_getValue(this.config.keys.budgetCurrency, this.state.localCurrency || 'USD');
      if (this.ui.budgetCurrency.options.length > 0) {
        this.ui.budgetCurrency.value = savedCurrency;
      }

      const savedSiteCurrency = await GM_getValue(this.config.keys.siteCurrency, 'auto');
      if (this.ui.siteCurrency.options.length > 0) {
        this.ui.siteCurrency.value = savedSiteCurrency;
      }
    },

    async clearSettings() {
      if (confirm("Are you sure you want to clear all settings? This cannot be undone.")) {
        for (const key of Object.values(this.config.keys)) {
          await GM_setValue(key, '');
        }
        this.ui.apiKey.value = '';
        this.ui.budgetAmount.value = '';
        this.ui.salesTax.value = '';
        this.ui.notes.value = '';
        this.ui.budgetCurrency.value = 'USD';
        await this.updateStatus('Settings cleared.', 'success');
        await this.updateAllCalculations(true);
      }
    },

    populateCurrencies: () => new Promise(async (resolve, reject) => {
      const { key, cacheDuration } = { key: App.config.keys.cachedCurrencies, cacheDuration: App.config.cacheDurations.currencies };
      const cached = JSON.parse(await GM_getValue(key, '{}'));

      if (cached.data && (Date.now() - cached.timestamp < cacheDuration)) {
        App.buildCurrencyOptions(cached.data);
        return resolve();
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: `${App.config.api.baseUrl}/currency-symbols`,
        onload: (response) => {
          try {
            const data = JSON.parse(response.responseText);
            if (data.currencySymbols) {
              App.buildCurrencyOptions(data.currencySymbols);
              GM_setValue(key, JSON.stringify({ data: data.currencySymbols, timestamp: Date.now() }));
              resolve();
            } else {
              reject(new Error(data.message || "Could not fetch currency list."));
            }
          } catch (e) { reject(new Error("Error parsing currency list.")); }
        },
        onerror: () => reject(new Error("Network error fetching currencies.")),
        ontimeout: () => reject(new Error("Timeout fetching currencies."))
      });
    }),

    buildCurrencyOptions(currencies) {
      this.ui.budgetCurrency.innerHTML = '';
      const sortedCodes = Object.keys(currencies).sort();
      for (const code of sortedCodes) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${currencies[code]}`;
        this.ui.budgetCurrency.appendChild(option);
      }
    },

    fetchRates: (force = false) => new Promise(async (resolve, reject) => {
      if (App.state.isFetching) return reject(new Error("A fetch is already in progress."));

      const { key, cacheDuration } = { key: App.config.keys.cachedRates, cacheDuration: App.config.cacheDurations.rates };
      const cached = JSON.parse(await GM_getValue(key, '{}'));
      const apiKey = await GM_getValue(App.config.keys.apiKey, '');

      if (!force && App.state.exchangeRates) return resolve(App.state.exchangeRates);
      if (!force && cached.data && (Date.now() - cached.timestamp < cacheDuration)) {
        App.state.exchangeRates = cached.data;
        return resolve(cached.data);
      }
      if (!apiKey) return reject(new Error('API key is missing.'));

      App.state.isFetching = true;
      App.updateStatus('Fetching exchange rates...', 'info');
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${App.config.api.baseUrl}/rates/latest?apikey=${apiKey}`,
        onload: (response) => {
          try {
            const data = JSON.parse(response.responseText);
            if (data.rates) {
              App.state.exchangeRates = data.rates;
              GM_setValue(key, JSON.stringify({ data: data.rates, timestamp: Date.now() }));
              App.updateStatus(`Rates updated: ${new Date(data.date).toLocaleTimeString()}`, 'success');
              resolve(data.rates);
            } else {
              reject(new Error(data.message || 'Invalid API response.'));
            }
          } catch (e) { reject(new Error('Error parsing exchange rates.')); }
        },
        onerror: () => reject(new Error('Network error fetching rates.')),
        ontimeout: () => reject(new Error("Timeout fetching rates.")),
        onabort: () => reject(new Error("Request aborted.")),
        finally: () => { App.state.isFetching = false; }
      });
    }),

    async updateAllCalculations(forceRateFetch = false) {
      try {
        await this.fetchRates(forceRateFetch);
      } catch (error) {
        this.updateStatus(error.message, 'error');
      } finally {
        this.updateDisplay();
      }
    },

    async updateDisplay() {
      const budgetAmount = parseFloat(await GM_getValue(this.config.keys.budgetAmount, '0')) || 0;
      const budgetCurrency = await GM_getValue(this.config.keys.budgetCurrency, this.state.localCurrency);
      const taxRate = parseFloat(await GM_getValue(this.config.keys.salesTax, '0')) || 0;
      const totalElement = document.querySelector('.tr__total--final .td__price');

      // Parse the total price using the new price parser
      let baseSpent = 0;
      let spentCurrency = this.state.localCurrency;
      if (totalElement) {
        const parsed = this.parsePrice(totalElement.textContent);
        baseSpent = parsed.amount;
        spentCurrency = parsed.currency;
      }

      const totalSpent = baseSpent * (1 + taxRate / 100);

      this.ui.displayOriginalBudget.textContent = `${this.formatCurrency(budgetAmount, budgetCurrency)}`;
      this.ui.displaySpent.textContent = `${this.formatCurrency(totalSpent, spentCurrency)}`;

      // Convert budget to local currency for comparison
      let budgetInLocal = 0;
      if (budgetCurrency === this.state.localCurrency) {
        budgetInLocal = budgetAmount;
      } else if (this.state.exchangeRates && this.state.exchangeRates[budgetCurrency] && this.state.exchangeRates[this.state.localCurrency]) {
        // Convert: budgetAmount (in budgetCurrency) -> USD -> localCurrency
        const budgetInUsd = budgetCurrency === 'USD' ? budgetAmount : budgetAmount / parseFloat(this.state.exchangeRates[budgetCurrency]);
        budgetInLocal = this.state.localCurrency === 'USD' ? budgetInUsd : budgetInUsd * parseFloat(this.state.exchangeRates[this.state.localCurrency]);
      } else if (budgetAmount > 0) {
        this.updateStatus(`Cannot convert ${budgetCurrency} to ${this.state.localCurrency}. Missing exchange rates.`, 'error');
        budgetInLocal = budgetAmount; // Fallback: assume same currency
      }

      // Convert spent amount to local currency if needed
      let totalSpentInLocal = totalSpent;
      if (spentCurrency !== this.state.localCurrency && this.state.exchangeRates) {
        if (spentCurrency === 'USD') {
          totalSpentInLocal = this.state.localCurrency === 'USD' ? totalSpent : totalSpent * parseFloat(this.state.exchangeRates[this.state.localCurrency]);
        } else if (this.state.localCurrency === 'USD') {
          totalSpentInLocal = totalSpent / parseFloat(this.state.exchangeRates[spentCurrency]);
        } else {
          // Convert: spentCurrency -> USD -> localCurrency
          const spentInUsd = totalSpent / parseFloat(this.state.exchangeRates[spentCurrency]);
          totalSpentInLocal = spentInUsd * parseFloat(this.state.exchangeRates[this.state.localCurrency]);
        }
      }

      this.ui.displayTotalLocal.textContent = budgetInLocal > 0 ? `${this.formatCurrency(budgetInLocal, this.state.localCurrency)}` : 'N/A';
      const remaining = budgetInLocal - totalSpentInLocal;
      this.state.currentRemainingBudget = remaining;
      this.ui.displayRemaining.textContent = `${this.formatCurrency(remaining, this.state.localCurrency)}`;
      this.ui.displayRemaining.className = remaining >= 0 ? 'pcpp-remaining-positive' : 'pcpp-remaining-negative';

      this.handleUpgradeSelectionChange();
      this.updateProgressBar(totalSpentInLocal, budgetInLocal);
      this.saveSummaryToStorage();
    },

    async saveSummaryToStorage() {
      const summary = {
        originalBudget: this.ui.displayOriginalBudget.textContent,
        budgetInLocal: this.ui.displayTotalLocal.textContent,
        spent: this.ui.displaySpent.textContent,
        remaining: this.ui.displayRemaining.textContent,
        localCurrency: this.state.localCurrency,
      };
      await GM_setValue(this.config.keys.summaryCache, JSON.stringify(summary));
    },

    updateProgressBar(spent, total) {
      if (total > 0) {
        const percentage = Math.max(0, Math.min(100, (spent / total) * 100));
        this.ui.budgetProgressBar.style.width = `${percentage}%`;
        this.ui.budgetProgressBar.textContent = `${Math.round(percentage)}%`;
        let barColor = 'var(--success)';
        if (percentage > 90) barColor = 'var(--danger)';
        else if (percentage > 70) barColor = 'var(--warning)';
        this.ui.budgetProgressBar.style.backgroundColor = barColor;
      } else {
        this.ui.budgetProgressBar.style.width = '0%';
        this.ui.budgetProgressBar.textContent = '0%';
        this.ui.budgetProgressBar.style.backgroundColor = 'var(--success)';
      }
    },

    updatePsuCalculator() {
      const wattageElement = document.querySelector('.partlist__keyMetric a');
      if (wattageElement) {
        const text = wattageElement.textContent;
        const match = text.match(/\b(\d+)W\b/);
        if (match && match[1]) {
          const estimatedWattage = parseInt(match[1], 10);
          this.ui.psuEstimated.textContent = `${estimatedWattage}W`;
          const recommended = Math.ceil((estimatedWattage * 1.3) / 50) * 50;
          this.ui.psuRecommended.textContent = `~${recommended}W`;
          return;
        }
      }
      this.ui.psuEstimated.textContent = 'N/A';
      this.ui.psuRecommended.textContent = 'N/A';
    },

    updateUpgradeDropdown() {
      this.ui.upgradePartSelect.innerHTML = '<option value="0|Select a part...">Select a part...</option>';
      const partRows = document.querySelectorAll('.partlist tbody tr.tr__product');
      partRows.forEach(row => {
        const nameEl = row.querySelector('.td__name a');
        const priceEl = row.querySelector('.td__price a');
        const typeEl = row.querySelector('.td__component a');
        if (nameEl && priceEl && typeEl) {
          const parsed = this.parsePrice(priceEl.textContent);
          const price = parsed.amount;
          if (price > 0) {
            const name = nameEl.textContent.trim();
            const type = typeEl.textContent.trim();
            const option = document.createElement('option');
            option.value = `${price}|${type}: ${name}`;
            option.textContent = `${type}: ${name} (${this.formatCurrency(price, parsed.currency)})`;
            this.ui.upgradePartSelect.appendChild(option);
          }
        }
      });
    },

    async handleUpgradeSelectionChange() {
      const [selectedPartPriceStr] = this.ui.upgradePartSelect.value.split('|');
      const selectedPartPrice = parseFloat(selectedPartPriceStr) || 0;

      if (selectedPartPrice > 0) {
        const taxRate = parseFloat(await GM_getValue(this.config.keys.salesTax, '0')) || 0;
        const partPriceWithTax = selectedPartPrice * (1 + taxRate / 100);
        const newBudget = this.state.currentRemainingBudget + partPriceWithTax;
        this.ui.displayUpgradeBudget.textContent = this.formatCurrency(newBudget, this.state.localCurrency);
        this.ui.displayUpgradeBudget.className = newBudget >= 0 ? 'pcpp-remaining-positive' : 'pcpp-remaining-negative';
      } else {
        this.ui.displayUpgradeBudget.textContent = 'N/A';
        this.ui.displayUpgradeBudget.className = '';
      }
    },

    openModal({ title, contentHtml, actionText, onAction, extraActionText, onExtraAction }) {
      this.ui.modalTitle.textContent = title;
      // Use innerHTML only for controlled, safe content
      if (contentHtml && typeof contentHtml === 'string') {
        this.ui.modalContent.innerHTML = contentHtml;
      } else {
        this.ui.modalContent.textContent = contentHtml || '';
      }
      this.ui.modalAction.textContent = actionText;
      this.ui.modalAction.style.display = onAction ? 'block' : 'none';
      this.ui.modalAction.onclick = onAction || null;
      this.ui.modalActionExtra.textContent = extraActionText;
      this.ui.modalActionExtra.style.display = onExtraAction ? 'block' : 'none';
      this.ui.modalActionExtra.onclick = onExtraAction || null;
      this.ui.modalOverlay.style.display = 'flex';
    },

    closeModal() {
      this.ui.modalOverlay.style.display = 'none';
    },

    async exportSettings() {
      const settings = {
        apiKey: await GM_getValue(this.config.keys.apiKey, ''),
        budgetAmount: await GM_getValue(this.config.keys.budgetAmount, ''),
        budgetCurrency: await GM_getValue(this.config.keys.budgetCurrency, 'USD'),
        siteCurrency: await GM_getValue(this.config.keys.siteCurrency, 'auto'),
        salesTax: await GM_getValue(this.config.keys.salesTax, ''),
        notes: await GM_getValue(this.config.keys.notes, '')
      };
      const exportString = btoa(JSON.stringify(settings));
      this.openModal({
        title: "Export Settings",
        contentHtml: `<p>Copy this string to save your settings:</p><textarea id="pcpp-export-textarea" readonly>${exportString}</textarea>`,
        actionText: 'Copy to Clipboard',
        onAction: () => {
          navigator.clipboard.writeText(exportString).then(() => {
            this.ui.modalAction.textContent = 'Copied!';
            setTimeout(() => this.ui.modalAction.textContent = 'Copy to Clipboard', 2000);
          });
        }
      });
    },

    importSettings() {
      this.openModal({
        title: "Import Settings",
        contentHtml: `<p>Paste your settings string below:</p><textarea id="pcpp-import-textarea" placeholder="Paste settings string here..."></textarea>`,
        actionText: "Import",
        onAction: async () => {
          const importString = document.getElementById('pcpp-import-textarea').value.trim();
          if (importString) {
            try {
              const settings = JSON.parse(atob(importString));
              await GM_setValue(this.config.keys.apiKey, settings.apiKey || '');
              await GM_setValue(this.config.keys.budgetAmount, settings.budgetAmount || '');
              await GM_setValue(this.config.keys.budgetCurrency, settings.budgetCurrency || this.state.localCurrency || 'USD');
              await GM_setValue(this.config.keys.siteCurrency, settings.siteCurrency || 'auto');
              await GM_setValue(this.config.keys.salesTax, settings.salesTax || '');
              await GM_setValue(this.config.keys.notes, settings.notes || '');
              await this.loadSettings();
              await this.updateAllCalculations(true);
              this.updateStatus('Settings imported successfully!', 'success');
              this.closeModal();
            } catch (e) {
              alert("Invalid import string. Please check and try again.");
            }
          }
        }
      });
    },

    setupMutationObservers() {
      const observerCallback = this.debounce(() => {
        this.updateDisplay();
        this.updatePsuCalculator();
        this.updateUpgradeDropdown();
      }, 300);

      const targetNode = document.querySelector('.partlist');
      if (targetNode) {
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
      }
    },

    makeDraggable(element) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      const header = this.ui.budgetHeader;

      const dragMouseDown = (e) => {
        if (e.target.id === 'pcpp-collapse-toggle' || e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      };
      const elementDrag = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = `${element.offsetTop - pos2}px`;
        element.style.left = `${element.offsetLeft - pos1}px`;
      };
      const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      header.onmousedown = dragMouseDown;
    },

    updateStatus(message, type = 'info') {
      if (this.ui.statusArea) {
        this.ui.statusArea.textContent = message;
        this.ui.statusArea.className = type;
      } else {
        console.log(`PCPartPicker Budget Helper: ${message}`);
      }
    },

    debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    },

    formatCurrency(value, currencyCode) {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'symbol'
        }).format(value);
      } catch (e) {
        return `${currencyCode} ${value.toFixed(2)}`;
      }
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();