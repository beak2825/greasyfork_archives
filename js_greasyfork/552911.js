// ==UserScript==
// @name         DeepCo Upgrades Helper V3.01
// @namespace    https://deepco.app/
// @version      2025-10-25v3.01
// @description  Show details about DC and RC upgrades
// @author       Corns(original script), Zoltan (migrated to new architecture)
// @match        https://deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552911/DeepCo%20Upgrades%20Helper%20V301.user.js
// @updateURL https://update.greasyfork.org/scripts/552911/DeepCo%20Upgrades%20Helper%20V301.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const INTERVAL_MS = 1000;

  new MutationObserver((mutation, observer) => {
    const main = document.getElementById('main-panel');
    if (main) { console.log('[Processing Page] Loaded');
			observer.disconnect();
      startLoop();
    }
  }).observe(document.body, { childList: true, subtree: true });

  function startLoop() {
    setInterval(() => {
      getDeptnumber()
      addButtonInfo();
    }, INTERVAL_MS);
  }

  function getDeptnumber() {

      // Find Dept value

      const departmentLabel = document.querySelector('.select > option:nth-child(1)');

      if (departmentLabel) {
          const departmentLabel = document.querySelector('.select > option:nth-child(1)').innerHTML.split(' ', 2);
          var departmentNumber = parseFloat(departmentLabel[0].replace(/[^0-9\.]+/g, '').trim());
          localStorage.setItem("departmentNumber", departmentNumber);
      }
  }

  function addButtonInfo() {


    const mainPanel = document.querySelector('#grid-panel');
    if (mainPanel) {

      // Add Max PR to Department Tags

    const departmentNumber = parseFloat(localStorage.getItem("departmentNumber"));
        if (departmentNumber == 1) {
            const departmentMaxPR = 125
            localStorage.setItem("departmentMaxPR", departmentMaxPR);
            let DCText = document.querySelector(`p[data-tag="Max PR"]`);
            if (!DCText) {
                DCText = document.createElement('p');
                DCText.classList.add("font-semibold");
                DCText.dataset.tag = 'Max PR';
                document.querySelector(`.text-center`).appendChild(DCText);
            }
            DCText.textContent = `Department Max Rating = ${departmentMaxPR}`;
            ;
        }
        else if (departmentNumber > 1) {
            const departmentMaxRating = (375 * ( 1.5 ** (departmentNumber - 3))).toFixed(2)
            const departmentMaxPR = parseFloat(departmentMaxRating).toLocaleString('en')
            localStorage.setItem("departmentMaxPR", departmentMaxRating);

            let DCText = document.querySelector(`p[data-tag="Max PR"]`);
            if (!DCText) {
                DCText = document.createElement('p');
                DCText.classList.add("font-semibold");
                DCText.dataset.tag = 'Max PR';
                document.querySelector(`.text-center`).appendChild(DCText);
            }
            DCText.textContent = `Department Max Rating = ${departmentMaxPR}`;
            ;
        }
    }

      // Calculate DC needed to reach next Dept max rating and create label in side panel

      let dcLabelText = document.querySelector(`#worker_coins > div:nth-child(1)`).querySelector(`p[data-tag="DC Needed"]`);
      const departmentNumber = parseFloat(localStorage.getItem("departmentNumber"));
      const deptMaxRating = localStorage.getItem("departmentMaxPR");
      const ratingPerMax = localStorage.getItem("DCGainPerMaxLevel");
      const currentRating = parseFloat(document.querySelector(`div.stat:nth-child(1) > span:nth-child(2)`).innerHTML);
      const DCLevelsNeeded = Math.max(0, Math.floor((deptMaxRating - currentRating) / ratingPerMax));
      const maxDCLevel = localStorage.getItem("maxPowerLevel");
      const DCForMaxRating = Math.max(0, 5 * (DCLevelsNeeded - 1) * (DCLevelsNeeded + 2 * maxDCLevel -28)).toLocaleString('en');

      if (!dcLabelText) {
              dcLabelText = document.createElement('p');
              dcLabelText.classList.add("text-sm");
              dcLabelText.classList.add("font-semibold");
              dcLabelText.classList.add("text-terminal-accent");
              dcLabelText.dataset.tag = 'DC Needed';
              document.querySelector(`#worker_coins > div:nth-child(1)`).appendChild(dcLabelText);
              dcLabelText.textContent = `${DCForMaxRating} Total DC needed for DC+${departmentNumber} Max Rating`;
      }

    const dcFrame = document.querySelector('#deepcoin-upgrades');
    if (!dcFrame) {
     // console.log('[Upgrade] Upgrades panel not found.');
      return;
    }

    const rcFrame = document.querySelector('#recursive-upgrades');
    if (!rcFrame) {
     // console.log('[Upgrade] Upgrades panel not found.');
      return;
    }

    // Get base stats

    const clockSpeed = Math.max(0.5, parseFloat(document.querySelector('[data-upgrade-type="dig_speed"] [class="flex-1"] > p:nth-child(2)').innerHTML));
    const overclockChance = Math.min(0.1 , parseFloat(document.querySelector('[data-upgrade-type="crit_chance"] [class="flex-1"] > p:nth-child(2)').innerHTML) / 100);
    const forkChance = Math.min(0.1 , parseFloat(document.querySelector('[data-upgrade-type="chain_chance"] [class="flex-1"] > p:nth-child(2)').innerHTML) / 100);
    const minPower = parseFloat(document.querySelector('[data-upgrade-type="min_damage"] [class="flex-1"] > p:nth-child(2)').innerHTML);
    const maxPower = parseFloat(document.querySelector('[data-upgrade-type="max_damage"] [class="flex-1"] > p:nth-child(2)').innerHTML);
    const minBonusMatch = document.querySelector('article.shadow-md:nth-child(2) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').innerHTML;
    const maxBonusMatch = document.querySelector('article.shadow-md:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').innerHTML;
    const totalBonusMatch = document.querySelector('article.shadow-md:nth-child(4) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').innerHTML;
    const dcYieldMatch = document.querySelector('article.shadow-md:nth-child(6) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').innerHTML;
    const minBonus = (parseFloat(minBonusMatch.replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
    const maxBonus = (parseFloat(maxBonusMatch.replace(/[^0-9\.]+/g, '').trim()) + 100) / 100;
    const totalBonus = (parseFloat(totalBonusMatch.replace(/[^0-9\.]+/g, '').trim()) + 100) /100;
    const dcYield = parseFloat(dcYieldMatch.replace(/[^0-9\.]+/g, '').trim()) / 100;

    // Math calculations

    const avgPower = (minPower + maxPower) / 2;
    const overclockMultiplier = 1 + overclockChance;
    const forkMultiplier = 2 / (2 - forkChance);
	const baseDPS = (avgPower / clockSpeed) * overclockMultiplier * forkMultiplier;

      // Calculate DC max levels needed to reach next dept max rating
      const maxPowerLevelMatch = document.querySelector('[data-upgrade-type="max_damage"] [class="flex-1"] > p:nth-child(2)').innerHTML.split(" ");
      const maxPowerLevel = parseFloat(maxPowerLevelMatch[1].replace(/[^0-9\.]+/g, '').trim());
      localStorage.setItem("maxPowerLevel", maxPowerLevel);
      const departmentMaxPR = parseFloat(localStorage.getItem("departmentMaxPR"));
      const DCGainPerMaxLevel = 4 * clockSpeed * maxBonus * totalBonus * (1 + overclockChance) / (2 - forkChance) ;
      localStorage.setItem("DCGainPerMaxLevel", DCGainPerMaxLevel);
      const MaxDCUpgradesNeeded = Math.max(0, Math.floor((departmentMaxPR - baseDPS) / DCGainPerMaxLevel));

      // Create label for Max DC levels needed
      let MaxDCLabel = dcFrame.querySelector('article.shadow-sm:nth-child(2) > div:nth-child(1) > header:nth-child(1) > div:nth-child(2)');
      if (MaxDCLabel) {
          let LabelText = MaxDCLabel.querySelector(`p[data-tag="Max Levels Needed"]`);

          if (!LabelText) {
              LabelText = document.createElement('p');
              LabelText.classList.add("text-sm");
              LabelText.classList.add("font-semibold");
              LabelText.classList.add("text-terminal-accent");
              LabelText.dataset.tag = 'Max Levels Needed';
              MaxDCLabel.children[0].appendChild(LabelText);
              LabelText.textContent = `${MaxDCUpgradesNeeded} Upgrades needed for next dept Max Rating`;
          }
      }


    // update recursion protocol menu

    const recursiveButtons = rcFrame.querySelectorAll('button');
    recursiveButtons.forEach(button => {
      if (!button.parentElement.parentElement.parentElement.children[1].children[0].innerHTML.includes('Cost:')) return;
      	const costMatch = button.parentElement.parentElement.parentElement.children[1].children[0].innerHTML.split(' ', 2);
      if (!costMatch) return;
      const rcCost = parseFloat(costMatch[1]);

      // Make a copy of the current bonuses

      const rawMinPower = (minPower / minBonus / totalBonus);
      const rawMaxPower = (maxPower / maxBonus / totalBonus);
      const basePower = (rawMinPower * minBonus + rawMaxPower * maxBonus) * totalBonus * overclockMultiplier * forkMultiplier;
      let newMinBonus = minBonus;
      let newMaxBonus = maxBonus;
      let newTotalBonus = totalBonus;
      let newDCYield = dcYield;

      if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_min')) {
        newMinBonus += 0.01;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_max')) {
        newMaxBonus += 0.01;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_total_damage')) {
        newTotalBonus += 0.01;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_dc_yield')) {
        newDCYield += 0.01;}

      const newAvgPower = (rawMinPower * newMinBonus + rawMaxPower * newMaxBonus) * newTotalBonus * overclockMultiplier * forkMultiplier;
      const powerGain = newAvgPower - basePower;
      const ratio = powerGain / rcCost;
      const dcYieldPowerGain = 100 * (newDCYield / dcYield - 1);
      const dcYieldratio = newAvgPower / (100 * newDCYield) / rcCost;

      let RCText = button.parentElement.parentElement.querySelector(`span[data-tag="RC Upgrade Gain"]`);
      if (!RCText) {
        RCText = document.createElement('span');
        RCText.classList.add("font-semibold");
        RCText.dataset.tag = 'RC Upgrade Gain';
        button.parentElement.parentElement.insertBefore(RCText, button.parentElement.nextSibling);}

      if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_min')) {
        RCText.textContent = `+${powerGain.toFixed(2)} PR (${1000 * ratio.toFixed(2)} RC Efficiency)`;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_max')) {
        RCText.textContent = `+${powerGain.toFixed(2)} PR (${1000 * ratio.toFixed(2)} RC Efficiency)`;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_total_damage')) {
        RCText.textContent = `+${powerGain.toFixed(2)} PR (${1000 * ratio.toFixed(2)} RC Efficiency)`;}
      else if (button.parentElement.parentElement.innerHTML.includes('/upgrade_recursive_dc_yield')) {
          RCText.textContent = `+${dcYieldPowerGain.toFixed(2)}% PR Gain (${1000 * dcYieldratio.toFixed(2)} RC Efficiency)`;}}
		);



    // Scan all upgrades

    const DCButtons = dcFrame.querySelectorAll('#deepcoin-upgrades [class="p-2"]');
    DCButtons.forEach(group => {
      const buttons = group.querySelectorAll('[class="flex"]');
      buttons.forEach(button => {
        if (!button.textContent.includes('+1 ')) {
          return;}
        const match = button.textContent.match(/\+1.*\((\d+)\s*DC\)/);
        if (!match) return;
        const cost = parseInt(match[1], 10);
        const isDisabled = button.disabled;

        let newClockSpeed = clockSpeed;
        let newMin = minPower;
        let newMax = maxPower;
        let newOverclockChance = overclockChance;
        let newForkChance = forkChance;
        if (button.action.includes('/upgrades/speed')) {
          newClockSpeed = Math.max(0.5, clockSpeed - 0.1);}
        else if (button.action.includes('/upgrades/min_damage')) {
          const increase = 1 * minBonus * totalBonus;newMin += increase;}
        else if (button.action.includes('/upgrades/damage')) {
          const increase = 1 * maxBonus * totalBonus;newMax += increase;}
        else if (button.action.includes('/upgrades/crit')) {
          newOverclockChance += 0.01;}
        else if (button.action.includes('/upgrades/chain')) {
          newForkChance += 0.01;}

        const newAvgPower = (newMin + newMax) / 2;
        const newOverclockMultiplier = 1 + newOverclockChance;
        const newForkMultiplier = 2 / (2 - newForkChance);
        const newDPS =(newAvgPower / newClockSpeed) * newOverclockMultiplier * newForkMultiplier;
        const dpsGain = newDPS - baseDPS;
        const ratio = dpsGain / cost;

        // add label to reflect new info

        let DCText = button.parentElement.parentElement.parentElement.querySelector(`p[data-tag="DC Upgrade Gain"]`);

        if (!DCText) {
          DCText = document.createElement('p');
          DCText.classList.add("text-sm");
          DCText.classList.add("font-semibold");
          DCText.classList.add("text-terminal-accent");
          DCText.dataset.tag = 'DC Upgrade Gain';
          button.parentElement.parentElement.parentElement.children[0].children[1].appendChild(DCText);
        	}
        DCText.textContent = `+${dpsGain.toFixed(2)} Rating (${ratio.toFixed(2)} Rating/DC)`;}
      );
    });
  }
})();
