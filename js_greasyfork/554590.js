// ==UserScript==
// @name         Orbitar.space-Comment-Replay
// @namespace    https://orbitar.space/
// @version      0.9.12
// @description  Реплей комментариев с фильтрами, хоткеями и слайд-шоу (картинки/видео) + петля, автоскрытие панели, пресеты (3 стандартных + неограниченные пользовательские), автоматическая адаптация к теме сайта
// @match        https://*.orbitar.space/*
// @match        https://*.orbitar.local/*
// @author       @Aivean2
// @homepage     https://orbitar.space/u/Aivean2/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554590/Orbitarspace-Comment-Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/554590/Orbitarspace-Comment-Replay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* --------------------------------------------------------------------- */
    /* Config & Runtime                                                      */
    /* --------------------------------------------------------------------- */

    const Config = {
        storageKeys: {
            STATE: 'orbitar_replay_state',
            POST_PREFIX: 'orbitar_replay_post_',
            PRESETS: 'orbitar_replay_presets',
            DEFAULT_PRESET_MODS: 'orbitar_replay_default_preset_mods',
            VOLUME: 'orbitar_replay_volume',
            MUTED: 'orbitar_replay_muted',
            HOTKEYS: 'orbitar_replay_hotkeys'
        },
        theme: {
            styleElementId: 'orbitar-replay-styles',
            variables: {
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
            }
        },
        dom: {
            overlayId: 'orbitarReplayOverlay',
            panelId: 'orbitarReplayPanel',
            toggleIconId: 'toggle_script_icon'
        },
        hotkeys: {
            metaToken: navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Win',
            metaAliases: new Set(['meta', 'cmd', 'command', 'win', 'windows', 'super']),
            modifierOrder: []
        }
    };
    Config.hotkeys.modifierOrder = [Config.hotkeys.metaToken, 'Ctrl', 'Shift', 'Alt'];

    const Runtime = {
        state: {
            cachedPostData: null,
            playing: false,
            scriptEnabled: false,
            list: [],
            currentIndex: -1,
            currentPresetName: null,
            settingsSource: null, // 'preset' | 'post' | 'global' | 'default'
            autoCollapseTimeout: null,
            originalUrlOnEnable: null,
            currentPostIdTracked: null,
            currentWait: null,
            hotkeyCapturing: null
        },
        overlay: {
            container: null,
            inner: null,
            header: null,
            autoIndicator: null,
            delayControl: null,
            btnPrev: null,
            btnNext: null,
            btnVoteUp: null,
            btnVoteDown: null
        },
        panel: null,
        icon: {
            container: null,
            button: null,
            badge: null,
            observer: null
        },
        settings: {
            modal: null,
            keyHandler: null
        },
        watchers: {
            globalToggleHandler: null,
            mainHotkeyHandler: null,
            urlInterval: null
        },
        hotkeys: {},
        lastMediaVolume: Number(localStorage.getItem(Config.storageKeys.VOLUME)) || 60,
        lastMediaMuted: localStorage.getItem(Config.storageKeys.MUTED) === 'true'
    };

    /* --------------------------------------------------------------------- */
    /* Theme & Styles                                                        */
    /* --------------------------------------------------------------------- */

    const Theme = {
        ensureStyles() {
            if (document.getElementById(Config.theme.styleElementId)) return;
            const styleEl = document.createElement('style');
            styleEl.id = Config.theme.styleElementId;
            styleEl.textContent = Theme.baseCss;
            document.head.appendChild(styleEl);
        },
        apply(target, colors) {
            if (!target || !colors) return;
            Object.entries(Config.theme.variables).forEach(([key, cssVar]) => {
                const value = colors[key];
                if (value !== undefined && value !== null) {
                    target.style.setProperty(cssVar, value);
                }
            });
        },
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
        baseCss: `
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
                transform: translateX(-50%) scale(0.85);
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

            .orbitar-overlay-counter {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                font-weight: 500;
                padding: 0 8px;
                pointer-events: auto;
            }

            .orbitar-overlay-vote-control {
                display: flex;
                align-items: center;
                gap: 4px;
                background: rgba(255, 255, 255, 0.15);
                padding: 2px 6px;
                border-radius: 12px;
                pointer-events: auto;
                margin-left: auto;
            }

            .orbitar-overlay-vote-btn {
                background: transparent;
                border: 2px solid transparent;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.15s ease;
            }

            .orbitar-overlay-vote-btn:hover {
                color: rgba(255, 255, 255, 0.9);
                background: rgba(255, 255, 255, 0.1);
            }

            .orbitar-overlay-vote-btn.active.up {
                color: #4caf50;
                background: rgba(76, 175, 80, 0.2);
                border-color: #4caf50;
                box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
            }

            .orbitar-overlay-vote-btn.active.down {
                color: #f44336;
                background: rgba(244, 67, 54, 0.2);
                border-color: #f44336;
                box-shadow: 0 0 8px rgba(244, 67, 54, 0.6);
            }

            .orbitar-overlay-vote-btn.active.up:hover {
                color: #66bb6a;
                background: rgba(76, 175, 80, 0.3);
                border-color: #66bb6a;
                box-shadow: 0 0 12px rgba(76, 175, 80, 0.8);
            }

            .orbitar-overlay-vote-btn.active.down:hover {
                color: #ef5350;
                background: rgba(244, 67, 54, 0.3);
                border-color: #ef5350;
                box-shadow: 0 0 12px rgba(244, 67, 54, 0.8);
            }

            .orbitarReplayIconContainer {
                position: fixed;
                top: 59px;
                left: 80px;
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

            .badge-index-input::-webkit-outer-spin-button,
            .badge-index-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            .badge-index-input[type=number] {
                -moz-appearance: textfield;
            }

            #overlayCurrentIndex::-webkit-outer-spin-button,
            #overlayCurrentIndex::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            #overlayCurrentIndex[type=number] {
                -moz-appearance: textfield;
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
        `
    };

    Theme.ensureStyles();

    /* --------------------------------------------------------------------- */
    /* Utility Helpers                                                       */
    /* --------------------------------------------------------------------- */

    const Utils = {
        eventHasMeta(e) {
            return !!(e.metaKey || e.ctrlKey);
        },
        normalizeModifier(token) {
            if (!token) return '';
            const trimmed = token.trim();
            if (!trimmed) return '';
            const lower = trimmed.toLowerCase();
            if (Config.hotkeys.metaAliases.has(lower)) return Config.hotkeys.metaToken;
            if (lower === 'shift') return 'Shift';
            if (lower === 'alt' || lower === 'option') return 'Alt';
            if (lower === 'ctrl' || lower === 'control') return 'Ctrl';
            return trimmed;
        },
        normalizeKeyToken(token) {
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
        },
        normalizeEventKey(key) {
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
        },
        normalizeHotkeyString(str) {
            if (!str) return '';
            const tokens = str.split('+').map(t => t.trim()).filter(Boolean);
            if (!tokens.length) return '';
            const keyToken = Utils.normalizeKeyToken(tokens[tokens.length - 1]);
            const modifierTokens = tokens.slice(0, -1).map(Utils.normalizeModifier).filter(Boolean);
            const uniqueModifiers = [];
            modifierTokens.forEach(token => {
                if (!uniqueModifiers.includes(token)) uniqueModifiers.push(token);
            });
            uniqueModifiers.sort((a, b) => {
                const order = Config.hotkeys.modifierOrder;
                const idxA = order.indexOf(a);
                const idxB = order.indexOf(b);
                return (idxA === -1 ? order.length : idxA) - (idxB === -1 ? order.length : idxB);
            });
            return [...uniqueModifiers, keyToken].filter(Boolean).join('+');
        },
        parseOrbitarDate(str) {
            const now = new Date();
            if (!str) return null;
            const trimmed = str.trim();
            const rxToday = /^(сегодня|today)[^\d]*(\d{1,2}):(\d{2})$/i;
            const rxYesterday = /^(вчера|yesterday)[^\d]*(\d{1,2}):(\d{2})$/i;
            const rxDate = /(\d{1,2})\s+([а-яА-ЯёЁ]+|[A-Za-z]+)[^\d]*(\d{1,2}):(\d{2})/i;
            const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let m;
            if ((m = rxToday.exec(trimmed))) {
                const hour = +m[2], min = +m[3];
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
            }
            if ((m = rxYesterday.exec(trimmed))) {
                const hour = +m[2], min = +m[3];
                const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
                dt.setDate(dt.getDate() - 1);
                return dt;
            }
            if ((m = rxDate.exec(trimmed))) {
                const day = +m[1];
                const monthText = m[2];
                const hour = +m[3];
                const min = +m[4];
                let month = monthsRu.indexOf(monthText.toLowerCase());
                if (month === -1) month = monthsEn.findIndex(x => x.toLowerCase() === monthText.toLowerCase());
                if (month === -1) month = now.getMonth();
                return new Date(now.getFullYear(), month, day, hour, min);
            }
            return null;
        },
        isRootComment(div) {
            return !div.closest('.CommentComponent_answers__pRHM8 .comment');
        }
    };

    /* --------------------------------------------------------------------- */
    /* API Interception                                                      */
    /* --------------------------------------------------------------------- */

    const ApiInterceptor = {
        originalFetch: window.fetch,
        init() {
            const intercept = async function (...args) {
                const response = await ApiInterceptor.originalFetch.apply(this, args);
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
                if (url && url.includes('/api/v1/post/get')) {
                    response.clone().json().then(data => {
                        if (data && data.payload && data.payload.comments) {
                            Runtime.state.cachedPostData = data.payload;
                            console.log('[Orbitar Replay] Cached API data:', data.payload.comments.length, 'comments');
                        }
                    }).catch(() => { /* ignore JSON errors */ });
                }
                return response;
            };
            window.fetch = intercept;
        }
    };

    /* --------------------------------------------------------------------- */
    /* Storage modules                                                       */
    /* --------------------------------------------------------------------- */

    const Storage = {
        state: {
            load() {
                try {
                    const postId = Pages.getCurrentPostId();
                    if (postId) {
                        const postKey = Config.storageKeys.POST_PREFIX + postId;
                        const postRaw = localStorage.getItem(postKey);
                        if (postRaw) {
                            const obj = JSON.parse(postRaw);
                            if (obj && obj.startFrom) obj.startFrom = new Date(obj.startFrom);
                            console.log('[Orbitar Replay] ✓ Загружены настройки для ПОСТА:', postId, obj);
                            return { settings: obj, source: 'post' };
                        }
                    }
                    const raw = localStorage.getItem(Config.storageKeys.STATE);
                    if (!raw) {
                        console.log('[Orbitar Replay] Нет сохраненных настроек, используются дефолтные');
                        return { settings: null, source: 'default' };
                    }
                    const obj = JSON.parse(raw);
                    if (obj && obj.startFrom) obj.startFrom = new Date(obj.startFrom);
                    console.log('[Orbitar Replay] Загружены ОБЩИЕ настройки (для всех постов):', obj);
                    return { settings: obj, source: 'global' };
                } catch (error) {
                    console.warn('[Orbitar Replay] Failed to load state:', error);
                    return { settings: null, source: 'default' };
                }
            },
            save(state) {
                try {
                    const toSave = { ...state, startFrom: state.startFrom ? state.startFrom.toISOString() : null };
                    localStorage.setItem(Config.storageKeys.STATE, JSON.stringify(toSave));
                    console.log('[Orbitar Replay] ✓ Сохранены ОБЩИЕ настройки (для всех постов):', toSave);
                } catch (error) {
                    console.warn('[Orbitar Replay] Failed to save global state:', error);
                }
            },
            saveForPost(state) {
                try {
                    const postId = Pages.getCurrentPostId();
                    if (!postId) {
                        console.error('[Orbitar Replay] Cannot save: not on a post page. Current path:', location.pathname);
                        return false;
                    }
                    const postTitle = Pages.getCurrentPostTitle();
                    const postUrl = Pages.getCurrentPostUrl();
                    const toSave = { 
                        ...state, 
                        startFrom: state.startFrom ? state.startFrom.toISOString() : null,
                        _postMeta: {
                            title: postTitle,
                            url: postUrl,
                            savedAt: new Date().toISOString()
                        }
                    };
                    const key = Config.storageKeys.POST_PREFIX + postId;
                    localStorage.setItem(key, JSON.stringify(toSave));
                    console.log('[Orbitar Replay] ✓ Сохранены настройки для ПОСТА:', postId, toSave);
                    console.log('[Orbitar Replay] Эти настройки ПЕРЕКРОЮТ общие настройки для этого поста');
                    return true;
                } catch (error) {
                    console.error('[Orbitar Replay] Error saving post settings:', error);
                    return false;
                }
            }
        },
        presets: {
            loadDefaultMods() {
                try {
                    const raw = localStorage.getItem(Config.storageKeys.DEFAULT_PRESET_MODS);
                    if (!raw) return {};
                    const parsed = JSON.parse(raw);
                    if (!parsed || typeof parsed !== 'object') return {};
                    const normalized = {};
                    Object.entries(parsed).forEach(([name, mod]) => {
                        if (!mod || typeof mod !== 'object') return;
                        const entry = { ...mod };
                        if (entry.hotkey) entry.hotkey = Utils.normalizeHotkeyString(entry.hotkey);
                        normalized[name] = entry;
                    });
                    return normalized;
                } catch {
                    return {};
                }
            },
            saveDefaultMods(mods) {
                try {
                    const payload = {};
                    Object.entries(mods || {}).forEach(([name, mod]) => {
                        if (!mod || typeof mod !== 'object') return;
                        const entry = { ...mod };
                        if (entry.hotkey) entry.hotkey = Utils.normalizeHotkeyString(entry.hotkey);
                        payload[name] = entry;
                    });
                    localStorage.setItem(Config.storageKeys.DEFAULT_PRESET_MODS, JSON.stringify(payload));
                } catch { /* ignore */ }
            },
            loadUser() {
                try {
                    const raw = localStorage.getItem(Config.storageKeys.PRESETS);
                    if (!raw) return [];
                    const arr = JSON.parse(raw);
                    if (!Array.isArray(arr)) return [];
                    return arr.map(preset => ({
                        ...preset,
                        isDefault: false,
                        hotkey: Utils.normalizeHotkeyString(preset.hotkey || ''),
                        showInMenu: preset.showInMenu !== undefined ? preset.showInMenu : false,
                        menuLabel: preset.menuLabel || '',
                        state: {
                            ...preset.state,
                            startFrom: preset.state?.startFrom ? new Date(preset.state.startFrom) : null
                        }
                    }));
                } catch {
                    return [];
                }
            },
            persist(list) {
                try {
                    const normalized = list.map(preset => ({
                        name: preset.name,
                        ts: preset.ts || Date.now(),
                        hotkey: Utils.normalizeHotkeyString(preset.hotkey || ''),
                        showInMenu: preset.showInMenu !== undefined ? preset.showInMenu : false,
                        menuLabel: preset.menuLabel || '',
                        state: {
                            ...preset.state,
                            startFrom: preset.state?.startFrom ? new Date(preset.state.startFrom).toISOString() : null
                        }
                    }));
                    localStorage.setItem(Config.storageKeys.PRESETS, JSON.stringify(normalized));
                } catch (error) {
                    console.warn('[Orbitar Replay] Failed to persist presets:', error);
                }
            }
        },
        hotkeys: {
            load(defaults) {
                try {
                    const raw = localStorage.getItem(Config.storageKeys.HOTKEYS);
                    const base = { ...defaults };
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
                        normalized[key] = Utils.normalizeHotkeyString(value);
                    });
                    return normalized;
                } catch {
                    const fallback = {};
                    Object.entries(defaults).forEach(([key, value]) => {
                        fallback[key] = Utils.normalizeHotkeyString(value);
                    });
                    return fallback;
                }
            },
            save(hotkeys) {
                try {
                    const payload = {};
                    Object.entries(hotkeys || {}).forEach(([key, value]) => {
                        payload[key] = Utils.normalizeHotkeyString(value);
                    });
                    localStorage.setItem(Config.storageKeys.HOTKEYS, JSON.stringify(payload));
                } catch (error) {
                    console.warn('[Orbitar Replay] Failed to save hotkeys:', error);
                }
            }
        }
    };

    /* --------------------------------------------------------------------- */
    /* Pages & Comments                                                      */
    /* --------------------------------------------------------------------- */

    const Pages = {
        getCurrentPostId() {
            const pathname = location.pathname;
            const subsiteMatch = pathname.match(/\/s\/([^\/]+)\/p(\d+)/);
            if (subsiteMatch) {
                return `${subsiteMatch[1]}_${subsiteMatch[2]}`;
            }
            const mainMatch = pathname.match(/\/p(\d+)/);
            if (mainMatch) return mainMatch[1];
            return null;
        },
        getCurrentPostTitle() {
            // Try to get title from <h1> first
            const h1 = document.querySelector('h1');
            if (h1 && h1.textContent.trim()) {
                return h1.textContent.trim();
            }
            // Fallback to page title, removing site name
            const pageTitle = document.title;
            const titleParts = pageTitle.split(' / ');
            if (titleParts.length > 0) {
                return titleParts[0].trim();
            }
            return pageTitle.trim();
        },
        getCurrentPostUrl() {
            return location.href.split('?')[0].split('#')[0];
        },
        isPostPage() {
            return Pages.getCurrentPostId() !== null;
        }
    };

    const Comments = {
        hasImage(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            return !!cnt.querySelector('img.image-large, img.image-scalable, .ContentComponent_content__lc9BO img, img');
        },
        hasYoutube(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            return !!cnt.querySelector('.youtube-embed-processed, .youtube-embed, img[data-youtube]');
        },
        hasMp4(div) {
            const cnt = div.querySelector('.ContentComponent_content__lc9BO');
            if (!cnt) return false;
            const thumbnail = cnt.querySelector('a.video-embed img[data-video]');
            if (thumbnail) return true;
            return !!cnt.querySelector('video');
        },
        hasVideo(div) {
            return Comments.hasYoutube(div) || Comments.hasMp4(div);
        },
        getCommentDate(div) {
            const sig = div.querySelector('[class^="SignatureComponent_signature__"]');
            if (!sig) return null;
            const links = sig.querySelectorAll('a');
            if (links.length < 2) return null;
            return Utils.parseOrbitarDate(links[1].textContent);
        },
        apiHasImage(comment) {
            if (!comment || !comment.content) return false;
            return comment.content.includes('<img') &&
                !comment.content.includes('video-embed') &&
                !comment.content.includes('youtube-embed');
        },
        apiHasVideo(comment) {
            if (!comment || !comment.content) return false;
            return comment.content.includes('video-embed') ||
                comment.content.includes('youtube-embed') ||
                comment.content.includes('data-video') ||
                comment.content.includes('data-youtube');
        },
        apiIsRoot(comment) {
            return !comment.parentComment;
        },
        flatten(comments) {
            const result = [];
            for (const comment of comments) {
                result.push(comment);
                if (Array.isArray(comment.answers)) {
                    result.push(...Comments.flatten(comment.answers));
                }
            }
            return result;
        },
        collectFromApi(opts) {
            let comments = Comments.flatten(Runtime.state.cachedPostData.comments);
            if (opts.startFrom && !Number.isNaN(opts.startFrom.getTime())) {
                comments = comments.filter(c => new Date(c.created) >= opts.startFrom);
            }
            if (opts.rootsOnly) comments = comments.filter(Comments.apiIsRoot);
            if (opts.imagesOnly) comments = comments.filter(c => Comments.apiHasImage(c) && !Comments.apiHasVideo(c));
            if (opts.videosOnly) comments = comments.filter(Comments.apiHasVideo);
            comments.sort((a, b) => new Date(a.created) - new Date(b.created));
            const rows = [];
            for (const comment of comments) {
                const elem = document.querySelector(`div.comment[data-comment-id="${comment.id}"]`);
                if (elem) {
                    rows.push({ elem, date: new Date(comment.created), apiData: comment });
                }
            }
            console.log('[Orbitar Replay] Using API data:', rows.length, 'comments filtered');
            return rows;
        },
        collectFromDom(opts) {
            const commentDivs = Array.from(document.querySelectorAll('div.comment[data-comment-id]'));
            let rows = [];
            for (const div of commentDivs) {
                const date = Comments.getCommentDate(div);
                if (!date) continue;
                rows.push({ elem: div, date });
            }
            rows.sort((a, b) => a.date - b.date);
            if (opts.rootsOnly) rows = rows.filter(r => Utils.isRootComment(r.elem));
            if (opts.imagesOnly) rows = rows.filter(r => Comments.hasImage(r.elem) && !Comments.hasVideo(r.elem));
            if (opts.videosOnly) rows = rows.filter(r => Comments.hasVideo(r.elem));
            if (opts.startFrom && !Number.isNaN(opts.startFrom.getTime())) {
                rows = rows.filter(r => r.date >= opts.startFrom);
            }
            console.log('[Orbitar Replay] Using DOM parsing:', rows.length, 'comments filtered');
            return rows;
        },
        collectSorted(opts) {
            if (Runtime.state.cachedPostData && Runtime.state.cachedPostData.comments) {
                return Comments.collectFromApi(opts);
            }
            return Comments.collectFromDom(opts);
        },
        getScrollTarget(elem) {
            if (!elem) return elem;
            const directChildren = Array.from(elem.children || []).filter(child => child instanceof HTMLElement);
            // Prefer the main comment container before answers
            const bodyCandidate = directChildren.find(child => {
                const className = typeof child.className === 'string' ? child.className : '';
                return className.includes('CommentComponent_comment__') || className.includes('CommentComponent_root__');
            });
            if (bodyCandidate) return bodyCandidate;
            // Fallback to element preceding answers block (if replies exist)
            const answersBlock = directChildren.find(child => {
                const className = typeof child.className === 'string' ? child.className : '';
                return className.includes('CommentComponent_answers__');
            });
            if (answersBlock) {
                let sibling = answersBlock.previousElementSibling;
                while (sibling) {
                    if (sibling instanceof HTMLElement) return sibling;
                    sibling = sibling.previousElementSibling;
                }
            }
            // Try signature/content blocks that belong to the current root comment
            const signature = elem.querySelector('[class^="SignatureComponent_signature__"]');
            if (signature && signature.closest('div.comment') === elem) return signature;
            const content = elem.querySelector('.ContentComponent_content__lc9BO');
            if (content && content.closest('div.comment') === elem) return content;
            return elem;
        }
    };

    /* --------------------------------------------------------------------- */
    /* Media builder                                                         */
    /* --------------------------------------------------------------------- */

    const Media = {
        buildImageNode(imgEl) {
            const src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || imgEl.currentSrc || imgEl.src;
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                maxWidth: '92vw', maxHeight: '86vh'
            });
            const img = document.createElement('img');
            img.src = src;
            Object.assign(img.style, {
                maxWidth: '92vw', maxHeight: '86vh', objectFit: 'contain', display: 'block'
            });
            wrap.appendChild(img);
            return wrap;
        },
        buildVideoNodeFromMp4(div, autoplay, wantControls = true) {
            const aimg = div.querySelector('.ContentComponent_content__lc9BO a.video-embed img[data-video]');
            const raw = aimg?.getAttribute('data-video');
            const src = raw || div.querySelector('.ContentComponent_content__lc9BO video')?.src;
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                maxWidth: '92vw', maxHeight: '86vh'
            });
            const video = document.createElement('video');
            Object.assign(video.style, {
                maxWidth: '92vw', maxHeight: '86vh', outline: 'none', background: '#000'
            });
            if (src) {
                video.src = src;
                video.playsInline = true;
                video.controls = !!wantControls;
                video.muted = !!Runtime.lastMediaMuted;
                try { video.volume = Math.min(1, Math.max(0, Runtime.lastMediaVolume / 100)); } catch { /* ignore */ }
                if (autoplay) video.autoplay = true;
            }
            video.addEventListener('volumechange', () => {
                Runtime.lastMediaMuted = video.muted;
                localStorage.setItem(Config.storageKeys.MUTED, String(Runtime.lastMediaMuted));
                Runtime.lastMediaVolume = Math.round((video.volume || 0) * 100);
                localStorage.setItem(Config.storageKeys.VOLUME, String(Runtime.lastMediaVolume));
            });
            wrap.appendChild(video);
            return { wrap, video, ok: !!src };
        },
        loadYouTubeAPIOnce() {
            if (Media.ytApiLoaded) return Promise.resolve();
            if (Media.ytApiPromise) return Media.ytApiPromise;
            Media.ytApiPromise = new Promise(resolve => {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                window.onYouTubeIframeAPIReady = function () {
                    Media.ytApiLoaded = true;
                    resolve();
                };
                document.head.appendChild(tag);
            });
            return Media.ytApiPromise;
        },
        extractYouTubeId(div) {
            const img = div.querySelector('.ContentComponent_content__lc9BO img[data-youtube]');
            if (img) {
                const data = img.getAttribute('data-youtube') || '';
                const match = data.match(/embed\/([A-Za-z0-9_\-]+)/);
                if (match) return match[1];
            }
            const link = div.querySelector('.ContentComponent_content__lc9BO a.youtube-embed, .ContentComponent_content__lc9BO .youtube-embed-processed');
            if (link?.href) {
                try {
                    const url = new URL(link.href);
                    if (url.hostname.includes('youtube.com')) {
                        const id = url.searchParams.get('v');
                        if (id) return id;
                    }
                } catch { /* ignore malformed URLs */ }
            }
            return null;
        },
        buildYouTubeNode(div, autoplay) {
            const videoId = Media.extractYouTubeId(div);
            if (!videoId) return { wrap: null, init: () => Promise.resolve(), ok: false };
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '92vw', height: '86vh', background: '#000', borderRadius: '8px'
            });
            const holder = document.createElement('div');
            Object.assign(holder.style, { width: '92vw', height: '86vh' });
            wrap.appendChild(holder);
            const init = async () => {
                await Media.loadYouTubeAPIOnce();
                Runtime.overlay.youtubePlayer = new YT.Player(holder, {
                    videoId,
                    playerVars: { autoplay: autoplay ? 1 : 0, controls: 1, modestbranding: 1, rel: 0, playsinline: 1 },
                    events: {
                        onReady: ev => {
                            try {
                                if (Runtime.lastMediaMuted) ev.target.mute();
                                else {
                                    ev.target.unMute();
                                    ev.target.setVolume(Math.min(100, Math.max(0, Runtime.lastMediaVolume)));
                                }
                                if (autoplay) ev.target.playVideo();
                            } catch { /* ignore */ }
                        }
                    }
                });
            };
            return { wrap, init, ok: true };
        }
    };
    Media.ytApiLoaded = false;
    Media.ytApiPromise = null;

    /* --------------------------------------------------------------------- */
    /* Presets & Defaults                                                    */
    /* --------------------------------------------------------------------- */

    const Presets = {
        defaults: [
            {
                name: 'Картинки',
                isDefault: true,
                hotkey: `${Config.hotkeys.metaToken}+Shift+1`,
                showInMenu: true,
                menuLabel: '1',
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
                hotkey: `${Config.hotkeys.metaToken}+Shift+2`,
                showInMenu: true,
                menuLabel: '2',
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
            },
            {
                name: 'Таймлайн',
                isDefault: true,
                hotkey: `${Config.hotkeys.metaToken}+Shift+3`,
                showInMenu: true,
                menuLabel: '3',
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
            }
        ],
        loadAll() {
            const defaultMods = Storage.presets.loadDefaultMods();
            const defaults = Presets.defaults.map(preset => ({
                ...preset,
                hotkey: defaultMods[preset.name]?.hotkey !== undefined
                    ? Utils.normalizeHotkeyString(defaultMods[preset.name].hotkey)
                    : preset.hotkey,
                showInMenu: defaultMods[preset.name]?.showInMenu !== undefined
                    ? defaultMods[preset.name].showInMenu
                    : preset.showInMenu,
                menuLabel: defaultMods[preset.name]?.menuLabel !== undefined
                    ? defaultMods[preset.name].menuLabel
                    : preset.menuLabel
            }));
            return [...defaults, ...Storage.presets.loadUser()];
        },
        updateDefault(name, updates) {
            const mods = Storage.presets.loadDefaultMods();
            const merged = { ...mods[name], ...updates };
            if (merged.hotkey) merged.hotkey = Utils.normalizeHotkeyString(merged.hotkey);
            mods[name] = merged;
            Storage.presets.saveDefaultMods(mods);
        },
        upsert(name, state, opts = {}) {
            name = (name || '').trim();
            if (!name) return { ok: false, reason: 'empty' };
            if (Presets.defaults.some(preset => preset.name === name)) {
                return { ok: false, reason: 'default' };
            }
            const list = Storage.presets.loadUser();
            const existingIndex = list.findIndex(p => p.name === name);
            if (existingIndex >= 0) list.splice(existingIndex, 1);
            list.unshift({
                name,
                ts: Date.now(),
                hotkey: Utils.normalizeHotkeyString(opts.hotkey || ''),
                showInMenu: opts.showInMenu || false,
                menuLabel: opts.menuLabel || '',
                state: Presets.cloneState(state)
            });
            Storage.presets.persist(list);
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

    /* --------------------------------------------------------------------- */
    /* Hotkeys                                                               */
    /* --------------------------------------------------------------------- */

    const HotkeyService = {
        defaults: {
            playPause: 'Space',
            toggleScript: 'Ctrl+P',
            toggleSlideshow: 'Ctrl+S',
            stepNext: 'ArrowRight',
            stepPrev: 'ArrowLeft',
            delayUp: 'ArrowUp',
            delayDown: 'ArrowDown',
            closeOverlay: 'Escape',
            voteUp: `${Config.hotkeys.metaToken}+=`,
            voteDown: `${Config.hotkeys.metaToken}+-`
        },
        load() {
            Runtime.hotkeys = Storage.hotkeys.load(HotkeyService.defaults);
        },
        save(hotkeys) {
            Runtime.hotkeys = { ...hotkeys };
            Storage.hotkeys.save(Runtime.hotkeys);
        },
        matches(event, hotkeyString) {
            if (!hotkeyString) return false;
            const normalized = Utils.normalizeHotkeyString(hotkeyString);
            if (!normalized) return false;
            const parts = normalized.split('+');
            if (!parts.length) return false;
            const key = parts[parts.length - 1];
            const modifiers = parts.slice(0, -1);
            const requiresMeta = modifiers.includes(Config.hotkeys.metaToken);
            const requiresCtrl = modifiers.includes('Ctrl');
            const requiresShift = modifiers.includes('Shift');
            const requiresAlt = modifiers.includes('Alt');
            if (!!event.shiftKey !== requiresShift) return false;
            if (!!event.altKey !== requiresAlt) return false;
            // Check Meta (Cmd/Win) and Ctrl separately - they are different keys
            if (requiresMeta && !event.metaKey) return false;
            if (requiresCtrl && (!event.ctrlKey || event.metaKey)) return false;
            // If neither is required, both should be unpressed
            if (!requiresMeta && !requiresCtrl && (event.metaKey || event.ctrlKey)) return false;
            const eventKey = Utils.normalizeEventKey(event.key);
            const targetKey = Utils.normalizeKeyToken(key);
            return eventKey === targetKey;
        },
        capture(inputEl, onCapture, onCancel) {
            if (Runtime.state.hotkeyCapturing) {
                Runtime.state.hotkeyCapturing.cancel();
            }
            inputEl.value = '...';
            inputEl.style.background = '#fae251';
            inputEl.style.color = '#000';
            const handler = (event) => {
                const modifierKeys = ['Shift', 'Control', 'Meta', 'Alt', 'CapsLock', 'Tab'];
                if (modifierKeys.includes(event.key)) return;
                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    stopCapture();
                    if (onCancel) onCancel();
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                const parts = [];
                // Check for Cmd/Meta first (Mac Cmd or Windows Win)
                if (event.metaKey) {
                    parts.push(Config.hotkeys.metaToken);
                } else if (event.ctrlKey) {
                    // Only add Ctrl if Meta is not pressed (to distinguish Ctrl from Cmd)
                    parts.push('Ctrl');
                }
                if (event.shiftKey) parts.push('Shift');
                if (event.altKey) parts.push('Alt');
                const keyName = Utils.normalizeEventKey(event.key);
                parts.push(keyName);
                const hotkeyString = Utils.normalizeHotkeyString(parts.join('+'));
                inputEl.value = hotkeyString;
                stopCapture();
                if (onCapture) onCapture(hotkeyString);
            };
            const stopCapture = () => {
                document.removeEventListener('keydown', handler, true);
                inputEl.style.background = '';
                inputEl.style.color = '';
                Runtime.state.hotkeyCapturing = null;
            };
            Runtime.state.hotkeyCapturing = { cancel: stopCapture, active: true };
            document.addEventListener('keydown', handler, true);
        }
    };

    /* --------------------------------------------------------------------- */
    /* Voting System                                                         */
    /* --------------------------------------------------------------------- */

    const Voting = {
        test() {
            console.log('[Orbitar Replay] Voting module loaded and accessible');
        },
        getCurrentVoteState() {
            if (Runtime.state.currentIndex < 0 || Runtime.state.currentIndex >= Runtime.state.list.length) {
                return { hasUpvote: false, hasDownvote: false };
            }
            const currentComment = Runtime.state.list[Runtime.state.currentIndex];
            const commentElem = currentComment.elem;
            if (!commentElem) return { hasUpvote: false, hasDownvote: false };
            
            const voteBtnPlus = commentElem.querySelector('button.i-rating_plus');
            const voteBtnMinus = commentElem.querySelector('button.i-rating_minus');
            
            if (!voteBtnPlus || !voteBtnMinus) {
                return { hasUpvote: false, hasDownvote: false };
            }
            
            // Orbitar vote state classes:
            // - Upvoted: plus button gets RatingSwitch_plus__*
            // - Downvoted: minus button gets RatingSwitch_minus__*
            const plusClasses = Array.from(voteBtnPlus.classList);
            const minusClasses = Array.from(voteBtnMinus.classList);
            
            const hasUpvote = plusClasses.some(cls => cls.startsWith('RatingSwitch_plus__'));
            const hasDownvote = minusClasses.some(cls => cls.startsWith('RatingSwitch_minus__'));
            
            return { hasUpvote, hasDownvote };
        },
        updateButtonStates() {
            const state = Voting.getCurrentVoteState();
            const btnUp = Runtime.overlay.btnVoteUp;
            const btnDown = Runtime.overlay.btnVoteDown;
            
            if (btnUp) {
                btnUp.classList.toggle('active', state.hasUpvote);
            }
            if (btnDown) {
                btnDown.classList.toggle('active', state.hasDownvote);
            }
        },
        voteUp() {
            console.log('[Orbitar Replay] voteUp() called, currentIndex:', Runtime.state.currentIndex, 'listLength:', Runtime.state.list.length);
            if (Runtime.state.currentIndex < 0 || Runtime.state.currentIndex >= Runtime.state.list.length) {
                console.log('[Orbitar Replay] No current comment to vote on');
                return;
            }
            const currentComment = Runtime.state.list[Runtime.state.currentIndex];
            const commentElem = currentComment.elem;
            const commentId = commentElem?.getAttribute('data-comment-id') || currentComment.apiData?.id;
            console.log('[Orbitar Replay] Attempting to vote UP on comment:', commentId);
            
            if (!commentElem) {
                console.log('[Orbitar Replay] Comment element not found');
                return;
            }
            
            console.log('[Orbitar Replay] Comment element found, display:', window.getComputedStyle(commentElem).display);
            
            const voteBtn = commentElem.querySelector('button.i-rating_plus');
            if (!voteBtn) {
                console.log('[Orbitar Replay] Vote button not found in comment');
                return;
            }
            
            console.log('[Orbitar Replay] Vote button found, classes:', voteBtn.className);
            
            // Make sure element is visible and clickable
            const rect = voteBtn.getBoundingClientRect();
            console.log('[Orbitar Replay] Button position:', rect);
            
            const wasPreviouslyVoted = Voting.getCurrentVoteState().hasUpvote;
            
            // Try different click methods
            try {
                voteBtn.click();
                console.log('[Orbitar Replay] ✓ Clicked vote button for comment:', commentId, wasPreviouslyVoted ? '(removing vote)' : '(adding vote)');
            } catch (e) {
                console.error('[Orbitar Replay] Click failed:', e);
                // Try dispatching event manually
                const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                voteBtn.dispatchEvent(event);
                console.log('[Orbitar Replay] ✓ Dispatched click event for comment:', commentId);
            }
            
            // Update UI after short delay to allow DOM update
            setTimeout(() => {
                Voting.updateButtonStates();
                if (!wasPreviouslyVoted) {
                    Voting.showVoteFeedback('up');
                } else {
                    Voting.showVoteFeedback('cancel');
                }
            }, 200);
        },
        voteDown() {
            console.log('[Orbitar Replay] voteDown() called, currentIndex:', Runtime.state.currentIndex, 'listLength:', Runtime.state.list.length);
            if (Runtime.state.currentIndex < 0 || Runtime.state.currentIndex >= Runtime.state.list.length) {
                console.log('[Orbitar Replay] No current comment to vote on');
                return;
            }
            const currentComment = Runtime.state.list[Runtime.state.currentIndex];
            const commentElem = currentComment.elem;
            const commentId = commentElem?.getAttribute('data-comment-id') || currentComment.apiData?.id;
            console.log('[Orbitar Replay] Attempting to vote DOWN on comment:', commentId);
            
            if (!commentElem) {
                console.log('[Orbitar Replay] Comment element not found');
                return;
            }
            
            console.log('[Orbitar Replay] Comment element found, display:', window.getComputedStyle(commentElem).display);
            
            const voteBtn = commentElem.querySelector('button.i-rating_minus');
            if (!voteBtn) {
                console.log('[Orbitar Replay] Vote button not found in comment');
                return;
            }
            
            console.log('[Orbitar Replay] Vote button found, classes:', voteBtn.className);
            
            const rect = voteBtn.getBoundingClientRect();
            console.log('[Orbitar Replay] Button position:', rect);
            
            const wasPreviouslyVoted = Voting.getCurrentVoteState().hasDownvote;
            
            // Try different click methods
            try {
                voteBtn.click();
                console.log('[Orbitar Replay] ✓ Clicked vote button for comment:', commentId, wasPreviouslyVoted ? '(removing vote)' : '(adding vote)');
            } catch (e) {
                console.error('[Orbitar Replay] Click failed:', e);
                const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                voteBtn.dispatchEvent(event);
                console.log('[Orbitar Replay] ✓ Dispatched click event for comment:', commentId);
            }
            
            setTimeout(() => {
                Voting.updateButtonStates();
                if (!wasPreviouslyVoted) {
                    Voting.showVoteFeedback('down');
                } else {
                    Voting.showVoteFeedback('cancel');
                }
            }, 200);
        },
        showVoteFeedback(type) {
            if (!Runtime.overlay.container || !OverlayUI.isOpen()) return;
            const feedback = document.createElement('div');
            const displayText = type === 'up' ? '+1' : type === 'down' ? '−1' : '0';
            const color = type === 'up' ? '#4caf50' : type === 'down' ? '#f44336' : '#9e9e9e';
            feedback.textContent = displayText;
            feedback.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 72px;
                font-weight: bold;
                color: ${color};
                opacity: 0;
                pointer-events: none;
                z-index: 10001;
                animation: voteFeedback 1.2s ease-out;
            `;
            const style = document.createElement('style');
            style.textContent = `
                @keyframes voteFeedback {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    40% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2) translateY(-40px); }
                }
            `;
            if (!document.getElementById('vote-feedback-style')) {
                style.id = 'vote-feedback-style';
                document.head.appendChild(style);
            }
            Runtime.overlay.container.appendChild(feedback);
            setTimeout(() => feedback.remove(), 1200);
        }
    };

    /* --------------------------------------------------------------------- */
    /* Overlay UI                                                            */
    /* --------------------------------------------------------------------- */

    const OverlayUI = {
        ensure() {
            if (Runtime.overlay.container) {
                console.log('[Orbitar Replay] Overlay already exists');
                return;
            }
            console.log('[Orbitar Replay] Creating overlay UI...');
            const overlay = document.createElement('div');
            overlay.id = Config.dom.overlayId;
            overlay.classList.add('orbitar-replay-overlay');
            const inner = document.createElement('div');
            inner.classList.add('orbitar-overlay-inner');
            const header = document.createElement('div');
            header.classList.add('orbitar-overlay-header');
            const autoIndicator = document.createElement('span');
            autoIndicator.classList.add('orbitar-overlay-auto');
            header.appendChild(autoIndicator);
            const delayControl = document.createElement('span');
            delayControl.classList.add('orbitar-overlay-delay');
            delayControl.innerHTML = `
                <button id="overlayDelayDown" class="orbitar-overlay-delay-btn" type="button">−</button>
                <span id="overlayDelayValue" class="orbitar-overlay-delay-value">3 сек</span>
                <button id="overlayDelayUp" class="orbitar-overlay-delay-btn" type="button">+</button>
            `;
            header.appendChild(delayControl);
            const commentCounter = document.createElement('span');
            commentCounter.classList.add('orbitar-overlay-counter');
            commentCounter.style.display = 'flex';
            commentCounter.style.alignItems = 'center';
            commentCounter.style.gap = '2px';
            commentCounter.innerHTML = `
                <input type="number" id="overlayCurrentIndex" min="1" value="0" 
                    style="width:40px;text-align:right;background:transparent;border:none;color:#fff;font-size:14px;font-weight:500;padding:0;pointer-events:auto;" />
                <span style="color:rgba(255,255,255,0.9);">/</span>
                <span id="overlayTotalCount" style="color:rgba(255,255,255,0.9);">0</span>
            `;
            header.appendChild(commentCounter);
            
            // Bind input handler for jump to index
            const indexInput = commentCounter.querySelector('#overlayCurrentIndex');
            indexInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const newIndex = parseInt(indexInput.value, 10) - 1;
                    if (!isNaN(newIndex) && newIndex >= 0 && newIndex < Runtime.state.list.length) {
                        Runtime.state.currentIndex = newIndex;
                        Playback.showOne(newIndex);
                    }
                    indexInput.blur();
                }
            });
            indexInput.addEventListener('click', (event) => {
                event.stopPropagation();
                indexInput.select();
            });
            const voteControl = document.createElement('span');
            voteControl.classList.add('orbitar-overlay-vote-control');
            voteControl.innerHTML = `
                <button id="overlayVoteDown" class="orbitar-overlay-vote-btn down" type="button" title="Минус (${Config.hotkeys.metaToken}+−)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                    </svg>
                </button>
                <button id="overlayVoteUp" class="orbitar-overlay-vote-btn up" type="button" title="Плюс (${Config.hotkeys.metaToken}++)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                </button>
            `;
            header.appendChild(voteControl);
            console.log('[Orbitar Replay] Vote control added to header');
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.textContent = '✖';
            closeBtn.classList.add('orbitar-overlay-close');
            closeBtn.addEventListener('click', event => {
                event.stopPropagation();
                if (Runtime.state.currentWait) {
                    Runtime.state.currentWait.cancel('close');
                    Runtime.state.currentWait = null;
                }
                Playback.setPlaying(false, 'overlay_close');
                OverlayUI.close();
                // Restore visibility of all comments after closing overlay
                if (Runtime.state.list && Runtime.state.list.length > 0) {
                    PanelUI.showAll(Runtime.state.list);
                }
            });
            const btnPrev = document.createElement('button');
            btnPrev.type = 'button';
            btnPrev.textContent = '←';
            btnPrev.classList.add('orbitar-overlay-nav', 'left');
            btnPrev.addEventListener('click', event => {
                event.stopPropagation();
                if (Runtime.state.currentWait) {
                    Runtime.state.currentWait.cancel('nav_prev');
                    Runtime.state.currentWait = null;
                }
                if (!Runtime.state.list.length) return;
                Playback.dispatchPrev();
            });
            const btnNext = document.createElement('button');
            btnNext.type = 'button';
            btnNext.textContent = '→';
            btnNext.classList.add('orbitar-overlay-nav', 'right');
            btnNext.addEventListener('click', event => {
                event.stopPropagation();
                if (Runtime.state.currentWait) {
                    Runtime.state.currentWait.cancel('nav_next');
                    Runtime.state.currentWait = null;
                }
                if (!Runtime.state.list.length) return;
                Playback.dispatchNext();
            });
            overlay.appendChild(inner);
            overlay.appendChild(header);
            overlay.appendChild(closeBtn);
            overlay.appendChild(btnPrev);
            overlay.appendChild(btnNext);
            document.body.appendChild(overlay);
            Runtime.overlay.container = overlay;
            Runtime.overlay.inner = inner;
            Runtime.overlay.header = header;
            Runtime.overlay.autoIndicator = autoIndicator;
            Runtime.overlay.delayControl = delayControl;
            Runtime.overlay.commentCounter = commentCounter;
            Runtime.overlay.btnPrev = btnPrev;
            Runtime.overlay.btnNext = btnNext;
            const delayUpBtn = overlay.querySelector('#overlayDelayUp');
            const delayDownBtn = overlay.querySelector('#overlayDelayDown');
            delayUpBtn?.addEventListener('click', event => {
                event.stopPropagation();
                Playback.adjustDelay(1);
                delayUpBtn.blur();
            });
            delayDownBtn?.addEventListener('click', event => {
                event.stopPropagation();
                Playback.adjustDelay(-1);
                delayDownBtn.blur();
            });
            const voteUpBtn = overlay.querySelector('#overlayVoteUp');
            const voteDownBtn = overlay.querySelector('#overlayVoteDown');
            console.log('[Orbitar Replay] Vote buttons found:', { voteUpBtn: !!voteUpBtn, voteDownBtn: !!voteDownBtn });
            Runtime.overlay.btnVoteUp = voteUpBtn;
            Runtime.overlay.btnVoteDown = voteDownBtn;
            voteUpBtn?.addEventListener('click', event => {
                console.log('[Orbitar Replay] Vote UP button clicked');
                event.stopPropagation();
                Voting.voteUp();
            });
            voteDownBtn?.addEventListener('click', event => {
                console.log('[Orbitar Replay] Vote DOWN button clicked');
                event.stopPropagation();
                Voting.voteDown();
            });
        },
        open(node) {
            OverlayUI.ensure();
            OverlayUI.replaceContent(node);
            Runtime.overlay.container.style.display = 'flex';
            Voting.updateButtonStates();
        },
        replaceContent(node) {
            try { if (Runtime.overlay.youtubePlayer?.stopVideo) Runtime.overlay.youtubePlayer.stopVideo(); } catch { /* ignore */ }
            try { if (Runtime.overlay.youtubePlayer?.destroy) Runtime.overlay.youtubePlayer.destroy(); } catch { /* ignore */ }
            Runtime.overlay.youtubePlayer = null;
            Runtime.overlay.inner.innerHTML = '';
            if (node) Runtime.overlay.inner.appendChild(node);
            // Update vote button states after content change
            setTimeout(() => Voting.updateButtonStates(), 50);
        },
        close() {
            if (!Runtime.overlay.container) return;
            OverlayUI.replaceContent(null);
            Runtime.overlay.container.style.display = 'none';
        },
        isOpen() {
            return !!Runtime.overlay.container && Runtime.overlay.container.style.display === 'flex';
        },
        setHeaderText(text) {
            if (!Runtime.overlay.commentCounter) return;
            // Parse "42 / 336" format
            const match = (text || '0 / 0').match(/(\d+)\s*\/\s*(\d+)/);
            if (match) {
                const currentInput = Runtime.overlay.commentCounter.querySelector('#overlayCurrentIndex');
                const totalSpan = Runtime.overlay.commentCounter.querySelector('#overlayTotalCount');
                if (currentInput) {
                    currentInput.value = match[1];
                    currentInput.max = match[2];
                }
                if (totalSpan) totalSpan.textContent = match[2];
            }
        },
        updateAutoIndicator() {
            if (Runtime.overlay.autoIndicator) {
                Runtime.overlay.autoIndicator.textContent = Runtime.state.playing ? '▶️' : '⏸️';
            }
            if (Runtime.overlay.delayControl) {
                Runtime.overlay.delayControl.style.display = Runtime.state.playing ? 'flex' : 'none';
                if (Runtime.state.playing) OverlayUI.updateDelayDisplay();
            }
        },
        updateDelayDisplay() {
            const delaySpan = Runtime.overlay.container?.querySelector('#overlayDelayValue');
            if (delaySpan) {
                delaySpan.textContent = `${Runtime.state.settings.delaySec} сек`;
            }
        }
    };

    /* --------------------------------------------------------------------- */
    /* Replay Icon UI                                                        */
    /* --------------------------------------------------------------------- */

    const ReplayIconUI = {
        insert() {
            if (!Pages.isPostPage()) return;
            if (Runtime.icon.container && document.body.contains(Runtime.icon.container)) return;
            const colors = Theme.getColors();
            const container = document.createElement('div');
            container.className = 'orbitarReplayIconContainer';
            Theme.apply(container, colors);
            const mainRow = document.createElement('div');
            mainRow.classList.add('orbitar-replay-main-row');
            const button = document.createElement('button');
            button.className = 'orbitarReplayIcon';
            button.title = Runtime.state.scriptEnabled ? 'rePlay (активен)' : 'rePlay (выключен)';
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                PanelUI.toggle();
            });
            const badge = document.createElement('span');
            badge.className = 'orbitarReplayModeBadge';
            mainRow.appendChild(button);
            mainRow.appendChild(badge);
            container.appendChild(mainRow);
            if (Runtime.state.scriptEnabled) {
                const presetsRow = document.createElement('div');
                presetsRow.className = 'orbitarPresetsRow';
                const presets = Presets.loadAll().filter(preset => preset.showInMenu);
                presets.forEach(preset => {
                    const presetBtn = document.createElement('button');
                    presetBtn.className = 'orbitarPresetMenuBtn';
                    presetBtn.dataset.presetName = preset.name;
                    presetBtn.textContent = preset.name;
                    presetBtn.title = `Пресет: ${preset.name}`;
                    if (Runtime.state.currentPresetName === preset.name) presetBtn.classList.add('active');
                    presetBtn.addEventListener('click', event => {
                        event.preventDefault();
                        event.stopPropagation();
                        Playback.applyPreset(preset);
                    });
                    presetsRow.appendChild(presetBtn);
                });
                
                if (presets.length) container.appendChild(presetsRow);
                
                // Add current state indicator on new line
                let stateLabel = '';
                if (Runtime.state.currentPresetName) {
                    stateLabel = Runtime.state.currentPresetName;
                } else if (Runtime.state.settingsSource === 'post') {
                    // Check if post settings match any preset
                    const matchingPreset = PanelUI.findMatchingPreset(Runtime.state.settings);
                    stateLabel = matchingPreset ? `для поста (${matchingPreset})` : 'для поста';
                } else if (Runtime.state.settingsSource === 'global') {
                    // Check if global settings match any preset
                    const matchingPreset = PanelUI.findMatchingPreset(Runtime.state.settings);
                    stateLabel = matchingPreset ? `глобальные (${matchingPreset})` : 'глобальные';
                } else if (Runtime.state.settingsSource === 'default') {
                    stateLabel = 'дефолтные';
                }
                
                if (stateLabel) {
                    const stateRow = document.createElement('div');
                    stateRow.className = 'orbitarStateRow';
                    stateRow.style.cssText = 'padding:4px 8px;font-size:11px;color:#666;text-align:center;';
                    stateRow.textContent = `применено: ${stateLabel}`;
                    container.appendChild(stateRow);
                }
            }
            document.body.appendChild(container);
            Runtime.icon = { container, button, badge, observer: Runtime.icon.observer };
            
            // Position the container after it's in DOM with retry logic
            const positionIcon = (retries = 0) => {
                const watchLink = document.querySelector('a[href="/watch"]');
                if (watchLink) {
                    const rect = watchLink.getBoundingClientRect();
                    if (rect.left > 0) {
                        container.style.left = `${rect.left}px`;
                    } else if (retries < 5) {
                        // Element found but not yet positioned, retry
                        setTimeout(() => positionIcon(retries + 1), 100);
                    } else {
                        container.style.left = '80px';
                    }
                } else if (retries < 5) {
                    // Element not found yet, retry
                    setTimeout(() => positionIcon(retries + 1), 100);
                } else {
                    // Fallback: use default spacing from left
                    container.style.left = '80px';
                }
            };
            
            // Try immediately and then retry if needed
            requestAnimationFrame(() => positionIcon());
            
            ReplayIconUI.update();
        },
        update() {
            const { container, button, badge } = Runtime.icon;
            if (!button) return;
            const colors = Theme.getColors();
            if (container) {
                Theme.apply(container, colors);
                const watchLink = document.querySelector('a[href="/watch"]');
                if (watchLink) {
                    const rect = watchLink.getBoundingClientRect();
                    if (rect.left > 0) {
                        container.style.left = `${rect.left}px`;
                    }
                } else if (!container.style.left || container.style.left === '0px' || container.style.left === '80px') {
                    // Keep existing position or use fallback
                }
            }
            let modeIcon = '';
            if (Runtime.state.scriptEnabled && Runtime.state.playing) {
                modeIcon = '<circle cx="19" cy="6" r="4" fill="#22c55e"/><text x="19" y="8.5" text-anchor="middle" font-size="6" fill="white" font-weight="bold">▶</text>';
            }
            button.title = Runtime.state.scriptEnabled
                ? (Runtime.state.playing ? 'rePlay (авто режим)' : 'rePlay (готов)')
                : 'rePlay (выключен)';
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" style="display:block;">
                    <path d="M8 5v14l11-7z" fill="${colors.panelText}" opacity="${Runtime.state.scriptEnabled ? '1' : '0.3'}"/>
                    ${!Runtime.state.scriptEnabled ? '<line x1="4" y1="4" x2="20" y2="20" stroke="' + colors.panelText + '" stroke-width="2" opacity="0.7"/>' : ''}
                    ${modeIcon}
                </svg>
            `;
            ReplayIconUI.updateBadge();
        },
        updateBadge() {
            const { badge } = Runtime.icon;
            if (!badge) return;
            if (Runtime.state.scriptEnabled && Runtime.state.list.length > 0) {
                if (Runtime.state.currentIndex >= 0) {
                    const currentNum = Runtime.state.currentIndex + 1;
                    const total = Runtime.state.list.length;
                    const delayText = (Runtime.state.playing && !Runtime.state.settings.slideshow) 
                        ? ` • ${Runtime.state.settings.delaySec}с` 
                        : '';
                    
                    badge.innerHTML = `
                        <input type="number" class="badge-index-input" min="1" max="${total}" value="${currentNum}" 
                            style="width:${String(currentNum).length * 8 + 12}px;text-align:right;background:transparent;border:none;color:inherit;font-size:inherit;font-weight:inherit;padding:0;margin:0;" />
                        <span>/${total}${delayText}</span>
                    `;
                    badge.classList.add('visible');
                    
                    // Bind input handler
                    const input = badge.querySelector('.badge-index-input');
                    if (input) {
                        input.addEventListener('keydown', (event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                event.stopPropagation();
                                const newIndex = parseInt(input.value, 10) - 1;
                                if (!isNaN(newIndex) && newIndex >= 0 && newIndex < Runtime.state.list.length) {
                                    Runtime.state.currentIndex = newIndex;
                                    Playback.showOne(newIndex);
                                }
                                input.blur();
                            }
                        });
                        input.addEventListener('click', (event) => {
                            event.stopPropagation();
                            input.select();
                        });
                    }
                } else {
                    badge.textContent = `${Runtime.state.list.length}`;
                    badge.classList.add('visible');
                }
            } else {
                badge.classList.remove('visible');
            }
        },
        refresh() {
            if (Runtime.icon.container) {
                Runtime.icon.container.remove();
                Runtime.icon.container = null;
            }
            ReplayIconUI.insert();
        },
        observe() {
            if (Runtime.icon.observer) Runtime.icon.observer.disconnect();
            const observer = new MutationObserver(() => ReplayIconUI.insert());
            observer.observe(document.body, { childList: true, subtree: true });
            Runtime.icon.observer = observer;
            ReplayIconUI.insert();
        }
    };

    /* --------------------------------------------------------------------- */
    /* Panel & Settings UI                                                   */
    /* --------------------------------------------------------------------- */

    const PanelUI = {
        toggle() {
            if (Runtime.panel) PanelUI.remove();
            else {
                if (!Runtime.state.scriptEnabled) Playback.toggleScript(true);
                PanelUI.show();
            }
        },
        show() {
            PanelUI.remove();
            const colors = Theme.getColors();
            const panel = document.createElement('div');
            panel.id = Config.dom.panelId;
            panel.classList.add('orbitar-replay-panel');
            Theme.apply(panel, colors);
            const header = document.createElement('div');
            header.classList.add('orbitar-panel-header');
            const title = document.createElement('div');
            title.classList.add('orbitar-panel-title');
            title.textContent = 'rePlay Comments';
            const headerButtons = document.createElement('div');
            headerButtons.classList.add('orbitar-panel-header-buttons');
            const settingsBtn = document.createElement('button');
            settingsBtn.type = 'button';
            settingsBtn.textContent = '⚙️';
            settingsBtn.classList.add('orbitar-icon-btn');
            settingsBtn.title = 'Расширенные настройки';
            settingsBtn.addEventListener('click', () => {
                if (Runtime.settings.modal) SettingsUI.close();
                else SettingsUI.open();
                settingsBtn.blur();
            });
            const toggleIcon = document.createElement('button');
            toggleIcon.id = Config.dom.toggleIconId;
            toggleIcon.type = 'button';
            toggleIcon.innerHTML = Runtime.state.scriptEnabled ? '✓' : '✖';
            toggleIcon.title = Runtime.state.scriptEnabled ? 'Скрипт включён' : 'Скрипт выключен';
            toggleIcon.classList.add('orbitar-icon-btn', 'orbitar-toggle-icon');
            if (!Runtime.state.scriptEnabled) toggleIcon.classList.add('off');
            toggleIcon.addEventListener('click', () => {
                Playback.toggleScript(!Runtime.state.scriptEnabled);
                if (!Runtime.state.scriptEnabled) SettingsUI.close();
                PanelUI.updateAutoButton();
                toggleIcon.blur();
            });
            headerButtons.append(settingsBtn, toggleIcon);
            header.append(title, headerButtons);
            const body = document.createElement('div');
            body.id = 'replay_body';
            body.classList.add('orbitar-panel-body');
            body.innerHTML = PanelTemplates.controls(Runtime.state.settings);
            panel.append(header, body);
            document.body.appendChild(panel);
            Runtime.panel = panel;
            PanelUI.bindControls(panel, colors);
            PanelUI.refreshPresetButtons();
            PanelUI.rebuildList(false);
            PanelUI.updateAutoButton();
            ReplayIconUI.updateBadge();
        },
        remove() {
            if (!Runtime.panel) return;
            Runtime.panel.remove();
            Runtime.panel = null;
            SettingsUI.close();
            if (Runtime.state.autoCollapseTimeout) {
                clearTimeout(Runtime.state.autoCollapseTimeout);
                Runtime.state.autoCollapseTimeout = null;
            }
        },
        bindControls(panel, colors) {
            const delayInput = panel.querySelector('#replay_delay');
            const fromInput = panel.querySelector('#replay_from');
            const state = Runtime.state.settings;
            if (state.startFrom) {
                const tz = (new Date()).getTimezoneOffset();
                const localISO = new Date(state.startFrom.getTime() - tz * 60_000).toISOString().slice(0, 16);
                fromInput.value = localISO;
            }
            const getCheckbox = id => panel.querySelector(`#check_${id}`);
            PanelUI.setupCheckbox(getCheckbox('flash'), 'flash', () => PanelUI.updateAutoButton());
            PanelUI.setupCheckbox(getCheckbox('roots'), 'rootsOnly', () => {
                PanelUI.rebuildList(false);
                PanelUI.updateStatus(`${Runtime.state.list.length} комментариев.`);
            });
            PanelUI.setupCheckbox(getCheckbox('images'), 'imagesOnly', checked => {
                if (checked) {
                    const videosCheck = getCheckbox('videos');
                    if (videosCheck) {
                        videosCheck.checked = false;
                        Runtime.state.settings.videosOnly = false;
                        const toggleSwitch = panel.querySelector(`.orbitar-toggle-switch[data-for="${videosCheck.id}"]`);
                        if (toggleSwitch) toggleSwitch.classList.remove('active');
                    }
                }
                PanelUI.rebuildList(false);
                PanelUI.updateStatus(`${Runtime.state.list.length} комментариев.`);
            });
            PanelUI.setupCheckbox(getCheckbox('videos'), 'videosOnly', checked => {
                if (checked) {
                    const imagesCheck = getCheckbox('images');
                    if (imagesCheck) {
                        imagesCheck.checked = false;
                        Runtime.state.settings.imagesOnly = false;
                        const toggleSwitch = panel.querySelector(`.orbitar-toggle-switch[data-for="${imagesCheck.id}"]`);
                        if (toggleSwitch) toggleSwitch.classList.remove('active');
                    }
                }
                PanelUI.rebuildList(false);
                PanelUI.updateStatus(`${Runtime.state.list.length} комментариев.`);
            });
            PanelUI.setupCheckbox(getCheckbox('videos_autoplay'), 'videosAutoplay');
            PanelUI.setupCheckbox(getCheckbox('loop'), 'loop');
            PanelUI.setupCheckbox(getCheckbox('slideshow'), 'slideshow', () => {
                const statusDiv = panel.querySelector('#replay_status');
                statusDiv.textContent = Runtime.state.settings.slideshow ? 'Слайд-шоу' : 'Режим страницы';
                if (Runtime.state.playing && Runtime.state.currentIndex >= 0) {
                    if (Runtime.state.currentWait) {
                        Runtime.state.currentWait.cancel('slideshow_toggle');
                        Runtime.state.currentWait = null;
                    }
                    if (!Runtime.state.settings.slideshow) {
                        OverlayUI.close();
                        // Restore visibility of all comments when switching from slideshow to page mode
                        if (Runtime.state.list && Runtime.state.list.length > 0) {
                            PanelUI.showAll(Runtime.state.list);
                        }
                    }
                    PanelUI.showOne(Runtime.state.currentIndex);
                }
                PanelUI.updateAutoButton();
            });
            PanelUI.bindButtons(panel);
            delayInput.addEventListener('change', () => {
                let value = Math.round(Math.max(1, Number(delayInput.value) || 1));
                delayInput.value = value;
                Runtime.state.settings.delaySec = value;
                PanelUI.checkPresetMatch();
                PanelUI.updateAutoButton();
            });
            fromInput.addEventListener('change', () => {
                const val = fromInput.value;
                Runtime.state.settings.startFrom = val ? new Date(val) : null;
            });
        },
        bindButtons(panel) {
            const autoBtn = panel.querySelector('#btn_auto');
            const stepBtn = panel.querySelector('#btn_step');
            const prevBtn = panel.querySelector('#btn_prev');
            const rebuildBtn = panel.querySelector('#btn_rebuild');
            const restartBtn = panel.querySelector('#btn_restart');
            const savePostBtn = panel.querySelector('#btn_save_post');
            const saveDefaultBtn = panel.querySelector('#btn_save_default');
            autoBtn.addEventListener('click', () => {
                Playback.togglePlayPause();
                autoBtn.blur();
            });
            stepBtn.addEventListener('click', () => {
                Playback.dispatchNext();
                stepBtn.blur();
            });
            prevBtn.addEventListener('click', () => {
                Playback.dispatchPrev();
                prevBtn.blur();
            });
            rebuildBtn.addEventListener('click', () => {
                PanelUI.rebuildList(false);
                PanelUI.updateStatus(`${Runtime.state.list.length} комментариев.`);
                rebuildBtn.blur();
            });
            restartBtn.addEventListener('click', () => {
                if (Runtime.state.currentWait) {
                    Runtime.state.currentWait.cancel('restart');
                    Runtime.state.currentWait = null;
                }
                Playback.setPlaying(false, 'restart');
                PanelUI.rebuildList(true);
                OverlayUI.close();
                restartBtn.blur();
            });
            savePostBtn.addEventListener('click', () => {
                const success = Storage.state.saveForPost(Runtime.state.settings);
                if (success) {
                    Runtime.state.settingsSource = 'post';
                    Runtime.state.currentPresetName = null;
                    ReplayIconUI.refresh();
                }
                PanelUI.updateStatus(success ? `✓ Сохранено для поста ${Pages.getCurrentPostId()}` : 'Ошибка сохранения');
                savePostBtn.blur();
            });
            saveDefaultBtn.addEventListener('click', () => {
                Storage.state.save(Runtime.state.settings);
                Runtime.state.settingsSource = 'global';
                Runtime.state.currentPresetName = null;
                ReplayIconUI.refresh();
                PanelUI.updateStatus('Сохранено как по умолчанию ✓');
                saveDefaultBtn.blur();
            });
        },
        setupCheckbox(checkbox, stateKey, onChange) {
            if (!checkbox) return;
            const toggleSwitch = Runtime.panel.querySelector(`.orbitar-toggle-switch[data-for="${checkbox.id}"]`);
            checkbox.addEventListener('change', () => {
                Runtime.state.settings[stateKey] = checkbox.checked;
                if (toggleSwitch) toggleSwitch.classList.toggle('active', checkbox.checked);
                PanelUI.checkPresetMatch();
                if (onChange) onChange(checkbox.checked);
            });
            if (toggleSwitch) {
                toggleSwitch.addEventListener('click', event => {
                    event.preventDefault();
                    checkbox.click();
                });
            }
        },
        updateAutoButton() {
            const autoBtn = Runtime.panel?.querySelector('#btn_auto');
            if (!autoBtn) return;
            if (Runtime.state.playing) {
                autoBtn.textContent = '⏸ Пауза';
                autoBtn.classList.add('playing');
            } else {
                autoBtn.textContent = '▶️ Старт';
                autoBtn.classList.remove('playing');
            }
            ReplayIconUI.updateBadge();
        },
        updateStatus(text) {
            const statusDiv = Runtime.panel?.querySelector('#replay_status');
            if (statusDiv) statusDiv.textContent = text;
        },
        rebuildList(resetIndex) {
            const filters = {
                rootsOnly: Runtime.state.settings.rootsOnly,
                imagesOnly: Runtime.state.settings.imagesOnly,
                videosOnly: Runtime.state.settings.videosOnly,
                startFrom: Runtime.state.settings.startFrom
            };
            Runtime.state.list = Comments.collectSorted(filters);
            PanelUI.hideAll(Runtime.state.list);
            if (resetIndex) Runtime.state.currentIndex = -1;
            PanelUI.updateStatus(`Найдено ${Runtime.state.list.length} комментариев.`);
            ReplayIconUI.updateBadge();
        },
        hideAll(list) {
            list.forEach(entry => {
                const elem = entry.elem;
                elem.style.display = 'none';
                elem.style.visibility = '';
                elem.style.opacity = '';
                elem.style.pointerEvents = '';
                elem.style.boxShadow = '';
            });
        },
        showAll(list) {
            list.forEach(entry => {
                const elem = entry.elem;
                elem.style.display = '';
                elem.style.visibility = '';
                elem.style.opacity = '';
                elem.style.transition = '';
                elem.style.pointerEvents = '';
                elem.style.boxShadow = '';
            });
        },
        showOne(index) {
            return Playback.showOne(index, { throughPanel: true });
        },
        refreshPresetButtons() {
            const container = Runtime.panel?.querySelector('#preset_buttons');
            if (!container) return;
            container.innerHTML = '';
            const presets = Presets.loadAll();
            // Check if current settings match any preset (for post/global sources)
            const matchingPresetName = PanelUI.findMatchingPreset(Runtime.state.settings);
            presets.forEach(preset => {
                const btn = document.createElement('button');
                const active = Runtime.state.currentPresetName === preset.name || 
                              (Runtime.state.currentPresetName === null && matchingPresetName === preset.name);
                btn.type = 'button';
                btn.classList.add('orbitar-panel-preset-btn');
                if (active) btn.classList.add('active');
                btn.textContent = preset.name;
                btn.title = `Пресет: ${preset.name}`;
                btn.addEventListener('click', () => {
                    Playback.applyPreset(preset);
                    btn.blur();
                });
                container.appendChild(btn);
            });
        },
        checkPresetMatch() {
            if (!Runtime.state.currentPresetName) return;
            const preset = Presets.loadAll().find(p => p.name === Runtime.state.currentPresetName);
            if (!preset) return;
            const st = Runtime.state.settings;
            const same = st.flash === preset.state.flash &&
                st.delaySec === preset.state.delaySec &&
                st.slideshow === preset.state.slideshow &&
                st.rootsOnly === preset.state.rootsOnly &&
                st.imagesOnly === preset.state.imagesOnly &&
                st.videosOnly === preset.state.videosOnly &&
                st.videosAutoplay === preset.state.videosAutoplay &&
                st.loop === preset.state.loop;
            if (!same) {
                Runtime.state.currentPresetName = null;
                Runtime.state.settingsSource = null;
                console.log('[Orbitar Replay] Settings changed, clearing active preset');
                ReplayIconUI.refresh();
                PanelUI.refreshPresetButtons();
            }
        },
        findMatchingPreset(settings) {
            // Find a preset that matches the given settings (ignoring startFrom as it's not part of preset state)
            const presets = Presets.loadAll();
            for (const preset of presets) {
                const same = settings.flash === preset.state.flash &&
                    settings.delaySec === preset.state.delaySec &&
                    settings.slideshow === preset.state.slideshow &&
                    settings.rootsOnly === preset.state.rootsOnly &&
                    settings.imagesOnly === preset.state.imagesOnly &&
                    settings.videosOnly === preset.state.videosOnly &&
                    settings.videosAutoplay === preset.state.videosAutoplay &&
                    settings.loop === preset.state.loop;
                if (same) {
                    return preset.name;
                }
            }
            return null;
        }
    };

    const UIHelpers = {
        createToggle(id, label, checked) {
            return `
                <label class="orbitar-toggle-wrapper">
                    <input class="orbitar-toggle-input" type="checkbox" id="check_${id}" data-id="${id}" ${checked ? 'checked' : ''}>
                    <span class="orbitar-toggle-switch ${checked ? 'active' : ''}" data-for="check_${id}">
                        <span></span>
                    </span>
                    <span class="orbitar-toggle-label">${label}</span>
                </label>
            `;
        }
    };

    const PanelTemplates = {
        controls(state) {
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
                        ${UIHelpers.createToggle('slideshow', 'Слайд-шоу', state.slideshow)}
                        ${UIHelpers.createToggle('roots', 'Только корневые', state.rootsOnly)}
                        ${UIHelpers.createToggle('flash', 'Подсветка', state.flash)}
                        ${UIHelpers.createToggle('images', 'Только изображения', state.imagesOnly)}
                        ${UIHelpers.createToggle('loop', 'Зациклить', state.loop)}
                        ${UIHelpers.createToggle('videos', 'Только видео', state.videosOnly)}
                        <div class="orbitar-save-buttons">
                            <span class="orbitar-hint">Сохр:</span>
                            <button id="btn_save_post" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">Для поста</button>
                            <button id="btn_save_default" class="orbitar-btn orbitar-btn-secondary orbitar-btn-compact" type="button">Для всех</button>
                        </div>
                        ${UIHelpers.createToggle('videos_autoplay', 'Автоплей видео', state.videosAutoplay)}
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
    };

    /* --------------------------------------------------------------------- */
    /* Settings Modal                                                        */
    /* --------------------------------------------------------------------- */

    const SettingsUI = {
        open() {
            SettingsUI.close();
            const colors = Theme.getColors();
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000000'
            });
            const content = SettingsTemplates.content(colors, Runtime.hotkeys);
            modal.appendChild(content);
            document.body.appendChild(modal);
            Runtime.settings.modal = modal;
            SettingsUI.bind(content, colors);
            Runtime.settings.keyHandler = event => {
                if (Runtime.state.hotkeyCapturing?.active) return;
                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    SettingsUI.close();
                }
            };
            document.addEventListener('keydown', Runtime.settings.keyHandler, true);
        },
        close() {
            if (Runtime.settings.modal) {
                Runtime.settings.modal.remove();
                Runtime.settings.modal = null;
            }
            if (Runtime.settings.keyHandler) {
                document.removeEventListener('keydown', Runtime.settings.keyHandler, true);
                Runtime.settings.keyHandler = null;
            }
        },
        bind(content, colors) {
            const closeBtn = content.querySelector('#settings_close');
            closeBtn?.addEventListener('click', () => SettingsUI.close());
            Runtime.settings.modal?.addEventListener('click', event => {
                if (event.target === Runtime.settings.modal) SettingsUI.close();
            });
            SettingsUI.bindHotkeyInputs(content);
            SettingsUI.renderPresets(content, colors);
            SettingsUI.renderPostSettings(content, colors);
            const resetBtn = content.querySelector('#factory_reset');
            if (resetBtn) {
                resetBtn.addEventListener('mouseenter', () => resetBtn.style.opacity = '1');
                resetBtn.addEventListener('mouseleave', () => resetBtn.style.opacity = '0.7');
                resetBtn.addEventListener('click', () => SettingsUI.factoryReset());
            }
        },
        bindHotkeyInputs(content) {
            const inputs = content.querySelectorAll('.hotkey-input');
            inputs.forEach(input => {
                const originalValue = input.value;
                input.addEventListener('click', () => {
                    HotkeyService.capture(input, hotkeyString => {
                        const newHotkeys = {};
                        inputs.forEach(inp => {
                            const key = inp.getAttribute('data-key');
                            newHotkeys[key] = Utils.normalizeHotkeyString(inp.value.trim());
                        });
                        HotkeyService.save(newHotkeys);
                        inputs.forEach(inp => {
                            const key = inp.getAttribute('data-key');
                            inp.value = Utils.normalizeHotkeyString(Runtime.hotkeys[key] || '');
                        });
                        Hotkeys.setupGlobalToggleHandler();
                        Hotkeys.setupMainHotkeys();
                        console.log('[Orbitar Replay] Hotkey auto-saved:', hotkeyString);
                    }, () => {
                        input.value = originalValue;
                    });
                });
            });
            
            // Bind clear buttons
            const clearButtons = content.querySelectorAll('.hotkey-clear');
            clearButtons.forEach(btn => {
                // Add hover effects
                btn.addEventListener('mouseenter', () => {
                    btn.style.opacity = '1';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.opacity = '0.6';
                });
                
                btn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const key = btn.getAttribute('data-key');
                    const input = content.querySelector(`.hotkey-input[data-key="${key}"]`);
                    if (input) {
                        input.value = '';
                        const newHotkeys = {};
                        inputs.forEach(inp => {
                            const k = inp.getAttribute('data-key');
                            newHotkeys[k] = Utils.normalizeHotkeyString(inp.value.trim());
                        });
                        HotkeyService.save(newHotkeys);
                        Hotkeys.setupGlobalToggleHandler();
                        Hotkeys.setupMainHotkeys();
                        console.log('[Orbitar Replay] Hotkey cleared for:', key);
                    }
                    btn.blur();
                });
            });
        },
        renderPresets(content, colors) {
            const container = content.querySelector('#presets_list');
            const presets = Presets.loadAll();
            container.innerHTML = '';
            presets.forEach(preset => {
                const item = SettingsTemplates.presetItem(preset, colors, content);
                container.appendChild(item);
            });
        },
        renderPostSettings(content, colors) {
            const container = content.querySelector('#post_settings_list');
            container.innerHTML = '';
            const postSettings = [];
            for (let i = 0; i < localStorage.length; i += 1) {
                const key = localStorage.key(i);
                if (key && key.startsWith(Config.storageKeys.POST_PREFIX)) {
                    const postId = key.replace(Config.storageKeys.POST_PREFIX, '');
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        const meta = data?._postMeta || {};
                        const baseTitle = meta.title || `Пост ${postId}`;
                        // Extract subsite from postId (format: subsiteName_postNumber or just postNumber)
                        const subsiteParts = postId.split('_');
                        const subsite = subsiteParts.length > 1 ? subsiteParts[0] : null;
                        const displayTitle = subsite 
                            ? `${subsite} / ${baseTitle}` 
                            : `Главная / ${baseTitle}`;
                        postSettings.push({ 
                            key, 
                            postId, 
                            title: displayTitle,
                            url: meta.url || null
                        });
                    } catch (e) {
                        postSettings.push({ key, postId, title: `Пост ${postId}`, url: null });
                    }
                }
            }
            if (!postSettings.length) {
                const empty = document.createElement('div');
                empty.textContent = 'Нет сохранённых настроек постов';
                empty.style.cssText = `font-size:12px;opacity:0.6;color:${colors.labelText};padding:8px;`;
                container.appendChild(empty);
                return;
            }
            postSettings.forEach(({ key, postId, title, url }) => {
                const item = document.createElement('div');
                item.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border:1px solid ${colors.panelBorder};border-radius:6px;background:${colors.inputBg};gap:8px;`;
                
                if (url) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = title;
                    link.target = '_blank';
                    link.style.cssText = `font-size:12px;color:${colors.linkColor || '#3b82f6'};text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
                    link.addEventListener('mouseenter', () => link.style.textDecoration = 'underline');
                    link.addEventListener('mouseleave', () => link.style.textDecoration = 'none');
                    item.appendChild(link);
                } else {
                    const label = document.createElement('span');
                    label.textContent = title;
                    label.style.cssText = `font-size:12px;color:${colors.labelText};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
                    item.appendChild(label);
                }
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✖';
                deleteBtn.style.cssText = `padding:2px 8px;background:transparent;color:${colors.labelText};border:1px solid ${colors.inputBorder};border-radius:4px;cursor:pointer;font-size:11px;flex-shrink:0;opacity:0.6;transition:opacity 0.2s;`;
                deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.opacity = '1');
                deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.opacity = '0.6');
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Удалить настройки для "${title}"?`)) {
                        localStorage.removeItem(key);
                        SettingsUI.renderPostSettings(content, colors);
                        console.log('[Orbitar Replay] Deleted settings for post:', postId);
                    }
                });
                item.appendChild(deleteBtn);
                container.appendChild(item);
            });
        },
        factoryReset() {
            if (!confirm('Сбросить ВСЕ настройки скрипта? Это действие нельзя отменить.')) return;
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i += 1) {
                const key = localStorage.key(i);
                if (key && key.startsWith('orbitar_replay')) keysToRemove.push(key);
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('[Orbitar Replay] Factory reset completed. Removed keys:', keysToRemove);
            alert('Настройки сброшены. Страница будет перезагружена.');
            location.reload();
        }
    };

    const SettingsTemplates = {
        content(colors, hotkeys) {
            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
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
            wrapper.innerHTML = SettingsTemplates.markup(colors, hotkeys);
            return wrapper;
        },
        markup(colors, hotkeys) {
            const displayHotkey = value => Utils.normalizeHotkeyString(value);
            return `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div style="font-weight:700;font-size:18px;color:${colors.titleColor}">⚙️ Расширенные настройки</div>
                    <button id="settings_close" style="background:${colors.buttonSecondaryBg};color:${colors.panelText};border:1px solid ${colors.panelBorder};border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;">Закрыть</button>
                </div>
                <div style="line-height:1.6;color:${colors.panelText};font-size:13px;">
                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">⌨️ Системные хоткеи</div>
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">Кликните на поле, затем нажмите нужную комбинацию. Esc отменяет. Автосохранение.</div>
                        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px 16px;">
                            ${SettingsTemplates.hotkeyRow('Старт/пауза', 'playPause', displayHotkey(hotkeys.playPause), colors)}
                            ${SettingsTemplates.hotkeyRow('Шаг назад', 'stepPrev', displayHotkey(hotkeys.stepPrev), colors)}
                            ${SettingsTemplates.hotkeyRow('Шаг вперед', 'stepNext', displayHotkey(hotkeys.stepNext), colors)}
                            ${SettingsTemplates.hotkeyRow('↑ Задержка', 'delayUp', displayHotkey(hotkeys.delayUp), colors)}
                            ${SettingsTemplates.hotkeyRow('↓ Задержка', 'delayDown', displayHotkey(hotkeys.delayDown), colors)}
                            ${SettingsTemplates.hotkeyRow('Закрыть', 'closeOverlay', displayHotkey(hotkeys.closeOverlay), colors)}
                            ${SettingsTemplates.hotkeyRow('Вкл/выкл', 'toggleScript', displayHotkey(hotkeys.toggleScript), colors)}
                            ${SettingsTemplates.hotkeyRow('Слайдшоу', 'toggleSlideshow', displayHotkey(hotkeys.toggleSlideshow), colors)}
                            ${SettingsTemplates.hotkeyRow('Плюс коммент', 'voteUp', displayHotkey(hotkeys.voteUp), colors)}
                            ${SettingsTemplates.hotkeyRow('Минус коммент', 'voteDown', displayHotkey(hotkeys.voteDown), colors)}
                        </div>
                    </div>
                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">🎛️ Управление пресетами</div>
                        <div id="presets_list" style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px;"></div>
                    </div>
                    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px бордера ${colors.dividerColor};">
                        <div style="font-weight:600;margin-bottom:8px;color:${colors.titleColor};">📄 Настройки постов</div>
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">Посты с сохранёнными индивидуальными настройками</div>
                        <div id="post_settings_list" style="display:flex;flex-direction:column;gap:6px;"></div>
                    </div>
                    <div>
                        <div style="font-weight:600;margin-bottom:8px;color:#dc2626;">⚠️ Опасная зона</div>
                        <button id="factory_reset" style="padding:8px 16px;background:transparent;color:${colors.labelText};border:1px solid ${colors.inputBorder};border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;opacity:0.7;transition:opacity 0.2s;">🔄 Сброс настроек (Factory Reset)</button>
                        <div style="margin-top:6px;font-size:11px;opacity:0.7;">Удалит ВСЕ сохранённые настройки</div>
                    </div>
                </div>
            `;
        },
        hotkeyRow(label, key, value, colors) {
            return `
                <div style="display:grid;grid-template-columns:110px 1fr auto;gap:6px;align-items:center;">
                    <label style="font-size:12px;">${label}:</label>
                    <input class="hotkey-input" data-key="${key}" value="${value}" readonly style="padding:4px 8px;border:1px solid ${colors.inputBorder};border-radius:5px;background:${colors.inputBg};color:${colors.inputText};font-size:11px;cursor:pointer;">
                    <button class="hotkey-clear" data-key="${key}" style="padding:4px 8px;background:transparent;color:${colors.labelText};border:1px solid ${colors.inputBorder};border-radius:4px;cursor:pointer;font-size:11px;white-space:nowrap;opacity:0.6;" title="Очистить хоткей">✖</button>
                </div>
            `;
        },
        presetItem(preset, colors, contentRoot) {
            const item = document.createElement('div');
            // Check if this preset is active (either directly applied or matching current settings)
            const matchingPresetName = PanelUI.findMatchingPreset(Runtime.state.settings);
            const isActive = Runtime.state.currentPresetName === preset.name || 
                           (Runtime.state.currentPresetName === null && matchingPresetName === preset.name);
            const activeStyle = isActive ? `border:2px solid ${colors.primaryColor};background:${colors.inputBg};` : '';
            item.style.cssText = `padding:8px;border:1px solid ${colors.panelBorder};border-radius:6px;background:${colors.inputBg};${activeStyle}`;
            const header = document.createElement('div');
            header.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;';
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
                        Storage.presets.persist(Storage.presets.loadUser().filter(p => p.name !== preset.name));
                        Presets.upsert(newName, preset.state, {
                            hotkey: preset.hotkey,
                            showInMenu: preset.showInMenu,
                            menuLabel: preset.menuLabel
                        });
                        SettingsUI.renderPresets(contentRoot, colors);
                        ReplayIconUI.refresh();
                        PanelUI.refreshPresetButtons();
                    }
                });
                header.appendChild(nameInput);
            }
            if (!preset.isDefault) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✖';
                deleteBtn.style.cssText = `padding:2px 6px;background:transparent;color:${colors.labelText};border:1px solid ${colors.inputBorder};border-radius:4px;cursor:pointer;font-size:11px;opacity:0.6;transition:opacity 0.2s;`;
                deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.opacity = '1');
                deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.opacity = '0.6');
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Удалить пресет "${preset.name}"?`)) {
                        Storage.presets.persist(Storage.presets.loadUser().filter(p => p.name !== preset.name));
                        SettingsUI.renderPresets(contentRoot, colors);
                        ReplayIconUI.refresh();
                        PanelUI.refreshPresetButtons();
                    }
                });
                header.appendChild(deleteBtn);
            }
            item.appendChild(header);
            const controls = document.createElement('div');
            controls.style.cssText = 'display:grid;grid-template-columns:auto 1fr auto auto;gap:6px;align-items:center;font-size:12px;';
            const hotkeyLabel = document.createElement('span');
            hotkeyLabel.textContent = 'Хоткей:';
            hotkeyLabel.style.color = colors.labelText;
            const hotkeyInput = document.createElement('input');
            hotkeyInput.value = Utils.normalizeHotkeyString(preset.hotkey || '');
            hotkeyInput.placeholder = '1-2 символа';
            hotkeyInput.readOnly = true;
            hotkeyInput.style.cssText = `padding:3px 6px;border:1px solid ${colors.inputBorder};border-radius:4px;background:${colors.panelBg};color:${colors.inputText};font-size:11px;cursor:pointer;max-width:80px;`;
            const clearHotkeyBtn = document.createElement('button');
            clearHotkeyBtn.textContent = '✖';
            clearHotkeyBtn.style.cssText = `padding:2px 6px;background:transparent;color:${colors.labelText};border:1px solid ${colors.inputBorder};border-radius:4px;cursor:pointer;font-size:9px;opacity:0.6;transition:opacity 0.2s;`;
            clearHotkeyBtn.addEventListener('mouseenter', () => clearHotkeyBtn.style.opacity = '1');
            clearHotkeyBtn.addEventListener('mouseleave', () => clearHotkeyBtn.style.opacity = '0.6');
            clearHotkeyBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const oldValue = hotkeyInput.value;
                hotkeyInput.value = '';
                if (preset.isDefault) {
                    Presets.updateDefault(preset.name, { hotkey: '' });
                } else {
                    const list = Storage.presets.loadUser();
                    const idx = list.findIndex(p => p.name === preset.name);
                    if (idx >= 0) {
                        list[idx] = { ...list[idx], hotkey: '' };
                        Storage.presets.persist(list);
                    }
                }
                SettingsUI.renderPresets(contentRoot, colors);
                ReplayIconUI.refresh();
                PanelUI.refreshPresetButtons();
                clearHotkeyBtn.blur();
            });
            hotkeyInput.addEventListener('click', () => {
                const oldValue = hotkeyInput.value;
                HotkeyService.capture(hotkeyInput, hotkeyString => {
                    if (preset.isDefault) {
                        Presets.updateDefault(preset.name, { hotkey: hotkeyString });
                    } else {
                        const list = Storage.presets.loadUser();
                        const idx = list.findIndex(p => p.name === preset.name);
                        if (idx >= 0) {
                            list[idx] = { ...list[idx], hotkey: hotkeyString };
                            Storage.presets.persist(list);
                        }
                    }
                    SettingsUI.renderPresets(contentRoot, colors);
                    ReplayIconUI.refresh();
                    PanelUI.refreshPresetButtons();
                }, () => {
                    hotkeyInput.value = oldValue;
                });
            });
            const menuToggle = document.createElement('label');
            menuToggle.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;';
            const menuCheckbox = document.createElement('input');
            menuCheckbox.type = 'checkbox';
            menuCheckbox.checked = preset.showInMenu;
            menuCheckbox.style.cssText = 'width:14px;height:14px;cursor:pointer;';
            menuCheckbox.addEventListener('change', () => {
                if (preset.isDefault) {
                    Presets.updateDefault(preset.name, { showInMenu: menuCheckbox.checked });
                } else {
                    const list = Storage.presets.loadUser();
                    const idx = list.findIndex(p => p.name === preset.name);
                    if (idx >= 0) {
                        list[idx] = { ...list[idx], showInMenu: menuCheckbox.checked };
                        Storage.presets.persist(list);
                    }
                }
                SettingsUI.renderPresets(contentRoot, colors);
                ReplayIconUI.refresh();
                PanelUI.refreshPresetButtons();
            });
            const menuLabel = document.createElement('span');
            menuLabel.textContent = 'В меню';
            menuLabel.style.cssText = `color:${colors.labelText};font-size:11px;white-space:nowrap;`;
            menuToggle.appendChild(menuCheckbox);
            menuToggle.appendChild(menuLabel);
            controls.appendChild(hotkeyLabel);
            controls.appendChild(hotkeyInput);
            controls.appendChild(clearHotkeyBtn);
            controls.appendChild(menuToggle);
            item.appendChild(controls);
            return item;
        }
    };

    /* --------------------------------------------------------------------- */
    /* Playback Logic                                                        */
    /* --------------------------------------------------------------------- */

    const Playback = {
        initState() {
            const loaded = Storage.state.load();
            Runtime.state.settings = Object.assign({
                flash: true,
                delaySec: 3,
                slideshow: false,
                rootsOnly: false,
                imagesOnly: false,
                videosOnly: false,
                videosAutoplay: true,
                startFrom: null,
                loop: false
            }, loaded.settings || {});
            Runtime.state.settingsSource = loaded.source;
        },
        toggleScript(enable) {
            const wasEnabled = Runtime.state.scriptEnabled;
            Runtime.state.scriptEnabled = enable;
            if (enable && !wasEnabled) {
                Runtime.state.originalUrlOnEnable = location.href;
                if (location.search.includes('new')) {
                    const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'все комментарии');
                    if (link) link.click();
                }
            }
            if (!enable && wasEnabled) {
                Playback.setPlaying(false, 'script_disabled');
                if (Runtime.state.originalUrlOnEnable && Runtime.state.originalUrlOnEnable.includes('?new') && !location.search.includes('new')) {
                    const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'только новые');
                    if (link) link.click();
                }
                Runtime.state.originalUrlOnEnable = null;
            }
            ReplayIconUI.refresh();
            PanelUI.refreshPresetButtons();
            PanelUI.updateAutoButton();
            if (!enable) PanelUI.remove();
            if (Runtime.panel) {
                const toggleBtn = Runtime.panel.querySelector(`#${Config.dom.toggleIconId}`);
                if (toggleBtn) {
                    toggleBtn.innerHTML = enable ? '✓' : '✖';
                    toggleBtn.title = enable ? 'Скрипт включён' : 'Скрипт выключен';
                    toggleBtn.classList.toggle('off', !enable);
                }
                PanelUI.updateStatus(enable ? '✓ Скрипт включён' : '✖ Скрипт выключен');
            }
            console.log(`[Orbitar Replay] Script enabled: ${enable ? 'ON' : 'OFF'}`);
        },
        setPlaying(isPlaying, reason = '') {
            const wasPlaying = Runtime.state.playing;
            Runtime.state.playing = isPlaying;
            if (!isPlaying && Runtime.state.currentWait) {
                Runtime.state.currentWait.cancel(reason || 'manual');
                Runtime.state.currentWait = null;
            }
            PanelUI.updateAutoButton();
            OverlayUI.updateAutoIndicator();
            ReplayIconUI.updateBadge();
            if (wasPlaying && !isPlaying) {
                console.log(`[Orbitar Replay] Autoplay stopped (${reason || 'manual'})`);
            }
        },
        togglePlayPause() {
            if (!Runtime.state.scriptEnabled) {
                console.warn('[Orbitar Replay] Script is disabled, cannot play');
                return;
            }
            if (!Runtime.state.playing) {
                Playback.setPlaying(true, 'play_hotkey');
                if (!Runtime.state.list.length) {
                    PanelUI.rebuildList(false);
                    Runtime.state.currentIndex = -1;
                }
                if (Runtime.panel) {
                    PanelUI.hideAll(Runtime.state.list);
                    Runtime.state.autoCollapseTimeout = setTimeout(() => PanelUI.remove(), 300);
                } else {
                    PanelUI.hideAll(Runtime.state.list);
                }
                Playback.autoLoop();
            } else {
                Playback.setPlaying(false, 'manual_pause');
            }
        },
        autoLoop: async function autoLoop() {
            while (Runtime.state.playing) {
                Runtime.state.currentIndex += 1;
                if (Runtime.state.currentIndex >= Runtime.state.list.length) {
                    if (Runtime.state.settings.loop && Runtime.state.list.length > 0) {
                        Runtime.state.currentIndex = 0;
                    } else {
                        break;
                    }
                }
                const shown = await Playback.showOne(Runtime.state.currentIndex);
                if (!shown || !Runtime.state.playing) break;
            }
            Playback.setPlaying(false, 'autoplay_finished');
            if (Runtime.panel) PanelUI.updateAutoButton();
        },
        showOne(index, options = {}) {
            if (index < 0 || index >= Runtime.state.list.length) return false;
            const record = Runtime.state.list[index];
            const state = Runtime.state.settings;
            if (Runtime.panel && Runtime.panel._showOne && !options.throughPanel) {
                return Runtime.panel._showOne(index);
            }
            if (!state.slideshow) {
                // In timeline mode, show all comments from start to current index (replay effect)
                Runtime.state.list.forEach((entry, idx) => {
                    if (idx <= index) {
                        entry.elem.style.display = '';
                        entry.elem.style.visibility = 'visible';
                        entry.elem.style.opacity = '1';
                        entry.elem.style.pointerEvents = 'auto';
                        entry.elem.style.transition = '';
                        entry.elem.style.boxShadow = '';
                    } else {
                        entry.elem.style.display = 'none';
                    }
                });
                // Highlight and scroll to the current comment
                record.elem.style.visibility = 'hidden';
                record.elem.style.opacity = '0';
                record.elem.scrollIntoView({ behavior: 'smooth', block: state.rootsOnly ? 'start' : 'center' });
                setTimeout(() => {
                    record.elem.style.visibility = 'visible';
                    record.elem.style.opacity = '1';
                    record.elem.style.transition = 'opacity 0.25s';
                    if (state.flash) {
                        setTimeout(() => {
                            record.elem.style.boxShadow = '0 0 0 3px #28b0ff, 0 0 10px 2px #63cbff';
                            setTimeout(() => { record.elem.style.boxShadow = ''; }, 500);
                        }, 200);
                    }
                }, 600);
                ReplayIconUI.updateBadge();
                const delayPromise = new Promise(resolve => setTimeout(resolve, state.delaySec * 1000));
                Runtime.state.currentWait = Playback.cancellableWaiter();
                return Promise.race([delayPromise, Runtime.state.currentWait.promise]).catch(() => false).finally(() => {
                    Runtime.state.currentWait = null;
                }).then(() => true);
            }
            const mediaItems = PanelUI.getAllMedia(record.elem);
            if (!mediaItems.length) {
                return Playback.showTextSlide(record.elem, index);
            }
            return Playback.showMediaSlides(mediaItems, record.elem, index);
        },
        cancellableWaiter() {
            let cancel;
            const promise = new Promise((resolve, reject) => {
                cancel = reason => reject(new Error(String(reason || 'cancelled')));
            });
            return { promise, cancel };
        },
        showTextSlide(elem, index) {
            const content = elem.querySelector('.ContentComponent_content__Mg-dN .ContentComponent_content__lc9BO')
                || elem.querySelector('.ContentComponent_content__lc9BO');
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                color: '#fff', maxWidth: '80vw', maxHeight: '70vh', overflow: 'auto',
                fontSize: '18px', lineHeight: '1.4', padding: '16px', borderRadius: '10px',
                background: 'rgba(0,0,0,.35)'
            });
            wrap.innerHTML = content?.innerHTML || '(нет содержимого)';
            OverlayUI.open(wrap);
            OverlayUI.setHeaderText(`${index + 1} / ${Runtime.state.list.length}`);
            OverlayUI.updateAutoIndicator();
            ReplayIconUI.updateBadge();
            const delayPromise = new Promise(resolve => setTimeout(resolve, Runtime.state.settings.delaySec * 1000));
            Runtime.state.currentWait = Playback.cancellableWaiter();
            return Promise.race([delayPromise, Runtime.state.currentWait.promise]).catch(() => false).finally(() => {
                Runtime.state.currentWait = null;
            }).then(() => true);
        },
        showMediaSlides(mediaItems, elem, index) {
            const processMediaItem = async (mediaItem, mediaIndex) => {
                let slide;
                if (mediaItem.type === 'image') {
                    slide = { node: Media.buildImageNode(mediaItem.element), waiterPromise: new Promise(resolve => setTimeout(resolve, Runtime.state.settings.delaySec * 1000)) };
                } else if (mediaItem.type === 'mp4' || mediaItem.type === 'mp4-rendered') {
                    const { wrap, video, ok } = Media.buildVideoNodeFromMp4(elem, Runtime.state.settings.videosAutoplay, true);
                    if (!ok) return;
                    slide = {
                        node: wrap,
                        waiterPromise: new Promise(resolve => video.addEventListener('ended', resolve, { once: true }))
                    };
                    setTimeout(() => {
                        if (Runtime.state.settings.videosAutoplay) {
                            try { video.play().catch(() => { /* ignore */ }); } catch { /* ignore */ }
                        }
                    }, 50);
                } else if (mediaItem.type === 'youtube') {
                    const yt = Media.buildYouTubeNode(elem, Runtime.state.settings.videosAutoplay);
                    if (!yt.ok) return;
                    slide = {
                        node: yt.wrap,
                        waiterPromise: new Promise(resolve => {
                            const interval = setInterval(() => {
                                try {
                                    if (Runtime.overlay.youtubePlayer && typeof Runtime.overlay.youtubePlayer.getPlayerState === 'function') {
                                        if (Runtime.overlay.youtubePlayer.getPlayerState() === 0) {
                                            clearInterval(interval);
                                            resolve();
                                        }
                                    }
                                } catch { /* ignore */ }
                            }, 500);
                        })
                    };
                    setTimeout(() => {
                        yt.init().catch(() => { /* ignore */ });
                    }, 0);
                }
                if (!slide) return;
                OverlayUI.open(slide.node);
                const suffix = mediaItems.length > 1 ? ` [${mediaIndex + 1}/${mediaItems.length}]` : '';
                OverlayUI.setHeaderText(`${index + 1} / ${Runtime.state.list.length}${suffix}`);
                OverlayUI.updateAutoIndicator();
                ReplayIconUI.updateBadge();
                Runtime.state.currentWait = Playback.cancellableWaiter();
                try {
                    await Promise.race([slide.waiterPromise, Runtime.state.currentWait.promise]);
                } catch { /* ignore cancellation */ }
                Runtime.state.currentWait = null;
            };
            return (async () => {
                for (let mediaIdx = 0; mediaIdx < mediaItems.length; mediaIdx += 1) {
                    await processMediaItem(mediaItems[mediaIdx], mediaIdx);
                    if (!Runtime.state.playing && mediaIdx < mediaItems.length - 1) break;
                }
                return true;
            })();
        },
        adjustDelay(delta) {
            Runtime.state.settings.delaySec = Math.max(1, Math.min(60, Runtime.state.settings.delaySec + delta));
            Storage.state.save(Runtime.state.settings);
            OverlayUI.updateDelayDisplay();
            const delayInput = Runtime.panel?.querySelector('#replay_delay');
            if (delayInput) delayInput.value = Runtime.state.settings.delaySec;
            PanelUI.updateAutoButton();
            ReplayIconUI.updateBadge();
        }
    };

    /* --------------------------------------------------------------------- */
    /* Event & Hotkey wiring                                                 */
    /* --------------------------------------------------------------------- */

    const Hotkeys = {
        setupGlobalToggleHandler() {
            if (Runtime.watchers.globalToggleHandler) window.removeEventListener('keydown', Runtime.watchers.globalToggleHandler);
            Runtime.watchers.globalToggleHandler = event => {
                if (!Pages.isPostPage()) return;
                if (Runtime.state.hotkeyCapturing?.active) return;
                const targetTag = (event.target.tagName || '').toLowerCase();
                if (targetTag === 'input' || targetTag === 'textarea') return;
                if (HotkeyService.matches(event, Runtime.hotkeys.toggleScript)) {
                    event.preventDefault();
                    Playback.toggleScript(!Runtime.state.scriptEnabled);
                    if (Runtime.panel) {
                        const autoBtn = Runtime.panel.querySelector('#btn_auto');
                        if (autoBtn && !Runtime.state.playing) {
                            autoBtn.textContent = '▶️ Старт';
                            autoBtn.classList.remove('playing');
                        }
                        OverlayUI.updateAutoIndicator();
                    }
                    return;
                }
                if (Runtime.state.scriptEnabled) {
                    const presets = Presets.loadAll();
                    for (const preset of presets) {
                        if (preset.hotkey && HotkeyService.matches(event, preset.hotkey)) {
                            event.preventDefault();
                            Playback.applyPreset(preset);
                            console.log(`[Orbitar Replay] Preset hotkey activated: ${preset.name}`);
                            return;
                        }
                    }
                }
            };
            window.addEventListener('keydown', Runtime.watchers.globalToggleHandler);
        },
        setupMainHotkeys() {
            if (Runtime.watchers.mainHotkeyHandler) window.removeEventListener('keydown', Runtime.watchers.mainHotkeyHandler);
            Runtime.watchers.mainHotkeyHandler = event => {
                if (HotkeyService.matches(event, Runtime.hotkeys.toggleScript)) return;
                if (!Runtime.state.scriptEnabled) return;
                if (Runtime.state.hotkeyCapturing?.active) return;
                const tag = (event.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea') return;
                const overlayActive = OverlayUI.isOpen();
                if (HotkeyService.matches(event, Runtime.hotkeys.playPause)) {
                    event.preventDefault();
                    Playback.togglePlayPause();
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.stepNext)) {
                    event.preventDefault();
                    Playback.dispatchNext();
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.stepPrev)) {
                    event.preventDefault();
                    Playback.dispatchPrev();
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.delayUp)) {
                    if (Runtime.state.scriptEnabled || overlayActive) {
                        event.preventDefault();
                        Playback.adjustDelay(1);
                    }
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.delayDown)) {
                    if (Runtime.state.scriptEnabled || overlayActive) {
                        event.preventDefault();
                        Playback.adjustDelay(-1);
                    }
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.closeOverlay)) {
                    event.preventDefault();
                    if (Runtime.settings.modal) return;
                    if (Runtime.panel && !overlayActive) PanelUI.remove();
                    else if (overlayActive) {
                        Playback.setPlaying(false, 'overlay_hotkey_close');
                        OverlayUI.close();
                        // Restore visibility of all comments after closing overlay
                        if (Runtime.state.list && Runtime.state.list.length > 0) {
                            PanelUI.showAll(Runtime.state.list);
                        }
                    } else {
                        OverlayUI.close();
                    }
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.voteUp)) {
                    console.log('[Orbitar Replay] Vote UP hotkey matched, overlayActive:', overlayActive, 'scriptEnabled:', Runtime.state.scriptEnabled);
                    if (overlayActive || Runtime.state.scriptEnabled) {
                        event.preventDefault();
                        Voting.voteUp();
                    }
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.voteDown)) {
                    console.log('[Orbitar Replay] Vote DOWN hotkey matched, overlayActive:', overlayActive, 'scriptEnabled:', Runtime.state.scriptEnabled);
                    if (overlayActive || Runtime.state.scriptEnabled) {
                        event.preventDefault();
                        Voting.voteDown();
                    }
                    return;
                }
                if (HotkeyService.matches(event, Runtime.hotkeys.toggleSlideshow)) {
                    event.preventDefault();
                    Runtime.state.settings.slideshow = !Runtime.state.settings.slideshow;
                    console.log(`[Orbitar Replay] Slideshow mode: ${Runtime.state.settings.slideshow ? 'ON' : 'OFF'}`);
                }
            };
            window.addEventListener('keydown', Runtime.watchers.mainHotkeyHandler);
        }
    };

    /* --------------------------------------------------------------------- */
    /* SPA Navigation watcher                                                */
    /* --------------------------------------------------------------------- */

    const NavigationWatcher = {
        start() {
            Runtime.watchers.urlInterval = setInterval(NavigationWatcher.checkUrl, 500);
            window.addEventListener('popstate', NavigationWatcher.checkUrl);
            window.addEventListener('hashchange', NavigationWatcher.checkUrl);
            window.addEventListener('beforeunload', NavigationWatcher.cleanup);
        },
        checkUrl() {
            const currentUrl = location.href;
            if (currentUrl === NavigationWatcher.lastUrl) return;
            NavigationWatcher.lastUrl = currentUrl;
            const newPostId = Pages.getCurrentPostId();
            if (Runtime.state.scriptEnabled && (newPostId !== Runtime.state.currentPostIdTracked || !newPostId)) {
                console.log('[Orbitar Replay] Post changed, auto-disabling script');
                Playback.toggleScript(false);
            }
            Runtime.state.currentPostIdTracked = newPostId;
            if (Pages.isPostPage()) {
                ReplayIconUI.observe();
                Hotkeys.setupGlobalToggleHandler();
                Hotkeys.setupMainHotkeys();
            } else {
                if (Runtime.icon.observer) {
                    Runtime.icon.observer.disconnect();
                    Runtime.icon.observer = null;
                }
                PanelUI.remove();
                Playback.setPlaying(false, 'navigation');
            }
        },
        cleanup() {
            PanelUI.remove();
            window.removeEventListener('keydown', Runtime.watchers.mainHotkeyHandler);
            window.removeEventListener('keydown', Runtime.watchers.globalToggleHandler);
            Playback.setPlaying(false, 'cleanup');
        },
        lastUrl: location.href
    };

    /* --------------------------------------------------------------------- */
    /* Main App bootstrap                                                     */
    /* --------------------------------------------------------------------- */

    const App = {
        init() {
            console.log('[Orbitar Replay] Initializing app...');
            ApiInterceptor.init();
            Playback.initState();
            HotkeyService.load();
            Hotkeys.setupGlobalToggleHandler();
            Hotkeys.setupMainHotkeys();
            ReplayIconUI.observe();
            NavigationWatcher.start();
            Runtime.state.currentPostIdTracked = Pages.getCurrentPostId();
            Voting.test();
            console.log('[Orbitar Replay] Vote hotkeys loaded:', { 
                voteUp: Runtime.hotkeys.voteUp, 
                voteDown: Runtime.hotkeys.voteDown 
            });
            if (Pages.isPostPage()) {
                ReplayIconUI.insert();
            }
        }
    };

    const PanelUIHelpers = PanelUI; // keep for nested references

    // Extend PanelUI with helper methods that require circular references
    PanelUI.getAllMedia = function getAllMedia(div) {
        const content = div.querySelector('.ContentComponent_content__Mg-dN .ContentComponent_content__lc9BO')
            || div.querySelector('.ContentComponent_content__lc9BO');
        const items = [];
        if (!Runtime.state.settings.videosOnly) {
            const images = content ? Array.from(content.querySelectorAll('img.image-large, img.image-scalable, img')) : [];
            images.forEach(img => {
                const parent = img.closest('a.video-embed, a.youtube-embed, .youtube-embed-processed');
                if (!parent) items.push({ type: 'image', element: img });
            });
        }
        if (!Runtime.state.settings.imagesOnly) {
            const videoEmbeds = content ? Array.from(content.querySelectorAll('a.video-embed img[data-video]')) : [];
            videoEmbeds.forEach(embed => items.push({ type: 'mp4', element: embed }));
            const videos = content ? Array.from(content.querySelectorAll('video')) : [];
            videos.forEach(video => items.push({ type: 'mp4-rendered', element: video }));
            const youtubeEmbeds = content ? Array.from(content.querySelectorAll('img[data-youtube], a.youtube-embed, .youtube-embed-processed')) : [];
            youtubeEmbeds.forEach(yt => items.push({ type: 'youtube', element: yt }));
        }
        return items;
    };

    PanelUI.showOne = Playback.showOne;
    PanelUI.rebuildList = PanelUI.rebuildList.bind(PanelUI);

    Playback.dispatchNext = function dispatchNext() {
        if (!Runtime.state.scriptEnabled) {
            console.warn('[Orbitar Replay] Script is disabled, cannot navigate');
            return;
        }
        Playback.setPlaying(false, 'manual_next');
        if (!Runtime.state.list.length) {
            PanelUI.rebuildList(false);
            PanelUI.hideAll(Runtime.state.list);
        }
        if (!Runtime.state.list.length) {
            console.warn('[Orbitar Replay] List is empty after rebuild');
            return;
        }
        if (Runtime.panel) PanelUI.hideAll(Runtime.state.list);
        Runtime.state.currentIndex += 1;
        if (Runtime.state.currentIndex >= Runtime.state.list.length) {
            Runtime.state.currentIndex = Runtime.state.settings.loop ? 0 : Runtime.state.list.length - 1;
            if (!Runtime.state.settings.loop) return;
        }
        Playback.showOne(Runtime.state.currentIndex);
        ReplayIconUI.updateBadge();
    };

    Playback.dispatchPrev = function dispatchPrev() {
        if (!Runtime.state.scriptEnabled) {
            console.warn('[Orbitar Replay] Script is disabled, cannot navigate');
            return;
        }
        Playback.setPlaying(false, 'manual_prev');
        if (!Runtime.state.list.length) return;
        if (Runtime.panel) PanelUI.hideAll(Runtime.state.list);
        Runtime.state.currentIndex -= 1;
        if (Runtime.state.currentIndex < 0) {
            Runtime.state.currentIndex = Runtime.state.settings.loop ? Runtime.state.list.length - 1 : 0;
            if (!Runtime.state.settings.loop) return;
        }
        Playback.showOne(Runtime.state.currentIndex);
        ReplayIconUI.updateBadge();
    };

    Playback.togglePlayPause = Playback.togglePlayPause.bind(Playback);
    Playback.applyPreset = function (preset) {
        Runtime.state.currentPresetName = preset.name;
        Runtime.state.settingsSource = 'preset';
        Runtime.state.settings = Presets.cloneState(preset.state);
        
        // Rebuild list with new filters (always, even if panel is closed)
        const filters = {
            rootsOnly: Runtime.state.settings.rootsOnly,
            imagesOnly: Runtime.state.settings.imagesOnly,
            videosOnly: Runtime.state.settings.videosOnly,
            startFrom: Runtime.state.settings.startFrom
        };
        Runtime.state.list = Comments.collectSorted(filters);
        Runtime.state.currentIndex = -1;
        
        if (Runtime.panel) {
            // Update all toggles to match preset settings
            const updateToggle = (id, checked) => {
                const checkbox = Runtime.panel.querySelector(`#check_${id}`);
                const toggleSwitch = Runtime.panel.querySelector(`.orbitar-toggle-switch[data-for="check_${id}"]`);
                if (checkbox) checkbox.checked = checked;
                if (toggleSwitch) {
                    if (checked) toggleSwitch.classList.add('active');
                    else toggleSwitch.classList.remove('active');
                }
            };
            
            updateToggle('flash', Runtime.state.settings.flash);
            updateToggle('slideshow', Runtime.state.settings.slideshow);
            updateToggle('roots', Runtime.state.settings.rootsOnly);
            updateToggle('images', Runtime.state.settings.imagesOnly);
            updateToggle('videos', Runtime.state.settings.videosOnly);
            updateToggle('videos_autoplay', Runtime.state.settings.videosAutoplay);
            updateToggle('loop', Runtime.state.settings.loop);
            
            // Update delay input
            const delayInput = Runtime.panel.querySelector('#replay_delay');
            if (delayInput) delayInput.value = Runtime.state.settings.delaySec;
            
            // Update status text for slideshow mode
            const statusDiv = Runtime.panel.querySelector('#replay_status');
            if (statusDiv) {
                statusDiv.textContent = Runtime.state.settings.slideshow ? 'Слайд-шоу' : 'Режим страницы';
            }
            
            PanelUI.refreshPresetButtons();
            PanelUI.hideAll(Runtime.state.list);
            PanelUI.updateStatus(`Пресет: ${preset.name} (${Runtime.state.list.length} комментариев)`);
            PanelUI.updateAutoButton();
        }
        
        ReplayIconUI.updateBadge();
        ReplayIconUI.refresh();
    };

    // initialize playback state from storage
    Playback.initState();
    Runtime.state.settings.delaySec = Runtime.state.settings.delaySec || 3;
    Runtime.state.settings.flash = Runtime.state.settings.flash !== false;

    // assign to storage state for convenience
    Runtime.state.settings = Runtime.state.settings;

    // Kick things off
    App.init();
})();
