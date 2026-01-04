// ==UserScript==
// @name         Mim dê dinheiro, papai
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  xxx
// @author       Popper
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550497/Mim%20d%C3%AA%20dinheiro%2C%20papai.user.js
// @updateURL https://update.greasyfork.org/scripts/550497/Mim%20d%C3%AA%20dinheiro%2C%20papai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // CONFIGURAÇÕES
    // =================================================================================
    const DEFAULT_AMOUNT = 100;
    // =================================================================================
    // FIM DAS CONFIGURAÇÕES
    // =================================================================================

    const STATE_KEY = 'moneyTransferState_v5';
    const STEPS = { IDLE: 0, GOTO_PROFILE: 1, GOTO_GIVEMONEY: 2, SUBMIT_MONEY: 3 };
    let iframe = null;

    const saveState = (state) => sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
    const loadState = () => JSON.parse(sessionStorage.getItem(STATE_KEY) || '{}');
    const clearState = () => sessionStorage.removeItem(STATE_KEY);

    function log(message) {
        const logArea = document.getElementById('transfer-log');
        if (logArea) {
            logArea.value += `[${new Date().toLocaleTimeString()}] ${message}\n`;
            logArea.scrollTop = logArea.scrollHeight;
        }
        console.log(`[Transfer Script] ${message}`);
    }

    function createUI() {
        const header = document.querySelector('h1');
        if (!header || header.innerText !== 'Relacionamentos' || document.getElementById('transfer-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'transfer-panel';
        panel.style.cssText = `
            border: 2px solid #4a90e2; padding: 15px; margin: 20px 0; background-color: #f0f8ff;
            border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-size: 14px;
        `;

        panel.innerHTML = `
            <h3 style="margin-top:0; color:#333;"><span class="material-icons" style="vertical-align: middle;">paid</span> Painel de Transferência Inteligente</h3>
            <p style="margin-bottom: 10px;"><strong>1. Selecione os destinatários</strong> na tabela abaixo.</p>
            <div style="margin: 10px 0;">
                <label for="transfer-amount-input" style="font-weight: bold;"><strong>2. Defina a quantia a enviar:</strong></label>
                <input type="number" id="transfer-amount-input" value="${DEFAULT_AMOUNT}" min="1" class="round" style="width: 120px; margin-left: 10px; padding: 5px; text-align: right;">
                <span style="margin-left: 5px;">M$</span>
            </div>
            <div style="margin: 15px 0;">
                <strong style="display: block; margin-bottom: 5px;">3. Verifique os selecionados:</strong>
                <ul id="selected-characters-list" style="list-style-type: square; background: #fff; border: 1px solid #ccc; padding: 10px 10px 10px 30px; margin: 0; max-height: 120px; overflow-y: auto; border-radius: 4px;">
                    <li style="color: #888;"><em>Nenhum personagem selecionado.</em></li>
                </ul>
            </div>
            <button id="start-transfer-btn" class="modern" style="margin-right: 10px; background-color: #4CAF50; color: white;">▶ Iniciar Transferências</button>
            <button id="stop-transfer-btn" class="modern cnf">■ Parar Processo</button>
            <div id="transfer-status" style="margin-top: 15px; font-weight: bold; font-size: 1.1em; color: #4a90e2;">Status: Ocioso</div>
            <h4 style="margin-bottom: 5px; margin-top: 15px;">Log de Atividades:</h4>
            <textarea id="transfer-log" readonly style="width: 100%; height: 120px; resize: vertical; background: #fff; border: 1px solid #ccc;"></textarea>
        `;
        header.parentNode.insertBefore(panel, header.nextSibling);

        document.getElementById('start-transfer-btn').addEventListener('click', startProcess);
        document.getElementById('stop-transfer-btn').addEventListener('click', stopProcess);

        attachCheckboxListeners(); // **NOVO: Anexa os listeners aos checkboxes**
        clearState();
    }

    // **NOVA FUNÇÃO: Atualiza a lista de nomes no painel**
    function updateSelectedList() {
        const listElement = document.getElementById('selected-characters-list');
        if (!listElement) return;

        const selectedNames = [];
        const rows = document.querySelectorAll('table.data tbody tr');
        rows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const link = row.querySelector('a[id*="_lnkCharacter"]');
            if (checkbox && link && checkbox.checked) {
                selectedNames.push(link.textContent.trim());
            }
        });

        listElement.innerHTML = ''; // Limpa a lista anterior
        if (selectedNames.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<em style="color: #888;">Nenhum personagem selecionado.</em>';
            listElement.appendChild(li);
        } else {
            selectedNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                listElement.appendChild(li);
            });
        }
    }

    // **NOVA FUNÇÃO: Anexa o listener de mudança a todos os checkboxes**
    function attachCheckboxListeners() {
        const checkboxes = document.querySelectorAll('table.data tbody tr input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateSelectedList);
        });
        log("Pronto para receber seleções. Marque os checkboxes para começar.");
    }

    function createIframe() {
        if (iframe) return;
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.addEventListener('load', handleIframeLoad);
        document.body.appendChild(iframe);
        log('Frame invisível criado.');
    }

    function updateStatus(message) {
        document.getElementById('transfer-status').textContent = `Status: ${message}`;
    }

    function startProcess() {
        const amountInput = document.getElementById('transfer-amount-input');
        const amount = parseInt(amountInput.value, 10);

        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, insira um valor em dinheiro válido e maior que zero.');
            return;
        }

        updateStatus('Iniciando...');
        document.getElementById('start-transfer-btn').disabled = true;

        createIframe();
        clearState();

        const targets = [];
        const rows = document.querySelectorAll('table.data tbody tr');
        rows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const link = row.querySelector('a[id*="_lnkCharacter"]');
            if (checkbox && link && checkbox.checked) {
                targets.push({ name: link.textContent.trim(), url: link.href });
            }
        });

        if (targets.length === 0) {
            log('ERRO: Nenhum personagem foi selecionado.');
            updateStatus('Erro: Nenhum personagem selecionado.');
            alert('Por favor, selecione pelo menos um personagem usando as caixas de seleção.');
            document.getElementById('start-transfer-btn').disabled = false;
            return;
        }

        log(`Alvos confirmados: ${targets.map(t => t.name).join(', ')}. Valor a ser enviado: ${amount} M$`);
        const state = {
            running: true, targets, currentIndex: 0, step: STEPS.IDLE, amount
        };
        saveState(state);
        processNextTarget();
    }

    function stopProcess() {
        log('Processo interrompido.');
        updateStatus('Ocioso. Processo parado.');
        clearState();
        if (iframe) iframe.src = 'about:blank';
        const startBtn = document.getElementById('start-transfer-btn');
        if(startBtn) startBtn.disabled = false;
    }

    function processNextTarget() {
        const state = loadState();
        if (!state.running) return;

        if (state.currentIndex >= state.targets.length) {
            log('Todas as transferências foram concluídas com sucesso!');
            updateStatus('Processo Concluído!');
            stopProcess();
            alert('Todas as transferências para os personagens selecionados foram concluídas!');
            return;
        }

        const currentTarget = state.targets[state.currentIndex];
        updateStatus(`Processando ${state.currentIndex + 1}/${state.targets.length}: ${currentTarget.name}`);
        log(`Iniciando para ${currentTarget.name}. Navegando para o perfil...`);
        state.step = STEPS.GOTO_PROFILE;
        saveState(state);
        iframe.src = currentTarget.url;
    }

    function handleIframeLoad() {
        const state = loadState();
        if (!state.running) return;

        try {
            const iframeDoc = iframe.contentWindow.document;
            const currentTarget = state.targets[state.currentIndex];

            switch (state.step) {
                case STEPS.GOTO_PROFILE:
                    log(`Perfil de ${currentTarget.name} carregado. Procurando link "Dar dinheiro"...`);
                    const giveMoneyLink = iframeDoc.querySelector('a[href*="/Character/GiveMoney/"]');
                    if (giveMoneyLink) {
                        log('Link encontrado. Clicando...');
                        state.step = STEPS.GOTO_GIVEMONEY;
                        saveState(state);
                        giveMoneyLink.click();
                    } else { throw new Error('Link "Dar dinheiro" não encontrado.'); }
                    break;

                case STEPS.GOTO_GIVEMONEY:
                    log(`Página "Dar dinheiro" carregada. Preenchendo ${state.amount} M$...`);
                    const amountInput = iframeDoc.getElementById('ctl00_cphLeftColumn_ctl00_txtPT');
                    const submitButton = iframeDoc.getElementById('ctl00_cphLeftColumn_ctl00_btnHandOverMoney');
                    if (amountInput && submitButton) {
                        amountInput.value = state.amount;
                        log('Valor preenchido. Enviando formulário...');
                        state.step = STEPS.SUBMIT_MONEY;
                        saveState(state);
                        submitButton.click();
                    } else { throw new Error('Formulário de transferência não encontrado.'); }
                    break;

                case STEPS.SUBMIT_MONEY:
                    log(`Transferência para ${currentTarget.name} concluída.`);
                    state.currentIndex++;
                    saveState(state);
                    setTimeout(processNextTarget, 1500);
                    break;
            }
        } catch (error) {
            log(`ERRO: ${error.message}. Pulando para o próximo alvo.`);
            const state = loadState();
            state.currentIndex++;
            saveState(state);
            setTimeout(processNextTarget, 1500);
        }
    }

    function addImportantNote() {
        const panel = document.getElementById('transfer-panel');
        if(panel) {
            const note = document.createElement('p');
            note.innerHTML = '<strong>Atenção:</strong> O Popmundo permite apenas uma transferência de dinheiro por personagem a cada hora. Se você tentar transferir novamente dentro deste período, a ação falhará.';
            note.style.cssText = 'font-style: italic; color: #c0392b; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;';
            panel.appendChild(note);
        }
    }

    createUI();
    addImportantNote();

})();
