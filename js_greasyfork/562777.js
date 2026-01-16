// ==UserScript==
// @name         (v5.0 Глобальное Обновление) Стиль для BR Forum
// @namespace    http://tampermonkey.net/
// @version      5.0 (Глобальное обновление: Новая система освещения текста с настройками, стабильность и улучшения UI)
// @description  Настройка стиля BR Forum: панель управления, пресеты, шрифты, импорт/экспорт, иконка, градиент+, освещение текста+, условные настройки, доп. стили.
// @author       Maras Ageev (Муж Vika Ageeva)
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562777/%28v50%20%D0%93%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29%20%D0%A1%D1%82%D0%B8%D0%BB%D1%8C%20%D0%B4%D0%BB%D1%8F%20BR%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/562777/%28v50%20%D0%93%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29%20%D0%A1%D1%82%D0%B8%D0%BB%D1%8C%20%D0%B4%D0%BB%D1%8F%20BR%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[BR Style v5.0] 🚀 Инициализация глобального обновления...');

    // --- Константы ---
    const STYLE_ID = 'blackrussia-custom-style-v50';
    const PANEL_ID = 'blackrussia-settings-panel-v50';
    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar-v50';
    const STYLE_ICON_ID = 'br-style-toggle-icon-v50';
    const BOTTOM_NAV_HEIGHT = '38px';
    const MAX_IMAGE_SIZE_MB = 5;

    // --- Глобальные переменные ---
    let settingsPanel = null;
    let settingsIcon = null;
    let bottomNavElement = null;
    let currentSettings = {};

    // --- Стандартные Настройки ⚙️ ---
    const defaultSettings = {
        bgImageDataUri: '',
        opacityValue: 0.9,
        borderRadius: '8px',
        bgColor: '#2E2E2E',
        enableRounding: true,
        enableEdge: true,
        edgeColor: '#FFEB3B',
        edgeWidth: '1px',
        edgeOpacity: 0.7,
        bottomNavOpacity: 0.85,
        bottomNavBorderRadius: '25px',
        link1Name: 'Главная',
        link1Url: 'https://forum.blackrussia.online/',
        link2Name: 'Правила',
        link2Url: 'https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.10/',
        link3Name: 'Жалобы',
        link3Url: 'https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.14/',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        transparentElementsOpacity: 1,
        enableGradient: false,
        gradientColor1: '#333333',
        gradientColor2: '#000000',
        gradientColor3: '#555555',
        gradientColor4: '#222222',
        gradientDirection: '135deg',
        enableAnimatedGradient: false,
        animatedGradientSpeed: '5s',
        enableBottomNav: true,
        // --- Новые настройки освещения текста ---
        enableTextGlow: false,
        textGlowColor: '#FFFF00',
        textGlowIntensity: '5px',
        // --- Дополнительные стили ---
        enableAlternatingMessageBackground: false,
        alternatingMessageBackgroundColor: '#444444',
        enableRoundedAvatars: false,
        avatarBorderRadius: '8px'
    };

    // --- Пресеты Настроек 🎨 ---
    const presets = {
        'default': { ...defaultSettings },
        'modern_dark': { ...defaultSettings, bgColor: '#1C1C1C', opacityValue: 0.95, enableGradient: false, enableTextGlow: true, textGlowColor: '#00BFFF', borderRadius: '12px', enableRounding: true, edgeColor: '#00BFFF', edgeWidth: '1px', edgeOpacity: 0.5 },
        'clean_light': { ...defaultSettings, bgColor: '#F5F5F5', opacityValue: 1, enableGradient: false, enableTextGlow: false, borderRadius: '6px', enableRounding: true, edgeColor: '#E0E0E0', edgeWidth: '1px', edgeOpacity: 0.8, fontFamily: 'Roboto, sans-serif', transparentElementsOpacity: 0.98 },
        'midnight_blue': { ...defaultSettings, bgColor: '#2C3E50', opacityValue: 0.9, enableGradient: true, gradientColor1: '#34495E', gradientColor2: '#2C3E50', gradientDirection: '160deg', enableTextGlow: true, textGlowColor: '#AED6F1', borderRadius: '10px', enableRounding: true },
        'forest_green': { ...defaultSettings, bgColor: '#228B22', opacityValue: 0.88, enableGradient: false, enableTextGlow: true, textGlowColor: '#98FB98', borderRadius: '8px', enableRounding: true, edgeColor: '#98FB98', edgeWidth: '1px', edgeOpacity: 0.6 }
    };

    // --- Встроенные шрифты для выбора 📝 ---
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

    // --- Вспомогательные Функции 🛠️ ---
    function hexToRgb(hex) {
        if (!hex || typeof hex !== 'string') return null;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                reject(new Error(`Файл слишком большой! 😱 Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    function downloadFile(filename, content, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`[BR Style] 📄 Файл '${filename}' подготовлен к скачиванию.`);
    }

    // --- Управление Настройками 💾 ---
    async function loadSettings() {
        console.log('[BR Style] 💾 Загрузка настроек...');
        currentSettings = {};
        try {
            const settingKeys = Object.keys(defaultSettings);
            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, defaultSettings[key])));

            settingKeys.forEach((key, index) => {
                let savedValue = loadedValues[index];
                const defaultValue = defaultSettings[key];
                const defaultValueType = typeof defaultValue;

                if (defaultValueType === 'boolean') {
                    savedValue = (savedValue === true || savedValue === 'true');
                } else if (defaultValueType === 'number') {
                    const parsedValue = parseFloat(savedValue);
                    if (!isNaN(parsedValue)) {
                        savedValue = parsedValue;
                        if (key === 'opacityValue' || key === 'edgeOpacity' || key === 'bottomNavOpacity' || key === 'transparentElementsOpacity') {
                            savedValue = Math.max(0, Math.min(1, savedValue));
                        } else if (Number.isInteger(defaultValue)) {
                             savedValue = parseInt(savedValue, 10) || defaultValue;
                        }
                    } else {
                        savedValue = defaultValue;
                    }
                } else if (defaultValueType === 'string') {
                     savedValue = (typeof savedValue === 'string') ? savedValue : defaultValue;
                }
                currentSettings[key] = savedValue;
            });
            console.log('[BR Style] 👍 Настройки успешно загружены.');
        } catch (e) {
            console.error('[BR Style] ❌ Ошибка загрузки настроек!', e);
            currentSettings = { ...defaultSettings };
            alert('[BR Style] Ошибка загрузки настроек! 😥 Применены стандартные значения.');
        }
    }

    async function saveSettings(settingsToSave) {
        console.log('[BR Style] 💾 Сохранение настроек...');
        try {
            const savePromises = [];
            for (const key in settingsToSave) {
                if (defaultSettings.hasOwnProperty(key)) {
                    savePromises.push(GM_setValue(key, settingsToSave[key]));
                    currentSettings[key] = settingsToSave[key];
                } else {
                     console.warn(`[BR Style] ❓ Попытка сохранить неизвестный ключ: ${key}`);
                }
            }
            await Promise.all(savePromises);
            console.log('[BR Style] ✅ Настройки сохранены.');
            return true;
        } catch (e) {
            console.error('[BR Style] ❌ Ошибка сохранения настроек!', e);
            alert('[BR Style] Ошибка сохранения настроек! 😥');
            return false;
        }
    }

    // --- Применение Динамических CSS Стилей ✨ ---
    function applyForumStyles(settings) {
        console.log('[BR Style] ✨ Применение динамических стилей (Глобальное Обновление)...');

        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = STYLE_ID;
            styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
        }

        try {
            // --- Вычисления ---
            const cachedRgb = {};
            const getRgb = (hex) => {
                if (!cachedRgb[hex]) cachedRgb[hex] = hexToRgb(hex);
                return cachedRgb[hex];
            };

            const mainBgRgb = getRgb(settings.bgColor);
            const mainElementBgColor = mainBgRgb ? `rgba(${mainBgRgb.r}, ${mainBgRgb.g}, ${mainBgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;
            const edgeRgb = getRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const finalEdgeBoxShadow = settings.enableEdge ? `0 0 0 ${settings.edgeWidth} ${edgeColorWithOpacity}` : 'none';
            const finalBorderRadius = settings.enableRounding ? settings.borderRadius : '0px';
            const fallbackBgColor = settings.bgColor || '#1e1e1e';
            const bottomNavBaseBgRgb = getRgb('#222222');
            const bottomNavFinalBgColor = bottomNavBaseBgRgb ? `rgba(${bottomNavBaseBgRgb.r}, ${bottomNavBaseBgRgb.g}, ${bottomNavBaseBgRgb.b}, ${settings.bottomNavOpacity})` : '#222222';

            // --- Селекторы ---
            const mainElementsSelector = `.block-container, .block-filterBar, .message-inner, .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content, .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content, .p-header, .p-nav, .p-navSticky.is-sticky .p-nav, .p-footer`;
            const transparentElementsSelector = `.p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button a.button.button--link, .input, .block-minorTabHeader, .blockMessage, .input:focus, .input.is-focused, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link`;
            const pageWrapperSelector = '.p-pageWrapper';
            const fontTargetSelector = `body, .p-body, .block-body, .message-content, .structItem-title, .node-title, .p-title-value, input, textarea, select, button`;
            const avatarSelector = '.message-avatar img';
            const messageRowSelector = '.block--messages .block-row:nth-child(even)';
            // --- Селектор для освещения текста ---
            const textGlowTargetSelector = `
                a:not(.button):not(.tabs-tab), /* Ссылки (кроме кнопок и табов) */
                .p-title-value,             /* Заголовок страницы */
                .structItem-title a,         /* Заголовки тем/форумов */
                .node-title a,               /* Заголовки разделов */
                .username,                   /* Ники пользователей */
                .message-name,               /* Имя автора сообщения */
                .block-header,               /* Заголовки блоков */
                .pairs dt                    /* Метки в профиле и др. */
            `;
                // Закомментировано, т.к. может быть слишком много: .message-content, .block-body

            // --- Стиль фона ---
            let backgroundStyle = '';
            if (settings.enableAnimatedGradient && settings.enableGradient) {
                backgroundStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1}); background-size: 400% 400%; animation: animatedGradient ${settings.animatedGradientSpeed} ease infinite;`;
            } else if (settings.enableGradient) {
                backgroundStyle = `background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important; background-size: cover !important; background-attachment: fixed !important; background-position: center center !important; background-repeat: no-repeat !important;`;
            } else if (settings.bgImageDataUri) {
                backgroundStyle = `background-image: url('${settings.bgImageDataUri}') !important; background-size: cover !important; background-attachment: fixed !important; background-position: center center !important; background-repeat: no-repeat !important;`;
            } else {
                backgroundStyle = `background-color: ${fallbackBgColor} !important;`;
            }
            const animatedGradientKeyframes = settings.enableAnimatedGradient && settings.enableGradient ? `@keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }` : '';

            // --- Генерация CSS ---
            const forumCss = `
                /* --- Базовые настройки --- */
                ${fontTargetSelector} { ${settings.fontFamily ? `font-family: ${settings.fontFamily} !important;` : ''} }
                body { ${backgroundStyle} }
                ${animatedGradientKeyframes}

                /* --- Стили элементов --- */
                ${pageWrapperSelector} { background-color: ${mainElementBgColor} !important; border-radius: ${finalBorderRadius} !important; box-shadow: ${finalEdgeBoxShadow} !important; ${settings.enableRounding ? 'overflow: hidden;' : ''} }
                ${mainElementsSelector} { background-color: ${mainElementBgColor} !important; border-radius: ${finalBorderRadius} !important; box-shadow: ${finalEdgeBoxShadow} !important; ${settings.enableRounding ? 'overflow: hidden;' : ''} }
                ${transparentElementsSelector} { background: none !important; border: none !important; box-shadow: none !important; opacity: ${settings.transparentElementsOpacity} !important; }

                 /* --- Освещение Текста ✨ --- */
                 ${settings.enableTextGlow ? `
                    ${textGlowTargetSelector} {
                        text-shadow: 0 0 ${settings.textGlowIntensity} ${settings.textGlowColor};
                    }
                    /* Дополнительно можно подсветить иконки, если они используют шрифт */
                    .fa, .fab, .fas, .far {
                         text-shadow: 0 0 ${settings.textGlowIntensity} ${settings.textGlowColor};
                    }
                 ` : ''}
                 /* --- Конец Освещения Текста --- */

                 /* --- Нижняя панель --- */
                 #${BOTTOM_NAV_ID} { ${settings.enableBottomNav ? 'display: flex !important;' : 'display: none !important;'} background-color: ${bottomNavFinalBgColor} !important; border-radius: ${settings.bottomNavBorderRadius} !important; }

                 /* --- Дополнительные стили --- */
                 ${settings.enableAlternatingMessageBackground ? `${messageRowSelector} { background-color: ${settings.alternatingMessageBackgroundColor} !important; opacity: 1 !important; }` : ''}
                 ${settings.enableRoundedAvatars ? `${avatarSelector} { border-radius: ${settings.avatarBorderRadius} !important; overflow: hidden; }` : ''}
            `;

            styleElement.textContent = forumCss;

        } catch (e) {
            console.error('[BR Style] ❌ Ошибка применения динамических стилей!', e);
            if (styleElement) styleElement.textContent = '/* Ошибка применения динамических стилей 😥 */';
        }
    }

    // --- UI Панель Настроек 🎨 ---
    function createPanelHTML() {
        console.log('[BR Style] 🎨 Создание HTML панели настроек (v5.0)...');
        if (document.getElementById(PANEL_ID)) {
             console.warn("[BR Style] 🤔 Панель уже существует, повторное создание отменено.");
             return document.getElementById(PANEL_ID);
        }

        try {
            const panelDiv = document.createElement('div');
            panelDiv.id = PANEL_ID;

            const fontOptionsHtml = availableFonts.map(font => `<option value="${font.value}">${font.name}</option>`).join('');
            const presetButtonsHtml = Object.keys(presets).map(key => `<button data-preset="${key}" title="Применить пресет '${key}'">${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</button>`).join('');

            panelDiv.innerHTML = `
                <h3>🎨 Настройки Стиля Форума v5.0</h3>

                <div class="setting-group preset-buttons-container"> <label>Пресеты:</label> <div class="preset-buttons">${presetButtonsHtml}</div> <small id="preset-status" class="panel-status-text">&nbsp;</small> </div> <hr>

                 <div class="setting-group"> <input type="checkbox" id="s_enableGradient_simple" name="enableGradient" data-setting-key="enableGradient"> <label for="s_enableGradient_simple" class="inline-label">🌈 Использовать градиентный фон</label> <div class="sub-settings" id="gradient-sub-settings"> <div> <label for="s_gradientColor1_simple">Цвет 1:</label> <input type="color" id="s_gradientColor1_simple" name="gradientColor1" data-setting-key="gradientColor1"> </div> <div style="margin-top: 8px;"> <label for="s_gradientColor2_simple">Цвет 2:</label> <input type="color" id="s_gradientColor2_simple" name="gradientColor2" data-setting-key="gradientColor2"> </div> <div style="margin-top: 8px;"> <label for="s_gradientColor3_simple">Цвет 3:</label> <input type="color" id="s_gradientColor3_simple" name="gradientColor3" data-setting-key="gradientColor3"> </div> <div style="margin-top: 8px;"> <label for="s_gradientColor4_simple">Цвет 4:</label> <input type="color" id="s_gradientColor4_simple" name="gradientColor4" data-setting-key="gradientColor4"> </div> <div style="margin-top: 8px;"> <label for="s_gradientDirection_simple">Направление:</label> <input type="text" id="s_gradientDirection_simple" name="gradientDirection" data-setting-key="gradientDirection" placeholder="Напр: 135deg, to right"> <small class="panel-status-text">CSS формат (градусы, ключевые слова)</small> </div> <div style="margin-top: 12px;"> <input type="checkbox" id="s_enableAnimatedGradient_simple" name="enableAnimatedGradient" data-setting-key="enableAnimatedGradient"> <label for="s_enableAnimatedGradient_simple" class="inline-label">💫 Анимированный градиент</label> <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top: 5px;"> <label for="s_animatedGradientSpeed_simple">Скорость анимации:</label> <input type="text" id="s_animatedGradientSpeed_simple" name="animatedGradientSpeed" data-setting-key="animatedGradientSpeed" placeholder="Напр: 5s, 10s"> <small class="panel-status-text">CSS формат времени (напр., 5s)</small> </div> </div> </div> </div> <hr>

                 <div class="setting-group" id="bg-image-setting-group"> <label for="s_bgImageFile_simple">🖼️ Фон Страницы (изображение):</label> <div style="display: flex; align-items: center; gap: 5px;"> <input type="file" id="s_bgImageFile_simple" name="bgImageFile" accept="image/*" style="flex-grow: 1; font-size: 11px;"> <button id="clear-bg-btn" title="Удалить текущий фон" class="panel-small-btn panel-btn-danger">❌</button> </div> <small id="bg-status" class="panel-status-text">Фон не задан.</small> </div> <hr>

                 <div class="setting-group"> <label for="s_bgColor_simple">🎨 Цвет Фона Блоков:</label> <input type="color" id="s_bgColor_simple" name="bgColor" data-setting-key="bgColor"> </div>
                <div class="setting-group"> <label for="s_opacityValue_simple">💧 Прозрачность Блоков:</label> <input type="number" id="s_opacityValue_simple" name="opacityValue" min="0" max="1" step="0.05" data-setting-key="opacityValue"> </div>
                <div class="setting-group"> <input type="checkbox" id="s_enableRounding_simple" name="enableRounding" data-setting-key="enableRounding"> <label for="s_enableRounding_simple" class="inline-label">📐 Скругление блоков</label> <div class="sub-settings" id="rounding-sub-settings"> <label for="s_borderRadius_simple">Радиус:</label> <input type="text" id="s_borderRadius_simple" name="borderRadius" data-setting-key="borderRadius" placeholder="8px, 10px..."> </div> </div>
                <div class="setting-group"> <input type="checkbox" id="s_enableEdge_simple" name="enableEdge" data-setting-key="enableEdge"> <label for="s_enableEdge_simple" class="inline-label">✨ Окантовка блоков</label> <div class="sub-settings" id="edge-sub-settings"> <div><label for="s_edgeColor_simple">Цвет:</label> <input type="color" id="s_edgeColor_simple" name="edgeColor" data-setting-key="edgeColor"></div> <div style="margin-top: 8px;"><label for="s_edgeWidth_simple">Толщина:</label> <input type="text" id="s_edgeWidth_simple" name="edgeWidth" data-setting-key="edgeWidth" placeholder="1px, 2px..."></div> <div style="margin-top: 8px;"><label for="s_edgeOpacity_simple">Прозрачность:</label> <input type="number" id="s_edgeOpacity_simple" name="edgeOpacity" min="0" max="1" step="0.05" data-setting-key="edgeOpacity"></div> </div> </div> <hr>

                 <div class="setting-group"> <label for="s_fontFamily_simple">📝 Шрифт Форума:</label> <select id="s_fontFamily_simple" name="fontFamily" data-setting-key="fontFamily" style="width: 100%; padding: 5px; background: #444; border: 1px solid #666; color: #eee; border-radius: 3px; box-sizing: border-box;"> ${fontOptionsHtml} </select> </div> <hr>

                 <div class="setting-group">
                     <input type="checkbox" id="s_enableTextGlow_simple" name="enableTextGlow" data-setting-key="enableTextGlow">
                     <label for="s_enableTextGlow_simple" class="inline-label">💡 Освещение текста</label>
                     <div class="sub-settings" id="text-glow-sub-settings">
                         <div><label for="s_textGlowColor_simple">Цвет свечения:</label> <input type="color" id="s_textGlowColor_simple" name="textGlowColor" data-setting-key="textGlowColor"></div>
                         <div style="margin-top: 8px;"><label for="s_textGlowIntensity_simple">Интенсивность:</label> <input type="text" id="s_textGlowIntensity_simple" name="textGlowIntensity" data-setting-key="textGlowIntensity" placeholder="Напр: 5px, 0.2em"></div>
                         <small class="panel-status-text">Применяется к ссылкам, никам, заголовкам и др.</small>
                     </div>
                 </div>
                 <hr>
                 <h4>-- Дополнительные Стили 💅 --</h4>
                 <div class="setting-group"> <input type="checkbox" id="s_enableAlternatingMessageBackground_simple" name="enableAlternatingMessageBackground" data-setting-key="enableAlternatingMessageBackground"> <label for="s_enableAlternatingMessageBackground_simple" class="inline-label">📊 Чередующийся фон сообщений</label> <div class="sub-settings" id="alternating-bg-sub-settings"> <label for="s_alternatingMessageBackgroundColor_simple">Цвет фона (четных):</label> <input type="color" id="s_alternatingMessageBackgroundColor_simple" name="alternatingMessageBackgroundColor" data-setting-key="alternatingMessageBackgroundColor"> </div> </div>
                 <div class="setting-group"> <input type="checkbox" id="s_enableRoundedAvatars_simple" name="enableRoundedAvatars" data-setting-key="enableRoundedAvatars"> <label for="s_enableRoundedAvatars_simple" class="inline-label">😊 Скругленные аватары</label> <div class="sub-settings" id="rounded-avatars-sub-settings"> <label for="s_avatarBorderRadius_simple">Радиус скругления:</label> <input type="text" id="s_avatarBorderRadius_simple" name="avatarBorderRadius" data-setting-key="avatarBorderRadius" placeholder="Напр: 5px, 50%"> </div> </div> <hr>
                 <div class="setting-group"> <label for="s_transparentElementsOpacity_simple">👻 Прозрачность Элементов Фона:</label> <input type="number" id="s_transparentElementsOpacity_simple" name="transparentElementsOpacity" min="0" max="1" step="0.05" data-setting-key="transparentElementsOpacity"> <small class="panel-status-text">Влияет на прозрачность фона сообщений, блоков и т.д.</small> </div> <hr>

                 <h4>-- Нижняя Панель Навигации 🧭 --</h4>
                <div class="setting-group"> <input type="checkbox" id="s_enableBottomNav_simple" name="enableBottomNav" data-setting-key="enableBottomNav"> <label for="s_enableBottomNav_simple" class="inline-label">Включить нижнюю панель</label> </div>
                <div class="setting-group"> <label for="s_bottomNavOpacity_simple">Прозрачность Панели:</label> <input type="number" id="s_bottomNavOpacity_simple" name="bottomNavOpacity" min="0" max="1" step="0.05" data-setting-key="bottomNavOpacity"> </div>
                <div class="setting-group"> <label for="s_bottomNavBorderRadius_simple">Скругление Панели:</label> <input type="text" id="s_bottomNavBorderRadius_simple" name="bottomNavBorderRadius" data-setting-key="bottomNavBorderRadius" placeholder="10px, 25px..."> </div>
                <div class="link-settings-group"> <label>Ссылка 1:</label> <input type="text" name="link1Name" placeholder="Название 1" data-setting-key="link1Name"> <input type="text" name="link1Url" placeholder="URL 1 (https://...)" data-setting-key="link1Url"> </div>
                <div class="link-settings-group"> <label>Ссылка 2:</label> <input type="text" name="link2Name" placeholder="Название 2" data-setting-key="link2Name"> <input type="text" name="link2Url" placeholder="URL 2 (https://...)" data-setting-key="link2Url"> </div>
                <div class="link-settings-group"> <label>Ссылка 3:</label> <input type="text" name="link3Name" placeholder="Название 3" data-setting-key="link3Name"> <input type="text" name="link3Url" placeholder="URL 3 (https://...)" data-setting-key="link3Url"> </div> <hr>

                <p class="author-credit">Автор: Муж Vika Ageeva - Maras Ageev ❤️</p>
                <div class="button-group"> <button id="export-btn" class="panel-btn panel-btn-export" title="Сохранить настройки в файл">📤 Экспорт</button> <button id="import-btn" class="panel-btn panel-btn-import" title="Загрузить настройки из файла">📥 Импорт</button> <input type="file" id="import-settings-file" accept=".json" style="display: none;"> <span style="flex-grow: 1;"></span> <button id="save-btn-simple" class="panel-btn panel-btn-save">💾 Сохранить</button> <button id="close-btn-simple" class="panel-btn panel-btn-close">❌ Закрыть</button> </div>
                <small id="import-status" class="panel-status-text">&nbsp;</small>
            `;

            document.body.appendChild(panelDiv);
            settingsPanel = panelDiv;

            // --- Получение ссылок на элементы управления ---
            const saveBtn = settingsPanel.querySelector('#save-btn-simple');
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile_simple');
            const clearBgBtn = settingsPanel.querySelector('#clear-bg-btn');
            const bgStatus = settingsPanel.querySelector('#bg-status');
            const presetButtons = settingsPanel.querySelectorAll('.preset-buttons button');
            const presetStatus = settingsPanel.querySelector('#preset-status');
            const exportBtn = settingsPanel.querySelector('#export-btn');
            const importBtn = settingsPanel.querySelector('#import-btn');
            const importFileInput = settingsPanel.querySelector('#import-settings-file');
            const importStatus = settingsPanel.querySelector('#import-status');

            // --- Получение элементов для условного отображения ---
            const enableGradientCheckbox = settingsPanel.querySelector('#s_enableGradient_simple');
            const gradientSubSettings = settingsPanel.querySelector('#gradient-sub-settings');
            const enableAnimatedGradientCheckbox = settingsPanel.querySelector('#s_enableAnimatedGradient_simple');
            const animatedGradientSubSettings = settingsPanel.querySelector('#animated-gradient-sub-settings');
            const bgImageSettingGroup = settingsPanel.querySelector('#bg-image-setting-group');
            const enableRoundingCheckbox = settingsPanel.querySelector('#s_enableRounding_simple');
            const roundingSubSettings = settingsPanel.querySelector('#rounding-sub-settings');
            const enableEdgeCheckbox = settingsPanel.querySelector('#s_enableEdge_simple');
            const edgeSubSettings = settingsPanel.querySelector('#edge-sub-settings');
            const enableAlternatingMessageBackgroundCheckbox = settingsPanel.querySelector('#s_enableAlternatingMessageBackground_simple');
            const alternatingMessageBackgroundSubSettings = settingsPanel.querySelector('#alternating-bg-sub-settings');
            const enableRoundedAvatarsCheckbox = settingsPanel.querySelector('#s_enableRoundedAvatars_simple');
            const roundedAvatarsSubSettings = settingsPanel.querySelector('#rounded-avatars-sub-settings');
            // Новые элементы для освещения текста
            const enableTextGlowCheckbox = settingsPanel.querySelector('#s_enableTextGlow_simple');
            const textGlowSubSettings = settingsPanel.querySelector('#text-glow-sub-settings');

            // --- Функция для переключения видимости под-настроек ---
            const toggleSubSettings = (checkbox, subSettingsDiv) => {
                if (checkbox && subSettingsDiv) {
                    subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';
                }
            };

            // --- Инициализация состояния видимости под-настроек при открытии ---
            const initializeSubSettingsVisibility = () => {
                toggleSubSettings(enableGradientCheckbox, gradientSubSettings);
                toggleSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);
                toggleSubSettings(enableRoundingCheckbox, roundingSubSettings);
                toggleSubSettings(enableEdgeCheckbox, edgeSubSettings);
                toggleSubSettings(enableAlternatingMessageBackgroundCheckbox, alternatingMessageBackgroundSubSettings);
                toggleSubSettings(enableRoundedAvatarsCheckbox, roundedAvatarsSubSettings);
                // Инициализация видимости для освещения текста
                toggleSubSettings(enableTextGlowCheckbox, textGlowSubSettings);

                if (bgImageSettingGroup) {
                   bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block';
                }
                 if (animatedGradientSubSettings) {
                    animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none';
                 }
            };

            // --- Установка обработчиков событий для чекбоксов ---
             enableGradientCheckbox.addEventListener('change', () => {
                toggleSubSettings(enableGradientCheckbox, gradientSubSettings);
                if (bgImageSettingGroup) { bgImageSettingGroup.style.display = enableGradientCheckbox.checked ? 'none' : 'block'; }
                if (animatedGradientSubSettings) { animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none'; }
             });
            enableAnimatedGradientCheckbox.addEventListener('change', () => {
                 if (animatedGradientSubSettings) { animatedGradientSubSettings.style.display = (enableGradientCheckbox.checked && enableAnimatedGradientCheckbox.checked) ? 'block' : 'none'; }
            });
            enableRoundingCheckbox.addEventListener('change', () => toggleSubSettings(enableRoundingCheckbox, roundingSubSettings));
            enableEdgeCheckbox.addEventListener('change', () => toggleSubSettings(enableEdgeCheckbox, edgeSubSettings));
            enableAlternatingMessageBackgroundCheckbox.addEventListener('change', () => toggleSubSettings(enableAlternatingMessageBackgroundCheckbox, alternatingMessageBackgroundSubSettings));
            enableRoundedAvatarsCheckbox.addEventListener('change', () => toggleSubSettings(enableRoundedAvatarsCheckbox, roundedAvatarsSubSettings));
            // Обработчик для освещения текста
            enableTextGlowCheckbox.addEventListener('change', () => toggleSubSettings(enableTextGlowCheckbox, textGlowSubSettings));

            // --- Обработчик кнопки Сохранить ---
            saveBtn.addEventListener('click', async () => {
                console.log('[BR Style] Нажата кнопка Сохранить 👍');
                const originalBtnText = saveBtn.textContent;
                saveBtn.textContent = 'Сохранение...⏳';
                saveBtn.disabled = true;
                let errorOccurred = false;
                const settingsToUpdate = {};

                 settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (defaultSettings.hasOwnProperty(key)) { // Проверяем по новым defaultSettings
                        if (input.type === 'checkbox') {
                            settingsToUpdate[key] = input.checked;
                        } else if (input.type === 'number') {
                            let parsedValue = parseFloat(input.value);
                            let valueToSave = isNaN(parsedValue) ? defaultSettings[key] : parsedValue;
                            if (key === 'opacityValue' || key === 'edgeOpacity' || key === 'bottomNavOpacity' || key === 'transparentElementsOpacity') {
                                valueToSave = Math.max(0, Math.min(1, valueToSave));
                            }
                            settingsToUpdate[key] = valueToSave;
                        } else {
                            settingsToUpdate[key] = input.value;
                        }
                    }
                });

                if (!settingsToUpdate.enableGradient) {
                    if (bgFileInput.files && bgFileInput.files.length > 0) {
                        const file = bgFileInput.files[0];
                        try {
                            console.log(`[BR Style] ⏳ Чтение файла фона: ${file.name}`);
                            settingsToUpdate.bgImageDataUri = await readFileAsDataURL(file);
                            console.log(`[BR Style] ✅ Файл фона прочитан.`);
                        } catch (error) {
                            console.error('[BR Style] ❌ Ошибка чтения файла фона:', error);
                            alert(`Ошибка чтения файла: ${error.message}`);
                            errorOccurred = true;
                        }
                    } else {
                         settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';
                    }
                } else {
                     settingsToUpdate.bgImageDataUri = '';
                }

                if (!errorOccurred) {
                    const success = await saveSettings(settingsToUpdate);
                    if (success) {
                        applyForumStyles(currentSettings);
                        updateBottomNavBarContent(currentSettings);
                        saveBtn.textContent = 'Сохранено! ✅';
                        saveBtn.style.backgroundColor = '#28a745';

                        if (bgStatus) {
                            if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; }
                            else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
                        }
                        if (bgFileInput.files.length > 0) bgFileInput.value = '';
                        importStatus.innerHTML = '&nbsp;';
                        presetStatus.innerHTML = '&nbsp;';

                        setTimeout(() => { saveBtn.textContent = originalBtnText; saveBtn.style.backgroundColor = ''; saveBtn.disabled = false; }, 1500);
                    } else {
                        saveBtn.textContent = 'Ошибка! ❌'; saveBtn.style.backgroundColor = '#dc3545';
                        setTimeout(() => { saveBtn.textContent = originalBtnText; saveBtn.style.backgroundColor = ''; saveBtn.disabled = false; }, 2000);
                    }
                } else {
                    saveBtn.textContent = originalBtnText; saveBtn.disabled = false;
                }
            });

            // --- Обработчик кнопки Очистить фон ---
            clearBgBtn.addEventListener('click', async () => {
                console.log('[BR Style] Нажата кнопка Удалить фон 🗑️.');
                bgFileInput.value = '';
                const success = await saveSettings({ bgImageDataUri: '' });
                if (success) {
                    applyForumStyles(currentSettings);
                    if(bgStatus) bgStatus.textContent = 'Фон не задан.';
                    console.log('[BR Style] ✅ Фон удален и настройка сохранена.');
                    clearBgBtn.textContent = '✔️';
                    setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);
                } else {
                     alert('[BR Style] 😥 Не удалось удалить фон. Ошибка сохранения.');
                }
            });

            // --- Обработчик кнопки Закрыть ---
            settingsPanel.querySelector('#close-btn-simple').addEventListener('click', closePanel);

            // --- Обработчики кнопок Пресетов ---
            presetButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const presetName = button.dataset.preset;
                    const selectedPreset = presets[presetName];
                    if (!selectedPreset) return;
                    console.log(`[BR Style] 🎨 Применение пресета "${presetName}" к полям...`);

                    settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                        const key = input.dataset.settingKey;
                        // Применяем только существующие в пресете ключи
                        if (selectedPreset.hasOwnProperty(key)) {
                             if (input.type === 'checkbox') { input.checked = selectedPreset[key]; }
                             else { input.value = selectedPreset[key] ?? ''; }
                        } else if (defaultSettings.hasOwnProperty(key) && input.type !== 'file') {
                             // Если ключа нет в пресете, но он есть в дефолтных - сбрасываем к дефолту
                             if (input.type === 'checkbox') { input.checked = defaultSettings[key]; }
                             else { input.value = defaultSettings[key] ?? ''; }
                        }
                    });

                    bgFileInput.value = '';
                    if (bgStatus) {
                         if (selectedPreset.enableGradient) { bgStatus.textContent = selectedPreset.enableAnimatedGradient ? 'Фон: (из пресета 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (из пресета 🌈 градиент, нажмите Сохранить)'; }
                         else { bgStatus.textContent = selectedPreset.bgImageDataUri ? 'Фон: (из пресета 🖼️ изображение, нажмите Сохранить)' : 'Фон: (очищен пресетом, нажмите Сохранить)'; }
                    }
                    if (presetStatus) {
                        presetStatus.textContent = `Пресет "${button.textContent}" загружен. Нажмите '💾 Сохранить'.`;
                        setTimeout(() => { if (presetStatus) presetStatus.innerHTML = '&nbsp;'; }, 4000);
                    }
                     importStatus.innerHTML = '&nbsp;';
                     initializeSubSettingsVisibility(); // Обновляем видимость
                });
            });

            // --- Обработчик Экспорта ---
            exportBtn.addEventListener('click', () => {
                console.log('[BR Style] 📤 Экспорт настроек...');
                try {
                    const settingsToExport = { ...currentSettings };
                    delete settingsToExport.bgImageFile; // Не экспортируем сам файл
                    const settingsJson = JSON.stringify(settingsToExport, null, 2);
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                    downloadFile(`br-style-settings-${timestamp}.json`, settingsJson, 'application/json');
                } catch (e) {
                    console.error('[BR Style] ❌ Ошибка экспорта настроек:', e);
                    alert('[BR Style] 😥 Ошибка при экспорте настроек.');
                }
            });

            // --- Обработчики Импорта ---
            importBtn.addEventListener('click', () => { importFileInput.click(); });
            importFileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                console.log('[BR Style] 📥 Импорт настроек из файла:', file.name);
                importStatus.textContent = 'Чтение файла...⏳';
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedSettings = JSON.parse(e.target.result);
                        if (typeof importedSettings !== 'object' || importedSettings === null) { throw new Error("Файл не содержит корректный JSON объект."); }
                        console.log('[BR Style] 🤔 Настройки из файла:', importedSettings);
                        let appliedCount = 0;

                        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                            const key = input.dataset.settingKey;
                             if (importedSettings.hasOwnProperty(key)) { // Применяем только то, что есть в файле
                                 if (input.type === 'checkbox') { input.checked = importedSettings[key]; }
                                 else { input.value = importedSettings[key] ?? ''; }
                                 appliedCount++;
                             } else if (defaultSettings.hasOwnProperty(key) && input.type !== 'file') {
                                 // Если ключа нет в импорте, но он валидный - сбрасываем к дефолту? Или оставляем как есть? Оставим как есть.
                             }
                        });

                         if (bgStatus) {
                              const importedBgData = importedSettings.bgImageDataUri;
                              const importedGradient = importedSettings.enableGradient;
                              const importedAnimGradient = importedSettings.enableAnimatedGradient;
                              if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; }
                              else { bgStatus.textContent = importedBgData ? 'Фон: (импортирован 🖼️ изображение, нажмите Сохранить)' : 'Фон: (очищен импортом, нажмите Сохранить)'; }
                         }
                         bgFileInput.value = '';

                        if (appliedCount > 0) {
                             importStatus.textContent = `✅ Импортировано ${appliedCount} настроек. Нажмите '💾 Сохранить'.`;
                             presetStatus.innerHTML = '&nbsp;';
                             initializeSubSettingsVisibility(); // Обновляем видимость
                        } else { throw new Error("В файле не найдено совместимых настроек."); }
                    } catch (error) {
                        console.error('[BR Style] ❌ Ошибка импорта настроек:', error);
                        importStatus.textContent = `❌ Ошибка импорта: ${error.message}`;
                        alert(`[BR Style] 😥 Ошибка импорта настроек: ${error.message}`);
                    } finally { event.target.value = null; }
                };
                reader.onerror = (e) => {
                    console.error('[BR Style] ❌ Ошибка чтения файла для импорта:', e);
                    importStatus.textContent = '❌ Ошибка чтения файла.';
                    alert('[BR Style] 😥 Не удалось прочитать файл.');
                    event.target.value = null;
                };
                reader.readAsText(file);
            });

             initializeSubSettingsVisibility(); // Первичная установка видимости

            console.log('[BR Style] ✅ HTML панели настроек создан и обработчики добавлены.');
            return panelDiv;

        } catch (e) {
            console.error('[BR Style] ❌ КРИТИЧЕСКАЯ ОШИБКА создания HTML панели настроек!', e);
            return null;
        }
    }

    // --- Функции Управления Видимостью Панели 👀 ---
    function openPanel() {
        if (!settingsPanel) {
            console.warn("[BR Style] 🤔 Панель еще не создана. Попытка создать...");
            createPanelHTML();
             if (!settingsPanel) { console.error("[BR Style] ❌ Не удалось создать панель при попытке открытия!"); return; }
        }
        console.log('[BR Style] 👀 Открытие панели настроек...');
        try {
            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                const key = input.dataset.settingKey;
                 if (currentSettings.hasOwnProperty(key)) {
                     if (input.type === 'checkbox') { input.checked = currentSettings[key]; }
                     else { input.value = currentSettings[key] ?? ''; }
                 }
            });

             const bgStatus = settingsPanel.querySelector('#bg-status');
            if(bgStatus) {
                 if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; }
                 else { bgStatus.textContent = currentSettings.bgImageDataUri ? 'Фон: 🖼️ Изображение задано' : 'Фон не задан.'; }
            }
             const presetStatus = settingsPanel.querySelector('#preset-status'); if(presetStatus) presetStatus.innerHTML = '&nbsp;';
             const importStatus = settingsPanel.querySelector('#import-status'); if(importStatus) importStatus.innerHTML = '&nbsp;';
             const bgFileInput = settingsPanel.querySelector('#s_bgImageFile_simple'); if(bgFileInput) bgFileInput.value = '';

             // --- Вызываем функцию инициализации видимости ---
             const enableGradientCheckbox = settingsPanel.querySelector('#s_enableGradient_simple');
             const gradientSubSettings = settingsPanel.querySelector('#gradient-sub-settings');
             const enableAnimatedGradientCheckbox = settingsPanel.querySelector('#s_enableAnimatedGradient_simple');
             const animatedGradientSubSettings = settingsPanel.querySelector('#animated-gradient-sub-settings');
             const bgImageSettingGroup = settingsPanel.querySelector('#bg-image-setting-group');
             const enableRoundingCheckbox = settingsPanel.querySelector('#s_enableRounding_simple');
             const roundingSubSettings = settingsPanel.querySelector('#rounding-sub-settings');
             const enableEdgeCheckbox = settingsPanel.querySelector('#s_enableEdge_simple');
             const edgeSubSettings = settingsPanel.querySelector('#edge-sub-settings');
             const enableAlternatingMessageBackgroundCheckbox = settingsPanel.querySelector('#s_enableAlternatingMessageBackground_simple');
             const alternatingMessageBackgroundSubSettings = settingsPanel.querySelector('#alternating-bg-sub-settings');
             const enableRoundedAvatarsCheckbox = settingsPanel.querySelector('#s_enableRoundedAvatars_simple');
             const roundedAvatarsSubSettings = settingsPanel.querySelector('#rounded-avatars-sub-settings');
             // Новые элементы для освещения текста
             const enableTextGlowCheckbox = settingsPanel.querySelector('#s_enableTextGlow_simple');
             const textGlowSubSettings = settingsPanel.querySelector('#text-glow-sub-settings');
             const textGlowIntensityInput = settingsPanel.querySelector('#s_textGlowIntensity_simple');

             const toggleSubSettings = (checkbox, subSettingsDiv) => { // Локальная копия функции
                if (checkbox && subSettingsDiv) subSettingsDiv.style.display = checkbox.checked ? 'block' : 'none';
             };

             toggleSubSettings(enableGradientCheckbox, gradientSubSettings);
             toggleSubSettings(enableAnimatedGradientCheckbox, animatedGradientSubSettings);
             toggleSubSettings(enableRoundingCheckbox, roundingSubSettings);
             toggleSubSettings(enableEdgeCheckbox, edgeSubSettings);
             toggleSubSettings(enableAlternatingMessageBackgroundCheckbox, alternatingMessageBackgroundSubSettings);
             toggleSubSettings(enableRoundedAvatarsCheckbox, roundedAvatarsSubSettings);
             toggleSubSettings(enableTextGlowCheckbox, textGlowSubSettings); // Инициализация видимости для освещения текста

             if (bgImageSettingGroup) bgImageSettingGroup.style.display = enableGradientCheckbox?.checked ? 'none' : 'block';
             if (animatedGradientSubSettings) animatedGradientSubSettings.style.display = (enableGradientCheckbox?.checked && enableAnimatedGradientCheckbox?.checked) ? 'block' : 'none';
             if (textGlowSubSettings && enableTextGlowCheckbox && !enableTextGlowCheckbox.checked) {
                 textGlowSubSettings.style.display = 'none';
             }

            settingsPanel.style.display = 'block';
        } catch (e) {
             console.error('[BR Style] ❌ Ошибка при открытии панели настроек!', e);
             if (settingsPanel) settingsPanel.style.display = 'none';
        }
    }

    function closePanel() { if (settingsPanel) { settingsPanel.style.display = 'none'; console.log('[BR Style] 🙈 Панель настроек закрыта.'); } }
    function togglePanel() { if (!settingsPanel || settingsPanel.style.display === 'none' || !settingsPanel.style.display) { openPanel(); } else { closePanel(); } }

    // --- Создание/Обновление Нижней Панели Навигации 🧭 ---
    function createBottomNavBarElement() {
        console.log('[BR BottomNav] ⚓ Создание элемента нижней панели...');
        if (document.getElementById(BOTTOM_NAV_ID)) { bottomNavElement = document.getElementById(BOTTOM_NAV_ID); console.warn('[BR BottomNav] 🤔 Нижняя панель уже существует.'); return; }
        try {
            bottomNavElement = document.createElement('nav');
            bottomNavElement.id = BOTTOM_NAV_ID;
            bottomNavElement.className = 'br-bottom-nav-bar';
            document.body.appendChild(bottomNavElement);
            console.log('[BR BottomNav] ✅ Элемент нижней панели создан.');
        } catch (e) { console.error('[BR BottomNav] ❌ Ошибка создания элемента нижней панели!', e); }
    }

    function updateBottomNavBarContent(settings) {
        console.log('[BR BottomNav] ✍️ Обновление ссылок нижней панели...');
        if (!bottomNavElement) { console.error('[BR BottomNav] ❌ Элемент панели навигации не найден для обновления!'); createBottomNavBarElement(); if (!bottomNavElement) return; }
        try {
            let navHTML = '';
            if (settings.link1Name?.trim() && settings.link1Url?.trim()) { navHTML += `<a href="${settings.link1Url.trim()}" target="_blank" rel="noopener noreferrer">${settings.link1Name.trim()}</a>`; }
            if (settings.link2Name?.trim() && settings.link2Url?.trim()) { navHTML += `<a href="${settings.link2Url.trim()}" target="_blank" rel="noopener noreferrer">${settings.link2Name.trim()}</a>`; }
            if (settings.link3Name?.trim() && settings.link3Url?.trim()) { navHTML += `<a href="${settings.link3Url.trim()}" target="_blank" rel="noopener noreferrer">${settings.link3Name.trim()}</a>`; }
            bottomNavElement.innerHTML = navHTML;
            console.log('[BR BottomNav] ✅ Ссылки нижней панели обновлены.');
        } catch (e) { console.error('[BR BottomNav] ❌ Ошибка обновления ссылок нижней панели!', e); }
    }

    // --- Добавление иконки для переключения панели 🎨 ---
    function addSettingsIconHTML() {
        console.log('[BR Style] 🎨 Добавление иконки настроек...');
        if (document.getElementById(STYLE_ICON_ID)) { console.warn('[BR Style] 🤔 Иконка настроек уже существует.'); return; }
        try {
            settingsIcon = document.createElement('div');
            settingsIcon.id = STYLE_ICON_ID;
            settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨)';
            settingsIcon.innerHTML = '🎨';
            document.body.appendChild(settingsIcon);
            settingsIcon.addEventListener('click', togglePanel);
            console.log('[BR Style] ✅ Иконка настроек добавлена.');
        } catch (e) { console.error('[BR Style] ❌ Ошибка добавления иконки настроек!', e); }
    }

    // --- Внедрение Статичных CSS 🖌️ ---
    function injectStaticStyles() {
        console.log('[BR Style] 🖌️ Внедрение статичных CSS...');
        if (document.getElementById(STYLE_ID + '-static')) { console.warn('[BR Style] 🤔 Статичные стили уже были внедрены.'); return; }
        try {
            const staticCss = `
                /* --- Нижняя Панель Навигации --- */
                #${BOTTOM_NAV_ID} { box-shadow: 0 -2px 5px rgba(0,0,0,0.3); height: ${BOTTOM_NAV_HEIGHT}; width: auto; min-width: 150px; padding: 0 15px; position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 9998; display: flex; justify-content: center; align-items: center; box-sizing: border-box; }
                #${BOTTOM_NAV_ID} a { color: #e0e0e0; text-decoration: none; padding: 0 12px; margin: 0 3px; font-size: 14px; font-weight: bold; line-height: ${BOTTOM_NAV_HEIGHT}; transition: color 0.2s ease, text-shadow 0.2s ease; text-shadow: 0 0 4px rgba(255, 255, 255, 0.4); display: inline-block; white-space: nowrap; }
                #${BOTTOM_NAV_ID} a:hover { color: #FFEB3B; text-shadow: 0 0 7px rgba(255, 235, 59, 0.7); }

                /* --- Панель Настроек --- */
                 #${PANEL_ID} { position: fixed; z-index: 9999; bottom: 10px; left: 10px; width: 350px; background: #333; color: #eee; padding: 15px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.6); display: none; border: 1px solid #555; font-family: sans-serif; font-size: 13px; max-height: calc(100vh - 70px); overflow-y: auto; box-sizing: border-box; }
                 #${PANEL_ID} h3 { margin: 0 0 15px; text-align: center; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px; color: #fff;}
                 #${PANEL_ID} h4 { margin-top: 20px; margin-bottom: 10px; text-align: center; color: #bbb; border-top: 1px solid #555; padding-top: 15px; font-size: 14px; font-weight: bold;}
                 #${PANEL_ID} div.setting-group { margin-bottom: 12px; padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); }
                 #${PANEL_ID} label { display: block; margin-bottom: 4px; font-weight: bold; color: #ccc; }
                 #${PANEL_ID} label.inline-label { display: inline; font-weight: normal; vertical-align: middle; margin-left: 3px; }
                 #${PANEL_ID} input[type="text"], #${PANEL_ID} input[type="number"], #${PANEL_ID} input[type="file"], #${PANEL_ID} select { width: 100%; padding: 6px 8px; background: #444; border: 1px solid #666; color: #eee; border-radius: 3px; box-sizing: border-box; margin-top: 2px; }
                 #${PANEL_ID} input[type="color"] { padding: 0; border: 1px solid #666; height: 28px; width: 40px; vertical-align: middle; margin-left: 5px; border-radius: 3px; cursor: pointer; background-color: #555; }
                 #${PANEL_ID} input[type="checkbox"] { vertical-align: middle; margin-right: 2px; width: 16px; height: 16px; }
                 #${PANEL_ID} small.panel-status-text { color: #aaa; font-size: 11px; margin-top: 4px; display: block; min-height: 1em; }
                 #${PANEL_ID} .button-group { margin-top: 20px; padding-top: 10px; border-top: 1px solid #555; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
                 #${PANEL_ID} button.panel-btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.2s, transform 0.1s; font-size: 13px; }
                 #${PANEL_ID} button:disabled { opacity: 0.6; cursor: not-allowed; }
                 #${PANEL_ID} button:active:not(:disabled) { transform: scale(0.97); }
                 #${PANEL_ID} button.panel-btn-save { background-color: #4CAF50; color: white; order: 3; }
                 #${PANEL_ID} button.panel-btn-save:hover:not(:disabled) { background-color: #45a049; }
                 #${PANEL_ID} button.panel-btn-close { background-color: #aaa; color: #333; order: 4; }
                 #${PANEL_ID} button.panel-btn-close:hover { background-color: #999; }
                 #${PANEL_ID} button.panel-btn-export { background-color: #007bff; color: white; order: 1; margin-right: auto; }
                 #${PANEL_ID} button.panel-btn-export:hover { background-color: #0056b3; }
                 #${PANEL_ID} button.panel-btn-import { background-color: #ffc107; color: #333; order: 2; margin-right: auto; }
                 #${PANEL_ID} button.panel-btn-import:hover { background-color: #e0a800; }
                 #${PANEL_ID} button.panel-small-btn { padding: 3px 6px !important; font-size: 11px !important; line-height: 1; vertical-align: middle; }
                 #${PANEL_ID} button.panel-btn-danger { background-color: #f44336 !important; color: white !important; }
                 #${PANEL_ID} button.panel-btn-danger:hover { background-color: #da190b !important; }
                 #${PANEL_ID} hr { border: none; border-top: 1px solid #555; margin: 20px 0; }
                 #${PANEL_ID} .sub-settings { margin-left: 20px; padding-left: 10px; border-left: 2px solid #555; margin-top: 8px; display: none; padding-top: 5px; padding-bottom: 5px; background: rgba(0,0,0,0.1); border-radius: 0 4px 4px 0; }
                 #${PANEL_ID} .link-settings-group { margin-bottom: 10px; padding: 10px; border: 1px dashed #555; border-radius: 4px; background: rgba(0,0,0,0.1); }
                 #${PANEL_ID} .link-settings-group label { font-size: 12px; color: #bbb; margin-bottom: 6px; }
                 #${PANEL_ID} .link-settings-group input[type="text"] { margin-bottom: 6px; }
                 #${PANEL_ID} .author-credit { text-align: center; font-size: 10px; color: #888; margin-top: 15px; padding-top: 10px; border-top: 1px solid #555; }
                 #${PANEL_ID} .preset-buttons-container label { margin-bottom: 6px; }
                 #${PANEL_ID} .preset-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
                 #${PANEL_ID} .preset-buttons button { flex-grow: 1; padding: 5px 8px; font-size: 12px; background-color: #555; color: #eee; border: 1px solid #666; border-radius: 3px; cursor: pointer; transition: background-color 0.2s; text-align: center; }
                 #${PANEL_ID} .preset-buttons button:hover { background-color: #6a6a6a; }
                 #${PANEL_ID} #preset-status, #${PANEL_ID} #import-status { font-style: italic; margin-top: 8px; text-align: center; }

                 /* --- Иконка Настроек --- */
                 #${STYLE_ICON_ID} { position: fixed; z-index: 9998; bottom: 60px; left: 10px; width: 40px; height: 40px; background-color: rgba(51, 51, 51, 0.8); border-radius: 50%; cursor: pointer; border: 1px solid rgba(120, 120, 120, 0.7); box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: background-color 0.2s ease, transform 0.2s ease; display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; color: white; user-select: none; }
                 #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }
            `;
            const styleElement = document.createElement('style');
            styleElement.id = STYLE_ID + '-static';
            styleElement.type = 'text/css';
            styleElement.textContent = staticCss;
            (document.head || document.documentElement).appendChild(styleElement);

            console.log('[BR Style] ✅ Статичные CSS внедрены.');
        } catch (e) { console.error('[BR Style] ❌ Ошибка внедрения статичных CSS!', e); }
    }


    // --- Инициализация Скрипта ▶️ ---
    async function initialize() {
        console.log("[BR Style v5.0] ▶️ Начало инициализации...");
        try {
            injectStaticStyles();
            await loadSettings();
            applyForumStyles(currentSettings);

            requestAnimationFrame(() => {
                 try {
                     createBottomNavBarElement();
                     updateBottomNavBarContent(currentSettings);
                     createPanelHTML();
                     addSettingsIconHTML();
                 } catch (uiError) {
                     console.error('[BR Style] ❌ Ошибка при создании UI элементов в requestAnimationFrame:', uiError);
                 }
            });

            GM_registerMenuCommand('🎨 Открыть настройки стиля BR (v5.0)', togglePanel, 's');
            console.log('[BR Style v5.0] ✅ Инициализация завершена успешно!');

        } catch (e) {
            console.error('[BR Style] ❌ КРИТИЧЕСКАЯ ОШИБКА ИНИЦИАЛИЗАЦИИ!', e);
            alert('[BR Style] Критическая ошибка инициализации скрипта! 😭 Проверьте консоль (F12).');
        }
    }

    // --- Запуск ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
