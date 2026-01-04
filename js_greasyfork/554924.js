// ==UserScript==
// @name         X.com Custom Verification Badges
// @namespace    http://violentmonkey.github.io
// @version      1.0
// @description  Customize verification checkmark colors by clicking on them
// @author       You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554924/Xcom%20Custom%20Verification%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/554924/Xcom%20Custom%20Verification%20Badges.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const STORAGE_KEY = 'x_custom_checkmark_colors';
    const DEFAULT_COLORS = {
        blue: '#1d9bf0',      // Original blue
        gold: '#ffd700',      // Premium gold
        pink: '#ff69b4',      // Pink
        purple: '#8b5cf6',    // Purple
        green: '#10b981',     // Green
        red: '#ef4444',       // Red
        orange: '#f97316',    // Orange
        cyan: '#06b6d4'       // Cyan
    };

    let userColors = GM_getValue(STORAGE_KEY, {
        verified: DEFAULT_COLORS.blue,
        premium: DEFAULT_COLORS.gold
    });

    let isColorPickerOpen = false;

    // Apply custom colors immediately
    applyCheckmarkColors();

    function applyCheckmarkColors() {
        const styleId = 'x-custom-checkmark-styles';
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const css = `
            /* Verified accounts (blue check) */
            [data-testid="icon-verified"],
            svg[aria-label="Verified account"],
            .r-1cvl2hr[data-testid="icon-verified"],
            [aria-label="Verified account"] {
                color: ${userColors.verified} !important;
                fill: ${userColors.verified} !important;
            }

            /* Premium accounts (gold check) */
            [data-testid="premiumIcon"],
            [aria-label="Premium account"],
            .r-1cvl2hr[data-testid="premiumIcon"] {
                color: ${userColors.premium} !important;
                fill: ${userColors.premium} !important;
            }

            /* Hover effects for clickable checkmarks */
            .custom-checkmark-clickable:hover {
                opacity: 0.7 !important;
                transform: scale(1.1) !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }

            /* Color picker styles */
            #checkmark-color-picker {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background: #15202b !important;
                border: 1px solid #38444d !important;
                border-radius: 16px !important;
                padding: 20px !important;
                z-index: 10000 !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                min-width: 300px !important;
                font-family: system-ui, -apple-system, sans-serif !important;
            }

            #checkmark-color-picker-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.5) !important;
                z-index: 9999 !important;
            }

            .color-option {
                width: 40px !important;
                height: 40px !important;
                border-radius: 8px !important;
                margin: 5px !important;
                cursor: pointer !important;
                border: 2px solid transparent !important;
                transition: all 0.2s ease !important;
            }

            .color-option:hover {
                transform: scale(1.1) !important;
                border-color: white !important;
            }

            .color-option.selected {
                border-color: white !important;
                box-shadow: 0 0 0 2px #1d9bf0 !important;
            }
        `;

        styleElement.textContent = css;
    }

    function makeCheckmarksClickable() {
        // Find all verification badges
        const checkmarks = document.querySelectorAll(`
            [data-testid="icon-verified"],
            [data-testid="premiumIcon"],
            svg[aria-label="Verified account"],
            [aria-label="Verified account"],
            [aria-label="Premium account"],
            .r-1cvl2hr[data-testid="icon-verified"],
            .r-1cvl2hr[data-testid="premiumIcon"]
        `);

        checkmarks.forEach(checkmark => {
            if (!checkmark.classList.contains('custom-checkmark-clickable')) {
                checkmark.classList.add('custom-checkmark-clickable');

                // Wrap in a clickable container if needed
                let clickableElement = checkmark;
                if (checkmark.tagName === 'svg' || checkmark.tagName === 'path') {
                    clickableElement = checkmark.closest('div') || checkmark;
                }

                clickableElement.style.cursor = 'pointer';
                clickableElement.title = 'Click to change color';

                clickableElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isPremium = checkmark.getAttribute('data-testid') === 'premiumIcon' ||
                                    checkmark.getAttribute('aria-label') === 'Premium account';

                    showColorPicker(isPremium ? 'premium' : 'verified');
                });
            }
        });
    }

    function showColorPicker(checkmarkType) {
        if (isColorPickerOpen) return;
        isColorPickerOpen = true;

        closeColorPicker(); // Remove any existing picker

        const overlay = document.createElement('div');
        overlay.id = 'checkmark-color-picker-overlay';

        const picker = document.createElement('div');
        picker.id = 'checkmark-color-picker';

        const currentColor = userColors[checkmarkType];
        const checkmarkName = checkmarkType === 'verified' ? 'Verified' : 'Premium';

        picker.innerHTML = `
            <h3 style="color: white; margin: 0 0 16px 0; text-align: center;">
                Change ${checkmarkName} Checkmark Color
            </h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px;">
                ${Object.entries(DEFAULT_COLORS).map(([name, color]) => `
                    <div class="color-option ${color === currentColor ? 'selected' : ''}"
                         data-color="${color}"
                         style="background: ${color};"
                         title="${name.charAt(0).toUpperCase() + name.slice(1)}">
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="custom-color-btn" style="
                    padding: 8px 16px;
                    background: #1d9bf0;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                ">Custom Color</button>
                <button id="reset-color-btn" style="
                    padding: 8px 16px;
                    background: transparent;
                    color: #1d9bf0;
                    border: 1px solid #1d9bf0;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                ">Reset</button>
                <button id="close-picker-btn" style="
                    padding: 8px 16px;
                    background: transparent;
                    color: #64748b;
                    border: 1px solid #64748b;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                ">Close</button>
            </div>
            <div id="custom-color-input" style="margin-top: 16px; display: none;">
                <input type="color" id="color-picker-input" value="${currentColor}" style="width: 100%; height: 40px;">
                <button id="apply-custom-color" style="
                    margin-top: 8px;
                    padding: 8px 16px;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    width: 100%;
                ">Apply Custom Color</button>
            </div>
        `;

        // Add event listeners
        overlay.addEventListener('click', closeColorPicker);

        picker.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = option.getAttribute('data-color');
                updateCheckmarkColor(checkmarkType, color);
                closeColorPicker();
            });
        });

        picker.querySelector('#custom-color-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const customInput = picker.querySelector('#custom-color-input');
            customInput.style.display = customInput.style.display === 'none' ? 'block' : 'none';
        });

        picker.querySelector('#apply-custom-color').addEventListener('click', (e) => {
            e.stopPropagation();
            const colorInput = picker.querySelector('#color-picker-input');
            updateCheckmarkColor(checkmarkType, colorInput.value);
            closeColorPicker();
        });

        picker.querySelector('#reset-color-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const defaultColor = checkmarkType === 'verified' ? DEFAULT_COLORS.blue : DEFAULT_COLORS.gold;
            updateCheckmarkColor(checkmarkType, defaultColor);
            closeColorPicker();
        });

        picker.querySelector('#close-picker-btn').addEventListener('click', closeColorPicker);

        // Prevent picker click from closing overlay
        picker.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(picker);
    }

    function closeColorPicker() {
        const overlay = document.getElementById('checkmark-color-picker-overlay');
        const picker = document.getElementById('checkmark-color-picker');

        if (overlay) overlay.remove();
        if (picker) picker.remove();

        isColorPickerOpen = false;
    }

    function updateCheckmarkColor(checkmarkType, color) {
        userColors[checkmarkType] = color;
        GM_setValue(STORAGE_KEY, userColors);
        applyCheckmarkColors();
        showNotification(`${checkmarkType === 'verified' ? 'Verified' : 'Premium'} checkmark color updated!`);
    }

    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.getElementById('checkmark-color-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'checkmark-color-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        // Add animation styles if not already present
        if (!document.getElementById('checkmark-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'checkmark-animation-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Initialize and watch for new checkmarks
    function init() {
        makeCheckmarksClickable();

        // Set up observer for dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector?.('[data-testid="icon-verified"], [data-testid="premiumIcon"]')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldCheck) break;
            }

            if (shouldCheck) {
                setTimeout(makeCheckmarksClickable, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check periodically
        setInterval(makeCheckmarksClickable, 2000);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();