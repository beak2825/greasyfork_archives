// ==UserScript==
// @name         Usa aí pra mim, assistente
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  xxx
// @author       Chris Popper
// @match        https://*.popmundo.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/551306/Usa%20a%C3%AD%20pra%20mim%2C%20assistente.user.js
// @updateURL https://update.greasyfork.org/scripts/551306/Usa%20a%C3%AD%20pra%20mim%2C%20assistente.meta.js
// ==/UserScript==

/* global $ */

(async function() {
    'use strict';

    // --- Injeção do Font Awesome ---
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    document.head.appendChild(faLink);

    // --- Estilos Globais (Inspirado no seu exemplo) ---
    GM_addStyle(`
        #automation-panel {
            background-color: #f0f0f0; border: 1px solid #dcdcdc; border-radius: 6px; padding: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-family: Arial, sans-serif; font-size: 13px;
            width: 240px; position: fixed; top: 10px; right: 10px; z-index: 9999;
        }
        .panel-header { display: flex; align-items: center; margin-bottom: 10px; }
        .panel-header h2 { margin: 0; font-size: 16px; color: #333; font-weight: bold; }
        .panel-header i { margin-right: 8px; color: #555; }
        .action-button {
            display: inline-flex; align-items: center; justify-content: center; width: 100%;
            padding: 8px 12px; border: 1px solid #555; border-radius: 4px; font-weight: bold;
            font-size: 13px; cursor: pointer; transition: all 0.2s; color: #333;
            text-shadow: 1px 1px 1px #fff;
        }
        .action-button i { margin-right: 8px; }
        .start-button { background: linear-gradient(to bottom, #d4edda, #b0d9b9); border-color: #28a745; }
        .start-button:hover { background: linear-gradient(to bottom, #b0d9b9, #9ac2a2); }
        .stop-button { background: linear-gradient(to bottom, #f8d7da, #f1b0b7); border-color: #dc3545; }
        .stop-button:hover { background: linear-gradient(to bottom, #f1b0b7, #e68d95); }
        #progress-bar-container { width: 100%; background-color: #e9ecef; border-radius: 10px; margin: 12px 0; overflow: hidden; height: 14px; border: 1px solid #ccc; }
        #progress-bar { width: 0%; height: 100%; background-color: #28a745; transition: width 0.5s ease; }
        #automation-status { text-align: center; color: #555; margin: 12px 0; font-style: italic; min-height: 1.2em; }
    `);

    // --- CONFIGURAÇÕES E DADOS ---
    const STATE_KEY = 'popmundo_automation_state_v10';
    const SERVER_URL = window.location.hostname;

    const ALL_ITEMS = [
        { name: 'Aparelho de som', id: '256699223' }, { name: 'Árvore de Natal', id: '170699124' },
        { name: 'Banheira', id: '256359088' }, { name: 'Cama vibratória', id: '256359759' },
        { name: 'Chuveiro', id: '256359090' }, { name: 'PrayStation', id: '256359067' },
        { name: 'Ybox 180', id: '256359071' }, { name: 'Cortador de grama', id: '256359785' },
        { name: 'Espelho de parede', id: '256421790' }, { name: 'Estátua Papai Noel', id: '183252593' },
        { name: 'GameStation 5', id: '256359081' }, { name: 'Estátua da Truta', id: '179642652' },
        { name: 'Gruta', id: '256404056' }, { name: 'Home Theater', id: '256699156' },
        { name: 'Jacuzzi', id: '256359767' }, { name: 'Minibar "Fozzoli"', id: '256359761' },
        { name: 'Papel de parede', id: '176366167' }, { name: 'Piscina', id: '256359768' },
        { name: 'Piscina infinita', id: '170224696' }, { name: 'Ginástica comum', id: '256359073' },
        { name: 'Ginástica moderna', id: '256359763' }, { name: 'Touro mecânico', id: '256359770' },
        { name: 'Trator cortador', id: '256359778' }, { name: 'TV de tela plana', id: '256699163' }
    ];

    // --- LÓGICA DA AUTOMAÇÃO EM FILA (Refatorada para jQuery) ---

    function startAutomation() {
        if (!confirm('Iniciar a automação de todos os ' + ALL_ITEMS.length + ' itens?')) return;
        const initialState = { isRunning: true, currentIndex: 0, currentStep: 'start' };
        sessionStorage.setItem(STATE_KEY, JSON.stringify(initialState));
        processCurrentItem();
    }

    function stopAutomation() {
        sessionStorage.removeItem(STATE_KEY);
        alert('Automação interrompida.');
        location.reload();
    }

    function advanceToNextItem() {
        const state = JSON.parse(sessionStorage.getItem(STATE_KEY));
        state.currentIndex++;
        state.currentStep = 'start';

        if (state.currentIndex >= ALL_ITEMS.length) {
            sessionStorage.removeItem(STATE_KEY);
            alert('Automação concluída! Todos os itens foram processados.');
            location.reload();
        } else {
            sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
            setTimeout(processCurrentItem, 2000);
        }
    }

    async function processCurrentItem() {
        const state = JSON.parse(sessionStorage.getItem(STATE_KEY));
        if (!state || !state.isRunning) return;

        const item = ALL_ITEMS[state.currentIndex];
        updateUI(state);

        switch (state.currentStep) {
            case 'start':
                console.log(`Iniciando item ${item.name}`);
                state.currentStep = 'checkAndDecide';
                sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
                window.location.href = `https://${SERVER_URL}/World/Popmundo.aspx/Locale/ItemDetails/${item.id}`;
                break;
            case 'checkAndDecide':
                await executeCheckAndDecide(state, item);
                break;
            case 'navigateToItemAgain':
                executeNavigateToItemAgain(state, item);
                break;
            case 'clickUseButton':
                await executeClickUseButton(state, item);
                break;
            case 'item_finished_advancing':
                advanceToNextItem();
                break;
        }
    }

    async function executeCheckAndDecide(state, item) {
        const moveLink = $('a').filter(function() { return $(this).text().trim() === 'Mover-se para este local'; });
        if (moveLink.length > 0) {
            state.currentStep = 'navigateToItemAgain';
            sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
            moveLink[0].click();
        } else {
            await executeClickUseButton(state, item);
        }
    }

    function executeNavigateToItemAgain(state, item) {
        state.currentStep = 'clickUseButton';
        sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
        window.location.href = `https://${SERVER_URL}/World/Popmundo.aspx/Locale/ItemDetails/${item.id}`;
    }

    async function executeClickUseButton(state, item) {
        const useButton = $('#ctl00_cphLeftColumn_ctl00_btnItemUse');
        if (useButton.length > 0) {
            state.currentStep = 'item_finished_advancing';
            sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
            useButton[0].click();
        } else {
            // Espera um pouco, caso a página seja lenta
            await new Promise(r => setTimeout(r, 1000));
            const useButtonAfterWait = $('#ctl00_cphLeftColumn_ctl00_btnItemUse');
            if (useButtonAfterWait.length > 0) {
                 state.currentStep = 'item_finished_advancing';
                 sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
                 useButtonAfterWait[0].click();
            } else {
                alert(`Falha ao encontrar o botão 'Usar' para ${item.name}. Interrompendo automação.`);
                stopAutomation();
            }
        }
    }

    // --- GERENCIAMENTO DA INTERFACE ---

    function updateUI(state) {
        const percent = state.currentIndex / ALL_ITEMS.length * 100;
        $('#progress-bar').css('width', `${percent}%`);

        if (state.isRunning) {
            const item = ALL_ITEMS[state.currentIndex];
            $('#automation-status').html(`
                [${state.currentIndex + 1}/${ALL_ITEMS.length}] Processando:<br>
                <strong>${item.name}</strong>
            `);
        }
    }

    function createControlPanel() {
        if (window.self !== window.top) return;

        $('body').append('<div id="automation-panel"></div>');
        const panel = $('#automation-panel');
        const state = JSON.parse(sessionStorage.getItem(STATE_KEY));

        if (state && state.isRunning) {
            panel.html(`
                <div class="panel-header"><h2><i class="fa-solid fa-robot fa-spin"></i>Automação Ativa</h2></div>
                <div id="progress-bar-container"><div id="progress-bar"></div></div>
                <div id="automation-status">Carregando...</div>
                <button id="stop-automation-btn" class="action-button stop-button"><i class="fa-solid fa-stop"></i>Parar Automação</button>
            `);
            $('#stop-automation-btn').on('click', stopAutomation);
            updateUI(state); // Atualiza a UI com o estado atual
        } else {
            panel.html(`
                <div class="panel-header"><h2><i class="fa-solid fa-bolt"></i>Assistente</h2></div>
                <div id="automation-status">Pronto para iniciar a automação de ${ALL_ITEMS.length} itens.</div>
                <button id="start-automation-btn" class="action-button start-button"><i class="fa-solid fa-play"></i>Iniciar Automação</button>
            `);
            $('#start-automation-btn').on('click', startAutomation);
        }
    }

    // --- PONTO DE ENTRADA DO SCRIPT ---
    $(document).ready(function() {
        createControlPanel();
        const stateJSON = sessionStorage.getItem(STATE_KEY);
        if (stateJSON && JSON.parse(stateJSON).isRunning) {
            processCurrentItem();
        }
    });

})();
