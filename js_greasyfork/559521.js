// ==UserScript==
// @name         Torn Christmas Town D-Pad
// @namespace    https://torn.com
// @version      3.0
// @description  Adds an 8-direction D-pad controller for navigating Christmas Town with customisation options like floating buttons, transparency and layout.
// @author       ANITABURN
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/559521/Torn%20Christmas%20Town%20D-Pad.user.js
// @updateURL https://update.greasyfork.org/scripts/559521/Torn%20Christmas%20Town%20D-Pad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'ct_dpad_settings';
    const DEFAULT_SETTINGS = {
        floating: false,
        layout: 'grid3x3',
        x: 20,
        y: 200,
        opacity: 0.7,
        buttonSize: 42,
        gap: 6
    };

    function getSettings() {
        try {
            const saved = JSON.parse(GM_getValue(STORAGE_KEY, '{}'));
            return { ...DEFAULT_SETTINGS, ...saved };
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings(settings) {
        GM_setValue(STORAGE_KEY, JSON.stringify(settings));
    }

    function triggerKeyEvent(key, type) {
        const event = new KeyboardEvent(type, {
            key: key,
            code: key,
            keyCode: { 'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39 }[key],
            bubbles: true,
            cancelable: true,
            composed: true
        });
        document.dispatchEvent(event);
    }

    const directionKeys = {
        'left-top': ['ArrowLeft', 'ArrowUp'],
        'top': ['ArrowUp'],
        'right-top': ['ArrowRight', 'ArrowUp'],
        'left': ['ArrowLeft'],
        'right': ['ArrowRight'],
        'left-bottom': ['ArrowLeft', 'ArrowDown'],
        'bottom': ['ArrowDown'],
        'right-bottom': ['ArrowRight', 'ArrowDown']
    };

    GM_addStyle(`
        .ct-dpad-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
            background: #333;
            border-top: 1px solid #333;
        }

        .ct-dpad-container.floating {
            position: fixed;
            z-index: 9999;
            border-radius: 10px;
            border: 1px solid #555;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            cursor: move;
        }

        .ct-dpad-footer {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #555;
        }

        .ct-dpad-settings-btn {
            background: #555;
            border: none;
            color: #fff;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .ct-dpad-settings-btn:hover {
            background: #666;
        }

        .ct-dpad-settings-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        /* Grid layouts */
        .ct-dpad {
            display: grid;
            grid-template-columns: repeat(3, var(--btn-size, 42px));
            grid-template-rows: repeat(3, var(--btn-size, 42px));
            gap: var(--btn-gap, 6px);
        }

        .ct-dpad.layout-4x2 {
            grid-template-columns: repeat(4, var(--btn-size, 42px));
            grid-template-rows: repeat(2, var(--btn-size, 42px));
        }

        .ct-dpad-btn {
            width: var(--btn-size, 42px);
            height: var(--btn-size, 42px);
            border: none;
            border-radius: 6px;
            background: #666;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
            user-select: none;
            opacity: 0.9;
        }

        .ct-dpad-btn:active {
            opacity: 1.0;
            background: #555;
            transform: scale(0.95);
        }

        .ct-dpad-btn svg {
            width: 60%;
            height: 60%;
            fill: currentColor;
        }

        .ct-dpad-btn.ct-dpad-center {
            visibility: hidden;
        }

        .ct-dpad.layout-4x2 .ct-dpad-btn.ct-dpad-center {
            display: none;
        }

        /* 3x3 grid positions */
        .ct-dpad:not(.layout-4x2) .ct-dpad-left-top { grid-column: 1; grid-row: 1; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-top { grid-column: 2; grid-row: 1; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-right-top { grid-column: 3; grid-row: 1; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-left { grid-column: 1; grid-row: 2; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-center { grid-column: 2; grid-row: 2; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-right { grid-column: 3; grid-row: 2; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-left-bottom { grid-column: 1; grid-row: 3; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-bottom { grid-column: 2; grid-row: 3; }
        .ct-dpad:not(.layout-4x2) .ct-dpad-right-bottom { grid-column: 3; grid-row: 3; }

        /* 4x2 grid positions - cardinals on top, diagonals on bottom */
        .ct-dpad.layout-4x2 .ct-dpad-left { grid-column: 1; grid-row: 1; }
        .ct-dpad.layout-4x2 .ct-dpad-bottom { grid-column: 2; grid-row: 1; }
        .ct-dpad.layout-4x2 .ct-dpad-top { grid-column: 3; grid-row: 1; }
        .ct-dpad.layout-4x2 .ct-dpad-right { grid-column: 4; grid-row: 1; }
        .ct-dpad.layout-4x2 .ct-dpad-left-top { grid-column: 1; grid-row: 2; }
        .ct-dpad.layout-4x2 .ct-dpad-left-bottom { grid-column: 2; grid-row: 2; }
        .ct-dpad.layout-4x2 .ct-dpad-right-bottom { grid-column: 3; grid-row: 2; }
        .ct-dpad.layout-4x2 .ct-dpad-right-top { grid-column: 4; grid-row: 2; }

        /* Modal styles */
        .ct-dpad-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ct-dpad-modal {
            background: #333;
            border-radius: 10px;
            border: 1px solid #555;
            padding: 20px;
            min-width: 280px;
            max-width: 90%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .ct-dpad-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #555;
        }

        .ct-dpad-modal-title {
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            margin: 0;
        }

        .ct-dpad-modal-close {
            background: #555;
            border: none;
            color: #fff;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ct-dpad-modal-close:hover {
            background: #666;
        }

        .ct-dpad-setting-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .ct-dpad-setting-label {
            color: #ccc;
            font-size: 13px;
        }

        .ct-dpad-switch {
            position: relative;
            width: 44px;
            height: 24px;
            background: #555;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .ct-dpad-switch.active {
            background: #4a9f4a;
        }

        .ct-dpad-switch::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 18px;
            height: 18px;
            background: #fff;
            border-radius: 50%;
            transition: left 0.2s;
        }

        .ct-dpad-switch.active::after {
            left: 23px;
        }

        .ct-dpad-slider-row {
            margin-bottom: 15px;
        }

        .ct-dpad-slider-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .ct-dpad-slider-value {
            color: #888;
            font-size: 12px;
        }

        .ct-dpad-slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #555;
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
        }

        .ct-dpad-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4a9f4a;
            cursor: pointer;
        }

        .ct-dpad-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #4a9f4a;
            cursor: pointer;
            border: none;
        }

        .ct-dpad-layout-options {
            display: flex;
            gap: 10px;
        }

        .ct-dpad-layout-btn {
            flex: 1;
            padding: 10px;
            background: #555;
            border: 2px solid #555;
            border-radius: 6px;
            color: #ccc;
            font-size: 11px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
        }

        .ct-dpad-layout-btn:hover {
            background: #666;
        }

        .ct-dpad-layout-btn.active {
            border-color: #4a9f4a;
            background: #3a5a3a;
            color: #fff;
        }

        .ct-dpad-layout-preview {
            font-size: 16px;
            margin-bottom: 5px;
        }
    `);

    function createModal(currentSettings, onSave) {
        const overlay = document.createElement('div');
        overlay.className = 'ct-dpad-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'ct-dpad-modal';

        modal.innerHTML = `
            <div class="ct-dpad-modal-header">
                <h3 class="ct-dpad-modal-title">D-Pad Settings</h3>
                <button class="ct-dpad-modal-close">×</button>
            </div>

            <div class="ct-dpad-setting-row">
                <span class="ct-dpad-setting-label">Floating Mode</span>
                <div class="ct-dpad-switch ${currentSettings.floating ? 'active' : ''}" data-setting="floating"></div>
            </div>

            <div class="ct-dpad-setting-row">
                <span class="ct-dpad-setting-label">Layout</span>
            </div>
            <div class="ct-dpad-layout-options">
                <button class="ct-dpad-layout-btn ${currentSettings.layout === 'grid3x3' ? 'active' : ''}" data-layout="grid3x3">
                    <div class="ct-dpad-layout-preview">⊞</div>
                    3×3 Grid
                </button>
                <button class="ct-dpad-layout-btn ${currentSettings.layout === 'grid4x2' ? 'active' : ''}" data-layout="grid4x2">
                    <div class="ct-dpad-layout-preview">☰</div>
                    4×2 Grid
                </button>
            </div>

            <div class="ct-dpad-slider-row" style="margin-top: 20px;">
                <div class="ct-dpad-slider-header">
                    <span class="ct-dpad-setting-label">Button Size</span>
                    <span class="ct-dpad-slider-value" data-value="buttonSize">${currentSettings.buttonSize}px</span>
                </div>
                <input type="range" class="ct-dpad-slider" data-setting="buttonSize" min="30" max="60" value="${currentSettings.buttonSize}">
            </div>

            <div class="ct-dpad-slider-row">
                <div class="ct-dpad-slider-header">
                    <span class="ct-dpad-setting-label">Button Gap</span>
                    <span class="ct-dpad-slider-value" data-value="gap">${currentSettings.gap}px</span>
                </div>
                <input type="range" class="ct-dpad-slider" data-setting="gap" min="2" max="12" value="${currentSettings.gap}">
            </div>

            <div class="ct-dpad-slider-row" style="display: ${currentSettings.floating ? 'block' : 'none'};" data-floating-only>
                <div class="ct-dpad-slider-header">
                    <span class="ct-dpad-setting-label">Opacity</span>
                    <span class="ct-dpad-slider-value" data-value="opacity">${Math.round(currentSettings.opacity * 100)}%</span>
                </div>
                <input type="range" class="ct-dpad-slider" data-setting="opacity" min="0.3" max="1" step="0.1" value="${currentSettings.opacity}">
            </div>
        `;

        overlay.appendChild(modal);

        // Close handlers
        const closeBtn = modal.querySelector('.ct-dpad-modal-close');
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Settings object to track changes
        const newSettings = { ...currentSettings };

        // Switch handlers
        modal.querySelectorAll('.ct-dpad-switch').forEach(sw => {
            sw.addEventListener('click', () => {
                sw.classList.toggle('active');
                const setting = sw.dataset.setting;
                newSettings[setting] = sw.classList.contains('active');

                if (setting === 'floating') {
                    const floatingOnly = modal.querySelector('[data-floating-only]');
                    floatingOnly.style.display = newSettings.floating ? 'block' : 'none';
                }

                onSave(newSettings);
            });
        });

        // Layout button handlers
        modal.querySelectorAll('.ct-dpad-layout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.ct-dpad-layout-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                newSettings.layout = btn.dataset.layout;
                onSave(newSettings);
            });
        });

        // Slider handlers
        modal.querySelectorAll('.ct-dpad-slider').forEach(slider => {
            slider.addEventListener('input', () => {
                const setting = slider.dataset.setting;
                const value = parseFloat(slider.value);
                newSettings[setting] = value;

                const valueDisplay = modal.querySelector(`[data-value="${setting}"]`);
                if (valueDisplay) {
                    if (setting === 'opacity') {
                        valueDisplay.textContent = Math.round(value * 100) + '%';
                    } else {
                        valueDisplay.textContent = value + 'px';
                    }
                }

                onSave(newSettings);
            });
        });

        return overlay;
    }

    function createDpad() {
        const settings = getSettings();

        const container = document.createElement('div');
        container.className = 'ct-dpad-container';
        container.style.setProperty('--btn-size', settings.buttonSize + 'px');
        container.style.setProperty('--btn-gap', settings.gap + 'px');

        // Settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'ct-dpad-settings-btn';
        settingsBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;

        // D-pad grid
        const dpad = document.createElement('div');
        dpad.className = 'ct-dpad';
        if (settings.layout === 'grid4x2') {
            dpad.classList.add('layout-4x2');
        }

        const arrows = {
            'left-top': `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" transform="rotate(-45 12 12)"/></svg>`,
            'top': `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
            'right-top': `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" transform="rotate(45 12 12)"/></svg>`,
            'left': `<svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>`,
            'right': `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`,
            'left-bottom': `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" transform="rotate(-135 12 12)"/></svg>`,
            'bottom': `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`,
            'right-bottom': `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" transform="rotate(135 12 12)"/></svg>`
        };

        const directions = [
            'left-top', 'top', 'right-top',
            'left', 'center', 'right',
            'left-bottom', 'bottom', 'right-bottom'
        ];

        directions.forEach(dir => {
            const btn = document.createElement('div');
            btn.className = `ct-dpad-btn ct-dpad-${dir}`;

            if (dir !== 'center') {
                btn.innerHTML = arrows[dir];

                const keys = directionKeys[dir];

                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    keys.forEach(key => triggerKeyEvent(key, 'keydown'));
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    keys.forEach(key => triggerKeyEvent(key, 'keyup'));
                });

                btn.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    keys.forEach(key => triggerKeyEvent(key, 'keydown'));
                });
                btn.addEventListener('mouseup', () => {
                    keys.forEach(key => triggerKeyEvent(key, 'keyup'));
                });
                btn.addEventListener('mouseleave', () => {
                    keys.forEach(key => triggerKeyEvent(key, 'keyup'));
                });
            }

            dpad.appendChild(btn);
        });

        container.appendChild(dpad);

        // Footer with settings button
        const footer = document.createElement('div');
        footer.className = 'ct-dpad-footer';
        footer.appendChild(settingsBtn);
        container.appendChild(footer);

        // Settings button handler
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentSettings = getSettings();
            const modal = createModal(currentSettings, (newSettings) => {
                saveSettings(newSettings);
                applySettings(container, dpad, newSettings);
            });
            document.body.appendChild(modal);
        });

        // Apply initial settings
        applySettings(container, dpad, settings);

        // Dragging functionality
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        container.addEventListener('mousedown', (e) => {
            if (!container.classList.contains('floating')) return;
            if (e.target.closest('.ct-dpad-btn') || e.target.closest('.ct-dpad-settings-btn')) return;

            isDragging = true;
            dragOffsetX = e.clientX - container.offsetLeft;
            dragOffsetY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'move';

                const currentSettings = getSettings();
                currentSettings.x = parseInt(container.style.left);
                currentSettings.y = parseInt(container.style.top);
                saveSettings(currentSettings);
            }
        });

        // Touch dragging
        container.addEventListener('touchstart', (e) => {
            if (!container.classList.contains('floating')) return;
            if (e.target.closest('.ct-dpad-btn') || e.target.closest('.ct-dpad-settings-btn')) return;

            isDragging = true;
            const touch = e.touches[0];
            dragOffsetX = touch.clientX - container.offsetLeft;
            dragOffsetY = touch.clientY - container.offsetTop;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            let newX = touch.clientX - dragOffsetX;
            let newY = touch.clientY - dragOffsetY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;

                const currentSettings = getSettings();
                currentSettings.x = parseInt(container.style.left);
                currentSettings.y = parseInt(container.style.top);
                saveSettings(currentSettings);
            }
        });

        return container;
    }

    function applySettings(container, dpad, settings) {
        container.style.setProperty('--btn-size', settings.buttonSize + 'px');
        container.style.setProperty('--btn-gap', settings.gap + 'px');

        // Layout
        if (settings.layout === 'grid4x2') {
            dpad.classList.add('layout-4x2');
        } else {
            dpad.classList.remove('layout-4x2');
        }

        // Floating mode
        if (settings.floating) {
            container.classList.add('floating');
            container.style.left = settings.x + 'px';
            container.style.top = settings.y + 'px';
            container.style.opacity = settings.opacity;

            if (!document.body.contains(container)) {
                document.body.appendChild(container);
            }
        } else {
            container.classList.remove('floating');
            container.style.left = '';
            container.style.top = '';
            container.style.opacity = '';

            const target = document.querySelector('.items-container.itemsContainer___HEW8n') ||
                          document.querySelector('.items-container');
            if (target && !target.parentNode.contains(container)) {
                target.parentNode.insertBefore(container, target);
            }
        }
    }

    function insertDpad() {
        if (document.querySelector('.ct-dpad-container')) return;

        const settings = getSettings();
        const dpad = createDpad();

        if (!settings.floating) {
            const itemsContainer = document.querySelector('.items-container.itemsContainer___HEW8n') ||
                                  document.querySelector('.items-container');

            if (itemsContainer) {
                itemsContainer.parentNode.insertBefore(dpad, itemsContainer);
                console.log('[CT D-Pad] D-pad inserted successfully');
            }
        }
    }

    function init() {
        insertDpad();

        const observer = new MutationObserver(() => {
            if (!document.querySelector('.ct-dpad-container')) {
                insertDpad();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let attempts = 0;
        const interval = setInterval(() => {
            if (document.querySelector('.ct-dpad-container') || attempts > 20) {
                clearInterval(interval);
            } else {
                insertDpad();
                attempts++;
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();