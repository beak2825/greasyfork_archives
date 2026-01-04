// ==UserScript==
// @name         Парсер Royal Road — FB2 & TXT
// @version      0.1
// @description  Извлекает главы с royalroad.com и сохраняет их в FB2 или TXT
// @match        *://www.royalroad.com/fiction/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @connect      www.royalroad.com
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552519/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20Royal%20Road%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552519/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20Royal%20Road%20%E2%80%94%20FB2%20%20TXT.meta.js
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
        annotation: 'Аннотация отсутствует.',
        chapters: [],
        genres: [],
        sequenceName: null,
        lang: 'en', // Default language
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
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        if (responseType === 'text') resolve(res.responseText);
                        else resolve(res.response);
                    } else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: err => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout')),
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
        const isPending = newState === State.PENDING_INIT;

        if (mainControlsContainer) mainControlsContainer.style.display = isPending ? 'none' : 'block';
        if (footerContainer) footerContainer.style.display = isPending ? 'none' : 'flex';
        if (initializeBtn) initializeBtn.style.display = isPending ? 'block' : 'none';

        if (downloadFb2Btn) downloadFb2Btn.disabled = !isIdle;
        if (downloadTxtBtn) downloadTxtBtn.disabled = !isIdle;
        if (stopBtn) {
            stopBtn.style.display = isProcessing ? 'block' : 'none';
            stopBtn.disabled = false;
            stopBtn.textContent = 'Остановить';
        }

        const controls = [startChapterSelect, endChapterSelect, delayInput, sectionsOnlyCheckbox, forceRefreshBtn, clearCacheBtn];
        controls.forEach(el => { if (el) el.disabled = !isIdle; });
    }

    function updateProgress(current, total, message = '') {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message || `Обработка: ${current} из ${total} (${percentage}%)`;
    }

    // --- Parsing ---
    function safeText(node) { return node ? node.textContent.trim() : ''; }

    function cleanAnnotationHtml(html) {
        if (!html) return '<p></p>';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        tempDiv.querySelectorAll('hr, label, br').forEach(el => el.remove());

        tempDiv.querySelectorAll('span').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            }
        });

        tempDiv.querySelectorAll('*').forEach(el => {
            const attrs = Array.from(el.attributes);
            attrs.forEach(attr => el.removeAttribute(attr.name));
        });

        return tempDiv.innerHTML.trim();
    }


    function parseChaptersFromScript(doc) {
        const scripts = Array.from(doc.getElementsByTagName('script'));
        const chapterScript = scripts.find(s => s.textContent.includes('window.chapters = '));
        if (!chapterScript) {
             throw new Error("Не удалось найти скрипт с главами (window.chapters).");
        }

        const match = chapterScript.textContent.match(/window\.chapters\s*=\s*(\[.+?\]);/s);
        if (match && match[1]) {
            const parsedChapters = JSON.parse(match[1]);
            book.chapters = parsedChapters.map(ch => ({
                title: ch.title,
                url: new URL(ch.url, window.location.origin).href
            }));
        } else {
            throw new Error("Не удалось извлечь JSON глав из скрипта.");
        }
    }


    async function parseBookInfo(doc) {
        book.lang = doc.documentElement.getAttribute('lang') || 'en';
        book.title = safeText(doc.querySelector('h1.font-white')) || 'Без названия';
        book.author = safeText(doc.querySelector('h4 > span > a[href*="/profile/"]')) || 'Неизвестен';

        const annEl = doc.querySelector('div.description > div.hidden-content');
        if (annEl) {
            book.annotation = cleanAnnotationHtml(annEl.innerHTML);
        }

        book.genres = Array.from(doc.querySelectorAll('.tags a.fiction-tag')).map(safeText);
        book.sequenceName = null;

        parseChaptersFromScript(doc);

        if (book.chapters.length === 0) {
            throw new Error("Главы не найдены. Возможно, изменилась структура сайта.");
        }
    }

    function cleanupHtml(content) {
        if (!content) return content;
        const selectorsToRemove = [
            'script', 'style', 'noscript', 'iframe',
            'div[id^="google_ads_iframe"]',
            'div[process-adn="true"]',                 // Ads (Robust Selector)
            '.portlet.solid.author-note-portlet',      // Author's Note
            '.row.nav-buttons',                         // Chapter navigation
            'hr',                                       // Horizontal lines separating content
            '.portlet-footer',                          // Footer with RSS
            '#comments',
            '.comments-container',                      // Comments
            '.profile',                                 // Author profile at bottom
            '#donate'                                   // Donation prompt
        ];
        selectorsToRemove.forEach(s => content.querySelectorAll(s).forEach(e => e.remove()));

        content.querySelectorAll('span').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            }
        });

        content.querySelectorAll('p:empty').forEach(p => p.remove());

        Array.from(content.querySelectorAll('*')).forEach(el => {
            ['style', 'onclick', 'onmouseover', 'onerror', 'class', 'id', 'data-original-margin'].forEach(attr => { if (el.hasAttribute(attr)) el.removeAttribute(attr); });
        });
        return content;
    }

    function escapeXml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>&'"]/g, c => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'}[c]));
    }

    // --- File Generation ---
    function generateFb2(chaptersData, sectionsOnly = false) {
        const today = new Date().toISOString().split('T')[0];
        const sections = chaptersData.map(ch => `<section><title><p>${escapeXml(ch.title)}</p></title>${ch.content}</section>`).join('\n');

        if (sectionsOnly) return `<body>\n${sections}\n</body>`;

        const safeTitle = escapeXml(book.title);
        const safeAuthor = escapeXml(book.author);
        const sequenceTag = book.sequenceName ? `<sequence name="${escapeXml(book.sequenceName)}" />` : '';
        const genresXml = book.genres.map(g => `<genre>${escapeXml(g.toLowerCase().replace(/\s+/g, '_'))}</genre>`).join('\n        ');

        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        ${genresXml}
        <author><nickname>${safeAuthor}</nickname></author>
        <book-title>${safeTitle}</book-title>
        ${sequenceTag}
        <annotation>${book.annotation}</annotation>
        <lang>${escapeXml(book.lang)}</lang>
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
            temp.innerHTML = ch.content.replace(/<\/p>/g, '</p>\n');
            const text = temp.textContent || "";
            return `Глава: ${ch.title}\n\n${text.trim()}`;
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

        let startIdx = parseInt(startChapterSelect.value, 10);
        let endIdx = parseInt(endChapterSelect.value, 10);

        if (isNaN(startIdx)) startIdx = 0;
        if (isNaN(endIdx)) endIdx = book.chapters.length - 1;

        const delay = Math.max(100, parseInt(delayInput.value, 10) || 500);
        const sectionsOnly = sectionsOnlyCheckbox.checked;

        if (startIdx > endIdx) {
            updateProgress(0, 0, 'Ошибка: начальная глава позже конечной.');
            setState(State.IDLE);
            return;
        }

        const chaptersToProcess = book.chapters.slice(startIdx, endIdx + 1);
        const totalChapters = chaptersToProcess.length;
        const collected = [];
        let finalMessage = '';

        for (let i = 0; i < totalChapters; i++) {
            if (stopProcessing) {
                finalMessage = `Процесс остановлен пользователем. Собрано ${i} глав.`;
                updateProgress(i, totalChapters, finalMessage);
                break;
            }
            const ch = chaptersToProcess[i];
            updateProgress(i + 1, totalChapters, `Загрузка: ${ch.title}`);
            try {
                const doc = await fetchDocument(ch.url);
                let contentEl = doc.querySelector('div.chapter-inner.chapter-content');
                if (!contentEl) throw new Error('Текст главы не найден');

                contentEl = cleanupHtml(contentEl.cloneNode(true));

                const content = Array.from(contentEl.querySelectorAll('p'))
                    .map(p => `<p>${p.innerHTML.trim()}</p>`)
                    .join('\n');
                collected.push({ title: ch.title, content });
            } catch (e) {
                console.error('Ошибка главы:', ch.title, e);
                finalMessage = `Остановлено из-за ошибки на главе "${ch.title}"`;
                updateProgress(i, totalChapters, finalMessage);
                break; // Stop processing on error
            }
            if (i < totalChapters - 1) await new Promise(r => setTimeout(r, delay));
        }

        if (collected.length === 0 && !finalMessage) {
             updateProgress(0,0,'Ни одной главы не загружено.');
             setState(State.IDLE);
             return;
        }

        if (collected.length > 0) {
            setState(State.GENERATING);
            updateProgress(collected.length, totalChapters, 'Генерация файла...');

            const safeFileTitle = (book.title || 'book').replace(/[\\/:"*?<>|]+/g, '_');
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
        }

        if (!finalMessage) {
            finalMessage = `Готово. Успешно скачано: ${collected.length} глав.`;
        }
        updateProgress(collected.length, totalChapters, finalMessage);

        setTimeout(() => setState(State.IDLE), 4000); // Longer timeout to read the message
    }

    // --- UI ---
    function createUI() {
        if (document.getElementById('rr-parser-ui')) return;
        ui = document.createElement('div');
        ui.id = 'rr-parser-ui';
        ui.style.zIndex = '99999';
        ui.innerHTML = `
            <div class="parser-header"><h2>Парсер Royal Road</h2><button id="parser-close-btn">&times;</button></div>
            <div class="parser-body">
                <button id="parser-initialize-btn">Инициализировать</button>
                <div id="parser-main-controls" style="display:none;">
                    <div class="parser-row"><label>С главы:</label><select id="parser-start-chapter"></select></div>
                    <div class="parser-row"><label>По главу:</label><select id="parser-end-chapter"></select></div>
                    <div class="parser-row"><label for="parser-delay">Задержка (мс):</label><input type="number" id="parser-delay" value="500" min="100"></div>
                    <div class="parser-row parser-checkboxes">
                        <label><input type="checkbox" id="parser-sections-only"> Только секции (FB2)</label>
                    </div>
                    <div class="parser-actions">
                        <button id="parser-download-fb2">Скачать FB2</button>
                        <button id="parser-download-txt">Скачать TXT</button>
                    </div>
                </div>
                <div class="parser-progress-container"><div id="parser-progress-bar"></div></div>
                <p id="parser-progress-text">Нажмите "Инициализировать" для начала</p>
                <button id="parser-stop-btn" style="display:none">Остановить</button>
            </div>
            <div class="parser-footer" style="display:none;">
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
        sectionsOnlyCheckbox = document.getElementById('parser-sections-only');
        forceRefreshBtn = document.getElementById('parser-refresh-cache'); clearCacheBtn = document.getElementById('parser-clear-cache');
        initializeBtn = document.getElementById('parser-initialize-btn'); mainControlsContainer = document.getElementById('parser-main-controls');
        footerContainer = document.querySelector('.parser-footer');
    }

    function addEventListeners() {
        document.getElementById('parser-close-btn').addEventListener('click', () => ui.remove());
        initializeBtn.addEventListener('click', () => initialize(false));
        downloadFb2Btn.addEventListener('click', () => processChapters('fb2'));
        downloadTxtBtn.addEventListener('click', () => processChapters('txt'));
        stopBtn.addEventListener('click', () => {
            stopProcessing = true;
            stopBtn.disabled = true;
            stopBtn.textContent = 'Остановка...';
        });
        forceRefreshBtn.addEventListener('click', () => initialize(true));
        clearCacheBtn.addEventListener('click', () => {
            if (book.url) GM_deleteValue(book.url);
            updateProgress(0, 0, "Кэш очищен.");
            startChapterSelect.innerHTML = ''; endChapterSelect.innerHTML = '';
            setState(State.PENDING_INIT);
        });
    }

    function addStyles() {
        GM_addStyle(`
            #rr-parser-ui { position: fixed; top: 20px; right: 20px; width: 360px; background:#2c2c2e; color:#f0f0f0; border: 1px solid #444; border-radius:8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
            .parser-header{display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:#3a3a3c;border-bottom:1px solid #444;border-radius:8px 8px 0 0;cursor:move}
            .parser-header h2{margin:0;font-size:16px}
            #parser-close-btn{background:none;border:none;color:#f0f0f0;font-size:24px;cursor:pointer;line-height:1;padding:0 5px;}
            .parser-body, .parser-footer{padding:15px}
            .parser-row{display:flex;align-items:center;margin-bottom:12px}
            .parser-row label{flex:1}
            .parser-row select, .parser-row input {
                flex: 2;
                padding: 6px;
                background: #3a3a3c;
                color: #f0f0f0;
                border: 1px solid #555;
                border-radius: 4px;
                min-width: 0; /* Prevent flex item from overflowing its container */
                text-overflow: ellipsis; /* Add ... for long text in the select box */
            }
            .parser-checkboxes{flex-direction:column;align-items:flex-start} .parser-checkboxes label { margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .parser-actions{display:flex;gap:10px;margin-top:15px}
            #parser-initialize-btn, .parser-actions button, #parser-stop-btn, .parser-footer button { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; }
            .parser-actions button{flex:1}
            #parser-initialize-btn { background-color: #007aff; }
            #parser-download-fb2{background:#007aff}
            #parser-download-txt{background:#34c759}
            #parser-stop-btn{background:#ff3b30;margin-top:10px}
            .parser-progress-container{width:100%;background:#444;border-radius:5px;overflow:hidden;height:10px;margin-top:15px}
            #parser-progress-bar{height:10px;width:0;background:#007aff;transition:width .25s}
            #parser-progress-text{text-align:center;margin-top:8px;font-size:12px;min-height:1.2em}
            .parser-footer{display:flex;gap:10px;padding-top:10px;border-top:1px solid #444;}
            .parser-footer button{flex:1;background:#555;font-size:12px;padding:8px}
            button:disabled { background-color: #555 !important; color: #aaa !important; cursor: not-allowed !important; }
            button:not(:disabled):hover { opacity: 0.8; }
        `);
    }

    function makeDraggable(header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
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
            const opt = document.createElement('option');
            const titleText = ch.title || `Глава ${i+1}`;
            opt.value = String(i);
            opt.textContent = titleText;
            opt.title = titleText; // Add title attribute for tooltip on hover
            startChapterSelect.add(opt);
            endChapterSelect.add(opt.cloneNode(true));
        });
        endChapterSelect.selectedIndex = book.chapters.length - 1;

        const currentUrl = window.location.href.split('?')[0].split('#')[0];
        const currentIdx = book.chapters.findIndex(ch => ch.url === currentUrl);
        if (currentIdx !== -1) {
            startChapterSelect.selectedIndex = currentIdx;
            endChapterSelect.selectedIndex = currentIdx;
        }
    }

    // --- Initialization ---
    async function initialize(forceRefresh = false) {
        if (currentState === State.INITIALIZING) return;
        setState(State.INITIALIZING);
        updateProgress(0, 0, 'Определение книги...');

        try {
            let bookUrl;
            const pathSegments = window.location.pathname.split('/').filter(Boolean);

            if (pathSegments[0] === 'fiction' && pathSegments[1]) {
                bookUrl = `${window.location.origin}/fiction/${pathSegments[1]}`;
            } else {
                 throw new Error('Не удалось определить ID произведения из URL.');
            }

            book.url = bookUrl;
            const cached = GM_getValue(book.url);
            if (cached && !forceRefresh && cached.chapters && cached.chapters.length) {
                Object.assign(book, cached);
                updateProgress(0, 0, 'Данные загружены из кэша.');
            } else {
                updateProgress(0, 0, 'Получение информации о книге...');
                const mainDoc = await fetchDocument(book.url);
                await parseBookInfo(mainDoc);
                const bookToCache = { ...book };
                try { GM_setValue(book.url, bookToCache); } catch(e) { console.warn('Не удалось записать в кэш', e); }
            }

            if (book.chapters.length > 0) {
                 if (book.chapters.length > 1500) {
                    updateProgress(0, 0, `Внимание: ${book.chapters.length} глав. Возможны зависания...`);
                    await new Promise(r => setTimeout(r, 2500));
                }
                populateChapterSelectors();
                updateProgress(0, 0, `Готово. Глав: ${book.chapters.length}`);
                setState(State.IDLE);
            } else {
                updateProgress(0, 0, 'Главы не найдены.');
                setState(State.PENDING_INIT);
            }
        } catch (err) {
            console.error(err);
            updateProgress(0, 0, `Ошибка: ${err.message}`);
            setState(State.PENDING_INIT);
        }
    }

    // Start
    if (window.location.pathname.startsWith('/fiction/')) {
        createUI();
    }

})();