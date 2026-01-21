// ==UserScript==
// @name         PEW PEW PLAIN
// @namespace    http://tampermonkey.net/
// @version      1.1.6-mod-logs
// @description  Persistent control panel with weapon priority system, split reload options, and combat handling (hospital mode: attack button disabled and displays "TARGET IS IN HOSP"). Also adds a dashboard on the Items page.
// @match        https://www.torn.com/loader.php?sid=attack*
// @match        https://www.torn.com/page.php?sid=attack*
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/item.php*
// @grant        none
// @author       HuzGPT
// @downloadURL https://update.greasyfork.org/scripts/563343/PEW%20PEW%20PLAIN.user.js
// @updateURL https://update.greasyfork.org/scripts/563343/PEW%20PEW%20PLAIN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("PEW PEW script loaded.");

    // --- CONFIGURATION ---
    const API_RECHECK_INTERVAL = 24 * 60 * 60 * 1000; // 1 day in ms

    // --- STATE MANAGEMENT ---
    const state = {
        endAction: localStorage.getItem('attackButton_endAction') || 'Leave',
        useTempFirst: localStorage.getItem('attackButton_useTempFirst') === 'true',
        assassinate: localStorage.getItem('attackButton_assassinate') === 'true',
        reloadPrimary: localStorage.getItem('attackButton_reloadPrimary') === 'true',
        reloadSecondary: localStorage.getItem('attackButton_reloadSecondary') === 'true',
        weaponPriority: JSON.parse(localStorage.getItem('attackButton_weaponPriority') || '["weapon_main", "weapon_second", "weapon_melee"]'),
        attackCount: 0,
        attackInitiated: false,
        executePercent: parseInt(localStorage.getItem('attackButton_executePercent')) || 25,
        useExecute: localStorage.getItem('attackButton_useExecute') === 'true',
        executeWeapon: localStorage.getItem('attackButton_executeWeapon') || 'weapon_second',
        useOtherFinal: localStorage.getItem('attackButton_useOtherFinal') === 'true',
        otherFinalWeapon: localStorage.getItem('attackButton_otherFinalWeapon') || 'weapon_second',
        turnObserver: null,
        hasTempWeapon: false, // Default to false until verified
        assassinateUsed: false // Track if assassinate weapon has been used
    };

    console.log("Initial state:", state);

    // --- UTILITY FUNCTIONS ---
    function updateLocal(key, value) {
        localStorage.setItem(key, value);
        console.log(`LocalStorage updated: ${key} = ${value}`);
    }
    function updateWeaponPriority(newOrder) {
        state.weaponPriority = newOrder;
        updateLocal('attackButton_weaponPriority', JSON.stringify(newOrder));
        console.log("Weapon priority updated:", newOrder);
    }
    function isInCombat() {
        const logExists = document.querySelector('.log___FOjVJ .message___Z4JCk') !== null;
        const hasWeapon = document.getElementById('weapon_main') !== null;
        const joinBtn = document.querySelector('button.torn-btn.btn___RxE8_.silver');
        const inCombat = !(joinBtn && joinBtn.textContent.trim().toLowerCase().includes('join fight')) && logExists && hasWeapon;
        console.log("isInCombat:", inCombat);
        return inCombat;
    }
    function checkTempWeapon() {
        const tempWeapon = document.getElementById('weapon_temp');
        state.hasTempWeapon = !!tempWeapon;
        console.log(`Temp weapon check: ${state.hasTempWeapon ? 'FOUND' : 'NOT FOUND'}`);
        return state.hasTempWeapon;
    }
    function getWeaponState(weaponId) {
        const weapon = document.getElementById(weaponId);
        if (!weapon) {
            // Special case for temp weapon to update state
            if (weaponId === 'weapon_temp') {
                state.hasTempWeapon = false;
                console.log(`Weapon ${weaponId} not found. Updated hasTempWeapon to false.`);
            } else {
                console.log(`Weapon ${weaponId} not found.`);
            }
            return 'not-found';
        }

        // If we found a temp weapon, update state
        if (weaponId === 'weapon_temp') {
            state.hasTempWeapon = true;
        }

        if (weapon.classList.contains('disarmedWeapon___bNr1W')) {
            console.log(`Weapon ${weaponId} is disarmed.`);
            return 'disarmed';
        }
        const marker = weapon.querySelector('.markerText___HdlDL.standard___bW8M5');
        if (marker) {
            const txt = marker.textContent.trim().toLowerCase();
            if (txt === 'reload') return 'needs-reload';
            if (txt === 'no clips') return 'no-ammo';
        }
        return 'ready';
    }
    function hasAssassinatePerk(weaponId) {
        console.log(`Checking assassinate perk for ${weaponId}...`);
        const weapon = document.getElementById(weaponId);
        if (!weapon) {
            console.log(`No weapon element found with id ${weaponId}`);
            return false;
        }
        const top = weapon.querySelector('.top___z6P6Z');
        if (!top) {
            console.log(`No top section found for ${weaponId}`);
            return false;
        }
        const props = top.querySelectorAll('.props___oL_Cw');
        for (const section of props) {
            if (section.querySelector('.bonus-attachment-assassinate')) {
                console.log(`${weaponId} HAS ASSASSINATE perk!`);
                return true;
            }
        }
        console.log(`${weaponId} does not have the assassinate perk.`);
        return false;
    }
    function getDefenderHealthPercent() {
        const header = document.querySelector('.headerWrapper___p6yrL.rose___QcHAq');
        if (!header) {
            console.log('No defender header found');
            return 100;
        }
        const healthSpan = header.querySelector('[id^="player-health-value_"]');
        if (!healthSpan) {
            console.log('No health span found');
            return 100;
        }
        const [current, max] = healthSpan.textContent.split('/').map(val => parseInt(val.replace(/,/g, '').trim()));
        const percentage = (current / max) * 100;
        console.log(`Enemy health: ${current}/${max} = ${percentage.toFixed(2)}%`);
        return percentage;
    }
    function getBestAvailableWeapon() {
        console.log("Determining best available weapon...");

        // Check for temp weapon if not already checked
        if (state.useTempFirst && !state.hasTempWeapon) {
            checkTempWeapon();
        }

        const defenderHealth = getDefenderHealthPercent();
        if (state.useExecute && defenderHealth <= state.executePercent) {
            const executeWeaponState = getWeaponState(state.executeWeapon);
            if (executeWeaponState === 'ready') {
                console.log(`Using execute weapon: ${state.executeWeapon}`);
                return document.getElementById(state.executeWeapon);
            }
        }

        if (state.useOtherFinal && defenderHealth <= 15) {
            const otherFinalWeaponState = getWeaponState(state.otherFinalWeapon);
            if (otherFinalWeaponState === 'ready') {
                console.log(`Using other final weapon: ${state.otherFinalWeapon}`);
                return document.getElementById(state.otherFinalWeapon);
            }
        }

        // For assassinate + useTempFirst mode, but only if temp weapon exists
        if (state.attackCount === 0 && state.assassinate && !state.assassinateUsed) {
            for (const weaponId of state.weaponPriority) {
                if (hasAssassinatePerk(weaponId)) {
                    const weaponState = getWeaponState(weaponId);
                    if (weaponState === 'ready') {
                        console.log(`Using assassinate weapon (respect priority): ${weaponId}`);
                        state.assassinateUsed = true; // Mark that assassinate has been used
                        return document.getElementById(weaponId);
                    }
                }
            }

            // If no assassinate weapon found and temp first is enabled, use temp
            if (state.useTempFirst && state.hasTempWeapon) {
                const tempState = getWeaponState('weapon_temp');
                if (tempState === 'ready') {
                    console.log('Using temp weapon (first hit, no assassinate found)');
                    return document.getElementById('weapon_temp');
                }
            }
        }

        // Second turn and using temp if available
        if (state.attackCount === 1 && state.assassinate && state.useTempFirst && state.hasTempWeapon) {
            const tempState = getWeaponState('weapon_temp');
            if (tempState === 'ready') {
                console.log('Using temp weapon (second hit)');
                return document.getElementById('weapon_temp');
            }
        }

        // Regular temp first logic (when assassinate not enabled)
        if (state.useTempFirst && !state.assassinate && state.attackCount === 0 && state.hasTempWeapon) {
            const tempState = getWeaponState('weapon_temp');
            if (tempState === 'ready') {
                console.log('Using temp weapon (non-assassinate, first hit)');
                return document.getElementById('weapon_temp');
            }
        }

        for (const weaponId of state.weaponPriority) {
            const weaponState = getWeaponState(weaponId);
            if (weaponState === 'ready') {
                console.log(`Using weapon based on priority: ${weaponId}`);
                return document.getElementById(weaponId);
            }
            if (weaponState === 'needs-reload') {
                if ((weaponId === 'weapon_main' && state.reloadPrimary) ||
                    (weaponId === 'weapon_second' && state.reloadSecondary)) {
                    console.log(`Reloading weapon: ${weaponId}`);
                    return document.getElementById(weaponId);
                }
            }
            if (weaponState === 'no-ammo' || weaponState === 'disarmed' ||
                (weaponState === 'needs-reload' &&
                 ((weaponId === 'weapon_main' && !state.reloadPrimary) ||
                  (weaponId === 'weapon_second' && !state.reloadSecondary)))) {
                continue;
            }
        }
        const kickWeapon = document.getElementById('weapon_boots');
        if (kickWeapon && getWeaponState('weapon_boots') === 'ready') {
            console.log('Using kick (boots)');
            return kickWeapon;
        }
        const punchWeapon = document.getElementById('weapon_fists');
        if (punchWeapon && getWeaponState('weapon_fists') === 'ready') {
            console.log('Using punch (fists)');
            return punchWeapon;
        }
        console.log('No available weapon found');
        return null;
    }
    function logAssassinateStatus() {
        console.log('=== Assassinate Perk Status ===');
        const weapons = ['weapon_main', 'weapon_second', 'weapon_melee'];
        weapons.forEach(weaponId => {
            const hasPerk = hasAssassinatePerk(weaponId);
            console.log(`Weapon ${weaponId}: ${hasPerk ? 'HAS ASSASSINATE' : 'NO ASSASSINATE'}`);
        });
        console.log('================================');
    }

    // --- UI CREATION HELPERS (shared by Attack menu and Dashboard) ---
    function createCheckbox(labelText, stateKey, storageKey, onChange) {
        const label = document.createElement('label');
        label.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 5px;';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = state[stateKey];
        box.addEventListener('change', () => {
            state[stateKey] = box.checked;
            updateLocal(storageKey, String(box.checked));
            console.log(`Checkbox "${labelText}" changed: ${box.checked}`);
            if (onChange) onChange(box.checked);
        });
        label.appendChild(box);
        label.appendChild(document.createTextNode(labelText));
        return label;
    }
    function createRadioGroup(options, groupName, storageKey) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 15px; justify-content: center; margin-bottom: 10px;';
        options.forEach(option => {
            const label = document.createElement('label');
            label.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 5px;';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = groupName;
            radio.value = option;
            radio.checked = state.endAction === option;
            radio.addEventListener('change', () => {
                state.endAction = option;
                updateLocal(storageKey, option);
                console.log(`Radio group "${groupName}" changed: ${option}`);
            });
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
        });
        return container;
    }
    function createAdvancedOptionsContainer(styles) {
        const container = document.createElement('div');
        container.style.cssText = 'margin-top: 10px; border: 1px solid ' + styles.panelBorder + '; border-radius: 4px; overflow: hidden;';
        const header = document.createElement('div');
        header.textContent = "Final Hit Options (Click to Expand)";
        header.style.cssText = "background:" + styles.buttonBg + "; color:" + styles.buttonTextColor + "; padding: 5px 10px; cursor: pointer; text-align: center;";
        container.appendChild(header);
        const content = document.createElement('div');
        content.style.cssText = "display: none; padding: 10px;";
        const execDiv = document.createElement('div');
        execDiv.style.cssText = 'display: flex; gap: 15px; justify-content: center; align-items: center; margin-bottom: 10px;';
        const execLabel = document.createElement('label');
        execLabel.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 5px;';
        const execChk = document.createElement('input');
        execChk.type = 'checkbox';
        execChk.checked = state.useExecute;
        execChk.addEventListener('change', () => {
            state.useExecute = execChk.checked;
            updateLocal('attackButton_useExecute', String(execChk.checked));
            console.log(`Execute option changed: ${execChk.checked}`);
            if (execChk.checked) {
                otherChk.checked = false;
                state.useOtherFinal = false;
                updateLocal('attackButton_useOtherFinal', "false");
                otherSelect.disabled = true;
                otherSelect.style.opacity = '0.5';
            }
            execInput.disabled = !execChk.checked;
            execInput.style.opacity = execChk.checked ? '1' : '0.5';
        });
        execLabel.appendChild(execChk);
        execLabel.appendChild(document.createTextNode('Execute (secondary only)'));
        execDiv.appendChild(execLabel);
        const execInputContainer = document.createElement('div');
        execInputContainer.style.cssText = 'display: flex; align-items: center; gap: 3px;';
        const execInput = document.createElement('input');
        execInput.type = 'number';
        execInput.min = '1';
        execInput.max = '99';
        execInput.value = state.executePercent;
        execInput.style.cssText = 'width: 50px; padding: 2px 5px; border-radius: 3px; opacity: ' + (state.useExecute ? '1' : '0.5');
        execInput.disabled = !state.useExecute;
        execInput.addEventListener('input', () => {
            state.executePercent = parseInt(execInput.value);
            updateLocal('attackButton_executePercent', state.executePercent.toString());
            console.log(`Execute percent changed: ${state.executePercent}%`);
        });
        execInputContainer.appendChild(execInput);
        execInputContainer.appendChild(document.createTextNode('%'));
        execDiv.appendChild(execInputContainer);
        content.appendChild(execDiv);
        const otherDiv = document.createElement('div');
        otherDiv.style.cssText = 'display: flex; gap: 15px; justify-content: center; align-items: center;';
        const otherLabel = document.createElement('label');
        otherLabel.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 5px;';
        const otherChk = document.createElement('input');
        otherChk.type = 'checkbox';
        otherChk.checked = state.useOtherFinal;
        otherChk.addEventListener('change', () => {
            state.useOtherFinal = otherChk.checked;
            updateLocal('attackButton_useOtherFinal', String(otherChk.checked));
            console.log(`Other final hit bonus option changed: ${otherChk.checked}`);
            if (otherChk.checked) {
                execChk.checked = false;
                state.useExecute = false;
                updateLocal('attackButton_useExecute', "false");
                execInput.disabled = true;
                execInput.style.opacity = '0.5';
            }
            otherSelect.disabled = !otherChk.checked;
            otherSelect.style.opacity = otherChk.checked ? '1' : '0.5';
        });
        otherLabel.appendChild(otherChk);
        otherLabel.appendChild(document.createTextNode('Other final hit bonus'));
        otherDiv.appendChild(otherLabel);
        const otherSelect = document.createElement('select');
        otherSelect.style.cssText = 'padding: 2px 5px; border-radius: 3px; opacity: ' + (state.useOtherFinal ? '1' : '0.5');
        otherSelect.disabled = !state.useOtherFinal;
        ['weapon_main', 'weapon_second', 'weapon_melee'].forEach(weapon => {
            const opt = document.createElement('option');
            opt.value = weapon;
            opt.textContent = weapon.replace('weapon_', '');
            opt.selected = state.otherFinalWeapon === weapon;
            otherSelect.appendChild(opt);
        });
        otherSelect.addEventListener('change', () => {
            state.otherFinalWeapon = otherSelect.value;
            updateLocal('attackButton_otherFinalWeapon', state.otherFinalWeapon);
            console.log(`Other final weapon changed: ${state.otherFinalWeapon}`);
        });
        otherDiv.appendChild(otherSelect);
        content.appendChild(otherDiv);
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            header.textContent = content.style.display === 'block' ? "Final Hit Options (click to collapse)" : "Final Hit Options (Click to Expand)";
            console.log("Final hit options toggled:", content.style.display);
        });
        container.appendChild(content);
        return container;
    }
