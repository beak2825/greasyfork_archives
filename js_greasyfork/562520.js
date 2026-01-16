// ==UserScript==
// @name         Aither Trump Buttons
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Adds programmable buttons to Torrent Delete Message and Resolve Report panels
// @author       Auto
// @match        https://aither.cc/dashboard/trumps/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562520/Aither%20Trump%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/562520/Aither%20Trump%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const THEME_COLORS = {
        background: '#1e2332',
        backgroundLight: '#2a3142',
        border: '#888',
        text: '#fff',
        textMuted: '#aaa',
        accent: '#F5C518',
        accentText: '#1e2332',
        overlay: 'rgba(0,0,0,0.7)'
    };

    const Z_INDEX = {
        overlay: 999999,
        dialog: 1000000
    };

    const TIMING = {
        hoverTransition: 200,
        fadeInDuration: 250,
        mutationDebounce: 300,
        initialCheckDelay: 2000
    };

    const UI_DIMENSIONS = {
        buttonPadding: '6px 12px',
        containerPadding: '10px',
        borderRadius: '4px',
        buttonGap: '8px',
        dialogMinWidth: '400px',
        dialogMaxWidth: '600px'
    };

    const DEFAULT_BUTTONS = {
        deleteMessage: [
            { label: 'Season Pack', text: 'Season Pack' }
        ],
        resolveReport: [
            { label: 'Thank you', text: 'Thank you!' }
        ]
    };

    const PANEL_CONFIG = {
        deleteMessage: {
            heading: 'Torrent Removal',
            textareaId: 'bbcode-trumping_delete_message',
            displayName: 'Torrent Removal'
        },
        resolveReport: {
            heading: 'Resolve Report',
            textareaId: 'bbcode-verdict',
            displayName: 'Resolve Report'
        }
    };

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function fadeIn(element, duration = TIMING.fadeInDuration) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in`;
        element.offsetHeight;
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    function onKeyPress(key, callback) {
        const handler = (event) => {
            if (event.key === key) {
                callback(event);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }

    function getButtonConfig(panelType) {
        try {
            const savedConfig = GM_getValue(`buttons_${panelType}`, null);
            if (savedConfig) {
                return JSON.parse(savedConfig);
            }
        } catch (error) {
            console.warn(`[Aither Buttons] Failed to load config for ${panelType}:`, error);
        }
        return DEFAULT_BUTTONS[panelType];
    }

    function saveButtonConfig(panelType, config) {
        try {
            GM_setValue(`buttons_${panelType}`, JSON.stringify(config));
        } catch (error) {
            console.error(`[Aither Buttons] Failed to save config for ${panelType}:`, error);
            alert('Failed to save button configuration. Please try again.');
        }
    }

    function insertTextAtCursor(textarea, text) {
        if (!textarea) {
            console.warn('[Aither Buttons] Textarea not found for text insertion');
            return;
        }

        try {
            const startPosition = textarea.selectionStart || 0;
            const endPosition = textarea.selectionEnd || 0;
            const currentValue = textarea.value || '';
            const newValue = currentValue.substring(0, startPosition) + text + currentValue.substring(endPosition);
            textarea.value = newValue;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            const newCursorPosition = startPosition + text.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea.focus();
        } catch (error) {
            console.error('[Aither Buttons] Error inserting text:', error);
        }
    }

    function createQuickInsertButton(buttonConfig, buttonIndex, panelType, textareaId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'aither-quick-button';
        button.textContent = buttonConfig.label;
        button.title = buttonConfig.text ?
            `Click to insert: "${buttonConfig.text}"` :
            'Shift+Click or Ctrl+Click to configure';

        button.setAttribute('data-index', buttonIndex);
        button.setAttribute('data-panel', panelType);
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.shiftKey || event.ctrlKey) {
                configureIndividualButton(panelType, buttonIndex, button);
            } else {
                const targetTextarea = document.getElementById(textareaId);
                if (targetTextarea && buttonConfig.text) {
                    insertTextAtCursor(targetTextarea, buttonConfig.text);
                }
            }
        });
        return button;
    }

    function createSettingsButton(panelType, textareaId) {
        const settingsButton = document.createElement('button');
        settingsButton.type = 'button';
        settingsButton.textContent = '⚙️';
        settingsButton.className = 'aither-settings-button';
        settingsButton.title = 'Configure all buttons (Shift+Click or Ctrl+Click individual buttons)';
        settingsButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            showSettingsDialog(panelType, textareaId);
        });
        return settingsButton;
    }

    function createButtonContainer(panelType, textareaId) {
        const container = document.createElement('div');
        container.className = 'aither-button-container';
        container.setAttribute('data-panel', panelType);

        const buttonConfigs = getButtonConfig(panelType);
        buttonConfigs.forEach((config, index) => {
            const button = createQuickInsertButton(config, index, panelType, textareaId);
            container.appendChild(button);
        });
        const settingsButton = createSettingsButton(panelType, textareaId);
        container.appendChild(settingsButton);
        fadeIn(container);
        return container;
    }

    function configureIndividualButton(panelType, buttonIndex, buttonElement) {
        const currentConfig = getButtonConfig(panelType);
        const currentButton = currentConfig[buttonIndex];

        const newLabel = prompt(`Enter button label:`, currentButton.label);
        if (newLabel === null) return;
        const newText = prompt(`Enter text to insert when clicked:`, currentButton.text);
        if (newText === null) return;
        currentConfig[buttonIndex] = {
            label: newLabel || `Button ${buttonIndex + 1}`,
            text: newText || ''
        };
        saveButtonConfig(panelType, currentConfig);
        buttonElement.textContent = currentConfig[buttonIndex].label;
        buttonElement.title = currentConfig[buttonIndex].text ?
            `Click to insert: "${currentConfig[buttonIndex].text}"` :
            'Shift+Click or Ctrl+Click to configure';
    }

    function updateButtonIndices(dialogBody, configArray) {
        const rows = dialogBody.querySelectorAll('.aither-form-row');
        rows.forEach((row, index) => {
            const labels = row.querySelectorAll('.aither-form-label');
            if (labels.length >= 2) {
                labels[0].textContent = `Button ${index + 1} Label:`;
                labels[1].textContent = `Button ${index + 1} Text:`;
            }
            const labelInput = row.querySelector('.aither-form-input');
            if (labelInput) {
                labelInput.placeholder = `Button ${index + 1}`;
            }
        });
    }

    function createDialogFormRow(buttonConfig, buttonIndex, configArray, dialogBody) {
        const formRow = document.createElement('div');
        formRow.className = 'aither-form-row';
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'aither-delete-button';
        deleteButton.textContent = '×';
        deleteButton.title = 'Delete this button';
        deleteButton.addEventListener('click', () => {
            const hasContent = buttonConfig.label || buttonConfig.text;
            if (hasContent && !confirm('Delete this button?')) return;
            formRow.style.transition = 'opacity 200ms, transform 200ms';
            formRow.style.opacity = '0';
            formRow.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                configArray.splice(buttonIndex, 1);
                formRow.remove();
                updateButtonIndices(dialogBody, configArray);
            }, 200);
        });
        formRow.appendChild(deleteButton);
        const labelLabel = document.createElement('label');
        labelLabel.textContent = `Button ${buttonIndex + 1} Label:`;
        labelLabel.className = 'aither-form-label';
        formRow.appendChild(labelLabel);
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.value = buttonConfig.label;
        labelInput.className = 'aither-form-input';
        labelInput.placeholder = `Button ${buttonIndex + 1}`;
        formRow.appendChild(labelInput);
        const textLabel = document.createElement('label');
        textLabel.textContent = `Button ${buttonIndex + 1} Text:`;
        textLabel.className = 'aither-form-label';
        formRow.appendChild(textLabel);
        const textInput = document.createElement('textarea');
        textInput.value = buttonConfig.text;
        textInput.rows = 3;
        textInput.className = 'aither-form-textarea';
        textInput.placeholder = 'Text to insert when button is clicked';
        formRow.appendChild(textInput);
        labelInput.addEventListener('input', () => {
            configArray[buttonIndex].label = labelInput.value;
        });
        textInput.addEventListener('input', () => {
            configArray[buttonIndex].text = textInput.value;
        });
        return formRow;
    }

    function createAddButtonElement(configArray, dialogBody) {
        const addButton = document.createElement('button');
        addButton.className = 'aither-add-button';
        addButton.textContent = '+ Add Button';
        addButton.type = 'button';
        addButton.addEventListener('click', () => {
            if (configArray.length >= 20) {
                alert('Maximum 20 buttons allowed');
                return;
            }
            const newButton = { label: '', text: '' };
            configArray.push(newButton);
            const newRow = createDialogFormRow(
                newButton,
                configArray.length - 1,
                configArray,
                dialogBody
            );
            dialogBody.insertBefore(newRow, addButton);
            fadeIn(newRow);
            const firstInput = newRow.querySelector('.aither-form-input');
            if (firstInput) firstInput.focus();
        });
        return addButton;
    }

    function createDialogActionButtons(panelType, config, closeCallback) {
        const buttonRow = document.createElement('div');
        buttonRow.className = 'aither-dialog-actions';
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'aither-save-button';
        saveButton.addEventListener('click', () => {
            saveButtonConfig(panelType, config);
            if (confirm('Settings saved! Reload page to apply changes?')) {
                location.reload();
            } else {
                closeCallback();
            }
        });
        buttonRow.appendChild(saveButton);
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'aither-cancel-button';
        cancelButton.addEventListener('click', closeCallback);
        buttonRow.appendChild(cancelButton);
        return buttonRow;
    }

    function showSettingsDialog(panelType, textareaId) {
        const config = getButtonConfig(panelType);
        const existingDialog = document.getElementById('aither-settings-dialog');
        const existingOverlay = document.getElementById('aither-settings-overlay');
        if (existingDialog) existingDialog.remove();
        if (existingOverlay) existingOverlay.remove();
        const overlay = document.createElement('div');
        overlay.id = 'aither-settings-overlay';
        overlay.className = 'aither-overlay';
        const dialog = document.createElement('div');
        dialog.id = 'aither-settings-dialog';
        dialog.className = 'aither-dialog';
        const header = document.createElement('div');
        header.className = 'aither-dialog-header';
        const title = document.createElement('h3');
        title.textContent = `Configure Buttons - ${PANEL_CONFIG[panelType].displayName}`;
        title.className = 'aither-dialog-title';
        header.appendChild(title);
        const closeButton = document.createElement('span');
        closeButton.className = 'aither-close-button';
        closeButton.textContent = '×';
        closeButton.title = 'Close (Esc)';
        header.appendChild(closeButton);
        dialog.appendChild(header);
        const dialogBody = document.createElement('div');
        dialogBody.className = 'aither-dialog-body';
        config.forEach((buttonConfig, index) => {
            const formRow = createDialogFormRow(buttonConfig, index, config, dialogBody);
            dialogBody.appendChild(formRow);
        });
        const addButton = createAddButtonElement(config, dialogBody);
        dialogBody.appendChild(addButton);
        dialog.appendChild(dialogBody);
        const closeDialog = () => {
            overlay.remove();
            dialog.remove();
            if (escapeKeyCleanup) escapeKeyCleanup();
        };
        const actionButtons = createDialogActionButtons(panelType, config, closeDialog);
        dialog.appendChild(actionButtons);
        closeButton.addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);
        const escapeKeyCleanup = onKeyPress('Escape', closeDialog);
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        fadeIn(overlay, TIMING.fadeInDuration);
        fadeIn(dialog, TIMING.fadeInDuration);
        const firstInput = dialog.querySelector('.aither-form-input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    function findPanelByHeading(headingText) {
        const headings = document.querySelectorAll('h2.panel__heading');
        for (const heading of headings) {
            if (heading.textContent.trim() === headingText) {
                return heading.closest('section.panelV2');
            }
        }
        return null;
    }

    function injectButtonsIntoPanel(panelType) {
        const { heading, textareaId } = PANEL_CONFIG[panelType];
        const panel = findPanelByHeading(heading);
        if (!panel) return;
        if (panel.querySelector('.aither-button-container')) return;
        const textarea = document.getElementById(textareaId);
        if (!textarea) return;
        const headingElement = panel.querySelector('h2.panel__heading');
        if (!headingElement) return;
        const buttonContainer = createButtonContainer(panelType, textareaId);
        headingElement.parentNode.insertBefore(buttonContainer, headingElement.nextSibling);
    }

    function addButtonsToPanels() {
        Object.keys(PANEL_CONFIG).forEach(panelType => {
            injectButtonsIntoPanel(panelType);
        });
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButtonsToPanels);
        } else {
            addButtonsToPanels();
        }
        setTimeout(() => {
            if (!document.querySelector('.aither-button-container')) {
                addButtonsToPanels();
            }
        }, TIMING.initialCheckDelay);
        const debouncedAddButtons = debounce(addButtonsToPanels, TIMING.mutationDebounce);
        const contentObserver = new MutationObserver(debouncedAddButtons);
        const mainContent = document.querySelector('main') || document.body;
        contentObserver.observe(mainContent, {
            childList: true,
            subtree: true
        });
        console.log('[Aither Buttons] Initialized successfully');
    }

    GM_addStyle(`
        .aither-button-container {
            margin: 10px 0 !important;
            padding: ${UI_DIMENSIONS.containerPadding};
            background: ${THEME_COLORS.background};
            border: 1px solid ${THEME_COLORS.border};
            border-radius: ${UI_DIMENSIONS.borderRadius};
            display: flex;
            flex-wrap: wrap;
            gap: ${UI_DIMENSIONS.buttonGap};
            align-items: center;
        }
        .aither-quick-button {
            padding: ${UI_DIMENSIONS.buttonPadding};
            background: ${THEME_COLORS.background};
            color: ${THEME_COLORS.text};
            border: 1px solid ${THEME_COLORS.border};
            border-radius: ${UI_DIMENSIONS.borderRadius};
            cursor: pointer;
            font-size: 13px;
            transition: all ${TIMING.hoverTransition}ms ease;
            white-space: nowrap;
        }
        .aither-quick-button:hover {
            background: ${THEME_COLORS.accent} !important;
            color: ${THEME_COLORS.accentText} !important;
            border-color: ${THEME_COLORS.accent};
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .aither-quick-button:active {
            transform: translateY(0);
            box-shadow: none;
        }
        .aither-settings-button {
            padding: 6px 10px;
            background: ${THEME_COLORS.background};
            color: ${THEME_COLORS.textMuted};
            border: 1px solid ${THEME_COLORS.border};
            border-radius: ${UI_DIMENSIONS.borderRadius};
            cursor: pointer;
            font-size: 13px;
            margin-left: auto;
            transition: all ${TIMING.hoverTransition}ms ease;
        }
        .aither-settings-button:hover {
            color: ${THEME_COLORS.text};
            background: ${THEME_COLORS.backgroundLight};
        }
        .aither-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${THEME_COLORS.overlay};
            z-index: ${Z_INDEX.overlay};
            backdrop-filter: blur(2px);
        }
        .aither-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${THEME_COLORS.background};
            border: 1px solid ${THEME_COLORS.border};
            border-radius: 8px;
            padding: 0;
            z-index: ${Z_INDEX.dialog};
            min-width: ${UI_DIMENSIONS.dialogMinWidth};
            max-width: ${UI_DIMENSIONS.dialogMaxWidth};
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            color: ${THEME_COLORS.text};
            display: flex;
            flex-direction: column;
        }
        .aither-dialog-header {
            padding: 20px;
            border-bottom: 1px solid ${THEME_COLORS.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: ${THEME_COLORS.backgroundLight};
        }
        .aither-dialog-title {
            margin: 0;
            color: ${THEME_COLORS.text};
            font-size: 18px;
            font-weight: 600;
        }
        .aither-close-button {
            color: ${THEME_COLORS.textMuted};
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            line-height: 20px;
            transition: color ${TIMING.hoverTransition}ms ease;
            padding: 0 5px;
        }
        .aither-close-button:hover {
            color: ${THEME_COLORS.text};
        }
        .aither-dialog-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .aither-form-row {
            position: relative;
            margin-bottom: 20px;
            padding-top: 10px;
        }
        .aither-delete-button {
            position: absolute;
            top: 0;
            right: 0;
            background: transparent;
            border: none;
            color: ${THEME_COLORS.textMuted};
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            transition: color ${TIMING.hoverTransition}ms;
        }
        .aither-delete-button:hover {
            color: #ff4444;
        }
        .aither-add-button {
            width: 100%;
            padding: 12px;
            margin-top: 10px;
            background: ${THEME_COLORS.backgroundLight};
            border: 2px dashed ${THEME_COLORS.border};
            border-radius: ${UI_DIMENSIONS.borderRadius};
            color: ${THEME_COLORS.accent};
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all ${TIMING.hoverTransition}ms;
        }
        .aither-add-button:hover {
            background: #353d52;
            border-color: ${THEME_COLORS.accent};
        }
        .aither-form-label {
            display: block;
            margin: 10px 0 5px 0;
            color: ${THEME_COLORS.text};
            font-size: 13px;
            font-weight: 600;
        }
        .aither-form-input,
        .aither-form-textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid ${THEME_COLORS.border};
            border-radius: ${UI_DIMENSIONS.borderRadius};
            background: ${THEME_COLORS.backgroundLight};
            color: ${THEME_COLORS.text};
            font-size: 13px;
            box-sizing: border-box;
            transition: border-color ${TIMING.hoverTransition}ms ease;
        }
        .aither-form-input:focus,
        .aither-form-textarea:focus {
            outline: none;
            border-color: ${THEME_COLORS.accent};
        }
        .aither-form-textarea {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            resize: vertical;
        }
        .aither-dialog-actions {
            padding: 15px 20px;
            border-top: 1px solid ${THEME_COLORS.border};
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            background: ${THEME_COLORS.backgroundLight};
        }
        .aither-save-button,
        .aither-cancel-button {
            padding: 8px 20px;
            border: none;
            border-radius: ${UI_DIMENSIONS.borderRadius};
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all ${TIMING.hoverTransition}ms ease;
        }
        .aither-save-button {
            background: ${THEME_COLORS.accent};
            color: ${THEME_COLORS.accentText};
        }
        .aither-save-button:hover {
            background: #E5B508;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(245, 197, 24, 0.4);
        }
        .aither-cancel-button {
            background: ${THEME_COLORS.background};
            color: ${THEME_COLORS.text};
            border: 1px solid ${THEME_COLORS.border};
        }
        .aither-cancel-button:hover {
            background: ${THEME_COLORS.backgroundLight};
        }
        .aither-save-button:active,
        .aither-cancel-button:active {
            transform: translateY(0);
        }
    `);

    initialize();
})();
