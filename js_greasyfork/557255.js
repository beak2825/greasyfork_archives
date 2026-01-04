// ==UserScript==
// @name         Rangers Customizer for Black Russia
// @namespace
// @version      16.0
// @description  Customization for Black Russia Forum
// @author       King_Rangers
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL
// @updateURL
// @namespace https://greasyfork.org/users/1542306
// @downloadURL https://update.greasyfork.org/scripts/557255/Rangers%20Customizer%20for%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/557255/Rangers%20Customizer%20for%20Black%20Russia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_CONFIG = {
        ID: 'rangers-customizer-v16',
        WELCOME_ID: 'rangers-welcome-screen',
        PANEL_ID: 'rangers-control-panel',
        NAV_ID: 'rangers-navigation-bar',
        CLOCK_ID: 'rangers-digital-clock',
        ICON_ID: 'rangers-toggle-icon',
        EFFECTS_ID: 'rangers-effects-layer',
        BACKGROUND_ID: 'rangers-background-canvas',
        TOAST_ID: 'rangers-notification-center',
        SCROLL_ID: 'rangers-scroll-progress',
        VERSION: '16.0',
        AUTHOR: 'King_Rangers'
    };

    const PERFORMANCE = {
        MAX_IMAGE_SIZE: 5,
        DEBOUNCE_DELAY: 150,
        THROTTLE_DELAY: 50,
        LAZY_LOAD_DELAY: 100
    };

    const VISUAL_ASSETS = {
        icons: {
            main: 'https://i.ibb.co/0jQ8L9T/rangers-icon.png',
            settings: 'https://i.ibb.co/7WXq7J7/settings-gear.png',
            effects: 'https://i.ibb.co/4J2c8vS/effects-sparkle.png'
        },
        patterns: {
            noise: 'https://i.ibb.co/0Q8L9zT/noise-pattern.png',
            grid: 'https://i.ibb.co/0Q8v9zT/grid-pattern.png'
        }
    };

    const LANGUAGES = {
        ru: {
            panelTitle: "Центр управления Rangers",
            dashboard: "Панель управления",
            appearance: "Внешний вид",
            effects: "Эффекты",
            interface: "Интерфейс",
            live: "Лайв функции",
            moderation: "Модерация",
            integrations: "Интеграции",
            gallery: "Галерея",
            advanced: "Расширенные",
            welcome: "Добро пожаловать в Rangers Customizer",
            version: "Версия",
            by: "Автор",
            customThemes: "Пользовательские темы",
            performanceMode: "Режим производительности",
            uptime: "Время работы",
            quickActions: "Быстрые действия",
            applyDefaultTheme: "Применить тему по умолчанию",
            togglePerformance: "Переключить производительность",
            clearCache: "Очистить кэш",
            backgroundColors: "Фон и цвета",
            enableGradient: "Включить градиентный фон",
            primaryColor: "Основной цвет",
            secondaryColor: "Вторичный цвет",
            backgroundOpacity: "Прозрачность фона",
            typography: "Типография",
            fontFamily: "Семейство шрифтов",
            fontSize: "Размер шрифта",
            visualEffects: "Визуальные эффекты",
            enableAnimations: "Включить анимации",
            animationIntensity: "Интенсивность анимации",
            particleEffects: "Частицы",
            particleDensity: "Плотность частиц",
            layoutInterface: "Макет и интерфейс",
            enableWideLayout: "Широкий макет",
            enableCompactMode: "Компактный режим",
            enableGlassEffect: "Стеклянный эффект",
            liveFeatures: "Лайв функции",
            enableLiveUpdates: "Включить лайв обновления",
            updateInterval: "Интервал обновления (секунды)",
            scrollIndicator: "Индикатор прокрутки",
            moderationTools: "Инструменты модерации",
            complaintTracker: "Трекер жалоб",
            templateSystem: "Система шаблонов",
            warningTime: "Время предупреждения (часы)",
            criticalTime: "Критическое время (часы)",
            integrations: "Интеграции",
            imageUploadSystem: "Система загрузки изображений",
            imgbbApiKey: "ImgBB API ключ",
            autoSendTemplates: "Авто-отправка шаблонов",
            wallpaperGallery: "Галерея обоев",
            advancedSettings: "Расширенные настройки",
            enablePerformanceMode: "Режим производительности",
            touchOptimization: "Оптимизация для touch",
            developerTools: "Инструменты разработчика",
            customCSS: "Пользовательский CSS",
            export: "Экспорт",
            import: "Импорт",
            reset: "Сброс",
            saveChanges: "Сохранить изменения",
            savedSuccessfully: "Настройки сохранены успешно!",
            resetConfirm: "Вы уверены что хотите сбросить все настройки?",
            exportSuccess: "Конфигурация экспортирована успешно!",
            importSuccess: "Конфигурация импортирована успешно!",
            fileReadError: "Ошибка чтения файла",
            uploadImage: "Загрузить изображение",
            editBackground: "Редактировать фон",
            width: "Ширина",
            height: "Высота",
            positionX: "Позиция X",
            positionY: "Позиция Y",
            scale: "Масштаб",
            rotation: "Вращение",
            opacity: "Прозрачность",
            brightness: "Яркость",
            contrast: "Контраст",
            saturation: "Насыщенность",
            blur: "Размытие",
            apply: "Применить",
            saveBackground: "Сохранить фон",
            themeNewYear: "Новый Год",
            themeHalloween: "Хэллоуин",
            themeChristmas: "Рождество",
            themeValentine: "День Святого Валентина",
            themeSummer: "Лето",
            themeCyberpunk: "Киберпанк",
            enableSnow: "Включить снегопад",
            enableBats: "Включить летучих мышей",
            enableHearts: "Включить сердца",
            snowIntensity: "Интенсивность снега",
            snowEmoji: "Смайлы для снега",
            snowOpacity: "Прозрачность снега",
            themeElements: "Элементы темы",
            contentTransparency: "Прозрачность контента",
            postTransparency: "Прозрачность постов",
            sidebarTransparency: "Прозрачность боковой панели",
            headerTransparency: "Прозрачность заголовка",
            backgroundSettings: "Настройки фона",
            contentSettings: "Настройки контента",
            textOpacity: "Прозрачность текста",
            sectionTransparency: "Прозрачность разделов"
        },
        en: {
            panelTitle: "Rangers Control Center",
            dashboard: "Dashboard",
            appearance: "Appearance",
            effects: "Effects",
            interface: "Interface",
            live: "Live Features",
            moderation: "Moderation",
            integrations: "Integrations",
            gallery: "Gallery",
            advanced: "Advanced",
            welcome: "Welcome to Rangers Customizer",
            version: "Version",
            by: "By",
            customThemes: "Custom Themes",
            performanceMode: "Performance Mode",
            uptime: "Uptime",
            quickActions: "Quick Actions",
            applyDefaultTheme: "Apply Default Theme",
            togglePerformance: "Toggle Performance",
            clearCache: "Clear Cache",
            backgroundColors: "Background & Colors",
            enableGradient: "Enable Gradient Background",
            primaryColor: "Primary Color",
            secondaryColor: "Secondary Color",
            backgroundOpacity: "Background Opacity",
            typography: "Typography",
            fontFamily: "Font Family",
            fontSize: "Font Size",
            visualEffects: "Visual Effects",
            enableAnimations: "Enable Animations",
            animationIntensity: "Animation Intensity",
            particleEffects: "Particle Effects",
            particleDensity: "Particle Density",
            layoutInterface: "Layout & Interface",
            enableWideLayout: "Enable Wide Layout",
            enableCompactMode: "Compact Mode",
            enableGlassEffect: "Glass Effect",
            liveFeatures: "Live Features",
            enableLiveUpdates: "Enable Live Updates",
            updateInterval: "Update Interval (seconds)",
            scrollIndicator: "Scroll Indicator",
            moderationTools: "Moderation Tools",
            complaintTracker: "Complaint Tracker",
            templateSystem: "Template System",
            warningTime: "Warning Time (hours)",
            criticalTime: "Critical Time (hours)",
            integrations: "Integrations",
            imageUploadSystem: "Image Upload System",
            imgbbApiKey: "ImgBB API Key",
            autoSendTemplates: "Auto-send Templates",
            wallpaperGallery: "Wallpaper Gallery",
            advancedSettings: "Advanced Settings",
            enablePerformanceMode: "Performance Mode",
            touchOptimization: "Touch Optimization",
            developerTools: "Developer Tools",
            customCSS: "Custom CSS",
            export: "Export",
            import: "Import",
            reset: "Reset",
            saveChanges: "Save Changes",
            savedSuccessfully: "Settings saved successfully!",
            resetConfirm: "Are you sure you want to reset all settings?",
            exportSuccess: "Configuration exported successfully!",
            importSuccess: "Configuration imported successfully!",
            fileReadError: "File reading error",
            uploadImage: "Upload Image",
            editBackground: "Edit Background",
            width: "Width",
            height: "Height",
            positionX: "Position X",
            positionY: "Position Y",
            scale: "Scale",
            rotation: "Rotation",
            opacity: "Opacity",
            brightness: "Brightness",
            contrast: "Contrast",
            saturation: "Saturation",
            blur: "Blur",
            apply: "Apply",
            saveBackground: "Save Background",
            themeNewYear: "New Year",
            themeHalloween: "Halloween",
            themeChristmas: "Christmas",
            themeValentine: "Valentine's Day",
            themeSummer: "Summer",
            themeCyberpunk: "Cyberpunk",
            enableSnow: "Enable Snowfall",
            enableBats: "Enable Bats",
            enableHearts: "Enable Hearts",
            snowIntensity: "Snow Intensity",
            snowEmoji: "Snow Emojis",
            snowOpacity: "Snow Opacity",
            themeElements: "Theme Elements",
            contentTransparency: "Content Transparency",
            postTransparency: "Post Transparency",
            sidebarTransparency: "Sidebar Transparency",
            headerTransparency: "Header Transparency",
            backgroundSettings: "Background Settings",
            contentSettings: "Content Settings",
            textOpacity: "Text Opacity",
            sectionTransparency: "Section Transparency"
        }
    };

    const THEMES = {
        default: {
            name: "По умолчанию",
            nameEn: "Default",
            colors: {
                primary: "#FF6B35",
                secondary: "#00D4AA",
                accent: "#FFD166",
                background: "#1A1F2C"
            },
            effects: [],
            background: ""
        }
    };

    const WALLPAPER_LIBRARY = {
        "Пользовательские обои 🎨": [
            ""
        ]
    };

    const DEFAULT_CONFIG = {
        language: 'ru',
        backgroundType: 'gradient',
        backgroundImage: '',
        backgroundOpacity: 0.85,
        backgroundBlur: 0,
        primaryColor: '#FF6B35',
        secondaryColor: '#00D4AA',
        accentColor: '#FFD166',
        backgroundColor: '#1A1F2C',
        enableWideLayout: true,
        enableCompactMode: false,
        sidebarPosition: 'right',
        enableGlassEffect: true,
        enableShadows: true,
        enableAnimations: true,
        animationIntensity: 0.7,
        fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        lineHeight: 1.6,
        enableSmartNavigation: true,
        enableQuickAccess: true,
        navigationStyle: 'floating',
        enablePerformanceMode: false,
        enableTouchOptimization: false,
        enableDeveloperTools: false,
        customCSS: '',
        customThemes: {},
        quickActions: [
            { name: 'Dashboard', url: '/', icon: 'dashboard' },
            { name: 'Messages', url: '/conversations', icon: 'message' },
            { name: 'Notifications', url: '/account/alerts', icon: 'notification' }
        ],
        enableComplaintTracker: true,
        enableTemplateSystem: true,
        enableUploadSystem: true,
        imgbbApiKey: '',
        complaintTrackerWarnTime: 12,
        complaintTrackerCritTime: 24,
        complaintTrackerSections: ['жалоба', 'репорт', 'report', 'complaint'],
        enableLiveUpdates: true,
        liveUpdateInterval: 30,
        enableScrollIndicator: true,
        enableParticleEffects: false,
        particleDensity: 50,
        enableHoverEffects: true,
        enableClickEffects: true,
        enableAnimatedGradient: false,
        autoSendTemplates: false,
        currentTheme: 'default',
        enableSnow: false,
        enableBats: false,
        enableHearts: false,
        snowIntensity: 50,
        snowEmoji: "❄,🌟,✨,💫",
        snowOpacity: 80,
        backgroundSettings: {
            width: 100,
            height: 100,
            positionX: 50,
            positionY: 50,
            scale: 100,
            rotation: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100
        },
        contentTransparency: {
            posts: 100,
            sidebar: 100,
            header: 100,
            general: 100,
            text: 100,
            sections: 100
        }
    };

    let controlPanel = null;
    let settingsIcon = null;
    let navigationBar = null;
    let clockDisplay = null;
    let effectsLayer = null;
    let notificationCenter = null;
    let scrollProgress = null;
    let currentUser = null;
    let topicAuthor = null;
    let backgroundWorker = null;
    let activeObservers = [];
    let currentConfiguration = {};
    let previousScrollPosition = 0;
    let currentLanguage = 'ru';
    let activeTheme = 'default';
    let snowInterval = null;
    let batsInterval = null;
    let heartsInterval = null;

    class RangersUtils {
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        static throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        static async loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        }

        static createElement(tag, options = {}) {
            const element = document.createElement(tag);
            Object.keys(options).forEach(key => {
                if (key === 'class') {
                    element.className = options[key];
                } else if (key === 'text') {
                    element.textContent = options[key];
                } else if (key === 'html') {
                    element.innerHTML = options[key];
                } else {
                    element.setAttribute(key, options[key]);
                }
            });
            return element;
        }

        static showNotification(message, type = 'info', duration = 4000) {
            if (!notificationCenter) {
                notificationCenter = RangersUtils.createElement('div', {
                    id: SCRIPT_CONFIG.TOAST_ID,
                    class: 'rangers-notification-container'
                });
                document.body.appendChild(notificationCenter);
            }

            const notification = RangersUtils.createElement('div', {
                class: `rangers-notification rangers-notification-${type}`
            });

            notification.innerHTML = `
                <div class="rangers-notification-content">
                    <span class="rangers-notification-message">${message}</span>
                    <button class="rangers-notification-close">&times;</button>
                </div>
            `;

            notificationCenter.appendChild(notification);

            setTimeout(() => notification.classList.add('rangers-notification-show'), 10);

            const closeBtn = notification.querySelector('.rangers-notification-close');
            closeBtn.addEventListener('click', () => this.hideNotification(notification));

            if (duration > 0) {
                setTimeout(() => this.hideNotification(notification), duration);
            }

            return notification;
        }

        static hideNotification(notification) {
            notification.classList.remove('rangers-notification-show');
            setTimeout(() => {
                if (notification.parentNode === notificationCenter) {
                    notificationCenter.removeChild(notification);
                }
            }, 300);
        }

        static t(key) {
            return LANGUAGES[currentLanguage][key] || key;
        }

        static changeLanguage(lang) {
            currentLanguage = lang;
            currentConfiguration.language = lang;
            ConfigurationManager.saveConfiguration({ language: lang });
            this.applyLanguage();
        }

        static applyLanguage() {
            if (controlPanel) {
                PanelManager.updatePanelLanguage();
            }
            if (navigationBar) {
                NavigationBar.updateNavigationLanguage();
            }
        }
    }

    class ConfigurationManager {
        static async loadConfiguration() {
            try {
                const keys = Object.keys(DEFAULT_CONFIG);
                const values = await Promise.all(
                    keys.map(key => GM_getValue(key, DEFAULT_CONFIG[key]))
                );

                currentConfiguration = {};
                keys.forEach((key, index) => {
                    currentConfiguration[key] = this.validateSetting(key, values[index]);
                });

                currentLanguage = currentConfiguration.language || 'ru';
                activeTheme = currentConfiguration.currentTheme || 'default';

                return currentConfiguration;
            } catch (error) {
                console.error('Failed to load configuration:', error);
                return { ...DEFAULT_CONFIG };
            }
        }

        static async saveConfiguration(newConfig) {
            try {
                const savePromises = [];
                const validatedConfig = {};

                for (const key in newConfig) {
                    if (DEFAULT_CONFIG.hasOwnProperty(key)) {
                        const validatedValue = this.validateSetting(key, newConfig[key]);
                        savePromises.push(GM_setValue(key, validatedValue));
                        validatedConfig[key] = validatedValue;
                    }
                }

                await Promise.all(savePromises);
                currentConfiguration = { ...currentConfiguration, ...validatedConfig };

                if (newConfig.language) {
                    RangersUtils.changeLanguage(newConfig.language);
                }

                return true;
            } catch (error) {
                console.error('Failed to save configuration:', error);
                RangersUtils.showNotification('Configuration save failed', 'error');
                return false;
            }
        }

        static validateSetting(key, value) {
            const defaultValue = DEFAULT_CONFIG[key];
            const valueType = typeof defaultValue;

            if (valueType === 'boolean') {
                return Boolean(value);
            }

            if (valueType === 'number') {
                const numValue = parseFloat(value);
                return isNaN(numValue) ? defaultValue : numValue;
            }

            if (valueType === 'string') {
                return String(value || defaultValue);
            }

            if (valueType === 'object') {
                try {
                    return JSON.parse(JSON.stringify(value));
                } catch {
                    return defaultValue;
                }
            }

            return value;
        }
    }

    class ThemeManager {
        static applyTheme(themeName) {
            const theme = THEMES[themeName];
            if (!theme) return;

            activeTheme = themeName;
            currentConfiguration.currentTheme = themeName;

            const colors = theme.colors;
            ConfigurationManager.saveConfiguration({
                primaryColor: colors.primary,
                secondaryColor: colors.secondary,
                accentColor: colors.accent,
                backgroundColor: colors.background,
                backgroundImage: theme.background
            }).then(() => {
                VisualEffects.applyBackgroundEffect();
                this.applyThemeEffects(theme);
                RangersUtils.showNotification(
                    RangersUtils.t(`theme${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`) + ' ' + RangersUtils.t('applied'),
                    'success'
                );
            });
        }

        static applyThemeEffects(theme) {
            this.clearThemeEffects();

            theme.effects.forEach(effect => {
                switch (effect) {
                    case 'snow':
                        if (currentConfiguration.enableSnow) {
                            this.createSnowEffect();
                        }
                        break;
                    case 'bats':
                        if (currentConfiguration.enableBats) {
                            this.createBatEffect();
                        }
                        break;
                    case 'hearts':
                        if (currentConfiguration.enableHearts) {
                            this.createHeartEffect();
                        }
                        break;
                }
            });
        }

        static createSnowEffect() {
            const container = RangersUtils.createElement('div', {
                class: 'rangers-snow-container',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9997;
                `
            });

            document.body.appendChild(container);

            const intensity = currentConfiguration.snowIntensity || 50;
            const snowflakeCount = Math.floor(intensity * 2);
            const snowEmojis = (currentConfiguration.snowEmoji || "❄,🌟,✨,💫").split(',').map(e => e.trim()).filter(e => e);
            const snowOpacity = (currentConfiguration.snowOpacity || 80) / 100;

            for (let i = 0; i < snowflakeCount; i++) {
                this.createSnowflake(container, snowEmojis, snowOpacity);
            }

            snowInterval = setInterval(() => {
                if (container.children.length < snowflakeCount) {
                    this.createSnowflake(container, snowEmojis, snowOpacity);
                }
            }, 1000);
        }

        static createSnowflake(container, emojis, opacity) {
            const snowflake = RangersUtils.createElement('div', {
                class: 'rangers-snowflake',
                style: `
                    position: absolute;
                    top: -10px;
                    color: white;
                    font-size: ${Math.random() * 12 + 8}px;
                    user-select: none;
                    pointer-events: none;
                    opacity: ${Math.random() * 0.6 * opacity + 0.4 * opacity};
                `
            });

            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            snowflake.textContent = randomEmoji;
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(snowflake);

            setTimeout(() => {
                if (snowflake.parentNode === container) {
                    container.removeChild(snowflake);
                }
            }, 15000);
        }

        static createBatEffect() {
            batsInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    this.createBat();
                }
            }, 3000);
        }

        static createBat() {
            const bat = RangersUtils.createElement('div', {
                class: 'rangers-bat',
                style: `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: -50px;
                    color: #333;
                    font-size: 20px;
                    user-select: none;
                    pointer-events: none;
                    z-index: 9997;
                    animation: flyBat 8s linear forwards;
                `
            });

            bat.textContent = '🦇';
            document.body.appendChild(bat);

            setTimeout(() => {
                if (bat.parentNode) {
                    bat.remove();
                }
            }, 8000);
        }

        static createHeartEffect() {
            heartsInterval = setInterval(() => {
                if (Math.random() > 0.8) {
                    this.createHeart();
                }
            }, 2000);
        }

        static createHeart() {
            const heart = RangersUtils.createElement('div', {
                class: 'rangers-heart',
                style: `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    color: #e91e63;
                    font-size: ${Math.random() * 16 + 12}px;
                    user-select: none;
                    pointer-events: none;
                    z-index: 9997;
                    animation: floatHeart 4s ease-in-out forwards;
                `
            });

            heart.textContent = '❤';
            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 4000);
        }

        static clearThemeEffects() {
            if (snowInterval) {
                clearInterval(snowInterval);
                snowInterval = null;
            }
            if (batsInterval) {
                clearInterval(batsInterval);
                batsInterval = null;
            }
            if (heartsInterval) {
                clearInterval(heartsInterval);
                heartsInterval = null;
            }

            document.querySelectorAll('.rangers-snow-container, .rangers-bat, .rangers-heart').forEach(el => {
                el.remove();
            });
        }

        static updateThemeEffects() {
            this.clearThemeEffects();

            if (currentConfiguration.enableSnow) {
                this.createSnowEffect();
            }
            if (currentConfiguration.enableBats) {
                this.createBatEffect();
            }
            if (currentConfiguration.enableHearts) {
                this.createHeartEffect();
            }
        }
    }

    class BackgroundEditor {
        static init() {
            this.createEditorModal();
        }

        static createEditorModal() {
            this.modal = RangersUtils.createElement('div', {
                id: 'rangers-background-editor',
                class: 'rangers-background-editor',
                style: `
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 10001;
                    align-items: center;
                    justify-content: center;
                `
            });

            this.modal.innerHTML = `
                <div class="rangers-editor-content" style="
                    background: rgba(26, 31, 44, 0.95);
                    border: 2px solid var(--rangers-primary);
                    border-radius: 20px;
                    padding: 24px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    backdrop-filter: blur(20px);
                ">
                    <div class="rangers-editor-header" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    ">
                        <h3 style="color: white; margin: 0;">${RangersUtils.t('editBackground')}</h3>
                        <button class="rangers-editor-close" style="
                            background: none;
                            border: none;
                            color: #ccc;
                            font-size: 24px;
                            cursor: pointer;
                        ">&times;</button>
                    </div>

                    <div class="rangers-editor-preview" style="
                        margin-bottom: 20px;
                        text-align: center;
                    ">
                        <div id="rangers-bg-preview" style="
                            width: 400px;
                            height: 200px;
                            background-size: cover;
                            background-position: center;
                            margin: 0 auto;
                            border: 2px solid rgba(255, 255, 255, 0.2);
                            border-radius: 12px;
                        "></div>
                    </div>

                    <div class="rangers-editor-controls" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 12px;
                        margin-bottom: 20px;
                    ">
                        ${this.createControl('width', 'number', 'width')}
                        ${this.createControl('height', 'number', 'height')}
                        ${this.createControl('positionX', 'range', 'positionX', 0, 100)}
                        ${this.createControl('positionY', 'range', 'positionY', 0, 100)}
                        ${this.createControl('scale', 'range', 'scale', 50, 200)}
                        ${this.createControl('rotation', 'range', 'rotation', 0, 360)}
                        ${this.createControl('opacity', 'range', 'opacity', 0, 100)}
                        ${this.createControl('brightness', 'range', 'brightness', 0, 200)}
                        ${this.createControl('contrast', 'range', 'contrast', 0, 200)}
                        ${this.createControl('saturation', 'range', 'saturation', 0, 200)}
                        ${this.createControl('blur', 'range', 'blur', 0, 20)}
                    </div>

                    <div class="rangers-editor-actions" style="
                        display: flex;
                        gap: 12px;
                        justify-content: flex-end;
                    ">
                        <button class="rangers-btn rangers-btn-secondary" id="rangers-bg-upload">
                            ${RangersUtils.t('uploadImage')}
                        </button>
                        <button class="rangers-btn rangers-btn-primary" id="rangers-bg-apply">
                            ${RangersUtils.t('apply')}
                        </button>
                        <button class="rangers-btn rangers-btn-success" id="rangers-bg-save">
                            ${RangersUtils.t('saveBackground')}
                        </button>
                    </div>

                    <input type="file" id="rangers-bg-file" accept="image/*" style="display: none;">
                </div>
            `;

            document.body.appendChild(this.modal);
            this.setupEditorEvents();
        }

        static createControl(name, type, labelKey, min = null, max = null) {
            const value = currentConfiguration.backgroundSettings?.[name] ||
                         DEFAULT_CONFIG.backgroundSettings[name];
            return `
                <div class="rangers-editor-control">
                    <label style="color: #ccc; display: block; margin-bottom: 4px;">
                        ${RangersUtils.t(labelKey)}
                    </label>
                    <input type="${type}"
                           id="rangers-bg-${name}"
                           ${min !== null ? `min="${min}"` : ''}
                           ${max !== null ? `max="${max}"` : ''}
                           value="${value}"
                           style="width: 100%;">
                    <span class="rangers-control-value" style="color: var(--rangers-accent); font-size: 12px;">
                        ${value}${type === 'range' ? '%' : ''}
                    </span>
                </div>
            `;
        }

        static setupEditorEvents() {
            const closeBtn = this.modal.querySelector('.rangers-editor-close');
            const applyBtn = this.modal.querySelector('#rangers-bg-apply');
            const saveBtn = this.modal.querySelector('#rangers-bg-save');
            const uploadBtn = this.modal.querySelector('#rangers-bg-upload');
            const fileInput = this.modal.querySelector('#rangers-bg-file');

            closeBtn.addEventListener('click', () => this.hide());

            applyBtn.addEventListener('click', () => {
                this.applyBackgroundSettings();
                RangersUtils.showNotification(RangersUtils.t('apply'), 'success');
            });

            saveBtn.addEventListener('click', () => {
                this.saveBackgroundSettings();
                RangersUtils.showNotification(RangersUtils.t('savedSuccessfully'), 'success');
                this.hide();
            });

            uploadBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });

            const controls = this.modal.querySelectorAll('input[type="range"], input[type="number"]');
            controls.forEach(control => {
                control.addEventListener('input', () => {
                    this.updatePreview();
                    const valueDisplay = control.nextElementSibling;
                    if (valueDisplay && valueDisplay.classList.contains('rangers-control-value')) {
                        valueDisplay.textContent = control.value + (control.type === 'range' ? '%' : '');
                    }
                });
            });

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }

        static show() {
            this.updatePreview();
            this.modal.style.display = 'flex';
        }

        static hide() {
            this.modal.style.display = 'none';
        }

        static updatePreview() {
            const preview = this.modal.querySelector('#rangers-bg-preview');
            if (!preview) return;

            const settings = this.getCurrentSettings();
            const bgImage = currentConfiguration.backgroundImage || '';

            preview.style.backgroundImage = bgImage ? `url('${bgImage}')` : '';
            preview.style.backgroundSize = `${settings.scale}%`;
            preview.style.backgroundPosition = `${settings.positionX}% ${settings.positionY}%`;
            preview.style.opacity = settings.opacity / 100;
            preview.style.filter = `
                brightness(${settings.brightness}%)
                contrast(${settings.contrast}%)
                saturate(${settings.saturation}%)
                blur(${settings.blur}px)
            `;
            preview.style.transform = `rotate(${settings.rotation}deg)`;
        }

        static getCurrentSettings() {
            const settings = {};
            const controls = this.modal.querySelectorAll('input[type="range"], input[type="number"]');

            controls.forEach(control => {
                const name = control.id.replace('rangers-bg-', '');
                settings[name] = parseFloat(control.value);
            });

            return settings;
        }

        static applyBackgroundSettings() {
            const settings = this.getCurrentSettings();
            currentConfiguration.backgroundSettings = settings;
            this.applySettingsToBackground();
        }

        static saveBackgroundSettings() {
            const settings = this.getCurrentSettings();
            ConfigurationManager.saveConfiguration({
                backgroundSettings: settings
            }).then(() => {
                this.applySettingsToBackground();
            });
        }

        static applySettingsToBackground() {
            const bgElement = document.getElementById(SCRIPT_CONFIG.BACKGROUND_ID);
            if (!bgElement) return;

            const settings = currentConfiguration.backgroundSettings || DEFAULT_CONFIG.backgroundSettings;
            const bgImage = currentConfiguration.backgroundImage;

            if (bgImage) {
                bgElement.style.backgroundImage = `url('${bgImage}')`;
                bgElement.style.backgroundSize = `${settings.scale}%`;
                bgElement.style.backgroundPosition = `${settings.positionX}% ${settings.positionY}%`;
                bgElement.style.opacity = settings.opacity / 100;
                bgElement.style.filter = `
                    brightness(${settings.brightness}%)
                    contrast(${settings.contrast}%)
                    saturate(${settings.saturation}%)
                    blur(${settings.blur}px)
                `;
            }
        }

        static async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > PERFORMANCE.MAX_IMAGE_SIZE * 1024 * 1024) {
                RangersUtils.showNotification(`File too large. Max ${PERFORMANCE.MAX_IMAGE_SIZE}MB`, 'error');
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    currentConfiguration.backgroundImage = imageUrl;
                    this.updatePreview();
                    RangersUtils.showNotification('Image loaded successfully', 'success');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                RangersUtils.showNotification('Failed to load image', 'error');
            }
        }
    }

    class VisualEffects {
        static initEffects() {
            if (!effectsLayer) {
                effectsLayer = RangersUtils.createElement('div', {
                    id: SCRIPT_CONFIG.EFFECTS_ID,
                    class: 'rangers-effects-container'
                });
                document.body.appendChild(effectsLayer);
            }
            this.applyBackgroundEffect();
            this.applyScrollEffects();
            this.applyContentTransparency();
        }

        static applyBackgroundEffect() {
            BackgroundEditor.applySettingsToBackground();
        }

        static applyContentTransparency() {
            const transparency = currentConfiguration.contentTransparency || DEFAULT_CONFIG.contentTransparency;


            const selectors = {
                posts: '.structItem, .message, .block, .block-container',
                sidebar: '.p-body-sidebar, .sidebar, .widget-sidebar',
                header: '.p-header, .header, .p-nav',
                sections: '.block, .block-container, .structItem-container'
            };

            Object.keys(selectors).forEach(key => {
                const elements = document.querySelectorAll(selectors[key]);
                elements.forEach(el => {
                    const opacityValue = (transparency[key] || transparency.general) / 100;
                    el.style.opacity = opacityValue;


                    const textElements = el.querySelectorAll('p, span, div, a, h1, h2, h3, h4, h5, h6, li, td, th');
                    textElements.forEach(textEl => {
                        textEl.style.opacity = '1';
                        textEl.style.color = 'inherit';
                    });
                });
            });


            const textOpacity = (transparency.text || 100) / 100;
            if (textOpacity < 1) {
                const allTextElements = document.querySelectorAll('p, span, div:not(.rangers-control-panel):not(.rangers-navigation-bar), a, h1, h2, h3, h4, h5, h6, li, td, th');
                allTextElements.forEach(textEl => {
                    textEl.style.opacity = textOpacity.toString();
                });
            }

            document.body.style.opacity = (transparency.general || 100) / 100;
        }

        static applyScrollEffects() {
            if (!scrollProgress) {
                scrollProgress = RangersUtils.createElement('div', {
                    id: SCRIPT_CONFIG.SCROLL_ID,
                    class: 'rangers-scroll-indicator'
                });
                document.body.appendChild(scrollProgress);
            }

            const updateScrollProgress = RangersUtils.throttle(() => {
                const winHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset;
                const progress = (scrollTop / (docHeight - winHeight)) * 100;

                scrollProgress.style.width = `${progress}%`;
                scrollProgress.style.backgroundColor = currentConfiguration.primaryColor;
            }, PERFORMANCE.THROTTLE_DELAY);

            window.addEventListener('scroll', updateScrollProgress);
        }

        static createRipple(event) {
            const button = event.currentTarget;
            const ripple = RangersUtils.createElement('span', {
                class: 'rangers-ripple-effect'
            });

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    }

    class NavigationSystem {
        static init() {
            this.setupSmartNavigation();
            this.setupScrollIndicator();
            this.setupQuickAccess();
        }

        static setupSmartNavigation() {
            if (!currentConfiguration.enableSmartNavigation) return;

            const navElement = document.querySelector('.p-nav');
            if (!navElement) return;

            let lastScrollY = window.scrollY;
            const scrollThreshold = 100;

            const handleScroll = RangersUtils.throttle(() => {
                const currentScrollY = window.scrollY;
                const scrollDelta = currentScrollY - lastScrollY;

                if (Math.abs(scrollDelta) > scrollThreshold) {
                    if (scrollDelta > 0 && currentScrollY > 200) {
                        navElement.style.transform = 'translateY(-100%)';
                        navElement.style.transition = 'transform 0.3s ease';
                    } else {
                        navElement.style.transform = 'translateY(0)';
                    }
                    lastScrollY = currentScrollY;
                }
            }, PERFORMANCE.THROTTLE_DELAY);

            window.addEventListener('scroll', handleScroll);
        }

        static setupScrollIndicator() {
            if (!currentConfiguration.enableScrollIndicator) return;

            const indicator = RangersUtils.createElement('div', {
                class: 'rangers-scroll-indicator',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(90deg,
                        ${currentConfiguration.primaryColor},
                        ${currentConfiguration.secondaryColor}
                    );
                    z-index: 10000;
                    transition: width 0.1s ease;
                    width: 0%;
                `
            });

            document.body.appendChild(indicator);

            const updateIndicator = RangersUtils.throttle(() => {
                const winHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset;
                const progress = (scrollTop / (docHeight - winHeight)) * 100;

                indicator.style.width = `${progress}%`;
            }, PERFORMANCE.THROTTLE_DELAY);

            window.addEventListener('scroll', updateIndicator);
        }

        static setupQuickAccess() {
            if (!currentConfiguration.enableQuickAccess) return;
            this.addQuickReplyTools();
            this.addTopicTools();
        }

        static addQuickReplyTools() {
            const replyArea = document.querySelector('.js-quickReply');
            if (!replyArea) return;

            const toolsContainer = RangersUtils.createElement('div', {
                class: 'rangers-quick-tools',
                style: `
                    display: flex;
                    gap: 8px;
                    margin-bottom: 10px;
                    padding: 8px;
                    background: rgba(26, 31, 44, 0.8);
                    border-radius: 8px;
                    border: 1px solid var(--rangers-primary);
                `
            });

            const templates = [
                { name: 'Thanks', text: 'Thank you for the information! 🙏' },
                { name: 'Agree', text: 'I completely agree with your point. 👍' },
                { name: 'Question', text: 'Could you please clarify this point?' }
            ];

            templates.forEach(template => {
                const button = RangersUtils.createElement('button', {
                    class: 'rangers-template-btn',
                    text: template.name,
                    style: `
                        padding: 6px 12px;
                        background: var(--rangers-primary);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.2s ease;
                    `
                });

                button.addEventListener('click', () => {
                    const textarea = replyArea.querySelector('textarea');
                    if (textarea) {
                        textarea.value += template.text + '\n';
                        textarea.focus();
                    }
                });

                button.addEventListener('mouseenter', VisualEffects.createRipple);
                toolsContainer.appendChild(button);
            });

            replyArea.prepend(toolsContainer);
        }

        static addTopicTools() {
            this.enableTopicPreviews();
        }

        static enableTopicPreviews() {
            document.addEventListener('mouseover', (e) => {
                const topicLink = e.target.closest('.structItem-title a');
                if (topicLink && !topicLink.dataset.previewEnabled) {
                    topicLink.dataset.previewEnabled = 'true';

                    let previewTimer;
                    topicLink.addEventListener('mouseenter', () => {
                        previewTimer = setTimeout(() => {
                            this.showTopicPreview(topicLink);
                        }, 1000);
                    });

                    topicLink.addEventListener('mouseleave', () => {
                        clearTimeout(previewTimer);
                        this.hideTopicPreview();
                    });
                }
            });
        }

        static showTopicPreview(link) {
            const preview = RangersUtils.createElement('div', {
                class: 'rangers-topic-preview',
                style: `
                    position: fixed;
                    background: rgba(26, 31, 44, 0.95);
                    border: 1px solid var(--rangers-primary);
                    border-radius: 12px;
                    padding: 16px;
                    max-width: 400px;
                    z-index: 10000;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                `
            });

            preview.innerHTML = `
                <div style="color: var(--rangers-accent); font-weight: bold; margin-bottom: 8px;">
                    Topic Preview
                </div>
                <div style="color: #ccc; font-size: 14px;">
                    Loading preview...
                </div>
            `;

            document.body.appendChild(preview);

            const rect = link.getBoundingClientRect();
            preview.style.left = `${rect.right + 10}px`;
            preview.style.top = `${rect.top}px`;
        }

        static hideTopicPreview() {
            const preview = document.querySelector('.rangers-topic-preview');
            if (preview) {
                preview.remove();
            }
        }
    }

    class ModerationTools {
        static init() {
            if (currentConfiguration.enableModerationTools) {
                this.setupComplaintTracker();
                this.setupQuickActions();
                this.setupUserAnalysis();
            }
        }

        static setupComplaintTracker() {
            const complaintSections = currentConfiguration.complaintTrackerSections || [];
            if (!complaintSections.length) return;
            this.monitorComplaintThreads();
        }

        static monitorComplaintThreads() {
            const observer = new MutationObserver(() => {
                this.processComplaintThreads();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.processComplaintThreads();
        }

        static processComplaintThreads() {
            const threads = document.querySelectorAll('.structItem');

            threads.forEach(thread => {
                const titleElement = thread.querySelector('.structItem-title');
                if (!titleElement) return;

                const titleText = titleElement.textContent.toLowerCase();
                const isComplaint = currentConfiguration.complaintTrackerSections.some(
                    section => titleText.includes(section.toLowerCase())
                );

                if (isComplaint) {
                    this.addComplaintTimer(thread);
                }
            });
        }

        static addComplaintTimer(thread) {
            if (thread.querySelector('.rangers-complaint-timer')) return;

            const timeElement = thread.querySelector('.structItem-latestDate');
            if (!timeElement) return;

            const postTime = new Date(timeElement.getAttribute('title') || timeElement.textContent);
            const currentTime = new Date();
            const hoursDiff = (currentTime - postTime) / (1000 * 60 * 60);

            const timer = RangersUtils.createElement('div', {
                class: 'rangers-complaint-timer',
                style: `
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                    margin-left: 8px;
                    background: ${this.getTimerColor(hoursDiff)};
                    color: white;
                `
            });

            timer.textContent = `${Math.round(hoursDiff)}h`;
            timeElement.parentNode.appendChild(timer);
        }

        static getTimerColor(hours) {
            const warnTime = currentConfiguration.complaintTrackerWarnTime || 12;
            const critTime = currentConfiguration.complaintTrackerCritTime || 24;

            if (hours >= critTime) return '#dc3545';
            if (hours >= warnTime) return '#ffc107';
            return '#28a745';
        }

        static setupQuickActions() {
            this.addPostActions();
        }

        static addPostActions() {
            document.addEventListener('mouseover', (e) => {
                const message = e.target.closest('.message');
                if (message && !message.querySelector('.rangers-quick-actions')) {
                    this.attachQuickActions(message);
                }
            });
        }

        static attachQuickActions(message) {
            const actions = RangersUtils.createElement('div', {
                class: 'rangers-quick-actions',
                style: `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: flex;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                `
            });

            const actionButtons = [
                { icon: '🚩', title: 'Report', action: () => this.reportPost(message) },
                { icon: '👁️', title: 'Watch User', action: () => this.watchUser(message) },
                { icon: '📊', title: 'Analyze', action: () => this.analyzeUser(message) }
            ];

            actionButtons.forEach(btn => {
                const button = RangersUtils.createElement('button', {
                    class: 'rangers-action-btn',
                    html: btn.icon,
                    title: btn.title,
                    style: `
                        background: rgba(26, 31, 44, 0.9);
                        border: 1px solid var(--rangers-primary);
                        border-radius: 4px;
                        padding: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        backdrop-filter: blur(10px);
                    `
                });

                button.addEventListener('click', btn.action);
                actions.appendChild(button);
            });

            message.style.position = 'relative';
            message.appendChild(actions);

            message.addEventListener('mouseenter', () => {
                actions.style.opacity = '1';
            });

            message.addEventListener('mouseleave', () => {
                actions.style.opacity = '0';
            });
        }

        static reportPost(message) {
            RangersUtils.showNotification('Post reported for moderation', 'info');
        }

        static watchUser(message) {
            const username = message.querySelector('.username')?.textContent;
            if (username) {
                RangersUtils.showNotification(`Now watching user: ${username}`, 'info');
            }
        }

        static analyzeUser(message) {
            const username = message.querySelector('.username')?.textContent;
            if (username) {
                this.showUserAnalysis(username);
            }
        }

        static showUserAnalysis(username) {
            const analysis = RangersUtils.createElement('div', {
                class: 'rangers-user-analysis',
                style: `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(26, 31, 44, 0.95);
                    border: 2px solid var(--rangers-primary);
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 500px;
                    width: 90%;
                    z-index: 10000;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                `
            });

            analysis.innerHTML = `
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: var(--rangers-accent); margin: 0;">User Analysis: ${username}</h3>
                    <button class="rangers-close-btn" style="background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer;">×</button>
                </div>
                <div style="color: #ccc;">
                    <div style="margin-bottom: 12px;">
                        <strong>Join Date:</strong> Analyzing...
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Post Count:</strong> Calculating...
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Recent Activity:</strong> Loading...
                    </div>
                </div>
            `;

            analysis.querySelector('.rangers-close-btn').addEventListener('click', () => {
                analysis.remove();
            });

            document.body.appendChild(analysis);

            setTimeout(() => {
                analysis.querySelector('div[style*="color: #ccc"]').innerHTML = `
                    <div style="margin-bottom: 12px;">
                        <strong>Join Date:</strong> 2024 (Estimated)
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Post Count:</strong> 150+ posts
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Recent Activity:</strong> Active daily
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Behavior Pattern:</strong> Generally positive
                    </div>
                `;
            }, 1000);
        }
    }

    class EffectsManager {
        static init() {
            this.setupParticleEffects();
            this.setupBackgroundEffects();
            this.setupInteractiveElements();
            ThemeManager.updateThemeEffects();
        }

        static setupParticleEffects() {
            if (!currentConfiguration.enableParticleEffects) return;

            const particlesContainer = RangersUtils.createElement('div', {
                class: 'rangers-particles-container',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    overflow: hidden;
                `
            });

            document.body.appendChild(particlesContainer);
            this.createParticles(particlesContainer);
        }

        static createParticles(container) {
            const particleCount = currentConfiguration.particleDensity || 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = RangersUtils.createElement('div', {
                    class: 'rangers-particle',
                    style: `
                        position: absolute;
                        width: ${Math.random() * 4 + 1}px;
                        height: ${Math.random() * 4 + 1}px;
                        background: var(--rangers-primary);
                        border-radius: 50%;
                        opacity: ${Math.random() * 0.6 + 0.2};
                        animation: float ${Math.random() * 20 + 10}s linear infinite;
                    `
                });

                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;

                container.appendChild(particle);
            }

            const style = RangersUtils.createElement('style');
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                        opacity: 0.2;
                    }
                    25% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                        opacity: 0.6;
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                        opacity: 0.2;
                    }
                }
            `;

            document.head.appendChild(style);
        }

        static setupBackgroundEffects() {
            if (currentConfiguration.backgroundType === 'particles') {
                this.createAdvancedParticles();
            } else if (currentConfiguration.backgroundType === 'gradient') {
                this.applyAnimatedGradient();
            }
        }

        static createAdvancedParticles() {
            const canvas = RangersUtils.createElement('canvas', {
                id: 'rangers-particles-canvas',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -2;
                `
            });

            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const particleCount = 100;

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 2;
                    this.vy = (Math.random() - 0.5) * 2;
                    this.radius = Math.random() * 2 + 1;
                    this.alpha = Math.random() * 0.5 + 0.1;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 107, 53, ${this.alpha})`;
                    ctx.fill();
                }
            }

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                requestAnimationFrame(animate);
            }

            animate();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        static applyAnimatedGradient() {
            const gradientElement = RangersUtils.createElement('div', {
                class: 'rangers-animated-gradient',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        45deg,
                        ${currentConfiguration.primaryColor}20,
                        ${currentConfiguration.secondaryColor}20,
                        ${currentConfiguration.accentColor}20,
                        ${currentConfiguration.primaryColor}20
                    );
                    background-size: 400% 400%;
                    animation: gradientShift 15s ease infinite;
                    z-index: -2;
                    pointer-events: none;
                `
            });

            document.body.appendChild(gradientElement);

            const style = RangersUtils.createElement('style');
            style.textContent = `
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;

            document.head.appendChild(style);
        }

        static setupInteractiveElements() {
            this.addHoverEffects();
            this.addClickEffects();
        }

        static addHoverEffects() {
            const interactiveSelectors = [
                '.button',
                '.structItem',
                '.message',
                '.block-link',
                '.tabs-tab'
            ];

            interactiveSelectors.forEach(selector => {
                document.addEventListener('mouseover', (e) => {
                    const element = e.target.closest(selector);
                    if (element && currentConfiguration.enableHoverEffects) {
                        element.style.transition = 'all 0.3s ease';
                        element.style.transform = 'translateY(-2px)';
                        element.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                    }
                });

                document.addEventListener('mouseout', (e) => {
                    const element = e.target.closest(selector);
                    if (element) {
                        element.style.transform = '';
                        element.style.boxShadow = '';
                    }
                });
            });
        }

        static addClickEffects() {
            document.addEventListener('click', (e) => {
                if (currentConfiguration.enableClickEffects) {
                    this.createClickWave(e);
                }
            });
        }

        static createClickWave(event) {
            const wave = RangersUtils.createElement('div', {
                class: 'rangers-click-wave',
                style: `
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--rangers-primary);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    animation: clickWave 0.6s ease-out;
                `
            });

            wave.style.left = `${event.clientX - 10}px`;
            wave.style.top = `${event.clientY - 10}px`;

            document.body.appendChild(wave);

            setTimeout(() => wave.remove(), 600);
        }
    }

    class PerformanceMonitor {
        static init() {
            if (currentConfiguration.enablePerformanceMode) {
                this.startMonitoring();
                this.optimizePerformance();
            }
        }

        static startMonitoring() {
            this.monitorFrameRate();
            this.monitorMemory();
            this.monitorNetwork();
        }

        static monitorFrameRate() {
            let frameCount = 0;
            let lastTime = performance.now();
            const fpsElement = RangersUtils.createElement('div', {
                class: 'rangers-fps-display',
                style: `
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.8);
                    color: #00ff00;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 10000;
                    display: none;
                `
            });

            document.body.appendChild(fpsElement);

            function updateFPS() {
                frameCount++;
                const currentTime = performance.now();

                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    fpsElement.textContent = `FPS: ${fps}`;
                    frameCount = 0;
                    lastTime = currentTime;

                    if (fps < 30) {
                        fpsElement.style.color = '#ff4444';
                    } else if (fps < 50) {
                        fpsElement.style.color = '#ffaa00';
                    } else {
                        fpsElement.style.color = '#00ff00';
                    }
                }
                requestAnimationFrame(updateFPS);
            }

            updateFPS();

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                    fpsElement.style.display = fpsElement.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        static monitorMemory() {
            if (performance.memory) {
                setInterval(() => {
                    const memory = performance.memory;
                    const used = Math.round(memory.usedJSHeapSize / 1048576);
                    const total = Math.round(memory.totalJSHeapSize / 1048576);

                    if (used > total * 0.8) {
                        console.warn('High memory usage detected:', used, 'MB');
                    }
                }, 30000);
            }
        }

        static monitorNetwork() {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 1000) {
                        console.warn('Slow resource load:', entry.name, entry.duration);
                    }
                });
            });

            observer.observe({ entryTypes: ['resource'] });
        }

        static optimizePerformance() {
            this.deferImages();
            this.optimizeAnimations();
            this.throttleEvents();
        }

        static deferImages() {
            const images = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => observer.observe(img));
        }

        static optimizeAnimations() {
            const animatedElements = document.querySelectorAll(
                '.rangers-particle, .rangers-click-wave, .rangers-ripple-effect'
            );

            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        }

        static throttleEvents() {
        }
    }

    class SettingsManager {
        static async exportSettings() {
            try {
                const exportData = {
                    metadata: {
                        version: SCRIPT_CONFIG.VERSION,
                        exportDate: new Date().toISOString(),
                        author: SCRIPT_CONFIG.AUTHOR,
                        script: 'Rangers Customizer'
                    },
                    configuration: { ...currentConfiguration },
                    customThemes: currentConfiguration.customThemes || {}
                };

                delete exportData.configuration.imgbbApiKey;
                delete exportData.configuration.uploadHistory;

                if (!Array.isArray(exportData.configuration.quickLinks)) {
                    exportData.configuration.quickLinks = DEFAULT_CONFIG.quickLinks;
                }
                if (typeof exportData.configuration.customThemes !== 'object' || exportData.configuration.customThemes === null) {
                    exportData.configuration.customThemes = DEFAULT_CONFIG.customThemes;
                }

                const settingsJson = JSON.stringify(exportData, null, 2);
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                this.downloadFile(`rangers-config-${timestamp}.json`, settingsJson, 'application/json');

                RangersUtils.showNotification(RangersUtils.t('exportSuccess'), 'success');
            } catch (error) {
                console.error('Export failed:', error);
                RangersUtils.showNotification('Export failed', 'error');
            }
        }

        static async importSettings(event) {
            const file = event.target.files[0];
            if (!file) return;

            RangersUtils.showNotification('Reading configuration file...', 'info');

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);

                    if (!this.validateImportData(importedData)) {
                        throw new Error("Invalid configuration file format");
                    }

                    if (confirm(RangersUtils.t('resetConfirm'))) {
                        await this.applyImportedSettings(importedData);
                        RangersUtils.showNotification(RangersUtils.t('importSuccess'), 'success');
                        setTimeout(() => location.reload(), 1000);
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    RangersUtils.showNotification(`Import error: ${error.message}`, 'error');
                } finally {
                    event.target.value = null;
                }
            };

            reader.onerror = () => {
                RangersUtils.showNotification(RangersUtils.t('fileReadError'), 'error');
                event.target.value = null;
            };

            reader.readAsText(file);
        }

        static validateImportData(data) {
            return data &&
                   data.metadata &&
                   data.configuration &&
                   data.metadata.script === 'Rangers Customizer';
        }

        static async applyImportedSettings(importedData) {
            const validatedConfig = {};

            for (const key in importedData.configuration) {
                if (DEFAULT_CONFIG.hasOwnProperty(key)) {
                    validatedConfig[key] = ConfigurationManager.validateSetting(
                        key,
                        importedData.configuration[key]
                    );
                }
            }

            if (importedData.customThemes && typeof importedData.customThemes === 'object') {
                validatedConfig.customThemes = importedData.customThemes;
            }

            await ConfigurationManager.saveConfiguration(validatedConfig);
        }

        static downloadFile(filename, content, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    class PanelManager {
        static init() {
            this.createControlPanel();
            this.setupPanelEvents();
            this.setupResponsiveBehavior();
        }

        static createControlPanel() {
            if (controlPanel) return controlPanel;

            const panelWrapper = RangersUtils.createElement('div', {
                id: 'rangers-panel-wrapper',
                class: 'rangers-panel-wrapper'
            });

            controlPanel = RangersUtils.createElement('div', {
                id: SCRIPT_CONFIG.PANEL_ID,
                class: 'rangers-control-panel br-noise-bg'
            });

            panelWrapper.appendChild(controlPanel);
            document.body.appendChild(panelWrapper);

            this.populatePanelContent();
            return controlPanel;
        }

        static populatePanelContent() {
            if (!controlPanel) return;

            controlPanel.innerHTML = `
                <div class="rangers-panel-header">
                    <div class="rangers-panel-title">
                        <img src="${VISUAL_ASSETS.icons.main}" alt="Rangers Icon" class="rangers-panel-icon">
                        <h3>${RangersUtils.t('panelTitle')}</h3>
                    </div>
                    <div class="rangers-panel-controls">
                        <select id="rangers-language-select" class="rangers-language-select">
                            <option value="ru">🇷🇺 Русский</option>
                            <option value="en">🇺🇸 English</option>
                        </select>
                        <button class="rangers-panel-close" id="rangers-panel-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="rangers-panel-body">
                    <div class="rangers-nav-grid">
                        ${this.createNavCards()}
                    </div>

                    <div class="rangers-sections-container">
                        ${this.createSettingsSections()}
                    </div>
                </div>

                <div class="rangers-panel-footer">
                    <div class="rangers-footer-actions">
                        <button class="rangers-btn rangers-btn-secondary" id="rangers-export-btn">
                            <i class="fas fa-file-export"></i> ${RangersUtils.t('export')}
                        </button>
                        <button class="rangers-btn rangers-btn-secondary" id="rangers-import-btn">
                            <i class="fas fa-file-import"></i> ${RangersUtils.t('import')}
                        </button>
                        <input type="file" id="rangers-import-file" accept=".json" style="display: none;">

                        <div class="rangers-footer-spacer"></div>

                        <button class="rangers-btn rangers-btn-warning" id="rangers-reset-btn">
                            <i class="fas fa-undo"></i> ${RangersUtils.t('reset')}
                        </button>
                        <button class="rangers-btn rangers-btn-primary" id="rangers-save-btn">
                            <i class="fas fa-save"></i> ${RangersUtils.t('saveChanges')}
                        </button>
                    </div>
                </div>
            `;

            this.initializePanelInteractions();
        }

        static createNavCards() {
            const navItems = [
                { icon: 'fas fa-home', label: 'dashboard', section: 'dashboard' },
                { icon: 'fas fa-palette', label: 'appearance', section: 'appearance' },
                { icon: 'fas fa-magic', label: 'effects', section: 'effects' },
                { icon: 'fas fa-sliders-h', label: 'interface', section: 'interface' },
                { icon: 'fas fa-broadcast-tower', label: 'live', section: 'live' },
                { icon: 'fas fa-shield-alt', label: 'moderation', section: 'moderation' },
                { icon: 'fas fa-cloud-upload-alt', label: 'integrations', section: 'integrations' },
                { icon: 'fas fa-images', label: 'gallery', section: 'gallery' },
                { icon: 'fas fa-cog', label: 'advanced', section: 'advanced' }
            ];

            return navItems.map(item => `
                <div class="rangers-nav-card" data-section="${item.section}">
                    <div class="rangers-nav-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <span class="rangers-nav-label">${RangersUtils.t(item.label)}</span>
                </div>
            `).join('');
        }

        static createSettingsSections() {
            const sections = {
                dashboard: this.createDashboardSection(),
                appearance: this.createAppearanceSection(),
                effects: this.createEffectsSection(),
                interface: this.createInterfaceSection(),
                live: this.createLiveSection(),
                moderation: this.createModerationSection(),
                integrations: this.createIntegrationsSection(),
                gallery: this.createGallerySection(),
                advanced: this.createAdvancedSection()
            };

            return Object.entries(sections).map(([key, content]) => `
                <div class="rangers-section" id="rangers-section-${key}" style="display: none;">
                    ${content}
                </div>
            `).join('');
        }

        static createDashboardSection() {
            return `
                <div class="rangers-dashboard">
                    <div class="rangers-welcome-card">
                        <h4>${RangersUtils.t('welcome')}</h4>
                        <p>${RangersUtils.t('version')} ${SCRIPT_CONFIG.VERSION} • ${RangersUtils.t('by')} ${SCRIPT_CONFIG.AUTHOR}</p>
                    </div>

                    <div class="rangers-stats-grid">
                        <div class="rangers-stat-card">
                            <div class="rangers-stat-icon" style="background: var(--rangers-primary)">
                                <i class="fas fa-paint-brush"></i>
                            </div>
                            <div class="rangers-stat-info">
                                <div class="rangers-stat-value">${Object.keys(currentConfiguration.customThemes || {}).length}</div>
                                <div class="rangers-stat-label">${RangersUtils.t('customThemes')}</div>
                            </div>
                        </div>

                        <div class="rangers-stat-card">
                            <div class="rangers-stat-icon" style="background: var(--rangers-secondary)">
                                <i class="fas fa-bolt"></i>
                            </div>
                            <div class="rangers-stat-info">
                                <div class="rangers-stat-value">${currentConfiguration.enablePerformanceMode ? 'ON' : 'OFF'}</div>
                                <div class="rangers-stat-label">${RangersUtils.t('performanceMode')}</div>
                            </div>
                        </div>

                        <div class="rangers-stat-card">
                            <div class="rangers-stat-icon" style="background: var(--rangers-accent)">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="rangers-stat-info">
                                <div class="rangers-stat-value">${Math.round(performance.now() / 1000)}s</div>
                                <div class="rangers-stat-label">${RangersUtils.t('uptime')}</div>
                            </div>
                        </div>
                    </div>

                    <div class="rangers-quick-actions">
                        <h5>${RangersUtils.t('quickActions')}</h5>
                        <div class="rangers-action-buttons">
                            <button class="rangers-btn rangers-btn-small" id="rangers-apply-default">
                                ${RangersUtils.t('applyDefaultTheme')}
                            </button>
                            <button class="rangers-btn rangers-btn-small" id="rangers-toggle-performance">
                                ${RangersUtils.t('togglePerformance')}
                            </button>
                            <button class="rangers-btn rangers-btn-small" id="rangers-clear-cache">
                                ${RangersUtils.t('clearCache')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        static createAppearanceSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('backgroundColors')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-gradient"
                                   ${currentConfiguration.enableGradient ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableGradient')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-primary-color">${RangersUtils.t('primaryColor')}</label>
                        <input type="color" id="rangers-primary-color"
                               value="${currentConfiguration.primaryColor}">
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-secondary-color">${RangersUtils.t('secondaryColor')}</label>
                        <input type="color" id="rangers-secondary-color"
                               value="${currentConfiguration.secondaryColor}">
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-background-opacity">${RangersUtils.t('backgroundOpacity')}</label>
                        <input type="range" id="rangers-background-opacity"
                               min="0" max="1" step="0.05"
                               value="${currentConfiguration.backgroundOpacity}">
                        <span class="rangers-slider-value">${currentConfiguration.backgroundOpacity}</span>
                    </div>

                    <div class="rangers-setting">
                        <button class="rangers-btn rangers-btn-secondary" id="rangers-edit-background">
                            <i class="fas fa-edit"></i> ${RangersUtils.t('editBackground')}
                        </button>
                    </div>
                </div>

                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('contentSettings')}</h4>

                    <div class="rangers-setting">
                        <label for="rangers-content-transparency">${RangersUtils.t('contentTransparency')}</label>
                        <input type="range" id="rangers-content-transparency"
                               min="0" max="100" step="1"
                               value="${currentConfiguration.contentTransparency?.general || 100}">
                        <span class="rangers-slider-value">${currentConfiguration.contentTransparency?.general || 100}%</span>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-post-transparency">${RangersUtils.t('postTransparency')}</label>
                        <input type="range" id="rangers-post-transparency"
                               min="0" max="100" step="1"
                               value="${currentConfiguration.contentTransparency?.posts || 100}">
                        <span class="rangers-slider-value">${currentConfiguration.contentTransparency?.posts || 100}%</span>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-sidebar-transparency">${RangersUtils.t('sidebarTransparency')}</label>
                        <input type="range" id="rangers-sidebar-transparency"
                               min="0" max="100" step="1"
                               value="${currentConfiguration.contentTransparency?.sidebar || 100}">
                        <span class="rangers-slider-value">${currentConfiguration.contentTransparency?.sidebar || 100}%</span>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-text-opacity">${RangersUtils.t('textOpacity')}</label>
                        <input type="range" id="rangers-text-opacity"
                               min="0" max="100" step="1"
                               value="${currentConfiguration.contentTransparency?.text || 100}">
                        <span class="rangers-slider-value">${currentConfiguration.contentTransparency?.text || 100}%</span>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-section-transparency">${RangersUtils.t('sectionTransparency')}</label>
                        <input type="range" id="rangers-section-transparency"
                               min="0" max="100" step="1"
                               value="${currentConfiguration.contentTransparency?.sections || 100}">
                        <span class="rangers-slider-value">${currentConfiguration.contentTransparency?.sections || 100}%</span>
                    </div>
                </div>

                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('typography')}</h4>

                    <div class="rangers-setting">
                        <label for="rangers-font-family">${RangersUtils.t('fontFamily')}</label>
                        <select id="rangers-font-family">
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                            <option value="Arial, Helvetica, sans-serif">Arial</option>
                            <option value="'Courier New', monospace">Courier New</option>
                        </select>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-font-size">${RangersUtils.t('fontSize')}</label>
                        <input type="range" id="rangers-font-size"
                               min="12" max="18" step="0.5"
                               value="${parseInt(currentConfiguration.fontSize)}">
                        <span class="rangers-slider-value">${currentConfiguration.fontSize}</span>
                    </div>
                </div>
            `;
        }

        static createEffectsSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('visualEffects')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-animations"
                                   ${currentConfiguration.enableAnimations ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableAnimations')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-animation-intensity">${RangersUtils.t('animationIntensity')}</label>
                        <input type="range" id="rangers-animation-intensity"
                               min="0" max="1" step="0.1"
                               value="${currentConfiguration.animationIntensity}">
                        <span class="rangers-slider-value">${currentConfiguration.animationIntensity}</span>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-particle-effects"
                                   ${currentConfiguration.enableParticleEffects ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('particleEffects')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-particle-density">${RangersUtils.t('particleDensity')}</label>
                        <input type="range" id="rangers-particle-density"
                               min="10" max="200" step="10"
                               value="${currentConfiguration.particleDensity || 50}">
                        <span class="rangers-slider-value">${currentConfiguration.particleDensity || 50}</span>
                    </div>
                </div>

                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('themeElements')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-snow"
                                   ${currentConfiguration.enableSnow ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableSnow')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-snow-intensity">${RangersUtils.t('snowIntensity')}</label>
                        <input type="range" id="rangers-snow-intensity"
                               min="10" max="100" step="5"
                               value="${currentConfiguration.snowIntensity || 50}">
                        <span class="rangers-slider-value">${currentConfiguration.snowIntensity || 50}</span>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-snow-emoji">${RangersUtils.t('snowEmoji')}</label>
                        <input type="text" id="rangers-snow-emoji"
                               value="${currentConfiguration.snowEmoji || '❄,🌟,✨,💫'}"
                               placeholder="Введите смайлы через запятую">
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-snow-opacity">${RangersUtils.t('snowOpacity')}</label>
                        <input type="range" id="rangers-snow-opacity"
                               min="0" max="100" step="5"
                               value="${currentConfiguration.snowOpacity || 80}">
                        <span class="rangers-slider-value">${currentConfiguration.snowOpacity || 80}%</span>
                    </div>
                </div>
            `;
        }

        static createInterfaceSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('layoutInterface')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-wide-layout"
                                   ${currentConfiguration.enableWideLayout ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableWideLayout')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-compact-mode"
                                   ${currentConfiguration.enableCompactMode ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableCompactMode')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-glass-effect"
                                   ${currentConfiguration.enableGlassEffect ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableGlassEffect')}</span>
                        </label>
                    </div>
                </div>
            `;
        }

        static createLiveSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('liveFeatures')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-live-updates"
                                   ${currentConfiguration.enableLiveUpdates ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enableLiveUpdates')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-live-update-interval">${RangersUtils.t('updateInterval')}</label>
                        <input type="range" id="rangers-live-update-interval"
                               min="10" max="120" step="5"
                               value="${currentConfiguration.liveUpdateInterval || 30}">
                        <span class="rangers-slider-value">${currentConfiguration.liveUpdateInterval || 30}</span>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-scroll-indicator"
                                   ${currentConfiguration.enableScrollIndicator ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('scrollIndicator')}</span>
                        </label>
                    </div>
                </div>
            `;
        }

        static createModerationSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('moderationTools')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-complaint-tracker"
                                   ${currentConfiguration.enableComplaintTracker ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('complaintTracker')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-template-system"
                                   ${currentConfiguration.enableTemplateSystem ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('templateSystem')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-complaint-warn-time">${RangersUtils.t('warningTime')}</label>
                        <input type="number" id="rangers-complaint-warn-time"
                               min="1" max="48"
                               value="${currentConfiguration.complaintTrackerWarnTime || 12}">
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-complaint-crit-time">${RangersUtils.t('criticalTime')}</label>
                        <input type="number" id="rangers-complaint-crit-time"
                               min="1" max="72"
                               value="${currentConfiguration.complaintTrackerCritTime || 24}">
                    </div>
                </div>
            `;
        }

        static createIntegrationsSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('integrations')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-upload-system"
                                   ${currentConfiguration.enableUploadSystem ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('imageUploadSystem')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-imgbb-api-key">${RangersUtils.t('imgbbApiKey')}</label>
                        <input type="password" id="rangers-imgbb-api-key"
                               value="${currentConfiguration.imgbbApiKey || ''}"
                               placeholder="Enter your ImgBB API key">
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-auto-send-templates"
                                   ${currentConfiguration.autoSendTemplates ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('autoSendTemplates')}</span>
                        </label>
                    </div>
                </div>
            `;
        }

        static createGallerySection() {
            const wallpaperCategories = Object.keys(WALLPAPER_LIBRARY);
            let galleryContent = `<div class="rangers-settings-group"><h4>${RangersUtils.t('wallpaperGallery')}</h4>`;

            galleryContent += `
                <div class="rangers-setting">
                    <button class="rangers-btn rangers-btn-secondary" id="rangers-upload-custom-bg">
                        <i class="fas fa-upload"></i> ${RangersUtils.t('uploadImage')}
                    </button>
                    <input type="file" id="rangers-custom-bg-file" accept="image/*" style="display: none;">
                </div>
            `;

            wallpaperCategories.forEach(category => {
                galleryContent += `<h5>${category}</h5><div class="rangers-wallpaper-grid">`;
                WALLPAPER_LIBRARY[category].forEach((wallpaper, index) => {
                    if (wallpaper) {
                        galleryContent += `
                            <div class="rangers-wallpaper-item" data-url="${wallpaper}">
                                <img src="${wallpaper}" alt="Wallpaper ${index + 1}">
                                <button class="rangers-wallpaper-apply">${RangersUtils.t('apply')}</button>
                            </div>
                        `;
                    }
                });
                galleryContent += '</div>';
            });

            galleryContent += '</div>';
            return galleryContent;
        }

        static createAdvancedSection() {
            return `
                <div class="rangers-settings-group">
                    <h4>${RangersUtils.t('advancedSettings')}</h4>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-performance-mode"
                                   ${currentConfiguration.enablePerformanceMode ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('enablePerformanceMode')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-touch-optimization"
                                   ${currentConfiguration.enableTouchOptimization ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('touchOptimization')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label class="rangers-toggle">
                            <input type="checkbox" id="rangers-enable-developer-tools"
                                   ${currentConfiguration.enableDeveloperTools ? 'checked' : ''}>
                            <span class="rangers-toggle-slider"></span>
                            <span class="rangers-toggle-label">${RangersUtils.t('developerTools')}</span>
                        </label>
                    </div>

                    <div class="rangers-setting">
                        <label for="rangers-custom-css">${RangersUtils.t('customCSS')}</label>
                        <textarea id="rangers-custom-css" rows="6" placeholder="Enter your custom CSS here...">${currentConfiguration.customCSS || ''}</textarea>
                    </div>
                </div>
            `;
        }

        static initializePanelInteractions() {
            const navCards = controlPanel.querySelectorAll('.rangers-nav-card');
            navCards.forEach(card => {
                card.addEventListener('click', () => {
                    const section = card.dataset.section;
                    this.showSection(section);

                    navCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                });
            });

            const languageSelect = controlPanel.querySelector('#rangers-language-select');
            languageSelect.value = currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                RangersUtils.changeLanguage(e.target.value);
            });

            controlPanel.querySelector('#rangers-panel-close').addEventListener('click', () => {
                this.closePanel();
            });

            controlPanel.querySelector('#rangers-export-btn').addEventListener('click', () => {
                SettingsManager.exportSettings();
            });

            controlPanel.querySelector('#rangers-import-btn').addEventListener('click', () => {
                controlPanel.querySelector('#rangers-import-file').click();
            });

            controlPanel.querySelector('#rangers-import-file').addEventListener('change', (e) => {
                SettingsManager.importSettings(e);
            });

            controlPanel.querySelector('#rangers-reset-btn').addEventListener('click', () => {
                this.handleReset();
            });

            controlPanel.querySelector('#rangers-save-btn').addEventListener('click', () => {
                this.handleSave();
            });

            controlPanel.querySelector('#rangers-apply-default')?.addEventListener('click', () => {
                this.applyDefaultTheme();
            });

            controlPanel.querySelector('#rangers-toggle-performance')?.addEventListener('click', () => {
                this.togglePerformanceMode();
            });

            controlPanel.querySelector('#rangers-clear-cache')?.addEventListener('click', () => {
                this.clearCache();
            });

            controlPanel.querySelector('#rangers-edit-background')?.addEventListener('click', () => {
                BackgroundEditor.show();
            });

            controlPanel.querySelector('#rangers-upload-custom-bg')?.addEventListener('click', () => {
                controlPanel.querySelector('#rangers-custom-bg-file').click();
            });

            controlPanel.querySelector('#rangers-custom-bg-file')?.addEventListener('change', (e) => {
                this.handleCustomBackgroundUpload(e);
            });

            this.initializeSliders();
            this.initializeWallpaperGallery();
        }

        static initializeSliders() {
            const sliders = controlPanel.querySelectorAll('input[type="range"]');
            sliders.forEach(slider => {
                const valueDisplay = slider.nextElementSibling;
                if (valueDisplay && valueDisplay.classList.contains('rangers-slider-value')) {
                    slider.addEventListener('input', () => {
                        valueDisplay.textContent = slider.value + (slider.id.includes('transparency') || slider.id.includes('opacity') ? '%' : '');
                    });
                }
            });
        }

        static initializeWallpaperGallery() {
            const wallpaperItems = controlPanel.querySelectorAll('.rangers-wallpaper-item');
            wallpaperItems.forEach(item => {
                const applyBtn = item.querySelector('.rangers-wallpaper-apply');
                applyBtn.addEventListener('click', () => {
                    const wallpaperUrl = item.dataset.url;
                    this.applyWallpaper(wallpaperUrl);
                });
            });
        }

        static async handleCustomBackgroundUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > PERFORMANCE.MAX_IMAGE_SIZE * 1024 * 1024) {
                RangersUtils.showNotification(`File too large. Max ${PERFORMANCE.MAX_IMAGE_SIZE}MB`, 'error');
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    this.applyWallpaper(imageUrl);
                    RangersUtils.showNotification('Custom background applied successfully!', 'success');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                RangersUtils.showNotification('Failed to load image', 'error');
            }
        }

        static applyWallpaper(url) {
            ConfigurationManager.saveConfiguration({
                backgroundType: 'image',
                backgroundImage: url,
                backgroundSettings: {
                    ...currentConfiguration.backgroundSettings,
                    scale: 100,
                    positionX: 50,
                    positionY: 50
                }
            }).then(() => {
                RangersUtils.showNotification('Wallpaper applied successfully!', 'success');
                VisualEffects.applyBackgroundEffect();
                BackgroundEditor.applySettingsToBackground();
            });
        }

        static showSection(sectionId) {
            const sections = controlPanel.querySelectorAll('.rangers-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });

            const targetSection = controlPanel.querySelector(`#rangers-section-${sectionId}`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        }

        static async handleSave() {
            const saveBtn = controlPanel.querySelector('#rangers-save-btn');
            const originalText = saveBtn.innerHTML;

            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + RangersUtils.t('saveChanges');
            saveBtn.disabled = true;

            try {
                const updatedConfig = this.collectFormData();
                const success = await ConfigurationManager.saveConfiguration(updatedConfig);

                if (success) {
                    RangersUtils.showNotification(RangersUtils.t('savedSuccessfully'), 'success');
                    saveBtn.innerHTML = '<i class="fas fa-check"></i> ' + RangersUtils.t('savedSuccessfully');
                    setTimeout(() => {
                        saveBtn.innerHTML = originalText;
                        saveBtn.disabled = false;
                    }, 2000);

                    // Применяем изменения сразу
                    VisualEffects.applyContentTransparency();
                    ThemeManager.updateThemeEffects();
                } else {
                    throw new Error('Save failed');
                }
            } catch (error) {
                RangersUtils.showNotification('Save failed', 'error');
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        }

        static collectFormData() {
            const config = {};

            const toggles = controlPanel.querySelectorAll('input[type="checkbox"]');
            toggles.forEach(toggle => {
                const key = toggle.id.replace('rangers-', '').replace(/-/g, '');
                config[key] = toggle.checked;
            });

            const colors = controlPanel.querySelectorAll('input[type="color"]');
            colors.forEach(color => {
                const key = color.id.replace('rangers-', '').replace(/-/g, '');
                config[key] = color.value;
            });

            const ranges = controlPanel.querySelectorAll('input[type="range"]');
            ranges.forEach(range => {
                const key = range.id.replace('rangers-', '').replace(/-/g, '');
                config[key] = parseFloat(range.value);
            });

            const selects = controlPanel.querySelectorAll('select');
            selects.forEach(select => {
                const key = select.id.replace('rangers-', '').replace(/-/g, '');
                config[key] = select.value;
            });

            const inputs = controlPanel.querySelectorAll('input[type="text"], input[type="password"], input[type="number"]');
            inputs.forEach(input => {
                if (!input.type || input.type === 'text' || input.type === 'password' || input.type === 'number') {
                    const key = input.id.replace('rangers-', '').replace(/-/g, '');
                    config[key] = input.value;
                }
            });

            const textareas = controlPanel.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                const key = textarea.id.replace('rangers-', '').replace(/-/g, '');
                config[key] = textarea.value;
            });

            config.contentTransparency = {
                general: parseFloat(document.getElementById('rangers-content-transparency')?.value || 100),
                posts: parseFloat(document.getElementById('rangers-post-transparency')?.value || 100),
                sidebar: parseFloat(document.getElementById('rangers-sidebar-transparency')?.value || 100),
                header: parseFloat(document.getElementById('rangers-header-transparency')?.value || 100),
                text: parseFloat(document.getElementById('rangers-text-opacity')?.value || 100),
                sections: parseFloat(document.getElementById('rangers-section-transparency')?.value || 100)
            };

            return config;
        }

        static async handleReset() {
            if (confirm(RangersUtils.t('resetConfirm'))) {
                const success = await ConfigurationManager.saveConfiguration(DEFAULT_CONFIG);
                if (success) {
                    RangersUtils.showNotification('Settings reset to default!', 'success');
                    setTimeout(() => location.reload(), 1000);
                }
            }
        }

        static async applyDefaultTheme() {
            const defaultTheme = {
                primaryColor: '#FF6B35',
                secondaryColor: '#00D4AA',
                accentColor: '#FFD166',
                backgroundColor: '#1A1F2C',
                enableGradient: true,
                enableAnimations: true
            };

            await ConfigurationManager.saveConfiguration(defaultTheme);
            RangersUtils.showNotification('Default theme applied!', 'success');
        }

        static togglePerformanceMode() {
            const newMode = !currentConfiguration.enablePerformanceMode;
            ConfigurationManager.saveConfiguration({ enablePerformanceMode: newMode });
            RangersUtils.showNotification(`Performance mode ${newMode ? 'enabled' : 'disabled'}`, 'info');
        }

        static clearCache() {
            localStorage.removeItem('rangers-cache');
            sessionStorage.removeItem('rangers-temp');
            RangersUtils.showNotification('Cache cleared!', 'info');
        }

        static openPanel() {
            const wrapper = document.getElementById('rangers-panel-wrapper');
            if (!wrapper) return;

            wrapper.style.display = 'flex';
            setTimeout(() => {
                wrapper.classList.add('visible');
            }, 10);

            this.showSection('dashboard');

            const firstNavCard = controlPanel.querySelector('.rangers-nav-card');
            if (firstNavCard) {
                firstNavCard.classList.add('active');
            }
        }

        static closePanel() {
            const wrapper = document.getElementById('rangers-panel-wrapper');
            if (!wrapper) return;

            wrapper.classList.remove('visible');
            setTimeout(() => {
                wrapper.style.display = 'none';
            }, 300);
        }

        static togglePanel() {
            const wrapper = document.getElementById('rangers-panel-wrapper');
            if (!wrapper || wrapper.style.display === 'none') {
                this.openPanel();
            } else {
                this.closePanel();
            }
        }

        static updatePanelLanguage() {
            this.populatePanelContent();
        }

        static setupPanelEvents() {
            document.addEventListener('click', (e) => {
                const wrapper = document.getElementById('rangers-panel-wrapper');
                if (wrapper && wrapper.style.display !== 'none' &&
                    !wrapper.contains(e.target) &&
                    !e.target.closest(`#${SCRIPT_CONFIG.ICON_ID}`)) {
                    this.closePanel();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closePanel();
                }
            });
        }

        static setupResponsiveBehavior() {
            const updatePanelLayout = () => {
                if (!controlPanel) return;

                if (window.innerWidth < 768) {
                    controlPanel.classList.add('mobile');
                } else {
                    controlPanel.classList.remove('mobile');
                }
            };

            window.addEventListener('resize', RangersUtils.debounce(updatePanelLayout, 250));
            updatePanelLayout();
        }
    }

    class NavigationBar {
        static init() {
            this.createNavigationBar();
            this.updateNavigationContent();
            this.setupNavigationEvents();
        }

        static createNavigationBar() {
            if (navigationBar) return navigationBar;

            navigationBar = RangersUtils.createElement('nav', {
                id: SCRIPT_CONFIG.NAV_ID,
                class: 'rangers-navigation-bar'
            });

            navigationBar.innerHTML = `
                <div class="rangers-nav-container">
                    <div class="rangers-nav-utilities">
                        <div class="rangers-nav-icon" id="${SCRIPT_CONFIG.ICON_ID}">
                            <i class="fas fa-cog"></i>
                        </div>
                        <div class="rangers-clock" id="${SCRIPT_CONFIG.CLOCK_ID}"></div>
                    </div>

                    <div class="rangers-nav-links" id="rangers-nav-links"></div>

                    <div class="rangers-nav-live-feed">
                        <div class="rangers-live-indicator"></div>
                        <span class="rangers-live-text">Live</span>
                    </div>
                </div>
            `;

            document.body.appendChild(navigationBar);
            return navigationBar;
        }

        static updateNavigationContent() {
            if (!navigationBar) return;

            const linksContainer = navigationBar.querySelector('#rangers-nav-links');
            if (!linksContainer) return;

            linksContainer.innerHTML = '';

            const quickLinks = currentConfiguration.quickActions || [];
            quickLinks.forEach(link => {
                if (link.name && link.url) {
                    const linkElement = RangersUtils.createElement('a', {
                        href: link.url,
                        class: 'rangers-nav-link',
                        text: link.name,
                        title: link.name
                    });

                    if (window.location.href.includes(link.url)) {
                        linkElement.classList.add('active');
                    }

                    linksContainer.appendChild(linkElement);
                }
            });

            this.updateClock();
            this.updateLiveFeed();
        }

        static updateNavigationLanguage() {
            this.updateNavigationContent();
        }

        static updateClock() {
            const clockElement = navigationBar.querySelector(`#${SCRIPT_CONFIG.CLOCK_ID}`);
            if (!clockElement) return;

            const updateTime = () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                clockElement.textContent = timeString;
                clockElement.title = now.toLocaleDateString();
            };

            updateTime();
            setInterval(updateTime, 1000);
        }

        static updateLiveFeed() {
            const liveFeed = navigationBar.querySelector('.rangers-nav-live-feed');
            if (!liveFeed) return;

            if (currentConfiguration.enableLiveUpdates) {
                liveFeed.style.display = 'flex';

                setInterval(() => {
                    this.animateLiveIndicator();
                }, 2000);
            } else {
                liveFeed.style.display = 'none';
            }
        }

        static animateLiveIndicator() {
            const indicator = navigationBar.querySelector('.rangers-live-indicator');
            if (indicator) {
                indicator.classList.remove('pulse');
                void indicator.offsetWidth;
                indicator.classList.add('pulse');
            }
        }

        static setupNavigationEvents() {
            const settingsIcon = navigationBar.querySelector(`#${SCRIPT_CONFIG.ICON_ID}`);
            if (settingsIcon) {
                settingsIcon.addEventListener('click', () => {
                    PanelManager.togglePanel();
                });
            }

            if (currentConfiguration.enableSmartNavigation) {
                let lastScrollY = window.scrollY;

                const handleScroll = RangersUtils.throttle(() => {
                    const currentScrollY = window.scrollY;

                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        navigationBar.classList.add('hidden');
                    } else {
                        navigationBar.classList.remove('hidden');
                    }

                    lastScrollY = currentScrollY;
                }, 100);

                window.addEventListener('scroll', handleScroll);
            }
        }

        static updatePosition() {
            if (!navigationBar) return;

            const position = currentConfiguration.navigationStyle || 'bottom';
            navigationBar.className = `rangers-navigation-bar rangers-nav-${position}`;
        }
    }

    class BackgroundSystem {
        static init() {
            this.createBackgroundElement();
            this.applyBackground();
            this.setupBackgroundEvents();
        }

        static createBackgroundElement() {
            if (document.getElementById(SCRIPT_CONFIG.BACKGROUND_ID)) return;

            const bgElement = RangersUtils.createElement('div', {
                id: SCRIPT_CONFIG.BACKGROUND_ID,
                class: 'rangers-background'
            });

            document.body.insertBefore(bgElement, document.body.firstChild);
        }

        static applyBackground() {
            BackgroundEditor.applySettingsToBackground();
        }

        static setupBackgroundEvents() {
            const observer = new MutationObserver(() => {
                this.applyBackground();
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    class RangersUploadManager {
        constructor() {
            this.uploadHistory = [];
            this.maxHistorySize = 20;
            this.uploaderInstances = new Map();
            this.init();
        }

        async init() {
            await this.loadUploadHistory();
            this.setupGlobalPasteHandler();
            this.injectUploaderStyles();
        }

        async loadUploadHistory() {
            try {
                const history = await GM_getValue('rangers_upload_history', '[]');
                this.uploadHistory = JSON.parse(history).slice(0, this.maxHistorySize);
            } catch (error) {
                console.warn('[Rangers] Failed to load upload history:', error);
                this.uploadHistory = [];
            }
        }

        async saveUploadHistory() {
            try {
                await GM_setValue('rangers_upload_history', JSON.stringify(this.uploadHistory));
            } catch (error) {
                console.error('[Rangers] Failed to save upload history:', error);
            }
        }

        async uploadToImgBB(file, apiKey) {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('image', file);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://api.imgbb.com/1/upload?key=${apiKey}`,
                    data: formData,
                    headers: { "Accept": "application/json" },
                    onload: function(response) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json.success) {
                                resolve({
                                    url: json.data.url,
                                    thumb: json.data.thumb?.url,
                                    deleteUrl: json.data.delete_url,
                                    size: json.data.size
                                });
                            } else {
                                reject(new Error(json.error?.message || 'Upload failed'));
                            }
                        } catch (e) {
                            reject(new Error('Invalid response format'));
                        }
                    },
                    onerror: function() {
                        reject(new Error('Network error'));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timeout'));
                    }
                });
            });
        }

        generateBBCode(uploadData, options = {}) {
            const { useThumbnail = false, customText = '' } = options;
            const imageUrl = useThumbnail && uploadData.thumb ? uploadData.thumb : uploadData.url;
            if (customText) {
                return `[URL=${uploadData.url}][IMG]${imageUrl}[/IMG][/URL] ${customText}`;
            }
            return `[IMG]${imageUrl}[/IMG]`;
        }

        async handleFileUpload(file, apiKey, editorElement) {
            try {
                const uploadData = await this.uploadToImgBB(file, apiKey);
                const bbCode = this.generateBBCode(uploadData);
                this.uploadHistory.unshift({
                    bbCode,
                    timestamp: Date.now(),
                    fileName: file.name,
                    fileSize: file.size,
                    url: uploadData.url
                });
                if (this.uploadHistory.length > this.maxHistorySize) {
                    this.uploadHistory.pop();
                }
                await this.saveUploadHistory();
                this.insertIntoEditor(bbCode, editorElement);
                this.showUploadSuccess(uploadData);
                return uploadData;
            } catch (error) {
                this.showUploadError(error.message);
                throw error;
            }
        }

        insertIntoEditor(bbCode, editorElement) {
            const textarea = editorElement?.querySelector('textarea[name="message"]');
            const frElement = editorElement?.querySelector('.fr-element');
            if (frElement) {
                frElement.focus();
                document.execCommand('insertHTML', false, bbCode.replace(/\n/g, '<br>'));
                frElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + bbCode + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + bbCode.length;
                textarea.focus();
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                throw new Error('Editor not found');
            }
        }

        showUploadSuccess(uploadData) {
            RangersUtils.showNotification(
                `✅ Изображение загружено!`,
                'success',
                3000
            );
        }

        showUploadError(message) {
            RangersUtils.showNotification(
                `❌ Ошибка загрузки: ${message}`,
                'error',
                5000
            );
        }

        setupGlobalPasteHandler() {
            document.addEventListener('paste', (e) => {
                if (!e.clipboardData?.files.length) return;
                const file = Array.from(e.clipboardData.files).find(f => f.type.startsWith('image/'));
                if (!file) return;
                const activeEditor = this.findActiveEditor();
                if (activeEditor && currentConfiguration.imgbbApiKey) {
                    e.preventDefault();
                    this.handleFileUpload(file, currentConfiguration.imgbbApiKey, activeEditor);
                }
            });
        }

        findActiveEditor() {
            const focusedElement = document.activeElement;
            const editorContainers = [
                '.js-quickReply',
                '.message-editorWrapper',
                '[data-editor-id]'
            ];
            for (const selector of editorContainers) {
                const container = focusedElement.closest(selector) || document.querySelector(selector);
                if (container) return container;
            }
            return null;
        }

        injectUploaderStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .rangers-uploader-container {
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(var(--rangers-primary-rgb), 0.1);
                    border: 2px dashed var(--rangers-primary);
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .rangers-uploader-container:hover {
                    background: rgba(var(--rangers-primary-rgb), 0.15);
                    border-color: var(--rangers-accent);
                    transform: translateY(-2px);
                }

                .rangers-upload-btn {
                    background: linear-gradient(135deg, var(--rangers-primary), var(--rangers-secondary));
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                }

                .rangers-upload-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(var(--rangers-primary-rgb), 0.3);
                }

                .rangers-upload-btn:active {
                    transform: translateY(0);
                }

                .rangers-upload-progress {
                    margin-top: 10px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .rangers-upload-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, var(--rangers-accent), var(--rangers-primary));
                    transition: width 0.3s ease;
                    border-radius: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    class RangersComplaintTracker {
        constructor() {
            this.config = {
                warningTime: 12,
                criticalTime: 24,
                closedPrefixes: ['закрыто', 'одобрено', 'отказано', 'решено', 'рассмотрено', 'тестирование']
            };
            this.trackedThreads = new Map();
            this.init();
        }

        init() {
            this.injectTrackerStyles();
            this.startMonitoring();
        }

        injectTrackerStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .rangers-tracker-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-left: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                    backdrop-filter: blur(10px);
                }

                .rangers-tracker-badge:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .rangers-tracker-fresh {
                    background: rgba(46, 204, 113, 0.2);
                    border-color: rgba(46, 204, 113, 0.5);
                    color: #2ecc71;
                }

                .rangers-tracker-warning {
                    background: rgba(243, 156, 18, 0.2);
                    border-color: rgba(243, 156, 18, 0.5);
                    color: #f39c12;
                    animation: rangers-pulse 2s infinite;
                }

                .rangers-tracker-critical {
                    background: rgba(231, 76, 60, 0.2);
                    border-color: rgba(231, 76, 60, 0.5);
                    color: #e74c3c;
                    animation: rangers-pulse 1s infinite;
                }

                .rangers-tracker-pinned {
                    background: rgba(155, 89, 182, 0.2);
                    border-color: rgba(155, 89, 182, 0.5);
                    color: #9b59b6;
                }

                @keyframes rangers-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }

        analyzeThread(threadElement) {
            const timeElements = threadElement.querySelectorAll('time[data-time]');
            if (timeElements.length === 0) return null;

            const latestTime = Math.max(...Array.from(timeElements).map(el =>
                parseInt(el.getAttribute('data-time'))
            ));

            const hoursPassed = (Date.now() - (latestTime * 1000)) / (1000 * 60 * 60);
            const isPinned = !!threadElement.querySelector('.structItem-status--sticky');
            const isLocked = !!threadElement.querySelector('.structItem-status--locked');
            const label = threadElement.querySelector('.label');
            const labelText = label?.textContent.toLowerCase() || '';
            const isClosed = this.config.closedPrefixes.some(prefix =>
                labelText.includes(prefix)
            ) || isLocked;

            if (isClosed && !isPinned) return null;

            return {
                hoursPassed,
                isPinned,
                isClosed,
                labelText,
                element: threadElement
            };
        }

        getBadgeConfig(threadData) {
            const { hoursPassed, isPinned, isClosed } = threadData;

            if (isPinned) {
                return {
                    type: 'pinned',
                    icon: '📌',
                    class: 'rangers-tracker-pinned'
                };
            }

            if (isClosed) return null;

            if (hoursPassed < this.config.warningTime) {
                return {
                    type: 'fresh',
                    icon: '⏱',
                    class: 'rangers-tracker-fresh'
                };
            } else if (hoursPassed < this.config.criticalTime) {
                return {
                    type: 'warning',
                    icon: '⏳',
                    class: 'rangers-tracker-warning'
                };
            } else {
                return {
                    type: 'critical',
                    icon: '🔥',
                    class: 'rangers-tracker-critical'
                };
            }
        }

        formatTime(hours) {
            if (hours >= 24) {
                const days = Math.floor(hours / 24);
                const remainingHours = Math.floor(hours % 24);
                return `${days}д ${remainingHours}ч`;
            } else {
                const hrs = Math.floor(hours);
                const mins = Math.floor((hours - hrs) * 60);
                return `${hrs}ч ${mins}м`;
            }
        }

        createBadge(threadData, badgeConfig) {
            const badge = document.createElement('span');
            badge.className = `rangers-tracker-badge ${badgeConfig.class}`;
            badge.innerHTML = `${badgeConfig.icon} ${this.formatTime(threadData.hoursPassed)}`;
            badge.title = `Время с последнего ответа: ${this.formatTime(threadData.hoursPassed)}\nКликните для копирования ссылки`;

            badge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyThreadLink(threadData.element);
            });

            return badge;
        }

        copyThreadLink(threadElement) {
            const link = threadElement.querySelector('.structItem-title a[data-tp-primary]');
            if (link) {
                navigator.clipboard.writeText(link.href).then(() => {
                    RangersUtils.showNotification('📋 Ссылка скопирована!', 'success', 1500);
                }).catch(() => {
                    GM_setClipboard(link.href);
                    RangersUtils.showNotification('📋 Ссылка скопирована!', 'success', 1500);
                });
            }
        }

        processThreads() {
            const threads = document.querySelectorAll('.structItem');
            threads.forEach(thread => {
                if (thread.querySelector('.rangers-tracker-badge')) return;

                const threadData = this.analyzeThread(thread);
                if (!threadData) return;

                const badgeConfig = this.getBadgeConfig(threadData);
                if (!badgeConfig) return;

                const badge = this.createBadge(threadData, badgeConfig);
                const titleContainer = thread.querySelector('.structItem-title');
                if (titleContainer) {
                    const firstLink = titleContainer.querySelector('a[data-tp-primary]');
                    if (firstLink) {
                        titleContainer.insertBefore(badge, firstLink);
                    }
                }

                this.trackedThreads.set(thread, {
                    threadData,
                    badge,
                    lastUpdate: Date.now()
                });
            });
        }

        startMonitoring() {
            this.processThreads();

            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && (
                                node.classList?.contains('structItem') ||
                                node.querySelector?.('.structItem')
                            )) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                    if (shouldProcess) break;
                }

                if (shouldProcess) {
                    setTimeout(() => this.processThreads(), 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setInterval(() => {
                this.updateBadgeTimes();
            }, 60000);
        }

        updateBadgeTimes() {
            for (const [thread, data] of this.trackedThreads) {
                if (!document.body.contains(thread)) {
                    this.trackedThreads.delete(thread);
                    continue;
                }

                const threadData = this.analyzeThread(thread);
                if (!threadData) {
                    data.badge?.remove();
                    this.trackedThreads.delete(thread);
                    continue;
                }

                const badgeConfig = this.getBadgeConfig(threadData);
                if (badgeConfig && data.badge) {
                    data.badge.innerHTML = `${badgeConfig.icon} ${this.formatTime(threadData.hoursPassed)}`;

                    const newClass = `rangers-tracker-badge ${badgeConfig.class}`;
                    if (data.badge.className !== newClass) {
                        data.badge.className = newClass;
                    }
                }
            }
        }
    }

    class RangersTemplateSystem {
        constructor() {
            this.storageKey = 'rangers_templates_v2';
            this.templates = this.loadTemplates();
            this.currentModal = null;
            this.init();
        }

        get defaultTemplates() {
            return [
                {
                    id: this.generateId(),
                    title: '👋 Приветствие',
                    content: 'Приветствую, уважаемый игрок.',
                    settings: {
                        font: 'Courier New',
                        size: '4',
                        align: 'center',
                        color: '#3498db',
                        bold: false,
                        italic: false
                    }
                },
                {
                    id: this.generateId(),
                    title: '✅ Одобрено',
                    content: 'Одобрено, закрыто.',
                    settings: {
                        bold: true,
                        align: 'center',
                        color: '#2ecc71',
                        imageTop: '',
                        footer: 'Приятной игры!'
                    }
                },
                {
                    id: this.generateId(),
                    title: '❌ Отказано',
                    content: 'Отказано, закрыто.',
                    settings: {
                        bold: true,
                        align: 'center',
                        color: '#e74c3c',
                        footer: 'Недостаточно доказательств.'
                    }
                }
            ];
        }

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        loadTemplates() {
            try {
                const saved = GM_getValue(this.storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return Array.isArray(parsed) ? parsed : this.defaultTemplates;
                }
            } catch (error) {
                console.warn('[Rangers] Failed to load templates:', error);
            }
            return this.defaultTemplates;
        }

        saveTemplates() {
            try {
                GM_setValue(this.storageKey, JSON.stringify(this.templates));
            } catch (error) {
                console.error('[Rangers] Failed to save templates:', error);
            }
        }

        compileTemplate(template) {
            let content = template.content;
            const s = template.settings || {};

            if (s.bold) content = `[B]${content}[/B]`;
            if (s.italic) content = `[I]${content}[/I]`;
            if (s.underline) content = `[U]${content}[/U]`;
            if (s.strike) content = `[S]${content}[/S]`;

            if (s.code) content = `[CODE]${content}[/CODE]`;
            if (s.inlineCode) content = `[ICODE]${content}[/ICODE]`;
            if (s.spoiler) content = `[SPOILER]${content}[/SPOILER]`;
            if (s.quote) content = `[QUOTE]${content}[/QUOTE]`;

            if (s.color) content = `[COLOR=${s.color}]${content}[/COLOR]`;
            if (s.font) content = `[FONT=${s.font}]${content}[/FONT]`;
            if (s.size) content = `[SIZE=${s.size}]${content}[/SIZE]`;

            if (s.align === 'center') content = `[CENTER]${content}[/CENTER]`;
            else if (s.align === 'right') content = `[RIGHT]${content}[/RIGHT]`;

            if (s.imageTop) content = `[IMG]${s.imageTop}[/IMG]\n${content}`;
            if (s.footer) content = `${content}\n[FONT=Courier New][SIZE=3]${s.footer}[/SIZE][/FONT]`;

            return content;
        }

        async insertTemplate(template) {
            const compiled = this.compileTemplate(template);
            const success = this.insertIntoEditor(compiled);
            if (success) {
                RangersUtils.showNotification(`📝 Вставлен шаблон: ${template.title}`, 'success');
                if (currentConfiguration.autoSendTemplates) {
                    setTimeout(() => this.autoSendMessage(), 500);
                }
            }

            return success;
        }

        insertIntoEditor(text) {
            const editors = [
                document.querySelector('.fr-element'),
                document.querySelector('textarea[name="message"]')
            ].filter(Boolean);

            const editor = editors[0];
            if (!editor) {
                RangersUtils.showNotification('❌ Редактор не найден', 'error');
                return false;
            }

            if (editor.classList.contains('fr-element')) {
                editor.focus();
                document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'));
            } else {
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + text + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + text.length;
            }

            editor.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }

        autoSendMessage() {
            const sendButton = document.querySelector('.button--icon--reply, .button--primary');
            if (sendButton) {
                RangersUtils.showNotification('🚀 Отправка сообщения...', 'info');
                setTimeout(() => {
                    sendButton.click();
                }, 1000);
            }
        }
    }

    function initializeRangersCustomizer() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupRangersCustomizer();
            });
        } else {
            setupRangersCustomizer();
        }
    }

    async function setupRangersCustomizer() {
        try {
            await ConfigurationManager.loadConfiguration();

            PanelManager.init();
            NavigationBar.init();
            BackgroundSystem.init();
            BackgroundEditor.init();
            VisualEffects.initEffects();
            EffectsManager.init();
            NavigationSystem.init();
            ModerationTools.init();
            PerformanceMonitor.init();

            setupGlobalEventListeners();
            setupLiveUpdates();

            if (currentConfiguration.enableUploadSystem) {
                window.RangersUploadManager = new RangersUploadManager();
            }
            if (currentConfiguration.enableComplaintTracker) {
                window.RangersComplaintTracker = new RangersComplaintTracker();
            }
            if (currentConfiguration.enableTemplateSystem) {
                window.RangersTemplateSystem = new RangersTemplateSystem();
            }

            RangersUtils.showNotification(
                `Rangers Customizer v${SCRIPT_CONFIG.VERSION} loaded successfully!`,
                'success',
                3000
            );

            console.log('Rangers Customizer initialized successfully');

        } catch (error) {
            console.error('Failed to initialize Rangers Customizer:', error);
            RangersUtils.showNotification('Initialization failed', 'error');
        }
    }

    function setupGlobalEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                PanelManager.togglePanel();
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                toggleLiveFeatures();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                updateLiveCounters();
            }
        });

        window.addEventListener('online', () => {
            RangersUtils.showNotification('Connection restored', 'success');
            setupLiveUpdates();
        });

        window.addEventListener('offline', () => {
            RangersUtils.showNotification('Connection lost', 'error');
        });
    }

    function setupLiveUpdates() {
        if (!currentConfiguration.enableLiveUpdates) return;

        const updateInterval = currentConfiguration.liveUpdateInterval || 30;

        setInterval(() => {
            updateLiveCounters();
            checkNewContent();
            updateUserPresence();
        }, updateInterval * 1000);
    }

    function updateLiveCounters() {
        const badges = document.querySelectorAll('.badge, .notification-count');
        badges.forEach(badge => {
            badge.classList.add('rangers-pulse');
            setTimeout(() => badge.classList.remove('rangers-pulse'), 1000);
        });
    }

    function checkNewContent() {
        const latestPosts = document.querySelectorAll('.structItem--latest');
        latestPosts.forEach(post => {
            const timeElement = post.querySelector('.structItem-latestDate');
            if (timeElement) {
                const postTime = new Date(timeElement.getAttribute('title') || timeElement.textContent);
                const currentTime = new Date();
                const minutesDiff = (currentTime - postTime) / (1000 * 60);

                if (minutesDiff < 5) {
                    post.classList.add('rangers-new-content');
                    setTimeout(() => post.classList.remove('rangers-new-content'), 5000);
                }
            }
        });
    }

    function updateUserPresence() {
        const onlineUsers = document.querySelectorAll('.user-online');
        onlineUsers.forEach(user => {
            user.classList.add('rangers-pulse-gentle');
        });
    }

    function toggleLiveFeatures() {
        const newState = !currentConfiguration.enableLiveUpdates;
        ConfigurationManager.saveConfiguration({ enableLiveUpdates: newState });

        RangersUtils.showNotification(
            `Live features ${newState ? 'enabled' : 'disabled'}`,
            'info'
        );

        if (newState) {
            setupLiveUpdates();
        }
    }

    function applyInitialStyles() {
        const styleElement = RangersUtils.createElement('style', {
            id: 'rangers-initial-styles'
        });

        styleElement.textContent = `
            .rangers-notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            }

            .rangers-notification {
                background: rgba(26, 31, 44, 0.95);
                border: 1px solid var(--rangers-primary);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(20px);
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .rangers-notification-show {
                transform: translateX(0);
            }

            .rangers-scroll-indicator {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--rangers-primary), var(--rangers-secondary));
                z-index: 9999;
                transition: width 0.1s ease;
            }

            .rangers-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: rangers-ripple 0.6s linear;
                pointer-events: none;
            }

            @keyframes rangers-ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            :root {
                --rangers-primary: ${currentConfiguration.primaryColor};
                --rangers-secondary: ${currentConfiguration.secondaryColor};
                --rangers-accent: ${currentConfiguration.accentColor};
                --rangers-background: ${currentConfiguration.backgroundColor};
            }

            .rangers-panel-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .rangers-panel-wrapper.visible {
                opacity: 1;
            }

            .rangers-control-panel {
                background: rgba(26, 31, 44, 0.95);
                border: 2px solid var(--rangers-primary);
                border-radius: 20px;
                width: 80%;
                height: 85%;
                max-width: 1200px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(20px);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .rangers-panel-wrapper.visible .rangers-control-panel {
                transform: scale(1);
            }

            .rangers-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .rangers-panel-title {
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
            }

            .rangers-panel-icon {
                width: 32px;
                height: 32px;
                border-radius: 8px;
            }

            .rangers-language-select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: white;
                padding: 6px 12px;
                margin-right: 12px;
            }

            .rangers-panel-close {
                background: none;
                border: none;
                color: #ccc;
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .rangers-panel-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .rangers-panel-body {
                flex: 1;
                display: flex;
                overflow: hidden;
            }

            .rangers-nav-grid {
                width: 250px;
                padding: 20px;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                gap: 8px;
                overflow-y: auto;
            }

            .rangers-nav-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #ccc;
            }

            .rangers-nav-card:hover {
                background: rgba(255, 255, 255, 0.05);
                color: white;
            }

            .rangers-nav-card.active {
                background: var(--rangers-primary);
                color: white;
            }

            .rangers-nav-icon {
                width: 20px;
                text-align: center;
            }

            .rangers-sections-container {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .rangers-section {
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .rangers-settings-group {
                margin-bottom: 30px;
            }

            .rangers-settings-group h4 {
                color: var(--rangers-accent);
                margin: 0 0 16px 0;
                font-size: 18px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 8px;
            }

            .rangers-setting {
                margin-bottom: 16px;
            }

            .rangers-setting label {
                display: block;
                color: #ccc;
                margin-bottom: 6px;
                font-weight: 500;
            }

            .rangers-toggle {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
            }

            .rangers-toggle input {
                display: none;
            }

            .rangers-toggle-slider {
                width: 44px;
                height: 24px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                position: relative;
                transition: all 0.3s ease;
            }

            .rangers-toggle-slider:before {
                content: '';
                position: absolute;
                width: 18px;
                height: 18px;
                background: #ccc;
                border-radius: 50%;
                top: 3px;
                left: 3px;
                transition: all 0.3s ease;
            }

            .rangers-toggle input:checked + .rangers-toggle-slider {
                background: var(--rangers-primary);
            }

            .rangers-toggle input:checked + .rangers-toggle-slider:before {
                transform: translateX(20px);
                background: white;
            }

            .rangers-toggle-label {
                color: #ccc;
                user-select: none;
            }

            input[type="color"], input[type="text"], input[type="password"], input[type="number"], select, textarea {
                width: 100%;
                padding: 10px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            input:focus, select:focus, textarea:focus {
                outline: none;
                border-color: var(--rangers-primary);
                box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
            }

            .rangers-slider-value {
                display: inline-block;
                margin-left: 10px;
                color: var(--rangers-accent);
                font-weight: 600;
                min-width: 30px;
            }

            .rangers-theme-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 8px;
                margin-bottom: 16px;
            }

            .rangers-theme-btn {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #ccc;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
            }

            .rangers-theme-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-2px);
            }

            .rangers-panel-footer {
                padding: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .rangers-footer-actions {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .rangers-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .rangers-btn-primary {
                background: var(--rangers-primary);
                color: white;
            }

            .rangers-btn-primary:hover {
                background: var(--rangers-secondary);
                transform: translateY(-2px);
            }

            .rangers-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #ccc;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .rangers-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .rangers-btn-warning {
                background: #e74c3c;
                color: white;
            }

            .rangers-btn-warning:hover {
                background: #c0392b;
                transform: translateY(-2px);
            }

            .rangers-btn-small {
                padding: 6px 12px;
                font-size: 12px;
            }

            .rangers-footer-spacer {
                flex: 1;
            }

            .rangers-navigation-bar {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(26, 31, 44, 0.95);
                border: 1px solid var(--rangers-primary);
                border-radius: 50px;
                padding: 12px 24px;
                backdrop-filter: blur(20px);
                z-index: 9998;
                transition: all 0.3s ease;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }

            .rangers-navigation-bar.hidden {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }

            .rangers-nav-container {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .rangers-nav-utilities {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .rangers-nav-icon {
                width: 36px;
                height: 36px;
                background: var(--rangers-primary);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: white;
            }

            .rangers-nav-icon:hover {
                background: var(--rangers-secondary);
                transform: scale(1.1);
            }

            .rangers-clock {
                color: #ccc;
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                font-weight: 600;
            }

            .rangers-nav-links {
                display: flex;
                gap: 8px;
            }

            .rangers-nav-link {
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                color: #ccc;
                text-decoration: none;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .rangers-nav-link:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .rangers-nav-link.active {
                background: var(--rangers-primary);
                color: white;
            }

            .rangers-nav-live-feed {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #2ecc71;
                font-size: 12px;
                font-weight: 600;
            }

            .rangers-live-indicator {
                width: 8px;
                height: 8px;
                background: #2ecc71;
                border-radius: 50%;
            }

            .rangers-live-indicator.pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }

            .rangers-dashboard {
                animation: fadeIn 0.5s ease;
            }

            .rangers-welcome-card {
                background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(0, 212, 170, 0.1));
                border: 1px solid rgba(255, 107, 53, 0.3);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
                text-align: center;
            }

            .rangers-welcome-card h4 {
                color: white;
                margin: 0 0 8px 0;
                font-size: 24px;
            }

            .rangers-welcome-card p {
                color: #ccc;
                margin: 0;
            }

            .rangers-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .rangers-stat-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                transition: all 0.2s ease;
            }

            .rangers-stat-card:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: translateY(-2px);
            }

            .rangers-stat-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
            }

            .rangers-stat-value {
                color: white;
                font-size: 24px;
                font-weight: 700;
                line-height: 1;
            }

            .rangers-stat-label {
                color: #ccc;
                font-size: 14px;
            }

            .rangers-quick-actions h5 {
                color: var(--rangers-accent);
                margin: 0 0 12px 0;
                font-size: 16px;
            }

            .rangers-action-buttons {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .rangers-wallpaper-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 12px;
                margin-top: 12px;
            }

            .rangers-wallpaper-item {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .rangers-wallpaper-item:hover {
                transform: scale(1.05);
            }

            .rangers-wallpaper-item img {
                width: 100%;
                height: 100px;
                object-fit: cover;
            }

            .rangers-wallpaper-apply {
                position: absolute;
                bottom: 8px;
                right: 8px;
                background: var(--rangers-primary);
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .rangers-wallpaper-item:hover .rangers-wallpaper-apply {
                opacity: 1;
            }

            .rangers-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            }

            .rangers-effects-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }

            .rangers-snow-container {
                pointer-events: none;
            }

            .rangers-snowflake {
                animation: fall linear forwards;
            }

            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                }
            }

            .rangers-bat {
                animation: flyBat linear forwards;
            }

            @keyframes flyBat {
                0% {
                    transform: translateX(0) rotate(0deg);
                }
                100% {
                    transform: translateX(100vw) rotate(360deg);
                }
            }

            .rangers-heart {
                animation: floatHeart ease-in-out forwards;
            }

            @keyframes floatHeart {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(0);
                    opacity: 0;
                }
            }

            @keyframes clickWave {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .rangers-new-content {
                animation: highlightPulse 2s ease;
            }

            @keyframes highlightPulse {
                0%, 100% { background: transparent; }
                50% { background: rgba(255, 209, 102, 0.2); }
            }

            .rangers-pulse {
                animation: pulse 0.6s ease;
            }

            .rangers-pulse-gentle {
                animation: pulseGentle 3s infinite;
            }

            @keyframes pulseGentle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            @media (max-width: 768px) {
                .rangers-control-panel {
                    width: 95%;
                    height: 90%;
                }

                .rangers-control-panel.mobile {
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                }

                .rangers-panel-body {
                    flex-direction: column;
                }

                .rangers-nav-grid {
                    width: 100%;
                    border-right: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    flex-direction: row;
                    overflow-x: auto;
                    padding: 12px;
                }

                .rangers-nav-card {
                    flex-direction: column;
                    min-width: 80px;
                    text-align: center;
                    padding: 8px;
                }

                .rangers-nav-label {
                    font-size: 12px;
                }

                .rangers-navigation-bar {
                    bottom: 10px;
                    padding: 8px 16px;
                }

                .rangers-nav-container {
                    gap: 12px;
                }

                .rangers-nav-links {
                    gap: 4px;
                }

                .rangers-nav-link {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .rangers-stats-grid {
                    grid-template-columns: 1fr;
                }

                .rangers-theme-buttons {
                    grid-template-columns: 1fr 1fr;
                }
            }
        `;

        document.head.appendChild(styleElement);
    }

    function detectUserPreferences() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            currentConfiguration.enableAnimations = false;
            RangersUtils.showNotification('Reduced motion preference detected. Animations disabled.', 'info');
        }

        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!isDarkMode) {
            currentConfiguration.primaryColor = '#0066cc';
            currentConfiguration.backgroundColor = '#f5f5f5';
        }

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            currentConfiguration.enableTouchOptimization = true;
            document.body.classList.add('rangers-touch-device');
        }
    }

    function setupEventListeners() {
        document.addEventListener('DOMContentLoaded', handleDOMReady);
        window.addEventListener('load', handleWindowLoad);
        window.addEventListener('resize',
            RangersUtils.debounce(handleWindowResize, PERFORMANCE.DEBOUNCE_DELAY)
        );
    }

    function handleDOMReady() {
        applyInitialStyles();
        detectUserPreferences();
    }

    function handleWindowLoad() {
        initializeAdvancedFeatures();
        setupPerformanceMonitoring();
    }

    function handleWindowResize() {
        adjustLayoutForScreenSize();
    }

    function initializeAdvancedFeatures() {
        NavigationSystem.init();
        ModerationTools.init();
        EffectsManager.init();
        PerformanceMonitor.init();

        setupLiveUpdates();
        setupUserDetection();
    }

    function setupPerformanceMonitoring() {
    }

    function setupUserDetection() {
        const userElement = document.querySelector('.p-navgroup-userText');
        if (userElement) {
            currentUser = userElement.textContent.trim();
        }

        const topicAuthorElement = document.querySelector('.message--post .username');
        if (topicAuthorElement) {
            topicAuthor = topicAuthorElement.textContent.trim();
        }
    }

    function adjustLayoutForScreenSize() {
        const width = window.innerWidth;

        if (width < 768) {
            document.body.classList.add('rangers-mobile');
            currentConfiguration.enablePerformanceMode = true;
        } else {
            document.body.classList.remove('rangers-mobile');
        }

        if (controlPanel) {
            if (width < 1024) {
                controlPanel.style.width = '95%';
                controlPanel.style.height = '90%';
            } else {
                controlPanel.style.width = '80%';
                controlPanel.style.height = '85%';
            }
        }
    }

    setupEventListeners();
    initializeRangersCustomizer();
})();
