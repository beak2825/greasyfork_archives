// ==UserScript==
// @name         SISCAD 2.0
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-fill SISCAD form from CSV data with automatic status tracking
// @author       Adriel Alves / github.com/adriel45dev
// @match        http://201.182.66.178:2210/plpt_cemar/*
// @match        http://201.182.66.178:2210/plpt_cepisa/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549756/SISCAD%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/549756/SISCAD%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the floating panel
    GM_addStyle(`
        #csvPanel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #0066cc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 99999999999999999999999;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #csvPanelHeader {
            background: #3892d4;
            color: white;
            padding: 8px;
            font-weight: bold;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #csvPanelClose {
            cursor: pointer;
            font-size: 18px;
        }
        #csvPanelContent {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        #csvPanelControls {
            padding: 10px;
            background: #f0f0f0;
            display: flex;
            gap:5px;
            justify-content: space-between;
        }
        #csvRecordsList {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #csvRecordsList li {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #csvRecordsList li:hover {
            background-color: #f0f0f0;
        }
        #csvRecordsList li.active {
            background-color: #0066cc;
            color: white;
        }
        .record-status {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 8px;
        }
        .status-current {
            background-color: #ffcc00;
            color: #000;
        }
        .status-pending {
            background-color: #ff9900;
            color: #fff;
        }
        .status-completed {
            background-color: #00aa00;
            color: #fff;
        }
        .csvPanelBtn {
            padding: 5px 10px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            flex: 1;
        }
        .csvPanelBtn:hover {
            background: #0055aa;
        }
        #csvFileInput {
            width: 100%;
            margin-bottom: 10px;
        }
        .record-info {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `);

    // Configuration
    const TABS = {
        dados: "*Elemento PEP:",
        endereco: "*Medidor Referência:",
        equipamentos: "*Medidor/Inversor:",
        observacoes: "Responsável:",
        localizacao: "Latitude:"
    };

    const INDEX_INPUTS = {
        dados: {
            elementoPep: 28,
            contaContrato: 3,
            cpf: 25,
            nome: 4,
            dtNascimento: 0,
            sexo: 1,
            estadoCivil: 2,
            naturalidade: 19,
            statusCliente: 22,
            notaLN: 26,
            nomeMae: 5,
            rg: 6,
            origem: 20,
            dtEmissao: 7,
            profissao: 18,
            email: 8,
            nroNIS: 24,
            situacaoNIS: 23,
            ctps: 9,
            serie: 10,
            nis: 12,
            digitoNIS: 11,
            rani: 14,
            digitoRANI: 13,
            oficioPrefeitura: 16,
            digitoOficio: 15,
            cpfTerceiro: 29,
            nomeTerceiro: 30,
            dtNascTerceiro: 31
        },
        endereco: {
            medidorReferencia: 0,
            seqLeitura: 1,
            ucReferencia: 2,
            nomePovoado: 4,
            tipo: 15,
            endereco: 5,
            numero: 6,
            bairro: 8,
            complemento: 7,
            municipio: 3,
            cep: 11,
            telefone: 10,
            telefoneAdicional: 9
        },
        equipamentos: {
            medidorInversor: 0,
            numeroLacre: 1,
            alturaPosteFerro: 2,
            tombCia: 3,
            ultimaLeitura: 13,
            fase: 4,
            georede: 5,
            numeroComp: 6,
            dtEnergizacao: 7,
            numeroPessoas: 8,
            potenciaTrafoInversor: 10,
            leituraInstalada: 14,
            tensao: 15,
            kitInstalado: 11,
            disjuntor: 12
        },
        observacoes: {
            responsavel: 0,
            matricula: 1,
            observacoesGerais: 2
        },
        localizacao: {
            latitude: 0,
            longitude: 1
        }
    };

    // Status constants
    const STATUS = {
        PENDING: 'pending',
        CURRENT: 'current',
        COMPLETED: 'completed'
    };

    // Global variables
    let csvData = [];
    let currentRecordIndex = 0;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Create the floating panel
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'csvPanel';

        panel.innerHTML = `
            <div id="csvPanelHeader">
                <span>CADASTRO SISCAD</span>
                <span id="csvPanelClose">×</span>
            </div>
            <div id="csvPanelContent">
                <input type="file" id="csvFileInput" accept=".csv">
                <ul id="csvRecordsList"></ul>
            </div>
            <div id="csvPanelControls">
                <button id="prevRecordBtn" class="csvPanelBtn" disabled>Anterior</button>
                <button id="insertRecordBtn" class="csvPanelBtn" disabled>Inserir</button>
                <button id="nextRecordBtn" class="csvPanelBtn" disabled>Próximo</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);
        document.getElementById('insertRecordBtn').addEventListener('click', insertCurrentRecord);
        document.getElementById('prevRecordBtn').addEventListener('click', () => navigateRecords(-1));
        document.getElementById('nextRecordBtn').addEventListener('click', () => navigateRecords(1));
        document.getElementById('csvPanelClose').addEventListener('click', () => panel.style.display = 'none');

        // Make panel draggable
        const header = document.getElementById('csvPanelHeader');
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    // Drag and drop functions for the panel
    function startDrag(e) {
        if (e.target.id === 'csvPanelHeader') {
            isDragging = true;
            const panel = document.getElementById('csvPanel');
            dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
            dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault();
        }
    }

    function drag(e) {
        if (isDragging) {
            const panel = document.getElementById('csvPanel');
            panel.style.left = (e.clientX - dragOffsetX) + 'px';
            panel.style.top = (e.clientY - dragOffsetY) + 'px';
        }
    }

    function stopDrag() {
        isDragging = false;
    }

    // Handle CSV file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: function(results) {
                csvData = results.data.map(record => {
                    // Initialize all records as pending
                    return {
                        ...record,
                        _status: STATUS.PENDING
                    };
                });
                currentRecordIndex = 0;
                updateRecordsList();
                updateControls();
            },
            error: function(error) {
                alert('Error parsing CSV: ' + error.message);
            }
        });
    }

    // Update the records list in the panel
    function updateRecordsList() {
        const list = document.getElementById('csvRecordsList');
        list.innerHTML = '';

        csvData.forEach((record, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            const recordInfo = document.createElement('div');
            recordInfo.className = 'record-info';
            recordInfo.textContent = `${record.num_servico || 'N/A'} - ${record.nome || 'N/A'}`;

            const statusSpan = document.createElement('span');
            statusSpan.className = 'record-status';

            // Set status class and text
            switch (record._status) {
                case STATUS.CURRENT:
                    statusSpan.classList.add('status-current');
                    statusSpan.textContent = 'Atual';
                    break;
                case STATUS.PENDING:
                    statusSpan.classList.add('status-pending');
                    statusSpan.textContent = 'Pendente';
                    break;
                case STATUS.COMPLETED:
                    statusSpan.classList.add('status-completed');
                    statusSpan.textContent = 'Concluído';
                    break;
            }

            li.appendChild(recordInfo);
            li.appendChild(statusSpan);

            if (index === currentRecordIndex) {
                li.classList.add('active');
            }

            li.addEventListener('click', () => {
                currentRecordIndex = parseInt(li.dataset.index);
                updateRecordsList();
                updateControls();
            });

            list.appendChild(li);
        });
    }

    // Update control buttons state
    function updateControls() {
        document.getElementById('prevRecordBtn').disabled = currentRecordIndex <= 0;
        document.getElementById('nextRecordBtn').disabled = currentRecordIndex >= csvData.length - 1;
        document.getElementById('insertRecordBtn').disabled = csvData.length === 0;
    }

    // Navigate between records
    function navigateRecords(direction) {
        // Mark current record as completed if moving forward
        if (direction > 0 && csvData[currentRecordIndex]) {
            csvData[currentRecordIndex]._status = STATUS.COMPLETED;
        }

        currentRecordIndex += direction;
        if (currentRecordIndex < 0) currentRecordIndex = 0;
        if (currentRecordIndex >= csvData.length) currentRecordIndex = csvData.length - 1;

        // Mark new current record
        if (csvData[currentRecordIndex]) {
            csvData[currentRecordIndex]._status = STATUS.CURRENT;
        }

        updateRecordsList();
        updateControls();
    }

    // Insert current record into the form
    function insertCurrentRecord() {
        if (csvData.length === 0 || currentRecordIndex < 0 || currentRecordIndex >= csvData.length) return;

        const record = csvData[currentRecordIndex];

        // Mark the "Serviço" radio button
        const servicoRadio = Array.from(document.querySelectorAll('label')).find((el) => el.textContent.trim() === "Serviço:").parentElement.querySelectorAll("input")[0];
        if (servicoRadio && !servicoRadio.checked) {
            servicoRadio.click();
        }

        // Fill each tab
        fillTab('dados', record);
        fillTab('endereco', record);
        fillTab('equipamentos', record);
        fillTab('observacoes', record);
        fillTab('localizacao', record);

        // Check the checkbox if needed
        const btnCheckbox = Array.from(document.querySelectorAll('label')).find((el) => el.textContent.trim() === "*Medidor/Inversor:").parentElement.querySelectorAll("input")[9];
        if (btnCheckbox && !btnCheckbox.checked) {
            btnCheckbox.click();
        }

        // Mark as current (in case it wasn't already)
        record._status = STATUS.CURRENT;
        updateRecordsList();

        alert(`Dados do registro ${currentRecordIndex + 1} (${record.num_servico || 'N/A'}) inseridos com sucesso!`);
    }

    // Fill a specific tab with data
    function fillTab(tabName, record) {
        const tabLabel = TABS[tabName];
        if (!tabLabel) return;

        const tabInputs = Array.from(document.querySelectorAll('label')).find((el) => el.textContent.trim() === tabLabel).parentElement.querySelectorAll("input,textarea");
        const tabMapping = INDEX_INPUTS[tabName];

        for (const [field, index] of Object.entries(tabMapping)) {
            if (record[field] !== undefined && tabInputs[index]) {
                const input = tabInputs[index];
                const value = record[field];

                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = !!value;
                } else {
                    input.value = value;
                }
            }
        }
    }

    // Initialize the panel when the page loads
    window.addEventListener('load', createPanel);
})();