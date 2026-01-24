// ==UserScript==
// @name         Janitor AI - Automatic Message Formatting Corrector (Settings Menu)
// @namespace    http://tampermonkey.net/
// @version      10.8
// @description  The "One-Click" cleanup script. Floating, Inline Top, or Inline Bottom. Select Italics/Bold/Plain text. Edge compatible.
// @author       accforfaciet
// @match        *://janitorai.com/chats/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551458/Janitor%20AI%20-%20Automatic%20Message%20Formatting%20Corrector%20%28Settings%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551458/Janitor%20AI%20-%20Automatic%20Message%20Formatting%20Corrector%20%28Settings%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS & DEFAULTS ---
    const DEBUG_MODE = false;
    const POSITION_KEY = 'janitorFormatterPosition';
    const SETTINGS_KEY = 'janitorFormatterSettings';

    const DEFAULT_SETTINGS = {
        // Formatting
        styleMode: 'italic',
        removeThinkTags: true,
        removeSystemPrompt: true,
        removeGeneralTags: true,
        removeEmDashes: false,
        removeEllipses: false, // New: Disabled by default
        // UI
        buttonPosition: 'floating',
        floatSize: 50,
        floatOpacity: 50,
        showButtonText: true,
        showSettingsText: true
    };

    // --- SELECTORS ---
    const EDIT_BUTTON_SELECTOR = 'button[title="Edit Message"], button[aria-label="Edit"]';
    const TEXT_AREA_SELECTOR = 'textarea[class*="_autoResizeTextarea"], textarea[placeholder^="Type a message"], textarea[style*="font-size: 16px"]';
    const CONFIRM_BUTTON_SELECTOR = 'button[aria-label="Confirm"], button[aria-label="Save"], button[aria-label*="Confirm"], button[aria-label*="Save"]';

    // UI Selectors
    const MSG_CONTROLS_SELECTOR = '[class*="messageControls"], [class*="_messageControls_"]'; // Top
    const MSG_NEXT_BTN_SELECTOR = 'button[aria-label="Next"]'; // Bottom (Footer)
    const TOP_MENU_SELECTOR = '[class*="menuWrapper"], [class*="_menuWrapper_"]'; // Global Settings

    // --- STATE ---
    let currentSettings = loadSettings();
    let uiObserver = null;

    // --- HELPER FUNCTIONS ---
    function debugLog(...args) { if (DEBUG_MODE) console.log('[DEBUG]', ...args); }

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        let parsed = saved ? JSON.parse(saved) : {};
        if (parsed.buttonPosition === 'inline') {
            parsed.buttonPosition = 'inline-top';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
    }

    function saveSettings(newSettings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        currentSettings = newSettings;
        cleanupUI();
        initUI();
    }

    function waitForElement(selector, timeoutMs = 5000) {
        return new Promise(resolve => {
            let el = document.querySelector(selector);
            if (el) return resolve(el);
            const startTime = Date.now();
            const observer = new MutationObserver(() => {
                el = document.querySelector(selector);
                if (el) { observer.disconnect(); resolve(el); }
                else if (Date.now() - startTime > timeoutMs) { observer.disconnect(); resolve(null); }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        });
    }

    // --- TEXT PROCESSING ---
    function processText(text) {
        
        // 1. Check for "Whole Message is Thought" Edge Case
        // If the entire message is wrapped in <think> tags, we strip the tags but KEEP the content.
        const trimmed = text.trim();
        const wholeMsgRegex = /^<(think|thought|thoughts)>([\s\S]*?)<\/(think|thought|thoughts)>$/i;
        const wholeMatch = trimmed.match(wholeMsgRegex);

        if (wholeMatch) {
            // It is a whole message thought. Remove the wrapper tags, keep content.
            // We replace the start/end tags in the original text to preserve surrounding whitespace if any
            text = text.replace(/^[\s\n]*<(think|thought|thoughts)>/i, '')
                       .replace(/<\/(think|thought|thoughts)>[\s\n]*$/i, '');
        } else {
            // Normal behavior: Remove <think> AND its content if enabled
            if (currentSettings.removeThinkTags) {
                text = text.replace(/\n?\s*<(thought|thoughts)>[\s\S]*?<\/(thought|thoughts)>\s*\n?/g, '');
                text = text.replace(/\n?\s*<think>[\s\S]*?<\/think>\s*\n?/g, '');
                text = text.replace('</think>', '');
                text = text.replace(/<(system|response)>|<\/response>/g, '');
            }
        }

        // 2. Remove Em Dashes (If enabled)
        if (currentSettings.removeEmDashes) {
            text = text.replace(/—/g, ' ').replace(/ {2,}/g, ' ');
        }

        // 3. Remove Ellipses (If enabled)
        if (currentSettings.removeEllipses) {
            // Replace ... or … with a single period.
            text = text.replace(/\.{3,}|…/g, '.');
            // Cleanup: If this created double periods (e.g. ".."), fix them.
            text = text.replace(/\.{2,}/g, '.');
        }

        // 4. General Tag Cleaning
        if (currentSettings.removeGeneralTags) {
            text = text.replace(/<\/?[a-zA-Z0-9:-]+(\s[^>]*)?>/g, '');
        }

        // 5. Remove System Prompt
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

    // --- EXECUTION ---
    async function executeFormat() {
        debugLog('Start Format');
        try {
            const allEditButtons = document.querySelectorAll(EDIT_BUTTON_SELECTOR);
            if (allEditButtons.length === 0) return debugLog('No edit buttons');

            const lastEditButton = allEditButtons[allEditButtons.length - 1];
            lastEditButton.click();
            
            await new Promise(r => setTimeout(r, 600));

            const textField = await waitForElement(TEXT_AREA_SELECTOR);
            if (!textField) return debugLog('Text field not found');

            const newText = processText(textField.value);

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textField, newText);
            textField.dispatchEvent(new Event('input', { bubbles: true }));

            const confirmButton = await waitForElement(CONFIRM_BUTTON_SELECTOR);
            if (confirmButton) confirmButton.click();

        } catch (error) {
            console.error('JanitorFormatter Error:', error);
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
        
        initKeyboardFix();
    }

    function cleanupUI() {
        const floatContainer = document.getElementById('janitor-editor-container');
        if (floatContainer) floatContainer.remove();

        document.querySelectorAll('.janitor-formatter-btn-inline').forEach(el => el.remove());
        
        const settingsTrigger = document.getElementById('janitor-settings-btn-inline');
        if (settingsTrigger) settingsTrigger.remove();
        
        if (uiObserver) {
            uiObserver.disconnect();
            uiObserver = null;
        }
    }

    // --- SETTINGS BUTTON (Top Menu) ---
    function injectGlobalSettings() {
        const menuWrapper = document.querySelector(TOP_MENU_SELECTOR);
        if (menuWrapper && !document.getElementById('janitor-settings-btn-inline')) {
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'janitor-settings-btn-inline';
            settingsBtn.innerHTML = currentSettings.showSettingsText ? '⚙️ Formatter' : '⚙️';
            settingsBtn.title = 'Formatting Settings';
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                createSettingsModal();
            });
            menuWrapper.prepend(settingsBtn);
        }
    }

    // --- INLINE BUTTON (Top or Bottom) ---
    function injectInlineButton() {
        const pos = currentSettings.buttonPosition; 
        
        // --- INLINE TOP (Controls) ---
        if (pos === 'inline-top') {
            const allTargets = document.querySelectorAll(MSG_CONTROLS_SELECTOR);
            if (allTargets.length === 0) return;
            const lastTarget = allTargets[allTargets.length - 1];

            if (lastTarget.querySelector('.janitor-formatter-btn-inline')) return; 

            document.querySelectorAll('.janitor-formatter-btn-inline').forEach(btn => btn.remove());

            const btn = document.createElement('button');
            btn.className = 'janitor-formatter-btn-inline';
            btn.innerHTML = currentSettings.showButtonText ? '✏️ Auto-Format' : '✏️';
            btn.title = 'Clean and Format';
            btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); executeFormat(); });
            
            lastTarget.prepend(btn);
        }

        // --- INLINE BOTTOM (Message Footer / Next Button) ---
        else if (pos === 'inline-bottom') {
            const allNextButtons = document.querySelectorAll(MSG_NEXT_BTN_SELECTOR);
            if (allNextButtons.length === 0) return;
            const lastNextBtn = allNextButtons[allNextButtons.length - 1];
            const targetContainer = lastNextBtn.parentElement; 

            if (targetContainer.querySelector('.janitor-formatter-btn-inline')) return; 

            document.querySelectorAll('.janitor-formatter-btn-inline').forEach(btn => btn.remove());

            const btn = document.createElement('button');
            btn.className = 'janitor-formatter-btn-inline';
            btn.innerHTML = currentSettings.showButtonText ? '✏️ Auto-Format' : '✏️';
            btn.title = 'Clean and Format';
            btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); executeFormat(); });

            targetContainer.style.display = 'flex';
            targetContainer.style.flexDirection = 'row';
            targetContainer.style.alignItems = 'center';
            targetContainer.style.gap = '8px';

            targetContainer.prepend(btn);
        }
    }

    // --- FLOATING UI ---
    function createFloatingUI() {
        const container = document.createElement('div');
        container.id = 'janitor-editor-container';
        
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
        if (document.getElementById('janitor-settings-modal')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'janitor-settings-modal';
        
        modalOverlay.innerHTML = `
            <div class="janitor-modal-content">
                <h3>Formatter Settings</h3>
                
                <div class="setting-scroll-area">
                    <div class="setting-section">
                        <h4>Interface</h4>
                        <div class="setting-group">
                            <label>Button Position:</label>
                            <select id="setting-pos">
                                <option value="floating">Floating (Draggable)</option>
                                <option value="inline-top">Inline Top (Message Controls)</option>
                                <option value="inline-bottom">Inline Bottom (Message Footer)</option>
                            </select>
                        </div>

                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-showsettings-text" ${currentSettings.showSettingsText ? 'checked' : ''}>
                            <label for="setting-showsettings-text">Show Text on Settings Button (Top Right)</label>
                        </div>
                        
                        <div id="inline-text-option" class="setting-group checkbox" style="display:none;">
                            <input type="checkbox" id="setting-showtext" ${currentSettings.showButtonText ? 'checked' : ''}>
                            <label for="setting-showtext">Show Text on Format Button (Inline)</label>
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
                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-emdashes" ${currentSettings.removeEmDashes ? 'checked' : ''}>
                            <label for="setting-emdashes">Remove Em Dashes (—)</label>
                        </div>
                        <div class="setting-group checkbox">
                            <input type="checkbox" id="setting-ellipses" ${currentSettings.removeEllipses ? 'checked' : ''}>
                            <label for="setting-ellipses">Remove Ellipses (...)</label>
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
            const container = document.getElementById('janitor-editor-container');
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
                removeEmDashes: document.getElementById('setting-emdashes').checked,
                removeEllipses: document.getElementById('setting-ellipses').checked,
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

    // --- KEYBOARD FIX ---
    async function initKeyboardFix() {
        const input = await waitForElement('textarea[placeholder^="Type a message"]');
        const container = document.getElementById('janitor-editor-container');
        if (input && container) {
            input.addEventListener('focus', () => container.style.display = 'none');
            input.addEventListener('blur', () => setTimeout(() => container.style.display = 'flex', 200));
        }
    }

    // --- STYLES ---
    GM_addStyle(`
        /* Floating Button */
        #janitor-editor-container { position: fixed; z-index: 9999; display: flex; align-items: flex-end; gap: 5px; transition: opacity 0.2s; }
        #janitor-editor-container button { border: none; border-radius: 50%; color: white; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; }
        #formatter-btn { background-color: #c9226e; }
        #formatter-btn.is-dragging { transform: scale(1.1); box-shadow: 0 8px 16px rgba(0,0,0,0.5); }
        
        /* Inline Button - Common */
        .janitor-formatter-btn-inline {
            background: transparent; border: none !important; color: #fff;
            border-radius: 4px; cursor: pointer; width: auto; height: 30px;
            display: inline-flex; justify-content: center; align-items: center;
            font-size: 14px; margin-right: 8px; flex-shrink: 0; padding: 0 5px;
        }
        .janitor-formatter-btn-inline:hover { background: rgba(201, 34, 110, 0.2); }

        /* Ensure Flex for controls */
        [class*="messageControls"] { display: flex !important; flex-direction: row !important; align-items: center !important; }

        /* Settings Trigger */
        #janitor-settings-btn-inline {
            background: transparent; border: none; color: #aaa; cursor: pointer;
            font-size: 14px; margin-right: 15px; font-weight: bold; padding: 5px;
            white-space: nowrap; display: flex; align-items: center;
        }
        #janitor-settings-btn-inline:hover { color: white; }
        
        /* Modal Styles */
        #janitor-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; }
        .janitor-modal-content { background: #1f1f1f; color: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif; display: flex; flex-direction: column; max-height: 90vh; }
        .setting-scroll-area { overflow-y: auto; flex: 1; margin-bottom: 10px; }
        .setting-section { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333; }
        .setting-section h4 { margin: 0 0 10px 0; color: #c9226e; text-transform: uppercase; font-size: 12px; }
        .setting-group { margin-bottom: 15px; display: flex; flex-direction: column; }
        .setting-group.checkbox { flex-direction: row; align-items: center; gap: 10px; }
        .setting-group select, .setting-group input[type="range"] { padding: 8px; border-radius: 4px; background: #333; color: white; border: 1px solid #555; width: 100%; box-sizing: border-box; }
        .modal-buttons { display: flex; gap: 10px; margin-top: auto; }
        .modal-buttons button { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; background: #c9226e; font-weight: bold; }
        
        @media (min-width: 769px) { #janitor-editor-container { right: 27%; bottom: 12%; } }
        @media (max-width: 768px) { #janitor-editor-container { right: 5%; bottom: 20%; } }
    `);

    initUI();
    console.log('Janitor Formatter v10.8 Loaded');
})();