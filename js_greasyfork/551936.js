// ==UserScript==
// @name         ChatGPT 超級提示詞便簽 (最終修正版)
// @namespace    http://tampermonkey.net/
// @version      3.5.2
// @description  修正：將「點擊貼上」改為「雙擊貼上」，避免編輯時焦點跳走。同時優化效能與程式碼結構。
// @author       AI Assistant (優化 by Gemini)
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551936/ChatGPT%20%E8%B6%85%E7%B4%9A%E6%8F%90%E7%A4%BA%E8%A9%9E%E4%BE%BF%E7%B0%BD%20%28%E6%9C%80%E7%B5%82%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551936/ChatGPT%20%E8%B6%85%E7%B4%9A%E6%8F%90%E7%A4%BA%E8%A9%9E%E4%BE%BF%E7%B0%BD%20%28%E6%9C%80%E7%B5%82%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        :root {
            --note-bg: #fdfdfd;
            --note-border-color: #dcdcdc;
            --note-shadow-color: rgba(0,0,0,0.12);
            --note-text-color: #333;
            --header-bg: #f1f1f1;
            --tab-bg: #e9e9e9;
            --tab-hover-bg: #d8d8d8;
            --tab-active-bg: var(--note-bg);
            --control-icon-color: #888;
            --primary-action-color: #007bff;
            --minimized-bg: #5a6268;
        }
        .prompt-note-container {
            position: fixed; background-color: var(--note-bg); border: 1px solid var(--note-border-color);
            border-radius: 10px; box-shadow: 0 5px 15px var(--note-shadow-color); z-index: 9900;
            display: flex; flex-direction: column; font-family: sans-serif;
            min-width: 250px; min-height: 150px; color: var(--note-text-color);
            transition: all 0.2s ease-in-out, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
        }
        .prompt-note-header {
            padding: 3px 12px 0 12px; background-color: var(--header-bg); cursor: move;
            border-bottom: 1px solid var(--note-border-color); border-radius: 10px 10px 0 0;
            display: flex; justify-content: space-between; align-items: flex-end;
        }
        .prompt-note-tabs-container { display: flex; flex-grow: 1; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .prompt-note-tab {
            padding: 8px 12px; cursor: pointer; border: 1px solid transparent;
            border-bottom: none; border-radius: 6px 6px 0 0; background-color: var(--tab-bg);
            margin-right: 4px; font-size: 13px; white-space: nowrap; max-width: 120px;
            overflow: hidden; text-overflow: ellipsis; transition: background-color 0.2s;
        }
        .prompt-note-tab:hover { background-color: var(--tab-hover-bg); }
        .prompt-note-tab.active { background-color: var(--tab-active-bg); border-color: var(--note-border-color); }
        .prompt-note-tab input { border: 1px solid var(--primary-action-color); padding: 2px 4px; font-size: 13px; }
        .add-tab-btn {
            background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px 8px;
            color: var(--control-icon-color); border-radius: 4px;
        }
        .add-tab-btn:hover { background-color: var(--tab-hover-bg); }
        .prompt-note-controls { display: flex; align-items: center; padding-bottom: 4px; }
        .prompt-note-toggle {
            cursor: pointer; border: none; background: none; font-size: 18px;
            font-weight: bold; padding: 0 5px; color: #aaa;
        }
        .prompt-note-toggle:hover { color: #000; }
        .prompt-note-content-wrapper { flex-grow: 1; padding: 12px; display: flex; overflow: hidden; }
        .prompt-note-content {
            width: 100%; height: 100%; border: none; background: transparent;
            resize: none; outline: none; font-size: 14px; line-height: 1.6;
            color: #222;
        }
        .prompt-note-content::placeholder { color: #bbb; }
        .prompt-note-resizer {
            position: absolute; bottom: 0; right: 0; width: 15px; height: 15px;
            cursor: se-resize; background: repeating-linear-gradient(-45deg, transparent, transparent 2px, #ccc 2px, #ccc 4px);
            border-bottom-right-radius: 10px;
        }
        .prompt-note-container.collapsed { height: 42px !important; min-height: 42px; }
        .prompt-note-container.collapsed .prompt-note-content-wrapper,
        .prompt-note-container.collapsed .prompt-note-resizer { display: none; }
        .prompt-note-container.minimized {
            width: 42px !important; height: 42px !important; min-height: 0; min-width: 0;
            border-radius: 50%; cursor: pointer; justify-content: center; align-items: center;
            font-size: 18px; font-weight: bold; color: white; background-color: var(--minimized-bg);
            overflow: hidden;
        }
        .prompt-note-container.minimized > * { display: none; }
        .prompt-note-container.minimized .minimized-text { display: block !important; }
        #add-new-note-btn {
            position: fixed; bottom: 90px; right: 25px; width: 50px; height: 50px;
            background-color: var(--primary-action-color); color: white; border: none; border-radius: 50%;
            font-size: 28px; line-height: 50px; text-align: center; cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999;
        }
        #prompt-note-context-menu {
            position: fixed; display: none; background-color: var(--note-bg); border: 1px solid var(--note-border-color);
            border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 5px 0; font-size: 14px;
        }
        .context-menu-item { padding: 8px 20px; cursor: pointer; }
        .context-menu-item.disabled { color: #aaa; cursor: not-allowed; }
        .context-menu-item:not(.disabled):hover { background-color: var(--header-bg); }
        .context-menu-separator { margin: 4px 0; border: none; border-top: 1px solid #eee; }
    `);

    let notesData = [];
    const Z_INDEX_MANAGER = { base: 9900, top: 9900 };

    function init() {
        createAddButton();
        createContextMenu();
        loadNotes();
        document.addEventListener('click', () => hideContextMenu());
    }

    async function saveNotes() { await GM_setValue('promptNotesData', notesData); }

    async function loadNotes() {
        const storedData = await GM_getValue('promptNotesData', []);
        notesData = Array.isArray(storedData) ? storedData : [];
        if (notesData.length === 0) {
            createNewNote();
        } else {
            notesData.forEach(noteData => {
                if (noteData.zIndex && noteData.zIndex > Z_INDEX_MANAGER.top) Z_INDEX_MANAGER.top = noteData.zIndex;
                renderNote(noteData.id);
            });
        }
    }

    const getNoteData = (id) => notesData.find(n => n.id === id);
    const bringToFront = (noteContainer) => {
        const noteData = getNoteData(noteContainer.dataset.noteId);
        Z_INDEX_MANAGER.top++;
        noteData.zIndex = Z_INDEX_MANAGER.top;
        noteContainer.style.zIndex = noteData.zIndex;
        saveNotes();
    };

    function createNewNote() {
        Z_INDEX_MANAGER.top++;
        const newNote = {
            id: `note_${Date.now()}`,
            top: `${40 + (notesData.length % 10) * 20}px`, left: `${40 + (notesData.length % 10) * 20}px`,
            width: '300px', height: '220px', zIndex: Z_INDEX_MANAGER.top,
            isCollapsed: false, isMinimized: false, activeTabIndex: 0,
            tabs: [{ id: `tab_${Date.now()}`, title: '提示詞 1', content: '' }]
        };
        notesData.push(newNote);
        renderNote(newNote.id);
        saveNotes();
    }

    function renderNote(id) {
        const noteData = getNoteData(id);
        if (!noteData) return;
        let noteContainer = document.querySelector(`.prompt-note-container[data-note-id="${id}"]`);
        if (!noteContainer) {
            noteContainer = document.createElement('div');
            noteContainer.className = 'prompt-note-container';
            noteContainer.dataset.noteId = id;
            noteContainer.innerHTML = `<div class="prompt-note-header"><div class="prompt-note-tabs-container"></div><div class="prompt-note-controls"><button class="add-tab-btn" title="新增分頁">+</button><button class="prompt-note-toggle" title="收合/展開">—</button></div></div><div class="prompt-note-content-wrapper"><textarea class="prompt-note-content" placeholder="雙擊此處可將內容貼至對話框..."></textarea></div><div class="prompt-note-resizer"></div><span class="minimized-text" style="display:none;"></span>`;
            document.body.appendChild(noteContainer);
            setupNoteInteractions(noteContainer);
        }
        Object.assign(noteContainer.style, {
            top: noteData.top, left: noteData.left, width: noteData.width,
            height: noteData.height, zIndex: noteData.zIndex || Z_INDEX_MANAGER.base
        });
        noteContainer.classList.toggle('minimized', noteData.isMinimized);
        noteContainer.classList.toggle('collapsed', noteData.isCollapsed && !noteData.isMinimized);
        if (noteData.isMinimized) {
            const firstLetter = (noteData.tabs[noteData.activeTabIndex]?.title || 'N').charAt(0);
            noteContainer.querySelector('.minimized-text').textContent = firstLetter;
        } else {
            noteContainer.querySelector('.prompt-note-toggle').textContent = noteData.isCollapsed ? '+' : '—';
            renderTabs(noteContainer);
        }
    }

    function renderTabs(noteContainer) {
        const id = noteContainer.dataset.noteId;
        const noteData = getNoteData(id);
        const tabsContainer = noteContainer.querySelector('.prompt-note-tabs-container');
        const contentTextarea = noteContainer.querySelector('.prompt-note-content');
        tabsContainer.innerHTML = '';
        noteData.tabs.forEach((tab, index) => {
            const tabEl = document.createElement('div');
            tabEl.className = 'prompt-note-tab';
            tabEl.textContent = tab.title;
            tabEl.dataset.tabId = tab.id;
            tabEl.dataset.tabIndex = index;
            if (index === noteData.activeTabIndex) {
                tabEl.classList.add('active');
                contentTextarea.value = tab.content;
            }
            tabsContainer.appendChild(tabEl);
        });
        const activeTabEl = tabsContainer.querySelector('.active');
        if (activeTabEl) activeTabEl.scrollIntoView({ block: 'nearest', inline: 'center' });
    }

    function setupNoteInteractions(noteContainer) {
        const id = noteContainer.dataset.noteId;
        const contentTextarea = noteContainer.querySelector('.prompt-note-content');

        setupDragging(noteContainer.querySelector('.prompt-note-header'), noteContainer);
        setupResizing(noteContainer.querySelector('.prompt-note-resizer'), noteContainer);

        noteContainer.addEventListener('mousedown', () => bringToFront(noteContainer), { capture: true });
        noteContainer.addEventListener('contextmenu', e => showContextMenu(e, id));

        contentTextarea.addEventListener('input', (e) => {
            const noteData = getNoteData(id);
            noteData.tabs[noteData.activeTabIndex].content = e.target.value;
            saveNotes();
        });

        // ✅✅✅ --- 這一段就是最終修正 --- ✅✅✅
        // 將原本的 'click' 事件改為 'dblclick' (雙擊)
        contentTextarea.addEventListener('dblclick', (e) => {
            const targetTextarea = document.querySelector('#prompt-textarea');
            if (targetTextarea && e.target.value.trim() !== "") {
                targetTextarea.value = e.target.value;
                targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                targetTextarea.focus();
                setTimeout(() => {
                    targetTextarea.style.height = 'auto';
                    targetTextarea.style.height = `${targetTextarea.scrollHeight}px`;
                }, 0);
            }
        });
        // ✅✅✅ --- 修正結束 --- ✅✅✅

        noteContainer.querySelector('.add-tab-btn').addEventListener('click', () => addNewTab(id));
        noteContainer.querySelector('.prompt-note-toggle').addEventListener('click', () => toggleCollapse(id));
        noteContainer.addEventListener('click', (e) => { // 監聽整個便簽的點擊
            if(e.target.classList.contains('prompt-note-container') && getNoteData(id).isMinimized) {
                getNoteData(id).isMinimized = false;
                renderNote(id);
                saveNotes();
            }
        });

        const tabsContainer = noteContainer.querySelector('.prompt-note-tabs-container');
        tabsContainer.addEventListener('click', e => {
            const tabEl = e.target.closest('.prompt-note-tab');
            if (tabEl) switchTab(id, parseInt(tabEl.dataset.tabIndex));
        });
        tabsContainer.addEventListener('dblclick', e => {
            const tabEl = e.target.closest('.prompt-note-tab');
            if (tabEl) renameTab(tabEl);
        });
        tabsContainer.addEventListener('contextmenu', e => {
            const tabEl = e.target.closest('.prompt-note-tab');
            if (tabEl) showContextMenu(e, id, tabEl.dataset.tabId);
        });
    }

    function setupDragging(handle, target) {
        handle.addEventListener('mousedown', e => {
            if (e.target.closest('button, input, .prompt-note-tabs-container')) return;
            bringToFront(target);
            const rect = target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
            const onMouseMove = (e) => {
                target.style.left = `${e.clientX - offsetX}px`;
                target.style.top = `${e.clientY - offsetY}px`;
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                const noteData = getNoteData(target.dataset.noteId);
                noteData.left = target.style.left;
                noteData.top = target.style.top;
                saveNotes();
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function setupResizing(handle, target) {
        handle.addEventListener('mousedown', e => {
            e.preventDefault();
            const rect = target.getBoundingClientRect();
            const startX = e.clientX, startY = e.clientY;
            const onMouseMove = (e) => {
                target.style.width = `${rect.width + (e.clientX - startX)}px`;
                target.style.height = `${rect.height + (e.clientY - startY)}px`;
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                const noteData = getNoteData(target.dataset.noteId);
                noteData.width = target.style.width;
                noteData.height = target.style.height;
                saveNotes();
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function switchTab(noteId, tabIndex) {
        const noteData = getNoteData(noteId);
        noteData.activeTabIndex = tabIndex;
        renderTabs(document.querySelector(`.prompt-note-container[data-note-id="${noteId}"]`));
        saveNotes();
    }

    function addNewTab(noteId) {
        const noteData = getNoteData(noteId);
        const newTab = { id: `tab_${Date.now()}`, title: `提示詞 ${noteData.tabs.length + 1}`, content: '' };
        noteData.tabs.push(newTab);
        noteData.activeTabIndex = noteData.tabs.length - 1;
        renderTabs(document.querySelector(`.prompt-note-container[data-note-id="${noteId}"]`));
        saveNotes();
    }

    function renameTab(tabEl) {
        const originalText = tabEl.textContent;
        tabEl.innerHTML = '';
        const input = document.createElement('input');
        input.type = 'text', input.value = originalText;
        tabEl.appendChild(input);
        input.focus(), input.select();
        const finishEditing = () => {
            const newTitle = input.value.trim() || originalText;
            tabEl.textContent = newTitle;
            const noteId = tabEl.closest('.prompt-note-container').dataset.noteId;
            const tabId = tabEl.dataset.tabId;
            const tabData = getNoteData(noteId).tabs.find(t => t.id === tabId);
            if (tabData) tabData.title = newTitle;
            saveNotes();
            input.removeEventListener('blur', finishEditing);
            input.removeEventListener('keydown', onKeydown);
        };
        const onKeydown = e => { if (e.key === 'Enter') finishEditing(); };
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', onKeydown);
    }

    function toggleCollapse(noteId) {
        const noteData = getNoteData(noteId);
        noteData.isCollapsed = !noteData.isCollapsed;
        const noteContainer = document.querySelector(`.prompt-note-container[data-note-id="${noteId}"]`);
        noteContainer.classList.toggle('collapsed', noteData.isCollapsed);
        noteContainer.querySelector('.prompt-note-toggle').textContent = noteData.isCollapsed ? '+' : '—';
        saveNotes();
    }

    const contextMenu = document.createElement('div');
    contextMenu.id = 'prompt-note-context-menu';

    function createContextMenu() {
        document.body.appendChild(contextMenu);
        contextMenu.addEventListener('click', handleContextMenuClick);
    }
    const hideContextMenu = () => contextMenu.style.display = 'none';

    function showContextMenu(e, noteId, tabId = null) {
        e.preventDefault(), e.stopPropagation();
        const noteData = getNoteData(noteId);
        let menuItems = tabId ? `<div class="context-menu-item" data-action="add-tab">新增分頁</div><div class="context-menu-item" data-action="rename-tab">重新命名</div><div class="context-menu-item ${noteData.tabs.length > 1 ? '' : 'disabled'}" data-action="close-tab">關閉分頁</div><hr class="context-menu-separator">` : '';
        menuItems += `<div class="context-menu-item" data-action="minimize">最小化便簽</div><div class="context-menu-item" data-action="close-note">關閉便簽</div>`;
        contextMenu.innerHTML = menuItems;
        contextMenu.style.zIndex = Z_INDEX_MANAGER.top + 10;
        contextMenu.style.display = 'block';
        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth: vpWidth, innerHeight: vpHeight } = window;
        const { offsetWidth: menuWidth, offsetHeight: menuHeight } = contextMenu;
        contextMenu.style.left = `${mouseX + menuWidth > vpWidth ? mouseX - menuWidth : mouseX}px`;
        contextMenu.style.top = `${mouseY + menuHeight > vpHeight ? mouseY - menuHeight : mouseY}px`;
        contextMenu.dataset.noteId = noteId;
        contextMenu.dataset.tabId = tabId || '';
    }

    function handleContextMenuClick(e) {
        const target = e.target.closest('.context-menu-item');
        if (!target || target.classList.contains('disabled')) return;
        const { action } = target.dataset;
        const { noteId, tabId } = contextMenu.dataset;
        const noteData = getNoteData(noteId);
        const noteEl = document.querySelector(`.prompt-note-container[data-note-id="${noteId}"]`);
        switch (action) {
            case 'add-tab': addNewTab(noteId); break;
            case 'rename-tab': renameTab(noteEl.querySelector(`.prompt-note-tab[data-tab-id="${tabId}"]`)); break;
            case 'close-tab':
                const tabIndex = noteData.tabs.findIndex(t => t.id === tabId);
                noteData.tabs.splice(tabIndex, 1);
                noteData.activeTabIndex = Math.max(0, noteData.activeTabIndex - (noteData.activeTabIndex >= tabIndex ? 1 : 0));
                renderTabs(noteEl);
                saveNotes();
                break;
            case 'minimize':
                noteData.isMinimized = true;
                renderNote(noteId);
                saveNotes();
                break;
            case 'close-note':
                noteEl.remove();
                notesData = notesData.filter(n => n.id !== noteId);
                saveNotes();
                break;
        }
        hideContextMenu();
    }

    function createAddButton() {
        const addButton = document.createElement('button');
        addButton.id = 'add-new-note-btn', addButton.textContent = '+', addButton.title = '新增便簽';
        document.body.appendChild(addButton);
        addButton.addEventListener('click', createNewNote);
    }

    window.addEventListener('load', init);
})();