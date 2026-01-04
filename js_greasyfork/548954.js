// ==UserScript==
// @name         TikTok Ads - FULL AUTO V35.3: Decoupled Save-Check
// @namespace    http://tampermonkey.net/
// @version      35.3
// @description  [V35.3] Decoupled the 'Save Settings' and 'Instant Check' buttons. Save now only saves without triggering an immediate re-scan.
// @author       Gemini
// @match        https://ads.tiktok.com/i18n/gmv-max/dashboard/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548954/TikTok%20Ads%20-%20FULL%20AUTO%20V353%3A%20Decoupled%20Save-Check.user.js
// @updateURL https://update.greasyfork.org/scripts/548954/TikTok%20Ads%20-%20FULL%20AUTO%20V353%3A%20Decoupled%20Save-Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================================================================================
    // --- ⚙️ V35.3 悬浮设置面板 ---
    // ==================================================================================
    GM_addStyle(`
        #gm-settings-panel, #gm-settings-panel * { box-sizing: border-box; }
        #gm-settings-panel {
            position: fixed; bottom: 20px; right: 20px; width: 340px;
            height: 225px !important; min-height: 225px !important; max-height: 225px !important;
            background-color: #f7f7f7; border: 1px solid #ccc; border-radius: 8px; z-index: 99999;
            font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: #333;
            resize: none !important; display: flex; flex-direction: column;
        }
        #gm-settings-header { padding: 10px 15px; cursor: move; background-color: #eaeaea; border-bottom: 1px solid #ccc; border-radius: 8px 8px 0 0; font-weight: bold; text-align: center; }
        #gm-settings-content { padding: 15px; display: flex; flex-direction: column; gap: 15px; flex-grow: 1; }
        .gm-setting-row { display: flex; align-items: center; justify-content: space-between; }
        .gm-setting-row .gm-setting-label { font-size: 14px; margin-right: 10px; white-space: nowrap; }
        .gm-setting-control { flex-shrink: 0; display: flex; align-items: center; justify-content: flex-end; }
        #gm_enable_deletion_toggle { display: none; }
        .gm-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .gm-switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .gm-switch-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        #gm_enable_deletion_toggle:checked + .gm-switch-slider { background-color: #2196F3; }
        #gm_enable_deletion_toggle:checked + .gm-switch-slider:before { transform: translateX(20px); }
        #gm_cost_threshold, #gm_scan_interval_value { width: 80px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: right; }
        #gm_scan_interval_unit { padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
        .gm-interval-controls { display: flex; align-items: center; gap: 8px; }
        #gm-settings-footer { padding: 12px 15px; display: flex; justify-content: flex-end; align-items: center; gap: 10px; border-top: 1px solid #eee; }
        #gm_save_button, #gm_check_now_button { padding: 8px 15px; border: none; color: white; border-radius: 5px; cursor: pointer; font-size: 14px; }
        #gm_save_button { background-color: #007bff; }
        #gm_check_now_button { background-color: #28a745; }
        #gm_save_status { color: green; font-weight: bold; font-size: 14px; margin-right: auto; }
    `);

    const panelHTML = `
        <div id="gm-settings-header">⚙️ 自动处理设置</div>
        <div id="gm-settings-content">
            <div class="gm-setting-row">
                <label class="gm-setting-label" for="gm_enable_deletion_toggle">处理'Learning'状态 (开启=删除)</label>
                <div class="gm-setting-control">
                    <label class="gm-switch"><input type="checkbox" id="gm_enable_deletion_toggle"><span class="gm-switch-slider"></span></label>
                </div>
            </div>
            <div class="gm-setting-row">
                <label class="gm-setting-label" for="gm_cost_threshold">'Learning' 删除阈值 (>= Cost)</label>
                <div class="gm-setting-control">
                    <input type="number" id="gm_cost_threshold" step="0.01" min="0">
                </div>
            </div>
            <div class="gm-setting-row">
                <label class="gm-setting-label" for="gm_scan_interval_value">列表扫描周期</label>
                <div class="gm-setting-control gm-interval-controls">
                    <input type="number" id="gm_scan_interval_value" min="1">
                    <select id="gm_scan_interval_unit">
                        <option value="minutes">分钟</option>
                        <option value="hours">小时</option>
                    </select>
                </div>
            </div>
        </div>
        <div id="gm-settings-footer">
            <span id="gm_save_status"></span>
            <button id="gm_check_now_button" title="使用当前面板中的设置立即扫描一次">立即检查</button>
            <button id="gm_save_button" title="仅保存当前设置">保存设置</button>
        </div>
    `;
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'gm-settings-panel';
    settingsPanel.innerHTML = panelHTML;
    document.body.appendChild(settingsPanel);
    const enableToggle = document.getElementById('gm_enable_deletion_toggle');
    const costInput = document.getElementById('gm_cost_threshold');
    const saveButton = document.getElementById('gm_save_button');
    const saveStatus = document.getElementById('gm_save_status');
    const intervalValueInput = document.getElementById('gm_scan_interval_value');
    const intervalUnitInput = document.getElementById('gm_scan_interval_unit');
    const checkNowButton = document.getElementById('gm_check_now_button');
    let config_enableDeletion = GM_getValue('enableDeletion', true);
    let config_costThreshold = GM_getValue('costThreshold', 10.00);
    let config_scanIntervalValue = GM_getValue('scanIntervalValue', 3);
    let config_scanIntervalUnit = GM_getValue('scanIntervalUnit', 'minutes');
    enableToggle.checked = config_enableDeletion;
    costInput.value = config_costThreshold;
    intervalValueInput.value = config_scanIntervalValue;
    intervalUnitInput.value = config_scanIntervalUnit;
    let mainLoopTimer = null;
    function log(message) { console.log(`[V35.3 LOG | ${new Date().toLocaleTimeString()}] ${message}`); }

    function triggerRescan() {
        log("Triggering re-scan. Resetting 'ignored' rows.");
        document.querySelectorAll('tr[data-processed="ignored"]').forEach(row => {
            row.removeAttribute('data-processed');
        });
        clearTimeout(mainLoopTimer);
        mainLoop();
    }

    function updateConfigFromUI() {
        config_enableDeletion = enableToggle.checked;
        config_costThreshold = parseFloat(costInput.value);
        config_scanIntervalValue = parseInt(intervalValueInput.value);
        config_scanIntervalUnit = intervalUnitInput.value;
        log(`Settings in memory updated from UI. Interval: ${config_scanIntervalValue} ${config_scanIntervalUnit}`);
    }

    saveButton.addEventListener('click', () => {
        updateConfigFromUI();
        if (isNaN(config_costThreshold) || isNaN(config_scanIntervalValue) || config_scanIntervalValue < 1) {
            alert('输入无效！请确保阈值和周期都是有效的数字，且周期不小于1。'); return;
        }
        GM_setValue('enableDeletion', config_enableDeletion);
        GM_setValue('costThreshold', config_costThreshold);
        GM_setValue('scanIntervalValue', config_scanIntervalValue);
        GM_setValue('scanIntervalUnit', config_scanIntervalUnit);
        saveStatus.textContent = '已保存!';
        log(`Settings have been saved to storage.`);
        setTimeout(() => { saveStatus.textContent = ''; }, 2000);
    });

    checkNowButton.addEventListener('click', () => {
        log("'Instant Check' button clicked.");
        updateConfigFromUI();
        triggerRescan();
    });

    const header = document.getElementById('gm-settings-header');
    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => { if (e.target.closest('#gm-settings-footer') || e.target.closest('#gm-header-actions')) return; isDragging = true; offsetX = e.clientX - settingsPanel.offsetLeft; offsetY = e.clientY - settingsPanel.offsetTop; document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { settingsPanel.style.left = `${e.clientX - offsetX}px`; settingsPanel.style.top = `${e.clientY - offsetY}px`; } });
    document.addEventListener('mouseup', () => { isDragging = false; document.body.style.userSelect = ''; });

    // ==================================================================================
    // --- 脚本核心代码 ---
    // ==================================================================================
    const DELIVERING_STATUS = 'Delivering';
    const LEARNING_STATUS = 'Learning';
    const DRAWER_ACTION_DELAY = 10000;

    function waitForElement(selector, timeout = 20000) { log(`Waiting for element: "${selector}"`); return new Promise((resolve, reject) => { const intervalTime = 100; let elapsedTime = 0; const interval = setInterval(() => { const element = document.querySelector(selector); if (element) { clearInterval(interval); log(`Element found: "${selector}"`); resolve(element); } elapsedTime += intervalTime; if (elapsedTime >= timeout) { clearInterval(interval); reject(new Error(`Element "${selector}" not found within ${timeout}ms`)); } }, intervalTime); }); };
    async function processSingleRow(row) { const statusCell = row.querySelectorAll('td')[3]; const currentStatus = statusCell ? statusCell.textContent.trim() : ''; let shouldAct = false; if (currentStatus === DELIVERING_STATUS) { shouldAct = true; } else if (currentStatus === LEARNING_STATUS) { const costCell = row.querySelectorAll('td')[5]; const cost = costCell ? parseFloat(costCell.textContent) || 0 : 0; if (config_enableDeletion && cost >= config_costThreshold) { shouldAct = true; } } if (!shouldAct) { row.dataset.processed = 'ignored'; log(`Skipping row with status "${currentStatus}" as it does not meet action criteria.`); return; } row.dataset.processed = 'processing'; log(`Action required for row with status "${currentStatus}". Proceeding to click 'Edit'.`); const editButton = row.querySelector('button[data-testid="creative-table-useColumns-2NyYGF"]'); if (editButton) { try { editButton.click(); await waitForElement('button[data-testid="boost-drawer-index-48QKbA"]'); log('Drawer open and "Delete" button initially found.'); log(`Starting a silent ${DRAWER_ACTION_DELAY / 1000} second wait...`); await new Promise(r => setTimeout(r, DRAWER_ACTION_DELAY)); log('Delay finished. Re-acquiring the delete button...'); const deleteButton = document.querySelector('button[data-testid="boost-drawer-index-48QKbA"]'); if (!deleteButton) { throw new Error('The "Delete" button could not be found after the delay.'); } log('Delete button re-acquired successfully. Clicking it now.'); deleteButton.click(); log('Waiting for the final confirmation dialog button...'); const confirmButtonSelector = 'button.theme-arco-btn-primary.theme-arco-btn-size-large'; const finalConfirmButton = await waitForElement(confirmButtonSelector); if (finalConfirmButton && finalConfirmButton.textContent.includes('Confirm')) { log('Final "Confirm" button found. Clicking it.'); finalConfirmButton.click(); log('Deletion process seems successful.'); row.dataset.processed = 'deleted'; } else { throw new Error('Final confirmation button text did not match "Confirm".'); } await new Promise(resolve => setTimeout(resolve, 3000)); } catch (error) { log(`An error occurred during the process.`); console.error("[V35.3] Error:", error); row.dataset.processed = 'error'; const closeButton = document.querySelector('.theme-arco-drawer-wrapper button[class*="close-button"]'); if (closeButton) { log('Attempting to close drawer after error...'); closeButton.click(); } } } };
    async function mainLoop() { const boostingButtonSelector = 'button[data-tea-module_name="creative_table_status_quick_filter_show_boost_2"]'; const boostingButtonIsActive = document.querySelector(`${boostingButtonSelector}[class*="delivery-status-active"]`); const multiplier = config_scanIntervalUnit === 'hours' ? 60 * 60 * 1000 : 60 * 1000; const scanInterval = config_scanIntervalValue * multiplier; if (!boostingButtonIsActive) { log("Boosting filter is not active. Pausing execution."); mainLoopTimer = setTimeout(mainLoop, scanInterval); return; } log("--- Boosting filter is active. Main loop started. ---"); const rowToProcess = document.querySelector('tr.creative-table-row-UWxp:not([data-processed])'); if (rowToProcess) { await processSingleRow(rowToProcess); mainLoopTimer = setTimeout(mainLoop, 500); } else { log(`No unprocessed rows found. Waiting for ${config_scanIntervalValue} ${config_scanIntervalUnit}.`); mainLoopTimer = setTimeout(mainLoop, scanInterval); } };
    async function startAutomation() { log(`Initialized. Settings -> Deletion for Learning: ${config_enableDeletion}, Cost Threshold: ${config_costThreshold}`); try { log('Step 1: Waiting for the "Boosting" filter button to appear...'); const boostingButton = await waitForElement('button[data-tea-module_name="creative_table_status_quick_filter_show_boost_2"]'); log('"Boosting" filter button found.'); const getFirstRowId = () => { const firstRow = document.querySelector('tr.creative-table-row-UWxp'); const idElement = firstRow ? firstRow.querySelector('span.sub-title-Smyy') : null; return idElement ? idElement.textContent : null; }; const initialId = getFirstRowId(); log(`Initial first row ID snapshot: ${initialId}`); boostingButton.click(); log('Clicked "Boosting" button. Now intelligently waiting for table to refresh...'); await new Promise((resolve) => { let attempts = 0; const maxAttempts = 50; const checkInterval = setInterval(() => { const newId = getFirstRowId(); if ((newId && newId !== initialId) || (initialId && !newId)) { clearInterval(checkInterval); log(`Table refresh confirmed!`); resolve(); } else if (attempts > maxAttempts) { clearInterval(checkInterval); log('Table refresh check timed out. Proceeding anyway.'); resolve(); } attempts++; }, 200); }); log('Table is ready. Proceeding to Step 2: Starting main loop.'); mainLoop(); } catch (error) { console.error('[V35.3] A critical error occurred during initialization:', error); mainLoop(); } };

    if (document.readyState === 'complete') { startAutomation(); }
    else { window.addEventListener('load', startAutomation); }
})();