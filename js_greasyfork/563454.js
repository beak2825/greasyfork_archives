// ==UserScript==
// @name         AN Company Manager (Full v1.6)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Complete Company Manager with fixed white text in tables
// @author       ANITABURN
// @match        https://www.torn.com/companies.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/563454/AN%20Company%20Manager%20%28Full%20v16%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563454/AN%20Company%20Manager%20%28Full%20v16%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        #anCompanyManager { margin: 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #anCompanyManager.minimized .acm-content { display: none; }
        .acm-header { background: #666; padding: 10px 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; border-radius: 5px 5px 0 0; }
        .acm-title { font-weight: 600; font-size: 14px; color: #fff; }
        .acm-controls { display: flex; gap: 6px; }
        .acm-btn { background: #68acff; border: none; color: #fff; width: 24px; height: 24px; border-radius: 3px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .acm-btn:hover { background: #e168ff; }
        .acm-content { color: #fff; background: #333; border-radius: 0 0 5px 5px; position: relative; }
        .acm-section { padding: 12px; border-bottom: 1px solid #666; }
        .acm-section:last-child { border-bottom: none; }
        .acm-section-title { font-size: 12px; font-weight: 600; margin-bottom: 10px; color: #fff; display: flex; justify-content: space-between; align-items: center; }
        .acm-tabs { display: flex; background: #333; border-radius: 4px; padding: 3px; margin-bottom: 12px; gap: 3px; }
        .acm-tab { flex: 1; padding: 6px 10px; background: #666; border: none; color: #fff; cursor: pointer; border-radius: 3px; font-size: 11px; transition: all 0.2s; }
        .acm-tab.active { background: #68acff; }
        .acm-tab:hover:not(.active) { background: #e168ff; }
        .acm-input-group { margin-bottom: 10px; }
        .acm-label { display: block; font-size: 11px; color: #fff; margin-bottom: 4px; }
        .acm-input { width: 100%; background: #666; border: 1px solid #666; color: #fff; padding: 6px 10px; border-radius: 3px; font-size: 12px; box-sizing: border-box; }
        .acm-input:focus { outline: none; border-color: #68acff; }
        .acm-button { width: 100%; background: #68acff; border: none; color: #fff; padding: 8px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
        .acm-button:hover { background: #e168ff; }
        .acm-button.danger { background: #ff6868; }
        .acm-button.danger:hover { background: #ff4444; }
        .acm-button:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Stats & Rows */
        .acm-stat-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; border-bottom: 1px solid #555; }
        .acm-stat-row:last-child { border-bottom: none; }
        .acm-stat-label { color: #ddd; }
        .acm-stat-value { font-weight: 600; color: #fff; }
        .acm-alert { padding: 8px; border-radius: 3px; margin: 6px 0; font-size: 11px; display: flex; align-items: flex-start; gap: 6px; background: #666; color: #fff; }
        .acm-alert-icon { font-size: 14px; line-height: 1; }

        /* Stock Specifics */
        .acm-stock-item { background: #666; padding: 6px; margin: 4px 0; border-radius: 3px; font-size: 11px; }
        .acm-stock-header { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .acm-stock-name { font-weight: 600; color: #fff; font-size: 11px; }
        .acm-stock-days { font-size: 10px; color: #fff; }
        .acm-stock-bar { height: 3px; background: #333; border-radius: 2px; overflow: hidden; margin-top: 3px; }
        .acm-stock-bar-fill { height: 100%; background: #68acff; transition: width 0.3s; }

        /* Loaders & Bars */
        .acm-loading { text-align: center; padding: 15px; color: #fff; font-size: 12px; }
        .acm-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #666; border-top-color: #68acff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .acm-progress-bar { background: #666; height: 16px; border-radius: 8px; overflow: hidden; margin: 6px 0; }
        .acm-progress-fill { height: 100%; background: #68acff; transition: width 0.3s; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #fff; }

        /* Action Items */
        .acm-action-item { background: #666; padding: 8px; margin: 5px 0; border-radius: 3px; font-size: 11px; display: flex; align-items: center; gap: 8px; color: #fff; }
        .acm-action-icon { font-size: 16px; }
        .acm-action-text { flex: 1; }

        /* Collapsible Headers */
        .acm-position-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #4a4a4a; cursor: pointer; border-radius: 3px; margin-top: 8px; user-select: none; }
        .acm-position-header:hover { background: #5a5a5a; }
        .acm-position-title { font-weight: 600; color: #68acff; font-size: 12px; }
        .acm-arrow { font-size: 10px; color: #fff; transition: transform 0.2s; }
        .acm-position-header.collapsed .acm-arrow { transform: rotate(-90deg); }
        .acm-position-list { background: #3a3a3a; padding: 5px 10px; border-radius: 0 0 3px 3px; display: block; }
        .acm-position-list.collapsed { display: none; }

        /* Trains Tab - NEW TABLE LAYOUT */
        .acm-train-settings { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end; }

        .acm-ledger-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 5px; }
        .acm-ledger-table th { text-align: left; padding: 10px 8px; color: #68acff; border-bottom: 2px solid #555; background: #3e3e3e; }

        /* FIX: Ensure table text is WHITE */
        .acm-ledger-table td { padding: 8px; border-bottom: 1px solid #4a4a4a; vertical-align: middle; color: #fff; }

        .acm-ledger-table tbody tr:nth-child(even) { background-color: #383838; }
        .acm-ledger-table tbody tr:hover { background-color: #444; }

        .col-name { text-align: left; width: 40%; }
        .col-stat { text-align: center; width: 15%; }
        .col-owed { text-align: right; width: 20%; font-weight: 600; padding-right: 15px !important; }
        .col-act  { text-align: right; width: 10%; }

        .train-debt { color: #ff6868; }
        .train-ok { color: #68ff8a; }

        /* Modal Styles */
        .acm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
        .acm-modal-overlay.open { opacity: 1; pointer-events: auto; }
        .acm-modal { background: #333; width: 500px; max-width: 90%; max-height: 80vh; border-radius: 5px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
        .acm-modal-header { padding: 10px 15px; background: #444; border-bottom: 1px solid #555; display: flex; justify-content: space-between; align-items: center; }
        .acm-modal-title { font-weight: 600; color: #fff; }
        .acm-modal-close { background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; }
        .acm-modal-close:hover { color: #fff; }
        .acm-modal-body { padding: 15px; overflow-y: auto; flex: 1; }
        .acm-modal-footer { padding: 10px 15px; background: #444; border-top: 1px solid #555; display: flex; justify-content: flex-end; gap: 10px; }

        .acm-history-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; }
        .acm-history-table th { text-align: left; padding: 6px; background: #555; color: #fff; }
        .acm-history-table td { padding: 6px; border-bottom: 1px solid #444; color: #ddd; }
        .acm-history-table tr:hover td { background: #444; }
        .acm-badge { padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; }
        .badge-train { background: rgba(104, 172, 255, 0.2); color: #68acff; }
        .badge-pay { background: rgba(104, 255, 138, 0.2); color: #68ff8a; }
        .acm-delete-btn { color: #ff6868; background: none; border: none; cursor: pointer; font-size: 14px; }
        .acm-delete-btn:hover { color: #ff4444; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    class ANCompanyManager {
        constructor() {
            this.apiKey = GM_getValue('tornApiKey', '');
            this.currentTab = 'dashboard';
            this.companyData = null;
            this.isMinimized = GM_getValue('isMinimized', false);
            this.modalEmployee = null;

            this.trainsData = GM_getValue('trainsData_v1_3', {
                price: 250000,
                history: {}
            });

            this.init();
        }

        init() {
            this.createUI();
            this.createModal();
            this.attachEventListeners();

            if (this.apiKey) {
                this.loadAllData();
                setInterval(() => this.loadAllData(), 5 * 60 * 1000);
            }
        }

        saveTrainsData() {
            GM_setValue('trainsData_v1_3', this.trainsData);
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'anCompanyManager';
            if (this.isMinimized) {
                container.classList.add('minimized');
            }

            container.innerHTML = `
                <div class="acm-header">
                    <div class="acm-title">⚡ AN Company Manager</div>
                    <div class="acm-controls">
                        <button class="acm-btn" id="acmRefresh" title="Refresh Data">↻</button>
                        <button class="acm-btn" id="acmMinimize" title="Minimize">${this.isMinimized ? '+' : '−'}</button>
                    </div>
                </div>
                <div class="acm-content">
                    <div class="acm-section">
                        <div class="acm-tabs">
                            <button class="acm-tab active" data-tab="dashboard">Dashboard</button>
                            <button class="acm-tab" data-tab="employees">Employees</button>
                            <button class="acm-tab" data-tab="stock">Stock</button>
                            <button class="acm-tab" data-tab="trains">Trains</button>
                            <button class="acm-tab" data-tab="intel">Intel</button>
                        </div>
                    </div>
                    <div id="acmTabContent"></div>
                </div>
            `;

            const manageCompanyTitle = Array.from(document.querySelectorAll('.title-black')).find(el =>
                el.textContent.trim() === 'Manage Company'
            );

            if (manageCompanyTitle) {
                manageCompanyTitle.parentNode.insertBefore(container, manageCompanyTitle);
            } else {
                const manageDiv = document.querySelector('.manage-company');
                if (manageDiv) {
                    manageDiv.parentNode.insertBefore(container, manageDiv);
                }
            }

            this.container = container;
            this.renderCurrentTab();
        }

        createModal() {
            const modal = document.createElement('div');
            modal.className = 'acm-modal-overlay';
            modal.innerHTML = `
                <div class="acm-modal">
                    <div class="acm-modal-header">
                        <span class="acm-modal-title" id="acmModalTitle">Manage Employee</span>
                        <button class="acm-modal-close" id="acmModalClose">&times;</button>
                    </div>
                    <div class="acm-modal-body" id="acmModalBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modal = modal;

            document.getElementById('acmModalClose').addEventListener('click', () => this.closeModal());
            modal.addEventListener('click', (e) => { if (e.target === modal) this.closeModal(); });
        }

        openModal(employeeId) {
            this.modalEmployee = employeeId;
            const empName = this.companyData.company_employees[employeeId]?.name || 'Unknown Employee';
            document.getElementById('acmModalTitle').textContent = `Manage: ${empName}`;
            this.renderModalContent();
            this.modal.classList.add('open');
        }

        closeModal() {
            this.modal.classList.remove('open');
            this.modalEmployee = null;
        }

        renderModalContent() {
            const id = this.modalEmployee;
            const history = this.trainsData.history[id] || [];
            history.sort((a, b) => b.timestamp - a.timestamp);
            const today = new Date().toISOString().split('T')[0];

            let html = `
                <div class="acm-input-group">
                    <label class="acm-label">Action Type</label>
                    <div style="display:flex; gap:10px;">
                        <button class="acm-button" id="acmActionTrain" style="flex:1;">Give Trains</button>
                        <button class="acm-button" id="acmActionPay" style="flex:1; background:#444;">Record Payment</button>
                    </div>
                    <input type="hidden" id="acmActionType" value="train">
                </div>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <div class="acm-input-group" style="flex:1">
                        <label class="acm-label">Date</label>
                        <input type="date" class="acm-input" id="acmInputDate" value="${today}">
                    </div>
                    <div class="acm-input-group" style="flex:1">
                        <label class="acm-label">Amount</label>
                        <input type="number" class="acm-input" id="acmInputAmount" placeholder="0" min="1">
                    </div>
                </div>
                <button class="acm-button" id="acmSaveTransaction">Save Entry</button>
                <div style="margin-top: 20px; border-top: 1px solid #555; padding-top: 10px;">
                    <div class="acm-section-title">Transaction History</div>
                    <table class="acm-history-table">
                        <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Value</th><th></th></tr></thead>
                        <tbody>
                            ${history.length > 0 ? history.map(h => `
                                <tr>
                                    <td>${h.date}</td>
                                    <td><span class="acm-badge ${h.type === 'train' ? 'badge-train' : 'badge-pay'}">${h.type.toUpperCase()}</span></td>
                                    <td>${h.amount}</td>
                                    <td>${h.type === 'train' ? '-$' : '+$'}${this.formatNumber(h.amount * h.value)}</td>
                                    <td style="text-align:right;"><button class="acm-delete-btn" data-entry-id="${h.id}" title="Delete">&times;</button></td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" style="text-align:center; color:#888;">No history recorded</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
            document.getElementById('acmModalBody').innerHTML = html;

            const typeInput = document.getElementById('acmActionType');
            const btnTrain = document.getElementById('acmActionTrain');
            const btnPay = document.getElementById('acmActionPay');

            btnTrain.addEventListener('click', () => {
                typeInput.value = 'train';
                btnTrain.style.background = '#68acff';
                btnPay.style.background = '#444';
                btnPay.style.color = '#fff';
            });

            btnPay.addEventListener('click', () => {
                typeInput.value = 'payment';
                btnPay.style.background = '#68ff8a';
                btnPay.style.color = '#333';
                btnTrain.style.background = '#444';
            });

            document.getElementById('acmSaveTransaction').addEventListener('click', () => this.saveTransaction());

            document.querySelectorAll('.acm-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.deleteTransaction(parseFloat(e.target.dataset.entryId));
                });
            });
        }

        saveTransaction() {
            const type = document.getElementById('acmActionType').value;
            const date = document.getElementById('acmInputDate').value;
            const amount = parseInt(document.getElementById('acmInputAmount').value);

            if (!amount || amount <= 0) return alert('Please enter a valid amount');

            const id = this.modalEmployee;
            if (!this.trainsData.history[id]) this.trainsData.history[id] = [];

            this.trainsData.history[id].push({
                id: Date.now(),
                date: date,
                type: type,
                amount: amount,
                value: this.trainsData.price,
                timestamp: Date.now()
            });

            this.saveTrainsData();
            this.renderModalContent();
            this.renderCurrentTab();
        }

        deleteTransaction(entryId) {
            const id = this.modalEmployee;
            if (confirm('Are you sure you want to delete this entry?')) {
                this.trainsData.history[id] = this.trainsData.history[id].filter(h => h.id !== entryId);
                this.saveTrainsData();
                this.renderModalContent();
                this.renderCurrentTab();
            }
        }

        attachEventListeners() {
            document.getElementById('acmMinimize').addEventListener('click', (e) => { e.stopPropagation(); this.toggleMinimize(); });
            document.getElementById('acmRefresh').addEventListener('click', (e) => { e.stopPropagation(); this.loadAllData(); });
            this.container.querySelector('.acm-header').addEventListener('click', (e) => {
                if (!e.target.classList.contains('acm-btn') && e.target.id !== 'acmRefresh' && e.target.id !== 'acmMinimize') {
                    this.toggleMinimize();
                }
            });
            this.container.querySelectorAll('.acm-tab').forEach(tab => {
                tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
            });
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.container.classList.toggle('minimized', this.isMinimized);
            document.getElementById('acmMinimize').textContent = this.isMinimized ? '+' : '−';
            GM_setValue('isMinimized', this.isMinimized);
        }

        switchTab(tab) {
            this.currentTab = tab;
            this.container.querySelectorAll('.acm-tab').forEach(t => t.classList.remove('active'));
            this.container.querySelector(`[data-tab="${tab}"]`).classList.add('active');
            this.renderCurrentTab();
        }

        renderCurrentTab() {
            const content = document.getElementById('acmTabContent');
            switch(this.currentTab) {
                case 'dashboard': content.innerHTML = this.renderDashboard(); break;
                case 'employees': content.innerHTML = this.renderEmployees(); break;
                case 'stock': content.innerHTML = this.renderStock(); break;
                case 'trains': content.innerHTML = this.renderTrains(); break;
                case 'intel': content.innerHTML = this.renderIntel(); break;
            }
            this.attachTabEventListeners();
        }

        // --- RESTORED LOGIC ---

        renderDashboard() {
            if (!this.apiKey) return `<div class="acm-section"><div class="acm-input-group"><label class="acm-label">Torn API Key</label><input type="text" class="acm-input" id="acmApiKey" placeholder="Enter your API key"></div><button class="acm-button" id="acmSaveApi">Save & Load Data</button></div>`;
            if (!this.companyData) return '<div class="acm-loading"><div class="acm-spinner"></div><div>Loading company data...</div></div>';

            const company = this.companyData.company;
            const detailed = this.companyData.company_detailed;
            const avgEff = this.calculateAverageEffectiveness();
            const nextStar = this.getNextStarCalculation();
            const actions = this.getActionItems();

            return `
                <div class="acm-section">
                    <div class="acm-section-title"><span>Company Overview</span><span>${'⭐'.repeat(company.rating)}</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Daily Income</span><span class="acm-stat-value">$${this.formatNumber(company.daily_income)}</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Weekly Income</span><span class="acm-stat-value">$${this.formatNumber(company.weekly_income)}</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Company Bank</span><span class="acm-stat-value">$${this.formatNumber(detailed.company_bank)}</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Avg Effectiveness</span><span class="acm-stat-value">${avgEff.toFixed(1)}⚡</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Advertising Budget</span><span class="acm-stat-value">$${this.formatNumber(detailed.advertising_budget)}/day</span></div>
                </div>
                <div class="acm-section">
                    <div class="acm-section-title">Next Star Calculation</div>
                    <div class="acm-stat-row"><span class="acm-stat-label">${nextStar.label}</span><span class="acm-stat-value">${nextStar.time}</span></div>
                    <div class="acm-progress-bar"><div class="acm-progress-fill" style="width: ${nextStar.progress}%">${nextStar.progress}%</div></div>
                </div>
                ${actions.length > 0 ? `<div class="acm-section"><div class="acm-section-title">Action Items (${actions.length})</div>${actions.map(i => `<div class="acm-action-item"><span class="acm-action-icon">${i.icon}</span><div class="acm-action-text">${i.text}</div></div>`).join('')}</div>` : ''}
            `;
        }

        renderEmployees() {
            if (!this.companyData) return '<div class="acm-loading"><div class="acm-spinner"></div></div>';

            const emps = this.companyData.company_employees;
            const employeeArray = Object.entries(emps).map(([id, emp]) => ({ id, name: emp.name || id, ...emp }));

            const roles = [
                { name: "Store Manager", main: 'endurance', sec: 'intelligence', mainReq: 8000, secReq: 4000 },
                { name: "Sexpert", main: 'intelligence', sec: 'endurance', mainReq: 10000, secReq: 5000 },
                { name: "Sales Assistant", main: 'endurance', sec: 'manual_labor', mainReq: 4000, secReq: 2000 }
            ];

            let html = `<div class="acm-section"><div class="acm-section-title">Employee Role Efficiency</div>`;

            roles.forEach(role => {
                const calculated = employeeArray.map(emp => {
                    const base = this.calculateBaseEfficiency(emp[role.main], role.mainReq, emp[role.sec], role.secReq);
                    const full = this.calculateFullEfficiencyWithAddiction(base, emp.effectiveness.merits||0, emp.effectiveness.settled_in||10, emp.effectiveness.addiction||0, emp.effectiveness.management||0, emp.effectiveness.inactivity||0, true);
                    return { name: emp.name, eff: full };
                }).sort((a,b) => b.eff - a.eff);

                html += `
                    <div>
                        <div class="acm-position-header"><span class="acm-position-title">${role.name}</span><span class="acm-arrow">▼</span></div>
                        <div class="acm-position-list">
                            ${calculated.map(s => `<div class="acm-stat-row"><span class="acm-stat-label">${s.name}</span><span class="acm-stat-value">${s.eff}⚡</span></div>`).join('')}
                        </div>
                    </div>
                `;
            });
            html += `</div>`;

            html += `<div class="acm-section"><div class="acm-section-title">Recommendations</div>${this.getEmployeeRecommendations().map(r => `<div class="acm-alert"><span class="acm-alert-icon">${r.icon}</span><div>${r.text}</div></div>`).join('')}</div>`;
            return html;
        }

        renderStock() {
            if (!this.companyData?.company_stock) return '<div class="acm-section"><div class="acm-alert">No stock data</div></div>';

            const stockItems = Object.entries(this.companyData.company_stock).map(([name, data]) => ({ name, ...data, sold_daily: data.sold_amount }));
            if (stockItems.length === 0) return '<div class="acm-section">No stock items found</div>';

            const restockOrders = this.calculateRestockOrders(stockItems);
            const totalCapacity = 500000;
            const currentStock = stockItems.reduce((sum, item) => sum + item.in_stock, 0);

            return `
                <div class="acm-section">
                    <div class="acm-section-title"><span>Stock Overview</span><span>${this.formatNumber(currentStock)} / ${this.formatNumber(totalCapacity)}</span></div>
                    <div class="acm-progress-bar"><div class="acm-progress-fill" style="width: ${(currentStock/totalCapacity*100).toFixed(1)}%">${(currentStock/totalCapacity*100).toFixed(1)}%</div></div>
                </div>
                <div class="acm-section">
                    <div class="acm-section-title">Current Stock</div>
                    ${stockItems.map(item => {
                        const daysLeft = item.sold_daily > 0 ? item.in_stock / item.sold_daily : 999;
                        const fillPercent = Math.min(100, (item.in_stock / (item.sold_daily * 7)) * 100);
                        return `
                            <div class="acm-stock-item">
                                <div class="acm-stock-header"><span class="acm-stock-name">${item.name}</span><span class="acm-stock-days">${daysLeft < 999 ? daysLeft.toFixed(1) + 'd' : '∞'}</span></div>
                                <div style="font-size:10px; color:#fff; margin-bottom:3px;">Stock: ${this.formatNumber(item.in_stock)} | Sold: ${this.formatNumber(item.sold_daily)}/day</div>
                                <div class="acm-stock-bar"><div class="acm-stock-bar-fill" style="width: ${fillPercent}%"></div></div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="acm-section">
                    <div class="acm-section-title">Restock Calculator</div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Available Capacity</span><span class="acm-stat-value">${this.formatNumber(totalCapacity - currentStock)}</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Recommended Order</span><span class="acm-stat-value">${this.formatNumber(restockOrders.totalItems)}</span></div>
                    ${restockOrders.orders.map(o => `<div class="acm-stat-row"><span class="acm-stat-label">${o.name}</span><span class="acm-stat-value">${this.formatNumber(o.quantity)}</span></div>`).join('')}
                    <button class="acm-button" id="acmCopyRestock" style="margin-top:10px;">Copy Order to Clipboard</button>
                </div>
            `;
        }

        renderIntel() {
            return `
                <div class="acm-section">
                    <div class="acm-section-title">10-Star Requirements</div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Target Avg Eff</span><span class="acm-stat-value">140+⚡</span></div>
                    <div class="acm-stat-row"><span class="acm-stat-label">Ad Budget</span><span class="acm-stat-value">$850k/day</span></div>
                </div>
                <div class="acm-section">
                    <div class="acm-section-title">Your Progress</div>
                    ${this.getProgressMetrics().map(m => `
                        <div style="margin-bottom:10px;">
                            <div class="acm-stat-row"><span class="acm-stat-label">${m.label}</span><span class="acm-stat-value">${m.value}</span></div>
                            <div class="acm-progress-bar"><div class="acm-progress-fill" style="width: ${m.progress}%">${m.progress}%</div></div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        renderTrains() {
            if (!this.companyData) return '<div class="acm-loading"><div class="acm-spinner"></div><div>Loading employee data...</div></div>';

            const emps = this.companyData.company_employees;
            const price = this.trainsData.price;
            const stars = this.companyData.company.rating || 0;
            const dailyGain = stars;

            let html = `
                <div class="acm-section">
                    <div class="acm-section-title">Train Settings</div>
                    <div class="acm-train-settings">
                        <div class="acm-input-group" style="flex:1">
                            <label class="acm-label">Price per Train</label>
                            <input type="number" class="acm-input" id="trainPriceInput" value="${price}">
                        </div>
                    </div>
                    <div class="acm-stat-row" style="background: #444; padding: 8px; border-radius: 4px; margin-bottom: 5px;">
                        <span class="acm-stat-label">Daily Gain (${stars}★):</span>
                        <div class="acm-stat-value">${dailyGain} trains/day</div>
                    </div>
                    <div class="acm-stat-row" style="background: #444; padding: 8px; border-radius: 4px;">
                        <span class="acm-stat-label">Maximum Capacity:</span>
                        <div class="acm-stat-value" style="color:#68acff;">20 trains</div>
                    </div>
                </div>
                <div class="acm-section">
                    <div class="acm-section-title">Employee Ledger</div>
                    <table class="acm-ledger-table">
                        <thead>
                            <tr>
                                <th class="col-name">Name</th>
                                <th class="col-stat">Given</th>
                                <th class="col-stat">Paid</th>
                                <th class="col-owed">Owed</th>
                                <th class="col-act"></th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            Object.values(emps).forEach(emp => {
                const id = emp.id || Object.keys(emps).find(key => emps[key] === emp);
                const history = this.trainsData.history[id] || [];
                let trainsGiven = 0, trainsPaid = 0, totalCost = 0, totalPaidValue = 0;

                history.forEach(h => {
                    if (h.type === 'train') { trainsGiven += h.amount; totalCost += (h.amount * h.value); }
                    else if (h.type === 'payment') { trainsPaid += h.amount; totalPaidValue += (h.amount * h.value); }
                });

                const debtValue = totalCost - totalPaidValue;
                const debtColor = debtValue > 0 ? 'train-debt' : 'train-ok';
                const debtPrefix = debtValue > 0 ? '-$' : '+$';

                html += `
                    <tr>
                        <td class="col-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">${emp.name}</td>
                        <td class="col-stat">${trainsGiven}</td>
                        <td class="col-stat">${trainsPaid}</td>
                        <td class="col-owed ${debtColor}">${debtValue === 0 ? '$0' : debtPrefix + this.formatNumber(Math.abs(debtValue))}</td>
                        <td class="col-act"><button class="acm-button small manage-btn" data-id="${id}" style="padding: 4px 8px; font-size:11px;">Manage</button></td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            return html;
        }

        // --- UTILS & CALCULATORS ---

        attachTabEventListeners() {
            const saveApi = document.getElementById('acmSaveApi');
            if (saveApi) saveApi.addEventListener('click', () => {
                const k = document.getElementById('acmApiKey').value.trim();
                if(k) { this.apiKey = k; GM_setValue('tornApiKey', k); this.loadAllData(); }
            });

            const priceInput = document.getElementById('trainPriceInput');
            if (priceInput) priceInput.addEventListener('change', (e) => {
                this.trainsData.price = parseInt(e.target.value) || 0;
                this.saveTrainsData();
                this.renderCurrentTab();
            });

            const copyRestock = document.getElementById('acmCopyRestock');
            if (copyRestock) copyRestock.addEventListener('click', () => {
                const stockItems = Object.entries(this.companyData.company_stock).map(([name, data]) => ({ name, ...data, sold_daily: data.sold_amount }));
                const restockOrders = this.calculateRestockOrders(stockItems);
                const text = restockOrders.orders.map(o => `${o.name}: ${this.formatNumber(o.quantity)}`).join('\n');
                navigator.clipboard.writeText(text).then(() => { copyRestock.textContent = '✓ Copied!'; setTimeout(() => copyRestock.textContent = 'Copy Order to Clipboard', 2000); });
            });

            document.querySelectorAll('.manage-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.openModal(e.target.dataset.id));
            });

            document.querySelectorAll('.acm-position-header').forEach(header => {
                header.addEventListener('click', () => {
                    header.classList.toggle('collapsed');
                    if(header.nextElementSibling) header.nextElementSibling.classList.toggle('collapsed');
                });
            });
        }

        async loadAllData() {
            if (!this.apiKey) return;
            try { this.companyData = await this.apiRequest('company', '', 'profile,detailed,stock,employees'); this.renderCurrentTab(); } catch (error) { console.error(error); }
        }

        apiRequest(selection, id, selections) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET', url: `https://api.torn.com/${selection}/${id}?selections=${selections}&key=${this.apiKey}`,
                    onload: (res) => { const data = JSON.parse(res.responseText); data.error ? reject(data.error) : resolve(data); },
                    onerror: reject
                });
            });
        }

        calculateBaseEfficiency(p1, r1, p2, r2) {
            try { return Math.round(92 + 5 * (Math.log(p1/r1)/Math.log(2)) + 5 * (Math.log(p2/r2)/Math.log(2))); } catch { return 0; }
        }

        calculateFullEfficiencyWithAddiction(base, merits, settled, add, man, inact, hasMgr) {
            let total = base + 12 + settled + Math.min(merits, 10) + add + man + inact;
            if (hasMgr && total < 142) total += Math.floor((142 - total) * 0.25);
            return total;
        }

        calculateAverageEffectiveness() {
            if (!this.companyData?.company_employees) return 0;
            const emps = Object.values(this.companyData.company_employees);
            return emps.reduce((s, e) => s + e.effectiveness.total, 0) / emps.length;
        }

        getEmployeeRecommendations() {
            if (!this.companyData?.company_employees) return [];
            const low = Object.values(this.companyData.company_employees).filter(e => e.effectiveness.total < 140);
            return low.length ? [{icon:'⚠️', text:`${low.length} employees < 140 eff`}] : [{icon:'✅', text:'All good'}];
        }

        calculateRestockOrders(items) {
            const cap = 500000;
            const current = items.reduce((s, i) => s + i.in_stock, 0);
            const avail = cap - current;
            const ideals = items.map(i => ({ name: i.name, ideal: i.sold_daily * 3 }));
            const totalIdeal = ideals.reduce((s, i) => s + i.ideal, 0);
            const orders = totalIdeal <= avail ? ideals.map(o => ({ name: o.name, quantity: Math.floor(o.ideal) })) : ideals.map(o => ({ name: o.name, quantity: Math.floor(o.ideal * (avail/totalIdeal)) }));
            return { orders, totalItems: orders.reduce((s, o) => s + o.quantity, 0) };
        }

        getNextStarCalculation() {
            const now = new Date(), day = now.getDay(), daysUntil = day === 0 ? 7 : 7 - day;
            const next = new Date(now); next.setDate(now.getDate() + daysUntil); next.setHours(18, 0, 0, 0);
            const ms = next - now, days = ms / (86400000), hrs = (ms % 86400000) / 3600000;
            return { label: 'Sunday 18:00 TCT', time: `${Math.floor(days)}d ${Math.floor(hrs)}h`, progress: ((604800000 - ms) / 604800000 * 100).toFixed(1) };
        }

        getActionItems() {
            const items = [];
            if(this.companyData?.company_stock) {
                const crit = Object.values(this.companyData.company_stock).filter(i => (i.sold_amount > 0 ? i.in_stock/i.sold_amount : 999) < 2);
                if(crit.length) items.push({icon:'🚨', text:`Restock ${crit.length} critical items`});
            }
            if(this.companyData?.company_employees) {
                const low = Object.values(this.companyData.company_employees).filter(e => e.effectiveness.total < 140);
                if(low.length) items.push({icon:'⚠️', text:`${low.length} low effectiveness employees`});
            }
            if(this.companyData?.company_detailed?.advertising_budget < 850000) items.push({icon:'📢', text:'Increase Ad Budget to $850k'});
            return items;
        }

        getProgressMetrics() {
            if (!this.companyData) return [];
            const avg = this.calculateAverageEffectiveness(), ad = this.companyData.company_detailed?.advertising_budget||0, rate = this.companyData.company?.rating||0;
            return [
                { label: 'Avg Eff', value: `${avg.toFixed(1)} / 140`, progress: Math.min(100, (avg/140)*100).toFixed(1) },
                { label: 'Ad Budget', value: `$${this.formatNumber(ad)} / $850k`, progress: Math.min(100, (ad/850000)*100).toFixed(1) },
                { label: 'Rating', value: `${rate} / 10`, progress: (rate*10).toFixed(1) }
            ];
        }

        formatNumber(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
            return num.toLocaleString();
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => new ANCompanyManager());
    else new ANCompanyManager();
})();