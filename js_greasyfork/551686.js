// ==UserScript==
// @name         [Popmundo] Detector de Doentes v3.16.1
// @namespace    http://tampermonkey.net/
// @version      3.16.1
// @description  Varre TODAS as zonas da cidade.
// @author       Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/City/CityZones/*
// @match        *://popmundo.com/World/Popmundo.aspx/City/CityZones/*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale/CharactersPresent*
// @match        *://popmundo.com/World/Popmundo.aspx/Locale/CharactersPresent*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Diary/*
// @match        *://popmundo.com/World/Popmundo.aspx/Character/Diary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popmundo.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      self
// @connect      *.popmundo.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551686/%5BPopmundo%5D%20Detector%20de%20Doentes%20v3161.user.js
// @updateURL https://update.greasyfork.org/scripts/551686/%5BPopmundo%5D%20Detector%20de%20Doentes%20v3161.meta.js
// ==/UserScript==

/* global GM_xmlhttpRequest, GM_addStyle, GM_setValue, GM_getValue, $ */

(function() {
    'use strict';

    if (typeof $ === 'undefined') {
        console.error("jQuery não está carregado. O script não pode continuar.");
        return;
    }

    console.log("Detector de Doentes v3.16.1 (Interface Limpa) - Ativado");

    // --- Configurações Fixas ---
    const SCRIPT_ID_PREFIX = 'pm-sick-detector-v3-16-1';
    const PANEL_POSITION_KEY = `${SCRIPT_ID_PREFIX}-panel-position`;
    const THEME_KEY = `${SCRIPT_ID_PREFIX}-theme`;
    const MINIMIZED_KEY = `${SCRIPT_ID_PREFIX}-minimized`;

    // Configurações de velocidade otimizadas e fixas
    const CONCURRENCY = 2; // Requisições simultâneas
    const DELAY_MS = 500;  // Delay em milissegundos
    const LOCALE_DELAY_MS = 200; // Delay fixo entre a varredura de locais

    // --- Mensagens Chave ---
    const realIllnessMessages = ['zumbi me mordeu', 'não estou me sentindo bem', 'clamídia está acabando comigo'];
    const resolvingMessages = ['curou minha indisposição', 'sobrecarga sináptica está acabando comigo', 'finalmente foi embora', 'cheira a salvação', 'remédio para mordida de zumbi', 'minutos para fazer efeito', 'túnel do carpo está acabando comigo'];
    const benignConditions = ['puberdade'];

    // --- Variáveis Globais ---
    let scanInProgress = false;
    let myCharacterID = null;
    let currentTheme = GM_getValue(THEME_KEY, 'light');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);
    let currentStatus = "Pronto para iniciar varredura completa da cidade.";
    let persistedSickCharacters = new Map();

    // --- Funções Auxiliares de UI/Log ---
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function updateLog(message, isError = false) {
        const logContainer = $(`#${SCRIPT_ID_PREFIX}-log`);
        if (logContainer.length) {
            logContainer.find('.pm-log-empty').remove();
            const p = $(`<div class="pm-log-entry">${message}</div>`);
            if (isError) p.addClass('log-error');
            logContainer.append(p);
            logContainer.scrollTop(logContainer[0].scrollHeight);
        }
    }

    function updateStatus(msg, type = 'info') {
        currentStatus = msg;
        const statusEl = $(`#${SCRIPT_ID_PREFIX}-status`);
        if (!statusEl.length) return;
        let iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> ';
        if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> ';
        else if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check fa-fw"></i> ';
        else if (scanInProgress) iconHtml = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> ';
        statusEl.removeClass('pm-status-error pm-status-success pm-status-accent pm-status-normal');
        if (type === 'error') statusEl.addClass('pm-status-error');
        else if (type === 'success') statusEl.addClass('pm-status-success');
        else if (scanInProgress) statusEl.addClass('pm-status-accent');
        else statusEl.addClass('pm-status-normal');
        statusEl.html(iconHtml + msg);
    }

    function refreshSickCount(count) {
        $(`#${SCRIPT_ID_PREFIX}-sick-count`).text(count);
        $(`#${SCRIPT_ID_PREFIX}-RefreshList`).toggle(count > 0);
    }

    function refreshRealtimeDisplay() {
        const listContainer = $(`#${SCRIPT_ID_PREFIX}-realtime-list`);
        if (!listContainer.length) return;
        listContainer.empty();
        if (persistedSickCharacters.size === 0) {
            listContainer.html('<p class="pm-text-info">A lista aparecerá aqui...</p>');
        } else {
            persistedSickCharacters.forEach(character => {
                // *** ALTERAÇÃO AQUI: Removido o link do diário ***
                const charHtml = `
                    <p id="${SCRIPT_ID_PREFIX}-char-${character.id}">
                        <a href="${window.location.origin + character.profileUrl}" target="_blank">${character.name}</a>
                        <span class="pm-copy-name" title="Copiar nome" data-name="${character.name}"><i class="fa-solid fa-copy"></i></span>
                    </p>`;
                listContainer.append($(charHtml));
            });
        }
        refreshSickCount(persistedSickCharacters.size);
    }

    function addSickCharacter(character) {
        if (!persistedSickCharacters.has(character.id)) {
            persistedSickCharacters.set(character.id, character);
            refreshRealtimeDisplay();
        }
    }

    function resetRealtimeList() {
        const realtimeDetails = $(`#${SCRIPT_ID_PREFIX}-realtime-details`);
        if (realtimeDetails.length) {
            realtimeDetails.prop('open', true);
            persistedSickCharacters.clear();
            refreshRealtimeDisplay();
        }
    }

    // --- Lógica de Varredura e Detecção ---
    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url, timeout: 20000,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        resolve(parser.parseFromString(response.responseText, "text/html"));
                    } else { reject(`Falha ao buscar ${url} (Status: ${response.status})`); }
                },
                onerror: () => reject(`Erro de rede ao buscar ${url}`),
                ontimeout: () => reject(`Timeout ao buscar ${url}`)
            });
        });
    }

    function fetchAndCheckDiary(character) {
        return new Promise((resolve) => {
            const fullDiaryUrl = new URL(character.diaryUrl, window.location.origin).href;
            GM_xmlhttpRequest({
                method: "GET", url: fullDiaryUrl, timeout: 15000,
                onload: function(response) {
                    let isCurrentlySick = false;
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        const diaryDoc = parser.parseFromString(response.responseText, "text/html");
                        const diaryContainer = diaryDoc.querySelector('ul.diaryExtraspace');
                        if (diaryContainer) {
                            const events = [];
                            diaryContainer.querySelectorAll(':scope > li').forEach(dayLi => {
                                const dateTextNode = Array.from(dayLi.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
                                if (!dateTextNode) return;
                                const dateMatch = dateTextNode.textContent.trim().match(/(\d{2})\/(\d{2})\/(\d{4})/);
                                if (dateMatch) {
                                    const currentDateString = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
                                    const eventsUl = dayLi.querySelector('ul');
                                    if (eventsUl) {
                                        eventsUl.querySelectorAll('li').forEach(eventLi => {
                                            const fullText = eventLi.textContent.trim();
                                            const timeMatch = fullText.match(/^(\d{2}:\d{2})/);
                                            if (timeMatch) {
                                                const timestamp = new Date(`${currentDateString}T${timeMatch[1]}:00`);
                                                events.push({ timestamp, text: fullText.toLowerCase() });
                                            }
                                        });
                                    }
                                }
                            });
                            events.sort((a, b) => a.timestamp - b.timestamp);
                            let lastRelevantState = 'ok';
                            events.forEach(event => {
                                const isPotentialSickness = realIllnessMessages.some(m => event.text.includes(m));
                                const isBenign = benignConditions.some(b => event.text.includes(b));
                                if (isPotentialSickness && !isBenign) { lastRelevantState = 'sick'; }
                                if (resolvingMessages.some(m => event.text.includes(m))) { lastRelevantState = 'ok'; }
                            });
                            isCurrentlySick = (lastRelevantState === 'sick');
                        }
                    }
                    resolve({ character, isCurrentlySick });
                },
                onerror: () => {
                    updateLog(`Falha ao buscar diário de ${character.name}.`, true);
                    resolve({ character, isCurrentlySick: true });
                },
                ontimeout: () => {
                    updateLog(`Timeout ao buscar diário de ${character.name}.`, true);
                    resolve({ character, isCurrentlySick: true });
                }
            });
        });
    }

    async function processCharactersInBatches(charLinks, onResult) {
        const validCharacters = charLinks.map(link => {
            const charIdMatch = link.href.match(/Character\/(\d+)/);
            if (charIdMatch && charIdMatch[1] !== myCharacterID) {
                return { id: charIdMatch[1], name: link.textContent.trim(), profileUrl: link.getAttribute('href'), diaryUrl: `/World/Popmundo.aspx/Character/Diary/${charIdMatch[1]}` };
            }
            return null;
        }).filter(Boolean);

        if (validCharacters.length === 0) return;

        for (let i = 0; i < validCharacters.length; i += CONCURRENCY) {
            const batch = validCharacters.slice(i, i + CONCURRENCY);
            const promises = batch.map(character => fetchAndCheckDiary(character));
            const results = await Promise.all(promises);
            results.forEach(result => {
                if (!result) return;
                if (result.isCurrentlySick) {
                    updateLog(`<span class="log-sick">DOENTE</span>: <a href="${window.location.origin + result.character.profileUrl}" target="_blank">${result.character.name}</a>`);
                    onResult(result.character);
                    addSickCharacter(result.character);
                } else {
                    updateLog(`<span class="log-ok">SAUDÁVEL</span>: <a href="${window.location.origin + result.character.profileUrl}" target="_blank">${result.character.name}</a>`);
                }
            });
            if (i + CONCURRENCY < validCharacters.length) {
                await sleep(DELAY_MS);
            }
        }
    }

    async function recheckSickCharacters() {
        if (scanInProgress) return;
        scanInProgress = true;
        const refreshButton = $(`#${SCRIPT_ID_PREFIX}-RefreshList`);
        const scanButton = $(`#${SCRIPT_ID_PREFIX}-scan-button`);
        const originalScanButtonHtml = scanButton.html();
        const originalRefreshButtonHtml = refreshButton.html();
        scanButton.prop('disabled', true);
        refreshButton.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i>');
        const charactersToRecheck = Array.from(persistedSickCharacters.values());
        if (charactersToRecheck.length === 0) {
            updateStatus("Nenhum doente para re-verificar.", 'info');
            scanInProgress = false;
            scanButton.prop('disabled', false).html(originalScanButtonHtml);
            refreshButton.prop('disabled', false).html(originalRefreshButtonHtml);
            return;
        }
        updateStatus(`Iniciando re-verificação de ${charactersToRecheck.length} diários...`, 'accent');
        updateLog(`<strong>--- INICIANDO RE-VERIFICAÇÃO (${charactersToRecheck.length} chars) ---</strong>`);
        try {
            for (let i = 0; i < charactersToRecheck.length; i += CONCURRENCY) {
                const batch = charactersToRecheck.slice(i, i + CONCURRENCY);
                const promises = batch.map(async (char) => {
                    updateLog(`[${i + 1}/${charactersToRecheck.length}] Verificando diário de ${char.name}...`);
                    const result = await fetchAndCheckDiary(char);
                    if (!result.isCurrentlySick) {
                        persistedSickCharacters.delete(char.id);
                        updateLog(`<span class="log-ok">CURADO</span>: ${char.name}`);
                    } else {
                        updateLog(`<span class="log-sick">AINDA DOENTE</span>: ${char.name}`);
                    }
                });
                await Promise.all(promises);
                if (i + CONCURRENCY < charactersToRecheck.length) {
                    await sleep(DELAY_MS);
                }
            }
            refreshRealtimeDisplay();
            updateLog(`<strong>--- RE-VERIFICAÇÃO CONCLUÍDA ---</strong>`);
            updateStatus(`Re-verificação concluída. Restam: ${persistedSickCharacters.size}.`, 'success');
        } catch (error) {
            updateLog(`ERRO durante re-verificação: ${error.message || error}`, true);
            updateStatus("Re-verificação interrompida por erro.", 'error');
        } finally {
            scanInProgress = false;
            scanButton.prop('disabled', false).html(originalScanButtonHtml);
            refreshButton.prop('disabled', false).html(originalRefreshButtonHtml);
        }
    }

    async function startScan(scanFunction) {
        if (scanInProgress) return;
        $(`#${SCRIPT_ID_PREFIX}-log-details`).prop('open', true);
        resetRealtimeList();
        await scanFunction();
    }

    async function scanCityByZones() {
        if (scanInProgress) return;
        scanInProgress = true;
        let allSickCharacters = {};
        const scanButton = $(`#${SCRIPT_ID_PREFIX}-scan-button`);
        const originalButtonHtml = scanButton.html();
        scanButton.prop('disabled', true).html(`<i class="fa-solid fa-spinner fa-spin"></i> Mapeando...`);
        $(`#${SCRIPT_ID_PREFIX}-log`).empty();
        $(`#${SCRIPT_ID_PREFIX}-RefreshList`).prop('disabled', true);
        try {
            const zoneTable = $('#tablezones');
            if (!zoneTable.length) throw new Error("Tabela de zonas não encontrada.");
            const allZoneLinks = Array.from(zoneTable.find('a[href*="/City/CityZoneDetails/"]')).map(link => ({ href: link.getAttribute('href'), name: $(link).text().trim() }));
            if (allZoneLinks.length === 0) throw new Error("Nenhuma zona encontrada.");
            updateStatus(`Varredura em ${allZoneLinks.length} zonas. (Delay: ${DELAY_MS}ms)`, 'accent');
            updateLog(`<strong>Iniciando varredura de ${allZoneLinks.length} zonas.</strong>`);
            let allLocaleTypeLinks = new Map();
            for (const zoneLink of allZoneLinks) {
                updateLog(`- Mapeando zona: <strong>${zoneLink.name}</strong>`);
                scanButton.html(`<i class="fa-solid fa-spinner fa-spin"></i> Zona: ${zoneLink.name}`);
                const zonePage = await fetchPage(new URL(zoneLink.href, window.location.origin).href);
                $(zonePage).find('#tabletypes a[href*="/City/Locales/"]').each((i, link) => {
                    if (!allLocaleTypeLinks.has(link.href)) allLocaleTypeLinks.set(link.href, { href: link.href, name: $(link).text().trim() });
                });
                await sleep(100);
            }
            const uniqueLocaleTypeLinks = Array.from(allLocaleTypeLinks.values());
            let allLocales = new Map();
            scanButton.html(`<i class="fa-solid fa-spinner fa-spin"></i> Listando Locais...`);
            for (const typeLink of uniqueLocaleTypeLinks) {
                const localesPage = await fetchPage(typeLink.href);
                $(localesPage).find('#tablelocales a[id*="_lnkLocale"]').each((i, link) => {
                    if (!allLocales.has(link.href)) allLocales.set(link.href, { href: link.href, name: $(link).text().trim() });
                });
                await sleep(100);
            }
            const uniqueLocales = Array.from(allLocales.values());
            updateLog(`- <strong>${uniqueLocales.length} locais identificados. Varrendo...</strong>`);
            for (let i = 0; i < uniqueLocales.length; i++) {
                const locale = uniqueLocales[i];
                if (!locale.name) continue;
                scanButton.html(`<i class="fa-solid fa-spinner fa-spin"></i> ${i + 1}/${uniqueLocales.length}`);
                updateStatus(`Verificando ${i + 1}/${uniqueLocales.length}: ${locale.name}`);
                updateLog(`--- <strong>[${i + 1}/${uniqueLocales.length}] ${locale.name}</strong> ---`);
                const localePage = await fetchPage(new URL(locale.href, window.location.origin).href);
                const charactersPresentLink = $(localePage).find('a[href*="/Locale/CharactersPresent/"]').get(0);
                if (!charactersPresentLink) {
                    updateLog(`  <span class="log-ok" style="opacity:0.7">Vazio.</span>`);
                } else {
                    const charactersPage = await fetchPage(charactersPresentLink.href);
                    const charLinks = Array.from($(charactersPage).find('#tablechars a[href*="/Character/"]'));
                    if (charLinks.length > 0) {
                        updateLog(`  - Verificando ${charLinks.length} pessoas...`);
                        await processCharactersInBatches(charLinks, (sickCharacter) => {
                            if (!allSickCharacters[locale.name]) allSickCharacters[locale.name] = [];
                            allSickCharacters[locale.name].push(sickCharacter);
                        });
                    } else {
                        updateLog(`  <span class="log-ok" style="opacity:0.7">Ninguém.</span>`);
                    }
                }
                if (i < uniqueLocales.length - 1) await sleep(LOCALE_DELAY_MS);
            }
            displayFinalResults();
        } catch (error) {
            updateLog(`ERRO CRÍTICO: ${error.message || error}`, true); console.error(error);
            updateStatus("Varredura interrompida por erro.", 'error');
        } finally {
            scanInProgress = false;
            scanButton.prop('disabled', false).html(originalButtonHtml);
            refreshSickCount(persistedSickCharacters.size);
            currentStatus = "Varredura finalizada ou pronta.";
        }
    }

    async function scanCurrentLocale() {
        if (scanInProgress) return;
        scanInProgress = true;
        let sickCharacters = [];
        resetRealtimeList();
        const scanButton = $(`#${SCRIPT_ID_PREFIX}-scan-button`);
        const originalButtonHtml = scanButton.html();
        scanButton.prop('disabled', true).html(`<i class="fa-solid fa-spinner fa-spin"></i> Verificando...`);
        $(`#${SCRIPT_ID_PREFIX}-log`).empty();
        $(`#${SCRIPT_ID_PREFIX}-RefreshList`).prop('disabled', true);
        try {
            updateStatus(`Varrendo local atual...`, 'accent');
            updateLog("<strong>Iniciando varredura do local atual...</strong>");
            const charLinks = Array.from($('#tablechars a[href*="/Character/"]'));
            if (charLinks.length === 0) {
                updateLog("<span class='log-ok'>Local vazio.</span>");
                updateStatus("Local vazio.", 'success');
                return;
            }
            updateLog(`- Verificando ${charLinks.length} pessoas...`);
            await processCharactersInBatches(charLinks, (sickCharacter) => sickCharacters.push(sickCharacter));
            displayLocaleResults(sickCharacters);
        } catch (error) {
            updateLog(`ERRO: ${error}`, true); console.error(error);
            updateStatus("Erro na varredura local.", 'error');
        } finally {
            scanInProgress = false;
            scanButton.prop('disabled', false).html(originalButtonHtml);
            refreshSickCount(persistedSickCharacters.size);
        }
    }

    function displayFinalResults() {
        let html = `<h3>Relatório da Cidade</h3>`;
        if (persistedSickCharacters.size > 0) {
            html += `<p class="log-sick" style="width:auto;"><strong>${persistedSickCharacters.size} doentes encontrados na cidade.</strong></p>`;
            html += '<p>Lista completa na seção "Doentes Encontrados" acima.</p>';
            updateStatus(`Concluído! ${persistedSickCharacters.size} doentes encontrados.`, 'success');
        } else {
            html += `<p class="log-ok" style="width:auto;"><strong>Cidade limpa! Nenhum doente encontrado.</strong></p>`;
            updateStatus("Concluído. Cidade limpa.", 'success');
        }
        updateLog(html);
        if (persistedSickCharacters.size > 0) $(`#${SCRIPT_ID_PREFIX}-log-details`).prop('open', true);
    }

    function displayLocaleResults(sickCharacters) {
        let html = `<h3>Resultado Local</h3>`;
        if (sickCharacters.length > 0) {
            html += `<p class="log-sick" style="width:auto;"><strong>${sickCharacters.length} doentes encontrados aqui:</strong></p><ul>`;
            sickCharacters.forEach(char => {
                // *** ALTERAÇÃO AQUI: Removido o link do diário ***
                html += `<li><a href="${window.location.origin + char.profileUrl}" target="_blank">${char.name}</a><span class="pm-copy-name" title="Copiar nome" data-name="${char.name}"><i class="fa-solid fa-copy"></i></span></li>`;
            });
            html += `</ul>`;
            updateStatus(`Concluído! ${sickCharacters.length} doentes no local.`, 'success');
            $(`#${SCRIPT_ID_PREFIX}-log-details`).prop('open', true);
        } else {
            html += `<p class="log-ok" style="width:auto;"><strong>Local limpo. Nenhum doente.</strong></p>`;
            updateStatus("Concluído. Local limpo.", 'success');
        }
        updateLog(html);
    }

    function createControlPanel(title, buttonHtml, scanFunction, isCityMode) {
        const panelID = `${SCRIPT_ID_PREFIX}-panel`;
        if ($(`#${panelID}`).length) return;
        if (isCityMode) currentStatus = "Pronto para varrer TODAS as zonas.";
        else currentStatus = "Pronto para varrer este local.";
        const panelHTML = `
            <div id="${panelID}" class="${currentTheme} ${isMinimized ? 'minimized' : ''}">
                <div class="pm-panel-header">
                    <h4><i class="fa-solid fa-biohazard"></i> ${title} <span>v3.16.1</span></h4>
                    <div class="pm-header-controls">
                        <button id="${SCRIPT_ID_PREFIX}-ThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                        <button id="${SCRIPT_ID_PREFIX}-MinimizeToggle" title="${isMinimized ? 'Maximizar' : 'Minimizar'}"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button>
                    </div>
                </div>
                <div class="pm-tab-content-wrapper">
                    <div id="${SCRIPT_ID_PREFIX}-status" class="pm-status-box pm-status-normal">${currentStatus}</div>
                    <div class="pm-controls">
                        <button type="button" id="${SCRIPT_ID_PREFIX}-scan-button" class="pm-action-button">${buttonHtml}</button>
                    </div>
                    <details id="${SCRIPT_ID_PREFIX}-realtime-details" open>
                        <summary><i class="fa-solid fa-user-doctor"></i> Doentes Encontrados (<span id="${SCRIPT_ID_PREFIX}-sick-count">0</span>)<button id="${SCRIPT_ID_PREFIX}-RefreshList" title="Re-verificar Doentes Atuais" class="pm-refresh-button" style="display:none;"><i class="fa-solid fa-rotate-right"></i></button></summary>
                        <div id="${SCRIPT_ID_PREFIX}-realtime-list" class="realtime-list-container"><p class="pm-text-info">A lista aparecerá aqui...</p></div>
                    </details>
                    <details id="${SCRIPT_ID_PREFIX}-log-details">
                        <summary><i class="fa-solid fa-scroll"></i> Log de Progresso</summary>
                        <div id="${SCRIPT_ID_PREFIX}-log" class="log-container"><div class="pm-log-empty">Aguardando início...</div></div>
                    </details>
                </div>
            </div>`;
        $('body').append(panelHTML);
        setupPanelInteractions(panelID, scanFunction);
    }

    function setupPanelInteractions(panelID, scanFunction) {
        const panelElement = $(`#${panelID}`);
        const savedPosition = GM_getValue(PANEL_POSITION_KEY, null);
        if (savedPosition && savedPosition.top && savedPosition.left) {
            panelElement.css({ top: savedPosition.top, left: savedPosition.left, right: 'auto', bottom: 'auto' });
        } else {
            panelElement.css({ top: '50px', right: '20px', left: 'auto', bottom: 'auto' });
        }
        panelElement.fadeIn(400);

        const toggleMinimize = (minimized, save = true) => {
            const toggleButton = $(`#${SCRIPT_ID_PREFIX}-MinimizeToggle`);
            if (minimized) {
                panelElement.addClass('minimized');
                toggleButton.find('i').removeClass('fa-window-minimize').addClass('fa-window-maximize');
                toggleButton.attr('title', 'Maximizar');
            } else {
                panelElement.removeClass('minimized');
                toggleButton.find('i').removeClass('fa-window-maximize').addClass('fa-window-minimize');
                toggleButton.attr('title', 'Minimizar');
            }
            if (save) GM_setValue(MINIMIZED_KEY, minimized);
        };
        toggleMinimize(isMinimized, false);

        $(`#${SCRIPT_ID_PREFIX}-ThemeToggle`).on('click', function() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            panelElement.removeClass('light dark').addClass(currentTheme);
            $(this).find('i').removeClass('fa-moon fa-sun').addClass(currentTheme === 'dark' ? 'fa-sun' : 'fa-moon');
            GM_setValue(THEME_KEY, currentTheme);
        });
        $(`#${SCRIPT_ID_PREFIX}-MinimizeToggle`).on('click', () => { isMinimized = !isMinimized; toggleMinimize(isMinimized, true); });
        $(`#${SCRIPT_ID_PREFIX}-scan-button`).on("click", () => startScan(scanFunction));
        $(`#${SCRIPT_ID_PREFIX}-RefreshList`).on("click", (e) => { e.preventDefault(); e.stopPropagation(); recheckSickCharacters(); });

        const handle = panelElement.find('.pm-panel-header');
        handle.on('mousedown', function(e) {
            if ($(e.target).closest('button, input').length > 0) return;
            panelElement.addClass('pm-dragging');
            const offset = panelElement.offset();
            const dragOffset = { x: e.pageX - offset.left, y: e.pageY - offset.top };
            const moveHandler = function(e) {
                panelElement.css({ top: (e.pageY - dragOffset.y) + 'px', left: (e.pageX - dragOffset.x) + 'px' });
            };
            const upHandler = function() {
                $(document).off('mousemove', moveHandler).off('mouseup', upHandler);
                panelElement.removeClass('pm-dragging');
                GM_setValue(PANEL_POSITION_KEY, { top: panelElement.css('top'), left: panelElement.css('left') });
            };
            $(document).on('mousemove', moveHandler).on('mouseup', upHandler);
        });
    }

    // --- Estilos CSS ---
    GM_addStyle(`
        /* Imports e Variáveis */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        :root { --pm-font-family: 'Roboto', sans-serif; --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-accent-color: #007bff; --pm-sick-color: #d63031; --pm-log-ok-color: #00b894; }
        #${SCRIPT_ID_PREFIX}-panel.light { --pm-bg: #ffffff; --pm-text: #333; --pm-border: #ddd; --pm-subtle: #f8f9fa; --pm-details-bg: #fff; --pm-shadow: rgba(0,0,0,0.1); }
        #${SCRIPT_ID_PREFIX}-panel.dark { --pm-bg: #2d2d2d; --pm-text: #eee; --pm-border: #444; --pm-subtle: #3a3a3a; --pm-details-bg: #252525; --pm-shadow: rgba(0,0,0,0.5); }
        /* Estrutura Principal */
        #${SCRIPT_ID_PREFIX}-panel { position: fixed; width: 320px; background: var(--pm-bg); color: var(--pm-text); border: 1px solid var(--pm-border); border-radius: 6px; box-shadow: 0 5px 15px var(--pm-shadow); font-family: var(--pm-font-family); font-size: 12px; z-index: 99999; display: none; }
        .pm-panel-header { padding: 8px 12px; background: var(--pm-subtle); border-bottom: 1px solid var(--pm-border); display: flex; justify-content: space-between; align-items: center; cursor: move; }
        #${SCRIPT_ID_PREFIX}-panel.pm-dragging { user-select: none; }
        .pm-panel-header h4 { margin: 0; font-size: 14px; font-weight: 700; display: flex; align-items: center; }
        .pm-panel-header h4 i { color: var(--pm-sick-color); margin-right: 6px; }
        .pm-panel-header h4 span { font-size: 10px; opacity: 0.7; margin-left: 5px; font-weight: 400; }
        .pm-header-controls { display: flex; gap: 4px; }
        .pm-header-controls button { background: transparent; border: none; color: var(--pm-text); opacity: 0.6; cursor: pointer; padding: 2px 4px; }
        .pm-header-controls button:hover { opacity: 1; color: var(--pm-accent-color); }
        #${SCRIPT_ID_PREFIX}-panel.minimized .pm-tab-content-wrapper { display: none; }
        #${SCRIPT_ID_PREFIX}-panel.minimized { width: auto; }
        .pm-tab-content-wrapper { padding: 12px; }
        /* Controles (Botão, Status) */
        .pm-controls { text-align: center; margin-bottom: 12px; }
        .pm-action-button { width: 100%; padding: 10px 8px; margin-top: 5px; background: #ffffff; color: var(--pm-text); border: 1px solid #cccccc; border-radius: 6px; font-weight: 700; cursor: pointer; transition: background 0.2s, border-color 0.2s; font-size: 14px; }
        #${SCRIPT_ID_PREFIX}-panel.dark .pm-action-button { background: var(--pm-subtle); color: var(--pm-text); border-color: var(--pm-border); }
        .pm-action-button:hover:not(:disabled) { background: #f0f0f0; border-color: #aaaaaa; }
        #${SCRIPT_ID_PREFIX}-panel.dark .pm-action-button:hover:not(:disabled) { filter: brightness(1.2); }
        .pm-action-button i { margin-right: 8px; color: var(--pm-accent-color); }
        .pm-action-button:disabled { background: var(--pm-subtle); color: #888; cursor: not-allowed; border-color: var(--pm-border); }
        .pm-action-button:disabled i { color: #888; }
        .pm-status-box { padding: 8px; margin-bottom: 12px; background: var(--pm-subtle); border-radius: 4px; text-align: center; font-size: 11px; border-left: 3px solid var(--pm-border); }
        .pm-status-success { border-left-color: var(--pm-success-color); } .pm-status-error { border-left-color: var(--pm-error-color); color: var(--pm-error-color); } .pm-status-accent { border-left-color: var(--pm-accent-color); }
        /* Seções Details/Summary */
        #${SCRIPT_ID_PREFIX}-panel details { margin-top: 8px; border: 1px solid var(--pm-border); border-radius: 4px; }
        #${SCRIPT_ID_PREFIX}-panel summary { padding: 6px 10px; background: var(--pm-subtle); cursor: pointer; font-weight: 600; user-select: none; display: flex; align-items: center; font-size: 11px; position: relative; }
        #${SCRIPT_ID_PREFIX}-panel summary i { margin-right: 6px; opacity: 0.8; width: 14px; text-align: center; }
        .pm-refresh-button { background: transparent; border: none; color: var(--pm-accent-color); position: absolute; right: 10px; top: 50%; transform: translateY(-50%); padding: 4px; line-height: 1; cursor: pointer; opacity: 0.8; }
        .pm-refresh-button:hover:not(:disabled) { opacity: 1; } .pm-refresh-button:disabled { cursor: not-allowed; opacity: 0.4; }
        /* Listas e Logs */
        .realtime-list-container, .log-container { padding: 8px 10px; max-height: 180px; overflow-y: auto; background: var(--pm-details-bg); border-top: 1px solid var(--pm-border); font-size: 11px; }
        .realtime-list-container p, .pm-log-entry li { margin: 3px 0; }
        .realtime-list-container a, .pm-log-entry a { color: var(--pm-text); text-decoration: none; font-weight: 500;}
        .realtime-list-container a:hover, .pm-log-entry a:hover { color: var(--pm-accent-color); text-decoration: underline; }
        .pm-copy-name { cursor: pointer; opacity: 0.5; margin-left: 5px; display: inline-block; transition: opacity 0.2s, color 0.2s; }
        .pm-copy-name:hover { opacity: 1; color: var(--pm-accent-color); }
        .pm-copy-name .fa-check { color: var(--pm-success-color); }
        .log-container { font-family: monospace; font-size: 10px; line-height: 1.4; }
        .pm-log-entry { margin-bottom: 2px; word-break: break-word; } .pm-log-entry ul { list-style: none; padding-left: 10px; }
        .pm-log-empty { text-align: center; opacity: 0.5; padding: 10px; font-style: italic; }
        .log-error { color: var(--pm-error-color); font-weight: bold; } .log-sick { color: var(--pm-sick-color); font-weight: bold; display: inline-block; width: 55px; } .log-ok { color: var(--pm-log-ok-color); font-weight: bold; display: inline-block; width: 65px; }
        .realtime-list-container::-webkit-scrollbar, .log-container::-webkit-scrollbar { width: 6px; }
        .realtime-list-container::-webkit-scrollbar-track, .log-container::-webkit-scrollbar-track { background: transparent; }
        .realtime-list-container::-webkit-scrollbar-thumb, .log-container::-webkit-scrollbar-thumb { background: var(--pm-border); border-radius: 3px; }
    `);

    // --- Execução ---
    (function main() {
        const charOption = $('select#ctl00_ctl09_ucCharacterBar_ddlCurrentCharacter > option[selected="selected"]');
        if (charOption.length) myCharacterID = charOption.val();
        else { const linkSelf = $('a[href*="/Character/PopmundoDetails/"]'); if(linkSelf.length) { const match = linkSelf.attr('href').match(/Character\/(\d+)/); if(match) myCharacterID = match[1]; } }
        const waitForElement = (selector, callback) => { const interval = setInterval(() => { if ($(selector).length) { clearInterval(interval); callback(); } }, 200); };
        if (window.location.pathname.includes("/City/CityZones/")) waitForElement("#tablezones", () => createControlPanel("Detector (Cidade)", '<i class="fa-solid fa-earth-americas"></i> Iniciar', scanCityByZones, true));
        else if (window.location.pathname.includes("/Locale/CharactersPresent")) waitForElement("#tablechars", () => createControlPanel("Detector (Local)", '<i class="fa-solid fa-person-circle-check"></i> Iniciar', scanCurrentLocale, false));
    })();

    $('body').on('click', '.pm-copy-name', function(e) {
        e.preventDefault(); e.stopPropagation();
        const nameToCopy = $(this).data('name');
        const icon = $(this).find('i');
        if (!nameToCopy || !navigator.clipboard) return;
        navigator.clipboard.writeText(nameToCopy).then(() => {
            $(this).attr('title', 'Copiado!'); icon.removeClass('fa-copy').addClass('fa-check');
            setTimeout(() => { if ($(this)) { $(this).attr('title', 'Copiar nome'); icon.removeClass('fa-check').addClass('fa-copy'); } }, 1500);
        }).catch(err => console.error('Falha ao copiar:', err));
    });
})();