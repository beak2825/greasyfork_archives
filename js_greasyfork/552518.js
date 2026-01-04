// ==UserScript==
// @name         Парсер novelbin.com — FB2 & TXT
// @version      0.1
// @description  Извлекает главы с novelbin.com и сохраняет их в FB2 или TXT.
// @match        https://novelbin.com/b/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      novelbin.com
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552518/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20novelbincom%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552518/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20novelbincom%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const State = { IDLE: 'IDLE', PENDING_INIT: 'PENDING_INIT', INITIALIZING: 'INITIALIZING', PROCESSING: 'PROCESSING', GENERATING: 'GENERATING', STOPPED: 'STOPPED' };
    let currentState = State.PENDING_INIT;
    let stopProcessing = false;

    let book = {
        url: '',
        title: 'Без названия',
        author: 'Неизвестен',
        annotation: '<p>Аннотация отсутствует.</p>',
        chapters: [],
        genres: [],
        lang: 'en',
    };

    // UI refs
    let ui, startChapterSelect, endChapterSelect, progressBar, progressText,
        downloadFb2Btn, downloadTxtBtn, stopBtn, delayInput,
        sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn, initializeBtn,
        mainControlsContainer, footerContainer;

    // --- Helpers ---
    function gmFetch(url, responseType = 'text') {
        return new Promise((resolve, reject) => {
            const opts = {
                method: 'GET',
                url,
                timeout: 30000,
                onload: res => {
                    if (res.status >= 200 && res.status < 400) {
                        if (responseType === 'text') resolve(res.responseText);
                        else resolve(res);
                    } else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: () => reject(new Error('Сетевая ошибка')),
                ontimeout: () => reject(new Error('Таймаут запроса')),
            };
            GM_xmlhttpRequest(opts);
        });
    }

    async function fetchDocument(url) {
        const text = await gmFetch(url, 'text');
        return new DOMParser().parseFromString(text, 'text/html');
    }

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

        const controls = [startChapterSelect, endChapterSelect, delayInput, sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn];
        controls.forEach(el => { if (el) el.disabled = !isIdle; });
    }

    function updateProgress(current, total, message = '') {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.innerHTML = message || `Обработка: ${current} из ${total} (${percentage}%)`;
    }

    // --- Parsing ---
    function safeText(node, fallback = '') { return node ? node.textContent.trim() : fallback; }

    function parseBookInfo(doc) {
        book.title = safeText(doc.querySelector('h3.title[itemprop="name"]'), 'Без названия');
        book.author = safeText(doc.querySelector('ul.info-meta a[href*="/a/"]'), 'Неизвестен');
        book.lang = doc.documentElement.lang || 'en';
        const annotationNode = doc.querySelector('div.desc-text[itemprop="description"]');
        book.annotation = annotationNode && annotationNode.textContent.trim() ? reformatToParagraphs(annotationNode) : '<p>Аннотация отсутствует.</p>';
        book.genres = Array.from(doc.querySelectorAll('ul.info-meta a[href*="/genre/"]')).map(el => safeText(el));
    }

    async function fetchAllChapters(novelId) {
        updateProgress(0, 0, 'Запрос полного списка глав...');
        const chapters = [];
        const archiveUrl = `${window.location.origin}/ajax/chapter-archive?novelId=${novelId}`;

        const htmlSnippet = await gmFetch(archiveUrl, 'text');
        const snippetDoc = new DOMParser().parseFromString(htmlSnippet, 'text/html');

        const items = snippetDoc.querySelectorAll('.list-chapter li a');
        if (items.length === 0) {
            throw new Error("Не удалось получить список глав. Возможно, изменился API сайта.");
        }

        items.forEach(a => {
            const title = a.querySelector('.nchr-text')?.textContent.trim() || a.getAttribute('title') || a.textContent.trim();
            const url = new URL(a.getAttribute('href'), window.location.origin).href;
            if (title && url && !chapters.some(ch => ch.url === url)) {
                chapters.push({ title, url });
            }
        });

        book.chapters = chapters;
    }


    function reformatToParagraphs(node) {
        const cleanNode = node.cloneNode(true);
        cleanNode.querySelectorAll('script, style, .adsbygoogle, div[id^="pf-"]').forEach(e => e.remove());

        const htmlParts = [];
        const processNode = (n) => {
             if (n.nodeType === Node.ELEMENT_NODE) {
                if ((n.tagName === 'P' || n.tagName === 'DIV') && n.textContent.trim()) {
                     htmlParts.push(`<p>${n.innerHTML}</p>`);
                } else if (n.childNodes.length > 0) {
                    n.childNodes.forEach(processNode);
                }
            } else if (n.nodeType === Node.TEXT_NODE) {
                const trimmedText = n.textContent.trim();
                if (trimmedText) {
                    trimmedText.split(/\n\s*\n/).forEach(paragraph => {
                       if (paragraph.trim()) htmlParts.push(`<p>${paragraph.trim()}</p>`);
                    });
                }
            }
        };
        cleanNode.childNodes.forEach(processNode);
        return htmlParts.join('\n');
    }

    // --- File Generation ---
    function stripHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html || '';
        return temp.textContent || "";
    }

    function escapeXml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[m]));
    }

    function generateFb2(chaptersData, sectionsOnly = false) {
        const today = new Date().toISOString().split('T')[0];
        const sections = chaptersData.map(ch => `<section><title><p>${escapeXml(stripHtml(ch.title))}</p></title>${ch.content}</section>`).join('\n');

        if (sectionsOnly) return `<body>\n${sections}\n</body>`;

        const safeTitle = escapeXml(stripHtml(book.title));
        const safeAuthor = escapeXml(stripHtml(book.author));
        const genresXml = (book.genres || []).map(g => `<genre>${escapeXml(stripHtml(g.toLowerCase()))}</genre>`).join('\n        ');

        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        ${genresXml}
        <author><nickname>${safeAuthor}</nickname></author>
        <book-title>${safeTitle}</book-title>
        <lang>${book.lang}</lang>
        <annotation>${book.annotation}</annotation>
    </title-info>
    <document-info>
        <date value="${today}">${today}</date>
        <version>0.1</version>
    </document-info>
</description>
<body>
    ${sections}
</body>
</FictionBook>`;
    }

    function generateTxt(chaptersData) {
         return chaptersData.map(ch => {
            const temp = document.createElement('div');
            temp.innerHTML = ch.content;
            const text = Array.from(temp.querySelectorAll('p')).map(p => p.textContent.trim()).filter(Boolean).join('\n');
            return `Глава: ${stripHtml(ch.title)}\n\n${text}`;
        }).join('\n\n\n');
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

    // --- Core processing ---
    async function processChapters(format) {
        if (currentState !== State.IDLE) return;
        setState(State.PROCESSING);
        stopProcessing = false;

        const startIdx = parseInt(startChapterSelect.value, 10);
        const endIdx = parseInt(endChapterSelect.value, 10);
        const delay = Math.max(100, parseInt(delayInput.value, 10) || 500);
        const sectionsOnly = format === 'fb2' && sectionsOnlyCheckbox.checked;
        const chaptersToProcess = book.chapters.slice(startIdx, endIdx + 1);
        const totalChapters = chaptersToProcess.length;
        const collected = [];
        let errorOccurred = false;

        for (let i = 0; i < totalChapters; i++) {
            if (stopProcessing) {
                updateProgress(i, totalChapters, `Остановлено пользователем. Собрано ${i} глав.`);
                break;
            }
            const ch = chaptersToProcess[i];
            updateProgress(i + 1, totalChapters, `Загрузка: ${ch.title}`);
            try {
                const doc = await fetchDocument(ch.url);
                const contentNode = doc.querySelector('#chr-content');
                if (!contentNode) throw new Error('Блок с текстом главы не найден');

                const finalContent = reformatToParagraphs(contentNode);
                if (!finalContent) throw new Error('Не удалось извлечь текст из главы');

                collected.push({ title: ch.title, content: finalContent });

            } catch (e) {
                updateProgress(i, totalChapters, `<strong style="color: #ff3b30;">Ошибка на главе "${ch.title}": ${e.message}.</strong><br>Процесс остановлен.`);
                errorOccurred = true;
                break;
            }
            if (i < totalChapters - 1) await new Promise(r => setTimeout(r, delay));
        }

        if (collected.length === 0 && !errorOccurred) {
            updateProgress(0, 0, 'Ни одной главы не было загружено.');
            setState(State.IDLE);
            return;
        }

        setState(State.GENERATING);
        updateProgress(collected.length, totalChapters, 'Генерация файла из собранных глав...');

        const safeFileTitle = (book.title || 'book').replace(/[\\/:"*?<>|]+/g, '_');
        const startNum = startIdx + 1;
        const endNum = startIdx + collected.length;
        const fileName = `${safeFileTitle}_Главы_${startNum}-${endNum}.${format}`;

        const blob = new Blob(
            [ (format === 'fb2' ? generateFb2(collected, sectionsOnly) : generateTxt(collected)) ],
            { type: `${format === 'fb2' ? 'application/fb2+xml' : 'text/plain'};charset=utf-8` }
        );

        triggerDownload(blob, fileName);

        if (!errorOccurred && !stopProcessing) {
             updateProgress(collected.length, totalChapters, 'Готово!');
        }
        setTimeout(() => {
            if (!errorOccurred) {
                 updateProgress(0, 0, `Завершено. Собрано глав: ${collected.length}`);
                 setState(State.IDLE);
            }
        }, 3000);
    }

    // --- UI ---
    function createUI() {
        if (document.getElementById('nb-parser-ui')) return;
        ui = document.createElement('div');
        ui.id = 'nb-parser-ui';
        ui.innerHTML = `
            <div class="parser-header"><h2>Парсер — FB2 & TXT</h2><button id="parser-close-btn" title="Закрыть">&times;</button></div>
            <div class="parser-body">
                <button id="parser-initialize-btn">Инициализировать</button>
                <div id="parser-main-controls" style="display:none;">
                    <div class="parser-row"><label>С главы:</label><select id="parser-start-chapter"></select></div>
                    <div class="parser-row"><label>По главу:</label><select id="parser-end-chapter"></select></div>
                    <div class="parser-row"><label for="parser-delay">Задержка (мс):</label><input type="number" id="parser-delay" value="500" min="100"></div>
                    <div class="parser-row parser-checkboxes">
                        <label><input type="checkbox" id="parser-sections-only"> Только секции (для FB2)</label>
                    </div>
                    <div class="parser-actions">
                        <button id="parser-download-fb2">Скачать FB2</button>
                        <button id="parser-download-txt">Скачать TXT</button>
                    </div>
                </div>
                <div class="parser-progress-container"><div id="parser-progress-bar"></div></div>
                <p id="parser-progress-text">Нажмите "Инициализировать" для начала</p>
                <button id="parser-stop-btn" style="display:none">Остановить и скачать собранное</button>
            </div>
            <div class="parser-footer" style="display:none;">
                 <button id="parser-refresh-cache" title="Загрузить список глав с сайта, игнорируя кэш">Обновить главы</button>
                 <button id="parser-clear-cache" title="Удалить сохраненные данные для этой книги">Очистить кэш</button>
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
        const byId = id => document.getElementById(id);
        startChapterSelect = byId('parser-start-chapter'); endChapterSelect = byId('parser-end-chapter');
        progressBar = byId('parser-progress-bar'); progressText = byId('parser-progress-text');
        downloadFb2Btn = byId('parser-download-fb2'); downloadTxtBtn = byId('parser-download-txt');
        stopBtn = byId('parser-stop-btn'); delayInput = byId('parser-delay');
        sectionsOnlyCheckbox = byId('parser-sections-only'); forceRefreshBtn = byId('parser-refresh-cache');
        clearCacheBtn = byId('parser-clear-cache'); initializeBtn = byId('parser-initialize-btn');
        mainControlsContainer = byId('parser-main-controls'); footerContainer = ui.querySelector('.parser-footer');
    }

    function addEventListeners() {
        document.getElementById('parser-close-btn').addEventListener('click', () => ui.style.display = 'none');
        initializeBtn.addEventListener('click', () => initialize(false));
        downloadFb2Btn.addEventListener('click', () => processChapters('fb2'));
        downloadTxtBtn.addEventListener('click', () => processChapters('txt'));
        stopBtn.addEventListener('click', () => stopProcessing = true);
        forceRefreshBtn.addEventListener('click', () => initialize(true));
        clearCacheBtn.addEventListener('click', () => {
            if (book.url) {
                GM_deleteValue(book.url);
                startChapterSelect.innerHTML = ''; endChapterSelect.innerHTML = '';
                setState(State.PENDING_INIT);
                updateProgress(0, 0, 'Кэш очищен. Нажмите "Инициализировать".');
            }
        });
    }

    function addStyles() {
        GM_addStyle(`
            #nb-parser-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 360px;
                z-index: 2147483647;
                background: #2d2d30;
                color: #f1f1f1;
                border: 1px solid #4a4a4a;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            .parser-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: #3c3c3f;
                border-bottom: 1px solid #4a4a4a;
                border-radius: 8px 8px 0 0;
                cursor: move;
            }
            .parser-header h2 { margin: 0; font-size: 16px; font-weight: 600; }
            #parser-close-btn { background: none; border: none; color: #a0a0a0; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 5px; transition: color 0.2s; }
            #parser-close-btn:hover { color: #fff; }
            .parser-body, .parser-footer { padding: 15px; }
            .parser-row { display: flex; align-items: center; margin-bottom: 12px; }
            .parser-row label { flex: 1; }
            .parser-row select, .parser-row input[type="number"] {
                flex: 2;
                padding: 8px;
                background: #3c3c3f;
                color: #f1f1f1;
                border: 1px solid #555;
                border-radius: 4px;
                min-width: 0;
            }
            .parser-row select { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
            .parser-checkboxes label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
            .parser-actions { display: flex; gap: 10px; margin-top: 15px; }
            #parser-initialize-btn, .parser-actions button, #parser-stop-btn, .parser-footer button {
                padding: 10px;
                border: none;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s, opacity 0.2s;
                font-weight: 500;
                font-size: 14px;
            }
            .parser-actions button { flex: 1; }
            #parser-initialize-btn { width: 100%; background-color: #0a84ff; margin-bottom: 10px; }
            #parser-download-fb2 { background-color: #0a84ff; }
            #parser-download-txt { background-color: #30d158; }
            #parser-stop-btn { background-color: #ff453a; width: 100%; margin-top: 10px; }
            .parser-progress-container { width: 100%; background: #444; border-radius: 5px; overflow: hidden; height: 10px; margin: 15px 0 8px 0; }
            #parser-progress-bar { height: 100%; width: 0; background: #0a84ff; transition: width .25s; }
            #parser-progress-text { text-align: center; font-size: 12px; min-height: 1.2em; color: #a0a0a0; }
            .parser-footer { display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid #4a4a4a; }
            .parser-footer button { flex: 1; background: #555; font-size: 12px; padding: 8px; }
            button:disabled { background-color: #555 !important; color: #888 !important; cursor: not-allowed !important; }
            button:not(:disabled):hover { opacity: 0.85; }
        `);
    }

    function makeDraggable(header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = e => {
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = ev => {
                ev.preventDefault(); pos1 = pos3 - ev.clientX; pos2 = pos4 - ev.clientY;
                pos3 = ev.clientX; pos4 = ev.clientY;
                ui.style.top = `${ui.offsetTop - pos2}px`; ui.style.left = `${ui.offsetLeft - pos1}px`;
            };
        };
    }

    function populateChapterSelectors() {
        startChapterSelect.innerHTML = ''; endChapterSelect.innerHTML = '';
        if (!book.chapters || !book.chapters.length) return;

        book.chapters.forEach((ch, i) => {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = ch.title || `Глава ${i + 1}`;
            option.title = ch.title || `Глава ${i + 1}`;
            startChapterSelect.appendChild(option);
            endChapterSelect.appendChild(option.cloneNode(true));
        });

        endChapterSelect.selectedIndex = book.chapters.length - 1;
        const currentUrl = window.location.href.split(/[?#]/)[0];
        const currentIdx = book.chapters.findIndex(ch => ch.url === currentUrl);
        if (currentIdx !== -1) {
            startChapterSelect.selectedIndex = currentIdx; endChapterSelect.selectedIndex = currentIdx;
        }

        if (book.chapters.length > 1500) {
            progressText.innerHTML += '<br><strong style="color: #ff9f0a;">Внимание: Глав > 1500. Заполнение списка может занять время.</strong>';
        }
    }

    // --- Initialization ---
    async function initialize(forceRefresh = false) {
        if (currentState === State.INITIALIZING) return;
        setState(State.INITIALIZING);

        try {
            updateProgress(0, 0, 'Определение книги...');
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            const novelId = pathParts[1];
            if (pathParts[0] !== 'b' || !novelId) {
                 throw new Error('Скрипт работает на страницах вида /b/book-name...');
            }
            book.url = `${window.location.origin}/b/${novelId}`;

            const cached = GM_getValue(book.url);
            if (cached && !forceRefresh && cached.chapters?.length) {
                Object.assign(book, cached);
                updateProgress(0, 0, 'Данные загружены из кэша.');
            }

            updateProgress(0, 0, 'Получение метаданных...');
            const mainDoc = await fetchDocument(book.url);
            parseBookInfo(mainDoc);

            if (!cached || forceRefresh || !cached.chapters?.length) {
                await fetchAllChapters(novelId);
                const { url, ...bookToCache } = book;
                try { GM_setValue(book.url, bookToCache); } catch(e) { console.warn('Не удалось записать в кэш', e); }
            }

            populateChapterSelectors();
            updateProgress(0, 0, `Готово. Найдено глав: ${book.chapters.length}`);
            setState(State.IDLE);

        } catch (err) {
            console.error(err);
            updateProgress(0, 0, `<strong style="color: #ff453a;">Ошибка: ${err.message}</strong>`);
            setState(State.PENDING_INIT);
        }
    }

    // Start script
    createUI();

})();