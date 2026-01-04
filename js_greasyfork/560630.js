// ==UserScript==
// @name         Torn Gym Stat Goals (Target Totals)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Compare stats with goals, tracking the Total based on TARGET stats
// @author       Torn UserScript Writer
// @match        https://www.torn.com/gym.php
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560630/Torn%20Gym%20Stat%20Goals%20%28Target%20Totals%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560630/Torn%20Gym%20Stat%20Goals%20%28Target%20Totals%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const parseStat = (str) => parseFloat(str.replace(/,/g, '')) || 0;

    const createUI = () => {
        if (document.getElementById('gym-goal-container')) return;

        const container = document.createElement('div');
        container.id = 'gym-goal-container';
        container.style = `
            background: #222;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 999;
            position: relative;
        `;

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 5px;">
                <span style="color: #fff; font-size: 13px; font-weight: bold;">Stat Goals</span>
                <span id="total-stats-display" style="color: #ccc; font-size: 11px;">Target Total: 0</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                ${['str', 'def', 'spd', 'dex'].map(s => `
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-bottom: 3px; text-transform: uppercase;">
                            <span style="font-weight:bold;">${s}</span>
                            <span id="perc-${s}" style="color: #fff;">0%</span>
                        </div>
                        <input type="number" id="goal-${s}" placeholder="0"
                            style="width: 100%; box-sizing: border-box; height: 26px; font-size: 12px; padding: 4px; border: 1px solid #777; border-radius: 3px; background: #fff; color: #000;">
                        <div id="res-${s}" style="font-size: 11px; margin-top: 5px; text-align: center; font-weight: bold; color: #888; min-height: 15px;">---</div>
                    </div>
                `).join('')}
            </div>
        `;

        const statsList = document.querySelector('ul[class*="properties___"]');
        if (statsList && statsList.parentNode) {
            statsList.parentNode.insertBefore(container, statsList.nextSibling);
        } else {
            const root = document.querySelector('.gym-root') || document.querySelector('[class*="gymRoot___"]');
            if (root) root.appendChild(container);
        }

        const savedGoals = GM_getValue('gym_goals', { str: 0, def: 0, spd: 0, dex: 0 });
        ['str', 'def', 'spd', 'dex'].forEach(s => {
            const input = document.getElementById(`goal-${s}`);
            if (input) {
                input.value = savedGoals[s] || '';
                input.addEventListener('input', () => {
                    const val = parseFloat(input.value);
                    savedGoals[s] = isNaN(val) ? 0 : val;
                    GM_setValue('gym_goals', savedGoals);
                    updateComparison();
                });
            }
        });
    };

    const updateComparison = () => {
        const goals = GM_getValue('gym_goals', { str: 0, def: 0, spd: 0, dex: 0 });

        // 1. Calculate Total TARGET Stats (Sum of user inputs)
        let totalTarget = 0;
        ['str', 'def', 'spd', 'dex'].forEach(k => totalTarget += (goals[k] || 0));

        // Update Total Display
        const totalDisplay = document.getElementById('total-stats-display');
        if (totalDisplay) totalDisplay.innerText = `Target Total: ${totalTarget.toLocaleString()}`;

        // Selectors for Current Stats
        const selectors = {
            str: 'li[class*="strength___"] span[class*="propertyValue___"]',
            def: 'li[class*="defense___"] span[class*="propertyValue___"]',
            spd: 'li[class*="speed___"] span[class*="propertyValue___"]',
            dex: 'li[class*="dexterity___"] span[class*="propertyValue___"]'
        };

        // 2. Loop through each stat to update UI
        for (const [key, selector] of Object.entries(selectors)) {
            const el = document.querySelector(selector);
            const current = el ? parseStat(el.innerText) : 0;
            const target = goals[key] || 0;
            const diff = target - current;

            // Update Percentage based on TARGET TOTAL
            const percEl = document.getElementById(`perc-${key}`);
            if (percEl) {
                const percentage = totalTarget > 0 ? ((target / totalTarget) * 100).toFixed(2) : '0.00';
                percEl.innerText = `${percentage}%`;
            }

            // Update Remaining
            const resDiv = document.getElementById(`res-${key}`);
            if (resDiv) {
                if (target <= 0) {
                    resDiv.innerText = "---";
                    resDiv.style.color = "#888";
                } else if (diff <= 0) {
                    resDiv.innerText = "DONE";
                    resDiv.style.color = "#00ff00";
                } else {
                    resDiv.innerText = `Left: ${diff.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
                    resDiv.style.color = "#ffa500";
                }
            }
        }
    };

    const observer = new MutationObserver(() => updateComparison());

    const init = () => {
        const statsList = document.querySelector('ul[class*="properties___"]');
        if (statsList) {
            createUI();
            updateComparison();
            observer.observe(statsList, { childList: true, subtree: true, characterData: true });
        } else {
            setTimeout(init, 500);
        }
    };

    init();
})();