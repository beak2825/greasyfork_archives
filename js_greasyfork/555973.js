// ==UserScript==
// @name         Popmundo Super Agendador - Estilo Kit (TURBO + BULK)
// @namespace    http://tampermonkey.net/
// @version      5.7_kitstyle_turbo_bulk
// @description  Agendador otimizado com adição em massa e tempos de resposta rápidos.
// @author       Popper
// @match        *://*.popmundo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      cdnjs.cloudflare.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/555973/Popmundo%20Super%20Agendador%20-%20Estilo%20Kit%20%28TURBO%20%2B%20BULK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555973/Popmundo%20Super%20Agendador%20-%20Estilo%20Kit%20%28TURBO%20%2B%20BULK%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof $ === 'undefined') {
        console.error('[PPM Agendador Kit] ERRO FATAL: jQuery não foi carregado pelo @require!');
        alert('PPM Agendador Kit: ERRO FATAL - jQuery não carregou. O script não funcionará.');
        return;
    }
    console.log('[PPM Agendador Kit] jQuery carregado via @require.');

    const faURL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    GM_xmlhttpRequest({
        method: "GET", url: faURL,
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                let css = response.responseText;
                const baseFontURL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/';
                css = css.replace(/url\((['"]?)\.\.\/webfonts\//g, `url($1${baseFontURL}webfonts/`);
                GM_addStyle(css);
                console.log('[PPM Agendador Kit] Font Awesome CSS carregado.');
            } else { console.error('[PPM Agendador Kit] Falha ao carregar Font Awesome CSS.'); }
        },
        onerror: function(response) { console.error('[PPM Agendador Kit] Erro de rede ao carregar Font Awesome CSS.'); }
    });

    let config = {
        delayMinutes: parseInt(GM_getValue('pm_kit_delayMinutes', 15), 10),
        autoRun: GM_getValue('pm_kit_autoRun', false),
        mainCharacterName: GM_getValue('pm_kit_mainCharName', "Mark Sheehan"),
        secondaryCharacterName: GM_getValue('pm_kit_secondaryCharName', "Gene Rowland"),
        actionLog: JSON.parse(GM_getValue('pm_kit_actionLog', '[]')),
        maxLogEntries: 50
    };

    let activityQueue = JSON.parse(GM_getValue('pm_kit_activityQueue', '[]'));
    let currentProcessStep = GM_getValue('pm_kit_currentStep', 'IDLE');
    let currentActivityNameFromQueue = GM_getValue('pm_kit_currentActivityNameFromQueue', null);
    let createdActivityDetails = JSON.parse(GM_getValue('pm_kit_createdActivityDetails', '{}'));
    let panelPosition = JSON.parse(GM_getValue('pm_kit_panelPosition', '{ "top": "60px", "left": "auto", "right": "15px" }'));

    let nextScheduledRun = GM_getValue('pm_kit_nextScheduledRun', 0);
    let panel = null;
    let statusDiv = null;
    let queueListDiv = null;
    let actionLogDiv = null;
    let countdownInterval = null;

    const MAX_LOG_ENTRIES = config.maxLogEntries;

    // --- CSS ---
    GM_addStyle(`
        :root { /* ... variáveis CSS ... */
            --panel-bg: #f0f3f5; --panel-border: #c8d0d8; --header-bg: #e4e9ed;
            --header-text: #334e68; --tab-bg: transparent; --tab-hover-bg: #d8dfe5;
            --tab-active-bg: #fff; --tab-active-border: #007bff; --tab-text: #506d8b;
            --tab-active-text: #0056b3; --content-bg: #fff; --label-text: #486581;
            --input-bg: #fff; --input-border: #bacad6; --input-focus-border: #007bff;
            --input-text: #273444; --button-primary-bg: #007bff;
            --button-primary-hover-bg: #0069d9; --button-secondary-bg: #6c757d;
            --button-secondary-hover-bg: #5a6268; --button-danger-bg: #dc3545;
            --button-danger-hover-bg: #c82333; --button-warning-bg: #ffc107;
            --button-warning-hover-bg: #e0a800; --button-info-bg: #17a2b8;
            --button-info-hover-bg: #138496; --button-text-color: #fff;
            --status-text: #506d8b; --log-bg: #f8f9fa; --log-border: #e9ecef;
            --log-entry-border: #dfe6ec; --text-muted: #6c757d;
            --shadow-color: rgba(0, 0, 0, 0.1);
        }
        #pmKitPanel {
            position: fixed; width: 340px; background-color: var(--panel-bg);
            border: 1px solid var(--panel-border); border-radius: 6px;
            box-shadow: 0 3px 10px var(--shadow-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px; color: var(--input-text); z-index: 10001;
            overflow: hidden; display: none;
        }
        #pmKitPanel.pm-dragging { cursor: grabbing; opacity: 0.9; }
        .pm-kit-header {
            padding: 8px 12px; background-color: var(--header-bg); color: var(--header-text);
            font-size: 1.15em; font-weight: 600; text-align: center;
            border-bottom: 1px solid var(--panel-border); cursor: move; user-select: none;
        }
        .pm-kit-header i { margin-right: 8px; }
        .pm-kit-tabs { display: flex; background-color: var(--header-bg); padding: 0 5px; }
        .pm-kit-tab-button {
            flex-grow: 1; padding: 8px 5px; background-color: var(--tab-bg);
            border: none; border-bottom: 3px solid transparent; color: var(--tab-text);
            cursor: pointer; font-size: 0.9em; font-weight: 500; text-align: center;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            outline: none; white-space: nowrap;
        }
        .pm-kit-tab-button:hover { background-color: var(--tab-hover-bg); color: var(--tab-active-text); }
        .pm-kit-tab-button.active {
            background-color: var(--tab-active-bg); color: var(--tab-active-text);
            border-bottom-color: var(--tab-active-border); font-weight: 600;
        }
        .pm-kit-tab-button i { margin-right: 4px; }
        .pm-kit-tab-content-wrapper {
            padding: 12px; background-color: var(--content-bg);
            max-height: 480px; overflow-y: auto; overflow-x: hidden;
        }
        .pm-kit-tab-content { display: none; }
        .pm-kit-tab-content.active { display: block; animation: pmKitFadeIn 0.3s ease-out; }
        @keyframes pmKitFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .pm-kit-section h4 {
            font-size: 1em; color: var(--header-text); margin-top: 15px; margin-bottom: 8px;
            padding-bottom: 4px; border-bottom: 1px dashed var(--panel-border);
        }
        .pm-kit-section:first-child h4 { margin-top: 0; }
        #pmKitPanel label {
            display: block; font-size: 0.9em; color: var(--label-text);
            margin-bottom: 3px; font-weight: 500;
        }
        #pmKitPanel input[type="text"], #pmKitPanel input[type="number"], #pmKitPanel select {
            width: 100%; padding: 6px 8px; margin-bottom: 8px;
            border: 1px solid var(--input-border); border-radius: 4px;
            background-color: var(--input-bg); color: var(--input-text);
            box-sizing: border-box; font-size: 0.95em;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #pmKitPanel input[type="text"]:focus, #pmKitPanel input[type="number"]:focus, #pmKitPanel select:focus {
            border-color: var(--input-focus-border);
            box-shadow: 0 0 0 0.15rem rgba(0,123,255,.25); outline: none;
        }
        #pmKitPanel button {
            padding: 7px 12px; border: none; border-radius: 4px; cursor: pointer;
            color: var(--button-text-color); font-weight: 500; font-size: 0.9em;
            transition: background-color 0.15s ease-in-out, transform 0.1s ease;
            margin-right: 5px;
        }
        #pmKitPanel button:last-child { margin-right: 0; }
        #pmKitPanel button:hover { filter: brightness(110%); }
        #pmKitPanel button:active { transform: scale(0.98); filter: brightness(90%);}
        #pmKitPanel button i { margin-right: 5px; }
        button.pm-kit-btn-add { background-color: var(--button-info-bg); }
        button.pm-kit-btn-add:hover { background-color: var(--button-info-hover-bg); }
        button.pm-kit-btn-toggle-run { background-color: var(--button-primary-bg); }
        button.pm-kit-btn-toggle-run.stop { background-color: var(--button-danger-bg); }
        button.pm-kit-btn-toggle-run:hover { filter: brightness(115%); }
        button.pm-kit-btn-save { background-color: #28a745; }
        button.pm-kit-btn-save:hover { background-color: #218838; }
        button.pm-kit-btn-remove-item {
            background-color: transparent; color: var(--button-danger-bg);
            padding: 3px 5px; font-size: 1.1em; border: 1px solid transparent;
        }
        button.pm-kit-btn-remove-item:hover { background-color: rgba(220,53,69,0.1); border-color: rgba(220,53,69,0.3); }
        button.pm-kit-btn-remove-item i { margin-right: 0; }
        #pmKitPanelStatus {
            padding: 8px; margin-top: 10px; background-color: #e9ecef;
            border: 1px solid var(--log-border); border-radius: 4px; font-size: 0.9em;
            text-align: center; word-wrap: break-word; color: var(--status-text);
        }
        #pmKitPanelStatus i { margin-right: 5px; }
        #pmKitActionLogContainer { margin-top: 10px; }
        #pmKitActionLogContainer h5 {
            font-size: 0.95em; margin-bottom: 5px; color: var(--label-text);
            display: flex; justify-content: space-between; align-items: center;
        }
        #pmKitActionLogContainer h5 i { margin-right: 5px; }
        button#pmKitClearLog {
            background-color: transparent; color: var(--text-muted); font-size: 0.8em;
            padding: 2px 6px; border: 1px solid var(--text-muted);
        }
        button#pmKitClearLog:hover { background-color: var(--text-muted); color: #fff; }
        #pmKitActionLog {
            background-color: var(--log-bg); border: 1px solid var(--log-border);
            border-radius: 4px; padding: 8px; max-height: 120px; overflow-y: auto;
            font-size: 0.85em; color: #495057;
        }
        .pm-kit-log-entry {
            padding-bottom: 4px; margin-bottom: 4px;
            border-bottom: 1px dotted var(--log-entry-border);
            word-break: break-word; line-height: 1.4;
        }
        .pm-kit-log-entry:last-child { border-bottom: none; margin-bottom: 0; }
        .pm-kit-log-entry i { margin-right: 4px; }
        .pm-kit-log-time { font-weight: 600; color: var(--text-muted); margin-right: 5px;}
        #pmKitActivityQueueList {
            margin-top: 5px; padding: 0; background-color: var(--content-bg);
            border: 1px solid var(--input-border); border-radius: 4px;
            max-height: 120px; overflow-y: auto;
        }
        .pm-kit-queue-item {
            padding: 6px 10px; border-bottom: 1px solid var(--log-entry-border);
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.95em;
        }
        .pm-kit-queue-item:last-child { border-bottom: none; }
        .pm-kit-queue-item span { flex-grow: 1; word-break: break-all; margin-right: 8px; }
        #pmKitActivityQueueList.empty {
            padding: 10px; text-align: center; color: var(--text-muted); font-style: italic;
        }
        .pm-kit-main-controls {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 8px; margin-top: 15px;
        }
        .pm-kit-main-controls button { width: 100%; margin-right: 0; }
        .pm-kit-flex-row { display: flex; gap: 8px; }
        .pm-kit-flex-col { flex: 1; }
    `);

    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'pmKitPanel';
        panel.style.top = panelPosition.top;
        panel.style.left = panelPosition.left;
        if (panelPosition.left === 'auto') {
            panel.style.right = panelPosition.right;
        } else {
            panel.style.right = 'auto';
        }

        panel.innerHTML = `
            <div class="pm-kit-header"><i class="fas fa-rocket"></i>PPM Agendador Kit</div>
            <div class="pm-kit-tabs">
                <button class="pm-kit-tab-button active" data-tab="status"><i class="fas fa-tachometer-alt"></i>Status</button>
                <button class="pm-kit-tab-button" data-tab="fila"><i class="fas fa-tasks"></i>Fila</button>
                <button class="pm-kit-tab-button" data-tab="config"><i class="fas fa-cogs"></i>Opções</button>
            </div>
            <div class="pm-kit-tab-content-wrapper">
                <div class="pm-kit-tab-content active" id="pm-tab-status">
                    <div id="pmKitPanelStatus">Aguardando...</div>
                    <div id="pmKitActionLogContainer">
                        <h5><i class="fas fa-history"></i>Log de Ações <button id="pmKitClearLog" title="Limpar Log"><i class="fas fa-eraser"></i></button></h5>
                        <div id="pmKitActionLog">Log vazio.</div>
                    </div>
                </div>
                <div class="pm-kit-tab-content" id="pm-tab-fila">
                    <div class="pm-kit-section">
                        <h4><i class="fas fa-plus-square"></i>Adicionar Individual</h4>
                        <label for="pm-kit-activity-name">Nome da Atividade:</label>
                        <input type="text" id="pm-kit-activity-name" placeholder="Ex: Jogo da Vitória">
                        <button id="pm-kit-add-to-queue" class="pm-kit-btn-add" style="width:100%;"><i class="fas fa-calendar-plus"></i>Adicionar à Fila</button>
                    </div>

                    <!-- NOVA SEÇÃO DE ADIÇÃO EM MASSA -->
                    <div class="pm-kit-section">
                        <h4><i class="fas fa-layer-group"></i>Adicionar em Massa</h4>
                        <label for="pm-kit-bulk-name">Nome Base:</label>
                        <input type="text" id="pm-kit-bulk-name" placeholder="Ex: Torneio">
                        <div class="pm-kit-flex-row">
                            <div class="pm-kit-flex-col">
                                <label for="pm-kit-bulk-qty">Qtd:</label>
                                <input type="number" id="pm-kit-bulk-qty" value="10" min="1">
                            </div>
                            <div class="pm-kit-flex-col">
                                <label for="pm-kit-bulk-start">Início #:</label>
                                <input type="number" id="pm-kit-bulk-start" value="1" min="1">
                            </div>
                        </div>
                        <button id="pm-kit-bulk-add" class="pm-kit-btn-add" style="width:100%; background-color:#6f42c1;"><i class="fas fa-plus-circle"></i>Adicionar Vários</button>
                    </div>
                    <!-- FIM SEÇÃO EM MASSA -->

                    <div class="pm-kit-section">
                        <h4><i class="fas fa-list-ol"></i>Próximas Atividades (<span id="queue-count">0</span>)</h4>
                        <button id="pm-kit-clear-queue" class="pm-kit-btn-remove-item" style="width:100%; margin-bottom:5px; text-align:center; color:#dc3545; border:1px solid #dc3545;">Limpar Fila Inteira</button>
                        <div id="pmKitActivityQueueList" class="empty">Vazia</div>
                    </div>
                </div>
                <div class="pm-kit-tab-content" id="pm-tab-config">
                    <div class="pm-kit-section">
                        <h4><i class="fas fa-users"></i>Personagens</h4>
                        <label for="pm-kit-main-char-name">Principal (Criador/Admin):</label>
                        <input type="text" id="pm-kit-main-char-name">
                        <label for="pm-kit-secondary-char-name">Secundário (Inscritor):</label>
                        <input type="text" id="pm-kit-secondary-char-name">
                    </div>
                    <div class="pm-kit-section">
                        <h4><i class="fas fa-clock"></i>Intervalos</h4>
                        <label for="pm-kit-delay-minutes">Intervalo entre Atividades (min):</label>
                        <input type="number" id="pm-kit-delay-minutes" min="0">
                    </div>
                    <div class="pm-kit-main-controls" style="margin-top: 20px;">
                         <button id="pm-kit-toggle-auto" class="pm-kit-btn-toggle-run" title="">
                        </button>
                        <button id="pm-kit-save-settings" class="pm-kit-btn-save"><i class="fas fa-save"></i>Salvar Tudo</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        $(panel).fadeIn(300);

        statusDiv = document.getElementById('pmKitPanelStatus');
        queueListDiv = document.getElementById('pmKitActivityQueueList');
        actionLogDiv = document.getElementById('pmKitActionLog');

        document.querySelectorAll('.pm-kit-tab-button').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.pm-kit-tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.pm-kit-tab-content').forEach(content => content.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('pm-tab-' + this.dataset.tab).classList.add('active');
            });
        });

        document.getElementById('pm-kit-toggle-auto').addEventListener('click', toggleAutomation);
        document.getElementById('pm-kit-save-settings').addEventListener('click', saveSettings);
        document.getElementById('pm-kit-add-to-queue').addEventListener('click', addActivityToQueue);
        document.getElementById('pm-kit-bulk-add').addEventListener('click', bulkAddActivities); // Botão em Massa
        document.getElementById('pm-kit-clear-queue').addEventListener('click', clearEntireQueue);
        document.getElementById('pmKitClearLog').addEventListener('click', clearActionLog);

        $('#pm-kit-main-char-name').val(config.mainCharacterName);
        $('#pm-kit-secondary-char-name').val(config.secondaryCharacterName);
        $('#pm-kit-delay-minutes').val(config.delayMinutes);

        makePanelDraggable(panel, panel.querySelector('.pm-kit-header'));
        renderActivityQueue();
        updateActionLogDisplay();
        updatePanelUIState();
    }

    function makePanelDraggable(panelElement, handleElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handleElement.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            panelElement.classList.add('pm-dragging');
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = panelElement.offsetTop - pos2;
            let newLeft = panelElement.offsetLeft - pos1;
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const panelW = panelElement.offsetWidth;
            const panelH = panelElement.offsetHeight;
            newTop = Math.max(0, Math.min(newTop, winH - panelH));
            newLeft = Math.max(0, Math.min(newLeft, winW - panelW));
            panelElement.style.top = newTop + "px";
            panelElement.style.left = newLeft + "px";
            panelElement.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            panelElement.classList.remove('pm-dragging');
            panelPosition = { top: panelElement.style.top, left: panelElement.style.left, right: panelElement.style.right };
            GM_setValue('pm_kit_panelPosition', JSON.stringify(panelPosition));
        }
    }

    function saveSettings() {
        config.delayMinutes = parseInt($('#pm-kit-delay-minutes').val(), 10);
        config.mainCharacterName = $('#pm-kit-main-char-name').val().trim();
        config.secondaryCharacterName = $('#pm-kit-secondary-char-name').val().trim();
        if (isNaN(config.delayMinutes) || config.delayMinutes < 0) config.delayMinutes = 15;
        GM_setValue('pm_kit_delayMinutes', config.delayMinutes);
        GM_setValue('pm_kit_mainCharName', config.mainCharacterName);
        GM_setValue('pm_kit_secondaryCharName', config.secondaryCharacterName);
        logAction("Configurações salvas.", "event");
        updateStatus("Configurações salvas!");
    }

    // --- NOVA FUNÇÃO DE ADIÇÃO EM MASSA ---
    function bulkAddActivities() {
        const baseName = $('#pm-kit-bulk-name').val().trim();
        const qty = parseInt($('#pm-kit-bulk-qty').val(), 10);
        const startNum = parseInt($('#pm-kit-bulk-start').val(), 10);

        if (!baseName) {
            updateStatus("Insira um nome base para o lote.");
            return;
        }
        if (isNaN(qty) || qty <= 0) {
            updateStatus("Quantidade inválida.");
            return;
        }
        if (isNaN(startNum)) {
            updateStatus("Número inicial inválido.");
            return;
        }

        let addedCount = 0;
        for (let i = 0; i < qty; i++) {
            const currentNumber = startNum + i;
            const activityName = `${baseName} ${currentNumber}`;
            // Adiciona um pequeno offset ao ID para garantir unicidade
            activityQueue.push({ id: Date.now() + i, name: activityName, href: null });
            addedCount++;
        }

        GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
        renderActivityQueue();
        logAction(`${addedCount} atividades ("${baseName} #") adicionadas à fila.`, "add");
        updateStatus(`${addedCount} itens adicionados!`);
        $('#pm-kit-bulk-name').val(''); // Limpa o campo
    }
    // -------------------------------------

    function addActivityToQueue() {
        const nameInput = $('#pm-kit-activity-name');
        const activityName = nameInput.val().trim();
        if (activityName) {
            activityQueue.push({ id: Date.now(), name: activityName, href: null });
            GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
            renderActivityQueue();
            nameInput.val('');
            logAction(`"${activityName}" adicionado à fila.`, "add");
        } else { updateStatus("Insira um nome para a atividade."); }
    }

    function renderActivityQueue() {
        if (!queueListDiv) return;
        const countSpan = document.getElementById('queue-count');
        if (countSpan) countSpan.textContent = activityQueue.length;

        if (activityQueue.length === 0) {
            queueListDiv.innerHTML = "Vazia";
            queueListDiv.classList.add('empty'); return;
        }
        queueListDiv.innerHTML = '';
        queueListDiv.classList.remove('empty');

        // Renderiza apenas os primeiros 100 itens visualmente para não travar o navegador se houver milhares
        const maxRender = 100;
        const itemsToRender = activityQueue.slice(0, maxRender);

        itemsToRender.forEach(activity => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'pm-kit-queue-item';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = activity.name; nameSpan.title = activity.name;
            itemDiv.appendChild(nameSpan);
            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            removeButton.className = 'pm-kit-btn-remove-item'; removeButton.title = "Remover da Fila";
            removeButton.onclick = () => removeActivityFromQueue(activity.id);
            itemDiv.appendChild(removeButton);
            queueListDiv.appendChild(itemDiv);
        });

        if (activityQueue.length > maxRender) {
            const moreDiv = document.createElement('div');
            moreDiv.style.textAlign = 'center';
            moreDiv.style.padding = '5px';
            moreDiv.style.color = '#777';
            moreDiv.style.fontStyle = 'italic';
            moreDiv.textContent = `... e mais ${activityQueue.length - maxRender} itens na fila.`;
            queueListDiv.appendChild(moreDiv);
        }
    }

    function removeActivityFromQueue(activityId) {
        const removedItem = activityQueue.find(act => act.id === activityId);
        activityQueue = activityQueue.filter(activity => activity.id !== activityId);
        GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
        renderActivityQueue();
        if(removedItem) logAction(`"${removedItem.name}" removido da fila.`, "remove");
        else logAction("Item removido da fila.", "remove");
    }

    function clearEntireQueue() {
        if (activityQueue.length === 0) return;
        if(confirm("Tem certeza que deseja apagar TODAS as atividades da fila?")) {
            activityQueue = [];
            GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
            renderActivityQueue();
            logAction("Fila inteira foi limpa.", "remove");
        }
    }

    function updatePanelUIState() {
        if (!panel) return;
        const toggleButton = document.getElementById('pm-kit-toggle-auto');
        if (config.autoRun) {
            toggleButton.innerHTML = '<i class="fas fa-stop-circle"></i>Parar';
            toggleButton.classList.add('stop'); toggleButton.title = "Parar Automação";
        } else {
            toggleButton.innerHTML = '<i class="fas fa-play-circle"></i>Iniciar';
            toggleButton.classList.remove('stop'); toggleButton.title = "Iniciar Automação";
        }
    }
    function toggleAutomation() {
        config.autoRun = !config.autoRun;
        GM_setValue('pm_kit_autoRun', config.autoRun);
        logAction(`Automação ${config.autoRun ? 'INICIADA' : 'PARADA'}.`, config.autoRun ? "start" : "stop");
        if (config.autoRun) {
            updateStatus("Processamento da fila iniciado.");
            if (['IDLE', 'QUEUE_WAITING_INTERVAL', 'QUEUE_IDLE_OR_STARTING'].includes(currentProcessStep)) {
                setStep('QUEUE_IDLE_OR_STARTING'); nextScheduledRun = Date.now(); GM_setValue('pm_kit_nextScheduledRun', nextScheduledRun);
            }
            mainLogic();
        } else {
            updateStatus("Processamento da fila parado."); setStep('IDLE');
            if (countdownInterval) clearInterval(countdownInterval);
        }
        updatePanelUIState();
    }

    function logAction(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second:'2-digit' });
        let iconClass = "fas fa-info-circle";
        if (type === "success" || type === "add" || type === "start") iconClass = "fas fa-check-circle";
        else if (type === "error") iconClass = "fas fa-times-circle";
        else if (type === "remove" || type === "stop") iconClass = "fas fa-minus-circle";
        else if (type === "event") iconClass = "fas fa-cog";
        config.actionLog.unshift({ time: timestamp, text: message, icon: iconClass });
        if (config.actionLog.length > MAX_LOG_ENTRIES) config.actionLog.length = MAX_LOG_ENTRIES;
        GM_setValue('pm_kit_actionLog', JSON.stringify(config.actionLog));
        updateActionLogDisplay();
        console.log(`[PPM Agendador Kit Log][${timestamp}] ${message}`);
    }

    function updateActionLogDisplay() {
        if (!actionLogDiv) return;
        if (config.actionLog.length === 0) {
            actionLogDiv.innerHTML = "Log vazio."; return;
        }
        actionLogDiv.innerHTML = config.actionLog.map(entry =>
            `<div class="pm-kit-log-entry"><span class="pm-kit-log-time">${entry.time}</span> <i class="${entry.icon}"></i> ${entry.text}</div>`
        ).join('');
    }
    function clearActionLog() {
        if (confirm("Tem certeza que deseja limpar o log de ações?")) {
            config.actionLog = []; GM_setValue('pm_kit_actionLog', JSON.stringify(config.actionLog));
            updateActionLogDisplay(); logAction("Log limpo.", "event");
        }
    }

    function updateStatus(message) {
        if (statusDiv) statusDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    function setStep(step) {
        if (currentProcessStep !== step) {
            logAction(`Mudando step: ${currentProcessStep} -> ${step}`, "event");
            console.log(`[PPM Agendador Kit] Mudando step de ${currentProcessStep} para ${step}`);
            currentProcessStep = step; GM_setValue('pm_kit_currentStep', step);
        }
    }

    // Função para encontrar o elemento da barra de personagem, tentando os prefixos comuns
    function findCharacterBarElement(baseIdEnding) {
        let element = document.getElementById('ctl00_ctl08_ucCharacterBar_' + baseIdEnding);
        if (!element) {
            element = document.getElementById('ctl00_ctl09_ucCharacterBar_' + baseIdEnding);
        }
        return element;
    }

    function getCurrentCharacterName() {
        const charSelect = findCharacterBarElement('ddlCurrentCharacter');
        if (charSelect && charSelect.selectedIndex !== -1) {
            return charSelect.options[charSelect.selectedIndex].text.trim();
        }
        const charNameHeader = document.querySelector('div.characterbox h1');
        if (charNameHeader) {
            return charNameHeader.textContent.trim();
        }
        console.warn("[PPM Agendador Kit] Não foi possível determinar o nome do personagem atual.");
        return null;
    }

    async function switchCharacterByName(characterName, nextStepSuccess, attempt = 1) {
        const MAX_ATTEMPTS = 7;
        const RETRY_DELAY = 800; // OTIMIZAÇÃO: Reduzido de 2000ms para 800ms

        logAction(`Tentando trocar para ${characterName} (Tentativa ${attempt}/${MAX_ATTEMPTS})...`, "event");
        const charSelect = findCharacterBarElement('ddlCurrentCharacter');
        const changeButton = findCharacterBarElement('btnChangeCharacter');

        if (!charSelect || !changeButton) {
            if (attempt < MAX_ATTEMPTS) {
                logAction(`Dropdown/botão de troca (ctl08/09) não encontrado. Tentando novamente em ${RETRY_DELAY / 1000}s...`, "info");
                setTimeout(() => switchCharacterByName(characterName, nextStepSuccess, attempt + 1), RETRY_DELAY);
            } else {
                logAction(`Dropdown/botão de troca (ctl08/09) não encontrado após ${MAX_ATTEMPTS} tentativas. Parando.`, "error");
                setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState();
            }
            return;
        }

        logAction("Elementos da barra de personagem encontrados.", "info");
        let targetOption = Array.from(charSelect.options).find(opt => opt.text.trim() === characterName.trim());
        if (!targetOption) {
            logAction(`Personagem "${characterName}" não encontrado no dropdown (Opções: ${Array.from(charSelect.options).map(o => `"${o.text.trim()}"`).join(', ')}). Verifique o nome. Parando.`, "error");
            setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState(); return;
        }

        if (charSelect.value === targetOption.value) {
            logAction(`Já está com ${characterName}. Prosseguindo.`, "info");
            setStep(nextStepSuccess); mainLogic(); return;
        }

        logAction(`Selecionando ${characterName} e clicando para trocar...`, "event");
        charSelect.value = targetOption.value;
        setStep(nextStepSuccess);
        changeButton.click();
    }

    function mainLogic() {
        if (!config.autoRun && currentProcessStep !== 'IDLE') {
            setStep('IDLE'); logAction("Processamento parado (autoRun desligado).", "stop");
            if (countdownInterval) clearInterval(countdownInterval); return;
        }
        if (!config.autoRun && currentProcessStep === 'IDLE') return;

        logAction(`mainLogic INICIO. Step: ${currentProcessStep}`, "event");
        // OTIMIZAÇÃO: Delay normal reduzido drasticamente (de ~3.5s para ~0.8s)
        const actionDelayNormal = 600 + Math.random() * 600;
        // OTIMIZAÇÃO: Delay de diálogo reduzido (de 5s para 1.2s) - o verificador cuidará do resto
        const actionDelayConfirmDialog = 1200;

        if (currentProcessStep === 'CONFIRM_START_ACTIVITY') {
            logAction(`Step é CONFIRM_START_ACTIVITY. Configurando setTimeout com delay de ${actionDelayConfirmDialog}ms.`, "event");
            setTimeout(() => {
                logAction(`DENTRO do setTimeout ESPECÍFICO para CONFIRM_START_ACTIVITY.`, "event");
                if (!config.autoRun) {
                    logAction("Automação parada durante o delay de CONFIRM_START_ACTIVITY.", "stop"); return;
                }
                try {
                    logAction("Tentando clickJQueryDialogButton AGORA.", "event");
                    clickJQueryDialogButton("Sim", 'ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
                } catch (e) {
                    console.error("[PPM Agendador Kit] Erro ao tentar clickJQueryDialogButton", e);
                    logAction(`Erro ao tentar clickJQueryDialogButton: ${e.message}`, "error");
                    setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState();
                }
            }, actionDelayConfirmDialog);
            return;
        }

        logAction(`Executando mainLogic (pré-timeout PADRÃO). Step: ${currentProcessStep}`, "event");

        if (currentProcessStep === 'QUEUE_WAITING_INTERVAL') {
            if (Date.now() >= nextScheduledRun) {
                logAction("Intervalo da fila expirou. Processando próximo item.", "event");
                setStep('QUEUE_IDLE_OR_STARTING');
            } else {
                startCountdown(); return;
            }
        }
        if (currentProcessStep === 'ACTIVITY_FULLY_MANAGED_AND_PROCESSED') {
            logAction(`"${currentActivityNameFromQueue}" totalmente gerenciado. Configurando intervalo.`, "success");
            activityQueue.shift();
            GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
            GM_setValue('pm_kit_currentActivityNameFromQueue', null); currentActivityNameFromQueue = null;
            GM_setValue('pm_kit_createdActivityDetails', '{}'); createdActivityDetails = {};
            renderActivityQueue();
            if (activityQueue.length === 0) {
                logAction("Fila de atividades concluída!", "success");
                setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState(); return;
            }
            setTimerForNextQueueItem();
            setStep('QUEUE_WAITING_INTERVAL');
            mainLogic(); return;
        }

        logAction(`Configurando setTimeout PADRÃO. Step: ${currentProcessStep}, Delay: ${actionDelayNormal}ms`, "event");
        setTimeout(() => {
            logAction(`DENTRO do setTimeout PADRÃO. Step: ${currentProcessStep}`, "event");
            try {
                if (!config.autoRun) {
                    logAction("Automação parada durante o actionDelay PADRÃO.", "stop"); setStep('IDLE'); return;
                }
                const activeCharName = getCurrentCharacterName();
                if (activeCharName) {
                    const mainSteps = ['NAV_TO_LOCALE', 'NAV_TO_CREATE_FORM', 'FILLING_FORM_SELECT_TYPE', 'FILLING_FORM_DETAILS', 'SUBMITTING_ACTIVITY',
                                       'NAV_TO_LOCALE_FOR_MANAGE', 'NAV_TO_ACTIVITIES_FOR_MANAGE', 'FIND_AND_CLICK_ACTIVITY_FOR_MANAGE',
                                       'LOCK_ACTIVITY', 'START_ACTIVITY'];
                    const secondarySteps = ['NAV_TO_LOCALE_FOR_SIGNUP', 'NAV_TO_ACTIVITIES_PAGE', 'FIND_AND_CLICK_ACTIVITY_FOR_SIGNUP', 'SIGNUP_FOR_ACTIVITY'];
                    if (mainSteps.includes(currentProcessStep) && activeCharName !== config.mainCharacterName) {
                        logAction(`Personagem incorreto (${activeCharName}). Trocando para ${config.mainCharacterName}.`, "event"); setStep('SWITCH_TO_MAIN_CHAR_GENERIC');
                    } else if (secondarySteps.includes(currentProcessStep) && activeCharName !== config.secondaryCharacterName) {
                         logAction(`Personagem incorreto (${activeCharName}). Trocando para ${config.secondaryCharacterName}.`, "event"); setStep('SWITCH_TO_SECONDARY_CHAR_GENERIC');
                    }
                } else if (!['IDLE', 'QUEUE_IDLE_OR_STARTING', 'QUEUE_WAITING_INTERVAL'].includes(currentProcessStep)) {
                    logAction("Não foi possível determinar personagem ativo. Verifique.", "error");
                }

                switch (currentProcessStep) {
                    case 'IDLE': logAction("Automação parada (switch).", "stop"); break;
                    case 'QUEUE_IDLE_OR_STARTING':
                        if (activityQueue.length === 0) { logAction("Fila vazia (switch).", "info"); return; }
                        currentActivityNameFromQueue = activityQueue[0].name;
                        GM_setValue('pm_kit_currentActivityNameFromQueue', currentActivityNameFromQueue);
                        createdActivityDetails = { name: currentActivityNameFromQueue, href: activityQueue[0].href || null };
                        GM_setValue('pm_kit_createdActivityDetails', JSON.stringify(createdActivityDetails));
                        logAction(`Iniciando para: "${currentActivityNameFromQueue}"`, "start"); setStep('SWITCH_TO_MAIN_CHAR_GENERIC'); mainLogic(); break;
                    case 'SWITCH_TO_MAIN_CHAR_GENERIC':
                        if (createdActivityDetails && createdActivityDetails.href && currentActivityNameFromQueue) {
                             switchCharacterByName(config.mainCharacterName, 'NAV_TO_LOCALE_FOR_MANAGE');
                        } else { switchCharacterByName(config.mainCharacterName, 'NAV_TO_LOCALE'); } break;
                    case 'NAV_TO_LOCALE': navigateToLocale('NAV_TO_CREATE_FORM'); break;
                    case 'NAV_TO_CREATE_FORM': navigateToCreateActivityForm('FILLING_FORM_SELECT_TYPE'); break;
                    case 'FILLING_FORM_SELECT_TYPE': selectActivityType('FILLING_FORM_DETAILS'); break;
                    case 'FILLING_FORM_DETAILS': fillActivityDetailsAndSubmit('SUBMITTING_ACTIVITY'); break;
                    case 'SUBMITTING_ACTIVITY': logAction(`(${currentActivityNameFromQueue}) Aguardando submissão...`, "event"); break;
                    case 'ACTIVITY_CREATED_PROCEED_TO_SIGNUP':
                        logAction(`(${currentActivityNameFromQueue}) Criada. Trocando para ${config.secondaryCharacterName} para inscrever.`, "event"); setStep('SWITCH_TO_SECONDARY_CHAR_GENERIC'); mainLogic(); break;
                    case 'SWITCH_TO_SECONDARY_CHAR_GENERIC': switchCharacterByName(config.secondaryCharacterName, 'NAV_TO_LOCALE_FOR_SIGNUP'); break;
                    case 'NAV_TO_LOCALE_FOR_SIGNUP': navigateToLocale('NAV_TO_ACTIVITIES_PAGE'); break;
                    case 'NAV_TO_ACTIVITIES_PAGE': navigateToActivitiesPage('FIND_AND_CLICK_ACTIVITY_FOR_SIGNUP'); break;
                    case 'FIND_AND_CLICK_ACTIVITY_FOR_SIGNUP': findAndClickActivity(createdActivityDetails.name, 'SIGNUP_FOR_ACTIVITY', true); break;
                    case 'SIGNUP_FOR_ACTIVITY': clickSignUpButton('ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE'); break;
                    case 'ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE':
                        logAction(`(${currentActivityNameFromQueue}) Inscrito. Trocando para ${config.mainCharacterName} para gerenciar.`, "event"); setStep('SWITCH_TO_MAIN_CHAR_GENERIC'); mainLogic(); break;
                    case 'NAV_TO_LOCALE_FOR_MANAGE': navigateToLocale('NAV_TO_ACTIVITIES_FOR_MANAGE'); break;
                    case 'NAV_TO_ACTIVITIES_FOR_MANAGE': navigateToActivitiesPage('FIND_AND_CLICK_ACTIVITY_FOR_MANAGE'); break;
                    case 'FIND_AND_CLICK_ACTIVITY_FOR_MANAGE': findAndClickActivity(createdActivityDetails.href || createdActivityDetails.name, 'LOCK_ACTIVITY', false); break;
                    case 'LOCK_ACTIVITY': clickManageButton('ctl00_cphLeftColumn_ctl00_btnLock', "Trancar o jogo", 'START_ACTIVITY'); break;
                    case 'START_ACTIVITY': clickManageButton('ctl00_cphLeftColumn_ctl00_btnStart', "Iniciar o jogo", 'CONFIRM_START_ACTIVITY'); break;
                    case 'ACTIVITY_FULLY_MANAGED_AND_PROCESSED': console.warn("[PPM Agendador Kit] Atingiu case ACTIVITY_FULLY_MANAGED_AND_PROCESSED no switch."); break;
                    default: logAction(`Step desconhecido: ${currentProcessStep}. Resetando.`, "error"); setStep('IDLE');
                }
            } catch (error) {
                console.error("[PPM Agendador Kit] Erro DENTRO do setTimeout PADRÃO:", error);
                logAction(`Erro no setTimeout: ${error.message}`, "error");
                setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState();
                currentActivityNameFromQueue = null; GM_setValue('pm_kit_currentActivityNameFromQueue', null);
                createdActivityDetails = {}; GM_setValue('pm_kit_createdActivityDetails', '{}');
            }
        }, actionDelayNormal);
    }

    function navigateToLocale(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue || 'Setup'}) Navegando para 'Local'...`, "event");
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath.startsWith('/World/Popmundo.aspx/Locale') &&
            !currentPath.includes('/Activities') &&
            !currentPath.includes('/CreateActivity') &&
            !currentPath.includes('/Activity/')) {
            if (document.querySelector('a[href*="/World/Popmundo.aspx/Locale/CreateActivity/"]') || document.querySelector('a[href*="/World/Popmundo.aspx/Locale/Activities/"]')) {
                logAction("Já está na página Local principal. Prosseguindo.", "info");
                setStep(nextStepSuccess);
                mainLogic();
                return;
            }
        }

        let localeLink = document.getElementById('ctl00_ctl08_ucMenu_lnkLocale');
        if (!localeLink) {
            localeLink = document.getElementById('ctl00_ctl09_ucMenu_lnkLocale');
        }
        if (!localeLink) {
            logAction("IDs específicos para link 'Local' (ctl00_ctl08/09_ucMenu_lnkLocale) não encontrados. Tentando seletor genérico...", "info");
            const genericLocaleLinks = document.querySelectorAll('a[href="/World/Popmundo.aspx/Locale"]');
            for (let i = 0; i < genericLocaleLinks.length; i++) {
                if (genericLocaleLinks[i].textContent.trim() === "Local") {
                    localeLink = genericLocaleLinks[i];
                    logAction("Link 'Local' encontrado via seletor genérico (texto e href).", "info");
                    break;
                }
            }
        }

        if (localeLink) {
            logAction("Link 'Local' encontrado. Clicando...", "event");
            setStep(nextStepSuccess);
            localeLink.click();
        } else {
            logAction("Link 'Local' NÃO encontrado após todas as tentativas. Parando.", "error");
            setStep('IDLE');
            config.autoRun = false; GM_setValue('pm_kit_autoRun', false);
            updatePanelUIState();
        }
    }

    function navigateToCreateActivityForm(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Procurando 'Criar atividade'...`, "event");
        if (window.location.href.includes('/World/Popmundo.aspx/Locale/CreateActivity/')) { setStep(nextStepSuccess); mainLogic(); return; }
        const createActivityLink = document.querySelector('a[href*="/World/Popmundo.aspx/Locale/CreateActivity/"]');
        if (createActivityLink) { setStep(nextStepSuccess); createActivityLink.click(); }
        else { logAction("Link 'Criar atividade' não encontrado. Pulando item da fila.", "error"); setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED'); mainLogic(); }
    }

    function selectActivityType(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Selecionando Tênis de praia...`, "event");
        const activityTypeSelect = document.getElementById('ctl00_cphLeftColumn_ctl00_ddlActivityType');
        if (activityTypeSelect) {
            if (activityTypeSelect.value === "3") { setStep(nextStepSuccess); mainLogic(); return; }
            activityTypeSelect.value = '3';
            const event = new Event('change', { bubbles: true });
            activityTypeSelect.dispatchEvent(event); setStep(nextStepSuccess);
            logAction("Tipo selecionado. Aguardando __doPostBack ou próximo passo...", "event");
        } else { logAction("Dropdown de tipo de atividade não encontrado. Parando.", "error"); setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState(); }
    }

    function fillActivityDetailsAndSubmit(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Preenchendo detalhes...`, "event");
        const activityNameInput = document.getElementById('ctl00_cphLeftColumn_ctl00_txtActivityName');
        const team1NameInput = document.getElementById('ctl00_cphLeftColumn_ctl00_txtTeam1Name');
        const team2NameInput = document.getElementById('ctl00_cphLeftColumn_ctl00_txtTeam2Name');
        const createButton = document.getElementById('ctl00_cphLeftColumn_ctl00_btnCreateActivity');
        if (!currentActivityNameFromQueue) { logAction("ERRO: Nome da atividade não definido. Parando.", "error"); setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState(); return; }
        const activityTypeSelect = document.getElementById('ctl00_cphLeftColumn_ctl00_ddlActivityType');
        if (activityTypeSelect && activityTypeSelect.value !== '3') { logAction("Tipo de atividade mudou. Reiniciando seleção.", "event"); setStep('FILLING_FORM_SELECT_TYPE'); mainLogic(); return; }
        if (activityNameInput && team1NameInput && team2NameInput && createButton) {
            activityNameInput.value = currentActivityNameFromQueue;
            team1NameInput.value = '001'; team2NameInput.value = '002';
            logAction(`(${currentActivityNameFromQueue}) Enviando formulário...`, "event"); setStep(nextStepSuccess); createButton.click();
        } else { logAction("Campos do formulário de criação não encontrados. Parando.", "error"); setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState(); }
    }

    function navigateToActivitiesPage(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Navegando para 'Atividades' do local...`, "event");
        if (window.location.href.includes('/Locale/Activities/')) {
            if (document.getElementById('tblupcoming') || (document.querySelector('.box h2')?.textContent.includes('Próximas atividades'))) {
                setStep(nextStepSuccess); mainLogic(); return;
            }
        }
        const activitiesLink = document.querySelector('a[href*="/World/Popmundo.aspx/Locale/Activities/"]');
        if (activitiesLink) { setStep(nextStepSuccess); activitiesLink.click(); }
        else {
            logAction("Link 'Atividades' do local não encontrado. Pulando.", "error");
            if (nextStepSuccess === 'FIND_AND_CLICK_ACTIVITY_FOR_SIGNUP') setStep('ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE');
            else if (nextStepSuccess === 'FIND_AND_CLICK_ACTIVITY_FOR_MANAGE') setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
            mainLogic();
        }
    }

    function findAndClickActivity(activityIdentifier, nextStepSuccess, saveHrefIfFound) {
        logAction(`(${currentActivityNameFromQueue}) Procurando atividade "${activityIdentifier}"...`, "event");
        const upcomingTable = document.getElementById('tblupcoming');
        if (!upcomingTable) {
            logAction(`Tabela 'tblupcoming' não encontrada. Pulando.`, "error");
            if (nextStepSuccess === 'SIGNUP_FOR_ACTIVITY') setStep('ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE');
            else if (nextStepSuccess === 'LOCK_ACTIVITY') setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
            mainLogic(); return;
        }
        let foundLink = Array.from(upcomingTable.querySelectorAll('tbody tr td:first-child a')).find(link =>
            (activityIdentifier && typeof activityIdentifier === 'string' && activityIdentifier.startsWith('/') && link.getAttribute('href') === activityIdentifier) ||
            (activityIdentifier && typeof activityIdentifier === 'string' && !activityIdentifier.startsWith('/') && link.textContent.trim() === activityIdentifier.trim())
        );
        if (foundLink) {
            if (saveHrefIfFound && createdActivityDetails) {
                createdActivityDetails.href = foundLink.getAttribute('href'); GM_setValue('pm_kit_createdActivityDetails', JSON.stringify(createdActivityDetails));
                const queueItem = activityQueue.find(item => item.name === createdActivityDetails.name);
                if (queueItem) queueItem.href = createdActivityDetails.href; GM_setValue('pm_kit_activityQueue', JSON.stringify(activityQueue));
                logAction(`Href salvo para "${createdActivityDetails.name}": ${createdActivityDetails.href}`, "info");
            }
            logAction(`Atividade "${activityIdentifier}" encontrada. Clicando...`, "event"); setStep(nextStepSuccess); foundLink.click();
        } else {
            logAction(`Atividade "${activityIdentifier}" NÃO encontrada. Pulando.`, "error");
            if (nextStepSuccess === 'SIGNUP_FOR_ACTIVITY') setStep('ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE');
            else if (nextStepSuccess === 'LOCK_ACTIVITY') setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
            mainLogic();
        }
    }

    function clickSignUpButton(nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Procurando botão 'Participar do jogo'...`, "event");
        const signUpButton = document.getElementById('ctl00_cphLeftColumn_ctl00_btnSignUp');
        if (signUpButton) {
            logAction("Botão 'Participar do jogo' encontrado. Clicando...", "event"); setStep(nextStepSuccess); signUpButton.click();
        } else {
            if (document.evaluate("//*[contains(text(),'Você já está inscrito') or contains(text(),'Você já está participando')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                 logAction("Já está inscrito/participando. Prosseguindo.", "info");
            } else { logAction("Botão 'Participar' não encontrado (talvez cheio/fechado). Prosseguindo.", "info");}
            setStep(nextStepSuccess); mainLogic();
        }
    }

    function clickManageButton(buttonId, buttonText, nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Procurando botão '${buttonText}'...`, "event");
        const button = document.getElementById(buttonId);
        if (button && button.offsetParent !== null) {
            logAction(`Botão '${buttonText}' encontrado. Clicando...`, "event"); setStep(nextStepSuccess);
            button.click();
            if (nextStepSuccess === 'CONFIRM_START_ACTIVITY') {
                logAction("clickManageButton mudou para CONFIRM_START_ACTIVITY, chamando mainLogic() para processar.", "event");
                mainLogic();
            }
        } else {
            logAction(`Botão '${buttonText}' (ID: ${buttonId}) não encontrado/visível. Verificando alternativas...`, "info");
            let stepToSetIfButtonNotFound = nextStepSuccess;
            if (buttonId === 'ctl00_cphLeftColumn_ctl00_btnLock') {
                 if (document.getElementById('ctl00_cphLeftColumn_ctl00_btnStart')?.offsetParent !== null) {
                    logAction("Assumindo que já está trancado (Iniciar visível).", "info"); stepToSetIfButtonNotFound = 'START_ACTIVITY';
                 } else { logAction("Não foi possível trancar. Pulando gerenciamento.", "error"); stepToSetIfButtonNotFound = 'ACTIVITY_FULLY_MANAGED_AND_PROCESSED'; }
            } else if (buttonId === 'ctl00_cphLeftColumn_ctl00_btnStart') {
                if (document.querySelector('div.ui-dialog.ui-widget-content.ui-front[aria-describedby="ui-id-2"]')?.offsetParent !== null) {
                    logAction("Diálogo de confirmação já visível. Prosseguindo para confirmação.", "info"); stepToSetIfButtonNotFound = 'CONFIRM_START_ACTIVITY';
                } else { logAction("Botão 'Iniciar' e diálogo não visíveis. Pulando gerenciamento.", "error"); stepToSetIfButtonNotFound = 'ACTIVITY_FULLY_MANAGED_AND_PROCESSED';}
            }
            setStep(stepToSetIfButtonNotFound); mainLogic();
        }
    }

    function clickJQueryDialogButton(buttonText, nextStepSuccess) {
        logAction(`(${currentActivityNameFromQueue}) Procurando botão de diálogo jQuery '${buttonText}'...`, "event");
        const dialogSelector = 'div.ui-dialog.ui-widget-content.ui-front[aria-describedby="ui-id-2"]';

        // OTIMIZAÇÃO: Loop local para pegar o diálogo assim que ele aparecer
        let attempts = 0;
        const checkDialog = setInterval(() => {
            attempts++;
            const dialogElement = document.querySelector(dialogSelector);
            const dialogVisible = dialogElement && dialogElement.style.display !== 'none' && dialogElement.offsetParent !== null;

            if (dialogVisible) {
                const targetButton = Array.from(dialogElement.querySelectorAll('div.ui-dialog-buttonset button.ui-button.ui-widget'))
                                        .find(btn => btn.textContent.trim() === buttonText);
                if (targetButton) {
                    clearInterval(checkDialog);
                    logAction(`Botão de diálogo '${buttonText}' encontrado e visível. Clicando...`, "event");
                    setStep(nextStepSuccess);
                    targetButton.click();
                }
            }

            if (attempts > 20) { // Tenta por cerca de 2 segundos (20 * 100ms)
                clearInterval(checkDialog);
                logAction(`Botão '${buttonText}' não encontrado após tentativas rápidas. Assumindo que não era necessário.`, "info");
                setStep(nextStepSuccess); mainLogic();
            }
        }, 100);
    }

    function setTimerForNextQueueItem() {
        nextScheduledRun = Date.now() + (config.delayMinutes * 60 * 1000);
        GM_setValue('pm_kit_nextScheduledRun', nextScheduledRun);
        logAction(`Próxima da fila agendada para: ${new Date(nextScheduledRun).toLocaleTimeString()}`, "event");
        startCountdown();
    }
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        if (!config.autoRun || currentProcessStep !== 'QUEUE_WAITING_INTERVAL') {
            if (config.autoRun && (currentProcessStep === 'IDLE' || currentProcessStep === 'QUEUE_IDLE_OR_STARTING')) {
                updateStatus(activityQueue.length > 0 ? "Pronto para processar fila..." : "Fila vazia.");
            } return;
        }
        function updateDisplay() {
            const now = Date.now(); const timeLeftMs = nextScheduledRun - now;
            if (timeLeftMs <= 0) {
                if (countdownInterval) clearInterval(countdownInterval);
                updateStatus("Intervalo da fila expirou. Tentando processar..."); mainLogic(); return;
            }
            const minutes = Math.floor((timeLeftMs / (1000 * 60)) % 60);
            const seconds = Math.floor((timeLeftMs / 1000) % 60);
            updateStatus(`Próxima da fila em: ${minutes}m ${seconds}s`);
        }
        updateDisplay(); countdownInterval = setInterval(updateDisplay, 1000);
    }

    window.addEventListener('load', () => {
        if (!Array.isArray(config.actionLog)) {
            config.actionLog = [];
        }
        logAction(`Evento LOAD disparado. Step atual: ${currentProcessStep}`, "event");

        // OTIMIZAÇÃO: Delay de LOAD reduzido de 1800ms para 400ms.
        setTimeout(() => {
            logAction(`DENTRO do setTimeout do LOAD. Step atual: ${currentProcessStep}`, "event");
            createPanel();
            const activeCharName = getCurrentCharacterName();

            if (currentProcessStep === 'SUBMITTING_ACTIVITY') {
                if (!window.location.href.includes('/Locale/CreateActivity/') && window.location.href.includes('/Locale/')) {
                    logAction(`Atividade "${currentActivityNameFromQueue}" parece criada. Indo inscrever.`, "success");
                    setStep('ACTIVITY_CREATED_PROCEED_TO_SIGNUP');
                } else {
                    logAction(`Submissão de "${currentActivityNameFromQueue}" falhou ou página não mudou. Parando.`, "error");
                    setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState();
                }
            } else if (currentProcessStep === 'ACTIVITY_SIGNED_UP_PROCEED_TO_MANAGE') {
                 if (window.location.href.includes('/Locale/Activity/')) {
                    logAction(`Inscrição em "${currentActivityNameFromQueue}" OK. Indo gerenciar.`, "success");
                 } else {
                     logAction(`Página inesperada após inscrever em "${currentActivityNameFromQueue}". Tentando gerenciar.`, "info");
                 }
            } else if (currentProcessStep === 'LOCK_ACTIVITY') {
                 const startButtonVisible = document.getElementById('ctl00_cphLeftColumn_ctl00_btnStart')?.offsetParent !== null;
                 const lockButtonStillExists = document.getElementById('ctl00_cphLeftColumn_ctl00_btnLock') !== null;
                 if (startButtonVisible && !lockButtonStillExists) {
                    logAction(`Atividade "${currentActivityNameFromQueue}" parece trancada. Indo iniciar.`, "success");
                    setStep('START_ACTIVITY');
                 } else if (window.location.href.includes('/Locale/Activity/')) {
                     logAction(`Problema ao trancar "${currentActivityNameFromQueue}". Verificando botões...`, "info");
                 } else {
                     logAction(`Página inesperada após tentar trancar "${currentActivityNameFromQueue}". Parando.`, "error");
                     setStep('IDLE'); config.autoRun = false; GM_setValue('pm_kit_autoRun', false); updatePanelUIState();
                 }
            } else if (currentProcessStep === 'START_ACTIVITY') {
                const startButton = document.getElementById('ctl00_cphLeftColumn_ctl00_btnStart');
                const dialogVisible = document.querySelector('div.ui-dialog.ui-widget-content.ui-front[aria-describedby="ui-id-2"]')?.offsetParent !== null;
                if (dialogVisible) {
                    logAction(`Diálogo de confirmação para iniciar "${currentActivityNameFromQueue}" detectado. Prosseguindo.`, "info");
                    setStep('CONFIRM_START_ACTIVITY');
                } else if (startButton && startButton.offsetParent !== null) {
                    logAction(`Botão "Iniciar o jogo" ainda presente para ${currentActivityNameFromQueue}. mainLogic tentará clicar.`, "info");
                } else if (!startButton && !dialogVisible) {
                    logAction(`Botão "Iniciar" sumiu e diálogo não apareceu para "${currentActivityNameFromQueue}". Finalizando item.`, "info");
                    setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
                } else {
                     logAction(`Estado inesperado no step START_ACTIVITY para "${currentActivityNameFromQueue}". Avançando para confirmação.`, "info");
                     setStep('CONFIRM_START_ACTIVITY');
                }
            } else if (currentProcessStep === 'CONFIRM_START_ACTIVITY') {
                const dialogStillVisible = document.querySelector('div.ui-dialog.ui-widget-content.ui-front[aria-describedby="ui-id-2"]')?.offsetParent !== null;
                if (!dialogStillVisible && window.location.href.includes('/Locale/Activity/')) {
                    logAction(`(LOAD) Atividade "${currentActivityNameFromQueue}" parece iniciada (diálogo sumiu).`, "success");
                    setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
                } else if (dialogStillVisible) {
                     logAction(`(LOAD) Diálogo de confirmação ainda visível para "${currentActivityNameFromQueue}". mainLogic deve tratar.`, "info");
                } else {
                     logAction(`(LOAD) Problema ao confirmar início de "${currentActivityNameFromQueue}". Assumindo sucesso.`, "info");
                     setStep('ACTIVITY_FULLY_MANAGED_AND_PROCESSED');
                }
            } else if (currentProcessStep.startsWith('SWITCH_') && activeCharName) {
                logAction(`Recarregado após troca de char. Atual: ${activeCharName}. Step: ${currentProcessStep}`, "event");
            }

            if (config.autoRun) {
                mainLogic();
            } else {
                updateStatus("Automação parada.");
            }
            if (currentProcessStep === 'QUEUE_WAITING_INTERVAL' && config.autoRun) {
                startCountdown();
            }
        }, 400); // <-- Delay reduzido aqui
    });

})();