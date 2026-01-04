// ==UserScript==
// @name         Парсер ranobe-novels — FB2 & TXT
// @match        *://ranobe-novels.ru/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      ranobe-novels.ru
// @version      0.01
// @description  Извлекает главы с ranobe-novels.ru и сохраняет их в FB2 или TXT.
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/552325/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20ranobe-novels%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/552325/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20ranobe-novels%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global State ---
    const STATE = {
        PRE_INIT: 'PRE_INIT',
        IDLE: 'IDLE',
        COLLECTING: 'COLLECTING',
        DOWNLOADING: 'DOWNLOADING',
        STOPPED: 'STOPPED'
    };
    let currentState = STATE.PRE_INIT;
    let stopFlag = false;

    let bookInfo = {
        title: 'Без названия',
        author: 'Неизвестен',
        annotation: '<p>Аннотация не найдена.</p>',
        genre: 'sf_fantasy', // Default FB2 genre
        mainPageUrl: ''
    };
    let chapterList = [];

    // --- Cache Functions ---
    const getCacheKey = () => `gm_parser_cache_${bookInfo.mainPageUrl}`;
    const saveChaptersToCache = (chapters) => {
        try {
            const data = { timestamp: new Date().getTime(), chapters: chapters };
            localStorage.setItem(getCacheKey(), JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to cache:', e);
            updateStatus('Ошибка сохранения кэша.', true);
        }
    };
    const loadChaptersFromCache = () => {
        try {
            const data = localStorage.getItem(getCacheKey());
            if (!data) return null;
            return JSON.parse(data).chapters;
        } catch (e) {
            console.error('Failed to load from cache:', e);
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

    // --- Helper Functions ---
    const fetchPage = (url, options = { method: 'GET', data: null }) => {
        return new Promise((resolve, reject) => {
            const isPost = options.method.toUpperCase() === 'POST';
            GM_xmlhttpRequest({
                method: options.method,
                url: url,
                data: isPost ? options.data : null,
                headers: isPost ? { "Content-Type": "application/x-www-form-urlencoded" } : {},
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        if (isPost) {
                           try {
                                const jsonData = JSON.parse(response.responseText);
                                resolve(jsonData.map(item => `<h3 class='arh-title'><a class="text-decoration-none" href='/${item.post_name}/'>${item.post_title}</a></h3>`).join(""));
                            } catch (e) { resolve(response.responseText); }
                        } else {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            resolve(doc);
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Network error: ${error.details}`));
                }
            });
        });
    };

    const cleanChapterHTML = (contentElement) => {
        const cleanedElement = contentElement.cloneNode(true);
        const selectorsToRemove = [
            'script', 'style', 'noscript', '.code-block', '.ai-viewports', 'div[id*="yandex_rtb"]',
            'a.js-remove', '.post__img', '.comments-area', '.new-chapters-cat', '.button-wrapper',
            '.post-bottom-prev-next', 'h4.row', '.my-2'
        ];
        selectorsToRemove.forEach(selector => {
            cleanedElement.querySelectorAll(selector).forEach(el => el.remove());
        });
        cleanedElement.querySelectorAll('p > p').forEach(innerP => {
            const parentP = innerP.parentNode;
            parentP.after(innerP);
        });
        return cleanedElement.innerHTML.replace(/<br\s*\/?>/gi, '</p><p>');
    };

    const triggerDownload = (blob, fileName) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- NEW: Genre Mapping ---
    const mapGenreToFb2 = (genreText) => {
        const g = genreText.toLowerCase().trim();
        const map = {
            'любовные романы': 'love_roman',
            'романтика': 'love_roman',
            'фэнтези': 'sf_fantasy',
            'научная фантастика': 'sf_sci_fi',
            'боевик': 'sf_action',
            'детектив': 'det_classic',
            'приключения': 'adventure',
            'история': 'history',
            'ужасы': 'sf_horror',
            'триллер': 'thriller',
            'мистика': 'sf_mystic',
            'киберпанк': 'sf_cyberpunk',
            'боевые искусства': 'sf_martial_arts',
            'ранобэ': 'popadanec' // Common mapping for Ranobe
        };
        for (const key in map) {
            if (g.includes(key)) {
                return map[key];
            }
        }
        return null;
    };

    // --- UI Functions ---
    const createUIPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'gm-parser-panel';
        panel.innerHTML = `
            <div id="gm-parser-header">
                Парсер — FB2 & TXT
                <span id="gm-parser-close">&times;</span>
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
                    <input type="number" id="gm-collect-delay" value="200" min="50">
                    <label for="gm-delay">Скач. (мс):</label>
                    <input type="number" id="gm-delay" value="500" min="100">
                </div>
                <div class="gm-parser-row gm-parser-checkboxes">
                    <label><input type="checkbox" id="gm-clean-text" checked> Очистка</label>
                    <label><input type="checkbox" id="gm-sections-only"> Только секции (FB2)</label>
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
            </div>
        `;
        document.body.appendChild(panel);
        addEventListenersToPanel();
        setUIState(STATE.PRE_INIT);
    };

    const setUIState = (newState) => {
        currentState = newState;
        const isPreInit = newState === STATE.PRE_INIT;
        const isIdle = newState === STATE.IDLE || newState === STATE.STOPPED;
        const isWorking = newState === STATE.COLLECTING || newState === STATE.DOWNLOADING;

        document.getElementById('gm-init-parser').disabled = !isPreInit;
        document.getElementById('gm-download-fb2').disabled = !isIdle || chapterList.length === 0;
        document.getElementById('gm-download-txt').disabled = !isIdle || chapterList.length === 0;
        document.getElementById('gm-stop-download').disabled = !isWorking;

        document.getElementById('gm-update-cache').disabled = isWorking || isPreInit;
        document.getElementById('gm-clear-cache').disabled = isWorking;

        document.getElementById('gm-start-chapter').disabled = isWorking || isPreInit;
        document.getElementById('gm-end-chapter').disabled = isWorking || isPreInit;
        document.getElementById('gm-delay').disabled = isWorking || isPreInit;
        document.getElementById('gm-collect-delay').disabled = isWorking || isPreInit;

        if (newState === STATE.STOPPED) {
            updateStatus('Операция остановлена пользователем.');
            updateProgress(0, 0);
        }
        if (isPreInit) {
            updateStatus('Нажмите "Инициализировать" для начала.');
        }
    };

    const addEventListenersToPanel = () => {
        document.getElementById('gm-parser-close').addEventListener('click', () => {
            document.getElementById('gm-parser-panel').style.display = 'none';
        });
        document.getElementById('gm-init-parser').addEventListener('click', () => startInitialization(false));
        document.getElementById('gm-update-cache').addEventListener('click', () => startInitialization(true));
        document.getElementById('gm-download-fb2').addEventListener('click', () => handleDownloadClick('fb2'));
        document.getElementById('gm-download-txt').addEventListener('click', () => handleDownloadClick('txt'));
        document.getElementById('gm-stop-download').addEventListener('click', () => { stopFlag = true; });
        document.getElementById('gm-clear-cache').addEventListener('click', clearCache);
    };

    const updateStatus = (message, isError = false) => {
        const statusEl = document.getElementById('gm-parser-status');
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.style.color = isError ? '#ff4d4d' : '#e0e0e0';
    };

    const updateProgress = (current, total) => {
        const progressEl = document.getElementById('gm-parser-progress');
        if (!progressEl) return;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressEl.style.width = `${percentage}%`;
    };

    const populateChapterDropdowns = () => {
        if (chapterList.length === 0) return;
        const startSelect = document.getElementById('gm-start-chapter');
        const endSelect = document.getElementById('gm-end-chapter');
        startSelect.innerHTML = '';
        endSelect.innerHTML = '';

        chapterList.forEach((chapter, index) => {
            const option = `<option value="${index}">${chapter.title}</option>`;
            startSelect.innerHTML += option;
            endSelect.innerHTML += option;
        });

        endSelect.selectedIndex = chapterList.length - 1;

        if (!!document.querySelector('article[id^="post-"]')) {
             const currentPath = window.location.pathname;
             const currentIndex = chapterList.findIndex(ch => new URL(ch.url).pathname === currentPath);
             if (currentIndex !== -1) {
                 startSelect.selectedIndex = currentIndex;
                 endSelect.selectedIndex = currentIndex;
             }
        }
    };


    // --- Parsing Logic ---
    const parseMainPage = async (doc, forceFetch) => {
        if (currentState === STATE.COLLECTING) return;
        stopFlag = false;
        setUIState(STATE.COLLECTING);

        try {
            bookInfo.title = doc.querySelector('h2.category-title a, h1.breadcrumb-title')?.textContent.trim() || 'Без названия';
            bookInfo.author = doc.querySelector('.cat-author span[itemprop="creator"]')?.textContent.trim() || 'Неизвестен';

            // --- UPDATED: Annotation and Genre Parsing ---
            // Prioritize the full description div
            let annotationEl = doc.querySelector('div.description[itemprop="description"]');
            if (annotationEl) {
                bookInfo.annotation = annotationEl.innerHTML.trim();
            } else {
                // Fallback to the short excerpt p tag
                annotationEl = doc.querySelector('p.category-exerpt');
                if (annotationEl) {
                    bookInfo.annotation = `<p>${annotationEl.textContent.replace(/Полное описание\s*$/, '').trim()}</p>`;
                }
            }

            // Parse genres
            const genreLinks = doc.querySelectorAll('div[itemprop="genre"] a');
            for (const link of genreLinks) {
                const fb2Genre = mapGenreToFb2(link.textContent);
                if (fb2Genre) {
                    bookInfo.genre = fb2Genre;
                    break; // Found a valid genre, stop searching
                }
            }
            // --- END OF UPDATE ---

            const cachedChapters = forceFetch ? null : loadChaptersFromCache();
            if (cachedChapters) {
                chapterList = cachedChapters;
                updateStatus('Главы загружены из кэша.');
                populateChapterDropdowns();
                setUIState(STATE.IDLE);
                return;
            }

            const paginationEl = doc.querySelector('.js-pagination');
            let allChapterLinks = [];

            if (!paginationEl) {
                updateStatus('Сбор глав (1 страница)...');
                allChapterLinks = Array.from(doc.querySelectorAll('#sectionCenter .arh-title a'));
            } else {
                const catData = doc.querySelector('.js-cat-data');
                if (!catData) throw new Error('Не найдены данные для пагинации (js-cat-data).');

                const pagesOutputEl = doc.querySelector('#pagesOutput');
                if (!pagesOutputEl) throw new Error('Не удалось найти элемент пагинации #pagesOutput.');

                const pageText = pagesOutputEl.textContent;
                const parts = pageText.split('-');
                let totalPages = 1;
                if (parts.length >= 2) {
                    const parsedPages = parseInt(parts[1].trim(), 10);
                    if (!isNaN(parsedPages)) totalPages = parsedPages;
                }

                if (totalPages > 3) {
                    const totalChaptersApprox = totalPages * 30;
                    const proceed = window.confirm(
                        `Обнаружено большое количество глав (~${totalChaptersApprox}).\n\n` +
                        `Сбор списка может занять продолжительное время и вызвать временное зависание страницы.\n\n` +
                        `Продолжить?`
                    );
                    if (!proceed) {
                        setUIState(STATE.PRE_INIT);
                        return;
                    }
                }

                const cat_id = catData.dataset.category;
                const collectDelay = parseInt(document.getElementById('gm-collect-delay').value);
                const chaptersQueryUrl = 'https://ranobe-novels.ru/wp-content/themes/ranobe-novels/template-parts/category/chapters-query.php';

                for (let i = 1; i <= totalPages; i++) {
                    if (stopFlag) {
                        setUIState(STATE.STOPPED);
                        return;
                    }
                    updateStatus(`Сбор глав... Стр. ${i}/${totalPages}`);
                    updateProgress(i, totalPages);
                    const offset = (i - 1) * 30;

                    const responseHTML = await fetchPage(chaptersQueryUrl, {
                        method: 'POST',
                        data: `cat_id=${cat_id}&limit=30&offset=${offset}`
                    });

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = responseHTML;
                    allChapterLinks.push(...Array.from(tempDiv.querySelectorAll('.arh-title a')));
                    if (i < totalPages) await new Promise(resolve => setTimeout(resolve, collectDelay));
                }
            }

            chapterList = allChapterLinks.map(a => ({ title: a.textContent.trim(), url: a.href })).reverse();
            if (chapterList.length === 0) throw new Error('Не удалось найти список глав.');

            saveChaptersToCache(chapterList);
            populateChapterDropdowns();
            updateStatus('Готов к работе.');
            setUIState(STATE.IDLE);

        } catch (e) {
            updateStatus(`Ошибка парсинга: ${e.message}`, true);
            console.error(e);
            setUIState(STATE.PRE_INIT);
        }
    };

    // --- File Generation ---
    const generateFb2 = (chapters, settings) => {
        const today = new Date().toISOString().split('T')[0];
        let sections = '';
        chapters.forEach(ch => {
            let processedHtml = ch.html.replace(/<p>&nbsp;<\/p>/gi, '').replace(/<p><\/p>/gi, '');
            sections += `<section><title><p>${ch.title}</p></title>${processedHtml}</section>\n`;
        });

        if (settings.sectionsOnly) return sections;

        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        <genre>${bookInfo.genre}</genre>
        <author><first-name>${bookInfo.author}</first-name></author>
        <book-title>${bookInfo.title}</book-title>
        <lang>ru</lang>
        <annotation>${bookInfo.annotation}</annotation>
    </title-info>
    <document-info>
        <author><nickname>Userscript Parser</nickname></author>
        <date>${today}</date>
        <version>0.01</version>
    </document-info>
</description>
<body>
${sections}
</body>
</FictionBook>`;
    };

    const generateTxt = (chapters) => {
        let fullText = `${bookInfo.title}\nАвтор: ${bookInfo.author}\n\n`;
        const tempDiv = document.createElement('div');

        chapters.forEach(ch => {
            fullText += `--- ${ch.title} ---\n\n`;
            tempDiv.innerHTML = ch.html;

            let chapterText = '';
            tempDiv.querySelectorAll('p').forEach(p => {
                const pText = p.textContent.trim();
                if (pText) {
                    chapterText += pText + '\n';
                }
            });
            fullText += chapterText.trim() + '\n\n';
        });
        return fullText;
    };

    // --- Main Control Flow ---
    const handleDownloadClick = async (format) => {
        if (currentState !== STATE.IDLE) return;
        stopFlag = false;
        setUIState(STATE.DOWNLOADING);

        const start = parseInt(document.getElementById('gm-start-chapter').value);
        const end = parseInt(document.getElementById('gm-end-chapter').value);
        const delay = parseInt(document.getElementById('gm-delay').value);
        const cleanText = document.getElementById('gm-clean-text').checked;
        const sectionsOnly = document.getElementById('gm-sections-only').checked;

        if (start > end) {
            updateStatus('Начальная глава должна быть меньше или равна конечной.', true);
            setUIState(STATE.IDLE);
            return;
        }

        const chaptersToDownload = chapterList.slice(start, end + 1);
        const total = chaptersToDownload.length;
        let downloadedChapters = [];

        for (let i = 0; i < total; i++) {
            if (stopFlag) {
                setUIState(STATE.STOPPED);
                return;
            }
            const chapter = chaptersToDownload[i];
            updateStatus(`Скачивание: ${chapter.title} (${i + 1}/${total})`);
            updateProgress(i + 1, total);

            try {
                const chapterDoc = await fetchPage(chapter.url);
                const contentEl = chapterDoc.querySelector('.entry-content .js-full-content');
                if (!contentEl) throw new Error('Не найден контент главы.');

                const chapterHtml = cleanText ? cleanChapterHTML(contentEl) : contentEl.innerHTML;
                downloadedChapters.push({ title: chapter.title, html: chapterHtml });

                if (i < total - 1) await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                updateStatus(`Ошибка скачивания главы "${chapter.title}": ${error.message}`, true);
                setUIState(STATE.IDLE);
                return;
            }
        }

        updateStatus('Генерация файла...');
        let fileContent, fileName, mimeType;
        const safeBookTitle = bookInfo.title.replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '_').trim() || 'ranobe';

        const startChapterTitle = chaptersToDownload[0].title;
        const endChapterTitle = chaptersToDownload[chaptersToDownload.length - 1].title;

        const getChapterId = (title) => {
            const match = title.match(/(?:Глава|Chapter|Гл|ch)\.?\s*([\d-]+)| том \d+.*?([\d-]+)|(\d+)/i);
            if (match) {
                return match[1] || match[2] || match[3];
            }
            return title.replace(/[^\p{L}\p{N}_-]/gu, '').substring(0, 15);
        };

        const startId = getChapterId(startChapterTitle);
        const endId = getChapterId(endChapterTitle);
        const chapterRangeString = (chaptersToDownload.length > 1 && startId !== endId)
            ? `(Гл ${startId}-${endId})`
            : `(Гл ${startId})`;

        if (format === 'fb2') {
            fileContent = generateFb2(downloadedChapters, { sectionsOnly });
            fileName = `${safeBookTitle} ${chapterRangeString}.fb2`;
            mimeType = 'application/xml';
        } else {
            fileContent = generateTxt(downloadedChapters);
            fileName = `${safeBookTitle} ${chapterRangeString}.txt`;
            mimeType = 'text/plain';
        }

        const blob = new Blob([fileContent], { type: `${mimeType};charset=utf-8` });
        triggerDownload(blob, fileName);

        updateStatus('Загрузка завершена!');
        updateProgress(0, 0);
        setUIState(STATE.IDLE);
    };

    const startInitialization = async (forceFetch = false) => {
        try {
            const isChapterPage = !!document.querySelector('article[id^="post-"] .entry-content');
            if (isChapterPage) {
                const mainPageLink = document.querySelector('.breadcrumb-item a[rel="category tag"]');
                if (mainPageLink) {
                    bookInfo.mainPageUrl = mainPageLink.href;
                    const mainPageDoc = await fetchPage(bookInfo.mainPageUrl);
                    await parseMainPage(mainPageDoc, forceFetch);
                } else {
                    updateStatus('Не удалось найти ссылку на главную страницу.', true);
                }
            } else {
                bookInfo.mainPageUrl = window.location.href.split('?')[0];
                await parseMainPage(document, forceFetch);
            }
        } catch (e) {
             updateStatus(`Ошибка инициализации: ${e.message}`, true);
             setUIState(STATE.PRE_INIT);
        }
    };

    const initOnLoad = () => {
        const isChapterPage = !!document.querySelector('article[id^="post-"] .entry-content');
        const isMainPage = !!document.querySelector('main.center .category-card');
        if (!isChapterPage && !isMainPage) {
            if (document.getElementById('gm-parser-panel')) document.getElementById('gm-parser-panel').remove();
            return;
        }
        if (!document.getElementById('gm-parser-panel')) createUIPanel();
    };

    // --- Styles ---
    GM_addStyle(`
        #gm-parser-panel { position: fixed; top: 50px; right: 20px; width: 350px; background-color: #2c2c2c; color: #e0e0e0; border: 1px solid #444; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 99999; font-family: sans-serif; font-size: 14px; }
        #gm-parser-header { padding: 10px; background-color: #3a3a3a; cursor: move; border-top-left-radius: 7px; border-top-right-radius: 7px; font-weight: bold; }
        #gm-parser-close { float: right; cursor: pointer; font-size: 22px; line-height: 0.9; font-weight: bold; }
        #gm-parser-body { padding: 15px; }
        .gm-parser-row { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .gm-parser-timings { justify-content: space-between; }
        .gm-parser-timings label { flex-grow: 1; text-align: right; margin-right: 4px;}
        .gm-parser-timings input { flex-grow: 2; }
        .gm-parser-row label { flex-shrink: 0; }
        .gm-parser-checkboxes { justify-content: space-around; }
        #gm-parser-panel select, #gm-parser-panel input { background-color: #444; color: #e0e0e0; border: 1px solid #666; border-radius: 4px; padding: 5px; box-sizing: border-box; }
        .gm-parser-row > select { flex: 1; min-width: 0; }
        #gm-parser-panel input[type="number"] { width: 80px; }
        #gm-parser-panel input[type="checkbox"] { width: auto; }
        #gm-parser-status { margin-top: 10px; padding: 8px; background-color: #333; border-radius: 4px; text-align: center; min-height: 20px; word-wrap: break-word; }
        #gm-parser-progress-bar { width: 100%; background-color: #444; border-radius: 4px; margin-top: 10px; height: 10px; overflow: hidden; }
        #gm-parser-progress { height: 100%; width: 0%; background-color: #4caf50; transition: width 0.3s ease; }
        #gm-parser-buttons, #gm-parser-cache-buttons { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 15px; gap: 10px; }
        #gm-parser-buttons button, #gm-parser-cache-buttons button { background-color: #5a5a5a; color: #fff; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; white-space: nowrap; flex: 1 1 auto; }
        #gm-parser-buttons button:hover:not(:disabled), #gm-parser-cache-buttons button:hover:not(:disabled) { background-color: #7a7a7a; }
        #gm-parser-buttons button:disabled, #gm-parser-cache-buttons button:disabled { background-color: #444; cursor: not-allowed; color: #888; }
        #gm-stop-download { background-color: #c9302c; }
        #gm-stop-download:hover:not(:disabled) { background-color: #d9534f; }
        #gm-init-parser { background-color: #4caf50; }
        #gm-init-parser:hover:not(:disabled) { background-color: #66bb6a; }
    `);

    // --- Entry Point ---
    window.addEventListener('load', initOnLoad);
})();