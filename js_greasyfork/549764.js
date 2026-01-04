// ==UserScript==
// @name         Image Extractor Pro V2 - Multi Service
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Extrai imagens de múltiplas telas, suportando diferentes tipos de serviço com fallback automático.
// @author       Adriel Alves (Modified)
// @match        https://cenegedpa.gpm.srv.br/ci/Servico/ConsultaServicos/pesquisar*
// @match        https://cenegedpa.gpm.srv.br/gpm/geral/relatorio_servico.php?tela=GR032*
// @match        https://cenegedpa.gpm.srv.br/gpm/geral/checklists_relatorio.php*
// @match        https://cenegedpa.gpm.srv.br/#GR032
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        window.close
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549764/Image%20Extractor%20Pro%20V2%20-%20Multi%20Service.user.js
// @updateURL https://update.greasyfork.org/scripts/549764/Image%20Extractor%20Pro%20V2%20-%20Multi%20Service.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = 'imageExtractor_v2_4_';
    let completionCheckIntervalId = null;
    const COMPLETION_CHECK_INTERVAL = 2000;

    // Modificado para suportar múltiplos serviços por tipo
    // Agora cada tipo de serviço pode ter um array de possíveis textos para buscar
    const SERVICOS = {
        MANUTENCAO: [
            "MANUTENCAO_CORRETIVA_",
            "MANUTENCAO_CORRETIVA_MA",
            "MANUTENÇÃO CORRETIVA",
            "MANUTENCAO CORRETIVA"
        ],
        SIGFI: [
            "RELATORIO SERVIÇO SIGFI",
            "RELATORIO SERVICO SIGFI",
            "RELATÓRIO SERVIÇO SIGFI"
        ],
        SIGFI_60: [
            "INSTALACAO - LIGACAO SIGFI 60",
            "INSTALAÇÃO - LIGAÇÃO SIGFI 60",
            "INSTALACAO LIGACAO SIGFI 60"
        ],
        SIGFI_80: [
            "EXTRA_PARCIAL",
            "SIGFI_ 70%"
        ],
        SIGFI_80_100: [
            "RELATORIO SERVIÇO SIGFI",
        ],
        PREVENTIVA: [
            "MANUNTECAO_PREVENTIVA SIGFI_",
            "MANUTENÇÃO_PREVENTIVA SIGFI_",
            "MANUTENCAO_PREVENTIVA SIGFI",
            "MANUTENÇÃO PREVENTIVA SIGFI"
        ],
        PREVENTIVA_80: [
            "MANUNTECAO_PREVENTIVA SIGFI_80",
            "MANUTENÇÃO_PREVENTIVA SIGFI_80",
            "MANUTENCAO_PREVENTIVA SIGFI 80"
        ],
        PREVENTIVA_CONTROLADOR: [
            "MANUNTECAO_PREVENTIVA SIGFI_",
            "MANUTENÇÃO_PREVENTIVA CONTROLADOR",
            "MANUTENCAO PREVENTIVA CONTROLADOR"
        ],
         COMPLEMENTACAO: [
            "PARCIAL",
            "SIGFI_30%"
        ]
    };

    // Seletores de imagem permanecem os mesmos
    const IMAGE_SELECTORS = {

        COMPLEMENTACAO: {
            'CAIXA': { query: "FOTO DA UNIDADE ELETRONICA + BATERIA:", index: 0 },
            'SIGFI': { query: "FOTO - SIGFI:", index: 0 },
            'INVERSOR': { query: "Nº INVERSOR:", index: 0 },
            'ASSINATURA': { query: "ASSINATURA DO CLIENTE:", index: 0 },
            //'TERMO_01': { query: "FOTO DA ENTREGA DA CARTILHA AO CLIENTE E TERMO DE RESPONSABILIDADE:", index: 0 },
            //'TERMO_02': { query: "FOTO DA ENTREGA DA CARTILHA AO CLIENTE E TERMO DE RESPONSABILIDADE:", index: 1 }
        },
        MANUTENCAO: {
            'CONTROLADOR': { query: "CONTROLADOR.:", index: 0 },
            'CONTROLADOR_ALT': { query: "CONTROLADOR :", index: 0 }, // Alternativa
            'INVERSOR': { query: "INVERSOR:", index: 0 },
            'MODULO_01': { query: "Modulo 01:", index: 0 },
            'MODULO_02': { query: "Modulo 02:", index: 0 },
            'BATERIA': { query: "BATERIA 01:", index: 0 },
            'BATERIA_ALT': { query: "BATERIA:", index: 0 } // Alternativa
        },
        SIGFI: {
            'INVERSOR': { query: "Nº INVERSOR:", index: 0 },
            'CONTROLADOR': { query: "SERIAL - CONTROLADOR:", index: 0},
            'MODULO_01': { query: "SERIAL - MODULO 01:", index: 0 },
            'MODULO_02': { query: "SERIAL - MODULO 02:", index: 0 },
            'BATERIA': { query: "SERIAL - BATERIA:", index: 0 },
            'FACHADA': { query: "FOTO DA FACHADA:", index: 0 },
            'RG_1': { query: "FOTO DO RG:", index: 0 },
            'RG_2': { query: "FOTO DO RG:", index: 1 },
            'CPF': { query: "FOTO DO CPF:", index: 0 }
        },
        SIGFI_60: {
            'INVERSOR': { query: "Nº INVERSOR:", index: 0 },
            'CONTROLADOR': { query: "FOTO CONTROLADOR(ES):", index: 0 },
            'MODULO_01': { query: "Nº MODULO_01:", index: 0 },
            'MODULO_01_b': { query: "Nº MODULO_01:", index: 1 },
            'MODULO_02': { query: "Nº MODULO_02:", index: 0 },
            'MODULO_02_b': { query: "Nº MODULO_02:", index: 1 },
            'BATERIA': { query: "Nº BATERIA_01:", index: 0 }
        },
        SIGFI_80: {
            'FACHADA': { query: "FOTO DA FACHADA:", index: 0 },
            'RG_01': { query: "FOTO DO RG:", index: 0 },
            'RG_02': { query: "FOTO DO RG:", index: 1 },
            'CPF': { query: "FOTO DO CPF:", index: 0 },
        },
        SIGFI_80_100: {
            'RG_01': { query: "FOTO DO RG:", index: 0 },
            'RG_02': { query: "FOTO DO RG:", index: 1 },
            'CPF': { query: "FOTO DO CPF:", index: 0 },
            'ASSINATURA': { query: "ASSINATURA DO CLIENTE:", index: 0 },
            'INVERSOR': { query: "Nº INVERSOR:", index: 0 },
            'CAIXA': { query: "FOTO DA UNIDADE ELETRONICA + BATERIA:", index: 0 },
            'SIGFI': { query: "FOTO - SIGFI:", index: 0 },
            'FACHADA': { query: "FOTO DA FACHADA:", index: 0 },
        },

        PREVENTIVA: {
            'INVERSOR': { query: "INVERSOR:", index: 0 },
            'CONTROLADOR': { query: "CONTROLADOR 01:", index: 0 },
            'MODULO_01': { query: "MODULO 01.:", index: 0 },
            'MODULO_02': { query: "MODULO 02.:", index: 0 },
            'BATERIA': { query: "BATERIA:", index: 0 }
        },
        PREVENTIVA_80: {
            'INVERSOR': { query: "INVERSOR:", index: 0 },
            'CONTROLADOR': { query: "CONTROLADOR 01:", index: 0 },
            'MODULO_01': { query: "MODULO 01.:", index: 0 },
            'MODULO_02': { query: "MODULO 02.:", index: 0 },
            'BATERIA': { query: "BATERIA:", index: 0 }
        },
        PREVENTIVA_CONTROLADOR: {
            'CONTROLADOR': { query: "CONTROLADOR 01:", index: 0 },
        },
    };

    const URL_TELA_1 = "https://cenegedpa.gpm.srv.br/ci/Servico/ConsultaServicos/pesquisar";
    const URL_TELA_2 = "https://cenegedpa.gpm.srv.br/gpm/geral/relatorio_servico.php?tela=GR032";
    const URL_TELA_3 = "https://cenegedpa.gpm.srv.br/gpm/geral/checklists_relatorio.php";

    // --- Funções Utilitárias ---
    function findImageElement(query, index = 0) {
        const tdElements = Array.from(document.getElementsByTagName('td'));
        const targetTd = tdElements.find(td => td.textContent && td.textContent.trim() === query);
        if (!targetTd || !targetTd.parentElement || !targetTd.parentElement.nextElementSibling) {
            return null;
        }
        const images = targetTd.parentElement.nextElementSibling.getElementsByTagName('img');
        return (images && images.length > index) ? images[index] : null;
    }

    function downloadImageWithGM(url, filename) {
        return new Promise((resolve, reject) => {
            if (!url || !(url.startsWith('http') || url.startsWith('data:'))) {
                console.error(`URL inválida para download: ${url}`);
                return reject(new Error(`URL inválida: ${url}`));
            }
            console.log(`Tentando baixar: ${url} como ${filename}`);
            GM_download({
                url: url,
                name: filename,
                onload: () => {
                    logMessageP1(`Download iniciado: ${filename}`);
                    resolve(filename);
                },
                onerror: (err) => {
                    console.error(`Erro ao baixar ${filename}:`, err);
                    logMessageP1(`Falha no download: ${filename} - ${err.error || 'Erro desconhecido'}`);
                    reject(err);
                },
                ontimeout: () => {
                    console.error(`Timeout ao baixar ${filename}`);
                    logMessageP1(`Timeout no download: ${filename}`);
                    reject(new Error('Timeout'));
                }
            });
        });
    }

    function logMessageP1(message) {
        const logArea = document.getElementById(`${SCRIPT_PREFIX}logArea`);
        if (logArea) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${timestamp}] ${message}`;
            logArea.appendChild(logEntry);
            logArea.scrollTop = logArea.scrollHeight;
        }
        console.log(`[P1 Log] ${message}`);
    }

    function stopCompletionCheckLoop() {
        if (completionCheckIntervalId) {
            clearInterval(completionCheckIntervalId);
            completionCheckIntervalId = null;
            logMessageP1("Loop de verificação de conclusão (Tela 1) parado.");
        }
    }

    async function checkForServiceCompletion() {
        const currentStatus = await GM_getValue(`${SCRIPT_PREFIX}status`, 'idle');
        if (currentStatus !== 'processing') {
            stopCompletionCheckLoop();
            return;
        }

        const completedServiceId = await GM_getValue(`${SCRIPT_PREFIX}page3_completed_serviceId`);
        const errorServiceIdP2 = await GM_getValue(`${SCRIPT_PREFIX}page2_error_serviceId`);
        const errorServiceIdP1Click = await GM_getValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`);
        let currentServiceIndex = await GM_getValue(`${SCRIPT_PREFIX}currentServiceIndex`, 0);
        const allServiceData = JSON.parse(await GM_getValue(`${SCRIPT_PREFIX}allServiceIds`, '[]'));
        let serviceProcessedFlag = false;

        if (completedServiceId) {
            logMessageP1(`Verificação: Serviço ${completedServiceId} concluído (Tela 3).`);
            await GM_deleteValue(`${SCRIPT_PREFIX}page3_completed_serviceId`);
            currentServiceIndex++;
            serviceProcessedFlag = true;
        } else if (errorServiceIdP2) {
            logMessageP1(`Verificação: Erro na Tela 2 para serviço ${errorServiceIdP2}. Pulando.`);
            await GM_deleteValue(`${SCRIPT_PREFIX}page2_error_serviceId`);
            currentServiceIndex++;
            serviceProcessedFlag = true;
        } else if (errorServiceIdP1Click) {
            logMessageP1(`Verificação: Erro de clique na Tela 1 para serviço ${errorServiceIdP1Click}. Pulando.`);
            await GM_deleteValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`);
            currentServiceIndex++;
            serviceProcessedFlag = true;
        }

        if (serviceProcessedFlag) {
            await GM_setValue(`${SCRIPT_PREFIX}currentServiceIndex`, currentServiceIndex);
            await updateProgressUI();
            if (currentServiceIndex < allServiceData.length) {
                logMessageP1(`Avançando para o próximo serviço. Novo índice: ${currentServiceIndex}, ID: ${allServiceData[currentServiceIndex]?.id}`);
                processCurrentService_Tela1();
            } else {
                logMessageP1("Todos os serviços foram processados ou tentados (verificação).");
                await GM_setValue(`${SCRIPT_PREFIX}status`, 'completed');
                stopCompletionCheckLoop();
                await updateProgressUI();
            }
        }
    }

    function startCompletionCheckLoop() {
        if (!completionCheckIntervalId) {
            completionCheckIntervalId = setInterval(checkForServiceCompletion, COMPLETION_CHECK_INTERVAL);
            logMessageP1(`Loop de verificação de conclusão (Tela 1) iniciado.`);
        }
    }

    // --- Lógica da Tela 1: ConsultaServicos/pesquisar ---
    async function handleTela1() {
        console.log("Script rodando na Tela 1");
        createUI_Tela1();
        await updateProgressUI();
        const status = await GM_getValue(`${SCRIPT_PREFIX}status`, 'idle');
        console.log(`[Tela 1 Check Inicial] Status: ${status}`);
        if (status === 'processing') {
            logMessageP1("Status 'processing' detectado na Tela 1.");
            await checkForServiceCompletion();
            const currentStatusAfterCheck = await GM_getValue(`${SCRIPT_PREFIX}status`, 'idle');
            if (currentStatusAfterCheck === 'processing') {
                startCompletionCheckLoop();
            }
        }
    }

    async function createUI_Tela1() {
        if (document.getElementById(`${SCRIPT_PREFIX}controlPanel`)) return;
        const panel = document.createElement('div');
        panel.id = `${SCRIPT_PREFIX}controlPanel`;
        Object.assign(panel.style, {
            position: 'fixed', top: '10px', right: '10px', backgroundColor: 'white',
            border: '1px solid black', padding: '15px', zIndex: '9999',
            fontFamily: 'Arial, sans-serif', fontSize: '14px', maxWidth: '300px'
        });

        let serviceTypeOptionsHTML = '';
        for (const key in SERVICOS) {
            serviceTypeOptionsHTML += `<option value="${key}">${key}</option>`;
        }

        panel.innerHTML = `
            <h3 style="margin-top:0; margin-bottom:10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Extrator de Imagens V2.4</h3>
            <div>
                <label for="${SCRIPT_PREFIX}serviceTypeSelect" style="display: block; margin-bottom: 5px;">Tipo de Serviço:</label>
                <select id="${SCRIPT_PREFIX}serviceTypeSelect" style="width: 100%; padding: 5px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
                    ${serviceTypeOptionsHTML}
                </select>
            </div>
            <button id="${SCRIPT_PREFIX}startButton" style="padding: 8px 12px; margin-right: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Iniciar Extração</button>
            <button id="${SCRIPT_PREFIX}stopButton" style="padding: 8px 12px; margin-right: 5px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Parar</button>
            <button id="${SCRIPT_PREFIX}refreshButton" style="padding: 8px 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px; width:100%;">Atualizar Lista de Links</button>
            <div id="${SCRIPT_PREFIX}progressStatus" style="margin-top: 10px; font-weight: bold;">Status: Ocioso</div>
            <div id="${SCRIPT_PREFIX}serviceQueueInfo" style="margin-top: 5px;"></div>
            <div id="${SCRIPT_PREFIX}currentServiceInfo" style="margin-top: 5px;"></div>
            <div style="margin-top: 10px; font-weight: bold; border-top: 1px solid #eee; padding-top: 5px;">Log:</div>
            <div id="${SCRIPT_PREFIX}logArea" style="height: 100px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; font-size: 12px; background-color: #f9f9f9; margin-top:5px;"></div>
        `;
        document.body.appendChild(panel);

        const serviceTypeSelect = document.getElementById(`${SCRIPT_PREFIX}serviceTypeSelect`);
        serviceTypeSelect.addEventListener('change', async (event) => {
            await GM_setValue(`${SCRIPT_PREFIX}selectedServiceTypeUI`, event.target.value);
            logMessageP1(`Tipo de serviço selecionado: ${event.target.value}`);
        });

        const lastSelectedType = await GM_getValue(`${SCRIPT_PREFIX}selectedServiceTypeUI`, Object.keys(SERVICOS)[0]);
        serviceTypeSelect.value = lastSelectedType;

        document.getElementById(`${SCRIPT_PREFIX}startButton`).addEventListener('click', startExtraction_Tela1);
        document.getElementById(`${SCRIPT_PREFIX}stopButton`).addEventListener('click', stopExtraction_Tela1);
        document.getElementById(`${SCRIPT_PREFIX}refreshButton`).addEventListener('click', refreshServiceList_Tela1);
    }

    async function updateProgressUI() {
        const status = await GM_getValue(`${SCRIPT_PREFIX}status`, 'idle');
        const allServiceData = JSON.parse(await GM_getValue(`${SCRIPT_PREFIX}allServiceIds`, '[]'));
        const currentServiceIndex = await GM_getValue(`${SCRIPT_PREFIX}currentServiceIndex`, 0);
        const uiElements = {
            statusDiv: document.getElementById(`${SCRIPT_PREFIX}progressStatus`),
            queueInfoDiv: document.getElementById(`${SCRIPT_PREFIX}serviceQueueInfo`),
            currentServiceDiv: document.getElementById(`${SCRIPT_PREFIX}currentServiceInfo`),
            startButton: document.getElementById(`${SCRIPT_PREFIX}startButton`),
            stopButton: document.getElementById(`${SCRIPT_PREFIX}stopButton`),
            refreshButton: document.getElementById(`${SCRIPT_PREFIX}refreshButton`),
            serviceTypeSelect: document.getElementById(`${SCRIPT_PREFIX}serviceTypeSelect`)
        };
        if (!uiElements.statusDiv) return;

        let statusText = "Status: Ocioso";
        if (status === 'processing') statusText = "Status: Processando...";
        else if (status === 'stopped') statusText = "Status: Parado pelo usuário";
        else if (status === 'completed') statusText = "Status: Concluído!";
        uiElements.statusDiv.textContent = statusText;

        uiElements.queueInfoDiv.textContent = allServiceData.length > 0 ?
            `Serviços na fila: ${allServiceData.length}` : "Nenhum serviço na fila.";
        uiElements.currentServiceDiv.textContent = "";

        if (status === 'processing' && allServiceData.length > 0 && currentServiceIndex < allServiceData.length) {
            uiElements.currentServiceDiv.textContent = `Processando: ${currentServiceIndex + 1} de ${allServiceData.length} (ID: ${allServiceData[currentServiceIndex]?.id || 'N/A'})`;
        } else if (status === 'completed' && allServiceData.length > 0) {
            uiElements.currentServiceDiv.textContent = `Processados: ${allServiceData.length} de ${allServiceData.length}`;
        }

        uiElements.startButton.disabled = (status === 'processing');
        uiElements.stopButton.disabled = (status !== 'processing');
        uiElements.refreshButton.disabled = (status === 'processing');

        if (uiElements.serviceTypeSelect) {
            uiElements.serviceTypeSelect.disabled = (status === 'processing');
            if (status !== 'processing') {
                const lastSelectedType = await GM_getValue(`${SCRIPT_PREFIX}selectedServiceTypeUI`, Object.keys(SERVICOS)[0]);
                uiElements.serviceTypeSelect.value = lastSelectedType;
            }
        }
    }

    async function refreshServiceList_Tela1() {
        logMessageP1("Botão 'Atualizar Lista' clicado.");
        await stopExtraction_Tela1();
        logMessageP1("Limpando fila de serviços e flags de erro...");
        await GM_deleteValue(`${SCRIPT_PREFIX}allServiceIds`);
        await GM_deleteValue(`${SCRIPT_PREFIX}currentServiceIndex`);
        await GM_deleteValue(`${SCRIPT_PREFIX}page3_completed_serviceId`);
        await GM_deleteValue(`${SCRIPT_PREFIX}page2_error_serviceId`);
        await GM_deleteValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`);
        await GM_deleteValue(`${SCRIPT_PREFIX}activeBatchServiceType`);

        const serviceSpans = document.querySelectorAll(".sorting_1 span");
        if (serviceSpans.length === 0) {
            logMessageP1("Nenhum serviço encontrado na página para atualizar a lista.");
            alert("Nenhum serviço encontrado na página atualmente.");
        } else {
            const serviceData = Array.from(serviceSpans).map(span => ({ id: span.textContent.trim() }));
            await GM_setValue(`${SCRIPT_PREFIX}allServiceIds`, JSON.stringify(serviceData));
            logMessageP1(`Lista de serviços atualizada. ${serviceData.length} serviços encontrados.`);
        }
        await GM_setValue(`${SCRIPT_PREFIX}currentServiceIndex`, 0);
        await GM_setValue(`${SCRIPT_PREFIX}status`, 'idle');
        logMessageP1("Pronto para iniciar com a nova lista.");
        await updateProgressUI();
    }

    async function startExtraction_Tela1() {
        logMessageP1("Iniciando extração...");
        await GM_deleteValue(`${SCRIPT_PREFIX}page3_completed_serviceId`);
        await GM_deleteValue(`${SCRIPT_PREFIX}page2_error_serviceId`);
        await GM_deleteValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`);

        const selectedServiceTypeKey = document.getElementById(`${SCRIPT_PREFIX}serviceTypeSelect`).value;
        await GM_setValue(`${SCRIPT_PREFIX}activeBatchServiceType`, selectedServiceTypeKey);
        logMessageP1(`Tipo de serviço para este lote: ${selectedServiceTypeKey}`);

        let currentServiceData = JSON.parse(await GM_getValue(`${SCRIPT_PREFIX}allServiceIds`, '[]'));
        if (currentServiceData.length === 0) {
            const serviceSpans = document.querySelectorAll(".sorting_1 span");
            if (serviceSpans.length === 0) {
                logMessageP1("Nenhum serviço na lista. Clique em 'Atualizar Lista' ou verifique a página.");
                alert("Nenhum serviço na lista. Clique em 'Atualizar Lista' primeiro.");
                await GM_setValue(`${SCRIPT_PREFIX}status`, 'idle');
                await updateProgressUI();
                return;
            }
            currentServiceData = Array.from(serviceSpans).map(span => ({ id: span.textContent.trim() }));
            await GM_setValue(`${SCRIPT_PREFIX}allServiceIds`, JSON.stringify(currentServiceData));
            logMessageP1(`${currentServiceData.length} serviços adicionados à fila (busca inicial).`);
        } else {
            logMessageP1(`${currentServiceData.length} serviços já na fila.`);
        }

        await GM_setValue(`${SCRIPT_PREFIX}currentServiceIndex`, 0);
        await GM_setValue(`${SCRIPT_PREFIX}status`, 'processing');
        await updateProgressUI();
        processCurrentService_Tela1();
        startCompletionCheckLoop();
    }

    async function stopExtraction_Tela1() {
        logMessageP1("Extração parada.");
        await GM_setValue(`${SCRIPT_PREFIX}status`, 'stopped');
        stopCompletionCheckLoop();
        await updateProgressUI();
    }

    async function processCurrentService_Tela1() {
        const status = await GM_getValue(`${SCRIPT_PREFIX}status`);
        if (status !== 'processing') {
            logMessageP1("Processamento não está ativo. Interrompendo clique na Tela 1.");
            stopCompletionCheckLoop();
            await updateProgressUI();
            return;
        }
        const allServiceData = JSON.parse(await GM_getValue(`${SCRIPT_PREFIX}allServiceIds`, '[]'));
        const currentServiceIndex = await GM_getValue(`${SCRIPT_PREFIX}currentServiceIndex`, 0);

        if (currentServiceIndex >= allServiceData.length) {
            logMessageP1("Fila da Tela 1 concluída.");
            await GM_setValue(`${SCRIPT_PREFIX}status`, 'completed');
            stopCompletionCheckLoop();
            await updateProgressUI();
            return;
        }
        const serviceId = allServiceData[currentServiceIndex].id;
        logMessageP1(`Processando serviço ID: ${serviceId} (${currentServiceIndex + 1}/${allServiceData.length})`);
        await GM_setValue(`${SCRIPT_PREFIX}activeServiceId`, serviceId);
        await updateProgressUI();

        const targetSpan = Array.from(document.querySelectorAll(".sorting_1 span"))
            .find(span => span.textContent.trim() === serviceId);
        if (targetSpan) {
            logMessageP1(`Span para ID ${serviceId} encontrado. Clicando...`);
            if (typeof targetSpan.click === 'function') {
                targetSpan.click();
            } else {
                logMessageP1(`ERRO CRÍTICO: Span para ID ${serviceId} não tem .click(). Pulando.`);
                await GM_setValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`, serviceId);
                await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
            }
        } else {
            logMessageP1(`ERRO: Span para ID ${serviceId} não encontrado na Tela 1. Pulando.`);
            await GM_setValue(`${SCRIPT_PREFIX}page1_click_error_serviceId`, serviceId);
            await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
        }
    }

    // --- Lógica da Tela 2 MODIFICADA: Com suporte a múltiplos serviços ---
    async function handleTela2() {
        console.log("Script rodando na Tela 2");
        const activeServiceId = await GM_getValue(`${SCRIPT_PREFIX}activeServiceId`);
        const activeBatchServiceTypeKey = await GM_getValue(`${SCRIPT_PREFIX}activeBatchServiceType`);

        if (!activeServiceId || !activeBatchServiceTypeKey) {
            console.log("[Tela 2] Informação de serviço ativo ou tipo de lote ausente. Ignorando.");
            if (window.opener && !window.opener.closed) {
                console.log("[Tela 2] Aba órfã detectada. Tentando fechar...");
                setTimeout(() => {
                    console.log("[Tela 2] Executando window.close() para aba órfã.");
                    window.close();
                }, 500);
            }
            return;
        }
        console.log(`[Tela 2] Serviço OS ID: ${activeServiceId}, Tipo de Lote: ${activeBatchServiceTypeKey}`);

        // MODIFICAÇÃO PRINCIPAL: Agora tenta múltiplos textos de serviço
        const servicoTextsToTry = SERVICOS[activeBatchServiceTypeKey];
        if (!servicoTextsToTry || !Array.isArray(servicoTextsToTry)) {
            console.error(`[Tela 2] Textos de serviço para o tipo '${activeBatchServiceTypeKey}' não definidos. Sinalizando erro.`);
            await GM_setValue(`${SCRIPT_PREFIX}page2_error_serviceId`, activeServiceId);
            await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
            setTimeout(() => {
                console.log("[Tela 2] Executando window.close() devido a tipo de serviço inválido.");
                window.close();
            }, 1500);
            return;
        }

        let clickToScreen3Successful = false;
        let foundTd = null;
        let foundServiceText = null;

        // Tentar encontrar o TD com cada texto de serviço possível
        for (const serviceText of servicoTextsToTry) {
            console.log(`[Tela 2] Tentando encontrar TD com texto: '${serviceText}'`);

            const tdElements = Array.from(document.querySelectorAll('td'));
            foundTd = tdElements.find(el => {
                const text = el.textContent?.trim().toUpperCase();
                const searchText = serviceText.toUpperCase();
                // Tenta tanto startsWith quanto igualdade exata
                return text === searchText || text.startsWith(searchText);
            });

            if (foundTd) {
                foundServiceText = serviceText;
                console.log(`[Tela 2] TD encontrado com texto: '${serviceText}'`);
                break;
            }
        }

        if (foundTd && foundServiceText) {
            console.log(`[Tela 2] TD contendo '${foundServiceText}' encontrado. Tentando clicar...`);
            try {
                const parentElement = foundTd.parentElement;
                if (parentElement?.children[0]?.childNodes[2]) {
                    const targetNodeToClick = parentElement.children[0].childNodes[2];
                    console.log("[Tela 2] Alvo final (childNodes[2]) encontrado. Tentando clicar para abrir Tela 3...");
                    if (typeof targetNodeToClick.click === 'function') {
                        targetNodeToClick.click();
                        clickToScreen3Successful = true;
                        console.log(`[Tela 2] Clique para Tela 3 executado usando texto: '${foundServiceText}'`);
                    } else {
                        console.error("[Tela 2] Alvo final (childNodes[2]) não tem .click().");
                    }
                } else {
                    console.error("[Tela 2] Estrutura DOM para clique não encontrada após achar o TD.");
                }
            } catch (e) {
                console.error("[Tela 2] Erro durante tentativa de clique:", e);
            }
        } else {
            console.error(`[Tela 2] Nenhum TD encontrado para nenhuma das variações de texto do tipo '${activeBatchServiceTypeKey}'`);
            console.error(`[Tela 2] Textos tentados: ${servicoTextsToTry.join(', ')}`);
        }

        if (clickToScreen3Successful) {
            console.log(`[Tela 2] Clique para Tela 3 bem-sucedido para OS ID: ${activeServiceId}. Tentando fechar Tela 2.`);
            setTimeout(() => {
                console.log("[Tela 2] Executando window.close() após sucesso.");
                window.close();
            }, 1000);
        } else {
            console.error(`[Tela 2] Falha ao clicar para Tela 3 para OS ID: ${activeServiceId}. Sinalizando erro.`);
            await GM_setValue(`${SCRIPT_PREFIX}page2_error_serviceId`, activeServiceId);
            await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
            setTimeout(() => {
                console.log("[Tela 2] Executando window.close() após falha.");
                window.close();
            }, 1500);
        }
    }

    // --- Lógica da Tela 3 MODIFICADA: Com suporte a múltiplas queries de imagem ---
    async function handleTela3() {
        console.log("Script rodando na Tela 3");
        const activeServiceId = await GM_getValue(`${SCRIPT_PREFIX}activeServiceId`);
        const activeBatchServiceTypeKey = await GM_getValue(`${SCRIPT_PREFIX}activeBatchServiceType`);

        if (!activeServiceId || !activeBatchServiceTypeKey) {
            console.log("[Tela 3] Informação de serviço ativo ou tipo de lote ausente. Ignorando.");
            if (window.opener && !window.opener.closed && window.location.href !== URL_TELA_1) {
                console.log("[Tela 3] Aba órfã detectada. Tentando fechar...");
                setTimeout(() => {
                    console.log("[Tela 3] Executando window.close() para aba órfã.");
                    window.close();
                }, 500);
            }
            return;
        }
        console.log(`[Tela 3] Serviço OS ID: ${activeServiceId}, Tipo de Lote: ${activeBatchServiceTypeKey}.`);

        const currentImageSelectors = IMAGE_SELECTORS[activeBatchServiceTypeKey];
        if (!currentImageSelectors) {
            console.error(`[Tela 3] Seletores de imagem para o tipo '${activeBatchServiceTypeKey}' não definidos. Sinalizando erro.`);
            await GM_setValue(`${SCRIPT_PREFIX}page3_completed_serviceId`, activeServiceId);
            await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
            setTimeout(() => {
                console.log("[Tela 3] Executando window.close() devido a seletores de imagem inválidos.");
                window.close();
            }, 1500);
            return;
        }

        const progressDiv = document.createElement('div');
        Object.assign(progressDiv.style, {
            position: 'fixed', top: '10px', left: '10px', padding: '10px',
            background: 'lightyellow', border: '1px solid orange', zIndex: '10000',
            fontSize: '12px', fontFamily: 'Arial, sans-serif'
        });
        document.body.appendChild(progressDiv);

        // Função modificada para tentar múltiplas queries
        function findImageElementWithAlternatives(config) {
            // Primeiro tenta a query principal
            let imgElement = findImageElement(config.query, config.index);
            if (imgElement?.src) {
                return imgElement;
            }

            // Se não encontrou e existem queries alternativas, tenta elas
            if (config.alternativeQueries) {
                for (const altQuery of config.alternativeQueries) {
                    imgElement = findImageElement(altQuery, config.index);
                    if (imgElement?.src) {
                        console.log(`[Tela 3] Imagem encontrada com query alternativa: '${altQuery}'`);
                        return imgElement;
                    }
                }
            }

            return null;
        }

        const imagesToProcess = { ...currentImageSelectors };
        const foundAndDownloading = new Set();
        const downloadPromises = [];
        let pollingInterval_Tela3 = null;
        let pollingAttempts_Tela3 = 0;
        const MAX_POLLING_ATTEMPTS_TELA3 = 45;
        const POLLING_INTERVAL_MS_TELA3 = 1000;
        const notFoundImages = new Set();

        const updateTela3Progress = (message) => {
            if (progressDiv) {
                const notFoundList = notFoundImages.size > 0 ?
                    `<br>Não encontradas: ${Array.from(notFoundImages).join(', ')}` : '';
                progressDiv.innerHTML = `OS ID: ${activeServiceId} (${activeBatchServiceTypeKey})<br>${message}<br>Tentativas: ${pollingAttempts_Tela3}/${MAX_POLLING_ATTEMPTS_TELA3}${notFoundList}`;
            }
            console.log(`[Tela 3 Progresso] ${activeServiceId} (${activeBatchServiceTypeKey}): ${message}`);
        };
        updateTela3Progress("Iniciando busca por imagens...");

        function finalizeImageProcessing() {
            clearInterval(pollingInterval_Tela3);
            updateTela3Progress(`Busca finalizada. Aguardando ${downloadPromises.length} downloads...`);
            Promise.allSettled(downloadPromises).then(async (results) => {
                const successfulDownloads = results.filter(r => r.status === 'fulfilled').length;
                const failedDownloads = results.filter(r => r.status === 'rejected').length;
                const notFoundCount = Object.keys(imagesToProcess).length - foundAndDownloading.size;

                let finalMessage = `Downloads: ${successfulDownloads} sucesso`;
                if (failedDownloads > 0) finalMessage += `, ${failedDownloads} falharam`;
                if (notFoundCount > 0) finalMessage += `, ${notFoundCount} não encontradas`;
                finalMessage += '. Fechando...';

                updateTela3Progress(finalMessage);
                await GM_setValue(`${SCRIPT_PREFIX}page3_completed_serviceId`, activeServiceId);
                await GM_deleteValue(`${SCRIPT_PREFIX}activeServiceId`);
                setTimeout(() => {
                    console.log(`[Tela 3] Processamento finalizado para ${activeServiceId}. Fechando.`);
                    window.close();
                }, 3000);
            });
        }

        function attemptImageDownloads() {
            pollingAttempts_Tela3++;
            for (const key in imagesToProcess) {
                if (foundAndDownloading.has(key)) continue;

                const config = imagesToProcess[key];
                const imgElement = findImageElementWithAlternatives(config);

                if (imgElement?.src) {
                    foundAndDownloading.add(key);
                    notFoundImages.delete(key);
                    const imgSrc = new URL(imgElement.src, window.location.href).href;
                    const filename = `${activeServiceId}_${key.toLowerCase()}.jpg`;
                    updateTela3Progress(`'${key}' encontrada. Baixando ${filename}...`);
                    downloadPromises.push(downloadImageWithGM(imgSrc, filename));
                } else {
                    // Adiciona à lista de não encontradas após algumas tentativas
                    if (pollingAttempts_Tela3 >= 10) {
                        notFoundImages.add(key);
                    }
                }
            }

            if (foundAndDownloading.size === Object.keys(imagesToProcess).length ||
                pollingAttempts_Tela3 >= MAX_POLLING_ATTEMPTS_TELA3) {
                finalizeImageProcessing();
            } else {
                updateTela3Progress(`Buscando... ${foundAndDownloading.size}/${Object.keys(imagesToProcess).length} encontradas.`);
            }
        }

        pollingInterval_Tela3 = setInterval(attemptImageDownloads, POLLING_INTERVAL_MS_TELA3);
        attemptImageDownloads();
    }

    // --- Roteador Principal ---
    async function main() {
        const currentURL = window.location.href;
        if (typeof GM_info !== 'undefined' && GM_info.script) {
            console.log(`URL: ${currentURL}. Script: ${GM_info.script.name} v${GM_info.script.version}`);
        } else {
            console.log(`URL: ${currentURL}. Script info não disponível.`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));

        if (currentURL.includes(URL_TELA_1)) {
            await handleTela1();
        } else if (currentURL.includes(URL_TELA_2)) {
            await handleTela2();
        } else if (currentURL.includes(URL_TELA_3)) {
            await handleTela3();
        } else {
            console.log("URL não corresponde a nenhuma tela configurada.");
        }
    }

    main();
})();