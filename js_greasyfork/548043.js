// ==UserScript==
// @name         aquagloop's item notes
// @version      31.0
// @description  shows notes on items, locks items too
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @author       aquagloop
// @license      MIT
// @namespace    https://greasyfork.org/users/1476871
// @downloadURL https://update.greasyfork.org/scripts/548043/aquagloop%27s%20item%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/548043/aquagloop%27s%20item%20notes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let noteTooltip;

    function createTooltip() {
        if (document.getElementById('note-custom-tooltip')) return;
        noteTooltip = document.createElement('div');
        noteTooltip.id = 'note-custom-tooltip';
        document.body.appendChild(noteTooltip);
    }

    function addGlobalStyle() {
        GM_addStyle(`
            #note-custom-tooltip {
                position: fixed; display: none; background-color: #111; color: #fff; border: 1px solid #777;
                border-radius: 5px; padding: 8px 12px; font-size: 13px; z-index: 10001; max-width: 350px;
                pointer-events: none; white-space: pre-wrap; word-wrap: break-word;
            }
            #note-admin-panel {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 90%; max-width: 800px; height: 80%; max-height: 700px;
                background: #f2f2f2; border: 2px solid #333; border-radius: 10px;
                z-index: 9999; display: none; box-shadow: 0 0 20px rgba(0,0,0,0.5); color: #333;
            }
            #note-admin-panel-content { display: flex; flex-direction: column; height: 100%; padding: 15px; box-sizing: border-box; }
            #note-admin-close { position: absolute; top: 10px; right: 10px; background: #e0e0e0; border: 1px solid #999; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-weight: bold; }
            #note-admin-panel h2 { margin-top: 0; }
            .note-admin-tabs { border-bottom: 1px solid #ccc; margin-bottom: 10px; }
            .note-admin-tabs button { background: #e0e0e0; border: 1px solid #ccc; border-bottom: none; padding: 10px 15px; cursor: pointer; border-radius: 5px 5px 0 0; }
            .note-admin-tabs button.active { background: #f2f2f2; font-weight: bold; }
            .note-admin-tab-content { display: none; flex-grow: 1; overflow: hidden; flex-direction: column; }
            .note-admin-tab-content.active { display: flex; }
            .note-admin-controls { margin-bottom: 10px; display: flex; gap: 10px; }
            .note-admin-controls input { padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
            .note-admin-controls button { padding: 5px 10px; background: #ddd; border: 1px solid #aaa; border-radius: 3px; cursor: pointer; }
            #notes-list-container, #import-preview-container { flex-grow: 1; overflow-y: auto; border: 1px solid #ccc; background: #fff; padding: 5px; }
            .note-list-item, .import-list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee; }
            .import-list-item { gap: 10px; }
            .note-item-info { flex-grow: 1; }
            .note-item-name { font-weight: bold; }
            .note-item-stats { font-size: 0.9em; color: #666; }
            .note-item-note { margin-top: 4px; white-space: pre-wrap; word-break: break-word; }
            .note-item-actions button { margin-left: 5px; }
            .note-colour-swatch { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; vertical-align: middle; margin-right: 5px; }
            #note-edit-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10002; display: flex; align-items: center; justify-content: center; }
            #note-edit-modal { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 400px; color: #333; }
            #note-edit-modal h3 { margin-top: 0; }
            #note-edit-modal textarea { width: 100%; height: 80px; margin-bottom: 10px; box-sizing: border-box; padding: 5px; }
            #note-edit-modal .note-modal-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
            #note-edit-modal .note-modal-row label { flex-shrink: 0; }
            #note-edit-modal .note-modal-row input[type="text"] { flex-grow: 1; }
            #note-edit-modal .note-modal-actions { text-align: right; margin-top: 20px; }
            #note-edit-modal .note-modal-actions button + button { margin-left: 10px; }
            .torn-lock-icon { margin-left: 4px; cursor: help; user-select: none; }
        `);
    }

    function createAdminPanelHTML() {
        const panel = document.createElement('div');
        panel.id = 'note-admin-panel';
        panel.innerHTML = `
            <div id="note-admin-panel-content">
                <button id="note-admin-close" title="Close Panel">&times;</button>
                <h2>aquagloop's item notes</h2>
                <div class="note-admin-tabs">
                    <button class="tab-link active" data-tab="manage">Manage Notes</button>
                    <button class="tab-link" data-tab="import-export">Import/Export</button>
                </div>
                <div id="manage-tab" class="note-admin-tab-content active">
                    <div class="note-admin-controls">
                        <input type="text" id="filter-text" placeholder="Filter by name or note...">
                        <input type="text" id="filter-color" placeholder="Filter by color (e.g., red)...">
                        <button id="delete-filtered-btn" title="Delete all notes currently visible in the list below">Delete Filtered</button>
                    </div>
                    <div id="notes-list-container">Loading notes...</div>
                </div>
                <div id="import-export-tab" class="note-admin-tab-content">
                    <h3>Export</h3>
                    <button id="export-json-btn">Export All Notes as JSON</button>
                    <hr style="width:100%; margin: 15px 0;">
                    <h3>Import from JSON</h3>
                    <input type="file" id="import-file-input" accept=".json,application/json">
                    <p><b>Import Strategy</b> (if note for an item already exists):</p>
                    <div>
                        <input type="radio" name="import-strategy" value="skip" id="strat-skip"><label for="strat-skip"> Skip item</label><br>
                        <input type="radio" name="import-strategy" value="overwrite" id="strat-overwrite" checked><label for="strat-overwrite"> Overwrite existing note</label><br>
                        <input type="radio" name="import-strategy" value="add" id="strat-add"><label for="strat-add"> Add to existing note (new | old)</label>
                    </div>
                    <div id="import-preview-container" style="margin-top:10px;">Select a file to preview notes for import.</div>
                    <button id="import-selected-btn" style="display:none; margin-top:10px;">Import Selected Notes</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        addAdminPanelEventListeners();
    }

    function makeNoteButton() {
        const btn = document.createElement('button');
        btn.textContent = '📝';
        btn.title = 'Click to add/edit note, colour & lock status';
        btn.style.cssText = `background: none; border: none; padding: 0; margin-left: 4px; cursor: pointer; font-size: 90%; display: inline-block; vertical-align: middle;`;
        btn.classList.add('torn-note-btn');
        return btn;
    }

    function makecolourBox(colour) {
        const box = document.createElement('span');
        box.classList.add('torn-colour-box');
        box.style.cssText = `display: ${colour ? 'inline-block' : 'none'}; width: 10px; height: 10px; margin-left: 4px; vertical-align: middle; background: ${colour || 'transparent'}; border: 1px solid #000;`;
        return box;
    }

    function makeLockIcon(locked) {
        const icon = document.createElement('span');
        icon.textContent = '🔒';
        icon.classList.add('torn-lock-icon');
        icon.title = 'This item is locked. It cannot be sold, traded, or trashed.';
        icon.style.cssText = `display: ${locked ? 'inline-block' : 'none'}; vertical-align: middle;`;
        return icon;
    }

    function loadData(key) {
        const raw = GM_getValue(key, '');
        if (!raw) return { note: '', colour: '', locked: false };
        try {
            const parsed = JSON.parse(raw);
            return {
                note: parsed.note || '',
                colour: parsed.colour || '',
                locked: parsed.locked || false
            };
        } catch {
            return { note: raw, colour: '', locked: false };
        }
    }

    function saveData(key, data) {
        GM_setValue(key, JSON.stringify(data));
    }

    function generateSharedKey(name, stats, bonus) {
        return `shared|${name.trim()}|${stats}|${bonus}`;
    }

    function parseKey(key) {
        const parts = key.split('|');
        if (parts.length < 3) return null;
        const name = parts[1];
        const rawStats = parts[2] || 'nostats';
        const bonus = parts[3] || '';
        let formattedStats = '';
        if (rawStats !== 'nostats') {
            const statNumbers = rawStats.split('_');
            if (statNumbers.length === 2) formattedStats = `Dmg: ${statNumbers[0]}, Acc: ${statNumbers[1]}`;
            else if (statNumbers.length === 1) formattedStats = `Def: ${statNumbers[0]}`;
            else formattedStats = rawStats;
        }
        if (bonus) {
            formattedStats += (formattedStats ? ', ' : '') + bonus.replace(/; /g, ', ');
        }
        if (!formattedStats) {
            formattedStats = 'No Stats';
        }
        return { name, stats: formattedStats, rawStats, bonus };
    }

    function showEditModal(key, label, onSave) {
        const currentData = loadData(key);
        const overlay = document.createElement('div');
        overlay.id = 'note-edit-modal-overlay';
        overlay.innerHTML = `
            <div id="note-edit-modal">
                <h3>Edit Note for ${label}</h3>
                <textarea id="note-modal-text" placeholder="Enter note...">${currentData.note}</textarea>
                <div class="note-modal-row">
                    <label for="note-modal-colour">Colour:</label>
                    <input type="text" id="note-modal-colour" value="${currentData.colour}" placeholder="e.g., red, #FF0000">
                </div>
                 <div class="note-modal-row">
                    <label for="note-modal-lock">Lock Item:</label>
                    <input type="checkbox" id="note-modal-lock" ${currentData.locked ? 'checked' : ''}>
                    <small>(Prevents selling, trading, trashing)</small>
                </div>
                <div class="note-modal-actions">
                    <button id="note-modal-cancel">Cancel</button>
                    <button id="note-modal-save">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const modal = document.getElementById('note-edit-modal');
        modal.addEventListener('click', e => e.stopPropagation());
        const close = () => document.body.removeChild(overlay);
        document.getElementById('note-modal-save').addEventListener('click', () => {
            const newData = {
                note: document.getElementById('note-modal-text').value.trim(),
                colour: document.getElementById('note-modal-colour').value.trim().toLowerCase(),
                locked: document.getElementById('note-modal-lock').checked
            };
            saveData(key, newData);
            onSave(newData);
            close();
        });
        document.getElementById('note-modal-cancel').addEventListener('click', close);
        overlay.addEventListener('click', close);
    }

    function setupItem(li, nameEl, controlContainer = nameEl) {
        if (li.querySelector('.torn-note-btn')) {
            const key = li.dataset.noteKey;
            if (key) {
                const data = loadData(key);
                applyLock(li, data.locked);
            }
            return;
        }
        const name = nameEl.textContent.trim();
        const nums = li.innerText.match(/\d+\.\d+/g) || [];
        const stats = nums.slice(0, 2).join('_') || 'nostats';
        let bonusStr = '';
        const bonusElements = li.querySelectorAll('i[class*="bonus-attachment-"][title]');
        const bonuses = [];
        bonusElements.forEach(bonusEl => {
            const title = bonusEl.title;
            if (title) {
                const nameMatch = title.match(/<b>(.*?)<\/b>/);
                const percentMatch = title.match(/(\d+%)/);
                if (nameMatch && nameMatch[1] && percentMatch && percentMatch[1]) {
                    bonuses.push(`${nameMatch[1]}, ${percentMatch[1]}`);
                }
            }
        });
        bonusStr = bonuses.sort().join('; ');
        const key = generateSharedKey(name, stats, bonusStr);
        const data = loadData(key);
        const btn = makeNoteButton();
        const colourBox = makecolourBox(data.colour);
        const lockIcon = makeLockIcon(data.locked);
        controlContainer.appendChild(btn);
        controlContainer.appendChild(colourBox);
        controlContainer.appendChild(lockIcon);
        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            showEditModal(key, `"${name}"`, (newData) => {
                colourBox.style.background = newData.colour || 'transparent';
                colourBox.style.display = newData.colour ? 'inline-block' : 'none';
                lockIcon.style.display = newData.locked ? 'inline-block' : 'none';
                applyLock(li, newData.locked);
            });
        });
        li.dataset.noteKey = key;
        if (!li.dataset.noteListenersAdded) {
            li.addEventListener('mouseenter', e => {
                const noteData = loadData(e.currentTarget.dataset.noteKey);
                if (noteData.note) {
                    noteTooltip.textContent = noteData.note;
                    noteTooltip.style.display = 'block';
                }
            });
            li.addEventListener('mousemove', e => {
                noteTooltip.style.left = `${e.clientX + 15}px`;
                noteTooltip.style.top = `${e.clientY + 15}px`;
            });
            li.addEventListener('mouseleave', () => {
                noteTooltip.style.display = 'none';
            });
            li.dataset.noteListenersAdded = 'true';
        }
        applyLock(li, data.locked);
    }

    function applyLock(itemElement, isLocked) {
        const trashActionLi = itemElement.querySelector('li.dump');
        const sendActionLi = itemElement.querySelector('li.send');
        const addToAction = itemElement.querySelector('.add-item-wrap, .add-to-bazaar, .add-to-market');
        const armoryCheckbox = itemElement.querySelector('.choice-container');
        const bazaarInputs = itemElement.querySelector('.amount-main-wrap');
        if (isLocked) {
            if (trashActionLi) trashActionLi.style.display = 'none';
            if (sendActionLi) sendActionLi.style.display = 'none';
            if (addToAction) addToAction.style.display = 'none';
            if (armoryCheckbox) armoryCheckbox.style.display = 'none';
            if (bazaarInputs) bazaarInputs.style.display = 'none';
        } else {
            if (trashActionLi) trashActionLi.style.display = '';
            if (sendActionLi) sendActionLi.style.display = '';
            if (addToAction) addToAction.style.display = '';
            if (armoryCheckbox) armoryCheckbox.style.display = '';
            if (bazaarInputs) bazaarInputs.style.display = '';
        }
    }

    function processInventory() {
        document.querySelectorAll('li[data-item]').forEach(li => {
            const nameEl = li.querySelector('.name');
            if (nameEl) setupItem(li, nameEl);
        });
    }

    function processArmory() {
        document.querySelectorAll('ul.item-list > li, ul[class*="items-list"] > li[class*="item"]').forEach(li => {
            const nameEl = li.querySelector('.name, .item-name__');
            if (nameEl) setupItem(li, nameEl);
        });
    }

    function processTradeAdd() {
        document.querySelectorAll('li.clearfix[data-group="child"], .item___jLJcf').forEach(li => {
            const nameEl = li.querySelector('.t-overflow, .desc___VJSNQ span b');
            if (nameEl) setupItem(li, nameEl, nameEl.parentElement);
        });
    }

    function processDisplayCase() {
        document.querySelectorAll('ul.items-cont > li').forEach(li => {
            const nameEl = li.querySelector('span.name');
            if (nameEl) setupItem(li, nameEl);
        });
    }

    function processMarket() {
        document.querySelectorAll('.itemRow___Mf7bO:not(.note-processed)').forEach(itemRow => {
            const nameEl = itemRow.querySelector('.name___XmQWk');
            const controlContainer = itemRow.querySelector('.title___Xo6Pm');
            if (nameEl && controlContainer && !itemRow.querySelector('.notAccessible___kPVuG')) {
                setupItemForMarket(itemRow, nameEl, controlContainer);
            }
            itemRow.classList.add('note-processed');
        });
    }

    function setupItemForMarket(itemRow, nameEl, controlContainer) {
        if (itemRow.querySelector('.torn-note-btn')) {
            const key = itemRow.dataset.noteKey;
            if (key) applyMarketLock(itemRow, loadData(key).locked);
            return;
        }
        const name = nameEl.textContent.trim();
        const statEls = itemRow.querySelectorAll('.property___cIJYB');
        const statNumbers = Array.from(statEls).map(el => el.textContent.trim());
        const stats = statNumbers.join('_') || 'nostats';
        let bonusStr = '';
        const bonusIcons = itemRow.querySelectorAll('i[class*="bonus-attachment-"]:not([class*="blank"])');
        const bonuses = [];
        bonusIcons.forEach(icon => {
            let fullBonusText = '';
            const reactPropsKey = Object.keys(icon).find(key => key.startsWith('__reactProps$'));
            if (reactPropsKey) {
                const props = icon[reactPropsKey];
                if (props && props.children && props.children.props && typeof props.children.props.tooltip === 'string') {
                    fullBonusText = props.children.props.tooltip;
                }
            }
            if (fullBonusText) {
                const nameMatch = fullBonusText.match(/<b>(.*?)<\/b>/);
                const percentMatch = fullBonusText.match(/(\d+%)/);
                if (nameMatch && nameMatch[1] && percentMatch && percentMatch[1]) {
                    bonuses.push(`${nameMatch[1]}, ${percentMatch[1]}`);
                }
            }
        });
        bonusStr = bonuses.sort().join('; ');
        const key = generateSharedKey(name, stats, bonusStr);
        const data = loadData(key);
        const btn = makeNoteButton();
        const colourBox = makecolourBox(data.colour);
        const lockIcon = makeLockIcon(data.locked);
        controlContainer.appendChild(btn);
        controlContainer.appendChild(colourBox);
        controlContainer.appendChild(lockIcon);
        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            showEditModal(key, `"${name}"`, (newData) => {
                colourBox.style.background = newData.colour || 'transparent';
                colourBox.style.display = newData.colour ? 'inline-block' : 'none';
                lockIcon.style.display = newData.locked ? 'inline-block' : 'none';
                applyMarketLock(itemRow, newData.locked);
            });
        });
        itemRow.dataset.noteKey = key;
        if (!itemRow.dataset.noteListenersAdded) {
            itemRow.addEventListener('mouseenter', e => {
                const noteData = loadData(e.currentTarget.dataset.noteKey);
                if (noteData.note) {
                    noteTooltip.textContent = noteData.note;
                    noteTooltip.style.display = 'block';
                }
            });
            itemRow.addEventListener('mousemove', e => {
                noteTooltip.style.left = `${e.clientX + 15}px`;
                noteTooltip.style.top = `${e.clientY + 15}px`;
            });
            itemRow.addEventListener('mouseleave', () => {
                noteTooltip.style.display = 'none';
            });
            itemRow.dataset.noteListenersAdded = 'true';
        }
        applyMarketLock(itemRow, data.locked);
    }

    function applyMarketLock(itemRow, isLocked) {
        const qtyWrapper = itemRow.querySelector('.amountInputWrapper___USwSs');
        const priceWrapper = itemRow.querySelector('.priceInputWrapper___TBFHl');
        const checkboxWrapper = itemRow.querySelector('.checkboxWrapper___YnT5u');
        const priceInfo = itemRow.querySelector('.price___nNUAv');
        const sellButton = itemRow.querySelector('.buy-link___b3OKj[role="button"]');
        if (isLocked) {
            if (qtyWrapper) qtyWrapper.style.display = 'none';
            if (priceWrapper) priceWrapper.style.display = 'none';
            if (checkboxWrapper) checkboxWrapper.style.display = 'none';
            if (priceInfo) priceInfo.style.display = 'none';
            if (sellButton) sellButton.style.display = 'none';
        } else {
            if (qtyWrapper) qtyWrapper.style.display = '';
            if (priceWrapper) priceWrapper.style.display = '';
            if (checkboxWrapper) checkboxWrapper.style.display = '';
            if (priceInfo) priceInfo.style.display = '';
            if (sellButton) sellButton.style.display = '';
        }
    }

    let allNotesCache = [],
        importPreviewCache = [];
    async function openAdminPanel() {
        const panel = document.getElementById('note-admin-panel');
        if (!panel) createAdminPanelHTML();
        document.getElementById('note-admin-panel').style.display = 'block';
        await populateNotesList();
    }

    function closeAdminPanel() {
        document.getElementById('note-admin-panel').style.display = 'none';
    }
    async function getAllNotes() {
        const keys = await GM_listValues();
        const noteKeys = keys.filter(k => k.startsWith('shared|'));
        const notes = [];
        for (const key of noteKeys) {
            const parsedKey = parseKey(key);
            if (parsedKey) {
                const rawData = await GM_getValue(key, '{}');
                let dataObj = {};
                try {
                    dataObj = JSON.parse(rawData);
                } catch {
                    dataObj = { note: rawData, colour: '', locked: false };
                }
                notes.push({ key, ...parsedKey, data: dataObj });
            }
        }
        return notes.sort((a, b) => a.name.localeCompare(b.name));
    }
    async function populateNotesList() {
        const container = document.getElementById('notes-list-container');
        if (!container) return;
        container.innerHTML = 'Loading notes...';
        allNotesCache = await getAllNotes();
        const textFilter = document.getElementById('filter-text').value.toLowerCase();
        const colorFilter = document.getElementById('filter-color').value.toLowerCase();
        const filteredNotes = allNotesCache.filter(n => {
            const textMatch = !textFilter || n.name.toLowerCase().includes(textFilter) || (n.data.note && n.data.note.toLowerCase().includes(textFilter));
            const colorMatch = !colorFilter || (n.data.colour && n.data.colour.toLowerCase().includes(colorFilter));
            return textMatch && colorMatch;
        });
        if (filteredNotes.length === 0) {
            container.innerHTML = 'No notes found, or none match your filter.';
            return;
        }
        container.innerHTML = '';
        filteredNotes.forEach(note => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'note-list-item';
            itemDiv.dataset.key = note.key;
            itemDiv.innerHTML = `<div class="note-item-info"><div class="note-item-name">${note.data.locked ? '🔒 ' : ''}<span class="note-colour-swatch" style="background:${note.data.colour || 'transparent'};"></span>${note.name}</div><div class="note-item-stats">${note.stats}</div><div class="note-item-note">${note.data.note || '<i>No note text.</i>'}</div></div><div class="note-item-actions"><button class="delete-note-btn">Delete</button></div>`;
            container.appendChild(itemDiv);
        });
    }
    async function handleExport() {
        const notes = await getAllNotes();
        if (notes.length === 0) {
            alert('No notes to export.');
            return;
        }
        const exportData = notes.map(n => ({ key: n.key, data: n.data }));
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `torn_notes_export_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data)) throw new Error("JSON is not an array.");
                importPreviewCache = data;
                populateImportPreview();
            } catch (err) {
                alert(`Error reading JSON file: ${err.message}`);
            }
        };
        reader.readAsText(file);
    }

    function populateImportPreview() {
        const container = document.getElementById('import-preview-container'),
            btn = document.getElementById('import-selected-btn');
        if (importPreviewCache.length === 0) {
            container.innerHTML = 'The selected file contains no notes.';
            btn.style.display = 'none';
            return;
        }
        container.innerHTML = `<label><input type="checkbox" id="import-select-all"> <b>Select All</b></label><hr>`;
        importPreviewCache.forEach((item, index) => {
            const parsedKey = parseKey(item.key);
            if (!item.key || !item.data || !parsedKey) return;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'import-list-item';
            itemDiv.innerHTML = `<input type="checkbox" class="import-checkbox" data-index="${index}" checked><div class="note-item-info"><div class="note-item-name">${item.data.locked ? '🔒 ' : ''}<span class="note-colour-swatch" style="background:${item.data.colour || 'transparent'};"></span>${parsedKey.name}</div><div class="note-item-stats">${parsedKey.stats}</div><div class="note-item-note">${item.data.note || '<i>No note text.</i>'}</div></div>`;
            container.appendChild(itemDiv);
        });
        document.getElementById('import-select-all').addEventListener('change', e => document.querySelectorAll('.import-checkbox').forEach(cb => cb.checked = e.target.checked));
        btn.style.display = 'block';
    }
    async function handleImport() {
        const checked = document.querySelectorAll('.import-checkbox:checked');
        if (checked.length === 0) {
            alert('No notes selected for import.');
            return;
        }
        const strategy = document.querySelector('input[name="import-strategy"]:checked').value;
        let imported = 0,
            skipped = 0;
        for (const cb of checked) {
            const item = importPreviewCache[parseInt(cb.dataset.index, 10)];
            const existingRaw = await GM_getValue(item.key, null);
            if (strategy === 'skip' && existingRaw) {
                skipped++;
                continue;
            }
            let finalData = item.data;
            if (strategy === 'add' && existingRaw) {
                const existingData = JSON.parse(existingRaw);
                finalData = {
                    note: `${item.data.note || ''} | ${existingData.note || ''}`.trim(),
                    colour: item.data.colour || existingData.colour,
                    locked: item.data.locked || existingData.locked
                };
            }
            await GM_setValue(item.key, JSON.stringify(finalData));
            imported++;
        }
        alert(`Import Complete!\n- ${imported} notes imported.\n- ${skipped} notes skipped.\n\nPlease refresh game pages to see changes.`);
        await populateNotesList();
        document.querySelector('.tab-link[data-tab="manage"]').click();
    }

    function addAdminPanelEventListeners() {
        document.getElementById('note-admin-close').addEventListener('click', closeAdminPanel);
        document.querySelectorAll('.tab-link').forEach(button => button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            document.querySelectorAll('.tab-link, .note-admin-tab-content').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        }));
        document.getElementById('filter-text').addEventListener('input', populateNotesList);
        document.getElementById('filter-color').addEventListener('input', populateNotesList);
        document.getElementById('notes-list-container').addEventListener('click', e => {
            if (e.target.classList.contains('delete-note-btn')) {
                const itemDiv = e.target.closest('.note-list-item');
                const key = itemDiv.dataset.key;
                GM_deleteValue(key);
                itemDiv.remove();
            }
        });
        document.getElementById('delete-filtered-btn').addEventListener('click', () => {
            const items = document.querySelectorAll('#notes-list-container .note-list-item');
            if (items.length === 0) return;
            if (!confirm(`Are you sure you want to delete the ${items.length} notes currently visible?`)) return;
            items.forEach(item => GM_deleteValue(item.dataset.key));
            populateNotesList();
            alert(`${items.length} notes deleted.`);
        });
        document.getElementById('export-json-btn').addEventListener('click', handleExport);
        document.getElementById('import-file-input').addEventListener('change', handleFileSelect);
        document.getElementById('import-selected-btn').addEventListener('click', handleImport);
    }

    function initAll() {
        processInventory();
        processArmory();
        processTradeAdd();
        processDisplayCase();
        processMarket();
    }

    GM_registerMenuCommand('⚙️ Manage Item Notes', openAdminPanel);

    addGlobalStyle();
    createTooltip();
    initAll();
    new MutationObserver(initAll).observe(document.body, { childList: true, subtree: true });

})();