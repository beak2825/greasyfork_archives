// ==UserScript==
// @name         Popmundo Post-it 
// @namespace    http://tampermonkey.net/
// @version      19.5
// @description  Post it bonitinho.
// @author       Chris Popper 
// @match        *://*.popmundo.com/World/Popmundo.aspx/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549869/Popmundo%20Post-it.user.js
// @updateURL https://update.greasyfork.org/scripts/549869/Popmundo%20Post-it.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // PARTE A: LÓGICA DO POST-IT
    // =================================================================================
    function initializePostIt() {
        if (document.getElementById('postit-host')) return;
        const characterInfo = getCharacterInfo();
        if (!characterInfo.id) return;

        const CONFIG = { themes: { yellow: { main: '#fefabc', header: '#fceb77', border: '#e7d100', text: '#584a00' }, pink: { main: '#FADADD', header: '#F7B9C1', border: '#E895A5', text: '#8A3A51' }, blue: { main: '#D4EBF4', header: '#A9D6E5', border: '#89C2D9', text: '#013A63' }, green: { main: '#D8F3DC', header: '#B7E4C7', border: '#95D5B2', text: '#1B4332' }, purple: { main: '#E9D8FD', header: '#D3B5FD', border: '#B388FC', text: '#491D8B' } } };
        function getCharacterInfo() { let id = null; const urlMatch = window.location.href.match(/Character\/(\d+)/); id = urlMatch ? urlMatch[1] : (document.querySelector('.idHolder')?.textContent.trim() || null); return { id }; }

        const { id: characterId } = characterInfo;
        // ***** MUDANÇA IMPORTANTE AQUI *****
        // Alteramos a versão das chaves para 'v19' para forçar uma limpeza de dados antigos.
        const storageKeyNotepad = `postit_notes_v19_notepad_${characterId}`,
              storageKeyChecklist = `postit_notes_v19_checklist_${characterId}`,
              storageKeyPosition = `postit_position_v19_${characterId}`,
              storageKeySettings = `postit_settings_v19_${characterId}`;
        // **********************************

        const hostElement = document.createElement('div'); hostElement.id = 'postit-host'; document.body.appendChild(hostElement);
        const shadowRoot = hostElement.attachShadow({ mode: 'open' });
        const { html, css } = buildComponent(); shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        const container = shadowRoot.getElementById('postit-container'), header = shadowRoot.getElementById('postit-header'), notepadEditor = shadowRoot.getElementById('notepad-editor'), checklistEditor = shadowRoot.getElementById('checklist-editor'), status = shadowRoot.getElementById('postit-status');
        setupEventListeners(); loadData();

        function applySettings(settings) { container.className = `theme-${settings.theme}`; shadowRoot.getElementById('postit-emoji').textContent = '📝'; }
        async function loadData() { notepadEditor.innerHTML = await GM_getValue(storageKeyNotepad, 'Use a barra de ferramentas para formatar o texto e <b>adicionar links</b>!'); checklistEditor.innerHTML = await GM_getValue(storageKeyChecklist, ''); const pos = await GM_getValue(storageKeyPosition, { top: '30px', left: '30px' }); hostElement.style.top = pos.top; hostElement.style.left = pos.left; const defaultSettings = { theme: 'pink', activeTab: 'notepad' }; const savedSettings = await GM_getValue(storageKeySettings, defaultSettings); applySettings(savedSettings); switchTab(savedSettings.activeTab); }
        function switchTab(tabId) { shadowRoot.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none'); shadowRoot.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active')); shadowRoot.getElementById(`${tabId}-editor`).style.display = 'block'; shadowRoot.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active'); }
        function setupEventListeners() {
            let saveTimeout; const saveContent = (editorEl, storageKey) => { clearTimeout(saveTimeout); status.textContent = 'Digitando...'; saveTimeout = setTimeout(async () => { await GM_setValue(storageKey, editorEl.innerHTML); status.textContent = 'Salvo! ✅'; setTimeout(() => { status.textContent = ''; }, 2000); }, 500); };
            notepadEditor.addEventListener('input', () => saveContent(notepadEditor, storageKeyNotepad)); checklistEditor.addEventListener('input', () => saveContent(checklistEditor, storageKeyChecklist));
            header.querySelector('#postit-tab-container').addEventListener('click', async (e) => { const tabBtn = e.target.closest('.tab-btn'); if (tabBtn) { const tabId = tabBtn.dataset.tab; switchTab(tabId); const settings = await GM_getValue(storageKeySettings, {}); settings.activeTab = tabId; await GM_setValue(storageKeySettings, settings); } });
            const formatCommand = (command) => { const activeEditor = shadowRoot.activeElement; if (activeEditor && activeEditor.isContentEditable) { activeEditor.focus(); document.execCommand(command); } };
            shadowRoot.getElementById('postit-bold-btn').addEventListener('click', () => formatCommand('bold')); shadowRoot.getElementById('postit-italic-btn').addEventListener('click', () => formatCommand('italic'));
            shadowRoot.getElementById('postit-add-link-btn').addEventListener('click', () => { const activeEditor = shadowRoot.activeElement; if (!activeEditor || !activeEditor.isContentEditable) return; activeEditor.focus(); const selection = shadowRoot.getSelection(); const url = prompt("Cole a URL:", "https://"); if (url) { const safeUrl = processPopmundoUrl(url.trim()); document.execCommand('createLink', false, safeUrl); const newLink = selection.anchorNode.parentElement.closest('a'); if (newLink) { newLink.target = '_blank'; newLink.rel = 'noopener noreferrer'; } } });
            const CHECKLIST_ITEM_HTML = `<div class="checklist-item" contenteditable="false"><input type="checkbox"><span contenteditable="true">Nova tarefa...</span><button class="delete-task-btn">×</button></div>`;
            function addFirstChecklistItem() { checklistEditor.innerHTML = CHECKLIST_ITEM_HTML; const newSpan = checklistEditor.querySelector('span'); if (newSpan) { const range = document.createRange(), sel = window.getSelection(); range.selectNodeContents(newSpan); sel.removeAllRanges(); sel.addRange(range); } }
            checklistEditor.addEventListener('focus', () => { if (checklistEditor.children.length === 0) { addFirstChecklistItem(); } });
            checklistEditor.addEventListener('click', (event) => { if (event.target.type === 'checkbox') { event.target.closest('.checklist-item').classList.toggle('done'); } const deleteBtn = event.target.closest('.delete-task-btn'); if (deleteBtn) { deleteBtn.closest('.checklist-item').remove(); } });
            checklistEditor.addEventListener('keydown', (event) => { if (event.key !== 'Enter') return; const sel = shadowRoot.getSelection(); if (!sel.rangeCount) return; const currentItem = sel.getRangeAt(0).startContainer.parentElement.closest('.checklist-item'); if (currentItem) { event.preventDefault(); const newChecklistHTML = `<div class="checklist-item" contenteditable="false"><input type="checkbox"><span contenteditable="true"></span><button class="delete-task-btn">×</button></div>`; currentItem.insertAdjacentHTML('afterend', newChecklistHTML); const newItem = currentItem.nextElementSibling, newSpan = newItem.querySelector('span'); const range = document.createRange(); range.setStart(newSpan, 0); range.collapse(true); sel.removeAllRanges(); sel.addRange(range); } });
            checklistEditor.addEventListener('paste', (event) => {
                event.preventDefault(); const pastedText = (event.clipboardData || window.clipboardData).getData('text/plain');
                const lines = pastedText.trim().split('\n').filter(line => line.trim() !== ''); if (lines.length === 0) return;
                const checklistHTML = lines.map(line => `<div class="checklist-item" contenteditable="false"><input type="checkbox"><span contenteditable="true">${line.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span><button class="delete-task-btn">×</button></div>`).join('');
                document.execCommand('insertHTML', false, checklistHTML);
            });
            const modal = shadowRoot.getElementById('postit-settings-modal'); shadowRoot.getElementById('postit-settings-btn').addEventListener('click', async () => { const currentSettings = await GM_getValue(storageKeySettings, {}); modal.querySelector(`input[name="theme"][value="${currentSettings.theme || 'pink'}"]`).checked = true; modal.style.display = 'flex'; });
            shadowRoot.getElementById('settings-btn-cancel').addEventListener('click', () => modal.style.display = 'none'); modal.addEventListener('click', (e) => { if (e.target.id === 'postit-settings-modal') modal.style.display = 'none'; });
            shadowRoot.getElementById('settings-btn-save').addEventListener('click', async () => { const newSettings = { ...(await GM_getValue(storageKeySettings, {})), theme: modal.querySelector('input[name="theme"]:checked').value }; await GM_setValue(storageKeySettings, newSettings); applySettings(newSettings); modal.style.display = 'none'; });
            makeDraggable(hostElement, header);
        }
        function processPopmundoUrl(url) { if (!url || typeof url !== 'string') return '#'; try { if (url.includes('.popmundo.com/') || url.startsWith('/')) { const path = new URL(url, window.location.origin).pathname, search = new URL(url, window.location.origin).search, hash = new URL(url, window.location.origin).hash; return window.location.origin + path + search + hash; } } catch (e) { console.warn("Post-it Linker: URL inválida:", url); return '#'; } return url; }
        function makeDraggable(element, dragHandle) { let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; dragHandle.onmousedown = dragMouseDown; function dragMouseDown(e) { if (e.target.closest('#postit-settings-btn, .tab-btn')) return; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; } function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; } async function closeDragElement() { document.onmouseup = null; document.onmousemove = null; await GM_setValue(storageKeyPosition, { top: element.style.top, left: element.style.left }); } }
        function buildComponent() { const html = `<div id="postit-container"><div id="postit-header"><span id="postit-emoji"></span><div id="postit-tab-container"><span class="tab-btn" data-tab="notepad">Notas</span><span class="tab-btn" data-tab="checklist">Tarefas</span></div><span id="postit-settings-btn">⚙️</span></div><div id="postit-toolbar"><button id="postit-bold-btn" title="Negrito"><b>N</b></button><button id="postit-italic-btn" title="Itálico"><i>I</i></button><button id="postit-add-link-btn" title="Adicionar Link">Link</button></div><div id="postit-content-area"><div id="notepad-editor" class="tab-content" contenteditable="true"></div><div id="checklist-editor" class="tab-content" contenteditable="true"></div></div><div id="postit-status"></div><div id="postit-settings-modal"><div id="postit-settings-content"><h3>Ferramentas</h3><div class="setting-group"><label>Cor do Tema:</label><div class="swatch-container">${Object.keys(CONFIG.themes).map(key => `<label><input type="radio" name="theme" value="${key}"><span class="swatch" style="background-color: ${CONFIG.themes[key].main}; border: 1px solid ${CONFIG.themes[key].border};" title="${key}"></span></label>`).join('')}</div></div><div id="postit-settings-buttons"><button id="settings-btn-cancel">Cancelar</button><button id="settings-btn-save">Salvar</button></div></div></div></div>`; const css = ` @font-face { font-family: 'Roboto'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } ${Object.entries(CONFIG.themes).map(([name, theme]) => `#postit-container.theme-${name} { background-image: radial-gradient(circle at top left, ${theme.header}, ${theme.main}); border: 1px solid ${theme.border}; } #postit-container.theme-${name} #postit-header { background-color: ${theme.header}B3; border-bottom-color: ${theme.border}; color: ${theme.text}; } #postit-container.theme-${name} #postit-toolbar button:hover { background-color: ${theme.header}; color: ${theme.text}; border-color: ${theme.border}; } #postit-container.theme-${name} .tab-btn.active { background-color: ${theme.main} !important; border-bottom-color: ${theme.main} !important; color: ${theme.text} !important; } #postit-container.theme-${name} a { color: ${theme.text}; text-decoration-color: ${theme.text}99; }`).join('')} :host { position: fixed; top: 30px; left: 30px; z-index: 9999; } #postit-container { font-family: 'Roboto', sans-serif; width: 350px; min-height: 250px; box-shadow: 5px 5px 15px rgba(0,0,0,0.3); display: flex; flex-direction: column; border-radius: 4px; resize: both; overflow: hidden; } #postit-header { padding: 0 10px; cursor: move; font-weight: bold; user-select: none; display: flex; align-items: center; border-bottom: 1px solid; backdrop-filter: blur(4px); } #postit-emoji { margin-right: 8px; } #postit-tab-container { flex-grow: 1; display: flex; align-self: flex-end; } .tab-btn { font-family: 'Roboto', sans-serif; padding: 8px 16px; border: 1px solid transparent; border-bottom: none; background: rgba(0,0,0,0.05); cursor: pointer; color: #555; border-radius: 6px 6px 0 0; margin-bottom: -1px; transition: all 0.2s; } #postit-settings-btn { margin-left: auto; cursor: pointer; font-size: 18px; transition: transform 0.2s; padding: 10px; } #postit-settings-btn:hover { transform: scale(1.2) rotate(90deg); } #postit-toolbar { display: flex; padding: 8px; background: rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.1); gap: 8px; } #postit-toolbar button { font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: bold; padding: 5px 10px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; transition: all 0.2s; } #postit-bold-btn b, #postit-italic-btn i { font-size: 14px; } #postit-content-area { flex-grow: 1; position: relative; } .tab-content { padding: 12px; font-size: 14px; color: #333; outline: none; overflow-y: auto; line-height: 1.6; position: absolute; top: 0; left: 0; width: 100%; height: 100%; box-sizing: border-box;} #checklist-editor:empty::before { content: 'Clique para adicionar uma tarefa'; color: #aaa; cursor: text; display: flex; justify-content: center; align-items: center; height: 100%; font-style: italic; } .tab-content a { text-decoration: underline; cursor: pointer; } .tab-content a:hover { text-decoration-style: dotted; } .checklist-item { display: flex; align-items: center; margin: 4px 0; position: relative; } .checklist-item input[type="checkbox"] { margin-right: 8px; flex-shrink: 0; transform: scale(1.1); } .checklist-item span { outline: none; flex-grow: 1; } .checklist-item.done span { text-decoration: line-through; color: #888; } .delete-task-btn { visibility: hidden; opacity: 0; border: none; background: transparent; color: #aaa; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.2s; margin-left: auto; } .checklist-item:hover .delete-task-btn { visibility: visible; opacity: 1; } .delete-task-btn:hover { color: #e74c3c; transform: scale(1.2); } #postit-status { padding: 2px 8px; font-size: 11px; color: #888; text-align: right; height: 20px; background: rgba(0,0,0,0.02); } #postit-settings-modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10; display: none; align-items: center; justify-content: center; font-family: 'Roboto', sans-serif; } #postit-settings-content { background: #fff; color: #333; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 300px; } #postit-settings-content h3 { margin-top: 0; } .setting-group { margin-bottom: 20px; } .setting-group label { font-weight: bold; display: block; margin-bottom: 8px; } .swatch-container { display: flex; gap: 10px; } .swatch-container label { margin: 0; } .swatch-container input[type="radio"] { display: none; } .swatch { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: block; transition: transform 0.1s; } .swatch-container input[type="radio"]:checked + .swatch { transform: scale(1.2); box-shadow: 0 0 0 3px #fff, 0 0 0 5px #007bff; } #postit-settings-buttons { text-align: right; margin-top: 25px; } #postit-settings-buttons button { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; color: white; font-weight: bold; } #settings-btn-save { background-color: #28a745; } #settings-btn-cancel { background-color: #6c757d; }`; return { html, css }; }
    }
    setTimeout(initializePostIt, 500);
    const observer = new MutationObserver(initializePostIt);
    observer.observe(document.body, { childList: true, subtree: true });

    // =================================================================================
    // PARTE B: FUNCIONALIDADE UNIVERSAL DE CÓPIA
    // =================================================================================

    GM_addStyle(`.universal-copier-notification { position: fixed; background-color: #28a745; color: white; padding: 8px 16px; border-radius: 20px; z-index: 10000; font-family: 'Roboto', sans-serif; font-size: 14px; pointer-events: none; opacity: 0; transform: translate(-50%, 10px); transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; } .universal-copier-notification.visible { opacity: 1; transform: translate(-50%, -25px); }`);
    let lastMouseX = 0, lastMouseY = 0;
    document.addEventListener('mousemove', (event) => { lastMouseX = event.clientX; lastMouseY = event.clientY; });

    document.addEventListener('keydown', (event) => {
        const activeEl = document.activeElement;
        const isEditingPostIt = activeEl.shadowRoot && activeEl.shadowRoot.activeElement?.contentEditable === 'true';
        if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || isEditingPostIt) return;

        if (event.key.toLowerCase() === 'c' && event.ctrlKey && !event.altKey) {
            const selection = window.getSelection(); const selectedText = selection.toString().trim();
            if (selectedText.length > 0) { event.preventDefault(); navigator.clipboard.writeText(selectedText).then(() => { const range = selection.getRangeAt(0); const rect = range.getBoundingClientRect(); showCopyNotification(rect.right, rect.bottom); }).catch(err => console.error('Falha ao copiar seleção: ', err)); }
        } else if (event.key.toLowerCase() === 'c' && event.altKey && !event.ctrlKey) {
            event.preventDefault(); const targetElement = document.elementFromPoint(lastMouseX, lastMouseY); if (!targetElement) return;
            let textToCopy = '';
            if (targetElement.tagName === 'SELECT') { const options = Array.from(targetElement.options); textToCopy = options.map(option => option.textContent.trim()).join('\n'); }
            else if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') { textToCopy = targetElement.value; }
            else { textToCopy = targetElement.textContent; }
            if (textToCopy && textToCopy.trim() !== '') { navigator.clipboard.writeText(textToCopy.trim()).then(() => showCopyNotification(lastMouseX, lastMouseY)).catch(err => console.error('Falha ao copiar texto: ', err)); }
        }
    });

    function showCopyNotification(x, y) {
        const existingNotif = document.querySelector('.universal-copier-notification'); if (existingNotif) existingNotif.remove();
        const notification = document.createElement('div'); notification.className = 'universal-copier-notification'; notification.textContent = 'Copiado!'; notification.style.left = `${x}px`; notification.style.top = `${y}px`; document.body.appendChild(notification);
        setTimeout(() => { notification.classList.add('visible'); }, 10);
        setTimeout(() => { notification.classList.remove('visible'); setTimeout(() => { if (notification.parentElement) notification.parentElement.removeChild(notification); }, 300); }, 1000);
    }
})();
