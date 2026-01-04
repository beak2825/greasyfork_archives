// ==UserScript==
// @name         Habr Content Filter
// @name:ru      Фильтр контента Хабра (Habr Content Filter)
// @namespace    https://github.com/aifixed/userscripts
// @version      2.5.1
// @description  Фильтрация контента на Хабре: скрытие статей, блокировка авторов и корпоративных блогов, фильтр тегов, очистка ленты. Помогает скрыть ненужные посты и настроить персональную ленту Habr.
// @description:ru Фильтрация контента на Хабре: скрытие статей, блокировка авторов и корпоративных блогов, фильтр тегов, очистка ленты. Помогает скрыть ненужные посты и настроить персональную ленту Habr.
// @author       AiFixed
// @license      MIT
// @homepage     https://aifixed.github.io/userscripts/
// @homepageURL  https://aifixed.github.io/userscripts/
// @supportURL   https://github.com/aifixed/userscripts/issues
//
// --- Матчи (по умолчанию покрывают всё необходимое) ---
// @match        https://habr.com/*
// @match        https://habr.com/ru/*
// @match        https://habr.com/ru/articles/*
// @match        https://habr.com/ru/feed/*
// @match        https://habr.com/ru/hubs/*
// @match        https://habr.com/ru/users/*
// @match        https://habr.com/ru/companies/*
//
// --- Прочее ---
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556148/Habr%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/556148/Habr%20Content%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // STORAGE MANAGER
    // (JS-логика без изменений, она оптимальна)
    // ======================
    class StorageManager {
        constructor() {
            this.data = this.load();
        }

        load() {
            const defaultData = {
                tags: {},
                authors: {},
                commenters: {},
                settings: {
                    showStats: true,
                    animateHiding: true,
                    showPreview: true,
                    focusMode: false
                },
                stats: {
                    totalHidden: 0,
                    lastUpdate: Date.now()
                }
            };

            try {
                const saved = localStorage.getItem('habrFilterData');
                return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
            } catch (e) {
                console.error('Failed to load data:', e);
                return defaultData;
            }
        }

        save() {
            try {
                this.data.stats.lastUpdate = Date.now();
                localStorage.setItem('habrFilterData', JSON.stringify(this.data));
            } catch (e) {
                console.error('Failed to save data:', e);
            }
        }

        addBlock(type, value, duration = 'permanent') {
            if (!this.data[type]) this.data[type] = {};

            const existing = this.data[type][value] || { hidden: 0, blocked: false };
            this.data[type][value] = {
                ...existing,
                blocked: true,
                blockedAt: Date.now(),
                duration: duration
            };

            this.save();
        }

        removeBlock(type, value) {
            if (this.data[type] && this.data[type][value]) {
                this.data[type][value].blocked = false;
                this.save();
            }
        }

        incrementHidden(type, value) {
            if (!this.data[type][value]) {
                this.data[type][value] = { hidden: 0, blocked: false };
            }
            this.data[type][value].hidden++;
            this.data.stats.totalHidden++;
            this.save();
        }

        isBlocked(type, value) {
            const item = this.data[type][value];
            if (!item || !item.blocked) return false;

            if (item.duration !== 'permanent') {
                const duration = {
                    'day': 86400000,
                    'week': 604800000,
                    'month': 2592000000
                }[item.duration];

                if (Date.now() - item.blockedAt > duration) {
                    this.removeBlock(type, value);
                    return false;
                }
            }
            return true;
        }

        getStats(type, value) {
            return this.data[type][value] || { hidden: 0, blocked: false };
        }

        export() {
            return JSON.stringify(this.data, null, 2);
        }

        import(jsonString) {
            try {
                this.data = JSON.parse(jsonString);
                this.save();
                return true;
            } catch (e) {
                console.error('Import failed:', e);
                return false;
            }
        }
    }

    // ======================
    // UI COMPONENTS
    // (JS-логика без изменений, HTML-экранизация на месте)
    // ======================
    class UIComponents {
        
        static escapeHTML(str) {
            if (!str) return '';
            return str.replace(/[&<>"']/g, function(m) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[m];
            });
        }

        static createContextMenu(type, value, stats) {
            const isBlocked = stats.blocked;
            const menu = document.createElement('div');
            menu.className = 'hf-context-menu';
            menu.innerHTML = `
                <div class="hf-menu-header">
                    <strong>${this.escapeHTML(value)}</strong>
                    <button class="hf-menu-close" title="Закрыть">×</button>
                </div>
                <div class="hf-menu-content">
                    ${!isBlocked ? `
                        <button class="hf-menu-item hf-block-action" data-duration="permanent">
                            <span class="hf-menu-icon">⛔</span>
                            Заблокировать навсегда
                        </button>
                        <button class="hf-menu-item hf-block-action" data-duration="week">
                            <span class="hf-menu-icon">📅</span>
                            Заблокировать на неделю
                        </button>
                        <button class="hf-menu-item hf-block-action" data-duration="day">
                            <span class="hf-menu-icon">⏰</span>
                            Заблокировать на день
                        </button>
                    ` : `
                        <button class="hf-menu-item hf-unblock-action">
                            <span class="hf-menu-icon">✅</span>
                            Разблокировать
                        </button>
                    `}
                    <div class="hf-menu-divider"></div>
                    <div class="hf-menu-stats">
                        <div class="hf-stat-item">
                            <span class="hf-stat-label">Скрыто:</span>
                            <span class="hf-stat-value">${stats.hidden || 0}</span>
                        </div>
                        ${stats.blockedAt ? `
                            <div class="hf-stat-item">
                                <span class="hf-stat-label">Заблокировано:</span>
                                <span class="hf-stat-value">${this.formatDate(stats.blockedAt)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            return menu;
        }

        static createControlPanel(storage) {
            const panel = document.createElement('div');
            panel.id = 'hf-control-panel';
            panel.className = 'hf-panel hf-panel-collapsed';

            const blockedTags = Object.entries(storage.data.tags).filter(([_, v]) => v.blocked);
            const blockedAuthors = Object.entries(storage.data.authors).filter(([_, v]) => v.blocked);

            const inactiveTags = Object.entries(storage.data.tags).filter(([_, v]) => !v.blocked && (v.hidden || 0) > 0);
            const inactiveAuthors = Object.entries(storage.data.authors).filter(([_, v]) => !v.blocked && (v.hidden || 0) > 0);

            const renderBlockedItem = (type, value, stats, active = true) => `
                <div class="hf-blocked-item ${active ? '' : 'hf-blocked-item-inactive'}" data-type="${type}" data-value="${this.escapeHTML(value)}">
                    <span class="hf-blocked-name">${this.escapeHTML(value)}</span>
                    <span class="hf-blocked-count">${stats.hidden || 0}</span>
                    <button class="${active ? 'hf-unblock-btn' : 'hf-reactivate-btn'}" title="${active ? 'Разблокировать' : 'Снова блокировать'}">
                        ${active ? '✓' : '↺'}
                    </button>
                </div>
            `;

            panel.innerHTML = `
                <button class="hf-panel-toggle" title="Настройки фильтра">
                    <span class="hf-panel-icon">⚙️</span>
                    <span class="hf-panel-badge">${blockedTags.length + blockedAuthors.length}</span>
                </button>
                <div class="hf-panel-content">
                    <div class="hf-panel-header">
                        <h3>Фильтрация контента</h3>
                        <button class="hf-panel-close">×</button>
                    </div>

                    <div class="hf-panel-body">
                        <div class="hf-stats-summary">
                            <div class="hf-stat-card">
                                <div class="hf-stat-number">${storage.data.stats.totalHidden}</div>
                                <div class="hf-stat-label">Всего скрыто</div>
                            </div>
                        </div>

                        <div class="hf-section">
                            <h4>🏷️ Активные заблокированные теги (${blockedTags.length})</h4>
                            <div class="hf-blocked-list" id="hf-blocked-tags">
                                ${blockedTags.length ? blockedTags.map(([tag, stats]) => renderBlockedItem('tags', tag, stats, true)).join('') : '<div class="hf-empty">Нет активных заблокированных тегов</div>'}
                            </div>
                        </div>

                        <div class="hf-section">
                            <h4>✍️ Активные заблокированные авторы (${blockedAuthors.length})</h4>
                            <div class="hf-blocked-list" id="hf-blocked-authors">
                                ${blockedAuthors.length ? blockedAuthors.map(([author, stats]) => renderBlockedItem('authors', author, stats, true)).join('') : '<div class="hf-empty">Нет активных заблокированных авторов</div>'}
                            </div>
                        </div>

                        <div class="hf-section">
                            <h4>🕊 Ранее скрывавшиеся теги (${inactiveTags.length})</h4>
                            <div class="hf-blocked-list" id="hf-inactive-tags">
                                ${inactiveTags.length ? inactiveTags.map(([tag, stats]) => renderBlockedItem('tags', tag, stats, false)).join('') : '<div class="hf-empty">Нет ранее скрывавшихся тегов</div>'}
                            </div>
                        </div>

                        <div class="hf-section">
                            <h4>🕊 Ранее скрывавшиеся авторы (${inactiveAuthors.length})</h4>
                            <div class="hf-blocked-list" id="hf-inactive-authors">
                                ${inactiveAuthors.length ? inactiveAuthors.map(([author, stats]) => renderBlockedItem('authors', author, stats, false)).join('') : '<div class="hf-empty">Нет ранее скрывавшихся авторов</div>'}
                            </div>
                        </div>

                        <div class="hf-tip">
                            💡 <strong>Совет:</strong> Shift+Click по тегу или автору для быстрой блокировки
                        </div>
                    </div>
                </div>
            `;
            return panel;
        }

        static createNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `hf-notification hf-notification-${type}`;
            notification.innerHTML = `
                <div class="hf-notification-content">
                    <span class="hf-notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                    <span class="hf-notification-message">${this.escapeHTML(message)}</span>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('hf-notification-show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('hf-notification-show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        static formatDate(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;

            if (diff < 3600000) { // < 1 hour
                return `${Math.floor(diff / 60000)} мин назад`;
            } else if (diff < 86400000) { // < 1 day
                return `${Math.floor(diff / 3600000)} ч назад`;
            } else {
                return date.toLocaleDateString('ru-RU');
            }
        }
    }

    // ======================
    // CONTENT FILTER
    // (JS-логика без изменений, она оптимальна)
    // ======================
    class ContentFilter {
        constructor(storage) {
            this.storage = storage;
            this.currentMenu = null;
        }

        init() {
            this.injectStyles();
            this.processInitialContent();
            this.addControlPanel();
            this.setupKeyboardShortcuts();
            this.observeDOM();
        }

        /**
         * ==========================================================
         * * СТИЛИЗАЦИЯ ИНТЕРФЕЙСА
         * (Полностью переработано под стиль Habr)
         * * ==========================================================
         */
        injectStyles() {
            GM_addStyle(`
                /* =================================
                   Общие переменные (Habr's Palette)
                   ================================= */
                :root {
                    --hf-font: Inter, sans-serif;
                    --hf-green: #31a34c; /* Habr accent green */
                    --hf-blue: #507299;  /* Habr user link blue */
                    --hf-text-primary: #111827; /* Habr dark text */
                    --hf-text-secondary: #6b7280; /* Habr gray text */
                    --hf-bg-white: #ffffff;
                    --hf-bg-gray-light: #f9fafb; /* Habr light bg */
                    --hf-bg-gray-hover: #f3f4f6;
                    --hf-border: #e5e7eb; /* Habr border */
                }
            
                /* =================================
                   Кнопка блокировки (⛔)
                   ================================= */
                .hf-block-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    margin-left: 6px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.35;
                    filter: grayscale(1);
                    transition: all 0.2s ease;
                    font-size: 14px;
                    vertical-align: middle;
                    border-radius: 4px;
                }

                .tm-publication-hub__link-container:hover .hf-block-btn,
                .tm-user-info__user:hover .hf-block-btn,
                .hf-block-btn:hover {
                    opacity: 0.95;
                    filter: none;
                    transform: scale(1.1);
                    background: var(--hf-bg-gray-hover);
                }

                .hf-block-btn.blocked {
                    opacity: 0.95 !important;
                    filter: none;
                }

                /* =================================
                   Контекстное меню
                   ================================= */
                .hf-context-menu {
                    position: fixed;
                    background: var(--hf-bg-white);
                    border-radius: 8px; /* Native border-radius */
                    border: 1px solid var(--hf-border);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Native shadow */
                    min-width: 260px;
                    z-index: 10000;
                    animation: hf-menu-appear 0.15s ease-out;
                    overflow: hidden;
                    font-family: var(--hf-font);
                }

                @keyframes hf-menu-appear {
                    from {
                        opacity: 0;
                        transform: translateY(-5px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .hf-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: var(--hf-bg-gray-light); /* Native header bg */
                    border-bottom: 1px solid var(--hf-border);
                    color: var(--hf-text-primary);
                }

                .hf-menu-header strong {
                    font-size: 15px;
                    font-weight: 600;
                }

                .hf-menu-close {
                    background: none;
                    border: none;
                    color: var(--hf-text-secondary);
                    font-size: 24px;
                    cursor: pointer;
                    opacity: 0.7;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .hf-menu-close:hover {
                    opacity: 1;
                    color: var(--hf-text-primary);
                }

                .hf-menu-content {
                    padding: 8px;
                }

                .hf-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    background: none;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--hf-text-primary);
                    text-align: left;
                    transition: background 0.2s;
                }

                .hf-menu-item:hover {
                    background: var(--hf-bg-gray-hover);
                }

                .hf-menu-icon {
                    font-size: 16px;
                }

                .hf-menu-divider {
                    height: 1px;
                    background: var(--hf-border);
                    margin: 8px 0;
                }

                .hf-menu-stats {
                    padding: 10px 12px;
                    background: var(--hf-bg-gray-light);
                    border-radius: 6px;
                    margin-top: 4px;
                }

                .hf-stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 0;
                    font-size: 13px;
                }

                .hf-stat-label {
                    color: var(--hf-text-secondary);
                }

                .hf-stat-value {
                    font-weight: 600;
                    color: var(--hf-text-primary);
                }

                /* =================================
                   Панель управления (Кнопка)
                   ================================= */
                #hf-control-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: var(--hf-font);
                }

                .hf-panel-toggle {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background: var(--hf-bg-white);
                    border: 1px solid var(--hf-border);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .hf-panel-toggle:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: #d1d5db;
                }

                .hf-panel-icon {
                    font-size: 20px;
                }

                .hf-panel-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: var(--hf-green); /* Habr Green */
                    color: var(--hf-bg-white);
                    font-size: 11px;
                    font-weight: 600;
                    padding: 1px 6px;
                    border-radius: 999px;
                    min-width: 18px;
                    text-align: center;
                    border: 2px solid var(--hf-bg-white);
                }

                /* =================================
                   Панель управления (Контент)
                   ================================= */
                .hf-panel-content {
                    position: absolute;
                    bottom: 54px;
                    right: 0;
                    width: 380px;
                    max-height: 600px;
                    background: var(--hf-bg-white);
                    border-radius: 12px;
                    border: 1px solid var(--hf-border);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px) scale(0.98);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .hf-panel:not(.hf-panel-collapsed) .hf-panel-content {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }

                .hf-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: var(--hf-bg-gray-light);
                    border-bottom: 1px solid var(--hf-border);
                    color: var(--hf-text-primary);
                }

                .hf-panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .hf-panel-close {
                    background: none;
                    border: none;
                    color: var(--hf-text-secondary);
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }

                .hf-panel-close:hover {
                    opacity: 1;
                    color: var(--hf-text-primary);
                }

                .hf-panel-body {
                    padding: 16px;
                    overflow-y: auto;
                    max-height: 500px;
                }

                .hf-stats-summary {
                    margin-bottom: 20px;
                }

                .hf-stat-card {
                    text-align: center;
                    padding: 16px;
                    background: var(--hf-bg-gray-light);
                    border: 1px solid var(--hf-border);
                    border-radius: 8px;
                }

                .hf-stat-number {
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--hf-green);
                    line-height: 1.2;
                }

                .hf-stat-label {
                    font-size: 14px;
                    color: var(--hf-text-secondary);
                    margin-top: 4px;
                }

                .hf-section {
                    margin-bottom: 20px;
                }

                .hf-section h4 {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 10px 0;
                    color: var(--hf-text-primary);
                }

                .hf-blocked-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .hf-blocked-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 10px;
                    background: var(--hf-bg-white);
                    border: 1px solid var(--hf-border);
                    border-radius: 8px;
                    transition: background 0.2s;
                }

                .hf-blocked-item:hover {
                    background: var(--hf-bg-gray-light);
                }

                .hf-blocked-item-inactive {
                    opacity: 0.7;
                }
                
                .hf-blocked-item-inactive:hover {
                    opacity: 1;
                }

                .hf-blocked-name {
                    flex: 1;
                    font-size: 13px;
                    color: var(--hf-text-primary);
                    font-weight: 500;
                    word-break: break-all;
                }

                .hf-blocked-count {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--hf-text-secondary);
                    margin-right: 8px;
                }

                .hf-unblock-btn,
                .hf-reactivate-btn {
                    border: 1px solid;
                    padding: 3px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                
                /* Разблокировать (вторичное, "призрачное" действие) */
                .hf-unblock-btn {
                    background: transparent;
                    color: var(--hf-green);
                    border-color: var(--hf-green);
                }

                .hf-unblock-btn:hover {
                    background: #e7f4e8; /* Light green bg */
                }
                
                /* Снова блокировать (первичное действие) */
                .hf-reactivate-btn {
                    background: var(--hf-green);
                    color: var(--hf-bg-white);
                    border-color: var(--hf-green);
                }

                .hf-reactivate-btn:hover {
                    background: #2a8a40;
                    border-color: #2a8a40;
                }

                .hf-empty {
                    text-align: center;
                    padding: 16px;
                    color: var(--hf-text-secondary);
                    font-size: 13px;
                    border: 1px dashed var(--hf-border);
                    border-radius: 8px;
                }

                .hf-tip {
                    background: #fffbeb; /* Native Habr "info" yellow */
                    border: 1px solid #fde68a;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #78350f;
                    margin-top: 16px;
                }

                /* =================================
                   Скрытие и Заглушки
                   ================================= */
                .hf-article-hidden {
                    opacity: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    transition: all 0.3s ease;
                }

                .hf-full-article-block {
                    margin: 16px 0;
                    padding: 16px 20px;
                    border-radius: 8px;
                    background: #fffbeb; /* Native info yellow */
                    border: 1px solid #fde68a;
                    color: #78350f;
                    font-size: 14px;
                    line-height: 1.5;
                    font-family: var(--hf-font);
                }

                .hf-full-article-title {
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }
                
                .hf-full-article-reasons {
                    margin: 8px 0 12px 0;
                    font-size: 13px;
                }
                
                .hf-full-article-reasons ul {
                    margin: 4px 0 0 18px;
                    padding: 0;
                }
                
                .hf-full-article-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .hf-full-article-btn {
                    padding: 6px 12px;
                    border-radius: 6px;
                    border: 1px solid;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                
                /* Primary button (Green) */
                .hf-full-article-btn-primary {
                    background: var(--hf-green);
                    color: var(--hf-bg-white);
                    border-color: var(--hf-green);
                }
                .hf-full-article-btn-primary:hover {
                     background: #2a8a40;
                     border-color: #2a8a40;
                }
                
                /* Secondary button (Ghost) */
                .hf-full-article-btn-secondary {
                    background: var(--hf-bg-white);
                    color: var(--hf-text-primary);
                    border-color: #d1d5db; /* gray-300 */
                }
                .hf-full-article-btn-secondary:hover {
                    background: var(--hf-bg-gray-hover);
                    border-color: #9ca3af; /* gray-400 */
                }

                /* =================================
                   Уведомления
                   ================================= */
                .hf-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--hf-bg-white);
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                    z-index: 10001;
                    transform: translateX(400px);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-left: 4px solid;
                    font-family: var(--hf-font);
                }

                .hf-notification-show {
                    transform: translateX(0);
                }

                .hf-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .hf-notification-icon {
                    font-size: 20px;
                }

                .hf-notification-message {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--hf-text-primary);
                }

                .hf-notification-success {
                    border-left-color: var(--hf-green);
                }

                .hf-notification-error {
                    border-left-color: #ef4444; /* red-500 */
                }

                .hf-notification-info {
                    border-left-color: #3b82f6; /* blue-500 */
                }
            `);
        }

        /**
         * ==========================================================
         * * ЛОГИКА СКРИПТА
         * (Оптимизированный JS без изменений)
         * * ==========================================================
         */

        processInitialContent() {
            document.querySelectorAll('.tm-article-snippet').forEach(article => {
                this.processArticleSnippet(article);
            });

            const presenter = document.querySelector('.tm-article-presenter');
            if (presenter) {
                this.processFullArticle(presenter);
            }
        }

        processArticleSnippet(article) {
            if (article.dataset.hfProcessed) return;
            article.dataset.hfProcessed = 'true';

            const evaluation = this.evaluateArticleContent(article);

            evaluation.tags.forEach(tag => {
                this.injectBlockButton(tag.container, 'tags', tag.name, tag.stats);
            });
            if (evaluation.author) {
                this.injectBlockButton(evaluation.author.container, 'authors', evaluation.author.name, evaluation.author.stats);
            }

            if (evaluation.shouldHide) {
                this.hideArticle(article, evaluation.hideReasons);
            }
        }

        processFullArticle(presenter) {
            if (presenter.dataset.hfProcessedFull) return;
            presenter.dataset.hfProcessedFull = 'true';

            const evaluation = this.evaluateArticleContent(presenter);

            evaluation.tags.forEach(tag => {
                this.injectBlockButton(tag.container, 'tags', tag.name, tag.stats);
            });
            if (evaluation.author) {
                this.injectBlockButton(evaluation.author.container, 'authors', evaluation.author.name, evaluation.author.stats);
            }

            if (evaluation.shouldHide) {
                this.hideFullArticle(presenter, evaluation.hideReasons);
            }
        }

        evaluateArticleContent(element) {
            let shouldHide = false;
            const hideReasons = [];
            const tags = [];
            let author = null;

            element.querySelectorAll('a.tm-publication-hub__link').forEach(tagLink => {
                const tagContainer = tagLink.closest('.tm-publication-hub__link-container') || tagLink.parentElement;
                const tagSpan = tagLink.querySelector('span');
                const tagName = (tagSpan ? tagSpan.textContent.trim() : tagLink.textContent.trim()).toLowerCase();
                if (!tagName || !tagContainer) return;

                const stats = this.storage.getStats('tags', tagName);
                tags.push({ name: tagName, stats: stats, container: tagContainer });

                if (this.storage.isBlocked('tags', tagName)) {
                    shouldHide = true;
                    if (!hideReasons.includes(`тег: ${tagName}`)) {
                        hideReasons.push(`тег: ${tagName}`);
                    }
                }
            });

            const authorLink = element.querySelector('a.tm-user-info__username');
            if (authorLink) {
                const authorContainer = authorLink.parentElement;
                if (authorContainer) {
                    const authorName = authorLink.textContent.trim();
                    const stats = this.storage.getStats('authors', authorName);
                    author = { name: authorName, stats: stats, container: authorContainer };

                    if (this.storage.isBlocked('authors', authorName)) {
                        shouldHide = true;
                        hideReasons.push(`автор: ${authorName}`);
                    }
                }
            }
            
            return { shouldHide, hideReasons, tags, author };
        }

        injectBlockButton(container, type, value, stats) {
            if (container.querySelector('.hf-block-btn')) return;

            const blockBtn = document.createElement('button');
            blockBtn.className = 'hf-block-btn';
            blockBtn.innerHTML = stats.blocked ? '🔴' : '⛔';
            blockBtn.title = stats.blocked ? 'Заблокировано' : 'Нажмите для блокировки';
            if (stats.blocked) blockBtn.classList.add('blocked');

            container.appendChild(blockBtn);

            blockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showContextMenu(e, type, value);
            });
        }

        hideArticle(article, reasons) {
            if (!article.classList.contains('hf-article-hidden')) {
                reasons.forEach(reason => {
                    const [type, value] = reason.split(': ');
                    const typeKey = type === 'тег' ? 'tags' : 'authors';
                    this.storage.incrementHidden(typeKey, value);
                });
            }
            
            const container = article.closest('.tm-articles-list__item') || article;
            container.classList.add('hf-article-hidden');
        }

        hideFullArticle(articleRoot, reasons) {
            reasons.forEach(reason => {
                const [type, value] = reason.split(': ');
                const typeKey = type === 'тег' ? 'tags' : 'authors';
                this.storage.incrementHidden(typeKey, value);
            });

            const content = articleRoot.querySelector('.tm-article-presenter__body, .tm-article-presenter__content, article') || articleRoot;
            
            if (articleRoot.querySelector('.hf-full-article-block')) return;

            const placeholder = document.createElement('div');
            placeholder.className = 'hf-full-article-block';

            const reasonsList = reasons.map(r => `<li>${UIComponents.escapeHTML(r)}</li>`).join('');

            placeholder.innerHTML = `
                <div class="hf-full-article-title">Эта статья скрыта вашим фильтром контента</div>
                <div class="hf-full-article-reasons">
                    Причина${reasons.length > 1 ? 'ы' : ''}:
                    <ul>${reasonsList}</ul>
                </div>
                <div class="hf-full-article-actions">
                    <button class="hf-full-article-btn hf-full-article-btn-primary" data-action="show-once">
                        👁️ Показать только сейчас
                    </button>
                    <button class="hf-full-article-btn hf-full-article-btn-secondary" data-action="unblock">
                        ✅ Разблокировать критерии
                    </button>
                    <button class="hf-full-article-btn hf-full-article-btn-secondary" data-action="open-panel">
                        ⚙️ Открыть панель
                    </button>
                </div>
            `;

            content.style.display = 'none';
            content.parentNode.insertBefore(placeholder, content);

            placeholder.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]');
                if (!action) return;

                const actionName = action.dataset.action;

                if (actionName === 'show-once') {
                    content.style.display = '';
                    placeholder.remove();
                } else if (actionName === 'unblock') {
                    reasons.forEach(reason => {
                        const [type, value] = reason.split(': ');
                        const typeKey = type === 'тег' ? 'tags' : 'authors';
                        this.storage.removeBlock(typeKey, value);
                    });
                    UIComponents.createNotification('Блокировка для этой статьи снята', 'success');
                    content.style.display = '';
                    placeholder.remove();
                    this.refresh();
                } else if (actionName === 'open-panel') {
                    const panel = document.getElementById('hf-control-panel');
                    if (panel) {
                        panel.classList.remove('hf-panel-collapsed');
                    }
                }
            });
        }

        showContextMenu(event, type, value) {
            event.preventDefault();
            event.stopPropagation();

            if (this.currentMenu) {
                this.currentMenu.remove();
            }

            const stats = this.storage.getStats(type, value);
            const menu = UIComponents.createContextMenu(type, value, stats);

            const rect = event.target.getBoundingClientRect();
            menu.style.left = `${rect.left}px`;
            menu.style.top = `${rect.bottom + 8}px`; // Чуть ближе

            document.body.appendChild(menu);
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > (window.innerWidth - 10)) {
                menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
            }
            if (menuRect.bottom > (window.innerHeight - 10)) {
                menu.style.top = `${rect.top - menuRect.height - 8}px`;
            }

            this.currentMenu = menu;

            menu.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('.hf-menu-close');
                const blockBtn = e.target.closest('.hf-block-action');
                const unblockBtn = e.target.closest('.hf-unblock-action');

                if (closeBtn) {
                    menu.remove();
                    this.currentMenu = null;
                } else if (blockBtn) {
                    const duration = blockBtn.dataset.duration;
                    this.storage.addBlock(type, value, duration);
                    UIComponents.createNotification(`Заблокировано: ${value}`, 'success');
                    menu.remove();
                    this.currentMenu = null;
                    this.refresh();
                } else if (unblockBtn) {
                    this.storage.removeBlock(type, value);
                    UIComponents.createNotification(`Разблокировано: ${value}`, 'success');
                    menu.remove();
                    this.currentMenu = null;
                    this.refresh();
                }
            });

            setTimeout(() => {
                document.addEventListener('click', this.closeMenuHandler = (e) => {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                        this.currentMenu = null;
                        document.removeEventListener('click', this.closeMenuHandler);
                    }
                });
            }, 100);
        }

        addControlPanel() {
            if (document.getElementById('hf-control-panel')) return;
            if (!document.body) {
                setTimeout(() => this.addControlPanel(), 100);
                return;
            }

            const panel = UIComponents.createControlPanel(this.storage);
            document.body.appendChild(panel);

            panel.addEventListener('click', (e) => {
                const toggleBtn = e.target.closest('.hf-panel-toggle');
                const closeBtn = e.target.closest('.hf-panel-close');
                const unblockBtn = e.target.closest('.hf-unblock-btn');
                const reactivateBtn = e.target.closest('.hf-reactivate-btn');

                if (toggleBtn) {
                    panel.classList.toggle('hf-panel-collapsed');
                } else if (closeBtn) {
                    panel.classList.add('hf-panel-collapsed');
                } else if (unblockBtn) {
                    const item = unblockBtn.closest('.hf-blocked-item');
                    const type = item.dataset.type;
                    const value = item.dataset.value;
                    this.storage.removeBlock(type, value);
                    UIComponents.createNotification(`Разблокировано: ${value}`, 'success');
                    this.refresh();
                } else if (reactivateBtn) {
                    const item = reactivateBtn.closest('.hf-blocked-item');
                    const type = item.dataset.type;
                    const value = item.dataset.value;
                    this.storage.addBlock(type, value);
                    UIComponents.createNotification(`Снова заблокировано: ${value}`, 'success');
                    this.refresh();
                }
            });
        }

        setupKeyboardShortcuts() {
            document.addEventListener('click', (e) => {
                if (!e.shiftKey) return;

                const tagLink = e.target.closest('a.tm-publication-hub__link');
                const authorLink = e.target.closest('a.tm-user-info__username');

                if (tagLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    const tagSpan = tagLink.querySelector('span');
                    const tagName = (tagSpan ? tagSpan.textContent.trim() : tagLink.textContent.trim()).toLowerCase();
                    this.storage.addBlock('tags', tagName);
                    UIComponents.createNotification(`⚡ Быстро заблокирован тег: ${tagName}`, 'success');
                    this.refresh();
                } else if (authorLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    const authorName = authorLink.textContent.trim();
                    this.storage.addBlock('authors', authorName);
                    UIComponents.createNotification(`⚡ Быстро заблокирован автор: ${authorName}`, 'success');
                    this.refresh();
                }
            });
        }

        observeDOM() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;

                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.matches('.tm-article-snippet')) {
                            this.processArticleSnippet(node);
                        }
                        else if (node.matches('.tm-article-presenter')) {
                            this.processFullArticle(node);
                        }
                        else {
                            node.querySelectorAll('.tm-article-snippet').forEach(snippet => this.processArticleSnippet(snippet));
                            const presenter = node.querySelector('.tm-article-presenter');
                            if (presenter) this.processFullArticle(presenter);
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        refresh() {
            let panelWasOpen = false;
            const oldPanel = document.getElementById('hf-control-panel');
            if (oldPanel) {
                panelWasOpen = !oldPanel.classList.contains('hf-panel-collapsed');
                oldPanel.remove();
            }

            this.storage.data = this.storage.load();

            this.addControlPanel();
            const newPanel = document.getElementById('hf-control-panel');
            if (newPanel && panelWasOpen) {
                newPanel.classList.remove('hf-panel-collapsed');
            }

            this.reEvaluateProcessedContent();
        }

        reEvaluateProcessedContent() {
            document.querySelectorAll('.tm-article-snippet[data-hf-processed]').forEach(article => {
                const evaluation = this.evaluateArticleContent(article);
                
                evaluation.tags.forEach(tag => {
                    const btn = tag.container.querySelector('.hf-block-btn');
                    if (btn) {
                        btn.innerHTML = tag.stats.blocked ? '🔴' : '⛔';
                        btn.title = tag.stats.blocked ? 'Заблокировано' : 'Нажмите для блокировки';
                        btn.classList.toggle('blocked', tag.stats.blocked);
                    }
                });
                if (evaluation.author) {
                    const btn = evaluation.author.container.querySelector('.hf-block-btn');
                     if (btn) {
                        btn.innerHTML = evaluation.author.stats.blocked ? '🔴' : '⛔';
                        btn.title = evaluation.author.stats.blocked ? 'Заблокировано' : 'Нажмите для блокировки';
                        btn.classList.toggle('blocked', evaluation.author.stats.blocked);
                    }
                }

                const container = article.closest('.tm-articles-list__item') || article;
                container.classList.toggle('hf-article-hidden', evaluation.shouldHide);
            });

            const presenter = document.querySelector('.tm-article-presenter[data-hf-processed-full]');
            if (presenter) {
                const evaluation = this.evaluateArticleContent(presenter);
                const content = presenter.querySelector('.tm-article-presenter__body, .tm-article-presenter__content, article');
                const placeholder = presenter.querySelector('.hf-full-article-block');
                
                evaluation.tags.forEach(tag => {
                    const btn = tag.container.querySelector('.hf-block-btn');
                    if(btn) {
                        btn.innerHTML = tag.stats.blocked ? '🔴' : '⛔';
                        btn.classList.toggle('blocked', tag.stats.blocked);
                    }
                });
                if (evaluation.author) {
                     const btn = evaluation.author.container.querySelector('.hf-block-btn');
                     if(btn) {
                        btn.innerHTML = evaluation.author.stats.blocked ? '🔴' : '⛔';
                        btn.classList.toggle('blocked', evaluation.author.stats.blocked);
                     }
                }

                if (evaluation.shouldHide && !placeholder) {
                    this.hideFullArticle(presenter, evaluation.hideReasons);
                } else if (!evaluation.shouldHide && placeholder) {
                    if(content) content.style.display = '';
                    placeholder.remove();
                }
            }
        }
    }

    // ======================
    // INIT
    // ======================
    console.log('🎯 Habr Content Filter Pro v2.5 (Native UI) загружается...');

    function initialize() {
        console.log('📦 Инициализация фильтра...');
        try {
            const storage = new StorageManager();
            const filter = new ContentFilter(storage);
            filter.init();
            console.log('✅ Фильтр успешно запущен!');
        } catch (error) {
            console.error('❌ Ошибка при инициализации фильтра:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

})();

