// ==UserScript==
// @name         Auto BUY Enhanced
// @description  Auto buy dengan UI lengkap, PP limit, dan settings
// @version      1
// @include      https://*/game.php*&screen=market&mode=exchange*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/557711/Auto%20BUY%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/557711/Auto%20BUY%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get Village ID
    function getVillageId() {
        const match = window.location.href.match(/village=([^&]*)/);
        return match ? match[1] : null;
    }

    const villageId = getVillageId();
    if (!villageId) {
        console.error('Village ID not found in URL.');
        return;
    }

    // Variables
    let intervalId = null;
    let lastSubmitTime = 0;
    let settingsPopup = null;
    let error = false;

    // Default settings
    let limitPremiumPoints = parseInt(localStorage.getItem(`ppLimit_${villageId}`), 10) || 100;
    let minStockThreshold = parseInt(localStorage.getItem(`minStockThreshold_${villageId}`), 10) || 32;
    let resLimit = parseInt(localStorage.getItem(`resLimit_${villageId}`), 10) || 400000;
    let selectedResources = JSON.parse(localStorage.getItem(`selectedResources_${villageId}`)) || {
        wood: true,
        stone: true,
        iron: true
    };
    let buyPriority = JSON.parse(localStorage.getItem(`buyPriority_${villageId}`)) || ['wood', 'stone', 'iron'];

    // Fungsi untuk mendapatkan sisa Premium Points
    function getPremiumPoints() {
        return parseInt(document.getElementById('premium_points')?.textContent.trim(), 10) || 0;
    }

    // Fungsi untuk mendapatkan total resource (stock + incoming)
    function totalRes(resource) {
        const marketTableRows = document.querySelectorAll("#market_status_bar table.vis tbody tr")[1];
        let incomres = 0;

        if (marketTableRows) {
            const resourceElement = marketTableRows.children[0].querySelector(`.icon.header.${resource}`);
            if (resourceElement) {
                const fullText = resourceElement.parentElement.textContent;
                incomres = parseInt(fullText.replace(/\D/g, ""), 10) || 0;
            }
        }

        const ressStock = parseInt(document.getElementById(resource)?.innerText, 10) || 0;
        const total = ressStock + incomres;

        return total;
    }

    // Fungsi untuk mendapatkan resource berdasarkan prioritas
    function getResourceByPriority() {
        // Cek resource limit
        let woodTotal = totalRes('wood');
        let stoneTotal = totalRes('stone');
        let ironTotal = totalRes('iron');

        console.log(`Wood Total: ${woodTotal}, Stone Total: ${stoneTotal}, Iron Total: ${ironTotal}, Res Limit: ${resLimit}`);

        // Loop berdasarkan urutan prioritas
        for (let resourceType of buyPriority) {
            // Skip jika resource tidak dipilih
            if (!selectedResources[resourceType]) continue;

            // Ambil total resource
            let resourceTotal = 0;
            if (resourceType === 'wood') resourceTotal = woodTotal;
            else if (resourceType === 'stone') resourceTotal = stoneTotal;
            else if (resourceType === 'iron') resourceTotal = ironTotal;

            // Skip jika sudah melebihi limit
            if (resourceTotal >= resLimit) {
                console.log(`${resourceType} melebihi limit (${resourceTotal}/${resLimit})`);
                continue;
            }

            // Ambil stock dari market
            let stockElement = document.getElementById(`premium_exchange_stock_${resourceType}`);
            if (stockElement) {
                let stock = parseInt(stockElement.innerText.trim() || 0);
                console.log(`${resourceType} Stock: ${stock}, Threshold: ${minStockThreshold}`);

                if (stock > minStockThreshold) {
                    console.log(`Selected: ${resourceType} with stock ${stock}`);
                    return { type: resourceType, stock: stock };
                }
            }
        }

        console.log(`No available resources`);
        return null;
    }

    // Fungsi untuk mendeteksi error
    function checkForErrors() {
        const countdownPopup = document.getElementById('countdown-timer');
        if (!countdownPopup) return false;

        let errorMessage = document.querySelector('.error_box .content')?.textContent.match(/Premium Exchange/);

        if (errorMessage) {
            clearInterval(intervalId);
            intervalId = null;
            updateButtonState(false);

            // Countdown 3-5 menit
            let countdownTime = Math.floor(Math.random() * (300000 - 180000 + 1)) + 180000;
            countdownPopup.innerText = `Error detected\nRestart in ${Math.floor(countdownTime / 1000)}s`;

            let countdownInterval = setInterval(function () {
                countdownTime -= 1000;
                if (countdownPopup) {
                    countdownPopup.innerText = `Error detected\nRestart in ${Math.floor(countdownTime / 1000)}s`;
                }

                if (countdownTime <= 0) {
                    clearInterval(countdownInterval);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            }, 1000);

            error = true;
            return true;
        }
        return false;
    }

    // Fungsi untuk fill resource (manual)
    function manualFillResource() {
        const countdownPopup = document.getElementById('countdown-timer');
        if (!countdownPopup) return;

        if (getPremiumPoints() < limitPremiumPoints) {
            countdownPopup.innerText = `PP tidak cukup\n(${getPremiumPoints()}/${limitPremiumPoints})`;
            console.log("PP tidak mencukupi");
            return;
        }

        let resource = getResourceByPriority();
        if (!resource) {
            countdownPopup.innerText = `Tidak ada resource\ntersedia`;
            console.log("Tidak ada resource tersedia");
            return;
        }

        let resourceName = resource.type;
        let buyAmount = 15 * Math.floor(resource.stock / minStockThreshold);

        // Clear semua input dulu
        let buyWood = document.getElementsByName('buy_wood')[0];
        let buyStone = document.getElementsByName('buy_stone')[0];
        let buyIron = document.getElementsByName('buy_iron')[0];
        let sellWood = document.getElementsByName('sell_wood')[0];
        let sellStone = document.getElementsByName('sell_stone')[0];
        let sellIron = document.getElementsByName('sell_iron')[0];

        if (buyWood) buyWood.value = '';
        if (buyStone) buyStone.value = '';
        if (buyIron) buyIron.value = '';
        if (sellWood) sellWood.value = '';
        if (sellStone) sellStone.value = '';
        if (sellIron) sellIron.value = '';

        // Fill input yang dipilih
        let targetInput = document.getElementsByName(`buy_${resourceName}`)[0];
        if (targetInput) {
            targetInput.value = buyAmount;
            targetInput.focus();
            countdownPopup.innerText = `Filled ${resourceName}\n${buyAmount} units`;
            console.log(`Manual fill: ${resourceName} = ${buyAmount}`);
        }
    }

    // Fungsi utama autofill & submit
    function autoFill() {
        const countdownPopup = document.getElementById('countdown-timer');
        if (!countdownPopup) return;

        // Cek error terlebih dahulu
        if (checkForErrors()) return;

        // Cek PP
        if (getPremiumPoints() < limitPremiumPoints) {
            clearInterval(intervalId);
            intervalId = null;
            updateButtonState(false);
            countdownPopup.innerText = `PP habis\nAuto stopped`;
            console.log("Auto Fill dihentikan: PP tidak mencukupi");
            return;
        }

        // Cek apakah ada input sell yang terisi
        let sellWood = document.getElementsByName('sell_wood')[0];
        let sellStone = document.getElementsByName('sell_stone')[0];
        let sellIron = document.getElementsByName('sell_iron')[0];

        if ((sellWood && sellWood.value !== "") ||
            (sellStone && sellStone.value !== "") ||
            (sellIron && sellIron.value !== "")) {
            countdownPopup.innerText = `Error: Sell terisi\nReload in 6s`;
            console.log("Error: Input sell terisi");
            setTimeout(() => location.reload(), 5250);
            return;
        }

        let resource = getResourceByPriority();
        if (!resource) {
            countdownPopup.innerText = `Standby\nNo resource available`;
            return;
        }

        let resourceName = resource.type;
        let buyAmount = 15 * Math.floor(resource.stock / minStockThreshold);

        // Clear dan fill input
        let buyWood = document.getElementsByName('buy_wood')[0];
        let buyStone = document.getElementsByName('buy_stone')[0];
        let buyIron = document.getElementsByName('buy_iron')[0];

        if (buyWood) buyWood.value = '';
        if (buyStone) buyStone.value = '';
        if (buyIron) buyIron.value = '';

        let targetInput = document.getElementsByName(`buy_${resourceName}`)[0];
        if (targetInput) {
            targetInput.value = buyAmount;
            targetInput.focus();
        }

        countdownPopup.innerText = `Buying ${resourceName}\n${buyAmount} units`;

        // Submit dengan delay
        let currentTime = new Date().getTime();
        if (currentTime - lastSubmitTime >= 5000) {
            setTimeout(function () {
                let submitButton = document.querySelector('input[type="submit"][value="Calculate best offer "]');
                if (submitButton && !error) {
                    submitButton.click();
                    lastSubmitTime = currentTime;

                    setTimeout(function () {
                        let confirmButton = document.querySelector('.confirmation-buttons .btn.evt-confirm-btn.btn-confirm-yes');
                        if (confirmButton) {
                            confirmButton.click();
                            setTimeout(function () {
                                location.reload();
                            }, Math.random() * 1500 + 4500);
                        }
                    }, Math.floor(Math.random() * 250 + 500));
                }
            }, Math.floor(Math.random() * 250 + 500));
        }
    }

    // Save settings
    function saveSettings() {
        localStorage.setItem(`ppLimit_${villageId}`, limitPremiumPoints);
        localStorage.setItem(`minStockThreshold_${villageId}`, minStockThreshold);
        localStorage.setItem(`resLimit_${villageId}`, resLimit);
        localStorage.setItem(`selectedResources_${villageId}`, JSON.stringify(selectedResources));
        localStorage.setItem(`buyPriority_${villageId}`, JSON.stringify(buyPriority));
        toggleSettingsPopup();
    }

    // Load settings
    function loadSettings() {
        limitPremiumPoints = parseInt(localStorage.getItem(`ppLimit_${villageId}`), 10) || 100;
        minStockThreshold = parseInt(localStorage.getItem(`minStockThreshold_${villageId}`), 10) || 32;
        resLimit = parseInt(localStorage.getItem(`resLimit_${villageId}`), 10) || 400000;
        selectedResources = JSON.parse(localStorage.getItem(`selectedResources_${villageId}`)) || {
            wood: true,
            stone: true,
            iron: true
        };
        buyPriority = JSON.parse(localStorage.getItem(`buyPriority_${villageId}`)) || ['wood', 'stone', 'iron'];
    }

    // Toggle settings popup
    function toggleSettingsPopup() {
        if (settingsPopup) {
            settingsPopup.remove();
            settingsPopup = null;
            return;
        }

        settingsPopup = document.createElement('div');
        settingsPopup.style.position = 'fixed';
        settingsPopup.style.bottom = '100px';
        settingsPopup.style.right = '10px';
        settingsPopup.style.backgroundColor = '#222';
        settingsPopup.style.color = '#fff';
        settingsPopup.style.padding = '20px';
        settingsPopup.style.borderRadius = '10px';
        settingsPopup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        settingsPopup.style.zIndex = '1001';
        settingsPopup.style.width = '190px';

        settingsPopup.innerHTML = `
            <h3 style="margin: 0 0 5px 0; font-size: 12px; text-align: center;">Buy Settings</h3>
            <label style="display: block; margin-bottom: 8px; font-size: 12px;">
                PP Limit:
                <input type="number" id="ppLimitInput" value="${limitPremiumPoints}"
                       style="width: 100%; margin-top: 3px; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
            </label>
            <label style="display: block; margin-bottom: 8px; font-size: 12px;">
                Min Stock:
                <input type="number" id="minStockInput" value="${minStockThreshold}"
                       style="width: 100%; margin-top: 3px; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
            </label>
            <label style="display: block; margin-bottom: 8px; font-size: 12px;">
                Res Limit:
                <input type="number" id="resLimitInput" value="${resLimit}"
                       style="width: 100%; margin-top: 3px; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
            </label>
            <div style="margin-bottom: 10px; font-size: 12px;">
                <label style="display: block; margin-bottom: 3px;">
                    <input type="checkbox" id="woodCheckbox" ${selectedResources.wood ? 'checked' : ''}> Wood
                </label>
                <label style="display: block; margin-bottom: 3px;">
                    <input type="checkbox" id="stoneCheckbox" ${selectedResources.stone ? 'checked' : ''}> Stone
                </label>
                <label style="display: block; margin-bottom: 3px;">
                    <input type="checkbox" id="ironCheckbox" ${selectedResources.iron ? 'checked' : ''}> Iron
                </label>
            </div>
            <div style="margin-bottom: 10px; font-size: 12px;">
                <label style="display: block; margin-bottom: 3px; font-weight: bold;">Buy Priority:</label>
                <select id="priority1" style="width: 100%; margin-bottom: 3px; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
                    <option value="wood" ${buyPriority[0] === 'wood' ? 'selected' : ''}>Wood</option>
                    <option value="stone" ${buyPriority[0] === 'stone' ? 'selected' : ''}>Stone</option>
                    <option value="iron" ${buyPriority[0] === 'iron' ? 'selected' : ''}>Iron</option>
                </select>
                <select id="priority2" style="width: 100%; margin-bottom: 3px; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
                    <option value="wood" ${buyPriority[1] === 'wood' ? 'selected' : ''}>Wood</option>
                    <option value="stone" ${buyPriority[1] === 'stone' ? 'selected' : ''}>Stone</option>
                    <option value="iron" ${buyPriority[1] === 'iron' ? 'selected' : ''}>Iron</option>
                </select>
                <select id="priority3" style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #333; color: #fff;">
                    <option value="wood" ${buyPriority[2] === 'wood' ? 'selected' : ''}>Wood</option>
                    <option value="stone" ${buyPriority[2] === 'stone' ? 'selected' : ''}>Stone</option>
                    <option value="iron" ${buyPriority[2] === 'iron' ? 'selected' : ''}>Iron</option>
                </select>
            </div>
            <button id="saveSettingsButton"
                    style="width: 100%; padding: 5px; background-color: #28a745; color: white;
                           border: none; border-radius: 5px; cursor: pointer; font-size: 13px;">
                Save
            </button>
        `;

        document.body.appendChild(settingsPopup);

        document.getElementById('saveSettingsButton').addEventListener('click', () => {
            limitPremiumPoints = parseInt(document.getElementById('ppLimitInput').value, 10);
            minStockThreshold = parseInt(document.getElementById('minStockInput').value, 10);
            resLimit = parseInt(document.getElementById('resLimitInput').value, 10);
            selectedResources.wood = document.getElementById('woodCheckbox').checked;
            selectedResources.stone = document.getElementById('stoneCheckbox').checked;
            selectedResources.iron = document.getElementById('ironCheckbox').checked;

            // Update priority
            buyPriority[0] = document.getElementById('priority1').value;
            buyPriority[1] = document.getElementById('priority2').value;
            buyPriority[2] = document.getElementById('priority3').value;

            saveSettings();
        });
    }

    // Update button state
    function updateButtonState(isRunning) {
        const autoButton = document.getElementById('autoButton');
        const countdownElement = document.getElementById('countdown-timer');

        if (!autoButton || !countdownElement) return;

        if (isRunning) {
            autoButton.innerText = 'StopBuy';
            autoButton.style.backgroundColor = '#dc3545';
            countdownElement.innerText = 'Wait 0.25-1.5s';
        } else {
            autoButton.innerText = 'AutoBuy';
            autoButton.style.backgroundColor = '#28a745';
            countdownElement.innerText = 'Auto BUY V2.0';
        }
        localStorage.setItem(`buttonStatus_${villageId}`, isRunning ? 'running' : 'stopped');
    }

    // Create UI
    function createUI() {
        loadSettings();

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '10px';
        container.style.backgroundColor = '#222';
        container.style.color = '#fff';
        container.style.padding = '12px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.backdropFilter = 'blur(5px)';

        // Countdown/Status Display
        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown-timer';
        countdownElement.style.marginBottom = '1px';
        countdownElement.style.fontSize = '12px';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.textAlign = 'center';
        countdownElement.innerText = 'Auto BUY V6.0';
        container.appendChild(countdownElement);

        // Button Container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.width = '100%';
        buttonContainer.style.gap = '5px';

        // Auto Button
        const autoButton = document.createElement('button');
        autoButton.id = 'autoButton';
        autoButton.innerText = 'AutoBuy';
        autoButton.style.padding = '5px 10px';
        autoButton.style.fontSize = '13px';
        autoButton.style.color = '#fff';
        autoButton.style.border = 'none';
        autoButton.style.borderRadius = '5px';
        autoButton.style.cursor = 'pointer';
        autoButton.style.transition = 'background-color 0.3s ease';
        autoButton.style.backgroundColor = '#28a745'; // Set default color

        const savedStatus = localStorage.getItem(`buttonStatus_${villageId}`);
        if (savedStatus === 'running') {
            intervalId = setInterval(autoFill, Math.random() * 1250 + 250);
            autoButton.innerText = 'StopBuy';
            autoButton.style.backgroundColor = '#dc3545';
            countdownElement.innerText = 'Wait 0.25-1.5s';
        }

        autoButton.addEventListener('click', function() {
            if (intervalId === null) {
                intervalId = setInterval(autoFill, Math.random() * 1250 + 250);
                updateButtonState(true);
            } else {
                clearInterval(intervalId);
                intervalId = null;
                updateButtonState(false);
            }
        });

        // Manual Button
        const manualButton = document.createElement('button');
        manualButton.innerText = 'Manual';
        manualButton.style.padding = '5px 10px';
        manualButton.style.fontSize = '13px';
        manualButton.style.backgroundColor = '#ff7f00';
        manualButton.style.color = '#fff';
        manualButton.style.border = 'none';
        manualButton.style.borderRadius = '5px';
        manualButton.style.cursor = 'pointer';
        manualButton.style.transition = 'background-color 0.3s ease';
        manualButton.addEventListener('click', manualFillResource);

        // Settings Button
        const settingsButton = document.createElement('button');
        settingsButton.innerText = 'Settings';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.fontSize = '13px';
        settingsButton.style.backgroundColor = '#007bff';
        settingsButton.style.color = '#fff';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.transition = 'background-color 0.3s ease';
        settingsButton.addEventListener('click', toggleSettingsPopup);

        buttonContainer.appendChild(autoButton);
        buttonContainer.appendChild(manualButton);
        buttonContainer.appendChild(settingsButton);

        container.appendChild(buttonContainer);
        document.body.appendChild(container);
    }

    // Initialize - Tunggu sampai halaman selesai load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();