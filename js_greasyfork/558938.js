// ==UserScript==
// @name         Scaley Way Idle
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  Change the scale of CombatUnit divs with a draggable control panel
// @author       Frotty
// @match        *://milkywayidle.com/*
// @match        *://*.milkywayidle.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558938/Scaley%20Way%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/558938/Scaley%20Way%20Idle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'swi_storage';

    // Load settings from localStorage
    function loadSettings() {
        const defaults = {
            panelLeft: null,
            panelTop: 20,
            panelMinimized: false,
            playerScale: 100,
            monsterScale: 100,
            rightPanelHeight: 50,
            playerGridPos: null,
            monsterGridPos: null
        };
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...defaults, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error('Scaley: Error loading settings', e);
        }
        return defaults;
    }

    // Save settings to localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Scaley: Error saving settings', e);
        }
    }

    let settings = loadSettings();

    GM_addStyle(`
        #scaley-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2a2a2a;
            border: 2px solid #555;
            border-radius: 8px;
            padding: 15px;
            z-index: 1;
            font-family: Arial, sans-serif;
            color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            user-select: none;
        }
        #scaley-panel.minimized {
            padding: 8px 15px;
        }
        #scaley-panel.minimized .scaley-content {
            display: none;
        }
        #scaley-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            margin-bottom: 10px;
        }
        #scaley-panel.minimized #scaley-header {
            margin-bottom: 0;
        }
        #scaley-panel h3 {
            margin: 0;
            font-size: 14px;
            color: #4CAF50;
        }
        #scaley-minimize {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
        }
        #scaley-minimize:hover {
            color: #4CAF50;
        }
        #scaley-panel label {
            font-size: 12px;
            display: block;
            margin-bottom: 5px;
        }
        #scaley-panel .scaley-row {
            margin-bottom: 10px;
        }
        #scaley-panel .scaley-row:last-child {
            margin-bottom: 0;
        }
        #scaley-player-input, #scaley-monster-input, #scaley-rightpanel-input {
            width: 60px;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #1a1a1a;
            color: #fff;
            font-size: 14px;
            cursor: text;
        }
        #scaley-player-input:focus, #scaley-monster-input:focus, #scaley-rightpanel-input:focus {
            outline: none;
            border-color: #4CAF50;
        }
        #scaley-apply {
            padding: 5px 12px;
            background: #4CAF50;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            font-size: 12px;
        }
        #scaley-apply:hover {
            background: #45a049;
        }

        /* Drag handle for combat unit grid */
        .scaley-drag-handle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: rgba(76, 175, 80, 0.8);
            cursor: grab;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #fff;
            font-weight: bold;
            pointer-events: auto;
        }
        .scaley-drag-handle:active {
            cursor: grabbing;
        }
        .BattlePanel_playersArea__vvwlB:hover .scaley-drag-handle,
        .BattlePanel_monstersArea__2dzrY:hover .scaley-drag-handle {
            opacity: 1;
        }

        /* Transparent shim to force 50% width */
        .scaley-shim {
            width: 50% !important;
            min-width: 50% !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 1px !important;
            overflow: hidden !important;
            display: inline-block !important;
            vertical-align: top !important;
        }

        /* Force horizontal layout */
        .BattlePanel_battleArea__U9hij {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: flex-start !important;
        }

        .BattlePanel_playersArea__vvwlB {
            flex: 0 0 50% !important;
            max-width: 50% !important;
            position: relative !important;
            border-right: none !important;
        }

        .BattlePanel_monstersArea__2dzrY {
            flex: 0 0 50% !important;
            max-width: 50% !important;
            position: relative !important;
        }

        /* Force combat unit grid horizontal layout */
        .BattlePanel_combatUnitGrid__2hTAM {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
        }
    `);

    const panel = document.createElement('div');
    panel.id = 'scaley-panel';
    panel.innerHTML = `
        <div id="scaley-header">
            <h3>Scaley Way Idle</h3>
            <button id="scaley-minimize">−</button>
        </div>
        <div class="scaley-content">
            <div class="scaley-row">
                <label>Player Scale (20-100%):</label>
                <input type="number" id="scaley-player-input" min="20" max="100" value="${settings.playerScale}">
            </div>
            <div class="scaley-row">
                <label>Enemy Scale (20-100%):</label>
                <input type="number" id="scaley-monster-input" min="20" max="100" value="${settings.monsterScale}">
            </div>
            <div class="scaley-row">
                <label>Right Panel (20-100%):</label>
                <input type="number" id="scaley-rightpanel-input" min="20" max="100" value="${settings.rightPanelHeight}">
            </div>
            <div class="scaley-row">
                <button id="scaley-apply">Apply</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // Restore panel position
    if (settings.panelLeft !== null) {
        panel.style.left = settings.panelLeft + 'px';
        panel.style.top = settings.panelTop + 'px';
        panel.style.right = 'auto';
    }

    // Restore minimized state
    if (settings.panelMinimized) {
        panel.classList.add('minimized');
    }

    // Minimize functionality
    const minimizeBtn = document.getElementById('scaley-minimize');
    minimizeBtn.textContent = settings.panelMinimized ? '+' : '−';
    minimizeBtn.addEventListener('click', () => {
        panel.classList.toggle('minimized');
        const isMinimized = panel.classList.contains('minimized');
        minimizeBtn.textContent = isMinimized ? '+' : '−';
        settings.panelMinimized = isMinimized;
        saveSettings(settings);
    });

    // Draggable functionality for control panel
    let isPanelDragging = false;
    let panelOffsetX, panelOffsetY;
    const header = document.getElementById('scaley-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isPanelDragging = true;
        panelOffsetX = e.clientX - panel.getBoundingClientRect().left;
        panelOffsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPanelDragging) return;
        const left = e.clientX - panelOffsetX;
        const top = e.clientY - panelOffsetY;
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
        panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isPanelDragging) {
            settings.panelLeft = parseInt(panel.style.left);
            settings.panelTop = parseInt(panel.style.top);
            saveSettings(settings);
        }
        isPanelDragging = false;
    });

    // Area dragging (drag the parent area, not the grid)
    let isAreaDragging = false;
    let areaOffsetX, areaOffsetY;
    let currentArea = null;
    let currentAreaType = null;

    document.addEventListener('mousemove', (e) => {
        if (!isAreaDragging || !currentArea) return;
        const x = e.clientX - areaOffsetX;
        const y = e.clientY - areaOffsetY;
        currentArea.style.setProperty('position', 'fixed', 'important');
        currentArea.style.setProperty('left', x + 'px', 'important');
        currentArea.style.setProperty('top', y + 'px', 'important');
        currentArea.style.setProperty('z-index', '1', 'important');
    });

    document.addEventListener('mouseup', () => {
        if (isAreaDragging && currentArea && currentAreaType) {
            const pos = {
                left: parseInt(currentArea.style.left),
                top: parseInt(currentArea.style.top)
            };
            if (currentAreaType === 'player') {
                settings.playerGridPos = pos;
            } else {
                settings.monsterGridPos = pos;
            }
            saveSettings(settings);
        }
        isAreaDragging = false;
        currentArea = null;
        currentAreaType = null;
    });

    // Scale functionality
    const playerInput = document.getElementById('scaley-player-input');
    const monsterInput = document.getElementById('scaley-monster-input');
    const rightPanelInput = document.getElementById('scaley-rightpanel-input');
    const applyBtn = document.getElementById('scaley-apply');

    function setupDragHandle(area, type) {
        if (area.querySelector('.scaley-drag-handle')) return;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'scaley-drag-handle';
        dragHandle.textContent = '⋮⋮ DRAG ⋮⋮';
        // Append at end instead of inserting at beginning to avoid interfering with other scripts
        area.appendChild(dragHandle);

        dragHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isAreaDragging = true;
            currentArea = area;
            currentAreaType = type;
            const rect = area.getBoundingClientRect();
            areaOffsetX = e.clientX - rect.left;
            areaOffsetY = e.clientY - rect.top;
        });

        // Restore position if saved
        const savedPos = type === 'player' ? settings.playerGridPos : settings.monsterGridPos;
        if (savedPos) {
            area.style.setProperty('position', 'fixed', 'important');
            area.style.setProperty('left', savedPos.left + 'px', 'important');
            area.style.setProperty('top', savedPos.top + 'px', 'important');
            area.style.setProperty('z-index', '1', 'important');
        }
    }

    // Apply scale from saved settings (does not touch input fields)
    function applyScaleFromSettings() {
        const playerScale = settings.playerScale / 100;
        const monsterScale = settings.monsterScale / 100;

        // Scale player grids
        const playerGrids = document.querySelectorAll('.BattlePanel_playersArea__vvwlB .BattlePanel_combatUnitGrid__2hTAM');
        playerGrids.forEach(grid => {
            grid.style.setProperty('transform', `scale(${playerScale})`, 'important');
            grid.style.setProperty('transform-origin', 'top left', 'important');
        });

        // Scale monster grids
        const monsterGrids = document.querySelectorAll('.BattlePanel_monstersArea__2dzrY .BattlePanel_combatUnitGrid__2hTAM');
        monsterGrids.forEach(grid => {
            grid.style.setProperty('transform', `scale(${monsterScale})`, 'important');
            grid.style.setProperty('transform-origin', 'top left', 'important');
        });

        // Apply right panel height
        const rightPanels = document.querySelectorAll('.GamePage_characterManagementPanel__3OYQL');
        rightPanels.forEach(panel => {
            panel.style.setProperty('height', `${settings.rightPanelHeight}vh`, 'important');
            panel.style.setProperty('overflow-y', 'auto', 'important');
        });

        // Setup drag handles on areas
        const playerAreas = document.querySelectorAll('.BattlePanel_playersArea__vvwlB');
        playerAreas.forEach(area => setupDragHandle(area, 'player'));

        const monsterAreas = document.querySelectorAll('.BattlePanel_monstersArea__2dzrY');
        monsterAreas.forEach(area => setupDragHandle(area, 'monster'));

        // Add shim to battle area if needed
        const battleAreas = document.querySelectorAll('.BattlePanel_battleArea__U9hij');
        battleAreas.forEach(battleArea => {
            if (!battleArea.querySelector('.scaley-shim')) {
                const shim = document.createElement('div');
                shim.className = 'scaley-shim';
                battleArea.appendChild(shim);
            }
        });
    }

    // Apply scale from input fields (only called when user clicks Apply or presses Enter)
    function applyScale() {
        let playerValue = parseInt(playerInput.value, 10);
        if (isNaN(playerValue) || playerValue < 20) playerValue = 20;
        if (playerValue > 100) playerValue = 100;
        playerInput.value = playerValue;

        let monsterValue = parseInt(monsterInput.value, 10);
        if (isNaN(monsterValue) || monsterValue < 20) monsterValue = 20;
        if (monsterValue > 100) monsterValue = 100;
        monsterInput.value = monsterValue;

        let rightPanelValue = parseInt(rightPanelInput.value, 10);
        if (isNaN(rightPanelValue) || rightPanelValue < 20) rightPanelValue = 20;
        if (rightPanelValue > 100) rightPanelValue = 100;
        rightPanelInput.value = rightPanelValue;

        settings.playerScale = playerValue;
        settings.monsterScale = monsterValue;
        settings.rightPanelHeight = rightPanelValue;
        saveSettings(settings);

        applyScaleFromSettings();
    }

    applyBtn.addEventListener('click', applyScale);
    playerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyScale();
    });
    monsterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyScale();
    });
    rightPanelInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyScale();
    });

    // Setup drag handles on page load and watch for new areas
    function setupAllDragHandles() {
        const playerAreas = document.querySelectorAll('.BattlePanel_playersArea__vvwlB');
        playerAreas.forEach(area => setupDragHandle(area, 'player'));

        const monsterAreas = document.querySelectorAll('.BattlePanel_monstersArea__2dzrY');
        monsterAreas.forEach(area => setupDragHandle(area, 'monster'));
    }

    // Initial setup
    setupAllDragHandles();

    // Auto-apply saved settings on load
    applyScaleFromSettings();

    // Watch for dynamically added areas
    const observer = new MutationObserver(() => {
        setupAllDragHandles();
        // Re-apply settings to newly added elements (uses saved settings, doesn't touch inputs)
        applyScaleFromSettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
