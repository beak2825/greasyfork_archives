// ==UserScript==
// @name         AI Studio Themer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A collapsible, draggable panel with warm theme presets to fully customize aistudio.google.com.
// @author       LetMeFixIt
// @match        https://aistudio.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552426/AI%20Studio%20Themer.user.js
// @updateURL https://update.greasyfork.org/scripts/552426/AI%20Studio%20Themer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- //
    // --- --- --- --- --- --- --- THEME PRESETS --- --- --- --- --- --- --- //

    const PRESETS = {
        'custom': { name: "Custom", colors: {} },
        'default_dark': {
            name: "Default Dark",
            colors: { background: '#2B2B2B', panels: '#212121', bubbles: '#363636', text: '#E0E0E0' }
        },
        'sunset': {
            name: "Sunset",
            colors: { background: '#3c2f2f', panels: '#4a3a3a', bubbles: '#5e4a4a', text: '#e8c4b8' }
        },
        'emberfall': {
            name: "Emberfall",
            colors: { background: '#382B2B', panels: '#453636', bubbles: '#5A4848', text: '#E8C4B8' }
        },
        'volcanic_dusk': {
            name: "Volcanic Dusk",
            colors: { background: '#2E2525', panels: '#3D3232', bubbles: '#524545', text: '#DDC2B9' }
        },
        'midnight_campfire': {
            name: "Midnight Campfire",
            colors: { background: '#242121', panels: '#312D2D', bubbles: '#454040', text: '#D1C0B9' }
        }
    };
    const styleElementId = 'ai-studio-draggable-styler-v5';
    let colorPickers = {}; // Globally scoped within the script

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- //
    // --- --- --- --- --- --- STYLE INJECTION --- --- --- --- --- --- --- //

    function addStyle_TrustedHTML_Safe(css) {
        let styleElement = document.getElementById(styleElementId);
        if (styleElement) styleElement.remove();
        styleElement = document.createElement('style');
        styleElement.id = styleElementId;
        styleElement.appendChild(document.createTextNode(css));
        document.head.appendChild(styleElement);
    }

    function applyCustomColors(bgColor, panelColor, bubbleColor, textColor) {
        const customStyles = `
            /* Main Background */
            body, ms-app, .makersuite-layout, .layout-main, ms-chunk-editor section.chunk-editor-main {
                background-color: ${bgColor} !important;
            }
            /* Side Panels & Dropdowns */
            ms-navbar .nav-content, ms-right-side-panel > div, .mat-expansion-panel,
            .mat-mdc-select-panel, .mat-mdc-menu-panel {
                background-color: ${panelColor} !important;
            }
            /* Chat Bubbles & Inputs */
            .chat-turn-container.user, .chat-turn-container.model,
            ms-autosize-textarea .textarea, .prompt-input-wrapper-container {
                background-color: ${bubbleColor} !important;
                border: 1px solid #4f4f4f !important;
            }
            /* Text Coloring (Comprehensive) */
            body, p, span, h1, h2, h3, h4, a, label, ms-cmark-node, .token-container,
            ms-navbar, ms-right-side-panel, .mat-expansion-panel-header-title,
            .mat-expansion-panel-header-description, .run-settings-content .setting-label,
            .mat-mdc-slider-label, .model-display-name, .model-description,
            .mat-mdc-select-value-text, .mat-mdc-option-text, .mat-mdc-form-field,
            .section-title, .disclaimer, .toggle-with-description .description,
            button, .mat-mdc-menu-item, .mat-mdc-tab-labels .mdc-tab__text-label,
            .author-label, .documentation-link, .view-status-link {
                color: ${textColor} !important;
            }
            /* SVG Logo & Icons */
            .lockup-logo path, .material-symbols-outlined {
                fill: ${textColor} !important;
                color: ${textColor} !important;
            }
            /* Code Block Text & Background */
            ms-code-block pre, ms-code-block code, ms-code-block .container {
                background-color: #1a1a1a !important;
            }
            ms-code-block code, ms-code-block code span, .hljs, .hljs-keyword, .hljs-comment {
                color: ${textColor} !important;
                -webkit-text-fill-color: ${textColor} !important;
            }
            /* UI Cleanup */
            .mat-expansion-panel-header, button[ms-button] { background-color: transparent !important; }
            ms-chat-session, .chat-view-container, .chat-container, ms-toolbar,
            ms-prompt-input-wrapper, footer, .run-settings-content { background-color: transparent !important; }
            .theme-panel-hidden { display: none !important; }
        `;
        addStyle_TrustedHTML_Safe(customStyles);
    }


    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- //
    // --- --- --- --- --- --- DRAGGABLE UI PANEL --- --- --- --- --- --- --- //

    function createDraggablePanel() {
        // --- Toggler Icon ---
        const toggler = document.createElement('div');
        toggler.textContent = '🎨';
        Object.assign(toggler.style, {
            position: 'fixed', bottom: '15px', left: '15px', zIndex: '9999',
            width: '40px', height: '40px', backgroundColor: '#333', border: '1px solid #666',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', cursor: 'pointer', userSelect: 'none'
        });

        // --- Panel Container ---
        const panel = document.createElement('div');
        panel.id = 'theme-panel-container';
        Object.assign(panel.style, {
            position: 'fixed', zIndex: '10000', backgroundColor: 'rgba(50, 50, 50, 0.9)',
            border: '1px solid #666', borderRadius: '10px', fontFamily: 'sans-serif',
            fontSize: '14px', backdropFilter: 'blur(5px)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        });

        // --- Draggable Header (SAFE VERSION - NO innerHTML) ---
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '8px 12px', cursor: 'move', color: '#fff', backgroundColor: 'rgba(80, 80, 80, 0.7)',
            borderTopLeftRadius: '10px', borderTopRightRadius: '10px',
            borderBottom: '1px solid #666', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        });
        const titleSpan = document.createElement('span');
        titleSpan.textContent = '🎨 Theme';
        const closeButton = document.createElement('span');
        closeButton.textContent = '\u00D7'; // '×' symbol
        Object.assign(closeButton.style, { cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' });
        header.appendChild(titleSpan);
        header.appendChild(closeButton);
        panel.appendChild(header);

        const content = document.createElement('div');
        Object.assign(content.style, { padding: '12px', lineHeight: '2.2' });
        panel.appendChild(content);

        // --- Helper: Create a color picker row ---
        const createPicker = (labelText, key) => {
            const wrapper = document.createElement('div');
            const label = document.createElement('label');
            label.innerText = labelText;
            label.style.color = '#fff';
            label.style.marginRight = '10px';
            const input = document.createElement('input');
            input.type = 'color';
            input.addEventListener('input', () => {
                GM_setValue(key, input.value);
                GM_setValue('activePreset', 'custom');
                document.getElementById('theme-preset-selector').value = 'custom';
                updateColors();
            });
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            colorPickers[key] = input;
            return wrapper;
        };

        // --- Helper: Create Preset Selector ---
        const createPresetSelector = () => {
            const wrapper = document.createElement('div');
            const label = document.createElement('label');
            label.innerText = 'Presets:';
            Object.assign(label.style, { color: '#fff', marginRight: '10px' });
            const selector = document.createElement('select');
            selector.id = 'theme-preset-selector';
            selector.style.width = '120px';
            Object.keys(PRESETS).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = PRESETS[key].name;
                selector.appendChild(option);
            });
            selector.addEventListener('change', (e) => applyPreset(e.target.value));
            wrapper.appendChild(label);
            wrapper.appendChild(selector);
            return wrapper;
        };

        content.appendChild(createPresetSelector());
        content.appendChild(createPicker('Background:', 'customBackgroundColor'));
        content.appendChild(createPicker('Panels:', 'customPanelColor'));
        content.appendChild(createPicker('Bubbles:', 'customBubbleColor'));
        content.appendChild(createPicker('Text:', 'customTextColor'));

        // --- Dragging Logic ---
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target === closeButton) return; // Don't drag when clicking the close button
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - offsetX));
            let newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - offsetY));
            panel.style.left = `${newX}px`;
            panel.style.top = `${newY}px`;
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            panel.style.transition = '';
            GM_setValue('panelPosition', { top: panel.style.top, left: panel.style.left });
        });

        // --- Toggling Logic ---
        const togglePanel = (show) => {
            panel.classList.toggle('theme-panel-hidden', !show);
            toggler.classList.toggle('theme-panel-hidden', show);
            GM_setValue('panelVisible', show);
        };
        toggler.addEventListener('click', () => togglePanel(true));
        closeButton.addEventListener('click', () => togglePanel(false));

        // --- Restore Position & State & Append to Body ---
        const savedPosition = GM_getValue('panelPosition', { top: 'calc(100vh - 250px)', left: '15px' });
        panel.style.top = savedPosition.top;
        panel.style.left = savedPosition.left;
        document.body.appendChild(panel);
        document.body.appendChild(toggler);
        togglePanel(GM_getValue('panelVisible', false));
    }


    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- //
    // --- --- --- --- --- --- SCRIPT EXECUTION --- --- --- --- --- --- -- //

    function applyPreset(presetKey) {
        if (!PRESETS[presetKey] || presetKey === 'custom') {
            GM_setValue('activePreset', 'custom');
            updateUIAfterColorChange(); // Ensure custom colors are applied if switching to custom
            return;
        }
        const { background, panels, bubbles, text } = PRESETS[presetKey].colors;
        GM_setValue('customBackgroundColor', background);
        GM_setValue('customPanelColor', panels);
        GM_setValue('customBubbleColor', bubbles);
        GM_setValue('customTextColor', text);
        GM_setValue('activePreset', presetKey);
        updateUIAfterColorChange();
    }

    function updateColors() {
        const defaultTheme = PRESETS.midnight_campfire.colors; // Default to a nice warm theme
        const bgColor = GM_getValue('customBackgroundColor', defaultTheme.background);
        const panelColor = GM_getValue('customPanelColor', defaultTheme.panels);
        const bubbleColor = GM_getValue('customBubbleColor', defaultTheme.bubbles);
        const textColor = GM_getValue('customTextColor', defaultTheme.text);
        applyCustomColors(bgColor, panelColor, bubbleColor, textColor);
    }

    function updateUIAfterColorChange() {
        const defaultTheme = PRESETS.midnight_campfire.colors;
        colorPickers.customBackgroundColor.value = GM_getValue('customBackgroundColor', defaultTheme.background);
        colorPickers.customPanelColor.value = GM_getValue('customPanelColor', defaultTheme.panels);
        colorPickers.customBubbleColor.value = GM_getValue('customBubbleColor', defaultTheme.bubbles);
        colorPickers.customTextColor.value = GM_getValue('customTextColor', defaultTheme.text);
        updateColors();
    }

    // --- Main Initialization ---
    function initialize() {
        createDraggablePanel();
        const activePreset = GM_getValue('activePreset', 'midnight_campfire');
        document.getElementById('theme-preset-selector').value = activePreset;

        applyPreset(activePreset); // This will handle both presets and custom settings

        // --- FIX: Mutation Observer for SPA Navigation ---
        // AI Studio is a Single Page App. This observer re-applies the theme
        // when the user navigates to a new chat without a full page reload.
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        // ms-chunk-editor is a reliable element that appears when a chat is loaded.
                        if (node.nodeType === 1 && node.querySelector('ms-chunk-editor')) {
                            // Re-apply colors to the new DOM elements after a brief delay
                            // to ensure everything is rendered.
                            setTimeout(updateColors, 150);
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Use a brief delay to ensure the page is fully ready for DOM manipulation.
    // This is more reliable than 'load' in complex web apps.
    setTimeout(initialize, 500);

})();