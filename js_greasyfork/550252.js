// ==UserScript==
// @name         NovelBin Progress Tracker Pro
// @namespace    https://novelbin.com/
// @version      2.4.0
// @description  Продвинутый трекер прогресса чтения с красивым интерфейсом и библиотекой для NovelBin
// @author       AI Assistant
// @match        https://novelbin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_listValues
// @icon         https://novelbin.com/favicon.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550252/NovelBin%20Progress%20Tracker%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/550252/NovelBin%20Progress%20Tracker%20Pro.meta.js
// ==/UserScript==

/*
 * === ИНСТРУКЦИЯ ПО УСТАНОВКЕ ===
 * 1. Установите расширение Tampermonkey в браузере
 * 2. Скопируйте весь этот код
 * 3. Создайте новый скрипт в Tampermonkey и вставьте код
 * 4. Сохраните (Ctrl+S) и активируйте скрипт
 *
 * === НАСТРОЙКА СЕЛЕКТОРОВ ===
 * Если структура сайта изменится, обновите селекторы в объекте SELECTORS
 *
 * === ЭКСПОРТ/ИМПОРТ ===
 * Используйте кнопки в интерфейсе для сохранения/восстановления прогресса
 */

(function() {
    'use strict';

    // ==================== КОНФИГУРАЦИЯ ====================

    // Селекторы для извлечения данных (обновляйте при изменении структуры сайта)
    const SELECTORS = {
        bookTitle: [
            'meta[property="og:title"]',
            '.novel-title',
            'h1.novel-title',
            '.book-title',
            'h1'
        ],
        chapterTitle: [
            'h1',
            '.chapter-title',
            '.entry-title',
            'meta[property="og:title"]',
            'title'
        ],
        nextChapter: [
            'a[rel="next"]',
            'a.next-chapter',
            '.nav-next a',
            'a:contains("Next")',
            'a:contains("Следующая")',
            '.btn:contains("Next Chapter")'
        ],
        prevChapter: [
            'a[rel="prev"]',
            'a.prev-chapter',
            '.nav-previous a',
            'a:contains("Previous")',
            'a:contains("Предыдущая")',
            '.btn:contains("Previous Chapter")'
        ],
        // Новые селекторы для автоматического обновления
        chapterButton: [
            'button.btn.btn-success.chr-jump',
            'button[class*="chr-jump"]',
            '.chr-jump',
            'button:contains("Chapter")'
        ],
        chapterSelect: [
            'select.btn.btn-success.form-control.chr-jump',
            'select[class*="chr-jump"]',
            'select.form-control.chr-jump',
            '.chr-jump select'
        ]
    };

    // Настройки интерфейса
    const UI_CONFIG = {
        panelPosition: 'bottom-right',
        animationDuration: 300,
        toastDuration: 3000,
        maxHistoryItems: 50,
        autoSaveEnabled: false,
        autoUpdateChapters: true // Новая настройка
    };

    // ==================== УТИЛИТЫ ====================

    class StorageManager {
        constructor() {
            this.prefix = 'novelbin_progress_';
            this.hasGM = typeof GM_setValue !== 'undefined';
        }

        async set(key, value) {
            const fullKey = this.prefix + key;
            try {
                if (this.hasGM) {
                    await GM_setValue(fullKey, value);
                } else {
                    localStorage.setItem(fullKey, JSON.stringify(value));
                }
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        }

        async get(key, defaultValue = null) {
            const fullKey = this.prefix + key;
            try {
                if (this.hasGM) {
                    return await GM_getValue(fullKey, defaultValue);
                } else {
                    const data = localStorage.getItem(fullKey);
                    return data ? JSON.parse(data) : defaultValue;
                }
            } catch (e) {
                console.error('Storage error:', e);
                return defaultValue;
            }
        }

        async remove(key) {
            const fullKey = this.prefix + key;
            try {
                if (this.hasGM) {
                    await GM_deleteValue(fullKey);
                } else {
                    localStorage.removeItem(fullKey);
                }
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        }

        async getAllKeys() {
            try {
                if (this.hasGM && typeof GM_listValues !== 'undefined') {
                    return await GM_listValues();
                } else if (this.hasGM) {
                    return await this.getKeysFromIndex();
                } else {
                    return Object.keys(localStorage)
                        .filter(key => key.startsWith(this.prefix));
                }
            } catch (e) {
                console.error('Error getting all keys:', e);
                return [];
            }
        }

        async getKeysFromIndex() {
            try {
                const indexKey = 'keys_index';
                let keysIndex = await this.get(indexKey, []);

                const validKeys = [];
                for (const key of keysIndex) {
                    const data = await this.get(key.replace(this.prefix, ''));
                    if (data !== null) {
                        validKeys.push(key);
                    }
                }

                if (validKeys.length !== keysIndex.length) {
                    await this.set(indexKey, validKeys);
                }

                return validKeys;
            } catch (e) {
                console.error('Error getting keys from index:', e);
                return [];
            }
        }

        async updateKeysIndex(key, isDelete = false) {
            try {
                const indexKey = 'keys_index';
                const fullKey = this.prefix + key;
                let keysIndex = await this.get(indexKey, []);

                if (isDelete) {
                    keysIndex = keysIndex.filter(k => k !== fullKey);
                } else {
                    if (!keysIndex.includes(fullKey) && key !== indexKey) {
                        keysIndex.push(fullKey);
                    }
                }

                await this.set(indexKey, keysIndex);
            } catch (e) {
                console.error('Error updating keys index:', e);
            }
        }

        async getAllNovels() {
            try {
                const keys = await this.getAllKeys();
                const novels = [];

                for (const key of keys) {
                    const cleanKey = key.replace(this.prefix, '');
                    if (cleanKey === 'ui_settings' || cleanKey === 'global_history' || cleanKey === 'keys_index') {
                        continue;
                    }

                    const data = await this.get(cleanKey);
                    if (data && data.bookTitle) {
                        novels.push({
                            id: cleanKey,
                            ...data
                        });
                    }
                }

                novels.sort((a, b) => {
                    const timeA = a.lastChapter ? a.lastChapter.timestamp : 0;
                    const timeB = b.lastChapter ? b.lastChapter.timestamp : 0;
                    return timeB - timeA;
                });

                return novels;
            } catch (e) {
                console.error('Error getting all novels:', e);
                return [];
            }
        }
    }

    // Класс для извлечения данных со страницы
    class DataExtractor {
        // Получение названия книги
        static getBookTitle() {
            const url = window.location.href;

            const urlMatch = url.match(/\/b\/([^\/]+)/);
            if (urlMatch) {
                return urlMatch[1].replace(/-/g, ' ');
            }

            for (const selector of SELECTORS.bookTitle) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.content || element.textContent;
                    if (text) {
                        const bookMatch = text.match(/^(.+?)(?:\s*[-–]\s*Chapter|\s*[-–]\s*Глава|$)/i);
                        if (bookMatch) return bookMatch[1].trim();
                    }
                }
            }

            const titleMatch = document.title.match(/^(.+?)(?:\s*[-–]\s*Chapter|\s*[-–]\s*Глава|$)/i);
            return titleMatch ? titleMatch[1].trim() : 'Unknown Novel';
        }

        static getChapterTitle() {
            for (const selector of SELECTORS.chapterTitle) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.content || element.textContent;
                    if (text && (text.includes('Chapter') || text.includes('Глава'))) {
                        return text.trim();
                    }
                }
            }

            const url = window.location.href;
            const chapterMatch = url.match(/chapter-(\d+)/i);
            if (chapterMatch) {
                return `Chapter ${chapterMatch[1]}`;
            }

            return document.title || 'Unknown Chapter';
        }

        static getChapterNumber() {
            const chapterTitle = this.getChapterTitle();

            const numberMatch = chapterTitle.match(/chapter\s*(\d+)/i) ||
                               chapterTitle.match(/глава\s*(\d+)/i) ||
                               chapterTitle.match(/(\d+)/);

            if (numberMatch) {
                return parseInt(numberMatch[1]);
            }

            const url = window.location.href;
            const urlMatch = url.match(/chapter-(\d+)/i) || url.match(/c(\d+)/i);
            if (urlMatch) {
                return parseInt(urlMatch[1]);
            }

            return null;
        }

        // Новый метод для получения последнего доступного номера главы
        static getLatestChapterNumber() {
            try {
                // Ищем селектор с главами
                const chapterSelect = document.querySelector(SELECTORS.chapterSelect[0]) ||
                                    document.querySelector('select.chr-jump') ||
                                    document.querySelector('select[class*="chr-jump"]');

                if (chapterSelect && chapterSelect.options && chapterSelect.options.length > 0) {
                    const lastOption = chapterSelect.options[chapterSelect.options.length - 1];
                    const text = lastOption.textContent || lastOption.text || '';

                    // Извлекаем номер главы из текста
                    const numberMatch = text.match(/chapter\s*(\d+)/i) ||
                                       text.match(/глава\s*(\d+)/i) ||
                                       text.match(/(\d+)/);

                    if (numberMatch) {
                        return parseInt(numberMatch[1]);
                    }
                }

                return null;
            } catch (e) {
                console.error('Error getting latest chapter number:', e);
                return null;
            }
        }

        static getNextChapterLink() {
            for (const selector of SELECTORS.nextChapter) {
                try {
                    let elements;
                    if (selector.includes(':contains')) {
                        const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                        elements = Array.from(document.querySelectorAll('a')).filter(a =>
                            a.textContent.toLowerCase().includes(text.toLowerCase())
                        );
                    } else {
                        elements = document.querySelectorAll(selector);
                    }

                    for (const element of elements) {
                        if (element && element.href) {
                            return element.href;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            return null;
        }

        static getPrevChapterLink() {
            for (const selector of SELECTORS.prevChapter) {
                try {
                    let elements;
                    if (selector.includes(':contains')) {
                        const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                        elements = Array.from(document.querySelectorAll('a')).filter(a =>
                            a.textContent.toLowerCase().includes(text.toLowerCase())
                        );
                    } else {
                        elements = document.querySelectorAll(selector);
                    }

                    for (const element of elements) {
                        if (element && element.href) {
                            return element.href;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            return null;
        }

        static getBookId() {
            const bookTitle = this.getBookTitle();
            return bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
        }

        // Новый метод для автоматического нажатия кнопки обновления глав
        static async triggerChapterUpdate() {
            try {
                // Ищем кнопку для обновления списка глав
                for (const selector of SELECTORS.chapterButton) {
                    const button = document.querySelector(selector);
                    if (button && button.click) {
                        console.log('Clicking chapter update button:', selector);
                        button.click();

                        // Ждем немного для загрузки данных
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return true;
                    }
                }

                // Если кнопка не найдена, пробуем событие change на select
                const select = document.querySelector('select.chr-jump') ||
                             document.querySelector('select[class*="chr-jump"]');

                if (select) {
                    console.log('Triggering change event on select');
                    const event = new Event('change', { bubbles: true });
                    select.dispatchEvent(event);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return true;
                }

                return false;
            } catch (e) {
                console.error('Error triggering chapter update:', e);
                return false;
            }
        }
    }

    // ==================== UI КОМПОНЕНТЫ ====================

    class UIManager {
        constructor(storage) {
            this.storage = storage;
            this.panel = null;
            this.isCollapsed = false;
            this.isDarkMode = true;
            this.currentLang = 'ru';
            this.latestChapter = null; // Новое поле для последней главы
            this.translations = {
                ru: {
                    bookLabel: 'Книга:',
                    chapterLabel: 'Глава:',
                    savedLabel: 'Сохранено:',
                    latestLabel: 'Последняя:',
                    saveBtn: 'Сохранить',
                    continueBtn: 'Продолжить',
                    nextBtn: 'След.',
                    prevBtn: 'Пред.',
                    exportBtn: 'Экспорт',
                    importBtn: 'Импорт',
                    clearBtn: 'Очистить',
                    historyBtn: 'История',
                    libraryBtn: 'Библиотека',
                    settingsBtn: 'Настройки',
                    updateBtn: '🔄',
                    autoSaveLabel: 'Автосохранение',
                    themeLabel: 'Тёмная тема',
                    langLabel: 'Язык',
                    autoUpdateLabel: 'Авто-обновление глав',
                    saved: 'Прогресс сохранён',
                    loaded: 'Прогресс загружен',
                    cleared: 'Прогресс очищен',
                    updated: 'Главы обновлены',
                    noProgress: 'Нет сохранённого прогресса',
                    confirmClear: 'Удалить весь прогресс для этой книги?',
                    exportSuccess: 'Данные экспортированы',
                    importSuccess: 'Данные импортированы',
                    importError: 'Ошибка импорта данных',
                    libraryTitle: 'Библиотека новелл',
                    emptyLibrary: 'Библиотека пуста',
                    lastRead: 'Последнее чтение:',
                    goToChapter: 'Перейти к главе',
                    deleteNovel: 'Удалить',
                    confirmDeleteNovel: 'Удалить эту новеллу из библиотеки?',
                    searchPlaceholder: 'Поиск по названию...',
                    totalNovels: 'Всего новелл:'
                },
                en: {
                    bookLabel: 'Book:',
                    chapterLabel: 'Chapter:',
                    savedLabel: 'Saved:',
                    latestLabel: 'Latest:',
                    saveBtn: 'Save',
                    continueBtn: 'Continue',
                    nextBtn: 'Next',
                    prevBtn: 'Prev',
                    exportBtn: 'Export',
                    importBtn: 'Import',
                    clearBtn: 'Clear',
                    historyBtn: 'History',
                    libraryBtn: 'Library',
                    settingsBtn: 'Settings',
                    updateBtn: '🔄',
                    autoSaveLabel: 'Auto-save',
                    themeLabel: 'Dark theme',
                    langLabel: 'Language',
                    autoUpdateLabel: 'Auto-update chapters',
                    saved: 'Progress saved',
                    loaded: 'Progress loaded',
                    cleared: 'Progress cleared',
                    updated: 'Chapters updated',
                    noProgress: 'No saved progress',
                    confirmClear: 'Delete all progress for this book?',
                    exportSuccess: 'Data exported',
                    importSuccess: 'Data imported',
                    importError: 'Import error',
                    libraryTitle: 'Novel Library',
                    emptyLibrary: 'Library is empty',
                    lastRead: 'Last read:',
                    goToChapter: 'Go to chapter',
                    deleteNovel: 'Delete',
                    confirmDeleteNovel: 'Delete this novel from library?',
                    searchPlaceholder: 'Search by title...',
                    totalNovels: 'Total novels:'
                }
            };
        }

        t(key) {
            return this.translations[this.currentLang][key] || key;
        }

        async init() {
            await this.loadSettings();
            this.injectStyles();

            // Автоматически обновляем главы при загрузке страницы
            if (UI_CONFIG.autoUpdateChapters) {
                await this.autoUpdateChapters();
            }

            this.createPanel();
            await this.loadProgress();
            this.setupEventListeners();
            this.setupKeyboardShortcuts();
        }

        async autoUpdateChapters() {
            try {
                console.log('Auto-updating chapters on page load...');
                await DataExtractor.triggerChapterUpdate();

                // Обновляем информацию о последней главе
                setTimeout(() => {
                    this.updateLatestChapterInfo();
                }, 1500);
            } catch (e) {
                console.error('Error in auto-update chapters:', e);
            }
        }

        updateLatestChapterInfo() {
            try {
                this.latestChapter = DataExtractor.getLatestChapterNumber();
                const latestChapterEl = document.getElementById('nbp-latest-chapter');

                if (latestChapterEl) {
                    if (this.latestChapter) {
                        latestChapterEl.textContent = `Глава ${this.latestChapter}`;

                        // Подсвечиваем, если текущая глава отстает
                        const currentChapter = DataExtractor.getChapterNumber();
                        if (currentChapter && currentChapter < this.latestChapter) {
                            latestChapterEl.style.color = '#ff6b6b';
                            latestChapterEl.title = `Доступно еще ${this.latestChapter - currentChapter} глав`;
                        } else {
                            latestChapterEl.style.color = '#43e97b';
                            latestChapterEl.title = 'Вы читаете последнюю главу';
                        }
                    } else {
                        latestChapterEl.textContent = '-';
                        latestChapterEl.style.color = '';
                        latestChapterEl.title = '';
                    }
                }
            } catch (e) {
                console.error('Error updating latest chapter info:', e);
            }
        }

        async loadSettings() {
            const settings = await this.storage.get('ui_settings', {
                isCollapsed: false,
                isDarkMode: true,
                currentLang: 'ru',
                autoUpdateChapters: true
            });

            this.isCollapsed = settings.isCollapsed;
            this.isDarkMode = settings.isDarkMode;
            this.currentLang = settings.currentLang;
            UI_CONFIG.autoUpdateChapters = settings.autoUpdateChapters !== false;
        }

        async saveSettings() {
            await this.storage.set('ui_settings', {
                isCollapsed: this.isCollapsed,
                isDarkMode: this.isDarkMode,
                currentLang: this.currentLang,
                autoUpdateChapters: UI_CONFIG.autoUpdateChapters
            });
        }

        injectStyles() {
            const styles = `
                /* Основная панель */
                #novelbin-progress-panel {
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    width: 360px !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
                    padding: 20px !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    z-index: 999999 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    display: block !important;
                    visibility: visible !important;
                }

                #novelbin-progress-panel.dark {
                    background: rgba(30, 30, 30, 0.95) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #e0e0e0 !important;
                }

                #novelbin-progress-panel.collapsed {
                    width: 80px !important;
                    height: 80px !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                }

                /* Заголовок панели */
                .nbp-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 15px !important;
                    padding-bottom: 10px !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                }

                .dark .nbp-header {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                }

                .nbp-title {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    color: #333 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }

                .dark .nbp-title {
                    color: #fff !important;
                }

                /* Кнопка сворачивания */
                .nbp-collapse-btn {
                    width: 30px !important;
                    height: 30px !important;
                    border-radius: 50% !important;
                    background: rgba(0, 0, 0, 0.05) !important;
                    border: none !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s !important;
                }

                .dark .nbp-collapse-btn {
                    background: rgba(255, 255, 255, 0.1) !important;
                }

                .nbp-collapse-btn:hover {
                    background: rgba(0, 0, 0, 0.1) !important;
                    transform: scale(1.1) !important;
                }

                .dark .nbp-collapse-btn:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                }

                .collapsed .nbp-collapse-btn {
                    position: absolute !important;
                    top: 25px !important;
                    left: 25px !important;
                    width: 30px !important;
                    height: 30px !important;
                }

                /* Контент панели */
                .nbp-content {
                    opacity: 1 !important;
                    transition: opacity 0.3s !important;
                    display: block !important;
                }

                .collapsed .nbp-content {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }

                /* Информационные блоки */
                .nbp-info {
                    margin-bottom: 15px !important;
                }

                .nbp-info-item {
                    display: flex !important;
                    margin-bottom: 8px !important;
                    font-size: 13px !important;
                }

                .nbp-info-label {
                    font-weight: 500 !important;
                    margin-right: 8px !important;
                    color: #666 !important;
                    min-width: 70px !important;
                }

                .dark .nbp-info-label {
                    color: #999 !important;
                }

                .nbp-info-value {
                    color: #333 !important;
                    flex: 1 !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    white-space: nowrap !important;
                }

                .dark .nbp-info-value {
                    color: #e0e0e0 !important;
                }

                /* Подсветка для последней главы */
                .nbp-info-value.latest-chapter {
                    font-weight: 600 !important;
                    transition: color 0.3s !important;
                }

                /* Кнопки управления */
                .nbp-controls {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 8px !important;
                    margin-bottom: 15px !important;
                }

                .nbp-btn {
                    padding: 8px 12px !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    color: white !important;
                    position: relative !important;
                    overflow: hidden !important;
                }

                .nbp-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4) !important;
                }

                .nbp-btn:active {
                    transform: translateY(0) !important;
                }

                .nbp-btn.primary {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
                }

                .nbp-btn.secondary {
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
                }

                .nbp-btn.update {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    font-size: 16px !important;
                    padding: 6px !important;
                }

                .nbp-btn:disabled {
                    opacity: 0.5 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                }

                /* Дополнительные кнопки */
                .nbp-extra-controls {
                    display: flex !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                }

                .nbp-small-btn {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    background: white !important;
                    color: #333 !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                }

                .dark .nbp-small-btn {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #e0e0e0 !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                }

                .nbp-small-btn:hover {
                    background: rgba(0, 0, 0, 0.05) !important;
                    transform: translateY(-1px) !important;
                }

                .dark .nbp-small-btn:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                }

                /* Toast уведомления */
                .nbp-toast {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    padding: 12px 20px !important;
                    background: white !important;
                    border-radius: 8px !important;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
                    font-size: 14px !important;
                    z-index: 1000000 !important;
                    animation: slideIn 0.3s ease !important;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .nbp-toast.success {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
                    color: white !important;
                }

                .nbp-toast.error {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%) !important;
                    color: white !important;
                }

                /* Модальное окно */
                .nbp-modal {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: 1000001 !important;
                    animation: fadeIn 0.3s ease !important;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .nbp-modal-content {
                    background: white !important;
                    border-radius: 12px !important;
                    padding: 24px !important;
                    max-width: 700px !important;
                    width: 90% !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                }

                .dark .nbp-modal-content {
                    background: #2a2a2a !important;
                    color: #e0e0e0 !important;
                }

                .nbp-modal-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 20px !important;
                    padding-bottom: 10px !important;
                    border-bottom: 1px solid #eee !important;
                    font-size: 18px !important;
                    font-weight: 600 !important;
                }

                .dark .nbp-modal-header {
                    border-bottom: 1px solid #444 !important;
                }

                .nbp-modal-close {
                    cursor: pointer !important;
                    font-size: 24px !important;
                    opacity: 0.6 !important;
                    transition: opacity 0.2s !important;
                }

                .nbp-modal-close:hover {
                    opacity: 1 !important;
                }

                /* Библиотека новелл */
                .nbp-library-search {
                    width: 100% !important;
                    padding: 10px !important;
                    border: 1px solid #ddd !important;
                    border-radius: 8px !important;
                    margin-bottom: 15px !important;
                    font-size: 14px !important;
                }

                .dark .nbp-library-search {
                    background: #333 !important;
                    border-color: #555 !important;
                    color: #e0e0e0 !important;
                }

                .nbp-library-stats {
                    text-align: center !important;
                    margin-bottom: 15px !important;
                    font-size: 14px !important;
                    color: #666 !important;
                }

                .dark .nbp-library-stats {
                    color: #999 !important;
                }

                .nbp-novel-list {
                    max-height: 400px !important;
                    overflow-y: auto !important;
                }

                .nbp-novel-item {
                    border: 1px solid #eee !important;
                    border-radius: 8px !important;
                    padding: 15px !important;
                    margin-bottom: 10px !important;
                    transition: all 0.2s !important;
                }

                .dark .nbp-novel-item {
                    border-color: #444 !important;
                    background: rgba(255, 255, 255, 0.02) !important;
                }

                .nbp-novel-item:hover {
                    background: rgba(0, 0, 0, 0.02) !important;
                    border-color: #ccc !important;
                }

                .dark .nbp-novel-item:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: #666 !important;
                }

                .nbp-novel-title {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    margin-bottom: 8px !important;
                    color: #333 !important;
                }

                .dark .nbp-novel-title {
                    color: #e0e0e0 !important;
                }

                .nbp-novel-info {
                    font-size: 13px !important;
                    color: #666 !important;
                    margin-bottom: 10px !important;
                }

                .dark .nbp-novel-info {
                    color: #999 !important;
                }

                .nbp-novel-actions {
                    display: flex !important;
                    gap: 8px !important;
                }

                .nbp-novel-btn {
                    padding: 6px 12px !important;
                    border: none !important;
                    border-radius: 6px !important;
                    font-size: 12px !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                    text-decoration: none !important;
                    display: inline-block !important;
                    text-align: center !important;
                    font-weight: 500 !important;
                    user-select: none !important;
                }

                .nbp-novel-btn.primary {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
                    color: white !important;
                }

                .nbp-novel-btn.primary:visited {
                    color: white !important;
                }

                .nbp-novel-btn.danger {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%) !important;
                    color: white !important;
                }

                .nbp-novel-btn:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
                }

                .nbp-novel-btn:active {
                    transform: translateY(0) !important;
                }

                .nbp-novel-btn:disabled {
                    opacity: 0.5 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                }

                .nbp-novel-btn:disabled:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }

                .nbp-empty-library {
                    text-align: center !important;
                    padding: 40px 20px !important;
                    color: #666 !important;
                    font-style: italic !important;
                }

                .dark .nbp-empty-library {
                    color: #999 !important;
                }

                /* Настройки */
                .nbp-setting {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 15px !important;
                    padding: 10px !important;
                    border: 1px solid #eee !important;
                    border-radius: 8px !important;
                }

                .dark .nbp-setting {
                    border-color: #444 !important;
                }

                .nbp-switch {
                    position: relative !important;
                    display: inline-block !important;
                    width: 50px !important;
                    height: 24px !important;
                }

                .nbp-switch input {
                    opacity: 0 !important;
                    width: 0 !important;
                    height: 0 !important;
                }

                .nbp-switch-slider {
                    position: absolute !important;
                    cursor: pointer !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background-color: #ccc !important;
                    transition: 0.4s !important;
                    border-radius: 24px !important;
                }

                .nbp-switch-slider:before {
                    position: absolute !important;
                    content: "" !important;
                    height: 18px !important;
                    width: 18px !important;
                    left: 3px !important;
                    bottom: 3px !important;
                    background-color: white !important;
                    transition: 0.4s !important;
                    border-radius: 50% !important;
                }

                .nbp-switch input:checked + .nbp-switch-slider {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
                }

                .nbp-switch input:checked + .nbp-switch-slider:before {
                    transform: translateX(26px) !important;
                }

                /* Мобильная адаптация */
                @media (max-width: 480px) {
                    #novelbin-progress-panel {
                        width: calc(100% - 40px) !important;
                        right: 20px !important;
                        left: 20px !important;
                    }

                    .nbp-controls {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }

                    .nbp-modal-content {
                        width: 95% !important;
                        padding: 16px !important;
                    }
                }
            `;

            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(styles);
            } else {
                const styleElement = document.createElement('style');
                styleElement.textContent = styles;
                document.head.appendChild(styleElement);
            }
        }

        createPanel() {
            if (document.getElementById('novelbin-progress-panel')) {
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'novelbin-progress-panel';
            panel.className = this.isDarkMode ? 'dark' : '';

            if (this.isCollapsed) {
                panel.classList.add('collapsed');
            }

            panel.innerHTML = `
                <div class="nbp-header">
                    <div class="nbp-title">
                        📚 NovelBin Tracker
                    </div>
                    <button class="nbp-collapse-btn" id="nbp-collapse">
                        <span>${this.isCollapsed ? '⊕' : '⊖'}</span>
                    </button>
                </div>

                <div class="nbp-content">
                    <div class="nbp-info">
                        <div class="nbp-info-item">
                            <span class="nbp-info-label">${this.t('bookLabel')}</span>
                            <span class="nbp-info-value" id="nbp-book-title">-</span>
                        </div>
                        <div class="nbp-info-item">
                            <span class="nbp-info-label">${this.t('chapterLabel')}</span>
                            <span class="nbp-info-value" id="nbp-chapter-title">-</span>
                        </div>
                        <div class="nbp-info-item">
                            <span class="nbp-info-label">${this.t('savedLabel')}</span>
                            <span class="nbp-info-value" id="nbp-saved-time">-</span>
                        </div>
                        <div class="nbp-info-item">
                            <span class="nbp-info-label">${this.t('latestLabel')}</span>
                            <span class="nbp-info-value latest-chapter" id="nbp-latest-chapter">-</span>
                        </div>
                    </div>

                    <div class="nbp-controls">
                        <button class="nbp-btn primary" id="nbp-save">${this.t('saveBtn')}</button>
                        <button class="nbp-btn secondary" id="nbp-continue">${this.t('continueBtn')}</button>
                        <button class="nbp-btn update" id="nbp-update" title="Обновить список глав">${this.t('updateBtn')}</button>
                        <button class="nbp-btn" id="nbp-prev" disabled>${this.t('prevBtn')}</button>
                        <button class="nbp-btn" id="nbp-next" disabled>${this.t('nextBtn')}</button>
                        <button class="nbp-btn" id="nbp-library">📖</button>
                        <button class="nbp-btn" id="nbp-settings">⚙️</button>
                    </div>

                    <div class="nbp-extra-controls">
                        <button class="nbp-small-btn" id="nbp-export">${this.t('exportBtn')}</button>
                        <button class="nbp-small-btn" id="nbp-import">${this.t('importBtn')}</button>
                        <button class="nbp-small-btn" id="nbp-clear">${this.t('clearBtn')}</button>
                        <button class="nbp-small-btn" id="nbp-history">${this.t('historyBtn')}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.panel = panel;

            this.updateCurrentInfo();
            this.updateLatestChapterInfo();
        }

        updateCurrentInfo() {
            const bookTitle = DataExtractor.getBookTitle();
            const chapterTitle = DataExtractor.getChapterTitle();

            const bookTitleEl = document.getElementById('nbp-book-title');
            const chapterTitleEl = document.getElementById('nbp-chapter-title');

            if (bookTitleEl) bookTitleEl.textContent = bookTitle;
            if (chapterTitleEl) chapterTitleEl.textContent = chapterTitle;

            const nextLink = DataExtractor.getNextChapterLink();
            const prevLink = DataExtractor.getPrevChapterLink();

            const nextBtn = document.getElementById('nbp-next');
            const prevBtn = document.getElementById('nbp-prev');

            if (nextBtn) nextBtn.disabled = !nextLink;
            if (prevBtn) prevBtn.disabled = !prevLink;
        }

        async loadProgress() {
            const bookId = DataExtractor.getBookId();
            const progress = await this.storage.get(bookId, null);

            const savedTimeEl = document.getElementById('nbp-saved-time');
            if (savedTimeEl) {
                if (progress && progress.lastChapter) {
                    const savedTime = new Date(progress.lastChapter.timestamp);
                    const timeStr = savedTime.toLocaleString(this.currentLang === 'ru' ? 'ru-RU' : 'en-US');

                    const chapterNumber = progress.lastChapter.chapterNumber;
                    const chapterInfo = chapterNumber ? ` (гл. ${chapterNumber})` : '';

                    savedTimeEl.textContent = timeStr + chapterInfo;
                } else {
                    savedTimeEl.textContent = '-';
                }
            }
        }

        setupEventListeners() {
            const collapseBtn = document.getElementById('nbp-collapse');
            if (collapseBtn) {
                collapseBtn.addEventListener('click', () => {
                    this.toggleCollapse();
                });
            }

            const saveBtn = document.getElementById('nbp-save');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    this.saveProgress();
                });
            }

            const continueBtn = document.getElementById('nbp-continue');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    this.continueReading();
                });
            }

            // Новая кнопка обновления глав
            const updateBtn = document.getElementById('nbp-update');
            if (updateBtn) {
                updateBtn.addEventListener('click', async () => {
                    updateBtn.disabled = true;
                    updateBtn.innerHTML = '⏳';

                    try {
                        await DataExtractor.triggerChapterUpdate();
                        setTimeout(() => {
                            this.updateLatestChapterInfo();
                            this.showToast(this.t('updated'), 'success');
                        }, 1000);
                    } catch (e) {
                        this.showToast('Ошибка обновления', 'error');
                    } finally {
                        updateBtn.disabled = false;
                        updateBtn.innerHTML = this.t('updateBtn');
                    }
                });
            }

            const nextBtn = document.getElementById('nbp-next');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const link = DataExtractor.getNextChapterLink();
                    if (link) {
                        if (UI_CONFIG.autoSaveEnabled) {
                            this.saveProgress();
                        }
                        window.location.href = link;
                    }
                });
            }

            const prevBtn = document.getElementById('nbp-prev');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const link = DataExtractor.getPrevChapterLink();
                    if (link) {
                        if (UI_CONFIG.autoSaveEnabled) {
                            this.saveProgress();
                        }
                        window.location.href = link;
                    }
                });
            }

            const libraryBtn = document.getElementById('nbp-library');
            if (libraryBtn) {
                libraryBtn.addEventListener('click', () => {
                    this.showLibrary();
                });
            }

            const historyBtn = document.getElementById('nbp-history');
            if (historyBtn) {
                historyBtn.addEventListener('click', () => {
                    this.showHistory();
                });
            }

            const settingsBtn = document.getElementById('nbp-settings');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    this.showSettings();
                });
            }

            const exportBtn = document.getElementById('nbp-export');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportData();
                });
            }

            const importBtn = document.getElementById('nbp-import');
            if (importBtn) {
                importBtn.addEventListener('click', () => {
                    this.importData();
                });
            }

            const clearBtn = document.getElementById('nbp-clear');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.clearProgress();
                });
            }

            if (UI_CONFIG.autoSaveEnabled) {
                window.addEventListener('beforeunload', () => {
                    this.saveProgress(true);
                });
            }
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    this.saveProgress();
                }

                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    this.continueReading();
                }

                if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                    e.preventDefault();
                    this.toggleCollapse();
                }

                if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                    e.preventDefault();
                    this.showLibrary();
                }

                // Новое сочетание для обновления глав
                if (e.ctrlKey && e.shiftKey && e.key === 'U') {
                    e.preventDefault();
                    const updateBtn = document.getElementById('nbp-update');
                    if (updateBtn && !updateBtn.disabled) {
                        updateBtn.click();
                    }
                }
            });
        }

        async toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            await this.saveSettings();

            if (this.panel) {
                this.panel.classList.toggle('collapsed', this.isCollapsed);
                const collapseBtn = document.getElementById('nbp-collapse');
                if (collapseBtn) {
                    const span = collapseBtn.querySelector('span');
                    if (span) {
                        span.textContent = this.isCollapsed ? '⊕' : '⊖';
                    }
                }
            }
        }

        async saveProgress(silent = false) {
            const bookId = DataExtractor.getBookId();
            const bookTitle = DataExtractor.getBookTitle();
            const chapterTitle = DataExtractor.getChapterTitle();
            const chapterNumber = DataExtractor.getChapterNumber();
            const currentUrl = window.location.href;

            const progress = await this.storage.get(bookId, {
                bookTitle: bookTitle,
                chapters: [],
                history: []
            });

            progress.bookTitle = bookTitle;
            progress.bookId = bookId;

            const chapterData = {
                title: chapterTitle,
                url: currentUrl,
                timestamp: Date.now(),
                progress: this.getReadingProgress(),
                chapterNumber: chapterNumber
            };

            progress.lastChapter = chapterData;

            // Сохраняем информацию о последней доступной главе
            const latestChapter = DataExtractor.getLatestChapterNumber();
            if (latestChapter) {
                progress.latestChapter = latestChapter;
            }

            const historyItem = {
                ...chapterData,
                bookTitle: bookTitle
            };

            progress.history = progress.history || [];
            progress.history.unshift(historyItem);

            if (progress.history.length > UI_CONFIG.maxHistoryItems) {
                progress.history = progress.history.slice(0, UI_CONFIG.maxHistoryItems);
            }

            const success = await this.storage.set(bookId, progress);

            if (success && !silent) {
                this.showToast(this.t('saved'), 'success');
                await this.loadProgress();
            }
        }

        async continueReading() {
            const bookId = DataExtractor.getBookId();
            const progress = await this.storage.get(bookId, null);

            if (progress && progress.lastChapter && progress.lastChapter.url) {
                if (progress.lastChapter.url !== window.location.href) {
                    window.location.href = progress.lastChapter.url;
                } else {
                    this.showToast(this.t('loaded'), 'success');
                }
            } else {
                this.showToast(this.t('noProgress'), 'error');
            }
        }

        async clearProgress() {
            if (confirm(this.t('confirmClear'))) {
                const bookId = DataExtractor.getBookId();
                await this.storage.remove(bookId);
                await this.loadProgress();
                this.showToast(this.t('cleared'), 'success');
            }
        }

        async exportData() {
            try {
                const keys = await this.storage.getAllKeys();
                const data = {};

                for (const key of keys) {
                    if (key.startsWith(this.storage.prefix)) {
                        const cleanKey = key.replace(this.storage.prefix, '');
                        data[cleanKey] = await this.storage.get(cleanKey);
                    }
                }

                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json'
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `novelbin-progress-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showToast(this.t('exportSuccess'), 'success');
            } catch (error) {
                console.error('Export error:', error);
                this.showToast(this.t('importError'), 'error');
            }
        }

        importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = async (e) => {
                try {
                    const file = e.target.files[0];
                    if (!file) return;

                    const text = await file.text();
                    const data = JSON.parse(text);

                    for (const [key, value] of Object.entries(data)) {
                        await this.storage.set(key, value);
                    }

                    await this.loadProgress();
                    this.showToast(this.t('importSuccess'), 'success');
                } catch (error) {
                    console.error('Import error:', error);
                    this.showToast(this.t('importError'), 'error');
                }
            };

            input.click();
        }

        async showLibrary() {
            const novels = await this.storage.getAllNovels();
            const content = this.createLibraryContent(novels);
            this.showModal(this.t('libraryTitle'), content);
        }

        showHistory() {
            this.showModal('История чтения', this.createHistoryContent());
        }

        showSettings() {
            this.showModal('Настройки', this.createSettingsContent());
        }

        createLibraryContent(novels) {
            const content = document.createElement('div');

            if (novels.length === 0) {
                content.innerHTML = `
                    <div class="nbp-empty-library">
                        ${this.t('emptyLibrary')}
                    </div>
                `;
                return content;
            }

            content.innerHTML = `
                <input type="text" class="nbp-library-search" placeholder="${this.t('searchPlaceholder')}" id="library-search">
                <div class="nbp-library-stats">
                    ${this.t('totalNovels')} <strong>${novels.length}</strong>
                </div>
                <div class="nbp-novel-list" id="novel-list">
                    ${novels.map(novel => this.createNovelItem(novel)).join('')}
                </div>
            `;

            const searchInput = content.querySelector('#library-search');
            const novelList = content.querySelector('#novel-list');

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filteredNovels = novels.filter(novel =>
                    novel.bookTitle.toLowerCase().includes(query)
                );

                novelList.innerHTML = filteredNovels.map(novel =>
                    this.createNovelItem(novel)
                ).join('');

                this.attachNovelItemEvents(novelList);
            });

            this.attachNovelItemEvents(content);

            return content;
        }

        createNovelItem(novel) {
            const lastRead = novel.lastChapter ? new Date(novel.lastChapter.timestamp) : null;
            const timeStr = lastRead ? lastRead.toLocaleString(this.currentLang === 'ru' ? 'ru-RU' : 'en-US') : '-';

            // Создаем строку с информацией о главах
            let chapterInfo = '';
            if (novel.lastChapter && novel.lastChapter.chapterNumber) {
                const currentChapter = novel.lastChapter.chapterNumber;
                if (novel.latestChapter && novel.latestChapter > currentChapter) {
                    // Показываем формат "Глава X из Глава Y"
                    chapterInfo = `Глава ${currentChapter} из Глава ${novel.latestChapter}`;
                } else if (novel.latestChapter) {
                    // Если читатель на последней главе
                    chapterInfo = `Глава ${currentChapter} из Глава ${novel.latestChapter}`;
                } else {
                    // Если нет информации о последней главе
                    chapterInfo = `Глава ${currentChapter}`;
                }
            } else if (novel.lastChapter) {
                chapterInfo = novel.lastChapter.title;
            } else {
                chapterInfo = 'Нет сохраненной главы';
            }

            const chapterUrl = novel.lastChapter ? novel.lastChapter.url : '';

            return `
                <div class="nbp-novel-item" data-novel-id="${novel.id}">
                    <div class="nbp-novel-title">${novel.bookTitle}</div>
                    <div class="nbp-novel-info">
                        <div><strong>${this.t('lastRead')}</strong> ${timeStr}</div>
                        <div><strong>${this.t('chapterLabel')}</strong> ${chapterInfo}</div>
                    </div>
                    <div class="nbp-novel-actions">
                        ${novel.lastChapter && chapterUrl ?
                            `<a href="${chapterUrl}" class="nbp-novel-btn primary nbp-chapter-link"
                               target="_blank" rel="noopener noreferrer"
                               data-novel-id="${novel.id}">
                                ${this.t('goToChapter')}
                             </a>` :
                            `<button class="nbp-novel-btn primary" disabled>
                                ${this.t('goToChapter')}
                             </button>`
                        }
                        <button class="nbp-novel-btn danger" data-action="delete" data-novel-id="${novel.id}">
                            ${this.t('deleteNovel')}
                        </button>
                    </div>
                </div>
            `;
        }

        attachNovelItemEvents(container) {
            const buttons = container.querySelectorAll('[data-action]');
            const chapterLinks = container.querySelectorAll('.nbp-chapter-link');

            // Обработчики для кнопок удаления
            buttons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const action = e.target.dataset.action;
                    const novelId = e.target.dataset.novelId;

                    if (action === 'delete') {
                        await this.deleteNovel(novelId);
                        this.showLibrary(); // Обновляем библиотеку
                    }
                });
            });

            // Обработчики для ссылок на главы
            chapterLinks.forEach(link => {
                // Обработчик клика левой кнопкой мыши
                link.addEventListener('click', (e) => {
                    // Закрываем модальное окно при переходе
                    const modal = document.querySelector('.nbp-modal');
                    if (modal) {
                        document.body.removeChild(modal);
                    }
                });

                // Обработчик для средней кнопки мыши (колесика)
                link.addEventListener('mousedown', (e) => {
                    if (e.button === 1) { // Средняя кнопка мыши
                        e.preventDefault();

                        // Открываем в новой вкладке
                        const url = link.href;
                        if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                        }

                        // Закрываем модальное окно
                        const modal = document.querySelector('.nbp-modal');
                        if (modal) {
                            document.body.removeChild(modal);
                        }
                    }
                });

                // Обработчик для контекстного меню (правая кнопка мыши)
                link.addEventListener('contextmenu', (e) => {
                    // Позволяем стандартное контекстное меню с опциями "Открыть в новой вкладке" и т.д.
                });
            });
        }

        async deleteNovel(novelId) {
            if (confirm(this.t('confirmDeleteNovel'))) {
                try {
                    await this.storage.remove(novelId);
                    this.showToast('Новелла удалена из библиотеки', 'success');
                } catch (error) {
                    console.error('Error deleting novel:', error);
                    this.showToast('Ошибка при удалении новеллы', 'error');
                }
            }
        }

        createHistoryContent() {
            const content = document.createElement('div');
            content.innerHTML = '<p>История чтения (в разработке)</p>';
            return content;
        }

        createSettingsContent() {
            const content = document.createElement('div');
            content.innerHTML = `
                <div class="nbp-setting">
                    <span>${this.t('autoSaveLabel')}</span>
                    <label class="nbp-switch">
                        <input type="checkbox" id="setting-autosave" ${UI_CONFIG.autoSaveEnabled ? 'checked' : ''}>
                        <span class="nbp-switch-slider"></span>
                    </label>
                </div>
                <div class="nbp-setting">
                    <span>${this.t('themeLabel')}</span>
                    <label class="nbp-switch">
                        <input type="checkbox" id="setting-theme" ${this.isDarkMode ? 'checked' : ''}>
                        <span class="nbp-switch-slider"></span>
                    </label>
                </div>
                <div class="nbp-setting">
                    <span>${this.t('autoUpdateLabel')}</span>
                    <label class="nbp-switch">
                        <input type="checkbox" id="setting-autoupdate" ${UI_CONFIG.autoUpdateChapters ? 'checked' : ''}>
                        <span class="nbp-switch-slider"></span>
                    </label>
                </div>
                <div class="nbp-setting">
                    <span>${this.t('langLabel')}</span>
                    <select id="setting-lang" style="padding: 5px; border-radius: 4px;">
                        <option value="ru" ${this.currentLang === 'ru' ? 'selected' : ''}>Русский</option>
                        <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
            `;

            // Добавляем обработчики событий для настроек
            setTimeout(() => {
                const autosaveCheckbox = content.querySelector('#setting-autosave');
                const themeCheckbox = content.querySelector('#setting-theme');
                const autoupdateCheckbox = content.querySelector('#setting-autoupdate');
                const langSelect = content.querySelector('#setting-lang');

                if (autosaveCheckbox) {
                    autosaveCheckbox.addEventListener('change', async (e) => {
                        UI_CONFIG.autoSaveEnabled = e.target.checked;
                        await this.saveSettings();
                    });
                }

                if (themeCheckbox) {
                    themeCheckbox.addEventListener('change', async (e) => {
                        this.isDarkMode = e.target.checked;
                        if (this.panel) {
                            this.panel.className = this.isDarkMode ? 'dark' : '';
                            if (this.isCollapsed) {
                                this.panel.classList.add('collapsed');
                            }
                        }
                        await this.saveSettings();
                    });
                }

                if (autoupdateCheckbox) {
                    autoupdateCheckbox.addEventListener('change', async (e) => {
                        UI_CONFIG.autoUpdateChapters = e.target.checked;
                        await this.saveSettings();
                    });
                }

                if (langSelect) {
                    langSelect.addEventListener('change', async (e) => {
                        this.currentLang = e.target.value;
                        await this.saveSettings();
                        // Перезагружаем интерфейс с новым языком
                        this.recreatePanel();
                    });
                }
            }, 100);

            return content;
        }

        async recreatePanel() {
            if (this.panel && document.body.contains(this.panel)) {
                document.body.removeChild(this.panel);
            }
            this.createPanel();
            await this.loadProgress();
            this.setupEventListeners();
            this.updateLatestChapterInfo();
        }

        showModal(title, content) {
            const existingModals = document.querySelectorAll('.nbp-modal');
            existingModals.forEach(modal => document.body.removeChild(modal));

            const modal = document.createElement('div');
            modal.className = `nbp-modal ${this.isDarkMode ? 'dark' : ''}`;

            const modalContent = document.createElement('div');
            modalContent.className = 'nbp-modal-content';

            modalContent.innerHTML = `
                <div class="nbp-modal-header">
                    ${title}
                    <span class="nbp-modal-close">&times;</span>
                </div>
            `;

            modalContent.appendChild(content);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.nbp-modal-close');
            const closeModal = () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            };

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `nbp-toast ${type}`;
            toast.textContent = message;

            document.body.appendChild(toast);

            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, UI_CONFIG.toastDuration);
        }

        getReadingProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
        }
    }

    // ==================== ОСНОВНАЯ ЛОГИКА ====================

    class NovelBinTracker {
        constructor() {
            this.storage = new StorageManager();
            this.ui = new UIManager(this.storage);
            this.isInitialized = false;
        }

        async init() {
            if (this.isInitialized) return;

            try {
                if (document.readyState === 'loading') {
                    await new Promise(resolve => {
                        document.addEventListener('DOMContentLoaded', resolve);
                    });
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                await this.ui.init();
                this.isInitialized = true;

                console.log('NovelBin Progress Tracker Pro initialized successfully');

                // Автоматически обновляем информацию о главах через некоторое время
                setTimeout(() => {
                    if (UI_CONFIG.autoUpdateChapters) {
                        this.ui.updateLatestChapterInfo();
                    }
                }, 3000);

            } catch (error) {
                console.error('Failed to initialize NovelBin Tracker:', error);
            }
        }

        forceInit() {
            this.isInitialized = false;
            this.init();
        }

        // Метод для ручного обновления информации о главах
        async updateChapters() {
            if (this.ui) {
                await DataExtractor.triggerChapterUpdate();
                setTimeout(() => {
                    this.ui.updateLatestChapterInfo();
                }, 1000);
            }
        }
    }

    // ==================== ЗАПУСК ====================

    window.NovelBinTracker = new NovelBinTracker();

    if (document.readyState === 'complete') {
        setTimeout(() => window.NovelBinTracker.init(), 100);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => window.NovelBinTracker.init(), 500);
        });
    }

    setTimeout(() => {
        if (!window.NovelBinTracker.isInitialized) {
            console.log('Attempting delayed initialization...');
            window.NovelBinTracker.init();
        }
    }, 3000);

    // Дополнительная проверка для автоматического обновления глав
    if (UI_CONFIG.autoUpdateChapters) {
        setTimeout(() => {
            if (window.NovelBinTracker.ui) {
                window.NovelBinTracker.updateChapters();
            }
        }, 5000);
    }

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Показать/Скрыть панель', () => {
            if (window.NovelBinTracker.ui && window.NovelBinTracker.ui.panel) {
                window.NovelBinTracker.ui.toggleCollapse();
            }
        });

        GM_registerMenuCommand('Открыть библиотеку', () => {
            if (window.NovelBinTracker.ui) {
                window.NovelBinTracker.ui.showLibrary();
            }
        });

        GM_registerMenuCommand('Обновить главы', () => {
            if (window.NovelBinTracker.ui) {
                window.NovelBinTracker.updateChapters();
            }
        });

        GM_registerMenuCommand('Пересоздать панель', () => {
            window.NovelBinTracker.forceInit();
        });
    }

})();