// ==UserScript==
// @name         Character Tavern - Automatic Message Formatting Corrector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  One-Click cleanup for Character Tavern. Floating, Inline Top, or Inline Bottom. Select Italics/Bold/Plain text.
// @author       accforfaciet
// @match        *://character-tavern.com/chat/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561254/Character%20Tavern%20-%20Automatic%20Message%20Formatting%20Corrector.user.js
// @updateURL https://update.greasyfork.org/scripts/561254/Character%20Tavern%20-%20Automatic%20Message%20Formatting%20Corrector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS & DEFAULTS ---
    const DEBUG_MODE = false;
    const POSITION_KEY = 'tavernFormatterPosition';
    const SETTINGS_KEY = 'tavernFormatterSettings';

    const DEFAULT_SETTINGS = {
        // Formatting
        styleMode: 'italic', // 'italic', 'bold', 'none', 'bold-italic', 'bold-plain'
        removeThinkTags: true,
        removeSystemPrompt: true,
        removeGeneralTags: true,
        // UI
        buttonPosition: 'floating', // 'floating', 'inline-top', 'inline-bottom'
        floatSize: 50,
        floatOpacity: 50,
        showButtonText: true,
        showSettingsText: true
    };

    // --- SELECTORS (Adapted for Character Tavern) ---
    // Finds the edit button (Pencil icon) inside a message
    // We look for the SVG class 'lucide-pencil-ruler'
    const EDIT_ICON_SELECTOR = 'svg.lucide-pencil-ruler';

    // Modal selectors based on your HTML
    const MODAL_SELECTOR = 'div[role="dialog"][data-state="open"]';
    const MODAL_TEXTAREA_SELECTOR = 'textarea.whitespace-pre-line';
    const MODAL_SAVE_BTN_SELECTOR = 'button.bg-primary'; // The "Save" button usually has the primary background class

    // UI Injection Selectors
    // Top: The container with Copy/Edit/Trash buttons
    const MSG_CONTROLS_SELECTOR = '.group-hover\\:md\\:flex.gap-4';
    // Bottom: The main input area container (near Send button)
    const INPUT_AREA_SELECTOR = 'textarea[placeholder="Type your message here..."]';
    const TOP_MENU_SELECTOR = 'header'; // To place the settings gear

    // --- STATE ---
    let currentSettings = loadSettings();
    let uiObserver = null;

    // --- HELPER FUNCTIONS ---
    function debugLog(...args) { if (DEBUG_MODE) console.log('[DEBUG]', ...args); }

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        let parsed = saved ? JSON.parse(saved) : {};
        if (parsed.buttonPosition === 'inline') parsed.buttonPosition = 'inline-top';
        return { ...DEFAULT_SETTINGS, ...parsed };
    }

    function saveSettings(newSettings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        currentSettings = newSettings;
        cleanupUI();
        initUI();
    }

    function waitForElement(selector, parent = document, timeoutMs = 5000) {
        return new Promise(resolve => {
            let el = parent.querySelector(selector);
            if (el) return resolve(el);
            const startTime = Date.now();
            const observer = new MutationObserver(() => {
                el = parent.querySelector(selector);
                if (el) { observer.disconnect(); resolve(el); }
                else if (Date.now() - startTime > timeoutMs) { observer.disconnect(); resolve(null); }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        });
    }

    // --- TEXT PROCESSING ENGINE ---
    function processText(text) {
        if (currentSettings.removeThinkTags) {
            text = text.replace(/\n?\s*<(thought|thoughts)>[\s\S]*?<\/(thought|thoughts)>\s*\n?/g, '');
            text = text.replace(/<(system|response)>|<\/response>/g, '');
            text = text.replace(/\n?\s*<think>[\s\S]*?<\/think>\s*\n?/g, '');
            text = text.replace('</think>', '');
        }
        if (currentSettings.removeGeneralTags) {
            text = text.replace(/<\/?[a-zA-Z0-9:-]+(\s[^>]*)?>/g, '');
        }
        if (currentSettings.removeSystemPrompt) {
            text = removeSystemPrompt(text);
        }

        let narrWrap = '';
        let dialWrap = '';
        switch (currentSettings.styleMode) {
            case 'italic': narrWrap = '*'; break;
            case 'bold': narrWrap = '**'; break;
            case 'bold-italic': narrWrap = '*'; dialWrap = '**'; break;
            case 'bold-plain': narrWrap = ''; dialWrap = '**'; break;
            case 'none': default: break;
        }

        const normalizedText = text.replace(/[«“”„‟⹂❞❝]/g, '"');
        const lines = normalizedText.split('\n');

        const processedLines = lines.map(line => {
            let trimmedLine = line.trim();
            if (trimmedLine === '') return '';
            const cleanLine = trimmedLine.replace(/\*/g, '');

            if (/^["*]+$/.test(cleanLine)) return null;
            if (cleanLine === '---') return '---';

            if (cleanLine.includes('"') || cleanLine.includes('`')) {
                const fragments = cleanLine.split(/("[\s\S]*?"|`[\s\S]*?`)/);
                return fragments.map(frag => {
                    const isQuote = (frag.startsWith('"') && frag.endsWith('"')) || (frag.startsWith('`') && frag.endsWith('`'));
                    if (isQuote) return frag.trim() !== '' ? `${dialWrap}${frag}${dialWrap}` : '';
                    return frag.trim() !== '' ? `${narrWrap}${frag.trim()}${narrWrap}` : '';
                }).filter(Boolean).join(' ');
            }
            return `${narrWrap}${cleanLine}${narrWrap}`;
        });

        return processedLines.filter(l => l !== null).join('\n');
    }

    function removeSystemPrompt(text) {
        if (!text.trim().toLowerCase().includes('theuser')) return text;
        const splitPointIndex = text.search(/[^\s\*]\*[^\s\*]/);
        if (splitPointIndex !== -1) return text.substring(splitPointIndex + 1);
        return text;
    }

    // --- EXECUTION LOGIC FOR TAVERN ---
    async function executeFormat() {
        debugLog('Start Format');
        try {
            // 1. Find the last message's edit button
            const allEditIcons = document.querySelectorAll(EDIT_ICON_SELECTOR);
            if (allEditIcons.length === 0) return debugLog('No edit icons found');

            // The SVG is inside the button, so we get the closest button parent
            const lastEditButton = allEditIcons[allEditIcons.length - 1].closest('button');
            if (!lastEditButton) return debugLog('Edit button parent not found');

            debugLog('Clicking edit button...');
            lastEditButton.click();

            // 2. Wait for the Modal
            const modal = await waitForElement(MODAL_SELECTOR);
            if (!modal) return debugLog('Edit modal did not appear');
            debugLog('Modal open');

            // 3. Find Textarea inside Modal
            const textField = modal.querySelector(MODAL_TEXTAREA_SELECTOR);
            if (!textField) return debugLog('Modal textarea not found');

            // 4. Process Text
            const newText = processText(textField.value);

            // 5. Update Value (React friendly)
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textField, newText);
            textField.dispatchEvent(new Event('input', { bubbles: true }));

            // 6. Click Save
            // We search for a button with text "Save" or class bg-primary inside the modal
            const buttons = modal.querySelectorAll('button');
            let saveBtn = null;
            buttons.forEach(btn => {
                if (btn.textContent.trim() === 'Save') saveBtn = btn;
            });

            if (saveBtn) {
                saveBtn.click();
            } else {
                debugLog('Save button not found by text, trying selector');
                const fallbackSave = modal.querySelector(MODAL_SAVE_BTN_SELECTOR);
                if (fallbackSave) fallbackSave.click();
            }

        } catch (error) {
            console.error('TavernFormatter Error:', error);
        }
    }

    // --- UI MANAGER ---

    function initUI() {
        injectGlobalSettings();

        if (currentSettings.buttonPosition === 'floating') {
            createFloatingUI();
        } else {
            injectInlineButton();
        }

        if (!uiObserver) {
            uiObserver = new MutationObserver(() => {
                injectGlobalSettings();
                if (currentSettings.buttonPosition.includes('inline')) {
                    injectInlineButton();
                }
            });
            uiObserver.observe(document.body, { childList: true, subtree: true });
        }

        // Mobile keyboard fix (if floating)
        if (currentSettings.buttonPosition === 'floating') initKeyboardFix();
    }

    function cleanupUI() {
        const floatContainer = document.getElementById('tavern-editor-container');
        if (floatContainer) floatContainer.remove();

        document.querySelectorAll('.tavern-formatter-btn-inline').forEach(el => el.remove());

        const settingsTrigger = document.getElementById('tavern-settings-btn-inline');
        if (settingsTrigger) settingsTrigger.remove();

        if (uiObserver) {
            uiObserver.disconnect();
            uiObserver = null;
        }
    }

    // --- GLOBAL SETTINGS BUTTON ---
    function injectGlobalSettings() {
        // In Tavern, the header is a good place.
        const header = document.querySelector(TOP_MENU_SELECTOR);
        if (header && !document.getElementById('tavern-settings-btn-inline')) {
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'tavern-settings-btn-inline';
            settingsBtn.innerHTML = currentSettings.showSettingsText ? '⚙️ Formatter' : '⚙️';
            settingsBtn.title = 'Formatting Settings';
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                createSettingsModal();
            });

            // Insert it into the header.
            // The header has children: Left (Back), Center (Name), Right (Settings).
            // We'll insert it before the existing Settings button (id bits-XX or class with settings-2 icon).
            // Or just prepend to the header for simplicity on the left.
            header.appendChild(settingsBtn);
            // Or use flex order/prepend depending on where you want it.
            // Let's prepend to the right-side controls if possible, or just append to header.
            // Based on HTML: Header is flex justify-between.
            // Left is span(back, name). Right is button(settings).
            // Appending to header will put it on the far right.
        }
    }

    // --- INLINE BUTTONS ---
    function injectInlineButton() {
        const pos = currentSettings.buttonPosition;

        // --- INLINE TOP (Message Controls) ---
        if (pos === 'inline-top') {
            const allTargets = document.querySelectorAll(MSG_CONTROLS_SELECTOR);
            if (allTargets.length === 0) return;
            const lastTarget = allTargets[allTargets.length - 1]; // Only newest message

            if (lastTarget.querySelector('.tavern-formatter-btn-inline')) return;

            document.querySelectorAll('.tavern-formatter-btn-inline').forEach(btn => btn.remove());

            const btn = document.createElement('button');
            btn.className = 'tavern-formatter-btn-inline size-4'; // reuse size-4 class from site
            btn.innerHTML = currentSettings.showButtonText ? '✏️ Format' : '✏️';
            btn.title = 'Clean and Format';
            btn.style.width = 'auto'; // override size-4 fixed width if text is shown
            btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); executeFormat(); });

            // Prepend to controls
            lastTarget.prepend(btn);
        }

        // --- INLINE BOTTOM (Input Area) ---
        else if (pos === 'inline-bottom') {
            const inputArea = document.querySelector(INPUT_AREA_SELECTOR);
            if (!inputArea) return;

            // The input area is inside a relative div, next to the "Send" button container.
            // HTML: div.flex.items-end.gap-2 -> div(textarea) + button(send)
            // We want to add it to the button group below the textarea?
            // HTML: div.mt-3.flex.flex-wrap.gap-2 -> Continue, Improve.
            // Let's add it there, it's safer.
            const buttonRow = inputArea.closest('div.w-full.max-w-4xl').querySelector('.mt-3.flex.flex-wrap');

            if (!buttonRow) return;
            if (buttonRow.querySelector('.tavern-formatter-btn-inline')) return;

            document.querySelectorAll('.tavern-formatter-btn-inline').forEach(btn => btn.remove());

            const btn = document.createElement('button');
            // Copy styles from "Continue" button for consistency
            btn.className = 'tavern-formatter-btn-inline ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground h-9 px-3 flex-1 sm:flex-initial rounded-lg hover:bg-secondary/80 transition-all duration-200';
            btn.innerHTML = currentSettings.showButtonText ? '✏️ Auto-Format' : '✏️';
            btn.title = 'Clean and Format Last Message';
            btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); executeFormat(); });

            // Append to the row
            buttonRow.appendChild(btn);
        }
    }

    // --- FLOATING UI ---
    function createFloatingUI() {
        const container = document.createElement('div');
        container.id = 'tavern-editor-container';

        const size = currentSettings.floatSize || 50;
        const opacity = (currentSettings.floatOpacity || 50) / 100;

        container.style.opacity = opacity;
        document.body.appendChild(container);

        const formatBtn = document.createElement('button');
        formatBtn.innerHTML = '✏️';
        formatBtn.id = 'formatter-btn';
        formatBtn.style.width = `${size}px`;
        formatBtn.style.height = `${size}px`;
        formatBtn.style.fontSize = `${Math.max(14, size * 0.45)}px`;
        formatBtn.title = 'Format (Click) / Move (Drag)';
        container.appendChild(formatBtn);

        makeDraggable(container, formatBtn);
    }

    // --- SETTINGS MODAL ---
    function createSettingsModal() {
        if (document.getElementById('tavern-settings-modal')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'tavern-settings-modal';

        modalOverlay.innerHTML = `
            <div class="tavern-modal-content">
                <h3>Formatter Settings</h3>

                <div class="setting-scroll-area">
                    <div class="setting-section">
                        <h4>Interface</h4>
                        <div class="setting-group">
                            <label>Button Position:</label>
                            <select id="setting-pos">
                                <option value="floating">Floating (Draggable)</option>
                                <option value="inline-top">Inline Top (Message Controls)</option>
                                <option value="inline-bottom">Inline Bottom (Input Area)</option>
                            </select>
                        </div>

                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-showsettings-text" ${currentSettings.showSettingsText ? 'checked' : ''}>
                            <label for="setting-showsettings-text">Show Text on Settings Button</label>
                        </div>

                        <div id="inline-text-option" class="setting-group checkbox" style="display:none;">
                            <input type="checkbox" id="setting-showtext" ${currentSettings.showButtonText ? 'checked' : ''}>
                            <label for="setting-showtext">Show Text on Format Button</label>
                        </div>

                        <div id="float-options" style="display:none; padding-left:10px; border-left:2px solid #444;">
                            <div class="setting-group">
                                <button id="reset-float-pos" style="background:#444; margin-bottom:10px;">Reset Position to Center</button>
                            </div>
                            <div class="setting-group">
                                <label>Size: <span id="size-val">${currentSettings.floatSize}</span>px</label>
                                <input type="range" id="setting-size" min="30" max="100" value="${currentSettings.floatSize}">
                            </div>
                            <div class="setting-group">
                                <label>Opacity: <span id="op-val">${currentSettings.floatOpacity}</span>%</label>
                                <input type="range" id="setting-opacity" min="10" max="100" value="${currentSettings.floatOpacity}">
                            </div>
                        </div>
                    </div>

                    <div class="setting-section">
                        <h4>Text Style</h4>
                        <div class="setting-group">
                            <label>Narration Format:</label>
                            <select id="setting-style">
                                <option value="italic">Classic (*Narr* "Dial")</option>
                                <option value="bold">Bold Narration (**Narr** "Dial")</option>
                                <option value="bold-italic">Bold Dial + Italic Narr</option>
                                <option value="bold-plain">Bold Dial + Plain Narr</option>
                                <option value="none">Plain Text (No formatting)</option>
                            </select>
                        </div>
                    </div>

                    <div class="setting-section">
                        <h4>Cleaning</h4>
                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-think" ${currentSettings.removeThinkTags ? 'checked' : ''}>
                            <label for="setting-think">Remove &lt;think&gt; content</label>
                        </div>
                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-gentags" ${currentSettings.removeGeneralTags !== false ? 'checked' : ''}>
                            <label for="setting-gentags">Clean other tags (keep content)</label>
                        </div>
                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-prompt" ${currentSettings.removeSystemPrompt ? 'checked' : ''}>
                            <label for="setting-prompt">Remove System Prompts</label>
                        </div>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button id="save-settings">Save & Close</button>
                    <button id="cancel-settings" style="background:#555">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        const posSelect = document.getElementById('setting-pos');
        const floatOpts = document.getElementById('float-options');
        const inlineTextOpt = document.getElementById('inline-text-option');
        const sizeInput = document.getElementById('setting-size');
        const opInput = document.getElementById('setting-opacity');

        posSelect.value = currentSettings.buttonPosition;
        document.getElementById('setting-style').value = currentSettings.styleMode;

        const updateVis = () => {
            const val = posSelect.value;
            floatOpts.style.display = val === 'floating' ? 'block' : 'none';
            inlineTextOpt.style.display = val.includes('inline') ? 'flex' : 'none';
        };
        posSelect.addEventListener('change', updateVis);
        updateVis();

        sizeInput.addEventListener('input', (e) => document.getElementById('size-val').innerText = e.target.value);
        opInput.addEventListener('input', (e) => document.getElementById('op-val').innerText = e.target.value);

        document.getElementById('reset-float-pos').onclick = () => {
            const container = document.getElementById('tavern-editor-container');
            if (container) {
                const centerX = (window.innerWidth / 2) - (container.offsetWidth / 2);
                const centerY = (window.innerHeight / 2) - (container.offsetHeight / 2);
                container.style.left = centerX + 'px';
                container.style.top = centerY + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                localStorage.setItem(POSITION_KEY, JSON.stringify({ left: container.style.left, top: container.style.top }));
            }
        };

        document.getElementById('save-settings').onclick = () => {
            saveSettings({
                styleMode: document.getElementById('setting-style').value,
                removeThinkTags: document.getElementById('setting-think').checked,
                removeGeneralTags: document.getElementById('setting-gentags').checked,
                removeSystemPrompt: document.getElementById('setting-prompt').checked,
                buttonPosition: posSelect.value,
                showButtonText: document.getElementById('setting-showtext').checked,
                showSettingsText: document.getElementById('setting-showsettings-text').checked,
                floatSize: parseInt(sizeInput.value),
                floatOpacity: parseInt(opInput.value)
            });
            modalOverlay.remove();
        };
        document.getElementById('cancel-settings').onclick = () => modalOverlay.remove();
    }

    // --- DRAG LOGIC ---
    function makeDraggable(container, handle) {
        let isDragging = false;
        let wasDragged = false;
        let startX, startY, initialLeft, initialTop;

        const savedPos = localStorage.getItem(POSITION_KEY);
        if (savedPos) {
            const { left, top } = JSON.parse(savedPos);
            container.style.left = left;
            container.style.top = top;
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }

        function onStart(e) {
            isDragging = true; wasDragged = false;
            handle.classList.add('is-dragging');
            container.style.opacity = '1';
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
            e.preventDefault();
        }

        function onMove(e) {
            if (!isDragging) return;
            wasDragged = true; e.preventDefault();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;
            let newLeft = Math.max(0, Math.min(initialLeft + dx, window.innerWidth - container.offsetWidth));
            let newTop = Math.max(0, Math.min(initialTop + dy, window.innerHeight - container.offsetHeight));
            container.style.left = `${newLeft}px`;
            container.style.top = `${newTop}px`;
            container.style.right = 'auto'; container.style.bottom = 'auto';
        }

        function onEnd() {
            isDragging = false;
            handle.classList.remove('is-dragging');
            container.style.opacity = (currentSettings.floatOpacity || 50) / 100;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchend', onEnd);
            if (wasDragged) {
                localStorage.setItem(POSITION_KEY, JSON.stringify({ left: container.style.left, top: container.style.top }));
            } else {
                executeFormat();
            }
        }
        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart, { passive: false });
    }

    // --- KEYBOARD FIX (Floating only) ---
    async function waitForInput() {
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                const el = document.querySelector(INPUT_AREA_SELECTOR);
                if (el) { observer.disconnect(); resolve(el); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    async function initKeyboardFix() {
        const input = await waitForInput();
        const container = document.getElementById('tavern-editor-container');
        if (input && container) {
            input.addEventListener('focus', () => container.style.display = 'none');
            input.addEventListener('blur', () => setTimeout(() => container.style.display = 'flex', 200));
        }
    }

    // --- STYLES ---
    GM_addStyle(`
        /* Floating Button */
        #tavern-editor-container { position: fixed; z-index: 9999; display: flex; align-items: flex-end; gap: 5px; transition: opacity 0.2s; }
        #tavern-editor-container button { border: none; border-radius: 50%; color: white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; }
        #formatter-btn { background-color: #6d28d9; } /* Tavern Primary Color */
        #formatter-btn.is-dragging { transform: scale(1.1); box-shadow: 0 8px 16px rgba(0,0,0,0.5); }

        /* Inline Button - Common */
        .tavern-formatter-btn-inline {
            cursor: pointer; display: inline-flex; justify-content: center; align-items: center;
        }

        /* Settings Trigger (Top Menu) */
        #tavern-settings-btn-inline {
            background: transparent; border: none; color: #fff; cursor: pointer;
            font-size: 14px; margin-left: 10px; font-weight: bold; padding: 5px;
            white-space: nowrap; display: flex; align-items: center;
        }
        #tavern-settings-btn-inline:hover { opacity: 0.8; }

        /* Modal Styles */
        #tavern-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; }
        .tavern-modal-content { background: #030712; color: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif; display: flex; flex-direction: column; max-height: 90vh; border: 1px solid #333; }
        .setting-scroll-area { overflow-y: auto; flex: 1; margin-bottom: 10px; }
        .setting-section { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333; }
        .setting-section h4 { margin: 0 0 10px 0; color: #6d28d9; text-transform: uppercase; font-size: 12px; }
        .setting-group { margin-bottom: 15px; display: flex; flex-direction: column; }
        .setting-group.checkbox { flex-direction: row; align-items: center; gap: 10px; }
        .setting-group select, .setting-group input[type="range"] { padding: 8px; border-radius: 4px; background: #111827; color: white; border: 1px solid #374151; width: 100%; box-sizing: border-box; }
        .modal-buttons { display: flex; gap: 10px; margin-top: auto; }
        .modal-buttons button { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; background: #6d28d9; font-weight: bold; }

        @media (min-width: 769px) { #tavern-editor-container { right: 27%; bottom: 12%; } }
        @media (max-width: 768px) { #tavern-editor-container { right: 5%; bottom: 20%; } }
    `);

    initUI();
    console.log('Tavern Formatter v1.0 Loaded');
})();