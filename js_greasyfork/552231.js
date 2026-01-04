// ==UserScript==
// @name         Autotrading (Sell) Kontinen K63
// @version      1.2
// @description  Auto buy
// @include      https://*/game.php*village=21225*screen=market&mode=exchange*
// @include      https://*/game.php*village=21448*screen=market&mode=exchange*



// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/552231/Autotrading%20%28Sell%29%20Kontinen%20K63.user.js
// @updateURL https://update.greasyfork.org/scripts/552231/Autotrading%20%28Sell%29%20Kontinen%20K63.meta.js
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
        return; // Stop execution if no villageId is found
    }

    const coefStock = 0.0041;
    const coefCapacity = -0.0037;
    const intercept = 411.86;

    // const coefStock = 0.00173;
    // const coefCapacity = -0.00129;
    // const intercept = 225.27;

    let targetsell = 600;
    let selectedResourcesSell = { wood: true, stone: true, iron: true };
    let settingsPopupSell = null;
    // let lastSubmitTime = 5100;
    let lastSubmitTime = parseInt(localStorage.getItem('lastSubmitTime')) || 5100;
    let lastReload = parseInt(localStorage.getItem(`lastReload${villageId}`)) || 600000;
    let adjustedStockDiff = 0;
    let error =  false ;

    let stayMerchant =  0;
    let ressGap = 500;
    let stayRess = 1000;
    let adjRess = 0;

    let minStockMaterial = null;
    let minStockDiff = null;
    let minRessStock = Infinity;
    let availableMerchant = parseInt(document.getElementById('market_merchant_available_count').innerText);
    let adjustMerchant = 0;
    let iterasi = parseInt(localStorage.getItem('iterasi')) || 0;


    function getStockAndCapacity(idStock, idCapacity) { // Stock Market
        return {
            stock: parseFloat(document.getElementById(idStock).innerText),
            capacity: parseFloat(document.getElementById(idCapacity).innerText)
        };
    }

    function getRessStock(Ress) {     // Stock desa
        return {
            RessStock: parseFloat(document.getElementById(Ress).innerText),
        };
    }


    function autoFillAllMaterialsSell() {
        const countdownPopupSell = document.getElementById('countdown-timer-sell');

        if (isNaN(targetsell)) {
            console.error("Harap masukkan harga target yang valid.");
            return;
        }

        const materials = [
            { stockId: "premium_exchange_stock_wood", capacityId: "premium_exchange_capacity_wood", buyInput: "buy_wood", sellInput: "sell_wood", key: "wood" },
            { stockId: "premium_exchange_stock_stone", capacityId: "premium_exchange_capacity_stone", buyInput: "buy_stone", sellInput: "sell_stone", key: "stone" },
            { stockId: "premium_exchange_stock_iron", capacityId: "premium_exchange_capacity_iron", buyInput: "buy_iron", sellInput: "sell_iron", key: "iron" }
        ];


        materials.forEach(material => {
            console.log(`Memeriksa material: ${material.key}`);
            console.log(`Apakah material dipilih?`, selectedResourcesSell[material.key] ? "Ya" : "Tidak");
            if (!selectedResourcesSell[material.key]) {
                console.log(`Material ${material.key} tidak dipilih, melewati iterasi ini.`);
                return;
            }

            const { stock, capacity } = getStockAndCapacity(material.stockId, material.capacityId);
            material.requiredStock = (targetsell - intercept - coefCapacity * capacity) / coefStock;
            material.stockDifference = stock - material.requiredStock;
            material.ressStock = getRessStock(material.key).RessStock;

            material.adjustedStockDiff = Math.round(material.stockDifference);
            console.log("Stock (Ress):", material.ressStock);
            console.log("Stock Diff:", material.adjustedStockDiff);

            if (material.ressStock > 0) {
                adjRess = -(material.ressStock - stayRess)
                material.adjustedStockDiff = Math.max(material.adjustedStockDiff, adjRess);
                console.log("Adjust Stock (Ress):", material.adjustedStockDiff);
                console.log("Available Merchant:", adjustMerchant);

                if (material.adjustedStockDiff<0){
                    let maxMerchantStock = availableMerchant * -1000;
                    material.adjustedStockDiff = Math.max(material.adjustedStockDiff, maxMerchantStock);
                    console.log("Adjust Stock (merchant):", material.adjustedStockDiff);
                    console.log("stayRess", stayRess);
                    if ( material.adjustedStockDiff < stayRess) {
                        material.adjustedStockDiff = Math.round(material.adjustedStockDiff / 1000) * 1000;
                        material.adjustedStockDiff =  material.adjustedStockDiff  + ressGap ;
                        console.log("Adjust Stock (round):", material.adjustedStockDiff);
                    } else {
                      material.adjustedStockDiff = "";
                      countdownPopupSell.innerText = `Ress Habis`;
                      console.error("Harga PP tinggi \n atau Ress Habis");
                    }
                }else {
                      material.adjustedStockDiff = "";
                      countdownPopupSell.innerText = `Harga PP tinggi`;
                      console.error("Harga PP tinggi");
                }
            }

            console.log("Stock Difference:", minStockDiff);
            console.log("Ready sell:", material.adjustedStockDiff);
            // Cari material dengan stockDifference paling rendah

            console.log("Stock :",stock);
            console.log("Capacity",capacity);
            if ((stock + Math.abs(material.adjustedStockDiff)) > (capacity - 2000)){
                console.error("Melebihi capacity");
                material.adjustedStockDiff = -((capacity-1000) - stock);
                console.log("Stock Difference:", minStockDiff);
                console.log("Ready sell:", material.adjustedStockDiff);
            }

            if (material.adjustedStockDiff < minStockDiff) {
                minStockDiff = material.adjustedStockDiff;
                minStockMaterial = material;
                minRessStock = material.ressStock;
            }
            console.log("Ress:", minStockMaterial);
        });


        if (minStockMaterial) {
            minStockDiff = Math.abs(minStockDiff)
            console.log("Final Stock Diff:", minStockDiff);
            console.log("Ress Gap:", ressGap);
            if (minStockDiff < ressGap) {
                console.log("Input terlalu kecil");
                minStockDiff="";
            }
            if (document.getElementsByName('buy_wood')[0].value === "" &&
                document.getElementsByName('buy_stone')[0].value === "" &&
                document.getElementsByName('buy_iron')[0].value === "") {

                document.getElementsByName(minStockMaterial.sellInput)[0].value = minStockDiff;
                document.getElementsByName(minStockMaterial.buyInput)[0].value = "";
                error = false;
            } else {
              console.log("Error Input Buy Terisi");
              countdownPopupSell.innerText = `Error Input Buy Terisi`;
              error = true;
            }

        }
    }

    function checkAndSubmit() {
        let submitButton = document.querySelector('input[type="submit"][value="Calculate best offer "]');
        let lastSubmitTime = parseInt(localStorage.getItem('lastSubmitTime')) || 0;
        let timeElapsed = Date.now() - lastSubmitTime;

        if (timeElapsed < 5000) {
            console.log("Waiting for cooldown...");
            setTimeout(checkAndSubmit, 5500 - timeElapsed);
            return;
        }

        if (minStockDiff >= ressGap && error === false) {
            setTimeout(() => {
                console.log("Sell res");
                submitButton.click();
                lastSubmitTime = Date.now();
                localStorage.setItem('lastSubmitTime', lastSubmitTime);

                setTimeout(() => {
                    console.log("confirm");
                    let confirmButton = document.querySelector('.confirmation-buttons .btn.evt-confirm-btn.btn-confirm-yes');
                    if (confirmButton) confirmButton.click();
                    setTimeout(() => {
                        console.log("reload in 6s");
                        location.reload();
                    }, Math.random() * 1500 + 4500);
                }, Math.random() * 500 + 500);
            }, Math.random() * 1000 + 2000);
        } else if (error === true) {
            countdownPopup.innerText = `Error, reload dalam 6s`;
            console.log("reload in 6s");
            setTimeout(() => {
                location.reload();
            }, Math.random() * 1500 + 5500);
        }
    }

    function autoProcessMaterialsSell() {
        const materials = [
            { stockId: "premium_exchange_stock_wood", capacityId: "premium_exchange_capacity_wood", key: "wood" },
            { stockId: "premium_exchange_stock_stone", capacityId: "premium_exchange_capacity_stone", key: "stone" },
            { stockId: "premium_exchange_stock_iron", capacityId: "premium_exchange_capacity_iron", key: "iron" }
        ];

        const countdownPopupSell = document.getElementById('countdown-timer-sell');

        for (let material of materials) {
            countdownPopupSell.innerText = `Checking PP Price`;

            if (!selectedResourcesSell[material.key]) continue;

            const { stock, capacity } = getStockAndCapacity(material.stockId, material.capacityId);
            let requiredStock = (targetsell - intercept - coefCapacity * capacity) / coefStock;

            if (stock < requiredStock) {
                countdownPopupSell.innerText = `Sell ress until ${targetsell}`;
                adjustMerchant = availableMerchant - stayMerchant;
                console.log("Jumlah merchant:", adjustMerchant);

                if (adjustMerchant > 0) {
                    autoFillAllMaterialsSell();
                } else if (adjustMerchant == 0 && (Date.now() - lastReload > 300000)) {
                    lastReload = Date.now();
                    localStorage.setItem(`lastReload${villageId}`, lastReload);
                    window.location.href = window.location.href;
                } else {
                    material.adjustedStockDiff = "";
                    countdownPopupSell.innerText = `Merchant Habis`;
                    console.error("Merchant habis");
                }

                checkAndSubmit();
            }
        }
    }

    function village_checking() {
        let villages = [21225, 21448];

        let woodStock = getRessStock('wood').RessStock;
        let clayStock = getRessStock('stone').RessStock;
        let ironStock = getRessStock('iron').RessStock;
        let availableMerchant = parseInt(document.getElementById('market_merchant_available_count').innerText);
        let stayRess = parseInt(localStorage.getItem(`stayRess`)) || 0;
        let iterasi = parseInt(localStorage.getItem('iterasi')) || 0;
        let reloadScheduled = localStorage.getItem('reloadScheduled') === 'true';
        let reloadAt = localStorage.getItem('reloadAt') ? new Date(localStorage.getItem('reloadAt')) : null;
        let now = new Date();

        console.log(`--- MULAI village_checking() ---`);
        console.log(`Stok saat ini -> Kayu: ${woodStock}, Tanah Liat: ${clayStock}, Besi: ${ironStock}`);
        console.log(`Merchant tersedia: ${availableMerchant}`);
        console.log(`Nilai stayRess: ${stayRess}`);
        console.log(`Iterasi ke: ${iterasi}`);

        let ressbyk = 0
        if (woodStock > (stayRess+2000)){
          ressbyk += 1
        }

        if (clayStock > (stayRess+2000)){
          ressbyk += 1
        }

        if (ironStock > (stayRess+2000)){
          ressbyk += 1
        }

        if ( ressbyk > 1 && availableMerchant > 0) {
            console.log("✅ Syarat terpenuhi: resource kurang & merchant tersedia → jalankan autoProcessMaterialsSell()");
            autoProcessMaterialsSell(); // Fungsi untuk menjual material secara otomatis

        } else if (iterasi >= villages.length) {
            if (!reloadScheduled || !reloadAt) {
                const additionalMinutes = Math.floor(Math.random() * 12) + 8; // 8–10 menit
                const targetReloadTime = new Date(now.getTime() + additionalMinutes * 60000);
                localStorage.setItem('reloadScheduled', 'true');
                localStorage.setItem('reloadAt', targetReloadTime.toISOString());

                console.log(`⏳ Iterasi mencapai batas → jadwalkan reload pada ${targetReloadTime.toLocaleTimeString()}`);
            } else {
                const timeRemaining = reloadAt.getTime() - now.getTime();

                if (timeRemaining <= 0) {
                    console.log("🔄 Waktu reload tercapai → reload sekarang.");
                    localStorage.setItem('iterasi', 0);
                    localStorage.removeItem('reloadScheduled');
                    localStorage.removeItem('reloadAt');
                    location.reload();
                } else {
                    console.log(`⏳ Menunggu waktu reload... (${Math.ceil(timeRemaining / 1000)} detik lagi)`);
                }
            }

        } else {
            iterasi += 1;
            localStorage.setItem('iterasi', iterasi);
            console.log(`➡️ Pindah ke desa berikutnya dalam 3 detik (iterasi ${iterasi})`);

            setTimeout(() => {
                let currentVillage = villages[iterasi % villages.length]; // Ambil ID desa sesuai iterasi
                console.log(`🌍 Berpindah ke desa ID: ${currentVillage}`);
                window.location.href = `/game.php?village=${currentVillage}&screen=market&mode=exchange`;
            }, 3000); // Tunggu 3 detik
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