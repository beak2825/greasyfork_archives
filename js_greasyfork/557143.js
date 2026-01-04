// ==UserScript==
// @name         Rexor Forum Customizer | BLACK RUSSIA FORUM
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Полная кастомизация форума с темами и настройками
// @author       Rexor
// @match        https://forum.blackrussia.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://i.imgur.com/7V5lB2N.png
// @downloadURL https://update.greasyfork.org/scripts/557143/Rexor%20Forum%20Customizer%20%7C%20BLACK%20RUSSIA%20FORUM.user.js
// @updateURL https://update.greasyfork.org/scripts/557143/Rexor%20Forum%20Customizer%20%7C%20BLACK%20RUSSIA%20FORUM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация по умолчанию
    const DEFAULT_CONFIG = {
        // Основные настройки
        customBackground: 'https://i.ytimg.com/vi/46OSddG7y4Y/maxresdefault.jpg',
        customFont: 'Montserrat',
        primaryColor: '#ffffff',
        secondaryColor: '#333333',
        backgroundColor: '#111111',
        opacity: 0.8,
        
        // Текущая тема
        currentTheme: 'custom',
        
        // Эффекты
        enableSnow: false,
        enableHalloween: false,
        enableParticles: false
    };

    class RexorForumCustomizer {
        constructor() {
            this.config = this.loadConfig();
            this.init();
        }

        loadConfig() {
            const saved = GM_getValue('rexor_config');
            return { ...DEFAULT_CONFIG, ...saved };
        }

        saveConfig() {
            GM_setValue('rexor_config', this.config);
        }

        init() {
            this.applyStyles();
            this.createSettingsMenu();
            this.applyThemeEffects();
            this.setupObservers();
        }

        applyStyles() {
            const styles = this.generateStyles();
            GM_addStyle(styles);
        }

        generateStyles() {
            return `
                @import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');

                html {
                    background-image: url('${this.config.customBackground}') !important;
                    background-repeat: no-repeat !important;
                    background-position: center center !important;
                    background-attachment: fixed !important;
                    background-size: cover !important;
                    font-family: ${this.config.customFont}, sans-serif !important;
                }

                * {
                    font-family: ${this.config.customFont}, sans-serif !important;
                }

                .block-container {
                    background: linear-gradient(90deg, rgba(51, 51, 51, ${this.config.opacity}) 0%, rgba(17, 17, 17, ${this.config.opacity}) 100%) !important;
                    box-shadow: 0 0 0 1px ${this.config.primaryColor} !important;
                    border-radius: 20px !important;
                }

                h1, h2, h3, h4, h5, h6 {
                    color: ${this.config.primaryColor} !important;
                    text-shadow: 0px 0px 10px ${this.config.primaryColor} !important;
                }

                .p-body-sidebar .block-minorHeader {
                    border-bottom: 1px solid ${this.config.primaryColor} !important;
                }

                .p-nav, .p-staffBar, .p-header {
                    background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
                    border-bottom: 1px solid ${this.config.primaryColor} !important;
                }

                .message-cell.message-cell--user, .message-cell.message-cell--action {
                    background: none !important;
                    border-right: 1px solid ${this.config.primaryColor} !important;
                }

                .block--messages.block .message, .js-quickReply.block .message {
                    border-radius: 0 !important;
                    background: none !important;
                    box-shadow: 0 0 0 1px ${this.config.primaryColor} !important;
                }

                .button.button--primary, button.button a.button.button--primary {
                    box-shadow: 0 0 0 1px ${this.config.primaryColor} !important;
                    border-radius: 10px !important;
                    background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
                    color: ${this.config.primaryColor} !important;
                }

                .p-nav-list .p-navEl.is-selected {
                    background: linear-gradient(90deg, rgba(51, 51, 51, 0.5) 0%, rgba(17, 17, 17, 0.5) 100%) !important;
                    color: ${this.config.primaryColor} !important;
                }

                body::-webkit-scrollbar {
                    width: 16px !important;
                }

                body::-webkit-scrollbar-track {
                    background: #222 !important;
                }

                body::-webkit-scrollbar-thumb {
                    background: linear-gradient(#808080, ${this.config.primaryColor}, #808080) !important;
                }

                .rexor-custom-element {
                    /* Стили для кастомных элементов */
                }

                ${this.config.enableSnow ? this.getSnowStyles() : ''}
                ${this.config.enableHalloween ? this.getHalloweenStyles() : ''}
            `;
        }

        getSnowStyles() {
            return `
                .snowflake {
                    position: fixed;
                    top: -10px;
                    color: white;
                    font-size: 1em;
                    text-shadow: 0 0 5px white;
                    user-select: none;
                    pointer-events: none;
                    z-index: 9999;
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
            `;
        }

        getHalloweenStyles() {
            return `
                .halloween-bat {
                    position: fixed;
                    font-size: 2em;
                    z-index: 9998;
                    pointer-events: none;
                    animation: fly 15s linear infinite;
                }

                @keyframes fly {
                    0% { transform: translateX(-100px) translateY(0px); }
                    100% { transform: translateX(calc(100vw + 100px)) translateY(calc(100vh * random())); }
                }
            `;
        }

        createSettingsMenu() {
            GM_registerMenuCommand('⚙️ Настройки Rexor', () => this.showSettingsModal());
        }

        showSettingsModal() {
            const modal = this.createModal();
            document.body.appendChild(modal);
        }

        createModal() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #333, #111);
                border: 2px solid ${this.config.primaryColor};
                border-radius: 15px;
                padding: 20px;
                z-index: 10000;
                color: white;
                min-width: 500px;
                box-shadow: 0 0 30px rgba(0,0,0,0.8);
            `;

            modal.innerHTML = `
                <div style="margin-bottom: 20px; border-bottom: 1px solid ${this.config.primaryColor}; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: ${this.config.primaryColor};">🎨 Настройки Rexor</h2>
                </div>
                
                <div style="display: grid; gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Фон:</label>
                        <input type="text" id="rexor-bg" value="${this.config.customBackground}" style="width: 100%; padding: 8px; background: #222; border: 1px solid ${this.config.primaryColor}; color: white; border-radius: 5px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Шрифт:</label>
                        <select id="rexor-font" style="width: 100%; padding: 8px; background: #222; border: 1px solid ${this.config.primaryColor}; color: white; border-radius: 5px;">
                            ${this.getFontOptions()}
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Основной цвет:</label>
                        <input type="color" id="rexor-primary" value="${this.config.primaryColor}" style="width: 100%; height: 40px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px;">Прозрачность:</label>
                        <input type="range" id="rexor-opacity" min="0.1" max="1" step="0.1" value="${this.config.opacity}" style="width: 100%;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 10px;">Темы:</label>
                        <select id="rexor-theme" style="width: 100%; padding: 8px; background: #222; border: 1px solid ${this.config.primaryColor}; color: white; border-radius: 5px;">
                            <option value="custom" ${this.config.currentTheme === 'custom' ? 'selected' : ''}>💎 Кастомная</option>
                            <option value="newyear" ${this.config.currentTheme === 'newyear' ? 'selected' : ''}>🎄 Новогодняя</option>
                            <option value="halloween" ${this.config.currentTheme === 'halloween' ? 'selected' : ''}>🎃 Хэллоуин</option>
                            <option value="dark" ${this.config.currentTheme === 'dark' ? 'selected' : ''}>🌙 Тёмная</option>
                            <option value="blue" ${this.config.currentTheme === 'blue' ? 'selected' : ''}>🔷 Синяя</option>
                        </select>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button id="rexor-save" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">💾 Сохранить</button>
                        <button id="rexor-reset" style="padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">🔄 Сбросить</button>
                    </div>
                </div>
            `;

            this.attachModalEvents(modal);
            return modal;
        }

        getFontOptions() {
            const fonts = [
                'Montserrat', 'Comfortaa', 'Fira Sans', 'Ubuntu', 
                'Roboto', 'Play', 'Neucha', 'Bad Script', 
                'Marmelad', 'Sofia Sans'
            ];
            
            return fonts.map(font => 
                `<option value="${font}" ${this.config.customFont === font ? 'selected' : ''}>${font}</option>`
            ).join('');
        }

        attachModalEvents(modal) {
            modal.querySelector('#rexor-save').addEventListener('click', () => {
                this.saveSettingsFromModal(modal);
                modal.remove();
            });

            modal.querySelector('#rexor-reset').addEventListener('click', () => {
                this.resetSettings();
                modal.remove();
            });

            // Закрытие по клику вне модалки
            modal.addEventListener('click', (e) => e.stopPropagation());
            document.addEventListener('click', () => modal.remove());
        }

        saveSettingsFromModal(modal) {
            this.config.customBackground = modal.querySelector('#rexor-bg').value;
            this.config.customFont = modal.querySelector('#rexor-font').value;
            this.config.primaryColor = modal.querySelector('#rexor-primary').value;
            this.config.opacity = parseFloat(modal.querySelector('#rexor-opacity').value);
            
            const selectedTheme = modal.querySelector('#rexor-theme').value;
            this.applyTheme(selectedTheme);
            
            this.saveConfig();
            this.applyStyles();
            this.applyThemeEffects();
        }

        applyTheme(themeName) {
            this.config.currentTheme = themeName;
            
            const themes = {
                newyear: {
                    customBackground: 'https://i.imgur.com/8qk5B7j.jpg',
                    primaryColor: '#ff0000',
                    customFont: 'Comfortaa',
                    enableSnow: true,
                    enableHalloween: false
                },
                halloween: {
                    customBackground: 'https://i.imgur.com/x3qS5Wm.jpg',
                    primaryColor: '#ff8c00',
                    customFont: 'Bad Script',
                    enableSnow: false,
                    enableHalloween: true
                },
                dark: {
                    customBackground: 'https://i.imgur.com/7V5lB2N.png',
                    primaryColor: '#00ff00',
                    customFont: 'Ubuntu',
                    enableSnow: false,
                    enableHalloween: false
                },
                blue: {
                    customBackground: 'https://i.imgur.com/9k8a7bB.jpg',
                    primaryColor: '#0088ff',
                    customFont: 'Montserrat',
                    enableSnow: false,
                    enableHalloween: false
                },
                custom: {
                    enableSnow: false,
                    enableHalloween: false
                }
            };

            if (themes[themeName]) {
                Object.assign(this.config, themes[themeName]);
            }
        }

        resetSettings() {
            this.config = { ...DEFAULT_CONFIG };
            this.saveConfig();
            this.applyStyles();
            this.applyThemeEffects();
        }

        applyThemeEffects() {
            this.removeThemeEffects();
            
            if (this.config.enableSnow) {
                this.createSnowEffect();
            }
            
            if (this.config.enableHalloween) {
                this.createHalloweenEffect();
            }
        }

        removeThemeEffects() {
            document.querySelectorAll('.snowflake, .halloween-bat').forEach(el => el.remove());
        }

        createSnowEffect() {
            const snowContainer = document.createElement('div');
            snowContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
            
            for (let i = 0; i < 50; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.innerHTML = '❄';
                snowflake.style.cssText = `
                    position: absolute;
                    top: -20px;
                    left: ${Math.random() * 100}%;
                    font-size: ${Math.random() * 20 + 10}px;
                    opacity: ${Math.random() * 0.5 + 0.5};
                    animation: fall ${Math.random() * 5 + 5}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                
                snowContainer.appendChild(snowflake);
            }
            
            document.body.appendChild(snowContainer);
        }

        createHalloweenEffect() {
            const batContainer = document.createElement('div');
            batContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998;';
            
            for (let i = 0; i < 5; i++) {
                const bat = document.createElement('div');
                bat.className = 'halloween-bat';
                bat.innerHTML = '🦇';
                bat.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 50}%;
                    animation: fly ${Math.random() * 10 + 10}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                    font-size: ${Math.random() * 20 + 15}px;
                `;
                
                batContainer.appendChild(bat);
            }
            
            document.body.appendChild(batContainer);
        }

        setupObservers() {
            // Наблюдатель за изменениями DOM для динамического применения стилей
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        this.applyStylesToNewElements(mutation.addedNodes);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        applyStylesToNewElements(nodes) {
            nodes.forEach(node => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    // Применяем стили к новым элементам
                    if (node.classList && (
                        node.classList.contains('block-container') ||
                        node.classList.contains('message') ||
                        node.classList.contains('button')
                    )) {
                        // Стили применятся через глобальные CSS
                    }
                }
            });
        }
    }

    // Инициализация скрипта
    new RexorForumCustomizer();
})();