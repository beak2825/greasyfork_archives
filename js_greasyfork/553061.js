// ==UserScript==
// @name         Sinister Streets TowerUI
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Dynamic Tower button
// @author       ASTA MK
// @match        https://sinisterstreets.com/tower.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553061/Sinister%20Streets%20TowerUI.user.js
// @updateURL https://update.greasyfork.org/scripts/553061/Sinister%20Streets%20TowerUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = document.querySelector('header.game-header');
    if (!header) return;

    // --- Settings ---
    let settings = {
        useHealthKit: JSON.parse(localStorage.getItem('ss_useHealthKit')) ?? true,
        useCandyCorn: JSON.parse(localStorage.getItem('ss_useCandyCorn')) ?? false,
        useEnergyPill: JSON.parse(localStorage.getItem('ss_useEnergyPill')) ?? false,
        useEnergyBar: JSON.parse(localStorage.getItem('ss_useEnergyBar')) ?? false,
        useEnergyDrink: JSON.parse(localStorage.getItem('ss_useEnergyDrink')) ?? false,
        enableNextFloor: JSON.parse(localStorage.getItem('ss_enableNextFloor')) ?? true,
        enableRepeatFloor: JSON.parse(localStorage.getItem('ss_enableRepeatFloor')) ?? false,
        uiCollapsed: JSON.parse(localStorage.getItem('ss_uiCollapsed')) ?? false
    };

    // --- Button Container ---
    let container = document.getElementById('tower-btn-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'tower-btn-container';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.gap = '10px';
        container.style.margin = '10px 0';
        container.style.zIndex = '999999';
        container.style.position = 'relative';
        header.insertAdjacentElement('afterend', container);
    }

    // --- Collapsible UI Panel ---
    const uiPanel = document.createElement('div');
    uiPanel.id = 'tower-ui-panel';
    uiPanel.style.width = '260px';
    uiPanel.style.background = 'rgba(0,0,0,0.9)';
    uiPanel.style.color = 'white';
    uiPanel.style.padding = '12px';
    uiPanel.style.borderRadius = '10px';
    uiPanel.style.margin = '10px auto';
    uiPanel.style.fontSize = '14px';
    uiPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    uiPanel.style.zIndex = '999999';
    uiPanel.style.position = 'relative';
    container.insertAdjacentElement('afterend', uiPanel);

    const panelHeader = document.createElement('div');
    panelHeader.textContent = '⚙️ Tower Button Settings';
    panelHeader.style.fontWeight = 'bold';
    panelHeader.style.cursor = 'pointer';
    panelHeader.style.marginBottom = '8px';
    panelHeader.style.textAlign = 'center';
    panelHeader.style.fontSize = '16px';
    uiPanel.appendChild(panelHeader);

    const panelContent = document.createElement('div');
    panelContent.style.display = settings.uiCollapsed ? 'none' : 'flex';
    panelContent.style.flexDirection = 'column';
    panelContent.style.gap = '10px';
    uiPanel.appendChild(panelContent);

    panelHeader.addEventListener('click', () => {
        panelContent.style.display = panelContent.style.display === 'none' ? 'flex' : 'none';
        settings.uiCollapsed = panelContent.style.display === 'none';
        localStorage.setItem('ss_uiCollapsed', settings.uiCollapsed);
    });

    // --- Section builder ---
    function createSection(title) {
        const section = document.createElement('div');
        const h = document.createElement('div');
        h.textContent = title;
        h.style.fontWeight = 'bold';
        h.style.marginBottom = '4px';
        section.appendChild(h);
        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '4px';
        section.appendChild(content);
        panelContent.appendChild(section);
        return content;
    }

    const healthSection = createSection('Health Items');
    const energySection = createSection('Energy Items');
    const playStyleSection = createSection('Play Style');

    function addItem(section, id, label, key) {
        const wrap = document.createElement('label');
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '6px';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.checked = settings[key];
        wrap.appendChild(input);
        wrap.append(label);
        section.appendChild(wrap);
        input.addEventListener('change', e => {
            settings[key] = e.target.checked;
            localStorage.setItem('ss_' + key, e.target.checked);
        });
    }

    addItem(healthSection, 'chk-healthkit', 'Health Kit', 'useHealthKit');
    addItem(healthSection, 'chk-candycorn', 'Candy Corn', 'useCandyCorn');
    addItem(energySection, 'chk-energypill', 'Energy Pill', 'useEnergyPill');
    addItem(energySection, 'chk-energybar', 'Energy Bar', 'useEnergyBar');
    addItem(energySection, 'chk-energydrink', 'Energy Drink', 'useEnergyDrink');
    addItem(playStyleSection, 'chk-nextfloor', 'Next Floor', 'enableNextFloor');
    addItem(playStyleSection, 'chk-repeatfloor', 'Repeat Floor', 'enableRepeatFloor');

    function addThreshold(section, title, key, def) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.gap = '6px';
        const span = document.createElement('span');
        span.textContent = title;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 100;
        input.value = localStorage.getItem(key) ?? def;
        input.style.width = '50px';
        div.append(span, input);
        section.appendChild(div);
        input.addEventListener('change', e => localStorage.setItem(key, e.target.value));
    }

    addThreshold(healthSection, 'Health Threshold (%)', 'ss_healthThreshold', 50);
    addThreshold(energySection, 'Energy Threshold (%)', 'ss_energyThreshold', 50);

    // --- Dynamic Button ---
    let dynamicBtn = document.getElementById('dynamic-tower-btn');
    if (!dynamicBtn) {
        dynamicBtn = document.createElement('button');
        dynamicBtn.id = 'dynamic-tower-btn';
        dynamicBtn.className = 'tower-btn';
        dynamicBtn.style.width = '180px';
        dynamicBtn.style.height = '40px';
        dynamicBtn.style.fontSize = '16px';
        dynamicBtn.style.zIndex = '999999';
        dynamicBtn.style.position = 'relative';
        container.appendChild(dynamicBtn);
    }

    // --- Runtime Vars ---
    let actionInProgress = false;
    let energyUsedThisFight = false;
    let awaitingConfirmUse = false;
    let awaitingEnergyConfirm = false;
    let lastEnemy = 0;

    // --- Helpers ---
    const getRandomDelay = (min = 200, max = 800) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getPercent = id => {
        const el = document.getElementById(id);
        if (!el) return 100;
        const [c, m] = el.textContent.split('/').map(x => parseInt(x.trim()));
        return Math.floor((c / m) * 100);
    };
    const getCurrentEnemy = () => {
        const span = [...document.querySelectorAll('span')].find(s => /Enemy \d+ \/ \d+/.test(s.textContent));
        if (!span) return lastEnemy;
        return parseInt(span.textContent.match(/Enemy (\d+)/)[1]);
    };

    function setButton(icon, label, fn) {
        dynamicBtn.innerHTML = `${icon} ${label}`;
        dynamicBtn.disabled = false;
        dynamicBtn.style.opacity = '1';
        dynamicBtn.onclick = async () => {
            if (actionInProgress) return;
            actionInProgress = true;
            await fn();
            actionInProgress = false;
        };
    }
    const waiting = () => {
        dynamicBtn.innerHTML = '<i class="fas fa-clock"></i> Waiting...';
        dynamicBtn.disabled = true;
        dynamicBtn.style.opacity = '0.5';
    };

    // --- Consumables ---
    async function useConsumable(name, key) {
        if (!settings[key]) return;
        if (['useEnergyPill','useEnergyBar','useEnergyDrink'].includes(key) && energyUsedThisFight) return;

        const useBtn = document.querySelector('#use-item-btn');
        if (!useBtn || useBtn.offsetParent === null) return;

        waiting();
        useBtn.click();
        await new Promise(r => setTimeout(r, 200));

        const itemBtn = document.querySelector(`.tower-btn.healing-item-btn[data-name="${name}"]`);
        if (itemBtn && itemBtn.offsetParent !== null) {
            itemBtn.click();
            awaitingConfirmUse = true;
        }

        if (['useEnergyPill','useEnergyBar','useEnergyDrink'].includes(key))
            energyUsedThisFight = true;
    }

    // --- Button Actions ---
    const confirmUse = () => setButton('<i class="fas fa-check"></i>', 'Confirm Use', async () => {
        const c = document.querySelector('#item-use-confirm-yes');
        if (c && c.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            c.click();
            awaitingConfirmUse = false;
        }
    });
    const attack = () => setButton('<i class="fas fa-crosshairs"></i>', 'Attack', async () => {
        const b = document.querySelector('#attack-btn');
        if (b && b.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            b.click();
        }
    });
    const cont = () => setButton('<i class="fas fa-arrow-right"></i>', 'Continue', async () => {
        const b = document.querySelector('#continue-tower-btn');
        if (b && b.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            b.click();
        }
    });
    const next = () => setButton('<i class="fas fa-arrow-right"></i>', 'Next Floor', async () => {
        const b = document.querySelector('#next-floor-btn');
        if (settings.enableNextFloor && b && b.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            b.click();
        }
    });
    const repeat = () => setButton('<i class="fas fa-redo"></i>', 'Repeat Floor', async () => {
        const b = document.querySelector('#repeat-floor-btn');
        if (settings.enableRepeatFloor && b && b.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            b.click();
            awaitingEnergyConfirm = true; // ✅ new flag for post-repeat continue
        }
    });
    const energyConfirm = () => setButton('<i class="fas fa-arrow-right"></i>', 'Continue', async () => {
        const energyBtn = document.querySelector('#energy-confirm-yes');
        if (energyBtn && energyBtn.offsetParent) {
            await new Promise(r => setTimeout(r, getRandomDelay()));
            energyBtn.click();
            awaitingEnergyConfirm = false;
        }
    });

    // --- Main Loop ---
    setInterval(() => {
        if (actionInProgress) return;

        const hp = getPercent('player-hp-value') || getPercent('health-value');
        const en = getPercent('energy-value');
        const hpTh = parseInt(localStorage.getItem('ss_healthThreshold') ?? 50);
        const enTh = parseInt(localStorage.getItem('ss_energyThreshold') ?? 50);

        const curEnemy = getCurrentEnemy();
        if (curEnemy > lastEnemy) {
            energyUsedThisFight = false;
            awaitingConfirmUse = false;
            awaitingEnergyConfirm = false;
            lastEnemy = curEnemy;
        }

        const visible = id => document.querySelector(id)?.offsetParent !== null;

        if (awaitingConfirmUse && visible('#item-use-confirm-yes')) confirmUse();
        else if (awaitingEnergyConfirm && visible('#energy-confirm-yes')) energyConfirm();
        else if (visible('#continue-tower-btn')) cont();
        else if (visible('#next-floor-btn') && settings.enableNextFloor) next();
        else if (visible('#repeat-floor-btn') && settings.enableRepeatFloor) repeat();
        else if (settings.useHealthKit && hp < hpTh) setButton('<i class="fas fa-kit-medical"></i>', 'Health Kit', async () => await useConsumable('Fixers First Aid', 'useHealthKit'));
        else if (settings.useCandyCorn && hp < hpTh) setButton('<i class="fas fa-candy-cane"></i>', 'Candy Corn', async () => await useConsumable('Candy Corn', 'useCandyCorn'));
        else if (!energyUsedThisFight && settings.useEnergyPill && en < enTh) setButton('<i class="fas fa-pills"></i>', 'Energy Pill', async () => await useConsumable('Energy Pill', 'useEnergyPill'));
        else if (!energyUsedThisFight && settings.useEnergyBar && en < enTh) setButton('<i class="fas fa-bolt"></i>', 'Energy Bar', async () => await useConsumable('Energy Bar', 'useEnergyBar'));
        else if (!energyUsedThisFight && settings.useEnergyDrink && en < enTh) setButton('<i class="fas fa-wine-bottle"></i>', 'Energy Drink', async () => await useConsumable('Energy Drink', 'useEnergyDrink'));
        else if (visible('#attack-btn')) attack();
        else waiting();
    }, 250);

})();
