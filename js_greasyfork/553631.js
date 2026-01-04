// ==UserScript==
// @name         Torn Halloween Attack Helper
// @namespace    http://swervelord.dev/
// @version      4.2.0
// @description  Shows attackable targets from your target list during Halloween event
// @author       swervelord
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/553631/Torn%20Halloween%20Attack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553631/Torn%20Halloween%20Attack%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================
    // CONFIGURATION
    // ============================
    const CALLS_PER_MINUTE = 2; // Adjust this to change polling frequency (2 = every 30 seconds, 4 = every 15 seconds, etc.)
    const POLL_INTERVAL_MS = (60 / CALLS_PER_MINUTE) * 1000;

    // ============================
    // STATE MANAGEMENT
    // ============================
    let apiKey = GM_getValue('torn_api_key', '');
    let isMinimized = GM_getValue('is_minimized', false);
    let pollTimer = null;
    let attackableTargets = [];

    // ============================
    // GUI CREATION
    // ============================
    function createGUI() {
        // Remove existing GUI if present
        const existingGUI = document.getElementById('halloween-attack-helper');
        if (existingGUI) existingGUI.remove();

        // Container for the entire GUI
        const container = document.createElement('div');
        container.id = 'halloween-attack-helper';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #ff6b00;
            border-radius: 10px;
            padding: 15px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(255, 107, 0, 0.3);
            max-height: 600px;
            overflow-y: auto;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            color: #ff6b00;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            border-bottom: 2px solid #ff6b00;
            padding-bottom: 10px;
        `;
        header.textContent = '🎃 Halloween Attack Helper';
        container.appendChild(header);

        // API Key Section (if not set)
        if (!apiKey) {
            const apiKeySection = document.createElement('div');
            apiKeySection.id = 'api-key-section';
            apiKeySection.style.cssText = `
                background: #1a1a1a;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 15px;
            `;

            const apiKeyLabel = document.createElement('div');
            apiKeyLabel.style.cssText = `
                color: #ffffff;
                font-size: 12px;
                margin-bottom: 8px;
                font-weight: bold;
            `;
            apiKeyLabel.textContent = 'Enter your Torn API Key:';

            const apiKeyNote = document.createElement('div');
            apiKeyNote.style.cssText = `
                color: #ffaa00;
                font-size: 10px;
                margin-bottom: 8px;
                font-style: italic;
            `;
            apiKeyNote.textContent = '⚠ Use a LIMITED ACCESS key!';

            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.placeholder = 'Your API key';
            apiKeyInput.style.cssText = `
                width: 100%;
                padding: 8px;
                border: 1px solid #ff6b00;
                border-radius: 5px;
                background: #0d0d0d;
                color: #ffffff;
                font-size: 12px;
                box-sizing: border-box;
                margin-bottom: 10px;
            `;

            const apiKeyButton = document.createElement('button');
            apiKeyButton.textContent = 'Save API Key';
            apiKeyButton.style.cssText = `
                width: 100%;
                padding: 10px;
                background: #ff6b00;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
            `;
            apiKeyButton.onmouseover = () => apiKeyButton.style.background = '#ff8533';
            apiKeyButton.onmouseout = () => apiKeyButton.style.background = '#ff6b00';
            apiKeyButton.onclick = () => {
                const key = apiKeyInput.value.trim();
                if (key) {
                    apiKey = key;
                    GM_setValue('torn_api_key', key);
                    document.getElementById('api-key-section').remove();
                    createTargetList();
                    startPolling();
                } else {
                    alert('Please enter a valid API key');
                }
            };

            apiKeySection.appendChild(apiKeyLabel);
            apiKeySection.appendChild(apiKeyNote);
            apiKeySection.appendChild(apiKeyInput);
            apiKeySection.appendChild(apiKeyButton);
            container.appendChild(apiKeySection);
        } else {
            // Settings button to change API key
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'halloween-settings-btn';
            settingsBtn.textContent = '⚙ Settings';
            settingsBtn.style.cssText = `
                width: 100%;
                padding: 8px;
                background: #444444;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                font-size: 11px;
                cursor: pointer;
                margin-bottom: 10px;
                transition: background 0.3s;
            `;
            settingsBtn.onmouseover = () => settingsBtn.style.background = '#555555';
            settingsBtn.onmouseout = () => settingsBtn.style.background = '#444444';
            settingsBtn.onclick = () => {
                if (confirm('Do you want to change your API key?')) {
                    GM_deleteValue('torn_api_key');
                    apiKey = '';
                    stopPolling();
                    container.remove();
                    createGUI();
                }
            };
            container.appendChild(settingsBtn);

            // Create target list container
            createTargetList(container);
        }

        document.body.appendChild(container);

        // Apply minimized state if needed
        if (isMinimized) {
            container.style.display = 'none';
        }
    }

    function createHeaderIcon() {
        // Check if icon already exists
        const existing = document.getElementById('halloween-helper-icon');
        if (existing) {
            existing.remove();
        }

        // Create a standalone floating button instead of inserting into Torn's toolbar
        const button = document.createElement('button');
        button.id = 'halloween-helper-icon';
        button.type = 'button';
        button.setAttribute('aria-label', 'Toggle Halloween Attack Helper');
        button.textContent = '🎃';
        button.style.cssText = `
            position: fixed;
            top: 12px;
            right: 80px;
            z-index: 10000;
            background: rgba(26, 26, 26, 0.9);
            border: 2px solid #ff6b00;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 2px 10px rgba(255, 107, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        button.onmouseover = () => {
            button.style.background = 'rgba(255, 107, 0, 0.2)';
            button.style.transform = 'scale(1.1)';
        };
        button.onmouseout = () => {
            button.style.background = 'rgba(26, 26, 26, 0.9)';
            button.style.transform = 'scale(1)';
        };
        button.onclick = toggleMinimize;

        document.body.appendChild(button);
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        GM_setValue('is_minimized', isMinimized);

        const gui = document.getElementById('halloween-attack-helper');
        if (!gui) return;

        // Hide/show the entire GUI
        if (isMinimized) {
            gui.style.display = 'none';
        } else {
            gui.style.display = 'block';
        }
    }

    function createTargetList(parentContainer) {
        const container = parentContainer || document.getElementById('halloween-attack-helper');
        if (!container) return;

        // Remove existing target list if present
        const existingList = container.querySelector('#target-list-container');
        if (existingList) existingList.remove();

        const targetListContainer = document.createElement('div');
        targetListContainer.id = 'target-list-container';

        // Status indicator
        const statusDiv = document.createElement('div');
        statusDiv.id = 'status-indicator';
        statusDiv.style.cssText = `
            color: #aaaaaa;
            font-size: 11px;
            text-align: center;
            margin-bottom: 10px;
            padding: 5px;
            background: #0d0d0d;
            border-radius: 5px;
        `;
        statusDiv.textContent = 'Loading targets...';
        targetListContainer.appendChild(statusDiv);

        // Targets container
        const targetsDiv = document.createElement('div');
        targetsDiv.id = 'targets-list';
        targetsDiv.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
        `;
        targetListContainer.appendChild(targetsDiv);

        container.appendChild(targetListContainer);
    }

    function updateTargetList(targets) {
        const targetsDiv = document.getElementById('targets-list');
        if (!targetsDiv) return;

        targetsDiv.innerHTML = '';

        if (targets.length === 0) {
            const noTargets = document.createElement('div');
            noTargets.style.cssText = `
                color: #888888;
                text-align: center;
                padding: 20px;
                font-size: 12px;
            `;
            noTargets.textContent = 'No attackable targets found';
            targetsDiv.appendChild(noTargets);
            return;
        }

        targets.forEach(target => {
            const targetDiv = document.createElement('div');
            targetDiv.style.cssText = `
                background: #0d0d0d;
                border: 1px solid #333333;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 8px;
                transition: all 0.3s;
            `;
            targetDiv.onmouseover = () => {
                targetDiv.style.background = '#1a1a1a';
                targetDiv.style.borderColor = '#ff6b00';
            };
            targetDiv.onmouseout = () => {
                targetDiv.style.background = '#0d0d0d';
                targetDiv.style.borderColor = '#333333';
            };

            const targetName = document.createElement('div');
            targetName.style.cssText = `
                color: #ffffff;
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 8px;
            `;
            targetName.textContent = `${target.name} [${target.level}]`;

            const attackButton = document.createElement('a');
            attackButton.href = `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${target.id}`;
            attackButton.target = '_blank';
            attackButton.textContent = '⚔ Attack';
            attackButton.style.cssText = `
                display: block;
                text-align: center;
                padding: 8px;
                background: #ff6b00;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 12px;
                font-weight: bold;
                transition: background 0.3s;
            `;
            attackButton.onmouseover = () => attackButton.style.background = '#ff8533';
            attackButton.onmouseout = () => attackButton.style.background = '#ff6b00';

            targetDiv.appendChild(targetName);
            targetDiv.appendChild(attackButton);
            targetsDiv.appendChild(targetDiv);
        });
    }

    function updateStatus(message, isError = false) {
        const statusDiv = document.getElementById('status-indicator');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.color = isError ? '#ff4444' : '#aaaaaa';
        }
    }

    // ============================
    // API FUNCTIONS
    // ============================
    async function fetchTargets() {
        if (!apiKey) return;

        try {
            updateStatus('Fetching targets...');

            const url = `https://api.torn.com/v2/user/list?cat=Targets&striptags=true&key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.error || 'Unknown API error');
            }

            // Filter for attackable targets only (description === "Okay")
            attackableTargets = data.list.filter(target =>
                target.status && target.status.description === "Okay"
            );

            const now = new Date().toLocaleTimeString();
            updateStatus(`Last updated: ${now} (${attackableTargets.length} attackable)`);
            updateTargetList(attackableTargets);

        } catch (error) {
            updateStatus(`Error: ${error.message}`, true);
        }
    }

    // ============================
    // POLLING FUNCTIONS
    // ============================
    function startPolling() {
        fetchTargets();
        pollTimer = setInterval(fetchTargets, POLL_INTERVAL_MS);
    }

    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    // ============================
    // INITIALIZATION
    // ============================
    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createGUI();
        createHeaderIcon();

        if (apiKey) {
            startPolling();
        }

        window.addEventListener('beforeunload', stopPolling);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
