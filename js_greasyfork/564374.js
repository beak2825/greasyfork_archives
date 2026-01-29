// ==UserScript==
// @name         Google Classroom - ZIP Downloader (AI Context)
// @name:ru      Google Classroom - Скачать все файлы (ZIP + AI Context)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to Google Classroom to download all files (Word, Excel, PowerPoint, PDF, Videos) as a ZIP. Also creates a context file for AI (ChatGPT/NotebookLM).
// @description:ru Добавляет кнопку скачивания всех файлов (Word, Excel, PowerPoint, PDF, Видео) одним архивом ZIP. Также создает контекстный файл для нейросетей (ChatGPT/NotebookLM).
// @author       ENDERVANO
// @license      MIT
// @match        https://classroom.google.com/*
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         https://www.google.com/images/branding/product/2x/classroom_96in128dp.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564374/Google%20Classroom%20-%20ZIP%20Downloader%20%28AI%20Context%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564374/Google%20Classroom%20-%20ZIP%20Downloader%20%28AI%20Context%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- СТИЛИ (Material Design 3) ---
    GM_addStyle(`
        :root {
            --gc-surface-color: #1E1F20;
            --gc-text-primary: #E3E3E3;
            --gc-text-secondary: #C4C7C5;
            --gc-primary-color: #A8C7FA;
            --gc-on-primary: #062E6F;
            --gc-tertiary-color: #c2e7ff;
            --gc-on-tertiary: #001d35;
            --gc-font-family: 'Google Sans', Roboto, Arial, sans-serif;
        }
        #gc-start-btn {
            position: fixed; bottom: 24px; left: 24px; z-index: 9990;
            background-color: #28292a; color: var(--gc-primary-color);
            border: 1px solid rgba(255,255,255,0.1); padding: 12px 20px;
            border-radius: 16px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; gap: 10px;
            font-weight: 500; font-family: var(--gc-font-family); font-size: 14px;
            transition: transform 0.2s, background 0.2s;
        }
        #gc-start-btn:hover { background-color: #353739; }
        #gc-start-btn:active { transform: scale(0.95); }
        #gc-start-btn svg { width: 24px; height: 24px; fill: currentColor; }
        .gc-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(3px); opacity: 0; animation: fadeIn 0.2s forwards;
        }
        .gc-modal {
            background-color: var(--gc-surface-color); color: var(--gc-text-primary);
            width: 500px; max-height: 85vh; border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444;
            display: flex; flex-direction: column; font-family: var(--gc-font-family);
            transform: scale(0.9); animation: popIn 0.2s forwards;
        }
        .gc-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
        .gc-header h3 { margin: 0; font-size: 18px; font-weight: 400; }
        .gc-close { cursor: pointer; font-size: 24px; color: var(--gc-text-secondary); padding: 5px; }
        .gc-body { padding: 10px 0; overflow-y: auto; flex: 1; }
        .gc-file-item { padding: 10px 20px; display: flex; align-items: center; cursor: pointer; transition: background 0.2s; }
        .gc-file-item:hover { background-color: rgba(168, 199, 250, 0.08); }
        .gc-file-item input { margin-right: 15px; width: 18px; height: 18px; accent-color: var(--gc-primary-color); cursor: pointer; }
        .gc-file-name { font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; flex-direction: column; }
        .gc-info-box {
            margin: 0 20px 10px 20px; padding: 10px; background: rgba(168, 199, 250, 0.1);
            border-radius: 8px; font-size: 12px; color: var(--gc-text-secondary);
            border: 1px dashed var(--gc-primary-color);
        }
        .gc-footer { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; gap: 10px; }
        .gc-btn-ai {
            background-color: var(--gc-tertiary-color); color: var(--gc-on-tertiary);
            border: none; border-radius: 20px; padding: 10px 20px; font-weight: 600; cursor: pointer;
            display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center;
        }
        .gc-btn-ai:hover { opacity: 0.9; }
        .gc-btn-primary { 
            background-color: var(--gc-primary-color); color: var(--gc-on-primary); 
            border: none; border-radius: 20px; padding: 10px 20px; font-weight: 600; cursor: pointer; 
            flex: 1;
        }
        .gc-btn-primary:hover { opacity: 0.9; }
        .gc-toast {
            position: fixed; bottom: 80px; left: 24px; z-index: 10001;
            background: #323232; color: #F2F2F2; padding: 12px 20px;
            border-radius: 8px; font-family: var(--gc-font-family); font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4); border-left: 4px solid var(--gc-primary-color);
            opacity: 0; transform: translateY(20px); transition: all 0.3s;
            pointer-events: none;
        }
        .gc-toast.show { opacity: 1; transform: translateY(0); }
        .gc-toast.warn { border-left-color: #ffb4ab; color: #ffb4ab; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `);

    // --- UI ЭЛЕМЕНТЫ ---
    const ICON_DL = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
    const btn = document.createElement('button');
    btn.id = 'gc-start-btn';
    btn.innerHTML = `${ICON_DL} <span>Скачать</span>`;
    document.body.appendChild(btn);

    const toast = document.createElement('div');
    toast.className = 'gc-toast';
    document.body.appendChild(toast);

    function showToast(msg, isWarning = false) {
        toast.innerText = msg;
        if(isWarning) toast.classList.add('warn'); else toast.classList.remove('warn');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // --- ЛОГИКА ---
    function getCurrentAuthUser() {
        const pathParts = window.location.pathname.split('/');
        if (pathParts[1] === 'u' && !isNaN(parseInt(pathParts[2]))) return pathParts[2];
        return new URLSearchParams(window.location.search).get('authuser') || '0';
    }

    // --- SPA FIX: Ищем только видимый текст ---
    function findVisibleText(selector) {
        const elements = document.querySelectorAll(selector);
        for (let el of elements) {
            // Проверка offsetParent !== null гарантирует, что элемент виден
            if (el.offsetParent !== null && el.innerText.trim().length > 0) {
                return el.innerText;
            }
        }
        return null;
    }

    function getAssignmentContext() {
        let title = findVisibleText('h1') || "Без названия";
        let description = "";

        // Приоритет 1: Атрибут guidedhelpid (наиболее точный для нового интерфейса)
        if (!description) description = findVisibleText('div[guidedhelpid="assignmentInstructionsGH"]');
        
        // Приоритет 2: Атрибут data-message-id (для постов в ленте)
        if (!description) description = findVisibleText('div[data-message-id] div[dir="auto"]');
        
        // Приоритет 3: Поиск по ID instructions
        if (!description) description = findVisibleText('div[id*="instructions"] div[dir="auto"]');
        
        // Приоритет 4: "Умный" поиск любого большого текста
        if (!description) {
            const candidates = document.querySelectorAll('div[dir="auto"]');
            for (let div of candidates) {
                if (div.innerText.length > 20 && div.offsetParent !== null && !div.closest('[role="list"]')) {
                    description = div.innerText;
                    break;
                }
            }
        }

        if (!description) description = "(Текст описания не найден. Возможно, это задание без инструкций)";
        return { title, description };
    }

    function cleanFileName(rawName, extension) {
        let name = rawName.replace(/Attachment:|Прикрепленный файл:|File:|Файл:/gi, '')
                          .replace(/Microsoft Word|Microsoft Excel|Microsoft PowerPoint/gi, '')
                          .replace(/Microsoft|Word|Excel|PowerPoint|PDF|Google Docs/gi, '')
                          .replace(/Зображення|Image|Video|Відео|Двійковий файл/gi, '')
                          .trim();
        
        if (extension) {
            const extIndex = name.toLowerCase().lastIndexOf(extension.toLowerCase());
            if (extIndex !== -1) name = name.substring(0, extIndex + extension.length);
            else if (!name.endsWith(extension)) name += extension;
        }
        return name.replace(/[<>:"\/\\|?*]/g, '_').trim();
    }

    function scanFiles() {
        const authUser = getCurrentAuthUser();
        const links = Array.from(document.querySelectorAll('a'));
        const files = new Map();
        const videoLinks = [];

        links.forEach(link => {
            if (link.offsetParent === null) return; 

            const href = link.href;

            // Видео
            if (href.includes('youtube.com') || href.includes('youtu.be')) {
                const isVideoBlock = link.closest('div[role="listitem"]') || 
                                     link.closest('div[data-style="VIDEO"]') || 
                                     (link.innerText.toLowerCase().includes('video') || link.innerText.toLowerCase().includes('відео'));

                if (isVideoBlock) {
                    videoLinks.push({
                        url: href,
                        title: link.getAttribute('aria-label') || link.innerText || "YouTube Video"
                    });
                }
                return;
            }

            // Файлы
            if (!href.includes('/d/')) return;

            let id = null, url = null, ext = "";
            let mFile = href.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (mFile) {
                id = mFile[1];
                url = `https://drive.google.com/u/${authUser}/uc?id=${id}&export=download`;
                const txt = link.innerText.toLowerCase();
                if (txt.includes('.pdf')) ext = '.pdf';
                else if (txt.includes('.jpg') || txt.includes('.jpeg')) ext = '.jpg';
                else if (txt.includes('.png')) ext = '.png';
                else if (txt.includes('.zip') || txt.includes('.rar')) ext = '.zip';
                else if (txt.includes('.fbx')) ext = '.fbx';
                else if (txt.includes('.xlsx') || txt.includes('.xls')) ext = '.xlsx';
                else if (txt.includes('.docx') || txt.includes('.doc')) ext = '.docx';
                else if (txt.includes('.pptx') || txt.includes('.ppt')) ext = '.pptx';
                else if (txt.includes('.txt')) ext = '.txt';
            }

            let mDoc = href.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
            if (mDoc) { id = mDoc[1]; url = `https://docs.google.com/document/u/${authUser}/d/${id}/export?format=docx`; ext=".docx"; }

            let mSheet = href.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
            if (mSheet) { id = mSheet[1]; url = `https://docs.google.com/spreadsheets/u/${authUser}/d/${id}/export?format=xlsx`; ext=".xlsx"; }

            let mSlide = href.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
            if (mSlide) { id = mSlide[1]; url = `https://docs.google.com/presentation/u/${authUser}/d/${id}/export/pptx`; ext=".pptx"; }

            if (id && !files.has(id)) {
                let rawText = link.innerText;
                let splitText = rawText.split(/\r?\n/);
                let candidateName = splitText[0].trim();
                if (!candidateName) candidateName = link.getAttribute('aria-label') || "file";
                if (candidateName.length > 100) candidateName = candidateName.substring(0, 80) + "...";
                let finalName = cleanFileName(candidateName, ext);
                files.set(id, { id, url, name: finalName, ext });
            }
        });
        
        return { files: Array.from(files.values()), videoLinks };
    }

    function generateContextFile(filesList, videoLinks) {
        const { title, description } = getAssignmentContext();
        
        let content = `=== ЗАДАНИЕ ДЛЯ AI (NotebookLM / ChatGPT) ===\n\n`;
        content += `ТЕМА: ${title}\n`;
        content += `=============================================\n\n`;
        content += `[ОПИСАНИЕ ЗАДАНИЯ]\n${description}\n`;
        content += `=============================================\n\n`;
        
        if (videoLinks.length > 0) {
            content += `[ВИДЕО МАТЕРИАЛЫ]\n`;
            videoLinks.forEach(v => {
                let cleanTitle = v.title.replace(/YouTube Video/gi, '').replace(/\d+\s(минут|хвилин|minutes)/gi, '').trim();
                if(!cleanTitle) cleanTitle = "YouTube Video";
                content += `- ${cleanTitle}: ${v.url}\n`;
            });
            content += `\n`;
        }

        if (filesList.length > 0) {
            content += `[ПРИКРЕПЛЕННЫЕ ФАЙЛЫ]\n`;
            filesList.forEach(f => {
                content += `- ${f.name}\n`;
            });
        }
        
        content += `\n\n(Generated by Google Classroom ZIP Downloader)`;
        return content;
    }

    function createModal(files, videoLinks) {
        document.querySelector('.gc-modal-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.className = 'gc-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'gc-modal';

        const listHtml = files.map((f, i) => `
            <div class="gc-file-item" onclick="document.getElementById('f-${i}').click()">
                <input type="checkbox" id="f-${i}" checked data-idx="${i}" onclick="event.stopPropagation()">
                <div><span class="gc-file-name" title="${f.name}">${f.name}</span></div>
            </div>`).join('');

        let extraInfo = "";
        if (videoLinks.length > 0) extraInfo += `📹 Видео: ${videoLinks.length} шт. `;
        if (files.length > 0) extraInfo += `📄 Файлов: ${files.length} шт.`;
        if (!extraInfo) extraInfo = "Только текст задания";

        modal.innerHTML = `
            <div class="gc-header"><h3>Материалы задания</h3><div class="gc-close">✕</div></div>
            <div class="gc-info-box">${extraInfo}</div>
            <div class="gc-body">${listHtml}</div>
            <div class="gc-footer">
                <button class="gc-btn-primary" id="gc-dl-std">Скачать файлы</button>
                <button class="gc-btn-ai" id="gc-dl-ai">✨ Пакет для NotebookLM</button>
            </div>`;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        modal.querySelector('.gc-close').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        
        const dlBtn = modal.querySelector('#gc-dl-std');
        const aiBtn = modal.querySelector('#gc-dl-ai');

        dlBtn.onclick = async () => {
            const selected = Array.from(modal.querySelectorAll('input:checked')).map(cb => files[cb.dataset.idx]);
            if (!selected.length) return;
            runDownload(selected, dlBtn, false, []);
        };

        aiBtn.onclick = async () => {
            const selected = Array.from(modal.querySelectorAll('input:checked')).map(cb => files[cb.dataset.idx]);
            runDownload(selected, aiBtn, true, videoLinks);
        };
    }

    async function fetchBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "arraybuffer",
                onload: res => (res.status === 200 && !res.responseHeaders.includes("text/html")) ? resolve(res.response) : reject(),
                onerror: reject
            });
        });
    }

    async function runDownload(filesList, btnEl, isAiMode, videoLinks) {
        btnEl.disabled = true; 
        const originalText = btnEl.innerText;
        btnEl.innerText = "Загрузка...";

        const zip = new JSZip();
        
        for (const [i, f] of filesList.entries()) {
            btnEl.innerText = `Файл ${i+1}/${filesList.length}`;
            try { zip.file(f.name, await fetchBlob(f.url)); } 
            catch { zip.file(`ERROR_${f.name}.txt`, "Нет доступа"); }
        }

        if (isAiMode) {
            btnEl.innerText = "Генерация контекста...";
            const contextText = generateContextFile(filesList, videoLinks);
            zip.file("CONTEXT_FOR_AI.txt", contextText);
        }

        btnEl.innerText = "Архивация...";
        const zipName = isAiMode ? "Classroom_AI_Pack.zip" : "Classroom_Files.zip";
        
        if (Object.keys(zip.files).length > 0) {
            saveAs(await zip.generateAsync({type:"blob"}), zipName);
            showToast(isAiMode ? "🧠 AI Пакет готов!" : "📦 Архив готов!");
        } else {
            showToast("Нет данных для скачивания", true);
        }

        setTimeout(() => { btnEl.disabled = false; btnEl.innerText = originalText; }, 2000);
    }

    btn.onclick = () => {
        const result = scanFiles();
        createModal(result.files, result.videoLinks);
    };
})();