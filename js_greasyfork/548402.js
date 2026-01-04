// ==UserScript==
// @name         Quick Equip & Attack Page Timer Sync
// @namespace    http://tampermonkey.net/
// @version      4.2.4 // Added Draggable and Resizable UI with State Saving
// @description  Adds quick equip buttons on item.php and syncs needle timers from attack page
// @match        https://www.torn.com/item.php
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548402/Quick%20Equip%20%20Attack%20Page%20Timer%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/548402/Quick%20Equip%20%20Attack%20Page%20Timer%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BROADCAST_CHANNEL_NAME = 'qe_needle_timers_channel_v2.1';
    let channel;

    try {
        channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch (e) {
        // BroadcastChannel API not supported or failed to initialize.
    }

    // --- CONFIGURATION (SHARED) ---
    const ITEM_CONFIG = [
        { name: "Epinephrine", timerDuration: 120, enabled: true, buttonText: "Epinephrine", attackPageIconIdentifier: "strengthened" },
        { name: "Serotonin",   timerDuration: 120, enabled: true, buttonText: "Serotonin",   attackPageIconIdentifier: "hardened" },
        { name: "Melatonin",   timerDuration: 120, enabled: true, buttonText: "Melatonin",   attackPageIconIdentifier: "hastened" },
        { name: "Tyrosine",    timerDuration: 120, enabled: true,buttonText: "Tyrosine",    attackPageIconIdentifier: "sharpened" }
    ];

    // ==========================================================================
    // === LOGIC FOR ITEM.PHP (Quick Equip Buttons & Receiving Timer Updates) ===
    // ==========================================================================
    if (window.location.href.includes('item.php')) {

        let healthItemButtonElement_itemPage;
        let itemPageNeedleStates = {};
        let itemPageButtons = {};
        let monitorHealthFailCount_itemPage = 0;
        const MAX_HEALTH_FIND_FAILURES_itemPage = 5;

        // CONFIG (specific to item.php)
        const HEALTH_ITEM_CONFIG = {
            enabled: false, // Set to false to disable the HEAL button and its features
            buttonText: "HEAL",
            dataIdSelector: "div.item[data-id='738']" // VERIFY THIS DATA-ID FOR BLOOD BAG O+
        };
        const HEALTH_CHECK_INTERVAL_itemPage = 1000;
        const HOSPITALIZED_HEALTH_VALUE_itemPage = 1;
        const LOW_HEALTH_OFFSET_itemPage = 4000;
        const CONTAINER_INITIAL_TOP = "83%"; // Fallback position
        const CONTAINER_INITIAL_LEFT = "50%"; // Fallback position

        GM_addStyle(`
            @keyframes qe-original-flash { 0% { background-color: #ff4444; } 100% { background-color: #ff0000; } }
            .qe-ui-container { position: fixed; top: ${CONTAINER_INITIAL_TOP}; left: ${CONTAINER_INITIAL_LEFT}; transform: translate(-50%, -50%); background-color: #2C3E50; color: #ECF0F1; padding: 20px; border-radius: 10px; z-index: 10000; text-align: center; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); font-family: Arial, sans-serif; min-width: 300px; min-height: 150px; resize: none; box-sizing: border-box; display: flex; flex-direction: column; }
            .qe-ui-title { font-size: 1.1em; font-weight: bold; margin-bottom: 15px; color: #3498DB; padding-bottom: 10px; border-bottom: 1px solid #34495E; cursor: move; user-select: none; }
            .qe-ui-content-wrapper { flex-grow: 1; }
            .qe-ui-item-buttons-wrapper { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 15px; }
            .qe-ui-button { padding: 10px 15px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; border-radius: 6px; background-color: #3498DB; color: white; transition: background-color 0.2s ease, transform 0.1s ease; min-width: 120px; }
            .qe-ui-button:hover { background-color: #2980B9; transform: translateY(-1px); }
            .qe-ui-button.active-timer { background-color: #E74C3C; }
            .qe-ui-button.active-timer:hover { background-color: #C0392B; }
            .qe-ui-health-item-button { font-size: 16px; font-weight: bold; width: 100%; background-color: #2ECC71; margin-top: 10px; }
            .qe-ui-health-item-button:hover { background-color: #27AE60; }
            .qe-ui-health-item-button.low-health-alert { background-color: #ff4444; animation: qe-original-flash 1s infinite alternate; }
            .qe-ui-resize-handle { position: absolute; right: 0; bottom: 0; width: 15px; height: 15px; cursor: se-resize; background-image: linear-gradient(135deg, transparent 50%, #34495E 50%); }
        `);


        function modifiedEquipConfigItem_itemPage(itemConf, buttonElement) {
            if (buttonElement.classList.contains('active-timer')) return;
            const equippedItemImages = document.querySelectorAll('div.equippedItems___K1J5S img[alt]');
            for (const equippedItemImage of equippedItemImages) {
                 if (equippedItemImage && equippedItemImage.alt.trim() === itemConf.name) return;
            }
            let itemList = document.querySelectorAll("li[data-sort]");
            let itemFoundAndClicked = false;
            for (let itemLi of itemList) {
                let itemTitle = itemLi.querySelector(".name-wrap .name");
                if (itemTitle && itemTitle.textContent.trim() === itemConf.name) {
                    let equipButtonOnPage = itemLi.querySelector("button.option-equip");
                    if (equipButtonOnPage) {
                        equipButtonOnPage.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                        itemFoundAndClicked = true;
                        break;
                    }
                }
            }
            if (itemFoundAndClicked) {
                buttonElement.textContent = itemConf.buttonText;
                buttonElement.classList.remove("active-timer");
                let needleState = itemPageNeedleStates[itemConf.name];
                if (needleState && needleState.intervalId) clearInterval(needleState.intervalId);
                delete itemPageNeedleStates[itemConf.name];
            }
        }

        function createItemButton_itemPage(itemConf) {
            let button = document.createElement("button");
            button.textContent = itemConf.buttonText;
            button.className = "qe-ui-button";
            button.addEventListener("click", () => modifiedEquipConfigItem_itemPage(itemConf, button));
            itemPageButtons[itemConf.name] = button;
            return button;
        }

        function useHealthItem_itemPage() {
            let healthItemActionTarget = document.querySelector(HEALTH_ITEM_CONFIG.dataIdSelector);
            if (healthItemActionTarget) {
                healthItemActionTarget.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                if (healthItemButtonElement_itemPage) {
                    const originalText = healthItemButtonElement_itemPage.textContent;
                    healthItemButtonElement_itemPage.textContent = "Used!";
                    healthItemButtonElement_itemPage.disabled = true;
                    setTimeout(() => {
                        if (healthItemButtonElement_itemPage) {
                           healthItemButtonElement_itemPage.textContent = originalText;
                           healthItemButtonElement_itemPage.disabled = false;
                        }
                    }, 1500);
                }
            }
        }

        function createHealthItemButton_itemPage() {
            healthItemButtonElement_itemPage = document.createElement("button");
            healthItemButtonElement_itemPage.textContent = HEALTH_ITEM_CONFIG.buttonText;
            healthItemButtonElement_itemPage.className = "qe-ui-button qe-ui-health-item-button";
            healthItemButtonElement_itemPage.addEventListener("click", useHealthItem_itemPage);
            return healthItemButtonElement_itemPage;
        }

        function updateButtonTimerFromBroadcast_itemPage(itemName, timeLeftSecondsFromBroadcast) {
            const itemConf = ITEM_CONFIG.find(i => i.name === itemName);
            const buttonElement = itemPageButtons[itemName];
            if (!itemConf || !buttonElement) return;
            let previousState = itemPageNeedleStates[itemName];
            if (previousState && previousState.intervalId) {
                clearInterval(previousState.intervalId);
                previousState.intervalId = null;
            }
            let timeToStartCountdownWith = parseInt(timeLeftSecondsFromBroadcast, 10);
            if (isNaN(timeToStartCountdownWith) || timeToStartCountdownWith <= 0) {
                if (!previousState || !previousState.localRemaining || previousState.localRemaining <= 0) {
                    buttonElement.textContent = itemConf.buttonText;
                    buttonElement.classList.remove("active-timer");
                    delete itemPageNeedleStates[itemName];
                } else {
                    if (previousState.localRemaining > 0) buttonElement.classList.add("active-timer");
                    else {
                        buttonElement.classList.remove("active-timer");
                        buttonElement.textContent = itemConf.buttonText;
                        delete itemPageNeedleStates[itemName];
                        return;
                    }
                    const displayName = itemConf.name;
                    itemPageNeedleStates[itemName] = { localRemaining: previousState.localRemaining, intervalId: null };
                    let currentStateForContinuation = itemPageNeedleStates[itemName];
                    function localContinuationCountdown() {
                        if (currentStateForContinuation.localRemaining > 0) {
                            buttonElement.textContent = `${displayName} (${currentStateForContinuation.localRemaining}s)`;
                            currentStateForContinuation.localRemaining--;
                        } else {
                            if (currentStateForContinuation.intervalId) clearInterval(currentStateForContinuation.intervalId);
                            buttonElement.textContent = itemConf.buttonText;
                            buttonElement.classList.remove("active-timer");
                            delete itemPageNeedleStates[itemName];
                        }
                    }
                    localContinuationCountdown();
                    currentStateForContinuation.intervalId = setInterval(localContinuationCountdown, 1000);
                }
                return;
            }
            buttonElement.classList.add("active-timer");
            const displayName = itemConf.name;
            itemPageNeedleStates[itemName] = { localRemaining: timeToStartCountdownWith, intervalId: null };
            let currentActiveState = itemPageNeedleStates[itemName];
            function activeBroadcastCountdown() {
                if (currentActiveState.localRemaining > 0) {
                    buttonElement.textContent = `${displayName} (${currentActiveState.localRemaining}s)`;
                    currentActiveState.localRemaining--;
                } else {
                    if (currentActiveState.intervalId) clearInterval(currentActiveState.intervalId);
                    buttonElement.textContent = itemConf.buttonText;
                    buttonElement.classList.remove("active-timer");
                    delete itemPageNeedleStates[itemName];
                }
            }
            activeBroadcastCountdown();
            currentActiveState.intervalId = setInterval(activeBroadcastCountdown, 1000);
        }

        function resetAllBuffTimers_itemPage() {
            ITEM_CONFIG.forEach(itemConf => {
                if (itemConf.enabled && itemPageButtons[itemConf.name]) {
                    let needleState = itemPageNeedleStates[itemConf.name];
                    if (needleState && needleState.intervalId) clearInterval(needleState.intervalId);
                    delete itemPageNeedleStates[itemConf.name];
                    itemPageButtons[itemConf.name].textContent = itemConf.buttonText;
                    itemPageButtons[itemConf.name].classList.remove("active-timer");
                }
            });
        }

        function monitorHealth_itemPage() {
            const healthBarSelectors = ['#sidebarroot [class*="life_"] [class*="value_"]', '#sidebarroot [class*="life"] [class*="bar_"] [class*="value_"]', '#stats-list [class*="life"] [class*="value"]', '[class*="user-status"] [class*="life"] [class*="value"]', '#player-stat-life', '.sidebar-block__content [href*="page=panel"] [class*="value_"]', "p.bar-value___NTdce"];
            let healthElement = null;
            for (const selector of healthBarSelectors) {
                healthElement = document.querySelector(selector);
                if (healthElement && healthElement.textContent.includes('/')) break;
                healthElement = null;
            }
            if (!healthElement) {
                monitorHealthFailCount_itemPage++;
                return;
            }
            monitorHealthFailCount_itemPage = 0;
            const healthText = healthElement.textContent.trim();
            const match = healthText.match(/([\d,]+)\s*\/\s*([\d,]+)/);
            if (!match) return;
            const currentHealth = parseInt(match[1].replace(/,/g, ''), 10);
            const maxHealth = parseInt(match[2].replace(/,/g, ''), 10);
            if (currentHealth === HOSPITALIZED_HEALTH_VALUE_itemPage) resetAllBuffTimers_itemPage();
            if (healthItemButtonElement_itemPage) {
                const healthThreshold = maxHealth - LOW_HEALTH_OFFSET_itemPage;
                const isLowHealth = currentHealth <= healthThreshold && currentHealth > HOSPITALIZED_HEALTH_VALUE_itemPage;
                if (isLowHealth) healthItemButtonElement_itemPage.classList.add('low-health-alert');
                else healthItemButtonElement_itemPage.classList.remove('low-health-alert');
            }
        }

        function makeUIDraggable(element, handle) {
            let offsetX, offsetY;
            const move = (e) => {
                e.preventDefault();
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
                element.style.transform = 'none';
            };
            const stopMove = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', stopMove);
                const uiState = JSON.parse(localStorage.getItem('qe-ui-state')) || {};
                uiState.top = element.style.top;
                uiState.left = element.style.left;
                localStorage.setItem('qe-ui-state', JSON.stringify(uiState));
            };
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const rect = element.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', stopMove);
            });
        }

        function makeUIResizable(element, handle) {
            const stopResize = () => {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
                const uiState = JSON.parse(localStorage.getItem('qe-ui-state')) || {};
                uiState.width = element.style.width;
                uiState.height = element.style.height;
                localStorage.setItem('qe-ui-state', JSON.stringify(uiState));
            };
            const resize = (e) => {
                const rect = element.getBoundingClientRect();
                element.style.width = e.clientX - rect.left + 'px';
                element.style.height = e.clientY - rect.top + 'px';
            };
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize);
            });
        }

        function initItemPageUI_final() {
            const mainContainer = document.createElement("div");
            mainContainer.className = "qe-ui-container";
            const titleElement = document.createElement("div");
            titleElement.className = "qe-ui-title";
            titleElement.textContent = "Quick Item Actions";
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "qe-ui-content-wrapper";
            mainContainer.appendChild(titleElement);
            mainContainer.appendChild(contentWrapper);
            const itemButtonsWrapper = document.createElement("div");
            itemButtonsWrapper.className = "qe-ui-item-buttons-wrapper";
            ITEM_CONFIG.forEach(itemConf => {
                if (itemConf.enabled) itemButtonsWrapper.appendChild(createItemButton_itemPage(itemConf));
            });
            contentWrapper.appendChild(itemButtonsWrapper);
            if (HEALTH_ITEM_CONFIG.enabled) {
                contentWrapper.appendChild(createHealthItemButton_itemPage());
            }
            const resizeHandle = document.createElement("div");
            resizeHandle.className = "qe-ui-resize-handle";
            mainContainer.appendChild(resizeHandle);
            document.body.appendChild(mainContainer);
            const savedState = JSON.parse(localStorage.getItem('qe-ui-state'));
            if (savedState) {
                mainContainer.style.top = savedState.top || CONTAINER_INITIAL_TOP;
                mainContainer.style.left = savedState.left || CONTAINER_INITIAL_LEFT;
                mainContainer.style.width = savedState.width || '';
                mainContainer.style.height = savedState.height || '';
                if (savedState.top) mainContainer.style.transform = 'none'; // Use absolute coords if saved
            }
            makeUIDraggable(mainContainer, titleElement);
            makeUIResizable(mainContainer, resizeHandle);
            setInterval(monitorHealth_itemPage, HEALTH_CHECK_INTERVAL_itemPage);
            monitorHealth_itemPage();
        }

        if (channel) {
            channel.onmessage = function(event) {
                const data = event.data;
                if (data && data.type === 'needle_timer_update') {
                    if (ITEM_CONFIG.find(i => i.name === data.needleName && i.enabled)) {
                        updateButtonTimerFromBroadcast_itemPage(data.needleName, data.timeLeft);
                    }
                }
            };
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initItemPageUI_final);
        else initItemPageUI_final();
    }

    // =====================================================================
    // === LOGIC FOR ATTACK PAGE (Observing Timers & Broadcasting) ===
    // =====================================================================
    else if (window.location.href.includes('loader.php?sid=attack')) {

        function observeAndBroadcastNeedleTimers_attackPage() {
            const allPlayerBlocks = document.querySelectorAll('.player___wiE8R');
            let attackerPlayerBlock = null;
            for (const playerBlock of allPlayerBlocks) {
                if (playerBlock.querySelector('[id^="attacker_"]')) {
                    attackerPlayerBlock = playerBlock;
                    break;
                }
            }
            let iconsContainer = attackerPlayerBlock ? attackerPlayerBlock.querySelector('.iconsContainer___MLIjn .iconsWrap___NjMtc') : null;
            let activeNeedleIdentifiersOnPage = new Set();
            if (!iconsContainer) {
                ITEM_CONFIG.forEach(itemConf => {
                    if (itemConf.enabled && channel) { try { channel.postMessage({ type: 'needle_timer_update', needleName: itemConf.name, timeLeft: 0 }); } catch (e) {} }
                });
                return;
            }
            const activeIconElements = iconsContainer.querySelectorAll('.iconWrap___KDhxz');
            activeIconElements.forEach(iconWrap => {
                const imgElement = iconWrap.querySelector('.iconImg___zvkMv');
                const timeLeftElement = iconWrap.querySelector('.timeLeft___whBcD');
                if (imgElement && timeLeftElement) {
                    const imgSrc = imgElement.getAttribute('src') || "";
                    const imgAlt = imgElement.getAttribute('alt') || "";
                    const timeLeftSeconds = parseInt(timeLeftElement.textContent.trim(), 10);
                    if (!isNaN(timeLeftSeconds)) {
                        ITEM_CONFIG.forEach(itemConf => {
                            if (itemConf.enabled) {
                                const regex = new RegExp(`(^|[/_-])${itemConf.attackPageIconIdentifier}(\\.svg|$)`, 'i');
                                if (regex.test(imgSrc) || imgAlt.toLowerCase().includes(itemConf.attackPageIconIdentifier.toLowerCase())) {
                                    activeNeedleIdentifiersOnPage.add(itemConf.name);
                                    if (channel) { try { channel.postMessage({ type: 'needle_timer_update', needleName: itemConf.name, timeLeft: timeLeftSeconds }); } catch (e) {} }
                                }
                            }
                        });
                    }
                }
            });
            ITEM_CONFIG.forEach(itemConf => {
                if (itemConf.enabled && !activeNeedleIdentifiersOnPage.has(itemConf.name)) {
                    if (channel) { try { channel.postMessage({ type: 'needle_timer_update', needleName: itemConf.name, timeLeft: 0 }); } catch (e) {} }
                }
            });
        }
        if (channel) {
            setInterval(observeAndBroadcastNeedleTimers_attackPage, 750);
            window.addEventListener('beforeunload', () => {
                if (channel) { ITEM_CONFIG.forEach(itemConf => { if (itemConf.enabled) { try { channel.postMessage({ type: 'needle_timer_update', needleName: itemConf.name, timeLeft: 0 }); } catch(e){} } }); }
            });
            observeAndBroadcastNeedleTimers_attackPage();
        }
    }

    function closeChannel() {
        if (channel) {
            try { channel.close(); } catch (e) {}
            channel = null;
        }
    }

    if (typeof GM_unload === 'function') GM_unload = closeChannel;
    else window.addEventListener('unload', closeChannel, false);

})();