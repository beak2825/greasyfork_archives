// ==UserScript==
// @name 🧚Scodelario's Monitor🧚
// @namespace http://tampermonkey.net/
// @description Ideal para caçadas longas.
// @match https://*.popmundo.com/World/Popmundo.aspx/Character*
// @match https://*.popmundo.com/World/Popmundo.aspx/Locale*
// @match https://*.popmundo.com/Default.aspx
// @match https://*.popmundo.com/
// @match https://*.popmundo.com/World/Popmundo.aspx/ChooseCharacter*
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/ImproveCharacter*
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/ItemDetails*
// @match https://*.popmundo.com/World/Popmundo.aspx/Interact/*
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/OfferItem/*
// @match https://*.popmundo.com/World/Popmundo.aspx
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_deleteValue
// @grant GM_info
// @connect api.telegram.org
// @license MIT; https://github.com/Scodelario/Popmundo-Survival-Kit/blob/main/LICENSE
// @version 7.3.5
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/554227/%F0%9F%A7%9AScodelario%27s%20Monitor%F0%9F%A7%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/554227/%F0%9F%A7%9AScodelario%27s%20Monitor%F0%9F%A7%9A.meta.js
// ==/UserScript==

/* eslint-env jquery, greasemonkey */

(function () {
    'use strict';

    // --- Constantes e Inicialização ---
    const scriptVersion = typeof GM_info !== 'undefined' ? GM_info.script.version : 'N/A-noDM-noCondition';
    const CONFIG_KEY = "popmundoMonitorConfig_v7.2.6_cond";
    const PANEL_POSITION_KEY = "pmPanelPosition_v1";
    const TELEGRAM_API_BASE = "https://api.telegram.org/bot";
    const LOW_STAT_THRESHOLD_FOR_TELEGRAM = 20;
    const SCRIPT_UPDATE_LOG_KEY = "pmScriptUpdateLog_v7.3.1";
    const STATUS_PERSIST_KEY = 'pmNextStatus';
    const LANGUAGE_KEY = "pmLanguage";

    console.log(`[PM v${scriptVersion}] Script iniciado em: ${window.location.href}`);

    if (typeof $ === 'undefined') { console.error("PM ERRO: jQuery N/A!"); alert("PM ERRO FATAL: jQuery não carregou."); return; }
    console.log("[PM] jQuery carregado.");

    // --- CONFIGURAÇÕES PADRÃO ---
    const DEFAULT_CONFIG = {
        refreshInterval: 300, minHealth: 50, minMood: 50,
        healthMethod: 'xp',
        moodMethod: 'xp',
        enabled: false, username: null,
        selectedCharacter: null, customItems: [], actionLog: [],
        telegramUserId: '',
        telegramBotToken: '',
        telegramEnabled: false,
    };

    let currentLanguage = GM_getValue(LANGUAGE_KEY, 'pt');

    let caixaBombonsItemName = currentLanguage === 'pt' ? 'Caixa de bombons em formato de coração' : 'Heart Shaped Box of Chocolates';
    let analgesicsItemName = currentLanguage === 'pt' ? 'Analgésicos' : 'Painkillers';
    let meuPersonagem = currentLanguage === 'pt' ? 'Meu Personagem' : 'My Character';
    let confirmMessage = currentLanguage === 'pt' ? 'Sim' : 'Yes';
    let usesLeftText = currentLanguage === 'pt' ? 'usos restantes' : 'uses left';



    // --- SELETORES ---
    const SELECTORS = {
        //items em ingles ou portugues a depender do currentLanguage

        loginUsernameField: '#ctl00_cphLeftColumn_ucLogin_txtUsername, #ctl00_cphRightColumn_ucLogin_txtUsername',
        loginPasswordField: '#ctl00_cphLeftColumn_ucLogin_txtPassword, #ctl00_cphRightColumn_ucLogin_txtPassword',
        loginButton: '#ctl00_cphRightColumn_ucLogin_btnLogin',
        healthValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgHealth) div.progressBar div div",
        moodValue: "tr:has(#ctl00_cphLeftColumn_ctl00_imgMood) div.progressBar div div",
        characterLink: `a:contains("${meuPersonagem}"):first`,
        improveCharacterLinkFallback: 'a[id^="ctl00_cphLeftColumn_ctl00_lnkToolLink"][href*="/Character/ImproveCharacter/"]',
        avatarLink: '.avatar.pointer[onclick*="/Character/"]',
        improveHealthButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl02_btnBoostAttribute',
        improveMoodButton: 'input#ctl00_cphLeftColumn_ctl00_repAttributes_ctl01_btnBoostAttribute',
        itemsLink: 'a[href*="/Character/Items/"]',
        painkillerLink: `a[href*="/Character/ItemDetails/"]:contains("${analgesicsItemName}")`,
        chocolatesLink: `a[href*="/Character/ItemDetails/"]:contains("${caixaBombonsItemName}")`,
        useItemButton: 'input#ctl00_cphLeftColumn_ctl00_btnItemUse',
        itemListTable: 'table.data',
        itemLinkInList: 'td:nth-child(2) a[href*="/Character/ItemDetails/"]',
        confirmYesButton: `button.ui-button.ui-widget:contains("${confirmMessage}")`,
        interactLink: '#ctl00_cphRightColumn_ctl00_lnkInteract',
        interactUseItemDropdown: '#ctl00_cphTopColumn_ctl00_ddlUseItem',
        interactUseItemButton: '#ctl00_cphTopColumn_ctl00_btnUseItem',
        topCharacterDropdown: '#ctl00_ctl08_ucCharacterBar_ddlCurrentCharacter',
        topChangeCharacterButton: '#ctl00_ctl08_ucCharacterBar_btnChangeCharacter',
        offerItemLink: (charId) => `a[href="/World/Popmundo.aspx/Character/OfferItem/${charId}"]`,
        offerItemDropdown: '#ctl00_cphLeftColumn_ctl00_ddlItem',
        offerItemPriceInput: '#ctl00_cphLeftColumn_ctl00_txtPriceTag',
        offerItemOfferButton: '#ctl00_cphLeftColumn_ctl00_btnGive',
        pmMoodMethodDropdown: '#pmMoodMethod',
        sideMenuItemsLink: '#ppm-sidemenu a[href*="/Character/Items/"]',

    };

    // --- URLs e Variáveis de Estado ---
    const BASE_URL_MATCH = "/World/Popmundo.aspx/Character";
    const INTERACT_URL_PATH = "/World/Popmundo.aspx/Interact";
    const OFFER_ITEM_URL_PATH = "/World/Popmundo.aspx/Character/OfferItem";
    const IMPROVE_URL_PATH = "/World/Popmundo.aspx/Character/ImproveCharacter";
    const ITEMS_URL_PATH = "/World/Popmundo.aspx/Character/Items";
    const ITEM_DETAILS_URL_PATH = "/World/Popmundo.aspx/Character/ItemDetails";
    const CHOOSE_CHAR_PATH = "/World/Popmundo.aspx/ChooseCharacter";
    const POPMUNDO_NEWS_PATH = "/World/Popmundo.aspx";
    const LOGIN_PAGE_PATH = "/Default.aspx";
    const POPMUNDO_HOME_PATH = "/";

    const MAX_LOG_ENTRIES = 10000;
    const VALID_MOOD_METHODS = ['xp', 'chocolates'];
    const VALID_CONDITION_TYPES = ['none', 'health', 'mood'];

    let config = {};
    let refreshTimerId = null;
    let countdownIntervalId = null;
    let nextRefreshTimestamp = null;
    let currentStatus = "Inicializando..."; // Default, será sobrescrito se houver status persistido
    let actionInProgress = false;

    let firstHealthMoodFailureTimestamp = 0;
    let telegramHealthMoodNotificationSent = false;
    let telegramLowHealthNotificationSent = false;
    let telegramLowMoodNotificationSent = false;
    let telegramLoggedOutNotificationSent = false;


    // --- FUNÇÕES AUXILIARES ---
    function pm_sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // Variáveis para monitoramento de analgésicos via requisições HTTP
    let analgesicsRequestInProgress = false;
    let lastAnalgesicsRequestTime = 0;
    const ANALGESICS_REQUEST_COOLDOWN = 5000; // 5 segundos entre requisições

    // Estados dos switches de analgésicos
    let analgesicsMonitorEnabled = false;
    let analgesicsWebhookEnabled = false;
    const ANALGESICS_MONITOR_INTERVAL = 30000; // 30 segundos


    // --- Funções de Configuração ---
    function loadConfig() {
        try {
            let sc = GM_getValue(CONFIG_KEY, null);
            config = { ...DEFAULT_CONFIG, ...(sc || {}) };

            if (!Array.isArray(config.customItems)) { config.customItems = []; }
            else {
                config.customItems = config.customItems.map(item => ({
                    id: item.id || null,
                    name: item.name || 'Item Inválido',
                    interval: parseInt(item.interval) || 3600,
                    lastUse: parseInt(item.lastUse) || 0,
                    enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
                    conditionType: VALID_CONDITION_TYPES.includes(item.conditionType) ? item.conditionType : 'none',
                    conditionValue: parseInt(item.conditionValue) || 0,
                })).filter(item => item.id);
            }

            if (!VALID_MOOD_METHODS.includes(config.moodMethod)) {
                console.warn(`[PM Config] MoodMethod inválido ('${config.moodMethod}'). Resetando para 'xp'.`);
                config.moodMethod = DEFAULT_CONFIG.moodMethod;
            }

            config.username = GM_getValue("popmundoLoginUsername_v4", config.username);
            config.selectedCharacter = GM_getValue("popmundoSelectedCharName_v4", config.selectedCharacter);
            const loadedLog = GM_getValue("popmundoActionLog_v6", []);
            config.actionLog = Array.isArray(loadedLog) ? loadedLog : [];

            config.telegramUserId = config.telegramUserId || DEFAULT_CONFIG.telegramUserId;
            config.telegramBotToken = config.telegramBotToken || DEFAULT_CONFIG.telegramBotToken;
            config.telegramEnabled = typeof config.telegramEnabled === 'boolean' ? config.telegramEnabled : DEFAULT_CONFIG.telegramEnabled;

            // Carregar estados dos switches de analgésicos
            analgesicsMonitorEnabled = GM_getValue("pmAnalgesicsMonitorEnabled", false);
            analgesicsWebhookEnabled = GM_getValue("pmAnalgesicsWebhookEnabled", false);

            // Carregar idioma salvo
            currentLanguage = GM_getValue(LANGUAGE_KEY, 'pt');

            delete config.mainCharacterId;
            delete config.mainCharacterGuid;

            console.log(`[PM v${scriptVersion}] Config carregada (Monitor=${config.enabled}, Telegram=${config.telegramEnabled})`);
        } catch (e) {
            console.error(`[PM v${scriptVersion}] ERRO FATAL carregar config:`, e);
            try { const loadedLog = GM_getValue("popmundoActionLog_v6", []); config = { ...DEFAULT_CONFIG, actionLog: Array.isArray(loadedLog) ? loadedLog : [] }; }
            catch (logErr) { console.error("[PM] Erro carregar log pós falha:", logErr); config = { ...DEFAULT_CONFIG }; }
            alert("Erro ao carregar configuração. Resetando (mantendo log).");
            try { GM_setValue(CONFIG_KEY, { ...DEFAULT_CONFIG, actionLog: config.actionLog }); }
            catch (saveErr) { console.error("[PM] Erro salvar padrão:", saveErr); }
        }
    }

    function saveConfig(showSuccess = true, restartMonitorIfNeeded = true) {
        try {
            let cfgSave = {
                refreshInterval: config.refreshInterval,
                minHealth: config.minHealth,
                minMood: config.minMood,
                healthMethod: config.healthMethod,
                moodMethod: config.moodMethod,
                enabled: config.enabled,
                customItems: config.customItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    interval: item.interval,
                    lastUse: item.lastUse,
                    enabled: item.enabled,
                    conditionType: item.conditionType,
                    conditionValue: item.conditionValue
                })),
                telegramUserId: config.telegramUserId,
                telegramBotToken: config.telegramBotToken,
                telegramEnabled: config.telegramEnabled,
            };
            GM_setValue(CONFIG_KEY, cfgSave);
            GM_setValue("popmundoActionLog_v6", config.actionLog);

            const userIn = $('#pmUsername').val();
            if (userIn) { GM_setValue("popmundoLoginUsername_v4", userIn); config.username = userIn; }
            else { GM_deleteValue("popmundoLoginUsername_v4"); config.username = null; }
            $('#pmUsername').val(config.username || '');

            const charNameIn = $('#pmCharName').val();
            if (charNameIn) { GM_setValue("popmundoSelectedCharName_v4", charNameIn); config.selectedCharacter = charNameIn; }
            else { GM_deleteValue("popmundoSelectedCharName_v4"); config.selectedCharacter = null; }
            $('#pmCharName').val(config.selectedCharacter || '');

            const passIn = $('#pmPassword').val();
            if (passIn) { GM_setValue("popmundoLoginPassword_v4", passIn); $('#pmPassword').val(''); console.warn("[PM] Senha salva."); }

            $('#pmMonitorToggle').prop('checked', config.enabled);
            $(SELECTORS.pmMoodMethodDropdown).val(config.moodMethod);
            $('#pmTelegramEnabledToggle').prop('checked', config.telegramEnabled);

            // Salvar idioma
            const langIn = $('#pmLanguageSelect').val();
            if (langIn && (langIn === 'pt' || langIn === 'en')) {
                GM_setValue(LANGUAGE_KEY, langIn);
                currentLanguage = langIn;
            }
            $('#pmLanguageSelect').val(currentLanguage);

            console.log(`[PM v${scriptVersion}] Config salva.`);
            if (showSuccess) updateStatus("Configuração salva!", false);
            updateCustomItemsDisplay();

            if (restartMonitorIfNeeded && config.enabled && !refreshTimerId && !actionInProgress && !isLoginPage() && !isCharacterSelectionPage()) {
                stopTimers();
                updateStatus("Config salva. Reiniciando...");
                setTimeout(runCheck, 500);
            } else if (!config.enabled) {
                stopTimers();
                if (!actionInProgress) {
                    updateStatus("Monitor principal desativado.");
                }
            }
        } catch (e) {
            console.error(`[PM v${scriptVersion}] ERRO salvar config:`, e);
            alert("Erro ao salvar configuração.");
            updateStatus("Erro ao salvar!", true);
        }
    }

    // --- Funções de Status e Navegação ---
    function updateStatus(msg, isErr = false) { currentStatus = msg; const el = $('#pmMonitorStatus'); let iconHtml = ''; if (isErr) iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> '; else if (msg.includes("Próxima verificação") || msg.includes("Agendando")) iconHtml = '<i class="fa-solid fa-hourglass-half fa-fw"></i> '; else if (msg.includes("desativado") || msg.includes("inativo") || msg.includes("Parado")) iconHtml = '<i class="fa-solid fa-power-off fa-fw"></i> '; else if (msg.includes("Status OK") || msg.includes("Configuração salva!")) iconHtml = '<i class="fa-solid fa-circle-check fa-fw"></i> '; else if (msg.includes("Ação em progresso") || msg.includes("Navegando") || msg.includes("Clicando") || msg.includes("Verificando") || msg.includes("Auto-Login") || msg.includes("Selecionando") || msg.includes("Procurando") || msg.includes("Tentando usar") || msg.includes("Retornando") || msg.includes("Usando item") || msg.includes("Usando") || msg.includes("Recuperando") || msg.includes("Indo para") || msg.includes("confirmação 'Sim'")) iconHtml = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> '; else if (msg.includes("⚠️ Confirme o uso")) iconHtml = '<i class="fa-solid fa-triangle-exclamation fa-fw"></i> '; else if (msg.includes("Inicializando")) iconHtml = '<i class="fa-solid fa-rocket fa-fw"></i> '; else iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> '; if (el.length) { el.removeClass('pm-status-error pm-status-success pm-status-accent pm-status-normal'); if (isErr) el.addClass('pm-status-error'); else if (msg.includes("⚠️ Confirme o uso")) el.addClass('pm-status-error'); else if (msg.includes("Configuração salva!")) el.addClass('pm-status-success'); else if (msg.includes("Próxima verificação") || msg.includes("Agendando") || msg.includes("Usando") || msg.includes("Recuperando") || msg.includes("confirmação 'Sim'")) el.addClass('pm-status-accent'); else el.addClass('pm-status-normal'); el.html(iconHtml + msg); } else { console.log("[PM Status]:", msg); } if (isErr) { console.error("[PM] Status (ERRO):", msg); } }
    function stopTimers() { if (refreshTimerId) { clearTimeout(refreshTimerId); refreshTimerId = null; } if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; }
    function navigateTo(urlPath, nextStatusMsg = null) { stopTimers(); if (!urlPath || !urlPath.startsWith('/')) { console.error(`[PM Nav] URL inválida: ${urlPath}`); updateStatus("Erro: URL navegação inválida.", true); actionInProgress = false; return; } if (nextStatusMsg) { sessionStorage.setItem(STATUS_PERSIST_KEY, nextStatusMsg); } const fullUrl = window.location.origin + urlPath; const statusToShow = nextStatusMsg || `Navegando para ${urlPath}...`; updateStatus(statusToShow); console.log(`[PM Nav] Navegando para: ${fullUrl}`); try { window.location.href = fullUrl; } catch (e) { updateStatus(`ERRO navegar ${fullUrl}. Desativando.`, true); console.error("[PM Nav] Erro:", e); config.enabled = false; $('#pmMonitorToggle').prop('checked', false); try { let c = GM_getValue(CONFIG_KEY, {}); c.enabled = false; GM_setValue(CONFIG_KEY, c); } catch (se) { } alert("Erro navegação. Monitor desativado."); sessionStorage.removeItem('pmMonitorAction'); actionInProgress = false; } }
    async function clickElement(sel, desc, delay = 10) { return new Promise(async (resolve) => { try { const el = $(sel); if (el.length > 0) { const target = el.first(); updateStatus(`Clicando ${desc}...`); console.log(`[PM Click] Tentando: ${desc} (${sel})`); await pm_sleep(delay); try { target[0].click(); console.log(`[PM Click] ${desc} OK.`); resolve(true); } catch (err) { console.error(`[PM Click] Erro no clique ${desc}:`, err); updateStatus(`ERRO ao clicar ${desc}!`, true); resolve(false); } } else { updateStatus(`ERRO: ${desc} (${sel}) N/E!`, true); console.error(`[PM Click] N/E: ${desc} (${sel})`); resolve(false); } } catch (e) { console.error(`[PM Click] Erro geral ${desc}:`, e); updateStatus(`ERRO GERAL ${desc}!`, true); alert(`Erro ${desc}.`); resolve(false); } }); }

    async function selectDropdownOption(dropdownSelector, optionValueOrText, desc, isValue = true, delay = 10) { try { const dropdown = $(dropdownSelector); if (!dropdown.length) { console.error(`[PM Select] Dropdown N/E '${desc}' (${dropdownSelector})`); updateStatus(`ERRO: Dropdown ${desc} N/E!`, true); return false; } let optionFound = false; let finalValueToSelect = optionValueOrText; if (isValue) { if (dropdown.find(`option[value="${optionValueOrText}"]`).length) optionFound = true; } else { dropdown.find('option').each(function () { if ($(this).text().trim().toLowerCase() === optionValueOrText.toLowerCase()) { finalValueToSelect = $(this).val(); optionFound = true; return false; } }); if (!optionFound) { dropdown.find('option').each(function () { if ($(this).text().trim().toLowerCase().includes(optionValueOrText.toLowerCase())) { finalValueToSelect = $(this).val(); optionFound = true; console.warn(`[PM Select] Match parcial para '${optionValueOrText}' em ${desc}. Valor: ${finalValueToSelect}`); return false; } }); } } if (optionFound) { updateStatus(`Selecionando '${optionValueOrText}' em ${desc}...`); console.log(`[PM Select] Selecionando '${optionValueOrText}' (valor: ${finalValueToSelect}) em ${desc} (${dropdownSelector})`); dropdown.val(finalValueToSelect).trigger('change'); await pm_sleep(delay); if (dropdown.val() === finalValueToSelect) { console.log(`[PM Select] Seleção ${desc} OK.`); return true; } else { console.error(`[PM Select] Falha confirmar ${desc}. Atual: ${dropdown.val()}, Esperado: ${finalValueToSelect}`); updateStatus(`ERRO confirmar seleção ${desc}!`, true); return false; } } else { console.error(`[PM Select] Opção N/E '${optionValueOrText}' em ${desc} (${dropdownSelector}).`); updateStatus(`ERRO: Opção ${optionValueOrText} N/E ${desc}!`, true); return false; } } catch (e) { console.error(`[PM Select] Erro geral ${desc}:`, e); updateStatus(`ERRO GERAL selecionar ${desc}!`, true); return false; } }

    // --- Funções Utilitárias ---
    function parseStatValue(sel) { try { const el = $(sel).first(); if (el.length) { const txt = el.text(); const m = txt.match(/(\d+)/); if (m && m[1]) { const v = parseInt(m[1], 10); if (!isNaN(v)) return v; } } return null; } catch (e) { console.error(`[PM Parse] Erro ${sel}:`, e); return null; } }
    function getCharacterPageUrl() {
        const k = 'pmMonitor_characterUrl';
        let f = null,
            c = null,
            s = "N/A";
        try {
            const p = window.location.pathname;
            let m = p.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))(\/|$)/);
            if (m && m[1] && m[2]) {
                f = m[1]; c = m[2]; s = "URL";
                sessionStorage.setItem(k, f);
                return f;
            }
            const l1 = $(SELECTORS.characterLink);
            if (l1.length && l1.attr('href')) {
                let h = l1.attr('href');
                m = h.match(/^(\/World\/Popmundo\.aspx\/Character\/(\d+))$/);
                if (m && m[1] && m[2]) {
                    f = m[1];
                    c = m[2];
                    s = "MP";
                    sessionStorage.setItem(k, f);
                    return f;
                }
            }
            const l2 = $(SELECTORS.avatarLink);
            if (l2.length && l2.attr('onclick')) {
                let o = l2.attr('onclick');
                m = o.match(/\/Character\/(\d+)/);
                if (m && m[1]) {
                    c = m[1];
                    f = `${BASE_URL_MATCH}/${c}`;
                    s = "Ava";
                    sessionStorage.setItem(k, f);
                    return f;
                }
            } const l3 = $(SELECTORS.improveCharacterLinkFallback); if (l3.length && l3.attr('href')) { let h = l3.attr('href'); m = h.match(/\/ImproveCharacter\/(\d+)/); if (m && m[1]) { c = m[1]; f = `${BASE_URL_MATCH}/${c}`; s = "Imp"; sessionStorage.setItem(k, f); return f; } } let t = sessionStorage.getItem(k); if (t && /^\/World\/Popmundo\.aspx\/Character\/\d+$/.test(t)) { return t; } console.warn("[PM URL] URL char N/E."); return null;
        } catch (e) { console.error("[PM URL] Erro CRÍTICO obter URL:", e); return null; }
    }
    function getCharacterId(url) { if (!url) return null; const m = url.match(/\/Character\/(\d+)/); return m && m[1] ? m[1] : null; }
    async function getCurrentCharacterGuid(maxRetries = 10, retryDelay = 200) { console.log('[PM GUID Debug] Tentando obter GUID...'); for (let i = 0; i < maxRetries; i++) { try { const dropdown = $(SELECTORS.topCharacterDropdown); if (dropdown.length) { const guid = dropdown.val(); if (guid && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(guid)) { return guid; } } if (i < maxRetries - 1) { await pm_sleep(retryDelay); } } catch (e) { console.error(`[PM GUID Debug] Erro CRÍTICO na tentativa ${i + 1}:`, e); return null; } } console.error(`[PM GUID Debug] Dropdown N/E ou valor inválido após ${maxRetries} tentativas.`); return null; }
    function getCurrentTime() { return Math.floor(Date.now() / 1000); }
    function formatTime(seconds) { if (seconds <= 0) return "Pronto"; const h = Math.floor(seconds / 3600); seconds %= 3600; const m = Math.floor(seconds / 60); seconds %= 60; let t = ""; if (h > 0) t += `${h}h `; if (m > 0 || h > 0) t += `${m.toString().padStart(h > 0 ? 2 : 1, '0')}m `; t += `${seconds.toString().padStart(2, '0')}s`; return t.trim(); }

    // --- Funções de Verificação de Página ---
    function isLoginPage() {
        const path = window.location.pathname;
        return (path === LOGIN_PAGE_PATH || path === POPMUNDO_HOME_PATH) &&
            $(SELECTORS.loginUsernameField).length > 0 &&
            $(SELECTORS.loginPasswordField).length > 0;
    }
    function isCharacterSelectionPage() { return window.location.pathname.startsWith(CHOOSE_CHAR_PATH); }
    function isPopmundoNewsPage() { return window.location.pathname === POPMUNDO_NEWS_PATH; }
    function isItemsPage() { return window.location.pathname.startsWith(ITEMS_URL_PATH); }
    function isItemDetailsPage() { return window.location.pathname.startsWith(ITEM_DETAILS_URL_PATH); }
    function isImprovePage() { return window.location.pathname.startsWith(IMPROVE_URL_PATH); }
    function isInteractPage() { return window.location.pathname.startsWith(INTERACT_URL_PATH); }
    function isOfferItemPage() { return window.location.pathname.startsWith(OFFER_ITEM_URL_PATH); }
    function isCharacterPage() { const path = window.location.pathname; return path.startsWith(BASE_URL_MATCH) && !isImprovePage() && !isItemsPage() && !isItemDetailsPage() && !isInteractPage() && !isOfferItemPage(); }
    function isTargetCharacterPage(targetId) { if (!targetId) return false; return window.location.pathname === `${BASE_URL_MATCH}/${targetId}`; }

    // --- Funções de Ação (Login, Seleção Personagem) ---
    async function performAutoLogin() { if (actionInProgress) return false; const u = config.username; const p = GM_getValue("popmundoLoginPassword_v4", null); if (u && p) { const uf = $(SELECTORS.loginUsernameField); const pf = $(SELECTORS.loginPasswordField); const lb = $(SELECTORS.loginButton); if (uf.length && pf.length && lb.length) { actionInProgress = true; updateStatus('Auto-Login...'); uf.val(u); pf.val(p); const clicked = await clickElement(SELECTORS.loginButton, "botão Login"); if (clicked) { logAction("🔑 Auto-Login OK"); telegramLoggedOutNotificationSent = false; sessionStorage.setItem(STATUS_PERSIST_KEY, 'Selecionando personagem...'); return true; } else { actionInProgress = false; return false; } } else { updateStatus('Login N/E!', true); } } else { if (!u) updateStatus('Usuário N/A!', true); else if (!p) updateStatus('Senha N/A!', true); } actionInProgress = false; return false; }
    async function selectCharacter() { const cn = config.selectedCharacter; if (!cn || actionInProgress) return false; actionInProgress = true; updateStatus(`Selecionando ${cn}...`); const buttonValue = "Escolher " + cn; const selector = `input[type="submit"][value="${buttonValue}"]`; const clicked = await clickElement(selector, `botão '${buttonValue}'`); if (clicked) { logAction(`👤 Char ${cn} OK`); sessionStorage.setItem(STATUS_PERSIST_KEY, 'Verificando status...'); return true; } else { actionInProgress = false; return false; } }

    // --- Funções de Log e Display ---
    function logAction(message) { const t = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); let iconHtml = '<i class="fa-solid fa-info-circle fa-fw"></i> '; let cleanMessage = message; if (message.includes('recuperada') || message.includes('Usado:') || message.includes('realizado') || message.includes('selecionado') || message.includes('ativado') || message.includes('clicada') || message.includes('Humor recuperado')) { iconHtml = '<i class="fa-solid fa-check fa-fw pm-log-success"></i> '; } else if (message.includes('Falha') || message.includes('ERRO') || message.includes('N/E') || message.includes('esgotado') || message.includes('Desab.') || message.includes('Abortada')) { iconHtml = '<i class="fa-solid fa-xmark fa-fw pm-log-error"></i> '; } else if (message.includes('Analgésicos')) { iconHtml = '<i class="fa-solid fa-pills fa-fw pm-log-accent"></i> '; } else if (message.includes('Monitor Principal') || message.includes('item custom')) { iconHtml = '<i class="fa-solid fa-gear fa-fw pm-log-secondary"></i> '; } else if (message.includes('Adicionado')) { iconHtml = '<i class="fa-solid fa-plus fa-fw pm-log-success"></i> '; } else if (message.includes('Removido')) { iconHtml = '<i class="fa-solid fa-minus fa-fw pm-log-error"></i> '; } else if (message.includes('Auto-Login')) { iconHtml = '<i class="fa-solid fa-key fa-fw pm-log-warning"></i> '; } else if (message.includes('Personagem')) { iconHtml = '<i class="fa-solid fa-user fa-fw pm-log-accent"></i> '; } else if (message.includes('Saúde')) { iconHtml = '<i class="fa-solid fa-heart-pulse fa-fw pm-log-error"></i> '; } else if (message.includes('Humor')) { iconHtml = '<i class="fa-solid fa-face-smile fa-fw pm-log-info"></i> '; } else if (message.includes('Caixa de Bombons')) { iconHtml = '<i class="fa-solid fa-heart fa-fw pm-log-info"></i> '; } else if (message.includes('Item: ') || message.includes('Item Adicionado:') || message.includes('Item Usado:')) { iconHtml = '<i class="fa-solid fa-box fa-fw pm-log-accent"></i> '; } else if (message.includes('Aviso') || message.includes('AVISO') || message.includes('Estado antigo limpo') || message.includes('Pulando') || message.includes('Parcial') || message.includes('Log limpo') || message.includes("Aguardando confirmação") || message.includes("Aguard.")) { iconHtml = '<i class="fa-solid fa-circle-exclamation fa-fw pm-log-warning"></i> '; } else if (message.includes('Telegram') || message.includes('📢')) { iconHtml = '<i class="fa-solid fa-paper-plane fa-fw pm-log-telegram"></i> '; } else { iconHtml = '<i class="fa-solid fa-info-circle fa-fw pm-log-secondary"></i> '; } cleanMessage = cleanMessage.replace(/^[✔️❌💊⚙️➕➖🔑👤❤️😊⚠️📦📢]\s*/, ''); cleanMessage = cleanMessage.replace(/^\[.*?\]\s*/, ''); config.actionLog.unshift(`[${t}] ${iconHtml}${cleanMessage}`); if (config.actionLog.length > MAX_LOG_ENTRIES) { config.actionLog.length = MAX_LOG_ENTRIES; } GM_setValue("popmundoActionLog_v6", config.actionLog); updateActionLogDisplay(); }
    function updateActionLogDisplay() { const e = $('#pmActionLog'); if (!e.length) return; if (config.actionLog.length === 0) { e.html('<div class="pm-log-empty"><i class="fa-solid fa-clipboard pm-log-empty-icon"></i><br>Log vazio.</div>'); } else { e.html(config.actionLog.map(en => `<div class="pm-log-entry">${en}</div>`).join('')); } }
    function clearActionLog() { if (confirm("Limpar histórico?")) { config.actionLog = []; GM_setValue("popmundoActionLog_v6", config.actionLog); updateActionLogDisplay(); logAction("Aviso: Log limpo."); } }

    // --- Funções de Display de Contagem e Itens ---
    function updateCountdownDisplay() { if (!nextRefreshTimestamp || !config.enabled || actionInProgress) { if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; if (!actionInProgress && !currentStatus.startsWith("Erro") && !currentStatus.startsWith("Monitor desativado") && !currentStatus.includes("em progresso") && !currentStatus.startsWith("Config salva!")) { if (!config.enabled) { updateStatus('Monitor desativado.'); } else { updateStatus('Monitor parado.'); } } return; } const rM = nextRefreshTimestamp - Date.now(); const rS = Math.max(0, Math.ceil(rM / 1000)); const sE = $('#pmMonitorStatus'); if (!sE.length) return; if (!actionInProgress && !currentStatus.startsWith("Erro") && !currentStatus.includes("Clicando") && !currentStatus.includes("Navegando") && !currentStatus.startsWith("Config salva!") && !currentStatus.includes("em progresso")) { updateStatus(`Próxima verificação em ${rS} seg.`); } updateCustomItemsDisplay(); if (rM <= 0) { if (countdownIntervalId) { clearInterval(countdownIntervalId); countdownIntervalId = null; } nextRefreshTimestamp = null; } }
    function recordCustomItemUse(itemId) { const idx = config.customItems.findIndex(i => String(i.id) === String(itemId)); if (idx > -1) { const now = getCurrentTime(); config.customItems[idx].lastUse = now; console.log(`[PM CI] Uso (${config.customItems[idx].name}) ID ${itemId} às ${new Date(now * 1000).toLocaleTimeString()}`); logAction(`Item Usado (Ciclo): ${config.customItems[idx].name}`); saveConfig(false, false); updateCustomItemsDisplay(); } else console.error(`[PM CI] ID ${itemId} N/E config.`); }
    function checkForEmptyList() { const container = $('#pmCompactCustomItemList'); if (container.find('.pm-compact-item').length === 0 && container.find('.pm-compact-item-empty').length === 0) { container.html('<div class="pm-compact-item-empty"><i class="fa-solid fa-box-open fa-lg"></i><br>Nenhum item config.</div>'); } else if (container.find('.pm-compact-item').length > 0) { container.find('.pm-compact-item-empty').remove(); } }

    function populateCompactCustomItemList() {
        const container = $('#pmCompactCustomItemList');
        if (!container.length) return;
        container.empty();
        if (config.customItems.length === 0) {
            checkForEmptyList();
            return;
        }
        config.customItems.forEach(item => {
            let conditionText = '';
            if (item.conditionType === 'health') {
                conditionText = ` | Cond: Saúde < ${item.conditionValue}`;
            } else if (item.conditionType === 'mood') {
                conditionText = ` | Cond: Humor < ${item.conditionValue}`;
            }

            const itemDiv = $(`<div class="pm-compact-item" data-item-id="${item.id}" title="ID: ${item.id} | Intervalo: ${Math.round((item.interval || 0) / 60)} min | Ativo: ${item.enabled ? 'Sim' : 'Não'}${conditionText}"><div class="pm-compact-item-row-1"><span class="pm-compact-item-name"><i class="fa-solid fa-box fa-fw pm-compact-item-icon"></i>${item.name || 'Inválido'}</span><span class="pm-compact-item-status">...</span><button class="pm-compact-item-delete" title="Remover"><i class="fa-solid fa-trash-can"></i></button></div></div>`);
            itemDiv.find('.pm-compact-item-delete').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const parentItemDiv = $(this).closest('.pm-compact-item');
                const itemIdToDelete = parentItemDiv.data('item-id').toString();
                const itemToRemove = config.customItems.find(i => String(i.id) === itemIdToDelete);
                if (itemToRemove && confirm(`Remover "${itemToRemove.name}" (ID: ${itemIdToDelete}) dos ciclos?`)) {
                    console.log(`[PM CI] Removendo: ${itemToRemove.name}`);
                    logAction(`Removido (Ciclo): ${itemToRemove.name}`);
                    config.customItems = config.customItems.filter(i => String(i.id) !== itemIdToDelete);
                    saveConfig(false, false);
                    parentItemDiv.fadeOut(300, function () { $(this).remove(); checkForEmptyList(); updateCustomItemsDisplay(); updateItemButtonsOnItemsPage(); });
                } else if (!itemToRemove) {
                    console.error(`[PM CI] ID ${itemIdToDelete} N/E config.`);
                }
            });
            container.append(itemDiv);
        });
        updateCustomItemsDisplay();
    }

    function updateCustomItemsDisplay() {
        const compactContainer = $('#pmCompactCustomItemList');
        const now = getCurrentTime();

        const currentHealthForDisplay = parseStatValue(SELECTORS.healthValue);
        const currentMoodForDisplay = parseStatValue(SELECTORS.moodValue);

        if (compactContainer.length) {
            checkForEmptyList();
            config.customItems.forEach(item => {
                const itemDiv = compactContainer.find(`.pm-compact-item[data-item-id="${String(item.id)}"]`);
                if (itemDiv.length) {
                    const statSpan = itemDiv.find('.pm-compact-item-status');
                    const rem = item.interval - (now - item.lastUse);
                    const cooldownOver = rem <= 0;

                    let conditionMetForDisplay = false;
                    let conditionRelevant = true;
                    if (item.conditionType === 'none') {
                        conditionMetForDisplay = true;
                        conditionRelevant = false;
                    } else if (item.conditionType === 'health') {
                        conditionMetForDisplay = currentHealthForDisplay !== null && currentHealthForDisplay < item.conditionValue;
                    } else if (item.conditionType === 'mood') {
                        conditionMetForDisplay = currentMoodForDisplay !== null && currentMoodForDisplay < item.conditionValue;
                    }

                    let conditionTooltipText = '';
                    if (item.conditionType === 'health') {
                        conditionTooltipText = ` | Cond: Saúde < ${item.conditionValue}`;
                    } else if (item.conditionType === 'mood') {
                        conditionTooltipText = ` | Cond: Humor < ${item.conditionValue}`;
                    }
                    let titleText = `ID: ${item.id} | Intervalo: ${Math.round((item.interval || 0) / 60)} min | Ativo: ${item.enabled ? 'Sim' : 'Não'}${conditionTooltipText}`;
                    itemDiv.attr('title', titleText);

                    let statusIcon = '', statusText = '';
                    itemDiv.removeClass('pm-item-ready pm-item-cooldown pm-item-disabled pm-item-waiting-condition');

                    if (item.enabled) {
                        itemDiv.removeClass('pm-item-disabled');
                        if (cooldownOver && conditionMetForDisplay) {
                            statusIcon = '<i class="fa-solid fa-play fa-fw"></i> ';
                            statusText = 'Pronto';
                            itemDiv.addClass('pm-item-ready');
                        } else if (cooldownOver && !conditionMetForDisplay && conditionRelevant) {
                            statusIcon = '<i class="fa-solid fa-hand-paper fa-fw"></i> ';
                            statusText = `Aguard. ${item.conditionType === 'health' ? 'Saúde' : 'Humor'}`;
                            itemDiv.addClass('pm-item-waiting-condition');
                        }
                        else {
                            statusIcon = '<i class="fa-solid fa-clock fa-fw"></i> ';
                            statusText = formatTime(rem);
                            itemDiv.addClass('pm-item-cooldown');
                        }
                    } else {
                        statusIcon = '<i class="fa-solid fa-ban fa-fw"></i> ';
                        statusText = 'Off';
                        itemDiv.addClass('pm-item-disabled');
                    }
                    statSpan.html(statusIcon + statusText);
                }
            });
        }

        const genStat = $('#pmCustomItemStatus');
        if (genStat.length) {
            let readyItem = null;
            for (const item of config.customItems) {
                if (item.enabled) {
                    const cooldownOver = (now - item.lastUse >= item.interval);
                    let conditionMet = false;
                    if (item.conditionType === 'none') conditionMet = true;
                    else if (item.conditionType === 'health') conditionMet = currentHealthForDisplay !== null && currentHealthForDisplay < item.conditionValue;
                    else if (item.conditionType === 'mood') conditionMet = currentMoodForDisplay !== null && currentMoodForDisplay < item.conditionValue;

                    if (cooldownOver && conditionMet) {
                        readyItem = item;
                        break;
                    }
                }
            }

            let genIcon = '<i class="fa-solid fa-box-archive fa-fw"></i> ';
            let genText = 'Nenhum';
            let genColorVar = 'var(--pm-value-secondary)';

            if (readyItem) {
                genIcon = '<i class="fa-solid fa-check-circle fa-fw"></i> ';
                genText = `${readyItem.name.substring(0, 10)}.. Pronto`;
                genColorVar = 'var(--pm-value-success)';
            } else {
                const nextItemCandidates = config.customItems
                    .filter(i => i.enabled)
                    .map(i => {
                        const cooldownOver = (now - i.lastUse >= i.interval);
                        let conditionMet = false;
                        if (i.conditionType === 'none') conditionMet = true;
                        else if (i.conditionType === 'health') conditionMet = currentHealthForDisplay !== null && currentHealthForDisplay < i.conditionValue;
                        else if (i.conditionType === 'mood') conditionMet = currentMoodForDisplay !== null && currentMoodForDisplay < i.conditionValue;

                        return {
                            ...i,
                            cooldownOver: cooldownOver,
                            conditionMet: conditionMet,
                            timeToCooldownEnd: i.interval - (now - i.lastUse),
                            isWaitingCondition: cooldownOver && !conditionMet && i.conditionType !== 'none'
                        };
                    })
                    .sort((a, b) => {
                        if (a.isWaitingCondition && !b.isWaitingCondition) return -1;
                        if (!a.isWaitingCondition && b.isWaitingCondition) return 1;
                        return (a.lastUse + a.interval) - (b.lastUse + b.interval);
                    });

                const nextIt = nextItemCandidates[0];

                if (nextIt) {
                    if (nextIt.isWaitingCondition) {
                        genIcon = '<i class="fa-solid fa-hand-paper fa-fw"></i> ';
                        genText = `${nextIt.name.substring(0, 10)}.. Aguard. Cond.`;
                        genColorVar = 'var(--pm-value-warning)';
                    } else if (!nextIt.cooldownOver) {
                        genIcon = '<i class="fa-solid fa-hourglass-start fa-fw"></i> ';
                        const rem = nextIt.timeToCooldownEnd;
                        genText = `${nextIt.name.substring(0, 10)}.. ${formatTime(rem)}`;
                        genColorVar = 'var(--pm-value-accent)';
                    } else {
                        genIcon = '<i class="fa-solid fa-question-circle fa-fw"></i> ';
                        genText = 'Verificar';
                    }
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
        const existingItemIndex = config.customItems.findIndex(i => String(i.id) === itemIdStr);
        if (existingItemIndex > -1) {
            alert(`"${itemName}" (ID: ${itemIdStr}) já está nos ciclos.`);
            return;
        }

        let intervalMinutesStr = prompt(`Intervalo (MINUTOS) para "${itemName}" (mín 1):`, "60");
        let intervalMinutes = parseInt(intervalMinutesStr);
        if (isNaN(intervalMinutes) || intervalMinutes < 1) {
            alert("Intervalo inválido. Usando 60 min.");
            intervalMinutes = 60;
        }
        const intervalSeconds = intervalMinutes * 60;

        let conditionType = 'none';
        let conditionValue = 0;

        const conditionTypePrompt = prompt(`Condição para usar "${itemName}"?\nDigite:\n  'none' (ou deixe em branco) - Usar sempre que o cooldown acabar.\n  'health' - Usar se a SAÚDE estiver ABAIXO de um valor.\n  'mood' - Usar se o HUMOR estiver ABAIXO de um valor.`, "none")?.toLowerCase() || 'none';

        if (VALID_CONDITION_TYPES.includes(conditionTypePrompt)) {
            conditionType = conditionTypePrompt;
        } else {
            alert("Tipo de condição inválido. Usando 'none'.");
            conditionType = 'none';
        }

        if (conditionType === 'health' || conditionType === 'mood') {
            let valuePromptStr = prompt(`Usar "${itemName}" se ${conditionType === 'health' ? 'SAÚDE' : 'HUMOR'} estiver ABAIXO de (1-100):`, "50");
            let parsedValue = parseInt(valuePromptStr);
            if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 100) {
                conditionValue = parsedValue;
            } else {
                alert("Valor de condição inválido. Usando 50.");
                conditionValue = 50;
            }
        }

        const newItem = {
            id: itemIdStr,
            name: itemName,
            interval: intervalSeconds,
            lastUse: 0,
            enabled: true,
            conditionType: conditionType,
            conditionValue: conditionValue
        };

        config.customItems.push(newItem);
        let logMsg = `Adicionado (Ciclo): ${itemName} (${intervalMinutes} min`;
        if (conditionType !== 'none') {
            logMsg += `, Cond: ${conditionType} < ${conditionValue}`;
        }
        logMsg += `)`;
        logAction(logMsg);
        saveConfig(false, false);
        alert(`"${itemName}" adicionado (ciclo ${intervalMinutes} min${conditionType !== 'none' ? `, se ${conditionType} < ${conditionValue}` : ''}).`);
        populateCompactCustomItemList();
        updateItemButtonsOnItemsPage();
    }

    function addSetCustomItemButtons() { if (!isItemsPage()) return; console.log(`[PM CI Botões] Verificando itens...`); const table = $(SELECTORS.itemListTable); if (!table.length) { console.warn("[PM CI Botões] Tabela N/E."); return; } const itemLinks = table.find(SELECTORS.itemLinkInList); console.log(`[PM CI Botões] Links: ${itemLinks.length}`); itemLinks.each(function () { const link = $(this); const itemName = link.text().trim(); const itemHref = link.attr('href'); const match = itemHref ? itemHref.match(/\/ItemDetails\/(\d+)(?:\/(\d+))?$/) : null; const itemId = match ? String(match[2] || match[1]) : null; if (itemId && itemName && itemName !== "Analgésicos" && itemName !== "Caixa de bombons em formato de coração") { try { let button = link.siblings('.pm-set-custom-item-btn'); const buttonHtml_Add = '<i class="fa-solid fa-wand-magic-sparkles"></i> Usar Auto'; const buttonHtml_Configured = '<i class="fa-solid fa-check"></i> Config.'; if (button.length === 0) { button = $(`<button class="pm-set-custom-item-btn">${buttonHtml_Add}</button>`); button.on('click', { id: itemId, name: itemName }, function (event) { event.preventDefault(); event.stopPropagation(); addOrUpdateCustomItemConfig(event.data.id, event.data.name); }); link.after(button); } const isConfigured = config.customItems.some(i => String(i.id) === itemId); button.removeClass('pm-btn-configured pm-btn-add'); if (isConfigured) { if (button.html() !== buttonHtml_Configured) button.html(buttonHtml_Configured); button.addClass('pm-btn-configured').prop('title', `"${itemName}" config. (ciclo).`); } else { if (button.html() !== buttonHtml_Add) button.html(buttonHtml_Add); button.addClass('pm-btn-add').prop('title', `Adicionar "${itemName}" automação (ciclo).`); } } catch (err) { console.error(`[PM CI Botões] Erro botão ${itemName} (${itemId}):`, err); } } }); console.log("[PM CI Botões] Verificação OK."); }
    function updateItemButtonsOnItemsPage() { if (!isItemsPage()) return; console.log("[PM CI Botões] Atualizando botões..."); $('.pm-set-custom-item-btn').each(function () { const button = $(this); const link = button.prev('a[href*="/ItemDetails/"]'); if (!link.length) return; const itemHref = link.attr('href'); const match = itemHref ? itemHref.match(/\/ItemDetails\/(\d+)(?:\/(\d+))?$/) : null; const itemId = match ? String(match[2] || match[1]) : null; const itemName = link.text().trim(); const buttonHtml_Add = '<i class="fa-solid fa-wand-magic-sparkles"></i> Usar Auto'; const buttonHtml_Configured = '<i class="fa-solid fa-check"></i> Config.'; if (itemId) { const isConfigured = config.customItems.some(i => String(i.id) === itemId); button.removeClass('pm-btn-configured pm-btn-add'); if (isConfigured) { if (button.html() !== buttonHtml_Configured) button.html(buttonHtml_Configured); button.addClass('pm-btn-configured').prop('title', `"${itemName}" config. (ciclo).`); } else { if (button.html() !== buttonHtml_Add) button.html(buttonHtml_Add); button.addClass('pm-btn-add').prop('title', `Adicionar "${itemName}" automação (ciclo).`); } } }); }

    // --- FUNÇÃO DE NOTIFICAÇÃO TELEGRAM ---
    async function sendTelegramNotification(message) {
        if (!config.telegramEnabled || !config.telegramBotToken || !config.telegramUserId) {
            console.log("[PM Telegram] Notificação desativada ou config incompleta.");
            return;
        }
        const token = config.telegramBotToken;
        const chatId = config.telegramUserId;
        const url = `${TELEGRAM_API_BASE}${token}/sendMessage`;

        const data = new FormData();
        data.append('chat_id', chatId);
        data.append('text', message);
        data.append('parse_mode', 'HTML');

        console.log(`[PM Telegram] Enviando: "${message}" para User ID: ${chatId}`);
        logAction(`📢 Tentando enviar Telegram: "${message.substring(0, 30)}..."`);

        try {
            // Usar Fetch API
            const response = await fetch(url, {
                method: "POST",
                body: data
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            
            if (jsonResponse.ok) {
                console.log("[PM Telegram] Mensagem enviada com sucesso!", jsonResponse);
                logAction("📢 Telegram: Mensagem enviada!");
                updateStatus("Telegram: OK!", false);
            } else {
                console.error("[PM Telegram] Erro ao enviar: ", jsonResponse);
                logAction(`📢 Telegram: ERRO ${jsonResponse.description}`);
                updateStatus(`Telegram ERRO: ${jsonResponse.description}`, true);
            }
        } catch (error) {
            console.error("[PM Telegram] Erro de rede/requisição: ", error);
            logAction("📢 Telegram: ERRO de rede.");
            updateStatus("Telegram ERRO: Rede", true);
        }
    }


    // --- LÓGICA PRINCIPAL (runCheck) ---
    async function runCheck() {
        try {
            let regularMonitorAction = sessionStorage.getItem('pmMonitorAction');
            actionInProgress = regularMonitorAction !== null;

            let currentAutoGuid = await getCurrentCharacterGuid();
            const currentAutoUrl = getCharacterPageUrl();
            const currentAutoId = currentAutoUrl ? getCharacterId(currentAutoUrl) : null;

            console.log(`[PM RC] Estado: Regular=${regularMonitorAction}, InProgress=${actionInProgress}, AutoCharID=${currentAutoId}, AutoCharGUID=${currentAutoGuid}, Page=${window.location.pathname}`);

            let currentMonitorAction = null, actionTargetId = null, actionItemId = null;
            if (regularMonitorAction) {
                const parts = regularMonitorAction.split(':'); currentMonitorAction = parts[0];
                if (parts.length > 1) actionTargetId = parts[1]; if (parts.length > 2) actionItemId = String(parts[2]);
                console.log(`[PM State] Ação regular pendente: ${currentMonitorAction}`);
                sessionStorage.removeItem('pmMonitorAction');
            }

            // DETECÇÃO DE LOGOUT
            if (config.enabled && !actionInProgress) {
                if (!isLoginPage() && !isCharacterSelectionPage() &&
                    $(SELECTORS.loginUsernameField).length > 0 && $(SELECTORS.loginPasswordField).length > 0) {
                    if (!telegramLoggedOutNotificationSent) {
                        const charNameForNotif = config.selectedCharacter ? `(${config.selectedCharacter}) ` : '';
                        sendTelegramNotification(`Alerta Popmundo ${charNameForNotif}Kit: Conta deslogada (campos login) em ${window.location.hostname}. Tentando relogar...`);
                        telegramLoggedOutNotificationSent = true;
                    }
                    if (await performAutoLogin()) return;
                    navigateTo(LOGIN_PAGE_PATH, 'Conta deslogada. Redirecionando...');
                    return;
                }
                if (isCharacterPage()) {
                    const itemsLinkExists = $(SELECTORS.itemsLink).length > 0 || $(SELECTORS.sideMenuItemsLink).length > 0;
                    if (!itemsLinkExists) {
                        if (!telegramLoggedOutNotificationSent) {
                            const charNameForNotif = config.selectedCharacter ? `(${config.selectedCharacter}) ` : '';
                            sendTelegramNotification(`Alerta Popmundo ${charNameForNotif}Kit: Conta deslogada (elementos faltando pág. char) em ${window.location.hostname}.`);
                            telegramLoggedOutNotificationSent = true;
                        }
                        navigateTo(LOGIN_PAGE_PATH, 'Conta deslogada. Redirecionando...');
                        return;
                    }
                }
            }

            if (isLoginPage() && !actionInProgress) {
                stopTimers();
                if (await performAutoLogin()) return;
                updateStatus("Aguardando login...");
                telegramLoggedOutNotificationSent = false;
                return;
            }

            if (isCharacterSelectionPage() && !actionInProgress) {
                stopTimers();
                if (await selectCharacter()) return;
                updateStatus("Aguardando seleção...");
                return;
            }

            if (isPopmundoNewsPage() && !actionInProgress) {
                stopTimers();
                navigateTo(BASE_URL_MATCH, "Aguardando página de notícias...");
                updateStatus("Aguardando página de notícias...");
                return;
            }



            const myCharId = currentAutoId;
            const defaultReturnPath = currentAutoUrl;
            if (!defaultReturnPath && config.enabled && !isLoginPage() && !isCharacterSelectionPage()) {
                console.error("[PM RC] ERRO CRÍTICO: Não foi possível determinar URL de retorno!"); updateStatus("ERRO: URL Retorno N/A.", true);
                config.enabled = false; $('#pmMonitorToggle').prop('checked', false); saveConfig(false, false); stopTimers(); return;
            }
            const returnTarget = defaultReturnPath;

            if (!config.enabled) { if (!currentStatus.startsWith("Monitor desativado")) updateStatus("Monitor desativado."); stopTimers(); actionInProgress = false; return; }

            if (isCharacterPage()) {
                if (!actionInProgress) {
                    updateStatus("Verificando status...");
                    const currentHealth = parseStatValue(SELECTORS.healthValue);
                    const currentMood = parseStatValue(SELECTORS.moodValue);
                    $('#pmCurrentHealth').text(currentHealth ?? "Erro").css('color', currentHealth !== null ? (currentHealth < config.minHealth ? 'var(--pm-value-error)' : 'var(--pm-value-ok)') : 'var(--pm-value-error)');
                    $('#pmCurrentMood').text(currentMood ?? "Erro").css('color', currentMood !== null ? (currentMood < config.minMood ? 'var(--pm-value-warning)' : 'var(--pm-value-ok)') : 'var(--pm-value-error)');
                    updateCustomItemsDisplay();
                    telegramLoggedOutNotificationSent = false;

                    if (currentHealth === null || currentMood === null) {
                        updateStatus("ERRO ler Saúde/Humor!", true);
                        scheduleRefresh(returnTarget);
                        return;
                    }

                    if (currentHealth < LOW_STAT_THRESHOLD_FOR_TELEGRAM && !telegramLowHealthNotificationSent) {
                        const charNameForNotif = config.selectedCharacter ? `(${config.selectedCharacter}) ` : '';
                        sendTelegramNotification(`⚠️ Alerta Popmundo ${charNameForNotif}Kit: Saúde CRÍTICA em ${currentHealth}% em ${window.location.hostname}!`);
                        telegramLowHealthNotificationSent = true;
                    } else if (currentHealth >= LOW_STAT_THRESHOLD_FOR_TELEGRAM) {
                        telegramLowHealthNotificationSent = false;
                    }

                    if (currentMood < LOW_STAT_THRESHOLD_FOR_TELEGRAM && !telegramLowMoodNotificationSent) {
                        const charNameForNotif = config.selectedCharacter ? `(${config.selectedCharacter}) ` : '';
                        sendTelegramNotification(`😟 Alerta Popmundo ${charNameForNotif}Kit: Humor CRÍTICO em ${currentMood}% em ${window.location.hostname}!`);
                        telegramLowMoodNotificationSent = true;
                    } else if (currentMood >= LOW_STAT_THRESHOLD_FOR_TELEGRAM) {
                        telegramLowMoodNotificationSent = false;
                    }

                    if (currentHealth < config.minHealth) {
                        stopTimers();
                        actionInProgress = true;
                        let targetUrl, nextRegularState, nextStatus;
                        if (config.healthMethod === 'xp') {
                            targetUrl = `${IMPROVE_URL_PATH}/${myCharId}`;
                            nextRegularState = `goto_improve_health:${myCharId}`;
                            nextStatus = `Recuperando Saúde (${currentHealth}%) com XP...`;
                        } else if (config.healthMethod === 'analgesico') {
                            targetUrl = `${ITEMS_URL_PATH}/${myCharId}`;
                            nextRegularState = `goto_items_painkiller:${myCharId}`;
                            nextStatus = `Recuperando Saúde (${currentHealth}%) com Analgésicos...`;
                        }
                        if (targetUrl) {
                            sessionStorage.setItem('pmMonitorAction', nextRegularState);
                            logAction(`Saúde baixa (${currentHealth}). Indo para ${config.healthMethod}.`);
                            navigateTo(targetUrl, nextStatus);
                        } else {
                            updateStatus("Erro: Método saúde N/D!", true);
                            actionInProgress = false;
                            scheduleRefresh(returnTarget);
                        }
                        return;
                    }

                    if (currentMood < config.minMood) {
                        stopTimers();
                        actionInProgress = true;
                        let targetUrl, nextRegularState, nextStatus;
                        if (config.moodMethod === 'xp') {
                            targetUrl = `${IMPROVE_URL_PATH}/${myCharId}`;
                            nextRegularState = `goto_improve_mood:${myCharId}`;
                            nextStatus = `Recuperando Humor (${currentMood}%) com XP...`;
                        } else if (config.moodMethod === 'chocolates') {
                            targetUrl = `${ITEMS_URL_PATH}/${myCharId}`;
                            nextRegularState = `goto_items_chocolates:${myCharId}`;
                            nextStatus = `Recuperando Humor (${currentMood}%) com Bombons...`;
                        }
                        if (targetUrl) {
                            sessionStorage.setItem('pmMonitorAction', nextRegularState);
                            logAction(`Humor baixo (${currentMood}). Indo para ${config.moodMethod}.`);
                            navigateTo(targetUrl, nextStatus);
                        } else {
                            updateStatus(`ERRO: Método humor N/D ('${config.moodMethod}')!`, true);
                            actionInProgress = false;
                            scheduleRefresh(returnTarget);
                        }
                        return;
                    }

                    const now = getCurrentTime();
                    for (const item of config.customItems) {
                        let conditionSatisfied = false;
                        if (item.enabled && (now - item.lastUse >= item.interval)) {
                            if (item.conditionType === 'none') {
                                conditionSatisfied = true;
                            } else if (item.conditionType === 'health' && currentHealth < item.conditionValue) {
                                conditionSatisfied = true;
                            } else if (item.conditionType === 'mood' && currentMood < item.conditionValue) {
                                conditionSatisfied = true;
                            }
                        }

                        if (conditionSatisfied) {
                            stopTimers();
                            actionInProgress = true;
                            const nextRegularState = `goto_items_custom:${myCharId}:${item.id}`;
                            const nextStatus = `Usando item de ciclo: ${item.name}...`;
                            sessionStorage.setItem('pmMonitorAction', nextRegularState);
                            logAction(`Usando ${item.name} (ciclo, cond. OK).`);
                            navigateTo(`${ITEMS_URL_PATH}/${myCharId}`, nextStatus);
                            return;
                        }
                    }

                    updateStatus("Status OK. Agendando...");
                    scheduleRefresh(returnTarget);

                } else if (actionInProgress && currentMonitorAction && currentMonitorAction.startsWith('returning_after_action')) {
                    const fromPage = sessionStorage.getItem('pmReturningFromPage') || 'ação';
                    updateStatus(`Retornando de ${fromPage}...`);
                    sessionStorage.removeItem('pmReturningFromPage');
                    actionInProgress = false;
                    setTimeout(runCheck, 0);
                    return;
                }
            } else if (currentMonitorAction) {
                actionInProgress = true;
                const targetCharIdForReturn = actionTargetId || myCharId;
                const nextStateReturn = `returning_after_action:${targetCharIdForReturn}`;
                const returnStatus = `Retornando para a página principal...`;
                let clickSuccess = false;

                if (isImprovePage()) {
                    sessionStorage.setItem('pmReturningFromPage', 'Improve');
                    sessionStorage.setItem('pmMonitorAction', nextStateReturn);
                    sessionStorage.setItem(STATUS_PERSIST_KEY, returnStatus);
                    if (currentMonitorAction === 'goto_improve_health') { await clickElement(SELECTORS.improveHealthButton, "botão Saúde"); }
                    else if (currentMonitorAction === 'goto_improve_mood') { await clickElement(SELECTORS.improveMoodButton, "botão Humor"); }
                    else { navigateTo(returnTarget, returnStatus); }
                    return;
                }
                else if (isItemsPage()) {
                    sessionStorage.setItem('pmReturningFromPage', 'Items');
                    let nextRegularStateOnClick = null;
                    let itemLinkSelector = null;
                    let itemName = '';

                    if (currentMonitorAction === 'goto_items_painkiller') {
                        nextRegularStateOnClick = `goto_painkiller_details:${actionTargetId}`;
                        itemLinkSelector = SELECTORS.painkillerLink;
                        itemName = analgesicsItemName;
                    } else if (currentMonitorAction === 'goto_items_chocolates') {
                        nextRegularStateOnClick = `goto_chocolates_details:${actionTargetId}`;
                        itemLinkSelector = SELECTORS.chocolatesLink;
                        itemName = caixaBombonsItemName;
                    } else if (currentMonitorAction === 'goto_items_custom' && actionItemId) {
                        const targetItem = config.customItems.find(i => String(i.id) === actionItemId);
                        if (targetItem) {
                            nextRegularStateOnClick = `goto_custom_item_details:${actionTargetId}:${actionItemId}`;
                            itemLinkSelector = `table.data td:nth-child(2) a[href*="/ItemDetails/"][href$="/${actionItemId}"]`;
                            itemName = targetItem.name;
                        }
                    }

                    if (itemLinkSelector && itemName) {
                        sessionStorage.setItem(STATUS_PERSIST_KEY, `Usando ${itemName}...`);
                        clickSuccess = await clickElement(itemLinkSelector, `link ${itemName}`);
                        if (clickSuccess) {
                            sessionStorage.setItem('pmMonitorAction', nextRegularStateOnClick);
                        } else {
                            logAction(`${itemName} N/E.`);
                            navigateTo(returnTarget, returnStatus);
                        }
                    } else {
                        navigateTo(returnTarget, returnStatus);
                    }
                    return;
                }
                else if (isItemDetailsPage()) {
                    sessionStorage.setItem('pmReturningFromPage', 'ItemDetails');
                    sessionStorage.setItem('pmMonitorAction', nextStateReturn);
                    sessionStorage.setItem(STATUS_PERSIST_KEY, returnStatus);

                    if (currentMonitorAction === 'goto_chocolates_details') {
                        if (await clickElement(SELECTORS.useItemButton, "botão Usar (Bombons)")) {
                            await clickElement(SELECTORS.confirmYesButton, "botão Sim");
                        }
                    } else if (currentMonitorAction === 'goto_custom_item_details' && actionItemId) {
                        if (await clickElement(SELECTORS.useItemButton, `botão Usar`)) {
                            recordCustomItemUse(actionItemId);
                        }
                    } else {
                        await clickElement(SELECTORS.useItemButton, "botão Usar");
                    }
                    return;
                }
                else {
                    navigateTo(returnTarget, returnStatus);
                    return;
                }
            } else {
                if (returnTarget && window.location.pathname !== returnTarget && !actionInProgress) {
                    navigateTo(returnTarget, 'Retornando para a página principal...');
                } else if (returnTarget && window.location.pathname === returnTarget && !actionInProgress) {
                    scheduleRefresh(returnTarget);
                }
                return;
            }
        } catch (e) {
            console.error("[PM] ERRO CRÍTICO runCheck:", e);
            updateStatus("ERRO CRÍTICO! Console.", true);
            stopTimers();
            config.enabled = false;
            $('#pmMonitorToggle').prop('checked', false);
            saveConfig(false, false);
            alert("Erro crítico. Desativado.");
            sessionStorage.removeItem('pmMonitorAction');
            sessionStorage.removeItem(STATUS_PERSIST_KEY);
            actionInProgress = false;
        } finally {
            updateCustomItemsDisplay();
            updateCountdownDisplay();
        }
    }


    // --- Agendamento ---
    function scheduleRefresh(charUrlPath) {
        stopTimers();
        const currentUrl = charUrlPath || getCharacterPageUrl();

        if (!config.enabled || actionInProgress || !currentUrl || !getCharacterId(currentUrl)) {
            return;
        }
        const intervalSeconds = Math.max(30, config.refreshInterval);
        const intervalMs = intervalSeconds * 1000;
        nextRefreshTimestamp = Date.now() + intervalMs;
        updateCountdownDisplay();
        countdownIntervalId = setInterval(updateCountdownDisplay, 1000);
        refreshTimerId = setTimeout(async () => {
            if (countdownIntervalId) clearInterval(countdownIntervalId);
            if (refreshTimerId) clearTimeout(refreshTimerId);

            if (config.enabled && !sessionStorage.getItem('pmMonitorAction')) {
                navigateTo(currentUrl, 'Verificando status...');
            }
        }, intervalMs);
    }


    // --- Interface ---
    function createControlPanel() {
        try {
            if (!document.body) {
                console.log("[PM] Body não carregado, aguardando...");
                setTimeout(createControlPanel, 200);
                return;
            }

            console.log("[PM] Iniciando criação do painel...");
            $('#pmMonitorPanel').remove();

            const moodOptions = [
                { value: 'xp', text: 'XP' },
                { value: 'chocolates', text: 'Caixa de Bombons' }
            ];
            const moodOptionsHtml = moodOptions.map(opt => `<option value="${opt.value}" ${config.moodMethod === opt.value ? 'selected' : ''}>${opt.text}</option>`).join('');

            const panelHTML = `
            <div id="pmMonitorPanel">
                <h4>🧚 Scodelario's Monitor 🧚‍♀️ </h4>
                <div class="pm-tabs">
                    <button class="pm-tab-button active" data-tab="status"><i class="fa-solid fa-heartbeat"></i> Status</button>
                    <button class="pm-tab-button" data-tab="config"><i class="fa-solid fa-sliders"></i> Config</button>
                    <button class="pm-tab-button" data-tab="items"><i class="fa-solid fa-box-archive"></i> Itens</button>
                    <button class="pm-tab-button" data-tab="telegram"><i class="fa-solid fa-paper-plane"></i> Telegr.</button>
                    <button class="pm-tab-button" data-tab="login"><i class="fa-solid fa-key"></i> Login</button>
                </div>
                <div class="pm-tab-content-wrapper">
                    <div class="pm-tab-content active" id="pm-tab-status">
                         <label class="pm-toggle-label"><input type="checkbox" id="pmMonitorToggle" ${config.enabled ? 'checked' : ''}><span class="pm-toggle-switch"></span><span class="pm-toggle-label-text">Monitor Principal</span></label>
                         <div style="margin-top: 8px;"><label for="pmLanguageSelect"><i class="fa-solid fa-language"></i> Idioma do jogo:</label><select id="pmLanguageSelect"><option value="pt" ${currentLanguage === 'pt' ? 'selected' : ''}>🇧🇷 Português</option><option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option></select></div>
                         <div class="pm-stat-display"><span><i class="fa-solid fa-heart-pulse"></i> Saúde:</span><span id="pmCurrentHealth" class="pm-value">--</span></div>
                         <div class="pm-stat-display"><span><i class="fa-solid fa-face-smile"></i> Humor:</span><span id="pmCurrentMood" class="pm-value">--</span></div>
                         <div class="pm-stat-display"><span><i class="fa-solid fa-gears"></i> Item Ciclo:</span><span id="pmCustomItemStatus" class="pm-value">--</span></div>
                         <div id="pmMonitorStatus" class="pm-status-box">${currentStatus}</div>
                         <div class="pm-log-header"><div><i class="fa-solid fa-clipboard-list"></i> Log:</div><button id="pmClearLogButton" class="pm-clear-button" title="Limpar"><i class="fa-solid fa-broom"></i> Limpar</button></div>
                         <div id="pmActionLog"></div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-config">
                        <div><label for="pmMinHealth"><i class="fa-solid fa-heart-circle-bolt"></i> Saúde Mín:</label><input type="number" id="pmMinHealth" min="1" max="100" value="${config.minHealth}"></div>
                        <div><label for="pmHealthMethod"><i class="fa-solid fa-briefcase-medical"></i> Recuperar Saúde:</label><select id="pmHealthMethod"><option value="xp" ${config.healthMethod === 'xp' ? 'selected' : ''}>XP</option><option value="analgesico" ${config.healthMethod === 'analgesico' ? 'selected' : ''}>Analgésicos</option></select></div>
                        <div class="pm-separator"></div>
                        <div><label for="pmMinMood"><i class="fa-solid fa-face-grin-beam"></i> Humor Mín:</label><input type="number" id="pmMinMood" min="1" max="100" value="${config.minMood}"></div>
                        <div><label for="pmMoodMethod"><i class="fa-solid fa-wand-sparkles"></i> Recuperar Humor:</label><select id="pmMoodMethod">${moodOptionsHtml}</select></div>
                        <div class="pm-separator"></div>
                        <div><label for="pmRefreshInterval"><i class="fa-solid fa-stopwatch"></i> Intervalo Verif. (s):</label><input type="number" id="pmRefreshInterval" min="30" value="${config.refreshInterval}"></div>
                        <div class="pm-text-info">(Mín: 30s)</div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-items">
                        <div style="font-weight:bold;margin-bottom:8px;"><i class="fa-solid fa-boxes-stacked"></i> Itens Personalizados:</div>
                        <div id="pmCompactCustomItemList" class="pm-compact-custom-item-list-container"></div>
                        <div class="pm-text-info" style="margin-top: 8px;"><i class="fa-solid fa-circle-info"></i> Use 'Usar Auto' na pág. de itens.</div>
                        <div class="pm-separator"></div>
                        <div style="font-weight:bold;margin-bottom:6px;"><i class="fa-solid fa-pills"></i> Analgésicos:</div>
                        <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
                            <label class="pm-toggle-label" style="margin:0;">
                                <input type="checkbox" id="pmAnalgesicsMonitorToggle" ${analgesicsMonitorEnabled ? 'checked' : ''}>
                                <span class="pm-toggle-switch"></span>
                                <span class="pm-toggle-label-text">Ativar Monitor</span>
                            </label>
                            <label class="pm-toggle-label" style="margin:0; opacity:${analgesicsMonitorEnabled ? '1' : '0.5'};" id="pmAnalgesicsWebhookToggleWrapper">
                                <input type="checkbox" id="pmAnalgesicsWebhookToggle" ${analgesicsWebhookEnabled ? 'checked' : ''} ${!analgesicsMonitorEnabled ? 'disabled' : ''}>
                                <span class="pm-toggle-switch"></span>
                                <span class="pm-toggle-label-text">Enviar Webhooks</span>
                            </label>
                        </div>
                        <div id="pmAnalgesicsMonitor"></div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-telegram">
                        <div class="pm-text-info" style="margin-bottom: 8px;"><i class="fa-solid fa-bell"></i> Notificações via Telegram:</div>
                        <label class="pm-toggle-label"><input type="checkbox" id="pmTelegramEnabledToggle" ${config.telegramEnabled ? 'checked' : ''}><span class="pm-toggle-switch"></span><span class="pm-toggle-label-text">Ativar Notificações</span></label>
                        <div class="pm-separator"></div>
                        <div><label for="pmTelegramUserId"><i class="fa-solid fa-user-tag"></i> Telegram User/Chat ID:</label><input type="text" id="pmTelegramUserId" value="${config.telegramUserId || ''}" placeholder="Seu ID numérico do Telegram"></div>
                        <div class="pm-text-info"><i class="fa-solid fa-circle-info"></i> Fale com @userinfobot.</div>
                        <div style="margin-top:8px;"><label for="pmTelegramBotToken"><i class="fa-solid fa-robot"></i> Token do Bot Telegram:</label><input type="text" id="pmTelegramBotToken" value="${config.telegramBotToken || ''}" placeholder="Token do seu bot (ex: 123456:ABC-DEF...)"></div>
                        <div class="pm-text-info"><i class="fa-solid fa-circle-info"></i> Crie um bot com @BotFather no Telegram.</div>
                        <div class="pm-separator"></div>
                        <button id="pmTestTelegramButton" class="pm-small-button" style="width:100%; margin-top:5px;"><i class="fa-solid fa-paper-plane"></i> Testar Notificação</button>
                        <div class="pm-text-info" style="margin-top: 8px;">
                            <i class="fa-solid fa-triangle-exclamation"></i> Notificações atuais: <br>
                            - Saúde ou Humor < ${LOW_STAT_THRESHOLD_FOR_TELEGRAM}%<br>
                        </div>
                    </div>
                    <div class="pm-tab-content" id="pm-tab-login">
                        <div class="pm-text-info"><i class="fa-solid fa-shield-halved"></i> Credenciais de Auto-Login:</div>
                        <div><label for="pmUsername"><i class="fa-solid fa-user"></i> Usuário:</label><input type="text" id="pmUsername" value="${config.username || ''}" autocomplete="username" placeholder="Descarte a opção em computadores públicos"></div>
                        <div><label for="pmPassword"><i class="fa-solid fa-key"></i> Senha:</label><input type="password" id="pmPassword" placeholder="Necessária para o login automático" autocomplete="new-password"></div>
                        <div class="pm-text-info pm-warning-text"><i class="fa-solid fa-triangle-exclamation"></i>A senha vai ficar salva localmente.</div>
                        <div class="pm-separator"></div>
                        <div><label for="pmCharName"><i class="fa-solid fa-id-card"></i> Primeiro Nome do Personagem:</label><input type="text" id="pmCharName" value="${config.selectedCharacter || ''}" placeholder="Para selecionar o personagem correto"></div>
                    </div>
                </div>
                <button id="pmSaveConfig" class="pm-save-button"><i class="fa-solid fa-save"></i> Salvar Configurações</button>

            </div>`;

            console.log("[PM] Adicionando painel ao DOM...");
            $('body').append(panelHTML);

            const panelElement = $('#pmMonitorPanel');
            if (!panelElement.length) {
                console.error("[PM] ERRO: Painel não foi criado!");
                return;
            }

            console.log("[PM] Painel criado, configurando posição...");
            let initialPositionSet = false;
            try {
                const savedPosition = GM_getValue(PANEL_POSITION_KEY, null);
                if (savedPosition && savedPosition.top && savedPosition.left && savedPosition.left !== 'auto') {
                    panelElement.css({ top: savedPosition.top, left: savedPosition.left, right: 'auto' });
                    initialPositionSet = true;
                    console.log("[PM] Posição restaurada:", savedPosition);
                } else {
                    panelElement.css({ top: '10px', right: '10px', left: 'auto' });
                    initialPositionSet = true;
                    console.log("[PM] Usando posição padrão");
                }
            } catch (loadErr) {
                console.error("[PM Drag] Erro carregar pos:", loadErr);
                panelElement.css({ top: '10px', right: '10px', left: 'auto' });
                initialPositionSet = true;
            }

            console.log("[PM] Exibindo painel...");
            panelElement.fadeIn(200);

            console.log("[PM] Populando listas...");
            populateCompactCustomItemList();
            updateActionLogDisplay();
            updateStatus(currentStatus);

            console.log("[PM] Configurando event handlers...");

            $('.pm-tab-button').on('click', function () {
                const tabId = $(this).data('tab');
                $('.pm-tab-button').removeClass('active');
                $('.pm-tab-content').removeClass('active');
                $(this).addClass('active');
                $('#pm-tab-' + tabId).addClass('active');
            });

            $('#pmMonitorToggle').on('change', function () {
                const isEnabled = $(this).prop('checked');
                config.enabled = isEnabled;
                logAction(`Monitor ${isEnabled ? 'ativado' : 'desativado'}`);
                const currentFullConfig = GM_getValue(CONFIG_KEY, {});
                currentFullConfig.enabled = isEnabled;
                GM_setValue(CONFIG_KEY, currentFullConfig);

                if (isEnabled) {
                    if (!isLoginPage() && !isCharacterSelectionPage() && !actionInProgress) {
                        stopTimers();
                        setTimeout(runCheck, 0);
                    }
                } else {
                    stopTimers();
                    updateStatus("Monitor desativado.");
                    $('#pmCurrentHealth').text('--');
                    $('#pmCurrentMood').text('--');
                }
            });

            $('#pmLanguageSelect').on('change', function () {
                const newLang = $(this).val();
                if (newLang === 'pt' || newLang === 'en') {
                    GM_setValue(LANGUAGE_KEY, newLang);
                    currentLanguage = newLang;
                    logAction(`🌐 Idioma alterado para ${newLang === 'pt' ? 'Português' : 'English'}.`);
                    //reload the page
                    window.location.reload();
                }
            });

            $('#pmTelegramEnabledToggle').on('change', function () { config.telegramEnabled = $(this).prop('checked'); logAction(`📢 Notificações Telegram ${config.telegramEnabled ? 'ativadas' : 'desativadas'}.`); });

            // Event handlers para switches de analgésicos
            $('#pmAnalgesicsMonitorToggle').on('change', function () {
                const isEnabled = $(this).prop('checked');
                analgesicsMonitorEnabled = isEnabled;
                GM_setValue("pmAnalgesicsMonitorEnabled", isEnabled);

                // Atualizar estado do switch de webhook
                const webhookToggle = $('#pmAnalgesicsWebhookToggle');
                const webhookWrapper = $('#pmAnalgesicsWebhookToggleWrapper');

                if (isEnabled) {
                    webhookToggle.prop('disabled', false);
                    webhookWrapper.css('opacity', '1');
                } else {
                    webhookToggle.prop('disabled', true).prop('checked', false);
                    webhookWrapper.css('opacity', '0.5');
                    analgesicsWebhookEnabled = false;
                    GM_setValue("pmAnalgesicsWebhookEnabled", false);
                }

                logAction(`💊 Monitor Analgésicos ${isEnabled ? 'ativado' : 'desativado'}.`);

                // Iniciar/parar monitoramento
                if (isEnabled) {
                    startAnalgesicsMonitoring();
                } else {
                    stopAnalgesicsMonitoring();
                }
            });

            $('#pmAnalgesicsWebhookToggle').on('change', function () {
                const isEnabled = $(this).prop('checked');
                analgesicsWebhookEnabled = isEnabled;
                GM_setValue("pmAnalgesicsWebhookEnabled", isEnabled);
                logAction(`💊 Webhooks Analgésicos ${isEnabled ? 'ativados' : 'desativados'}.`);
            });

            $('#pmTestTelegramButton').on('click', async function () {
                const userId = $('#pmTelegramUserId').val();
                const botToken = $('#pmTelegramBotToken').val();
                if (!userId || !botToken) { alert("Por favor, preencha o User ID e o Token do Bot Telegram antes de testar."); return; }
                const tempConfig = { ...config };
                config.telegramUserId = userId; config.telegramBotToken = botToken; config.telegramEnabled = true;
                await sendTelegramNotification("👋 Seu Popmundo Survival Kit está enviando uma notificação de teste!");
                config = tempConfig;
            });

            $('#pmSaveConfig').on('click', function () {
                config.refreshInterval = Math.max(30, parseInt($('#pmRefreshInterval').val()) || DEFAULT_CONFIG.refreshInterval);
                config.minHealth = Math.min(100, Math.max(1, parseInt($('#pmMinHealth').val()) || DEFAULT_CONFIG.minHealth));
                config.minMood = Math.min(100, Math.max(1, parseInt($('#pmMinMood').val()) || DEFAULT_CONFIG.minMood));
                config.healthMethod = $('#pmHealthMethod').val() || DEFAULT_CONFIG.healthMethod;
                config.moodMethod = $(SELECTORS.pmMoodMethodDropdown).val() || DEFAULT_CONFIG.moodMethod;
                config.telegramUserId = $('#pmTelegramUserId').val() || '';
                config.telegramBotToken = $('#pmTelegramBotToken').val() || '';
                config.telegramEnabled = $('#pmTelegramEnabledToggle').prop('checked');
                saveConfig(true, true);
            });

            $('#pmClearLogButton').on('click', clearActionLog);

            // Função para resetar posição do painel
            function resetPanelPosition() {
                panelElement.css({ top: '10px', right: '10px', left: 'auto' });
                try { GM_setValue(PANEL_POSITION_KEY, { top: '10px', left: 'auto' }); } catch (e) { console.error("[PM] Erro resetar pos:", e); }
            }

            // Configurar drag do painel
            const handle = panelElement.find('h4');
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            // Resetar posição com duplo clique no cabeçalho
            handle.on('dblclick', function (e) {
                e.preventDefault();
                resetPanelPosition();
            });

            // Eventos de drag
            handle.on('mousedown', function (e) {
                if (e.target !== this) return;
                isDragging = true;
                panelElement.addClass('pm-dragging');
                const panelOffset = panelElement.offset();

                if (!initialPositionSet && panelElement.css('right') !== 'auto' && panelElement.css('left') === 'auto') {
                    const currentRight = parseFloat(panelElement.css('right'));
                    const panelWidth = panelElement.outerWidth();
                    const windowWidth = $(window).width();
                    const initialLeft = windowWidth - panelWidth - currentRight;
                    panelElement.css({ left: initialLeft + 'px', right: 'auto' });
                    panelOffset.left = initialLeft;
                }
                initialPositionSet = true;
                dragOffset.x = e.pageX - panelOffset.left;
                dragOffset.y = e.pageY - panelOffset.top;
                e.preventDefault();
            });

            $(document).on('mousemove.pmDrag', function (e) {
                if (!isDragging) return;
                let newLeft = e.pageX - dragOffset.x;
                let newTop = e.pageY - dragOffset.y;
                const winW = $(window).width();
                const winH = $(window).height();
                const panelW = panelElement.outerWidth();
                const panelH = panelElement.outerHeight();
                newLeft = Math.max(0, Math.min(newLeft, winW - panelW));
                newTop = Math.max(0, Math.min(newTop, winH - panelH));
                panelElement.css({ top: newTop + 'px', left: newLeft + 'px', right: 'auto' });
            });

            $(document).on('mouseup.pmDrag', function () {
                if (isDragging) {
                    isDragging = false;
                    panelElement.removeClass('pm-dragging');
                    try {
                        const currentTop = panelElement.css('top');
                        const currentLeft = panelElement.css('left');
                        GM_setValue(PANEL_POSITION_KEY, { top: currentTop, left: currentLeft });
                    } catch (saveErr) {
                        console.error("[PM Drag] Erro salvar pos:", saveErr);
                    }
                }
            });

            console.log("[PM] Painel criado com sucesso!");
        } catch (e) {
            console.error("[PM] ERRO CRÍTICO criar painel:", e);
            console.error("[PM] Stack trace:", e.stack);
            alert("Erro fatal criar painel: " + e.message);
        }
    }

    // --- ESTILO CSS ---
    GM_addStyle(`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    :root {
        --pm-font-family: 'Roboto', 'Segoe UI', sans-serif;
        --pm-bg-color: #ffeef8;
        --pm-text-color: #8b2252;
        --pm-text-color-secondary: #c44569;
        --pm-border-color: #f8bbd9;
        --pm-subtle-bg: #fff5fc;
        --pm-input-bg: #ffffff;
        --pm-input-border: #f8bbd9;
        --pm-input-text: var(--pm-text-color);
        --pm-button-bg: linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4);
        --pm-button-hover-bg: linear-gradient(135deg, #ff1493, #ff69b4, #ff1493);
        --pm-button-text: #ffffff;
        --pm-tab-inactive-bg: transparent;
        --pm-tab-active-bg: #ffb6c1;
        --pm-tab-hover-bg: #ffc0cb;
        --pm-accent-color: #ff69b4;
        --pm-shadow-color: rgba(255, 105, 180, 0.3);
        --pm-success-color: #ff69b4;
        --pm-error-color: #ff1493;
        --pm-warning-color: #ffb6c1;
        --pm-info-color: #ff69b4;
        --pm-special-color: #da70d6;
        --pm-delete-color: #ff1493;
        --pm-delete-hover-color: #ff69b4;
        --pm-log-bg: #fff0f5;
        --pm-item-list-bg: #fff5f8;
        --pm-item-bg: #ffffff;
        --pm-item-border: #ffb6c1;
        --pm-item-hover-bg: #fff0f5;
        --pm-item-hover-border: #ff69b4;
        --pm-item-ready-color: #ff1493;
        --pm-item-cooldown-color: #ff69b4;
        --pm-item-disabled-color: #c44569;
        --pm-item-disabled-opacity: 0.6;
        --pm-value-ok: #8b2252;
        --pm-value-success: #ff1493;
        --pm-value-error: #ff1493;
        --pm-value-warning: #ffb6c1;
        --pm-value-accent: #ff69b4;
        --pm-value-secondary: #c44569;
        --pm-telegram-color: #ff69b4;
    }
    #pmMonitorPanel {
        position: fixed; top: 10px; right: 10px;
        background: linear-gradient(135deg, #ffeef8, #fff5fc, #ffeef8);
        border: 2px solid var(--pm-border-color);
        padding: 0; z-index: 10001; width: 300px;
        font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color);
        box-shadow: 0 8px 25px var(--pm-shadow-color), 0 0 20px rgba(255, 105, 180, 0.2);
        border-radius: 15px;
        overflow: hidden; display: none;
    }
    #pmMonitorPanel::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
        animation: glitter 3s infinite;
        pointer-events: none;
        z-index: 1;
    }
    @keyframes glitter {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    #pmMonitorPanel i.fas, #pmMonitorPanel i.far, #pmMonitorPanel i.fa-brands, #pmMonitorPanel i.fa-regular, #pmMonitorPanel i.fa-solid {
        margin-right: 5px; width: 1.1em; text-align: center; vertical-align: middle;
        display: inline-block; font-style: normal; font-variant: normal; text-rendering: auto;
        -webkit-font-smoothing: antialiased; font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
    }
    #pmMonitorPanel i.fas, #pmMonitorPanel i.fa-solid { font-weight: 900; }
    #pmMonitorPanel i.far, #pmMonitorPanel i.fa-regular { font-weight: 400; }
    #pmMonitorPanel i.fa-brands { font-weight: 400; }

    #pmMonitorPanel h4 i.fa-solid { margin-right: 8px; color: var(--pm-accent-color); }
    .pm-tab-button i.fa-solid, .pm-tab-button i.fa-brands { margin-right: 4px; }
    .pm-stat-display span:first-child i.fa-solid { color: var(--pm-text-color-secondary); }
    button#pmSaveConfig i.fa-solid { margin-right: 6px; }
    #pmMonitorPanel label:not(.pm-toggle-label) i.fa-solid { color: var(--pm-text-color-secondary); width: 1.2em; }
    .pm-text-info i.fa-solid { margin-right: 4px; color: var(--pm-text-color-secondary); }
    button.pm-set-custom-item-btn i.fa-solid { margin-right: 4px; }
    #pmMonitorPanel h4 {
        margin: 0; padding: 12px 15px; text-align: center;
        font-size: 15px; font-weight: 700; 
        background: linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4);
        color: #ffffff; border-bottom: 2px solid #ff1493;
        border-radius: 13px 13px 0 0; display: flex; align-items: center; justify-content: center;
        cursor: move; user-select: none;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
        position: relative;
        z-index: 2;
    }
    #pmMonitorPanel h4::after {
        position: absolute;
        right: 10px;
        animation: sparkle 2s infinite;
    }
    #pmMonitorPanel h4::before {
        content: '⋮⋮';
        position: absolute;
        left: 10px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        cursor: move;
    }
    @keyframes sparkle {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    #pmMonitorPanel h4 span {
        font-size: 9px; color: var(--pm-text-color-secondary);
        margin-left: 5px; font-weight: 400;
    }
    .pm-tabs { display: flex; background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); }
    .pm-tab-button {
        flex: 1; padding: 10px 6px; border: none; background: var(--pm-tab-inactive-bg);
        color: var(--pm-text-color-secondary); cursor: pointer; font-size: 11px; font-weight: 700;
        transition: all 0.3s ease; text-align: center; border-bottom: 3px solid transparent;
        margin-bottom: -1px; border-top-left-radius: 6px; border-top-right-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        position: relative;
    }
    .pm-tab-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .pm-tab-button:hover { 
        background: linear-gradient(135deg, var(--pm-tab-hover-bg), #ffc0cb); 
        color: var(--pm-text-color); 
        transform: translateY(-1px);
    }
    .pm-tab-button:hover::before {
        opacity: 1;
    }
    .pm-tab-button.active { 
        color: #ffffff; 
        border-bottom-color: #ff1493; 
        background: linear-gradient(135deg, #ff69b4, #ff1493);
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
    }
    .pm-tab-button[data-tab="telegram"].active { 
        color: #ffffff; 
        border-bottom-color: #ff69b4; 
        background: linear-gradient(135deg, #ff69b4, #ff1493);
    }
    .pm-tab-content-wrapper {
        padding: 10px; max-height: 550px; overflow-y: auto; overflow-x: hidden;
        scrollbar-width: thin; scrollbar-color: var(--pm-text-color-secondary) var(--pm-subtle-bg);
    }
    .pm-tab-content { display: none; animation: pmFadeIn 0.5s ease; }
    .pm-tab-content.active { display: block; }
    @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
    #pmMonitorPanel div[id^="pm-tab-"] > div:not(.pm-compact-custom-item-list-container):not(#pmActionLog):not(.pm-stat-display):not(#pmMonitorStatus):not(.pm-status-box):not(.pm-log-header):not([style*='text-align: center']):not([style*='border: 1px dashed']) {
        margin-bottom: 8px;
    }
    #pmMonitorPanel div[style*='border: 1px dashed'] > div {
        margin-bottom: 6px;
    }
    #pmMonitorPanel label:not(.pm-toggle-label) {
        font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 3px;
        display: block; font-weight: 600;
    }
    .pm-separator { height: 1px; background: var(--pm-border-color); margin: 10px 0; opacity: 0.7; }
    .pm-text-info { font-size: 10px; color: var(--pm-text-color-secondary); margin-top: 2px; line-height: 1.3; display: flex; align-items: flex-start; }
    .pm-text-info br { margin-bottom: 3px; display: block; content: "";}
    .pm-text-info.pm-warning-text { color: var(--pm-warning-color); font-weight: bold; }
    #pmMonitorPanel label.pm-toggle-label {
        display: flex; align-items: center; font-size: 12px; margin-bottom: 8px;
        cursor: pointer; color: var(--pm-text-color); position: relative; user-select: none;
    }
    .pm-toggle-label input[type="checkbox"] { opacity: 0; width: 0; height: 0; position: absolute; }
    .pm-toggle-switch {
        position: relative; display: inline-block; flex-shrink: 0; width: 40px; height: 20px;
        background: linear-gradient(135deg, var(--pm-border-color), #ffc0cb); 
        border-radius: 10px; transition: all 0.3s ease;
        cursor: pointer; margin-right: 8px; vertical-align: middle; 
        border: 2px solid rgba(255, 105, 180, 0.3);
        box-shadow: 0 2px 6px rgba(255, 105, 180, 0.2);
    }
    .pm-toggle-switch::before {
        content: ""; position: absolute; width: 14px; height: 14px; border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #fff5fc); 
        top: 1px; left: 1px; transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch { 
        background: linear-gradient(135deg, #ff69b4, #ff1493); 
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.4);
    }
    .pm-toggle-label input[type="checkbox"]:checked + .pm-toggle-switch::before { 
        transform: translateX(20px); 
        background: linear-gradient(135deg, #ffffff, #fff0f5);
        box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3);
    }
    .pm-toggle-label-text { vertical-align: middle; line-height: 18px; }
    .pm-stat-display {
        display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; margin: 3px 0;
        background: linear-gradient(135deg, #fff5fc, #ffeef8); 
        border: 2px solid var(--pm-border-color); border-left: 4px solid var(--pm-border-color);
        border-radius: 8px; transition: all 0.3s ease; flex-wrap: nowrap; gap: 5px;
        box-shadow: 0 2px 6px rgba(255, 105, 180, 0.1);
    }
    .pm-stat-display:hover { 
        border-left-color: var(--pm-accent-color); 
        background: linear-gradient(135deg, #fff0f5, #ffeef8); 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);
    }
    .pm-stat-display span:first-child { color: var(--pm-text-color-secondary); font-size: 10px; margin-right: 5px; display: flex; align-items: center; flex-shrink: 0; }
    .pm-stat-display .pm-value { font-weight: 700; font-size: 12px; text-align: right; display: flex; align-items: center; flex-grow: 1; justify-content: flex-end; }
    #pmCurrentHealth, #pmCurrentMood, #pmCustomItemStatus { min-width: 50px; text-align: right; }
    #pmCurrentHealth { color: var(--pm-value-ok); }
    #pmCurrentHealth[style*="--pm-value-error"] { color: var(--pm-value-error); }
    #pmCurrentMood { color: var(--pm-value-ok); }
    #pmCurrentMood[style*="--pm-value-warning"] { color: var(--pm-value-warning); }
    #pmCustomItemStatus { color: var(--pm-value-secondary); }
    #pmCustomItemStatus[style*="--pm-value-success"] { color: var(--pm-value-success); }
    #pmCustomItemStatus[style*="--pm-value-accent"] { color: var(--pm-value-accent); }
    #pmCustomItemStatus[style*="--pm-value-warning"] { color: var(--pm-value-warning); }
    #pmMonitorPanel input[type="text"], #pmMonitorPanel input[type="password"], #pmMonitorPanel input[type="number"], #pmMonitorPanel select, #pmMonitorPanel textarea {
        width: 100%; padding: 8px 12px; border: 2px solid var(--pm-input-border);
        background: linear-gradient(135deg, #ffffff, #fff5fc); 
        color: var(--pm-input-text); border-radius: 8px;
        transition: all 0.3s ease; font-size: 12px; box-sizing: border-box;
        font-family: var(--pm-font-family); margin-top: 2px;
        box-shadow: 0 2px 6px rgba(255, 105, 180, 0.1);
    }
    #pmMonitorPanel select:disabled, #pmMonitorPanel input:disabled, #pmMonitorPanel textarea:disabled, .pm-input-disabled {
        background-color: color-mix(in srgb, var(--pm-input-bg) 70%, var(--pm-border-color)) !important;
        cursor: not-allowed; opacity: 0.7; border-color: color-mix(in srgb, var(--pm-input-border) 70%, var(--pm-bg-color));
    }
    #pmMonitorPanel textarea { resize: vertical; min-height: 50px; line-height: 1.4; margin-bottom: 8px;}
    #pmMonitorPanel input:focus, #pmMonitorPanel select:focus, #pmMonitorPanel textarea:focus {
        border-color: var(--pm-accent-color); 
        box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3), 0 4px 12px rgba(255, 105, 180, 0.2);
        outline: none; 
        background: linear-gradient(135deg, #ffffff, #fff0f5);
        transform: translateY(-1px);
    }
    #pmMonitorPanel button.pm-save-button {
        width: 100%; padding: 10px 15px; margin: 10px 0 0; 
        background: linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4);
        color: #ffffff; border: none; border-radius: 8px; font-weight: 700; font-size: 13px;
        cursor: pointer; transition: all 0.3s ease; 
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4), 0 0 10px rgba(255, 20, 147, 0.2);
        letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        position: relative;
        overflow: hidden;
    }
    #pmMonitorPanel button.pm-save-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
    }
    #pmMonitorPanel button.pm-save-button:hover { 
        background: linear-gradient(135deg, #ff1493, #ff69b4, #ff1493); 
        transform: translateY(-2px); 
        box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6), 0 0 15px rgba(255, 20, 147, 0.4);
    }
    #pmMonitorPanel button.pm-save-button:hover::before {
        left: 100%;
    }
    #pmMonitorPanel button.pm-small-button, #pmMonitorPanel button.pm-clear-button {
        background: linear-gradient(135deg, #fff5fc, #ffeef8); 
        border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary);
        font-size: 11px; padding: 6px 12px; border-radius: 6px; cursor: pointer;
        transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center;
        font-weight: 600; width: auto; 
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
        position: relative;
        overflow: hidden;
    }
    #pmMonitorPanel button.pm-small-button::before, #pmMonitorPanel button.pm-clear-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
        transition: left 0.3s;
    }
    #pmMonitorPanel button.pm-small-button i.fa-solid, #pmMonitorPanel button.pm-clear-button i.fa-solid,
    #pmMonitorPanel button.pm-small-button i.fa-brands, #pmMonitorPanel button.pm-small-button i.fa-solid.fa-paper-plane {
        margin-right: 6px; color: var(--pm-text-color-secondary); transition: color 0.2s ease;
    }
    #pmMonitorPanel button.pm-small-button:hover { 
        background: linear-gradient(135deg, #ffb6c1, #ffc0cb); 
        border-color: var(--pm-accent-color); 
        color: var(--pm-accent-color); 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
    }
    #pmMonitorPanel button.pm-small-button:hover::before, #pmMonitorPanel button.pm-clear-button:hover::before {
        left: 100%;
    }
    #pmMonitorPanel button.pm-small-button:hover i.fa-solid, #pmMonitorPanel button.pm-small-button:hover i.fa-brands,
    #pmMonitorPanel button.pm-small-button:hover i.fa-solid.fa-paper-plane { color: var(--pm-accent-color); }
    #pmMonitorPanel button#pmClearLogButton:hover { background: color-mix(in srgb, var(--pm-error-color) 10%, transparent); border-color: var(--pm-error-color); color: var(--pm-error-color); }
    #pmMonitorPanel button#pmClearLogButton:hover i.fa-solid { color: var(--pm-error-color); }
    #pmMonitorPanel button.pm-small-button:disabled, #pmMonitorPanel button.pm-clear-button:disabled {
        background: none; border-color: var(--pm-border-color); color: var(--pm-text-color-secondary);
        opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none;
    }
    #pmMonitorPanel button.pm-small-button:disabled i.fa-solid, #pmMonitorPanel button.pm-clear-button:disabled i.fa-solid,
    #pmMonitorPanel button.pm-small-button:disabled i.fa-brands, #pmMonitorPanel button.pm-small-button:disabled i.fa-solid.fa-paper-plane { color: var(--pm-text-color-secondary); }
    .pm-status-box {
        font-size: 11px; padding: 8px 12px; margin-top: 8px; 
        background: linear-gradient(135deg, #fff5fc, #ffeef8);
        border: 2px solid var(--pm-border-color); border-left: 4px solid var(--pm-border-color);
        border-radius: 8px; transition: all 0.3s ease; word-break: break-word; text-align: center;
        color: var(--pm-text-color-secondary); display: flex; align-items: center; justify-content: center;
        min-height: 1.3em; box-sizing: content-box;
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.15);
    }
    .pm-status-box i.fa-solid { margin-right: 6px; }
    .pm-status-box.pm-status-normal { 
        border-left-color: var(--pm-border-color); 
        color: var(--pm-text-color-secondary); 
    }
    .pm-status-box.pm-status-success { 
        background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 20, 147, 0.1)); 
        border-left-color: var(--pm-success-color); 
        color: var(--pm-success-color);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
    }
    .pm-status-box.pm-status-error { 
        background: linear-gradient(135deg, rgba(255, 20, 147, 0.2), rgba(255, 105, 180, 0.1)); 
        border-left-color: var(--pm-error-color); 
        color: var(--pm-error-color);
        box-shadow: 0 2px 8px rgba(255, 20, 147, 0.3);
    }
    .pm-status-box.pm-status-accent { 
        border-left-color: var(--pm-accent-color); 
        color: var(--pm-accent-color);
        background: linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 20, 147, 0.05));
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.25);
    }
    .pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; margin-bottom: 3px; }
    .pm-log-header > div { font-size: 10px; color: var(--pm-text-color-secondary); }
    .pm-log-header i.fa-solid { margin-right: 4px; }
    #pmActionLog {
        font-size: 10px; max-height: 120px; overflow-y: auto; padding: 8px 12px;
        background: linear-gradient(135deg, #fff0f5, #fff5f8); 
        border: 2px solid var(--pm-border-color); border-radius: 8px;
        margin-top: 4px; color: var(--pm-text-color-secondary); scrollbar-width: thin;
        scrollbar-color: var(--pm-text-color-secondary) var(--pm-log-bg);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
    }
    #pmActionLog .pm-log-entry {
        margin-bottom: 3px; padding-bottom: 3px; border-bottom: 1px dashed var(--pm-border-color);
        animation: logFadeIn 0.5s ease forwards; word-break: break-word; opacity:0; line-height: 1.3;
        display: flex; align-items: center;
    }
    #pmActionLog .pm-log-entry:last-child { border-bottom: none; }
    .pm-log-entry i.pm-log-success { color: var(--pm-success-color); }
    .pm-log-entry i.pm-log-error { color: var(--pm-error-color); }
    .pm-log-entry i.pm-log-warning { color: var(--pm-warning-color); }
    .pm-log-entry i.pm-log-info { color: var(--pm-info-color); }
    .pm-log-entry i.pm-log-accent { color: var(--pm-accent-color); }
    .pm-log-entry i.pm-log-special { color: var(--pm-special-color); }
    .pm-log-entry i.pm-log-secondary { color: var(--pm-text-color-secondary); }
    .pm-log-entry i.pm-log-telegram, .pm-log-entry i.fa-paper-plane.pm-log-telegram { color: var(--pm-telegram-color); }
    .pm-log-empty { text-align: center; padding: 8px; color: var(--pm-text-color-secondary); font-style: italic; font-size: 10px; }
    .pm-log-empty-icon { display: block; margin-bottom: 4px; font-size: 18px; color: var(--pm-border-color); }
    @keyframes logFadeIn { to { opacity: 1; } }
    #pmCompactCustomItemList {
        display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto;
        padding: 8px; border: 2px solid var(--pm-border-color); border-radius: 8px;
        background: linear-gradient(135deg, #fff5f8, #fff0f5); 
        margin-bottom: 6px; scrollbar-width: thin;
        scrollbar-color: var(--pm-text-color-secondary) var(--pm-item-list-bg);
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
    }
    .pm-compact-item {
        display: flex; flex-direction: column; align-items: stretch; padding: 8px 12px;
        background: linear-gradient(135deg, #ffffff, #fff5fc); 
        border: 1px solid var(--pm-item-border); border-radius: 8px;
        font-size: 11px; transition: all 0.3s ease;
        gap: 4px; 
        box-shadow: 0 2px 8px rgba(255, 105, 180, 0.15);
        position: relative;
        overflow: hidden;
    }
    .pm-compact-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
    }
    .pm-compact-item:hover { 
        background: linear-gradient(135deg, #fff0f5, #ffeef8); 
        border-color: var(--pm-item-hover-border); 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.25);
    }
    .pm-compact-item:hover::before {
        left: 100%;
    }
    .pm-compact-item-row-1 { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .pm-compact-item-row-1 .pm-compact-item-name {
        color: var(--pm-text-color); flex-grow: 1; overflow: hidden; text-overflow: ellipsis;
        white-space: nowrap; margin-right: 0; display: flex; align-items: center;
        font-weight: 600; font-size: 11px;
    }
    .pm-compact-item-row-1 .pm-compact-item-status {
        font-weight: bold; font-size: 10px; flex-shrink: 0; text-align: right;
        margin-right: 0; display: flex; align-items: center;
    }
    .pm-compact-item-row-1 .pm-compact-item-status i.fa-solid { font-size: 9px; }
    .pm-compact-item.pm-item-ready .pm-compact-item-status { color: var(--pm-item-ready-color); }
    .pm-compact-item.pm-item-ready .pm-compact-item-icon { color: var(--pm-item-ready-color); }
    .pm-compact-item.pm-item-cooldown .pm-compact-item-status { color: var(--pm-item-cooldown-color); }
    .pm-compact-item.pm-item-cooldown .pm-compact-item-icon { color: var(--pm-text-color); }
    .pm-compact-item.pm-item-disabled { opacity: var(--pm-item-disabled-opacity); }
    .pm-compact-item.pm-item-disabled .pm-compact-item-name { color: var(--pm-item-disabled-color); font-style: italic; font-weight: normal; }
    .pm-compact-item.pm-item-disabled .pm-compact-item-status { color: var(--pm-item-disabled-color); font-style: italic; }
    .pm-compact-item.pm-item-disabled .pm-compact-item-icon { color: var(--pm-item-disabled-color); }
    .pm-compact-item.pm-item-waiting-condition .pm-compact-item-status { color: var(--pm-value-warning); }
    .pm-compact-item.pm-item-waiting-condition .pm-compact-item-icon { color: var(--pm-value-warning); }
    .pm-compact-item-empty { font-size: 10px; color: var(--pm-text-color-secondary); font-style: italic; padding: 10px 8px; text-align: center; }
    .pm-compact-item-empty i { display: block; margin-bottom: 4px; color: var(--pm-border-color); }
    .pm-compact-item-delete {
        background: none; border: none; color: var(--pm-delete-color); font-size: 13px;
        font-weight: bold; line-height: 1; padding: 1px 4px; margin-left: 0; cursor: pointer;
        flex-shrink: 0; border-radius: 3px; transition: color 0.2s ease, background-color 0.2s ease;
        opacity: 0.7;
    }
    .pm-compact-item-delete:hover { color: var(--pm-delete-hover-color); background-color: color-mix(in srgb, var(--pm-error-color) 10%, transparent); opacity: 1;}
    button.pm-set-custom-item-btn {
        margin-left: 8px !important; padding: 4px 8px !important; font-size: 9px !important;
        cursor: pointer !important; vertical-align: middle !important; border: 1px solid transparent !important;
        border-radius: 6px !important; 
        box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3) !important; 
        transition: all 0.3s ease !important;
        opacity: 0.9; display: inline-flex !important; align-items: center !important;
        position: relative !important;
        overflow: hidden !important;
    }
    button.pm-set-custom-item-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.3s;
    }
    button.pm-set-custom-item-btn:hover { 
        filter: brightness(1.1); 
        opacity: 1; 
        transform: translateY(-1px);
    }
    button.pm-set-custom-item-btn:hover::before {
        left: 100%;
    }
    button.pm-set-custom-item-btn.pm-btn-add { 
        background: linear-gradient(135deg, #ff69b4, #ff1493) !important; 
        color: #ffffff !important; 
        text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
    }
    button.pm-set-custom-item-btn.pm-btn-configured { 
        background: linear-gradient(135deg, #ff1493, #ff69b4) !important; 
        color: #ffffff !important; 
        border-color: transparent !important; 
        box-shadow: 0 2px 8px rgba(255, 20, 147, 0.4) !important; 
    }
    #pmMonitorPanel.pm-dragging { opacity: 0.85; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); user-select: none; -webkit-user-select: none; -ms-user-select: none; }
    .pm-signature {
        padding: 6px 12px; text-align: center; font-size: 10px; color: var(--pm-text-color-secondary);
        background-color: var(--pm-bg-color); margin-top: 8px;
    }
`);

    // --- INICIALIZAÇÃO ---
    function init() {
        try {
            let persistedStatus = sessionStorage.getItem(STATUS_PERSIST_KEY);
            if (persistedStatus) {
                currentStatus = persistedStatus;
                sessionStorage.removeItem(STATUS_PERSIST_KEY);
            } else {
                currentStatus = "Inicializando...";
            }

            loadConfig();
            actionInProgress = sessionStorage.getItem('pmMonitorAction') !== null;

            const lastVersionRun = GM_getValue(SCRIPT_UPDATE_LOG_KEY, '0.0.0');
            if (scriptVersion !== lastVersionRun) {
                logAction(`🎉 Atualizado para v${scriptVersion}!`);
                GM_setValue(SCRIPT_UPDATE_LOG_KEY, scriptVersion);
            }

            createControlPanel();

            if (isItemsPage()) {
                addSetCustomItemButtons();
            }

            // Inicializar monitoramento de analgésicos se habilitado
            initAnalgesicsMonitoring();

            if (config.enabled) {
                stopTimers();
                setTimeout(runCheck, 0);
            } else {
                if (currentStatus === "Inicializando...") {
                    updateStatus("Monitor desativado.");
                }
                updateCustomItemsDisplay();
                stopTimers();
            }
        } catch (e) {
            console.error("[PM] ERRO CRÍTICO init:", e);
            alert("Erro fatal inicialização.");
            try { let cfg = GM_getValue(CONFIG_KEY, {}); cfg.enabled = false; GM_setValue(CONFIG_KEY, cfg); } catch (se) { }
            sessionStorage.removeItem('pmMonitorAction');
            actionInProgress = false;
            updateStatus("ERRO FATAL init!", true);
            stopTimers();
        }
    }

    // --- Ponto de Entrada ---
    setTimeout(init, 0); // Inicia o mais rápido possível
    console.log(`[PM v${scriptVersion}] Script carregado.`);

    // --- MONITORAMENTO DE ANALGÉSICOS ---
    let analgesicsMonitorInterval = null;
    let analgesicsTelegramWebhookInterval = null;
    let analgesicsTotalCount = 0;
    let analgesicsWebhookActive = false;

    let analgesicsData = {
        items: [],
        lastCount: 0,
        webhookStartTime: null
    };

    function parseAnalgesicsFromHTML(htmlContent) {
        try {
            // Criar um elemento temporário para fazer parse do HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            const rows = tempDiv.querySelectorAll('tr[id*="repItems_ctl"]');

            let totalAnalgesics = 0;
            let analgesicsBreakdown = [];

            rows.forEach(row => {
                const link = row.querySelector('a[href*="/ItemDetails/"]');
                const itemName = link ? link.textContent.trim() : '';

                if (itemName === analgesicsItemName) {
                    const emTag = row.querySelector('em');
                    let quantity = 1;
                    if (emTag) {
                        const qtyMatch = emTag.textContent.match(/x(\d+)/);
                        quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
                    }

                    // Procurar por todos os tds na linha para encontrar o correto
                    const allTds = row.querySelectorAll('td');
                    let targetTd = null;
                    let targetText = '';
                    
                    // Procurar o td que contém o link e o texto "uses left"
                    for (let td of allTds) {
                        const tdText = td.textContent || '';
                        if (tdText.includes(usesLeftText)) {
                            targetTd = td;
                            targetText = tdText;
                            break;
                        }
                    }
                    
                    if (!targetTd) {
                        console.log(`[PM Analgesics Debug] td com '${usesLeftText}' não encontrado`);
                        // Tentar o td.middle como fallback
                        targetTd = row.querySelector('td.middle');
                        targetText = targetTd ? targetTd.textContent : '';
                    }
                    
                    console.log(`[PM Analgesics Debug] TD encontrado: ${targetTd ? 'sim' : 'não'}`);
                    console.log(`[PM Analgesics Debug] Texto do TD: "${targetText.replace(/\s+/g, ' ').trim()}"`);
                    
                    // Procurar por "X uses left." ou "X use left."
                    const usosMatch = targetText.match(/(\d+)\s+uses?\s+left\.?/);
                    const usosRestantes = usosMatch ? parseInt(usosMatch[1]) : 0;
                    
                    console.log(`[PM Analgesics Debug] Match: ${usosMatch ? usosMatch[1] : 'null'} | ${usesLeftText}: ${usosRestantes}`);

                    totalAnalgesics += quantity;
                    analgesicsBreakdown.push({
                        quantity: quantity,
                        usosRestantes: usosRestantes,
                        itemId: row.querySelector('input[type="hidden"]')?.value
                    });
                }
            });

            return {
                total: totalAnalgesics,
                breakdown: analgesicsBreakdown,
                timestamp: new Date().toLocaleTimeString('pt-BR')
            };
        } catch (e) {
            console.error('[PM Analgesics] Erro parser HTML:', e);
            return null;
        }
    }

    async function fetchAnalgesicsData() {
        try {
            const now = Date.now();
            if (analgesicsRequestInProgress || (now - lastAnalgesicsRequestTime) < ANALGESICS_REQUEST_COOLDOWN) {
                return null;
            }

            analgesicsRequestInProgress = true;
            lastAnalgesicsRequestTime = now;

            // Obter o ID do personagem atual
            const currentUrl = getCharacterPageUrl();
            const characterId = getCharacterId(currentUrl);

            if (!characterId) {
                console.warn('[PM Analgesics] ID do personagem não encontrado');
                analgesicsRequestInProgress = false;
                return null;
            }

            // Construir URL da requisição
            const subdomainNumber = window.location.hostname.split('.')[0];
            const itemsUrl = `https://${subdomainNumber}.popmundo.com/World/Popmundo.aspx/Character/Items/${characterId}`;

            console.log(`[PM Analgesics] Fazendo requisição para: ${itemsUrl}`);

            try {
                // Usar Fetch API
                const response = await fetch(itemsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Referer': currentUrl,
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'same-origin',
                        'Upgrade-Insecure-Requests': '1'
                    }
                });

                if (response.ok) {
                    const htmlText = await response.text();
                    const data = parseAnalgesicsFromHTML(htmlText);
                    console.log(`[PM Analgesics] Dados obtidos: ${data ? data.total : 'null'} analgésicos`);
                    return data;
                } else {
                    console.error(`[PM Analgesics] Erro HTTP: ${response.status}`);
                    return null;
                }
            } catch (error) {
                console.error('[PM Analgesics] Erro requisição:', error);
                return null;
            } finally {
                analgesicsRequestInProgress = false;
            }
        } catch (e) {
            console.error('[PM Analgesics] Erro geral fetch:', e);
            analgesicsRequestInProgress = false;
            return null;
        }
    }

    async function sendAnalgesicsWebhook(checkInMessage = false, data) {
        if (!config.telegramEnabled || !config.telegramBotToken || !config.telegramUserId) {
            return;
        }
        let message = '';
        if (checkInMessage) {
            message = `📍 <b>Check-in Analgésicos</b>\n`;
            message += `⏰ ${data.timestamp}\n`;
            message += `💊 Total: <b>${data.total}</b> analgésicos\n\n`;

            data.breakdown.forEach((item, idx) => {
                message += `${idx + 1}. x${item.quantity} | ${item.usosRestantes} usos\n`;
            });
        } else {
            message = `⚠️ <b>ALERTA!</b> Analgésicos atingiram ${data.total}!\n`;
            message += `📍 Localização: Página de Itens\n`;
            message += `⏰ ${data.timestamp}\n`;
            message += `💊 Detalhes:\n\n`;

            data.breakdown.forEach((item, idx) => {
                message += `${idx + 1}. <b>x${item.quantity}</b> | ${item.usosRestantes} usos restantes\n`;
            });
        }

        try {
            const token = config.telegramBotToken;
            const chatId = config.telegramUserId;
            const url = `${TELEGRAM_API_BASE}${token}/sendMessage`;

            // Usar Fetch API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `chat_id=${encodeURIComponent(chatId)}&text=${encodeURIComponent(message)}&parse_mode=HTML`
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.ok) {
                    console.log('[PM Analgesics] Webhook enviado com sucesso!');
                    logAction("📢 Telegram: Webhook analgésicos enviado!");
                } else {
                    console.error('[PM Analgesics] Erro Telegram:', jsonResponse.description);
                    logAction(`📢 Telegram: ERRO ${jsonResponse.description}`);
                }
            } else {
                console.error('[PM Analgesics] Erro HTTP:', response.status);
                logAction(`📢 Telegram: ERRO HTTP ${response.status}`);
            }
        } catch (e) {
            console.error('[PM Analgesics] Erro enviar webhook:', e);
            logAction("📢 Telegram: ERRO geral");
        }
    }

    function updateAnalgesicsDisplay(data) {
        const displayEl = $('#pmAnalgesicsMonitor');
        if (!displayEl.length) return;

        if (!analgesicsMonitorEnabled) {
            displayEl.html('<div style="text-align: center; color: #c44569; font-size: 11px; padding: 8px;">💊 Monitor desativado</div>');
            return;
        }

        if (!data) {
            displayEl.html('<div style="text-align: center; color: #c44569; font-size: 11px; padding: 8px;">💊 Carregando dados...</div>');
            return;
        }

        let html = `<div style="border: 1px solid #f8bbd9; padding: 8px; border-radius: 6px; margin-top: 8px; background: linear-gradient(135deg, #fff5fc, #ffeef8);">`;
        html += `<div style="font-weight: bold; color: #8b2252; margin-bottom: 6px;">💊 Monitoramento de Analgésicos</div>`;
        html += `<div style="font-size: 13px; color: ${data.total < 6 ? '#ff1493' : '#c44569'}; font-weight: bold;">Total: ${data.total}</div>`;

        if (data.breakdown.length > 0) {
            html += `<div style="font-size: 10px; color: #c44569; margin-top: 6px;">`;
            data.breakdown.forEach(item => {
                const color = data.total < 6 ? '#ff1493' : '#8b2252';
                html += `<div style="margin: 2px 0; color: ${color};">x${item.quantity} | ${item.usosRestantes} usos</div>`;
            });
            html += `</div>`;
        }

        if (analgesicsWebhookActive && analgesicsWebhookEnabled) {
            html += `<div style="margin-top: 6px; padding: 4px; background: #ff1493; color: white; border-radius: 3px; font-size: 9px; text-align: center; animation: blink 1s infinite;">🔴 WEBHOOK ATIVO (< 6)</div>`;
        } else if (analgesicsWebhookActive && !analgesicsWebhookEnabled) {
            html += `<div style="margin-top: 6px; padding: 4px; background: #ffb6c1; color: #8b2252; border-radius: 3px; font-size: 9px; text-align: center;">⚠️ WEBHOOK DESABILITADO</div>`;
        }

        html += `</div>`;
        displayEl.html(html);
    }

    function stopAnalgesicsWebhookOnInteraction() {
        $(document).on('click', function () {
            if (analgesicsWebhookActive) {
                console.log('[PM Analgesics] Webhooks parados por interação do usuário');
                analgesicsWebhookActive = false;
                if (analgesicsTelegramWebhookInterval) {
                    clearInterval(analgesicsTelegramWebhookInterval);
                    analgesicsTelegramWebhookInterval = null;
                }
            }
        });
    };

    function startAnalgesicsMonitoring() {
        if (analgesicsMonitorInterval) {
            clearInterval(analgesicsMonitorInterval);
        }

        console.log('[PM Analgesics] Iniciando monitoramento separado (30s)...');

        analgesicsMonitorInterval = setInterval(async () => {
            if (!analgesicsMonitorEnabled) {
                return;
            }

            const data = await fetchAnalgesicsData();

            if (data) {
                analgesicsTotalCount = data.total;
                analgesicsData = data;

                console.log(`[PM Analgesics] Total: ${data.total} analgésicos`);

                // Enviar webhook se total < 6 e webhook habilitado
                console.log(data.total, analgesicsWebhookEnabled, analgesicsWebhookActive);
                if (data.total < 6 && analgesicsWebhookEnabled) {
                    console.log('[PM Analgesics] ALERTA! Menos de 6 analgésicos detectados!');
                    analgesicsWebhookActive = true;
                    analgesicsData.webhookStartTime = new Date();

                    await sendAnalgesicsWebhook(false, data);
                }

                // Parar webhooks se total >= 6
                if (data.total >= 6 && analgesicsWebhookActive) {
                    console.log('[PM Analgesics] Analgésicos >= 6, parando webhooks');
                    analgesicsWebhookActive = false;
                    if (analgesicsTelegramWebhookInterval) {
                        clearInterval(analgesicsTelegramWebhookInterval);
                        analgesicsTelegramWebhookInterval = null;
                    }
                }

                updateAnalgesicsDisplay(data);
            }
        }, ANALGESICS_MONITOR_INTERVAL);

    }

    function stopAnalgesicsMonitoring() {
        console.log('[PM Analgesics] Parando monitoramento...');

        if (analgesicsMonitorInterval) {
            clearInterval(analgesicsMonitorInterval);
            analgesicsMonitorInterval = null;
        }

        if (analgesicsTelegramWebhookInterval) {
            clearInterval(analgesicsTelegramWebhookInterval);
            analgesicsTelegramWebhookInterval = null;
        }

        analgesicsWebhookActive = false;
        analgesicsRequestInProgress = false;

        // Limpar display
        const displayEl = $('#pmAnalgesicsMonitor');
        if (displayEl.length) {
            displayEl.html('<div style="text-align: center; color: #c44569; font-size: 11px; padding: 8px;">💊 Monitor desativado</div>');
        }
    }

    function initAnalgesicsMonitoring() {
        // Esta função agora só inicializa se o monitor estiver habilitado
        if (analgesicsMonitorEnabled) {
            startAnalgesicsMonitoring();
        }
    }

})();