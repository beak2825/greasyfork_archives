// ==UserScript==
// @name         Batch Management Script - MultiPP
// @namespace    http://tampermonkey.net/
// @version      1.41
// @author       @NOWARATN
// @description  Manage batch limits with UI and Slack notifications
// @match        https://picking-console.eu.picking.aft.a2z.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558502/Batch%20Management%20Script%20-%20MultiPP.user.js
// @updateURL https://update.greasyfork.org/scripts/558502/Batch%20Management%20Script%20-%20MultiPP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let PROCESS_PATHS = ['PPMultiMedium'];
    const FC = 'KTW1';
    const BATCH_INFO_URL_ACTIVE = `https://picking-console.eu.picking.aft.a2z.com/api/fcs/${FC}/batch-info/Active`;
    const BATCH_INFO_URL_READY = `https://picking-console.eu.picking.aft.a2z.com/api/fcs/${FC}/batch-info/Ready`;
    const SLACK_WEBHOOK_URL = '';

    const pathStates = {};
    PROCESS_PATHS.forEach(path => {
        pathStates[path] = {
            originalLimit: 0,
            originalActiveCount: 0,
            isIncreased: false,
            currentPathSettings: null,
            increasedCheckTimeout: null
        };
    });


    let isRunning = false;
    let checkInterval = null;

    // Załaduj zapisaną konfigurację
    loadConfiguration();

    // Utwórz UI
    createUI();

    // Rozpocznij monitorowanie wszystkich ścieżek
    PROCESS_PATHS.forEach(path => manageBatchLimits(path, true));

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
            min-width: 300px;
        }
        .path-section {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 5px;
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
        }
        .info-value {
            color: #228be6;
        }
        .last-update {
            font-size: small;
            color: #868e96;
            margin-top: 5px;
        }

        .path-management {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 5px;
    }

    .path-input {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }

    .path-input input {
        flex-grow: 1;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .path-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 10px;
    }

    .path-tag {
        background-color: #e9ecef;
        padding: 5px 10px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .remove-path {
        cursor: pointer;
        color: #ff6b6b;
        font-weight: bold;
    }
`);

    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'batchManagementUI';

        ui.innerHTML = `
        <div class="path-management">
            <h3>Process Paths Management</h3>
            <div class="path-input">
                <input type="text" id="newPathInput" placeholder="Enter process path (e.g., PPMultiMedium)">
                <button id="addPathButton">Add Path</button>
            </div>
            <div class="path-list" id="pathList"></div>
        </div>
        <div id="pathSections"></div>
        <button id="startButton" class="stopped">Start Monitoring</button>
        <button id="refreshButton">Refresh Data</button>
        <button id="resetButton">Reset All Limits</button>
        <div class="last-update" id="lastUpdate"></div>
    `;

        document.body.appendChild(ui);

        // Dodaj obsługę dodawania/usuwania ścieżek
        setupPathManagement();

        // Dodaj pozostałe event listenery
        document.getElementById('startButton').addEventListener('click', toggleMonitoring);
        document.getElementById('refreshButton').addEventListener('click', refreshAllPaths);
        document.getElementById('resetButton').addEventListener('click', resetAllBatchLimits);

        // Początkowe renderowanie ścieżek
        renderPathSections();
    }

    // Dodaj nowe funkcje do zarządzania ścieżkami:
    function setupPathManagement() {
        const addPathButton = document.getElementById('addPathButton');
        const newPathInput = document.getElementById('newPathInput');

        addPathButton.addEventListener('click', () => {
            addNewPath();
        });

        newPathInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addNewPath();
            }
        });

        renderPathList();
    }

    function addNewPath() {
        const newPathInput = document.getElementById('newPathInput');
        const pathName = newPathInput.value.trim();

        if (pathName && !PROCESS_PATHS.includes(pathName)) {
            PROCESS_PATHS.push(pathName);
            pathStates[pathName] = {
                originalLimit: 0,
                originalActiveCount: 0,
                isIncreased: false,
                currentPathSettings: null,
                increasedCheckTimeout: null
            };

            newPathInput.value = '';
            renderPathList();
            renderPathSections();

            // Rozpocznij monitorowanie nowej ścieżki
            if (isRunning) {
                manageBatchLimits(pathName, true);
            }

            // Zapisz konfigurację
            saveConfiguration();
        }
    }

    function removePath(pathName) {
        const index = PROCESS_PATHS.indexOf(pathName);
        if (index > -1) {
            PROCESS_PATHS.splice(index, 1);
            delete pathStates[pathName];
            renderPathList();
            renderPathSections();
            saveConfiguration();
        }
    }

    function renderPathList() {
        const pathList = document.getElementById('pathList');
        pathList.innerHTML = PROCESS_PATHS.map(path => `
        <div class="path-tag">
            ${path}
            <span class="remove-path" data-path="${path}">×</span>
        </div>
    `).join('');

        // Dodaj event listenery do wszystkich przycisków usuwania
        const removeButtons = pathList.querySelectorAll('.remove-path');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pathName = this.getAttribute('data-path');
                removePath(pathName);
            });
        });
    }



    function renderPathSections() {
        const pathSections = document.getElementById('pathSections');
        pathSections.innerHTML = PROCESS_PATHS.map(path => `
        <div class="path-section" id="section-${path}">
            <h3>
                <span class="status-indicator status-inactive"></span>
                ${path}
            </h3>
            <div class="info-row">
                <span class="info-label">Active:</span>
                <span class="info-value" id="activeBatches-${path}">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Ready:</span>
                <span class="info-value" id="readyBatches-${path}">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Current Limit:</span>
                <span class="info-value" id="currentLimit-${path}">-</span>
            </div>
            <div class="info-row">
                <span class="info-label">Original Limit:</span>
                <span class="info-value" id="originalLimit-${path}">-</span>
            </div>
        </div>
    `).join('');
    }

    // Dodaj funkcje zapisu i odczytu konfiguracji:
    function saveConfiguration() {
        localStorage.setItem('batchManagementPaths', JSON.stringify(PROCESS_PATHS));
    }

    function loadConfiguration() {
        let savedPaths = localStorage.getItem('batchManagementPaths');
        if (savedPaths) {
            PROCESS_PATHS = JSON.parse(savedPaths);
            PROCESS_PATHS.forEach(path => {
                if (!pathStates[path]) {
                    pathStates[path] = {
                        originalLimit: 0,
                        originalActiveCount: 0,
                        isIncreased: false,
                        currentPathSettings: null,
                        increasedCheckTimeout: null
                    };
                }
            });
        }
    }

    // Dodaj funkcję do odświeżania wszystkich ścieżek:
    function refreshAllPaths() {
        PROCESS_PATHS.forEach(path => manageBatchLimits(path, true));
    }


    function updateUI(path, active, ready, limit) {
        document.getElementById(`activeBatches-${path}`).textContent = active;
        document.getElementById(`readyBatches-${path}`).textContent = ready;
        document.getElementById(`currentLimit-${path}`).textContent = limit;
        document.getElementById(`originalLimit-${path}`).textContent = pathStates[path].originalLimit;
        document.getElementById('lastUpdate').textContent =
            `Last update: ${new Date().toLocaleTimeString()}`;

        updateStatusIndicator();
    }

    function updateStatusIndicator() {
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            indicator.className = `status-indicator ${isRunning ? 'status-active' : 'status-inactive'}`;
        });
    }

    function toggleMonitoring() {
        isRunning = !isRunning;
        const button = document.getElementById('startButton');

        if (isRunning) {
            button.textContent = 'Stop Monitoring';
            button.className = 'running';
            PROCESS_PATHS.forEach(path => manageBatchLimits(path, true));
            checkInterval = setInterval(() => {
                PROCESS_PATHS.forEach(path => manageBatchLimits(path, false));
            }, 1 * 60 * 1000);
            sendSlackNotification('Batch Management monitoring started for all paths');
        } else {
            button.textContent = 'Start Monitoring';
            button.className = 'stopped';
            clearInterval(checkInterval);
            PROCESS_PATHS.forEach(path => {
                if (pathStates[path].increasedCheckTimeout) {
                    clearTimeout(pathStates[path].increasedCheckTimeout);
                }
            });
            sendSlackNotification('Batch Management monitoring stopped for all paths');
        }

        updateStatusIndicator();
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

    function getProcessPathInfo(processPath) {
        const url = `https://process-path.eu.picking.aft.a2z.com/api/processpath/${FC}/processPathDetailsWithUtilizationTargetList/${processPath}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        pathStates[processPath].currentPathSettings = data.processPathUserSettings;
                        resolve(data);
                    } else {
                        reject(`Failed to fetch process path info for ${processPath}`);
                    }
                },
                onerror: reject
            });
        });
    }

    function updateBatchLimit(processPath, newLimit) {
        if (!pathStates[processPath].currentPathSettings) {
            return Promise.reject(`No current settings available for ${processPath}`);
        }

        const updatedSettings = {
            processPathUserSettings: {
                ...pathStates[processPath].currentPathSettings,
                openBatchQuantityLimit: newLimit
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PUT",
                url: `https://process-path.eu.picking.aft.a2z.com/api/processpath/${FC}/processPathUserSettings/${processPath}`,
                data: JSON.stringify(updatedSettings),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        pathStates[processPath].currentPathSettings = updatedSettings.processPathUserSettings;
                        resolve('Batch limit updated successfully');
                    } else {
                        reject(`Failed to update batch limit for ${processPath}`);
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

    async function manageBatchLimits(processPath, isManualCheck = false) {
        if (!isRunning && !isManualCheck) return;

        try {
            const batchInfo = await getBatchInfo();
            const processPathInfo = await getProcessPathInfo(processPath);

            let activeBatches = 0;
            let readyBatches = 0;

            batchInfo.active.pickBatchInformationList.forEach(batch => {
                if (batch.processPath === processPath && batch.status === "PICKING_STARTED") {
                    activeBatches++;
                }
            });

            batchInfo.ready.pickBatchInformationList.forEach(batch => {
                if (batch.processPath === processPath && batch.status === "ACTIVATED_FOR_PICKING") {
                    readyBatches++;
                }
            });

            const currentLimit = processPathInfo.processPathUserSettings.openBatchQuantityLimit;
            if (pathStates[processPath].originalLimit === 0) {
                pathStates[processPath].originalLimit = currentLimit;
            }

            updateUI(processPath, activeBatches, readyBatches, currentLimit);

            if (isRunning) {
                if (!pathStates[processPath].isIncreased &&
                    readyBatches > 0 &&
                    readyBatches < 0.3 * activeBatches) {

                    const newLimit = activeBatches + 10;

                    if (newLimit !== currentLimit) {
                        await updateBatchLimit(processPath, newLimit);
                        pathStates[processPath].isIncreased = true;
                        sendSlackNotification(
                            `[${processPath}] Batch limit increased from ${currentLimit} to ${newLimit}\n` +
                            `Current status: Active=${activeBatches}, Ready=${readyBatches}`
                        );

                        if (pathStates[processPath].increasedCheckTimeout) {
                            clearTimeout(pathStates[processPath].increasedCheckTimeout);
                        }
                        pathStates[processPath].increasedCheckTimeout = setTimeout(
                            () => manageBatchLimits(processPath, false),
                            20000
                        );
                    }
                }
                else if (pathStates[processPath].isIncreased && readyBatches >= 0.3 * activeBatches) {
                    if (currentLimit !== pathStates[processPath].originalLimit) {
                        await updateBatchLimit(processPath, pathStates[processPath].originalLimit);
                        pathStates[processPath].isIncreased = false;
                        sendSlackNotification(
                            `[${processPath}] Batch limit reverted from ${currentLimit} to ${pathStates[processPath].originalLimit}\n` +
                            `Current status: Active=${activeBatches}, Ready=${readyBatches}`
                        );
                    }
                }
            }
        } catch (error) {
            console.error(`Error in ${processPath}:`, error);
            sendSlackNotification(`Error in Batch Management for ${processPath}: ${error.message}`);
        }
    }

    async function resetBatchLimit(processPath) {
        if (!isRunning) {
            try {
                const processPathInfo = await getProcessPathInfo(processPath);
                const currentLimit = processPathInfo.processPathUserSettings.openBatchQuantityLimit;
                await updateBatchLimit(processPath, pathStates[processPath].originalLimit);
                sendSlackNotification(
                    `[${processPath}] Batch limit manually resWet from ${currentLimit} to ${pathStates[processPath].originalLimit}`
                );
                manageBatchLimits(processPath, true);
            } catch (error) {
                console.error(`Error resetting batch limit for ${processPath}:`, error);
                sendSlackNotification(`Error resetting batch limit for ${processPath}: ${error.message}`);
            }
        }
    }

    async function resetAllBatchLimits() {
        if (!isRunning) {
            for (const path of PROCESS_PATHS) {
                try {
                    await resetBatchLimit(path);
                } catch (error) {
                    console.error(`Error resetting batch limit for ${path}:`, error);
                }
            }
        } else {
            alert('Please stop monitoring before manual reset');
        }
    }
})();
