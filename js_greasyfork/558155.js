// ==UserScript==
// @name         New Year's vibe for lolz.live
// @namespace    https://github.com/Cartier
// @version      2.22
// @description  New Year's snowy background with animation, sound effects, video background and interactive garland
// @author       Cartier
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @exclude      https://lolz.live/conversations/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558155/New%20Year%27s%20vibe%20for%20lolzlive.user.js
// @updateURL https://update.greasyfork.org/scripts/558155/New%20Year%27s%20vibe%20for%20lolzlive.meta.js
// ==/UserScript==

(function() {
    'use strict';

/**
 * ========================================
 * ⚙️ КОНФИГУРАЦИЯ - ВСЕ ВАЖНЫЕ ПАРАМЕТРЫ ⚙️
 * ========================================
 *
 * ИЗМЕНИТЕ ЭТИ ЗНАЧЕНИЯ ДЛЯ НАСТРОЙКИ СКРИПТА
 *
 * Примеры URL:
 * - GitHub: https://raw.githubusercontent.com/user/repo/main/sounds/wind.mp3
 * - Google Drive: https://drive.google.com/uc?export=download&id=FILE_ID
 * - Любой CDN: https://cdn.example.com/sounds/wind.mp3
 *
 * Важно: URL должны быть прямыми ссылками на файлы (не страницы загрузки)
 */

const SNOW_CONFIG = {
    // 🔗 URL для звуков и видео (вставьте свои ссылки)
    URL_WIND_SOUND: 'https://zvukipro.com/uploads/files/2020-10/1602935046_whistlingwindstead54.mp3',        // URL на wind.mp3 (звук вьюги)
    URL_CLICK_SOUND: 'https://zvukipro.com/uploads/files/2019-09/1568274526_c8fd8d10309e3e0.mp3',       // URL на click.mp3 (звук при клике)
    URL_HOVER_SOUND: 'https://zvukipro.com/uploads/files/2019-09/1568274549_10e1076dfd6c701.mp3',       // URL на hover.mp3 (звук при наведении)
    URL_VIDEO_BACKGROUND: 'https://img.pikbest.com/10/04/67/653pIkbEsTreD.mp4',  // URL на фон (видео: .mp4, .webm или изображение: .jpg, .png, .webp, .gif)

    // ❄️ Настройки снежинок
    SNOWFLAKE_COUNT: 50,       // Количество снежинок (0-100)
    SNOWFLAKE_MIN_SIZE: 10,   // Минимальный размер (px)
    SNOWFLAKE_MAX_SIZE: 18,   // Максимальный размер (px)
    SNOWFLAKE_MIN_SPEED: 3,   // Минимальная скорость падения (секунды)
    SNOWFLAKE_MAX_SPEED: 8,    // Максимальная скорость падения (секунды)
    SNOWFLAKE_WIND_STRENGTH: 50, // Сила ветра (px)

    // 🔊 Настройки звуков
    ENABLE_SOUNDS: true,       // Включить все звуки
    ENABLE_WIND_SOUND: true,   // Включить звук вьюги
    ENABLE_CLICK_SOUND: true,  // Включить звук при клике
    ENABLE_HOVER_SOUND: true,  // Включить звук при наведении
    WIND_VOLUME: 0.15,         // Громкость вьюги (0-1)
    CLICK_VOLUME: 0.2,         // Громкость клика (0-1)
    HOVER_VOLUME: 0.15,        // Громкость ховера (0-1)

    // 🎬 Настройки фона (видео или изображение)
    ENABLE_VIDEO_BACKGROUND: true, // Включить фон (видео/изображение)
    VIDEO_BACKGROUND_OPACITY: 0.3,  // Затемнение фона (0-1, где 0 - полностью прозрачно, 1 - непрозрачно)
    VIDEO_BACKGROUND_FIT_COVER: true, // Растяжение по всему экрану (true = cover, false = contain)

    // ✨ Другие эффекты
    ENABLE_SNOWFLAKES: true,   // Включить снежинки
    ENABLE_BACKGROUND_EFFECTS: true, // Включить фоновые эффекты
    ENABLE_CLICK_SNOWFLAKES: true, // Включить снежинки при клике мыши
    ENABLE_GARLAND: true,      // Включить гирлянду в верхней части
    SNOWFLAKES_ON_TOP: true,   // Снежинки поверх контента (true) или за контентом (false)
    ENABLE_TREE_CONSTRUCTOR: false, // Включить конструктор ёлочки
};

/**
 * ========================================
 * Конец конфигурации
 * ========================================
 */

/**
 * Новогодний снежный фон для lolz.live
 * Легковесная анимация снега с звуковыми эффектами
 * Все стили инжектируются через JavaScript - нужен только этот файл!
 */

class SnowTheme {
    constructor(options = {}) {
        const savedSettings = this.loadSettings();

        this.options = {
            windSoundUrl: savedSettings.windSoundUrl || SNOW_CONFIG.URL_WIND_SOUND,
            clickSoundUrl: savedSettings.clickSoundUrl || SNOW_CONFIG.URL_CLICK_SOUND,
            hoverSoundUrl: savedSettings.hoverSoundUrl || SNOW_CONFIG.URL_HOVER_SOUND,
            videoBackgroundUrl: savedSettings.videoBackgroundUrl || SNOW_CONFIG.URL_VIDEO_BACKGROUND,

            snowflakeCount: savedSettings.snowflakeCount ?? SNOW_CONFIG.SNOWFLAKE_COUNT,
            minSize: savedSettings.minSize ?? SNOW_CONFIG.SNOWFLAKE_MIN_SIZE,
            maxSize: savedSettings.maxSize ?? SNOW_CONFIG.SNOWFLAKE_MAX_SIZE,
            minSpeed: savedSettings.minSpeed ?? SNOW_CONFIG.SNOWFLAKE_MIN_SPEED,
            maxSpeed: savedSettings.maxSpeed ?? SNOW_CONFIG.SNOWFLAKE_MAX_SPEED,
            windStrength: savedSettings.windStrength ?? SNOW_CONFIG.SNOWFLAKE_WIND_STRENGTH,

            // Настройки звуков
            enableSound: savedSettings.enableSound ?? SNOW_CONFIG.ENABLE_SOUNDS,
            enableWindSound: savedSettings.enableWindSound ?? SNOW_CONFIG.ENABLE_WIND_SOUND,
            enableClickSound: savedSettings.enableClickSound ?? SNOW_CONFIG.ENABLE_CLICK_SOUND,
            enableHoverSound: savedSettings.enableHoverSound ?? SNOW_CONFIG.ENABLE_HOVER_SOUND,
            windVolume: savedSettings.windVolume ?? SNOW_CONFIG.WIND_VOLUME,
            clickVolume: savedSettings.clickVolume ?? SNOW_CONFIG.CLICK_VOLUME,
            hoverVolume: savedSettings.hoverVolume ?? SNOW_CONFIG.HOVER_VOLUME,

            // Другие настройки
            enableVideoBackground: savedSettings.enableVideoBackground ?? SNOW_CONFIG.ENABLE_VIDEO_BACKGROUND,
            videoBackgroundOpacity: savedSettings.videoBackgroundOpacity ?? SNOW_CONFIG.VIDEO_BACKGROUND_OPACITY,
            videoBackgroundFitCover: savedSettings.videoBackgroundFitCover ?? SNOW_CONFIG.VIDEO_BACKGROUND_FIT_COVER,
            enableSnowflakes: savedSettings.enableSnowflakes ?? SNOW_CONFIG.ENABLE_SNOWFLAKES,
            snowflakesOnTop: savedSettings.snowflakesOnTop ?? SNOW_CONFIG.SNOWFLAKES_ON_TOP,
            enableBackgroundEffects: savedSettings.enableBackgroundEffects ?? SNOW_CONFIG.ENABLE_BACKGROUND_EFFECTS,
            enableClickSnowflakes: savedSettings.enableClickSnowflakes ?? SNOW_CONFIG.ENABLE_CLICK_SNOWFLAKES,
            enableGarland: savedSettings.enableGarland ?? SNOW_CONFIG.ENABLE_GARLAND,
            enableTreeConstructor: savedSettings.enableTreeConstructor ?? SNOW_CONFIG.ENABLE_TREE_CONSTRUCTOR,

            // Переданные опции имеют наивысший приоритет
            ...options
        };

        this.soundEnabled = this.options.enableSound;
        this.windAudio = null;
        this.clickAudio = null;
        this.hoverAudio = null;
        this.windAudioSaveInterval = null;
        this.videoBackground = null;
        this.container = null;
        this.garland = null;
        this.soundToggle = null;
        this.settingsPanel = null;
        this.settingsButton = null;
        this.snowflakes = [];
        this.stylesInjected = false;
        this.garlandScrollHandler = null;
        this.garlandResizeHandler = null;
        this.backgroundScale = savedSettings.backgroundScale ?? 1.0; // Масштаб фона (1.0 = 100%)
        this.bulbClickCounts = {}; // Счетчики кликов по лампочкам
        this.brokenBulbs = new Set(); // Множество сломанных лампочек
        this.treeConstructor = null; // Конструктор ёлочки
        this.treeParts = { trunk: false, ornament: false, foliage: false }; // Части ёлки
        this.treeConstructorClickHandler = null; // Обработчик клика для закрытия панели

        this.init();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('snowThemeSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Не удалось загрузить настройки:', e);
        }
        return {};
    }

    saveSettings() {
        try {
            const settingsToSave = {
                ...this.options,
                backgroundScale: this.backgroundScale
            };
            localStorage.setItem('snowThemeSettings', JSON.stringify(settingsToSave));
        } catch (e) {
            console.log('Не удалось сохранить настройки:', e);
        }
    }

    init() {
        this.injectStyles();
        this.createVideoBackground();
        this.createContainer();
        if (this.options.enableSnowflakes) {
            this.createSnowflakes();
        }
        if (this.options.enableGarland) {
            this.createGarland();
        }
        this.initAudio();
        this.createZoomControls();
        this.createSettingsPanel();
        if (this.options.enableTreeConstructor) {
            this.createTreeConstructor();
            // Восстанавливаем ёлку если она была собрана
            this.restoreTreeIfNeeded();
        }
        this.attachEventListeners();
        this.addBodyClass();
    }

    injectStyles() {
        if (this.stylesInjected) return;

        const styles = `
            /* Контейнер для снежинок - поверх всего контента, но под модалками */
            .snow-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 100;
                overflow: hidden;
            }

            /* Снежинки за контентом */
            .snow-container.behind {
                z-index: -1;
            }

            /* Снежинки поверх контента */
            .snow-container.on-top {
                z-index: 100;
            }

            /* Убеждаемся, что снег не мешает интерактивным элементам */
            .snow-container * {
                pointer-events: none !important;
            }

            /* Снежинки - адаптированы для темного фона lolz.live */
            .snowflake {
                position: absolute;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1em;
                font-family: Arial, sans-serif;
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(200, 220, 255, 0.5);
                animation: snowfall linear infinite;
                user-select: none;
                will-change: transform, opacity;
            }

            /* Анимация падения снежинок */
            @keyframes snowfall {
                0% {
                    transform: translateY(-100vh) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) translateX(var(--drift)) rotate(360deg);
                    opacity: 0;
                }
            }

            /* Анимация разлета снежинок при клике */
            @keyframes clickSnowfall {
                0% {
                    transform: translate(0, 0) scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--click-drift-x), var(--click-drift-y)) scale(0.3) rotate(720deg);
                    opacity: 0;
                }
            }

            /* Снежинки при клике */
            .snowflake-click {
                position: fixed;
                color: rgba(255, 255, 255, 0.95);
                font-size: 1em;
                font-family: Arial, sans-serif;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(200, 220, 255, 0.6);
                animation: clickSnowfall linear forwards;
                user-select: none;
                pointer-events: none;
                z-index: 10001;
                will-change: transform, opacity;
            }

            /* Плавное движение фона */
            @keyframes backgroundDrift {
                0% {
                    background-position: 0% 0%;
                }
                100% {
                    background-position: 100% 100%;
                }
            }

            /* Тонкие эффекты фона - не конфликтуют с существующим дизайном */
            body.snow-theme-active {
                position: relative;
            }

            /* Добавляем легкий эффект на underHeaderContainer если он есть */
            .underHeaderContainer.snow-theme-active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image:
                    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
                background-size: 200% 200%;
                animation: backgroundDrift 30s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
            }

            /* Кнопка отключения звука - адаптирована под дизайн lolz.live */
            .snow-sound-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(39, 39, 39, 0.85);
                color: #D6D6D6;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 10px 15px;
                cursor: pointer;
                font-size: 14px;
                font-family: 'Open Sans', Arial, sans-serif;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            .snow-sound-toggle:hover {
                background: rgba(0, 0, 0, 0.8);
                border-color: rgba(255, 255, 255, 0.5);
            }

            .snow-sound-toggle.muted {
                opacity: 0.5;
            }

            .snow-sound-toggle.muted::after {
                content: " 🔇";
            }

            .snow-sound-toggle:not(.muted)::after {
                content: " 🔊";
            }

            /* Кнопка настроек - справа сверху, маленькая и незаметная */
            .snow-settings-button {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10001;
                width: 32px;
                height: 32px;
                background: rgba(39, 39, 39, 0.7);
                color: #D6D6D6;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
                opacity: 0.6;
            }

            .snow-settings-button:hover {
                opacity: 1;
                background: rgba(39, 39, 39, 0.9);
                border-color: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            /* Панель настроек */
            .snow-settings-panel {
                position: fixed;
                top: 50px;
                right: 10px;
                z-index: 10002;
                width: 280px;
                max-height: 80vh;
                overflow-y: auto;
                background: rgba(39, 39, 39, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 20px;
                font-family: 'Open Sans', Arial, sans-serif;
                font-size: 13px;
                color: #D6D6D6;
                backdrop-filter: blur(15px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                display: none;
            }

            .snow-settings-panel.open {
                display: block;
            }

            .snow-settings-panel h3 {
                margin: 0 0 15px 0;
                font-size: 16px;
                color: #fff;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            }

            .snow-settings-group {
                margin-bottom: 20px;
            }

            .snow-settings-group label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                cursor: pointer;
                gap: 15px;
            }

            .snow-settings-group .setting-label {
                flex: 1;
                margin-right: 0;
                text-align: left;
            }

            .snow-settings-group input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                flex-shrink: 0;
                margin: 0;
                margin-left: auto;
            }

            .snow-settings-group input[type="range"] {
                width: 100%;
                margin-top: 10px;
                margin-bottom: 0;
            }

            .snow-settings-group .range-value {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 3px;
                display: inline-block;
            }

            .snow-settings-group input[type="text"] {
                width: 100%;
                padding: 6px 8px;
                margin-top: 12px;
                margin-bottom: 0;
                box-sizing: border-box;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: #D6D6D6;
                font-size: 11px;
                font-family: 'Open Sans', Arial, sans-serif;
                transition: all 0.3s ease;
            }

            .snow-settings-group input[type="text"]:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.4);
                background: rgba(255, 255, 255, 0.15);
            }

            .snow-settings-group input[type="text"]::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }

            /* Кнопки масштабирования в панели настроек */
            .snow-zoom-control-btn {
                transition: all 0.3s ease;
            }

            .snow-zoom-control-btn:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                border-color: rgba(255, 255, 255, 0.4) !important;
                transform: scale(1.05);
            }

            .snow-zoom-control-btn:active {
                transform: scale(0.95);
            }

            /* Футер с подписью */
            .snow-settings-footer {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                font-style: italic;
            }

            /* Кнопка сброса настроек */
            #snow-reset-defaults {
                width: 100%;
                padding: 10px;
                background: rgba(220, 53, 69, 0.3);
                border: 1px solid rgba(220, 53, 69, 0.5);
                border-radius: 6px;
                color: #ff6b6b;
                cursor: pointer;
                font-size: 13px;
                font-family: 'Open Sans', Arial, sans-serif;
                transition: all 0.3s ease;
            }

            #snow-reset-defaults:hover {
                background: rgba(220, 53, 69, 0.5);
                border-color: rgba(220, 53, 69, 0.7);
                transform: translateY(-1px);
            }

            #snow-reset-defaults:active {
                transform: translateY(0);
            }

            /* Видео/изображение фон */
            .snow-video-background,
            .snow-image-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
                transform-origin: center center;
                transition: transform 0.3s ease;
            }
            
            .snow-image-background {
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            /* Кнопки масштабирования фона - скрыты */
            .snow-zoom-controls {
                position: fixed;
                bottom: 70px;
                right: 20px;
                z-index: 10000;
                display: none !important;
                flex-direction: column;
                gap: 8px;
            }

            .snow-zoom-button {
                width: 40px;
                height: 40px;
                background: rgba(39, 39, 39, 0.85);
                color: #D6D6D6;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                user-select: none;
            }

            .snow-zoom-button:hover {
                background: rgba(0, 0, 0, 0.8);
                border-color: rgba(255, 255, 255, 0.5);
                transform: scale(1.1);
            }

            .snow-zoom-button:active {
                transform: scale(0.95);
            }

            .snow-zoom-display {
                width: 40px;
                height: 30px;
                background: rgba(39, 39, 39, 0.85);
                color: #D6D6D6;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                font-size: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                font-family: 'Open Sans', Arial, sans-serif;
            }

            /* Гирлянда свисающая снизу хедера */
            .snow-garland {
                position: fixed;
                left: 0;
                width: 100%;
                height: auto;
                z-index: 9999;
                pointer-events: none;
                overflow: visible;
                display: flex !important;
                visibility: visible !important;
                justify-content: space-between;
                align-items: flex-start;
                padding: 0;
                margin: 0;
                transition: opacity 0.6s ease;
                opacity: 1;
            }

            /* Разрешаем взаимодействие с лампочками */
            .snow-garland-bulb-wrapper {
                pointer-events: auto;
            }

            /* Плавное затухание при скролле */
            .snow-garland.fade-out {
                opacity: 0;
                transform: translateY(-10px);
            }

            /* Веревочка гирлянды */
            .snow-garland::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 1.5px;
                background: linear-gradient(90deg,
                    rgba(139, 69, 19, 0.5) 0%,
                    rgba(160, 82, 45, 0.6) 25%,
                    rgba(139, 69, 19, 0.5) 50%,
                    rgba(160, 82, 45, 0.6) 75%,
                    rgba(139, 69, 19, 0.5) 100%);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                z-index: 1;
            }

            /* Контейнер для лампочек */
            .snow-garland-bulb-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 2;
            }

            /* Лампочка гирлянды - маленькая и изящная */
            .snow-garland-bulb {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                animation: garlandBlink 3s ease-in-out infinite;
                box-shadow: 0 0 6px currentColor, 0 0 12px currentColor, 0 0 18px rgba(255, 255, 255, 0.2);
                position: relative;
                transition: transform 0.2s ease, color 0.3s ease;
                margin-top: 2px;
                cursor: pointer;
                transform-origin: center center;
            }

            /* Эффект при наведении - лампочка увеличивается */
            .snow-garland-bulb:hover {
                transform: scale(1.2);
            }

            /* Плавное свечение лампочек */
            .snow-garland-bulb::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: radial-gradient(circle, currentColor 0%, transparent 70%);
                opacity: 0.3;
                animation: garlandGlow 3s ease-in-out infinite;
            }

            /* Цвета лампочек с плавными переходами */
            .snow-garland-bulb:nth-child(7n+1) { color: #ff4444; animation-delay: 0s; }
            .snow-garland-bulb:nth-child(7n+2) { color: #44ff44; animation-delay: 0.43s; }
            .snow-garland-bulb:nth-child(7n+3) { color: #4444ff; animation-delay: 0.86s; }
            .snow-garland-bulb:nth-child(7n+4) { color: #ffff44; animation-delay: 1.29s; }
            .snow-garland-bulb:nth-child(7n+5) { color: #ff44ff; animation-delay: 1.72s; }
            .snow-garland-bulb:nth-child(7n+6) { color: #44ffff; animation-delay: 2.15s; }
            .snow-garland-bulb:nth-child(7n+7) { color: #ff8844; animation-delay: 2.58s; }

            /* Плавная анимация мигания */
            @keyframes garlandBlink {
                0%, 100% {
                    opacity: 0.5;
                    transform: scale(0.95);
                    filter: brightness(0.8);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                    filter: brightness(1.3);
                }
            }

            /* Плавное свечение */
            @keyframes garlandGlow {
                0%, 100% {
                    opacity: 0.2;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                50% {
                    opacity: 0.5;
                    transform: translate(-50%, -50%) scale(1.1);
                }
            }

            /* Сломанная лампочка */
            .snow-garland-bulb.broken {
                opacity: 0.2 !important;
                filter: brightness(0.3) grayscale(100%) !important;
                animation: none !important;
                cursor: not-allowed !important;
                pointer-events: none !important;
            }

            .snow-garland-bulb.broken::after {
                display: none !important;
            }

            .snow-garland-bulb.broken:hover {
                transform: scale(1) !important;
            }

            /* Конструктор ёлочки - чемоданчик */
            .snow-tree-suitcase {
                position: fixed;
                left: 20px;
                bottom: 20px;
                z-index: 10000;
                width: 60px;
                height: 45px;
                background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #654321 100%);
                border: 2px solid #5C3A1F;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }

            .snow-tree-suitcase:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            .snow-tree-suitcase::before {
                content: '';
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 50px;
                height: 3px;
                background: #5C3A1F;
                border-radius: 2px;
            }

            /* Панель конструктора */
            .snow-tree-constructor-panel {
                position: fixed;
                left: 90px;
                bottom: 20px;
                z-index: 10001;
                width: 200px;
                background: rgba(39, 39, 39, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
                display: none;
                flex-direction: column;
                gap: 10px;
                backdrop-filter: blur(15px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .snow-tree-constructor-panel.open {
                display: flex;
            }

            .snow-tree-part {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
                font-size: 16px;
                transition: all 0.3s ease;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            }

            .snow-tree-part:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
                transform: scale(1.02);
            }

            .snow-tree-part.used {
                opacity: 0.7;
                cursor: not-allowed;
                background: rgba(0, 150, 0, 0.2);
                border-color: rgba(0, 255, 0, 0.4);
            }

            .snow-tree-part.used:hover {
                transform: scale(1);
            }

            .snow-tree-part-check {
                font-size: 18px;
                color: #4ade80;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .snow-tree-part.used .snow-tree-part-check {
                opacity: 1;
            }

            .snow-tree-part-text {
                flex: 1;
                text-align: left;
            }

            /* Заголовок сборки */
            .snow-tree-constructor-title {
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                text-align: center;
            }

            /* Собранная ёлка */
            .snow-tree-complete {
                position: fixed;
                left: 90px;
                bottom: 0;
                z-index: 1;
                font-size: 150px;
                text-align: center;
                line-height: 1;
                filter: drop-shadow(0 0 8px rgba(0, 255, 0, 0.4)) 
                        drop-shadow(0 0 15px rgba(0, 255, 0, 0.3))
                        drop-shadow(0 0 25px rgba(0, 255, 0, 0.2));
                animation: treeGlow 3s ease-in-out infinite;
                cursor: pointer;
                user-select: none;
                transform-origin: bottom center;
                transition: filter 0.3s ease, transform 0.3s ease;
            }

            /* Текст над ёлкой */
            .snow-tree-text {
                position: fixed;
                left: 90px;
                bottom: 160px;
                z-index: 1;
                font-size: 18px;
                color: #fff;
                text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6);
                font-family: 'Open Sans', Arial, sans-serif;
                font-weight: bold;
                white-space: nowrap;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.5s ease, transform 0.5s ease;
                pointer-events: none;
            }

            .snow-tree-text.visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Снеговик справа от ёлки */
            .snow-snowman {
                position: fixed;
                left: 250px;
                bottom: 0;
                z-index: 1;
                font-size: 80px;
                text-align: center;
                line-height: 1;
                animation: snowmanSway 3s ease-in-out infinite;
                user-select: none;
                transform-origin: bottom center;
            }

            @keyframes snowmanSway {
                0%, 100% {
                    transform: translateX(0) rotate(0deg);
                }
                25% {
                    transform: translateX(5px) rotate(1deg);
                }
                50% {
                    transform: translateX(0) rotate(0deg);
                }
                75% {
                    transform: translateX(-5px) rotate(-1deg);
                }
            }


            .snow-tree-complete.shaking {
                animation: treeShake 0.6s ease-in-out;
            }

            @keyframes treeShake {
                0%, 100% { transform: translateX(0) rotate(0deg); }
                10% { transform: translateX(-2px) rotate(-0.5deg); }
                20% { transform: translateX(2px) rotate(0.5deg); }
                30% { transform: translateX(-2px) rotate(-0.5deg); }
                40% { transform: translateX(2px) rotate(0.5deg); }
                50% { transform: translateX(-1px) rotate(-0.3deg); }
                60% { transform: translateX(1px) rotate(0.3deg); }
                70% { transform: translateX(-1px) rotate(-0.2deg); }
                80% { transform: translateX(1px) rotate(0.2deg); }
                90% { transform: translateX(0) rotate(0deg); }
            }

            /* Анимация рассыпания снеговика */
            .snow-snowman.crumbling {
                animation: snowmanCrumble 0.5s ease-out forwards;
            }

            @keyframes snowmanCrumble {
                0% {
                    transform: translateX(0) rotate(0deg) scale(1);
                    opacity: 1;
                }
                50% {
                    transform: translateX(10px) rotate(10deg) scale(0.8);
                    opacity: 0.7;
                }
                100% {
                    transform: translateX(20px) rotate(20deg) scale(0.3);
                    opacity: 0;
                }
            }

            /* Звездочка на ёлке */
            .snow-tree-star {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 40px;
                line-height: 1;
                transition: transform 0.3s ease;
            }

            .snow-tree-star.smiling {
                transform: translateX(-50%) scale(1.1);
                transition: transform 0.4s ease;
            }

            @keyframes treeGlow {
                0%, 100% {
                    filter: drop-shadow(0 0 8px rgba(0, 255, 0, 0.4)) 
                            drop-shadow(0 0 15px rgba(0, 255, 0, 0.3))
                            drop-shadow(0 0 25px rgba(0, 255, 0, 0.2));
                    transform: scale(1);
                }
                50% {
                    filter: drop-shadow(0 0 12px rgba(0, 255, 0, 0.5)) 
                            drop-shadow(0 0 20px rgba(0, 255, 0, 0.4))
                            drop-shadow(0 0 30px rgba(0, 255, 0, 0.3));
                    transform: scale(1.01);
                }
            }

            /* Кнопка убрать ёлку в панели */
            .snow-tree-remove-btn {
                padding: 10px;
                background: rgba(220, 53, 69, 0.6);
                border: 2px solid rgba(220, 53, 69, 0.8);
                border-radius: 6px;
                color: #fff;
                cursor: pointer;
                font-size: 13px;
                font-family: 'Open Sans', Arial, sans-serif;
                transition: all 0.3s ease;
                text-align: center;
                margin-top: 5px;
            }

            .snow-tree-remove-btn:hover {
                background: rgba(220, 53, 69, 0.9);
                border-color: rgba(220, 53, 69, 1);
                transform: scale(1.05);
            }

            .snow-tree-remove-btn:active {
                transform: scale(0.95);
            }

            /* Снежинки при стряхивании */
            .snow-tree-shake-flake {
                position: fixed;
                font-size: 20px;
                pointer-events: none;
                z-index: 10002;
            }
        `;

        // Используем GM_addStyle если доступен (Tampermonkey/Greasemonkey)
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(styles);
        } else {
            // Fallback для обычного использования
            const style = document.createElement('style');
            style.id = 'snow-theme-styles';
            style.textContent = styles;
            document.head.appendChild(style);
        }

        this.stylesInjected = true;
    }

    createContainer() {
        // Проверяем, есть ли уже контейнер для частиц
        const existingParticles = document.getElementById('particles-js-snow');

        this.container = document.createElement('div');
        this.container.className = 'snow-container';
        this.container.id = 'snow-theme-container';

        // Размещаем контейнер в body, но после существующих элементов частиц если они есть
        if (existingParticles && existingParticles.parentNode) {
            existingParticles.parentNode.insertBefore(this.container, existingParticles.nextSibling);
        } else {
            document.body.appendChild(this.container);
        }

        // Применяем z-index
        this.updateSnowflakesZIndex();
    }

    updateSnowflakesZIndex() {
        if (!this.container) return;
        
        // Убираем старые классы
        this.container.classList.remove('behind', 'on-top');
        
        // Добавляем нужный класс
        if (this.options.snowflakesOnTop) {
            this.container.classList.add('on-top');
        } else {
            this.container.classList.add('behind');
        }
    }

    // Определение типа медиа по расширению файла
    isImageFile(url) {
        if (!url) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'];
        const lowerUrl = url.toLowerCase();
        return imageExtensions.some(ext => lowerUrl.includes(ext));
    }

    createVideoBackground() {
        if (!this.options.enableVideoBackground || !this.options.videoBackgroundUrl) return;

        const url = this.options.videoBackgroundUrl;
        const isImage = this.isImageFile(url);

        // Удаляем предыдущий элемент если есть
        if (this.videoBackground) {
            this.videoBackground.remove();
            this.videoBackground = null;
        }

        if (isImage) {
            // Создаем элемент изображения
            this.videoBackground = document.createElement('img');
            this.videoBackground.className = 'snow-image-background';
            this.videoBackground.src = url;
            this.videoBackground.style.opacity = this.options.videoBackgroundOpacity;
            this.updateVideoBackgroundFit();

            this.videoBackground.addEventListener('load', () => {
                // Изображение загружено
            });

            this.videoBackground.addEventListener('error', () => {
                console.log('Не удалось загрузить изображение фон:', url);
            });
        } else {
            // Создаем элемент видео
            this.videoBackground = document.createElement('video');
            this.videoBackground.className = 'snow-video-background';
            this.videoBackground.src = url;
            this.videoBackground.autoplay = true;
            this.videoBackground.loop = true;
            this.videoBackground.muted = true;
            this.videoBackground.playsInline = true;
            this.videoBackground.style.opacity = this.options.videoBackgroundOpacity;
            this.updateVideoBackgroundFit();

            this.videoBackground.addEventListener('loadeddata', () => {
                this.videoBackground.play().catch(() => {});
            });

            this.videoBackground.addEventListener('error', () => {
                console.log('Не удалось загрузить видео фон:', url);
            });
        }

        document.body.appendChild(this.videoBackground);
        this.updateBackgroundScale();
    }

    updateVideoOpacity() {
        if (this.videoBackground) {
            this.videoBackground.style.opacity = this.options.videoBackgroundOpacity;
        }
    }

    updateVideoBackgroundFit() {
        if (this.videoBackground) {
            this.videoBackground.style.objectFit = this.options.videoBackgroundFitCover ? 'cover' : 'contain';
        }
    }

    updateBackgroundScale() {
        if (this.videoBackground) {
            this.videoBackground.style.transform = `scale(${this.backgroundScale})`;
        }
    }

    createZoomControls() {
        // Создаем контейнер для кнопок масштабирования
        const zoomControls = document.createElement('div');
        zoomControls.className = 'snow-zoom-controls';
        zoomControls.id = 'snow-zoom-controls';

        // Кнопка увеличения
        const zoomIn = document.createElement('button');
        zoomIn.className = 'snow-zoom-button';
        zoomIn.innerHTML = '+';
        zoomIn.title = 'Увеличить фон (колесико мыши + Ctrl)';
        zoomIn.addEventListener('click', () => {
            this.zoomIn();
        });

        // Отображение текущего масштаба
        const zoomDisplay = document.createElement('div');
        zoomDisplay.className = 'snow-zoom-display';
        zoomDisplay.id = 'snow-zoom-display';
        zoomDisplay.textContent = `${Math.round(this.backgroundScale * 100)}%`;

        // Кнопка уменьшения
        const zoomOut = document.createElement('button');
        zoomOut.className = 'snow-zoom-button';
        zoomOut.innerHTML = '−';
        zoomOut.title = 'Уменьшить фон (колесико мыши + Ctrl)';
        zoomOut.addEventListener('click', () => {
            this.zoomOut();
        });

        zoomControls.appendChild(zoomIn);
        zoomControls.appendChild(zoomDisplay);
        zoomControls.appendChild(zoomOut);

        document.body.appendChild(zoomControls);

        // Обновляем видимость кнопок
        this.updateZoomControlsVisibility();

        // Обработчик колесика мыши с Ctrl для масштабирования
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey && this.videoBackground && this.options.enableVideoBackground) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            }
        }, { passive: false });
    }

    zoomIn() {
        if (!this.videoBackground || !this.options.enableVideoBackground) return;
        this.backgroundScale = Math.min(3.0, this.backgroundScale + 0.1);
        this.backgroundScale = Math.round(this.backgroundScale * 10) / 10; // Округляем до 1 знака
        this.updateBackgroundScale();
        this.updateZoomDisplay();
        this.saveSettings();
    }

    zoomOut() {
        if (!this.videoBackground || !this.options.enableVideoBackground) return;
        this.backgroundScale = Math.max(0.3, this.backgroundScale - 0.1);
        this.backgroundScale = Math.round(this.backgroundScale * 10) / 10; // Округляем до 1 знака
        this.updateBackgroundScale();
        this.updateZoomDisplay();
        this.saveSettings();
    }

    updateZoomDisplay() {
        const display = document.getElementById('snow-zoom-display');
        if (display) {
            display.textContent = `${Math.round(this.backgroundScale * 100)}%`;
        }
        // Обновляем также элементы в панели настроек
        const zoomValue = document.getElementById('snow-zoom-value');
        const zoomRange = document.getElementById('snow-zoom-range');
        if (zoomValue) {
            zoomValue.textContent = `${Math.round(this.backgroundScale * 100)}%`;
        }
        if (zoomRange) {
            zoomRange.value = Math.round(this.backgroundScale * 100);
        }
    }

    updateZoomControlsVisibility() {
        const zoomControls = document.getElementById('snow-zoom-controls');
        if (zoomControls) {
            if (this.options.enableVideoBackground && this.videoBackground) {
                zoomControls.style.display = 'flex';
            } else {
                zoomControls.style.display = 'none';
            }
        }
    }
    
    // Проверка, является ли фон видео (для методов play/pause)
    isVideoBackground() {
        return this.videoBackground && this.videoBackground.tagName === 'VIDEO';
    }

    createGarland() {
        // Удаляем старые обработчики если есть
        if (this.garlandScrollHandler) {
            window.removeEventListener('scroll', this.garlandScrollHandler);
            this.garlandScrollHandler = null;
        }
        if (this.garlandResizeHandler) {
            window.removeEventListener('resize', this.garlandResizeHandler);
            this.garlandResizeHandler = null;
        }

        if (this.garland) {
            this.garland.remove();
        }

        this.garland = document.createElement('div');
        this.garland.className = 'snow-garland';

        // Создаем лампочки гирлянды с веревочкой
        const baseSpacing = 60;
        const bulbCount = Math.max(5, Math.floor(window.innerWidth / baseSpacing));
        const spacing = window.innerWidth / (bulbCount + 1);

        for (let i = 0; i < bulbCount; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'snow-garland-bulb-wrapper';
            wrapper.style.left = `${spacing * (i + 1)}px`;
            wrapper.style.position = 'absolute';

            const bulb = document.createElement('div');
            bulb.className = 'snow-garland-bulb';

            // Циклическое распределение цветов с плавными задержками
            const colorIndex = i % 7;
            const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff8844'];
            bulb.style.color = colors[colorIndex];
            bulb.style.animationDelay = `${(i * 0.43) % 3}s`;

            // Добавляем интерактивность - лампочка меняет цвет при клике
            this.addBulbClickHandler(bulb);

            wrapper.appendChild(bulb);
            this.garland.appendChild(wrapper);
        }

        // Добавляем гирлянду в body
        document.body.appendChild(this.garland);

        // Убеждаемся что гирлянда видна
        this.garland.style.display = 'flex';
        this.garland.style.visibility = 'visible';
        this.garland.style.opacity = '1';

        // Обновляем позицию и прозрачность при скролле
        let scrollTimeout;
        let lastScrollY = window.scrollY;
        const updateGarlandPosition = () => {
            if (!this.garland) return;

            const currentScrollY = window.scrollY;
            // Ищем хедер - сначала по id="header", потом по другим вариантам
            const header = document.querySelector('#header') ||
                          document.querySelector('#headerMover') ||
                          document.querySelector('.underHeaderContainer') ||
                          document.querySelector('header') ||
                          document.body;

            if (!header) return;

            const headerRect = header.getBoundingClientRect();
            const headerBottom = headerRect.bottom;

            // Позиционируем гирлянду снизу хедера
            const garlandTop = headerBottom + 3;
            this.garland.style.top = `${garlandTop}px`;
            this.garland.style.display = 'flex';
            this.garland.style.visibility = 'visible';

            // Плавное затухание при скролле вниз
            const scrollThreshold = 50;
            const fadeStart = scrollThreshold;
            const fadeEnd = scrollThreshold + 100;

            if (currentScrollY > fadeStart) {
                const fadeProgress = Math.min(1, (currentScrollY - fadeStart) / (fadeEnd - fadeStart));
                const opacity = 1 - fadeProgress;
                this.garland.style.opacity = opacity;

                if (opacity < 0.1) {
                    this.garland.classList.add('fade-out');
                } else {
                    this.garland.classList.remove('fade-out');
                }
            } else {
                this.garland.style.opacity = '1';
                this.garland.classList.remove('fade-out');
            }

            lastScrollY = currentScrollY;
        };

        // Обновляем при скролле (с throttling)
        this.garlandScrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateGarlandPosition, 10);
        };
        window.addEventListener('scroll', this.garlandScrollHandler, { passive: true });

        // Обновляем при изменении размера окна
        this.garlandResizeHandler = () => {
            if (this.garland && this.options.enableGarland) {
                this.createGarland();
            }
        };
        window.addEventListener('resize', this.garlandResizeHandler, { passive: true });

        // Инициализируем позицию
        updateGarlandPosition();
    }

    addBulbClickHandler(bulb) {
        // Палитра цветов для лампочек
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800'];

        // Уникальный ID для лампочки
        const bulbId = `bulb-${Date.now()}-${Math.random()}`;
        bulb.dataset.bulbId = bulbId;
        this.bulbClickCounts[bulbId] = 0;

        // Обработчик клика - меняем цвет на случайный
        bulb.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события

            // Проверяем, не сломана ли лампочка
            if (bulb.classList.contains('broken')) {
                return;
            }

            // Увеличиваем счетчик кликов
            this.bulbClickCounts[bulbId] = (this.bulbClickCounts[bulbId] || 0) + 1;

            // Если кликов больше 5, есть шанс 30% что лампочка сломается
            if (this.bulbClickCounts[bulbId] > 5) {
                const breakChance = 0.3; // 30% шанс
                if (Math.random() < breakChance) {
                    this.breakBulb(bulb, bulbId);
                    return; // Не меняем цвет, если сломалась
                }
            }

            // Выбираем случайный цвет из палитры
            const randomIndex = Math.floor(Math.random() * colors.length);
            const newColor = colors[randomIndex];

            // Применяем новый цвет
            bulb.style.color = newColor;

            // Добавляем эффект "пульсации" при клике
            bulb.style.transform = 'scale(1.5)';
            setTimeout(() => {
                if (!bulb.classList.contains('broken')) {
                    bulb.style.transform = 'scale(1)';
                }
            }, 200);
        });
    }

    breakBulb(bulb, bulbId) {
        // Помечаем лампочку как сломанную
        bulb.classList.add('broken');
        this.brokenBulbs.add(bulbId);

        // Добавляем эффект "взрыва" - быстрое мерцание перед поломкой
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            if (flashCount >= 3) {
                clearInterval(flashInterval);
                bulb.style.opacity = '0.2';
                bulb.style.filter = 'brightness(0.3) grayscale(100%)';
            } else {
                bulb.style.opacity = flashCount % 2 === 0 ? '0.1' : '0.5';
            }
            flashCount++;
        }, 100);

        // Восстанавливаем лампочку через 20 секунд
        setTimeout(() => {
            this.repairBulb(bulb, bulbId);
        }, 20000);
    }

    repairBulb(bulb, bulbId) {
        // Убираем класс broken
        bulb.classList.remove('broken');
        this.brokenBulbs.delete(bulbId);

        // Сбрасываем счетчик кликов
        this.bulbClickCounts[bulbId] = 0;

        // Восстанавливаем нормальный вид с плавной анимацией
        bulb.style.opacity = '';
        bulb.style.filter = '';
        bulb.style.transform = 'scale(1.2)';
        
        // Плавное восстановление
        setTimeout(() => {
            bulb.style.transform = 'scale(1)';
        }, 300);
    }

    createTreeConstructor() {
        // Удаляем старый конструктор если есть
        this.destroyTreeConstructor();

        // Проверяем, была ли ёлка собрана
        let treeWasComplete = false;
        try {
            treeWasComplete = localStorage.getItem('snowThemeTreeComplete') === 'true';
        } catch (e) {}

        // Создаем чемоданчик
        const suitcase = document.createElement('div');
        suitcase.className = 'snow-tree-suitcase';
        suitcase.innerHTML = '🧳';
        suitcase.title = 'Конструктор ёлочки';
        document.body.appendChild(suitcase);

        // Создаем панель с частями
        const panel = document.createElement('div');
        panel.className = 'snow-tree-constructor-panel';
        
        // Если ёлка была собрана, помечаем все части как использованные
        const trunkClass = treeWasComplete ? 'used' : '';
        const ornamentClass = treeWasComplete ? 'used' : '';
        const foliageClass = treeWasComplete ? 'used' : '';
        
        panel.innerHTML = `
            <div class="snow-tree-constructor-title">🔧 Сборка</div>
            <div class="snow-tree-part ${trunkClass}" data-part="trunk">
                <span class="snow-tree-part-text">🪵 Ножка</span>
                <span class="snow-tree-part-check">✓</span>
            </div>
            <div class="snow-tree-part ${ornamentClass}" data-part="ornament">
                <span class="snow-tree-part-text">🎄 Игрушка</span>
                <span class="snow-tree-part-check">✓</span>
            </div>
            <div class="snow-tree-part ${foliageClass}" data-part="foliage">
                <span class="snow-tree-part-text">🌲 Листва</span>
                <span class="snow-tree-part-check">✓</span>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Если ёлка была собрана, добавляем кнопку "Убрать"
        if (treeWasComplete) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'snow-tree-remove-btn';
            removeBtn.textContent = 'Убрать';
            removeBtn.title = 'Убрать ёлку обратно в чемодан';
            panel.appendChild(removeBtn);
            
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTree();
            });
        }

        // Обработчик клика на чемоданчик
        suitcase.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        // Если ёлка была собрана, восстанавливаем состояние частей
        if (treeWasComplete) {
            this.treeParts = { trunk: true, ornament: true, foliage: true };
        }

        // Обработчики кликов на части
        const parts = panel.querySelectorAll('.snow-tree-part');
        parts.forEach(part => {
            part.addEventListener('click', (e) => {
                e.stopPropagation();
                const partType = part.dataset.part;
                
                if (part.classList.contains('used')) return;

                // Отмечаем часть как использованную
                part.classList.add('used');
                this.treeParts[partType] = true;

                // Проверяем, все ли части собраны
                if (this.treeParts.trunk && this.treeParts.ornament && this.treeParts.foliage) {
                    this.showCompleteTree();
                }
            });
        });

        // Закрытие панели при клике вне её
        this.treeConstructorClickHandler = (e) => {
            if (!panel.contains(e.target) && !suitcase.contains(e.target)) {
                panel.classList.remove('open');
            }
        };
        document.addEventListener('click', this.treeConstructorClickHandler);

        this.treeConstructor = { suitcase, panel };
    }

    showCompleteTree() {
        // Сохраняем в localStorage что ёлка собрана
        try {
            localStorage.setItem('snowThemeTreeComplete', 'true');
        } catch (e) {
            console.log('Не удалось сохранить состояние ёлки:', e);
        }

        // Обновляем панель - добавляем кнопку "Убрать"
        if (this.treeConstructor && this.treeConstructor.panel) {
            // Проверяем, нет ли уже кнопки
            let removeBtn = this.treeConstructor.panel.querySelector('.snow-tree-remove-btn');
            if (!removeBtn) {
                removeBtn = document.createElement('button');
                removeBtn.className = 'snow-tree-remove-btn';
                removeBtn.textContent = 'Убрать';
                removeBtn.title = 'Убрать ёлку обратно в чемодан';
                this.treeConstructor.panel.appendChild(removeBtn);
                
                // Обработчик кнопки "Убрать"
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeTree();
                });
            }
        }

        // Проверяем, нет ли уже ёлки на экране
        if (this.treeConstructor && this.treeConstructor.completeTree) {
            return; // Ёлка уже отображается
        }

        // Показываем собранную ёлку
        const completeTree = document.createElement('div');
        completeTree.className = 'snow-tree-complete';
        
        // Добавляем саму ёлку
        const treeEmoji = document.createElement('span');
        treeEmoji.innerHTML = '🎄';
        completeTree.appendChild(treeEmoji);
        
        document.body.appendChild(completeTree);

        // Создаём элемент для текста над ёлкой
        const treeText = document.createElement('div');
        treeText.className = 'snow-tree-text';
        document.body.appendChild(treeText);

        // Создаём снеговика справа от ёлки
        this.createSnowman();

        // Обработчик клика на ёлку - стряхивание снега
        completeTree.addEventListener('click', (e) => {
            e.stopPropagation();
            // Ищем существующую звезду на ёлке или в гирлянде
            let star = completeTree.querySelector('.snow-tree-star');
            if (!star) {
                star = document.querySelector('.snow-tree-star');
            }
            // Если не нашли, создаём звезду на ёлке
            if (!star) {
                star = document.createElement('div');
                star.className = 'snow-tree-star';
                star.innerHTML = '⭐';
                completeTree.appendChild(star);
                // Сохраняем ссылку на звезду
                if (this.treeConstructor) {
                    this.treeConstructor.star = star;
                }
            }
            this.shakeTreeSnow(completeTree, star);
        });

        // Сохраняем ссылки на ёлку и текст
        if (this.treeConstructor) {
            this.treeConstructor.completeTree = completeTree;
            this.treeConstructor.treeText = treeText;
        }
        
        // Добавляем кнопку управления снеговиком в панель
        this.addSnowmanControlButton();
    }

    addSnowmanControlButton() {
        if (!this.treeConstructor || !this.treeConstructor.panel) return;

        // Проверяем, нет ли уже кнопки
        let snowmanBtn = this.treeConstructor.panel.querySelector('.snow-snowman-control-btn');
        if (snowmanBtn) return;

        const snowmanVisible = this.treeConstructor.snowman && 
                               this.treeConstructor.snowman.parentNode;
        
        snowmanBtn = document.createElement('button');
        snowmanBtn.className = 'snow-tree-remove-btn snow-snowman-control-btn';
        snowmanBtn.textContent = snowmanVisible ? 'Добавить снеговика' : 'Вернуть снеговика';
        snowmanBtn.title = snowmanVisible ? 'Добавить снеговика' : 'Вернуть снеговика';
        this.treeConstructor.panel.appendChild(snowmanBtn);
        
        snowmanBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSnowman();
            // Обновляем текст кнопки
            const isVisible = this.treeConstructor.snowman && 
                             this.treeConstructor.snowman.parentNode;
            snowmanBtn.textContent = isVisible ? 'Добавить снеговика' : 'Вернуть снеговика';
            snowmanBtn.title = isVisible ? 'Добавить снеговика' : 'Вернуть снеговика';
        });
    }

    crumbleSnowman(snowman) {
        if (!snowman || snowman.classList.contains('crumbling') || !snowman.parentNode) return;

        // Добавляем класс рассыпания
        snowman.classList.add('crumbling');
        snowman.style.pointerEvents = 'none';
        snowman.style.cursor = 'default';

        // Удаляем снеговика из DOM после анимации
        setTimeout(() => {
            if (snowman.parentNode) {
                snowman.remove();
            }
            // Очищаем ссылку на снеговика
            if (this.treeConstructor) {
                this.treeConstructor.snowman = null;
            }
        }, 500);
    }

    toggleSnowman() {
        if (!this.treeConstructor) return;

        const snowman = this.treeConstructor.snowman;
        const isVisible = snowman && snowman.parentNode && snowman.style.display !== 'none' && snowman.offsetParent !== null;
        
        if (isVisible) {
            // Удаляем снеговика полностью
            if (snowman && snowman.parentNode) {
                snowman.remove();
            }
            this.treeConstructor.snowman = null;
        } else {
            // Создаём снеговика заново
            this.createSnowman();
        }
    }

    createSnowman() {
        if (!this.treeConstructor || this.treeConstructor.snowman) return;

        // Создаём снеговика справа от ёлки
        const snowman = document.createElement('div');
        snowman.className = 'snow-snowman';
        snowman.innerHTML = '⛄';
        snowman.style.cursor = 'pointer';
        snowman.title = 'Кликни чтобы рассыпать';
        document.body.appendChild(snowman);

        // Обработчик клика на снеговика - рассыпание
        snowman.addEventListener('click', (e) => {
            e.stopPropagation();
            this.crumbleSnowman(snowman);
        });

        // Сохраняем ссылку на снеговика
        this.treeConstructor.snowman = snowman;
    }

    restoreTreeIfNeeded() {
        // Проверяем, была ли ёлка собрана
        try {
            const treeComplete = localStorage.getItem('snowThemeTreeComplete');
            if (treeComplete === 'true') {
                // Восстанавливаем состояние частей
                this.treeParts = { trunk: true, ornament: true, foliage: true };
                // Показываем ёлку (но только если её ещё нет)
                if (!this.treeConstructor || !this.treeConstructor.completeTree) {
                    this.showCompleteTree();
                } else {
                    // Если ёлка уже есть, просто добавляем кнопку управления снеговиком
                    this.addSnowmanControlButton();
                }
            }
        } catch (e) {
            console.log('Не удалось восстановить состояние ёлки:', e);
        }
    }

    shakeTreeSnow(tree, star) {
        // Добавляем класс тряски (плавно)
        requestAnimationFrame(() => {
            tree.classList.add('shaking');
        });
        
        // Показываем улыбку на звездочке (плавно), если звезда существует
        if (star) {
            star.classList.add('smiling');
            star.innerHTML = '😊';
        }
        
        // Создаем снежинки при стряхивании
        const symbols = ['❄', '❅', '❆'];
        const flakeCount = 12;
        
        for (let i = 0; i < flakeCount; i++) {
            setTimeout(() => {
                const flake = document.createElement('div');
                flake.className = 'snow-tree-shake-flake';
                flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                
                const treeRect = tree.getBoundingClientRect();
                const startX = treeRect.left + treeRect.width / 2 + (Math.random() - 0.5) * 100;
                const startY = treeRect.top + Math.random() * treeRect.height;
                
                flake.style.left = startX + 'px';
                flake.style.top = startY + 'px';
                
                // Случайное смещение в стороны
                const driftX = (Math.random() - 0.5) * 150;
                const driftY = 100 + Math.random() * 50;
                const rotation = Math.random() * 720;
                
                // Создаем keyframes для этой конкретной снежинки
                const animationName = `shakeFlakeFall_${Date.now()}_${i}`;
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes ${animationName} {
                        0% {
                            opacity: 1;
                            transform: translate(0, 0) rotate(0deg);
                        }
                        100% {
                            opacity: 0;
                            transform: translate(${driftX}px, ${driftY}px) rotate(${rotation}deg);
                        }
                    }
                `;
                document.head.appendChild(style);
                
                flake.style.animation = `${animationName} 1s ease-out forwards`;
                
                document.body.appendChild(flake);
                
                // Удаляем стиль после анимации
                setTimeout(() => {
                    style.remove();
                }, 1000);
                
                setTimeout(() => {
                    if (flake.parentNode) {
                        flake.remove();
                    }
                }, 1000);
            }, i * 50);
        }
        
        // Убираем класс тряски через 0.6 секунды (плавно)
        setTimeout(() => {
            requestAnimationFrame(() => {
                tree.classList.remove('shaking');
            });
        }, 600);
        
        // Убираем улыбку через 2 секунды (плавно), если звезда существует
        if (star) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    star.classList.remove('smiling');
                    star.innerHTML = ' ';
                    
                    // Показываем текст над ёлкой
                    if (this.treeConstructor && this.treeConstructor.treeText) {
                        const treeText = this.treeConstructor.treeText;
                        treeText.textContent = 'New Year Is Soon!';
                        treeText.classList.add('visible');
                        
                        // Убираем текст через 5 секунд
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                treeText.classList.remove('visible');
                                setTimeout(() => {
                                    treeText.textContent = '';
                                }, 500);
                            });
                        }, 5000);
                    }
                });
            }, 2000);
        }
    }

    removeTree() {
        // Удаляем из localStorage что ёлка собрана
        try {
            localStorage.removeItem('snowThemeTreeComplete');
        } catch (e) {
            console.log('Не удалось удалить состояние ёлки:', e);
        }

        if (this.treeConstructor && this.treeConstructor.completeTree) {
            this.treeConstructor.completeTree.remove();
            this.treeConstructor.completeTree = null;
            this.treeConstructor.star = null;
        }
        
        if (this.treeConstructor && this.treeConstructor.treeText) {
            this.treeConstructor.treeText.remove();
            this.treeConstructor.treeText = null;
        }
        
        if (this.treeConstructor && this.treeConstructor.snowman) {
            this.treeConstructor.snowman.remove();
            this.treeConstructor.snowman = null;
        }
        
        // Удаляем кнопку управления снеговиком
        if (this.treeConstructor && this.treeConstructor.panel) {
            const snowmanBtn = this.treeConstructor.panel.querySelector('.snow-snowman-control-btn');
            if (snowmanBtn) {
                snowmanBtn.remove();
            }
        }
        
        // Удаляем кнопку "Убрать" из панели
        if (this.treeConstructor && this.treeConstructor.panel) {
            const removeBtn = this.treeConstructor.panel.querySelector('.snow-tree-remove-btn');
            if (removeBtn) {
                removeBtn.remove();
            }
        }
        
        // Сбрасываем состояние и возвращаем панель
        this.treeParts = { trunk: false, ornament: false, foliage: false };
        if (this.treeConstructor && this.options.enableTreeConstructor) {
            // Пересоздаем панель без кнопки
            const panel = this.treeConstructor.panel;
            if (panel) {
                panel.innerHTML = `
                    <div class="snow-tree-constructor-title">🔧 Сборка</div>
                    <div class="snow-tree-part" data-part="trunk">
                        <span class="snow-tree-part-text">🪵 Ножка</span>
                        <span class="snow-tree-part-check">✓</span>
                    </div>
                    <div class="snow-tree-part" data-part="ornament">
                        <span class="snow-tree-part-text">🎄 Игрушка</span>
                        <span class="snow-tree-part-check">✓</span>
                    </div>
                    <div class="snow-tree-part" data-part="foliage">
                        <span class="snow-tree-part-text">🌲 Листва</span>
                        <span class="snow-tree-part-check">✓</span>
                    </div>
                `;
                
                // Переустанавливаем обработчики
                const parts = panel.querySelectorAll('.snow-tree-part');
                parts.forEach(part => {
                    part.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const partType = part.dataset.part;
                        
                        if (part.classList.contains('used')) return;

                        part.classList.add('used');
                        this.treeParts[partType] = true;

                        if (this.treeParts.trunk && this.treeParts.ornament && this.treeParts.foliage) {
                            this.showCompleteTree();
                        }
                    });
                });
            }
        }
    }

    destroyTreeConstructor() {
        if (this.treeConstructorClickHandler) {
            document.removeEventListener('click', this.treeConstructorClickHandler);
            this.treeConstructorClickHandler = null;
        }
        
        if (this.treeConstructor) {
            if (this.treeConstructor.suitcase) {
                this.treeConstructor.suitcase.remove();
            }
            if (this.treeConstructor.panel) {
                this.treeConstructor.panel.remove();
            }
            if (this.treeConstructor.completeTree) {
                this.treeConstructor.completeTree.remove();
            }
            if (this.treeConstructor.treeText) {
                this.treeConstructor.treeText.remove();
            }
            if (this.treeConstructor.snowman) {
                this.treeConstructor.snowman.remove();
            }
            this.treeConstructor = null;
        }
        this.treeParts = { trunk: false, ornament: false, foliage: false };
        
        // Удаляем собранную ёлку если есть (на случай если она осталась)
        const completeTree = document.querySelector('.snow-tree-complete');
        if (completeTree) {
            completeTree.remove();
        }
    }

    createSnowflakes() {
        if (!this.container) return;

        // Очищаем существующие снежинки
        this.snowflakes.forEach(sf => sf.remove());
        this.snowflakes = [];

        const symbols = ['❄', '❅', '❆', '✻', '✼', '✽', '✾', '✿', '❀', '❁'];

        for (let i = 0; i < this.options.snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';

            const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
            const speed = Math.random() * (this.options.maxSpeed - this.options.minSpeed) + this.options.minSpeed;
            const drift = (Math.random() - 0.5) * this.options.windStrength;
            const startX = Math.random() * 100;
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];

            snowflake.textContent = symbol;
            snowflake.style.fontSize = `${size}px`;
            snowflake.style.left = `${startX}%`;
            snowflake.style.animationDuration = `${speed}s`;
            snowflake.style.animationDelay = `${Math.random() * speed}s`;
            snowflake.style.setProperty('--drift', `${drift}px`);

            this.container.appendChild(snowflake);
            this.snowflakes.push(snowflake);
        }
    }

    createClickSnowflakes(x, y) {
        const symbols = ['❄', '❅', '❆', '✻', '✼', '✽', '✾', '✿', '❀', '❁'];
        const clickSnowflakeCount = 8;

        for (let i = 0; i < clickSnowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake-click';

            const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];

            const angle = (Math.PI * 2 * i) / clickSnowflakeCount + Math.random() * 0.5;
            const distance = 80 + Math.random() * 60;
            const driftX = Math.cos(angle) * distance;
            const driftY = Math.sin(angle) * distance;
            const duration = 0.8 + Math.random() * 0.4;

            snowflake.textContent = symbol;
            snowflake.style.fontSize = `${size}px`;
            snowflake.style.left = `${x}px`;
            snowflake.style.top = `${y}px`;
            snowflake.style.animationDuration = `${duration}s`;
            snowflake.style.setProperty('--click-drift-x', `${driftX}px`);
            snowflake.style.setProperty('--click-drift-y', `${driftY}px`);

            document.body.appendChild(snowflake);

            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, duration * 1000);
        }
    }

    initAudio() {
        if (!this.soundEnabled) return;

        // Звук вьюги (фон)
        if (this.options.enableWindSound && this.options.windSoundUrl) {
            this.windAudio = new Audio(this.options.windSoundUrl);
            this.windAudio.loop = true;
            this.windAudio.volume = this.options.windVolume;
            this.windAudio.preload = 'auto';

            // Восстанавливаем сохраненную позицию воспроизведения
            const savedTime = this.loadWindAudioTime();
            if (savedTime !== null && savedTime > 0) {
                this.windAudio.addEventListener('loadedmetadata', () => {
                    // Проверяем что сохраненное время не больше длительности
                    if (savedTime < this.windAudio.duration) {
                        this.windAudio.currentTime = savedTime;
                    }
                }, { once: true });
            }

            // Сохраняем позицию каждые 5 секунд
            this.startSavingWindAudioTime();

            this.tryPlayWind();
        }

        // Звук клика (снежный щелчок)
        if (this.options.enableClickSound && this.options.clickSoundUrl) {
            this.clickAudio = new Audio(this.options.clickSoundUrl);
            this.clickAudio.volume = this.options.clickVolume;
            this.clickAudio.preload = 'auto';
        }

        // Звук ховера (хруст)
        if (this.options.enableHoverSound && this.options.hoverSoundUrl) {
            this.hoverAudio = new Audio(this.options.hoverSoundUrl);
            this.hoverAudio.volume = this.options.hoverVolume;
            this.hoverAudio.preload = 'auto';
        }

        // Debounce для hover звука
        this.lastHoverTime = 0;
        this.hoverDebounce = 100;
    }

    tryPlayWind() {
        // Воспроизведение звука возможно только после взаимодействия пользователя
        const playWind = () => {
            if (this.soundEnabled && this.windAudio && this.windAudio.paused) {
                this.windAudio.play().catch(err => {
                    console.log('Не удалось воспроизвести звук вьюги:', err);
                });

                // Обрабатываем окончание звука (если loop не сработал)
                this.windAudio.addEventListener('ended', () => {
                    try {
                        localStorage.setItem('snowThemeWindAudioTime', '0');
                    } catch (e) {}
                    if (this.windAudio && this.soundEnabled) {
                        this.windAudio.currentTime = 0;
                        this.windAudio.play().catch(() => {});
                    }
                }, { once: true });
            }
        };

        // Добавляем обработчики на различные события (БЕЗ once, чтобы работало при каждом клике)
        const events = ['click', 'touchstart', 'keydown', 'mousedown'];
        events.forEach(event => {
            document.addEventListener(event, playWind, { passive: true });
        });

        // Также обрабатываем клики на лого и другие элементы навигации
        setTimeout(() => {
            this.setupLogoHandlers();
        }, 500);
    }
    
    setupLogoHandlers() {
        // Обработчик для запуска звука при клике на лого
        const playWindOnInteraction = () => {
            if (this.soundEnabled && this.windAudio && this.windAudio.paused) {
                this.windAudio.play().catch(() => {});
            }
        };

        // Ищем лого и другие элементы, которые могут обновлять страницу
        const logoSelectors = [
            'a[href="/"]',
            'a[href*="index"]',
            '.logo',
            '[class*="logo"]',
            '[id*="logo"]',
            'a[href="/forum"]',
            'header a',
            '.header a',
            '[data-nav]'
        ];

        logoSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Проверяем, что это действительно лого или навигация
                    if (el.querySelector('img') || el.textContent.trim().length < 50) {
                        el.addEventListener('click', playWindOnInteraction, { passive: true });
                    }
                });
            } catch (e) {}
        });
    }

    // Сохранение позиции звука вьюги
    saveWindAudioTime() {
        if (this.windAudio && !this.windAudio.paused && !isNaN(this.windAudio.currentTime)) {
            try {
                // Проверяем, не дошли ли до конца (осталось меньше 1 секунды)
                // Если да, сбрасываем на 0 для следующего цикла
                const timeToSave = (this.windAudio.duration &&
                                   this.windAudio.duration - this.windAudio.currentTime < 1)
                                   ? 0
                                   : this.windAudio.currentTime;
                localStorage.setItem('snowThemeWindAudioTime', timeToSave.toString());
            } catch (e) {
                console.log('Не удалось сохранить позицию звука:', e);
            }
        }
    }

    // Загрузка сохраненной позиции звука
    loadWindAudioTime() {
        try {
            const saved = localStorage.getItem('snowThemeWindAudioTime');
            if (saved) {
                const time = parseFloat(saved);
                return isNaN(time) ? null : time;
            }
        } catch (e) {
            console.log('Не удалось загрузить позицию звука:', e);
        }
        return null;
    }

    // Запуск периодического сохранения позиции звука
    startSavingWindAudioTime() {
        // Очищаем предыдущий интервал если есть
        if (this.windAudioSaveInterval) {
            clearInterval(this.windAudioSaveInterval);
        }

        // Сохраняем позицию каждые 5 секунд
        this.windAudioSaveInterval = setInterval(() => {
            this.saveWindAudioTime();
        }, 5000);
    }

    // Остановка сохранения позиции звука
    stopSavingWindAudioTime() {
        if (this.windAudioSaveInterval) {
            clearInterval(this.windAudioSaveInterval);
            this.windAudioSaveInterval = null;
        }
    }

    createSettingsPanel() {
        // Кнопка открытия настроек
        this.settingsButton = document.createElement('button');
        this.settingsButton.className = 'snow-settings-button';
        this.settingsButton.innerHTML = '⚙️';
        this.settingsButton.setAttribute('aria-label', 'Настройки');
        this.settingsButton.title = 'Настройки новогоднего вайба';
        document.body.appendChild(this.settingsButton);

        // Панель настроек
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.className = 'snow-settings-panel';
        this.settingsPanel.innerHTML = `
            <h3>❄️ Настройки</h3>

            <div class="snow-settings-group">
                <label>
                    <span class="setting-label">Снежинки</span>
                    <input type="checkbox" id="snow-enable-snowflakes" ${this.options.enableSnowflakes ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Количество: <span class="range-value" id="snow-count-value">${this.options.snowflakeCount}</span></span>
                </label>
                <input type="range" id="snow-count" min="0" max="100" value="${this.options.snowflakeCount}">
                <label>
                    <span class="setting-label">Снежинки поверх контента</span>
                    <input type="checkbox" id="snow-on-top" ${this.options.snowflakesOnTop ? 'checked' : ''}>
                </label>
            </div>

            <div class="snow-settings-group">
                <label>
                    <span class="setting-label">Звуки</span>
                    <input type="checkbox" id="snow-enable-sound" ${this.options.enableSound ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Звук вьюги</span>
                    <input type="checkbox" id="snow-enable-wind" ${this.options.enableWindSound ? 'checked' : ''}>
                </label>
                <input type="text" id="snow-wind-url" placeholder="URL на wind.mp3" value="${this.options.windSoundUrl || ''}">
                <label>
                    <span class="setting-label">Звук при клике</span>
                    <input type="checkbox" id="snow-enable-click" ${this.options.enableClickSound ? 'checked' : ''}>
                </label>
                <input type="text" id="snow-click-url" placeholder="URL на click.mp3" value="${this.options.clickSoundUrl || ''}">
                <label>
                    <span class="setting-label">Звук при наведении</span>
                    <input type="checkbox" id="snow-enable-hover" ${this.options.enableHoverSound ? 'checked' : ''}>
                </label>
                <input type="text" id="snow-hover-url" placeholder="URL на hover.mp3" value="${this.options.hoverSoundUrl || ''}">
            </div>

            <div class="snow-settings-group">
                <label>
                    <span class="setting-label">Фон (видео/изображение)</span>
                    <input type="checkbox" id="snow-enable-video" ${this.options.enableVideoBackground ? 'checked' : ''}>
                </label>
                <input type="text" id="snow-video-url" placeholder="URL на фон (.mp4, .webm, .jpg, .png, .webp, .gif)" value="${this.options.videoBackgroundUrl || ''}">
                <label>
                    <span class="setting-label">Затемнение: <span class="range-value" id="snow-video-opacity-value">${Math.round(this.options.videoBackgroundOpacity * 100)}%</span></span>
                </label>
                <input type="range" id="snow-video-opacity" min="0" max="100" value="${Math.round(this.options.videoBackgroundOpacity * 100)}">
                <label>
                    <span class="setting-label">Растяжение по всему экрану</span>
                    <input type="checkbox" id="snow-video-fit-cover" ${this.options.videoBackgroundFitCover ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Масштаб: <span class="range-value" id="snow-zoom-value">${Math.round(this.backgroundScale * 100)}%</span></span>
                </label>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                    <button type="button" id="snow-zoom-out" class="snow-zoom-control-btn" style="width: 35px; height: 35px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: #D6D6D6; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">−</button>
                    <input type="range" id="snow-zoom-range" min="30" max="300" value="${Math.round(this.backgroundScale * 100)}" style="flex: 1;">
                    <button type="button" id="snow-zoom-in" class="snow-zoom-control-btn" style="width: 35px; height: 35px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: #D6D6D6; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">+</button>
                </div>
            </div>

            <div class="snow-settings-group">
                <label>
                    <span class="setting-label">Фоновые эффекты</span>
                    <input type="checkbox" id="snow-enable-bg" ${this.options.enableBackgroundEffects ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Снежинки при клике</span>
                    <input type="checkbox" id="snow-enable-click-snowflakes" ${this.options.enableClickSnowflakes ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Гирлянда</span>
                    <input type="checkbox" id="snow-enable-garland" ${this.options.enableGarland ? 'checked' : ''}>
                </label>
                <label>
                    <span class="setting-label">Конструктор ёлочки</span>
                    <input type="checkbox" id="snow-enable-tree-constructor" ${this.options.enableTreeConstructor ? 'checked' : ''}>
                </label>
            </div>

            <div class="snow-settings-group" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; margin-top: 10px;">
                <button id="snow-reset-defaults">
                    🔄 Сбросить настройки по умолчанию
                </button>
            </div>

            <div class="snow-settings-footer">
                <span>Made By Cartier <3</span>
            </div>
        `;
        document.body.appendChild(this.settingsPanel);

        // Обработчики событий
        this.settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.settingsPanel.classList.toggle('open');
        });

        // Закрытие при клике вне панели
        document.addEventListener('click', (e) => {
            if (this.settingsPanel.classList.contains('open') &&
                !this.settingsPanel.contains(e.target) &&
                !this.settingsButton.contains(e.target)) {
                this.settingsPanel.classList.remove('open');
            }
        });

        // Обработчики настроек
        this.setupSettingsHandlers();
    }

    setupSettingsHandlers() {
        // Снежинки
        const enableSnowflakes = document.getElementById('snow-enable-snowflakes');
        enableSnowflakes.addEventListener('change', (e) => {
            this.options.enableSnowflakes = e.target.checked;
            if (e.target.checked) {
                this.createSnowflakes();
            } else {
                this.snowflakes.forEach(sf => sf.remove());
                this.snowflakes = [];
            }
            this.saveSettings();
        });

        const snowCount = document.getElementById('snow-count');
        const snowCountValue = document.getElementById('snow-count-value');
        snowCount.addEventListener('input', (e) => {
            this.options.snowflakeCount = parseInt(e.target.value);
            snowCountValue.textContent = e.target.value;
            if (this.options.enableSnowflakes) {
                this.createSnowflakes();
            }
            this.saveSettings();
        });

        // Переключатель z-index снежинок
        const snowOnTop = document.getElementById('snow-on-top');
        snowOnTop.addEventListener('change', (e) => {
            this.options.snowflakesOnTop = e.target.checked;
            this.updateSnowflakesZIndex();
            this.saveSettings();
        });

        // Звуки
        const enableSound = document.getElementById('snow-enable-sound');
        enableSound.addEventListener('change', (e) => {
            this.options.enableSound = e.target.checked;
            this.soundEnabled = e.target.checked;
            if (!e.target.checked) {
                if (this.windAudio) {
                    this.saveWindAudioTime();
                    this.windAudio.pause();
                }
            } else {
                // Пересоздаем звуки если они включены
                this.initAudio();
            }
            this.saveSettings();
        });

        const enableWind = document.getElementById('snow-enable-wind');
        const windUrl = document.getElementById('snow-wind-url');
        enableWind.addEventListener('change', (e) => {
            this.options.enableWindSound = e.target.checked;
            if (e.target.checked && this.soundEnabled && this.options.windSoundUrl) {
                if (!this.windAudio || this.windAudio.src !== this.options.windSoundUrl) {
                    this.windAudio = new Audio(this.options.windSoundUrl);
                    this.windAudio.loop = true;
                    this.windAudio.volume = this.options.windVolume;
                    this.tryPlayWind();
                } else {
                    this.windAudio.play().catch(() => {});
                }
            } else if (this.windAudio) {
                this.saveWindAudioTime();
                this.windAudio.pause();
            }
            this.saveSettings();
        });
        windUrl.addEventListener('change', (e) => {
            this.options.windSoundUrl = e.target.value.trim();
            if (this.windAudio) {
                this.saveWindAudioTime();
                this.windAudio.pause();
                this.windAudio = null;
            }
            if (this.options.enableWindSound && this.options.windSoundUrl && this.soundEnabled) {
                this.windAudio = new Audio(this.options.windSoundUrl);
                this.windAudio.loop = true;
                this.windAudio.volume = this.options.windVolume;

                // Восстанавливаем сохраненную позицию
                const savedTime = this.loadWindAudioTime();
                if (savedTime !== null && savedTime > 0) {
                    this.windAudio.addEventListener('loadedmetadata', () => {
                        if (savedTime < this.windAudio.duration) {
                            this.windAudio.currentTime = savedTime;
                        }
                    }, { once: true });
                }

                this.startSavingWindAudioTime();
                this.tryPlayWind();
            }
            this.saveSettings();
        });

        const enableClick = document.getElementById('snow-enable-click');
        const clickUrl = document.getElementById('snow-click-url');
        enableClick.addEventListener('change', (e) => {
            this.options.enableClickSound = e.target.checked;
            if (e.target.checked && this.options.clickSoundUrl) {
                if (!this.clickAudio || this.clickAudio.src !== this.options.clickSoundUrl) {
                    this.clickAudio = new Audio(this.options.clickSoundUrl);
                    this.clickAudio.volume = this.options.clickVolume;
                }
            } else {
                this.clickAudio = null;
            }
            this.saveSettings();
        });
        clickUrl.addEventListener('change', (e) => {
            this.options.clickSoundUrl = e.target.value.trim();
            if (this.clickAudio) {
                this.clickAudio = null;
            }
            if (this.options.enableClickSound && this.options.clickSoundUrl) {
                this.clickAudio = new Audio(this.options.clickSoundUrl);
                this.clickAudio.volume = this.options.clickVolume;
            }
            this.saveSettings();
        });

        const enableHover = document.getElementById('snow-enable-hover');
        const hoverUrl = document.getElementById('snow-hover-url');
        enableHover.addEventListener('change', (e) => {
            this.options.enableHoverSound = e.target.checked;
            if (e.target.checked && this.options.hoverSoundUrl) {
                if (!this.hoverAudio || this.hoverAudio.src !== this.options.hoverSoundUrl) {
                    this.hoverAudio = new Audio(this.options.hoverSoundUrl);
                    this.hoverAudio.volume = this.options.hoverVolume;
                }
            } else {
                this.hoverAudio = null;
            }
            this.saveSettings();
        });
        hoverUrl.addEventListener('change', (e) => {
            this.options.hoverSoundUrl = e.target.value.trim();
            if (this.hoverAudio) {
                this.hoverAudio = null;
            }
            if (this.options.enableHoverSound && this.options.hoverSoundUrl) {
                this.hoverAudio = new Audio(this.options.hoverSoundUrl);
                this.hoverAudio.volume = this.options.hoverVolume;
            }
            this.saveSettings();
        });

        // Видео фон
        const enableVideo = document.getElementById('snow-enable-video');
        const videoUrl = document.getElementById('snow-video-url');
        enableVideo.addEventListener('change', (e) => {
            this.options.enableVideoBackground = e.target.checked;
            if (e.target.checked && this.options.videoBackgroundUrl) {
                if (!this.videoBackground) {
                    this.createVideoBackground();
                } else {
                    this.videoBackground.style.display = 'block';
                    this.updateVideoOpacity();
                    this.updateVideoBackgroundFit();
                    if (this.isVideoBackground()) {
                        this.videoBackground.play().catch(() => {});
                    }
                }
            } else if (this.videoBackground) {
                this.videoBackground.style.display = 'none';
                if (this.isVideoBackground()) {
                    this.videoBackground.pause();
                }
            }
            this.updateZoomControlsVisibility();
            this.saveSettings();
        });
        videoUrl.addEventListener('change', (e) => {
            this.options.videoBackgroundUrl = e.target.value.trim();
            if (this.videoBackground) {
                if (this.isVideoBackground()) {
                    this.videoBackground.pause();
                }
                this.videoBackground.remove();
                this.videoBackground = null;
            }
            if (this.options.enableVideoBackground && this.options.videoBackgroundUrl) {
                this.createVideoBackground();
            }
            this.updateZoomControlsVisibility();
            this.saveSettings();
        });

        // Ползунок затемнения видео
        const videoOpacity = document.getElementById('snow-video-opacity');
        const videoOpacityValue = document.getElementById('snow-video-opacity-value');
        videoOpacity.addEventListener('input', (e) => {
            this.options.videoBackgroundOpacity = parseInt(e.target.value) / 100;
            videoOpacityValue.textContent = e.target.value + '%';
            this.updateVideoOpacity();
            this.saveSettings();
        });

        // Переключатель растяжения фона
        const videoFitCover = document.getElementById('snow-video-fit-cover');
        videoFitCover.addEventListener('change', (e) => {
            this.options.videoBackgroundFitCover = e.target.checked;
            this.updateVideoBackgroundFit();
            this.saveSettings();
        });

        // Элементы масштабирования в панели настроек
        const zoomInBtn = document.getElementById('snow-zoom-in');
        const zoomOutBtn = document.getElementById('snow-zoom-out');
        const zoomRange = document.getElementById('snow-zoom-range');
        const zoomValue = document.getElementById('snow-zoom-value');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.zoomIn();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.zoomOut();
            });
        }

        if (zoomRange) {
            zoomRange.addEventListener('input', (e) => {
                this.backgroundScale = parseInt(e.target.value) / 100;
                this.updateBackgroundScale();
                if (zoomValue) {
                    zoomValue.textContent = e.target.value + '%';
                }
                this.updateZoomDisplay();
                this.saveSettings();
            });
        }

        // Фоновые эффекты
        const enableBg = document.getElementById('snow-enable-bg');
        enableBg.addEventListener('change', (e) => {
            this.options.enableBackgroundEffects = e.target.checked;
            const underHeader = document.querySelector('.underHeaderContainer');
            if (underHeader) {
                if (e.target.checked) {
                    underHeader.classList.add('snow-theme-active');
                } else {
                    underHeader.classList.remove('snow-theme-active');
                }
            }
            this.saveSettings();
        });

        // Снежинки при клике
        const enableClickSnowflakes = document.getElementById('snow-enable-click-snowflakes');
        enableClickSnowflakes.addEventListener('change', (e) => {
            this.options.enableClickSnowflakes = e.target.checked;
            this.saveSettings();
        });

        // Гирлянда
        const enableGarland = document.getElementById('snow-enable-garland');
        enableGarland.addEventListener('change', (e) => {
            this.options.enableGarland = e.target.checked;
            if (e.target.checked) {
                this.createGarland();
            } else if (this.garland) {
                this.garland.remove();
                this.garland = null;
            }
            this.saveSettings();
        });

        // Конструктор ёлочки
        const enableTreeConstructor = document.getElementById('snow-enable-tree-constructor');
        enableTreeConstructor.addEventListener('change', (e) => {
            this.options.enableTreeConstructor = e.target.checked;
            if (e.target.checked) {
                this.createTreeConstructor();
            } else {
                this.destroyTreeConstructor();
            }
            this.saveSettings();
        });

        // Кнопка сброса настроек
        const resetButton = document.getElementById('snow-reset-defaults');
        resetButton.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
                this.resetToDefaults();
            }
        });
    }

    resetToDefaults() {
        // Сбрасываем все настройки к значениям из SNOW_CONFIG
        this.options = {
            windSoundUrl: SNOW_CONFIG.URL_WIND_SOUND,
            clickSoundUrl: SNOW_CONFIG.URL_CLICK_SOUND,
            hoverSoundUrl: SNOW_CONFIG.URL_HOVER_SOUND,
            videoBackgroundUrl: SNOW_CONFIG.URL_VIDEO_BACKGROUND,
            snowflakeCount: SNOW_CONFIG.SNOWFLAKE_COUNT,
            minSize: SNOW_CONFIG.SNOWFLAKE_MIN_SIZE,
            maxSize: SNOW_CONFIG.SNOWFLAKE_MAX_SIZE,
            minSpeed: SNOW_CONFIG.SNOWFLAKE_MIN_SPEED,
            maxSpeed: SNOW_CONFIG.SNOWFLAKE_MAX_SPEED,
            windStrength: SNOW_CONFIG.SNOWFLAKE_WIND_STRENGTH,
            enableSound: SNOW_CONFIG.ENABLE_SOUNDS,
            enableWindSound: SNOW_CONFIG.ENABLE_WIND_SOUND,
            enableClickSound: SNOW_CONFIG.ENABLE_CLICK_SOUND,
            enableHoverSound: SNOW_CONFIG.ENABLE_HOVER_SOUND,
            windVolume: SNOW_CONFIG.WIND_VOLUME,
            clickVolume: SNOW_CONFIG.CLICK_VOLUME,
            hoverVolume: SNOW_CONFIG.HOVER_VOLUME,
            enableVideoBackground: SNOW_CONFIG.ENABLE_VIDEO_BACKGROUND,
            videoBackgroundOpacity: SNOW_CONFIG.VIDEO_BACKGROUND_OPACITY,
            videoBackgroundFitCover: SNOW_CONFIG.VIDEO_BACKGROUND_FIT_COVER,
            enableSnowflakes: SNOW_CONFIG.ENABLE_SNOWFLAKES,
            snowflakesOnTop: SNOW_CONFIG.SNOWFLAKES_ON_TOP,
            enableBackgroundEffects: SNOW_CONFIG.ENABLE_BACKGROUND_EFFECTS,
            enableClickSnowflakes: SNOW_CONFIG.ENABLE_CLICK_SNOWFLAKES,
            enableGarland: SNOW_CONFIG.ENABLE_GARLAND,
            enableTreeConstructor: SNOW_CONFIG.ENABLE_TREE_CONSTRUCTOR,
            backgroundScale: 1.0,
        };

        this.backgroundScale = this.options.backgroundScale;

        this.soundEnabled = this.options.enableSound;

        // Обновляем UI
        this.updateSettingsUI();

        // Пересоздаем элементы
        if (this.windAudio) {
            this.saveWindAudioTime();
            this.windAudio.pause();
            this.windAudio = null;
        }
        if (this.clickAudio) {
            this.clickAudio = null;
        }
        if (this.hoverAudio) {
            this.hoverAudio = null;
        }
        if (this.videoBackground) {
            if (this.isVideoBackground()) {
                this.videoBackground.pause();
            }
            this.videoBackground.remove();
            this.videoBackground = null;
        }

        // Пересоздаем снежинки
        if (this.options.enableSnowflakes) {
            this.createSnowflakes();
        } else {
            this.snowflakes.forEach(sf => sf.remove());
            this.snowflakes = [];
        }

        // Применяем z-index снежинок
        this.updateSnowflakesZIndex();

        // Пересоздаем звуки
        this.initAudio();

        // Пересоздаем видео если нужно
        if (this.options.enableVideoBackground) {
            this.createVideoBackground();
        }

        // Применяем затемнение к видео
        this.updateVideoOpacity();

        // Применяем режим растяжения
        this.updateVideoBackgroundFit();

        // Применяем масштаб
        this.updateBackgroundScale();
        this.updateZoomDisplay();
        this.updateZoomControlsVisibility();

        // Пересоздаем гирлянду если нужно
        if (this.options.enableGarland) {
            this.createGarland();
        } else if (this.garland) {
            this.garland.remove();
            this.garland = null;
        }

        // Пересоздаем конструктор ёлочки если нужно
        if (this.options.enableTreeConstructor) {
            this.createTreeConstructor();
        } else {
            this.destroyTreeConstructor();
        }

        // Обновляем классы
        this.addBodyClass();

        // Сохраняем
        this.saveSettings();

        alert('Настройки сброшены к значениям по умолчанию!');
    }

    updateSettingsUI() {
        // Обновляем все элементы формы
        const enableSnowflakes = document.getElementById('snow-enable-snowflakes');
        if (enableSnowflakes) enableSnowflakes.checked = this.options.enableSnowflakes;

        const snowCount = document.getElementById('snow-count');
        const snowCountValue = document.getElementById('snow-count-value');
        if (snowCount) {
            snowCount.value = this.options.snowflakeCount;
            if (snowCountValue) snowCountValue.textContent = this.options.snowflakeCount;
        }

        const snowOnTop = document.getElementById('snow-on-top');
        if (snowOnTop) snowOnTop.checked = this.options.snowflakesOnTop;

        const enableSound = document.getElementById('snow-enable-sound');
        if (enableSound) enableSound.checked = this.options.enableSound;

        const enableWind = document.getElementById('snow-enable-wind');
        if (enableWind) enableWind.checked = this.options.enableWindSound;

        const windUrl = document.getElementById('snow-wind-url');
        if (windUrl) windUrl.value = this.options.windSoundUrl;

        const enableClick = document.getElementById('snow-enable-click');
        if (enableClick) enableClick.checked = this.options.enableClickSound;

        const clickUrl = document.getElementById('snow-click-url');
        if (clickUrl) clickUrl.value = this.options.clickSoundUrl;

        const enableHover = document.getElementById('snow-enable-hover');
        if (enableHover) enableHover.checked = this.options.enableHoverSound;

        const hoverUrl = document.getElementById('snow-hover-url');
        if (hoverUrl) hoverUrl.value = this.options.hoverSoundUrl;

        const enableVideo = document.getElementById('snow-enable-video');
        if (enableVideo) enableVideo.checked = this.options.enableVideoBackground;

        const videoUrl = document.getElementById('snow-video-url');
        if (videoUrl) videoUrl.value = this.options.videoBackgroundUrl;

        const videoOpacity = document.getElementById('snow-video-opacity');
        const videoOpacityValue = document.getElementById('snow-video-opacity-value');
        if (videoOpacity) {
            videoOpacity.value = Math.round(this.options.videoBackgroundOpacity * 100);
            if (videoOpacityValue) videoOpacityValue.textContent = Math.round(this.options.videoBackgroundOpacity * 100) + '%';
        }

        const videoFitCover = document.getElementById('snow-video-fit-cover');
        if (videoFitCover) videoFitCover.checked = this.options.videoBackgroundFitCover;

        const zoomValue = document.getElementById('snow-zoom-value');
        const zoomRange = document.getElementById('snow-zoom-range');
        if (zoomValue) {
            zoomValue.textContent = `${Math.round(this.backgroundScale * 100)}%`;
        }
        if (zoomRange) {
            zoomRange.value = Math.round(this.backgroundScale * 100);
        }

        const enableBg = document.getElementById('snow-enable-bg');
        if (enableBg) enableBg.checked = this.options.enableBackgroundEffects;

        const enableClickSnowflakes = document.getElementById('snow-enable-click-snowflakes');
        if (enableClickSnowflakes) enableClickSnowflakes.checked = this.options.enableClickSnowflakes;

        const enableGarland = document.getElementById('snow-enable-garland');
        if (enableGarland) enableGarland.checked = this.options.enableGarland;

        const enableTreeConstructor = document.getElementById('snow-enable-tree-constructor');
        if (enableTreeConstructor) enableTreeConstructor.checked = this.options.enableTreeConstructor;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;

        if (this.soundEnabled) {
            this.soundToggle.classList.remove('muted');
            if (this.windAudio) {
                this.windAudio.play().catch(err => {
                    console.log('Не удалось воспроизвести звук:', err);
                });
            }
        } else {
            this.soundToggle.classList.add('muted');
            if (this.windAudio) {
                this.saveWindAudioTime();
                this.windAudio.pause();
            }
        }
    }

    attachEventListeners() {
        // Звук и снежинки при клике
        document.addEventListener('click', (e) => {
            // Игнорируем клики по панели настроек
            if (e.target === this.settingsButton || this.settingsPanel.contains(e.target)) {
                return;
            }

            // Звук при клике
            if (this.soundEnabled && this.options.enableClickSound && this.clickAudio) {
                this.clickAudio.currentTime = 0;
                this.clickAudio.play().catch(() => {});
            }

            // Создаем снежинки в месте клика (если включено)
            if (this.options.enableClickSnowflakes) {
                this.createClickSnowflakes(e.clientX, e.clientY);
            }
        }, true);

        // Звук при наведении на интерактивные элементы
        const interactiveSelectors = 'a, button, input, select, textarea, [role="button"], [tabindex]';
        document.addEventListener('mouseenter', (e) => {
            const now = Date.now();
            if (this.soundEnabled && this.options.enableHoverSound && this.hoverAudio &&
                e.target.matches(interactiveSelectors) &&
                !this.settingsPanel.contains(e.target) &&
                e.target !== this.settingsButton &&
                now - this.lastHoverTime > this.hoverDebounce) {
                this.lastHoverTime = now;
                this.hoverAudio.currentTime = 0;
                this.hoverAudio.play().catch(() => {});
            }
        }, true);
    }

    addBodyClass() {
        document.body.classList.add('snow-theme-active');

        // Добавляем класс к underHeaderContainer если он есть и эффекты включены
        if (this.options.enableBackgroundEffects) {
            const underHeader = document.querySelector('.underHeaderContainer');
            if (underHeader) {
                underHeader.classList.add('snow-theme-active');
            }
        }
    }


    destroy() {
        this.stopSavingWindAudioTime();

        if (this.windAudio) {
            // Сохраняем позицию перед уничтожением
            this.saveWindAudioTime();
            this.windAudio.pause();
            this.windAudio = null;
        }

        if (this.videoBackground) {
            if (this.isVideoBackground()) {
                this.videoBackground.pause();
            }
            this.videoBackground.remove();
        }

        if (this.garland) {
            this.garland.remove();
        }

        // Удаляем обработчики событий гирлянды
        if (this.garlandScrollHandler) {
            window.removeEventListener('scroll', this.garlandScrollHandler);
            this.garlandScrollHandler = null;
        }
        if (this.garlandResizeHandler) {
            window.removeEventListener('resize', this.garlandResizeHandler);
            this.garlandResizeHandler = null;
        }

        this.destroyTreeConstructor();

        if (this.container) {
            this.container.remove();
        }

        if (this.settingsButton) {
            this.settingsButton.remove();
        }

        if (this.settingsPanel) {
            this.settingsPanel.remove();
        }

        const zoomControls = document.getElementById('snow-zoom-controls');
        if (zoomControls) {
            zoomControls.remove();
        }


        const styleElement = document.getElementById('snow-theme-styles');
        if (styleElement) {
            styleElement.remove();
        }

        document.body.classList.remove('snow-theme-active');

        // Удаляем класс с underHeaderContainer
        const underHeader = document.querySelector('.underHeaderContainer');
        if (underHeader) {
            underHeader.classList.remove('snow-theme-active');
        }

        this.stylesInjected = false;
    }
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.snowTheme = new SnowTheme();
    });
} else {
    window.snowTheme = new SnowTheme();
}

// Экспорт для использования в модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnowTheme;
}

})();

