// ==UserScript==
// @name         BOS Reporting Automation Suite v6.7
// @namespace    http://tampermonkey.net/
// @version      6.7.2611.2
// @description  Automated submission tool for economic reports to BOS POLRI. Features include state persistence, redundancy check, and process throttling.
// @author       System Administrator
// @reference    https://paste-bin.org/raw/k3eskwtbz6
// @match        https://bos.polri.go.id/laporan/dds-warga*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556567/BOS%20Reporting%20Automation%20Suite%20v67.user.js
// @updateURL https://update.greasyfork.org/scripts/556567/BOS%20Reporting%20Automation%20Suite%20v67.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIGURATION & DATASET ---
    // Reference Data: https://paste-bin.org/raw/k3eskwtbz6
    const reportDataset = [
        { nama: "Karto W.", uraian: "Semoga panen padi tahun ini melimpah dan harga gabah stabil.", keywords: ["pertanian", "panen raya", "ekonomi desa"] },
    ];

    const CONSTANTS = {
        STORAGE_NAMESPACE: 'BOS_AUTO_V69_DATA',
        STATE_FLAG: 'BOS_AUTO_V69_IS_ACTIVE',
        UI_COLORS: {
            SUCCESS: '#28a745',
            WARNING: '#ffc107',
            DANGER: '#dc3545',
            INFO: '#17a2b8',
            IDLE: '#fff'
        }
    };

    // --- STATE MANAGEMENT ---
    let processedRecords = new Set(JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_NAMESPACE) || '[]'));
    let pendingQueue = reportDataset.filter(record => !processedRecords.has(record.nama));
    let isExecutionActive = JSON.parse(localStorage.getItem(CONSTANTS.STATE_FLAG) || 'false');
    let isInterrupted = false;

    // --- INITIALIZATION CHECK ---
    if (pendingQueue.length === 0) {
        localStorage.removeItem(CONSTANTS.STORAGE_NAMESPACE);
        localStorage.removeItem(CONSTANTS.STATE_FLAG);
        processedRecords = new Set();
        pendingQueue = [...reportDataset];
        isExecutionActive = false;
    }

    // --- UTILITY FUNCTIONS ---
    const displayToastNotification = (message, backgroundColor = CONSTANTS.UI_COLORS.SUCCESS) => {
        const notificationEl = document.createElement('div');
        notificationEl.textContent = message;
        Object.assign(notificationEl.style, {
            position: 'fixed', top: '15px', right: '15px', padding: '10px 20px', background: backgroundColor,
            color: 'white', borderRadius: '10px', zIndex: 9999999, font: 'bold 15px system-ui',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)', opacity: 0, transition: 'all .3s'
        });
        document.body.appendChild(notificationEl);
        requestAnimationFrame(() => notificationEl.style.opacity = '1');
        setTimeout(() => notificationEl.remove(), 4000);
    };

    const persistSystemState = (isActive) => {
        localStorage.setItem(CONSTANTS.STATE_FLAG, JSON.stringify(isActive));
        if (isActive) localStorage.setItem(CONSTANTS.STORAGE_NAMESPACE, JSON.stringify([...processedRecords]));
    };

    const resetApplicationState = () => {
        localStorage.removeItem(CONSTANTS.STORAGE_NAMESPACE);
        localStorage.removeItem(CONSTANTS.STATE_FLAG);
        isExecutionActive = false;
        isInterrupted = true;
        persistSystemState(false);
    };

    const refreshControlPanel = () => {
        const btnAuto = document.getElementById('btnStartAutomation');
        const btnManual = document.getElementById('btnSingleExecution');
        const statusLabel = document.getElementById('statusLabel');

        btnAuto.textContent = `AUTO RUN`;
        btnManual.textContent = `SINGLE ENTRY`;
        document.getElementById('queueCounter').textContent = pendingQueue.length;

        const isControlsDisabled = isExecutionActive || pendingQueue.length === 0;
        btnAuto.disabled = isControlsDisabled;
        btnManual.disabled = isControlsDisabled;

        statusLabel.textContent = isExecutionActive ? 'RUNNING' : (pendingQueue.length === 0 ? 'COMPLETED' : 'READY');
        statusLabel.style.color = isExecutionActive ? CONSTANTS.UI_COLORS.SUCCESS : (pendingQueue.length === 0 ? CONSTANTS.UI_COLORS.WARNING : CONSTANTS.UI_COLORS.IDLE);
    };

    // --- CORE LOGIC ---
    const populateFormFields = (record) => {
        $('#nama_kepala_keluarga').val(record.nama).trigger('input');
        $('input[value="harapan"]').prop('checked', true).trigger('change');
        $('input[value="keluhan"]').prop('checked', false).trigger('change');
        $('#bidang-harapan').val('EKONOMI').trigger('change');
        $('#uraian-harapan').val(record.uraian);
        $('#keyword_harapan').empty().append(record.keywords.map(k => `<option value="${k}" selected>${k}</option>`)).trigger('change');
        $('input[name="laporan_informasi[bidang]"][value="ekonomi"]').prop('checked', true).trigger('change');
        $('textarea[name="laporan_informasi[uraian]"]').val(record.uraian);
        $('#select-keyword-informasi').empty().append(record.keywords.map(k => `<option value="${k}" selected>${k}</option>`)).trigger('change');
    };

    const executeSubmissionCycle = (autoTrigger = true) => {
        // Validation: Check queue status
        if (pendingQueue.length === 0) {
            resetApplicationState();
            refreshControlPanel();
            displayToastNotification('QUEUE EMPTY. PROCESS TERMINATED.', CONSTANTS.UI_COLORS.WARNING);
            return;
        }

        // Validation: Check interruption flag
        if (isInterrupted) {
            isExecutionActive = false;
            persistSystemState(false);
            refreshControlPanel();
            displayToastNotification('Process Halted by User', CONSTANTS.UI_COLORS.DANGER);
            return;
        }

        // Process Data
        const record = pendingQueue.splice(Math.floor(Math.random() * pendingQueue.length), 1)[0];
        processedRecords.add(record.nama);
        persistSystemState(true);

        populateFormFields(record);
        refreshControlPanel();
        displayToastNotification(
            autoTrigger ? `Submitted: ${record.nama} (${pendingQueue.length} remaining)` : 'Form Populated Successfully',
            autoTrigger ? CONSTANTS.UI_COLORS.SUCCESS : CONSTANTS.UI_COLORS.INFO
        );

        if (autoTrigger) {
            setTimeout(() => {
                const submitButton = Array.from(document.querySelectorAll('button')).find(b =>
                    b.textContent.trim().includes('Simpan') && b.type === 'submit' && !b.disabled
                );

                if (submitButton) {
                    submitButton.click();
                    initiateCooldownTimer();
                } else {
                    displayToastNotification('Submit Button Not Found. Retrying...', CONSTANTS.UI_COLORS.DANGER);
                    setTimeout(() => executeSubmissionCycle(true), 4000);
                }
            }, 1200);
        }
    };

    const initiateCooldownTimer = () => {
        const overlay = document.createElement('div');
        overlay.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99999999;display:flex;align-items:center;justify-content:center;cursor:default;">
            <div style="background:#fff;padding:50px 80px;border-radius:30px;text-align:center;">
                <h2 style="margin:0 0 20px;font-size:36px;color:${CONSTANTS.UI_COLORS.SUCCESS};">Submission Success</h2>
                <div id="countdownTimer" style="font-size:90px;font-weight:900;color:${CONSTANTS.UI_COLORS.SUCCESS};">30</div>
                <p style="margin:10px 0 0;font-size:16px;color:#555;">${pendingQueue.length} records pending</p>
            </div>
        </div>`;
        document.body.appendChild(overlay);

        let secondsRemaining = 30;
        const timerInterval = setInterval(() => {
            secondsRemaining--;
            document.getElementById('countdownTimer').textContent = secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining;
        }, 1000);
    };

    // --- UI INJECTION ---
    if (location.pathname.includes('/create')) {
        const controlPanel = document.createElement('div');
        controlPanel.innerHTML = `
            <button id="btnStartAutomation">AUTO RUN</button>
            <button id="btnSingleExecution">SINGLE ENTRY</button>
            <button id="btnHaltExecution">STOP</button>
            <span id="queueCounter" style="margin-left:10px;color:#0f0;font-weight:bold;">0</span>
            <span id="statusLabel" style="margin-left:10px;color:#fff;font-weight:bold;">IDLE</span>
        `;
        Object.assign(controlPanel.style, {
            position: 'fixed', bottom: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 99999,
            display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 16px',
            background: 'rgba(20,20,20,0.9)', borderRadius: '30px', backdropFilter: 'blur(12px)',
            fontFamily: 'system-ui', fontSize: '14px', boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(controlPanel);

        document.head.insertAdjacentHTML('beforeend', `
            <style>
                #btnStartAutomation, #btnSingleExecution, #btnHaltExecution{padding:10px 20px;border:none;border-radius:25px;font-weight:bold;cursor:pointer;transition:.3s;}
                #btnStartAutomation{background:${CONSTANTS.UI_COLORS.SUCCESS};color:white;} #btnStartAutomation:hover{background:#218838;}
                #btnSingleExecution{background:#007bff;color:white;} #btnSingleExecution:hover{background:#0056b3;}
                #btnHaltExecution{background:${CONSTANTS.UI_COLORS.DANGER};color:white;padding:10px 16px;}
                button:disabled{opacity:0.5;cursor:not-allowed!important;}
            </style>
        `);

        // Event Listeners
        document.getElementById('btnStartAutomation').onclick = () => {
            if (pendingQueue.length === 0) return;
            isExecutionActive = true;
            isInterrupted = false;
            persistSystemState(true);
            refreshControlPanel();
            displayToastNotification('AUTOMATION SEQUENCE INITIATED', CONSTANTS.UI_COLORS.SUCCESS);
            executeSubmissionCycle(true);
        };

        document.getElementById('btnSingleExecution').onclick = () => {
            if (pendingQueue.length === 0 || isExecutionActive) return;
            executeSubmissionCycle(false);
        };

        document.getElementById('btnHaltExecution').onclick = () => {
            isInterrupted = true;
            isExecutionActive = false;
            persistSystemState(false);
            refreshControlPanel();
            displayToastNotification('Execution Interrupted by User', CONSTANTS.UI_COLORS.DANGER);
        };

        // Resume Check
        if (isExecutionActive && pendingQueue.length > 0) {
            setTimeout(() => {
                displayToastNotification('RESUMING AUTOMATION SEQUENCE...', CONSTANTS.UI_COLORS.SUCCESS);
                executeSubmissionCycle(true);
            }, 1500);
        }

        refreshControlPanel();
        displayToastNotification(isExecutionActive ? 'SYSTEM RESUMED' : 'BOS Reporting Suite Ready', isExecutionActive ? CONSTANTS.UI_COLORS.SUCCESS : CONSTANTS.UI_COLORS.INFO);
    }

    // --- AUTO REDIRECT LOGIC ---
    if (!location.pathname.includes('/create') && location.pathname.includes('/dds-warga')) {
        setTimeout(() => location.replace('https://bos.polri.go.id/laporan/dds-warga/create'), 5000);
    }
})();