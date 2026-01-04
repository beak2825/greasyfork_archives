// ==UserScript==
// @name         TXT 閱讀器-By Gemini
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  專為本地 TXT 檔案設計的閱讀器。自動載入檔案內容，支援：自動分章、牛皮紙質感、原俠正楷、智慧編碼偵測、自動記憶閱讀位置。
// @author       Gemini
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560599/TXT%20%E9%96%B1%E8%AE%80%E5%99%A8-By%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/560599/TXT%20%E9%96%B1%E8%AE%80%E5%99%A8-By%20Gemini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自動偵測是否為 TXT 檔案
    if (location.protocol === 'file:' && location.pathname.endsWith('.txt')) {
        const pre = document.querySelector('pre');
        const initialContent = pre ? pre.innerText : document.body.innerText;
        const fileName = document.title || decodeURIComponent(location.pathname.split('/').pop());

        setTimeout(() => {
            launchReader({ title: fileName, content: initialContent });
        }, 200);
    } else {
        GM_registerMenuCommand("📖 啟動 TXT 極致閱讀器", () => launchReader(null));
    }

    // --- 啟動閱讀器 ---
    function launchReader(autoData = null) {
        document.documentElement.removeAttribute('style');
        document.body.removeAttribute('style');
        document.body.className = '';
        document.body.innerHTML = '';

        const css = `
            :root {
                --main-bg: #f2f3f5; --paper-bg: #f9f4e3; --paper-texture: none;
                --text-color: #3b302a; --accent-color: #8c6a5d; --navbar-bg: rgba(255, 255, 255, 0.85);
                --font-size: 20px; --line-height: 1.8; --letter-spacing: 0.5px;
                --font-family: "原俠正楷", "KaiTi", "標楷體", 'Noto Serif TC', serif;
                --main-width: 800px;
                --shadow-light: 0 4px 20px rgba(0,0,0,0.06); --shadow-paper: 0 2px 30px rgba(0,0,0,0.08);
            }
            * { box-sizing: border-box; outline: none; -webkit-tap-highlight-color: transparent; }
            body { margin: 0; padding: 0; background-color: var(--main-bg); color: var(--text-color); font-family: "Noto Sans TC", sans-serif; height: 100vh; overflow: hidden; transition: background-color 0.5s ease, color 0.5s ease; }
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
            #navbar { position: fixed; top: 0; left: 0; width: 100%; height: 64px; background: var(--navbar-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; z-index: 100; user-select: none; box-shadow: var(--shadow-light); transition: all 0.3s; }
            .nav-info { display: flex; flex-direction: column; gap: 2px; overflow: hidden; max-width: 40%; }
            .book-name { font-weight: 700; font-size: 0.9em; opacity: 0.7; letter-spacing: 1px; }
            .chapter-name { font-size: 1.1em; font-weight: 600; color: var(--accent-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .nav-btn-group { display: flex; gap: 12px; flex-shrink: 0; }
            .nav-btn { cursor: pointer; font-size: 14px; padding: 8px 16px; background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; color: #555; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; align-items: center; gap: 6px; }
            .nav-btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: var(--accent-color); }
            .nav-btn:active { transform: translateY(0); box-shadow: none; }
            input[type="file"] { display: none; }
            #main-container { height: 100vh; overflow-y: auto; padding-top: 80px; scroll-behavior: auto; }
            #content-wrapper { max-width: var(--main-width); margin: 0 auto 100px auto; background-color: var(--paper-bg); background-image: var(--paper-texture); padding: 60px 80px; border-radius: 2px; box-shadow: var(--shadow-paper); min-height: 80vh; font-family: var(--font-family); font-size: var(--font-size); line-height: var(--line-height); letter-spacing: var(--letter-spacing); text-align: justify; color: var(--text-color); transition: background-color 0.3s, color 0.3s, width 0.3s; }
            @media (max-width: 768px) { #navbar { padding: 0 15px; height: 56px; } .nav-info { max-width: 120px; } .nav-btn { padding: 6px 10px; font-size: 12px; } .nav-btn span { display: none; } #content-wrapper { padding: 30px 20px; width: 100% !important; box-shadow: none; border-radius: 0; } #main-container { background-color: var(--paper-bg); background-image: var(--paper-texture); } }
            .chapter-node { padding-bottom: 60px; margin-bottom: 40px; border-bottom: 1px dashed rgba(0, 0, 0, 0.05); }
            .chapter-title { font-size: 1.6em; font-weight: 700; margin-top: 40px; margin-bottom: 40px; color: var(--accent-color); text-align: center; position: relative; }
            .chapter-title::after { content: ''; display: block; width: 40px; height: 2px; background: var(--accent-color); opacity: 0.3; margin: 15px auto 0 auto; }
            .chapter-text { white-space: pre-wrap; }
            .loading-indicator { text-align: center; padding: 40px; font-size: 0.9em; opacity: 0.5; letter-spacing: 2px; color: var(--text-color); }
            .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.2); backdrop-filter: blur(2px); z-index: 200; display: none; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; }
            .modal-overlay.show { opacity: 1; }
            .modal-content { background: #fff; color: #333; width: 90%; max-width: 420px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 80vh; border: 1px solid rgba(0,0,0,0.05); transform: translateY(20px); transition: transform 0.3s ease; }
            .modal-overlay.show .modal-content { transform: translateY(0); }
            .modal-header { padding: 20px 25px; font-weight: 700; font-size: 18px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; }
            .close-modal { cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f5f5f5; color: #666; transition: all 0.2s; }
            .close-modal:hover { background: #e0e0e0; color: #000; }
            .modal-body { padding: 25px; overflow-y: auto; flex-grow: 1; }
            .control-row { margin-bottom: 24px; }
            .control-row label { display: block; margin-bottom: 10px; font-weight: 600; font-size: 14px; color: #555; }
            select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; background: #f9f9f9; font-size: 14px; cursor: pointer; outline: none; }
            select:hover { border-color: #bbb; }
            .theme-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
            .theme-btn { height: 45px; border-radius: 10px; cursor: pointer; position: relative; border: 2px solid transparent; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .theme-btn.active { border-color: var(--accent-color); transform: scale(0.95); }
            .theme-btn:hover { transform: translateY(-2px); }
            .fine-tune-control { display: flex; align-items: center; gap: 10px; background: #f5f5f5; padding: 5px; border-radius: 12px; }
            .tune-btn { background: #fff; color: #333; border: 1px solid #eee; width: 32px; height: 32px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; justify-content: center; align-items: center; }
            .tune-btn:active { background: #eee; transform: scale(0.95); }
            input[type="range"] { flex-grow: 1; cursor: pointer; }
            #toc-list { list-style: none; padding: 0; margin: 0; }
            #toc-list li { padding: 14px 10px; border-bottom: 1px solid #f9f9f9; cursor: pointer; font-size: 15px; color: #444; transition: all 0.2s; border-radius: 6px; }
            #toc-list li:hover { background: #f5f5f5; padding-left: 15px; color: var(--accent-color); }
            #toc-list li.active { color: var(--accent-color); font-weight: bold; background: rgba(0,0,0,0.03); }
            #error-message { position: fixed; top: 70px; left: 50%; transform: translateX(-50%); background-color: #ffeff0; color: #d63031; padding: 10px 20px; border-radius: 30px; font-size: 14px; z-index: 999; box-shadow: 0 4px 15px rgba(214, 48, 49, 0.2); display: none; border: 1px solid rgba(214, 48, 49, 0.1); }
            #loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(5px); display: none; flex-direction: column; justify-content: center; align-items: center; z-index: 500; font-size: 16px; color: #555; }
            .spinner { width: 40px; height: 40px; margin-bottom: 20px; border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 0.8s ease-in-out infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .encoding-warning { background: #fff3cd; color: #856404; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 15px; display: none; }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&family=Noto+Sans+TC:wght@300;400;500&display=swap';
        document.head.appendChild(fontLink);

        document.body.innerHTML = `
            <div id="loading-overlay">
                <div class="spinner"></div>
                <span id="loading-text">正在讀取書籍...</span>
                <p style="font-size: 13px; margin-top: 8px; opacity: 0.6;" id="loading-subtext"></p>
            </div>

            <div id="navbar">
                <div class="nav-info">
                    <div class="book-name" id="book-title">閱讀器準備就緒</div>
                    <div class="chapter-name" id="current-chapter-title">請開啟 TXT 檔案</div>
                </div>
                <div class="nav-btn-group">
                    <label for="fileInput" class="nav-btn">📂 <span>開啟</span></label>
                    <div class="nav-btn" id="btn-toc">📖 <span>目錄</span></div>
                    <div class="nav-btn" id="btn-settings">⚙ <span>設定</span></div>
                </div>
                <input type="file" id="fileInput" accept=".txt">
            </div>

            <div id="error-message"></div>

            <div id="main-container" tabindex="0">
                <div id="empty-state" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; color:#999;">
                    <div style="font-size: 40px; margin-bottom: 20px; opacity: 0.3;">📚</div>
                    <h2 style="font-weight: 400; letter-spacing: 1px;">開始您的閱讀之旅</h2>
                    <p style="font-size: 0.9em; opacity: 0.6; margin-top:10px;">點擊左上角「開啟」選擇檔案<br>支援 UTF-8 / GB18030 / Big5</p>
                </div>
                <div id="top-loader" class="loading-indicator" style="display:none;">正在載入上一章...</div>
                <div id="content-wrapper"></div>
                <div id="bottom-loader" class="loading-indicator" style="display:none;">正在載入下一章...</div>
            </div>

            <!-- 設定彈窗 -->
            <div id="settings-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        偏好設定 <span class="close-modal" id="close-settings">✕</span>
                    </div>
                    <div class="modal-body">
                        <div class="control-row">
                            <label>檔案編碼偵測</label>
                            <div id="encoding-warning" class="encoding-warning">⚠ 偵測到亂碼，已自動切換為 GB18030 (簡體)。</div>
                            <select id="set-encoding">
                                <option value="auto">✨ 自動偵測 (推薦)</option>
                                <option value="UTF-8">UTF-8 (通用格式)</option>
                                <option value="GB18030">GB18030 (簡體中文)</option>
                                <option value="Big5">Big5 (繁體中文)</option>
                            </select>
                        </div>
                        <hr style="border:0; border-top:1px solid #eee; margin: 20px 0;">
                        <div class="control-row">
                            <label>閱讀主題</label>
                            <div class="theme-grid">
                                <div class="theme-btn active" id="theme-parchment" style="background:#f9f4e3;" data-main="#f2f3f5" data-paper="#f9f4e3" data-text="#3b302a" data-accent="#8c6a5d"></div>
                                <div class="theme-btn" id="theme-kraft" style="background:#e0cda7;" data-main="#d8c8b0" data-paper="#e6d6c0" data-text="#423226" data-accent="#8a6248" data-texture="url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.08%22/></svg>')"></div>
                                <div class="theme-btn" id="theme-green" style="background:#e3edcd;" data-main="#dcead7" data-paper="#e3edcd" data-text="#2e4028" data-accent="#4b7040"></div>
                                <div class="theme-btn" id="theme-white" style="background:#ffffff;" data-main="#f0f2f5" data-paper="#ffffff" data-text="#222222" data-accent="#2c3e50"></div>
                                <div class="theme-btn" id="theme-dark" style="background:#2b2b2b;" data-main="#1a1a1a" data-paper="#2b2b2b" data-text="#b0b0b0" data-accent="#7a9cba"></div>
                            </div>
                        </div>
                        <div class="control-row">
                            <label>字體風格</label>
                            <select id="set-font">
                                <option value='"原俠正楷", "KaiTi", "標楷體", "Noto Serif TC", serif'>原俠正楷 / 宋體 (推薦)</option>
                                <option value='"Noto Sans TC", "Microsoft JhengHei", "微軟正黑體", sans-serif'>微軟正黑體 (現代)</option>
                                <option value='"PMingLiU", "新細明體", serif'>新細明體 (傳統)</option>
                                <option value="custom">自訂字體...</option>
                            </select>
                            <input type="text" id="custom-font-input" placeholder="輸入字體名稱" style="display:none; margin-top:8px; width:100%; padding:10px; border:1px solid #eee; border-radius:8px;">
                        </div>
                        <div class="control-row">
                            <label>字體大小 (<span id="val-size">22</span>px)</label>
                            <div class="fine-tune-control">
                                <button class="tune-btn" id="size-minus">-</button>
                                <input type="range" id="set-size" min="14" max="40" step="1" value="22">
                                <button class="tune-btn" id="size-plus">+</button>
                            </div>
                        </div>
                        <div class="control-row">
                            <label>行距 (<span id="val-line">1.8</span>)</label>
                            <div class="fine-tune-control">
                                <button class="tune-btn" id="line-minus">-</button>
                                <input type="range" id="set-line" min="1.4" max="2.5" step="0.1" value="1.8">
                                <button class="tune-btn" id="line-plus">+</button>
                            </div>
                        </div>
                        <div class="control-row">
                            <label>頁面寬度 (<span id="val-width">800</span>px)</label>
                            <input type="range" id="set-width" min="400" max="1400" step="50" value="800" style="width:100%">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 目錄彈窗 -->
            <div id="toc-modal" class="modal-overlay">
                <div class="modal-content" style="height: 75vh;">
                    <div class="modal-header">
                        章節目錄 <span class="close-modal" id="close-toc">✕</span>
                    </div>
                    <div class="modal-body" id="toc-container">
                        <ul id="toc-list"></ul>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => initReaderLogic(autoData), 50);
    }

    function initReaderLogic(autoData) {
        const els = {
            container: document.getElementById('main-container'),
            wrapper: document.getElementById('content-wrapper'),
            tocList: document.getElementById('toc-list'),
            fileInput: document.getElementById('fileInput'),
            empty: document.getElementById('empty-state'),
            bookTitle: document.getElementById('book-title'),
            chapTitle: document.getElementById('current-chapter-title'),
            topLoader: document.getElementById('top-loader'),
            bottomLoader: document.getElementById('bottom-loader'),
            fontSelect: document.getElementById('set-font'),
            customFont: document.getElementById('custom-font-input'),
            size: document.getElementById('set-size'),
            line: document.getElementById('set-line'),
            width: document.getElementById('set-width'),
            encodingSelect: document.getElementById('set-encoding'),
            encodingWarning: document.getElementById('encoding-warning'),
            errorMessage: document.getElementById('error-message'),
            loadingOverlay: document.getElementById('loading-overlay'),
            loadingText: document.getElementById('loading-text'),
            loadingSub: document.getElementById('loading-subtext'),
        };

        const MAX_FILE_SIZE_MB = 50;

        let chapters = [];
        let currentFileKey = "";
        let renderedRange = { start: -1, end: -1 };
        let observer;
        let currentChapterIndex = 0;
        let currentFileHandle = null;

        function bindClick(id, handler) {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler);
        }

        bindClick('btn-toc', () => openModal('toc-modal'));
        bindClick('btn-settings', () => openModal('settings-modal'));
        bindClick('close-settings', () => closeModal('settings-modal'));
        bindClick('close-toc', () => closeModal('toc-modal'));

        bindClick('size-minus', () => tuneSetting('size', -1));
        bindClick('size-plus', () => tuneSetting('size', 1));
        bindClick('line-minus', () => tuneSetting('line', -0.1));
        bindClick('line-plus', () => tuneSetting('line', 0.1));

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => setTheme(btn));
        });

        if (els.fileInput) els.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            currentFileHandle = file;
            loadFile(file, 'auto');
        });

        if (els.encodingSelect) els.encodingSelect.addEventListener('change', (e) => {
            if (!currentFileHandle) return;
            const newEncoding = e.target.value;
            toggleLoadingOverlay(true, `正在以 ${newEncoding} 重新讀取...`);
            setTimeout(() => loadFile(currentFileHandle, newEncoding), 50);
        });

        if (els.fontSelect) els.fontSelect.addEventListener('change', updateStyle);
        if (els.customFont) els.customFont.addEventListener('input', updateStyle);
        if (els.size) els.size.addEventListener('input', updateStyle);
        if (els.line) els.line.addEventListener('input', updateStyle);
        if (els.width) els.width.addEventListener('input', updateStyle);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-overlay');
                let anyVisible = false;
                modals.forEach(el => {
                    if(el.style.display === 'flex') {
                        closeModal(el.id);
                        anyVisible = true;
                    }
                });
                if(!anyVisible) els.container.focus();
                return;
            }
            if (!document.querySelector('.modal-overlay[style*="flex"]')) {
                const scrollAmount = els.container.clientHeight * 0.8;
                if (e.code === 'Space' || e.key === 'PageDown') {
                    e.preventDefault();
                    els.container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                } else if (e.key === 'PageUp') {
                    e.preventDefault();
                    els.container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
                }
            }
        });

        els.container.addEventListener('scroll', () => {
            const scrollTop = els.container.scrollTop;
            const scrollHeight = els.container.scrollHeight;
            const clientHeight = els.container.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight - 300) appendNextChapter();
            if (scrollTop <= 200) prependPrevChapter();
            clearTimeout(window.saveTimer);
            window.saveTimer = setTimeout(saveProgress, 500);
        });

        document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target === o) closeModal(o.id); }));

        loadSettings();
        els.container.focus();

        if (autoData) {
            els.bookTitle.innerText = autoData.title.replace('.txt','');
            currentFileKey = `reader_v4_${autoData.title}_${autoData.content.length}`;
            processText(autoData.content);
        }

        function loadFile(file, encodingMode) {
            clearError();
            els.encodingWarning.style.display = 'none';
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                displayError(`檔案過大。建議 < ${MAX_FILE_SIZE_MB}MB。`, 0);
                toggleLoadingOverlay(false);
                return;
            }
            els.bookTitle.innerText = file.name.replace('.txt','');
            currentFileKey = `reader_v4_${file.name}_${file.size}`;

            const reader = new FileReader();
            let targetEncoding = encodingMode === 'auto' ? 'UTF-8' : encodingMode;

            reader.onload = (evt) => {
                let text = evt.target.result;
                if (encodingMode === 'auto') {
                    const sample = text.substring(0, 1000);
                    const replacementCount = (sample.match(/\uFFFD/g) || []).length;
                    if (replacementCount > 5) {
                        const retryReader = new FileReader();
                        retryReader.onload = (retryEvt) => {
                            els.encodingSelect.value = 'GB18030';
                            els.encodingWarning.style.display = 'block';
                            processText(retryEvt.target.result);
                        };
                        retryReader.readAsText(file, 'GB18030');
                        return;
                    }
                }
                processText(text);
            };

            reader.onerror = (e) => {
                 console.error(e);
                 displayError('檔案讀取失敗');
                 toggleLoadingOverlay(false);
            };

            toggleLoadingOverlay(true, "正在載入書籍...");
            reader.readAsText(file, targetEncoding);
        }

        function processText(text) {
            toggleLoadingOverlay(true, "正在解析章節...");
            setTimeout(() => {
                try {
                    parseChapters(text);
                    els.empty.style.display = 'none';
                    clearError();
                    const saved = JSON.parse(localStorage.getItem(currentFileKey));
                    if(saved) {
                        loadInitialChapter(saved.index, saved.scroll);
                    } else {
                        loadInitialChapter(0, 0);
                    }
                } catch (error) {
                    console.error(error);
                    displayError('解析失敗，可能是檔案格式問題');
                } finally {
                    toggleLoadingOverlay(false);
                }
            }, 50);
        }

        // 核心重構：使用 exec 迴圈進行解析，取代 split
        function parseChapters(text) {
            chapters = [];
            // Regex 匹配：
            // (?:^|[\r\n])  -> 確保標題在行首
            // \s*[【\[]?    -> 允許空白或【
            // (?:第|[Cc]hapter) -> 關鍵字
            // \s* -> 空白
            // [0-9...]+     -> 數字 (含 0 和中文數字)
            // \s*[\.．\s]* -> 分隔符號
            // [章回節卷部篇] -> 單位
            // .* -> 標題其餘部分
            const titleRegex = /(?:^|[\r\n])\s*[【\[]?(?:第|[Cc]hapter)\s*[0-9０-９〇零一二三四五六七八九十百千甲乙丙丁子丑寅卯辰巳午未申酉戌亥○]+\s*[\.．\s]*[章回節卷部篇].*/g;

            let match;
            let lastIndex = 0;

            // 迴圈找出所有標題
            while ((match = titleRegex.exec(text)) !== null) {
                const titleStart = match.index;
                const titleEnd = match.index + match[0].length;

                // 如果這不是第一個標題，則前一段的內容是從 lastIndex 到這裡
                if (chapters.length > 0) {
                    chapters[chapters.length - 1].content = text.substring(lastIndex, titleStart).trim();
                } else if (titleStart > 0) {
                    // 如果第一個標題之前有內容，則歸類為序章
                    chapters.push({
                        title: "【序章 / 引子】",
                        content: text.substring(0, titleStart).trim()
                    });
                }

                // 加入新章節 (內容稍後填入)
                chapters.push({
                    title: match[0].trim(),
                    content: ""
                });

                lastIndex = titleEnd;
            }

            // 處理最後一章的內容
            if (chapters.length > 0) {
                chapters[chapters.length - 1].content = text.substring(lastIndex).trim();
            } else {
                // 完全沒抓到章節，當作全文
                chapters.push({ title: "全文", content: text.trim() });
            }

            // 過濾掉標題和內容都為空的（防呆）
            chapters = chapters.filter(c => c.content || c.title);

            if(chapters.length === 0) throw new Error("Empty content");
            buildTOC();
        }

        function buildTOC() {
            els.tocList.innerHTML = '';
            const fragment = document.createDocumentFragment();
            chapters.forEach((ch, idx) => {
                const li = document.createElement('li');
                li.textContent = ch.title;
                li.id = `toc-${idx}`;
                li.addEventListener('click', () => {
                    loadInitialChapter(idx, 0);
                    closeModal('toc-modal');
                });
                fragment.appendChild(li);
            });
            els.tocList.appendChild(fragment);
        }

        function loadInitialChapter(index, scrollOffset) {
            if(index < 0 || index >= chapters.length) return;
            els.wrapper.innerHTML = '';
            renderedRange = { start: index, end: index };
            els.wrapper.appendChild(createChapterNode(index));
            if (index > 0) {
                els.wrapper.insertBefore(createChapterNode(index - 1), els.wrapper.firstChild);
                renderedRange.start = index - 1;
            }
            if (index < chapters.length - 1) {
                els.wrapper.appendChild(createChapterNode(index + 1));
                renderedRange.end = index + 1;
            }
            requestAnimationFrame(() => {
                els.container.style.scrollBehavior = 'auto';
                const targetNode = document.querySelector(`.chapter-node[data-index="${index}"]`);
                if (targetNode) {
                    const targetScrollTop = targetNode.offsetTop - 80 + scrollOffset;
                    els.container.scrollTop = Math.max(0, targetScrollTop);
                } else {
                    els.container.scrollTop = 0;
                }
                observeChapters();
                updateCurrentInfo(index);
                setTimeout(() => { els.container.style.scrollBehavior = 'smooth'; }, 100);
            });
        }

        function appendNextChapter() {
            const nextIdx = renderedRange.end + 1;
            if (nextIdx >= chapters.length) return;
            if(document.querySelector(`.chapter-node[data-index="${nextIdx}"]`)) return;
            els.bottomLoader.style.display = 'block';
            const node = createChapterNode(nextIdx);
            els.wrapper.appendChild(node);
            renderedRange.end = nextIdx;
            observeChapters();
            els.bottomLoader.style.display = 'none';
        }

        function prependPrevChapter() {
            const prevIdx = renderedRange.start - 1;
            if (prevIdx < 0) return;
            if(document.querySelector(`.chapter-node[data-index="${prevIdx}"]`)) return;
            els.topLoader.style.display = 'block';
            const oldScrollHeight = els.container.scrollHeight;
            const node = createChapterNode(prevIdx);
            els.wrapper.insertBefore(node, els.wrapper.firstChild);
            renderedRange.start = prevIdx;
            const diff = els.container.scrollHeight - oldScrollHeight;
            els.container.style.scrollBehavior = 'auto';
            els.container.scrollTop += diff;
            setTimeout(() => els.container.style.scrollBehavior = 'smooth', 50);
            observeChapters();
            els.topLoader.style.display = 'none';
        }

        function createChapterNode(index) {
            const div = document.createElement('div');
            div.className = 'chapter-node';
            div.dataset.index = index;
            div.innerHTML = `<div class="chapter-title">${chapters[index].title}</div><div class="chapter-text">${chapters[index].content}</div>`;
            return div;
        }

        function observeChapters() {
            if(observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting && entry.boundingClientRect.top > 80) {
                        const idx = parseInt(entry.target.dataset.index);
                        updateCurrentInfo(idx);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -80% 0px' });
            document.querySelectorAll('.chapter-node').forEach(node => observer.observe(node));
        }

        function updateCurrentInfo(idx) {
            if (!chapters[idx]) return;
            currentChapterIndex = idx;
            els.chapTitle.innerText = chapters[idx].title;
            const currentActive = document.querySelector('#toc-list li.active');
            if(currentActive) currentActive.classList.remove('active');
            const target = document.getElementById(`toc-${idx}`);
            if(target) target.classList.add('active');
        }

        function saveProgress() {
            if(!currentFileKey || chapters.length === 0) return;
            let visibleNode = null;
            const nodes = document.querySelectorAll('.chapter-node');
            for(let node of nodes) {
                const rect = node.getBoundingClientRect();
                if(rect.bottom > 85) {
                    visibleNode = node;
                    break;
                }
            }
            if(visibleNode) {
                const idx = parseInt(visibleNode.dataset.index);
                let offset = els.container.scrollTop - (visibleNode.offsetTop - 80);
                if (offset < 0) offset = 0;
                localStorage.setItem(currentFileKey, JSON.stringify({ index: idx, scroll: Math.floor(offset) }));
            }
        }

        function openModal(id) {
            const el = document.getElementById(id);
            el.style.display = 'flex';
            requestAnimationFrame(() => el.classList.add('show'));
            if(id === 'toc-modal') {
                const activeLi = document.querySelector('#toc-list li.active');
                if(activeLi) activeLi.scrollIntoView({block: "center", behavior: "smooth"});
            }
        }

        function closeModal(id) {
            const el = document.getElementById(id);
            el.classList.remove('show');
            setTimeout(() => { el.style.display = 'none'; }, 300);
            els.container.focus();
        }

        function tuneSetting(type, delta) {
            let inputEl = (type === 'size') ? els.size : els.line;
            let val = parseFloat(inputEl.value) + delta;
            val = Math.min(parseFloat(inputEl.max), Math.max(parseFloat(inputEl.min), val));
            if (type === 'line') val = Math.round(val * 10) / 10;
            inputEl.value = val;
            updateStyle();
        }

        function updateStyle() {
            let fontVal = els.fontSelect.value === 'custom' ? `"${els.customFont.value}", sans-serif` : els.fontSelect.value;
            document.documentElement.style.setProperty('--font-size', els.size.value + 'px');
            document.documentElement.style.setProperty('--line-height', els.line.value);
            document.documentElement.style.setProperty('--main-width', els.width.value + 'px');
            document.documentElement.style.setProperty('--font-family', fontVal);
            document.getElementById('val-size').textContent = els.size.value;
            document.getElementById('val-line').textContent = els.line.value;
            document.getElementById('val-width').textContent = els.width.value;

            if(els.fontSelect.value === 'custom') els.customFont.style.display = 'block';
            else els.customFont.style.display = 'none';

            saveSettings();
        }

        function setTheme(btn) {
            document.documentElement.style.setProperty('--main-bg', btn.dataset.main);
            document.documentElement.style.setProperty('--paper-bg', btn.dataset.paper);
            document.documentElement.style.setProperty('--text-color', btn.dataset.text);
            document.documentElement.style.setProperty('--accent-color', btn.dataset.accent);

            const texture = btn.dataset.texture || 'none';
            document.documentElement.style.setProperty('--paper-texture', texture);

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saveSettings();
        }

        function saveSettings() {
            const activeTheme = document.querySelector('.theme-btn.active');
            localStorage.setItem('reader_settings_v4', JSON.stringify({
                main: activeTheme ? activeTheme.dataset.main : getComputedStyle(document.documentElement).getPropertyValue('--main-bg'),
                paper: activeTheme ? activeTheme.dataset.paper : getComputedStyle(document.documentElement).getPropertyValue('--paper-bg'),
                text: activeTheme ? activeTheme.dataset.text : getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                accent: activeTheme ? activeTheme.dataset.accent : getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
                size: els.size.value, line: els.line.value, width: els.width.value,
                font: els.fontSelect.value, customFont: els.customFont.value
            }));
        }

        function loadSettings() {
            const s = JSON.parse(localStorage.getItem('reader_settings_v4'));
            if(s) {
                els.size.value = s.size; els.line.value = s.line; els.width.value = s.width;
                els.fontSelect.value = s.font || '"原俠正楷", "KaiTi", "標楷體", "Noto Serif TC", serif';
                if(s.customFont) els.customFont.value = s.customFont;

                const btns = document.querySelectorAll('.theme-btn');
                let found = false;
                btns.forEach(b => {
                    if(b.dataset.paper === s.paper) { setTheme(b); found = true; }
                });
                if(!found) {
                    document.documentElement.style.setProperty('--main-bg', s.main);
                    document.documentElement.style.setProperty('--paper-bg', s.paper);
                    document.documentElement.style.setProperty('--text-color', s.text);
                    document.documentElement.style.setProperty('--accent-color', s.accent);
                }
                updateStyle();
            }
        }

        function displayError(message, duration = 4000) {
            if (els.errorMessage) {
                els.errorMessage.innerHTML = '⚠ ' + message;
                els.errorMessage.style.display = 'block';
                setTimeout(() => { els.errorMessage.style.display = 'none'; }, duration);
            }
        }

        function clearError() {
            if (els.errorMessage) els.errorMessage.style.display = 'none';
        }

        function toggleLoadingOverlay(show, message, subtext) {
            if(message && els.loadingText) els.loadingText.textContent = message;
            if(subtext && els.loadingSub) els.loadingSub.textContent = subtext || "";
            if(els.loadingOverlay) els.loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }
})();