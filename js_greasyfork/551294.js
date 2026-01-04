// ==UserScript==
// @name         RatingR5 & Training Simulator (Hybrid)
// @version      12.8
// @description  Carregamento automático de dados (corrigido para pág. de histórico e bug 'octal'). Simula R5 e ganhos de treino.
// @author       Gemini AI (lógica R5 baseada no script de Romkes ™ '15+ Douglas Kraft(Kraft FC))
// @match        https://trophymanager.com/players/*
// @exclude      https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/gemini-ai
// @downloadURL https://update.greasyfork.org/scripts/551294/RatingR5%20%20Training%20Simulator%20%28Hybrid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551294/RatingR5%20%20Training%20Simulator%20%28Hybrid%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================================
    // PARTE 1: SIMULADOR DE R5 (CÓDIGO ORIGINAL MANTIDO)
    // ===================================================================================
    let R5_DATA = null;
    let TS_ROUTINE_CACHE = null;
    // Guarda o valor da rotina quando o usuário clicar em "Carregar Dados"

    // Função que captura a rotina da página e guarda em TS_ROUTINE_CACHE.
// Só deve ser chamada quando o usuário clicar em "Carregar Dados".
function captureRoutineFromPage() {
    try {
        // Procura a célula que contém "routine" / "rotina" na tabela de info da página
        const infoTable = document.querySelector('table.info_table') || document.querySelector('table.player_info');
        if (!infoTable) return;

        infoTable.querySelectorAll('tr').forEach(row => {
            const th = row.querySelector('th');
            const td = row.querySelector('td');
            if (!th || !td) return;
            const label = th.textContent.trim().toLowerCase();
            if (label.match(/routine|rotina/)) {
                const rouText = td.textContent.trim().replace(',', '.');
                const rouValue = parseFloat(rouText);
                if (!isNaN(rouValue)) {
                    TS_ROUTINE_CACHE = rouValue;
                    document.getElementById('ts_routine').value = rouValue;
                }
            }
        });

        // Se não encontrou nada, não altera o cache (mantém o que o usuário tinha)
    } catch (e) {
        console.warn("captureRoutineFromPage: falha ao capturar rotina:", e);
    }
}




    function initializeR5Simulator() {
        const player_id = location.href.split('/')[4];
        if (!player_id) return;

        try {
            R5_DATA = JSON.parse(localStorage.getItem(player_id + "_R5"));
        } catch (e) {
            console.error("Simulador R5: Erro ao ler dados do localStorage.", e);
        }

        addR5SimulatorUI();
        populateHistoryTable();
    }

    function addR5SimulatorUI() {
        const targetElement = document.querySelector('.column2_a');
        if (!targetElement || document.getElementById('r5_hybrid_simulator_div')) return;

        const mainContainerHtml = `
            <div id="main_simulator_container">
                <div id="r5_hybrid_simulator_div" style="margin-top: 20px;">
                    <table style="border: 1px solid #ccc; width: 100%;" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr style="background-color: #333333;"><th colspan="4" style="padding: 5px; text-align: center;">Simulador de R5 (Híbrido)</th></tr>
                            <tr style="background-color: #444; font-size: 0.9em;">
                                <th style="width: 40px;">Sel.</th>
                                <th style="padding: 4px;">Idade</th>
                                <th style="padding: 4px;">RatingR5</th>
                                <th style="width: 40px;"></th>
                            </tr>
                        </thead>
                        <tbody id="history-data-tbody"></tbody>
                        <tfoot>
                            <tr><td colspan="4" style="padding: 5px;"><span class="button" id="add-manual-btn" style="width:160px; float: right;"><span class="button_border" style="width:158px; padding: 0;">+ Adicionar Ponto Manual</span></span></td></tr>
                            <tr class="odd">
                                <td colspan="4" style="padding: 10px;">
                                    <label for="hybrid_future_age" title="A idade futura no formato ano.mês">Idade Futura (ex: 22.08):</label>
                                    <input type="text" id="hybrid_future_age" size="5" style="margin-right: 10px;">
                                    <label for="hybrid_adj_factor" title="> 1 para acelerar, < 1 para desacelerar">Fator de Ajuste:</label>
                                    <input type="text" id="hybrid_adj_factor" size="4" value="1.0" style="margin-right: 10px;">
                                    <span class="button" id="hybrid_simulate_btn" style="width:100px;"><span class="button_border" style="width:98px;">Simular R5</span></span>
                                </td>
                            </tr>
                            <tr><td colspan="4" style="padding: 10px;" id="hybrid_simulator_result_area"></td></tr>
                        </tfoot>
                    </table>
                </div>
                <div style="margin-top: 10px; text-align: right;">
                     <span class="button" id="open_training_sim_btn" style="width:200px;"><span class="button_border" style="width:198px;">Abrir Simulador de Treino</span></span>
                 </div>
            </div>`;
        targetElement.insertAdjacentHTML('beforeend', mainContainerHtml);

        document.getElementById('add-manual-btn').addEventListener('click', addManualRow);
        document.getElementById('hybrid_simulate_btn').addEventListener('click', runR5Simulation);
        document.getElementById('history-data-tbody').addEventListener('click', (event) => {
            if (event.target.closest('.remove-manual-btn')) {
                event.target.closest('.manual-entry-row').remove();
            }
        });
    }

    function populateHistoryTable() {
        const tbody = document.getElementById('history-data-tbody');
        tbody.innerHTML = '';
        if (!R5_DATA || Object.keys(R5_DATA).length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 5px;">Nenhum histórico automático encontrado. Adicione pontos manualmente.</td></tr>';
            return;
        }

        const sortedAges = Object.keys(R5_DATA).sort((a, b) => {
            const [yearA, monthA] = a.split('.').map(Number);
            const [yearB, monthB] = b.split('.').map(Number);
            return (yearA * 12 + monthA) - (yearB * 12 + monthB);
        });

        for (const ageKey of sortedAges) {
            const r5Value = R5_DATA[ageKey];
            const row = document.createElement('tr');
            row.style.textAlign = 'center';
            if (tbody.children.length % 2 !== 0) row.className = 'odd';
            row.innerHTML = `
                <td><input type="checkbox" class="auto_selector" data-age-key="${ageKey}"></td>
                <td>${ageKey}</td>
                <td>${r5Value}</td>
                <td></td>`;
            tbody.appendChild(row);
        }
    }

    function addManualRow() {
        const tbody = document.getElementById('history-data-tbody');
        const row = document.createElement('tr');
        row.className = 'manual-entry-row';
        if (tbody.children.length % 2 !== 0) row.classList.add('odd');
        row.innerHTML = `
            <td style="text-align: center;"><input type="checkbox" class="manual_selector"></td>
            <td><input type="text" class="age-input" placeholder="23.11" style="width: 90%;"></td>
            <td><input type="text" class="r5-input" placeholder="94.16" style="width: 90%;"></td>
            <td style="text-align: center;">
                 <span class="button remove-manual-btn" style="width:24px; height: 20px; cursor: pointer;"><span class="button_border" style="width:22px; padding:0; line-height: 20px; font-weight: bold; color: #ff9999;">X</span></span>
            </td>`;
        tbody.appendChild(row);
    }

    function runR5Simulation() {
        const resultArea = document.getElementById('hybrid_simulator_result_area');
        const dataPoints = [];

        try {
            const autoCheckboxes = document.querySelectorAll('.auto_selector:checked');
            for (const cb of autoCheckboxes) {
                const ageKey = cb.dataset.ageKey;
                const r5Text = R5_DATA[ageKey];
                const r5Value = parseFloat(r5Text);
                const [year, month] = ageKey.split('.').map(Number);
                dataPoints.push({ age: year + ((month || 0) / 12), r5: r5Value, originalAgeText: ageKey });
            }

            const manualRows = document.querySelectorAll('.manual-entry-row');
            for (const row of manualRows) {
                if (row.querySelector('.manual_selector').checked) {
                    const ageInput = row.querySelector('.age-input').value.trim();
                    const r5Input = row.querySelector('.r5-input').value.trim().replace(',', '.');
                    if (ageInput === '' || r5Input === '') continue;
                    if (!/^\d{1,2}(\.\d{1,2})?$/.test(ageInput) || isNaN(parseFloat(r5Input))) throw new Error("Verifique os dados manuais. Formato inválido.");
                    const [year, month] = ageInput.split('.').map(Number);
                    if (month > 11) throw new Error(`O mês na idade manual ('${ageInput}') não pode ser maior que 11.`);
                    dataPoints.push({ age: year + ((month || 0) / 12), r5: parseFloat(r5Input), originalAgeText: ageInput });
                }
            }

            if (dataPoints.length < 2) throw new Error("Selecione ou preencha pelo menos 2 pontos de histórico válidos.");

            const futureAgeInput = document.getElementById('hybrid_future_age').value.trim();
            if (!/^\d{1,2}(\.\d{1,2})?$/.test(futureAgeInput)) throw new Error("A idade futura deve ser no formato 'ano.mês' (ex: 22.08).");
            const [futureYear, futureMonth] = futureAgeInput.split('.').map(Number);
            if (futureMonth > 11) throw new Error(`O mês na idade futura ('${futureAgeInput}') não pode ser maior que 11.`);
            const futureAge = futureYear + ((futureMonth || 0) / 12);

            const adjustmentFactor = parseFloat(document.getElementById('hybrid_adj_factor').value.trim().replace(',', '.'));
            if(isNaN(adjustmentFactor)) throw new Error("O Fator de Ajuste deve ser um número (ex: 0.9).");

            dataPoints.sort((a, b) => a.age - b.age);
            const latestPoint = dataPoints[dataPoints.length - 1];
            if (futureAge <= latestPoint.age) throw new Error("A idade futura deve ser maior que a do último ponto selecionado.");

            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            const n = dataPoints.length;
            for (const point of dataPoints) {
                sumX += point.age; sumY += point.r5; sumXY += point.age * point.r5; sumX2 += point.age * point.age;
            }
            const denominator = (n * sumX2 - sumX * sumX);
            if (denominator === 0) throw new Error("Não é possível calcular. Todas as idades selecionadas são iguais.");

            const slope = (n * sumXY - sumX * sumY) / denominator;
            const projectedGain = (slope * (futureAge - latestPoint.age)) * adjustmentFactor;
            const projectedR5 = latestPoint.r5 + projectedGain;

            const futureAgeText = `${futureYear}.${futureMonth || 0}`;
            displayR5Results(futureAgeText, projectedR5, slope, dataPoints, adjustmentFactor);
        } catch (e) {
            resultArea.innerHTML = `<span style="color: red;">Erro: ${e.message}</span>`;
        }
    }

    function displayR5Results(age, r5, rate, dataPoints, adjustmentFactor) {
        const resultArea = document.getElementById('hybrid_simulator_result_area');
        let dataTableHtml = `
            <div style="margin-bottom: 10px;">
                <b style="font-size: 0.9em;">Dados Usados no Cálculo:</b>
                <table style="width: 200px; font-size: 0.8em; margin-top: 5px; border-collapse: collapse;">
                    <thead style="background-color: #444;"><tr><th style="padding: 3px; border: 1px solid #555;">Idade</th><th style="padding: 3px; border: 1px solid #555;">RatingR5</th></tr></thead>
                    <tbody>`;
        dataPoints.forEach(point => {
            dataTableHtml += `<tr style="background-color: #2a2a2a; text-align: center;"><td style="padding: 3px; border: 1px solid #555;">${point.originalAgeText}</td><td style="padding: 3px; border: 1px solid #555;">${point.r5.toFixed(2)}</td></tr>`;
        });
        dataTableHtml += `</tbody></table></div><hr style="border-color: #444; margin-top: 10px; margin-bottom: 10px;">`;
        const resultHtml = `
            <b>Resultado da Simulação para a idade de ${age}:</b><br>
            <small>(Baseado em ${dataPoints.length} pontos, com fator de ajuste de ${adjustmentFactor})</small><br><br>
            - <b>Taxa de Progressão (Base):</b> ${rate > 0 ? '+' : ''}${rate.toFixed(2)} pontos de R5 por ano.<br>
            - <b style="color: gold; font-size: 1.1em;">RatingR5 Simulado:</b> <span style="color: gold; font-weight: bold; font-size: 1.1em;">${r5.toFixed(2)}</span>`;
        resultArea.innerHTML = dataTableHtml + resultHtml;
    }


    // ===================================================================================
    // PARTE 2: SIMULADOR DE TREINO (FUNCIONALIDADE EXPANDIDA)
    // ===================================================================================

    function initializeTrainingSimulator() {
        addTrainingSimulatorUI();
        addTrainingSimulatorListeners();
    }

    function addTrainingSimulatorUI() {
        const positionOptions = [
            { text: "Zagueiro Central (DC)", value: 0 }, { text: "Zagueiro Esquerdo (DL)", value: 1 }, { text: "Zagueiro Direito (DR)", value: 2 },
            { text: "Volante Central (DMC)", value: 3 }, { text: "Volante Esquerdo (DML)", value: 4 }, { text: "Volante Direito (DMR)", value: 5 },
            { text: "Meio-Campista Central (MC)", value: 6 }, { text: "Meio-Campista Esquerdo (ML)", value: 7 }, { text: "Meio-Campista Direito (MR)", value: 8 },
            { text: "Meia Ofensivo Central (OMC)", value: 9 }, { text: "Meia Ofensivo Esquerdo (OML)", value: 10 }, { text: "Meia Ofensivo Direito (OMR)", value: 11 },
            { text: "Atacante (F)", value: 12 }, { text: "Goleiro (GK)", value: 13 }
        ].map(p => `<option value="${p.value}">${p.text}</option>`).join('');

        const trainingSimHtml = `
            <div id="trainingSimModal" style="display: none;">
                <div id="trainingSimContent">
                    <div id="trainingSimHeader">
                        Simulador de Treino
                        <span id="trainingSimCloseBtn" style="float: right; cursor: pointer; font-weight: bold;">X</span>
                    </div>
                    <div id="trainingSimBody">
                        <div class="ts-col">
                            <h4>Dados do Jogador</h4>
                            <textarea id="ts_playerData" rows="6" placeholder="Deixe em branco para carregar o jogador da página, ou cole os dados de outro jogador aqui..."></textarea>
                            <button id="ts_loadDataBtn" class="ts-btn">Carregar Dados</button>
                            <hr>
                            <p>Idade: <b id="ts_years">0</b>a <b id="ts_month">0</b>m</p>
                            <p>SI: <b id="ts_si">0</b> | Soma: <b id="ts_p">0</b></p>
                            <hr>
                            <label>Posição para Simular R5:
                                <select id="ts_position">${positionOptions}</select>
                            </label>
                            <label>Rotina (Routine):
                                <input type="text" id="ts_routine" value="0" size="4">
                            </label>
                            <hr>
                            <label>Especialidade:
                                <select id="ts_sp">
                                    <option value="0">Força</option><option value="1">Resistência</option><option value="2">Velocidade</option>
                                    <option value="3">Marcação</option><option value="4">Desarme</option><option value="5">Dedicação</option>
                                    <option value="6">Posicionamento</option><option value="7">Passe</option><option value="8">Cruzamento</option>
                                    <option value="9">Técnica</option><option value="10">Cabeceio</option><option value="11">Finalização</option>
                                    <option value="12">Chute de Longe</option><option value="13">Bola Parada</option>
                                </select>
                            </label>
                            <hr>
                            <label>Potencial Físico: <input type="text" id="ts_phy3" value="4" size="4"></label>
                            <label>Potencial Tático: <input type="text" id="ts_tac3" value="4" size="4"></label>
                            <label>Potencial Técnico: <input type="text" id="ts_tec3" value="4" size="4"></label>
                        </div>
                        <div class="ts-col">
                            <h4>Atributos Iniciais</h4>
                            <table id="ts_initialSkills">
                                <tr><td>Força:</td><td><b id="ts_Str0">0</b></td><td>Passe:</td><td><b id="ts_Pas0">0</b></td></tr>
                                <tr><td>Resist.:</td><td><b id="ts_Sta0">0</b></td><td>Cruz.:</td><td><b id="ts_Cro0">0</b></td></tr>
                                <tr><td>Veloc.:</td><td><b id="ts_Pac0">0</b></td><td>Téc.:</td><td><b id="ts_Tec0">0</b></td></tr>
                                <tr><td>Marc.:</td><td><b id="ts_Mar0">0</b></td><td>Cab.:</td><td><b id="ts_Hea0">0</b></td></tr>
                                <tr><td>Des.:</td><td><b id="ts_Tac0">0</b></td><td>Fin.:</td><td><b id="ts_Fin0">0</b></td></tr>
                                <tr><td>Dedic.:</td><td><b id="ts_Wor0">0</b></td><td>Ch.L.:</td><td><b id="ts_Lon0">0</b></td></tr>
                                <tr><td>Posic.:</td><td><b id="ts_Pos0">0</b></td><td>B.Par.:</td><td><b id="ts_Set0">0</b></td></tr>
                            </table>
                            <hr>
                             <h4>Tipo de Treino</h4>
                             <div id="ts_training_type_selector">
                                 <label><input type="radio" name="ts_training_type" value="custom" checked> Customizado</label>
                                 <label><input type="radio" name="ts_training_type" value="group"> Em Grupo</label>
                             </div>
                             <div id="ts_custom_training_div">
                                 <h4>Treino Customizado</h4>
                                 <small>(Soma dos pontos deve ser 12)</small>
                                 <table class="ts-training-table">
                                    <tr><td>Time 1 (For,Ded,Res):</td><td><input type="text" id="ts_t1" value="2" size="2"></td></tr>
                                    <tr><td>Time 2 (Mar,Des):</td><td><input type="text" id="ts_t2" value="2" size="2"></td></tr>
                                    <tr><td>Time 3 (Cru,Vel):</td><td><input type="text" id="ts_t3" value="2" size="2"></td></tr>
                                    <tr><td>Time 4 (Pas,Tec,Bol):</td><td><input type="text" id="ts_t4" value="2" size="2"></td></tr>
                                    <tr><td>Time 5 (Cab,Pos):</td><td><input type="text" id="ts_t5" value="2" size="2"></td></tr>
                                    <tr><td>Time 6 (Fin,ChL):</td><td><input type="text" id="ts_t6" value="2" size="2"></td></tr>
                                 </table>
                             </div>
                             <div id="ts_group_training_div" style="display:none;">
                                <h4>Treino em Grupo</h4>
                                <select id="ts_groupselect" style="width: 100%;"><option value="0">Geral</option><option value="1">Físico</option><option value="2">Meio-campo</option><option value="3">Ataque</option><option value="4">Defesa</option><option value="5">Técnico/Velocidade</option></select>
                             </div>
                        </div>
                        <div class="ts-col">
                            <h4>Períodos de Treino</h4>
                            <table class="ts-training-table">
                               <tr><td>Semanas 1:</td><td><input type="text" id="ts_wk1" value="0" size="3"></td></tr>
                               <tr><td>Intensidade 1:</td><td><input type="text" id="ts_ti1" value="0" size="3"></td></tr>
                               <tr><td>Semanas 2:</td><td><input type="text" id="ts_wk2" value="0" size="3"></td></tr>
                               <tr><td>Intensidade 2:</td><td><input type="text" id="ts_ti2" value="0" size="3"></td></tr>
                               <tr><td>Semanas 3:</td><td><input type="text" id="ts_wk3" value="0" size="3"></td></tr>
                               <tr><td>Intensidade 3:</td><td><input type="text" id="ts_ti3" value="0" size="3"></td></tr>
                            </table>
                             <button id="ts_calcBtn" class="ts-btn" style="margin-top: 20px;">Simular Treino</button>
                             <hr>
                             <div id="ts_results_area">
                                <h4>Resultados</h4>
                                <div id="ts_results_summary"></div>
                                <div id="ts_results_skills"></div>
                                <div id="ts_debug" style="font-size: 0.8em; color: #777; margin-top: 10px;"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', trainingSimHtml);

        GM_addStyle(`
            #trainingSimModal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 99998; justify-content: center; align-items: center; }
            #trainingSimContent { background-color: #3a3a3a; color: #fff; border: 1px solid #555; border-radius: 8px; width: 950px; max-width: 95vw; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
            #trainingSimHeader { padding: 10px 15px; background-color: #2a2a2a; border-bottom: 1px solid #555; border-radius: 8px 8px 0 0; cursor: move; }
            #trainingSimBody { display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 15px; padding: 15px; max-height: 80vh; overflow-y: auto; }
            .ts-col { display: flex; flex-direction: column; gap: 5px; }
            .ts-col h4 { margin: 10px 0 10px 0; color: #4CAF50; border-bottom: 1px solid #444; padding-bottom: 5px; }
            .ts-col input, .ts-col select, .ts-col textarea { width: 95%; background: #2a2a2a; color: #fff; border: 1px solid #555; padding: 5px; border-radius: 4px; }
            #ts_training_type_selector label { margin-right: 15px; }
            .ts-btn { background-color: #4CAF50; border: none; color: white; padding: 8px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; margin: 4px 2px; cursor: pointer; border-radius: 4px; }
            #ts_initialSkills, .ts-training-table { width: 100%; font-size: 0.9em; }
            #ts_initialSkills b, .ts-training-table b { color: #eee; }
            #ts_results_skills { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9em; }
        `);
    }

    function addTrainingSimulatorListeners() {
    document.getElementById('open_training_sim_btn').addEventListener('click', () => { document.getElementById('trainingSimModal').style.display = 'flex'; });
    document.getElementById('trainingSimCloseBtn').addEventListener('click', () => { document.getElementById('trainingSimModal').style.display = 'none'; });
    document.getElementById('ts_loadDataBtn').addEventListener('click', getTrainingPlayerSkills);
    document.getElementById('ts_calcBtn').addEventListener('click', runTrainingSimulation);

    // LINHA ADICIONADA AQUI:
    //document.getElementById('ts_position').addEventListener('change', runTrainingSimulation);

    dragElement(document.getElementById('trainingSimContent'));

    document.querySelectorAll('input[name="ts_training_type"]').forEach(elem => {
        elem.addEventListener('change', function(event) {
            const isCustom = event.target.value === 'custom';
            document.getElementById('ts_custom_training_div').style.display = isCustom ? 'block' : 'none';
            document.getElementById('ts_group_training_div').style.display = isCustom ? 'none' : 'block';
        });
    });
}

    // ===== FUNÇÃO DE CARREGAMENTO DE DADOS TOTALMENTE REESCRITA (v12.6) =====
    function getTrainingPlayerSkills() {
        try {
            const inputText = document.getElementById('ts_playerData').value.trim();

            if (inputText) {
                // --- Método Antigo: Carregar a partir do texto colado ---
                const lines = inputText.split('\n');
                if (lines.length < 4) throw new Error("Formato de dados do texto incompleto.");

                const ageFull = parseFloat(lines[0]);
                document.getElementById('ts_years').textContent = Math.floor(ageFull);
                document.getElementById('ts_month').textContent = Math.round((ageFull - Math.floor(ageFull)) * 100);

                const siString = lines[1].split(/[\s\t]+/)[0];
                document.getElementById('ts_si').textContent = parseFloat(siString.replace(/,/g, ''));

                const fullAttributeString = lines[2] + " " + lines[3];
                const attributes = { "ts_Str0": /Str:(\d+)/, "ts_Sta0": /Sta:(\d+)/, "ts_Pac0": /Pac:(\d+)/, "ts_Mar0": /Mar:(\d+)/, "ts_Tac0": /Tac:(\d+)/, "ts_Wor0": /Wor:(\d+)/, "ts_Pos0": /Pos:(\d+)/, "ts_Pas0": /Pas:(\d+)/, "ts_Cro0": /Cro:(\d+)/, "ts_Tec0": /Tec:(\d+)/, "ts_Hea0": /Hea:(\d+)/, "ts_Fin0": /Fin:(\d+)/, "ts_Lon0": /Lon:(\d+)/, "ts_Set0": /Set:(\d+)/ };
                let p0 = 0;
                for (const id in attributes) {
                    const match = fullAttributeString.match(attributes[id]);
                    if (!match) throw new Error(`Atributo ${id} não encontrado no texto.`);
                    const skillValue = parseInt(match[1], 10);
                    document.getElementById(id).textContent = skillValue;
                    p0 += skillValue;
                }
                document.getElementById('ts_p').textContent = p0;
            } else {
                // --- Novo Método: Carregar automaticamente da página ---
                let foundData = { age: false, si: false, routine: false };
                const infoTable = document.querySelector('table.info_table') || document.querySelector('table.player_info'); // Suporte para pág. de histórico
                if (!infoTable) throw new Error("Tabela de informações do jogador não encontrada.");

                infoTable.querySelectorAll('tr').forEach(row => {
                    const th = row.querySelector('th');
                    const td = row.querySelector('td');
                    if (!th || !td) return;
                    const label = th.textContent.trim().toLowerCase();

                    if (label === 'age' || label === 'idade') {
                        const numbers = td.textContent.match(/\d+/g);
                        if (numbers && numbers.length >= 2) {
                            document.getElementById('ts_years').textContent = numbers[0];
                            document.getElementById('ts_month').textContent = numbers[1];
                            foundData.age = true;
                        }
                    } else if (label.includes('skill index')) {
                        document.getElementById('ts_si').textContent = parseFloat(td.textContent.replace(/[,.]/g, ''));
                        foundData.si = true;
} else if (label.match(/routine|rotina/)) {
    const rouText = td.textContent.trim();
    const rouValue = parseFloat(rouText.replace(',', '.'));
    if (!isNaN(rouValue)) {
        document.getElementById('ts_routine').value = rouValue;
        TS_ROUTINE_CACHE = rouValue; // 🔹 guarda o valor inicial
        foundData.routine = true;
    } else if (TS_ROUTINE_CACHE !== null) {
        // 🔹 reutiliza o valor inicial se a nova leitura for inválida
        document.getElementById('ts_routine').value = TS_ROUTINE_CACHE;
    } else {
        // 🔹 fallback: mantém o campo manual ou usa 0
       const current = parseFloat(document.getElementById('ts_routine').value.replace(',', '.'));
        document.getElementById('ts_routine').value = isNaN(current) ? 0 : current;
    }
}


                });

                if(!foundData.age || !foundData.si) {
    // A rotina não é mais obrigatória; usará o padrão "0" se não for encontrada.
    console.warn("Simulador: Não foi possível ler a Rotina, usando o valor padrão '0'.");
}

                const positionCell = document.querySelector(".favposition.long");
                if (positionCell) {
                    const posIndex = findPositionIndex(positionCell.textContent.trim());
                    if(posIndex !== -1) document.getElementById('ts_position').value = posIndex;
                }

                const skillTable = document.querySelector('table.skill_table');
                if(!skillTable) throw new Error("Tabela de atributos (skills) não encontrada.");
                const skillCells = skillTable.querySelectorAll('td');

                const skillMap = {
                    'ts_Str0': 0, 'ts_Pas0': 1, 'ts_Sta0': 2, 'ts_Cro0': 3, 'ts_Pac0': 4, 'ts_Tec0': 5,
                    'ts_Mar0': 6, 'ts_Hea0': 7, 'ts_Tac0': 8, 'ts_Fin0': 9, 'ts_Wor0': 10, 'ts_Lon0': 11,
                    'ts_Pos0': 12, 'ts_Set0': 13
                };
                let p0 = 0;
                for (const id in skillMap) {
                    const cellIndex = skillMap[id];
                    if (skillCells[cellIndex]) {
                         let skillValue = 0;
                         if (skillCells[cellIndex].innerHTML.includes("star.png")) skillValue = 20;
                         else if (skillCells[cellIndex].innerHTML.includes("star_silver.png")) skillValue = 19;
                         else skillValue = parseInt(skillCells[cellIndex].textContent, 10) || 0;
                         document.getElementById(id).textContent = skillValue;
                         p0 += skillValue;
                    } else {
                        throw new Error("Célula de atributo não encontrada. Formato da tabela pode ter mudado.");
                    }
                }
                document.getElementById('ts_p').textContent = p0;
            }

        } catch (e) {
            alert("Erro ao carregar dados: " + e.message);
            console.error(e);
        }
    }


    function runTrainingSimulation() {
        try { calc(); }
        catch(e) { alert("Ocorreu um erro durante a simulação: " + e.message); console.error(e); }
    }

    // ===================================================================================
    // ===== INÍCIO DA SEÇÃO R5 (LÓGICA DO R6 SCRIPT) =====
    // ===================================================================================

    const MR = Math.round;
    const MP = Math.pow;
    const ML = Math.log;

    const weightR5 = [
        [0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0], // DC
        [0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0], // DL/R
        [0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0], // DMC
        [0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0], // DML/R
        [0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0], // MC
        [0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0], // ML/R
        [0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0], // OMC
        [0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0], // OML/R
        [0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0], // F
        [0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116] // GK
    ];

    const positionFullNames = [ /* EN */ ["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"], /* BR */ ["Zagueiro Central", "Zagueiro Esquerdo", "Zagueiro Direito", "Volante Central", "Volante Esquerdo", "Volante Direito", "Meio-Campista Central", "Meio-Campista Esquerdo", "Meio-Campista Direito", "Meia Ofensivo Central", "Meia Ofensivo Esquerdo", "Meia Ofensivo Direito", "Atacante", "Goleiro"], /* PT */ ["Defesa Centro", "Defesa Esquerdo", "Defesa Direito", "Médio Defensivo Centro", "Médio Defensivo Esquerdo", "Médio Defensivo Direito", "Medio Centro", "Medio Esquerdo", "Medio Direito", "Medio Ofensivo Centro", "Medio Ofensivo Esquerdo", "Medio Ofensivo Direito", "Avançado", "Guarda-Redes"], ];

    function funFix2(i) { return (MR(i * 100) / 100).toFixed(2); }

    function findPositionIndex(position) {
        for (let i = 0; i < positionFullNames.length; i++) {
            for (let j = 0; j < positionFullNames[i].length; j++) {
                if (position.includes(positionFullNames[i][j])) return j;
            }
        }
        return -1;
    };

    // NOVA FUNÇÃO (Substitua a antiga calculateREREC por esta)
function calculateREREC(skills, SI, rou2) {
    let ratingR_final = [];
    const skillSum = skills.reduce((a, b) => a + b, 0);

    for (let j = 0; j < 10; j++) {
        const isCurrentArchetypeGK = (j === 9); // A verificação agora é feita dentro do loop
        const weight = isCurrentArchetypeGK ? 48717927500 : 263533760000;
        const remainder = MR((MP(2, ML(weight * SI) / ML(MP(2, 7))) - skillSum) * 10) / 10;

        let ratingR_j = 0;
        let remainderWeight2 = 0;
        let not20 = 0;

        const currentWeights = weightR5[j];

        for (let i = 0; i < currentWeights.length; i++) {
            ratingR_j += skills[i] * currentWeights[i];
            if (skills[i] < 20) {
                remainderWeight2 += currentWeights[i];
                not20++;
            }
        }

        if (not20 > 0 && (remainder / not20 > 0.9 || not20 === 0)) {
            remainderWeight2 = currentWeights.reduce((a, b) => a + b, 0);
            not20 = isCurrentArchetypeGK ? 11 : 14;
        }

        ratingR_j += (not20 > 0) ? (remainder * remainderWeight2) / not20 : 0;

        ratingR_final[j] = parseFloat(funFix2(ratingR_j + rou2 * 5));
    }
    return ratingR_final;
};

// =================================================================================
// COPIE E COLE ISSO PARA SUBSTITUIR A FUNÇÃO 'calculateFinalR5' INTEIRA
// =================================================================================
// =================================================================================
// SUBSTITUA A FUNÇÃO 'calculateFinalR5' INTEIRA POR ESTA
// =================================================================================
function calculateAllR5s(finalSkills, finalSI, rou) {
    try {
        if (isNaN(rou)) throw new Error(`Valor de Rotina (Routine) inválido. (Veio como: ${rou})`);

        // 1. Calcula constantes (que não dependem da posição) UMA VEZ.
        const rou2 = (3 / 100) * (100 - (100) * MP(Math.E, -rou * 0.035));
        const REREC_Result = calculateREREC(finalSkills, finalSI, rou2); // Array[10]
        const skillsB = finalSkills.map((skill, i) => (i === 1) ? skill : skill + rou2);
        const gainBase = funFix2((skillsB[0] ** 2 + skillsB[1] ** 2 * 0.5 + skillsB[2] ** 2 * 0.5 + skillsB[3] ** 2 + skillsB[4] ** 2 + skillsB[5] ** 2 + skillsB[6] ** 2) / 6 / 22.9 ** 2);
        const keepBase = funFix2((skillsB[0] ** 2 * 0.5 + skillsB[1] ** 2 * 0.5 + skillsB[2] ** 2 + skillsB[3] ** 2 + skillsB[4] ** 2 + skillsB[5] ** 2 + skillsB[6] ** 2) / 6 / 22.9 ** 2);
        const posGainWeights = [0.3, 0.3, 0.9, 0.6, 1.5, 0.9, 0.9, 0.6, 0.3];
        const posKeepWeights = [0.3, 0.3, 0.9, 0.6, 1.5, 0.9, 0.9, 0.6, 0.3];

        let allR5s = [];

        // 2. Faz um loop por todas as 13 posições
        for (let positionIndex = 0; positionIndex <= 13; positionIndex++) {
            const isGK = (positionIndex === 13);

            // 3. Calcula o R5 Base
            let r5Index = positionIndex;
            if (!isGK) {
                for (let i = 0; 2 + i <= r5Index; i += 2) { r5Index--; }
            } else {
                r5Index = 9;
            }
            const r5Base = REREC_Result[r5Index];

            // 4. Calcula Bônus Específicos da Posição
            const allBonus = isGK ? 0 : (() => {
                const headerBonus = skillsB[10] > 12 ? parseFloat(funFix2((MP(Math.E, (skillsB[10] - 10) ** 3 / 1584.77) - 1) * 0.8 + MP(Math.E, (skillsB[0] * skillsB[0] * 0.007) / 8.73021) * 0.15 + MP(Math.E, (skillsB[6] * skillsB[6] * 0.007) / 8.73021) * 0.05)) : 0;
                const fkBonus = parseFloat(funFix2(MP(Math.E, MP(skillsB[13] + skillsB[12] + skillsB[9] * 0.5, 2) * 0.002) / 327.92526));
                const ckBonus = parseFloat(funFix2(MP(Math.E, MP(skillsB[13] + skillsB[8] + skillsB[9] * 0.5, 2) * 0.002) / 983.65770));
                const pkBonus = parseFloat(funFix2(MP(Math.E, MP(skillsB[13] + skillsB[11] + skillsB[9] * 0.5, 2) * 0.002) / 1967.31409));
                return headerBonus + fkBonus + ckBonus + pkBonus;
            })();

            const posGain = isGK ? 0 : gainBase * posGainWeights[r5Index];
            const posKeep = isGK ? 0 : keepBase * posKeepWeights[r5Index];

            // 5. Soma tudo e armazena
            const finalR5 = funFix2(r5Base + allBonus + posGain + posKeep);
            allR5s.push(finalR5);
        }

        return allR5s; // Retorna o array[13] com todos os R5s

    } catch (error) {
        console.error("Erro ao calcular R5 Final:", error);
        return Array(14).fill("Erro"); // Retorna um array de erro se falhar
    }
}
// =================================================================================
// SUBSTITUA A FUNÇÃO 'calc' INTEIRA POR ESTA
// =================================================================================
function calc() {
    // ================== LEITURA DOS DADOS DA INTERFACE ==================
    const phy3 = parseFloat(document.getElementById("ts_phy3").value) || 0;
    const tac3 = parseFloat(document.getElementById("ts_tac3").value) || 0;
    const tec3 = parseFloat(document.getElementById("ts_tec3").value) || 0;
    const wk1 = parseInt(document.getElementById("ts_wk1").value, 10) || 0;
    const ti1 = parseInt(document.getElementById("ts_ti1").value, 10) || 0;
    const wk2 = parseInt(document.getElementById("ts_wk2").value, 10) || 0;
    const ti2 = parseInt(document.getElementById("ts_ti2").value, 10) || 0;
    const wk3 = parseInt(document.getElementById("ts_wk3").value, 10) || 0;
    const ti3 = parseInt(document.getElementById("ts_ti3").value, 10) || 0;
    const sp = parseInt(document.getElementById("ts_sp").value, 10);
    const years = parseInt(document.getElementById("ts_years").textContent, 10);
    const month = parseInt(document.getElementById("ts_month").textContent, 10);
    const si = parseFloat(document.getElementById("ts_si").textContent);
    const Str = parseFloat(document.getElementById("ts_Str0").textContent); const Pas = parseFloat(document.getElementById("ts_Pas0").textContent);
    const Sta = parseFloat(document.getElementById("ts_Sta0").textContent); const Cro = parseFloat(document.getElementById("ts_Cro0").textContent);
    const Pac = parseFloat(document.getElementById("ts_Pac0").textContent); const Tec = parseFloat(document.getElementById("ts_Tec0").textContent);
    const Mar = parseFloat(document.getElementById("ts_Mar0").textContent); const Hea = parseFloat(document.getElementById("ts_Hea0").textContent);
    const Tac = parseFloat(document.getElementById("ts_Tac0").textContent); const Fin = parseFloat(document.getElementById("ts_Fin0").textContent);
    const Wor = parseFloat(document.getElementById("ts_Wor0").textContent); const Lon = parseFloat(document.getElementById("ts_Lon0").textContent);
    const Pos = parseFloat(document.getElementById("ts_Pos0").textContent); const Set = parseFloat(document.getElementById("ts_Set0").textContent);
    // --- INÍCIO DA CORREÇÃO DE CACHE ---
    const routineElement = document.getElementById("ts_routine");
    if (routineElement) {
        const rouText = routineElement.value.replace(',', '.');
        TS_ROUTINE_CACHE = parseFloat(rouText) || 0;
    }
    const rou = TS_ROUTINE_CACHE;
    // --- FIM DA CORREÇÃO DE CACHE ---

    const resultSummaryArea = document.getElementById('ts_results_summary');
    const resultSkillsArea = document.getElementById('ts_results_skills');
    const debugArea = document.getElementById('ts_debug');
    resultSummaryArea.innerHTML = ''; resultSkillsArea.innerHTML = ''; debugArea.innerHTML = '';

    // ================== RESET DAS VARIÁVEIS DE GANHO ==================
    let gains = { Str: 0, Sta: 0, Pac: 0, Mar: 0, Tac: 0, Wor: 0, Pos: 0, Pas: 0, Cro: 0, Tec: 0, Hea: 0, Fin: 0, Lon: 0, Set: 0 };
    const initialSkills = { Str, Sta, Pac, Mar, Tac, Wor, Pos, Pas, Cro, Tec, Hea, Fin, Lon, Set };
    const skillKeys = ["Str", "Sta", "Pac", "Mar", "Tac", "Wor", "Pos", "Pas", "Cro", "Tec", "Hea", "Fin", "Lon", "Set"];
    const spKey = skillKeys[sp];

    const allsum = Object.values(initialSkills).reduce((a, b) => a + b, 0);
    const weekold = (years - 15) * 12 + month;
    const allti = wk1 * ti1 + wk2 * ti2 + wk3 * ti3;
    const trainingType = document.querySelector('input[name="ts_training_type"]:checked').value;
    let n = 0;

    // Função auxiliar para aplicar ganho e evitar que passe de 20
    function applyGain(skillKey, amount) {
        if (initialSkills[skillKey] + gains[skillKey] < 20) {
            gains[skillKey] += amount;
            if (initialSkills[skillKey] + gains[skillKey] > 20) {
                gains[skillKey] = 20 - initialSkills[skillKey];
            }
            return true;
        }
        return false;
    }

    // ================== LÓGICA DE TREINO PRINCIPAL ==================
    if (trainingType === 'custom') {
        const t1=parseInt(document.getElementById("ts_t1").value,10)||0, t2=parseInt(document.getElementById("ts_t2").value,10)||0, t3=parseInt(document.getElementById("ts_t3").value,10)||0,
              t4=parseInt(document.getElementById("ts_t4").value,10)||0, t5=parseInt(document.getElementById("ts_t5").value,10)||0, t6=parseInt(document.getElementById("ts_t6").value,10)||0;

        if(t1+t2+t3+t4+t5+t6!==12){ resultSummaryArea.innerHTML=`<span style="color:red;">A soma dos pontos de treino customizado deve ser 12.</span>`; return; }
        const teamarr=[t1,t2,t3,t4,t5,t6]; let teamarr2=[];
        for(let i=0;i<6;i++){if(teamarr[i]==1)teamarr2.push(10);else if(teamarr[i]==2)teamarr2.push(17);else if(teamarr[i]==3)teamarr2.push(23);else if(teamarr[i]==4)teamarr2.push(25);else teamarr2.push(0)}
        const k=(teamarr2[0]+teamarr2[1]+teamarr2[2]+teamarr2[3]+teamarr2[4]+teamarr2[5])/102; n=allti*k;
        for(let i=0;i<n;i++){
            let skill={Str:Str+gains.Str,Sta:Sta+gains.Sta,Pac:Pac+gains.Pac,Mar:Mar+gains.Mar,Tac:Tac+gains.Tac,Wor:Wor+gains.Wor,Pos:Pos+gains.Pos,Pas:Pas+gains.Pas,Cro:Cro+gains.Cro,Tec:Tec+gains.Tec,Hea:Hea+gains.Hea,Fin:Fin+gains.Fin,Lon:Lon+gains.Lon,Set:Set+gains.Set};
            let physum=(skill.Str+skill.Sta+skill.Pac+skill.Hea),tacsum=(skill.Mar+skill.Tac+skill.Wor+skill.Pos),tecsum=(skill.Pas+skill.Cro+skill.Tec+skill.Fin+skill.Lon+skill.Set);
            let physum100=physum/80,tacsum100=tacsum/80,tecsum100=tecsum/120;let gained=false;
            if(Math.random()<=1/18){if(applyGain(spKey,skill[spKey]>15&&Math.random()<0.55?0.01:0.1))gained=true}
            if(!gained){
                const allt=t1*3+t2*2+t3*2+t4*3+t5*2+t6*2;let rand1=Math.random();let tickUsed=true;
            if(physum100<=phy3 && rand1<=t1/allt){if(!applyGain('Str',skill.Str>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(physum100<=phy3 && rand1<=2*t1/allt){if(!applyGain('Sta',skill.Sta>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(physum100<=phy3 && rand1<= (2*t1+t3)/allt){if(!applyGain('Pac',skill.Pac>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(physum100<=phy3 && rand1<= (2*t1+t3+t5)/allt){if(!applyGain('Hea',skill.Hea>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tacsum100<=tac3 && rand1<=(2*t1+t3+t5+t2)/allt){if(!applyGain('Mar',skill.Mar>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tacsum100<=tac3 && rand1<=(2*t1+t3+t5+2*t2)/allt){if(!applyGain('Tac',skill.Tac>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tacsum100<=tac3 && rand1<=(3*t1+t3+t5+2*t2)/allt){if(!applyGain('Wor',skill.Wor>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tacsum100<=tac3 && rand1<=(3*t1+t3+2*t5+2*t2)/allt){if(!applyGain('Pos',skill.Pos>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2)/allt){if(!applyGain('Cro',skill.Cro>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2+t4)/allt){if(!applyGain('Tec',skill.Tec>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2+2*t4)/allt){if(!applyGain('Pas',skill.Pas>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2+2*t4+t6)/allt){if(!applyGain('Fin',skill.Fin>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2+2*t4+2*t6)/allt){if(!applyGain('Lon',skill.Lon>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            else if(tecsum100<=tec3 && rand1<=(3*t1+2*t3+2*t5+2*t2+3*t4+2*t6)/allt){if(!applyGain('Set',skill.Set>15&&Math.random()<0.55?0.01:0.1))tickUsed=false}
            }
        }
    }

    // ================== CÁLCULO E EXIBIÇÃO DOS RESULTADOS ==================
    let finalSkills = {};
    for (const key of skillKeys) {
        finalSkills[key] = initialSkills[key] + gains[key];
    }

    let p = Object.values(gains).reduce((a, b) => a + b, 0);
    let weekoldt = weekold + wk1 + wk2 + wk3;
    let x = -5.84485627273868*(Math.pow(si,-0.0425431081668081))+41.3387601579835*(Math.pow(si,0.144557109926189));
    let sit = 9.53538115100422*(Math.pow(10,-12))*(Math.pow((x+p),6.86120940962027))+1.47316921537882*(Math.pow(10,-8))*(Math.pow((x+p),4.9313925971546));

    const finalSkillsArray = skillKeys.map(key => finalSkills[key]);

    // --- INÍCIO DA MODIFICAÇÃO (OTIMIZADOR DE POSIÇÃO) ---

    // 1. Calcula o R5 para TODAS as posições
    const allR5Results = calculateAllR5s(finalSkillsArray, sit, rou); // Array[13]

    // 2. Pega o R5 da posição que está selecionada no dropdown
    const selectedPositionIndex = parseInt(document.getElementById('ts_position').value, 10) || 0;
    const finalR5Value = allR5Results[selectedPositionIndex];

    // 3. Cria a tabela ordenada de R5
    const posNames = ["DC", "DL", "DR", "DMC", "DML", "DMR", "MC", "ML", "MR", "OMC", "OML", "OMR", "F", "GK"];
    let r5WithPositions = allR5Results.map((r5, index) => ({
        name: posNames[index],
        value: parseFloat(r5)
    }));

    // Ordena do maior para o menor
    r5WithPositions.sort((a, b) => b.value - a.value);

    let r5TableHtml = '<h5 style="color: #4CAF50; margin: 10px 0 5px 0; border-top: 1px solid #555; padding-top: 10px;">R5 Simulado (Todas Posições)</h5>';
    r5TableHtml += '<table style="width: 100%; font-size: 0.9em;"><tbody>';

    r5WithPositions.forEach((pos, index) => {
        // Destaca a melhor posição
        const style = (index === 0) ? 'style="color: gold; font-weight: bold;"' : '';
        r5TableHtml += `<tr>
                            <td ${style}>${pos.name}</td>
                            <td ${style} align="right">${pos.value.toFixed(2)}</td>
                        </tr>`;
    });
    r5TableHtml += '</tbody></table>';

    // --- FIM DA MODIFICAÇÃO ---


    // 4. Exibe os resultados principais
    resultSummaryArea.innerHTML = `
        <p><b>Idade Final:</b> ${Math.floor(weekoldt/12)+15}a e ${weekoldt%12}m</p>
        <p><b>Ganho de Atributos:</b> ${p.toFixed(2)}</p>
        <p><b>SI Final:</b> ${sit.toFixed(0)}</p>
        <p style="color: gold; font-weight: bold;"><b>R5 Simulado (Pos. Sel.):</b> ${finalR5Value}</p>
        ${r5TableHtml}`; // Adiciona a nova tabela ao final

    // 5. Exibe os ganhos de atributos
    let skillsHtml = '';
    for (const key of skillKeys) {
        skillsHtml += `<span>${key}: ${initialSkills[key].toFixed(2)} → <b>${finalSkills[key].toFixed(2)}</b> (+${gains[key].toFixed(2)})</span>`;
    }
     resultSkillsArea.innerHTML = skillsHtml.replace(/Str:/,'Força:').replace(/Sta:/,'Resist.:').replace(/Pac:/,'Veloc.:').replace(/Mar:/,'Marc.:').replace(/Tac:/,'Desarme:').replace(/Wor:/,'Dedic.:').replace(/Pos:/,'Posic.:').replace(/Pas:/,'Passe:').replace(/Cro:/,'Cruz.:').replace(/Tec:/,'Técnica:').replace(/Hea:/,'Cabec.:').replace(/Fin:/,'Finaliz.:').replace(/Lon:/,'Ch.Longe:').replace(/Set:/,'B.Parada:');
}
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("trainingSimHeader");
        if (header) { header.onmousedown = dragMouseDown; }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            const parent = elmnt.parentElement;
            parent.style.top = (parent.offsetTop - pos2) + "px";
            parent.style.left = (parent.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // ===================================================================================
    // INICIALIZAÇÃO
    // ===================================================================================

    function initializeAll() {
        initializeR5Simulator();
        initializeTrainingSimulator();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }

})();