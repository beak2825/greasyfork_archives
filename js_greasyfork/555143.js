// ==UserScript==
// @name         V2 Модерация ГА/ЗГА/Куратор  Kостомизация для сайта Black Russia Forum
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  Настройка стиля BR Forum + Модерация
// @author       Maras Rofls 
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/555143/V2%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%20K%D0%BE%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/555143/V2%20%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%20K%D0%BE%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const STYLE_ID = 'blackrussia-custom-style-v110';
    const PANEL_ID = 'blackrussia-settings-panel-v110';
    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar-v110';
    const CLOCK_ID = 'br-style-clock-v110';
    const STYLE_ICON_ID = 'br-style-toggle-icon-v110';
    const EFFECTS_CONTAINER_ID = 'br-effects-container-v110';
    const BACKGROUND_ELEMENT_ID = 'br-style-background-v110';
    const TOAST_CONTAINER_ID = 'br-style-toast-container-v110';
    const BOTTOM_NAV_HEIGHT = '38px';
    const MAX_IMAGE_SIZE_MB = 5;

    const PETAL_IMAGES = {
        'sakura': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEBSURBVDhPjZPbSoFREEXP/x8lxaKDSy9QdO0LFDq4dO0FlB6DbxAfwLKLK7S4ECGFShLOrUEGZ3Y2c6YzuDMzwxPjzMi3ncyZcy9TShENsULUgQ/p9Xrd+F7jfyTAXqfT+RGcOxQSiUQn7/d7d09PT19C/jmdTn9XV1d3u66/aQCjLEtEcvl8vu9sNns0iYBHhBAiGOLvQAAdxmMdxpPZuQE5HA6/wnkAZZZl4zgcDo9ms9lSxyNjAFNTU28yMzPzGYIgZJlZ1gXQbrf7fD6fX8uyefc5PT09VqvV36qqaq+srPxoNPiBgBEBDBBCBAIGYFtVVY+1Wm31er3ncrnO7u7u3g4jQI2MjPwD5PM8HR4eHlP4hAXkHo6Ojg5+fgBU4hX+767+AlKFyyVgYk0AAAAASUVORK5CYII=',
        'red_rose': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADnSURBVDhPvZLBDcIwDEVt9x90GCcYwCugjqZWZRkYkCjxh4xE1Nq4sYTE0k8+z/cGt7PjwXe+B5QsyzLMZrP5fD6fLMuyLCKRCFmWmU6nx8fHx77v+1VV1XCFYLVal0qlMp1Op9NOpxMPDw9FUUhEItFqtVqv11uWZcuy7LruuwAopVIpzLIsQogQ4jje3d1dLpdrAGL+AAD8siwjmUwGgMvlMk3TaDQaBEGAYrFYLpd7e3v7LMuaEAIAAEiShCRJ+GDAdV1VVQHAzWYzU1NTyuWyIAjAGQBEUURZlhEEAZIkQcuyDAwM/M0IfwByoXlFZpIAAAAASUVORK5CYII=',
        'autumn_maple': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE8SURBVDhPjZLRisJQFIYjfA/hG+gKOsl1N3VXcAcdx3WPQEeoU6dgNwfcRVxB3Ekf0sAIU5Iy56XkP3Pcl/cnAUEQBEEQfN9nWZaoqhqdpqmdNjc3z+fz+Xq9pt/vz+fz+fn5+TQaDY/Hg99rLpcLx3G6urpKkgR2dnZ0dXWFpmkMwzAM46naAEiS5Pv+5uZmpVIhz/M0TaPdbodhjGEYrus6TdM0TdM0jTETQgghRFFUbG1tJUkCm80GANDv96HrOnmefx/AcdxWqxWLxcg0zTAMu64LwyDsU0qpVLIsK5fLtVqtTqcDogjh+x7AMAz6/T6IoghhGFSSBEIIruk6DEMURfF9/zAMmqYpm81itrYWCoVcLgdsbW0BAKrVKhqNxrZtQRBg2zaWZcViMdjb2wMANG3b9nq9LMtijmNZlrIsSZIQBCRJAtM0/6/8B+gNKuUnPvJ/AAAAAElFTkSuQmCC',
    };

    let settingsPanel = null;
    let settingsIcon = null;
    let bottomNavElement = null;
    let clockElement = null;
    let clockInterval = null;
    let effectsContainer = null;
    let toastContainer = null;
    let myUsername = null;
    let usernameObserver = null;
    let currentSettings = {};

    const defaultSettings = {
        bgImageDataUri: '', opacityValue: 0.9, borderRadius: '8px', bgColor: '#2E2E2E',
        enableRounding: true, enableEdge: true, edgeColor: '#FFEB3B', edgeWidth: '1px', edgeOpacity: 0.7,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        transparentElementsOpacity: 1, enableGradient: false, gradientColor1: '#333333', gradientColor2: '#000000',
        gradientColor3: '#555555', gradientColor4: '#222222', gradientDirection: '135deg',
        enableAnimatedGradient: false, animatedGradientSpeed: '5s',
        enableBottomNav: true, bottomNavOpacity: 0.85, bottomNavBorderRadius: '25px', bottomNavPosition: 'bottom-center',
        quickLinks: [
            { name: 'Главная', url: 'https://forum.blackrussia.online/' },
            { name: 'Правила', url: 'https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.10/' },
            { name: 'Жалобы', url: 'https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.14/' }
        ],
        enableTextGlow: false, textGlowColor: '#FFFF00', textGlowIntensity: '5px',
        effectType: 'none', effectIntensity: 50, effectSpeed: 1,
        effectSwayIntensity: 1, effectRainLength: 20,
        enableBottomNavClock: true,
        bottomNavClockColor: '#E0E0E0',
        customPresets: {},
        enableBlockBlur: false,
        blockBlurAmount: 5,
        enableOwnMessageHighlight: false,
        ownMessageHighlightBgColor: '#2c3e50',
        ownMessageHighlightEdgeColor: '#3498db',
        ownMessageHighlightEdgeWidth: '1px',
        enablePageTransition: false,
        pageTransitionType: 'fade-in',
        pageTransitionDuration: 0.5
    };

    const availableFonts = [
        { name: "Стандартный (Inter)", value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' },
        { name: "Arial / Helvetica", value: 'Arial, Helvetica, sans-serif' },
        { name: "Verdana / Geneva", value: 'Verdana, Geneva, sans-serif' },
        { name: "Tahoma / Geneva", value: 'Tahoma, Geneva, sans-serif' },
        { name: "Segoe UI / Tahoma", value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
        { name: "Times New Roman / Times", value: '"Times New Roman", Times, serif' },
        { name: "Georgia / Serif", value: 'Georgia, serif' },
        { name: "Courier New / Monospace", value: '"Courier New", Courier, monospace' },
        { name: "Roboto", value: 'Roboto, sans-serif' },
        { name: "Open Sans", value: '"Open Sans", sans-serif' },
        { name: "Montserrat", value: 'Montserrat, sans-serif' }
    ];


    const builtInPresets = {
        'new_year': {
            enableGradient: true, gradientColor1: '#0a1931', gradientColor2: '#173a6a', gradientColor3: '#ffffff', gradientColor4: '#0a1931', gradientDirection: '135deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '15s',
            bgColor: '#1a2a47', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 3,
            enableRounding: true, borderRadius: '10px',
            enableEdge: true, edgeColor: '#ffffff', edgeWidth: '1px', edgeOpacity: 0.7,
            enableTextGlow: true, textGlowColor: '#cce7ff', textGlowIntensity: '8px',
            effectType: 'snow', effectIntensity: 100, effectSpeed: 1, effectSwayIntensity: 1.2
        },
        'halloween': {
            enableGradient: true, gradientColor1: '#1a0000', gradientColor2: '#ff6600', gradientColor3: '#000000', gradientColor4: '#3d0000', gradientDirection: '45deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '10s',
            bgColor: '#2b0f00', opacityValue: 0.9, enableBlockBlur: false,
            enableRounding: true, borderRadius: '6px',
            enableEdge: true, edgeColor: '#ff6600', edgeWidth: '2px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#ff9900', textGlowIntensity: '10px',
            effectType: 'leaves-autumn_maple', effectIntensity: 60, effectSpeed: 0.8, effectSwayIntensity: 1
        },
        'valentines': {
            enableGradient: true, gradientColor1: '#ffc0cb', gradientColor2: '#ff69b4', gradientColor3: '#ffe4e1', gradientColor4: '#db7093', gradientDirection: 'to right',
            enableAnimatedGradient: false,
            bgColor: '#4a0e28', opacityValue: 0.85, enableBlockBlur: true, blockBlurAmount: 2,
            enableRounding: true, borderRadius: '12px',
            enableEdge: true, edgeColor: '#ff69b4', edgeWidth: '1px', edgeOpacity: 1,
            enableTextGlow: true, textGlowColor: '#ffc0cb', textGlowIntensity: '7px',
            effectType: 'petals-red_rose', effectIntensity: 70, effectSpeed: 1.2, effectSwayIntensity: 1.5
        },
        'womens_day': {
            enableGradient: true, gradientColor1: '#fdfbfb', gradientColor2: '#ebedee', gradientColor3: '#b0f3f1', gradientColor4: '#fff1eb', gradientDirection: '135deg',
            enableAnimatedGradient: false,
            bgColor: '#fffaf0', opacityValue: 0.9, enableBlockBlur: false,
            enableRounding: true, borderRadius: '8px',
            enableEdge: true, edgeColor: '#ffb6c1', edgeWidth: '2px', edgeOpacity: 0.9,
            enableTextGlow: false,
            effectType: 'petals-sakura', effectIntensity: 80, effectSpeed: 1, effectSwayIntensity: 1
        },
        'victory_day': {
            enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff6600', gradientColor3: '#000000', gradientColor4: '#505050', gradientDirection: '45deg',
            enableAnimatedGradient: false,
            bgColor: '#2a2a2a', opacityValue: 0.9, enableBlockBlur: false,
            enableRounding: true, borderRadius: '4px',
            enableEdge: true, edgeColor: '#ff6600', edgeWidth: '1px', edgeOpacity: 1,
            enableTextGlow: true, textGlowColor: '#ff6600', textGlowIntensity: '5px',
            effectType: 'fireflies', effectIntensity: 50, effectSpeed: 0.7, effectSwayIntensity: 0.5 // "Искры"
        },
        'ramadan': {
            enableGradient: true, gradientColor1: '#000033', gradientColor2: '#004d00', gradientColor3: '#ffd700', gradientColor4: '#000033', gradientDirection: '135deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '18s',
            bgColor: '#001a00', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 4,
            enableRounding: true, borderRadius: '8px',
            enableEdge: true, edgeColor: '#ffd700', edgeWidth: '1px', edgeOpacity: 0.7,
            enableTextGlow: true, textGlowColor: '#ffd700', textGlowIntensity: '6px',
            effectType: 'fireflies', effectIntensity: 70, effectSpeed: 0.5, effectSwayIntensity: 0.8 // "Звезды"
        },
        'cyberpunk': {
            enableGradient: true, gradientColor1: '#000000', gradientColor2: '#ff00ff', gradientColor3: '#00ffff', gradientColor4: '#000000', gradientDirection: '45deg',
            enableAnimatedGradient: true, animatedGradientSpeed: '6s',
            bgColor: '#1a001a', opacityValue: 0.9, enableBlockBlur: true, blockBlurAmount: 2,
            enableRounding: true, borderRadius: '2px',
            enableEdge: true, edgeColor: '#00ffff', edgeWidth: '1px', edgeOpacity: 0.8,
            enableTextGlow: true, textGlowColor: '#ff00ff', textGlowIntensity: '10px',
            effectType: 'matrix', effectIntensity: 90, effectSpeed: 1.2, effectRainLength: 18
        },
        'default_dark': { ...defaultSettings }
    };

    const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

    function hexToRgb(hex) { if (!hex || typeof hex !== 'string') return null; const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }
    function readFileAsDataURL(file) { return new Promise((resolve, reject) => { if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { reject(new Error(`Файл слишком большой! Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`)); return; } const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = (error) => reject(error); reader.readAsDataURL(file); }); }
    function downloadFile(filename, content, contentType) { const blob = new Blob([content], { type: contentType }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    function isValidEffectType(type) { return ['none', 'rain', 'snow', 'petals-sakura', 'petals-red_rose', 'leaves-autumn_maple', 'fireflies', 'matrix', 'bubbles'].includes(type); } // ДОБАВЛЕНО 'bubbles'
    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
    function isValidURL(str) { if (!str || typeof str !== 'string') return false; try { new URL(str); return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ftp://'); } catch (_) { return str.startsWith('/'); } }
    function getRandomInRange(min, max) { return Math.random() * (max - min) + min; }
    function getRandomIntInRange(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }
    function observeDOM(targetNode, callback, options = { childList: true, subtree: true }) { if (!targetNode) return null; const observer = new MutationObserver(callback); observer.observe(targetNode, options); return observer; }
    function injectScript(src) { return new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.async = true; script.onload = resolve; script.onerror = reject; (document.head || document.documentElement).appendChild(script); }); }
    function injectStyle(href) { return new Promise((resolve, reject) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.onload = resolve; link.onerror = reject; (document.head || document.documentElement).appendChild(link); }); }

    function showToast(message, type = 'info', duration = 3000) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = TOAST_CONTAINER_ID;
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.className = `br-toast br-toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.classList.add('br-toast-show'); }, 10);
        setTimeout(() => {
            toast.classList.remove('br-toast-show');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, 500);
        }, duration);
    }

    function validateSetting(key, value, defaultValue) {
        const dValue = (defaultValue !== undefined) ? defaultValue : defaultSettings[key];
        const dType = typeof dValue;
        if (dType === 'boolean') {
            return (value === true || value === 'true');
        }
        if (dType === 'number') {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
                return dValue;
            }
            let numValue = parsedValue;
            if (['opacityValue', 'edgeOpacity', 'bottomNavOpacity', 'transparentElementsOpacity'].includes(key)) {
                numValue = Math.max(0, Math.min(1, numValue));
            } else if (key === 'effectIntensity') {
                numValue = Math.max(10, Math.min(200, parseInt(numValue, 10)));
            } else if (key === 'effectSpeed') {
                numValue = Math.max(0.1, Math.min(5, numValue));
            } else if (key === 'effectSwayIntensity') {
                numValue = Math.max(0, Math.min(3, numValue));
            } else if (key === 'effectRainLength') {
                numValue = Math.max(5, Math.min(50, parseInt(numValue, 10)));
            } else if (key === 'blockBlurAmount') {
                numValue = Math.max(0, Math.min(50, parseInt(numValue, 10)));
            } else if (key === 'pageTransitionDuration') {
                numValue = Math.max(0.1, Math.min(2, numValue));
            } else if (Number.isInteger(dValue)) {
                numValue = parseInt(numValue, 10);
            }
            return numValue;
        }
        if (dType === 'string') {
            const strValue = (typeof value === 'string') ? value : String(dValue);
            if (key === 'effectType' && !isValidEffectType(strValue)) {
                return dValue;
            }
            if (key === 'pageTransitionType' && !['fade-in', 'slide-in-left', 'slide-in-right', 'zoom-in'].includes(strValue)) {
                return dValue;
            }
            if (key === 'borderRadius' && /^\d+$/.test(strValue)) return `${strValue}px`;
            if (key === 'edgeWidth' && /^\d+(\.\d+)?$/.test(strValue)) return `${strValue}px`;
            if (key === 'textGlowIntensity' && /^\d+$/.test(strValue)) return `${strValue}px`;
            if (key === 'animatedGradientSpeed' && /^\d+(\.\d+)?$/.test(strValue)) return `${strValue}s`;
            if (key === 'ownMessageHighlightEdgeWidth' && /^\d+(\.\d+)?$/.test(strValue)) return `${strValue}px`;
            return strValue;
        }
        if (dType === 'object' && dValue !== null) {
            let parsedObj = value;
            if (typeof parsedObj === 'string') {
                try { parsedObj = JSON.parse(parsedObj); } catch (e) { parsedObj = dValue; }
            }
            if (key === 'quickLinks') {
                if (!Array.isArray(parsedObj)) parsedObj = dValue;
                return parsedObj.filter(link => link && typeof link.name === 'string' && typeof link.url === 'string');
            }
            if (key === 'customPresets') {
                if (typeof parsedObj !== 'object' || parsedObj === null || Array.isArray(parsedObj)) parsedObj = dValue;
                return parsedObj;
            }
        }
        return value;
    }

    function addQuickLinkInput(container, link = { name: '', url: '' }) {
        if (!container) return;
        const linkInputDiv = document.createElement('div');
        linkInputDiv.className = 'quick-link-input-item';
        linkInputDiv.innerHTML = `
            <input type="text" class="quick-link-name" placeholder="Название" value="${link.name || ''}">
            <input type="text" class="quick-link-url" placeholder="URL (https://...)" value="${link.url || ''}">
            <button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить ссылку">➖</button>
        `;
        container.appendChild(linkInputDiv);
        linkInputDiv.querySelector('.remove-quick-link-btn').addEventListener('click', () => {
            linkInputDiv.remove();
        });
    }

    async function loadSettings() {
        currentSettings = {};
        const tempDefault = { ...defaultSettings };
        try {
            const settingKeys = Object.keys(tempDefault);
            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, tempDefault[key])));
            settingKeys.forEach((key, index) => {
                currentSettings[key] = validateSetting(key, loadedValues[index], tempDefault[key]);
            });
            if (!currentSettings.quickLinks || !Array.isArray(currentSettings.quickLinks) || currentSettings.quickLinks.length === 0) {
                currentSettings.quickLinks = tempDefault.quickLinks;
            }
            if (typeof currentSettings.customPresets !== 'object' || currentSettings.customPresets === null || Array.isArray(currentSettings.customPresets)) {
                currentSettings.customPresets = tempDefault.customPresets;
            }
        } catch (e) {
            console.error('[BR Style] Ошибка загрузки настроек v11.0!', e);
            currentSettings = { ...defaultSettings };
            showToast('[BR Style] Ошибка загрузки настроек! Применены стандартные значения (v11.0).', 'error');
        }
    }

    async function saveSettings(settingsToSave) {
        try {
            const savePromises = [];
            const validatedSettings = {};
            for (const key in settingsToSave) {
                if (defaultSettings.hasOwnProperty(key)) {
                    let validatedValue = validateSetting(key, settingsToSave[key], defaultSettings[key]);
                    let valueToStore = validatedValue;
                    if (key === 'quickLinks' && Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    } else if (key === 'customPresets' && typeof valueToStore === 'object' && valueToStore !== null && !Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    }
                    savePromises.push(GM_setValue(key, valueToStore));
                    validatedSettings[key] = validatedValue;
                } else {
                    console.warn(`[BR Style] Попытка сохранить неизвестный ключ: ${key}`);
                }
            }
            await Promise.all(savePromises);
            currentSettings = { ...currentSettings, ...validatedSettings };
            return true;
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения настроек v11.0!', e);
            showToast('[BR Style] Ошибка сохранения настроек! (v11.0)', 'error');
            return false;
        }
    }

    function applyForumStyles(settings) {
        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style'); styleElement.id = STYLE_ID; styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
        }
        try {
            const cachedRgb = {}; const getRgb = (hex) => { if (!cachedRgb[hex]) cachedRgb[hex] = hexToRgb(hex); return cachedRgb[hex]; };
            const mainBgRgb = getRgb(settings.bgColor);
            const mainElementBgColor = mainBgRgb ? `rgba(${mainBgRgb.r}, ${mainBgRgb.g}, ${mainBgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;
            const edgeRgb = getRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const edgeWidthValue = (typeof settings.edgeWidth === 'number') ? `${settings.edgeWidth}px` : settings.edgeWidth;
            const finalEdgeBoxShadow = settings.enableEdge ? `0 0 0 ${edgeWidthValue} ${edgeColorWithOpacity}` : 'none';
            const borderRadiusValue = (typeof settings.borderRadius === 'number') ? `${settings.borderRadius}px` : settings.borderRadius;
            const finalBorderRadius = settings.enableRounding ? borderRadiusValue : '0px';
            const fallbackBgColor = settings.bgColor || '#1e1e1e';
            const bottomNavBaseBgRgb = getRgb('#222222');
            const bottomNavFinalBgColor = bottomNavBaseBgRgb ? `rgba(${bottomNavBaseBgRgb.r}, ${bottomNavBaseBgRgb.g}, ${bottomNavBaseBgRgb.b}, ${settings.bottomNavOpacity})` : '#222222';
            let bottomNavPositionStyle = ''; const navBarOffset = '10px';
            switch (settings.bottomNavPosition) {
                case 'bottom-left': bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'bottom-right': bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'top-left': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'top-center': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: 50%; right: auto; transform: translateX(-50%);`; break;
                case 'top-right': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'middle-left': bottomNavPositionStyle = `bottom: auto; top: 50%; left: ${navBarOffset}; right: auto; transform: translateY(-50%);`; break;
                case 'middle-right': bottomNavPositionStyle = `bottom: auto; top: 50%; left: auto; right: ${navBarOffset}; transform: translateY(-50%);`; break;
                case 'bottom-center': default: bottomNavPositionStyle = `bottom: ${navBarOffset}; top: auto; left: 50%; right: auto; transform: translateX(-50%);`; break;
            }
            const mainElementsSelector = `.block-container, .block-filterBar, .message-inner, .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content, .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content, .p-header, .p-nav, .p-navSticky.is-sticky .p-nav, .p-footer`;
            const transparentElementsSelector = `.p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button a.button.button--link, .input, .block-minorTabHeader, .blockMessage, .input:focus, .input.is-focused, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link`;
            const pageWrapperSelector = '.p-pageWrapper';
            const fontTargetSelector = `body, .p-body, .block-body, .message-content, .structItem-title, .node-title, .p-title-value, input, textarea, select, button, .button, .input, .username, .tabs-tab, .block-header`;
            const textGlowTargetSelector = `a:not(.button):not(.tabs-tab), .p-title-value, .structItem-title a, .node-title a, .username, .message-name, .block-header, .pairs dt`;
            let backgroundElementStyle = '';
            const animSpeedValue = (typeof settings.animatedGradientSpeed === 'number') ? `${settings.animatedGradientSpeed}s` : settings.animatedGradientSpeed;
            if (settings.enableAnimatedGradient && settings.enableGradient) {
                backgroundElementStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1}); background-size: 400% 400%; animation: animatedGradient ${animSpeedValue} ease infinite;`;
            } else if (settings.enableGradient) {
                backgroundElementStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important;`;
            } else if (settings.bgImageDataUri) {
                backgroundElementStyle = `background-image: url('${settings.bgImageDataUri}') !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important;`;
            } else {
                backgroundElementStyle = `background-color: ${fallbackBgColor} !important;`;
            }
            const animatedGradientKeyframes = (settings.enableAnimatedGradient && settings.enableGradient)
                ? `@keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`
                : '';
            const finalBlockBlur = settings.enableBlockBlur ? `blur(${settings.blockBlurAmount}px)` : 'none';
            const glowIntensityValue = (typeof settings.textGlowIntensity === 'number') ? `${settings.textGlowIntensity}px` : settings.textGlowIntensity;
            const ownMsgEdgeWidthValue = (typeof settings.ownMessageHighlightEdgeWidth === 'number') ? `${settings.ownMessageHighlightEdgeWidth}px` : settings.ownMessageHighlightEdgeWidth;
            const ownMessageHighlightStyle = (settings.enableOwnMessageHighlight && myUsername) ? `
                .message[data-author="${myUsername}"] .message-inner {
                    background-color: ${settings.ownMessageHighlightBgColor} !important;
                    border: ${ownMsgEdgeWidthValue} solid ${settings.ownMessageHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            let pageTransitionStyle = '';
            if (settings.enablePageTransition) {
                const duration = (typeof settings.pageTransitionDuration === 'number') ? `${settings.pageTransitionDuration}s` : '0.5s';
                pageTransitionStyle = `
                    .p-pageWrapper {
                        animation-name: br-page-transition-${settings.pageTransitionType};
                        animation-duration: ${duration};
                        animation-timing-function: ease-out;
                        animation-fill-mode: both;
                    }
                `;
            }
            const forumCss = `
                ${fontTargetSelector} {
                    ${settings.fontFamily ? `font-family: ${settings.fontFamily} !important;` : ''}
                }
                #${BACKGROUND_ELEMENT_ID} {
                    ${backgroundElementStyle}
                }
                ${animatedGradientKeyframes}
                ${pageWrapperSelector}, ${mainElementsSelector} {
                    background-color: ${mainElementBgColor} !important;
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                    ${settings.enableRounding ? 'overflow: hidden;' : ''}
                    backdrop-filter: ${finalBlockBlur};
                    -webkit-backdrop-filter: ${finalBlockBlur};
                }
                ${transparentElementsSelector} {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: ${settings.transparentElementsOpacity} !important;
                }
                ${settings.enableTextGlow ? `${textGlowTargetSelector}, .fa, .fab, .fas, .far { text-shadow: 0 0 ${glowIntensityValue} ${settings.textGlowColor}; }` : ''}
                ${ownMessageHighlightStyle}
                ${pageTransitionStyle}
                #${BOTTOM_NAV_ID} {
                    ${settings.enableBottomNav ? 'display: flex !important;' : 'display: none !important;'}
                    background-color: ${bottomNavFinalBgColor} !important;
                    border-radius: ${settings.bottomNavBorderRadius} !important;
                    ${bottomNavPositionStyle}
                }
                #${CLOCK_ID} {
                    color: ${settings.bottomNavClockColor || '#e0e0e0'};
                    display: ${settings.enableBottomNavClock ? 'inline-block' : 'none'} !important;
                }
                #${EFFECTS_CONTAINER_ID} {
                    display: ${settings.effectType !== 'none' ? 'block' : 'none'};
                }
            `;
            styleElement.textContent = forumCss;
        } catch (e) {
            console.error('[BR Style] Ошибка применения динамических стилей v11.0!', e);
            if (styleElement) styleElement.textContent = '';
        }
    }

    function populateCustomPresetList() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        if (!select) return;
        const currentVal = select.value;
        select.innerHTML = '<option value="">-- Выберите пресет --</option>';
        const sortedKeys = Object.keys(currentSettings.customPresets || {}).sort((a, b) => a.localeCompare(b));
        for (const presetName of sortedKeys) {
            select.add(new Option(presetName, presetName));
        }
        if (Array.from(select.options).some(opt => opt.value === currentVal)) {
            select.value = currentVal;
        } else {
            select.value = "";
        }
    }

    async function handleSaveCustomPreset() {
        if (!settingsPanel) return;
        const nameInput = settingsPanel.querySelector('#s_newPresetName');
        const presetName = nameInput.value.trim();
        if (!presetName) {
            showToast('❌ Введите название пресета!', 'error');
            return;
        }
        if (currentSettings.customPresets.hasOwnProperty(presetName)) {
            if (!confirm(`Пресет "${presetName}" уже существует. Перезаписать?`)) {
                return;
            }
        }
        const saveBtn = settingsPanel.querySelector('#save-preset-btn');
        saveBtn.textContent = 'Сохранение...';
        saveBtn.disabled = true;
        const presetData = {};
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets' && key !== 'bgImageDataUri') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                presetData[key] = value;
            }
        });
        const newPresets = { ...currentSettings.customPresets, [presetName]: presetData };
        const success = await saveSettings({ customPresets: newPresets });
        if (success) {
            showToast(`✅ Пресет "${presetName}" сохранен!`, 'success');
            nameInput.value = '';
            populateCustomPresetList();
        } else {
            showToast('❌ Ошибка сохранения пресета!', 'error');
        }
        saveBtn.textContent = 'Сохранить';
        saveBtn.disabled = false;
    }

    function handleLoadCustomPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Пресет не выбран!', 'error');
            return;
        }
        const presetData = currentSettings.customPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные пресета!', 'error');
            return;
        }
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (presetData.hasOwnProperty(key)) {
                const value = presetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
             initializeVisibilityFunc();
        }
        showToast(`✅ Пресет "${presetName}" загружен. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }

    function handleLoadBuiltInPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_builtInPresetSelect');
        const presetName = select.value;

        if (!presetName) {
            showToast('❌ Тема не выбрана!', 'error');
            return;
        }
        
        const presetData = builtInPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные темы!', 'error');
            return;
        }

        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (presetData.hasOwnProperty(key)) {
                const value = presetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            } else if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets' && key !== 'bgImageDataUri') {
                 м
                 const defaultValue = defaultSettings[key];
                 if (input.type === 'checkbox') {
                    input.checked = !!defaultValue;
                 } else if (input.type === 'range') {
                    input.value = defaultValue;
                    updateSliderValue(input);
                 } else {
                    input.value = defaultValue;
                 }
            }
        });

        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        if (bgFileInput) bgFileInput.value = '';

        к
        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
            initializeVisibilityFunc();
        }

        showToast(`✅ Тема "${select.options[select.selectedIndex].text}" загружена. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }
    
    async function handleDeleteCustomPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Пресет не выбран!', 'error');
            return;
        }
        if (!confirm(`Вы уверены, что хотите удалить пресет "${presetName}"?`)) {
            return;
        }
        const newPresets = { ...currentSettings.customPresets };
        delete newPresets[presetName];
        const success = await saveSettings({ customPresets: newPresets });
        if (success) {
            showToast(`✅ Пресет "${presetName}" удален.`, 'success');
            populateCustomPresetList();
        } else {
            showToast('❌ Ошибка удаления пресета!', 'error');
        }
    }

    function updateSliderValue(slider) {
        if (!settingsPanel) return;
        const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }
    }

        function createPanelHTML() {
        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
        const panelDiv = document.createElement('div');
        panelDiv.id = PANEL_ID;
        try {
            const fontOptionsHtml = availableFonts.map(font => `<option value="${font.value}">${font.name}</option>`).join('');
            const createSlider = (id, key, label, min, max, step, unit = '') => `
                <div>
                    <label for="s_${id}">${label}: <span class="slider-value" id="val_${id}"></span><span class="slider-unit">${unit}</span></label>
                    <input type="range" id="s_${id}" name="${id}" data-setting-key="${key}" min="${min}" max="${max}" step="${step}">
                </div>`;
            const gradientDirectionOptions = [
                { name: 'По диагонали (↘)', value: '135deg' },
                { name: 'По диагонали (↗)', value: '45deg' },
                { name: 'Вниз (↓)', value: 'to bottom' },
                { name: 'Направо (→)', value: 'to right' },
                { name: 'Вверх (↑)', value: 'to top' },
                { name: 'Налево (←)', value: 'to left' },
                { name: 'Круг (из центра)', value: 'circle' }
            ].map(opt => `<option value="${opt.value}">${opt.name}</option>`).join('');
            panelDiv.innerHTML = `
                <h3>🎨 Настройки Стиля Форума v11.0.3</h3>
                <nav class="panel-tabs">
                    <button class="panel-tab-link active" data-tab="tab-main">Главное</button>
                    <button class="panel-tab-link" data-tab="tab-visuals">Визуал</button>
                    <button class="panel-tab-link" data-tab="tab-interface">Интерфейс</button>
                    <button class="panel-tab-link" data-tab="tab-presets">Пресеты</button>
                </nav>
                <div class="panel-tab-content active" id="tab-main">
                    <h4>-- Фон & Основные Элементы --</h4>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableGradient" name="enableGradient" data-setting-key="enableGradient">
                        <label for="s_enableGradient" class="inline-label">🌈 Градиентный фон</label>
                        <div class="sub-settings" id="gradient-sub-settings">
                            <div><label for="s_gradientColor1">Цвет 1:</label><input type="color" id="s_gradientColor1" name="gradientColor1" data-setting-key="gradientColor1"></div>
                            <div style="margin-top: 8px;"><label for="s_gradientColor2">Цвет 2:</label><input type="color" id="s_gradientColor2" name="gradientColor2" data-setting-key="gradientColor2"></div>
                            <div style="margin-top: 8px;"><label for="s_gradientColor3">Цвет 3:</label><input type="color" id="s_gradientColor3" name="gradientColor3" data-setting-key="gradientColor3"></div>
                            <div style="margin-top: 8px;"><label for="s_gradientColor4">Цвет 4:</label><input type="color" id="s_gradientColor4" name="gradientColor4" data-setting-key="gradientColor4"></div>
                            <div style="margin-top: 8px;">
                                <label for="s_gradientDirection">Направление:</label>
                                <select id="s_gradientDirection" name="gradientDirection" data-setting-key="gradientDirection">${gradientDirectionOptions}</select>
                            </div>
                            <div style="margin-top: 12px;">
                                <input type="checkbox" id="s_enableAnimatedGradient" name="enableAnimatedGradient" data-setting-key="enableAnimatedGradient">
                                <label for="s_enableAnimatedGradient" class="inline-label">💫 Анимированный градиент</label>
                                <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top: 5px;">
                                    ${createSlider('animatedGradientSpeed', 'animatedGradientSpeed', 'Скорость', 1, 30, 0.5, 's')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="setting-group" id="bg-image-setting-group">
                        <label for="s_bgImageFile">🖼️ Фон (изображение):</label>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <input type="file" id="s_bgImageFile" name="bgImageFile" accept="image/*" style="flex-grow: 1; font-size: 11px;">
                            <button id="clear-bg-btn" title="Удалить фон" class="panel-small-btn panel-btn-danger">❌</button>
                        </div>
                        <small id="bg-status" class="panel-status-text">Фон не задан.</small>
                    </div>
                    <hr>
                    <div class="setting-group">
                        <label for="s_bgColor">🎨 Цвет Блоков:</label>
                        <input type="color" id="s_bgColor" name="bgColor" data-setting-key="bgColor">
                    </div>
                    <div class="setting-group">
                        ${createSlider('opacityValue', 'opacityValue', '💧 Прозрачность Блоков', 0, 1, 0.05)}
                    </div>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableBlockBlur" name="enableBlockBlur" data-setting-key="enableBlockBlur">
                        <label for="s_enableBlockBlur" class="inline-label">🌫️ Размытие блоков (Backdrop)</label>
                        <div class="sub-settings" id="block-blur-sub-settings">
                            ${createSlider('blockBlurAmount', 'blockBlurAmount', 'Сила размытия', 0, 50, 1, 'px')}
                        </div>
                    </div>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableRounding" name="enableRounding" data-setting-key="enableRounding">
                        <label for="s_enableRounding" class="inline-label">📐 Скругление</label>
                        <div class="sub-settings" id="rounding-sub-settings">
                            ${createSlider('borderRadius', 'borderRadius', 'Радиус', 0, 50, 1, 'px')}
                        </div>
                    </div>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableEdge" name="enableEdge" data-setting-key="enableEdge">
                        <label for="s_enableEdge" class="inline-label">✨ Окантовка</label>
                        <div class="sub-settings" id="edge-sub-settings">
                            <div><label for="s_edgeColor">Цвет:</label> <input type="color" id="s_edgeColor" name="edgeColor" data-setting-key="edgeColor"></div>
                            <div style="margin-top: 8px;">
                                ${createSlider('edgeWidth', 'edgeWidth', 'Толщина', 0, 10, 0.5, 'px')}
                            </div>
                            <div style="margin-top: 8px;">
                                 ${createSlider('edgeOpacity', 'edgeOpacity', 'Прозрачность', 0, 1, 0.05)}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-tab-content" id="tab-visuals">
                    <h4>-- Шрифт & Текст --</h4>
                    <div class="setting-group">
                        <label for="s_fontFamily">📝 Шрифт Форума:</label>
                        <select id="s_fontFamily" name="fontFamily" data-setting-key="fontFamily"> ${fontOptionsHtml} </select>
                    </div>
                     <div class="setting-group">
                        <input type="checkbox" id="s_enableTextGlow" name="enableTextGlow" data-setting-key="enableTextGlow">
                        <label for="s_enableTextGlow" class="inline-label">💡 Освещение текста</label>
                        <div class="sub-settings" id="text-glow-sub-settings">
                            <div><label for="s_textGlowColor">Цвет:</label> <input type="color" id="s_textGlowColor" name="textGlowColor" data-setting-key="textGlowColor"></div>
                            <div style="margin-top: 8px;">
                                ${createSlider('textGlowIntensity', 'textGlowIntensity', 'Интенсивность', 0, 20, 1, 'px')}
                            </div>
                        </div>
                    </div>
                    <div class="setting-group">
                        ${createSlider('transparentElementsOpacity', 'transparentElementsOpacity', '👻 Прозрачность Фона Элементов', 0, 1, 0.05)}
                        <small class="panel-status-text">Фон сообщений, блоков и т.д.</small>
                    </div>
                    <h4>-- Визуальные Эффекты V3 --</h4>
                    <div class="setting-group">
                        <label for="s_effectType">Тип Эффекта:</label>
                        <select id="s_effectType" name="effectType" data-setting-key="effectType">
                            <option value="none">Отключено</option>
                            <option value="rain">Дождь 🌧️</option>
                            <option value="snow">Снег ❄️</option>
                            <option value="petals-sakura">Лепестки Сакуры 🌸</option>
                            <option value="petals-red_rose">Лепестки Розы (кр.) 🌹</option>
                            <option value="leaves-autumn_maple">Листья Клена (ос.) 🍂</option>
                            <option value="fireflies">Светлячки (Блужд.) ✨</option>
                            <option value="matrix">Матрица 💻</option>
                            <option value="bubbles">Пузырьки 🫧</option>
                        </select>
                    </div>
                    <div class="setting-group sub-settings" id="effect-details-settings">
                         ${createSlider('effectIntensity', 'effectIntensity', 'Интенсивность (Кол-во)', 10, 200, 10)}
                         ${createSlider('effectSpeed', 'effectSpeed', 'Скорость (Множитель)', 0.1, 5, 0.1)}
                        <div class="effect-specific-settings rain-settings matrix-settings" style="display:none; margin-top: 8px;">
                             ${createSlider('effectRainLength', 'effectRainLength', 'Длина (капли/симв.)', 5, 50, 1, 'px')}
                        </div>
                        <div class="effect-specific-settings sway-settings" style="display:none; margin-top: 8px;">
                             ${createSlider('effectSwayIntensity', 'effectSwayIntensity', 'Покачивание (Множитель)', 0, 3, 0.1)}
                        </div>
                        <small class="panel-status-text">Настройте вид и поведение частиц.</small>
                    </div>
                </div>
                <div class="panel-tab-content" id="tab-interface">
                    <h4>-- Мои Сообщения --</h4>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableOwnMessageHighlight" name="enableOwnMessageHighlight" data-setting-key="enableOwnMessageHighlight">
                        <label for="s_enableOwnMessageHighlight" class="inline-label">👤 Выделять мои сообщения</label>
                        <small id="my-username-status" class="panel-status-text">Ваш ник: (не найден)</small>
                        <div class="sub-settings" id="own-message-highlight-sub-settings">
                            <div><label for="s_ownMessageHighlightBgColor">Цвет фона:</label> <input type="color" id="s_ownMessageHighlightBgColor" name="ownMessageHighlightBgColor" data-setting-key="ownMessageHighlightBgColor"></div>
                            <div style="margin-top: 8px;"><label for="s_ownMessageHighlightEdgeColor">Цвет окантовки:</label> <input type="color" id="s_ownMessageHighlightEdgeColor" name="ownMessageHighlightEdgeColor" data-setting-key="ownMessageHighlightEdgeColor"></div>
                            <div style="margin-top: 8px;">
                                ${createSlider('ownMessageHighlightEdgeWidth', 'ownMessageHighlightEdgeWidth', 'Толщина окантовки', 0, 10, 0.5, 'px')}
                            </div>
                        </div>
                    </div>
                    <h4>-- 🎬 Анимации Переходов --</h4>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enablePageTransition" name="enablePageTransition" data-setting-key="enablePageTransition">
                        <label for="s_enablePageTransition" class="inline-label">Включить анимацию</label>
                        <div class="sub-settings" id="page-transition-sub-settings">
                            <div>
                                <label for="s_pageTransitionType">Тип анимации:</label>
                                <select id="s_pageTransitionType" name="pageTransitionType" data-setting-key="pageTransitionType">
                                    <option value="fade-in">Появление (Fade In)</option>
                                    <option value="slide-in-left">Сдвиг слева (Slide In Left)</option>
                                    <option value="slide-in-right">Сдвиг справа (Slide In Right)</option>
                                    <option value="zoom-in">Приближение (Zoom In)</option>
                                </select>
                            </div>
                            <div style="margin-top: 8px;">
                                ${createSlider('pageTransitionDuration', 'pageTransitionDuration', 'Длительность', 0.1, 2, 0.1, 's')}
                            </div>
                        </div>
                    </div>
                    <h4>-- Нижняя Панель Навигации 🧭 --</h4>
                    <div class="setting-group">
                        <input type="checkbox" id="s_enableBottomNav" name="enableBottomNav" data-setting-key="enableBottomNav">
                        <label for="s_enableBottomNav" class="inline-label">Включить панель</label>
                    </div>
                    <div class="setting-group">
                        <label for="s_bottomNavPosition">Позиция:</label>
                        <select id="s_bottomNavPosition" name="bottomNavPosition" data-setting-key="bottomNavPosition">
                            <option value="bottom-center">Внизу по центру</option> <option value="bottom-left">Внизу слева</option> <option value="bottom-right">Внизу справа</option>
                            <option value="top-center">Вверху по центру</option> <option value="top-left">Вверху слева</option> <option value="top-right">Вверху справа</option>
                            <option value="middle-left">Посередине слева</option> <option value="middle-right">Посередине справа</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        ${createSlider('bottomNavOpacity', 'bottomNavOpacity', 'Прозрачность', 0, 1, 0.05)}
                    </div>
                    <div class="setting-group">
                        <label for="s_bottomNavBorderRadius">Скругление:</label>
                        <input type="text" id="s_bottomNavBorderRadius" name="bottomNavBorderRadius" data-setting-key="bottomNavBorderRadius" placeholder="10px, 25px...">
                    </div>
                    <div class="setting-group">
                         <input type="checkbox" id="s_enableBottomNavClock" name="enableBottomNavClock" data-setting-key="enableBottomNavClock">
                         <label for="s_enableBottomNavClock" class="inline-label">⏱️ Показывать часы</label>
                         <div class="sub-settings" id="clock-sub-settings" style="margin-top: 5px;">
                              <label for="s_bottomNavClockColor">Цвет часов:</label>
                              <input type="color" id="s_bottomNavClockColor" name="bottomNavClockColor" data-setting-key="bottomNavClockColor">
                         </div>
                    </div>
                     <div class="setting-group dynamic-links-group">
                        <label>Быстрые ссылки:</label>
                        <div id="quick-links-container"></div>
                        <button id="add-quick-link-btn" class="panel-btn panel-btn-add" style="margin-top: 10px; width: 100%;">➕ Добавить ссылку</button>
                    </div>
                </div>
                <div class="panel-tab-content" id="tab-presets">

                    <h4>-- 🎁 Встроенные Пресеты --</h4>
                    <div class="setting-group preset-manager">
                        <label for="s_builtInPresetSelect" style="font-weight: bold; color: #fff;">Выберите тему:</label>
                        <select id="s_builtInPresetSelect" name="builtInPresetSelect" style="margin-bottom: 8px; margin-top: 4px;">
                            <option value="">-- Выберите тему --</option>
                            <option value="new_year">Новый Год 🎄</option>
                            <option value="halloween">Хэллоуин 🎃</option>
                            <option value="valentines">День Св. Валентина 💖</option>
                            <option value="womens_day">8 Марта 🌷</option>
                            <option value="victory_day">День Победы 🎖️</option>
                            <option value="ramadan">Рамадан 🌙</option>
                            <option value="cyberpunk">Киберпанк 🌃</option>
                            <option value="default_dark">Стандартный Темный 🌑</option>
                        </select>
                        <button id="load-builtin-preset-btn" class="panel-btn" style="width: 100%; background-color: #17a2b8; color: white; font-size: 13px;">Загрузить тему</button>
                    </div>
                    <h4>-- 💾 Мои Пресеты --</h4>
                    <div class="setting-group preset-manager">
                        <label for="s_customPresetSelect" style="font-weight: bold; color: #fff;">Управление пресетами</label>
                        <select id="s_customPresetSelect" name="customPresetSelect" style="margin-bottom: 8px; margin-top: 4px;"></select>
                        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                            <button id="load-preset-btn" class="panel-btn" style="flex: 1; background-color: #2196F3; color: white; font-size: 12px; padding: 5px;">Загрузить</button>
                            <button id="delete-preset-btn" class="panel-btn panel-btn-danger" style="flex: 1; font-size: 12px; padding: 5px;">Удалить</button>
                        </div>
                        <label for="s_newPresetName" style="margin-top: 10px;">Сохранить текущие как новый пресет:</label>
                        <input type="text" id="s_newPresetName" placeholder="Название нового пресета" style="margin-bottom: 8px; margin-top: 4px;">
                        <button id="save-preset-btn" class="panel-btn panel-btn-save" style="width: 100%; font-size: 13px;">Сохранить пресет</button>
                    </div>
                </div>
                <p class="author-credit">Автор: С любовью Maras Rofls✨ Контакт: https://vk.com/lorenzooff
                <div class="button-group">
                    <button id="export-btn" class="panel-btn panel-btn-export" title="Экспорт">📤</button>
                    <button id="import-btn" class="panel-btn panel-btn-import" title="Импорт">📥</button>
                    <input type="file" id="import-settings-file" accept=".json" style="display: none;">
                    <span style="flex-grow: 1;"></span>
                    <button id="reset-btn" class="panel-btn panel-btn-reset" title="Сбросить всё">🔄</button>
                    <button id="save-btn" class="panel-btn panel-btn-save">💾 Сохранить</button>
                    <button id="close-btn" class="panel-btn panel-btn-close">❌ Закрыть</button>
                </div>
            `;
            document.body.appendChild(panelDiv);
          
            panelDiv.querySelector('.panel-tabs').addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const tabId = e.target.dataset.tab;
                    panelDiv.querySelectorAll('.panel-tab-link').forEach(btn => btn.classList.remove('active'));
                    panelDiv.querySelectorAll('.panel-tab-content').forEach(content => content.classList.remove('active'));
                    e.target.classList.add('active');
                    panelDiv.querySelector(`#${tabId}`).classList.add('active');
                }
            });
            const saveBtn = panelDiv.querySelector('#save-btn');
            const bgFileInput = panelDiv.querySelector('#s_bgImageFile');
            const clearBgBtn = panelDiv.querySelector('#clear-bg-btn');
            const bgStatus = panelDiv.querySelector('#bg-status');
            const exportBtn = panelDiv.querySelector('#export-btn');
            const importBtn = panelDiv.querySelector('#import-btn');
            const importFileInput = panelDiv.querySelector('#import-settings-file');
            const addQuickLinkBtn = panelDiv.querySelector('#add-quick-link-btn');
            const quickLinksContainer = panelDiv.querySelector('#quick-links-container');
            const resetBtn = panelDiv.querySelector('#reset-btn');
            const loadPresetBtn = panelDiv.querySelector('#load-preset-btn');
            const loadBuiltInPresetBtn = panelDiv.querySelector('#load-builtin-preset-btn'); // ДОБАВЛЕНО
            const savePresetBtn = panelDiv.querySelector('#save-preset-btn');
            const deletePresetBtn = panelDiv.querySelector('#delete-preset-btn');
           
            const enableGradientCheckbox = panelDiv.querySelector('#s_enableGradient');
            const gradientSubSettings = panelDiv.querySelector('#gradient-sub-settings');
            const enableAnimatedGradientCheckbox = panelDiv.querySelector('#s_enableAnimatedGradient');
            const animatedGradientSubSettings = panelDiv.querySelector('#animated-gradient-sub-settings');
            const bgImageSettingGroup = panelDiv.querySelector('#bg-image-setting-group');
            const enableRoundingCheckbox = panelDiv.querySelector('#s_enableRounding');
            const roundingSubSettings = panelDiv.querySelector('#rounding-sub-settings');
            const enableEdgeCheckbox = panelDiv.querySelector('#s_enableEdge');
            const edgeSubSettings = panelDiv.querySelector('#edge-sub-settings');
            const enableTextGlowCheckbox = panelDiv.querySelector('#s_enableTextGlow');
            const textGlowSubSettings = panelDiv.querySelector('#text-glow-sub-settings');
            const effectTypeSelect = panelDiv.querySelector('#s_effectType');
            const effectDetailsSettings = panelDiv.querySelector('#effect-details-settings');
            const effectRainSettings = panelDiv.querySelector('.rain-settings');
            const effectSwaySettings = panelDiv.querySelector('.sway-settings');
            const effectMatrixSettings = panelDiv.querySelector('.matrix-settings');
            const enableBottomNavClockCheckbox = panelDiv.querySelector('#s_enableBottomNavClock');
            const clockSubSettings = panelDiv.querySelector('#clock-sub-settings');
            const enableBlockBlurCheckbox = panelDiv.querySelector('#s_enableBlockBlur');
            const blockBlurSubSettings = panelDiv.querySelector('#block-blur-sub-settings');
            const enableOwnMessageHighlightCheckbox = panelDiv.querySelector('#s_enableOwnMessageHighlight');
            const ownMessageHighlightSubSettings = panelDiv.querySelector('#own-message-highlight-sub-settings');
            const enablePageTransitionCheckbox = panelDiv.querySelector('#s_enablePageTransition');
            const pageTransitionSubSettings = panelDiv.querySelector('#page-transition-sub-settings');

            const toggleEffectSubSettings = () => {
                const effectType = effectTypeSelect.value; const showDetails = effectType !== 'none'; effectDetailsSettings.style.display = showDetails ? 'block' : 'none'; if (showDetails) { effectRainSettings.style.display = (effectType === 'rain') ? 'block' : 'none'; effectMatrixSettings.style.display = (effectType === 'matrix') ? 'block' : 'none'; effectSwaySettings.style.display = (effectType.startsWith('snow') || effectType.startsWith('petals') || effectType.startsWith('leaves') || effectType === 'fireflies' || effectType === 'bubbles') ? 'block' : 'none'; } else { effectRainSettings.style.display = 'none'; effectSwaySettings.style.display = 'none'; effectMatrixSettings.style.display = 'none'; }
            };
            const toggleGenericSubSettings = (checkbox, subSettingsDiv) => {
                if (checkbox && subSettingsDiv) subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';
            };
            const initializeSubSettingsVisibility = () => {
                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);
                toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings);
                toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings);
                toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings);
                toggleEffectSubSettings();
                toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings);
                toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings);
                toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings);
                toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings);
                if (bgImageSettingGroup) {
                    bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                }
                 if (animatedGradientSubSettings) {
                    animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
                }
                 panelDiv.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
            };
             if (effectTypeSelect) {
                 effectTypeSelect.brInitializeVisibility = initializeSubSettingsVisibility;
             }
            enableGradientCheckbox.addEventListener('change', () => {
                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);
                if (bgImageSettingGroup) bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                if (animatedGradientSubSettings) animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
            });
            enableAnimatedGradientCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings));
            enableRoundingCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings));
            enableEdgeCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings));
            enableTextGlowCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings));
            effectTypeSelect.addEventListener('change', toggleEffectSubSettings);
            enableBottomNavClockCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings));
            enableBlockBlurCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBlockBlurCheckbox, blockBlurSubSettings));
            enableOwnMessageHighlightCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableOwnMessageHighlightCheckbox, ownMessageHighlightSubSettings));
            enablePageTransitionCheckbox.addEventListener('change', () => toggleGenericSubSettings(enablePageTransitionCheckbox, pageTransitionSubSettings));
            panelDiv.querySelectorAll('input[type="range"]').forEach(slider => {
                slider.addEventListener('input', () => updateSliderValue(slider));
            });
            addQuickLinkBtn.addEventListener('click', () => addQuickLinkInput(quickLinksContainer));
            resetBtn.addEventListener('click', handleReset);
            saveBtn.addEventListener('click', handleSave);
            clearBgBtn.addEventListener('click', handleClearBg);
            panelDiv.querySelector('#close-btn').addEventListener('click', closePanel);
            loadPresetBtn.addEventListener('click', handleLoadCustomPreset);
            loadBuiltInPresetBtn.addEventListener('click', handleLoadBuiltInPreset); // ДОБАВЛЕНО
            savePresetBtn.addEventListener('click', handleSaveCustomPreset);
            deletePresetBtn.addEventListener('click', handleDeleteCustomPreset);
            exportBtn.addEventListener('click', handleExport);
            importBtn.addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', handleImport);
            initializeSubSettingsVisibility();
            settingsPanel = panelDiv;
            return panelDiv;
        } catch (e) {
            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА создания HTML панели настроек v11.0!', e);
            if (panelDiv && panelDiv.parentNode) {
                 panelDiv.parentNode.removeChild(panelDiv);
            }
            showToast('[BR Style] Критическая ошибка создания панели настроек (v11.0)!', 'error');
            return null;
        }
    }


    async function handleReset() {
        if (!confirm('Вы уверены, что хотите сбросить ВСЕ настройки стиля к значениям по умолчанию (v11.0)? Это действие необратимо.')) return;
        if (!settingsPanel) return;
        const resetBtn = settingsPanel.querySelector('#reset-btn');
        if (!resetBtn) return;
        const originalBtnText = resetBtn.textContent; resetBtn.textContent = 'Сброс...⏳'; resetBtn.disabled = true;
        const settingsToReset = { ...defaultSettings };
        settingsToReset.customPresets = currentSettings.customPresets;
        const success = await saveSettings(settingsToReset);
        if (success) {
            openPanel();
            applyForumStyles(currentSettings);
            updateBottomNavBarContent(currentSettings);
            manageVisualEffects(currentSettings);
            const bgStatus = settingsPanel.querySelector('#bg-status'); if(bgStatus) bgStatus.textContent = 'Фон не задан.';
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
            showToast('Настройки сброшены по умолчанию!', 'success');
            resetBtn.textContent = 'Сброшено! ✅'; resetBtn.style.backgroundColor = '#ffc107';
            setTimeout(() => { resetBtn.textContent = '🔄'; resetBtn.style.backgroundColor = ''; resetBtn.disabled = false; }, 1500);
        } else {
            showToast('Ошибка при сбросе настроек!', 'error');
            resetBtn.textContent = 'Ошибка! ❌'; resetBtn.style.backgroundColor = '#dc3545';
            setTimeout(() => { resetBtn.textContent = '🔄'; resetBtn.style.backgroundColor = ''; resetBtn.disabled = false; }, 2000);
        }
    }

    async function handleSave() {
        if (!settingsPanel) return;
        const saveBtn = settingsPanel.querySelector('#save-btn');
         if (!saveBtn) return;
        const originalBtnText = saveBtn.textContent; saveBtn.textContent = 'Сохранение...⏳'; saveBtn.disabled = true;
        let errorOccurred = false;
        const settingsToUpdate = {};
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                settingsToUpdate[key] = value;
            }
        });
        settingsToUpdate.quickLinks = [];
        settingsPanel.querySelectorAll('#quick-links-container .quick-link-input-item').forEach(item => {
             const name = item.querySelector('.quick-link-name').value.trim();
             const url = item.querySelector('.quick-link-url').value.trim();
             if (name && isValidURL(url)) {
                 settingsToUpdate.quickLinks.push({ name, url });
             } else if (name && url) {
                 showToast(`Неверный URL для ссылки "${name}". Ссылка не сохранена.`, 'error');
                 errorOccurred = true;
             }
        });
        settingsToUpdate.customPresets = currentSettings.customPresets;
        if (!settingsToUpdate.enableGradient && bgFileInput && bgFileInput.files.length > 0) {
            try {
                settingsToUpdate.bgImageDataUri = await readFileAsDataURL(bgFileInput.files[0]);
            } catch (error) {
                showToast(`Ошибка чтения файла: ${error.message}`, 'error'); errorOccurred = true;
            }
        } else if (!settingsToUpdate.enableGradient) {
            settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';
        } else {
            settingsToUpdate.bgImageDataUri = '';
        }
        if (!errorOccurred) {
            const success = await saveSettings(settingsToUpdate);
            if (success) {
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                        if (input.type === 'checkbox') input.checked = currentSettings[key];
                        else if (input.type === 'range') {
                            let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                        }
                        else input.value = currentSettings[key] ?? '';
                    }
                });
                 settingsPanel.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
                applyForumStyles(currentSettings);
                updateBottomNavBarContent(currentSettings);
                manageVisualEffects(currentSettings);
                const bgStatus = settingsPanel.querySelector('#bg-status');
                if(bgStatus) {
                    if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
                }
                if (bgFileInput && bgFileInput.files.length > 0) bgFileInput.value = '';
                const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                    initializeVisibilityFunc();
                }
                showToast('Настройки успешно сохранены!', 'success');
                saveBtn.textContent = 'Сохранено! ✅'; saveBtn.style.backgroundColor = '#28a745';
                setTimeout(() => { saveBtn.textContent = '💾 Сохранить'; saveBtn.style.backgroundColor = ''; saveBtn.disabled = false; }, 1500);
            } else {
                showToast('Ошибка сохранения настроек!', 'error');
                saveBtn.textContent = 'Ошибка! ❌'; saveBtn.style.backgroundColor = '#dc3545';
                setTimeout(() => { saveBtn.textContent = '💾 Сохранить'; saveBtn.style.backgroundColor = ''; saveBtn.disabled = false; }, 2000);
            }
        } else {
            saveBtn.textContent = '💾 Сохранить'; saveBtn.disabled = false;
        }
    }

    async function handleClearBg() {
         if (!settingsPanel) return;
         const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
         if (bgFileInput) bgFileInput.value = '';
         const clearBgBtn = settingsPanel.querySelector('#clear-bg-btn');
         const success = await saveSettings({
             ...currentSettings,
             bgImageDataUri: ''
            });
         if (success) {
             applyForumStyles(currentSettings);
             const bgStatus = settingsPanel.querySelector('#bg-status');
             if(bgStatus) bgStatus.textContent = 'Фон не задан.';
             if (clearBgBtn) {
                clearBgBtn.textContent = '✔️';
                setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);
             }
             showToast('Фон очищен.', 'info');
         } else {
             showToast('[BR Style] Не удалось удалить фон. Ошибка сохранения.', 'error');
         }
    }

    function handleExport() {
        try {
            const settingsToExport = { ...defaultSettings, ...currentSettings };
            if (!Array.isArray(settingsToExport.quickLinks)) {
                settingsToExport.quickLinks = defaultSettings.quickLinks;
            }
            if (typeof settingsToExport.customPresets !== 'object' || settingsToExport.customPresets === null) {
                settingsToExport.customPresets = defaultSettings.customPresets;
            }
            const settingsJson = JSON.stringify(settingsToExport, null, 2);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            downloadFile(`br-style-settings-v11.0-${timestamp}.json`, settingsJson, 'application/json');
            showToast('Настройки экспортированы!', 'success');
        } catch (e) {
            console.error('[BR Style] Ошибка экспорта настроек v11.0:', e);
            showToast('[BR Style] Ошибка при экспорте настроек (v11.0).', 'error');
        }
    }

    function handleImport(event) {
        if (!settingsPanel) return;
        const file = event.target.files[0];
        if (!file) return;
        showToast('Чтение файла...⏳', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                if (typeof importedSettings !== 'object' || importedSettings === null) throw new Error("Файл не содержит корректный JSON объект.");
                let appliedCount = 0;
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (key === 'quickLinks' || key === 'customPresets') return;
                    if (importedSettings.hasOwnProperty(key)) {
                        let validatedValue = validateSetting(key, importedSettings[key], defaultSettings[key]);
                        if (input.type === 'checkbox') {
                            input.checked = validatedValue;
                        } else if (input.type === 'range') {
                            let numericValue = (typeof validatedValue === 'string') ? parseFloat(validatedValue) : validatedValue;
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                            updateSliderValue(input);
                        } else {
                             input.value = validatedValue;
                        }
                        appliedCount++;
                    }
                });
                const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
                quickLinksContainer.innerHTML = '';
                const importedLinks = importedSettings.quickLinks;
                if (Array.isArray(importedLinks)) {
                    importedLinks.forEach(link => { if (link && typeof link.name === 'string' && typeof link.url === 'string') addQuickLinkInput(quickLinksContainer, link); });
                } else {
                    (currentSettings.quickLinks || defaultSettings.quickLinks).forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
                if (importedSettings.hasOwnProperty('customPresets') && typeof importedSettings.customPresets === 'object' && importedSettings.customPresets !== null && !Array.isArray(importedSettings.customPresets)) {
                    const saveBtn = settingsPanel.querySelector('#save-btn');
                    if (saveBtn && !saveBtn.disabled) {
                        currentSettings.customPresets = importedSettings.customPresets;
                        saveSettings({ customPresets: currentSettings.customPresets });
                        populateCustomPresetList();
                    } else {
                        setTimeout(() => {
                            currentSettings.customPresets = importedSettings.customPresets;
                            saveSettings({ customPresets: currentSettings.customPresets });
                            populateCustomPresetList();
                        }, 100);
                    }
                }
                 const bgStatus = settingsPanel.querySelector('#bg-status');
                if (bgStatus) {
                    const importedBgData = importedSettings.bgImageDataUri; const importedGradient = importedSettings.enableGradient; const importedAnimGradient = importedSettings.enableAnimatedGradient; if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; } else { bgStatus.textContent = importedBgData ? `Фон: (импортирован 🖼️ изображение, нажмите Сохранить)` : 'Фон: (очищен импортом, нажмите Сохранить)'; }
                }
                const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                if (appliedCount > 0 || (Array.isArray(importedLinks) && importedLinks.length > 0)) {
                    showToast(`✅ Импортировано ${appliedCount} настроек + ссылки. Нажмите '💾 Сохранить'.`, 'success', 4000);
                    const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                    if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                         initializeVisibilityFunc();
                    }
                } else {
                    throw new Error("В файле не найдено совместимых настроек.");
                }
            } catch (error) {
                console.error('[BR Style] Ошибка импорта настроек v11.0:', error);
                showToast(`❌ Ошибка: ${error.message}`, 'error', 5000);
            } finally {
                event.target.value = null;
            }
        };
        reader.onerror = (e) => {
             console.error('[BR Style] Ошибка чтения файла для импорта:', e); showToast('❌ Ошибка чтения файла.', 'error'); event.target.value = null;
        };
        reader.readAsText(file);
    }

    function openPanel() {
        if (!settingsPanel) {
             createPanelHTML();
             if (!settingsPanel) {
                 console.error("[BR Style] Не удалось создать или найти панель после попытки создания.");
                 return;
             }
         }
        try {
            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                const key = input.dataset.settingKey;
                if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                    if (input.type === 'checkbox') { input.checked = currentSettings[key]; }
                    else if (input.type === 'range') {
                        let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                        if (isNaN(numericValue)) numericValue = defaultSettings[key];
                        input.value = numericValue;
                        updateSliderValue(input);
                    }
                    else { input.value = currentSettings[key] ?? ''; }
                }
            });
            const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
            if (quickLinksContainer) {
                quickLinksContainer.innerHTML = '';
                if (Array.isArray(currentSettings.quickLinks)) {
                    currentSettings.quickLinks.forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
            }
            populateCustomPresetList();
            const bgStatus = settingsPanel.querySelector('#bg-status');
            if(bgStatus) {
                if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
            }
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
            const usernameStatus = settingsPanel.querySelector('#my-username-status');
            if(usernameStatus) {
                usernameStatus.textContent = myUsername ? `Ваш ник: ${myUsername}` : 'Ваш ник: (не найден)';
            }
             const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
             if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                initializeVisibilityFunc();
             }
            settingsPanel.style.display = 'block';
        } catch (e) {
            console.error('[BR Style] Ошибка при открытии или заполнении панели настроек v11.0!', e);
            if (settingsPanel) settingsPanel.style.display = 'none';
        }
    }

    function closePanel() { if (settingsPanel) { settingsPanel.style.display = 'none'; } }
    function togglePanel() { if (!settingsPanel || settingsPanel.style.display === 'none' || !settingsPanel.style.display) { openPanel(); } else { closePanel(); } }

    function createBottomNavBarElement() {
        if (document.getElementById(BOTTOM_NAV_ID)) {
            bottomNavElement = document.getElementById(BOTTOM_NAV_ID);
            clockElement = document.getElementById(CLOCK_ID);
            return;
        }
        try {
            bottomNavElement = document.createElement('nav');
            bottomNavElement.id = BOTTOM_NAV_ID;
            bottomNavElement.className = 'br-bottom-nav-bar';
            bottomNavElement.innerHTML = `<span id="br-style-nav-links-v110"></span><span id="${CLOCK_ID}"></span>`;
            document.body.appendChild(bottomNavElement);
            clockElement = document.getElementById(CLOCK_ID);
        } catch (e) {
            console.error('[BR BottomNav] Ошибка создания элемента нижней панели v11.0!', e);
        }
    }

    function updateClock() {
        if (clockElement && currentSettings.enableBottomNavClock) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            clockElement.style.display = 'inline-block';
        } else if (clockElement) {
            clockElement.style.display = 'none';
        }
    }

    function updateBottomNavBarContent(settings) {
        if (!bottomNavElement) {
            createBottomNavBarElement();
            if (!bottomNavElement || !clockElement) return;
        }
        try {
            const linksContainer = bottomNavElement.querySelector('#br-style-nav-links-v110');
            if (linksContainer) {
                let navHTML = '';
                if (Array.isArray(settings.quickLinks)) {
                    settings.quickLinks.forEach(link => {
                         if (link.name?.trim() && link.url?.trim()) { const safeUrl = link.url.trim().replace(/"/g, '&quot;').replace(/'/g, '&#39;'); const safeName = link.name.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;'); navHTML += `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a>`; }
                    });
                }
                linksContainer.innerHTML = navHTML;
            }
            if (settings.enableBottomNav && settings.enableBottomNavClock) {
                if (!clockInterval) {
                    updateClock();
                    clockInterval = setInterval(updateClock, 1000);
                }
                 if (clockElement) clockElement.style.display = 'inline-block';
            } else {
                if (clockInterval) {
                    clearInterval(clockInterval);
                    clockInterval = null;
                }
                if (clockElement) clockElement.style.display = 'none';
            }
        } catch (e) {
            console.error('[BR BottomNav] Ошибка обновления содержимого нижней панели v11.0!', e);
        }
    }

    function createBackgroundElement() {
        if (document.getElementById(BACKGROUND_ELEMENT_ID)) { return; }
        try {
            const bgElement = document.createElement('div');
            bgElement.id = BACKGROUND_ELEMENT_ID;
            document.body.insertBefore(bgElement, document.body.firstChild);
        } catch (e) {
            console.error('[BR Style] Ошибка создания элемента фона v11.0!', e);
        }
    }

     function addSettingsIconHTML() {
         if (document.getElementById(STYLE_ICON_ID)) { settingsIcon = document.getElementById(STYLE_ICON_ID); }
         else if (document.body) {
             try {
                 settingsIcon = document.createElement('div'); settingsIcon.id = STYLE_ICON_ID; settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨 v11.0.3)'; settingsIcon.innerHTML = '🎨';
                 document.body.appendChild(settingsIcon); settingsIcon.addEventListener('click', togglePanel);
             } catch (e) { console.error('[BR Style] Ошибка добавления иконки настроек v11.0!', e); }
         } else { console.error('[BR Style] Тег body еще не доступен для добавления иконки v11.0!'); }
     }

    function manageVisualEffects(settings) {
         if (!effectsContainer) { effectsContainer = document.getElementById(EFFECTS_CONTAINER_ID); if (!effectsContainer) { if (!document.body) { console.error("[BR Style Effects] Body не найден для создания контейнера!"); return; } effectsContainer = document.createElement('div'); effectsContainer.id = EFFECTS_CONTAINER_ID; document.body.appendChild(effectsContainer); } } effectsContainer.innerHTML = ''; if (!isValidEffectType(settings.effectType) || settings.effectType === 'none') { effectsContainer.style.display = 'none'; return; } effectsContainer.style.display = 'block'; const intensity = Math.max(10, Math.min(200, settings.effectIntensity || 50)); const speedMultiplier = Math.max(0.1, Math.min(5, settings.effectSpeed || 1)); const swayMultiplier = Math.max(0, Math.min(3, settings.effectSwayIntensity || 1)); const rainLength = Math.max(5, Math.min(50, settings.effectRainLength || 20)); const baseDuration = 10; for (let i = 0; i < intensity; i++) { const particle = document.createElement('div'); particle.className = 'br-particle'; let animationDuration = (getRandomInRange(baseDuration - 2, baseDuration + 2)) / speedMultiplier; animationDuration = Math.max(1, animationDuration); const animationDelay = getRandomInRange(0, baseDuration); const initialLeft = getRandomInRange(0, 100); const initialOpacity = getRandomInRange(0.6, 1.0); const swayDirection = Math.random() < 0.5 ? -1 : 1; particle.style.left = `${initialLeft}vw`; particle.style.opacity = initialOpacity; particle.style.setProperty('--sway-dir', swayDirection); particle.style.setProperty('--sway-intensity', swayMultiplier); particle.style.animationDelay = `${animationDelay}s`; particle.style.animationDuration = `${animationDuration}s`; let particleType = settings.effectType; let particleClass = particleType.split('-')[0]; particle.classList.add(particleClass); switch (particleType) { case 'rain': const rainWidth = getRandomInRange(1, 2); particle.style.width = `${rainWidth}px`; particle.style.height = `${rainLength}px`; const rainBaseGray = getRandomIntInRange(163, 183); const rainBaseBlue = getRandomIntInRange(206, 226); const rainBaseAlpha = getRandomInRange(0.4, 0.7); particle.style.backgroundColor = `rgba(${rainBaseGray}, ${rainBaseBlue}, 230, ${rainBaseAlpha})`; particle.style.transform = `rotate(5deg)`; particle.style.animationName = 'fall-straight'; break; case 'snow': const snowSize = getRandomInRange(4, 8); particle.style.width = `${snowSize}px`; particle.style.height = `${snowSize}px`; const tintType = Math.random(); let snowColor = `255, 255, 255`; if (tintType < 0.1) snowColor = `240, 248, 255`; else if (tintType < 0.2) snowColor = `255, 255, 240`; particle.style.backgroundColor = `rgba(${snowColor}, ${initialOpacity})`; particle.style.borderRadius = '50%'; particle.style.boxShadow = `0 0 ${snowSize / 3}px rgba(255, 255, 255, 0.5)`; particle.style.animationName = 'fall-sway'; particle.style.animationDuration = `${animationDuration * 1.5}s`; break; case 'petals-sakura': case 'petals-red_rose': case 'leaves-autumn_maple': const imgKey = particleType.split('-')[1]; const imgUri = PETAL_IMAGES[imgKey]; if (!imgUri) { continue; } const size = getRandomInRange((particleClass === 'leaves' ? 14 : 12), (particleClass === 'leaves' ? 20 : 18)); particle.style.width = `${size}px`; particle.style.height = `${size}px`; particle.style.backgroundImage = `url('${imgUri}')`; particle.style.backgroundSize = 'contain'; particle.style.backgroundRepeat = 'no-repeat'; particle.style.animationName = (particleClass === 'leaves') ? 'fall-leaf' : 'fall-petal'; particle.style.animationDuration = `${animationDuration * (particleClass === 'leaves' ? 1.6 : 1.8)}s`; break; case 'fireflies': const fireflySize = getRandomInRange(3, 6); particle.style.width = `${fireflySize}px`; particle.style.height = `${fireflySize}px`; particle.style.backgroundColor = `rgba(255, 255, 150, ${getRandomInRange(0.5, 0.9)})`; particle.style.borderRadius = '50%'; particle.style.boxShadow = `0 0 ${fireflySize * 1.5}px rgba(255, 255, 100, 0.8), 0 0 ${fireflySize * 3}px rgba(255, 220, 0, 0.5)`; particle.style.top = `${getRandomInRange(5, 95)}vh`; particle.style.left = `${getRandomInRange(5, 95)}vw`; particle.style.animationName = 'wandering-firefly'; particle.style.animationDuration = `${getRandomInRange(8, 15) / speedMultiplier}s`; particle.style.animationTimingFunction = 'ease-in-out'; particle.style.animationDirection = 'alternate'; break; case 'matrix': particle.textContent = MATRIX_CHARS.charAt(getRandomIntInRange(0, MATRIX_CHARS.length - 1)); particle.style.fontFamily = "'Courier New', Courier, monospace"; particle.style.color = `rgba(0, 255, 0, ${initialOpacity})`; particle.style.fontSize = `${rainLength}px`; particle.style.lineHeight = '1'; particle.style.animationName = 'fall-straight'; particle.style.textShadow = `0 0 5px rgba(0, 255, 0, 0.7)`; break;
            
            case 'bubbles':
                const bubbleSize = getRandomInRange(5, 20);
                particle.style.width = `${bubbleSize}px`;
                particle.style.height = `${bubbleSize}px`;
                particle.style.backgroundColor = `rgba(255, 255, 255, 0.15)`;
                particle.style.border = `2px solid rgba(255, 255, 255, 0.3)`;
                particle.style.borderRadius = '50%';
                particle.style.animationName = 'rise-bubble';
                particle.style.animationDuration = `${animationDuration * 1.5}s`;
                particle.style.top = '105vh'; // Начать снизу
                break;

            } effectsContainer.appendChild(particle); }
    }

    function injectStaticStyles() {
        const staticStyleId = STYLE_ID + '-static';
        if (document.getElementById(staticStyleId)) { return; }
        try {
            const staticCss = `
                #${BACKGROUND_ELEMENT_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
                    transition: background-image 0.5s ease, background-color 0.5s ease;
                }
                body { background: transparent !important; }
                .p-pageWrapper { position: relative; z-index: 1; }
                #${BOTTOM_NAV_ID} { box-shadow: 0 0 8px rgba(0,0,0,0.4); height: ${BOTTOM_NAV_HEIGHT}; width: auto; max-width: 90%; min-width: 100px; padding: 0 15px; position: fixed; z-index: 9998; display: flex; justify-content: flex-start; align-items: center; box-sizing: border-box; overflow-x: auto; overflow-y: hidden; white-space: nowrap; transition: background-color 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease; gap: 5px; }
                #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a { color: #e0e0e0; text-decoration: none; padding: 0 12px; margin: 0 3px; font-size: 14px; font-weight: bold; line-height: ${BOTTOM_NAV_HEIGHT}; transition: color 0.2s ease, text-shadow 0.2s ease; text-shadow: 0 0 4px rgba(255, 255, 255, 0.4); display: inline-block; }
                #${BOTTOM_NAV_ID} #br-style-nav-links-v110 a:hover { color: #FFEB3B; text-shadow: 0 0 7px rgba(255, 235, 59, 0.7); }
                #${CLOCK_ID} { font-size: 13px; font-weight: normal; margin-left: auto; padding: 0 10px; line-height: ${BOTTOM_NAV_HEIGHT}; font-family: 'Courier New', Courier, monospace; white-space: nowrap; display: none; transition: color 0.3s ease; flex-shrink: 0; }
                #${STYLE_ICON_ID} { position: fixed; z-index: 9998; width: 40px; height: 40px; background-color: rgba(51, 51, 51, 0.8); border-radius: 50%; cursor: pointer; border: 1px solid rgba(120, 120, 120, 0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: background-color 0.2s ease, transform 0.2s ease; display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; color: white; user-select: none; bottom: 55px; left: 10px; }
                #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }
                #${PANEL_ID} { position: fixed; z-index: 9999; bottom: 60px; left: 10px; width: 380px; background: #333; color: #eee; padding: 15px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.6); display: none; border: 1px solid #555; font-family: sans-serif; font-size: 13px; max-height: calc(100vh - 80px); overflow-y: auto; box-sizing: border-box; }
                #${PANEL_ID} h3 { margin: 0 0 10px; text-align: center; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px; color: #fff;}
                #${PANEL_ID} h4 { margin-top: 15px; margin-bottom: 10px; text-align: center; color: #bbb; border-top: 1px solid #555; padding-top: 12px; font-size: 14px; font-weight: bold;}
                #${PANEL_ID} .panel-tabs { display: flex; margin-bottom: 10px; border-bottom: 1px solid #555; }
                #${PANEL_ID} .panel-tab-link { flex: 1; background: #444; color: #ccc; border: none; padding: 8px 5px; cursor: pointer; transition: background-color 0.2s, color 0.2s; font-size: 12px; border-radius: 4px 4px 0 0; border-bottom: 1px solid #555; margin-bottom: -1px; }
                #${PANEL_ID} .panel-tab-link:hover { background: #5a5a5a; color: #fff; }
                #${PANEL_ID} .panel-tab-link.active { background: #555; color: #fff; border-bottom: 1px solid #555; font-weight: bold; border-bottom-color: #333; }
                #${PANEL_ID} .panel-tab-content { display: none; }
                #${PANEL_ID} .panel-tab-content.active { display: block; }
                #${PANEL_ID} div.setting-group { margin-bottom: 12px; padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); }
                #${PANEL_ID} label { display: block; margin-bottom: 4px; font-weight: bold; color: #ccc; }
                #${PANEL_ID} label.inline-label { display: inline; font-weight: normal; vertical-align: middle; margin-left: 3px; }
                #${PANEL_ID} input[type="text"], #${PANEL_ID} input[type="number"], #${PANEL_ID} input[type="file"], #${PANEL_ID} select { width: 100%; padding: 6px 8px; background: #444; border: 1px solid #666; color: #eee; border-radius: 3px; box-sizing: border-box; margin-top: 2px; }
                #${PANEL_ID} input[type="color"] { padding: 0; border: 1px solid #666; height: 28px; width: 40px; vertical-align: middle; margin-left: 5px; border-radius: 3px; cursor: pointer; background-color: #555; }
                #${PANEL_ID} input[type="checkbox"] { vertical-align: middle; margin-right: 2px; width: 16px; height: 16px; }
                #${PANEL_ID} input[type="range"] { width: 100%; vertical-align: middle; cursor: pointer; margin-top: 4px; }
                #${PANEL_ID} span.slider-value { display: inline-block; min-width: 25px; text-align: right; font-weight: bold; color: #FFEB3B; margin-left: 5px; }
                #${PANEL_ID} span.slider-unit { font-size: 12px; color: #bbb; margin-left: 2px; }
                #${PANEL_ID} select { appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cccccc%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right .7em top 50%; background-size: .65em auto; padding-right: 2em; }
                #${PANEL_ID} small.panel-status-text { color: #aaa; font-size: 11px; margin-top: 4px; display: block; min-height: 1em; }
                #${PANEL_ID} .button-group { margin-top: 20px; padding-top: 10px; border-top: 1px solid #555; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
                #${PANEL_ID} button.panel-btn { padding: 6px 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.2s, transform 0.1s; font-size: 13px; }
                #${PANEL_ID} button:disabled { opacity: 0.6; cursor: not-allowed; } #${PANEL_ID} button:active:not(:disabled) { transform: scale(0.97); }
                #${PANEL_ID} button.panel-btn-save { background-color: #4CAF50; color: white; order: 4; } #${PANEL_ID} button.panel-btn-save:hover:not(:disabled) { background-color: #45a049; }
                #${PANEL_ID} button.panel-btn-close { background-color: #aaa; color: #333; order: 5; } #${PANEL_ID} button.panel-btn-close:hover { background-color: #999; }
                #${PANEL_ID} button.panel-btn-export { background-color: #007bff; color: white; order: 1; margin-right: auto; } #${PANEL_ID} button.panel-btn-export:hover { background-color: #0056b3; }
                #${PANEL_ID} button.panel-btn-import { background-color: #ffc107; color: #333; order: 2; margin-right: auto; } #${PANEL_ID} button.panel-btn-import:hover { background-color: #e0a800; }
                #${PANEL_ID} button.panel-btn-reset { background-color: #6c757d; color: white; order: 3; } #${PANEL_ID} button.panel-btn-reset:hover { background-color: #5a6268; }
                #${PANEL_ID} button.panel-small-btn { padding: 3px 6px !important; font-size: 11px !important; line-height: 1; vertical-align: middle; }
                #${PANEL_ID} button.panel-btn-danger { background-color: #f44336 !important; color: white !important; } #${PANEL_ID} button.panel-btn-danger:hover { background-color: #da190b !important; }
                #${PANEL_ID} button.panel-btn-add { background-color: #2196F3; color: white; } #${PANEL_ID} button.panel-btn-add:hover { background-color: #0b7dda; }
                #${PANEL_ID} hr { border: none; border-top: 1px solid #555; margin: 20px 0; }
                #${PANEL_ID} .sub-settings { margin-left: 20px; padding-left: 10px; border-left: 2px solid #555; margin-top: 8px; display: none; padding-top: 5px; padding-bottom: 5px; background: rgba(0,0,0,0.1); border-radius: 0 4px 4px 0; }
                #${PANEL_ID} .effect-specific-settings { padding-top: 5px; }
                #${PANEL_ID} .dynamic-links-group { border: 1px dashed #555; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;}
                #${PANEL_ID} .quick-link-input-item { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
                #${PANEL_ID} .quick-link-input-item input.quick-link-name { flex: 1; } #${PANEL_ID} .quick-link-input-item input.quick-link-url { flex: 2; }
                #${PANEL_ID} .quick-link-input-item button.remove-quick-link-btn { flex-shrink: 0; padding: 4px 7px !important; line-height: 1; }
                #${PANEL_ID} .author-credit { text-align: center; font-size: 10px; color: #888; margin-top: 15px; padding-top: 10px; border-top: 1px solid #555; }
                #${PANEL_ID} .preset-buttons-container label { margin-bottom: 6px; }
                #${PANEL_ID} .preset-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
                #${PANEL_ID} .preset-buttons button { flex-basis: calc(50% - 3px); padding: 5px 8px; font-size: 12px; background-color: #555; color: #eee; border: 1px solid #666; border-radius: 3px; cursor: pointer; transition: background-color 0.2s; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                #${PANEL_ID} .preset-buttons button:hover { background-color: #6a6a6a; }

                /* --- ИЗМЕНЕННЫЕ СТИЛИ УВЕДОМЛЕНИЙ (NVIDIA STYLE) --- */
                #${TOAST_CONTAINER_ID} { position: fixed; top: 20px; right: 20px; z-index: 10001; display: flex; flex-direction: column; gap: 10px; }
                .br-toast {
                    padding: 14px 20px;
                    border-radius: 8px;
                    color: #e0e0e0;
                    font-size: 14px;
                    font-weight: normal;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    opacity: 0;
                    transform: translateX(100%);
                    transition: opacity 0.4s ease, transform 0.4s ease;
                    background-color: #2a2a2a; /* Темный фон */
                    border-left: 5px solid #76b900; /* Акцент (зеленый по умолч.) */
                    min-width: 250px;
                }
                .br-toast.br-toast-show { opacity: 1; transform: translateX(0); }
                .br-toast-info { border-left-color: #007bff; } /* Синий для info */
                .br-toast-success { border-left-color: #76b900; } /* Зеленый для success */
                .br-toast-error { border-left-color: #d9534f; } /* Красный для error */
                /* --- КОНЕЦ СТИЛЕЙ УВЕДОМЛЕНИЙ --- */

                #${EFFECTS_CONTAINER_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 9990; display: none; }
                .br-particle { position: absolute; top: -50px; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform, opacity; }
                .br-particle.matrix { top: auto; bottom: 105vh; }
                .br-particle.bubbles { top: 105vh; } /* 'bubbles' начинаются снизу */

                @keyframes fall-straight { 0% { transform: translateY(0vh); opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(105vh); opacity: 0; } }
                @keyframes fall-sway { 0% { transform: translateY(0vh) translateX(0px) rotate(0deg); } 50% { transform: translateY(50vh) translateX(calc(15px * var(--sway-dir, 1) * var(--sway-intensity, 1))) rotate(180deg); } 100% { transform: translateY(105vh) translateX(calc(-10px * var(--sway-dir, 1) * var(--sway-intensity, 1))) rotate(360deg); } }
                @keyframes fall-petal { 0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0.9; } 25% { transform: translateY(25vh) rotate(calc(45deg * var(--sway-dir, 1))) translateX(calc(20px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 50% { transform: translateY(50vh) rotate(calc(-30deg * var(--sway-dir, 1))) translateX(calc(-15px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 75% { transform: translateY(75vh) rotate(calc(60deg * var(--sway-dir, 1))) translateX(calc(10px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0.8; } 100% { transform: translateY(105vh) rotate(calc(-10deg * var(--sway-dir, 1))) translateX(calc(-5px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0; } }
                @keyframes fall-leaf { 0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0.9; } 30% { transform: translateY(30vh) rotate(calc(35deg * var(--sway-dir, 1))) translateX(calc(15px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 60% { transform: translateY(60vh) rotate(calc(-20deg * var(--sway-dir, 1))) translateX(calc(-10px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 85% { transform: translateY(85vh) rotate(calc(40deg * var(--sway-dir, 1))) translateX(calc(5px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0.8; } 100% { transform: translateY(105vh) rotate(calc(-5deg * var(--sway-dir, 1))) translateX(calc(-2px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0; } }

                @keyframes wandering-firefly {
                    0% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
                    25% { transform: translate(calc(30px * var(--sway-dir, 1) * var(--sway-intensity, 1)), calc(-20px * var(--sway-intensity, 1))) scale(1.1); opacity: 1; }
                    50% { transform: translate(calc(-10px * var(--sway-dir, 1) * var(--sway-intensity, 1)), calc(15px * var(--sway-intensity, 1))) scale(1); opacity: 0.7; }
                    75% { transform: translate(calc(20px * var(--sway-dir, 1) * var(--sway-intensity, 1)), calc(25px * var(--sway-intensity, 1))) scale(1.1); opacity: 1; }
                    100% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
                }
                
                /* НОВАЯ АНИМАЦИЯ 'bubbles' */
                @keyframes rise-bubble {
                    0% { transform: translateY(0vh) scale(0.8); opacity: 0.7; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
                }

                @keyframes br-page-transition-fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes br-page-transition-slide-in-left { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes br-page-transition-slide-in-right { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes br-page-transition-zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

                @media (max-width: 600px) {
                    #${PANEL_ID} {
                        width: 100vw;
                        height: 100vh;
                        max-height: 100vh;
                        top: 0;
                        left: 0;
                        bottom: auto;
                        border-radius: 0;
                        border: none;
                        padding: 10px;
                        padding-top: 5px;
                    }
                    #${PANEL_ID} h3 { font-size: 16px; margin-bottom: 5px; padding-bottom: 5px; }
                    #${PANEL_ID} .panel-tabs { margin-bottom: 5px; }
                    #${PANEL_ID} .panel-tab-link { padding: 6px 4px; font-size: 11px; }
                    #${PANEL_ID} .button-group { padding-bottom: 15px; }
                    #${STYLE_ICON_ID} { bottom: 10px; left: 10px; }
                    #${TOAST_CONTAINER_ID} {
                        width: 90%;
                        left: 50%;
                        transform: translateX(-50%);
                        right: auto;
                    }
                }
            `;
            const styleElement = document.createElement('style');
            styleElement.id = staticStyleId;
            styleElement.type = 'text/css';
            styleElement.textContent = staticCss;
            (document.head || document.documentElement).appendChild(styleElement);
        } catch (e) {
            console.error('[BR Style] Ошибка внедрения статичных CSS!', e);
        }
    }

    function findMyUsername() {
        if (myUsername) return true;
        const userEl = document.querySelector('.p-nav-link--username');
        if (userEl) {
            myUsername = userEl.textContent.trim();
            if (myUsername) {
                console.log(`[BR Style] Никнейм пользователя определен: ${myUsername}`);
                if (usernameObserver) {
                    usernameObserver.disconnect();
                    usernameObserver = null;
                }
                if (settingsPanel) {
                    const usernameStatus = settingsPanel.querySelector('#my-username-status');
                    if (usernameStatus) usernameStatus.textContent = `Ваш ник: ${myUsername}`;
                }
                applyForumStyles(currentSettings);
                return true;
            }
        }
        return false;
    }
 const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"

const buttons = [
        {
      title: `--------------------------------------------------------------------> АДМИН РАЗДЕЛ <------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},

     {
	  title: `этот раздел пока не работает не трогать его!!!!!!!!!!!!`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS]этот раздел пока не работает не трогать его!!!!!!!!!!!![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С By.Fantom_Stark[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Неактивы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на неактив были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Доп. Баллы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши доп. баллы были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Имущество`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления покупку/продажу/обмен имущества были успешно проверены и одобрены![/COLOR]<br><br>`+
        `Отказанные заявки перечислил выше. Все взаимодействия с имуществом после 22:00, при репорте меньше 10.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Снятие наказаний`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на снятие наказаний были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },

{
      title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-----------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
    {
      title: `Жалобу в адм раздел`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вам нужно обратиться в раздел жалоб на Администрацию → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел Обжалование → [/ICODE] [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3485/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на игроков  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на лидеров  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
	},
    {
      title: `Жалобу на теха`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на технических специалистов → [/ICODE] [URL='https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
     title: '------------------------------------------------------------------->Передам(жб) <--------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
      title: 'для сакаро',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
    {
	  title: `Передать ЗГА ГОСС & ОПГ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу [/ICODE][COLOR=#FF0000][ICODE]Заместителю Главного Администратора по направлению ГОСС & ОПГ. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать  ОЗГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Основному Заместителю Главного Администратора. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
        {
     title: '-------------------------------------------------------------------> Передам(ОБЖ) <----------------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
      title: 'для сакаро',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
        {
	  title: `Передать ГА`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
           {
      title: `Спец. Админ`,
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
         {
     title: '------------------------------------------------------------------->на рассмотрении <------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
        title: `На рассмотрении(обжалование)`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваше обжалование взято  [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00[ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
         prefix: PIN_PREFIX,
      status: true,
        },
             {
      title: `На рассмотрении(жб)`,
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба взята [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: true,
    },
          {
      title: `ссылку на жб`,
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на данную жалобу в течении 24 часов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
       prefix: PIN_PREFIX,
      status: 123,
    },

        {
      title: `ссылку на вк`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на вашу страницу в ВК.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: 123,
    },
        {
     title: '-------------------------------------------------------------------> ДОКИ <---------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
       title: `запрошу доки`,
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Запрошу доказательства у администратора.[/ICODE][COLOR=#FFFF00][ICODE]Ожидайте. [/ICODE][/COLOR]<br>[ICODE] пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
	  status: true,
        },
        {
      title: 'выдано верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'выдано не верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
                            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
	   title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
        {
      title: 'будет проинструктирован',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу строгую беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Адм будет наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]]Ваша жалоба была одобрена и администратор получит наказание. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

        {
      title: 'не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию -[/ICODE] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
               prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Нет /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /time.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нет /myreports',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /myreports.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Жалобы написанные от 3-его лица не подлежат рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нужен фрапс',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Фрапс обрывается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Дока-во отредактированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Прошло более 48 часов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет строки выдачи наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует строка с выдачей наказания.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет окна бана',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует окно блокировки аккаунта. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'нет докв',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей жалобе отсутствуют доказательства. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'не работают доки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Предоставленные доказательства не рабочие. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

        {
      title: 'нет нарушений',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'адм снят/псж',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Администратор был снят/ушел с поста администратора.  [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'ошиблись сервером',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'нет ссылки на жб',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нет ссылки на данную жалобу.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'не написал ник',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'перезагрузи роутер',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Перезагрузите роутер.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

{
            title: `--------------------------------------------------------------------> ОБЖАЛОВАНИЯ <---------------------------------------------------`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
    {
      title: `Сократить наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено. Наказание будет снижено[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Снять наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено, наказание будет полностью снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование на рассмотрении`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
	  title: `Смена ника`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой nickname через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательтвом того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `NonRP обман (разбан на 24 часа)`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме.<br>Прикрепите фрапс обмена с /time в данную тему. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `Отказать ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В обжаловании отказано.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ не подлежит`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Данное наказание не подлежит обжалованию.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `NonRP обман (не тот написал)`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком в любым способом.<br>Для возврата имущества он должен оформить обжалование.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обж не по форме`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований →.[/ICODE][URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет док-в в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствуют доказательства для дальнейшего расмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нерабочие док-ва в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании не работают доказательства.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Дублирование ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ответ был дан в прошлой теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ уже на рассмотрении`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                     "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера.<br>Пожалуйста, прекратите создавать повторяющиеся темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Неадекват ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено в неадекватном формате. Рассмотрению не подлежит.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет ссылки на VK`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствует ссылка на вашу страницу VK. Прикрепите ее в следующем обращении для дальнейшего рассмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: `вам надо  связаться в соц сетях`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]«Если вы хотите обжаловать данную блокировку вам необходимо связаться в соц сетях с игроком которого вы обманули и договориться о возврате имущества»[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `Обж для ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Передаю ваше обжалование Главному Администратору[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `ОБЖ для Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование передано Специальной Администрации на рассмотрение[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
    ];

    $(document).ready(() => {
    
        addButton('Меню', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255,  20, 147, 0.5);');
        addButton('Одобрить', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
        addButton('Отказать', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('Закрыть', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('Спецу', 'specialAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('ГА', 'mainAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('КП', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');


      
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(COMMAND_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            const alertHtml = buttonsMarkup(buttons);
            const $alert = XF.alert(alertHtml, null, 'Выберите ответ:');

            $alert.on('click', 'button[id^="answers-"]', function() {
                const buttonId = this.id;
                const id = parseInt(buttonId.split('-')[1], 10);

                if (isNaN(id) || !buttons[id]) {
                    return;
                }
                
                const shouldSend = id > 1;

                pasteContent(id, threadData, shouldSend);
            });
        });

                const bgButtons = document.querySelector(".pageContent");
        if (bgButtons) { //
            const buttonConfig = (text, href) => {
              const button = document.createElement("button");
              button.textContent = text;
              button.classList.add("bgButton");
              button.addEventListener("click", () => {
                window.location.href = href;
              });
              return button;
            };

            const Button2 = buttonConfig("Общие правила серверов", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");
            bgButtons.append(Button2);
        }
        
    });

     function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">Меню</button>`,
	);
	}

      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
    }

   function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

        function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        const htmlToInsert = template(data);

        const $editor = $('div.fr-element.fr-view p');
        if ($editor.length === 0) {
             $('div.fr-element.fr-view').append(htmlToInsert);
        } else if ($editor.text() === '') {
            $editor.empty().append(htmlToInsert);
        } else {
             $editor.append('<br>' + htmlToInsert);
        }
        $('span.fr-placeholder').empty();

        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            $('.button--icon.button--icon--reply.rippleButton').trigger('click'); 

            setTimeout(() => {
                const $editorInstance = $('textarea.js-quickReply');
                if ($editorInstance.length && $editorInstance.data('froala.editor')) {
                    $editorInstance.froalaEditor('html.set', '');
                } else {
                    $('div.fr-element.fr-view').html('');
                    $('span.fr-placeholder').show();
                }
            }, 100);

            editThreadData(buttons[id].prefix, buttons[id].status);
        }
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
    }


    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

    async function initialize() {
        try {
            injectStaticStyles();
            await loadSettings();
            applyForumStyles(currentSettings);
            const onDomReady = () => {
                 try {
                     createBackgroundElement();
                     createPanelHTML();
                     createBottomNavBarElement();
                     updateBottomNavBarContent(currentSettings);
                     manageVisualEffects(currentSettings);
                     addSettingsIconHTML();
                     if (!findMyUsername()) {
                         usernameObserver = observeDOM(document.body, () => {
                             findMyUsername();
                         });
                     }
                 } catch (uiError) {
                     console.error('[BR Style] Ошибка при создании UI элементов в onDomReady (v11.0):', uiError);
                     showToast('[BR Style] Ошибка создания интерфейса скрипта! (v11.0)', 'error');
                 }
             };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onDomReady);
            } else {
                onDomReady();
            }
            GM_registerMenuCommand('🎨 Открыть настройки стиля BR', togglePanel, 's');
        } catch (e) {
            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ', e);
            showToast('[BR Style] Критическая ошибка инициализации скрипта', 'error', 10000);
        }
    }

    initialize();
})();

