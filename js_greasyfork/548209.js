// ==UserScript==
// @name         Torn Fight Made Easy 3
// @namespace    http://tampermonkey.net/
// @version      100.20
// @description  fixed 2
// @author       aquagloop
// @match        *://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548209/Torn%20Fight%20Made%20Easy%203.user.js
// @updateURL https://update.greasyfork.org/scripts/548209/Torn%20Fight%20Made%20Easy%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ACTION_CONTAINER_SELECTOR = 'div[class*="dialogButtons___"]';
    const SCRIPT_OVERLAY_ID = 'tfme-script-overlay';
    const SETTINGS_PANEL_ID = 'tfme-settings-panel';

    let config = { targetSlot: 'weapon_melee', postFightAction: 'mug', apiKey: '' };
    let styleElement = null;
    let countdownInterval, finalActionTimeout, nextPollTimeout;

    const loadSettings = () => {
        const savedConfig = GM_getValue('TFME_CONFIG', {});
        config = { ...config, ...savedConfig };
    };

    const saveSettings = (newConfig) => {
        config = newConfig;
        GM_setValue('TFME_CONFIG', config);
        updateStyles();
        const oldOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
        if (oldOverlay) oldOverlay.remove();
        main();
    };

    const createSettingsPanel = () => {
        const oldPanel = document.getElementById(SETTINGS_PANEL_ID);
        if (oldPanel) oldPanel.remove();
        const panel = document.createElement('div');
        panel.id = SETTINGS_PANEL_ID;
        panel.innerHTML = `
            <div class="tfme-settings-content">
                <h2>Torn Fight Made Easy Settings</h2>
                <div class="tfme-setting">
                    <label for="apiKey">Your Torn API Key (Full Access):</label>
                    <input type="text" id="apiKey" placeholder="Enter your API Key" value="${config.apiKey}">
                </div>
                <div class="tfme-setting">
                    <label for="targetSlot">Target Weapon Slot:</label>
                    <select id="targetSlot">
                        <option value="weapon_main" ${config.targetSlot === 'weapon_main' ? 'selected' : ''}>Primary</option>
                        <option value="weapon_second" ${config.targetSlot === 'weapon_second' ? 'selected' : ''}>Secondary</option>
                        <option value="weapon_melee" ${config.targetSlot === 'weapon_melee' ? 'selected' : ''}>Melee</option>
                        <option value="weapon_temp" ${config.targetSlot === 'weapon_temp' ? 'selected' : ''}>Temporary</option>
                        <option value="weapon_fists" ${config.targetSlot === 'weapon_fists' ? 'selected' : ''}>Fists</option>
                    </select>
                </div>
                <div class="tfme-setting">
                    <label for="postFightAction">Preferred Post-Fight Action:</label>
                    <select id="postFightAction">
                        <option value="mug" ${config.postFightAction === 'mug' ? 'selected' : ''}>Mug</option>
                        <option value="hospitalize" ${config.postFightAction === 'hospitalize' ? 'selected' : ''}>Hospitalize</option>
                        <option value="leave" ${config.postFightAction === 'leave' ? 'selected' : ''}>Leave</option>
                    </select>
                </div>
                <div class="tfme-buttons">
                    <button id="tfme-save">Save & Close</button>
                    <button id="tfme-cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('tfme-save').addEventListener('click', () => {
            const newConfig = {
                apiKey: document.getElementById('apiKey').value.trim(),
                targetSlot: document.getElementById('targetSlot').value,
                postFightAction: document.getElementById('postFightAction').value
            };
            saveSettings(newConfig);
            panel.remove();
        });
        document.getElementById('tfme-cancel').addEventListener('click', () => panel.remove());
    };

    const updateStyles = () => {
        if (styleElement) styleElement.remove();
        styleElement = GM_addStyle(`
            #${SETTINGS_PANEL_ID} {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.7); z-index: 9999;
                display: flex; justify-content: center; align-items: center; font-family: 'Signika', sans-serif;
            }
            .tfme-settings-content { background-color: #333; color: #fff; padding: 20px 30px; border-radius: 8px; border: 1px solid #555; text-align: left; width: 400px; }
            .tfme-settings-content h2 { margin-top: 0; text-align: center; }
            .tfme-setting { margin: 15px 0; }
            .tfme-setting label { display: block; margin-bottom: 5px; }
            .tfme-setting select, .tfme-setting input { width: 100%; padding: 8px; box-sizing: border-box; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;}
            .tfme-buttons { margin-top: 20px; text-align: right; }
            .tfme-buttons button { padding: 8px 15px; margin-left: 10px; border-radius: 5px; border: 1px solid #555; cursor: pointer; }
            #tfme-save { background: #4CAF50; color: white; }
            #tfme-cancel { background: #f44336; color: white; }
            #${config.targetSlot} { position: relative !important; }
            #${SCRIPT_OVERLAY_ID} {
                position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column;
                justify-content: center; align-items: stretch; gap: 5px; padding: 5px;
                background-color: rgba(0, 0, 0, 0.4); border: 1px dashed #888; box-sizing: border-box; z-index: 10;
            }
            .proxy-button-by-script {
                width: 100%; margin: 0 !important; box-sizing: border-box; padding: 10px 5px;
                background-image: linear-gradient(to bottom,#555 0,#333 100%); color: white;
                text-shadow: 1px 1px 1px rgba(0,0,0,0.5); border-radius: 5px; text-align: center;
                font-size: 14px; font-weight: bold; border: 1px solid #222; cursor: pointer;
                flex-grow: 1; display: flex; align-items: center; justify-content: center;
            }
            .proxy-button-by-script:hover { background-image: linear-gradient(to bottom,#666 0,#444 100%); }
            .proxy-button-by-script.mug-button { background-image: linear-gradient(to bottom,#8b0000 0,#5d0000 100%); }
            .proxy-button-by-script.mug-button:hover { background-image: linear-gradient(to bottom,#9f0000 0,#6f0000 100%); }
            .proxy-button-by-script:disabled {
                background-image: linear-gradient(to bottom,#777 0,#555 100%) !important;
                cursor: not-allowed !important; color: #ccc !important;
            }
            .hidden-by-script { visibility: hidden !important; height: 0 !important; padding: 0 !important; margin: 0 !important; opacity: 0 !important; }
        `);
    };

    const clearAllTimers = () => {
        if (countdownInterval) clearInterval(countdownInterval);
        if (finalActionTimeout) clearTimeout(finalActionTimeout);
        if (nextPollTimeout) clearTimeout(nextPollTimeout);
        countdownInterval = finalActionTimeout = nextPollTimeout = null;
    };

    const setButtonToRefreshState = (button) => {
        clearAllTimers();
        if (!button || !document.body.contains(button)) return;
        button.disabled = false;
        button.textContent = "Refresh to Attack";
        button.style.backgroundImage = 'linear-gradient(to bottom, #4caf50, #388e3c)';
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener('click', () => {
            newButton.disabled = true;
            newButton.textContent = "Loading...";
            window.location.reload();
        });
    };

    const formatDuration = (ms) => {
        if (ms <= 0) return "00:00";
        const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
        const pad = (n) => n.toString().padStart(2, '0');
        return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
    };

    const startCountdown = (button, userID, until) => {
        clearAllTimers();
        button.disabled = true;
        const endTime = until * 1000;
        const durationMs = endTime - Date.now();
        if (durationMs <= 500) {
            setButtonToRefreshState(button);
            return;
        }
        finalActionTimeout = setTimeout(() => setButtonToRefreshState(button), durationMs + 500);
        countdownInterval = setInterval(() => {
            const remainingMs = endTime - Date.now();
            if (!document.body.contains(button)) { clearAllTimers(); return; }
            if (remainingMs <= 0) setButtonToRefreshState(button);
            else button.textContent = `Attack (${formatDuration(remainingMs)})`;
        }, 1000);
        const pollIntervalMs = (durationMs > 60000) ? 30000 : (durationMs > 10000) ? 5000 : 2000;
        nextPollTimeout = setTimeout(() => handleApiCheck(button, userID), pollIntervalMs);
    };

    const handleApiCheck = (button, userID) => {
        checkTargetStatus(userID, config.apiKey, (status) => {
            if (!status || !document.body.contains(button)) {
                clearAllTimers();
                return;
            }
            if (status.state === 'Okay') {
                setButtonToRefreshState(button);
            } else if (status.state === 'Hospital' && status.until > 0) {
                startCountdown(button, userID, status.until);
            } else if (status.state) {
                clearAllTimers();
                button.textContent = `Attack (${status.state})`;
                button.disabled = false;
            }
        });
    };

    const setupWaitingButton = (destinationSlot, userID) => {
        const overlay = setupActionOverlay(destinationSlot);
        const waitButton = document.createElement('button');
        waitButton.textContent = "Attack (Checking...)";
        waitButton.className = 'proxy-button-by-script';
        waitButton.disabled = true;
        overlay.appendChild(waitButton);
        checkTargetStatus(userID, config.apiKey, (status) => {
            if (!status || !document.body.contains(waitButton)) { clearAllTimers(); return; }
            if (status.state === 'Okay') {
                setButtonToRefreshState(waitButton);
            } else if (status.state === 'Hospital' && status.until > 0) {
                startCountdown(waitButton, userID, status.until);
            } else if (status.state) {
                clearAllTimers();
                waitButton.textContent = `Attack (${status.state})`;
                waitButton.disabled = false;
                waitButton.addEventListener('click', () => {
                    waitButton.disabled = true;
                    waitButton.textContent = "Checking...";
                    handleApiCheck(waitButton, userID);
                });
            } else {
                 waitButton.textContent = `API Error`;
                 waitButton.disabled = false;
            }
        });
    };

    const findButtonByText = (container, text, useIncludes = false) => {
        if (!container || !text) return null;
        const buttons = container.querySelectorAll('button, a[class*="button"]');
        for (const button of buttons) {
            const buttonText = button.textContent.trim().toLowerCase();
            if (useIncludes) {
                if (buttonText.includes(text.toLowerCase())) return button;
            } else {
                if (buttonText === text.toLowerCase()) return button;
            }
        }
        return null;
    };

    const createProxyButton = (realElement, destinationOverlay, onClickCallback) => {
        const proxyButton = document.createElement('button');
        const buttonText = realElement.textContent.trim().toLowerCase();
        proxyButton.textContent = realElement.textContent.trim();
        proxyButton.className = 'proxy-button-by-script';
        if (buttonText === 'mug') proxyButton.classList.add('mug-button');
        proxyButton.addEventListener('click', (e) => {
            const userID = getTargetUserID();
            if (buttonText.includes('start fight') || buttonText.includes('join')) {
                if (userID) sessionStorage.setItem(`fightInitiated_${userID}`, 'true');
            } else if (userID) {
                sessionStorage.removeItem(`fightInitiated_${userID}`);
            }
            e.stopPropagation();
            if (onClickCallback) onClickCallback();
            realElement.click();
        });
        destinationOverlay.appendChild(proxyButton);
    };

    const setupActionOverlay = (destinationSlot) => {
        const oldOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
        if (oldOverlay) oldOverlay.remove();
        const overlay = document.createElement('div');
        overlay.id = SCRIPT_OVERLAY_ID;
        destinationSlot.appendChild(overlay);
        return overlay;
    };

    const getTargetUserID = () => new URLSearchParams(window.location.search).get('user2ID');

    const checkTargetStatus = (userID, apiKey, callback) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}`,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("Torn API Error:", data.error.error);
                        if (data.error.code === 2 && !sessionStorage.getItem('tfme_api_key_alerted')) {
                            alert("Torn Fight Made Easy: API key is invalid. Please check settings.");
                            sessionStorage.setItem('tfme_api_key_alerted', 'true');
                        }
                        callback(null);
                    } else callback(data.status);
                } catch (e) { console.error("Failed to parse Torn API response:", e); callback(null); }
            },
            onerror: (response) => { console.error("Failed to fetch from Torn API:", response); callback(null); }
        });
    };

    const main = () => {
        const destinationSlot = document.getElementById(config.targetSlot);
        if (!destinationSlot || document.getElementById(SCRIPT_OVERLAY_ID)) return;

        const userID = getTargetUserID();
        const actionContainer = document.querySelector(ACTION_CONTAINER_SELECTOR);

        // Priority 1: Check for post-fight buttons. This takes precedence over all other logic.
        if (actionContainer) {
            const actionPriority = [config.postFightAction, 'mug', 'hospitalize', 'leave', 'continue'];
            let buttonToMove = null;
            for (const action of [...new Set(actionPriority)]) {
                if ((buttonToMove = findButtonByText(actionContainer, action, true))) {
                    const overlay = setupActionOverlay(destinationSlot);
                    createProxyButton(buttonToMove, overlay, () => {
                        overlay.remove();
                        actionContainer.classList.add('hidden-by-script');
                    });
                    return;
                }
            }
        }

        
        const preFightButton = findButtonByText(actionContainer, 'start fight', true) || findButtonByText(actionContainer, 'join', true);
        if (preFightButton && preFightButton.getAttribute('aria-disabled') !== 'true') {
            if (userID && sessionStorage.getItem(`fightInitiated_${userID}`)) {
                return;
            }
            const overlay = setupActionOverlay(destinationSlot);
            createProxyButton(preFightButton, overlay, () => {
                overlay.remove();
                actionContainer.classList.add('hidden-by-script');
            });
            return;
        }

        
        if (!userID) return;
        if (!config.apiKey) {
            if (!sessionStorage.getItem('tfme_api_key_prompted')) {
                if (confirm("Torn Fight Made Easy: API key required. Open settings now?")) createSettingsPanel();
                sessionStorage.setItem('tfme_api_key_prompted', 'true');
            }
            return;
        }

        if (sessionStorage.getItem(`fightInitiated_${userID}`)) {
             return; 
        }

        setupWaitingButton(destinationSlot, userID);
    };

    loadSettings();
    updateStyles();
    GM_registerMenuCommand('TFME Settings', createSettingsPanel);

    const observer = new MutationObserver(() => setTimeout(main, 150));
    observer.observe(document.body, { childList: true, subtree: true });

})();