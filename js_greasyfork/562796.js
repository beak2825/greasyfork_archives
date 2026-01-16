// ==UserScript==
// @name         Kornet Panel + Goruda V2 Theme
// @namespace    kornet.panel.ui
// @version      5.1
// @description  Kornet panel with Apple-style controls, pages, animated minimize, and Goruda V2 theme
// @match        https://kornet.lat/*
// @match        https://www.kornet.lat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562796/Kornet%20Panel%20%2B%20Goruda%20V2%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/562796/Kornet%20Panel%20%2B%20Goruda%20V2%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загружаем CSS ресурсы
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
        }
    `);

    // Основные CSS стили для GUI
    GM_addStyle(`
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --dark-bg: #1a1a2e;
            --darker-bg: #16213e;
            --card-bg: rgba(255, 255, 255, 0.08);
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
            --accent: #00b4d8;
            --accent-hover: #0096c7;
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            --border-radius: 16px;
            --border-radius-sm: 8px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .kornet-gui-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            width: 360px;
            min-height: 500px;
            background: var(--dark-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg), 0 0 0 1px var(--glass-border);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            transition: var(--transition);
            opacity: 0.95;
        }
        
        .kornet-gui-container:hover {
            opacity: 1;
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg), 0 0 40px rgba(102, 126, 234, 0.3);
        }
        
        .kornet-gui-header {
            background: var(--primary-gradient);
            padding: 20px;
            color: white;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--glass-border);
        }
        
        .kornet-gui-title {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .kornet-gui-title i {
            font-size: 20px;
        }
        
        .kornet-gui-controls {
            display: flex;
            gap: 8px;
        }
        
        .kornet-control-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }
        
        .kornet-control-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .kornet-control-btn.close:hover {
            background: #ff4757;
            transform: rotate(180deg);
        }
        
        .kornet-gui-body {
            padding: 20px;
            max-height: 600px;
            overflow-y: auto;
        }
        
        .kornet-gui-body::-webkit-scrollbar {
            width: 6px;
        }
        
        .kornet-gui-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .kornet-gui-body::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 10px;
        }
        
        .kornet-section {
            background: var(--card-bg);
            border-radius: var(--border-radius-sm);
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid var(--glass-border);
            transition: var(--transition);
        }
        
        .kornet-section:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
        }
        
        .kornet-section-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .kornet-section-title i {
            color: var(--accent);
        }
        
        .kornet-widget-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .kornet-widget {
            background: var(--glass-bg);
            border-radius: var(--border-radius-sm);
            padding: 12px;
            border: 2px dashed transparent;
            cursor: move;
            transition: var(--transition);
            position: relative;
        }
        
        .kornet-widget:hover {
            background: rgba(102, 126, 234, 0.1);
            border-color: var(--accent);
            transform: translateY(-2px);
        }
        
        .kornet-widget.dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }
        
        .kornet-widget-icon {
            width: 40px;
            height: 40px;
            background: var(--primary-gradient);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            font-size: 18px;
            color: white;
        }
        
        .kornet-widget-title {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        
        .kornet-widget-desc {
            font-size: 10px;
            color: var(--text-secondary);
            line-height: 1.4;
        }
        
        .kornet-dashboard {
            min-height: 300px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius-sm);
            padding: 16px;
            border: 2px dashed var(--glass-border);
            transition: var(--transition);
        }
        
        .kornet-dashboard.active-drop {
            border-color: var(--accent);
            background: rgba(0, 180, 216, 0.1);
        }
        
        .kornet-widget-item {
            background: var(--glass-bg);
            border-radius: var(--border-radius-sm);
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid var(--glass-border);
            transition: var(--transition);
            cursor: move;
        }
        
        .kornet-widget-item:hover {
            border-color: var(--accent);
            box-shadow: var(--shadow-sm);
        }
        
        .kornet-widget-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .kornet-widget-item-title {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .kornet-widget-item-remove {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 71, 87, 0.1);
            color: #ff4757;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            transition: var(--transition);
        }
        
        .kornet-widget-item-remove:hover {
            background: #ff4757;
            color: white;
        }
        
        .kornet-toggle-switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 26px;
        }
        
        .kornet-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .kornet-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.2);
            transition: var(--transition);
            border-radius: 34px;
        }
        
        .kornet-toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: var(--transition);
            border-radius: 50%;
        }
        
        input:checked + .kornet-toggle-slider {
            background: var(--accent);
        }
        
        input:checked + .kornet-toggle-slider:before {
            transform: translateX(26px);
        }
        
        .kornet-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .kornet-setting:last-child {
            border-bottom: none;
        }
        
        .kornet-setting-label {
            font-size: 13px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .kornet-setting-label i {
            color: var(--accent);
            width: 16px;
        }
        
        .kornet-btn {
            background: var(--primary-gradient);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: var(--border-radius-sm);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            margin-top: 16px;
        }
        
        .kornet-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .kornet-btn-secondary {
            background: var(--glass-bg);
            color: var(--text-primary);
        }
        
        .kornet-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .kornet-notification {
            position: fixed;
            top: 20px;
            right: 400px;
            z-index: 1000000;
            background: var(--dark-bg);
            border-left: 4px solid var(--accent);
            padding: 16px;
            border-radius: var(--border-radius-sm);
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .kornet-notification.show {
            transform: translateX(0);
        }
        
        .kornet-notification-icon {
            width: 32px;
            height: 32px;
            background: var(--primary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .kornet-stat-card {
            background: var(--glass-bg);
            border-radius: var(--border-radius-sm);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .kornet-stat-icon {
            width: 48px;
            height: 48px;
            background: var(--primary-gradient);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        }
        
        .kornet-stat-info h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
        }
        
        .kornet-stat-info p {
            font-size: 12px;
            color: var(--text-secondary);
            margin: 4px 0 0 0;
        }
        
        .kornet-minimized {
            width: 60px;
            height: 60px;
            min-height: 0;
            overflow: hidden;
        }
        
        .kornet-minimized .kornet-gui-body {
            display: none;
        }
        
        .kornet-minimized .kornet-gui-title span {
            display: none;
        }
        
        .kornet-tabs {
            display: flex;
            border-bottom: 1px solid var(--glass-border);
            margin-bottom: 16px;
        }
        
        .kornet-tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            color: var(--text-secondary);
            transition: var(--transition);
            border-bottom: 2px solid transparent;
        }
        
        .kornet-tab.active {
            color: var(--accent);
            border-bottom-color: var(--accent);
        }
        
        .kornet-tab-content {
            display: none;
        }
        
        .kornet-tab-content.active {
            display: block;
        }
        
        .kornet-search-box {
            width: 100%;
            padding: 10px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius-sm);
            color: var(--text-primary);
            font-size: 14px;
            margin-bottom: 16px;
            transition: var(--transition);
        }
        
        .kornet-search-box:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1);
        }
        
        .kornet-color-picker {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        
        .kornet-color-option {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
            transition: var(--transition);
        }
        
        .kornet-color-option.active {
            border-color: white;
            transform: scale(1.1);
        }
    `);

    // Основной класс для управления GUI
    class KornetGUI {
        constructor() {
            this.widgets = [];
            this.dashboardWidgets = [];
            this.settings = {};
            this.isMinimized = false;
            this.position = { x: 20, y: 20 };
            this.init();
        }

        init() {
            this.loadSettings();
            this.createGUI();
            this.setupDragAndDrop();
            this.setupEventListeners();
            this.loadDashboardWidgets();
            this.injectEnhancements();
        }

        createGUI() {
            // Создаем основной контейнер
            this.container = document.createElement('div');
            this.container.className = 'kornet-gui-container';
            this.container.style.left = `${this.position.x}px`;
            this.container.style.top = `${this.position.y}px`;

            // Создаем заголовок
            this.container.innerHTML = `
                <div class="kornet-gui-header" id="kornet-drag-handle">
                    <div class="kornet-gui-title">
                        <i class="fas fa-robot"></i>
                        <span>Kornet.lat PRO</span>
                    </div>
                    <div class="kornet-gui-controls">
                        <button class="kornet-control-btn minimize" title="Свернуть">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="kornet-control-btn close" title="Закрыть">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="kornet-gui-body">
                    <div class="kornet-tabs">
                        <div class="kornet-tab active" data-tab="dashboard">
                            <i class="fas fa-th-large"></i> Дашборд
                        </div>
                        <div class="kornet-tab" data-tab="widgets">
                            <i class="fas fa-puzzle-piece"></i> Виджеты
                        </div>
                        <div class="kornet-tab" data-tab="settings">
                            <i class="fas fa-cog"></i> Настройки
                        </div>
                    </div>
                    
                    <div class="kornet-tab-content active" id="tab-dashboard">
                        <div class="kornet-search-box" id="kornet-search" placeholder="Поиск...">
                            <i class="fas fa-search"></i> Поиск виджетов
                        </div>
                        <div class="kornet-dashboard" id="kornet-dashboard">
                            <p style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
                                Перетащите виджеты сюда
                            </p>
                        </div>
                    </div>
                    
                    <div class="kornet-tab-content" id="tab-widgets">
                        <div class="kornet-section">
                            <div class="kornet-section-title">
                                <i class="fas fa-star"></i>
                                Рекомендуемые виджеты
                            </div>
                            <div class="kornet-widget-grid" id="widget-library">
                                ${this.getWidgetHTML()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="kornet-tab-content" id="tab-settings">
                        <div class="kornet-section">
                            <div class="kornet-section-title">
                                <i class="fas fa-paint-brush"></i>
                                Внешний вид
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-moon"></i>
                                    Тёмная тема
                                </div>
                                <label class="kornet-toggle-switch">
                                    <input type="checkbox" id="dark-theme" checked>
                                    <span class="kornet-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-bolt"></i>
                                    Анимации
                                </div>
                                <label class="kornet-toggle-switch">
                                    <input type="checkbox" id="animations" checked>
                                    <span class="kornet-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-palette"></i>
                                    Цвет темы
                                </div>
                                <div class="kornet-color-picker">
                                    <div class="kornet-color-option active" style="background: #667eea;"></div>
                                    <div class="kornet-color-option" style="background: #f093fb;"></div>
                                    <div class="kornet-color-option" style="background: #00b4d8;"></div>
                                    <div class="kornet-color-option" style="background: #ff9a9e;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="kornet-section">
                            <div class="kornet-section-title">
                                <i class="fas fa-tools"></i>
                                Функции
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-shield-alt"></i>
                                    Блокировка рекламы
                                </div>
                                <label class="kornet-toggle-switch">
                                    <input type="checkbox" id="ad-block" checked>
                                    <span class="kornet-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-rocket"></i>
                                    Турбо-режим
                                </div>
                                <label class="kornet-toggle-switch">
                                    <input type="checkbox" id="turbo-mode">
                                    <span class="kornet-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="kornet-setting">
                                <div class="kornet-setting-label">
                                    <i class="fas fa-bell"></i>
                                    Уведомления
                                </div>
                                <label class="kornet-toggle-switch">
                                    <input type="checkbox" id="notifications" checked>
                                    <span class="kornet-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <button class="kornet-btn" id="save-settings">
                            <i class="fas fa-save"></i> Сохранить настройки
                        </button>
                        <button class="kornet-btn kornet-btn-secondary" id="reset-settings">
                            <i class="fas fa-redo"></i> Сбросить настройки
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.container);
            this.setupTabs();
        }

        getWidgetHTML() {
            const widgetData = [
                { id: 'stats', icon: 'fas fa-chart-line', title: 'Статистика', desc: 'Аналитика посещений' },
                { id: 'notes', icon: 'fas fa-sticky-note', title: 'Заметки', desc: 'Быстрые заметки' },
                { id: 'bookmarks', icon: 'fas fa-bookmark', title: 'Закладки', desc: 'Управление закладками' },
                { id: 'calculator', icon: 'fas fa-calculator', title: 'Калькулятор', desc: 'Быстрые вычисления' },
                { id: 'weather', icon: 'fas fa-cloud-sun', title: 'Погода', desc: 'Прогноз погоды' },
                { id: 'time', icon: 'fas fa-clock', title: 'Таймер', desc: 'Таймер и секундомер' },
                { id: 'converter', icon: 'fas fa-exchange-alt', title: 'Конвертер', desc: 'Конвертация валют' },
                { id: 'quick-links', icon: 'fas fa-link', title: 'Ссылки', desc: 'Быстрый доступ' }
            ];

            return widgetData.map(widget => `
                <div class="kornet-widget" data-widget-id="${widget.id}" draggable="true">
                    <div class="kornet-widget-icon">
                        <i class="${widget.icon}"></i>
                    </div>
                    <div class="kornet-widget-title">${widget.title}</div>
                    <div class="kornet-widget-desc">${widget.desc}</div>
                </div>
            `).join('');
        }

        setupDragAndDrop() {
            const dashboard = document.getElementById('kornet-dashboard');
            const widgets = document.querySelectorAll('.kornet-widget');
            const widgetItems = document.querySelectorAll('.kornet-widget-item');

            // Инициализация Sortable.js для плавного перетаскивания
            if (typeof Sortable !== 'undefined') {
                Sortable.create(dashboard, {
                    group: 'widgets',
                    animation: 150,
                    ghostClass: 'dragging',
                    onAdd: (evt) => {
                        this.addWidgetToDashboard(evt.item.dataset.widgetId);
                    }
                });

                Sortable.create(document.getElementById('widget-library'), {
                    group: {
                        name: 'widgets',
                        pull: 'clone',
                        put: false
                    },
                    sort: false,
                    animation: 150
                });
            }

            // Нативный Drag & Drop как fallback
            widgets.forEach(widget => {
                widget.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.widgetId);
                    e.target.classList.add('dragging');
                });

                widget.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });
            });

            dashboard.addEventListener('dragover', (e) => {
                e.preventDefault();
                dashboard.classList.add('active-drop');
            });

            dashboard.addEventListener('dragleave', () => {
                dashboard.classList.remove('active-drop');
            });

            dashboard.addEventListener('drop', (e) => {
                e.preventDefault();
                dashboard.classList.remove('active-drop');
                const widgetId = e.dataTransfer.getData('text/plain');
                if (widgetId) {
                    this.addWidgetToDashboard(widgetId);
                }
            });

            // Перетаскивание окна GUI
            const dragHandle = document.getElementById('kornet-drag-handle');
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                this.container.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                this.position.x = e.clientX - dragOffset.x;
                this.position.y = e.clientY - dragOffset.y;
                
                this.container.style.left = `${this.position.x}px`;
                this.container.style.top = `${this.position.y}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                this.container.style.cursor = '';
                this.saveSettings();
            });
        }

        addWidgetToDashboard(widgetId) {
            const widgetData = {
                'stats': { icon: 'fas fa-chart-line', title: 'Статистика', content: 'Здесь будет статистика...' },
                'notes': { icon: 'fas fa-sticky-note', title: 'Заметки', content: 'Напишите заметку...' },
                'bookmarks': { icon: 'fas fa-bookmark', title: 'Закладки', content: 'Ваши закладки...' },
                'calculator': { icon: 'fas fa-calculator', title: 'Калькулятор', content: '0' },
                'weather': { icon: 'fas fa-cloud-sun', title: 'Погода', content: 'Загрузка погоды...' },
                'time': { icon: 'fas fa-clock', title: 'Таймер', content: '00:00:00' },
                'converter': { icon: 'fas fa-exchange-alt', title: 'Конвертер', content: 'Конвертация...' },
                'quick-links': { icon: 'fas fa-link', title: 'Ссылки', content: 'Быстрые ссылки...' }
            };

            const data = widgetData[widgetId];
            if (!data) return;

            const widgetElement = document.createElement('div');
            widgetElement.className = 'kornet-widget-item';
            widgetElement.dataset.widgetId = widgetId;
            widgetElement.innerHTML = `
                <div class="kornet-widget-item-header">
                    <div class="kornet-widget-item-title">
                        <i class="${data.icon}"></i> ${data.title}
                    </div>
                    <button class="kornet-widget-item-remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="kornet-widget-item-content">
                    ${data.content}
                </div>
            `;

            const dashboard = document.getElementById('kornet-dashboard');
            const placeholder = dashboard.querySelector('p');
            if (placeholder) placeholder.remove();
            
            dashboard.appendChild(widgetElement);
            this.dashboardWidgets.push(widgetId);
            this.saveDashboard();

            // Добавляем функциональность удаления
            widgetElement.querySelector('.kornet-widget-item-remove').addEventListener('click', () => {
                widgetElement.remove();
                this.dashboardWidgets = this.dashboardWidgets.filter(id => id !== widgetId);
                this.saveDashboard();
                this.showNotification('Виджет удален', 'info');
            });

            this.showNotification(`Виджет "${data.title}" добавлен`, 'success');
        }

        setupTabs() {
            const tabs = this.container.querySelectorAll('.kornet-tab');
            const contents = this.container.querySelectorAll('.kornet-tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.dataset.tab;
                    
                    // Обновляем активные вкладки
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    document.getElementById(`tab-${tabId}`).classList.add('active');
                });
            });
        }

        setupEventListeners() {
            // Кнопка сворачивания
            this.container.querySelector('.minimize').addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                this.container.classList.toggle('kornet-minimized', this.isMinimized);
                
                if (this.isMinimized) {
                    this.container.querySelector('.minimize i').className = 'fas fa-expand';
                } else {
                    this.container.querySelector('.minimize i').className = 'fas fa-minus';
                }
            });

            // Кнопка закрытия
            this.container.querySelector('.close').addEventListener('click', () => {
                this.container.style.display = 'none';
                this.showNotification('GUI скрыто. Для отображения обновите страницу.', 'warning');
            });

            // Сохранение настроек
            document.getElementById('save-settings').addEventListener('click', () => {
                this.saveSettings();
                this.showNotification('Настройки сохранены!', 'success');
            });

            // Сброс настроек
            document.getElementById('reset-settings').addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                    GM_setValue('kornet_settings', JSON.stringify({}));
                    GM_setValue('kornet_dashboard', JSON.stringify([]));
                    location.reload();
                }
            });

            // Поиск виджетов
            const searchBox = document.getElementById('kornet-search');
            searchBox.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const widgets = document.querySelectorAll('.kornet-widget');
                
                widgets.forEach(widget => {
                    const title = widget.querySelector('.kornet-widget-title').textContent.toLowerCase();
                    const desc = widget.querySelector('.kornet-widget-desc').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                        widget.style.display = 'block';
                    } else {
                        widget.style.display = 'none';
                    }
                });
            });

            // Выбор цвета темы
            const colorOptions = this.container.querySelectorAll('.kornet-color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', () => {
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    const color = option.style.backgroundColor;
                    document.documentElement.style.setProperty('--accent', color);
                    this.showNotification('Цвет темы изменен', 'info');
                });
            });
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'kornet-notification';
            
            const icons = {
                'success': 'fas fa-check-circle',
                'error': 'fas fa-exclamation-circle',
                'warning': 'fas fa-exclamation-triangle',
                'info': 'fas fa-info-circle'
            };

            notification.innerHTML = `
                <div class="kornet-notification-icon">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div>${message}</div>
            `;

            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        loadSettings() {
            const savedSettings = GM_getValue('kornet_settings', '{}');
            const savedPosition = GM_getValue('kornet_position', '{"x":20,"y":20}');
            
            try {
                this.settings = JSON.parse(savedSettings);
                this.position = JSON.parse(savedPosition);
            } catch (e) {
                this.settings = {};
                this.position = { x: 20, y: 20 };
            }
        }

        saveSettings() {
            GM_setValue('kornet_settings', JSON.stringify(this.settings));
            GM_setValue('kornet_position', JSON.stringify(this.position));
            GM_setValue('kornet_dashboard', JSON.stringify(this.dashboardWidgets));
        }

        saveDashboard() {
            GM_setValue('kornet_dashboard', JSON.stringify(this.dashboardWidgets));
        }

        loadDashboardWidgets() {
            const savedWidgets = GM_getValue('kornet_dashboard', '[]');
            try {
                this.dashboardWidgets = JSON.parse(savedWidgets);
                this.dashboardWidgets.forEach(widgetId => {
                    setTimeout(() => this.addWidgetToDashboard(widgetId), 100);
                });
            } catch (e) {
                this.dashboardWidgets = [];
            }
        }

        injectEnhancements() {
            // Улучшаем навигацию сайта
            this.enhanceNavigation();
            
            // Добавляем кнопку быстрых действий
            this.addQuickActions();
            
            // Улучшаем формы
            this.enhanceForms();
        }

        enhanceNavigation() {
            // Пример: добавляем подсветку активной ссылки
            const currentPath = window.location.pathname;
            document.querySelectorAll('a[href]').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.style.fontWeight = 'bold';
                    link.style.color = 'var(--accent)';
                }
            });
        }

        addQuickActions() {
            // Создаем плавающую кнопку быстрых действий
            const quickActionsBtn = document.createElement('button');
            quickActionsBtn.innerHTML = '<i class="fas fa-bolt"></i>';
            quickActionsBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                background: var(--primary-gradient);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 99999;
                box-shadow: var(--shadow-lg);
                transition: var(--transition);
            `;

            quickActionsBtn.addEventListener('mouseenter', () => {
                quickActionsBtn.style.transform = 'scale(1.1) rotate(15deg)';
            });

            quickActionsBtn.addEventListener('mouseleave', () => {
                quickActionsBtn.style.transform = 'scale(1) rotate(0deg)';
            });

            quickActionsBtn.addEventListener('click', () => {
                this.showNotification('Быстрые действия активированы!', 'success');
                // Здесь можно добавить дополнительные действия
            });

            document.body.appendChild(quickActionsBtn);
        }

        enhanceForms() {
            // Улучшаем все формы на странице
            document.querySelectorAll('form').forEach(form => {
                form.style.transition = 'var(--transition)';
                
                form.addEventListener('focusin', (e) => {
                    if (e.target.matches('input, textarea, select')) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 180, 216, 0.2)';
                    }
                });
                
                form.addEventListener('focusout', (e) => {
                    if (e.target.matches('input, textarea, select')) {
                        e.target.style.boxShadow = 'none';
                    }
                });
            });
        }
    }

    // Ждем полной загрузки страницы и запускаем GUI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new KornetGUI(), 1000);
        });
    } else {
        setTimeout(() => new KornetGUI(), 1000);
    }

})();