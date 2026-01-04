// ==UserScript==
// @name         Bonk Chat Macros (BonkMods)
// @namespace    https://greasyfork.org/en/users/1552147-ansonii-crypto
// @version      0.0.1
// @description  F-key chat macros for Bonk.io with per-account storage.
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/560524/Bonk%20Chat%20Macros%20%28BonkMods%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560524/Bonk%20Chat%20Macros%20%28BonkMods%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY_BASE = 'bonk_mod_chatmacros_';

    function $(id) {
        return document.getElementById(id);
    }

    function waitForElement(id, cb) {
        const int = setInterval(() => {
            const el = $(id);
            if (el) {
                clearInterval(int);
                cb(el);
            }
        }, 200);
    }

    function normalizeName(name) {
        return (name || '').trim().toLowerCase();
    }

    function injectChatMacrosStyles() {
        if (document.getElementById('chatmacros_smart_ui_styles')) return;

        const style = document.createElement('style');
        style.id = 'chatmacros_smart_ui_styles';
        style.textContent = `
            .smartchat-row {
                margin-bottom: 4px;
            }

            .smartchat-toggle-label {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                font-size: 11px;
                user-select: none;
            }
            .smartchat-toggle-input {
                display: none;
            }
            .smartchat-toggle-switch {
                position: relative;
                width: 30px;
                height: 14px;
                border-radius: 999px;
                background: #0000001A;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6);
                transition: background 0.15s ease-out, box-shadow 0.15s ease-out;
            }
            .smartchat-toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #e5e5e5;
                box-shadow: 0 0 2px rgba(0,0,0,0.5);
                transition: transform 0.15s ease-out;
            }
            .smartchat-toggle-input:checked + .smartchat-toggle-switch {
                background: #009688;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4);
            }
            .smartchat-toggle-input:checked + .smartchat-toggle-switch .smartchat-toggle-knob {
                transform: translateX(14px);
            }

            .smartchat-tag-label {
                font-size: 11px;
                margin-bottom: 2px;
            }
            .smartchat-tag-input {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 3px;
                min-height: 20px;
                background: #0000001A;
                border-radius: 4px;
                border: 1px solid #555;
            }
            .smartchat-tag-input-field {
                flex: 1 1 60px;
                min-width: 40px;
                border: none;
                outline: none;
                background: transparent;
                font-size: 11px;
                color: inherit;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    injectChatMacrosStyles();

    let storageKey = STORAGE_KEY_BASE + 'default';
    let lastAccountName = null;
    let nameObserverInitialized = false;

    let chatConfig = null;

    function defaultConfig() {
        const keys = {};
        for (let i = 1; i <= 8; i++) {
            keys['F' + i] = '';
        }
        return {
            enabled: true,
            keys
        };
    }

    function loadConfig() {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                chatConfig = defaultConfig();
                return;
            }
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') {
                chatConfig = defaultConfig();
                return;
            }

            const merged = defaultConfig();
            if (typeof data.enabled === 'boolean') merged.enabled = data.enabled;
            if (data.keys && typeof data.keys === 'object') {
                for (let i = 1; i <= 8; i++) {
                    const k = 'F' + i;
                    if (typeof data.keys[k] === 'string') {
                        merged.keys[k] = data.keys[k];
                    }
                }
            }
            chatConfig = merged;
        } catch (e) {
            console.error('[ChatMacros] Failed to load config:', e);
            chatConfig = defaultConfig();
        }
    }

    function saveConfig() {
        if (!chatConfig) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(chatConfig));
        } catch (e) {
            console.error('[ChatMacros] Failed to save config:', e);
        }
    }

    function updateAccountFromName() {
        const el = $('pretty_top_name');
        const account = normalizeName(el ? el.textContent : '') || 'guest';
        if (account === lastAccountName) return;

        lastAccountName = account;
        storageKey = STORAGE_KEY_BASE + account;
        loadConfig();

        if (window.bonkMods) {
            renderSettingsBlockCached();
        }
    }

    function determineStorageKey() {
        updateAccountFromName();

        const nameEl = $('pretty_top_name');
        if (nameEl && !nameObserverInitialized) {
            const obs = new MutationObserver(() => {
                updateAccountFromName();
            });
            obs.observe(nameEl, {
                childList: true,
                characterData: true,
                subtree: true
            });
            nameObserverInitialized = true;
        }
    }

    waitForElement('pretty_top_name', determineStorageKey);

    loadConfig();

    function isInGame() {
        return !!( $('ingameui') || $('gamecanvas') || $('roomHolder') );
    }

    function findChatInput() {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            const type = (active.type || '').toLowerCase();
            if (type === '' || type === 'text' || type === 'search') {
                return active;
            }
        }

        const candidates = Array.from(
            document.querySelectorAll('input[type="text"], input:not([type]), textarea')
        );
        for (const el of candidates) {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
            if (el.disabled || el.readOnly) continue;
            const rect = el.getBoundingClientRect();
            if (rect.height > 0 && rect.width > 0 && rect.height <= 40) {
                return el;
            }
        }
        return null;
    }

    function sendChatMessageDOM(msg) {
        const text = (msg || '').trim();
        if (!text) return false;

        const input = findChatInput();
        if (!input) {
            console.warn('[ChatMacros] No chat input found for DOM send.');
            return false;
        }

        input.focus();
        input.value = text;

        const inputEv = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEv);

        const enterOpts = {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        };
        const kd = new KeyboardEvent('keydown', enterOpts);
        const ku = new KeyboardEvent('keyup', enterOpts);
        kd._chatMacroSynthetic = true;
        ku._chatMacroSynthetic = true;

        input.dispatchEvent(kd);
        input.dispatchEvent(ku);

        return true;
    }

    let keyHandlerAttached = false;

    function handleKeydown(e) {
        if (e._chatMacroSynthetic) return;

        const key = e.key;
        if (!/^F[1-8]$/.test(key)) return;

        if (!chatConfig) loadConfig();
        if (!chatConfig || !chatConfig.enabled) return;

        const msg = (chatConfig.keys && chatConfig.keys[key]) || '';
        if (!msg.trim()) {
            return;
        }

        if (isInGame() && !findChatInput()) {
            return;
        }

        const ok = sendChatMessageDOM(msg);
        if (!ok) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
            e.stopImmediatePropagation();
        }
    }

    function attachKeyHandler() {
        if (keyHandlerAttached) return;
        keyHandlerAttached = true;
        // capture=true so we get a chance to act before Bonk
        window.addEventListener('keydown', handleKeydown, true);
    }

    attachKeyHandler();

    let settingsRendererInstance = null;

    function renderSettingsBlock(container) {
        settingsRendererInstance = container;
        container.innerHTML = '';

        if (!chatConfig) loadConfig();

        const root = document.createElement('div');
        root.style.fontSize = '12px';
        container.appendChild(root);

        const mkRow = () => {
            const div = document.createElement('div');
            div.className = 'smartchat-row';
            root.appendChild(div);
            return div;
        };

        const mkCheckbox = (labelText, initial, onChange) => {
            const row = mkRow();

            const label = document.createElement('label');
            label.className = 'smartchat-toggle-label';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'smartchat-toggle-input';
            input.checked = !!initial;

            const switchSpan = document.createElement('span');
            switchSpan.className = 'smartchat-toggle-switch';

            const knob = document.createElement('span');
            knob.className = 'smartchat-toggle-knob';
            switchSpan.appendChild(knob);

            const textSpan = document.createElement('span');
            textSpan.textContent = labelText;

            input.addEventListener('change', () => onChange(input.checked));

            label.appendChild(input);
            label.appendChild(switchSpan);
            label.appendChild(textSpan);

            row.appendChild(label);
            return input;
        };

        const mkMacroInput = (keyName, initial, onChange) => {
            const row = mkRow();

            const label = document.createElement('div');
            label.className = 'smartchat-tag-label';
            label.textContent = keyName + ':';
            row.appendChild(label);

            const wrapper = document.createElement('div');
            wrapper.className = 'smartchat-tag-input';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'smartchat-tag-input-field';
            input.value = initial || '';
            input.placeholder = 'Message sent by ' + keyName;

            input.addEventListener('input', () => {
                onChange(input.value);
            });

            wrapper.appendChild(input);
            row.appendChild(wrapper);
        };

        mkCheckbox('Enable F-key chat macros', chatConfig.enabled, val => {
            chatConfig.enabled = val;
            saveConfig();
        });

        const infoRow = mkRow();
        const info = document.createElement('div');
        info.style.fontSize = '11px';
        info.style.opacity = '0.8';
        info.textContent =
            'Define quick chat messages for F1–F8. Works in lobby / text chat. In-game canvas chat will still use Bonk’s default F-keys if no text field exists.';
        infoRow.appendChild(info);

        for (let i = 1; i <= 8; i++) {
            const k = 'F' + i;
            const value = (chatConfig.keys && chatConfig.keys[k]) || '';
            mkMacroInput(k, value, newVal => {
                chatConfig.keys[k] = newVal;
                saveConfig();
            });
        }
    }

    function renderSettingsBlockCached() {
        if (settingsRendererInstance) {
            renderSettingsBlock(settingsRendererInstance);
        }
    }

    function initBonkModsIntegration() {
        const gm = window.bonkMods;
        if (!gm || !gm.addBlock || !gm.registerMod) return;

        // Register our mod
        gm.registerMod({
            id: 'chatmacros',
            name: 'Chat Macros',
            version: '1.1.0',
            author: 'You',
            description: 'Assign custom F1–F8 quick chat messages with per-account storage.'
        });

        gm.registerCategory({
            id: 'chat',
            label: 'Chat',
            order: 5
        });

        gm.addBlock({
            id: 'chatmacros_main',
            modId: 'chatmacros',
            categoryId: 'chat',
            title: 'Chat Macros',
            order: 1,
            render: renderSettingsBlock
        });
    }

    if (window.bonkMods) {
        initBonkModsIntegration();
    } else {
        window.addEventListener('bonkModsReady', initBonkModsIntegration);
    }
})();