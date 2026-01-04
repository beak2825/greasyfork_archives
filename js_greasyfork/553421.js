// ==UserScript==
// @name         Batch Management Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       @NOWARATN
// @description  Manage batch limits with UI and Slack notifications
// @match        https://picking-console.eu.picking.aft.a2z.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553421/Batch%20Management%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/553421/Batch%20Management%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESS_PATH = 'PPMultiMedium';
    const FC = 'KTW1';
    const BATCH_INFO_URL_ACTIVE = `https://picking-console.eu.picking.aft.a2z.com/api/fcs/${FC}/batch-info/Active`;
    const BATCH_INFO_URL_READY = `https://picking-console.eu.picking.aft.a2z.com/api/fcs/${FC}/batch-info/Ready`;
    const PROCESS_PATH_URL = `https://process-path.eu.picking.aft.a2z.com/api/processpath/${FC}/processPathDetailsWithUtilizationTargetList/${PROCESS_PATH}`;
    const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

    let originalLimit = 0;
    let originalActiveCount = 0;
    let isIncreased = false;
    let isRunning = false;
    let checkInterval = null;
    let increasedCheckTimeout = null;
    let currentPathSettings = null;

    // Add styles for the UI
    GM_addStyle(`
        #batchManagementUI {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            min-width: 200px;
        }
        #batchManagementUI h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        #batchManagementUI button {
            margin: 5px;
            padding: 5px 10px;
            border-radius: 3px;
            border: 1px solid #ccc;
            cursor: pointer;
        }
        #batchManagementUI button:hover {
            background-color: #f0f0f0;
        }
        #startButton.running {
            background-color: #ff6b6b;
        }
        #startButton.stopped {
            background-color: #51cf66;
        }
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }
        .status-active {
            background-color: #51cf66;
        }
        .status-inactive {
            background-color: #ff6b6b;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 3px;
            background-color: #f8f9fa;
            border-radius: 3px;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
            font-size: large;
        }
        .info-value {
            color: #228be6;
            font-size: large;
        }
        .last-update {
            font-size: larger;
            color: #868e96;
            margin-top: 5px;
        }
    `);

    // Create UI
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'batchManagementUI';
        ui.innerHTML = `
        <h3>
            <span class="status-indicator status-inactive"></span>
            Batch Management (PPMultiMedium)
        </h3>
            <div class="info-row">
                <span class="info-label">Active:</span>
                <span class="info-value" id="activeBatches">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Ready:</span>
                <span class="info-value" id="readyBatches">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Current Limit:</span>
                <span class="info-value" id="currentLimit">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Original Limit:</span>
                <span class="info-value" id="originalLimitDisplay">-</span>
            </div>
            <button id="startButton" class="stopped">Start Monitoring</button>
            <button id="refreshButton">Refresh Data</button>
            <button id="resetButton">Reset Limit</button>
            <div class="last-update" id="lastUpdate"></div>
        `;
        document.body.appendChild(ui);

        // Dodaj listeners
        document.getElementById('startButton').addEventListener('click', toggleMonitoring);
        document.getElementById('refreshButton').addEventListener('click', () => {
            manageBatchLimits(true);
        });
        document.getElementById('resetButton').addEventListener('click', resetBatchLimit);
    }

    function updateUI(active, ready, limit) {
        document.getElementById('activeBatches').textContent = active;
        document.getElementById('readyBatches').textContent = ready;
        document.getElementById('currentLimit').textContent = limit;
        document.getElementById('originalLimitDisplay').textContent = originalLimit;
        document.getElementById('lastUpdate').textContent =
            `Last update: ${new Date().toLocaleTimeString()}`;

        updateStatusIndicator();
    }

    function updateStatusIndicator() {
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${isRunning ? 'status-active' : 'status-inactive'}`;
        }
    }

    function toggleMonitoring() {
        isRunning = !isRunning;
        const button = document.getElementById('startButton');

        if (isRunning) {
            button.textContent = 'Stop Monitoring';
            button.className = 'running';
            manageBatchLimits(true);
            checkInterval = setInterval(() => manageBatchLimits(false), 1 * 60 * 1000);
            sendSlackNotification('Batch Management monitoring started');
        } else {
            button.textContent = 'Start Monitoring';
            button.className = 'stopped';
            clearInterval(checkInterval);
            if (increasedCheckTimeout) {
                clearTimeout(increasedCheckTimeout);
            }
            sendSlackNotification('Batch Management monitoring stopped');
        }

        updateStatusIndicator(); // Aktualizuj wskaźnik po zmianie stanu
    }

    async function getBatchInfo() {
        try {
            const [activeResponse, readyResponse] = await Promise.all([
                new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: BATCH_INFO_URL_ACTIVE,
                        onload: function(response) {
                            if (response.status === 200) {
                                resolve(JSON.parse(response.responseText));
                            } else {
                                reject('Failed to fetch active batch info');
                            }
                        },
                        onerror: reject
                    });
                }),
                new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: BATCH_INFO_URL_READY,
                        onload: function(response) {
                            if (response.status === 200) {
                                resolve(JSON.parse(response.responseText));
                            } else {
                                reject('Failed to fetch ready batch info');
                            }
                        },
                        onerror: reject
                    });
                })
            ]);

            return {
                active: activeResponse,
                ready: readyResponse
            };
        } catch (error) {
            throw new Error(`Failed to fetch batch info: ${error.message}`);
        }
    }


    function getProcessPathInfo() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: PROCESS_PATH_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        // Zapisz pełne ustawienia przy każdym pobraniu
                        currentPathSettings = data.processPathUserSettings;
                        resolve(data);
                    } else {
                        reject('Failed to fetch process path info');
                    }
                },
                onerror: reject
            });
        });
    }

    function updateBatchLimit(newLimit) {
        if (!currentPathSettings) {
            return Promise.reject('No current settings available');
        }

        const updatedSettings = {
            processPathUserSettings: {
                ...currentPathSettings,
                openBatchQuantityLimit: newLimit
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PUT",
                url: `https://process-path.eu.picking.aft.a2z.com/api/processpath/${FC}/processPathUserSettings/${PROCESS_PATH}`,
                data: JSON.stringify(updatedSettings),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        // Aktualizuj zapisane ustawienia po udanej zmianie
                        currentPathSettings = updatedSettings.processPathUserSettings;
                        resolve('Batch limit updated successfully');
                    } else {
                        reject('Failed to update batch limit');
                    }
                },
                onerror: reject
            });
        });
    }
    function sendSlackNotification(message) {
        GM_xmlhttpRequest({
            method: "POST",
            url: SLACK_WEBHOOK_URL,
            data: JSON.stringify({ text: message }),
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                if (response.status !== 200) {
                    console.error('Failed to send Slack notification');
                }
            },
            onerror: function(error) {
                console.error('Error sending Slack notification:', error);
            }
        });
    }


    async function manageBatchLimits(isManualCheck = false) {
        if (!isRunning && !isManualCheck) return;

        try {
            const batchInfo = await getBatchInfo();
            const processPathInfo = await getProcessPathInfo();

            let activeBatches = 0;
            let readyBatches = 0;

            // Liczenie batchy w statusie Active
            batchInfo.active.pickBatchInformationList.forEach(batch => {
                if (batch.processPath === PROCESS_PATH && batch.status === "PICKING_STARTED") {
                    activeBatches++;
                }
            });

            // Liczenie batchy w statusie Ready
            batchInfo.ready.pickBatchInformationList.forEach(batch => {
                if (batch.processPath === PROCESS_PATH && batch.status === "ACTIVATED_FOR_PICKING") {
                    readyBatches++;
                }
            });

            const currentLimit = processPathInfo.processPathUserSettings.openBatchQuantityLimit;
            if (originalLimit === 0) originalLimit = currentLimit;
            updateUI(activeBatches, readyBatches, currentLimit);

            console.log(`Status: Active=${activeBatches}, Ready=${readyBatches}, Current Limit=${currentLimit}, Original Limit=${originalLimit}`);

            if (isRunning) {
                if (!isIncreased &&
                    readyBatches > 0 &&
                    readyBatches < 0.3 * activeBatches) {

                    const newLimit = activeBatches + 10;

                    console.log(`Increasing limit: ${currentLimit} -> ${newLimit}`);

                    if (newLimit !== currentLimit) {
                        await updateBatchLimit(newLimit);
                        isIncreased = true;
                        sendSlackNotification(
                            `Batch limit increased from ${currentLimit} to ${newLimit}\n` +
                            `Current status: Active=${activeBatches}, Ready=${readyBatches}`
                        );

                        if (increasedCheckTimeout) clearTimeout(increasedCheckTimeout);
                        increasedCheckTimeout = setTimeout(() => manageBatchLimits(false), 20000);
                    }
                }
                else if (isIncreased && readyBatches >= 0.3 * activeBatches) {

                    if (currentLimit !== originalLimit) {
                        await updateBatchLimit(originalLimit);
                        isIncreased = false;
                        sendSlackNotification(
                            `Batch limit reverted from ${currentLimit} to ${originalLimit}\n` +
                            `Current status: Active=${activeBatches}, Ready=${readyBatches}`
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            sendSlackNotification(`Error in Batch Management: ${error.message}`);
        }
    }


    async function resetBatchLimit() {
        if (!isRunning) {
            try {
                const processPathInfo = await getProcessPathInfo();
                const currentLimit = processPathInfo.processPathUserSettings.openBatchQuantityLimit;
                await updateBatchLimit(originalLimit);
                sendSlackNotification(`Batch limit manually reset from ${currentLimit} to ${originalLimit}`);
                manageBatchLimits(true);
            } catch (error) {
                console.error('Error resetting batch limit:', error);
                sendSlackNotification(`Error resetting batch limit: ${error.message}`);
            }
        } else {
            alert('Please stop monitoring before manual reset');
        }
    }

    createUI();
    manageBatchLimits(true);

})();
