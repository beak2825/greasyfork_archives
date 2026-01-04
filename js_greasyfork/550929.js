// ==UserScript==
// @name         Web3 OKX Color Theme Changer
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Automaticly color theme changer
// @author       mamiis
// @match        https://*.okx.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550929/Web3%20OKX%20Color%20Theme%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/550929/Web3%20OKX%20Color%20Theme%20Changer.meta.js
// ==/UserScript==

(function() {
        'use strict';

        let UP_COLOR = { r: 189, g: 255, b: 42 }; // #bdff2a
        let DOWN_COLOR = { r: 255, g: 66, b: 172 }; // #ff42ac

        let CHART_FILTERS = {
            green: { hue: 90, saturation: 1.6, brightness: 1.05 },
            red: { hue: 320, saturation: 1.3, brightness: 1.1 }
        };

        let activeModal = null;
        let currentColorType = null;

        function loadUserSettings() {
            try {
                const saved = localStorage.getItem('okx_color_settings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    if (settings.upColor) UP_COLOR = settings.upColor;
                    if (settings.downColor) DOWN_COLOR = settings.downColor;
                    if (settings.filters) CHART_FILTERS = settings.filters;
                }
            } catch (e) {
                console.log('Settings not loaded, using defaults');
            }
        }

        function saveUserSettings() {
            try {
                const settings = {
                    upColor: UP_COLOR,
                    downColor: DOWN_COLOR,
                    filters: CHART_FILTERS
                };
                localStorage.setItem('okx_color_settings', JSON.stringify(settings));
            } catch (e) {
                console.log('Settings not saved');
            }
        }

        function applySettings() {
            kickAll();
            applyChartColorFilters();
        }

        function refreshPage() {
            window.location.reload();
        }

        function toggleThemeForRefresh() {
            const themeButtons = document.querySelectorAll('.nav-r-theme-item');
            if (themeButtons.length >= 3) {
                const currentTheme = document.querySelector('.nav-r-theme-item.nav-r-th-it-sel');
                if (currentTheme) {
                    const lightTheme = themeButtons[1];
                    if (lightTheme && !lightTheme.classList.contains('nav-r-th-it-sel')) {
                        lightTheme.click();
                        setTimeout(() => {
                            currentTheme.click();
                            setTimeout(() => {
                                applySettings();
                                setTimeout(refreshPage, 100);
                            }, 100);
                        }, 100);
                    } else {
                        const darkTheme = themeButtons[2];
                        if (darkTheme && !darkTheme.classList.contains('nav-r-th-it-sel')) {
                            darkTheme.click();
                            setTimeout(() => {
                                currentTheme.click();
                                setTimeout(() => {
                                    applySettings();
                                    setTimeout(refreshPage, 100);
                                }, 100);
                            }, 100);
                        } else {
                            applySettings();
                            setTimeout(refreshPage, 100);
                        }
                    }
                } else {
                    applySettings();
                    setTimeout(refreshPage, 100);
                }
            } else {
                applySettings();
                setTimeout(refreshPage, 100);
            }
        }

        /* ---------- IMPROVED COLOR PICKER MENU ---------- */

        function addColorPickerToMenu() {
            const themeSection = document.querySelector('.nav-r-pan-item:has(.nav-r-item-name)');
            if (!themeSection || !themeSection.querySelector('.nav-r-theme-box')) {
                setTimeout(addColorPickerToMenu, 1000);
                return;
            }

            if (document.querySelector('.nav-r-color-picker-item')) {
                return;
            }

            const colorPickerHTML = `
            <div class="nav-r-pan-item nav-r-color-picker-item" style="margin: 8px 0;">
                <span class="nav-r-item-name">Chart Colors</span>
                <div class="nav-r-theme-box" style="display: flex; align-items: center; gap: 4px; margin: 0 -2px;">

                    <button type="button" class="nav-r-theme-item nav-r-color-item" data-color="up" title="Up Color">
                        <div class="color-swatch" style="width: 100%; height: 100%; background-color: rgb(${UP_COLOR.r}, ${UP_COLOR.g}, ${UP_COLOR.b})"></div>
                    </button>

                    <button type="button" class="nav-r-theme-item nav-r-color-item" data-color="down" title="Down Color">
                        <div class="color-swatch" style="width: 100%; height: 100%; background-color: rgb(${DOWN_COLOR.r}, ${DOWN_COLOR.g}, ${DOWN_COLOR.b})"></div>
                    </button>

                    <button type="button" class="nav-r-theme-item nav-r-color-item" data-color="reset" title="Reset to Default Colors">
                        <i class="icon okx-header-footer-reset"></i>
                    </button>

                    <button type="button" class="nav-r-theme-item nav-r-apply-item" data-action="apply" title="Apply and Refresh">
                        <i class="icon okx-header-footer-check"></i>
                    </button>

                </div>
            </div>
        `;

            themeSection.insertAdjacentHTML('afterend', colorPickerHTML);
            addColorPickerStyles();
            addColorPickerEvents();
        }

        function addColorPickerStyles() {
            const style = document.createElement('style');
            style.textContent = `
            .nav-r-color-picker-item {
                min-height: 36px !important;
                padding: 2px 0 !important;
            }

            .nav-r-color-picker-item .nav-r-item-name {
                margin-bottom: 2px !important;
                display: block;
            }

            .nav-r-color-picker-item .nav-r-theme-box {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                margin: 0 -2px !important;
                margin-top: 2px !important;
            }

            .nav-r-color-picker-item .nav-r-theme-item {
                position: relative;
                width: 30px !important;
                height: 30px !important;
                border-radius: 6px;
                border: 2px solid var(--border-color, #2a2a2a);
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 0 !important;
                margin: 0 !important;
                overflow: hidden;
                flex-shrink: 0;
                box-sizing: border-box !important;
            }

            .nav-r-color-picker-item .nav-r-theme-item:hover {
                border-color: #cccccc;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(204, 204, 204, 0.3);
            }

            .nav-r-color-picker-item .color-swatch {
                width: 100% !important;
                height: 100% !important;
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.3);
                transition: all 0.3s ease;
                display: block !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                min-width: 100% !important;
                min-height: 100% !important;
            }

            .nav-r-color-picker-item .nav-r-theme-item:hover .color-swatch {
                transform: scale(1.01);
            }

            .nav-r-color-picker-item .nav-r-theme-item i {
                font-size: 14px;
                color: var(--text-color, #fff);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            .nav-r-color-picker-item .nav-r-theme-item:hover i {
                color: #cccccc;
            }

            .nav-r-apply-item {
                background: linear-gradient(135deg, #666666, #888888) !important;
                border: none !important;
            }

            .nav-r-apply-item:hover {
                background: linear-gradient(135deg, #888888, #aaaaaa) !important;
                transform: translateY(-2px) scale(1.05);
            }

            /* Improved Color Picker Modal */
            .color-picker-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: modalFadeIn 0.3s ease forwards;
            }

            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes modalFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            .color-picker-content {
                background: #1a1a1a;
                border-radius: 16px;
                padding: 20px;
                width: 350px;
                max-width: 90vw;
                border: 1px solid #333;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                transform: scale(0.9);
                animation: contentSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            @keyframes contentSlideIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes contentSlideOut {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(0.9); opacity: 0; }
            }

            .color-picker-title {
                color: white;
                margin-bottom: 12px;
                font-size: 16px;
                text-align: center;
                font-weight: 600;
            }

            .color-type-switcher {
                display: flex;
                gap: 6px;
                margin-bottom: 12px;
                justify-content: center;
            }

            .color-type-btn {
                padding: 6px 10px;
                border: 1px solid #333;
                background: #2a2a2a;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 11px;
                flex: 1;
                max-width: 100px;
            }

            .color-type-btn:hover {
                background: #3a3a3a;
            }

            .color-type-btn.active {
                background: #444;
                border-color: #666;
            }

            .color-categories-container {
                max-height: 350px;
                overflow-y: auto;
                padding-right: 3px;
                margin-bottom: 12px;
            }

            .color-category {
                margin-bottom: 12px;
            }

            .color-category-title {
                color: white;
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 5px;
                padding-bottom: 2px;
                border-bottom: 1px solid #333;
            }

            .color-category-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 3px;
                margin-bottom: 6px;
            }

            .color-option {
                width: 24px;
                height: 24px;
                border-radius: 3px;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                flex-shrink: 0;
            }

            .color-option:hover {
                transform: scale(1.15);
                border-color: #cccccc;
                box-shadow: 0 4px 8px rgba(204, 204, 204, 0.3);
            }

            .color-option.selected {
                border-color: #cccccc;
                border-width: 2px;
                box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.3);
            }

            .color-picker-actions {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }

            .color-action-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                text-align: center;
            }

            .color-apply-btn {
                background: linear-gradient(135deg, #666666, #888888);
                color: white;
            }

            .color-apply-btn:hover {
                background: linear-gradient(135deg, #888888, #aaaaaa);
                transform: translateY(-1px);
            }

            .color-default-btn {
                background: linear-gradient(135deg, #444444, #666666);
                color: white;
            }

            .color-default-btn:hover {
                background: linear-gradient(135deg, #666666, #888888);
                transform: translateY(-1px);
            }

            /* Scrollbar styling */
            .color-categories-container::-webkit-scrollbar {
                width: 4px;
            }

            .color-categories-container::-webkit-scrollbar-track {
                background: #2a2a2a;
                border-radius: 2px;
            }

            .color-categories-container::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 2px;
            }

            .color-categories-container::-webkit-scrollbar-thumb:hover {
                background: #777;
            }
        `;
            document.head.appendChild(style);
        }

        function addColorPickerEvents() {
            document.addEventListener('click', function(e) {
                if (e.target.closest('.nav-r-color-item')) {
                    const btn = e.target.closest('.nav-r-color-item');
                    e.stopPropagation();
                    const colorType = btn.getAttribute('data-color');
                    if (colorType === 'reset') {
                        resetToDefaultColors();
                    } else {
                        closeActiveModal();
                        setTimeout(() => {
                            showColorPicker(colorType);
                        }, 50);
                    }
                }

                if (e.target.closest('.nav-r-apply-item')) {
                    const btn = e.target.closest('.nav-r-apply-item');
                    toggleThemeForRefresh();
                    showNotification('Colors applied successfully!');
                }
            });
        }

        function showNotification(message) {
            const oldNotifications = document.querySelectorAll('.okx-color-notification');
            oldNotifications.forEach(notif => notif.remove());

            const notification = document.createElement('div');
            notification.className = 'okx-color-notification';
            notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 24px;
            background: #a3dd27ff;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10001;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function closeActiveModal() {
            if (activeModal) {
                const escapeHandler = activeModal._escapeHandler;
                if (escapeHandler) {
                    document.removeEventListener('keydown', escapeHandler);
                }

                activeModal.style.animation = 'modalFadeOut 0.2s ease forwards';
                const content = activeModal.querySelector('.color-picker-content');
                if (content) {
                    content.style.animation = 'contentSlideOut 0.2s ease forwards';
                }

                setTimeout(() => {
                    if (activeModal && activeModal.parentNode) {
                        activeModal.parentNode.removeChild(activeModal);
                    }
                    activeModal = null;
                    currentColorType = null;
                }, 200);
            }
        }

        function showColorPicker(colorType) {
            if (activeModal) {
                closeActiveModal();
                setTimeout(() => {
                    createColorPickerModal(colorType);
                }, 250);
            } else {
                createColorPickerModal(colorType);
            }
        }

        function createColorPickerModal(colorType) {
            currentColorType = colorType;

            const colorCategories = [{
                    name: "Red",
                    colors: ["#8B0000", "#A52A2A", "#B22222", "#DC143C", "#FF0000", "#FF4D4D", "#ff42ac", "#FF8080", "#FF9999"]
                },
                {
                    name: "Orange",
                    colors: ["#FF4500", "#FF5500", "#FF6600", "#FF7518", "#FF7F50", "#FF8C42", "#FFA500", "#FFB347", "#FFC966"]
                },
                {
                    name: "Yellow",
                    colors: ["#FFD700", "#FFE135", "#FFE600", "#FFEA00", "#FFF200", "#FFF700", "#FFFC00", "#FFFF33", "#FFFF66"]
                },
                {
                    name: "Green",
                    colors: ["#006400", "#008000", "#228B22", "#2E8B57", "#3CB371", "#66CDAA", "#bdff2a", "#90EE90", "#98FB98"]
                },
                {
                    name: "Blue",
                    colors: ["#00008B", "#0000CD", "#0000FF", "#1E90FF", "#4169E1", "#4682B4", "#5F9EA0", "#6495ED", "#87CEFA"]
                },
                {
                    name: "Purple",
                    colors: ["#4B0082", "#6A0DAD", "#7B68EE", "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#DA70D6", "#EE82EE"]
                },
                {
                    name: "Gray",
                    colors: ["#2F4F4F", "#4F4F4F", "#696969", "#808080", "#A9A9A9", "#B0B0B0", "#C0C0C0", "#D3D3D3", "#E0E0E0"]
                },
                {
                    name: "Brown",
                    colors: ["#4B3621", "#5C4033", "#6B4226", "#8B4513", "#A0522D", "#A0522D", "#CD853F", "#D2691E", "#F4A460"]
                },
                {
                    name: "Light Gray",
                    colors: ["#DCDCDC", "#E0E0E0", "#E5E5E5", "#EBEBEB", "#F0F0F0", "#F5F5F5", "#FAFAFA", "#FCFCFC", "#FFFFFF"]
                }
            ];

            const currentColor = colorType === 'up' ? UP_COLOR : DOWN_COLOR;

            activeModal = document.createElement('div');
            activeModal.className = 'color-picker-modal';

            activeModal.innerHTML = `
        <div class="color-picker-content">
            <div class="color-picker-title">
                Select ${colorType === 'up' ? 'Up Color' : 'Down Color'}
            </div>
            <div class="color-type-switcher">
                <button class="color-type-btn ${colorType === 'up' ? 'active' : ''}" data-type="up">Up Color</button>
                <button class="color-type-btn ${colorType === 'down' ? 'active' : ''}" data-type="down">Down Color</button>
            </div>
            <div class="color-categories-container">
                ${colorCategories.map(category => `
                    <div class="color-category">
                        <div class="color-category-title">${category.name}</div>
                        <div class="color-category-grid">
                            ${category.colors.map((color, index) => {
            const isSelected = color === rgbToHex(currentColor.r, currentColor.g, currentColor.b);
            return `
                                    <div class="color-option ${isSelected ? 'selected' : ''}"
                                         style="background-color: ${color}"
                                         data-color="${color}"
                                         title="${color}">
                                    </div>
                                `;
        }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="color-picker-actions">
                <button class="color-action-btn color-default-btn" data-action="default">Default Colors</button>
                <button class="color-action-btn color-apply-btn" data-action="apply">Apply Colors</button>
            </div>
        </div>
    `;

        document.body.appendChild(activeModal);

        // Color type switcher events
        activeModal.querySelectorAll('.color-type-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const newType = this.getAttribute('data-type');
                if (newType !== currentColorType) {
                    closeActiveModal();
                    setTimeout(() => {
                        showColorPicker(newType);
                    }, 50);
                }
            });
        });

        // Selection events - BU KISIM DEĞİŞTİ: Artık CHART_FILTERS güncellenmiyor
        activeModal.querySelectorAll('.color-option').forEach((option) => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const selectedHex = this.getAttribute('data-color');
                const parsedColor = parseHexColor(selectedHex);

                // Apply the color directly without affecting chart filters
                if (currentColorType === 'up') {
                    UP_COLOR = parsedColor;
                } else {
                    DOWN_COLOR = parsedColor;
                }

                // Update selection visually
                activeModal.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');

                // Immediately update swatches and apply settings
                updateColorSwatches();
                applySettings();
                saveUserSettings();

                showNotification(`${currentColorType === 'up' ? 'Up' : 'Down'} color updated to ${selectedHex}`);
            });
        });

        // Action buttons
        activeModal.querySelectorAll('.color-action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                if (action === 'apply') {
                    applySettings();
                    updateColorSwatches();
                    saveUserSettings();
                    showNotification('Applying colors and refreshing page...');
                    closeActiveModal();
                    setTimeout(() => {
                        toggleThemeForRefresh();
                    }, 500);
                } else if (action === 'default') {
                    resetToDefaultColors();
                    closeActiveModal();
                }
            });
        });

        // Close on background click
        activeModal.addEventListener('click', function(e) {
            if (e.target === activeModal) {
                closeActiveModal();
            }
        });

        // Close on Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeActiveModal();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        activeModal._escapeHandler = escapeHandler;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function resetToDefaultColors() {
        UP_COLOR = { r: 189, g: 255, b: 42 };
        DOWN_COLOR = { r: 255, g: 66, b: 172 };

        // Chart filters artık dinamik olduğu için sabit değerlere gerek yok
        // CHART_FILTERS değişkenini kaldırabilirsiniz veya boş bırakabilirsiniz

        saveUserSettings();
        applySettings();
        updateColorSwatches();
        showNotification('Default colors restored!');
        setTimeout(() => {
            toggleThemeForRefresh();
        }, 1000);
    }

    function updateColorSwatches() {
        const upSwatch = document.querySelector('.nav-r-color-item[data-color="up"] .color-swatch');
        const downSwatch = document.querySelector('.nav-r-color-item[data-color="down"] .color-swatch');

        if (upSwatch) {
            upSwatch.style.backgroundColor = `rgb(${UP_COLOR.r}, ${UP_COLOR.g}, ${UP_COLOR.b})`;
        }
        if (downSwatch) {
            downSwatch.style.backgroundColor = `rgb(${DOWN_COLOR.r}, ${DOWN_COLOR.g}, ${DOWN_COLOR.b})`;
        }
    }

    /* ---------- EXISTING FUNCTIONS (Fixed) ---------- */

    const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
    const rgbRegex = /rgba?\([^\)]+\)/gi;
    const hslRegex = /hsla?\([^\)]+\)/gi;

    const _tmp = document.createElement('div');
    _tmp.style.position = 'absolute';
    _tmp.style.left = '-9999px';
    _tmp.style.width = _tmp.style.height = '1px';
    document.documentElement.appendChild(_tmp);

    function clamp(v, a=0, b=255){ return Math.max(a, Math.min(b, v)); }

    function parseHexColor(str){
        let s = str.replace('#','');
        if(s.length === 3) s = s.split('').map(ch => ch+ch).join('');
        else if(s.length === 4) s = s.split('').map(ch => ch+ch).join('');
        let r=0,g=0,b=0,a=1;
        if(s.length === 6){
            r = parseInt(s.substr(0,2),16); g = parseInt(s.substr(2,2),16); b = parseInt(s.substr(4,2),16);
        } else if(s.length === 8){
            r = parseInt(s.substr(0,2),16); g = parseInt(s.substr(2,2),16); b = parseInt(s.substr(4,2),16);
            a = parseInt(s.substr(6,2),16) / 255;
        }
        return {r,g,b,a};
    }

    function parseRgbString(str){
        const nums = str.match(/[\d\.%]+/g);
        if(!nums) return null;
        let [r,g,b,a] = [0,0,0,1];
        if(nums.length >= 3){
            const parseComponent = (v) => v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v));
            r = parseComponent(nums[0]); g = parseComponent(nums[1]); b = parseComponent(nums[2]);
        }
        if(nums.length >= 4) a = parseFloat(nums[3]);
        return {r,g,b,a};
    }

    function parseHslString(str){
        const parts = str.match(/[\d\.%]+/g);
        if(!parts) return null;
        let h = parseFloat(parts[0]), s = parseFloat(parts[1]) / 100, l = parseFloat(parts[2]) / 100;
        let a = parts.length >= 4 ? parseFloat(parts[3]) : 1;
        const rgb = hslToRgb(h, s, l);
        return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a};
    }

    function hslToRgb(h, s, l){
        h = ((h % 360) + 360) % 360;
        const c = (1 - Math.abs(2*l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c/2;
        let r=0,g=0,b=0;
        if(h < 60) { r=c; g=x; b=0; } else if(h < 120) { r=x; g=c; b=0; } else if(h < 180) { r=0; g=c; b=x; }
        else if(h < 240) { r=0; g=x; b=c; } else if(h < 300) { r=x; g=0; b=c; } else { r=c; g=0; b=x; }
        return { r: (r+m)*255, g: (g+m)*255, b: (b+m)*255 };
    }

    function rgbToHsl(r,g,b){
        r/=255; g/=255; b/=255;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        let h=0,s=0,l=(max+min)/2;
        if(max !== min){
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
                case g: h = ((b - r) / d + 2) * 60; break;
                case b: h = ((r - g) / d + 4) * 60; break;
            }
        }
        return {h, s, l};
    }

    function parseColorString(str){
        if(!str) return null; str = str.trim();
        if(str.toLowerCase() === 'transparent' || str === 'none') return {r:0,g:0,b:0,a:0};
        try{
            if(str[0] === '#') return parseHexColor(str);
            if(str.toLowerCase().startsWith('rgb')) return parseRgbString(str);
            if(str.toLowerCase().startsWith('hsl')) return parseHslString(str);
            _tmp.style.color = ''; _tmp.style.color = str;
            const cs = getComputedStyle(_tmp).color;
            return parseRgbString(cs);
        }catch(e){ return null; }
    }

    function rgbaToCss(o){
        const a = (typeof o.a === 'number') ? o.a : 1;
        return `rgba(${Math.round(o.r)}, ${Math.round(o.g)}, ${Math.round(o.b)}, ${+a.toFixed(3)})`;
    }

    // BU FONKSİYON DEĞİŞTİ: Artık UP_COLOR ve DOWN_COLOR doğrudan kullanılıyor
    function shouldConvertByHue(rgba){
        if(!rgba || rgba.a === 0) return null;

        // Özel div için istisna - bu renk değişmesin
        const {h,s,l} = rgbToHsl(rgba.r, rgba.g, rgba.b);
        if(rgba.r === 230 && rgba.g === 181 && rgba.b === 117) return null;

        if(s > 0.08 && h >= 70 && h <= 170) return 'greenish';
        if(s > 0.08 && (h <= 25 || h >= 300)) return 'reddish';
        return null;
    }

    // BU FONKSİYON DEĞİŞTİ: Artık CHART_FILTERS yerine UP_COLOR ve DOWN_COLOR kullanılıyor
    function convertBasedOnDetection(rgba){
        const det = shouldConvertByHue(rgba);
        if(!det) return rgba;

        if(det === 'greenish'){
            return { ...UP_COLOR, a: rgba.a };
        } else if(det === 'reddish'){
            return { ...DOWN_COLOR, a: rgba.a };
        }
        return rgba;
    }

    function replaceColorTokensInText(text){
        if(!text || typeof text !== 'string') return text;
        let out = text;
        out = out.replace(hexRegex, (m) => {
            const p = parseColorString(m); if(!p) return m;
            const conv = convertBasedOnDetection(p);
            if(conv && (conv.r !== p.r || conv.g !== p.g || conv.b !== p.b || conv.a !== p.a)) return rgbaToCss(conv);
            return m;
        }).replace(rgbRegex, (m) => {
            const p = parseColorString(m); if(!p) return m;
            const conv = convertBasedOnDetection(p);
            if(conv && (conv.r !== p.r || conv.g !== p.g || conv.b !== p.b || conv.a !== p.a)) return rgbaToCss(conv);
            return m;
        }).replace(hslRegex, (m) => {
            const p = parseColorString(m); if(!p) return m;
            const conv = convertBasedOnDetection(p);
            if(conv && (conv.r !== p.r || conv.g !== p.g || conv.b !== p.b || conv.a !== p.a)) return rgbaToCss(conv);
            return m;
        });
        return out;
    }

    function processCssRuleList(rules){
        for(let i=0;i<rules.length;i++){
            const rule = rules[i];
            try{
                if(rule.type === CSSRule.STYLE_RULE){
                    const style = rule.style;
                    for(let j=0;j<style.length;j++){
                        const prop = style[j], val = style.getPropertyValue(prop);
                        const newVal = replaceColorTokensInText(val);
                        if(newVal !== val) try{ style.setProperty(prop, newVal, style.getPropertyPriority(prop)); }catch(e){}
                    }
                } else if(rule.cssRules) processCssRuleList(rule.cssRules);
            }catch(e){ continue; }
        }
    }

    function processStyleSheets(){ for(const sheet of document.styleSheets){ try{ if(sheet.cssRules) processCssRuleList(sheet.cssRules); }catch(e){} } }
    function processStyleTags(){ document.querySelectorAll('style').forEach(tag=>{ try{ const old = tag.textContent, neu = replaceColorTokensInText(old); if(neu !== old) tag.textContent = neu; }catch(e){} }); }
    function processInlineAndSvg(root=document){
        root.querySelectorAll('[style]').forEach(el=>{ try{ const old = el.getAttribute('style'), neu = replaceColorTokensInText(old); if(neu !== old) el.setAttribute('style', neu); }catch(e){} });
        root.querySelectorAll('[fill],[stroke]').forEach(el=>{ ['fill','stroke'].forEach(attr=>{ try{ if(el.hasAttribute(attr)){ const old = el.getAttribute(attr), neu = replaceColorTokensInText(old); if(neu !== old) el.setAttribute(attr, neu); } }catch(e){} }); });
    }

    const computedCheckProps = ['background-color','color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','caret-color','column-rule-color'];
    function isTransparentValue(v){ if(!v) return true; v = v.trim(); return v === 'transparent' || v === 'rgba(0, 0, 0, 0)' || v === 'initial' || v === 'none'; }

    function processComputedStylesBatch(elements, start=0){
        const batch = 250, end = Math.min(elements.length, start + batch);
        for(let i=start;i<end;i++){
            const el = elements[i];
            try{
                const cs = getComputedStyle(el);
                computedCheckProps.forEach(prop=>{
                    try{
                        const val = cs.getPropertyValue(prop);
                        if(!val || isTransparentValue(val)) return;
                        const parsed = parseColorString(val);
                        if(!parsed) return;
                        const conv = convertBasedOnDetection(parsed);
                        if(conv && (conv.r !== parsed.r || conv.g !== parsed.g || conv.b !== parsed.b || conv.a !== parsed.a)) el.style.setProperty(prop, rgbaToCss(conv), 'important');
                    }catch(e){}
                });
                try{ const bs = cs.getPropertyValue('box-shadow'); if(bs && bs !== 'none' && /#|rgba?\(|hsla?\(/i.test(bs)){ const newBs = replaceColorTokensInText(bs); if(newBs !== bs) el.style.setProperty('box-shadow', newBs, 'important'); } }catch(e){}
                try{ const bg = cs.getPropertyValue('background-image'); if(bg && bg !== 'none' && /#|rgba?\(|hsla?\(/i.test(bg)){ const newBg = replaceColorTokensInText(bg); if(newBg !== bg) el.style.setProperty('background-image', newBg, 'important'); } }catch(e){}
            }catch(e){}
        }
        if(end < elements.length) setTimeout(()=> processComputedStylesBatch(elements, end), 20);
    }

    function processAllComputedStylesRoot(root=document){ const elements = Array.from(root.querySelectorAll('*')); processComputedStylesBatch(elements, 0); }

    function patchCanvasContext(ctx){
        try{
            if(!ctx || ctx.__colorPatched) return;
            ctx.__colorPatched = true;
            const convertMaybe = (v) => {
                if(typeof v !== 'string') return v;
                const parsed = parseColorString(v); if(!parsed) return v;
                const conv = convertBasedOnDetection(parsed);
                if(conv && (conv.r !== parsed.r || conv.g !== parsed.g || conv.b !== parsed.b || conv.a !== parsed.a)) return rgbaToCss(conv);
                return v;
            };
            let _fill = ctx.fillStyle, _stroke = ctx.strokeStyle, _shadow = ctx.shadowColor;
            Object.defineProperty(ctx, 'fillStyle', { get(){ return _fill; }, set(v){ _fill = convertMaybe(v); } });
            Object.defineProperty(ctx, 'strokeStyle', { get(){ return _stroke; }, set(v){ _stroke = convertMaybe(v); } });
            Object.defineProperty(ctx, 'shadowColor', { get(){ return _shadow; }, set(v){ _shadow = convertMaybe(v); } });
        }catch(e){}
    }

    const origGetCtx = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args){
        const ctx = origGetCtx.apply(this, [type, ...args]);
        try{ if(type === '2d' && ctx && (!this.closest || !this.closest('.tv-lightweight-charts'))) patchCanvasContext(ctx); }catch(e){}
        return ctx;
    };

    // Yeni fonksiyon: Chart canvas'ını direkt override et
    function overrideChartCanvas() {
        setTimeout(() => {
            const canvases = document.querySelectorAll('.tv-lightweight-charts canvas');
            canvases.forEach(canvas => {
                const ctx = canvas.getContext('2d');
                if (ctx && !ctx.__colorOverridden) {
                    ctx.__colorOverridden = true;

                    const origFill = ctx.fill;
                    const origStroke = ctx.stroke;
                    const origFillRect = ctx.fillRect;
                    const origStrokeRect = ctx.strokeRect;

                    // Fill override
                    ctx.fill = function() {
                        if (this.fillStyle) {
                            if (this.fillStyle === '#26a69a' || this.fillStyle === '#bdff2a' ||
                                this.fillStyle === 'rgb(38, 166, 154)' || this.fillStyle === 'rgb(189, 255, 42)') {
                                this.fillStyle = rgbaToCss(UP_COLOR);
                            } else if (this.fillStyle === '#ef5350' || this.fillStyle === '#ff42ac' ||
                                       this.fillStyle === 'rgb(239, 83, 80)' || this.fillStyle === 'rgb(255, 66, 172)') {
                                this.fillStyle = rgbaToCss(DOWN_COLOR);
                            }
                        }
                        return origFill.apply(this, arguments);
                    };

                    // Stroke override
                    ctx.stroke = function() {
                        if (this.strokeStyle) {
                            if (this.strokeStyle === '#26a69a' || this.strokeStyle === '#bdff2a' ||
                                this.strokeStyle === 'rgb(38, 166, 154)' || this.strokeStyle === 'rgb(189, 255, 42)') {
                                this.strokeStyle = rgbaToCss(UP_COLOR);
                            } else if (this.strokeStyle === '#ef5350' || this.strokeStyle === '#ff42ac' ||
                                       this.strokeStyle === 'rgb(239, 83, 80)' || this.strokeStyle === 'rgb(255, 66, 172)') {
                                this.strokeStyle = rgbaToCss(DOWN_COLOR);
                            }
                        }
                        return origStroke.apply(this, arguments);
                    };

                    // FillRect override
                    ctx.fillRect = function(x, y, w, h) {
                        if (this.fillStyle) {
                            if (this.fillStyle === '#26a69a' || this.fillStyle === '#bdff2a' ||
                                this.fillStyle === 'rgb(38, 166, 154)' || this.fillStyle === 'rgb(189, 255, 42)') {
                                this.fillStyle = rgbaToCss(UP_COLOR);
                            } else if (this.fillStyle === '#ef5350' || this.fillStyle === '#ff42ac' ||
                                       this.fillStyle === 'rgb(239, 83, 80)' || this.fillStyle === 'rgb(255, 66, 172)') {
                                this.fillStyle = rgbaToCss(DOWN_COLOR);
                            }
                        }
                        return origFillRect.apply(this, arguments);
                    };
                }
            });
        }, 1000);
    }

    // Chart observer'ı ekle - chart değişikliklerini takip et
    function observeChartChanges() {
        const chartObserver = new MutationObserver(() => {
            const charts = document.querySelectorAll('.tv-lightweight-charts');
            if (charts.length > 0) {
                applyChartColorFilters();
            }
        });

        chartObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // BU FONKSİYON DEĞİŞTİ: Chart filtreleri artık UP_COLOR ve DOWN_COLOR'a göre dinamik olarak hesaplanıyor
    // BU FONKSİYON TAMAMEN DEĞİŞTİ: Chart renkleri için daha etkili bir yaklaşım
    function applyChartColorFilters() {
        try {
            const oldStyle = document.getElementById('okx-chart-colors-style');
            if (oldStyle) oldStyle.remove();

            const chartStyle = document.createElement('style');
            chartStyle.id = 'okx-chart-colors-style';
            chartStyle.textContent = `
            /* TradingView chart renklerini komple değiştir */
            .tv-lightweight-charts * {
                fill: ${rgbaToCss(UP_COLOR)} !important;
                stroke: ${rgbaToCss(UP_COLOR)} !important;
                color: ${rgbaToCss(UP_COLOR)} !important;
            }

            /* Yeşil/Yukarı renkli elemanlar */
            .tv-lightweight-charts [fill="#26a69a"],
            .tv-lightweight-charts [fill="#bdff2a"],
            .tv-lightweight-charts [fill*="26a69a"],
            .tv-lightweight-charts [fill*="bdff2a"],
            .tv-lightweight-charts [stroke="#26a69a"],
            .tv-lightweight-charts [stroke="#bdff2a"],
            .tv-lightweight-charts [stroke*="26a69a"],
            .tv-lightweight-charts [stroke*="bdff2a"],
            .tv-lightweight-charts [style*="26a69a"],
            .tv-lightweight-charts [style*="bdff2a"] {
                fill: ${rgbaToCss(UP_COLOR)} !important;
                stroke: ${rgbaToCss(UP_COLOR)} !important;
            }

            /* Kırmızı/Aşağı renkli elemanlar */
            .tv-lightweight-charts [fill="#ef5350"],
            .tv-lightweight-charts [fill="#ff42ac"],
            .tv-lightweight-charts [fill*="ef5350"],
            .tv-lightweight-charts [fill*="ff42ac"],
            .tv-lightweight-charts [stroke="#ef5350"],
            .tv-lightweight-charts [stroke="#ff42ac"],
            .tv-lightweight-charts [stroke*="ef5350"],
            .tv-lightweight-charts [stroke*="ff42ac"],
            .tv-lightweight-charts [style*="ef5350"],
            .tv-lightweight-charts [style*="ff42ac"] {
                fill: ${rgbaToCss(DOWN_COLOR)} !important;
                stroke: ${rgbaToCss(DOWN_COLOR)} !important;
            }

            /* Canvas filtreleri - daha agresif yaklaşım */
            .tv-lightweight-charts canvas {
                filter: none !important;
            }

            /* Özel olarak chart çubukları için */
            .tv-lightweight-charts [fill="rgba(38, 166, 154, 0.2)"],
            .tv-lightweight-charts [fill="rgba(37, 167, 80, 0.2)"] {
                fill: ${rgbaToCss({...UP_COLOR, a: 0.2})} !important;
            }

            .tv-lightweight-charts [fill="rgba(239, 83, 80, 0.2)"],
            .tv-lightweight-charts [fill="rgba(202, 63, 100, 0.2)"] {
                fill: ${rgbaToCss({...DOWN_COLOR, a: 0.2})} !important;
            }

            /* Chart arkaplanındaki metin renkleri */
            .tv-lightweight-charts text,
            .tv-lightweight-charts tspan {
                fill: ${rgbaToCss(UP_COLOR)} !important;
                color: ${rgbaToCss(UP_COLOR)} !important;
            }
        `;
            document.head.appendChild(chartStyle);

            // Canvas context'ini de override et
            overrideChartCanvas();

        } catch (e) {
            console.error('Chart style error:', e);
        }
    }

function monitorChartColors() {
    const origFill = CanvasRenderingContext2D.prototype.fill;
    const origStroke = CanvasRenderingContext2D.prototype.stroke;
    const origFillRect = CanvasRenderingContext2D.prototype.fillRect;

    CanvasRenderingContext2D.prototype.fill = function() {
        if (this.fillStyle && typeof this.fillStyle === 'string') {
            const parsed = parseColorString(this.fillStyle);
            if (parsed) {
                const converted = convertBasedOnDetection(parsed);
                if (converted && (converted.r !== parsed.r || converted.g !== parsed.g || converted.b !== parsed.b)) this.fillStyle = rgbaToCss(converted);
            }
        }
        origFill.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.stroke = function() {
        if (this.strokeStyle && typeof this.strokeStyle === 'string') {
            const parsed = parseColorString(this.strokeStyle);
            if (parsed) {
                const converted = convertBasedOnDetection(parsed);
                if (converted && (converted.r !== parsed.r || converted.g !== parsed.g || converted.b !== parsed.b)) this.strokeStyle = rgbaToCss(converted);
            }
        }
        origStroke.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
        if (this.fillStyle && typeof this.fillStyle === 'string') {
            const parsed = parseColorString(this.fillStyle);
            if (parsed) {
                const converted = convertBasedOnDetection(parsed);
                if (converted && (converted.r !== parsed.r || converted.g !== parsed.g || converted.b !== parsed.b)) this.fillStyle = rgbaToCss(converted);
            }
        }
        origFillRect.apply(this, arguments);
    };
}

function processNodeAndChildren(node){
    try{ if(node.nodeType !== 1) return; processInlineAndSvg(node); processAllComputedStylesRoot(node); }catch(e){}
}

const mo = new MutationObserver((mutations)=>{
    const added = [];
    for(const m of mutations){
        if(m.type === 'attributes'){
            const target = m.target;
            try{ if(['style','class','fill','stroke'].includes(m.attributeName)) processNodeAndChildren(target); }catch(e){}
        }
        if(m.addedNodes) m.addedNodes.forEach(n => { if(n.nodeType === 1) added.push(n); });
    }
    if(added.length) setTimeout(()=> added.forEach(n => processNodeAndChildren(n)), 10);
});

function kickAll(){
    try{
        processStyleSheets(); processStyleTags(); processInlineAndSvg(document); processAllComputedStylesRoot(document);
        applyChartColorFilters();
    }catch(e){}
}

function init() {
    loadUserSettings();
    kickAll();

    mo.observe(document.body || document.documentElement, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'fill', 'stroke']
    });

    monitorChartColors();
    addColorPickerToMenu();
    observeChartChanges(); // BU SATIRI EKLEYİN

    const menuObserver = new MutationObserver(() => addColorPickerToMenu());
    menuObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(kickAll, 500);
        setTimeout(kickAll, 2000);
        setTimeout(kickAll, 5000);
        setTimeout(addColorPickerToMenu, 1000);
        setTimeout(applyChartColorFilters, 1500); // BU SATIRI EKLEYİN
    });

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                kickAll();
                addColorPickerToMenu();
                applyChartColorFilters(); // BU SATIRI EKLEYİN
            }, 1000);
        }
    }, 1000);
}
if(document.body) init();
else window.addEventListener('DOMContentLoaded', init);

})();