// ==UserScript==
// @name         Парсер fanmtl.com — FB2 & TXT
// @version      0.1
// @description  Извлекает главы с fanmtl.com и сохраняет их в FB2 или TXT
// @match        https://www.fanmtl.com/novel/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @connect      self
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552520/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20fanmtlcom%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552520/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20fanmtlcom%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const State = { IDLE: 'IDLE', PENDING_INIT: 'PENDING_INIT', INITIALIZING: 'INITIALIZING', PROCESSING: 'PROCESSING', GENERATING: 'GENERATING' };
    let currentState = State.PENDING_INIT;
    let stopProcessing = false;

    let book = {
        url: '',
        title: 'Без названия',
        author: 'Неизвестен',
        annotation: 'Аннотация отсутствует.',
        lang: 'en',
        originalTitle: null,
        chapters: [],
        genres: [],
        sequenceName: null,
    };

    // --- UI References ---
    let ui, startChapterSelect, endChapterSelect, progressBar, progressText,
        downloadFb2Btn, downloadTxtBtn, stopBtn, delayInput, cleanTextCheckbox,
        sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn, initializeBtn,
        mainControlsContainer, footerContainer;

    // --- Helper Functions ---
    function gmFetch(url, responseType = 'text') {
        return new Promise((resolve, reject) => {
            const opts = {
                method: 'GET',
                url,
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        if (responseType === 'text') resolve(res.responseText);
                        else resolve(res.response);
                    } else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: err => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout')),
            };
            GM_xmlhttpRequest(opts);
        });
    }

    async function fetchDocument(url) {
        const text = await gmFetch(url, 'text');
        return new DOMParser().parseFromString(text, 'text/html');
    }

    // --- State & UI Management ---
    function setState(newState) {
        currentState = newState;
        const isIdle = newState === State.IDLE;
        const isProcessing = newState === State.PROCESSING;

        if (mainControlsContainer) mainControlsContainer.style.display = (newState !== State.PENDING_INIT) ? 'block' : 'none';
        if (footerContainer) footerContainer.style.display = (newState !== State.PENDING_INIT) ? 'flex' : 'none';
        if (initializeBtn) initializeBtn.style.display = (newState === State.PENDING_INIT) ? 'block' : 'none';

        if (downloadFb2Btn) downloadFb2Btn.disabled = !isIdle;
        if (downloadTxtBtn) downloadTxtBtn.disabled = !isIdle;
        if (stopBtn) stopBtn.style.display = isProcessing ? 'block' : 'none';

        const controls = [startChapterSelect, endChapterSelect, delayInput, cleanTextCheckbox, sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn];
        controls.forEach(el => { if (el) el.disabled = !isIdle; });
    }

    function updateProgress(current, total, message = '') {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message || `Обработка: ${current} из ${total} (${percentage}%)`;
    }

    // --- Parsing Logic ---
    function safeText(node, fallback = '') { return node ? node.textContent.trim() : fallback; }

    function escapeXml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[m]));
    }

    async function parseBookInfo(doc) {
        book.lang = doc.documentElement.lang || 'en';
        book.title = safeText(doc.querySelector('h1.novel-title'), 'Без названия');
        book.author = safeText(doc.querySelector('.author span[itemprop="author"]'), 'Неизвестен');
        book.originalTitle = safeText(doc.querySelector('h2.alternative-title'));

        const annotationNode = doc.querySelector('.summary .content');
        if (annotationNode) {
            const paragraphs = annotationNode.querySelectorAll('p');
            if (paragraphs.length > 0) {
                book.annotation = Array.from(paragraphs)
                    .map(p => `<p>${p.innerHTML.trim()}</p>`)
                    .join('\n');
            } else {
                const textContent = annotationNode.textContent.trim();
                book.annotation = textContent ? `<p>${escapeXml(textContent)}</p>` : '<p>No annotation found.</p>';
            }
        } else {
             book.annotation = '<p>No annotation found.</p>';
        }

        book.genres = Array.from(doc.querySelectorAll('.categories a.property-item, .categories a.tag')).map(safeText);
    }

    async function fetchAllChapters(mainPageDoc) {
        updateProgress(0, 0, 'Поиск глав...');
        let allChapterLinks = [];

        const collectLinksFromDoc = (doc) => Array.from(doc.querySelectorAll('ul.chapter-list li a'));
        allChapterLinks.push(...collectLinksFromDoc(mainPageDoc));

        const pagination = mainPageDoc.querySelector('.pagination');
        if (pagination) {
            const pageLinks = pagination.querySelectorAll('a[href*="page="]');
            const lastPageLink = Array.from(pageLinks).pop();
            if (lastPageLink) {
                const lastPageMatch = lastPageLink.href.match(/page=(\d+)/);
                const maxPage = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 0;

                const urlTemplateLink = pagination.querySelector('a[href*="&wjm="]');
                if (urlTemplateLink) {
                    const templateHref = new URL(urlTemplateLink.href, window.location.origin);
                    const wjm = templateHref.searchParams.get('wjm');
                    const basePath = templateHref.pathname;

                    for (let p = 1; p <= maxPage; p++) {
                        updateProgress(p, maxPage, `Сканирование страниц глав: ${p + 1}/${maxPage + 1}`);
                        const pageUrl = `${basePath}?page=${p}&wjm=${wjm}`;
                        const pageDoc = await fetchDocument(pageUrl);
                        allChapterLinks.push(...collectLinksFromDoc(pageDoc));
                        await new Promise(r => setTimeout(r, 100));
                    }
                }
            }
        }

        const mappedChapters = allChapterLinks.map(a => ({
            title: safeText(a.querySelector('.chapter-title')),
            url: new URL(a.getAttribute('href'), window.location.origin).href
        }));

        const sortOrderEl = mainPageDoc.querySelector('.filters .chorder');
        const sortOrder = sortOrderEl ? sortOrderEl.getAttribute('data-order') : 'desc';

        book.chapters = (sortOrder === 'desc') ? mappedChapters.reverse() : mappedChapters;
    }

    function cleanupHtml(content) {
        if (!content) return content;
        const selectorsToRemove = [
            'script', 'style', 'noscript', 'iframe', 'header', 'footer',
            '.google-auto-placed', 'div[align="center"]', '.head-stick-offset',
            '.chapternav', '.recommends', 'section[class*="comment"]', '.guide-message',
            '.TPuhiHlg', '.bA_Dw_NX', '.left-panel', '.chapter-header',
        ];
        selectorsToRemove.forEach(s => content.querySelectorAll(s).forEach(e => e.remove()));
        Array.from(content.querySelectorAll('*')).forEach(el => {
            ['style', 'onclick', 'onmouseover', 'onerror', 'class', 'id'].forEach(attr => el.removeAttribute(attr));
        });
        return content;
    }

    // --- File Generation ---
    function generateFb2(chaptersData, sectionsOnly = false) {
        const today = new Date().toISOString().split('T')[0];
        const sections = chaptersData.map(ch => `<section><title><p>${escapeXml(ch.title)}</p></title>${ch.content}</section>`).join('\n');
        if (sectionsOnly) return `<body>\n${sections}\n</body>`;

        const safeTitle = escapeXml(book.title);
        const safeAuthor = escapeXml(book.author);
        const sequenceTag = book.sequenceName ? `<sequence name="${escapeXml(book.sequenceName)}" />` : '';
        const genresXml = (book.genres || []).map(g => `<genre>${escapeXml(g)}</genre>`).join('\n        ');

        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        ${genresXml}
        <author><nickname>${safeAuthor}</nickname></author>
        <book-title>${safeTitle}</book-title>
        ${sequenceTag}
        <lang>${book.lang}</lang>
        <annotation>${book.annotation}</annotation>
    </title-info>
    <document-info>
        <date value="${today}">${today}</date>
        <id>${crypto.randomUUID()}</id>
        <version>0.1</version>
    </document-info>
</description>
<body>
    ${sections}
</body>
</FictionBook>`;
    }

    function generateTxt(chaptersData) {
        const title = `${book.title}\nAuthor: ${book.author}\n\n---\n\n`;
        const chaptersText = chaptersData.map(ch => {
            const temp = document.createElement('div');
            temp.innerHTML = ch.content.replace(/<\/p>/g, '</p>\n');
            return `${ch.title}\n\n${temp.textContent.trim()}`;
        }).join('\n\n---\n\n');
        return title + chaptersText;
    }

    function triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // --- Core Processing Logic ---
    async function processChapters(format) {
        if (currentState !== State.IDLE) return;
        setState(State.PROCESSING);
        stopProcessing = false;

        const startIdx = parseInt(startChapterSelect.value, 10);
        const endIdx = parseInt(endChapterSelect.value, 10);
        const delay = Math.max(100, parseInt(delayInput.value, 10) || 500);
        const shouldClean = cleanTextCheckbox.checked;
        const sectionsOnly = sectionsOnlyCheckbox.checked;

        if (startIdx > endIdx) {
            updateProgress(0, 0, 'Ошибка: начальная глава позже конечной.');
            setState(State.IDLE);
            return;
        }

        const chaptersToProcess = book.chapters.slice(startIdx, endIdx + 1);
        const totalChapters = chaptersToProcess.length;
        const collected = [];

        for (let i = 0; i < totalChapters; i++) {
            if (stopProcessing) {
                updateProgress(i, totalChapters, `Остановлено. Собрано ${i} глав.`);
                break;
            }
            const ch = chaptersToProcess[i];
            updateProgress(i + 1, totalChapters, `Загрузка: ${ch.title}`);
            try {
                const doc = await fetchDocument(ch.url);
                let contentNode = doc.querySelector('div.chapter-content');
                if (!contentNode) throw new Error('Текст главы не найден');
                if (shouldClean) contentNode = cleanupHtml(contentNode.cloneNode(true));
                const paragraphs = Array.from(contentNode.querySelectorAll('p'))
                    .filter(p => p.textContent.trim().length > 0)
                    .map(p => `<p>${p.innerHTML.trim()}</p>`).join('\n');
                collected.push({
                    title: ch.title,
                    content: paragraphs || `<p>${contentNode.textContent.trim()}</p>`
                });
            } catch (e) {
                console.error('Ошибка при обработке главы:', ch.title, e);
                collected.push({
                    title: ch.title,
                    content: `<p>Ошибка загрузки главы: ${escapeXml(e.message)}</p>`
                });
            }
             if (i < totalChapters - 1) await new Promise(r => setTimeout(r, delay));
        }

        if (collected.length === 0) {
            updateProgress(0, 0, 'Ни одной главы не загружено.');
            setState(State.IDLE);
            return;
        }

        setState(State.GENERATING);
        updateProgress(collected.length, totalChapters, 'Генерация файла...');
        const safeFileTitle = (book.title || 'book').replace(/[\\/:"*?<>|]+/g, '_');
        const fileName = `${safeFileTitle}_Ch_${startIdx + 1}-${startIdx + collected.length}.${format}`;

        let fileContent, blobType;
        if (format === 'fb2') {
            fileContent = generateFb2(collected, sectionsOnly);
            blobType = 'application/fb2+xml';
        } else {
            fileContent = generateTxt(collected);
            blobType = 'text/plain';
        }

        const blob = new Blob([fileContent], { type: `${blobType};charset=utf-8` });
        triggerDownload(blob, fileName);
        updateProgress(collected.length, totalChapters, `Готово! Собрано ${collected.length} глав.`);
        setTimeout(() => setState(State.IDLE), 2000);
    }

    // --- UI Creation & Initialization ---
    function createUI() {
        if (document.getElementById('fanmtl-parser-ui')) return;
        ui = document.createElement('div');
        ui.id = 'fanmtl-parser-ui';
        ui.innerHTML = `
            <div class="parser-header"><h2>Парсер fanmtl.com</h2><button id="parser-close-btn">&times;</button></div>
            <div class="parser-body">
                <button id="parser-initialize-btn">Инициализировать</button>
                <div id="parser-main-controls">
                    <div class="parser-row"><label>С главы:</label><select id="parser-start-chapter"></select></div>
                    <div class="parser-row"><label>По главу:</label><select id="parser-end-chapter"></select></div>
                    <div class="parser-row">
                        <label>Задержка (мс):</label>
                        <input type="number" id="parser-delay" value="250" min="100">
                    </div>
                    <div class="parser-row parser-checkboxes">
                        <label><input type="checkbox" id="parser-clean-text" checked> Очищать текст</label>
                        <label><input type="checkbox" id="parser-sections-only"> Только секции (для FB2)</label>
                    </div>
                    <div class="parser-actions">
                        <button id="parser-download-fb2">Скачать FB2</button>
                        <button id="parser-download-txt">Скачать TXT</button>
                    </div>
                </div>
                <div class="parser-progress-container"><div id="parser-progress-bar"></div></div>
                <p id="parser-progress-text">Нажмите "Инициализировать" для начала</p>
                <button id="parser-stop-btn" style="display:none">Остановить и скачать</button>
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
        makeDraggable(ui.querySelector('.parser-header'));
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
        stopBtn.addEventListener('click', () => stopProcessing = true);
        forceRefreshBtn.addEventListener('click', () => initialize(true));
        clearCacheBtn.addEventListener('click', () => {
            if (book.url) GM_deleteValue(book.url);
            updateProgress(0,0,"Кэш очищен.");
            startChapterSelect.innerHTML='';
            endChapterSelect.innerHTML='';
            setState(State.PENDING_INIT);
            progressText.textContent = 'Нажмите "Инициализировать" для начала';
        });
    }

    function addStyles() {
        GM_addStyle(`
            #fanmtl-parser-ui { position: fixed; top: 20px; right: 20px; width: 360px; z-index: 99999; background: #2c2c2e; color: #f0f0f0; border: 1px solid #444; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            .parser-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #3a3a3c; border-bottom: 1px solid #444; border-radius: 8px 8px 0 0; cursor: move; user-select: none; }
            .parser-header h2 { margin: 0; font-size: 16px; }
            #parser-close-btn { background: none; border: none; color: #f0f0f0; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; }
            .parser-body, .parser-footer { padding: 15px; }
            .parser-row { display: flex; align-items: center; margin-bottom: 12px; }
            .parser-row label { flex: 1; }
            .parser-row select, .parser-row input { flex: 2; padding: 6px; background: #3a3a3c; color: #f0f0f0; border: 1px solid #555; border-radius: 4px; min-width: 0; }
            #parser-start-chapter, #parser-end-chapter { text-overflow: ellipsis; }
            .parser-checkboxes { flex-direction: column; align-items: flex-start; } .parser-checkboxes label { margin-bottom: 5px; cursor: pointer; }
            .parser-actions { display: flex; gap: 10px; margin-top: 15px; }
            #parser-initialize-btn, .parser-actions button, #parser-stop-btn, .parser-footer button { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; }
            .parser-actions button { flex: 1; }
            #parser-initialize-btn { background-color: #007aff; margin-bottom: 10px; }
            #parser-download-fb2 { background: #007aff; }
            #parser-download-txt { background: #34c759; }
            #parser-stop-btn { background: #ff3b30; width: 100%; margin-top: 10px; }
            .parser-progress-container { width: 100%; background: #444; border-radius: 5px; overflow: hidden; height: 10px; margin: 15px 0 5px 0; }
            #parser-progress-bar { height: 100%; width: 0; background: #007aff; transition: width .25s ease-out; }
            #parser-progress-text { text-align: center; font-size: 12px; min-height: 1.2em; }
            .parser-footer { display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid #444; }
            .parser-footer button { flex: 1; background: #555; font-size: 12px; padding: 8px; }
            button:disabled { background-color: #555 !important; color: #888 !important; cursor: not-allowed !important; }
            button:not(:disabled):hover { opacity: 0.8; }
        `);
    }

    function makeDraggable(header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (ev) => {
                ev.preventDefault();
                pos1 = pos3 - ev.clientX;
                pos2 = pos4 - ev.clientY;
                pos3 = ev.clientX;
                pos4 = ev.clientY;
                ui.style.top = `${ui.offsetTop - pos2}px`;
                ui.style.left = `${ui.offsetLeft - pos1}px`;
            };
        };
    }

     async function populateChapterSelectors() {
        if (book.chapters.length > 300) {
            updateProgress(0, 0, `Найдено ${book.chapters.length} глав. Заполнение меню может занять время...`);
            await new Promise(r => setTimeout(r, 50));
        }
        startChapterSelect.innerHTML = '';
        endChapterSelect.innerHTML = '';
        if (!book.chapters || !book.chapters.length) return;
        book.chapters.forEach((ch, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = ch.title || `Chapter ${i + 1}`;
            startChapterSelect.appendChild(option);
            endChapterSelect.appendChild(option.cloneNode(true));
        });
        const currentChapterUrl = window.location.href.split('?')[0];
        const currentIndex = book.chapters.findIndex(ch => ch.url === currentChapterUrl);
        if (currentIndex !== -1) {
            startChapterSelect.selectedIndex = currentIndex;
            endChapterSelect.selectedIndex = currentIndex;
        } else {
            startChapterSelect.selectedIndex = 0;
            endChapterSelect.selectedIndex = book.chapters.length - 1;
        }
    }

    async function initialize(forceRefresh = false) {
        if (currentState === State.INITIALIZING) return;
        setState(State.INITIALIZING);
        try {
            updateProgress(0, 0, 'Определение книги...');
            const path = window.location.pathname;
            let bookUrl;
            if (path.includes('_')) {
                const indexLink = document.querySelector('.chapternav a.chapindex');
                if (!indexLink) throw new Error('Не найдена ссылка на главную страницу книги (кнопка Index).');
                bookUrl = new URL(indexLink.getAttribute('href'), window.location.origin).href;
            } else {
                bookUrl = window.location.href.split('?')[0].split('#')[0];
            }
            book.url = bookUrl;
            const cached = GM_getValue(book.url);
            if (cached && !forceRefresh) {
                Object.assign(book, cached);
                updateProgress(0, 0, 'Данные загружены из кэша.');
            } else {
                updateProgress(0, 0, 'Получение информации о книге...');
                const mainPageDoc = (book.url === window.location.href.split('?')[0].split('#')[0]) ? document : await fetchDocument(book.url);
                await parseBookInfo(mainPageDoc);
                await fetchAllChapters(mainPageDoc);
                const bookToCache = {
                    title: book.title, author: book.author, annotation: book.annotation,
                    lang: book.lang, originalTitle: book.originalTitle,
                    chapters: book.chapters, genres: book.genres, sequenceName: book.sequenceName,
                };
                GM_setValue(book.url, bookToCache);
            }
            if (book.chapters.length > 0) {
                await populateChapterSelectors();
                updateProgress(0, 0, `Готово. Найдено глав: ${book.chapters.length}`);
                setState(State.IDLE);
            } else {
                throw new Error("Главы не найдены.");
            }
        } catch (err) {
            console.error(err);
            updateProgress(0, 0, `Ошибка: ${err.message}`);
            setState(State.PENDING_INIT);
        }
    }
    createUI();
})();