// ==UserScript==
// @name Dashboard Monitor Popmundo Pro
// @namespace http://tampermonkey.net/
// @version 10.31
// @description XXX
// @author Popper & Pupila
// @match https://*.popmundo.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect *.popmundo.com
// @connect api.telegram.org
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/551543/Dashboard%20Monitor%20Popmundo%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/551543/Dashboard%20Monitor%20Popmundo%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIÁVEIS DE CONTROLE E CHAVES DE ARMAZENAMENTO ---
    const BASE_URL = window.location.protocol + '//' + window.location.hostname + '/World/Popmundo.aspx/Character/';
    const FOCUS_URL = `${window.location.protocol}//${window.location.hostname}/World/Popmundo.aspx/Character/Focus/`;
    const NOTIFICATIONS_URL = `${window.location.protocol}//${window.location.hostname}/World/Popmundo.aspx/Character/Notifications/`;
    const DIARY_URL = `${window.location.protocol}//${window.location.hostname}/World/Popmundo.aspx/Character/Diary/`;
    const INVITE_URL = `${window.location.protocol}//${window.location.hostname}/World/Popmundo.aspx/Character/Invitations/`;

    const UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos
    const TIMEOUT_MS = 20000; // 20 segundos para cada requisição

    // --- DELAY DE SEGURANÇA ---
    const MIN_PAUSE_PER_CHAR = 3000; // 3 segundos
    const MAX_PAUSE_PER_CHAR = 5000; // 5 segundos

    // Chaves de Armazenamento Greasemonkey
    const GM_KEY_CHARS = 'pmMonitChars_v10';
    const GM_KEY_REMINDER = 'pmReminder_v10_';
    const GM_KEY_THEME = 'pmMonitorTheme_v10';
    const GM_KEY_LAST_UPDATE = 'pmMonitorLastUpdate_v10';
    const GM_KEY_NOTIFIED_INVITES = 'pmNotifiedInvites_v10';
    const GM_KEY_TELEGRAM_TOKEN = 'pmTelegramToken_v10';
    const GM_KEY_TELEGRAM_CHATID = 'pmTelegramChatId_v10';
    const GM_KEY_TELEGRAM_ENABLED = 'pmTelegramEnabled_v10';

    const LS_REDIRECT_KEY = 'ppmFocusRedirect';

    let processing = false;
    let telegramConfig = { token: '', chatId: '', enabled: false };
    let theme = GM_getValue(GM_KEY_THEME, "light");

    const colors = {
        light: { background:"#f4f6f9", headerBg:"#3b4a5c", headerColor:"#fff", buttonAdd:"#494949", buttonRefresh:"#3b4a5c", rowBg:"#fff", rowBorder:"#eee", messageHighlight:"#fffbe6", textColor:"#000", sickColor:"#dc3545", inviteColor:"#0056b3" },
        dark: { background:"#1e1e1e", headerBg:"#2a2a2a", headerColor:"#f0f0f0", buttonAdd:"#555", buttonRefresh:"#444", rowBg:"#2b2b2b", rowBorder:"#3a3a3a", messageHighlight:"#1e6d75", textColor:"#fff", sickColor:"#f77676", inviteColor:"#58a6ff" }
    };
    const c = colors[theme];

    // --- ESTRUTURA HTML E CSS DO DASHBOARD ---
    const monitorDiv = document.createElement("div");
    monitorDiv.id = "pmProMonitor";
    monitorDiv.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:${c.background}; color:${c.textColor}; z-index:99999; overflow:auto; display:none; font-family: Segoe UI, sans-serif;`;
    monitorDiv.innerHTML = `
<style>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
    #pmProMonitor .pm-button { padding:10px 15px; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size: 14px; }
    #pmProMonitor .pm-input { flex:1; padding:10px; border-radius:8px; border:1px solid ${c.rowBorder}; font-size:14px; background:${theme==='dark'?'#333':'#fff'}; color:${theme==='dark'?'#eee':'#000'}; }
    #pmProMonitor table a { color: inherit; text-decoration: none; }
    #pmProMonitor table a:hover { text-decoration: underline; }
    #pmProMonitor .action-btn { background: transparent; border: 1px solid #888; color: inherit; padding: 5px 9px; border-radius: 5px; cursor: pointer; margin: 2px; font-size: 12px; line-height: 1; }
    #pmProMonitor .action-btn:hover { background: #888; color: #fff; }
    #pmProMonitor .action-btn.primary { background: ${c.buttonRefresh}; color: #fff; border-color: ${c.buttonRefresh}; font-weight: bold; padding: 5px 10px; }
    #pmProMonitor .action-btn.primary:hover { opacity: 0.9; }
    #pmProMonitor .action-btn i { margin-right: 5px; }
    #pmProMonitor .config-panel { display:none; background: ${theme === 'dark' ? '#252525' : '#f0f0f0'}; padding: 20px; border-radius: 8px; margin-top: 15px; border: 1px solid ${c.rowBorder}; }
    #pmProMonitor .config-panel label { display: block; margin-top: 10px; font-weight: bold; }
    #pmProMonitor .config-panel input[type="text"], #pmProMonitor .config-panel textarea { width: 100%; padding: 8px; border: 1px solid ${c.rowBorder}; background: ${c.rowBg}; color: ${c.textColor}; border-radius: 4px; box-sizing: border-box; margin-top: 5px; }
    #pmProMonitor thead th i { margin-right: 8px; }
