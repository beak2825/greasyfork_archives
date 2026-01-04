// ==UserScript==
// @name         Google AI Studio - Enhanced Actions
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds multi-select/delete (Checkbox, Ctrl+A, Shift+Click, Ctrl+Click, Delete key) and "Delete Thoughts" (Shift+F2) to Chat.
// @author       User
// @match        https://aistudio.google.com/prompts/*
// @match        https://aistudio.google.com/library
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553006/Google%20AI%20Studio%20-%20Enhanced%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/553006/Google%20AI%20Studio%20-%20Enhanced%20Actions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Constants ---
    const C = {
        CLASSES: {
            CHAT_CHECKBOX: 'gm-chat-select-checkbox',
            CHAT_SELECTED: 'gm-chat-selected',
            CHAT_DELETE_BEFORE: 'gm-chat-delete-before-item',
            LIB_CHECKBOX: 'gm-lib-select-checkbox',
            LIB_HEADER_CHECKBOX: 'gm-lib-header-select-checkbox',
            LIB_SELECTED: 'gm-lib-selected',
            LIB_CHECKBOX_CELL: 'gm-lib-checkbox-cell',
            LIB_CHECKBOX_HEADER: 'gm-lib-checkbox-header',
            ENABLED: 'enabled'
        },
        IDS: {
            CHAT_MULTI_DELETE_BTN: 'gm-chat-multi-delete-button',
            LIB_MULTI_DELETE_BTN: 'gm-lib-multi-delete-button'
        },
        SELECTORS: {
            CHAT_TURN: 'ms-chat-turn',
            CHAT_SESSION: 'ms-chat-session',
            CHAT_TURN_CONTAINER: '.chat-turn-container',
            CHAT_MORE_OPTIONS_BTN: 'ms-chat-turn-options button.mat-mdc-menu-trigger',
            CHAT_MORE_ACTIONS_BTN: 'button[aria-label="View more actions"]',
            MENU_PANEL: 'div.cdk-overlay-container div.mat-mdc-menu-panel',
            MENU_ITEM: 'button.mat-mdc-menu-item',
            OVERLAY_BACKDROP: 'div.cdk-overlay-backdrop',
            LIBRARY_TABLE: 'ms-library-table table.mat-mdc-table',
            LIBRARY_HEADER_ROW: 'thead tr.mat-mdc-header-row',
            LIBRARY_ROW: 'tbody tr.mat-mdc-row',
            LIBRARY_ACTIONS_WRAPPER: 'div.lib-header div.actions-wrapper',
            LIBRARY_MORE_OPTIONS_BTN: 'button[aria-label="Show overflow"]',
            DIALOG_CONTAINER: 'mat-dialog-container',
            DIALOG_ACTIONS: 'mat-dialog-actions button'
        },
        TIMEOUTS: {
            ELEMENT_WAIT: 5000,
            ELEMENT_DISAPPEAR: 5000,
            MENU_APPEAR_DELAY: 150
        }
    };

    // --- State Variables ---
    let selectedChatTurns = new Set();
    let selectedLibraryItems = new Set();
    let isDeleting = false;
    let lastClickedTurn = null;

    // --- Styles ---
    GM_addStyle(`
        ms-chat-turn .chat-turn-container { position: relative; padding-left: 35px !important; }
        .${C.CLASSES.CHAT_CHECKBOX} { position: absolute; left: 8px; top: 12px; z-index: 10; cursor: pointer; transform: scale(1.2); }
        ms-chat-turn.${C.CLASSES.CHAT_SELECTED} > div { background-color: rgba(0, 100, 255, 0.1) !important; border: 1px solid rgba(0, 100, 255, 0.3); border-radius: 8px; }
        #${C.IDS.CHAT_MULTI_DELETE_BTN} { margin-left: 10px; background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 14px; opacity: 0.5; pointer-events: none; transition: opacity 0.2s; }
        #${C.IDS.CHAT_MULTI_DELETE_BTN}.${C.CLASSES.ENABLED} { opacity: 1; pointer-events: auto; cursor: pointer; }
        #${C.IDS.CHAT_MULTI_DELETE_BTN}:hover.${C.CLASSES.ENABLED} { background-color: #c82333; }
        #${C.IDS.CHAT_MULTI_DELETE_BTN}:disabled { background-color: #a0a0a0; cursor: not-allowed; }
        .${C.CLASSES.CHAT_DELETE_BEFORE} .mat-mdc-menu-item-text { display: flex; align-items: center; }
        .${C.CLASSES.CHAT_DELETE_BEFORE} .delete-before-marker { margin-right: 8px; font-weight: bold; }
        th.${C.CLASSES.LIB_CHECKBOX_HEADER}, td.${C.CLASSES.LIB_CHECKBOX_CELL} { width: 40px !important; padding: 0 8px 0 16px !important; }
        tr.${C.CLASSES.LIB_SELECTED} { background-color: rgba(0, 100, 255, 0.08) !important; }
        #${C.IDS.LIB_MULTI_DELETE_BTN} { margin-left: 8px; background-color: #dc3545; color: white; border: none; padding: 0 12px; height: 36px; line-height: 36px; border-radius: 18px; font-weight: 500; opacity: 0.5; pointer-events: none; transition: opacity 0.2s; display: inline-flex; align-items: center; }
        #${C.IDS.LIB_MULTI_DELETE_BTN} .material-symbols-outlined { font-size: 18px; margin-right: 6px; }
        #${C.IDS.LIB_MULTI_DELETE_BTN}.${C.CLASSES.ENABLED} { opacity: 1; pointer-events: auto; cursor: pointer; }
        #${C.IDS.LIB_MULTI_DELETE_BTN}:hover.${C.CLASSES.ENABLED} { background-color: #c82333; }
        #${C.IDS.LIB_MULTI_DELETE_BTN}:disabled { background-color: #cccccc; cursor: not-allowed; opacity: 0.6; }
    `);

    // --- Utility Functions ---
    function robustClick(element) {
        if (!element) return;
        const ownerDoc = element.ownerDocument;
        const ownerWindow = ownerDoc?.defaultView;
        if (!ownerWindow) return;
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type =>
            element.dispatchEvent(new ownerWindow.MouseEvent(type, { bubbles: true, cancelable: true, view: ownerWindow }))
        );
    }

    function waitForElement(selector, timeout = C.TIMEOUTS.ELEMENT_WAIT) {
        return new Promise((resolve, reject) => {
            let el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element "${selector}" not found.`));
            }, timeout);
        });
    }

    function waitForElementToDisappear(element, timeout = C.TIMEOUTS.ELEMENT_DISAPPEAR) {
        return new Promise(resolve => {
            if (!element || !document.body.contains(element)) return resolve();
            const observer = new MutationObserver(() => {
                if (!document.body.contains(element)) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(); }, timeout);
        });
    }

    async function withSuppressedConfirm(action) {
        const originalConfirm = window.confirm;
        window.confirm = () => true;
        try {
            await action();
        } finally {
            window.confirm = originalConfirm;
        }
    }

    // --- Chat View Functions ---
    function addChatCheckbox(turnElement) {
        if (turnElement.querySelector(`.${C.CLASSES.CHAT_CHECKBOX}`)) return;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = C.CLASSES.CHAT_CHECKBOX;
        checkbox.title = 'Select this turn (Shift+Click for range, Ctrl+Click to multi-select)';
        const container = turnElement.querySelector(C.SELECTORS.CHAT_TURN_CONTAINER);
        container?.insertBefore(checkbox, container.firstChild);
    }

    function setupChatMoreOptionsListener(turnElement) {
        const moreOptionsButton = turnElement.querySelector(C.SELECTORS.CHAT_MORE_OPTIONS_BTN);
        if (!moreOptionsButton || moreOptionsButton.dataset.hasGmListener) return;
        moreOptionsButton.dataset.hasGmListener = 'true';
        moreOptionsButton.addEventListener('click', () => {
            if (isDeleting) return;
            setTimeout(() => {
                const menu = document.querySelector(C.SELECTORS.MENU_PANEL);
                if (menu) addChatDeleteBeforeMenuItem(menu, turnElement);
            }, C.TIMEOUTS.MENU_APPEAR_DELAY);
        });
    }

    function addChatDeleteBeforeMenuItem(menuPanel, targetTurnElement) {
        if (menuPanel.querySelector(`.${C.CLASSES.CHAT_DELETE_BEFORE}`)) return;
        const menuContent = menuPanel.querySelector('.mat-mdc-menu-content');
        if (!menuContent) return;
        const deleteItem = Array.from(menuPanel.querySelectorAll(C.SELECTORS.MENU_ITEM)).find(
            btn => btn.textContent.trim().toLowerCase() === 'delete'
        );
        const btn = document.createElement('button');
        btn.className = `mat-mdc-menu-item mat-focus-indicator ${C.CLASSES.CHAT_DELETE_BEFORE}`;
        btn.innerHTML = `<span class="mat-mdc-menu-item-text"><span class="delete-before-marker">[X]</span><span>Delete Before</span></span>`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleChatDeleteBefore(targetTurnElement);
        });
        if (deleteItem) menuContent.insertBefore(btn, deleteItem);
        else menuContent.appendChild(btn);
    }

    function handleChatClick(event) {
        const checkbox = event.target;
        if (!checkbox.matches(`.${C.CLASSES.CHAT_CHECKBOX}`)) return;
        const turnElement = checkbox.closest(C.SELECTORS.CHAT_TURN);
        if (!turnElement || isDeleting) {
            if (isDeleting) event.preventDefault();
            return;
        }
        if (lastClickedTurn && !document.body.contains(lastClickedTurn)) lastClickedTurn = null;
        const allTurns = Array.from(document.querySelectorAll(`${C.SELECTORS.CHAT_SESSION} ${C.SELECTORS.CHAT_TURN}`));
        if (event.shiftKey && lastClickedTurn) {
            const start = allTurns.indexOf(lastClickedTurn);
            const end = allTurns.indexOf(turnElement);
            if (start === -1 || end === -1) return;
            const range = allTurns.slice(Math.min(start, end), Math.max(start, end) + 1);
            if (!event.ctrlKey) deselectAllTurns(false);
            range.forEach(turn => selectTurn(turn, true));
        } else {
            const isSelected = selectedChatTurns.has(turnElement);
            if (!event.ctrlKey) {
                deselectAllTurns(false);
                if (!isSelected) selectTurn(turnElement, true);
            } else {
                selectTurn(turnElement, !isSelected);
            }
        }
        lastClickedTurn = turnElement;
        updateChatMultiDeleteButtonState();
    }

    function selectTurn(turnElement, shouldBeSelected) {
        const checkbox = turnElement.querySelector(`.${C.CLASSES.CHAT_CHECKBOX}`);
        if (shouldBeSelected) {
            selectedChatTurns.add(turnElement);
            turnElement.classList.add(C.CLASSES.CHAT_SELECTED);
            if (checkbox) checkbox.checked = true;
        } else {
            selectedChatTurns.delete(turnElement);
            turnElement.classList.remove(C.CLASSES.CHAT_SELECTED);
            if (checkbox) checkbox.checked = false;
        }
    }

    function deselectAllTurns(updateButtonState = true) {
        selectedChatTurns.forEach(turn => selectTurn(turn, false));
        selectedChatTurns.clear();
        if (updateButtonState) updateChatMultiDeleteButtonState();
    }

    async function deleteSingleChatTurn(turnElement) {
        const moreOptionsButton = turnElement.querySelector(C.SELECTORS.CHAT_MORE_OPTIONS_BTN);
        if (!moreOptionsButton) return false;
        robustClick(moreOptionsButton);
        try {
            const menu = await waitForElement(`${C.SELECTORS.MENU_PANEL}:has(${C.SELECTORS.MENU_ITEM})`);
            const deleteButton = Array.from(menu.querySelectorAll(C.SELECTORS.MENU_ITEM)).find(btn => {
                const text = btn.textContent.trim().toLowerCase();
                return text.includes('delete') && !text.includes('before');
            });
            if (deleteButton) {
                robustClick(deleteButton);
                await waitForElementToDisappear(turnElement);
                return true;
            }
            return false;
        } catch (error) {
            const backdrop = document.querySelector(C.SELECTORS.OVERLAY_BACKDROP);
            if (backdrop) robustClick(backdrop);
            return false;
        }
    }

    async function performChatDeletion(turnsToDelete) {
        if (isDeleting || turnsToDelete.length === 0) return;
        const turnsArray = [...turnsToDelete].sort((a, b) => b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1);
        await withSuppressedConfirm(async () => {
            isDeleting = true;
            updateChatMultiDeleteButtonState();
            try {
                for (const turn of turnsArray) {
                    if (document.body.contains(turn)) await deleteSingleChatTurn(turn);
                }
            } finally {
                isDeleting = false;
                updateChatMultiDeleteButtonState();
            }
        });
    }

    async function handleChatDeleteSelected() {
        const turnsToDelete = [...selectedChatTurns];
        if (turnsToDelete.length === 0) return;
        deselectAllTurns(false);
        await performChatDeletion(turnsToDelete);
    }

    async function handleChatDeleteBefore(targetTurnElement) {
        if (!targetTurnElement?.isConnected) return;
        const allTurns = Array.from(document.querySelectorAll(`${C.SELECTORS.CHAT_SESSION} ${C.SELECTORS.CHAT_TURN}`));
        const idx = allTurns.indexOf(targetTurnElement);
        if (idx <= 0) return;
        const turnsToDelete = allTurns.slice(0, idx);
        if (turnsToDelete.length > 0) {
            deselectAllTurns(false);
            await performChatDeletion(turnsToDelete);
        }
    }

    async function handleDeleteThoughts() {
        const thoughtTurns = Array.from(document.querySelectorAll(C.SELECTORS.CHAT_TURN)).filter(turn =>
            turn.querySelector('mat-expansion-panel-header')?.textContent.trim().startsWith('Thoughts')
        );
        if (thoughtTurns.length > 0) await performChatDeletion(thoughtTurns);
    }

    function addChatMultiDeleteButton() {
        if (document.getElementById(C.IDS.CHAT_MULTI_DELETE_BTN)) return;
        const moreButton = document.querySelector(C.SELECTORS.CHAT_MORE_ACTIONS_BTN);
        if (!moreButton?.parentElement) return;
        const btn = document.createElement('button');
        btn.id = C.IDS.CHAT_MULTI_DELETE_BTN;
        btn.addEventListener('click', handleChatDeleteSelected);
        moreButton.parentElement.insertBefore(btn, moreButton);
        updateChatMultiDeleteButtonState();
    }

    function updateChatMultiDeleteButtonState() {
        const btn = document.getElementById(C.IDS.CHAT_MULTI_DELETE_BTN);
        if (!btn) return;
        const count = selectedChatTurns.size;
        btn.textContent = isDeleting ? 'Deleting...' : `Delete Selected (${count})`;
        const enabled = count > 0 && !isDeleting;
        btn.classList.toggle(C.CLASSES.ENABLED, enabled);
        btn.disabled = !enabled;
    }

    function observeChatArea() {
        const container = document.querySelector(C.SELECTORS.CHAT_SESSION);
        if (!container) return;
        container.addEventListener('click', handleChatClick);
        document.querySelectorAll(`${C.SELECTORS.CHAT_SESSION} ${C.SELECTORS.CHAT_TURN}`).forEach(turn => {
            addChatCheckbox(turn);
            setupChatMoreOptionsListener(turn);
        });
        addChatMultiDeleteButton();
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                m.addedNodes.forEach(n => {
                    if (n.nodeType === Node.ELEMENT_NODE) {
                        const turns = n.matches(C.SELECTORS.CHAT_TURN) ? [n] : n.querySelectorAll(C.SELECTORS.CHAT_TURN);
                        turns.forEach(turn => {
                            addChatCheckbox(turn);
                            setupChatMoreOptionsListener(turn);
                        });
                    }
                });
                m.removedNodes.forEach(n => {
                    if (n.nodeType === Node.ELEMENT_NODE && selectedChatTurns.has(n)) {
                        selectedChatTurns.delete(n);
                        updateChatMultiDeleteButtonState();
                    }
                });
            }
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    // --- Library View Functions ---
    function addLibraryCheckbox(rowElement) {
        if (rowElement.querySelector(`.${C.CLASSES.LIB_CHECKBOX_CELL}`)) return;
        const cell = document.createElement('td');
        cell.className = `mat-mdc-cell mdc-data-table__cell cdk-cell ${C.CLASSES.LIB_CHECKBOX_CELL}`;
        cell.innerHTML = `<input type="checkbox" class="${C.CLASSES.LIB_CHECKBOX}">`;
        rowElement.insertBefore(cell, rowElement.firstChild);
    }

    function addLibraryHeaderCheckbox(headerRow) {
        if (headerRow.querySelector(`.${C.CLASSES.LIB_CHECKBOX_HEADER}`)) return;
        const headerCell = document.createElement('th');
        headerCell.className = `mat-mdc-header-cell mdc-data-table__header-cell cdk-header-cell ${C.CLASSES.LIB_CHECKBOX_HEADER}`;
        headerCell.innerHTML = `<input type="checkbox" class="${C.CLASSES.LIB_HEADER_CHECKBOX}" title="Select/Deselect All Visible">`;
        headerRow.insertBefore(headerCell, headerRow.firstChild);
    }

    function handleLibraryClick(event) {
        const target = event.target;
        if (target.matches(`.${C.CLASSES.LIB_HEADER_CHECKBOX}`)) {
            const isChecked = target.checked;
            document.querySelectorAll(C.SELECTORS.LIBRARY_ROW).forEach(row => {
                const rowCheckbox = row.querySelector(`input.${C.CLASSES.LIB_CHECKBOX}`);
                if (rowCheckbox) rowCheckbox.checked = isChecked;
                row.classList.toggle(C.CLASSES.LIB_SELECTED, isChecked);
                if (isChecked) selectedLibraryItems.add(row);
                else selectedLibraryItems.delete(row);
            });
        } else if (target.matches(`.${C.CLASSES.LIB_CHECKBOX}`)) {
            const row = target.closest('tr');
            if (row) {
                row.classList.toggle(C.CLASSES.LIB_SELECTED, target.checked);
                if (target.checked) selectedLibraryItems.add(row);
                else selectedLibraryItems.delete(row);
            }
        }
        updateLibraryMultiDeleteButtonState();
    }

    function addLibraryMultiDeleteButton() {
        if (document.getElementById(C.IDS.LIB_MULTI_DELETE_BTN)) return;
        const actionsWrapper = document.querySelector(C.SELECTORS.LIBRARY_ACTIONS_WRAPPER);
        if (!actionsWrapper) return;
        const button = document.createElement('button');
        button.id = C.IDS.LIB_MULTI_DELETE_BTN;
        button.innerHTML = `<span class="material-symbols-outlined">delete</span><span class="button-text">Delete Selected (0)</span>`;
        button.addEventListener('click', handleLibraryDeleteSelected);
        actionsWrapper.appendChild(button);
        updateLibraryMultiDeleteButtonState();
    }

    function updateLibraryMultiDeleteButtonState() {
        const button = document.getElementById(C.IDS.LIB_MULTI_DELETE_BTN);
        if (!button) return;
        const count = selectedLibraryItems.size;
        button.querySelector('.button-text').textContent = `Delete Selected (${count})`;
        const enabled = count > 0 && !isDeleting;
        button.classList.toggle(C.CLASSES.ENABLED, enabled);
        button.disabled = !enabled;
    }

    async function deleteSingleLibraryItem(rowElement) {
        const moreOptionsButton = rowElement.querySelector(C.SELECTORS.LIBRARY_MORE_OPTIONS_BTN);
        if (!moreOptionsButton) return false;
        robustClick(moreOptionsButton);
        try {
            const menu = await waitForElement(`${C.SELECTORS.MENU_PANEL}:has(${C.SELECTORS.MENU_ITEM})`);
            const deletePromptButton = Array.from(menu.querySelectorAll(C.SELECTORS.MENU_ITEM)).find(
                btn => btn.textContent.trim().toLowerCase().includes('delete prompt')
            );
            if (!deletePromptButton) return false;
            robustClick(deletePromptButton);
            const dialog = await waitForElement(C.SELECTORS.DIALOG_CONTAINER);
            const finalDeleteButton = Array.from(dialog.querySelectorAll(C.SELECTORS.DIALOG_ACTIONS)).find(
                btn => btn.textContent.trim().toLowerCase() === 'delete'
            );
            if (!finalDeleteButton) return false;
            robustClick(finalDeleteButton);
            await waitForElementToDisappear(rowElement);
            return true;
        } catch (error) {
            const backdrop = document.querySelector(C.SELECTORS.OVERLAY_BACKDROP);
            if (backdrop) robustClick(backdrop);
            return false;
        }
    }

    async function handleLibraryDeleteSelected() {
        if (isDeleting || selectedLibraryItems.size === 0) return;
        await withSuppressedConfirm(async () => {
            isDeleting = true;
            updateLibraryMultiDeleteButtonState();
            try {
                const itemsToDelete = [...selectedLibraryItems];
                selectedLibraryItems.clear();
                for (const row of itemsToDelete) {
                    if (row.isConnected) await deleteSingleLibraryItem(row);
                }
            } finally {
                isDeleting = false;
                updateLibraryMultiDeleteButtonState();
            }
        });
    }

    function observeLibraryTable() {
        const table = document.querySelector(C.SELECTORS.LIBRARY_TABLE);
        if (!table) return;
        table.addEventListener('click', handleLibraryClick);
        const headerRow = table.querySelector(C.SELECTORS.LIBRARY_HEADER_ROW);
        if (headerRow) addLibraryHeaderCheckbox(headerRow);
        table.querySelectorAll(C.SELECTORS.LIBRARY_ROW).forEach(addLibraryCheckbox);
        addLibraryMultiDeleteButton();
        const observer = new MutationObserver(() => {
            table.querySelectorAll(`${C.SELECTORS.LIBRARY_ROW}:not(:has(.${C.CLASSES.LIB_CHECKBOX_CELL}))`).forEach(addLibraryCheckbox);
        });
        const tbody = table.querySelector('tbody');
        if (tbody) observer.observe(tbody, { childList: true });
    }

    // --- Global Listeners & Initialization ---
    function setupGlobalListeners() {
        document.addEventListener('keydown', (event) => {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable || (activeEl.tagName === 'INPUT' && /^(text|search|password|tel|url)$/i.test(activeEl.type)));
            if (isTyping || isDeleting) return;

            if (window.location.pathname.startsWith('/prompts/')) {
                if (event.ctrlKey && event.key.toLowerCase() === 'a') {
                    event.preventDefault();
                    const allTurns = document.querySelectorAll(`${C.SELECTORS.CHAT_SESSION} ${C.SELECTORS.CHAT_TURN}`);
                    const allSelected = selectedChatTurns.size === allTurns.length && allTurns.length > 0;
                    deselectAllTurns(false);
                    if (!allSelected) allTurns.forEach(turn => selectTurn(turn, true));
                    updateChatMultiDeleteButtonState();
                } else if (event.key === 'Escape') {
                    if (selectedChatTurns.size > 0) {
                        event.preventDefault();
                        deselectAllTurns();
                        lastClickedTurn = null;
                    }
                } else if (event.key === 'Delete') {
                    if (selectedChatTurns.size > 0) {
                        event.preventDefault();
                        document.getElementById(C.IDS.CHAT_MULTI_DELETE_BTN)?.click();
                    }
                } else if (event.shiftKey && event.key === 'F2') {
                    event.preventDefault();
                    handleDeleteThoughts();
                }
            }
        });

        document.addEventListener('click', (event) => {
            if (window.location.pathname.startsWith('/prompts/') && selectedChatTurns.size > 0 && !event.target.closest(`${C.SELECTORS.CHAT_TURN}, #${C.IDS.CHAT_MULTI_DELETE_BTN}`)) {
                deselectAllTurns();
                lastClickedTurn = null;
            }
        });
    }

    async function initialize() {
        const currentPath = window.location.pathname;
        try {
            if (currentPath.startsWith('/prompts/')) {
                await waitForElement(C.SELECTORS.CHAT_SESSION);
                observeChatArea();
            } else if (currentPath === '/library') {
                await waitForElement(C.SELECTORS.LIBRARY_TABLE);
                observeLibraryTable();
            }
            setupGlobalListeners();
        } catch (error) {
            console.error('[Enhanced Actions] Initialization failed:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();