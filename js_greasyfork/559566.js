// ==UserScript==
// @name         Popmundo Monitor 😤
// @namespace    http://tampermonkey.net/
// @version      7.7.0
// @description  Ideal para caçadas longas. Notifica no Telegram sem agir, se preferir.
// @author       Chris Popper (id: 1618575)
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Locale*
// @match        https://*.popmundo.com/Default.aspx
// @match        https://*.popmundo.com/
// @match        https://*.popmundo.com/World/Popmundo.aspx/ChooseCharacter*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/ImproveCharacter*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/ItemDetails*
// @match        https://www.thegreatheist.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559566/Popmundo%20Monitor%20%F0%9F%98%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/559566/Popmundo%20Monitor%20%F0%9F%98%A4.meta.js
// ==/UserScript==
 
/* eslint-env jquery, greasemonkey */
 
/*
HISTÓRICO DE MUDANÇAS (v7.7.0 - Desativação por Inventário):
 
MODIFICAÇÃO CRÍTICA: A desativação automática de itens personalizados após o uso foi alterada. O item agora é desativado (enabled=false) **SOMENTE** se ele não for encontrado na lista do inventário (diário) após a tentativa de uso, confirmando que foi consumido.
*/
 
(function() {
    'use strict';
    const scriptVersion = typeof GM_info !== 'undefined' ? GM_info.script.version : '7.7.0';
    const PANEL_POSITION_KEY = "pmPanelPosition_v1_monitor";
    const THEME_KEY = "pmMonitorTheme_v7.1";
    const MINIMIZED_KEY = "pmMonitorMinimized_v7.1";
    const LOG_COLLAPSED_KEY = "pmLogCollapsed_v1";
    console.log(`[PM v${scriptVersion}] Script iniciado em: ${window.location.href}`);
 
    if (typeof $ === 'undefined') { console.error("PM ERRO: jQuery N/A!"); alert("PM ERRO FATAL: jQuery não carregou."); return; }
    console.log("[PM] jQuery carregado.");
 
    const DEFAULT_CONFIG = {
        refreshInterval: 300, minHealth: 50, minMood: 50, healthMethod: 'xp', enabled: false, username: null,
        selectedCharacter: null, customItems: [], actionLog: [],
        telegramEnabled: false, telegramBotToken: '', telegramChatId: '',
    };
 
    const SELECTORS = {
        loginUsernameField: '#ctl00_cphLeftColumn_ucLogin_txtUsername, #ctl00_cphRightColumn_ucLogin_txtUsername',
        loginPasswordField: '#ctl00_cphLeftColumn_ucLogin_txtPassword, #ctl00_cphRightColumn_ucLogin_txtPassword',
        loginButton: '#ctl00_cphRightColumn_ucLogin_btnLogin',
        healthValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgHealth) div.progressBar div div",
        moodValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgMood) div.progressBar div div",
        characterLink: 'a:contains("Meu Personagem"):first',
        improveCharacterLinkFallback: 'a[id^="ctl00_cphLeftColumn_ctl00_lnkToolLink"][href*="/Character/ImproveCharacter/"]',
        avatarLink: '.avatar.pointer[onclick*="/Character/"]',
        improveHealthButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl02_btnBoostAttribute',
        improveMoodButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl01_btnBoostAttribute',
        itemsLink: 'a[href*="/Character/Items/"]',
        painkillerLink: 'a[href*="/Character/ItemDetails/"]:contains("Analgésicos")',
        useItemButton: 'input#ctl00_cphLeftColumn_ctl00_btnItemUse',
        itemListTable: 'table.data',
        itemLinkInList: 'td:nth-child(2) a[href*="/Character/ItemDetails/"]',
        characterNameInHeader: 'div.character-header > h1',
        pmCharacterNameHeader: '#pmCharacterNameHeader',
    };
 
    const BASE_URL_MATCH = "/World/Popmundo.aspx/Character";
    const IMPROVE_URL_PATH = "/World/Popmundo.aspx/Character/ImproveCharacter";
    const ITEMS_URL_PATH = "/World/Popmundo.aspx/Character/Items";
    const ITEM_DETAILS_URL_PATH = "/World/Popmundo.aspx/Character/ItemDetails";
    const CHOOSE_CHAR_PATH = "/World/Popmundo.aspx/ChooseCharacter";
 
    let config = {}; let refreshTimerId = null; let countdownIntervalId = null; let nextRefreshTimestamp = null;
    let currentStatus = "Inicializando..."; let actionInProgress = false;
    let currentTheme = GM_getValue(THEME_KEY, 'light');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);
 
    function loadConfig() {
        try {
            let sc = GM_getValue("popmundoMonitorConfig_v7.4", null); // Using v7.4 key for storage compatibility, logic is v7.7.0
            config = { ...DEFAULT_CONFIG, ...(sc || {}) };
            if (!Array.isArray(config.customItems)) { config.customItems = []; }
            else {
                config.customItems = config.customItems.map(item => ({
                    id: item.id || null, name: item.name || 'Item Inválido',
                    interval: parseInt(item.interval) || 3600, lastUse: parseInt(item.lastUse) || 0,
                    enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
                    purpose: item.purpose || 'interval',
                    threshold: parseInt(item.threshold) || 0
                })).filter(item => item.id);
            }
            config.username = GM_getValue("popmundoLoginUsername_v4", null);
            config.selectedCharacter = GM_getValue("popmundoSelectedCharName_v4", null);
            config.actionLog = GM_getValue("popmundoActionLog_v5", []);
            console.log(`[PM v${scriptVersion}] Config carregada (Monitor=${config.enabled}, Telegram=${config.telegramEnabled})`);
        } catch (e) {
            console.error(`[PM v${scriptVersion}] ERRO FATAL carregar config:`, e); config = { ...DEFAULT_CONFIG };
            alert("Erro ao carregar configuração. Resetando para padrões.");
            try { GM_setValue("popmundoMonitorConfig_v7.4", config); } catch (delErr) { console.error("[PM] Erro ao limpar chaves antigas ou salvar padrão:", delErr); }
        }
    }
 
    function saveConfig(showSuccess = true, restartMonitorIfNeeded = true) {
        try {
            GM_setValue("popmundoMonitorConfig_v7.4", config);
            GM_setValue("popmundoActionLog_v5", config.actionLog);
            const userIn = $('#pmUsername').val(); if (userIn) { GM_setValue("popmundoLoginUsername_v4", userIn); config.username = userIn; } else { GM_deleteValue("popmundoLoginUsername_v4"); config.username = null; } $('#pmUsername').val(config.username || '');
            const charNameIn = $('#pmCharName').val(); if (charNameIn) { GM_setValue("popmundoSelectedCharName_v4", charNameIn); config.selectedCharacter = charNameIn; } else { GM_deleteValue("popmundoSelectedCharName_v4"); config.selectedCharacter = null; } $('#pmCharName').val(config.selectedCharacter || '');
            const passIn = $('#pmPassword').val(); if (passIn) { GM_setValue("popmundoLoginPassword_v4", passIn); $('#pmPassword').val(''); console.warn("[PM] Senha salva via GM_setValue. Isso é um risco de segurança."); }
            $('#pmMonitorToggle').prop('checked', config.enabled);
 
            sessionStorage.removeItem('pmLastNotifiedHealth');
            sessionStorage.removeItem('pmLastNotifiedMood');
            logAction("⚙️ Estado das notificações resetado.");
 
            console.log(`[PM v${scriptVersion}] Config salva.`);
            if (showSuccess) { updateStatus("Configuração salva!", false); }
            updateCustomItemsDisplay();
            updateCurrentCharacterDisplay();
            if (restartMonitorIfNeeded && config.enabled && !refreshTimerId && !actionInProgress && !isLoginPage() && !isCharacterSelectionPage()) {
                stopTimers();
                updateStatus("Config salva. Iniciando verificação...");
                setTimeout(runCheck, 1000);
            } else if (!config.enabled) {
                stopTimers();
                if (!actionInProgress) { updateStatus("Monitor desativado."); }
            }
        } catch (e) {
            console.error(`[PM v${scriptVersion}] ERRO salvar config:`, e);
            alert("Erro ao salvar configuração.");
            updateStatus("Erro ao salvar!", true);
        }
    }
 
    function sendTelegramNotification(message) {
        if (!config.telegramEnabled || !config.telegramBotToken || !config.telegramChatId) { console.warn("[PM Telegram] Tentativa de notificar, mas está desativado ou não configurado."); return; }
        const apiUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
        const payload = { chat_id: config.telegramChatId, text: message, parse_mode: 'HTML' };
        logAction(`💬 Enviando notificação Telegram...`);
        console.log(`[PM Telegram] Enviando: "${message}"`);
        GM_xmlhttpRequest({
            method: "POST", url: apiUrl, headers: { "Content-Type": "application/json" }, data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.ok) { console.log("[PM Telegram] Notificação enviada com sucesso."); logAction("✔️ Notificação Telegram enviada."); }
                    else { console.error("[PM Telegram] API retornou erro:", res.description); logAction(`❌ Erro Telegram: ${res.description}`); updateStatus(`Erro Telegram: ${res.description}`, true); }
                } catch(e) { console.error("[PM Telegram] Erro ao parsear resposta da API:", response.responseText, e); logAction("❌ Erro Telegram: Resposta inválida."); }
            },
            onerror: function(response) { console.error("[PM Telegram] ERRO de rede ao enviar notificação:", response); logAction("❌ Falha de rede ao notificar Telegram."); updateStatus("Erro de rede com Telegram.", true); }
        });
    }
 
    function updateStatus(msg, isErr = false) {
        currentStatus = msg;
        const el = $('#pmMonitorStatus');
        let iconHtml = '';
        if (isErr) iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> ';
        else if (msg.includes("Próxima verificação") || msg.includes("Agendando")) iconHtml = '<i class="fa-solid fa-hourglass-half fa-fw"></i> ';
        else if (msg.includes("desativado") || msg.includes("inativo") || msg.includes("Parado")) iconHtml = '<i class="fa-solid fa-power-off fa-fw"></i> ';
        else if (msg.includes("Status OK") || msg.includes("Configuração salva!")) iconHtml = '<i class="fa-solid fa-circle-check fa-fw"></i> ';
        else if (msg.includes("Ação em progresso") || msg.includes("Navegando") || msg.includes("Clicando") || msg.includes("Verificando") || msg.includes("Auto-Login") || msg.includes("Selecionando") || msg.includes("Procurando") || msg.includes("Tentando usar") || msg.includes("Retornando") || msg.includes("Usando item")) iconHtml = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> ';
        else if (msg.includes("Inicializando")) iconHtml = '<i class="fa-solid fa-rocket fa-fw"></i> ';
        else iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> ';
 
        if (el.length) {
            el.removeClass('pm-status-error pm-status-success pm-status-accent pm-status-normal');
            if (isErr) el.addClass('pm-status-error');
            else if (msg.includes("Configuração salva!")) el.addClass('pm-status-success');
            else if (msg.includes("Próxima verificação") || msg.includes("Agendando") || msg.includes("Usando item")) el.addClass('pm-status-accent');
            else el.addClass('pm-status-normal');
            el.html(iconHtml + msg);
        } else { console.log("[PM Status]:", msg); }
        if (isErr) { console.error("[PM] Status (ERRO):", msg); }
    }
 
    function stopTimers() { if (refreshTimerId) { clearTimeout(refreshTimerId); refreshTimerId = null; } if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; }
    function navigateTo(urlPath) { stopTimers(); actionInProgress = false; if (!urlPath || !urlPath.startsWith('/')) { console.error(`[PM Nav] URL inválida: ${urlPath}`); updateStatus("Erro: URL navegação inválida.", true); return; } const fullUrl = window.location.origin + urlPath; updateStatus(`Navegando para ${fullUrl}...`); console.log(`[PM Nav] Navegando para: ${fullUrl}`); try { window.location.href = fullUrl; } catch(e) { updateStatus(`ERRO navegar ${fullUrl}. Desativando Monitor.`, true); console.error("[PM Nav] Erro:", e); config.enabled = false; $('#pmMonitorToggle').prop('checked', false); try {let c=GM_getValue("popmundoMonitorConfig_v7.4",{}); c.enabled=false; GM_setValue("popmundoMonitorConfig_v7.4",c); } catch (se) {} alert("Erro navegação. Monitor desativado."); } }
    function clickElement(sel, desc) { try { const el = $(sel); if (el.length > 0) { const target = el.first(); updateStatus(`Clicando ${desc}...`); setTimeout(() => { try { target[0].click(); console.log(`[PM Click] ${desc} OK.`); } catch (err) { console.error(`[PM Click] Erro clique ${desc}:`, err); updateStatus(`ERRO clicar ${desc}!`, true); actionInProgress = false; } }, 250 + Math.random()*250); return true; } else { updateStatus(`ERRO: ${desc} (${sel}) N/E!`, true); console.error(`[PM Click] N/E: ${desc} (${sel})`); actionInProgress = false; return false; } } catch (e) { console.error(`[PM Click] Erro geral ${desc}:`, e); updateStatus(`ERRO GERAL ${desc}!`, true); alert(`Erro ${desc}.`); actionInProgress = false; return false; } }
    function parseStatValue(sel) { try { const el = $(sel).first(); if (el.length) { const txt = el.text(); const m = txt.match(/(\d+)/); if (m && m[1]) { const v = parseInt(m[1], 10); if (!isNaN(v)) return v; } } return null; } catch (e) { console.error(`[PM Parse] Erro ${sel}:`, e); return null; } }
    function getCharacterPageUrl() { const k='pmMonitor_characterUrl'; let f=null,c=null; try{const p=window.location.pathname; let m=p.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))(\/|$)/); if(m&&m[1]&&m[2]){f=m[1];c=m[2];sessionStorage.setItem(k,f);return f;} const l1=$(SELECTORS.characterLink); if(l1.length&&l1.attr('href')){let h=l1.attr('href');m=h.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))$/);if(m&&m[1]&&m[2]){f=m[1];c=m[2];sessionStorage.setItem(k,f);return f;}} const l2=$(SELECTORS.avatarLink); if(l2.length&&l2.attr('onclick')){let o=l2.attr('onclick');m=o.match(/\/Character\/(\d+)/);if(m&&m[1]){c=m[1];f=`${BASE_URL_MATCH}/${c}`;sessionStorage.setItem(k,f);return f;}} const l3=$(SELECTORS.improveCharacterLinkFallback); if(l3.length&&l3.attr('href')){let h=l3.attr('href');m=h.match(/\/ImproveCharacter\/(\d+)/);if(m&&m[1]){c=m[1];f=`${BASE_URL_MATCH}/${c}`;sessionStorage.setItem(k,f);return f;}} let t=sessionStorage.getItem(k); if(t&&/^\/World\/Popmundo\.aspx\/Character\/\d+$/.test(t)){return t;} console.warn("[PM URL] URL do personagem não encontrada nesta página."); return null; } catch(e){console.error("[PM URL] Erro ao obter URL:",e); return null;} }
    function getCharacterId(url) { if (!url) return null; const m = url.match(/\/Character\/(\d+)/); return m && m[1] ? m[1] : null; }
    function getCurrentTime() { return Math.floor(Date.now() / 1000); }
    function formatTime(seconds) { if (seconds <= 0) return "Pronto"; const h=Math.floor(seconds/3600); seconds%=3600; const m=Math.floor(seconds/60); seconds%=60; let t=""; if(h>0) t+=`${h}h `; if(m>0||h>0) t+=`${m.toString().padStart(h>0?2:1,'0')}m `; t+=`${seconds.toString().padStart(2,'0')}s`; return t.trim(); }
    function updateCountdownDisplay() { if (!nextRefreshTimestamp || !config.enabled) { if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } if (!actionInProgress && !currentStatus.startsWith("Erro") && !currentStatus.startsWith("Clicando") && !currentStatus.startsWith("Navegando")) { if (!config.enabled){ updateStatus('Monitor desativado.'); } else { updateStatus('Monitor parado.'); } } return; } const rM = nextRefreshTimestamp - Date.now(); const rS = Math.max(0, Math.ceil(rM / 1000)); if (!actionInProgress && !currentStatus.startsWith("Erro") && !currentStatus.startsWith("Clicando") && !currentStatus.startsWith("Navegando") && !currentStatus.startsWith("Configuração salva!")) { updateStatus(`Próxima verificação em ${rS} seg.`); } updateCustomItemsDisplay(); if (rM <= 0) { if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; } }
    function isLoginPage() { return $(SELECTORS.loginUsernameField).length > 0 && $(SELECTORS.loginPasswordField).length > 0; }
    function isCharacterSelectionPage() { return window.location.pathname.startsWith(CHOOSE_CHAR_PATH); }
    function isItemsPage() { return window.location.pathname.startsWith(ITEMS_URL_PATH); }
    function isItemDetailsPage() { return window.location.pathname.startsWith(ITEM_DETAILS_URL_PATH); }
    function isImprovePage() { return window.location.pathname.startsWith(IMPROVE_URL_PATH); }
    function isCharacterPage() { return window.location.pathname.startsWith(BASE_URL_MATCH) && !isImprovePage() && !isItemsPage() && !isItemDetailsPage(); }
    function performAutoLogin() { if (actionInProgress) { return false; } const u = config.username; const p = GM_getValue("popmundoLoginPassword_v4", null); if (u && p) { const uf = $(SELECTORS.loginUsernameField); const pf = $(SELECTORS.loginPasswordField); const lb = $(SELECTORS.loginButton); if (uf.length && pf.length && lb.length) { actionInProgress = true; updateStatus('Realizando Auto-Login...'); uf.val(u); pf.val(p); if (!clickElement(SELECTORS.loginButton, "botão Login")) { actionInProgress = false; return false; } logAction("🔑 Auto-Login realizado"); return true; } else { updateStatus('Elementos de Login não encontrados!', true); } } else { if (!u) updateStatus('Usuário não configurado para Auto-Login!', true); else if (!p) updateStatus('Senha não configurada para Auto-Login!', true); } actionInProgress = false; return false; }
    function selectCharacter() { const cn = config.selectedCharacter; if (!cn || actionInProgress) { return false; } actionInProgress = true; updateStatus(`Selecionando personagem ${cn}...`); const buttonValue = "Escolher " + cn; const selector = `input[type="submit"][value="${buttonValue}"]`; if (!clickElement(selector, `botão de seleção '${buttonValue}'`)) { actionInProgress = false; return false; } logAction(`👤 Personagem ${cn} selecionado`); return true; }
 
    // FUNÇÃO MODIFICADA: Apenas registra o uso, mas NÃO desativa o item
    function recordCustomItemUse(itemId) {
        const idx=config.customItems.findIndex(i=>String(i.id)===String(itemId));
        if(idx>-1){
            const now=getCurrentTime();
            const item=config.customItems[idx];
 
            item.lastUse=now;
 
            console.log(`[PM CI] Uso (${item.name}) ID ${itemId} registrado (aguardando validação de consumo).`);
            logAction(`Item Usado: ${item.name} (aguardando confirmação de consumo)`);
 
            // Não salvamos config aqui, apenas setamos lastUse. O saveConfig final será feito na validação.
            // No entanto, é mais seguro salvar `lastUse` imediatamente em caso de crash.
            saveConfig(false, false);
 
            updateCustomItemsDisplay();
        } else console.error(`[PM CI] Tentativa de registrar uso de item com ID ${itemId} não encontrado na config.`);
    }
 
    function checkForEmptyList() { const container = $('#pmCompactCustomItemList'); if (container.find('.pm-compact-item').length === 0 && container.find('.pm-log-empty').length === 0) { container.html('<div class="pm-log-empty"><i class="fa-solid fa-box-open fa-lg"></i><br></div>'); } else if (container.find('.pm-compact-item').length > 0) { container.find('.pm-log-empty').remove(); } }
    function populateCompactCustomItemList() {
        const container = $('#pmCompactCustomItemList'); if (!container.length) return; container.empty(); if (config.customItems.length === 0) { checkForEmptyList(); return; }
        config.customItems.forEach(item => {
            let iconClass = 'fa-box';
            if (item.purpose === 'health') iconClass = 'fa-heart-circle-plus'; else if (item.purpose === 'mood') iconClass = 'fa-face-laugh-beam'; else if (item.purpose === 'interval') iconClass = 'fa-hourglass-half';
            const title = `ID: ${item.id} | Cooldown: ${Math.round((item.interval || 0) / 60)} min | Ativo: ${item.enabled ? 'Sim' : 'Não'}\nPropósito: ${item.purpose}` + (item.threshold > 0 ? ` | Gatilho: < ${item.threshold}%` : '');
            const itemDiv = $(`
                <div class="pm-compact-item" data-item-id="${item.id}" title="${title}">
                    <div class="pm-compact-item-row-1">
                        <span class="pm-compact-item-name"><i class="fa-solid ${iconClass} fa-fw pm-compact-item-icon"></i>${item.name || 'Inválido'}</span>
                        <span class="pm-compact-item-status">...</span>
                        <button class="pm-compact-item-delete" title="Remover"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>`);
            itemDiv.find('.pm-compact-item-delete').on('click', function(e) { e.preventDefault(); e.stopPropagation(); const parentItemDiv = $(this).closest('.pm-compact-item'); const itemIdToDelete = parentItemDiv.data('item-id').toString(); const itemToRemove = config.customItems.find(i => String(i.id) === itemIdToDelete); if (itemToRemove && confirm(`Remover "${itemToRemove.name}" (ID: ${itemIdToDelete}) dos ciclos?`)) { console.log(`[PM CI] Removendo: ${itemToRemove.name}`); logAction(`➖ Item Removido: ${itemToRemove.name}`); config.customItems = config.customItems.filter(i => String(i.id) !== itemIdToDelete); saveConfig(false, false); parentItemDiv.fadeOut(300, function() { $(this).remove(); checkForEmptyList(); updateCustomItemsDisplay(); updateItemButtonsOnItemsPage(); }); } else if (!itemToRemove) { console.error(`[PM CI] ID ${itemIdToDelete} N/E config.`); } });
            container.append(itemDiv);
        });
        updateCustomItemsDisplay();
    }
    function updateCustomItemsDisplay() {
        const compactContainer = $('#pmCompactCustomItemList');
        const now = getCurrentTime();
        if (compactContainer.length) {
            checkForEmptyList();
            config.customItems.forEach(item => {
                const itemDiv = compactContainer.find(`.pm-compact-item[data-item-id="${String(item.id)}"]`);
                if (itemDiv.length) {
                    const statSpan = itemDiv.find('.pm-compact-item-status');
                    const rem = item.interval - (now - item.lastUse);
                    const ready = rem <= 0;
                    const title = `ID: ${item.id} | Cooldown: ${Math.round((item.interval || 0) / 60)} min | Ativo: ${item.enabled ? 'Sim' : 'Não'}\nPropósito: ${item.purpose}` + (item.threshold > 0 ? ` | Gatilho: < ${item.threshold}%` : '');
                    itemDiv.attr('title', title);
                    let statusIcon = '', statusText = '';
                    itemDiv.removeClass('pm-item-ready pm-item-cooldown pm-item-disabled');
                    if (item.enabled) {
                        if (ready) {
                            statusIcon = '<i class="fa-solid fa-play fa-fw"></i> '; statusText = 'Pronto';
                            itemDiv.addClass('pm-item-ready');
                        } else {
                            statusIcon = '<i class="fa-solid fa-clock fa-fw"></i> '; statusText = formatTime(rem);
                            itemDiv.addClass('pm-item-cooldown');
                        }
                    } else {
                        statusIcon = '<i class="fa-solid fa-ban fa-fw"></i> '; statusText = 'Off';
                        itemDiv.addClass('pm-item-disabled');
                    }
                    statSpan.html(statusIcon + statusText);
                }
            });
        }
        const genStat = $('#pmCustomItemStatus');
        if (genStat.length) {
            let genIcon = '<i class="fa-solid fa-box-archive fa-fw"></i> ';
            let genText = 'Nenhum';
            let genColorVar = 'var(--pm-value-secondary)';
            const readyItems = config.customItems.filter(i => i.enabled && (now - i.lastUse >= i.interval));
            const readyCount = readyItems.length;
            if (readyCount > 0) {
                genIcon = '<i class="fa-solid fa-check-circle fa-fw"></i> ';
                genText = `${readyCount} Item${readyCount > 1 ? 's' : ''} Disponível${readyCount > 1 ? 's' : ''}`;
                genColorVar = 'var(--pm-value-success)';
            } else {
                const nextIt = config.customItems.filter(i => i.enabled).sort((a, b) => (a.lastUse + a.interval) - (b.lastUse + b.interval))[0];
                if (nextIt) {
                    genIcon = '<i class="fa-solid fa-hourglass-start fa-fw"></i> ';
                    const rem = nextIt.interval - (now - nextIt.lastUse);
                    genText = `${nextIt.name.substring(0, 10)}.. ${formatTime(rem)}`;
                    genColorVar = 'var(--pm-value-accent)';
                } else if (config.customItems.length > 0) {
                    genIcon = '<i class="fa-solid fa-power-off fa-fw"></i> ';
                    genText = 'Nenhum Ativo';
                }
            }
            genStat.html(genIcon + genText).css('color', genColorVar);
        }
    }
    function addOrUpdateCustomItemConfig(itemId, itemName) {
        const itemIdStr = String(itemId);
        if (config.customItems.some(i => String(i.id) === itemIdStr)) { alert(`"${itemName}" (ID: ${itemIdStr}) já está nos ciclos.`); return; }
        let purpose = prompt(`Qual o propósito de "${itemName}"?\nDigite 'saude', 'humor' ou 'intervalo'.`, 'intervalo').toLowerCase();
        if (!['saude', 'humor', 'intervalo'].includes(purpose)) { alert("Propósito inválido. Use 'saude', 'humor' ou 'intervalo'."); return; }
        purpose = purpose.replace('saude', 'health').replace('humor', 'mood').replace('intervalo', 'interval');
        let threshold = 0;
        if (purpose === 'health' || purpose === 'mood') {
            let thresholdStr = prompt(`Usar quando ${purpose === 'health' ? 'a Saúde' : 'o Humor'} estiver ABAIXO de qual porcentagem (%)?\n(Exemplo: 40 para usar abaixo de 40%)`, '40');
            threshold = parseInt(thresholdStr);
            if (isNaN(threshold) || threshold < 1 || threshold > 100) { alert("Valor inválido. Usando 40%."); threshold = 40; }
        }
        let intervalMinutesStr = prompt(`Qual o intervalo de COOLDOWN (em MINUTOS) para "${itemName}" após o uso? (mín 1)`, "60");
        let intervalMinutes = parseInt(intervalMinutesStr);
        if (isNaN(intervalMinutes) || intervalMinutes < 1) { alert("Intervalo inválido. Usando 60 min."); intervalMinutes = 60; }
        const intervalSeconds = intervalMinutes * 60;
        const newItem = { id: itemIdStr, name: itemName, interval: intervalSeconds, lastUse: 0, enabled: true, purpose: purpose, threshold: threshold };
        config.customItems.push(newItem);
        console.log(`[PM CI] Adicionado item condicional:`, newItem);
        logAction(`➕ Item Adicionado: ${itemName} (${purpose}, <${threshold}%, ${intervalMinutes}m)`);
        saveConfig(false, false);
        alert(`"${itemName}" adicionado com sucesso!`);
        populateCompactCustomItemList();
        updateItemButtonsOnItemsPage();
    }
    function addSetCustomItemButtons() { if (!isItemsPage()) return; console.log(`[PM CI Botões] Verificando itens...`); const table = $(SELECTORS.itemListTable); if (!table.length) { console.warn("[PM CI Botões] Tabela N/E."); return; } const itemLinks = table.find(SELECTORS.itemLinkInList); itemLinks.each(function() { const link = $(this); const itemName = link.text().trim(); const itemHref = link.attr('href'); const match = itemHref ? itemHref.match(/\/ItemDetails\/(\d+)(?:\/(\d+))?$/) : null; const itemId = match ? String(match[2] || match[1]) : null; if (itemId && itemName && itemName !== "Analgésicos") { try { let button = link.siblings('.pm-set-custom-item-btn'); const buttonHtml_Add = '<i class="fa-solid fa-wand-magic-sparkles"></i> Usar Auto'; const buttonHtml_Configured = '<i class="fa-solid fa-check"></i> Config.'; if (button.length === 0) { button = $(`<button class="pm-set-custom-item-btn">${buttonHtml_Add}</button>`); button.on('click', { id: itemId, name: itemName }, function(event) { event.preventDefault(); event.stopPropagation(); addOrUpdateCustomItemConfig(event.data.id, event.data.name); }); link.after(button); } const isConfigured = config.customItems.some(i => String(i.id) === itemId); button.removeClass('pm-btn-configured pm-btn-add'); if (isConfigured) { if (button.html() !== buttonHtml_Configured) button.html(buttonHtml_Configured); button.addClass('pm-btn-configured').prop('title', `"${itemName}" já está configurado para uso em ciclo.`); } else { if (button.html() !== buttonHtml_Add) button.html(buttonHtml_Add); button.addClass('pm-btn-add').prop('title', `Adicionar "${itemName}" para uso automático em ciclo.`); } } catch (err) { console.error(`[PM CI Botões] Erro botão ${itemName} (${itemId}):`, err); } } }); console.log("[PM CI Botões] Verificação OK."); }
    function updateItemButtonsOnItemsPage() { if(!isItemsPage()) return; console.log("[PM CI Botões] Atualizando botões..."); $('.pm-set-custom-item-btn').each(function() { const button = $(this); const link = button.prev('a[href*="/ItemDetails/"]'); if (!link.length) return; const itemHref = link.attr('href'); const match = itemHref ? itemHref.match(/\/ItemDetails\/(\d+)(?:\/(\d+))?$/) : null; const itemId = match ? String(match[2] || match[1]) : null; const itemName = link.text().trim(); const buttonHtml_Add = '<i class="fa-solid fa-wand-magic-sparkles"></i> Usar Auto'; const buttonHtml_Configured = '<i class="fa-solid fa-check"></i> Config.'; if (itemId) { const isConfigured = config.customItems.some(i => String(i.id) === itemId); button.removeClass('pm-btn-configured pm-btn-add'); if (isConfigured) { if (button.html() !== buttonHtml_Configured) button.html(buttonHtml_Configured); button.addClass('pm-btn-configured').prop('title', `"${itemName}" já está configurado para uso em ciclo.`); } else { if (button.html() !== buttonHtml_Add) button.html(buttonHtml_Add); button.addClass('pm-btn-add').prop('title', `Adicionar "${itemName}" para uso automático em ciclo.`); } } }); }
    function logAction(message) { const t = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); let iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> '; let cleanMessage = message; if (message.startsWith('✔️') || message.includes('recuperada') || message.includes('Usado:') || message.includes('realizado') || message.includes('selecionado') || message.includes('ativado')) { iconHtml = '<i class="fa-solid fa-check fa-fw pm-log-success"></i> '; cleanMessage = message.replace(/^✔️\s*/, ''); } else if (message.startsWith('❌') || message.includes('Falha') || message.includes('ERRO') || message.includes('N/E')) { iconHtml = '<i class="fa-solid fa-xmark fa-fw pm-log-error"></i> '; cleanMessage = message.replace(/^❌\s*/, ''); } else if (message.startsWith('💊') || message.includes('Analgésicos')) { iconHtml = '<i class="fa-solid fa-pills fa-fw pm-log-accent"></i> '; cleanMessage = message.replace(/^💊\s*/, ''); } else if (message.startsWith('⚙️') || message.includes('Monitor Principal') || message.includes('item de intervalo') || message.includes('notificações resetado') || message.includes('desativado (consumido)')) { iconHtml = '<i class="fa-solid fa-gear fa-fw pm-log-secondary"></i> '; cleanMessage = message.replace(/^⚙️\s*/, ''); } else if (message.startsWith('➕') || message.includes('Adicionado')) { iconHtml = '<i class="fa-solid fa-plus fa-fw pm-log-success"></i> '; cleanMessage = message.replace(/^➕\s*/, ''); } else if (message.startsWith('➖') || message.includes('Removido')) { iconHtml = '<i class="fa-solid fa-minus fa-fw pm-log-error"></i> '; cleanMessage = message.replace(/^➖\s*/, ''); } else if (message.startsWith('🔑') || message.includes('Auto-Login')) { iconHtml = '<i class="fa-solid fa-key fa-fw pm-log-warning"></i> '; cleanMessage = message.replace(/^🔑\s*/, ''); } else if (message.startsWith('👤') || message.includes('Personagem')) { iconHtml = '<i class="fa-solid fa-user fa-fw pm-log-accent"></i> '; cleanMessage = message.replace(/^👤\s*/, ''); } else if (message.startsWith('❤️') || message.includes('Saúde')) { iconHtml = '<i class="fa-solid fa-heart-pulse fa-fw pm-log-error"></i> '; cleanMessage = message.replace(/^❤️\s*/, ''); } else if (message.startsWith('😊') || message.includes('Humor')) { iconHtml = '<i class="fa-solid fa-face-smile fa-fw pm-log-info"></i> '; cleanMessage = message.replace(/^😊\s*/, ''); } else if (message.startsWith('💬') || message.includes('Telegram')) { iconHtml = '<i class="fa-brands fa-telegram fa-fw pm-log-special"></i> '; cleanMessage = message.replace(/^💬\s*/, ''); } else if (message.includes('Log limpo')) { iconHtml = '<i class="fa-solid fa-circle-exclamation fa-fw pm-log-warning"></i> '; } config.actionLog.unshift(`[${t}] ${iconHtml}${cleanMessage}`); if (config.actionLog.length > 50) config.actionLog.length = 50; GM_setValue("popmundoActionLog_v5", config.actionLog); updateActionLogDisplay(); }
    function updateActionLogDisplay() { const e = $('#pmActionLog'); if (!e.length) return; if (config.actionLog.length === 0) { e.html('<div class="pm-log-empty"><i class="fa-solid fa-clipboard pm-log-empty-icon"></i><br>Log vazio.</div>'); } else { e.html(config.actionLog.map(en => `<div class="pm-log-entry">${en}</div>`).join('')); } }
    function clearActionLog() { if (confirm("Tem certeza que deseja limpar todo o histórico de ações?")) { config.actionLog = []; GM_setValue("popmundoActionLog_v5", config.actionLog); updateActionLogDisplay(); logAction("Log limpo."); } }
    function getCharacterNameFromPage() { const header = $(SELECTORS.characterNameInHeader); if (header.length > 0) { return header.text().trim(); } return null; }
    async function updateCurrentCharacterDisplay() { const charDisplay = $(SELECTORS.pmCharacterNameHeader); if (!charDisplay.length) return; let displayText = "N/A"; let titleText = "Nenhum personagem sendo monitorado."; let iconHtml = '<i class="fa-solid fa-circle-question"></i>'; if (config.enabled) { const charName = getCharacterNameFromPage() || config.selectedCharacter || "Personagem"; const charId = getCharacterId(getCharacterPageUrl()); displayText = charName; titleText = `Monitorando: ${charName}` + (charId ? ` (ID: ${charId})` : ''); iconHtml = '<i class="fa-solid fa-user-astronaut"></i>'; } else { displayText = "Monitor Desativado"; titleText = "O monitor está desativado."; iconHtml = '<i class="fa-solid fa-power-off"></i>'; } charDisplay.html(iconHtml + ' ' + displayText).attr('title', titleText); }
 
    function updateVisualStatus(health, mood) {
        const healthDisplay = $('#pmHealthDisplay');
        const moodDisplay = $('#pmMoodDisplay');
        if (health !== null) {
            healthDisplay.find('.pm-value').text(health + "%");
            healthDisplay.removeClass('pm-pulse-critical pm-value-warn pm-value-crit pm-value-ok');
            if (health < 30) { healthDisplay.addClass('pm-pulse-critical pm-value-crit'); }
            else if (health < 60) { healthDisplay.addClass('pm-value-warn'); }
            else { healthDisplay.addClass('pm-value-ok'); }
        } else {
            healthDisplay.find('.pm-value').text("--%");
            healthDisplay.removeClass('pm-pulse-critical pm-value-warn pm-value-crit pm-value-ok');
        }
        if (mood !== null) {
            moodDisplay.find('.pm-value').text(mood + "%");
            moodDisplay.removeClass('pm-pulse-critical pm-value-warn pm-value-crit pm-value-ok');
            if (mood < 30) { moodDisplay.addClass('pm-pulse-critical pm-value-crit'); }
            else if (mood < 60) { moodDisplay.addClass('pm-value-warn'); }
            else { moodDisplay.addClass('pm-value-ok'); }
        } else {
            moodDisplay.find('.pm-value').text("--%");
            moodDisplay.removeClass('pm-pulse-critical pm-value-warn pm-value-crit pm-value-ok');
        }
    }
 
    function waitForPageReady(callback, maxTries = 20, interval = 250) {
        let tries = 0;
        const check = () => {
            if (document.body && $('#header').length > 0) {
                console.log(`[PM] Página confirmada como pronta após ${tries + 1} tentativas. Iniciando script.`);
                callback();
            } else {
                tries++;
                if (tries < maxTries) { setTimeout(check, interval); }
                else {
                    console.error("[PM] ERRO FATAL: A página não pareceu carregar corretamente. O painel não será criado.");
                    alert("Popmundo Monitor: Falha ao inicializar. A página pode não ter carregado completamente. Tente recarregar (F5).");
                }
            }
        };
        check();
    }
 
    function runCheck() {
        try {
            actionInProgress = false;
            const currentPagePath = window.location.pathname;
            const characterPageUrl = getCharacterPageUrl();
            const currentCharacterId = characterPageUrl ? getCharacterId(characterPageUrl) : null;
            const charName = config.selectedCharacter || "Personagem";
            let pendingActionString = sessionStorage.getItem('pmMonitorAction');
            sessionStorage.removeItem('pmMonitorAction');
            let currentAction = null, actionTargetId = null, actionItemId = null;
            if (pendingActionString) {
                const parts = pendingActionString.split(':'); currentAction = parts[0];
                if (parts.length > 1) actionTargetId = parts[1];
                if (parts.length > 2) actionItemId = String(parts[2]);
                console.log(`[PM State] Ação pendente lida: Ação='${currentAction}', TargetID='${actionTargetId}', ItemID='${actionItemId}'`);
            }
            if (isLoginPage()) { console.log("[PM RC] Detectada página de Login."); stopTimers(); updateStatus("Página de Login encontrada."); if (performAutoLogin()) return; updateStatus("Aguardando login manual ou credenciais..."); return; }
            if (isCharacterSelectionPage()) { console.log("[PM RC] Detectada página de Seleção de Personagem."); stopTimers(); updateStatus("Página de Seleção de Personagem."); if (selectCharacter()) return; updateStatus("Aguardando seleção manual ou nome do personagem..."); return; }
            const myCharId = getCharacterId(getCharacterPageUrl());
            const defaultReturnPath = myCharId ? `${BASE_URL_MATCH}/${myCharId}` : null;
            if (!defaultReturnPath && config.enabled) {
                console.error("[PM RC] ERRO CRÍTICO: ID do *SEU* Personagem N/A para retorno padrão! Monitor pausado.");
                updateStatus("ERRO: ID do *SEU* Personagem N/A. Monitor pausado.", true);
                config.enabled = false; $('#pmMonitorToggle').prop('checked', false);
                try { let c = GM_getValue("popmundoMonitorConfig_v7.4", {}); c.enabled = false; GM_setValue("popmundoMonitorConfig_v7.4", c); } catch (se) {}
                stopTimers(); sessionStorage.removeItem('pmMonitorAction'); return;
            }
            if (!config.enabled) {
                if (!currentStatus.startsWith("Monitor desativado") && !currentStatus.startsWith("Configuração salva!")) { updateStatus("Monitor desativado."); }
                stopTimers(); return;
            }
            if (isCharacterPage()) {
                if (!currentCharacterId) { updateStatus("ERRO: ID Inválido na página do personagem!", true); stopTimers(); if (defaultReturnPath) setTimeout(() => navigateTo(defaultReturnPath), 1500); return; }
                if (config.enabled && !actionInProgress) {
                    updateStatus("Verificando status do personagem...");
                    const currentHealth = parseStatValue(SELECTORS.healthValue); const currentMood = parseStatValue(SELECTORS.moodValue);
                    updateVisualStatus(currentHealth, currentMood);
                    updateCustomItemsDisplay();
                    if (currentHealth === null || currentMood === null) { updateStatus("ERRO ao ler Saúde/Humor!", true); scheduleRefresh(defaultReturnPath); return; }
 
                    if (config.telegramEnabled) {
                        // Health Check
                        const lastNotifiedHealth = sessionStorage.getItem('pmLastNotifiedHealth');
                        if (currentHealth < config.minHealth) {
                            if (!lastNotifiedHealth || parseInt(lastNotifiedHealth) > currentHealth) {
                                sendTelegramNotification(`❤️ <b>Alerta de Saúde Baixa!</b>\nSaúde de <b>${charName}</b> caiu para <b>${currentHealth}%</b>.`);
                                sessionStorage.setItem('pmLastNotifiedHealth', currentHealth);
                            } else {
                                console.log(`[PM Telegram Check] Notificação de saúde pulada (anti-spam: saúde ${currentHealth}% não é menor que a última notificada ${lastNotifiedHealth}%).`);
                            }
                        } else if (currentHealth >= config.minHealth) {
                            if(lastNotifiedHealth) {
                                console.log('[PM Telegram Check] Resetando notificação de saúde (status OK).');
                                sessionStorage.removeItem('pmLastNotifiedHealth');
                            }
                        }
 
                        // Mood Check
                        const lastNotifiedMood = sessionStorage.getItem('pmLastNotifiedMood');
                        if (currentMood < config.minMood) {
                             if (!lastNotifiedMood || parseInt(lastNotifiedMood) > currentMood) {
                                sendTelegramNotification(`😊 <b>Alerta de Humor Baixo!</b>\nHumor de <b>${charName}</b> caiu para <b>${currentMood}%</b>.`);
                                sessionStorage.setItem('pmLastNotifiedMood', currentMood);
                            } else {
                                 console.log(`[PM Telegram Check] Notificação de humor pulada (anti-spam: humor ${currentMood}% não é menor que o último notificado ${lastNotifiedMood}%).`);
                             }
                        } else if (currentMood >= config.minMood) {
                            if(lastNotifiedMood) {
                                console.log('[PM Telegram Check] Resetando notificação de humor (status OK).');
                                sessionStorage.removeItem('pmLastNotifiedMood');
                            }
                        }
                    }
 
                    if (!config.telegramEnabled) {
                        const now = getCurrentTime();
                        if (currentHealth < config.minHealth) {
                            const healthItem = config.customItems.find(item => item.enabled && item.purpose === 'health' && currentHealth < item.threshold && (now - item.lastUse >= item.interval));
                            if (healthItem) {
                                actionInProgress = true; updateStatus(`Saúde baixa. Usando item: ${healthItem.name}...`); logAction(`❤️ Usando item de saúde: ${healthItem.name}`);
                                sessionStorage.setItem('pmMonitorAction', `goto_items_custom:${currentCharacterId}:${healthItem.id}`); navigateTo(`${ITEMS_URL_PATH}/${currentCharacterId}`); return;
                            } else {
                                stopTimers(); actionInProgress = true; updateStatus(`Saúde baixa (${currentHealth}/${config.minHealth}). Recuperação (${config.healthMethod})...`);
                                let targetUrl = null, nextState = null;
                                if (config.healthMethod === 'xp') { targetUrl = `${IMPROVE_URL_PATH}/${currentCharacterId}`; nextState = `goto_improve_health:${currentCharacterId}`; logAction(`❤️ Iniciando recuperação de saúde via XP`); }
                                else if (config.healthMethod === 'analgesico') { targetUrl = `${ITEMS_URL_PATH}/${currentCharacterId}`; nextState = `goto_items_painkiller:${currentCharacterId}`; logAction(`💊 Iniciando recuperação de saúde via analgésicos`); }
                                if (targetUrl && nextState) { sessionStorage.setItem('pmMonitorAction', nextState); navigateTo(targetUrl); } else { updateStatus("Erro: Método de saúde inválido!", true); actionInProgress = false; scheduleRefresh(defaultReturnPath); } return;
                            }
                        }
                        if (currentMood < config.minMood) {
                            const moodItem = config.customItems.find(item => item.enabled && item.purpose === 'mood' && currentMood < item.threshold && (now - item.lastUse >= item.interval));
                            if (moodItem) {
                                actionInProgress = true; updateStatus(`Humor baixo. Usando item: ${moodItem.name}...`); logAction(`😊 Usando item de humor: ${moodItem.name}`);
                                sessionStorage.setItem('pmMonitorAction', `goto_items_custom:${currentCharacterId}:${moodItem.id}`); navigateTo(`${ITEMS_URL_PATH}/${currentCharacterId}`); return;
                            } else {
                                stopTimers(); actionInProgress = true; updateStatus(`Humor baixo (${currentMood}/${config.minMood}). Recuperação (XP)...`);
                                sessionStorage.setItem('pmMonitorAction', `goto_improve_mood:${currentCharacterId}`); logAction(`😊 Iniciando recuperação de Humor via XP (Atual: ${currentMood})`); navigateTo(`${IMPROVE_URL_PATH}/${currentCharacterId}`); return;
                            }
                        }
                        const intervalItem = config.customItems.find(item => item.enabled && item.purpose === 'interval' && (now - item.lastUse >= item.interval));
                        if (intervalItem) {
                            actionInProgress = true; updateStatus(`Usando item de intervalo: ${intervalItem.name}...`);
                            sessionStorage.setItem('pmMonitorAction', `goto_items_custom:${currentCharacterId}:${intervalItem.id}`); logAction(`⚙️ Iniciando uso de item de intervalo: ${intervalItem.name}`); navigateTo(`${ITEMS_URL_PATH}/${currentCharacterId}`); return;
                        }
                    }
                    updateStatus("Status OK. Agendando próxima verificação...");
                    scheduleRefresh(defaultReturnPath);
                } else if (!actionInProgress) { stopTimers(); }
            } else if (config.enabled) {
                if (isImprovePage()) { actionInProgress = true; const nextImproveReturnState = `returning_after_action:${actionTargetId || myCharId}`; sessionStorage.setItem('pmMonitorAction', nextImproveReturnState); if (currentAction === 'goto_improve_health') { if (clickElement(SELECTORS.improveHealthButton, "botão Melhorar Saúde (XP)")) { logAction("✔️ Saúde recuperada com XP"); } else { logAction("❌ Falha ao clicar Melhorar Saúde (XP)"); sessionStorage.removeItem('pmMonitorAction'); navigateTo(defaultReturnPath); } } else if (currentAction === 'goto_improve_mood') { if (clickElement(SELECTORS.improveMoodButton, "botão Melhorar Humor (XP)")) { logAction("✔️ Humor recuperado com XP"); } else { logAction("❌ Falha ao clicar Melhorar Humor (XP)"); sessionStorage.removeItem('pmMonitorAction'); navigateTo(defaultReturnPath); } } else if (currentAction === 'returning_after_action') { updateStatus("Retornando da página Melhorar..."); actionInProgress = false; navigateTo(defaultReturnPath); } else { updateStatus("Ação inesperada na página Melhorar. Retornando..."); actionInProgress = false; sessionStorage.removeItem('pmMonitorAction'); navigateTo(defaultReturnPath); } }
                else if (isItemsPage()) {
                    addSetCustomItemButtons();
                    actionInProgress = true;
 
                    // NOVO: Etapa de validação após o uso do item custom
                    if (currentAction === 'validate_item_disappearance') {
                        const [, charId, itemId] = pendingActionString.split(':');
                        const targetItem = config.customItems.find(i => String(i.id) === itemId);
 
                        if (targetItem) {
                            const itemLinkSelector = `table.data td:nth-child(2) a[href*="/ItemDetails/"][href$="/${itemId}"]`;
 
                            // Verifica se o item ainda está na lista de itens (inventário)
                            if ($(itemLinkSelector).length === 0) {
                                // Item não encontrado -> foi consumido!
                                targetItem.enabled = false;
                                logAction(`⚙️ Item ${targetItem.name} desativado (consumido).`);
                                updateStatus(`Item ${targetItem.name} consumido e desativado.`);
                                saveConfig(false, false);
                            } else {
                                // Item ainda encontrado -> não foi consumido (ex: item de buffs permanentes ou erro).
                                logAction(`Item ${targetItem.name} ainda presente. Deixando ativo.`);
                            }
                        } else {
                            console.warn(`[PM CI Validação] Item ID ${itemId} não encontrado na config durante a validação.`);
                        }
 
                        // Após a validação, limpamos a ação pendente e retornamos para a página principal.
                        actionInProgress = false;
                        navigateTo(defaultReturnPath);
                        return;
                    }
                    // FIM NOVO: Etapa de validação
 
                    if (currentAction === 'goto_items_painkiller') {
                        sessionStorage.setItem('pmMonitorAction', `goto_painkiller_details:${actionTargetId}`);
                        if (!clickElement(SELECTORS.painkillerLink, "link Analgésicos")) { logAction("❌ Analgésicos não encontrados"); sessionStorage.removeItem('pmMonitorAction'); navigateTo(defaultReturnPath); }
                    } else if (currentAction === 'goto_items_custom') {
                        const targetItem = config.customItems.find(i => i.enabled && String(i.id) === actionItemId);
                        const itemName = targetItem ? targetItem.name : `Item ID ${actionItemId}`;
                        if (actionTargetId && actionItemId && targetItem) {
                            const itemLinkSelector = `table.data td:nth-child(2) a[href*="/ItemDetails/"][href$="/${actionItemId}"]`;
                            updateStatus(`Procurando ${itemName}...`);
                            sessionStorage.setItem('pmMonitorAction', `goto_custom_item_details:${actionTargetId}:${actionItemId}`);
                            if (!clickElement(itemLinkSelector, `link para ${itemName}`)) {
                                logAction(`❌ Item ${itemName} N/E na lista!`);
                                updateStatus(`ERRO: ${itemName} N/E!`, true);
                                // Se o item não está na lista quando procuramos, assumimos que foi usado manualmente ou esgotou
                                const itemConfigIndex = config.customItems.findIndex(i => String(i.id) === actionItemId);
                                if (itemConfigIndex !== -1 && config.customItems[itemConfigIndex].enabled) {
                                    config.customItems[itemConfigIndex].enabled = false;
                                    logAction(`⚙️ Item ${itemName} desativado (Não encontrado na lista inicial).`);
                                    saveConfig(false, false);
                                }
                                sessionStorage.removeItem('pmMonitorAction');
                                navigateTo(defaultReturnPath);
                            }
                        } else {
                            updateStatus("ERRO: Dados inválidos item custom ou item desativado!", true);
                            sessionStorage.removeItem('pmMonitorAction');
                            navigateTo(defaultReturnPath);
                        }
                    } else if (currentAction === 'returning_after_action') {
                        updateStatus("Retornando da página de Itens...");
                        actionInProgress = false;
                        navigateTo(defaultReturnPath);
                    } else {
                        updateStatus("Ação inesperada Itens. Retornando...");
                        actionInProgress = false;
                        stopTimers();
                        setTimeout(() => { if(defaultReturnPath) navigateTo(defaultReturnPath); }, 1000);
                    }
                }
                else if (isItemDetailsPage()) {
                    actionInProgress = true;
 
                    if (currentAction === 'goto_painkiller_details') {
                        const nextItemReturnState = `returning_after_action:${actionTargetId || myCharId}`;
                        sessionStorage.setItem('pmMonitorAction', nextItemReturnState);
                        if (clickElement(SELECTORS.useItemButton, "botão Usar (Analgésicos)")) { logAction("✔️ Analgésicos usados"); } else { logAction("❌ Falha Usar Analgésicos"); sessionStorage.removeItem('pmMonitorAction'); navigateTo(defaultReturnPath); }
                    } else if (currentAction === 'goto_custom_item_details' && actionItemId) {
                        const targetItem = config.customItems.find(i => String(i.id) === actionItemId);
                        const itemName = targetItem ? targetItem.name : `Item ID ${actionItemId}`;
                        updateStatus(`Tentando usar ${itemName}...`);
 
                        if (clickElement(SELECTORS.useItemButton, `botão Usar (${itemName})`)) {
                            // Registra o uso (atualiza lastUse) e define a validação
                            recordCustomItemUse(actionItemId);
                            // Estado para forçar a verificação do inventário na próxima página de Items
                            sessionStorage.setItem('pmMonitorAction', `validate_item_disappearance:${actionTargetId}:${actionItemId}`);
 
                        } else {
                            logAction(`❌ Falha Usar ${itemName}`);
                            updateStatus(`ERRO ao usar ${itemName}!`, true);
                            sessionStorage.removeItem('pmMonitorAction');
                            navigateTo(defaultReturnPath);
                        }
                    } else if (currentAction === 'returning_after_action') {
                        updateStatus("Retornando Detalhes Item...");
                        actionInProgress = false;
                        navigateTo(defaultReturnPath);
                    } else {
                        updateStatus("Ação inesperada Detalhes. Retornando...");
                        actionInProgress = false;
                        sessionStorage.removeItem('pmMonitorAction');
                        navigateTo(defaultReturnPath);
                    }
                }
                else { updateStatus(`Página ${currentPagePath} inesperada. Retornando...`); sessionStorage.removeItem('pmMonitorAction'); const finalReturnTarget = defaultReturnPath; if (finalReturnTarget) { navigateTo(finalReturnTarget); } else { updateStatus("ERRO CRÍTICO: Não foi possível determinar retorno!", true); stopTimers(); config.enabled = false; $('#pmMonitorToggle').prop('checked', false); try { let c = GM_getValue("popmundoMonitorConfig_v7.4", {}); c.enabled = false; GM_setValue("popmundoMonitorConfig_v7.4", c); } catch (se) {} alert("Erro crítico Monitor. Desativado."); } }
            } else { stopTimers(); }
        } catch (e) { console.error("[PM] ERRO CRÍTICO EM runCheck:", e); updateStatus("ERRO CRÍTICO! Ver console.", true); stopTimers(); config.enabled = false; $('#pmMonitorToggle').prop('checked', false); try { let c = GM_getValue("popmundoMonitorConfig_v7.4", {}); c.enabled = false; GM_setValue("popmundoMonitorConfig_v7.4", c); } catch (se) {} alert("Erro crítico no Popmundo Monitor. Desativado. Ver console (F12)."); sessionStorage.removeItem('pmMonitorAction'); }
    }
 
    function scheduleRefresh(charUrlPath) { stopTimers(); if (!config.enabled || actionInProgress || !charUrlPath || !getCharacterId(charUrlPath)) { if (config.enabled && !actionInProgress && (!charUrlPath || !getCharacterId(charUrlPath))) updateStatus("Pausa: URL/ID Personagem inválido.", true); else if (config.enabled && actionInProgress) updateStatus("Ação em progresso..."); else if (!config.enabled && !currentStatus.startsWith("Monitor desativado")) updateStatus("Monitor desativado."); return; } const intervalSeconds = Math.max(30, config.refreshInterval); const intervalMs = intervalSeconds * 1000; nextRefreshTimestamp = Date.now() + intervalMs; updateCountdownDisplay(); countdownIntervalId = setInterval(updateCountdownDisplay, 1000); refreshTimerId = setTimeout(() => { if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; navigateTo(charUrlPath); }, intervalMs); }
 
    function createControlPanel() {
        try {
            $('#pmMonitorPanel').remove();
            let isLogCollapsed = GM_getValue(LOG_COLLAPSED_KEY, true);
 
            const panelHTML = `
                <div id="pmMonitorPanel" class="${currentTheme} ${isMinimized ? 'minimized' : ''}">
                    <div class="pm-panel-header">
                        <h4><i class="fa-solid fa-crosshairs"></i> Popmundo Monitor <span>v${scriptVersion}</span></h4>
                        <div id="pmCharacterNameHeader" class="pm-character-name-header"><i class="fa-solid fa-spinner fa-spin"></i> Carregando...</div>
                        <div class="pm-header-controls">
                            <button id="pmThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                            <button id="pmMinimizeToggle" title="${isMinimized ? 'Maximizar' : 'Minimizar'}"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button>
                        </div>
                    </div>
                    <div class="pm-tabs">
                        <button class="pm-tab-button active" data-tab="dashboard" title="Dashboard"><i class="fa-solid fa-gauge-high"></i> Status</button>
                        <button class="pm-tab-button" data-tab="config" title="Configurações"><i class="fa-solid fa-sliders"></i> Config</button>
                        <button class="pm-tab-button" data-tab="items" title="Itens"><i class="fa-solid fa-box-archive"></i> Itens</button>
                        <button class="pm-tab-button" data-tab="telegram" title="Telegram"><i class="fa-brands fa-telegram"></i> Telegram</button>
                        <button class="pm-tab-button" data-tab="login" title="Login"><i class="fa-solid fa-key"></i> Login</button>
                    </div>
                    <div class="pm-tab-content-wrapper">
                        <div class="pm-tab-content active" id="pm-tab-dashboard">
                            <label class="pm-toggle-label"><input type="checkbox" id="pmMonitorToggle" ${config.enabled ? 'checked' : ''}><span class="pm-toggle-switch"></span><span class="pm-toggle-label-text">Monitor Principal</span></label>
                            <div class="pm-stat-display" id="pmHealthDisplay">
                                <div class="pm-stat-info"><span><i class="fa-solid fa-heart-pulse"></i> Saúde:</span><span class="pm-value">--%</span></div>
                            </div>
                            <div class="pm-stat-display" id="pmMoodDisplay">
                                <div class="pm-stat-info"><span><i class="fa-solid fa-face-smile"></i> Humor:</span><span class="pm-value">--%</span></div>
                            </div>
                            <div class="pm-stat-display">
                                <div class="pm-stat-info"><span><i class="fa-solid fa-gears"></i> Item Custom:</span><span id="pmCustomItemStatus" class="pm-value">--</span></div>
                            </div>
                            <div id="pmMonitorStatus" class="pm-status-box">${currentStatus}</div>
                            <div class="pm-log-header">
                                <div><i class="fa-solid fa-clipboard-list"></i> Log de Ações:</div>
                                <div><button id="pmLogToggle" class="pm-clear-button">${isLogCollapsed ? 'Mostrar' : 'Ocultar'}</button><button id="pmClearLogButton" class="pm-clear-button" title="Limpar Log"><i class="fa-solid fa-broom"></i></button></div>
                            </div>
                            <div id="pmActionLogContainer" ${isLogCollapsed ? 'style="display:none;"' : ''}><div id="pmActionLog"></div></div>
                        </div>
                        <div class="pm-tab-content" id="pm-tab-config">
                            <div><label for="pmMinHealth"><i class="fa-solid fa-heart-circle-bolt"></i> Saúde Mínima (%):</label><input type="number" id="pmMinHealth" min="1" max="100" value="${config.minHealth}"></div>
                            <div><label for="pmMinMood"><i class="fa-solid fa-face-grin-beam"></i> Humor Mínimo (%):</label><input type="number" id="pmMinMood" min="1" max="100" value="${config.minMood}"></div>
                            <div id="pmConfigTelegramNote" class="pm-text-info pm-special-note" style="display: none;">
                                <i class="fa-brands fa-telegram"></i> Com o Telegram ativo, a recuperação automática é desativada. Os valores acima servem para os alertas.
                            </div>
                            <div class="pm-separator"></div>
                            <div><label for="pmHealthMethod"><i class="fa-solid fa-briefcase-medical"></i> Recuperar Saúde (Padrão):</label><select id="pmHealthMethod"><option value="xp" ${config.healthMethod === 'xp' ? 'selected' : ''}>XP</option><option value="analgesico" ${config.healthMethod === 'analgesico' ? 'selected' : ''}>Analgésicos</option></select></div>
                            <div class="pm-text-info">(Usado se nenhum item custom de saúde estiver disponível)</div>
                            <div class="pm-separator"></div>
                            <div><label for="pmRefreshInterval"><i class="fa-solid fa-stopwatch"></i> Intervalo de Verificação (s):</label><input type="number" id="pmRefreshInterval" min="30" value="${config.refreshInterval}"></div>
                            <div class="pm-text-info">(Mínimo: 30s)</div>
                        </div>
                        <div class="pm-tab-content" id="pm-tab-items">
                            <div style="font-weight:bold;margin-bottom:8px;"><i class="fa-solid fa-boxes-stacked"></i> Itens Personalizados:</div>
                            <div id="pmCompactCustomItemList" class="pm-compact-custom-item-list-container"></div>
                            <div class="pm-text-info" style="margin-top: 8px;"><i class="fa-solid fa-circle-info"></i> Use o botão 'Usar Auto' na página de itens do jogo para adicionar um item à automação. Eles serão desativados se consumidos.</div>
                        </div>
                        <div class="pm-tab-content" id="pm-tab-telegram">
                            <label class="pm-toggle-label"><input type="checkbox" id="pmTelegramToggle" ${config.telegramEnabled ? 'checked' : ''}><span class="pm-toggle-switch"></span><span class="pm-toggle-label-text">Ativar Notificações</span></label>
                            <div class="pm-text-info" style="margin-bottom: 8px;"><i class="fa-solid fa-circle-info"></i> Ativar esta opção desabilita a recuperação automática de saúde/humor, priorizando as notificações.</div>
                            <div class="pm-separator"></div>
                            <div><label for="pmTelegramToken"><i class="fa-solid fa-robot"></i> Token do Bot:</label><input type="password" id="pmTelegramToken" value="${config.telegramBotToken || ''}" placeholder="Seu token do BotFather"></div>
                            <div><label for="pmTelegramChatId"><i class="fa-solid fa-hashtag"></i> Chat ID:</label><input type="text" id="pmTelegramChatId" value="${config.telegramChatId || ''}" placeholder="ID do seu chat/grupo"></div>
                            <button id="pmTestTelegram" class="pm-test-button"><i class="fa-solid fa-paper-plane"></i> Testar Notificação</button>
                            <div class="pm-separator"></div>
                            <div class="pm-text-info" style="margin-bottom: 8px;"><i class="fa-solid fa-bell"></i> Alertas de saúde e humor são enviados automaticamente quando esta opção está ativa, usando os limites da aba 'Config'.</div>
                        </div>
                        <div class="pm-tab-content" id="pm-tab-login">
                            <div class="pm-text-info"><i class="fa-solid fa-shield-halved"></i> Credenciais para Auto-Login</div>
                            <div><label for="pmUsername"><i class="fa-solid fa-user"></i> Usuário:</label><input type="text" id="pmUsername" value="${config.username || ''}" autocomplete="username" placeholder="xxx"></div>
                            <div><label for="pmPassword"><i class="fa-solid fa-key"></i> Senha:</label><input type="password" id="pmPassword" placeholder="xxx" autocomplete="new-password"></div>
                            <div class="pm-text-info pm-warning-text"><i class="fa-solid fa-triangle-exclamation"></i>A senha fica salva localmente no seu navegador.</div>
                            <div class="pm-separator"></div>
                            <div><label for="pmCharName"><i class="fa-solid fa-id-card"></i> Primeiro Nome do Personagem:</label><input type="text" id="pmCharName" value="${config.selectedCharacter || ''}" placeholder="Para auto-seleção após login"></div>
                        </div>
                    </div>
                    <button id="pmSaveConfig" class="pm-save-button"><i class="fa-solid fa-save"></i> Salvar Configurações</button>
                    <div class="pm-signature">By Chris Popper</div>
                </div>`;
            $('body').append(panelHTML);
            const panelElement = $('#pmMonitorPanel');
            let initialPositionSet = false;
            try { const savedPosition = GM_getValue(PANEL_POSITION_KEY, null); if (savedPosition && savedPosition.top && savedPosition.left) { panelElement.css({ top: savedPosition.top, left: savedPosition.left, right: 'auto', bottom: 'auto' }); initialPositionSet = true; } } catch (loadErr) { console.error("[PM Drag] Erro carregar pos:", loadErr); }
            if (!initialPositionSet) { panelElement.css({ top: '10px', right: '10px', left: 'auto', bottom: 'auto' }); }
            panelElement.fadeIn(400);
            populateCompactCustomItemList(); updateActionLogDisplay(); updateStatus(currentStatus); updateCurrentCharacterDisplay(); toggleMinimize(isMinimized, false);
            function updateTelegramOverrideNote() { if ($('#pmTelegramToggle').prop('checked')) $('#pmConfigTelegramNote').slideDown(200); else $('#pmConfigTelegramNote').slideUp(200); }
            updateTelegramOverrideNote();
            $('#pmTelegramToggle').on('change', updateTelegramOverrideNote);
            $('.pm-tab-button').on('click', function() { const tabId = $(this).data('tab'); $('.pm-tab-button').removeClass('active'); $('.pm-tab-content').removeClass('active'); $(this).addClass('active'); $('#pm-tab-' + tabId).addClass('active'); });
            $('#pmMonitorToggle').on('change', function() {
                config.enabled = $(this).prop('checked'); logAction(`⚙️ Monitor Principal ${config.enabled ? 'ativado' : 'desativado'}`);
                if (config.enabled) {
                    if (!isLoginPage() && !isCharacterSelectionPage() && !actionInProgress) { updateStatus("Monitor ativado. Iniciando..."); stopTimers(); setTimeout(runCheck, 500); }
                    else if (actionInProgress) { updateStatus("Monitor ativado (Ação em progresso...)"); stopTimers(); }
                    else { updateStatus("Monitor ativado (pausado em pág. especial)."); stopTimers(); if(isLoginPage() && !actionInProgress) setTimeout(performAutoLogin, 600); else if(isCharacterSelectionPage() && !actionInProgress) setTimeout(selectCharacter, 600); }
                } else { stopTimers(); updateStatus("Monitor desativado."); actionInProgress = false; updateVisualStatus(null, null); }
                saveConfig(false, false); updateCurrentCharacterDisplay();
            });
            $('#pmSaveConfig').on('click', function() {
                const button = $(this);
                config.refreshInterval = Math.max(30, parseInt($('#pmRefreshInterval').val()) || config.refreshInterval);
                config.minHealth = Math.min(100, Math.max(1, parseInt($('#pmMinHealth').val()) || config.minHealth));
                config.minMood = Math.min(100, Math.max(1, parseInt($('#pmMinMood').val()) || config.minMood));
                config.healthMethod = $('#pmHealthMethod').val() || DEFAULT_CONFIG.healthMethod;
                config.telegramEnabled = $('#pmTelegramToggle').prop('checked');
                config.telegramBotToken = $('#pmTelegramToken').val().trim();
                config.telegramChatId = $('#pmTelegramChatId').val().trim();
                $('#pmRefreshInterval').val(config.refreshInterval);
                $('#pmMinHealth').val(config.minHealth);
                $('#pmMinMood').val(config.minMood);
                $('#pmHealthMethod').val(config.healthMethod);
                saveConfig(true, true); updateTelegramOverrideNote();
                button.addClass('pm-save-success').html('<i class="fa-solid fa-check"></i> Salvo!').prop('disabled', true);
                setTimeout(() => {
                    button.removeClass('pm-save-success').html('<i class="fa-solid fa-save"></i> Salvar Configurações').prop('disabled', false);
                }, 1500);
            });
            $('#pmTestTelegram').on('click', function() {
                const token = $('#pmTelegramToken').val().trim(); const chatId = $('#pmTelegramChatId').val().trim(); if (!token || !chatId) { alert("Por favor, preencha o Token do Bot e o Chat ID antes de testar."); return; }
                const tempConfig = { ...config, telegramBotToken: token, telegramChatId: chatId, telegramEnabled: true }; const originalConfig = { ...config }; config = tempConfig;
                sendTelegramNotification(`✅ <b>Teste de Notificação</b>\nOlá! O Popmundo Monitor está funcionando corretamente para <b>${config.selectedCharacter || "Seu Personagem"}</b>.`); config = originalConfig;
            });
            $('#pmClearLogButton').on('click', clearActionLog);
            $('#pmThemeToggle').on('click', function() { currentTheme = currentTheme === 'light' ? 'dark' : 'light'; $('#pmMonitorPanel').removeClass('light dark').addClass(currentTheme); $(this).find('i').removeClass('fa-moon fa-sun').addClass(currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'); GM_setValue(THEME_KEY, currentTheme); });
            $('#pmMinimizeToggle').on('click', function() { isMinimized = !isMinimized; toggleMinimize(isMinimized, true); });
            $('#pmLogToggle').on('click', function() {
                isLogCollapsed = !isLogCollapsed;
                GM_setValue(LOG_COLLAPSED_KEY, isLogCollapsed);
                $('#pmActionLogContainer').slideToggle(200);
                $(this).text(isLogCollapsed ? 'Mostrar' : 'Ocultar');
            });
            const handle = $('#pmMonitorPanel').find('.pm-panel-header'); let isDragging = false; let dragOffset = { x: 0, y: 0 };
            handle.on('mousedown', function(e) { if ($(e.target).closest('button, a, input, select').length > 0) return; const panelElement = $('#pmMonitorPanel'); isDragging = true; panelElement.addClass('pm-dragging'); if (!initialPositionSet && panelElement.css('right') !== 'auto' && panelElement.css('left') === 'auto') { const currentRight = parseFloat(panelElement.css('right')); const panelWidth = panelElement.outerWidth(); const windowWidth = $(window).width(); const initialLeft = windowWidth - panelWidth - currentRight; panelElement.css({ left: initialLeft + 'px', right: 'auto', bottom: 'auto', top: panelElement.css('top') }); } initialPositionSet = true; dragOffset.x = e.pageX - panelElement.offset().left; dragOffset.y = e.pageY - panelElement.offset().top; e.preventDefault(); });
            $(document).on('mousemove.pmDrag', function(e) { if (!isDragging) return; const panelElement = $('#pmMonitorPanel'); let newLeft = e.pageX - dragOffset.x; let newTop = e.pageY - dragOffset.y; const winW = $(window).width(); const winH = $(window).height(); const panelW = panelElement.outerWidth(); const panelH = panelElement.outerHeight(); newLeft = Math.max(0, Math.min(newLeft, winW - panelW)); newTop = Math.max(0, Math.min(newTop, winH - panelH)); panelElement.css({ top: newTop + 'px', left: newLeft + 'px', right: 'auto', bottom: 'auto' }); });
            $(document).on('mouseup.pmDrag', function() { if (isDragging) { isDragging = false; $('#pmMonitorPanel').removeClass('pm-dragging'); try { const finalPosition = { top: $('#pmMonitorPanel').css('top'), left: $('#pmMonitorPanel').css('left') }; GM_setValue(PANEL_POSITION_KEY, finalPosition); } catch (saveErr) { console.error("[PM Drag] Erro salvar pos:", saveErr); } } });
        } catch (e) { console.error("[PM] ERRO CRÍTICO criar painel:", e); alert("Erro fatal ao criar painel."); }
    }
 
    function toggleMinimize(minimized, save = true) {
        const panel = $('#pmMonitorPanel'); const toggleButton = $('#pmMinimizeToggle');
        if (minimized) { panel.addClass('minimized'); toggleButton.find('i').removeClass('fa-window-minimize').addClass('fa-window-maximize'); toggleButton.attr('title', 'Maximizar'); }
        else { panel.removeClass('minimized'); toggleButton.find('i').removeClass('fa-window-maximize').addClass('fa-window-minimize'); toggleButton.attr('title', 'Minimizar'); }
        if (save) { GM_setValue(MINIMIZED_KEY, minimized); }
    }
 
    GM_addStyle(` @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'); @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
:root { --pm-font-family: 'Roboto', 'Segoe UI', sans-serif; --pm-shadow-color: rgba(0, 0, 0, 0.15); --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-warning-color: #ffc107; --pm-info-color: #17a2b8; --pm-accent-color: #0056b3; --pm-special-color: #6f42c1; --pm-delete-color: #c82333; --pm-delete-hover-color: var(--pm-error-color); --pm-item-ready-color: var(--pm-success-color); --pm-item-cooldown-color: var(--pm-accent-color); --pm-item-disabled-color: var(--pm-text-color-secondary); --pm-item-disabled-opacity: 0.6; --pm-value-ok: var(--pm-text-color); --pm-value-success: var(--pm-success-color); --pm-value-error: var(--pm-error-color); --pm-value-warning: #e0a800; --pm-value-accent: var(--pm-accent-color); --pm-value-secondary: var(--pm-text-color-secondary); }
#pmMonitorPanel.light { --pm-bg-color: #f0f0f0; --pm-text-color: #2c3e50; --pm-text-color-secondary: #7f8c8d; --pm-border-color: #bdc3c7; --pm-subtle-bg: #ffffff; --pm-input-bg: #ffffff; --pm-input-border: var(--pm-border-color); --pm-input-text: var(--pm-text-color); --pm-button-bg: #004080; --pm-button-hover-bg: #003366; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #e4e4e4; --pm-tab-hover-bg: #dcdcdc; --pm-log-bg: #e9ecef; --pm-item-list-bg: #e9ecef; --pm-item-bg: var(--pm-subtle-bg); --pm-item-border: #dcdcdc; --pm-item-hover-bg: #f8f9fa; --pm-item-hover-border: #ccc; }
#pmMonitorPanel.dark { --pm-bg-color: #3d3d3d; --pm-text-color: #f0f0f0; --pm-text-color-secondary: #b0b0b0; --pm-border-color: #555555; --pm-subtle-bg: #474747; --pm-input-bg: #505050; --pm-input-border: #6a6a6a; --pm-input-text: #e0e0e0; --pm-button-bg: #0056b3; --pm-button-hover-bg: #004080; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #505050; --pm-tab-hover-bg: #5a5a5a; --pm-log-bg: #474747; --pm-item-list-bg: #474747; --pm-item-bg: #505050; --pm-item-border: #6a6a6a; --pm-item-hover-bg: #5f5f5f; --pm-item-hover-border: #777777; --pm-shadow-color: rgba(0, 0, 0, 0.4); }
#pmMonitorPanel { position: fixed; background-color: var(--pm-bg-color); border: 1px solid var(--pm-border-color); padding: 0; z-index: 10001; width: 320px; font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color); box-shadow: 0 4px 12px var(--pm-shadow-color); border-radius: 5px; overflow: hidden; display: none; }
#pmMonitorPanel i.fas, #pmMonitorPanel i.far, #pmMonitorPanel i.fa-regular, #pmMonitorPanel i.fa-solid, #pmMonitorPanel i.fa-brands { margin-right: 5px; width: 1.1em; text-align: center; vertical-align: middle; }
.pm-panel-header { background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); padding: 6px 10px; cursor: move; user-select: none; display: flex; flex-direction: column; position: relative; }
.pm-panel-header h4 { margin: 0 0 4px 0; text-align: center; font-size: 14px; font-weight: 700; color: var(--pm-text-color); display: flex; align-items: center; justify-content: center; cursor: inherit; }
.pm-panel-header h4 i.fa-solid { margin-right: 8px; color: var(--pm-accent-color); }
.pm-panel-header h4 span { font-size: 9px; color: var(--pm-text-color-secondary); margin-left: 5px; font-weight: 400; }
.pm-character-name-header { font-size: 11px; color: var(--pm-text-color-secondary); text-align: center; padding: 2px 5px; background: rgba(0,0,0,0.03); border-radius: 3px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pm-character-name-header i.fa-solid { margin-right: 4px; font-size: 10px; }
.pm-header-controls { position: absolute; top: 6px; right: 10px; display: flex; gap: 5px; }
.pm-header-controls button { background: none; border: none; color: var(--pm-text-color-secondary); cursor: pointer; font-size: 12px; padding: 0; }
.pm-header-controls button:hover { color: var(--pm-accent-color); }
#pmMonitorPanel.minimized .pm-tabs, #pmMonitorPanel.minimized .pm-tab-content-wrapper, #pmMonitorPanel.minimized .pm-save-button, #pmMonitorPanel.minimized .pm-signature { display: none; }
#pmMonitorPanel.minimized { height: auto !important; }
.pm-tabs { display: flex; background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); }
.pm-tab-button { flex: 1; padding: 8px 5px; border: none; background: var(--pm-tab-inactive-bg); color: var(--pm-text-color-secondary); cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.25s ease; border-bottom: 2px solid transparent; margin-bottom: -1px; display: flex; align-items: center; justify-content: center; }
.pm-tab-button:hover { background: var(--pm-tab-hover-bg); color: var(--pm-text-color); }
.pm-tab-button.active { color: var(--pm-accent-color); border-bottom-color: var(--pm-accent-color); background: var(--pm-tab-active-bg); }
.pm-tab-button i.fa-solid, .pm-tab-button i.fa-brands { margin-right: 4px; }
.pm-tab-content-wrapper { padding: 10px; max-height: 550px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: var(--pm-text-color-secondary) var(--pm-subtle-bg); }
.pm-tab-content { display: none; animation: pmFadeIn 0.5s ease; }
.pm-tab-content.active { display: block; }
@keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
#pmMonitorPanel div[id^="pm-tab-"] > div:not(.pm-compact-custom-item-list-container):not(#pmActionLogContainer):not(.pm-stat-display):not(#pmMonitorStatus):not(.pm-log-header):not(.pm-notify-rule-container) { margin-bottom: 8px; }
#pmMonitorPanel label:not(.pm-toggle-label) { font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 3px; display: block; font-weight: 600; }
.pm-separator { height: 1px; background: var(--pm-border-color); margin: 10px 0; opacity: 0.7; }
.pm-text-info { font-size: 10px; color: var(--pm-text-color-secondary); margin-top: 2px; line-height: 1.3; display: block; }
.pm-text-info i.fa-solid { margin-right: 4px; }
.pm-text-info.pm-warning-text { color: var(--pm-warning-color); font-weight: bold; }
label.pm-toggle-label { display: flex; align-items: center; font-size: 12px; margin-bottom: 8px; cursor: pointer; user-select: none; }
.pm-toggle-label input[type="checkbox"] { opacity: 0; width: 0; height: 0; }
.pm-toggle-switch { position: relative; display: inline-block; width: 36px; height: 18px; background-color: var(--pm-border-color); border-radius: 9px; transition: background-color 0.3s ease; cursor: pointer; margin-right: 8px; border: 1px solid rgba(0,0,0,0.1); }
.pm-toggle-switch::before { content: ""; position: absolute; width: 12px; height: 12px; border-radius: 50%; background-color: white; top: 2px; left: 2px; transition: transform 0.3s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch { background-color: var(--pm-success-color); }
.pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch::before { transform: translateX(18px); }
.pm-stat-display { flex-direction: column; align-items: stretch; padding: 2px 8px; margin: 2px 0; background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-radius: 3px; }
.pm-stat-display .pm-value { font-weight: 700; font-size: 12px; }
#pmHealthDisplay.pm-value-crit .pm-value, #pmMoodDisplay.pm-value-crit .pm-value { color: var(--pm-value-error); }
#pmHealthDisplay.pm-value-warn .pm-value, #pmMoodDisplay.pm-value-warn .pm-value { color: var(--pm-value-warning); }
#pmHealthDisplay.pm-value-ok .pm-value, #pmMoodDisplay.pm-value-ok .pm-value { color: var(--pm-value-ok); }
#pmCustomItemStatus { color: var(--pm-value-secondary); }
#pmMonitorPanel input[type="text"], #pmMonitorPanel input[type="password"], #pmMonitorPanel input[type="number"], #pmMonitorPanel select { width: 100%; padding: 6px 8px; border: 1px solid var(--pm-input-border); background: var(--pm-input-bg); color: var(--pm-input-text); border-radius: 3px; font-size: 12px; box-sizing: border-box; }
#pmMonitorPanel input:focus, #pmMonitorPanel select:focus { border-color: var(--pm-accent-color); box-shadow: 0 0 0 2px color-mix(in srgb, var(--pm-accent-color) 25%, transparent); outline: none; }
button.pm-save-button { width: 100%; padding: 8px 12px; margin: 10px 0 0; background: var(--pm-button-bg); color: var(--pm-button-text); border: none; border-radius: 4px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
button.pm-save-button:hover:not(:disabled) { background: var(--pm-button-hover-bg); }
button.pm-clear-button { background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary); font-size: 10px; padding: 2px 8px; border-radius: 3px; cursor: pointer; }
button.pm-clear-button:hover:not(:disabled) { border-color: var(--pm-accent-color); color: var(--pm-accent-color); }
button.pm-test-button { width: 100%; padding: 6px 10px; margin: 4px 0 8px; background: var(--pm-info-color); color: var(--pm-button-text); border: none; border-radius: 4px; font-weight: 700; font-size: 11px; cursor: pointer; transition: all 0.2s ease; }
button.pm-test-button:hover { background-color: color-mix(in srgb, var(--pm-info-color) 85%, black); }
.pm-status-box { font-size: 11px; padding: 6px 10px; margin-top: 8px; background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-left: 3px solid var(--pm-border-color); border-radius: 3px; text-align: center; }
.pm-status-box.pm-status-normal { color: var(--pm-text-color-secondary); }
.pm-status-box.pm-status-success { background: color-mix(in srgb, var(--pm-success-color) 15%, transparent); border-left-color: var(--pm-success-color); color: color-mix(in srgb, var(--pm-success-color) 80%, black); }
.pm-status-box.pm-status-error { background: color-mix(in srgb, var(--pm-error-color) 15%, transparent); border-left-color: var(--pm-error-color); color: color-mix(in srgb, var(--pm-error-color) 80%, black); }
.pm-status-box.pm-status-accent { border-left-color: var(--pm-accent-color); color: var(--pm-accent-color); }
.pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; margin-bottom: 3px; font-size: 10px; color: var(--pm-text-color-secondary); }
#pmActionLog { font-size: 10px; max-height: 120px; overflow-y: auto; padding: 6px 8px; background: var(--pm-log-bg); color: var(--pm-text-color-secondary); }
.pm-log-entry { margin-bottom: 3px; padding-bottom: 3px; border-bottom: 1px dashed var(--pm-border-color); animation: logFadeIn 0.5s ease forwards; opacity:0; }
.pm-log-entry:last-child { border-bottom: none; }
.pm-log-entry i.pm-log-success { color: var(--pm-success-color); } .pm-log-entry i.pm-log-error { color: var(--pm-error-color); } .pm-log-entry i.pm-log-warning { color: var(--pm-warning-color); } .pm-log-entry i.pm-log-info { color: var(--pm-info-color); } .pm-log-entry i.pm-log-accent { color: var(--pm-accent-color); } .pm-log-entry i.pm-log-special { color: #0088cc; }
.pm-log-empty { text-align: center; padding: 8px; color: var(--pm-text-color-secondary); font-style: italic; }
@keyframes logFadeIn { to { opacity: 1; } }
#pmCompactCustomItemList { display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; padding: 6px; border: 1px solid var(--pm-border-color); border-radius: 3px; background: var(--pm-item-list-bg); }
.pm-compact-item { display: flex; flex-direction: column; padding: 5px 8px; background: var(--pm-item-bg); border: 1px solid var(--pm-item-border); border-radius: 3px; font-size: 11px; }
.pm-compact-item-row-1 { display: flex; align-items: center; }
.pm-compact-item-name { font-weight: 600; flex-grow: 1; margin-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pm-compact-item-status { font-weight: bold; width: 75px; text-align: right; flex-shrink: 0; }
.pm-compact-item.pm-item-ready .pm-compact-item-status { color: var(--pm-item-ready-color); }
.pm-compact-item.pm-item-cooldown .pm-compact-item-status { color: var(--pm-item-cooldown-color); }
.pm-compact-item.pm-item-disabled { opacity: 0.5; }
.pm-compact-item-delete { background: none; border: none; color: var(--pm-delete-color); cursor: pointer; opacity: 0.7; flex-shrink: 0; padding-left: 5px; }
.pm-compact-item-delete:hover { opacity: 1;}
button.pm-set-custom-item-btn { margin-left: 8px !important; padding: 2px 6px !important; font-size: 9px !important; cursor: pointer !important; border: 1px solid transparent !important; border-radius: 4px !important; }
button.pm-set-custom-item-btn.pm-btn-add { background-color: var(--pm-accent-color) !important; color: var(--pm-button-text) !important; }
button.pm-set-custom-item-btn.pm-btn-configured { background-color: var(--pm-success-color) !important; color: #fff !important; }
#pmMonitorPanel.pm-dragging { opacity: 0.85; }
.pm-signature { padding: 6px 12px; text-align: center; font-size: 10px; color: var(--pm-text-color-secondary); background-color: var(--pm-bg-color); margin-top: 8px; border-top: 1px solid var(--pm-border-color); }
.pm-notify-rule { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background-color: var(--pm-subtle-bg); border-radius: 3px; border: 1px solid var(--pm-border-color); }
.pm-notify-rule .pm-toggle-label { margin-bottom: 0; flex-grow: 1; }
.pm-special-note { background-color: color-mix(in srgb, var(--pm-accent-color) 10%, transparent); border-left: 3px solid var(--pm-accent-color); padding: 5px 8px; border-radius: 3px; margin-top: 5px !important; font-size: 10px; }
.pm-special-note i.fa-brands { color: var(--pm-accent-color); margin-right: 6px; }
@keyframes pmPulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
.pm-stat-display.pm-pulse-critical .pm-stat-info i { animation: pmPulse 1.5s infinite; }
.pm-stat-info { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.pm-stat-info span:first-child { color: var(--pm-text-color-secondary); font-size: 10px; }
button.pm-save-button.pm-save-success { background-color: var(--pm-success-color) !important; cursor: default; }
.pm-log-header > div { display: flex; gap: 5px; align-items: center; }
#pmActionLogContainer { border: 1px solid var(--pm-border-color); border-radius: 3px; overflow: hidden; }
#pmActionLog { border: none; max-height: 110px; }
`);
 
    function init() {
        try {
            loadConfig();
            currentTheme = GM_getValue(THEME_KEY, 'light');
            isMinimized = GM_getValue(MINIMIZED_KEY, false);
            createControlPanel();
            if (isItemsPage()) { addSetCustomItemButtons(); }
            let pendingAction = sessionStorage.getItem('pmMonitorAction');
            const isOnLoginPage = isLoginPage();
            const isOnCharSelectPage = isCharacterSelectionPage();
            if (config.enabled) {
                if (isOnLoginPage) { updateStatus("Página de Login encontrada."); stopTimers(); setTimeout(performAutoLogin, 600); }
                else if (isOnCharSelectPage) { updateStatus("Página de Seleção de Personagem."); stopTimers(); setTimeout(selectCharacter, 600); }
                else { updateStatus("Iniciando verificação..."); stopTimers(); setTimeout(runCheck, 400 + Math.random() * 400); }
            } else {
                updateStatus("Monitor desativado."); updateCustomItemsDisplay(); updateCurrentCharacterDisplay(); stopTimers();
            }
        } catch (e) {
            console.error("[PM] ERRO CRÍTICO init:", e);
            alert("Erro fatal na inicialização. Ver console.");
            try{ let cfg = GM_getValue("popmundoMonitorConfig_v7.4", {}); cfg.enabled = false; GM_setValue("popmundoMonitorConfig_v7.4", cfg); } catch(se){}
            sessionStorage.removeItem('pmMonitorAction');
        }
    }
 
    waitForPageReady(init);
 
    console.log(`[PM v${scriptVersion}] Script carregado e pronto.`);
 
})();