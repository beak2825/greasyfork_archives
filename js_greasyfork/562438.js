// ==UserScript==
// @name         Habr UI Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Настраиваемый скрипт модификации интерфейса https://habr.com на стороне клиента
// @match        https://habr.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @supportURL   https://github.com/TheDerevtso/habr-ui-tweaks
// @author       Derevtso
// @license MIT
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@b3ac68b00ba88f7817270ca0ccd28424282a7973/gm_config.js
// @downloadURL https://update.greasyfork.org/scripts/562438/Habr%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/562438/Habr%20UI%20Tweaks.meta.js
// ==/UserScript==

/* globals GM_config */

(function() {
    'use strict';

    if (document.contentType && document.contentType !== 'text/html') return; // чтоб не лезть в svg

    const CONFIG_ID = 'HabrUITweaks_Config';

    // --- 0. DEFAULTS ---
    const DEFAULTS = {
        lang: 'auto',
        mode: 'mini',
        showCopy: true,
        safeArea: true,
        orientation: 'horizontal',
        iconSource: 'original',
        corner: 'bottom-right',
        opacity: 0.3
    };

    if (!GM_getValue(CONFIG_ID)) {
        GM_setValue(CONFIG_ID, JSON.stringify(DEFAULTS));
    }

    // --- 1. Язык ---
    let savedConfig = {};
    try { savedConfig = JSON.parse(GM_getValue(CONFIG_ID) || '{}'); } catch (e) {}
    const userLangSetting = savedConfig.lang || 'auto';

    let siteLang = document.documentElement.lang || '';
    if (!siteLang && window.location.pathname.includes('/ru/')) siteLang = 'ru';
    if (!siteLang && window.location.pathname.includes('/en/')) siteLang = 'en';
    const isRu = (userLangSetting === 'auto' && (siteLang.includes('ru') || siteLang === '')) || userLangSetting === 'ru';

    // --- 2. Константы ---
    const i18n = {
        title: isRu ? 'Настройки Habr UI Tweaks' : 'Habr UI Tweaks Settings',
        fields: {
            lang: { label: isRu ? 'Язык / Language' : 'Language', options: ['Авто', 'Русский', 'English'], values: ['auto', 'ru', 'en'] },
            mode: { label: isRu ? 'Кнопка "Объяснить"' : 'Explain Button', options: isRu ? ['Мини (в углу)', 'Обычная (внизу)', 'Скрыта'] : ['Mini (Corner)', 'Normal (Bottom)', 'Hidden'], values: ['mini', 'normal', 'hidden'], default: DEFAULTS.mode },
            showCopy: { label: isRu ? 'Кнопка "Копировать"' : 'Copy Button', labelCheckbox: isRu ? 'Включить' : 'Enable', default: DEFAULTS.showCopy },
            safeArea: { label: isRu ? 'Безопасная зона (отступы)' : 'Safe Area (Padding)', labelCheckbox: isRu ? 'Добавлять отступы коду' : 'Add padding to code', default: DEFAULTS.safeArea},
            orientation: { label: isRu ? 'Ориентация панели' : 'Stack Direction', options: isRu ? ['Горизонтально', 'Вертикально'] : ['Horizontal', 'Vertical'], values: ['horizontal', 'vertical'], default: DEFAULTS.orientation},
            iconSource: { label: isRu ? 'Иконка (для Мини)' : 'Icon (for Mini)', options: isRu ? ['🖼 Оригинал (Лого)', '✨ Искры (Текст)', '❓ Знак вопроса (Текст)'] : ['🖼 Original (Logo)', '✨ Sparkles (Text)', '❓ Question (Text)'], values: ['original', 'magic', 'question'], default: DEFAULTS.iconSource },
            corner: { label: isRu ? 'Позиция панели' : 'Panel Position', options: isRu ? ['↘ Низ-Право', '↗ Верх-Право'] : ['↘ Bottom-Right', '↗ Top-Right'], values: ['bottom-right', 'top-right'], default: DEFAULTS.corner},
            opacity: { label: isRu ? 'Прозрачность (для Мини)' : 'Opacity (for Mini)', default: DEFAULTS.opacity }
        },
        tooltips: {
            explain: isRu ? 'Объяснить код' : 'Explain code',
            copy: isRu ? 'Скопировать код' : 'Copy code'
        }
    };

    // --- 3. CSS ---
    const css = `
        /* --- ЦВЕТОВЫЕ СХЕМЫ --- */
        :root {
            --tm-btn-opacity: ${DEFAULTS.opacity};
            --tm-icon-content: "✨";
            --tm-icon-size: 18px;

            /* Светлая тема (Default) */
            --tm-bg: #ffffff;
            --tm-border: rgba(0,0,0,0.2);
            --tm-bg-hover: #f9f9f9;
            --tm-border-hover: #999999;
            --tm-icon-color: #333333;
            --tm-copy-color: #555555;
            --tm-shadow: 0 1px 3px rgba(0,0,0,0.1);
            --tm-logo-filter: none;
        }

        /* ТЁМНАЯ ТЕМА */
        .tm-is-dark {
            --tm-bg: #222222;
            --tm-border: #444444;
            --tm-bg-hover: #333333;
            --tm-border-hover: #666666;
            --tm-icon-color: #eeeeee;
            --tm-copy-color: #cccccc;
            --tm-shadow: 0 1px 3px rgba(0,0,0,0.5);
            --tm-logo-filter: brightness(1.2);
        }

        .tm-code-wrapper {
            position: relative !important;
            display: block !important;
        }

        /* --- TOOLBAR --- */
        .tm-toolbar {
            position: absolute !important;
            z-index: 20 !important;
            display: flex !important;
            gap: 6px !important;
            width: auto !important;
            height: auto !important;
            opacity: var(--tm-btn-opacity);
            transition: opacity 0.2s ease-in-out;
            pointer-events: none;
        }
        .tm-toolbar:hover { opacity: 1 !important; }

        .tm-toolbar.tm-vertical { flex-direction: column !important; width: 28px !important; }
        .tm-toolbar.tm-horizontal { flex-direction: row !important; height: 28px !important; }

        .tm-pos-top-right .tm-toolbar { top: 6px; right: 6px; }
        .tm-pos-bottom-right .tm-toolbar { bottom: 6px; right: 6px; }

        /* --- SAFE AREA --- */
        body.tm-safe-area.tm-pos-top-right .tm-code-wrapper pre,
        body.tm-safe-area.tm-pos-bottom-right .tm-code-wrapper pre {
            padding-right: 40px !important;
        }

        /* --- MINI BUTTONS --- */
        body .tm-btn-mini {
            pointer-events: auto !important;
            width: 28px !important;
            height: 28px !important;
            min-width: 28px !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 6px !important;

            background-color: var(--tm-bg) !important;
            border: 1px solid var(--tm-border) !important;
            box-shadow: var(--tm-shadow) !important;
            color: var(--tm-icon-color) !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer;
            overflow: hidden !important;
            position: relative !important;

            font-family: sans-serif !important;
            line-height: 1 !important;
            font-size: var(--tm-icon-size) !important;
            backdrop-filter: blur(2px);
            order: 0;
            transition: background-color 0.2s, border-color 0.2s, opacity 0.2s !important;
        }
        body .tm-btn-mini:hover {
            background-color: var(--tm-bg-hover) !important;
            border-color: var(--tm-border-hover) !important;
        }

        /* --- STACK ORDERING --- */
        .tm-toolbar.tm-vertical .tm-btn-copy { order: -1 !important; }
        .tm-toolbar.tm-vertical .tm-btn-explainer-container { order: 0 !important; }
        .tm-toolbar.tm-horizontal .tm-btn-copy { order: 1 !important; }
        .tm-toolbar.tm-horizontal .tm-btn-explainer-container { order: 0 !important; }

        /* --- COPY BUTTON --- */
        body .tm-btn-copy {
            font-size: 16px !important;
            color: var(--tm-copy-color) !important;
        }

        /* --- EXPLAIN BUTTON --- */
        body.tm-explainer-mini .code-explainer button > * {
            opacity: 0 !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
        }
        body.tm-explainer-mini .code-explainer button {
            font-size: 0 !important;
            color: transparent !important;
        }
        body.tm-explainer-mini .code-explainer button::after {
            content: var(--tm-icon-content);
            font-size: var(--tm-icon-size) !important;
            color: var(--tm-icon-color) !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        /* --- LOGO MODE --- */
        body.tm-icon-original .code-explainer button {
             background-color: var(--tm-bg) !important;
        }
        body.tm-icon-original .code-explainer button img {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            height: 65% !important;
            width: auto !important;
            max-width: none !important;
            position: absolute !important;
            top: 50% !important;
            left: 2px !important;
            transform: translateY(-50%) !important;
            filter: var(--tm-logo-filter) !important;
        }
        body.tm-icon-original .code-explainer button::after { display: none !important; }

        body.tm-explainer-hidden .tm-btn-explainer-container { display: none !important; }
    `;
    GM_addStyle(css);

    // --- 4. Logic ---
    function main() {

        // --- THEME DETECTION ---
        const updateTheme = () => {
            const darkLink = document.getElementById('dark-colors');
            let isDark = false;

            // Если элемент существует и НЕ отключен, значит тема темная
            if (darkLink && !darkLink.disabled && darkLink.media !== 'not all') {
                isDark = true;
            }

            const wrappers = document.querySelectorAll('.tm-code-wrapper');
            wrappers.forEach(w => {
                if (isDark) w.classList.add('tm-is-dark');
                else w.classList.remove('tm-is-dark');
            });
        };

        const createToolbar = () => {
            const tb = document.createElement('div');
            tb.className = 'tm-toolbar';
            return tb;
        };

        const createCopyBtn = () => {
            const btn = document.createElement('div');
            btn.className = 'tm-btn-mini tm-btn-copy';
            btn.textContent = '❐';
            btn.title = i18n.tooltips.copy;
            btn.setAttribute('role', 'button');

            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const wrapper = btn.closest('.tm-code-wrapper');
                const codeBlock = wrapper.querySelector('code') || wrapper.querySelector('pre');
                if (codeBlock) {
                    try {
                        await navigator.clipboard.writeText(codeBlock.innerText);
                        const original = btn.textContent;
                        btn.textContent = '✓';
                        btn.style.color = '#4caf50';
                        setTimeout(() => {
                            btn.textContent = original;
                            btn.style.color = '';
                        }, 1500);
                    } catch (err) { console.error(err); }
                }
            });
            return btn;
        };

        const processBlock = (explainerDiv) => {
            const originalParent = explainerDiv.parentElement;
            if (!originalParent) return;
            if (explainerDiv.closest('.tm-code-wrapper')) return;

            let wrapper = originalParent.parentElement;
            if (!wrapper || !wrapper.classList.contains('tm-code-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'tm-code-wrapper';
                // Проверяем тему сразу при создании
                const darkLink = document.getElementById('dark-colors');
                if (darkLink && !darkLink.disabled && darkLink.media !== 'not all') {
                    wrapper.classList.add('tm-is-dark');
                }
                originalParent.parentElement.insertBefore(wrapper, originalParent);
                wrapper.appendChild(originalParent);
            }

            let toolbar = wrapper.querySelector('.tm-toolbar');
            if (!toolbar) {
                toolbar = createToolbar();
                wrapper.appendChild(toolbar);
            }

            explainerDiv.classList.add('tm-btn-explainer-container');
            const expBtn = explainerDiv.querySelector('button');
            if (expBtn) expBtn.title = i18n.tooltips.explain;

            updatePositions(wrapper, toolbar, explainerDiv);
            updateCopyBtn(toolbar);
            updateToolbarVisibility(toolbar);
        };

        const updateCopyBtn = (toolbar) => {
            const show = GM_config.get('showCopy');
            let copyBtn = toolbar.querySelector('.tm-btn-copy');
            if (show) {
                if (!copyBtn) {
                    copyBtn = createCopyBtn();
                    toolbar.appendChild(copyBtn);
                }
            } else {
                if (copyBtn) copyBtn.remove();
            }
        };

        const updateToolbarVisibility = (toolbar) => {
            const showCopy = GM_config.get('showCopy');
            const modeVal = GM_config.get('mode');
            const mode = i18n.fields.mode.values[i18n.fields.mode.options.indexOf(modeVal)] || 'mini';
            const hasContent = showCopy || (mode === 'mini');
            toolbar.style.display = hasContent ? 'flex' : 'none';
        };

        const updatePositions = (wrapper, toolbar, explainerDiv) => {
            const modeLabel = GM_config.get('mode');
            const mode = i18n.fields.mode.values[i18n.fields.mode.options.indexOf(modeLabel)] || 'mini';
            const expBtn = explainerDiv.querySelector('button');

            let originalParent = null;
            for (let i = 0; i < wrapper.children.length; i++) {
                if (wrapper.children[i] !== toolbar) {
                    originalParent = wrapper.children[i];
                    break;
                }
            }

            if (mode === 'normal') {
                if (originalParent && explainerDiv.parentElement !== originalParent) {
                    originalParent.appendChild(explainerDiv);
                }
                if (expBtn) expBtn.classList.remove('tm-btn-mini');
                explainerDiv.style.margin = '';
                explainerDiv.style.padding = '';
                explainerDiv.style.width = '';
                explainerDiv.style.display = '';
            } else {
                if (explainerDiv.parentElement !== toolbar) {
                    toolbar.appendChild(explainerDiv);
                }
                if (expBtn) expBtn.classList.add('tm-btn-mini');
                explainerDiv.style.margin = '0';
                explainerDiv.style.padding = '0';
                explainerDiv.style.width = 'auto';
                explainerDiv.style.display = 'block';
            }
        };

        const applyConfig = () => {
            if (!document.body) return;

            const modeLabel = GM_config.get('mode');
            const mode = i18n.fields.mode.values[i18n.fields.mode.options.indexOf(modeLabel)] || DEFAULTS.mode;
            const iconLabel = GM_config.get('iconSource');
            const iconSrc = i18n.fields.iconSource.values[i18n.fields.iconSource.options.indexOf(iconLabel)] || DEFAULTS.iconSource;
            const cornerLabel = GM_config.get('corner');
            const corner = i18n.fields.corner.values[i18n.fields.corner.options.indexOf(cornerLabel)] || DEFAULTS.corner;
            const opacity = GM_config.get('opacity');
            const orientLabel = GM_config.get('orientation');
            const orientation = i18n.fields.orientation.values[i18n.fields.orientation.options.indexOf(orientLabel)] || DEFAULTS.orientation;
            const safeArea = GM_config.get('safeArea');

            const body = document.body;

            body.classList.remove('tm-explainer-hidden', 'tm-explainer-normal', 'tm-explainer-mini');
            body.classList.remove('tm-pos-bottom-right', 'tm-pos-top-right');
            body.classList.remove('tm-icon-custom', 'tm-icon-original');
            body.classList.remove('tm-safe-area');

            document.documentElement.style.setProperty('--tm-btn-opacity', opacity);
            body.classList.add('tm-pos-' + corner);

            if (safeArea) body.classList.add('tm-safe-area');

            if (mode === 'hidden') {
                body.classList.add('tm-explainer-hidden');
            } else if (mode === 'normal') {
                body.classList.add('tm-explainer-normal');
            } else {
                body.classList.add('tm-explainer-mini');
                if (iconSrc === 'original') {
                    body.classList.add('tm-icon-original');
                } else {
                    body.classList.add('tm-icon-custom');
                    const char = (iconSrc === 'question') ? '?' : '✨';
                    document.documentElement.style.setProperty('--tm-icon-content', `"${char}"`);
                    const size = (iconSrc === 'question') ? '18px' : '16px';
                    document.documentElement.style.setProperty('--tm-icon-size', size);
                }
            }

            document.querySelectorAll('.tm-code-wrapper').forEach(wrapper => {
                const toolbar = wrapper.querySelector('.tm-toolbar');
                const explainerDiv = wrapper.querySelector('.tm-btn-explainer-container');
                if (toolbar) {
                    toolbar.classList.remove('tm-vertical', 'tm-horizontal');
                    toolbar.classList.add('tm-' + orientation);
                    updateCopyBtn(toolbar);
                    if (explainerDiv) updatePositions(wrapper, toolbar, explainerDiv);
                    updateToolbarVisibility(toolbar);
                }
            });

            updateTheme();
        };

        const runObserver = () => {
            const scan = () => document.querySelectorAll('.code-explainer').forEach(processBlock);
            scan();
            // DOM Observer
            new MutationObserver(mutations => {
                let found = false;
                for (const m of mutations) if (m.addedNodes.length) found = true;
                if (found) scan();
            }).observe(document.body, { childList: true, subtree: true });

            // HEAD Observer (for Theme Changes)
            new MutationObserver(() => {
                updateTheme();
            }).observe(document.head, { attributes: true, subtree: true, attributeFilter: ['media', 'disabled'] });
        };

        const toggleFields = () => {
            const modeVal = GM_config.get('mode');
            const idx = i18n.fields.mode.options.indexOf(modeVal);
            const isMini = (i18n.fields.mode.values[idx] === 'mini');

            const fieldsToShow = [
                'HabrExplainerConfig_field_orientation',
                'HabrExplainerConfig_field_iconSource',
                'HabrExplainerConfig_field_corner',
                'HabrExplainerConfig_field_opacity'
            ];
            fieldsToShow.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = isMini ? 'flex' : 'none';
            });
        };

        const configCSS = `
            #HabrExplainerConfig_wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 10px; font-family: sans-serif; }
            .config_header { grid-column: 1 / -1; padding-bottom: 10px; border-bottom: 1px solid #ccc; margin-bottom: 10px; font-size: 1.2em; font-weight: bold; }
            .config_var { margin: 0 !important; display: flex; flex-direction: column; }
            .config_var label { font-weight: bold; margin-bottom: 5px; font-size: 0.9em; color: #555; }
            .config_var input[type="radio"] { margin-right: 5px; }
            .config_var .field_label { display: inline-flex; align-items: center; margin-right: 10px; font-size: 0.9em; }

            #HabrExplainerConfig_field_lang, #HabrExplainerConfig_field_mode, #HabrExplainerConfig_field_showCopy, #HabrExplainerConfig_field_safeArea { grid-column: 1; }
            #HabrExplainerConfig_field_orientation, #HabrExplainerConfig_field_iconSource, #HabrExplainerConfig_field_corner, #HabrExplainerConfig_field_opacity { grid-column: 2; }

            #HabrExplainerConfig_field_showCopy, #HabrExplainerConfig_field_safeArea { margin-top: 5px !important; flex-direction: row; align-items: center; }
            #HabrExplainerConfig_field_showCopy label, #HabrExplainerConfig_field_safeArea label { margin-bottom: 0; margin-right: 10px; }
            #HabrExplainerConfig_buttons_holder { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
        `;

        GM_config.init({
            'id': CONFIG_ID,
            'title': i18n.title,
            'fields': {
                'lang': { 'label': i18n.fields.lang.label, 'type': 'radio', 'options': ['Авто', 'Русский', 'English'], 'default': DEFAULTS.lang },
                'mode': { 'label': i18n.fields.mode.label, 'type': 'radio', 'options': i18n.fields.mode.options, 'default': DEFAULTS.mode },
                'showCopy': { 'label': i18n.fields.showCopy.label, 'type': 'checkbox', 'default': DEFAULTS.showCopy },
                'safeArea': { 'label': i18n.fields.safeArea.label, 'type': 'checkbox', 'default': DEFAULTS.safeArea },

                'orientation': { 'label': i18n.fields.orientation.label, 'type': 'radio', 'options': i18n.fields.orientation.options, 'default': DEFAULTS.orientation },
                'iconSource': { 'label': i18n.fields.iconSource.label, 'type': 'radio', 'options': i18n.fields.iconSource.options, 'default': DEFAULTS.iconSource },
                'corner': { 'label': i18n.fields.corner.label, 'type': 'radio', 'options': i18n.fields.corner.options, 'default': DEFAULTS.corner },
                'opacity': { 'label': i18n.fields.opacity.label, 'type': 'number', 'min': 0.1, 'max': 1.0, 'step': 0.1, 'default': DEFAULTS.opacity }
            },
            'events': {
                'init': () => { if (document.body) { applyConfig(); runObserver(); } else document.addEventListener('DOMContentLoaded', () => { applyConfig(); runObserver(); }); },
                'save': () => { applyConfig(); GM_config.close(); },
                'open': (doc) => {
                    GM_config.frame.style.zIndex = '9999999';
                    toggleFields();
                    const modeInputs = doc.querySelectorAll('input[name="mode"]');
                    modeInputs.forEach(input => input.addEventListener('change', toggleFields));
                }
            },
            'css': configCSS
        });
        GM_registerMenuCommand(i18n.title, () => GM_config.open());
    }

    main();
})();