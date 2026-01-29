// ==UserScript==
// @name         Paycor OrgChart Export
// @namespace    paycor-orgchart-export
// @version      1.0.0
// @description  Export entire Paycor org chart as JSON/CSV with full hierarchy data
// @match        https://*.paycor.com/*/OrgChart*
// @match        https://secure.paycor.com/*/OrgChart*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564359/Paycor%20OrgChart%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/564359/Paycor%20OrgChart%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CSS Styles
    // ============================================
    GM_addStyle(`
        .poe-export-btn {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
        }
        .poe-export-btn:hover {
            background-color: #0052a3;
        }
        .poe-export-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .poe-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
        }

        .poe-modal {
            background: white;
            border-radius: 8px;
            padding: 24px;
            min-width: 400px;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .poe-modal-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #333;
        }

        .poe-progress-container {
            margin: 16px 0;
        }

        .poe-progress-bar {
            width: 100%;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }

        .poe-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #0066cc, #0088ff);
            transition: width 0.3s ease;
            border-radius: 10px;
        }

        .poe-progress-text {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .poe-status-text {
            margin-top: 8px;
            font-size: 13px;
            color: #888;
            text-align: center;
        }

        .poe-btn-row {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        }

        .poe-btn {
            padding: 10px 20px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }

        .poe-btn-primary {
            background: #0066cc;
            color: white;
        }
        .poe-btn-primary:hover {
            background: #0052a3;
        }

        .poe-btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .poe-btn-secondary:hover {
            background: #d0d0d0;
        }

        .poe-btn-danger {
            background: #cc3333;
            color: white;
        }
        .poe-btn-danger:hover {
            background: #aa2222;
        }

        .poe-error {
            color: #cc3333;
            margin-top: 12px;
            font-size: 14px;
        }

        .poe-success {
            color: #22aa22;
            margin-top: 12px;
            font-size: 14px;
        }
    `);

    // ============================================
    // Configuration Extraction
    // ============================================
    const PaycorConfig = {
        companyId: null,
        baseUri: null,
        apiKey: null,

        async waitForApp(timeout = 10000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                if (unsafeWindow.app?.configuration?.ViewData?.CompanyId) {
                    return true;
                }
                await delay(100);
            }
            return false;
        },

        extract() {
            try {
                const viewData = unsafeWindow.app?.configuration?.ViewData;
                if (!viewData) {
                    throw new Error('ViewData not found');
                }

                this.companyId = viewData.CompanyId;
                this.baseUri = viewData.HrServiceBaseUri;

                // Extract API key from RemoteDataOptions
                const customHeaders = unsafeWindow.RemoteDataOptions?.SingleNode?.CustomHeaders;
                this.apiKey = customHeaders?.['Ocp-Apim-Subscription-Key'];

                if (!this.companyId || !this.baseUri || !this.apiKey) {
                    throw new Error('Missing required configuration');
                }

                // Normalize base URI
                if (!this.baseUri.endsWith('/')) {
                    this.baseUri += '/';
                }

                console.log('[POE] Config extracted:', {
                    companyId: this.companyId,
                    baseUri: this.baseUri,
                    hasApiKey: !!this.apiKey
                });

                return true;
            } catch (e) {
                console.error('[POE] Config extraction failed:', e);
                return false;
            }
        }
    };

    // ============================================
    // Utility Functions
    // ============================================
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function escapeCSV(value) {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    // ============================================
    // API Client
    // ============================================
    const PaycorAPI = {
        cancelled: false,

        cancel() {
            this.cancelled = true;
        },

        reset() {
            this.cancelled = false;
        },

        async fetch(endpoint, options = {}) {
            if (this.cancelled) {
                throw new Error('Operation cancelled');
            }

            const { retries = 3, includeCompanyId = true } = options;

            let url;
            if (includeCompanyId) {
                url = `${PaycorConfig.baseUri}v1/orgchart/${PaycorConfig.companyId}/${endpoint}`;
            } else {
                url = `${PaycorConfig.baseUri}v1/orgchart/${endpoint}`;
            }

            // Add cache buster
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}_=${Date.now()}`;

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Ocp-Apim-Subscription-Key': PaycorConfig.apiKey
                        }
                    });

                    if (response.status === 401) {
                        throw new Error('Session expired. Please refresh the page and try again.');
                    }

                    if (response.status === 403) {
                        throw new Error('ACCESS_DENIED');
                    }

                    if (response.status === 429) {
                        const waitTime = Math.pow(2, attempt) * 1000;
                        console.log(`[POE] Rate limited, waiting ${waitTime}ms`);
                        await delay(waitTime);
                        continue;
                    }

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    return await response.json();
                } catch (e) {
                    if (e.message.includes('Session expired') || e.message.includes('cancelled')) {
                        throw e;
                    }
                    if (attempt === retries) {
                        throw e;
                    }
                    const waitTime = Math.pow(2, attempt) * 500;
                    console.log(`[POE] Retry ${attempt}/${retries} after ${waitTime}ms:`, e.message);
                    await delay(waitTime);
                }
            }
        },

        async fetchAllPages(endpoint, onProgress, options = {}) {
            const allItems = [];
            let page = 1;
            const pageSize = 100;

            while (true) {
                if (this.cancelled) {
                    throw new Error('Operation cancelled');
                }

                const separator = endpoint.includes('?') ? '&' : '?';
                const pagedEndpoint = `${endpoint}${separator}page=${page}&pageSize=${pageSize}`;

                const data = await this.fetch(pagedEndpoint, options);

                if (!data || !Array.isArray(data.items)) {
                    // Single result or different format
                    if (Array.isArray(data)) {
                        allItems.push(...data);
                    } else if (data) {
                        allItems.push(data);
                    }
                    break;
                }

                allItems.push(...data.items);

                if (onProgress) {
                    onProgress(allItems.length, data.totalCount || allItems.length);
                }

                // Check if we have more pages
                if (data.items.length < pageSize || allItems.length >= (data.totalCount || Infinity)) {
                    break;
                }

                page++;
                await delay(200); // Rate limiting
            }

            return allItems;
        }
    };

    // ============================================
    // Data Collection (Tree Traversal + Full Fetch)
    // ============================================
    async function collectAllEmployees(onProgress, onStatus) {
        const visited = new Set();

        onStatus('Fetching root managers...');

        // 1. Fetch root managers (paginated)
        const roots = await PaycorAPI.fetchAllPages('rootnodes', (count, total) => {
            onStatus(`Fetching root managers... (${count}/${total || '?'})`);
        });

        console.log(`[POE] Found ${roots.length} root managers`);

        // 2. BFS traversal - collect all employee IDs
        const queue = [...roots];
        const employeeIds = [];

        while (queue.length > 0) {
            if (PaycorAPI.cancelled) {
                throw new Error('Operation cancelled');
            }

            const node = queue.shift();
            const empId = node.employeeId || node.id;

            if (visited.has(empId)) {
                continue;
            }
            visited.add(empId);
            employeeIds.push(empId);

            onStatus(`Discovering employees... (${employeeIds.length} found, ${queue.length} in queue)`);

            if (node.directChildCount > 0) {
                try {
                    const children = await PaycorAPI.fetchAllPages(`nodes/${node.id}/children`);
                    queue.push(...children);
                    await delay(100); // Rate limiting
                } catch (e) {
                    console.warn(`[POE] Failed to fetch children for ${node.id}:`, e.message);
                }
            }
        }

        // 3. Fetch orphans (employees not in hierarchy) - optional, may not have permission
        onStatus('Fetching orphaned employees...');
        try {
            const orphans = await PaycorAPI.fetchAllPages('orphans');
            console.log(`[POE] Found ${orphans.length} orphans`);

            for (const orphan of orphans) {
                const empId = orphan.employeeId || orphan.id;
                if (!visited.has(empId)) {
                    employeeIds.push(empId);
                    visited.add(empId);
                }
            }
        } catch (e) {
            if (e.message === 'ACCESS_DENIED') {
                console.log('[POE] No permission to access orphans endpoint - skipping');
            } else {
                console.warn('[POE] Failed to fetch orphans:', e.message);
            }
        }

        console.log(`[POE] Total employees to fetch: ${employeeIds.length}`);

        // 4. Fetch full details for each employee from individual endpoint
        const employees = [];
        for (let i = 0; i < employeeIds.length; i++) {
            if (PaycorAPI.cancelled) {
                throw new Error('Operation cancelled');
            }

            const employeeId = employeeIds[i];
            onStatus(`Fetching employee details... (${i + 1}/${employeeIds.length})`);
            onProgress(i + 1, employeeIds.length);

            try {
                const fullEmployee = await PaycorAPI.fetch(`employees/${employeeId}`, { includeCompanyId: false });
                employees.push(fullEmployee);
            } catch (e) {
                console.warn(`[POE] Failed to fetch full details for ${employeeId}:`, e.message);
            }

            await delay(100); // Rate limiting
        }

        return employees;
    }

    // ============================================
    // Export Functions
    // ============================================
    function exportJSON(employees) {
        const data = {
            exportDate: new Date().toISOString(),
            companyId: PaycorConfig.companyId,
            totalEmployees: employees.length,
            employees: employees
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const filename = `paycor-orgchart-${PaycorConfig.companyId}-${new Date().toISOString().split('T')[0]}.json`;
        downloadBlob(blob, filename);
    }

    function exportCSV(employees) {
        // Dynamically collect all unique field names from all employees
        const headerSet = new Set();
        for (const emp of employees) {
            Object.keys(emp).forEach(key => headerSet.add(key));
        }

        // Sort headers with common fields first, then alphabetically
        const priorityFields = [
            'id', 'employeeId', 'employeeUid', 'clientId', 'companyId',
            'firstName', 'lastName', 'managerId', 'managerName',
            'jobTitle', 'departmentCode', 'departmentDescription',
            'workLocation', 'workEmail', 'workPhone'
        ];
        const headers = [
            ...priorityFields.filter(f => headerSet.has(f)),
            ...[...headerSet].filter(f => !priorityFields.includes(f)).sort()
        ];

        const rows = [headers.join(',')];

        for (const emp of employees) {
            const row = headers.map(h => escapeCSV(emp[h]));
            rows.push(row.join(','));
        }

        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const filename = `paycor-orgchart-${PaycorConfig.companyId}-${new Date().toISOString().split('T')[0]}.csv`;
        downloadBlob(blob, filename);
    }

    // ============================================
    // Modal UI
    // ============================================
    class Modal {
        constructor() {
            this.overlay = null;
            this.modal = null;
        }

        show(content) {
            this.hide();

            this.overlay = document.createElement('div');
            this.overlay.className = 'poe-modal-overlay';

            this.modal = document.createElement('div');
            this.modal.className = 'poe-modal';
            this.modal.innerHTML = content;

            this.overlay.appendChild(this.modal);
            document.body.appendChild(this.overlay);

            return this.modal;
        }

        hide() {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
                this.modal = null;
            }
        }

        update(selector, html) {
            if (this.modal) {
                const el = this.modal.querySelector(selector);
                if (el) el.innerHTML = html;
            }
        }

        setProgress(percent) {
            if (this.modal) {
                const fill = this.modal.querySelector('.poe-progress-fill');
                if (fill) fill.style.width = `${percent}%`;

                const text = this.modal.querySelector('.poe-progress-text');
                if (text) text.textContent = `${Math.round(percent)}%`;
            }
        }
    }

    const modal = new Modal();

    // ============================================
    // Main Export Flow
    // ============================================
    let collectedEmployees = null;

    async function startExport() {
        PaycorAPI.reset();
        collectedEmployees = null;

        modal.show(`
            <div class="poe-modal-title">Exporting Org Chart</div>
            <div class="poe-progress-container">
                <div class="poe-progress-bar">
                    <div class="poe-progress-fill" style="width: 0%"></div>
                </div>
                <div class="poe-progress-text">0%</div>
            </div>
            <div class="poe-status-text">Initializing...</div>
            <div class="poe-btn-row">
                <button class="poe-btn poe-btn-danger" id="poe-cancel">Cancel</button>
            </div>
        `);

        document.getElementById('poe-cancel').addEventListener('click', () => {
            PaycorAPI.cancel();
            modal.hide();
        });

        try {
            collectedEmployees = await collectAllEmployees(
                (current, total) => {
                    const percent = total ? Math.min(99, (current / total) * 100) : 0;
                    modal.setProgress(percent);
                },
                (status) => {
                    modal.update('.poe-status-text', status);
                }
            );

            modal.setProgress(100);
            showCompletionModal();

        } catch (e) {
            if (e.message === 'Operation cancelled') {
                return;
            }
            showErrorModal(e.message);
        }
    }

    function showCompletionModal() {
        modal.show(`
            <div class="poe-modal-title">Export Complete</div>
            <div class="poe-success">
                Successfully collected ${collectedEmployees.length} employees.
            </div>
            <div class="poe-btn-row">
                <button class="poe-btn poe-btn-primary" id="poe-download-json">Download JSON</button>
                <button class="poe-btn poe-btn-primary" id="poe-download-csv">Download CSV</button>
            </div>
            <div class="poe-btn-row">
                <button class="poe-btn poe-btn-secondary" id="poe-close">Close</button>
            </div>
        `);

        document.getElementById('poe-download-json').addEventListener('click', () => {
            exportJSON(collectedEmployees);
        });

        document.getElementById('poe-download-csv').addEventListener('click', () => {
            exportCSV(collectedEmployees);
        });

        document.getElementById('poe-close').addEventListener('click', () => {
            modal.hide();
        });
    }

    function showErrorModal(message) {
        modal.show(`
            <div class="poe-modal-title">Export Failed</div>
            <div class="poe-error">${message}</div>
            <div class="poe-btn-row">
                <button class="poe-btn poe-btn-primary" id="poe-retry">Retry</button>
                <button class="poe-btn poe-btn-secondary" id="poe-close">Close</button>
            </div>
        `);

        document.getElementById('poe-retry').addEventListener('click', () => {
            modal.hide();
            startExport();
        });

        document.getElementById('poe-close').addEventListener('click', () => {
            modal.hide();
        });
    }

    // ============================================
    // Button Injection
    // ============================================
    function injectExportButton() {
        const header = document.querySelector('.orgChartHeader');

        const btn = document.createElement('button');
        btn.className = 'poe-export-btn';
        btn.textContent = 'Export Org Chart';
        btn.addEventListener('click', startExport);

        if (header) {
            btn.style.cssText = 'float: right; margin-top: 5px;';
            header.appendChild(btn);
        } else {
            // Fallback: fixed position
            btn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999;';
            document.body.appendChild(btn);
        }

        console.log('[POE] Export button injected');
    }

    // ============================================
    // Initialization
    // ============================================
    async function init() {
        console.log('[POE] Paycor OrgChart Export initializing...');

        // Wait for app configuration to be available
        const appReady = await PaycorConfig.waitForApp();
        if (!appReady) {
            console.error('[POE] Timeout waiting for Paycor app configuration');
            return;
        }

        // Extract configuration
        if (!PaycorConfig.extract()) {
            console.error('[POE] Failed to extract configuration');
            return;
        }

        // Inject the export button
        injectExportButton();

        console.log('[POE] Paycor OrgChart Export ready');
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
