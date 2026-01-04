// ==UserScript==
// @name         DealerQuadro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automação para o quadro de agendamento
// @author       Igor Lima
// @match        https://*.dealernetworkflow.com.br/QuadroAgendamentoMod03/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554091/DealerQuadro.user.js
// @updateURL https://update.greasyfork.org/scripts/554091/DealerQuadro.meta.js
// ==/UserScript==

/*
    Este código foi gerado com ajuda de um modelo de IA. Embora tenha sido projetado para ser funcional,
    pode ser necessário realizar uma revisão, testes ou modificações para atender às suas necessidades específicas.
    Verifique o código quanto à correção e adequação antes de utilizá-lo em ambientes de produção.
*/

(function() {
    'use strict';

    // ============================================
    // CONFIGURAÇÕES PADRÃO
    // ============================================
    const CONFIG_KEY = 'dealerquadro_config';
    let config = {
        empresaNome: "",
        data: "",
        hora: "",
        consultorNome: "",
        agendamentosPorPagina: "15",
        logoUrl: "",
        logoScale: "50"
    };
    // ============================================

    // Carregar configurações salvas
    function carregarConfig() {
        const saved = localStorage.getItem(CONFIG_KEY);
        if (saved) {
            try {
                config = { ...config, ...JSON.parse(saved) };
                console.log('[DealerQuadro] Configurações carregadas');
            } catch (e) {
                console.error('[DealerQuadro] Erro ao carregar configurações:', e);
            }
        }
    }

    // Salvar configurações
    function salvarConfig() {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        console.log('[DealerQuadro] Configurações salvas');
    }

    carregarConfig();

    // Usar valores da config ao invés de constantes
    const EMPRESA_NOME = config.empresaNome;
    const DATA = config.data;
    const HORA = config.hora;
    const CONSULTOR_NOME = config.consultorNome;
    const AGENDAMENTOS_POR_PAGINA = config.agendamentosPorPagina;
    const LOGO_URL = config.logoUrl;
    const LOGO_SCALE = config.logoScale;

    // Configurações de timeout e tentativas
    // A página de vez em quando trava, principalmente se a internet der um pico
    // enquanto o quadro estava mudando de página.
    const TIMEOUT_LOADING = 30000; // 30 segundos
    const TIMEOUT_TRAVAMENTO = 30000; // 30 segundos para detectar travamento
    const MAX_TENTATIVAS_CONSULTA = 10; // Máximo de tentativas se tabela vazia

    // ============================================
    // FIM DAS CONFIGURAÇÕES
    // ============================================

    let loadingTimeout = null;
    let timerTravamento = null;
    let estaCarregando = false;
    const CHAVE_TENTATIVAS = 'tentativasConsulta';

    console.log('[DealerQuadro] Script iniciado');

    // ============================================
    // FUNÇÕES DE VERIFICAÇÃO DE ERROS
    // ============================================

    function verificarErros() {
        const bodyText = document.body.innerText;

        if (document.title.includes('503') || bodyText.includes('503')) {
            console.log('[DealerQuadro] Erro 503 detectado - Recarregando página...');
            setTimeout(() => location.reload(), 2000);
            return true;
        }

        if (bodyText.includes('An error occurred while processing your request')) {
            console.log('[DealerQuadro] Erro de processamento detectado - Recarregando página...');
            setTimeout(() => location.reload(), 2000);
            return true;
        }

        return false;
    }

    if (verificarErros()) {
        return;
    }

    // ============================================
    // FUNÇÕES DE MONITORAMENTO DE TRAVAMENTO
    // ============================================

    function recarregarPorTravamento() {
        console.log('[DealerQuadro] ⚠️ Loading travado há mais de ${TIMEOUT_TRAVAMENTO/100} segundos - Recarregando...');
        location.reload();
    }

    function iniciarTimerTravamento() {
        if (timerTravamento) {
            clearTimeout(timerTravamento);
        }
        timerTravamento = setTimeout(recarregarPorTravamento, TIMEOUT_TRAVAMENTO);
    }

    function pararTimerTravamento() {
        if (timerTravamento) {
            clearTimeout(timerTravamento);
            timerTravamento = null;
        }
    }

    function monitorarElementoCarregamento() {
        const elementoCarregamento = document.getElementById('loading');
        if (!elementoCarregamento) return;

        const estiloComputado = window.getComputedStyle(elementoCarregamento);
        const estaVisivel = estiloComputado.display !== 'none';

        if (estaVisivel && !estaCarregando) {
            estaCarregando = true;
            iniciarTimerTravamento();
            console.log('[DealerQuadro] Loading detectado - Monitorando travamento...');
        } else if (!estaVisivel && estaCarregando) {
            estaCarregando = false;
            pararTimerTravamento();
            console.log('[DealerQuadro] Loading concluído');
        }
    }

    function iniciarMonitoramentoTravamento() {
        const elementoCarregamento = document.getElementById('loading');
        if (!elementoCarregamento) {
            setTimeout(iniciarMonitoramentoTravamento, 1000);
            return;
        }

        monitorarElementoCarregamento();

        const observador = new MutationObserver(() => {
            monitorarElementoCarregamento();
        });

        observador.observe(elementoCarregamento, {
            attributes: true,
            attributeFilter: ['style']
        });

        console.log('[DealerQuadro] ✓ Monitoramento de travamento iniciado');
    }

    // ============================================
    // FUNÇÕES DE CONTROLE DE TENTATIVAS
    // ============================================

    function obterNumeroTentativas() {
        const tentativas = sessionStorage.getItem(CHAVE_TENTATIVAS);
        return tentativas ? parseInt(tentativas) : 0;
    }

    function incrementarTentativas() {
        const novasTentativas = obterNumeroTentativas() + 1;
        sessionStorage.setItem(CHAVE_TENTATIVAS, novasTentativas.toString());
        return novasTentativas;
    }

    function resetarTentativas() {
        sessionStorage.removeItem(CHAVE_TENTATIVAS);
    }

    // ============================================
    // FUNÇÕES DE ESPERA
    // ============================================

    function esperarElemento(seletor, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const elemento = document.querySelector(seletor);
            if (elemento) {
                resolve(elemento);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(seletor);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: elemento ${seletor} não encontrado`));
            }, timeout);
        });
    }

    function esperarLoadingDesaparecer() {
        return new Promise((resolve) => {
            const verificarLoading = () => {
                const loading = document.querySelector('#loading');
                if (!loading) {
                    resolve();
                    return;
                }

                const estiloComputado = window.getComputedStyle(loading);
                const estaVisivel = estiloComputado.display !== 'none';

                if (!estaVisivel) {
                    resolve();
                } else {
                    setTimeout(verificarLoading, 500);
                }
            };
            verificarLoading();
        });
    }

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================

    function obterDataHoje() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // ============================================
    // FUNÇÕES PRINCIPAIS
    // ============================================

    function verificarTabelaERetentar() {
        setTimeout(() => {
            const tabela = document.querySelector('table.table tbody');

            if (tabela) {
                const mensagemVazia = tabela.querySelector('td[colspan="8"]');

                if (mensagemVazia && mensagemVazia.textContent.includes('Nenhum Agendamento encontrado')) {
                    const tentativasAtuais = obterNumeroTentativas();

                    if (tentativasAtuais < MAX_TENTATIVAS_CONSULTA) {
                        const novasTentativas = incrementarTentativas();
                        console.log(`[DealerQuadro] Nenhum agendamento encontrado. Tentativa ${novasTentativas} de ${MAX_TENTATIVAS_CONSULTA}...`);

                        const botaoConsultar = document.querySelector('button[type="submit"].btn.btn-primary.mb-2');
                        if (botaoConsultar && botaoConsultar.textContent.trim() === 'Consultar') {
                            setTimeout(() => {
                                botaoConsultar.click();
                                console.log('[DealerQuadro] Clicando em Consultar novamente...');
                                verificarTabelaERetentar();
                            }, 1000);
                        }
                    } else {
                        console.log(`[DealerQuadro] Máximo de ${MAX_TENTATIVAS_CONSULTA} tentativas atingido.`);
                        resetarTentativas();
                        finalizarConfiguracoes();
                    }
                } else {
                    console.log('[DealerQuadro] ✓ Agendamentos encontrados!');
                    resetarTentativas();
                    finalizarConfiguracoes();
                }
            }
        }, 500);
    }

    function finalizarConfiguracoes() {
        esperarLoadingDesaparecer().then(() => {
            // Configurar agendamentos por página
            if (AGENDAMENTOS_POR_PAGINA) {
                const inputPorPagina = document.getElementById('agendamentosPorPagina');
                if (inputPorPagina) {
                    inputPorPagina.value = AGENDAMENTOS_POR_PAGINA;
                    inputPorPagina.dispatchEvent(new Event('input', { bubbles: true }));
                    inputPorPagina.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('[DealerQuadro] ✓ Agendamentos por página:', AGENDAMENTOS_POR_PAGINA);
                }
            }

            // Trocar logo se especificado
            if (LOGO_URL) {
                const logoDiv = document.getElementById('logo');
                if (logoDiv) {
                    const imgLogo = logoDiv.querySelector('img');
                    if (imgLogo) {
                        imgLogo.src = LOGO_URL;
                        console.log('[DealerQuadro] ✓ Logo customizado aplicado');
                    }
                }
            }

            // Aplicar escala ao logo se especificado
            if (LOGO_SCALE) {
                const logoDiv = document.getElementById('logo');
                if (logoDiv) {
                    const imgLogo = logoDiv.querySelector('img');
                    if (imgLogo) {
                        const aplicarEscala = () => {
                            const scale = parseFloat(LOGO_SCALE) / 100; // Converter porcentagem para decimal
                            if (!isNaN(scale) && scale > 0) {
                                // Aplicar escala à imagem
                                imgLogo.style.transform = `scale(${scale})`;
                                imgLogo.style.transformOrigin = 'center';

                                // Obter dimensões originais da imagem
                                const imgWidth = imgLogo.naturalWidth || imgLogo.width;
                                const imgHeight = imgLogo.naturalHeight || imgLogo.height;

                                // Calcular novos tamanhos
                                const newWidth = imgWidth * scale;
                                const newHeight = imgHeight * scale;

                                // Aplicar ao container
                                logoDiv.style.width = `${newWidth}px`;
                                logoDiv.style.height = `${newHeight}px`;
                                logoDiv.style.display = 'flex';
                                logoDiv.style.alignItems = 'center';
                                logoDiv.style.justifyContent = 'center';
                                logoDiv.style.overflow = 'visible';

                                // Garantir que a imagem não seja cortada
                                imgLogo.style.maxWidth = 'none';
                                imgLogo.style.maxHeight = 'none';

                                console.log('[DealerQuadro] ✓ Escala do logo aplicada:', scale);
                            }
                        };

                        // Se a imagem já estiver carregada, aplicar imediatamente
                        if (imgLogo.complete && imgLogo.naturalWidth > 0) {
                            aplicarEscala();
                        } else {
                            // Caso contrário, aguardar o carregamento
                            imgLogo.addEventListener('load', aplicarEscala);
                            // Fallback: tentar novamente após um tempo
                            setTimeout(aplicarEscala, 500);
                        }
                    }
                }
            }

            // Esconder o painel completo
            const panel = document.querySelector('.panel.panel-default');
            if (panel) {
                panel.style.display = 'none';
                console.log('[DealerQuadro] ✓ Painel escondido');
            }

            console.log('[DealerQuadro] ✅ Configuração concluída com sucesso!');
        });
    }

    function preencherCamposEConsultar() {
        // Preenche data (hoje se não especificado)
        const dataParaUsar = DATA || obterDataHoje();
        const inputData = document.getElementById('inputdata');
        if (inputData) {
            inputData.value = dataParaUsar;
            inputData.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[DealerQuadro] Data preenchida:', dataParaUsar);
        }

        // Preenche hora (opcional)
        if (HORA) {
            const inputHora = document.getElementById('inputhora');
            if (inputHora) {
                inputHora.value = HORA;
                inputHora.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('[DealerQuadro] Hora preenchida:', HORA);
            }
        }

        // Seleciona consultor (opcional)
        if (CONSULTOR_NOME) {
            const selectConsultor = document.getElementById('inputconsultor');
            if (selectConsultor) {
                const opcaoConsultor = Array.from(selectConsultor.options).find(opcao =>
                    opcao.textContent.includes(CONSULTOR_NOME)
                );
                if (opcaoConsultor) {
                    selectConsultor.value = opcaoConsultor.value;
                    console.log('[DealerQuadro] Consultor selecionado:', CONSULTOR_NOME);
                }
            }
        }

        // Clica em Consultar
        const botaoConsultar = document.querySelector('button[type="submit"].btn.btn-primary.mb-2');
        if (botaoConsultar && botaoConsultar.textContent.trim() === 'Consultar') {
            setTimeout(() => {
                botaoConsultar.click();
                console.log('[DealerQuadro] Botão Consultar clicado');
                verificarTabelaERetentar();
            }, 100);
        }
    }

    async function selecionarEmpresa() {
        try {
            console.log('[DealerQuadro] Aguardando select de empresas...');
            const selectEmpresas = await esperarElemento('#inputempresas');

            console.log('[DealerQuadro] Select encontrado, procurando empresa:', EMPRESA_NOME);

            // Encontrar a opção da empresa
            const opcaoEmpresa = Array.from(selectEmpresas.options).find(opcao =>
                opcao.textContent.trim() === EMPRESA_NOME
            );

            if (!opcaoEmpresa) {
                console.error('[DealerQuadro] ✗ Empresa não encontrada:', EMPRESA_NOME);
                console.log('[DealerQuadro] Opções disponíveis:');
                Array.from(selectEmpresas.options).forEach(opcao => {
                    console.log(`  - "${opcao.textContent.trim()}"`);
                });
                return;
            }

            // Selecionar a empresa
            selectEmpresas.value = opcaoEmpresa.value;
            selectEmpresas.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[DealerQuadro] ✓ Empresa selecionada:', EMPRESA_NOME);

            // Encontrar e clicar no botão Selecionar
            const btnSelecionar = document.getElementById('selecionaempresa');
            if (!btnSelecionar) {
                console.error('[DealerQuadro] ✗ Botão Selecionar não encontrado');
                return;
            }

            setTimeout(() => {
                btnSelecionar.click();
                console.log('[DealerQuadro] Botão Selecionar clicado');

                // Aguarda loading e preenche campos
                esperarLoadingDesaparecer().then(() => {
                    if (verificarErros()) return;

                    setTimeout(() => {
                        preencherCamposEConsultar();
                    }, 500);
                });
            }, 100);

        } catch (erro) {
            console.error('[DealerQuadro] Erro:', erro);
        }
    }

    // ============================================
    // INTERFACE DE CONFIGURAÇÃO
    // ============================================

    function criarInterfaceConfig() {
        // Botão flutuante
        const btnConfig = document.createElement('button');
        btnConfig.innerHTML = '⚙️';
        btnConfig.style.cssText = `
            position: fixed;
            bottom: 22px;
            left: 15px;
            width: 25px;
            height: 25px;
            background: transparent;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: transform 0.2s;
            opacity: 1.0;
        `;
        btnConfig.onmouseover = () => btnConfig.style.transform = 'scale(1.1)';
        btnConfig.onmouseout = () => btnConfig.style.transform = 'scale(1)';

        // Modal de configuração
        const modal = document.createElement('div');
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        modalContent.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">⚙️ Configurações DealerQuadro</h3>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Empresa:</label>
                <select id="config-empresa" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Selecione</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Data (deixe vazio para hoje):</label>
                <input type="text" id="config-data" placeholder="DD/MM/YYYY" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Hora:</label>
                <input type="text" id="config-hora" placeholder="Ex: 8:30 PM" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Consultor:</label>
                <select id="config-consultor" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Selecione</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Agendamentos por página:</label>
                <input type="number" id="config-agendamentos" min="10" value="10" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">URL do Logo:</label>
                <input type="text" id="config-logo-url" placeholder="https://exemplo.com/logo.png" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <div id="logo-preview" style="margin-top: 10px; text-align: center; min-height: 100px; border: 1px dashed #ddd; border-radius: 4px; padding: 10px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #999;">Preview do logo aparecerá aqui</span>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Escala do Logo (%):</label>
                <input type="number" id="config-logo-scale" min="10" max="500" value="100" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="config-save" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Salvar
                </button>
                <button id="config-cancel" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Cancelar
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(btnConfig);
        document.body.appendChild(modal);

        // Preencher dropdowns
        function preencherDropdowns() {
            const selectEmpresa = document.getElementById('config-empresa');
            const selectConsultor = document.getElementById('config-consultor');

            // Preencher empresas
            const inputEmpresas = document.getElementById('inputempresas');
            if (inputEmpresas) {
                Array.from(inputEmpresas.options).forEach(option => {
                    if (option.value) {
                        const opt = document.createElement('option');
                        opt.value = option.textContent.trim();
                        opt.textContent = option.textContent.trim();
                        if (opt.value === config.empresaNome) opt.selected = true;
                        selectEmpresa.appendChild(opt);
                    }
                });
            }

            // Preencher consultores
            const inputConsultor = document.getElementById('inputconsultor');
            if (inputConsultor) {
                Array.from(inputConsultor.options).forEach(option => {
                    if (option.value !== "0") {
                        const opt = document.createElement('option');
                        opt.value = option.textContent.trim();
                        opt.textContent = option.textContent.trim();
                        if (opt.value === config.consultorNome) opt.selected = true;
                        selectConsultor.appendChild(opt);
                    }
                });
            }
        }

        // Preencher campos com valores atuais
        function preencherCampos() {
            document.getElementById('config-data').value = config.data;
            document.getElementById('config-hora').value = config.hora;
            document.getElementById('config-agendamentos').value = config.agendamentosPorPagina;
            document.getElementById('config-logo-url').value = config.logoUrl;
            document.getElementById('config-logo-scale').value = config.logoScale;
            atualizarPreview();
        }

        // Atualizar preview do logo
        function atualizarPreview() {
            const logoUrl = document.getElementById('config-logo-url').value;
            const logoScale = document.getElementById('config-logo-scale').value;
            const preview = document.getElementById('logo-preview');

            if (logoUrl) {
                const scale = parseInt(logoScale) / 100;
                preview.innerHTML = `<img src="${logoUrl}" style="max-width: 100%; max-height: 150px; transform: scale(${scale});" onerror="this.parentElement.innerHTML='<span style=color:red>Erro ao carregar imagem</span>'">`;
            } else {
                preview.innerHTML = '<span style="color: #999;">Preview do logo aparecerá aqui</span>';
            }
        }

        // Eventos
        btnConfig.onclick = () => {
            modal.style.display = 'flex';
            preencherDropdowns();
            preencherCampos();
        };

        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };

        document.getElementById('config-cancel').onclick = () => {
            modal.style.display = 'none';
        };

        document.getElementById('config-logo-url').oninput = atualizarPreview;
        document.getElementById('config-logo-scale').oninput = atualizarPreview;

        document.getElementById('config-save').onclick = () => {
            config.empresaNome = document.getElementById('config-empresa').value;
            config.data = document.getElementById('config-data').value;
            config.hora = document.getElementById('config-hora').value;
            config.consultorNome = document.getElementById('config-consultor').value;
            config.agendamentosPorPagina = document.getElementById('config-agendamentos').value;
            config.logoUrl = document.getElementById('config-logo-url').value;
            config.logoScale = document.getElementById('config-logo-scale').value;

            salvarConfig();
            modal.style.display = 'none';

            alert('⚠️ Configurações salvas! Recarregue a página para aplicar as mudanças.');
        };
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    function iniciar() {
        // Verificar se modal está pronto
        const modal = document.querySelector('.modal-content');
        const elementoSelect = document.getElementById('inputempresas');

        if (modal && elementoSelect) {
            const estiloModal = window.getComputedStyle(modal.closest('.modal') || modal);
            if (estiloModal.display !== 'none') {
                selecionarEmpresa();
                return true;
            }
        }
        return false;
    }

    function iniciarScript() {
        if (iniciar()) return;

        // Usar MutationObserver se não estiver pronto
        const observador = new MutationObserver(() => {
            if (iniciar()) {
                observador.disconnect();
            }
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Parar de observar após 10 segundos
        setTimeout(() => observador.disconnect(), 10000);
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            criarInterfaceConfig(); // Criar interface primeiro
            iniciarScript();
            iniciarMonitoramentoTravamento();
        });
    } else {
        criarInterfaceConfig(); // Criar interface primeiro
        iniciarScript();
        iniciarMonitoramentoTravamento();
    }

    // Limpar timers antes de descarregar
    window.addEventListener('beforeunload', () => {
        if (timerTravamento) clearTimeout(timerTravamento);
        if (loadingTimeout) clearTimeout(loadingTimeout);
    });

    // Monitorar erros continuamente
    setInterval(verificarErros, 5000);

})();