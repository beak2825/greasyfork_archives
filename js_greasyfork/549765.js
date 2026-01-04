// ==UserScript==
// @name         Automatizador de Resgate
// @namespace    http://tampermonkey.net/
// @version      10.15.3
// @description  O prédio está em chamas. Vidas dependem de você. Logs temáticos para maior imersão.
// @author       Chris Popper & Equipe de Resgate
// @match        *://*.popmundo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549765/Automatizador%20de%20Resgate.user.js
// @updateURL https://update.greasyfork.org/scripts/549765/Automatizador%20de%20Resgate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÕES ---
    const HOSTNAME = window.location.hostname;
    const TRAVEL_WAIT_TIME_MS = (4 * 60) * 1000; // 4 minutos
    const RESCUE_FLOOR_BUTTON_TEXT = 'Floor 2-100';
    const ROOF_BUTTON_TEXT = 'Roof';
    const BUTTON_FAIL_MESSAGE = 'Você pressiona o botão e nada acontece... SOCORRO!';
    const HELICOPTER_ID = '236397494';
    const PANEL_POSITION_KEY = 'rescue_panel_position';
    const OXYGEN_SUPPLY_TEXT = 'Suprimento de oxigênio';

    // --- DADOS DOS MAPAS ---
    const MAP_DATA_BY_ID = {
        "238144658": { mapName: "Burning Office (1.1)", moves: { toVictim: ['Leste', 'Sul', 'Leste', 'Sul', 'Sul', 'Leste', 'Leste', 'Norte'] } },
        "238144562": { mapName: "Burning Office (1.2)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Leste', 'Leste', 'Sul'] } },
        "237550635": { mapName: "Burning Office (1.3)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Norte', 'Para Baixo', 'Sul', 'Leste', 'Norte'] } },
        "237550282": { mapName: "Burning Office (1.4)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Norte'] } },
        "238144341": { mapName: "Burning Office (1.5)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Sul', 'Oeste'] } },
        "238144434": { mapName: "Burning Office (1.6)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Sul', 'Oeste'] } },
        "237550408": { mapName: "Burning Office (1.7)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Leste', 'Norte'] } },
        "236934729": { mapName: "Collapsed Floor (2.1)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Para Cima', 'Oeste', 'Norte', 'Norte', 'Leste', 'Leste', 'Leste', 'Para Cima', 'Oeste', 'Oeste', 'Oeste', 'Sul', 'Sul', 'Oeste', 'Para Baixo'] } },
        "237549465": { mapName: "Collapsed Floor (2.2)", moves: { toVictim: ['Leste', 'Sudeste', 'Norte', 'Para Cima', 'Oeste'] } },
        "237550032": { mapName: "Collapsed Floor (2.3)", moves: { toVictim: ['Leste', 'Norte', 'Leste', 'Para Cima', 'Sul', 'Oeste', 'Sul', 'Sul', 'Leste', 'Leste', 'Sul'] } },
        "237550178": { mapName: "Collapsed Floor (2.4)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Oeste', 'Sul', 'Para Baixo', 'Norte', 'Leste', 'Norte', 'Norte', 'Leste', 'Sul'] } },
        "236936071": { mapName: "Collapsed Floor (2.5)", moves: { toVictim: ['Leste', 'Sul', 'Oeste', 'Para Baixo', 'Leste', 'Sul', 'Leste', 'Norte', 'Para Baixo', 'Norte', 'Leste', 'Leste', 'Sul', 'Para Cima'] } },
        "238145228": { mapName: "Collapsed Office (3.1)", moves: { toVictim: ['Leste', 'Norte', 'Para Cima', 'Leste', 'Para Baixo', 'Leste', 'Sul', 'Sul', 'Leste', 'Para Cima', 'Norte', 'Oeste'] } },
        "238144898": { mapName: "Collapsed Office (3.2)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Leste', 'Para Baixo', 'Norte', 'Oeste', 'Sul', 'Oeste', 'Norte'] } },
        "238145154": { mapName: "Collapsed Office (3.3)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Leste', 'Para Baixo', 'Sul', 'Sul'] } },
        "238145032": { mapName: "Collapsed Office (3.5)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Sul', 'Oeste', 'Para Baixo'] } },
        "238144785": { mapName: "Collapsed Office (3.6)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Sul', 'Oeste', 'Para Baixo', 'Leste', 'Sul', 'Oeste', 'Oeste', 'Sul', 'Oeste'] } },
        "236937629": { mapName: "Collapsed Office Floor (4.1)", moves: { toVictim: ['Leste', 'Sul', 'Leste', 'Sul', 'Para Baixo', 'Leste', 'Norte', 'Norte', 'Leste', 'Norte', 'Para Baixo', 'Oeste', 'Sul', 'Oeste'] } },
        "236937430": { mapName: "Collapsed Office Floor (4.2)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Leste', 'Para Baixo', 'Norte', 'Leste', 'Para Baixo', 'Oeste', 'Norte', 'Oeste', 'Oeste', 'Sul', 'Oeste', 'Para Cima', 'Leste', 'Sul', 'Leste', 'Para Baixo'] } },
        "236361115": { mapName: "Floor 1 (5.1)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Sul', 'Sul', 'Sul'] } },
        "236361116": { mapName: "Floor 2 (6.1)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Norte'] } },
        "238145480": { mapName: "Skyscraper GYMs (7.1)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Oeste'] } },
        "238145617": { mapName: "Skyscraper GYMs (7.2)", moves: { toVictim: ['Leste', 'Norte', 'Leste', 'Leste', 'Leste'] } },
        "238145366": { mapName: "Skyscraper GYMs (7.3)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Leste'] } },
        "238145773": { mapName: "Skyscraper Library (8.1)", moves: { toVictim: ['Leste', 'Norte', 'Leste', 'Leste', 'Leste'] } },
        "238145650": { mapName: "Skyscraper Library (8.2)", moves: { toVictim: ['Leste', 'Sul', 'Sul', 'Leste', 'Leste', 'Leste'] } },
        "236936724": { mapName: "Wanda Massage Parlor (9.1)", moves: { toVictim: ['Leste', 'Leste', 'Leste', 'Leste', 'Norte', 'Para Cima', 'Sul', 'Oeste', 'Oeste', 'Oeste', 'Norte', 'Oeste'] } }
    };

    // --- LÓGICA DE ESTADO ---
    const STATE = { current: sessionStorage.getItem('rescue_state'), moveIndex: parseInt(sessionStorage.getItem('rescue_moveIndex'), 10), mapId: sessionStorage.getItem('rescue_mapId'), roofElevatorId: sessionStorage.getItem('rescue_roofElevatorId'), waitUntil: parseInt(sessionStorage.getItem('rescue_waitUntil'), 10), nextState: sessionStorage.getItem('rescue_nextState'), returnState: sessionStorage.getItem('rescue_returnState') };
    if (isNaN(STATE.moveIndex)) STATE.moveIndex = 0;
    function setState(newState, extra = {}) { sessionStorage.setItem('rescue_state', newState); STATE.current = newState; for (const key in extra) { const value = extra[key]; if (value !== undefined) { sessionStorage.setItem(`rescue_${key}`, value); STATE[key] = value; } } }
    function clearState() { Object.keys(sessionStorage).forEach(key => { if (key.startsWith('rescue_')) sessionStorage.removeItem(key); }); STATE.current = null; sessionStorage.removeItem('rescue_log');}

    let lastClickedButtonForRetry = null;

    // --- SISTEMA DE LOG PERSISTENTE ---
    const LOG_KEY = 'rescue_log';
    const MAX_LOG_ENTRIES = 100;
    let countdownInterval = null;
    function log(message) {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const logEntry = { time: timestamp, message: message };
        let logs = JSON.parse(sessionStorage.getItem(LOG_KEY) || '[]');
        logs.push(logEntry);
        if (logs.length > MAX_LOG_ENTRIES) { logs = logs.slice(logs.length - MAX_LOG_ENTRIES); }
        sessionStorage.setItem(LOG_KEY, JSON.stringify(logs));
        console.log(`[Comando Resgate Log] ${timestamp} - ${message}`);
        renderLog();
    }
    function renderLog() {
        const logContainer = document.getElementById('rescue-log-container');
        if (!logContainer) return;
        const logs = JSON.parse(sessionStorage.getItem(LOG_KEY) || '[]');
        logContainer.innerHTML = '';
        if (logs.length === 0) {
            logContainer.innerHTML = '<div class="rescue-log-entry"><span>Aguardando chamado...</span></div>';
            return;
        }
        logs.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'rescue-log-entry';
            if (entry.message.toLowerCase().includes('erro:') || entry.message.toLowerCase().includes('bloqueado')) { entryDiv.classList.add('error'); }
            else if (entry.message.toLowerCase().includes('vítima localizada') || entry.message.toLowerCase().includes('missão cumprida')) { entryDiv.classList.add('success'); }
            entryDiv.innerHTML = `<span class="timestamp">${entry.time}</span> <span class="message">${entry.message}</span>`;
            logContainer.appendChild(entryDiv);
        });
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    function clearLog() {
        sessionStorage.removeItem(LOG_KEY);
        renderLog();
    }
    function startUICountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        const logContainer = document.getElementById('rescue-log-container');
        if (!logContainer) return;
        const lastLogEntry = logContainer.querySelector('.rescue-log-entry:last-child .message');
        if (!lastLogEntry) return;
        const originalMessage = lastLogEntry.innerText;
        countdownInterval = setInterval(() => {
            if (STATE.current !== 'WAITING' || !STATE.waitUntil) {
                clearInterval(countdownInterval);
                return;
            }
            const timeLeft = Math.round((STATE.waitUntil - Date.now()) / 1000);
            if (timeLeft > 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                lastLogEntry.innerText = `${originalMessage}... ${minutes}m ${seconds}s restantes.`;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    // --- FUNÇÕES AUXILIARES ---
    const clickElement = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            lastClickedButtonForRetry = element;
            element.click();
            return true;
        }
        log(`ERRO: Escombros bloquearam o caminho: ${selector}.`);
        clearState();
        return false;
    };
    const clickLinkByText = (text) => {
        const lowerCaseText = text.toLowerCase();
        const xpath = `//a[translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ', 'abcdefghijklmnopqrstuvwxyzàáâãäåçèéêëìíîïñòóôõöùúûüý')='${lowerCaseText}']`;
        const link = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (link) {
            lastClickedButtonForRetry = link;
            link.click();
            return true;
        }
        log(`ERRO: Acesso "${text}" destruído pelo fogo.`);
        clearState();
        return false;
    };
    const goToUrl = (path) => { const fullUrl = `https://${HOSTNAME}${path}`; window.location.href = fullUrl; };
    const clickElevatorButtonByText = (buttonText) => {
        const xpath = `//em[contains(text(),'${buttonText}')]/ancestor::tr//input[@type='image']`;
        const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            lastClickedButtonForRetry = button;
            button.click();
            return true;
        }
        log(`ERRO: Acesso ao elevador "${buttonText}" bloqueado.`);
        clearState();
        return false;
    };
    function generateReturnPath(forwardPath) {
        const oppositeMoves = { 'Norte': 'Sul', 'Sul': 'Norte', 'Leste': 'Oeste', 'Oeste': 'Leste', 'Para Cima': 'Para Baixo', 'Para Baixo': 'Para Cima' };
        const reversedPath = forwardPath.slice().reverse();
        const returnPath = reversedPath.map(move => oppositeMoves[move] || move);
        return returnPath;
    }

    // --- LÓGICA DE DETECÇÃO ---
    function detectCurrentLocation() {
        const h1 = document.querySelector('h1');
        if (!h1) return { type: 'UNKNOWN' };
        const titleText = h1.innerText.trim();
        if (titleText === 'Elevator') return { type: 'BASE' };
        if (titleText === 'Skyscraper Roof') {
             const roofElevatorLink = document.querySelector('a[href*="/Locale/ItemDetails/"][id*="lnkItem"]');
             const roofElevatorId = roofElevatorLink ? roofElevatorLink.getAttribute('href').split('/').pop() : null;
             return { type: 'ROOF', roofElevatorId: roofElevatorId };
        }
        const elevatorButton = document.querySelector('a[href*="/Locale/ItemDetails/"][id*="lnkItem"]');
        if (elevatorButton) {
            const mapId = elevatorButton.getAttribute('href').split('/').pop();
            if (MAP_DATA_BY_ID[mapId]) {
                return { type: 'MAP', mapId: mapId, mapName: MAP_DATA_BY_ID[mapId].mapName };
            }
        }
        const exploreLink = document.evaluate("//a[normalize-space()='Explorar a área']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (exploreLink) {
            return { type: 'IN_TRANSIT' };
        }
        return { type: 'UNKNOWN' };
    }

    function exploreUntilReady(successCondition, successState, successLog, extraStateData = {}) {
        const location = detectCurrentLocation();
        if (successCondition(location)) {
            log(successLog);
            setState(successState, { ...extraStateData, mapId: location.mapId, roofElevatorId: location.roofElevatorId });
            setTimeout(processState, 500);
        } else {
            log("Visibilidade baixa. Verificando rota novamente...");
            setTimeout(() => clickLinkByText("Explorar a área"), 1500 + Math.random() * 1000);
        }
    }

    // --- MÁQUINA DE ESTADOS PRINCIPAL ---
    function processState() {
        if (!STATE.current) return;
        if (STATE.current === 'WAITING') {
            const timeLeft = Math.round((STATE.waitUntil - Date.now()) / 1000);
            if (timeLeft > 0) {
                setTimeout(processState, 1000);
                return;
            } else {
                setState(STATE.nextState);
                sessionStorage.removeItem('rescue_nextState');
                sessionStorage.removeItem('rescue_waitUntil');
                clickLinkByText("Explorar a área");
                return;
            }
        }

        const moveSequence = (state, moves, nextState) => {
            if (!document.location.pathname.endsWith('/Compass')) { log("Orientando-me pela fumaça. Bússola em mãos."); goToUrl('/World/Popmundo.aspx/Locale/Compass'); return; }
            if (STATE.moveIndex < moves.length) { const moveDirection = moves[STATE.moveIndex]; log(`Avançando para ${moveDirection}... O calor é intenso.`); setState(state, { moveIndex: STATE.moveIndex + 1 }); clickLinkByText(moveDirection); } else { setState(nextState); setTimeout(processState, 500); }
        };
        const helicopterMoves = { toHelicopter: ['Leste', 'Sul', 'Leste'], backFromHelicopter: ['Oeste', 'Norte', 'Oeste'] };

        function startWaiting(nextState) {
            log("Avanço tático em andamento. Aguardando liberação...");
            setState('WAITING', { waitUntil: Date.now() + TRAVEL_WAIT_TIME_MS, nextState: nextState });
            startUICountdown();
            setTimeout(processState, 1000);
        }

        switch (STATE.current) {
            // ESTADO CRÍTICO: Garante que estamos na visão correta para clicar em botões.
            case 'REFRESH_LOCATION_VIEW':
                log("Confirmando coordenadas e atualizando a visão local...");
                const nextState = STATE.nextState;
                sessionStorage.removeItem('rescue_nextState');
                setState(nextState); // Prepara o estado para a próxima página
                clickLinkByText("Explorar a área"); // Causa o recarregamento para a visão correta
                break;

            case 'GO_TO_RESCUE_FLOOR':
                log("Preparando para acessar o andar do incêndio...");
                setState('REFRESH_LOCATION_VIEW', { nextState: 'DO_GO_TO_RESCUE_FLOOR_CLICK' });
                processState();
                break;
            case 'DO_GO_TO_RESCUE_FLOOR_CLICK':
                log("Acessando o andar do incêndio. Elevador de serviço ativo.");
                setState('START_WAIT_TO_RESCUE');
                clickElevatorButtonByText(RESCUE_FLOOR_BUTTON_TEXT);
                break;

            case 'START_WAIT_TO_RESCUE': startWaiting('AWAITING_MAP_LOAD'); break;
            case 'AWAITING_MAP_LOAD':
                exploreUntilReady(
                    loc => loc.type === 'MAP',
                    'BEGIN_MAP_EXPLORATION',
                    'Cheguei ao andar do incêndio. Fumaça densa e calor extremo.'
                );
                break;
            case 'BEGIN_MAP_EXPLORATION':
                const location = detectCurrentLocation();
                if (location.type === 'MAP') { log(`Consultando planta do ${location.mapName}. Traçando rota de busca.`); setState('EXPLORE_TO_VICTIM', { mapId: location.mapId, moveIndex: 0 }); goToUrl('/World/Popmundo.aspx/Locale/Compass'); } else { log("ERRO: Desorientado pela fumaça. Onde estou?"); clearState(); }
                break;
            case 'EXPLORE_TO_VICTIM': log("Busca primária iniciada. Avançando no setor..."); moveSequence('EXPLORE_TO_VICTIM', MAP_DATA_BY_ID[STATE.mapId].moves.toVictim, 'RESCUE_VICTIM'); break;

            case 'RESCUE_VICTIM':
                 log("Preparando para estabilizar a vítima...");
                 setState('REFRESH_LOCATION_VIEW', { nextState: 'DO_RESCUE_VICTIM_CLICK' });
                 processState();
                 break;
            case 'DO_RESCUE_VICTIM_CLICK':
                 log("VÍTTIMA LOCALIZADA! Sinais vitais presentes. Iniciando procedimento de estabilização.");
                 setState('GOTO_COMPASS_FOR_RETURN');
                 clickElement('input[src*="Item_Use.png"]');
                 break;

            case 'GOTO_COMPASS_FOR_RETURN': log("Vítima estabilizada. Preparando para extração imediata."); setState('MOVE_BACK_SEQUENCE', { moveIndex: 0 }); goToUrl('/World/Popmundo.aspx/Locale/Compass'); break;
            case 'MOVE_BACK_SEQUENCE':
                log("Iniciando extração. Retornando pela rota de fuga segura.");
                const forwardPath = MAP_DATA_BY_ID[STATE.mapId].moves.toVictim;
                const returnPath = generateReturnPath(forwardPath);
                moveSequence('MOVE_BACK_SEQUENCE', returnPath, 'GO_TO_ELEVATOR_ITEM_PAGE');
                break;
            case 'GO_TO_ELEVATOR_ITEM_PAGE': log("Ponto de extração à vista. Mantendo o ritmo."); setState('USE_ELEVATOR_TO_RETURN'); goToUrl(`/World/Popmundo.aspx/Locale/ItemDetails/${STATE.mapId}`); break;

            case 'USE_ELEVATOR_TO_RETURN':
                log("Evacuando para a área de triagem no térreo.");
                setState('WAITING_AFTER_RETURN');
                clickElement('#ctl00_cphLeftColumn_ctl00_btnItemUse');
                break;

            case 'WAITING_AFTER_RETURN': startWaiting('AWAITING_BASE_LOAD_BEFORE_ROOF'); break;
            case 'AWAITING_BASE_LOAD_BEFORE_ROOF':
                exploreUntilReady(
                    loc => loc.type === 'BASE',
                    'GO_TO_REFILL_OXYGEN',
                    'Chegamos ao Térreo. Vítima entregue à equipe médica local.',
                    { returnState: 'GO_TO_ROOF' }
                );
                break;

            // --- FLUXO DE RECARGA DE OXIGÊNIO (CORRIGIDO) ---
            case 'GO_TO_REFILL_OXYGEN':
                log("Nível de oxigênio crítico. Localizando suprimento de emergência.");
                if (clickLinkByText(OXYGEN_SUPPLY_TEXT)) {
                    setState('REFILLING_OXYGEN_PAGE');
                } else {
                    log("AVISO: Não encontrei o Suprimento de Oxigênio! Ignorando recarga, prioridade é a missão.");
                    setState(STATE.returnState);
                    setTimeout(processState, 500);
                }
                break;
            case 'REFILLING_OXYGEN_PAGE':
                log("Confirmando recarga de O².");
                if (clickElement('#ctl00_cphLeftColumn_ctl00_btnItemUse')) {
                    setState('AWAITING_BASE_LOAD_AFTER_REFILL');
                } else {
                    log("ERRO: Botão de recarga não encontrado. Abortando recarga e continuando a missão.");
                    setState(STATE.returnState);
                    setTimeout(processState, 500);
                }
                break;
            case 'AWAITING_BASE_LOAD_AFTER_REFILL':
                exploreUntilReady(
                    loc => loc.type === 'BASE',
                    'CONTINUE_AFTER_REFILL',
                    'Recarga de O² completa. Níveis normalizados. Retornando ao ponto de partida.'
                );
                break;
            case 'CONTINUE_AFTER_REFILL':
                const nextStateAfterRefill = STATE.returnState;
                sessionStorage.removeItem('rescue_returnState');
                setState(nextStateAfterRefill);
                processState();
                break;
            // --- FIM DO FLUXO DE RECARGA ---

            case 'GO_TO_ROOF':
                log("Preparando para evacuação pelo telhado...");
                setState('REFRESH_LOCATION_VIEW', { nextState: 'DO_GO_TO_ROOF_CLICK' });
                processState();
                break;
            case 'DO_GO_TO_ROOF_CLICK':
                log("Acesso ao solo comprometido. Evacuando para o ponto de extração no telhado.");
                setState('START_WAIT_TO_ROOF');
                clickElevatorButtonByText(ROOF_BUTTON_TEXT);
                break;

            case 'START_WAIT_TO_ROOF': startWaiting('AWAITING_ROOF_LOAD'); break;
            case 'AWAITING_ROOF_LOAD':
                exploreUntilReady(
                    loc => loc.type === 'ROOF' && loc.roofElevatorId,
                    'ARRIVED_AT_ROOF',
                    'Chegamos ao telhado. Equipe de extração aérea a postos.'
                );
                break;
            case 'ARRIVED_AT_ROOF':
                log("Avançando para a zona de pouso designada.");
                setState('MOVE_TO_HELICOPTER', { moveIndex: 0 });
                goToUrl('/World/Popmundo.aspx/Locale/Compass');
                break;
            case 'MOVE_TO_HELICOPTER': log("Sinalizando para o helicóptero. Rotores à vista!"); moveSequence('MOVE_TO_HELICOPTER', helicopterMoves.toHelicopter, 'USE_HELICOPTER'); break;
            case 'USE_HELICOPTER': log("Contato visual com a equipe de voo. Preparando transferência da vítima."); setState('CLICK_USE_ON_HELICOPTER'); goToUrl(`/World/Popmundo.aspx/Locale/ItemDetails/${HELICOPTER_ID}`); break;

            case 'CLICK_USE_ON_HELICOPTER':
                log("Transferência concluída. Vítima a bordo e segura.");
                setState('EXPLORE_ROOF_AFTER_HELICOPTER');
                clickElement('#ctl00_cphLeftColumn_ctl00_btnItemUse');
                break;

            case 'EXPLORE_ROOF_AFTER_HELICOPTER':
                log("Helicóptero decolou. Retornando da zona de pouso.");
                setState('GOTO_COMPASS_FOR_ROOF_RETURN');
                clickLinkByText("Explorar a área");
                break;
            case 'GOTO_COMPASS_FOR_ROOF_RETURN':
                log("Preparando para atravessar o telhado de volta para o elevador.");
                setState('MOVE_BACK_FROM_HELICOPTER', { moveIndex: 0 });
                goToUrl('/World/Popmundo.aspx/Locale/Compass');
                break;
            case 'MOVE_BACK_FROM_HELICOPTER':
                log("Atravessando o telhado de volta para o acesso interno.");
                moveSequence('MOVE_BACK_FROM_HELICOPTER', helicopterMoves.backFromHelicopter, 'GO_TO_ROOF_ELEVATOR_PAGE');
                break;
            case 'GO_TO_ROOF_ELEVATOR_PAGE': log("Elevador de acesso ao telhado localizado. Acesso liberado."); setState('USE_ELEVATOR_FROM_ROOF'); goToUrl(`/World/Popmundo.aspx/Locale/ItemDetails/${STATE.roofElevatorId}`); break;

            case 'USE_ELEVATOR_FROM_ROOF':
                log("Descendo. Retornando ao Posto de Comando no térreo.");
                setState('WAITING_AFTER_RETURN_FROM_ROOF');
                clickElement('#ctl00_cphLeftColumn_ctl00_btnItemUse');
                break;

            case 'WAITING_AFTER_RETURN_FROM_ROOF': startWaiting('AWAITING_BASE_LOAD_FINAL'); break;
            case 'AWAITING_BASE_LOAD_FINAL':
                exploreUntilReady(
                    loc => loc.type === 'BASE',
                    'GO_TO_REFILL_OXYGEN',
                    'MISSÃO CUMPRIDA! Retorno à base. Reabastecendo para o próximo chamado.',
                    { returnState: 'GO_TO_RESCUE_FLOOR' }
                );
                break;
        }
    }

    // --- CONTROLES DA AUTOMAÇÃO ---
    function startAutomation() {
        const location = detectCurrentLocation();
        if (location.type === 'BASE' || location.type === 'MAP' || location.type === 'ROOF') {
            log("Alerta recebido! Central, estamos a caminho. Iniciando protocolo de resgate.");
            if (STATE.current) {
                log(`Retomando automação do estado: ${STATE.current}`);
            } else if (location.type === 'MAP') {
                setState('BEGIN_MAP_EXPLORATION');
            } else {
                 setState('GO_TO_RESCUE_FLOOR');
            }
            processState();
        } else {
            log("ERRO: Preciso estar no local do incêndio para iniciar.");
        }
        createUI();
    }
    function stopAutomation() {
        if (countdownInterval) clearInterval(countdownInterval);
        clearState();
        log("Comando, abortar missão! Repito, abortar! Retornando à base imediatamente.");
        location.reload();
    }

    // --- FUNÇÃO PARA TORNAR O PAINEL ARRASTÁVEL ---
    function makePanelDraggable(panel) {
        const header = panel.querySelector('.rescue-header');
        let isDragging = false;
        let offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            if (!isDragging) return;
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
            panel.style.right = 'auto';
        }
        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            const pos = { top: panel.style.top, left: panel.style.left };
            localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(pos));
        }
    }

    // --- CRIAÇÃO DA UI ---
    function createUI() {
        const oldPanel = document.getElementById('rescue-panel');
        if (oldPanel) oldPanel.remove();
        const styles = `
            #rescue-panel { position: fixed; top: 15px; right: 15px; width: 320px; background-color: #f0f2f5; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #333; }
            .rescue-header { padding: 10px 15px; background-color: #fff; border-bottom: 1px solid #ddd; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; }
            .rescue-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #1c1e21; }
            .header-right-controls { display: flex; align-items: center; }
            .rescue-version { font-size: 12px; color: #888; background-color: #e4e6eb; padding: 2px 6px; border-radius: 4px;}
            #clear-log-button { margin-left: 10px; font-size: 12px; color: #6c757d; text-decoration: none; cursor: pointer; }
            #clear-log-button:hover { color: #d9534f; text-decoration: underline; }
            .rescue-controls { padding: 15px; border-bottom: 1px solid #ddd; }
            .rescue-controls p { font-size: 13px; color: #606770; margin: 0 0 10px; text-align: center; }
            .rescue-button { width: 100%; padding: 10px; cursor: pointer; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; transition: background-color 0.2s ease, transform 0.1s ease; }
            .rescue-button:active { transform: scale(0.98); }
            #start-rescue-button { background-color: #d9534f; color: white; }
            #start-rescue-button:hover { background-color: #c9302c; }
            #stop-rescue-button { background-color: #5bc0de; color: white; }
            #stop-rescue-button:hover { background-color: #31b0d5; }
            #rescue-log-container { max-height: 250px; overflow-y: auto; background-color: #fff; padding: 10px 15px; font-size: 12px; border-radius: 0 0 8px 8px; }
            .rescue-log-entry { padding: 4px 0; border-bottom: 1px solid #f0f2f5; display: flex; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; }
            .rescue-log-entry:last-child { border-bottom: none; }
            .rescue-log-entry .timestamp { color: #888; margin-right: 8px; flex-shrink: 0; }
            .rescue-log-entry .message { word-break: break-word; }
            .rescue-log-entry.error .message { color: #d9534f; font-weight: bold; }
            .rescue-log-entry.success .message { color: #5cb85c; font-weight: bold; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const panel = document.createElement('div');
        panel.id = 'rescue-panel';
        panel.innerHTML = `
            <div class="rescue-header">
                <h3>Central de Comando</h3>
                <div class="header-right-controls">
                    <span class="rescue-version">v10.15.3</span>
                    <a id="clear-log-button" title="Apagar o registro de atividades">Limpar Log</a>
                </div>
            </div>
            <div id="rescue-controls" class="rescue-controls"></div>
            <div id="rescue-log-container"></div>
        `;
        const savedPosition = localStorage.getItem(PANEL_POSITION_KEY);
        if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            panel.style.top = pos.top;
            panel.style.left = pos.left;
            panel.style.right = 'auto';
        }
        document.body.appendChild(panel);
        document.getElementById('clear-log-button').addEventListener('click', clearLog);

        const controlsDiv = document.getElementById('rescue-controls');
        if (STATE.current) {
            controlsDiv.innerHTML = `<button id="stop-rescue-button" class="rescue-button">Recuar para a Base</button>`;
            document.getElementById('stop-rescue-button').addEventListener('click', stopAutomation);
        } else {
            controlsDiv.innerHTML = `
                <p><strong>O prédio está em chamas. Vidas dependem de você.</strong></p>
                <button id="start-rescue-button" class="rescue-button">Entrar no Incêndio</button>
            `;
            document.getElementById('start-rescue-button').addEventListener('click', startAutomation);
        }
        renderLog();
        makePanelDraggable(panel);
    }

    // --- OBSERVER DE ERRO ---
    function setupErrorObserver() {
        const targetNode = document.getElementById('notifications');
        if (!targetNode) return;
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('notification-error') && node.innerText.includes(BUTTON_FAIL_MESSAGE)) {
                            if (lastClickedButtonForRetry) {
                                log("Botão emperrou! O fogo deve ter danificado os circuitos. Tentando novamente em 2s...");
                                setTimeout(() => {
                                    log("Forçando o botão...");
                                    lastClickedButtonForRetry.click();
                                }, 2000);
                            } else {
                                log("ERRO CRÍTICO: Botão emperrou, mas perdi o rastro de qual botão era. Abortando.");
                                stopAutomation();
                            }
                        }
                    });
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, { childList: true });
    }

    // --- INICIALIZAÇÃO ---
    window.addEventListener('load', () => {
        createUI();
        if (STATE.current) {
            setupErrorObserver();
            if (STATE.current === 'WAITING') {
                startUICountdown();
            }
            setTimeout(processState, 500);
        }
    });
})();