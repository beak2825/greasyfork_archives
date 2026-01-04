// ==UserScript==
// @name         Yandex OCR. Перехватывает оригинальный текст
// @version      0.13
// @description  Перехватывает оригинальный или переведенный текст из ответа API и DOM на Yandex OCR, с опциями
// @match        https://translate.yandex.ru/ocr*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @run-at       document-start
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/553056/Yandex%20OCR%20%D0%9F%D0%B5%D1%80%D0%B5%D1%85%D0%B2%D0%B0%D1%82%D1%8B%D0%B2%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B8%D0%B3%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%82%D0%B5%D0%BA%D1%81%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/553056/Yandex%20OCR%20%D0%9F%D0%B5%D1%80%D0%B5%D1%85%D0%B2%D0%B0%D1%82%D1%8B%D0%B2%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B8%D0%B3%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%82%D0%B5%D0%BA%D1%81%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    // Они вынесены в глобальную область, чтобы быть доступными
    // как для перехватчика, так и для функций DOM.
    let capturedData = null; // Временно хранит данные OCR
    let lastOriginalText = ''; // Кэш для оригинального текста
    let lastTranslatedText = ''; // Кэш для переведенного текста
    let observer = null; // Для отслеживания изменений в DOM
    let observerDebounce = null; // Для "успокоения" наблюдателя
    let settings = {}; // Глобальный объект настроек
    let uiReady = false; // Флаг, что UI готов
    let textarea, copyBtn, headerTitle; // Ключевые элементы UI
    let autoCopyToggle, newlinesToggle, translationToggle; // Переключатели

    // --- КАТЕГОРИЯ: ПЕРЕХВАТ СЕТЕВЫХ ЗАПРОСОВ ---
    // Этот блок выполняется немедленно при загрузке страницы, еще до построения DOM.
    // Его задача — подготовиться к перехвату данных от API распознавания текста.
    // - capturedData: Временно хранит данные OCR, если они получены до полной загрузки интерфейса.
    // - unsafeWindow.handleOcrData: Начальная функция-заглушка для обработки данных. Будет заменена основной логикой позже.
    // - patchXHR: Основная функция, которая изменяет (патчит) XMLHttpRequest для отслеживания запросов к API OCR.

    // Временный обработчик данных. Он сработает, если сетевой запрос завершится
    // до того, как основной интерфейс скрипта будет создан.
    unsafeWindow.handleOcrData = (data) => {
        capturedData = data;
    };

    // Функция для перехвата сетевых запросов
    const patchXHR = () => {
        const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;

        // Переопределяем метод open, чтобы пометить нужные нам запросы
        unsafeWindow.XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            // Ищем запросы, отправленные на эндпоинт API распознавания
            if (typeof url === 'string' && url.includes('/ocr/v1.1/recognize')) {
                this._isOcrRequest = true; // Добавляем флаг к запросу
            }
            return originalXhrOpen.apply(this, args);
        };

        // Переопределяем метод send, чтобы добавить обработчик ответа
        unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
            if (this._isOcrRequest) {
                this.addEventListener('load', function() {
                    // Проверяем успешность запроса и наличие ответа
                    if (this.status >= 200 && this.status < 300 && this.responseText) {
                        try {
                            const data = JSON.parse(this.responseText);
                            // Вызываем глобальный обработчик для передачи данных
                            unsafeWindow.handleOcrData(data);
                        } catch (err) {
                            // Ошибки парсинга молча игнорируются
                        }
                    }
                });
            }
            return originalXhrSend.apply(this, args);
        };
    };
    // Немедленно активируем перехватчик
    patchXHR();


    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ ФУНКЦИИ ОБРАБОТКИ ---

    // Извлекает ОБА текста (оригинал и перевод) из данных API
    const processAllTextFromData = (data) => {
        if (!data) {
            return { original: '', translated: '' };
        }
        const blocks = data?.data?.blocks || data?.blocks;
        if (!blocks || !Array.isArray(blocks)) {
            return { original: '', translated: '' };
        }

        try {
            let originalLines = [];
            let translatedLines = [];

            blocks.forEach(block => {
                const boxes = block.boxes || [];
                originalLines.push(boxes.map(box => box.text || '').join(' '));
                translatedLines.push(boxes.map(box => box.translation || '').join(' '));
            });

            let originalText, translatedText;

            if (settings.useNewlines) {
                originalText = originalLines.join('\n').trim();
                translatedText = translatedLines.join('\n').trim();
            } else {
                originalText = originalLines.join(' ').replace(/\s+/g, ' ').trim();
                translatedText = translatedLines.join(' ').replace(/\s+/g, ' ').trim();
            }

            return { original: originalText, translated: translatedText };

        } catch (err) {
            return { original: '', translated: '' };
        }
    };

    // Читает текст из DOM по селектору (#imageSrcText или #imageDstText)
    const readTextFromDOM = (selector, type) => {
        if (!uiReady) return '';
        const textElements = document.querySelectorAll(`${selector} textPath`);
        if (!textElements || textElements.length === 0) {
            return '';
        }

        if (settings.useNewlines) {
            const blocks = {};
            textElements.forEach(el => {
                const block = el.closest('.image-text-block');
                const blockIndex = block ? block.dataset.index : '0';
                if (!blocks[blockIndex]) blocks[blockIndex] = [];
                blocks[blockIndex].push(el.textContent || '');
            });
            return Object.values(blocks).map(lineArray => lineArray.join(' ')).join('\n').trim();
        } else {
            return Array.from(textElements).map(el => el.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
        }
    };

    // Обновляет текстовое поле
    const updateTextarea = (isInit = false) => {
        if (!uiReady) {
            return;
        }
        let text = '';
        let placeholder = '';

        if (settings.showTranslated) {
            headerTitle.textContent = "Переведенный текст";
            if (isInit && lastTranslatedText === '') {
                lastTranslatedText = readTextFromDOM('#imageDstText', 'Перевод');
            }
            text = lastTranslatedText;
            placeholder = "Ожидание перевода...";
        } else {
            headerTitle.textContent = "Оригинальный текст";
            if (isInit && lastOriginalText === '') {
                lastOriginalText = readTextFromDOM('#imageSrcText', 'Оригинал');
            }
            text = lastOriginalText;
            placeholder = "Здесь появится оригинальный текст...";

            if (text === '' && capturedData === null && lastTranslatedText !== '') {
                placeholder = "Оригинал недоступен (страница перезагружена). Загрузите картинку заново, чтобы получить его.";
            }
        }
        textarea.value = text;
        textarea.placeholder = placeholder;
    };

    // Функция для копирования текста в буфер обмена
    const copyTextToClipboard = (text) => {
        if (!text || !uiReady) return;
        GM_setClipboard(text, 'text');
        copyBtn.textContent = 'Скопировано!';
        copyBtn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            copyBtn.textContent = 'Копировать';
            copyBtn.style.backgroundColor = '#555';
        }, 1500);
    };

    // Наблюдатель за DOM
    const startDOMObserver = () => {
        if (!uiReady) return;
        if (observer) observer.disconnect();
        const targetNode = document.getElementById('ocrContainer');
        if (!targetNode) {
            setTimeout(startDOMObserver, 100);
            return;
        }

        const callback = () => {
            let translatedChanged = false;
            let originalChanged = false;

            // 1. Пытаемся прочитать ПЕРЕВЕДЕННЫЙ текст
            const newTranslatedText = readTextFromDOM('#imageDstText', 'Перевод');
            if (newTranslatedText && newTranslatedText !== lastTranslatedText) {
                lastTranslatedText = newTranslatedText;
                translatedChanged = true;

                // Если мы ждали перевод и автокопирование включено,
                // копируем его именно сейчас, когда он появился в DOM.
                if (settings.autoCopy && settings.showTranslated) {
                    copyTextToClipboard(lastTranslatedText);
                }
            }

            // 2. Пытаемся прочитать ОРИГИНАЛЬНЫЙ текст
            if (capturedData === null) {
                const newOriginalText = readTextFromDOM('#imageSrcText', 'Оригинал');
                if (newOriginalText && newOriginalText !== lastOriginalText) {
                    lastOriginalText = newOriginalText;
                    originalChanged = true;
                }
            }

            // 3. Обновляем UI
            if ((translatedChanged && settings.showTranslated) || (originalChanged && !settings.showTranslated)) {
                updateTextarea();
            }
        };

        observer = new MutationObserver((mutationsList) => {
            const hasChildListChanged = mutationsList.some(m => m.type === 'childList' && m.addedNodes.length > 0);
            if (hasChildListChanged) {
                clearTimeout(observerDebounce);
                observerDebounce = setTimeout(callback, 250);
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    };


    // --- КАТЕГОРИЯ: ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЬСКОГО ИНТЕРФЕЙСА ---
    // Код в этом блоке выполняется после полной загрузки DOM-дерева страницы.
    // Основная задача — создание, стилизация и добавление логики для окна-помощника.
    window.addEventListener('DOMContentLoaded', () => {

        // --- ПОДКАТЕГОРИЯ: СТИЛИЗАЦИЯ ЭЛЕМЕНТОВ ---
        // Здесь определяются все CSS-стили для окна-помощника, его заголовка,
        // текстового поля и индикатора статуса. Стили добавляются на страницу
        // с помощью функции Greasemonkey GM_addStyle.
        GM_addStyle(`
            #ocr-helper-window {
                position: fixed; top: 20px; right: 20px; width: 350px; max-height: 80vh;
                background-color: #2c2c2e; color: #f2f2f7; border: 1px solid #444; border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4); z-index: 9999; display: flex; flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                transition: transform 0.2s ease-in-out;
            }
            #ocr-helper-header {
                padding: 10px 15px; cursor: move; background-color: #3a3a3c; border-bottom: 1px solid #444;
                border-top-left-radius: 12px; border-top-right-radius: 12px; display: flex;
                justify-content: space-between; align-items: center; user-select: none;
            }
            #ocr-helper-header h3 { margin: 0; font-size: 16px; font-weight: 600; flex-grow: 1; }
            #ocr-header-controls { display: flex; align-items: center; gap: 5px; }
            #ocr-helper-copy-btn {
                font-size: 12px; padding: 4px 10px; border-radius: 6px; background-color: #555;
                color: #ddd; transition: all 0.3s ease-in-out; border: none; cursor: pointer; white-space: nowrap;
            }
            #ocr-helper-copy-btn:hover { background-color: #666; }
            .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; }
            .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
            input:checked + .slider { background-color: #4CAF50; }
            input:checked + .slider:before { transform: translateX(14px); }
            .slider.round { border-radius: 20px; }
            .slider.round:before { border-radius: 50%; }

            #ocr-helper-content { padding: 15px; flex-grow: 1; overflow-y: auto; }
            #ocr-helper-textarea {
                width: 100%; height: 100%; min-height: 200px; background-color: #1c1c1e; color: #f2f2f7;
                border: 1px solid #444; border-radius: 8px; padding: 10px; box-sizing: border-box;
                font-size: 14px; resize: vertical; white-space: pre-wrap;
            }
        `);

        // --- ПОДКАТЕГОРИЯ: СОЗДАНИЕ DOM-ЭЛЕМЕНТОВ ---
        // Создание и добавление на страницу основного HTML-каркаса для окна-помощника.
        // Также здесь кэшируются ссылки на ключевые элементы для дальнейшего использования.
        const helperWindow = document.createElement('div');
        helperWindow.id = 'ocr-helper-window';
        helperWindow.innerHTML = `
            <div id="ocr-helper-header">
                <h3>Оригинальный текст</h3>
                <div id="ocr-header-controls">
                    <label class="switch" title="Оригинал / Перевод">
                        <input type="checkbox" id="translation-toggle">
                        <span class="slider round"></span>
                    </label>
                    <label class="switch" title="Сохранять переносы строк">
                        <input type="checkbox" id="newlines-toggle">
                        <span class="slider round"></span>
                    </label>
                    <label class="switch" title="Автокопирование">
                        <input type="checkbox" id="auto-copy-toggle">
                        <span class="slider round"></span>
                    </label>
                    <button id="ocr-helper-copy-btn">Ожидание</button>
                </div>
            </div>
            <div id="ocr-helper-content">
                <textarea id="ocr-helper-textarea" placeholder="Здесь появится оригинальный текст..." readonly></textarea>
            </div>
        `;
        document.body.appendChild(helperWindow);

        // Кэширование переменных UI
        const header = document.getElementById('ocr-helper-header');
        headerTitle = document.querySelector('#ocr-helper-header h3');
        copyBtn = document.getElementById('ocr-helper-copy-btn');
        textarea = document.getElementById('ocr-helper-textarea');
        autoCopyToggle = document.getElementById('auto-copy-toggle');
        newlinesToggle = document.getElementById('newlines-toggle');
        translationToggle = document.getElementById('translation-toggle');

        // --- ПОДКАТЕГОРИЯ: УПРАВЛЕНИЕ НАСТРОЙКАМИ ---
        // Загрузка настроек из localStorage при запуске
        const loadSettings = () => {
            const saved = localStorage.getItem('ocrHelperSettings');
            settings = saved ? JSON.parse(saved) : { autoCopy: false, useNewlines: true, showTranslated: false };
            autoCopyToggle.checked = settings.autoCopy;
            newlinesToggle.checked = settings.useNewlines;
            translationToggle.checked = settings.showTranslated;
            updateTextarea(true); // Обновляем UI на основе загруженных настроек
        };

        // Сохранение настроек в localStorage при изменении.
        const saveSettings = () => {
            localStorage.setItem('ocrHelperSettings', JSON.stringify(settings));
        };

        // --- ПОДКАТЕГОРИЯ: РЕАЛИЗАЦИЯ ПЕРЕТАСКИВАНИЯ ОКНА ---
        // Набор обработчиков событий (mousedown, mousemove, mouseup) для заголовка окна,
        // которые позволяют пользователю свободно перемещать окно по экрану.
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            // Игнорируем клики по элементам управления в заголовке, чтобы не мешать их работе
            if (e.target.closest('#ocr-header-controls')) return;
            isDragging = true;
            offsetX = e.clientX - helperWindow.getBoundingClientRect().left;
            offsetY = e.clientY - helperWindow.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
            helperWindow.style.transition = 'none'; // Отключаем анимацию во время перетаскивания
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            helperWindow.style.left = `${e.clientX - offsetX}px`;
            helperWindow.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
            helperWindow.style.transition = 'transform 0.2s ease-in-out'; // Возвращаем анимацию
        });

        // --- ПОДКАТЕГОРИЯ: ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ЭЛЕМЕНТОВ УПРАВЛЕНИЯ ---

        // Клик по кнопке "Копировать"
        copyBtn.addEventListener('click', () => copyTextToClipboard(textarea.value));

        // Переключатель Оригинал/Перевод
        translationToggle.addEventListener('change', () => {
            settings.showTranslated = translationToggle.checked;
            saveSettings();
            updateTextarea();
        });

        // Изменение состояния переключателя автокопирования
        autoCopyToggle.addEventListener('change', () => {
            settings.autoCopy = autoCopyToggle.checked;
            saveSettings();
        });

        // Изменение состояния переключателя переносов строк
        newlinesToggle.addEventListener('change', () => {
            settings.useNewlines = newlinesToggle.checked;
            saveSettings();
            
            // 1. Переформатируем оригинальный текст.
            //    Источник №1 (лучший) - это данные API (capturedData).
            if (capturedData) {
                // processAllTextFromData использует 'settings.useNewlines'
                // и вернет нам переформатированный оригинал.
                // Перевод из API (который пустой) мы просто игнорируем.
                const { original } = processAllTextFromData(capturedData);
                lastOriginalText = original;
            } else {
                // Источник №2 (запасной, после перезагрузки) - это DOM.
                lastOriginalText = readTextFromDOM('#imageSrcText', 'Оригинал');
            }
            
            // 2. Переформатируем переведенный текст.
            //    Единственный надежный источник - это DOM.
            //    readTextFromDOM также использует 'settings.useNewlines'.
            lastTranslatedText = readTextFromDOM('#imageDstText', 'Перевод');

            // 3. Обновляем UI.
            // updateTextarea покажет то, что нужно (оригинал или перевод)
            updateTextarea();
        });


        // --- ПОДКАТЕГОРИЯ: ОСНОВНОЙ ОБРАБОТЧИК ДАННЫХ ---
        // Переопределение функции handleOcrData. Эта версия функции получает данные от перехватчика,
        // извлекает и форматирует текст, обновляет UI, копирует результат в буфер обмена
        // и отображает статус операции пользователю.
        unsafeWindow.handleOcrData = (data) => {
            capturedData = data; // Сохраняем "свежие" данные

            // Извлекаем оба текста из API
            const { original, translated } = processAllTextFromData(data);
            lastOriginalText = original;
            lastTranslatedText = translated; // Теперь у нас есть и перевод из API (обычно пустой)

            updateTextarea(); // Обновляем UI

            if (settings.autoCopy) {
                if (!settings.showTranslated) {
                    // 1. Если нужен ОРИГИНАЛ, копируем его (он всегда есть в API)
                    copyTextToClipboard(lastOriginalText);
                } else if (lastTranslatedText) {
                    // 2. Если нужен ПЕРЕВОД и он *уже* есть в API (не пустой), копируем его
                    copyTextToToClipboard(lastTranslatedText);
                }
                // 3. Если нужен ПЕРЕВОД, но его в API нет (lastTranslatedText пуст),
                //    то ничего не делаем. Ждем, пока сработает MutationObserver.
            } else {
                copyBtn.textContent = 'Обновлено';
                setTimeout(() => { copyBtn.textContent = 'Копировать'; }, 1500);
            }
        };

        // --- ПОДКАТЕГОРИЯ: ОБРАБОТКА "РАННИХ" ДАННЫХ ---
        // Проверяет, были ли данные получены до того, как интерфейс был готов.
        // Если да (capturedData не null), то эти данные немедленно передаются
        // в основной обработчик для отображения.

        uiReady = true; // Сообщаем, что UI готов
        loadSettings(); // Загружаем настройки пользователя

        if (capturedData) {
            // Обрабатываем данные, полученные до готовности UI
            unsafeWindow.handleOcrData(capturedData);
        }

        startDOMObserver(); // Запускаем наблюдатель за DOM
    });
})();