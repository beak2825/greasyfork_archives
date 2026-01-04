// ==UserScript==
// @name         IFreedom.su & Bookhamster.ru Parser Exporter — FB2 & TXT
// @version      0.22
// @description  Парсер текста форматах FB2 и TXT с страницы сайта ifreedom.su и bookhamster.ru
// @match        https://ifreedom.su/ranobe/*
// @match        https://ifreedom.su/*/*
// @match        https://bookhamster.ru/ranobe/*
// @match        https://bookhamster.ru/*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      ifreedom.su
// @connect      bookhamster.ru
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-idle
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/551655/IFreedomsu%20%20Bookhamsterru%20Parser%20Exporter%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/551655/IFreedomsu%20%20Bookhamsterru%20Parser%20Exporter%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Состояния ---
    const STATE = {
        PRE_INIT: 'PRE_INIT', // Ожидание инициализации
        IDLE: 'IDLE',         // Готов к работе (главы собраны)
        COLLECTING: 'COLLECTING', // Сбор списка глав
        DOWNLOADING: 'DOWNLOADING', // Загрузка глав
        STOPPED: 'STOPPED'      // Остановлен пользователем
    };
    let currentState = STATE.PRE_INIT;
    let stopFlag = false;

    let bookInfo = {
        title: 'Без названия',
        author: 'Неизвестен',
        translator: '',
        annotation: '<p>Аннотация не найдена.</p>',
        genre: 'sf_fantasy',
        mainPageUrl: ''
    };
    let chapterList = [];

    // --- Функции кэширования ---
    const getCacheKey = () => `exporter_cache_${bookInfo.mainPageUrl}`;
    const saveChaptersToCache = (chapters) => {
        try {
            const data = { timestamp: new Date().getTime(), chapters };
            localStorage.setItem(getCacheKey(), JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения кэша:', e);
            updateStatus('Ошибка сохранения кэша.', true);
        }
    };
    const loadChaptersFromCache = () => {
        try {
            const data = localStorage.getItem(getCacheKey());
            return data ? JSON.parse(data).chapters : null;
        } catch (e) {
            console.error('Ошибка загрузки из кэша:', e);
            return null;
        }
    };
    const clearCache = () => {
        if (currentState !== STATE.IDLE && currentState !== STATE.PRE_INIT) return;
        localStorage.removeItem(getCacheKey());
        updateStatus('Кэш для этой книги очищен.');
        document.getElementById('gm-start-chapter').innerHTML = '<option>...</option>';
        document.getElementById('gm-end-chapter').innerHTML = '<option>...</option>';
        chapterList = [];
        setUIState(STATE.PRE_INIT);
    };

    // --- Вспомогательные функции ---
    const fetchPage = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(new Error(`HTTP ${r.status}`)),
            onerror: r => reject(new Error(`Network error: ${r.statusText}`))
        });
    });

    const sanitizeFilename = (name) => (name || 'book').replace(/[\/\\:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().substring(0, 100);

    const escapeXML = (str) => (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[m]);

    const mapGenreToFb2 = (genreText) => {
        const g = genreText.toLowerCase().trim();
        const map = {
            'романтика': 'love_roman', 'любовный роман': 'love_roman', 'сёдзё': 'love_shoujo',
            'фэнтези': 'sf_fantasy', 'научная фантастика': 'sf_sci_fi',
            'боевик': 'sf_action', 'экшн': 'sf_action', 'приключения': 'adventure',
            'боевые искусства': 'sf_martial_arts',
            'детектив': 'det_classic', 'мистика': 'sf_mystic', 'ужасы': 'sf_horror', 'триллер': 'thriller',
            'игра': 'sf_game', 'литрпг': 'litrpg', 'виртуальный мир': 'sf_game',
            'комедия': 'humor_anecdote', 'повседневность': 'prose_contemporary', 'сверхъестественное': 'sf_mystic'
        };
        for (const key in map) if (g.includes(key)) return map[key];
        return null;
    };


    // --- Логика UI ---
    function createUIPanel() {
        const panel = document.createElement('div');
        panel.id = 'gm-parser-panel';
        panel.innerHTML = `
            <div id="gm-parser-header">
                Экспорт Ранобэ <span id="gm-parser-close">&times;</span>
            </div>
            <div id="gm-parser-body">
                <div class="gm-parser-row">
                    <label for="gm-start-chapter">С:</label>
                    <select id="gm-start-chapter"><option>...</option></select>
                    <label for="gm-end-chapter">По:</label>
                    <select id="gm-end-chapter"><option>...</option></select>
                </div>
                <div class="gm-parser-row gm-parser-timings">
                    <label for="gm-collect-delay">Сбор (мс):</label>
                    <input type="number" id="gm-collect-delay" value="50" min="0">
                    <label for="gm-delay">Скач. (мс):</label>
                    <input type="number" id="gm-delay" value="200" min="50">
                </div>
                <div class="gm-parser-row gm-parser-checkboxes">
                    <label><input type="checkbox" id="gm-clean-text" checked> Очистка</label>
                    <label><input type="checkbox" id="gm-fb2-sections-only"> Только секции (FB2)</label>
                </div>
                <div id="gm-parser-cache-buttons">
                    <button id="gm-init-parser">Инициализировать</button>
                    <button id="gm-update-cache">Обновить кэш</button>
                    <button id="gm-clear-cache">Очистить кэш</button>
                </div>
                <div id="gm-parser-status">Готов к инициализации...</div>
                <div id="gm-parser-progress-bar"><div id="gm-parser-progress"></div></div>
                <div id="gm-parser-buttons">
                    <button id="gm-download-fb2" disabled>Скачать FB2</button>
                    <button id="gm-download-txt" disabled>Скачать TXT</button>
                    <button id="gm-stop-download" disabled>Остановить</button>
                </div>
            </div>`;
        document.body.appendChild(panel);
        addEventListenersToPanel();
        makeDraggable(panel);
        setUIState(STATE.PRE_INIT);
    }

    function setUIState(newState) {
        currentState = newState;
        const isPreInit = newState === STATE.PRE_INIT;
        const isIdle = newState === STATE.IDLE || newState === STATE.STOPPED;
        const isWorking = newState === STATE.COLLECTING || newState === STATE.DOWNLOADING;

        document.getElementById('gm-init-parser').disabled = !isPreInit;
        document.getElementById('gm-update-cache').disabled = isWorking || isPreInit;
        document.getElementById('gm-clear-cache').disabled = isWorking;
        document.getElementById('gm-download-fb2').disabled = !isIdle || chapterList.length === 0;
        document.getElementById('gm-download-txt').disabled = !isIdle || chapterList.length === 0;
        document.getElementById('gm-stop-download').disabled = !isWorking;

        const inputs = ['gm-start-chapter', 'gm-end-chapter', 'gm-delay', 'gm-collect-delay'];
        inputs.forEach(id => document.getElementById(id).disabled = isWorking || isPreInit);

        if (newState === STATE.STOPPED) updateStatus('Операция остановлена пользователем.');
        if (isPreInit) updateStatus('Нажмите "Инициализировать" для начала.');
    }

    function addEventListenersToPanel() {
        document.getElementById('gm-parser-close').onclick = () => document.getElementById('gm-parser-panel').style.display = 'none';
        document.getElementById('gm-init-parser').onclick = () => startInitialization(false);
        document.getElementById('gm-update-cache').onclick = () => startInitialization(true);
        document.getElementById('gm-clear-cache').onclick = clearCache;
        document.getElementById('gm-download-fb2').onclick = () => handleDownloadClick('fb2');
        document.getElementById('gm-download-txt').onclick = () => handleDownloadClick('txt');
        document.getElementById('gm-stop-download').onclick = () => { stopFlag = true; };
    }

    const updateStatus = (message, isError = false) => {
        const el = document.getElementById('gm-parser-status');
        if (el) {
            el.textContent = message;
            el.style.color = isError ? '#ff4d4d' : '#e0e0e0';
        }
    };
    const updateProgress = (current, total) => {
        const el = document.getElementById('gm-parser-progress');
        if (el) el.style.width = total > 0 ? `${(current / total) * 100}%` : '0%';
    };

    function populateChapterDropdowns() {
        if (chapterList.length === 0) return;
        const startSelect = document.getElementById('gm-start-chapter');
        const endSelect = document.getElementById('gm-end-chapter');
        const options = chapterList.map((ch, i) => `<option value="${i}">${ch.title}</option>`).join('');
        startSelect.innerHTML = endSelect.innerHTML = options;
        endSelect.selectedIndex = chapterList.length - 1;

        if (document.querySelector('div.entry-content, .single-select')) {
            const currentUrl = window.location.href.split('?')[0].split('#')[0];
            const currentIndex = chapterList.findIndex(c => c.url.split('?')[0].split('#')[0] === currentUrl);
            if (currentIndex !== -1) {
                startSelect.selectedIndex = endSelect.selectedIndex = currentIndex;
            }
        }
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector("#gm-parser-header");
        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    // --- Логика парсинга ---
    async function gatherMetadata(doc) {
        bookInfo.title = doc.querySelector('h1.entry-title, .ranobe-book h1')?.textContent.trim() || 'Без названия';

        // Парсинг структурированных данных
        doc.querySelectorAll('.data-ranobe').forEach(item => {
            const key = item.querySelector('.data-key b')?.textContent.trim();
            const valueEl = item.querySelector('.data-value');
            if (!key || !valueEl) return;

            const valueText = valueEl.textContent.trim();
            switch (key) {
                case 'Автор': if (valueText !== 'Не указан') bookInfo.author = valueText; break;
                case 'Переводчик': bookInfo.translator = valueText; break;
                case 'Жанры':
                    const firstGenre = valueEl.querySelector('a')?.textContent;
                    if (firstGenre) {
                        const fb2Genre = mapGenreToFb2(firstGenre);
                        if (fb2Genre) bookInfo.genre = fb2Genre;
                    }
                    break;
            }
        });
        if (!bookInfo.translator) bookInfo.translator = bookInfo.author;

        // Умный парсинг аннотации
        const descElem = doc.querySelector('.descr-ranobe');
        if (descElem) {
            const openDescSpan = descElem.querySelector('span.open-desc');
            if (openDescSpan) {
                const onclickAttr = openDescSpan.getAttribute('onclick');
                const match = onclickAttr.match(/innerHTML = '([\s\S]*)';/);
                if (match && match[1]) {
                    // Декодируем HTML-сущности
                    let annotationHtml = match[1].replace(/&lt;br&gt;/g, '<br>');

                    // Убираем первую строку с названием, т.к. оно уже есть в <book-title>
                    annotationHtml = annotationHtml.replace(/^Название:.*?<br\s*\/?>/i, '');

                    // Преобразуем каждый <br> в отдельный параграф <p> для правильного форматирования
                    const paragraphs = annotationHtml.split(/<br\s*\/?>/);
                    bookInfo.annotation = paragraphs
                        .map(p => p.trim())      // Убираем лишние пробелы по краям
                        .filter(p => p)          // Убираем пустые строки, если были двойные <br><br>
                        .map(p => `<p>${p}</p>`) // Оборачиваем каждый абзац в теги
                        .join('\n');             // Соединяем всё вместе
                }
            } else {
                 bookInfo.annotation = `<p>${descElem.textContent.replace('Прочесть полностью', '').trim()}</p>`;
            }
        }
    }

    async function collectChapters(doc) {
        let chapterElements = [...doc.querySelectorAll('.chapter-list a, .chapters-list a, .menu-ranobe a, .li-ranobe a')];
        let chapters = [];

        if (chapterElements.length > 0) {
            chapters = chapterElements.map(a => ({ title: a.textContent.trim(), url: a.href }));
        } else {
            const select = doc.querySelector('.single-select, select[name="chapters"]');
            if (select) {
                chapters = [...select.options]
                    .map(opt => ({ title: opt.textContent.trim(), url: opt.value }))
                    .filter(chap => chap.url && !chap.title.includes('Выберите'));
            }
        }

        chapters = chapters.filter(chap => chap.url.includes('ifreedom.su') || chap.url.includes('bookhamster.ru'));

        const uniqueUrls = new Set();
        chapterList = chapters.reverse().filter(el => {
            const duplicate = uniqueUrls.has(el.url);
            uniqueUrls.add(el.url);
            return !duplicate;
        });

        if (chapterList.length === 0) throw new Error('Не удалось найти список глав.');
    }


    // --- Генерация файлов ---
    function generateFb2(data, settings) {
        const sections = data.map(ch => `<section><title><p>${escapeXML(ch.title)}</p></title>${ch.content}</section>`).join('\n');
        if (settings.sectionsOnly) return sections;

        const date = new Date().toISOString().split('T')[0];
        return `<?xml version="1.0" encoding="utf-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        <genre>${bookInfo.genre}</genre>
        <author><nickname>${escapeXML(bookInfo.author)}</nickname></author>
        <book-title>${escapeXML(bookInfo.title)}</book-title>
        <annotation>${bookInfo.annotation}</annotation>
        <lang>ru</lang>
    </title-info>
    <document-info>
        <author><nickname>Exporter Script</nickname></author>
        <program-used>UserScript v0.22</program-used>
        <date value="${date}">${date}</date>
        <id>bookhamster-${Date.now()}</id>
        <version>0.22</version>
    </document-info>
    <publish-info>
        <publisher>${escapeXML(bookInfo.translator)}</publisher>
    </publish-info>
</description>
<body>
    ${sections}
</body>
</FictionBook>`;
    }

    function generateTxt(data) {
        const tempDiv = document.createElement('div');
        let content = `${bookInfo.title}\nАвтор: ${bookInfo.author}\n\n`;
        tempDiv.innerHTML = bookInfo.annotation;
        content += `Описание: ${tempDiv.textContent.trim()}\n\n========================================\n\n`;

        data.forEach(chapter => {
            content += `\n\n${chapter.title}\n----------------------------------------\n`;
            tempDiv.innerHTML = chapter.content;
            content += (tempDiv.textContent || 'Содержимое главы недоступно').replace(/\n\s*\n/g, '\n\n').trim() + '\n';
        });
        return content;
    }


    // --- Основной поток выполнения ---
    async function handleDownloadClick(format) {
        if (currentState !== STATE.IDLE) return;
        stopFlag = false;
        setUIState(STATE.DOWNLOADING);

        const start = parseInt(document.getElementById('gm-start-chapter').value);
        const end = parseInt(document.getElementById('gm-end-chapter').value);
        const delay = parseInt(document.getElementById('gm-delay').value);
        const cleanText = document.getElementById('gm-clean-text').checked;
        const sectionsOnly = document.getElementById('gm-fb2-sections-only').checked;

        if (start > end) {
            updateStatus('Начальная глава не может быть больше конечной.', true);
            setUIState(STATE.IDLE);
            return;
        }

        const chaptersToDownload = chapterList.slice(start, end + 1);
        const total = chaptersToDownload.length;
        let downloadedData = [];

        for (let i = 0; i < total; i++) {
            if (stopFlag) {
                setUIState(STATE.STOPPED);
                break;
            }
            const chapter = chaptersToDownload[i];
            updateStatus(`Загрузка: ${chapter.title} (${i + 1}/${total})`);
            updateProgress(i + 1, total);

            try {
                let pageHtml = await fetchPage(chapter.url);
                let doc = new DOMParser().parseFromString(pageHtml, 'text/html');

                while (doc.querySelector('.wpcf7') && !stopFlag) {
                     updateStatus(`Обнаружена капча. Решите её в новой вкладке...`);
                     await handleCaptcha(chapter.url);
                     if (stopFlag) break;
                     updateStatus(`Проверка решения: ${chapter.title}...`);
                     pageHtml = await fetchPage(chapter.url);
                     doc = new DOMParser().parseFromString(pageHtml, 'text/html');
                }
                if (stopFlag) continue;

                const contentEl = doc.querySelector('div.entry-content, .post-content, .chapter-content');
                if (!contentEl) throw new Error('Не найден контент главы.');

                const content = cleanText ? cleanChapterHTML(contentEl) : contentEl.innerHTML;
                downloadedData.push({ title: chapter.title, content });

                if (i < total - 1) await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                updateStatus(`Ошибка на главе "${chapter.title}": ${error.message}`, true);
                setUIState(STATE.IDLE);
                return;
            }
        }

        if (downloadedData.length === 0) {
            updateStatus(stopFlag ? 'Процесс прерван.' : 'Не удалось скачать ни одной главы.', true);
            setUIState(STATE.IDLE);
            return;
        }

        updateStatus('Формирование файла...');
        const getChapterId = t => (t.match(/(?:Глава|Гл)\.?\s*([\d-]+)/i) || [null, t.slice(0, 10)])[1];
        const startId = getChapterId(chaptersToDownload[0].title);
        const endId = getChapterId(chaptersToDownload[chaptersToDownload.length - 1].title);
        const rangeStr = (total > 1 && startId !== endId) ? `(Гл ${startId}-${endId})` : `(Гл ${startId})`;
        const baseFilename = sanitizeFilename(`${bookInfo.title} ${rangeStr}`);

        const fileContent = format === 'fb2' ? generateFb2(downloadedData, { sectionsOnly }) : generateTxt(downloadedData);
        const mimeType = format === 'fb2' ? 'application/xml;charset=utf-8' : 'text/plain;charset=utf-8';
        saveAs(new Blob([fileContent], { type: mimeType }), `${baseFilename}.${format}`);

        updateStatus('Загрузка завершена!');
        updateProgress(0, 0);
        setUIState(STATE.IDLE);
    }

    function cleanChapterHTML(contentElement) {
        const clone = contentElement.cloneNode(true);
        const selectorsToRemove = [
            '.comments-area', '.wpdiscuz', '.social-share', '.navigation', '.related-posts',
            '.ads', '.banner', '.footer', '.header', '.sidebar', '.ad', '.yandex',
            '.adv', '.mob-adv', '.pc-adv', '.wpcf7', 'script', 'style', 'noscript'
        ];
        selectorsToRemove.forEach(sel => clone.querySelectorAll(sel).forEach(el => el.remove()));
        // Удаляем пустые теги
        clone.querySelectorAll('p, div').forEach(el => {
            if (!el.textContent.trim() && !el.querySelector('img')) el.remove();
        });
        return clone.innerHTML.replace(/\s{2,}/g, ' ');
    }

    async function handleCaptcha(url) {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            modal.id = 'gm-captcha-modal';
            modal.innerHTML = `
                <div>
                    <p>Пожалуйста, решите капчу в новой вкладке.</p>
                    <p>После этого закройте её и нажмите "Продолжить".</p>
                    <button id="gm-captcha-continue">Продолжить</button>
                </div>`;
            document.body.appendChild(modal);
            window.open(url, '_blank');
            document.getElementById('gm-captcha-continue').onclick = () => {
                modal.remove();
                resolve();
            };
        });
    }

    async function startInitialization(forceFetch = false) {
        try {
            const isChapterPage = !!document.querySelector('div.entry-content') || !!document.querySelector('.single-select');
            let mainPageDoc;

            if (isChapterPage) {
                const mainPageLinkEl = document.querySelector('.breadcrumbs a[href*="/ranobe/"], p > b > a');
                if (mainPageLinkEl) {
                    bookInfo.mainPageUrl = mainPageLinkEl.href;
                    const mainPageHtml = await fetchPage(bookInfo.mainPageUrl);
                    mainPageDoc = new DOMParser().parseFromString(mainPageHtml, 'text/html');
                } else {
                    throw new Error('Не найдена ссылка на главную страницу произведения.');
                }
            } else {
                bookInfo.mainPageUrl = window.location.href.split('?')[0];
                mainPageDoc = document;
            }

            await gatherMetadata(mainPageDoc);

            const cachedChapters = forceFetch ? null : loadChaptersFromCache();
            if (cachedChapters) {
                chapterList = cachedChapters;
                updateStatus(`Главы (${chapterList.length}) загружены из кэша.`);
            } else {
                setUIState(STATE.COLLECTING);
                updateStatus('Сбор списка глав...');
                await collectChapters(mainPageDoc);

                if (chapterList.length > 90) {
                     const proceed = window.confirm(`Найдено ${chapterList.length} глав. Сбор может занять время. Продолжить?`);
                     if (!proceed) {
                         setUIState(STATE.PRE_INIT);
                         return;
                     }
                }
                saveChaptersToCache(chapterList);
                updateStatus(`Собрано ${chapterList.length} глав. Готов к работе.`);
            }
            populateChapterDropdowns();
            setUIState(STATE.IDLE);

        } catch (e) {
            updateStatus(`Ошибка инициализации: ${e.message}`, true);
            console.error(e);
            setUIState(STATE.PRE_INIT);
        }
    }

    function initOnLoad() {
        const isRanobePage = !!document.querySelector('h1.entry-title.ranobe, .ranobe-book, div.entry-content, .single-select');
        if (!isRanobePage) return;
        if (!document.getElementById('gm-parser-panel')) createUIPanel();
    }

    // --- Стили ---
    GM_addStyle(`
        #gm-parser-panel { position: fixed; top: 50px; right: 20px; width: 350px; background-color: #2c2c2c; color: #e0e0e0; border: 1px solid #444; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; }
        #gm-parser-header { padding: 10px; background-color: #3a3a3a; cursor: move; border-top-left-radius: 7px; border-top-right-radius: 7px; font-weight: bold; user-select: none; }
        #gm-parser-close { float: right; cursor: pointer; font-size: 22px; line-height: 0.9; font-weight: bold; }
        #gm-parser-body { padding: 15px; }
        .gm-parser-row { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .gm-parser-timings { justify-content: space-between; }
        .gm-parser-timings label { flex-grow: 1; text-align: right; margin-right: 4px;}
        .gm-parser-timings input { flex-grow: 2; }
        .gm-parser-row label { flex-shrink: 0; }
        .gm-parser-checkboxes { justify-content: space-around; }
        #gm-parser-panel select, #gm-parser-panel input { background-color: #444; color: #e0e0e0; border: 1px solid #666; border-radius: 4px; padding: 5px; box-sizing: border-box; }
        #gm-parser-panel select:disabled, #gm-parser-panel input:disabled { background-color: #3a3a3a; color: #888; }
        .gm-parser-row > select { flex: 1; min-width: 0; }
        #gm-parser-panel input[type="number"] { width: 70px; }
        #gm-parser-status { margin-top: 10px; padding: 8px; background-color: #333; border-radius: 4px; text-align: center; min-height: 20px; word-wrap: break-word; font-size: 13px; }
        #gm-parser-progress-bar { width: 100%; background-color: #444; border-radius: 4px; margin-top: 10px; height: 10px; overflow: hidden; }
        #gm-parser-progress { height: 100%; width: 0%; background-color: #0d6efd; transition: width 0.3s ease; }
        #gm-parser-buttons, #gm-parser-cache-buttons { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 15px; gap: 10px; }
        #gm-parser-buttons button, #gm-parser-cache-buttons button { color: #fff; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; white-space: nowrap; flex: 1 1 auto; font-weight: 500;}
        #gm-parser-buttons button:hover:not(:disabled), #gm-parser-cache-buttons button:hover:not(:disabled) { opacity: 0.85; }
        #gm-parser-buttons button:disabled, #gm-parser-cache-buttons button:disabled { background-color: #4a4a4a !important; cursor: not-allowed; color: #888; }
        #gm-init-parser { background-color: #198754; }
        #gm-update-cache, #gm-clear-cache { background-color: #6c757d; }
        #gm-download-fb2, #gm-download-txt { background-color: #0d6efd; }
        #gm-stop-download { background-color: #dc3545; }
        #gm-captcha-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100001; display: flex; align-items: center; justify-content: center; color: #333; }
        #gm-captcha-modal > div { background: #fff; padding: 25px; border-radius: 8px; text-align: center; }
        #gm-captcha-modal button { background-color: #0d6efd; color: white; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; margin-top: 15px; }
    `);

    // --- Точка входа ---
    window.addEventListener('load', initOnLoad);
})();