function createPrioritySection(styles) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 5px; padding: 5px; margin-top: 5px;';
        const title = document.createElement('div');
        title.textContent = 'Weapon Priority (Drag to Reorder)';
        title.style.cssText = 'text-align: center; margin-bottom: 5px; font-weight: bold;';
        container.appendChild(title);
        const cardContainer = document.createElement('div');
        cardContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; padding: 5px;';
        const weapons = [
            { id: 'weapon_main', name: 'Primary' },
            { id: 'weapon_second', name: 'Secondary' },
            { id: 'weapon_melee', name: 'Melee' }
        ];
        weapons.sort((a, b) => state.weaponPriority.indexOf(a.id) - state.weaponPriority.indexOf(b.id));
        weapons.forEach((weapon, index) => {
            const card = document.createElement('div');
            card.draggable = true;
            card.dataset.weaponId = weapon.id;
            card.style.cssText = `
                background: ${styles.buttonBg};
                border: ${styles.buttonBorder};
                border-radius: 4px;
                padding: 8px 12px;
                cursor: move;
                user-select: none;
                min-width: 80px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 3px;
                transition: background-color 0.2s;
            `;
            const prio = document.createElement('div');
            prio.style.cssText = 'font-size: 12px; color: ' + styles.panelTextColor + '; opacity: 0.7;';
            prio.textContent = `Priority ${index + 1}`;
            const name = document.createElement('div');
            name.style.cssText = 'font-weight: bold; color: ' + styles.panelTextColor + ';';
            name.textContent = weapon.name;
            card.appendChild(prio);
            card.appendChild(name);
            card.addEventListener('dragstart', e => {
                card.style.opacity = '0.4';
                e.dataTransfer.setData('text/plain', weapon.id);
                card.classList.add('dragging');
                console.log("Drag start:", weapon.id);
            });
            card.addEventListener('dragend', () => {
                card.style.opacity = '1';
                card.classList.remove('dragging');
                const newOrder = [...cardContainer.querySelectorAll('[data-weapon-id]')].map(c => c.dataset.weaponId);
                updateWeaponPriority(newOrder);
                [...cardContainer.querySelectorAll('[data-weapon-id]')].forEach((c, i) => {
                    c.firstChild.textContent = `Priority ${i + 1}`;
                });
                console.log("Drag end. New weapon order:", newOrder);
            });
            cardContainer.appendChild(card);
        });
        cardContainer.addEventListener('dragover', e => {
            e.preventDefault();
            const dragCard = cardContainer.querySelector('.dragging');
            if (!dragCard) return;
            const cards = [...cardContainer.querySelectorAll('[data-weapon-id]:not(.dragging)')];
            const afterCard = cards.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientX - box.left - box.width / 2;
                return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
            if (afterCard) {
                cardContainer.insertBefore(dragCard, afterCard);
            } else {
                cardContainer.appendChild(dragCard);
            }
        });
        container.appendChild(cardContainer);
        return container;
    }

    // --- MUTATION OBSERVERS (for Attack pages) ---
    function observeState(actionButton) {
        const observer = new MutationObserver(() => {
            const origBtn = document.querySelector('button.torn-btn.btn___RxE8_.silver');
            if (!origBtn) return;
            const inCombat = isInCombat();
            const hasEndDialog = isEndOfFightDialog();
            if (hasEndDialog) {
                actionButton.textContent = state.endAction.toUpperCase();
            } else if (inCombat) {
                actionButton.textContent = 'HIT';
            } else {
                const txt = origBtn.textContent.trim().toLowerCase();
                actionButton.textContent = txt.includes('join fight') ? 'JOIN FIGHT' : 'START FIGHT';
            }
            // Log current button text state
            console.log("Action button updated:", actionButton.textContent);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("State observer attached.");
    }
    function isEndOfFightDialog() {
        const dialog = document.querySelector('.dialogButtons___nX4Bz');
        if (!dialog) return false;
        const btns = dialog.querySelectorAll('button.torn-btn.btn___RxE8_.silver');
        for (const btn of btns) {
            const txt = btn.textContent.trim().toLowerCase();
            if (txt.includes('start fight') || txt.includes('join fight')) return false;
        }
        return true;
    }
    function simulateFullClick(button) {
        if (!button) return;
        try {
            button.disabled = false;
            ['mouseenter', 'mousedown', 'mouseup', 'click'].forEach(eventName => {
                const evt = new MouseEvent(eventName, { bubbles: true, cancelable: true, view: window });
                button.dispatchEvent(evt);
            });
            console.log("Simulated full click on button:", button);
        } catch (e) {
            console.error("Error simulating click:", e);
        }
    }

    // --- IMPROVED TURN OBSERVER ---
    function observeTurnResult() {
        // If we need the temp weapon but it doesn't exist, don't bother with the observer
        if (state.useTempFirst && !checkTempWeapon()) {
            console.log("Skipping turn observer setup: Temp weapon not found but useTempFirst is enabled.");
            return;
        }

        // Clean up any existing observer
        if (state.turnObserver) {
            state.turnObserver.disconnect();
            state.turnObserver = null;
            console.log("Existing turn observer disconnected.");
        }

        // Reset attack count when starting new observation
        state.attackCount = 0;
        state.assassinateUsed = false; // Also reset assassinate flag
        console.log("Attack count reset to 0.");

        // Look for various result containers using multiple selectors
        const resultSelectors = [
            '.result___VUCXY', // Primary selector
            '[class*="result"]', // Backup selector for any element with 'result' in class
            '.log___FOjVJ', // Combat log container
            '.messageContainer___RU31G' // Message container
        ];

        let resultContainer = null;
        for (const selector of resultSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                resultContainer = element;
                console.log(`Result container found using selector: ${selector}`);
                break;
            }
        }

        if (!resultContainer) {
            console.log('Result container not found. Retrying in 1 second.');
            setTimeout(observeTurnResult, 1000);
            return;
        }

        console.log("Result container found:", resultContainer);
        let lastHtml = resultContainer.innerHTML;

        const observer = new MutationObserver(mutations => {
            const currentHtml = resultContainer.innerHTML;
            if (currentHtml !== lastHtml) {
                lastHtml = currentHtml;

                // Look for attack result indicators (hit, miss, etc.)
                const isAttackResult =
                    currentHtml.includes('HIT') ||
                    currentHtml.includes('hit') ||
                    currentHtml.includes('MISS') ||
                    currentHtml.includes('miss') ||
                    currentHtml.includes('CRITICAL') ||
                    currentHtml.includes('critical') ||
                    currentHtml.includes('DAMAGE') ||
                    currentHtml.includes('damage') ||
                    currentHtml.includes('ATTACK') ||
                    currentHtml.includes('attack');

                if (isAttackResult && state.attackCount < 2) {
                    state.attackCount++;
                    console.log("Turn detected. Attack Count:", state.attackCount);

                    if (state.attackCount >= 2) {
                        observer.disconnect();
                        state.turnObserver = null;
                        console.log("Turn observer disconnected after 2 turns.");
                    }
                }
            }
        });

        observer.observe(resultContainer, {
            childList: true,
            characterData: true,
            subtree: true,
            attributes: true
        });

        // Store the observer in state for future reference
        state.turnObserver = observer;
        console.log("Turn observer attached and stored in state.");
    }

    // --- MAIN CONTROL PANEL (for Attack pages) ---
    function createControlPanel(initialLabel) {
        console.log("Creating control panel with label:", initialLabel);
        const styles = getStyles();
        const panel = document.createElement('div');
        panel.id = 'persistent-attack-panel';
        panel.style.cssText = `
            position: relative;
            background: ${styles.panelBg};
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: ${styles.panelBoxShadow};
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 320px;
            color: ${styles.panelTextColor};
            border: ${styles.panelBorder};
            margin: 10px auto;
            width: fit-content;
        `;
        const title = document.createElement('div');
        title.style.cssText = "text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 8px; color: " + styles.panelTextColor;
        title.textContent = 'PEW PEW';
        panel.appendChild(title);
        panel.appendChild(createRadioGroup(['Leave', 'Mug', 'Hosp', 'Hold'], 'endAction', 'attackButton_endAction'));
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center;';
        checkboxContainer.appendChild(createCheckbox('Use Temp First', 'useTempFirst', 'attackButton_useTempFirst'));
        checkboxContainer.appendChild(createCheckbox('Assassinate', 'assassinate', 'attackButton_assassinate'));
        checkboxContainer.appendChild(createCheckbox('Reload Primary', 'reloadPrimary', 'attackButton_reloadPrimary'));
        checkboxContainer.appendChild(createCheckbox('Reload Secondary', 'reloadSecondary', 'attackButton_reloadSecondary'));
        panel.appendChild(checkboxContainer);
        panel.appendChild(createAdvancedOptionsContainer(styles));
        panel.appendChild(createPrioritySection(styles));
        const actionBtn = document.createElement('button');
        actionBtn.id = 'persistent-attack-button';
        actionBtn.textContent = initialLabel;
        actionBtn.style.cssText = `
            background: ${styles.buttonBg};
            color: ${styles.buttonTextColor};
            border: ${styles.buttonBorder};
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 5px;
        `;
        actionBtn.addEventListener('click', () => { handleButtonClick(actionBtn); });
        panel.appendChild(actionBtn);
        console.log("Control panel created.");
        return panel;
    }

    // --- BUTTON CLICK HANDLER (for Attack pages) ---
    function handleButtonClick(btn) {
        console.log("Attack button clicked.");
        const inCombat = isInCombat();
        const hasEndDialog = isEndOfFightDialog();

        // Check temp weapon again if we're about to start combat and use temp first is enabled
        if (!inCombat && state.useTempFirst) {
            checkTempWeapon();
        }

        if (hasEndDialog) {
            console.log("End-of-fight dialog detected.");
            if (state.endAction.toLowerCase() === 'hold') return;
            const dialog = document.querySelector('.dialogButtons___nX4Bz');
            const btns = dialog.querySelectorAll('button.torn-btn.btn___RxE8_.silver');
            btns.forEach(b => {
                if (b.textContent.trim().toLowerCase().includes(state.endAction.toLowerCase())) {
                    console.log("Clicking end dialog button:", b.textContent.trim());
                    b.click();
                }
            });
            return;
        }

        const origBtn = document.querySelector('button.torn-btn.btn___RxE8_.silver');
        if (!inCombat && origBtn) {
            const txt = origBtn.textContent.trim().toLowerCase();
            if (txt.includes('join fight') || txt.includes('start fight')) {
                console.log("Starting/joining fight...");
                simulateFullClick(origBtn);
                state.attackInitiated = true;
                state.attackCount = 0; // Reset attack count
                state.assassinateUsed = false; // Reset assassinate used flag

                // If using assassinate+useTempFirst, set up the observer
                // but only if a temp weapon exists
                if (state.assassinate && state.useTempFirst) {
                    // Wait briefly for combat to initialize
                    setTimeout(observeTurnResult, 1000);
                }
                return;
            }
        }

        if (inCombat) {
            const bestWeapon = getBestAvailableWeapon();
            if (bestWeapon) {
                console.log("Clicking weapon:", bestWeapon.id);
                bestWeapon.click();

                // If NOT in assassinate+useTempFirst mode, or we're past the first 2 turns,
                // or we don't have a temp weapon, immediately increment the counter
                if (!(state.assassinate && state.useTempFirst && state.attackCount < 2 && state.hasTempWeapon)) {
                    state.attackCount++;
                    console.log("Immediate turn taken. Attack Count:", state.attackCount);
                }
            } else {
                console.log("No weapon available to click.");
            }
        }
    }

    // --- DASHBOARD PANEL (for Items page) ---
    function createDashboardPanel() {
        console.log("Creating dashboard panel.");
        const panel = createControlPanel("PEW PEW");
        // Remove the attack button from the dashboard.
        const actionBtn = panel.querySelector('#persistent-attack-button');
        if (actionBtn) {
            actionBtn.remove();
            console.log("Attack button removed from dashboard panel.");
        }
        // Add a close button at the top-right corner.
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = "position:absolute; top:5px; right:5px; background:transparent; border:none; font-size:16px; cursor:pointer;";
        closeBtn.addEventListener("click", () => {
            panel.style.display = 'none';
            console.log("Dashboard panel closed.");
        });
        panel.style.position = "relative";
        panel.appendChild(closeBtn);
        return panel;
    }

    // --- STYLES ---
    function getStyles() {
        const dark = document.body.classList.contains('dark-mode');
        return {
            panelBg: dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
            panelTextColor: dark ? '#fff' : '#222',
            panelBorder: dark ? '1px solid #444' : '1px solid #ccc',
            panelBoxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
            buttonBg: dark ? '#1a1a1a' : '#fff',
            buttonTextColor: dark ? '#fff' : '#222',
            buttonBorder: dark ? '1px solid #444' : '1px solid #ccc',
            cardHoverBg: dark ? '#2a2a2a' : '#f0f0f0'
        };
    }

    // --- API VERIFICATION & INIT (for Attack pages) ---
    async function verifyApiKey(apiKey) {
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=&key=${apiKey}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error.error);
            if (!data.faction || !data.faction.faction_name)
                throw new Error('Invalid API response - missing faction data');
            const allowed = ['JFK', 'Just Fer Khaos', 'JFK - Future Killers', 'JFK - Misfits', 'Scum Squad'];
            if (!allowed.includes(data.faction.faction_name)) {
                alert('This script is not available for your faction.');
                return;
            }
            updateLocal('tornApiVerifiedTime', Date.now().toString());
            console.log("API key verified.");
            return true;
        } catch (err) {
            alert(`API verification failed: ${err.message}`);
            console.error("API verification error:", err);
            throw err;
        }
    }
    function needsRecheck() {
        const last = localStorage.getItem('tornApiVerifiedTime');
        if (!last) return true;
        const diff = Date.now() - parseInt(last);
        return diff >= API_RECHECK_INTERVAL;
    }
    async function promptAndVerifyApiKey() {
        const apiKey = prompt("Please enter your Torn API key:");
        if (!apiKey) {
            alert("API key is required to run this script.");
            return;
        }
        try {
            const verified = await verifyApiKey(apiKey);
            if (verified) {
                updateLocal('tornApiKey', apiKey);
                location.reload();
            }
        } catch (err) {
            localStorage.removeItem('tornApiKey');
        }
    }
    async function initAttack(initialLabel, hospitalMode = false) {
        console.log("Initializing attack mode with label:", initialLabel);
        const apiKey = localStorage.getItem('tornApiKey');
        if (!apiKey) {
            console.log('No API key found, prompting...');
            await promptAndVerifyApiKey();
            return;
        }
        console.log('Starting API recheck process...');
        if (needsRecheck()) {
            try {
                const verified = await verifyApiKey(apiKey);
                if (!verified) {
                    console.log('API recheck failed');
                    localStorage.removeItem('tornApiKey');
                    localStorage.removeItem('tornApiVerifiedTime');
                    await promptAndVerifyApiKey();
                    return;
                }
            } catch (error) {
                console.error('API reverification failed:', error);
                localStorage.removeItem('tornApiKey');
                localStorage.removeItem('tornApiVerifiedTime');
                await promptAndVerifyApiKey();
                return;
            }
        } else {
            console.log('No API recheck needed.');
        }

        // Add temp weapon check early
        checkTempWeapon();

        if (state.useTempFirst && !state.hasTempWeapon) {
            console.log('Warning: "Use Temp First" is enabled but no temp weapon found. Will use regular weapon priority instead.');
        }

        logAssassinateStatus();
        const panel = createControlPanel(initialLabel);
        const headerEl = document.querySelector('.appHeaderWrapper___uyPti');
        if (headerEl && !document.getElementById('persistent-attack-panel')) {
            headerEl.parentNode.insertBefore(panel, headerEl.nextSibling);
            console.log("Control panel inserted into page.");
        }
        const actionBtn = panel.querySelector('#persistent-attack-button');
        if (hospitalMode && actionBtn) {
            actionBtn.disabled = true;
            actionBtn.style.opacity = '0.5';
            actionBtn.style.cursor = 'default';
            actionBtn.textContent = "TARGET IS IN HOSP";
            console.log('Hospital mode active: Attack button disabled and labeled "TARGET IS IN HOSP".');
        }
        observeState(actionBtn);

        // Clean up any existing turn observer
        if (state.turnObserver) {
            state.turnObserver.disconnect();
            state.turnObserver = null;
            console.log("Cleaned up existing turn observer during initialization.");
        }

        // We don't immediately attach the turn observer here anymore
        // It will be attached when the fight starts in handleButtonClick
        state.attackCount = 0;
        state.assassinateUsed = false; // Reset assassinate used flag
    }

    // --- ITEMS PAGE DASHBOARD INJECTION ---
    async function injectDashboard() {
        console.log("Injecting dashboard panel on Items page.");
        const apiKey = localStorage.getItem('tornApiKey');
        if (!apiKey) {
            console.log('No API key found, prompting for one...');
            await promptAndVerifyApiKey();
            return;
        }
        console.log('Starting API recheck for dashboard...');
        if (needsRecheck()) {
            try {
                const verified = await verifyApiKey(apiKey);
                if (!verified) {
                    console.log('API recheck failed for dashboard.');
                    localStorage.removeItem('tornApiKey');
                    localStorage.removeItem('tornApiVerifiedTime');
                    await promptAndVerifyApiKey();
                    return;
                }
            } catch (error) {
                console.error('API reverification failed:', error);
                localStorage.removeItem('tornApiKey');
                localStorage.removeItem('tornApiVerifiedTime');
                await promptAndVerifyApiKey();
                return;
            }
        } else {
            console.log('No API recheck needed for dashboard.');
        }
        const topLinksContainer = document.getElementById("top-page-links-list");
        if (!topLinksContainer) {
            console.log("Top links container not found.");
            return;
        }
        const pewPewButton = document.createElement('a');
        pewPewButton.setAttribute("aria-label", "Pew Pew Dashboard");
        pewPewButton.className = "detailed-stats t-clear h c-pointer m-icon line-h24 right last";
        pewPewButton.href = "#";
        pewPewButton.innerHTML = '<span class="icon-wrap svg-icon-wrap"></span><span id="detailed-stats">Pew Pew</span>';
        const ammoButton = topLinksContainer.querySelector('a.ammo-locker');
        if (ammoButton) {
            ammoButton.parentNode.insertBefore(pewPewButton, ammoButton.nextSibling);
            console.log("Pew Pew button inserted after Ammo Locker.");
        } else {
            topLinksContainer.appendChild(pewPewButton);
            console.log("Pew Pew button appended to top links container.");
        }
        const hrElement = document.querySelector("hr.page-head-delimiter");
        const dashboardPanel = createDashboardPanel();
        dashboardPanel.style.display = 'none'; // hidden by default
        if (hrElement && hrElement.parentNode) {
            hrElement.parentNode.insertBefore(dashboardPanel, hrElement.nextSibling);
            console.log("Dashboard panel inserted after HR element.");
        } else {
            topLinksContainer.appendChild(dashboardPanel);
            console.log("Dashboard panel appended to top links container.");
        }
        pewPewButton.addEventListener("click", (e) => {
            e.preventDefault();
            dashboardPanel.style.display = dashboardPanel.style.display === "none" ? "block" : "none";
            console.log("Dashboard panel toggled. New display state:", dashboardPanel.style.display);
        });
    }

    // --- MAIN SCRIPT ENTRY POINT ---
    if (location.href.includes("sid=attack")) {
        console.log("Attack page detected. Initializing attack mode.");
        const checkInterval = setInterval(() => {
            const hospitalElem = document.querySelector('.colored___sN72G.red___SANWO .title___fOh2J');
            if (hospitalElem && hospitalElem.textContent.toLowerCase().includes('hospital')) {
                console.log('Hospital message detected on load; initializing control panel in hospital mode.');
                clearInterval(checkInterval);
                initAttack("START FIGHT", true);
                return;
            }
            if (isInCombat()) {
                console.log('In combat detected, initializing control panel.');
                clearInterval(checkInterval);
                initAttack("HIT");
                return;
            }
            const btn = document.querySelector('button.torn-btn.btn___RxE8_.silver');
            if (btn) {
                const txt = btn.textContent.trim().toLowerCase();
                if (txt.includes('start fight') || txt.includes('join fight')) {
                    const initLabel = txt.includes('join fight') ? "JOIN FIGHT" : "START FIGHT";
                    console.log("Fight button detected. Label determined:", initLabel);
                    clearInterval(checkInterval);
                    initAttack(initLabel);
                }
            }
        }, 100);
    } else if (location.href.includes("item.php")) {
        console.log("Items page detected. Injecting dashboard.");
        injectDashboard();
    }
})();