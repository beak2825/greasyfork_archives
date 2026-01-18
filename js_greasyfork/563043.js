// ==UserScript==
// @name         DOTV - Quest Loot Log
// @namespace    https://greasyfork.org/en/users/69216
// @version      0.4
// @author       ean5533
// @license      MIT
// @description  Quest loot log. For anyone who's ever been furiously clicking through quests and thought, "Wait, what was that thing that just dropped?"
// @match        https://play.dragonsofthevoid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563043/DOTV%20-%20Quest%20Loot%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/563043/DOTV%20-%20Quest%20Loot%20Log.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*****************************************************************
     * Constants & Storage Keys
     *****************************************************************/
    const BTN_POS_KEY = 'dotv.questLoot.buttonPos';
    const LOOT_LOG_KEY = 'dotv.questLoot.lootLog';
    const MAX_LOG_KEY = 'dotv.questLoot.maxLogItems';
    const DRAWER_SIZE_KEY = 'dotv.questLoot.drawerSize';
    const DEFAULT_MAX_LOG = 100;
    const DRAG_THRESHOLD = 5;

    const TILE_WIDTH = 85 + 2;
    const TILE_HEIGHT = 95 + 2;
    const MIN_COLS = 2;
    const MIN_ROWS = 2;

    /*****************************************************************
     * Utilities
     *****************************************************************/
    const loadJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
    const saveJSON = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); };

    /*****************************************************************
     * Floating Button
     *****************************************************************/
    const button = document.createElement('button');
    button.textContent = '🪎 Quest Loot';
    Object.assign(button.style, {
        position: 'fixed',
        zIndex: 9999,
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    });

    const savedPos = loadJSON(BTN_POS_KEY, { top: 40, left: 40 });
    button.style.top = `${savedPos.top}px`;
    button.style.left = `${savedPos.left}px`;
    document.body.appendChild(button);

    /*****************************************************************
     * Drawer (Resizable, color set to black)
     *****************************************************************/
    const drawer = document.createElement('div');
    Object.assign(drawer.style, {
        position: 'fixed',
        zIndex: 9999,
        background: '#3b2e1f',
        border: '1px solid #6b5a4c',
        boxShadow: 'rgba(0,0,0,0.3) 0px 2px 6px',
        padding: '4px',
        display: 'none',
        color: 'black',          // <--- important: tiles inherit dark borders via currentColor
        overflow: 'hidden',
        boxSizing: 'border-box',
        resize: 'both'
    });

    const configContainer = document.createElement('div');
    configContainer.style.marginBottom = '4px';
    configContainer.style.fontSize = '10px';
    configContainer.style.display = 'flex';
    configContainer.style.alignItems = 'center';
    configContainer.style.gap = '4px';
    configContainer.innerHTML = `
        <label style="font-size:10px;color:#f5e6d0;">Max log items:</label>
        <input id="loot-log-max" type="number" min="1" style="width:40px;font-size:10px;padding:1px;height:20px;">
        <button id="loot-log-clear" style="margin-left:auto;font-size:10px;padding:1px 4px;height:22px;cursor:pointer;">Clear</button>
    `;

    const drawerContent = document.createElement('div');
    Object.assign(drawerContent.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px',
        overflowY: 'auto',
        maxHeight: '100%',
        boxSizing: 'border-box'
    });

    drawer.appendChild(configContainer);
    drawer.appendChild(drawerContent);
    document.body.appendChild(drawer);

    // Drawer size
    const savedSize = loadJSON(DRAWER_SIZE_KEY, null);
    const DEFAULT_WIDTH = TILE_WIDTH * MIN_COLS + 12;
    const DEFAULT_HEIGHT = TILE_HEIGHT * MIN_ROWS + 30;
    drawer.style.width = savedSize?.width ? `${savedSize.width}px` : `${DEFAULT_WIDTH}px`;
    drawer.style.height = savedSize?.height ? `${savedSize.height}px` : `${DEFAULT_HEIGHT}px`;

    /*****************************************************************
     * Max log items input
     *****************************************************************/
    let maxLogItems = loadJSON(MAX_LOG_KEY, DEFAULT_MAX_LOG);
    const maxInput = document.getElementById('loot-log-max');
    maxInput.value = maxLogItems;
    maxInput.addEventListener('change', () => {
        const val = parseInt(maxInput.value);
        if (!isNaN(val) && val > 0) {
            maxLogItems = val;
            saveJSON(MAX_LOG_KEY, maxLogItems);
            trimLootLog();
        }
    });

    /*****************************************************************
     * Clear button
     *****************************************************************/
    const clearBtn = document.getElementById('loot-log-clear');
    clearBtn.addEventListener('click', () => {
        lootLog = [];
        seenLootIds.clear();
        drawerContent.innerHTML = '';
        saveJSON(LOOT_LOG_KEY, lootLog);
    });

    /*****************************************************************
     * Drawer Position Sync
     *****************************************************************/
    function syncDrawerPosition() {
        const rect = button.getBoundingClientRect();
        drawer.style.top = `${rect.bottom + 6}px`;
        drawer.style.left = `${rect.left}px`;
    }

    /*****************************************************************
     * Button drag
     *****************************************************************/
    let dragging = false, dragMoved = false, startX = 0, startY = 0, offsetX = 0, offsetY = 0;

    button.addEventListener('mousedown', e => {
        dragging = true; dragMoved = false; startX = e.clientX; startY = e.clientY;
        offsetX = e.clientX - button.offsetLeft; offsetY = e.clientY - button.offsetTop; e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        if (Math.abs(e.clientX - startX) > DRAG_THRESHOLD || Math.abs(e.clientY - startY) > DRAG_THRESHOLD) dragMoved = true;
        if (!dragMoved) return;
        button.style.left = `${e.clientX - offsetX}px`;
        button.style.top = `${e.clientY - offsetY}px`;
        if (drawer.style.display !== 'none') syncDrawerPosition();
    });
    document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        if (dragMoved) saveJSON(BTN_POS_KEY, { left: button.offsetLeft, top: button.offsetTop });
    });
    button.addEventListener('click', () => {
        if (dragMoved) return;
        if (drawer.style.display === 'none') { syncDrawerPosition(); drawer.style.display = 'block'; }
        else drawer.style.display = 'none';
    });

    /*****************************************************************
     * Tooltip
     *****************************************************************/
    const customTooltip = document.createElement('div');
    Object.assign(customTooltip.style, {
        position: 'fixed', zIndex: 10000, pointerEvents: 'none',
        background: '#222', color: '#fff', padding: '6px', borderRadius: '4px',
        fontSize: '12px', display: 'none', maxWidth: '250px'
    });
    document.body.appendChild(customTooltip);

    function attachTooltipHandlers(wrapper, data) {
        wrapper.addEventListener('mouseenter', e => {
            customTooltip.innerHTML = `<strong>${data.title}</strong> ${data.qty}x`;
            customTooltip.style.display = 'block';
        });
        wrapper.addEventListener('mousemove', e => {
            customTooltip.style.left = `${e.clientX + 12}px`;
            customTooltip.style.top = `${e.clientY + 12}px`;
        });
        wrapper.addEventListener('mouseleave', () => { customTooltip.style.display = 'none'; });
    }

    /*****************************************************************
     * Loot log
     *****************************************************************/
    let lootLog = loadJSON(LOOT_LOG_KEY, []);
    const seenLootIds = new Set();

    function trimLootLog() {
        while (lootLog.length > maxLogItems) {
            lootLog.pop();
            if (drawerContent.lastChild) drawerContent.removeChild(drawerContent.lastChild);
        }
        saveJSON(LOOT_LOG_KEY, lootLog);
    }

    function extractLootData(tile) {
        const title = tile.querySelector('.loot-title')?.textContent?.trim() || 'Unknown';
        const qtyText = tile.querySelector('.loot-qty')?.textContent || '1x';
        const qty = parseInt(qtyText, 10) || 1;
        return { title, qty, html: tile.outerHTML };
    }

    function createDrawerTile(data) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = data.html;
        wrapper.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        attachTooltipHandlers(wrapper, data);
        return wrapper;
    }

    function addLootTile(tileContainer) {
        // 🔒 Ignore non-quest loot
        if (!isQuestLoot(tileContainer)) return;

        const lootId = tileContainer.id;
        if (!lootId || seenLootIds.has(lootId)) return;
        seenLootIds.add(lootId);

        const data = extractLootData(tileContainer);
        lootLog.unshift(data);
        saveJSON(LOOT_LOG_KEY, lootLog);

        const wrapper = createDrawerTile(data);
        drawerContent.prepend(wrapper);
        trimLootLog();
    }

    function isQuestLoot(tile) {
        // Must be inside a modal footer
        const modalFooter = tile.closest('.modal-footer');
        if (!modalFooter) return false;

        // That footer must contain the quest button
        return !!modalFooter.querySelector('.quest.button');
    }

    // Restore loot log
    lootLog.forEach(data => {
        const wrapper = createDrawerTile(data);
        drawerContent.appendChild(wrapper);
        seenLootIds.add(data.id);
    });

    /*****************************************************************
     * Drawer resizing
     *****************************************************************/
    function constrainDrawerSize() {
        const rect = drawer.getBoundingClientRect();
        const minWidth = TILE_WIDTH * MIN_COLS + 30;
        const minHeight = TILE_HEIGHT * MIN_ROWS + 20;
        if (rect.width < minWidth) drawer.style.width = `${minWidth}px`;
        if (rect.height < minHeight) drawer.style.height = `${minHeight}px`;
        saveJSON(DRAWER_SIZE_KEY, { width: rect.width, height: rect.height });
    }

    drawer.addEventListener('mouseup', constrainDrawerSize);
    drawer.addEventListener('mouseleave', constrainDrawerSize);
    drawer.addEventListener('mousemove', () => { if (drawer.matches(':active')) constrainDrawerSize(); });

    /*****************************************************************
     * Mutation Observer – Loot Detection
     *****************************************************************/
    const lootObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (node.classList?.contains('loot-tile-container')) addLootTile(node);
                node.querySelectorAll?.('.loot-tile-container').forEach(addLootTile);
            }
        }
    });
    lootObserver.observe(document.body, { childList: true, subtree: true });

})();
