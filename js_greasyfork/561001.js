// ==UserScript==
// @name         Multi-Barcode Scanner (Sidebar Table) - AutoReload v3
// @description  Enhanced batch barcode scanner with resizable sidebar and session persistence
// @match        https://his.kaauh.org/lab/*
// @grant        none
// @version 0.0.1.20260101031721
// @namespace https://greasyfork.org/users/1396691
// @downloadURL https://update.greasyfork.org/scripts/561001/Multi-Barcode%20Scanner%20%28Sidebar%20Table%29%20-%20AutoReload%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/561001/Multi-Barcode%20Scanner%20%28Sidebar%20Table%29%20-%20AutoReload%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - Easy to adjust timing/behavior
    // ============================================
    const CONFIG = {
        INACTIVITY_DELAY: 5000,
        FIRST_SUBMIT_WAIT: 2000,
        SUBSEQUENT_SUBMIT_WAIT: 1200,
        SCAN_INPUT_DEBOUNCE: 300,
        VISIBILITY_CHECK_INTERVAL: 1000,
        MIN_SIDEBAR_WIDTH: 320,
        MAX_SIDEBAR_WIDTH: 600,
        STORAGE_KEY: 'batchQueueState'  // sessionStorage key
    };

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const state = {
        barcodeQueue: [],
        inactivityTimer: null,
        isProcessing: false,
        userClosed: false,
        visibilityInterval: null,
        mutationObserver: null,
        resizeObserver: null,
        statusDiv: null,
        queueListDiv: null,
        clonedInput: null,
        originalInput: null,
        originalContainer: null
    };

    // ============================================
    // SESSION STORAGE HELPERS
    // ============================================
    function savePositionAndSize() {
        if (!state.queueListDiv) return;

        const data = {
            position: {
                top: state.queueListDiv.style.top,
                left: state.queueListDiv.style.left
            },
            size: {
                width: state.queueListDiv.style.width,
                height: state.queueListDiv.style.height
            },
            userClosed: state.userClosed
        };

        try {
            sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            console.log('💾 Saved position and size:', data);
        } catch (e) {
            console.warn('Failed to save to sessionStorage:', e);
        }
    }

    function loadPositionAndSize() {
        try {
            const saved = sessionStorage.getItem(CONFIG.STORAGE_KEY);
            if (!saved) return null;
            
            const data = JSON.parse(saved);
            console.log('📂 Loaded position and size:', data);
            return data;
        } catch (e) {
            console.warn('Failed to load from sessionStorage:', e);
            return null;
        }
    }

    function applyPositionAndSize() {
        const saved = loadPositionAndSize();
        if (!saved || !state.queueListDiv) return false;

        // Apply position
        if (saved.position.top) state.queueListDiv.style.top = saved.position.top;
        if (saved.position.left) state.queueListDiv.style.left = saved.position.left;

        // Apply size
        if (saved.size.width) {
            state.queueListDiv.style.width = saved.size.width;
            state.queueListDiv.dataset.manuallyResized = 'true';
        }
        if (saved.size.height) {
            state.queueListDiv.style.height = saved.size.height;
        }

        // Apply user closed state
        if (saved.userClosed) {
            state.userClosed = true;
        }

        return true;
    }

    // ============================================
    // CLEANUP FUNCTION
    // ============================================
    function cleanup() {
        console.log('🧹 Cleaning up previous instance...');

        if (state.inactivityTimer) {
            clearTimeout(state.inactivityTimer);
            state.inactivityTimer = null;
        }

        if (state.visibilityInterval) {
            clearInterval(state.visibilityInterval);
            state.visibilityInterval = null;
        }

        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
            state.mutationObserver = null;
        }

        if (state.resizeObserver) {
            state.resizeObserver.disconnect();
            state.resizeObserver = null;
        }

        const elementsToRemove = ['batch-status', 'batch-queue-list', 'barcodecollection-clone'];
        elementsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        state.barcodeQueue.length = 0;
        state.isProcessing = false;
        state.userClosed = false;
        state.statusDiv = null;
        state.queueListDiv = null;
    }

    // ============================================
    // MUTATION OBSERVER
    // ============================================
    function setupMutationObserver() {
        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
        }

        state.mutationObserver = new MutationObserver(() => {
            const originalInput = document.querySelector('#barcodecollection');
            const existingClone = document.getElementById('barcodecollection-clone');

            if (originalInput && !existingClone) {
                cleanup();
                initializeScript(originalInput);
            }
        });

        state.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================
    // LOCATION CALCULATION
    // ============================================
    function calculateLocation(index) {
        const letter = String.fromCharCode(65 + Math.floor(index / 10));
        const number = (index % 10) + 1;
        return `${letter}${number}`;
    }

    // ============================================
    // UI UPDATES
    // ============================================
    function updateStatus() {
        if (!state.statusDiv) return;

        const timeLeft = state.inactivityTimer ? Math.ceil(CONFIG.INACTIVITY_DELAY / 1000) : 0;
        const count = state.barcodeQueue.length;

        state.statusDiv.innerHTML = `
            <strong>📋 Batch Collector</strong><br>
            ${state.isProcessing ? '🔄 Processing...' : '✅ Collecting'}<br>
            📦 Pending: ${count}<br>
            ${!state.isProcessing && count > 0 ? `⏱️ Starting in ${timeLeft}s` : ''}
        `;

        const timerDisplay = document.getElementById('queue-timer-display');
        if (timerDisplay) {
            timerDisplay.innerText = (!state.isProcessing && count > 0) ? `Auto-run in ${timeLeft}s...` : '';
        }

        if (state.isProcessing) {
            state.statusDiv.style.background = '#ffc107';
            state.statusDiv.style.color = 'black';
        } else if (count > 0) {
            state.statusDiv.style.background = '#17a2b8';
            state.statusDiv.style.color = 'white';
        } else {
            state.statusDiv.style.background = '#28a745';
            state.statusDiv.style.color = 'white';
        }
    }

    function showNotification(message, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${colors[type]};
            color: white;
            padding: 18px 35px;
            border-radius: 10px;
            z-index: 10002;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 6px 25px rgba(0,0,0,0.5);
        `;
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 1500);
    }

    // ============================================
    // VISIBILITY MANAGEMENT
    // ============================================
    function checkContextVisibility() {
        if (state.userClosed || !state.queueListDiv || !state.statusDiv) return;

        const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, .modal-title, .panel-title, span.caption-subject'));
        const targetHeader = headers.find(h => h.innerText && h.innerText.includes('Sample Receive in WB'));
        const isVisible = targetHeader && targetHeader.offsetParent !== null;

        if (isVisible) {
            if (state.queueListDiv.style.display === 'none') {
                state.queueListDiv.style.display = 'flex';
                state.statusDiv.style.display = 'block';

                const container = targetHeader.closest('.portlet, .panel, .modal-content, .card');
                if (container && !state.queueListDiv.dataset.manuallyResized) {
                    const containerWidth = container.offsetWidth;
                    const newWidth = Math.max(
                        CONFIG.MIN_SIDEBAR_WIDTH,
                        Math.min(containerWidth, CONFIG.MAX_SIDEBAR_WIDTH)
                    );
                    state.queueListDiv.style.width = newWidth + 'px';
                }
            }
        } else {
            state.queueListDiv.style.display = 'none';
            state.statusDiv.style.display = 'none';
        }
    }

    // ============================================
    // TIMER MANAGEMENT
    // ============================================
    function resetInactivityTimer() {
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = null;

        if (state.barcodeQueue.length > 0 && !state.isProcessing) {
            state.inactivityTimer = setTimeout(() => {
                console.log('⏱️ Inactivity detected, starting batch processing...');
                processBatchQueue();
            }, CONFIG.INACTIVITY_DELAY);
        }
        updateStatus();
    }

    // ============================================
    // QUEUE MANAGEMENT
    // ============================================
    function addToQueue(barcode) {
        if (!barcode || barcode.length === 0) return;

        if (state.barcodeQueue.includes(barcode)) {
            showNotification(`⚠️ ${barcode} already in queue`, 'warning');
            return;
        }

        const emptyMsg = document.getElementById('empty-msg');
        if (emptyMsg && emptyMsg.parentNode) {
            emptyMsg.parentNode.removeChild(emptyMsg);
        }

        state.barcodeQueue.push(barcode);

        const tbody = document.getElementById('batch-table-body');
        if (!tbody) return;

        const rowIndex = state.barcodeQueue.length - 1;
        const rowNum = rowIndex + 1;
        const location = calculateLocation(rowIndex);

        const tr = document.createElement('tr');
        tr.id = `row-${barcode}`;
        tr.style.cssText = "border-bottom: 1px solid #f1f1f1;";
        tr.innerHTML = `
            <td style="text-align: center; padding: 4px;">${rowNum}</td>
            <td style="text-align: left; padding: 4px; font-weight: bold; color: #333;">${barcode}</td>
            <td style="text-align: center; padding: 4px; color: #17a2b8;">${location}</td>
            <td class="status-cell" style="text-align: center; padding: 4px;">⏳</td>
        `;
        tbody.appendChild(tr);

        const container = tbody.closest('div[style*="overflow"]');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }

        console.log(`✅ Added to queue: ${barcode}`);
        showNotification(`✅ Added: ${barcode}`, 'success');
        updateStatus();
        resetInactivityTimer();
    }

    function clearQueue() {
        if (state.isProcessing) {
            showNotification('⚠️ Cannot clear while processing', 'warning');
            return;
        }

        state.barcodeQueue.length = 0;
        const tbody = document.getElementById('batch-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr id="empty-msg"><td colspan="4" style="text-align:center; padding:15px; color:#999;">No barcodes scanned</td></tr>';
        }
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = null;
        updateStatus();
    }

    // ============================================
    // ANGULAR INTEGRATION
    // ============================================
    function getAngularModel() {
        try {
            if (typeof angular === 'undefined') return null;
            const ngElement = angular.element(state.originalInput);
            return ngElement.controller('ngModel');
        } catch(e) {
            console.warn('Angular model access failed:', e);
            return null;
        }
    }

    function safeAngularApply(scope) {
        try {
            if (!scope) return;
            if (scope.$root && scope.$root.$$phase) {
                return;
            }
            scope.$apply();
        } catch(e) {
            console.warn('Angular $apply failed (might be okay):', e);
        }
    }

    // ============================================
    // BARCODE SUBMISSION
    // ============================================
    async function submitSingleBarcode(barcode, waitTime) {
        return new Promise((resolve) => {
            if (!state.originalInput || !state.originalContainer) {
                resolve();
                return;
            }

            state.originalContainer.style.display = 'block';
            state.originalInput.value = barcode;

            const ngModel = getAngularModel();
            if (ngModel) {
                ngModel.$setViewValue(barcode);
                ngModel.$render();

                const scope = angular.element(state.originalInput).scope();
                safeAngularApply(scope);
            }

            state.originalInput.focus();

            setTimeout(() => {
                const eventProps = {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                };

                state.originalInput.dispatchEvent(new KeyboardEvent('keydown', eventProps));

                setTimeout(() => {
                    state.originalInput.dispatchEvent(new KeyboardEvent('keypress', eventProps));
                    state.originalInput.dispatchEvent(new KeyboardEvent('keyup', eventProps));

                    setTimeout(() => {
                        state.originalInput.value = '';
                        if (ngModel) {
                            ngModel.$setViewValue('');
                            ngModel.$render();
                        }
                        resolve();
                    }, waitTime);
                }, 50);
            }, 50);
        });
    }

    // ============================================
    // BATCH PROCESSING
    // ============================================
    async function processBatchQueue() {
        if (state.isProcessing || state.barcodeQueue.length === 0) return;

        state.isProcessing = true;
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = null;
        updateStatus();

        showNotification(`🚀 Processing ${state.barcodeQueue.length} barcodes...`, 'info');

        const processList = [...state.barcodeQueue];

        for (let i = 0; i < processList.length; i++) {
            const barcode = processList[i];
            const row = document.getElementById(`row-${barcode}`);
            const statusCell = row ? row.querySelector('.status-cell') : null;
            const waitTime = (i === 0) ? CONFIG.FIRST_SUBMIT_WAIT : CONFIG.SUBSEQUENT_SUBMIT_WAIT;

            if (statusCell) {
                statusCell.innerHTML = '<span style="color:#ffc107">⏳ Processing...</span>';
            }

            try {
                await submitSingleBarcode(barcode, waitTime);

                const errorAlert = document.querySelector("div.alert.alert-danger");

                if (statusCell) {
                    if (errorAlert && errorAlert.offsetParent !== null) {
                        const errorMsg = errorAlert.querySelector('strong')?.innerText || 'Error';
                        statusCell.innerHTML = `<span style="color:red; font-weight:bold; font-size:10px;" title="${errorMsg}">${errorMsg.substring(0, 15)}...</span>`;

                        const closeBtn = errorAlert.querySelector('.close');
                        if (closeBtn) closeBtn.click();
                    } else {
                        statusCell.innerHTML = '<span style="color:green; font-weight:bold; font-size:14px;">✔️</span>';
                    }
                }

                console.log(`✅ Completed: ${barcode}`);
            } catch(error) {
                console.error(`❌ Error processing ${barcode}:`, error);
                if (statusCell) {
                    statusCell.innerHTML = '<span style="color:red; font-size:10px;">❌ Error</span>';
                }
            }
        }

        state.barcodeQueue.length = 0;
        if (state.originalContainer) {
            state.originalContainer.style.display = 'none';
        }
        state.isProcessing = false;
        updateStatus();

        showNotification('✅ All barcodes processed!', 'success');
        console.log('✅ Batch processing complete!');

        if (state.clonedInput) {
            state.clonedInput.focus();
        }
    }

    // ============================================
    // DRAGGABLE FUNCTIONALITY WITH SAVE
    // ============================================
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            // Save position after drag ends
            savePositionAndSize();
        }
    }

    // ============================================
    // RESIZE OBSERVER SETUP
    // ============================================
    function setupResizeObserver() {
        if (state.resizeObserver) {
            state.resizeObserver.disconnect();
        }

        state.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === state.queueListDiv) {
                    state.queueListDiv.dataset.manuallyResized = 'true';
                    // Debounce save to avoid too many writes
                    clearTimeout(state.resizeSaveTimer);
                    state.resizeSaveTimer = setTimeout(() => {
                        savePositionAndSize();
                    }, 500);
                }
            }
        });

        state.resizeObserver.observe(state.queueListDiv);
    }

    // ============================================
    // MAIN INITIALIZATION
    // ============================================
    function initializeScript(originalInput) {
        console.log('🚀 Initializing Barcode Batch Collector v3...');

        state.originalInput = originalInput;
        state.originalContainer = originalInput.closest('.form-group');

        if (!state.originalContainer) {
            console.error('❌ Could not find original container');
            return;
        }

        // --- 1. Create Cloned Input ---
        const clonedContainer = state.originalContainer.cloneNode(true);
        const clonedInput = clonedContainer.querySelector('#barcodecollection');

        clonedInput.id = 'barcodecollection-clone';
        clonedInput.placeholder = '🔄 Scan barcodes rapidly here...';
        clonedInput.style.cssText = 'border: 3px solid #17a2b8; background-color: #e7f9ff; font-weight: bold;';
        clonedInput.value = '';

        const clonedLabel = clonedContainer.querySelector('label');
        if (clonedLabel) {
            clonedLabel.textContent = '⚡ Rapid Scan Input (Batch Mode):';
            clonedLabel.style.cssText = 'color: #17a2b8; font-weight: bold;';
        }

        state.originalContainer.parentNode.insertBefore(clonedContainer, state.originalContainer);
        state.originalContainer.style.display = 'none';
        state.clonedInput = clonedInput;

        const separator = document.createElement('div');
        separator.style.cssText = 'border-top: 2px dashed #ddd; margin: 15px 0; padding-top: 10px;';
        state.originalContainer.parentNode.insertBefore(separator, state.originalContainer);

        // --- 2. Create Status Display ---
        state.statusDiv = document.createElement('div');
        state.statusDiv.id = 'batch-status';
        state.statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #28a745;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 13px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            min-width: 220px;
            display: none;
        `;
        state.statusDiv.innerHTML = '<strong>📋 Batch Mode:</strong> Ready';
        document.body.appendChild(state.statusDiv);

        // --- 3. Create Queue List Display ---
        state.queueListDiv = document.createElement('div');
        state.queueListDiv.id = 'batch-queue-list';
        
        // Check if we have saved position, otherwise use default
        const hasSavedPosition = loadPositionAndSize();
        
        state.queueListDiv.style.cssText = `
            position: fixed;
            ${hasSavedPosition ? '' : 'top: 140px; left: calc(50% - 200px);'}
            background: white;
            border: 2px solid #17a2b8;
            padding: 10px;
            border-radius: 8px;
            z-index: 10000;
            max-height: 80vh;
            overflow: hidden;
            ${hasSavedPosition ? '' : 'width: 400px;'}
            min-width: ${CONFIG.MIN_SIDEBAR_WIDTH}px;
            font-size: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            resize: both;
        `;

        state.queueListDiv.innerHTML = `
            <div id="batch-queue-header" style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom: 2px solid #17a2b8; padding-bottom:5px; cursor: move; user-select: none;">
                <div style="display:flex; align-items:center;">
                    <span style="font-size: 14px; margin-right: 5px;">🤚</span>
                    <strong style="color: #17a2b8;">📋 Batch Queue</strong>
                </div>
                <div>
                    <span id="queue-timer-display" style="color: #888; font-size: 11px; margin-right: 10px;"></span>
                    <span id="btn-close-batch" style="cursor: pointer; font-weight: bold; color: #888; font-size: 16px;">&times;</span>
                </div>
            </div>
            <div style="overflow-y: auto; flex-grow: 1; max-height: calc(100% - 40px);">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed;">
                    <thead style="position: sticky; top: 0; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.1); z-index: 5;">
                        <tr style="color: #555;">
                            <th style="width: 15%; padding: 4px; text-align: center; border-bottom: 1px solid #ddd;">No.</th>
                            <th style="width: 40%; padding: 4px; text-align: left; border-bottom: 1px solid #ddd;">Barcode</th>
                            <th style="width: 20%; padding: 4px; text-align: center; border-bottom: 1px solid #ddd;">Loc</th>
                            <th style="width: 25%; padding: 4px; text-align: center; border-bottom: 1px solid #ddd;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="batch-table-body">
                        <tr id="empty-msg"><td colspan="4" style="text-align:center; padding:15px; color:#999;">No barcodes scanned</td></tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 5px; font-size: 10px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 5px;">
                📐 Drag header to move • Drag corner to resize | <a href="#" id="btn-clear-queue" style="color:#dc3545; text-decoration:none;">Clear</a>
            </div>
        `;
        document.body.appendChild(state.queueListDiv);

        // Apply saved position and size from session
        applyPositionAndSize();

        // Setup resize observer to track manual resizing
        setupResizeObserver();

        // --- 4. Event Listeners ---
        document.getElementById('btn-close-batch').onclick = () => {
            state.queueListDiv.style.display = 'none';
            state.statusDiv.style.display = 'none';
            state.userClosed = true;
            savePositionAndSize();
            showNotification("Batch Scanner hidden. Refresh page to restore.", "info");
        };

        document.getElementById('btn-clear-queue').onclick = (e) => {
            e.preventDefault();
            clearQueue();
        };

        const header = document.getElementById("batch-queue-header");
        makeDraggable(state.queueListDiv, header);

        clonedInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const barcode = clonedInput.value.trim();
                if (barcode.length > 0) {
                    addToQueue(barcode);
                    clonedInput.value = '';
                }
            }
        });

        let scanTimer = null;
        clonedInput.addEventListener('input', (e) => {
            clearTimeout(scanTimer);
            const currentValue = e.target.value.trim();

            scanTimer = setTimeout(() => {
                if (currentValue.length > 0) {
                    addToQueue(currentValue);
                    clonedInput.value = '';
                }
            }, CONFIG.SCAN_INPUT_DEBOUNCE);
        });

        // --- 5. Start Visibility Monitoring ---
        state.visibilityInterval = setInterval(checkContextVisibility, CONFIG.VISIBILITY_CHECK_INTERVAL);

        console.log('✅ Barcode Batch Collector v3 initialized with FREE positioning');
        updateStatus();
        clonedInput.focus();
    }

    // ============================================
    // STARTUP
    // ============================================
    const initialInput = document.querySelector('#barcodecollection');
    if (initialInput && !document.getElementById('barcodecollection-clone')) {
        initializeScript(initialInput);
    }

    setupMutationObserver();

    console.log('👀 Barcode Scanner v3 watching for page changes...');
})();
