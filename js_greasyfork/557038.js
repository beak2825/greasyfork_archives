// ==UserScript==
// @name         Mousehunt Vrift script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Donate: paypal.me/mousehuntscripter
// @author       You
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/557038/Mousehunt%20Vrift%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/557038/Mousehunt%20Vrift%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitRandom() { return new Promise(function(r) { setTimeout(r, 1000 + Math.random() * 1000); }); }
    function isVisible(el) {
        if (!el) return false;
        var style = window.getComputedStyle(el);
        return el.offsetParent !== null && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    // --- Settings & UI ---
    const settings = {
        autoReenter: localStorage.getItem('vrift_autoReenter') !== 'false',
        autoCf: localStorage.getItem('vrift_autoCf') !== 'false'
    };

    function saveSettings() {
        localStorage.setItem('vrift_autoReenter', settings.autoReenter);
        localStorage.setItem('vrift_autoCf', settings.autoCf);
    }

    const style = document.createElement('style');
    style.textContent = `
        .pageFrameView-column.right { position: relative; }
        #vrift-config-bubble {
            position: relative; margin: 10px auto; width: 40px; height: 40px;
            background: #007bff; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 10000; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-weight: bold; font-family: sans-serif;
        }
        #vrift-config-panel {
            position: absolute; top: 50px; right: 10px; background: white;
            border: 1px solid #ccc; padding: 10px; border-radius: 5px;
            z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: none; font-family: sans-serif; color: black;
            width: 150px;
        }
        #vrift-config-panel.open { display: block; }
        .vrift-config-row { margin-bottom: 10px; }
        .vrift-config-row label { display: flex; align-items: center; cursor: pointer; }
        .vrift-config-row input { margin-right: 5px; }
    `;
    document.head.appendChild(style);

    const bubble = document.createElement('div');
    bubble.id = 'vrift-config-bubble';
    bubble.innerText = 'VR';

    const panel = document.createElement('div');
    panel.id = 'vrift-config-panel';
    panel.innerHTML = `
        <div class="vrift-config-row">
            <label><input type="checkbox" id="vrift-autoReenter" ${settings.autoReenter ? 'checked' : ''}> Auto Re-enter</label>
        </div>
        <div class="vrift-config-row">
            <label><input type="checkbox" id="vrift-autoCf" ${settings.autoCf ? 'checked' : ''}> Auto CF (Fuel)</label>
        </div>
    `;

    const container = document.querySelector('.pageFrameView-column.right') || document.body;
    container.appendChild(bubble);
    container.appendChild(panel);

    bubble.addEventListener('click', function() { panel.classList.toggle('open'); });
    document.getElementById('vrift-autoReenter').addEventListener('change', function(e) {
        settings.autoReenter = e.target.checked;
        saveSettings();
    });
    document.getElementById('vrift-autoCf').addEventListener('change', function(e) {
        settings.autoCf = e.target.checked;
        saveSettings();
    });
    // ---------------------

    async function checkAndAct() {
        console.log('running');
        const locationElement = document.getElementsByClassName("hudstatvalue hud_location")[0];
        if (!locationElement || locationElement.innerText != 'Valour Rift') {
            console.log("Not in Vrift");
            return;
        }

        // 1. Claim Rewards
        const claimContainer = document.querySelector('.valourRiftHUD-claimContainer');
        if (isVisible(claimContainer)) {
            console.log("Claiming rewards");
            const claimButton = document.querySelector('.valourRiftHUD-claimButton.mousehuntActionButton');
            if (claimButton) {
                claimButton.click();
                await waitRandom();
                const closeButton = document.querySelector('.valourRiftPopupClaim-footer-closeButton.jsDialogClose');
                if (closeButton) {
                    closeButton.click();
                    await waitRandom();
                    location.reload();
                    return;
                }
            }
        }

        // 2. Enter Tower
        const stateElement = document.querySelector('.valourRiftHUD-state.farming');
        if (settings.autoReenter && isVisible(stateElement) && stateElement.textContent.includes("Tower Entrance")) {
            console.log("Entering tower");
            const enterButton = document.querySelector('.valourRiftHUD-enterTowerButton');
            if (enterButton) {
                console.log("Entering tower");
                enterButton.click();
                await waitRandom();

                const augContainer = document.querySelector('.valourRiftHUD-augmentationContainer');
                if (augContainer) {
                    const augmentations = augContainer.querySelectorAll('.valourRiftHUD-augmentation');
                    const sigilAug = augContainer.querySelector('.valourRiftHUD-augmentation[data-type="hr"]');
                    if (sigilAug) {
                        console.log("Selecting Sigils");
                        sigilAug.click();
                    }
                    await waitRandom();
                    const secretAug = augContainer.querySelector('.valourRiftHUD-augmentation[data-type="sr"]');
                    if (secretAug) {
                        console.log("Selecting Secrets");
                        secretAug.click();
                    }
                    await waitRandom();
                }
                const finalEnterButton = document.querySelector('.valourRiftPopupIllustrated-enterTowerButton');
                if (finalEnterButton) {
                    console.log("Finalizing tower entry");
                    finalEnterButton.click();
                    await waitRandom();
                    location.reload();
                    return;
                }
                return;
            }
        }

        // 3. Existing Fuel Logic
        const stepsRemainingElement = document.getElementsByClassName("valourRiftHUD-stepsRemaining")[0];
        if (settings.autoCf && stepsRemainingElement) {
            const stepsRemaining = parseInt(stepsRemainingElement.innerText, 10);
            const armButton = document.getElementsByClassName("valourRiftHUD-fuelContainer-armButton")[0];
            const isArmed = document.getElementsByClassName("valourRiftHUD-fuelContainer-armButton active").length > 0;

            if (stepsRemaining < 10) {
                console.log("Should arm, steps remaining: " + stepsRemaining);
                if (!isArmed && armButton) {
                    console.log("Arming");
                    armButton.click();
                }
            } else {
                console.log("Should disarm, steps remaining: " + stepsRemaining);
                if (isArmed && armButton) {
                    console.log("Disarming");
                    armButton.click();
                }
            }
        }
    }
    setInterval(checkAndAct, 30 * 1000);
    checkAndAct();
})();