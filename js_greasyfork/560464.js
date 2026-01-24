// ==UserScript==
// @name Re:Color (Bonk.io)
// @namespace https://greasyfork.org/en/users/1552147-ansonii-crypto
// @version 0.0.2
// @description A script to change the in-game name of anyone you'd like using colour groups. Script now requires; https://greasyfork.org/en/scripts/560457-bonk-mod-settings-core
// @match https://bonk.io/gameframe-release.html
// @run-at document-start
// @grant none
// @license N/A
// @downloadURL https://update.greasyfork.org/scripts/560464/Re%3AColor%20%28Bonkio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560464/Re%3AColor%20%28Bonkio%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    function waitForElement(id, cb) {
        const interval = setInterval(() => {
            const el = $(id);
            if (el) {
                clearInterval(interval);
                cb(el);
            }
        }, 200);
    }

    let colorGroups = [];

    const STORAGE_KEY_PREFIX_V2 = 'bonk_recolor_groups_v2_';
    const STORAGE_KEY_PREFIX_V1 = 'bonk_mod_color_groups_';

    let storageKey = null;
    let lastStorageKey = undefined;
    let observersInitialized = false;

    let activePanel = null;

    function normalizeName(name) {
        return (name || '').trim().toLowerCase();
    }

    function isLoggedInAccount() {
        const lvlEl = $('pretty_top_level');
        if (!lvlEl) return false;

        const lvlText = (lvlEl.textContent || '').trim().toLowerCase();
        if (!lvlText || lvlText === 'guest') return false;

        const nameEl = $('pretty_top_name');
        const name = (nameEl ? nameEl.textContent : '').trim();
        return !!name;
    }

    function getAccountNameFromPrettyTopOrNull() {
        if (!isLoggedInAccount()) return null;
        const el = $('pretty_top_name');
        const name = (el ? el.textContent : '').trim();
        if (!name) return null;
        return name.toLowerCase();
    }

    function getStorageKeyV2() {
        const acct = getAccountNameFromPrettyTopOrNull();
        if (!acct) return null;
        return STORAGE_KEY_PREFIX_V2 + acct;
    }

    function guessOldV1StorageKeys() {
        const keys = new Set();

        const prettyName = $('pretty_top_name');
        if (prettyName && prettyName.textContent.trim()) {
            keys.add(STORAGE_KEY_PREFIX_V1 + normalizeName(prettyName.textContent.trim()));
        }

        const stored = localStorage.getItem('bonk_name');
        if (stored && stored.trim()) keys.add(STORAGE_KEY_PREFIX_V1 + normalizeName(stored.trim()));

        keys.add(STORAGE_KEY_PREFIX_V1 + 'default');
        return Array.from(keys);
    }

    function migrateV1ToV2IfNeeded() {
        try {
            if (!storageKey) return;

            const v2Raw = localStorage.getItem(storageKey);
            if (v2Raw) return;

            for (const k of guessOldV1StorageKeys()) {
                const raw = localStorage.getItem(k);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            localStorage.setItem(storageKey, raw);
                            return;
                        }
                    } catch {}
                }
            }
        } catch {}
    }

    function hexToRgba(hex, alpha) {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        let h = hex.replace('#', '');
        if (h.length === 3) {
            h = h.split('').map(c => c + c).join('');
        }
        if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
        const r = parseInt(h.slice(0, 2), 16) || 0;
        const g = parseInt(h.slice(2, 4), 16) || 0;
        const b = parseInt(h.slice(4, 6), 16) || 0;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function loadGroups() {
        try {
            if (!storageKey) {
                colorGroups = [];
                return;
            }
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                colorGroups = [];
                return;
            }
            const data = JSON.parse(raw);
            colorGroups = Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('[Re:Color] Failed to load colour groups:', e);
            colorGroups = [];
        }
    }

    function saveGroups() {
        try {
            if (!storageKey) {
                window.dispatchEvent(new Event('recolorGroupsChanged'));
                updateStorageHintUI();
                return;
            }
            localStorage.setItem(storageKey, JSON.stringify(colorGroups));
            window.dispatchEvent(new Event('recolorGroupsChanged'));
            updateStorageHintUI();
        } catch (e) {
            console.error('[Re:Color] Failed to save colour groups:', e);
        }
    }

    function updateStorageHintUI() {
        const el = document.getElementById('recolor_storage_hint');
        if (!el) return;

        if (storageKey) {
            el.style.color = '';
            el.style.opacity = '.75';
            el.textContent = `Per-account storage: ${storageKey}`;
        } else {
            el.style.color = '#ffcc66';
            el.style.opacity = '.9';
            el.textContent = 'Guest mode: settings are temporary until you log in.';
        }
    }

    function updateAccountStorageKey() {
        const newKey = getStorageKeyV2();
        if (newKey === lastStorageKey) return;

        lastStorageKey = newKey;
        storageKey = newKey;

        if (storageKey) {
            migrateV1ToV2IfNeeded();
        }

        loadGroups();

        const list = document.getElementById('cg_groups_list');
        if (list) renderGroupsUI();

        updateStorageHintUI();
    }

    function ensureAccountObservers() {
        if (observersInitialized) return;
        observersInitialized = true;

        const attach = () => {
            const nameEl = $('pretty_top_name');
            const lvlEl = $('pretty_top_level');

            const obs = new MutationObserver(() => updateAccountStorageKey());
            if (nameEl) obs.observe(nameEl, { childList: true, characterData: true, subtree: true });
            if (lvlEl) obs.observe(lvlEl, { childList: true, characterData: true, subtree: true });
        };

        attach();

        const globalObs = new MutationObserver(() => {
            updateAccountStorageKey();
        });
        globalObs.observe(document.documentElement || document.body, { childList: true, subtree: true });

        updateAccountStorageKey();
    }

    function getColorForName(name) {
        const n = normalizeName(name);
        for (const g of colorGroups) {
            if (g.players.some(p => normalizeName(p) === n)) {
                return g.color;
            }
        }
        return null;
    }

    function findGroupByPlayerName(playerName) {
        const n = normalizeName(playerName);
        return colorGroups.find(g => g.players.some(p => normalizeName(p) === n)) || null;
    }

    function addGroup(name = 'New Group', color = '#ff0000') {
        const id = 'cg_' + Date.now() + '_' + Math.random().toString(16).slice(2);
        colorGroups.push({
            id,
            name,
            color,
            players: []
        });
        saveGroups();
        renderGroupsUI();
    }

    function deleteGroup(id) {
        const idx = colorGroups.findIndex(g => g.id === id);
        if (idx !== -1) {
            colorGroups.splice(idx, 1);
            saveGroups();
            renderGroupsUI();
        }
    }

    function renameGroup(id, newName) {
        const g = colorGroups.find(g => g.id === id);
        if (!g) return;
        g.name = newName || g.name;
        saveGroups();
        renderGroupsUI();
    }

    function setGroupColor(id, newColor) {
        const g = colorGroups.find(g => g.id === id);
        if (!g) return;
        g.color = newColor;
        saveGroups();
    }

    function addPlayerToGroup(groupId, playerName) {
        const name = (playerName || '').trim();
        if (!name) {
            return { ok: false, error: 'Name cannot be empty.' };
        }

        const existingGroup = findGroupByPlayerName(name);
        if (existingGroup) {
            return {
                ok: false,
                error: `Player "${name}" is already in group "${existingGroup.name}".`
            };
        }

        const g = colorGroups.find(g => g.id === groupId);
        if (!g) return { ok: false, error: 'Group not found.' };

        g.players.push(name);
        saveGroups();
        renderGroupsUI();
        return { ok: true };
    }

    function removePlayerFromGroup(groupId, playerName) {
        const g = colorGroups.find(g => g.id === groupId);
        if (!g) return;
        const n = normalizeName(playerName);
        g.players = g.players.filter(p => normalizeName(p) !== n);
        saveGroups();
        renderGroupsUI();
    }

    function movePlayerToGroup(fromGroupId, toGroupId, playerName) {
        if (fromGroupId === toGroupId) {
            return { ok: false, error: 'Already in that group.' };
        }

        const from = colorGroups.find(g => g.id === fromGroupId);
        const to = colorGroups.find(g => g.id === toGroupId);
        if (!from || !to) return { ok: false, error: 'Group not found.' };

        const n = normalizeName(playerName);

        if (to.players.some(p => normalizeName(p) === n)) {
            return { ok: false, error: `Player "${playerName}" is already in that group.` };
        }

        from.players = from.players.filter(p => normalizeName(p) !== n);
        to.players.push(playerName);
        saveGroups();
        renderGroupsUI();
        return { ok: true };
    }

    function reorderGroupsToIndex(groupId, targetIndex) {
        const oldIndex = colorGroups.findIndex(g => g.id === groupId);
        if (oldIndex === -1) return;
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > colorGroups.length - 1) targetIndex = colorGroups.length - 1;
        if (oldIndex === targetIndex) return;

        const [moved] = colorGroups.splice(oldIndex, 1);
        colorGroups.splice(targetIndex, 0, moved);
        saveGroups();
        renderGroupsUI();
    }

    function closePanel() {
        if (activePanel && activePanel.parentNode) {
            activePanel.parentNode.removeChild(activePanel);
        }
        activePanel = null;
    }

    function openPanel(anchorEl, buildContent) {
        closePanel();

        const panel = document.createElement('div');
        panel.className = 'mod_ctx_panel';
        panel.addEventListener('click', e => e.stopPropagation());

        buildContent(panel);

        document.body.appendChild(panel);
        activePanel = panel;

        const rect = anchorEl.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 4;
        if (left + panelRect.width > window.innerWidth) {
            left = window.innerWidth - panelRect.width - 8;
        }
        if (top + panelRect.height > window.innerHeight) {
            top = rect.top - panelRect.height - 4;
        }

        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
    }

    document.addEventListener('click', () => {
        closePanel();
    });

    function ensureRecolorStyles() {
        if (document.getElementById('recolor_css')) return;
        const style = document.createElement('style');
        style.id = 'recolor_css';
        style.textContent = `
        #cg_groups_outer { margin-top: 8px; overflow-x: auto; overflow-y: hidden; padding-bottom: 4px; box-sizing: border-box; }
        #cg_groups_list { display: flex; flex-direction: row; gap: 10px; min-height: 160px; }
        .cg_group { position: relative; border: 1px solid rgba(0,0,0,0.4); border-radius: 6px; padding: 8px; background: rgba(0,0,0,0.15); box-shadow: 0 2px 4px rgba(0,0,0,0.25); display: flex; flex-direction: column; cursor: default; flex: 0 0 33%; max-width: 33%; box-sizing: border-box; height: 180px; }
        .cg_group_header { display: flex; align-items: center; margin-bottom: 6px; padding: 2px 4px; border-radius: 4px; background: rgba(0,0,0,0.2); }
        .cg_group_handle { width: 16px; height: 16px; margin-right: 6px; display: flex; align-items: center; justify-content: center; cursor: grab; opacity: 0.8; font-size: 10px; user-select: none; }
        .cg_group_title { flex: 1; font-weight: bold; font-size: 13px; text-align: left; }
        .cg_group_menu { cursor: pointer; opacity: 0.8; padding: 2px 6px; border-radius: 4px; }
        .cg_group_menu:hover { background: rgba(0,0,0,0.2); }
        .cg_group_players { margin: 4px 0; max-height: 120px; overflow-y: auto; padding-right: 4px; flex: 1 1 auto; }
        .cg_player_row { display: flex; align-items: center; justify-content: space-between; padding: 3px 6px; border-radius: 4px; background: rgba(0,0,0,0.15); margin-bottom: 3px; font-size: 12px; }
        .cg_player_row:nth-child(even) { background: rgba(0,0,0,0.28); }
        .cg_player_row:last-child { margin-bottom: 0; }
        .cg_player_name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cg_player_menu { margin-left: 6px; cursor: pointer; opacity: 0; transition: opacity 0.15s; }
        .cg_player_row:hover .cg_player_menu { opacity: 1; }
        .cg_group_color { display: flex; align-items: center; margin-top: auto; gap: 6px; font-size: 11px; opacity: 0.9; padding: 3px 4px; border-radius: 4px; background: rgba(0,0,0,0.2); }
        .cg_group_color input[type="color"] { border: none; padding: 0; width: 26px; height: 20px; cursor: pointer; }
        .cg_group_color_value { font-family: monospace; }
        .cg_group.cg_group_add { border: 1px dashed rgba(255,255,255,0.5); background: transparent; align-items: center; justify-content: center; cursor: pointer; }
        .cg_group_add_inner { text-align: center; opacity: 0.9; }
        .cg_group_add_plus { font-size: 24px; line-height: 1; margin-bottom: 4px; }
        .cg_group_placeholder { flex: 0 0 33%; max-width: 33%; border: 2px dashed rgba(255,255,255,0.4); border-radius: 6px; background: rgba(255,255,255,0.04); height: 180px; }
        .cg_group_dragging { animation: cg_rock 0.25s ease-in-out infinite alternate; transform-origin: center center; box-shadow: 0 8px 22px rgba(0,0,0,0.7); cursor: grabbing !important; }
        @keyframes cg_rock { 0% { transform: rotate(-1.5deg) translateY(-3px); } 100% { transform: rotate(1.5deg) translateY(-3px); } }
        .mod_ctx_panel { position: fixed; background: rgba(25, 25, 25, 0.96); border-radius: 6px; padding: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.6); z-index: 99999; min-width: 160px; font-size: 12px; color: #fff; }
        .mod_ctx_title { font-weight: bold; margin-bottom: 6px; }
        .mod_ctx_items { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
        .mod_ctx_item { padding: 4px 6px; border-radius: 4px; cursor: pointer; white-space: nowrap; }
        .mod_ctx_item:hover { background: rgba(255,255,255,0.08); }
        .mod_ctx_input { width: 100%; box-sizing: border-box; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.2); color: #fff; padding: 4px 6px; margin-top: 4px; margin-bottom: 4px; }
        .mod_ctx_buttons { display: flex; justify-content: flex-end; gap: 6px; margin-top: 6px; }
        .mod_ctx_button { padding: 3px 8px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); font-size: 11px; }
        .mod_ctx_button:hover { background: rgba(255,255,255,0.12); }
        .mod_ctx_button_primary { border-color: rgba(121,85,248,0.8); background: rgba(121,85,248,0.5); }
        .mod_ctx_error { color: #ff6b6b; font-size: 11px; margin-top: 2px; }
    `;
        document.head.appendChild(style);
    }

    function updateGroupCardColors(card, color) {
        const header = card.querySelector('.cg_group_header');
        const colorBar = card.querySelector('.cg_group_color');
        const light = hexToRgba(color, 0.18);
        const medium = hexToRgba(color, 0.32);

        if (header) header.style.background = `linear-gradient(90deg, ${light}, ${medium})`;
        if (colorBar) colorBar.style.background = `linear-gradient(90deg, ${medium}, ${light})`;
    }

    function renderGroupsUI() {
        const list = document.getElementById('cg_groups_list');
        if (!list) return;

        list.innerHTML = '';

        colorGroups.forEach(group => {
            const card = document.createElement('div');
            card.className = 'cg_group';
            card.dataset.groupId = group.id;

            card.innerHTML = `
            <div class="cg_group_header">
                <div class="cg_group_handle" title="Drag to reorder">⋮⋮</div>
                <div class="cg_group_title">${group.name}</div>
                <div class="cg_group_menu" title="Group options">⋮</div>
            </div>
            <div class="cg_group_players"></div>
            <div class="cg_group_color">
                <span>Colour:</span>
                <input type="color" value="${group.color}">
                <span class="cg_group_color_value">${group.color}</span>
            </div>
        `;

            const playersContainer = card.querySelector('.cg_group_players');
            group.players.forEach(playerName => {
                const row = document.createElement('div');
                row.className = 'cg_player_row';
                row.dataset.playerName = playerName;

                row.innerHTML = `
                <div class="cg_player_name">${playerName}</div>
                <div class="cg_player_menu" title="Manage player">⋮</div>
            `;

                playersContainer.appendChild(row);
            });

            updateGroupCardColors(card, group.color);
            list.appendChild(card);
        });

        const addCard = document.createElement('div');
        addCard.className = 'cg_group cg_group_add';
        addCard.innerHTML = `
        <div class="cg_group_add_inner">
            <div class="cg_group_add_plus">+</div>
            <div>Add new group</div>
        </div>
    `;
        list.appendChild(addCard);

        attachGroupEvents();
        updateStorageHintUI();
    }

    function attachGroupEvents() {
        const list = document.getElementById('cg_groups_list');
        if (!list) return;

        const addCard = list.querySelector('.cg_group_add');
        if (addCard) {
            addCard.addEventListener('click', (e) => {
                e.stopPropagation();
                addGroup('New Group', '#ff0000');
            });
        }

        list.querySelectorAll('.cg_group').forEach(card => {
            const groupId = card.dataset.groupId;
            if (!groupId) return;

            const handle = card.querySelector('.cg_group_handle');
            const titleEl = card.querySelector('.cg_group_title');
            const menuEl = card.querySelector('.cg_group_menu');
            const colorInput = card.querySelector('input[type="color"]');
            const colorValue = card.querySelector('.cg_group_color_value');

            let dragging = false;
            let dragOffsetX = 0;
            let dragOffsetY = 0;
            let placeholder = null;
            let startIndex = colorGroups.findIndex(g => g.id === groupId);

            function onMouseMove(e) {
                if (!dragging) return;
                const x = e.clientX - dragOffsetX;
                const y = e.clientY - dragOffsetY;
                card.style.left = x + 'px';
                card.style.top = y + 'px';
            }

            function onMouseUp(e) {
                if (!dragging) return;
                dragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const slots = colorGroups.length;
                const listRect = list.getBoundingClientRect();
                let targetIndex = startIndex;

                if (slots > 0) {
                    let relX = e.clientX - listRect.left;
                    if (relX < 0) relX = 0;
                    if (relX > listRect.width) relX = listRect.width - 1;
                    const slotWidth = listRect.width / slots;
                    targetIndex = Math.floor(relX / slotWidth);
                    if (targetIndex < 0) targetIndex = 0;
                    if (targetIndex > slots - 1) targetIndex = slots - 1;
                }

                if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                placeholder = null;

                if (card.parentNode) card.parentNode.removeChild(card);

                if (targetIndex !== startIndex) reorderGroupsToIndex(groupId, targetIndex);
                else renderGroupsUI();
            }

            function startDrag(e) {
                e.preventDefault();
                e.stopPropagation();
                if (dragging) return;
                dragging = true;
                startIndex = colorGroups.findIndex(g => g.id === groupId);

                const rect = card.getBoundingClientRect();

                placeholder = document.createElement('div');
                placeholder.className = 'cg_group_placeholder';
                list.insertBefore(placeholder, card.nextSibling);

                card.classList.add('cg_group_dragging');
                card.style.position = 'absolute';
                card.style.width = rect.width + 'px';
                card.style.height = rect.height + 'px';
                card.style.left = rect.left + 'px';
                card.style.top = rect.top + 'px';
                card.style.pointerEvents = 'none';
                card.style.zIndex = '100000';

                document.body.appendChild(card);

                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }

            if (handle) handle.addEventListener('mousedown', startDrag);

            if (titleEl) {
                titleEl.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    openPanel(titleEl, panel => {
                        const g = colorGroups.find(g => g.id === groupId);
                        const currentName = g ? g.name : '';

                        panel.innerHTML = `
                        <div class="mod_ctx_title">Rename group</div>
                        <input class="mod_ctx_input" type="text" value="${currentName}">
                        <div class="mod_ctx_buttons">
                            <div class="mod_ctx_button mod_ctx_button_primary">Save</div>
                            <div class="mod_ctx_button">Cancel</div>
                        </div>
                    `;

                        const input = panel.querySelector('.mod_ctx_input');
                        const btnSave = panel.querySelector('.mod_ctx_button_primary');
                        const btnCancel = panel.querySelectorAll('.mod_ctx_button')[1];

                        btnSave.addEventListener('click', () => {
                            const value = input.value.trim();
                            if (value) renameGroup(groupId, value);
                            closePanel();
                        });

                        btnCancel.addEventListener('click', () => closePanel());

                        input.focus();
                        input.select();
                    });
                });
            }

            if (menuEl) {
                menuEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPanel(menuEl, panel => {
                        const g = colorGroups.find(g => g.id === groupId);
                        panel.innerHTML = `
                        <div class="mod_ctx_title">Group: ${g ? g.name : ''}</div>
                        <div class="mod_ctx_items">
                            <div class="mod_ctx_item" data-action="add">Add player</div>
                            <div class="mod_ctx_item" data-action="rename">Rename group</div>
                            <div class="mod_ctx_item" data-action="delete" style="color:#ff6b6b;">Delete group</div>
                        </div>
                    `;

                        panel.querySelectorAll('.mod_ctx_item').forEach(item => {
                            item.addEventListener('click', () => {
                                const action = item.dataset.action;
                                closePanel();

                                if (action === 'add') {
                                    openPanel(menuEl, panel2 => {
                                        panel2.innerHTML = `
                                        <div class="mod_ctx_title">Add player</div>
                                        <input class="mod_ctx_input" type="text" placeholder="Player name">
                                        <div class="mod_ctx_error" style="display:none;"></div>
                                        <div class="mod_ctx_buttons">
                                            <div class="mod_ctx_button mod_ctx_button_primary">Add</div>
                                            <div class="mod_ctx_button">Cancel</div>
                                        </div>
                                    `;
                                        const input = panel2.querySelector('.mod_ctx_input');
                                        const errEl = panel2.querySelector('.mod_ctx_error');
                                        const btnAdd = panel2.querySelector('.mod_ctx_button_primary');
                                        const btnCancel = panel2.querySelectorAll('.mod_ctx_button')[1];

                                        btnAdd.addEventListener('click', () => {
                                            errEl.style.display = 'none';
                                            const res = addPlayerToGroup(groupId, input.value);
                                            if (!res.ok) {
                                                errEl.textContent = res.error || 'Error.';
                                                errEl.style.display = 'block';
                                            } else {
                                                closePanel();
                                            }
                                        });

                                        btnCancel.addEventListener('click', () => closePanel());

                                        input.focus();
                                    });
                                } else if (action === 'rename') {
                                    const g2 = colorGroups.find(g => g.id === groupId);
                                    openPanel(menuEl, panel2 => {
                                        panel2.innerHTML = `
                                        <div class="mod_ctx_title">Rename group</div>
                                        <input class="mod_ctx_input" type="text" value="${g2 ? g2.name : ''}">
                                        <div class="mod_ctx_buttons">
                                            <div class="mod_ctx_button mod_ctx_button_primary">Save</div>
                                            <div class="mod_ctx_button">Cancel</div>
                                        </div>
                                    `;
                                        const input = panel2.querySelector('.mod_ctx_input');
                                        const btnSave = panel2.querySelector('.mod_ctx_button_primary');
                                        const btnCancel = panel2.querySelectorAll('.mod_ctx_button')[1];

                                        btnSave.addEventListener('click', () => {
                                            const value = input.value.trim();
                                            if (value) renameGroup(groupId, value);
                                            closePanel();
                                        });

                                        btnCancel.addEventListener('click', () => closePanel());

                                        input.focus();
                                        input.select();
                                    });
                                } else if (action === 'delete') {
                                    openPanel(menuEl, panel2 => {
                                        panel2.innerHTML = `
                                        <div class="mod_ctx_title">Delete group?</div>
                                        <div style="font-size:11px;opacity:0.8;margin-top:2px;">
                                            This will remove the group and all its player assignments.
                                        </div>
                                        <div class="mod_ctx_buttons">
                                            <div class="mod_ctx_button mod_ctx_button_primary" style="background:rgba(255,65,65,0.7);border-color:rgba(255,65,65,0.9);">Delete</div>
                                            <div class="mod_ctx_button">Cancel</div>
                                        </div>
                                    `;
                                        const btnDelete = panel2.querySelector('.mod_ctx_button_primary');
                                        const btnCancel = panel2.querySelectorAll('.mod_ctx_button')[1];

                                        btnDelete.addEventListener('click', () => {
                                            deleteGroup(groupId);
                                            closePanel();
                                        });

                                        btnCancel.addEventListener('click', () => closePanel());
                                    });
                                }
                            });
                        });
                    });
                });
            }

            if (colorInput && colorValue) {
                colorInput.addEventListener('input', () => {
                    const val = colorInput.value;
                    colorValue.textContent = val;
                    updateGroupCardColors(card, val);
                    setGroupColor(groupId, val);
                });
            }

            card.querySelectorAll('.cg_player_row').forEach(row => {
                const pname = row.dataset.playerName;
                const menu = row.querySelector('.cg_player_menu');
                if (!menu || !pname) return;

                menu.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPanel(menu, panel => {
                        panel.innerHTML = `
                        <div class="mod_ctx_title">${pname}</div>
                        <div class="mod_ctx_items">
                            <div class="mod_ctx_item" data-action="move">Move to another group</div>
                            <div class="mod_ctx_item" data-action="remove" style="color:#ff6b6b;">Remove from this group</div>
                        </div>
                    `;

                        panel.querySelectorAll('.mod_ctx_item').forEach(item => {
                            item.addEventListener('click', () => {
                                const action = item.dataset.action;
                                closePanel();

                                if (action === 'move') {
                                    if (colorGroups.length < 2) return;

                                    openPanel(menu, panel2 => {
                                        const itemsHtml = colorGroups
                                            .filter(g => g.id !== groupId)
                                            .map(g => `<div class="mod_ctx_item" data-target="${g.id}">${g.name}</div>`)
                                            .join('');
                                        panel2.innerHTML = `
                                        <div class="mod_ctx_title">Move "${pname}" to:</div>
                                        <div class="mod_ctx_error" style="display:none;"></div>
                                        <div class="mod_ctx_items">
                                            ${itemsHtml || '<div style="font-size:11px;opacity:0.8;">No other groups.</div>'}
                                        </div>
                                    `;
                                        const errEl = panel2.querySelector('.mod_ctx_error');

                                        panel2.querySelectorAll('.mod_ctx_item').forEach(it2 => {
                                            it2.addEventListener('click', () => {
                                                const targetId = it2.dataset.target;
                                                const res = movePlayerToGroup(groupId, targetId, pname);
                                                if (!res.ok) {
                                                    errEl.textContent = res.error || 'Error.';
                                                    errEl.style.display = 'block';
                                                } else {
                                                    closePanel();
                                                }
                                            });
                                        });
                                    });
                                } else if (action === 'remove') {
                                    removePlayerFromGroup(groupId, pname);
                                }
                            });
                        });
                    });
                });
            });
        });
    }

    let recolorModRegistered = false;

    function initRecolorMod() {
        if (recolorModRegistered) return;
        const bonkMods = window.bonkMods;
        if (!bonkMods) return;

        recolorModRegistered = true;
        ensureRecolorStyles();

        window.recolorAPI = {
            getColorForName,
            getGroups: () => JSON.parse(JSON.stringify(colorGroups))
        };

        bonkMods.registerMod({
            id: 'recolor',
            name: 'Re:Color',
            version: '0.0.2',
            author: 'SIoppy',
            description: 'Colour groups for player names. Per-account local storage (guest mode is temporary).',
            devHint: 'Exposes window.recolorAPI.getColorForName(name).'
        });

        bonkMods.registerCategory({
            id: 'recolor_main',
            label: 'Colour Groups',
            order: 50
        });

        bonkMods.addBlock({
            id: 'recolor_groups',
            modId: 'recolor',
            categoryId: 'recolor_main',
            title: 'Colour Groups',
            order: 0,
            render(container) {
                container.innerHTML = `
                <div class="mod_block_sub">
                    Create groups of player names and assign them a colour.
                    Players can only belong to one group at a time.
                </div>
                <div id="recolor_storage_hint" style="margin-top:6px;font-size:11px;"></div>
                <div id="cg_groups_outer">
                    <div id="cg_groups_list"></div>
                </div>
            `;
                renderGroupsUI();
                updateStorageHintUI();
            }
        });

        setTimeout(() => {
            updateAccountStorageKey();
            updateStorageHintUI();
        }, 0);
    }

    if (window.bonkMods) initRecolorMod();
    window.addEventListener('bonkModsReady', initRecolorMod);

    const origFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        const color = getColorForName(String(text || ''));
        if (color) {
            const oldFill = this.fillStyle;
            this.fillStyle = color;
            origFillText.call(this, text, x, y);
            this.fillStyle = oldFill;
        } else {
            origFillText.call(this, text, x, y);
        }
    };

    waitForElement('pretty_top_level', () => {
        waitForElement('pretty_top_name', () => {
            ensureAccountObservers();
            updateAccountStorageKey();
        });
    });
})();