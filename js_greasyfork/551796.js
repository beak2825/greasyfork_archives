// ==UserScript==

// @name         (v9.2 Фильтры Фона++) Стиль форум By Normyan(Поднята иконка, компактная панель)

// @namespace    http://tampermonkey.net/

// @version      10.1

// @description  Настройка стиля BR Forum: панель, пресеты, шрифты, импорт/экспорт, градиент+, освещение+, дин. ссылки+, позиция панели+, Визуальные Эффекты V2, Продвинутый фон (Фильтры), Часы в панели. (Иконка поднята, панель навигации прокручивается)

// @author       Maras Ageev (Муж Vika Ageeva) (Модификация)

// @match        https://forum.blackrussia.online/*

// @grant        GM_addStyle

// @grant        GM_setValue

// @grant        GM_getValue

// @grant        GM_registerMenuCommand

// @run-at       document-start

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/551796/%28v92%20%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D1%8B%20%D0%A4%D0%BE%D0%BD%D0%B0%2B%2B%29%20%D0%A1%D1%82%D0%B8%D0%BB%D1%8C%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20By%20Normyan%28%D0%9F%D0%BE%D0%B4%D0%BD%D1%8F%D1%82%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%2C%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551796/%28v92%20%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D1%8B%20%D0%A4%D0%BE%D0%BD%D0%B0%2B%2B%29%20%D0%A1%D1%82%D0%B8%D0%BB%D1%8C%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%20By%20Normyan%28%D0%9F%D0%BE%D0%B4%D0%BD%D1%8F%D1%82%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%2C%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%29.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const STYLE_ID = 'blackrussia-custom-style-v90';

    const PANEL_ID = 'blackrussia-settings-panel-v90';

    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar-v90';

    const CLOCK_ID = 'br-style-clock-v90';

    const STYLE_ICON_ID = 'br-style-toggle-icon-v90';

    const EFFECTS_CONTAINER_ID = 'br-effects-container-v90';

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

        enableBgFilter: false,

        bgFilterBlur: 0,

        bgFilterBrightness: 100,

        bgFilterContrast: 100,

        bgFilterSaturation: 100,

        enableBottomNavClock: true,

        bottomNavClockColor: '#E0E0E0'

    };

    const presets = {

        'глубокий_лес': { bgColor: '#1B2D2A', enableGradient: true, gradientColor1: '#1B2D2A', gradientColor2: '#0F1A18', gradientColor3: '#2C4A42', gradientColor4: '#10201C', gradientDirection: '160deg', enableTextGlow: true, textGlowColor: '#76FF03', edgeColor: '#76FF03' },

        'полночь': { bgColor: '#0C1445', enableGradient: true, gradientColor1: '#0C1445', gradientColor2: '#03061E', gradientColor3: '#1E2B6B', gradientColor4: '#080F30', gradientDirection: '-30deg', enableTextGlow: true, textGlowColor: '#ADD8E6', edgeColor: '#5A7FBF' },

        'вулканический_пепел': { bgColor: '#2C2F33', enableGradient: false, enableTextGlow: true, textGlowColor: '#FF7043', edgeColor: '#607D8B' },

        'ржавый_металл': { bgColor: '#4E342E', enableGradient: true, gradientColor1: '#4E342E', gradientColor2: '#3E2723', gradientColor3: '#6D4C41', gradientColor4: '#8D6E63', gradientDirection: '45deg', enableTextGlow: true, textGlowColor: '#FFAB91', edgeColor: '#A1887F' },

        'глубокое_море': { bgColor: '#012A36', enableGradient: true, gradientColor1: '#012A36', gradientColor2: '#001F2A', gradientColor3: '#003F51', gradientColor4: '#00566D', gradientDirection: '200deg', enableAnimatedGradient: true, animatedGradientSpeed: '15s', enableTextGlow: true, textGlowColor: '#4DD0E1', edgeColor: '#4DD0E1' },

        'королевский_пурпур': { bgColor: '#380E4A', enableGradient: true, gradientColor1: '#380E4A', gradientColor2: '#270A33', gradientColor3: '#51186A', gradientColor4: '#6A1B9A', gradientDirection: '90deg', enableTextGlow: true, textGlowColor: '#CE93D8', edgeColor: '#AB47BC' },

        'изумрудный_город': { bgColor: '#004D40', enableGradient: true, gradientColor1: '#004D40', gradientColor2: '#00251A', gradientColor3: '#00695C', gradientColor4: '#00796B', gradientDirection: '135deg', enableTextGlow: true, textGlowColor: '#80CBC4', edgeColor: '#26A69A' },

        'теневой_серый': { bgColor: '#263238', enableGradient: false, enableTextGlow: true, textGlowColor: '#CFD8DC', edgeColor: '#78909C' },

        'багровая_ночь': { bgColor: '#4E0000', enableGradient: true, gradientColor1: '#4E0000', gradientColor2: '#2F0000', gradientColor3: '#6A0000', gradientColor4: '#8B0000', gradientDirection: '-45deg', enableTextGlow: true, textGlowColor: '#FFCDD2', edgeColor: '#E57373' },

        'янтарь': { bgColor: '#6F4F00', enableGradient: true, gradientColor1: '#6F4F00', gradientColor2: '#4D3600', gradientColor3: '#906F00', gradientColor4: '#B38B00', gradientDirection: '180deg', enableTextGlow: true, textGlowColor: '#FFECB3', edgeColor: '#FFD54F' },

        'замшелый_камень': { bgColor: '#334931', enableGradient: true, gradientColor1: '#334931', gradientColor2: '#223121', gradientColor3: '#496A46', gradientColor4: '#5A7E56', gradientDirection: '60deg', enableTextGlow: true, textGlowColor: '#C5E1A5', edgeColor: '#9CCC65' },

        'стальной_синий': { bgColor: '#2C3E50', enableGradient: false, enableTextGlow: true, textGlowColor: '#BDC3C7', edgeColor: '#7F8C8D' },

        'обсидиан': { bgColor: '#0F0F14', enableGradient: true, gradientColor1: '#0F0F14', gradientColor2: '#050507', gradientColor3: '#1A1A21', gradientColor4: '#24242E', gradientDirection: '0deg', enableTextGlow: true, textGlowColor: '#9FA8DA', edgeColor: '#5C6BC0' },

        'сумерки': { bgColor: '#2B1B3D', enableGradient: true, gradientColor1: '#2B1B3D', gradientColor2: '#1A1025', gradientColor3: '#402A5B', gradientColor4: '#563A7A', gradientDirection: '110deg', enableAnimatedGradient: true, animatedGradientSpeed: '12s', enableTextGlow: true, textGlowColor: '#B39DDB', edgeColor: '#9575CD' },

        'бордовый': { bgColor: '#5D101A', enableGradient: false, enableTextGlow: true, textGlowColor: '#EF9A9A', edgeColor: '#C62828' },

        'хаки': { bgColor: '#424530', enableGradient: true, gradientColor1: '#424530', gradientColor2: '#303321', gradientColor3: '#5F6344', gradientColor4: '#7C8159', gradientDirection: '270deg', enableTextGlow: true, textGlowColor: '#E6EE9C', edgeColor: '#AEB48C' },

        'киберпанк_неон': {

            bgColor: '#0d0221', enableGradient: true,

            gradientColor1: '#0d0221', gradientColor2: '#000000', gradientColor3: '#261447', gradientColor4: '#1a0a3a',

            gradientDirection: '145deg', enableAnimatedGradient: true, animatedGradientSpeed: '10s',

            enableTextGlow: true, textGlowColor: '#00ffff', textGlowIntensity: '4px',

            edgeColor: '#ff00ff', edgeWidth: '1px', edgeOpacity: 0.8

        },

        'мятный_шоколад': {

            bgColor: '#2d1e1a', enableGradient: false,

            enableTextGlow: true, textGlowColor: '#98FB98', textGlowIntensity: '6px',

            edgeColor: '#66CDAA', edgeWidth: '2px', edgeOpacity: 0.6,

            enableRounding: true, borderRadius: '10px'

        }

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

    function hexToRgb(hex) { if (!hex || typeof hex !== 'string') return null; const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }

    function readFileAsDataURL(file) { return new Promise((resolve, reject) => { if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { reject(new Error(`Файл слишком большой! Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`)); return; } const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = (error) => reject(error); reader.readAsDataURL(file); }); }

    function downloadFile(filename, content, contentType) { const blob = new Blob([content], { type: contentType }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }

    function isValidEffectType(type) { return ['none', 'rain', 'snow', 'petals-sakura', 'petals-red_rose', 'leaves-autumn_maple'].includes(type); }

    async function loadSettings() {

        currentSettings = {};

        const tempDefault = { ...defaultSettings };

        try {

            const settingKeys = Object.keys(tempDefault);

            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, tempDefault[key])));

            settingKeys.forEach((key, index) => {

                let savedValue = loadedValues[index];

                const defaultValue = tempDefault[key];

                const defaultValueType = typeof defaultValue;

                if (key === 'quickLinks') {

                    if (typeof savedValue === 'string') { try { savedValue = JSON.parse(savedValue); if (!Array.isArray(savedValue)) savedValue = defaultValue; } catch (e) { savedValue = defaultValue; } } else if (!Array.isArray(savedValue)) { savedValue = defaultValue; }

                    savedValue = savedValue.filter(link => link && typeof link.name === 'string' && typeof link.url === 'string');

                } else if (defaultValueType === 'boolean') {

                    savedValue = (savedValue === true || savedValue === 'true');

                } else if (defaultValueType === 'number') {

                    const parsedValue = parseFloat(savedValue);

                    if (!isNaN(parsedValue)) {

                        savedValue = parsedValue;

                        if (['opacityValue', 'edgeOpacity', 'bottomNavOpacity', 'transparentElementsOpacity'].includes(key)) { savedValue = Math.max(0, Math.min(1, savedValue)); }

                        else if (key === 'effectIntensity') { savedValue = Math.max(10, Math.min(200, parseInt(savedValue, 10) || defaultValue)); }

                        else if (key === 'effectSpeed') { savedValue = Math.max(0.1, Math.min(5, savedValue || defaultValue)); }

                        else if (key === 'effectSwayIntensity') { savedValue = Math.max(0, Math.min(3, savedValue || defaultValue)); }

                        else if (key === 'effectRainLength') { savedValue = Math.max(5, Math.min(50, parseInt(savedValue, 10) || defaultValue)); }

                        else if (key === 'bgFilterBlur') { savedValue = Math.max(0, Math.min(50, parseInt(savedValue, 10) || defaultValue)); }

                        else if (['bgFilterBrightness', 'bgFilterContrast', 'bgFilterSaturation'].includes(key)) { savedValue = Math.max(0, Math.min(300, parseInt(savedValue, 10) || defaultValue)); }

                        else if (Number.isInteger(defaultValue)) { savedValue = parseInt(savedValue, 10) || defaultValue; }

                    } else { savedValue = defaultValue; }

                } else if (defaultValueType === 'string') {

                    savedValue = (typeof savedValue === 'string') ? savedValue : defaultValue;

                    if (key === 'effectType' && !isValidEffectType(savedValue)) { savedValue = 'none'; }

                }

                currentSettings[key] = savedValue;

            });

            if (!currentSettings.quickLinks || !Array.isArray(currentSettings.quickLinks) || currentSettings.quickLinks.length === 0) {

                currentSettings.quickLinks = tempDefault.quickLinks;

            }

        } catch (e) {

            console.error('[BR Style] Ошибка загрузки настроек v9.0!', e);

            currentSettings = { ...defaultSettings };

            if (!Array.isArray(currentSettings.quickLinks)) { currentSettings.quickLinks = defaultSettings.quickLinks; }

            alert('[BR Style] Ошибка загрузки настроек! Применены стандартные значения (v9.0).');

        }

    }

    async function saveSettings(settingsToSave) {

        try {

            const savePromises = [];

            const validatedSettings = {};

            for (const key in settingsToSave) {

                if (defaultSettings.hasOwnProperty(key)) {

                    let valueToStore = settingsToSave[key];

                    let validatedValue = valueToStore;

                    if (key === 'quickLinks' && Array.isArray(valueToStore)) {

                        valueToStore = JSON.stringify(valueToStore);

                    } else if (typeof defaultSettings[key] === 'number') {

                        const parsedValue = parseFloat(validatedValue);

                        if (!isNaN(parsedValue)) {

                            validatedValue = parsedValue;

                            if (['opacityValue', 'edgeOpacity', 'bottomNavOpacity', 'transparentElementsOpacity'].includes(key)) { validatedValue = Math.max(0, Math.min(1, validatedValue)); }

                            else if (key === 'effectIntensity') { validatedValue = Math.max(10, Math.min(200, parseInt(validatedValue, 10) || defaultSettings.effectIntensity)); }

                            else if (key === 'effectSpeed') { validatedValue = Math.max(0.1, Math.min(5, validatedValue || defaultSettings.effectSpeed)); }

                            else if (key === 'effectSwayIntensity') { validatedValue = Math.max(0, Math.min(3, validatedValue || defaultSettings.effectSwayIntensity)); }

                            else if (key === 'effectRainLength') { validatedValue = Math.max(5, Math.min(50, parseInt(validatedValue, 10) || defaultSettings.effectRainLength)); }

                            else if (key === 'bgFilterBlur') { validatedValue = Math.max(0, Math.min(50, parseInt(validatedValue, 10) || defaultSettings.bgFilterBlur)); }

                            else if (['bgFilterBrightness', 'bgFilterContrast', 'bgFilterSaturation'].includes(key)) { validatedValue = Math.max(0, Math.min(300, parseInt(validatedValue, 10) || defaultSettings[key])); }

                            valueToStore = validatedValue;

                        } else {

                            validatedValue = defaultSettings[key];

                            valueToStore = defaultSettings[key];

                        }

                    } else if (key === 'effectType') {

                        if (!isValidEffectType(validatedValue)) { validatedValue = 'none'; }

                        valueToStore = validatedValue;

                    } else if (typeof defaultSettings[key] === 'boolean') {

                         valueToStore = !!validatedValue;

                    } else if (typeof defaultSettings[key] === 'string') {

                         valueToStore = String(validatedValue);

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

            console.error('[BR Style] Ошибка сохранения настроек v9.0!', e);

            alert('[BR Style] Ошибка сохранения настроек! (v9.0)');

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

            const finalEdgeBoxShadow = settings.enableEdge ? `0 0 0 ${settings.edgeWidth} ${edgeColorWithOpacity}` : 'none';

            const finalBorderRadius = settings.enableRounding ? settings.borderRadius : '0px';

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

            let bodyBackgroundStyle = '';

            let bodyBeforeStyle = '';

            let backgroundFilterStyle = '';

            if (settings.enableBgFilter && settings.bgImageDataUri && !settings.enableGradient) {

                const filters = [];

                if (settings.bgFilterBlur > 0) filters.push(`blur(${settings.bgFilterBlur}px)`);

                if (settings.bgFilterBrightness !== 100) filters.push(`brightness(${settings.bgFilterBrightness}%)`);

                if (settings.bgFilterContrast !== 100) filters.push(`contrast(${settings.bgFilterContrast}%)`);

                if (settings.bgFilterSaturation !== 100) filters.push(`saturate(${settings.bgFilterSaturation}%)`);

                if (filters.length > 0) backgroundFilterStyle = `filter: ${filters.join(' ')};`;

                bodyBeforeStyle = `

                    content: '';

                    position: fixed;

                    top: 0; left: 0;

                    width: 100vw;

                    height: 100vh;

                    z-index: -1;

                    background-image: url('${settings.bgImageDataUri}') !important;

                    background-size: cover !important;

                    background-attachment: fixed !important;

                    background-position: center center !important;

                    background-repeat: no-repeat !important;

                    ${backgroundFilterStyle}

                `;

                bodyBackgroundStyle = `background-color: ${fallbackBgColor} !important;`;

            } else if (settings.enableAnimatedGradient && settings.enableGradient) {

                bodyBackgroundStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1}); background-size: 400% 400%; animation: animatedGradient ${settings.animatedGradientSpeed} ease infinite; background-attachment: fixed;`;

            } else if (settings.enableGradient) {

                bodyBackgroundStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important; background-size: cover !important; background-attachment: fixed !important; background-position: center center !important; background-repeat: no-repeat !important;`;

            } else if (settings.bgImageDataUri) {

                bodyBackgroundStyle = `background-image: url('${settings.bgImageDataUri}') !important; background-size: cover !important; background-attachment: fixed !important; background-position: center center !important; background-repeat: no-repeat !important;`;

            } else {

                bodyBackgroundStyle = `background-color: ${fallbackBgColor} !important;`;

            }

            const animatedGradientKeyframes = (settings.enableAnimatedGradient && settings.enableGradient)

                ? `@keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`

                : '';

            const forumCss = `

                ${fontTargetSelector} {

                    ${settings.fontFamily ? `font-family: ${settings.fontFamily} !important;` : ''}

                }

                body {

                    ${bodyBackgroundStyle}

                }

                ${bodyBeforeStyle ? `body::before { ${bodyBeforeStyle} }` : ''}

                ${animatedGradientKeyframes}

                ${pageWrapperSelector}, ${mainElementsSelector} {

                    background-color: ${mainElementBgColor} !important;

                    border-radius: ${finalBorderRadius} !important;

                    box-shadow: ${finalEdgeBoxShadow} !important;

                    ${settings.enableRounding ? 'overflow: hidden;' : ''}

                }

                ${transparentElementsSelector} {

                    background: none !important;

                    border: none !important;

                    box-shadow: none !important;

                    opacity: ${settings.transparentElementsOpacity} !important;

                }

                ${settings.enableTextGlow ? `${textGlowTargetSelector}, .fa, .fab, .fas, .far { text-shadow: 0 0 ${settings.textGlowIntensity} ${settings.textGlowColor}; }` : ''}

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

            console.error('[BR Style] Ошибка применения динамических стилей v9.0!', e);

            if (styleElement) styleElement.textContent = '';

        }

    }

    function createPanelHTML() {

        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);

        const panelDiv = document.createElement('div');

        panelDiv.id = PANEL_ID;

        try {

            const fontOptionsHtml = availableFonts.map(font => `<option value="${font.value}">${font.name}</option>`).join('');

            const presetButtonsHtml = Object.keys(presets)

                .sort()

                .map(key => `<button data-preset="${key}" title="Применить пресет темы '${key.replace(/_/g, ' ')}'">${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</button>`)

                .join('');

            const createSlider = (id, key, label, min, max, step, unit = '') => `

                <div>

                    <label for="s_${id}">${label}: <span class="slider-value" id="val_${id}"></span>${unit}</label>

                    <input type="range" id="s_${id}" name="${id}" data-setting-key="${key}" min="${min}" max="${max}" step="${step}">

                </div>`;

            panelDiv.innerHTML = `

                <h3>🎨 Настройки Стиля Форума v9.2</h3>

                <div class="setting-group preset-buttons-container">

                    <label>Пресеты Темы:</label>

                    <div class="preset-buttons">${presetButtonsHtml}</div>

                    <small id="preset-status" class="panel-status-text">&nbsp;</small>

                </div>

                <hr>

                <h4>-- Фон & Основные Элементы --</h4>

                <div class="setting-group">

                    <input type="checkbox" id="s_enableGradient" name="enableGradient" data-setting-key="enableGradient">

                    <label for="s_enableGradient" class="inline-label">🌈 Градиентный фон</label>

                    <div class="sub-settings" id="gradient-sub-settings">

                        <div><label for="s_gradientColor1">Цвет 1:</label><input type="color" id="s_gradientColor1" name="gradientColor1" data-setting-key="gradientColor1"></div>

                        <div style="margin-top: 8px;"><label for="s_gradientColor2">Цвет 2:</label><input type="color" id="s_gradientColor2" name="gradientColor2" data-setting-key="gradientColor2"></div>

                        <div style="margin-top: 8px;"><label for="s_gradientColor3">Цвет 3:</label><input type="color" id="s_gradientColor3" name="gradientColor3" data-setting-key="gradientColor3"></div>

                        <div style="margin-top: 8px;"><label for="s_gradientColor4">Цвет 4:</label><input type="color" id="s_gradientColor4" name="gradientColor4" data-setting-key="gradientColor4"></div>

                        <div style="margin-top: 8px;"><label for="s_gradientDirection">Направление:</label><input type="text" id="s_gradientDirection" name="gradientDirection" data-setting-key="gradientDirection" placeholder="Напр: 135deg, to right"><small class="panel-status-text">CSS формат</small></div>

                        <div style="margin-top: 12px;">

                            <input type="checkbox" id="s_enableAnimatedGradient" name="enableAnimatedGradient" data-setting-key="enableAnimatedGradient">

                            <label for="s_enableAnimatedGradient" class="inline-label">💫 Анимированный градиент</label>

                            <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top: 5px;">

                                <label for="s_animatedGradientSpeed">Скорость:</label><input type="text" id="s_animatedGradientSpeed" name="animatedGradientSpeed" data-setting-key="animatedGradientSpeed" placeholder="Напр: 5s, 10s"><small class="panel-status-text">CSS формат времени</small>

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

                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #555;">

                        <input type="checkbox" id="s_enableBgFilter" name="enableBgFilter" data-setting-key="enableBgFilter">

                        <label for="s_enableBgFilter" class="inline-label">✨ Продвинутый фон (Фильтры)</label>

                        <small class="panel-status-text">Применяется только к фону-изображению.</small>

                        <div class="sub-settings" id="bg-filter-sub-settings">

                            ${createSlider('bgFilterBlur', 'bgFilterBlur', 'Размытие', 0, 50, 1, 'px')}

                            ${createSlider('bgFilterBrightness', 'bgFilterBrightness', 'Яркость', 0, 300, 5, '%')}

                            ${createSlider('bgFilterContrast', 'bgFilterContrast', 'Контраст', 0, 300, 5, '%')}

                            ${createSlider('bgFilterSaturation', 'bgFilterSaturation', 'Насыщенность', 0, 300, 5, '%')}

                        </div>

                    </div>

                    </div>

                <hr>

                <div class="setting-group">

                    <label for="s_bgColor">🎨 Цвет Блоков:</label>

                    <input type="color" id="s_bgColor" name="bgColor" data-setting-key="bgColor">

                </div>

                <div class="setting-group">

                    <label for="s_opacityValue">💧 Прозрачность Блоков:</label>

                    <input type="range" id="s_opacityValue" name="opacityValue" min="0" max="1" step="0.05" data-setting-key="opacityValue">

                    <span class="slider-value" id="val_opacityValue"></span>

                </div>

                <div class="setting-group">

                    <input type="checkbox" id="s_enableRounding" name="enableRounding" data-setting-key="enableRounding">

                    <label for="s_enableRounding" class="inline-label">📐 Скругление</label>

                    <div class="sub-settings" id="rounding-sub-settings">

                        <label for="s_borderRadius">Радиус:</label>

                        <input type="text" id="s_borderRadius" name="borderRadius" data-setting-key="borderRadius" placeholder="8px, 10px...">

                    </div>

                </div>

                <div class="setting-group">

                    <input type="checkbox" id="s_enableEdge" name="enableEdge" data-setting-key="enableEdge">

                    <label for="s_enableEdge" class="inline-label">✨ Окантовка</label>

                    <div class="sub-settings" id="edge-sub-settings">

                        <div><label for="s_edgeColor">Цвет:</label> <input type="color" id="s_edgeColor" name="edgeColor" data-setting-key="edgeColor"></div>

                        <div style="margin-top: 8px;"><label for="s_edgeWidth">Толщина:</label> <input type="text" id="s_edgeWidth" name="edgeWidth" data-setting-key="edgeWidth" placeholder="1px, 2px..."></div>

                        <div style="margin-top: 8px;">

                             <label for="s_edgeOpacity">Прозрачность: <span class="slider-value" id="val_edgeOpacity"></span></label>

                             <input type="range" id="s_edgeOpacity" name="edgeOpacity" min="0" max="1" step="0.05" data-setting-key="edgeOpacity">

                        </div>

                    </div>

                </div>

                <hr>

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

                        <div style="margin-top: 8px;"><label for="s_textGlowIntensity">Интенсивность:</label> <input type="text" id="s_textGlowIntensity" name="textGlowIntensity" data-setting-key="textGlowIntensity" placeholder="Напр: 5px, 0.2em"></div>

                    </div>

                </div>

                <div class="setting-group">

                    <label for="s_transparentElementsOpacity">👻 Прозрачность Фона Элементов: <span class="slider-value" id="val_transparentElementsOpacity"></span></label>

                    <input type="range" id="s_transparentElementsOpacity" name="transparentElementsOpacity" min="0" max="1" step="0.05" data-setting-key="transparentElementsOpacity">

                    <small class="panel-status-text">Фон сообщений, блоков и т.д.</small>

                </div>

                <hr>

                <h4>-- Визуальные Эффекты 🌨️🌸🍂 --</h4>

                <div class="setting-group">

                    <label for="s_effectType">Тип Эффекта:</label>

                    <select id="s_effectType" name="effectType" data-setting-key="effectType">

                        <option value="none">Отключено</option> <option value="rain">Дождь 🌧️</option> <option value="snow">Снег ❄️</option>

                        <option value="petals-sakura">Лепестки Сакуры 🌸</option> <option value="petals-red_rose">Лепестки Розы (кр.) 🌹</option> <option value="leaves-autumn_maple">Листья Клена (ос.) 🍂</option>

                    </select>

                </div>

                <div class="setting-group sub-settings" id="effect-details-settings">

                     ${createSlider('effectIntensity', 'effectIntensity', 'Интенсивность (Кол-во)', 10, 200, 10)}

                     ${createSlider('effectSpeed', 'effectSpeed', 'Скорость (Множитель)', 0.1, 5, 0.1)}

                    <div class="effect-specific-settings rain-settings" style="display:none; margin-top: 8px;">

                         ${createSlider('effectRainLength', 'effectRainLength', 'Длина капли', 5, 50, 1, 'px')}

                    </div>

                    <div class="effect-specific-settings sway-settings" style="display:none; margin-top: 8px;">

                         ${createSlider('effectSwayIntensity', 'effectSwayIntensity', 'Покачивание (Множитель)', 0, 3, 0.1)}

                    </div>

                    <small class="panel-status-text">Настройте вид и поведение частиц.</small>

                </div>

                <hr>

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

                    <label for="s_bottomNavOpacity">Прозрачность: <span class="slider-value" id="val_bottomNavOpacity"></span></label>

                    <input type="range" id="s_bottomNavOpacity" name="bottomNavOpacity" min="0" max="1" step="0.05" data-setting-key="bottomNavOpacity">

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

                <hr>

                <p class="author-credit">Автор: Муж Vika Ageeva - Maras Ageev ❤️ (v9.0) / Мод: Gemini (v9.2)</p>

                <div class="button-group">

                    <button id="export-btn" class="panel-btn panel-btn-export" title="Экспорт">📤</button>

                    <button id="import-btn" class="panel-btn panel-btn-import" title="Импорт">📥</button>

                    <input type="file" id="import-settings-file" accept=".json" style="display: none;">

                    <span style="flex-grow: 1;"></span>

                    <button id="reset-btn" class="panel-btn panel-btn-reset" title="Сбросить всё">🔄</button>

                    <button id="save-btn" class="panel-btn panel-btn-save">💾 Сохранить</button>

                    <button id="close-btn" class="panel-btn panel-btn-close">❌ Закрыть</button>

                </div>

                <small id="import-status" class="panel-status-text">&nbsp;</small>

            `;

            document.body.appendChild(panelDiv);

            const saveBtn = panelDiv.querySelector('#save-btn');

            const bgFileInput = panelDiv.querySelector('#s_bgImageFile');

            const clearBgBtn = panelDiv.querySelector('#clear-bg-btn');

            const bgStatus = panelDiv.querySelector('#bg-status');

            const presetButtons = panelDiv.querySelectorAll('.preset-buttons button');

            const presetStatus = panelDiv.querySelector('#preset-status');

            const exportBtn = panelDiv.querySelector('#export-btn');

            const importBtn = panelDiv.querySelector('#import-btn');

            const importFileInput = panelDiv.querySelector('#import-settings-file');

            const importStatus = panelDiv.querySelector('#import-status');

            const addQuickLinkBtn = panelDiv.querySelector('#add-quick-link-btn');

            const quickLinksContainer = panelDiv.querySelector('#quick-links-container');

            const resetBtn = panelDiv.querySelector('#reset-btn');

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

            const enableBgFilterCheckbox = panelDiv.querySelector('#s_enableBgFilter');

            const bgFilterSubSettings = panelDiv.querySelector('#bg-filter-sub-settings');

            const enableBottomNavClockCheckbox = panelDiv.querySelector('#s_enableBottomNavClock');

            const clockSubSettings = panelDiv.querySelector('#clock-sub-settings');

            const addQuickLinkInput = (link = { name: '', url: '' }) => {

                 const linkInputDiv = document.createElement('div'); linkInputDiv.className = 'quick-link-input-item'; linkInputDiv.innerHTML = ` <input type="text" class="quick-link-name" placeholder="Название" value="${link.name || ''}"> <input type="text" class="quick-link-url" placeholder="URL (https://...)" value="${link.url || ''}"> <button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить ссылку">➖</button> `; quickLinksContainer.appendChild(linkInputDiv); linkInputDiv.querySelector('.remove-quick-link-btn').addEventListener('click', () => { linkInputDiv.remove(); });

            };

            const toggleEffectSubSettings = () => {

                const effectType = effectTypeSelect.value; const showDetails = effectType !== 'none'; effectDetailsSettings.style.display = showDetails ? 'block' : 'none'; if (showDetails) { effectRainSettings.style.display = (effectType === 'rain') ? 'block' : 'none'; effectSwaySettings.style.display = (effectType.startsWith('snow') || effectType.startsWith('petals') || effectType.startsWith('leaves')) ? 'block' : 'none'; } else { effectRainSettings.style.display = 'none'; effectSwaySettings.style.display = 'none'; }

            };

            const toggleGenericSubSettings = (checkbox, subSettingsDiv) => {

                if (checkbox && subSettingsDiv) subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';

            };

            const updateSliderValue = (slider) => {

                const valueDisplay = panelDiv.querySelector(`#val_${slider.name || slider.id.substring(2)}`);

                if (valueDisplay) {

                    valueDisplay.textContent = slider.value;

                }

            };

            const initializeSubSettingsVisibility = () => {

                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);

                toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);

                toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings);

                toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings);

                toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings);

                toggleEffectSubSettings();

                toggleGenericSubSettings(enableBgFilterCheckbox, bgFilterSubSettings);

                toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings);

                if (bgImageSettingGroup) {

                    bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';

                }

                 if (animatedGradientSubSettings) {

                    animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';

                }

                 if (bgFilterSubSettings) {

                     bgFilterSubSettings.style.display = (!enableGradientCheckbox.checked && bgFileInput.value === '' && currentSettings.bgImageDataUri && enableBgFilterCheckbox.checked) || (!enableGradientCheckbox.checked && bgFileInput.files.length > 0 && enableBgFilterCheckbox.checked) ? 'block' : 'none';

                 }

                 panelDiv.querySelectorAll('input[type="range"]').forEach(updateSliderValue);

            };

             effectTypeSelect._initializeVisibility = initializeSubSettingsVisibility;

            enableGradientCheckbox.addEventListener('change', () => {

                toggleGenericSubSettings(enableGradientCheckbox, gradientSubSettings);

                if (bgImageSettingGroup) bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';

                if (animatedGradientSubSettings) animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';

                 if (bgFilterSubSettings) bgFilterSubSettings.style.display = (!enableGradientCheckbox.checked && enableBgFilterCheckbox.checked) ? 'block' : 'none';

            });

            enableAnimatedGradientCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings));

            enableRoundingCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableRoundingCheckbox, roundingSubSettings));

            enableEdgeCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableEdgeCheckbox, edgeSubSettings));

            enableTextGlowCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableTextGlowCheckbox, textGlowSubSettings));

            effectTypeSelect.addEventListener('change', toggleEffectSubSettings);

            enableBgFilterCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBgFilterCheckbox, bgFilterSubSettings));

            enableBottomNavClockCheckbox.addEventListener('change', () => toggleGenericSubSettings(enableBottomNavClockCheckbox, clockSubSettings));

            panelDiv.querySelectorAll('input[type="range"]').forEach(slider => {

                slider.addEventListener('input', () => updateSliderValue(slider));

            });

            addQuickLinkBtn.addEventListener('click', () => addQuickLinkInput());

            resetBtn.addEventListener('click', handleReset);

            saveBtn.addEventListener('click', handleSave);

            clearBgBtn.addEventListener('click', handleClearBg);

            panelDiv.querySelector('#close-btn').addEventListener('click', closePanel);

            presetButtons.forEach(button => button.addEventListener('click', handlePresetClick));

            exportBtn.addEventListener('click', handleExport);

            importBtn.addEventListener('click', () => importFileInput.click());

            importFileInput.addEventListener('change', handleImport);

            initializeSubSettingsVisibility();

            settingsPanel = panelDiv;

            return panelDiv;

        } catch (e) {

            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА создания HTML панели настроек v9.0!', e);

            if (panelDiv && panelDiv.parentNode) {

                 panelDiv.parentNode.removeChild(panelDiv);

            }

            alert('[BR Style] Критическая ошибка создания панели настроек (v9.0)! Проверьте консоль.');

            return null;

        }

    }

    async function handleReset() {

        if (!confirm('Вы уверены, что хотите сбросить ВСЕ настройки стиля к значениям по умолчанию (v9.0)? Это действие необратимо.')) return;

        if (!settingsPanel) return;

        const resetBtn = settingsPanel.querySelector('#reset-btn');

        if (!resetBtn) return;

        const originalBtnText = resetBtn.textContent; resetBtn.textContent = 'Сброс...⏳'; resetBtn.disabled = true;

        const settingsToReset = { ...defaultSettings };

        const success = await saveSettings(settingsToReset);

        if (success) {

            openPanel();

            applyForumStyles(currentSettings);

            updateBottomNavBarContent(currentSettings);

            manageVisualEffects(currentSettings);

            const presetStatus = settingsPanel.querySelector('#preset-status'); if(presetStatus) presetStatus.innerHTML = '&nbsp;';

            const importStatus = settingsPanel.querySelector('#import-status'); if(importStatus) importStatus.innerHTML = '&nbsp;';

            const bgStatus = settingsPanel.querySelector('#bg-status'); if(bgStatus) bgStatus.textContent = 'Фон не задан.';

            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';

            resetBtn.textContent = 'Сброшено! ✅'; resetBtn.style.backgroundColor = '#ffc107';

            setTimeout(() => { resetBtn.textContent = '🔄'; resetBtn.style.backgroundColor = ''; resetBtn.disabled = false; }, 1500);

        } else {

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

            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks') {

                let value;

                if (input.type === 'checkbox') { value = input.checked; }

                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }

                else { value = input.value; }

                settingsToUpdate[key] = value;

            }

        });

        settingsToUpdate.quickLinks = [];

        settingsPanel.querySelectorAll('#quick-links-container .quick-link-input-item').forEach(item => {

             const name = item.querySelector('.quick-link-name').value.trim(); const url = item.querySelector('.quick-link-url').value.trim(); if (name && url) settingsToUpdate.quickLinks.push({ name, url });

        });

        if (!settingsToUpdate.enableGradient && bgFileInput && bgFileInput.files.length > 0) {

            try {

                settingsToUpdate.bgImageDataUri = await readFileAsDataURL(bgFileInput.files[0]);

                settingsToUpdate.enableBgFilter = settingsPanel.querySelector('#s_enableBgFilter').checked;

            } catch (error) {

                alert(`Ошибка чтения файла: ${error.message}`); errorOccurred = true;

            }

        } else if (!settingsToUpdate.enableGradient) {

            settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';

        } else {

            settingsToUpdate.bgImageDataUri = '';

            settingsToUpdate.enableBgFilter = false;

        }

        if (!errorOccurred) {

            const success = await saveSettings(settingsToUpdate);

            if (success) {

                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {

                    const key = input.dataset.settingKey; if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks') { if (input.type === 'checkbox') input.checked = currentSettings[key]; else input.value = currentSettings[key] ?? ''; }

                });

                 settingsPanel.querySelectorAll('input[type="range"]').forEach(slider => {

                     const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);

                     if (valueDisplay) valueDisplay.textContent = slider.value;

                 });

                applyForumStyles(currentSettings);

                updateBottomNavBarContent(currentSettings);

                manageVisualEffects(currentSettings);

                const bgStatus = settingsPanel.querySelector('#bg-status');

                if(bgStatus) {

                    if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано ${currentSettings.enableBgFilter ? '(Фильтры ✨)' : ''}` : 'Фон не задан.'; }

                }

                if (bgFileInput && bgFileInput.files.length > 0) bgFileInput.value = '';

                const presetStatus = settingsPanel.querySelector('#preset-status'); if(presetStatus) presetStatus.innerHTML = '&nbsp;';

                const importStatus = settingsPanel.querySelector('#import-status'); if(importStatus) importStatus.innerHTML = '&nbsp;';

                const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?._initializeVisibility;

                if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {

                    initializeVisibilityFunc();

                }

                saveBtn.textContent = 'Сохранено! ✅'; saveBtn.style.backgroundColor = '#28a745';

                setTimeout(() => { saveBtn.textContent = '💾 Сохранить'; saveBtn.style.backgroundColor = ''; saveBtn.disabled = false; }, 1500);

            } else {

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

             bgImageDataUri: '',

             enableBgFilter: false

            });

         if (success) {

             applyForumStyles(currentSettings);

             const bgStatus = settingsPanel.querySelector('#bg-status');

             if(bgStatus) bgStatus.textContent = 'Фон не задан.';

             const enableBgFilterCheckbox = settingsPanel.querySelector('#s_enableBgFilter');

             const bgFilterSubSettings = settingsPanel.querySelector('#bg-filter-sub-settings');

             if (enableBgFilterCheckbox) enableBgFilterCheckbox.checked = false;

             if (bgFilterSubSettings) bgFilterSubSettings.style.display = 'none';

             if (clearBgBtn) {

                clearBgBtn.textContent = '✔️';

                setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);

             }

         } else {

             alert('[BR Style] Не удалось удалить фон. Ошибка сохранения.');

         }

    }

    function handlePresetClick(event) {

        if (!settingsPanel) return;

        const button = event.target;

        const presetName = button.dataset.preset;

        const selectedPreset = presets[presetName];

        if (!selectedPreset) return;

        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if (bgFileInput) bgFileInput.value = '';

        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {

            const key = input.dataset.settingKey;

            if (key === 'quickLinks' || key.startsWith('bottomNav') || key.startsWith('effect') || key.startsWith('bgFilter') || key === 'enableBgFilter' || key === 'enableBottomNavClock') return;

            const updateSliderValue = (slider) => {

                const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);

                if (valueDisplay) valueDisplay.textContent = slider.value;

            };

            if (selectedPreset.hasOwnProperty(key)) {

                const value = selectedPreset[key];

                if (input.type === 'checkbox') input.checked = !!value;

                else if (input.type === 'range') { input.value = value ?? defaultSettings[key]; updateSliderValue(input); }

                else input.value = value ?? '';

            } else if (defaultSettings.hasOwnProperty(key)) {

                const defaultValue = defaultSettings[key];

                if (input.type === 'checkbox') input.checked = !!defaultValue;

                 else if (input.type === 'range') { input.value = defaultValue; updateSliderValue(input); }

                 else input.value = defaultValue ?? '';

            }

        });

        const bgStatus = settingsPanel.querySelector('#bg-status');

        if (bgStatus) {

            const presetBg = selectedPreset.bgImageDataUri; const presetGrad = selectedPreset.enableGradient; const presetAnimGrad = selectedPreset.enableAnimatedGradient; if (presetGrad) bgStatus.textContent = presetAnimGrad ? 'Фон: (из пресета 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (из пресета 🌈 градиент, нажмите Сохранить)'; else bgStatus.textContent = presetBg ? 'Фон: (из пресета 🖼️ изображение, нажмите Сохранить)' : 'Фон: (очищен пресетом, нажмите Сохранить)';

        }

        const presetStatus = settingsPanel.querySelector('#preset-status');

        if (presetStatus) {

            presetStatus.textContent = `Пресет "${button.textContent}" загружен. Нажмите '💾 Сохранить'.`; setTimeout(() => { if (presetStatus) presetStatus.innerHTML = '&nbsp;'; }, 4000);

        }

        const importStatus = settingsPanel.querySelector('#import-status'); if(importStatus) importStatus.innerHTML = '&nbsp;';

        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?._initializeVisibility;

        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {

             initializeVisibilityFunc();

        }

    }

    function handleExport() {

        try {

            const settingsToExport = { ...defaultSettings, ...currentSettings };

            if (!Array.isArray(settingsToExport.quickLinks)) {

                settingsToExport.quickLinks = defaultSettings.quickLinks;

            }

            const settingsJson = JSON.stringify(settingsToExport, null, 2);

            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

            downloadFile(`br-style-settings-v9.2-${timestamp}.json`, settingsJson, 'application/json');

        } catch (e) {

            console.error('[BR Style] Ошибка экспорта настроек v9.0:', e);

            alert('[BR Style] Ошибка при экспорте настроек (v9.0).');

        }

    }

    function handleImport(event) {

        if (!settingsPanel) return;

        const file = event.target.files[0];

        if (!file) return;

        const importStatus = settingsPanel.querySelector('#import-status'); importStatus.textContent = 'Чтение файла...⏳';

        const reader = new FileReader();

        reader.onload = (e) => {

            try {

                const importedSettings = JSON.parse(e.target.result);

                if (typeof importedSettings !== 'object' || importedSettings === null) throw new Error("Файл не содержит корректный JSON объект.");

                let appliedCount = 0;

                 const updateSliderValue = (slider) => {

                     const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);

                     if (valueDisplay) valueDisplay.textContent = slider.value;

                 };

                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {

                    const key = input.dataset.settingKey;

                    if (key === 'quickLinks') return;

                    if (importedSettings.hasOwnProperty(key)) {

                        let value = importedSettings[key];

                        let validatedValue = value;

                        if (input.type === 'checkbox') {

                            validatedValue = !!value; input.checked = validatedValue;

                        } else if (input.type === 'number' || input.type === 'range') {

                            let parsedValue = parseFloat(value);

                            validatedValue = isNaN(parsedValue) ? defaultSettings[key] : parsedValue;

                            if (['opacityValue', 'edgeOpacity', 'bottomNavOpacity', 'transparentElementsOpacity'].includes(key)) { validatedValue = Math.max(0, Math.min(1, validatedValue)); }

                            else if (key === 'effectIntensity') { validatedValue = Math.max(10, Math.min(200, parseInt(validatedValue, 10) || defaultSettings.effectIntensity)); }

                            else if (key === 'effectSpeed') { validatedValue = Math.max(0.1, Math.min(5, validatedValue || defaultSettings.effectSpeed)); }

                            else if (key === 'effectSwayIntensity') { validatedValue = Math.max(0, Math.min(3, validatedValue || defaultSettings.effectSwayIntensity)); }

                            else if (key === 'effectRainLength') { validatedValue = Math.max(5, Math.min(50, parseInt(validatedValue, 10) || defaultSettings.effectRainLength)); }

                            else if (key === 'bgFilterBlur') { validatedValue = Math.max(0, Math.min(50, parseInt(validatedValue, 10) || defaultSettings.bgFilterBlur)); }

                            else if (['bgFilterBrightness', 'bgFilterContrast', 'bgFilterSaturation'].includes(key)) { validatedValue = Math.max(0, Math.min(300, parseInt(validatedValue, 10) || defaultSettings[key])); }

                             input.value = validatedValue;

                             if (input.type === 'range') updateSliderValue(input);

                        } else if (key === 'effectType') {

                            validatedValue = isValidEffectType(value) ? value : 'none'; input.value = validatedValue;

                        } else {

                             input.value = value ?? '';

                        }

                        appliedCount++;

                    }

                });

                const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');

                quickLinksContainer.innerHTML = '';

                const importedLinks = importedSettings.quickLinks;

                const addQuickLinkInput = (lnk) => {const div = document.createElement('div'); div.className='quick-link-input-item'; div.innerHTML=`<input type="text" class="quick-link-name" placeholder="Название" value="${lnk.name||''}"><input type="text" class="quick-link-url" placeholder="URL" value="${lnk.url||''}"><button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить">➖</button>`; quickLinksContainer.appendChild(div); div.querySelector('.remove-quick-link-btn').addEventListener('click',()=>div.remove());};

                if (Array.isArray(importedLinks)) {

                    importedLinks.forEach(link => { if (link && typeof link.name === 'string' && typeof link.url === 'string') addQuickLinkInput(link); });

                } else {

                    (currentSettings.quickLinks || defaultSettings.quickLinks).forEach(link => addQuickLinkInput(link));

                }

                 const bgStatus = settingsPanel.querySelector('#bg-status');

                if (bgStatus) {

                    const importedBgData = importedSettings.bgImageDataUri; const importedGradient = importedSettings.enableGradient; const importedAnimGradient = importedSettings.enableAnimatedGradient; const importedFilter = importedSettings.enableBgFilter; if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; } else { bgStatus.textContent = importedBgData ? `Фон: (импортирован 🖼️ изображение ${importedFilter ? 'с Фильтрами ✨' : ''}, нажмите Сохранить)` : 'Фон: (очищен импортом, нажмите Сохранить)'; }

                }

                const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';

                if (appliedCount > 0 || (Array.isArray(importedLinks) && importedLinks.length > 0)) {

                    importStatus.textContent = `✅ Импортировано ${appliedCount} настроек + ссылки. Нажмите '💾 Сохранить'.`;

                    const presetStatus = settingsPanel.querySelector('#preset-status'); if(presetStatus) presetStatus.innerHTML = '&nbsp;';

                    const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?._initializeVisibility;

                    if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {

                         initializeVisibilityFunc();

                    }

                } else {

                    throw new Error("В файле не найдено совместимых настроек.");

                }

            } catch (error) {

                console.error('[BR Style] Ошибка импорта настроек v9.0:', error);

                importStatus.textContent = `❌ Ошибка: ${error.message}`;

                alert(`[BR Style] Ошибка импорта (v9.0): ${error.message}`);

            } finally {

                event.target.value = null;

            }

        };

        reader.onerror = (e) => {

             console.error('[BR Style] Ошибка чтения файла для импорта:', e); importStatus.textContent = '❌ Ошибка чтения файла.'; alert('[BR Style] Не удалось прочитать файл.'); event.target.value = null;

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

             const updateSliderValue = (slider) => {

                 const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);

                 if (valueDisplay) valueDisplay.textContent = slider.value;

             };

            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {

                const key = input.dataset.settingKey;

                if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks') {

                    if (input.type === 'checkbox') { input.checked = currentSettings[key]; }

                    else if (input.type === 'range') { input.value = currentSettings[key] ?? ''; updateSliderValue(input); }

                    else { input.value = currentSettings[key] ?? ''; }

                }

            });

            const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');

            if (quickLinksContainer) {

                quickLinksContainer.innerHTML = '';

                const addQuickLinkInput = (lnk) => {const div = document.createElement('div'); div.className='quick-link-input-item'; div.innerHTML=`<input type="text" class="quick-link-name" placeholder="Название" value="${lnk.name||''}"><input type="text" class="quick-link-url" placeholder="URL" value="${lnk.url||''}"><button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить">➖</button>`; quickLinksContainer.appendChild(div); div.querySelector('.remove-quick-link-btn').addEventListener('click',()=>div.remove());};

                if (Array.isArray(currentSettings.quickLinks)) { currentSettings.quickLinks.forEach(link => addQuickLinkInput(link)); }

            }

            const bgStatus = settingsPanel.querySelector('#bg-status');

            if(bgStatus) {

                if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано ${currentSettings.enableBgFilter ? '(Фильтры ✨)' : ''}` : 'Фон не задан.'; }

            }

            const presetStatus = settingsPanel.querySelector('#preset-status'); if(presetStatus) presetStatus.innerHTML = '&nbsp;';

            const importStatus = settingsPanel.querySelector('#import-status'); if(importStatus) importStatus.innerHTML = '&nbsp;';

            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';

             const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?._initializeVisibility;

             if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {

                initializeVisibilityFunc();

             }

            settingsPanel.style.display = 'block';

        } catch (e) {

            console.error('[BR Style] Ошибка при открытии или заполнении панели настроек v9.0!', e);

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

            bottomNavElement.innerHTML = `<span id="br-style-nav-links-v90"></span><span id="${CLOCK_ID}"></span>`;

            document.body.appendChild(bottomNavElement);

            clockElement = document.getElementById(CLOCK_ID);

        } catch (e) {

            console.error('[BR BottomNav] Ошибка создания элемента нижней панели v9.0!', e);

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

            const linksContainer = bottomNavElement.querySelector('#br-style-nav-links-v90');

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

            console.error('[BR BottomNav] Ошибка обновления содержимого нижней панели v9.0!', e);

        }

    }

     function addSettingsIconHTML() {

         if (document.getElementById(STYLE_ICON_ID)) { settingsIcon = document.getElementById(STYLE_ICON_ID); }

         else if (document.body) {

             try {

                 settingsIcon = document.createElement('div'); settingsIcon.id = STYLE_ICON_ID; settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨 v9.2)'; settingsIcon.innerHTML = '🎨';

                 document.body.appendChild(settingsIcon); settingsIcon.addEventListener('click', togglePanel);

             } catch (e) { console.error('[BR Style] Ошибка добавления иконки настроек v9.0!', e); }

         } else { console.error('[BR Style] Тег body еще не доступен для добавления иконки v9.0!'); }

     }

    function manageVisualEffects(settings) {

         if (!effectsContainer) { effectsContainer = document.getElementById(EFFECTS_CONTAINER_ID); if (!effectsContainer) { if (!document.body) { console.error("[BR Style Effects] Body не найден для создания контейнера!"); return; } effectsContainer = document.createElement('div'); effectsContainer.id = EFFECTS_CONTAINER_ID; document.body.appendChild(effectsContainer); } } effectsContainer.innerHTML = ''; if (!isValidEffectType(settings.effectType) || settings.effectType === 'none') { effectsContainer.style.display = 'none'; return; } effectsContainer.style.display = 'block'; const intensity = Math.max(10, Math.min(200, settings.effectIntensity || 50)); const speedMultiplier = Math.max(0.1, Math.min(5, settings.effectSpeed || 1)); const swayMultiplier = Math.max(0, Math.min(3, settings.effectSwayIntensity || 1)); const rainLength = Math.max(5, Math.min(50, settings.effectRainLength || 20)); const baseDuration = 10; for (let i = 0; i < intensity; i++) { const particle = document.createElement('div'); particle.className = 'br-particle'; let animationDuration = (baseDuration + Math.random() * 4 - 2) / speedMultiplier; animationDuration = Math.max(1, animationDuration); const animationDelay = Math.random() * baseDuration; const initialLeft = Math.random() * 100; const initialOpacity = 0.6 + Math.random() * 0.4; const swayDirection = Math.random() < 0.5 ? -1 : 1; particle.style.left = `${initialLeft}vw`; particle.style.opacity = initialOpacity; particle.style.setProperty('--sway-dir', swayDirection); particle.style.setProperty('--sway-intensity', swayMultiplier); particle.style.animationDelay = `${animationDelay}s`; particle.style.animationDuration = `${animationDuration}s`; let particleType = settings.effectType; let particleClass = particleType.split('-')[0]; particle.classList.add(particleClass); switch (particleType) { case 'rain': const rainWidth = 1 + Math.random() * 1; particle.style.width = `${rainWidth}px`; particle.style.height = `${rainLength}px`; const rainBaseGray = 173 + Math.round(Math.random() * 20 - 10); const rainBaseBlue = 216 + Math.round(Math.random() * 20 - 10); const rainBaseAlpha = 0.4 + Math.random() * 0.3; particle.style.backgroundColor = `rgba(${rainBaseGray}, ${rainBaseBlue}, 230, ${rainBaseAlpha})`; particle.style.transform = `rotate(5deg)`; particle.style.animationName = 'fall-straight'; break; case 'snow': const snowSize = 4 + Math.random() * 4; particle.style.width = `${snowSize}px`; particle.style.height = `${snowSize}px`; const tintType = Math.random(); let snowColor = `255, 255, 255`; if (tintType < 0.1) snowColor = `240, 248, 255`; else if (tintType < 0.2) snowColor = `255, 255, 240`; particle.style.backgroundColor = `rgba(${snowColor}, ${initialOpacity})`; particle.style.borderRadius = '50%'; particle.style.boxShadow = `0 0 ${snowSize / 3}px rgba(255, 255, 255, 0.5)`; particle.style.animationName = 'fall-sway'; particle.style.animationDuration = `${animationDuration * 1.5}s`; break; case 'petals-sakura': case 'petals-red_rose': case 'leaves-autumn_maple': const imgKey = particleType.split('-')[1]; const imgUri = PETAL_IMAGES[imgKey]; if (!imgUri) { continue; } const size = (particleClass === 'leaves' ? 14 : 12) + Math.random() * 6; particle.style.width = `${size}px`; particle.style.height = `${size}px`; particle.style.backgroundImage = `url('${imgUri}')`; particle.style.backgroundSize = 'contain'; particle.style.backgroundRepeat = 'no-repeat'; particle.style.animationName = (particleClass === 'leaves') ? 'fall-leaf' : 'fall-petal'; particle.style.animationDuration = `${animationDuration * (particleClass === 'leaves' ? 1.6 : 1.8)}s`; break; } effectsContainer.appendChild(particle); }

    }

    function injectStaticStyles() {

        const staticStyleId = STYLE_ID + '-static';

        if (document.getElementById(staticStyleId)) { return; }

        try {

            const staticCss = `

                #${BOTTOM_NAV_ID} { box-shadow: 0 0 8px rgba(0,0,0,0.4); height: ${BOTTOM_NAV_HEIGHT}; width: auto; max-width: 90%; min-width: 100px; padding: 0 15px; position: fixed; z-index: 9998; display: flex; justify-content: flex-start; align-items: center; box-sizing: border-box; overflow-x: auto; overflow-y: hidden; white-space: nowrap; transition: background-color 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease; gap: 5px; }

                #${BOTTOM_NAV_ID} #br-style-nav-links-v90 a { color: #e0e0e0; text-decoration: none; padding: 0 12px; margin: 0 3px; font-size: 14px; font-weight: bold; line-height: ${BOTTOM_NAV_HEIGHT}; transition: color 0.2s ease, text-shadow 0.2s ease; text-shadow: 0 0 4px rgba(255, 255, 255, 0.4); display: inline-block; }

                 #${BOTTOM_NAV_ID} #br-style-nav-links-v90 a:hover { color: #FFEB3B; text-shadow: 0 0 7px rgba(255, 235, 59, 0.7); }

                 #${CLOCK_ID} { font-size: 13px; font-weight: normal; margin-left: auto; padding: 0 10px; line-height: ${BOTTOM_NAV_HEIGHT}; font-family: 'Courier New', Courier, monospace; white-space: nowrap; display: none; transition: color 0.3s ease; flex-shrink: 0; }

                #${PANEL_ID} { position: fixed; z-index: 9999; bottom: 60px; left: 10px; width: 380px; background: #333; color: #eee; padding: 15px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.6); display: none; border: 1px solid #555; font-family: sans-serif; font-size: 13px; max-height: calc(100vh - 80px); overflow-y: auto; box-sizing: border-box; }

                #${PANEL_ID} h3 { margin: 0 0 15px; text-align: center; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px; color: #fff;}

                #${PANEL_ID} h4 { margin-top: 20px; margin-bottom: 10px; text-align: center; color: #bbb; border-top: 1px solid #555; padding-top: 15px; font-size: 14px; font-weight: bold;}

                #${PANEL_ID} div.setting-group { margin-bottom: 12px; padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); }

                #${PANEL_ID} label { display: block; margin-bottom: 4px; font-weight: bold; color: #ccc; }

                #${PANEL_ID} label.inline-label { display: inline; font-weight: normal; vertical-align: middle; margin-left: 3px; }

                #${PANEL_ID} input[type="text"], #${PANEL_ID} input[type="number"], #${PANEL_ID} input[type="file"], #${PANEL_ID} select { width: 100%; padding: 6px 8px; background: #444; border: 1px solid #666; color: #eee; border-radius: 3px; box-sizing: border-box; margin-top: 2px; }

                #${PANEL_ID} input[type="color"] { padding: 0; border: 1px solid #666; height: 28px; width: 40px; vertical-align: middle; margin-left: 5px; border-radius: 3px; cursor: pointer; background-color: #555; }

                #${PANEL_ID} input[type="checkbox"] { vertical-align: middle; margin-right: 2px; width: 16px; height: 16px; }

                #${PANEL_ID} input[type="range"] { width: calc(100% - 40px); vertical-align: middle; margin-left: 5px; cursor: pointer; }

                #${PANEL_ID} span.slider-value { display: inline-block; min-width: 30px; text-align: right; font-weight: bold; color: #FFEB3B; margin-left: 5px; }

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

                #${PANEL_ID} #preset-status, #${PANEL_ID} #import-status { font-style: italic; margin-top: 8px; text-align: center; }

                #${STYLE_ICON_ID} { position: fixed; z-index: 9998; width: 40px; height: 40px; background-color: rgba(51, 51, 51, 0.8); border-radius: 50%; cursor: pointer; border: 1px solid rgba(120, 120, 120, 0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: background-color 0.2s ease, transform 0.2s ease; display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; color: white; user-select: none; bottom: 55px; left: 10px; } /* <-- Изменено bottom: 10px на 55px */

                #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }

                #${EFFECTS_CONTAINER_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 9990; display: none; }

                .br-particle { position: absolute; top: -50px; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform, opacity; }

                 @keyframes fall-straight { 0% { transform: translateY(0vh) rotate(5deg); opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(105vh) rotate(5deg); opacity: 0; } }

                 @keyframes fall-sway { 0% { transform: translateY(0vh) translateX(0px) rotate(0deg); } 50% { transform: translateY(50vh) translateX(calc(15px * var(--sway-dir, 1) * var(--sway-intensity, 1))) rotate(180deg); } 100% { transform: translateY(105vh) translateX(calc(-10px * var(--sway-dir, 1) * var(--sway-intensity, 1))) rotate(360deg); } }

                 @keyframes fall-petal { 0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0.9; } 25% { transform: translateY(25vh) rotate(calc(45deg * var(--sway-dir, 1))) translateX(calc(20px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 50% { transform: translateY(50vh) rotate(calc(-30deg * var(--sway-dir, 1))) translateX(calc(-15px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 75% { transform: translateY(75vh) rotate(calc(60deg * var(--sway-dir, 1))) translateX(calc(10px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0.8; } 100% { transform: translateY(105vh) rotate(calc(-10deg * var(--sway-dir, 1))) translateX(calc(-5px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0; } }

                 @keyframes fall-leaf { 0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0.9; } 30% { transform: translateY(30vh) rotate(calc(35deg * var(--sway-dir, 1))) translateX(calc(15px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 60% { transform: translateY(60vh) rotate(calc(-20deg * var(--sway-dir, 1))) translateX(calc(-10px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 1; } 85% { transform: translateY(85vh) rotate(calc(40deg * var(--sway-dir, 1))) translateX(calc(5px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0.8; } 100% { transform: translateY(105vh) rotate(calc(-5deg * var(--sway-dir, 1))) translateX(calc(-2px * var(--sway-dir, 1) * var(--sway-intensity, 1))); opacity: 0; } }

            `;

            const styleElement = document.createElement('style');

            styleElement.id = staticStyleId;

            styleElement.type = 'text/css';

            styleElement.textContent = staticCss;

            (document.head || document.documentElement).appendChild(styleElement);

        } catch (e) {

            console.error('[BR Style] Ошибка внедрения статичных CSS v9.0!', e);

        }

    }

    async function initialize() {

        try {

            injectStaticStyles();

            await loadSettings();

            applyForumStyles(currentSettings);

            const onDomReady = () => {

                 try {

                     createPanelHTML();

                     createBottomNavBarElement();

                     updateBottomNavBarContent(currentSettings);

                     manageVisualEffects(currentSettings);

                     addSettingsIconHTML();

                 } catch (uiError) {

                     console.error('[BR Style] Ошибка при создании UI элементов в onDomReady (v9.0):', uiError);

                     alert('[BR Style] Ошибка создания интерфейса скрипта! (v9.0)');

                 }

             };

            if (document.readyState === 'loading') {

                document.addEventListener('DOMContentLoaded', onDomReady);

            } else {

                onDomReady();

            }

            GM_registerMenuCommand('🎨 Открыть настройки стиля BR (v9.2)', togglePanel, 's');

        } catch (e) {

            console.error('[BR Style] КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ v9.0!', e);

            alert('[BR Style] Критическая ошибка инициализации скрипта v9.0! Проверьте консоль (F12).');

        }

    }

    initialize();

})();