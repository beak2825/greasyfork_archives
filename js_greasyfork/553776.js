// ==UserScript==
// @name         Super Script (HQ Downloader + Bypasser)
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  Bypasser v7 com limpeza de cookies robusta e recarregamento inteligente de CAPTCHA. Downloader automático e extrator de títulos para HQs no HotContainer.
// @author       Seu Assistente de IA (versão aprimorada)
// @match        https://hotcontainer.co/tufos*
// @match        https://hotcontainer.co/tufos/quadrinho/visualizar/*
// @match        https://srtslug.biz/*
// @match        https://loan.techetta.net/*
// @match        https://loan.achivas.net/*
// @match        https://loan.napmap.net/*
// @license MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @grant        window.close
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553776/Super%20Script%20%28HQ%20Downloader%20%2B%20Bypasser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553776/Super%20Script%20%28HQ%20Downloader%20%2B%20Bypasser%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const isBypasserPage = /srtslug\.biz|loan\.(techetta|achivas|napmap)\.net/.test(hostname);

    // =========================================================================
    // --- BYPASSER (LÓGICA ATUALIZADA COM LIMPEZA DE COOKIES ROBUSTA) ---
    // =========================================================================
    if (isBypasserPage) {
        async function clearAllSiteData() {
            try {
                localStorage.clear();
                sessionStorage.clear();
                const cookies = await GM_cookie.list({ domain: window.location.hostname });
                for (const cookie of cookies) {
                    await GM_cookie.delete({
                        url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
                        name: cookie.name
                    });
                }
                console.log(`[Super Script] ${cookies.length} cookies limpos com sucesso para ${window.location.hostname}.`);
            } catch (e) {
                console.error('[Super Script] Falha na limpeza robusta de dados.', e);
            }
        }

        clearAllSiteData().then(() => {
            window.addEventListener('DOMContentLoaded', () => {
                function bypass_keepTabActive() { Object.defineProperty(document, 'hidden', { value: false, writable: false, configurable: true }); Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false, configurable: true }); window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true); window.addEventListener('blur', e => e.stopImmediatePropagation(), true); document.hasFocus = () => true; }
                function bypass_showStatus(message, isManualActionRequired = false) { let statusDiv = document.getElementById('userscript-status'); if (!statusDiv && document.body) { statusDiv = document.createElement('div'); statusDiv.id = 'userscript-status'; Object.assign(statusDiv.style, { position: 'fixed', top: '10px', right: '10px', color: 'white', padding: '12px 22px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: '99999', fontFamily: 'Arial, sans-serif', fontSize: '15px', fontWeight: 'bold' }); document.body.appendChild(statusDiv); } if (statusDiv) { statusDiv.style.backgroundColor = isManualActionRequired ? '#ffc107' : '#28a745'; statusDiv.style.color = isManualActionRequired ? 'black' : 'white'; statusDiv.textContent = message; } }
                const bypass_sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
                function bypass_waitForElement(selector, timeout = 15000) { return new Promise((resolve, reject) => { const timer = setTimeout(() => { clearInterval(interval); reject(new Error(`Elemento não encontrado ou não visível: ${selector}`)); }, timeout); const interval = setInterval(() => { const element = document.querySelector(selector); if (element && element.offsetParent !== null) { clearInterval(interval); clearTimeout(timer); resolve(element); } }, 100); }); }

                async function checkForTurnstileAndReload() {
                    console.log('[Super Script] Verificando tipo de CAPTCHA...');
                    bypass_showStatus('Verificando tipo de CAPTCHA...');
                    try {
                        const form = await bypass_waitForElement('form', 10000);
                        const hasTurnstile = form.querySelector('.cf-turnstile');
                        const hasRecaptcha = form.querySelector('.g-recaptcha');

                        if (hasTurnstile) {
                            console.log('[Super Script] CAPTCHA Turnstile encontrado. Prosseguindo.');
                            bypass_showStatus('Turnstile detectado. Iniciando...');
                            return;
                        } else if (hasRecaptcha) {
                            console.log('[Super Script] reCAPTCHA encontrado. Recarregando a página...');
                            bypass_showStatus('reCAPTCHA detectado. Recarregando...');
                            await bypass_sleep(1500);
                            window.location.reload();
                        } else {
                            console.log('[Super Script] Formulário sem CAPTCHA conhecido. Prosseguindo.');
                            return; // Continua se o formulário não tiver nenhum captcha conhecido (pode ser só um timer)
                        }
                    } catch (error) {
                        console.error('[Super Script] Não foi possível encontrar um formulário para verificar o CAPTCHA. Recarregando por segurança.', error);
                        bypass_showStatus('Erro na verificação. Recarregando...');
                        await bypass_sleep(1500);
                        window.location.reload();
                    }
                }

                async function bypass_automationFlow() {
                    try {
                        if (hostname.includes('srtslug.biz')) {
                            bypass_showStatus('Passo 1: Clicando no botão inicial...');
                            await bypass_waitForElement('button[type="submit"]').then(el => el.click());
                            return;
                        }

                        bypass_showStatus('Analisando a página...');
                        // LÓGICA DO BOTÃO "START" - Executa primeiro
                        const startButton = await bypass_waitForElement('button:not([type="submit"])', 5000).catch(() => null);
                        if (startButton && /start|open|begin|iniciar|abrir/i.test(startButton.innerText)) {
                            bypass_showStatus('Detectado botão de início. Clicando...');
                            startButton.click();
                            await bypass_sleep(1000); // Espera a próxima página carregar
                        }

                        // VERIFICAÇÃO DO CAPTCHA - Agora executa DEPOIS do clique no "Start"
                        await checkForTurnstileAndReload();

                        // O resto do script continua como antes
                        const form = await bypass_waitForElement('form[action*="/api-endpoint/verify"]');
                        const hasCaptcha = form.querySelector('.cf-turnstile') !== null; // A lógica principal só se preocupa com o turnstile agora
                        const submitButton = form.querySelector('button[type="submit"]');

                        if (hasCaptcha) {
                            bypass_showStatus('Aguardando CAPTCHA automático...');
                            await new Promise((resolve) => {
                                const tokenPoller = setInterval(() => {
                                    const turnstileToken = form.querySelector('input[name="cf-turnstile-response"]')?.value;
                                    if (turnstileToken && turnstileToken.length > 50) {
                                        clearInterval(tokenPoller);
                                        resolve();
                                    }
                                }, 250);
                            });
                            bypass_showStatus('CAPTCHA resolvido! Prosseguindo...');
                            await bypass_sleep(500);

                        } else if (submitButton && submitButton.disabled) {
                            bypass_showStatus('Aguardando temporizador...');
                            await new Promise((resolve, reject) => {
                                const timeout = setTimeout(() => { observer.disconnect(); reject(new Error("Botão de submissão não ficou habilitado a tempo.")); }, 20000);
                                const observer = new MutationObserver(() => {
                                    if (!submitButton.disabled) { observer.disconnect(); clearTimeout(timeout); resolve(); }
                                });
                                observer.observe(submitButton, { attributes: true, attributeFilter: ['disabled'] });
                            });
                            bypass_showStatus('Temporizador finalizado! Prosseguindo...');
                        }

                        submitButton.click();

                        bypass_showStatus('Verificação feita. Aguardando o link final...');
                        await bypass_waitForElement('form:not([action*="/api-endpoint"])', 20000);
                        const nextButton = await bypass_waitForElement('form:not([action*="/api-endpoint"]) button[type="submit"]');
                        bypass_showStatus('Etapa final. Redirecionando...');
                        window.scrollTo(0, document.body.scrollHeight);
                        await bypass_sleep(500);
                        nextButton.click();

                    } catch (error) {
                        console.error('[Super Script] Erro na automação do bypasser:', error);
                        bypass_showStatus(`Erro: ${error.message}.`, true);
                    }
                }
                bypass_keepTabActive();
                bypass_automationFlow();
            });
        });
    }

    // =========================================================================
    // --- LÓGICA DO HOTCONTAINER (INALTERADA) ---
    // =========================================================================
    if (hostname.includes('hotcontainer.co')) {
        const isListPage = window.location.href.includes('/tufos') && !window.location.href.includes('/visualizar/');
        const isDownloadPage = window.location.href.includes('/tufos/quadrinho/visualizar/');

        if (isListPage) {
             window.addEventListener('load', () => {
                 const CONFIG = { linkInput: '#LinkAtracao', paginationLinks: '.lista-paginas .page-link', containerId: 'downloader-container', batchBtnId: 'batch-download-btn', stopBtnId: 'stop-download-btn', startNumInputId: 'start-num-input', statusId: 'downloader-status', extractBtnId: 'extract-titles-btn' };
                 let downloadQueue = [];
                 let activeTabs = new Map();
                 const MAX_CONCURRENT_TABS = 6;
                 let isProcessStopped = false;

                 function updateStatus(message) {
                     const statusDiv = document.getElementById(CONFIG.statusId);
                     if (statusDiv) statusDiv.textContent = message;
                 }

                 async function fetchAllHqItems(updateStatusCallback) {
                     updateStatusCallback('Iniciando coleta de HQs...');
                     const linkParam = document.querySelector(CONFIG.linkInput)?.value;
                     if (!linkParam) {
                         alert("Por favor, faça uma busca primeiro.");
                         return null;
                     }
                     const pageNumbers = Array.from(document.querySelectorAll(CONFIG.paginationLinks)).map(link => parseInt(link.textContent.trim(), 10)).filter(num => !isNaN(num));
                     const totalPages = Math.max(...pageNumbers, 1);
                     let allItems = [];
                     for (let page = 1; page <= totalPages; page++) {
                         if (isProcessStopped) throw new Error("Processo interrompido pelo usuário.");
                         updateStatusCallback(`Coletando da página ${page}/${totalPages}...`);
                         try {
                             const response = await axios.get(`/api/tufos/getconteudos?link=${linkParam}&pag=${page}`);
                             if (response.data?.resultSet) allItems.push(...response.data.resultSet);
                         } catch (error) {
                             console.error(`Erro ao buscar página ${page}:`, error);
                             await new Promise(r => setTimeout(r, 2000));
                         }
                     }
                     return allItems;
                 }

                 async function extractTitles() {
                     const btn = document.getElementById(CONFIG.extractBtnId);
                     const startBtn = document.getElementById(CONFIG.batchBtnId);
                     try {
                         btn.disabled = true;
                         startBtn.disabled = true;
                         const allItems = await fetchAllHqItems(updateStatus);

                         if (!allItems) {
                             updateStatus('Falha na coleta. Verifique a busca.');
                             return;
                         }
                         if (allItems.length === 0) {
                             alert("Nenhuma HQ encontrada.");
                             updateStatus('Nenhuma HQ encontrada para extrair.');
                             return;
                         }

                         updateStatus('Preparando lista de títulos...');
                         const titles = allItems.reverse()
                             .filter(item => item?.titulo)
                             .map((item, index) => `${String(index + 1).padStart(3, '0')} - ${item.titulo.replace(/[\\/*?:"<>|]/g, '').trim()}`);

                         const textContent = titles.join('\r\n');
                         const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });

                         const link = document.createElement('a');
                         link.href = URL.createObjectURL(blob);
                         link.download = 'titulos_hqs.txt';
                         document.body.appendChild(link);
                         link.click();
                         document.body.removeChild(link);
                         URL.revokeObjectURL(link.href);

                         updateStatus(`Lista com ${titles.length} títulos exportada!`);
                     } catch (error) {
                         console.error("Erro ao extrair títulos:", error);
                         updateStatus(`Erro: ${error.message}`);
                     } finally {
                         btn.disabled = false;
                         startBtn.disabled = false;
                     }
                 }

                 async function startSuperAutomation() {
                     try {
                         isProcessStopped = false;
                         document.getElementById(CONFIG.batchBtnId).style.display = 'none';
                         document.getElementById(CONFIG.extractBtnId).style.display = 'none';
                         document.getElementById(CONFIG.stopBtnId).style.display = 'block';
                         document.getElementById(CONFIG.startNumInputId).disabled = true;

                         const allItems = await fetchAllHqItems(updateStatus);

                         if (isProcessStopped) return;
                         if (!allItems || allItems.length === 0) {
                             alert("Nenhuma HQ encontrada.");
                             stopSuperAutomation();
                             return;
                         }
                         updateStatus('Fase 2: Preparando a fila de download...');
                         let preparedQueue = allItems.reverse()
                             .filter(item => item?.linkMineiroLoko && item.titulo)
                             .map((item, index) => ({ url: item.linkMineiroLoko, filename: `${String(index + 1).padStart(3, '0')} - ${item.titulo.replace(/[\\/*?:"<>|]/g, '').trim()}.cbz` }));

                         const startNum = parseInt(document.getElementById(CONFIG.startNumInputId).value, 10) || 1;
                         if (startNum > 1 && startNum <= preparedQueue.length) {
                             preparedQueue = preparedQueue.slice(startNum - 1);
                         }
                         downloadQueue = preparedQueue;
                         updateStatus(`Iniciando downloads... Total: ${downloadQueue.length}`);
                         for (let i = 0; i < MAX_CONCURRENT_TABS; i++) processNextInQueue();
                     } catch (error) {
                         console.error("Erro fatal na automação:", error);
                         updateStatus("Ocorreu um erro fatal. Verifique o console.");
                         stopSuperAutomation();
                     }
                 }

                 function stopSuperAutomation() {
                     isProcessStopped = true;
                     downloadQueue = [];
                     activeTabs.clear();
                     updateStatus('Automação parada.');
                     document.getElementById(CONFIG.batchBtnId).style.display = 'block';
                     document.getElementById(CONFIG.extractBtnId).style.display = 'block';
                     document.getElementById(CONFIG.stopBtnId).style.display = 'none';
                     document.getElementById(CONFIG.startNumInputId).disabled = false;
                 }

                 async function processNextInQueue() {
                     if (isProcessStopped || activeTabs.size >= MAX_CONCURRENT_TABS) return;
                     if (downloadQueue.length === 0) {
                         if (activeTabs.size === 0) {
                             updateStatus('Automação Concluída! ✅');
                             GM_notification({ title: 'Super Script', text: 'Todos os downloads foram concluídos.', timeout: 6000 });
                             stopSuperAutomation();
                         }
                         return;
                     }
                     const item = downloadQueue.shift();
                     updateStatus(`Baixando "${item.filename}"... Restam: ${downloadQueue.length}`);
                     const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                     await GM_setValue(jobId, { filename: item.filename });
                     const urlToOpen = `${item.url}?jobId=${jobId}`;
                     const tab = GM_openInTab(urlToOpen, { active: false, setParent: true });
                     activeTabs.set(tab, { filename: item.filename });
                     tab.onclose = () => {
                         if (activeTabs.has(tab)) {
                             activeTabs.delete(tab);
                         }
                         processNextInQueue();
                     };
                 }

                 GM_addStyle(`
                    #downloader-container { position: fixed; bottom: 20px; left: 20px; z-index: 9998; background-color: #1a1a1a; border: 1px solid #0d6efd; border-radius: 8px; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: Arial, sans-serif; color: white; width: 320px; display: flex; flex-direction: column; gap: 10px; }
                    #${CONFIG.batchBtnId}, #${CONFIG.stopBtnId}, #${CONFIG.extractBtnId} { border: none; padding: 12px; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; transition: background-color 0.2s; color: white; }
                    #${CONFIG.batchBtnId} { background-color: #0d6efd; }
                    #${CONFIG.extractBtnId} { background-color: #6c757d; }
                    #${CONFIG.batchBtnId}:disabled, #${CONFIG.extractBtnId}:disabled { background-color: #555; cursor: not-allowed; }
                    #${CONFIG.stopBtnId} { background-color: #dc3545; display: none; }
                    #downloader-status { text-align:center; font-size: 14px; color: #ccc; margin-top: 5px; min-height: 20px; }
                    #start-num-input { width: 100%; box-sizing: border-box; background-color: #333; color: white; border: 1px solid #555; padding: 8px; border-radius: 5px; text-align: center; }
                 `);
                 const container = document.createElement('div');
                 container.id = CONFIG.containerId;
                 container.innerHTML = `
                     <div style="display: flex; gap: 10px; align-items: center;">
                         <button id="${CONFIG.batchBtnId}" style="flex-grow: 1;">Iniciar Automação</button>
                         <button id="${CONFIG.extractBtnId}" style="flex-grow: 1;">Extrair Títulos (.txt)</button>
                     </div>
                     <input type="number" id="${CONFIG.startNumInputId}" placeholder="Iniciar download a partir do nº..." min="1" style="width: 100%;">
                     <button id="${CONFIG.stopBtnId}">Parar Automação</button>
                     <div id="${CONFIG.statusId}">Após a busca, clique para iniciar.</div>
                 `;
                 document.body.appendChild(container);
                 document.getElementById(CONFIG.batchBtnId).addEventListener('click', startSuperAutomation);
                 document.getElementById(CONFIG.extractBtnId).addEventListener('click', extractTitles);
                 document.getElementById(CONFIG.stopBtnId).addEventListener('click', () => {
                     alert("Parando automação...");
                     stopSuperAutomation();
                 });
             });
        }

        if (isDownloadPage) {
            const initPoller = setInterval(() => {
                const title = document.querySelector('h3.tituloPrincipal');
                const imageContainer = document.querySelector('#quadrinho-box .box-hq');
                if (title && imageContainer && imageContainer.querySelector('.img-part-quadrinho')) {
                    clearInterval(initPoller);
                    console.log("[Super Script] Elementos da HQ detectados. Iniciando script.");
                    initializeDownloadPage();
                }
            }, 500);
            setTimeout(() => { clearInterval(initPoller); }, 20000);

            async function initializeDownloadPage() {
                console.log("[Super Script] Página de visualização detectada. Iniciando download automático.");
                const urlParams = new URLSearchParams(window.location.search);
                const jobId = urlParams.get('jobId');
                let finalFilename = null;
                if (jobId) {
                    const jobData = await GM_getValue(jobId, null);
                    if (jobData && jobData.filename) {
                        finalFilename = jobData.filename;
                        await GM_deleteValue(jobId);
                        console.log(`[Super Script] Job ID encontrado. Usando nome de arquivo: ${finalFilename}`);
                    }
                }
                baseDownloadProcess(true, finalFilename);
            }

            const CONFIG_DOWNLOAD = { selectors: { hqTitle: 'h3.tituloPrincipal', imageTile: '.img-part-quadrinho', loadMoreButton: '.btn-warning.btn-lg' }, ui: { containerId: 'downloader-container', cbzButtonId: 'downloader-cbz-btn', statusId: 'downloader-status', progressBarId: 'downloader-progress' }, filenameRegex: /[\\/*?:"<>|]/g, pageIdRegex: /\/([a-f0-9]{32})\//, tileOrderRegex: /_(\d+)\.jpeg$/, };
            function hq_triggerDownload(blob, filename) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(link.href); }, 100); }
            function hq_createComicInfoXml(title, pageCount) { const escapeXml = (unsafe) => unsafe ? unsafe.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c])) : ''; const safeTitle = escapeXml(title); return `<?xml version="1.0" encoding="utf-8"?><ComicInfo><Title>${safeTitle}</Title><Series>${safeTitle}</Series><PageCount>${pageCount}</PageCount><Year>${new Date().getFullYear()}</Year><Notes>Criado com Super Script v7.1</Notes></ComicInfo>`; }
            async function hq_fetchAsBlob(url) { for (let attempt = 1; attempt <= 3; attempt++) { try { return await new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url, responseType: "blob", timeout: 20000, onload: (res) => res.status === 200 ? resolve(res.response) : reject(new Error(`Status ${res.status}`)), onerror: (err) => reject(new Error(`Erro de rede: ${err}`)), ontimeout: () => reject(new Error('Timeout')) }); }); } catch (error) { if (attempt === 3) throw error; await new Promise(r => setTimeout(r, 2000)); } } }
            const hq_workerCode = ` self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'); self.onmessage = (e) => { const { pages, hqTitle, comicInfoXml } = e.data; const zip = new self.JSZip(); pages.forEach(p => zip.file(p.filename, p.blob)); if (comicInfoXml) zip.file("ComicInfo.xml", comicInfoXml); zip.generateAsync({ type: "blob", compression: "STORE" }, (m) => self.postMessage({ type: "progress", percent: m.percent })) .then(b => self.postMessage({ type: "complete", blob: b, filename: hqTitle + ".cbz" })) .catch(e => self.postMessage({ type: "error", message: e.message })); };`;
            let hq_zipWorker = null;
            function hq_getZipWorker() { if (!hq_zipWorker) { hq_zipWorker = new Worker(URL.createObjectURL(new Blob([hq_workerCode], { type: 'application/javascript' }))); } return hq_zipWorker; }

            async function hq_loadAllImages(statusDiv) {
                while (true) {
                    const btn = document.querySelector(CONFIG_DOWNLOAD.selectors.loadMoreButton);
                    if (!btn || btn.offsetParent === null || btn.disabled) { break; }
                    const initialImageCount = document.querySelectorAll(CONFIG_DOWNLOAD.selectors.imageTile).length;
                    if (statusDiv) statusDiv.textContent = `Carregando mais imagens (${initialImageCount})...`;
                    btn.click();
                    try {
                        await new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => { clearInterval(poller); reject(new Error("Timeout: O clique no botão 'VER MAIS' não carregou novas imagens.")); }, 10000);
                            const poller = setInterval(() => {
                                const currentImageCount = document.querySelectorAll(CONFIG_DOWNLOAD.selectors.imageTile).length;
                                if (currentImageCount > initialImageCount) { clearInterval(poller); clearTimeout(timeout); resolve(); }
                            }, 250);
                        });
                    } catch (error) { console.error(error); break; }
                }
            }

            async function hq_processPage({ group, index }) { const canvas = document.createElement('canvas'); const gridWidth = 9, tileWidth = 100, tileHeight = 100; canvas.width = gridWidth * tileWidth; canvas.height = Math.ceil(group.length / gridWidth) * tileHeight; const ctx = canvas.getContext('2d'); await Promise.all(group.map(async (img, tileIndex) => { try { const bmp = await createImageBitmap(await hq_fetchAsBlob(img.src)); ctx.drawImage(bmp, (tileIndex % gridWidth) * tileWidth, Math.floor(tileIndex / gridWidth) * tileHeight, tileWidth, tileHeight); } catch (e) { console.error(`Falha no tile ${tileIndex} da pág ${index}:`, e); } })); return new Promise(resolve => canvas.toBlob(blob => resolve({ filename: `${String(index).padStart(3, '0')}.jpg`, blob }), 'image/jpeg', 0.95)); }
            async function hq_getAllProcessedPages(statusDiv) { const pagesMap = new Map(); document.querySelectorAll(CONFIG_DOWNLOAD.selectors.imageTile).forEach(img => { const pageId = (img.src.match(CONFIG_DOWNLOAD.pageIdRegex) || [])[1]; if (pageId) { if (!pagesMap.has(pageId)) pagesMap.set(pageId, []); pagesMap.get(pageId).push(img); } }); let imageGroups = Array.from(pagesMap.values()).filter(g => g.length >= 5); imageGroups.forEach(g => g.sort((a, b) => (parseInt((a.src.match(CONFIG_DOWNLOAD.tileOrderRegex) || [])[1]) || 0) - (parseInt((b.src.match(CONFIG_DOWNLOAD.tileOrderRegex) || [])[1]) || 0))); const results = []; for (let i = 0; i < imageGroups.length; i++) { if (statusDiv) statusDiv.textContent = `Processando página ${i + 1}/${imageGroups.length}...`; results.push(await hq_processPage({ group: imageGroups[i], index: i + 1 })); } return results; }

            async function baseDownloadProcess(isAuto, finalFilename) {
                const statusDiv = isAuto ? null : document.getElementById(CONFIG_DOWNLOAD.ui.statusId);
                const progressBar = isAuto ? null : document.getElementById(CONFIG_DOWNLOAD.ui.progressBarId);
                const cbzButton = isAuto ? null : document.getElementById(CONFIG_DOWNLOAD.ui.cbzButtonId);
                try {
                    if (cbzButton) cbzButton.disabled = true;
                    if(isAuto) {
                        let autoStatusDiv = document.createElement('div');
                        Object.assign(autoStatusDiv.style, { position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#198754', color: 'white', padding: '15px', borderRadius: '8px', zIndex: '10000', fontFamily: 'Arial, sans-serif', fontSize: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' });
                        autoStatusDiv.textContent = 'Download automático iniciado...';
                        document.body.appendChild(autoStatusDiv);
                    }

                    const hqTitle = document.querySelector(CONFIG_DOWNLOAD.selectors.hqTitle)?.textContent.trim().replace(CONFIG_DOWNLOAD.filenameRegex, '') || "Quadrinho";
                    await hq_loadAllImages(statusDiv);
                    if (statusDiv) statusDiv.textContent = 'Analisando páginas...';
                    const pagesForCbz = (await hq_getAllProcessedPages(statusDiv)).filter(p => p && p.blob);
                    if (pagesForCbz.length > 0) {
                        if (statusDiv) { statusDiv.textContent = 'Compactando .cbz...'; progressBar.style.display = 'block'; progressBar.value = 0; }
                        const worker = hq_getZipWorker();
                        worker.onmessage = ({ data }) => {
                            if (data.type === 'progress' && progressBar) progressBar.value = data.percent;
                            else if (data.type === 'complete') {
                                hq_triggerDownload(data.blob, finalFilename || `${hqTitle}.cbz`);
                                if (statusDiv) statusDiv.textContent = 'Download Concluído! ✅';
                                if (isAuto) setTimeout(() => window.close(), 4000);
                                else if (cbzButton) cbzButton.disabled = false;
                            } else if (data.type === 'error') { throw new Error(data.message); }
                        };
                        worker.postMessage({ pages: pagesForCbz, hqTitle: hqTitle, comicInfoXml: hq_createComicInfoXml(hqTitle, pagesForCbz.length) });
                    } else { throw new Error("Nenhuma página válida foi processada."); }
                } catch (error) {
                    console.error("[Super Script] Erro no download:", error);
                    if (statusDiv) statusDiv.textContent = 'Erro fatal no processo!';
                    if (isAuto) setTimeout(() => window.close(), 1000);
                    else if (cbzButton) cbzButton.disabled = false;
                }
            }
        }
    }
})();