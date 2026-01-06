// ==UserScript==
// @name         DeepCo Upgrades Helper V4.02
// @namespace    https://deepco.app/
// @version      4.02
// @description  Show details about DC and RC upgrades (Now waits for innerHTML)
// @author       Corns, Zoltan, DamagedNumberX, Embryonic
// @match        https://*.deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561526/DeepCo%20Upgrades%20Helper%20V402.user.js
// @updateURL https://update.greasyfork.org/scripts/561526/DeepCo%20Upgrades%20Helper%20V402.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_MS = 1000;

    new MutationObserver((mutation, observer) => {
        const main = document.getElementById('main-panel');
        if (main) {
            observer.disconnect();
            startLoop();
        }
    }).observe(document.body, { childList: true, subtree: true });

    function startLoop() {
        setInterval(() => { addButtonInfo(); }, INTERVAL_MS);
    }

    function addButtonInfo() {
        const dcFrame = document.querySelector('#deepcoin-upgrades');
        const rcFrame = document.querySelector('#recursive-upgrades');

        if (!dcFrame || !rcFrame) return;

        const upgradeList = document.querySelectorAll('[class="text-sm font-semibold text-terminal-accent"]');
        if (upgradeList.length < 11) return;

        const getSafeHTML = (selector) => document.querySelector(selector)?.innerHTML || "";
        const getSafeListHTML = (index) => upgradeList[index]?.innerHTML || "0";

        try {
            // --- DC Stats Extraction ---
            const speedText = getSafeHTML('[data-upgrade-type="dig_speed"] [class="flex-1"] > p:nth-child(2)');
            const clockSpeed = Math.max(0.5, parseFloat(speedText.split(' ', 2)[0].replace(/[^0-9\.]+/g, '').trim()) || 1);

            const minText = getSafeHTML('[data-upgrade-type="min_damage"] [class="flex-1"] > p:nth-child(2)');
            const minUpgrades = parseFloat(minText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 0;

            const maxText = getSafeHTML('[data-upgrade-type="max_damage"] [class="flex-1"] > p:nth-child(2)');
            const maxUpgrades = parseFloat(maxText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 0;

            const critText = getSafeHTML('[data-upgrade-type="crit_chance"] [class="flex-1"] > p:nth-child(2)');
            const overclockChance = Math.min(0.1, (parseFloat(critText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 0) / 100);

            const chainText = getSafeHTML('[data-upgrade-type="chain_chance"] [class="flex-1"] > p:nth-child(2)');
            const forkChance = Math.min(0.1, (parseFloat(chainText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 0) / 100);

            // --- RC Stats Extraction ---
            const minBonus = (parseFloat(getSafeListHTML(6).replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
            const maxBonus = (parseFloat(getSafeListHTML(7).replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
            const totalBonus = (parseFloat(getSafeListHTML(8).replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
            const dcYield = parseFloat(getSafeListHTML(10).replace(/[^0-9\.]+/g, '').trim()) / 100;

            const minPower = minUpgrades * totalBonus * minBonus;
            const maxPower = maxUpgrades * totalBonus * maxBonus;
            const overclockMultiplier = 1 + overclockChance;
            const forkMultiplier = 1 / (2 - forkChance);
            const baseDPS = (minPower + maxPower) * overclockMultiplier * forkMultiplier / clockSpeed;

            // --- RC MENU UPDATE ---
            const RCButtons = rcFrame.querySelectorAll('[class="p-2"]');
            RCButtons.forEach(group => {
                const buttons = group.querySelectorAll('[class="flex"]');
                buttons.forEach(button => {
                    if (!button.innerHTML.includes('+1 ')) return;
                    
                    const rcCost = parseInt(button.innerText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 1;
                    const basePower = baseDPS * clockSpeed;

                    let nMin = minBonus, nMax = maxBonus, nTotal = totalBonus, nYield = dcYield;

                    if (button.parentElement.innerHTML.includes('/upgrade_recursive_min')) nMin += 0.01;
                    else if (button.parentElement.innerHTML.includes('/upgrade_recursive_max')) nMax += 0.01;
                    else if (button.parentElement.innerHTML.includes('/upgrade_recursive_total_damage')) nTotal += 0.01;
                    else if (button.parentElement.innerHTML.includes('/upgrade_recursive_dc_yield')) nYield += 0.01;

                    const newAvgPower = (minUpgrades * nMin + maxUpgrades * nMax) * nTotal * overclockMultiplier * forkMultiplier;
                    const ratio = (newAvgPower - basePower) / rcCost;
                    const yieldRatio = newAvgPower / (100 * nYield * rcCost);

                    let container = button.parentElement?.parentElement?.parentElement?.parentElement;
                    if (container) {
                        let RCText = container.querySelector(`p[data-tag="RC Upgrade Gain"]`);
                        if (!RCText) {
                            RCText = document.createElement('p');
                            RCText.className = "text font-semibold text-terminal-accent";
                            RCText.dataset.tag = 'RC Upgrade Gain';
                            container.children[0]?.children[0]?.children[0]?.appendChild(RCText);
                        }
                        if (RCText) {
                            RCText.textContent = button.parentElement.innerHTML.includes('_dc_yield') 
                                ? `${yieldRatio.toFixed(3)} RC Efficiency` 
                                : `${ratio.toFixed(3)} RC Efficiency`;
                        }
                    }
                });
            });

            // --- DC MENU UPDATE (Fixed Logic) ---
            const DCButtons = dcFrame.querySelectorAll('[class="p-2"]');
            DCButtons.forEach(group => {
                const buttons = group.querySelectorAll('[class="flex"]');
                buttons.forEach(button => {
                    if (!button.textContent.includes('+1 ')) return;
                    
                    const cost = parseInt(button.innerText.split(' ', 2)[1]?.replace(/[^0-9\.]+/g, '').trim()) || 1;
                    let nSpeed = clockSpeed, nMinP = minPower, nMaxP = maxPower, nCrit = overclockChance, nFork = forkChance;

                    // Using innerHTML check for DC as well since it worked for RC
                    const btnHtml = button.parentElement.innerHTML;
                    if (btnHtml.includes('/upgrades/speed')) nSpeed = Math.max(0.5, clockSpeed - 0.1);
                    else if (btnHtml.includes('/upgrades/min_damage')) nMinP += minBonus * totalBonus;
                    else if (btnHtml.includes('/upgrades/damage')) nMaxP += maxBonus * totalBonus;
                    else if (btnHtml.includes('/upgrades/crit')) nCrit += 0.01;
                    else if (btnHtml.includes('/upgrades/chain')) nFork += 0.01;

                    const newDPS = (nMinP + nMaxP) * (1 + nCrit) * (1 / (2 - nFork)) / nSpeed;
                    const dpsGain = newDPS - baseDPS;
                    const ratio = dpsGain / cost;

                    let dcContainer = button.parentElement?.parentElement?.parentElement;
                    if (dcContainer) {
                        let DCText = dcContainer.querySelector(`p[data-tag="DC Upgrade Gain"]`);
                        if (!DCText) {
                            DCText = document.createElement('p');
                            DCText.className = "text font-semibold text-terminal-accent";
                            DCText.dataset.tag = 'DC Upgrade Gain';
                            // Path based on original script structure
                            dcContainer.children[0]?.children[1]?.appendChild(DCText);
                        }
                        if (DCText) DCText.textContent = `+ ${dpsGain.toFixed(2)} Rating (${ratio.toFixed(3)} Rating/DC)`;
                    }
                });
            });

        } catch (e) {
            console.debug("DeepCo Helper: Waiting for elements...", e.message);
        }
    }
})();