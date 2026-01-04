// ==UserScript==
// @name         Autotrading (Sell) Kontinen New
// @version      1
// @description  Auto buy
// @include      https://*/game.php*village=18784*screen=market&mode=exchange*
// @include      https://*/game.php*village=17817*screen=market&mode=exchange*
// @include      https://*/game.php*village=18475*screen=market&mode=exchange*
// @include      https://*/game.php*village=20842*screen=market&mode=exchange*
// @include      https://*/game.php*village=21265*screen=market&mode=exchange*
// @include      https://*/game.php*village=18306*screen=market&mode=exchange*

// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/557070/Autotrading%20%28Sell%29%20Kontinen%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/557070/Autotrading%20%28Sell%29%20Kontinen%20New.meta.js
// ==/UserScript==

 (function() {
    'use strict';

    function getVillageId() {
        const match = window.location.href.match(/village=([^&]*)/);
        return match ? match[1] : null;
    }

    const villageId = getVillageId();
    if (!villageId) {
        console.error('Village ID not found in URL.');
        return;
    }

    const coefStock = 0.0041;
    const coefCapacity = -0.0037;
    const intercept = 411.86;

    let targetsell = 600;
    let selectedResourcesSell = { wood: true, stone: true, iron: true };
    let settingsPopupSell = null;
    let lastSubmitTime = parseInt(localStorage.getItem('lastSubmitTime')) || 5100;
    let lastReload = parseInt(localStorage.getItem(`lastReload${villageId}`)) || 600000;
    let error = false;

    let stayMerchant = 0;
    let ressGap = 500;
    let stayRess = 1000;

    const availableMerchant = parseInt(document.getElementById('market_merchant_available_count').innerText, 10);

    function getStockAndCapacity(idStock, idCapacity) {
        return {
            stock: parseFloat(document.getElementById(idStock).innerText),
            capacity: parseFloat(document.getElementById(idCapacity).innerText)
        };
    }

    function getRessStock(resId) {
        return parseFloat(document.getElementById(resId).innerText);
    }

    function buildMaterialsContext() {
        const base = [
            { stockId: 'premium_exchange_stock_wood', capacityId: 'premium_exchange_capacity_wood', buyInput: 'buy_wood', sellInput: 'sell_wood', key: 'wood' },
            { stockId: 'premium_exchange_stock_stone', capacityId: 'premium_exchange_capacity_stone', buyInput: 'buy_stone', sellInput: 'sell_stone', key: 'stone' },
            { stockId: 'premium_exchange_stock_iron', capacityId: 'premium_exchange_capacity_iron', buyInput: 'buy_iron', sellInput: 'sell_iron', key: 'iron' }
        ];

        const adjustMerchant = availableMerchant - stayMerchant;
        const materials = [];

        for (const m of base) {
            if (!selectedResourcesSell[m.key]) continue;

            const { stock, capacity } = getStockAndCapacity(m.stockId, m.capacityId);
            const ressStock = getRessStock(m.key);

            let requiredStock = (targetsell - intercept - coefCapacity * capacity) / coefStock;
            let stockDifference = stock - requiredStock;
            let adjustedStockDiff = Math.round(stockDifference);

            if (ressStock > 0) {
                const adjRess = -(ressStock - stayRess);
                adjustedStockDiff = Math.max(adjustedStockDiff, adjRess);

                if (adjustedStockDiff < 0) {
                    const maxMerchantStock = adjustMerchant * -1000;
                    adjustedStockDiff = Math.max(adjustedStockDiff, maxMerchantStock);

                    if (adjustedStockDiff < stayRess) {
                        adjustedStockDiff = Math.round(adjustedStockDiff / 1000) * 1000 + ressGap;
                    } else {
                        adjustedStockDiff = 0;
                    }
                } else {
                    adjustedStockDiff = 0;
                }
            }

            if ((stock + Math.abs(adjustedStockDiff)) > (capacity - 2000)) {
                adjustedStockDiff = -((capacity - 1000) - stock);
            }

            materials.push({
                ...m,
                stock,
                capacity,
                ressStock,
                requiredStock,
                stockDifference,
                adjustedStockDiff
            });
        }

        return materials;
    }

    function computeBestSell(materials) {
        let best = null;

        for (const m of materials) {
            if (m.adjustedStockDiff < 0) {
                const amount = Math.abs(m.adjustedStockDiff);
                if (amount < ressGap) continue;

                if (!best || amount > best.amount) {
                    best = { material: m, amount };
                }
            }
        }

        return best;
    }

    function formHasBuyInput() {
        const bw = document.getElementsByName('buy_wood')[0]?.value || '';
        const bs = document.getElementsByName('buy_stone')[0]?.value || '';
        const bi = document.getElementsByName('buy_iron')[0]?.value || '';
        return !!(bw || bs || bi);
    }

    function applySellChoice(choice, countdownEl) {
        if (!choice) {
            countdownEl.innerText = 'Tidak ada resource yang memenuhi syarat jual';
            return false;
        }

        if (formHasBuyInput()) {
            countdownEl.innerText = 'Error: kolom Buy terisi';
            error = true;
            return false;
        }

        const { material, amount } = choice;

        document.getElementsByName(material.sellInput)[0].value = amount;
        document.getElementsByName(material.buyInput)[0].value = '';
        error = false;

        countdownEl.innerText = `Sell ${amount} ${material.key}`;
        return true;
    }

    function submitIfReady(choice, countdownEl) {
        const now = Date.now();
        const elapsed = now - lastSubmitTime;
        const needed = 5000;

        if (elapsed < needed) {
            const wait = needed + 500 - elapsed;
            countdownEl.innerText = `Cooldown ${Math.ceil(wait / 1000)}s`;
            setTimeout(() => submitIfReady(choice, countdownEl), wait);
            return;
        }

        if (!choice || error) {
            countdownEl.innerText = 'Error / tidak ada aksi, reload dalam 6s';
            setTimeout(() => location.reload(), Math.random() * 1500 + 5500);
            return;
        }

        const submitButton = document.querySelector('input[type="submit"][value="Calculate best offer "]');
        if (!submitButton) {
            countdownEl.innerText = 'Tombol submit tidak ditemukan';
            return;
        }

        setTimeout(() => {
            submitButton.click();
            lastSubmitTime = Date.now();
            localStorage.setItem('lastSubmitTime', lastSubmitTime);

            setTimeout(() => {
                const confirmButton = document.querySelector('.confirmation-buttons .btn.evt-confirm-btn.btn-confirm-yes');
                if (confirmButton) confirmButton.click();

                setTimeout(() => {
                    countdownEl.innerText = 'Reload...';
                    location.reload();
                }, Math.random() * 1500 + 4500);
            }, Math.random() * 500 + 500);
        }, Math.random() * 1000 + 2000);
    }

    function autoProcessMaterialsSell() {
        const countdownEl = document.getElementById('countdown-timer-sell');
        if (!countdownEl) return;

        countdownEl.innerText = 'Checking PP Price';
        error = false;

        const materials = buildMaterialsContext();
        const choice = computeBestSell(materials);

        if (!choice) {
            countdownEl.innerText = 'Tidak ada transaksi yang menguntungkan';
            return;
        }

        countdownEl.innerText = `Sell ress until ${targetsell}`;
        const canApply = applySellChoice(choice, countdownEl);
        if (!canApply) return;

        submitIfReady(choice, countdownEl);
    }

    function village_checking() {
        const villages = [18784, 17817, 18475, 20842, 21265, 18306];

        const woodStock = getRessStock('wood');
        const clayStock = getRessStock('stone');
        const ironStock = getRessStock('iron');
        const availableMerchantLocal = parseInt(document.getElementById('market_merchant_available_count').innerText, 10);

        let stayRessLocal = parseInt(localStorage.getItem('stayRess')) || 0;
        let iterasi = parseInt(localStorage.getItem('iterasi')) || 0;
        let reloadScheduled = localStorage.getItem('reloadScheduled') === 'true';
        let reloadAt = localStorage.getItem('reloadAt') ? new Date(localStorage.getItem('reloadAt')) : null;
        const now = new Date();

        let ressbyk = 0;
        if (woodStock > (stayRessLocal + 2000)) ressbyk++;
        if (clayStock > (stayRessLocal + 2000)) ressbyk++;
        if (ironStock > (stayRessLocal + 2000)) ressbyk++;

        if (ressbyk > 1 && availableMerchantLocal > 0) {
            autoProcessMaterialsSell();
            return;
        }

        if (iterasi >= 5) {
            if (!reloadScheduled || !reloadAt) {
                const additionalMinutes = Math.floor(Math.random() * 5) + 8;
                const targetReloadTime = new Date(now.getTime() + additionalMinutes * 60000);
                localStorage.setItem('reloadScheduled', 'true');
                localStorage.setItem('reloadAt', targetReloadTime.toISOString());
            } else {
                const timeRemaining = reloadAt.getTime() - now.getTime();
                if (timeRemaining <= 0) {
                    localStorage.setItem('iterasi', 0);
                    localStorage.removeItem('reloadScheduled');
                    localStorage.removeItem('reloadAt');
                    location.reload();
                    return;
                }
            }
        } else {
            iterasi += 1;
            localStorage.setItem('iterasi', iterasi);
            setTimeout(() => {
                const currentVillage = villages[iterasi % villages.length];
                window.location.href = `/game.php?village=${currentVillage}&screen=market&mode=exchange`;
            }, 3000);
        }
    }





    // Reset flag justReloaded setelah reload
    if (sessionStorage.getItem("justReloaded") === "true") {
        console.log("Halaman baru saja direload, reset justReloaded & reloadmerchant.");
        sessionStorage.removeItem("justReloaded");
        sessionStorage.removeItem("reloadmerchant");
        sessionStorage.removeItem("reloadTime");
        reloadmerchant = 0;
        reloadTime = null;
    }




    function saveSettingsSell() {
        localStorage.setItem(`targetsell${villageId}`, targetsell);
        localStorage.setItem(`stayMerchant${villageId}`, stayMerchant);
        localStorage.setItem(`ressGap`, ressGap);
        localStorage.setItem(`stayRess`, stayRess);
        localStorage.setItem(`selectedResourcesSell${villageId}`, JSON.stringify(selectedResourcesSell));
        toggleSettingsPopupSell();
    }

    function loadSettingsSell() {
        targetsell = parseFloat(localStorage.getItem(`targetsell${villageId}`)) || 490;
        stayMerchant = parseFloat(localStorage.getItem(`stayMerchant${villageId}`)) || 0;
        ressGap = parseFloat(localStorage.getItem(`ressGap`)) || 500;
        stayRess = parseFloat(localStorage.getItem(`stayRess`)) || 0;
        selectedResourcesSell = JSON.parse(localStorage.getItem(`selectedResourcesSell${villageId}`)) || { wood: true, stone: true, iron: true };
    }

    function toggleSettingsPopupSell() {
        if (settingsPopupSell) {
            settingsPopupSell.remove();
            settingsPopupSell = null;
            return;
        }

        settingsPopupSell = document.createElement('div');
        settingsPopupSell.style.position = 'fixed';
        settingsPopupSell.style.bottom = '100px';
        settingsPopupSell.style.left = '100px';
        settingsPopupSell.style.backgroundColor = '#222';
        settingsPopupSell.style.color = '#fff';
        settingsPopupSell.style.padding = '20px';
        settingsPopupSell.style.borderRadius = '10px';
        settingsPopupSell.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        settingsPopupSell.style.zIndex = '1000';
        settingsPopupSell.style.width = '180px';
        settingsPopupSell.style.height = 'auto';

        settingsPopupSell.innerHTML = `
            <h3 style="margin: 0 0 5px 0; font-size: 14px; text-align: center;">Sell Settings</h3>
            <div style="margin-bottom: 3px; display: flex;font-size: 12px">
                <label>Target Sell: <input type="number" id="targetsellInput" value="${targetsell}" style="width: 100%; margin-bottom: 10px;"></label><br>
                <label>stay Merchant: <input type="number" id="stayMerchantInput" value="${stayMerchant}" style="width: 100%; margin-bottom: 10px;"></label>
            </div>
            <div style="margin-bottom: 3px; display: flex;font-size: 12px">
                <label>ress Gap: <input type="number" id="ressGapInput" value="${ressGap}" style="width: 100%; margin-bottom: 10px;"></label><br>
                <label>stay Ress: <input type="number" id="stayRessInput" value="${stayRess}" style="width: 100%; margin-bottom: 10px;"></label>
            </div>

            <div style="margin-bottom: 3px; display: flex;">
                <label><input type="checkbox" id="woodCheckbox" ${selectedResourcesSell.wood ? 'checked' : ''}> Wood</label><br>
                <label><input type="checkbox" id="stoneCheckbox" ${selectedResourcesSell.stone ? 'checked' : ''}> Stone</label><br>
                <label><input type="checkbox" id="ironCheckbox" ${selectedResourcesSell.iron ? 'checked' : ''}> Iron</label>
            </div>
            <button id="saveSettingsSellButton" style="width: 100%; padding: 5px; background-color: #28a745; color: white; border: none; border-radius: 5px;">Save</button>
        `;

        document.body.appendChild(settingsPopupSell);

        document.getElementById('saveSettingsSellButton').addEventListener('click', () => {
            targetsell = parseFloat(document.getElementById('targetsellInput').value);
            stayMerchant = parseFloat(document.getElementById('stayMerchantInput').value);
            ressGap = parseFloat(document.getElementById('ressGapInput').value);
            stayRess = parseFloat(document.getElementById('stayRessInput').value);
            selectedResourcesSell.wood = document.getElementById('woodCheckbox').checked;
            selectedResourcesSell.stone = document.getElementById('stoneCheckbox').checked;
            selectedResourcesSell.iron = document.getElementById('ironCheckbox').checked;
            saveSettingsSell();
        });
    }

    function createUI() {
        loadSettingsSell();

        const containerSell = document.createElement('div');
        containerSell.style.position = 'fixed';
        containerSell.style.bottom = '20px';
        containerSell.style.left = '100px';
        containerSell.style.backgroundColor = '#222';
        containerSell.style.color = '#fff';
        containerSell.style.padding = '12px';
        containerSell.style.borderRadius = '8px';
        containerSell.style.zIndex = '1000';
        containerSell.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        containerSell.style.display = 'flex';
        containerSell.style.flexDirection = 'column';
        containerSell.style.gap = '10px';
        containerSell.style.backdropFilter = 'blur(5px)';

        const countdownElementSell = document.createElement('div');
        countdownElementSell.id = 'countdown-timer-sell';
        countdownElementSell.style.marginBottom = '1px';
        countdownElementSell.style.fontSize = '12px';
        countdownElementSell.style.fontWeight = 'bold';
        countdownElementSell.style.textAlign = 'center';
        countdownElementSell.innerText = 'Auto Trading (Sell)';
        containerSell.appendChild(countdownElementSell);

        const buttoncontainerSell = document.createElement('div');
        buttoncontainerSell.style.display = 'flex';
        buttoncontainerSell.style.justifyContent = 'space-between';
        buttoncontainerSell.style.width = '100%';
        buttoncontainerSell.style.gap = '5px';

        const manualButtonSell = document.createElement('button');
        manualButtonSell.innerText = 'Manual';
        manualButtonSell.style.padding = '5px 10px';
        manualButtonSell.style.fontSize = '13px';
        manualButtonSell.style.backgroundColor = '#ff7f00';
        manualButtonSell.style.color = '#ffff';
        manualButtonSell.style.border = 'none';
        manualButtonSell.style.borderRadius = '5px';
        manualButtonSell.style.cursor = 'pointer';
        manualButtonSell.style.transition = 'background-color 0.3s ease';
        manualButtonSell.addEventListener('click', autoFillAllMaterialsSell);

        const AutoButtonSell = document.createElement('button');
        AutoButtonSell.style.padding = '5px 10px';
        AutoButtonSell.style.fontSize = '13px';
        AutoButtonSell.style.color = '#fff';
        AutoButtonSell.style.border = 'none';
        AutoButtonSell.style.borderRadius = '5px';
        AutoButtonSell.style.cursor = 'pointer';
        AutoButtonSell.style.transition = 'background-color 0.3s ease';

        const savedStatus = localStorage.getItem(`buttonStatusSellK${villageId}`);
        let intervalId = null;

        function updateButtonStateSell(isRunningSell) {
            if (isRunningSell) {
                AutoButtonSell.innerText = 'StopSell';
                AutoButtonSell.style.backgroundColor = '#dc3545';
                countdownElementSell.innerText = 'Wait 2-10s';
            } else {
                AutoButtonSell.innerText = 'AutoSell';
                countdownElementSell.innerText = 'Auto Trading (Sell)';
                AutoButtonSell.style.backgroundColor = '#28a745';
            }
            localStorage.setItem(`buttonStatusSellK${villageId}`, isRunningSell ? 'running' : 'stopped');
        }

        if (savedStatus === 'running') {
            intervalId = setInterval(village_checking, Math.random() * 8000 + 2000);
            updateButtonStateSell(true);
        } else {
            updateButtonStateSell(false);
        }

        AutoButtonSell.addEventListener('click', function() {
            if (intervalId === null) {
                intervalId = setInterval(village_checking, Math.random() * 8000 + 2000);
                updateButtonStateSell(true);
            } else {
                clearInterval(intervalId);
                intervalId = null;
                updateButtonStateSell(false);
            }
        });

        const settingsButtonSell = document.createElement('button');
        settingsButtonSell.innerText = 'Settings';
        settingsButtonSell.style.padding = '5px 10px';
        settingsButtonSell.style.fontSize = '13px';
        settingsButtonSell.style.backgroundColor = '#007bff';
        settingsButtonSell.style.color = '#fff';
        settingsButtonSell.style.border = 'none';
        settingsButtonSell.style.borderRadius = '5px';
        settingsButtonSell.style.cursor = 'pointer';
        settingsButtonSell.style.transition = 'background-color 0.3s ease';
        settingsButtonSell.addEventListener('click', toggleSettingsPopupSell);

        buttoncontainerSell.appendChild(AutoButtonSell);
        buttoncontainerSell.appendChild(manualButtonSell);
        buttoncontainerSell.appendChild(settingsButtonSell);

        containerSell.appendChild(buttoncontainerSell);

        document.body.appendChild(containerSell);
    }

    createUI();

})();