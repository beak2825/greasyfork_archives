// ==UserScript==
// @name         VK Photo Upload Fix
// @description Исправляет ошибку загрузки фотографий в альбомы VK, создавая последовательную очередь. Предотвращает сбой "быстрого" аплоадера при загрузке пачкой и добавляет опцию заполнения описания из имени файла.
// @version      0.1
// @match        https://vk.com/album*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/554664/VK%20Photo%20Upload%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554664/VK%20Photo%20Upload%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ИНИЦИАЛИЗАЦИЯ: ГЛОБАЛЬНОЕ ОКНО ---
    // Определяем безопасный доступ к 'window' (W),
    // который работает как в 'unsafeWindow' (Greasemonkey/Tampermonkey), так и в обычном 'window'.
    const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // --- КАТЕГОРИЯ: УПРАВЛЕНИЕ СОСТОЯНИЕМ ОЧЕРЕДИ ---
    // Этот раздел содержит переменные для управления последовательной загрузкой.

    // - uploaderQueue: Массив, хранящий 'File' объекты, ожидающие загрузки.
    let uploaderQueue = [];
    // - isProcessingQueue: Флаг (boolean), блокирующий добавление нового файла,
    //   пока не завершится 'finish_add' (ответ XHR) от предыдущего.
    let isProcessingQueue = false;
    // - originalDropListener: Ссылка на "родной" обработчик 'drop' от VK, который мы перехватываем.
    let originalDropListener = null;
    // - dropTargetElement: Элемент DOM (drop-зона), к которому привязан 'originalDropListener'.
    let dropTargetElement = null;
    // - gmQueueTotal: Общее количество файлов в последней добавленной пачке (для UI).
    let gmQueueTotal = 0;
    // - currentFileName: Имя файла, который в данный момент загружается,
    //   используется для автоматического заполнения описания (если включено).
    let currentFileName = null;

    // --- КАТЕГОРИЯ: НАСТРОЙКИ (GM_setValue / GM_getValue) ---
    // Загружаем сохраненные настройки скрипта из хранилища Tampermonkey.

    // - scriptEnabled: Главный переключатель (ВКЛ/ВЫКЛ) всего скрипта.
    let scriptEnabled = GM_getValue('scriptEnabled', true);
    // - fillDescriptionEnabled: Переключатель опции авто-заполнения описания.
    let fillDescriptionEnabled = GM_getValue('fillDescriptionEnabled', true);

    /**
     * Секция: UI (Панель Управления)
     * Создает и внедряет на страницу плавающую панель настроек (UI).
     * Панель включает главный переключатель, чекбокс описания и индикатор очереди.
     */
    function createControlPanel() {
        if (document.getElementById('gm-script-panel')) return;

        const panelContainer = document.createElement('div');
        panelContainer.id = 'gm-script-panel';

        panelContainer.innerHTML = `
            <div class="gm-setting-header">
                <div class="gm-setting-title" id="gm-script-title">Fix Photo Uploader</div>
                <div class="gm-toggle-switch ${scriptEnabled ? 'on' : 'off'}" id="gm-script-toggle">
                    <div class="gm-toggle-knob"></div>
                </div>
            </div>
            <label class="gm-script-label" id="gm-desc-label" style="display: ${scriptEnabled ? 'flex' : 'none'};">
                <input type="checkbox" id="gm-enable-desc">
                <span>Заполнять описание</span>
            </label>
            
            <!-- Эти части скрыты по умолчанию -->
            <div id="gm-queue-header" style="display: none;">
                <span id="gm-queue-status">Очередь: 0/0</span>
                <button id="gm-queue-toggle" type="button">Скрыть</button>
            </div>
            <div id="gm-queue-list" style="display: none;"></div>
        `;

        document.body.appendChild(panelContainer);

        // --- Элементы UI ---
        const fixToggleSwitch = document.getElementById('gm-script-toggle');
        const fixTitle = document.getElementById('gm-script-title');
        const descLabel = document.getElementById('gm-desc-label');
        const descCheckbox = document.getElementById('gm-enable-desc');
        const queueListToggle = document.getElementById('gm-queue-toggle');
        const queueList = document.getElementById('gm-queue-list');

        // --- Логика Переключателя (Главный) ---
        const toggleFix = () => {
            scriptEnabled = !scriptEnabled;
            // Сохраняем состояние в GM_setValue
            GM_setValue('scriptEnabled', scriptEnabled);
            
            if (scriptEnabled) {
                fixToggleSwitch.classList.remove('off');
                fixToggleSwitch.classList.add('on');
                descLabel.style.display = 'flex';
            } else {
                fixToggleSwitch.classList.remove('on');
                fixToggleSwitch.classList.add('off');
                descLabel.style.display = 'none';
            }
        };

        fixToggleSwitch.addEventListener('click', toggleFix);
        fixTitle.addEventListener('click', toggleFix);

        // --- Логика Чекбокса Описания ---
        descCheckbox.checked = fillDescriptionEnabled;
        descCheckbox.addEventListener('change', function() {
            fillDescriptionEnabled = this.checked;
            GM_setValue('fillDescriptionEnabled', fillDescriptionEnabled);
        });

        // --- Логика Списка Очереди (Показать/Скрыть) ---
        queueListToggle.addEventListener('click', function() {
            if (queueList.style.display === 'none') {
                queueList.style.display = 'block';
                this.textContent = 'Скрыть';
            } else {
                queueList.style.display = 'none';
                this.textContent = 'Показать';
            }
        });

        // --- Стили для Панели ---
        GM_addStyle(`
            #gm-script-panel {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 99998;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 10px 15px;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                width: 250px; /* Уменьшаем ширину */
                font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", arial, Tahoma, verdana, sans-serif;
                color: #333;
            }
            #gm-script-panel .gm-setting-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            #gm-script-panel .gm-setting-title {
                font-weight: bold;
                color: #818c99;
                font-size: 13px;
                cursor: pointer;
            }
            #gm-script-panel label.gm-script-label {
                display: flex;
                align-items: center;
                cursor: pointer;
                padding: 4px 0;
                font-size: 13px;
            }
            #gm-script-panel input[type="checkbox"] {
                margin-right: 8px;
                cursor: pointer;
            }
            #gm-queue-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
            #gm-queue-status {
                font-weight: bold;
                color: #333;
            }
            #gm-queue-toggle {
                background: #eee;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 3px 8px;
                cursor: pointer;
            }
            #gm-queue-list {
                max-height: 200px;
                overflow-y: auto;
                border-top: 1px solid #eee;
                margin-top: 10px;
                padding-top: 5px;
                font-size: 12px;
                color: #555;
            }
            #gm-queue-list div {
                padding: 2px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            /* Стили Переключателя */
            .gm-toggle-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 24px;
                cursor: pointer;
                flex-shrink: 0;
            }
            .gm-toggle-switch .gm-toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 1px 1px rgba(0,0,0,0.1);
                transition: transform 0.2s ease-in-out;
            }
            .gm-toggle-switch.on {
                background-color: #447bba; /* VK Blue */
                border-radius: 12px;
            }
            .gm-toggle-switch.off {
                background-color: #ccc;
                border-radius: 12px;
            }
            .gm-toggle-switch.on .gm-toggle-knob {
                transform: translateX(16px);
            }
            .gm-toggle-switch.off .gm-toggle-knob {
                transform: translateX(0);
            }
        `);
    }

    /**
     * Секция: UI (Индикатор Очереди)
     * Обновляет отображение списка очереди в панели настроек.
     * Показывает 'Очередь: X/Y' и список файлов.
     */
    function updateQueueIndicator(remaining, total, fileList) {
        const statusEl = document.getElementById('gm-queue-status');
        const listEl = document.getElementById('gm-queue-list');
        const headerEl = document.getElementById('gm-queue-header');
        const toggleEl = document.getElementById('gm-queue-toggle');
        
        if (!statusEl || !listEl || !headerEl || !toggleEl) return;

        // Показываем части, связанные с очередью
        headerEl.style.display = 'flex';
        listEl.style.display = 'block';
        toggleEl.textContent = 'Скрыть';

        statusEl.textContent = `Очередь: ${remaining}/${total}`;
        listEl.innerHTML = fileList.map(f => `<div>${f.name}</div>`).join('');
    }

    /**
     * Секция: UI (Индикатор Очереди)
     * Скрывает блок очереди (но не всю панель) после завершения загрузки.
     */
    function hideQueueIndicator() {
        // Не скрываем всю панель, а только части, связанные с очередью
        const listEl = document.getElementById('gm-queue-list');
        const headerEl = document.getElementById('gm-queue-header');

        if (listEl) listEl.style.display = 'none';
        if (headerEl) headerEl.style.display = 'none';
        
        gmQueueTotal = 0;
    }
    
    // --- КАТЕГОРИЯ: ПЕРЕХВАТ XHR (XMLHttpRequest) ---
    // Эта секция перехватывает сетевые запросы для отслеживания завершения загрузки.

    const originalXhrOpen = W.XMLHttpRequest.prototype.open;
    const originalXhrSend = W.XMLHttpRequest.prototype.send;

    /**
     * Перехват W.XMLHttpRequest.prototype.open
     * Сохраняем URL запроса в 'this._gm_url', чтобы использовать его в 'send'.
     */
    W.XMLHttpRequest.prototype.open = function(method, url) {
        this._gm_url = url; // Сохраняем URL для send
        originalXhrOpen.apply(this, arguments);
    };

    /**
     * Перехват W.XMLHttpRequest.prototype.send
     * Здесь происходит основная логика "разблокировки" очереди и заполнения описания.
     */
     W.XMLHttpRequest.prototype.send = function() {
        // Мы следим за событием 'load' (успешное завершение запроса)
        this.addEventListener('load', () => {
            try {
                // Ищем запрос 'finish_add', который VK отправляет ПОСЛЕ загрузки файла.
                if (scriptEnabled && typeof this._gm_url === 'string' && this._gm_url.includes('/al_photos.php?act=finish_add')) {

                    // Проверяем, включена ли опция заполнения описания.
                    if (fillDescriptionEnabled && currentFileName) {
                        try {
                            const response = JSON.parse(this.responseText);
                            // Ищем ID фотографии в JSON-ответе от VK.
                            const photoData = response?.payload?.[1]?.[1]?.photo_data || response?.photo_data;
                            
                            if (photoData) {
                                const photoId = Object.keys(photoData)[0];
                                if (photoId) {
                                    const fileName = currentFileName; 
                                    
                                    // (ВАЖНО) Ожидаем 100мс, пока VK отрисует DOM-элемент (textarea) для этой фотографии.
                                    setTimeout(() => {
                                        const editRow = document.getElementById('photo_edit_row_' + photoId);
                                        if (editRow) {
                                            const textarea = editRow.querySelector('.photos_photo_edit_row_desc_input');
                                            const placeholder = editRow.querySelector('.photos_photo_edit_row_desc_placeholder');
                                            
                                            if (textarea && placeholder) {
                                                // Имитируем клик на placeholder (если он есть)
                                                if (placeholder.style.display !== 'none') {
                                                    placeholder.click();
                                                }
                                                // и вставляем 'currentFileName'.
                                                textarea.value = fileName;
                                                // Имитируем 'blur', чтобы VK сохранил описание.
                                                textarea.dispatchEvent(new Event('blur', { 'bubbles': true }));
                                            }
                                        }
                                    }, 100); 
                                }
                            }
                        } catch (e) {
                            // Ошибка парсинга JSON или поиска ID (игнорируем)
                        }
                        currentFileName = null; // Очищаем для следующего файла
                    }

                    // --- РАЗБЛОКИРУЕМ ОЧЕРЕДЬ ---
                    // Сбрасываем флаг 'isProcessingQueue', позволяя 'processQueue' взять следующий файл.
                    isProcessingQueue = false;
                    processQueue(); // Вызываем следующий файл в очереди НЕМЕДЛЕННО.
                }
            } catch (e) {
                // Ошибка в 'finish_add', принудительно разблокируем очередь
                if (scriptEnabled) {
                    isProcessingQueue = false;
                    processQueue();
                }
            }
        });
        originalXhrSend.apply(this, arguments);
    };

    /**
     * Шаг 2: Кастомный Обработчик 'drop'
     * Этот обработчик ПОЛНОСТЬЮ заменяет "родной" обработчик VK (найденный в Шаге 1).
     * Он не дает VK загружать файлы пачкой, а вместо этого:
     * 1. Собирает ВСЕ файлы в 'uploaderQueue'.
     * 2. Запускает 'processQueue' (если он не активен).
     */
    async function customDropHandler(event) {
        // (ВАЖНО) Мы *обязаны* отменить стандартное поведение браузера,
        // иначе он откроет перетащенный файл в этой же вкладке.
        event.preventDefault();
        event.stopPropagation();

        // Если фикс отключен, передаем управление "родному" обработчик
        if (!scriptEnabled) {
            return originalDropListener.call(dropTargetElement, event); 
        }

        if (!originalDropListener || !dropTargetElement) {
            return;
        }

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) {
            return;
        }
        
        // Мы не скрываем drop-зону; мы позволим 'processQueue' (вызвав "родной" обработчик)
        // сделать это при обработке первого файла.

        // Очищаем очередь (на случай, если это новый drag-n-drop).
        gmQueueTotal = files.length; 
        uploaderQueue = []; 
        // Заполняем 'uploaderQueue' файлами из 'event.dataTransfer'.
        for (let i = 0; i < files.length; i++) {
            uploaderQueue.push(files[i]);
        }

        updateQueueIndicator(uploaderQueue.length, gmQueueTotal, uploaderQueue);

        if (!isProcessingQueue) {
            processQueue();
        }
    }

    /**
     * Шаг 3: Обработчик Очереди
     * Краеугольный камень скрипта. Вызывается, когда очередь разблокирована ('isProcessingQueue' == false).
     * 1. Проверяет, не занята ли очередь.
     * 2. Если очередь пуста - завершает работу.
     * 3. Если файлы есть: БЛОКИРУЕТ очередь ('isProcessingQueue' = true).
     * 4. Берет ОДИН (первый) файл из 'uploaderQueue'.
     * 5. Имитирует событие 'drop' (DragEvent) ТОЛЬКО с этим ОДНИМ файлом.
     * 6. Вызывает "родной" обработчик 'originalDropListener' с этим фальшивым событием.
     * (VK думает, что это "быстрая" загрузка 1 файла и обрабатывает ее).
     * (Перехватчик XHR (Шаг 4) ждет 'finish_add', чтобы разблокировать очередь).
     */
    function processQueue() {
        // 1. Проверяем, не занята ли очередь.
        if (isProcessingQueue) {
            return;
        }

        // 2. Если очередь пуста - завершает работу.
        if (uploaderQueue.length === 0) {
            if (gmQueueTotal > 0) {
                 setTimeout(hideQueueIndicator, 2000);
            }
            gmQueueTotal = 0;
            return;
        }

        // 3. БЛОКИРУЕМ очередь.
        isProcessingQueue = true;
        // 4. Берет ОДИН файл.
        const file = uploaderQueue.shift();
        currentFileName = file.name; 

        updateQueueIndicator(uploaderQueue.length + 1, gmQueueTotal, [file, ...uploaderQueue]);

        try {
            // 5. Имитирует событие 'drop' (DragEvent)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // Мы ДОЛЖНЫ создать DragEvent, а не простой Event.
            const fakeEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dataTransfer });
            
            // 6. Вызывает "родной" обработчик.
            originalDropListener.call(dropTargetElement, fakeEvent);

        } catch (e) {
            // Критическая ошибка, останавливаем очередь
            uploaderQueue = [];
            isProcessingQueue = false;
            gmQueueTotal = 0;
            currentFileName = null;
            hideQueueIndicator();
        }
    }


    /**
     * Шаг 1: Перехват 'addEventListener'
     * Ищем, когда VK пытается установить "родной" обработчик 'drop' на drop-зону.
     * Мы не блокируем его, а ПОДМЕНЯЕМ 'listener' на 'customDropHandler'.
     */
    const originalAddEventListener = W.EventTarget.prototype.addEventListener;
    W.EventTarget.prototype.addEventListener = function(type, listener, options) {
        
        // Мы ищем 'drop' только на конкретном элементе (drop-зоне).
        if (type === 'drop' && (this.id === 'photos_upload_area_drop' || this.classList?.contains('photos_upload_area_drop')) && typeof listener === 'function') {
            
            const listenerCode = listener.toString();
            
            // Ищем "родной" обработчик по ключевым словам в его коде.
            if (listenerCode.includes('manualUploadFiles') && listenerCode.includes('getAcceptedFilesOnly')) {

                // Сохраняем "родной" listener и 'this' (элемент) в глобальные переменные.
                originalDropListener = listener; 
                dropTargetElement = this;       

                // (ВАЖНО) Вместо "родного" listener, передаем НАШ 'customDropHandler'.
                // VK думает, что установил свой обработчик, но на самом деле - наш.
                return originalAddEventListener.call(this, type, customDropHandler, options);
            }
        }

        // Все остальные 'drop' (не на той зоне) или другие типы событий (dragover) проходят без изменений.
        return originalAddEventListener.call(this, type, listener, options);
    };

    /**
     * Категория: Поддержка SPA (Single Page Application)
     * Наблюдает за изменениями в DOM, чтобы повторно создать панель управления,
     * если VK перерисовывает интерфейс (например, при переходе в другой альбом).
     */
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Мы больше не следим за удалением drop-зоны,
            // т.к. 'addEventListener' (Шаг 1) будет ловить новый обработчик при
            // каждом открытии окна загрузки.
            
            // Вместо этого ищем 'FCPanel' (боковая панель VK), чтобы
            // создать нашу панель 'gm-script-panel' (если ее еще нет).
            if (!document.getElementById('gm-script-panel')) {
                 for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.querySelector('aside.FCPanel')) {
                        createControlPanel();
                        return;
                    }
                 }
            }
        }
    });

    // --- КАТЕГОРИЯ: ЗАПУСК СКРИПТА ---
    const startMonitoring = () => {
        // Пытаемся создать панель сразу.
        if (!createControlPanel()) {
            // Если 'FCPanel' еще не в DOM, запускаем 'observer'.
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    // Стандартный запуск (DOMContentLoaded).
    if (document.readyState === 'loading') {
        W.addEventListener('load', startMonitoring);
    } else {
        startMonitoring();
    }

})();