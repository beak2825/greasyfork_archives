// ==UserScript==
// @name         Rexor Ultimate Forum Customizer
// @namespace    http://rexor-customizer.com
// @version      1.0
// @description  Полная кастомизация форума 
// @author       Rexor
// @match        https://forum.blackrussia.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         none
// @downloadURL https://update.greasyfork.org/scripts/557148/Rexor%20Ultimate%20Forum%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557148/Rexor%20Ultimate%20Forum%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        // Фон
        backgroundImage: 'https://i.imgur.com/8qk5B7j.jpg',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        
        // Цвета
        primaryColor: '#ff4444',
        secondaryColor: '#4444ff',
        accentColor: '#44ff44',
        textColor: '#ffffff',
        backgroundColor: '#1a1a1a',
        
        // Шрифты
        fontFamily: 'Montserrat',
        fontSize: '14px',
        fontWeight: '400',
        
        // Прозрачности
        containerOpacity: 0.9,
        headerOpacity: 0.95,
        
        // Эффекты
        enableBlur: true,
        blurAmount: '5px',
        enableShadows: true,
        enableAnimations: true,
        
        // Текущая тема
        currentTheme: 'custom'
    };

    class UltimateCustomizer {
        constructor() {
            this.config = this.loadConfig();
            this.isPanelOpen = true; // Панель открыта по умолчанию
            this.init();
        }

        loadConfig() {
            const saved = GM_getValue('rexor_ultimate_config');
            return { ...DEFAULT_CONFIG, ...saved };
        }

        saveConfig() {
            GM_setValue('rexor_ultimate_config', this.config);
        }

        init() {
            this.applyStyles();
            this.createFloatingPanel();
            this.setupObservers();
            this.registerCommands();
            console.log('Rexor Customizer загружен! Панель должна быть видна.');
        }

        applyStyles() {
            const css = this.generateCSS();
            const styleId = 'rexor-ultimate-styles';
            
            let styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.textContent = css;
            } else {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                styleElement.textContent = css;
                document.head.appendChild(styleElement);
            }
        }

        generateCSS() {
            return `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&family=Open+Sans:wght@300;400;600&family=Lato:wght@300;400;700&family=Oswald:wght@300;400;500&family=Raleway:wght@300;400;500;600&family=Ubuntu:wght@300;400;500&family=Playfair+Display:wght@400;500;600&family=Source+Sans+Pro:wght@300;400;600&display=swap');

                :root {
                    --rexor-primary: ${this.config.primaryColor};
                    --rexor-secondary: ${this.config.secondaryColor};
                    --rexor-accent: ${this.config.accentColor};
                    --rexor-text: ${this.config.textColor};
                    --rexor-bg: ${this.config.backgroundColor};
                    --rexor-opacity: ${this.config.containerOpacity};
                    --rexor-font: ${this.config.fontFamily};
                }

                html {
                    background-image: url('${this.config.backgroundImage}') !important;
                    background-size: ${this.config.backgroundSize} !important;
                    background-position: ${this.config.backgroundPosition} !important;
                    background-repeat: ${this.config.backgroundRepeat} !important;
                    background-attachment: ${this.config.backgroundAttachment} !important;
                }

                body {
                    font-family: ${this.config.fontFamily}, sans-serif !important;
                    font-size: ${this.config.fontSize} !important;
                    font-weight: ${this.config.fontWeight} !important;
                    color: ${this.config.textColor} !important;
                }

                /* Основные контейнеры */
                .block-container, .p-body-inner, .p-body-main--withSidebar .p-body-content {
                    background: rgba(26, 26, 26, ${this.config.containerOpacity}) !important;
                    ${this.config.enableBlur ? `backdrop-filter: blur(${this.config.blurAmount});` : ''}
                    border: 1px solid ${this.config.primaryColor} !important;
                    border-radius: 12px !important;
                    ${this.config.enableShadows ? 'box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;' : ''}
                }

                /* Заголовки */
                h1, h2, h3, h4, h5, h6 {
                    color: ${this.config.primaryColor} !important;
                    ${this.config.enableShadows ? `text-shadow: 0 0 10px ${this.config.primaryColor}40 !important;` : ''}
                    font-weight: 600 !important;
                }

                /* Навигация */
                .p-nav, .p-staffBar, .p-header {
                    background: rgba(26, 26, 26, ${this.config.headerOpacity}) !important;
                    ${this.config.enableBlur ? `backdrop-filter: blur(${this.config.blurAmount});` : ''}
                    border-bottom: 2px solid ${this.config.primaryColor} !important;
                }

                .p-nav-list .p-navEl {
                    color: ${this.config.textColor} !important;
                    transition: all 0.3s ease !important;
                }

                .p-nav-list .p-navEl.is-selected {
                    background: ${this.config.primaryColor} !important;
                    color: #000 !important;
                }

                /* Сообщения */
                .message, .message-cell {
                    background: rgba(40, 40, 40, ${this.config.containerOpacity}) !important;
                    border: 1px solid ${this.config.secondaryColor} !important;
                    ${this.config.enableShadows ? 'box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;' : ''}
                }

                .message-userArrow:after {
                    border-right-color: rgba(40, 40, 40, ${this.config.containerOpacity}) !important;
                }

                /* Кнопки */
                .button, button {
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.secondaryColor}) !important;
                    color: #fff !important;
                    border: none !important;
                    border-radius: 8px !important;
                    transition: all 0.3s ease !important;
                    ${this.config.enableShadows ? 'box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;' : ''}
                }

                .button:hover, button:hover {
                    transform: translateY(-2px) !important;
                    ${this.config.enableShadows ? 'box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;' : ''}
                }

                /* Ссылки */
                a {
                    color: ${this.config.accentColor} !important;
                    transition: color 0.3s ease !important;
                }

                a:hover {
                    color: ${this.config.primaryColor} !important;
                }

                /* Формы */
                .input, input, textarea, select {
                    background: rgba(50, 50, 50, 0.8) !important;
                    border: 1px solid ${this.config.secondaryColor} !important;
                    color: ${this.config.textColor} !important;
                    border-radius: 6px !important;
                }

                /* Скроллбар */
                ::-webkit-scrollbar {
                    width: 12px !important;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(40, 40, 40, 0.8) !important;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.secondaryColor}) !important;
                    border-radius: 6px !important;
                }

                /* Аватары */
                .avatar {
                    border: 2px solid ${this.config.accentColor} !important;
                    border-radius: 50% !important;
                    ${this.config.enableShadows ? `box-shadow: 0 0 20px ${this.config.accentColor}40 !important;` : ''}
                }

                /* Анимации */
                ${this.config.enableAnimations ? `
                    .block-container, .message, .button {
                        transition: all 0.3s ease !important;
                    }
                    
                    .p-navEl, a {
                        transition: all 0.3s ease !important;
                    }
                ` : ''}

                /* Стили для панели управления */
                #rexor-control-panel {
                    position: fixed;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                    width: 380px;
                    background: rgba(30, 30, 35, 0.95);
                    backdrop-filter: blur(20px);
                    border: 2px solid ${this.config.primaryColor};
                    border-radius: 20px 0 0 20px;
                    padding: 20px;
                    z-index: 10000;
                    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    color: #fff;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: -10px 0 50px rgba(0,0,0,0.5);
                }

                #rexor-control-panel.hidden {
                    right: -400px;
                }

                .rexor-tab {
                    background: none;
                    border: none;
                    padding: 10px;
                    color: #ccc;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    flex: 1;
                    text-align: center;
                }

                .rexor-tab.active {
                    background: ${this.config.primaryColor};
                    color: #000;
                    font-weight: bold;
                }

                .tab-pane {
                    display: none;
                }

                .tab-pane.active {
                    display: block;
                }

                .setting-group {
                    margin-bottom: 15px;
                }

                .setting-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #fff;
                }

                .rexor-panel-toggle {
                    position: absolute;
                    left: -50px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: ${this.config.primaryColor};
                    color: #000;
                    padding: 15px 10px;
                    border-radius: 10px 0 0 10px;
                    cursor: pointer;
                    writing-mode: vertical-lr;
                    font-weight: bold;
                    text-align: center;
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
        }

        createFloatingPanel() {
            // Удаляем старую панель если есть
            const oldPanel = document.getElementById('rexor-control-panel');
            if (oldPanel) {
                oldPanel.remove();
            }

            this.panel = document.createElement('div');
            this.panel.id = 'rexor-control-panel';
            this.panel.innerHTML = this.generatePanelHTML();
            
            // Добавляем класс hidden если панель закрыта
            if (!this.isPanelOpen) {
                this.panel.classList.add('hidden');
            }
            
            document.body.appendChild(this.panel);
            this.attachPanelEvents();
            
            console.log('Панель управления создана!');
        }

        generatePanelHTML() {
            return `
                <div class="rexor-panel-header">
                    <h3 style="margin: 0; color: ${this.config.primaryColor}; display: flex; align-items: center; gap: 10px;">
                        🎨 Rexor Customizer
                        <button id="rexor-close-panel" style="margin-left: auto; background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
                    </h3>
                    <div style="font-size: 12px; color: #ccc; margin-top: 5px;">Полная кастомизация форума</div>
                </div>

                <div class="rexor-tabs" style="display: flex; gap: 5px; margin: 15px 0; border-bottom: 1px solid #444; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 8px;">
                    <button class="rexor-tab active" data-tab="background">🌅 Фон</button>
                    <button class="rexor-tab" data-tab="colors">🎨 Цвета</button>
                    <button class="rexor-tab" data-tab="fonts">🔤 Шрифты</button>
                    <button class="rexor-tab" data-tab="themes">🎪 Темы</button>
                </div>

                <div class="rexor-tab-content">
                    <!-- Вкладка Фон -->
                    <div id="tab-background" class="tab-pane active">
                        <div class="setting-group">
                            <label>URL фонового изображения:</label>
                            <input type="text" id="rexor-bg-url" value="${this.config.backgroundImage}" 
                                   style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff; margin-bottom: 8px;">
                            <div style="display: flex; gap: 10px;">
                                <button onclick="rexorCustomizer.handleBackgroundUploadClick()" style="flex: 1; padding: 8px; background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                                    📁 Загрузить
                                </button>
                                <button onclick="rexorCustomizer.resetBackground()" style="flex: 1; padding: 8px; background: #666; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                                    🔄 Сброс
                                </button>
                            </div>
                            <input type="file" id="rexor-bg-upload" accept="image/*" style="display: none;">
                        </div>

                        <div class="setting-group">
                            <label>Размер фона:</label>
                            <select id="rexor-bg-size" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff;">
                                <option value="cover" ${this.config.backgroundSize === 'cover' ? 'selected' : ''}>Cover (заполнить)</option>
                                <option value="contain" ${this.config.backgroundSize === 'contain' ? 'selected' : ''}>Contain (вместить)</option>
                                <option value="auto" ${this.config.backgroundSize === 'auto' ? 'selected' : ''}>Auto (авто)</option>
                            </select>
                        </div>

                        <div class="setting-group">
                            <label>Позиция фона:</label>
                            <select id="rexor-bg-position" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff;">
                                <option value="center" ${this.config.backgroundPosition === 'center' ? 'selected' : ''}>Center (центр)</option>
                                <option value="top" ${this.config.backgroundPosition === 'top' ? 'selected' : ''}>Top (верх)</option>
                                <option value="bottom" ${this.config.backgroundPosition === 'bottom' ? 'selected' : ''}>Bottom (низ)</option>
                                <option value="left" ${this.config.backgroundPosition === 'left' ? 'selected' : ''}>Left (лево)</option>
                                <option value="right" ${this.config.backgroundPosition === 'right' ? 'selected' : ''}>Right (право)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Вкладка Цвета -->
                    <div id="tab-colors" class="tab-pane">
                        <div class="color-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="color-picker">
                                <label>Основной цвет:</label>
                                <input type="color" id="rexor-primary-color" value="${this.config.primaryColor}" style="width: 100%; height: 40px; cursor: pointer;">
                            </div>
                            <div class="color-picker">
                                <label>Вторичный цвет:</label>
                                <input type="color" id="rexor-secondary-color" value="${this.config.secondaryColor}" style="width: 100%; height: 40px; cursor: pointer;">
                            </div>
                            <div class="color-picker">
                                <label>Акцентный цвет:</label>
                                <input type="color" id="rexor-accent-color" value="${this.config.accentColor}" style="width: 100%; height: 40px; cursor: pointer;">
                            </div>
                            <div class="color-picker">
                                <label>Цвет текста:</label>
                                <input type="color" id="rexor-text-color" value="${this.config.textColor}" style="width: 100%; height: 40px; cursor: pointer;">
                            </div>
                        </div>

                        <div class="setting-group">
                            <label>Прозрачность контейнеров: <span id="opacity-value">${this.config.containerOpacity}</span></label>
                            <input type="range" id="rexor-opacity" min="0.1" max="1" step="0.05" value="${this.config.containerOpacity}" style="width: 100%;">
                        </div>

                        <div class="setting-group">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="rexor-enable-blur" ${this.config.enableBlur ? 'checked' : ''}>
                                Размытие фона
                            </label>
                        </div>

                        <div class="setting-group">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="rexor-enable-shadows" ${this.config.enableShadows ? 'checked' : ''}>
                                Тени элементов
                            </label>
                        </div>

                        <div class="setting-group">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="rexor-enable-animations" ${this.config.enableAnimations ? 'checked' : ''}>
                                Анимации
                            </label>
                        </div>
                    </div>

                    <!-- Вкладка Шрифты -->
                    <div id="tab-fonts" class="tab-pane">
                        <div class="setting-group">
                            <label>Шрифт:</label>
                            <select id="rexor-font-family" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff;">
                                ${this.getFontOptions()}
                            </select>
                        </div>

                        <div class="setting-group">
                            <label>Размер шрифта:</label>
                            <select id="rexor-font-size" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff;">
                                <option value="12px" ${this.config.fontSize === '12px' ? 'selected' : ''}>12px (маленький)</option>
                                <option value="14px" ${this.config.fontSize === '14px' ? 'selected' : ''}>14px (стандартный)</option>
                                <option value="16px" ${this.config.fontSize === '16px' ? 'selected' : ''}>16px (большой)</option>
                                <option value="18px" ${this.config.fontSize === '18px' ? 'selected' : ''}>18px (очень большой)</option>
                            </select>
                        </div>

                        <div class="setting-group">
                            <label>Насыщенность:</label>
                            <select id="rexor-font-weight" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: #fff;">
                                <option value="300" ${this.config.fontWeight === '300' ? 'selected' : ''}>Light (тонкий)</option>
                                <option value="400" ${this.config.fontWeight === '400' ? 'selected' : ''}>Normal (нормальный)</option>
                                <option value="500" ${this.config.fontWeight === '500' ? 'selected' : ''}>Medium (средний)</option>
                                <option value="600" ${this.config.fontWeight === '600' ? 'selected' : ''}>Bold (жирный)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Вкладка Темы -->
                    <div id="tab-themes" class="tab-pane">
                        <div style="margin-bottom: 15px; color: #ccc; font-size: 13px;">
                            Выберите готовую тему или настройте всё вручную
                        </div>
                        <div class="themes-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button class="theme-btn" data-theme="dark" style="padding: 12px; background: #1a1a1a; color: #fff; border: 2px solid #333; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🌙 Тёмная
                            </button>
                            <button class="theme-btn" data-theme="blue" style="padding: 12px; background: #1a1a2e; color: #fff; border: 2px solid #16213e; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🔷 Синяя
                            </button>
                            <button class="theme-btn" data-theme="green" style="padding: 12px; background: #1a2a1a; color: #fff; border: 2px solid #2d5a2d; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🍏 Зелёная
                            </button>
                            <button class="theme-btn" data-theme="purple" style="padding: 12px; background: #2a1a2a; color: #fff; border: 2px solid #5a2d5a; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🟣 Фиолетовая
                            </button>
                            <button class="theme-btn" data-theme="red" style="padding: 12px; background: #2a1a1a; color: #fff; border: 2px solid #5a2d2d; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🔴 Красная
                            </button>
                            <button class="theme-btn" data-theme="orange" style="padding: 12px; background: #2a2a1a; color: #fff; border: 2px solid #5a5a2d; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                                🟠 Оранжевая
                            </button>
                        </div>

                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            <button id="rexor-save-theme" style="flex: 1; padding: 12px; background: #4CAF50; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                💾 Сохранить
                            </button>
                            <button id="rexor-reset" style="flex: 1; padding: 12px; background: #f44336; color: #fff; border: none; border-radius: 8px; cursor: pointer;">
                                🔄 Сбросить
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rexor-panel-toggle" onclick="rexorCustomizer.togglePanel()">
                    🎨 REXOR
                </div>
            `;
        }

        getFontOptions() {
            const fonts = [
                'Montserrat', 'Roboto', 'Open Sans', 'Lato', 
                'Oswald', 'Raleway', 'Ubuntu', 'Playfair Display', 'Source Sans Pro'
            ];
            
            return fonts.map(font => 
                `<option value="${font}" ${this.config.fontFamily === font ? 'selected' : ''}>${font}</option>`
            ).join('');
        }

        attachPanelEvents() {
            // Переключение вкладок
            this.panel.querySelectorAll('.rexor-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.panel.querySelectorAll('.rexor-tab').forEach(t => t.classList.remove('active'));
                    this.panel.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const tabId = `tab-${tab.dataset.tab}`;
                    const tabPane = this.panel.querySelector(`#${tabId}`);
                    if (tabPane) {
                        tabPane.classList.add('active');
                    }
                });
            });

            // Закрытие панели
            this.panel.querySelector('#rexor-close-panel').addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });

            // Сохранение настроек
            this.panel.querySelector('#rexor-save-theme').addEventListener('click', () => {
                this.saveCurrentSettings();
            });

            // Сброс настроек
            this.panel.querySelector('#rexor-reset').addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
                    this.resetSettings();
                }
            });

            // Применение тем
            this.panel.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.applyTheme(btn.dataset.theme);
                });
            });

            // Загрузка фона
            const fileInput = this.panel.querySelector('#rexor-bg-upload');
            fileInput.addEventListener('change', (e) => {
                this.handleBackgroundUpload(e.target);
            });

            // Реальное время обновление
            this.setupLivePreview();

            console.log('События панели прикреплены');
        }

        setupLivePreview() {
            const inputs = this.panel.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.updateConfigFromPanel();
                    this.applyStyles();
                });
                
                input.addEventListener('change', () => {
                    this.updateConfigFromPanel();
                    this.applyStyles();
                });
            });

            // Обновление значения прозрачности
            const opacitySlider = this.panel.querySelector('#rexor-opacity');
            const opacityValue = this.panel.querySelector('#opacity-value');
            if (opacitySlider && opacityValue) {
                opacitySlider.addEventListener('input', () => {
                    opacityValue.textContent = opacitySlider.value;
                });
            }
        }

        updateConfigFromPanel() {
            this.config.backgroundImage = this.panel.querySelector('#rexor-bg-url').value;
            this.config.backgroundSize = this.panel.querySelector('#rexor-bg-size').value;
            this.config.backgroundPosition = this.panel.querySelector('#rexor-bg-position').value;
            
            this.config.primaryColor = this.panel.querySelector('#rexor-primary-color').value;
            this.config.secondaryColor = this.panel.querySelector('#rexor-secondary-color').value;
            this.config.accentColor = this.panel.querySelector('#rexor-accent-color').value;
            this.config.textColor = this.panel.querySelector('#rexor-text-color').value;
            
            this.config.containerOpacity = this.panel.querySelector('#rexor-opacity').value;
            this.config.enableBlur = this.panel.querySelector('#rexor-enable-blur').checked;
            this.config.enableShadows = this.panel.querySelector('#rexor-enable-shadows').checked;
            this.config.enableAnimations = this.panel.querySelector('#rexor-enable-animations').checked;
            
            this.config.fontFamily = this.panel.querySelector('#rexor-font-family').value;
            this.config.fontSize = this.panel.querySelector('#rexor-font-size').value;
            this.config.fontWeight = this.panel.querySelector('#rexor-font-weight').value;
        }

        handleBackgroundUploadClick() {
            this.panel.querySelector('#rexor-bg-upload').click();
        }

        handleBackgroundUpload(input) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.config.backgroundImage = e.target.result;
                    this.panel.querySelector('#rexor-bg-url').value = e.target.result;
                    this.applyStyles();
                    this.saveConfig();
                    this.showNotification('Фон успешно загружен! ✅');
                };
                reader.readAsDataURL(file);
            }
        }

        resetBackground() {
            this.config.backgroundImage = DEFAULT_CONFIG.backgroundImage;
            this.panel.querySelector('#rexor-bg-url').value = DEFAULT_CONFIG.backgroundImage;
            this.applyStyles();
            this.saveConfig();
            this.showNotification('Фон сброшен! 🔄');
        }

        applyTheme(themeName) {
            const themes = {
                dark: {
                    primaryColor: '#ff4444',
                    secondaryColor: '#4444ff',
                    accentColor: '#44ff44',
                    textColor: '#ffffff',
                    backgroundColor: '#1a1a1a'
                },
                blue: {
                    primaryColor: '#4fc3f7',
                    secondaryColor: '#1976d2',
                    accentColor: '#82b1ff',
                    textColor: '#e3f2fd',
                    backgroundColor: '#0d47a1'
                },
                green: {
                    primaryColor: '#69f0ae',
                    secondaryColor: '#00c853',
                    accentColor: '#b9f6ca',
                    textColor: '#e8f5e8',
                    backgroundColor: '#1b5e20'
                },
                purple: {
                    primaryColor: '#e040fb',
                    secondaryColor: '#7c4dff',
                    accentColor: '#b388ff',
                    textColor: '#f3e5f5',
                    backgroundColor: '#4a148c'
                },
                red: {
                    primaryColor: '#ff5252',
                    secondaryColor: '#d32f2f',
                    accentColor: '#ff8a80',
                    textColor: '#ffebee',
                    backgroundColor: '#b71c1c'
                },
                orange: {
                    primaryColor: '#ff9800',
                    secondaryColor: '#f57c00',
                    accentColor: '#ffd54f',
                    textColor: '#fff3e0',
                    backgroundColor: '#e65100'
                }
            };

            if (themes[themeName]) {
                Object.assign(this.config, themes[themeName]);
                this.updatePanelValues();
                this.applyStyles();
                this.saveConfig();
                this.showNotification(`Тема "${themeName}" применена! 🎨`);
            }
        }

        updatePanelValues() {
            this.panel.querySelector('#rexor-primary-color').value = this.config.primaryColor;
            this.panel.querySelector('#rexor-secondary-color').value = this.config.secondaryColor;
            this.panel.querySelector('#rexor-accent-color').value = this.config.accentColor;
            this.panel.querySelector('#rexor-text-color').value = this.config.textColor;
            this.panel.querySelector('#rexor-opacity').value = this.config.containerOpacity;
            this.panel.querySelector('#opacity-value').textContent = this.config.containerOpacity;
            this.panel.querySelector('#rexor-enable-blur').checked = this.config.enableBlur;
            this.panel.querySelector('#rexor-enable-shadows').checked = this.config.enableShadows;
            this.panel.querySelector('#rexor-enable-animations').checked = this.config.enableAnimations;
            this.panel.querySelector('#rexor-font-family').value = this.config.fontFamily;
            this.panel.querySelector('#rexor-font-size').value = this.config.fontSize;
            this.panel.querySelector('#rexor-font-weight').value = this.config.fontWeight;
        }

        saveCurrentSettings() {
            this.updateConfigFromPanel();
            this.saveConfig();
            this.showNotification('Настройки сохранены! ✅');
        }

        resetSettings() {
            this.config = { ...DEFAULT_CONFIG };
            this.saveConfig();
            this.updatePanelValues();
            this.applyStyles();
            this.showNotification('Все настройки сброшены! 🔄');
        }

        togglePanel() {
            this.isPanelOpen = !this.isPanelOpen;
            if (this.isPanelOpen) {
                this.panel.classList.remove('hidden');
            } else {
                this.panel.classList.add('hidden');
            }
        }

        showNotification(message) {
            // Удаляем старые уведомления
            document.querySelectorAll('.rexor-notification').forEach(n => n.remove());

            const notification = document.createElement('div');
            notification.className = 'rexor-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.config.primaryColor};
                color: #000;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10001;
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
                border: 2px solid ${this.config.secondaryColor};
            `;
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        setupObservers() {
            // Наблюдатель за изменениями DOM
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        // Проверяем, не удалили ли нашу панель
                        if (!document.getElementById('rexor-control-panel')) {
                            this.createFloatingPanel();
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        registerCommands() {
            GM_registerMenuCommand('🎨 Открыть панель Rexor', () => {
                this.togglePanel();
            });
            
            GM_registerMenuCommand('💾 Сохранить настройки', () => {
                this.saveCurrentSettings();
            });

            GM_registerMenuCommand('🔄 Сбросить настройки', () => {
                this.resetSettings();
            });
        }
    }

    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.rexorCustomizer = new UltimateCustomizer();
        });
    } else {
        window.rexorCustomizer = new UltimateCustomizer();
    }

})();