</style>
<header style="background:${c.headerBg}; color:${c.headerColor}; padding:15px 25px; font-size:20px; font-weight:bold;">
    📊 Dashboard Monitor Pro
    <button id="closeMonitor" style="float:right; background:#86323a; border:none; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer;">Fechar</button>
</header>
<div style="padding:20px; max-width:1400px; margin:auto;">
    <div class="controls" style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
        <input type="text" id="charIdInput" placeholder="Digite o(s) ID(s) do(s) personagem(ns), separados por vírgula..." class="pm-input">
        <button id="addCharBtn" class="pm-button" style="background:${c.buttonAdd}; color:#fff;">Adicionar</button>
        <button id="refreshCharsBtn" class="pm-button" style="background:${c.buttonRefresh}; color:#fff;">Atualizar Agora</button>
        <button id="configBtn" class="pm-button" style="background:#6c757d; color:#fff;">⚙️ Configurações</button>
        <button id="themeToggleBtn" class="pm-button" style="background:#666; color:#fff;">${theme==='dark'?'🌞 Light':'🌙 Dark'}</button>
    </div>
    <div id="monitorStatus" style="font-size:14px; color:#888;"></div>
    <div id="lastUpdate" style="margin-bottom:10px; font-size:12px; color:#aaa;">Última atualização: -</div>
    <div id="loadingBar" style="display:none; height:5px; background:${c.headerBg}; margin-bottom:10px; transition:width 0.2s;"></div>

    <div id="configPanel" class="config-panel">
        <h4>Configurações do Monitor</h4>
        <label for="pmTelegramEnabled">Ativar Notificações do Telegram:</label>
        <input type="checkbox" id="pmTelegramEnabled" style="margin-top:5px;">
        <label for="pmTelegramToken">Token do Bot (do @BotFather):</label>
        <input type="text" id="pmTelegramToken" placeholder="123456:ABC-DEF...">
        <label for="pmTelegramChatId">Seu Chat ID/User ID:</label>
        <input type="text" id="pmTelegramChatId" placeholder="Ex: 123456789">
        <p style="font-size: 11px; color: #aaa; margin-top:5px;">Para descobrir seu ID, envie /start para o bot @userinfobot no Telegram.</p>
        <button id="saveConfigBtn" class="pm-button" style="background:${c.buttonRefresh}; color:#fff; width:100%; margin-top:20px;">Salvar Configurações</button>
    </div>

    <table id="charMonitorTable" style="width:100%; border-collapse:collapse; background:${c.rowBg}; box-shadow:0 2px 5px rgba(0,0,0,0.1); border-radius:8px; overflow:hidden; margin-top: 10px;">
        <thead style="background:${c.headerBg}; color:${c.headerColor};">
            <tr>
                <th style="padding:12px;"><i class="fa-solid fa-image"></i>Foto</th>
                <th style="padding:12px;"><i class="fa-solid fa-user"></i>Nome</th>
                <th style="padding:12px;"><i class="fa-solid fa-cake-candles"></i>Idade</th>
                <th style="padding:12px;"><i class="fa-solid fa-heart-pulse"></i>Saúde/Humor</th>
                <th style="padding:12px;"><i class="fa-solid fa-user-tag"></i>Estado</th>
                <th style="padding:12px;"><i class="fa-solid fa-briefcase"></i>Carreira/Tempo</th>
                <th style="padding:12px;"><i class="fa-solid fa-city"></i>Cidade</th>
                <th style="padding:12px;"><i class="fa-solid fa-sack-dollar"></i>Dinheiro/💎</th>
                <th style="padding:12px;"><i class="fa-solid fa-envelope"></i>Msg</th>
                <th style="padding:12px;"><i class="fa-solid fa-bell"></i>Convites</th>
                <th style="padding:12px; width: 180px;"><i class="fa-solid fa-gears"></i>Ações</th>
            </tr>
        </thead>
        <tbody id="charTableBody"></tbody>
    </table>
