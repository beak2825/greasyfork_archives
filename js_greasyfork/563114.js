// ==UserScript==
// @name         Quick Boilerplates
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Manage and insert boilerplate text with Ctrl+Q shortcut
// @author       yclee126
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563114/Quick%20Boilerplates.user.js
// @updateURL https://update.greasyfork.org/scripts/563114/Quick%20Boilerplates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles ---
    GM_addStyle(`
        #bp-manager-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); z-index: 2147483647; display: none;
            justify-content: center; align-items: center; font-family: system-ui, -apple-system, sans-serif;
            backdrop-filter: blur(2px);
        }
        #bp-manager-container {
            background: #ffffff; width: 480px; max-width: 90vw;
            height: 60vh;
            padding: 24px; border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            display: flex; flex-direction: column; gap: 16px; border: 1px solid #e0e0e0;
            box-sizing: border-box;
        }
        .bp-header { font-size: 1.25rem; font-weight: 700; color: #1a1a1a; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }

        #bp-search, #bp-edit-name, #bp-edit-content {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.2s;
            outline: none;
            box-sizing: border-box;
            font-family: inherit;
        }

        #bp-search:focus, #bp-edit-name:focus, #bp-edit-content:focus {
            border-color: #4a90e2;
        }

        #bp-list {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            border: 1px solid #f0f0f0;
            border-radius: 10px;
            background: #fafafa;
        }

        .bp-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; transition: background 0.1s; }
        .bp-item:hover { background: #eff6ff; }
        .bp-item.bp-selected { background: #e0edff; border-left: 4px solid #4a90e2; padding-left: 12px; }

        .bp-item-info { display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; margin-right: 12px; }
        .bp-item-name { font-weight: 600; color: #333; font-size: 0.95rem; margin-bottom: 2px; }
        .bp-item-preview { font-size: 0.8rem; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .bp-edit-btn { color: #4a90e2; background: none; border: none; padding: 4px 8px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; opacity: 0.6; flex-shrink: 0; }
        .bp-edit-btn:hover { opacity: 1; }

        .bp-editor { display: none; flex-direction: column; gap: 12px; flex: 1; }
        .bp-editor-header { font-size: 1.1rem; font-weight: 600; color: #333; margin-bottom: 4px; }
        .bp-btn-row { display: flex; gap: 10px; justify-content: flex-end; flex-shrink: 0; }

        .bp-btn { cursor: pointer; border-radius: 8px; padding: 10px 18px; font-weight: 600; font-size: 0.9rem; border: 1px solid #ddd; background: #fff; transition: all 0.2s; }
        .bp-btn:hover { background: #f8f8f8; }
        .bp-btn-primary { background: #4a90e2; color: white; border: none; }
        .bp-btn-primary:hover { background: #357abd; }
        .bp-btn-danger { color: #e74c3c; border-color: #fadbd8; }
        .bp-btn-danger:hover { background: #fdf2f2; }

        #bp-edit-content { flex: 1; min-height: 150px; resize: none; }
        .bp-status-msg { font-size: 0.75rem; color: #888; text-align: right; }
        .bp-error-msg { color: #dc3545; font-size: 0.85rem; margin-top: -8px; display: none; }
    `);

    // --- Data Management ---
    let boilerplates = JSON.parse(GM_getValue("bp_data", "[]"));
    let lastFocusedElement = null;
    let editingId = null;
    let selectedIndex = 0;
    let currentFilteredList = [];
    let lastSavedRange = null; // workaround for contentEditable fields (it always inserts at the start without this)

    document.addEventListener('focusin', (e) => {
        if (overlay.contains(e.target)) return;
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
            lastFocusedElement = e.target;
        }
    }, true);

    document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            // Only save if the selection is inside an editable element
            // this won't grab info from <input> element
            if (range.commonAncestorContainer.ownerDocument.activeElement.isContentEditable ||
                range.commonAncestorContainer.ownerDocument.activeElement.tagName === 'TEXTAREA') {
                lastSavedRange = range.cloneRange();
            }
        }
    });

    // --- UI Implementation ---
    const overlay = document.createElement('div');
    overlay.id = 'bp-manager-overlay';
    overlay.innerHTML = `
        <div id="bp-manager-container">
            <div class="bp-header" id="bp-main-header">
                <span>Quick Boilerplates</span>
                <span class="bp-status-msg" id="bp-status">↑↓ Nav • Enter Insert • Esc Close</span>
            </div>
            <input type="text" id="bp-search" placeholder="Search by title..." autocomplete="off">
            <div id="bp-list"></div>

            <div class="bp-btn-row" id="bp-main-actions">
                <button id="bp-add-new" class="bp-btn" style="margin-right:auto">+ New</button>
                <button id="bp-export" class="bp-btn">Export</button>
                <button id="bp-import" class="bp-btn">Import</button>
                <button id="bp-close" class="bp-btn">Close</button>
            </div>

            <div id="bp-editor" class="bp-editor">
                <div class="bp-editor-header" id="bp-editor-title">Edit Boilerplate</div>
                <input type="text" id="bp-edit-name" placeholder="Boilerplate Title">
                <div id="bp-name-error" class="bp-error-msg">Name already exists!</div>
                <textarea id="bp-edit-content" placeholder="Type your boilerplate text here..."></textarea>
                <div class="bp-btn-row">
                    <button id="bp-delete" class="bp-btn bp-btn-danger" style="margin-right:auto">Delete</button>
                    <button id="bp-cancel" class="bp-btn">Cancel</button>
                    <button id="bp-save" class="bp-btn bp-btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const mainHeader = overlay.querySelector('#bp-main-header');
    const searchInput = overlay.querySelector('#bp-search');
    const listContainer = overlay.querySelector('#bp-list');
    const mainActions = overlay.querySelector('#bp-main-actions');
    const editor = overlay.querySelector('#bp-editor');
    const editorTitle = overlay.querySelector('#bp-editor-title');
    const editName = overlay.querySelector('#bp-edit-name');
    const editNameError = overlay.querySelector('#bp-name-error');
    const editContent = overlay.querySelector('#bp-edit-content');

    function saveData() {
        GM_setValue("bp_data", JSON.stringify(boilerplates));
        renderList(searchInput.value);
    }

    function renderList(filter = "") {
        listContainer.innerHTML = "";
        currentFilteredList = boilerplates.filter(b => b.name.toLowerCase().includes(filter.toLowerCase()));

        if (selectedIndex >= currentFilteredList.length) {
            selectedIndex = Math.max(0, currentFilteredList.length - 1);
        }

        if (currentFilteredList.length === 0) {
            listContainer.innerHTML = '<div style="padding:20px;color:#999;text-align:center;">No results found.</div>';
            return;
        }

        currentFilteredList.forEach((bp, index) => {
            const div = document.createElement('div');
            div.className = `bp-item ${index === selectedIndex ? 'bp-selected' : ''}`;

            // Clean up the preview text to remove newlines for display
            const contentPreview = bp.content.replace(/\n/g, ' ').trim();

            div.innerHTML = `
                <div class="bp-item-info">
                    <span class="bp-item-name">${bp.name}</span>
                    <span class="bp-item-preview">${contentPreview || 'No content...'}</span>
                </div>
                <button class="bp-edit-btn">Edit</button>
            `;

            div.addEventListener('mousedown', (e) => {
                if(e.target.classList.contains('bp-edit-btn')) {
                    openEditor(bp);
                    e.stopPropagation();
                } else {
                    insertTextUniversal(bp);
                    closeUI();
                }
            });

            if (index === selectedIndex) {
                setTimeout(() => div.scrollIntoView({ block: 'nearest' }), 0);
            }

            listContainer.appendChild(div);
        });
    }

    function insertTextUniversal(bp) {
        let el = lastFocusedElement || document.activeElement;
        if (!el) return;

        if (el.isContentEditable) {
            const sel = window.getSelection();

            // restore range
            if (lastSavedRange) {
                sel.removeAllRanges();
                sel.addRange(lastSavedRange);
            }

            const success = document.execCommand('insertText', false, bp.content);

            // fallback
            if (!success && lastSavedRange) {
                lastSavedRange.deleteContents();
                lastSavedRange.insertNode(document.createTextNode(bp.content));
            }
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // Standard inputs usually handle .focus() better,
            // but we'll use the cursor position to be safe
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.setRangeText(bp.content, start, end, 'end');
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        GM_setValue("bp_last_used_id", bp.id);
    }

    function toggleEditorView(isEditing) {
        if (isEditing) {
            mainHeader.style.display = 'none';
            searchInput.style.display = 'none';
            listContainer.style.display = 'none';
            mainActions.style.display = 'none';
            editor.style.display = 'flex';
        } else {
            mainHeader.style.display = 'flex';
            searchInput.style.display = 'block';
            listContainer.style.display = 'block';
            mainActions.style.display = 'flex';
            editor.style.display = 'none';
        }
    }

    function openEditor(bp = null) {
        toggleEditorView(true);
        editNameError.style.display = 'none';
        if (bp) {
            editingId = bp.id;
            editorTitle.textContent = "Edit Boilerplate";
            editName.value = bp.name;
            editContent.value = bp.content;
            overlay.querySelector('#bp-delete').style.display = 'block';
        } else {
            editingId = null;
            editorTitle.textContent = "New Boilerplate";
            editName.value = "";
            editContent.value = "";
            overlay.querySelector('#bp-delete').style.display = 'none';
        }
        editName.focus();
    }

    function closeUI() {
        overlay.style.display = 'none';
        toggleEditorView(false);
        searchInput.value = "";
        selectedIndex = 0;
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    overlay.onclick = (e) => {
        if (e.target === overlay) closeUI();
    };

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            const current = document.activeElement;
            if (current && !overlay.contains(current)) lastFocusedElement = current;

            if (overlay.style.display === 'flex') {
                closeUI();
            } else {
                overlay.style.display = 'flex';
                const lastUsedId = GM_getValue("bp_last_used_id", null);
                if (lastUsedId) {
                    const idx = boilerplates.findIndex(b => b.id === lastUsedId);
                    selectedIndex = idx !== -1 ? idx : 0;
                } else {
                    selectedIndex = 0;
                }
                renderList();
                searchInput.focus();
            }
        }

        if (e.key === 'Escape' && overlay.style.display === 'flex') closeUI();
    });

    searchInput.addEventListener('input', (e) => {
        selectedIndex = 0;
        renderList(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (overlay.style.display !== 'flex' || editor.style.display === 'flex') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < currentFilteredList.length - 1) {
                selectedIndex++;
                renderList(searchInput.value);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
                renderList(searchInput.value);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFilteredList[selectedIndex]) {
                insertTextUniversal(currentFilteredList[selectedIndex]);
                closeUI();
            }
        }
    });

    overlay.querySelector('#bp-add-new').onclick = () => openEditor();
    overlay.querySelector('#bp-cancel').onclick = () => toggleEditorView(false);
    overlay.querySelector('#bp-close').onclick = closeUI;

    overlay.querySelector('#bp-save').onclick = () => {
        const name = editName.value.trim();
        const content = editContent.value;
        if (!name) return;

        const isDuplicate = boilerplates.some(b =>
            b.name.toLowerCase() === name.toLowerCase() && b.id !== editingId
        );

        if (isDuplicate) {
            editNameError.style.display = 'block';
            editName.focus();
            return;
        } else {
            editNameError.style.display = 'none';
        }

        if (editingId) {
            const idx = boilerplates.findIndex(b => b.id === editingId);
            boilerplates[idx] = { ...boilerplates[idx], name, content };
        } else {
            boilerplates.push({ id: Date.now(), name, content });
        }
        saveData();
        toggleEditorView(false);
    };

    overlay.querySelector('#bp-delete').onclick = () => {
        boilerplates = boilerplates.filter(b => b.id !== editingId);
        saveData();
        toggleEditorView(false);
    };

    overlay.querySelector('#bp-export').onclick = () => {
        const blob = new Blob([JSON.stringify(boilerplates, null, 2)], {type : 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_boilerplates.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    overlay.querySelector('#bp-import').onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ".json";
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = ev => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (Array.isArray(imported)) {
                        boilerplates = imported;
                        saveData();
                    }
                } catch (err) { console.error("Import failed:", err); }
            };
            reader.readAsText(file);
        };
        input.click();
    };

})();