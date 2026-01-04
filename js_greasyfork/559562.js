// ==UserScript==
// @name         Faceit Lobby Anti Afk
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Автоматически нажимает на кнопку "Keep open" в модальном окне FACEIT
// @author       Gariloz
// @match        https://*.faceit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559562/Faceit%20Lobby%20Anti%20Afk.user.js
// @updateURL https://update.greasyfork.org/scripts/559562/Faceit%20Lobby%20Anti%20Afk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === КОНФИГУРАЦИЯ ===
    const CONFIG = {
        CHECK_INTERVAL: 5000,              // Интервал проверки (миллисекунды)
        TARGET_TEXTS: [                     // Тексты кнопок для поиска
            'keep open',
            'keep party open',
            'оставить открытым',
            'оставить лобби открытым'
        ],
        // Настройки кнопки
        BUTTON_TOP: '100px',                      // Отступ кнопки сверху (px)
        BUTTON_RIGHT: '70px',                    // Отступ кнопки справа (px)
        BUTTON_Z_INDEX: '2147483647',            // Z-index кнопки
        BUTTON_PADDING: '10px 20px',             // Отступы кнопки
        BUTTON_BORDER_RADIUS: '5px',             // Скругление кнопки (px)
        BUTTON_BOX_SHADOW: '0 2px 5px rgba(0, 0, 0, 0.3)', // Тень кнопки
        BUTTON_FONT_SIZE: '14px',               // Размер шрифта кнопки
        BUTTON_GAP: '6px',                      // Отступ между элементами кнопки

        // Настройки иконки глаза
        EYE_ICON_SIZE: '12px',                  // Размер иконки глаза (px)
        EYE_ICON_PADDING: '2px 4px',            // Отступы иконки глаза
        EYE_ICON_BG_COLOR_ACTIVE: 'rgba(244, 67, 54, 0.8)', // Цвет фона когда скрипт активен (красный)
        EYE_ICON_BG_COLOR_INACTIVE: 'rgba(76, 175, 80, 0.8)', // Цвет фона когда скрипт неактивен (зеленый)
        EYE_ICON_BORDER: '1px solid rgba(255, 255, 255, 0.5)', // Обводка иконки глаза
        EYE_ICON_BORDER_RADIUS: '3px',          // Скругление иконки глаза
        EYE_ICON_BG_HOVER: 'rgba(0, 0, 0, 0.5)', // Цвет фона при наведении
        EYE_ICON_BORDER_HOVER: 'rgba(255, 255, 255, 0.8)', // Цвет обводки при наведении

        // Настройки маленькой иконки (когда кнопка скрыта)
        HIDE_BUTTON_SIZE: '30px',                // Размер маленькой иконки (px)
        HIDE_BUTTON_FONT_SIZE: '18px',          // Размер шрифта маленькой иконки
        HIDE_BUTTON_BG_ACTIVE: 'rgba(244, 67, 54, 0.9)',   // Фон когда скрипт активен (красный)
        HIDE_BUTTON_BG_INACTIVE: 'rgba(76, 175, 80, 0.9)', // Фон когда скрипт неактивен (зеленый)
        HIDE_BUTTON_BORDER: '2px solid rgba(255, 255, 255, 0.6)', // Обводка маленькой иконки
        HIDE_BUTTON_OPACITY: '0.8',             // Прозрачность маленькой иконки
        HIDE_BUTTON_OPACITY_HOVER: '1',         // Прозрачность при наведении
    };

    // === СЕЛЕКТОРЫ ДЛЯ ПОИСКА МОДАЛЬНОГО ОКНА ===
    const SELECTORS = {
        // Селекторы модального окна (новые и старые)
        MODAL_WRAPPERS: [
            '[role="dialog"][data-dialog-type="MODAL"]', // Новейший селектор (2024)
            '[role="dialog"]',                           // По роли dialog
            '.styles__ModalWrapper-sc-da82f9af-5',      // Новый селектор
            '.styles__ModalWrapper-sc-f26c4043-5',      // Старый селектор
            '[class*="ModalWrapper"]',                   // Универсальный
            '[class*="Modal"]',                          // Резервный
            '[class*="Content__StyledContent"]'         // Новый класс контента
        ],

        // Селекторы кнопок
        BUTTON_SELECTORS: [
            'button',
            '[role="button"]',
            'a[role="button"]',
            'input[type="button"]',
            'input[type="submit"]'
        ]
    };

    // === КЛЮЧИ ХРАНИЛИЩА ===
    const STORAGE_KEYS = {
        SCRIPT_ACTIVE: 'faceitLobbyAntiAfkActive',
        BUTTON_VISIBLE: 'faceitLobbyAntiAfkButtonVisible'
    };

    // === ПЕРЕМЕННЫЕ ===
    let isScriptActive = true; // По умолчанию включен
    let checkInterval = null;
    let observer = null;
    let isProcessing = false;
    let button = null;
    let hideButton = null; // Маленькая иконка глаза когда кнопка скрыта

    // === ОСНОВНЫЕ ФУНКЦИИ ===

    // Поиск модального окна
    function findModalWrapper() {
        for (const selector of SELECTORS.MODAL_WRAPPERS) {
            const modal = document.querySelector(selector);
            if (modal && isElementVisible(modal)) {
                return modal;
            }
        }
        return null;
    }

    // Проверка видимости элемента
    function isElementVisible(element) {
        if (!element) return false;

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.width > 0 &&
            rect.height > 0 &&
            document.documentElement.contains(element)
        );
    }

    // Поиск кнопки "Keep open" в модальном окне
    function findKeepOpenButton(modalWrapper) {
        if (!modalWrapper) return null;

        // Поиск по всем кнопкам в модальном окне
        for (const buttonSelector of SELECTORS.BUTTON_SELECTORS) {
            const buttons = modalWrapper.querySelectorAll(buttonSelector);

            for (const button of buttons) {
                if (!isElementVisible(button) || button.disabled) continue;

                const text = (button.innerText || button.textContent || '').trim().toLowerCase();
                if (!text) continue;

                // Проверяем соответствие текста
                const matches = CONFIG.TARGET_TEXTS.some(targetText =>
                    text.includes(targetText.toLowerCase())
                );

                if (matches) {
                    return button;
                }
            }
        }

        return null;
    }

    // Клик по кнопке
    function clickKeepOpenButton() {
        if (!isScriptActive || isProcessing) return false;
        isProcessing = true;

        try {
            const modalWrapper = findModalWrapper();
            if (!modalWrapper) {
                return false;
            }

            const button = findKeepOpenButton(modalWrapper);
            if (!button) {
                return false;
            }

            // Кликаем по кнопке
            button.click();
            return true;

        } catch (error) {
            return false;
        } finally {
            isProcessing = false;
        }
    }

    // Обработчик изменений DOM
    function handleDOMChanges(mutations) {
        if (!isScriptActive) return; // Не работаем если скрипт неактивен

                // Проверяем, появилось ли модальное окно
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Быстрая проверка на появление модального окна
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем новую структуру (role="dialog")
                        if (node.matches && (
                            node.matches('[role="dialog"]') ||
                            node.matches('[class*="Modal"]') ||
                            node.matches('[class*="Content__StyledContent"]')
                        )) {
                            setTimeout(clickKeepOpenButton, 100);
                            return;
                        }
                        // Проверяем дочерние элементы
                        const modal = node.querySelector && (
                            node.querySelector('[role="dialog"]') ||
                            node.querySelector('[class*="Modal"]') ||
                            node.querySelector('[class*="Content__StyledContent"]')
                        );
                        if (modal) {
                            setTimeout(clickKeepOpenButton, 100);
                            return;
                        }
                    }
                }
            }
        }
    }

    // Инициализация наблюдателя
    function initializeObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(handleDOMChanges);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // Запуск интервальной проверки
    function startIntervalCheck() {
        if (checkInterval) clearInterval(checkInterval);

        checkInterval = setInterval(() => {
            clickKeepOpenButton();
        }, CONFIG.CHECK_INTERVAL);
    }

    // Остановка интервальной проверки
    function stopIntervalCheck() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    // Остановка наблюдателя
    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // Запуск мониторинга
    function startMonitoring() {
        initializeObserver();
        startIntervalCheck();
        clickKeepOpenButton(); // Мгновенная проверка
    }

    // Остановка мониторинга
    function stopMonitoring() {
        stopObserver();
        stopIntervalCheck();
    }

    // Сохранение состояния скрипта
    function saveScriptState(active) {
        try {
            localStorage.setItem(STORAGE_KEYS.SCRIPT_ACTIVE, active ? '1' : '0');
        } catch (e) {
            // Игнорируем ошибки
        }
    }

    // Загрузка состояния скрипта
    function loadScriptState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SCRIPT_ACTIVE);
            // Если состояние сохранено, используем его, иначе по умолчанию включен
            return saved === null ? true : saved === '1';
        } catch (e) {
            return true; // По умолчанию включен
        }
    }

    // Сохранение видимости кнопки
    function saveButtonVisibility(visible) {
        try {
            localStorage.setItem(STORAGE_KEYS.BUTTON_VISIBLE, visible ? '1' : '0');
        } catch (e) {
            // Игнорируем ошибки
        }
    }

    // Загрузка видимости кнопки
    function loadButtonVisibility() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.BUTTON_VISIBLE);
            // По умолчанию кнопка видима
            return saved === null ? true : saved === '1';
        } catch (e) {
            return true; // По умолчанию видима
        }
    }

    // Обновление внешнего вида кнопки
    function updateButtonAppearance(buttonElement, active) {
        // Текст кнопки теперь второй span (первый - иконка глаза)
        const buttonText = buttonElement.querySelector('span:last-child');
        const eyeIcon = buttonElement.querySelector('span:first-child');

        if (!buttonText) return;

        if (active) {
            buttonText.textContent = 'Отключить анти-афк';
            buttonElement.style.backgroundColor = '#f44336';
            buttonElement.title = 'Остановить автоматическое нажатие кнопки Keep open';
            // Обновляем цвет иконки глаза на красный
            if (eyeIcon && eyeIcon._updateColor) {
                eyeIcon._updateColor(true);
            }
        } else {
            buttonText.textContent = 'Включить анти-афк';
            buttonElement.style.backgroundColor = '#4CAF50';
            buttonElement.title = 'Автоматически нажимает на кнопку Keep open в модальном окне';
            // Обновляем цвет иконки глаза на зеленый
            if (eyeIcon && eyeIcon._updateColor) {
                eyeIcon._updateColor(false);
            }
        }

        // Обновляем цвет скрытой иконки, если она есть
        if (hideButton) {
            updateHideButtonColor(active);
        }
    }

    // Обновление цвета скрытой иконки
    function updateHideButtonColor(active) {
        if (!hideButton) return;
        hideButton.style.backgroundColor = active ? CONFIG.HIDE_BUTTON_BG_ACTIVE : CONFIG.HIDE_BUTTON_BG_INACTIVE;
    }

    // Создание маленькой иконки глаза (когда кнопка скрыта)
    function createHideButton() {
        const hideBtn = document.createElement('div');
        hideBtn.innerHTML = '👁️';
        // Используем цвет в зависимости от состояния скрипта
        const bgColor = isScriptActive ? CONFIG.HIDE_BUTTON_BG_ACTIVE : CONFIG.HIDE_BUTTON_BG_INACTIVE;
        Object.assign(hideBtn.style, {
            position: 'fixed',
            top: CONFIG.BUTTON_TOP,
            right: CONFIG.BUTTON_RIGHT,
            zIndex: CONFIG.BUTTON_Z_INDEX,
            width: CONFIG.HIDE_BUTTON_SIZE,
            height: CONFIG.HIDE_BUTTON_SIZE,
            backgroundColor: bgColor,
            color: '#fff',
            border: CONFIG.HIDE_BUTTON_BORDER,
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: CONFIG.BUTTON_BOX_SHADOW,
            fontSize: CONFIG.HIDE_BUTTON_FONT_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: CONFIG.HIDE_BUTTON_OPACITY,
            transition: 'opacity 0.2s'
        });
        hideBtn.title = 'Показать кнопку анти-афк';
        hideBtn.addEventListener('mouseenter', () => {
            hideBtn.style.opacity = CONFIG.HIDE_BUTTON_OPACITY_HOVER;
        });
        hideBtn.addEventListener('mouseleave', () => {
            hideBtn.style.opacity = CONFIG.HIDE_BUTTON_OPACITY;
        });
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showMainButton();
        });
        document.body.appendChild(hideBtn);
        return hideBtn;
    }

    // Создание кнопки
    function createButton() {
        const buttonElement = document.createElement('button');
        Object.assign(buttonElement.style, {
            position: 'fixed',
            top: CONFIG.BUTTON_TOP,
            right: CONFIG.BUTTON_RIGHT,
            zIndex: CONFIG.BUTTON_Z_INDEX,
            padding: CONFIG.BUTTON_PADDING,
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: CONFIG.BUTTON_BORDER_RADIUS,
            cursor: 'pointer',
            boxShadow: CONFIG.BUTTON_BOX_SHADOW,
            fontSize: CONFIG.BUTTON_FONT_SIZE,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: CONFIG.BUTTON_GAP
        });

        // Иконка глаза для скрытия (в начале)
        const eyeIcon = document.createElement('span');
        eyeIcon.innerHTML = '👁️';
        // Начинаем с зеленого цвета (скрипт по умолчанию включен, но кнопка показывает "включить")
        eyeIcon.style.cssText = `font-size: ${CONFIG.EYE_ICON_SIZE}; cursor: pointer; padding: ${CONFIG.EYE_ICON_PADDING}; background-color: ${CONFIG.EYE_ICON_BG_COLOR_INACTIVE}; border: ${CONFIG.EYE_ICON_BORDER}; border-radius: ${CONFIG.EYE_ICON_BORDER_RADIUS}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;`;
        eyeIcon.title = 'Скрыть кнопку';
        let originalBgColor = CONFIG.EYE_ICON_BG_COLOR_INACTIVE;
        eyeIcon.addEventListener('mouseenter', () => {
            eyeIcon.style.backgroundColor = CONFIG.EYE_ICON_BG_HOVER;
            eyeIcon.style.borderColor = CONFIG.EYE_ICON_BORDER_HOVER;
        });
        eyeIcon.addEventListener('mouseleave', () => {
            eyeIcon.style.backgroundColor = originalBgColor;
            const borderParts = CONFIG.EYE_ICON_BORDER.split(' ');
            eyeIcon.style.borderColor = borderParts.slice(2).join(' ');
        });
        // Сохраняем ссылку на оригинальный цвет для обновления
        eyeIcon._updateColor = function(active) {
            originalBgColor = active ? CONFIG.EYE_ICON_BG_COLOR_ACTIVE : CONFIG.EYE_ICON_BG_COLOR_INACTIVE;
            eyeIcon.style.backgroundColor = originalBgColor;
        };
        eyeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            hideMainButton();
        });

        // Текст кнопки
        const buttonText = document.createElement('span');
        buttonText.textContent = 'Включить анти-афк';
        buttonText.style.cssText = 'white-space: nowrap;';

        buttonElement.appendChild(eyeIcon);
        buttonElement.appendChild(buttonText);
        buttonElement.title = 'Автоматически нажимает на кнопку Keep open в модальном окне';
        document.body.appendChild(buttonElement);
        return buttonElement;
    }

    // Скрытие главной кнопки
    function hideMainButton() {
        if (button) {
            button.style.display = 'none';
            saveButtonVisibility(false);

            // Создаем маленькую иконку глаза
            if (!hideButton) {
                hideButton = createHideButton();
            } else {
                hideButton.style.display = 'flex';
            }
        }
    }

    // Показать главную кнопку
    function showMainButton() {
        if (button) {
            button.style.display = 'flex';
            saveButtonVisibility(true);

            // Скрываем маленькую иконку
            if (hideButton) {
                hideButton.style.display = 'none';
            }
        }
    }

    // Обработчик клика по кнопке
    function handleButtonClick() {
        if (isScriptActive) {
            // Деактивируем скрипт
            isScriptActive = false;
            saveScriptState(false);
            stopMonitoring();
            updateButtonAppearance(this, false);
        } else {
            // Активируем скрипт
            isScriptActive = true;
            saveScriptState(true);
            updateButtonAppearance(this, true);
            startMonitoring();
        }
    }

    // Инициализация
    function initialize() {
        // Создаем кнопку
        button = createButton();
        button.addEventListener('click', handleButtonClick);

        // Загружаем сохраненное состояние скрипта
        const savedState = loadScriptState();
        isScriptActive = savedState;
        updateButtonAppearance(button, savedState);

        // Загружаем состояние видимости кнопки
        const buttonVisible = loadButtonVisibility();
        if (!buttonVisible) {
            hideMainButton();
        } else {
            button.style.display = 'flex';
        }

        // Если скрипт активен, запускаем мониторинг
        if (isScriptActive) {
            startMonitoring();
        }

        // Обновляем цвет иконки глаза при инициализации
        updateButtonAppearance(button, isScriptActive);
    }

    // Запуск после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();