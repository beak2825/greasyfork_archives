// ==UserScript==
// @name         Парсер fictionzone.net — FB2 & TXT
// @version      0.153
// @description  Извлекает главы с fictionzone.net и сохраняет их в FB2 или TXT.
// @match        https://fictionzone.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552965/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20fictionzonenet%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552965/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20fictionzonenet%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- КАТЕГОРИЯ: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЯ ---
    // Этот раздел содержит все глобальные переменные и константы, управляющие состоянием скрипта.
    // - State: Перечисление возможных состояний работы скрипта (IDLE, WORKING, MINING).
    // - currentState: Текущее состояние скрипта, определяет, какие действия могут выполняться.
    // - isMining: Флаг, указывающий, активен ли в данный момент режим автоматического сбора глав.
    // - autoMineLoopTimeout: Идентификатор таймера для цикла автосбора, используется для его остановки.
    // - bookCollection: Основной объект, хранящий все данные о книге (метаданные, оглавление, собранные главы).
    // - ui: DOM-элемент, содержащий весь интерфейс скрипта.
    // - lastCheckedUrl: URL последней проверенной страницы, для предотвращения повторных выполнений при навигации.
    // - navigationDebounceTimer: Идентификатор таймера для отложенного вызова `handlePageUpdate` при смене URL.
    const State = {
        IDLE: 'IDLE', // Ожидание
        WORKING: 'WORKING', // Выполнение задачи (добавление главы, генерация файла)
        MINING: 'MINING', // Режим автосбора
    };
    let currentState = State.IDLE;
    let isMining = false;
    let autoMineLoopTimeout;
    let bookCollection = {};
    let ui;
    let lastCheckedUrl = '';
    let navigationDebounceTimer;
 
    // --- КАТЕГОРИЯ: ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ ---
    // Набор функций для обработки и форматирования данных.
    // - escapeXml: Экранирует специальные XML-символы в строке для безопасной вставки в FB2.
    // - reformatToParagraphs: Очищает HTML-узел главы от мусора (скрипты, реклама) и форматирует текст в абзацы <p>.
    function escapeXml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }
 
    function reformatToParagraphs(node) {
        if (!node) return '';
        const clone = node.cloneNode(true);
        clone.querySelectorAll('script, style, .ad-slot, .ad-slot-sticky, a[href*="mailto:"], div[id*="google_ads"], div[style*="min-height:310px"], .chapter-title').forEach(el => el.remove());
        let contentHtml = '';
        const paragraphs = clone.querySelectorAll('.chapter-content p, .chapter-content div[data-v-27111477] > p');
 
        if (paragraphs.length > 0) {
             paragraphs.forEach(p => {
                if (p.textContent.trim()) {
                    contentHtml += `<p>${escapeXml(p.textContent.trim())}</p>`;
                }
            });
        } else {
            (clone.innerText || '').split('\n').forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    contentHtml += `<p>${escapeXml(trimmedLine)}</p>`;
                }
            });
        }
        return contentHtml;
    }
 
    // --- УДАЛЕНО: Функция преобразования слов в числа больше не нужна, так как порядок глав определяется их позицией в списке. ---
 
    // --- КАТЕГОРИЯ: ГЕНЕРАЦИЯ ФАЙЛОВ ---
    // Функции, отвечающие за создание и загрузку файлов FB2 и TXT.
    // - generateFb2: Создает полный FB2-файл с метаданными и выбранными главами.
    // - generateFb2SectionsOnly: Создает фрагмент FB2, содержащий только секции глав (для "упрощенного режима").
    // - generateTxt: Создает полный TXT-файл с метаданными и текстом глав.
    // - generateTxtSectionsOnly: Создает фрагмент TXT, содержащий только текст глав.
    // - triggerDownload: Инициирует загрузку сгенерированного файла в браузере.
    function generateFb2(chaptersToProcess) {
        const { meta } = bookCollection;
        const creationDate = new Date().toISOString().split('T')[0];
        const genresXml = (meta.genres || []).map(g => `<genre>${escapeXml(g)}</genre>`).join('\n            ');
        const keywordsXml = (meta.tags || []).map(t => `<keyword>${escapeXml(t)}</keyword>`).join('\n            ');
        const annotationXml = (meta.annotation || []).map(p => `<p>${escapeXml(p)}</p>`).join('\n            ');
 
        const chaptersXml = chaptersToProcess
            .sort((a, b) => a.order - b.order)
            .map(ch => `
        <section>
            <title><p>${escapeXml(ch.title)}</p></title>
            ${ch.content}
        </section>`).join('');
 
        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
    <description>
        <title-info>
            <book-title>${escapeXml(meta.title || 'Без названия')}</book-title>
            <author><first-name>${escapeXml(meta.author || 'Автор не указан')}</first-name></author>
            <annotation>${annotationXml}</annotation>
            ${genresXml}
            ${keywordsXml}
            <date>${creationDate}</date>
            <lang>en</lang>
        </title-info>
        <document-info></document-info>
    </description>
    <body>${chaptersXml}</body>
</FictionBook>`;
    }
 
    function generateFb2SectionsOnly(chaptersToProcess) {
        return chaptersToProcess
            .sort((a, b) => a.order - b.order)
            .map(ch => `
        <section>
            <title><p>${escapeXml(ch.title)}</p></title>
            ${ch.content}
        </section>`).join('').trim();
    }
 
    function generateTxt(chaptersToProcess) {
        const { meta } = bookCollection;
        let text = `${meta.title || 'Без названия'}\nАвтор: ${meta.author || 'Автор не указан'}\n\n${(meta.annotation || []).join('\n')}\n\n---\n\n`;
        text += generateTxtSectionsOnly(chaptersToProcess);
        return text;
    }
 
    function generateTxtSectionsOnly(chaptersToProcess) {
        let text = '';
        chaptersToProcess
            .sort((a, b) => a.order - b.order)
            .forEach(ch => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = ch.content;
            const chapterText = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent.trim()).join('\n\n');
            text += `Глава: ${ch.title}\n\n${chapterText}\n\n---\n\n`;
        });
        return text;
    }
 
    function triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
 
    // --- КАТЕГОРИЯ: ОСНОВНАЯ ЛОГИКА СБОРА ДАННЫХ ---
    // Функции, отвечающие за идентификацию книги, парсинг страниц и управление коллекцией глав.
    // - getBookId: Извлекает уникальный идентификатор книги из URL.
    // - parseCurrentPage: Анализирует текущую страницу и возвращает ее тип (главная или глава) и данные.
    // - addCurrentChapter: Добавляет текущую главу в коллекцию и сохраняет данные.
    // - generateFile: Координирует процесс генерации файла на основе выбранного формата и диапазона.
    function getBookId() {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        return (pathParts[0] === 'novel' && pathParts.length >= 2) ? pathParts[1] : 'unknown-book';
    }
 
    function parseCurrentPage() {
        const isChapter = !!document.querySelector('.chapter-content-container');
        if (isChapter) {
            const title = document.querySelector('.chapter-title h2')?.textContent.trim() || 'Глава без названия';
            let order = -1;
 
            // --- ИЗМЕНЕНИЕ: Порядок главы определяется по ее URL из кэша оглавления, а не из названия ---
            if (bookCollection.meta && bookCollection.meta.urlToOrderMap) {
                order = bookCollection.meta.urlToOrderMap[window.location.pathname] || -1;
            }
 
            const contentNode = document.querySelector('.chapter-content-container');
            const content = reformatToParagraphs(contentNode);
            return { isChapter: true, data: { title, content, order, url: window.location.pathname } };
        } else {
            const title = document.querySelector('.novel-title h1')?.textContent.trim() || 'Без названия';
            const author = document.querySelector('.novel-author .content')?.textContent.trim() || 'Автор не указан';
            const annotationNode = document.querySelector('#synopsis .content');
            const annotation = annotationNode ? Array.from(annotationNode.querySelectorAll('p')).map(p => p.textContent.trim()) : [];
            const genres = Array.from(document.querySelectorAll('.genre-info .items span')).map(el => el.textContent.trim());
            const tags = Array.from(document.querySelectorAll('.tag-info .items span')).map(el => el.textContent.trim());
            const tocTab = document.querySelector('#tab-toc');
            let totalChapters = 0;
            if (tocTab) {
                const match = tocTab.textContent.match(/\((\d+)\)/);
                if (match) totalChapters = parseInt(match[1], 10);
            }
            return { isMainPage: true, data: { title, author, annotation, genres, tags, totalChapters } };
        }
    }
 
    async function addCurrentChapter() {
        const pageData = parseCurrentPage();
        if (!pageData.isChapter || pageData.data.order === -1) {
            showTemporaryStatus('Невозможно добавить: не страница главы.');
            console.error('addCurrentChapter called on a non-chapter page or chapter order not found.');
            return false;
        }
 
        const chapter = pageData.data;
 
        if (bookCollection.chapters.some(ch => ch.order === chapter.order)) {
            showTemporaryStatus('Эта глава уже в сборнике.');
            return true;
        }
 
        setState(State.WORKING, `Добавление главы ${chapter.order}...`);
        bookCollection.chapters.push(chapter);
        await GM_setValue(getBookId(), JSON.stringify(bookCollection));
 
        // --- ИЗМЕНЕНИЕ: Возвращаем временный статус и обновляем только выпадающие списки ---
        showTemporaryStatus(`Глава ${chapter.order} добавлена в сборник.`); // Показывает временный статус
        populateChapterDropdowns(); // Обновляет выпадающие списки глав
 
        if (!isMining) {
            setState(State.IDLE);
        }
        
        return true;
    }
 
     async function generateFile(format, startOrder, endOrder) {
        if (currentState !== State.IDLE) return;
 
        const simplifiedMode = ui.querySelector('#parser-simplified-mode-toggle').checked;
        startOrder = parseInt(startOrder, 10);
        endOrder = parseInt(endOrder, 10);
 
        if (isNaN(startOrder) || isNaN(endOrder) || startOrder > endOrder) {
            await showInteractiveNotification('Неверный диапазон глав.', [{ text: 'OK', value: true }]);
            return;
        }
 
        const chaptersToProcess = bookCollection.chapters.filter(ch => ch.order >= startOrder && ch.order <= endOrder);
 
        if (chaptersToProcess.length === 0) {
            await showInteractiveNotification('В выбранном диапазоне нет собранных глав.', [{ text: 'OK', value: true }]);
            return;
        }
 
        setState(State.WORKING, 'Генерация файла...');
        let fileContent, fileName, mimeType;
        const sanitizedTitle = (bookCollection.meta.title || 'novel').replace(/[^a-z0-9а-яё\s]/gi, '').replace(/\s+/g, '_');
 
        if (format === 'fb2') {
            if (simplifiedMode) {
                fileContent = generateFb2SectionsOnly(chaptersToProcess);
                fileName = `${sanitizedTitle}_главы_${startOrder}-${endOrder}_(секции).fb2`;
            } else {
                fileContent = generateFb2(chaptersToProcess);
                fileName = `${sanitizedTitle}_главы_${startOrder}-${endOrder}.fb2`;
            }
            mimeType = 'application/xml;charset=utf-8';
        } else { // txt
            if (simplifiedMode) {
                fileContent = generateTxtSectionsOnly(chaptersToProcess);
                fileName = `${sanitizedTitle}_главы_${startOrder}-${endOrder}_(упрощенный).txt`;
            } else {
                fileContent = generateTxt(chaptersToProcess);
                fileName = `${sanitizedTitle}_главы_${startOrder}-${endOrder}.txt`;
            }
            mimeType = 'text/plain;charset=utf-8';
        }
 
        const blob = new Blob([fileContent], { type: mimeType });
        triggerDownload(blob, fileName);
 
        setTimeout(() => {
            setState(State.IDLE);
            updateUI(false);
        }, 500);
    }
 
    // --- КАТЕГОРИЯ: УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЬСКИМ ИНТЕРФЕЙСОМ (UI) ---
    // Набор функций для создания, обновления и взаимодействия с интерфейсом скрипта.
    // - showInteractiveNotification: Показывает модальное окно с сообщением и кнопками.
    // - showTemporaryStatus: Отображает временное сообщение в строке статуса.
    // - createUI: Создает и добавляет на страницу HTML-структуру интерфейса.
    // - attachEventListeners: Назначает обработчики событий для элементов UI.
    // - setState: Управляет состоянием интерфейса (блокировка/разблокировка элементов).
    // - updateUI: Обновляет информацию в UI в соответствии с текущими данными.
    // - createRangeString: Форматирует массив чисел в строку диапазонов (напр., "1-5, 8, 10-12").
    // - updateChapterStatusDisplay: Обновляет строку статуса с информацией о собранных главах.
    // - populateChapterDropdowns: Заполняет выпадающие списки для выбора диапазона глав.
    // - makeDraggable: Делает окно скрипта перетаскиваемым.
    // - addStyles: Добавляет CSS-стили для интерфейса.
    function showInteractiveNotification(message, buttons) {
        return new Promise(resolve => {
            const mainView = ui.querySelector('#parser-main-controls');
            const notificationView = ui.querySelector('#parser-notification-view');
            const notificationText = ui.querySelector('#parser-notification-text');
            const notificationActions = ui.querySelector('#parser-notification-actions');
 
            notificationText.innerHTML = message;
            notificationActions.innerHTML = '';
 
            buttons.forEach(btnInfo => {
                const btn = document.createElement('button');
                btn.textContent = btnInfo.text;
                btn.onclick = () => {
                    notificationView.classList.add('hidden');
                    mainView.classList.remove('hidden');
                    resolve(btnInfo.value);
                };
                notificationActions.appendChild(btn);
            });
 
            mainView.classList.add('hidden');
            notificationView.classList.remove('hidden');
        });
    }
 
    function showTemporaryStatus(message) {
        const statusEl = ui.querySelector('#parser-status');
        if (!message) {
            updateChapterStatusDisplay();
        } else {
            statusEl.innerHTML = `<span class="temp-status">${message}</span>`;
            setTimeout(() => {
                if (statusEl.querySelector('.temp-status')) {
                    updateChapterStatusDisplay();
                }
            }, 2000);
        }
    }
 
    function createUI() {
        ui = document.createElement('div');
        ui.id = 'nb-parser-ui';
        ui.innerHTML = `
            <div class="parser-header">
                <h2>Сборщик Новеллы</h2>
                <div class="header-controls">
                    <button id="parser-minimize-btn" title="Свернуть">-</button>
                    <button id="parser-hide-btn" title="Скрыть">_</button>
                </div>
            </div>
            <div class="parser-body">
                <div id="parser-waiting-view">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <p>Ожидание открытия произведения</p>
                </div>
                <div id="parser-main-controls" class="hidden">
                    <div id="parser-info"></div>
                    <div id="parser-status"></div>
                    <div class="parser-toggle">
                        <div class="label-and-manual-add">
                            <button id="parser-add-current-btn" title="Добавить текущую главу">+</button>
                            <label for="parser-auto-add-toggle">Авто-добавление</label>
                        </div>
                        <div class="auto-controls">
                           <button id="parser-auto-mine-btn" title="Умный автосбор глав (начинает с первой пропущенной)">
                               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                   <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 6 5.5V5a2.5 2.5 0 0 1 2.5-2.5h1Z"></path>
                                   <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 18 5.5V5a2.5 2.5 0 0 0-2.5-2.5h-1Z"></path>
                                   <path d="M6 10a2.5 2.5 0 0 1 2.5 2.5v1A2.5 2.5 0 0 1 6 16H5a2.5 2.5 0 0 1-2.5-2.5v-1A2.5 2.5 0 0 1 5 10h1Z"></path>
                                   <path d="M18 10a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-2.5-2.5h-1Z"></path>
                                   <path d="M12 15a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-2.5 2.5h-1a2.5 2.5 0 0 1-2.5-2.5v-1a2.5 2.5 0 0 1 2.5-2.5h1Z"></path>
                               </svg>
                            </button>
                            <label class="switch"><input type="checkbox" id="parser-auto-add-toggle"><span class="slider round"></span></label>
                        </div>
                    </div>
                     <div class="parser-toggle">
                        <label for="parser-simplified-mode-toggle">Упрощенный режим</label>
                        <label class="switch"><input type="checkbox" id="parser-simplified-mode-toggle"><span class="slider round"></span></label>
                    </div>
                    <div class="parser-actions">
                        <div class="download-control">
                            <div class="select-group">
                                <label>От:</label><select id="from-select"></select>
                                <label>До:</label><select id="to-select"></select>
                            </div>
                            <div class="button-group">
                                <button id="parser-download-fb2">Скачать FB2</button>
                                <button id="parser-download-txt">Скачать TXT</button>
                            </div>
                        </div>
                        <button id="parser-clear-collection">Очистить сборник</button>
                    </div>
                    <div id="parser-process-status" class="hidden">
                        <div class="spinner"></div>
                        <span id="parser-process-text"></span>
                    </div>
                </div>
                <div id="parser-notification-view" class="hidden">
                    <p id="parser-notification-text"></p>
                    <div id="parser-notification-actions"></div>
                </div>
            </div>`;
        document.body.appendChild(ui);
 
        const showBtn = document.createElement('div');
        showBtn.id = 'nb-parser-show-btn';
        showBtn.className = 'hidden';
        showBtn.title = 'Показать сборщик';
        document.body.appendChild(showBtn);
 
        makeDraggable(ui.querySelector('.parser-header'));
        attachEventListeners();
    }
 
    async function attachEventListeners() {
        const showBtn = document.getElementById('nb-parser-show-btn');
 
        ui.querySelector('#parser-minimize-btn').addEventListener('click', () => {
            ui.classList.toggle('minimized');
        });
 
        ui.querySelector('#parser-hide-btn').addEventListener('click', () => {
            ui.classList.add('hidden-completely');
            showBtn.classList.remove('hidden');
        });
 
        showBtn.addEventListener('click', () => {
            ui.classList.remove('hidden-completely');
            showBtn.classList.add('hidden');
        });
        
        const autoAddToggle = ui.querySelector('#parser-auto-add-toggle');
        autoAddToggle.addEventListener('change', async e => {
            const isChecked = e.target.checked;
            await GM_setValue('autoAddMode', isChecked);
            ui.querySelector('#parser-add-current-btn').classList.toggle('hidden', isChecked);
        });
 
        ui.querySelector('#parser-add-current-btn').addEventListener('click', addCurrentChapter);
        
        ui.querySelector('#parser-simplified-mode-toggle').addEventListener('change', async e => await GM_setValue('simplifiedMode', e.target.checked));
        ui.querySelector('#parser-auto-mine-btn').addEventListener('click', toggleAutoMine);
 
        ui.querySelector('#parser-download-fb2').addEventListener('click', () => {
            const start = ui.querySelector('#from-select').value;
            const end = ui.querySelector('#to-select').value;
            generateFile('fb2', start, end);
        });
        ui.querySelector('#parser-download-txt').addEventListener('click', () => {
             const start = ui.querySelector('#from-select').value;
             const end = ui.querySelector('#to-select').value;
             generateFile('txt', start, end);
        });
        ui.querySelector('#parser-clear-collection').addEventListener('click', async () => {
            const confirmation = await showInteractiveNotification(
                'Вы уверены, что хотите удалить все собранные главы для этой книги?',
                [{ text: 'Да', value: true }, { text: 'Отмена', value: false }]
            );
            if (confirmation) {
                setState(State.WORKING, 'Очистка сборника...');
                await GM_deleteValue(getBookId());
                bookCollection.chapters = [];
                if (bookCollection.meta) bookCollection.meta.toc = {};
                setTimeout(() => {
                    setState(State.IDLE);
                    updateUI(true);
                }, 500);
            }
        });
    }
 
    function setState(newState, message = '') {
        currentState = newState;
        const controlsToDisable = ui.querySelectorAll(
            '#parser-auto-add-toggle, #parser-simplified-mode-toggle, #from-select, #to-select, #parser-download-fb2, #parser-download-txt, #parser-clear-collection, #parser-add-current-btn'
        );
        controlsToDisable.forEach(el => el.disabled = (newState !== State.IDLE));
 
        const processStatus = ui.querySelector('#parser-process-status');
        const processText = ui.querySelector('#parser-process-text');
 
        if (newState === State.WORKING || newState === State.MINING) {
            processText.textContent = message || 'Обработка...';
            processStatus.classList.remove('hidden');
        } else {
            processStatus.classList.add('hidden');
        }
    }
 
    function updateUI(resetRange = false) {
        if (!ui) return;
        ui.querySelector('#parser-info').textContent = bookCollection.meta?.title || 'Информация о книге не найдена';
        updateChapterStatusDisplay();
        populateChapterDropdowns(resetRange ? parseCurrentPage() : null);
    }
 
    function createRangeString(numbersArray) {
        if (numbersArray.length === 0) return '';
        const sorted = [...new Set(numbersArray)].sort((a, b) => a - b);
        const ranges = [];
        if (sorted.length === 0) return '';
 
        let startRange = sorted[0];
        let endRange = sorted[0];
 
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === endRange + 1) {
                endRange = sorted[i];
            } else {
                ranges.push(startRange === endRange ? `${startRange}` : `${startRange}-${endRange}`);
                startRange = sorted[i];
                endRange = sorted[i];
            }
        }
        ranges.push(startRange === endRange ? `${startRange}` : `${startRange}-${endRange}`);
        return ranges.join(', ');
    }
 
    function updateChapterStatusDisplay() {
        const statusEl = ui.querySelector('#parser-status');
        const total = bookCollection.meta.totalChapters || 0;
        const collectedOrders = new Set(bookCollection.chapters.map(ch => ch.order));
 
        if (collectedOrders.size === 0) {
            statusEl.innerHTML = `Собрано: 0 из ${total}`;
            return;
        }
 
        const collectedNumbers = Array.from(collectedOrders);
        const missingNumbers = [];
        if (total > 0 && collectedNumbers.length > 0) {
            const maxCollected = Math.max(...collectedNumbers);
            for (let i = 1; i <= Math.min(total, maxCollected); i++) {
                if (!collectedOrders.has(i)) {
                    missingNumbers.push(i);
                }
            }
        }
 
        const rangeStr = createRangeString(collectedNumbers);
        const missingStr = missingNumbers.length > 0 ? ` (Пропущено: ${createRangeString(missingNumbers)})` : '';
        statusEl.innerHTML = `Собрано глав: ${collectedOrders.size} из ${total}. Диапазоны: ${rangeStr} <span class="missing-count">${missingStr}</span>`;
    }
 
    function populateChapterDropdowns(pageDataToSet) {
        const total = bookCollection.meta.totalChapters || 0;
        const fromSelect = ui.querySelector('#from-select');
        const toSelect = ui.querySelector('#to-select');
 
        if (total === 0) {
            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';
            return;
        }
 
        const collectedChapters = new Map(bookCollection.chapters.map(ch => [ch.order, ch.title]));
        const currentFrom = fromSelect.value;
        const currentTo = toSelect.value;
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
 
        for (let i = 1; i <= total; i++) {
            const option = document.createElement('option');
            option.value = i;
            const chapterTitle = collectedChapters.get(i);
            if (chapterTitle) {
                option.textContent = `Гл. ${i}: ${chapterTitle}`;
                option.classList.add('collected');
            } else {
                option.textContent = `Глава ${i} (не собрана)`;
                option.classList.add('not-collected');
            }
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        }
 
        if (pageDataToSet) {
            let defaultFrom = '1';
            let defaultTo = String(total);
            if (pageDataToSet.isChapter && pageDataToSet.data.order > 0) {
                defaultFrom = String(pageDataToSet.data.order);
                defaultTo = String(pageDataToSet.data.order);
            } else {
                const collectedOrders = Array.from(collectedChapters.keys()).sort((a, b) => a - b);
                if (collectedOrders.length > 0) {
                    let longestStart = collectedOrders[0];
                    let longestLength = 0;
                    let currentStart = collectedOrders[0];
                    let currentLength = 1;
 
                    for (let i = 1; i < collectedOrders.length; i++) {
                        if (collectedOrders[i] === collectedOrders[i - 1] + 1) {
                            currentLength++;
                        } else {
                            if (currentLength > longestLength) {
                                longestLength = currentLength;
                                longestStart = currentStart;
                            }
                            currentStart = collectedOrders[i];
                            currentLength = 1;
                        }
                    }
                     if (currentLength > longestLength) {
                        longestLength = currentLength;
                        longestStart = currentStart;
                    }
                    defaultFrom = String(longestStart);
                    defaultTo = String(longestStart + longestLength - 1);
                }
            }
            fromSelect.value = defaultFrom;
            toSelect.value = defaultTo;
        } else {
            if (currentFrom && fromSelect.querySelector(`option[value="${currentFrom}"]`)) fromSelect.value = currentFrom;
            else fromSelect.value = '1';
            if (currentTo && toSelect.querySelector(`option[value="${currentTo}"]`)) toSelect.value = currentTo;
            else toSelect.value = String(total);
        }
    }
 
    function makeDraggable(header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = e => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = ev => {
                ev.preventDefault(); pos1 = pos3 - ev.clientX; pos2 = pos4 - ev.clientY;
                pos3 = ev.clientX; pos4 = ev.clientY;
                ui.style.top = `${ui.offsetTop - pos2}px`; ui.style.left = `${ui.offsetLeft - pos1}px`;
            };
        };
    }
 
    function addStyles() {
        GM_addStyle(`
            .hidden { display: none !important; }
            #nb-parser-ui { position: fixed; top: 40px; right: 20px; width: 340px; z-index: 2147483647; background: #222730; color: #cdd3da; border: 1px solid #444c56; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-shadow: 0 8px 25px rgba(0,0,0,0.6); user-select: none; }
            .parser-header { padding: 10px 15px; background: #2d333b; border-bottom: 1px solid #444c56; border-radius: 10px 10px 0 0; cursor: move; text-align: center; }
            .parser-header h2 { margin: 0; font-size: 16px; font-weight: 600; color: #adbac7;}
            .header-controls { position: absolute; top: 8px; right: 10px; display: flex; gap: 5px; }
            .header-controls button { background: none; border: 1px solid #444c56; border-radius: 5px; color: #768390; font-size: 16px; font-weight: bold; cursor: pointer; line-height: 1; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; padding-bottom: 3px; }
            .header-controls button:hover { color: #fff; background-color: #373e47; }
            .parser-body { padding: 15px; }
            #nb-parser-ui.minimized .parser-body { display: none; }
            #nb-parser-ui.hidden-completely { display: none !important; }
            #nb-parser-show-btn { position: fixed; top: 40px; right: 20px; width: 30px; height: 30px; background: #2d333b; border: 1px solid #444c56; border-radius: 5px; z-index: 2147483647; cursor: pointer; transition: background-color 0.2s; }
            #nb-parser-show-btn:hover { background-color: #373e47; }
            #nb-parser-show-btn::after { content: '📖'; font-size: 16px; display: flex; align-items: center; justify-content: center; height: 100%; color: #cdd3da; }
            #parser-info { font-weight: bold; text-align: center; margin-bottom: 5px; color: #fff; }
            #parser-status { font-size: 12px; text-align: center; color: #768390; margin-bottom: 15px; min-height: 1.2em; }
            #parser-status .missing-count { color: #e37c7c; }
            #parser-status .temp-status { color: #76a9fa; font-style: italic; }
            #parser-waiting-view { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; color: #768390; }
            #parser-waiting-view svg { margin-bottom: 15px; animation: book-pulse 2.5s infinite ease-in-out; }
            #parser-waiting-view p { font-size: 14px; font-weight: 500; margin: 0; }
            @keyframes book-pulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }
            #parser-notification-view { text-align: center; }
            #parser-notification-text { font-size: 14px; margin-bottom: 20px; }
            #parser-notification-actions { display: flex; gap: 15px; justify-content: center; }
            #parser-notification-actions button { padding: 8px 16px; border: 1px solid #444c56; border-radius: 5px; background-color: #373e47; color: #cdd3da; cursor: pointer; }
            .parser-toggle { display: flex; justify-content: space-between; align-items: center; background-color: #2d333b; padding: 10px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #444c56;}
            .parser-toggle label { font-size: 14px; font-weight: 500; }
            .label-and-manual-add { display: flex; align-items: center; gap: 10px; }
            #parser-add-current-btn { background-color: #373e47; border: 1px solid #444c56; border-radius: 50%; color: #cdd3da; cursor: pointer; font-size: 20px; font-weight: bold; width: 26px; height: 26px; line-height: 24px; padding: 0; text-align: center; transition: background-color 0.2s, color 0.2s; flex-shrink: 0; }
            #parser-add-current-btn:hover:not(:disabled) { background-color: #444c56; }
            .auto-controls { display: flex; align-items: center; gap: 10px; }
            .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444c56; transition: .4s; border-radius: 28px; }
            .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #2f65c8; }
            input:focus + .slider { box-shadow: 0 0 1px #2f65c8; }
            input:checked + .slider:before { transform: translateX(22px); }
            #parser-auto-mine-btn { background-color: #373e47; border: 1px solid #444c56; border-radius: 6px; cursor: pointer; padding: 4px; line-height: 0; transition: background-color 0.2s, border-color 0.2s; }
            #parser-auto-mine-btn svg { color: #cdd3da; transition: transform 0.5s; }
            #parser-auto-mine-btn:hover:not(:disabled) { background-color: #444c56; }
            #parser-auto-mine-btn.active { background-color: #2f65c8; border-color: #487ee7; }
            #parser-auto-mine-btn.active:hover:not(:disabled) { background-color: #3a71d1; }
            #parser-auto-mine-btn.active svg { animation: spin 2s linear infinite; }
            .parser-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
            .parser-actions button { padding: 12px; border: 1px solid #444c56; border-radius: 6px; color: #cdd3da; background-color: #373e47; cursor: pointer; font-weight: 500; font-size: 14px; text-align: center; transition: background-color 0.2s, border-color 0.2s; }
            .parser-actions button:hover:not(:disabled) { background-color: #444c56; border-color: #555e68; }
            #parser-process-status { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background-color: #2d333b; border-radius: 6px; margin-top: 15px; border: 1px solid #444c56; }
            .spinner { width: 16px; height: 16px; border: 2px solid #768390; border-top-color: #cdd3da; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            #parser-process-text { font-size: 13px; color: #adbac7; }
            .download-control { background: #2d333b; padding: 10px; border-radius: 6px; border: 1px solid #444c56; }
            .select-group { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 5px; }
            .select-group label { font-size: 13px; color: #768390; flex-shrink: 0; }
            .select-group select { flex-grow: 1; background: #222730; color: #cdd3da; border: 1px solid #444c56; border-radius: 4px; padding: 5px; font-size: 12px; width: 100%; text-overflow: ellipsis; }
            .button-group { display: flex; gap: 10px; }
            .button-group button { flex: 1; margin-top: 5px; padding: 10px 5px; font-size: 13px; }
            .button-group #parser-download-fb2, .button-group #parser-download-txt { background-color: #347d39; border-color: #46954a; color: #fff; }
            #parser-clear-collection { background-color: #b73e36; border-color: #cf564e; color: #fff; }
            select option.collected { color: #6ee7b7; font-weight: bold; }
            select option.not-collected { color: #9ca3af; }
            button:disabled, input:disabled, select:disabled { background-color: #2d333b !important; color: #768390 !important; cursor: not-allowed !important; border-color: #444c56 !important; opacity: 0.6; }
            input:disabled + .slider { cursor: not-allowed !important; background-color: #2d333b !important; }
        `);
    }
 
    // --- КАТЕГОРИЯ: ЛОГИКА АВТОСБОРА ("УМНЫЙ" СБОР) ---
    // Функции, отвечающие за автоматический сбор пропущенных глав.
    // - cacheTableOfContents: Сканирует оглавление на главной странице и сохраняет URL-адреса глав.
    // - toggleAutoMine: Запускает или останавливает процесс автосбора, сохраняя его состояние.
    // - mineNextChapter: Определяет следующую пропущенную главу и инициирует переход на нее.
    async function cacheTableOfContents() {
        const chapterLinks = document.querySelectorAll('#pane-toc .list-wrapper .items a.chapter');
        if (chapterLinks.length === 0) {
            console.log("FictionZone Collector: ToC links not found on this page.");
            return false;
        }
 
        const toc = {};
        const urlToOrderMap = {};
        chapterLinks.forEach((link, index) => {
            const order = index + 1; // Позиционный порядок, начиная с 1
            const url = link.getAttribute('href');
            const title = link.querySelector('.chapter-title')?.textContent.trim();
            
            if (url && title) {
                toc[order] = { url, title };
                urlToOrderMap[url] = order;
            }
        });
 
        if (Object.keys(toc).length > 0) {
            bookCollection.meta.toc = toc;
            bookCollection.meta.urlToOrderMap = urlToOrderMap; // Сохраняем карту URL -> Порядок
            await GM_setValue(getBookId(), JSON.stringify(bookCollection));
            console.log(`FictionZone Collector: Оглавление на ${Object.keys(toc).length} глав кэшировано по их позиции.`);
            return true;
        }
        return false;
    }
 
    async function toggleAutoMine() {
        const mineBtn = ui.querySelector('#parser-auto-mine-btn');
        const bookId = getBookId();
        const currentMiningState = await GM_getValue('isMining_' + bookId, false);
 
        if (currentMiningState) { // --- ОСТАНОВКА ---
            await GM_setValue('isMining_' + bookId, false);
            isMining = false;
            clearTimeout(autoMineLoopTimeout);
            mineBtn.classList.remove('active');
            // Принудительно сбрасываем состояние в IDLE, чтобы разблокировать интерфейс,
            // даже если в данный момент идет процесс добавления главы (состояние WORKING).
            if (currentState === State.MINING || currentState === State.WORKING) {
                setState(State.IDLE);
            }
            showTemporaryStatus('Автосбор остановлен.');
        } else { // --- ЗАПУСК ---
            if (currentState === State.WORKING) {
                showTemporaryStatus('Подождите завершения текущей операции.');
                return;
            }
            await GM_setValue('isMining_' + bookId, true);
            isMining = true;
            mineBtn.classList.add('active');
            showTemporaryStatus('Автосбор запущен...');
            mineNextChapter();
        }
    }
 
    function mineNextChapter() {
        if (!isMining) {
            setState(State.IDLE);
            return;
        }
 
        const mineBtn = ui.querySelector('#parser-auto-mine-btn');
        // Общее количество глав берем из кэша оглавления, если он есть - это надежнее
        const totalChapters = bookCollection.meta.toc ? Object.keys(bookCollection.meta.toc).length : (bookCollection.meta.totalChapters || 0);
 
        if (totalChapters === 0) {
            showTemporaryStatus('Нет данных о главах. Перехожу на главную...');
            const bookId = getBookId();
            // Переходим на главную, только если мы еще не там
            if (!window.location.pathname.startsWith(`/novel/${bookId}`) || window.location.pathname.includes('/chapter-')) {
                 window.location.href = `/novel/${bookId}`;
            }
            return;
        }
 
        const collectedOrders = new Set(bookCollection.chapters.map(ch => ch.order));
        let nextChapterToMine = -1;
 
        for (let i = 1; i <= totalChapters; i++) {
            if (!collectedOrders.has(i)) {
                nextChapterToMine = i;
                break;
            }
        }
 
        if (nextChapterToMine === -1) {
            showTemporaryStatus('Все главы собраны! Автосбор завершен.');
            isMining = false;
            mineBtn.classList.remove('active');
            GM_setValue('isMining_' + getBookId(), false); // Cброс состояния
            setState(State.IDLE);
            return;
        }
 
        setState(State.MINING, `Поиск главы ${nextChapterToMine}...`);
 
        // --- ИЗМЕНЕНИЕ: Навигация теперь всегда основана на кэше оглавления ---
        if (bookCollection.meta.toc && bookCollection.meta.toc[nextChapterToMine]) {
            const targetUrl = bookCollection.meta.toc[nextChapterToMine].url;
            if (window.location.pathname !== targetUrl) {
                window.location.href = new URL(targetUrl, window.location.origin).href;
            }
            return;
        } else {
            // Если главы нет в кэше, значит он устарел или неполный. Нужно перейти на главную для обновления.
            const mainPageUrl = `/novel/${getBookId()}`;
            if (window.location.pathname !== mainPageUrl) {
                showTemporaryStatus(`Глава ${nextChapterToMine} не в кэше. Обновляю оглавление...`);
                window.location.href = mainPageUrl;
            } else {
                // Если мы уже на главной, но главу найти не можем, значит, проблема (например, сменилась структура сайта).
                showTemporaryStatus(`Не удалось найти главу ${nextChapterToMine} после обновления. Автосбор остановлен.`);
                isMining = false;
                mineBtn.classList.remove('active');
                GM_setValue('isMining_' + getBookId(), false);
                setState(State.IDLE);
            }
        }
    }
 
    // --- КАТЕГОРИЯ: УПРАВЛЕНИЕ НАВИГАЦИЕЙ И ЖИЗНЕННЫМ ЦИКЛОМ ---
    // Основная функция, реагирующая на изменения URL и координирующая действия скрипта.
    // - handlePageUpdate: Вызывается при каждой смене страницы. Загружает данные, обновляет UI, запускает автосбор или авто-добавление.
    async function handlePageUpdate() {
        if (window.location.href === lastCheckedUrl) return;
        lastCheckedUrl = window.location.href;
        console.log("FictionZone Collector: URL изменился, перепроверка страницы.");
 
        const bookId = getBookId();
        const mainControls = ui.querySelector('#parser-main-controls');
        const waitingView = ui.querySelector('#parser-waiting-view');
        const titleElement = ui.querySelector('.parser-header h2');
 
        if (bookId === 'unknown-book') {
            mainControls.classList.add('hidden');
            waitingView.classList.remove('hidden');
            titleElement.textContent = 'Ожидание открытия произведения';
            if (currentState !== State.IDLE) {
                setState(State.IDLE);
            }
            return;
        }
 
        mainControls.classList.remove('hidden');
        waitingView.classList.add('hidden');
        titleElement.textContent = 'Сборщик Новеллы';
 
        isMining = await GM_getValue('isMining_' + bookId, false);
        ui.querySelector('#parser-auto-mine-btn').classList.toggle('active', isMining);
 
        const collectionData = await GM_getValue(bookId, null);
        bookCollection = collectionData ? JSON.parse(collectionData) : { meta: {}, chapters: [] };
        if (!bookCollection.meta) bookCollection.meta = {};
 
        const pageData = parseCurrentPage();
 
        if (pageData.isChapter && !bookCollection.meta.title) {
            console.log("FictionZone Collector: Book metadata is missing. Redirecting to main novel page to fetch it.");
            showTemporaryStatus('Получение данных о книге...');
            window.location.href = `/novel/${bookId}`;
            return;
        }
 
        if (pageData.isMainPage) {
            const newMeta = pageData.data;
            let metaChanged = false;
            const coreMeta = (({ toc, ...o }) => o)(bookCollection.meta);
            if (JSON.stringify(pageData.data) !== JSON.stringify(coreMeta)) {
                const existingToc = bookCollection.meta.toc;
                bookCollection.meta = newMeta;
                if (existingToc) bookCollection.meta.toc = existingToc;
                metaChanged = true;
            }
 
            const tocUpdated = await cacheTableOfContents();
            if (metaChanged && !tocUpdated) {
                await GM_setValue(bookId, JSON.stringify(bookCollection));
            }
        }
 
        updateUI(true);
 
        const autoAddMode = await GM_getValue('autoAddMode', false);
 
        // --- ИЗМЕНЕНИЕ: Логика перехода на следующую главу сделана адаптивной ---
        // Теперь, если включен автосбор, переход происходит сразу после добавления главы.
        if ((autoAddMode || isMining) && pageData.isChapter) {
             const added = await addCurrentChapter();
             if (isMining && added) {
                 // Успешно добавили главу, немедленно переходим к следующей
                 clearTimeout(autoMineLoopTimeout);
                 mineNextChapter(); // Вызов без задержки
                 return; // Прерываем, так как инициирован переход на другую страницу
             }
        }
 
        if (isMining) {
            // Этот блок сработает, только если мы не на странице главы (из-за return выше)
            // Оставим здесь небольшую задержку для ориентации пользователя при старте
            clearTimeout(autoMineLoopTimeout);
            autoMineLoopTimeout = setTimeout(mineNextChapter, 1000);
        }
    }
 
    // --- КАТЕГОРИЯ: ИНИЦИАЛИЗАЦИЯ СКРИПТА ---
    // Функции, отвечающие за первоначальный запуск скрипта на странице.
    // - initialize: Главная функция инициализации. Создает UI, стили, загружает настройки и запускает MutationObserver для отслеживания навигации.
    async function initialize() {
        if (document.getElementById('nb-parser-ui')) return;
 
        createUI();
        addStyles();
 
        const autoAddToggle = ui.querySelector('#parser-auto-add-toggle');
        const autoAddMode = await GM_getValue('autoAddMode', false);
        autoAddToggle.checked = autoAddMode;
        ui.querySelector('#parser-add-current-btn').classList.toggle('hidden', autoAddMode);
        
        const simplifiedModeToggle = ui.querySelector('#parser-simplified-mode-toggle');
        simplifiedModeToggle.checked = await GM_getValue('simplifiedMode', false);
 
        await handlePageUpdate();
 
        const observer = new MutationObserver(() => {
            clearTimeout(navigationDebounceTimer);
            // --- ИЗМЕНЕНИЕ: Задержка уменьшена с 500 до 150 мс для более быстрого отклика ---
            // если слишком малое значение, ajax обновление страницы произведения с другой страницы. не загружает метаданные произведения
            navigationDebounceTimer = setTimeout(handlePageUpdate, 500);
        });
 
        const targetNode = document.getElementById('__nuxt');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }
 
    // --- ТОЧКА ВХОДА ---
    // Запускает инициализацию скрипта после полной загрузки страницы.
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();