// ==UserScript==
// @name         Upload Images SISCAD (Unified)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatiza o upload de imagens no sistema CEMAR com seleção unificada de arquivos
// @author       Adriel
// @match        http://201.182.66.178:2210/plpt_cemar/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549763/Upload%20Images%20SISCAD%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549763/Upload%20Images%20SISCAD%20%28Unified%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Criar o painel flutuante
    function criarPainelFlutuante() {
        const painel = document.createElement('div');
        painel.style.cssText = `
            position: fixed;
            top: 300px;
            right: 20px;
            background: linear-gradient(145deg, #f6f6f6, #ffffff);
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            z-index: 9999999999999999;
            width: 280px;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        `;

        painel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <h3 style="margin: 0; color: #2c3e50; font-size: 16px;">Upload de Imagens SISCAD</h3>
                <button id="minimizeBtn" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #2c3e50;">➖</button>
            </div>
            <div id="content">
                <div style="margin-bottom: 15px; background: #f9f9f9; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0 0 8px 0; color: #3498db; font-size: 14px;">Selecionar Todos os Arquivos:</h4>
                    <input type="file" id="allFilesInput" multiple accept=".jpg,.jpeg,.png" style="width: 100%; margin-bottom: 8px;">
                    <button id="uploadAllBtn" style="width: 100%; padding: 8px; margin-top: 5px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.3s;">Upload Unificado</button>
                </div>

                <div id="selectedFiles" style="margin-bottom: 10px; font-size: 12px; max-height: 120px; overflow-y: auto; border: 1px solid #eee; padding: 8px; border-radius: 4px;"></div>

                <div id="status" style="margin: 10px 0; font-size: 12px; color: #3498db; background: #ecf0f1; padding: 8px; border-radius: 4px; min-height: 20px;"></div>

                <div style="display: flex; justify-content: space-between; gap: 8px;">
                    <button id="limparBtn" style="flex: 1; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s;">Limpar</button>
                    <button id="versaoBtn" style="flex: 1; padding: 8px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s;">v2.0</button>
                </div>

                <div style="margin-top: 10px; font-size: 12px; display: flex; align-items: center; background: #f9f9f9; padding: 8px; border-radius: 4px;">
                    <input type="checkbox" id="modoManualCheck" style="margin-right: 8px;">
                    <label for="modoManualCheck" style="color: #555;">Modo Manual</label>
                </div>
            </div>
        `;

        document.body.appendChild(painel);
        return painel;
    }

    // Função para log com destaque
    function log(message) {
        console.log(`%c[SISCAD Uploader] ${message}`, 'color: #3498db; font-weight: bold');
    }

    // Função para aguardar
    function esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Função para abrir aba específica (Fotos ou Equipamento)
    async function abrirAba(nomeAba) {
        try {
            log(`Abrindo aba: ${nomeAba}`);
            const aba = Array.from(document.querySelectorAll('span'))
                .find(el => el.textContent.trim() === nomeAba);

            if (!aba) {
                throw new Error(`Aba "${nomeAba}" não encontrada`);
            }

            aba.nextElementSibling.click();
            await esperar(1000); // Aguardar carregamento da aba
            log(`Aba "${nomeAba}" aberta com sucesso`);
            return true;
        } catch (error) {
            console.error(`Erro ao abrir aba "${nomeAba}":`, error);
            return false;
        }
    }

    // Função para clicar no botão de upload específico
    async function clicarBotaoUploadEspecifico(labelTexto) {
        try {
            log(`Procurando botão específico para: ${labelTexto}`);
            let elemento;

            // Seletores específicos com base no tipo de label
            if (['CPF/CNPJ', 'RG', 'Verso', 'Assinatura'].includes(labelTexto)) {
                // Para documentos pessoais na aba Fotos
                elemento = Array.from(document.querySelectorAll('label'))
                    .find(el => el.textContent.trim() === labelTexto);

                if (elemento) {
                    if (labelTexto === 'CPF/CNPJ') {
                        elemento.nextElementSibling.click();
                    } else {
                        elemento.parentElement.children[2].click();
                    }
                }
            } else {
                // Para equipamentos na aba Equipamento
                elemento = Array.from(document.querySelectorAll('label'))
                    .find(el => el.textContent.trim() === labelTexto);

                if (elemento) {
                    elemento.nextElementSibling.click();
                }
            }

            if (!elemento) {
                throw new Error(`Elemento para "${labelTexto}" não encontrado`);
            }

            log(`Botão para "${labelTexto}" clicado com sucesso`);
            await esperar(1000); // Esperar diálogo abrir
            return true;
        } catch (error) {
            console.error(`Erro ao clicar no botão para ${labelTexto}:`, error);
            return false;
        }
    }

    // Função para encontrar o input de arquivo no diálogo
    function encontrarInputArquivo() {
        try {
            log('Procurando botão Abrir...');
            const abrirSpan = Array.from(document.querySelectorAll('span'))
                .find(el => el.textContent.trim() === 'Abrir');

            if (!abrirSpan) {
                throw new Error('Botão Abrir não encontrado');
            }

            const inputElement = abrirSpan.nextElementSibling;
            if (!inputElement) {
                throw new Error('Input após botão Abrir não encontrado');
            }

            // Verificar se é um input ou encontrar o input dentro dele
            const inputFile = inputElement.tagName === 'INPUT' ?
                inputElement :
                inputElement.querySelector('input[type="file"]');

            if (!inputFile) {
                throw new Error('Input de arquivo não encontrado');
            }

            log('Input de arquivo encontrado!');
            return inputFile;
        } catch (error) {
            console.error('Erro ao encontrar input de arquivo:', error);
            return null;
        }
    }

    // Função para encontrar e clicar no botão de enviar
    function clicarBotaoEnviar() {
        try {
            log('Procurando botão Enviar...');
            const enviarSpan = Array.from(document.querySelectorAll('span'))
                .find(el => el.textContent.trim() === 'Enviar');

            if (!enviarSpan) {
                throw new Error('Botão Enviar não encontrado');
            }

            const botaoEnviar = enviarSpan.closest("a");
            if (!botaoEnviar) {
                throw new Error('Elemento clicável para Enviar não encontrado');
            }

            log('Clicando no botão Enviar');
            botaoEnviar.click();
            return true;
        } catch (error) {
            console.error('Erro ao clicar no botão Enviar:', error);
            return false;
        }
    }

    // Função para atualizar status
    function atualizarStatus(mensagem) {
        log(mensagem);
        const statusDiv = document.getElementById('status');
        statusDiv.innerHTML = mensagem;
    }

    // Função para realizar o upload de uma imagem
    async function uploadImagem(tipoAba, labelUpload, arquivo) {
        const modoManual = document.getElementById('modoManualCheck').checked;

        try {
            // Fase 1: Clicar no botão específico
            atualizarStatus(`⏳ Inicializando upload para ${labelUpload}...`);

            // Garantir que estamos na aba correta
            await abrirAba(tipoAba);

            // Clicar no botão correto
            if (!await clicarBotaoUploadEspecifico(labelUpload)) {
                throw new Error(`Não foi possível clicar no botão para ${labelUpload}`);
            }

            await esperar(1000);

            // Fase 2: Encontrar o input de arquivo
            const inputFile = encontrarInputArquivo();
            if (!inputFile) {
                throw new Error(`Input para ${labelUpload} não encontrado`);
            }

            // Se modo manual, aguardar o usuário selecionar o arquivo
            if (modoManual) {
                atualizarStatus(`🖱️ Aguardando seleção manual para ${labelUpload}...`);

                // Criar uma promessa que será resolvida quando o input mudar
                await new Promise(resolve => {
                    const originalOnChange = inputFile.onchange;

                    inputFile.onchange = function(event) {
                        // Chamar o handler original se existir
                        if (originalOnChange) originalOnChange.call(inputFile, event);
                        // Resolver a promessa após um breve delay
                        setTimeout(resolve, 500);
                    };

                    // Destacar o input para o usuário
                    inputFile.style.border = "2px solid #3498db";
                    inputFile.style.padding = "5px";
                    inputFile.style.margin = "5px";

                    // Timeout de segurança após 30 segundos
                    setTimeout(() => {
                        atualizarStatus(`⏱️ Tempo esgotado para ${labelUpload}. Continuando...`);
                        resolve();
                    }, 30000);
                });
            } else {
                // Modo automático: tentar definir o arquivo programaticamente
                try {
                    // Método 1: Usando DataTransfer (abordagem padrão)
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(arquivo);
                    inputFile.files = dataTransfer.files;
                } catch (err) {
                    console.error("Erro ao definir files usando DataTransfer:", err);

                    // Método 2: Definir diretamente (pode funcionar em alguns navegadores)
                    try {
                        inputFile.value = ""; // Limpar primeiro
                        Object.defineProperty(inputFile, 'files', {
                            value: [arquivo],
                            writable: true
                        });
                    } catch (err2) {
                        console.error("Erro ao definir files diretamente:", err2);
                        throw new Error(`Não foi possível atribuir o arquivo ao input para ${labelUpload}`);
                    }
                }
            }

            // Disparar eventos necessários
            try {
                ['change', 'input'].forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    inputFile.dispatchEvent(event);
                });
            } catch (err) {
                console.warn("Erro ao disparar eventos, mas continuando:", err);
            }

            // Aguardar o processamento
            await esperar(2000);

            // Fase 3: Clicar no botão de enviar
            atualizarStatus(`📤 Enviando arquivo para ${labelUpload}...`);
            if (!clicarBotaoEnviar()) {
                throw new Error(`Botão de enviar para ${labelUpload} não encontrado`);
            }

            // Aguardar o upload completar
            await esperar(3000);

            atualizarStatus(`✅ Upload para ${labelUpload} concluído!`);
            return true;
        } catch (error) {
            console.error('Erro no upload:', error);
            atualizarStatus(`❌ Erro no upload de ${labelUpload}: ${error.message}`);
            return false;
        }
    }

    // Função para encontrar arquivos com base em padrões de nome
    function encontrarArquivos(arquivos, tipoArquivo) {
        const mapeamento = {
            // Documentos
            'cpf': null,
            'rg-1': null,
            'rg-2': null,
            'assinatura': null,
            // Equipamentos
            '01': null,
            '02': null,
            '03': null,
            '04': null
        };

        for (let file of arquivos) {
            const fileName = file.name.toLowerCase();

            // Verificar documentos
            if (fileName.includes('_cpf')) mapeamento['cpf'] = file;
            else if (fileName.includes('_rg_01')) mapeamento['rg-1'] = file;
            else if (fileName.includes('_rg_02')) mapeamento['rg-2'] = file;
            else if (fileName.includes('_assinatura')) mapeamento['assinatura'] = file;

            // Verificar equipamentos
            else if (fileName.includes('_inversor')) mapeamento['01'] = file;
            else if (fileName.includes('_caixa')) mapeamento['02'] = file;
            else if (fileName.includes('_sigfi')) mapeamento['03'] = file;
            else if (fileName.includes('_fachada')) mapeamento['04'] = file;
        }

        if (tipoArquivo === 'documentos') {
            return {
                cpf: mapeamento['cpf'],
                frente: mapeamento['rg-1'],
                verso: mapeamento['rg-2'],
                assinatura: mapeamento['assinatura']
            };
        } else if (tipoArquivo === 'equipamentos') {
            return {
                equip1: mapeamento['01'],
                equip2: mapeamento['02'],
                equip3: mapeamento['03'],
                equip4: mapeamento['04']
            };
        }

        return mapeamento;
    }

    // Função para upload unificado
    async function uploadUnificado() {
        const uploadBtn = document.getElementById('uploadAllBtn');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Enviando...';
        uploadBtn.style.background = '#95a5a6';
        atualizarStatus('🚀 Iniciando upload unificado...');

        try {
            const allFiles = document.getElementById('allFilesInput').files;

            if (allFiles.length < 8) {
                throw new Error('Selecione todos os 8 arquivos necessários (4 documentos + 4 equipamentos)');
            }

            // Encontrar os arquivos adequados
            const docs = encontrarArquivos(allFiles, 'documentos');
            const equips = encontrarArquivos(allFiles, 'equipamentos');

            // Verificar se todos os arquivos necessários foram encontrados
            const faltantes = [];
            if (!docs.cpf) faltantes.push('CPF');
            if (!docs.frente) faltantes.push('RG-1 (frente)');
            if (!docs.verso) faltantes.push('RG-2 (verso)');
            if (!docs.assinatura) faltantes.push('Assinatura');
            if (!equips.equip1) faltantes.push('Equipamento 01 (Inversor)');
            if (!equips.equip2) faltantes.push('Equipamento 02 (Caixa)');
            if (!equips.equip3) faltantes.push('Equipamento 03 (SIGFI)');
            if (!equips.equip4) faltantes.push('Equipamento 04 (Fachada)');

            if (faltantes.length > 0) {
                throw new Error(`Arquivos faltantes: ${faltantes.join(', ')}`);
            }

            // Primeira parte: Upload dos documentos
            atualizarStatus('📄 Iniciando upload dos DOCUMENTOS...');
            await uploadImagem('Fotos', 'CPF/CNPJ', docs.cpf);
            await uploadImagem('Fotos', 'RG', docs.frente);
            await uploadImagem('Fotos', 'Verso', docs.verso);
            await uploadImagem('Fotos', 'Assinatura', docs.assinatura);

            // Segunda parte: Upload dos equipamentos
            atualizarStatus('⚙️ Iniciando upload dos EQUIPAMENTOS...');
            await uploadImagem('Equipamento', 'Med/Inver 1', equips.equip1);
            await uploadImagem('Equipamento', 'Med/Inver 2', equips.equip2);
            await uploadImagem('Equipamento', 'Med/Inver 3', equips.equip3);
            await uploadImagem('Equipamento', 'do Lacre', equips.equip4);

            atualizarStatus('🎉 Upload unificado concluído com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            atualizarStatus(`❌ Erro: ${error.message}`);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload Unificado';
            uploadBtn.style.background = '#3498db';
        }
    }

    // Função para limpar os campos
    function limparCampos() {
        document.getElementById('allFilesInput').value = '';
        document.getElementById('selectedFiles').innerHTML = '';
        document.getElementById('status').innerHTML = '';
    }

    // Função para mostrar informações da versão
    function mostrarVersao() {
        const statusDiv = document.getElementById('status');
        statusDiv.innerHTML = `
            <div style="text-align: center;">
                <strong>Upload Images SISCAD v2.0</strong><br>
                Modo unificado para upload de documentos e equipamentos<br>
                <span style="font-size: 10px;">© 2025</span>
            </div>
        `;
    }

    // Função para atualizar a lista de arquivos selecionados
    function atualizarListaArquivos() {
        const allFiles = document.getElementById('allFilesInput').files;
        const selectedFiles = document.getElementById('selectedFiles');

        if (allFiles.length === 0) {
            selectedFiles.innerHTML = '<em>Nenhum arquivo selecionado</em>';
            return;
        }

        // Verificar quais arquivos necessários foram encontrados
        const docs = encontrarArquivos(allFiles, 'documentos');
        const equips = encontrarArquivos(allFiles, 'equipamentos');

        let html = '<strong style="color: #3498db;">Documentos:</strong><br>';
        html += `CPF: ${docs.cpf ? '✅ ' + docs.cpf.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `RG (frente): ${docs.frente ? '✅ ' + docs.frente.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `RG (verso): ${docs.verso ? '✅ ' + docs.verso.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `Assinatura: ${docs.assinatura ? '✅ ' + docs.assinatura.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;

        html += '<br><strong style="color: #3498db;">Equipamentos:</strong><br>';
        html += `01 (Inversor): ${equips.equip1 ? '✅ ' + equips.equip1.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `02 (Caixa): ${equips.equip2 ? '✅ ' + equips.equip2.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `03 (SIGFI): ${equips.equip3 ? '✅ ' + equips.equip3.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;
        html += `04 (Fachada): ${equips.equip4 ? '✅ ' + equips.equip4.name : '❌ <span style="color:#e74c3c">Faltando</span>'}<br>`;

        selectedFiles.innerHTML = html;
    }

    // Inicializar o painel e adicionar eventos
    const painel = criarPainelFlutuante();
    document.getElementById('uploadAllBtn').addEventListener('click', uploadUnificado);
    document.getElementById('limparBtn').addEventListener('click', limparCampos);
    document.getElementById('versaoBtn').addEventListener('click', mostrarVersao);
    document.getElementById('allFilesInput').addEventListener('change', atualizarListaArquivos);

    // Adicionar funcionalidade de arrastar o painel
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    painel.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === painel || e.target.tagName === 'H3') {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, painel);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    // Adicionar funcionalidade de minimizar/ocultar o painel
    const minimizeBtn = document.getElementById('minimizeBtn');
    const content = document.getElementById('content');
    let isMinimized = false;

    minimizeBtn.addEventListener('click', () => {
        if (isMinimized) {
            content.style.display = 'block';
            minimizeBtn.textContent = '➖';
        } else {
            content.style.display = 'none';
            minimizeBtn.textContent = '➕';
        }
        isMinimized = !isMinimized;
    });

    // Inicialização
    atualizarListaArquivos();
    log('SISCAD Uploader Unificado (v2.0) iniciado com sucesso!');
})();