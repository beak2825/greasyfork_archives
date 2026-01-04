// ==UserScript==
// @name         Парсер ранобэ.рф — FB2 & TXT
// @version      0.121
// @description  Парсер текста форматах FB2 и TXT с страницы сайта ранобэ.рф в форматах FB2 и TXT
// @match        https://xn--80ac9aeh6f.xn--p1ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      xn--80ac9aeh6f.xn--p1ai
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552338/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20%D1%80%D0%B0%D0%BD%D0%BE%D0%B1%D1%8D%D1%80%D1%84%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552338/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20%D1%80%D0%B0%D0%BD%D0%BE%D0%B1%D1%8D%D1%80%D1%84%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- State Management ---
    const State = {
        IDLE: 'IDLE', // Ожидание
        PENDING_INIT: 'PENDING_INIT', // Ожидание инициализации
        INITIALIZING: 'INITIALIZING', // Получение списка глав
        PROCESSING: 'PROCESSING', // Скачивание глав
        GENERATING: 'GENERATING', // Создание файла
        STOPPED: 'STOPPED', // Остановлено пользователем
    };
 
    let currentState = State.PENDING_INIT;
    let stopProcessing = false;
 
    // --- Core Variables ---
    let book = {
        url: '',
        title: 'Без названия',
        author: 'Неизвестен',
        annotation: 'Аннотация отсутствует.',
        chapters: [],
        genres: [],
        sequenceName: null,
        coverImageUrl: null,
        publishedDate: null,
        country: 'Неизвестна',
    };
 
    // --- UI Elements ---
    let ui, startChapterSelect, endChapterSelect, progressBar, progressText,
        downloadFb2Btn, downloadTxtBtn, stopBtn, delayInput, cleanTextCheckbox,
        sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn, initializeBtn,
        mainControlsContainer, footerContainer;
 
    // --- Helper Functions ---
    /**
     * Fetches a resource and returns its content.
     * @param {string} url - The URL to fetch.
     * @param {string} responseType - The expected response type (e.g., 'text', 'arraybuffer').
     * @returns {Promise<Document|ArrayBuffer>}
     */
    function fetchResource(url, responseType = 'text') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: responseType === 'arraybuffer' ? 'arraybuffer' : undefined,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        if (responseType === 'text') {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            resolve(doc);
                        } else {
                            resolve(response.response);
                        }
                    } else {
                        reject(new Error(`HTTP error! Status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Network error: ${error.details}`));
                }
            });
        });
    }
 
    /**
     * Fetches an image and converts it to a Base64 string.
     * @param {string} url - The URL of the image.
     * @returns {Promise<string|null>} Base64 string or null on error.
     */
    function getBase64Image(url) {
        return new Promise((resolve) => {
            if (!url) return resolve(null);
            fetchResource(url, 'arraybuffer')
                .then(arrayBuffer => {
                    const blob = new Blob([arrayBuffer]);
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = () => resolve(null);
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.error("Ошибка загрузки обложки:", error);
                    resolve(null);
                });
        });
    }
 
 
    /**
     * Updates the UI based on the current state.
     * @param {string} newState - The new state to set.
     */
    function setState(newState) {
        currentState = newState;
        const isIdle = newState === State.IDLE;
        const isProcessing = newState === State.PROCESSING;
 
        const isInitialized = newState !== State.PENDING_INIT;
        if (mainControlsContainer) mainControlsContainer.style.display = isInitialized ? 'block' : 'none';
        if (footerContainer) footerContainer.style.display = isInitialized ? 'flex' : 'none';
        if (initializeBtn) initializeBtn.style.display = isInitialized ? 'none' : 'block';
 
        if (downloadFb2Btn) downloadFb2Btn.disabled = !isIdle;
        if (downloadTxtBtn) downloadTxtBtn.disabled = !isIdle;
        if (stopBtn) stopBtn.style.display = isProcessing ? 'block' : 'none';
 
        const controls = [startChapterSelect, endChapterSelect, delayInput, cleanTextCheckbox, sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn];
        controls.forEach(el => {
            if (el) el.disabled = !isIdle;
        });
    }
 
    /**
     * Updates the progress bar and status text.
     * @param {number} current - The current progress value.
     * @param {number} total - The total value for the progress.
     * @param {string} message - The message to display.
     */
    function updateProgress(current, total, message = '') {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message || `Обработка: ${current} из ${total} (${percentage}%)`;
    }
 
    // --- Parsing and Data Extraction ---
    /**
     * Parses the main book page to extract metadata and the complete chapter list.
     * @param {Document} doc - The DOM of the book's main page.
     */
    async function parseBookInfo(doc) {
        // --- Primary Method: Parse __NEXT_DATA__ JSON ---
        const nextDataScript = doc.getElementById('__NEXT_DATA__');
        if (nextDataScript) {
            try {
                const jsonData = JSON.parse(nextDataScript.textContent);
                const bookData = jsonData?.props?.pageProps?.book || jsonData?.props?.pageProps?.chapter?.book;
                const initialChaptersData = jsonData?.props?.pageProps?.initialChapters;
 
                if (bookData) {
                    book.title = bookData.title || book.title;
                    book.author = bookData.author?.name || book.author;
                    book.annotation = bookData.description || book.annotation;
                    book.publishedDate = bookData.publishedAt?.split('T')[0] || book.publishedDate;
                    book.genres = Array.isArray(bookData.genres) ? bookData.genres.map(g => g.title).filter(Boolean) : [];
                    book.sequenceName = bookData.franchise?.title || null;
                    if (bookData.image?.vertical) {
                        book.coverImageUrl = `${window.location.origin}${bookData.image.vertical}`;
                    }
                }
 
                let rawChapters = [];
                let nextUrl = null;
 
                if (initialChaptersData && Array.isArray(initialChaptersData.results)) {
                    rawChapters.push(...initialChaptersData.results);
                    nextUrl = initialChaptersData.next;
                } else if (bookData && Array.isArray(bookData.chapters)) {
                    rawChapters.push(...bookData.chapters);
                }
 
                // --- NEW: Pagination loop to fetch all chapters ---
                let pageCount = 1;
                while (nextUrl) {
                    pageCount++;
                    updateProgress(0, 0, `Получение списка глав... (стр. ${pageCount})`);
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: nextUrl,
                                onload: (res) => {
                                    try {
                                        resolve(JSON.parse(res.responseText));
                                    } catch (e) {
                                        reject(e);
                                    }
                                },
                                onerror: (err) => reject(err),
                            });
                        });
                        if (response?.results) {
                            rawChapters.push(...response.results);
                            nextUrl = response.next;
                        } else {
                            nextUrl = null;
                        }
                    } catch (error) {
                        console.error(`Ошибка при загрузке страницы ${pageCount} глав:`, error);
                        nextUrl = null; // Stop on error
                    }
                }
 
                // --- Process the final list ---
                if (rawChapters.length > 0) {
                    book.chapters = rawChapters.map(ch => ({
                        title: ch.title,
                        url: `${window.location.origin}${ch.url}`
                    })).reverse();
                } else {
                    book.chapters = [];
                }
 
            } catch (e) {
                console.error("Парсер: Ошибка при обработке JSON из __NEXT_DATA__:", e);
            }
        }
 
        // Moved the error check to the end, after all attempts to get chapters
        if (book.chapters.length === 0) {
            throw new Error("Не удалось найти список глав. Структура сайта изменилась.");
        }
 
        // --- Fallback & Additional Info: Parse visible HTML content ---
        const infoLabels = doc.querySelectorAll('div.text-black-0.dark\\:text-grayNormal-200.font-bold');
        infoLabels.forEach(labelEl => {
            const labelText = labelEl.textContent.trim();
            const valueEl = labelEl.nextElementSibling;
            if (valueEl) {
                const valueText = valueEl.textContent.trim();
                if (labelText.startsWith('Автор:') && book.author === 'Неизвестен') {
                    book.author = valueText;
                }
                if (labelText.startsWith('Опубликовано:') && !book.publishedDate) {
                    book.publishedDate = valueText.split('.').reverse().join('-'); // Format DD.MM.YYYY to YYYY-MM-DD
                }
                if (labelText.startsWith('Страна:')) {
                    book.country = valueText;
                }
            }
        });
    }
 
 
    /**
     * Cleans the HTML content of a chapter.
     * @param {HTMLElement} content - The element containing the chapter content.
     * @returns {HTMLElement} - The cleaned element.
     */
    function cleanupHtml(content) {
        const selectorsToRemove = [
            'script', 'style', 'noscript', 'iframe',
            '.yandex-block', '.adsbygoogle', '.likes-block',
            '[id^=yandex_rtb]', 'div[class*="adfox"]'
        ];
        selectorsToRemove.forEach(selector => {
            content.querySelectorAll(selector).forEach(el => el.remove());
        });
        return content;
    }
 
    // --- File Generation ---
    function generateFb2(chaptersData, sectionsOnly = false, base64Cover = null) {
        const today = new Date().toISOString().split('T')[0];
        const sections = chaptersData.map(ch =>
            `<section><title><p>${ch.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p></title>${ch.content}</section>`
        ).join('\n');
 
        if (sectionsOnly) {
            return `<body>\n${sections}\n</body>`;
        }
 
        const safeTitle = book.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeAuthor = book.author.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
 
        // --- Prepare annotation with country info ---
        let finalAnnotation = book.annotation;
        if (book.country && book.country !== 'Неизвестна') {
            finalAnnotation = `<p><b>Страна:</b> ${book.country}</p>${finalAnnotation}`;
        }
 
        // Prepare metadata blocks
        const genreTags = book.genres.map(g => `<genre>${g.toLowerCase()}</genre>`).join('\n        ');
        const sequenceTag = book.sequenceName ? `<sequence name="${book.sequenceName.replace(/"/g, '&quot;')}" />` : '';
        const coverTag = base64Cover ? '<coverpage><image l:href="#cover.jpg"/></coverpage>' : '';
        const dateTag = book.publishedDate ? `<date value="${book.publishedDate}">${book.publishedDate}</date>` : '';
        const binaryCover = base64Cover ? `<binary id="cover.jpg" content-type="image/jpeg">${base64Cover}</binary>` : '';
 
        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        ${genreTags}
        <author><first-name>${safeAuthor}</first-name></author>
        <book-title>${safeTitle}</book-title>
        ${sequenceTag}
        <lang>ru</lang>
        <annotation>${finalAnnotation}</annotation>
        ${coverTag}
        ${dateTag}
    </title-info>
    <document-info>
        <date value="${today}">${today}</date>
        <version>0.12</version>
    </document-info>
</description>
<body>
    ${sections}
</body>
${binaryCover}
</FictionBook>`;
    }
 
 
    function generateTxt(chaptersData) {
        return chaptersData.map(ch => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = ch.content;
            const textContent = Array.from(tempDiv.querySelectorAll('p'))
                .map(p => p.textContent.trim())
                .join('\n');
            return `Глава: ${ch.title}\n\n${textContent}`;
        }).join('\n\n---\n\n');
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
 
 
    // --- Main Logic ---
    async function processChapters(format) {
        if (currentState !== State.IDLE) return;
        setState(State.PROCESSING);
        stopProcessing = false;
 
        const startIdx = parseInt(startChapterSelect.value, 10);
        const endIdx = parseInt(endChapterSelect.value, 10);
        const delay = parseInt(delayInput.value, 10) || 500;
        const shouldClean = cleanTextCheckbox.checked;
        const sectionsOnly = sectionsOnlyCheckbox.checked;
 
        if (startIdx > endIdx) {
            updateProgress(0, 0, "Ошибка: Начальная глава должна быть раньше конечной.");
            setState(State.IDLE);
            return;
        }
 
        const chaptersToProcess = book.chapters.slice(startIdx, endIdx + 1);
        const totalChapters = chaptersToProcess.length;
        const collectedData = [];
 
        for (let i = 0; i < totalChapters; i++) {
            if (stopProcessing) {
                updateProgress(i, totalChapters, `Остановлено. Генерация из ${i} глав...`);
                break;
            }
 
            const chapter = chaptersToProcess[i];
            updateProgress(i + 1, totalChapters, `Загрузка: ${chapter.title}`);
 
            try {
                const doc = await fetchResource(chapter.url, 'text');
                let contentEl = doc.querySelector('.content');
                if (!contentEl) throw new Error("Не найден текст главы.");
 
                if (shouldClean) {
                    contentEl = cleanupHtml(contentEl);
                }
 
                const paragraphs = Array.from(contentEl.querySelectorAll('p, div'))
                    .filter(el => el.textContent.trim().length > 0)
                    .map(el => `<p>${el.innerHTML.trim()}</p>`)
                    .join('');
 
                collectedData.push({
                    title: chapter.title,
                    content: paragraphs
                });
 
            } catch (error) {
                console.error(`Ошибка при загрузке главы "${chapter.title}":`, error);
                updateProgress(i + 1, totalChapters, `Ошибка: ${chapter.title}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
 
            if (i < totalChapters - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
 
        if (collectedData.length === 0) {
            updateProgress(0, 0, "Не удалось скачать ни одной главы.");
            setState(State.IDLE);
            return;
        }
 
        updateProgress(collectedData.length, totalChapters, "Генерация файла...");
        setState(State.GENERATING);
 
        const firstChapter = collectedData[0].title;
        const lastChapter = collectedData[collectedData.length - 1].title;
        const fileName = `${book.title}_(${firstChapter} - ${lastChapter}).${format}`;
        let fileContent, blobType;
        let base64Cover = null;
 
        if (format === 'fb2') {
            if (book.coverImageUrl) {
                updateProgress(collectedData.length, totalChapters, "Загрузка обложки...");
                base64Cover = await getBase64Image(book.coverImageUrl);
                updateProgress(collectedData.length, totalChapters, "Генерация файла FB2...");
            }
            fileContent = generateFb2(collectedData, sectionsOnly, base64Cover);
            blobType = 'application/xml';
        } else {
            fileContent = generateTxt(collectedData);
            blobType = 'text/plain';
        }
 
        const blob = new Blob([fileContent], {
            type: `${blobType};charset=utf-8`
        });
        triggerDownload(blob, fileName);
 
        updateProgress(collectedData.length, totalChapters, "Готово!");
        setTimeout(() => setState(State.IDLE), 2000);
    }
 
 
    // --- UI Creation ---
    function createUI() {
        if (document.getElementById('ranobe-parser-ui')) return;
        ui = document.createElement('div');
        ui.id = 'ranobe-parser-ui';
        ui.innerHTML = `
            <div class="parser-header">
                <h2>Парсер FB2 & TXT</h2>
                <button id="parser-close-btn">&times;</button>
            </div>
            <div class="parser-body">
                <button id="parser-initialize-btn">Инициализировать</button>
                <div id="parser-main-controls">
                    <div class="parser-row">
                        <label>С главы:</label>
                        <select id="parser-start-chapter"></select>
                    </div>
                    <div class="parser-row">
                        <label>По главу:</label>
                        <select id="parser-end-chapter"></select>
                    </div>
                     <div class="parser-row">
                        <label for="parser-delay">Задержка (мс):</label>
                        <input type="number" id="parser-delay" value="500" min="100">
                    </div>
                    <div class="parser-row parser-checkboxes">
                        <label><input type="checkbox" id="parser-clean-text" checked> Очищать текст</label>
                        <label><input type="checkbox" id="parser-sections-only"> Только секции (FB2)</label>
                    </div>
                    <div class="parser-actions">
                        <button id="parser-download-fb2">Скачать FB2</button>
                        <button id="parser-download-txt">Скачать TXT</button>
                    </div>
                </div>
                <div class="parser-progress-container">
                    <div id="parser-progress-bar"></div>
                </div>
                <p id="parser-progress-text">Нажмите "Инициализировать" для начала</p>
                <button id="parser-stop-btn">Остановить и скачать собранное</button>
            </div>
            <div class="parser-footer">
                <button id="parser-refresh-cache">Обновить главы</button>
                <button id="parser-clear-cache">Очистить кэш</button>
            </div>
        `;
        document.body.appendChild(ui);
        addStyles();
        getUIReferences();
        addEventListeners();
        makeDraggable(document.querySelector('.parser-header'));
        setState(State.PENDING_INIT);
    }
 
    function getUIReferences() {
        startChapterSelect = document.getElementById('parser-start-chapter');
        endChapterSelect = document.getElementById('parser-end-chapter');
        progressBar = document.getElementById('parser-progress-bar');
        progressText = document.getElementById('parser-progress-text');
        downloadFb2Btn = document.getElementById('parser-download-fb2');
        downloadTxtBtn = document.getElementById('parser-download-txt');
        stopBtn = document.getElementById('parser-stop-btn');
        delayInput = document.getElementById('parser-delay');
        cleanTextCheckbox = document.getElementById('parser-clean-text');
        sectionsOnlyCheckbox = document.getElementById('parser-sections-only');
        forceRefreshBtn = document.getElementById('parser-refresh-cache');
        clearCacheBtn = document.getElementById('parser-clear-cache');
        initializeBtn = document.getElementById('parser-initialize-btn');
        mainControlsContainer = document.getElementById('parser-main-controls');
        footerContainer = document.querySelector('.parser-footer');
    }
 
    function addEventListeners() {
        document.getElementById('parser-close-btn').addEventListener('click', () => ui.style.display = 'none');
        initializeBtn.addEventListener('click', () => initialize(false));
        downloadFb2Btn.addEventListener('click', () => processChapters('fb2'));
        downloadTxtBtn.addEventListener('click', () => processChapters('txt'));
        stopBtn.addEventListener('click', () => {
            stopProcessing = true;
        });
        forceRefreshBtn.addEventListener('click', () => initialize(true));
        clearCacheBtn.addEventListener('click', () => {
            if (book.url) GM_deleteValue(book.url);
            updateProgress(0, 0, "Кэш очищен. Нажмите 'Инициализировать'.");
            startChapterSelect.innerHTML = '';
            endChapterSelect.innerHTML = '';
            setState(State.PENDING_INIT);
        });
    }
 
    function addStyles() {
        GM_addStyle(`
            #ranobe-parser-ui { position: fixed; top: 20px; right: 20px; z-index: 9999; width: 350px; background: #2c2c2e; color: #f0f0f0; border: 1px solid #444; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }
            .parser-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #3a3a3c; border-bottom: 1px solid #444; border-radius: 8px 8px 0 0; cursor: move; }
            .parser-header h2 { margin: 0; font-size: 16px; }
            #parser-close-btn { background: none; border: none; color: #f0f0f0; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; }
            .parser-body, .parser-footer { padding: 15px; }
            .parser-row { display: flex; align-items: center; margin-bottom: 12px; }
            .parser-row label { flex: 1; }
            .parser-row select, .parser-row input { flex: 2; padding: 6px; background: #3a3a3c; color: #f0f0f0; border: 1px solid #555; border-radius: 4px; }
            .parser-checkboxes { flex-direction: column; align-items: flex-start; }
            .parser-checkboxes label { margin-bottom: 5px; cursor: pointer; }
            .parser-actions { display: flex; justify-content: space-between; margin-top: 15px; }
            #parser-initialize-btn, .parser-actions button, #parser-stop-btn, .parser-footer button { width: 100%; padding: 10px; border: none; border-radius: 5px; background-color: #007aff; color: white; cursor: pointer; transition: background-color 0.2s; margin-bottom: 10px; }
            .parser-actions button { width: 48%; margin-bottom: 0; }
            #parser-download-txt { background-color: #34c759; }
            #parser-stop-btn { background-color: #ff3b30; }
            button:disabled { background-color: #555 !important; cursor: not-allowed !important; }
            button:not(:disabled):hover { opacity: 0.8; }
            .parser-progress-container { width: 100%; background: #444; border-radius: 5px; margin-top: 15px; overflow: hidden; }
            #parser-progress-bar { height: 10px; width: 0%; background: #007aff; transition: width 0.3s; }
            #parser-progress-text { margin: 8px 0 0; text-align: center; font-size: 12px; min-height: 1.2em; }
            .parser-footer { border-top: 1px solid #444; display: flex; justify-content: space-around; padding-top: 10px; margin-top: 10px;}
            .parser-footer button { width: 48%; background: #555; font-size: 12px; padding: 8px; margin: 0; }
            #parser-main-controls { transition: opacity 0.3s ease; }
        `);
    }
 
    function makeDraggable(header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                ui.style.top = `${ui.offsetTop - pos2}px`;
                ui.style.left = `${ui.offsetLeft - pos1}px`;
            };
        };
    }
 
    function populateChapterSelectors() {
        startChapterSelect.innerHTML = '';
        endChapterSelect.innerHTML = '';
        if (book.chapters.length === 0) return;
 
        book.chapters.forEach((chapter, index) => {
            const option = `<option value="${index}">${chapter.title}</option>`;
            startChapterSelect.innerHTML += option;
            endChapterSelect.innerHTML += option;
        });
        endChapterSelect.selectedIndex = book.chapters.length - 1;
 
        const currentUrl = window.location.href;
        const currentChapterIndex = book.chapters.findIndex(ch => ch.url === currentUrl);
        if (currentChapterIndex !== -1) {
            startChapterSelect.selectedIndex = currentChapterIndex;
            endChapterSelect.selectedIndex = currentChapterIndex;
        }
    }
 
 
    /**
     * Initializes the script.
     * @param {boolean} forceRefresh - If true, ignores cached data.
     */
    async function initialize(forceRefresh = false) {
        if (currentState === State.INITIALIZING) return;
        setState(State.INITIALIZING);
        updateProgress(0, 0, "Определение страницы...");
 
        const path = window.location.pathname;
        let bookUrlPath = path;
 
        if (path.includes('/glava-')) {
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (nextDataScript) {
                const jsonData = JSON.parse(nextDataScript.textContent);
                bookUrlPath = jsonData?.props?.pageProps?.chapter?.book?.url || path.substring(0, path.lastIndexOf('/'));
            } else {
                bookUrlPath = path.substring(0, path.lastIndexOf('/'));
            }
        }
        book.url = `${window.location.origin}${bookUrlPath}`;
 
        const cachedBook = GM_getValue(book.url);
        if (cachedBook && !forceRefresh) {
            updateProgress(0, 0, "Загрузка данных из кэша...");
            Object.assign(book, cachedBook);
        } else {
            updateProgress(0, 0, "Получение полного списка глав...");
            try {
                const doc = (window.location.pathname === bookUrlPath) ? document : await fetchResource(book.url, 'text');
                await parseBookInfo(doc);
 
                if (book.chapters.length > 0) {
                    // Save all new metadata to cache
                    const bookToCache = (({
                        title, author, annotation, chapters, genres,
                        sequenceName, coverImageUrl, publishedDate, country
                    }) => ({
                        title, author, annotation, chapters, genres,
                        sequenceName, coverImageUrl, publishedDate, country
                    }))(book);
                    GM_setValue(book.url, bookToCache);
                }
            } catch (error) {
                updateProgress(0, 0, `Ошибка: ${error.message}`);
                setState(State.PENDING_INIT);
                return;
            }
        }
 
        if (book.chapters.length > 0) {
            populateChapterSelectors();
            updateProgress(0, 0, `Готово. Найдено глав: ${book.chapters.length}.`);
            setState(State.IDLE);
        } else {
            updateProgress(0, 0, "Главы не найдены. Возможно, изменилась структура сайта.");
            setState(State.PENDING_INIT);
        }
    }
 
    // --- Start ---
    if (document.getElementById('__NEXT_DATA__')) {
        createUI();
    }
 
})();