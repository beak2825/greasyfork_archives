// ==UserScript==
// @name         JVCode
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Améliore la balise codesur JVC : design moderne, Piston API, persistence preview, live preview fix, execution boutton.
// @author       FaceDePet
// @match        https://www.jeuxvideo.com/forums/*
// @match        https://www.jeuxvideo.com/messages-prives/*
// @match        https://www.jeuxvideo.com/news/*
// @match        https://www.jeuxvideo.com/wikis-soluce-astuces/*
// @icon         https://image.noelshack.com/fichiers/2017/04/1485268586-hackeur-v1.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource     HLJS_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @connect      emkc.org
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559631/JVCode.user.js
// @updateURL https://update.greasyfork.org/scripts/559631/JVCode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const hljsCss = GM_getResourceText("HLJS_CSS");
    GM_addStyle(hljsCss);

    // --- CSS ---
    const customCss = `
    /* SVG Data URIs */
    :root {
        --jv-icon-play: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'%3E%3C/polygon%3E%3C/svg%3E");
        --jv-icon-stop: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23e06c75' stroke-width='2' fill='%23e06c75' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='6' y='6' width='12' height='12'%3E%3C/rect%3E%3C/svg%3E");
        --jv-icon-loader: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23e06c75' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a9 9 0 1 1-6.219-8.56'%3E%3C/path%3E%3C/svg%3E");
        --jv-icon-copy: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
        --jv-icon-check: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='%2398c379' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
        --jv-icon-close: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
    }

    .jv-enhanced-code {
        background-color: #282c34; border-radius: 8px; margin: 10px 0; overflow: hidden;
        font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid #3e4451;
        display: flex; flex-direction: column; max-width: 100%;
    }
    .jv-code-header {
        display: flex; justify-content: space-between; align-items: center;
        background-color: #21252b; padding: 5px 10px 5px 15px;
        border-bottom: 1px solid #181a1f; height: 32px;
    }
    .jv-lang-select {
        background-color: #2c313a; color: #61afef; border: 1px solid #3e4451;
        border-radius: 4px; padding: 2px 5px; font-size: 11px; font-weight: bold;
        cursor: pointer; outline: none;
        max-width: 150px;
        text-overflow: ellipsis; white-space: nowrap; overflow: hidden;
    }
    .jv-code-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

    .jv-icon-btn {
        background: transparent; border: 1px solid transparent; color: #abb2bf;
        cursor: pointer; padding: 4px; border-radius: 4px; display: flex;
        align-items: center; justify-content: center; height: 26px; min-width: 26px;
    }
    .jv-icon-btn:hover { background-color: #3e4451; color: white; }

    .jv-run-btn { border: 1px solid #3e4451; padding: 0 8px; gap: 5px; font-size: 11px; font-weight: bold; transition: all 0.2s;}
    .jv-run-btn:hover { border-color: #98c379; color: #98c379; }

    .jv-icon {
        display: inline-block; width: 16px; height: 16px;
        background-position: center; background-repeat: no-repeat; background-size: contain;
        vertical-align: middle;
    }
    .jv-icon-play { background-image: var(--jv-icon-play); }
    .jv-icon-stop { background-image: var(--jv-icon-stop); }
    .jv-icon-loader { background-image: var(--jv-icon-loader); }
    .jv-icon-copy { background-image: var(--jv-icon-copy); }
    .jv-icon-check { background-image: var(--jv-icon-check); }
    .jv-icon-close { background-image: var(--jv-icon-close); width: 20px; height: 20px;}

    .jv-run-btn.is-running { border-color: #e06c75; color: #e06c75; }
    .jv-run-btn.is-running:hover { background-color: rgba(224, 108, 117, 0.1); }

    @keyframes jv-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .jv-spin-anim { animation: jv-spin 1s linear infinite; }

    .jv-code-body { display: flex; width: 100%; min-width: 0; }
    .jv-line-numbers {
        text-align: right; padding: 10px 10px 10px 15px; background-color: #282c34;
        color: #495162; border-right: 1px solid #3e4451; user-select: none; flex-shrink: 0;
    }
    .jv-code-content {
        padding: 10px 15px; background-color: #282c34; color: #abb2bf; line-height: 1.5;
        tab-size: 4; flex-grow: 1; overflow-x: auto; min-width: 0;
    }
    .jv-code-content pre { margin: 0 !important; padding: 0 !important; border: none !important; background: none !important; }
    .jv-code-content code.hljs { padding: 0; background: transparent; white-space: pre; overflow-x: visible; }
    .jv-code-output {
        background-color: #1e2127; border-top: 1px solid #3e4451; padding: 10px;
        color: #e5c07b; font-family: 'Consolas', monospace; font-size: 12px;
        white-space: pre-wrap; display: none; max-height: 300px; overflow-y: auto;
    }
    .jv-code-output.error { color: #e06c75; }
    .jv-code-output.warning { color: #d19a66; }
    .jv-code-output.loading { color: #abb2bf; font-style: italic; }
    .jv-code-content::-webkit-scrollbar, .jv-code-output::-webkit-scrollbar { height: 8px; width: 8px; background-color: #282c34; }
    .jv-code-content::-webkit-scrollbar-thumb, .jv-code-output::-webkit-scrollbar-thumb { background-color: #4b5363; border-radius: 4px; }

    .jv-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999999;
        display: flex; justify-content: center; align-items: center;
        opacity: 0; visibility: hidden; transition: all 0.2s;
    }
    .jv-modal-overlay.active { opacity: 1; visibility: visible; }
    .jv-modal {
        background: #21252b; border: 1px solid #3e4451; border-radius: 8px;
        width: 400px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .jv-modal-header { padding: 15px; border-bottom: 1px solid #3e4451; display: flex; justify-content: space-between; align-items: center; color: #abb2bf; font-weight: bold; }
    .jv-modal-close { cursor: pointer; color: #abb2bf; background: none; border: none; font-size: 16px;}
    .jv-modal-search { padding: 10px; border-bottom: 1px solid #3e4451; }
    .jv-modal-search input { width: 100%; background: #282c34; border: 1px solid #3e4451; color: white; padding: 8px; border-radius: 4px; outline: none; }
    .jv-modal-list { overflow-y: auto; flex-grow: 1; padding: 5px; }
    .jv-modal-item { padding: 8px 10px; cursor: pointer; color: #abb2bf; border-radius: 4px; display: flex; justify-content: space-between; }
    .jv-modal-item:hover { background-color: #3e4451; color: white; }
    .jv-loader { text-align: center; padding: 20px; color: #61afef; }

    @media (max-width: 600px) {
        .jv-lang-select { max-width: 100px; font-size: 10px; }
        .jv-code-header { padding: 5px; }
        .jv-run-btn span:not(.jv-icon) { display: none; }
        .jv-run-btn { padding: 0 5px; }
    }
    `;
    GM_addStyle(customCss);

    // --- DATA ---
    const initialLangs = [
        { name: 'Texte', piston: null, hljs: 'text' },
        { name: 'Python', piston: 'python', hljs: 'python' },
        { name: 'JavaScript', piston: 'javascript', hljs: 'javascript' },
        { name: 'TypeScript', piston: 'typescript', hljs: 'typescript' },
        { name: 'Java', piston: 'java', hljs: 'java' },
        { name: 'C', piston: 'c', hljs: 'c' },
        { name: 'C++', piston: 'cpp', hljs: 'cpp' },
        { name: 'C#', piston: 'csharp', hljs: 'csharp' },
        { name: 'Go', piston: 'go', hljs: 'go' },
        { name: 'Rust', piston: 'rust', hljs: 'rust' },
        { name: 'PHP', piston: 'php', hljs: 'php' },
        { name: 'Lua', piston: 'lua', hljs: 'lua' },
        { name: 'Bash', piston: 'bash', hljs: 'bash' },
        { name: 'SQL', piston: 'sqlite3', hljs: 'sql' }
    ];

    const fallbackRuntimes = [
        { language: 'swift', version: 'Offline fallback', aliases: [] },
        { language: 'ruby', version: 'Offline fallback', aliases: [] },
        { language: 'kotlin', version: 'Offline fallback', aliases: [] },
        { language: 'scala', version: 'Offline fallback', aliases: [] },
        { language: 'perl', version: 'Offline fallback', aliases: [] },
        { language: 'haskell', version: 'Offline fallback', aliases: [] },
        { language: 'clojure', version: 'Offline fallback', aliases: [] },
        { language: 'elixir', version: 'Offline fallback', aliases: [] },
        { language: 'dart', version: 'Offline fallback', aliases: [] }
    ];

    let cachedRuntimes = null;
    let currentSelectElement = null;
    let modalOverlay = null;
    const previewState = {};

    // --- FONCTIONS ---

    function fetchAllRuntimes(callback) {
        if (cachedRuntimes && cachedRuntimes.length > 0) { callback(cachedRuntimes); return; }

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://emkc.org/api/v2/piston/runtimes",
            timeout: 5000,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        cachedRuntimes = data.sort((a, b) => a.language.localeCompare(b.language));
                        callback(cachedRuntimes);
                    } catch (e) { callback(fallbackRuntimes); }
                } else { callback(fallbackRuntimes); }
            },
            onerror: function(err) { callback(fallbackRuntimes); },
            ontimeout: function() { callback(fallbackRuntimes); }
        });
    }

    function createModal() {
        if (document.querySelector('.jv-modal-overlay')) return;
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'jv-modal-overlay';
        modalOverlay.innerHTML = `<div class="jv-modal"> <div class="jv-modal-header"><span>Sélectionner un langage</span><button class="jv-modal-close" type="button"><span class="jv-icon jv-icon-close"></span></button></div> <div class="jv-modal-search"><input type="text" placeholder="Rechercher..." id="jv-lang-search"></div> <div class="jv-modal-list" id="jv-lang-list"><div class="jv-loader">Chargement...</div></div> </div>`;
        document.body.appendChild(modalOverlay);

        const closeBtn = modalOverlay.querySelector('.jv-modal-close');
        const searchInput = modalOverlay.querySelector('#jv-lang-search');
        const close = () => {
            modalOverlay.classList.remove('active');
            if(currentSelectElement && currentSelectElement.value === 'LOAD_MORE') {
                currentSelectElement.value = currentSelectElement.getAttribute('data-prev-val') || 'text';
            }
            currentSelectElement = null;
        };
        closeBtn.addEventListener('click', close);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) close(); });
        searchInput.addEventListener('input', (e) => { renderModalList(e.target.value); });
    }

    function renderModalList(filter = '') {
        const listContainer = document.getElementById('jv-lang-list');
        listContainer.innerHTML = '';
        const data = cachedRuntimes || fallbackRuntimes;
        if (data === fallbackRuntimes) {
            const warning = document.createElement('div');
            warning.style.cssText = "padding:5px 10px; background:#3e2e2e; color:#e06c75; font-size:11px; text-align:center;";
            warning.textContent = "⚠ API indisponible. Liste réduite (Mode hors-ligne).";
            listContainer.appendChild(warning);
        }
        const lowerFilter = filter.toLowerCase();
        let count = 0;
        data.forEach(rt => {
            if (rt.language.toLowerCase().includes(lowerFilter) || (rt.aliases && rt.aliases.some(a => a.toLowerCase().includes(lowerFilter)))) {
                const item = document.createElement('div');
                item.className = 'jv-modal-item';
                item.innerHTML = `<span>${rt.language}</span><span class="jv-modal-item-ver">${rt.version}</span>`;
                item.addEventListener('click', () => { selectLanguageFromModal(rt); });
                listContainer.appendChild(item);
                count++;
            }
        });
        if (count === 0) {
            const noRes = document.createElement('div');
            noRes.style.padding = "10px"; noRes.style.color = "#aaa"; noRes.textContent = "Aucun résultat.";
            listContainer.appendChild(noRes);
        }
    }

    function openLangModal(targetSelect) {
        if (!modalOverlay) createModal();
        currentSelectElement = targetSelect;
        modalOverlay.classList.add('active');
        document.getElementById('jv-lang-search').value = '';
        document.getElementById('jv-lang-search').focus();
        if (!cachedRuntimes) { fetchAllRuntimes(() => renderModalList()); } else { renderModalList(); }
    }

    function selectLanguageFromModal(runtime) {
        if (!currentSelectElement) return;
        let exists = false;
        for (let i = 0; i < currentSelectElement.options.length; i++) {
            if (currentSelectElement.options[i].value === runtime.language) { exists = true; break; }
        }
        if (!exists) {
            const option = document.createElement('option');
            option.value = runtime.language;
            option.textContent = runtime.language.charAt(0).toUpperCase() + runtime.language.slice(1);
            option.setAttribute('data-hljs', runtime.language);
            currentSelectElement.add(option, currentSelectElement.options.length - 1);
        }
        currentSelectElement.value = runtime.language;
        currentSelectElement.dispatchEvent(new Event('change'));
        modalOverlay.classList.remove('active');
        currentSelectElement = null;
    }

    function resetRunButton(btn) {
        if (!btn) return;
        const icon = btn.querySelector('.jv-icon');
        const text = btn.querySelector('span:not(.jv-icon)');

        icon.className = 'jv-icon jv-icon-play';
        icon.classList.remove('jv-spin-anim');
        text.textContent = 'Run';

        btn.classList.remove('is-running');
        btn.removeAttribute('data-running');
    }

    function runCode(code, pistonLang, outputElement, runBtn) {
        if (!pistonLang || pistonLang === 'null') {
            outputElement.style.display = 'block'; outputElement.textContent = "Langage non exécutable.";
            outputElement.className = 'jv-code-output error'; return null;
        }

        outputElement.style.display = 'block';
        outputElement.textContent = "Exécution en cours...";
        outputElement.className = 'jv-code-output loading';

        // UI en mode STOP
        const icon = runBtn.querySelector('.jv-icon');
        const text = runBtn.querySelector('span:not(.jv-icon)');

        icon.className = 'jv-icon jv-icon-loader jv-spin-anim';
        text.textContent = 'Stop';

        runBtn.classList.add('is-running');
        runBtn.setAttribute('data-running', 'true');

        const slowResponseTimer = setTimeout(() => {
            if (runBtn.getAttribute('data-running') === 'true') {
                outputElement.className = 'jv-code-output warning';
                outputElement.innerHTML = "⏳ <b>Attente prolongée...</b><br>L'API Piston met du temps à répondre.<br>On patiente encore un peu...";
            }
        }, 3000);

        return GM_xmlhttpRequest({
            method: "POST",
            url: "https://emkc.org/api/v2/piston/execute",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ language: pistonLang, version: "*", files: [{ content: code }] }),
            onload: function(response) {
                clearTimeout(slowResponseTimer);
                if (runBtn.getAttribute('data-running') !== 'true') return;

                resetRunButton(runBtn);
                if (response.status === 0) {
                    outputElement.className = 'jv-code-output error';
                    outputElement.innerHTML = "⚠️ <b>Erreur (Status 0)</b><br>Requête bloquée ou échouée.";
                    return;
                }
                if (response.status !== 200) {
                    outputElement.className = 'jv-code-output error';
                    outputElement.textContent = `Erreur API HTTP ${response.status}.`;
                    return;
                }
                try {
                    const res = JSON.parse(response.responseText);
                    let output = (res.run ? (res.run.stdout + res.run.stderr) : (res.message ? `Error: ${res.message}` : "Erreur inconnue"));
                    if (!output.trim()) output = "<Aucune sortie>";
                    outputElement.className = res.run && res.run.stderr ? 'jv-code-output error' : 'jv-code-output';
                    outputElement.textContent = output;
                } catch (e) {
                    outputElement.className = 'jv-code-output error'; outputElement.textContent = "Erreur parsing API.";
                }
            },
            onerror: function(err) {
                clearTimeout(slowResponseTimer);
                if (runBtn.getAttribute('data-running') !== 'true') return;
                resetRunButton(runBtn);
                outputElement.className = 'jv-code-output error';
                outputElement.textContent = "Erreur réseau.";
            },
            onabort: function() {
                clearTimeout(slowResponseTimer);
                resetRunButton(runBtn);
            },
            ontimeout: function() {
                clearTimeout(slowResponseTimer);
                if (runBtn.getAttribute('data-running') !== 'true') return;
                resetRunButton(runBtn);
                outputElement.className = 'jv-code-output error';
                outputElement.textContent = "Délai d'attente dépassé.";
            }
        });
    }

    function enhanceCodeBlocks(container = document) {
        const selectors = 'code.code-jv:not([data-processed="true"]), code.message__code:not([data-processed="true"])';
        const codeElements = container.querySelectorAll(selectors);

        codeElements.forEach(codeElement => {
            codeElement.setAttribute('data-processed', 'true');

            let targetToReplace = codeElement;
            const parent = codeElement.parentElement;
            if (parent && parent.tagName === 'PRE' && (parent.classList.contains('pre-jv') || parent.classList.contains('message__pre'))) {
                targetToReplace = parent;
                parent.setAttribute('data-processed', 'true');
            }

            let rawCode = codeElement.textContent.replace(/^\s*\n/g, '').replace(/\n\s*$/g, '');

            const isPreview = codeElement.closest('.messageEditor__containerPreview');
            let detectedHljsLang = null;
            let forcedPistonLang = null;

            if (isPreview) {
                const allRawCodesInPreview = Array.from(document.querySelectorAll('.messageEditor__containerPreview code.message__code, .messageEditor__containerPreview .code-jv'));
                const previewIndex = allRawCodesInPreview.indexOf(codeElement);
                if (previewIndex !== -1 && previewState[previewIndex]) {
                    forcedPistonLang = previewState[previewIndex].piston;
                    detectedHljsLang = previewState[previewIndex].hljs;
                }
            }

            if (!detectedHljsLang) {
                const highlightResult = hljs.highlightAuto(rawCode);
                detectedHljsLang = highlightResult.language || 'text';
            }

            let safeHighlightedCode;
            try { safeHighlightedCode = hljs.highlight(rawCode, { language: detectedHljsLang }).value; }
            catch (e) { safeHighlightedCode = hljs.highlightAuto(rawCode).value; }

            const lineCount = rawCode.split(/\r\n|\r|\n/).length;
            let lineNumbersHtml = '';
            for (let i = 1; i <= lineCount; i++) { lineNumbersHtml += `${i}\n`; }

            let optionsHtml = '';
            initialLangs.forEach(lang => {
                let isSelected = false;
                if (forcedPistonLang) {
                    if (lang.piston === forcedPistonLang) isSelected = true;
                } else if (!forcedPistonLang && lang.hljs === detectedHljsLang) {
                    isSelected = true;
                }
                optionsHtml += `<option value="${lang.piston || ''}" data-hljs="${lang.hljs}" ${isSelected ? 'selected' : ''}>${lang.name}</option>`;
            });

            if (forcedPistonLang && !initialLangs.some(l => l.piston === forcedPistonLang)) {
                optionsHtml += `<option value="${forcedPistonLang}" data-hljs="${detectedHljsLang}" selected>${forcedPistonLang}</option>`;
            }
            optionsHtml += `<option value="LOAD_MORE" style="font-weight:bold; color:#61afef;">➕ Charger plus...</option>`;

            const wrapper = document.createElement('div');
            wrapper.className = 'jv-enhanced-code';

            wrapper.innerHTML = `
                <div class="jv-code-header">
                    <select class="jv-lang-select" title="Changer le langage">${optionsHtml}</select>
                    <div class="jv-code-actions">
                        <button type="button" class="jv-icon-btn jv-run-btn" title="Exécuter (Piston API)"><span class="jv-icon jv-icon-play"></span> <span>Run</span></button>
                        <button type="button" class="jv-icon-btn jv-copy-btn" title="Copier le code"><span class="jv-icon jv-icon-copy"></span></button>
                    </div>
                </div>
                <div class="jv-code-body">
                    <div class="jv-line-numbers"><pre>${lineNumbersHtml}</pre></div>
                    <div class="jv-code-content"><pre><code class="hljs ${detectedHljsLang}">${safeHighlightedCode}</code></pre></div>
                </div>
                <div class="jv-code-output"></div>
            `;

            const selectInfo = wrapper.querySelector('.jv-lang-select');
            const codeContentBlock = wrapper.querySelector('.jv-code-content code');
            const lineNumbersBlock = wrapper.querySelector('.jv-line-numbers pre');
            selectInfo.setAttribute('data-prev-val', selectInfo.value);

            selectInfo.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'LOAD_MORE') { openLangModal(selectInfo); return; }

                selectInfo.setAttribute('data-prev-val', val);
                const selectedOption = e.target.options[e.target.selectedIndex];
                const newHljsClass = selectedOption.getAttribute('data-hljs') || val;

                if (isPreview) {
                    const allRawCodesInPreview = Array.from(document.querySelectorAll('.messageEditor__containerPreview code.message__code, .messageEditor__containerPreview .code-jv'));
                    const currentIndex = allRawCodesInPreview.indexOf(codeElement);
                    if (currentIndex !== -1) {
                        previewState[currentIndex] = { piston: val, hljs: newHljsClass };
                    }
                }
                codeContentBlock.className = `hljs ${newHljsClass}`;
                try {
                    codeContentBlock.innerHTML = hljs.highlight(rawCode, { language: newHljsClass }).value;
                } catch(e) {
                    codeContentBlock.innerHTML = hljs.highlightAuto(rawCode).value;
                }
            });

            const copyBtn = wrapper.querySelector('.jv-copy-btn');
            const copyIcon = copyBtn.querySelector('.jv-icon');

            copyBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                navigator.clipboard.writeText(rawCode).then(() => {
                    copyIcon.className = 'jv-icon jv-icon-check';
                    copyBtn.style.color = "#98c379";
                    setTimeout(() => {
                        copyIcon.className = 'jv-icon jv-icon-copy';
                        copyBtn.style.color = "";
                    }, 2000);
                });
            });

            const runBtn = wrapper.querySelector('.jv-run-btn');
            const outputDiv = wrapper.querySelector('.jv-code-output');

            runBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                if (runBtn.getAttribute('data-running') === 'true') {
                    if (runBtn._currentRequest && typeof runBtn._currentRequest.abort === 'function') {
                        runBtn._currentRequest.abort();
                    }
                    resetRunButton(runBtn);
                    outputDiv.className = 'jv-code-output warning';
                    outputDiv.textContent = "Arrêt forcé par l'utilisateur.";
                    return;
                }
                runBtn._currentRequest = runCode(rawCode, selectInfo.value, outputDiv, runBtn);
            });

            if (targetToReplace.parentNode) {
                const removalObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.removedNodes) {
                            mutation.removedNodes.forEach((removedNode) => {
                                if (removedNode === targetToReplace) {
                                    wrapper.remove();
                                    removalObserver.disconnect();
                                }
                            });
                        }
                    }
                });
                removalObserver.observe(targetToReplace.parentNode, { childList: true });
            }

            if (isPreview) {
                const observerConfig = { characterData: true, childList: true, subtree: true };
                const liveObserver = new MutationObserver((mutations) => {
                    // Si le wrapper n'est plus dans le DOM (supprimé par removalObserver), on arrête tout
                    if (!document.body.contains(wrapper)) {
                        liveObserver.disconnect();
                        return;
                    }

                    const newText = codeElement.textContent.replace(/^\s*\n/g, '').replace(/\n\s*$/g, '');
                    if (newText === rawCode) return;
                    rawCode = newText;
                    const newLineCount = rawCode.split(/\r\n|\r|\n/).length;
                    let newLineHtml = '';
                    for (let i = 1; i <= newLineCount; i++) newLineHtml += `${i}\n`;
                    lineNumbersBlock.textContent = newLineHtml;
                    const currentHljsClass = selectInfo.options[selectInfo.selectedIndex]?.getAttribute('data-hljs') || 'text';
                    let newHighlightedHtml;
                    try {
                        newHighlightedHtml = hljs.highlight(rawCode, { language: currentHljsClass }).value;
                    } catch (e) {
                        newHighlightedHtml = hljs.highlightAuto(rawCode).value;
                    }
                    codeContentBlock.innerHTML = newHighlightedHtml;
                });
                liveObserver.observe(codeElement, observerConfig);
            }

            targetToReplace.style.display = 'none';
            targetToReplace.parentNode.insertBefore(wrapper, targetToReplace);
        });
    }

    enhanceCodeBlocks();

    const observer = new MutationObserver((mutations) => {
        let shouldEnhanceGlobal = false;
        let previewUpdateDetected = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const targetNode = mutation.target;
                const isPreview = targetNode.closest && targetNode.closest('.messageEditor__containerPreview');
                if (isPreview) {
                    previewUpdateDetected = true;
                } else {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.code-jv, .pre-jv')) shouldEnhanceGlobal = true;
                            if (node.matches && node.matches('.code-jv, .pre-jv')) shouldEnhanceGlobal = true;
                        }
                    });
                }
            }
        }

        if (previewUpdateDetected) {
            const previewContainer = document.querySelector('.messageEditor__containerPreview');
            if (previewContainer) enhanceCodeBlocks(previewContainer);
        } else if (shouldEnhanceGlobal) {
            enhanceCodeBlocks(document.body);
        }
    });

    const targetNode = document.getElementById('page-messages-forum') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

})();