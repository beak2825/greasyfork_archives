// ==UserScript==
// @name         Orbitar.space Comment Replay — Slideshow+Media (full + presets/loop)
// @namespace    https://orbitar.space/
// @version      0.9.3
// @description  Реплей комментариев с фильтрами, хоткеями и слайд-шоу (картинки/видео) + петля, автоскрытие панели, пресеты (3 стандартных + неограниченные пользовательские), автоматическая адаптация к теме сайта
// @match        https://*.orbitar.space/*
// @match        https://*.orbitar.local/*
// @author       pazoozoo
// @homepageUrl   https://orbitar.space/u/pazoozoo/
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554580/Orbitarspace%20Comment%20Replay%20%E2%80%94%20Slideshow%2BMedia%20%28full%20%2B%20presetsloop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554580/Orbitarspace%20Comment%20Replay%20%E2%80%94%20Slideshow%2BMedia%20%28full%20%2B%20presetsloop%29.meta.js
// ==/UserScript==

    (function () {
        'use strict';

        // ---------- API Interception ----------
        let cachedPostData = null;

        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);

            const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
            if (url && url.includes('/api/v1/post/get')) {
                response.clone().json().then(data => {
                    if (data && data.payload && data.payload.comments) {
                        cachedPostData = data.payload;
                        console.log('[Orbitar Replay] Cached API data:', cachedPostData.comments.length, 'comments');
                    }
                }).catch(() => { });
            }

            return response;
        };

        // ---------- Constants ----------
        const STORAGE_KEYS = {
            STATE: 'orbitar_replay_state',
            POST_PREFIX: 'orbitar_replay_post_',
            PRESETS: 'orbitar_replay_presets',
            DEFAULT_PRESET_MODS: 'orbitar_replay_default_preset_mods', // Modifications to default presets
            VOLUME: 'orbitar_replay_volume',
            MUTED: 'orbitar_replay_muted',
            HOTKEYS: 'orbitar_replay_hotkeys'
        };

        const STYLE_ELEMENT_ID = 'orbitar-replay-styles';
        const THEME_VARIABLES = {
            panelBg: '--or-panel-bg',
            panelBorder: '--or-panel-border',
            panelText: '--or-panel-text',
            titleColor: '--or-title-color',
            inputBg: '--or-input-bg',
            inputBorder: '--or-input-border',
            inputText: '--or-input-text',
            buttonBg: '--or-button-bg',
            buttonText: '--or-button-text',
            buttonSecondaryBg: '--or-button-secondary-bg',
            buttonSecondaryText: '--or-button-secondary-text',
            buttonSecondaryBorder: '--or-button-secondary-border',
            labelText: '--or-label-text',
            dividerColor: '--or-divider-color',
            statusText: '--or-status-text',
            hintText: '--or-hint-text'
        };

        const BASE_STYLE_TEXT = `
            :root {
                --or-panel-bg: rgba(28, 28, 28, 0.95);
                --or-panel-border: rgba(128, 128, 128, 0.3);
                --or-panel-text: #f8fafc;
                --or-title-color: #60a5fa;
                --or-input-bg: rgba(128, 128, 128, 0.1);
                --or-input-border: rgba(128, 128, 128, 0.3);
                --or-input-text: #f8fafc;
                --or-button-bg: #60a5fa;
                --or-button-text: #fff;
                --or-button-secondary-bg: rgba(128, 128, 128, 0.15);
                --or-button-secondary-text: #f8fafc;
                --or-button-secondary-border: rgba(128, 128, 128, 0.3);
                --or-label-text: #e2e8f0;
                --or-divider-color: rgba(128, 128, 128, 0.3);
                --or-status-text: #e2e8f0;
                --or-hint-text: #cbd5f5;
            }

            #orbitarReplayOverlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 999999;
            }

            #orbitarReplayOverlay .orbitar-overlay-inner {
                max-width: 92vw;
                max-height: 86vh;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
            }

            #orbitarReplayOverlay .orbitar-overlay-header {
                position: absolute;
                top: 12px;
                left: 50%;
                transform: translateX(-50%);
                color: #fff;
                font-size: 16px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 12px;
                pointer-events: none;
            }

            #orbitarReplayOverlay .orbitar-overlay-auto {
                font-size: 20px;
            }

            #orbitarReplayOverlay .orbitar-overlay-delay {
                display: none;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.15);
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 14px;
                pointer-events: auto;
            }

            #orbitarReplayOverlay .orbitar-overlay-delay button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: #fff;
                padding: 2px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: opacity 0.15s ease;
            }

            #orbitarReplayOverlay .orbitar-overlay-delay button:hover {
                opacity: 0.85;
            }

            #orbitarReplayOverlay .orbitar-overlay-delay-value {
                min-width: 45px;
                text-align: center;
            }

            #orbitarReplayOverlay button.orbitar-overlay-close {
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }

            #orbitarReplayOverlay button.orbitar-overlay-close:hover {
                opacity: 1;
            }

            #orbitarReplayOverlay button.orbitar-overlay-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                padding: 15px 20px;
                border-radius: 8px;
                font-size: 24px;
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.3);
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.15s ease, background 0.15s ease;
            }

            #orbitarReplayOverlay button.orbitar-overlay-nav:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.3);
            }

            #orbitarReplayOverlay button.orbitar-overlay-nav.left {
                left: 20px;
            }

            #orbitarReplayOverlay button.orbitar-overlay-nav.right {
                right: 20px;
            }

            .orbitarReplayIconContainer {
                position: fixed;
                top: 59px;
                left: 0;
                z-index: 1000;
                background: transparent;
                display: flex;
                flex-direction: column;
                gap: 4px;
                align-items: flex-start;
            }

            .orbitarReplayIconContainer .orbitar-replay-main-row {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .orbitarReplayIcon {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .orbitarReplayModeBadge {
                display: none;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 999px;
                font-weight: 600;
                border: 1px solid var(--or-panel-border);
                background: var(--or-button-secondary-bg);
                color: var(--or-panel-text);
            }

            .orbitarReplayModeBadge.visible {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .orbitarPresetsRow {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-wrap: wrap;
                max-width: 250px;
            }

            .orbitarPresetMenuBtn {
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid var(--or-panel-border);
                background: var(--or-button-secondary-bg);
                color: var(--or-panel-text);
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .orbitarPresetMenuBtn.active {
                border-width: 2px;
                border-color: var(--or-title-color);
                font-weight: 700;
            }

            .orbitarPresetMenuBtn:not(.active):hover {
                background: var(--or-button-bg);
                color: var(--or-button-text);
                border-width: 2px;
            }

            .orbitar-replay-panel {
                position: fixed;
                top: 115px;
                right: 24px;
                width: 420px;
                background: var(--or-panel-bg);
                border: 1.5px solid var(--or-panel-border);
                border-radius: 10px;
                z-index: 99999;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                padding: 14px 16px;
                font-size: 13px;
                color: var(--or-panel-text);
                line-height: 1.4;
            }

            .orbitar-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            .orbitar-panel-header-buttons {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .orbitar-panel-title {
                font-weight: 700;
                color: var(--or-title-color);
                font-size: 15px;
            }

            .orbitar-panel-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .orbitar-section {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .orbitar-section--presets {
                border-top: 1px solid var(--or-divider-color);
                padding-top: 12px;
            }

            .orbitar-section-title {
                font-weight: 600;
                color: var(--or-title-color);
                font-size: 13px;
            }

            .orbitar-control-row {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
            }

            .orbitar-label {
                color: var(--or-label-text);
                font-size: 13px;
                white-space: nowrap;
            }

            .orbitar-label--spaced {
                margin-left: 8px;
            }

            .orbitar-hint {
                color: var(--or-label-text);
                font-size: 11px;
                opacity: 0.7;
                white-space: nowrap;
            }

            .orbitar-input--xs {
                width: 45px;
                text-align: center;
                font-size: 13px;
            }

            .orbitar-input--wide {
                flex: 1;
                font-size: 11px;
            }

            .orbitar-toggle-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px 12px;
            }

            .orbitar-save-buttons {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .orbitar-button-row {
                display: flex;
                gap: 6px;
                align-items: stretch;
            }

            .orbitar-button-row--secondary {
                margin-top: 6px;
            }

            .orbitar-preset-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .orbitar-panel-preset-btn {
                padding: 6px 12px;
                border-radius: 6px;
                border: 1px solid var(--or-input-border);
                background: var(--or-button-secondary-bg);
                color: var(--or-label-text);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .orbitar-panel-preset-btn.active {
                border-color: var(--or-button-bg);
                border-width: 2px;
                background: var(--or-button-bg);
                color: var(--or-button-text);
                font-weight: 600;
            }

            .orbitar-panel-preset-btn:not(.active):hover {
                background: var(--or-button-bg);
                color: var(--or-button-text);
                border-color: var(--or-button-bg);
                border-width: 2px;
            }

            .orbitar-preset-create {
                display: flex;
                gap: 6px;
            }

            .orbitar-input--preset {
                flex: 1;
                padding: 8px;
                font-size: 12px;
            }

            .orbitar-icon-btn {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 1px solid var(--or-panel-border);
                background: var(--or-button-secondary-bg);
                color: var(--or-panel-text);
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
            }

            .orbitar-icon-btn:hover {
                background: var(--or-button-bg);
                color: var(--or-button-text);
                border-color: var(--or-button-bg);
            }

            .orbitar-toggle-icon {
                border: 1.5px solid var(--or-button-bg);
                background: transparent;
                color: var(--or-button-bg);
                font-weight: 700;
            }

            .orbitar-toggle-icon.off {
                border-color: #dc2626;
                background: #dc2626;
                color: #fff;
            }

            .orbitar-btn {
                border-radius: 7px;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
            }

            .orbitar-btn-primary {
                background: var(--or-button-bg);
                color: var(--or-button-text);
                border: none;
            }

            .orbitar-btn-primary.playing {
                background: #fae251;
                color: #222;
            }

            .orbitar-btn-secondary {
                background: var(--or-button-secondary-bg);
                color: var(--or-button-secondary-text);
                border: 1px solid var(--or-button-secondary-border);
            }

            .orbitar-btn-compact {
                padding: 7px;
                font-size: 12px;
            }

            .orbitar-btn-lg {
                padding: 10px;
                font-size: 14px;
                font-weight: 600;
            }

            .orbitar-input {
                border: 1px solid var(--or-input-border);
                border-radius: 5px;
                padding: 3px 6px;
                background: var(--or-input-bg);
                color: var(--or-input-text);
                font-size: 12px;
            }

            .orbitar-toggle-wrapper {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                padding: 3px 0;
            }

            .orbitar-toggle-wrapper input[type="checkbox"] {
                display: none;
            }

            .orbitar-toggle-switch {
                position: relative;
                width: 32px;
                height: 16px;
                border-radius: 999px;
                background: rgba(128, 128, 128, 0.3);
                transition: background 0.2s ease;
                flex-shrink: 0;
            }

            .orbitar-toggle-switch.active {
                background: var(--or-button-bg);
            }

            .orbitar-toggle-switch span {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #fff;
                transition: left 0.2s ease;
            }

            .orbitar-toggle-switch.active span {
                left: 18px;
            }

            .orbitar-toggle-label {
                color: var(--or-label-text);
                font-size: 13px;
                user-select: none;
            }

            .orbitar-status {
                margin-top: 12px;
                font-size: 12px;
                color: var(--or-status-text);
                opacity: 0.8;
            }
        `;

        function ensureStyles() {
            if (document.getElementById(STYLE_ELEMENT_ID)) return;
            const styleEl = document.createElement('style');
            styleEl.id = STYLE_ELEMENT_ID;
            styleEl.textContent = BASE_STYLE_TEXT;
            document.head.appendChild(styleEl);
        }

        function applyThemeVariables(target, colors) {
            if (!target || !colors) return;
            Object.entries(THEME_VARIABLES).forEach(([key, cssVar]) => {
                const value = colors[key];
                if (value !== undefined && value !== null) {
                    target.style.setProperty(cssVar, value);
                }
            });
        }

        ensureStyles();

        const HOTKEY_META_TOKEN = navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Win';
        const HOTKEY_META_ALIASES = new Set(['meta', 'cmd', 'command', 'win', 'windows', 'super']);
        const HOTKEY_MODIFIER_ORDER = [HOTKEY_META_TOKEN, 'Shift', 'Alt'];

        function eventHasMetaModifier(e) {
            return !!e.metaKey;
        }

        function normalizeModifierToken(token) {
            if (!token) return '';
            const trimmed = token.trim();
            if (!trimmed) return '';
            const lower = trimmed.toLowerCase();
            if (HOTKEY_META_ALIASES.has(lower)) return HOTKEY_META_TOKEN;
            if (lower === 'shift') return 'Shift';
            if (lower === 'alt' || lower === 'option') return 'Alt';
            if (lower === 'ctrl' || lower === 'control') return 'Ctrl';
            return trimmed;
        }

        function normalizeKeyToken(token) {
            if (!token) return '';
            let trimmed = token.trim();
            if (!trimmed) return '';
            if (trimmed === ' ') trimmed = 'Space';
            const lower = trimmed.toLowerCase();
            if (lower === 'space') return 'Space';
            if (lower.startsWith('arrow')) {
                const direction = lower.slice(5);
                return 'Arrow' + (direction.charAt(0).toUpperCase() + direction.slice(1));
            }
            if (trimmed.length === 1) return trimmed.toUpperCase();
            return trimmed;
        }

        function getModifierPriority(token) {
            const idx = HOTKEY_MODIFIER_ORDER.indexOf(token);
            return idx === -1 ? HOTKEY_MODIFIER_ORDER.length : idx;
        }

        function normalizeHotkeyString(str) {
            if (!str) return '';
            const tokens = str.split('+').map(t => t.trim()).filter(Boolean);
            if (!tokens.length) return '';
            const keyToken = normalizeKeyToken(tokens[tokens.length - 1]);
            const modifierTokens = tokens.slice(0, -1)
                .map(normalizeModifierToken)
                .filter(Boolean);
            const uniqueModifiers = [];
            modifierTokens.forEach(token => {
                if (!uniqueModifiers.includes(token)) uniqueModifiers.push(token);
            });
            uniqueModifiers.sort((a, b) => getModifierPriority(a) - getModifierPriority(b));
            return [...uniqueModifiers, keyToken].filter(Boolean).join('+');
        }

        function displayHotkeyString(str) {
            return normalizeHotkeyString(str);
        }

        function normalizeEventKey(key) {
            if (!key) return '';
            if (key === ' ') return 'Space';
            const lower = key.toLowerCase();
            if (lower === 'space') return 'Space';
            if (lower.startsWith('arrow')) {
                const direction = lower.slice(5);
                return 'Arrow' + (direction.charAt(0).toUpperCase() + direction.slice(1));
            }
            if (key.length === 1) return key.toUpperCase();
            return key;
        }

            // Supports: /p38205, /p38205?new, /s/idiod/p38436, /s/android/p26881?new
            // Returns: "38205" or "idiod_38436"
        function getCurrentPostId() {
            const pathname = location.pathname;

            const subsiteMatch = pathname.match(/\/s\/([^\/]+)\/p(\d+)/);
            if (subsiteMatch) {
                const subsite = subsiteMatch[1];
                const postId = subsiteMatch[2];
                return `${subsite}_${postId}`;
            }

            const mainMatch = pathname.match(/\/p(\d+)/);
            if (mainMatch) {
                return mainMatch[1];
            }

            return null;
        }

        function isPostPage() {
            return getCurrentPostId() !== null;
        }

        // Default presets (non-editable)
        const DEFAULT_PRESETS = [
            {
                name: 'таймлайн',
                isDefault: true,
                hotkey: 'Win/Cmd+Shift+1',
                showInMenu: true,
                state: {
                    flash: true,
                    delaySec: 4,
                    slideshow: false,
                    rootsOnly: false,
                    imagesOnly: false,
                    videosOnly: false,
                    videosAutoplay: false,
                    startFrom: null,
                    loop: false
                }
            },
            {
                name: 'Картинки',
                isDefault: true,
                hotkey: 'Win/Cmd+Shift+2',
                showInMenu: true,
                state: {
                    flash: false,
                    delaySec: 3,
                    slideshow: true,
                    rootsOnly: false,
                    imagesOnly: true,
                    videosOnly: false,
                    videosAutoplay: false,
                    startFrom: null,
                    loop: false
                }
            },
            {
                name: 'Видео',
                isDefault: true,
                hotkey: 'Win/Cmd+Shift+3',
                showInMenu: true,
                state: {
                    flash: false,
                    delaySec: 1,
                    slideshow: true,
                    rootsOnly: false,
                    imagesOnly: false,
                    videosOnly: true,
                    videosAutoplay: true,
                    startFrom: null,
                    loop: false
                }
            }
        ];

        // ---------- State Management ----------
        const StateManager = {
            _prepareForSave(st) {
                return { ...st, startFrom: st.startFrom ? st.startFrom.toISOString() : null };
            },
            _reviveFromLoad(obj) {
                if (obj && obj.startFrom) obj.startFrom = new Date(obj.startFrom);
                return obj;
            },
            load() {
                try {
                    const postId = getCurrentPostId();
                    if (postId) {
                        const postKey = STORAGE_KEYS.POST_PREFIX + postId;
                        const postRaw = localStorage.getItem(postKey);
                        if (postRaw) {
                            const obj = this._reviveFromLoad(JSON.parse(postRaw));
                            console.log('[Orbitar Replay] ✓ Загружены настройки для ПОСТА:', postId, obj);
                            return obj;
                        }
                    }
                    const raw = localStorage.getItem(STORAGE_KEYS.STATE);
                    if (!raw) {
                        console.log('[Orbitar Replay] Нет сохраненных настроек, используются дефолтные');
                        return null;
                    }
                    const obj = this._reviveFromLoad(JSON.parse(raw));
                    console.log('[Orbitar Replay] Загружены ОБЩИЕ настройки (для всех постов):', obj);
                    return obj;
                } catch { return null; }
            },
            save() {
                try {
                    const toSave = this._prepareForSave(state);
                    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(toSave));
                    console.log('[Orbitar Replay] ✓ Сохранены ОБЩИЕ настройки (для всех постов):', toSave);
                } catch { }
            },
            saveForPost() {
                try {
                    const postId = getCurrentPostId();
                    if (!postId) {
                        console.error('[Orbitar Replay] Cannot save: not on a post page. Current path:', location.pathname);
                        return false;
                    }
                    const toSave = this._prepareForSave(state);
                    const postKey = STORAGE_KEYS.POST_PREFIX + postId;
                    localStorage.setItem(postKey, JSON.stringify(toSave));
                    console.log('[Orbitar Replay] ✓ Сохранены настройки для ПОСТА:', postId, toSave);
                    console.log('[Orbitar Replay] Эти настройки ПЕРЕКРОЮТ общие настройки для этого поста');
                    return true;
                } catch (e) {
                    console.error('[Orbitar Replay] Error saving post settings:', e);
                    return false;
                }
            }
        };

        // ---------- Preset Management ----------
        const PresetManager = {
            loadDefaultMods() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.DEFAULT_PRESET_MODS);
                    if (!raw) return {};
                    const parsed = JSON.parse(raw);
                    if (!parsed || typeof parsed !== 'object') return {};
                    const normalized = {};
                    Object.entries(parsed).forEach(([name, mod]) => {
                        if (!mod || typeof mod !== 'object') return;
                        const entry = { ...mod };
                        if (entry.hotkey) entry.hotkey = normalizeHotkeyString(entry.hotkey);
                        normalized[name] = entry;
                    });
                    return normalized;
                } catch { return {}; }
            },
            saveDefaultMods(mods) {
                try {
                    const payload = {};
                    Object.entries(mods || {}).forEach(([name, mod]) => {
                        if (!mod || typeof mod !== 'object') return;
                        const entry = { ...mod };
                        if (entry.hotkey) entry.hotkey = normalizeHotkeyString(entry.hotkey);
                        payload[name] = entry;
                    });
                    localStorage.setItem(STORAGE_KEYS.DEFAULT_PRESET_MODS, JSON.stringify(payload));
                } catch { }
            },
            loadUser() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS);
                    if (!raw) return [];
                    const arr = JSON.parse(raw);
                    return Array.isArray(arr) ? arr.map(p => ({
                        ...p,
                        isDefault: false,
                        hotkey: normalizeHotkeyString(p.hotkey || ''),
                        showInMenu: p.showInMenu !== undefined ? p.showInMenu : false,
                        state: { ...p.state, startFrom: p.state.startFrom ? new Date(p.state.startFrom) : null }
                    })) : [];
                } catch { return []; }
            },
            loadAll() {
                const mods = this.loadDefaultMods();
                const defaults = DEFAULT_PRESETS.map(p => ({
                    ...p,
                    hotkey: mods[p.name]?.hotkey !== undefined ? normalizeHotkeyString(mods[p.name].hotkey) : normalizeHotkeyString(p.hotkey),
                    showInMenu: mods[p.name]?.showInMenu !== undefined ? mods[p.name].showInMenu : p.showInMenu
                }));
                return [...defaults, ...this.loadUser()];
            },
            updateDefault(name, updates) {
                const mods = this.loadDefaultMods();
                const merged = { ...mods[name], ...updates };
                if (merged.hotkey) merged.hotkey = normalizeHotkeyString(merged.hotkey);
                mods[name] = merged;
                this.saveDefaultMods(mods);
            },
            persist(list) {
                try {
                    const norm = list.map(p => ({
                        name: p.name,
                        ts: p.ts || Date.now(),
                        hotkey: normalizeHotkeyString(p.hotkey || ''),
                        showInMenu: p.showInMenu !== undefined ? p.showInMenu : false,
                        state: { ...p.state, startFrom: p.state.startFrom ? new Date(p.state.startFrom).toISOString() : null }
                    }));
                    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(norm));
                } catch { }
            },
            upsert(name, st, opts = {}) {
                name = (name || '').trim();
                if (!name) return { ok: false, reason: 'empty' };
                if (DEFAULT_PRESETS.some(p => p.name === name)) return { ok: false, reason: 'default' };

                const list = this.loadUser();
                const idx = list.findIndex(p => p.name === name);
                if (idx >= 0) list.splice(idx, 1);
                list.unshift({
                    name,
                    ts: Date.now(),
                    hotkey: normalizeHotkeyString(opts.hotkey || ''),
                    showInMenu: opts.showInMenu || false,
                    state: this.cloneState(st)
                });
                this.persist(list);
                return { ok: true, list };
            },
            delete(name) {
                if (DEFAULT_PRESETS.some(p => p.name === name)) return { ok: false, reason: 'default' };
                const list = this.loadUser().filter(p => p.name !== name);
                this.persist(list);
                return { ok: true, list };
            },
            update(name, updates) {
                const list = this.loadUser();
                const idx = list.findIndex(p => p.name === name);
                if (idx < 0) return { ok: false, reason: 'not_found' };
                const merged = { ...list[idx], ...updates };
                if (merged.hotkey) merged.hotkey = normalizeHotkeyString(merged.hotkey);
                list[idx] = merged;
                this.persist(list);
                return { ok: true, list };
            },
            cloneState(st) {
                return {
                    flash: !!st.flash,
                    delaySec: Number(st.delaySec) || 3,
                    slideshow: !!st.slideshow,
                    rootsOnly: !!st.rootsOnly,
                    imagesOnly: !!st.imagesOnly,
                    videosOnly: !!st.videosOnly,
                    videosAutoplay: !!st.videosAutoplay,
                    startFrom: st.startFrom ? new Date(st.startFrom) : null,
                    loop: !!st.loop
                };
            }
        };

        const loadUserPresets = () => PresetManager.loadUser();
        const loadAllPresets = () => PresetManager.loadAll();
        const persistPresets = (list) => PresetManager.persist(list);
        const upsertPresetByName = (name, st, opts) => PresetManager.upsert(name, st, opts);
        const deletePresetByName = (name) => PresetManager.delete(name);
        const cloneStateForSave = (st) => PresetManager.cloneState(st);
        const saveState = () => StateManager.save();
        const saveStateForPost = () => StateManager.saveForPost();
        const saveHotkeys = (hk) => HotkeyManager.save(hk);
        const matchesHotkey = (e, str) => HotkeyManager.matches(e, str);

        // Check if current state matches active preset
        function checkPresetMatch() {
            if (!currentPresetName) return;

            const preset = loadAllPresets().find(p => p.name === currentPresetName);
            if (!preset) return;

            // Compare state with preset state
            const presetState = preset.state;
            const stateMatches =
                state.flash === presetState.flash &&
                state.delaySec === presetState.delaySec &&
                state.slideshow === presetState.slideshow &&
                state.rootsOnly === presetState.rootsOnly &&
                state.imagesOnly === presetState.imagesOnly &&
                state.videosOnly === presetState.videosOnly &&
                state.videosAutoplay === presetState.videosAutoplay &&
                state.loop === presetState.loop;
                // Note: startFrom is not compared (users may want different start times)

            if (!stateMatches) {
                console.log('[Orbitar Replay] Settings changed, clearing active preset');
                currentPresetName = null;
                updatePresetButtons();
                if (panel && panel._refreshPresetButtons) {
                    panel._refreshPresetButtons();
                }
            }
        }

        // ---------- Utils: date parsing ----------
        function parseOrbitarDateUniversal(str) {
            const now = new Date();
            if (!str) return null;
            str = str.trim();
            const rxToday = /^(сегодня|today)[^\d]*(\d{1,2}):(\d{2})$/i;
            const rxYesterday = /^(вчера|yesterday)[^\d]*(\d{1,2}):(\d{2})$/i;
            const rxDate = /(\d{1,2})\s+([а-яА-ЯёЁ]+|[A-Za-z]+)[^\d]*(\d{1,2}):(\d{2})/i;
            const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let m;
            if ((m = rxToday.exec(str))) {
                const hour = +m[2], min = +m[3];
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
            }
            if ((m = rxYesterday.exec(str))) {
                const hour = +m[2], min = +m[3];
                const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
                dt.setDate(dt.getDate() - 1);
                return dt;
            }
            if ((m = rxDate.exec(str))) {
                const day = +m[1], monthText = m[2], hour = +m[3], min = +m[4];
                let month = monthsRu.indexOf(monthText.toLowerCase());
                if (month === -1) month = monthsEn.findIndex(x => x.toLowerCase() === monthText.toLowerCase());
                if (month === -1) month = now.getMonth();
                return new Date(now.getFullYear(), month, day, hour, min);
            }
            return null;
        }

        // ---------- Media detection ----------
        function isRootComment(div) {
            return !div.closest('.CommentComponent_answers__pRHM8 .comment');
        }
        function hasImage(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            return !!cnt.querySelector('img.image-large, img.image-scalable, .ContentComponent_content__lc9BO img, img');
        }
        function hasYoutube(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            return !!cnt.querySelector('.youtube-embed-processed, .youtube-embed, img[data-youtube]');
        }
        function hasMp4(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            const a = cnt.querySelector('a.video-embed img[data-video]');
            if (a) return true;
            if (cnt.querySelector('video')) return true;
            return false;
        }
        function hasVideo(div) { return hasYoutube(div) || hasMp4(div); }

        function getCommentDate(div) {
            const sig = div.querySelector('[class^="SignatureComponent_signature__"]');
            if (!sig) return null;
            const links = sig.querySelectorAll('a');
            if (links.length < 2) return null;
            return parseOrbitarDateUniversal(links[1].textContent.trim());
        }

        // ---------- API-based media detection ----------
        function apiHasImage(comment) {
            if (!comment || !comment.content) return false;
            return comment.content.includes('<img') &&
                !comment.content.includes('video-embed') &&
                !comment.content.includes('youtube-embed');
        }
        function apiHasVideo(comment) {
            if (!comment || !comment.content) return false;
            return comment.content.includes('video-embed') ||
                comment.content.includes('youtube-embed') ||
                comment.content.includes('data-video') ||
                comment.content.includes('data-youtube');
        }
        function apiIsRootComment(comment) {
            return !comment.parentComment;
        }
        function flattenComments(comments) {
            // Flatten nested structure (answers) into a single array
            const result = [];
            for (const c of comments) {
                result.push(c);
                if (c.answers && Array.isArray(c.answers)) {
                    result.push(...flattenComments(c.answers));
                }
            }
            return result;
        }

        // ---------- Collect & filter ----------
        function collectCommentsSorted(opts) {
            // Try API-based collection first
            if (cachedPostData && cachedPostData.comments) {
                return collectCommentsFromAPI(opts);
            }

            // Fallback to DOM-based collection
            return collectCommentsFromDOM(opts);
        }

        function collectCommentsFromAPI(opts) {
            // Flatten all comments (including nested answers)
            let comments = flattenComments(cachedPostData.comments);

            // Filter by date
            if (opts.startFrom && !isNaN(opts.startFrom.getTime())) {
                comments = comments.filter(c => new Date(c.created) >= opts.startFrom);
            }

            // Filter: root only
            if (opts.rootsOnly) {
                comments = comments.filter(c => apiIsRootComment(c));
            }

            // Filter: images only (exclude videos)
            if (opts.imagesOnly) {
                comments = comments.filter(c => apiHasImage(c) && !apiHasVideo(c));
            }

            // Filter: videos only
            if (opts.videosOnly) {
                comments = comments.filter(c => apiHasVideo(c));
            }

            // Sort by date (API provides clean timestamps!)
            comments.sort((a, b) => new Date(a.created) - new Date(b.created));

            // Map to DOM elements
            const rows = [];
            for (const comment of comments) {
                const elem = document.querySelector(`div.comment[data-comment-id="${comment.id}"]`);
                if (elem) {
                    rows.push({
                        elem,
                        date: new Date(comment.created),
                        apiData: comment // Include API data for reference
                    });
                }
            }

            console.log('[Orbitar Replay] Using API data:', rows.length, 'comments filtered');
            return rows;
        }

        function collectCommentsFromDOM(opts) {
            const commentDivs = Array.from(document.querySelectorAll('div.comment[data-comment-id]'));
            let rows = [];
            for (const div of commentDivs) {
                const date = getCommentDate(div);
                if (!date) continue;
                rows.push({ elem: div, date });
            }
            rows.sort((a, b) => a.date - b.date);

            if (opts.rootsOnly) rows = rows.filter(r => isRootComment(r.elem));
            if (opts.imagesOnly) rows = rows.filter(r => hasImage(r.elem) && !hasVideo(r.elem)); // exclude videos
            if (opts.videosOnly) rows = rows.filter(r => hasVideo(r.elem));
            if (opts.startFrom && !isNaN(opts.startFrom.getTime())) {
                rows = rows.filter(r => r.date >= opts.startFrom);
            }

            console.log('[Orbitar Replay] Using DOM parsing:', rows.length, 'comments filtered');
            return rows;
        }

        // ---------- Hide/show ----------
        function hideAll(list) {
            for (const c of list) {
                c.elem.style.display = 'none';
                c.elem.style.visibility = '';
                c.elem.style.opacity = '';
                c.elem.style.pointerEvents = '';
                c.elem.style.boxShadow = '';
            }
        }
        async function revealCommentFlow(elem, flashOn, centerBlock = "center") {
            elem.style.display = '';
            elem.style.visibility = 'hidden';
            elem.style.opacity = '0';
            elem.scrollIntoView({ behavior: "smooth", block: centerBlock });
            await new Promise(r => setTimeout(r, 600));
            elem.style.visibility = 'visible';
            elem.style.opacity = '1';
            elem.style.transition = 'opacity 0.25s';
            elem.style.pointerEvents = 'auto';
            if (flashOn) {
                await new Promise(r => setTimeout(r, 200));
                elem.style.boxShadow = '0 0 0 3px #28b0ff, 0 0 10px 2px #63cbff';
                setTimeout(() => { elem.style.boxShadow = ''; }, 500);
            }
        }

        // ---------- Overlay (slideshow) ----------
        let overlay, overlayInner, overlayHeader, overlayClose, overlayAutoIndicator, overlayDelayControl, overlayCollapsed = false;
        let overlayBtnPrev, overlayBtnNext; // Navigation buttons for keyboard highlight
        let currentYTPlayer = null;
        let currentWait = null; // cancellable waiter
        let lastMediaVolume = +localStorage.getItem(STORAGE_KEYS.VOLUME) || 60;
        let lastMediaMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
        let replayIconContainer = null;
        let replayModeBadge = null;
        let settingsModal = null;
        let settingsKeyHandler = null;
        let globalToggleHandler = null; // Global hotkey for script enable/disable

        function ensureOverlay() {
            if (overlay) return;
            overlay = document.createElement('div');
            overlay.id = 'orbitarReplayOverlay';
            overlay.classList.add('orbitar-replay-overlay');

            overlayInner = document.createElement('div');
            overlayInner.classList.add('orbitar-overlay-inner');

            // Header with count + auto indicator + delay control
            overlayHeader = document.createElement('div');
            overlayHeader.classList.add('orbitar-overlay-header');

            overlayAutoIndicator = document.createElement('span');
            overlayAutoIndicator.classList.add('orbitar-overlay-auto');
            overlayHeader.appendChild(overlayAutoIndicator);

            // Delay control (shown when autoplay is active)
            overlayDelayControl = document.createElement('span');
            overlayDelayControl.classList.add('orbitar-overlay-delay');
            overlayDelayControl.innerHTML = `
                <button id="overlayDelayDown" class="orbitar-overlay-delay-btn" type="button">−</button>
                <span id="overlayDelayValue" class="orbitar-overlay-delay-value">3 сек</span>
                <button id="overlayDelayUp" class="orbitar-overlay-delay-btn" type="button">+</button>
            `;
            overlayHeader.appendChild(overlayDelayControl);

            // Close X button
            overlayClose = document.createElement('button');
            overlayClose.textContent = '✖';
            overlayClose.type = 'button';
            overlayClose.classList.add('orbitar-overlay-close');
            overlayClose.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentWait) { currentWait.cancel('close'); currentWait = null; }
                playing = false;
                closeOverlay();
            });

            // Navigation button - Left (Назад)
            overlayBtnPrev = document.createElement('button');
            overlayBtnPrev.textContent = '←';
            overlayBtnPrev.type = 'button';
            overlayBtnPrev.classList.add('orbitar-overlay-nav', 'left');
            overlayBtnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentWait) { currentWait.cancel('nav_prev'); currentWait = null; }
                if (list.length === 0) return;
                dispatchPrev();
            });

            // Navigation button - Right (Вперёд)
            overlayBtnNext = document.createElement('button');
            overlayBtnNext.textContent = '→';
            overlayBtnNext.type = 'button';
            overlayBtnNext.classList.add('orbitar-overlay-nav', 'right');
            overlayBtnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentWait) { currentWait.cancel('nav_next'); currentWait = null; }
                if (list.length === 0) return;
                dispatchNext();
            });

            overlay.appendChild(overlayInner);
            overlay.appendChild(overlayHeader);
            overlay.appendChild(overlayClose);
            overlay.appendChild(overlayBtnPrev);
            overlay.appendChild(overlayBtnNext);
            document.body.appendChild(overlay);

            // Delay control event listeners
            const delayUpBtn = overlay.querySelector('#overlayDelayUp');
            const delayDownBtn = overlay.querySelector('#overlayDelayDown');

            delayUpBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                adjustDelay(1);
                delayUpBtn.blur();
            });

            delayDownBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                adjustDelay(-1);
                delayDownBtn.blur();
            });

            // Don't close on overlay click anymore - only on X or Esc
        }
        function openOverlay(node) {
            ensureOverlay();
            replaceOverlayContent(node);
            overlay.style.display = 'flex';
        }
        function replaceOverlayContent(node) {
            try { if (currentYTPlayer?.stopVideo) currentYTPlayer.stopVideo(); } catch (_) { }
            try { if (currentYTPlayer?.destroy) currentYTPlayer.destroy(); } catch (_) { }
            currentYTPlayer = null;

            overlayInner.innerHTML = '';
            if (node) overlayInner.appendChild(node);
        }
        function closeOverlay() {
            if (!overlay) return;
            replaceOverlayContent(null);
            overlay.style.display = 'none';
        }
        function isOverlayOpen() {
            return overlay && overlay.style.display === 'flex';
        }
        function setOverlayHeader(text) {
            if (!overlayHeader) return;
            const textNodes = Array.from(overlayHeader.childNodes).filter(n => n.nodeType === 3);
            textNodes.forEach(n => n.remove());
            if (text) overlayHeader.appendChild(document.createTextNode(text));
        }
        function adjustDelay(delta) {
            let newDelay = Math.max(1, Math.min(60, state.delaySec + delta));
            state.delaySec = newDelay;
            saveState();
            updateDelayDisplay();
            const delayInput = panel?.querySelector('#replay_delay');
            if (delayInput) {
                delayInput.value = newDelay;
                const autoBtnElement = panel?.querySelector('#btn_auto');
                if (autoBtnElement && playing && !state.slideshow && scriptEnabled) {
                    const autoBtnDelay = panel.querySelector('#btn_auto_delay');
                    if (autoBtnDelay) {
                        autoBtnDelay.textContent = `${newDelay} сек`;
                    }
                }
            }
            updateModeBadge();
        }

        function updateDelayDisplay() {
            const delayValueSpan = overlay?.querySelector('#overlayDelayValue');
            if (delayValueSpan) {
                delayValueSpan.textContent = `${state.delaySec} сек`;
            }
        }

        function updateAutoIndicator() {
            if (overlayAutoIndicator) {
                overlayAutoIndicator.textContent = playing ? '▶️' : '⏸️';
            }
            // Show/hide delay control based on playing state
            if (overlayDelayControl) {
                overlayDelayControl.style.display = playing ? 'flex' : 'none';
                if (playing) updateDelayDisplay();
            }
        }

        // Flash navigation button on keyboard press
        function flashNavButton(button) {
            if (!button || !isOverlayOpen()) return;
            const originalBg = button.style.background;
            button.style.background = 'rgba(255,255,255,0.35)';
            button.style.opacity = '0.9';
            setTimeout(() => {
                button.style.background = originalBg;
                button.style.opacity = '0.7';
            }, 150);
        }

        // ---------- Media node builders ----------
        function buildImageNode(imgEl) {
            const src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.currentSrc || imgEl.src;
            const wrap = document.createElement('div');
            Object.assign(wrap.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '92vw', maxHeight: '86vh' });
            const img = document.createElement('img');
            img.src = src;
            Object.assign(img.style, { maxWidth: '92vw', maxHeight: '86vh', objectFit: 'contain', display: 'block' });
            wrap.appendChild(img);
            return wrap;
        }

        function buildVideoNodeFromMp4(div, autoplay, wantControls = true) {
            const aimg = div.querySelector('.ContentComponent_content__lc9BO a.video-embed img[data-video]');
            let raw = aimg?.getAttribute('data-video');
            const src = raw || div.querySelector('.ContentComponent_content__lc9BO video')?.src;
            const wrap = document.createElement('div');
            Object.assign(wrap.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '92vw', maxHeight: '86vh' });

            const v = document.createElement('video');
            Object.assign(v.style, { maxWidth: '92vw', maxHeight: '86vh', outline: 'none', background: '#000' });
            if (src) {
                v.src = src;
                v.playsInline = true;
                v.controls = !!wantControls;
                v.muted = !!lastMediaMuted;
                try { v.volume = Math.min(1, Math.max(0, lastMediaVolume / 100)); } catch (_) { }
                if (autoplay) v.autoplay = true;
            }
            v.addEventListener('volumechange', () => {
                try {
                    lastMediaMuted = v.muted;
                    localStorage.setItem(STORAGE_KEYS.MUTED, String(lastMediaMuted));
                    lastMediaVolume = Math.round((v.volume || 0) * 100);
                    localStorage.setItem(STORAGE_KEYS.VOLUME, String(lastMediaVolume));
                } catch (_) { }
            });
            wrap.appendChild(v);
            return { wrap, video: v, ok: !!src };
        }

        let ytApiLoaded = false;
        let ytApiLoadingPromise = null;
        function loadYouTubeAPI() {
            if (ytApiLoaded) return Promise.resolve();
            if (ytApiLoadingPromise) return ytApiLoadingPromise;
            ytApiLoadingPromise = new Promise((resolve) => {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                window.onYouTubeIframeAPIReady = function () {
                    ytApiLoaded = true;
                    resolve();
                };
                document.head.appendChild(tag);
            });
            return ytApiLoadingPromise;
        }
        function extractYouTubeId(div) {
            const img = div.querySelector('.ContentComponent_content__lc9BO img[data-youtube]');
            if (img) {
                const u = img.getAttribute('data-youtube') || '';
                const m = u.match(/embed\/([A-Za-z0-9_\-]+)/);
                if (m) return m[1];
            }
            const a = div.querySelector('.ContentComponent_content__lc9BO a.youtube-embed, .ContentComponent_content__lc9BO .youtube-embed-processed');
            if (a?.href) {
                try {
                    const url = new URL(a.href);
                    if (url.hostname.includes('youtube.com')) {
                        const id = url.searchParams.get('v');
                        if (id) return id;
                    }
                } catch (_) { }
            }
            return null;
        }
        function buildYouTubeNode(div, autoplay) {
            const vid = extractYouTubeId(div);
            if (!vid) return { wrap: null, init: () => Promise.resolve(), ok: false };

            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '92vw', height: '86vh', background: '#000', borderRadius: '8px'
            });

            const holder = document.createElement('div');
            Object.assign(holder.style, { width: '92vw', height: '86vh' });
            wrap.appendChild(holder);

            const init = async () => {
                await loadYouTubeAPI();
                currentYTPlayer = new YT.Player(holder, {
                    videoId: vid,
                    playerVars: { autoplay: autoplay ? 1 : 0, controls: 1, modestbranding: 1, rel: 0, playsinline: 1 },
                    events: {
                        onReady: (ev) => {
                            try {
                                if (lastMediaMuted) ev.target.mute();
                                else { ev.target.unMute(); ev.target.setVolume(Math.min(100, Math.max(0, lastMediaVolume))); }
                                if (autoplay) ev.target.playVideo();
                            } catch (_) { }
                        }
                    }
                });
            };
            return { wrap, init, ok: true };
        }

        // waiter (cancellable)
        function cancellableWaiter() {
            let cancelCb;
            const p = new Promise((resolve, reject) => {
                cancelCb = (reason) => reject(new Error(String(reason || 'cancelled')));
            });
            return { promise: p, cancel: cancelCb };
        }

        // ---------- Panel UI ----------
        let replayIconObserver = null;
        let replayIcon = null;

        function insertReplayIcon() {
            if (!isPostPage()) return;
            if (replayIconContainer && document.body.contains(replayIconContainer)) return;

            const colors = getSiteColors();

            // Main container - will hold both rows
            replayIconContainer = document.createElement('div');
            replayIconContainer.className = 'orbitarReplayIconContainer';
            applyThemeVariables(replayIconContainer, colors);

            // First row: main button + mode badge
            const mainRow = document.createElement('div');
            mainRow.classList.add('orbitar-replay-main-row');

            replayIcon = document.createElement('button');
            replayIcon.className = 'orbitarReplayIcon';
            replayIcon.title = scriptEnabled ? 'rePlay (активен)' : 'rePlay (выключен)';

            replayIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleReplayPanel();
            });

            replayModeBadge = document.createElement('span');
            replayModeBadge.className = 'orbitarReplayModeBadge';

            mainRow.appendChild(replayIcon);
            mainRow.appendChild(replayModeBadge);
            replayIconContainer.appendChild(mainRow);

            // Second row: preset buttons
            if (scriptEnabled) {
                const presetsRow = document.createElement('div');
                presetsRow.className = 'orbitarPresetsRow';

                const presets = loadAllPresets().filter(p => p.showInMenu);
                presets.forEach(preset => {
                    const btn = document.createElement('button');
                    btn.className = 'orbitarPresetMenuBtn';
                    btn.dataset.presetName = preset.name;
                    btn.textContent = preset.name;
                    btn.title = `Пресет: ${preset.name}`;

                    const isActive = currentPresetName === preset.name;
                    if (isActive) btn.classList.add('active');

                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        applyPreset(preset);
                    });

                    presetsRow.appendChild(btn);
                });

                if (presets.length > 0) {
                    replayIconContainer.appendChild(presetsRow);
                }
            }

            const watchLink = document.querySelector('a[href="/watch"]');
            let leftPosition = '0';
            if (watchLink) {
                const rect = watchLink.getBoundingClientRect();
                leftPosition = `${rect.left}px`;
            }

            document.body.appendChild(replayIconContainer);
            replayIconContainer.style.left = leftPosition;

            updateReplayIcon();

            [100, 300, 600, 1000].forEach(delay => {
                setTimeout(() => {
                    updateReplayIcon();
                }, delay);
            });
        }

        function applyPreset(preset) {
            currentPresetName = preset.name;
            state = cloneStateForSave(preset.state);

            console.log('[Orbitar Replay] Applied preset:', preset.name);

            // If panel is open, update UI and rebuild
            if (panel) {
                const statusDiv = panel.querySelector('#replay_status');
                if (statusDiv) statusDiv.textContent = `Пресет: ${preset.name}`;

                // Manually trigger UI update
                const applyStateToUI = panel._applyStateToUI;
                if (applyStateToUI) {
                    applyStateToUI();
                }

                // Rebuild list
                const rebuildList = panel._rebuildList;
                if (rebuildList) {
                    rebuildList(true);
                }

                const refreshPresetButtons = panel._refreshPresetButtons;
                if (refreshPresetButtons) {
                    refreshPresetButtons();
                }
            }

            updatePresetButtons();
        }

        function updateReplayIcon() {
            if (!replayIcon) return;
            const colors = getSiteColors();
            if (replayIconContainer) {
                applyThemeVariables(replayIconContainer, colors);
            }

            if (replayIconContainer) {
                const watchLink = document.querySelector('a[href="/watch"]');
                if (watchLink) {
                    const rect = watchLink.getBoundingClientRect();
                    replayIconContainer.style.left = `${rect.left}px`;
                }
            }

            // Базовая иконка с индикатором режима
            let modeIcon = '';
            if (scriptEnabled) {
                if (playing) {
                    // Показываем маленькую иконку авто в углу
                    modeIcon = '<circle cx="19" cy="6" r="4" fill="#22c55e"/><text x="19" y="8.5" text-anchor="middle" font-size="6" fill="white" font-weight="bold">▶</text>';
                }
                // В мануальном режиме (скрипт включен, но не играет) - нет дополнительного индикатора
            }

            replayIcon.title = scriptEnabled
                ? (playing ? 'rePlay (авто режим)' : 'rePlay (готов)')
                : 'rePlay (выключен)';

            replayIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" style="display: block;">
                    <path d="M8 5v14l11-7z" fill="${colors.panelText}" opacity="${scriptEnabled ? '1' : '0.3'}"/>
                    ${!scriptEnabled ? '<line x1="4" y1="4" x2="20" y2="20" stroke="' + colors.panelText + '" stroke-width="2" opacity="0.7"/>' : ''}
                    ${modeIcon}
                </svg>
            `;
            updateModeBadge();
        }

        function updateModeBadge() {
            if (!replayModeBadge || !replayIconContainer) return;

            // Показываем статус комментов когда скрипт активен (играет или готов)
            if (scriptEnabled && list.length > 0 && currentIndex >= 0) {
                let statusText = `${currentIndex + 1}/${list.length}`;
                // В авто режиме добавляем делей
                if (playing && !state.slideshow) {
                    statusText += ` • ${state.delaySec}с`;
                }
                replayModeBadge.textContent = statusText;
                replayModeBadge.classList.add('visible');
            } else if (scriptEnabled && list.length > 0) {
                // Показываем только количество комментов если еще не начали
                replayModeBadge.textContent = `${list.length}`;
                replayModeBadge.classList.add('visible');
            } else {
                replayModeBadge.classList.remove('visible');
            }
        }

        function updatePresetButtons() {
            // Recreate replay icon (includes presets)
            if (replayIconContainer && document.body.contains(replayIconContainer)) {
                replayIconContainer.remove();
                replayIconContainer = null;
            }
            insertReplayIcon();
        }

        function observeForReplayIcon() {
            // Disconnect previous observer if it exists
            if (replayIconObserver) {
                replayIconObserver.disconnect();
            }

            replayIconObserver = new MutationObserver(() => {
                insertReplayIcon();
            });

            // Start observing
            replayIconObserver.observe(document.body, { childList: true, subtree: true });

            // Also try inserting immediately
            insertReplayIcon();
        }

        function toggleReplayPanel() {
            if (panel) {
                // Просто закрываем панель без автосохранения
                removePanel();
            } else {
                // Автоматически включать скрипт при первом открытии панели
                if (!scriptEnabled) {
                    toggleScript(true);
                }
                showReplayPanel();
            }
        }

        function closeSettingsModal() {
            if (settingsModal) {
                settingsModal.remove();
                settingsModal = null;
            }
            if (settingsKeyHandler) {
                document.removeEventListener('keydown', settingsKeyHandler);
                settingsKeyHandler = null;
            }
        }

        function factoryReset() {
            if (!confirm('Сбросить ВСЕ настройки скрипта? Это действие нельзя отменить.')) {
                return;
            }

            // Clear all script data from localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('orbitar_replay')) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));

            console.log('[Orbitar Replay] Factory reset completed. Removed keys:', keysToRemove);
            alert('Настройки сброшены. Страница будет перезагружена.');
            location.reload();
        }

        // Hotkey capture helper
        let hotkeyCapturing = null;

        function startHotkeyCapture(inputElement, onCapture, onCancel) {
            if (hotkeyCapturing) {
                hotkeyCapturing.cancel();
            }

            inputElement.value = '...';
            inputElement.style.background = '#fae251';
            inputElement.style.color = '#000'; // Black text for visibility

            const handler = (e) => {
                // Ignore modifier-only keys (Shift, Control, Meta, Alt by themselves)
                const modifierKeys = ['Shift', 'Control', 'Meta', 'Alt', 'CapsLock', 'Tab'];
                if (modifierKeys.includes(e.key)) {
                    return; // Wait for actual key press
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent closing modal
                    stopHotkeyCapture();
                    if (onCancel) onCancel();
                    return;
                }

                e.preventDefault();
                e.stopPropagation(); // Prevent script hotkeys from triggering

                // Build hotkey string (modifiers first, then key)
                const parts = [];
                if (eventHasMetaModifier(e)) parts.push(HOTKEY_META_TOKEN);
                if (e.shiftKey) parts.push('Shift');
                if (e.altKey) parts.push('Alt');

                const keyName = normalizeEventKey(e.key);
                parts.push(keyName);

                const hotkeyString = normalizeHotkeyString(parts.join('+'));

                inputElement.value = displayHotkeyString(hotkeyString);
                stopHotkeyCapture();

                if (onCapture) onCapture(hotkeyString);
            };

            const stopHotkeyCapture = () => {
                document.removeEventListener('keydown', handler, true); // Use capture phase
                inputElement.style.background = '';
                inputElement.style.color = ''; // Restore original color
                hotkeyCapturing = null;
            };

            hotkeyCapturing = { cancel: stopHotkeyCapture, active: true };
            document.addEventListener('keydown', handler, true); // Capture phase - intercept before others
        }

        function openSettingsModal(colors) {
            closeSettingsModal();

            settingsModal = document.createElement('div');
            Object.assign(settingsModal.style, {
                position: 'fixed',
                inset: '0',
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '1000000'
            });

            const content = document.createElement('div');
            Object.assign(content.style, {
                width: '650px',
                maxWidth: '90vw',
                maxHeight: '85vh',
                overflowY: 'auto',
                background: colors.panelBg,
                border: `1.5px solid ${colors.panelBorder}`,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.35)'
            });

            content.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div style="font-weight:700;font-size:18px;color:${colors.titleColor}">⚙️ Расширенные настройки</div>
                    <button id="settings_close" style="background:${colors.buttonSecondaryBg};color:${colors.panelText};border:1px solid ${colors.panelBorder};border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;">Закрыть</button>
                </div>

                <div style="line-height:1.6;color:${colors.panelText};font-size:13px;">
                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">⌨️ Системные хоткеи</div>
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">Кликните на поле, затем нажмите нужную комбинацию. Esc отменяет. Автосохранение.</div>
                        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px 16px;">
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Старт/пауза:</label>
                                <input class="hotkey-input" data-key="playPause" value="${displayHotkeyString(hotkeys.playPause)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>

                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Шаг назад:</label>
                                <input class="hotkey-input" data-key="stepPrev" value="${displayHotkeyString(hotkeys.stepPrev)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                                <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Шаг вперед:</label>
                                <input class="hotkey-input" data-key="stepNext" value="${displayHotkeyString(hotkeys.stepNext)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">↑ Задержка:</label>
                                <input class="hotkey-input" data-key="delayUp" value="${displayHotkeyString(hotkeys.delayUp)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">↓ Задержка:</label>
                                <input class="hotkey-input" data-key="delayDown" value="${displayHotkeyString(hotkeys.delayDown)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Закрыть:</label>
                                <input class="hotkey-input" data-key="closeOverlay" value="${displayHotkeyString(hotkeys.closeOverlay)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Вкл/выкл:</label>
                                <input class="hotkey-input" data-key="toggleScript" value="${displayHotkeyString(hotkeys.toggleScript)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                            <div style="display:grid;grid-template-columns:110px 1fr;gap:6px;align-items:center;">
                                <label style="font-size:12px;">Слайдшоу:</label>
                                <input class="hotkey-input" data-key="toggleSlideshow" value="${displayHotkeyString(hotkeys.toggleSlideshow)}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">🎛️ Управление пресетами</div>
                        <div id="presets_list" style="display:flex;flex-direction:column;gap:8px;"></div>
                    </div>

                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">📄 Настройки постов</div>
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">Посты с сохранёнными индивидуальными настройками</div>
                        <div id="post_settings_list" style="display:flex;flex-direction:column;gap:6px;"></div>
                    </div>

                    <div>
                        <div style="font-weight:600;margin-bottom:8px;color:#dc2626;">⚠️ Опасная зона</div>
                        <button id="factory_reset" style="padding:8px 16px;background:#dc2626;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">🔄 Сброс настроек (Factory Reset)</button>
                        <div style="margin-top:6px;font-size:11px;opacity:0.7;">Удалит ВСЕ сохранённые настройки</div>
                    </div>
                </div>
            `;

            settingsModal.appendChild(content);
            document.body.appendChild(settingsModal);

            const closeBtn = content.querySelector('#settings_close');
            closeBtn?.addEventListener('click', () => closeSettingsModal());
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) closeSettingsModal();
            });

            // Render presets list
            const presetsContainer = content.querySelector('#presets_list');
            function renderPresetsList() {
                const allPresets = PresetManager.loadAll();
                presetsContainer.innerHTML = '';

                allPresets.forEach(preset => {
                    const item = document.createElement('div');
                    item.style.cssText = `padding:8px;border:1px solid ${colors.panelBorder};border-radius:6px;background:${colors.inputBg};`;

                    const header = document.createElement('div');
                    header.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;';

                    // Name (editable for user presets)
                    if (preset.isDefault) {
                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = preset.name;
                        nameSpan.style.cssText = `flex:1;font-weight:600;color:${colors.titleColor};`;
                        header.appendChild(nameSpan);
                    } else {
                        const nameInput = document.createElement('input');
                        nameInput.value = preset.name;
                        nameInput.style.cssText = `flex:1;font-weight:600;background:transparent;border:none;color:${colors.titleColor};font-size:13px;`;
                        nameInput.addEventListener('change', () => {
                            const newName = nameInput.value.trim();
                            if (newName && newName !== preset.name) {
                                // Rename preset
                                PresetManager.delete(preset.name);
                                PresetManager.upsert(newName, preset.state, { hotkey: preset.hotkey, showInMenu: preset.showInMenu });
                                renderPresetsList();
                                updatePresetButtons();
                            }
                        });
                        header.appendChild(nameInput);
                    }

                    // Delete button (только для user presets)
                    if (!preset.isDefault) {
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = '✖';
                        deleteBtn.style.cssText = `padding:2px 6px;background:transparent;color:#dc2626;border:1px solid #dc2626;border-radius:4px;cursor:pointer;font-size:11px;`;
                        deleteBtn.addEventListener('click', () => {
                            if (confirm(`Удалить пресет "${preset.name}"?`)) {
                                PresetManager.delete(preset.name);
                                renderPresetsList();
                                updatePresetButtons();
                            }
                        });
                        header.appendChild(deleteBtn);
                    }

                    item.appendChild(header);

                    // Controls row
                    const controls = document.createElement('div');
                    controls.style.cssText = 'display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;font-size:12px;';

                    // Hotkey input
                    const hotkeyLabel = document.createElement('span');
                    hotkeyLabel.textContent = 'Хоткей:';
                    hotkeyLabel.style.color = colors.labelText;

                    const hotkeyInput = document.createElement('input');
                    hotkeyInput.value = displayHotkeyString(preset.hotkey || '');
                    hotkeyInput.placeholder = '1-2 символа';
                    hotkeyInput.readOnly = true;
                    hotkeyInput.style.cssText = `padding:3px 6px;border:1px solid ${colors.inputBorder};border-radius:4px;background:${colors.panelBg};color:${colors.inputText};font-size:11px;cursor:pointer;max-width:80px;`;
                    hotkeyInput.addEventListener('click', () => {
                        const oldValue = hotkeyInput.value;
                        startHotkeyCapture(
                            hotkeyInput,
                            (hotkeyString) => {
                                if (preset.isDefault) {
                                    PresetManager.updateDefault(preset.name, { hotkey: hotkeyString });
                                } else {
                                    PresetManager.update(preset.name, { hotkey: hotkeyString });
                                }
                                renderPresetsList();
                                updatePresetButtons();
                            },
                            () => { hotkeyInput.value = oldValue; }
                        );
                    });

                    controls.appendChild(hotkeyLabel);
                    controls.appendChild(hotkeyInput);

                    // Show in menu toggle
                    const menuToggle = document.createElement('label');
                    menuToggle.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;';

                    const menuCheckbox = document.createElement('input');
                    menuCheckbox.type = 'checkbox';
                    menuCheckbox.checked = preset.showInMenu;
                    menuCheckbox.style.cssText = 'width:14px;height:14px;cursor:pointer;';
                    menuCheckbox.addEventListener('change', () => {
                        if (preset.isDefault) {
                            PresetManager.updateDefault(preset.name, { showInMenu: menuCheckbox.checked });
                        } else {
                            PresetManager.update(preset.name, { showInMenu: menuCheckbox.checked });
                        }
                        renderPresetsList();
                        updatePresetButtons();
                    });

                    const menuLabel = document.createElement('span');
                    menuLabel.textContent = 'В меню';
                    menuLabel.style.cssText = `color:${colors.labelText};font-size:11px;white-space:nowrap;`;

                    menuToggle.appendChild(menuCheckbox);
                    menuToggle.appendChild(menuLabel);
                    controls.appendChild(menuToggle);

                    item.appendChild(controls);

                    presetsContainer.appendChild(item);
                });
            }

            renderPresetsList();

            // Render post settings list
            const postSettingsContainer = content.querySelector('#post_settings_list');
            function renderPostSettingsList() {
                postSettingsContainer.innerHTML = '';

                const postSettings = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(STORAGE_KEYS.POST_PREFIX)) {
                        const postId = key.replace(STORAGE_KEYS.POST_PREFIX, '');
                        postSettings.push({ key, postId });
                    }
                }

                if (postSettings.length === 0) {
                    const empty = document.createElement('div');
                    empty.textContent = 'Нет сохранённых настроек постов';
                    empty.style.cssText = `font-size:12px;opacity:0.6;color:${colors.labelText};padding:8px;`;
                    postSettingsContainer.appendChild(empty);
                    return;
                }

                postSettings.forEach(({ key, postId }) => {
                    const item = document.createElement('div');
                    item.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border:1px solid ${colors.panelBorder};border-radius:6px;background:${colors.inputBg};`;

                    const label = document.createElement('span');
                    label.textContent = `Пост: ${postId}`;
                    label.style.cssText = `font-size:12px;color:${colors.labelText};`;

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '✖';
                    deleteBtn.style.cssText = `padding:2px 8px;background:transparent;color:#dc2626;border:1px solid #dc2626;border-radius:4px;cursor:pointer;font-size:11px;`;
                    deleteBtn.addEventListener('click', () => {
                        if (confirm(`Удалить настройки для поста ${postId}?`)) {
                            localStorage.removeItem(key);
                            renderPostSettingsList();
                            console.log('[Orbitar Replay] Deleted settings for post:', postId);
                        }
                    });

                    item.appendChild(label);
                    item.appendChild(deleteBtn);
                    postSettingsContainer.appendChild(item);
                });
            }

            renderPostSettingsList();

            // Factory reset button
            const resetBtn = content.querySelector('#factory_reset');
            resetBtn?.addEventListener('click', () => {
                factoryReset();
            });

            const hotkeyInputs = content.querySelectorAll('.hotkey-input');
            hotkeyInputs.forEach(input => {
                const originalValue = input.value;
                input.addEventListener('click', () => {
                    startHotkeyCapture(
                        input,
                        (hotkeyString) => {
                            // Hotkey captured successfully
                            input.value = displayHotkeyString(hotkeyString);

                            // Auto-save: collect all hotkeys and save
                            const newHotkeys = {};
                            hotkeyInputs.forEach(inp => {
                                const key = inp.getAttribute('data-key');
                                newHotkeys[key] = normalizeHotkeyString(inp.value.trim());
                            });

                            hotkeys = newHotkeys;
                            hotkeyInputs.forEach(inp => {
                                const key = inp.getAttribute('data-key');
                                inp.value = displayHotkeyString(hotkeys[key] || '');
                            });
                            saveHotkeys(hotkeys);
                            setupGlobalToggleHandler(); // Reinitialize

                            console.log('[Orbitar Replay] Hotkey auto-saved:', hotkeyString);
                        },
                        () => {
                            // Cancelled - restore original value
                            input.value = originalValue;
                        }
                    );
                });
            });

            settingsKeyHandler = (e) => {
                // Don't close if capturing hotkey
                if (hotkeyCapturing && hotkeyCapturing.active) return;
                if (e.key === 'Escape') closeSettingsModal();
            };
            document.addEventListener('keydown', settingsKeyHandler);
        }

        // Auto-hide panel when playback starts
        function hidePanelOnPlay() {
            if (panel) {
                removePanel();
            }
        }

        let panel, playing = false, list = [];
        let currentIndex = -1;
        let currentPresetName = null;
        let scriptEnabled = false;
        let autoCollapseTimeout = null;
        let hotkeyHandler = null;
        let originalUrlOnEnable = null;
        let currentPostIdTracked = null;
        let hotkeys;

        // Centralized toggle script function
        function toggleScript(enable) {
            const wasEnabled = scriptEnabled;
            scriptEnabled = enable;

            if (scriptEnabled && !wasEnabled) {
                // ENABLING script
                console.log('[Orbitar Replay] Enabling script');

                originalUrlOnEnable = location.href;

                // Navigate to "все комментарии" if we're on ?new
                if (location.search.includes('new')) {
                    const allCommentsLink = Array.from(document.querySelectorAll('a')).find(a =>
                        a.textContent.trim() === 'все комментарии'
                    );
                    if (allCommentsLink) {
                        console.log('[Orbitar Replay] Navigating to all comments');
                        allCommentsLink.click();
                    }
                }
            } else if (!scriptEnabled && wasEnabled) {
                // DISABLING script
                console.log('[Orbitar Replay] Disabling script');

                // Stop playing
                if (playing) {
                    playing = false;
                    if (currentWait) { currentWait.cancel('script_disabled'); currentWait = null; }
                    closeOverlay();
                }

                // Restore original URL mode if needed
                if (originalUrlOnEnable && originalUrlOnEnable.includes('?new') && !location.search.includes('new')) {
                    const newCommentsLink = Array.from(document.querySelectorAll('a')).find(a =>
                        a.textContent.trim() === 'только новые'
                    );
                    if (newCommentsLink) {
                        console.log('[Orbitar Replay] Restoring "new comments" mode');
                        newCommentsLink.click();
                    }
                }

                originalUrlOnEnable = null;
            }

            updateReplayIcon();
            updateModeBadge();
            updatePresetButtons();

            const toggleScriptIcon = document.querySelector('#toggle_script_icon');
            if (toggleScriptIcon) {
                toggleScriptIcon.innerHTML = scriptEnabled ? '✓' : '✖';
                toggleScriptIcon.title = scriptEnabled ? 'Скрипт включён' : 'Скрипт выключен';
                toggleScriptIcon.classList.toggle('off', !scriptEnabled);
            }

            const statusDiv = document.querySelector('#replay_status');
            if (statusDiv) {
                statusDiv.textContent = scriptEnabled ? '✓ Скрипт включён' : '✖ Скрипт выключен';
            }

            console.log(`[Orbitar Replay] Script enabled: ${scriptEnabled ? 'ON' : 'OFF'}`);
        }

        // Global dispatch functions (accessible everywhere)
        function dispatchPlayPause() {
            console.log('[Orbitar Replay] dispatchPlayPause called. scriptEnabled:', scriptEnabled, 'playing:', playing, 'list.length:', list.length);
            if (!scriptEnabled) {
                console.warn('[Orbitar Replay] Script is disabled, cannot play');
                return;
            }
            if (!playing) {
                playing = true;
                if (list.length === 0) {
                    list = collectCommentsSorted({
                        rootsOnly: state.rootsOnly,
                        imagesOnly: state.imagesOnly,
                        videosOnly: state.videosOnly,
                        startFrom: state.startFrom
                    });
                    hideAll(list);
                    currentIndex = -1;
                }
                console.log('[Orbitar Replay] Starting playback. List length:', list.length);
                if (panel) {
                    const autoBtn = panel.querySelector('#btn_auto');
                    if (autoBtn) {
                        autoBtn.textContent = '⏸ Пауза';
                        autoBtn.classList.add('playing');
                    }
                    hidePanelOnPlay();
                }
                updateAutoIndicator();
                autoLoopGlobal();
            } else {
                playing = false;
                if (panel) {
                    const autoBtn = panel.querySelector('#btn_auto');
                    if (autoBtn) {
                        autoBtn.textContent = '▶️ Старт';
                        autoBtn.classList.remove('playing');
                    }
                }
                updateAutoIndicator();
                if (currentWait) { currentWait.cancel('pause'); currentWait = null; }
                console.log('[Orbitar Replay] Paused playback');
            }
            updateModeBadge();
        }

        function stopAutoplayForManual(reason = 'manual_navigation') {
            const wasPlaying = playing;
            if (currentWait) {
                try { currentWait.cancel(reason); } catch (_) { }
                currentWait = null;
            }
            playing = false;
            if (panel) {
                const autoBtn = panel.querySelector('#btn_auto');
                if (autoBtn) {
                    autoBtn.textContent = '▶️ Старт';
                    autoBtn.classList.remove('playing');
                }
            }
            if (panel) {
                applyThemeVariables(panel, getSiteColors());
            }
            updateAutoIndicator();
            updateReplayIcon();
            updateModeBadge();
            if (wasPlaying) {
                console.log(`[Orbitar Replay] Autoplay stopped (${reason})`);
            }
        }

        function dispatchNext() {
            console.log('[Orbitar Replay] dispatchNext called. scriptEnabled:', scriptEnabled, 'list.length:', list.length);
            if (!scriptEnabled) {
                console.warn('[Orbitar Replay] Script is disabled, cannot navigate');
                return;
            }
            stopAutoplayForManual('manual_next');
            if (list.length === 0) {
                list = collectCommentsSorted({
                    rootsOnly: state.rootsOnly,
                    imagesOnly: state.imagesOnly,
                    videosOnly: state.videosOnly,
                    startFrom: state.startFrom
                });
                hideAll(list);
            }
            if (list.length === 0) {
                console.warn('[Orbitar Replay] List is empty after rebuild');
                return;
            }
            if (panel) hidePanelOnPlay();
            currentIndex++;
            if (currentIndex >= list.length) {
                currentIndex = state.loop ? 0 : list.length - 1;
                if (!state.loop) return;
            }
            showOneGlobal(currentIndex);
            updateModeBadge();
        }

        function dispatchPrev() {
            console.log('[Orbitar Replay] dispatchPrev called. scriptEnabled:', scriptEnabled, 'list.length:', list.length);
            if (!scriptEnabled) {
                console.warn('[Orbitar Replay] Script is disabled, cannot navigate');
                return;
            }
            stopAutoplayForManual('manual_prev');
            if (list.length === 0) return;
            if (panel) hidePanelOnPlay();
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = state.loop ? list.length - 1 : 0;
                if (!state.loop) return;
            }
            showOneGlobal(currentIndex);
            updateModeBadge();
        }
        let state = Object.assign({
            flash: true,
            delaySec: 3,
            slideshow: false,
            rootsOnly: false,
            imagesOnly: false,
            videosOnly: false,
            videosAutoplay: true,
            startFrom: null,
            loop: false
        }, StateManager.load() || {});

        // Default hotkeys - all configurable now (platform-specific: Cmd on Mac, Win on Windows)
        const DEFAULT_HOTKEYS = {
            playPause: 'Space',
            toggleScript: `${HOTKEY_META_TOKEN}+Shift+P`, // Cmd+Shift+P on Mac, Win+Shift+P on Windows
            toggleSlideshow: `${HOTKEY_META_TOKEN}+Shift+S`, // Cmd+Shift+S on Mac, Win+Shift+S on Windows
            stepNext: 'ArrowRight',
            stepPrev: 'ArrowLeft',
            delayUp: 'ArrowUp',
            delayDown: 'ArrowDown',
            closeOverlay: 'Escape'
        };

        // ---------- Hotkey Management ----------
        const HotkeyManager = {
            load() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.HOTKEYS);
                    const base = { ...DEFAULT_HOTKEYS };
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && typeof parsed === 'object') {
                            Object.entries(parsed).forEach(([key, value]) => {
                                base[key] = value;
                            });
                        }
                    }
                    const normalized = {};
                    Object.entries(base).forEach(([key, value]) => {
                        normalized[key] = normalizeHotkeyString(value);
                    });
                    return normalized;
                } catch {
                    const fallback = {};
                    Object.entries(DEFAULT_HOTKEYS).forEach(([key, value]) => {
                        fallback[key] = normalizeHotkeyString(value);
                    });
                    return fallback;
                }
            },
            save(hotkeys) {
                try {
                    const payload = {};
                    Object.entries(hotkeys || {}).forEach(([key, value]) => {
                        payload[key] = normalizeHotkeyString(value);
                    });
                    localStorage.setItem(STORAGE_KEYS.HOTKEYS, JSON.stringify(payload));
                } catch { }
            },
            matches(e, hotkeyString) {
                if (!hotkeyString) return false;
                const normalized = normalizeHotkeyString(hotkeyString);
                if (!normalized) return false;
                const parts = normalized.split('+');
                if (!parts.length) return false;

                const key = parts[parts.length - 1];
                const modifiers = parts.slice(0, -1);

                const requiresMeta = modifiers.includes(HOTKEY_META_TOKEN);
                const requiresShift = modifiers.includes('Shift');
                const requiresAlt = modifiers.includes('Alt');

                if (!!e.shiftKey !== requiresShift) return false;
                if (!!e.altKey !== requiresAlt) return false;

                const metaActive = eventHasMetaModifier(e);
                if (metaActive !== requiresMeta) return false;

                const eventKey = normalizeEventKey(e.key);
                const targetKey = normalizeKeyToken(key);

                return eventKey === targetKey;
            }
        };

        hotkeys = HotkeyManager.load();

        // ---------- UI Helpers ----------
        const UIHelpers = {
            getColors() {
                const bodyStyles = getComputedStyle(document.body);
                const rootStyles = getComputedStyle(document.documentElement);
                const bgColor = rootStyles.getPropertyValue('--bg-color') || rootStyles.getPropertyValue('--background') || bodyStyles.backgroundColor;
                const textColor = rootStyles.getPropertyValue('--text-color') || rootStyles.getPropertyValue('--color') || bodyStyles.color;
                const linkColor = rootStyles.getPropertyValue('--link-color') || rootStyles.getPropertyValue('--primary') || '#60a5fa';
                return {
                    panelBg: bgColor,
                    panelBorder: 'rgba(128, 128, 128, 0.3)',
                    panelText: textColor,
                    titleColor: linkColor,
                    inputBg: 'rgba(128, 128, 128, 0.1)',
                    inputBorder: 'rgba(128, 128, 128, 0.3)',
                    inputText: textColor,
                    buttonBg: linkColor,
                    buttonText: '#fff',
                    buttonSecondaryBg: 'rgba(128, 128, 128, 0.15)',
                    buttonSecondaryText: textColor,
                    buttonSecondaryBorder: 'rgba(128, 128, 128, 0.3)',
                    labelText: textColor,
                    dividerColor: 'rgba(128, 128, 128, 0.3)',
                    statusText: textColor,
                    hintText: textColor
                };
            },
            createButton(text, type = 'primary') {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.classList.add('orbitar-btn');
                if (type === 'primary') btn.classList.add('orbitar-btn-primary');
                else btn.classList.add('orbitar-btn-secondary');
                btn.textContent = text;
                return btn;
            },
            createInput(type = 'text', opts = {}) {
                const input = document.createElement('input');
                input.type = type;
                input.classList.add('orbitar-input');
                if (opts.className) input.classList.add(opts.className);
                if (opts.style) Object.assign(input.style, opts.style);
                if (opts.placeholder) input.placeholder = opts.placeholder;
                if (opts.value !== undefined) input.value = opts.value;
                return input;
            },
            createToggle(id, label, checked) {
                const checkId = `check_${id}`;
                return `
                    <label class="orbitar-toggle-wrapper">
                        <input class="orbitar-toggle-input" type="checkbox" id="${checkId}" data-id="${id}" ${checked ? 'checked' : ''}>
                        <span class="orbitar-toggle-switch ${checked ? 'active' : ''}" data-for="${checkId}">
                            <span></span>
                        </span>
                        <span class="orbitar-toggle-label">${label}</span>
                    </label>
                `;
            }
        };

        const getSiteColors = () => UIHelpers.getColors();

        function showReplayPanel() {
            console.log('[Orbitar Replay] showReplayPanel called');
            removePanel();
            const colors = getSiteColors();

            panel = document.createElement('div');
            panel.id = 'orbitarReplayPanel';
            panel.classList.add('orbitar-replay-panel');
            applyThemeVariables(panel, colors);

            // Header with title, help button, and toggle script icon
            const header = document.createElement('div');
            header.classList.add('orbitar-panel-header');

            const title = document.createElement('div');
            title.textContent = 'rePlay Comments';
            title.classList.add('orbitar-panel-title');

            const headerButtons = document.createElement('div');
            headerButtons.classList.add('orbitar-panel-header-buttons');

            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️';
            settingsBtn.title = 'Расширенные настройки';
            settingsBtn.type = 'button';
            settingsBtn.classList.add('orbitar-icon-btn');

            const toggleScriptIcon = document.createElement('button');
            toggleScriptIcon.id = 'toggle_script_icon';
            toggleScriptIcon.title = scriptEnabled ? 'Скрипт включён' : 'Скрипт выключен';
            toggleScriptIcon.innerHTML = scriptEnabled ? '✓' : '✖';
            toggleScriptIcon.type = 'button';
            toggleScriptIcon.classList.add('orbitar-icon-btn', 'orbitar-toggle-icon');
            if (!scriptEnabled) toggleScriptIcon.classList.add('off');

            headerButtons.append(settingsBtn, toggleScriptIcon);
            header.append(title, headerButtons);

            const body = document.createElement('div');
            body.id = 'replay_body';
            body.classList.add('orbitar-panel-body');

            // Use UIHelpers.createToggle
            const createCheckbox = (id, label, checked) => UIHelpers.createToggle(id, label, checked);

            function renderPanelMarkup() {
                return `
            <div class="orbitar-section">
                <div class="orbitar-control-row">
                    <label class="orbitar-label">Задержка:</label>
                    <input id="replay_delay" class="orbitar-input orbitar-input--xs" type="number" min="1" max="60" step="1" value="${state.delaySec}">
                    <span class="orbitar-hint">сек</span>
                    <label class="orbitar-label orbitar-label--spaced">Начать с:</label>
                    <input id="replay_from" class="orbitar-input orbitar-input--wide" type="datetime-local">
                </div>
                <div class="orbitar-toggle-grid">
                    ${createCheckbox('slideshow', 'Слайд-шоу', state.slideshow)}
                    ${createCheckbox('roots', 'Только корневые', state.rootsOnly)}
                    ${createCheckbox('flash', 'Подсветка', state.flash)}
                    ${createCheckbox('images', 'Только изображения', state.imagesOnly)}
                    ${createCheckbox('loop', 'Зациклить', state.loop)}
                    ${createCheckbox('videos', 'Только видео', state.videosOnly)}
                    <div class="orbitar-save-buttons">
                        <span class="orbitar-hint">Сохр:</span>
                        <button id="btn_save_post" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">Для поста</button>
                        <button id="btn_save_default" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">Для всех</button>
                    </div>
                    ${createCheckbox('videos_autoplay', 'Автоплей видео', state.videosAutoplay)}
                </div>
            </div>

            <div class="orbitar-section">
                <div class="orbitar-section-title">Управление</div>
                <div class="orbitar-button-row">
                    <button id="btn_auto" class="orbitar-btn orbitar-btn-primary orbitar-btn-lg" type="button">▶️ Старт</button>
                    <button id="btn_step" class="orbitar-btn orbitar-btn-secondary orbitar-btn-lg" type="button">→</button>
                    <button id="btn_prev" class="orbitar-btn orbitar-btn-secondary orbitar-btn-lg" type="button">←</button>
                </div>
                <div class="orbitar-button-row orbitar-button-row--secondary">
                    <button id="btn_rebuild" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">Пересобрать</button>
                    <button id="btn_restart" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">С начала</button>
                </div>
            </div>

            <div class="orbitar-section orbitar-section--presets">
                <div class="orbitar-section-title">Пресеты</div>
                <div id="preset_buttons" class="orbitar-preset-buttons"></div>
                <div class="orbitar-preset-create">
                    <input id="preset_name" class="orbitar-input orbitar-input--preset" placeholder="Новый пресет...">
                    <button id="preset_save" class="orbitar-btn orbitar-btn-primary" type="button">Сохранить</button>
                </div>
            </div>

            <div id="replay_status" class="orbitar-status">Готово.</div>
        `;
            }

            // Controls + Presets
            body.innerHTML = renderPanelMarkup();

            panel.append(header, body);
            document.body.appendChild(panel);

            console.log('[Orbitar Replay] Panel appended to body. Panel element:', panel);

            settingsBtn.addEventListener('click', () => {
                if (settingsModal) {
                    closeSettingsModal();
                } else {
                    openSettingsModal(colors);
                }
                settingsBtn.blur();
            });

            // Toggle script icon handler
            toggleScriptIcon.addEventListener('click', () => {
                toggleScript(!scriptEnabled);

                if (!scriptEnabled) {
                    closeSettingsModal();
                }

                updateAutoBtn();
                toggleScriptIcon.blur();
            });

            // Bind controls
            const delayInput = panel.querySelector('#replay_delay');
            const fromInput = panel.querySelector('#replay_from');

            const getCheckbox = (id) => panel.querySelector(`#check_${id}`);

            const flashCheck = getCheckbox('flash');
            const rootsCheck = getCheckbox('roots');
            const imagesCheck = getCheckbox('images');
            const videosCheck = getCheckbox('videos');
            const videosAutoplayCheck = getCheckbox('videos_autoplay');
            const loopCheck = getCheckbox('loop');
            const slideshowCheck = getCheckbox('slideshow');

            // Toggle change handler with UI update
            function setupCheckbox(checkbox, stateKey, onChange) {
                if (!checkbox) return;

                const toggleSwitch = panel.querySelector(`.orbitar-toggle-switch[data-for="${checkbox.id}"]`);

                checkbox.addEventListener('change', () => {
                    state[stateKey] = checkbox.checked;

                    if (toggleSwitch) {
                        toggleSwitch.classList.toggle('active', checkbox.checked);
                    }

                    checkPresetMatch();

                    if (onChange) onChange(checkbox.checked);
                });

                if (toggleSwitch) {
                    toggleSwitch.addEventListener('click', (e) => {
                        e.preventDefault();
                        checkbox.click();
                    });
                }
            }
            const autoBtn = panel.querySelector('#btn_auto');
            const stepBtn = panel.querySelector('#btn_step');
            const prevBtn = panel.querySelector('#btn_prev');
            const rebuildBtn = panel.querySelector('#btn_rebuild');
            const restartBtn = panel.querySelector('#btn_restart');
            const savePostBtn = panel.querySelector('#btn_save_post');
            const saveDefaultBtn = panel.querySelector('#btn_save_default');
            const statusDiv = panel.querySelector('#replay_status');

            console.log('[Orbitar Replay] Panel buttons found:', {
                autoBtn: !!autoBtn,
                stepBtn: !!stepBtn,
                prevBtn: !!prevBtn,
                statusDiv: !!statusDiv
            });

            const presetNameInput = panel.querySelector('#preset_name');
            const presetButtonsContainer = panel.querySelector('#preset_buttons');
            const presetSaveBtn = panel.querySelector('#preset_save');

            // init "Начать с" UI from state
            if (state.startFrom) {
                const tzOff = (new Date()).getTimezoneOffset();
                const localISO = new Date(state.startFrom.getTime() - tzOff * 60000).toISOString().slice(0, 16);
                fromInput.value = localISO;
            }

            function updateAutoBtn() {
                if (!autoBtn) return;

                if (playing) {
                    autoBtn.textContent = '⏸ Пауза';
                    autoBtn.classList.add('playing');
                } else {
                    autoBtn.textContent = '▶️ Старт';
                    autoBtn.classList.remove('playing');
                }
                updateModeBadge();
            }

            function rebuildList(resetIndex = true) {
                console.log('[Orbitar Replay] rebuildList called. State:', {
                    rootsOnly: state.rootsOnly,
                    imagesOnly: state.imagesOnly,
                    videosOnly: state.videosOnly,
                    startFrom: state.startFrom
                });
                list = collectCommentsSorted({
                    rootsOnly: state.rootsOnly,
                    imagesOnly: state.imagesOnly,
                    videosOnly: state.videosOnly,
                    startFrom: state.startFrom
                });
                console.log('[Orbitar Replay] Collected', list.length, 'comments');
                hideAll(list);
                if (resetIndex) currentIndex = -1; // Reset to "nothing shown"
                statusDiv.textContent = `Найдено ${list.length} комментариев.`;
                updateModeBadge();
            }

            function getAllMediaFromComment(div) {
                const cnt = div.querySelector('.ContentComponent_content__Mg-dN .ContentComponent_content__lc9BO') ||
                    div.querySelector('.ContentComponent_content__lc9BO');
                const mediaItems = [];

                // Collect all images
                if (!state.videosOnly) {
                    const images = cnt ? Array.from(cnt.querySelectorAll('img.image-large, img.image-scalable, img')) : [];
                    for (const img of images) {
                        // Filter out video preview images and youtube thumbnails
                        const parent = img.closest('a.video-embed, a.youtube-embed, .youtube-embed-processed');
                        if (!parent) {
                            mediaItems.push({ type: 'image', element: img });
                        }
                    }
                }

                // Collect all MP4 videos
                if (!state.imagesOnly) {
                    const videoEmbeds = cnt ? Array.from(cnt.querySelectorAll('a.video-embed img[data-video]')) : [];
                    for (const videoEmbed of videoEmbeds) {
                        mediaItems.push({ type: 'mp4', element: videoEmbed });
                    }

                    // Also collect already rendered video elements
                    const videos = cnt ? Array.from(cnt.querySelectorAll('video')) : [];
                    for (const video of videos) {
                        mediaItems.push({ type: 'mp4-rendered', element: video });
                    }
                }

                // Collect all YouTube videos
                if (!state.imagesOnly) {
                    const youtubeEmbeds = cnt ? Array.from(cnt.querySelectorAll('img[data-youtube], a.youtube-embed, .youtube-embed-processed')) : [];
                    for (const ytEmbed of youtubeEmbeds) {
                        mediaItems.push({ type: 'youtube', element: ytEmbed });
                    }
                }

                return mediaItems;
            }

            async function showOne(i) {
                if (i < 0 || i >= list.length) return false;
                const rec = list[i];

                if (!state.slideshow) {
                    // Page mode: just scroll to comment
                    const scrollBlock = state.rootsOnly ? 'start' : 'center';
                    await revealCommentFlow(rec.elem, state.flash, scrollBlock);
                    statusDiv.textContent = `Показан ${i + 1}/${list.length}`;
                        updateModeBadge();

                    // Add delay
                    const delayPromise = new Promise(r => setTimeout(r, state.delaySec * 1000));
                    currentWait = cancellableWaiter();
                    try { await Promise.race([delayPromise, currentWait.promise]); } catch (_) { }
                    currentWait = null;

                    return true;
                }

                // Slideshow mode: show all media from comment
                const mediaItems = getAllMediaFromComment(rec.elem);

                if (mediaItems.length === 0) {
                    // No media, show text content
                    const slide = await openSlideForText(rec.elem);
                    if (!slide) return false;
                    const { node, waiterPromise } = slide;
                    openOverlay(node);
                    setOverlayHeader(`${i + 1} / ${list.length}`);
                    updateAutoIndicator();
                    statusDiv.textContent = `Слайд ${i + 1}/${list.length}`;
                    if (waiterPromise) {
                        currentWait = cancellableWaiter();
                        try { await Promise.race([waiterPromise, currentWait.promise]); } catch (_) { }
                        currentWait = null;
                    }
                    return true;
                }

                // Show each media item from the comment
                for (let mediaIdx = 0; mediaIdx < mediaItems.length; mediaIdx++) {
                    const mediaItem = mediaItems[mediaIdx];
                    const slide = await openSlideForMediaItem(mediaItem, rec.elem);
                    if (!slide) continue;

                    const { node, waiterPromise } = slide;
                    openOverlay(node);
                    const mediaInfo = mediaItems.length > 1 ? ` [${mediaIdx + 1}/${mediaItems.length}]` : '';
                    setOverlayHeader(`${i + 1} / ${list.length}${mediaInfo}`);
                    updateAutoIndicator();
                    statusDiv.textContent = `Слайд ${i + 1}/${list.length}${mediaInfo}`;
                        updateModeBadge();

                    if (waiterPromise) {
                        currentWait = cancellableWaiter();
                        try { await Promise.race([waiterPromise, currentWait.promise]); } catch (_) { }
                        currentWait = null;
                    }

                    if (!playing && mediaIdx < mediaItems.length - 1) break;
                }

                return true;
            }

            async function openSlideForMediaItem(mediaItem, div) {
                if (mediaItem.type === 'image') {
                    const node = buildImageNode(mediaItem.element);
                    const waiterPromise = new Promise((resolve) => setTimeout(resolve, state.delaySec * 1000));
                    return { node, waiterPromise };
                }

                if (mediaItem.type === 'mp4' || mediaItem.type === 'mp4-rendered') {
                    const { wrap, video, ok } = buildVideoNodeFromMp4(div, state.videosAutoplay, true);
                    if (!ok) return null;
                    setTimeout(() => { try { if (state.videosAutoplay) video.play().catch(() => { }); } catch (_) { } }, 50);
                    const waiterPromise = new Promise((resolve) => video.addEventListener('ended', resolve, { once: true }));
                    return { node: wrap, waiterPromise };
                }

                if (mediaItem.type === 'youtube') {
                    const yt = buildYouTubeNode(div, state.videosAutoplay);
                    if (!yt.ok) return null;
                    setTimeout(() => { yt.init().catch(() => { }); }, 0);
                    const waiterPromise = new Promise((resolve) => {
                        const interval = setInterval(() => {
                            try {
                                if (currentYTPlayer && typeof currentYTPlayer.getPlayerState === 'function') {
                                    if (currentYTPlayer.getPlayerState() === 0) { clearInterval(interval); resolve(); }
                                }
                            } catch (_) { }
                        }, 500);
                    });
                    return { node: yt.wrap, waiterPromise };
                }

                return null;
            }

            async function openSlideForText(div) {
                const cnt = div.querySelector('.ContentComponent_content__Mg-dN .ContentComponent_content__lc9BO') ||
                    div.querySelector('.ContentComponent_content__lc9BO');
                const wrap = document.createElement('div');
                Object.assign(wrap.style, {
                    color: '#fff', maxWidth: '80vw', maxHeight: '70vh', overflow: 'auto',
                    fontSize: '18px', lineHeight: '1.4', padding: '16px', borderRadius: '10px',
                    background: 'rgba(0,0,0,.35)'
                });
                wrap.innerHTML = cnt?.innerHTML || '(нет содержимого)';
                const waiterPromise = new Promise((r) => setTimeout(r, state.delaySec * 1000));
                return { node: wrap, waiterPromise };
            }

            // autoLoop is now global (autoLoopGlobal) - this local version is unused

            if (autoBtn) {
                autoBtn.addEventListener('click', () => {
                    console.log('[Orbitar Replay] Auto button clicked');
                    dispatchPlayPause();
                    autoBtn.blur();
                });
            } else {
                console.error('[Orbitar Replay] autoBtn not found!');
            }

            if (stepBtn) {
                stepBtn.addEventListener('click', () => {
                    console.log('[Orbitar Replay] Step button clicked');
                    dispatchNext();
                    stepBtn.blur();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    console.log('[Orbitar Replay] Prev button clicked');
                    dispatchPrev();
                    prevBtn.blur();
                });
            }

            if (rebuildBtn) {
                rebuildBtn.addEventListener('click', () => {
                    console.log('[Orbitar Replay] Rebuild button clicked');
                    rebuildList(false);
                    rebuildBtn.blur();
                });
            }
            restartBtn.addEventListener('click', () => {
                if (currentWait) { currentWait.cancel('restart'); currentWait = null; }
                playing = false; updateAutoBtn(); updateAutoIndicator();
                rebuildList(true);
                closeOverlay();
                restartBtn.blur();
            });

            savePostBtn.addEventListener('click', () => {
                const postId = getCurrentPostId();
                if (!postId) {
                    statusDiv.textContent = '⚠️ Не на странице поста';
                    console.error('[Orbitar Replay] Cannot save for post: current path is', location.pathname);
                    savePostBtn.blur();
                    return;
                }
                const success = saveStateForPost();
                if (success) {
                    statusDiv.textContent = `✓ Сохранено для поста ${postId}`;
                } else {
                    statusDiv.textContent = 'Ошибка сохранения';
                }
                savePostBtn.blur();
            });

            saveDefaultBtn.addEventListener('click', () => {
                saveState();
                statusDiv.textContent = 'Сохранено как по умолчанию ✓';
                saveDefaultBtn.blur();
            });


            // ---- Presets UI wiring ----
            function refreshPresetButtons() {
                const allPresets = loadAllPresets();
                presetButtonsContainer.innerHTML = '';

                allPresets.forEach(preset => {
                    const btn = document.createElement('button');
                    const isActive = currentPresetName === preset.name;

                    btn.textContent = preset.name;
                    btn.title = `Пресет: ${preset.name}`;
                    btn.type = 'button';
                    btn.classList.add('orbitar-panel-preset-btn');
                    if (isActive) btn.classList.add('active');

                    btn.addEventListener('click', () => {
                        applyPreset(preset);
                        btn.blur();
                    });

                    presetButtonsContainer.appendChild(btn);
                });
            }
            function applyStateToUI() {
                delayInput.value = state.delaySec;

                const updateToggle = (checkbox, checked) => {
                    if (!checkbox) return;
                    checkbox.checked = checked;
                    const toggleSwitch = panel.querySelector(`.orbitar-toggle-switch[data-for="${checkbox.id}"]`);
                    if (toggleSwitch) {
                        toggleSwitch.classList.toggle('active', checked);
                    }
                };

                updateToggle(flashCheck, !!state.flash);
                updateToggle(rootsCheck, !!state.rootsOnly);
                updateToggle(imagesCheck, !!state.imagesOnly);
                updateToggle(videosCheck, !!state.videosOnly);
                updateToggle(videosAutoplayCheck, !!state.videosAutoplay);
                updateToggle(loopCheck, !!state.loop);
                updateToggle(slideshowCheck, !!state.slideshow);

                if (state.startFrom) {
                    const tzOff = (new Date()).getTimezoneOffset();
                    const localISO = new Date(state.startFrom.getTime() - tzOff * 60000).toISOString().slice(0, 16);
                    fromInput.value = localISO;
                } else {
                    fromInput.value = '';
                }
            }

            refreshPresetButtons();
            applyStateToUI();

            panel._applyStateToUI = applyStateToUI;
            panel._rebuildList = rebuildList;
            panel._refreshPresetButtons = refreshPresetButtons;
            panel._showOne = showOne;

            // Preset save button
            presetSaveBtn.addEventListener('click', () => {
                const name = presetNameInput.value.trim();
                if (!name) {
                    statusDiv.textContent = 'Введите название пресета.';
                    return;
                }
                const res = upsertPresetByName(name, state);
                if (res.ok) {
                    currentPresetName = name;
                    refreshPresetButtons();
                    statusDiv.textContent = `Сохранено: ${name}`;
                    presetNameInput.value = '';
                } else if (res.reason === 'default') {
                    statusDiv.textContent = 'Нельзя перезаписать стандартный пресет.';
                }
                presetSaveBtn.blur();
            });

            // initial
            // НЕ сбрасываем индекс при открытии панели - сохраняем текущую позицию
            rebuildList(false);
            updateAutoBtn();
            updateModeBadge();

            // ---- State bindings (no auto-save) ----
            delayInput.addEventListener('change', () => {
                let v = Math.round(Math.max(1, Number(delayInput.value) || 1));
                delayInput.value = v;
                state.delaySec = v;
                    checkPresetMatch();
                updateAutoBtn();
                updateModeBadge();
            });
            fromInput.addEventListener('change', () => {
                const val = fromInput.value;
                state.startFrom = val ? new Date(val) : null;
                // startFrom не сбрасывает пресет (пользователь может хотеть разное время старта)
            });
            setupCheckbox(flashCheck, 'flash', () => {
                updateAutoBtn();
            });

            setupCheckbox(rootsCheck, 'rootsOnly', () => {
                rebuildList(false); // Don't reset index when changing filters
                statusDiv.textContent = `${list.length} комментариев.`;
            });

            setupCheckbox(imagesCheck, 'imagesOnly', (checked) => {
                if (checked && videosCheck) {
                    videosCheck.checked = false;
                    state.videosOnly = false;
                }
                rebuildList(false); // Don't reset index when changing filters
                statusDiv.textContent = `${list.length} комментариев.`;
            });

            setupCheckbox(videosCheck, 'videosOnly', (checked) => {
                if (checked && imagesCheck) {
                    imagesCheck.checked = false;
                    state.imagesOnly = false;
                }
                rebuildList(false); // Don't reset index when changing filters
                statusDiv.textContent = `${list.length} комментариев.`;
            });

            setupCheckbox(videosAutoplayCheck, 'videosAutoplay', () => {
                // No action needed
            });

            setupCheckbox(loopCheck, 'loop', () => {
                // No action needed
            });

            setupCheckbox(slideshowCheck, 'slideshow', () => {
                const wasPlaying = playing;
                const oldSlideshow = !state.slideshow;

                if (wasPlaying) {
                    if (currentWait) {
                        currentWait.cancel('slideshow_toggle');
                        currentWait = null;
                    }
                    if (oldSlideshow && !state.slideshow) {
                        closeOverlay();
                    }
                    statusDiv.textContent = state.slideshow ? 'Слайд-шоу' : 'Режим страницы';
                    if (currentIndex >= 0 && currentIndex < list.length) {
                        showOne(currentIndex);
                    }
                } else {
                    statusDiv.textContent = state.slideshow ? 'Слайд-шоу' : 'Режим страницы';
                }
                updateAutoBtn();
                updateModeBadge();
            });

        }


        function setupGlobalToggleHandler() {
            if (globalToggleHandler) {
                window.removeEventListener('keydown', globalToggleHandler);
            }

            globalToggleHandler = (e) => {
                // Only work on post pages
                if (!isPostPage()) return;

                // Don't interfere if capturing hotkey
                if (hotkeyCapturing && hotkeyCapturing.active) return;

                // Don't interfere with inputs
                const tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea') return;

                if (matchesHotkey(e, hotkeys.toggleScript)) {
                    e.preventDefault();

                    toggleScript(!scriptEnabled);

                    if (panel) {
                        const autoBtn = panel.querySelector('#btn_auto');
                        if (autoBtn && !playing) {
                            autoBtn.textContent = '▶️ Старт';
                            autoBtn.classList.remove('playing');
                        }
                        updateAutoIndicator();
                    }

                    return;
                }

                if (scriptEnabled) {
                    const allPresets = loadAllPresets();
                    for (const preset of allPresets) {
                        if (preset.hotkey && matchesHotkey(e, preset.hotkey)) {
                            e.preventDefault();
                            applyPreset(preset);
                            console.log(`[Orbitar Replay] Preset hotkey activated: ${preset.name}`);
                            return;
                        }
                    }
                }
            };

            window.addEventListener('keydown', globalToggleHandler);
        }

        function removePanel() {
            if (!panel) return;
            panel.remove();
            panel = null;
            closeOverlay();
            closeSettingsModal();

            // Clear auto-collapse timeout
            if (autoCollapseTimeout) {
                clearTimeout(autoCollapseTimeout);
                autoCollapseTimeout = null;
            }

            // Note: hotkeyHandler is NOT removed here - it should persist even when panel is closed
            // This allows hotkeys to work during autoplay when panel is hidden
        }

        function cleanupAll() {
            // Full cleanup when leaving post page
            removePanel();

            // Remove panel-specific hotkey handler
            if (hotkeyHandler) {
                window.removeEventListener('keydown', hotkeyHandler);
                hotkeyHandler = null;
            }

            // Remove global toggle handler
            if (globalToggleHandler) {
                window.removeEventListener('keydown', globalToggleHandler);
                globalToggleHandler = null;
            }

            // Stop playing
            playing = false;
            if (currentWait) {
                currentWait.cancel('cleanup');
                currentWait = null;
            }
        }

        // ---------- SPA navigation detection ----------
        let lastUrl = location.href;
        const checkUrlChange = () => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                const newPostId = getCurrentPostId();

                // Auto-disable script when navigating to different post or leaving post page
                if (scriptEnabled && (newPostId !== currentPostIdTracked || !newPostId)) {
                    console.log('[Orbitar Replay] Post changed, auto-disabling script');
                    toggleScript(false);
                }

                currentPostIdTracked = newPostId;

                if (isPostPage()) {
                    observeForReplayIcon();
                    setupGlobalToggleHandler();
                    setupMainHotkeys();
                } else {
                    // Disconnect observer when leaving post page
                    if (replayIconObserver) {
                        replayIconObserver.disconnect();
                        replayIconObserver = null;
                    }
                    cleanupAll();
                }
            }
        };

        // Multiple methods to detect URL changes in SPA
        window.addEventListener('popstate', checkUrlChange);
        window.addEventListener('hashchange', checkUrlChange);
        window.addEventListener('beforeunload', cleanupAll);

        // Poll for URL changes (fallback for pushState navigation)
        setInterval(checkUrlChange, 500);

        function setupMainHotkeys() {
            if (hotkeyHandler) {
                window.removeEventListener('keydown', hotkeyHandler);
            }

            hotkeyHandler = (e) => {
                if (matchesHotkey(e, hotkeys?.toggleScript)) {
                    // Let global handler manage toggle hotkey to avoid double toggles
                    return;
                }

                if (!scriptEnabled) return;

                // Don't interfere if capturing hotkey
                if (hotkeyCapturing && hotkeyCapturing.active) return;

                const tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea') return;

                const overlayActive = overlay && overlay.style.display === 'flex';

                // Play/Pause
                if (matchesHotkey(e, hotkeys.playPause)) {
                    e.preventDefault();
                    console.log('[Orbitar Replay] PlayPause hotkey pressed');
                    if (!playing) {
                        playing = true;
                        if (list.length === 0) {
                            list = collectCommentsSorted({
                                rootsOnly: state.rootsOnly,
                                imagesOnly: state.imagesOnly,
                                videosOnly: state.videosOnly,
                                startFrom: state.startFrom
                            });
                            hideAll(list);
                            currentIndex = -1;
                        }
                        autoLoopGlobal();
                    } else {
                        playing = false;
                        if (currentWait) { currentWait.cancel('pause'); currentWait = null; }
                    }
                    updateReplayIcon();
                    updateModeBadge();
                }
                // Step forward
                else if (matchesHotkey(e, hotkeys.stepNext)) {
                    e.preventDefault();
                    console.log('[Orbitar Replay] StepNext hotkey pressed');
                    stopAutoplayForManual('hotkey_next');
                    if (list.length === 0) {
                        list = collectCommentsSorted({
                            rootsOnly: state.rootsOnly,
                            imagesOnly: state.imagesOnly,
                            videosOnly: state.videosOnly,
                            startFrom: state.startFrom
                        });
                        hideAll(list);
                    }
                    if (list.length === 0) return;
                    currentIndex++;
                    if (currentIndex >= list.length) {
                        currentIndex = state.loop ? 0 : list.length - 1;
                        if (!state.loop) return;
                    }
                    showOneGlobal(currentIndex);
                }
                // Step backward
                else if (matchesHotkey(e, hotkeys.stepPrev)) {
                    e.preventDefault();
                    console.log('[Orbitar Replay] StepPrev hotkey pressed');
                    stopAutoplayForManual('hotkey_prev');
                    if (list.length === 0) return;
                    currentIndex--;
                    if (currentIndex < 0) {
                        currentIndex = state.loop ? list.length - 1 : 0;
                        if (!state.loop) return;
                    }
                    showOneGlobal(currentIndex);
                }
                // Delay up
                else if (matchesHotkey(e, hotkeys.delayUp)) {
                    if ((playing && !state.slideshow && scriptEnabled) || overlayActive) {
                        e.preventDefault();
                        adjustDelay(1);
                    }
                }
                // Delay down
                else if (matchesHotkey(e, hotkeys.delayDown)) {
                    if ((playing && !state.slideshow && scriptEnabled) || overlayActive) {
                        e.preventDefault();
                        adjustDelay(-1);
                    }
                }
                // Close overlay/panel
                else if (matchesHotkey(e, hotkeys.closeOverlay)) {
                    e.preventDefault();
                    if (settingsModal) {
                        return;
                    } else if (panel && !overlayActive) {
                        removePanel();
                    } else if (overlayActive) {
                        if (currentWait) { currentWait.cancel('esc'); currentWait = null; }
                        playing = false;
                        updateReplayIcon();
                        updateModeBadge();
                        closeOverlay();
                    } else {
                        closeOverlay();
                    }
                }
                // Toggle slideshow
                else if (matchesHotkey(e, hotkeys.toggleSlideshow)) {
                    e.preventDefault();
                    state.slideshow = !state.slideshow;
                    console.log(`[Orbitar Replay] Slideshow mode: ${state.slideshow ? 'ON' : 'OFF'}`);
                }
            };

            window.addEventListener('keydown', hotkeyHandler);
            console.log('[Orbitar Replay] Main hotkeys initialized');
        }

        // Global showOne function (works without panel)
        async function showOneGlobal(i) {
            if (i < 0 || i >= list.length) return false;
            const rec = list[i];

            // If panel exists and has showOne, use it (full slideshow support)
            if (panel && panel._showOne) {
                return await panel._showOne(i);
            }

            // Fallback: simple page mode only
            if (!state.slideshow) {
                const scrollBlock = state.rootsOnly ? 'start' : 'center';
                await revealCommentFlow(rec.elem, state.flash, scrollBlock);
                updateModeBadge();
                const delayPromise = new Promise(r => setTimeout(r, state.delaySec * 1000));
                currentWait = cancellableWaiter();
                try { await Promise.race([delayPromise, currentWait.promise]); } catch (_) { }
                currentWait = null;
                return true;
            }

            // Slideshow mode without panel - basic media support
            const cnt = rec.elem.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;

            // Try to build proper video nodes
            const hasYT = !!cnt.querySelector('img[data-youtube], .youtube-embed');
            const hasMp4 = !!cnt.querySelector('a.video-embed img[data-video], video');
            const hasImg = !!cnt.querySelector('img.image-large, img.image-scalable, img');

            if (hasYT) {
                const yt = buildYouTubeNode(rec.elem, state.videosAutoplay);
                if (yt.ok) {
                    openOverlay(yt.wrap);
                    setOverlayHeader(`${i + 1} / ${list.length}`);
                    updateAutoIndicator();
                    setTimeout(() => { yt.init().catch(() => { }); }, 0);
                    // Wait for video to end or delay
                    const waiterPromise = new Promise((resolve) => {
                        const interval = setInterval(() => {
                            try {
                                if (currentYTPlayer && typeof currentYTPlayer.getPlayerState === 'function') {
                                    if (currentYTPlayer.getPlayerState() === 0) { clearInterval(interval); resolve(); }
                                }
                            } catch (_) { }
                        }, 500);
                    });
                    currentWait = cancellableWaiter();
                    try { await Promise.race([waiterPromise, currentWait.promise]); } catch (_) { }
                    currentWait = null;
                    return true;
                }
            }

            if (hasMp4) {
                const { wrap, video, ok } = buildVideoNodeFromMp4(rec.elem, state.videosAutoplay, true);
                if (ok) {
                    openOverlay(wrap);
                    setOverlayHeader(`${i + 1} / ${list.length}`);
                    updateAutoIndicator();
                    setTimeout(() => { try { if (state.videosAutoplay) video.play().catch(() => { }); } catch (_) { } }, 50);
                    const waiterPromise = new Promise((resolve) => video.addEventListener('ended', resolve, { once: true }));
                    currentWait = cancellableWaiter();
                    try { await Promise.race([waiterPromise, currentWait.promise]); } catch (_) { }
                    currentWait = null;
                    return true;
                }
            }

            if (hasImg) {
                const img = cnt.querySelector('img.image-large, img.image-scalable, img');
                const node = buildImageNode(img);
                openOverlay(node);
                setOverlayHeader(`${i + 1} / ${list.length}`);
                updateAutoIndicator();
                const delayPromise = new Promise(r => setTimeout(r, state.delaySec * 1000));
                currentWait = cancellableWaiter();
                try { await Promise.race([delayPromise, currentWait.promise]); } catch (_) { }
                currentWait = null;
                return true;
            }

            // Text fallback
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                color: '#fff', maxWidth: '80vw', maxHeight: '70vh', overflow: 'auto',
                fontSize: '18px', lineHeight: '1.4', padding: '16px', borderRadius: '10px',
                background: 'rgba(0,0,0,.35)'
            });
            wrap.innerHTML = cnt?.innerHTML || '(нет содержимого)';
            openOverlay(wrap);
            setOverlayHeader(`${i + 1} / ${list.length}`);
            updateAutoIndicator();
            const delayPromise = new Promise(r => setTimeout(r, state.delaySec * 1000));
            currentWait = cancellableWaiter();
            try { await Promise.race([delayPromise, currentWait.promise]); } catch (_) { }
            currentWait = null;
            return true;
        }

        async function autoLoopGlobal() {
            while (playing) {
                currentIndex++;
                if (currentIndex >= list.length) {
                    if (state.loop && list.length > 0) {
                        currentIndex = 0;
                    } else {
                        break;
                    }
                }
                const shown = await showOneGlobal(currentIndex);
                if (!playing) break;
            }
            playing = false;
            updateReplayIcon();
            updateModeBadge();
            if (panel) {
                const autoBtn = panel.querySelector('#btn_auto');
                if (autoBtn) {
                    autoBtn.textContent = '▶️ Старт';
                    autoBtn.classList.remove('playing');
                }
            }
        }

        if (isPostPage()) {
            currentPostIdTracked = getCurrentPostId();
            observeForReplayIcon();
            setupGlobalToggleHandler();
            setupMainHotkeys();
        }
    })();