</div>`;
    document.body.appendChild(monitorDiv);

    // --- BOTÕES DE CONTROLE PRINCIPAL ---
    const openBtn = document.createElement("button");
    openBtn.innerText = "📊 Monitor";
    openBtn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:99998; background:#2d89ef; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;";
    document.body.appendChild(openBtn);

    openBtn.onclick = () => { monitorDiv.style.display = "block"; };
    monitorDiv.querySelector("#closeMonitor").onclick = () => { monitorDiv.style.display = "none"; };
    monitorDiv.querySelector("#themeToggleBtn").onclick = () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        GM_setValue(GM_KEY_THEME, theme);
        location.reload();
    };
    monitorDiv.querySelector("#refreshCharsBtn").onclick = () => startMonitoring(true);
    monitorDiv.querySelector("#configBtn").onclick = () => {
        const panel = monitorDiv.querySelector("#configPanel");
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    };

    // --- FUNÇÕES AUXILIARES E DE CONFIGURAÇÃO ---
    const getEl = (id) => monitorDiv.querySelector(id);

    function loadTelegramConfig() {
        telegramConfig.token = GM_getValue(GM_KEY_TELEGRAM_TOKEN, '');
        telegramConfig.chatId = GM_getValue(GM_KEY_TELEGRAM_CHATID, '');
        telegramConfig.enabled = GM_getValue(GM_KEY_TELEGRAM_ENABLED, false);
    }

    function saveTelegramConfig(token, chatId, enabled) {
        GM_setValue(GM_KEY_TELEGRAM_TOKEN, token);
        GM_setValue(GM_KEY_TELEGRAM_CHATID, chatId);
        GM_setValue(GM_KEY_TELEGRAM_ENABLED, enabled);
        loadTelegramConfig();
    }

    function cleanName(name) { return name ? name.replace(/\(.+\)/, '').replace(/\s+/g, ' ').trim() : ''; }
    function getDynamicDropdown() { return document.querySelector(`[id$="${'ddlCurrentCharacter'}"]`); }
    function getDynamicButtonName() { const btn = document.querySelector(`[name$="${'btnChangeCharacter'}"]`); return btn ? btn.name : null; }
    function loadMonitoredCharacters() { return JSON.parse(GM_getValue(GM_KEY_CHARS, '[]')); }
    function saveMonitoredCharacters(chars) { GM_setValue(GM_KEY_CHARS, JSON.stringify(chars)); }
    function getReminder(charId) { return GM_getValue(GM_KEY_REMINDER + charId, ''); }
    function setReminder(charId, text) { GM_setValue(GM_KEY_REMINDER + charId, text.trim()); }

    function updateStatus(msg, isErr = false) {
        const el = getEl('#monitorStatus');
        if (el) { el.innerHTML = msg; el.style.color = isErr ? c.sickColor : '#888'; }
    }

    function setLoading(active, progress = 0) {
        const el = getEl('#loadingBar');
        if (el) { el.style.display = active ? "block" : "none"; el.style.width = `${progress}%`; }
    }

    function updateLastUpdateTimeDisplay() {
        const ts = GM_getValue(GM_KEY_LAST_UPDATE, 0);
        const el = getEl('#lastUpdate');
        if (ts === 0) { el.innerText = 'Última atualização: Nunca'; return; }
        const date = new Date(ts);
        const formatted = date.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
        el.innerText = `Última atualização: ${formatted}`;
    }

    // --- LÓGICA DE NOTIFICAÇÃO E TROCA DE PERSONAGEM ---
    function sendTelegramNotification(message) {
        if (!telegramConfig.enabled || !telegramConfig.token || !telegramConfig.chatId) return;
        const url = `https://api.telegram.org/bot${telegramConfig.token}/sendMessage`;
        const params = { chat_id: telegramConfig.chatId, text: message, parse_mode: 'HTML' };
        const queryString = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
        GM_xmlhttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: queryString,
                           onload: res => console.log(res.status === 200 ? "Notificação Telegram enviada." : `Erro Telegram: ${res.responseText}`),
                           onerror: err => console.error("Erro de rede Telegram:", err)
                         });
    }

    function handlePostBackRedirect() {
        if (localStorage.getItem(LS_REDIRECT_KEY) === 'FocusRedirect') {
            localStorage.removeItem(LS_REDIRECT_KEY);
            const currentId = window.location.pathname.match(/\/Character\/(\d+)\//)?.[1] || document.querySelector('.idHolder')?.textContent.trim();
            if (currentId) setTimeout(() => { window.location.href = FOCUS_URL + currentId; }, 100);
        }
    }

    function changeCharacterByName(characterName) {
        const DYNAMIC_BTN_NAME = getDynamicButtonName();
        const DYNAMIC_DDL_ID = getDynamicDropdown()?.id;
        if (!DYNAMIC_BTN_NAME || !DYNAMIC_DDL_ID) { alert('Erro: Elementos de troca de personagem não encontrados.'); return; }
        localStorage.setItem(LS_REDIRECT_KEY, 'FocusRedirect');
        const codeToInject = `var dropdown = document.getElementById('${DYNAMIC_DDL_ID}'); var charNameToFind = '${characterName.replace(/'/g, "\\'")}'; for (var i = 0; i < dropdown.options.length; i++) { var optionText = dropdown.options[i].textContent.replace(/\\(.+\\)/, '').replace(/\\s+/g, ' ').trim(); if (optionText === charNameToFind) { dropdown.value = dropdown.options[i].value; __doPostBack('${DYNAMIC_BTN_NAME}', ''); break; } };`;
        const script = document.createElement('script');
        script.textContent = `(function() { ${codeToInject} })();`;
        document.head.appendChild(script).remove();
    }

    // --- COLETA E PROCESSAMENTO DE DADOS ---
    function getGameTime() {
        console.log("[DEBUG] --- Iniciando getGameTime ---");
        const scripts = Array.from(document.querySelectorAll('script'));
        const gameClockScript = scripts.find(s => s.textContent.includes('initGameClock'));

        if (gameClockScript) {
            console.log("[DEBUG] Encontrado script initGameClock.");
            const dateMatch = gameClockScript.textContent.match(/initGameClock\((\d+),\s*(\d+),\s*(\d+)/);
            if (dateMatch) {
                const [, year, month, day] = dateMatch.map(Number);
                console.log(`[DEBUG] Data do initGameClock: ${day}/${month}/${year}`);
                const timeEl = document.getElementById('character-tools-location');
                if (timeEl) {
                    console.log("[DEBUG] Encontrado elemento #character-tools-location.");
                    const timeMatch = timeEl.textContent.match(/(\d{2}):(\d{2})/);
                    if (timeMatch) {
                        const [hour, minute] = timeMatch[0].split(':').map(Number);
                        console.log(`[DEBUG] Hora do elemento: ${hour}:${minute}`);
                        const finalDate = new Date(year, month - 1, day, hour, minute);
                        console.log(`[DEBUG] ✅ Data/Hora final do jogo: ${finalDate.toLocaleString()}`);
                        return finalDate;
                    } else {
                        console.log("[DEBUG] ❌ Não foi possível encontrar a hora no elemento #character-tools-location.");
                    }
                } else {
                     console.log("[DEBUG] ❌ Elemento #character-tools-location não encontrado.");
                }
            } else {
                console.log("[DEBUG] ❌ Não foi possível encontrar a data no script initGameClock.");
            }
        } else {
            console.log("[DEBUG] ❌ Script com initGameClock não encontrado.");
        }
        console.log("[DEBUG] Usando hora local como fallback.");
        return new Date();
    }


    function extractCharacterData(doc, charId) {
        let data = { id: charId, nome: 'N/A', humor: 'N/A', saude: 'N/A', dinheiro: 'N/A', tempo: 'N/A', carreira: 'N/A', foto: null, idade: 'N/A', brilhantes: 'N/A', cidade: 'N/A', mensagens: '0', convites: '0', estado: 'N/A' };
        function getAttr(title) {
            const img = doc.querySelector(`img[title="${title}"]`);
            return img?.closest('tr')?.querySelector('.sortkey')?.textContent.trim() || img?.closest('td')?.nextElementSibling?.textContent.trim() || 'N/A';
        }
        data.nome = cleanName(doc.querySelector('h2')?.firstChild?.textContent.trim().replace(':', ''));
        data.dinheiro = getAttr('Dinheiro');
        data.brilhantes = getAttr('Brilhantes');
        data.saude = getAttr('Saúde');
        data.humor = getAttr('Humor');
        data.idade = doc.documentElement.outerHTML.match(/tem\s*(\d+)\s*anos/i)?.[1] || 'N/A';
        data.foto = doc.querySelector('.avatar')?.style.backgroundImage.match(/url\(['"]?(.+?)['"]?\)/)?.[1];
        data.cidade = doc.querySelector('.characterPresentation p a[href*="/City/"]')?.textContent.trim() || 'N/A';
        data.estado = doc.querySelector('img[title="Estado"]')?.closest('td')?.nextElementSibling?.textContent.trim() || 'N/A';
        const pElement = doc.querySelector('.characterPresentation p:nth-child(2)');
        if (pElement) { const strongs = pElement.querySelectorAll('strong'); if (strongs.length >= 2) { data.carreira = strongs[1].textContent.trim(); data.tempo = strongs[0].textContent.trim(); } }

        const dropdown = doc.querySelector('[id$="ddlCurrentCharacter"]');
        if (dropdown) {
            const option = Array.from(dropdown.options).find(o => cleanName(o.textContent) === data.nome);
            if (option) {
                data.mensagens = option.textContent.match(/\((\d+)\s+mensagens/i)?.[1] || '0';
            }
        }
        return data;
    }

    function fetchNotifications(charId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({ method: "GET", url: NOTIFICATIONS_URL + charId, timeout: TIMEOUT_MS,
                               onload: res => {
                                   if (res.status !== 200 || !res.responseText) { resolve(-1); return; }
                                   const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                                   resolve(Array.from(doc.querySelectorAll('#tblnotifications a')).filter(a => a.textContent.includes('Mensagem de')).length);
                               },
                               onerror: () => resolve(-1), ontimeout: () => resolve(-1)
                             });
        });
    }

    async function fetchInvitations(charId, gameTime) {
        console.log(`\n--- [DEBUG] Iniciando fetchInvitations para Char ID: ${charId} ---`);

        // PASSO 1: Buscar no diário
        console.log(`[DEBUG] [DIÁRIO] Buscando em: ${DIARY_URL + charId}`);
        const diaryHtml = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: DIARY_URL + charId, timeout: TIMEOUT_MS,
                onload: res => {
                    console.log(`[DEBUG] [DIÁRIO] Requisição concluída com status: ${res.status}`);
                    resolve(res.status === 200 ? res.responseText : null)
                },
                onerror: (res) => { console.log("[DEBUG] ❌ Erro de rede ao buscar diário.", res); resolve(null) },
                ontimeout: () => { console.log("[DEBUG] ❌ Timeout ao buscar diário."); resolve(null) }
            });
        });

        if (!diaryHtml) { console.log("[DEBUG] ❌ Falha ao obter conteúdo da página do diário."); return -1; }
        console.log("[DEBUG] ✅ Página do diário obtida com sucesso.");

        const diaryDoc = new DOMParser().parseFromString(diaryHtml, "text/html");
        const potentialInvites = [];
        const diaryEntries = diaryDoc.querySelectorAll('.diaryExtraspace li ul li');
        console.log(`[DEBUG] [DIÁRIO] Encontradas ${diaryEntries.length} entradas de diário para analisar.`);

        diaryEntries.forEach((entry, i) => {
            const text = entry.textContent.replace(/\s+/g, ' ').trim();
            if (text.includes('me chamou para')) {
                console.log(`[DEBUG] [DIÁRIO] >> Potencial convite encontrado na linha #${i}: "${text}"`);
                const inviteMatch = text.match(/às ((\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2}))/);
                if (inviteMatch) {
                    const inviterName = entry.querySelector('a')?.textContent.trim();
                    const dateTimeString = inviteMatch[1];
                    const dateStr = inviteMatch[2];
                    const timeStr = inviteMatch[3];
                    const [day, month, year] = dateStr.split('/').map(Number);
                    const [hour, minute] = timeStr.split(':').map(Number);

                    if (inviterName) {
                        const inviteDate = new Date(year, month - 1, day, hour, minute);
                        console.log(`[DEBUG] [DIÁRIO]    > Extraído: Convidante='${inviterName}', DataHora='${dateTimeString}'`);
                        console.log(`[DEBUG] [DIÁRIO]    > Comparando: (Convite) ${inviteDate.toLocaleString()} > (Jogo) ${gameTime.toLocaleString()}`);
                        if (inviteDate > gameTime) {
                            console.log("[DEBUG] [DIÁRIO]    > ✅ VÁLIDO (futuro). Adicionando à lista.");
                            potentialInvites.push({ inviter: inviterName, dateTimeString: dateTimeString });
                        } else {
                            console.log("[DEBUG] [DIÁRIO]    > ❌ INVÁLIDO (passado).");
                        }
                    } else {
                         console.log("[DEBUG] [DIÁRIO]    > ❌ Falha ao extrair o nome do convidante.");
                    }
                } else {
                     console.log("[DEBUG] [DIÁRIO]    > ❌ Falha ao extrair a data/hora do texto com a Regex.");
                }
            }
        });

        console.log(`[DEBUG] [DIÁRIO] Total de convites futuros encontrados: ${potentialInvites.length}`, potentialInvites);
        if (potentialInvites.length === 0) {
            console.log("[DEBUG] Nenhum convite futuro no diário. Resultado final: 0.");
            return 0;
        }

        // PASSO 2: Validar na página de convites.
        console.log(`[DEBUG] [CONVITES] Buscando em: ${INVITE_URL + charId}`);
        const invitesHtml = await new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: INVITE_URL + charId, timeout: TIMEOUT_MS,
                onload: res => {
                    console.log(`[DEBUG] [CONVITES] Requisição concluída com status: ${res.status}`);
                    resolve(res.status === 200 ? res.responseText : null)
                },
                onerror: (res) => { console.log("[DEBUG] ❌ Erro de rede ao buscar convites.", res); resolve(null) },
                ontimeout: () => { console.log("[DEBUG] ❌ Timeout ao buscar convites."); resolve(null) }
            });
        });

        if (!invitesHtml) { console.log("[DEBUG] ❌ Falha ao obter conteúdo da página de convites."); return -1; }
        console.log("[DEBUG] ✅ Página de convites obtida com sucesso.");

        const invitesDoc = new DOMParser().parseFromString(invitesHtml, "text/html");
        const pendingInviteRows = invitesDoc.querySelectorAll('table tbody tr');
        let finalCount = 0;
        console.log(`[DEBUG] [CONVITES] Encontradas ${pendingInviteRows.length} linhas de convites pendentes para validar.`);

        pendingInviteRows.forEach((row, i) => {
            const rowText = row.textContent.replace(/\s+/g, ' ').trim();
            console.log(`[DEBUG] [CONVITES] >> Validando linha pendente #${i}: "${rowText}"`);

            const isMatch = potentialInvites.some(potential => {
                const hasInviter = rowText.includes(potential.inviter);
                const hasDateTime = rowText.includes(potential.dateTimeString);
                if(hasInviter && hasDateTime){
                    console.log(`[DEBUG] [CONVITES]    > ✅ CORRESPONDÊNCIA ENCONTRADA com: { inviter: '${potential.inviter}', dateTimeString: '${potential.dateTimeString}' }`);
                    return true;
                }
                return false;
            });

            if (isMatch) {
                finalCount++;
            } else {
                console.log("[DEBUG] [CONVITES]    > ❌ Nenhuma correspondência encontrada para esta linha.");
            }
        });

        console.log(`[DEBUG] --- Contagem final de convites válidos: ${finalCount} ---`);
        return finalCount;
    }

    // CORREÇÃO: Função reestruturada para aguardar os resultados corretamente.
    async function fetchAndProcessSingleCharacter(charId, gameTime) {
        // Inicia todas as requisições em paralelo para ganhar tempo
        const charPagePromise = new Promise(resolve => GM_xmlhttpRequest({ method: "GET", url: BASE_URL + charId, timeout: TIMEOUT_MS, onload: resolve, onerror: resolve, ontimeout: resolve }));
        const invitePromise = fetchInvitations(charId, gameTime);
        const notificationPromise = fetchNotifications(charId);

        // Aguarda a resposta da página principal, que é a mais crítica para os dados básicos
        const charPageResponse = await charPagePromise;

        // Aguarda as outras duas requisições. Como elas iniciaram em paralelo,
        // é provável que já tenham terminado ou estejam perto de terminar.
        const inviteCount = await invitePromise;
        const messageCount = await notificationPromise;

        let charData = { id: charId, nome: `ID ${charId}`, erro: null };

        if (charPageResponse && charPageResponse.status === 200 && charPageResponse.responseText) {
            const doc = new DOMParser().parseFromString(charPageResponse.responseText, "text/html");
            charData = extractCharacterData(doc, charId);

            const activeCharName = cleanName(doc.querySelector('[id$="ddlCurrentCharacter"] option[selected="selected"]')?.textContent || '');

            // Atribui a contagem de convites que já foi aguardada
            charData.convites = inviteCount >= 0 ? inviteCount : 'N/A';

            // A contagem de mensagens só é confiável se o personagem ativo for o que estamos verificando
            // pois o valor vem do dropdown geral da página.
            if (activeCharName && charData.nome === activeCharName) {
                charData.mensagens = messageCount >= 0 ? messageCount : 'N/A';
            }
        } else {
            // Se a página principal falhou, preenchemos com informações de erro mas ainda usamos
            // os dados que conseguimos obter, como os convites.
            const status = charPageResponse?.status ? `HTTP ${charPageResponse.status}` : (charPageResponse?.error || 'Timeout');
            charData.erro = `Erro de Requisição (${status})`;
            const oldData = loadMonitoredCharacters().find(c => c.id === charId) || {};
            charData = {...oldData, ...charData}; // Preserva dados antigos em caso de erro

            charData.convites = inviteCount >= 0 ? inviteCount : 'N/A';
            charData.mensagens = 'N/A'; // Não podemos saber as mensagens se a página principal falhou
        }
        return charData;
    }

    // --- FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO ---
    async function startMonitoring(force = false) {
        if (window.location.href.includes('/Character/Focus/')) {
            console.log("Monitor pausado na página de Foco.");
            return;
        }

        console.clear();
        console.log("--- INICIANDO ATUALIZAÇÃO DO MONITOR POPMUNDO ---");
        if (processing && !force) {
            updateStatus('Monitoramento já em andamento...');
            console.log("--- FIM (execução já em andamento) ---");
            return;
        }
        processing = true;

        const gameTime = getGameTime();
        if (!gameTime) {
            updateStatus("Erro: Não foi possível determinar a hora do jogo.", true);
            processing = false;
            console.log("--- FIM (erro ao obter hora) ---");
            return;
        }

        loadTelegramConfig();
        let chars = loadMonitoredCharacters();
        if (chars.length === 0) {
            updateStatus('Adicione IDs de personagens para iniciar.');
            processing = false;
            console.log("--- FIM (nenhum personagem para monitorar) ---");
            return;
        }

        updateStatus(`Iniciando atualização de ${chars.length} personagem(ns)...`);
        const notifiedState = JSON.parse(GM_getValue(GM_KEY_NOTIFIED_INVITES, '{}'));
        let newNotifiedState = { ...notifiedState };
        let telegramMessages = [];

        for (let i = 0; i < chars.length; i++) {
            const newData = await fetchAndProcessSingleCharacter(chars[i].id, gameTime);
            chars[i] = newData;
            if (!newData.erro) {
                const currentInvites = parseInt(newData.convites) || 0;
                const currentMessages = parseInt(newData.mensagens) || 0;
                const state = newNotifiedState[newData.id] || { invites: 0, messages: 0 };
                if (currentInvites > 0 && currentInvites > state.invites) telegramMessages.push(`🔔 <b>${newData.nome}</b> tem ${currentInvites} novo(s) convite(s) pendente(s)!`);
                state.invites = currentInvites;
                if (currentMessages > 0 && currentMessages > state.messages) telegramMessages.push(`✉️ <b>${newData.nome}</b> tem ${currentMessages} nova(s) mensagem(ns) não lida(s)!`);
                state.messages = currentMessages;
                newNotifiedState[newData.id] = state;
            }
            setLoading(true, Math.floor(((i + 1) / chars.length) * 100));
            renderTable();
            if (i < chars.length - 1) {
                const randomDelay = MIN_PAUSE_PER_CHAR + Math.random() * (MAX_PAUSE_PER_CHAR - MIN_PAUSE_PER_CHAR);
                await new Promise(r => setTimeout(r, randomDelay));
            }
        }

        if (telegramMessages.length > 0) sendTelegramNotification("⭐ Alerta Popmundo!\n\n" + telegramMessages.join("\n"));
        saveMonitoredCharacters(chars);
        GM_setValue(GM_KEY_NOTIFIED_INVITES, JSON.stringify(newNotifiedState));
        GM_setValue(GM_KEY_LAST_UPDATE, Date.now());
        updateLastUpdateTimeDisplay();
        setLoading(false);
        updateStatus(`Atualização concluída. Próxima em ${UPDATE_INTERVAL_MS / 60000} minutos.`);
        console.log("--- FIM DA ATUALIZAÇÃO ---");
        processing = false;
    }

    // --- RENDERIZAÇÃO DA TABELA ---
    function renderTable() {
        const tableBody = getEl('#charTableBody');
        tableBody.innerHTML = "";
        const chars = loadMonitoredCharacters();

        chars.forEach(char => {
            const hasError = !!char.erro;
            const humorVal = parseInt(char.humor) || 100;
            const saudeVal = parseInt(char.saude) || 100;
            const isSick = humorVal < 30 || saudeVal < 30;
            const hasInvites = parseInt(char.convites) > 0;
            const hasMessages = parseInt(char.mensagens) > 0;

            let rowStyle = `vertical-align:middle; border-bottom:1px solid ${c.rowBorder};`;
            if (hasMessages) rowStyle += `background:${c.messageHighlight};`;
            else rowStyle += `background: ${c.rowBg};`;

            let rowTextStyle = `color: ${c.textColor};`;
            if (isSick || hasError) rowTextStyle += `color:${c.sickColor}; font-weight:bold;`;

            const moneyDisplay = char.dinheiro ? char.dinheiro.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") : "N/A";
            const reminderText = getReminder(char.id);
            let estadoStyle = `text-align:center;`;
            if (char.estado && char.estado !== 'Normal') estadoStyle += ` color:${c.sickColor}; font-weight: bold;`;

            const tr = document.createElement("tr");
            tr.style.cssText = rowStyle;
            tr.innerHTML = `
<td style="padding:5px; text-align:center;">
    ${char.foto ? `<div style="width:40px;height:40px;background-image:url('${char.foto}');background-size:cover;background-position:center;border-radius:5px;margin:auto;"></div>` : "-"}
</td>
<td style="padding:10px; ${rowTextStyle}">
    <a href="${BASE_URL}${char.id}" target="_blank" style="color:inherit;">${char.nome || "N/A"}</a>
    ${hasError ? `<div style="font-size:11px; font-style:italic;">${char.erro}</div>` : ''}
    ${reminderText ? `<div style="font-size:11px; color:#f39c12; font-style:italic;">Lembrete: ${reminderText}</div>` : ''}
</td>
<td style="padding:10px; text-align:center; ${rowTextStyle}">${char.idade || "N/A"}</td>
<td style="padding:10px; text-align:center; ${rowTextStyle}">${char.saude}% / ${char.humor}%</td>
<td style="padding:10px; ${estadoStyle}">${char.estado || "N/A"}</td>
<td style="padding:10px; ${rowTextStyle}">${char.carreira || "N/A"} / ${char.tempo || "Parado"}</td>
<td style="padding:10px; ${rowTextStyle}">${char.cidade || "N/A"}</td>
<td style="padding:10px; text-align:center; ${rowTextStyle}">
    $${moneyDisplay}<br>
    ${char.brilhantes || "N/A"} 💎
</td>
<td style="padding:10px; text-align:center; font-weight:${hasMessages ? 'bold' : 'normal'}; ${rowTextStyle}">${char.mensagens === 'N/A' ? '?' : char.mensagens}</td>
<td style="padding:10px; text-align:center; font-weight:${hasInvites ? 'bold' : 'normal'}; color:${hasInvites ? c.inviteColor : 'inherit'};">${char.convites === 'N/A' ? '?' : char.convites}</td>
<td style="padding:10px; text-align:center;">
    <button class="action-btn primary" data-action="focus" data-name="${char.nome}" title="Troca para este personagem e vai para a página de Foco."><i class="fa-solid fa-crosshairs"></i> Focar</button>
    <button class="action-btn" data-action="reminder" data-id="${char.id}" title="Adicionar/Editar Lembrete"><i class="fa-solid fa-pencil"></i></button>
    <button class="action-btn" data-action="remove" data-id="${char.id}" title="Remover Personagem" style="border-color:${c.sickColor}; color:${c.sickColor};"><i class="fa-solid fa-trash"></i></button>
</td>
`;
            tableBody.appendChild(tr);
        });
    }

    // --- EVENTOS E INICIALIZAÇÃO ---
    function addCharacters(idListString) {
        const newIDs = idListString.split(',').map(id => id.trim()).filter(id => id && /^\d+$/.test(id));
        if (newIDs.length === 0) return;
        let chars = loadMonitoredCharacters();
        const existingIDs = new Set(chars.map(c => c.id));
        newIDs.forEach(id => { if (!existingIDs.has(id)) chars.push({ id: id, nome: `Carregando ID ${id}` }); });
        saveMonitoredCharacters(chars);
        startMonitoring(true);
    }

    getEl('#charTableBody').addEventListener('click', e => {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        const action = target.dataset.action, charId = target.dataset.id, charName = target.dataset.name;
        switch(action) {
            case 'focus': changeCharacterByName(charName); getEl('#closeMonitor').click(); break;
            case 'reminder': const newText = prompt("Insira um lembrete:", getReminder(charId)); if (newText !== null) { setReminder(charId, newText); renderTable(); } break;
            case 'remove': if (confirm(`Remover ${charName || charId}?`)) { saveMonitoredCharacters(loadMonitoredCharacters().filter(c => c.id !== charId)); renderTable(); } break;
        }
    });

    getEl('#addCharBtn').onclick = () => { const input = getEl('#charIdInput'); addCharacters(input.value); input.value = ""; };
    getEl('#charIdInput').onkeypress = e => { if (e.key === 'Enter') getEl('#addCharBtn').click(); };
    getEl('#saveConfigBtn').onclick = () => {
        saveTelegramConfig(getEl('#pmTelegramToken').value.trim(), getEl('#pmTelegramChatId').value.trim(), getEl('#pmTelegramEnabled').checked);
        alert('Configurações salvas!'); getEl('#configBtn').click();
    };

    function init() {
        handlePostBackRedirect();
        loadTelegramConfig();
        getEl('#pmTelegramToken').value = telegramConfig.token;
        getEl('#pmTelegramChatId').value = telegramConfig.chatId;
        getEl('#pmTelegramEnabled').checked = telegramConfig.enabled;
        renderTable();
        updateLastUpdateTimeDisplay();
        const lastUpdate = GM_getValue(GM_KEY_LAST_UPDATE, 0);
        const timeElapsed = Date.now() - lastUpdate;
        if (timeElapsed >= UPDATE_INTERVAL_MS) { startMonitoring(); }
        else {
            const timeRemaining = UPDATE_INTERVAL_MS - timeElapsed;
            updateStatus(`Próxima atualização em ${Math.ceil(timeRemaining / 60000)} min...`);
            setTimeout(startMonitoring, timeRemaining);
        }
        setInterval(startMonitoring, UPDATE_INTERVAL_MS);
    }

    init();
})();
