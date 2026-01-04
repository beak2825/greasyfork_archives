// ==UserScript==
// @name         Cowz.io Account Manager
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Manage multiple Cowz.io accounts with a compact UI. Edit, switch, create, and backup profiles.
// @author       gozzy
// @license MIT 
// @match        https://cowz.io/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/549535/Cowzio%20Account%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/549535/Cowzio%20Account%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG_KEY = 'config';
    const STORAGE_KEY = 'cowz_account_manager_profiles';

    let profiles = {};
    let currentProfileId = null;

    const stopKeyPropagation = (e) => {
        e.stopPropagation();
    };

    function addStyles() {
        GM_addStyle(`
            #accountManagerContainer {
                position: fixed; top: 10px; left: 10px;
                width: 340px;
                background-color: rgba(25, 25, 30, 0.95);
                border: 1px solid #555;
                color: #ddd;
                font-family: 'Lato', sans-serif; font-size: 14px;
                z-index: 200000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                display: none;
                flex-direction: column;
            }
            #accountManagerHeader {
                padding: 8px 12px; background-color: #111;
                font-weight: bold; color: #fff;
                border-bottom: 1px solid #555;
                display: flex; justify-content: space-between; align-items: center;
                user-select: none;
            }
            #accountManagerToggleBtn {
                position: fixed; top: 10px; left: 10px;
                width: 36px; height: 36px;
                background-color: rgba(25, 25, 30, 0.95);
                border: 1px solid #555;
                color: #fff; font-size: 20px;
                cursor: pointer; z-index: 199999;
                display: flex; align-items: center; justify-content: center;
                user-select: none;
                transition: background-color 0.2s;
            }
            #accountManagerToggleBtn:hover { background-color: #333; }
            #accountManagerBody { padding: 8px; max-height: 45vh; overflow-y: auto; }
            .account-entry {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 10px;
                align-items: center;
                margin-bottom: 5px; padding: 8px;
                background-color: rgba(255, 255, 255, 0.03);
                border: 1px solid transparent;
                border-radius: 3px;
                transition: background-color 0.2s, border-color 0.2s;
                cursor: pointer;
            }
            .account-entry:hover { background-color: rgba(255, 255, 255, 0.08); }
            .account-entry.active { border-left: 3px solid #ffff00; background-color: rgba(255, 255, 0, 0.1); }
            .account-entry .select-icon { font-size: 16px; color: #888; }
            .account-entry.active .select-icon { color: #ffff00; }
            .account-details { display: flex; flex-direction: column; }
            .account-name { font-weight: bold; color: #fff; }
            .account-id { font-size: 11px; color: #777; }
            .account-actions { display: flex; }
            .account-actions button {
                background: none; border: none; color: #888; cursor: pointer;
                font-size: 18px; padding: 0 4px;
            }
            .account-actions button:hover { color: #fff; }
            #accountManagerFooter {
                padding: 8px; border-top: 1px solid #555;
                background-color: #111;
                display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
            }
            .manager-btn {
                padding: 8px 10px; background-color: #333;
                color: #ddd; border: 1px solid #555; cursor: pointer;
                font-size: 12px; text-align: center;
                transition: background-color 0.2s;
            }
            .manager-btn:hover { background-color: #4f4f5f; }
            .manager-btn.new-acc-btn { background-color: #3a6e3a; }
            .manager-btn.new-acc-btn:hover { background-color: #4a8e4a; }
            #importFile { display: none; }

            #editModalOverlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); z-index: 200001;
                display: none; align-items: center; justify-content: center;
            }
            #editModal { width: 90%; max-width: 600px; background: #191919; border: 1px solid #555; }
            #editModal textarea { width: 100%; height: 50vh; background: #111; color: #ddd; border: none; border-bottom: 1px solid #555; padding: 10px; resize: vertical; font-family: monospace; font-size: 12px; }
            .modal-actions { display: flex; }
            .modal-actions .manager-btn { flex-grow: 1; }

            #accountManagerCloseBtn { cursor: pointer; font-size: 22px; font-weight: bold; line-height: 1; padding: 0 5px; }
            #accountManagerCloseBtn:hover { color: #ff4d4d; }
        `);
    }

    async function loadProfiles() {
        const storedProfiles = await GM_getValue(STORAGE_KEY, "{}");
        try {
            profiles = JSON.parse(storedProfiles);
        } catch (e) {
            profiles = {};
        }
    }

    async function saveProfiles() {
        await GM_setValue(STORAGE_KEY, JSON.stringify(profiles));
    }

    function renderUI() {
        let container = document.getElementById('accountManagerContainer');
        if (!container) return;

        let bodyHtml = '';
        if (Object.keys(profiles).length === 0) {
            bodyHtml = '<p style="text-align: center; padding: 10px;">No profiles saved yet.</p>';
        } else {
            for (const playerId in profiles) {
                const profile = profiles[playerId];
                const isActive = playerId === currentProfileId ? 'active' : '';
                bodyHtml += `
                    <div class="account-entry ${isActive}" data-action="select" data-id="${playerId}">
                        <div class="select-icon">${isActive ? '➔' : '●'}</div>
                        <div class="account-details">
                            <div class="account-name" data-id="${playerId}">${profile.name || '(No Name)'}</div>
                            <div class="account-id">${playerId.substring(24, 36)}</div>
                        </div>
                        <div class="account-actions">
                           <button data-action="edit-name" data-id="${playerId}" title="Edit Name">✏️</button>
                           <button data-action="edit-config" data-id="${playerId}" title="Edit Config">⚙️</button>
                           <button data-action="delete" data-id="${playerId}" title="Delete Profile">🗑️</button>
                        </div>
                    </div>
                `;
            }
        }
        document.getElementById('accountManagerBody').innerHTML = bodyHtml;
        addUIEventListeners();
    }

    function createUI() {
        if (document.getElementById('accountManagerContainer')) return;




        const stopPropagation = (e) => {
            e.stopPropagation();
        };

        const toggleManagerVisibility = (forceClose = false) => {
            const container = document.getElementById('accountManagerContainer');
            const isVisible = container.style.display === 'flex';
            const shouldBeVisible = !isVisible && !forceClose;

            container.style.display = shouldBeVisible ? 'flex' : 'none';
        };

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'accountManagerToggleBtn';
        toggleBtn.textContent = '👤';
        document.body.appendChild(toggleBtn);
        toggleBtn.addEventListener('mousedown', stopPropagation);
        toggleBtn.addEventListener('keydown', stopPropagation);
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleManagerVisibility();
        });

        const container = document.createElement('div');
        container.id = 'accountManagerContainer';
        container.innerHTML = `
            <div id="accountManagerHeader">
                <span>Account Manager</span>
                <span id="accountManagerCloseBtn" title="Close Window">×</span>
            </div>
            <div id="accountManagerBody"></div>
            <div id="accountManagerFooter"></div>
        `;
        document.body.appendChild(container);
        container.addEventListener('mousemove', (e) => {
            e.stopPropagation();
        });

        container.addEventListener('mousedown', stopPropagation);
        container.addEventListener('keydown', stopPropagation);

        document.getElementById('accountManagerCloseBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleManagerVisibility(true);
        });

        const footer = document.getElementById('accountManagerFooter');
        const newAccBtn = document.createElement('button');
        newAccBtn.className = 'manager-btn new-acc-btn';
        newAccBtn.textContent = 'New Account';
        newAccBtn.addEventListener('click', createNewAccount);

        const exportBtn = document.createElement('button');
        exportBtn.className = 'manager-btn';
        exportBtn.textContent = 'Export';
        exportBtn.addEventListener('click', exportAccounts);

        const importBtn = document.createElement('button');
        importBtn.className = 'manager-btn';
        importBtn.textContent = 'Import';

        const importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.id = 'importFile';
        importFileInput.style.display = 'none';

        importBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', importAccounts);

        footer.append(newAccBtn, exportBtn, importBtn, importFileInput);

        const modal = document.createElement('div');
        modal.id = 'editModalOverlay';
        modal.innerHTML = `
            <div id="editModal">
                <textarea id="configTextArea"></textarea>
                <div class="modal-actions">
                    <button id="saveConfigBtn" class="manager-btn">Save & Reload</button>
                    <button id="cancelConfigBtn" class="manager-btn">Cancel</button>
                </div>
            </div>
        `;
        modal.addEventListener('mousedown', stopPropagation);
        modal.addEventListener('keydown', stopPropagation);
        document.body.appendChild(modal);
    }

    function addUIEventListeners() {
        document.querySelectorAll('.account-entry[data-action="select"]').forEach(entry => {
            entry.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.closest('.account-actions')) return;
                switchAccount(e.currentTarget.dataset.id);
            });
        });

        document.querySelectorAll('.account-actions button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                const id = e.currentTarget.dataset.id;
                if (action === 'delete') deleteAccount(id);
                if (action === 'edit-name') editAccountName(id);
                if (action === 'edit-config') editAccountConfig(id);
            });
        });
    }

    function switchAccount(playerId) {
        if (profiles[playerId]) {
            localStorage.setItem(CONFIG_KEY, profiles[playerId].config);
            currentProfileId = playerId;
            console.log(`Switched to account: ${profiles[playerId].name}`);
            location.reload();
        }
    }

    function createNewAccount() {
        if (confirm("This will clear your current session and reload the page to create a new account. Are you sure?")) {
            localStorage.removeItem(CONFIG_KEY);
            location.reload();
        }
    }

    function editAccountName(playerId) {
        const nameElement = document.querySelector(`.account-name[data-id="${playerId}"]`);
        const currentName = nameElement.textContent;
        const newName = prompt("Enter new name for the account:", currentName);
        if (newName && newName.trim() !== "") {
            profiles[playerId].name = newName.trim();
            const config = JSON.parse(profiles[playerId].config);
            config.name = newName.trim();
            profiles[playerId].config = JSON.stringify(config);
            saveProfiles();
            renderUI();
        }
    }

    function editAccountConfig(playerId) {
        const modal = document.getElementById('editModalOverlay');
        const textarea = document.getElementById('configTextArea');
        const saveBtn = document.getElementById('saveConfigBtn');
        const cancelBtn = document.getElementById('cancelConfigBtn');

        try {
            const config = JSON.parse(profiles[playerId].config);
            textarea.value = JSON.stringify(config, null, 2);
            modal.style.display = 'flex';

            saveBtn.onclick = () => {
                try {
                    const newConfig = JSON.parse(textarea.value);
                    if (!newConfig.playerId) throw new Error("playerId is missing.");

                    if (newConfig.playerId === playerId) {
                        profiles[playerId].config = JSON.stringify(newConfig);
                        profiles[playerId].name = newConfig.name;
                    } else {
                        delete profiles[playerId];
                        profiles[newConfig.playerId] = {
                            name: newConfig.name,
                            config: JSON.stringify(newConfig)
                        };
                    }

                    saveProfiles();
                    modal.style.display = 'none';
                    switchAccount(newConfig.playerId);
                } catch (e) {
                    alert("Invalid JSON format! Please check your syntax.");
                    console.error("Config save error:", e);
                }
            };
            cancelBtn.onclick = () => {
                modal.style.display = 'none';
            };

        } catch (e) {
            alert("Could not parse profile config. It might be corrupted.");
        }
    }

    function deleteAccount(playerId) {
        if (profiles[playerId] && confirm(`Delete profile "${profiles[playerId].name}"?`)) {
            delete profiles[playerId];
            if (currentProfileId === playerId) {
                currentProfileId = null;
                localStorage.removeItem(CONFIG_KEY);
            }
            saveProfiles();
            renderUI();
        }
    }

    function exportAccounts() {
        const dataLines = Object.values(profiles).map(profile => profile.config);
        const dataStr = dataLines.join('\n');

        const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'cowz_accounts_backup.txt';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        console.log("Accounts exported in raw config format.");
    }

    function importAccounts(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const content = e.target.result;
                const lines = content.split('\n').filter(line => line.trim().startsWith('{'));

                if (lines.length === 0) {
                    throw new Error("File is empty or contains no valid config lines.");
                }

                let importedCount = 0;
                let overwrittenCount = 0;

                for (const line of lines) {
                    try {
                        const configObj = JSON.parse(line);

                        if (configObj.playerId && configObj.name) {
                            const playerId = configObj.playerId;
                            if (profiles[playerId]) {
                                overwrittenCount++;
                            } else {
                                importedCount++;
                            }
                            profiles[playerId] = {
                                name: configObj.name,
                                config: line
                            };
                        } else {
                            console.warn("Skipping line during import (missing playerId or name):", line);
                        }
                    } catch (lineError) {
                        console.warn("Skipping invalid JSON line during import:", line, lineError);
                    }
                }

                await saveProfiles();
                renderUI();
                alert(`Import complete!\nNew profiles: ${importedCount}\nUpdated profiles: ${overwrittenCount}`);

            } catch (err) {
                alert("Failed to import profiles. Please check the file format.");
                console.error("Import error:", err);
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }

    function observeLocalStorage() {
        const currentConfigStr = localStorage.getItem(CONFIG_KEY);

        if (!currentConfigStr) {
            if (currentProfileId !== null) {
                currentProfileId = null;
                renderUI();
            }
            return;
        }

        try {
            const currentConfig = JSON.parse(currentConfigStr);
            const playerId = currentConfig.playerId;
            if (!playerId) return;

            if (currentProfileId !== playerId) {
                currentProfileId = playerId;
                renderUI();
            }

            if (!profiles[playerId] || profiles[playerId].config !== currentConfigStr) {
                console.log(`Account Manager: Detected changes for ${currentConfig.name} (${playerId})`);
                profiles[playerId] = {
                    name: currentConfig.name,
                    config: currentConfigStr
                };
                saveProfiles();
                renderUI();
            }
        } catch (e) {
            // ignore
        }
    }

    async function initialize() {
        console.log("[Account Manager] Initializing...");
        addStyles();
        createUI();
        await loadProfiles();

        observeLocalStorage();

        setInterval(observeLocalStorage, 2000);

        console.log("[Account Manager] Ready.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();