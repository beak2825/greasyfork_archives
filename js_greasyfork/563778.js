// ==UserScript==
// @name         11-15 сервер
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  для техов 11-15
// @author       By novikov
// @match        https://forum.blackrussia.online/forums/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563778/11-15%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/563778/11-15%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('11-15 серверы: Скрипт запущен');

    // Список целевых разделов с разными вариантами написания
    const TARGET_SECTIONS = [
        // Основные разделы серверов 11-15
        'Сервер-№11-indigo',
        'Сервер-№12-white', 
        'Сервер-№13-magenta',
        'Сервер-№14-crimson',
        'Сервер-№15-gold',
        'Сервер-№11',
        'Сервер-№12',
        'Сервер-№13',
        'Сервер-№14',
        'Сервер-№15',
        // Технические разделы
        'Технический-раздел-indigo',
        'Технический-раздел-white',
        'Технический-раздел-magenta',
        'Технический-раздел-crimson',
        'Технический-раздел-gold',
        'Технический-раздел-11',
        'Технический-раздел-12',
        'Технический-раздел-13',
        'Технический-раздел-14',
        'Технический-раздел-15'
    ];

    // Проверяем, находимся ли мы в целевом разделе
    function isTargetSection() {
        const currentUrl = window.location.href.toLowerCase();
        const currentPath = window.location.pathname.toLowerCase();
        
        console.log('Проверяем URL:', currentUrl);
        console.log('Проверяем путь:', currentPath);
        
        // Проверяем по основным ключевым словам
        const keywords = ['сервер-№11', 'сервер-№12', 'сервер-№13', 'сервер-№14', 'сервер-№15',
                         'технический-раздел-11', 'технический-раздел-12', 'технический-раздел-13',
                         'технический-раздел-14', 'технический-раздел-15',
                         'indigo', 'white', 'magenta', 'crimson', 'gold'];
        
        for (const keyword of keywords) {
            if (currentUrl.includes(keyword) || currentPath.includes(keyword)) {
                console.log(`Найден ключевой раздел: ${keyword}`);
                return true;
            }
        }
        
        // Дополнительная проверка: ищем номер сервера в URL
        const serverMatch = currentUrl.match(/сервер-№(\d+)|раздел-(\d+)/i);
        if (serverMatch) {
            const serverNum = parseInt(serverMatch[1] || serverMatch[2]);
            if (serverNum >= 11 && serverNum <= 15) {
                console.log(`Определен сервер ${serverNum} (11-15 диапазон)`);
                return true;
            }
        }
        
        // Проверяем по названию цвета
        const colorMatch = currentUrl.match(/(indigo|white|magenta|crimson|gold)/i);
        if (colorMatch && (currentUrl.includes('сервер') || currentUrl.includes('раздел'))) {
            console.log(`Найден сервер по цвету: ${colorMatch[0]}`);
            return true;
        }
        
        console.log('Не целевой раздел');
        return false;
    }

    // Настройки по умолчанию - лимит 24 часа
    const DEFAULT_CONFIG = {
        colors: {
            overdue: '#cc0000',     // Просрочено (красный)
            critical: '#cc5500',    // Критично (оранжевый)
            warning: '#cc8800',     // Предупреждение (желтый)
            normal: '#00aa00',      // Нормально (зеленый)
            closed: '#666666'       // Закрыто (серый)
        },
        times: {
            limitNormal: 24,        // Общий лимит 24 часа
            limitWarning: 6,        // Предупреждение за 6 часов до лимита
            limitCritical: 2        // Критично за 2 часа до лимита
        }
    };

    let CONFIG = { ...DEFAULT_CONFIG };

    // Префиксы, которые СКРЫВАЮТ таймер (не показываем таймер вообще)
    const HIDDEN_PREFIXES = [
        'команде проекта',
        'закрыто',
        'важно'
    ];

    // Префиксы, которые считаются ЗАКРЫТЫМИ (скрываем таймер)
    const CLOSED_PREFIXES = [
        'решено',
        'одобрено',
        'рассмотрено',
        'отказано',
        'реализовано',
        'проверено контролем качества'
    ];

    // Кэш для уже обработанных тем
    const processedThemes = new Set();
    let processTimeout = null;
    let isProcessing = false;
    let isActiveSection = false;

    function initialize() {
        console.log('11-15 серверы: Инициализация');
        
        // Даем странице немного времени для загрузки
        setTimeout(() => {
            // Проверяем, находимся ли мы в целевом разделе
            isActiveSection = isTargetSection();
            
            if (!isActiveSection) {
                console.log('Не целевой раздел, скрипт не активирован');
                return;
            }
            
            console.log('Целевой раздел обнаружен, активируем скрипт');
            loadConfig();

            startTracker();
            
            // Запускаем дополнительную проверку через секунду
            setTimeout(startTracker, 1000);
            
        }, 500);
    }

    function loadConfig() {
        try {
            const saved = localStorage.getItem('br_servers_config');
            if (saved) {
                CONFIG = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.log('Ошибка загрузки конфига:', e);
        }
    }

    function startTracker() {
        if (!isActiveSection) {
            // Перепроверяем, может изменился URL
            isActiveSection = isTargetSection();
            if (!isActiveSection) return;
        }
        
        console.log('11-15 серверы: Запуск трекера');

        if (!document.getElementById('br-servers-styles')) {
            addStyles();
        }

        // Запускаем обработку тем
        setTimeout(() => {
            processThemes();
        }, 300);

        setupObservers();
    }

    function setupObservers() {
        // Наблюдатель за изменениями DOM
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
            }
            if (shouldProcess) {
                debouncedProcessThemes();
            }
        });

        // Ищем подходящий контейнер для наблюдения
        const containers = [
            '.structItemContainer',
            '.block-body',
            '.p-body-main',
            '.p-pageContent',
            'main',
            'body'
        ];
        
        let targetNode = document.body;
        for (const selector of containers) {
            const node = document.querySelector(selector);
            if (node) {
                targetNode = node;
                break;
            }
        }
        
        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Обработка скролла
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (isActiveSection) {
                    processThemes();
                }
            }, 200);
        }, { passive: true });

        // Отслеживание изменения URL
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                isActiveSection = isTargetSection();
                processedThemes.clear();
                
                if (isActiveSection) {
                    console.log('URL изменился, перезапускаем обработку');
                    setTimeout(startTracker, 500);
                }
            }
        }, 300);
    }

    function debouncedProcessThemes() {
        if (!isActiveSection) return;
        
        if (processTimeout) clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            if (!isProcessing) {
                processThemes();
            }
        }, 150);
    }

    function addStyles() {
        const styleId = 'br-servers-styles';

        const css = `
            /* Стили для статусов тем */
            .structItem.br-theme-overdue {
                position: relative;
                box-shadow: inset 4px 0 0 ${CONFIG.colors.overdue} !important;
                background: linear-gradient(90deg, rgba(204, 0, 0, 0.05) 0%, transparent 100%) !important;
            }

            .structItem.br-theme-critical {
                position: relative;
                box-shadow: inset 4px 0 0 ${CONFIG.colors.critical} !important;
                background: linear-gradient(90deg, rgba(204, 85, 0, 0.05) 0%, transparent 100%) !important;
            }

            .structItem.br-theme-warning {
                position: relative;
                box-shadow: inset 4px 0 0 ${CONFIG.colors.warning} !important;
                background: linear-gradient(90deg, rgba(204, 136, 0, 0.05) 0%, transparent 100%) !important;
            }

            .structItem.br-theme-normal {
                position: relative;
                box-shadow: inset 4px 0 0 ${CONFIG.colors.normal} !important;
                background: linear-gradient(90deg, rgba(0, 170, 0, 0.05) 0%, transparent 100%) !important;
            }

            .structItem.br-theme-closed {
                opacity: 0.7 !important;
            }

            /* Стили для таймеров */
            .br-timer {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 2px 6px !important;
                margin-left: 8px !important;
                border-radius: 4px !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                color: white !important;
                line-height: 1.2 !important;
                height: 18px !important;
                vertical-align: middle !important;
                white-space: nowrap !important;
                user-select: none !important;
                cursor: help !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
            }

            .br-timer:hover {
                transform: scale(1.05) !important;
            }

            .br-timer-overdue {
                background-color: ${CONFIG.colors.overdue} !important;
                animation: br-timer-pulse 2s ease-in-out infinite !important;
            }

            .br-timer-critical {
                background-color: ${CONFIG.colors.critical} !important;
                animation: br-critical-pulse 3s ease-in-out infinite !important;
            }

            .br-timer-warning {
                background-color: ${CONFIG.colors.warning} !important;
            }

            .br-timer-normal {
                background-color: ${CONFIG.colors.normal} !important;
            }

            @keyframes br-timer-pulse {
                0%, 100% {
                    opacity: 1;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 0 0 0 rgba(204, 0, 0, 0.7) !important;
                }
                50% {
                    opacity: 0.9;
                }
                70% {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 0 0 6px rgba(204, 0, 0, 0) !important;
                }
            }

            @keyframes br-critical-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.85; }
            }

            /* Адаптация для мобильных */
            @media (max-width: 768px) {
                .br-timer {
                    font-size: 10px !important;
                    padding: 1px 4px !important;
                    margin-left: 6px !important;
                    height: 16px !important;
                }

                .structItem.br-theme-overdue,
                .structItem.br-theme-critical,
                .structItem.br-theme-warning,
                .structItem.br-theme-normal,
                .structItem.br-theme-closed {
                    box-shadow: inset 3px 0 0 !important;
                }
            }

            @media (max-width: 480px) {
                .br-timer {
                    font-size: 9px !important;
                    padding: 0 3px !important;
                    margin-left: 4px !important;
                    height: 14px !important;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function processThemes() {
        if (!isActiveSection || isProcessing) return;

        isProcessing = true;
        console.log('Начинаем обработку тем...');

        try {
            // Ищем темы разными способами
            let themes = [];
            
            // Способ 1: стандартные селекторы XenForo
            themes = document.querySelectorAll('.structItem--thread, .structItem-container, .discussionListItem');
            
            // Если не нашли, пробуем другие селекторы
            if (themes.length === 0) {
                themes = document.querySelectorAll('.block-row, article[data-content="thread"], li.js-threadListItem');
            }
            
            // Если все еще не нашли, ищем по структуре
            if (themes.length === 0) {
                const container = document.querySelector('.structItemContainer, .thread-list, .discussionList');
                if (container) {
                    themes = container.querySelectorAll('> div, > li, > article');
                }
            }
            
            console.log(`Найдено ${themes.length} потенциальных тем`);
            
            if (themes.length > 0) {
                processThemeList(Array.from(themes));
            } else {
                console.log('Темы не найдены, ждем...');
                // Пробуем еще раз через 500мс
                setTimeout(() => {
                    isProcessing = false;
                    processThemes();
                }, 500);
            }

        } catch (error) {
            console.error('Ошибка при обработке тем:', error);
            isProcessing = false;
        }
    }

    function processThemeList(themes) {
        if (!isActiveSection) return;
        
        console.log(`Обрабатываем ${themes.length} тем`);

        // Фильтруем только видимые темы
        const visibleThemes = themes.filter(theme => {
            // Проверяем, что это действительно тема (есть заголовок)
            const hasTitle = theme.querySelector('.structItem-title, .thread-title, h3, .title') !== null;
            const rect = theme.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;
            
            return hasTitle && isVisible;
        });

        console.log(`Видимых тем для обработки: ${visibleThemes.length}`);

        visibleThemes.forEach((theme, index) => {
            setTimeout(() => {
                try {
                    processSingleTheme(theme);
                } catch (e) {
                    console.error('Ошибка обработки темы:', e, theme);
                }
            }, index * 10); // Маленькая задержка между темами
        });

        isProcessing = false;
        
        // Планируем следующую проверку через 2 секунды
        if (visibleThemes.length > 0) {
            setTimeout(debouncedProcessThemes, 2000);
        }
    }

    function processSingleTheme(theme) {
        // Создаем уникальный ID для темы
        const themeId = theme.id || 
                       theme.dataset.content || 
                       (theme.querySelector('a') ? theme.querySelector('a').href : '') ||
                       `${theme.className}-${theme.offsetTop}`;
        
        if (!themeId || processedThemes.has(themeId)) {
            return;
        }

        processedThemes.add(themeId);

        // Очищаем предыдущие классы и таймеры
        const ourClasses = ['br-theme-overdue', 'br-theme-critical', 'br-theme-warning',
                           'br-theme-normal', 'br-theme-closed'];
        ourClasses.forEach(cls => theme.classList.remove(cls));

        const oldTimers = theme.querySelectorAll('.br-timer');
        oldTimers.forEach(timer => {
            if (timer.parentNode) {
                timer.parentNode.removeChild(timer);
            }
        });

        const titleElement = findTitleElement(theme);
        if (!titleElement) {
            console.log('Не найден заголовок темы:', theme);
            return;
        }

        const titleText = titleElement.textContent.toLowerCase().trim();
        console.log('Заголовок темы:', titleText.substring(0, 50));

        // Проверяем префиксы
        const prefixInfo = detectPrefix(titleText);

        // 1. Если тема в скрытых префиксах (Команде проекта, Закрыто) - полностью пропускаем
        if (prefixInfo.hidden) {
            console.log('Тема скрыта по префиксу');
            return;
        }

        // 2. Если тема закрыта (любой из закрывающих префиксов) - скрываем таймер
        if (prefixInfo.closed) {
            console.log('Тема закрыта по префиксу');
            return;
        }

        // 3. Проверяем закрыта ли тема по другим признакам (в квадратных скобках)
        if (isThemeClosed(titleText)) {
            console.log('Тема закрыта в квадратных скобках');
            return;
        }

        // 4. Находим дату создания темы
        const createDate = findCreateDate(theme);
        if (!createDate) {
            console.log('Не удалось найти дату создания для темы');
            return;
        }

        console.log('Дата создания темы:', createDate);

        // 5. Рассчитываем статус
        const timeInfo = calculateTime(createDate);

        console.log(`Статус темы: ${timeInfo.status}, прошло: ${timeInfo.hoursPassed.toFixed(1)}ч, осталось: ${timeInfo.hoursLeft.toFixed(1)}ч`);

        // 6. Добавляем стиль и таймер
        theme.classList.add(`br-theme-${timeInfo.status}`);
        addTimerToTitle(titleElement, timeInfo, timeInfo.status);
    }

    function detectPrefix(titleText) {
        // Удаляем квадратные скобки для более точного поиска
        const cleanText = titleText.replace(/[\[\]]/g, '');

        // Проверяем скрытые префиксы (Команде проекта, Закрыто)
        for (const prefix of HIDDEN_PREFIXES) {
            if (cleanText.includes(prefix.toLowerCase())) {
                return { hidden: true, closed: false };
            }
        }

        // Проверяем закрытые префиксы (скрываем таймер)
        for (const prefix of CLOSED_PREFIXES) {
            if (cleanText.includes(prefix.toLowerCase())) {
                return { hidden: false, closed: true };
            }
        }

        // Все остальные темы отслеживаем
        return { hidden: false, closed: false };
    }

    function findTitleElement(theme) {
        const selectors = [
            '.structItem-title',
            '.structItem-title a',
            '.thread-title',
            'a[data-preview-url]',
            'a[data-xf-init="preview-tooltip"]',
            'h3 a',
            '.title a',
            '.block-title a',
            'a[href*="/threads/"]'
        ];

        for (const selector of selectors) {
            const element = theme.querySelector(selector);
            if (element && element.textContent && element.textContent.trim().length > 0) {
                return element;
            }
        }

        // Если не нашли по селекторам, ищем любую ссылку с текстом
        const possibleLinks = theme.querySelectorAll('a');
        for (const link of possibleLinks) {
            if (link.textContent && 
                link.textContent.trim().length > 3 &&
                link.href && 
                link.href.includes('/threads/')) {
                return link;
            }
        }

        return null;
    }

    function isThemeClosed(titleText) {
        // Проверяем только квадратные скобки для закрытия
        if (titleText.includes('[закрыто]') ||
            titleText.includes('[closed]')) {
            return true;
        }

        return false;
    }

    function findCreateDate(theme) {
        // Пробуем найти элемент времени
        const timeElement = theme.querySelector('time');
        if (timeElement) {
            const datetime = timeElement.getAttribute('datetime');
            if (datetime) {
                return new Date(datetime);
            }

            const dataTime = timeElement.getAttribute('data-time');
            if (dataTime) {
                return new Date(parseInt(dataTime) * 1000);
            }
        }

        // Ищем дату в тексте
        const dateText = findDateText(theme);
        if (dateText) {
            const parsedDate = parseDateText(dateText);
            if (parsedDate) return parsedDate;
        }

        // Ищем дату в различных элементах
        const dateElements = theme.querySelectorAll('.structItem-minor, .u-dt, .date, .DateTime');
        for (const el of dateElements) {
            const text = el.textContent.trim();
            const date = parseDateText(text);
            if (date) return date;
        }

        // Ищем в дочерних элементах
        const allElements = theme.querySelectorAll('*');
        for (const el of allElements) {
            const text = el.textContent.trim();
            if (text.match(/\d{1,2}\.\d{1,2}\.\d{4}/) || 
                text.match(/сегодня/i) || 
                text.match(/вчера/i)) {
                const date = parseDateText(text);
                if (date) return date;
            }
        }

        return null;
    }

    function findDateText(theme) {
        const possibleElements = theme.querySelectorAll('.structItem-latestDate, .lastPostDate, .startDate, .u-concealed');

        for (const el of possibleElements) {
            const text = el.textContent.trim();
            if (!text) continue;

            if (text.match(/сегодня в \d{1,2}:\d{2}/i) ||
                text.match(/вчера в \d{1,2}:\d{2}/i) ||
                text.match(/\d{1,2}\.\d{1,2}\.\d{4}/) ||
                text.match(/\d{1,2}:\d{2}/)) {
                return text;
            }
        }

        return null;
    }

    function parseDateText(text) {
        if (!text) return null;

        const now = new Date();
        const lowerText = text.toLowerCase();

        try {
            if (lowerText.includes('сегодня')) {
                const match = text.match(/(\d{1,2}):(\d{2})/);
                if (match) {
                    const date = new Date();
                    date.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
                    return date;
                }
            }

            if (lowerText.includes('вчера')) {
                const match = text.match(/(\d{1,2}):(\d{2})/);
                if (match) {
                    const date = new Date();
                    date.setDate(date.getDate() - 1);
                    date.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
                    return date;
                }
            }

            const dateMatch = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
            if (dateMatch) {
                const [, day, month, year] = dateMatch;
                const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
                let hours = 12, minutes = 0;

                if (timeMatch) {
                    hours = parseInt(timeMatch[1]);
                    minutes = parseInt(timeMatch[2]);
                }

                return new Date(year, month - 1, day, hours, minutes, 0, 0);
            }

            const timeMatch = text.match(/^(\d{1,2}):(\d{2})$/);
            if (timeMatch) {
                const date = new Date();
                date.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
                return date;
            }
        } catch (e) {
            console.log('Ошибка парсинга даты:', text, e);
        }

        return null;
    }

    function calculateTime(createDate) {
        const now = new Date();
        const hoursPassed = (now - createDate) / (1000 * 60 * 60);

        // Для всех тем лимит 24 часа
        const limit = CONFIG.times.limitNormal;
        const hoursLeft = Math.max(0, limit - hoursPassed);

        let status = 'normal';

        if (hoursPassed > limit) {
            status = 'overdue';
        } else if (hoursLeft <= CONFIG.times.limitCritical) {
            status = 'critical';
        } else if (hoursLeft <= CONFIG.times.limitWarning) {
            status = 'warning';
        }

        return {
            hoursPassed: hoursPassed,
            hoursLeft: hoursLeft,
            limit: limit,
            status: status
        };
    }

    function addTimerToTitle(titleElement, timeInfo, themeClass) {
        // Удаляем старый таймер, если есть
        const existingTimer = titleElement.parentNode.querySelector('.br-timer');
        if (existingTimer && existingTimer.parentNode) {
            existingTimer.parentNode.removeChild(existingTimer);
        }

        const timer = document.createElement('span');
        timer.className = `br-timer br-timer-${themeClass}`;

        // Форматируем текст таймера
        let timerText = '';
        let tooltip = '';

        if (timeInfo.status === 'overdue') {
            const overdueHours = Math.floor(timeInfo.hoursPassed - timeInfo.limit);
            timerText = `+${overdueHours}ч`;
        } else {
            const hours = Math.floor(timeInfo.hoursLeft);
            const minutes = Math.floor((timeInfo.hoursLeft - hours) * 60);

            if (hours > 0) {
                timerText = `${hours}ч`;
            } else {
                timerText = `${minutes}м`;
            }
        }

        const totalHours = Math.floor(timeInfo.hoursPassed);
        const totalMinutes = Math.floor((timeInfo.hoursPassed - totalHours) * 60);
        tooltip = `Прошло: ${totalHours}ч ${totalMinutes}м\nДо лимита (${timeInfo.limit}ч): ${timeInfo.hoursLeft.toFixed(1)}ч\nСтатус: ${getStatusText(timeInfo.status)}`;

        timer.textContent = timerText;
        timer.title = tooltip;

        // Вставляем таймер после заголовка
        if (titleElement.parentNode) {
            titleElement.parentNode.insertBefore(timer, titleElement.nextSibling);
        } else {
            titleElement.insertAdjacentElement('afterend', timer);
        }
        
        console.log(`Добавлен таймер: ${timerText}, статус: ${themeClass}`);
    }

    function getStatusText(status) {
        const statusMap = {
            'overdue': 'ПРОСРОЧЕНО',
            'critical': 'КРИТИЧЕСКИ',
            'warning': 'ВНИМАНИЕ',
            'normal': 'НОРМА'
        };
        return statusMap[status] || status;
    }

    // Запуск скрипта
    initialize();

    // Экспортируем функции для отладки
    window.brDebug = {
        forceProcess: () => {
            isActiveSection = true;
            processedThemes.clear();
            processThemes();
        },
        checkSection: () => {
            return isTargetSection();
        },
        getConfig: () => CONFIG,
        getProcessedCount: () => processedThemes.size
    };

})();