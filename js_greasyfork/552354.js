// ==UserScript==
// @name         Парсер ranobes com — FB2 & TXT
// @match        *://ranobes.com/ranobe/*
// @match        *://ranobes.com/chapters/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      ranobes.com
// @version      0.1
// @description  Извлекает главы с ranobes.com и сохраняет их в FB2 или TXT
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552354/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20ranobes%20com%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552354/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20ranobes%20com%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const State = { IDLE: 'IDLE', PENDING_INIT: 'PENDING_INIT', INITIALIZING: 'INITIALIZING', PROCESSING: 'PROCESSING', GENERATING: 'GENERATING', STOPPED: 'STOPPED' };
    let currentState = State.PENDING_INIT;
    let stopProcessing = false;

    let book = { url: '', title: 'Без названия', author: 'Неизвестен', annotation: 'Аннотация отсутствует.', chapters: [], genres: [], sequenceName: null, coverImageUrl: null, year: null, srcLang: 'ru', translator: null, publisher: null };

    // UI refs
    let ui, startChapterSelect, endChapterSelect, progressBar, progressText,
        downloadFb2Btn, downloadTxtBtn, stopBtn, delayInput, cleanTextCheckbox,
        sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn, initializeBtn,
        mainControlsContainer, footerContainer;

    // --- Helpers ---
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
            };
            if (responseType === 'arraybuffer') opts.responseType = 'arraybuffer';
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
        if (initializeBtn) initializeBtn.style.display = (newState !== State.PENDING_INIT) ? 'none' : 'block';
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

    // --- Parsing ---
    function safeText(node) { return node ? node.textContent.trim() : ''; }

    function parseBookInfo(doc) {
        // Title
        const titleCandidates = [
            doc.querySelector('h1[itemprop="name"]'),
            doc.querySelector('h1.title'),
            doc.querySelector('h1.fullstory-title'),
        ];
        book.title = titleCandidates.map(safeText).find(t => t) || (doc.querySelector('title') ? doc.querySelector('title').textContent.split('|')[0].trim() : 'Без названия');

        // Author
        const authorCandidates = [
            doc.querySelector('.tag_list[itemprop="creator"] a'),
            doc.querySelector('a[href*="/authors/"]'),
        ];
        book.author = authorCandidates.map(safeText).find(a => a) || 'Неизвестен';

        // Annotation
        const fullAnnEl = doc.querySelector('div[itemprop="description"] .showcont-text, div[itemprop="description"]');
        if (fullAnnEl) {
            const annClone = fullAnnEl.cloneNode(true);
            cleanupHtml(annClone);
            book.annotation = annClone.innerHTML.trim();
        } else {
            const metaAnnEl = doc.querySelector('meta[name="description"]');
            book.annotation = metaAnnEl ? metaAnnEl.content.trim() : 'Аннотация отсутствует.';
        }

        // Genres & Keywords
        const genreNodes = doc.querySelectorAll('div[itemprop="genre"] a');
        const keywordNodes = doc.querySelectorAll('div[itemprop="keywords"] a');
        const combinedGenres = new Set([
            ...Array.from(genreNodes).map(safeText),
            ...Array.from(keywordNodes).map(safeText)
        ]);
        book.genres = Array.from(combinedGenres).filter(Boolean);

        // Sequence
        const seq = doc.querySelector('a[href*="/series/"]');
        if (seq) book.sequenceName = safeText(seq);

        // Year
        book.year = safeText(doc.querySelector('span[itemprop="dateCreated"] a')) || null;

        // Original Language
        const langMap = { 'корейский': 'ko', 'китайский': 'zh', 'японский': 'ja', 'английский': 'en' };
        const langStr = safeText(doc.querySelector('span[itemprop="locationCreated"] a')).toLowerCase();
        book.srcLang = langMap[langStr] || 'ru';

        // Translator
        book.translator = safeText(doc.querySelector('span[itemprop="translator"] a')) || null;

        // Publisher
        book.publisher = Array.from(doc.querySelectorAll('span[itemprop="publisher"] a')).map(safeText).join(', ');

        // Table of Contents Link
        const tocCandidates = [
            doc.querySelector('a.bold[href*="/chapters/"][title*="оглавление"]'),
            doc.querySelector('a.btn[href*="/chapters/"]'),
            doc.querySelector('.r-fullstory-btns a[href*="/chapters/"]'),
        ];
        const tocLink = tocCandidates.find(el => el);

        if (!tocLink) {
            if (window.location.pathname.includes('/chapters/')) return window.location.href;
            throw new Error('Не найдена ссылка на оглавление (TOC).');
        }
        return new URL(tocLink.getAttribute('href'), window.location.origin).href;
    }

    async function fetchAllChapters(tocUrl) {
        const chapters = [];
        const base = tocUrl.split('?')[0].split('#')[0].replace(/\/page\/\d+/, '').replace(/\/$/, '') + '/';
        updateProgress(0, 0, 'Получение списка глав...');

        const firstDoc = await fetchDocument(base);

        let maxPage = 1;
        const navLinks = firstDoc.querySelectorAll('.pages a');
        if (navLinks.length > 0) {
            const nums = Array.from(navLinks)
                .map(a => parseInt(a.textContent.trim()))
                .filter(n => !isNaN(n));
            if (nums.length > 0) maxPage = Math.max(...nums);
        }

        for (let p = 1; p <= maxPage; p++) {
            updateProgress(p, maxPage, `Получение списка глав (${p}/${maxPage})`);
            const pageUrl = p === 1 ? base : `${base}page/${p}/`;
            const doc = (p === 1) ? firstDoc : await fetchDocument(pageUrl);

            const items = doc.querySelectorAll('#dle-content .cat_block.cat_line a[href*="/chapters/"]');
            for (const a of items) {
                const title = a.querySelector('h6.title')?.textContent.trim()
                    || a.getAttribute('title')
                    || a.textContent.trim();
                const url = new URL(a.getAttribute('href'), window.location.origin).href;
                if (title && url && !chapters.find(ch => ch.url === url)) {
                    chapters.push({ title, url });
                }
            }
        }

        book.chapters = chapters.reverse();
        if (!chapters.length) {
            throw new Error("Главы не найдены. Возможно, изменилась структура сайта.");
        }
    }

    function cleanupHtml(content) {
        if (!content) return content;
        const selectorsToRemove = ['script','style','noscript','iframe','.yandex-block','.adsbygoogle','.likes-block','[id^=yandex_rtb]','div[class*="adfox"]','.read_script','.cbalink','div[align="center"]','announcement','.comments','.share-buttons', '.r-desription'];
        selectorsToRemove.forEach(s => content.querySelectorAll(s).forEach(e => e.remove()));
        Array.from(content.querySelectorAll('*')).forEach(el => {
            ['style','onclick','onmouseover','onerror'].forEach(attr => { if (el.hasAttribute(attr)) el.removeAttribute(attr); });
        });
        return content;
    }

    function stripHtml(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html || '';
        return tempDiv.textContent || "";
    }

    function escapeXml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    function generateFb2(chaptersData, sectionsOnly = false) {
        const today = new Date().toISOString().split('T')[0];
        const sections = chaptersData.map(ch => `<section><title><p>${escapeXml(stripHtml(ch.title))}</p></title>${ch.content}</section>`).join('\n');
        if (sectionsOnly) return `<body>\n${sections}\n</body>`;

        const safeTitle = escapeXml(stripHtml(book.title));
        const safeAuthor = escapeXml(stripHtml(book.author));
        const sequenceTag = book.sequenceName ? `<sequence name="${escapeXml(stripHtml(book.sequenceName))}" />` : '';
        const genresXml = (book.genres || []).map(g => `<genre>${escapeXml(stripHtml(g))}</genre>`).join('\n        ');
        const yearTag = book.year ? `<date value="${book.year}-01-01">${book.year}</date>` : `<date value="${today}">${today}</date>`;
        const translatorTag = book.translator ? `<translator><nickname>${escapeXml(stripHtml(book.translator))}</nickname></translator>` : '';
        const publisherTag = book.publisher ? `<publisher>${escapeXml(stripHtml(book.publisher))}</publisher>` : '';
        const srcLangTag = book.srcLang ? `<src-lang>${book.srcLang}</src-lang>` : '';

        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        ${genresXml}
        <author><first-name>${safeAuthor}</first-name></author>
        <book-title>${safeTitle}</book-title>
        ${sequenceTag}
        ${publisherTag}
        ${yearTag}
        <lang>ru</lang>
        ${srcLangTag}
        ${translatorTag}
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
            const text = Array.from(temp.querySelectorAll('p')).map(p=>p.textContent.trim()).filter(Boolean).join('\n');
            return `Глава: ${ch.title}\n\n${text}`;
        }).join('\n\n---\n\n');
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

        const startIdx = parseInt(startChapterSelect.value,10) || 0;
        const endIdx = parseInt(endChapterSelect.value,10) || (book.chapters.length - 1);
        const delay = Math.max(100, parseInt(delayInput.value,10) || 500);
        const shouldClean = cleanTextCheckbox.checked;
        const sectionsOnly = sectionsOnlyCheckbox.checked;

        if (startIdx > endIdx) {
            updateProgress(0,0,'Ошибка: начальная глава позже конечной.');
            setState(State.IDLE);
            return;
        }

        const chaptersToProcess = book.chapters.slice(startIdx, endIdx + 1);
        const totalChapters = chaptersToProcess.length;
        const collected = [];

        for (let i = 0; i < totalChapters; i++) {
            if (stopProcessing) { updateProgress(i, totalChapters, `Остановлено. Собрано ${i} из ${totalChapters}`); break; }
            const ch = chaptersToProcess[i];
            updateProgress(i+1, totalChapters, `Загрузка: ${ch.title}`);
            try {
                const doc = await fetchDocument(ch.url);
                let content = doc.querySelector('div.reader-text, .read__content, .fullstory-content, .text, #read, #article') || doc.querySelector('article, .post-content');
                if (!content) throw new Error('Текст главы не найден');
                if (shouldClean) content = cleanupHtml(content.cloneNode(true));
                const paragraphs = Array.from(content.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0).map(p => `<p>${p.innerHTML.trim()}</p>`).join('\n');
                collected.push({ title: ch.title, content: paragraphs || `<p>${(content.textContent||'').trim()}</p>` });
            } catch (e) {
                console.error('Ошибка главы:', ch.title, e);
                updateProgress(i+1, totalChapters, `Ошибка при загрузке: ${ch.title}`);
                collected.push({ title: ch.title, content: `<p>Ошибка загрузки главы: ${escapeXml(e.message || 'неизвестно')}</p>` });
            }
            if (i < totalChapters - 1) await new Promise(r => setTimeout(r, delay));
        }

        if (collected.length === 0) { updateProgress(0,0,'Ни одной главы не загружено.'); setState(State.IDLE); return; }

        setState(State.GENERATING);
        updateProgress(collected.length, totalChapters, 'Генерация файла...');

        const safeFileTitle = (book.title || 'book').replace(/[\\/:"*?<>|]+/g,'_');
        const fileName = `${safeFileTitle}_Главы_${startIdx + 1}-${startIdx + collected.length}.${format}`;

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
        updateProgress(collected.length, totalChapters, 'Готово.');
        setTimeout(()=>setState(State.IDLE), 1000);
    }

    // --- UI ---
    function createUI() {
        if (document.getElementById('ranobe-parser-ui')) return;
        ui = document.createElement('div');
        ui.id = 'ranobe-parser-ui';
        ui.style.zIndex = '99999';
        ui.innerHTML = `
            <div class="parser-header"><h2>Парсер — FB2 & TXT</h2><button id="parser-close-btn">&times;</button></div>
            <div class="parser-body">
                <button id="parser-initialize-btn">Инициализировать</button>
                <div id="parser-main-controls">
                    <div class="parser-row"><label>С главы:</label><select id="parser-start-chapter"></select></div>
                    <div class="parser-row"><label>По главу:</label><select id="parser-end-chapter"></select></div>
                    <div class="parser-row"><label for="parser-delay">Задержка (мс):</label><input type="number" id="parser-delay" value="500" min="100"></div>
                    <div class="parser-row parser-checkboxes">
                        <label><input type="checkbox" id="parser-clean-text" checked> Очищать текст</label>
                        <label><input type="checkbox" id="parser-sections-only"> Только секции (FB2)</label>
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
        startChapterSelect = document.getElementById('parser-start-chapter'); endChapterSelect = document.getElementById('parser-end-chapter');
        progressBar = document.getElementById('parser-progress-bar'); progressText = document.getElementById('parser-progress-text');
        downloadFb2Btn = document.getElementById('parser-download-fb2'); downloadTxtBtn = document.getElementById('parser-download-txt');
        stopBtn = document.getElementById('parser-stop-btn'); delayInput = document.getElementById('parser-delay');
        cleanTextCheckbox = document.getElementById('parser-clean-text'); sectionsOnlyCheckbox = document.getElementById('parser-sections-only');
        forceRefreshBtn = document.getElementById('parser-refresh-cache'); clearCacheBtn = document.getElementById('parser-clear-cache');
        initializeBtn = document.getElementById('parser-initialize-btn'); mainControlsContainer = document.getElementById('parser-main-controls');
        footerContainer = document.querySelector('.parser-footer');
    }

    function addEventListeners() {
        document.getElementById('parser-close-btn').addEventListener('click', ()=> ui.style.display='none');
        initializeBtn.addEventListener('click', ()=> initialize(false));
        downloadFb2Btn.addEventListener('click', ()=> processChapters('fb2'));
        downloadTxtBtn.addEventListener('click', ()=> processChapters('txt'));
        stopBtn.addEventListener('click', ()=> stopProcessing = true);
        forceRefreshBtn.addEventListener('click', ()=> initialize(true));
        clearCacheBtn.addEventListener('click', ()=> {
            if (book.url) GM_deleteValue(book.url);
            updateProgress(0,0,"Кэш очищен.");
            startChapterSelect.innerHTML=''; endChapterSelect.innerHTML='';
            setState(State.PENDING_INIT);
        });
    }

    function addStyles() {
        GM_addStyle(`
            #ranobe-parser-ui { position: fixed; top: 20px; right: 20px; width: 360px; background:#2c2c2e; color:#f0f0f0; border: 1px solid #444; border-radius:8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
            .parser-header{display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:#3a3a3c;border-bottom:1px solid #444;border-radius:8px 8px 0 0;cursor:move}
            .parser-header h2{margin:0;font-size:16px}
            #parser-close-btn{background:none;border:none;color:#f0f0f0;font-size:24px;cursor:pointer;line-height:1;padding:0 5px;}
            .parser-body, .parser-footer{padding:15px}
            .parser-row{display:flex;align-items:center;margin-bottom:12px}
            .parser-row label{flex:1}
            .parser-row select,.parser-row input{flex:2;padding:6px;background:#3a3a3c;color:#f0f0f0;border:1px solid #555;border-radius:4px}
            .parser-checkboxes{flex-direction:column;align-items:flex-start} .parser-checkboxes label { margin-bottom: 5px; cursor: pointer; }
            .parser-actions{display:flex;gap:10px;margin-top:15px}
            #parser-initialize-btn, .parser-actions button, #parser-stop-btn, .parser-footer button { padding: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; transition: background-color 0.2s; }
            .parser-actions button{flex:1}
            #parser-initialize-btn { width: 100%; background-color: #007aff; margin-bottom: 10px; }
            #parser-download-fb2{background:#007aff}
            #parser-download-txt{background:#34c759}
            #parser-stop-btn{background:#ff3b30;width:100%;margin-top:10px}
            .parser-progress-container{width:100%;background:#444;border-radius:5px;overflow:hidden;height:10px;margin-top:15px}
            #parser-progress-bar{height:10px;width:0;background:#007aff;transition:width .25s}
            #parser-progress-text{text-align:center;margin-top:8px;font-size:12px;min-height:1.2em}
            .parser-footer{display:flex;gap:10px;padding-top:10px;border-top:1px solid #444;}
            .parser-footer button{flex:1;background:#555;font-size:12px;padding:8px}
            button:disabled { background-color: #555 !important; cursor: not-allowed !important; }
            button:not(:disabled):hover { opacity: 0.8; }
        `);
    }

    function makeDraggable(header) {
        let pos1=0, pos2=0, pos3=0, pos4=0;
        header.onmousedown = (e) => {
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = ()=> { document.onmouseup=null; document.onmousemove=null; };
            document.onmousemove = (ev) => {
                ev.preventDefault();
                pos1 = pos3 - ev.clientX; pos2 = pos4 - ev.clientY;
                pos3 = ev.clientX; pos4 = ev.clientY;
                ui.style.top = `${ui.offsetTop - pos2}px`;
                ui.style.left = `${ui.offsetLeft - pos1}px`;
            };
        };
    }

    function populateChapterSelectors() {
        startChapterSelect.innerHTML = ''; endChapterSelect.innerHTML = '';
        if (!book.chapters || !book.chapters.length) return;
        book.chapters.forEach((ch, i) => {
            const o1 = document.createElement('option');
            o1.value = String(i); o1.textContent = ch.title || `Глава ${i+1}`;
            startChapterSelect.appendChild(o1);
            endChapterSelect.appendChild(o1.cloneNode(true));
        });
        endChapterSelect.selectedIndex = book.chapters.length - 1;
        const currentIdx = book.chapters.findIndex(ch => ch.url === window.location.href);
        if (currentIdx !== -1) { startChapterSelect.selectedIndex = currentIdx; endChapterSelect.selectedIndex = currentIdx; }
    }

    // --- Initialization ---
    async function initialize(forceRefresh = false) {
        if (currentState === State.INITIALIZING) return;
        setState(State.INITIALIZING);
        updateProgress(0,0,'Определение книги...');
        const path = window.location.pathname;
        let bookUrl = null;
        try {
            if (path.startsWith('/ranobe/')) {
                bookUrl = window.location.href.split('?')[0].split('#')[0];
            } else if (path.startsWith('/chapters/')) {
                const selectors = [
                    '.category a[href*="/ranobe/"][rel="up"]',        // From chapter text page (most specific)
                    '.cat_block h5 a[href*="/ranobe/"]',                // From chapter list page
                    '.breadcrumbs-item a[href*="/ranobe/"]',           // Generic breadcrumbs
                    '.m-title a[href*="/ranobe/"]',                     // Mobile title
                    'a.desert-title'                                    // Another possible title link
                ];
                const ranobeLink = selectors.map(s => document.querySelector(s)).find(el => el);

                if (ranobeLink) {
                    bookUrl = new URL(ranobeLink.href, window.location.origin).href;
                } else {
                     throw new Error('не найдена главная страница книги.');
                }
            } else {
                throw new Error('Не на странице ranobe/ или chapters/.');
            }

            book.url = bookUrl;
            const cached = GM_getValue(book.url);
            if (cached && !forceRefresh && cached.chapters && cached.chapters.length) {
                Object.assign(book, cached);
                updateProgress(0,0,'Данные загружены из кэша.');
            } else {
                updateProgress(0,0,'Получение информации о книге...');
                const doc = (window.location.href.split('?')[0].split('#')[0] === book.url) ? document : await fetchDocument(book.url);
                const tocUrl = parseBookInfo(doc);
                await fetchAllChapters(tocUrl);
                if (book.chapters.length > 0) {
                    const bookToCache = { title: book.title, author: book.author, annotation: book.annotation, chapters: book.chapters, genres: book.genres, sequenceName: book.sequenceName, year: book.year, srcLang: book.srcLang, translator: book.translator, publisher: book.publisher };
                    try { GM_setValue(book.url, bookToCache); } catch(e) { console.warn('Не удалось записать в кэш', e); }
                }
            }

            if (book.chapters.length > 0) {
                populateChapterSelectors();
                updateProgress(0,0,`Готово. Глав: ${book.chapters.length}`);
                setState(State.IDLE);
            } else {
                updateProgress(0,0,'Главы не найдены. Возможно структура сайта изменилась.');
                setState(State.PENDING_INIT);
            }
        } catch (err) {
            console.error(err);
            updateProgress(0,0,`Ошибка: ${err.message}`);
            setState(State.PENDING_INIT);
        }
    }

    // Start
    if (window.location.pathname.startsWith('/ranobe/') || window.location.pathname.startsWith('/chapters/')) createUI();

})();