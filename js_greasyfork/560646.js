// ==UserScript==
// @name         DeepCo Upgrades Helper V4.00
// @namespace    https://deepco.app/
// @version      4.00
// @description  Show details about DC and RC upgrades
// @author       Corns(original script), Zoltan (migrated to new architecture), DamagedNumberX
// @match        https://*.deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560646/DeepCo%20Upgrades%20Helper%20V400.user.js
// @updateURL https://update.greasyfork.org/scripts/560646/DeepCo%20Upgrades%20Helper%20V400.meta.js
// ==/UserScript==

(function()
{
  'use strict';

  // Update interval
  const INTERVAL_MS = 1000;

  // Start loop when DeepCo systems have fully loaded
  new MutationObserver( (mutation, observer) =>
  {
    const main = document.getElementById('main-panel');
    if (main)
    {
	    observer.disconnect();
      startLoop();
    }
  } ).observe(document.body, { childList: true, subtree: true });

  function startLoop()
  {
    setInterval( () => { addButtonInfo(); }, INTERVAL_MS );
  }

  function addButtonInfo()
  {
    const dcFrame = document.querySelector('#deepcoin-upgrades');
    if (!dcFrame) { return; }

    const rcFrame = document.querySelector('#recursive-upgrades');
    if (!rcFrame) { return; }

    // Get all upgrades
    const upgradeList = document.querySelectorAll('[class="text-sm font-semibold text-terminal-accent"]');

    // Get DC upgrades
    const clockSpeed = Math.max(0.5, parseFloat(document.querySelector('[data-upgrade-type="dig_speed"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(' ', 2)[0].replace(/[^0-9\.]+/g, '').trim()));
    const minUpgrades = document.querySelector('[data-upgrade-type="min_damage"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim();
    const maxUpgrades = document.querySelector('[data-upgrade-type="max_damage"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim();
    const overclockChance = Math.min(0.1 , parseFloat(document.querySelector('[data-upgrade-type="crit_chance"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim()) / 100);
    const forkChance = Math.min(0.1 , parseFloat(document.querySelector('[data-upgrade-type="chain_chance"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim()) / 100);

    // Get RC upgrades
    const minBonus = (parseFloat(upgradeList[6].innerHTML.replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
    const maxBonus = (parseFloat(upgradeList[7].innerHTML.replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
    const totalBonus = (parseFloat(upgradeList[8].innerHTML.replace(/[^0-9\.]+/g, '').trim()) + 100) /100;
    const dcYield = parseFloat(upgradeList[10].innerHTML.replace(/[^0-9\.]+/g, '').trim()) / 100;

    // Calculate current PR
    const minPower = minUpgrades * totalBonus * minBonus;
    const maxPower = maxUpgrades * totalBonus * maxBonus;
    const overclockMultiplier = 1 + overclockChance;
    const forkMultiplier = 1 / (2 - forkChance);
	  const baseDPS = (minPower + maxPower) * overclockMultiplier * forkMultiplier / clockSpeed;

    // Update RC menu
    const RCButtons = rcFrame.querySelectorAll('#recursive-upgrades [class="p-2"]');
    RCButtons.forEach(group => {
      const buttons = group.querySelectorAll('[class="flex"]');
      buttons.forEach(button => {
        if (!button.innerHTML.includes('+1 ')) { return; }
      	const rcCost = parseInt(button.innerText.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim());

        const basePower = baseDPS * clockSpeed;

        let newMinBonus = minBonus;
        let newMaxBonus = maxBonus;
        let newTotalBonus = totalBonus;
        let newDCYield = dcYield;

        if (button.parentElement.innerHTML.includes('/upgrade_recursive_min')) { newMinBonus += 0.01; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_max')) { newMaxBonus += 0.01; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_total_damage')) { newTotalBonus += 0.01; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_dc_yield')) { newDCYield += 0.01; }

        const newAvgPower = (minUpgrades * newMinBonus + maxUpgrades * newMaxBonus) * newTotalBonus * overclockMultiplier * forkMultiplier;
        const powerGain = newAvgPower - basePower;
        const ratio = powerGain / rcCost;
        const dcYieldratio = newAvgPower / (100 * newDCYield* rcCost);

        let RCText = button.parentElement.parentElement.parentElement.parentElement.querySelector(`p[data-tag="RC Upgrade Gain"]`);
        if (!RCText) {
          RCText = document.createElement('p');
          RCText.classList.add("text");
          RCText.classList.add("font-semibold");
          RCText.classList.add("text-terminal-accent");
          RCText.dataset.tag = 'RC Upgrade Gain';
          button.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].appendChild(RCText);
        }

        if (button.parentElement.innerHTML.includes('/upgrade_recursive_min')) { RCText.textContent = `${ratio.toFixed(3)} RC Efficiency`; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_max')) { RCText.textContent = `${ratio.toFixed(3)} RC Efficiency`; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_total_damage')) { RCText.textContent = `${ratio.toFixed(3)} RC Efficiency`; }
        else if (button.parentElement.innerHTML.includes('/upgrade_recursive_dc_yield')) { RCText.textContent = `${dcYieldratio.toFixed(3)} RC Efficiency`; }
      });
    });

    // Update DC menu
    const DCButtons = dcFrame.querySelectorAll('#deepcoin-upgrades [class="p-2"]');
    DCButtons.forEach(group => {
      const buttons = group.querySelectorAll('[class="flex"]');
      buttons.forEach(button => {
        if (!button.textContent.includes('+1 ')) { return; }
        const cost = parseInt(button.innerText.split(' ', 2)[1].replace(/[^0-9\.]+/g, '').trim(), 10);

        let newClockSpeed = clockSpeed;
        let newMinPower = minPower;
        let newMaxPower = maxPower;
        let newOverclockChance = overclockChance;
        let newForkChance = forkChance;

        if (button.action.includes('/upgrades/speed')) { newClockSpeed = Math.max(0.5, clockSpeed - 0.1); }
        else if (button.action.includes('/upgrades/min_damage')) { newMinPower += minBonus * totalBonus; }
        else if (button.action.includes('/upgrades/damage')) { newMaxPower += maxBonus * totalBonus; }
        else if (button.action.includes('/upgrades/crit')) { newOverclockChance += 0.01; }
        else if (button.action.includes('/upgrades/chain')) { newForkChance += 0.01; }

        const newOverclockMultiplier = 1 + newOverclockChance;
        const newForkMultiplier = 1 / (2 - newForkChance);
        const newDPS = (newMinPower + newMaxPower) * newOverclockMultiplier * newForkMultiplier / newClockSpeed;
        const dpsGain = newDPS - baseDPS;
        const ratio = dpsGain / cost;

        let DCText = button.parentElement.parentElement.parentElement.querySelector(`p[data-tag="DC Upgrade Gain"]`);

        if (!DCText) {
          DCText = document.createElement('p');
          DCText.classList.add("text");
          DCText.classList.add("font-semibold");
          DCText.classList.add("text-terminal-accent");
          DCText.dataset.tag = 'DC Upgrade Gain';
          button.parentElement.parentElement.parentElement.children[0].children[1].appendChild(DCText);
        }
        DCText.textContent = `+ ${dpsGain.toFixed(2)} Rating (${ratio.toFixed(3)} Rating/DC)`;
      });
    });
  }
})

();
