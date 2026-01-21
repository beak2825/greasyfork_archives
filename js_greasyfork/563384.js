// ==UserScript==
// @name         CheatGuessr PRO v5 | Phantom Edition
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Ultimate GeoGuessr Enhancement. Ghost Mode, Multi-Legit Presets, Auto-Pan, Streamer Safe.
// @author       GeoCheater
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/563384/CheatGuessr%20PRO%20v5%20%7C%20Phantom%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/563384/CheatGuessr%20PRO%20v5%20%7C%20Phantom%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CORE STATE
    // ═══════════════════════════════════════════════════════════════

    let globalCoordinates = { lat: 0, lng: 0 };
    let roundHistory = [];
    let isLocked = false;
    let isPanelVisible = true;
    let currentRound = 0;
    let totalScore = 0;

    // ═══════════════════════════════════════════════════════════════
    // PRESETS CONFIG
    // ═══════════════════════════════════════════════════════════════

    const PRESETS = {
        ghost:    { name: "👻 Ghost",      min: 100, max: 300,  desc: "Undetectable" },
        ultra:    { name: "🛡️ Ultra Safe", min: 50,  max: 150,  desc: "Tournament Safe" },
        legit:    { name: "🎮 Legit",      min: 10,  max: 50,   desc: "Casual Play" },
        tryhard:  { name: "⚡ Tryhard",    min: 3,   max: 15,   desc: "Competitive" },
        rage:     { name: "💀 Rage",       min: 0.5, max: 5,    desc: "Risk Mode" },
        sniper:   { name: "🎯 Sniper",     min: 0,   max: 0.1,  desc: "Perfect Shot" }
    };

    let currentPreset = 'legit';

    const KEYBINDS = {
        togglePanel: 'Backquote',  // `
        safeGuess: 'Space',
        perfectGuess: 'KeyE',
        hint: 'KeyH',
        copyCoords: 'KeyC',
        panic: 'Escape',
        nextPreset: 'Tab'
    };

    // ═══════════════════════════════════════════════════════════════
    // STYLES - GLASSMORPHISM DARK THEME
    // ═══════════════════════════════════════════════════════════════

    const injectStyles = () => {
        const css = document.createElement('style');
        css.id = 'phantom-styles';
        css.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Inter:wght@400;500;600;700&display=swap');

            :root {
                --ph-bg: rgba(10, 10, 15, 0.92);
                --ph-bg-solid: #0a0a0f;
                --ph-surface: rgba(25, 25, 35, 0.8);
                --ph-surface-hover: rgba(35, 35, 50, 0.9);
                --ph-border: rgba(255, 255, 255, 0.08);
                --ph-border-active: rgba(139, 92, 246, 0.5);
                --ph-primary: #8b5cf6;
                --ph-primary-glow: rgba(139, 92, 246, 0.4);
                --ph-secondary: #06b6d4;
                --ph-success: #10b981;
                --ph-warning: #f59e0b;
                --ph-danger: #ef4444;
                --ph-text: #f1f5f9;
                --ph-text-dim: #64748b;
                --ph-text-muted: #475569;
                --ph-gold: linear-gradient(135deg, #f59e0b, #fbbf24);
                --ph-rainbow: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
            }

            /* ══════ PANEL ══════ */
            .ph-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 320px;
                background: var(--ph-bg);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border: 1px solid var(--ph-border);
                border-radius: 16px;
                color: var(--ph-text);
                z-index: 999999;
                font-family: 'Inter', -apple-system, sans-serif;
                box-shadow:
                    0 25px 50px -12px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                    0 0 80px -20px var(--ph-primary-glow);
                transform: translateX(0);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
            }

            .ph-panel.hidden {
                transform: translateX(calc(100% + 40px));
                opacity: 0;
                pointer-events: none;
            }

            .ph-panel.minimized {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
            }

            .ph-panel.minimized .ph-content,
            .ph-panel.minimized .ph-header-text,
            .ph-panel.minimized .ph-header-controls { display: none; }

            /* ══════ HEADER ══════ */
            .ph-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1));
                border-bottom: 1px solid var(--ph-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
            }

            .ph-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--ph-rainbow);
            }

            .ph-logo {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .ph-logo-icon {
                width: 32px;
                height: 32px;
                background: var(--ph-rainbow);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 4px 15px var(--ph-primary-glow);
            }

            .ph-title {
                font-family: 'JetBrains Mono', monospace;
                font-weight: 800;
                font-size: 14px;
                letter-spacing: 1.5px;
                background: var(--ph-rainbow);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .ph-version {
                font-size: 10px;
                color: var(--ph-text-dim);
                font-weight: 500;
            }

            .ph-header-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .ph-status {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: var(--ph-danger);
                transition: all 0.3s ease;
                position: relative;
            }

            .ph-status.active {
                background: var(--ph-success);
                box-shadow: 0 0 15px var(--ph-success);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 15px var(--ph-success); }
                50% { box-shadow: 0 0 25px var(--ph-success), 0 0 40px var(--ph-success); }
            }

            .ph-minimize-btn {
                width: 28px;
                height: 28px;
                border: none;
                background: var(--ph-surface);
                border-radius: 8px;
                color: var(--ph-text-dim);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .ph-minimize-btn:hover {
                background: var(--ph-surface-hover);
                color: var(--ph-text);
            }

            /* ══════ CONTENT ══════ */
            .ph-content {
                padding: 16px;
            }

            /* ══════ STATS BAR ══════ */
            .ph-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 16px;
            }

            .ph-stat {
                background: var(--ph-surface);
                border: 1px solid var(--ph-border);
                border-radius: 10px;
                padding: 10px;
                text-align: center;
                transition: all 0.2s ease;
            }

            .ph-stat:hover {
                border-color: var(--ph-border-active);
                transform: translateY(-2px);
            }

            .ph-stat-value {
                font-family: 'JetBrains Mono', monospace;
                font-size: 18px;
                font-weight: 700;
                color: var(--ph-primary);
            }

            .ph-stat-label {
                font-size: 10px;
                color: var(--ph-text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
            }

            /* ══════ COORDINATES DISPLAY ══════ */
            .ph-coords-box {
                background: var(--ph-bg-solid);
                border: 1px solid var(--ph-border);
                border-radius: 12px;
                padding: 14px;
                margin-bottom: 16px;
                position: relative;
                overflow: hidden;
            }

            .ph-coords-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: var(--ph-danger);
                transition: background 0.3s ease;
            }

            .ph-coords-box.locked::before {
                background: var(--ph-success);
            }

            .ph-coords-label {
                font-size: 10px;
                color: var(--ph-text-muted);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .ph-coords-value {
                font-family: 'JetBrains Mono', monospace;
                font-size: 15px;
                font-weight: 600;
                color: var(--ph-text);
                letter-spacing: 0.5px;
            }

            .ph-coords-value.waiting {
                color: var(--ph-text-dim);
                font-style: italic;
            }

            .ph-coords-actions {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                gap: 6px;
            }

            .ph-icon-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--ph-border);
                background: var(--ph-surface);
                border-radius: 8px;
                color: var(--ph-text-dim);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .ph-icon-btn:hover {
                border-color: var(--ph-primary);
                color: var(--ph-primary);
                background: rgba(139, 92, 246, 0.1);
            }

            /* ══════ PRESET SELECTOR ══════ */
            .ph-preset-section {
                margin-bottom: 16px;
            }

            .ph-section-label {
                font-size: 11px;
                color: var(--ph-text-muted);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .ph-preset-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }

            .ph-preset {
                background: var(--ph-surface);
                border: 1px solid var(--ph-border);
                border-radius: 10px;
                padding: 10px 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ph-preset:hover {
                background: var(--ph-surface-hover);
                border-color: var(--ph-border-active);
                transform: translateY(-2px);
            }

            .ph-preset.active {
                background: rgba(139, 92, 246, 0.2);
                border-color: var(--ph-primary);
                box-shadow: 0 0 20px var(--ph-primary-glow);
            }

            .ph-preset-icon {
                font-size: 18px;
                margin-bottom: 4px;
            }

            .ph-preset-name {
                font-size: 10px;
                font-weight: 600;
                color: var(--ph-text);
            }

            .ph-preset-range {
                font-size: 9px;
                color: var(--ph-text-dim);
                font-family: 'JetBrains Mono', monospace;
            }

            /* ══════ ACTION BUTTONS ══════ */
            .ph-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .ph-btn {
                position: relative;
                padding: 14px 20px;
                border: 1px solid var(--ph-border);
                background: var(--ph-surface);
                color: var(--ph-text);
                border-radius: 12px;
                cursor: pointer;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.25s ease;
                overflow: hidden;
            }

            .ph-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.5s ease;
            }

            .ph-btn:hover::before {
                left: 100%;
            }

            .ph-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .ph-btn:active {
                transform: translateY(0);
            }

            .ph-btn.primary {
                background: linear-gradient(135deg, var(--ph-primary), #7c3aed);
                border: none;
                box-shadow: 0 4px 20px var(--ph-primary-glow);
            }

            .ph-btn.primary:hover {
                box-shadow: 0 8px 30px var(--ph-primary-glow);
            }

            .ph-btn.gold {
                background: var(--ph-gold);
                border: none;
                color: #000;
            }

            .ph-btn.gold:hover {
                box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
            }

            .ph-btn-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .ph-btn .ph-kbd {
                position: absolute;
                right: 12px;
                font-size: 10px;
                padding: 3px 6px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                opacity: 0.7;
            }

            /* ══════ FOOTER ══════ */
            .ph-footer {
                margin-top: 16px;
                padding-top: 12px;
                border-top: 1px solid var(--ph-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ph-footer-text {
                font-size: 10px;
                color: var(--ph-text-muted);
            }

            .ph-footer-links {
                display: flex;
                gap: 12px;
            }

            .ph-footer-link {
                font-size: 10px;
                color: var(--ph-text-dim);
                text-decoration: none;
                transition: color 0.2s;
                cursor: pointer;
            }

            .ph-footer-link:hover {
                color: var(--ph-primary);
            }

            /* ══════ TOAST ══════ */
            .ph-toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--ph-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--ph-border);
                padding: 12px 24px;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999999;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .ph-toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }

            .ph-toast-icon {
                font-size: 16px;
            }

            .ph-toast-text {
                font-size: 13px;
                font-weight: 500;
                color: var(--ph-text);
            }

            .ph-toast.success { border-color: var(--ph-success); }
            .ph-toast.success .ph-toast-icon { color: var(--ph-success); }

            .ph-toast.warning { border-color: var(--ph-warning); }
            .ph-toast.warning .ph-toast-icon { color: var(--ph-warning); }

            .ph-toast.error { border-color: var(--ph-danger); }
            .ph-toast.error .ph-toast-icon { color: var(--ph-danger); }

            /* ══════ HINT MODAL ══════ */
            .ph-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 9999998;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .ph-modal-overlay.show {
                opacity: 1;
                pointer-events: all;
            }

            .ph-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: var(--ph-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--ph-border);
                border-radius: 20px;
                padding: 24px;
                z-index: 9999999;
                min-width: 350px;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .ph-modal.show {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                pointer-events: all;
            }

            .ph-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .ph-modal-title {
                font-size: 18px;
                font-weight: 700;
                color: var(--ph-text);
            }

            .ph-modal-close {
                width: 32px;
                height: 32px;
                border: none;
                background: var(--ph-surface);
                border-radius: 8px;
                color: var(--ph-text-dim);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .ph-modal-close:hover {
                background: var(--ph-danger);
                color: white;
            }

            .ph-hint-content {
                background: var(--ph-surface);
                border-radius: 12px;
                padding: 16px;
            }

            .ph-hint-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid var(--ph-border);
            }

            .ph-hint-row:last-child {
                border-bottom: none;
            }

            .ph-hint-label {
                color: var(--ph-text-dim);
                font-size: 12px;
            }

            .ph-hint-value {
                color: var(--ph-text);
                font-weight: 600;
                font-size: 13px;
            }

            /* ══════ KEYBINDS HELP ══════ */
            .ph-keybinds {
                display: none;
                margin-top: 12px;
                padding: 12px;
                background: var(--ph-surface);
                border-radius: 10px;
                border: 1px solid var(--ph-border);
            }

            .ph-keybinds.show {
                display: block;
            }

            .ph-keybind-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                font-size: 11px;
            }

            .ph-keybind-action {
                color: var(--ph-text-dim);
            }

            .ph-keybind-key {
                font-family: 'JetBrains Mono', monospace;
                background: var(--ph-bg-solid);
                padding: 2px 8px;
                border-radius: 4px;
                color: var(--ph-primary);
            }

            /* ══════ STREAMER MODE ══════ */
            .ph-panel.streamer-mode {
                opacity: 0.3;
            }

            .ph-panel.streamer-mode:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(css);
    };

    // ═══════════════════════════════════════════════════════════════
    // UI BUILDER
    // ═══════════════════════════════════════════════════════════════

    const buildUI = () => {
        const panel = document.createElement('div');
        panel.className = 'ph-panel';
        panel.id = 'phantom-panel';

        panel.innerHTML = `
            <!-- HEADER -->
            <div class="ph-header">
                <div class="ph-logo">
                    <div class="ph-logo-icon">👻</div>
                    <div class="ph-header-text">
                        <div class="ph-title">PHANTOM</div>
                        <div class="ph-version">v5.0 PRO</div>
                    </div>
                </div>
                <div class="ph-header-controls">
                    <div class="ph-status" id="ph-status" title="Waiting for coordinates..."></div>
                    <button class="ph-minimize-btn" id="ph-minimize" title="Minimize">─</button>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="ph-content">
                <!-- STATS -->
                <div class="ph-stats">
                    <div class="ph-stat">
                        <div class="ph-stat-value" id="ph-round">0</div>
                        <div class="ph-stat-label">Round</div>
                    </div>
                    <div class="ph-stat">
                        <div class="ph-stat-value" id="ph-score">0</div>
                        <div class="ph-stat-label">Score</div>
                    </div>
                    <div class="ph-stat">
                        <div class="ph-stat-value" id="ph-accuracy">--</div>
                        <div class="ph-stat-label">Avg KM</div>
                    </div>
                </div>

                <!-- COORDINATES -->
                <div class="ph-coords-box" id="ph-coords-box">
                    <div class="ph-coords-label">
                        <span>📍</span>
                        <span>TARGET COORDINATES</span>
                    </div>
                    <div class="ph-coords-value waiting" id="ph-coords">Waiting for round...</div>
                    <div class="ph-coords-actions">
                        <button class="ph-icon-btn" id="ph-copy" title="Copy coords">📋</button>
                        <button class="ph-icon-btn" id="ph-maps" title="Open in Maps">🗺️</button>
                    </div>
                </div>

                <!-- PRESETS -->
                <div class="ph-preset-section">
                    <div class="ph-section-label">
                        <span>ACCURACY MODE</span>
                        <span style="color: var(--ph-primary); cursor: pointer;" id="ph-toggle-keys">⌨️</span>
                    </div>
                    <div class="ph-preset-grid" id="ph-presets">
                        ${Object.entries(PRESETS).map(([key, preset]) => `
                            <div class="ph-preset ${key === currentPreset ? 'active' : ''}" data-preset="${key}">
                                <div class="ph-preset-icon">${preset.name.split(' ')[0]}</div>
                                <div class="ph-preset-name">${preset.name.split(' ')[1]}</div>
                                <div class="ph-preset-range">${preset.min}-${preset.max}km</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- KEYBINDS (Hidden by default) -->
                    <div class="ph-keybinds" id="ph-keybinds">
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Toggle Panel</span>
                            <span class="ph-keybind-key">\`</span>
                        </div>
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Smart Guess</span>
                            <span class="ph-keybind-key">Space</span>
                        </div>
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Perfect 5K</span>
                            <span class="ph-keybind-key">E</span>
                        </div>
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Hint</span>
                            <span class="ph-keybind-key">H</span>
                        </div>
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Copy Coords</span>
                            <span class="ph-keybind-key">C</span>
                        </div>
                        <div class="ph-keybind-row">
                            <span class="ph-keybind-action">Panic Hide</span>
                            <span class="ph-keybind-key">Esc</span>
                        </div>
                    </div>
                </div>

                <!-- ACTIONS -->
                <div class="ph-actions">
                    <button class="ph-btn primary" id="ph-guess">
                        🎲 SMART GUESS
                        <span class="ph-kbd">Space</span>
                    </button>
                    <button class="ph-btn gold" id="ph-perfect">
                        🎯 PERFECT 5K
                        <span class="ph-kbd">E</span>
                    </button>
                    <div class="ph-btn-row">
                        <button class="ph-btn" id="ph-hint">
                            💡 Hint
                        </button>
                        <button class="ph-btn" id="ph-history">
                            📜 History
                        </button>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="ph-footer">
                    <span class="ph-footer-text">Ghost Mode Active</span>
                    <div class="ph-footer-links">
                        <span class="ph-footer-link" id="ph-streamer">🎬 Streamer</span>
                        <span class="ph-footer-link" id="ph-reset">🔄 Reset</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'ph-modal-overlay';
        overlay.id = 'ph-overlay';
        document.body.appendChild(overlay);

        // Hint modal
        const modal = document.createElement('div');
        modal.className = 'ph-modal';
        modal.id = 'ph-modal';
        modal.innerHTML = `
            <div class="ph-modal-header">
                <span class="ph-modal-title">📍 Location Hint</span>
                <button class="ph-modal-close" id="ph-modal-close">✕</button>
            </div>
            <div class="ph-hint-content" id="ph-hint-content">
                <div class="ph-hint-row">
                    <span class="ph-hint-label">Loading...</span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // ═══════════════════════════════════════════════════════════════
    // TOAST SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const showToast = (text, type = 'info') => {
        // Remove existing
        document.querySelectorAll('.ph-toast').forEach(t => t.remove());

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        const toast = document.createElement('div');
        toast.className = `ph-toast ${type}`;
        toast.innerHTML = `
            <span class="ph-toast-icon">${icons[type]}</span>
            <span class="ph-toast-text">${text}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    };

    // ═══════════════════════════════════════════════════════════════
    // COORDINATE INTERCEPTOR
    // ═══════════════════════════════════════════════════════════════

    const setupInterceptor = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (method.toUpperCase() === 'POST' &&
                (url.includes('GetMetadata') || url.includes('SingleImageSearch'))) {
                this.addEventListener('load', function() {
                    try {
                        const match = this.responseText.match(/-?\d+\.\d+,-?\d+\.\d+/g);
                        if (match) {
                            const split = match[0].split(",");
                            globalCoordinates = {
                                lat: parseFloat(split[0]),
                                lng: parseFloat(split[1])
                            };
                            isLocked = true;
                            currentRound++;
                            updateUI();
                            showToast('Coordinates locked', 'success');
                        }
                    } catch(e) {
                        console.error('[Phantom] Intercept error:', e);
                    }
                });
            }
            return originalOpen.apply(this, arguments);
        };
    };

    // ═══════════════════════════════════════════════════════════════
    // UI UPDATE
    // ═══════════════════════════════════════════════════════════════

    const updateUI = () => {
        const coordsEl = document.getElementById('ph-coords');
        const coordsBox = document.getElementById('ph-coords-box');
        const statusEl = document.getElementById('ph-status');
        const roundEl = document.getElementById('ph-round');

        if (isLocked && globalCoordinates.lat) {
            coordsEl.textContent = `${globalCoordinates.lat.toFixed(5)}, ${globalCoordinates.lng.toFixed(5)}`;
            coordsEl.classList.remove('waiting');
            coordsBox.classList.add('locked');
            statusEl.classList.add('active');
            statusEl.title = 'Coordinates locked!';
        } else {
            coordsEl.textContent = 'Waiting for round...';
            coordsEl.classList.add('waiting');
            coordsBox.classList.remove('locked');
            statusEl.classList.remove('active');
            statusEl.title = 'Waiting for coordinates...';
        }

        roundEl.textContent = currentRound;
    };

    // ═══════════════════════════════════════════════════════════════
    // DONUT ALGORITHM (Randomizer)
    // ═══════════════════════════════════════════════════════════════

    const randomizeCoords = (lat, lng, minKm, maxKm) => {
        const R = 6371;
        const r = Math.sqrt(Math.random() * (maxKm**2 - minKm**2) + minKm**2);
        const theta = Math.random() * 2 * Math.PI;

        const dy = r * Math.sin(theta);
        const dx = r * Math.cos(theta);

        const newLat = lat + (dy / R) * (180 / Math.PI);
        const newLng = lng + (dx / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

        return { lat: newLat, lng: newLng };
    };

    // ═══════════════════════════════════════════════════════════════
    // GHOST MAP INTERACTION
    // ═══════════════════════════════════════════════════════════════

    const simulateHumanBehavior = async (targetCoords, preset) => {
    // 1. СНАЧАЛА открываем карту и ЖДЁМ
    const openMap = async () => {
    // Вариант 1: кликаем по свёрнутой мини-карте
    const miniMap = document.querySelector('[class*="guess-map_canvasContainer"]');
    if (miniMap) {
        miniMap.click();
        await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
    }

    // Вариант 2: ищем кнопку развернуть (разные селекторы)
    const expandSelectors = [
        '[data-qa="expand-map-button"]',
        '[class*="guess-map_toggleLabel"]',
        '[class*="game-layout_toggleLabel"]',
        'button[class*="expand"]',
        '[class*="guess-map"] button'
    ];

    for (const selector of expandSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.click();
            await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
            break;
        }
    }

    // Вариант 3: хуярим по самой карте чтобы активировать
    const mapWrapper = document.querySelector('[class*="guess-map_wrapper"]')
                    || document.querySelector('[class*="guess-map"]');
    if (mapWrapper) {
        mapWrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        mapWrapper.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        await new Promise(r => setTimeout(r, 300));
        mapWrapper.click();
        await new Promise(r => setTimeout(r, 400));
    }
};

await openMap();

    // 2. Ищем инстанс карты
    let mapInstance = null;
    try {
        const canvas = document.querySelector('[class^="guess-map_canvas__"]');
        if (canvas) {
            const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber$'));
            if (fiberKey) {
                let fiber = canvas[fiberKey];
                // ищем map в дереве
                for (let i = 0; i < 10 && fiber; i++) {
                    if (fiber.memoizedProps?.map) {
                        mapInstance = fiber.memoizedProps.map;
                        break;
                    }
                    fiber = fiber.return;
                }
            }
        }
    } catch(e) {
        console.log('[Phantom] Map instance error:', e);
    }

    if (!mapInstance) {
        await new Promise(r => setTimeout(r, 500));
        return;
    }

    // 3. Рассчитываем целевой зум по пресету
    // Чем точнее режим — тем сильнее зум
    const zoomLevels = {
        ghost: 8,      // далеко — слабый зум
        ultra: 10,
        legit: 12,
        tryhard: 14,
        rage: 16,
        sniper: 18     // точно — максимальный зум
    };
    const targetZoom = zoomLevels[preset] || 12;
    const startZoom = mapInstance.getZoom() || 2;

    // 4. Сначала панорамируем к ЦЕЛЕВЫМ координатам (не рандом!)
    mapInstance.panTo({ lat: targetCoords.lat, lng: targetCoords.lng });
    await new Promise(r => setTimeout(r, 400 + Math.random() * 300));

    // 5. Плавно зумим к цели
    let currentZoom = startZoom;
    while (currentZoom < targetZoom) {
        const step = Math.min(2, targetZoom - currentZoom); // шаг 1-2
        currentZoom += step;
        mapInstance.setZoom(currentZoom);
        await new Promise(r => setTimeout(r, 250 + Math.random() * 200));
    }

    // 6. Лёгкие микро-движения вокруг цели (имитация поиска)
    const jitterCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < jitterCount; i++) {
        const jitterLat = targetCoords.lat + (Math.random() - 0.5) * 0.01;
        const jitterLng = targetCoords.lng + (Math.random() - 0.5) * 0.01;
        mapInstance.panTo({ lat: jitterLat, lng: jitterLng });
        await new Promise(r => setTimeout(r, 200 + Math.random() * 150));
    }

    // 7. Возврат точно на цель
    mapInstance.panTo({ lat: targetCoords.lat, lng: targetCoords.lng });
    await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
};

    // ═══════════════════════════════════════════════════════════════
    // MAKE GUESS
    // ═══════════════════════════════════════════════════════════════

    const makeGuess = async (mode = 'safe') => {
    if (!globalCoordinates.lat) {
        showToast('No coordinates yet!', 'error');
        return;
    }

    let target = { ...globalCoordinates };

    if (mode === 'safe') {
        const preset = PRESETS[currentPreset];
        target = randomizeCoords(target.lat, target.lng, preset.min, preset.max);
    }

    // Симуляция ПОСЛЕ расчёта target, передаём preset
    if (mode !== 'perfect') {
        await simulateHumanBehavior(target, currentPreset);
        showToast(`${PRESETS[currentPreset].name} applied`, 'success');
    } else {
        await simulateHumanBehavior(target, 'sniper');
        showToast('Perfect shot! 🎯', 'success');
    }

    roundHistory.push({
        round: currentRound,
        actual: { ...globalCoordinates },
        guessed: target,
        preset: currentPreset,
        mode: mode
    });

    // Place marker via React internals — FIXED SELECTORS
    try {
        const canvas = document.querySelector('[class^="guess-map_canvas__"]');
        if (!canvas) throw new Error('Canvas not found');

        const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber$'));
        if (!fiberKey) throw new Error('React fiber not found');

        const clickHandler = canvas[fiberKey].return.return.memoizedProps.map.__e3_.click;
        if (!clickHandler) throw new Error('Click handler not found');

        const event = {
            latLng: {
                lat: () => target.lat,
                lng: () => target.lng
            }
        };

        for (const group in clickHandler) {
            Object.values(clickHandler[group]).forEach(fn => {
                if (typeof fn === 'function') fn(event);
            });
        }
    } catch(e) {
        showToast('Map error — try again', 'warning');
        console.error('[Phantom] Guess error:', e);
    }
};

    // ═══════════════════════════════════════════════════════════════
    // HINT SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const showHint = async () => {
        if (!globalCoordinates.lat) {
            showToast('No coordinates!', 'error');
            return;
        }

        const modal = document.getElementById('ph-modal');
        const overlay = document.getElementById('ph-overlay');
        const content = document.getElementById('ph-hint-content');

        content.innerHTML = `<div class="ph-hint-row"><span class="ph-hint-label">Loading...</span></div>`;
        modal.classList.add('show');
        overlay.classList.add('show');

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${globalCoordinates.lat}&lon=${globalCoordinates.lng}&accept-language=en`
            );
            const data = await res.json();

            content.innerHTML = `
                <div class="ph-hint-row">
                    <span class="ph-hint-label">Country</span>
                    <span class="ph-hint-value">${data.address?.country || 'Unknown'}</span>
                </div>
                <div class="ph-hint-row">
                    <span class="ph-hint-label">Region</span>
                    <span class="ph-hint-value">${data.address?.state || data.address?.region || 'Unknown'}</span>
                </div>
                <div class="ph-hint-row">
                    <span class="ph-hint-label">City</span>
                    <span class="ph-hint-value">${data.address?.city || data.address?.town || data.address?.village || 'Unknown'}</span>
                </div>
                <div class="ph-hint-row">
                    <span class="ph-hint-label">Road</span>
                    <span class="ph-hint-value">${data.address?.road || 'Unknown'}</span>
                </div>
                <div class="ph-hint-row">
                    <span class="ph-hint-label">Postal Code</span>
                    <span class="ph-hint-value">${data.address?.postcode || 'Unknown'}</span>
                </div>
            `;
        } catch(e) {
            content.innerHTML = `
                <div class="ph-hint-row">
                    <span class="ph-hint-label" style="color: var(--ph-danger)">Failed to load hint</span>
                </div>
            `;
        }
    };

    const closeModal = () => {
        document.getElementById('ph-modal').classList.remove('show');
        document.getElementById('ph-overlay').classList.remove('show');
    };

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const setupEventHandlers = () => {
        // Preset selection
        document.getElementById('ph-presets').addEventListener('click', (e) => {
            const preset = e.target.closest('.ph-preset');
            if (preset) {
                currentPreset = preset.dataset.preset;
                document.querySelectorAll('.ph-preset').forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                showToast(`Mode: ${PRESETS[currentPreset].name}`, 'info');
            }
        });

        // Buttons
        document.getElementById('ph-guess').onclick = () => makeGuess('safe');
        document.getElementById('ph-perfect').onclick = () => makeGuess('perfect');
        document.getElementById('ph-hint').onclick = showHint;

        document.getElementById('ph-copy').onclick = () => {
            if (globalCoordinates.lat) {
                navigator.clipboard.writeText(`${globalCoordinates.lat}, ${globalCoordinates.lng}`);
                showToast('Copied to clipboard!', 'success');
            }
        };

        document.getElementById('ph-maps').onclick = () => {
            if (globalCoordinates.lat) {
                window.open(`https://www.google.com/maps/place/${globalCoordinates.lat},${globalCoordinates.lng}`, '_blank');
            }
        };

        document.getElementById('ph-minimize').onclick = () => {
            document.getElementById('phantom-panel').classList.toggle('minimized');
        };

        document.getElementById('ph-toggle-keys').onclick = () => {
            document.getElementById('ph-keybinds').classList.toggle('show');
        };

        document.getElementById('ph-streamer').onclick = () => {
            document.getElementById('phantom-panel').classList.toggle('streamer-mode');
            showToast('Streamer mode toggled', 'info');
        };

        document.getElementById('ph-reset').onclick = () => {
            currentRound = 0;
            totalScore = 0;
            roundHistory = [];
            globalCoordinates = { lat: 0, lng: 0 };
            isLocked = false;
            updateUI();
            document.getElementById('ph-score').textContent = '0';
            document.getElementById('ph-accuracy').textContent = '--';
            showToast('Stats reset!', 'success');
        };

        document.getElementById('ph-history').onclick = () => {
            if (roundHistory.length === 0) {
                showToast('No history yet!', 'warning');
                return;
            }
            console.table(roundHistory);
            showToast('History logged to console', 'info');
        };

        // Modal close
        document.getElementById('ph-modal-close').onclick = closeModal;
        document.getElementById('ph-overlay').onclick = closeModal;

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.code) {
                case KEYBINDS.togglePanel:
                    document.getElementById('phantom-panel').classList.toggle('hidden');
                    break;
                case KEYBINDS.safeGuess:
                    e.preventDefault();
                    makeGuess('safe');
                    break;
                case KEYBINDS.perfectGuess:
                    makeGuess('perfect');
                    break;
                case KEYBINDS.hint:
                    showHint();
                    break;
                case KEYBINDS.copyCoords:
                    if (globalCoordinates.lat) {
                        navigator.clipboard.writeText(`${globalCoordinates.lat}, ${globalCoordinates.lng}`);
                        showToast('Copied!', 'success');
                    }
                    break;
                case KEYBINDS.panic:
                    document.getElementById('phantom-panel').classList.add('hidden');
                    closeModal();
                    break;
            }
        });
    };

    // ═══════════════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════════════

    const init = () => {
        if (document.getElementById('phantom-panel')) return;

        injectStyles();
        buildUI();
        setupEventHandlers();
        setupInterceptor();

        console.log('%c[PHANTOM v5.0] Loaded successfully! 👻', 'color: #8b5cf6; font-weight: bold; font-size: 14px;');
        showToast('Phantom v5.0 loaded!', 'success');
    };

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
