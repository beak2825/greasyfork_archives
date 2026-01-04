// ==UserScript==
// @name         Парсер Jaomix — FB2 & TXT
// @match        https://jaomix.ru/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @version      0.2
// @description  Извлекает главы с jaomix.ru и сохраняет их в FB2 или TXT с очисткой
// @run-at       document-idle
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/551664/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20Jaomix%20%E2%80%94%20FB2%20%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/551664/%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80%20Jaomix%20%E2%80%94%20FB2%20%20TXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- СТИЛИ ДЛЯ ИНТЕРФЕЙСА ---
    GM_addStyle(`
        #downloader-ui { position: fixed; top: 100px; right: 20px; z-index: 9999; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 280px; font-family: Arial, sans-serif; }
        #downloader-ui h3 { margin: 0 0 10px; padding: 0; text-align: center; font-size: 16px; color: #333; }
        #downloader-ui .form-group { margin-bottom: 10px; }
        #downloader-ui label { display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold; }
        #downloader-ui .range-inputs { display: flex; flex-direction: column; }
        #downloader-ui .range-inputs select { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 5px; }
        #downloader-ui .options label { font-weight: normal; display: flex; align-items: center; font-size: 12px; margin-top: 5px; }
        #downloader-ui .options input { margin-right: 5px; }
        #downloader-ui button { display: block; width: 100%; padding: 8px; border: none; border-radius: 4px; color: #fff; font-weight: bold; cursor: pointer; margin-top: 5px; }
        #downloader-ui .download-buttons button { display: inline-block; width: 49%; }
        #downloader-ui #btn-download-fb2 { background-color: #007bff; }
        #downloader-ui #btn-download-txt { background-color: #28a745; }
        #downloader-ui #btn-stop { background-color: #dc3545; display: none; }
        #downloader-ui #btn-captcha-continue { background-color: #ffc107; color: #212529; display: none; }
        #downloader-ui button:hover { opacity: 0.9; }
        #downloader-ui button:disabled { background-color: #6c757d; cursor: not-allowed; }
        #downloader-ui #progress-bar { width: 100%; background-color: #e0e0e0; border-radius: 4px; overflow: hidden; height: 18px; margin-top: 10px; display: none; }
        #downloader-ui #progress-fill { width: 0; height: 100%; background-color: #007bff; text-align: center; color: white; font-size: 12px; line-height: 18px; transition: width 0.3s; }
        #downloader-ui .info-icon { cursor: help; margin-left: 5px; color: #888; border: 1px solid #ccc; border-radius: 50%; width: 14px; height: 14px; display: inline-block; text-align: center; line-height: 14px; font-style: italic; font-size: 10px; user-select: none; }
        #downloader-ui #captcha-prompt { font-size: 12px; color: #c00; margin-top: 10px; display: none; text-align: center; border: 1px solid #f5c6cb; background-color: #f8d7da; padding: 5px; border-radius: 4px; }
    `);

    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let book = { title: 'Без названия', author: 'Неизвестен', annotation: '', chapters: [] };
    let isWorking = false;
    let isCancelled = false;
    let captchaResolver = null;

    // --- ФУНКЦИИ ИНТЕРФЕЙСА ---
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'downloader-ui';
        ui.innerHTML = `
            <h3>Jaomix Downloader</h3>
            <div class="form-group">
                <label>Диапазон глав:</label>
                <div class="range-inputs">
                    <select id="start-chapter-select" disabled><option>Загрузка списка...</option></select>
                    <select id="end-chapter-select" disabled><option>Загрузка списка...</option></select>
                </div>
            </div>
            <div class="form-group">
                <label for="download-delay">Задержка (мс):
                    <span class="info-icon" title="Задержка между загрузкой глав. Сайт может вас временно заблокировать, если значение будет слишком низким.">i</span>
                </label>
                <input type="number" id="download-delay" value="500" min="0" step="100" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="form-group options">
                <label><input type="checkbox" id="clean-text" checked>Очищать текст от мусора</label>
                <label><input type="checkbox" id="fb2-sections-only">Только секции (FB2)</label>
                <label><input type="checkbox" id="txt-text-only">Только текст (TXT)</label>
            </div>
            <div class="download-buttons">
                <button id="btn-download-fb2">Скачать FB2</button>
                <button id="btn-download-txt">Скачать TXT</button>
            </div>
            <button id="btn-stop">Остановить</button>
            <div id="captcha-prompt">Открыта новая вкладка. Решите капчу и нажмите "Продолжить".</div>
            <button id="btn-captcha-continue">Продолжить после решения капчи</button>
            <div id="progress-bar"><div id="progress-fill">0%</div></div>
        `;
        document.body.appendChild(ui);
        document.getElementById('btn-download-fb2').addEventListener('click', () => downloadChapters('fb2'));
        document.getElementById('btn-download-txt').addEventListener('click', () => downloadChapters('txt'));
        document.getElementById('btn-stop').addEventListener('click', () => {
            isCancelled = true;
            document.getElementById('progress-fill').textContent = 'Остановка...';
        });
        document.getElementById('btn-captcha-continue').addEventListener('click', () => {
            if (captchaResolver) captchaResolver();
        });
    }

    function updateProgress(percent, text = '') {
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${percent}%`;
        progressFill.textContent = text || `${percent}%`;
    }

    function toggleControls(disabled) {
        document.getElementById('btn-download-fb2').disabled = disabled;
        document.getElementById('btn-download-txt').disabled = disabled;
        document.getElementById('start-chapter-select').disabled = disabled;
        document.getElementById('end-chapter-select').disabled = disabled;
        document.getElementById('download-delay').disabled = disabled;
    }

    // --- ФУНКЦИИ СБОРА ДАННЫХ ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        resolve(doc);
                    } else {
                        reject(new Error(`Ошибка загрузки: ${response.statusText}`));
                    }
                },
                onerror: error => reject(error)
            });
        });
    }

    async function parseMainPage(doc) {
        book.title = doc.querySelector('h1[itemprop="name"]')?.textContent.trim() || 'Без названия';
        const authorNode = Array.from(doc.querySelectorAll('#info-book p')).find(p => p.textContent.includes('Автор:'));
        book.author = authorNode ? authorNode.textContent.replace('Автор:', '').trim() : 'Неизвестен';
        book.annotation = doc.querySelector('#desc-tab[itemprop="description"]')?.innerHTML || '';

        // ИСПРАВЛЕНИЕ ЗДЕСЬ: сначала переворачиваем список, потом нумеруем.
        const chaptersTemp = Array.from(doc.querySelectorAll('#chapters-book .title a'))
            .map(a => ({
                title: a.querySelector('h2')?.textContent.trim(),
                url: a.href
            }))
            .reverse(); // Сначала получаем хронологический порядок [Глава 1, Глава 2, ...]

        book.chapters = chaptersTemp.map((chap, i) => ({
            index: i, // Теперь присваиваем корректный индекс, соответствующий массиву
            title: chap.title || `Глава ${i + 1}`,
            url: chap.url
        }));
    }


    function unwrapElement(element) {
        const parent = element.parentNode;
        if (!parent) return;
        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
    }

    function cleanChapterHTML(contentElement) {
        const tempDiv = contentElement.cloneNode(true);
        const junkSelectors = ['script', 'style', 'div.clear', '.recom-block', '.wpdiscuz_top_clearing', '.comments-area', '.post-nav', '.block-capth', '.but-captcha', '.entry-footer', '.pagi-single-all-post', 'p[style*="font-weight: bold"]', '.adfoxblock', 'div[id*="adfox"]'];
        tempDiv.querySelectorAll(junkSelectors.join(', ')).forEach(el => el.remove());
        const adKeywords = ["Услуга 'Убрать рекламу'", "мешающую чтению рекламу"];
        tempDiv.querySelectorAll('p, div').forEach(el => {
            if (adKeywords.some(keyword => el.textContent.includes(keyword))) {
                el.remove();
            }
        });
        tempDiv.querySelectorAll('p a[href]').forEach(unwrapElement);
        const firstP = tempDiv.querySelector('p');
        if (firstP && /^Глава\s+\d+/.test(firstP.textContent.trim())) {
            firstP.remove();
        }
        return tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '</p><p>').replace(/<p>[\s&nbsp;]*<\/p>/gi, '');
    }

    function parseChapterPage(doc) {
        const doClean = document.getElementById('clean-text').checked;
        const contentElement = doc.querySelector('.entry-content .entry.themeform');

        if (!contentElement) return '<p>Ошибка: не удалось найти текст главы.</p>';

        if (contentElement.querySelector('.block-capth, .but-captcha')) {
            return 'CAPTCHA_DETECTED';
        }

        return doClean ? cleanChapterHTML(contentElement) : contentElement.innerHTML;
    }

    async function handleCaptcha(url) {
        document.getElementById('captcha-prompt').style.display = 'block';
        document.getElementById('btn-captcha-continue').style.display = 'block';
        GM_openInTab(url, { active: true });
        return new Promise(resolve => {
            captchaResolver = () => {
                document.getElementById('captcha-prompt').style.display = 'none';
                document.getElementById('btn-captcha-continue').style.display = 'none';
                captchaResolver = null;
                resolve();
            };
        });
    }

    // --- ОСНОВНАЯ ЛОГИКА ЗАГРУЗКИ ---
    async function downloadChapters(format) {
        if (isWorking) {
            alert('Загрузка уже в процессе.');
            return;
        }
        isWorking = true;
        isCancelled = false;

        const progressBar = document.getElementById('progress-bar');
        const btnStop = document.getElementById('btn-stop');
        progressBar.style.display = 'block';
        btnStop.style.display = 'block';
        toggleControls(true);
        updateProgress(0);

        const chapterContents = [];
        let start, end;

        try {
            const startIdx = parseInt(document.getElementById('start-chapter-select').value, 10);
            const endIdx = parseInt(document.getElementById('end-chapter-select').value, 10);

            if (startIdx > endIdx) {
                alert('Начальная глава должна быть раньше конечной.');
                // Эта проверка теперь должна срабатывать только если пользователь сам выберет неверный диапазон.
                throw new Error("Неверный диапазон глав");
            }

            start = book.chapters[startIdx];
            end = book.chapters[endIdx];

            const delay = parseInt(document.getElementById('download-delay').value, 10) || 0;
            const chaptersToDownload = book.chapters.slice(startIdx, endIdx + 1);
            const total = chaptersToDownload.length;

            for (let i = 0; i < total; i++) {
                if (isCancelled) {
                    alert('Загрузка остановлена пользователем.');
                    break;
                }
                if (i > 0 && delay > 0) await sleep(delay);

                const chapter = chaptersToDownload[i];
                updateProgress(Math.round(((i + 1) / total) * 100), `Глава ${i+1}/${total}`);

                let content;
                let attempt = 0;
                while (attempt < 2) {
                    const chapterDoc = await fetchPage(chapter.url);
                    content = parseChapterPage(chapterDoc);
                    if (content !== 'CAPTCHA_DETECTED') {
                        break;
                    }
                    updateProgress(Math.round(((i + 1) / total) * 100), `Капча!`);
                    await handleCaptcha(chapter.url);
                    attempt++;
                }

                if (content === 'CAPTCHA_DETECTED') {
                    content = `<p><b>[Парсер] Не удалось обойти капчу для главы "${chapter.title}". Глава пропущена.</b></p>`;
                }
                chapterContents.push({ title: chapter.title, content });
            }

            if (chapterContents.length > 0) {
                 const firstChapterNum = startIdx + 1;
                 const lastChapterNum = startIdx + chapterContents.length;
                 generateFile(format, chapterContents, firstChapterNum, lastChapterNum);
            }

        } catch (error) {
            if (error.message !== "Неверный диапазон глав") {
                 console.error('Ошибка при загрузке глав:', error);
                 alert('Произошла ошибка. Подробности в консоли разработчика (F12).');
            }
        } finally {
            isWorking = false;
            btnStop.style.display = 'none';
            toggleControls(false);
            setTimeout(() => {
                progressBar.style.display = 'none';
                updateProgress(0);
            }, 2000);
        }
    }

    // --- ФУНКЦИИ ГЕНЕРАЦИИ ФАЙЛОВ ---
    function sanitizeFilename(name) {
        return name.replace(/[\/\\?%*:|"<>]/g, '-').slice(0, 150);
    }

    function generateFile(format, chapters, startNum, endNum) {
        let output = '';
        const title = `${sanitizeFilename(book.title)} Главы ${startNum}-${endNum}`;
        if (format === 'fb2') {
            output = generateFb2(chapters, document.getElementById('fb2-sections-only').checked);
        } else {
            output = generateTxt(chapters, document.getElementById('txt-text-only').checked);
        }
        const blob = new Blob([output], { type: format === 'fb2' ? 'application/xml;charset=utf-8' : 'text/plain;charset=utf-8' });
        triggerDownload(blob, `${title}.${format}`);
    }

    function generateTxt(chapters, textOnly) {
        const titleBlock = textOnly ? '' : `${book.title}\nАвтор: ${book.author}\n\n---\n\n`;
        const chapterTexts = chapters.map(ch => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = ch.content;
            const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent.trim()).filter(text => text.length > 0);
            const chapterTitle = textOnly ? '' : `Глава: ${ch.title}\n\n`;
            return chapterTitle + paragraphs.join('\n\n');
        }).join('\n\n---\n\n');
        return titleBlock + chapterTexts;
    }

    function generateFb2(chapters, sectionsOnly) {
        const sanitize = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const bodyContent = chapters.map(ch =>
            `    <section><title><p>${sanitize(ch.title)}</p></title>${ch.content}</section>`
        ).join('\n');
        if (sectionsOnly) return bodyContent;
        return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        <genre>sf_fantasy</genre>
        <author><first-name>${sanitize(book.author)}</first-name></author>
        <book-title>${sanitize(book.title)}</book-title>
        <lang>ru</lang>
        <annotation>${book.annotation}</annotation>
    </title-info>
    <document-info>
        <author><nickname>Jaomix Downloader</nickname></author>
        <date>${new Date().toISOString().split('T')[0]}</date>
        <version>0.13</version>
    </document-info>
</description>
<body>
${bodyContent}
</body>
</FictionBook>`;
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

    // --- ИНИЦИАЛИЗАЦИЯ СКРИПТА ---
    async function initialize() {
        if (!document.querySelector('.box-book, .entry-content')) return;

        createUI();
        let mainPageDoc = document;

        if (document.querySelector('.entry-content')) {
            const mainPageUrl = document.querySelector('.entry-category a')?.href;
            if (mainPageUrl) {
                try {
                    mainPageDoc = await fetchPage(mainPageUrl);
                } catch (e) {
                    alert('Не удалось загрузить главную страницу для сбора информации.');
                    return;
                }
            } else {
                alert('Не удалось найти ссылку на главную страницу произведения.');
                return;
            }
        }

        await parseMainPage(mainPageDoc);

        const startSelect = document.getElementById('start-chapter-select');
        const endSelect = document.getElementById('end-chapter-select');
        startSelect.innerHTML = '';
        endSelect.innerHTML = '';

        if (book.chapters.length > 0) {
            book.chapters.forEach(chapter => {
                const option = document.createElement('option');
                option.value = chapter.index;
                option.textContent = chapter.title;
                startSelect.appendChild(option.cloneNode(true));
                endSelect.appendChild(option);
            });
            startSelect.selectedIndex = 0;
            endSelect.selectedIndex = book.chapters.length - 1;
            startSelect.disabled = false;
            endSelect.disabled = false;
        } else {
            startSelect.innerHTML = '<option>Глав не найдено</option>';
            endSelect.innerHTML = '<option>Глав не найдено</option>';
        }
    }

    initialize();

})();